import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MoreVertical, Heart, Users2, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatTimestamp } from '@/utils/FormatTimeStamps';
import { stringToPastelColor } from '@/utils/StringToColor';
import { cn } from '@/lib/utils';

interface ChatScreenProps {
  onBack?: () => void;
}

const availableReactions = ['👍', '❤️', '🔥', '😂', '🙏'];

const ChatScreen = ({ onBack }: ChatScreenProps) => {
  const { t } = useTranslation();
  const { messages, sendMessage, toggleReaction, setTypingStatus, typing } =
    useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const peepSound = useRef<HTMLAudioElement>(
    typeof Audio !== 'undefined' ? new Audio('/sounds/peep.mp3') : null
  );

  const [audioAllowed, setAudioAllowed] = useState(false);
  const lastMessageIdRef = useRef<string | null>(null);

  // --- enable audio after first user interaction
  useEffect(() => {
    const enableAudio = () => setAudioAllowed(true);
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('keydown', enableAudio, { once: true });

    return () => {
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
  }, []);

  // --- play sound for new incoming messages
  useEffect(() => {
    if (!audioAllowed || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.sender_id !== user?.id &&
      lastMessage.id !== lastMessageIdRef.current
    ) {
      lastMessageIdRef.current = lastMessage.id;
      peepSound.current!.currentTime = 0;
      peepSound
        .current!.play()
        .catch(() => console.log('Sound playback failed'));
    }
  }, [messages, audioAllowed]);

  // --- auto-scroll to bottom
  useEffect(() => {
    if (messages.length === 0) return;
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();

      // play sound only for messages not sent by me
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender_id !== user?.id) {
        peepSound.current?.play().catch(() => {
          console.log('Sound playback failed');
        });
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
    setTypingStatus(false);

    toast({
      title: t('chatScreen.messageSent'),
      description: t('chatScreen.messageShared'),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (type: 'support' | 'milestone' | 'message') => {
    switch (type) {
      case 'support':
        return 'bg-medical-green-light border-l-4 border-medical-green';
      case 'milestone':
        return 'bg-gradient-to-r from-medical-teal-light to-medical-blue-light border-l-4 border-medical-teal';
      default:
        return 'bg-card';
    }
  };

  const getMessageIcon = (type: 'support' | 'milestone' | 'message') => {
    switch (type) {
      case 'support':
        return <Stethoscope className="w-4 h-4 text-medical-green" />;
      case 'milestone':
        return <Heart className="w-4 h-4 text-medical-teal" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-medical-teal to-medical-green rounded-full flex items-center justify-center">
                <Users2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-active rounded-full border-2 border-card"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t('chatScreen.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                127 {t('chatScreen.membersConnected')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Community Stats */}
        {/* <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <Badge variant="secondary" className="text-xs">
            {t('chatScreen.successesThisWeek')}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {t('chatScreen.inTargetZone')}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {t('chatScreen.newMembers')}
          </Badge>
        </div> */}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(msg => {
            const isMine = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className="animate-fade-in">
                <div className={`rounded-lg p-4 ${getMessageStyle(msg.type)}`}>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={undefined}
                        alt={isMine ? 'You' : msg.sender_id}
                      />
                      <AvatarFallback
                        className="text-white text-xs"
                        style={{
                          backgroundColor: isMine
                            ? '#00b894' // teal for yourself
                            : stringToPastelColor(msg.sender_id),
                        }}
                      >
                        {isMine
                          ? 'ME'
                          : `${msg.first_name?.[0] ?? ''}${
                              msg.last_name?.[0] ?? ''
                            }`.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">
                          {isMine
                            ? 'You'
                            : `${msg.first_name ?? ''} ${
                                msg.last_name ?? ''
                              }`.trim() || 'User'}
                        </span>

                        {getMessageIcon(msg.type)}
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(msg.created_at)}
                        </span>
                      </div>

                      <p className="text-foreground text-sm leading-relaxed">
                        {msg.message}
                      </p>

                      {/* Reactions */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {msg.reactions?.map(r => (
                          <Button
                            key={r.emoji}
                            size="sm"
                            variant={r.reactedByMe ? 'default' : 'outline'}
                            className="h-6 px-2 text-xs"
                            onClick={() => toggleReaction(msg.id, r.emoji)}
                          >
                            {r.emoji} {r.count}
                          </Button>
                        ))}

                        {/* Reaction Picker */}
                        <div className="flex gap-1">
                          {availableReactions.map(emoji => (
                            <Button
                              key={emoji}
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs"
                              onClick={() => toggleReaction(msg.id, emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {typing.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse delay-400"></div>
              </div>
              {t('chatScreenFixes.typingIndicator', {
                users: typing.join(', '),
              })}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={e => {
                setNewMessage(e.target.value);
                setTypingStatus(e.target.value.length > 0);
              }}
              onBlur={() => setTypingStatus(false)}
              onKeyPress={handleKeyPress}
              placeholder={t('chatScreen.typingMessage')}
              className="border-0 bg-background focus-visible:ring-1 focus-visible:ring-ring text-accent-foreground"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-medical-teal hover:bg-medical-teal/90 text-white h-10 w-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{t('chatScreen.kindness')}</span>
          <span>•</span>
          <span>{t('chatScreen.mutualHelp')}</span>
          <span>•</span>
          <span>{t('chatScreen.sharedMotivation')}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
