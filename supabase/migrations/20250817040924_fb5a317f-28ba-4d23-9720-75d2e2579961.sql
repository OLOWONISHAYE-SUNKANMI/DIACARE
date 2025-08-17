-- Create enum for professional specialties
CREATE TYPE professional_specialty AS ENUM ('endocrinologist', 'psychologist', 'nutritionist', 'nurse', 'general_practitioner', 'diabetologist');

-- Create professional rates table
CREATE TABLE public.professional_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialty professional_specialty NOT NULL,
  rate_per_consultation INTEGER NOT NULL, -- in CFA francs
  currency TEXT DEFAULT 'XOF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teleconsultations table
CREATE TABLE public.teleconsultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  session_id TEXT, -- Video call session ID
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled, no_show
  consultation_notes TEXT,
  prescription TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  patient_feedback TEXT,
  amount_charged INTEGER, -- in CFA francs
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professional earnings table
CREATE TABLE public.professional_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  teleconsultation_id UUID NOT NULL,
  gross_amount INTEGER NOT NULL, -- Total amount charged
  platform_fee INTEGER NOT NULL, -- DARE commission (e.g., 10%)
  net_amount INTEGER NOT NULL, -- Amount to professional after commission
  currency TEXT DEFAULT 'XOF',
  payout_status TEXT DEFAULT 'pending', -- pending, processed, failed
  payout_date TIMESTAMP WITH TIME ZONE,
  payout_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professional availability table
CREATE TABLE public.professional_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teleconsultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_rates
CREATE POLICY "Everyone can view professional rates"
ON public.professional_rates
FOR SELECT
USING (true);

CREATE POLICY "Moderators can manage professional rates"
ON public.professional_rates
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role));

-- RLS Policies for teleconsultations
CREATE POLICY "Professionals can view their own consultations"
ON public.teleconsultations
FOR SELECT
USING (professional_id IN (
  SELECT pa.id FROM professional_applications pa
  WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND pa.status = 'approved'
));

CREATE POLICY "Patients can view their own consultations"
ON public.teleconsultations
FOR SELECT
USING (patient_id = auth.uid());

CREATE POLICY "Professionals can update their consultations"
ON public.teleconsultations
FOR UPDATE
USING (professional_id IN (
  SELECT pa.id FROM professional_applications pa
  WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND pa.status = 'approved'
));

CREATE POLICY "System can create teleconsultations"
ON public.teleconsultations
FOR INSERT
WITH CHECK (true);

-- RLS Policies for professional_earnings
CREATE POLICY "Professionals can view their own earnings"
ON public.professional_earnings
FOR SELECT
USING (professional_id IN (
  SELECT pa.id FROM professional_applications pa
  WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND pa.status = 'approved'
));

CREATE POLICY "System can manage earnings"
ON public.professional_earnings
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for professional_availability
CREATE POLICY "Everyone can view professional availability"
ON public.professional_availability
FOR SELECT
USING (true);

CREATE POLICY "Professionals can manage their own availability"
ON public.professional_availability
FOR ALL
USING (professional_id IN (
  SELECT pa.id FROM professional_applications pa
  WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND pa.status = 'approved'
))
WITH CHECK (professional_id IN (
  SELECT pa.id FROM professional_applications pa
  WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND pa.status = 'approved'
));

-- Insert default professional rates
INSERT INTO public.professional_rates (specialty, rate_per_consultation) VALUES
('endocrinologist', 500),
('psychologist', 500),
('nutritionist', 500),
('nurse', 500),
('general_practitioner', 500),
('diabetologist', 600);

-- Function to calculate professional earnings
CREATE OR REPLACE FUNCTION public.calculate_professional_earnings(
  _teleconsultation_id UUID,
  _platform_fee_percentage DECIMAL DEFAULT 10.0
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  consultation_record RECORD;
  earnings_id UUID;
  platform_fee_amount INTEGER;
  net_amount INTEGER;
BEGIN
  -- Get consultation details
  SELECT * INTO consultation_record
  FROM public.teleconsultations
  WHERE id = _teleconsultation_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Teleconsultation not found';
  END IF;
  
  -- Calculate fees
  platform_fee_amount := ROUND(consultation_record.amount_charged * (_platform_fee_percentage / 100.0));
  net_amount := consultation_record.amount_charged - platform_fee_amount;
  
  -- Insert earnings record
  INSERT INTO public.professional_earnings (
    professional_id,
    teleconsultation_id,
    gross_amount,
    platform_fee,
    net_amount
  ) VALUES (
    consultation_record.professional_id,
    _teleconsultation_id,
    consultation_record.amount_charged,
    platform_fee_amount,
    net_amount
  ) RETURNING id INTO earnings_id;
  
  RETURN earnings_id;
END;
$$;

-- Function to get professional schedule
CREATE OR REPLACE FUNCTION public.get_professional_schedule(
  _professional_id UUID,
  _start_date DATE,
  _end_date DATE
) RETURNS TABLE (
  date DATE,
  day_of_week INTEGER,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN,
  booked_slots BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(_start_date, _end_date, '1 day'::interval)::date AS date
  ),
  availability AS (
    SELECT 
      ds.date,
      EXTRACT(DOW FROM ds.date)::integer AS day_of_week,
      pa.start_time,
      pa.end_time,
      pa.is_available
    FROM date_series ds
    LEFT JOIN public.professional_availability pa ON 
      pa.professional_id = _professional_id AND 
      pa.day_of_week = EXTRACT(DOW FROM ds.date)::integer
  ),
  bookings AS (
    SELECT 
      t.scheduled_at::date AS date,
      COUNT(*) AS booked_count
    FROM public.teleconsultations t
    WHERE t.professional_id = _professional_id 
    AND t.scheduled_at::date BETWEEN _start_date AND _end_date
    AND t.status NOT IN ('cancelled', 'no_show')
    GROUP BY t.scheduled_at::date
  )
  SELECT 
    a.date,
    a.day_of_week,
    a.start_time,
    a.end_time,
    COALESCE(a.is_available, false) AS is_available,
    COALESCE(b.booked_count, 0) AS booked_slots
  FROM availability a
  LEFT JOIN bookings b ON a.date = b.date
  ORDER BY a.date;
END;
$$;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_professional_rates_updated_at
BEFORE UPDATE ON public.professional_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teleconsultations_updated_at
BEFORE UPDATE ON public.teleconsultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_availability_updated_at
BEFORE UPDATE ON public.professional_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();