import { Activity, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GlucoseWidgetProps {
  currentGlucose: number;
  lastReading?: string;
  trend?: "up" | "down" | "stable";
}

const GlucoseWidget = ({ 
  currentGlucose = 126, 
  lastReading = "Aujourd'hui 14:30",
  trend = "stable" 
}: GlucoseWidgetProps) => {
  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { 
      status: "low", 
      color: "text-red-500", 
      bgColor: "bg-red-50", 
      message: "Glycémie basse",
      emoji: "⚠️"
    };
    if (value <= 180) return { 
      status: "normal", 
      color: "text-medical-green", 
      bgColor: "bg-medical-green-light", 
      message: "Dans la normale",
      emoji: "✅"
    };
    return { 
      status: "high", 
      color: "text-orange-500", 
      bgColor: "bg-orange-50", 
      message: "Glycémie élevée",
      emoji: "⚠️"
    };
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4" />;
      case "down": return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const glucoseStatus = getGlucoseStatus(currentGlucose);

  return (
    <Card className="bg-white shadow-xl border-0 rounded-3xl mx-4 -mt-8 relative overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-medical-green to-medical-teal"></div>
      
      <CardContent className="p-6 text-center">
        {/* Glucose value */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-6 h-6 text-medical-green" />
            <span className="text-lg font-semibold text-card-foreground">Glycémie Actuelle</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold text-medical-green">{currentGlucose}</span>
              <span className="text-lg text-muted-foreground">mg/dL</span>
              <div className="text-medical-green ml-2">
                {getTrendIcon()}
              </div>
            </div>
            
            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${glucoseStatus.bgColor} ${glucoseStatus.color}`}>
              <span>{glucoseStatus.emoji}</span>
              <span>{glucoseStatus.message}</span>
            </div>
          </div>
          
          {/* Last reading */}
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-4 pt-4 border-t border-muted/30">
            <Calendar className="w-4 h-4" />
            <span>Dernière mesure : {lastReading}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlucoseWidget;