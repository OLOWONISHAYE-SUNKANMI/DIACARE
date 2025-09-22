import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Search, Plus, Utensils, Clock, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<string>('');
  const [portion, setPortion] = useState([100]);
  const [mealTime, setMealTime] = useState('lunch');

  const estimatedCarbs = Math.round((portion[0] / 100) * 15); // Estimation de base

  const handleScanBarcode = () => {
    setActiveOption('barcode');
    // Simulation du scanner
    setTimeout(() => {
      setSelectedFood('Biscuits Lu Petit Écolier');
      setPortion([50]);
      toast({
        title: t('scanMealModal.toast.productScanned'),
        description: t('scanMealModal.toast.productDetected', {
          productName: 'Biscuits Lu Petit Écolier',
        }),
      });
    }, 2000);
  };

  const handleSearchFood = () => {
    setActiveOption('search');
  };

  const handleAddCustom = () => {
    setActiveOption('custom');
  };

  const handleSave = () => {
    const mealData = {
      type: activeOption,
      food: selectedFood || searchQuery,
      portion: portion[0],
      carbs: estimatedCarbs,
      time: mealTime,
      timestamp: new Date().toISOString(),
    };

    console.log('Saving meal:', mealData);

    toast({
      title: t('scanMealModal.toast.mealSaved'),
      description: t('scanMealModal.toast.mealSavedDescription', {
        food: mealData.food,
        carbs: mealData.carbs,
      }),
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setActiveOption(null);
    setSearchQuery('');
    setSelectedFood('');
    setPortion([100]);
    setMealTime('lunch');
  };

  const popularFoods = [
    { name: t('scanMealModal.foods.rice'), carbs: 28, icon: '🍚' },
    { name: t('scanMealModal.foods.bread'), carbs: 49, icon: '🍞' },
    { name: t('scanMealModal.foods.pasta'), carbs: 25, icon: '🍝' },
    { name: t('scanMealModal.foods.apple'), carbs: 14, icon: '🍎' },
    { name: t('scanMealModal.foods.banana'), carbs: 23, icon: '🍌' },
    { name: t('scanMealModal.foods.plainYogurt'), carbs: 5, icon: '🥛' },
  ];

  const mealTimes = [
    {
      id: 'breakfast',
      label: t('scanMealModal.mealTimes.breakfast'),
      icon: '🌅',
    },
    { id: 'lunch', label: t('scanMealModal.mealTimes.lunch'), icon: '☀️' },
    { id: 'snack', label: t('scanMealModal.mealTimes.snack'), icon: '🥨' },
    { id: 'dinner', label: t('scanMealModal.mealTimes.dinner'), icon: '🌙' },
  ];

  if (activeOption === null) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent className="sm:max-w-md rounded-lg">
          {/* Header */}
          <ModalHeader>
            <div className="flex items-center gap-2 text-xl">
              <Utensils className="w-6 h-6 text-medical-green" />
              {t('scanMealModal.dailyMealDialog.title')}
            </div>
            <p className="text-muted-foreground">
              {t('scanMealModal.dailyMealDialog.description')}
            </p>
          </ModalHeader>
          <ModalCloseButton />

          {/* Body */}
          <ModalBody>
            <div className="space-y-4 pt-4">
              {/* Scanner Code-Barres */}
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 cursor-pointer transform transition-transform active:scale-95 rounded-lg"
                onClick={handleScanBarcode}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <Scan className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-bold">
                        📱 Scanner Code-Barres
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {t('scanMealModal.foodInfo.industrialProducts')}
                      </p>
                      <p className="text-xs text-blue-200 mt-1">
                        {t('scanMealModal.foodInfo.exactNutrition')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rechercher un Aliment */}
              <div
                className="bg-gradient-to-r from-medical-green to-emerald-600 text-white border-0 cursor-pointer transform transition-transform active:scale-95 rounded-lg"
                onClick={handleSearchFood}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-bold">
                        {t('scanMealModal.searchFood.title')}
                      </h3>
                      <p className="text-green-100 text-sm">
                        {t('scanMealModal.searchFood.subtitle')}
                      </p>
                      <p className="text-xs text-green-200 mt-1">
                        {t('scanMealModal.searchFood.note')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ajouter Manuellement */}
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 cursor-pointer transform transition-transform active:scale-95 rounded-lg"
                onClick={handleAddCustom}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-bold">
                        {t('scanMealModal.manualAdd.title')}
                      </h3>
                      <p className="text-orange-100 text-sm">
                        {t('scanMealModal.manualAdd.subtitle')}
                      </p>
                      <p className="text-xs text-orange-200 mt-1">
                        {t('scanMealModal.manualAdd.note')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
       <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 rounded-lg">
        {/* Header */}
        <ModalHeader className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveOption(null)}
          >
            ←
          </Button>
          <Utensils className="w-5 h-5 text-medical-green" />
          {activeOption === "barcode" && t("scanMealModal.activeOptions.barcode")}
          {activeOption === "search" && t("scanMealModal.activeOptions.search")}
          {activeOption === "custom" && t("scanMealModal.activeOptions.custom")}
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Meal Times */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t("scanMealModal.meal.mealTimeLabel")}
            </Label>
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

          {/* Barcode Scanner */}
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
                        <h4 className="font-medium text-green-800">
                          {selectedFood}
                        </h4>
                        <p className="text-sm text-green-600">
                          {t("scanMealModal.toast.productScanned")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Camera className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                    <p className="text-blue-700 font-medium">
                      {t("scanMealModal.scanner.scanning")}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      {t("scanMealModal.scanner.positionBarcode")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Search */}
          {activeOption === "search" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("scanMealModal.search.label")}</Label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("scanMealModal.search.placeholder")}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t("scanMealModal.popularFoods.label")}
                </Label>
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
                        <div className="text-muted-foreground">
                          {food.carbs}g/100g
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Food */}
          {activeOption === "custom" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("scanMealModal.manualFood.nameLabel")}</Label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("scanMealModal.manualFood.namePlaceholder")}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Portion */}
          {(selectedFood || searchQuery) && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t("scanMealModal.meal.consumedPortion")}
                </Label>
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
                    <span className="font-semibold text-foreground">
                      {portion[0]}g
                    </span>
                    <span>500g</span>
                  </div>
                </div>
              </div>

              {/* Carbs estimation */}
              <Card className="bg-medical-green-light border-medical-green/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      <span className="font-medium">
                        {t("scanMealModal.nutrition.estimatedCarbs")}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-medical-green">
                      {estimatedCarbs}g
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </ModalBody>

        {/* Footer Actions */}
        <ModalFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t("scanMealModal.buttons.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedFood && !searchQuery}
            className="flex-1 bg-medical-green hover:bg-medical-green/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("scanMealModal.buttons.addToJournal")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MealModal;
