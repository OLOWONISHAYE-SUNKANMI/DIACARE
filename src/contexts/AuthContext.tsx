import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;

  // Core user info
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;

  // Professional info
  professional_license: string | null;
  specialty: string | null;

  // Extended info
  date_of_birth: string | null; // e.g. "1995-08-20"
  age?: number; // derived, optional
  city: string | null;
  profession: string | null;

  // Status
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    metadata?: any
  ) => Promise<{ error: any; needsSubscription?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProfessionalCode: (code: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isProfessional: boolean;
  professionalData: any;
  isTestMode: boolean;
  toggleTestMode: () => void;
  hasSubscription: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfessional, setIsProfessional] = useState(false);
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [isTestMode, setIsTestMode] = useState(() => {
    return localStorage.getItem('dare-test-mode') === 'true';
  });
  const [profile, setProfile] = useState<Profile | null>(null);

  const [hasSubscription, setHasSubscription] = useState(false);

  // Fetch profile from Supabase - injected by LazyCode
  const getProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }

    return data as Profile;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile?.id);

    if (error) {
      console.error('Error updating profile:', error);
      return { error };
    }

    // Refresh local profile state
    const refreshed = await getProfile(user.id);
    setProfile(refreshed);

    return { error: null };
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(async () => {
          await checkProfessionalStatus(session.user.id);
          const fetchedProfile = await getProfile(session.user.id);
          setProfile(fetchedProfile);
        }, 0);
      } else {
        setIsProfessional(false);
        setProfessionalData(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle test mode authentication
  useEffect(() => {
    if (isTestMode && !user) {
      // Create a test user object
      const testUser = {
        id: 'test-user-id',
        email: 'test@dare.com',
        user_metadata: {
          first_name: 'Test',
          last_name: 'User',
        },
      } as any;

      setUser(testUser);
      setHasSubscription(true);
    }
  }, [isTestMode, user]);

  const checkProfessionalStatus = async (userId: string) => {
    try {
      // Check if user has professional profile
      const { data: professionalApp, error } = await supabase
        .from('professional_applications')
        .select('*')
        .eq('reviewed_by', userId)
        .eq('status', 'approved')
        .maybeSingle();
      if (!error && professionalApp) {
        setIsProfessional(true);
        setProfessionalData(professionalApp);
      } else {
        setIsProfessional(false);
        setProfessionalData(null);
      }
    } catch (error) {
      console.error('Error checking professional status:', error);
      setIsProfessional(false);
      setProfessionalData(null);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata,
      },
    });

    // For patient signups, indicate that subscription selection is needed
    const needsSubscription = metadata?.user_type === 'patient';

    return { error, needsSubscription };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signInWithProfessionalCode = async (code: string) => {
    try {
      // 1. Vérifier le code professionnel
      const { data: professionalApp, error: codeError } = await supabase
        .from('professional_applications')
        .select('*')
        .eq('professional_code', code)
        .eq('status', 'approved')
        .single();

      if (codeError || !professionalApp) {
        return {
          error: { message: 'Code professionnel invalide ou non approuvé' },
        };
      }

      // 2. Vérifier expiration
      if (new Date() > new Date(professionalApp.code_expires_at)) {
        return {
          error: {
            message: "Code professionnel expiré. Contactez l'administration.",
          },
        };
      }

      // 3. Vérifier si un compte utilisateur existe déjà pour ce professionnel
      if (professionalApp.reviewed_by) {
        // Le professionnel a déjà un compte, nous devons le connecter différemment
        return {
          error: {
            message:
              'Ce code est lié à un compte. Veuillez vous connecter avec vos identifiants email.',
          },
        };
      }

      // 4. Créer un compte temporaire ou utiliser un système de token
      // Pour simplifier, on crée une session temporaire
      const tempEmail = `professional-${code}@dare-temp.local`;
      const tempPassword = `temp-${code}-${Date.now()}`;

      // Créer un compte temporaire
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            professional_code: code,
            is_professional: true,
            first_name: professionalApp.first_name,
            last_name: professionalApp.last_name,
          },
        },
      });

      if (authError) {
        return { error: authError };
      }

      // 5. Lier le compte au professionnel
      if (authData.user) {
        await supabase
          .from('professional_applications')
          .update({ reviewed_by: authData.user.id })
          .eq('id', professionalApp.id);
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsProfessional(false);
      setProfessionalData(null);
    }
    return { error };
  };

  const toggleTestMode = () => {
    const newTestMode = !isTestMode;
    setIsTestMode(newTestMode);
    localStorage.setItem('dare-test-mode', newTestMode.toString());

    if (newTestMode) {
      setHasSubscription(true);
      // Create test user if not already authenticated
      if (!user) {
        const testUser = {
          id: 'test-user-id',
          email: 'test@dare.com',
          user_metadata: {
            first_name: 'Test',
            last_name: 'User',
          },
        } as any;
        setUser(testUser);
      }
    } else {
      // If disabling test mode and user is test user, sign out
      if (user?.id === 'test-user-id') {
        setUser(null);
        setSession(null);
        setHasSubscription(false);
      }
    }
  };

  // In test mode or if user has actual subscription
  const effectiveSubscription = isTestMode || hasSubscription;

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithProfessionalCode,
    signOut,
    isProfessional,
    professionalData,
    isTestMode,
    toggleTestMode,
    hasSubscription: effectiveSubscription,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
