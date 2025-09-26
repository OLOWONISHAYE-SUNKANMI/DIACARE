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
import { toast } from 'sonner';

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
  //     setLoadingHba1c(true);

  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) return;

  //     const { data, error } = await supabase
  //       .from('hemoglobin_tracker')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .order('recorded_date', { ascending: false });

  //     if (error) {
  //       console.error('Error fetching kidney_function readings:', error);
  //     } else if (data) {
  //       setReadings(data);
  //       console.log(data);
  //     }

  //     setLoadingHba1c(false);
  //   };

  //   fetchReadings();
  // }, []);

  const addReading = useCallback(async (reading: Omit<HbA1cReading, 'id'>) => {
    setLoadingHba1c(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('hemoglobin_tracker')
      .insert({
        user_id: user.id,
        percentage: reading.percentage,
        recorded_data: reading.recorded_data,
      })
      .select()
      .single();

    if (error) toast.error(error.message);
    else toast.success('Hemoglobin reading saved successfully');
    setLoadingHba1c(false);

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
        loadingHba1c,
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
