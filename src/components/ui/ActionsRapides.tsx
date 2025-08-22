import React from "react";

interface ActionsRapidesProps {
  onTabChange?: (tab: string) => void;
  onGlycemieClick?: () => void;
  onMedicamentClick?: () => void;
}

const ActionsRapides: React.FC<ActionsRapidesProps> = ({ 
  onTabChange, 
  onGlycemieClick, 
  onMedicamentClick 
}) => {
  
  const handleGlycemieClick = () => {
    console.log("Glycémie clicked");
    onGlycemieClick?.();
  };
  
  const handleRepasClick = () => {
    console.log("Repas clicked - navigating to carnet");
    onTabChange?.('carnet');
  };
  
  const handleMedicamentClick = () => {
    console.log("Médicament clicked");
    onMedicamentClick?.();
  };
  
  const handleActiviteClick = () => {
    console.log("Activité clicked - navigating to carnet");
    onTabChange?.('carnet');
  };
  
  const handleRappelsClick = () => {
    console.log("Rappels clicked - navigating to reminders");
    onTabChange?.('reminders');
  };

  return (
    <div className="px-4">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 gap-4">
          
          {/* Ajouter Glycémie - FONCTIONNEL */}
          <button 
            onClick={handleGlycemieClick}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors active:scale-95"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">🩸</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Ajouter Glycémie</span>
          </button>

          {/* Journal des repas - FONCTIONNEL */}
          <button 
            onClick={handleRepasClick}
            className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors active:scale-95"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">🍽️</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Journal des repas</span>
          </button>

          {/* Médicaments - FONCTIONNEL */}
          <button 
            onClick={handleMedicamentClick}
            className="flex flex-col items-center p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors active:scale-95"
          >
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">💊</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Médicaments</span>
          </button>

          {/* Activité - FONCTIONNEL */}
          <button 
            onClick={handleActiviteClick}
            className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors active:scale-95"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">🏃</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Activité</span>
          </button>

          {/* Rappels - FONCTIONNEL */}
          <button 
            onClick={handleRappelsClick}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors active:scale-95 col-span-2"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl">⏰</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Rappels</span>
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ActionsRapides;