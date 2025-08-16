interface GlucoseReading {
  value: number;
  timestamp: Date;
  context: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'night';
  mealCarbs?: number;
  activity?: string;
  medication?: {
    type: string;
    dose: number;
    time: Date;
  };
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

export class GlucosePredictiveAnalyzer {
  private readings: GlucoseReading[] = [];
  private alerts: RiskAlert[] = [];

  // Simulated historical data for demo
  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const now = new Date();
    // Last 7 days of readings
    for (let i = 0; i < 7; i++) {
      const day = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      
      // Morning fasting
      this.readings.push({
        value: 90 + Math.random() * 20,
        timestamp: new Date(day.setHours(7, 0)),
        context: 'fasting'
      });
      
      // After breakfast
      this.readings.push({
        value: 140 + Math.random() * 40,
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
      
      // After lunch
      this.readings.push({
        value: 160 + Math.random() * 50,
        timestamp: new Date(day.setHours(14, 0)),
        context: 'after_meal',
        mealCarbs: 60 + Math.random() * 25
      });
      
      // Before dinner
      this.readings.push({
        value: 95 + Math.random() * 25,
        timestamp: new Date(day.setHours(18, 0)),
        context: 'before_meal'
      });
      
      // After dinner
      this.readings.push({
        value: 150 + Math.random() * 45,
        timestamp: new Date(day.setHours(20, 0)),
        context: 'after_meal',
        mealCarbs: 50 + Math.random() * 30
      });
      
      // Bedtime
      this.readings.push({
        value: 110 + Math.random() * 20,
        timestamp: new Date(day.setHours(22, 0)),
        context: 'bedtime'
      });
    }
    
    // Sort by timestamp
    this.readings.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Analyze patterns and generate predictive alerts
  analyzeAndGenerateAlerts(): RiskAlert[] {
    this.alerts = [];
    
    this.analyzeHypoglycemiaRisk();
    this.analyzeHyperglycemiaRisk();
    this.analyzeTrendPatterns();
    this.analyzeMealPatterns();
    this.checkMedicationTiming();
    
    return this.alerts.sort((a, b) => b.severity.localeCompare(a.severity));
  }

  private analyzeHypoglycemiaRisk() {
    const recentReadings = this.getRecentReadings(4); // Last 4 readings
    const currentTrend = this.calculateTrend(recentReadings);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (lastReading && currentTrend < -10 && lastReading.value < 100) {
      const timeToHypo = this.predictTimeToThreshold(recentReadings, 70);
      
      this.alerts.push({
        id: `hypo_${Date.now()}`,
        type: 'hypo_risk',
        severity: lastReading.value < 80 ? 'high' : 'medium',
        title: 'Risque d\'Hypoglycémie Détecté',
        message: `Votre glycémie baisse rapidement (${currentTrend.toFixed(1)} mg/dL/h)`,
        prediction: `Hypoglycémie possible dans ${timeToHypo} minutes`,
        recommendedActions: [
          'Vérifiez votre glycémie dans 15 minutes',
          'Préparez une collation glucidique (15g)',
          'Évitez l\'activité physique intense',
          'Informez un proche si vous êtes seul'
        ],
        timeframe: timeToHypo,
        confidence: 85,
        createdAt: new Date(),
        isRead: false
      });
    }
  }

  private analyzeHyperglycemiaRisk() {
    const recentReadings = this.getRecentReadings(3);
    const lastReading = recentReadings[recentReadings.length - 1];
    const avgRecent = recentReadings.reduce((sum, r) => sum + r.value, 0) / recentReadings.length;
    
    if (lastReading && avgRecent > 200) {
      this.alerts.push({
        id: `hyper_${Date.now()}`,
        type: 'hyper_risk',
        severity: avgRecent > 250 ? 'critical' : 'high',
        title: 'Hyperglycémie Persistante',
        message: `Glycémie élevée maintenue (moyenne: ${avgRecent.toFixed(0)} mg/dL)`,
        prediction: 'Risque de complication si non traitée',
        recommendedActions: [
          'Vérifiez la dose d\'insuline',
          'Hydratez-vous abondamment',
          'Évitez les glucides supplémentaires',
          'Contactez votre médecin si ça persiste'
        ],
        timeframe: 60,
        confidence: 92,
        createdAt: new Date(),
        isRead: false
      });
    }
  }

  private analyzeTrendPatterns() {
    const morningReadings = this.getReadingsByContext('fasting');
    const eveningReadings = this.getReadingsByContext('bedtime');
    
    // Analyze morning trend
    if (morningReadings.length >= 3) {
      const morningTrend = this.calculateTrend(morningReadings.slice(-3));
      if (morningTrend > 15) {
        this.alerts.push({
          id: `trend_morning_${Date.now()}`,
          type: 'trend_warning',
          severity: 'medium',
          title: 'Tendance Matinale Inquiétante',
          message: 'Vos glycémies à jeun augmentent progressivement',
          prediction: 'Risque de déséquilibre glycémique matinal',
          recommendedActions: [
            'Révisez votre dose d\'insuline lente',
            'Vérifiez votre dîner de la veille',
            'Consultez votre diabétologue',
            'Surveillez votre sommeil'
          ],
          timeframe: 720, // 12 hours
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
        title: 'Pattern Post-Prandial Anormal',
        message: `${Math.round((highPostMealCount/totalPostMeal)*100)}% de vos glycémies post-repas sont élevées`,
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

  private checkMedicationTiming() {
    const now = new Date();
    const hour = now.getHours();
    
    // Check if it's medication time (example: 8AM and 6PM)
    if ((hour === 8 || hour === 18) && now.getMinutes() < 30) {
      this.alerts.push({
        id: `medication_${Date.now()}`,
        type: 'medication_reminder',
        severity: 'medium',
        title: 'Rappel Médication',
        message: 'Il est temps de prendre votre insuline',
        prediction: 'Risque de déséquilibre si oublié',
        recommendedActions: [
          'Prendre votre dose d\'insuline',
          'Vérifier la glycémie avant injection',
          'Noter l\'heure de prise',
          'Programmer le prochain rappel'
        ],
        timeframe: 30,
        confidence: 100,
        createdAt: new Date(),
        isRead: false
      });
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
    const timeDiff = (last.timestamp.getTime() - first.timestamp.getTime()) / (1000 * 60 * 60); // hours
    
    return (last.value - first.value) / timeDiff;
  }

  private predictTimeToThreshold(readings: GlucoseReading[], threshold: number): number {
    if (readings.length < 2) return 999;
    
    const trend = this.calculateTrend(readings);
    const lastValue = readings[readings.length - 1].value;
    
    if (trend >= 0) return 999; // Not trending down
    
    const timeToThreshold = (lastValue - threshold) / Math.abs(trend);
    return Math.round(timeToThreshold * 60); // Convert to minutes
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

export const glucoseAnalyzer = new GlucosePredictiveAnalyzer();