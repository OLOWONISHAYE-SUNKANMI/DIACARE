-- Create glucose_readings table for core functionality
CREATE TABLE public.glucose_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  value NUMERIC NOT NULL CHECK (value >= 0 AND value <= 999),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  context TEXT NOT NULL DEFAULT 'general',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.glucose_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own glucose readings"
ON public.glucose_readings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own glucose readings"
ON public.glucose_readings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own glucose readings"
ON public.glucose_readings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own glucose readings"
ON public.glucose_readings
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_glucose_readings_user_id ON public.glucose_readings(user_id);
CREATE INDEX idx_glucose_readings_timestamp ON public.glucose_readings(timestamp DESC);
CREATE INDEX idx_glucose_readings_context ON public.glucose_readings(context);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_glucose_readings_updated_at
  BEFORE UPDATE ON public.glucose_readings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();