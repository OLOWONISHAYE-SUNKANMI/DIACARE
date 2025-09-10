import React from 'react';
import { Brain, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimplifiedPredictiveAlerts from '@/components/ui/SimplifiedPredictiveAlerts';
import { useTranslation } from 'react-i18next';

const PredictiveAlertsScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-xl">
            <Brain className="w-8 h-8" />
            <div>
              <h1 className="font-bold">
                {t('predictiveAlertsScreen.aiSystem.title')}
              </h1>
              <p className="text-sm opacity-90 font-normal">
                {t('predictiveAlertsScreen.aiSystem.subtitle')}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <Zap className="w-6 h-6 mx-auto opacity-80" />
              <div className="space-y-1 text-center">
                <div className="text-sm font-semibold">
                  {t(
                    'predictiveAlertsScreen.aiFeatures.multiFactorAnalysis.title'
                  )}
                </div>
                <div className="text-xs opacity-75">
                  {t(
                    'predictiveAlertsScreen.aiFeatures.multiFactorAnalysis.description'
                  )}
                </div>
              </div>

              {/* Predictive AI */}
              <div className="space-y-1 text-center">
                <Brain className="w-6 h-6 mx-auto opacity-80" />
                <div className="text-sm font-semibold">
                  {t('predictiveAlertsScreen.aiFeatures.predictiveAI.title')}
                </div>
                <div className="text-xs opacity-75">
                  {t(
                    'predictiveAlertsScreen.aiFeatures.predictiveAI.description'
                  )}
                </div>
              </div>

              {/* Family Alerts */}
              <div className="space-y-1 text-center">
                <Users className="w-6 h-6 mx-auto opacity-80" />
                <div className="text-sm font-semibold">
                  {t('predictiveAlertsScreen.aiFeatures.familyAlerts.title')}
                </div>
                <div className="text-xs opacity-75">
                  {t(
                    'predictiveAlertsScreen.aiFeatures.familyAlerts.description'
                  )}
                </div>
              </div>
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
