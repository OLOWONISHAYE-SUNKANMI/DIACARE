import { Bell, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/useThemeStore';
import PredictiveCard from './PredictiveCard';
import { useState } from 'react';

interface NativeHeaderProps {
  userName?: string;
  visible?: boolean;
  glucoseValue?: string | number;
  setVisible?: (v: boolean) => void;
}

const NativeHeader: React.FC<NativeHeaderProps> = ({
  userName,
  glucoseValue,
  visible = true,
  setVisible,
}) => {
  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div
      className={`pt-8 sm:pt-12 pb-6 sm:pb-8 px-3 sm:px-4 transition-colors ${
        isDark
          ? 'bg-background' // darkmode gradient
          : 'bg-medical-blue-dark'
      }`}
    >
      {/* Status bar simulation */}
      <div className="hidden xs:flex items-center justify-between text-foreground/90 text-xs sm:text-sm mb-4 sm:mb-6">
        <div className="flex items-center gap-1">
          <span>{currentTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-2 sm:h-3 bg-foreground rounded-full"></div>
            <div className="w-1 h-2 sm:h-3 bg-foreground rounded-full"></div>
            <div className="w-1 h-2 sm:h-3 bg-foreground rounded-full"></div>
            <div className="w-1 h-2 sm:h-3 bg-foreground/50 rounded-full"></div>
          </div>
          <span className="ml-1 text-xs">📶</span>
          <span className="text-xs">🔋</span>
        </div>
      </div>

      {/* Header principal */}
<div className="flex  gap-4 sm:gap-6 items-center sm:items-start">
  {/* Profile / Logo Image */}
  <div className="flex-shrink-0">
    <img
      src="https://res.cloudinary.com/depeqzb6z/image/upload/v1758561994/WhatsApp_Image_2025-09-22_%C3%A0_13.25.32_77c06853-removebg-preview_r2nkzm.png"
      alt="Profile"
      className="h-28 w-auto sm:h-52 object-contain drop-shadow-md"
    />
  </div>

  {/* Header content */}
  <div className="w-full">
    {/* Title & Settings */}
    <div className="flex items-center justify-between mb-3 sm:mb-5">
      <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
        {t('nativeHeader.title')}
      </h1>

      <div className="flex gap-2 sm:gap-3 ml-2">
        <button
          className="w-9 h-9 sm:w-11 sm:h-11 bg-card/30 rounded-xl sm:rounded-2xl 
                     flex items-center justify-center backdrop-blur-md 
                     hover:bg-card/40 active:scale-95 transition-all shadow-sm"
          onClick={() => alert(t('nativeHeaderFixes.settings.inDevelopment'))}
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
        </button>
      </div>
    </div>

    {/* Greeting */}
    <div className="text-white">
      <p className="text-xs sm:text-sm mb-1 opacity-90">
        {t('nativeHeader.greetings')} {userName} 👋
      </p>
      <p className="text-base sm:text-lg md:text-xl font-semibold leading-tight">
        {t('nativeHeader.question')}
      </p>
    </div>
  </div>
</div>

      {/* predictive  */}

    </div>
  );
};

export default NativeHeader;
