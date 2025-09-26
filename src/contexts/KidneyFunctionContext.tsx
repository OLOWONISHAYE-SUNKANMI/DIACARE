import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KidneyFunctionReading {
  id: string;
  creatinine: number | string;
  microalbumin: number | string;
  recorded_date: Date;
}

interface KidneyFunctionContextType {
  readings: KidneyFunctionReading[];
  addKidneyFunctionReading: (
    reading: Omit<KidneyFunctionReading, 'id'>
  ) => Promise<void>;
  getLatestKidneyFunctionReading: () => KidneyFunctionReading | null;
  loadingKidneyFunction: boolean;
}

const KidneyFunctionContext = createContext<
  KidneyFunctionContextType | undefined
>(undefined);

export const KidneyFunctionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [readings, setReadings] = useState<KidneyFunctionReading[]>([]);
  const [loading, setLoading] = useState(false);

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
  //       .from('kidney_function')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .order('recorded_date', { ascending: false });
  //
  //     if (error) {
  //       console.error('Error fetching kidney_function readings:', error);
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
  const addKidneyFunctionReading = useCallback(
    async (reading: Omit<KidneyFunctionReading, 'id'>) => {
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
        .from('kidney_function')
        .insert({
          user_id: user.id,
          creatinine: reading.creatinine,
          microalbumin: reading.microalbumin,
          recorded_date: reading.recorded_date,
        })
        .select()
        .single();

      if (error) throw error;

      setReadings(prev => [data as KidneyFunctionReading, ...prev]);
    },
    []
  );

  // Get latest reading
  const getLatestKidneyFunctionReading = useCallback(() => {
    return readings[0] || null;
  }, [readings]);

  return (
    <KidneyFunctionContext.Provider
      value={{
        readings,
        addKidneyFunctionReading,
        getLatestKidneyFunctionReading,
        loadingKidneyFunction: loading,
      }}
    >
      {children}
    </KidneyFunctionContext.Provider>
  );
};

export const useKidneyFunction = () => {
  const context = useContext(KidneyFunctionContext);
  if (context === undefined) {
    throw new Error(
      'useKidneyFunction must be used within a KidneyFunctionProvider'
    );
  }
  return context;
};
