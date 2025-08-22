import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Search, Plus, Utensils, Clock, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [portion, setPortion] = useState([100]);
  const [mealTime, setMealTime] = useState("lunch");

  const estimatedCarbs = Math.round((portion[0] / 100) * 15); // Estimation de base

  const handleScanBarcode = () => {
    setActiveOption("barcode");
    // Simulation du scanner
    setTimeout(() => {
      setSelectedFood("Biscuits Lu Petit Écolier");
      setPortion([50]);
      toast({
        title: "✅ Produit scanné",
        description: "Biscuits Lu Petit Écolier détectés",
      });
    }, 2000);
  };

  const handleSearchFood = () => {
    setActiveOption("search");
  };

  const handleAddCustom = () => {
    setActiveOption("custom");
  };

  const handleSave = () => {
    const mealData = {
      type: activeOption,
      food: selectedFood || searchQuery,
      portion: portion[0],
      carbs: estimatedCarbs,
      time: mealTime,
      timestamp: new Date().toISOString()
    };

    console.log("Saving meal:", mealData);
    
    toast({
      title: "🍽️ Repas enregistré",
      description: `${mealData.food} (${mealData.carbs}g glucides) ajouté au carnet`,
    });
    
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setActiveOption(null);
    setSearchQuery("");
    setSelectedFood("");
    setPortion([100]);
    setMealTime("lunch");
  };

  const popularFoods = [
    { name: "Riz blanc cuit", carbs: 28, icon: "🍚" },
    { name: "Pain de mie", carbs: 49, icon: "🍞" },
    { name: "Pâtes cuites", carbs: 25, icon: "🍝" },
    { name: "Pomme", carbs: 14, icon: "🍎" },
    { name: "Banane", carbs: 23, icon: "🍌" },
    { name: "Yaourt nature", carbs: 5, icon: "🥛" }
  ];

  const mealTimes = [
    { id: "breakfast", label: "Petit-déjeuner", icon: "🌅" },
    { id: "lunch", label: "Déjeuner", icon: "☀️" },
    { id: "snack", label: "Collation", icon: "🥨" },
    { id: "dinner", label: "Dîner", icon: "🌙" }
  ];

  if (activeOption === null) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Utensils className="w-6 h-6 text-medical-green" />
              🍽️ Repas de la Journée
            </DialogTitle>
            <p className="text-muted-foreground">Suivez vos glucides facilement</p>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {/* Scanner Code-Barres */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 cursor-pointer transform transition-transform active:scale-95" onClick={handleScanBarcode}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Scan className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold">📱 Scanner Code-Barres</h3>
                    <p className="text-blue-100 text-sm">Produits industriels et emballés</p>
                    <p className="text-xs text-blue-200 mt-1">• Infos nutritionnelles exactes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rechercher un Aliment */}
            <Card className="bg-gradient-to-r from-medical-green to-emerald-600 text-white border-0 cursor-pointer transform transition-transform active:scale-95" onClick={handleSearchFood}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold">🔍 Rechercher un Aliment</h3>
                    <p className="text-green-100 text-sm">Base de données complète</p>
                    <p className="text-xs text-green-200 mt-1">• Aliments frais et cuisinés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ajouter Manuellement */}
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 cursor-pointer transform transition-transform active:scale-95" onClick={handleAddCustom}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold">✏️ Ajouter Manuellement</h3>
                    <p className="text-orange-100 text-sm">Créez votre propre entrée</p>
                    <p className="text-xs text-orange-200 mt-1">• Recettes personnalisées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveOption(null)}>
              ←
            </Button>
            <Utensils className="w-5 h-5 text-medical-green" />
            {activeOption === "barcode" && "Scanner Code-Barres"}
            {activeOption === "search" && "Rechercher un Aliment"} 
            {activeOption === "custom" && "Ajouter Manuellement"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Moment du repas */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">⏰ Moment du repas</Label>
            <div className="grid grid-cols-2 gap-2">
              {mealTimes.map((time) => (
                <Button
                  key={time.id}
                  variant={mealTime === time.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMealTime(time.id)}
                  className="h-12 text-xs"
                >
                  <div className="text-center">
                    <div className="text-base mb-1">{time.icon}</div>
                    <div>{time.label}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contenu spécifique selon l'option */}
          {activeOption === "barcode" && (
            <div className="space-y-4">
              {selectedFood ? (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🍪</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800">{selectedFood}</h4>
                        <p className="text-sm text-green-600">Produit scanné avec succès</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Camera className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                    <p className="text-blue-700 font-medium">Scanner en cours...</p>
                    <p className="text-sm text-blue-600 mt-2">Positionnez le code-barres dans le cadre</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeOption === "search" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>🔍 Rechercher un aliment</Label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: pomme, riz, pain..."
                  className="w-full"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">💡 Aliments populaires</Label>
                <div className="grid grid-cols-2 gap-2">
                  {popularFoods.map((food, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(food.name);
                        setSelectedFood(food.name);
                      }}
                      className="h-16 text-xs justify-start"
                    >
                      <div className="text-left">
                        <div className="text-lg mb-1">{food.icon}</div>
                        <div className="font-medium">{food.name}</div>
                        <div className="text-muted-foreground">{food.carbs}g/100g</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeOption === "custom" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>✏️ Nom de l'aliment</Label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Gâteau de maman, salade de fruits..."
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Portion (commun à toutes les options) */}
          {(selectedFood || searchQuery) && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">⚖️ Portion consommée</Label>
                <div className="space-y-3">
                  <Slider
                    value={portion}
                    onValueChange={setPortion}
                    max={500}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>10g</span>
                    <span className="font-semibold text-foreground">{portion[0]}g</span>
                    <span>500g</span>
                  </div>
                </div>
              </div>

              {/* Estimation glucides */}
              <Card className="bg-medical-green-light border-medical-green/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      <span className="font-medium">Glucides estimés</span>
                    </div>
                    <div className="text-2xl font-bold text-medical-green">
                      {estimatedCarbs}g
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedFood && !searchQuery}
            className="flex-1 bg-medical-green hover:bg-medical-green/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter au carnet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealModal;