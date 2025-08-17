-- Create enum for message types
CREATE TYPE message_type AS ENUM (
  'daily_motivation',
  'educational',
  'celebration',
  'reminder',
  'announcement'
);

-- Create enum for schedule frequency
CREATE TYPE schedule_frequency AS ENUM (
  'daily',
  'weekly',
  'monthly',
  'on_event'
);

-- Create table for message templates
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type message_type NOT NULL,
  content TEXT NOT NULL,
  reactions TEXT[] DEFAULT '{}',
  has_link BOOLEAN DEFAULT false,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for scheduled messages
CREATE TABLE public.scheduled_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES message_templates(id),
  frequency schedule_frequency NOT NULL,
  schedule_time TIME,
  schedule_day TEXT,
  schedule_date DATE,
  event_type TEXT,
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  next_send_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for automated message logs
CREATE TABLE public.automated_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES message_templates(id),
  scheduled_message_id UUID REFERENCES scheduled_messages(id),
  message_type message_type NOT NULL,
  content TEXT NOT NULL,
  reactions TEXT[] DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_templates
CREATE POLICY "Moderators can manage message templates"
ON public.message_templates
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Everyone can view active templates"
ON public.message_templates
FOR SELECT
USING (is_active = true);

-- RLS Policies for scheduled_messages
CREATE POLICY "Moderators can manage scheduled messages"
ON public.scheduled_messages
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Everyone can view active schedules"
ON public.scheduled_messages
FOR SELECT
USING (is_active = true);

-- RLS Policies for automated_messages
CREATE POLICY "Everyone can view automated messages"
ON public.automated_messages
FOR SELECT
USING (true);

CREATE POLICY "System can insert automated messages"
ON public.automated_messages
FOR INSERT
WITH CHECK (true);

-- Create function to calculate next send time
CREATE OR REPLACE FUNCTION calculate_next_send_time(
  freq schedule_frequency,
  schedule_time TIME,
  schedule_day TEXT DEFAULT NULL,
  schedule_date DATE DEFAULT NULL
) RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
DECLARE
  next_time TIMESTAMP WITH TIME ZONE;
  current_time TIMESTAMP WITH TIME ZONE := now();
  today_date DATE;
  days_offset INTEGER;
BEGIN
  today_date := current_time::DATE;
  
  CASE freq
    WHEN 'daily' THEN
      next_time := today_date::TIMESTAMP WITH TIME ZONE + schedule_time::INTERVAL;
      IF next_time <= current_time THEN
        next_time := next_time + INTERVAL '1 day';
      END IF;
    
    WHEN 'weekly' THEN
      days_offset := CASE schedule_day
        WHEN 'monday' THEN 0
        WHEN 'tuesday' THEN 1
        WHEN 'wednesday' THEN 2
        WHEN 'thursday' THEN 3
        WHEN 'friday' THEN 4
        WHEN 'saturday' THEN 5
        WHEN 'sunday' THEN 6
        ELSE 0
      END;
      
      -- Get the start of current week (Monday)
      next_time := (today_date - EXTRACT(DOW FROM today_date)::INTEGER + 1)::DATE::TIMESTAMP WITH TIME ZONE;
      next_time := next_time + (days_offset || ' days')::INTERVAL + schedule_time::INTERVAL;
      
      IF next_time <= current_time THEN
        next_time := next_time + INTERVAL '1 week';
      END IF;
    
    WHEN 'monthly' THEN
      next_time := date_trunc('month', current_time)::TIMESTAMP WITH TIME ZONE + schedule_time::INTERVAL;
      IF next_time <= current_time THEN
        next_time := next_time + INTERVAL '1 month';
      END IF;
    
    ELSE
      next_time := NULL;
  END CASE;
  
  RETURN next_time;
END;
$$;

-- Create function to update next send time after sending
CREATE OR REPLACE FUNCTION update_next_send_time()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.scheduled_messages 
  SET 
    last_sent_at = now(),
    next_send_at = calculate_next_send_time(
      frequency, 
      schedule_time, 
      schedule_day, 
      schedule_date
    ),
    updated_at = now()
  WHERE id = NEW.scheduled_message_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for updating next send time
CREATE TRIGGER update_schedule_after_send
  AFTER INSERT ON public.automated_messages
  FOR EACH ROW
  WHEN (NEW.scheduled_message_id IS NOT NULL)
  EXECUTE FUNCTION update_next_send_time();

-- Create trigger for updating timestamps
CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON public.message_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_messages_updated_at
  BEFORE UPDATE ON public.scheduled_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default motivational message templates
INSERT INTO public.message_templates (type, content, reactions, has_link, link_url) VALUES
('daily_motivation', '💪 Chaque contrôle glycémique est une victoire !', ARRAY['💪', '❤️', '👏'], false, null),
('daily_motivation', '🌅 Nouveau jour, nouvelles opportunités de bien gérer votre diabète', ARRAY['🌅', '💪', '❤️'], false, null),
('daily_motivation', '🎯 Votre persévérance d''aujourd''hui = votre santé de demain', ARRAY['🎯', '💪', '🏆'], false, null),
('daily_motivation', '👥 Ensemble, nous sommes plus forts face au diabète', ARRAY['👥', '❤️', '🤝'], false, null),
('daily_motivation', '🏆 Chaque petit geste compte dans votre parcours DARE', ARRAY['🏆', '💪', '👏'], false, null),
('educational', '📚 Conseil de la semaine : Surveillez vos pieds quotidiennement pour détecter toute blessure ou changement.', ARRAY['📚', '👍', '💡'], true, 'https://www.diabete.fr/conseils-prevention'),
('educational', '🥗 Astuce nutrition : Les légumes verts à feuilles sont vos alliés pour stabiliser la glycémie.', ARRAY['🥗', '💡', '👍'], true, null),
('educational', '🏃‍♂️ Le saviez-vous ? 30 minutes de marche après un repas aident à réguler la glycémie.', ARRAY['🚶‍♂️', '💡', '👍'], true, null);

-- Create default daily motivation schedule
INSERT INTO public.scheduled_messages (template_id, frequency, schedule_time, next_send_at)
SELECT 
  id,
  'daily'::schedule_frequency,
  '08:00'::TIME,
  calculate_next_send_time('daily'::schedule_frequency, '08:00'::TIME)
FROM public.message_templates 
WHERE type = 'daily_motivation' 
LIMIT 1;

-- Create default weekly educational schedule
INSERT INTO public.scheduled_messages (template_id, frequency, schedule_time, schedule_day, next_send_at)
SELECT 
  id,
  'weekly'::schedule_frequency,
  '10:00'::TIME,
  'monday',
  calculate_next_send_time('weekly'::schedule_frequency, '10:00'::TIME, 'monday')
FROM public.message_templates 
WHERE type = 'educational' 
LIMIT 1;