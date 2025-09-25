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

export interface HbA1cReading {
  id: string;
  percentage: number | string;
  recorded_data: Date;
}

interface HbA1cContextType {
  readings: HbA1cReading[];
  addReading: (reading: Omit<HbA1cReading, 'id'>) => Promise<void>;
  getLatestHba1cReading: () => HbA1cReading | null;
  loadingHba1c: boolean;
}

const HbA1cContext = createContext<HbA1cContextType | undefined>(undefined);

export const HbA1cProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [readings, setReadings] = useState<HbA1cReading[]>([]);
  const [loadingHba1c, setLoadingHba1c] = useState(false);

  // useEffect(() => {
  //   const fetchReadings = async () => {
  //     if (!auth.uid) return;
  //     setLoadingHba1c(true);
  //     const { data, error } = await supabase
  //       .from('hemoglobin_tracker')
  //       .select('*')
  //       .eq('user_id', auth.uid)
  //       .order('recorded_data', { ascending: false });
  //     if (error) {
  //       console.error('Error fetching HbA1c readings:', error);
  //     } else if (data) {
  //       setReadings(data);
  //     }
  //     setLoadingHba1c(false);
  //   };
  //   fetchReadings();
  // }, [auth.uid]);

  const addReading = useCallback(async (reading: Omit<HbA1cReading, 'id'>) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('No user logged in');

    console.log('Supabase user:', user);
    console.log('User ID being inserted:', user.id);
    console.log('Reading data:', reading);

    const { data, error } = await supabase
      .from('hemoglobin_tracker')
      .insert({
        user_id: user.id,
        percentage: reading.percentage,
        recorded_data: reading.recorded_data,
      })
      .select()
      .single();
    if (error) throw error;

    setReadings(prev => [data as HbA1cReading, ...prev]);
  }, []);

  const getLatestHba1cReading = useCallback(() => {
    return readings[0] || null;
  }, [readings]);

  return (
    <HbA1cContext.Provider
      value={{
        readings,
        addReading,
        getLatestHba1cReading,
        loadingHba1c: false,
      }}
    >
      {children}
    </HbA1cContext.Provider>
  );
};

export const useHbA1c = () => {
  const context = useContext(HbA1cContext);
  if (context === undefined) {
    throw new Error('useHbA1c must be used within a HbA1cProvider');
  }
  return context;
};
