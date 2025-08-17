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

    const { consultation_id } = await req.json();

    if (!consultation_id) {
      throw new Error("Consultation ID is required");
    }

    // Récupérer les détails de la consultation
    const { data: consultation, error: consultationError } = await supabaseClient
      .from('teleconsultations')
      .select('*')
      .eq('id', consultation_id)
      .single();

    if (consultationError || !consultation) {
      throw new Error("Consultation not found");
    }

    // Mettre à jour le statut de la consultation
    const { error: updateError } = await supabaseClient
      .from('teleconsultations')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        payment_status: 'paid'
      })
      .eq('id', consultation_id);

    if (updateError) {
      throw new Error("Failed to update consultation status");
    }

    // Calculer les gains du professionnel (90% du montant, 10% pour DARE)
    const { data: earnings } = await supabaseClient.rpc('calculate_professional_earnings', {
      _teleconsultation_id: consultation_id,
      _platform_fee_percentage: 10.0
    });

    console.log(`✅ Consultation ${consultation_id} processed successfully`);
    console.log(`💰 Professional earnings calculated: ${earnings}`);

    return new Response(
      JSON.stringify({
        success: true,
        consultation_id,
        earnings_id: earnings,
        message: "Consultation payment processed successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ Error processing consultation payment:", error);
    
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