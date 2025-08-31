import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

    // États pour Glycémie
    const [glucoseValue, setGlucoseValue] = useState('');
    const [glucoseNotes, setGlucoseNotes] = useState('');

    // États pour Repas
    const [foodName, setFoodName] = useState('');
    const [carbs, setCarbs] = useState('');

    // États pour Médicament
    const [medication, setMedication] = useState('');
    const [dose, setDose] = useState('');

    // États pour Activité
    const [activity, setActivity] = useState('');
    const [duration, setDuration] = useState('');

    // États pour les modals
    const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    const handleGlucoseSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!glucoseValue || isNaN(Number(glucoseValue))) {
        toast({
          title: 'Erreur',
          description: 'Veuillez entrer une valeur de glycémie valide',
          variant: 'destructive',
        });
        return;
      }

      addReading({
        value: Number(glucoseValue),
        timestamp: new Date().toISOString(),
        context: 'manual',
        notes: glucoseNotes || undefined,
      });

      toast({
        title: 'Mesure ajoutée',
        description: 'Votre glycémie a été enregistrée avec succès',
      });

      setGlucoseValue('');
      setGlucoseNotes('');
      onGlycemieClick?.();
    };

    const handleMealSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!foodName) {
        toast({
          title: 'Erreur',
          description: "Veuillez entrer un nom d'aliment",
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Repas ajouté',
        description: `${foodName} a été ajouté à votre journal`,
      });

      setFoodName('');
      setCarbs('');
      onMealClick?.();
    };

    const handleMedicationSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!medication || !dose) {
        toast({
          title: 'Erreur',
          description: 'Veuillez remplir tous les champs',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Médicament enregistré',
        description: `${medication} - ${dose} unités pris avec succès`,
      });

      setMedication('');
      setDose('');
      onMedicamentClick?.();
    };

    const handleActivitySubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!activity || !duration) {
        toast({
          title: 'Erreur',
          description: 'Veuillez remplir tous les champs',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Activité enregistrée',
        description: `${activity} pendant ${duration} minutes`,
      });

      setActivity('');
      setDuration('');
      onActivityClick?.();
    };

    const handleRappelsClick = () => {
      console.log('Rappels clicked - navigating to reminders');
      onTabChange?.('reminders');
    };

    const { t } = useTranslation();

    return (
      <div className="px-3 sm:px-4">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4">
            {t('Actions.actions')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Ajouter Glycémie - POPOVER */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex flex-col items-center p-3 sm:p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors active:scale-95">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg sm:text-xl">🩸</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                    {t('Actions.actionsPopover.bloodSugar.increment')}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <form onSubmit={handleGlucoseSubmit} className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    📊 {t('Actions.actionsPopover.title')}
                  </h3>
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
                  <Button type="submit" className="w-full">
                    {t('Actions.button')}
                  </Button>
                </form>
              </PopoverContent>
            </Popover>

            {/* Journal des repas - POPOVER */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex flex-col items-center p-3 sm:p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors active:scale-95">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg sm:text-xl">🍽️</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                    {t('Journal.title')}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    🍽️ {t('Journal.title')}
                  </h3>

                  {/* Options de saisie */}
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
                      <Label htmlFor="carbs">
                        {t('Journal.title2')} (g) - {t('Journal.optional')}
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
                    <Button type="submit" className="w-full">
                      {t('Journal.button')}
                    </Button>
                  </form>
                </div>
              </PopoverContent>
            </Popover>

            {/* Médicaments - POPOVER */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex flex-col items-center p-3 sm:p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors active:scale-95">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg sm:text-xl">💊</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                    {t('Medication.title')}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <form onSubmit={handleMedicationSubmit} className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    💊 {t('Medication.subtitle')}
                  </h3>
                  <div>
                    <Label htmlFor="medication">{t('Medication.title2')}</Label>
                    <Select value={medication} onValueChange={setMedication}>
                      <SelectTrigger className="mt-1">
                        <SelectValue
                          placeholder={t('Medication.select.title')}
                        />
                      </SelectTrigger>
                      <SelectContent>
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
                  <Button type="submit" className="w-full">
                    {t('Medication.button')}
                  </Button>
                </form>
              </PopoverContent>
            </Popover>

            {/* Activité - POPOVER */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex flex-col items-center p-3 sm:p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors active:scale-95">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg sm:text-xl">🏃</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                    {t('Activity.title')}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <form onSubmit={handleActivitySubmit} className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    🏃 {t('Activity.subtitle')}
                  </h3>
                  <div>
                    <Label htmlFor="activity">{t('Activity.type')}</Label>
                    <Select value={activity} onValueChange={setActivity}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={t('Activity.select')} />
                      </SelectTrigger>
                      <SelectContent>
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
                    </Select>
                  </div>
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
                  <Button type="submit" className="w-full">
                    {t('Activity.button')}
                  </Button>
                </form>
              </PopoverContent>
            </Popover>

            {/* Rappels - FONCTIONNEL */}
            <button
              onClick={handleRappelsClick}
              className="flex flex-col items-center p-3 sm:p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors active:scale-95 col-span-2 sm:col-span-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-lg sm:text-xl">⏰</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
                Rappels
              </span>
            </button>
          </div>
        </div>

        {/* Modals */}
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
// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useToast } from '@/hooks/use-toast';
// import { useGlucose } from '@/contexts/GlucoseContext';
// import BarcodeScanModal from '@/components/modals/BarcodeScanModal';
// import PhotoAnalysisModal from '@/components/modals/PhotoAnalysisModal';

// import { useTranslation } from 'react-i18next';

// interface ActionsRapidesProps {
//   onTabChange?: (tab: string) => void;
//   onGlycemieClick?: () => void;
//   onMedicamentClick?: () => void;
//   onMealClick?: () => void;
//   onActivityClick?: () => void;
// }

// const ActionsRapides: React.FC<ActionsRapidesProps> = React.memo(
//   ({
//     onTabChange,
//     onGlycemieClick,
//     onMedicamentClick,
//     onMealClick,
//     onActivityClick,
//   }) => {
//     const { toast } = useToast();
//     const { addReading } = useGlucose();

//     // États pour Glycémie
//     const [glucoseValue, setGlucoseValue] = useState('');
//     const [glucoseNotes, setGlucoseNotes] = useState('');

//     // États pour Repas
//     const [foodName, setFoodName] = useState('');
//     const [carbs, setCarbs] = useState('');

//     // États pour Médicament
//     const [medication, setMedication] = useState('');
//     const [dose, setDose] = useState('');

//     // États pour Activité
//     const [activity, setActivity] = useState('');
//     const [duration, setDuration] = useState('');

//     // États pour les modals
//     const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
//     const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

//     const handleGlucoseSubmit = (e: React.FormEvent) => {
//       e.preventDefault();

//       if (!glucoseValue || isNaN(Number(glucoseValue))) {
//         toast({
//           title: 'Erreur',
//           description: 'Veuillez entrer une valeur de glycémie valide',
//           variant: 'destructive',
//         });
//         return;
//       }

//       addReading({
//         value: Number(glucoseValue),
//         timestamp: new Date().toISOString(),
//         context: 'manual',
//         notes: glucoseNotes || undefined,
//       });

//       toast({
//         title: 'Mesure ajoutée',
//         description: 'Votre glycémie a été enregistrée avec succès',
//       });

//       setGlucoseValue('');
//       setGlucoseNotes('');
//       onGlycemieClick?.();
//     };

//     const handleMealSubmit = (e: React.FormEvent) => {
//       e.preventDefault();

//       if (!foodName) {
//         toast({
//           title: 'Erreur',
//           description: "Veuillez entrer un nom d'aliment",
//           variant: 'destructive',
//         });
//         return;
//       }

//       toast({
//         title: 'Repas ajouté',
//         description: `${foodName} a été ajouté à votre journal`,
//       });

//       setFoodName('');
//       setCarbs('');
//       onMealClick?.();
//     };

//     const handleMedicationSubmit = (e: React.FormEvent) => {
//       e.preventDefault();

//       if (!medication || !dose) {
//         toast({
//           title: 'Erreur',
//           description: 'Veuillez remplir tous les champs',
//           variant: 'destructive',
//         });
//         return;
//       }

//       toast({
//         title: 'Médicament enregistré',
//         description: `${medication} - ${dose} unités pris avec succès`,
//       });

//       setMedication('');
//       setDose('');
//       onMedicamentClick?.();
//     };

//     const handleActivitySubmit = (e: React.FormEvent) => {
//       e.preventDefault();

//       if (!activity || !duration) {
//         toast({
//           title: 'Erreur',
//           description: 'Veuillez remplir tous les champs',
//           variant: 'destructive',
//         });
//         return;
//       }

//       toast({
//         title: 'Activité enregistrée',
//         description: `${activity} pendant ${duration} minutes`,
//       });

//       setActivity('');
//       setDuration('');
//       onActivityClick?.();
//     };

//     const handleRappelsClick = () => {
//       console.log('Rappels clicked - navigating to reminders');
//       onTabChange?.('reminders');
//     };

//     const { t } = useTranslation();

//     return (
//       <div className="px-3 sm:px-4">
//         <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
//           <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4">
//             {t('Actions.actions')}
//           </h3>
//           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
//             {/* Ajouter Glycémie - DIALOG */}
//             <Dialog>
//               <DialogTrigger asChild>
//                 <button className="flex flex-col items-center p-3 sm:p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors active:scale-95">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
//                     <span className="text-lg sm:text-xl">🩸</span>
//                   </div>
//                   <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
//                     {t('Actions.actionsPopover.bloodSugar.increment')}
//                   </span>
//                 </button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <form onSubmit={handleGlucoseSubmit} className="space-y-4">
//                   <h3 className="font-semibold text-lg">
//                     📊 {t('Actions.actionsPopover.title')}
//                   </h3>
//                   <div>
//                     <Label htmlFor="glucose">
//                       {t('Actions.actionsPopover.input1')} (mg/dL)
//                     </Label>
//                     <Input
//                       id="glucose"
//                       type="number"
//                       placeholder="Ex: 120"
//                       value={glucoseValue}
//                       onChange={e => setGlucoseValue(e.target.value)}
//                       className="mt-1"
//                       autoFocus
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="glucoseNotes">
//                       Notes ({t('Actions.actionsPopover.notes')})
//                     </Label>
//                     <Input
//                       id="glucoseNotes"
//                       placeholder={t('Actions.actionsPopover.comments')}
//                       value={glucoseNotes}
//                       onChange={e => setGlucoseNotes(e.target.value)}
//                       className="mt-1"
//                     />
//                   </div>
//                   <Button type="submit" className="w-full">
//                     {t('Actions.button')}
//                   </Button>
//                 </form>
//               </DialogContent>
//             </Dialog>

//             {/* Journal des repas - DIALOG */}
//             <Dialog>
//               <DialogTrigger asChild>
//                 <button className="flex flex-col items-center p-3 sm:p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors active:scale-95">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
//                     <span className="text-lg sm:text-xl">🍽️</span>
//                   </div>
//                   <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
//                     {t('Journal.title')}
//                   </span>
//                 </button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-lg">
//                     🍽️ {t('Journal.title')}
//                   </h3>

//                   {/* Options de saisie */}
//                   <div className="grid grid-cols-2 gap-2">
//                     <Button
//                       variant="outline"
//                       className="flex flex-col items-center p-4 h-auto"
//                       onClick={() => setIsBarcodeModalOpen(true)}
//                     >
//                       <span className="text-xl mb-1">📱</span>
//                       <span className="text-xs">
//                         {t('Journal.media.scanner')}
//                       </span>
//                     </Button>

//                     <Button
//                       variant="outline"
//                       className="flex flex-col items-center p-4 h-auto"
//                       onClick={() => setIsPhotoModalOpen(true)}
//                     >
//                       <span className="text-xl mb-1">📸</span>
//                       <span className="text-xs">
//                         {t('Journal.media.photo')}
//                       </span>
//                     </Button>
//                   </div>

//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <span className="w-full border-t" />
//                     </div>
//                     <div className="relative flex justify-center text-xs uppercase">
//                       <span className="bg-popover px-2 text-muted-foreground">
//                         {t('Journal.manualEntry')}
//                       </span>
//                     </div>
//                   </div>

//                   <form onSubmit={handleMealSubmit} className="space-y-3">
//                     <div>
//                       <Label htmlFor="foodName">{t('Journal.title1')}</Label>
//                       <Input
//                         id="foodName"
//                         placeholder="Ex: Pomme, Riz, Salade..."
//                         value={foodName}
//                         onChange={e => setFoodName(e.target.value)}
//                         className="mt-1"
//                         autoFocus
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="carbs">
//                         {t('Journal.title2')} (g) - {t('Journal.optional')}
//                       </Label>
//                       <Input
//                         id="carbs"
//                         type="number"
//                         placeholder="Ex: 25"
//                         value={carbs}
//                         onChange={e => setCarbs(e.target.value)}
//                         className="mt-1"
//                       />
//                     </div>
//                     <Button type="submit" className="w-full">
//                       {t('Journal.button')}
//                     </Button>
//                   </form>
//                 </div>
//               </DialogContent>
//             </Dialog>

//             {/* Médicaments - DIALOG */}
//             <Dialog>
//               <DialogTrigger asChild>
//                 <button className="flex flex-col items-center p-3 sm:p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors active:scale-95">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-full flex items-center justify-center mb-2">
//                     <span className="text-lg sm:text-xl">💊</span>
//                   </div>
//                   <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
//                     {t('Medication.title')}
//                   </span>
//                 </button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <form onSubmit={handleMedicationSubmit} className="space-y-4">
//                   <h3 className="font-semibold text-lg">
//                     💊 {t('Medication.subtitle')}
//                   </h3>
//                   <div>
//                     <Label htmlFor="medication">{t('Medication.title2')}</Label>
//                     <Select value={medication} onValueChange={setMedication}>
//                       <SelectTrigger className="mt-1">
//                         <SelectValue
//                           placeholder={t('Medication.select.title')}
//                         />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {/* Insulines ultra-rapides */}
//                         <SelectItem value="insuline-ultra-rapide">
//                           {t('medication.select.option.one')}
//                         </SelectItem>
//                         <SelectItem value="humalog">
//                           {t('Medication.select.option.two')}
//                         </SelectItem>
//                         <SelectItem value="novorapid">
//                           {t('Medication.select.option.three')}
//                         </SelectItem>
//                         <SelectItem value="apidra">
//                           {t('Medication.select.option.four')}
//                         </SelectItem>
//                         <SelectItem value="fiasp">
//                           {t('Medication.select.option.five')}
//                         </SelectItem>

//                         {/* Rapid Insulins */}
//                         <SelectItem value="insuline-rapide">
//                           {t('Medication.select.option.six')}
//                         </SelectItem>
//                         <SelectItem value="actrapid">
//                           {t('Medication.select.option.seven')}
//                         </SelectItem>
//                         <SelectItem value="humulin-r">
//                           {t('Medication.select.option.eight')}
//                         </SelectItem>
//                         <SelectItem value="insuman-rapid">
//                           {t('Medication.select.option.nine')}
//                         </SelectItem>

//                         {/* Intermediate Insulins */}
//                         <SelectItem value="insuline-intermediaire">
//                           {t('Medication.select.option.ten')}
//                         </SelectItem>
//                         <SelectItem value="insulatard">
//                           {t('Medication.select.option.eleven')}
//                         </SelectItem>
//                         <SelectItem value="humulin-n">
//                           {t('Medication.select.option.twelve')}
//                         </SelectItem>
//                         <SelectItem value="insuman-basal">
//                           {t('Medication.select.option.thirteen')}
//                         </SelectItem>

//                         {/* Long-Acting Insulins */}
//                         <SelectItem value="insuline-lente">
//                           {t('Medication.select.option.fourteen')}
//                         </SelectItem>
//                         <SelectItem value="lantus">
//                           {t('Medication.select.option.fifteen')}
//                         </SelectItem>
//                         <SelectItem value="levemir">
//                           {t('Medication.select.option.sixteen')}
//                         </SelectItem>
//                         <SelectItem value="toujeo">
//                           {t('Medication.select.option.seventeen')}
//                         </SelectItem>
//                         <SelectItem value="tresiba">
//                           {t('Medication.select.option.eighteen')}
//                         </SelectItem>
//                         <SelectItem value="abasaglar">
//                           {t('Medication.select.option.nineteen')}
//                         </SelectItem>

//                         {/* Mixed Insulins */}
//                         <SelectItem value="insuline-mixte">
//                           {t('Medication.select.option.twenty')}
//                         </SelectItem>
//                         <SelectItem value="novomix">
//                           {t('Medication.select.option.twentyone')}
//                         </SelectItem>
//                         <SelectItem value="humalog-mix">
//                           {t('Medication.select.option.twentytwo')}
//                         </SelectItem>
//                         <SelectItem value="humulin-mix">
//                           {t('Medication.select.option.twentythree')}
//                         </SelectItem>
//                         <SelectItem value="insuman-comb">
//                           {t('Medication.select.option.twentyfour')}
//                         </SelectItem>

//                         {/* Other Antidiabetics */}
//                         <SelectItem value="metformine">
//                           {t('Medication.select.option.twentyfive')}
//                         </SelectItem>
//                         <SelectItem value="glucophage">
//                           {t('Medication.select.option.twentysix')}
//                         </SelectItem>
//                         <SelectItem value="stagid">
//                           {t('Medication.select.option.twentyseven')}
//                         </SelectItem>
//                         <SelectItem value="gliclazide">
//                           {t('Medication.select.option.twentyeight')}
//                         </SelectItem>
//                         <SelectItem value="diamicron">
//                           {t('Medication.select.option.twentynine')}
//                         </SelectItem>
//                         <SelectItem value="victoza">
//                           {t('Medication.select.option.thirty')}
//                         </SelectItem>
//                         <SelectItem value="ozempic">
//                           {t('Medication.select.option.thirtyone')}
//                         </SelectItem>
//                         <SelectItem value="trulicity">
//                           {t('Medication.select.option.thirtytwo')}
//                         </SelectItem>
//                         <SelectItem value="januvia">
//                           {t('Medication.select.option.thirtythree')}
//                         </SelectItem>
//                         <SelectItem value="forxiga">
//                           {t('Medication.select.option.thirtyfour')}
//                         </SelectItem>

//                         <SelectItem value="autre">
//                           {t('Medication.select.option.thirtyfive')}
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="dose">
//                       {t('Medication.dose')} {t('Medication.unit')}
//                     </Label>
//                     <Input
//                       id="dose"
//                       type="number"
//                       placeholder="Ex: 5"
//                       value={dose}
//                       onChange={e => setDose(e.target.value)}
//                       className="mt-1"
//                     />
//                   </div>
//                   <Button type="submit" className="w-full">
//                     {t('Medication.button')}
//                     </Button>
//                 </form>
//               </DialogContent>
//             </Dialog>

//             {/* Activité - DIALOG */}
//             <Dialog>
//               <DialogTrigger asChild>
//                 <button className="flex flex-col items-center p-3 sm:p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors active:scale-95">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2">
//                     <span className="text-lg sm:text-xl">🏃</span>
//                   </div>
//                   <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
//                     {t('Activity.title')}
//                   </span>
//                 </button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <form onSubmit={handleActivitySubmit} className="space-y-4">
//                   <h3 className="font-semibold text-lg">
//                     🏃 {t('Activity.subtitle')}
//                   </h3>
//                   <div>
//                     <Label htmlFor="activity">{t('Activity.type')}</Label>
//                     <Select value={activity} onValueChange={setActivity}>
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder={t('Activity.select')} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="marche">
//                           {t('Activity.Popover.one')}
//                         </SelectItem>
//                         <SelectItem value="course">
//                           {t('Activity.Popover.two')}
//                         </SelectItem>
//                         <SelectItem value="velo">
//                           {t('Activity.Popover.three')}
//                         </SelectItem>
//                         <SelectItem value="natation">
//                           {t('Activity.Popover.four')}
//                         </SelectItem>
//                         <SelectItem value="musculation">
//                           {t('Activity.Popover.five')}
//                         </SelectItem>
//                         <SelectItem value="autre">
//                           {t('Activity.Popover.six')}
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="duration">
//                       {t('Activity.Duration')} (minutes)
//                     </Label>
//                     <Input
//                       id="duration"
//                       type="number"
//                       placeholder="Ex: 30"
//                       value={duration}
//                       onChange={e => setDuration(e.target.value)}
//                       className="mt-1"
//                     />
//                   </div>
//                   <Button type="submit" className="w-full">
//                     {t('Activity.button')}
//                   </Button>
//                 </form>
//               </DialogContent>
//             </Dialog>

//             {/* Rappels - FONCTIONNEL */}
//             <button
//               onClick={handleRappelsClick}
//               className="flex flex-col items-center p-3 sm:p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors active:scale-95 col-span-2 sm:col-span-1"
//             >
//               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
//                 <span className="text-lg sm:text-xl">⏰</span>
//               </div>
//               <span className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">
//                 Rappels
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* Modals */}
//         <BarcodeScanModal
//           isOpen={isBarcodeModalOpen}
//           onClose={() => setIsBarcodeModalOpen(false)}
//           onFoodSelected={food => {
//             setFoodName(food.name);
//             setCarbs(food.carbs.toString());
//             toast({
//               title: 'Produit ajouté',
//               description: `${food.name} - ${food.carbs}g de glucides`,
//             });
//           }}
//         />

//         <PhotoAnalysisModal
//           isOpen={isPhotoModalOpen}
//           onClose={() => setIsPhotoModalOpen(false)}
//           onFoodAnalyzed={food => {
//             setFoodName(food.name);
//             setCarbs(food.carbs.toString());
//             toast({
//               title: 'Analyse terminée',
//               description: `${food.name} - ${food.carbs}g de glucides estimés`,
//             });
//           }}
//         />
//       </div>
//     );
//   }
// );

// ActionsRapides.displayName = 'ActionsRapides';

// export default ActionsRapides;