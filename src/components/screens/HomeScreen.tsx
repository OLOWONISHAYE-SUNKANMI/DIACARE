import { useState } from "react";
import { Target, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import NativeHeader from "@/components/ui/NativeHeader";
import GlucoseWidget from "@/components/ui/GlucoseWidget";
import QuickActionsGrid from "@/components/ui/QuickActionsGrid";
import PredictiveAlerts from "@/components/ui/PredictiveAlerts";
import AddGlucoseModal from "@/components/modals/AddGlucoseModal";
import MealModal from "@/components/modals/ScanMealModal";
import MedicationModal from "@/components/modals/MedicationModal";
import ActivityModal from "@/components/modals/ActivityModal";
import useGlucoseData from "@/hooks/useGlucoseData";

interface HomeScreenProps {
  onTabChange?: (tab: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTabChange }) => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { getLatestReading, getTrend } = useGlucoseData();
  
  const latestReading = getLatestReading();
  const currentGlucose = latestReading?.value || 126;

  const challenges = [
    { letter: "D", challenge: t('homeScreen.measureGlucose'), completed: true },
    { letter: "A", challenge: t('homeScreen.takeMedication'), completed: false },
    { letter: "R", challenge: t('homeScreen.physicalActivity'), completed: false },
    { letter: "E", challenge: t('homeScreen.noteObservations'), completed: true },
  ];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen pb-24">
      {/* Native Header */}
      <NativeHeader userName="Amadou" />

      {/* Main Content */}
      <div className="space-y-6">
        {/* Glucose Widget */}
        <GlucoseWidget 
          currentGlucose={currentGlucose}
          lastReading={latestReading ? new Date(latestReading.timestamp).toLocaleString('fr-FR') : t('homeScreen.lastReading')}
          trend={getTrend()}
        />

        {/* Quick Actions */}
        <QuickActionsGrid onActionPress={(action) => {
          if (action === "reminders") {
            onTabChange?.("reminders");
          } else {
            setActiveModal(action);
          }
        }} />

        {/* Predictive Alerts */}
        <div className="px-4">
          <PredictiveAlerts />
        </div>

        {/* Mission DARE - Mobile Native */}
        <div className="px-4">
          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-medical-green to-medical-teal text-white">
              <CardTitle className="text-lg flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span>{t('homeScreen.mission')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-medical-green-light">
                  <div className="w-10 h-10 rounded-full bg-medical-green text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">D</div>
                  <p className="text-xs font-medium text-card-foreground">{t('homeScreen.diabetes')}</p>
                  <p className="text-xs text-muted-foreground">{t('homeScreen.management')}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-medical-teal-light">
                  <div className="w-10 h-10 rounded-full bg-medical-teal text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">A</div>
                  <p className="text-xs font-medium text-card-foreground">{t('homeScreen.awareness')}</p>
                  <p className="text-xs text-muted-foreground">{t('homeScreen.education')}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">R</div>
                  <p className="text-xs font-medium text-card-foreground">{t('homeScreen.routine')}</p>
                  <p className="text-xs text-muted-foreground">{t('homeScreen.daily')}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-50">
                  <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">E</div>
                  <p className="text-xs font-medium text-card-foreground">{t('homeScreen.empowerment')}</p>
                  <p className="text-xs text-muted-foreground">{t('homeScreen.control')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Défis DARE Aujourd'hui - Mobile Native */}
        <div className="px-4">
          <Card className="bg-white shadow-lg border-0 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-card-foreground flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-medical-green flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span>{t('homeScreen.todaysChallenges')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenges.map((challenge, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 active:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    challenge.completed ? 'bg-medical-green' : 'bg-gray-400'
                  }`}>
                    {challenge.letter}
                  </div>
                  <span className={`flex-1 text-sm font-medium ${challenge.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                    {challenge.challenge}
                  </span>
                  {challenge.completed ? (
                    <div className="w-6 h-6 rounded-full bg-medical-green flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Modals */}
      <AddGlucoseModal 
        isOpen={activeModal === "glucose"} 
        onClose={() => setActiveModal(null)} 
      />
      <MealModal 
        isOpen={activeModal === "meal"} 
        onClose={() => setActiveModal(null)} 
      />
      <MedicationModal 
        isOpen={activeModal === "medication"} 
        onClose={() => setActiveModal(null)} 
      />
      <ActivityModal 
        isOpen={activeModal === "activity"} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
};

export default HomeScreen;