-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_eur INTEGER NOT NULL, -- Prix en centimes d'euros
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  max_consultations_per_month INTEGER DEFAULT 10,
  max_family_members INTEGER DEFAULT 0, -- 0 for patient plan, 3 for family plan
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default plans
INSERT INTO public.subscription_plans (name, price_eur, description, features, max_consultations_per_month, max_family_members) VALUES 
('DiaCare Patient', 800, 'Forfait patient complet avec consultations', 
 '["Toutes les fonctionnalités", "10 consultations par mois", "DiaCare Chat", "DiaCare News", "Alertes personnalisées", "Suivi glycémie"]', 
 10, 0),
('DiaCare Famille', 1000, 'Forfait famille avec partage de données', 
 '["Toutes les fonctionnalités", "10 consultations par mois", "DiaCare Chat", "DiaCare News", "Partage avec 3 membres de famille", "Alertes familiales", "Suivi glycémie"]', 
 10, 3);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, active, cancelled, expired
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  patient_code TEXT UNIQUE,
  consultations_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans
CREATE POLICY "Everyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.user_subscriptions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscription" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update subscriptions" 
ON public.user_subscriptions 
FOR UPDATE 
USING (true);

-- Function to generate patient code
CREATE OR REPLACE FUNCTION public.generate_patient_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 6-character code with letters and numbers
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.user_subscriptions WHERE patient_code = code) INTO exists;
        
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$;

-- Trigger to auto-generate patient code
CREATE OR REPLACE FUNCTION public.auto_generate_patient_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.patient_code IS NULL THEN
        NEW.patient_code := public.generate_patient_code();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_generate_patient_code
    BEFORE INSERT ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_patient_code();