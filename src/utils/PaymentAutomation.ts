import { supabase } from "@/integrations/supabase/client";

export interface ConsultationPaymentData {
  id: string;
  doctorId?: string;
  patientId?: string;
  doctorName?: string;
  patientName?: string;
}

export interface PaymentResult {
  success: boolean;
  amount?: number;
  netAmount?: number;
  platformFee?: number;
  earningsId?: string;
  error?: string;
}

export interface PaymentReport {
  date: string;
  totalConsultations: number;
  totalPayments: number;
  dareCommission: number;
  professionalBreakdown: Record<string, {
    totalEarnings: number;
    consultationsCount: number;
    netAmount: number;
  }>;
  summary: {
    averagePerConsultation: number;
    platformFeePercentage: number;
  };
}

export const PaymentAutomation = {
  
  processConsultationPayment: async (consultationData: ConsultationPaymentData): Promise<PaymentResult> => {
    try {
      console.log(`🔄 Démarrage traitement paiement pour consultation: ${consultationData.id}`);
      
      const { data, error } = await supabase.functions.invoke('payment-automation', {
        body: {
          id: consultationData.id,
          action: 'process_payment'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`✅ Paiement traité avec succès:`, data);
      return data;
      
    } catch (error) {
      console.error('❌ Erreur traitement paiement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },
  
  generatePaymentReport: async (): Promise<PaymentReport | null> => {
    try {
      console.log(`📊 Génération rapport de paiements...`);
      
      const { data, error } = await supabase.functions.invoke('payment-automation', {
        body: {
          id: '', // Not needed for reports
          action: 'generate_report'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`✅ Rapport généré:`, data);
      return data;
      
    } catch (error) {
      console.error('❌ Erreur génération rapport:', error);
      return null;
    }
  },

  // Méthode pour traitement automatique des consultations terminées
  processCompletedConsultations: async (): Promise<{
    processed: number;
    errors: number;
    details: PaymentResult[];
  }> => {
    try {
      // Récupérer les consultations terminées non payées
      const { data: consultations, error } = await supabase
        .from('teleconsultations')
        .select('id, professional_id, patient_id')
        .eq('status', 'completed')
        .neq('payment_status', 'paid')
        .not('ended_at', 'is', null);

      if (error) {
        throw new Error(`Erreur récupération consultations: ${error.message}`);
      }

      if (!consultations || consultations.length === 0) {
        console.log('📋 Aucune consultation à traiter');
        return { processed: 0, errors: 0, details: [] };
      }

      console.log(`📋 ${consultations.length} consultations à traiter`);

      const results: PaymentResult[] = [];
      let processed = 0;
      let errors = 0;

      // Traiter chaque consultation
      for (const consultation of consultations) {
        const result = await PaymentAutomation.processConsultationPayment({
          id: consultation.id
        });

        results.push(result);

        if (result.success) {
          processed++;
        } else {
          errors++;
        }

        // Petit délai pour éviter de surcharger le système
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Traitement terminé: ${processed} succès, ${errors} erreurs`);

      return {
        processed,
        errors,
        details: results
      };

    } catch (error) {
      console.error('❌ Erreur traitement bulk:', error);
      return {
        processed: 0,
        errors: 1,
        details: [{
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        }]
      };
    }
  },

  // Méthode pour calculer les statistiques en temps réel
  calculateLiveStats: async () => {
    try {
      const { data: todayEarnings } = await supabase
        .from('professional_earnings')
        .select('gross_amount, platform_fee, net_amount')
        .gte('created_at', new Date().toISOString().split('T')[0] + 'T00:00:00');

      const { data: pendingConsultations } = await supabase
        .from('teleconsultations')
        .select('id')
        .eq('status', 'completed')
        .neq('payment_status', 'paid');

      const totalToday = todayEarnings?.reduce((sum, earning) => sum + earning.gross_amount, 0) || 0;
      const dareCommissionToday = todayEarnings?.reduce((sum, earning) => sum + earning.platform_fee, 0) || 0;
      const pendingCount = pendingConsultations?.length || 0;

      return {
        totalEarningsToday: totalToday,
        dareCommissionToday,
        pendingPayments: pendingCount,
        averageConsultationValue: todayEarnings?.length ? Math.round(totalToday / todayEarnings.length) : 500
      };

    } catch (error) {
      console.error('❌ Erreur calcul statistiques:', error);
      return null;
    }
  }
};

export default PaymentAutomation;