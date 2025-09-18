'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Reaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  room_id: string;
  type?: 'message' | 'support' | 'milestone';
  first_name?: string;
  last_name?: string;
  reactions?: Reaction[];
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  toggleReaction: (messageId: string, emoji: string) => Promise<void>;
  typing: string[]; // list of users currently typing
  setTypingStatus: (isTyping: boolean) => void; // to trigger typing updates
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({
  children,
  roomId = 'general',
}: {
  children: ReactNode;
  roomId?: string;
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<string[]>([]);
  const [typingChannel, setTypingChannel] = useState<any>(null);

  // --- Helper: format reactions into grouped counts
  const formatReactions = (
    rawReactions: { emoji: string; user_id: string }[] | null
  ): Reaction[] => {
    if (!rawReactions) return [];
    const grouped: Record<string, { count: number; reactedByMe: boolean }> = {};
    for (const r of rawReactions) {
      if (!grouped[r.emoji]) {
        grouped[r.emoji] = { count: 0, reactedByMe: false };
      }
      grouped[r.emoji].count += 1;
      if (r.user_id === user?.id) {
        grouped[r.emoji].reactedByMe = true;
      }
    }
    return Object.entries(grouped).map(([emoji, { count, reactedByMe }]) => ({
      emoji,
      count,
      reactedByMe,
    }));
  };

  // --- Load all messages (with reactions)
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages_with_reactions')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    const formatted = (data || []).map((m: any) => ({
      ...m,
      reactions: formatReactions(m.reactions),
    }));
    setMessages(formatted);
  };

  // --- Initial fetch
  useEffect(() => {
    loadMessages();
  }, [roomId, user?.id]);

  // --- Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async payload => {
          const { data: enriched } = await supabase
            .from('messages_with_reactions')
            .select('*')
            .eq('id', (payload.new as any).id)
            .single();

          if (enriched) {
            const rawReactions: { emoji: string; user_id: string }[] = (
              Array.isArray(enriched.reactions) ? enriched.reactions : []
            ).map(r => ({
              emoji: (r as any).emoji ?? '',
              user_id: (r as any).user_id ?? '',
            }));

            setMessages(prev => [
              ...prev,
              {
                ...enriched,
                reactions: formatReactions(rawReactions),
                type: (enriched as any).type ?? 'message',
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, user?.id]);

  // --- Subscribe to reaction changes
  useEffect(() => {
    const channel = supabase
      .channel(`reactions:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT + DELETE
          schema: 'public',
          table: 'message_reactions',
        },
        () => {
          // reload messages with updated reactions
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, user?.id]);

  // --- Typing indicators (presence)
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(`typing:${roomId}`, {
      config: { presence: { key: user.id } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const typingUsers: string[] = [];
        for (const [id, metas] of Object.entries(state)) {
          const meta = (metas as any)[0];
          if (meta?.typing && id !== user.id) {
            typingUsers.push(meta.first_name || 'Someone');
          }
        }
        setTyping(typingUsers);
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          channel.track({
            typing: false,
            first_name: user.user_metadata?.first_name || 'User',
          });
        }
      });

    setTypingChannel(channel);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, user?.id]);

  // --- Helper to broadcast typing state
  const setTypingStatus = (isTyping: boolean) => {
    if (typingChannel) {
      typingChannel.track({
        typing: isTyping,
        first_name: user?.user_metadata?.first_name || 'User',
      });
    }
  };

  // --- Send a new message
  const sendMessage = async (text: string) => {
    if (!user) return;

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: user.id,
        message: text,
        room_id: roomId,
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    }

    // stop typing after send
    setTypingStatus(false);
  };

  // --- Toggle reaction (add/remove)
  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    // Try to remove existing reaction
    const { data: existing } = await supabase
      .from('message_reactions')
      .select('id')
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .eq('emoji', emoji)
      .maybeSingle();

    if (existing) {
      // remove reaction
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('id', existing.id);
      if (error) console.error('Error removing reaction:', error);
    } else {
      // add reaction
      const { error } = await supabase.from('message_reactions').insert([
        {
          message_id: messageId,
          user_id: user.id,
          emoji,
        },
      ]);
      if (error) console.error('Error adding reaction:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{ messages, sendMessage, toggleReaction, typing, setTypingStatus }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
