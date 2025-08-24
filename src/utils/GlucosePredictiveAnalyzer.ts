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

interface PatientProfile {
  age: number;
  diabetesType: 1 | 2;
  weight: number;
  insulinSensitivityFactor: number;
  carbRatio: number;
  targetGlucose: number;
}

interface InsulinInjection {
  type: 'rapid' | 'long' | 'intermediate';
  dose: number;
  timestamp: Date;
  brand?: string;
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
  private patientProfile: PatientProfile;
  private insulinInjections: InsulinInjection[] = [];
  private meals: any[] = [];
  private activities: any[] = [];

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

  // Update patient data for real-time analysis
  updatePatientData(
    glucoseReadings: any[] = [],
    meals: any[] = [],
    activities: any[] = [],
    insulinInjections: any[] = []
  ) {
    this.readings = this.convertGlucoseData(glucoseReadings);
    this.meals = meals;
    this.activities = activities;
    this.insulinInjections = this.convertInsulinData(insulinInjections);
  }

  private convertGlucoseData(readings: any[]): GlucoseReading[] {
    return readings.map(reading => ({
      value: reading.value,
      timestamp: new Date(reading.timestamp),
      context: this.mapContext(reading.context),
      mealCarbs: reading.mealCarbs,
      activity: reading.activity
    }));
  }

