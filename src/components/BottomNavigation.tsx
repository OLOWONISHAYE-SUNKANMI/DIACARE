import {
  Home,
  BarChart3,
  Pill,
  BookOpen,
  User,
  Users,
  FileText,
  MessageCircle,
  Stethoscope,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({
  activeTab,
  onTabChange,
}: BottomNavigationProps) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'doses', label: t('nav.doses'), icon: Pill },
    { id: 'journal', label: t('nav.journal'), icon: FileText },
    { id: 'charts', label: t('nav.charts'), icon: BarChart3 },
    {
      id: 'consultation-request',
      label: t('nav.teleconsultation'),
      icon: Stethoscope,
    },
    { id: 'family', label: t('nav.family'), icon: Users },
    { id: 'chat', label: t('nav.chat'), icon: MessageCircle },
    { id: 'blog', label: t('nav.blog'), icon: BookOpen },
    { id: 'profile', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border  overflow-hidden w-full  backdrop-blur-sm z-50" >
      <div className="px-1 sm:px-2 py-1 sm:py-2 pt-2 sm:pt-3">
        <div className="flex justify-around items-center min-h-0 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg transition-all duration-200 min-w-0 flex-shrink-0 ${
                  isActive
                    ? 'bg-medical-green-light text-medical-green'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                style={{ minWidth: '44px' }}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 flex-shrink-0 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />
                <span className="text-[10px] sm:text-xs font-medium leading-tight truncate max-w-full text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
