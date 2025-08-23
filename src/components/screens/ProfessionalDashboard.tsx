import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, FileText, Settings, LogOut, Stethoscope, Clock, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EarningsTable } from "@/components/ui/EarningsTable";
import { PatientManagement } from "@/components/ui/PatientManagement";
import { QuickActions } from "@/components/ui/QuickActions";
import { CostBreakdownByProfessional } from "@/components/ui/CostBredownByProfessional";

interface DemoUser {
  id: string;
  email: string;
  user_metadata: {
    first_name: string;
    last_name: string;
    specialty: string;
  };
}

export const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est en mode demo
    const isDemoMode = localStorage.getItem('demo_professional_mode');
    const userData = localStorage.getItem('demo_user_data');
    
    if (isDemoMode && userData) {
      setDemoUser(JSON.parse(userData));
    } else {
      // Rediriger vers la page d'authentification si pas en mode demo
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('demo_professional_mode');
    localStorage.removeItem('demo_user_data');
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté du mode demo",
    });
    navigate('/auth');
  };

  if (!demoUser) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  const stats = [
    { title: "Patients suivis", value: "24", icon: Users, trend: "+12%" },
    { title: "Consultations ce mois", value: "48", icon: Calendar, trend: "+8%" },
    { title: "Rapports générés", value: "15", icon: FileText, trend: "+23%" },
    { title: "Temps moyen/consultation", value: "32min", icon: Clock, trend: "-5%" }
  ];

  const recentPatients = [
    { name: "Marie Dubois", lastVisit: "Il y a 2h", glucose: "7.2 mmol/L", status: "stable" },
    { name: "Pierre Martin", lastVisit: "Hier", glucose: "6.8 mmol/L", status: "amélioration" },
    { name: "Sophie Laurent", lastVisit: "Il y a 3j", glucose: "8.1 mmol/L", status: "attention" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-doctor.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {demoUser.user_metadata.first_name[0]}{demoUser.user_metadata.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">
                  {demoUser.user_metadata.first_name} {demoUser.user_metadata.last_name}
                </h1>
                <p className="text-sm text-muted-foreground">{demoUser.user_metadata.specialty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                🚀 Mode Demo
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                  <span className="text-sm text-muted-foreground ml-1">vs mois dernier</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="earnings">Revenus</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patients récents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Patients récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPatients.map((patient, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.lastVisit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{patient.glucose}</p>
                          <Badge 
                            variant={patient.status === 'attention' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {patient.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Voir tous les patients
                  </Button>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Actions rapides
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
            <Card>
              <CardHeader>
                <CardTitle>Planning des consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Interface de planning en cours de développement...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="space-y-6">
              <EarningsTable />
              <CostBreakdownByProfessional />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Paramètres du compte en cours de développement...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};