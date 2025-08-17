-- Create enum for support session types
CREATE TYPE support_session_type AS ENUM (
  'group_session',
  'peer_mentoring',
  'emergency_support',
  'challenge_group'
);

-- Create enum for challenge types
CREATE TYPE challenge_type AS ENUM (
  'glucose_monitoring',
  'exercise',
  'nutrition',
  'medication_adherence',
  'community_engagement'
);

-- Create enum for emergency priority levels
CREATE TYPE emergency_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Create table for group support sessions
CREATE TABLE public.support_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  session_type support_session_type NOT NULL,
  moderator_name TEXT NOT NULL,
  moderator_id UUID REFERENCES auth.users(id),
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER DEFAULT 20,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'weekly', 'biweekly', 'monthly'
  meeting_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for session participants
CREATE TABLE public.session_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES support_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  UNIQUE(session_id, user_id)
);

-- Create table for community challenges
CREATE TABLE public.community_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  challenge_type challenge_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_value INTEGER, -- e.g., 30 for "30 days", 10000 for "10000 steps"
  target_unit TEXT, -- e.g., "days", "steps", "recipes"
  reward_badge TEXT,
  reward_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for challenge participants
CREATE TABLE public.challenge_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES community_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(challenge_id, user_id)
);

-- Create table for peer support relationships (buddy system)
CREATE TABLE public.peer_support_pairs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  paired_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  CHECK (mentor_id != mentee_id),
  UNIQUE(mentor_id, mentee_id)
);

-- Create table for emergency support requests
CREATE TABLE public.emergency_support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  priority emergency_priority NOT NULL DEFAULT 'medium',
  message TEXT,
  location_info JSONB, -- Can store location if provided
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  response_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for emergency responders (online experts)
CREATE TABLE public.emergency_responders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT false,
  specialties TEXT[], -- e.g., ['diabetes', 'emergency_care', 'nutrition']
  average_response_time_minutes INTEGER DEFAULT 10,
  total_responses INTEGER DEFAULT 0,
  last_online_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_support_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_responders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_sessions
CREATE POLICY "Everyone can view active support sessions"
ON public.support_sessions
FOR SELECT
USING (is_active = true);

CREATE POLICY "Moderators can manage support sessions"
ON public.support_sessions
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'expert'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role) OR has_role(auth.uid(), 'expert'::app_role));

-- RLS Policies for session_participants
CREATE POLICY "Users can manage their own session participation"
ON public.session_participants
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Session moderators can view participants"
ON public.session_participants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.support_sessions 
    WHERE id = session_id AND moderator_id = auth.uid()
  )
);

-- RLS Policies for community_challenges
CREATE POLICY "Everyone can view active challenges"
ON public.community_challenges
FOR SELECT
USING (is_active = true);

CREATE POLICY "Moderators can manage challenges"
ON public.community_challenges
FOR ALL
USING (has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'moderator'::app_role));

-- RLS Policies for challenge_participants
CREATE POLICY "Users can manage their own challenge participation"
ON public.challenge_participants
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view challenge participation stats"
ON public.challenge_participants
FOR SELECT
USING (true);

-- RLS Policies for peer_support_pairs
CREATE POLICY "Users can view their own peer support relationships"
ON public.peer_support_pairs
FOR SELECT
USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can create peer support relationships"
ON public.peer_support_pairs
FOR INSERT
WITH CHECK (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can update their own peer support relationships"
ON public.peer_support_pairs
FOR UPDATE
USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- RLS Policies for emergency_support_requests
CREATE POLICY "Users can create their own emergency requests"
ON public.emergency_support_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own emergency requests"
ON public.emergency_support_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Emergency responders can view and update requests"
ON public.emergency_support_requests
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.emergency_responders 
    WHERE user_id = auth.uid() AND is_available = true
  )
);

-- RLS Policies for emergency_responders
CREATE POLICY "Everyone can view available responders"
ON public.emergency_responders
FOR SELECT
USING (is_available = true);

CREATE POLICY "Users can manage their own responder profile"
ON public.emergency_responders
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_support_sessions_updated_at
  BEFORE UPDATE ON public.support_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_challenges_updated_at
  BEFORE UPDATE ON public.community_challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_support_requests_updated_at
  BEFORE UPDATE ON public.emergency_support_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_responders_updated_at
  BEFORE UPDATE ON public.emergency_responders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default support sessions
INSERT INTO public.support_sessions (title, description, session_type, moderator_name, scheduled_time, is_recurring, recurrence_pattern) VALUES
('Nouveaux diagnostics', 'Groupe d''entraide pour les personnes récemment diagnostiquées', 'group_session', 'Dr. Kane', '2024-01-01 19:00:00+00', true, 'weekly'),
('Diabète et grossesse', 'Support pour les femmes enceintes diabétiques', 'group_session', 'Sage-femme Aïcha', '2024-01-03 18:00:00+00', true, 'weekly'),
('Cuisine diabète-friendly', 'Ateliers culinaires adaptés au diabète', 'group_session', 'Chef Fatou', '2024-01-05 17:00:00+00', true, 'weekly'),
('Sport et diabète', 'Conseils et motivation pour l''activité physique', 'group_session', 'Coach Moussa', '2024-01-06 10:00:00+00', true, 'weekly');

-- Insert default community challenges
INSERT INTO public.community_challenges (name, description, challenge_type, start_date, end_date, target_value, target_unit, reward_badge, reward_description) VALUES
('30 jours de contrôles', 'Effectuer un contrôle glycémique quotidien pendant 30 jours', 'glucose_monitoring', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 30, 'jours', 'Badge Consistance', 'Reconnaissance pour la régularité dans le suivi'),
('Recettes healthy', 'Partager 10 recettes adaptées au diabète avec la communauté', 'nutrition', CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 10, 'recettes', 'Badge Chef', 'Expert en cuisine diabète-friendly'),
('10 000 pas quotidiens', 'Marcher 10 000 pas par jour pendant 2 semaines', 'exercise', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 10000, 'pas/jour', 'Badge Actif', 'Champion de l''activité physique');

-- Enable realtime for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_support_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_responders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_participants;