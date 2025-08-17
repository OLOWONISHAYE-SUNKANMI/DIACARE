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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_professional_application: {
        Args: { application_id: string; reviewer_id: string }
        Returns: boolean
      }
      can_access_data_section: {
        Args: {
          data_section: string
          patient_code_param: string
          professional_code_param: string
        }
        Returns: boolean
      }
      generate_patient_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_professional_code: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      test_webhook: {
        Args: { webhook_type: string }
        Returns: boolean
      }
      update_user_activity: {
        Args: { _activity_type: string; _user_id: string }
        Returns: undefined
      }
      use_consultation: {
        Args: { patient_code_param: string; professional_code_param: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "member" | "verified_member" | "expert" | "moderator"
      challenge_type:
        | "glucose_monitoring"
        | "exercise"
        | "nutrition"
        | "medication_adherence"
        | "community_engagement"
      emergency_priority: "low" | "medium" | "high" | "critical"
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
      challenge_type: [
        "glucose_monitoring",
        "exercise",
        "nutrition",
        "medication_adherence",
        "community_engagement",
      ],
      emergency_priority: ["low", "medium", "high", "critical"],
      support_session_type: [
        "group_session",
        "peer_mentoring",
        "emergency_support",
        "challenge_group",
      ],
    },
  },
} as const
