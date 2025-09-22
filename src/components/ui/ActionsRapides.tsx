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

  const [glucoseValue, setGlucoseValue] = useState('');
  const [glucoseNotes, setGlucoseNotes] = useState('');
  const [glucoseLoading, setGlucoseLoading] = useState(false);

  const [mealName, setMealName] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealNotes, setMealNotes] = useState('');

  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medNotes, setMedNotes] = useState('');

  const [activityName, setActivityName] = useState('');
  const [activityDuration, setActivityDuration] = useState('');
  const [activityNotes, setActivityNotes] = useState('');

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

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeal({
      name: mealName,
      carbs: parseFloat(mealCarbs),
      notes: mealNotes,
      createdAt: new Date(),
    });
    toast({ title: t('Actions.mealSaved') });
    setMealName('');
    setMealCarbs('');
    setMealNotes('');
    setIsMealModalOpen(false);
  };

  const handleMedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedication({
      name: medName,
      dose: medDose,
      notes: medNotes,
      createdAt: new Date(),
    });
    toast({ title: t('Actions.medicamentSaved') });
    setMedName('');
    setMedDose('');
    setMedNotes('');
    setIsMedicationModalOpen(false);
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity({
      name: activityName,
      duration: parseInt(activityDuration),
      notes: activityNotes,
      createdAt: new Date(),
    });
    toast({ title: t('Actions.activitySaved') });
    setActivityName('');
    setActivityDuration('');
    setActivityNotes('');
    setIsActivityModalOpen(false);
  };

  const handleRappelsClick = () => {
    onTabChange?.('reminders');
  };
  const handleInsulinClick = () => {
    onTabChange?.('insulin');
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center mb-2">
              🍽️
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('Actions.addMeal')}
            </span>
          </button>

          <MealModal
            isOpen={isMealModalOpen}
            onClose={() => setIsMealModalOpen(false)}
          />
          {/* <Modal
            isOpen={isMealModalOpen}
            onClose={() => setIsMealModalOpen(false)}
            isCentered
          >
            <ModalOverlay />
            <ModalContent className={`${bgCard} ${textCard}`}>
              <ModalHeader>🍽️ {t('Actions.addMeal')}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleMealSubmit} className="space-y-4 py-6">
                  <Input
                    placeholder={t('Actions.mealName')}
                    value={mealName}
                    onChange={e => setMealName(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder={t('Actions.mealCarbs')}
                    value={mealCarbs}
                    onChange={e => setMealCarbs(e.target.value)}
                  />
                  <Input
                    placeholder={t('Actions.notes')}
                    value={mealNotes}
                    onChange={e => setMealNotes(e.target.value)}
                  />
                  <Button type="submit" className="w-full">
                    {t('Actions.button')}
                  </Button>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal> */}

          {/* Medications */}
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center mb-2">
              ⏰
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              {t('Actions.reminders')}
            </span>
          </button>
          <button
            onClick={handleInsulinClick}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center mb-2">
              💉
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              Insulin Dosage
            </span>
          </button>
          {/* <button
            onClick={handleInsulinClick}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-colors active:scale-95 ${
              darkMode ? bgButtonDark : bgButtonLight
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center mb-2">
              🩺
            </div>
            <span className={`text-xs sm:text-sm font-medium ${textButton}`}>
              Biomarker tracker
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ActionsRapides;