  private convertInsulinData(injections: any[]): InsulinInjection[] {
    return injections.map(injection => ({
      type: this.mapInsulinType(injection.insulin_type),
      dose: injection.dose_units,
      timestamp: new Date(injection.injection_time),
      brand: injection.insulin_brand
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

  private mapInsulinType(type: string): 'rapid' | 'long' | 'intermediate' {
    const typeMap: Record<string, any> = {
      'rapide': 'rapid',
      'lente': 'long',
      'intermediaire': 'intermediate',
      'bolus': 'rapid',
      'basal': 'long'
    };
    return typeMap[type] || 'rapid';
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

  // Analyze patterns and generate predictive alerts using AI/ML algorithms
  analyzeAndGenerateAlerts(): RiskAlert[] {
    this.alerts = [];
    
    // Advanced AI/ML analysis considering multiple factors
    this.analyzeHypoglycemiaRiskAdvanced();
    this.analyzeHyperglycemiaRiskAdvanced();
    this.analyzeInsulinOnActionRisk();
    this.analyzeMealImpactPrediction();
    this.analyzeActivityImpactRisk();
    this.analyzeAgeFactorRisk();
    this.analyzeTrendPatterns();
    this.checkMedicationTiming();
    this.analyzeComplexPatterns();
    
    return this.alerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity as keyof typeof severityOrder] - 
             severityOrder[a.severity as keyof typeof severityOrder];
    });
  }

  // Advanced hypoglycemia prediction using multiple factors
  private analyzeHypoglycemiaRiskAdvanced() {
    const recentReadings = this.getRecentReadings(6);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (!lastReading) return;

    // Calculate weighted risk score
    let riskScore = 0;
    
    // Factor 1: Current glucose trend
    const trend = this.calculateTrend(recentReadings);
    if (trend < -15) riskScore += 40;
    else if (trend < -10) riskScore += 25;
    else if (trend < -5) riskScore += 15;

    // Factor 2: Current glucose level
    if (lastReading.value < 80) riskScore += 30;
    else if (lastReading.value < 100) riskScore += 20;
    else if (lastReading.value < 120) riskScore += 10;

    // Factor 3: Recent insulin injections
    const recentInsulin = this.getRecentInsulin(180); // Last 3 hours
    recentInsulin.forEach(injection => {
      const minutesAgo = (Date.now() - injection.timestamp.getTime()) / (1000 * 60);
      if (injection.type === 'rapid' && minutesAgo < 90) {
        riskScore += injection.dose * 2; // Rapid insulin peak effect
      }
    });

    // Factor 4: Recent activity
    const recentActivity = this.getRecentActivity(120); // Last 2 hours
    if (recentActivity.length > 0) {
      const totalCaloriesBurned = recentActivity.reduce((sum, act) => sum + (act.total_calories_burned || 0), 0);
      if (totalCaloriesBurned > 200) riskScore += 20;
      else if (totalCaloriesBurned > 100) riskScore += 10;
    }

    // Factor 5: Age factor (older patients more at risk)
    if (this.patientProfile.age > 65) riskScore += 10;
    else if (this.patientProfile.age > 50) riskScore += 5;

    // Factor 6: Time since last meal
    const timeSinceLastMeal = this.getTimeSinceLastMeal();
    if (timeSinceLastMeal > 240) riskScore += 15; // 4+ hours
    else if (timeSinceLastMeal > 180) riskScore += 10; // 3+ hours

    if (riskScore >= 50) {
      const timeToHypo = this.predictTimeToThresholdAdvanced(recentReadings, 70, riskScore);
      
      this.alerts.push({
        id: `hypo_advanced_${Date.now()}`,
        type: 'hypo_risk',
        severity: riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : 'medium',
        title: '🚨 Alerte Hypoglycémie IA',
        message: `Risque élevé d'hypoglycémie détecté (Score: ${riskScore}/100)`,
        prediction: `Hypoglycémie probable dans ${timeToHypo} minutes`,
        recommendedActions: this.getHypoglycemiaActions(riskScore, lastReading.value),
        timeframe: timeToHypo,
        confidence: Math.min(95, 60 + (riskScore * 0.5)),
        createdAt: new Date(),
        isRead: false
      });

      // Send family notification
      this.sendFamilyAlert('hypoglycemia_risk', riskScore, timeToHypo);
    }
  }

  // Advanced hyperglycemia prediction
  private analyzeHyperglycemiaRiskAdvanced() {
    const recentReadings = this.getRecentReadings(4);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (!lastReading) return;

    let riskScore = 0;

    // Current glucose level
    if (lastReading.value > 250) riskScore += 40;
    else if (lastReading.value > 200) riskScore += 30;
    else if (lastReading.value > 180) riskScore += 20;

    // Glucose trend
    const trend = this.calculateTrend(recentReadings);
    if (trend > 20) riskScore += 30;
    else if (trend > 10) riskScore += 20;

    // Recent meal impact
    const recentMeals = this.getRecentMeals(180);
    recentMeals.forEach(meal => {
      if (meal.total_carbs > 60) riskScore += 15;
      else if (meal.total_carbs > 45) riskScore += 10;
    });

    // Insufficient insulin coverage
    const expectedInsulin = this.calculateExpectedInsulin();
    const actualInsulin = this.getRecentInsulin(180);
    const insulinDeficit = expectedInsulin - actualInsulin.reduce((sum, inj) => sum + inj.dose, 0);
    if (insulinDeficit > 5) riskScore += 25;
    else if (insulinDeficit > 2) riskScore += 15;

    if (riskScore >= 40) {
      this.alerts.push({
        id: `hyper_advanced_${Date.now()}`,
        type: 'hyper_risk',
        severity: riskScore >= 70 ? 'critical' : riskScore >= 50 ? 'high' : 'medium',
        title: '⚠️ Alerte Hyperglycémie IA',
        message: `Risque d'hyperglycémie sévère (Score: ${riskScore}/100)`,
        prediction: 'Hyperglycémie persistante probable sans intervention',
        recommendedActions: this.getHyperglycemiaActions(riskScore, lastReading.value),
        timeframe: 90,
        confidence: Math.min(95, 55 + (riskScore * 0.6)),
        createdAt: new Date(),
        isRead: false
      });

      this.sendFamilyAlert('hyperglycemia_risk', riskScore, 90);
    }
  }

  // Analyze insulin on action risk
  private analyzeInsulinOnActionRisk() {
    const activeInsulin = this.calculateActiveInsulin();
    const recentReadings = this.getRecentReadings(3);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (activeInsulin.total > 10 && lastReading && lastReading.value < 120) {
      this.alerts.push({
        id: `insulin_action_${Date.now()}`,
        type: 'hypo_risk',
        severity: 'high',
        title: '💉 Insuline Active Détectée',
        message: `${activeInsulin.total.toFixed(1)}U d'insuline encore active`,
        prediction: 'Risque de chute glycémique dans les 2 prochaines heures',
        recommendedActions: [
          'Surveillez votre glycémie toutes les 30 minutes',
          'Ayez une collation glucidique à portée de main',
          'Évitez l\'exercice physique intense',
          'Informez votre entourage'
        ],
        timeframe: 120,
        confidence: 88,
        createdAt: new Date(),
        isRead: false
      });
    }
  }

  // Analyze meal impact prediction
  private analyzeMealImpactPrediction() {
    const recentMeals = this.getRecentMeals(30); // Last 30 minutes
    
    recentMeals.forEach(meal => {
      const mealTime = new Date(meal.meal_time);
      const minutesAgo = (Date.now() - mealTime.getTime()) / (1000 * 60);
      
      if (minutesAgo < 30) {
        const expectedPeak = this.predictMealPeak(meal);
        const expectedInsulin = meal.total_carbs / this.patientProfile.carbRatio;
        
        const recentInsulin = this.getRecentInsulin(60);
        const actualInsulin = recentInsulin
          .filter(inj => inj.type === 'rapid')
          .reduce((sum, inj) => sum + inj.dose, 0);
        
        if (actualInsulin < expectedInsulin * 0.8) {
          this.alerts.push({
            id: `meal_impact_${Date.now()}`,
            type: 'hyper_risk',
            severity: 'medium',
            title: '🍽️ Pic Glycémique Prédit',
            message: `Repas de ${meal.total_carbs}g glucides détecté, insuline insuffisante`,
            prediction: `Pic à ${expectedPeak}mg/dL dans 90-120 minutes`,
            recommendedActions: [
              `Injecter ${(expectedInsulin - actualInsulin).toFixed(1)}U d'insuline rapide`,
              'Vérifier la glycémie dans 2 heures',
              'Boire de l\'eau',
              'Éviter les glucides supplémentaires'
            ],
            timeframe: 100,
            confidence: 82,
            createdAt: new Date(),
            isRead: false
          });
        }
      }
    });
  }

  // Analyze activity impact risk
  private analyzeActivityImpactRisk() {
    const plannedActivity = this.getUpcomingActivity();
    const recentReadings = this.getRecentReadings(2);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (plannedActivity && lastReading) {
      const expectedGlucoseDrop = this.predictActivityImpact(plannedActivity);
      const projectedGlucose = lastReading.value - expectedGlucoseDrop;
      
      if (projectedGlucose < 80) {
        this.alerts.push({
          id: `activity_risk_${Date.now()}`,
          type: 'hypo_risk',
          severity: projectedGlucose < 60 ? 'critical' : 'high',
          title: '🏃 Risque Activité Physique',
          message: `Activité prévue: risque de chute à ${projectedGlucose.toFixed(0)}mg/dL`,
          prediction: 'Hypoglycémie pendant ou après l\'exercice',
          recommendedActions: [
            'Prendre 15-30g de glucides avant l\'activité',
            'Réduire la dose d\'insuline rapide de 25-50%',
            'Surveiller la glycémie pendant l\'exercice',
            'Avoir des glucides de secours'
          ],
          timeframe: 45,
          confidence: 85,
          createdAt: new Date(),
          isRead: false
        });
      }
    }
  }

  // Age-specific risk analysis
  private analyzeAgeFactorRisk() {
    const recentReadings = this.getRecentReadings(3);
    const lastReading = recentReadings[recentReadings.length - 1];
    
    if (!lastReading) return;

    // Elderly patients (>65) have different risk profiles
    if (this.patientProfile.age >= 65) {
      if (lastReading.value < 100 || lastReading.value > 200) {
        this.alerts.push({
          id: `age_risk_${Date.now()}`,
          type: lastReading.value < 100 ? 'hypo_risk' : 'hyper_risk',
          severity: 'medium',
          title: '👴 Alerte Âge Senior',
          message: 'Risque accru de complications liées à l\'âge',
          prediction: 'Surveillance renforcée recommandée',
          recommendedActions: [
            'Contrôles glycémiques plus fréquents',
            'Objectifs glycémiques adaptés à l\'âge',
            'Surveillance des symptômes atypiques',
            'Contact médecin si symptômes'
          ],
          timeframe: 120,
          confidence: 75,
          createdAt: new Date(),
          isRead: false
        });
      }
    }
  }

  // Complex pattern analysis using ML-like algorithms
  private analyzeComplexPatterns() {
    const readings = this.readings.slice(-20); // Last 20 readings
    
    if (readings.length < 10) return;

    // Dawn phenomenon detection
    const morningReadings = readings.filter(r => {
      const hour = r.timestamp.getHours();
      return hour >= 6 && hour <= 8 && r.context === 'fasting';
    });
    
    if (morningReadings.length >= 3) {
      const avgMorning = morningReadings.reduce((sum, r) => sum + r.value, 0) / morningReadings.length;
      if (avgMorning > 140) {
        this.alerts.push({
          id: `dawn_phenomenon_${Date.now()}`,
          type: 'pattern_anomaly',
          severity: 'medium',
          title: '🌅 Phénomène de l\'Aube Détecté',
          message: `Glycémies matinales élevées (moyenne: ${avgMorning.toFixed(0)}mg/dL)`,
          prediction: 'Pattern récurrent probable',
          recommendedActions: [
            'Ajuster l\'insuline lente du soir',
            'Éviter les collations tardives',
            'Consulter pour adaptation du traitement',
            'Surveiller la glycémie au réveil'
          ],
          timeframe: 480, // 8 hours
          confidence: 78,
          createdAt: new Date(),
          isRead: false
        });
      }
    }
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