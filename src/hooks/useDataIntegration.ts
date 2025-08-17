import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DataIntegration, 
  DataSharingPreferences, 
  CommunityInsights, 
  UserStatistics 
} from '@/utils/DataIntegration';

export const useDataSharing = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<DataSharingPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id]);

  const loadPreferences = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const prefs = await DataIntegration.getUserSharingPreferences(user.id);
    setPreferences(prefs || {
      shareStats: false,
      shareRegion: false,
      shareAgeGroup: false,
      shareDiabetesType: false
    });
    setLoading(false);
  };

  const updatePreferences = async (newPrefs: Partial<DataSharingPreferences>) => {
    if (!user?.id) return false;

    const success = await DataIntegration.updateSharingPreferences(user.id, newPrefs);
    if (success) {
      setPreferences(prev => prev ? { ...prev, ...newPrefs } : null);
    }
    return success;
  };

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: loadPreferences
  };
};

export const useCommunityInsights = () => {
  const [insights, setInsights] = useState<CommunityInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await DataIntegration.getCommunityInsights();
      setInsights(data);
    } catch (err) {
      setError('Erreur lors du chargement des insights communautaires');
      console.error('Error loading community insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    setLoading(true);
    try {
      const data = await DataIntegration.generateCommunityInsights();
      setInsights(data);
    } catch (err) {
      setError('Erreur lors de la mise à jour des insights');
      console.error('Error refreshing insights:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    insights,
    loading,
    error,
    refetch: loadInsights,
    refresh: refreshInsights
  };
};

export const useUserStatistics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateStatistics = async (stats: UserStatistics) => {
    if (!user?.id) return false;

    setLoading(true);
    try {
      const success = await DataIntegration.updateUserStatistics(user.id, stats);
      return success;
    } finally {
      setLoading(false);
    }
  };

  const updateAndShare = async (stats: UserStatistics) => {
    if (!user?.id) return false;

    setLoading(true);
    try {
      const success = await DataIntegration.updateAndShareStats(user.id, stats);
      return success;
    } finally {
      setLoading(false);
    }
  };

  const shareAnonymous = async () => {
    if (!user?.id) return false;

    setLoading(true);
    try {
      const success = await DataIntegration.shareAnonymousStats(user.id);
      return success;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateStatistics,
    updateAndShare,
    shareAnonymous
  };
};