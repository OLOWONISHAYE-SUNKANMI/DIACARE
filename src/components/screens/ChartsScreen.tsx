import { BarChart3, TrendingUp, Calendar, Target, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend } from 'recharts';

const ChartsScreen = () => {
  const { t } = useTranslation();
  // Enhanced glucose data with timestamps and context
  const glucoseData = [
    { time: "00:00", value: 95, hour: 0, formattedTime: "Minuit", context: "Jeûne" },
    { time: "02:00", value: 140, hour: 2, formattedTime: "02h", context: "Post-repas" },
    { time: "04:00", value: 180, hour: 4, formattedTime: "04h", context: "Post-repas" },
    { time: "06:00", value: 165, hour: 6, formattedTime: "06h", context: "Matin" },
    { time: "08:00", value: 120, hour: 8, formattedTime: "08h", context: "Petit-déj" },
    { time: "10:00", value: 85, hour: 10, formattedTime: "10h", context: "Activité" },
    { time: "12:00", value: 110, hour: 12, formattedTime: "Midi", context: "Déjeuner" },
    { time: "14:00", value: 155, hour: 14, formattedTime: "14h", context: "Post-repas" },
    { time: "16:00", value: 190, hour: 16, formattedTime: "16h", context: "Collation" },
    { time: "18:00", value: 170, hour: 18, formattedTime: "18h", context: "Dîner" },
    { time: "20:00", value: 130, hour: 20, formattedTime: "20h", context: "Post-repas" },
    { time: "22:00", value: 105, hour: 22, formattedTime: "22h", context: "Soirée" }
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{`${data.formattedTime}`}</p>
          <p className="text-sm text-muted-foreground">{`Contexte: ${data.context}`}</p>
          <p className="text-lg font-bold" style={{ color: getGlucoseColor(data.value) }}>
            {`${data.value} mg/dL`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Function to get glucose color based on value
  const getGlucoseColor = (value: number) => {
    if (value < 70) return "hsl(var(--glucose-very-low))";
    if (value < 140) return "hsl(var(--glucose-target))";
    if (value < 180) return "hsl(var(--glucose-limit-high))";
    return "hsl(var(--glucose-very-high))";
  };

  // Custom dot component for glucose points
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={getGlucoseColor(payload.value)}
        stroke="white"
        strokeWidth={2}
        className="drop-shadow-sm"
      />
    );
  };

  const weeklyTrends = [
    { day: 'L', percentage: 75, color: 'glucose-target' },
    { day: 'M', percentage: 82, color: 'glucose-target' },
    { day: 'M', percentage: 65, color: 'glucose-limit-high' },
    { day: 'J', percentage: 88, color: 'glucose-target' },
    { day: 'V', percentage: 70, color: 'glucose-target' },
    { day: 'S', percentage: 60, color: 'glucose-limit-high' },
    { day: 'D', percentage: 78, color: 'glucose-target' },
  ];

  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2">
          <BarChart3 className="w-6 h-6 text-medical-teal" />
          <span>{t('charts.title')}</span>
        </h2>
        <p className="text-muted-foreground">{t('charts.subtitle')}</p>
      </div>

      {/* Glucose Analysis Chart */}
      <Card className="border-medical-teal/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg text-foreground flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-medical-teal" />
            <span>Analyse Glycémique</span>
          </CardTitle>
          <Badge className="bg-medical-teal text-white">
            <Calendar className="w-3 h-3 mr-1" />
            7 derniers jours
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Professional CGM-style Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucoseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[50, 250]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}
                />
                
                {/* Reference lines for glucose zones */}
                <ReferenceLine y={70} stroke="hsl(var(--glucose-very-low))" strokeDasharray="5 5" />
                <ReferenceLine y={140} stroke="hsl(var(--glucose-target))" strokeDasharray="5 5" />
                <ReferenceLine y={180} stroke="hsl(var(--glucose-limit-high))" strokeDasharray="5 5" />
                
                {/* Background zones */}
                <defs>
                  <linearGradient id="glucoseZones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--glucose-very-high))" stopOpacity={0.1} />
                    <stop offset="25%" stopColor="hsl(var(--glucose-limit-high))" stopOpacity={0.1} />
                    <stop offset="65%" stopColor="hsl(var(--glucose-target))" stopOpacity={0.2} />
                    <stop offset="85%" stopColor="hsl(var(--glucose-limit-low))" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="hsl(var(--glucose-very-low))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="none" 
                  fill="url(#glucoseZones)" 
                />
                
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={<CustomDot />}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "white" }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Legend 
                  content={() => (
                    <div className="flex justify-center space-x-6 text-xs mt-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-2 bg-glucose-very-high rounded"></div>
                        <span className="text-muted-foreground">&gt;180 Élevé</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-2 bg-glucose-limit-high rounded"></div>
                        <span className="text-muted-foreground">140-180 Limite</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-2 bg-glucose-target rounded"></div>
                        <span className="text-muted-foreground">70-140 Cible</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-2 bg-glucose-very-low rounded"></div>
                        <span className="text-muted-foreground">&lt;70 Bas</span>
                      </div>
                    </div>
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Time in Range */}
      <Card className="border-medical-teal/20">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center space-x-2">
            <Target className="w-5 h-5 text-medical-teal" />
            <span>Temps dans la Cible</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Horizontal bar */}
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[12%] bg-glucose-very-low"></div>
            <div className="absolute left-[12%] top-0 h-full w-[68%] bg-glucose-target"></div>
            <div className="absolute right-0 top-0 h-full w-[20%] bg-glucose-very-high"></div>
          </div>
          
          {/* Labels */}
          <div className="flex justify-between text-sm">
            <span className="text-glucose-very-low font-medium">12% Bas</span>
            <span className="text-glucose-target font-medium">68% Cible</span>
            <span className="text-glucose-very-high font-medium">20% Élevé</span>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            Objectif : &gt;70% dans la cible
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-medical-teal/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-medical-teal">132</div>
            <div className="text-xs text-muted-foreground">Moyenne mg/dL</div>
          </CardContent>
        </Card>
        <Card className="border-medical-teal/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-glucose-limit-high">42</div>
            <div className="text-xs text-muted-foreground">Variabilité CV%</div>
          </CardContent>
        </Card>
        <Card className="border-medical-teal/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-glucose-very-high">8.2%</div>
            <div className="text-xs text-muted-foreground">HbA1c estimé</div>
          </CardContent>
        </Card>
        <Card className="border-medical-teal/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-glucose-target">156</div>
            <div className="text-xs text-muted-foreground">Pic Max mg/dL</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card className="border-medical-teal/20">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center space-x-2">
            <Clock className="w-5 h-5 text-medical-teal" />
            <span>Tendances Hebdomadaires</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end h-24 space-x-2">
            {weeklyTrends.map((trend, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div 
                  className={`w-full bg-${trend.color} rounded-t`}
                  style={{ height: `${trend.percentage}%` }}
                ></div>
                <div className="text-xs font-medium text-muted-foreground">{trend.day}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            Pourcentage de temps dans la cible par jour
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ChartsScreen;