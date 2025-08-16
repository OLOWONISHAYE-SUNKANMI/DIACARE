import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Lock } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import UserRoleBadge from '@/components/ui/UserRoleBadge';

interface RoleProgressCardProps {
  userId?: string;
  showRoleManagement?: boolean;
}

const RoleProgressCard = ({ userId, showRoleManagement = false }: RoleProgressCardProps) => {
  const { 
    userRole, 
    activityStats, 
    loading, 
    getNextRoleRequirements, 
    getRoleDisplayInfo,
    assignRole 
  } = useUserRoles(userId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const roleInfo = getRoleDisplayInfo();
  const nextRoleInfo = getNextRoleRequirements();

  const handleRoleAssignment = async (newRole: any) => {
    if (!userId) return;
    await assignRole(userId, newRole);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Statut de membre
              <UserRoleBadge role={userRole} />
            </CardTitle>
            <CardDescription>{roleInfo.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stats */}
        {activityStats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-medical-teal-light rounded-lg">
              <div className="text-2xl font-bold text-medical-teal">
                {activityStats.messagesSent}
              </div>
              <div className="text-sm text-muted-foreground">Messages envoyés</div>
            </div>
            <div className="text-center p-3 bg-medical-green-light rounded-lg">
              <div className="text-2xl font-bold text-medical-green">
                {activityStats.helpfulReactionsReceived}
              </div>
              <div className="text-sm text-muted-foreground">Réactions reçues</div>
            </div>
            <div className="text-center p-3 bg-medical-blue-light rounded-lg">
              <div className="text-2xl font-bold text-medical-blue">
                {activityStats.daysActive}
              </div>
              <div className="text-sm text-muted-foreground">Jours actifs</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {activityStats.warningsReceived}
              </div>
              <div className="text-sm text-muted-foreground">Avertissements</div>
            </div>
          </div>
        )}

        {/* Role Progression */}
        {nextRoleInfo && nextRoleInfo.nextRole && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Progression vers le niveau suivant</h4>
              <UserRoleBadge role={nextRoleInfo.nextRole} size="sm" />
            </div>
            
            <div className="space-y-3">
              {nextRoleInfo.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3">
                  {req.met ? (
                    <CheckCircle className="w-5 h-5 text-medical-green" />
                  ) : (
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${req.met ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {req.description}
                  </span>
                  {req.met && (
                    <Badge variant="outline" className="text-xs bg-medical-green-light text-medical-green">
                      Validé
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{nextRoleInfo.requirements.filter(r => r.met).length}/{nextRoleInfo.requirements.length}</span>
              </div>
              <Progress 
                value={(nextRoleInfo.requirements.filter(r => r.met).length / nextRoleInfo.requirements.length) * 100}
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Role Management (for moderators) */}
        {showRoleManagement && userId && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm">Gestion des rôles</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleRoleAssignment('verified_member')}
              >
                Membre Vérifié
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleRoleAssignment('expert')}
              >
                Expert
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleRoleAssignment('moderator')}
              >
                Modérateur
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleRoleAssignment('member')}
              >
                Rétrograder
              </Button>
            </div>
          </div>
        )}

        {/* No next role message */}
        {(!nextRoleInfo || !nextRoleInfo.nextRole) && userRole !== 'moderator' && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Vous avez atteint le niveau maximum disponible ou votre progression nécessite une validation manuelle.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleProgressCard;