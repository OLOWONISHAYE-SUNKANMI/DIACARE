import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PatientConfirmationRequest {
  email: string;
  firstName: string;
  lastName: string;
  patientCode: string;
  planName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, patientCode, planName }: PatientConfirmationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "DiaCare <onboarding@resend.dev>",
      to: [email],
      subject: "Bienvenue dans DiaCare - Votre code patient",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin-bottom: 10px;">🩺 DiaCare</h1>
            <h2 style="color: #374151; margin-bottom: 5px;">Bienvenue ${firstName} ${lastName} !</h2>
            <p style="color: #6B7280;">Votre abonnement ${planName} est maintenant actif</p>
          </div>

          <div style="background: #F0FDF4; border: 2px solid #059669; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #059669; margin-bottom: 10px;">Votre code patient</h3>
            <div style="font-size: 24px; font-weight: bold; color: #059669; letter-spacing: 2px; background: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
              ${patientCode}
            </div>
            <p style="color: #374151; font-size: 14px; margin: 10px 0;">
              Ce code vous permet d'accéder à toutes les fonctionnalités DiaCare et de le partager avec votre famille.
            </p>
          </div>

          <div style="background: #F9FAFB; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 15px;">✨ Vos avantages ${planName}</h3>
            <ul style="color: #6B7280; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Accès complet à toutes les fonctionnalités DiaCare</li>
              <li>10 téléconsultations par mois</li>
              <li>DiaCare Chat pour vos questions quotidiennes</li>
              <li>DiaCare News - Actualités diabète</li>
              <li>Alertes personnalisées et suivi glycémie</li>
              ${planName.includes('Famille') ? '<li>Partage avec jusqu\'à 3 membres de famille</li>' : ''}
            </ul>
          </div>

          <div style="background: #EFF6FF; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1D4ED8; margin-bottom: 15px;">🚀 Prochaines étapes</h3>
            <ol style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Complétez votre profil dans l'application</li>
              <li>Configurez vos préférences de santé</li>
              <li>Explorez les fonctionnalités DiaCare</li>
              ${planName.includes('Famille') ? '<li>Partagez votre code patient avec votre famille</li>' : ''}
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL') || 'https://app.diacare.com'}" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Accéder à mon compte DiaCare
            </a>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 30px; text-align: center; color: #6B7280; font-size: 14px;">
            <p>Besoin d'aide ? Contactez notre support à <a href="mailto:support@diacare.com" style="color: #059669;">support@diacare.com</a></p>
            <p style="margin-top: 15px;">
              <strong>DiaCare</strong><br>
              Diabète Africain & Ressources d'Excellence<br>
              Votre partenaire santé au quotidien 💚
            </p>
          </div>
        </div>
      `,
    });

    console.log("Patient confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-patient-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);