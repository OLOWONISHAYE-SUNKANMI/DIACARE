import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  User,
  UserCheck,
  Phone,
  VideoIcon,
  Mic,
  MicOff,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  sender_id: string;
  sender_role: 'patient' | 'professional';
  message: string;
  created_at: string;
}

interface ConsultationChatProps {
  consultationId: string;
  patientId: string;
  professionalId: string;
  onEndConsultation?: () => void;
}

export const ConsultationChat: React.FC<ConsultationChatProps> = ({
  consultationId,
  patientId,
  professionalId,
  onEndConsultation,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [consultationStatus, setConsultationStatus] = useState<
    'waiting' | 'active' | 'ended'
  >('waiting');
  const [duration, setDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  const isPatient = user?.id === patientId;
  const isProfessional = user?.id !== patientId;

  useEffect(() => {
    initializeChat();
    setupRealtimeSubscription();

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [consultationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (consultationStatus === 'active') {
      durationInterval.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [consultationStatus]);

  const initializeChat = async () => {
    try {
      // Vérifier le statut de la consultation
      const { data: consultation, error: consultationError } = await supabase
        .from('teleconsultations')
        .select('status, started_at')
        .eq('id', consultationId)
        .single();

      if (consultationError) throw consultationError;

      if (consultation) {
        if (consultation.status === 'in_progress') {
          setConsultationStatus('active');
          if (consultation.started_at) {
            const startTime = new Date(consultation.started_at);
            const now = new Date();
            setDuration(
              Math.floor((now.getTime() - startTime.getTime()) / 1000)
            );
          }
        } else if (consultation.status === 'completed') {
          setConsultationStatus('ended');
        }
      }

      // Charger les messages existants
      loadMessages();
      setIsConnected(true);
    } catch (error) {
      console.error(t('consultationChat.Chat.initError'), error);

      toast({
        title: t('consultationChat.Chat.errorTitle'),
        description: t('consultationChat.Chat.errorDescription'),
        variant: 'destructive',
      });
    }
  };

  const loadMessages = async () => {
    // Simuler des messages pour le prototype
    setMessages([
      {
        id: '1',
        sender_id: patientId,
        sender_role: 'patient',
        message: t('consultationChat.Chat.messages.initialPatientMessage'),
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const setupRealtimeSubscription = () => {
    // Simuler les mises à jour en temps réel pour le prototype
    console.log(
      'Subscription en temps réel configurée pour la consultation:',
      consultationId
    );
    return () => {
      console.log('Subscription fermée');
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Simuler l'envoi de message pour le prototype
    const message: Message = {
      id: Date.now().toString(),
      sender_id: user?.id || '',
      sender_role: isPatient ? 'patient' : 'professional',
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    toast({
      title: t('consultationChat.Chat.toast.sentTitle'),
      description: t('consultationChat.Chat.toast.sentDescription'),
    });
  };

  const startConsultation = async () => {
    if (!isProfessional) return;

    try {
      const { error } = await supabase
        .from('teleconsultations')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', consultationId);

      if (error) throw error;

      setConsultationStatus('active');
      setDuration(0);

      toast({
        title: t('consultationChat.Consultation.start.successTitle'),
        description: t(
          'consultationChat.Consultation.start.successDescription'
        ),
      });
    } catch (error) {
      console.error(t('consultationChat.Consultation.start.errorLog'), error);
      toast({
        title: t('consultationChat.Consultation.start.errorTitle'),
        description: t('consultationChat.Consultation.start.errorDescription'),
        variant: 'destructive',
      });
    }
  };

  const endConsultation = async () => {
    if (!isProfessional) return;

    try {
      const { error } = await supabase
        .from('teleconsultations')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
          duration_minutes: Math.floor(duration / 60),
        })
        .eq('id', consultationId);

      if (error) throw error;

      setConsultationStatus('ended');

      // Traiter le paiement automatiquement
      try {
        await supabase.functions.invoke('process-consultation-payment', {
          body: { consultation_id: consultationId, action: 'confirm_payment' },
        });
      } catch (paymentError) {
        console.error('Erreur paiement:', paymentError);
      }

      toast({
        title: t('consultationChat.Consultation.complete.successTitle'),
        description: t(
          'consultationChat.Consultation.complete.successDescription'
        ),
      });

      onEndConsultation?.();
    } catch (error) {
      console.error('Erreur fin consultation:', error);
      toast({
        title: t('consultationChat.Consultation.complete.errorTitle'),
        description: t(
          'consultationChat.Consultation.complete.errorDescription'
        ),
        variant: 'destructive',
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {t('consultationChat.Chat.title')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected
                ? t('consultationChat.Connection.status.connected')
                : t('consultationChat.Connection.status.disconnected')}
            </Badge>
            {consultationStatus === 'active' && (
              <Badge variant="outline">{formatDuration(duration)}</Badge>
            )}
          </div>
        </div>

        {consultationStatus === 'waiting' && isProfessional && (
          <Button onClick={startConsultation} className="mt-2">
            {t('consultationChat.Consultation.button.start')}
          </Button>
        )}

        {consultationStatus === 'active' && (
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <VideoIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Mic className="h-4 w-4" />
            </Button>
            {isProfessional && (
              <Button variant="destructive" size="sm" onClick={endConsultation}>
                {t('consultationChat.Consultation.button.end')}
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-2 max-w-[70%] ${message.sender_id === user?.id ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.sender_role === 'patient' ? 'P' : 'Dr'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {consultationStatus !== 'ended' && (
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={t('consultationChat.Chat.input.placeholder')}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              disabled={consultationStatus === 'waiting'}
            />

            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || consultationStatus === 'waiting'}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}

        {consultationStatus === 'ended' && (
          <div className="text-center text-muted-foreground py-4">
            <p>{t('consultationChat.Consultation.status.finished')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
