-- Create professional_sessions table for managing consultation sessions
CREATE TABLE public.professional_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  professional_id UUID REFERENCES public.professional_applications(id) ON DELETE CASCADE,
  professional_code VARCHAR(20) NOT NULL,
  patient_code VARCHAR(20) NOT NULL,
  patient_name VARCHAR(200),
  
  -- Détails accès
  access_requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_approved_at TIMESTAMP WITH TIME ZONE,
  access_granted BOOLEAN DEFAULT false,
  access_denied_reason TEXT,
  
  -- Consultation
  consultation_started_at TIMESTAMP WITH TIME ZONE,
  consultation_ended_at TIMESTAMP WITH TIME ZONE,
  consultation_duration_minutes INTEGER,
  consultation_notes TEXT,
  
  -- Facturation
  fee_amount INTEGER DEFAULT 500, -- F CFA
  fee_status VARCHAR(20) DEFAULT 'pending' CHECK (fee_status IN ('pending', 'paid', 'cancelled')),
  fee_paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit
  ip_address INET,
  user_agent TEXT,
  data_sections_accessed TEXT[]
);

-- Enable RLS
ALTER TABLE public.professional_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_sessions
CREATE POLICY "Professionals can view their own sessions" 
ON public.professional_sessions 
FOR SELECT 
USING (
  professional_id IN (
    SELECT id FROM public.professional_applications 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'approved'
  )
);

CREATE POLICY "Professionals can create sessions" 
ON public.professional_sessions 
FOR INSERT 
WITH CHECK (
  professional_id IN (
    SELECT id FROM public.professional_applications 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'approved'
  )
);

CREATE POLICY "Professionals can update their own sessions" 
ON public.professional_sessions 
FOR UPDATE 
USING (
  professional_id IN (
    SELECT id FROM public.professional_applications 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'approved'
  )
);

CREATE POLICY "Patients can view sessions where they are involved" 
ON public.professional_sessions 
FOR SELECT 
USING (
  patient_code IN (
    SELECT access_code FROM public.patient_access_codes 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Patients can update session approval status" 
ON public.professional_sessions 
FOR UPDATE 
USING (
  patient_code IN (
    SELECT access_code FROM public.patient_access_codes 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  patient_code IN (
    SELECT access_code FROM public.patient_access_codes 
    WHERE user_id = auth.uid()
  )
);

-- Trigger for updating timestamps
CREATE TRIGGER update_professional_sessions_updated_at
BEFORE UPDATE ON public.professional_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically calculate consultation duration
CREATE OR REPLACE FUNCTION public.calculate_consultation_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.consultation_ended_at IS NOT NULL AND NEW.consultation_started_at IS NOT NULL THEN
        NEW.consultation_duration_minutes := EXTRACT(EPOCH FROM (NEW.consultation_ended_at - NEW.consultation_started_at)) / 60;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate duration when consultation ends
CREATE TRIGGER calculate_session_duration
BEFORE UPDATE ON public.professional_sessions
FOR EACH ROW
EXECUTE FUNCTION public.calculate_consultation_duration();

-- Function to create a new consultation session
CREATE OR REPLACE FUNCTION public.request_patient_access(
    prof_code VARCHAR(20),
    pat_code VARCHAR(20),
    patient_name_param VARCHAR(200) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    session_id UUID;
    prof_id UUID;
BEGIN
    -- Get professional ID from code
    SELECT pa.id INTO prof_id
    FROM public.professional_applications pa
    JOIN public.professional_codes pc ON pa.id = pc.professional_id
    WHERE pc.code = prof_code AND pc.is_active = true;
    
    IF prof_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or inactive professional code';
    END IF;
    
    -- Verify patient code exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM public.patient_access_codes 
        WHERE access_code = pat_code AND is_active = true
    ) THEN
        RAISE EXCEPTION 'Invalid or inactive patient code';
    END IF;
    
    -- Create new session
    INSERT INTO public.professional_sessions (
        professional_id,
        professional_code,
        patient_code,
        patient_name,
        ip_address,
        user_agent
    ) VALUES (
        prof_id,
        prof_code,
        pat_code,
        patient_name_param,
        INET_CLIENT_ADDR(),
        current_setting('request.headers', true)::json->>'user-agent'
    ) RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve/deny patient access
CREATE OR REPLACE FUNCTION public.respond_to_access_request(
    session_id_param UUID,
    approve BOOLEAN,
    denial_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verify session belongs to current user's patient code
    IF NOT EXISTS (
        SELECT 1 FROM public.professional_sessions ps
        JOIN public.patient_access_codes pac ON ps.patient_code = pac.access_code
        WHERE ps.id = session_id_param AND pac.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Session not found or access denied';
    END IF;
    
    -- Update session with patient response
    UPDATE public.professional_sessions 
    SET 
        patient_approved_at = NOW(),
        access_granted = approve,
        access_denied_reason = CASE WHEN NOT approve THEN denial_reason ELSE NULL END
    WHERE id = session_id_param;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;