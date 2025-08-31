import { useState } from 'react';
import { Target, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import NativeHeader from '@/components/ui/NativeHeader';
import GlucoseWidget from '@/components/ui/GlucoseWidget';
import ActionsRapides from '@/components/ui/ActionsRapides';
import PredictiveAlerts from '@/components/ui/PredictiveAlerts';
import SimpleGlucoseModal from '@/components/modals/SimpleGlucoseModal';
import SimpleMedicationModal from '@/components/modals/SimpleMedicationModal';
import CompleteMealModal from '@/components/modals/CompleteMealModal';
import SimpleActivityModal from '@/components/modals/SimpleActivityModal';
import { useGlucose } from '@/contexts/GlucoseContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../Modal';

interface HomeScreenProps {
  onTabChange?: (tab: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTabChange }) => {
  const { t } = useTranslation();
  const [showAddMeasure, setShowAddMeasure] = useState(false);
  const [showAddDose, setShowAddDose] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const { getLatestReading, getTrend } = useGlucose();

  console.log(
    'Modal states - showAddMeasure:',
    showAddMeasure,
    'showAddDose:',
    showAddDose
  );

  const latestReading = getLatestReading();
  const currentGlucose = latestReading?.value || 126;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen pb-20 sm:pb-24 overflow-x-hidden">
      {/* Native Header */}
      <NativeHeader userName="Amadou" />

      {/* Main Content */}
      <div className="space-y-4 sm:space-y-6 pb-4">
        {/* Glucose Widget */}
        <GlucoseWidget
          currentGlucose={currentGlucose}
          lastReading={
            latestReading
              ? new Date(latestReading.timestamp).toLocaleString('fr-FR')
              : t('homeScreen.lastReading')
          }
          trend={getTrend()}
        />
        {/* <div className="relative top[-20rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Modal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] absolute md:top-[-50vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
              </div>
            </DialogContent>
          </Dialog>
        </div> */}
        
        {/* Actions Rapides - FONCTIONNELLES */}
        <ActionsRapides
          onTabChange={onTabChange}
          onGlycemieClick={() => {
            console.log('Setting showAddMeasure to true');
            setShowAddMeasure(true);
          }}
          onMedicamentClick={() => {
            console.log('Setting showAddDose to true');
            setShowAddDose(true);
          }}
          onMealClick={() => {
            console.log('Setting showAddMeal to true');
            setShowAddMeal(true);
          }}
          onActivityClick={() => {
            console.log('Setting showAddActivity to true');
            setShowAddActivity(true);
          }}
        />

        {/* Predictive Alerts */}
        <div className="px-3 sm:px-4">
          <PredictiveAlerts />
        </div>

        {/* Mission DiabCare */}
        <div className="px-3 sm:px-4">
          <Card className="bg-white shadow-lg border-0 rounded-xl sm:rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-medical-green to-medical-teal text-white p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="leading-tight">{t('mission.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <p className="text-card-foreground text-sm sm:text-base leading-relaxed">
                {t('mission.message')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <SimpleGlucoseModal
        isOpen={showAddMeasure}
        onClose={() => setShowAddMeasure(false)}
      />

      {/* Toutes les Modales Simples */}
      <SimpleMedicationModal
        isOpen={showAddDose}
        onClose={() => setShowAddDose(false)}
      />
      <CompleteMealModal
        isOpen={showAddMeal}
        onClose={() => setShowAddMeal(false)}
      />
      <SimpleActivityModal
        isOpen={showAddActivity}
        onClose={() => setShowAddActivity(false)}
      />
    </div>
  );
};

export default HomeScreen;
