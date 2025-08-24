-- Create subscription plans for Premium and Family
INSERT INTO public.subscription_plans (
  name,
  description,
  price_eur,
  features,
  max_consultations_per_month,
  max_family_members,
  is_active
) VALUES 
(
  'Premium',
  'Forfait individuel pour un suivi personnalisé',
  800, -- 8€ in cents
  '["Suivi glucose illimité", "Rappels médicaments", "Journal alimentaire", "Consultations télémédecine", "Support 24/7", "Analyse prédictive", "Rapports mensuels"]'::jsonb,
  10,
  0,
  true
),
(
  'Famille',
  'Forfait famille pour jusqu''à 4 membres',
  1000, -- 10€ in cents
  '["Tout du forfait Premium", "Gestion familiale", "Tableau de bord famille", "Partage des données", "Support prioritaire", "Consultations groupe", "Éducation diabète"]'::jsonb,
  20,
  4,
  true
);

-- Create revenue distribution configuration table
CREATE TABLE public.revenue_distribution_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  plan_price_eur INTEGER NOT NULL,
  plan_price_cfa INTEGER NOT NULL,
  professional_amount_cfa INTEGER NOT NULL,
  app_fees_cfa INTEGER NOT NULL,
  payment_platform_amount_cfa INTEGER NOT NULL,
  net_profit_cfa INTEGER NOT NULL,
  buffer_amount_cfa INTEGER DEFAULT 0,
  reinvestment_amount_cfa INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.revenue_distribution_config ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing distribution config
CREATE POLICY "Everyone can view revenue distribution config" 
ON public.revenue_distribution_config 
FOR SELECT 
USING (true);

-- Create policy for admins to manage config
CREATE POLICY "Moderators can manage revenue distribution config" 
ON public.revenue_distribution_config 
FOR ALL 
USING (has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role));

-- Insert revenue distribution configuration
INSERT INTO public.revenue_distribution_config (
  plan_name,
  plan_price_eur,
  plan_price_cfa,
  professional_amount_cfa,
  app_fees_cfa,
  payment_platform_amount_cfa,
  net_profit_cfa,
  buffer_amount_cfa,
  reinvestment_amount_cfa
) VALUES 
(
  'Premium',
  800, -- 8€ in cents
  5247, -- F CFA
  2000, -- Healthcare professionals
  500,  -- App fees & maintenance
  152,  -- Payment platform (2.9%)
  2500, -- Net profit
  95,   -- Buffer
  0     -- Reinvestment
),
(
  'Famille',
  1000, -- 10€ in cents
  6559, -- F CFA
  2000, -- Healthcare professionals
  500,  -- App fees & maintenance
  190,  -- Payment platform (2.9%)
  2500, -- Net profit
  0,    -- Buffer
  1369  -- Reinvestment
);

-- Create monthly revenue distribution table
CREATE TABLE public.monthly_revenue_distribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_year TEXT NOT NULL, -- Format: YYYY-MM
  total_subscriptions INTEGER NOT NULL DEFAULT 0,
  total_revenue_cfa INTEGER NOT NULL DEFAULT 0,
  total_professional_payments_cfa INTEGER NOT NULL DEFAULT 0,
  total_app_fees_cfa INTEGER NOT NULL DEFAULT 0,
  total_platform_fees_cfa INTEGER NOT NULL DEFAULT 0,
  total_net_profit_cfa INTEGER NOT NULL DEFAULT 0,
  total_reinvestment_cfa INTEGER NOT NULL DEFAULT 0,
  distribution_status TEXT DEFAULT 'pending', -- pending, approved, distributed
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  distributed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(month_year)
);

-- Enable RLS
ALTER TABLE public.monthly_revenue_distribution ENABLE ROW LEVEL SECURITY;

-- Create policies for revenue distribution
CREATE POLICY "Moderators can view revenue distribution" 
ON public.monthly_revenue_distribution 
FOR SELECT 
USING (has_role(auth.uid(), 'moderator'::app_role));

CREATE POLICY "Moderators can manage revenue distribution" 
ON public.monthly_revenue_distribution 
FOR ALL 
USING (has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role));

