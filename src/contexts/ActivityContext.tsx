import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ActivityEntry {
  id: string;
  user_id: string;
  activity_name: string;
  activity_type: string;
  duration_minutes: number;
  intensity?: string;
  calories_per_minute?: number;
  total_calories_burned?: number;
  distance_km?: number;
  steps_count?: number;
  heart_rate_avg?: number;
  activity_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ActivityContextType {
  activities: ActivityEntry[];
  addActivity: (activity: {
    activity_name: string;
    activity_type: string;
    duration_minutes: number;
    intensity?: string;
    notes?: string;
  }) => Promise<void>;
  loading: boolean;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('activity_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('activity_time', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
      } else if (data) {
        setActivities(data as ActivityEntry[]);
      }

      setLoading(false);
    };

    fetchActivities();
  }, [user]);

  // 🔹 Add activity
  const addActivity = useCallback(
    async ({
      activity_name,
      activity_type,
      duration_minutes,
      intensity,
      notes,
    }: {
      activity_name: string;
      activity_type: string;
      duration_minutes: number;
      intensity?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('activity_entries')
        .insert({
          user_id: user.id,
          activity_name,
          activity_type,
          duration_minutes,
          intensity: intensity ?? null,
          activity_time: new Date().toISOString(),
          notes: notes ?? null,
        })
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => [data as ActivityEntry, ...prev]);
    },
    [user]
  );

  return (
    <ActivityContext.Provider value={{ activities, addActivity, loading }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
};
