import { useState, useEffect, useCallback } from 'react';
import { GlucosePredictiveAnalyzer, RiskAlert } from '@/utils/GlucosePredictiveAnalyzer';
import { familyNotificationService } from '@/utils/FamilyNotificationService';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useNutritionTracking } from '@/hooks/useNutritionTracking';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PatientProfile {
  age: number;
  diabetesType: 1 | 2;
  weight: number;
  insulinSensitivityFactor: number;
  carbRatio: number;
  targetGlucose: number;
}

export const useAdvancedPredictiveAlerts = () => {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzer, setAnalyzer] = useState<GlucosePredictiveAnalyzer | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  
  const { readings } = useGlucose();
  const { meals, activities } = useNutritionTracking();
  const { toast } = useToast();

  // Initialize patient profile
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get patient profile from database or use defaults
        const { data: profile } = await supabase
          .from('ai_model_parameters')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        const defaultProfile: PatientProfile = {
          age: 35,
          diabetesType: 1,
          weight: 70,
          insulinSensitivityFactor: profile?.insulin_sensitivity_factor || 50,
          carbRatio: profile?.carb_ratio || 15,
          targetGlucose: profile?.target_glucose || 100
        };

        // Get age from profile if available
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (userProfile) {
          // Calculate age if we have birth date or use a default
          defaultProfile.age = 35; // You might want to add a birth_date field to profiles
        }

        setPatientProfile(defaultProfile);
        
        // Initialize analyzer with patient profile
        const newAnalyzer = new GlucosePredictiveAnalyzer(defaultProfile);
        setAnalyzer(newAnalyzer);
        
      } catch (error) {
        console.error('Error initializing patient profile:', error);
        // Use default profile if database query fails
        const defaultProfile: PatientProfile = {
          age: 35,
          diabetesType: 1,
          weight: 70,
          insulinSensitivityFactor: 50,
          carbRatio: 15,
          targetGlucose: 100
        };
        setPatientProfile(defaultProfile);
        setAnalyzer(new GlucosePredictiveAnalyzer(defaultProfile));
      }
    };

    initializeProfile();
  }, []);

  // Get insulin injections from database
  const getInsulinInjections = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('insulin_injections')
        .select('*')
        .eq('user_id', user.id)
        .gte('injection_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('injection_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching insulin injections:', error);
      return [];
    }
  }, []);

  // Run analysis when data changes
  const runAnalysis = useCallback(async () => {
    if (!analyzer) return;

    try {
      setLoading(true);
      
      // Get insulin injections
      const insulinInjections = await getInsulinInjections();
      
      // Update analyzer with real patient data
      analyzer.updatePatientData(
        readings,
        meals,
        activities,
        insulinInjections
      );
      
      // Run AI/ML analysis
      const newAlerts = analyzer.analyzeAndGenerateAlerts();
      setAlerts(newAlerts);
      
      // Send family notifications for critical alerts
      await sendFamilyNotifications(newAlerts);
      
      // Show toast for high/critical alerts
      const urgentAlerts = newAlerts.filter(alert => 
        alert.severity === 'critical' || alert.severity === 'high'
      );
      
      if (urgentAlerts.length > 0) {
        toast({
          title: "🚨 Nouvelle Alerte IA",
          description: `${urgentAlerts.length} alerte(s) prédictive(s) détectée(s)`,
          variant: urgentAlerts.some(a => a.severity === 'critical') ? "destructive" : "default"
        });
      }
      
    } catch (error) {
      console.error('Error running analysis:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [analyzer, readings, meals, activities, toast]);

  // Send family notifications
  const sendFamilyNotifications = async (alerts: RiskAlert[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const urgentAlerts = alerts.filter(alert => 
        alert.severity === 'critical' || alert.severity === 'high'
      );

      for (const alert of urgentAlerts) {
        const alertType = alert.type === 'hypo_risk' ? 'hypoglycemia_risk' :
                         alert.type === 'hyper_risk' ? 'hyperglycemia_risk' :
                         alert.type === 'medication_reminder' ? 'medication_reminder' : 'emergency';

        await familyNotificationService.sendFamilyAlert(
          user.id,
          alertType,
          alert.severity,
          `${alert.title}: ${alert.message}`,
          {
            glucose_value: readings.length > 0 ? readings[0].value : undefined,
            predicted_time: alert.timeframe,
            risk_score: alert.confidence
          }
        );
      }
    } catch (error) {
      console.error('Error sending family notifications:', error);
    }
  };

  // Manual analysis trigger
  const triggerAnalysis = useCallback(() => {
    runAnalysis();
  }, [runAnalysis]);

  // Mark alert as read
  const markAlertAsRead = useCallback((alertId: string) => {
    if (analyzer) {
      analyzer.markAlertAsRead(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
  }, [analyzer]);

  // Dismiss all alerts
  const dismissAllAlerts = useCallback(() => {
    if (analyzer) {
      const activeAlerts = analyzer.getActiveAlerts();
      activeAlerts.forEach(alert => analyzer.markAlertAsRead(alert.id));
      setAlerts([]);
    }
  }, [analyzer]);

  // Emergency alert trigger
  const triggerEmergencyAlert = useCallback(async (
    emergencyType: 'severe_hypoglycemia' | 'severe_hyperglycemia' | 'no_response' | 'medical_emergency',
    currentGlucose?: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await familyNotificationService.sendEmergencyAlert(
        user.id,
        emergencyType,
        currentGlucose
      );

      toast({
        title: "🚨 Alerte d'urgence envoyée",
        description: "Votre famille a été notifiée",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'alerte d'urgence",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Update patient profile
  const updatePatientProfile = useCallback(async (newProfile: Partial<PatientProfile>) => {
    if (!patientProfile || !analyzer) return;

    const updatedProfile = { ...patientProfile, ...newProfile };
    setPatientProfile(updatedProfile);
    
    // Update analyzer
    const newAnalyzer = new GlucosePredictiveAnalyzer(updatedProfile);
    setAnalyzer(newAnalyzer);

    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('ai_model_parameters')
        .upsert({
          user_id: user.id,
          insulin_sensitivity_factor: updatedProfile.insulinSensitivityFactor,
          carb_ratio: updatedProfile.carbRatio,
          target_glucose: updatedProfile.targetGlucose,
          weight_kg: updatedProfile.weight
        });
    } catch (error) {
      console.error('Error updating patient profile:', error);
    }
  }, [patientProfile, analyzer]);

  // Run analysis when data changes
  useEffect(() => {
    if (analyzer && readings.length > 0) {
      const timer = setTimeout(() => {
        runAnalysis();
      }, 1000); // Debounce analysis

      return () => clearTimeout(timer);
    }
  }, [analyzer, readings, meals, activities, runAnalysis]);

  // Periodic analysis (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (analyzer) {
        runAnalysis();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [analyzer, runAnalysis]);

  return {
    alerts,
    loading,
    patientProfile,
    triggerAnalysis,
    markAlertAsRead,
    dismissAllAlerts,
    triggerEmergencyAlert,
    updatePatientProfile,
    analyzer
  };
};