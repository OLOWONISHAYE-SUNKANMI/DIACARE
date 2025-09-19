import React from 'react';
import {
  Home,
  FileText,
  BarChart3,
  Stethoscope,
  Users,
  MessageCircle,
  BookOpen,
  User,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './ui/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useDisclosure } from '@chakra-ui/react';
import MobileDrawer from './ui/MobileDrawer';
import { useThemeStore } from '@/store/useThemeStore';

interface HeaderProps {
  onLogout?: () => void;
  isProfessional?: boolean;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({
  onLogout,
  isProfessional,
  onTabChange,
  activeTab,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

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
    <header
      className={`w-full border-b pt-safe-area-inset-top relative z-50 transition-colors ${
        isDark
          ? 'bg-[#006078] border-[#248378] text-[#AEE6DA]'
          : 'bg-medical-blue-dark border-border/20 text-white'
      }`}
    >
      <div className="flex items-center justify-between py-4 px-4">
        {/* Logo / App Name */}
        <h1
          className={`text-2xl font-bold tracking-wide ${
            isDark ? 'text-[#AEE6DA]' : 'text-white'
          }`}
        >
          {t('appName')}
        </h1>

        {/* Desktop Controls */}
        <div className="flex items-center gap-3">
          <LanguageToggle
            className={`${isDark ? 'text-white' : 'text-black'}`}
          />

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md transition-colors ${
              isDark
                ? 'text-[#AEE6DA] hover:bg-[#248378]'
                : 'text-white hover:bg-white/20'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <div className="md:hidden">
            <button
              onClick={onOpen}
              className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Open menu"
            >
              <Menu
                className={`w-6 h-6 ${
                  isDark ? 'text-[#AEE6DA]' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
      </div>

      {/* Mobile Drawer */}
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
