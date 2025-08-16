import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationResult {
  approved: boolean;
  flags: string[];
  requiresReview: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

interface ChatMessage {
  text: string;
  userId?: string;
  type?: string;
  data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, userId, sessionId } = await req.json();

    console.log('Moderating message for user:', userId);

    // Modération avancée côté serveur
    const moderationResult = await moderateMessage(message);

    // Log de la modération pour audit
    if (!moderationResult.approved) {
      await supabaseClient
        .from('moderation_logs')
        .insert({
          user_id: userId,
          session_id: sessionId,
          message_text: message.text,
          flags: moderationResult.flags,
          severity: moderationResult.severity,
          action_taken: moderationResult.requiresReview ? 'review' : 'blocked'
        });
    }

    // Si le contenu nécessite une révision, l'envoyer en file d'attente
    if (moderationResult.requiresReview) {
      await supabaseClient
        .from('content_review_queue')
        .insert({
          user_id: userId,
          content: message.text,
          content_type: message.type || 'text',
          flags: moderationResult.flags,
          priority: moderationResult.severity === 'critical' ? 'high' : 'medium'
        });
    }

    return new Response(JSON.stringify(moderationResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in moderate-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      approved: false,
      flags: ['system_error'],
      requiresReview: true,
      severity: 'high' as const,
      confidence: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function moderateMessage(message: ChatMessage): Promise<ModerationResult> {
  const flags: string[] = [];
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let confidence = 0.8;

  // 1. Contenu médical dangereux
  const medicalFlags = checkMedicalContent(message.text);
  if (medicalFlags.length > 0) {
    flags.push(...medicalFlags);
    severity = 'critical';
    confidence = 0.95;
  }

  // 2. Conseils médicaux non autorisés
  if (containsUnauthorizedAdvice(message.text)) {
    flags.push('unauthorized_medical_advice');
    severity = severity === 'critical' ? 'critical' : 'high';
    confidence = Math.max(confidence, 0.9);
  }

  // 3. Détection de contenu suicidaire ou d'automutilation
  const suicidalFlags = checkSuicidalContent(message.text);
  if (suicidalFlags.length > 0) {
    flags.push(...suicidalFlags);
    severity = 'critical';
    confidence = 0.98;
  }

  // 4. Contenu inapproprié
  const inappropriateFlags = filterInappropriateContent(message.text);
  if (inappropriateFlags.length > 0) {
    flags.push(...inappropriateFlags);
    severity = severity === 'critical' || severity === 'high' ? severity : 'medium';
  }

  // 5. Spam et promotion
  if (isSpamOrPromotion(message.text)) {
    flags.push('spam_promotion');
    severity = severity === 'low' ? 'medium' : severity;
  }

  // 6. Vérification des valeurs de glucose
  if (message.type === 'glucose_share' && message.data) {
    const glucoseFlags = checkGlucoseValues(message.data);
    if (glucoseFlags.length > 0) {
      flags.push(...glucoseFlags);
      severity = 'high';
    }
  }

  return {
    approved: flags.length === 0,
    flags,
    requiresReview: flags.some(f => 
      ['unauthorized_medical_advice', 'critical_glucose_value', 'suicidal_content'].includes(f.split(':')[0])
    ),
    severity,
    confidence
  };
}

function checkMedicalContent(text: string): string[] {
  const dangerousKeywords = [
    'arrêter insuline', 'stopper traitement', 'remplacer médecin',
    'dose mortelle', 'surdose', 'automédication dangereuse',
    'arrêter médicament', 'ignorer médecin', 'pas besoin médecin',
    'doubler dose', 'tripler dose', 'dose maximale',
    'overdose', 'drogue', 'substance illicite'
  ];

  const criticalKeywords = [
    'coma diabétique', 'acidocétose', 'hypoglycémie sévère',
    'perte de conscience', 'convulsions', 'urgence médicale',
    'ketoacidose', 'dka', 'hyperglycémie critique'
  ];

  const flags: string[] = [];
  const lowerText = text.toLowerCase();

  dangerousKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      flags.push(`dangerous_content:${keyword}`);
    }
  });

  criticalKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      flags.push(`critical_medical_content:${keyword}`);
    }
  });

  return flags;
}

function checkSuicidalContent(text: string): string[] {
  const suicidalKeywords = [
    'suicide', 'se tuer', 'en finir', 'plus envie de vivre',
    'mourir', 'disparaître', 'tout arrêter', 'plus la force',
    'plus d\'espoir', 'inutile de continuer', 'à quoi bon'
  ];

  const flags: string[] = [];
  const lowerText = text.toLowerCase();

  suicidalKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      flags.push(`suicidal_content:${keyword}`);
    }
  });

  return flags;
}

function containsUnauthorizedAdvice(text: string): boolean {
  const advicePatterns = [
    /tu devrais (arrêter|stopper|changer)/i,
    /je te conseille de (ne pas|arrêter)/i,
    /n'écoute pas (ton|le) médecin/i,
    /remplace (ton|le) traitement par/i,
    /les médecins se trompent/i,
    /fais confiance à (moi|nous) plutôt qu'à/i,
    /cette méthode est meilleure que/i,
    /tu n'as pas besoin de/i
  ];

  return advicePatterns.some(pattern => pattern.test(text));
}

function filterInappropriateContent(text: string): string[] {
  const flags: string[] = [];
  const lowerText = text.toLowerCase();

  const inappropriateWords = [
    'sexuel', 'pornographie', 'violence', 'harcèlement',
    'discrimination', 'racisme', 'homophobie', 'transphobie'
  ];

  const financialScams = [
    'investissement miracle', 'argent facile', 'pyramide',
    'crypto miracle', 'gains garantis', 'sans risque'
  ];

  inappropriateWords.forEach(word => {
    if (lowerText.includes(word)) {
      flags.push(`inappropriate_content:${word}`);
    }
  });

  financialScams.forEach(scam => {
    if (lowerText.includes(scam)) {
      flags.push(`financial_scam:${scam}`);
    }
  });

  return flags;
}

function isSpamOrPromotion(text: string): boolean {
  const spamPatterns = [
    /achetez maintenant/i,
    /offre limitée/i,
    /cliquez ici/i,
    /www\./i,
    /http[s]?:\/\//i,
    /contact[ez]*\s*moi/i,
    /envoyez\s*moi/i,
    /promotion\s*spéciale/i,
    /gratuit\s*pour\s*vous/i
  ];

  const linkCount = (text.match(/http[s]?:\/\/[^\s]+/g) || []).length;
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const capsRatio = capsCount / text.length;

  return spamPatterns.some(pattern => pattern.test(text)) || 
         linkCount > 2 || 
         (capsRatio > 0.3 && text.length > 20);
}

function checkGlucoseValues(glucoseData: any): string[] {
  const flags: string[] = [];

  if (glucoseData.value) {
    const value = Number(glucoseData.value);

    if (value < 50) {
      flags.push('critical_glucose_value:hypoglycemia_severe');
    } else if (value > 400) {
      flags.push('critical_glucose_value:hyperglycemia_severe');
    } else if (value < 20 || value > 800) {
      flags.push('invalid_glucose_value:out_of_range');
    }
  }

  return flags;
}