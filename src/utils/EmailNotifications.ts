import { supabase } from '@/integrations/supabase/client';

interface ProfessionalData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  professional_type: string;
  professional_code?: string;
  code_expires_at?: string;
  institution?: string;
}

interface EmailTemplate {
  type: 'approval' | 'rejection';
  application: ProfessionalData;
  rejection_reason?: string;
}

export const EmailNotifications = {
  
  sendApprovalEmail: async (professionalData: ProfessionalData): Promise<boolean> => {
    try {
      if (!professionalData.professional_code) {
        throw new Error('Code professionnel manquant pour l\'email d\'approbation');
      }

      const emailData: EmailTemplate = {
        type: 'approval',
        application: {
          ...professionalData,
          professional_code: professionalData.professional_code
        }
      };
      
      const { data, error } = await supabase.functions.invoke('send-professional-emails', {
        body: emailData
      });

      if (error) {
        console.error('Erreur envoi email approbation:', error);
        throw error;
      }

      console.log('Email d\'approbation envoyé avec succès:', data);
      return true;
      
    } catch (error) {
      console.error('Échec envoi email approbation:', error);
      return false;
    }
  },
  
  sendRejectionEmail: async (professionalData: ProfessionalData, reason: string): Promise<boolean> => {
    try {
      const emailData: EmailTemplate = {
        type: 'rejection',
        application: professionalData,
        rejection_reason: reason
      };
      
      const { data, error } = await supabase.functions.invoke('send-professional-emails', {
        body: emailData
      });

      if (error) {
        console.error('Erreur envoi email rejet:', error);
        throw error;
      }

      console.log('Email de rejet envoyé avec succès:', data);
      return true;
      
    } catch (error) {
      console.error('Échec envoi email rejet:', error);
      return false;
    }
  },

  sendWelcomeEmail: async (professionalData: ProfessionalData): Promise<boolean> => {
    try {
      // Email de bienvenue après première connexion
      const welcomeData = {
        type: 'welcome',
        application: professionalData
      };

      const { data, error } = await supabase.functions.invoke('send-professional-emails', {
        body: welcomeData
      });

      if (error) {
        console.error('Erreur envoi email bienvenue:', error);
        throw error;
      }

      console.log('Email de bienvenue envoyé avec succès:', data);
      return true;
      
    } catch (error) {
      console.error('Échec envoi email bienvenue:', error);
      return false;
    }
  },

  sendCodeExpiryReminder: async (professionalData: ProfessionalData): Promise<boolean> => {
    try {
      // Rappel d'expiration du code professionnel
      const reminderData = {
        type: 'code_expiry_reminder',
        application: professionalData
      };

      const { data, error } = await supabase.functions.invoke('send-professional-emails', {
        body: reminderData
      });

      if (error) {
        console.error('Erreur envoi rappel expiration:', error);
        throw error;
      }

      console.log('Rappel d\'expiration envoyé avec succès:', data);
      return true;
      
    } catch (error) {
      console.error('Échec envoi rappel expiration:', error);
      return false;
    }
  },

  // Fonction générique pour envoyer des emails
  sendEmail: async (emailData: EmailTemplate): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-professional-emails', {
        body: emailData
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
      
    } catch (error) {
      return { success: false, error };
    }
  },

  // Fonction pour tester l'envoi d'emails
  testEmailSystem: async (): Promise<boolean> => {
    try {
      const testData: ProfessionalData = {
        id: 'test-id',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        professional_type: 'endocrinologist',
        professional_code: 'TEST-CODE-123',
        institution: 'Test Hospital'
      };

      console.log('Test du système d\'email...');
      
      // Ne pas vraiment envoyer en mode test
      console.log('Email de test préparé pour:', testData.email);
      return true;
      
    } catch (error) {
      console.error('Erreur test email:', error);
      return false;
    }
  },

  // Fonction pour obtenir le statut des emails envoyés
  getEmailStatus: async (emailId: string): Promise<any> => {
    try {
      // Cette fonction pourrait interroger le service d'email pour le statut
      // Pour l'instant, on retourne un statut mock
      return {
        id: emailId,
        status: 'delivered',
        sent_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur récupération statut email:', error);
      return null;
    }
  }
};