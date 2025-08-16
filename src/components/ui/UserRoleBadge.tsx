import { Badge } from '@/components/ui/badge';
import { type AppRole } from '@/utils/RoleManager';
import { Shield, Star, Award, Crown } from 'lucide-react';

interface UserRoleBadgeProps {
  role: AppRole;
  badgeColor?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
}

const UserRoleBadge = ({ 
  role, 
  badgeColor, 
  size = 'md', 
  showIcon = true, 
  showText = true 
}: UserRoleBadgeProps) => {
  const getRoleConfig = (role: AppRole) => {
    const configs = {
      member: {
        label: 'Membre',
        icon: Shield,
        className: 'bg-muted text-muted-foreground'
      },
      verified_member: {
        label: 'Vérifié',
        icon: Star,
        className: 'bg-medical-green-light text-medical-green border-medical-green'
      },
      expert: {
        label: 'Expert',
        icon: Award,
        className: 'bg-medical-blue-light text-medical-blue border-medical-blue'
      },
      moderator: {
        label: 'Modérateur',
        icon: Crown,
        className: 'bg-medical-purple-light text-medical-purple border-medical-purple'
      }
    };

    return configs[role];
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  const getSizeClasses = () => {
    const sizes = {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-sm px-2 py-1',
      lg: 'text-base px-3 py-1.5'
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };
    return sizes[size];
  };

  if (role === 'member' && !showText) {
    return null; // Don't show badge for basic members if text is hidden
  }

  return (
    <Badge 
      variant="outline"
      className={`${config.className} ${getSizeClasses()} flex items-center gap-1 font-medium`}
    >
      {showIcon && (
        <Icon className={getIconSize()} />
      )}
      {showText && config.label}
    </Badge>
  );
};

export default UserRoleBadge;