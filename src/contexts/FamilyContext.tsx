// 'use client';

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from 'react';
// import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

// // -------------------- Types --------------------
// export interface FamilyMember {
//   id: string;
//   name: string;
//   role: string;
//   permission: string;
//   status: string;
//   avatar: string;
//   phone?: string;
// }

// export interface FamilyActivityLog {
//   id: string;
//   family_membership_id: string;
//   action: string;
//   actor_name: string;
//   time: string;
// }

// interface FamilyContextType {
//   familyMembers: FamilyMember[];
//   activityLogs: FamilyActivityLog[];
//   loading: boolean;
//   loadFamilyMembers: () => Promise<void>;
//   loadActivityLogs: () => Promise<void>;
//   addFamilyMember: (accessCode: string) => Promise<void>;
// }

// // -------------------- Context --------------------
// const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

// export const FamilyProvider = ({ children }: { children: ReactNode }) => {
//   const { user } = useAuth();
//   const { toast } = useToast();

//   const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
//   const [activityLogs, setActivityLogs] = useState<FamilyActivityLog[]>([]);
//   const [loading, setLoading] = useState(false);

//   // -------------------- Load Family Members --------------------
//   const loadFamilyMembers = async () => {
//     if (!user) return; // no user, no fetch
//     setLoading(true);
//     try {
//       // Fetch family memberships for the logged-in patient
//       const { data, error } = await supabase
//         .from('family_memberships')
//         .select(
//           `
//         id,
//         role,
//         permission,
//         patient_id,
//         user:profiles!family_memberships_user_id_fkey (
//           id,
//           first_name,
//           last_name,
//           phone
//         )
//       `
//         )
//         .eq('patient_id', user.id); // dynamically filter by logged-in user

//       if (error) throw error;

//       // Format members for UI
//       const formattedMembers = (data || []).map((fm: any) => ({
//         id: fm.id,
//         name: fm.user
//           ? `${fm.user.first_name} ${fm.user.last_name}`
//           : 'Unknown',
//         role: fm.role,
//         permission: fm.permission,
//         status: fm.status || 'readonly', // default if missing
//         avatar: fm.user
//           ? `${fm.user.first_name[0]}${fm.user.last_name[0]}`
//           : '?',
//         phone: fm.user?.phone || '',
//       }));

//       setFamilyMembers(formattedMembers);
//     } catch (err) {
//       console.error('Error loading family members:', err);
//       toast({
//         title: 'Failed to load family members',
//         description: 'Please try again later.',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------- Load Activity Logs --------------------
//   const loadActivityLogs = async () => {
//     if (!user || familyMembers.length === 0) return;
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('family_activity_logs')
//         .select('*')
//         .in(
//           'family_membership_id',
//           familyMembers.map(fm => fm.id)
//         )
//         .order('time', { ascending: false });

//       if (error) throw error;

//       setActivityLogs(data || []);
//     } catch (err) {
//       console.error('Error loading activity logs:', err);
//       toast({
//         title: 'Failed to load activity logs',
//         description: 'Please try again later.',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------- Add Family Member --------------------
//   const addFamilyMember = async (accessCode: string) => {
//     if (!user) return;

//     setLoading(true);
//     try {
//       // Verify the access code exists and is active
//       const { data: patientCode, error: verifyError } = await supabase
//         .from('patient_access_codes')
//         .select('*')
//         .eq('access_code', accessCode)
//         .eq('is_active', true)
//         .single();

//       if (verifyError || !patientCode) {
//         throw new Error('Invalid or expired patient code');
//       }

//       // Check if membership already exists
//       const { data: existingMembership } = await supabase
//         .from('family_memberships')
//         .select('*')
//         .eq('patient_id', patientCode.user_id)
//         .eq('user_id', user.id)
//         .maybeSingle();

//       if (existingMembership) {
//         throw new Error(
//           'You are already added as a family member for this patient'
//         );
//       }

//       // Insert new family membership
//       const { error } = await supabase.from('family_memberships').insert({
//         patient_id: patientCode.user_id,
//         user_id: user.id,
//         role: 'family', // or make dynamic
//         permission: 'full', // or make dynamic
//         status: 'active',
//       });

//       if (error) throw error;

//       // Refresh data
//       await loadFamilyMembers();
//       await loadActivityLogs();

//       toast({
//         title: 'Family member added!',
//         description: 'You now have access to this patient’s data.',
//       });
//     } catch (err: any) {
//       console.error('Error adding family member:', err);
//       toast({
//         title: 'Failed to add family member',
//         description: err.message || 'Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------- Auto-load on user change --------------------
//   useEffect(() => {
//     loadFamilyMembers();
//   }, [user?.id]);

//   useEffect(() => {
//     if (familyMembers.length > 0) loadActivityLogs();
//   }, [familyMembers]);

//   return (
//     <FamilyContext.Provider
//       value={{
//         familyMembers,
//         activityLogs,
//         loading,
//         loadFamilyMembers,
//         loadActivityLogs,
//         addFamilyMember,
//       }}
//     >
//       {children}
//     </FamilyContext.Provider>
//   );
// };

// // -------------------- Hook --------------------
// export const useFamily = () => {
//   const context = useContext(FamilyContext);
//   if (!context) throw new Error('useFamily must be used within FamilyProvider');
//   return context;
// };

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

// -------------------- Types --------------------
export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  permission: string;
  status: 'active' | 'pending' | 'readonly' | 'emergency';
  avatar: string;
  phone?: string;
  email?: string;
  isPending?: boolean;
}

export interface FamilyActivityLog {
  id: string;
  family_membership_id: string;
  action: string;
  actor_name: string;
  time: string;
}

