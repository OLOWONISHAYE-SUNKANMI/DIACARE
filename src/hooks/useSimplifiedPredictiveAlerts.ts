import { useState, useEffect, useCallback } from 'react';
import { SimplifiedPredictiveAnalyzer, RiskAlert } from '@/utils/SimplifiedPredictiveAnalyzer';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useNutritionTracking } from '@/hooks/useNutritionTracking';
import { useToast } from '@/hooks/use-toast';

export interface PatientProfile {
  age: number;
  diabetesType: 1 | 2;
  weight: number;
  insulinSensitivityFactor: number;
  carbRatio: number;
  targetGlucose: number;
}

export const useSimplifiedPredictiveAlerts = () => {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzer] = useState(() => new SimplifiedPredictiveAnalyzer());
  const [patientProfile] = useState<PatientProfile>({
    age: 35,
    diabetesType: 1,
    weight: 70,
    insulinSensitivityFactor: 50,
    carbRatio: 15,
    targetGlucose: 100
  });
  
  const { readings } = useGlucose();
  const { meals, activities } = useNutritionTracking();
  const { toast } = useToast();

  // Run analysis when data changes
  const runAnalysis = useCallback(() => {
    try {
      setLoading(true);
      
      // Update analyzer with real patient data
      analyzer.updatePatientData(
        readings,
        meals,
        activities,
        [] // No insulin data for now
      );
      
      // Run AI/ML analysis
      const newAlerts = analyzer.analyzeAndGenerateAlerts();
      setAlerts(newAlerts);
      
      // Show toast for high/critical alerts
      const urgentAlerts = newAlerts.filter(alert => 
        alert.severity === 'critical' || alert.severity === 'high'
      );
      
      if (urgentAlerts.length > 0) {
        toast({
          title: "🤖 Nouvelle Alerte IA",
          description: `${urgentAlerts.length} alerte(s) prédictive(s) détectée(s)`,
          variant: urgentAlerts.some(a => a.severity === 'critical') ? "destructive" : "default"
        });
      }
      
    } catch (error) {
      console.error('Error running analysis:', error);
      toast({
        title: "Erreur d'analyse IA",
        description: "Impossible d'analyser les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [analyzer, readings, meals, activities, toast]);

  // Manual analysis trigger
  const triggerAnalysis = useCallback(() => {
    runAnalysis();
  }, [runAnalysis]);

  // Mark alert as read
  const markAlertAsRead = useCallback((alertId: string) => {
    analyzer.markAlertAsRead(alertId);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, [analyzer]);

  // Dismiss all alerts
  const dismissAllAlerts = useCallback(() => {
    const activeAlerts = analyzer.getActiveAlerts();
    activeAlerts.forEach(alert => analyzer.markAlertAsRead(alert.id));
    setAlerts([]);
  }, [analyzer]);

  // Emergency alert trigger
  const triggerEmergencyAlert = useCallback((
    emergencyType: 'severe_hypoglycemia' | 'severe_hyperglycemia' | 'no_response' | 'medical_emergency',
    currentGlucose?: number
  ) => {
    const emergencyMessages = {
      severe_hypoglycemia: `🚨 URGENCE: Hypoglycémie sévère détectée (${currentGlucose}mg/dL)`,
      severe_hyperglycemia: `🚨 URGENCE: Hyperglycémie critique (${currentGlucose}mg/dL)`,
      no_response: `🚨 URGENCE: Patient ne répond plus aux alertes`,
      medical_emergency: `🚨 URGENCE MÉDICALE: Alerte d'urgence activée`
    };

    // Store emergency alert in localStorage for family simulation
    const emergencyAlert = {
      timestamp: new Date().toISOString(),
      type: 'emergency',
      message: emergencyMessages[emergencyType],
      glucoseValue: currentGlucose,
      severity: 'critical'
    };
    
    const notifications = JSON.parse(localStorage.getItem('family_notifications') || '[]');
    notifications.unshift(emergencyAlert);
    localStorage.setItem('family_notifications', JSON.stringify(notifications.slice(0, 10)));

    toast({
      title: "🚨 Alerte d'urgence envoyée",
      description: "Votre famille a été notifiée",
      variant: "destructive"
    });
  }, [toast]);

  // Get family notifications from localStorage
  const getFamilyNotifications = useCallback(() => {
    return JSON.parse(localStorage.getItem('family_notifications') || '[]');
  }, []);

  // Run analysis when data changes
  useEffect(() => {
    if (readings.length > 0) {
      const timer = setTimeout(() => {
        runAnalysis();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [readings, meals, activities, runAnalysis]);

  // Periodic analysis (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      runAnalysis();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [runAnalysis]);

  // Initial analysis
  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  return {
    alerts,
    loading,
    patientProfile,
    triggerAnalysis,
    markAlertAsRead,
    dismissAllAlerts,
    triggerEmergencyAlert,
    getFamilyNotifications,
    analyzer
  };
};