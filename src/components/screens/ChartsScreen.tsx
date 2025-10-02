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
  ReferenceLine,
  ReferenceArea,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMeals } from '@/contexts/MealContext';
import { useMedications } from '@/contexts/MedicationContext';
import { useActivities } from '@/contexts/ActivityContext';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useTranslation } from 'react-i18next';
import { Clock, Target, Activity, Droplet, BarChart3 } from 'lucide-react';

// Helpers
const formatDay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
  });
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

  // Glucose data with sequential points
  const glucoseData = [...glucose]
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    .map((r, i) => ({
      ...r,
      timestamp: r.timestamp,
      point: i, // sequential simulated point
    }));

  const glucoseValues = glucose.map(d => d.value);
  const avgGlucose =
    glucoseValues.reduce((a, b) => a + b, 0) / (glucoseValues.length || 1);
  const maxGlucose = Math.max(...glucoseValues, 0);
  const latestGlucose = glucoseData.length
    ? glucoseData[glucoseData.length - 1].value
    : 0;

  // Meals grouped by day (total carbs)
      const mealsChartData = meals.map(m => ({
        time: new Date(m.meal_time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        carbs: m.total_carbs,
        meal: m.meal_name, // keep meal name here for tooltip
        date: new Date(m.meal_time).toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      }));


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
  const target = glucoseValues.filter(v => v >= 70 && v < 180).length;
  const high = glucoseValues.filter(v => v >= 180).length;

  const veryLowPct = Math.round((veryLow / glucoseValues.length) * 100) || 0;
  const targetPct = Math.round((target / glucoseValues.length) * 100) || 0;
  const highPct = Math.round((high / glucoseValues.length) * 100) || 0;

  const getBarColor = (value: number) => {
    if (value < 30) return '#22c55e'; // green (low)
    if (value <= 60) return '#eab308'; // yellow (moderate)
    return '#ef4444'; // red (high)
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const med = payload[0].payload;
      return (
        <div className="bg-white border rounded p-2 shadow">
          <p className="font-semibold">{med.medication_name}</p>
          <p>Dose: {med.dose}</p>
          <p className="text-gray-500 text-sm">{formatDay(label)}</p>
        </div>
      );
    }
    return null;
  };

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
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" />

                {/* X Axis with simulated points */}
                <XAxis
                  dataKey="point"
                  label={{
                    value: 'Point in Time',
                    position: 'insideBottom',
                    offset: -5,
                  }}
                />

                <YAxis
                  label={{
                    value: 'Blood Glucose (mg/dL)',
                    angle: -90,
                    style: { textAnchor: 'middle' },
                    position: 'insideLeft',
                  }}
                  domain={[0, 'dataMax + 50']}
                />

                <Tooltip
                  formatter={(value: any) => [`${value} mg/dL`, 'Blood Glucose']}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    const date = new Date(item?.timestamp);
                    return date.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                  }}
                />

                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />

                {/* Target Zone shading */}
                <ReferenceArea
                  y1={80}
                  y2={180}
                  strokeOpacity={0}
                  fill="green"
                  fillOpacity={0.1}
                />

                {/* Threshold lines */}
                <ReferenceLine y={70} stroke="blue" strokeDasharray="5 5" />
                <ReferenceLine y={250} stroke="red" strokeDasharray="5 5" />

                {/* Main glucose line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot
                  name="Blood Glucose"
                />

                {/* Dummy legend entries */}
                {/* <Line
                  type="monotone"
                  dataKey="targetZone"
                  stroke="green"
                  strokeWidth={6}
                  strokeOpacity={0.2}
                  legendType="rect"
                  name="Target Zone (80-180 mg/dL)"
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="blue"
                  strokeDasharray="5 5"
                  legendType="line"
                  name="Low <70 mg/dL"
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="red"
                  strokeDasharray="5 5"
                  legendType="line"
                  name="High >250 mg/dL"
                /> */}
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mealsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" reversed />
                <YAxis
                  label={{
                    value: 'Carbohydrate (g)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip
                  formatter={(value: any, _: any, props: any) => [
                    `${value} g`,
                    props.payload.meal,
                  ]}
                  labelFormatter={(label: any, payload: any) => {
                    if (payload && payload.length > 0) {
                      const { meal, time, carbs } = payload[0].payload;
                      return `${meal} • ${time} • ${carbs} g`;
                    }
                    return label;
                  }}
                />
                <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="4 4" />
                <ReferenceLine y={60} stroke="#eab308" strokeDasharray="4 4" />
                <Bar dataKey="carbs" name="Carbs">
                  {mealsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.carbs)} />
                  ))}
                </Bar>
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
                <XAxis
                  dataKey="medication_time"
                  tickFormatter={formatTime}
                  reversed
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
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
