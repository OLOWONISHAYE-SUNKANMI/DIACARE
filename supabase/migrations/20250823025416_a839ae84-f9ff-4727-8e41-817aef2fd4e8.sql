-- Create professional_applications table
CREATE TABLE IF NOT EXISTS public.professional_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  professional_type VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  country VARCHAR(10) NOT NULL DEFAULT 'FR',
  city VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  professional_code VARCHAR(20),
  code_issued_at TIMESTAMP WITH TIME ZONE,
  code_expires_at TIMESTAMP WITH TIME ZONE,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.professional_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_professional_applications_updated_at
BEFORE UPDATE ON public.professional_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();