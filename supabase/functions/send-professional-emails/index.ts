import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'confirmation' | 'approval' | 'rejection' | 'admin_notification';
  to: string;
  applicationData?: {
    id: string;
    name: string;
    professionalType: string;
    country: string;
    email: string;
    institution?: string;
  };
  rejectionReason?: string;
  professionalCode?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, applicationData, rejectionReason, professionalCode }: EmailRequest = await req.json();

    let emailResponse;

    switch (type) {
      case 'confirmation':
        emailResponse = await resend.emails.send({
          from: "DARE Platform <noreply@dare-platform.com>",
          to: [to],
          subject: "✅ Candidature DARE reçue - Confirmation",
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🏥 DARE Platform</h1>
                <p style="color: #ecfdf5; margin: 10px 0 0 0; font-size: 16px;">Plateforme de consultation diabétologique</p>
              </div>
              
              <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #10b981; margin-bottom: 20px;">✅ Candidature reçue avec succès !</h2>
                
                <p>Bonjour <strong>${applicationData?.name}</strong>,</p>
                
                <p>Nous avons bien reçu votre candidature pour rejoindre la plateforme DARE en tant que <strong>${applicationData?.professionalType}</strong>.</p>
                
                <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <h3 style="margin: 0 0 10px 0; color: #166534;">📋 Détails de votre candidature :</h3>
                  <p style="margin: 5px 0;"><strong>Numéro de référence :</strong> ${applicationData?.id.substring(0, 8).toUpperCase()}</p>
                  <p style="margin: 5px 0;"><strong>Type professionnel :</strong> ${applicationData?.professionalType}</p>
                  <p style="margin: 5px 0;"><strong>Institution :</strong> ${applicationData?.institution || 'Non spécifiée'}</p>
                  <p style="margin: 5px 0;"><strong>Pays :</strong> ${applicationData?.country}</p>
                </div>
                
                <h3 style="color: #059669;">⏰ Prochaines étapes :</h3>
                <ol style="color: #374151;">
                  <li><strong>Examen de votre dossier</strong> - Notre équipe vérifiera vos qualifications (48-72h)</li>
                  <li><strong>Vérification des documents</strong> - Contrôle de vos certifications</li>
                  <li><strong>Notification par email</strong> - Vous recevrez notre décision</li>
                  <li><strong>Activation du compte</strong> - Si approuvé, vous recevrez vos codes d'accès</li>
                </ol>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <p style="margin: 0; color: #92400e;"><strong>⚠️ Important :</strong> Gardez ce numéro de référence pour tout suivi de votre candidature.</p>
                </div>
                
                <p>Notre équipe examine chaque candidature avec attention pour garantir la qualité des soins sur notre plateforme.</p>
                
                <p style="margin-top: 30px;">
                  Cordialement,<br>
                  <strong>L'équipe DARE Platform</strong><br>
                  <em>Révolutionner les soins diabétologiques en Afrique</em>
                </p>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
                <p>© 2024 DARE Platform - Plateforme de consultation diabétologique</p>
                <p>En cas de questions : support@dare-platform.com</p>
              </div>
            </div>
          `,
        });
        break;

      case 'approval':
        emailResponse = await resend.emails.send({
          from: "DARE Platform <noreply@dare-platform.com>",
          to: [to],
          subject: "🎉 Candidature DARE approuvée - Bienvenue !",
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 FÉLICITATIONS !</h1>
                <p style="color: #ecfdf5; margin: 10px 0 0 0; font-size: 16px;">Votre candidature a été approuvée</p>
              </div>
              
              <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #10b981; margin-bottom: 20px;">✅ Bienvenue dans la famille DARE !</h2>
                
                <p>Bonjour Dr. <strong>${applicationData?.name}</strong>,</p>
                
                <p>Nous avons le plaisir de vous informer que votre candidature a été <strong style="color: #10b981;">APPROUVÉE</strong> !</p>
                
                <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
                  <h3 style="margin: 0 0 15px 0; color: #166534;">🔑 Votre code professionnel :</h3>
                  <div style="background: white; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 24px; font-weight: bold; color: #059669; letter-spacing: 3px; border: 2px dashed #10b981;">
                    ${professionalCode}
                  </div>
                  <p style="margin: 10px 0 0 0; font-size: 14px; color: #166534;"><em>Gardez ce code confidentiel - il vous donne accès aux données patients</em></p>
                </div>
                
                <h3 style="color: #059669;">🚀 Comment commencer :</h3>
                <ol style="color: #374151;">
                  <li><strong>Connectez-vous</strong> sur la plateforme DARE avec vos identifiants</li>
                  <li><strong>Générez des codes</strong> d'accès pour vos consultations</li>
                  <li><strong>Demandez aux patients</strong> leur code personnel pour accéder à leurs données</li>
                  <li><strong>Commencez vos consultations</strong> à distance en toute sécurité</li>
                </ol>
                
                <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <h4 style="margin: 0 0 10px 0; color: #1e40af;">💡 Fonctionnalités disponibles :</h4>
                  <ul style="margin: 0; color: #1e40af;">
                    <li>Accès sécurisé aux données glycémiques des patients</li>
                    <li>Historique des médications et activités</li>
                    <li>Outils d'analyse prédictive IA</li>
                    <li>Système de facturation intégré</li>
                    <li>Support technique 24/7</li>
                  </ul>
                </div>
                
                <p>Vous rejoignez une communauté de professionnels dédiés à améliorer les soins diabétologiques en Afrique.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://dare-platform.com/professional-dashboard" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    🏥 Accéder à mon tableau de bord
                  </a>
                </div>
                
                <p style="margin-top: 30px;">
                  Excellente collaboration,<br>
                  <strong>L'équipe DARE Platform</strong><br>
                  <em>Ensemble pour de meilleurs soins diabétologiques</em>
                </p>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
                <p>© 2024 DARE Platform - Votre partenaire en télémédecine diabétologique</p>
                <p>Support : support@dare-platform.com | Urgences : +225 XX XX XX XX</p>
              </div>
            </div>
          `,
        });
        break;

      case 'rejection':
        emailResponse = await resend.emails.send({
          from: "DARE Platform <noreply@dare-platform.com>",
          to: [to],
          subject: "📧 Mise à jour de votre candidature DARE",
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🏥 DARE Platform</h1>
                <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Mise à jour de votre candidature</p>
              </div>
              
              <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #dc2626; margin-bottom: 20px;">Candidature non retenue</h2>
                
                <p>Bonjour <strong>${applicationData?.name}</strong>,</p>
                
                <p>Nous vous remercions pour l'intérêt que vous portez à la plateforme DARE.</p>
                
                <p>Après examen attentif de votre dossier, nous regrettons de vous informer que nous ne pouvons pas donner suite favorable à votre candidature à ce stade.</p>
                
                ${rejectionReason ? `
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <h4 style="margin: 0 0 10px 0; color: #991b1b;">Motif :</h4>
                  <p style="margin: 0; color: #991b1b;">${rejectionReason}</p>
                </div>
                ` : ''}
                
                <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                  <h4 style="margin: 0 0 10px 0; color: #0c4a6e;">💡 Possibilité de nouvelle candidature :</h4>
                  <p style="margin: 0; color: #0c4a6e;">Vous pourrez soumettre une nouvelle candidature après avoir répondu aux points mentionnés ci-dessus.</p>
                </div>
                
                <p>Nous vous encourageons à nous recontacter une fois les éléments requis complétés.</p>
                
                <p style="margin-top: 30px;">
                  Cordialement,<br>
                  <strong>L'équipe DARE Platform</strong>
                </p>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
                <p>© 2024 DARE Platform</p>
                <p>Contact : support@dare-platform.com</p>
              </div>
            </div>
          `,
        });
        break;

      case 'admin_notification':
        emailResponse = await resend.emails.send({
          from: "DARE Platform <notifications@dare-platform.com>",
          to: ["admin@dare-platform.com"], // À configurer
          subject: `🚨 Nouvelle candidature professionnelle - ${applicationData?.professionalType}`,
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🚨 NOUVELLE CANDIDATURE</h1>
                <p style="color: #fef3c7; margin: 10px 0 0 0;">Examen requis</p>
              </div>
              
              <div style="padding: 20px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #d97706; margin-bottom: 15px;">Détails du candidat :</h2>
                
                <ul style="list-style: none; padding: 0;">
                  <li style="margin: 8px 0;"><strong>Nom :</strong> ${applicationData?.name}</li>
                  <li style="margin: 8px 0;"><strong>Email :</strong> ${applicationData?.email}</li>
                  <li style="margin: 8px 0;"><strong>Type :</strong> ${applicationData?.professionalType}</li>
                  <li style="margin: 8px 0;"><strong>Pays :</strong> ${applicationData?.country}</li>
                  <li style="margin: 8px 0;"><strong>Institution :</strong> ${applicationData?.institution || 'Non spécifiée'}</li>
                  <li style="margin: 8px 0;"><strong>ID :</strong> ${applicationData?.id}</li>
                </ul>
                
                <div style="text-align: center; margin: 20px 0;">
                  <a href="https://dare-platform.com/admin/applications" style="background: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Examiner la candidature
                  </a>
                </div>
              </div>
            </div>
          `,
        });
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-professional-emails function:", error);
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