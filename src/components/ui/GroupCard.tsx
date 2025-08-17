import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Crown } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  moderator: string;
  color: string;
}

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'border-medical-green/20 bg-medical-green-light/10 hover:bg-medical-green-light/20',
      blue: 'border-medical-blue/20 bg-medical-blue-light/10 hover:bg-medical-blue-light/20',
      orange: 'border-orange-200 bg-orange-50/50 hover:bg-orange-50/80',
      purple: 'border-medical-purple/20 bg-medical-purple-light/10 hover:bg-medical-purple-light/20',
      teal: 'border-medical-teal/20 bg-medical-teal-light/10 hover:bg-medical-teal-light/20'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  const getModeratorBadgeColor = (color: string) => {
    const colorMap = {
      green: 'bg-medical-green-light text-medical-green border-medical-green',
      blue: 'bg-medical-blue-light text-medical-blue border-medical-blue',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
      purple: 'bg-medical-purple-light text-medical-purple border-medical-purple',
      teal: 'bg-medical-teal-light text-medical-teal border-medical-teal'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  return (
    <Card className={`mb-4 transition-all duration-200 cursor-pointer ${getColorClasses(group.color)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span>{group.name}</span>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {group.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2 bg-background/80">
            <Users className="w-3 h-3 mr-1" />
            {group.members}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-muted-foreground" />
            <Badge 
              variant="outline" 
              className={`text-xs ${getModeratorBadgeColor(group.color)}`}
            >
              {group.moderator}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8">
              <MessageCircle className="w-3 h-3 mr-1" />
              Rejoindre
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;