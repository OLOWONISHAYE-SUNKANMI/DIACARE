import { Home, BarChart3, Pill, BookOpen, User, Users, FileText } from "lucide-react";

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
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "family", label: "Famille", icon: Users },
    { id: "profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 shadow-2xl rounded-t-3xl overflow-hidden backdrop-blur-xl border-t border-white/30" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[64px] ${
                  isActive
                    ? "text-white shadow-xl backdrop-blur-sm scale-110 border border-white/40"
                    : "text-white/70 hover:text-white hover:backdrop-blur-sm hover:scale-105"
                }`}
                style={isActive ? {background: 'rgba(0, 206, 209, 0.3)'} : {}}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? "scale-110" : ""} drop-shadow-md`} />
                <span className="text-xs font-semibold drop-shadow-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;