export type BadgeType = 'welcome' | 'helper' | 'consistent' | 'motivator' | 'expert' | 'champion';

export interface Badge {
  name: string;
  icon: string;
  condition: string;
  description: string;
}

export interface UserBadge {
  id: string;
  badgeType: BadgeType;
  earnedAt: string;
  description?: string;
}

export interface UserReputation {
  score: number;
  helpfulMessages: number;
  positiveReactions: number;
  dataShares: number;
  challengeParticipations: number;
  mentoredUsers: number;
  lastCalculatedAt: string;
}

export const BADGES: Record<BadgeType, Badge> = {
  'welcome': { 
    name: 'Bienvenue', 
    icon: '👋', 
    condition: 'first_message',
    description: 'Premier message envoyé'
  },
  'helper': { 
    name: 'Aidant', 
    icon: '🤝', 
    condition: '10_helpful_responses',
    description: '10 réactions utiles reçues'
  },
  'consistent': { 
    name: 'Assidu', 
    icon: '📅', 
    condition: '30_days_active',
    description: '30 jours d\'activité'
  },
  'motivator': { 
    name: 'Motivateur', 
    icon: '💪', 
    condition: '50_encouragements',
    description: '50 messages d\'encouragement'
  },
  'expert': { 
    name: 'Expert', 
    icon: '🎓', 
    condition: 'verified_medical_knowledge',
    description: 'Connaissances médicales vérifiées'
  },
  'champion': { 
    name: 'Champion', 
    icon: '🏆', 
    condition: '1_year_excellent_control',
    description: '1 an de contrôle excellent'
  }
};

export class CommunityGamification {
  static calculateReputation(user: UserReputation): number {
    let score = 0;
    
    // Messages utiles (+2 points chacun)
    score += user.helpfulMessages * 2;
    
    // Réactions positives reçues (+1 point chaque)
    score += user.positiveReactions;
    
    // Partages de données anonymes (+5 points chaque)
    score += user.dataShares * 5;
    
    // Participation défis (+10 points chaque)
    score += user.challengeParticipations * 10;
    
    // Mentoring nouveaux (+20 points chaque)
    score += user.mentoredUsers * 20;
    
    return Math.min(score, 1000); // Plafond à 1000
  }

  static getReputationLevel(score: number): {
    level: string;
    color: string;
    nextThreshold?: number;
  } {
    if (score >= 500) {
      return { level: 'Légende', color: 'text-medical-purple' };
    } else if (score >= 200) {
      return { level: 'Expert', color: 'text-medical-blue', nextThreshold: 500 };
    } else if (score >= 100) {
      return { level: 'Contributeur', color: 'text-medical-green', nextThreshold: 200 };
    } else if (score >= 50) {
      return { level: 'Actif', color: 'text-medical-teal', nextThreshold: 100 };
    } else {
      return { level: 'Débutant', color: 'text-muted-foreground', nextThreshold: 50 };
    }
  }

  static getBadgesByCategory() {
    return {
      engagement: ['welcome', 'helper', 'consistent'] as BadgeType[],
      expertise: ['motivator', 'expert', 'champion'] as BadgeType[]
    };
  }
}