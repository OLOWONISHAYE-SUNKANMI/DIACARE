import { useState } from "react";
import { Target, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NativeHeader from "@/components/ui/NativeHeader";
import GlucoseWidget from "@/components/ui/GlucoseWidget";
import QuickActionsGrid from "@/components/ui/QuickActionsGrid";
import PredictiveAlerts from "@/components/ui/PredictiveAlerts";
import AddGlucoseModal from "@/components/modals/AddGlucoseModal";
import MealModal from "@/components/modals/ScanMealModal";
import MedicationModal from "@/components/modals/MedicationModal";
import ActivityModal from "@/components/modals/ActivityModal";

interface HomeScreenProps {
  onTabChange?: (tab: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTabChange }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const currentGlucose = 126; // mg/dL

  const challenges = [
    { letter: "D", challenge: "Mesurer la glycémie 3x aujourd'hui", completed: true },
    { letter: "A", challenge: "Prendre ses médicaments à l'heure", completed: false },
    { letter: "R", challenge: "30 min d'activité physique", completed: false },
    { letter: "E", challenge: "Noter ses observations", completed: true },
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
          lastReading="Aujourd'hui 14:30"
          trend="stable"
        />

        {/* Quick Actions */}
        <QuickActionsGrid onActionPress={setActiveModal} />

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
                <span>Mission DARE</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-medical-green-light">
                  <div className="w-10 h-10 rounded-full bg-medical-green text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">D</div>
                  <p className="text-xs font-medium text-card-foreground">Diabetes</p>
                  <p className="text-xs text-muted-foreground">Gestion</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-medical-teal-light">
                  <div className="w-10 h-10 rounded-full bg-medical-teal text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">A</div>
                  <p className="text-xs font-medium text-card-foreground">Awareness</p>
                  <p className="text-xs text-muted-foreground">Éducation</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">R</div>
                  <p className="text-xs font-medium text-card-foreground">Routine</p>
                  <p className="text-xs text-muted-foreground">Quotidien</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-50">
                  <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-2">E</div>
                  <p className="text-xs font-medium text-card-foreground">Empowerment</p>
                  <p className="text-xs text-muted-foreground">Contrôle</p>
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
                <span>Défis Aujourd'hui</span>
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

        {/* Forfait DARE Premium - Mobile Native */}
        <div className="px-4 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Forfait DARE</h3>
          
          <Card className="bg-gradient-to-br from-medical-green to-medical-teal shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/10 backdrop-blur-sm p-6">
              <CardTitle className="text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">DARE Complet</span>
                    <Badge className="bg-white/20 text-white text-xs border-white/30 px-2 py-1">PREMIUM</Badge>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-1">5 000</div>
                  <div className="text-white/90">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white/5 backdrop-blur-sm">
              <p className="text-white/90 text-center font-medium mb-6">
                Votre santé n'a pas de prix
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  "Carnet glycémie illimité",
                  "Rappels d'insuline intelligents", 
                  "Graphiques style Clarity",
                  "Calculateur doses avancé",
                  "Support familial",
                  "Assistant IA DARE"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-white flex-1">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-white text-medical-green hover:bg-white/90 font-semibold py-4 rounded-2xl text-lg active:scale-95 transition-transform"
                  onClick={() => onTabChange?.('payment' as any)}
                >
                  Commencer mon suivi DARE
                </Button>
                <div className="text-center text-white/80 text-xs space-y-1">
                  <p>✨ Essai gratuit 7 jours</p>
                  <p>Annulable à tout moment • Support inclus</p>
                </div>
              </div>
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