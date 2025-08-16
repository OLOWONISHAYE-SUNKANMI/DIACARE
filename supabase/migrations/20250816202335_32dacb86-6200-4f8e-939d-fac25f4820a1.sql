-- Create storage bucket for professional documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('professional-documents', 'professional-documents', false);

-- Create storage policies for professional documents
CREATE POLICY "Anyone can upload professional documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'professional-documents');

CREATE POLICY "Admins can view all professional documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'professional-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (specialty = 'admin' OR verified = true)
  )
);

CREATE POLICY "Users can view their own uploaded documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'professional-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'professional-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);