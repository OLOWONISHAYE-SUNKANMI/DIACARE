import { BarChart3, Utensils, Pill, Footprints, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickAction {
  icon: React.ComponentType<any>;
  label: string;
  emoji: string;
  action: string;
  gradient: string;
}

interface QuickActionsGridProps {
  onActionPress: (action: string) => void;
}

const QuickActionsGrid = ({ onActionPress }: QuickActionsGridProps) => {
  const quickActions: QuickAction[] = [
    { 
      icon: BarChart3, 
      label: "Ajouter Glycémie", 
      emoji: "🩸", 
      action: "glucose",
      gradient: "from-medical-blue to-blue-600"
    },
    { 
      icon: Utensils, 
      label: "Journal des repas", 
      emoji: "🥗", 
      action: "meal",
      gradient: "from-medical-green to-emerald-600"
    },
    { 
      icon: Pill, 
      label: "Médicaments", 
      emoji: "💊", 
      action: "medication",
      gradient: "from-medical-teal to-cyan-600"
    },
    { 
      icon: Footprints, 
      label: "Activité", 
      emoji: "🏃‍♂️", 
      action: "activity",
      gradient: "from-orange-500 to-orange-600"
    },
    { 
      icon: Clock, 
      label: "Rappels", 
      emoji: "⏰", 
      action: "reminders",
      gradient: "from-purple-500 to-purple-600"
    },
  ];

  return (
    <div className="px-4 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Actions Rapides</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index} 
              className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden transition-all active:scale-95 cursor-pointer w-full max-w-full"
              onClick={() => onActionPress(action.action)}
            >
              <CardContent className="p-0">
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${action.gradient} p-6 text-center relative overflow-hidden w-full`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 drop-shadow-lg">{action.emoji}</div>
                    <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Label */}
                <div className="p-4 text-center">
                  <p className="text-sm font-semibold text-card-foreground leading-tight">
                    {action.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsGrid;