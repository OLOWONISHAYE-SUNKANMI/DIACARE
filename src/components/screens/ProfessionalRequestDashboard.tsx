import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare,
  Calendar,
  AlertCircle,
  DollarSign 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface ConsultationRequest {
  id: string;
  patient_id: string;
  professional_id: string;
  professional_code: string;
  consultation_reason: string;
  patient_message?: string;
  status: string;
  consultation_fee: number;
  professional_response?: string;
  requested_at: string;
  responded_at?: string;
  patient?: {
    id: string;
    email: string;
    profiles?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

interface ProfessionalRequestDashboardProps {
  professionalId: string;
}

const ProfessionalRequestDashboard: React.FC<ProfessionalRequestDashboardProps> = ({ 
  professionalId 
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [responseMessages, setResponseMessages] = useState<Record<string, string>>({});
  const [proposedDates, setProposedDates] = useState<Record<string, { date: string; time: string }>>({});

  useEffect(() => {
    loadConsultationRequests();
    
    // Set up real-time subscription for new requests
    const subscription = supabase
      .channel('consultation_requests_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_requests',
          filter: `professional_id=eq.${professionalId}`
        },
        () => {
          loadConsultationRequests();
          // Show notification for new request
          toast({
            title: t('notifications.newRequest'),
            description: t('notifications.newRequestDescription'),
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [professionalId, t]);

  const loadConsultationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .eq('professional_id', professionalId)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading consultation requests:', error);
      toast({
        title: t('errors.loadingError'),
        description: t('errors.requestsLoadError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      // Generate patient access code
      const { data: patientCodeData, error: codeError } = await supabase
        .rpc('generate_patient_access_code');

      if (codeError) throw codeError;

      const request = requests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');

      // Update consultation request status
      const { error: updateError } = await supabase
        .from('consultation_requests')
        .update({
          status: 'accepted',
          professional_response: responseMessages[requestId] || 'Demande acceptée',
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create patient access code for this patient
      const { error: accessError } = await supabase
        .from('patient_access_codes')
        .upsert({
          user_id: request.patient_id,
          access_code: patientCodeData,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h expiry
          is_active: true
        });

      if (accessError) throw accessError;

      // Create teleconsultation entry
      const { error: consultationError } = await supabase
        .from('teleconsultations')
        .insert({
          professional_id: professionalId,
          patient_id: request.patient_id,
          scheduled_at: new Date().toISOString(), // Can be updated later
          status: 'confirmed',
          amount_charged: request.consultation_fee,
          payment_status: 'pending'
        });

      if (consultationError) throw consultationError;

      toast({
        title: t('success.requestAccepted'),
        description: `${t('success.patientCodeGenerated')}: ${patientCodeData}`,
      });

      loadConsultationRequests();
      setResponseMessages(prev => ({ ...prev, [requestId]: '' }));

    } catch (error: any) {
      console.error('Error accepting request:', error);
      toast({
        title: t('errors.acceptError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const proposedDate = proposedDates[requestId];
      let updateData: any = {
        status: 'rejected',
        professional_response: responseMessages[requestId] || 'Demande refusée',
        responded_at: new Date().toISOString()
      };

      // If alternative date is proposed, update status to 'rescheduled'
      if (proposedDate?.date && proposedDate?.time) {
        updateData.status = 'rescheduled';
        updateData.professional_response = `${responseMessages[requestId] || 'Nouvelle date proposée'} - Nouveau créneau: ${new Date(proposedDate.date).toLocaleDateString('fr-FR')} à ${proposedDate.time}`;
      }

      const { error } = await supabase
        .from('consultation_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: proposedDate?.date ? t('success.dateProposed') : t('success.requestRejected'),
        description: proposedDate?.date ? t('success.alternativeDateSent') : t('success.patientNotified'),
      });

      loadConsultationRequests();
      setResponseMessages(prev => ({ ...prev, [requestId]: '' }));
      setProposedDates(prev => ({ ...prev, [requestId]: { date: '', time: '' } }));

    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        title: t('errors.rejectError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: t('status.pending'), variant: 'outline' as const, color: 'text-orange-600', icon: Clock },
      accepted: { label: t('status.accepted'), variant: 'default' as const, color: 'text-green-600', icon: CheckCircle },
      rejected: { label: t('status.rejected'), variant: 'destructive' as const, color: 'text-red-600', icon: XCircle },
      rescheduled: { label: t('status.rescheduled'), variant: 'secondary' as const, color: 'text-blue-600', icon: Calendar },
      completed: { label: t('status.completed'), variant: 'secondary' as const, color: 'text-gray-600', icon: CheckCircle }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getReasonLabel = (reason: string) => {
    const reasons = {
      routine_checkup: t('reasons.routineCheckup'),
      urgent_consultation: t('reasons.urgentConsultation'),
      glucose_management: t('reasons.glucoseManagement'),
      medication_adjustment: t('reasons.medicationAdjustment'),
      diet_counseling: t('reasons.dietCounseling'),
      psychological_support: t('reasons.psychologicalSupport'),
      complications: t('reasons.complications'),
      follow_up: t('reasons.followUp')
    };
    return reasons[reason as keyof typeof reasons] || reason;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="h-32 bg-muted"></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header with notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard.consultationRequests')}</h1>
          <p className="text-muted-foreground">{t('dashboard.managePatientRequests')}</p>
        </div>
        
        {pendingRequests.length > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="font-medium">
              {pendingRequests.length} {t('dashboard.pendingRequests')}
            </span>
          </div>
        )}
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('dashboard.noRequests')}</p>
            <p className="text-sm text-muted-foreground mt-2">{t('dashboard.requestsWillAppear')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const status = getStatusBadge(request.status);
            const StatusIcon = status.icon;
            const isPending = request.status === 'pending';

            return (
              <Card key={request.id} className={isPending ? 'border-orange-200 bg-orange-50/30' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-semibold">
                          {request.patient?.profiles?.first_name || 'Patient'} {request.patient?.profiles?.last_name || ''}
                        </span>
                        <Badge variant={status.variant} className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p><strong>{t('labels.reason')}:</strong> {getReasonLabel(request.consultation_reason)}</p>
                        <p><strong>{t('labels.requestedAt')}:</strong> {new Date(request.requested_at).toLocaleDateString('fr-FR', {
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <DollarSign className="w-4 h-4" />
                        {request.consultation_fee} F CFA
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Patient message */}
                  {request.patient_message && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t('labels.patientMessage')}:</p>
                      <p className="text-sm">{request.patient_message}</p>
                    </div>
                  )}

                  {/* Professional response (if already responded) */}
                  {request.professional_response && (
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">{t('labels.yourResponse')}:</p>
                      <p className="text-sm">{request.professional_response}</p>
                      {request.responded_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('labels.respondedAt')}: {new Date(request.responded_at).toLocaleDateString('fr-FR', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions for pending requests */}
                  {isPending && (
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <Label htmlFor={`response-${request.id}`} className="text-sm font-medium">
                          {t('labels.responseMessage')}
                        </Label>
                        <Textarea
                          id={`response-${request.id}`}
                          value={responseMessages[request.id] || ''}
                          onChange={(e) => setResponseMessages(prev => ({ 
                            ...prev, 
                            [request.id]: e.target.value 
                          }))}
                          placeholder={t('placeholders.responseMessage')}
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      {/* Alternative date proposal for rejection */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`date-${request.id}`} className="text-sm font-medium">
                            {t('labels.alternativeDate')} ({t('labels.optional')})
                          </Label>
                          <Input
                            id={`date-${request.id}`}
                            type="date"
                            value={proposedDates[request.id]?.date || ''}
                            onChange={(e) => setProposedDates(prev => ({
                              ...prev,
                              [request.id]: { ...prev[request.id], date: e.target.value }
                            }))}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`time-${request.id}`} className="text-sm font-medium">
                            {t('labels.alternativeTime')}
                          </Label>
                          <Input
                            id={`time-${request.id}`}
                            type="time"
                            value={proposedDates[request.id]?.time || ''}
                            onChange={(e) => setProposedDates(prev => ({
                              ...prev,
                              [request.id]: { ...prev[request.id], time: e.target.value }
                            }))}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={processingRequest === request.id}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processingRequest === request.id ? t('buttons.processing') : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t('buttons.accept')}
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={processingRequest === request.id}
                          variant="outline"
                          className="flex-1"
                        >
                          {proposedDates[request.id]?.date ? (
                            <>
                              <Calendar className="w-4 h-4 mr-2" />
                              {t('buttons.proposeAlternative')}
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              {t('buttons.reject')}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfessionalRequestDashboard;