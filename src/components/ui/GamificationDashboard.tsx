import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Gift, Zap, Users, TrendingUp } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useUserRoles } from '@/hooks/useUserRoles';
import ReputationCard from './ReputationCard';
import BadgeDisplay from './BadgeDisplay';
import { BADGES } from '@/utils/CommunityGamification';

interface GamificationDashboardProps {
  userId?: string;
}

const GamificationDashboard = ({ userId }: GamificationDashboardProps) => {
  const { badges, reputation, loading, hasBadge, updateReputation } = useGamification(userId);
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
      helpfulMessages: (reputation?.helpfulMessages || 0) + 1
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
                <div className="text-2xl font-bold">{reputation?.score || 0}</div>
                <div className="text-sm text-muted-foreground">Points de réputation</div>
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
                <div className="text-sm text-muted-foreground">Badges obtenus</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-medical-blue" />
              <div>
                <div className="text-2xl font-bold">{activityStats?.messagesSent || 0}</div>
                <div className="text-sm text-muted-foreground">Messages envoyés</div>
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
              Progression des badges
            </CardTitle>
            <CardDescription>
              Débloquez de nouveaux badges en participant à la communauté
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Badges obtenus */}
            {earnedBadges.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-medical-green">
                  ✅ Badges obtenus ({earnedBadges.length})
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
                  🎯 Badges à débloquer ({availableBadges.length})
                </h4>
                <div className="space-y-2">
                  {availableBadges.slice(0, 3).map(([type, badgeConfig]) => (
                    <div key={type} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{badgeConfig.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{badgeConfig.name}</div>
                          <div className="text-xs text-muted-foreground">{badgeConfig.description}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        À débloquer
                      </Badge>
                    </div>
                  ))}
                  {availableBadges.length > 3 && (
                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        Voir tous les badges (+{availableBadges.length - 3})
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
            Gagnez des points
          </CardTitle>
          <CardDescription>
            Participez à ces activités pour augmenter votre réputation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-medical-green mx-auto mb-2" />
              <div className="font-semibold">Messages utiles</div>
              <div className="text-sm text-muted-foreground">+2 points chacun</div>
              <Button size="sm" className="mt-2" onClick={handleTestUpdate}>
                Écrire un message
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Users className="w-8 h-8 text-medical-blue mx-auto mb-2" />
              <div className="font-semibold">Mentoring</div>
              <div className="text-sm text-muted-foreground">+20 points par personne</div>
              <Button size="sm" className="mt-2" variant="outline">
                Devenir mentor
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Target className="w-8 h-8 text-medical-purple mx-auto mb-2" />
              <div className="font-semibold">Défis</div>
              <div className="text-sm text-muted-foreground">+10 points par participation</div>
              <Button size="sm" className="mt-2" variant="outline">
                Rejoindre un défi
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Gift className="w-8 h-8 text-medical-teal mx-auto mb-2" />
              <div className="font-semibold">Partage de données</div>
              <div className="text-sm text-muted-foreground">+5 points par partage</div>
              <Button size="sm" className="mt-2" variant="outline">
                Partager des données
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationDashboard;