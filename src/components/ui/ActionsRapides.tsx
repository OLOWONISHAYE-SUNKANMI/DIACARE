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
          title: 'Erreur',
          description: 'Veuillez entrer une valeur de glycémie valide',
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
        console.error('Erreur ajout glycémie:', error);
        toast({
          title: 'Erreur',
          description: "Impossible d'enregistrer votre mesure",
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
          title: 'Erreur',
          description: "Veuillez entrer un nom d'aliment",
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
          title: 'Repas ajouté',
          description: `${foodName} a été ajouté à votre journal`,
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
          title: 'Erreur',
          description: "Impossible d'ajouter le repas",
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
          title: 'Erreur',
          description: 'Veuillez remplir tous les champs',
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
          title: 'Médicament enregistré',
          description: `${medication} - ${dose} unités pris avec succès`,
        });

        setMedication('');
        setDose('');
        setIsMedicationModalOpen(false);
        onMedicamentClick?.();
      } catch (err) {
        console.error(err);
        toast({
          title: 'Erreur',
          description: "Impossible d'ajouter le médicament",
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
          title: 'Erreur',
          description: 'Veuillez remplir tous les champs',
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
          title: 'Activité enregistrée',
          description: `${activity} pendant ${duration} minutes`,
        });

        setActivity('');
        setDuration('');
        setIsActivityModalOpen(false);
        onActivityClick?.();
      } catch (err) {
        console.error(err);
        toast({
          title: 'Erreur',
          description: "Impossible d'ajouter l'activité",
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
                        ? 'Enregistrement...'
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
                          placeholder="Ex: Pomme, Riz, Salade..."
                          value={foodName}
                          onChange={e => setFoodName(e.target.value)}
                          className="mt-1"
                          autoFocus
                        />
                      </div>

                      <div>
                        <Label htmlFor="mealType">Type de repas</Label>
                        <select
                          id="mealType"
                          value={mealType}
                          onChange={e => setMealType(e.target.value)}
                          className="mt-1 block w-full border rounded p-2"
                        >
                          <option value="breakfast">Petit-déjeuner</option>
                          <option value="lunch">Déjeuner</option>
                          <option value="dinner">Dîner</option>
                          <option value="snack">Snack</option>
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
                          placeholder="Ex: Avec du poulet, sauce légère..."
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
                        {mealLoading ? 'Ajout...' : t('Journal.button')}
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
                <ModalHeader>💊 {t('Medication.subtitle')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleMedicationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="medication">
                        {t('Medication.title2')}
                      </Label>
                      <Select value={medication} onValueChange={setMedication}>
                        <SelectTrigger className="mt-1">
                          <SelectValue
                            placeholder={t('Medication.select.title')}
                          />
                        </SelectTrigger>

                        <SelectContent className="z-[9999] bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                          {/* Insulines ultra-rapides */}
                          <SelectItem value="insuline-ultra-rapide">
                            {t('medication.select.option.one')}
                          </SelectItem>
                          <SelectItem value="humalog">
                            {t('Medication.select.option.two')}
                          </SelectItem>
                          <SelectItem value="novorapid">
                            {t('Medication.select.option.three')}
                          </SelectItem>
                          <SelectItem value="apidra">
                            {t('Medication.select.option.four')}
                          </SelectItem>
                          <SelectItem value="fiasp">
                            {t('Medication.select.option.five')}
                          </SelectItem>

                          {/* Rapid Insulins */}
                          <SelectItem value="insuline-rapide">
                            {t('Medication.select.option.six')}
                          </SelectItem>
                          <SelectItem value="actrapid">
                            {t('Medication.select.option.seven')}
                          </SelectItem>
                          <SelectItem value="humulin-r">
                            {t('Medication.select.option.eight')}
                          </SelectItem>
                          <SelectItem value="insuman-rapid">
                            {t('Medication.select.option.nine')}
                          </SelectItem>

                          {/* Intermediate Insulins */}
                          <SelectItem value="insuline-intermediaire">
                            {t('Medication.select.option.ten')}
                          </SelectItem>
                          <SelectItem value="insulatard">
                            {t('Medication.select.option.eleven')}
                          </SelectItem>
                          <SelectItem value="humulin-n">
                            {t('Medication.select.option.twelve')}
                          </SelectItem>
                          <SelectItem value="insuman-basal">
                            {t('Medication.select.option.thirteen')}
                          </SelectItem>

                          {/* Long-Acting Insulins */}
                          <SelectItem value="insuline-lente">
                            {t('Medication.select.option.fourteen')}
                          </SelectItem>
                          <SelectItem value="lantus">
                            {t('Medication.select.option.fifteen')}
                          </SelectItem>
                          <SelectItem value="levemir">
                            {t('Medication.select.option.sixteen')}
                          </SelectItem>
                          <SelectItem value="toujeo">
                            {t('Medication.select.option.seventeen')}
                          </SelectItem>
                          <SelectItem value="tresiba">
                            {t('Medication.select.option.eighteen')}
                          </SelectItem>
                          <SelectItem value="abasaglar">
                            {t('Medication.select.option.nineteen')}
                          </SelectItem>

                          {/* Mixed Insulins */}
                          <SelectItem value="insuline-mixte">
                            {t('Medication.select.option.twenty')}
                          </SelectItem>
                          <SelectItem value="novomix">
                            {t('Medication.select.option.twentyone')}
                          </SelectItem>
                          <SelectItem value="humalog-mix">
                            {t('Medication.select.option.twentytwo')}
                          </SelectItem>
                          <SelectItem value="humulin-mix">
                            {t('Medication.select.option.twentythree')}
                          </SelectItem>
                          <SelectItem value="insuman-comb">
                            {t('Medication.select.option.twentyfour')}
                          </SelectItem>

                          {/* Other Antidiabetics */}
                          <SelectItem value="metformine">
                            {t('Medication.select.option.twentyfive')}
                          </SelectItem>
                          <SelectItem value="glucophage">
                            {t('Medication.select.option.twentysix')}
                          </SelectItem>
                          <SelectItem value="stagid">
                            {t('Medication.select.option.twentyseven')}
                          </SelectItem>
                          <SelectItem value="gliclazide">
                            {t('Medication.select.option.twentyeight')}
                          </SelectItem>
                          <SelectItem value="diamicron">
                            {t('Medication.select.option.twentynine')}
                          </SelectItem>
                          <SelectItem value="victoza">
                            {t('Medication.select.option.thirty')}
                          </SelectItem>
                          <SelectItem value="ozempic">
                            {t('Medication.select.option.thirtyone')}
                          </SelectItem>
                          <SelectItem value="trulicity">
                            {t('Medication.select.option.thirtytwo')}
                          </SelectItem>
                          <SelectItem value="januvia">
                            {t('Medication.select.option.thirtythree')}
                          </SelectItem>
                          <SelectItem value="forxiga">
                            {t('Medication.select.option.thirtyfour')}
                          </SelectItem>

                          <SelectItem value="autre">
                            {t('Medication.select.option.thirtyfive')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dose">
                        {t('Medication.dose')} {t('Medication.unit')}
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
                        ? 'Enregistrement...'
                        : t('Medication.button')}
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
                        ? 'Enregistrement...'
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
              title: 'Produit ajouté',
              description: `${food.name} - ${food.carbs}g de glucides`,
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
              title: 'Analyse terminée',
              description: `${food.name} - ${food.carbs}g de glucides estimés`,
            });
          }}
        />
      </div>
    );
  }
);

ActionsRapides.displayName = 'ActionsRapides';

export default ActionsRapides;
