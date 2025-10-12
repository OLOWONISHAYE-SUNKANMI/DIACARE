import { useState, useEffect } from "react";
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

  // Glucose data sorted by timestamp and limited to latest 15 readings
 const glucoseData = [...glucose]
  .sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
  .slice(-15)
  .map((r) => ({
    ...r,
    time: new Date(r.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }), // format for X-axis
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
    meal: m.meal_name,
    date: new Date(m.meal_time).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
  }));


  // Medications Data
const medicationsChartData = medications.slice(0, 4).map((m) => {
  const medicationDate = new Date(m.medication_time);

  // Ensure valid date
  const formattedDate = isNaN(medicationDate.getTime())
    ? "No date"
    : medicationDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

  const formattedTime = isNaN(medicationDate.getTime())
    ? ""
    : medicationDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

  return {
    time: formattedTime || "00:00",
    date: formattedDate,
    dose: m.dose,
    medication_name: m.medication_name,
  };
});

  

  // Activities summary
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

  // Time in Range stats
  const veryLow = glucoseValues.filter(v => v < 70).length;
  const target = glucoseValues.filter(v => v >= 70 && v < 180).length;
  const high = glucoseValues.filter(v => v >= 180).length;

  const veryLowPct = Math.round((veryLow / glucoseValues.length) * 100) || 0;
  const targetPct = Math.round((target / glucoseValues.length) * 100) || 0;
  const highPct = Math.round((high / glucoseValues.length) * 100) || 0;

  const getBarColor = (value: number) => {
    if (value < 30) return '#22c55e';
    if (value <= 60) return '#eab308';
    return '#ef4444';
  };

  const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const med = payload[0].payload;
    return (
      <div className="bg-white border rounded p-2 shadow">
        <p className="font-semibold">{med.medication_name}</p>
        <p>Dose: {med.dose}</p>
        <p className="text-gray-500 text-sm">{med.date}</p>
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
            <p className="text-sm text-muted-foreground">{t('charts.latest')}</p>
            <p className="text-xl font-bold">{latestGlucose} mg/dL</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <Activity className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">{t('charts.average')}</p>
            <p className="text-xl font-bold">{avgGlucose.toFixed(1)} mg/dL</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <Target className="w-6 h-6 text-red-500 mb-2" />
            <p className="text-sm text-muted-foreground">{t('charts.highest')}</p>
            <p className="text-xl font-bold">{maxGlucose} mg/dL</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Glucose Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('charts.glucose')}</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={glucoseData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

               <XAxis
                  dataKey="time"
                  type="category"
                  interval="preserveStartEnd"
                  label={{
                    position: 'insideBottom',
                    offset: -5,
                  }}
                />


                <YAxis
                  label={{
                    angle: -90,
                    position: 'insideLeft',

                  }}
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

                <Legend verticalAlign="top" height={36} />

                <ReferenceArea y1={80} y2={180} fill="green" fillOpacity={0.1} />
                <ReferenceLine y={70} stroke="blue" strokeDasharray="5 5" />
                <ReferenceLine y={250} stroke="red" strokeDasharray="5 5" />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Blood Glucose"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Meals Bar Chart */}
        <Card>
          <CardHeader>
             <CardTitle>{t('charts.meals')}</CardTitle>
          </CardHeader>

          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={mealsChartData.slice(0, 4)} // show only first 3–4 data points
                margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
                barCategoryGap="25%" // wider bars
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                   reversed 
                  label={{
                  
                    position: 'insideBottom',
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: 'Carbohydrate (g)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip
                  formatter={(value: any, _: any, props: any) => [
                    `${value} g`,
                    props.payload.meal,
                  ]}
                />
                <Bar dataKey="carbs" barSize={80} radius={[10, 10, 0, 0]}>
                  {mealsChartData.slice(0, 4).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.carbs)} />
                  ))}
                  {mealsChartData.slice(0, 4).map((entry, index) => (
                    <text
                      key={`label-${index}`}
                      x={index * (100 / 4) + 70}
                      y={300 - entry.carbs * 0.5}
                      textAnchor="middle"
                      fill="white"
                      fontSize={13}
                      fontWeight="bold"
                    >
                    </text>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

        
          </CardContent>
        </Card>


   {/* Medications Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.medications")}</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={medicationsChartData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" reversed label={{   position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Dose (mg)", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="dose" barSize={80} radius={[10, 10, 0, 0]} fill="#6366f1">
                  {medicationsChartData.map((_, i) => (
                    <Cell key={i} fill="#000397ff" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activities Pie Chart */}
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

      {/* Time in Range Bar */}
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
            <span>{veryLowPct}% {t('charts.zones.low')}</span>
            <span>{targetPct}% {t('charts.inRange')}</span>
            <span>{highPct}% {t('charts.zones.high')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsScreen;
