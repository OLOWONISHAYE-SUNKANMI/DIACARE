import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AutoMessaging, { type MessageType, type ScheduleFrequency } from '@/utils/AutoMessaging';

export interface AutoMessage {
  id: string;
  type: MessageType;
  content: string;
  reactions: string[];
  sent_at: string;
  metadata?: Record<string, any>;
}

export const useAutoMessaging = () => {
  const [messages, setMessages] = useState<AutoMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRecentMessages();
  }, []);

  const loadRecentMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the edge function to get recent automated messages
      const { data, error } = await supabase.functions.invoke('auto-messaging-scheduler', {
        body: { action: 'get_recent', limit: 50 }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMotivationalMessage = async (): Promise<boolean> => {
    try {
      const motivation = await AutoMessaging.getRandomMotivation();
      
      const { data, error } = await supabase.functions.invoke('auto-messaging-scheduler', {
        body: {
          action: 'send_scheduled_message',
          payload: {
            message_type: 'daily_motivation',
            content: motivation,
            reactions: ['💪', '❤️', '👏'],
            metadata: {
              source: 'manual_trigger',
              timestamp: new Date().toISOString()
            }
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: 'Message envoyé',
          description: 'Message motivationnel envoyé avec succès !',
        });
        await loadRecentMessages();
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error sending motivational message:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message motivationnel',
        variant: 'destructive',
      });
      return false;
    }
  };

  const sendEducationalMessage = async (): Promise<boolean> => {
    try {
      const tip = await AutoMessaging.getRandomEducationalTip();
      
      const { data, error } = await supabase.functions.invoke('auto-messaging-scheduler', {
        body: {
          action: 'send_scheduled_message',
          payload: {
            message_type: 'educational',
            content: tip,
            reactions: ['📚', '👍', '💡'],
            metadata: {
              source: 'manual_trigger',
              timestamp: new Date().toISOString()
            }
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: 'Conseil envoyé',
          description: 'Conseil éducatif envoyé avec succès !',
        });
        await loadRecentMessages();
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error sending educational message:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le conseil éducatif',
        variant: 'destructive',
      });
      return false;
    }
  };

  const sendCelebrationMessage = async (userName: string, celebrationType: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('auto-messaging-scheduler', {
        body: {
          action: 'create_celebration',
          payload: {
            user_name: userName,
            celebration_type: celebrationType
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: 'Célébration envoyée',
          description: `Message de félicitations envoyé pour ${userName} !`,
        });
        await loadRecentMessages();
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error sending celebration message:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message de célébration',
        variant: 'destructive',
      });
      return false;
    }
  };

  const checkDueMessages = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('auto-messaging-scheduler', {
        body: { action: 'check_due_messages' }
      });

      if (error) {
        throw error;
      }

      if (data?.success && data.processed > 0) {
        toast({
          title: 'Messages programmés',
          description: `${data.processed} message(s) envoyé(s) automatiquement`,
        });
        await loadRecentMessages();
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error checking due messages:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de vérifier les messages programmés',
        variant: 'destructive',
      });
      return false;
    }
  };

  const triggerHelpfulMessages = async (): Promise<boolean> => {
    try {
      const { motivation, educational } = await AutoMessaging.triggerHelpfulMessages();
      
      // Send both messages
      const motivationSent = await sendMotivationalMessage();
      const educationalSent = await sendEducationalMessage();

      if (motivationSent || educationalSent) {
        toast({
          title: 'Messages utiles envoyés',
          description: 'Messages motivationnels et éducatifs envoyés !',
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error triggering helpful messages:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer les messages utiles',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMotivationalMessage,
    sendEducationalMessage,
    sendCelebrationMessage,
    checkDueMessages,
    triggerHelpfulMessages,
    reload: loadRecentMessages
  };
};