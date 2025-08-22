import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MealEntry {
  id: string;
  user_id: string;
  meal_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  portion_grams: number;
  carbs_per_100g: number;
  total_carbs: number;
  calories_per_100g: number;
  total_calories: number;
  sugar_per_100g: number;
  total_sugar: number;
  protein_per_100g: number;
  total_protein: number;
  fat_per_100g: number;
  total_fat: number;
  fiber_per_100g: number;
  total_fiber: number;
  meal_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityEntry {
  id: string;
  user_id: string;
  activity_name: string;
  activity_type: 'walking' | 'running' | 'cycling' | 'swimming' | 'gym' | 'sports' | 'dancing' | 'yoga' | 'housework' | 'other';
  duration_minutes: number;
  intensity: 'low' | 'moderate' | 'high';
  calories_per_minute: number;
  total_calories_burned: number;
  distance_km?: number;
  steps_count?: number;
  heart_rate_avg?: number;
  activity_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DailySummary {
  id: string;
  user_id: string;
  summary_date: string;
  total_meals: number;
  total_carbs: number;
  total_calories_consumed: number;
  total_activities: number;
  total_exercise_minutes: number;
  total_calories_burned: number;
  total_steps: number;
  net_calories: number;
  glucose_readings_count: number;
  avg_glucose?: number;
  created_at: string;
  updated_at: string;
}

export function useNutritionTracking() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch data for a specific date
  const fetchDataForDate = async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      const startOfDay = `${date}T00:00:00Z`;
      const endOfDay = `${date}T23:59:59Z`;

      // Fetch meals
      const { data: mealsData, error: mealsError } = await supabase
        .from('meal_entries')
        .select('*')
        .gte('meal_time', startOfDay)
        .lte('meal_time', endOfDay)
        .order('meal_time', { ascending: true });

      if (mealsError) throw mealsError;

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activity_entries')
        .select('*')
        .gte('activity_time', startOfDay)
        .lte('activity_time', endOfDay)
        .order('activity_time', { ascending: true });

      if (activitiesError) throw activitiesError;

      // Fetch daily summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('summary_date', date)
        .maybeSingle();

      if (summaryError) throw summaryError;

      setMeals((mealsData || []) as MealEntry[]);
      setActivities((activitiesData || []) as ActivityEntry[]);
      setDailySummary(summaryData as DailySummary | null);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données nutritionnelles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new meal entry
  const addMealEntry = async (mealData: Omit<MealEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'total_carbs' | 'total_calories' | 'total_sugar' | 'total_protein' | 'total_fat' | 'total_fiber'>) => {
    try {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('meal_entries')
        .insert({
          ...mealData,
          user_id: user.data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setMeals(prev => [...prev, data as MealEntry]);
      toast({
        title: "🍽️ Repas ajouté",
        description: `${mealData.meal_name} enregistré avec succès`,
      });

      // Refresh today's summary
      const today = new Date().toISOString().split('T')[0];
      await fetchDataForDate(today);

      return data as MealEntry;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le repas",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Add new activity entry
  const addActivityEntry = async (activityData: Omit<ActivityEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'total_calories_burned'>) => {
    try {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('activity_entries')
        .insert({
          ...activityData,
          user_id: user.data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => [...prev, data as ActivityEntry]);
      toast({
        title: "🏃 Activité ajoutée",
        description: `${activityData.activity_name} enregistrée avec succès`,
      });

      // Refresh today's summary
      const today = new Date().toISOString().split('T')[0];
      await fetchDataForDate(today);

      return data as ActivityEntry;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'activité",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Update meal entry
  const updateMealEntry = async (id: string, updates: Partial<MealEntry>) => {
    try {
      const { data, error } = await supabase
        .from('meal_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMeals(prev => prev.map(meal => meal.id === id ? data as MealEntry : meal));
      toast({
        title: "✅ Repas modifié",
        description: "Les modifications ont été sauvegardées",
      });

      return data as MealEntry;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le repas",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Update activity entry
  const updateActivityEntry = async (id: string, updates: Partial<ActivityEntry>) => {
    try {
      const { data, error } = await supabase
        .from('activity_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => prev.map(activity => activity.id === id ? data as ActivityEntry : activity));
      toast({
        title: "✅ Activité modifiée",
        description: "Les modifications ont été sauvegardées",
      });

      return data as ActivityEntry;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'activité",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Delete meal entry
  const deleteMealEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMeals(prev => prev.filter(meal => meal.id !== id));
      toast({
        title: "🗑️ Repas supprimé",
        description: "Le repas a été supprimé",
      });

      // Refresh today's summary
      const today = new Date().toISOString().split('T')[0];
      await fetchDataForDate(today);
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le repas",
        variant: "destructive"
      });
    }
  };

  // Delete activity entry
  const deleteActivityEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activity_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setActivities(prev => prev.filter(activity => activity.id !== id));
      toast({
        title: "🗑️ Activité supprimée",
        description: "L'activité a été supprimée",
      });

      // Refresh today's summary
      const today = new Date().toISOString().split('T')[0];
      await fetchDataForDate(today);
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité",
        variant: "destructive"
      });
    }
  };

  // Get nutrition info for common foods
  const getNutritionInfo = (foodName: string) => {
    const nutritionDatabase: Record<string, {
      carbs: number;
      calories: number;
      protein: number;
      fat: number;
      fiber: number;
      sugar: number;
    }> = {
      'riz blanc cuit': { carbs: 28, calories: 130, protein: 2.7, fat: 0.3, fiber: 0.4, sugar: 0.1 },
      'pain de mie': { carbs: 49, calories: 265, protein: 9, fat: 3.2, fiber: 2.7, sugar: 5 },
      'pâtes cuites': { carbs: 25, calories: 131, protein: 5, fat: 1.1, fiber: 1.8, sugar: 0.6 },
      'pomme': { carbs: 14, calories: 52, protein: 0.3, fat: 0.2, fiber: 2.4, sugar: 10 },
      'banane': { carbs: 23, calories: 89, protein: 1.1, fat: 0.3, fiber: 2.6, sugar: 12 },
      'yaourt nature': { carbs: 5, calories: 59, protein: 10, fat: 0.4, fiber: 0, sugar: 5 }
    };

    return nutritionDatabase[foodName.toLowerCase()] || null;
  };

  // Get activity calories estimation
  const getActivityCalories = (activityType: ActivityEntry['activity_type'], intensity: ActivityEntry['intensity']) => {
    const metValues: Record<string, Record<string, number>> = {
      walking: { low: 2.5, moderate: 3.5, high: 4.5 },
      running: { low: 6, moderate: 8, high: 12 },
      cycling: { low: 4, moderate: 6, high: 8 },
      swimming: { low: 6, moderate: 8, high: 11 },
      gym: { low: 3, moderate: 5, high: 7 },
      sports: { low: 4, moderate: 6, high: 8 },
      dancing: { low: 3, moderate: 4.5, high: 6 },
      yoga: { low: 2.5, moderate: 3, high: 4 },
      housework: { low: 2.5, moderate: 3.5, high: 4 },
      other: { low: 3, moderate: 4, high: 5 }
    };

    return metValues[activityType]?.[intensity] || 3.5;
  };

  // Load today's data on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    fetchDataForDate(today);
  }, []);

  return {
    meals,
    activities,
    dailySummary,
    loading,
    error,
    addMealEntry,
    addActivityEntry,
    updateMealEntry,
    updateActivityEntry,
    deleteMealEntry,
    deleteActivityEntry,
    fetchDataForDate,
    getNutritionInfo,
    getActivityCalories
  };
}