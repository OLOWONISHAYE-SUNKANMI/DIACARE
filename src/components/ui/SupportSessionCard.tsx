import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import SupportFeatures, { type SupportSession } from '@/utils/SupportFeatures';
import { useTranslation } from 'react-i18next';

interface SupportSessionCardProps {
  session: SupportSession;
  onJoin?: (sessionId: string) => void;
  onLeave?: (sessionId: string) => void;
  isParticipant?: boolean;
  participantCount?: number;
  loading?: boolean;
}

const SupportSessionCard = ({
  session,
  onJoin,
  onLeave,
  isParticipant = false,
  participantCount = 0,
  loading = false,
}: SupportSessionCardProps) => {
  const { t } = useTranslation();
  const sessionTime = new Date(session.scheduled_time);
  const timeUntil = formatDistanceToNow(sessionTime, {
    addSuffix: true,
    locale: fr,
  });
  const isUpcoming = sessionTime > new Date();
  const isFull = participantCount >= session.max_participants;

  const getSessionTypeColor = () => {
    const colors = {
      group_session:
        'bg-medical-blue-light text-medical-blue border-medical-blue',
      peer_mentoring:
        'bg-medical-green-light text-medical-green border-medical-green',
      emergency_support:
        'bg-medical-red-light text-medical-red border-medical-red',
      challenge_group:
        'bg-medical-purple-light text-medical-purple border-medical-purple',
    };
    return colors[session.session_type] || colors.group_session;
  };

  const formatSessionTime = () => {
    return sessionTime.toLocaleDateString('fr-FR', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {SupportFeatures.getSessionTypeIcon(session.session_type)}
              </span>
              <CardTitle className="text-lg font-semibold">
                {session.title}
              </CardTitle>
            </div>
            <Badge variant="outline" className={getSessionTypeColor()}>
              {session.session_type === 'group_session' &&
                t('supportSessionCard.sessionType.group')}
              {session.session_type === 'peer_mentoring' &&
                t('supportSessionCard.sessionType.mentoring')}
              {session.session_type === 'emergency_support' &&
                t('supportSessionCard.sessionType.emergency')}
              {session.session_type === 'challenge_group' &&
                t('supportSessionCard.sessionType.challenge')}
            </Badge>
          </div>

          {isParticipant && (
            <Badge className="bg-medical-green-light text-medical-green">
              {t('supportSessionCard.userStatus.registered')}
            </Badge>
          )}
        </div>

        {session.description && (
          <CardDescription className="mt-2">
            {session.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{formatSessionTime()}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{session.duration_minutes} minutes</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>
              {participantCount}/{session.max_participants} participants
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-medical-blue">
              {t('supportSessionCard.session.moderatedBy', {
                name: session.moderator_name,
              })}
            </span>
          </div>
        </div>

        {session.is_recurring && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              📅{' '}
              {t('supportSessionCard.session.recurring', {
                pattern: session.recurrence_pattern,
              })}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {isUpcoming ? timeUntil : t('session.past')}
          </div>

          {isUpcoming && (
            <div className="space-x-2">
              {isParticipant ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLeave?.(session.id)}
                  disabled={loading}
                >
                  {t('supportSessionCard.session.leave')}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onJoin?.(session.id)}
                  disabled={loading || isFull}
                  className="gap-1"
                >
                  {isFull
                    ? t('supportSessionCard.session.full')
                    : t('supportSessionCard.session.join')}
                </Button>
              )}

              {session.meeting_link && isParticipant && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(session.meeting_link, '_blank')}
                  className="gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  {t('supportSessionCard.session.enter')}
                </Button>
              )}
            </div>
          )}
        </div>

        {isFull && !isParticipant && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
            <p className="text-xs text-orange-600">
              {t('supportSessionCard.session.full_waitlist')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupportSessionCard;
