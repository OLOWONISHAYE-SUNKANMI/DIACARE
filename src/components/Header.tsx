import {
  Home,
  FileText,
  BarChart3,
  Stethoscope,
  Users,
  MessageCircle,
  BookOpen,
  User,
  TestTube,
  Menu,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './ui/LanguageToggle';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useDisclosure } from '@chakra-ui/react';
import MobileDrawer from './ui/MobileDrawer';

interface HeaderProps {
  // user?: any;
  onLogout?: () => void;
  isProfessional?: boolean;
  // professionalData?: any;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const Header = ({
  // user,
  onLogout,
  isProfessional,
  // professionalData,
  onTabChange,
  activeTab,
}: HeaderProps) => {
  const { t } = useTranslation();
  const { isTestMode, toggleTestMode } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const tabs = [
    { id: 'home', label: t('nav.home'), icon: Home, color: 'blue' },
    { id: 'journal', label: t('nav.journal'), icon: FileText, color: 'coral' },
    { id: 'charts', label: t('nav.charts'), icon: BarChart3, color: 'orange' },
    {
      id: 'consultation-request',
      label: t('nav.teleconsultation'),
      icon: Stethoscope,
      color: 'blue',
    },
    { id: 'family', label: t('nav.family'), icon: Users, color: 'teal' },
    { id: 'chat', label: t('nav.chat'), icon: MessageCircle, color: 'coral' },
    { id: 'blog', label: t('nav.blog'), icon: BookOpen, color: 'orange' },
    { id: 'profile', label: t('nav.profile'), icon: User, color: 'blue' },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-medical-blue-dark to-medical-blue-light border-b border-border/20 pt-safe-area-inset-top relative z-50">
      <div className="flex items-center justify-between py-4 px-4">
        <h1 className="text-2xl font-bold tracking-wide text-white">
          {t('appName')}
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTestMode}
            className={`text-white hover:text-white hover:bg-white/20 ${
              isTestMode ? 'bg-white/30' : ''
            }`}
          >
            <TestTube className="w-4 h-4" />
          </Button>
          <LanguageToggle />

          {/* Mobile Drawer Button */}
          <button
            onClick={onOpen}
            className="lg:hidden text-white p-2 hover:bg-white/20 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Component */}
      <MobileDrawer
        isOpen={isOpen}
        onClose={onClose}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </header>
  );
};

export default Header;
