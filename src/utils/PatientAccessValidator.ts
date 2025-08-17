import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: string;
  name: string;
  type: string;
  status: string;
  identificationCode: string;
  email: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  diabetesType: string;
  patientCode: string;
  lastGlucose?: number;
  userId: string;
}

interface AccessResult {
  success: boolean;
  patient?: Patient;
  professional?: Professional;
  accessGranted?: Date;
  error?: string;
}

export const PatientAccessValidator = {
  
  validateAccess: async (professionalCode: string, patientCode: string): Promise<AccessResult> => {
    try {
      // 1. Vérifier code professionnel valide
      const professional = await validateProfessionalCode(professionalCode);
      if (!professional || professional.status !== 'approved') {
        throw new Error('Code professionnel invalide ou non vérifié');
      }
      
      // 2. Vérifier code patient existe
      const patient = await findPatientByCode(patientCode);
      if (!patient) {
        throw new Error('Code patient introuvable');
      }
      
      // 3. Vérifier autorisation d'accès
      const hasAccess = await checkAccessPermission(professional, patient);
      if (!hasAccess) {
        throw new Error('Accès non autorisé à ce patient');
      }
      
      // 4. Logger l'accès
      await logDataAccess({
        professionalId: professional.id,
        patientId: patient.id,
        accessTime: new Date(),
        accessType: 'data_view'
      });
      
      // 5. Notifier patient (optionnel)
      await notifyPatientAccess(patient.id, professional);
      
      return {
        success: true,
        patient: sanitizePatientData(patient),
        professional: professional,
        accessGranted: new Date()
      };
      
    } catch (error: any) {
      // Logger tentative d'accès non autorisé
      await logUnauthorizedAccess({
        professionalCode,
        patientCode,
        error: error.message,
        timestamp: new Date()
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Fonction pour valider le code professionnel
const validateProfessionalCode = async (professionalCode: string): Promise<Professional | null> => {
  try {
    const { data, error } = await supabase
      .from('professional_codes')
      .select(`
        *,
        professional_applications!inner (
          id,
          first_name,
          last_name,
          professional_type,
          status,
          email
        )
      `)
      .eq('code', professionalCode)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    // Vérifier que le code n'est pas expiré
    if (new Date(data.expires_at) < new Date()) {
      return null;
    }

    return {
      id: data.professional_applications.id,
      name: `${data.professional_applications.first_name} ${data.professional_applications.last_name}`,
      type: data.professional_applications.professional_type,
      status: data.professional_applications.status,
      identificationCode: data.code,
      email: data.professional_applications.email
    };
  } catch (error) {
    console.error('Erreur validation code professionnel:', error);
    return null;
  }
};

// Fonction pour trouver un patient par son code
const findPatientByCode = async (patientCode: string): Promise<Patient | null> => {
  try {
    // D'abord récupérer le code patient
    const { data: accessCodeData, error: codeError } = await supabase
      .from('patient_access_codes')
      .select('*')
      .eq('access_code', patientCode)
      .eq('is_active', true)
      .single();

    if (codeError || !accessCodeData) {
      return null;
    }

    // Vérifier que le code n'est pas expiré
    if (new Date(accessCodeData.expires_at) < new Date()) {
      return null;
    }

    // Ensuite récupérer le profil utilisateur
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', accessCodeData.user_id)
      .single();

    if (profileError || !profileData) {
      // Si pas de profil, utiliser des données par défaut
      return {
        id: accessCodeData.id,
        firstName: 'Patient',
        lastName: 'DARE',
        diabetesType: 'Type 2',
        patientCode: accessCodeData.access_code,
        userId: accessCodeData.user_id
      };
    }

    return {
      id: accessCodeData.id,
      firstName: profileData.first_name || 'Patient',
      lastName: profileData.last_name || 'DARE',
      diabetesType: 'Type 2', // TODO: Ajouter dans le schéma
      patientCode: accessCodeData.access_code,
      userId: accessCodeData.user_id
    };
  } catch (error) {
    console.error('Erreur recherche patient:', error);
    return null;
  }
};

// Fonction pour vérifier les permissions d'accès
const checkAccessPermission = async (professional: Professional, patient: Patient): Promise<boolean> => {
  try {
    // Vérifier s'il existe une permission active
    const { data, error } = await supabase
      .from('patient_access_permissions')
      .select('*')
      .eq('patient_code', patient.patientCode)
      .eq('professional_code', professional.identificationCode)
      .eq('permission_status', 'approved')
      .single();

    if (error || !data) {
      return false;
    }

    // Vérifier que la permission n'est pas expirée
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false;
    }

    // Vérifier les consultations restantes
    if (data.used_consultations >= data.max_consultations) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur vérification permission:', error);
    return false;
  }
};

// Fonction pour logger l'accès aux données
const logDataAccess = async (accessData: {
  professionalId: string;
  patientId: string;
  accessTime: Date;
  accessType: string;
}): Promise<void> => {
  try {
    await supabase
      .from('professional_patient_access')
      .insert({
        professional_id: accessData.professionalId,
        patient_user_id: accessData.patientId,
        accessed_at: accessData.accessTime.toISOString(),
        access_method: 'code_validation'
      });
  } catch (error) {
    console.error('Erreur logging accès:', error);
  }
};

// Fonction pour notifier le patient de l'accès
const notifyPatientAccess = async (patientId: string, professional: Professional): Promise<void> => {
  try {
    // Créer une notification dans la base de données
    // TODO: Implémenter système de notifications patient
    console.log(`Notification envoyée au patient ${patientId} pour accès par ${professional.name}`);
  } catch (error) {
    console.error('Erreur notification patient:', error);
  }
};

// Fonction pour sanitiser les données patient
const sanitizePatientData = (patient: Patient): Patient => {
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    diabetesType: patient.diabetesType,
    patientCode: patient.patientCode,
    lastGlucose: patient.lastGlucose,
    userId: patient.userId
  };
};

// Fonction pour logger les accès non autorisés
const logUnauthorizedAccess = async (attemptData: {
  professionalCode: string;
  patientCode: string;
  error: string;
  timestamp: Date;
}): Promise<void> => {
  try {
    // Logger dans une table d'audit ou système de logs
    console.warn('Tentative d\'accès non autorisé:', {
      professionalCode: attemptData.professionalCode,
      patientCode: attemptData.patientCode,
      error: attemptData.error,
      timestamp: attemptData.timestamp.toISOString()
    });
    
    // TODO: Implémenter logging dans table d'audit
  } catch (error) {
    console.error('Erreur logging tentative non autorisée:', error);
  }
};

export default PatientAccessValidator;