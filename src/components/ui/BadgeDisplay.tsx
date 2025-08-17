import { Badge } from '@/components/ui/badge';
import { type BadgeType, type UserBadge, BADGES } from '@/utils/CommunityGamification';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeDisplayProps {
  badge: UserBadge;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const BadgeDisplay = ({ badge, size = 'md', showTooltip = true }: BadgeDisplayProps) => {
  const badgeConfig = BADGES[badge.badgeType];
  
  if (!badgeConfig) return null;

  const getSizeClasses = () => {
    const sizes = {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-sm px-2 py-1',
      lg: 'text-base px-3 py-1.5'
    };
    return sizes[size];
  };

  const badgeElement = (
    <Badge 
      variant="outline"
      className={`${getSizeClasses()} flex items-center gap-1 font-medium bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-primary hover:from-primary/20 hover:to-primary/10`}
    >
      <span className="text-lg">{badgeConfig.icon}</span>
      <span>{badgeConfig.name}</span>
    </Badge>
  );

  if (!showTooltip) return badgeElement;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeElement}
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{badgeConfig.name}</p>
            <p className="text-sm text-muted-foreground">{badge.description || badgeConfig.description}</p>
            <p className="text-xs text-muted-foreground">
              Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeDisplay;