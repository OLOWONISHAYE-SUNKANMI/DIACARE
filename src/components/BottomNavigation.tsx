import { Home, BarChart3, Pill, BookOpen, User, Users, FileText, Bot } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "charts", label: "Données", icon: BarChart3 },
    { id: "doses", label: "Doses", icon: Pill },
    { id: "journal", label: "Carnet", icon: FileText },
    { id: "assistant", label: "Assistant", icon: Bot },
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "family", label: "Famille", icon: Users },
    { id: "profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-medical-green-light text-medical-green"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? "scale-110" : ""}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;