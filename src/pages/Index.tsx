import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import HomeScreen from "@/components/screens/HomeScreen";
import ChartsScreen from "@/components/screens/ChartsScreen";
import DosesScreen from "@/components/screens/DosesScreen";
import JournalScreen from "@/components/screens/JournalScreen";
import BlogScreen from "@/components/screens/BlogScreen";
import FamilyScreen from "@/components/screens/FamilyScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import PaymentScreen from "@/components/screens/PaymentScreen";
import AssistantScreen from "@/components/screens/AssistantScreen";

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
      case "blog":
        return <BlogScreen />;
      case "assistant":
        return <AssistantScreen />;
      case "family":
        return <FamilyScreen />;
      case "profile":
        return <ProfileScreen />;
      case "payment":
        return (
          <PaymentScreen 
            onBack={() => setActiveTab("home")}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      default:
        return <HomeScreen onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto relative overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {renderScreen()}
      </div>
      {activeTab !== "payment" && (
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      
      {/* Bouton flottant + */}
      <Button 
        onClick={handleQuickAdd}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-medical-teal hover:bg-medical-teal/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-10"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Index;
