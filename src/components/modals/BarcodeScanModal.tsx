import React, { useState, useRef } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { X, Camera as CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodSelected: (food: { name: string; carbs: number }) => void;
}

const BarcodeScanModal = ({ isOpen, onClose, onFoodSelected }: BarcodeScanModalProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [foodData, setFoodData] = useState<{ name: string; carbs: number } | null>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const startScan = async () => {
    try {
      setIsScanning(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: "Scanner le code-barres",
        promptLabelPhoto: "Prendre une photo",
        promptLabelPicture: "Choisir depuis la galerie"
      });

      // Simuler l'analyse du code-barres
      // Dans un vrai projet, vous utiliseriez une bibliothèque de scan de code-barres
      const mockBarcode = "1234567890123";
      setScannedCode(mockBarcode);
      
      // Simuler la récupération des données nutritionnelles
      const mockFoodData = {
        name: "Pomme Golden - 1 unité moyenne",
        carbs: 15
      };
      
      setFoodData(mockFoodData);
      
      toast({
        title: "Code-barres scanné",
        description: `Produit: ${mockFoodData.name}`,
      });
      
    } catch (error) {
      console.error("Erreur lors du scan:", error);
      toast({
        title: "Erreur",
        description: "Impossible de scanner le code-barres",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddFood = () => {
    if (foodData) {
      onFoodSelected(foodData);
      onClose();
      setScannedCode("");
      setFoodData(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-6 shadow-2xl w-full max-w-md"
        style={{ top: '120px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            📱 Scanner Code-barres
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Bouton de scan */}
          <Button 
            onClick={startScan}
            disabled={isScanning}
            className="w-full flex items-center gap-2"
          >
            <CameraIcon className="w-4 h-4" />
            {isScanning ? "Scan en cours..." : "Démarrer le scan"}
          </Button>

          {/* Code scanné */}
          {scannedCode && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label>Code-barres détecté:</Label>
              <p className="font-mono text-sm">{scannedCode}</p>
            </div>
          )}

          {/* Données du produit */}
          {foodData && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Produit trouvé:</h3>
              <p className="text-sm mb-1"><strong>Nom:</strong> {foodData.name}</p>
              <p className="text-sm mb-3"><strong>Glucides:</strong> {foodData.carbs}g</p>
              
              <Button 
                onClick={handleAddFood}
                className="w-full"
                size="sm"
              >
                Ajouter au journal
              </Button>
            </div>
          )}

          {/* Saisie manuelle du code */}
          <div className="pt-4 border-t">
            <Label htmlFor="manualCode">Ou saisir le code manuellement:</Label>
            <Input
              id="manualCode"
              placeholder="Ex: 1234567890123"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanModal;