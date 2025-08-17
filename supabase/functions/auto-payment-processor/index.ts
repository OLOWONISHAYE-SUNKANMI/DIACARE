import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Récupérer toutes les consultations à traiter automatiquement
    // (consultations terminées il y a plus de 24h sans paiement)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data: consultations, error: fetchError } = await supabaseClient
      .from('teleconsultations')
      .select('*')
      .eq('status', 'completed')
      .eq('payment_status', 'pending')
      .lt('ended_at', twentyFourHoursAgo.toISOString());

    if (fetchError) {
      throw new Error(`Failed to fetch consultations: ${fetchError.message}`);
    }

    console.log(`📋 Found ${consultations?.length || 0} consultations to process`);

    let processedCount = 0;
    let errorCount = 0;

    for (const consultation of consultations || []) {
      try {
        // Calculer les gains
        const earningsId = await supabaseClient.rpc('calculate_professional_earnings', {
          _teleconsultation_id: consultation.id,
          _platform_fee_percentage: 10.0
        });

        // Marquer comme payé
        await supabaseClient
          .from('teleconsultations')
          .update({ payment_status: 'paid' })
          .eq('id', consultation.id);

        processedCount++;
        console.log(`✅ Processed consultation ${consultation.id} - Earnings ID: ${earningsId}`);

      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to process consultation ${consultation.id}:`, error);
      }
    }

    // Traitement des paiements des professionnels (payout)
    const { data: pendingEarnings, error: earningsError } = await supabaseClient
      .from('professional_earnings')
      .select('*')
      .eq('payout_status', 'pending')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Derniers 7 jours

    if (!earningsError && pendingEarnings) {
      console.log(`💰 Found ${pendingEarnings.length} pending earnings to process`);

      // Grouper par professionnel pour les paiements groupés
      const earningsByProfessional = pendingEarnings.reduce((acc, earning) => {
        if (!acc[earning.professional_id]) {
          acc[earning.professional_id] = [];
        }
        acc[earning.professional_id].push(earning);
        return acc;
      }, {} as Record<string, any[]>);

      for (const [professionalId, earnings] of Object.entries(earningsByProfessional)) {
        const totalAmount = earnings.reduce((sum, earning) => sum + earning.net_amount, 0);
        
        // Simuler le paiement (en production, intégrer avec un service de paiement réel)
        const payoutReference = `PAYOUT_${Date.now()}_${professionalId.slice(0, 8)}`;
        
        // Marquer les gains comme payés
        const earningIds = earnings.map(e => e.id);
        await supabaseClient
          .from('professional_earnings')
          .update({
            payout_status: 'processed',
            payout_date: new Date().toISOString(),
            payout_reference: payoutReference
          })
          .in('id', earningIds);

        console.log(`💸 Processed payout for professional ${professionalId}: ${totalAmount} F CFA (${earnings.length} consultations)`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed_consultations: processedCount,
        errors: errorCount,
        processed_payouts: Object.keys(earningsByProfessional || {}).length,
        message: "Automatic payment processing completed"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ Error in automatic payment processing:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error occurred",
        success: false
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});