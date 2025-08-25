import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGlucose } from "@/contexts/GlucoseContext";
import BarcodeScanModal from "@/components/modals/BarcodeScanModal";
import PhotoAnalysisModal from "@/components/modals/PhotoAnalysisModal";

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
  const { addReading } = useGlucose();
  
  // États pour Glycémie
  const [glucoseValue, setGlucoseValue] = useState("");
  const [glucoseNotes, setGlucoseNotes] = useState("");
  
  // États pour Repas
  const [foodName, setFoodName] = useState("");
  const [carbs, setCarbs] = useState("");
  
  // États pour Médicament
  const [medication, setMedication] = useState("");
  const [dose, setDose] = useState("");
  
  // États pour Activité
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  
  // États pour les modals
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const handleGlucoseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!glucoseValue || isNaN(Number(glucoseValue))) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur de glycémie valide",
        variant: "destructive",
      });
      return;
    }

    addReading({
      value: Number(glucoseValue),
      timestamp: new Date().toISOString(),
      context: "manual",
      notes: glucoseNotes || undefined
    });

    toast({
      title: "Mesure ajoutée",
      description: "Votre glycémie a été enregistrée avec succès",
    });

    setGlucoseValue("");
    setGlucoseNotes("");
    onGlycemieClick?.();
  };

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom d'aliment",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Repas ajouté",
      description: `${foodName} a été ajouté à votre journal`,
    });

    setFoodName("");
    setCarbs("");
    onMealClick?.();
  };

  const handleMedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medication || !dose) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Médicament enregistré",
      description: `${medication} - ${dose} unités pris avec succès`,
    });

    setMedication("");
    setDose("");
    onMedicamentClick?.();
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activity || !duration) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Activité enregistrée",
      description: `${activity} pendant ${duration} minutes`,
    });

    setActivity("");
    setDuration("");
    onActivityClick?.();
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
              <form onSubmit={handleGlucoseSubmit} className="space-y-4">
                <h3 className="font-semibold text-lg">📊 Nouvelle mesure glycémique</h3>
                <div>
                  <Label htmlFor="glucose">Glycémie (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    placeholder="Ex: 120"
                    value={glucoseValue}
                    onChange={(e) => setGlucoseValue(e.target.value)}
                    className="mt-1"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="glucoseNotes">Notes (optionnel)</Label>
                  <Input
                    id="glucoseNotes"
                    placeholder="Commentaires..."
                    value={glucoseNotes}
                    onChange={(e) => setGlucoseNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enregistrer
                </Button>
              </form>
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
                <h3 className="font-semibold text-lg">🍽️ Journal des Repas</h3>
                
                {/* Options de saisie */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => setIsBarcodeModalOpen(true)}
                  >
                    <span className="text-xl mb-1">📱</span>
                    <span className="text-xs">Scanner code-barres</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => setIsPhotoModalOpen(true)}
                  >
                    <span className="text-xl mb-1">📸</span>
                    <span className="text-xs">Photo + IA</span>
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-popover px-2 text-muted-foreground">ou saisie manuelle</span>
                  </div>
                </div>

                <form onSubmit={handleMealSubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="foodName">Nom de l'aliment</Label>
                    <Input
                      id="foodName"
                      placeholder="Ex: Pomme, Riz, Salade..."
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      className="mt-1"
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Glucides (g) - optionnel</Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="Ex: 25"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Ajouter
                  </Button>
                </form>
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
              <form onSubmit={handleMedicationSubmit} className="space-y-4">
                <h3 className="font-semibold text-lg">💊 Enregistrer Prise Médicament</h3>
                <div>
                  <Label htmlFor="medication">Type de médicament</Label>
                  <Select value={medication} onValueChange={setMedication}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner un médicament" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insuline-rapide">Insuline rapide</SelectItem>
                      <SelectItem value="insuline-lente">Insuline lente</SelectItem>
                      <SelectItem value="metformine">Metformine</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dose">Dose (unités)</Label>
                  <Input
                    id="dose"
                    type="number"
                    placeholder="Ex: 5"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Confirmer
                </Button>
              </form>
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
              <form onSubmit={handleActivitySubmit} className="space-y-4">
                <h3 className="font-semibold text-lg">🏃 Activité Physique</h3>
                <div>
                  <Label htmlFor="activity">Type d'activité</Label>
                  <Select value={activity} onValueChange={setActivity}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner une activité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marche">Marche</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="velo">Vélo</SelectItem>
                      <SelectItem value="natation">Natation</SelectItem>
                      <SelectItem value="musculation">Musculation</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Ex: 30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enregistrer
                </Button>
              </form>
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
      
      {/* Modals */}
      <BarcodeScanModal 
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onFoodSelected={(food) => {
          setFoodName(food.name);
          setCarbs(food.carbs.toString());
          toast({
            title: "Produit ajouté",
            description: `${food.name} - ${food.carbs}g de glucides`,
          });
        }}
      />
      
      <PhotoAnalysisModal 
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onFoodAnalyzed={(food) => {
          setFoodName(food.name);
          setCarbs(food.carbs.toString());
          toast({
            title: "Analyse terminée",
            description: `${food.name} - ${food.carbs}g de glucides estimés`,
          });
        }}
      />
    </div>
  );
});

ActionsRapides.displayName = 'ActionsRapides';

export default ActionsRapides;