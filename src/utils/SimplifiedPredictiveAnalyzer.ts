interface GlucoseReading {
  value: number;
  timestamp: Date;
  context: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'night';
  mealCarbs?: number;
  activity?: string;
}

interface PatientProfile {
  age: number;
  diabetesType: 1 | 2;
  weight: number;
  insulinSensitivityFactor: number;
  carbRatio: number;
  targetGlucose: number;
}

export interface RiskAlert {
  id: string;
  type: 'hypo_risk' | 'hyper_risk' | 'trend_warning' | 'medication_reminder' | 'pattern_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  prediction: string;
  recommendedActions: string[];
  timeframe: number; // minutes until predicted event
  confidence: number; // 0-100%
  createdAt: Date;
  isRead: boolean;
}

export class SimplifiedPredictiveAnalyzer {
  private readings: GlucoseReading[] = [];
  private alerts: RiskAlert[] = [];
  private patientProfile: PatientProfile;
  private meals: any[] = [];
  private activities: any[] = [];
  private insulinInjections: any[] = [];

  constructor(patientProfile?: PatientProfile) {
    this.patientProfile = patientProfile || {
      age: 35,
      diabetesType: 1,
      weight: 70,
      insulinSensitivityFactor: 50,
      carbRatio: 15,
      targetGlucose: 100
    };
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const now = new Date();
    // Generate sample data for the last 7 days
    for (let i = 0; i < 7; i++) {
      const day = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      
      // Morning fasting
      this.readings.push({
        value: 90 + Math.random() * 30,
        timestamp: new Date(day.setHours(7, 0)),
        context: 'fasting'
      });
      
      // After breakfast
      this.readings.push({
        value: 140 + Math.random() * 50,
        timestamp: new Date(day.setHours(9, 0)),
        context: 'after_meal',
        mealCarbs: 45 + Math.random() * 20
      });
      
      // Before lunch
      this.readings.push({
        value: 100 + Math.random() * 30,
        timestamp: new Date(day.setHours(12, 0)),
        context: 'before_meal'
      });
      
      // After dinner
      this.readings.push({
        value: 150 + Math.random() * 45,
        timestamp: new Date(day.setHours(20, 0)),
        context: 'after_meal',
        mealCarbs: 50 + Math.random() * 30
      });
    }
    
    this.readings.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Update patient data for real-time analysis
  updatePatientData(
    glucoseReadings: any[] = [],
    meals: any[] = [],
    activities: any[] = [],
    insulinInjections: any[] = []
  ) {
    if (glucoseReadings.length > 0) {
      this.readings = this.convertGlucoseData(glucoseReadings);
    }
    this.meals = meals;
    this.activities = activities;
    this.insulinInjections = insulinInjections;
  }

  private convertGlucoseData(readings: any[]): GlucoseReading[] {
    return readings.map(reading => ({
      value: reading.value,
      timestamp: new Date(reading.timestamp),
      context: this.mapContext(reading.context || 'before_meal'),
      mealCarbs: reading.mealCarbs,
      activity: reading.activity
    }));
  }

  private mapContext(context: string): 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'night' {
    const contextMap: Record<string, any> = {
      'fasting': 'fasting',
      'avant_repas': 'before_meal',
      'apres_repas': 'after_meal',
      'coucher': 'bedtime',
      'nuit': 'night'
    };
    return contextMap[context] || 'before_meal';
  }

  // Main analysis function
  analyzeAndGenerateAlerts(): RiskAlert[] {
    this.alerts = [];
    
    this.analyzeHypoglycemiaRisk();
    this.analyzeHyperglycemiaRisk();
    this.analyzeTrendPatterns();
    this.analyzeMealPatterns();
    this.analyzeAgeFactorRisk();
    
    return this.alerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity as keyof typeof severityOrder] - 
             severityOrder[a.severity as keyof typeof severityOrder];
    });
  }

  private analyzeHypoglycemiaRisk() {
    const recentReadings = this.getRecentReadings(4);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (!lastReading) return;

    const trend = this.calculateTrend(recentReadings);
    let riskScore = 0;
    
    // Calculate risk based on current glucose and trend
    if (trend < -15) riskScore += 40;
    else if (trend < -10) riskScore += 25;
    
    if (lastReading.value < 80) riskScore += 30;
    else if (lastReading.value < 100) riskScore += 20;
    
    // Age factor
    if (this.patientProfile.age > 65) riskScore += 10;
    
    if (riskScore >= 30) {
      const timeToHypo = this.predictTimeToThreshold(recentReadings, 70);
      
      this.alerts.push({
        id: `hypo_ai_${Date.now()}`,
        type: 'hypo_risk',
        severity: riskScore >= 60 ? 'critical' : riskScore >= 40 ? 'high' : 'medium',
        title: '🚨 Alerte Hypoglycémie IA',
        message: `Risque d'hypoglycémie détecté (Score AI: ${riskScore}/100)`,
        prediction: `Hypoglycémie possible dans ${timeToHypo} minutes`,
        recommendedActions: [
          'Vérifiez votre glycémie immédiatement',
          'Préparez 15g de glucides rapides',
          'Évitez l\'activité physique',
          'Informez votre famille',
          'Surveillez les symptômes'
        ],
        timeframe: timeToHypo,
        confidence: Math.min(95, 60 + (riskScore * 0.6)),
        createdAt: new Date(),
        isRead: false
      });
      
      // Simulate family notification
      this.sendFamilyNotification('hypoglycemia_risk', riskScore, lastReading.value);
    }
  }

  private analyzeHyperglycemiaRisk() {
    const recentReadings = this.getRecentReadings(3);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (!lastReading) return;

    const avgRecent = recentReadings.reduce((sum, r) => sum + r.value, 0) / recentReadings.length;
    let riskScore = 0;

    if (avgRecent > 250) riskScore += 50;
    else if (avgRecent > 200) riskScore += 35;
    else if (avgRecent > 180) riskScore += 25;

    const trend = this.calculateTrend(recentReadings);
    if (trend > 20) riskScore += 30;

    if (riskScore >= 30) {
      this.alerts.push({
        id: `hyper_ai_${Date.now()}`,
        type: 'hyper_risk',
        severity: riskScore >= 70 ? 'critical' : riskScore >= 50 ? 'high' : 'medium',
        title: '⚠️ Alerte Hyperglycémie IA',
        message: `Hyperglycémie persistante (Moyenne: ${avgRecent.toFixed(0)}mg/dL)`,
        prediction: 'Risque de complications si non traitée',
        recommendedActions: [
          'Vérifiez votre dose d\'insuline',
          'Hydratez-vous abondamment',
          'Évitez les glucides supplémentaires',
          'Contactez votre médecin',
          'Surveillez les cétones'
        ],
        timeframe: 90,
        confidence: Math.min(95, 55 + (riskScore * 0.7)),
        createdAt: new Date(),
        isRead: false
      });

      this.sendFamilyNotification('hyperglycemia_risk', riskScore, lastReading.value);
    }
  }

  private analyzeTrendPatterns() {
    const morningReadings = this.getReadingsByContext('fasting');
    
    if (morningReadings.length >= 3) {
      const recent3 = morningReadings.slice(-3);
      const morningTrend = this.calculateTrend(recent3);
      
      if (morningTrend > 15) {
        this.alerts.push({
          id: `trend_morning_${Date.now()}`,
          type: 'trend_warning',
          severity: 'medium',
          title: '📈 Pattern Matinal Détecté',
          message: 'Vos glycémies à jeun augmentent progressivement',
          prediction: 'Tendance à la hausse des glycémies matinales',
          recommendedActions: [
            'Révisez votre insuline lente du soir',
            'Vérifiez votre dîner de la veille',
            'Consultez votre diabétologue',
            'Surveillez votre sommeil'
          ],
          timeframe: 720,
          confidence: 78,
          createdAt: new Date(),
          isRead: false
        });
      }
    }
  }

  private analyzeMealPatterns() {
    const postMealReadings = this.getReadingsByContext('after_meal');
    const highPostMealCount = postMealReadings.filter(r => r.value > 180).length;
    const totalPostMeal = postMealReadings.length;
    
    if (totalPostMeal > 0 && (highPostMealCount / totalPostMeal) > 0.6) {
      this.alerts.push({
        id: `meal_pattern_${Date.now()}`,
        type: 'pattern_anomaly',
        severity: 'medium',
        title: '🍽️ Pattern Post-Prandial Anormal',
        message: `${Math.round((highPostMealCount/totalPostMeal)*100)}% des glycémies post-repas élevées`,
        prediction: 'Risque de complications à long terme',
        recommendedActions: [
          'Ajustez vos doses d\'insuline rapide',
          'Réduisez les portions de glucides',
          'Mangez plus lentement',
          'Consultez un nutritionniste'
        ],
        timeframe: 120,
        confidence: 88,
        createdAt: new Date(),
        isRead: false
      });
    }
  }

  private analyzeAgeFactorRisk() {
    const recentReadings = this.getRecentReadings(2);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (!lastReading) return;

    // Special alerts for elderly patients
    if (this.patientProfile.age >= 65) {
      if (lastReading.value < 100 || lastReading.value > 200) {
        this.alerts.push({
          id: `age_risk_${Date.now()}`,
          type: lastReading.value < 100 ? 'hypo_risk' : 'hyper_risk',
          severity: 'medium',
          title: '👴 Alerte Âge Senior',
          message: 'Surveillance renforcée recommandée (âge > 65 ans)',
          prediction: 'Risque accru de complications liées à l\'âge',
          recommendedActions: [
            'Contrôles glycémiques plus fréquents',
            'Objectifs glycémiques adaptés à l\'âge',
            'Surveillance des symptômes atypiques',
            'Contact médecin si nécessaire'
          ],
          timeframe: 120,
          confidence: 75,
          createdAt: new Date(),
          isRead: false
        });
      }
    }
  }

  // Helper methods
  private getRecentReadings(count: number): GlucoseReading[] {
    return this.readings.slice(-count);
  }

  private getReadingsByContext(context: string): GlucoseReading[] {
    return this.readings.filter(r => r.context === context);
  }

  private calculateTrend(readings: GlucoseReading[]): number {
    if (readings.length < 2) return 0;
    
    const first = readings[0];
    const last = readings[readings.length - 1];
    const timeDiff = (last.timestamp.getTime() - first.timestamp.getTime()) / (1000 * 60 * 60);
    
    return (last.value - first.value) / timeDiff;
  }

  private predictTimeToThreshold(readings: GlucoseReading[], threshold: number): number {
    if (readings.length < 2) return 999;
    
    const trend = this.calculateTrend(readings);
    const lastValue = readings[readings.length - 1].value;
    
    if (trend >= 0) return 999;
    
    const timeToThreshold = (lastValue - threshold) / Math.abs(trend);
    return Math.round(timeToThreshold * 60);
  }

  private sendFamilyNotification(alertType: string, riskScore: number, glucoseValue: number) {
    // Simulate family notification
    console.log(`🔔 NOTIFICATION FAMILLE: ${alertType} - Score: ${riskScore} - Glycémie: ${glucoseValue}mg/dL`);
    
    // Store notification in localStorage for demo
    const notifications = JSON.parse(localStorage.getItem('family_notifications') || '[]');
    notifications.push({
      timestamp: new Date().toISOString(),
      type: alertType,
      riskScore,
      glucoseValue,
      message: `Alerte ${alertType} détectée pour le patient`
    });
    localStorage.setItem('family_notifications', JSON.stringify(notifications.slice(-10)));
  }

  // Public methods for UI
  getActiveAlerts(): RiskAlert[] {
    return this.alerts.filter(alert => !alert.isRead);
  }

  markAlertAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.isRead = true;
  }

  getAlertStats() {
    const total = this.alerts.length;
    const critical = this.alerts.filter(a => a.severity === 'critical').length;
    const high = this.alerts.filter(a => a.severity === 'high').length;
    const medium = this.alerts.filter(a => a.severity === 'medium').length;
    
    return { total, critical, high, medium };
  }
}

export const predictiveAnalyzer = new SimplifiedPredictiveAnalyzer();