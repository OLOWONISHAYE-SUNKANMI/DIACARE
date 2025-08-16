import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import HomeScreen from "@/components/screens/HomeScreen";
import ChartsScreen from "@/components/screens/ChartsScreen";
import DosesScreen from "@/components/screens/DosesScreen";
import JournalScreen from "@/components/screens/JournalScreen";
import BlogScreen from "@/components/screens/BlogScreen";
import FamilyScreen from "@/components/screens/FamilyScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "charts":
        return <ChartsScreen />;
      case "doses":
        return <DosesScreen />;
      case "journal":
        return <JournalScreen />;
      case "blog":
        return <BlogScreen />;
      case "family":
        return <FamilyScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-sm mx-auto relative">
      <Header />
      {renderScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
