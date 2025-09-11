import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Lock } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import UserRoleBadge from '@/components/ui/UserRoleBadge';
import { useTranslation } from 'react-i18next';

interface RoleProgressCardProps {
  userId?: string;
  showRoleManagement?: boolean;
}

const RoleProgressCard = ({
  userId,
  showRoleManagement = false,
}: RoleProgressCardProps) => {
  const { t } = useTranslation();
  const {
    userRole,
    activityStats,
    loading,
    getNextRoleRequirements,
    getRoleDisplayInfo,
    assignRole,
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
              {t('roleProgressCard.memberStatus.title')}
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
              <div className="text-sm text-muted-foreground">
                {t('roleProgressCard.userStats.sentMessages')}
              </div>
            </div>
            <div className="text-center p-3 bg-medical-green-light rounded-lg">
              <div className="text-2xl font-bold text-medical-green">
                {activityStats.helpfulReactionsReceived}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('roleProgressCard.userStats.receivedReactions')}
              </div>
            </div>
            <div className="text-center p-3 bg-medical-blue-light rounded-lg">
              <div className="text-2xl font-bold text-medical-blue">
                {activityStats.daysActive}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('roleProgressCard.userStats.activeDays')}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {activityStats.warningsReceived}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('roleProgressCard.userStats.warnings')}
              </div>
            </div>
          </div>
        )}

        {/* Role Progression */}
        {nextRoleInfo && nextRoleInfo.nextRole && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                {t('roleProgressCard.userStats.nextLevelProgress')}
              </h4>
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
                  <span
                    className={`text-sm ${req.met ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {req.description}
                  </span>
                  {req.met && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-medical-green-light text-medical-green"
                    >
                      {t('roleProgressCard.status.validated')}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>
                  {nextRoleInfo.requirements.filter(r => r.met).length}/
                  {nextRoleInfo.requirements.length}
                </span>
              </div>
              <Progress
                value={
                  (nextRoleInfo.requirements.filter(r => r.met).length /
                    nextRoleInfo.requirements.length) *
                  100
                }
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Role Management (for moderators) */}
        {showRoleManagement && userId && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm">
              {t('roleProgressCard.roleManagement.title')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRoleAssignment('verified_member')}
              >
                {t('roleProgressCard.roleManagement.verifiedMember')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRoleAssignment('expert')}
              >
                {t('roleProgressCard.roleManagement.expert')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRoleAssignment('moderator')}
              >
                {t('roleProgressCard.roleManagement.moderator')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRoleAssignment('member')}
              >
                {t('roleProgressCard.roleManagement.demote')}
              </Button>
            </div>
          </div>
        )}

        {/* No next role message */}
        {(!nextRoleInfo || !nextRoleInfo.nextRole) &&
          userRole !== 'moderator' && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {t('roleProgressCard.userProgress.maxLevelNotice')}
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default RoleProgressCard;
