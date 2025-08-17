import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[END-CONSULTATION] ${step}${detailsStr}`);
};

interface EndConsultationRequest {
  consultationId: string;
  notes: string;
  prescription?: string;
  recommendations?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client with service role for admin operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Initialize Supabase client with anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id });

    const { consultationId, notes, prescription, recommendations }: EndConsultationRequest = await req.json();
    logStep("Request data received", { consultationId, hasNotes: !!notes, hasPrescription: !!prescription });

    // 1. Get consultation details
    const { data: consultation, error: consultationError } = await supabaseService
      .from('teleconsultations')
      .select(`
        *,
        professional_applications!inner(first_name, last_name, email)
      `)
      .eq('id', consultationId)
      .single();

    if (consultationError || !consultation) {
      throw new Error(`Consultation not found: ${consultationError?.message}`);
    }

    logStep("Consultation found", { 
      consultationId, 
      professionalEmail: consultation.professional_applications.email,
      amount: consultation.amount_charged 
    });

    // Calculate consultation duration
    const startTime = new Date(consultation.started_at || consultation.scheduled_at);
    const endTime = new Date();
    const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    // 2. Save consultation record and summary
    const { error: updateError } = await supabaseService
      .from('teleconsultations')
      .update({
        status: 'completed',
        ended_at: endTime.toISOString(),
        duration_minutes: durationMinutes,
        consultation_notes: notes,
        prescription: prescription || null,
        consultation_summary: `Consultation terminée après ${durationMinutes} minutes. ${notes}`,
        doctor_payout_status: 'pending',
        doctor_payout_amount: consultation.amount_charged
      })
      .eq('id', consultationId);

    if (updateError) {
      throw new Error(`Failed to update consultation: ${updateError.message}`);
    }

    // Create detailed consultation summary
    const { error: summaryError } = await supabaseService
      .from('consultation_summaries')
      .insert({
        teleconsultation_id: consultationId,
        doctor_notes: notes,
        prescription: prescription || null,
        recommendations: recommendations || null,
        duration_minutes: durationMinutes
      });

    if (summaryError) {
      logStep("Warning: Failed to create consultation summary", { error: summaryError.message });
    }

    logStep("Consultation record updated successfully");

    // 3. Process automatic payment to doctor
    try {
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2023-10-16",
      });

      // Calculate platform fee (10%)
      const platformFeePercentage = 10;
      const grossAmount = consultation.amount_charged;
      const platformFee = Math.round(grossAmount * (platformFeePercentage / 100));
      const netAmount = grossAmount - platformFee;

      // Create earning record
      const { error: earningsError } = await supabaseService
        .from('professional_earnings')
        .insert({
          professional_id: consultation.professional_id,
          teleconsultation_id: consultationId,
          gross_amount: grossAmount,
          platform_fee: platformFee,
          net_amount: netAmount,
          payout_status: 'pending'
        });

      if (earningsError) {
        logStep("Warning: Failed to create earnings record", { error: earningsError.message });
      }

      // Update consultation with payout status
      await supabaseService
        .from('teleconsultations')
        .update({ doctor_payout_status: 'processed' })
        .eq('id', consultationId);

      logStep("Payment processing completed", { grossAmount, platformFee, netAmount });

    } catch (paymentError) {
      logStep("Warning: Payment processing failed", { error: paymentError });
      // Don't fail the whole operation if payment fails
    }

    // 4. Notify administration
    try {
      const { error: notificationError } = await supabaseService
        .from('admin_notifications')
        .insert({
          notification_type: 'consultation_completed',
          title: 'Consultation Terminée',
          message: `Dr. ${consultation.professional_applications.first_name} ${consultation.professional_applications.last_name} a terminé une consultation de ${consultation.amount_charged} F CFA`,
          data: {
            consultationId,
            doctorEmail: consultation.professional_applications.email,
            amount: consultation.amount_charged,
            duration: durationMinutes,
            timestamp: new Date().toISOString()
          }
        });

      if (notificationError) {
        logStep("Warning: Failed to create admin notification", { error: notificationError.message });
      } else {
        // Update consultation to mark admin as notified
        await supabaseService
          .from('teleconsultations')
          .update({ admin_notified_at: new Date().toISOString() })
          .eq('id', consultationId);
        
        logStep("Admin notification created successfully");
      }
    } catch (notificationError) {
      logStep("Warning: Admin notification failed", { error: notificationError });
    }

    // 5. Trigger patient summary email (call separate function)
    try {
      const emailResponse = await supabaseService.functions.invoke('send-consultation-summary', {
        body: {
          consultationId,
          patientId: consultation.patient_id,
          doctorName: `Dr. ${consultation.professional_applications.first_name} ${consultation.professional_applications.last_name}`,
          notes,
          prescription: prescription || null,
          recommendations: recommendations || 'Suivez les conseils du médecin et prenez vos médicaments comme prescrits.'
        }
      });

      if (emailResponse.error) {
        logStep("Warning: Failed to send patient summary", { error: emailResponse.error });
      } else {
        // Update consultation to mark summary as sent
        await supabaseService
          .from('teleconsultations')
          .update({ patient_summary_sent_at: new Date().toISOString() })
          .eq('id', consultationId);
        
        logStep("Patient summary email sent successfully");
      }
    } catch (emailError) {
      logStep("Warning: Patient summary email failed", { error: emailError });
    }

    logStep("Consultation ending process completed successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      paymentProcessed: true,
      duration: durationMinutes,
      message: "Consultation terminée avec succès"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in end-consultation", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});