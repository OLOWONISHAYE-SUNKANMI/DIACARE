-- Add consultation summary and payment tracking columns to teleconsultations
ALTER TABLE public.teleconsultations 
ADD COLUMN IF NOT EXISTS consultation_summary TEXT,
ADD COLUMN IF NOT EXISTS doctor_payout_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS doctor_payout_amount INTEGER,
ADD COLUMN IF NOT EXISTS admin_notified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS patient_summary_sent_at TIMESTAMP WITH TIME ZONE;

-- Create consultation summaries table for detailed tracking
CREATE TABLE IF NOT EXISTS public.consultation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teleconsultation_id UUID NOT NULL REFERENCES public.teleconsultations(id),
  doctor_notes TEXT,
  prescription TEXT,
  recommendations TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on consultation summaries
ALTER TABLE public.consultation_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for consultation summaries
CREATE POLICY "Doctors can manage their consultation summaries" 
ON public.consultation_summaries
FOR ALL
USING (
  teleconsultation_id IN (
    SELECT id FROM public.teleconsultations 
    WHERE professional_id IN (
      SELECT pa.id FROM professional_applications pa
      WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND pa.status = 'approved'
    )
  )
);

CREATE POLICY "Patients can view their consultation summaries" 
ON public.consultation_summaries
FOR SELECT
USING (
  teleconsultation_id IN (
    SELECT id FROM public.teleconsultations 
    WHERE patient_id = auth.uid()
  )
);

-- Create admin notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on admin notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admin notifications
CREATE POLICY "Admins can manage notifications" 
ON public.admin_notifications
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role));

-- Add trigger for updating consultation summaries updated_at
CREATE TRIGGER update_consultation_summaries_updated_at
BEFORE UPDATE ON public.consultation_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();