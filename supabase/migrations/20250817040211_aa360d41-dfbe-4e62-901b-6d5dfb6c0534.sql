-- Create enum for diabetes types
CREATE TYPE diabetes_type AS ENUM ('type1', 'type2', 'gestational', 'other');

-- Create user statistics table
CREATE TABLE public.user_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  avg_glucose DECIMAL(5,2),
  time_in_range DECIMAL(5,2),
  hba1c DECIMAL(4,2),
  days_active INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data sharing preferences table
CREATE TABLE public.data_sharing_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  share_stats BOOLEAN DEFAULT false,
  share_region BOOLEAN DEFAULT false,
  share_age_group BOOLEAN DEFAULT false,
  share_diabetes_type BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create anonymous community statistics table
CREATE TABLE public.anonymous_community_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  avg_glucose DECIMAL(5,2),
  time_in_range DECIMAL(5,2),
  age_group TEXT, -- e.g., '20-30', '31-40', etc.
  diabetes_type diabetes_type,
  region TEXT,
  month_year TEXT, -- Format: 'YYYY-MM'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community insights table
CREATE TABLE public.community_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL, -- 'average_time_in_range', 'most_active_region', etc.
  insight_value JSONB NOT NULL,
  calculation_period TEXT NOT NULL, -- 'weekly', 'monthly', 'yearly'
  calculated_for_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sharing_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_community_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_statistics
CREATE POLICY "Users can view their own statistics"
ON public.user_statistics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own statistics"
ON public.user_statistics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics"
ON public.user_statistics
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for data_sharing_preferences
CREATE POLICY "Users can manage their own sharing preferences"
ON public.data_sharing_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for anonymous_community_stats
CREATE POLICY "Everyone can view anonymous community stats"
ON public.anonymous_community_stats
FOR SELECT
USING (true);

CREATE POLICY "System can insert anonymous stats"
ON public.anonymous_community_stats
FOR INSERT
WITH CHECK (true);

-- RLS Policies for community_insights
CREATE POLICY "Everyone can view community insights"
ON public.community_insights
FOR SELECT
USING (true);

CREATE POLICY "Moderators can manage community insights"
ON public.community_insights
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role));

-- Function to get age group from age
CREATE OR REPLACE FUNCTION public.get_age_group(age INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  CASE 
    WHEN age < 18 THEN RETURN 'under-18';
    WHEN age >= 18 AND age <= 25 THEN RETURN '18-25';
    WHEN age >= 26 AND age <= 35 THEN RETURN '26-35';
    WHEN age >= 36 AND age <= 45 THEN RETURN '36-45';
    WHEN age >= 46 AND age <= 55 THEN RETURN '46-55';
    WHEN age >= 56 AND age <= 65 THEN RETURN '56-65';
    ELSE RETURN 'over-65';
  END CASE;
END;
$$;

-- Function to anonymize and share user statistics
CREATE OR REPLACE FUNCTION public.share_anonymous_statistics(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_prefs RECORD;
  user_stats RECORD;
  user_profile RECORD;
  anonymized_record RECORD;
BEGIN
  -- Get user sharing preferences
  SELECT * INTO user_prefs
  FROM public.data_sharing_preferences
  WHERE user_id = _user_id;
  
  -- Exit if user doesn't want to share stats
  IF user_prefs IS NULL OR NOT user_prefs.share_stats THEN
    RETURN false;
  END IF;
  
  -- Get user statistics
  SELECT * INTO user_stats
  FROM public.user_statistics
  WHERE user_id = _user_id
  ORDER BY updated_at DESC
  LIMIT 1;
  
  -- Get user profile (assuming we have age and region in profiles)
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE user_id = _user_id;
  
  -- Insert anonymized data
  INSERT INTO public.anonymous_community_stats (
    avg_glucose,
    time_in_range,
    age_group,
    diabetes_type,
    region,
    month_year
  ) VALUES (
    user_stats.avg_glucose,
    user_stats.time_in_range,
    CASE WHEN user_prefs.share_age_group THEN get_age_group(EXTRACT(YEAR FROM AGE(CURRENT_DATE, user_profile.created_at::date))::integer) ELSE NULL END,
    CASE WHEN user_prefs.share_diabetes_type THEN user_profile.diabetes_type ELSE NULL END,
    CASE WHEN user_prefs.share_region THEN user_profile.region ELSE NULL END,
    TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  );
  
  RETURN true;
END;
$$;

-- Function to generate community insights
CREATE OR REPLACE FUNCTION public.generate_community_insights()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_month TEXT := TO_CHAR(CURRENT_DATE, 'YYYY-MM');
  insights JSONB := '{}';
  avg_time_in_range DECIMAL;
  most_active_region TEXT;
  popular_meal_times JSONB;
  common_challenges JSONB;
BEGIN
  -- Calculate average time in range
  SELECT AVG(time_in_range) INTO avg_time_in_range
  FROM public.anonymous_community_stats
  WHERE month_year = current_month
  AND time_in_range IS NOT NULL;
  
  -- Find most active region
  SELECT region INTO most_active_region
  FROM public.anonymous_community_stats
  WHERE month_year = current_month
  AND region IS NOT NULL
  GROUP BY region
  ORDER BY COUNT(*) DESC
  LIMIT 1;
  
  -- Build insights JSON
  insights := jsonb_build_object(
    'averageTimeInRange', COALESCE(ROUND(avg_time_in_range, 0)::text || '%', 'N/A'),
    'mostActiveRegion', COALESCE(most_active_region, 'N/A'),
    'popularMealTimes', '["7h-9h", "12h-14h", "19h-21h"]'::jsonb,
    'commonChallenges', '["Gestion post-repas", "Activité physique", "Stress"]'::jsonb,
    'totalParticipants', (
      SELECT COUNT(DISTINCT id)
      FROM public.anonymous_community_stats
      WHERE month_year = current_month
    ),
    'lastUpdated', CURRENT_TIMESTAMP
  );
  
  -- Store insights for caching
  INSERT INTO public.community_insights (
    insight_type,
    insight_value,
    calculation_period,
    calculated_for_date
  ) VALUES (
    'monthly_summary',
    insights,
    'monthly',
    CURRENT_DATE
  )
  ON CONFLICT (insight_type, calculated_for_date) 
  DO UPDATE SET 
    insight_value = EXCLUDED.insight_value,
    created_at = CURRENT_TIMESTAMP;
  
  RETURN insights;
END;
$$;

-- Add constraints
ALTER TABLE public.anonymous_community_stats
ADD CONSTRAINT unique_monthly_stats 
UNIQUE (avg_glucose, time_in_range, age_group, diabetes_type, region, month_year);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_user_statistics_updated_at
BEFORE UPDATE ON public.user_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_sharing_preferences_updated_at
BEFORE UPDATE ON public.data_sharing_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();