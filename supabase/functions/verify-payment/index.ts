import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");
    logStep("Session ID received", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { 
      sessionId: session.id, 
      paymentStatus: session.payment_status,
      subscriptionId: session.subscription 
    });

    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    logStep("Subscription retrieved", { subscriptionId: subscription.id, status: subscription.status });

    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const userEmail = session.metadata?.userEmail;

    if (!userId || !planId) {
      throw new Error('Missing metadata in session');
    }

    // Check if subscription already exists
    const { data: existingSubscription } = await supabaseService
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    let subscriptionData;

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabaseService
        .from('user_subscriptions')
        .update({
          plan_id: planId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: 'active',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          consultations_used: 0,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      subscriptionData = data;
      logStep("Subscription updated", { subscriptionId: data.id });
    } else {
      // Create new subscription
      const { data, error } = await supabaseService
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: 'active',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          consultations_used: 0
        })
        .select()
        .single();

      if (error) throw error;
      subscriptionData = data;
      logStep("Subscription created", { subscriptionId: data.id, patientCode: data.patient_code });
    }

    // Get plan details and user profile for email
    const { data: plan } = await supabaseService
      .from('subscription_plans')
      .select('name')
      .eq('id', planId)
      .single();

    const { data: profile } = await supabaseService
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', userId)
      .single();

    // Send confirmation email
    if (userEmail && subscriptionData.patient_code) {
      try {
        await supabaseService.functions.invoke('send-patient-confirmation', {
          body: {
            email: userEmail,
            firstName: profile?.first_name || 'Patient',
            lastName: profile?.last_name || '',
            patientCode: subscriptionData.patient_code,
            planName: plan?.name || 'DiaCare'
          }
        });
        logStep("Confirmation email sent", { email: userEmail });
      } catch (emailError) {
        logStep("Email sending failed", { error: emailError });
        // Don't fail the whole process if email fails
      }
    }

    return new Response(JSON.stringify({
      success: true,
      subscription: subscriptionData,
      patientCode: subscriptionData.patient_code
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});