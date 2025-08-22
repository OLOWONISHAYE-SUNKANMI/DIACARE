-- Enhanced meal and activity tracking tables for DiaCare
-- Table for detailed meal tracking with automatic calculations

CREATE TABLE public.meal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_name TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  portion_grams INTEGER NOT NULL DEFAULT 100,
  carbs_per_100g NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_carbs NUMERIC(7,2) GENERATED ALWAYS AS (portion_grams * carbs_per_100g / 100) STORED,
  calories_per_100g NUMERIC(6,2) DEFAULT 0,
  total_calories NUMERIC(8,2) GENERATED ALWAYS AS (portion_grams * calories_per_100g / 100) STORED,
  sugar_per_100g NUMERIC(5,2) DEFAULT 0,
  total_sugar NUMERIC(7,2) GENERATED ALWAYS AS (portion_grams * sugar_per_100g / 100) STORED,
  protein_per_100g NUMERIC(5,2) DEFAULT 0,
  total_protein NUMERIC(7,2) GENERATED ALWAYS AS (portion_grams * protein_per_100g / 100) STORED,
  fat_per_100g NUMERIC(5,2) DEFAULT 0,
  total_fat NUMERIC(7,2) GENERATED ALWAYS AS (portion_grams * fat_per_100g / 100) STORED,
  fiber_per_100g NUMERIC(5,2) DEFAULT 0,
  total_fiber NUMERIC(7,2) GENERATED ALWAYS AS (portion_grams * fiber_per_100g / 100) STORED,
  meal_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT meal_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Table for activity tracking with calorie burn calculations
CREATE TABLE public.activity_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_name TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('walking', 'running', 'cycling', 'swimming', 'gym', 'sports', 'dancing', 'yoga', 'housework', 'other')),
  duration_minutes INTEGER NOT NULL,
  intensity TEXT NOT NULL CHECK (intensity IN ('low', 'moderate', 'high')),
  calories_per_minute NUMERIC(4,2) DEFAULT 3.5, -- MET value approximation
  total_calories_burned NUMERIC(7,2) GENERATED ALWAYS AS (duration_minutes * calories_per_minute) STORED,
  distance_km NUMERIC(6,2), -- Optional for activities with distance
  steps_count INTEGER, -- For walking/running
  heart_rate_avg INTEGER, -- Optional heart rate data
  activity_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT activity_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Table for daily summary statistics
CREATE TABLE public.daily_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  summary_date DATE NOT NULL,
  total_meals INTEGER DEFAULT 0,
  total_carbs NUMERIC(8,2) DEFAULT 0,
  total_calories_consumed NUMERIC(10,2) DEFAULT 0,
  total_activities INTEGER DEFAULT 0,
  total_exercise_minutes INTEGER DEFAULT 0,
  total_calories_burned NUMERIC(8,2) DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  net_calories NUMERIC(10,2) GENERATED ALWAYS AS (total_calories_consumed - total_calories_burned) STORED,
  glucose_readings_count INTEGER DEFAULT 0,
  avg_glucose NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT daily_summaries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT daily_summaries_user_date_unique UNIQUE (user_id, summary_date)
);

-- Enable RLS on all tables
ALTER TABLE public.meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

-- RLS policies for meal_entries
CREATE POLICY "Users can manage their own meal entries" 
ON public.meal_entries 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for activity_entries  
CREATE POLICY "Users can manage their own activity entries" 
ON public.activity_entries 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS policies for daily_summaries
CREATE POLICY "Users can view their own daily summaries" 
ON public.daily_summaries 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_meal_entries_updated_at
  BEFORE UPDATE ON public.meal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activity_entries_updated_at
  BEFORE UPDATE ON public.activity_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_summaries_updated_at
  BEFORE UPDATE ON public.daily_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update daily summaries when meals/activities are added
CREATE OR REPLACE FUNCTION public.update_daily_summary_for_user(_user_id UUID, _date DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.daily_summaries (
    user_id,
    summary_date,
    total_meals,
    total_carbs,
    total_calories_consumed,
    total_activities,
    total_exercise_minutes,
    total_calories_burned,
    total_steps
  )
  SELECT 
    _user_id,
    _date,
    COALESCE(meal_stats.meal_count, 0),
    COALESCE(meal_stats.total_carbs, 0),
    COALESCE(meal_stats.total_calories, 0),
    COALESCE(activity_stats.activity_count, 0),
    COALESCE(activity_stats.total_minutes, 0),
    COALESCE(activity_stats.total_calories_burned, 0),
    COALESCE(activity_stats.total_steps, 0)
  FROM (
    SELECT 
      COUNT(*) as meal_count,
      SUM(total_carbs) as total_carbs,
      SUM(total_calories) as total_calories
    FROM public.meal_entries
    WHERE user_id = _user_id AND meal_time::date = _date
  ) meal_stats
  CROSS JOIN (
    SELECT 
      COUNT(*) as activity_count,
      SUM(duration_minutes) as total_minutes,
      SUM(total_calories_burned) as total_calories_burned,
      SUM(steps_count) as total_steps
    FROM public.activity_entries
    WHERE user_id = _user_id AND activity_time::date = _date
  ) activity_stats
  ON CONFLICT (user_id, summary_date) 
  DO UPDATE SET
    total_meals = EXCLUDED.total_meals,
    total_carbs = EXCLUDED.total_carbs,
    total_calories_consumed = EXCLUDED.total_calories_consumed,
    total_activities = EXCLUDED.total_activities,
    total_exercise_minutes = EXCLUDED.total_exercise_minutes,
    total_calories_burned = EXCLUDED.total_calories_burned,
    total_steps = EXCLUDED.total_steps,
    updated_at = now();
END;
$$;

-- Triggers to automatically update daily summaries
CREATE OR REPLACE FUNCTION public.trigger_update_daily_summary()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Handle INSERT and UPDATE
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF TG_TABLE_NAME = 'meal_entries' THEN
      PERFORM public.update_daily_summary_for_user(NEW.user_id, NEW.meal_time::date);
    ELSIF TG_TABLE_NAME = 'activity_entries' THEN
      PERFORM public.update_daily_summary_for_user(NEW.user_id, NEW.activity_time::date);
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'meal_entries' THEN
      PERFORM public.update_daily_summary_for_user(OLD.user_id, OLD.meal_time::date);
    ELSIF TG_TABLE_NAME = 'activity_entries' THEN
      PERFORM public.update_daily_summary_for_user(OLD.user_id, OLD.activity_time::date);
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create triggers
CREATE TRIGGER meal_entries_daily_summary_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.meal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_daily_summary();

CREATE TRIGGER activity_entries_daily_summary_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.activity_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_daily_summary();

-- Create indexes for performance
CREATE INDEX idx_meal_entries_user_date ON public.meal_entries(user_id, meal_time);
CREATE INDEX idx_activity_entries_user_date ON public.activity_entries(user_id, activity_time);
CREATE INDEX idx_daily_summaries_user_date ON public.daily_summaries(user_id, summary_date);