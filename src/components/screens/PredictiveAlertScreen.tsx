import { AlertTriangle, Activity, Utensils, Syringe } from 'lucide-react';




  

import PredictiveCard from '../ui/PredictiveCard';
    import { useTranslation } from 'react-i18next';

export default function PredictiveAlertScreen({ values }: any) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-muted text-foreground p-4 space-y-4">
      {/* Header */}
      <h1 className="text-lg font-semibold text-center">Kluko</h1>

      {/* Predictive Alert Card */}

      <div className="rounded-xl p-4 bg-destructive text-destructive-foreground space-y-2">
        <div className="flex items-center gap-2 font-bold text-lg">
          <AlertTriangle className="w-5 h-5" />
          <span>{t('predictiveAlertScreenFixes.predictiveAlert.title')}</span>
        </div>
        <p className="text-sm">
          {t('predictiveAlertScreenFixes.predictiveAlert.risk', {
            probability: 78,
          })}
        </p>
        <p className="text-sm">
          {t('predictiveAlertScreenFixes.predictiveAlert.forecast', {
            bg: 62,
            minutes: 25,
          })}
        </p>
        <p className="text-sm font-medium">
          {t('predictiveAlertScreenFixes.predictiveAlert.suggestion', {
            minutes: 10,
          })}
        </p>
      </div>


      {/* Current BG */}
      <div className="rounded-xl bg-card text-card-foreground p-4 text-center space-y-1">
        <p className="text-sm font-medium">
          {t('predictiveAlertScreenFixes.currentBG.label')}
        </p>
        <p className="text-4xl font-bold">
          {t('predictiveAlertScreenFixes.currentBG.value', {
            value: 135,
            unit: 'mg/dL',
          })}
        </p>
      </div>

      {/* Enter Food */}
      <div className="rounded-xl bg-card text-card-foreground p-4 space-y-3">
        <p className="text-sm font-medium">{t('enterFood.title')}</p>
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg border border-border p-3 text-center space-y-1">
            <Utensils className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">
              {t('predictiveAlertScreenFixes.enterFood.food.name', {
                name: 'Rice',
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('predictiveAlertScreenFixes.enterFood.food.carbs', {
                amount: 40,
              })}
            </p>
          </div>

          <div className="flex-1 rounded-lg border border-border p-3 text-center space-y-1">
            <Syringe className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">
              {t('predictiveAlertScreenFixes.enterFood.insulin.name', {
                type: 'Rapid',
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('predictiveAlertScreenFixes.enterFood.insulin.dose', {
                units: 5,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-xl bg-card text-card-foreground p-4 space-y-1">
        <p className="text-sm font-medium">
          {t('predictiveAlertScreenFixes.activityCard.title')}
        </p>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <span className="text-sm">
            {t('predictiveAlertScreenFixes.activityCard.description', {
              intensity: 'Yes Moderate',
              duration: 30,
            })}
          </span>
        </div>
      </div>

      {/* Predictive AI Alerts */}
      <div className="rounded-xl bg-card text-card-foreground p-4 space-y-2">
        <p className="text-sm font-medium">
          {t('predictiveAlertScreenFixes.predictiveAlerts.title')}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span>
            {t('predictiveAlertScreenFixes.predictiveAlerts.status', {
              state: 'Monitoring...',
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span>


            Next 30 min forecast: Stable (
            <span className="text-muted-foreground">↓ 2 mg/dL</span>)

          </span>
        </div>
      </div>
    </div>
  );
}
