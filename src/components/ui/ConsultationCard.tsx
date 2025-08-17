import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Clock, 
  User, 
  MapPin, 
  Calendar,
  DollarSign,
  Check,
  X
} from 'lucide-react';

interface ConsultationData {
  id: string;
  patient_name: string;
  patient_age?: number;
  scheduled_at: string;
  duration_estimate: number;
  amount_charged: number;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
  patient_location?: string;
}

interface ConsultationCardProps {
  consultation: ConsultationData;
  onAccept: (consultationId: string) => void;
  onDecline?: (consultationId: string) => void;
}

const ConsultationCard = ({ consultation, onAccept, onDecline }: ConsultationCardProps) => {
  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      high: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[urgency as keyof typeof colors] || colors.medium;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels = {
      low: 'Normal',
      medium: 'Prioritaire',
      high: 'Urgent'
    };
    return labels[urgency as keyof typeof labels] || 'Normal';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className="mb-4 border-l-4 border-l-primary hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* En-tête patient */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{consultation.patient_name}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {consultation.patient_age && <span>{consultation.patient_age} ans</span>}
                  {consultation.patient_location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{consultation.patient_location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Détails consultation */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formatDate(consultation.scheduled_at)} à {formatTime(consultation.scheduled_at)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Durée estimée: {consultation.duration_estimate} minutes</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-medical-green">{consultation.amount_charged} F CFA</span>
              </div>
            </div>

            {/* Motif consultation */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Motif de consultation:</p>
              <p className="text-sm bg-muted/30 p-2 rounded">{consultation.reason}</p>
            </div>

            {/* Badge urgence */}
            <Badge 
              variant="outline" 
              className={`${getUrgencyColor(consultation.urgency)} mb-4`}
            >
              {getUrgencyLabel(consultation.urgency)}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={() => onAccept(consultation.id)}
            className="flex-1 bg-medical-green hover:bg-medical-green/90"
          >
            <Check className="w-4 h-4 mr-2" />
            Accepter
          </Button>
          
          <Button
            onClick={() => onDecline?.(consultation.id)}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Décliner
          </Button>
          
          <Button
            variant="outline"
            className="px-4"
          >
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationCard;