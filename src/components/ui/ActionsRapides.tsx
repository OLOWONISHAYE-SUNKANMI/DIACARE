import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useTranslation } from 'react-i18next';
import { useMeals } from '@/contexts/MealContext';
import { useMedications } from '@/contexts/MedicationContext';
import { useActivities } from '@/contexts/ActivityContext';
import { useThemeStore } from '@/store/useThemeStore';
import ActivityModal from '../modals/ActivityModal';
import MedicationModal from '../modals/MedicationModal';
import MealModal from '../modals/ScanMealModal';
import AddGlucoseModal from '../modals/AddGlucoseModal';
import BarcodeScanModal from '../modals/BarcodeScanModal';
import PhotoUploadModal from '../modals/PhotoUploadModal';
import PhotoAnalysisModal from '../modals/PhotoAnalysisModal';
import { BookOpen, MessageCircle, Stethoscope, Users } from 'lucide-react';

interface ActionsRapidesProps {
  onTabChange?: (tab: string) => void;
  onGlucoseSubmit?: (glucoseValue: string) => void;
}

const ActionsRapides: React.FC<ActionsRapidesProps> = ({
  onTabChange,
  onGlucoseSubmit,
}) => {
  const { toast } = useToast();
  const { addReading } = useGlucose();
  const { t } = useTranslation();
  const { addMeal } = useMeals();
  const { addMedication } = useMedications();
  const { addActivity } = useActivities();
  const { darkMode } = useThemeStore();

  // States
  const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [glucoseValue, setGlucoseValue] = useState('');
  const [glucoseNotes, setGlucoseNotes] = useState('');
  const [glucoseLoading, setGlucoseLoading] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [carbs, setCarbs] = useState('');

  // Handlers
  const handleGlucoseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!glucoseValue) return;

    setGlucoseLoading(true);
    addReading({
      value: parseFloat(glucoseValue),
      notes: glucoseNotes,
      createdAt: new Date(),
    });
    onGlucoseSubmit?.(glucoseValue);
    toast({
      title: t('Actions.actionsPopover.saved'),
      description: `${glucoseValue} mg/dL`,
    });
    setGlucoseValue('');
    setGlucoseNotes('');
    setGlucoseLoading(false);
    setIsGlucoseModalOpen(false);
  };

  const handleMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName || !carbs) return;

    try {
      await addMeal({
        meal_name: foodName,
        total_carbs: parseFloat(carbs),
        meal_time: new Date(),
      });

      toast({ title: t('Actions.mealSaved') });

      // reset form
      setFoodName('');
      setCarbs('');
      setIsMealModalOpen(false);
    } catch (err) {
      console.error('Error saving meal:', err);
      toast({
        title: 'Error',
        description: 'Failed to save meal.',
        variant: 'destructive',
      });
    }
  };

  const handleRappelsClick = () => {
    onTabChange?.('reminders');
  };
  const handleInsulinClick = () => {
    onTabChange?.('insulin');
  };
  const handleBiomarkerClick = () => {
    onTabChange?.('biomarker');
  };
  const handleTelehealth = () => {
    onTabChange?.('consultation-request');
  };
  const handleFamily = () => {
    onTabChange?.('family');
  };
  const handleChat = () => {
    onTabChange?.('chat');
  };
  const handleBlog = () => {
    onTabChange?.('blog');
  };

  // Utility for semantic colors
  const bgCard = 'bg-card';
  const textCard = 'text-card-foreground';
  const bgButtonLight = 'bg-accent/20 hover:bg-accent/30';
  const bgButtonDark = 'bg-primary/20 hover:bg-primary/30';
  const textButton = 'text-foreground';

  return (
    <div className="px-3 sm:px-4">
      <div
        className={`rounded-xl p-4 sm:p-6 shadow-md transition-colors ${bgCard} ${textCard}`}
      >
        <h3 className={`font-semibold mb-3 sm:mb-4 ${textCard}`}>
          {t('Actions.actions')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Glycémie */}
          <button
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
            onClick={() => setIsGlucoseModalOpen(true)}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center mb-2">
              <span className="text-lg sm:text-xl">🩸</span>
            </div>
            <span
              className={`text-xs sm:text-sm font-medium text-center ${textButton}`}
            >
              {t('Actions.actionsPopover.bloodSugar.increment')}
            </span>
          </button>
          {/* <AddGlucoseModal/> */}

          <Modal
            isOpen={isGlucoseModalOpen}
            onClose={() => setIsGlucoseModalOpen(false)}
            isCentered
          >
            <ModalOverlay />
            <ModalContent py={3} className={`${bgCard} ${textCard}`}>
              <ModalHeader>📊 {t('Actions.actionsPopover.title')}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleGlucoseSubmit} className="space-y-4 py-6">
                  <div>
                    <Label htmlFor="glucose">
                      {t('Actions.actionsPopover.input1')} (mg/dL)
                    </Label>
                    <Input
                      id="glucose"
                      type="number"
                      placeholder="Ex: 120"
                      value={glucoseValue}
                      onChange={e => setGlucoseValue(e.target.value)}
                      className="mt-1"
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="glucoseNotes">
                      Notes ({t('Actions.actionsPopover.notes')})
                    </Label>
                    <Input
                      id="glucoseNotes"
                      placeholder={t('Actions.actionsPopover.comments')}
                      value={glucoseNotes}
                      onChange={e => setGlucoseNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={glucoseLoading}
                  >
                    {glucoseLoading
                      ? t('actionsRapides.loadingSave')
                      : t('Actions.button')}
                  </Button>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Meals */}
          <button
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
            onClick={() => setIsMealModalOpen(true)}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-800 rounded-full flex items-center justify-center mb-2">
              🍽️
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('Actions.addMeal')}
            </span>
          </button>

          <Modal
            isOpen={isMealModalOpen}
            onClose={() => setIsMealModalOpen(false)}
            isCentered
          >
            <ModalOverlay />
            <ModalContent className="rounded-2xl p-2">
              <ModalHeader className="font-semibold text-lg flex items-center gap-2">
                {t('actionsRapides.mealModal.title')}
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <div className="space-y-4">
                  {/* Options de saisie */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center p-4 h-auto"
                      onClick={() => setIsBarcodeModalOpen(true)}
                    >
                      <span className="text-xl mb-1">📱</span>
                      <span className="text-xs">
                        {t('actionsRapides.mealModal.barcodeScan')}
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex flex-col items-center p-4 h-auto"
                      onClick={() => setIsPhotoModalOpen(true)}
                    >
                      <span className="text-xl mb-1">📸</span>
                      <span className="text-xs">
                        {t('actionsRapides.mealModal.photoAI')}
                      </span>
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className=" px-2 text-muted-foreground">
                        {t('actionsRapides.mealModal.manualEntry')}
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleMealSubmit} className="space-y-3">
                    <div>
                      <Label htmlFor="foodName">
                        {t('actionsRapides.mealModal.foodNameLabel')}
                      </Label>
                      <Input
                        id="foodName"
                        placeholder={t(
                          'actionsRapides.mealModal.foodNamePlaceholder'
                        )}
                        value={foodName}
                        onChange={e => setFoodName(e.target.value)}
                        className="mt-1"
                        autoFocus
                      />
                    </div>
                    <div>
                      <Label htmlFor="carbs">
                        {t('actionsRapides.mealModal.carbsLabel')}
                      </Label>
                      <Input
                        id="carbs"
                        type="number"
                        placeholder={t(
                          'actionsRapides.mealModal.carbsPlaceholder'
                        )}
                        value={carbs}
                        onChange={e => setCarbs(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {t('actionsRapides.mealModal.addButton')}
                    </Button>
                  </form>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
          <button
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
            onClick={() => setIsMedicationModalOpen(true)}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center mb-2">
              💊
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('Actions.addMedication')}
            </span>
          </button>
          <MedicationModal
            isOpen={isMedicationModalOpen}
            onClose={() => setIsMedicationModalOpen(false)}
          />

          {/* Activities */}
          <button
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
            onClick={() => setIsActivityModalOpen(true)}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center mb-2">
              🏃
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('Actions.addActivity')}
            </span>
          </button>
          <ActivityModal
            isOpen={isActivityModalOpen}
            onClose={() => setIsActivityModalOpen(false)}
          />

          {/* Reminders */}
          <button
            onClick={handleRappelsClick}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-medical-teal rounded-full flex items-center justify-center mb-2">
              ⏰
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('Actions.reminders')}
            </span>
          </button>
          <button
            onClick={handleTelehealth}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center mb-2">
             🏥
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('nav.teleconsultation')}
            </span>
          </button>
          <button
            onClick={handleFamily}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-medical-green-light rounded-full flex items-center justify-center mb-2">
              👨‍👩‍👧‍👦
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('nav.family')}
            </span>
          </button>
          <button
            onClick={handleChat}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#008000] rounded-full flex items-center justify-center mb-2">
             📩
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('nav.chat')}
            </span>
          </button>
          <button
            onClick={handleBlog}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center mb-2">
              📖
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('nav.blog')}
            </span>
          </button>

        </div>
      </div>
      <BarcodeScanModal
        isOpen={isBarcodeModalOpen}
        onClose={setIsBarcodeModalOpen}
      />
      <PhotoAnalysisModal
        isOpen={isPhotoModalOpen}
        onClose={setIsPhotoModalOpen}
      />
    </div>
  );
};

export default ActionsRapides;
