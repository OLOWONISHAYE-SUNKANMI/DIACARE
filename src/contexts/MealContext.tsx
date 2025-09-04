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

export interface MealEntry {
  id: string;
  user_id: string;
  meal_name: string;
  meal_type: string;
  portion_grams?: number;
  carbs_per_100g?: number;
  total_carbs?: number;
  calories_per_100g?: number;
  total_calories?: number;
  sugar_per_100g?: number;
  total_sugar?: number;
  protein_per_100g?: number;
  total_protein?: number;
  fat_per_100g?: number;
  total_fat?: number;
  fiber_per_100g?: number;
  total_fiber?: number;
  meal_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface MealContextType {
  meals: MealEntry[];
  addMeal: (meal: {
    meal_name: string;
    meal_type: string;
    carbs_per_100g?: number;
    portion_grams?: number;
    notes?: string;
  }) => Promise<void>;
  loading: boolean;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch meals on mount
  useEffect(() => {
    const fetchMeals = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('meal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('meal_time', { ascending: false });

      if (error) {
        console.error('Error fetching meals:', error);
      } else if (data) {
        setMeals(data as MealEntry[]);
      }

      setLoading(false);
    };

    fetchMeals();
  }, [user]);

  // add new meal
  const addMeal = useCallback(
    async ({
      meal_name,
      meal_type,
      carbs_per_100g,
      portion_grams,
      notes,
    }: {
      meal_name: string;
      meal_type: string;
      carbs_per_100g?: number;
      portion_grams?: number;
      notes?: string;
    }) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('meal_entries')
        .insert({
          user_id: user.id,
          meal_name,
          meal_type,
          carbs_per_100g: carbs_per_100g ?? null,
          portion_grams: portion_grams ?? null,
          meal_time: new Date().toISOString(),
          notes: notes ?? null,
        })
        .select()
        .single();

      if (error) throw error;

      setMeals(prev => [data as MealEntry, ...prev]);
    },
    [user]
  );

  return (
    <MealContext.Provider value={{ meals, addMeal, loading }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMeals = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeals must be used within a MealProvider');
  }
  return context;
};
