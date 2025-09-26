import { AlertTriangle, Activity, Utensils, Syringe } from 'lucide-react';

import PredictiveCard from '../ui/PredictiveCard';
import { useTranslation } from 'react-i18next';
import NativeHeader from '../ui/NativeHeader';
import GlucoseWidget from '../ui/GlucoseWidget';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useMeals } from '@/contexts/MealContext';
import { useMedications } from '@/contexts/MedicationContext';
import { useActivities } from '@/contexts/ActivityContext';
import { useEffect, useState } from 'react';

export default function PredictiveAlertScreen({ values }: any) {
  const { t } = useTranslation();
  const { getLatestReading, getTrend } = useGlucose();
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const { meals } = useMeals();
  const { medications } = useMedications();
  const { activities } = useActivities();

  const duration_minutes =
    activities.length > 0 ? activities[0].duration_minutes : null;

  const dose_unit = medications.length > 0 ? medications[0].dose_unit : null;
  console.log(dose_unit);

  const totalCarbs = meals.reduce((sum, meal) => sum + meal.total_carbs, 0);
  console.log(totalCarbs);

  const latestReading = getLatestReading();
  const currentGlucose = latestReading?.value || 126;

  useEffect(() => {
    fetchForecast();
  }, []);

  console.log(forecast);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentGlucose: currentGlucose,
        }),
      });

      const data = await res.json();
      setForecast(data.forecast);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-muted text-foreground p-4 space-y-4">
      {/* Header */}
      <h1 className="text-lg font-semibold text-center">Klukoo</h1>

      {/* Predictive Alert Card */}
      <PredictiveCard
        values={values}
        cancelable={false}
        visible={true}
        setVisible={null}
      />

      {/* Current BG */}
      <div className="rounded-xl bg-card text-card-foreground p-4 text-center space-y-1">
        <p className="text-sm font-medium">
          {t('predictiveAlertScreenFixes.currentBG.label')}
        </p>
        <p className="text-4xl font-bold">
          {t('predictiveAlertScreenFixes.currentBG.value', {
            value: currentGlucose,
            unit: 'mg/dL',
          })}
        </p>
      </div>

      {/* Enter Food */}
      <div className="rounded-xl bg-card text-card-foreground p-4 space-y-3">
        <p className="text-sm font-medium">
          {t('predictiveAlertScreenFixes.enterFood.title')}
        </p>
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg border border-border p-3 text-center space-y-1">
            <Utensils className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">
              {t('predictiveAlertScreenFixes.enterFood.food.name')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('predictiveAlertScreenFixes.enterFood.food.carbs', {
                amount: totalCarbs,
              })}
            </p>
          </div>

          <div className="flex-1 rounded-lg border border-border p-3 text-center space-y-1">
            <Syringe className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold">
              {t('predictiveAlertScreenFixes.enterFood.insulin.name')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('predictiveAlertScreenFixes.enterFood.insulin.dose', {
                units: dose_unit,
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
              duration: duration_minutes,
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
            {t('predictiveAlertScreenFixes.nextForecast.label')}
            {loading ? (
              <span className="text-muted-foreground">loading...</span>
            ) : (
              <span>{forecast}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
