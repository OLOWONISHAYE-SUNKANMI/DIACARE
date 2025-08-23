-- Create table for professional rates (private pricing information)
CREATE TABLE public.professional_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialty professional_specialty NOT NULL,
  rate_per_consultation INTEGER NOT NULL, -- Amount in F CFA
  currency TEXT DEFAULT 'XOF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_rates ENABLE ROW LEVEL SECURITY;

-- Create policies - only moderators can manage rates
CREATE POLICY "Everyone can view professional rates" 
ON public.professional_rates 
FOR SELECT 
USING (true);

CREATE POLICY "Moderators can manage professional rates" 
ON public.professional_rates 
FOR ALL 
USING (has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role));

-- Insert the professional rates
INSERT INTO public.professional_rates (specialty, rate_per_consultation) VALUES
('endocrinologue', 600),
('medecin_generaliste', 500),
('nutritionniste', 350),
('psychologue', 250),
('infirmier', 300);

-- Create trigger for updated_at
CREATE TRIGGER update_professional_rates_updated_at
BEFORE UPDATE ON public.professional_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();