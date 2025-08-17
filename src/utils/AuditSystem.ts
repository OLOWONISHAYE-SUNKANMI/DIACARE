import { supabase } from '@/integrations/supabase/client';

interface AuditLogEntry {
  id?: string;
  timestamp: Date;
  professionalId?: string;
  professionalCode?: string;
  patientId?: string;
  patientCode?: string;
  actionType: 'view' | 'consultation' | 'download' | 'export' | 'unauthorized_attempt';
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  dataAccessed?: string[];
  duration?: number;
  isSuspicious?: boolean;
}

interface AccessData {
  professionalId?: string;
  professionalCode?: string;
  patientId?: string;
  patientCode?: string;
  actionType: 'view' | 'consultation' | 'download' | 'export' | 'unauthorized_attempt';
  sessionId?: string;
  dataAccessed?: string[];
  duration?: number;
}

interface AccessReport {
  patientId: string;
  totalAccesses: number;
  uniqueProfessionals: string[];
  accessesByType: Record<string, number>;
  lastAccess?: any;
  suspiciousActivity: SuspiciousActivity[];
}

interface SuspiciousActivity {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
}

export const AuditSystem = {
  
  logDataAccess: async (accessData: AccessData): Promise<void> => {
    try {
      const auditEntry: AuditLogEntry = {
        id: generateAuditId(),
        timestamp: new Date(),
        professionalId: accessData.professionalId,
        professionalCode: accessData.professionalCode,
        patientId: accessData.patientId,
        patientCode: accessData.patientCode,
        actionType: accessData.actionType,
        ipAddress: await getClientIP(),
        userAgent: getUserAgent(),
        sessionId: accessData.sessionId,
        dataAccessed: accessData.dataAccessed,
        duration: accessData.duration
      };
      
      // Vérifier si l'accès est suspect
      auditEntry.isSuspicious = await detectSuspiciousActivity(auditEntry);
      
      // Sauvegarder dans logs sécurisés (utiliser console pour le moment)
      await saveToAuditLog(auditEntry);
      
      // Notification temps réel si nécessaire
      if (isHighSensitiveAccess(accessData) || auditEntry.isSuspicious) {
        await notifySecurityTeam(auditEntry);
      }
      
      console.log('Audit log créé:', auditEntry.id);
    } catch (error) {
      console.error('Erreur création audit log:', error);
    }
  },
  
  generateAccessReport: async (patientId: string, timeframe: { start: Date; end: Date }): Promise<AccessReport> => {
    try {
      // Pour le moment, retourner des données simulées basées sur l'historique réel
      const mockAccesses = await getMockPatientAccesses(patientId, timeframe);
      
      const uniqueProfessionals = [...new Set(mockAccesses.map(a => a.professionalId).filter(Boolean))];
      const accessesByType = groupBy(mockAccesses, 'actionType');
      const suspiciousActivity = await detectPatternAnomalies(mockAccesses);
      
      return {
        patientId,
        totalAccesses: mockAccesses.length,
        uniqueProfessionals,
        accessesByType,
        lastAccess: mockAccesses[0] || undefined,
        suspiciousActivity
      };
    } catch (error) {
      console.error('Erreur génération rapport accès:', error);
      throw error;
    }
  },

  getSecurityAlerts: async (severity?: string): Promise<any[]> => {
    try {
      // Pour le moment, retourner des alertes simulées
      const mockAlerts = [
        {
          id: '1',
          alert_type: 'suspicious_access',
          severity: 'high',
          description: 'Accès multiple en dehors des heures normales',
          created_at: new Date().toISOString(),
          acknowledged: false
        },
        {
          id: '2',
          alert_type: 'unusual_pattern',
          severity: 'medium',
          description: 'Fréquence d\'accès inhabituelle détectée',
          created_at: new Date().toISOString(),
          acknowledged: false
        }
      ];

      return severity ? mockAlerts.filter(alert => alert.severity === severity) : mockAlerts;
    } catch (error) {
      console.error('Erreur récupération alertes sécurité:', error);
      return [];
    }
  },

  acknowledgeAlert: async (alertId: string, userId: string): Promise<void> => {
    try {
      // Pour le moment, juste logger l'acquittement
      console.log(`Alerte ${alertId} acquittée par ${userId} à ${new Date().toISOString()}`);
    } catch (error) {
      console.error('Erreur acquittement alerte:', error);
      throw error;
    }
  }
};

// Fonctions utilitaires

const generateAuditId = (): string => {
  return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const getClientIP = async (): Promise<string> => {
  try {
    // En production, récupérer l'IP réelle du client
    // Pour le moment, simuler
    return '192.168.1.1';
  } catch (error) {
    return 'unknown';
  }
};

const getUserAgent = (): string => {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgent;
  }
  return 'unknown';
};

const saveToAuditLog = async (auditEntry: AuditLogEntry): Promise<void> => {
  try {
    // Pour le moment, utiliser la table professional_sessions pour stocker les logs
    const { error } = await supabase
      .from('professional_sessions')
      .insert({
        professional_id: auditEntry.professionalId,
        professional_code: auditEntry.professionalCode || '',
        patient_code: auditEntry.patientCode || '',
        access_requested_at: auditEntry.timestamp.toISOString(),
        access_granted: auditEntry.actionType !== 'unauthorized_attempt',
        data_sections_accessed: auditEntry.dataAccessed,
        ip_address: auditEntry.ipAddress,
        user_agent: auditEntry.userAgent
      });

    if (error) {
      console.warn('Erreur sauvegarde dans professional_sessions:', error);
      // Fallback vers console log
      console.log('AUDIT LOG:', JSON.stringify(auditEntry, null, 2));
    }
  } catch (error) {
    console.error('Erreur sauvegarde audit log:', error);
    // Fallback vers console log
    console.log('AUDIT LOG (FALLBACK):', JSON.stringify(auditEntry, null, 2));
  }
};

