import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  DollarSign, 
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface ProfessionalApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  professional_type: string;
  institution?: string;
  license_number: string;
  country: string;
  city?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Consultation {
  id: string;
  patient_id: string;
  professional_id: string;
  amount_charged: number;
  status: string;
  scheduled_at: string;
  duration_minutes?: number;
}

const AdminTabs = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ProfessionalApplication[]>([
    {
      id: '1',
      first_name: 'Dr. Mamadou',
      last_name: 'Kane',
      email: 'mamadou.kane@hospital.sn',
      professional_type: 'Endocrinologue',
      institution: 'Hôpital Principal de Dakar',
      license_number: 'SN-END-2023-001',
      country: 'Sénégal',
      city: 'Dakar',
      status: 'pending',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      first_name: 'Dr. Fatou',
      last_name: 'Diop',
      email: 'fatou.diop@clinique.sn',
      professional_type: 'Diabétologue',
      institution: 'Clinique Pasteur',
      license_number: 'SN-DIA-2023-002',
      country: 'Sénégal',
      city: 'Thiès',
      status: 'pending',
      created_at: '2024-01-16T14:30:00Z'
    }
  ]);

  const [consultations] = useState<Consultation[]>([
    {
      id: '1',
      patient_id: 'pat_001',
      professional_id: 'prof_001',
      amount_charged: 500,
      status: 'completed',
      scheduled_at: '2024-01-17T09:00:00Z',
      duration_minutes: 30
    },
    {
      id: '2',
      patient_id: 'pat_002',
      professional_id: 'prof_002',
      amount_charged: 750,
      status: 'completed',
      scheduled_at: '2024-01-17T11:00:00Z',
      duration_minutes: 45
    }
  ]);

  const handleApproveApplication = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved' as const }
          : app
      )
    );
    
    toast({
      title: "Candidature approuvée",
      description: "Le professionnel a été approuvé et peut maintenant utiliser DARE Pro.",
    });
  };

  const handleRejectApplication = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'rejected' as const }
          : app
      )
    );
    
    toast({
      title: "Candidature rejetée",
      description: "La candidature a été rejetée.",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'outline' as const, color: 'text-orange-600' },
      approved: { label: 'Approuvé', variant: 'default' as const, color: 'text-green-600' },
      rejected: { label: 'Rejeté', variant: 'destructive' as const, color: 'text-red-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Tabs defaultValue="applications" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="applications" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Candidatures
        </TabsTrigger>
        <TabsTrigger value="consultations" className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Consultations
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Paiements
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Analytiques
        </TabsTrigger>
      </TabsList>

      {/* Candidatures Tab */}
      <TabsContent value="applications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Candidatures de Professionnels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((application) => (
                <div 
                  key={application.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">
                          {application.first_name} {application.last_name}
                        </h4>
                        {getStatusBadge(application.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Spécialité:</span> {application.professional_type}
                        </div>
                        <div>
                          <span className="font-medium">Institution:</span> {application.institution || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Licence:</span> {application.license_number}
                        </div>
                        <div>
                          <span className="font-medium">Localisation:</span> {application.city}, {application.country}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {application.email}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {formatDate(application.created_at)}
                        </div>
                      </div>
                    </div>

                    {application.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* TODO: View details */}}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveApplication(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectApplication(application.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Consultations Tab */}
      <TabsContent value="consultations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Consultations Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div 
                  key={consultation.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          Consultation #{consultation.id.slice(0, 8)}
                        </span>
                        <Badge variant="outline">
                          {consultation.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(consultation.scheduled_at)}
                        {consultation.duration_minutes && ` • ${consultation.duration_minutes} min`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {consultation.amount_charged} F CFA
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Commission: {Math.round(consultation.amount_charged * 0.1)} F CFA
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Paiements Tab */}
      <TabsContent value="payments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Module de Paiement</h3>
              <p className="text-muted-foreground">
                Gestion des paiements aux professionnels et commissions
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Analytiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tableau de Bord Analytique</h3>
              <p className="text-muted-foreground">
                Statistiques détaillées et rapports de performance
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;