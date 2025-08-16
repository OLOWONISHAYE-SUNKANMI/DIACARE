-- Enable realtime for professional_applications table
ALTER TABLE public.professional_applications REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.professional_applications;

-- Enable realtime for professional_sessions table as well
ALTER TABLE public.professional_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.professional_sessions;

-- Enable realtime for patient_access_permissions table
ALTER TABLE public.patient_access_permissions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_access_permissions;