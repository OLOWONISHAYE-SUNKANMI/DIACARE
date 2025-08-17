import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, DollarSign, Star, Users, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Teleconsultation {
  id: string;
  patient_id: string;
  scheduled_at: string;
  duration_minutes: number | null;
  status: string;
  amount_charged: number | null;
  rating: number | null;
  patient_feedback: string | null;
}

interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  consultationsCount: number;
  averageRating: number;
}

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Teleconsultation[]>([]);
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0,
    thisMonth: 0,
    consultationsCount: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Charger les consultations
      const { data: consultationsData } = await supabase
        .from('teleconsultations')
        .select('*')
        .order('scheduled_at', { ascending: false })
        .limit(10);

      // Charger les gains
      const { data: earningsData } = await supabase
        .from('professional_earnings')
        .select('net_amount, created_at');

      if (consultationsData) setConsultations(consultationsData);

      if (earningsData) {
        const total = earningsData.reduce((sum, earning) => sum + earning.net_amount, 0);
        const thisMonth = earningsData
          .filter(earning => new Date(earning.created_at).getMonth() === new Date().getMonth())
          .reduce((sum, earning) => sum + earning.net_amount, 0);

        const ratings = consultationsData?.filter(c => c.rating).map(c => c.rating) || [];
        const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r!, 0) / ratings.length : 0;

        setEarnings({
          totalEarnings: total,
          thisMonth,
          consultationsCount: consultationsData?.length || 0,
          averageRating: avgRating
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Programmée', variant: 'outline' as const, color: 'text-blue-600' },
      in_progress: { label: 'En cours', variant: 'default' as const, color: 'text-green-600' },
      completed: { label: 'Terminée', variant: 'secondary' as const, color: 'text-green-600' },
      cancelled: { label: 'Annulée', variant: 'destructive' as const, color: 'text-red-600' },
      no_show: { label: 'Absence', variant: 'destructive' as const, color: 'text-orange-600' }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord professionnel</h1>
          <p className="text-muted-foreground">Gérez vos consultations et suivez vos revenus</p>
        </div>
        <Button className="bg-medical-green hover:bg-medical-green/90">
          <Video className="w-4 h-4 mr-2" />
          Démarrer consultation
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-medical-green/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-medical-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenus totaux</p>
                <p className="text-2xl font-bold">{earnings.totalEarnings.toLocaleString()} F</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-medical-blue/10 rounded-lg">
                <Calendar className="w-6 h-6 text-medical-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ce mois</p>
                <p className="text-2xl font-bold">{earnings.thisMonth.toLocaleString()} F</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-medical-purple/10 rounded-lg">
                <Users className="w-6 h-6 text-medical-purple" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consultations</p>
                <p className="text-2xl font-bold">{earnings.consultationsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
                <p className="text-2xl font-bold">{earnings.averageRating.toFixed(1)}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prochaines consultations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Consultations récentes
          </CardTitle>
          <CardDescription>
            Vos dernières consultations et leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          {consultations.length > 0 ? (
            <div className="space-y-4">
              {consultations.map((consultation) => {
                const status = getStatusBadge(consultation.status);
                return (
                  <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Patient #{consultation.patient_id.slice(0, 8)}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(consultation.scheduled_at)}</span>
                          {consultation.duration_minutes && (
                            <>
                              <Clock className="w-4 h-4" />
                              <span>{consultation.duration_minutes} min</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant={status.variant} className={status.color}>
                        {status.label}
                      </Badge>
                      {consultation.amount_charged && (
                        <p className="font-semibold text-medical-green">
                          {consultation.amount_charged} F
                        </p>
                      )}
                      {consultation.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{consultation.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune consultation pour le moment</p>
              <p className="text-sm text-muted-foreground">
                Vos consultations apparaîtront ici une fois programmées
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-medical-blue mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Gérer planning</h3>
            <p className="text-sm text-muted-foreground">
              Définissez vos disponibilités
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-medical-green mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Revenus détaillés</h3>
            <p className="text-sm text-muted-foreground">
              Consultez vos gains mensuels
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-medical-purple mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Mes patients</h3>
            <p className="text-sm text-muted-foreground">
              Historique et suivi patients
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;