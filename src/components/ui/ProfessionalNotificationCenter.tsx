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
    routine_checkup: t(
      'professionalNotificationCenter.consultationReasons.routine_checkup'
    ),
    urgent_consultation: t(
      'professionalNotificationCenter.consultationReasons.urgent_consultation'
    ),
    glucose_management: t(
      'professionalNotificationCenter.consultationReasons.glucose_management'
    ),
    medication_adjustment: t(
      'professionalNotificationCenter.consultationReasons.medication_adjustment'
    ),
    diet_counseling: t(
      'professionalNotificationCenter.consultationReasons.diet_counseling'
    ),
    psychological_support: t(
      'professionalNotificationCenter.consultationReasons.psychological_support'
    ),
    complications: t(
      'professionalNotificationCenter.consultationReasons.complications'
    ),
    follow_up: t(
      'professionalNotificationCenter.consultationReasons.follow_up'
    ),
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
      console.error('Error loading requests', error);
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
            ? t(
                'professionalNotificationCenter.consultation.response.acceptedTitle'
              )
            : t(
                'professionalNotificationCenter.consultation.response.rejectedTitle'
              ),
        description:
          responseType === 'accept'
            ? t(
                'professionalNotificationCenter.consultation.response.acceptedDescription'
              )
            : t(
                'professionalNotificationCenter.consultation.response.rejectedDescription'
              ),
      });

      setDialogOpen(false);
      loadConsultationRequests();
    } catch (error: any) {
      console.error(
        t('professionalNotificationCenter.consultation.response.errorLog'),
        error
      );

      toast({
        title: t(
          'professionalNotificationCenter.consultation.response.errorTitle'
        ),
        description:
          error.message ||
          t(
            'professionalNotificationCenter.consultation.response.errorDescription'
          ),
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
      console.error('Error processing accepted consultation:', error);
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
      console.error('Error adding to calendar:', error);
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
                🩺{' '}
                {t(
                  'professionalNotificationCenter.professionalNotification.title_consultationRequests'
                )}
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
                {t(
                  'professionalNotificationCenter.professionalNotification.newRequests',
                  {
                    count: unreadCount,
                  }
                )}
              </p>
            )}
          </div>

          <ScrollArea className="h-96">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm">
                  {t(
                    'professionalNotificationCenter.professionalNotification.message_noRequests'
                  )}
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
                            ? t(
                                'professionalNotificationCenter.consultationStatus.pending'
                              )
                            : request.status === 'accepted'
                              ? t(
                                  'professionalNotificationCenter.consultationStatus.accepted'
                                )
                              : t(
                                  'professionalNotificationCenter.consultationStatus.rejected'
                                )}
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
                            {t(
                              'professionalNotificationCenter.consultationActions.accept'
                            )}
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
                            {t(
                              'professionalNotificationCenter.consultationActions.reschedule'
                            )}
                          </Button>
                        </div>
                      )}

                      {request.status === 'accepted' && (
                        <Button size="sm" className="w-full">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {t(
                            'professionalNotificationCenter.consultationActions.startChat'
                          )}
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
                ? t(
                    'professionalNotificationCenter.consultationResponse.acceptTitle'
                  )
                : t(
                    'professionalNotificationCenter.consultationResponse.rescheduleTitle'
                  )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-3 bg-muted/30 rounded">
                <p className="text-sm">
                  <strong>
                    {t(
                      'professionalNotificationCenter.consultationDetails.reason'
                    )}
                    :
                  </strong>{' '}
                  {
                    consultationReasons[
                      selectedRequest.consultation_reason as keyof typeof consultationReasons
                    ]
                  }
                </p>
                <p className="text-sm">
                  <strong>
                    {t(
                      'professionalNotificationCenter.consultationDetails.fee'
                    )}
                    :
                  </strong>{' '}
                  {selectedRequest.consultation_fee} F CFA
                </p>
                {selectedRequest.patient_message && (
                  <p className="text-sm">
                    <strong>
                      {t(
                        'professionalNotificationCenter.consultationDetails.message'
                      )}
                      :
                    </strong>{' '}
                    {selectedRequest.patient_message}
                  </p>
                )}
              </div>
            )}

            {responseType === 'reject' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t(
                      'professionalNotificationCenter.consultationResponse.proposedDate'
                    )}
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
                    {t(
                      'professionalNotificationCenter.consultationResponse.proposedTime'
                    )}
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
                {t('consultationResponse.message')}{' '}
                {responseType === 'accept'
                  ? t('consultationResponse.optional')
                  : t('consultationResponse.forPatient')}
              </label>
              <Textarea
                value={responseMessage}
                onChange={e => setResponseMessage(e.target.value)}
                placeholder={
                  responseType === 'accept'
                    ? t(
                        'professionalNotificationCenter.consultationResponse.confirmationPlaceholder'
                      )
                    : t(
                        'professionalNotificationCenter.consultationResponse.reschedulePlaceholder'
                      )
                }
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t('professionalNotificationCenter.common.cancel')}
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
                  ? t('professionalNotificationCenter.common.processing')
                  : responseType === 'accept'
                    ? t(
                        'professionalNotificationCenter.consultationResponse.accept'
                      )
                    : t(
                        'professionalNotificationCenter.consultationResponse.reschedule'
                      )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
