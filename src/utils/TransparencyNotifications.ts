import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: string;
  name: string;
  type: string;
  identificationCode: string;
  institution?: string;
  email?: string;
}

interface NotificationAction {
  id: string;
  label: string;
  url?: string;
}

interface DataAccessNotification {
  type: 'data_access';
  title: string;
  message: string;
  timestamp: Date;
  professionalInfo: {
    name: string;
    type: string;
    code: string;
    institution?: string;
  };
  actions: NotificationAction[];
}

interface WeeklySummaryNotification {
  type: 'weekly_summary';
  title: string;
  message: string;
  details: Array<{
    professional: string;
    date: string;
    type: string;
  }>;
}

interface WeeklyAccess {
  id: string;
  professionalName: string;
  professionalType: string;
  date: string;
  actionType: string;
  duration: number;
  dataAccessed: string[];
}

export const TransparencyNotifications = {
  
  notifyPatientAccess: async (patientId: string, professional: Professional): Promise<void> => {
    try {
      const notification: DataAccessNotification = {
        type: 'data_access',
        title: '👀 Accès à vos données médicales',
        message: `Dr. ${professional.name} (${professional.type}) a consulté vos données DARE`,
        timestamp: new Date(),
        professionalInfo: {
          name: professional.name,
          type: professional.type,
          code: professional.identificationCode,
          institution: professional.institution
        },
        actions: [
          { id: 'view_details', label: 'Voir détails', url: '/access-history' },
          { id: 'contact_professional', label: 'Contacter' },
          { id: 'report_concern', label: 'Signaler' }
        ]
      };
      
      await sendNotificationToPatient(patientId, notification);
      await sendEmailNotification(patientId, notification);
      
      console.log(`Notification d'accès envoyée au patient ${patientId}`);
    } catch (error) {
      console.error('Erreur envoi notification accès:', error);
    }
  },
  
  sendWeeklyAccessSummary: async (patientId: string): Promise<void> => {
    try {
      const weeklyAccesses = await getWeeklyAccesses(patientId);
      
      if (weeklyAccesses.length > 0) {
        const summary: WeeklySummaryNotification = {
          type: 'weekly_summary',
          title: '📊 Résumé hebdomadaire - Accès données',
          message: `${weeklyAccesses.length} accès à vos données cette semaine`,
          details: weeklyAccesses.map(access => ({
            professional: access.professionalName,
            date: new Date(access.date).toLocaleDateString('fr-FR'),
            type: access.actionType === 'consultation' ? 'Consultation' : 'Consultation données'
          }))
        };
        
        await sendNotificationToPatient(patientId, summary);
        await sendWeeklyEmailSummary(patientId, weeklyAccesses);
        
        console.log(`Résumé hebdomadaire envoyé au patient ${patientId}`);
      }
    } catch (error) {
      console.error('Erreur envoi résumé hebdomadaire:', error);
    }
  },

  sendUnauthorizedAccessAlert: async (patientId: string, details: any): Promise<void> => {
    try {
      const alert = {
        type: 'security_alert',
        title: '🚨 Tentative d\'accès non autorisé',
        message: 'Une tentative d\'accès non autorisé à vos données a été détectée et bloquée',
        timestamp: new Date(),
        severity: 'high',
        details: {
          attemptTime: details.timestamp,
          professionalCode: details.professionalCode,
          ipAddress: details.ipAddress
        },
        actions: [
          { id: 'view_security', label: 'Voir sécurité', url: '/security' },
          { id: 'contact_support', label: 'Contacter support' }
        ]
      };

      await sendNotificationToPatient(patientId, alert);
      await sendSecurityAlertEmail(patientId, alert);
      
      console.log(`Alerte sécurité envoyée au patient ${patientId}`);
    } catch (error) {
      console.error('Erreur envoi alerte sécurité:', error);
    }
  },

  scheduleWeeklySummaries: async (): Promise<void> => {
    try {
      // Récupérer tous les patients actifs
      const { data: patients, error } = await supabase
        .from('patient_access_codes')
        .select('user_id')
        .eq('is_active', true);

      if (error) throw error;

      if (patients) {
        for (const patient of patients) {
          await TransparencyNotifications.sendWeeklyAccessSummary(patient.user_id);
          // Attendre 1 seconde entre chaque envoi pour éviter le spam
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Erreur programmation résumés hebdomadaires:', error);
    }
  }
};

// Fonctions utilitaires

const sendNotificationToPatient = async (patientId: string, notification: any): Promise<void> => {
  try {
    // Créer une notification dans la base de données
    const { error } = await supabase
      .from('admin_notifications')
      .insert({
        title: notification.title,
        message: notification.message,
        notification_type: notification.type,
        data: {
          professionalInfo: notification.professionalInfo,
          actions: notification.actions,
          details: notification.details,
          timestamp: notification.timestamp?.toISOString()
        }
      });

    if (error) {
      console.warn('Erreur création notification DB:', error);
    }

    // Envoyer notification en temps réel via WebSocket
    await sendRealtimeNotification(patientId, notification);
  } catch (error) {
    console.error('Erreur envoi notification patient:', error);
  }
};

const sendRealtimeNotification = async (patientId: string, notification: any): Promise<void> => {
  try {
    // Utiliser Supabase Realtime pour envoyer la notification
    const channel = supabase.channel(`patient_${patientId}`);
    
    await channel
      .send({
        type: 'broadcast',
        event: 'notification',
        payload: notification
      });
      
    console.log(`Notification temps réel envoyée au patient ${patientId}`);
  } catch (error) {
    console.error('Erreur notification temps réel:', error);
  }
};

const sendEmailNotification = async (patientId: string, notification: DataAccessNotification): Promise<void> => {
  try {
    // Récupérer l'email du patient
    const patientEmail = await getPatientEmail(patientId);
    
    if (!patientEmail) {
      console.warn('Email patient non trouvé pour:', patientId);
      return;
    }

    // Appeler l'edge function pour envoyer l'email
    const { error } = await supabase.functions.invoke('send-transparency-notification', {
      body: {
        to: patientEmail,
        type: 'data_access',
        data: {
          professionalName: notification.professionalInfo.name,
          professionalType: notification.professionalInfo.type,
          professionalCode: notification.professionalInfo.code,
          institution: notification.professionalInfo.institution,
          timestamp: notification.timestamp.toISOString(),
          actions: notification.actions
        }
      }
    });

    if (error) {
      console.error('Erreur envoi email notification:', error);
    }
  } catch (error) {
    console.error('Erreur envoi email notification:', error);
  }
};

const sendWeeklyEmailSummary = async (patientId: string, weeklyAccesses: WeeklyAccess[]): Promise<void> => {
  try {
    const patientEmail = await getPatientEmail(patientId);
    
    if (!patientEmail) {
      console.warn('Email patient non trouvé pour:', patientId);
      return;
    }

    const { error } = await supabase.functions.invoke('send-transparency-notification', {
      body: {
        to: patientEmail,
        type: 'weekly_summary',
        data: {
          accessCount: weeklyAccesses.length,
          accesses: weeklyAccesses.map(access => ({
            professionalName: access.professionalName,
            professionalType: access.professionalType,
            date: access.date,
            actionType: access.actionType,
            duration: access.duration,
            dataAccessed: access.dataAccessed
          })),
          weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          weekEnd: new Date().toISOString()
        }
      }
    });

    if (error) {
      console.error('Erreur envoi email résumé:', error);
    }
  } catch (error) {
    console.error('Erreur envoi email résumé:', error);
  }
};

const sendSecurityAlertEmail = async (patientId: string, alert: any): Promise<void> => {
  try {
    const patientEmail = await getPatientEmail(patientId);
    
    if (!patientEmail) {
      console.warn('Email patient non trouvé pour:', patientId);
      return;
    }

    const { error } = await supabase.functions.invoke('send-transparency-notification', {
      body: {
        to: patientEmail,
        type: 'security_alert',
        data: {
          alertType: alert.type,
          severity: alert.severity,
          details: alert.details,
          timestamp: alert.timestamp.toISOString(),
          actions: alert.actions
        }
      }
    });

    if (error) {
      console.error('Erreur envoi email alerte sécurité:', error);
    }
  } catch (error) {
    console.error('Erreur envoi email alerte sécurité:', error);
  }
};

const getPatientEmail = async (patientId: string): Promise<string | null> => {
  try {
    // Récupérer l'email depuis la table auth.users via le user_id
    const { data, error } = await supabase
      .from('patient_access_codes')
      .select('user_id')
      .eq('user_id', patientId)
      .single();

    if (error || !data) {
      return null;
    }

    // Pour le moment, retourner un email simulé
    // En production, récupérer depuis auth.users
    return 'patient@example.com';
  } catch (error) {
    console.error('Erreur récupération email patient:', error);
    return null;
  }
};

const getWeeklyAccesses = async (patientId: string): Promise<WeeklyAccess[]> => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Récupérer les accès de la semaine depuis professional_sessions
    const { data, error } = await supabase
      .from('professional_sessions')
      .select(`
        id,
        professional_code,
        patient_name,
        access_requested_at,
        consultation_duration_minutes,
        data_sections_accessed
      `)
      .eq('access_granted', true)
      .gte('access_requested_at', oneWeekAgo.toISOString())
      .order('access_requested_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération accès hebdomadaires:', error);
      return [];
    }

    // Transformer les données en format WeeklyAccess
    return (data || []).map(session => ({
      id: session.id,
      professionalName: `Dr. ${session.professional_code}`, // Simplification pour le moment
      professionalType: 'Médecin',
      date: session.access_requested_at,
      actionType: session.consultation_duration_minutes ? 'consultation' : 'view',
      duration: session.consultation_duration_minutes || 0,
      dataAccessed: session.data_sections_accessed || []
    }));
  } catch (error) {
    console.error('Erreur récupération accès hebdomadaires:', error);
    return [];
  }
};

export default TransparencyNotifications;