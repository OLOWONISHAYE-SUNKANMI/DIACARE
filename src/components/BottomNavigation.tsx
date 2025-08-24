import { Home, BarChart3, Pill, BookOpen, User, Users, FileText, MessageCircle, Stethoscope } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { t } = useTranslation();
  
  const tabs = [
    { id: "home", label: t('nav.home'), icon: Home },
    { id: "charts", label: t('nav.charts'), icon: BarChart3 },
    { id: "doses", label: t('nav.doses'), icon: Pill },
    { id: "consultation-request", label: t('nav.teleconsultation'), icon: Stethoscope },
    { id: "chat", label: t('nav.chat'), icon: MessageCircle },
    { id: "journal", label: t('nav.journal'), icon: FileText },
    { id: "blog", label: t('nav.blog'), icon: BookOpen },
    { id: "family", label: t('nav.family'), icon: Users },
    { id: "profile", label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe-area-inset-bottom">
      <div className="px-2 py-2 pt-3">
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