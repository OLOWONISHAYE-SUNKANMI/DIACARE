-- Create badge enum
CREATE TYPE badge_type AS ENUM (
  'welcome',
  'helper', 
  'consistent',
  'motivator',
  'expert',
  'champion'
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_type badge_type NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT,
  UNIQUE(user_id, badge_type)
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own badges"
ON public.user_badges
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view badges for community features"
ON public.user_badges
FOR SELECT
USING (true);

CREATE POLICY "System can award badges"
ON public.user_badges
FOR INSERT
WITH CHECK (true);

-- Create user reputation table
CREATE TABLE public.user_reputation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 0,
  helpful_messages INTEGER NOT NULL DEFAULT 0,
  positive_reactions INTEGER NOT NULL DEFAULT 0,
  data_shares INTEGER NOT NULL DEFAULT 0,
  challenge_participations INTEGER NOT NULL DEFAULT 0,
  mentored_users INTEGER NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_reputation ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reputation"
ON public.user_reputation
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view reputation for community features"
ON public.user_reputation
FOR SELECT
USING (true);

CREATE POLICY "System can manage reputation"
ON public.user_reputation
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update reputation
CREATE OR REPLACE FUNCTION update_user_reputation(
  _user_id UUID,
  _helpful_messages INTEGER DEFAULT NULL,
  _positive_reactions INTEGER DEFAULT NULL,
  _data_shares INTEGER DEFAULT NULL,
  _challenge_participations INTEGER DEFAULT NULL,
  _mentored_users INTEGER DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_score INTEGER;
BEGIN
  -- Insert or update reputation data
  INSERT INTO public.user_reputation (
    user_id,
    helpful_messages,
    positive_reactions,
    data_shares,
    challenge_participations,
    mentored_users
  ) VALUES (
    _user_id,
    COALESCE(_helpful_messages, 0),
    COALESCE(_positive_reactions, 0),
    COALESCE(_data_shares, 0),
    COALESCE(_challenge_participations, 0),
    COALESCE(_mentored_users, 0)
  )
  ON CONFLICT (user_id) DO UPDATE SET
    helpful_messages = CASE WHEN _helpful_messages IS NOT NULL THEN _helpful_messages ELSE user_reputation.helpful_messages END,
    positive_reactions = CASE WHEN _positive_reactions IS NOT NULL THEN _positive_reactions ELSE user_reputation.positive_reactions END,
    data_shares = CASE WHEN _data_shares IS NOT NULL THEN _data_shares ELSE user_reputation.data_shares END,
    challenge_participations = CASE WHEN _challenge_participations IS NOT NULL THEN _challenge_participations ELSE user_reputation.challenge_participations END,
    mentored_users = CASE WHEN _mentored_users IS NOT NULL THEN _mentored_users ELSE user_reputation.mentored_users END,
    updated_at = now();

  -- Calculate new score
  SELECT 
    LEAST(
      (helpful_messages * 2) + 
      positive_reactions + 
      (data_shares * 5) + 
      (challenge_participations * 10) + 
      (mentored_users * 20),
      1000
    ) INTO new_score
  FROM public.user_reputation
  WHERE user_id = _user_id;

  -- Update the score
  UPDATE public.user_reputation
  SET 
    score = new_score,
    last_calculated_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- Create function to award badges
CREATE OR REPLACE FUNCTION award_badge_if_eligible(_user_id UUID, _badge_type badge_type)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_stats RECORD;
  reputation_data RECORD;
  already_has_badge BOOLEAN;
BEGIN
  -- Check if user already has this badge
  SELECT EXISTS(
    SELECT 1 FROM public.user_badges 
    WHERE user_id = _user_id AND badge_type = _badge_type
  ) INTO already_has_badge;

  IF already_has_badge THEN
    RETURN FALSE;
  END IF;

  -- Get user stats
  SELECT * INTO user_stats
  FROM public.user_activity_stats
  WHERE user_id = _user_id;

  -- Get reputation data
  SELECT * INTO reputation_data
  FROM public.user_reputation
  WHERE user_id = _user_id;

  -- Check badge conditions
  CASE _badge_type
    WHEN 'welcome' THEN
      IF user_stats.messages_sent >= 1 THEN
        INSERT INTO public.user_badges (user_id, badge_type, description)
        VALUES (_user_id, 'welcome', 'Premier message envoyé');
        RETURN TRUE;
      END IF;

    WHEN 'helper' THEN
      IF user_stats.helpful_reactions_received >= 10 THEN
        INSERT INTO public.user_badges (user_id, badge_type, description)
        VALUES (_user_id, 'helper', '10 réactions utiles reçues');
        RETURN TRUE;
      END IF;

    WHEN 'consistent' THEN
      IF user_stats.days_active >= 30 THEN
        INSERT INTO public.user_badges (user_id, badge_type, description)
        VALUES (_user_id, 'consistent', '30 jours d''activité');
        RETURN TRUE;
      END IF;

    WHEN 'motivator' THEN
      IF reputation_data.helpful_messages >= 50 THEN
        INSERT INTO public.user_badges (user_id, badge_type, description)
        VALUES (_user_id, 'motivator', '50 messages d''encouragement');
        RETURN TRUE;
      END IF;

    WHEN 'expert' THEN
      -- Check if user has expert or moderator role
      IF EXISTS(
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = _user_id 
        AND ur.role IN ('expert', 'moderator')
        AND ur.is_active = true
      ) THEN
        INSERT INTO public.user_badges (user_id, badge_type, description)
        VALUES (_user_id, 'expert', 'Connaissances médicales vérifiées');
        RETURN TRUE;
      END IF;

    WHEN 'champion' THEN
      -- This would require external glucose data validation
      -- For now, we'll make it a manual award
      RETURN FALSE;
  END CASE;

  RETURN FALSE;
END;
$$;

-- Create trigger to automatically award badges on activity updates
CREATE OR REPLACE FUNCTION check_badge_eligibility()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check all badges when activity is updated
  PERFORM award_badge_if_eligible(NEW.user_id, 'welcome');
  PERFORM award_badge_if_eligible(NEW.user_id, 'helper');
  PERFORM award_badge_if_eligible(NEW.user_id, 'consistent');
  PERFORM award_badge_if_eligible(NEW.user_id, 'motivator');
  PERFORM award_badge_if_eligible(NEW.user_id, 'expert');

  RETURN NEW;
END;
$$;

CREATE TRIGGER check_badges_on_activity_update
  AFTER UPDATE ON public.user_activity_stats
  FOR EACH ROW
  EXECUTE FUNCTION check_badge_eligibility();

-- Create trigger for automatic reputation calculation on user creation
CREATE OR REPLACE FUNCTION handle_new_user_gamification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Initialize reputation for new user
  INSERT INTO public.user_reputation (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_gamification
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_gamification();