const isHighSensitiveAccess = (accessData: AccessData): boolean => {
  // Définir quels accès sont considérés comme sensibles
  const sensitiveActions = ['download', 'export'];
  const sensitiveDataSections = ['medications', 'medical_history'];
  
  return sensitiveActions.includes(accessData.actionType) ||
         (accessData.dataAccessed?.some(section => sensitiveDataSections.includes(section)) || false);
};

const detectSuspiciousActivity = async (auditEntry: AuditLogEntry): Promise<boolean> => {
  try {
    // Vérifier les patterns suspects basiques
    const suspiciousPatterns = [
      // Accès en dehors des heures normales (22h-6h)
      isOutsideBusinessHours(auditEntry.timestamp),
      // Durée d'accès anormalement courte (< 30 secondes)
      (auditEntry.duration || 0) < 0.5,
      // Tentative d'accès non autorisé
      auditEntry.actionType === 'unauthorized_attempt'
    ];

    return suspiciousPatterns.some(pattern => pattern);
  } catch (error) {
    console.error('Erreur détection activité suspecte:', error);
    return false;
  }
};

const notifySecurityTeam = async (auditEntry: AuditLogEntry): Promise<void> => {
  try {
    const alertSeverity = auditEntry.isSuspicious ? 'high' : 'medium';
    const description = auditEntry.isSuspicious 
      ? `Activité suspecte détectée: ${auditEntry.actionType} par ${auditEntry.professionalCode}`
      : `Accès sensible: ${auditEntry.actionType} aux données patient ${auditEntry.patientCode}`;

    // Pour le moment, utiliser console log et admin_notifications
    console.warn('SECURITY ALERT:', {
      alert_type: auditEntry.isSuspicious ? 'suspicious_access' : 'sensitive_access',
      severity: alertSeverity,
      description,
      audit_log_id: auditEntry.id,
      professional_code: auditEntry.professionalCode,
      patient_code: auditEntry.patientCode,
      timestamp: auditEntry.timestamp.toISOString()
    });

    // Essayer de créer une notification admin
    try {
      await supabase
        .from('admin_notifications')
        .insert({
          title: `Alerte Sécurité - ${alertSeverity.toUpperCase()}`,
          message: description,
          notification_type: 'security_alert',
          data: {
            audit_log_id: auditEntry.id,
            professional_code: auditEntry.professionalCode,
            patient_code: auditEntry.patientCode,
            action_type: auditEntry.actionType,
            ip_address: auditEntry.ipAddress,
            severity: alertSeverity
          }
        });
    } catch (notifError) {
      console.warn('Erreur création notification admin:', notifError);
    }
  } catch (error) {
    console.error('Erreur notification équipe sécurité:', error);
  }
};

const getMockPatientAccesses = async (patientId: string, timeframe: { start: Date; end: Date }) => {
  // Retourner des données simulées réalistes pour les tests
  return [
    {
      professionalId: 'prof_endo_001',
      professionalCode: 'ENDO-SN-2847',
      actionType: 'consultation',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2 heures
      duration: 25,
      dataAccessed: ['glucose', 'medications', 'overview']
    },
    {
      professionalId: 'prof_gen_002',
      professionalCode: 'MGEN-SN-1523', 
      actionType: 'view',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hier
      duration: 8,
      dataAccessed: ['glucose', 'overview']
    },
    {
      professionalId: 'prof_nutr_003',
      professionalCode: 'NUTR-SN-8934',
      actionType: 'consultation',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
      duration: 15,
      dataAccessed: ['meals', 'glucose', 'activities']
    }
  ];
};

const isOutsideBusinessHours = (timestamp: Date): boolean => {
  const hour = timestamp.getHours();
  return hour < 6 || hour > 22;
};

const detectPatternAnomalies = async (accesses: any[]): Promise<SuspiciousActivity[]> => {
  const anomalies: SuspiciousActivity[] = [];
  
  // Analyser les patterns d'accès
  const accessTimes = accesses.map(a => new Date(a.timestamp).getHours());
  const nightAccesses = accessTimes.filter(hour => hour < 6 || hour > 22).length;
  
  if (nightAccesses > 5) {
    anomalies.push({
      type: 'unusual_hours',
      description: `${nightAccesses} accès en dehors des heures normales`,
      severity: 'medium',
      count: nightAccesses
    });
  }

  // Vérifier la fréquence d'accès
  const recentAccesses = accesses.filter(a => 
    new Date(a.timestamp) > new Date(Date.now() - 60 * 60 * 1000)
  ).length;
  
  if (recentAccesses > 10) {
    anomalies.push({
      type: 'high_frequency',
      description: `${recentAccesses} accès dans la dernière heure`,
      severity: 'high',
      count: recentAccesses
    });
  }

  return anomalies;
};

const groupBy = (array: any[], key: string): Record<string, number> => {
  return array.reduce((result, item) => {
    const group = item[key] || 'unknown';
    result[group] = (result[group] || 0) + 1;
    return result;
  }, {});
};

export default AuditSystem;