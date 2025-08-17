import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { DataAccessEmail } from './_templates/data-access-email.tsx'
import { WeeklySummaryEmail } from './_templates/weekly-summary-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  to: string
  type: 'data_access' | 'weekly_summary' | 'security_alert'
  data: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    })
  }

  try {
    const { to, type, data }: NotificationRequest = await req.json()

    if (!to || !type || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, type, data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let html: string
    let subject: string

    switch (type) {
      case 'data_access':
        html = await renderAsync(
          React.createElement(DataAccessEmail, {
            professionalName: data.professionalName,
            professionalType: data.professionalType,
            professionalCode: data.professionalCode,
            institution: data.institution,
            timestamp: data.timestamp,
            actions: data.actions || []
          })
        )
        subject = '👀 DARE - Accès à vos données médicales'
        break

      case 'weekly_summary':
        html = await renderAsync(
          React.createElement(WeeklySummaryEmail, {
            accessCount: data.accessCount,
            accesses: data.accesses || [],
            weekStart: data.weekStart,
            weekEnd: data.weekEnd
          })
        )
        subject = '📊 DARE - Résumé hebdomadaire de vos accès'
        break

      case 'security_alert':
        // Pour les alertes de sécurité, utiliser un template simple
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">🚨 DARE - Alerte Sécurité</h1>
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #991b1b; margin-top: 0;">Tentative d'accès non autorisé détectée</h2>
              <p>Une tentative d'accès non autorisé à vos données a été détectée et bloquée automatiquement.</p>
              <p><strong>Heure de la tentative :</strong> ${new Date(data.timestamp).toLocaleString('fr-FR')}</p>
              ${data.details?.professionalCode ? `<p><strong>Code utilisé :</strong> ${data.details.professionalCode}</p>` : ''}
              <p>Aucune action n'est requise de votre part. Tous les accès non autorisés sont automatiquement bloqués et signalés.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://dare-app.com/security" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                Voir les détails de sécurité
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              DARE - Diabète Africain Réseau d'Excellence<br>
              Plateforme sécurisée de gestion du diabète
            </p>
          </div>
        `
        subject = '🚨 DARE - Alerte de sécurité'
        break

      default:
        return new Response(
          JSON.stringify({ error: `Unknown notification type: ${type}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'DARE Notifications <notifications@dare-app.com>',
      to: [to],
      subject,
      html,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: emailError 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Email sent successfully:', {
      type,
      to,
      emailId: emailResult?.id
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult?.id,
        type,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error sending transparency notification:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})