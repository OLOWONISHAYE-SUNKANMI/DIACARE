import { Heart } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './ui/LanguageSwitcher';

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
  isProfessional?: boolean;
  professionalData?: any;
}

const Header = ({ user, onLogout, isProfessional, professionalData }: HeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <header className="w-full mx-4 my-4 mb-0 rounded-lg shadow-lg overflow-hidden bg-card border border-border">
      <div className="flex items-center justify-between py-6 px-6 bg-gradient-to-r from-medical-green to-medical-teal">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold tracking-wide text-white">{t('appName')}</h1>
          <p className="text-sm text-white/90 tracking-wide font-medium">
            {t('appDescription')}
          </p>
        </div>
        <div className="ml-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;