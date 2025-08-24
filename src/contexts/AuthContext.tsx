import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any; needsSubscription?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProfessionalCode: (code: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isProfessional: boolean;
  professionalData: any;
  isTestMode: boolean;
  toggleTestMode: () => void;
  hasSubscription: boolean;
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
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is a professional after auth state changes
        if (session?.user) {
          setTimeout(async () => {
            await checkProfessionalStatus(session.user.id);
          }, 0);
        } else {
          setIsProfessional(false);
          setProfessionalData(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkProfessionalStatus(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
          last_name: 'User'
        }
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
        .single();

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
        data: metadata
      }
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
        return { error: { message: 'Code professionnel invalide ou non approuvé' } };
      }

      // 2. Vérifier expiration
      if (new Date() > new Date(professionalApp.code_expires_at)) {
        return { error: { message: 'Code professionnel expiré. Contactez l\'administration.' } };
      }

      // 3. Vérifier si un compte utilisateur existe déjà pour ce professionnel
      if (professionalApp.reviewed_by) {
        // Le professionnel a déjà un compte, nous devons le connecter différemment
        return { error: { message: 'Ce code est lié à un compte. Veuillez vous connecter avec vos identifiants email.' } };
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
            last_name: professionalApp.last_name
          }
        }
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
            last_name: 'User'
          }
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}