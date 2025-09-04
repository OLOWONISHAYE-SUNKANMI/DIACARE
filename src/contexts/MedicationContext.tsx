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

export interface MedicationEntry {
  id: string;
  user_id: string;
  medication_name: string;
  dose: number;
  dose_unit?: string;
  medication_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface MedicationContextType {
  medications: MedicationEntry[];
  addMedication: (entry: {
    medication_name: string;
    dose: number;
    dose_unit?: string;
    medication_time?: string; // allow custom time if backfilling
    notes?: string;
  }) => Promise<void>;
  loading: boolean;
}

const MedicationContext = createContext<MedicationContextType | undefined>(
  undefined
);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch medications on mount
  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('medication_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('medication_time', { ascending: false });

      if (error) {
        console.error('Error fetching medications:', error);
      } else if (data) {
        setMedications(data as MedicationEntry[]);
      }

      setLoading(false);
    };

    fetchMedications();
  }, [user]);

  // 🔹 Add new medication
  const addMedication = useCallback(
    async ({
      medication_name,
      dose,
      dose_unit,
      medication_time,
      notes,
    }: {
      medication_name: string;
      dose: number;
      dose_unit?: string;
      medication_time?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('medication_entries')
        .insert({
          user_id: user.id,
          medication_name,
          dose,
          dose_unit: dose_unit ?? 'units', // default
          medication_time: medication_time ?? new Date().toISOString(),
          notes: notes ?? null,
        })
        .select()
        .single();

      if (error) throw error;

      setMedications(prev => [data as MedicationEntry, ...prev]);
    },
    [user]
  );

  return (
    <MedicationContext.Provider value={{ medications, addMedication, loading }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};
