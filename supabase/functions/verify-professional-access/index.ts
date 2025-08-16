import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { professionalCode, patientId, accessType } = await req.json()

    // Vérifier le code professionnel
    const { data: professional, error: profError } = await supabaseClient
      .from('professional_codes')
      .select(`
        *,
        health_professionals (
          id,
          first_name,
          last_name,
          specialty,
          license_number,
          status
        )
      `)
      .eq('code', professionalCode)
      .eq('is_active', true)
      .single()

    if (profError || !professional) {
      return new Response(
        JSON.stringify({ error: 'Code professionnel invalide', access_granted: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Vérifier si le professionnel est vérifié
    if (professional.health_professionals.status !== 'verified') {
      return new Response(
        JSON.stringify({ error: 'Professionnel non vérifié', access_granted: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Logger l'accès
    await supabaseClient
      .from('patient_access_logs')
      .insert({
        professional_id: professional.professional_id,
        patient_id: patientId,
        access_type: accessType,
        professional_code: professionalCode,
        accessed_at: new Date().toISOString()
      })

    // Récupérer les données patient autorisées
    const { data: patientData, error: patientError } = await supabaseClient
      .from('patients')
      .select(`
        id,
        first_name,
        last_name,
        date_of_birth,
        diabetes_type,
        diagnosis_date,
        glucose_readings (
          value,
          measured_at,
          meal_context
        ),
        medications (
          name,
          dosage,
          frequency
        )
      `)
      .eq('id', patientId)
      .single()

    if (patientError) {
      throw patientError
    }

    return new Response(
      JSON.stringify({ 
        access_granted: true,
        professional: {
          name: `${professional.health_professionals.first_name} ${professional.health_professionals.last_name}`,
          specialty: professional.health_professionals.specialty,
          license: professional.health_professionals.license_number
        },
        patient_data: patientData,
        access_logged: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, access_granted: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})