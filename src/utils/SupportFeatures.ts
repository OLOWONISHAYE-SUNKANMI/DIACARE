import { supabase } from '@/integrations/supabase/client';

export type SupportSessionType = 'group_session' | 'peer_mentoring' | 'emergency_support' | 'challenge_group';
export type ChallengeType = 'glucose_monitoring' | 'exercise' | 'nutrition' | 'medication_adherence' | 'community_engagement';
export type EmergencyPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SupportSession {
  id: string;
  title: string;
  description?: string;
  session_type: SupportSessionType;
  moderator_name: string;
  moderator_id?: string;
  scheduled_time: string;
  duration_minutes: number;
  max_participants: number;
  is_recurring: boolean;
  recurrence_pattern?: string;
  meeting_link?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityChallenge {
  id: string;
  name: string;
  description?: string;
  challenge_type: ChallengeType;
  start_date: string;
  end_date: string;
  target_value?: number;
  target_unit?: string;
  reward_badge?: string;
  reward_description?: string;
  is_active: boolean;
  participant_count?: number;
  created_at: string;
  updated_at: string;
}

export interface EmergencyRequest {
  id: string;
  user_id: string;
  priority: EmergencyPriority;
  message?: string;
  location_info?: any;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  response_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface EmergencyResponder {
  id: string;
  user_id: string;
  is_available: boolean;
  specialties: string[];
  average_response_time_minutes: number;
  total_responses: number;
  last_online_at: string;
}

export interface PeerSupportPair {
  id: string;
  mentor_id: string;
  mentee_id: string;
  paired_at: string;
  is_active: boolean;
  notes?: string;
  last_interaction_at?: string;
}

export class SupportFeatures {
  // Peer Support System
  static async createPeerSupportPair(mentorId: string, menteeId: string, notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('peer_support_pairs')
        .insert({
          mentor_id: mentorId,
          mentee_id: menteeId,
          notes: notes || null
        });

      return !error;
    } catch (err) {
      console.error('Error creating peer support pair:', err);
      return false;
    }
  }

  static async getPeerSupportPairs(userId: string): Promise<PeerSupportPair[]> {
    try {
      const { data, error } = await supabase
        .from('peer_support_pairs')
        .select('*')
        .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching peer support pairs:', err);
      return [];
    }
  }

  // Group Sessions
  static async getSupportSessions(): Promise<SupportSession[]> {
    try {
      const { data, error } = await supabase
        .from('support_sessions')
        .select('*')
        .eq('is_active', true)
        .gte('scheduled_time', new Date().toISOString())
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching support sessions:', err);
      return [];
    }
  }

  static async joinSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      return !error;
    } catch (err) {
      console.error('Error joining session:', err);
      return false;
    }
  }

  static async leaveSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_participants')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      return !error;
    } catch (err) {
      console.error('Error leaving session:', err);
      return false;
    }
  }

  // Community Challenges
  static async getCommunityChallenge(): Promise<CommunityChallenge[]> {
    try {
      const { data, error } = await supabase
        .from('community_challenges')
        .select(`
          *,
          participant_count:challenge_participants(count)
        `)
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString().split('T')[0])
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data?.map(challenge => ({
        ...challenge,
        participant_count: challenge.participant_count?.[0]?.count || 0
      })) || [];
    } catch (err) {
      console.error('Error fetching community challenges:', err);
      return [];
    }
  }

  static async joinChallenge(challengeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      return !error;
    } catch (err) {
      console.error('Error joining challenge:', err);
      return false;
    }
  }

  static async updateChallengeProgress(challengeId: string, progress: number): Promise<boolean> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;

      const { error } = await supabase
        .from('challenge_participants')
        .update({ 
          current_progress: progress,
          completed: progress >= 100,
          completed_at: progress >= 100 ? new Date().toISOString() : null
        })
        .eq('challenge_id', challengeId)
        .eq('user_id', userId);

      return !error;
    } catch (err) {
      console.error('Error updating challenge progress:', err);
      return false;
    }
  }

  // Emergency Support
  static async createEmergencyRequest(message: string, priority: EmergencyPriority = 'medium'): Promise<string | null> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return null;

      const { data, error } = await supabase
        .from('emergency_support_requests')
        .insert({
          user_id: userId,
          priority,
          message
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error('Error creating emergency request:', err);
      return null;
    }
  }

  static async getOnlineExperts(): Promise<EmergencyResponder[]> {
    try {
      const { data, error } = await supabase
        .from('emergency_responders')
        .select('*')
        .eq('is_available', true)
        .gte('last_online_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Online in last 30 min
        .order('average_response_time_minutes', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching online experts:', err);
      return [];
    }
  }

  static async notifyOnlineModerators(emergencyId: string): Promise<boolean> {
    try {
      // This would typically send real-time notifications
      // For now, we'll use the supabase realtime features
      return true;
    } catch (err) {
      console.error('Error notifying moderators:', err);
      return false;
    }
  }

  static async prioritizeUserMessages(userId: string): Promise<boolean> {
    try {
      // This would integrate with your chat system to prioritize messages
      return true;
    } catch (err) {
      console.error('Error prioritizing user messages:', err);
      return false;
    }
  }

  static async suggestEmergencyContacts(): Promise<{ name: string; phone: string; type: string }[]> {
    return [
      { name: "SAMU", phone: "15", type: "Urgences médicales" },
      { name: "SOS Médecins", phone: "3624", type: "Consultations urgentes" },
      { name: "Centre antipoison", phone: "01 40 05 48 48", type: "Intoxications" },
      { name: "Diabetes.fr", phone: "01 42 79 02 86", type: "Support diabète" }
    ];
  }

  // Utility functions
  static getChallengeTypeIcon(type: ChallengeType): string {
    const icons = {
      glucose_monitoring: '📊',
      exercise: '🏃‍♂️',
      nutrition: '🥗',
      medication_adherence: '💊',
      community_engagement: '🤝'
    };
    return icons[type] || '🎯';
  }

  static getChallengeTypeLabel(type: ChallengeType): string {
    const labels = {
      glucose_monitoring: 'Suivi Glycémique',
      exercise: 'Activité Physique',
      nutrition: 'Nutrition',
      medication_adherence: 'Observance Médicamenteuse',
      community_engagement: 'Engagement Communautaire'
    };
    return labels[type] || type;
  }

  static getSessionTypeIcon(type: SupportSessionType): string {
    const icons = {
      group_session: '👥',
      peer_mentoring: '🤝',
      emergency_support: '🆘',
      challenge_group: '🏆'
    };
    return icons[type] || '💬';
  }

  static getPriorityColor(priority: EmergencyPriority): string {
    const colors = {
      low: 'bg-medical-green-light text-medical-green border-medical-green',
      medium: 'bg-medical-orange-light text-medical-orange border-medical-orange',
      high: 'bg-medical-red-light text-medical-red border-medical-red',
      critical: 'bg-red-600 text-white border-red-600'
    };
    return colors[priority] || colors.medium;
  }

  static formatSessionTime(scheduledTime: string): string {
    const date = new Date(scheduledTime);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default SupportFeatures;