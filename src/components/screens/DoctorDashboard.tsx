import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Settings, 
  LogOut,
  Wifi,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import StatCard from '@/components/ui/StatCard';
import ConsultationCard from '@/components/ui/ConsultationCard';

interface ConsultationData {
  id: string;
  patient_id: string;
  scheduled_at: string;
  duration_estimate: number;
  status: string;
  amount_charged: number;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
  patient_name: string;
  patient_age?: number;
  patient_location?: string;
}

interface DashboardStats {
  pendingCount: number;
  monthlyRevenue: number;
  todayConsultations: number;
  averageDuration: number;
  todayEarnings: number;
  rating: number;
  totalConsultations: number;
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingConsultations, setPendingConsultations] = useState<ConsultationData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    pendingCount: 0,
    monthlyRevenue: 0,
    todayConsultations: 0,
    averageDuration: 0,
    todayEarnings: 0,
    rating: 4.9,
    totalConsultations: 0
  });
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      // Actualiser les données toutes les 30 secondes
      const interval = setInterval(loadDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Charger les consultations en attente
      const { data: consultationsData } = await supabase
        .from('teleconsultations')
        .select(`
          id,
          patient_id,
          scheduled_at,
          duration_minutes,
          status,
          amount_charged,
          consultation_notes
        `)
        .eq('status', 'scheduled')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true });

      if (consultationsData) {
        // Enrichir avec des données mock pour la démo
        const enrichedConsultations: ConsultationData[] = consultationsData.map((consultation, index) => ({
          ...consultation,
          duration_estimate: consultation.duration_minutes || 30,
          urgency: ['low', 'medium', 'high'][index % 3] as 'low' | 'medium' | 'high',
          reason: consultation.consultation_notes || 'Consultation de suivi diabète',
          patient_name: `Patient ${consultation.patient_id.slice(0, 8)}`,
          patient_age: 25 + (index * 5),
          patient_location: ['Dakar', 'Thiès', 'Saint-Louis'][index % 3]
        }));
        
        setPendingConsultations(enrichedConsultations);
      }

      // Charger les statistiques
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { data: monthlyData } = await supabase
        .from('teleconsultations')
        .select('amount_charged, duration_minutes')
        .eq('status', 'completed')
        .gte('scheduled_at', monthStart.toISOString());

      const { data: todayData } = await supabase
        .from('teleconsultations')
        .select('amount_charged, duration_minutes')
        .eq('status', 'completed')
        .gte('scheduled_at', today.toISOString().split('T')[0]);

      // Calculer les statistiques
      const monthlyRevenue = monthlyData?.reduce((sum, c) => sum + (c.amount_charged || 0), 0) || 0;
      const todayEarnings = todayData?.reduce((sum, c) => sum + (c.amount_charged || 0), 0) || 0;
      const todayConsultations = todayData?.length || 0;
      const avgDuration = todayData?.length > 0 
        ? todayData.reduce((sum, c) => sum + (c.duration_minutes || 0), 0) / todayData.length 
        : 0;

      setStats({
        pendingCount: pendingConsultations.length,
        monthlyRevenue,
        todayConsultations,
        averageDuration: Math.round(avgDuration),
        todayEarnings,
        rating: 4.9,
        totalConsultations: 156 // Mock data
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptConsultation = async (consultationId: string) => {
    try {
      const { error } = await supabase
        .from('teleconsultations')
        .update({ 
          status: 'confirmed',
          started_at: new Date().toISOString()
        })
        .eq('id', consultationId);

      if (error) throw error;

      toast({
        title: "Consultation acceptée",
        description: "La consultation a été confirmée. Le patient en sera informé.",
      });

      // Retirer de la liste des consultations en attente
      setPendingConsultations(prev => 
        prev.filter(c => c.id !== consultationId)
      );

      // Recharger les données
      loadDashboardData();
    } catch (error) {
      console.error('Error accepting consultation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la consultation.",
        variant: "destructive"
      });
    }
  };

  const declineConsultation = async (consultationId: string) => {
    try {
      const { error } = await supabase
        .from('teleconsultations')
        .update({ 
          status: 'cancelled'
        })
        .eq('id', consultationId);

      if (error) throw error;

      toast({
        title: "Consultation déclinée",
        description: "La consultation a été annulée. Le patient en sera informé.",
      });

      // Retirer de la liste
      setPendingConsultations(prev => 
        prev.filter(c => c.id !== consultationId)
      );

      loadDashboardData();
    } catch (error) {
      console.error('Error declining consultation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de décliner la consultation.",
        variant: "destructive"
      });
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast({
      title: isOnline ? "Vous êtes maintenant hors ligne" : "Vous êtes maintenant en ligne",
      description: isOnline ? "Vous ne recevrez plus de nouvelles demandes" : "Vous pouvez recevoir de nouvelles consultations",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Pro */}
      <div className="bg-gradient-to-r from-medical-blue to-medical-blue/90 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dr. Mamadou Kane</h1>
              <p className="text-blue-100">Endocrinologue • DARE Pro</p>
              <p className="text-sm text-blue-200">⭐ {stats.rating}/5 • {stats.totalConsultations} consultations</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.todayEarnings.toLocaleString()} F</div>
            <div className="text-blue-200 text-sm">Gains aujourd'hui</div>
            <Button
              onClick={toggleOnlineStatus}
              variant="outline"
              size="sm"
              className={`mt-2 text-xs ${
                isOnline 
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                  : 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500'
              }`}
            >
              <Wifi className="w-3 h-3 mr-1" />
              {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
            </Button>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
            <Calendar className="w-4 h-4 mr-2" />
            Planning
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          icon="👥" 
          title="Patients en attente" 
          value={stats.pendingCount.toString()} 
          color="orange" 
        />
        <StatCard 
          icon="💰" 
          title="Revenus ce mois" 
          value={`${stats.monthlyRevenue.toLocaleString()} F`} 
          color="green" 
        />
        <StatCard 
          icon="📅" 
          title="Consultations aujourd'hui" 
          value={stats.todayConsultations.toString()} 
          color="blue" 
        />
        <StatCard 
          icon="⏱️" 
          title="Temps moyen/consultation" 
          value={`${stats.averageDuration} min`} 
          color="purple" 
        />
      </div>

      {/* Consultations en attente */}
      <div className="px-6 pb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Consultations en Attente
              </h3>
              {pendingConsultations.length > 0 && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                  {pendingConsultations.length} en attente
                </Badge>
              )}
            </div>
            
            {pendingConsultations.length > 0 ? (
              <div className="space-y-4">
                {pendingConsultations.map(consultation => (
                  <ConsultationCard 
                    key={consultation.id}
                    consultation={consultation}
                    onAccept={acceptConsultation}
                    onDecline={declineConsultation}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune consultation en attente</p>
                <p className="text-sm text-muted-foreground">
                  Les nouvelles demandes apparaîtront ici
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;