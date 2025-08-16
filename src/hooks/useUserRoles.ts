import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { type AppRole, type UserActivityStats, RoleManager } from '@/utils/RoleManager';
import { useToast } from '@/hooks/use-toast';

interface UserRoleData {
  role: AppRole;
  assignedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export const useUserRoles = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<AppRole>('member');
  const [roleData, setRoleData] = useState<UserRoleData | null>(null);
  const [activityStats, setActivityStats] = useState<UserActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    loadUserRole();
    loadActivityStats();
  }, [targetUserId]);

  const loadUserRole = async () => {
    if (!targetUserId) return;

    try {
      // Get user's current role using the database function
      const { data: roleResult, error: roleError } = await supabase
        .rpc('get_user_role', { _user_id: targetUserId });

      if (roleError) {
        console.error('Error loading user role:', roleError);
        setError('Erreur lors du chargement du rôle');
        return;
      }

      const currentRole = roleResult || 'member';
      setUserRole(currentRole);

      // Get detailed role data
      const { data: roleDetails, error: detailsError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false })
        .limit(1);

      if (!detailsError && roleDetails && roleDetails.length > 0) {
        setRoleData({
          role: roleDetails[0].role as AppRole,
          assignedAt: roleDetails[0].assigned_at,
          expiresAt: roleDetails[0].expires_at,
          isActive: roleDetails[0].is_active
        });
      }

    } catch (err) {
      console.error('Error in loadUserRole:', err);
      setError('Erreur lors du chargement du rôle');
    }
  };

  const loadActivityStats = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('user_activity_stats')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading activity stats:', error);
        return;
      }

      if (data) {
        setActivityStats({
          messagesSent: data.messages_sent || 0,
          helpfulReactionsReceived: data.helpful_reactions_received || 0,
          reportsSubmitted: data.reports_submitted || 0,
          warningsReceived: data.warnings_received || 0,
          daysActive: data.days_active || 0,
          lastMessageAt: data.last_message_at
        });
      } else {
        // Initialize stats for new user
        setActivityStats({
          messagesSent: 0,
          helpfulReactionsReceived: 0,
          reportsSubmitted: 0,
          warningsReceived: 0,
          daysActive: 0
        });
      }

    } catch (err) {
      console.error('Error in loadActivityStats:', err);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (targetUserId: string, newRole: AppRole, expiresAt?: string) => {
    if (!user) return { success: false, error: 'Non authentifié' };

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: targetUserId,
          role: newRole,
          assigned_by: user.id,
          expires_at: expiresAt || null
        });

      if (error) {
        console.error('Error assigning role:', error);
        return { success: false, error: error.message };
      }

      toast({
        title: 'Rôle assigné',
        description: `Le rôle ${RoleManager.getRoleDisplayName(newRole)} a été assigné avec succès.`,
      });

      // Reload data if we're looking at our own profile
      if (targetUserId === user.id) {
        await loadUserRole();
      }

      return { success: true, data };

    } catch (err) {
      console.error('Error in assignRole:', err);
      return { success: false, error: 'Erreur lors de l\'assignation du rôle' };
    }
  };

  const updateActivity = async (activityType: 'message' | 'helpful_reaction' | 'report' | 'warning') => {
    if (!user?.id) return;

    try {
      await supabase.rpc('update_user_activity', {
        _user_id: user.id,
        _activity_type: activityType
      });

      // Reload stats after update
      if (user.id === targetUserId) {
        await loadActivityStats();
      }

    } catch (err) {
      console.error('Error updating activity:', err);
    }
  };

  const hasPermission = (permission: keyof typeof RoleManager.getPermissions) => {
    return RoleManager.checkPermission(userRole, permission);
  };

  const canPerformAction = (requiredRole: AppRole) => {
    return RoleManager.canPerformAction(userRole, requiredRole);
  };

  const getPermissions = () => {
    return RoleManager.getPermissions(userRole);
  };

  const getNextRoleRequirements = () => {
    if (!activityStats) return null;
    return RoleManager.getRequirementsForNextRole(userRole, activityStats);
  };

  const getRoleDisplayInfo = () => {
    return {
      name: RoleManager.getRoleDisplayName(userRole),
      description: RoleManager.getRoleDescription(userRole),
      badgeColor: RoleManager.getPermissions(userRole).badgeColor
    };
  };

  return {
    userRole,
    roleData,
    activityStats,
    loading,
    error,
    assignRole,
    updateActivity,
    hasPermission,
    canPerformAction,
    getPermissions,
    getNextRoleRequirements,
    getRoleDisplayInfo,
    reload: () => {
      loadUserRole();
      loadActivityStats();
    }
  };
};

export default useUserRoles;