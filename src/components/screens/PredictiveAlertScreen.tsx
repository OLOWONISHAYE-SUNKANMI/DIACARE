import { AlertTriangle, Activity, Utensils, Syringe, CheckCircle } from 'lucide-react';

import PredictiveCard from '../ui/PredictiveCard';
import { useTranslation } from 'react-i18next';
import NativeHeader from '../ui/NativeHeader';
import GlucoseWidget from '../ui/GlucoseWidget';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useMeals } from '@/contexts/MealContext';
import { useMedications } from '@/contexts/MedicationContext';
import { useActivities } from '@/contexts/ActivityContext';
import { useEffect, useState } from 'react';



type Alert = {
  type: "hypo" | "hyper" | "stable";
  message: string;
  time: string;
};

const alerts: Alert[] = [
  { type: "hypo", message: "Hypo risk in 15 min", time: "15 min" },
  { type: "hyper", message: "Hyper risk in 30 min", time: "30 min" },
  { type: "hyper", message: "Hyper risk in 45 min", time: "45 min" },
  { type: "stable", message: "Stable", time: "60 min" },
];

const getStyles = (type: Alert["type"]) => {
  switch (type) {
    case "hypo":
      return "bg-red-100 text-red-800";
    case "hyper":
      return "bg-yellow-100 text-yellow-800";
    case "stable":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


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
      <h1 className="text-lg font-semibold text-center">Predictive Alert</h1>

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

<PredictiveAlerts/>      
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


const PredictiveAlerts: React.FC = () => {
  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className="flex justify-between items-center rounded-lg overflow-hidden shadow-sm "
        >
          {/* Left colored section */}
          <div
            className={`flex items-center gap-2 flex-1 px-4 py-3 font-medium ${getStyles(
              alert.type
            )}`}
          >
            {alert.type === "stable" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{alert.message}</span>
          </div>

          {/* Right white time box */}
          <div className="bg-white px-4 py-4 text-black font-semibold text-sm w-20 text-center">
            {alert.time}
          </div>
        </div>
      ))}
    </div>
  );
};