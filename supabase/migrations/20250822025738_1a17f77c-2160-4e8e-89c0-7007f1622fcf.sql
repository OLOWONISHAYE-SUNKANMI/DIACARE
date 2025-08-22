-- Create reminders system for DiaCare
-- Table for storing user reminders (insulin, medication, glucose test, meals, activities)

CREATE TABLE public.user_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('insulin', 'medication', 'glucose_test', 'meal', 'activity')),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_time TIME NOT NULL,
  days_of_week INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5,6,7}', -- 1=Monday, 7=Sunday
  is_active BOOLEAN NOT NULL DEFAULT true,
  dose_amount TEXT, -- For insulin/medication
  dose_unit TEXT, -- UI, mg, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT user_reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE public.user_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reminders" 
ON public.user_reminders 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_reminders_updated_at
  BEFORE UPDATE ON public.user_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table for tracking when reminders are completed/snoozed
CREATE TABLE public.reminder_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reminder_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('completed', 'snoozed', 'missed')),
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  
  CONSTRAINT reminder_logs_reminder_id_fkey FOREIGN KEY (reminder_id) REFERENCES public.user_reminders(id) ON DELETE CASCADE,
  CONSTRAINT reminder_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add RLS policies for reminder logs
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reminder logs" 
ON public.reminder_logs 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_user_reminders_user_id_active ON public.user_reminders(user_id, is_active);
CREATE INDEX idx_reminder_logs_reminder_id ON public.reminder_logs(reminder_id);
CREATE INDEX idx_reminder_logs_user_id_logged_at ON public.reminder_logs(user_id, logged_at);