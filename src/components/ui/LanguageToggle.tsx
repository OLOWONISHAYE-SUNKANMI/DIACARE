import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
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
      className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white hover:text-white shadow-sm"
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