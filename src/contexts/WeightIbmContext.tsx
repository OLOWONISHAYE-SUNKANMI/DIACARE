import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WeightIbmReading {
  id: string;
  weight_kg: number | string;
  height_cm: number | string;
  recorded_date: Date;
}

interface WeightIbmContextType {
  readings: WeightIbmReading[];
  addWeightIbmReading: (reading: Omit<WeightIbmReading, 'id'>) => Promise<void>;
  getLatestWeightIbmReading: () => WeightIbmReading | null;
  loadingWeightIbm: boolean;
}

const WeightIbmContext = createContext<WeightIbmContextType | undefined>(
  undefined
);

export const WeightIbmProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [readings, setReadings] = useState<WeightIbmReading[]>([]);
  const [loadingWeightIbm, setLoadingWeightIbm] = useState(false);

  // Fetch readings on mount
  // useEffect(() => {
  //   const fetchReadings = async () => {
  //     setLoading(true);
  //
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) return;
  //
  //     const { data, error } = await supabase
  //       .from('weight_ibm')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .order('recorded_date', { ascending: false });
  //
  //     if (error) {
  //       console.error('Error fetching weight_ibm readings:', error);
  //     } else if (data) {
  //       setReadings(data);
  //     }
  //
  //     setLoading(false);
  //   };
  //
  //   fetchReadings();
  // }, []);

  // Add new reading
  const addWeightIbmReading = useCallback(
    async (reading: Omit<WeightIbmReading, 'id'>) => {
      setLoadingWeightIbm(true);
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
        .from('weight_ibm')
        .insert({
          user_id: user.id,
          weight_kg: reading.weight_kg,
          height_cm: reading.height_cm,
          recorded_date: reading.recorded_date,
        })
        .select()
        .single();

      if (error) toast.error(error.message);
      else toast.success('Hemoglobin reading saved successfully');

      setLoadingWeightIbm(false);
      setReadings(prev => [data as WeightIbmReading, ...prev]);
    },
    []
  );

  // Get latest reading
  const getLatestWeightIbmReading = useCallback(() => {
    return readings[0] || null;
  }, [readings]);

  return (
    <WeightIbmContext.Provider
      value={{
        readings,
        addWeightIbmReading,
        getLatestWeightIbmReading,
        loadingWeightIbm,
      }}
    >
      {children}
    </WeightIbmContext.Provider>
  );
};

export const useWeightIbm = () => {
  const context = useContext(WeightIbmContext);
  if (context === undefined) {
    throw new Error('useWeightIbm must be used within a WeightIbmProvider');
  }
  return context;
};
