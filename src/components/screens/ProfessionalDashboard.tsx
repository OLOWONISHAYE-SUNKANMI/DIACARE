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

export const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    toast.success('Logged out successfully', {
      description: 'You have been logged out of the dashboard.',
      duration: 4000,
    });
    navigate('/auth');
  };

  const stats = [
    { title: 'Active Patients', value: '24', icon: Users, trend: '+12%' },
    {
      title: 'Upcoming Appointments',
      value: '48',
      icon: Calendar,
      trend: '+8%',
    },
    { title: 'Reports Completed', value: '15', icon: FileText, trend: '+23%' },
    {
      title: 'Avg Consultation Time',
      value: '32min',
      icon: Clock,
      trend: '-5%',
    },
  ];

  const recentPatients = [
    {
      name: 'Marie Dubois',
      lastVisit: '2 days ago',
      glucose: '7.2 mmol/L',
      status: 'stable',
    },
    {
      name: 'Pierre Martin',
      lastVisit: '5 days ago',
      glucose: '6.8 mmol/L',
      status: 'attention',
    },
    {
      name: 'Sophie Laurent',
      lastVisit: '1 week ago',
      glucose: '8.1 mmol/L',
      status: 'stable',
    },
  ];

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
            {/* User info */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-doctor.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  JD
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">Dr. Jane Doe</h1>
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                  }`}
                >
                  General Practitioner
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
              <Badge
                variant="outline"
                className={`${
                  theme === 'dark'
                    ? 'bg-[#137657]/40 text-[#Aee6da] border-[#248378]/20'
                    : 'bg-[#Aee6da] text-[#137657] border-[#248378]/30'
                }`}
              >
                🚀 Demo Mode
              </Badge>
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
                    compared to last week
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                    Recent Patients
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
                    Quick Actions
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
