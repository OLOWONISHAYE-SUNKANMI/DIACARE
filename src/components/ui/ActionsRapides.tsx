import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ActionsRapidesProps {
  onTabChange?: (tab: string) => void;
  onGlycemieClick?: () => void;
  onMedicamentClick?: () => void;
  onMealClick?: () => void;
  onActivityClick?: () => void;
}

const ActionsRapides: React.FC<ActionsRapidesProps> = React.memo(({ 
  onTabChange, 
  onGlycemieClick, 
  onMedicamentClick,
  onMealClick,
  onActivityClick
}) => {
  const { toast } = useToast();
  const [glucoseValue, setGlucoseValue] = useState("");
  const [mealName, setMealName] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [activityName, setActivityName] = useState("");

  const handleGlucoseSubmit = () => {
    if (glucoseValue) {
      toast({
        title: "Glycémie ajoutée",
        description: `Valeur: ${glucoseValue} mg/dL`,
      });
      setGlucoseValue("");
      onGlycemieClick?.();
    }
  };

  const handleMealSubmit = () => {
    if (mealName) {
      toast({
        title: "Repas ajouté",
        description: `Repas: ${mealName}`,
      });
      setMealName("");
      onMealClick?.();
    }
  };

  const handleMedicationSubmit = () => {
    if (medicationName) {
      toast({
        title: "Médicament ajouté",
        description: `Médicament: ${medicationName}`,
      });
      setMedicationName("");
      onMedicamentClick?.();
    }
  };

  const handleActivitySubmit = () => {
    if (activityName) {
      toast({
        title: "Activité ajoutée",
        description: `Activité: ${activityName}`,
      });
      setActivityName("");
      onActivityClick?.();
    }
  };

  const handleRappelsClick = () => {
    console.log("Rappels clicked - navigating to reminders");
    onTabChange?.('reminders');
  };

  return (
    <div className="px-3 sm:px-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
        <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Ajouter Glycémie - POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-center p-3 sm:p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors active:scale-95">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg sm:text-xl">🩸</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Ajouter Glycémie</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">📊 Nouvelle mesure glycémique</h3>
                <Input
                  type="number"
                  placeholder="Entrer le taux (mg/dL)"
                  value={glucoseValue}
                  onChange={(e) => setGlucoseValue(e.target.value)}
                />
                <Button onClick={handleGlucoseSubmit} className="w-full">
                  Enregistrer
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Journal des repas - POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-center p-3 sm:p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors active:scale-95">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg sm:text-xl">🍽️</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Journal des repas</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">🍽️ Nouveau repas</h3>
                <Input
                  type="text"
                  placeholder="Nom du repas"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
                <Button onClick={handleMealSubmit} className="w-full">
                  Ajouter repas
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Médicaments - POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-center p-3 sm:p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors active:scale-95">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg sm:text-xl">💊</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Médicaments</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">💊 Nouveau médicament</h3>
                <Input
                  type="text"
                  placeholder="Nom du médicament"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                />
                <Button onClick={handleMedicationSubmit} className="w-full">
                  Ajouter médicament
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Activité - POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-center p-3 sm:p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors active:scale-95">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg sm:text-xl">🏃</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Activité</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">🏃 Nouvelle activité</h3>
                <Input
                  type="text"
                  placeholder="Type d'activité"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                />
                <Button onClick={handleActivitySubmit} className="w-full">
                  Ajouter activité
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Rappels - FONCTIONNEL */}
          <button 
            onClick={handleRappelsClick}
            className="flex flex-col items-center p-3 sm:p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors active:scale-95 col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-lg sm:text-xl">⏰</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Rappels</span>
          </button>
          
        </div>
      </div>
    </div>
  );
});

ActionsRapides.displayName = 'ActionsRapides';

export default ActionsRapides;