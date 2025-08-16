-- Create professional_applications table
CREATE TABLE public.professional_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Infos professionnel
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  
  -- Type et qualifications
  professional_type VARCHAR(50) NOT NULL, -- 'endocrinologist', 'psychologist', etc.
  license_number VARCHAR(100) NOT NULL,
  institution VARCHAR(200),
  country VARCHAR(3) NOT NULL,
  city VARCHAR(100),
  
  -- Documents
  documents JSONB DEFAULT '[]'::jsonb, -- URLs des documents uploadés
  
  -- Status workflow
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Code professionnel (généré après approbation)
  professional_code VARCHAR(20) UNIQUE,
  code_issued_at TIMESTAMP WITH TIME ZONE,
  code_expires_at TIMESTAMP WITH TIME ZONE
);

-- Create professional_codes table for managing access codes
CREATE TABLE public.professional_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES public.professional_applications(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  specialty VARCHAR(100),
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER DEFAULT 100
);

-- Create patient_access_codes table for patient-specific codes
CREATE TABLE public.patient_access_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Patient's user ID
  access_code VARCHAR(20) UNIQUE NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  professional_access_count INTEGER DEFAULT 0
);

-- Create professional_patient_access table for tracking access
CREATE TABLE public.professional_patient_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES public.professional_applications(id),
  patient_user_id UUID NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_method VARCHAR(50) DEFAULT 'code_access', -- 'code_access', 'direct_assignment'
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.professional_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_patient_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_applications
CREATE POLICY "Anyone can submit professional applications" 
ON public.professional_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Applicants can view their own applications" 
ON public.professional_applications 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can view all applications" 
ON public.professional_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (specialty = 'admin' OR verified = true)
  )
);

CREATE POLICY "Admins can update applications" 
ON public.professional_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (specialty = 'admin' OR verified = true)
  )
);

-- RLS Policies for professional_codes
CREATE POLICY "Professionals can view their own codes" 
ON public.professional_codes 
FOR SELECT 
USING (
  professional_id IN (
    SELECT id FROM public.professional_applications 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'approved'
  )
);

CREATE POLICY "Professionals can create their own codes" 
ON public.professional_codes 
FOR INSERT 
WITH CHECK (
  professional_id IN (
    SELECT id FROM public.professional_applications 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'approved'
  )
);

-- RLS Policies for patient_access_codes
CREATE POLICY "Users can manage their own access codes" 
ON public.patient_access_codes 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for professional_patient_access
CREATE POLICY "Professionals can view their patient access records" 
ON public.professional_patient_access 
FOR SELECT 
USING (
  professional_id IN (
    SELECT id FROM public.professional_applications 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'approved'
  )
);

CREATE POLICY "Patients can view their access records" 
ON public.professional_patient_access 
FOR SELECT 
USING (auth.uid() = patient_user_id);

-- Trigger for updating timestamps
CREATE TRIGGER update_professional_applications_updated_at
BEFORE UPDATE ON public.professional_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate professional code
CREATE OR REPLACE FUNCTION public.generate_professional_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 8-character code
        code := 'DR' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.professional_codes WHERE code = code) INTO exists;
        
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate patient access code
CREATE OR REPLACE FUNCTION public.generate_patient_access_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 6-character code
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.patient_access_codes WHERE access_code = code) INTO exists;
        
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to approve professional application
CREATE OR REPLACE FUNCTION public.approve_professional_application(
    application_id UUID,
    reviewer_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    new_code TEXT;
BEGIN
    -- Generate professional code
    new_code := public.generate_professional_code();
    
    -- Update application status
    UPDATE public.professional_applications 
    SET 
        status = 'approved',
        reviewed_by = reviewer_id,
        reviewed_at = NOW(),
        professional_code = new_code,
        code_issued_at = NOW(),
        code_expires_at = NOW() + INTERVAL '1 year'
    WHERE id = application_id;
    
    -- Create professional code entry
    INSERT INTO public.professional_codes (
        professional_id,
        code,
        expires_at,
        specialty
    )
    SELECT 
        id,
        new_code,
        NOW() + INTERVAL '1 year',
        professional_type
    FROM public.professional_applications 
    WHERE id = application_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;