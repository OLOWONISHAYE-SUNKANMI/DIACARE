export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_entries: {
        Row: {
          activity_name: string
          activity_time: string
          activity_type: string
          calories_per_minute: number | null
          created_at: string
          distance_km: number | null
          duration_minutes: number
          heart_rate_avg: number | null
          id: string
          intensity: string
          notes: string | null
          steps_count: number | null
          total_calories_burned: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_name: string
          activity_time?: string
          activity_type: string
          calories_per_minute?: number | null
          created_at?: string
          distance_km?: number | null
          duration_minutes: number
          heart_rate_avg?: number | null
          id?: string
          intensity: string
          notes?: string | null
          steps_count?: number | null
          total_calories_burned?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_name?: string
          activity_time?: string
          activity_type?: string
          calories_per_minute?: number | null
          created_at?: string
          distance_km?: number | null
          duration_minutes?: number
          heart_rate_avg?: number | null
          id?: string
          intensity?: string
          notes?: string | null
          steps_count?: number | null
          total_calories_burned?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          read_at: string | null
          title: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          read_at?: string | null
          title: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          read_at?: string | null
          title?: string
        }
        Relationships: []
      }
      ai_model_parameters: {
        Row: {
          carb_ratio: number | null
          created_at: string
          diabetes_duration_years: number | null
          hba1c_last: number | null
          id: string
          insulin_sensitivity_factor: number | null
          last_calibrated_at: string | null
          model_version: string | null
          target_glucose: number | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          carb_ratio?: number | null
          created_at?: string
          diabetes_duration_years?: number | null
          hba1c_last?: number | null
          id?: string
          insulin_sensitivity_factor?: number | null
          last_calibrated_at?: string | null
          model_version?: string | null
          target_glucose?: number | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          carb_ratio?: number | null
          created_at?: string
          diabetes_duration_years?: number | null
          hba1c_last?: number | null
          id?: string
          insulin_sensitivity_factor?: number | null
          last_calibrated_at?: string | null
          model_version?: string | null
          target_glucose?: number | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      anonymous_community_stats: {
        Row: {
          age_group: string | null
          avg_glucose: number | null
          created_at: string
          diabetes_type: Database["public"]["Enums"]["diabetes_type"] | null
          id: string
          month_year: string | null
          region: string | null
          time_in_range: number | null
        }
        Insert: {
          age_group?: string | null
          avg_glucose?: number | null
          created_at?: string
          diabetes_type?: Database["public"]["Enums"]["diabetes_type"] | null
          id?: string
          month_year?: string | null
          region?: string | null
          time_in_range?: number | null
        }
        Update: {
          age_group?: string | null
          avg_glucose?: number | null
          created_at?: string
          diabetes_type?: Database["public"]["Enums"]["diabetes_type"] | null
          id?: string
          month_year?: string | null
          region?: string | null
          time_in_range?: number | null
        }
        Relationships: []
      }
      challenge_participants: {
        Row: {
          challenge_id: string | null
          completed: boolean | null
          completed_at: string | null
          current_progress: number | null
          id: string
          joined_at: string | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          current_progress?: number | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          current_progress?: number | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          consultation_id: string
          created_at: string
          id: string
          message: string
          sender_id: string
          sender_role: string
          updated_at: string
        }
        Insert: {
          consultation_id: string
          created_at?: string
          id?: string
          message: string
          sender_id: string
          sender_role: string
          updated_at?: string
        }
        Update: {
          consultation_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          sender_role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          challenge_type: Database["public"]["Enums"]["challenge_type"]
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          reward_badge: string | null
          reward_description: string | null
          start_date: string
          target_unit: string | null
          target_value: number | null
          updated_at: string
        }
        Insert: {
          challenge_type: Database["public"]["Enums"]["challenge_type"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          reward_badge?: string | null
          reward_description?: string | null
          start_date: string
          target_unit?: string | null
          target_value?: number | null
          updated_at?: string
        }
        Update: {
          challenge_type?: Database["public"]["Enums"]["challenge_type"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          reward_badge?: string | null
          reward_description?: string | null
          start_date?: string
          target_unit?: string | null
          target_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      community_insights: {
        Row: {
          calculated_for_date: string
          calculation_period: string
          created_at: string
          id: string
          insight_type: string
          insight_value: Json
        }
        Insert: {
          calculated_for_date: string
          calculation_period: string
          created_at?: string
          id?: string
          insight_type: string
          insight_value: Json
        }
        Update: {
          calculated_for_date?: string
          calculation_period?: string
          created_at?: string
          id?: string
          insight_type?: string
          insight_value?: Json
        }
        Relationships: []
      }
      consultation_notes: {
        Row: {
          consultation_id: string | null
          created_at: string | null
          id: string
          next_appointment_date: string | null
          notes: string
          patient_id: string
          professional_id: string
          recommendations: string | null
          updated_at: string | null
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string | null
          id?: string
          next_appointment_date?: string | null
          notes: string
          patient_id: string
          professional_id: string
          recommendations?: string | null
          updated_at?: string | null
        }
        Update: {
          consultation_id?: string | null
          created_at?: string | null
          id?: string
          next_appointment_date?: string | null
          notes?: string
          patient_id?: string
          professional_id?: string
          recommendations?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          consultation_fee: number | null
          consultation_reason: string
          created_at: string | null
          id: string
          patient_id: string
          patient_message: string | null
          professional_code: string
          professional_id: string
          professional_response: string | null
          requested_at: string | null
          responded_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          consultation_fee?: number | null
          consultation_reason: string
          created_at?: string | null
          id?: string
          patient_id: string
          patient_message?: string | null
          professional_code: string
          professional_id: string
          professional_response?: string | null
          requested_at?: string | null
          responded_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          consultation_fee?: number | null
          consultation_reason?: string
          created_at?: string | null
          id?: string
          patient_id?: string
          patient_message?: string | null
          professional_code?: string
          professional_id?: string
          professional_response?: string | null
          requested_at?: string | null
          responded_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      consultation_summaries: {
        Row: {
          created_at: string
          doctor_notes: string | null
          duration_minutes: number | null
          id: string
          prescription: string | null
          recommendations: string | null
          teleconsultation_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doctor_notes?: string | null
          duration_minutes?: number | null
          id?: string
          prescription?: string | null
          recommendations?: string | null
          teleconsultation_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doctor_notes?: string | null
          duration_minutes?: number | null
          id?: string
          prescription?: string | null
          recommendations?: string | null
          teleconsultation_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_summaries_teleconsultation_id_fkey"
            columns: ["teleconsultation_id"]
            isOneToOne: false
            referencedRelation: "teleconsultations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_summaries: {
        Row: {
          avg_glucose: number | null
          created_at: string
          glucose_readings_count: number | null
          id: string
          net_calories: number | null
          summary_date: string
          total_activities: number | null
          total_calories_burned: number | null
          total_calories_consumed: number | null
          total_carbs: number | null
          total_exercise_minutes: number | null
          total_meals: number | null
          total_steps: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_glucose?: number | null
          created_at?: string
          glucose_readings_count?: number | null
          id?: string
          net_calories?: number | null
          summary_date: string
          total_activities?: number | null
          total_calories_burned?: number | null
          total_calories_consumed?: number | null
          total_carbs?: number | null
          total_exercise_minutes?: number | null
          total_meals?: number | null
          total_steps?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_glucose?: number | null
          created_at?: string
          glucose_readings_count?: number | null
          id?: string
          net_calories?: number | null
          summary_date?: string
          total_activities?: number | null
          total_calories_burned?: number | null
          total_calories_consumed?: number | null
          total_carbs?: number | null
          total_exercise_minutes?: number | null
          total_meals?: number | null
          total_steps?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_sharing_preferences: {
        Row: {
          created_at: string
          id: string
          share_age_group: boolean | null
          share_diabetes_type: boolean | null
          share_region: boolean | null
          share_stats: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          share_age_group?: boolean | null
          share_diabetes_type?: boolean | null
          share_region?: boolean | null
          share_stats?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          share_age_group?: boolean | null
          share_diabetes_type?: boolean | null
          share_region?: boolean | null
          share_stats?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_responders: {
        Row: {
          average_response_time_minutes: number | null
          created_at: string
          id: string
          is_available: boolean | null
          last_online_at: string | null
          specialties: string[] | null
          total_responses: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          average_response_time_minutes?: number | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          last_online_at?: string | null
          specialties?: string[] | null
          total_responses?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          average_response_time_minutes?: number | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          last_online_at?: string | null
          specialties?: string[] | null
          total_responses?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      emergency_support_requests: {
        Row: {
          created_at: string
          id: string
          location_info: Json | null
          message: string | null
          priority: Database["public"]["Enums"]["emergency_priority"]
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          response_time_minutes: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location_info?: Json | null
          message?: string | null
          priority?: Database["public"]["Enums"]["emergency_priority"]
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          response_time_minutes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location_info?: Json | null
          message?: string | null
          priority?: Database["public"]["Enums"]["emergency_priority"]
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          response_time_minutes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      glucose_readings: {
        Row: {
          context: string
          created_at: string
          id: string
          notes: string | null
          timestamp: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          context?: string
          created_at?: string
          id?: string
          notes?: string | null
          timestamp?: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          context?: string
          created_at?: string
          id?: string
          notes?: string | null
          timestamp?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      insulin_injections: {
        Row: {
          created_at: string
          dose_units: number
          id: string
          injection_site: string | null
          injection_time: string
          insulin_brand: string | null
          insulin_type: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dose_units: number
          id?: string
          injection_site?: string | null
          injection_time?: string
          insulin_brand?: string | null
          insulin_type: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dose_units?: number
          id?: string
          injection_site?: string | null
          injection_time?: string
          insulin_brand?: string | null
          insulin_type?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_entries: {
        Row: {
          calories_per_100g: number | null
          carbs_per_100g: number
          created_at: string
          fat_per_100g: number | null
          fiber_per_100g: number | null
          id: string
          meal_name: string
          meal_time: string
          meal_type: string
          notes: string | null
          portion_grams: number
          protein_per_100g: number | null
          sugar_per_100g: number | null
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_fiber: number | null
          total_protein: number | null
          total_sugar: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories_per_100g?: number | null
          carbs_per_100g?: number
          created_at?: string
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          id?: string
          meal_name: string
          meal_time?: string
          meal_type: string
          notes?: string | null
          portion_grams?: number
          protein_per_100g?: number | null
          sugar_per_100g?: number | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_fiber?: number | null
          total_protein?: number | null
          total_sugar?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories_per_100g?: number | null
          carbs_per_100g?: number
          created_at?: string
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          id?: string
          meal_name?: string
          meal_time?: string
          meal_type?: string
          notes?: string | null
          portion_grams?: number
          protein_per_100g?: number | null
          sugar_per_100g?: number | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_fiber?: number | null
          total_protein?: number | null
          total_sugar?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medication_entries: {
        Row: {
          created_at: string
          dose: number
          dose_unit: string | null
          id: string
          medication_name: string
          medication_time: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dose: number
          dose_unit?: string | null
          id?: string
          medication_name: string
          medication_time?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dose?: number
          dose_unit?: string | null
          id?: string
          medication_name?: string
          medication_time?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages_with_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages_with_reactions"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message: string
          room_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          room_id?: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          room_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      monthly_revenue_distribution: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          distributed_at: string | null
          distribution_status: string | null
          id: string
          month_year: string
          total_app_fees_cfa: number
          total_net_profit_cfa: number
          total_platform_fees_cfa: number
          total_professional_payments_cfa: number
          total_reinvestment_cfa: number
          total_revenue_cfa: number
          total_subscriptions: number
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          distributed_at?: string | null
          distribution_status?: string | null
          id?: string
          month_year: string
          total_app_fees_cfa?: number
          total_net_profit_cfa?: number
          total_platform_fees_cfa?: number
          total_professional_payments_cfa?: number
          total_reinvestment_cfa?: number
          total_revenue_cfa?: number
          total_subscriptions?: number
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          distributed_at?: string | null
          distribution_status?: string | null
          id?: string
          month_year?: string
          total_app_fees_cfa?: number
          total_net_profit_cfa?: number
          total_platform_fees_cfa?: number
          total_professional_payments_cfa?: number
          total_reinvestment_cfa?: number
          total_revenue_cfa?: number
          total_subscriptions?: number
          updated_at?: string
        }
        Relationships: []
      }
      patient_access_codes: {
        Row: {
          access_code: string
          expires_at: string
          generated_at: string | null
          id: string
          is_active: boolean | null
          professional_access_count: number | null
          user_id: string
        }
        Insert: {
          access_code: string
          expires_at: string
          generated_at?: string | null
          id?: string
          is_active?: boolean | null
          professional_access_count?: number | null
          user_id: string
        }
        Update: {
          access_code?: string
          expires_at?: string
          generated_at?: string | null
          id?: string
          is_active?: boolean | null
          professional_access_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      patient_access_permissions: {
        Row: {
          allowed_data_sections: string[] | null
          approved_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          max_consultations: number | null
          patient_code: string
          patient_id: string
          permission_status: string
          professional_code: string
          updated_at: string | null
          used_consultations: number | null
        }
        Insert: {
          allowed_data_sections?: string[] | null
          approved_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          max_consultations?: number | null
          patient_code: string
          patient_id: string
          permission_status?: string
          professional_code: string
          updated_at?: string | null
          used_consultations?: number | null
        }
        Update: {
          allowed_data_sections?: string[] | null
          approved_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          max_consultations?: number | null
          patient_code?: string
          patient_id?: string
          permission_status?: string
          professional_code?: string
          updated_at?: string | null
          used_consultations?: number | null
        }
        Relationships: []
      }
      peer_support_pairs: {
        Row: {
          id: string
          is_active: boolean | null
          last_interaction_at: string | null
          mentee_id: string | null
          mentor_id: string | null
          notes: string | null
          paired_at: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          last_interaction_at?: string | null
          mentee_id?: string | null
          mentor_id?: string | null
          notes?: string | null
          paired_at?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          last_interaction_at?: string | null
          mentee_id?: string | null
          mentor_id?: string | null
          notes?: string | null
          paired_at?: string | null
        }
        Relationships: []
      }
      predictive_alerts: {
        Row: {
          acknowledged_at: string | null
          actual_outcome: string | null
          alert_time: string
          alert_type: string
          created_at: string
          factors_contributing: Json | null
          id: string
          predicted_glucose_range: string | null
          recommended_actions: string[] | null
          resolved_at: string | null
          risk_percentage: number | null
          severity: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          actual_outcome?: string | null
          alert_time?: string
          alert_type: string
          created_at?: string
          factors_contributing?: Json | null
          id?: string
          predicted_glucose_range?: string | null
          recommended_actions?: string[] | null
          resolved_at?: string | null
          risk_percentage?: number | null
          severity: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          actual_outcome?: string | null
          alert_time?: string
          alert_type?: string
          created_at?: string
          factors_contributing?: Json | null
          id?: string
          predicted_glucose_range?: string | null
          recommended_actions?: string[] | null
          resolved_at?: string | null
          risk_percentage?: number | null
          severity?: string
          user_id?: string
        }
        Relationships: []
      }
      professional_applications: {
        Row: {
          city: string | null
          code_expires_at: string | null
          code_issued_at: string | null
          country: string
          created_at: string | null
          documents: Json | null
          email: string
          first_name: string
          id: string
          institution: string | null
          last_name: string
          license_number: string
          phone: string | null
          professional_code: string | null
          professional_type: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          code_expires_at?: string | null
          code_issued_at?: string | null
          country: string
          created_at?: string | null
          documents?: Json | null
          email: string
          first_name: string
          id?: string
          institution?: string | null
          last_name: string
          license_number: string
          phone?: string | null
          professional_code?: string | null
          professional_type: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          code_expires_at?: string | null
          code_issued_at?: string | null
          country?: string
          created_at?: string | null
          documents?: Json | null
          email?: string
          first_name?: string
          id?: string
          institution?: string | null
          last_name?: string
          license_number?: string
          phone?: string | null
          professional_code?: string | null
          professional_type?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      professional_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          professional_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          professional_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          professional_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      professional_codes: {
        Row: {
          code: string
          expires_at: string
          generated_at: string | null
          id: string
          is_active: boolean | null
          max_usage: number | null
          professional_id: string | null
          specialty: string | null
          usage_count: number | null
        }
        Insert: {
          code: string
          expires_at: string
          generated_at?: string | null
          id?: string
          is_active?: boolean | null
          max_usage?: number | null
          professional_id?: string | null
          specialty?: string | null
          usage_count?: number | null
        }
        Update: {
          code?: string
          expires_at?: string
          generated_at?: string | null
          id?: string
          is_active?: boolean | null
          max_usage?: number | null
          professional_id?: string | null
          specialty?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_codes_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_earnings: {
        Row: {
          created_at: string
          currency: string | null
          gross_amount: number
          id: string
          net_amount: number
          payout_date: string | null
          payout_reference: string | null
          payout_status: string | null
          platform_fee: number
          professional_id: string
          professional_user_id: string
          teleconsultation_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          gross_amount: number
          id?: string
          net_amount: number
          payout_date?: string | null
          payout_reference?: string | null
          payout_status?: string | null
          platform_fee: number
          professional_id: string
          professional_user_id: string
          teleconsultation_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          gross_amount?: number
          id?: string
          net_amount?: number
          payout_date?: string | null
          payout_reference?: string | null
          payout_status?: string | null
          platform_fee?: number
          professional_id?: string
          professional_user_id?: string
          teleconsultation_id?: string
        }
        Relationships: []
      }
      professional_patient_access: {
        Row: {
          access_method: string | null
          accessed_at: string | null
          id: string
          is_active: boolean | null
          patient_user_id: string
          professional_id: string | null
        }
        Insert: {
          access_method?: string | null
          accessed_at?: string | null
          id?: string
          is_active?: boolean | null
          patient_user_id: string
          professional_id?: string | null
        }
        Update: {
          access_method?: string | null
          accessed_at?: string | null
          id?: string
          is_active?: boolean | null
          patient_user_id?: string
          professional_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_patient_access_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_rates: {
        Row: {
          created_at: string
          currency: string | null
          id: string
          rate_per_consultation: number
          specialty: Database["public"]["Enums"]["professional_specialty"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          id?: string
          rate_per_consultation: number
          specialty: Database["public"]["Enums"]["professional_specialty"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          id?: string
          rate_per_consultation?: number
          specialty?: Database["public"]["Enums"]["professional_specialty"]
          updated_at?: string
        }
        Relationships: []
      }
      professional_sessions: {
        Row: {
          access_denied_reason: string | null
          access_granted: boolean | null
          access_requested_at: string | null
          consultation_duration_minutes: number | null
          consultation_ended_at: string | null
          consultation_notes: string | null
          consultation_started_at: string | null
          created_at: string | null
          data_sections_accessed: string[] | null
          fee_amount: number | null
          fee_paid_at: string | null
          fee_status: string | null
          id: string
          ip_address: unknown | null
          patient_approved_at: string | null
          patient_code: string
          patient_name: string | null
          professional_code: string
          professional_id: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          access_denied_reason?: string | null
          access_granted?: boolean | null
          access_requested_at?: string | null
          consultation_duration_minutes?: number | null
          consultation_ended_at?: string | null
          consultation_notes?: string | null
          consultation_started_at?: string | null
          created_at?: string | null
          data_sections_accessed?: string[] | null
          fee_amount?: number | null
          fee_paid_at?: string | null
          fee_status?: string | null
          id?: string
          ip_address?: unknown | null
          patient_approved_at?: string | null
          patient_code: string
          patient_name?: string | null
          professional_code: string
          professional_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          access_denied_reason?: string | null
          access_granted?: boolean | null
          access_requested_at?: string | null
          consultation_duration_minutes?: number | null
          consultation_ended_at?: string | null
          consultation_notes?: string | null
          consultation_started_at?: string | null
          created_at?: string | null
          data_sections_accessed?: string[] | null
          fee_amount?: number | null
          fee_paid_at?: string | null
          fee_status?: string | null
          id?: string
          ip_address?: unknown | null
          patient_approved_at?: string | null
          patient_code?: string
          patient_name?: string | null
          professional_code?: string
          professional_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_sessions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          professional_license: string | null
          specialty: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          professional_license?: string | null
          specialty?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          professional_license?: string | null
          specialty?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      reminder_logs: {
        Row: {
          action_type: string
          id: string
          logged_at: string
          notes: string | null
          reminder_id: string
          user_id: string
        }
        Insert: {
          action_type: string
          id?: string
          logged_at?: string
          notes?: string | null
          reminder_id: string
          user_id: string
        }
        Update: {
          action_type?: string
          id?: string
          logged_at?: string
          notes?: string | null
          reminder_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "user_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_distribution_config: {
        Row: {
          app_fees_cfa: number
          buffer_amount_cfa: number | null
          created_at: string
          id: string
          net_profit_cfa: number
          payment_platform_amount_cfa: number
          plan_name: string
          plan_price_cfa: number
          plan_price_eur: number
          professional_amount_cfa: number
          reinvestment_amount_cfa: number | null
          updated_at: string
        }
        Insert: {
          app_fees_cfa: number
          buffer_amount_cfa?: number | null
          created_at?: string
          id?: string
          net_profit_cfa: number
          payment_platform_amount_cfa: number
          plan_name: string
          plan_price_cfa: number
          plan_price_eur: number
          professional_amount_cfa: number
          reinvestment_amount_cfa?: number | null
          updated_at?: string
        }
        Update: {
          app_fees_cfa?: number
          buffer_amount_cfa?: number | null
          created_at?: string
          id?: string
          net_profit_cfa?: number
          payment_platform_amount_cfa?: number
          plan_name?: string
          plan_price_cfa?: number
          plan_price_eur?: number
          professional_amount_cfa?: number
          reinvestment_amount_cfa?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      session_participants: {
        Row: {
          attended: boolean | null
          feedback_comment: string | null
          feedback_rating: number | null
          id: string
          joined_at: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          attended?: boolean | null
          feedback_comment?: string | null
          feedback_rating?: number | null
          id?: string
          joined_at?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          attended?: boolean | null
          feedback_comment?: string | null
          feedback_rating?: number | null
          id?: string
          joined_at?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "support_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          max_consultations_per_month: number | null
          max_family_members: number | null
          name: string
          price_eur: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_consultations_per_month?: number | null
          max_family_members?: number | null
          name: string
          price_eur: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_consultations_per_month?: number | null
          max_family_members?: number | null
          name?: string
          price_eur?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      support_sessions: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          is_recurring: boolean | null
          max_participants: number | null
          meeting_link: string | null
          moderator_id: string | null
          moderator_name: string
          recurrence_pattern: string | null
          scheduled_time: string
          session_type: Database["public"]["Enums"]["support_session_type"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          moderator_id?: string | null
          moderator_name: string
          recurrence_pattern?: string | null
          scheduled_time: string
          session_type: Database["public"]["Enums"]["support_session_type"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          moderator_id?: string | null
          moderator_name?: string
          recurrence_pattern?: string | null
          scheduled_time?: string
          session_type?: Database["public"]["Enums"]["support_session_type"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      teleconsultations: {
        Row: {
          admin_notified_at: string | null
          amount_charged: number | null
          consultation_notes: string | null
          consultation_summary: string | null
          created_at: string
          doctor_payout_amount: number | null
          doctor_payout_status: string | null
          duration_minutes: number | null
          ended_at: string | null
          follow_up_date: string | null
          id: string
          patient_feedback: string | null
          patient_id: string
          patient_summary_sent_at: string | null
          payment_status: string | null
          prescription: string | null
          professional_id: string
          rating: number | null
          scheduled_at: string
          session_id: string | null
          started_at: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          admin_notified_at?: string | null
          amount_charged?: number | null
          consultation_notes?: string | null
          consultation_summary?: string | null
          created_at?: string
          doctor_payout_amount?: number | null
          doctor_payout_status?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          follow_up_date?: string | null
          id?: string
          patient_feedback?: string | null
          patient_id: string
          patient_summary_sent_at?: string | null
          payment_status?: string | null
          prescription?: string | null
          professional_id: string
          rating?: number | null
          scheduled_at: string
          session_id?: string | null
          started_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_notified_at?: string | null
          amount_charged?: number | null
          consultation_notes?: string | null
          consultation_summary?: string | null
          created_at?: string
          doctor_payout_amount?: number | null
          doctor_payout_status?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          follow_up_date?: string | null
          id?: string
          patient_feedback?: string | null
          patient_id?: string
          patient_summary_sent_at?: string | null
          payment_status?: string | null
          prescription?: string | null
          professional_id?: string
          rating?: number | null
          scheduled_at?: string
          session_id?: string | null
          started_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_activity_stats: {
        Row: {
          created_at: string | null
          days_active: number | null
          helpful_reactions_received: number | null
          id: string
          last_message_at: string | null
          messages_sent: number | null
          reports_submitted: number | null
          updated_at: string | null
          user_id: string
          warnings_received: number | null
        }
        Insert: {
          created_at?: string | null
          days_active?: number | null
          helpful_reactions_received?: number | null
          id?: string
          last_message_at?: string | null
          messages_sent?: number | null
          reports_submitted?: number | null
          updated_at?: string | null
          user_id: string
          warnings_received?: number | null
        }
        Update: {
          created_at?: string | null
          days_active?: number | null
          helpful_reactions_received?: number | null
          id?: string
          last_message_at?: string | null
          messages_sent?: number | null
          reports_submitted?: number | null
          updated_at?: string | null
          user_id?: string
          warnings_received?: number | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          description: string | null
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          description?: string | null
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          description?: string | null
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reminders: {
        Row: {
          created_at: string
          days_of_week: number[]
          description: string | null
          dose_amount: string | null
          dose_unit: string | null
          id: string
          is_active: boolean
          reminder_type: string
          scheduled_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[]
          description?: string | null
          dose_amount?: string | null
          dose_unit?: string | null
          id?: string
          is_active?: boolean
          reminder_type: string
          scheduled_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[]
          description?: string | null
          dose_amount?: string | null
          dose_unit?: string | null
          id?: string
          is_active?: boolean
          reminder_type?: string
          scheduled_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reputation: {
        Row: {
          challenge_participations: number
          created_at: string
          data_shares: number
          helpful_messages: number
          id: string
          last_calculated_at: string
          mentored_users: number
          positive_reactions: number
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_participations?: number
          created_at?: string
          data_shares?: number
          helpful_messages?: number
          id?: string
          last_calculated_at?: string
          mentored_users?: number
          positive_reactions?: number
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_participations?: number
          created_at?: string
          data_shares?: number
          helpful_messages?: number
          id?: string
          last_calculated_at?: string
          mentored_users?: number
          positive_reactions?: number
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_statistics: {
        Row: {
          avg_glucose: number | null
          created_at: string
          days_active: number | null
          hba1c: number | null
          id: string
          last_calculated_at: string | null
          time_in_range: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_glucose?: number | null
          created_at?: string
          days_active?: number | null
          hba1c?: number | null
          id?: string
          last_calculated_at?: string | null
          time_in_range?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_glucose?: number | null
          created_at?: string
          days_active?: number | null
          hba1c?: number | null
          id?: string
          last_calculated_at?: string | null
          time_in_range?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          consultations_used: number | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          patient_code: string | null
          plan_id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consultations_used?: number | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          patient_code?: string | null
          plan_id: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consultations_used?: number | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          patient_code?: string | null
          plan_id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      messages_with_profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          message: string | null
          room_id: string | null
          sender_id: string | null
        }
        Relationships: []
      }
      messages_with_reactions: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          message: string | null
          reactions: Json | null
          room_id: string | null
          sender_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_professional_application: {
        Args: { application_id: string; reviewer_id: string }
        Returns: boolean
      }
      award_badge_if_eligible: {
        Args: {
          _badge_type: Database["public"]["Enums"]["badge_type"]
          _user_id: string
        }
        Returns: boolean
      }
      calculate_monthly_revenue_distribution: {
        Args: { _month_year: string }
        Returns: Json
      }
      calculate_professional_earnings: {
        Args: {
          _platform_fee_percentage?: number
          _teleconsultation_id: string
        }
        Returns: string
      }
      can_access_data_section: {
        Args: {
          data_section: string
          patient_code_param: string
          professional_code_param: string
        }
        Returns: boolean
      }
      generate_community_insights: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_patient_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_patient_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_professional_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_age_group: {
        Args: { age: number }
        Returns: string
      }
      get_community_reputation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_score: number
          top_score: number
          total_helpful_messages: number
          total_positive_reactions: number
          total_users: number
        }[]
      }
      get_professional_schedule: {
        Args: {
          _end_date: string
          _professional_id: string
          _start_date: string
        }
        Returns: {
          booked_slots: number
          date: string
          day_of_week: number
          end_time: string
          is_available: boolean
          start_time: string
        }[]
      }
      get_user_reputation_rank: {
        Args: { target_user_id: string }
        Returns: {
          total_users: number
          user_rank: number
          user_score: number
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_webhook_url: {
        Args: { webhook_type: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_permission_valid: {
        Args: { permission_id: string }
        Returns: boolean
      }
      request_patient_access: {
        Args: {
          pat_code: string
          patient_name_param?: string
          prof_code: string
        }
        Returns: string
      }
      request_patient_permission: {
        Args: {
          max_consultations_param?: number
          patient_code_param: string
          professional_code_param: string
          requested_sections?: string[]
          validity_days?: number
        }
        Returns: string
      }
      respond_to_access_request: {
        Args: {
          approve: boolean
          denial_reason?: string
          session_id_param: string
        }
        Returns: boolean
      }
      respond_to_permission_request: {
        Args: {
          allowed_sections?: string[]
          approve: boolean
          permission_id_param: string
        }
        Returns: boolean
      }
      share_anonymous_statistics: {
        Args: { _user_id: string }
        Returns: boolean
      }
      test_webhook: {
        Args: { webhook_type: string }
        Returns: boolean
      }
      update_daily_summary_for_user: {
        Args: { _date: string; _user_id: string }
        Returns: undefined
      }
      update_user_activity: {
        Args: { _activity_type: string; _user_id: string }
        Returns: undefined
      }
      update_user_reputation: {
        Args: {
          _challenge_participations?: number
          _data_shares?: number
          _helpful_messages?: number
          _mentored_users?: number
          _positive_reactions?: number
          _user_id: string
        }
        Returns: undefined
      }
      use_consultation: {
        Args: { patient_code_param: string; professional_code_param: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "member" | "verified_member" | "expert" | "moderator"
      badge_type:
        | "welcome"
        | "helper"
        | "consistent"
        | "motivator"
        | "expert"
        | "champion"
      challenge_type:
        | "glucose_monitoring"
        | "exercise"
        | "nutrition"
        | "medication_adherence"
        | "community_engagement"
      diabetes_type: "type1" | "type2" | "gestational" | "other"
      emergency_priority: "low" | "medium" | "high" | "critical"
      professional_specialty:
        | "endocrinologist"
        | "psychologist"
        | "nutritionist"
        | "nurse"
        | "general_practitioner"
        | "diabetologist"
      support_session_type:
        | "group_session"
        | "peer_mentoring"
        | "emergency_support"
        | "challenge_group"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["member", "verified_member", "expert", "moderator"],
      badge_type: [
        "welcome",
        "helper",
        "consistent",
        "motivator",
        "expert",
        "champion",
      ],
      challenge_type: [
        "glucose_monitoring",
        "exercise",
        "nutrition",
        "medication_adherence",
        "community_engagement",
      ],
      diabetes_type: ["type1", "type2", "gestational", "other"],
      emergency_priority: ["low", "medium", "high", "critical"],
      professional_specialty: [
        "endocrinologist",
        "psychologist",
        "nutritionist",
        "nurse",
        "general_practitioner",
        "diabetologist",
      ],
      support_session_type: [
        "group_session",
        "peer_mentoring",
        "emergency_support",
        "challenge_group",
      ],
    },
  },
} as const
