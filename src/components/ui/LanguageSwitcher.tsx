import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language === 'fr' ? 'Français' : 'English';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-card/90 backdrop-blur-sm border-border/50 hover:bg-card/95 shadow-sm">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage}</span>
          <span className="sm:hidden">{i18n.language?.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg z-50"
      >
        <DropdownMenuItem 
          onClick={() => changeLanguage('fr')}
          className="cursor-pointer hover:bg-accent/80"
        >
          🇫🇷 Français
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className="cursor-pointer hover:bg-accent/80"
        >
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;