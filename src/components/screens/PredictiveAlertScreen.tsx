import {
  AlertTriangle,
  Activity,
  Utensils,
  Syringe,
  CheckCircle,
} from 'lucide-react';
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
  type: 'hypo' | 'hyper' | 'stable';
  message: string;
  time: string;
};

const alerts: Alert[] = [
  { type: 'hypo', message: 'Hypo risk in 15 min', time: '15 min' },
  { type: 'hyper', message: 'Hyper risk in 30 min', time: '30 min' },
  { type: 'hyper', message: 'Hyper risk in 45 min', time: '45 min' },
  { type: 'stable', message: 'Stable', time: '60 min' },
];

const getStyles = (type: Alert['type']) => {
  switch (type) {
    case 'hypo':
      return 'bg-red-100 text-red-800';
    case 'hyper':
      return 'bg-yellow-100 text-yellow-800';
    case 'stable':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
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
      const res = await fetch('https://klukoo-ai.onrender.com/forecast', {
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

      <PredictiveAlerts />
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
  // Function to parse time from string format like '15 min'
  const parseTotalMinutes = (time: string) => parseInt(time.split(' ')[0]);

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <DynamicAlert key={index} alert={alert} />
      ))}
    </div>
  );
};

const DynamicAlert: React.FC<{ alert: Alert; onExpire?: () => void }> = ({
  alert,
  onExpire,
}) => {
  const totalSeconds = parseTotalMinutes(alert.time) * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);

  // reset timer when alert.time changes
  useEffect(() => {
    setRemainingSeconds(totalSeconds);
  }, [alert.time, totalSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // fire expire callback once
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds, onExpire]);

  const elapsedSeconds = totalSeconds - remainingSeconds;
  const progress = (elapsedSeconds / Math.max(totalSeconds, 1)) * 100; // 0..100

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const fillColor = getStyles(alert.type);

  return (
    <div className="flex justify-between items-center rounded-lg overflow-hidden shadow-sm relative">
      {/* Inline CSS block for the stripe animation */}
      <style>{`
        @keyframes stripe-move {
          to { background-position: 40px 0; }
        }
        .stripe-overlay {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.12) 0 10px,
            transparent 10px 20px
          );
          background-size: 40px 40px;
          animation: stripe-move 1.2s linear infinite;
          mix-blend-mode: overlay;
        }
      `}</style>

      {/* Left area (progress fill) */}
      <div className="flex-1 relative overflow-hidden">
        {/* Colored filling bar. We set it absolutely to fill parent's height */}
        <div
          className={`absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-linear ${getStyles(
            alert.type
          )}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${progress}%`,
            transition: 'width 1s linear, background-color 1s linear',
            background: fillColor,
            zIndex: 0,
          }}
        />

        {/* Stripe overlay (animated) inside the filling area */}
        <div
          aria-hidden
          className="stripe-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${progress}%`,
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />

        {/* Foreground content (text + icon) */}
        <div className="flex items-center gap-2 px-4 py-3 font-medium relative z-10 bg-transparent">
          {/* You can replace these with your icons */}
          {alert.type === 'stable' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span className="text-sm">{alert.message}</span>
        </div>
      </div>

      {/* Right box with countdown */}
      <div className="bg-white px-4 py-4 text-black font-semibold text-sm w-20 text-center z-10">
        {minutes}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

// Parse time from string format
function parseTotalMinutes(time: string): number {
  return Math.max(1, parseInt(time.split(' ')[0], 10) || 1);
}
