import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ProfessionalCodeGenerator } from '@/utils/ProfessionalCodeGenerator';
import { supabase } from '@/integrations/supabase/client';

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

export const ProfessionalMainDashboard: React.FC<ProfessionalMainDashboardProps> = ({
  professional
}) => {
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
      year: 'numeric'
    });
  };

  const loadAccessHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_sessions')
        .select(`
          id,
          patient_code,
          patient_name,
          access_requested_at,
          consultation_started_at,
          consultation_ended_at,
          consultation_duration_minutes,
          access_granted
        `)
        .eq('professional_id', professional.id)
        .eq('access_granted', true)
        .order('access_requested_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erreur chargement historique:', error);
        return;
      }

      const history: AccessHistoryItem[] = data?.map(session => ({
        id: session.id,
        patientName: session.patient_name || 'Patient',
        patientCode: session.patient_code,
        accessedAt: session.access_requested_at,
        consultationStatus: session.consultation_ended_at 
          ? 'completed' 
          : session.consultation_started_at 
          ? 'started' 
          : 'pending',
        duration: session.consultation_duration_minutes
      })) || [];

      setAccessHistory(history);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  const accessPatientData = async (code: string) => {
    if (!code.trim()) {
      toast({
        title: "⚠️ Code requis",
        description: "Veuillez saisir un code patient",
        variant: "destructive"
      });
      return;
    }

    setIsAccessing(true);
    try {
      // Demander accès aux données patient
      const result = await ProfessionalCodeGenerator.requestPatientDataAccess(
        professional.identificationCode,
        code,
        ['glucose', 'medications', 'meals', 'activities'],
        1
      );

      if (result.success) {
        // Simuler les données patient pour le moment
        const mockPatient: Patient = {
          id: `patient_${code}`,
          firstName: 'Marie',
          lastName: 'Dupont',
          diabetesType: 'Type 2',
          patientCode: code,
          lastGlucose: 142,
          dataAccess: {
            allowedSections: ['glucose', 'medications', 'meals', 'activities'],
            consultationsRemaining: 1,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        };

        setCurrentPatient(mockPatient);
        setPatientCode('');
        
        toast({
          title: "✅ Accès autorisé",
          description: `Données de ${mockPatient.firstName} ${mockPatient.lastName} accessibles`,
        });

        loadAccessHistory();
      } else {
        toast({
          title: "❌ Accès refusé",
          description: result.error || "Code patient invalide ou accès non autorisé",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de l'accès aux données",
        variant: "destructive"
      });
    } finally {
      setIsAccessing(false);
    }
  };

  const startConsultation = async (patientId: string) => {
    try {
      // Créer une session de consultation
      const { data, error } = await supabase
        .from('professional_sessions')
        .insert({
          professional_id: professional.id,
          professional_code: professional.identificationCode,
          patient_code: currentPatient?.patientCode || '',
          patient_name: `${currentPatient?.firstName} ${currentPatient?.lastName}`,
          consultation_started_at: new Date().toISOString(),
          access_granted: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "🩺 Consultation démarrée",
        description: `Consultation avec ${currentPatient?.firstName} ${currentPatient?.lastName}`,
      });

      loadAccessHistory();
    } catch (error) {
      console.error('Erreur démarrage consultation:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de démarrer la consultation",
        variant: "destructive"
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
              <p className="text-primary-foreground/80">{professional.type} • DARE Pro</p>
              <p className="text-sm text-primary-foreground/80">
                🔑 Code: {professional.identificationCode}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className="bg-green-500 hover:bg-green-500 px-4 py-2 mb-2">
              🟢 Vérifié
            </Badge>
            <div className="text-sm text-primary-foreground/80">
              Validité: {formatDate(professional.codeExpiryDate)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Zone saisie code patient */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              🔍 Accès aux Données Patient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Code Patient DARE
                </label>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    value={patientCode}
                    onChange={(e) => setPatientCode(e.target.value.toUpperCase())}
                    placeholder="Ex: ABC123"
                    className="flex-1 text-center font-mono text-lg"
                    maxLength={12}
                  />
                  <Button
                    onClick={() => accessPatientData(patientCode)}
                    disabled={isAccessing || patientCode.length < 3}
                    className="px-6"
                  >
                    {isAccessing ? '⏳' : '🔓'} Accéder
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline"
                  onClick={() => setShowQRScanner(true)}
                  className="text-sm"
                >
                  📱 Scanner QR Code Patient
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
  onCloseAccess
}) => {
  const [consultationNotes, setConsultationNotes] = useState('');

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
              <span className="font-medium">Code Patient:</span> {patient.patientCode}
            </div>
            <div>
              <span className="font-medium">Dernière glycémie:</span> 
              <Badge variant={patient.lastGlucose && patient.lastGlucose > 140 ? "destructive" : "secondary"} className="ml-2">
                {patient.lastGlucose || '--'} mg/dL
              </Badge>
            </div>
            <div>
              <span className="font-medium">Consultations restantes:</span> {patient.dataAccess.consultationsRemaining}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={() => onStartConsultation(patient.id)}
            className="flex-1"
          >
            🩺 Démarrer Consultation
          </Button>
          <Button variant="outline" className="flex-1">
            📊 Voir Historique Glycémique
          </Button>
          <Button variant="outline" className="flex-1">
            💊 Médications
          </Button>
        </div>

        {/* Notes de consultation */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes de consultation</label>
          <textarea
            value={consultationNotes}
            onChange={(e) => setConsultationNotes(e.target.value)}
            placeholder="Saisissez vos observations..."
            className="w-full p-3 border border-input rounded-md resize-none"
            rows={4}
          />
        </div>

        {/* Sections de données accessibles */}
        <div>
          <h4 className="font-medium mb-2">Sections accessibles:</h4>
          <div className="flex flex-wrap gap-2">
            {patient.dataAccess.allowedSections.map((section) => (
              <Badge key={section} variant="secondary">
                {section === 'glucose' && '📈 Glycémie'}
                {section === 'medications' && '💊 Médications'}
                {section === 'meals' && '🍽️ Repas'}
                {section === 'activities' && '🏃 Activités'}
              </Badge>
            ))}
          </div>
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
  onRefresh
}) => {
  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: 'default' as const, text: '✅ Terminée' },
      started: { variant: 'secondary' as const, text: '🔄 En cours' },
      pending: { variant: 'outline' as const, text: '⏳ En attente' }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    return <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>📋 Accès Récents</CardTitle>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            🔄 Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
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
                      {new Date(item.accessedAt).toLocaleString('fr-FR')}
                      {item.duration && ` • Durée: ${item.duration} min`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-4xl block mb-2">📋</span>
            <p>Aucun accès récent</p>
            <p className="text-sm">Vos consultations apparaîtront ici</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalMainDashboard;