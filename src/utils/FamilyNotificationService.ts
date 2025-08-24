// Simplified family notification service for now
export interface FamilyMember {
  id: string;
  user_id: string;
  family_member_email: string;
  family_member_name: string;
  relationship: 'parent' | 'conjoint' | 'enfant' | 'frere_soeur' | 'ami' | 'autre';
  notification_preferences: {
    hypoglycemia: boolean;
    hyperglycemia: boolean;
    medication_missed: boolean;
    emergency_only: boolean;
  };
  is_active: boolean;
}

export interface FamilyAlert {
  id: string;
  patient_id: string;
  family_member_id: string;
  alert_type: 'hypoglycemia_risk' | 'hyperglycemia_risk' | 'medication_reminder' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  patient_data: {
    glucose_value?: number;
    predicted_time?: number;
    risk_score?: number;
  };
  sent_at: Date;
  acknowledged_at?: Date;
}

class FamilyNotificationService {
  private familyMembers: FamilyMember[] = [];
  private alerts: FamilyAlert[] = [];

  // Get family members for current user (simplified - using localStorage for now)
  async getFamilyMembers(userId: string): Promise<FamilyMember[]> {
    try {
      const stored = localStorage.getItem(`family_members_${userId}`);
      this.familyMembers = stored ? JSON.parse(stored) : [];
      return this.familyMembers;
    } catch (error) {
      console.error('Error fetching family members:', error);
      return [];
    }
  }

  // Add family member (simplified)
  async addFamilyMember(userId: string, memberData: Omit<FamilyMember, 'id' | 'user_id' | 'is_active'>): Promise<void> {
    try {
      const newMember: FamilyMember = {
        ...memberData,
        id: Date.now().toString(),
        user_id: userId,
        is_active: true
      };
      
      this.familyMembers.push(newMember);
      localStorage.setItem(`family_members_${userId}`, JSON.stringify(this.familyMembers));
    } catch (error) {
      console.error('Error adding family member:', error);
      throw error;
    }
  }

  // Send alert to family members
  async sendFamilyAlert(
    patientId: string,
    alertType: FamilyAlert['alert_type'],
    severity: FamilyAlert['severity'],
    message: string,
    patientData: FamilyAlert['patient_data']
  ): Promise<void> {
    try {
      // Get family members for this patient
      const familyMembers = await this.getFamilyMembers(patientId);
      
      // Filter family members based on notification preferences
      const eligibleMembers = familyMembers.filter(member => {
        const prefs = member.notification_preferences;
        
        if (prefs.emergency_only && severity !== 'critical') {
          return false;
        }
        
        switch (alertType) {
          case 'hypoglycemia_risk':
            return prefs.hypoglycemia;
          case 'hyperglycemia_risk':
            return prefs.hyperglycemia;
          case 'medication_reminder':
            return prefs.medication_missed;
          case 'emergency':
            return true;
          default:
            return false;
        }
      });

      // Send alerts to eligible family members
      const alertPromises = eligibleMembers.map(async (member) => {
        const alert: Omit<FamilyAlert, 'id'> = {
          patient_id: patientId,
          family_member_id: member.id,
          alert_type: alertType,
          severity,
          message,
          patient_data: patientData,
          sent_at: new Date()
        };

        // Save alert to database
        const { error } = await supabase
          .from('family_alerts')
          .insert(alert);

        if (error) throw error;

        // Send real-time notification via email (using edge function)
        await this.sendEmailNotification(member, alert);
        
        // Send push notification if available
        await this.sendPushNotification(member, alert);
      });

      await Promise.all(alertPromises);
      
    } catch (error) {
      console.error('Error sending family alerts:', error);
    }
  }

  // Send email notification
  private async sendEmailNotification(familyMember: FamilyMember, alert: Omit<FamilyAlert, 'id'>): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-family-notification', {
        body: {
          to: familyMember.family_member_email,
          name: familyMember.family_member_name,
          alert_type: alert.alert_type,
          severity: alert.severity,
          message: alert.message,
          patient_data: alert.patient_data,
          relationship: familyMember.relationship
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Send push notification (placeholder for future implementation)
  private async sendPushNotification(familyMember: FamilyMember, alert: Omit<FamilyAlert, 'id'>): Promise<void> {
    // TODO: Implement push notifications using service worker
    console.log('Push notification would be sent to:', familyMember.family_member_name);
  }

  // Get alerts for family member
  async getFamilyAlerts(familyMemberId: string): Promise<FamilyAlert[]> {
    try {
      const { data, error } = await supabase
        .from('family_alerts')
        .select('*')
        .eq('family_member_id', familyMemberId)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      return data as FamilyAlert[];
    } catch (error) {
      console.error('Error fetching family alerts:', error);
      return [];
    }
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('family_alerts')
        .update({ acknowledged_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  }

  // Emergency alert (highest priority)
  async sendEmergencyAlert(
    patientId: string,
    emergencyType: 'severe_hypoglycemia' | 'severe_hyperglycemia' | 'no_response' | 'medical_emergency',
    currentGlucose?: number,
    location?: { latitude: number; longitude: number }
  ): Promise<void> {
    const emergencyMessages = {
      severe_hypoglycemia: `🚨 URGENCE: Hypoglycémie sévère détectée (${currentGlucose}mg/dL). Intervention immédiate requise.`,
      severe_hyperglycemia: `🚨 URGENCE: Hyperglycémie critique (${currentGlucose}mg/dL). Risque d'acidocétose.`,
      no_response: `🚨 URGENCE: Patient ne répond plus aux alertes depuis 30 minutes.`,
      medical_emergency: `🚨 URGENCE MÉDICALE: Le patient a activé l'alerte d'urgence.`
    };

    await this.sendFamilyAlert(
      patientId,
      'emergency',
      'critical',
      emergencyMessages[emergencyType],
      {
        glucose_value: currentGlucose,
        risk_score: 100,
        predicted_time: 0
      }
    );

    // Additional emergency actions
    if (location) {
      await this.sendLocationAlert(patientId, location);
    }
  }

  // Send location in case of emergency
  private async sendLocationAlert(patientId: string, location: { latitude: number; longitude: number }): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-emergency-location', {
        body: {
          patient_id: patientId,
          location: location,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending location alert:', error);
    }
  }
}

export const familyNotificationService = new FamilyNotificationService();