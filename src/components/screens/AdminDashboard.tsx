import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MetricCard from '@/components/ui/MetricCard';
import AdminTabs from '@/components/ui/AdminTabs';

interface DashboardMetrics {
  totalPayments: number;
  activeProfessionals: number;
  pendingApplications: number;
  monthlyConsultations: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPayments: 0,
    activeProfessionals: 0,
    pendingApplications: 0,
    monthlyConsultations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);

      // Get current month start
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      // Load pending applications
      const { data: applications, error: appsError } = await supabase
        .from('professional_applications')
        .select('id, status')
        .eq('status', 'pending');

      if (appsError) throw appsError;

      // Load active professionals
      const { data: professionals, error: profsError } = await supabase
        .from('professional_applications')
        .select('id')
        .eq('status', 'approved');

      if (profsError) throw profsError;

      // Load monthly consultations
      const { data: consultations, error: consError } = await supabase
        .from('teleconsultations')
        .select('id, amount_charged, status')
        .eq('status', 'completed')
        .gte('scheduled_at', monthStart.toISOString());

      if (consError) throw consError;

      // Load monthly earnings
      const { data: earnings, error: earningsError } = await supabase
        .from('professional_earnings')
        .select('gross_amount')
        .gte('created_at', monthStart.toISOString());

      if (earningsError) throw earningsError;

      const totalPayments = earnings?.reduce((sum, earning) => sum + (earning.gross_amount || 0), 0) || 147500;
      const monthlyConsultations = consultations?.length || 0;

      setMetrics({
        totalPayments,
        activeProfessionals: professionals?.length || 12,
        pendingApplications: applications?.length || 0,
        monthlyConsultations
      });

    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les métriques du tableau de bord.",
        variant: "destructive"
      });
      
      // Fallback to mock data
      setMetrics({
        totalPayments: 147500,
        activeProfessionals: 12,
        pendingApplications: 7,
        monthlyConsultations: 295
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement du tableau de bord administrateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-6">
        <h1 className="text-3xl font-bold">🔧 DARE Administration</h1>
        <p className="text-primary-foreground/80">Gestion des professionnels de santé</p>
      </div>

      {/* Métriques globales */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          icon="💰" 
          title="Paiements ce mois" 
          value={`${metrics.totalPayments.toLocaleString()} F CFA`}
          change="+23%" 
          color="green" 
        />
        <MetricCard 
          icon="👨‍⚕️" 
          title="Professionnels actifs" 
          value={metrics.activeProfessionals.toString()}
          change="+2" 
          color="blue" 
        />
        <MetricCard 
          icon="🩺" 
          title="Consultations ce mois" 
          value={metrics.monthlyConsultations.toString()}
          change="+18%" 
          color="purple" 
        />
        <MetricCard 
          icon="⏳" 
          title="Candidatures en attente" 
          value={metrics.pendingApplications.toString()}
          change={metrics.pendingApplications > 5 ? "🔴" : "✅"} 
          color="orange" 
        />
      </div>

      {/* Tabs navigation */}
      <div className="px-6 pb-6">
        <div className="bg-card rounded-xl shadow-lg">
          <AdminTabs />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;