import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, User, DollarSign, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface Professional {
  id: string;
  first_name: string;
  last_name: string;
  professional_type: string;
  professional_code: string;
  status: string;
  specialty?: string;
}

interface ConsultationRequest {
  id: string;
  professional_id: string;
  consultation_reason: string;
  status: string;
  requested_at: string;
  consultation_fee: number;
  professional_response?: string;
  responded_at?: string;
}

const ConsultationRequest = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [consultationReason, setConsultationReason] = useState<string>('');
  const [patientMessage, setPatientMessage] = useState<string>('');
  const [myRequests, setMyRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const consultationReasons = [
    { value: 'routine_checkup', label: t("consultation.request.input2.writeup.options.one")},
    { value: 'urgent_consultation', label: t("consultation.request.input2.writeup.options.two") },
    { value: 'glucose_management', label: t("consultation.request.input2.writeup.options.three") },
    { value: 'medication_adjustment', label: t("consultation.request.input2.writeup.options.four") },
    { value: 'diet_counseling', label: t("consultation.request.input2.writeup.options.five") },
    { value: 'psychological_support', label: t("consultation.request.input2.writeup.options.six") },
    { value: 'complications', label: t("consultation.request.input2.writeup.options.seven") },
    { value: 'follow_up', label: t("consultation.request.input2.writeup.options.eight") }
  ];

  const professionalRates = {
    'endocrinologist': { rate: 630, percentage: 35 },
    'general_practitioner': { rate: 520, percentage: 29 },
    'psychologist': { rate: 430, percentage: 24 },
    'nurse': { rate: 120, percentage: 7 },
    'nutritionist': { rate: 100, percentage: 5 }
  };

  useEffect(() => {
    loadProfessionals();
    if (user) {
      loadMyRequests();
    }
  }, [user]);

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_applications')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Erreur chargement professionnels:', error);
    }
  };

  const loadMyRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select(`
          *,
          professional:professional_applications(first_name, last_name, professional_type)
        `)
        .eq('patient_id', user?.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setMyRequests(data || []);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedProfessional || !consultationReason || !user) {
      toast({
        title: "Champs requis",
        description: "Veuillez sélectionner un professionnel et un motif de consultation.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const professional = professionals.find(p => p.id === selectedProfessional);
      if (!professional) throw new Error('Professionnel non trouvé');

      // Calculer le tarif selon le nouveau système
      const specialtyKey = professional.professional_type as keyof typeof professionalRates;
      const rateInfo = professionalRates[specialtyKey];
      const consultationFee = rateInfo ? rateInfo.rate : 500; // Défaut 500 F

      const { error } = await supabase
        .from('consultation_requests')
        .insert({
          patient_id: user.id,
          professional_id: selectedProfessional,
          professional_code: professional.professional_code,
          consultation_reason: consultationReason,
          patient_message: patientMessage,
          consultation_fee: consultationFee,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Le professionnel recevra une notification et vous répondra bientôt.",
      });

      // Reset form
      setSelectedProfessional('');
      setConsultationReason('');
      setPatientMessage('');
      
      // Recharger les demandes
      loadMyRequests();

    } catch (error: any) {
      console.error('Erreur envoi demande:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer la demande",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'outline' as const, color: 'text-orange-600' },
      accepted: { label: 'Acceptée', variant: 'default' as const, color: 'text-green-600' },
      rejected: { label: 'Refusée', variant: 'destructive' as const, color: 'text-red-600' },
      completed: { label: 'Terminée', variant: 'secondary' as const, color: 'text-blue-600' }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getProfessionalDisplayName = (type: string) => {
    const names = {
      'endocrinologist': 'Endocrinologue',
      'general_practitioner': 'Médecin généraliste', 
      'psychologist': 'Psychologue',
      'nurse': 'Infirmier(ère)',
      'nutritionist': 'Nutritionniste'
    };
    return names[type as keyof typeof names] || type;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          💊 {t("consultation.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("consultation.subtitle")}
        </p>
      </div>

      {/* Nouvelle demande de consultation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            {t("consultation.request.title")}
          </CardTitle>
          <CardDescription>
            {t("consultation.request.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection du professionnel */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("consultation.request.input1.title")}
            </label>
            <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={t("consultation.request.input1.writeup")} />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                {professionals.map((prof) => {
                  const rateInfo = professionalRates[prof.professional_type as keyof typeof professionalRates];
                  return (
                    <SelectItem key={prof.id} value={prof.id}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className="font-medium">
                            Dr. {prof.first_name} {prof.last_name}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {getProfessionalDisplayName(prof.professional_type)}
                          </span>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {rateInfo?.rate || 500} F ({rateInfo?.percentage || 0}%)
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Motif de consultation */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("consultation.request.input2.title")}
            </label>
            <Select value={consultationReason} onValueChange={setConsultationReason}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={t("consultation.request.input2.writeup.title")} />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                {consultationReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message optionnel */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("consultation.request.input3.title")}
            </label>
            <Textarea
              value={patientMessage}
              onChange={(e) => setPatientMessage(e.target.value)}
              placeholder={t("consultation.request.input3.writeup")}
              rows={4}
            />
          </div>

          {/* Affichage du tarif */}
          {selectedProfessional && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-medical-green" />
                  <span className="font-medium">Tarif consultation</span>
                </div>
                <div className="text-right">
                  {(() => {
                    const prof = professionals.find(p => p.id === selectedProfessional);
                    const rateInfo = prof ? professionalRates[prof.professional_type as keyof typeof professionalRates] : null;
                    return (
                      <>
                        <p className="font-bold text-medical-green">
                          {rateInfo?.rate || 500} F CFA
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ({rateInfo?.percentage || 0}% du forfait mensuel)
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSubmitRequest}
            disabled={loading || !selectedProfessional || !consultationReason}
            className="w-full"
            size="lg"
          >
            {loading ? (
              "Envoi en cours..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {t("consultation.button")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Mes demandes de consultation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t("consultationRequest.title")}
          </CardTitle>
          <CardDescription>
            {t("consultationRequest.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myRequests.length > 0 ? (
            <div className="space-y-4">
              {myRequests.map((request) => {
                const status = getStatusBadge(request.status);
                const reason = consultationReasons.find(r => r.value === request.consultation_reason);
                
                return (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            Dr. {(request as any).professional?.first_name} {(request as any).professional?.last_name}
                          </span>
                          <Badge variant="outline">
                            {getProfessionalDisplayName((request as any).professional?.professional_type)}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Motif:</p>
                          <p className="font-medium">{reason?.label || request.consultation_reason}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Demandé le: {new Date(request.requested_at).toLocaleDateString('fr-FR')}</span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {request.consultation_fee} F
                          </span>
                        </div>

                        {request.professional_response && (
                          <div className="mt-3 p-3 bg-muted/30 rounded">
                            <p className="text-sm text-muted-foreground">Réponse du professionnel:</p>
                            <p className="mt-1">{request.professional_response}</p>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <Badge variant={status.variant} className={status.color}>
                          {status.label}
                        </Badge>
                        {request.status === 'accepted' && (
                          <div className="mt-2">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Rejoindre
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
              <p className="text-muted-foreground">{t("consultationRequest.request.noRequest")}</p>
              <p className="text-sm text-muted-foreground">
                {t("consultationRequest.request.procedure")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationRequest;