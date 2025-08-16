import { BarChart3, Utensils, Pill, Footprints } from "lucide-react";
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
      emoji: "📊", 
      action: "glucose",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      icon: Utensils, 
      label: "Scanner Repas", 
      emoji: "🍽️", 
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
      emoji: "🏃", 
      action: "activity",
      gradient: "from-orange-500 to-orange-600"
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
              className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden transition-all active:scale-95 cursor-pointer"
              onClick={() => onActionPress(action.action)}
            >
              <CardContent className="p-0">
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${action.gradient} p-4 text-center`}>
                  <div className="text-3xl mb-2">{action.emoji}</div>
                  <Icon className="w-6 h-6 text-white mx-auto" />
                </div>
                
                {/* Label */}
                <div className="p-3 text-center">
                  <p className="text-sm font-medium text-card-foreground leading-tight">
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