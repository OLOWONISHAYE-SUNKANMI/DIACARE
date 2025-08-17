export type MessageType = 'daily_motivation' | 'educational' | 'celebration' | 'reminder' | 'announcement';
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'on_event';

export interface MessageTemplate {
  id: string;
  type: MessageType;
  content: string;
  reactions: string[];
  has_link: boolean;
  link_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduledMessage {
  id: string;
  template_id?: string;
  frequency: ScheduleFrequency;
  schedule_time?: string;
  schedule_day?: string;
  schedule_date?: string;
  event_type?: string;
  is_active: boolean;
  last_sent_at?: string;
  next_send_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AutomatedMessage {
  id: string;
  template_id?: string;
  scheduled_message_id?: string;
  message_type: MessageType;
  content: string;
  reactions: string[];
  sent_at: string;
  user_id?: string;
  metadata: Record<string, any>;
}

export class AutoMessaging {
  static async getRandomMotivation(): Promise<string> {
    const motivations = [
      "💪 Chaque contrôle glycémique est une victoire !",
      "🌅 Nouveau jour, nouvelles opportunités de bien gérer votre diabète",
      "🎯 Votre persévérance d'aujourd'hui = votre santé de demain",
      "👥 Ensemble, nous sommes plus forts face au diabète",
      "🏆 Chaque petit geste compte dans votre parcours DARE"
    ];
    
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  static async getRandomEducationalTip(): Promise<string> {
    const tips = [
      "📚 Conseil de la semaine : Surveillez vos pieds quotidiennement pour détecter toute blessure ou changement.",
      "🥗 Astuce nutrition : Les légumes verts à feuilles sont vos alliés pour stabiliser la glycémie.",
      "🏃‍♂️ Le saviez-vous ? 30 minutes de marche après un repas aident à réguler la glycémie.",
      "💧 Hydratation : Boire suffisamment d'eau aide à maintenir une glycémie stable.",
      "🍎 Privilégiez les fruits entiers plutôt que les jus pour éviter les pics glycémiques."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  static createCelebrationMessage(userName: string, celebrationType: string): string {
    const celebrationMessages = {
      one_year_dare: `🎉 Félicitations à ${userName} pour 1 an avec DARE ! Un exemple pour nous tous 💪`,
      glucose_streak: `🌟 Bravo ${userName} pour votre régularité dans le suivi glycémique ! 📊`,
      community_helper: `👏 Merci ${userName} pour votre aide précieuse à la communauté ! 🤝`,
      milestone_reached: `🏆 ${userName} a franchi une nouvelle étape importante ! Félicitations ! 🎯`
    };

    return celebrationMessages[celebrationType as keyof typeof celebrationMessages] || 
           `🎉 Félicitations ${userName} ! 🎊`;
  }

  static formatScheduleDisplay(frequency: ScheduleFrequency, scheduleTime?: string, scheduleDay?: string, eventType?: string): string {
    const time = scheduleTime || '00:00';
    
    switch (frequency) {
      case 'daily':
        return `Tous les jours à ${time}`;
      case 'weekly':
        const dayNames: Record<string, string> = {
          monday: 'lundi',
          tuesday: 'mardi',
          wednesday: 'mercredi',
          thursday: 'jeudi',
          friday: 'vendredi',
          saturday: 'samedi',
          sunday: 'dimanche'
        };
        const dayName = dayNames[scheduleDay || 'monday'];
        return `Chaque ${dayName} à ${time}`;
      case 'monthly':
        return `Chaque mois à ${time}`;
      case 'on_event':
        return `Sur événement: ${eventType}`;
      default:
        return 'Non défini';
    }
  }

  static getMessageTypeLabel(type: MessageType): string {
    const labels: Record<MessageType, string> = {
      daily_motivation: 'Motivation quotidienne',
      educational: 'Conseil éducatif',
      celebration: 'Célébration',
      reminder: 'Rappel',
      announcement: 'Annonce'
    };
    return labels[type] || type;
  }

  static getMessageTypeIcon(type: MessageType): string {
    const icons: Record<MessageType, string> = {
      daily_motivation: '💪',
      educational: '📚',
      celebration: '🎉',
      reminder: '⏰',
      announcement: '📢'
    };
    return icons[type] || '💬';
  }

  static async triggerHelpfulMessages(): Promise<{
    motivation: string;
    educational: string;
    celebration?: string;
  }> {
    try {
      const motivation = await this.getRandomMotivation();
      const educational = await this.getRandomEducationalTip();
      
      return {
        motivation,
        educational
      };
    } catch (error) {
      console.error('Error triggering helpful messages:', error);
      return {
        motivation: "💪 Continuez sur cette voie, vous êtes formidable !",
        educational: "📚 N'oubliez pas de prendre soin de vous chaque jour."
      };
    }
  }
}

export default AutoMessaging;