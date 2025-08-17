import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { ApprovalEmail } from "./_templates/approval-email.tsx";
import { RejectionEmail } from "./_templates/rejection-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'approval' | 'rejection';
  application: {
    first_name: string;
    last_name: string;
    email: string;
    professional_type: string;
    institution?: string;
    professional_code?: string;
  };
  rejection_reason?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, application, rejection_reason }: EmailRequest = await req.json();

    console.log(`Sending ${type} email to:`, application.email);

    let html: string;
    let subject: string;

    if (type === 'approval') {
      if (!application.professional_code) {
        throw new Error('Code professionnel requis pour l\'email d\'approbation');
      }

      html = await renderAsync(
        React.createElement(ApprovalEmail, {
          firstName: application.first_name,
          lastName: application.last_name,
          professionalType: application.professional_type,
          professionalCode: application.professional_code,
          institution: application.institution,
        })
      );
      subject = "🎉 Votre candidature DARE a été approuvée !";

    } else if (type === 'rejection') {
      if (!rejection_reason) {
        throw new Error('Motif de rejet requis pour l\'email de rejet');
      }

      html = await renderAsync(
        React.createElement(RejectionEmail, {
          firstName: application.first_name,
          lastName: application.last_name,
          professionalType: application.professional_type,
          rejectionReason: rejection_reason,
          institution: application.institution,
        })
      );
      subject = "Mise à jour de votre candidature DARE";

    } else {
      throw new Error(`Type d'email non supporté: ${type}`);
    }

    const { data, error } = await resend.emails.send({
      from: "DARE Platform <candidatures@dare-diabetes.app>",
      to: [application.email],
      subject,
      html,
    });

    if (error) {
      console.error("Erreur envoi email:", error);
      throw error;
    }

    console.log("Email envoyé avec succès:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email de ${type} envoyé avec succès`,
        emailId: data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Erreur dans send-professional-emails:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Erreur lors de l'envoi de l'email",
        success: false,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});