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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          created_at: string
          id: string
          message: string
          pillar_id: number | null
          recommendation_type: string
          status: string
          suggested_action: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          pillar_id?: number | null
          recommendation_type: string
          status?: string
          suggested_action?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          pillar_id?: number | null
          recommendation_type?: string
          status?: string
          suggested_action?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean
          is_resolved: boolean
          message: string
          pillar_id: number | null
          resolved_at: string | null
          severity: string
          title: string
          trigger_reason: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          message: string
          pillar_id?: number | null
          resolved_at?: string | null
          severity?: string
          title: string
          trigger_reason?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          message?: string
          pillar_id?: number | null
          resolved_at?: string | null
          severity?: string
          title?: string
          trigger_reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_action_logs: {
        Row: {
          action_id: string
          created_at: string
          id: string
          log_date: string
          pillar_id: number
          status: string
          user_id: string
          user_note: string | null
        }
        Insert: {
          action_id: string
          created_at?: string
          id?: string
          log_date?: string
          pillar_id: number
          status: string
          user_id: string
          user_note?: string | null
        }
        Update: {
          action_id?: string
          created_at?: string
          id?: string
          log_date?: string
          pillar_id?: number
          status?: string
          user_id?: string
          user_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pillar_action_logs_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "pillar_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pillar_action_logs_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_actions: {
        Row: {
          action_type: string
          completed_at: string | null
          created_at: string
          days_overdue: number
          description: string | null
          due_date: string | null
          frequency_type: string | null
          frequency_value: number | null
          id: string
          next_due_date: string | null
          obstacle_expected: string | null
          pillar_id: number
          priority: string
          required_resource: string | null
          start_date: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type?: string
          completed_at?: string | null
          created_at?: string
          days_overdue?: number
          description?: string | null
          due_date?: string | null
          frequency_type?: string | null
          frequency_value?: number | null
          id?: string
          next_due_date?: string | null
          obstacle_expected?: string | null
          pillar_id: number
          priority?: string
          required_resource?: string | null
          start_date?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          completed_at?: string | null
          created_at?: string
          days_overdue?: number
          description?: string | null
          due_date?: string | null
          frequency_type?: string | null
          frequency_value?: number | null
          id?: string
          next_due_date?: string | null
          obstacle_expected?: string | null
          pillar_id?: number
          priority?: string
          required_resource?: string | null
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_actions_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_evaluations: {
        Row: {
          action_execution_score: number | null
          ai_summary: string | null
          behavior_score: number | null
          created_at: string
          evaluation_date: string
          final_score: number
          frequency_score: number | null
          id: string
          interdependence_score: number | null
          pillar_id: number
          subjective_score: number | null
          user_comment: string | null
          user_id: string
        }
        Insert: {
          action_execution_score?: number | null
          ai_summary?: string | null
          behavior_score?: number | null
          created_at?: string
          evaluation_date?: string
          final_score: number
          frequency_score?: number | null
          id?: string
          interdependence_score?: number | null
          pillar_id: number
          subjective_score?: number | null
          user_comment?: string | null
          user_id: string
        }
        Update: {
          action_execution_score?: number | null
          ai_summary?: string | null
          behavior_score?: number | null
          created_at?: string
          evaluation_date?: string
          final_score?: number
          frequency_score?: number | null
          id?: string
          interdependence_score?: number | null
          pillar_id?: number
          subjective_score?: number | null
          user_comment?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_evaluations_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_interdependencies: {
        Row: {
          created_at: string
          id: string
          impact_description: string | null
          impact_level: string
          source_pillar_id: number
          target_pillar_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          impact_description?: string | null
          impact_level?: string
          source_pillar_id: number
          target_pillar_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          impact_description?: string | null
          impact_level?: string
          source_pillar_id?: number
          target_pillar_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pillar_interdependencies_source_pillar_id_fkey"
            columns: ["source_pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pillar_interdependencies_target_pillar_id_fkey"
            columns: ["target_pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pillars: {
        Row: {
          created_at: string
          default_order: number
          description: string | null
          icon: string | null
          id: number
          is_active: boolean
          name: string
          short_name: string
        }
        Insert: {
          created_at?: string
          default_order: number
          description?: string | null
          icon?: string | null
          id: number
          is_active?: boolean
          name: string
          short_name: string
        }
        Update: {
          created_at?: string
          default_order?: number
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean
          name?: string
          short_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_cycle_end_date: string | null
          current_cycle_start_date: string | null
          display_name: string | null
          id: string
          notification_preferences: Json
          onboarding_completed: boolean
          preferred_checkin_day: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_cycle_end_date?: string | null
          current_cycle_start_date?: string | null
          display_name?: string | null
          id: string
          notification_preferences?: Json
          onboarding_completed?: boolean
          preferred_checkin_day?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_cycle_end_date?: string | null
          current_cycle_start_date?: string | null
          display_name?: string | null
          id?: string
          notification_preferences?: Json
          onboarding_completed?: boolean
          preferred_checkin_day?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_pillars: {
        Row: {
          created_at: string
          current_score: number
          days_without_action: number
          desired_score: number
          focus_cycle_status: string | null
          id: string
          impact_score: number
          last_action_date: string | null
          last_evaluation_date: string | null
          overdue_actions_count: number
          pillar_id: number
          priority_level: string
          risk_level: string
          status_color: string
          trend: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_score?: number
          days_without_action?: number
          desired_score?: number
          focus_cycle_status?: string | null
          id?: string
          impact_score?: number
          last_action_date?: string | null
          last_evaluation_date?: string | null
          overdue_actions_count?: number
          pillar_id: number
          priority_level?: string
          risk_level?: string
          status_color?: string
          trend?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_score?: number
          days_without_action?: number
          desired_score?: number
          focus_cycle_status?: string | null
          id?: string
          impact_score?: number
          last_action_date?: string | null
          last_evaluation_date?: string | null
          overdue_actions_count?: number
          pillar_id?: number
          priority_level?: string
          risk_level?: string
          status_color?: string
          trend?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_pillars_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_checkin_answers: {
        Row: {
          answer: string
          checkin_id: string
          created_at: string
          id: string
          question: string
          user_id: string
        }
        Insert: {
          answer: string
          checkin_id: string
          created_at?: string
          id?: string
          question: string
          user_id: string
        }
        Update: {
          answer?: string
          checkin_id?: string
          created_at?: string
          id?: string
          question?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_checkin_answers_checkin_id_fkey"
            columns: ["checkin_id"]
            isOneToOne: false
            referencedRelation: "weekly_checkins"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_checkins: {
        Row: {
          ai_summary: string | null
          created_at: string
          id: string
          is_completed: boolean
          main_focus_pillar_id: number | null
          most_improved_pillar_id: number | null
          most_neglected_pillar_id: number | null
          updated_at: string
          user_id: string
          user_reflection: string | null
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          main_focus_pillar_id?: number | null
          most_improved_pillar_id?: number | null
          most_neglected_pillar_id?: number | null
          updated_at?: string
          user_id: string
          user_reflection?: string | null
          week_end_date: string
          week_start_date: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          main_focus_pillar_id?: number | null
          most_improved_pillar_id?: number | null
          most_neglected_pillar_id?: number | null
          updated_at?: string
          user_id?: string
          user_reflection?: string | null
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_checkins_main_focus_pillar_id_fkey"
            columns: ["main_focus_pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_checkins_most_improved_pillar_id_fkey"
            columns: ["most_improved_pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_checkins_most_neglected_pillar_id_fkey"
            columns: ["most_neglected_pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
