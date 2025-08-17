import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { consultationId, patientId, doctorName, notes, prescription, recommendations } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get patient email
    const { data: user } = await supabase.auth.admin.getUserById(patientId);
    if (!user?.user?.email) throw new Error("Patient email not found");

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const emailResponse = await resend.emails.send({
      from: "DARE Pro <noreply@dare-diabetes.com>",
      to: [user.user.email],
      subject: "Résumé de votre consultation - DARE Pro",
      html: `
        <h1>Résumé de votre consultation</h1>
        <p>Bonjour,</p>
        <p>Voici le résumé de votre consultation avec ${doctorName}:</p>
        
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3>Notes du médecin:</h3>
          <p>${notes}</p>
        </div>
        
        ${prescription ? `
        <div style="background: #e8f5e8; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3>💊 Prescription:</h3>
          <p>${prescription}</p>
        </div>
        ` : ''}
        
        <div style="background: #e8f0ff; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3>📋 Recommandations:</h3>
          <p>${recommendations}</p>
        </div>
        
        <p>Merci de votre confiance,<br>L'équipe DARE Pro</p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});