import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CholesterolProfileReading {
  id: string;
  total_cholesterol: number | string;
  hdl: number | string;
  ldl: number | string;
  triglycerides: number | string;
  recorded_date: Date;
}

interface CholesterolProfileContextType {
  readings: CholesterolProfileReading[];
  addCholesterolReading: (
    reading: Omit<CholesterolProfileReading, 'id'>
  ) => Promise<void>;
  getLatestCholesterolReading: () => CholesterolProfileReading | null;
  loadingCholesterol: boolean;
}

const CholesterolProfileContext = createContext<
  CholesterolProfileContextType | undefined
>(undefined);

export const CholesterolProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [readings, setReadings] = useState<CholesterolProfileReading[]>([]);
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
  //       .from('cholesterol_profile')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .order('recorded_date', { ascending: false });
  //
  //     if (error) {
  //       console.error('Error fetching cholesterol_profile readings:', error);
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
  const addCholesterolReading = useCallback(
    async (reading: Omit<CholesterolProfileReading, 'id'>) => {
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
        .from('cholesterol_profile')
        .insert({
          user_id: user.id,
          total_cholesterol: reading.total_cholesterol,
          hdl: reading.hdl,
          ldl: reading.ldl,
          triglycerides: reading.triglycerides,
          recorded_date: reading.recorded_date,
        })
        .select()
        .single();

      if (error) throw error;

      setReadings(prev => [data as CholesterolProfileReading, ...prev]);
    },
    []
  );

  // Get latest reading
  const getLatestCholesterolReading = useCallback(() => {
    return readings[0] || null;
  }, [readings]);

  return (
    <CholesterolProfileContext.Provider
      value={{
        readings,
        addCholesterolReading,
        getLatestCholesterolReading,
        loadingCholesterol: loading,
      }}
    >
      {children}
    </CholesterolProfileContext.Provider>
  );
};

export const useCholesterolProfile = () => {
  const context = useContext(CholesterolProfileContext);
  if (context === undefined) {
    throw new Error(
      'useCholesterolProfile must be used within a CholesterolProfileProvider'
    );
  }
  return context;
};
