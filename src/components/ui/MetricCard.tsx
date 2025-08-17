import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  icon: string;
  title: string;
  value: string;
  change: string;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

const MetricCard = ({ icon, title, value, change, color }: MetricCardProps) => {
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
          <div className="text-3xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;