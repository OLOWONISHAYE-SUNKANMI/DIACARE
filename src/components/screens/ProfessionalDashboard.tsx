import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { EarningsTable } from "@/components/ui/EarningsTable";
import { PatientManagement } from "@/components/ui/PatientManagement";
import { QuickActions } from "@/components/ui/QuickActions";
import { useTranslation } from "react-i18next";
import { ProfessionalNotificationCenter } from "@/components/ui/ProfessionalNotificationCenter";
import { ProfessionalConsultationDashboard } from "@/components/ui/ProfessionalConsultationDashboard";
import LanguageToggle from "../ui/LanguageToggle";
import { toast } from "sonner";
import { useThemeStore } from "@/store/useThemeStore";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const isDemoMode = localStorage.getItem("demo_professional_mode");
    const userData = localStorage.getItem("demo_user_data");

    if (isDemoMode && userData) {
      setDemoUser(JSON.parse(userData));
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("demo_professional_mode");
    localStorage.removeItem("demo_user_data");
    toast.success(t("professionalDashboard.toast.logout.title"), {
      description: t("professionalDashboard.toast.logout.description"),
      duration: 4000,
    });
    navigate("/auth");
  };

  if (!demoUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        {t("professionalDashboard.loading")}
      </div>
    );
  }

  const stats = [
    { title: t("professionalDashboard.stats.title1"), value: "24", icon: Users, trend: "+12%" },
    { title: t("professionalDashboard.stats.title2"), value: "48", icon: Calendar, trend: "+8%" },
    { title: t("professionalDashboard.stats.title3"), value: "15", icon: FileText, trend: "+23%" },
    { title: t("professionalDashboard.stats.title4"), value: "32min", icon: Clock, trend: "-5%" },
  ];

  const recentPatients = [
    {
      name: "Marie Dubois",
      lastVisit: t("professionalDashboard.overview.recentPatients.firstPatient.lastvisit"),
      glucose: "7.2 mmol/L",
      status: t("professionalDashboard.overview.recentPatients.firstPatient.status"),
    },
    {
      name: "Pierre Martin",
      lastVisit: t("professionalDashboard.overview.recentPatients.secondPatient.lastvisit"),
      glucose: "6.8 mmol/L",
      status: t("professionalDashboard.overview.recentPatients.firstPatient.status"),
    },
    {
      name: "Sophie Laurent",
      lastVisit: t("professionalDashboard.overview.recentPatients.ThirdPatient.lastvisit"),
      glucose: "8.1 mmol/L",
      status: t("professionalDashboard.overview.recentPatients.ThirdPatient.status"),
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#137657] via-[#248378] to-gray-950 text-gray-100"
          : "bg-gradient-to-br from-background to-muted/50 text-foreground"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b backdrop-blur-sm ${
          theme === "dark"
            ? "bg-gray-900/80 border-white/10"
            : "bg-card/50 border-border"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* User info */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-doctor.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {demoUser.user_metadata.first_name[0]}
                  {demoUser.user_metadata.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">
                  {demoUser.user_metadata.first_name} {demoUser.user_metadata.last_name}
                </h1>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-muted-foreground"
                  }`}
                >
                  {t("professionalDashboard.study")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover:bg-accent/20"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-800" />
                )}
              </Button>
              {/* <ProfessionalNotificationCenter professionalId={demoUser.id} /> */}
              <Badge
                variant="outline"
                className={`${
                  theme === "dark"
                    ? "bg-[#137657]/40 text-[#Aee6da] border-[#248378]/20"
                    : "bg-[#Aee6da] text-[#137657] border-[#248378]/30"
                }`}
              >
                🚀 {t("professionalDashboard.mode")}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("professionalDashboard.logout")}
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
                theme === "dark" ? "bg-gray-800/80 border-white/10" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-400" : "text-muted-foreground"
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
                  <span className="text-sm font-medium text-green-500">{stat.trend}</span>
                  <span
                    className={`text-sm ml-1 ${
                      theme === "dark" ? "text-gray-400" : "text-muted-foreground"
                    }`}
                  >
                    {t("professionalDashboard.stats.compared")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t("professionalDashboard.overview.heading")}</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="earnings">
              {t("professionalDashboard.tableHeaderSections.revenue")}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {t("professionalDashboard.tableHeaderSections.settings")}
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patients */}
              <Card className={theme === "dark" ? "bg-gray-800/80 border-white/10" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {t("professionalDashboard.overview.recentPatients.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPatients.map((patient, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          theme === "dark"
                            ? "bg-gray-900/60 border-white/5"
                            : "border-border"
                        }`}
                      >
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-gray-400" : "text-muted-foreground"
                            }`}
                          >
                            {patient.lastVisit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{patient.glucose}</p>
                          <Badge
                            variant={
                              patient.status === "attention" ? "destructive" : "secondary"
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
                    {t("professionalDashboard.overview.recentPatients.button")}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className={theme === "dark" ? "bg-gray-800/80 border-white/10" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    {t("professionalDashboard.overview.quickActions.title")}
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
            <ProfessionalConsultationDashboard professionalId={demoUser.id} />
          </TabsContent>

          <TabsContent value="earnings">
            <div className="space-y-6">
              <EarningsTable />
              <Card className={theme === "dark" ? "bg-gray-800/80 border-white/10" : ""}>
                <CardHeader>
                  <CardTitle>
                    {t("professionalDashboard.revenue.consultationRevenue.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-muted-foreground"
                    }`}
                  >
                    {t("professionalDashboard.revenue.consultationRevenue.writeup")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className={theme === "dark" ? "bg-gray-800/80 border-white/10" : ""}>
              <CardHeader>
                <CardTitle>{t("professionalDashboard.accountSettings.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-muted-foreground"
                  }`}
                >
                  {t("professionalDashboard.accountSettings.writeup")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
