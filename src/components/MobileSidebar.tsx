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
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MobileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}: MobileSidebarProps) => {
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
    <>
      {/* Overlay - only visible when sidebar is open */}
      {isOpen && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - positioned absolutely within the container */}
      <div className={`
        absolute top-0 left-0 h-full w-64 bg-card border-r border-border 
        transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-2 overflow-y-auto h-full pb-20">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  onClose();
                }}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 mb-1 ${
                  isActive
                    ? 'bg-medical-green-light text-medical-green'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;