import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModerationSystem, type ModerationResult, type ChatMessage } from '@/utils/ModerationSystem';
import { useToast } from '@/hooks/use-toast';

export const useContentModeration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const moderateMessage = async (
    message: ChatMessage, 
    useServerside: boolean = true
  ): Promise<ModerationResult> => {
    setIsLoading(true);

    try {
      // Modération côté client d'abord (rapide)
      const clientResult = await ModerationSystem.moderateMessage(message);

      // Si le contenu est bloqué côté client, pas besoin d'aller plus loin
      if (!clientResult.approved && clientResult.severity === 'critical') {
        const errorMessage = ModerationSystem.formatModerationMessage(clientResult);
        toast({
          title: 'Message bloqué',
          description: errorMessage,
          variant: 'destructive',
        });
        return clientResult;
      }

      // Modération côté serveur pour les cas plus complexes
      if (useServerside && (clientResult.requiresReview || !clientResult.approved)) {
        const { data: serverResult, error } = await supabase.functions.invoke(
          'moderate-content',
          {
            body: {
              message,
              userId: (await supabase.auth.getUser()).data.user?.id,
              sessionId: crypto.randomUUID()
            }
          }
        );

        if (error) {
          console.error('Server moderation error:', error);
          // En cas d'erreur serveur, utiliser le résultat client
          return clientResult;
        }

        if (!serverResult.approved) {
          const errorMessage = ModerationSystem.formatModerationMessage(serverResult);
          toast({
            title: 'Message modéré',
            description: errorMessage,
            variant: serverResult.requiresReview ? 'default' : 'destructive',
          });
        }

        return serverResult;
      }

      return clientResult;

    } catch (error) {
      console.error('Moderation error:', error);
      toast({
        title: 'Erreur de modération',
        description: 'Impossible de vérifier le contenu. Réessayez.',
        variant: 'destructive',
      });
      
      // En cas d'erreur, bloquer par précaution
      return {
        approved: false,
        flags: ['system_error'],
        requiresReview: true,
        severity: 'high'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const moderateGlucoseShare = async (glucoseValue: number, context: string, comment?: string) => {
    const message: ChatMessage = {
      text: comment || `Partage de glycémie: ${glucoseValue} mg/dL (${context})`,
      type: 'glucose_share',
      data: { value: glucoseValue, context, comment }
    };

    return moderateMessage(message);
  };

  const moderateMealPhoto = async (description: string, carbs: number) => {
    const message: ChatMessage = {
      text: description,
      type: 'meal_photo',
      data: { carbs, description }
    };

    return moderateMessage(message);
  };

  const moderateTextMessage = async (text: string) => {
    const message: ChatMessage = {
      text,
      type: 'text'
    };

    return moderateMessage(message);
  };

  return {
    moderateMessage,
    moderateGlucoseShare,
    moderateMealPhoto,
    moderateTextMessage,
    isLoading
  };
};

export default useContentModeration;