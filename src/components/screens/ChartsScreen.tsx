import { BarChart3, TrendingUp, Calendar, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';

import { useMeals } from '@/contexts/MealContext';
import { useMedications } from '@/contexts/MedicationContext';
import { useActivities } from '@/contexts/ActivityContext';
import { useGlucose } from '@/contexts/GlucoseContext';

const ChartsScreen = () => {
  const { t } = useTranslation();

  const { meals } = useMeals();
  const { medications } = useMedications();
  const { activities } = useActivities();
  const { readings: glucose } = useGlucose();

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Enrich glucose with context
  const enrichedGlucoseData = glucose.map(reading => {
    const time = new Date(reading.timestamp);

    return {
      ...reading,
      time: formatTime(reading.timestamp),
      meals: meals.filter(
        m => new Date(m.meal_time).getHours() === time.getHours()
      ),
      medications: medications.filter(
        m => new Date(m.medication_time).getHours() === time.getHours()
      ),
      activities: activities.filter(
        a => new Date(a.activity_time).getHours() === time.getHours()
      ),
    };
  });

  const getGlucoseColor = (value: number) => {
    if (value < 70) return 'hsl(var(--glucose-very-low))';
    if (value < 140) return 'hsl(var(--glucose-target))';
    if (value < 180) return 'hsl(var(--glucose-limit-high))';
    return 'hsl(var(--glucose-very-high))';
  };

  const CustomDot = ({ cx, cy, payload }: any) => {
    let color = getGlucoseColor(payload.value);
    let size = 4;

    if (payload.meals?.length) {
      color = '#3b82f6';
      size = 6;
    } else if (payload.medications?.length) {
      color = '#10b981';
      size = 6;
    } else if (payload.activities?.length) {
      color = '#8b5cf6';
      size = 6;
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={color}
        stroke="white"
        strokeWidth={2}
      />
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg space-y-1">
          <p className="font-medium">{d.time}</p>
          <p className="text-sm">
            {t('glucose.value')}: <b>{d.value} mg/dL</b>
          </p>

          {d.meals?.map((m: any, i: number) => (
            <p key={i} className="text-blue-500 text-sm">
              🍽 {m.meal_name} ({m.total_carbs}g carbs)
            </p>
          ))}
          {d.medications?.map((m: any, i: number) => (
            <p key={i} className="text-green-500 text-sm">
              💊 {m.medication_name} ({m.dose} {m.dose_unit})
            </p>
          ))}
          {d.activities?.map((a: any, i: number) => (
            <p key={i} className="text-purple-500 text-sm">
              🏃 {a.activity_type} ({a.duration_minutes} min)
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Stats
  const values = enrichedGlucoseData.map(d => d.value);
  const avg = values.length
    ? Math.round(values.reduce((s, v) => s + v, 0) / values.length)
    : 0;
  const max = values.length ? Math.max(...values) : 0;

  const veryLow = values.filter(v => v < 70).length;
  const target = values.filter(v => v >= 70 && v < 140).length;
  const high = values.filter(v => v >= 140).length;

  const veryLowPct = Math.round((veryLow / values.length) * 100) || 0;
  const targetPct = Math.round((target / values.length) * 100) || 0;
  const highPct = Math.round((high / values.length) * 100) || 0;

  // Weekly trends
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyTrends = days.map((day, i) => {
    const points = enrichedGlucoseData.filter(
      d => new Date(d.timestamp).getDay() === i
    );
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
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <BarChart3 className="w-6 h-6 text-medical-teal" />
          <span>{t('charts.title')}</span>
        </h2>
        <p className="text-muted-foreground">{t('charts.subtitle')}</p>
      </div>

      {/* Glucose Chart */}
      <Card className="border-medical-teal/20">
        <CardHeader className="flex justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-medical-teal" />
            <span>{t('analysis.title')}</span>
          </CardTitle>
          <Badge className="bg-medical-teal text-white">
            <Calendar className="w-3 h-3 mr-1" />
            {t('analysis.days')}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrichedGlucoseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  domain={[50, 250]}
                  label={{ value: 'mg/dL', angle: -90 }}
                />

                <ReferenceLine y={70} stroke="red" strokeDasharray="5 5" />
                <ReferenceLine y={140} stroke="green" strokeDasharray="5 5" />
                <ReferenceLine y={180} stroke="orange" strokeDasharray="5 5" />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="none"
                  fill="hsl(var(--muted))"
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={<CustomDot />}
                  activeDot={{ r: 6 }}
                />

                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
            <span>{veryLowPct}% Low</span>
            <span>{targetPct}% In Range</span>
            <span>{highPct}% High</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">{avg} Avg</CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">{max} Max</CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card className="border-medical-teal/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-medical-teal" />
            <span>{t('trend.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end h-24 space-x-2">
            {weeklyTrends.map((trend, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-2 flex-1"
              >
                <div
                  className="w-full bg-green-400 rounded-t"
                  style={{ height: `${trend.percent}%` }}
                ></div>
                <div className="text-xs text-muted-foreground">{trend.day}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            {t('trend.message')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsScreen;