interface FamilyContextType {
  familyMembers: FamilyMember[];
  activityLogs: FamilyActivityLog[];
  loading: boolean;
  loadFamilyMembers: () => Promise<void>;
  loadActivityLogs: () => Promise<void>;
  addFamilyMember: (accessCode: string) => Promise<void>;
  generateAccessCode: (email?: string) => Promise<string | null>;
}

// -------------------- Context --------------------
const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activityLogs, setActivityLogs] = useState<FamilyActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  // -------------------- Load Family Members --------------------
  // const loadFamilyMembers = async () => {
  //   if (!user) return;
  //   setLoading(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from('family_memberships')
  //       .select(
  //         `
  //         id,
  //         role,
  //         permission,
  //         patient_id,
  //         status,
  //         user:profiles!family_memberships_user_id_fkey (
  //           id,
  //           first_name,
  //           last_name,
  //           phone
  //         )
  //       `
  //       )
  //       .eq('patient_id', user.id);

  //     if (error) throw error;

  //     const formattedMembers = (data || []).map((fm: any) => ({
  //       id: fm.id,
  //       name: fm.user
  //         ? `${fm.user.first_name} ${fm.user.last_name}`
  //         : 'Unknown',
  //       role: fm.role,
  //       permission: fm.permission,
  //       status: fm.status || 'readonly',
  //       avatar: fm.user
  //         ? `${fm.user.first_name[0]}${fm.user.last_name[0]}`
  //         : '?',
  //       phone: fm.user?.phone || '',
  //     }));

  //     setFamilyMembers(formattedMembers);
  //   } catch (err) {
  //     console.error('Error loading family members:', err);
  //     toast({
  //       title: 'Failed to load family members',
  //       description: 'Please try again later.',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // -------------------- Load Family Members --------------------
  const loadFamilyMembers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch all family memberships for this patient
      const { data, error } = await supabase
        .from('family_memberships')
        .select(
          `
        id,
        role,
        permission,
        patient_id,
        status,
        email,
        user:profiles (
          id,
          first_name,
          last_name,
          phone
        )
      `
        )
        .eq('patient_id', user.id);

      if (error) throw error;

      // Format members for UI
      const formattedMembers = (data || []).map((fm: any) => ({
        id: fm.id,
        name: fm.user
          ? `${fm.user.first_name} ${fm.user.last_name}`
          : fm.email || 'Pending',
        role: fm.role || 'Family',
        permission: fm.permission || 'Pending',
        status: fm.status || 'pending',
        avatar: fm.user
          ? `${fm.user.first_name[0]}${fm.user.last_name[0]}`
          : fm.email?.[0].toUpperCase() || '?',
        phone: fm.user?.phone || '',
        isPending: !fm.user, // flag for pending invites
      }));

      setFamilyMembers(formattedMembers);
    } catch (err) {
      console.error('Error loading family members:', err);
      toast({
        title: 'Failed to load family members',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Load Activity Logs --------------------
  const loadActivityLogs = async () => {
    if (!user || familyMembers.length === 0) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('family_activity_logs')
        .select('*')
        .in(
          'family_membership_id',
          familyMembers.map(fm => fm.id)
        )
        .order('time', { ascending: false });

      if (error) throw error;

      setActivityLogs(data || []);
    } catch (err) {
      console.error('Error loading activity logs:', err);
      toast({
        title: 'Failed to load activity logs',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Add Family Member --------------------
  const addFamilyMember = async (accessCode: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: patientCode, error: verifyError } = await supabase
        .from('patient_access_codes')
        .select('*')
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .single();

      if (verifyError || !patientCode) {
        throw new Error('Invalid or expired patient code');
      }

      const { data: existingMembership } = await supabase
        .from('family_memberships')
        .select('*')
        .eq('patient_id', patientCode.patient_id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMembership) {
        throw new Error('You are already a family member for this patient');
      }

      const { error } = await supabase.from('family_memberships').insert({
        patient_id: patientCode.patient_id,
        user_id: user.id,
        role: 'family',
        permission: 'full',
        status: 'active',
      });

      if (error) throw error;

      await loadFamilyMembers();
      await loadActivityLogs();

      toast({
        title: 'Family member added!',
        description: 'You now have access to this patient’s data.',
      });
    } catch (err: any) {
      console.error('Error adding family member:', err);
      toast({
        title: 'Failed to add family member',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Generate Access Code --------------------
  const generateAccessCode = async (patientId: string, email?: string) => {
    try {
      // Generate a random code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Insert into Supabase
      const { data, error } = await supabase
        .from('patient_access_codes')
        .insert({
          patient_id: patientId,
          access_code: code,
          is_active: true,
        });

      if (error) throw error;

      // Optional: send email if provided
      if (email) {
        await sendAccessCodeEmail(email, code);
      }

      return code;
    } catch (err: any) {
      console.error('Error generating access code:', err);
      throw err;
    }
  };

  // Mock email sending function (replace with SendGrid, Postmark, or Supabase Edge)
  const sendAccessCodeEmail = async (email: string, code: string) => {
    console.log(`Sending access code ${code} to ${email}`);
    // Call your email API here
  };

  // -------------------- Auto-load on user change --------------------
  useEffect(() => {
    loadFamilyMembers();
  }, [user?.id]);

  useEffect(() => {
    if (familyMembers.length > 0) loadActivityLogs();
  }, [familyMembers]);

  return (
    <FamilyContext.Provider
      value={{
        familyMembers,
        activityLogs,
        loading,
        loadFamilyMembers,
        loadActivityLogs,
        addFamilyMember,
        generateAccessCode,
      }}
    >
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
