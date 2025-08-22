-- Fix security vulnerability in professional_earnings table
-- Add proper user authentication instead of email-based access

-- 1. Add user_id column to professional_earnings table
ALTER TABLE public.professional_earnings 
ADD COLUMN professional_user_id UUID;

-- 2. Update existing records to link them to the correct users using email matching
-- (since we need to link existing earnings to users somehow)
UPDATE public.professional_earnings pe
SET professional_user_id = au.id
FROM public.professional_applications pa
JOIN auth.users au ON au.email = pa.email
WHERE pe.professional_id = pa.id;

-- 3. Drop the insecure RLS policy
DROP POLICY IF EXISTS "Professionals can view their own earnings" ON public.professional_earnings;

-- 4. Create secure user-based RLS policy for SELECT
CREATE POLICY "Professionals can view their own earnings securely" 
ON public.professional_earnings 
FOR SELECT 
USING (
  professional_user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.professional_applications pa 
    WHERE pa.id = professional_id 
    AND pa.status = 'approved'
    AND pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- 5. Make professional_user_id NOT NULL after data migration
ALTER TABLE public.professional_earnings 
ALTER COLUMN professional_user_id SET NOT NULL;

-- 6. Update the calculate_professional_earnings function to include user_id
CREATE OR REPLACE FUNCTION public.calculate_professional_earnings(_teleconsultation_id uuid, _platform_fee_percentage numeric DEFAULT 10.0)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  consultation_record RECORD;
  earnings_id UUID;
  platform_fee_amount INTEGER;
  net_amount INTEGER;
  prof_user_id UUID;
BEGIN
  -- Get consultation details
  SELECT * INTO consultation_record
  FROM public.teleconsultations
  WHERE id = _teleconsultation_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Teleconsultation not found';
  END IF;
  
  -- Get professional user_id via email
  SELECT au.id INTO prof_user_id
  FROM public.professional_applications pa
  JOIN auth.users au ON au.email = pa.email
  WHERE pa.id = consultation_record.professional_id;
  
  -- Calculate fees
  platform_fee_amount := ROUND(consultation_record.amount_charged * (_platform_fee_percentage / 100.0));
  net_amount := consultation_record.amount_charged - platform_fee_amount;
  
  -- Insert earnings record with user_id
  INSERT INTO public.professional_earnings (
    professional_id,
    professional_user_id,
    teleconsultation_id,
    gross_amount,
    platform_fee,
    net_amount
  ) VALUES (
    consultation_record.professional_id,
    prof_user_id,
    _teleconsultation_id,
    consultation_record.amount_charged,
    platform_fee_amount,
    net_amount
  ) RETURNING id INTO earnings_id;
  
  RETURN earnings_id;
END;
$function$;