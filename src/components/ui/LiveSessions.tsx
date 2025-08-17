import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Timer, Users } from 'lucide-react';

interface LiveSession {
  title: string;
  time: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  type: 'expert_qa' | 'workshop' | 'wellness';
}

const LiveSessions = () => {
  const upcomingSessions: LiveSession[] = [
    {
      title: "Q&A avec Dr. Kane",
      time: "Aujourd'hui 19h",
      duration: "1h",
      participants: 45,
      maxParticipants: 100,
      type: "expert_qa"
    },
    {
      title: "Atelier Cuisine Diabète",
      time: "Demain 17h",
      duration: "45min",
      participants: 23,
      maxParticipants: 50,
      type: "workshop"
    },
    {
      title: "Méditation & Gestion Stress",
      time: "Vendredi 18h",
      duration: "30min",
      participants: 67,
      maxParticipants: 200,
      type: "wellness"
    }
  ];

  const getSessionTypeColor = (type: LiveSession['type']) => {
    const typeColors = {
      expert_qa: 'bg-medical-blue-light text-medical-blue border-medical-blue',
      workshop: 'bg-medical-green-light text-medical-green border-medical-green',
      wellness: 'bg-medical-purple-light text-medical-purple border-medical-purple'
    };
    return typeColors[type];
  };

  return (
    <div className="space-y-3">
      {upcomingSessions.map((session, idx) => (
        <Card key={idx} className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold text-foreground">
                {session.title}
              </CardTitle>
              <Badge variant="outline" className="bg-destructive text-destructive-foreground border-destructive animate-pulse">
                LIVE
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{session.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                <span>{session.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{session.participants}/{session.maxParticipants}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              Rejoindre la Session
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LiveSessions;