import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ProfessionalCodeGenerator } from '@/utils/ProfessionalCodeGenerator';
import { PatientDataTabs } from '@/components/ui/PatientDataTabs';
import { PatientAccessValidator } from '@/utils/PatientAccessValidator';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface Professional {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  country: string;
  identificationCode: string;
  codeExpiryDate: string;
  institution?: string;
  specialty?: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  diabetesType: string;
  patientCode: string;
  lastGlucose?: number;
  dataAccess: {
    allowedSections: string[];
    consultationsRemaining: number;
    expiresAt: string;
  };
}

interface AccessHistoryItem {
  id: string;
  patientName: string;
  patientCode: string;
  accessedAt: string;
  consultationStatus: 'started' | 'completed' | 'pending';
  duration?: number;
}

interface ProfessionalMainDashboardProps {
  professional: Professional;
}

export const ProfessionalMainDashboard: React.FC<
  ProfessionalMainDashboardProps
> = ({ professional }) => {
  const { t } = useTranslation();
  const [patientCode, setPatientCode] = useState('');
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [accessHistory, setAccessHistory] = useState<AccessHistoryItem[]>([]);
  const [isAccessing, setIsAccessing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAccessHistory();
  }, [professional.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const loadAccessHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_sessions')
        .select(
          `
          id,
          patient_code,
          patient_name,
          access_requested_at,
          consultation_started_at,
          consultation_ended_at,
          consultation_duration_minutes,
          access_granted
        `
        )
        .eq('professional_id', professional.id)
        .eq('access_granted', true)
        .order('access_requested_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error(
          t('professionalMainDashboard.errorLoadingHistory'),
          error
        );
        return;
      }

      const history: AccessHistoryItem[] =
        data?.map(session => ({
          id: session.id,
          patientName: session.patient_name || 'Patient',
          patientCode: session.patient_code,
          accessedAt: session.access_requested_at,
          consultationStatus: session.consultation_ended_at
            ? 'completed'
            : session.consultation_started_at
              ? 'started'
              : 'pending',
          duration: session.consultation_duration_minutes,
        })) || [];

      setAccessHistory(history);
    } catch (error) {
      console.error(t('professionalMainDashboard.errorLoadingHistory'), error);
    }
  };

  const accessPatientData = async (code: string) => {
    if (!code.trim()) {
      toast({
        title: t('professionalMainDashboard.codeRequired'),
        description: t('professionalMainDashboard.patientCodeRequired'),
        variant: 'destructive',
      });
      return;
    }

    setIsAccessing(true);
    try {
      // Utiliser le validateur d'accès patient
      const result = await PatientAccessValidator.validateAccess(
        professional.identificationCode,
        code
      );

      if (!result.success || !result.patient) {
        throw new Error(result.error || 'Accès refusé');
      }

      // Créer l'objet patient avec les données validées
      const patientData: Patient = {
        id: result.patient.id,
        firstName: result.patient.firstName,
        lastName: result.patient.lastName,
        diabetesType: result.patient.diabetesType,
        patientCode: result.patient.patientCode,
        lastGlucose: result.patient.lastGlucose || null,
        dataAccess: {
          allowedSections: ['glucose', 'medications', 'meals', 'activities'],
          consultationsRemaining: 1,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      };

      setCurrentPatient(patientData);
      setPatientCode('');

      toast({
        title: t('professionalMainDashboard.accessAuthorized'),
        description: t('professionalMainDashboard.accessGranted', {
          firstName: patientData.firstName,
          lastName: patientData.lastName,
        }),
      });

      loadAccessHistory();
    } catch (error: any) {
      console.error(t('professionalMainDashboard.patientAccessError'), error);
      toast({
        title: t('professionalMainDashboard.accessDenied'),
        description: t('professionalMainDashboard.accessDeniedDescription', {
          error: error.message,
        }),
        variant: 'destructive',
      });
    } finally {
      setIsAccessing(false);
    }
  };

  const startConsultation = async (patientId: string) => {
    if (!currentPatient) {
      toast({
        title: t('professionalMainDashboard.noPatientSelectedTitle'),
        description: t(
          'professionalMainDashboard.noPatientSelectedDescription'
        ),
        variant: 'destructive',
      });
      return;
    }

    try {
      // Créer une session de consultation
      const { data, error } = await supabase
        .from('professional_sessions')
        .insert({
          professional_id: professional.id,
          professional_code: professional.identificationCode,
          patient_code: currentPatient.patientCode,
          patient_name: `${currentPatient.firstName} ${currentPatient.lastName}`,
          consultation_started_at: new Date().toISOString(),
          access_granted: true,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: t('professionalMainDashboard.consultationStartedTitle'),
        description: t(
          'professionalMainDashboard.consultationStartedDescription',
          {
            firstName: currentPatient.firstName,
            lastName: currentPatient.lastName,
          }
        ),
      });

      // Rediriger vers l'interface de téléconsultation
      // TODO: Implémenter la navigation vers TeleconsultationInterface

      loadAccessHistory();
    } catch (error: any) {
      console.error(
        t('professionalMainDashboard.consultationStartError', { error })
      );
      toast({
        title: t('professionalMainDashboard.consultationStartErrorTitle'),
        description: t(
          'professionalMainDashboard.consultationStartErrorDescription'
        ),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header avec identité professionnelle */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dr. {professional.name}</h1>
              <p className="text-primary-foreground/80">
                {professional.type} • KLUKOO Pro
              </p>
              <p className="text-sm text-primary-foreground/80">
                🔑 Code: {professional.identificationCode}
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge className="bg-green-500 hover:bg-green-500 px-4 py-2 mb-2">
              {t('professionalMainDashboard.verifiedStatus')}
            </Badge>
            <div className="text-sm text-primary-foreground/80">
              {t('professionalMainDashboard.validity', {
                date: formatDate(professional.codeExpiryDate),
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Zone saisie code patient */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              {t('professionalMainDashboard.patientDataAccess')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t('professionalMainDashboard.patientCode')}
                </label>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    value={patientCode}
                    onChange={e => setPatientCode(e.target.value.toUpperCase())}
                    placeholder="Ex: ABC123"
                    className="flex-1 text-center font-mono text-lg"
                    maxLength={12}
                  />
                  <Button
                    onClick={() => accessPatientData(patientCode)}
                    disabled={isAccessing || patientCode.length < 3}
                    className="px-6"
                  >
                    {isAccessing ? '⏳' : '🔓'} {t('access')}
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowQRScanner(true)}
                  className="text-sm"
                >
                  📱 {t('scan_qr_code')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient actuel si connecté */}
        {currentPatient && (
          <PatientDataInterface
            patient={currentPatient}
            professional={professional}
            onStartConsultation={startConsultation}
            onCloseAccess={() => setCurrentPatient(null)}
          />
        )}

        {/* Historique accès récents */}
        <RecentAccessHistory
          history={accessHistory}
          onRefresh={loadAccessHistory}
        />
      </div>
    </div>
  );
};

// Composant Interface Données Patient
interface PatientDataInterfaceProps {
  patient: Patient;
  professional: Professional;
  onStartConsultation: (patientId: string) => void;
  onCloseAccess: () => void;
}

const PatientDataInterface: React.FC<PatientDataInterfaceProps> = ({
  patient,
  professional,
  onStartConsultation,
  onCloseAccess,
}) => {
  const [consultationNotes, setConsultationNotes] = useState('');

  const { t } = useTranslation();
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            👤 {patient.firstName} {patient.lastName}
            <Badge variant="outline">{patient.diabetesType}</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCloseAccess}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations patient */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Code Patient:</span>{' '}
              {patient.patientCode}
            </div>
            <div>
              <span className="font-medium">
                {t('professionalMainDashboard.last_glucose')}:
              </span>
              <Badge
                variant={
                  patient.lastGlucose && patient.lastGlucose > 140
                    ? 'destructive'
                    : 'secondary'
                }
                className="ml-2"
              >
                {patient.lastGlucose || '--'} mg/dL
              </Badge>
            </div>
            <div>
              <span className="font-medium">
                {t('professionalMainDashboard.remaining_consultations')}:
              </span>{' '}
              {patient.dataAccess.consultationsRemaining}
            </div>
          </div>
        </div>

        {/* Actions principales */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => onStartConsultation(patient.id)}
            className="flex-1"
          >
            🩺 {t('professionalMainDashboard.start_consultation')}
          </Button>
          <Button variant="outline" onClick={onCloseAccess}>
            ✕ {t('professionalMainDashboard.close_access')}
          </Button>
        </div>

        {/* Onglets données patient */}
        <PatientDataTabs patient={patient} />

        {/* Notes de consultation */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            {t('consultation_notes')}
          </label>
          <textarea
            value={consultationNotes}
            onChange={e => setConsultationNotes(e.target.value)}
            placeholder={t('consultation_notes_placeholder')}
            className="w-full p-3 border border-input rounded-md resize-none"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Composant Historique Accès
interface RecentAccessHistoryProps {
  history: AccessHistoryItem[];
  onRefresh: () => void;
}

const RecentAccessHistory: React.FC<RecentAccessHistoryProps> = ({
  history,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const getStatusBadge = (status: string) => {
    const config = {
      completed: {
        variant: 'default' as const,
        text: t('professionalMainDashboard.status.completed'),
      },
      started: {
        variant: 'secondary' as const,
        text: t('professionalMainDashboard.status.started'),
      },
      pending: {
        variant: 'outline' as const,
        text: t('professionalMainDashboard.status.pending'),
      },
    };

    const statusConfig =
      config[status as keyof typeof config] || config.pending;
    return <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {t('professionalMainDashboard.recentAccess.title')}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            {t('professionalMainDashboard.recentAccess.refresh')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map(item => (
              <div
                key={item.id}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{item.patientName}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.patientCode}
                      </Badge>
                      {getStatusBadge(item.consultationStatus)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {`${new Date(item.accessedAt).toLocaleString('fr-FR')}`}
                      {item.duration &&
                        ` • ${t('professionalMainDashboard.recentAccess.duration', { minutes: item.duration })}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-4xl block mb-2">📋</span>
            <p>{t('professionalMainDashboard.recentAccess.none')}</p>
            <p className="text-sm">
              {t('professionalMainDashboard.recentAccess.info')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalMainDashboard;
