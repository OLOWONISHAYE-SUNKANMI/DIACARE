import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BloodPressureReading {
  id: string;
  systolic: number | string;
  diastolic: number | string;
  recorded_date: Date;
}

interface BloodPressureContextType {
  readings: BloodPressureReading[];
  addBloodReading: (reading: Omit<BloodPressureReading, 'id'>) => Promise<void>;
  getLatestBloodReading: () => BloodPressureReading | null;
  loadingBlood: boolean;
}

const BloodPressureContext = createContext<
  BloodPressureContextType | undefined
>(undefined);

export const BloodPressureProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [readings, setReadings] = useState<BloodPressureReading[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch readings on mount
  // useEffect(() => {
  //   const fetchReadings = async () => {
  //     setLoading(true);

  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) return;

  //     const { data, error } = await supabase
  //       .from('blood_pressure')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .order('recorded_data', { ascending: false });

  //     if (error) {
  //       console.error('Error fetching blood pressure readings:', error);
  //     } else if (data) {
  //       setReadings(data);
  //     }

  //     setLoading(false);
  //   };

  //   fetchReadings();
  // }, []);

  // add new reading
  const addBloodReading = useCallback(
    async (reading: Omit<BloodPressureReading, 'id'>) => {
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
        .from('blood_pressure')
        .insert({
          user_id: user.id,
          systolic: reading.systolic,
          diastolic: reading.diastolic,
          recorded_date: reading.recorded_date,
        })
        .select()
        .single();

      if (error) throw error;

      setReadings(prev => [data as BloodPressureReading, ...prev]);
    },
    []
  );

  // get latest reading
  const getLatestBloodReading = useCallback(() => {
    return readings[0] || null;
  }, [readings]);

  return (
    <BloodPressureContext.Provider
      value={{
        readings,
        addBloodReading,
        getLatestBloodReading,
        loadingBlood: false,
      }}
    >
      {children}
    </BloodPressureContext.Provider>
  );
};

export const useBloodPressure = () => {
  const context = useContext(BloodPressureContext);
  if (context === undefined) {
    throw new Error(
      'useBloodPressure must be used within a BloodPressureProvider'
    );
  }
  return context;
};
