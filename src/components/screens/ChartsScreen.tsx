import { BarChart3, TrendingUp, Calendar, Target, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ChartsScreen = () => {
  // Simulated glucose data points for the week
  const glucoseData = [
    { time: 0, value: 95 },
    { time: 20, value: 140 },
    { time: 40, value: 180 },
    { time: 60, value: 165 },
    { time: 80, value: 120 },
    { time: 100, value: 85 },
    { time: 120, value: 110 },
    { time: 140, value: 155 },
    { time: 160, value: 190 },
    { time: 180, value: 170 },
    { time: 200, value: 130 },
    { time: 220, value: 105 },
    { time: 240, value: 88 },
    { time: 260, value: 125 },
    { time: 280, value: 145 },
    { time: 300, value: 160 }
  ];

  // Generate SVG path for glucose curve
  const generatePath = (data: typeof glucoseData) => {
    const maxValue = 250;
    const minValue = 50;
    const width = 300;
    const height = 150;
    
    return data.map((point, index) => {
      const x = (point.time / 300) * width;
      const y = height - ((point.value - minValue) / (maxValue - minValue)) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
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
          <span>Graphiques</span>
        </h2>
        <p className="text-muted-foreground">Analyse de vos données glycémiques</p>
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
          {/* CGM-style Chart */}
          <div className="relative bg-gradient-to-b from-glucose-very-high via-glucose-limit-high via-glucose-target via-glucose-limit-low to-glucose-very-low rounded-lg h-40 overflow-hidden">
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 300 150" 
              preserveAspectRatio="none"
            >
              {/* Glucose curve */}
              <path
                d={generatePath(glucoseData)}
                stroke="white"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-sm"
              />
              {/* Data points */}
              {glucoseData.map((point, index) => {
                const x = (point.time / 300) * 300;
                const y = 150 - ((point.value - 50) / 200) * 150;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="white"
                    className="drop-shadow-sm"
                  />
                );
              })}
            </svg>
            
            {/* Zone labels */}
            <div className="absolute top-2 left-2 text-white text-xs font-medium">
              &gt;180 Élevé
            </div>
            <div className="absolute top-1/4 left-2 text-white text-xs font-medium">
              140-180 Limite
            </div>
            <div className="absolute top-1/2 left-2 text-white text-xs font-medium">
              70-140 Cible
            </div>
            <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
              &lt;70 Bas
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-between text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-glucose-very-high rounded"></div>
              <span className="text-muted-foreground">Élevé &gt;180</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-glucose-limit-high rounded"></div>
              <span className="text-muted-foreground">Limite 140-180</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-glucose-target rounded"></div>
              <span className="text-muted-foreground">Cible 70-140</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-glucose-very-low rounded"></div>
              <span className="text-muted-foreground">Bas &lt;70</span>
            </div>
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