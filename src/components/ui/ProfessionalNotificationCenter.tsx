import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Check,
  Calendar,
  MessageCircle,
  User,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface ConsultationRequest {
  id: string;
  patient_id: string;
  consultation_reason: string;
  patient_message?: string;
  consultation_fee: number;
  status: string;
  requested_at: string;
  professional_response?: string;
  responded_at?: string;
}

interface ProfessionalNotificationCenterProps {
  professionalId: string;
}

export const ProfessionalNotificationCenter: React.FC<
  ProfessionalNotificationCenterProps
> = ({ professionalId }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequest | null>(null);
  const [responseType, setResponseType] = useState<'accept' | 'reject' | null>(
    null
  );
  const [responseMessage, setResponseMessage] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const consultationReasons = {
    routine_checkup: 'Contrôle de routine',
    urgent_consultation: 'Consultation urgente',
    glucose_management: 'Gestion glycémie',
    medication_adjustment: 'Ajustement traitement',
    diet_counseling: 'Conseil nutritionnel',
    psychological_support: 'Soutien psychologique',
    complications: 'Complications diabète',
    follow_up: 'Suivi post-consultation',
  };

  useEffect(() => {
    if (professionalId) {
      loadConsultationRequests();
      setupRealtimeSubscription();
    }
  }, [professionalId]);

  const loadConsultationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select(
          `
          *,
          patient:profiles!consultation_requests_patient_id_fkey(first_name, last_name)
        `
        )
        .eq('professional_id', professionalId)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
      setUnreadCount(data?.filter(req => req.status === 'pending').length || 0);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('consultation_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consultation_requests',
          filter: `professional_id=eq.${professionalId}`,
        },
        () => {
          loadConsultationRequests();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleRequestAction = (
    request: ConsultationRequest,
    action: 'accept' | 'reject'
  ) => {
    setSelectedRequest(request);
    setResponseType(action);
    setResponseMessage('');
    setProposedDate('');
    setProposedTime('');
    setDialogOpen(true);
  };

  const submitResponse = async () => {
    if (!selectedRequest || !responseType) return;

    setLoading(true);
    try {
      let updateData: any = {
        status: responseType === 'accept' ? 'accepted' : 'rejected',
        professional_response: responseMessage,
        responded_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('consultation_requests')
        .update(updateData)
        .eq('id', selectedRequest.id);

      if (error) throw error;

      // Si accepté, démarrer le chat et ajouter aux revenus
      if (responseType === 'accept') {
        await handleAcceptedConsultation(selectedRequest);
      } else {
        // Si refusé avec une date proposée, ajouter au calendrier
        if (proposedDate && proposedTime) {
          await addToCalendar(selectedRequest);
        }
      }

      toast({
        title:
          responseType === 'accept'
            ? 'Consultation acceptée'
            : 'Consultation refusée',
        description:
          responseType === 'accept'
            ? 'Le patient peut maintenant démarrer le chat'
            : 'Le patient a été notifié de votre réponse',
      });

      setDialogOpen(false);
      loadConsultationRequests();
    } catch (error: any) {
      console.error('Erreur réponse:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de traiter la réponse',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptedConsultation = async (request: ConsultationRequest) => {
    try {
      // Créer une téléconsultation
      const { error: consultationError } = await supabase
        .from('teleconsultations')
        .insert({
          professional_id: professionalId,
          patient_id: request.patient_id,
          scheduled_at: new Date().toISOString(),
          amount_charged: request.consultation_fee,
          status: 'confirmed',
          payment_status: 'pending',
        });

      if (consultationError) throw consultationError;

      // Calculer et ajouter les revenus
      const professionalRates = {
        endocrinologist: { rate: 630, percentage: 35 },
        general_practitioner: { rate: 520, percentage: 29 },
        psychologist: { rate: 430, percentage: 24 },
        nurse: { rate: 120, percentage: 7 },
        nutritionist: { rate: 100, percentage: 5 },
      };

      // Obtenir le type de professionnel
      const { data: professionalData } = await supabase
        .from('professional_applications')
        .select('professional_type')
        .eq('id', professionalId)
        .single();

      if (professionalData) {
        const specialtyKey =
          professionalData.professional_type as keyof typeof professionalRates;
        const rateInfo = professionalRates[specialtyKey];

        if (rateInfo) {
          const platformFee = Math.round(request.consultation_fee * 0.1); // 10% de frais plateforme
          const netAmount = request.consultation_fee - platformFee;

          await supabase.from('professional_earnings').insert({
            professional_id: professionalId,
            professional_user_id: user?.id || '',
            teleconsultation_id: '', // Sera mis à jour avec l'ID de la téléconsultation
            gross_amount: request.consultation_fee,
            platform_fee: platformFee,
            net_amount: netAmount,
          });
        }
      }
    } catch (error) {
      console.error('Erreur traitement consultation acceptée:', error);
      throw error;
    }
  };

  const addToCalendar = async (request: ConsultationRequest) => {
    if (!proposedDate || !proposedTime) return;

    try {
      const scheduledDateTime = new Date(`${proposedDate}T${proposedTime}`);

      // Créer une téléconsultation programmée
      const { error } = await supabase.from('teleconsultations').insert({
        professional_id: professionalId,
        patient_id: request.patient_id,
        scheduled_at: scheduledDateTime.toISOString(),
        amount_charged: request.consultation_fee,
        status: 'scheduled',
        payment_status: 'pending',
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur ajout calendrier:', error);
      throw error;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-96 z-50 shadow-lg">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                🩺 {t('professionalNotification.title_consultationRequests')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} demande
                {unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <ScrollArea className="h-96">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm">
                  {t('professionalNotification.message_noRequests')}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {requests.map(request => (
                  <Card
                    key={request.id}
                    className={`p-3 mb-2 ${request.status === 'pending' ? 'border-primary bg-primary/5' : ''}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">
                            Patient #{request.patient_id.slice(-6)}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {consultationReasons[
                              request.consultation_reason as keyof typeof consultationReasons
                            ] || request.consultation_reason}
                          </Badge>
                        </div>
                        <Badge
                          variant={
                            request.status === 'pending'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {request.status === 'pending'
                            ? 'En attente'
                            : request.status === 'accepted'
                              ? 'Acceptée'
                              : 'Refusée'}
                        </Badge>
                      </div>

                      {request.patient_message && (
                        <p className="text-sm text-muted-foreground">
                          "{request.patient_message}"
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{request.consultation_fee} F CFA</span>
                        <span>
                          {formatDistanceToNow(new Date(request.requested_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleRequestAction(request, 'accept')
                            }
                            className="flex-1"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRequestAction(request, 'reject')
                            }
                            className="flex-1"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Reporter
                          </Button>
                        </div>
                      )}

                      {request.status === 'accepted' && (
                        <Button size="sm" className="w-full">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Démarrer le chat
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseType === 'accept'
                ? 'Accepter la consultation'
                : 'Reporter la consultation'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-3 bg-muted/30 rounded">
                <p className="text-sm">
                  <strong>Motif:</strong>{' '}
                  {
                    consultationReasons[
                      selectedRequest.consultation_reason as keyof typeof consultationReasons
                    ]
                  }
                </p>
                <p className="text-sm">
                  <strong>Tarif:</strong> {selectedRequest.consultation_fee} F
                  CFA
                </p>
                {selectedRequest.patient_message && (
                  <p className="text-sm">
                    <strong>Message:</strong> {selectedRequest.patient_message}
                  </p>
                )}
              </div>
            )}

            {responseType === 'reject' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date proposée
                  </label>
                  <Input
                    type="date"
                    value={proposedDate}
                    onChange={e => setProposedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Heure proposée
                  </label>
                  <Input
                    type="time"
                    value={proposedTime}
                    onChange={e => setProposedTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Message{' '}
                {responseType === 'accept' ? '(optionnel)' : 'pour le patient'}
              </label>
              <Textarea
                value={responseMessage}
                onChange={e => setResponseMessage(e.target.value)}
                placeholder={
                  responseType === 'accept'
                    ? 'Message de confirmation...'
                    : 'Expliquez pourquoi vous reportez et proposez une nouvelle date...'
                }
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={submitResponse}
                disabled={
                  loading ||
                  (responseType === 'reject' &&
                    (!proposedDate || !proposedTime))
                }
              >
                {loading
                  ? 'Traitement...'
                  : responseType === 'accept'
                    ? 'Accepter'
                    : 'Reporter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
