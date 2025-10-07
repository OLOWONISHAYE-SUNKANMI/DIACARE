import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Stethoscope,
  Clock,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';
import { EarningsTable } from '@/components/ui/EarningsTable';
import { PatientManagement } from '@/components/ui/PatientManagement';
import { QuickActions } from '@/components/ui/QuickActions';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/useThemeStore';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';


export const ProfessionalDashboard = () => {
  const [user, setUser] = useState(null);
  const [activePatients, setActivePatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [professionalInfo, setProfessionalInfo] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { professionalCode } = useAuth();
  console.log('Professional Info:', professionalInfo);

   const isDark = theme === 'dark';
  const { t } = useTranslation();

  const handleLogout = () => {
    toast.success('Logged out successfully', {
      description: 'You have been logged out of the dashboard.',
      duration: 4000,
    });
    navigate('/auth');
  };

  useEffect(() => {
    const storedCode = localStorage.getItem('professionalCode');
    if (!storedCode) {
      console.error('No professional code found, redirecting to login');
      navigate('/auth');
      return;
    }

    getActivePatients();
    getUpcomingAppointments();
    getCompletedReports();
    getProfessionalInfo();
    getUser();
  }, [user, navigate]);

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    // console.log('User:', data);
    if (error) {
      console.error('Error fetching user:', error.message);
    } else if (data) {
      setUser(data);
    }
  };

  // Get professional info
  // Trying to use the professional code to get the excat info for the excat professional in the dashboard.
  const getProfessionalInfo = async () => {
    try {
      const storedCode = localStorage.getItem('professionalCode');
      if (!storedCode) {
        console.error('No professional code found');
        return;
      }
      // console.log('Stored Professional Code:', storedCode);

      const { data, error } = await supabase
        .from('professional_applications')
        .select('first_name, last_name, professional_type')
        .eq('professional_code', storedCode);

      if (error) throw error;
      setProfessionalInfo(data[0]);
    } catch (error) {
      console.error('Error fetching professional info:', error);
    }
  };

  // Trying to get the active patient and then map through it
  const getActivePatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, specialty, phone');

      // console.log('Active Patients:', data);
      if (error) throw error;
      setActivePatients(data);
    } catch (error) {
      console.error('Error fetching active patients:', error);
    }
  };

  // Fetch upcoming consultations (appointments)
  const getUpcomingAppointments = async () => {
    if (!user?.id) return console.warn('User ID not available yet.');

    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select(
          `
        id,
        consultation_reason,
        status,
        requested_at,
        consultation_fee,
        profiles:patient_id (first_name, last_name, phone)
      `
        )
        .eq('professional_id', user.id)
        .in('status', ['pending', 'scheduled'])
        .order('requested_at', { ascending: true });

      if (error) throw error;

      console.log('Upcoming Appointments:', data);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  const getCompletedReports = async () => {
    if (!user?.id) return console.warn('User ID not available yet.');

    try {
      const { data, error } = await supabase
        .from('consultation_summaries')
        .select(
          `
        id,
        teleconsultation_id,
        doctor_notes,
        prescription,
        recommendations,
        duration_minutes,
        created_at
      `
        )
        // Optional: join teleconsultation for context
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Completed Reports:', data);
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Update stats with real data
  const stats = [
    {
      title: t('professionalDashboard.stats.title1'),
      value: activePatients.length.toString(),
      icon: Users,
      trend: '+0%',
    },
    {
      title: t('professionalDashboard.stats.title2'),
      value: appointments.length.toString(),
      icon: Calendar,
      trend: '+0%',
    },
    {
      title: t('professionalDashboard.stats.title3'),
      value: reports.length.toString(),
      icon: FileText,
      trend: '+0%',
    },
    { title: t('professionalDashboard.stats.title4'), value: '0min', icon: Clock, trend: '0%' },
  ];

  // Map active patients to recent patients format
  const recentPatients = activePatients.map(patient => ({
    name: `${patient.first_name} ${patient.last_name}`,
    lastVisit: new Date(patient.last_visit || '').toLocaleDateString(),
    glucose: patient.last_glucose_reading || 'N/A',
    status: patient.status || 'stable',
  }));

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#137657] via-[#248378] to-gray-950 text-gray-100'
          : 'bg-gradient-to-br from-background to-muted/50 text-foreground'
      }`}
    >
      {/* Header */}
      <div
        className={`border-b backdrop-blur-sm  ${
          theme === 'dark'
            ? 'bg-gray-900/80 border-white/10'
            : 'bg-card/50 border-border'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* User info - now dynamic */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={
                    professionalInfo?.avatar_url || '/placeholder-doctor.jpg'
                  }
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {professionalInfo?.first_name}
                  {professionalInfo?.last_name}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">
                  Dr. {professionalInfo?.first_name}{' '}
                  {professionalInfo?.last_name}
                </h1>
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                  }`}
                >
                  {professionalInfo?.professional_type ||
                    'Medical Professional'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover:bg-accent/20"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-800" />
                )}
              </Button>
              {/* <Badge
                variant="outline"
                className={`${
                  theme === 'dark'
                    ? 'bg-[#137657]/40 text-[#Aee6da] border-[#248378]/20'
                    : 'bg-[#Aee6da] text-[#137657] border-[#248378]/30'
                }`}
              >
                🚀 Demo Mode
              </Badge> */}

               <LanguageToggle
                          className={`${isDark ? 'text-white' : 'text-black'}`}
                />

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`transition-shadow duration-300 hover:shadow-lg ${
                theme === 'dark' ? 'bg-gray-800/80 border-white/10' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">
                    {stat.trend}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                   {t('professionalDashboard.stats.compared')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t('healthProfessionalScreen.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="patients">{t('healthProfessionalScreen.tabs.patients')}</TabsTrigger>
            <TabsTrigger value="consultations">{t('healthProfessionalScreen.tabs.consultations')}</TabsTrigger>
            <TabsTrigger value="earnings">{t('healthProfessionalScreen.tabs.earnings')}</TabsTrigger>
            <TabsTrigger value="settings">{t('healthProfessionalScreen.tabs.settings')}</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patients */}
              <Card
                className={
                  theme === 'dark' ? 'bg-gray-800/80 border-white/10' : ''
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {t('professionalDashboard.overview.recentPatients.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPatients.map((patient, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-900/60 border-white/5'
                            : 'border-border'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p
                            className={`text-sm ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-muted-foreground'
                            }`}
                          >
                            Last visit: {patient.lastVisit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {patient.glucose}
                          </p>
                          <Badge
                            variant={
                              patient.status === 'attention'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {patient.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Patients
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card
                className={
                  theme === 'dark' ? 'bg-gray-800/80 border-white/10' : ''
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    {t('professionalDashboard.overview.quickActions.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <QuickActions />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients">
            <PatientManagement />
          </TabsContent>

          <TabsContent value="consultations">
            <p>Consultation dashboard coming soon...</p>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="space-y-6">
              <EarningsTable />
              <Card
                className={
                  theme === 'dark' ? 'bg-gray-800/80 border-white/10' : ''
                }
              >
                <CardHeader>
                  <CardTitle>Consultation Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`${
                      theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    View your total consultation earnings and performance
                    summary.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card
              className={
                theme === 'dark' ? 'bg-gray-800/80 border-white/10' : ''
              }
            >
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                  }`}
                >
                  Manage your account preferences and dashboard appearance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