-- Create function to calculate monthly revenue distribution
CREATE OR REPLACE FUNCTION public.calculate_monthly_revenue_distribution(_month_year TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  premium_subscriptions INTEGER := 0;
  family_subscriptions INTEGER := 0;
  total_revenue_cfa INTEGER := 0;
  total_professional_cfa INTEGER := 0;
  total_app_fees_cfa INTEGER := 0;
  total_platform_fees_cfa INTEGER := 0;
  total_net_profit_cfa INTEGER := 0;
  total_reinvestment_cfa INTEGER := 0;
  result JSON;
BEGIN
  -- Count active subscriptions for the month
  SELECT 
    COUNT(CASE WHEN sp.name = 'Premium' THEN 1 END),
    COUNT(CASE WHEN sp.name = 'Famille' THEN 1 END)
  INTO premium_subscriptions, family_subscriptions
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.status = 'active'
  AND DATE_TRUNC('month', us.created_at) = TO_DATE(_month_year, 'YYYY-MM');
  
  -- Calculate revenue based on distribution config
  SELECT 
    (premium_subscriptions * rdc_premium.plan_price_cfa) + (family_subscriptions * rdc_family.plan_price_cfa),
    (premium_subscriptions * rdc_premium.professional_amount_cfa) + (family_subscriptions * rdc_family.professional_amount_cfa),
    (premium_subscriptions * rdc_premium.app_fees_cfa) + (family_subscriptions * rdc_family.app_fees_cfa),
    (premium_subscriptions * rdc_premium.payment_platform_amount_cfa) + (family_subscriptions * rdc_family.payment_platform_amount_cfa),
    (premium_subscriptions * rdc_premium.net_profit_cfa) + (family_subscriptions * rdc_family.net_profit_cfa),
    (premium_subscriptions * rdc_premium.reinvestment_amount_cfa) + (family_subscriptions * rdc_family.reinvestment_amount_cfa)
  INTO 
    total_revenue_cfa,
    total_professional_cfa,
    total_app_fees_cfa,
    total_platform_fees_cfa,
    total_net_profit_cfa,
    total_reinvestment_cfa
  FROM 
    public.revenue_distribution_config rdc_premium,
    public.revenue_distribution_config rdc_family
  WHERE 
    rdc_premium.plan_name = 'Premium' 
    AND rdc_family.plan_name = 'Famille';
  
  -- Insert or update monthly distribution
  INSERT INTO public.monthly_revenue_distribution (
    month_year,
    total_subscriptions,
    total_revenue_cfa,
    total_professional_payments_cfa,
    total_app_fees_cfa,
    total_platform_fees_cfa,
    total_net_profit_cfa,
    total_reinvestment_cfa
  ) VALUES (
    _month_year,
    premium_subscriptions + family_subscriptions,
    total_revenue_cfa,
    total_professional_cfa,
    total_app_fees_cfa,
    total_platform_fees_cfa,
    total_net_profit_cfa,
    total_reinvestment_cfa
  )
  ON CONFLICT (month_year) 
  DO UPDATE SET
    total_subscriptions = EXCLUDED.total_subscriptions,
    total_revenue_cfa = EXCLUDED.total_revenue_cfa,
    total_professional_payments_cfa = EXCLUDED.total_professional_payments_cfa,
    total_app_fees_cfa = EXCLUDED.total_app_fees_cfa,
    total_platform_fees_cfa = EXCLUDED.total_platform_fees_cfa,
    total_net_profit_cfa = EXCLUDED.total_net_profit_cfa,
    total_reinvestment_cfa = EXCLUDED.total_reinvestment_cfa,
    updated_at = now();
  
  -- Build result JSON
  result := json_build_object(
    'month_year', _month_year,
    'premium_subscriptions', premium_subscriptions,
    'family_subscriptions', family_subscriptions,
    'total_subscriptions', premium_subscriptions + family_subscriptions,
    'total_revenue_cfa', total_revenue_cfa,
    'breakdown', json_build_object(
      'professionals', total_professional_cfa,
      'app_fees', total_app_fees_cfa,
      'platform_fees', total_platform_fees_cfa,
      'net_profit', total_net_profit_cfa,
      'reinvestment', total_reinvestment_cfa
    )
  );
  
  RETURN result;
END;
$$;