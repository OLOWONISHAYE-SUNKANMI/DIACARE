// import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// export interface GlucoseReading {
//   id: string;
//   value: number;
//   timestamp: string;
//   context: string;
//   notes?: string;
// }

// interface GlucoseContextType {
//   readings: GlucoseReading[];
//   addReading: (reading: Omit<GlucoseReading, 'id'>) => void;
//   getLatestReading: () => GlucoseReading | null;
//   getTrend: () => 'up' | 'down' | 'stable';
// }

// const GlucoseContext = createContext<GlucoseContextType | undefined>(undefined);

// export const GlucoseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [readings, setReadings] = useState<GlucoseReading[]>([
//     {
//       id: '1',
//       value: 126,
//       timestamp: new Date().toISOString(),
//       context: 'fasting',
//       notes: 'Première mesure'
//     }
//   ]);

//   const addReading = useCallback((reading: Omit<GlucoseReading, 'id'>) => {
//     const newReading: GlucoseReading = {
//       ...reading,
//       id: Date.now().toString()
//     };
//     setReadings(prev => [newReading, ...prev]);
//   }, []);

//   const getLatestReading = useCallback(() => {
//     return readings[0] || null;
//   }, [readings]);

//   const getTrend = useCallback(() => {
//     if (readings.length < 2) return 'stable';

//     const latest = readings[0].value;
//     const previous = readings[1].value;

//     if (latest > previous + 10) return 'up';
//     if (latest < previous - 10) return 'down';
//     return 'stable';
//   }, [readings]);

//   return (
//     <GlucoseContext.Provider value={{
//       readings,
//       addReading,
//       getLatestReading,
//       getTrend
//     }}>
//       {children}
//     </GlucoseContext.Provider>
//   );
// };

// export const useGlucose = () => {
//   const context = useContext(GlucoseContext);
//   if (context === undefined) {
//     throw new Error('useGlucose must be used within a GlucoseProvider');
//   }
//   return context;
// };

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

export interface GlucoseReading {
  id: string;
  value: number;
  timestamp: string;
  context: string;
  notes?: string;
}

interface GlucoseContextType {
  readings: GlucoseReading[];
  addReading: (reading: Omit<GlucoseReading, 'id'>) => Promise<void>;
  getLatestReading: () => GlucoseReading | null;
  getTrend: () => 'up' | 'down' | 'stable';
  loading: boolean;
}

const GlucoseContext = createContext<GlucoseContextType | undefined>(undefined);

export const GlucoseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch readings from Supabase on mount
  useEffect(() => {
    const fetchReadings = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('glucose_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching glucose readings:', error);
      } else if (data) {
        setReadings(data);
      }

      setLoading(false);
    };

    fetchReadings();
  }, [user]);

  // 🔹 Add new reading (Supabase + local state)
  const addReading = useCallback(
    async (reading: Omit<GlucoseReading, 'id'>) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('glucose_readings')
        .insert({
          user_id: user.id,
          value: reading.value,
          timestamp: reading.timestamp,
          context: reading.context,
          notes: reading.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setReadings(prev => [data as GlucoseReading, ...prev]);
    },
    [user]
  );

  // 🔹 Get latest reading
  const getLatestReading = useCallback(() => {
    return readings[0] || null;
  }, [readings]);

  // 🔹 Calculate trend
  const getTrend = useCallback(() => {
    if (readings.length < 2) return 'stable';

    const latest = readings[0].value;
    const previous = readings[1].value;

    if (latest > previous + 10) return 'up';
    if (latest < previous - 10) return 'down';
    return 'stable';
  }, [readings]);

  return (
    <GlucoseContext.Provider
      value={{
        readings,
        addReading,
        getLatestReading,
        getTrend,
        loading,
      }}
    >
      {children}
    </GlucoseContext.Provider>
  );
};

export const useGlucose = () => {
  const context = useContext(GlucoseContext);
  if (context === undefined) {
    throw new Error('useGlucose must be used within a GlucoseProvider');
  }
  return context;
};
