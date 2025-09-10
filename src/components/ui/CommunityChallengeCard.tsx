import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, Calendar, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import SupportFeatures, {
  type CommunityChallenge,
} from '@/utils/SupportFeatures';
import { useTranslation } from 'react-i18next';

interface CommunityChallengeCardProps {
  challenge: CommunityChallenge;
  onJoin?: (challengeId: string) => void;
  onUpdateProgress?: (challengeId: string, progress: number) => void;
  isParticipant?: boolean;
  userProgress?: number;
  loading?: boolean;
}

const CommunityChallengeCard = ({
  challenge,
  onJoin,
  onUpdateProgress,
  isParticipant = false,
  userProgress = 0,
  loading = false,
}: CommunityChallengeCardProps) => {
  const { t } = useTranslation();
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const now = new Date();

  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;
  const isCompleted = now > endDate;
  const timeUntilEnd = isActive
    ? formatDistanceToNow(endDate, { addSuffix: true, locale: fr })
    : null;

  const getStatusColor = () => {
    if (isCompleted) return 'bg-muted text-muted-foreground';
    if (isActive)
      return 'bg-medical-green-light text-medical-green border-medical-green';
    return 'bg-medical-blue-light text-medical-blue border-medical-blue';
  };

  const getStatusText = () => {
    if (isCompleted) return t('communityChallengeCard.Status.completed');
    if (isActive) return t('communityChallengeCard.Status.active');
    return t('communityChallengeCard.Status.upcoming');
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {SupportFeatures.getChallengeTypeIcon(challenge.challenge_type)}
              </span>
              <CardTitle className="text-lg font-semibold">
                {challenge.name}
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusColor()}>
                {getStatusText()}
              </Badge>
              <Badge variant="outline">
                {SupportFeatures.getChallengeTypeLabel(
                  challenge.challenge_type
                )}
              </Badge>
            </div>
          </div>

          {isParticipant && (
            <Badge className="bg-medical-purple-light text-medical-purple">
              Participant
            </Badge>
          )}
        </div>

        {challenge.description && (
          <CardDescription className="mt-2">
            {challenge.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {startDate.toLocaleDateString('fr-Fr')} -{' '}
              {endDate.toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>
              {t('communityChallengeCard.Challenge.participants', {
                count: challenge.participant_count || 0,
              })}
            </span>
          </div>

          {challenge.target_value && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span>
                {t('communityChallengeCard.Challenge.goal', {
                  value: challenge.target_value,
                  unit: challenge.target_unit,
                })}
              </span>
            </div>
          )}

          {timeUntilEnd && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <span>
                {t('communityChallengeCard.Challenge.endsIn', {
                  time: timeUntilEnd,
                })}
              </span>
            </div>
          )}
        </div>

        {/* User Progress (if participant) */}
        {isParticipant && isActive && (
          <div className="space-y-3 bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('communityChallengeCard.Challenge.yourProgress')}
              </span>
              <span className="text-sm text-muted-foreground">
                {userProgress}%
              </span>
            </div>
            <Progress value={userProgress} className="h-2" />

            {userProgress < 100 && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onUpdateProgress?.(
                      challenge.id,
                      Math.min(userProgress + 10, 100)
                    )
                  }
                  disabled={loading}
                >
                  +10%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onUpdateProgress?.(
                      challenge.id,
                      Math.min(userProgress + 25, 100)
                    )
                  }
                  disabled={loading}
                >
                  +25%
                </Button>
                <Button
                  size="sm"
                  onClick={() => onUpdateProgress?.(challenge.id, 100)}
                  disabled={loading}
                  className="gap-1"
                >
                  <Trophy className="w-3 h-3" />
                  {t('communityChallengeCard.Challenge.completed')}
                </Button>
              </div>
            )}

            {userProgress >= 100 && (
              <div className="bg-medical-green-light border border-medical-green rounded-lg p-3">
                <div className="flex items-center gap-2 text-medical-green font-medium">
                  <Trophy className="w-4 h-4" />
                  {t('communityChallengeCard.Challenge.finished')} 🎉
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reward Information */}
        {challenge.reward_badge && (
          <div className="bg-medical-purple-light border border-medical-purple rounded-lg p-3">
            <div className="flex items-center gap-2 text-medical-purple font-medium mb-1">
              <Trophy className="w-4 h-4" />
              {t('communityChallengeCard.Challenge.reward')}:{' '}
              {challenge.reward_badge}
            </div>
            {challenge.reward_description && (
              <p className="text-sm text-medical-purple">
                {challenge.reward_description}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {t('communityChallengeCard.Challenge.participants', {
              count: challenge.participant_count || 0,
            })}
          </div>

          {!isParticipant && (isActive || isUpcoming) && (
            <Button
              onClick={() => onJoin?.(challenge.id)}
              disabled={loading}
              className="gap-1"
            >
              <Users className="w-3 h-3" />
              {t('communityChallengeCard.Challenge.join')}
            </Button>
          )}
        </div>

        {isCompleted && !isParticipant && (
          <div className="bg-muted rounded-lg p-2">
            <p className="text-xs text-muted-foreground text-center">
              {t('communityChallengeCard.Challenge.finishedMessage')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityChallengeCard;
