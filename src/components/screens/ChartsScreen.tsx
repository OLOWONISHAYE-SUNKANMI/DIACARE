import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMeals } from '@/contexts/MealContext';
import { useMedications } from '@/contexts/MedicationContext';
import { useActivities } from '@/contexts/ActivityContext';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useTranslation } from 'react-i18next';
import { Clock, Target, Activity, Droplet, BarChart3 } from 'lucide-react';

// Helpers
const formatDay = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: 'short' });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

const ChartsScreen = () => {
  const { t } = useTranslation();
  const { meals } = useMeals();
  const { medications } = useMedications();
  const { activities } = useActivities();
  const { readings: glucose } = useGlucose();

  // Glucose data
  const glucoseData = [...glucose]
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    .map(r => ({
      ...r,
      time: formatTime(r.timestamp),
    }));

  const glucoseValues = glucose.map(d => d.value);
  const avgGlucose =
    glucoseValues.reduce((a, b) => a + b, 0) / (glucoseValues.length || 1);
  const maxGlucose = Math.max(...glucoseValues, 0);
  const latestGlucose = glucoseData.length
    ? glucoseData[glucoseData.length - 1].value
    : 0;

  // Meals grouped by day (total carbs)
  const mealsByDay = Object.values(
    meals.reduce((acc: any, m) => {
      const day = new Date(m.meal_time).toDateString();
      acc[day] = acc[day] || { day, carbs: 0 };
      acc[day].carbs += m.carbs_per_100g || 0;
      return acc;
    }, {})
  );

  //  Activities summary by type
  const activitySummary = Object.values(
    activities.reduce((acc: any, a) => {
      acc[a.activity_type] = acc[a.activity_type] || {
        type: a.activity_type,
        minutes: 0,
      };
      acc[a.activity_type].minutes += a.duration_minutes || 0;
      return acc;
    }, {})
  );

  // Stats for Time-in-Range
  const veryLow = glucoseValues.filter(v => v < 70).length;
  const target = glucoseValues.filter(v => v >= 70 && v < 140).length;
  const high = glucoseValues.filter(v => v >= 140).length;

  const veryLowPct = Math.round((veryLow / glucoseValues.length) * 100) || 0;
  const targetPct = Math.round((target / glucoseValues.length) * 100) || 0;
  const highPct = Math.round((high / glucoseValues.length) * 100) || 0;

  // Weekly Trends
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyTrends = days.map((day, i) => {
    const points = glucose.filter(d => new Date(d.timestamp).getDay() === i);
    const inRange = points.filter(d => d.value >= 70 && d.value < 140);
    const percent = points.length
      ? Math.round((inRange.length / points.length) * 100)
      : 0;
    return { day, percent };
  });

  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Title */}

      <div className="text-center space-y-2">
        <h2 className="text-2xl text-[#FFAB40] font-bold flex items-center justify-center space-x-2">
          <BarChart3 className="w-6 h-6 text-medical-teal" />
          <span>{t('charts.title')}</span>
        </h2>
        <p className="text-muted-foreground">{t('charts.subtitle')}</p>
      </div>
      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <Droplet className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-sm text-muted-foreground">
              {t('charts.latest')}
            </p>
            <p className="text-xl font-bold">{latestGlucose} mg/dL</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <Activity className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">
              {t('charts.average')}
            </p>
            <p className="text-xl font-bold">{avgGlucose.toFixed(1)} mg/dL</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <Target className="w-6 h-6 text-red-500 mb-2" />
            <p className="text-sm text-muted-foreground">
              {t('charts.highest')}
            </p>
            <p className="text-xl font-bold">{maxGlucose} mg/dL</p>
          </CardContent>
        </Card>
      </div>
      {/* Grid of main charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Glucose Line */}
        <Card>
          <CardHeader>
            <CardTitle>{t('charts.glucose')}</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[50, 250]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Meals Bar */}
        <Card>
          <CardHeader>
            <CardTitle>{t('charts.meals')}</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="carbs" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Medications Bar */}
        <Card>
          <CardHeader>
            <CardTitle>{t('charts.medications')}</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <BarChart data={medications}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="medication_time" tickFormatter={formatDay} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dose" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activities Pie */}
        <Card>
          <CardHeader>
            <CardTitle>{t('charts.activities')}</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={activitySummary}
                  dataKey="minutes"
                  nameKey="type"
                  label
                  outerRadius={80}
                >
                  {activitySummary.map((entry, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Time in Range */}
      <Card className="border-medical-teal/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-medical-teal" />
            <span>{t('target.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 flex rounded overflow-hidden">
            <div className="bg-red-400" style={{ width: `${veryLowPct}%` }} />
            <div className="bg-green-400" style={{ width: `${targetPct}%` }} />
            <div className="bg-orange-400" style={{ width: `${highPct}%` }} />
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span>
              {veryLowPct}% {t('charts.zones.low')}
            </span>
            <span>
              {targetPct}% {t('charts.inRange')}
            </span>
            <span>
              {highPct}% {t('charts.zones.high')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsScreen;
