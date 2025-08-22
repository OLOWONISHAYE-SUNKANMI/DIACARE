-- Fix privacy vulnerability in user_reputation table
-- Remove public access to user reputation data and protect user privacy

-- 1. Drop the overly permissive policy that allows everyone to view reputation data
DROP POLICY IF EXISTS "Everyone can view reputation for community features" ON public.user_reputation;

-- 2. Create a secure policy for community features that doesn't expose user_ids
-- Only allow viewing aggregated statistics without user identification
CREATE POLICY "Public can view anonymized reputation stats" 
ON public.user_reputation 
FOR SELECT 
USING (
  -- Only allow viewing specific aggregate fields, not user_id
  -- This policy will be used by functions that need aggregate data
  false -- We'll handle community features through secure functions instead
);

-- 3. Keep the existing secure policies:
-- "Users can view their own reputation" - allows auth.uid() = user_id
-- "System can manage reputation" - allows system operations

-- 4. Create a secure function to get anonymized community statistics
CREATE OR REPLACE FUNCTION public.get_community_reputation_stats()
RETURNS TABLE(
  total_users INTEGER,
  avg_score NUMERIC,
  top_score INTEGER,
  total_helpful_messages BIGINT,
  total_positive_reactions BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_users,
    AVG(score) as avg_score,
    MAX(score) as top_score,
    SUM(helpful_messages) as total_helpful_messages,
    SUM(positive_reactions) as total_positive_reactions
  FROM public.user_reputation;
END;
$$;

-- 5. Create a function to get user rank without exposing other users' data
CREATE OR REPLACE FUNCTION public.get_user_reputation_rank(target_user_id UUID)
RETURNS TABLE(
  user_rank INTEGER,
  total_users INTEGER,
  user_score INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow users to check their own rank
  IF target_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: Can only check your own reputation rank';
  END IF;
  
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) + 1 FROM public.user_reputation WHERE score > ur.score)::INTEGER as user_rank,
    (SELECT COUNT(*) FROM public.user_reputation)::INTEGER as total_users,
    ur.score as user_score
  FROM public.user_reputation ur
  WHERE ur.user_id = target_user_id;
END;
$$;