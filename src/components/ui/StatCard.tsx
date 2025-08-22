import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Users, Clock, AlertCircle, LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  color: 'orange' | 'green' | 'blue' | 'purple';
}

const getIconComponent = (iconStr: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    '👥': Users,
    '💰': DollarSign,
    '📅': Users,
    '⏱️': Clock,
    '⏳': AlertCircle,
  };
  return iconMap[iconStr] || Users;
};

const StatCard = ({ icon, title, value, color }: StatCardProps) => {
  const IconComponent = getIconComponent(icon);
  const getColorClasses = (color: string) => {
    const colorMap = {
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getIconBg = (color: string) => {
    const colorMap = {
      orange: 'bg-orange-100',
      green: 'bg-green-100',
      blue: 'bg-blue-100',
      purple: 'bg-purple-100'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <Card className={`border-2 ${getColorClasses(color)} hover:shadow-md transition-all duration-200`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${getIconBg(color)} rounded-full flex items-center justify-center`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;