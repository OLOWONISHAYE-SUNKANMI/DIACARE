-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to notify when new professional application is submitted
CREATE OR REPLACE FUNCTION public.notify_new_professional_application()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT := 'https://your-webhook-url.com/new-application'; -- À configurer
BEGIN
    -- Only trigger for new applications
    IF TG_OP = 'INSERT' THEN
        -- Send notification via HTTP webhook
        PERFORM net.http_post(
            url := webhook_url,
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := json_build_object(
                'type', 'new_professional_application',
                'application_id', NEW.id,
                'professional_name', NEW.first_name || ' ' || NEW.last_name,
                'professional_type', NEW.professional_type,
                'country', NEW.country,
                'email', NEW.email,
                'institution', NEW.institution,
                'license_number', NEW.license_number,
                'city', NEW.city,
                'phone', NEW.phone,
                'created_at', NEW.created_at,
                'status', NEW.status
            )::text
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new professional application
CREATE TRIGGER on_professional_application_insert
    AFTER INSERT ON public.professional_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_professional_application();

-- Function to notify when application status changes
CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT := 'https://your-webhook-url.com/application-status-change'; -- À configurer
BEGIN
    -- Only trigger when status actually changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Send notification via HTTP webhook
        PERFORM net.http_post(
            url := webhook_url,
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := json_build_object(
                'type', 'application_status_change',
                'application_id', NEW.id,
                'professional_name', NEW.first_name || ' ' || NEW.last_name,
                'email', NEW.email,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'reviewed_by', NEW.reviewed_by,
                'reviewed_at', NEW.reviewed_at,
                'professional_code', NEW.professional_code,
                'rejection_reason', NEW.rejection_reason
            )::text
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on application status change
CREATE TRIGGER on_professional_application_status_update
    AFTER UPDATE ON public.professional_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_application_status_change();

-- Function to notify when new consultation session is requested
CREATE OR REPLACE FUNCTION public.notify_consultation_request()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT := 'https://your-webhook-url.com/consultation-request'; -- À configurer
    patient_email TEXT;
BEGIN
    -- Get patient email from user_id via patient_access_codes
    SELECT u.email INTO patient_email
    FROM auth.users u
    JOIN public.patient_access_codes pac ON u.id = pac.user_id
    WHERE pac.access_code = NEW.patient_code;
    
    -- Send notification via HTTP webhook
    PERFORM net.http_post(
        url := webhook_url,
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := json_build_object(
            'type', 'consultation_request',
            'session_id', NEW.id,
            'professional_code', NEW.professional_code,
            'patient_code', NEW.patient_code,
            'patient_name', NEW.patient_name,
            'patient_email', patient_email,
            'access_requested_at', NEW.access_requested_at,
            'ip_address', NEW.ip_address
        )::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new consultation request
CREATE TRIGGER on_consultation_request_insert
    AFTER INSERT ON public.professional_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_consultation_request();

-- Function to notify when patient responds to access request
CREATE OR REPLACE FUNCTION public.notify_patient_response()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT := 'https://your-webhook-url.com/patient-response'; -- À configurer
BEGIN
    -- Only trigger when patient_approved_at is set (patient responded)
    IF OLD.patient_approved_at IS NULL AND NEW.patient_approved_at IS NOT NULL THEN
        -- Send notification via HTTP webhook
        PERFORM net.http_post(
            url := webhook_url,
            headers := '{"Content-Type": "application/json"}'::jsonb,
            body := json_build_object(
                'type', 'patient_response',
                'session_id', NEW.id,
                'professional_code', NEW.professional_code,
                'patient_code', NEW.patient_code,
                'patient_name', NEW.patient_name,
                'access_granted', NEW.access_granted,
                'access_denied_reason', NEW.access_denied_reason,
                'patient_approved_at', NEW.patient_approved_at
            )::text
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on patient response
CREATE TRIGGER on_patient_response_update
    AFTER UPDATE ON public.professional_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_patient_response();

-- Function to manage webhook URLs (admin only)
CREATE OR REPLACE FUNCTION public.get_webhook_url(webhook_type TEXT)
RETURNS TEXT AS $$
BEGIN
    -- In production, you might want to store these in a configuration table
    CASE webhook_type
        WHEN 'new_application' THEN
            RETURN 'https://your-webhook-url.com/new-application';
        WHEN 'status_change' THEN
            RETURN 'https://your-webhook-url.com/application-status-change';
        WHEN 'consultation_request' THEN
            RETURN 'https://your-webhook-url.com/consultation-request';
        WHEN 'patient_response' THEN
            RETURN 'https://your-webhook-url.com/patient-response';
        ELSE
            RETURN NULL;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test webhook connectivity
CREATE OR REPLACE FUNCTION public.test_webhook(webhook_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    webhook_url TEXT;
    response_status INTEGER;
BEGIN
    webhook_url := public.get_webhook_url(webhook_type);
    
    IF webhook_url IS NULL THEN
        RAISE EXCEPTION 'Unknown webhook type: %', webhook_type;
    END IF;
    
    -- Send test ping
    SELECT status INTO response_status
    FROM net.http_post(
        url := webhook_url,
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := json_build_object(
            'type', 'test_ping',
            'webhook_type', webhook_type,
            'timestamp', NOW()
        )::text
    );
    
    RETURN response_status BETWEEN 200 AND 299;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;