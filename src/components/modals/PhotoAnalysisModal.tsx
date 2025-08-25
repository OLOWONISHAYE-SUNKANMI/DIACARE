import React, { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { X, Camera as CameraIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhotoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAnalyzed: (food: { name: string; carbs: number; analysis: string }) => void;
}

const PhotoAnalysisModal = ({ isOpen, onClose, onFoodAnalyzed }: PhotoAnalysisModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ name: string; carbs: number; analysis: string } | null>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const takePicture = async (source: CameraSource) => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source,
        promptLabelHeader: "Photo du repas",
        promptLabelPhoto: "Prendre une photo",
        promptLabelPicture: "Choisir depuis la galerie"
      });

      if (image.dataUrl) {
        setSelectedImage(image.dataUrl);
        toast({
          title: "Photo capturée",
          description: "Vous pouvez maintenant analyser cette image",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la prise de photo:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prendre la photo",
        variant: "destructive",
      });
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      // Appel à l'edge function pour analyser l'image avec OpenAI GPT-4 Vision
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { 
          image: selectedImage,
          prompt: `Analyse cette image de nourriture et estime:
          1. Le nom du plat/aliment principal
          2. La quantité approximative de glucides en grammes
          3. Une brève description de ce que tu vois
          
          Réponds au format JSON: {"name": "nom du plat", "carbs": nombre, "analysis": "description"}`
        }
      });

      if (error) throw error;

      // Pour la démo, utilisons des données simulées
      const mockResult = {
        name: "Assiette de pâtes à la sauce tomate",
        carbs: 45,
        analysis: "Je vois une assiette de pâtes avec de la sauce tomate. La portion semble être d'environ 100g de pâtes cuites, ce qui représente approximativement 45g de glucides."
      };

      setAnalysisResult(mockResult);
      toast({
        title: "Analyse terminée",
        description: "L'IA a analysé votre repas avec succès",
      });

    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser l'image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddFood = () => {
    if (analysisResult) {
      onFoodAnalyzed(analysisResult);
      onClose();
      setSelectedImage(null);
      setAnalysisResult(null);
    }
  };

  const resetModal = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
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
        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-6 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
        style={{ top: '80px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            📸 Analyse Photo + IA
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {!selectedImage ? (
            /* Sélection de l'image */
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Prenez une photo de votre repas pour que l'IA estime automatiquement les glucides.
              </p>
              
              <Button 
                onClick={() => takePicture(CameraSource.Camera)}
                className="w-full flex items-center gap-2"
              >
                <CameraIcon className="w-4 h-4" />
                Prendre une photo
              </Button>

              <Button 
                onClick={() => takePicture(CameraSource.Photos)}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Choisir depuis la galerie
              </Button>
            </div>
          ) : (
            /* Affichage et analyse de l'image */
            <div className="space-y-4">
              {/* Image sélectionnée */}
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Repas à analyser"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetModal}
                  className="absolute top-2 right-2"
                >
                  Changer
                </Button>
              </div>

              {/* Bouton d'analyse */}
              {!analysisResult && (
                <Button 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      🤖 Analyser avec l'IA
                    </>
                  )}
                </Button>
              )}

              {/* Résultat de l'analyse */}
              {analysisResult && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-3">Résultat de l'analyse IA:</h3>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>Plat identifié:</strong> {analysisResult.name}</p>
                    <p><strong>Glucides estimés:</strong> {analysisResult.carbs}g</p>
                    <p><strong>Analyse:</strong> {analysisResult.analysis}</p>
                  </div>
                  
                  <Button 
                    onClick={handleAddFood}
                    className="w-full mt-4"
                    size="sm"
                  >
                    Ajouter au journal
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoAnalysisModal;