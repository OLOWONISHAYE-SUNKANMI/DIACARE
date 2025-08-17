import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { action, professional_code, patient_code, amount = 50000 } = await req.json();

    if (action === "create_payment_intent") {
      // Créer un payment intent Stripe pour 500 FCFA (50000 centimes)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // 500 FCFA = 50000 centimes
        currency: "xof", // CFA franc
        metadata: {
          professional_code,
          patient_code,
          consultation_fee: "500 FCFA"
        }
      });

      console.log(`💳 Payment intent created: ${paymentIntent.id} for ${amount/100} FCFA`);

      return new Response(
        JSON.stringify({
          success: true,
          client_secret: paymentIntent.client_secret,
          payment_intent_id: paymentIntent.id,
          amount: amount
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "confirm_payment") {
      const { payment_intent_id, session_id } = await req.json();

      // Vérifier le statut du paiement
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

      if (paymentIntent.status === "succeeded") {
        // Mettre à jour la session de consultation
        const { error: updateError } = await supabaseClient
          .from('professional_sessions')
          .update({
            fee_status: 'paid',
            fee_paid_at: new Date().toISOString(),
            stripe_payment_intent_id: payment_intent_id
          })
          .eq('id', session_id);

        if (updateError) {
          throw new Error("Failed to update session payment status");
        }

        // Calculer les gains du professionnel (90% du montant, 10% pour DARE)
        const platformFee = Math.round(paymentIntent.amount * 0.1);
        const professionalEarnings = paymentIntent.amount - platformFee;

        // Enregistrer les gains
        const { error: earningsError } = await supabaseClient
          .from('professional_earnings')
          .insert({
            professional_id: paymentIntent.metadata.professional_code,
            teleconsultation_id: session_id,
            gross_amount: paymentIntent.amount,
            platform_fee: platformFee,
            net_amount: professionalEarnings,
            currency: 'XOF'
          });

        if (earningsError) {
          console.error("Error recording earnings:", earningsError);
        }

        console.log(`✅ Payment confirmed: ${payment_intent_id}`);
        console.log(`💰 Professional earnings: ${professionalEarnings/100} FCFA`);

        return new Response(
          JSON.stringify({
            success: true,
            payment_confirmed: true,
            professional_earnings: professionalEarnings,
            platform_fee: platformFee
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      }
    }

    throw new Error("Invalid action specified");

  } catch (error) {
    console.error("❌ Error processing payment:", error);
    
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