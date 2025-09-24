'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FamilyContextType {
  accessCode: string | null;
  loading: boolean;
  getAccessCode: () => Promise<string | null>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // -------------------- Get Access Code --------------------
  const getAccessCode = async (): Promise<string | null> => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('access_code')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.access_code) {
        setAccessCode(data.access_code);
        return data.access_code;
      } else {
        toast({
          title: 'Access code not found',
          description: 'Please contact support.',
          variant: 'destructive',
        });
        return null;
      }
    } catch (err: any) {
      console.error('Error fetching access code:', err);
      toast({
        title: 'Error fetching access code',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Auto-load once on mount --------------------
  useEffect(() => {
    getAccessCode();
  }, []);

  return (
    <FamilyContext.Provider value={{ accessCode, loading, getAccessCode }}>
      {children}
    </FamilyContext.Provider>
  );
};

// -------------------- Hook --------------------
export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) throw new Error('useFamily must be used within FamilyProvider');
  return context;
};
