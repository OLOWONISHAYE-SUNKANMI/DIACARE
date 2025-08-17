import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

interface ConsultationPaymentData {
  id: string;
  action: 'process_payment' | 'generate_report';
}

interface PaymentNotification {
  type: 'payment_processed' | 'payment_error';
  professional?: string;
  amount?: number;
  consultationId?: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id, action }: ConsultationPaymentData = await req.json();

    if (action === 'process_payment') {
      const result = await processConsultationPayment(id);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === 'generate_report') {
      const report = await generatePaymentReport();
      return new Response(JSON.stringify(report), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Action non supportée");

  } catch (error) {
    console.error("❌ Erreur PaymentAutomation:", error);
    
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function processConsultationPayment(consultationId: string) {
  try {
    console.log(`🔄 Traitement paiement consultation: ${consultationId}`);

    // 1. Vérifier la consultation
    const consultation = await validateConsultation(consultationId);
    if (!consultation) {
      throw new Error("Consultation introuvable ou invalide");
    }

    // 2. Calculer le montant
    const amount = calculatePaymentAmount(consultation);

    // 3. Ajouter au book du professionnel
    const { data: earningsData, error: earningsError } = await supabaseClient
      .from('professional_earnings')
      .insert({
        professional_id: consultation.professional_id,
        teleconsultation_id: consultation.id,
        gross_amount: amount,
        platform_fee: Math.round(amount * 0.1), // 10% commission DARE
        net_amount: Math.round(amount * 0.9),
        currency: 'XOF'
      })
      .select()
      .single();

    if (earningsError) {
      throw new Error(`Erreur ajout earnings: ${earningsError.message}`);
    }

    // 4. Mettre à jour le statut de la consultation
    const { error: updateError } = await supabaseClient
      .from('teleconsultations')
      .update({
        payment_status: 'paid',
        amount_charged: amount,
        doctor_payout_amount: Math.round(amount * 0.9)
      })
      .eq('id', consultationId);

    if (updateError) {
      throw new Error(`Erreur mise à jour consultation: ${updateError.message}`);
    }

    // 5. Notifier admin
    await notifyAdmin({
      type: 'payment_processed',
      professional: consultation.professional_name,
      amount: amount,
      consultationId: consultation.id
    });

    // 6. Envoyer notification au professionnel (via admin_notifications pour le moment)
    await notifyProfessional({
      professionalId: consultation.professional_id,
      message: `💰 Nouveau paiement: ${amount} F CFA ajouté à votre book pour la consultation`,
      amount: amount
    });

    console.log(`✅ Paiement traité: ${amount} F CFA pour ${consultation.professional_name}`);

    return { 
      success: true, 
      amount,
      netAmount: Math.round(amount * 0.9),
      platformFee: Math.round(amount * 0.1),
      earningsId: earningsData.id
    };

  } catch (error) {
    console.error('❌ Erreur traitement paiement:', error);
    
    await notifyAdmin({
      type: 'payment_error',
      consultationId: consultationId,
      error: error.message
    });

    throw error;
  }
}

async function validateConsultation(consultationId: string) {
  const { data, error } = await supabaseClient
    .from('teleconsultations')
    .select(`
      id,
      professional_id,
      patient_id,
      status,
      payment_status,
      ended_at,
      professional_applications!inner(first_name, last_name)
    `)
    .eq('id', consultationId)
    .eq('status', 'completed')
    .neq('payment_status', 'paid')
    .single();

  if (error) {
    console.error('Erreur validation consultation:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    professional_name: `${data.professional_applications.first_name} ${data.professional_applications.last_name}`
  };
}

function calculatePaymentAmount(consultation: any): number {
  // Base: 500 F CFA par consultation
  let baseAmount = 500;
  
  // Suppléments potentiels (à personnaliser selon les besoins)
  let supplements = 0;
  
  // Exemple: consultation le weekend +100F
  const endedAt = new Date(consultation.ended_at);
  const dayOfWeek = endedAt.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    supplements += 100;
  }
  
  // Exemple: consultation tardive (après 20h) +50F
  const hour = endedAt.getHours();
  if (hour >= 20 || hour <= 6) {
    supplements += 50;
  }

  return baseAmount + supplements;
}

async function notifyAdmin(notification: PaymentNotification) {
  const { error } = await supabaseClient
    .from('admin_notifications')
    .insert({
      notification_type: notification.type,
      title: notification.type === 'payment_processed' ? 'Paiement Traité' : 'Erreur Paiement',
      message: notification.type === 'payment_processed' 
        ? `Paiement de ${notification.amount} F CFA traité pour ${notification.professional}`
        : `Erreur lors du traitement du paiement pour la consultation ${notification.consultationId}: ${notification.error}`,
      data: notification
    });

  if (error) {
    console.error('Erreur notification admin:', error);
  }
}

async function notifyProfessional(data: {
  professionalId: string;
  message: string;
  amount: number;
}) {
  // Pour le moment, on utilise admin_notifications
  // Plus tard, on pourra implémenter un système de notifications dédié
  const { error } = await supabaseClient
    .from('admin_notifications')
    .insert({
      notification_type: 'professional_payment',
      title: 'Paiement Reçu',
      message: data.message,
      data: {
        professionalId: data.professionalId,
        amount: data.amount,
        type: 'payment_notification'
      }
    });

  if (error) {
    console.error('Erreur notification professionnel:', error);
  }
}

async function generatePaymentReport() {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Consultations du jour
    const { data: todayConsultations } = await supabaseClient
      .from('teleconsultations')
      .select('id, status, amount_charged')
      .gte('ended_at', `${today}T00:00:00`)
      .lt('ended_at', `${today}T23:59:59`)
      .eq('status', 'completed');

    // Paiements du jour
    const { data: todayEarnings } = await supabaseClient
      .from('professional_earnings')
      .select('gross_amount, platform_fee, net_amount, professional_id')
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`);

    const totalConsultations = todayConsultations?.length || 0;
    const totalPayments = todayEarnings?.reduce((sum, earning) => sum + earning.gross_amount, 0) || 0;
    const dareCommission = todayEarnings?.reduce((sum, earning) => sum + earning.platform_fee, 0) || 0;

    // Breakdown par professionnel
    const professionalBreakdown = todayEarnings?.reduce((acc: any, earning) => {
      const profId = earning.professional_id;
      if (!acc[profId]) {
        acc[profId] = {
          totalEarnings: 0,
          consultationsCount: 0,
          netAmount: 0
        };
      }
      acc[profId].totalEarnings += earning.gross_amount;
      acc[profId].netAmount += earning.net_amount;
      acc[profId].consultationsCount += 1;
      return acc;
    }, {}) || {};

    return {
      date: today,
      totalConsultations,
      totalPayments,
      dareCommission,
      professionalBreakdown,
      summary: {
        averagePerConsultation: totalConsultations > 0 ? Math.round(totalPayments / totalConsultations) : 0,
        platformFeePercentage: totalPayments > 0 ? Math.round((dareCommission / totalPayments) * 100) : 0
      }
    };

  } catch (error) {
    console.error('Erreur génération rapport:', error);
    throw error;
  }
}