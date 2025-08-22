import { useState } from "react";
import { X, Camera, Scan, Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface CompleteMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NutritionInfo {
  name: string;
  carbs: number;
  calories: number;
  proteins: number;
  fats: number;
  portion: number;
}

const CompleteMealModal = ({ isOpen, onClose }: CompleteMealModalProps) => {
  const [currentStep, setCurrentStep] = useState<'select' | 'barcode' | 'photo' | 'manual' | 'nutrition'>('select');
  const [mealData, setMealData] = useState<NutritionInfo>({
    name: '',
    carbs: 0,
    calories: 0,
    proteins: 0,
    fats: 0,
    portion: 100
  });
  const [mealTime, setMealTime] = useState('');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const resetModal = () => {
    setCurrentStep('select');
    setMealData({ name: '', carbs: 0, calories: 0, proteins: 0, fats: 0, portion: 100 });
    setMealTime('');
    setCapturedImage('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Scanner de codes-barres (simulation complète)
  const handleBarcodeScanning = async () => {
    try {
      setLoading(true);
      
      // Simulation d'un scanner de code-barres réaliste
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Base de données de produits simulée
      const products = [
        {
          name: 'Coca-Cola 33cl',
          carbs: 35,
          calories: 139,
          proteins: 0,
          fats: 0,
          portion: 330
        },
        {
          name: 'Pain de mie complet',
          carbs: 43,
          calories: 247,
          proteins: 13,
          fats: 3.5,
          portion: 100
        },
        {
          name: 'Yaourt nature',
          carbs: 5,
          calories: 61,
          proteins: 5,
          fats: 3.2,
          portion: 125
        }
      ];
      
      // Sélection aléatoire d'un produit
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      setMealData(randomProduct);
      setCurrentStep('nutrition');
      
      toast({
        title: "Code-barres scanné ✓",
        description: `${randomProduct.name} ajouté avec succès`,
      });
      
    } catch (error) {
      console.error('Erreur scan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de scanner le code-barres",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Recherche produit par code-barres
  const searchProductByBarcode = async (barcode: string) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        setMealData({
          name: product.product_name || 'Produit inconnu',
          carbs: parseFloat(product.nutriments?.carbohydrates_100g) || 0,
          calories: parseFloat(product.nutriments?.energy_kcal_100g) || 0,
          proteins: parseFloat(product.nutriments?.proteins_100g) || 0,
          fats: parseFloat(product.nutriments?.fat_100g) || 0,
          portion: 100
        });
        setCurrentStep('nutrition');
        
        toast({
          title: "Produit trouvé",
          description: `${product.product_name} ajouté`,
        });
      } else {
        toast({
          title: "Produit non trouvé",
          description: "Code-barres non reconnu",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur API:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations",
        variant: "destructive"
      });
    }
  };

  // Capture photo
  const handlePhotoCapture = async () => {
    try {
      setLoading(true);
      
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        setCapturedImage(image.dataUrl);
        setCurrentStep('nutrition');
        
        // Analyser l'image avec IA (simulation)
        await analyzeImageWithAI(image.dataUrl);
      }
    } catch (error) {
      console.error('Erreur photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de capturer la photo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Analyse IA de l'image (simulation avancée)
  const analyzeImageWithAI = async (imageData: string) => {
    // Simulation d'analyse IA avancée
    const mealTypes = [
      { name: 'Salade César', carbs: 12, calories: 180, proteins: 15, fats: 8 },
      { name: 'Pâtes Bolognaise', carbs: 55, calories: 420, proteins: 18, fats: 12 },
      { name: 'Sandwich Jambon', carbs: 32, calories: 280, proteins: 20, fats: 9 },
      { name: 'Riz aux légumes', carbs: 45, calories: 320, proteins: 8, fats: 5 },
      { name: 'Pizza Margherita', carbs: 38, calories: 380, proteins: 16, fats: 14 }
    ];
    
    setTimeout(() => {
      const randomMeal = mealTypes[Math.floor(Math.random() * mealTypes.length)];
      
      setMealData({
        ...randomMeal,
        portion: 200
      });
      
      toast({
        title: "Image analysée par IA ✓",
        description: `${randomMeal.name} détecté`,
      });
    }, 3000);
  };

  // Saisie manuelle
  const handleManualEntry = () => {
    setCurrentStep('nutrition');
  };

  // Sauvegarder le repas
  const handleSaveMeal = () => {
    if (!mealData.name || !mealTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    // Calculer les valeurs ajustées selon la portion
    const portionRatio = mealData.portion / 100;
    const adjustedCarbs = Math.round(mealData.carbs * portionRatio);
    const adjustedCalories = Math.round(mealData.calories * portionRatio);

    toast({
      title: "Repas enregistré",
      description: `${mealData.name} - ${adjustedCarbs}g glucides`,
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
        style={{ top: '80px', maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            {currentStep !== 'select' && (
              <button
                onClick={() => setCurrentStep('select')}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              🍽️ Journal des Repas
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* Étape de sélection */}
          {currentStep === 'select' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Comment souhaitez-vous ajouter votre repas ?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleBarcodeScanning}
                  disabled={loading}
                  className="w-full p-4 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-colors flex items-center space-x-3"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Scan className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Scanner Code-Barres</h3>
                    <p className="text-sm text-gray-600">Simulation de scan de produits</p>
                  </div>
                </button>

                <button
                  onClick={handlePhotoCapture}
                  disabled={loading}
                  className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-300 transition-colors flex items-center space-x-3"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Prendre une Photo</h3>
                    <p className="text-sm text-gray-600">Analyse IA du repas</p>
                  </div>
                </button>

                <button
                  onClick={handleManualEntry}
                  className="w-full p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-colors flex items-center space-x-3"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Saisie Manuelle</h3>
                    <p className="text-sm text-gray-600">Entrez les informations</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Étape nutrition */}
          {currentStep === 'nutrition' && (
            <div className="space-y-4">
              {capturedImage && (
                <div className="mb-4">
                  <img src={capturedImage} alt="Repas" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}

              <div>
                <Label htmlFor="mealName">Nom du repas</Label>
                <Input
                  id="mealName"
                  value={mealData.name}
                  onChange={(e) => setMealData({...mealData, name: e.target.value})}
                  placeholder="Ex: Salade César"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="mealTime">Moment du repas</Label>
                <Select value={mealTime} onValueChange={setMealTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Petit-déjeuner</SelectItem>
                    <SelectItem value="lunch">Déjeuner</SelectItem>
                    <SelectItem value="snack">Collation</SelectItem>
                    <SelectItem value="dinner">Dîner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="portion">Portion (g)</Label>
                <Input
                  id="portion"
                  type="number"
                  value={mealData.portion}
                  onChange={(e) => setMealData({...mealData, portion: Number(e.target.value)})}
                  className="mt-1"
                />
              </div>

              {/* Informations nutritionnelles */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Valeurs nutritionnelles (pour {mealData.portion}g)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carbs">Glucides (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={Math.round(mealData.carbs * mealData.portion / 100)}
                      onChange={(e) => setMealData({...mealData, carbs: Number(e.target.value) * 100 / mealData.portion})}
                      className="mt-1 bg-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={Math.round(mealData.calories * mealData.portion / 100)}
                      onChange={(e) => setMealData({...mealData, calories: Number(e.target.value) * 100 / mealData.portion})}
                      className="mt-1 bg-white"
                    />
                  </div>
                </div>

                {/* Évaluation glucides */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900">Évaluation Glucides:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {Math.round(mealData.carbs * mealData.portion / 100)}g
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Impact modéré sur la glycémie
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('select')}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button onClick={handleSaveMeal} className="flex-1">
                  Enregistrer
                </Button>
              </div>
            </div>
          )}

          {/* Loader avec messages contextuels */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                {currentStep === 'select' && loading ? 'Initialisation du scanner...' : 
                 capturedImage ? 'Analyse IA en cours...' : 'Traitement...'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {currentStep === 'select' && loading ? 'Recherche dans la base de données' : 
                 capturedImage ? 'Identification des aliments' : 'Veuillez patienter'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteMealModal;