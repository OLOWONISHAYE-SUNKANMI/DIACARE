import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScanMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScanMealModal = ({ isOpen, onClose }: ScanMealModalProps) => {
  const [foodName, setFoodName] = useState("");
  const [portion, setPortion] = useState([100]);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  // Simulation of nutritional data based on food name
  const estimateCarbs = (name: string, grams: number) => {
    const carbsPercentage: { [key: string]: number } = {
      "pain": 0.5,
      "riz": 0.75,
      "pâtes": 0.7,
      "pomme": 0.14,
      "banane": 0.23,
      "yaourt": 0.05,
      "lait": 0.05,
    };
    
    const key = Object.keys(carbsPercentage).find(k => 
      name.toLowerCase().includes(k)
    );
    
    return key ? Math.round(grams * carbsPercentage[key]) : Math.round(grams * 0.2);
  };

  const estimatedCarbs = foodName ? estimateCarbs(foodName, portion[0]) : 0;

  const handleSubmit = () => {
    if (!foodName) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom de l'aliment",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Repas ajouté",
      description: `${foodName} (${portion[0]}g) ajouté au carnet avec ${estimatedCarbs}g de glucides`,
    });

    // Reset form
    setFoodName("");
    setPortion([100]);
    setShowCamera(false);
    onClose();
  };

  const simulateBarcodeScan = () => {
    // Simulate barcode scanning
    setShowCamera(true);
    setTimeout(() => {
      setFoodName("Pain complet Bio");
      setShowCamera(false);
      toast({
        title: "Produit scanné",
        description: "Informations nutritionnelles récupérées",
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">🍽️</span>
            <span>Scanner Code-Barres Aliment</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera/Scanner Section */}
          <div className="space-y-3">
            <Button 
              onClick={simulateBarcodeScan}
              className="w-full"
              variant="outline"
              disabled={showCamera}
            >
              <Camera className="w-4 h-4 mr-2" />
              {showCamera ? "Scanning..." : "Scanner le code-barres"}
            </Button>

            {showCamera && (
              <div className="bg-muted rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground animate-pulse" />
                <p className="text-sm text-muted-foreground">Pointez vers le code-barres...</p>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          {/* Manual Input */}
          <div className="space-y-2">
            <Label htmlFor="foodName">Nom de l'aliment</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="foodName"
                placeholder="Ex: Pain complet, Pomme..."
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Portion Slider */}
          <div className="space-y-3">
            <Label>Portion (grammes): {portion[0]}g</Label>
            <Slider
              value={portion}
              onValueChange={setPortion}
              max={500}
              min={10}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10g</span>
              <span>500g</span>
            </div>
          </div>

          {/* Nutritional Preview */}
          {foodName && (
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium text-sm">Informations nutritionnelles</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Portion:</span>
                    <span className="ml-2 font-medium">{portion[0]}g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Glucides estimés:</span>
                    <span className="ml-2 font-medium text-medical-blue">{estimatedCarbs}g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Calories:</span>
                    <span className="ml-2 font-medium">{Math.round(portion[0] * 2.5)} kcal</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fibres:</span>
                    <span className="ml-2 font-medium">{Math.round(estimatedCarbs * 0.1)}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Ajouter au carnet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanMealModal;