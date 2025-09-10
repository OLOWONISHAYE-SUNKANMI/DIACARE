import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  User,
  X,
  Eye,
  Calendar,
  Activity,
  Users,
  Star,
  Video,
  Edit3,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ConsultationRequest {
  id: string;
  patient_id: string;
  consultation_reason: string;
  patient_message: string;
  status: string;
  requested_at: string;
  consultation_fee: number;
  professional_response?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

interface ConsultationNote {
  id: string;
  consultation_id: string;
  patient_id: string;
  notes: string;
  recommendations: string;
  next_appointment_date: string | null;
  created_at: string;
}

interface ProfessionalStats {
  totalPatients: number;
  todayConsultations: number;
  monthlyEarnings: number;
  averageRating: number;
  pendingRequests: number;
}

const ProfessionalDashboardNew = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [consultationNotes, setConsultationNotes] = useState<
    ConsultationNote[]
  >([]);
  const [stats, setStats] = useState<ProfessionalStats>({
    totalPatients: 0,
    todayConsultations: 0,
    monthlyEarnings: 0,
    averageRating: 0,
    pendingRequests: 0,
  });

  // Dialog states
  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequest | null>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showPatientDataDialog, setShowPatientDataDialog] = useState(false);

  // Form states
  const [responseMessage, setResponseMessage] = useState('');
  const [consultationNotesText, setConsultationNotesText] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [nextAppointment, setNextAppointment] = useState('');

  const [loading, setLoading] = useState(true);
  const [professionalInfo, setProfessionalInfo] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Charger les informations du professionnel
      const { data: profData } = await supabase
        .from('professional_applications')
        .select('*')
        .eq('email', user?.email)
        .eq('status', 'approved')
        .single();

      if (profData) {
        setProfessionalInfo(profData);

        // Charger les demandes de consultation
        const { data: requestsData } = await supabase
          .from('consultation_requests')
          .select('*')
          .eq('professional_id', profData.id)
          .order('requested_at', { ascending: false });

        // Charger les statistiques
        await loadStats(profData.id);

        setRequests(requestsData || []);
      }
    } catch (error) {
      console.error('Dashboard loading error:', error);
      toast({
        title: t('dashboard.error_title'),
        description: t('dashboard.error_description'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (professionalId: string) => {
    try {
      // Compter les patients uniques
      const { data: patientsData } = await supabase
        .from('consultation_requests')
        .select('patient_id')
        .eq('professional_id', professionalId)
        .eq('status', 'accepted');

      const uniquePatients = new Set(patientsData?.map(r => r.patient_id) || [])
        .size;

      // Compter les consultations du jour
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData } = await supabase
        .from('consultation_requests')
        .select('id')
        .eq('professional_id', professionalId)
        .gte('requested_at', `${today}T00:00:00`)
        .lte('requested_at', `${today}T23:59:59`);

      // Compter les demandes en attente
      const { data: pendingData } = await supabase
        .from('consultation_requests')
        .select('id')
        .eq('professional_id', professionalId)
        .eq('status', 'pending');

      // Calculer les gains mensuels
      const currentMonth = new Date().getMonth();
      const { data: earningsData } = await supabase
        .from('consultation_requests')
        .select('consultation_fee, created_at')
        .eq('professional_id', professionalId)
        .eq('status', 'completed');

      const monthlyEarnings =
        earningsData
          ?.filter(e => new Date(e.created_at).getMonth() === currentMonth)
          .reduce((sum, e) => sum + (e.consultation_fee || 0), 0) || 0;

      setStats({
        totalPatients: uniquePatients,
        todayConsultations: todayData?.length || 0,
        monthlyEarnings,
        averageRating: 4.8, // Mock data
        pendingRequests: pendingData?.length || 0,
      });
    } catch (error) {
      console.error('Stats loading error:', error);
    }
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;

    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({
          status: 'accepted',
          professional_response: responseMessage,
          responded_at: new Date().toISOString(),
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: t('professionalDashboardNew.requests.accepted_title'),
        description: t(
          'professionalDashboardNew.requests.accepted_description'
        ),
      });

      setShowAcceptDialog(false);
      setResponseMessage('');
      setSelectedRequest(null);
      loadDashboardData();
    } catch (error: any) {
      console.error('Acceptance error:', error);
      toast({
        title: t('requests.error_title'),
        description: error.message || t('requests.error_description'),
        variant: 'destructive',
      });
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({
          status: 'rejected',
          professional_response: responseMessage,
          responded_at: new Date().toISOString(),
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: t('professionalDashboardNew.requests.request_rejected_title'),
        description: t(
          'professionalDashboardNew.requests.request_rejected_description'
        ),
      });

      setShowRejectDialog(false);
      setResponseMessage('');
      setSelectedRequest(null);
      loadDashboardData();
    } catch (error: any) {
      console.error('Refusal error:', error);
      toast({
        title: t('professionalDashboardNew.requests.refusal_error_title'),
        description: t(
          'professionalDashboardNew.requests.refusal_error_description',
          {
            message: error.message,
          }
        ),
        variant: 'destructive',
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest || !consultationNotesText) return;

    try {
      const { error } = await supabase.from('consultation_notes').insert({
        consultation_id: selectedRequest.id,
        professional_id: professionalInfo.id,
        patient_id: selectedRequest.patient_id,
        notes: consultationNotesText,
        recommendations,
        next_appointment_date: nextAppointment || null,
      });

      if (error) throw error;

      // Marquer la consultation comme terminée
      await supabase
        .from('consultation_requests')
        .update({ status: 'completed' })
        .eq('id', selectedRequest.id);

      toast({
        title: t('professionalDashboardNew.consultation.notes_saved_title'),
        description: t(
          'professionalDashboardNew.consultation.notes_saved_description'
        ),
      });

      setShowNotesDialog(false);
      setConsultationNotesText('');
      setRecommendations('');
      setNextAppointment('');
      setSelectedRequest(null);
      loadDashboardData();
    } catch (error: any) {
      console.error('"Error saving notes:"', error);
      toast({
        title: t('consultation.notes_error_title'),
        description: t('consultation.notes_error_description', {
          message: error.message,
        }),
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: {
        label: t('professionalDashboardNew.status.pending'),
        variant: 'outline' as const,
        color: 'text-orange-600',
      },
      accepted: {
        label: t('professionalDashboardNew.status.accepted'),
        variant: 'default' as const,
        color: 'text-green-600',
      },
      rejected: {
        label: t('professionalDashboardNew.status.rejected'),
        variant: 'destructive' as const,
        color: 'text-red-600',
      },
      completed: {
        label: t('professionalDashboardNew.status.completed'),
        variant: 'secondary' as const,
        color: 'text-blue-600',
      },
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const getReasonLabel = (reason: string) => {
    const reasons = {
      routine_checkup: t('professionalDashboardNew.reason.routine_checkup'),
      urgent_consultation: t(
        'professionalDashboardNew.reason.urgent_consultation'
      ),
      glucose_management: t(
        'professionalDashboardNew.reason.glucose_management'
      ),
      medication_adjustment: t(
        'professionalDashboardNew.reason.medication_adjustment'
      ),
      diet_counseling: t('professionalDashboardNew.reason.diet_counseling'),
      psychological_support: t(
        'professionalDashboardNew.reason.psychological_support'
      ),
      complications: t('professionalDashboardNew.reason.complications'),
      follow_up: t('professionalDashboardNew.reason.follow_up'),
    };
    return reasons[reason as keyof typeof reasons] || reason;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!professionalInfo) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">
          {t('professionalDashboardNew.professional_account.not_approved')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dr. {professionalInfo.first_name} {professionalInfo.last_name}
          </h1>
          <p className="text-muted-foreground">
            {professionalInfo.professional_type} • Code:{' '}
            {professionalInfo.professional_code}
          </p>
          <Badge variant="secondary" className="mt-2">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('professionalDashboardNew.status.verified')}
          </Badge>
        </div>

        {stats.pendingRequests > 0 && (
          <Badge variant="destructive">
            <Bell className="w-3 h-3 mr-1" />
            {t('professionalDashboardNew.notifications.pendingRequests', {
              count: stats.pendingRequests,
            })}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            {t('professionalDashboardNew.tabs.dashboard')}
          </TabsTrigger>
          <TabsTrigger value="requests">
            {t('professionalDashboardNew.tabs.requests', {
              count: stats.pendingRequests,
            })}
          </TabsTrigger>
          <TabsTrigger value="patients">
            {t('professionalDashboardNew.tabs.patients')}
          </TabsTrigger>
          <TabsTrigger value="earnings">
            {t('professionalDashboardNew.tabs.earnings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-medical-blue/10 rounded-lg">
                    <Users className="w-6 h-6 text-medical-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('professionalDashboardNew.dashboard.totalPatients')}
                    </p>
                    <p className="text-2xl font-bold">{stats.totalPatients}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-medical-green/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-medical-green" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('professionalDashboardNew.dashboard.today')}
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.todayConsultations}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('professionalDashboardNew.dashboard.monthlyEarnings')}
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.monthlyEarnings.toLocaleString()} F
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('professionalDashboardNew.dashboard.averageRating')}
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.averageRating}/5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demandes récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t('professionalDashboardNew.dashboard.recentRequests')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requests.slice(0, 5).map(request => {
                const status = getStatusBadge(request.status);
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg mb-4 last:mb-0"
                  >
                    <div>
                      <p className="font-medium">
                        Patient #{request.patient_id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getReasonLabel(request.consultation_reason)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.requested_at).toLocaleDateString(
                          'fr-FR'
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant} className={status.color}>
                        {status.label}
                      </Badge>
                      <span className="text-sm font-medium">
                        {request.consultation_fee} F
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('professionalDashboardNew.dashboard.consultationRequests')}
              </CardTitle>
              <CardDescription>
                {t(
                  'professionalDashboardNew.dashboard.manageConsultationRequests'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map(request => {
                    const status = getStatusBadge(request.status);
                    return (
                      <div key={request.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="font-medium">
                                {t(
                                  'professionalDashboardNew.dashboard.patient'
                                )}{' '}
                                #{request.patient_id.slice(0, 8)}
                              </span>
                              <Badge variant="outline">
                                {getReasonLabel(request.consultation_reason)}
                              </Badge>
                            </div>

                            {request.patient_message && (
                              <div className="mt-2 p-3 bg-muted/30 rounded text-sm">
                                <p className="font-medium mb-1">
                                  {t(
                                    'professionalDashboardNew.dashboard.patientMessage'
                                  )}
                                  :
                                </p>
                                <p>{request.patient_message}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                {new Date(
                                  request.requested_at
                                ).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {request.consultation_fee} F
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant={status.variant}
                              className={status.color}
                            >
                              {status.label}
                            </Badge>

                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowAcceptDialog(true);
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            )}

                            {request.status === 'accepted' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowPatientDataDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  {t(
                                    'professionalDashboardNew.dashboard.viewData'
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowNotesDialog(true);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4" />
                                  {t(
                                    'professionalDashboardNew.dashboard.complete'
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t('professionalDashboardNew.dashboard.noRequests')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('professionalDashboardNew.patients.title')}
              </CardTitle>
              <CardDescription>
                {t('professionalDashboardNew.patients.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t('professionalDashboardNew.patients.placeholder')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('professionalDashboardNew.earnings.title')}
              </CardTitle>
              <CardDescription>
                {t('professionalDashboardNew.earnings.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {t('professionalDashboardNew.earnings.monthly')}
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.monthlyEarnings.toLocaleString()} F
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {t('professionalDashboardNew.earnings.pending')}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">0 F</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {t('professionalDashboardNew.earnings.yearly')}
                  </p>
                  <p className="text-2xl font-bold">
                    {(stats.monthlyEarnings * 12).toLocaleString()} F
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('professionalDashboardNew.requests.accept.title')}
            </DialogTitle>
            <DialogDescription>
              {t('professionalDashboardNew.requests.accept.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accept-message">
                {t('professionalDashboardNew.requests.accept.messageLabel')}
              </Label>
              <Textarea
                id="accept-message"
                value={responseMessage}
                onChange={e => setResponseMessage(e.target.value)}
                placeholder={t(
                  'professionalDashboardNew.requests.accept.messagePlaceholder'
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAcceptDialog(false)}
            >
              {t('professionalDashboardNew.common.cancel')}
            </Button>
            <Button onClick={handleAcceptRequest}>
              {t('professionalDashboardNew.common.accept')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('professionalDashboardNew.requests.reject.title')}
            </DialogTitle>
            <DialogDescription>
              {t('professionalDashboardNew.requests.reject.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-message">
                {t('professionalDashboardNew.requests.reject.messageLabel')}
              </Label>
              <Textarea
                id="reject-message"
                value={responseMessage}
                onChange={e => setResponseMessage(e.target.value)}
                placeholder={t(
                  'professionalDashboardNew.requests.reject.messagePlaceholder'
                )}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              {t('professionalDashboardNew.common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectRequest}
              disabled={!responseMessage}
            >
              {t('professionalDashboardNew.common.reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('professionalDashboardNew.consultation.notes.title')}
            </DialogTitle>
            <DialogDescription>
              {t('professionalDashboardNew.consultation.notes.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="consultation-notes">
                {t('professionalDashboardNew.consultation.notes.notesLabel')}
              </Label>
              <Textarea
                id="consultation-notes"
                value={consultationNotesText}
                onChange={e => setConsultationNotesText(e.target.value)}
                placeholder={t(
                  'professionalDashboardNew.consultation.notes.notesPlaceholder'
                )}
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="recommendations">
                {t(
                  'professionalDashboardNew.consultation.notes.recommendationsLabel'
                )}
              </Label>
              <Textarea
                id="recommendations"
                value={recommendations}
                onChange={e => setRecommendations(e.target.value)}
                placeholder={t(
                  'professionalDashboardNew.consultation.notes.recommendationsPlaceholder'
                )}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="next-appointment">
                {t(
                  'professionalDashboardNew.consultation.notes.nextAppointmentLabel'
                )}
              </Label>
              <input
                type="datetime-local"
                id="next-appointment"
                value={nextAppointment}
                onChange={e => setNextAppointment(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
              {t('professionalDashboardNew.common.cancel')}
            </Button>
            <Button onClick={handleSaveNotes} disabled={!consultationNotesText}>
              <FileText className="w-4 h-4 mr-2" />
              {t('professionalDashboardNew.common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPatientDataDialog}
        onOpenChange={setShowPatientDataDialog}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {t('professionalDashboardNew.patientData.title')}
            </DialogTitle>
            <DialogDescription>
              {t('professionalDashboardNew.patientData.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('professionalDashboardNew.patientData.glycemic.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      'professionalDashboardNew.patientData.glycemic.description'
                    )}
                  </p>
                  <Button className="mt-4 w-full" variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    {t('professionalDashboardNew.patientData.glycemic.button')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t(
                      'professionalDashboardNew.patientData.medicalProfile.title'
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      'professionalDashboardNew.patientData.medicalProfile.description'
                    )}
                  </p>
                  <Button className="mt-4 w-full" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    {t(
                      'professionalDashboardNew.patientData.medicalProfile.button'
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('professionalDashboardNew.patientData.nutrition.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      'professionalDashboardNew.patientData.nutrition.description'
                    )}
                  </p>
                  <Button className="mt-4 w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('professionalDashboardNew.patientData.nutrition.button')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('professionalDashboardNew.patientData.activity.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      'professionalDashboardNew.patientData.activity.description'
                    )}
                  </p>
                  <Button className="mt-4 w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    {t('professionalDashboardNew.patientData.activity.button')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <FileText className="w-5 h-5" />
                <span className="font-medium">
                  {t(
                    'professionalDashboardNew.patientData.restrictedAccess.title'
                  )}
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                {t(
                  'professionalDashboardNew.patientData.restrictedAccess.description'
                )}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowPatientDataDialog(false)}>
              {t('professionalDashboardNew.common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalDashboardNew;
