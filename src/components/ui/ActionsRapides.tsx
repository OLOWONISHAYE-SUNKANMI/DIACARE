import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useGlucose } from '@/contexts/GlucoseContext';
import BarcodeScanModal from '@/components/modals/BarcodeScanModal';
import PhotoAnalysisModal from '@/components/modals/PhotoAnalysisModal';
import { useTranslation } from 'react-i18next';
import { SelectPortal } from '@radix-ui/react-select';
import { useMeals } from '@/contexts/MealContext';
import { useMedications } from '@/contexts/MedicationContext';
import { useActivities } from '@/contexts/ActivityContext';

interface ActionsRapidesProps {
  onTabChange?: (tab: string) => void;
  onGlycemieClick?: () => void;
  onMedicamentClick?: () => void;
  onMealClick?: () => void;
  onActivityClick?: () => void;
}

const ActionsRapides: React.FC<ActionsRapidesProps> = React.memo(
  ({
    onTabChange,
    onGlycemieClick,
    onMedicamentClick,
    onMealClick,
    onActivityClick,
  }) => {
    const { toast } = useToast();
    const { addReading } = useGlucose();
    const { t } = useTranslation();
    const { addMeal } = useMeals();
    const { addMedication } = useMedications();
    const { addActivity } = useActivities();

    // States for modals
    const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState(false);
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

    // States for Glycémie
    const [glucoseValue, setGlucoseValue] = useState('');
    const [glucoseNotes, setGlucoseNotes] = useState('');

    // States for Repas
    const [foodName, setFoodName] = useState('');
    const [mealType, setMealType] = useState<
      'breakfast' | 'lunch' | 'dinner' | 'snack'
    >('lunch');
    const [carbs, setCarbs] = useState('');
    const [portion, setPortion] = useState('');
    const [notes, setNotes] = useState('');

    // States for Médicament
    const [medication, setMedication] = useState('');
    const [dose, setDose] = useState('');

    // States for Activité
    const [activity, setActivity] = useState('');
    const [duration, setDuration] = useState('');

    // States for barcode/photo modals
    const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    // loading states
    const [glucoseLoading, setGlucoseLoading] = useState(false);
    const [mealLoading, setMealLoading] = useState(false);
    const [medicationLoading, setMedicationLoading] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false);

    const handleGlucoseSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!glucoseValue || isNaN(Number(glucoseValue))) {
        toast({
          title: t('actionsRapides.toast.error.title'),
          description: t('actionsRapides.toast.error.description'),
          variant: 'destructive',
        });

        return;
      }

      try {
        setGlucoseLoading(true);

        await addReading({
          value: Number(glucoseValue),
          timestamp: new Date().toISOString(),
          context: 'manual',
          notes: glucoseNotes || undefined,
        });

        toast({
          title: 'Mesure ajoutée',
          description: 'Votre glycémie a été enregistrée avec succès',
        });

        // reset form + close modal
        setGlucoseValue('');
        setGlucoseNotes('');
        setIsGlucoseModalOpen(false);
        onGlycemieClick?.();
      } catch (error: any) {
        console.error(t('actionsRapides.errorAddGlucose'), error);
        toast({
          title: t('actionsRapides.toastErrorTitle'),
          description: t('actionsRapides.toastErrorDescription'),
          variant: 'destructive',
        });
      } finally {
        setGlucoseLoading(false);
      }
    };

    const handleMealSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!foodName) {
        toast({
          title: t('actionsRapides.toastErrorTitle'),
          description: t('actionsRapides.toastFoodNameError'),
          variant: 'destructive',
        });
        return;
      }

      try {
        setMealLoading(true);

        await addMeal({
          meal_name: foodName,
          carbs_per_100g: carbs ? Number(carbs) : undefined,
          portion_grams: portion ? Number(portion) : 100,
          meal_type: mealType,
          notes: notes || undefined,
        });

        toast({
          title: t('actionsRapides.toastMealAddedTitle'),
          description: t('actionsRapides.toastMealAddedDescription', {
            foodName,
          }),
        });

        setFoodName('');
        setMealType('lunch');
        setCarbs('');
        setPortion('');
        setNotes('');
        setIsMealModalOpen(false);
        onMealClick?.();
      } catch (err) {
        console.error(err);
        toast({
          title: t('actionsRapides.toastErrorTitle'),
          description: t('actionsRapides.toastMealAddError'),
          variant: 'destructive',
        });
      } finally {
        setMealLoading(false);
      }
    };

    const handleMedicationSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!medication || !dose) {
        toast({
          title: t('actionsRapides.toastErrorTitle'),
          description: t('actionsRapides.toastFillAllFields'),
          variant: 'destructive',
        });
        return;
      }

      try {
        setMedicationLoading(true);

        await addMedication({
          medication_name: medication,
          dose: Number(dose),
          dose_unit: 'units', // can make dynamic later
          notes: undefined,
        });

        toast({
          title: t('actionsRapides.toastMedicationSavedTitle'),
          description: t('actionsRapides.toastMedicationSavedDescription', {
            medication,
            dose,
          }),
        });

        setMedication('');
        setDose('');
        setIsMedicationModalOpen(false);
        onMedicamentClick?.();
      } catch (err) {
        console.error(err);
        toast({
          title: t('actionsRapides.toastErrorTitle'),
          description: t('actionsRapides.toastMedicationAddError'),
          variant: 'destructive',
        });
      } finally {
        setMedicationLoading(false);
      }
    };

    // Mapping French UI values to DB-accepted values
    const activityTypeMapping: Record<string, string> = {
      marche: 'walking',
      course: 'running',
      velo: 'cycling',
      natation: 'swimming',
      musculation: 'strength',
      autre: 'other',
    };

    const handleActivitySubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!activity || !duration) {
        toast({
          title: t('actionsRapides.toastErrorTitle'),
          description: t('actionsRapides.toastFillAllFields'),
          variant: 'destructive',
        });
        return;
      }

      try {
        setActivityLoading(true);

        await addActivity({
          activity_name: activity,
          activity_type: activityTypeMapping[activity] || 'other',
          duration_minutes: Number(duration),
          intensity: 'moderate',
          notes: undefined,
        });

        toast({
          title: t('actionsRapides.toastActivitySavedTitle'),
          description: t('actionsRapides.toastActivitySavedDescription', {
            activity,
            duration,
          }),
        });

        setActivity('');
        setDuration('');
        setIsActivityModalOpen(false);
        onActivityClick?.();
      } catch (err) {
        console.error(err);
        toast({
          title: t('actionsRapides.toastErrorTitle'),
          description: t('actionsRapides.toastActivityAddError'),
          variant: 'destructive',
        });
      } finally {
        setActivityLoading(false);
      }
    };

    const handleRappelsClick = () => {
      onTabChange?.('reminders');
    };

    return (
      <div className="px-3 sm:px-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4">
            {t('Actions.actions')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Glycémie */}
            <button
              className="flex flex-col items-center p-3 sm:p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors active:scale-95"
              onClick={() => setIsGlucoseModalOpen(true)}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg sm:text-xl">🩸</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                {t('Actions.actionsPopover.bloodSugar.increment')}
              </span>
            </button>
            <Modal
              isOpen={isGlucoseModalOpen}
              onClose={() => setIsGlucoseModalOpen(false)}
              isCentered
            >
              <ModalOverlay />
              <ModalContent py={3}>
                <ModalHeader>
                  📊<div className=""> {t('Actions.actionsPopover.title')}</div>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form
                    onSubmit={handleGlucoseSubmit}
                    className="space-y-4 py-6"
                  >
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

            {/* Repas */}
            <button
              className="flex flex-col items-center p-3 sm:p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors active:scale-95"
              onClick={() => setIsMealModalOpen(true)}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg sm:text-xl">🍽️</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                {t('Journal.title')}
              </span>
            </button>

            <Modal
              isOpen={isMealModalOpen}
              onClose={() => setIsMealModalOpen(false)}
              isCentered
            >
              <ModalOverlay />
              <ModalContent py={3}>
                <ModalHeader>🍽️ {t('Journal.title')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="flex flex-col items-center p-4 h-auto"
                        onClick={() => setIsBarcodeModalOpen(true)}
                      >
                        <span className="text-xl mb-1">📱</span>
                        <span className="text-xs">
                          {t('Journal.media.scanner')}
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex flex-col items-center p-4 h-auto"
                        onClick={() => setIsPhotoModalOpen(true)}
                      >
                        <span className="text-xl mb-1">📸</span>
                        <span className="text-xs">
                          {t('Journal.media.photo')}
                        </span>
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-popover px-2 text-muted-foreground">
                          {t('Journal.manualEntry')}
                        </span>
                      </div>
                    </div>
                    <form onSubmit={handleMealSubmit} className="space-y-3">
                      <div>
                        <Label htmlFor="foodName">{t('Journal.title1')}</Label>
                        <Input
                          id="foodName"
                          placeholder={t(
                            'foodNamePlaceholder.placeholder_foodName'
                          )}
                          value={foodName}
                          onChange={e => setFoodName(e.target.value)}
                          className="mt-1"
                          autoFocus
                        />
                      </div>

                      <div>
                        <Label htmlFor="mealType">
                          {t('mealType.label_mealType')}
                        </Label>
                        <select
                          id="mealType"
                          value={mealType}
                          onChange={e => setMealType(e.target.value)}
                          className="mt-1 block w-full border rounded p-2"
                        >
                          <option value="breakfast">
                            {t('mealType.option_breakfast')}
                          </option>
                          <option value="lunch">
                            {t('mealType.option_lunch')}
                          </option>
                          <option value="dinner">
                            {t('mealType.option_dinner')}
                          </option>
                          <option value="snack">
                            {t('mealType.option_snack')}
                          </option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="carbs">
                          {t('Journal.title2')} (g pour 100g) -{' '}
                          {t('Journal.optional')}
                        </Label>
                        <Input
                          id="carbs"
                          type="number"
                          placeholder="Ex: 25"
                          value={carbs}
                          onChange={e => setCarbs(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="portion">Portion (g)</Label>
                        <Input
                          id="portion"
                          type="number"
                          placeholder="Ex: 150"
                          value={portion}
                          onChange={e => setPortion(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                          id="notes"
                          placeholder={t(
                            'foodDetailsPlaceholder.placeholder_foodDetails'
                          )}
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={mealLoading}
                      >
                        {mealLoading
                          ? t('actionsRapides.loadingAdd')
                          : t('Journal.button')}
                      </Button>
                    </form>
                  </div>
                </ModalBody>
              </ModalContent>
            </Modal>

            {/* Médicaments */}
            <button
              className="flex flex-col items-center p-3 sm:p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors active:scale-95"
              onClick={() => setIsMedicationModalOpen(true)}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg sm:text-xl">💊</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                {t('Medication.title')}
              </span>
            </button>

            <Modal
              isOpen={isMedicationModalOpen}
              onClose={() => setIsMedicationModalOpen(false)}
              isCentered
            >
              <ModalOverlay />
              <ModalContent py={3}>
                <ModalHeader>
                  💊 {t('actionsRapides.Medication.subtitle')}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleMedicationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="medication">
                        {t('actionsRapides.Medication.title2')}
                      </Label>
                      <Select value={medication} onValueChange={setMedication}>
                        <SelectTrigger className="mt-1">
                          <SelectValue
                            placeholder={t('Medication.select.title')}
                          />
                        </SelectTrigger>

                        <SelectContent className="z-[9999] bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                          {/* Ultra-rapid insulins */}
                          <SelectItem value="insuline-ultra-rapide">
                            {t('actionsRapides.Medication.select.option.one')}
                          </SelectItem>
                          <SelectItem value="humalog">
                            {t('actionsRapides.Medication.select.option.two')}
                          </SelectItem>
                          <SelectItem value="novorapid">
                            {t('actionsRapides.Medication.select.option.three')}
                          </SelectItem>
                          <SelectItem value="apidra">
                            {t('actionsRapides.Medication.select.option.four')}
                          </SelectItem>
                          <SelectItem value="fiasp">
                            {t('actionsRapides.Medication.select.option.five')}
                          </SelectItem>

                          {/* Rapid insulins */}
                          <SelectItem value="insuline-rapide">
                            {t('actionsRapides.Medication.select.option.six')}
                          </SelectItem>
                          <SelectItem value="actrapid">
                            {t('actionsRapides.Medication.select.option.seven')}
                          </SelectItem>
                          <SelectItem value="humulin-r">
                            {t('actionsRapides.Medication.select.option.eight')}
                          </SelectItem>
                          <SelectItem value="insuman-rapid">
                            {t('actionsRapides.Medication.select.option.nine')}
                          </SelectItem>

                          {/* Intermediate insulins */}
                          <SelectItem value="insuline-intermediaire">
                            {t('actionsRapides.Medication.select.option.ten')}
                          </SelectItem>
                          <SelectItem value="insulatard">
                            {t(
                              'actionsRapides.Medication.select.option.eleven'
                            )}
                          </SelectItem>
                          <SelectItem value="humulin-n">
                            {t(
                              'actionsRapides.Medication.select.option.twelve'
                            )}
                          </SelectItem>
                          <SelectItem value="insuman-basal">
                            {t(
                              'actionsRapides.Medication.select.option.thirteen'
                            )}
                          </SelectItem>

                          {/* Long-acting insulins */}
                          <SelectItem value="insuline-lente">
                            {t(
                              'actionsRapides.Medication.select.option.fourteen'
                            )}
                          </SelectItem>
                          <SelectItem value="lantus">
                            {t(
                              'actionsRapides.Medication.select.option.fifteen'
                            )}
                          </SelectItem>
                          <SelectItem value="levemir">
                            {t(
                              'actionsRapides.Medication.select.option.sixteen'
                            )}
                          </SelectItem>
                          <SelectItem value="toujeo">
                            {t(
                              'actionsRapides.Medication.select.option.seventeen'
                            )}
                          </SelectItem>
                          <SelectItem value="tresiba">
                            {t(
                              'actionsRapides.Medication.select.option.eighteen'
                            )}
                          </SelectItem>
                          <SelectItem value="abasaglar">
                            {t(
                              'actionsRapides.Medication.select.option.nineteen'
                            )}
                          </SelectItem>

                          {/* Mixed insulins */}
                          <SelectItem value="insuline-mixte">
                            {t(
                              'actionsRapides.Medication.select.option.twenty'
                            )}
                          </SelectItem>
                          <SelectItem value="novomix">
                            {t(
                              'actionsRapides.Medication.select.option.twentyone'
                            )}
                          </SelectItem>
                          <SelectItem value="humalog-mix">
                            {t(
                              'actionsRapides.Medication.select.option.twentytwo'
                            )}
                          </SelectItem>
                          <SelectItem value="humulin-mix">
                            {t(
                              'actionsRapides.Medication.select.option.twentythree'
                            )}
                          </SelectItem>
                          <SelectItem value="insuman-comb">
                            {t(
                              'actionsRapides.Medication.select.option.twentyfour'
                            )}
                          </SelectItem>

                          {/* Other antidiabetics */}
                          <SelectItem value="metformine">
                            {t(
                              'actionsRapides.Medication.select.option.twentyfive'
                            )}
                          </SelectItem>
                          <SelectItem value="glucophage">
                            {t(
                              'actionsRapides.Medication.select.option.twentysix'
                            )}
                          </SelectItem>
                          <SelectItem value="stagid">
                            {t(
                              'actionsRapides.Medication.select.option.twentyseven'
                            )}
                          </SelectItem>
                          <SelectItem value="gliclazide">
                            {t(
                              'actionsRapides.Medication.select.option.twentyeight'
                            )}
                          </SelectItem>
                          <SelectItem value="diamicron">
                            {t(
                              'actionsRapides.Medication.select.option.twentynine'
                            )}
                          </SelectItem>
                          <SelectItem value="victoza">
                            {t(
                              'actionsRapides.Medication.select.option.thirty'
                            )}
                          </SelectItem>
                          <SelectItem value="ozempic">
                            {t(
                              'actionsRapides.Medication.select.option.thirtyone'
                            )}
                          </SelectItem>
                          <SelectItem value="trulicity">
                            {t(
                              'actionsRapides.Medication.select.option.thirtytwo'
                            )}
                          </SelectItem>
                          <SelectItem value="januvia">
                            {t(
                              'actionsRapides.Medication.select.option.thirtythree'
                            )}
                          </SelectItem>
                          <SelectItem value="forxiga">
                            {t(
                              'actionsRapides.Medication.select.option.thirtyfour'
                            )}
                          </SelectItem>

                          <SelectItem value="autre">
                            {t(
                              'actionsRapides.Medication.select.option.thirtyfive'
                            )}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dose">
                        {t('actionsRapides.Medication.dose')}{' '}
                        {t('Medication.unit')}
                      </Label>
                      <Input
                        id="dose"
                        type="number"
                        placeholder="Ex: 5"
                        value={dose}
                        onChange={e => setDose(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={medicationLoading}
                    >
                      {medicationLoading
                        ? t('actionsRapides.loadingSave')
                        : t('actionsRapides.Medication.button')}
                    </Button>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>

            {/* Activité */}
            <button
              className="flex flex-col items-center p-3 sm:p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors active:scale-95"
              onClick={() => setIsActivityModalOpen(true)}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg sm:text-xl">🏃</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                {t('Activity.title')}
              </span>
            </button>

            <Modal
              isOpen={isActivityModalOpen}
              onClose={() => setIsActivityModalOpen(false)}
              isCentered
            >
              <ModalOverlay />
              <ModalContent py={3} zIndex={1500}>
                <ModalHeader>🏃 {t('Activity.subtitle')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form
                    onSubmit={handleActivitySubmit}
                    className="space-y-4 py-6"
                  >
                    {/* Select Input */}
                    <div>
                      <Label htmlFor="activity">{t('Activity.type')}</Label>
                      <Select value={activity} onValueChange={setActivity}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder={t('Activity.select')} />
                        </SelectTrigger>

                        {/* ✅ Use SelectPortal to force dropdown above modal */}
                        <SelectPortal>
                          <SelectContent className="z-[9999] bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                            <SelectItem value="marche">
                              {t('Activity.Popover.one')}
                            </SelectItem>
                            <SelectItem value="course">
                              {t('Activity.Popover.two')}
                            </SelectItem>
                            <SelectItem value="velo">
                              {t('Activity.Popover.three')}
                            </SelectItem>
                            <SelectItem value="natation">
                              {t('Activity.Popover.four')}
                            </SelectItem>
                            <SelectItem value="musculation">
                              {t('Activity.Popover.five')}
                            </SelectItem>
                            <SelectItem value="autre">
                              {t('Activity.Popover.six')}
                            </SelectItem>
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </div>

                    {/* Duration Input */}
                    <div>
                      <Label htmlFor="duration">
                        {t('Activity.Duration')} (minutes)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="Ex: 30"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={activityLoading}
                    >
                      {activityLoading
                        ? t('actionsRapides.loadingSave')
                        : t('Activity.button')}
                    </Button>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>

            {/* Rappels */}
            <button
              onClick={handleRappelsClick}
              className="flex flex-col items-center p-3 sm:p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors active:scale-95 col-span-2 sm:col-span-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg sm:text-xl">⏰</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                Reminders
              </span>
            </button>
          </div>
        </div>

        {/* Modals for barcode/photo analysis */}
        <BarcodeScanModal
          isOpen={isBarcodeModalOpen}
          onClose={() => setIsBarcodeModalOpen(false)}
          onFoodSelected={food => {
            setFoodName(food.name);
            setCarbs(food.carbs.toString());
            toast({
              title: t('actionsRapides.Food.barcode.title'),
              description: t('actionsRapides.Food.barcode.description', {
                food: food.name,
                carbs: food.carbs,
              }),
            });
          }}
        />

        <PhotoAnalysisModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onFoodAnalyzed={food => {
            setFoodName(food.name);
            setCarbs(food.carbs.toString());
            toast({
              title: t('actionsRapides.Food.photo.title'),
              description: t('actionsRapides.Food.photo.description', {
                food: food.name,
                carbs: food.carbs,
              }),
            });
          }}
        />
      </div>
    );
  }
);

ActionsRapides.displayName = 'ActionsRapides';

export default ActionsRapides;
