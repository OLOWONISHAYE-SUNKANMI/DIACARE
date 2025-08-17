import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  professional_type: string;
  country: string;
  license_number: string;
  institution: string;
}

export const ApplicationManager = {
  
  approveApplication: async (application: Application): Promise<{ success: boolean; professionalCode?: string }> => {
    try {
      // Utiliser la fonction Supabase existante pour approuver
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Appeler la fonction de base de données pour approuver l'application
      const { data, error } = await supabase
        .rpc('approve_professional_application', {
          application_id: application.id,
          reviewer_id: currentUser.user.id
        });

      if (error) throw error;

      // Récupérer les données mises à jour pour obtenir le code
      const { data: updatedApplication, error: fetchError } = await supabase
        .from('professional_applications')
        .select('professional_code')
        .eq('id', application.id)
        .single();

      if (fetchError) throw fetchError;

      // Envoyer l'email d'approbation via edge function
      const { error: emailError } = await supabase.functions.invoke('send-professional-emails', {
        body: {
          type: 'approval',
          application: {
            ...application,
            professional_code: updatedApplication.professional_code
          }
        }
      });

      if (emailError) {
        console.warn('Erreur envoi email:', emailError);
        // Ne pas faire échouer l'approbation si l'email échoue
      }

      toast({
        title: "Candidature approuvée !",
        description: `Code professionnel ${updatedApplication.professional_code} généré et envoyé par email.`,
      });
      
      return { 
        success: true, 
        professionalCode: updatedApplication.professional_code 
      };
      
    } catch (error: any) {
      console.error('Erreur approbation:', error);
      toast({
        title: "Erreur d'approbation",
        description: error.message || "Une erreur est survenue lors de l'approbation",
        variant: "destructive"
      });
      return { success: false };
    }
  },
  
  rejectApplication: async (application: Application, reason: string): Promise<boolean> => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Mettre à jour le statut de rejet
      const { error } = await supabase
        .from('professional_applications')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_by: currentUser.user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (error) throw error;

      // Envoyer l'email de rejet via edge function
      const { error: emailError } = await supabase.functions.invoke('send-professional-emails', {
        body: {
          type: 'rejection',
          application,
          rejection_reason: reason
        }
      });

      if (emailError) {
        console.warn('Erreur envoi email:', emailError);
        // Ne pas faire échouer le rejet si l'email échoue
      }

      toast({
        title: "Candidature rejetée",
        description: "Email de notification envoyé au candidat.",
      });
      
      return true;
      
    } catch (error: any) {
      console.error('Erreur rejet:', error);
      toast({
        title: "Erreur de rejet",
        description: error.message || "Une erreur est survenue lors du rejet",
        variant: "destructive"
      });
      return false;
    }
  },

  generateProfessionalCode: (professionalType: string, country: string): string => {
    const types: Record<string, string> = {
      'endocrinologist': 'ENDO',
      'diabetologist': 'DIAB',
      'psychologist': 'PSYC',
      'nutritionist': 'NUTR',
      'nurse': 'NURS',
      'general_practitioner': 'MGEN',
      'pharmacist': 'PHAR',
      'podiatrist': 'PODO'
    };
    
    // Format: TYPE-PAYS-XXXX
    const type = types[professionalType] || 'PROF';
    const countryCode = country.substring(0, 3).toUpperCase();
    const number = Math.floor(1000 + Math.random() * 9000);
    
    return `${type}-${countryCode}-${number}`;
  },

  getApplicationsByStatus: async (status?: string) => {
    try {
      let query = supabase
        .from('professional_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Erreur récupération candidatures:', error);
      return [];
    }
  },

  getApplicationStats: async () => {
    try {
      const { data, error } = await supabase
        .from('professional_applications')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(app => app.status === 'pending').length,
        approved: data.filter(app => app.status === 'approved').length,
        rejected: data.filter(app => app.status === 'rejected').length
      };

      return stats;
    } catch (error) {
      console.error('Erreur stats candidatures:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }
};