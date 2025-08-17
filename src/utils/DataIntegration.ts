import { supabase } from '@/integrations/supabase/client';

export interface UserStatistics {
  avgGlucose: number;
  timeInRange: number;
  hba1c?: number;
  daysActive: number;
}

export interface DataSharingPreferences {
  shareStats: boolean;
  shareRegion: boolean;
  shareAgeGroup: boolean;
  shareDiabetesType: boolean;
}

export interface CommunityInsights {
  averageTimeInRange: string;
  mostActiveRegion: string;
  popularMealTimes: string[];
  commonChallenges: string[];
  totalParticipants: number;
  lastUpdated: string;
}

export class DataIntegration {
  
  static async getUserSharingPreferences(userId: string): Promise<DataSharingPreferences | null> {
    const { data, error } = await supabase
      .from('data_sharing_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching sharing preferences:', error);
      return null;
    }

    return {
      shareStats: data.share_stats,
      shareRegion: data.share_region,
      shareAgeGroup: data.share_age_group,
      shareDiabetesType: data.share_diabetes_type
    };
  }

  static async updateSharingPreferences(
    userId: string, 
    preferences: Partial<DataSharingPreferences>
  ): Promise<boolean> {
    const { error } = await supabase
      .from('data_sharing_preferences')
      .upsert({
        user_id: userId,
        share_stats: preferences.shareStats,
        share_region: preferences.shareRegion,
        share_age_group: preferences.shareAgeGroup,
        share_diabetes_type: preferences.shareDiabetesType
      });

    if (error) {
      console.error('Error updating sharing preferences:', error);
      return false;
    }

    return true;
  }

  static async updateUserStatistics(
    userId: string, 
    stats: UserStatistics
  ): Promise<boolean> {
    const { error } = await supabase
      .from('user_statistics')
      .upsert({
        user_id: userId,
        avg_glucose: stats.avgGlucose,
        time_in_range: stats.timeInRange,
        hba1c: stats.hba1c,
        days_active: stats.daysActive,
        last_calculated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating user statistics:', error);
      return false;
    }

    return true;
  }

  static async shareAnonymousStats(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('share_anonymous_statistics', {
        _user_id: userId
      });

      if (error) {
        console.error('Error sharing anonymous statistics:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error calling share_anonymous_statistics:', error);
      return false;
    }
  }

  static async generateCommunityInsights(): Promise<CommunityInsights | null> {
    try {
      const { data, error } = await supabase.rpc('generate_community_insights');

      if (error) {
        console.error('Error generating community insights:', error);
        return null;
      }

      const insights = data as Record<string, any>;
      return {
        averageTimeInRange: insights?.averageTimeInRange || 'N/A',
        mostActiveRegion: insights?.mostActiveRegion || 'N/A',
        popularMealTimes: insights?.popularMealTimes || ['7h-9h', '12h-14h', '19h-21h'],
        commonChallenges: insights?.commonChallenges || ['Gestion post-repas', 'Activité physique', 'Stress'],
        totalParticipants: insights?.totalParticipants || 0,
        lastUpdated: insights?.lastUpdated ? new Date(insights.lastUpdated).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR')
      };
    } catch (error) {
      console.error('Error calling generate_community_insights:', error);
      return null;
    }
  }

  static async getCommunityInsights(): Promise<CommunityInsights | null> {
    const { data, error } = await supabase
      .from('community_insights')
      .select('insight_value')
      .eq('insight_type', 'monthly_summary')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching community insights:', error);
      // Fallback to generating new insights
      return this.generateCommunityInsights();
    }

    const insights = data.insight_value as Record<string, any>;
    return {
      averageTimeInRange: insights?.averageTimeInRange || 'N/A',
      mostActiveRegion: insights?.mostActiveRegion || 'N/A',
      popularMealTimes: insights?.popularMealTimes || ['7h-9h', '12h-14h', '19h-21h'],
      commonChallenges: insights?.commonChallenges || ['Gestion post-repas', 'Activité physique', 'Stress'],
      totalParticipants: insights?.totalParticipants || 0,
      lastUpdated: insights?.lastUpdated ? new Date(insights.lastUpdated).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR')
    };
  }

  static async getAnonymousStats(filters?: {
    region?: string;
    ageGroup?: string;
    diabetesType?: string;
    monthYear?: string;
  }) {
    let query = supabase
      .from('anonymous_community_stats')
      .select('*');

    if (filters?.region) {
      query = query.eq('region', filters.region);
    }
    if (filters?.ageGroup) {
      query = query.eq('age_group', filters.ageGroup);
    }
    if (filters?.diabetesType) {
      query = query.eq('diabetes_type', filters.diabetesType as 'type1' | 'type2' | 'gestational' | 'other');
    }
    if (filters?.monthYear) {
      query = query.eq('month_year', filters.monthYear);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching anonymous stats:', error);
      return [];
    }

    return data;
  }

  // Convenience method that combines updating stats and sharing them
  static async updateAndShareStats(
    userId: string, 
    stats: UserStatistics
  ): Promise<boolean> {
    const updateSuccess = await this.updateUserStatistics(userId, stats);
    if (!updateSuccess) return false;

    const shareSuccess = await this.shareAnonymousStats(userId);
    return shareSuccess;
  }
}