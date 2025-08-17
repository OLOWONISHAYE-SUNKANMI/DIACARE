import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CredentialsRequest {
  professionalId: string;
  code: string;
  qrCode: string;
  expiryDate: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { professionalId, code, qrCode, expiryDate }: CredentialsRequest = await req.json();

    console.log(`📧 Envoi des credentials pour le professionnel: ${professionalId}`);

    // TODO: Récupérer les infos du professionnel depuis la base de données
    // Pour le moment, on utilise un template générique
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
          .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
          .qr-info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Vos identifiants DARE</h1>
            <p>Code d'identification professionnel</p>
          </div>
          
          <div class="content">
            <h2>👨‍⚕️ Félicitations !</h2>
            <p>Votre candidature a été approuvée. Voici votre code d'identification professionnel DARE :</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
              <p>Code d'identification unique</p>
            </div>
            
            <div class="qr-info">
              <h3>📱 Code QR</h3>
              <p>Votre code QR de vérification :</p>
              <code style="word-break: break-all;">${qrCode}</code>
              <p><small>Utilisez ce code QR pour une vérification rapide depuis l'application mobile DARE</small></p>
            </div>
            
            <h3>🔐 Comment utiliser votre code :</h3>
            <ol>
              <li><strong>Accès aux données patients</strong> : Utilisez ce code pour demander l'accès aux données des patients</li>
              <li><strong>Identification</strong> : Présentez ce code lors des téléconsultations</li>
              <li><strong>Vérification</strong> : Les patients peuvent scanner votre QR code pour vérifier votre identité</li>
            </ol>
            
            <div class="warning">
              <h4>⚠️ Important :</h4>
              <ul>
                <li>Gardez ce code confidentiel</li>
                <li>Ne le partagez qu'avec des patients autorisés</li>
                <li>Code valide jusqu'au : <strong>${new Date(expiryDate).toLocaleDateString('fr-FR')}</strong></li>
                <li>Contactez l'administration DARE pour tout problème</li>
              </ul>
            </div>
            
            <h3>📞 Support :</h3>
            <p>En cas de problème, contactez-nous :</p>
            <ul>
              <li>Email : support@dare-health.com</li>
              <li>Téléphone : +221 XX XXX XXXX</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>© 2024 DARE - Digital Access for Resource Enhancement</p>
            <p>Plateforme de télémédecine et gestion du diabète</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "DARE Platform <noreply@dare-health.com>",
      to: ["professional@example.com"], // TODO: Récupérer l'email depuis la DB
      subject: `🔑 Vos identifiants DARE - Code: ${code}`,
      html: emailHtml
    });

    if (error) {
      console.error("❌ Erreur envoi email:", error);
      throw error;
    }

    console.log("✅ Email credentials envoyé avec succès:", data);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: data.id,
        code: code
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ Erreur fonction send-professional-credentials:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Erreur inconnue",
        success: false
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});