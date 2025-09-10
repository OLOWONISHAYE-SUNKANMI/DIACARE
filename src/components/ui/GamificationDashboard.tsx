import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Gift, Zap, Users, TrendingUp } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useUserRoles } from '@/hooks/useUserRoles';
import ReputationCard from './ReputationCard';
import BadgeDisplay from './BadgeDisplay';
import { BADGES } from '@/utils/CommunityGamification';
import { useTranslation } from 'react-i18next';

interface GamificationDashboardProps {
  userId?: string;
}

const GamificationDashboard = ({ userId }: GamificationDashboardProps) => {
  const { t } = useTranslation();
  const { badges, reputation, loading, hasBadge, updateReputation } =
    useGamification(userId);
  const { activityStats, userRole } = useUserRoles(userId);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const allBadges = Object.entries(BADGES);
  const earnedBadges = allBadges.filter(([type]) => hasBadge(type as any));
  const availableBadges = allBadges.filter(([type]) => !hasBadge(type as any));

  const handleTestUpdate = async () => {
    await updateReputation({
      helpfulMessages: (reputation?.helpfulMessages || 0) + 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {reputation?.score || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('gamificationDashboard.Profile.reputation.points')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-medical-green" />
              <div>
                <div className="text-2xl font-bold">{badges.length}</div>
                <div className="text-sm text-muted-foreground">
                  {t('gamificationDashboard.Profile.badges.earned')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-medical-blue" />
              <div>
                <div className="text-2xl font-bold">
                  {activityStats?.messagesSent || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('gamificationDashboard.Profile.messages.sent')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte de réputation */}
        <ReputationCard userId={userId} />

        {/* Progression des badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {t('gamificationDashboard.Profile.badges.progression')}
            </CardTitle>
            <CardDescription>
              {t('gamificationDashboard.Profile.badges.description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Badges obtenus */}
            {earnedBadges.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-medical-green">
                  ✅{' '}
                  {t('gamificationDashboard.Profile.badges.earned1', {
                    count: earnedBadges.length,
                  })}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {earnedBadges.map(([type, badgeConfig]) => {
                    const userBadge = badges.find(b => b.badgeType === type);
                    return userBadge ? (
                      <BadgeDisplay key={type} badge={userBadge} size="sm" />
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Badges disponibles */}
            {availableBadges.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  🎯{' '}
                  {t('gamificationDashboard.Profile.badges.available', {
                    count: availableBadges.length,
                  })}
                </h4>
                <div className="space-y-2">
                  {availableBadges.slice(0, 3).map(([type, badgeConfig]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{badgeConfig.icon}</span>
                        <div>
                          <div className="text-sm font-medium">
                            {badgeConfig.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {badgeConfig.description}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {t('gamificationDashboard.Profile.badges.locked')}
                      </Badge>
                    </div>
                  ))}
                  {availableBadges.length > 3 && (
                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        {t('gamificationDashboard.Profile.badges.viewAll', {
                          remaining: availableBadges.length - 3,
                        })}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {t('gamificationDashboard.Profile.points.title')}
          </CardTitle>
          <CardDescription>
            {t('gamificationDashboard.Profile.points.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-medical-green mx-auto mb-2" />
              <div className="font-semibold">
                {t('gamificationDashboard.Profile.points.message.title')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('gamificationDashboard.Profile.points.message.description', {
                  points: 2,
                })}
              </div>
              <Button size="sm" className="mt-2" onClick={handleTestUpdate}>
                {t('gamificationDashboard.Profile.points.message.button')}
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Users className="w-8 h-8 text-medical-blue mx-auto mb-2" />
              <div className="font-semibold">
                {t('gamificationDashboard.Profile.points.mentoring.title')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t(
                  'gamificationDashboard.Profile.points.mentoring.description',
                  { points: 20 }
                )}
              </div>
              <Button size="sm" className="mt-2" variant="outline">
                {t('gamificationDashboard.Profile.points.mentoring.button')}
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Target className="w-8 h-8 text-medical-purple mx-auto mb-2" />
              <div className="font-semibold">
                {t('gamificationDashboard.Profile.points.challenges.title')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t(
                  'gamificationDashboard.Profile.points.challenges.description',
                  { points: 10 }
                )}
              </div>
              <Button size="sm" className="mt-2" variant="outline">
                {t('gamificationDashboard.Profile.points.challenges.button')}
              </Button>
            </div>
            🇬🇧 English (en.json) json Copy code
            <div className="p-4 border rounded-lg text-center">
              <Gift className="w-8 h-8 text-medical-teal mx-auto mb-2" />
              <div className="font-semibold">
                {t('gamificationDashboard.Profile.points.dataSharing.title')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t(
                  'gamificationDashboard.Profile.points.dataSharing.description',
                  { points: 5 }
                )}
              </div>
              <Button size="sm" className="mt-2" variant="outline">
                {t('gamificationDashboard.Profile.points.dataSharing.button')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationDashboard;
