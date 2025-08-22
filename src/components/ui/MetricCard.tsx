import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, UserCheck, Stethoscope, Clock, AlertCircle, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: string;
  title: string;
  value: string;
  change: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

const getIconComponent = (iconStr: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    '💰': DollarSign,
    '👨‍⚕️': UserCheck,
    '🩺': Stethoscope,
    '⏳': Clock,
  };
  return iconMap[iconStr] || Stethoscope;
};

const MetricCard = ({ icon, title, value, change, color }: MetricCardProps) => {
  const IconComponent = getIconComponent(icon);
  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'border-green-200 bg-green-50',
      blue: 'border-blue-200 bg-blue-50', 
      purple: 'border-purple-200 bg-purple-50',
      orange: 'border-orange-200 bg-orange-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getChangeColor = (change: string) => {
    if (change.includes('+')) return 'text-green-600';
    if (change.includes('🔴')) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <Card className={`${getColorClasses(color)} border-2 hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className={`text-sm font-medium ${getChangeColor(change)}`}>
              {change}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <IconComponent className="w-8 h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;