import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ScreeningExamReading {
  id: string;
  last_eye_exam: Date;
  last_foot_exam: Date;
}

interface ScreeningExamContextType {
  readings: ScreeningExamReading[];
  addScreeningExamReading: (
    reading: Omit<ScreeningExamReading, 'id'>
  ) => Promise<void>;
  getLatestScreeningExamReading: () => ScreeningExamReading | null;
  loadingScreeningExam: boolean;
}

const ScreeningExamContext = createContext<
  ScreeningExamContextType | undefined
>(undefined);

export const ScreeningExamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [readings, setReadings] = useState<ScreeningExamReading[]>([]);
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
  //       .from('screening_exams')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .order('last_eye_exam', { ascending: false });
  //
  //     if (error) {
  //       console.error('Error fetching screening_exams readings:', error);
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
  const addScreeningExamReading = useCallback(
    async (reading: Omit<ScreeningExamReading, 'id'>) => {
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
        .from('screening_exams')
        .insert({
          user_id: user.id,
          last_eye_exam: reading.last_eye_exam,
          last_foot_exam: reading.last_foot_exam,
        })
        .select()
        .single();

      if (error) throw error;

      setReadings(prev => [data as ScreeningExamReading, ...prev]);
    },
    []
  );

  // Get latest reading
  const getLatestScreeningExamReading = useCallback(() => {
    return readings[0] || null;
  }, [readings]);

  return (
    <ScreeningExamContext.Provider
      value={{
        readings,
        addScreeningExamReading,
        getLatestScreeningExamReading,
        loadingScreeningExam: loading,
      }}
    >
      {children}
    </ScreeningExamContext.Provider>
  );
};

export const useScreeningExam = () => {
  const context = useContext(ScreeningExamContext);
  if (context === undefined) {
    throw new Error(
      'useScreeningExam must be used within a ScreeningExamProvider'
    );
  }
  return context;
};
