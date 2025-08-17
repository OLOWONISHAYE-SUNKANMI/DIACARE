import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { type BadgeType, type UserBadge, type UserReputation, CommunityGamification } from '@/utils/CommunityGamification';
import { useToast } from '@/hooks/use-toast';

export const useGamification = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    loadGamificationData();
  }, [targetUserId]);

  const loadGamificationData = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      
      // Load user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', targetUserId)
        .order('earned_at', { ascending: false });

      if (badgesError) {
        console.error('Error loading badges:', badgesError);
        setError('Erreur lors du chargement des badges');
        return;
      }

      setBadges(badgesData.map(badge => ({
        id: badge.id,
        badgeType: badge.badge_type as BadgeType,
        earnedAt: badge.earned_at,
        description: badge.description
      })));

      // Load user reputation
      const { data: reputationData, error: reputationError } = await supabase
        .from('user_reputation')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (reputationError && reputationError.code !== 'PGRST116') {
        console.error('Error loading reputation:', reputationError);
        setError('Erreur lors du chargement de la réputation');
        return;
      }

      if (reputationData) {
        setReputation({
          score: reputationData.score,
          helpfulMessages: reputationData.helpful_messages,
          positiveReactions: reputationData.positive_reactions,
          dataShares: reputationData.data_shares,
          challengeParticipations: reputationData.challenge_participations,
          mentoredUsers: reputationData.mentored_users,
          lastCalculatedAt: reputationData.last_calculated_at
        });
      } else {
        // Initialize reputation for new user
        setReputation({
          score: 0,
          helpfulMessages: 0,
          positiveReactions: 0,
          dataShares: 0,
          challengeParticipations: 0,
          mentoredUsers: 0,
          lastCalculatedAt: new Date().toISOString()
        });
      }

    } catch (err) {
      console.error('Error in loadGamificationData:', err);
      setError('Erreur lors du chargement des données de gamification');
    } finally {
      setLoading(false);
    }
  };

  const updateReputation = async (updates: Partial<UserReputation>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.rpc('update_user_reputation', {
        _user_id: user.id,
        _helpful_messages: updates.helpfulMessages,
        _positive_reactions: updates.positiveReactions,
        _data_shares: updates.dataShares,
        _challenge_participations: updates.challengeParticipations,
        _mentored_users: updates.mentoredUsers
      });

      if (error) {
        console.error('Error updating reputation:', error);
        return;
      }

      // Reload reputation data
      if (user.id === targetUserId) {
        await loadGamificationData();
      }

    } catch (err) {
      console.error('Error in updateReputation:', err);
    }
  };

  const awardBadge = async (badgeType: BadgeType) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('award_badge_if_eligible', {
        _user_id: user.id,
        _badge_type: badgeType
      });

      if (error) {
        console.error('Error awarding badge:', error);
        return;
      }

      if (data) {
        toast({
          title: '🎉 Nouveau badge!',
          description: `Vous avez gagné le badge "${badgeType}"!`,
        });

        // Reload badges data
        if (user.id === targetUserId) {
          await loadGamificationData();
        }
      }

    } catch (err) {
      console.error('Error in awardBadge:', err);
    }
  };

  const getReputationLevel = () => {
    if (!reputation) return { level: 'Débutant', color: 'text-muted-foreground' };
    return CommunityGamification.getReputationLevel(reputation.score);
  };

  const hasBadge = (badgeType: BadgeType) => {
    return badges.some(badge => badge.badgeType === badgeType);
  };

  const getBadgesByCategory = () => {
    const categories = CommunityGamification.getBadgesByCategory();
    return {
      engagement: categories.engagement.map(type => badges.find(b => b.badgeType === type)).filter(Boolean),
      expertise: categories.expertise.map(type => badges.find(b => b.badgeType === type)).filter(Boolean)
    };
  };

  return {
    badges,
    reputation,
    loading,
    error,
    updateReputation,
    awardBadge,
    getReputationLevel,
    hasBadge,
    getBadgesByCategory,
    reload: loadGamificationData
  };
};