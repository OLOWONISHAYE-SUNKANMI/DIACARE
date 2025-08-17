import { supabase } from "@/integrations/supabase/client";

export interface ConsultationSession {
  id: string;
  professional_code: string;
  patient_code: string;
  patient_name?: string;
  consultation_started_at: string;
  consultation_ended_at?: string;
  consultation_duration_minutes?: number;
  consultation_notes?: string;
  fee_amount: number;
  fee_status: string;
  fee_paid_at?: string;
  stripe_payment_intent_id?: string;
}

export interface PaymentIntent {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  success: boolean;
}

export const ConsultationBilling = {
  
  createPaymentIntent: async (professionalCode: string, patientCode: string): Promise<PaymentIntent> => {
    try {
      console.log('💳 Création payment intent pour consultation 500 FCFA');
      
      const { data, error } = await supabase.functions.invoke('process-consultation-payment', {
        body: {
          action: 'create_payment_intent',
          professional_code: professionalCode,
          patient_code: patientCode,
          amount: 50000 // 500 FCFA en centimes
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ Payment intent créé:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Erreur création payment intent:', error);
      throw error;
    }
  },

  confirmPayment: async (paymentIntentId: string, sessionId: string) => {
    try {
      console.log('🔄 Confirmation paiement:', paymentIntentId);
      
      const { data, error } = await supabase.functions.invoke('process-consultation-payment', {
        body: {
          action: 'confirm_payment',
          payment_intent_id: paymentIntentId,
          session_id: sessionId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ Paiement confirmé:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Erreur confirmation paiement:', error);
      throw error;
    }
  },
  
  startConsultation: async (professionalCode: string, patientCode: string): Promise<ConsultationSession> => {
    try {
      console.log('🏥 Démarrage consultation:', { professionalCode, patientCode });
      
      const { data, error } = await supabase
        .from('professional_sessions')
        .insert([{
          professional_code: professionalCode,
          patient_code: patientCode,
          patient_name: `Patient-${patientCode}`,
          consultation_started_at: new Date().toISOString(),
          fee_amount: 50000, // 500 FCFA en centimes
          fee_status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Consultation créée:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Erreur démarrage consultation:', error);
      throw error;
    }
  },
  
  endConsultation: async (sessionId: string, consultationNotes: string): Promise<ConsultationSession> => {
    try {
      console.log('🔚 Fin consultation:', sessionId);
      
      const endTime = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('professional_sessions')
        .update({
          consultation_ended_at: endTime,
          consultation_notes: consultationNotes,
          access_granted: true
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Consultation terminée:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Erreur fin consultation:', error);
      throw error;
    }
  },
  
  getConsultationHistory: async (professionalCode: string): Promise<ConsultationSession[]> => {
    try {
      const { data, error } = await supabase
        .from('professional_sessions')
        .select('*')
        .eq('professional_code', professionalCode)
        .order('consultation_started_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data || [];
      
    } catch (error) {
      console.error('❌ Erreur récupération historique:', error);
      return [];
    }
  },

  generateInvoice: async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('professional_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      return {
        sessionId: data.id,
        amount: `${data.fee_amount / 100} FCFA`,
        date: new Date(data.consultation_started_at).toLocaleDateString('fr-FR'),
        patientCode: data.patient_code,
        professionalCode: data.professional_code,
        status: data.fee_status,
        notes: data.consultation_notes
      };
      
    } catch (error) {
      console.error('❌ Erreur génération facture:', error);
      return null;
    }
  }
};

export default ConsultationBilling;