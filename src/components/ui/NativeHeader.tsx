import { Bell, Settings } from "lucide-react";

interface NativeHeaderProps {
  userName?: string;
}

const NativeHeader = ({ userName = "Amadou" }: NativeHeaderProps) => {
  const currentTime = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-gradient-to-r from-medical-green to-medical-teal pt-8 sm:pt-12 pb-6 sm:pb-8 px-3 sm:px-4">
      {/* Status bar simulation - cachée sur très petits écrans */}
      <div className="hidden xs:flex items-center justify-between text-white text-xs sm:text-sm mb-4 sm:mb-6 opacity-90">
        <div className="flex items-center gap-1">
          <span>{currentTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-2 sm:h-3 bg-white rounded-full"></div>
            <div className="w-1 h-2 sm:h-3 bg-white rounded-full"></div>
            <div className="w-1 h-2 sm:h-3 bg-white rounded-full"></div>
            <div className="w-1 h-2 sm:h-3 bg-white rounded-full opacity-50"></div>
          </div>
          <span className="ml-1 text-xs">📶</span>
          <span className="text-xs">🔋</span>
        </div>
      </div>

      {/* Header principal */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white truncate">DiabCare</h1>
          <p className="text-xs sm:text-sm text-white/80">Assistant Diabète</p>
        </div>
        
        {/* Icons natifs avec fonctionnalités */}
        <div className="flex gap-2 sm:gap-3 ml-2">
          <button 
            className="w-9 h-9 sm:w-11 sm:h-11 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform"
            onClick={() => {
              alert("Notifications - Fonctionnalité en développement");
            }}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          <button 
            className="w-9 h-9 sm:w-11 sm:h-11 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform"
            onClick={() => {
              alert("Paramètres - Fonctionnalité en développement");
            }}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
      
      {/* Greeting personnalisé */}
      <div className="text-white">
        <p className="text-white/80 text-xs sm:text-sm mb-1">Bonjour {userName} 👋</p>
        <p className="text-base sm:text-lg font-semibold leading-tight">Comment va votre diabète aujourd'hui ?</p>
      </div>
    </div>
  );
};

export default NativeHeader;