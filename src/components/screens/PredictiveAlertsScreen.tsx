import React from 'react';
import { Brain, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimplifiedPredictiveAlerts from '@/components/ui/SimplifiedPredictiveAlerts';

const PredictiveAlertsScreen: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-xl">
            <Brain className="w-8 h-8" />
            <div>
              <h1 className="font-bold">Système d'IA Prédictive</h1>
              <p className="text-sm opacity-90 font-normal">
                Intelligence Artificielle • Machine Learning • Alertes Temps Réel
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <Zap className="w-6 h-6 mx-auto opacity-80" />
              <div className="text-sm font-semibold">Analyse Multi-facteurs</div>
              <div className="text-xs opacity-75">Glycémie, Repas, Insuline, Âge, Activités</div>
            </div>
            <div className="space-y-1">
              <Brain className="w-6 h-6 mx-auto opacity-80" />
              <div className="text-sm font-semibold">IA Prédictive</div>
              <div className="text-xs opacity-75">Détection précoce des risques</div>
            </div>
            <div className="space-y-1">
              <Users className="w-6 h-6 mx-auto opacity-80" />
              <div className="text-sm font-semibold">Alertes Famille</div>
              <div className="text-xs opacity-75">Notifications simultanées</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Alerts Component */}
      <SimplifiedPredictiveAlerts />
    </div>
  );
};

export default PredictiveAlertsScreen;