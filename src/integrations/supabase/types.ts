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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      typing_sessions: {
        Row: {
          accuracy: number
          consistency: number | null
          created_at: string
          id: string
          mode: string
          raw_wpm: number
          time_seconds: number
          user_id: string | null
          wpm: number
        }
        Insert: {
          accuracy: number
          consistency?: number | null
          created_at?: string
          id?: string
          mode: string
          raw_wpm: number
          time_seconds: number
          user_id?: string | null
          wpm: number
        }
        Update: {
          accuracy?: number
          consistency?: number | null
          created_at?: string
          id?: string
          mode?: string
          raw_wpm?: number
          time_seconds?: number
          user_id?: string | null
          wpm?: number
        }
        Relationships: [
          {
            foreignKeyName: "typing_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_responses: {
        Row: {
          can_touch_type: string
          created_at: string
          current_step: string
          id: string
          keyboard_layout: string
          session_id: string | null
          share_data: string
          updated_at: string
          user_id: string | null
          want_to_learn: string | null
        }
        Insert: {
          can_touch_type: string
          created_at?: string
          current_step: string
          id?: string
          keyboard_layout: string
          session_id?: string | null
          share_data: string
          updated_at?: string
          user_id?: string | null
          want_to_learn?: string | null
        }
        Update: {
          can_touch_type?: string
          created_at?: string
          current_step?: string
          id?: string
          keyboard_layout?: string
          session_id?: string | null
          share_data?: string
          updated_at?: string
          user_id?: string | null
          want_to_learn?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      typing_test_data: {
        Row: {
          accuracy_percentage: number | null
          average_reaction_time_ms: number | null
          can_touch_type: string
          completed_at: string | null
          completed_letters: number
          created_at: string
          id: string
          keyboard_layout: string
          questionnaire_response_id: string | null
          session_id: string | null
          started_at: string
          test_duration_ms: number
          total_letters: number
          typing_data: Json
          user_id: string | null
        }
        Insert: {
          accuracy_percentage?: number | null
          average_reaction_time_ms?: number | null
          can_touch_type: string
          completed_at?: string | null
          completed_letters: number
          created_at?: string
          id?: string
          keyboard_layout: string
          questionnaire_response_id?: string | null
          session_id?: string | null
          started_at?: string
          test_duration_ms: number
          total_letters: number
          typing_data: Json
          user_id?: string | null
        }
        Update: {
          accuracy_percentage?: number | null
          average_reaction_time_ms?: number | null
          can_touch_type?: string
          completed_at?: string | null
          completed_letters?: number
          created_at?: string
          id?: string
          keyboard_layout?: string
          questionnaire_response_id?: string | null
          session_id?: string | null
          started_at?: string
          test_duration_ms?: number
          total_letters?: number
          typing_data?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "typing_test_data_questionnaire_response_id_fkey"
            columns: ["questionnaire_response_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "typing_test_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
