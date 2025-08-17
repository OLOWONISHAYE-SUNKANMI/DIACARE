import { supabase } from "@/integrations/supabase/client";

export interface ProfessionalData {
  type: string;
  country: string;
  registrationNumber?: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CodeData {
  code: string;
  qrCode: string;
  issuedDate: Date;
  expiryDate: Date;
}

export interface ProfessionalCredentials {
  identificationCode: string;
  qrCode: string;
  codeIssuedDate: Date;
  codeExpiryDate: Date;
  status: 'verified' | 'pending' | 'expired';
  accessLevel: 'full' | 'limited' | 'none';
}

export const ProfessionalCodeGenerator = {
  
  generateProfessionalCode: (professionalData: ProfessionalData): CodeData => {
    const { type, country } = professionalData;
    
    // Format: TYPE-PAYS-XXXX (ex: ENDO-SN-2847)
    const typePrefix: Record<string, string> = {
      'endocrinologist': 'ENDO',
      'psychologist': 'PSYC', 
      'nutritionist': 'NUTR',
      'nurse': 'NURS',
      'doctor': 'DOCT',
      'pharmacist': 'PHAR',
      'diabetologist': 'DIAB'
    };
    
    const prefix = typePrefix[type.toLowerCase()] || 'PROF';
    const countryCode = country.toUpperCase().substring(0, 2);
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    const professionalCode = `${prefix}-${countryCode}-${uniqueNumber}`;
    
    const qrCodeData = {
      code: professionalCode,
      type: type,
      country: country,
      issuedDate: new Date().toISOString()
    };
    
    return {
      code: professionalCode,
      qrCode: `dare://verify/${btoa(JSON.stringify(qrCodeData))}`,
      issuedDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 an
    };
  },
  
  saveProfessionalCredentials: async (professionalId: string, codeData: CodeData): Promise<boolean> => {
    try {
      console.log(`💾 Sauvegarde credentials pour professionnel: ${professionalId}`);
      
      // Mettre à jour la table professional_codes
      const { error: codeError } = await supabase
        .from('professional_codes')
        .update({
          code: codeData.code,
          generated_at: codeData.issuedDate.toISOString(),
          expires_at: codeData.expiryDate.toISOString(),
          is_active: true
        })
        .eq('professional_id', professionalId);

      if (codeError) {
        console.error('Erreur mise à jour professional_codes:', codeError);
        throw codeError;
      }

      // Mettre à jour la table professional_applications
      const { error: appError } = await supabase
        .from('professional_applications')
        .update({
          professional_code: codeData.code,
          code_issued_at: codeData.issuedDate.toISOString(),
          code_expires_at: codeData.expiryDate.toISOString(),
          status: 'approved'
        })
        .eq('id', professionalId);

      if (appError) {
        console.error('Erreur mise à jour professional_applications:', appError);
        throw appError;
      }

      // Envoyer les credentials par email
      await ProfessionalCodeGenerator.sendCredentialsEmail(professionalId, codeData);
      
      console.log(`✅ Credentials sauvegardées avec succès pour: ${professionalId}`);
      return true;
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde credentials:', error);
      return false;
    }
  },

  sendCredentialsEmail: async (professionalId: string, codeData: CodeData): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-professional-credentials', {
        body: {
          professionalId,
          code: codeData.code,
          qrCode: codeData.qrCode,
          expiryDate: codeData.expiryDate.toISOString()
        }
      });

      if (error) {
        console.error('Erreur envoi email credentials:', error);
        return false;
      }

      console.log('✅ Email credentials envoyé avec succès');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  },

  verifyProfessionalCode: async (code: string): Promise<{
    isValid: boolean;
    professional?: any;
    error?: string;
  }> => {
    try {
      const { data, error } = await supabase
        .from('professional_codes')
        .select(`
          *,
          professional_applications!inner(
            id,
            first_name,
            last_name,
            email,
            professional_type,
            status
          )
        `)
        .eq('code', code)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        return { isValid: false, error: error.message };
      }

      if (!data) {
        return { isValid: false, error: 'Code professionnel introuvable' };
      }

      // Vérifier l'expiration
      const now = new Date();
      const expiryDate = new Date(data.expires_at);
      
      if (now > expiryDate) {
        return { isValid: false, error: 'Code professionnel expiré' };
      }

      return {
        isValid: true,
        professional: {
          id: data.professional_id,
          code: data.code,
          name: `${data.professional_applications.first_name} ${data.professional_applications.last_name}`,
          email: data.professional_applications.email,
          type: data.professional_applications.professional_type,
          specialty: data.specialty,
          expiresAt: data.expires_at
        }
      };

    } catch (error) {
      console.error('❌ Erreur vérification code:', error);
      return { isValid: false, error: 'Erreur lors de la vérification' };
    }
  },

  generatePatientAccessCode: async (userId: string): Promise<string | null> => {
    try {
      // Vérifier si l'utilisateur a déjà un code actif
      const { data: existingCode } = await supabase
        .from('patient_access_codes')
        .select('access_code, expires_at')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (existingCode && new Date(existingCode.expires_at) > new Date()) {
        console.log('Code patient existant encore valide');
        return existingCode.access_code;
      }

      // Générer un nouveau code patient (6 caractères)
      const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Désactiver les anciens codes
      await supabase
        .from('patient_access_codes')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Créer le nouveau code
      const { data, error } = await supabase
        .from('patient_access_codes')
        .insert({
          user_id: userId,
          access_code: accessCode,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur création code patient:', error);
        return null;
      }

      console.log(`✅ Code patient généré: ${accessCode}`);
      return accessCode;

    } catch (error) {
      console.error('❌ Erreur génération code patient:', error);
      return null;
    }
  },

  requestPatientDataAccess: async (
    professionalCode: string, 
    patientCode: string,
    requestedSections: string[] = ['glucose', 'medications', 'meals', 'activities'],
    maxConsultations: number = 1
  ): Promise<{
    success: boolean;
    permissionId?: string;
    error?: string;
  }> => {
    try {
      const { data, error } = await supabase.rpc('request_patient_permission', {
        patient_code_param: patientCode,
        professional_code_param: professionalCode,
        requested_sections: requestedSections,
        max_consultations_param: maxConsultations,
        validity_days: 30
      });

      if (error) {
        console.error('Erreur demande accès patient:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Demande d'accès créée: ${data}`);
      return { success: true, permissionId: data };

    } catch (error) {
      console.error('❌ Erreur demande accès:', error);
      return { success: false, error: 'Erreur lors de la demande d\'accès' };
    }
  },

  approvePatientDataAccess: async (
    permissionId: string,
    approve: boolean,
    allowedSections?: string[]
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('respond_to_permission_request', {
        permission_id_param: permissionId,
        approve: approve,
        allowed_sections: allowedSections
      });

      if (error) {
        console.error('Erreur réponse permission:', error);
        return false;
      }

      console.log(`✅ Permission ${approve ? 'approuvée' : 'refusée'}: ${permissionId}`);
      return true;

    } catch (error) {
      console.error('❌ Erreur approbation permission:', error);
      return false;
    }
  },

  getPatientAccessRequests: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('patient_access_permissions')
        .select(`
          id,
          professional_code,
          allowed_data_sections,
          max_consultations,
          used_consultations,
          permission_status,
          created_at,
          expires_at
        `)
        .eq('patient_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération demandes:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('❌ Erreur récupération demandes:', error);
      return [];
    }
  }
};

export default ProfessionalCodeGenerator;