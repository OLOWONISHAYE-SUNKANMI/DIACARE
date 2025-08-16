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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_professional_application: {
        Args: { application_id: string; reviewer_id: string }
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
      request_patient_access: {
        Args: {
          pat_code: string
          patient_name_param?: string
          prof_code: string
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
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
