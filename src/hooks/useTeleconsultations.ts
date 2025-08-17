import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface TeleconsultationData {
  id: string;
  professional_id: string;
  patient_id: string;
  scheduled_at: string;
  started_at?: string;
  ended_at?: string;
  duration_minutes?: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  consultation_notes?: string;
  prescription?: string;
  follow_up_date?: string;
  rating?: number;
  patient_feedback?: string;
  amount_charged: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  stripe_payment_intent_id?: string;
}

export const useTeleconsultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<TeleconsultationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadConsultations();
      // Set up real-time subscription
      const subscription = supabase
        .channel('teleconsultations_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'teleconsultations',
            filter: `patient_id=eq.${user.id}`
          },
          () => {
            loadConsultations();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const loadConsultations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teleconsultations')
        .select('*')
        .eq('patient_id', user.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      setConsultations((data || []) as TeleconsultationData[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading consultations');
    } finally {
      setLoading(false);
    }
  };

  const bookConsultation = async (
    professionalId: string,
    scheduledAt: string,
    amount: number
  ) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('teleconsultations')
      .insert({
        professional_id: professionalId,
        patient_id: user.id,
        scheduled_at: scheduledAt,
        amount_charged: amount,
        status: 'scheduled',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    
    // Reload consultations to update the list
    await loadConsultations();
    
    return data;
  };

  const cancelConsultation = async (consultationId: string) => {
    const { error } = await supabase
      .from('teleconsultations')
      .update({ status: 'cancelled' })
      .eq('id', consultationId);

    if (error) throw error;
    await loadConsultations();
  };

  const startConsultation = async (consultationId: string) => {
    const { error } = await supabase
      .from('teleconsultations')
      .update({ 
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', consultationId);

    if (error) throw error;
    await loadConsultations();
  };

  const endConsultation = async (
    consultationId: string,
    notes?: string,
    prescription?: string,
    followUpDate?: string
  ) => {
    const { error } = await supabase
      .from('teleconsultations')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        consultation_notes: notes,
        prescription,
        follow_up_date: followUpDate
      })
      .eq('id', consultationId);

    if (error) throw error;

    // Process payment automatically
    try {
      await supabase.functions.invoke('process-consultation-payment', {
        body: { consultation_id: consultationId }
      });
    } catch (paymentError) {
      console.error('Payment processing error:', paymentError);
    }

    await loadConsultations();
  };

  const rateConsultation = async (
    consultationId: string,
    rating: number,
    feedback?: string
  ) => {
    const { error } = await supabase
      .from('teleconsultations')
      .update({
        rating: Math.max(1, Math.min(5, rating)),
        patient_feedback: feedback
      })
      .eq('id', consultationId);

    if (error) throw error;
    await loadConsultations();
  };

  return {
    consultations,
    loading,
    error,
    bookConsultation,
    cancelConsultation,
    startConsultation,
    endConsultation,
    rateConsultation,
    refetch: loadConsultations
  };
};