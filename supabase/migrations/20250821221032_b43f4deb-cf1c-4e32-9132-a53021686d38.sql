-- D'abord créer les contraintes uniques manquantes sur professional_rates
ALTER TABLE public.professional_rates DROP CONSTRAINT IF EXISTS professional_rates_specialty_key;
ALTER TABLE public.professional_rates ADD CONSTRAINT professional_rates_specialty_key UNIQUE (specialty);

-- Mise à jour des tarifs professionnels avec les nouveaux montants
INSERT INTO professional_rates (specialty, rate_per_consultation, currency) VALUES 
('endocrinologist', 63000, 'XOF'),
('general_practitioner', 52000, 'XOF'),
('psychologist', 43000, 'XOF'),
('nurse', 12000, 'XOF'),
('nutritionist', 10000, 'XOF')
ON CONFLICT (specialty) DO UPDATE SET 
rate_per_consultation = EXCLUDED.rate_per_consultation,
currency = EXCLUDED.currency;

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