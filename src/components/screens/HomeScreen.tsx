import { useState } from "react";
import { Target, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import NativeHeader from "@/components/ui/NativeHeader";
import GlucoseWidget from "@/components/ui/GlucoseWidget";
import ActionsRapides from "@/components/ui/ActionsRapides";
import PredictiveAlerts from "@/components/ui/PredictiveAlerts";
import SimpleGlucoseModal from "@/components/modals/SimpleGlucoseModal";
import SimpleMedicationModal from "@/components/modals/SimpleMedicationModal";
import CompleteMealModal from "@/components/modals/CompleteMealModal";
import SimpleActivityModal from "@/components/modals/SimpleActivityModal";
import { useGlucose } from "@/contexts/GlucoseContext";

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
  
  console.log("Modal states - showAddMeasure:", showAddMeasure, "showAddDose:", showAddDose);
  
  const latestReading = getLatestReading();
  const currentGlucose = latestReading?.value || 126;


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

        {/* Actions Rapides - FONCTIONNELLES */}
        <ActionsRapides
          onTabChange={onTabChange}
          onGlycemieClick={() => {
            console.log("Setting showAddMeasure to true");
            setShowAddMeasure(true);
          }}
          onMedicamentClick={() => {
            console.log("Setting showAddDose to true"); 
            setShowAddDose(true);
          }}
          onMealClick={() => {
            console.log("Setting showAddMeal to true"); 
            setShowAddMeal(true);
          }}
          onActivityClick={() => {
            console.log("Setting showAddActivity to true"); 
            setShowAddActivity(true);
          }}
        />

        {/* Predictive Alerts */}
        <div className="px-4">
          <PredictiveAlerts />
        </div>

        {/* Mission DARE */}
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
            <CardContent className="p-6">
              <p className="text-card-foreground text-sm leading-relaxed">
                Notre mission est de vous aider à mieux comprendre et gérer votre diabète avec des outils adaptés à votre réalité.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Toutes les Modales Simples */}
      <SimpleGlucoseModal 
        isOpen={showAddMeasure} 
        onClose={() => setShowAddMeasure(false)} 
      />
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