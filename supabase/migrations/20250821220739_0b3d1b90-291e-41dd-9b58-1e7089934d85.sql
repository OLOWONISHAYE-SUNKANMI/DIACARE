-- Mise à jour des tarifs professionnels avec les nouveaux montants et pourcentages
UPDATE professional_rates SET rate_per_consultation = 63000 WHERE specialty = 'endocrinologist';
INSERT INTO professional_rates (specialty, rate_per_consultation, currency) VALUES ('endocrinologist', 63000, 'XOF') ON CONFLICT (specialty) DO UPDATE SET rate_per_consultation = 63000;

INSERT INTO professional_rates (specialty, rate_per_consultation, currency) VALUES ('general_practitioner', 52000, 'XOF') ON CONFLICT (specialty) DO UPDATE SET rate_per_consultation = 52000;
INSERT INTO professional_rates (specialty, rate_per_consultation, currency) VALUES ('psychologist', 43000, 'XOF') ON CONFLICT (specialty) DO UPDATE SET rate_per_consultation = 43000;
INSERT INTO professional_rates (specialty, rate_per_consultation, currency) VALUES ('nurse', 12000, 'XOF') ON CONFLICT (specialty) DO UPDATE SET rate_per_consultation = 12000;
INSERT INTO professional_rates (specialty, rate_per_consultation, currency) VALUES ('nutritionist', 10000, 'XOF') ON CONFLICT (specialty) DO UPDATE SET rate_per_consultation = 10000;

-- Table pour les demandes de consultation
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL,
  professional_code TEXT NOT NULL,
  consultation_reason TEXT NOT NULL,
  patient_message TEXT,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  professional_response TEXT,
  consultation_fee INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les notes de consultation
CREATE TABLE IF NOT EXISTS public.consultation_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID,
  professional_id UUID NOT NULL,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  recommendations TEXT,
  next_appointment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultation_requests
CREATE POLICY "Patients can view their own requests" ON public.consultation_requests
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Patients can create requests" ON public.consultation_requests
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Professionals can view their requests" ON public.consultation_requests
  FOR SELECT USING (professional_id IN (
    SELECT pa.id FROM professional_applications pa 
    WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND pa.status = 'approved'
  ));

CREATE POLICY "Professionals can update their requests" ON public.consultation_requests
  FOR UPDATE USING (professional_id IN (
    SELECT pa.id FROM professional_applications pa 
    WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND pa.status = 'approved'
  ));

-- RLS Policies for consultation_notes
CREATE POLICY "Patients can view their notes" ON public.consultation_notes
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Professionals can manage notes for their patients" ON public.consultation_notes
  FOR ALL USING (professional_id IN (
    SELECT pa.id FROM professional_applications pa 
    WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND pa.status = 'approved'
  ));

-- Trigger pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_consultation_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_consultation_requests_updated_at
  BEFORE UPDATE ON public.consultation_requests
  FOR EACH ROW EXECUTE FUNCTION update_consultation_request_timestamp();

CREATE TRIGGER update_consultation_notes_updated_at
  BEFORE UPDATE ON public.consultation_notes
  FOR EACH ROW EXECUTE FUNCTION update_consultation_request_timestamp();