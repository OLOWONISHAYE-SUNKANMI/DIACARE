import React, { useState, Suspense, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { GlucoseProvider } from "@/contexts/GlucoseContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PerformanceOptimizer } from "@/utils/PerformanceOptimizer";
import { BundlePreloader } from "@/utils/BundleOptimizer";

// Import critical screens directly (loaded immediately)
import HomeScreen from "@/components/screens/HomeScreen";
import DosesScreen from "@/components/screens/DosesScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import { RemindersScreen } from "@/components/screens/RemindersScreen";

// Import existing screens that are already loaded
import PaymentScreen from "@/components/screens/PaymentScreen";
import { ProfessionalDashboard } from "@/components/screens/ProfessionalDashboard";
import DoctorDashboard from "@/components/screens/DoctorDashboard";
import TeleconsultationBooking from "@/components/screens/TeleconsultationBooking";
import HealthProfessionalScreen from "@/components/screens/HealthProfessionalScreen";
import AdminDashboard from "@/components/screens/AdminDashboard";
import { AdminApplicationReview } from "@/components/screens/AdminApplicationReview";
import PatientAccessScreen from "@/components/screens/PatientAccessScreen";
import ProfessionalRequestDashboard from "@/components/screens/ProfessionalRequestDashboard";
import PatientAccessInterface from "@/components/ui/PatientAccessInterface";
import CalendarScheduler from "@/components/ui/CalendarScheduler";
import ProfessionalDashboardNew from "@/components/ui/ProfessionalDashboardNew";

// Lazy load non-critical screens for better performance
const ChartsScreen = React.lazy(() => import("@/components/screens/ChartsScreen"));
const BlogScreen = React.lazy(() => import("@/components/screens/BlogScreen"));
const JournalScreen = React.lazy(() => import("@/components/screens/JournalScreen"));
const FamilyScreen = React.lazy(() => import("@/components/screens/FamilyScreen"));
const ChatScreen = React.lazy(() => import("@/components/screens/ChatScreen"));
const ConsultationRequest = React.lazy(() => import("@/components/screens/ConsultationRequest"));
const PredictiveAlertsScreen = React.lazy(() => import("@/components/screens/PredictiveAlertsScreen"));

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [glucoseValue, setGlucoseValue] = useState(126);
  const [carbValue, setCarbValue] = useState(45);
  const [showAlert, setShowAlert] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const [performanceOptimizer] = useState(() => PerformanceOptimizer.getInstance());

  const { user, signOut, isProfessional, professionalData, isTestMode, toggleTestMode } = useAuth();

  // Optimisations de performance à l'initialisation
  useEffect(() => {
    // Précharge les modules selon le rôle utilisateur
    if (user?.user_metadata) {
      const userRole = user.user_metadata.role || 'patient';
      BundlePreloader.preloadByUserRole(userRole);
    }

    // Précharge selon les conditions réseau
    const networkCondition = performanceOptimizer.getPerformanceMetrics().networkCondition;
    BundlePreloader.preloadByNetworkCondition(networkCondition.effectiveType);

    // Nettoyage périodique du cache
    const cleanupInterval = setInterval(() => {
      performanceOptimizer.clearExpiredCache();
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => clearInterval(cleanupInterval);
  }, [user, performanceOptimizer]);

  const handleQuickAdd = () => {
    toast({
      title: "Nouvelle entrée",
      description: "Fonctionnalité disponible prochainement",
    });
  };

  const handlePaymentSuccess = () => {
    setIsSubscribed(true);
    setActiveTab("home");
    toast({
      title: "Bienvenue dans DARE Premium !",
      description: "Votre abonnement est maintenant actif",
    });
  };

  // Composant optimisé pour le rendu des écrans avec Suspense
  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onTabChange={setActiveTab} />;
      case "doses":
        return <DosesScreen 
          glucoseValue={glucoseValue}
          setGlucoseValue={setGlucoseValue}
          carbValue={carbValue}
          setCarbValue={setCarbValue}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />;
      case "profile":
        return <ProfileScreen />;
      case "reminders":
        return <RemindersScreen />;
      case "health-pro":
        return <HealthProfessionalScreen />;
      case "admin":
        return <AdminDashboard />;
      case "admin-review":
        return <AdminApplicationReview />;
      case "teleconsultation":
        return <TeleconsultationBooking />;
      case "doctor-dashboard":
        return <DoctorDashboard />;
      case "professional-dashboard":
        return <ProfessionalDashboard />;
      case "professional-dashboard-new":
        return <ProfessionalDashboardNew />;
      case "professional-requests":
        return <ProfessionalRequestDashboard professionalId={professionalData?.id} />;
      case "patient-access":
        return <PatientAccessScreen />;
      case "patient-access-interface":
        return <PatientAccessInterface />;
      case "calendar":
        return <CalendarScheduler professionalId={professionalData?.id} />;
      case "patient-calendar":
        return <CalendarScheduler patientView={true} />;
      case "payment":
        return (
          <PaymentScreen 
            onBack={() => setActiveTab("home")}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
        
      // Écrans lazy-loaded avec Suspense pour de meilleures performances
      case "charts":
        return (
          <Suspense fallback={<LoadingSpinner fullScreen text="Chargement des graphiques..." />}>
            <ChartsScreen />
          </Suspense>
        );
      case "blog":
        return (
          <Suspense fallback={<LoadingSpinner fullScreen text="Chargement du blog..." />}>
            <BlogScreen />
          </Suspense>
        );
      case "journal":
        return (
          <Suspense fallback={<LoadingSpinner fullScreen text="Chargement du journal..." />}>
            <JournalScreen 
              showAlert={showAlert}
              setShowAlert={setShowAlert}
            />
          </Suspense>
        );
      case "family":
        return (
          <Suspense fallback={<LoadingSpinner fullScreen text="Chargement famille..." />}>
            <FamilyScreen />
          </Suspense>
        );
      case "chat":
        return (
          <Suspense fallback={<LoadingSpinner fullScreen text="Chargement du chat..." />}>
            <ChatScreen />
          </Suspense>
        );
      case "consultation-request":
        return (
          <Suspense fallback={<LoadingSpinner fullScreen text="Chargement consultation..." />}>
            <ConsultationRequest />
          </Suspense>
        );
      case "predictions":
        return (
          <Suspense fallback={<LoadingSpinner fullScreen text="Chargement alertes..." />}>
            <PredictiveAlertsScreen />
          </Suspense>
        );
      default:
        return <HomeScreen onTabChange={setActiveTab} />;
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <GlucoseProvider>
      <div className="min-h-screen bg-background flex flex-col w-full relative">
        <Header user={user} onLogout={handleLogout} isProfessional={isProfessional} professionalData={professionalData} />
        <div className="flex-1 pb-24">
          {renderScreen()}
        </div>
        {activeTab !== "payment" && (
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        )}
        
        {/* Bouton flottant + - Fixed positioning */}
        <Button 
          onClick={handleQuickAdd}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-medical-teal hover:bg-medical-teal/90 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 z-50 ring-4 ring-medical-teal/20"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </GlucoseProvider>
  );
};

export default Index;