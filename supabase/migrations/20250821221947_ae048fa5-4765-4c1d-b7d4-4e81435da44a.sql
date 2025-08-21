-- Ajout des politiques RLS manquantes pour consultation_requests
CREATE POLICY "Patients can view their own requests" ON public.consultation_requests
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Patients can create requests" ON public.consultation_requests
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Professionals can view their requests" ON public.consultation_requests
  FOR SELECT USING (professional_id IN (
    SELECT pa.id FROM professional_applications pa 
    WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND pa.status = 'approved'
  ));

CREATE POLICY "Professionals can update their requests" ON public.consultation_requests
  FOR UPDATE USING (professional_id IN (
    SELECT pa.id FROM professional_applications pa 
    WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND pa.status = 'approved'
  ));

-- Ajout des politiques RLS pour consultation_notes
CREATE POLICY "Patients can view their notes" ON public.consultation_notes
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Professionals can manage notes for their patients" ON public.consultation_notes
  FOR ALL USING (professional_id IN (
    SELECT pa.id FROM professional_applications pa 
    WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND pa.status = 'approved'
  ));

-- Ajout des triggers pour les timestamps
CREATE OR REPLACE FUNCTION update_consultation_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;