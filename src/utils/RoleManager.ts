export type AppRole = 'member' | 'verified_member' | 'expert' | 'moderator';

export interface UserPermissions {
  canPost: boolean;
  canReact: boolean;
  canReport: boolean;
  canShareGlucose: boolean;
  canMentorNewbies: boolean;
  canProvideAdvice: boolean;
  canHostSessions: boolean;
  canModerate: boolean;
  canMute: boolean;
  canWarn: boolean;
  verified: boolean;
  dailyMessageLimit: number;
  badgeColor?: string;
}

export interface UserActivityStats {
  messagesSent: number;
  helpfulReactionsReceived: number;
  reportsSubmitted: number;
  warningsReceived: number;
  daysActive: number;
  lastMessageAt?: string;
}

export const UserRoles: Record<AppRole, UserPermissions> = {
  member: {
    canPost: true,
    canReact: true,
    canReport: true,
    canShareGlucose: true,
    canMentorNewbies: false,
    canProvideAdvice: false,
    canHostSessions: false,
    canModerate: false,
    canMute: false,
    canWarn: false,
    verified: false,
    dailyMessageLimit: 50,
    badgeColor: undefined
  },
  
  verified_member: {
    canPost: true,
    canReact: true,
    canReport: true,
    canShareGlucose: true,
    canMentorNewbies: true,
    canProvideAdvice: false,
    canHostSessions: false,
    canModerate: false,
    canMute: false,
    canWarn: false,
    verified: false,
    dailyMessageLimit: 100,
    badgeColor: 'emerald'
  },
  
  expert: {
    canPost: true,
    canReact: true,
    canReport: true,
    canShareGlucose: true,
    canMentorNewbies: true,
    canProvideAdvice: true,
    canHostSessions: true,
    canModerate: false,
    canMute: false,
    canWarn: false,
    verified: true,
    dailyMessageLimit: 200,
    badgeColor: 'blue'
  },
  
  moderator: {
    canPost: true,
    canReact: true,
    canReport: true,
    canShareGlucose: true,
    canMentorNewbies: true,
    canProvideAdvice: true,
    canHostSessions: true,
    canModerate: true,
    canMute: true,
    canWarn: true,
    verified: true,
    dailyMessageLimit: 500,
    badgeColor: 'purple'
  }
};

export const RoleHierarchy: Record<AppRole, number> = {
  member: 1,
  verified_member: 2,
  expert: 3,
  moderator: 4
};

export class RoleManager {
  static getPermissions(role: AppRole): UserPermissions {
    return UserRoles[role];
  }

  static canPerformAction(userRole: AppRole, requiredRole: AppRole): boolean {
    return RoleHierarchy[userRole] >= RoleHierarchy[requiredRole];
  }

  static checkPermission(userRole: AppRole, permission: keyof UserPermissions): boolean {
    return Boolean(UserRoles[userRole][permission]);
  }

  static getRoleDisplayName(role: AppRole): string {
    const displayNames: Record<AppRole, string> = {
      member: 'Membre',
      verified_member: 'Membre Vérifié',
      expert: 'Expert Diabète',
      moderator: 'Modérateur'
    };
    return displayNames[role];
  }

  static getRoleDescription(role: AppRole): string {
    const descriptions: Record<AppRole, string> = {
      member: 'Nouveau membre de la communauté DARE',
      verified_member: 'Membre actif et de confiance',
      expert: 'Expert en gestion du diabète',
      moderator: 'Modérateur de la communauté'
    };
    return descriptions[role];
  }

  static getRequirementsForNextRole(currentRole: AppRole, stats: UserActivityStats): {
    nextRole: AppRole | null;
    requirements: { met: boolean; description: string }[];
  } {
    if (currentRole === 'member') {
      return {
        nextRole: 'verified_member',
        requirements: [
          {
            met: stats.messagesSent >= 50,
            description: `Envoyer 50 messages (${stats.messagesSent}/50)`
          },
          {
            met: stats.helpfulReactionsReceived >= 10,
            description: `Recevoir 10 réactions utiles (${stats.helpfulReactionsReceived}/10)`
          },
          {
            met: stats.daysActive >= 7,
            description: `Être actif 7 jours (${stats.daysActive}/7)`
          },
          {
            met: stats.warningsReceived === 0,
            description: `Aucun avertissement (${stats.warningsReceived})`
          }
        ]
      };
    }

    if (currentRole === 'verified_member') {
      return {
        nextRole: 'expert',
        requirements: [
          {
            met: stats.messagesSent >= 200,
            description: `Envoyer 200 messages (${stats.messagesSent}/200)`
          },
          {
            met: stats.helpfulReactionsReceived >= 50,
            description: `Recevoir 50 réactions utiles (${stats.helpfulReactionsReceived}/50)`
          },
          {
            met: stats.daysActive >= 30,
            description: `Être actif 30 jours (${stats.daysActive}/30)`
          },
          {
            met: stats.warningsReceived === 0,
            description: `Aucun avertissement (${stats.warningsReceived})`
          }
        ]
      };
    }

    return {
      nextRole: null,
      requirements: []
    };
  }
}

export default RoleManager;