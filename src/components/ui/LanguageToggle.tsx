import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Globe } from 'lucide-react';
import React from 'react';

interface Props {
  className?: string; // for overriding styles
}

const LanguageToggle: React.FC<Props> = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const currentFlag = i18n.language === 'fr' ? '🇫🇷' : '🇬🇧';
  const currentLang = i18n.language === 'fr' ? 'FR' : 'EN';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`gap-2 backdrop-blur-sm border ${className}`} // removed hardcoded text-white/bg-white
    >
      <Globe className="h-4 w-4" />
      <span className="flex items-center gap-1">
        <span>{currentFlag}</span>
        <span className="font-medium">{currentLang}</span>
      </span>
    </Button>
  );
};

export default LanguageToggle;
