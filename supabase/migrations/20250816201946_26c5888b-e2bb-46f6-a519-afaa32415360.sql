-- Create patient_access_permissions table for granular access control
CREATE TABLE public.patient_access_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  patient_id UUID NOT NULL, -- Référence au patient DARE
  patient_code VARCHAR(20) NOT NULL,
  professional_code VARCHAR(20) NOT NULL,
  
  -- Permission
  permission_status VARCHAR(20) NOT NULL DEFAULT 'pending' 
    CHECK (permission_status IN ('pending', 'approved', 'denied', 'expired')),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Limitations d'accès
  allowed_data_sections TEXT[] DEFAULT '{}', -- ['glucose', 'medications', 'meals', etc.]
  max_consultations INTEGER DEFAULT 1,
  used_consultations INTEGER DEFAULT 0,
  
  -- Contrainte unique pour éviter les doublons
  UNIQUE(patient_code, professional_code)
);

-- Enable RLS
ALTER TABLE public.patient_access_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patient_access_permissions
CREATE POLICY "Patients can manage their own permissions" 
ON public.patient_access_permissions 
FOR ALL 
USING (patient_id = auth.uid())
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Professionals can view permissions for their code" 
ON public.patient_access_permissions 
FOR SELECT 
USING (
  professional_code IN (
    SELECT pc.code FROM public.professional_codes pc
    JOIN public.professional_applications pa ON pc.professional_id = pa.id
    WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND pa.status = 'approved'
    AND pc.is_active = true
  )
);

CREATE POLICY "Professionals can request permissions" 
ON public.patient_access_permissions 
FOR INSERT 
WITH CHECK (
  professional_code IN (
    SELECT pc.code FROM public.professional_codes pc
    JOIN public.professional_applications pa ON pc.professional_id = pa.id
    WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND pa.status = 'approved'
    AND pc.is_active = true
  )
);

-- Trigger for updating timestamps
CREATE TRIGGER update_patient_access_permissions_updated_at
BEFORE UPDATE ON public.patient_access_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if permission is valid and not expired
CREATE OR REPLACE FUNCTION public.is_permission_valid(
    permission_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    perm_record RECORD;
BEGIN
    SELECT permission_status, expires_at, max_consultations, used_consultations
    INTO perm_record
    FROM public.patient_access_permissions
    WHERE id = permission_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if permission is approved
    IF perm_record.permission_status != 'approved' THEN
        RETURN FALSE;
    END IF;
    
    -- Check if not expired
    IF perm_record.expires_at IS NOT NULL AND perm_record.expires_at < NOW() THEN
        -- Auto-expire the permission
        UPDATE public.patient_access_permissions 
        SET permission_status = 'expired'
        WHERE id = permission_id;
        RETURN FALSE;
    END IF;
    
    -- Check consultation limits
    IF perm_record.used_consultations >= perm_record.max_consultations THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to request permission for patient data access
CREATE OR REPLACE FUNCTION public.request_patient_permission(
    patient_code_param VARCHAR(20),
    professional_code_param VARCHAR(20),
    requested_sections TEXT[] DEFAULT '{"glucose","medications","meals","activities"}',
    max_consultations_param INTEGER DEFAULT 1,
    validity_days INTEGER DEFAULT 30
)
RETURNS UUID AS $$
DECLARE
    permission_id UUID;
    patient_user_id UUID;
BEGIN
    -- Get patient user ID from code
    SELECT user_id INTO patient_user_id
    FROM public.patient_access_codes
    WHERE access_code = patient_code_param AND is_active = true;
    
    IF patient_user_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or inactive patient code';
    END IF;
    
    -- Verify professional code exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM public.professional_codes 
        WHERE code = professional_code_param AND is_active = true
    ) THEN
        RAISE EXCEPTION 'Invalid or inactive professional code';
    END IF;
    
    -- Create or update permission request
    INSERT INTO public.patient_access_permissions (
        patient_id,
        patient_code,
        professional_code,
        allowed_data_sections,
        max_consultations,
        expires_at
    ) VALUES (
        patient_user_id,
        patient_code_param,
        professional_code_param,
        requested_sections,
        max_consultations_param,
        NOW() + (validity_days || ' days')::INTERVAL
    )
    ON CONFLICT (patient_code, professional_code) 
    DO UPDATE SET
        allowed_data_sections = EXCLUDED.allowed_data_sections,
        max_consultations = EXCLUDED.max_consultations,
        expires_at = EXCLUDED.expires_at,
        permission_status = 'pending',
        used_consultations = 0,
        updated_at = NOW()
    RETURNING id INTO permission_id;
    
    RETURN permission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for patient to approve/deny permission request
CREATE OR REPLACE FUNCTION public.respond_to_permission_request(
    permission_id_param UUID,
    approve BOOLEAN,
    allowed_sections TEXT[] DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_sections TEXT[];
BEGIN
    -- Verify permission belongs to current user
    IF NOT EXISTS (
        SELECT 1 FROM public.patient_access_permissions
        WHERE id = permission_id_param AND patient_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Permission request not found or access denied';
    END IF;
    
    -- Get current allowed sections if not provided
    IF allowed_sections IS NULL THEN
        SELECT allowed_data_sections INTO current_sections
        FROM public.patient_access_permissions
        WHERE id = permission_id_param;
        allowed_sections := current_sections;
    END IF;
    
    -- Update permission status
    UPDATE public.patient_access_permissions 
    SET 
        permission_status = CASE WHEN approve THEN 'approved' ELSE 'denied' END,
        approved_at = CASE WHEN approve THEN NOW() ELSE NULL END,
        allowed_data_sections = CASE WHEN approve THEN allowed_sections ELSE '{}' END,
        updated_at = NOW()
    WHERE id = permission_id_param;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment consultation usage
CREATE OR REPLACE FUNCTION public.use_consultation(
    patient_code_param VARCHAR(20),
    professional_code_param VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
    permission_record RECORD;
BEGIN
    -- Get permission record
    SELECT id, used_consultations, max_consultations
    INTO permission_record
    FROM public.patient_access_permissions
    WHERE patient_code = patient_code_param 
    AND professional_code = professional_code_param
    AND permission_status = 'approved';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No valid permission found';
    END IF;
    
    -- Check if usage limit reached
    IF permission_record.used_consultations >= permission_record.max_consultations THEN
        RAISE EXCEPTION 'Consultation limit reached';
    END IF;
    
    -- Increment usage
    UPDATE public.patient_access_permissions
    SET used_consultations = used_consultations + 1,
        updated_at = NOW()
    WHERE id = permission_record.id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check data section access
CREATE OR REPLACE FUNCTION public.can_access_data_section(
    patient_code_param VARCHAR(20),
    professional_code_param VARCHAR(20),
    data_section VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    permission_record RECORD;
BEGIN
    SELECT allowed_data_sections, permission_status, expires_at
    INTO permission_record
    FROM public.patient_access_permissions
    WHERE patient_code = patient_code_param 
    AND professional_code = professional_code_param;
    
    IF NOT FOUND OR permission_record.permission_status != 'approved' THEN
        RETURN FALSE;
    END IF;
    
    -- Check expiration
    IF permission_record.expires_at IS NOT NULL AND permission_record.expires_at < NOW() THEN
        RETURN FALSE;
    END IF;
    
    -- Check if section is allowed
    RETURN data_section = ANY(permission_record.allowed_data_sections);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;