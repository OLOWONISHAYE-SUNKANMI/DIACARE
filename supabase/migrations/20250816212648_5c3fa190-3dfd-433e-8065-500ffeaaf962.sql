-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('member', 'verified_member', 'expert', 'moderator');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'member',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role 
     FROM public.user_roles 
     WHERE user_id = _user_id 
       AND is_active = true 
       AND (expires_at IS NULL OR expires_at > now())
     ORDER BY 
       CASE role 
         WHEN 'moderator' THEN 4
         WHEN 'expert' THEN 3
         WHEN 'verified_member' THEN 2
         WHEN 'member' THEN 1
       END DESC
     LIMIT 1),
    'member'::app_role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Moderators can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderators can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderators can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'moderator'));

-- Function to automatically assign member role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$;

-- Trigger to assign member role on user creation
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_role();

-- Create user activity tracking table for role progression
CREATE TABLE public.user_activity_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    messages_sent INTEGER DEFAULT 0,
    helpful_reactions_received INTEGER DEFAULT 0,
    reports_submitted INTEGER DEFAULT 0,
    warnings_received INTEGER DEFAULT 0,
    days_active INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on activity stats
ALTER TABLE public.user_activity_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity stats
CREATE POLICY "Users can view their own stats"
ON public.user_activity_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Moderators can view all stats"
ON public.user_activity_stats
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "System can update stats"
ON public.user_activity_stats
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update user activity stats
CREATE OR REPLACE FUNCTION public.update_user_activity(
  _user_id UUID,
  _activity_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_activity_stats (user_id, messages_sent, last_message_at)
  VALUES (_user_id, 
    CASE WHEN _activity_type = 'message' THEN 1 ELSE 0 END,
    CASE WHEN _activity_type = 'message' THEN now() ELSE NULL END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    messages_sent = CASE 
      WHEN _activity_type = 'message' THEN user_activity_stats.messages_sent + 1
      ELSE user_activity_stats.messages_sent
    END,
    helpful_reactions_received = CASE 
      WHEN _activity_type = 'helpful_reaction' THEN user_activity_stats.helpful_reactions_received + 1
      ELSE user_activity_stats.helpful_reactions_received
    END,
    reports_submitted = CASE 
      WHEN _activity_type = 'report' THEN user_activity_stats.reports_submitted + 1
      ELSE user_activity_stats.reports_submitted
    END,
    warnings_received = CASE 
      WHEN _activity_type = 'warning' THEN user_activity_stats.warnings_received + 1
      ELSE user_activity_stats.warnings_received
    END,
    last_message_at = CASE 
      WHEN _activity_type = 'message' THEN now()
      ELSE user_activity_stats.last_message_at
    END,
    updated_at = now();
END;
$$;