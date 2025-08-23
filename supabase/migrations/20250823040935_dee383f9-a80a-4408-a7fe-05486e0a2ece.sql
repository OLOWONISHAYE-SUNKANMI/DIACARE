-- Create chat_messages table for teleconsultation messaging
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('patient', 'professional')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view messages from their consultations" 
ON public.chat_messages 
FOR SELECT 
USING (
  consultation_id IN (
    SELECT id FROM public.teleconsultations 
    WHERE patient_id = auth.uid() OR professional_id IN (
      SELECT pa.id FROM professional_applications pa 
      WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
      AND pa.status = 'approved'
    )
  )
);

CREATE POLICY "Users can send messages in their consultations" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  consultation_id IN (
    SELECT id FROM public.teleconsultations 
    WHERE patient_id = auth.uid() OR professional_id IN (
      SELECT pa.id FROM professional_applications pa 
      WHERE pa.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
      AND pa.status = 'approved'
    )
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();