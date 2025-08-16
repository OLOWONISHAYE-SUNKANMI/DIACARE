export interface ModerationResult {
  approved: boolean;
  flags: string[];
  requiresReview: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ChatMessage {
  text: string;
  userId?: string;
  type?: string;
  data?: any;
}

export class ModerationSystem {
  
  static async moderateMessage(message: ChatMessage): Promise<ModerationResult> {
    const flags: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    // 1. Filtrage contenu médical dangereux
    const medicalFlags = this.checkMedicalContent(message.text);
    if (medicalFlags.length > 0) {
      flags.push(...medicalFlags);
      severity = 'critical';
    }
    
    // 2. Détection conseils médicaux non autorisés
    if (this.containsUnauthorizedAdvice(message.text)) {
      flags.push('unauthorized_medical_advice');
      severity = severity === 'critical' ? 'critical' : 'high';
    }
    
    // 3. Filtrage contenu inapproprié
    const inappropriateFlags = this.filterInappropriateContent(message.text);
    if (inappropriateFlags.length > 0) {
      flags.push(...inappropriateFlags);
      severity = severity === 'critical' || severity === 'high' ? severity : 'medium';
    }
    
    // 4. Spam et promotion
    if (this.isSpamOrPromotion(message.text)) {
      flags.push('spam_promotion');
      severity = severity === 'low' ? 'medium' : severity;
    }
    
    // 5. Vérification de contenu de glucose dangereux
    if (message.type === 'glucose_share' && message.data) {
      const glucoseFlags = this.checkGlucoseValues(message.data);
      if (glucoseFlags.length > 0) {
        flags.push(...glucoseFlags);
        severity = 'high';
      }
    }
    
    return {
      approved: flags.length === 0,
      flags,
      requiresReview: flags.some(f => 
        ['unauthorized_medical_advice', 'critical_glucose_value'].includes(f.split(':')[0])
      ),
      severity
    };
  }
  
  private static checkMedicalContent(text: string): string[] {
    const dangerousKeywords = [
      'arrêter insuline', 'stopper traitement', 'remplacer médecin',
      'dose mortelle', 'surdose', 'automédication dangereuse',
      'arrêter médicament', 'ignorer médecin', 'pas besoin médecin',
      'doubler dose', 'tripler dose', 'dose maximale',
      'suicide', 'se tuer', 'en finir', 'overdose',
      'drogue', 'substance illicite', 'cannabis médical non prescrit'
    ];
    
    const criticalKeywords = [
      'coma diabétique', 'acidocétose', 'hypoglycémie sévère',
      'perte de conscience', 'convulsions', 'urgence médicale'
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
  
  private static containsUnauthorizedAdvice(text: string): boolean {
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
  
  private static filterInappropriateContent(text: string): string[] {
    const flags: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Contenu inapproprié général
    const inappropriateWords = [
      'sexuel', 'pornographie', 'violence', 'harcèlement',
      'discrimination', 'racisme', 'homophobie', 'transphobie'
    ];
    
    // Contenu financier suspect
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
  
  private static isSpamOrPromotion(text: string): boolean {
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
  
  private static checkGlucoseValues(glucoseData: any): string[] {
    const flags: string[] = [];
    
    if (glucoseData.value) {
      const value = Number(glucoseData.value);
      
      // Valeurs critiquement basses (< 50 mg/dL)
      if (value < 50) {
        flags.push('critical_glucose_value:hypoglycemia_severe');
      }
      // Valeurs critiquement hautes (> 400 mg/dL)
      else if (value > 400) {
        flags.push('critical_glucose_value:hyperglycemia_severe');
      }
      // Valeurs impossibles
      else if (value < 20 || value > 800) {
        flags.push('invalid_glucose_value:out_of_range');
      }
    }
    
    return flags;
  }
  
  static formatModerationMessage(result: ModerationResult): string {
    if (result.approved) return '';
    
    if (result.severity === 'critical') {
      return "⚠️ Ce message contient du contenu médical dangereux et ne peut pas être publié. Consultez immédiatement un professionnel de santé si vous ressentez des symptômes graves.";
    }
    
    if (result.requiresReview) {
      return "🔍 Ce message est en cours de révision par notre équipe médicale avant publication.";
    }
    
    if (result.flags.includes('spam_promotion')) {
      return "📢 Ce message semble contenir du contenu promotionnel et n'a pas pu être publié.";
    }
    
    return "❌ Ce message ne respecte pas nos directives communautaires et n'a pas pu être publié.";
  }
}

export default ModerationSystem;