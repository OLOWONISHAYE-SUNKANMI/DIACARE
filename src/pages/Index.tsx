import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import PaymentScreen from "@/components/screens/PaymentScreen";
import ProfessionalDashboard from "@/components/screens/ProfessionalDashboard";
import DoctorDashboard from "@/components/screens/DoctorDashboard";
import TeleconsultationBooking from "@/components/screens/TeleconsultationBooking";
import HomeScreen from "@/components/screens/HomeScreen";
import ChartsScreen from "@/components/screens/ChartsScreen";
import DosesScreen from "@/components/screens/DosesScreen";
import JournalScreen from "@/components/screens/JournalScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import BlogScreen from "@/components/screens/BlogScreen";
import FamilyScreen from "@/components/screens/FamilyScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import ConsultationRequest from "@/components/screens/ConsultationRequest";
import ProfessionalDashboardNew from "@/components/ui/ProfessionalDashboardNew";
import { RemindersScreen } from "@/components/screens/RemindersScreen";
import HealthProfessionalScreen from "@/components/screens/HealthProfessionalScreen";
import AdminDashboard from "@/components/screens/AdminDashboard";
import { AdminApplicationReview } from "@/components/screens/AdminApplicationReview";
import PatientAccessScreen from "@/components/screens/PatientAccessScreen";
import { useAuth } from "@/contexts/AuthContext";
import { GlucoseProvider } from "@/contexts/GlucoseContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [glucoseValue, setGlucoseValue] = useState(126);
  const [carbValue, setCarbValue] = useState(45);
  const [showAlert, setShowAlert] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

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

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onTabChange={setActiveTab} />;
      case "charts":
        return <ChartsScreen />;
      case "doses":
        return <DosesScreen 
          glucoseValue={glucoseValue}
          setGlucoseValue={setGlucoseValue}
          carbValue={carbValue}
          setCarbValue={setCarbValue}
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />;
      case "journal":
        return <JournalScreen 
          showAlert={showAlert}
          setShowAlert={setShowAlert}
        />;
      case "chat":
        return <ChatScreen />;
      case "health-pro":
        return <HealthProfessionalScreen />;
      case "admin":
        return <AdminDashboard />;
      case "admin-review":
        return <AdminApplicationReview />;
      case "blog":
        return <BlogScreen />;
      case "family":
        return <FamilyScreen />;
      case "profile":
        return <ProfileScreen />;
      case "teleconsultation":
        return <TeleconsultationBooking />;
      case "doctor-dashboard":
        return <DoctorDashboard />;
      case "professional-dashboard":
        return <ProfessionalDashboard />;
      case "consultation-request":
        return <ConsultationRequest />;
      case "professional-dashboard-new":
        return <ProfessionalDashboardNew />;
      case "payment":
        return (
          <PaymentScreen 
            onBack={() => setActiveTab("home")}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      case "patient-access":
        return <PatientAccessScreen />;
      case "reminders":
        return <RemindersScreen />;
      default:
        return <HomeScreen onTabChange={setActiveTab} />;
    }
  };

  const { user, signOut, isProfessional, professionalData } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <GlucoseProvider>
      <div className="min-h-screen bg-background flex flex-col max-w-full w-full mx-auto relative overflow-hidden">
        <div className="max-w-sm mx-auto w-full">
        <Header user={user} onLogout={handleLogout} isProfessional={isProfessional} professionalData={professionalData} />
        <div className="flex-1 overflow-y-auto scrollbar-hide max-w-full">
          {renderScreen()}
        </div>
        {activeTab !== "payment" && (
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        )}
        
        {/* Bouton flottant + - Fixed positioning */}
        <Button 
          onClick={handleQuickAdd}
          className="fixed bottom-24 left-4 w-14 h-14 rounded-full bg-medical-teal hover:bg-medical-teal/90 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 z-50 ring-4 ring-medical-teal/20"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
        </div>
      </div>
    </GlucoseProvider>
  );
};

export default Index;