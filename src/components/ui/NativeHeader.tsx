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
    <div className="bg-gradient-to-r from-medical-green to-medical-teal pt-12 pb-6 px-6">
      {/* Status bar simulation */}
      <div className="flex items-center justify-between text-white text-sm mb-6 opacity-90">
        <div className="flex items-center gap-1">
          <span>{currentTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full opacity-50"></div>
          </div>
          <span className="ml-2">📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header principal */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🩺</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">DARE</h1>
            <p className="text-sm text-white/80">Diabetes Assistant</p>
          </div>
        </div>
        
        {/* Icons natifs */}
        <div className="flex gap-3">
          <button className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <button className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      {/* Greeting personnalisé */}
      <div className="text-white">
        <p className="text-white/80 text-sm mb-1">Bonjour {userName} 👋</p>
        <p className="text-lg font-semibold">Comment va votre diabète aujourd'hui ?</p>
      </div>
    </div>
  );
};

export default NativeHeader;