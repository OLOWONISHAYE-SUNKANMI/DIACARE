import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Users, Heart, Share, Award } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import BadgeDisplay from './BadgeDisplay';
import { CommunityGamification } from '@/utils/CommunityGamification';
import { useTranslation } from 'react-i18next';

interface ReputationCardProps {
  userId?: string;
  compact?: boolean;
}

const ReputationCard = ({ userId, compact = false }: ReputationCardProps) => {
  const { t } = useTranslation();
  const {
    reputation,
    badges,
    loading,
    getReputationLevel,
    getBadgesByCategory,
  } = useGamification(userId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-20 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reputation) return null;

  const levelInfo = getReputationLevel();
  const badgeCategories = getBadgesByCategory();
  const calculatedScore = CommunityGamification.calculateReputation(reputation);

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold text-sm">
                {reputation.score} pts
              </div>
              <div className={`text-xs ${levelInfo.color}`}>
                {levelInfo.level}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {badges.slice(0, 3).map(badge => (
              <BadgeDisplay key={badge.id} badge={badge} size="sm" />
            ))}
            {badges.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{badges.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {t('reputationCard.communityReputation.title')}
            </CardTitle>
            <CardDescription>
              {t('reputationCard.communityReputation.description')}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {reputation.score}
            </div>
            <Badge
              variant="outline"
              className={`${levelInfo.color} border-current`}
            >
              {levelInfo.level}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progression vers le niveau suivant */}
        {levelInfo.nextThreshold && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {t('reputationCard.communityReputation.progressTowards', {
                  nextLevel:
                    levelInfo.level === 'beginner'
                      ? t('reputationCard.communityReputation.levels.active')
                      : levelInfo.level === 'active'
                        ? t(
                            'reputationCard.communityReputation.levels.contributor'
                          )
                        : levelInfo.level === 'contributor'
                          ? t(
                              'reputationCard.communityReputation.levels.expert'
                            )
                          : t(
                              'reputationCard.communityReputation.levels.legend'
                            ),
                })}
              </span>
              <span>
                {reputation.score}/{levelInfo.nextThreshold}
              </span>
            </div>
            <Progress
              value={(reputation.score / levelInfo.nextThreshold) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {t('reputationCard.communityReputation.pointsToNext', {
                points: levelInfo.nextThreshold - reputation.score,
              })}
            </p>
          </div>
        )}

        {/* Détail des points */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Heart className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-sm font-semibold">
                {reputation.helpfulMessages}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('reputationCard.communityReputation.stats.helpfulMessages')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-sm font-semibold">
                {reputation.positiveReactions}
              </div>
              <div className="text-xs text-muted-foreground">
                {t(
                  'reputationCard.communityReputation.stats.positiveReactions'
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Share className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-sm font-semibold">
                {reputation.dataShares}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('reputationCard.communityReputation.stats.dataShares')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Users className="w-4 h-4 text-purple-500" />
            <div>
              <div className="text-sm font-semibold">
                {reputation.mentoredUsers}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('reputationCard.communityReputation.stats.mentoredUsers')}
              </div>
            </div>
          </div>
        </div>

        {/* Badges obtenus */}
        {badges.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <h4 className="font-semibold">
                {t('reputationCard.badges.title', { count: badges.length })}
              </h4>
            </div>

            {badgeCategories.engagement.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">
                  {t('reputationCard.badges.engagement')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {badgeCategories.engagement.map(badge => (
                    <BadgeDisplay key={badge!.id} badge={badge!} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {badgeCategories.expertise.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">
                  {t('reputationCard.badges.expertise')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {badgeCategories.expertise.map(badge => (
                    <BadgeDisplay key={badge!.id} badge={badge!} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {badges.length === 0 && (
          <div className="text-center py-4">
            <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {t('reputationCard.badges.invite')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReputationCard;
