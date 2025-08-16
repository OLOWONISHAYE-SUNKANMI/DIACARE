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

    const { professionalId, specialty } = await req.json()

    // Générer un code unique
    const generateCode = (specialty: string) => {
      const specialtyPrefix = {
        'endocrinologue': 'END',
        'medecin-generaliste': 'MG',
        'diabetologue': 'DIA',
        'nutritionniste': 'NUT',
        'infirmier-diabetes': 'IDE'
      }[specialty] || 'PRO'
      
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.random().toString(36).substring(2, 6).toUpperCase()
      return `DARE-${specialtyPrefix}-${timestamp}-${random}`
    }

    const professionalCode = generateCode(specialty)

    // Vérifier l'unicité du code
    const { data: existingCode } = await supabaseClient
      .from('professional_codes')
      .select('code')
      .eq('code', professionalCode)
      .single()

    if (existingCode) {
      // Regénérer si le code existe déjà
      return new Response(
        JSON.stringify({ error: 'Code collision, retry needed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Insérer le code dans la base
    const { data, error } = await supabaseClient
      .from('professional_codes')
      .insert({
        professional_id: professionalId,
        code: professionalCode,
        specialty: specialty,
        generated_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        code: professionalCode,
        generated_at: data.generated_at,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})