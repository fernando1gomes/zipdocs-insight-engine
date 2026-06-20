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
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          parts: Json | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          parts?: Json | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          parts?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      autorresponsabilidade_sessions: {
        Row: {
          action_24h: string | null
          behaviors: string[] | null
          behaviors_reflection: string | null
          broken_text: string | null
          commitment: string | null
          completed_at: string | null
          created_at: string
          current_score: number | null
          excuse: string | null
          excuse_decision: string | null
          id: string
          misplaced_text: string | null
          missing_text: string | null
          pillar_id: number
          result_text: string | null
          score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_24h?: string | null
          behaviors?: string[] | null
          behaviors_reflection?: string | null
          broken_text?: string | null
          commitment?: string | null
          completed_at?: string | null
          created_at?: string
          current_score?: number | null
          excuse?: string | null
          excuse_decision?: string | null
          id?: string
          misplaced_text?: string | null
          missing_text?: string | null
          pillar_id: number
          result_text?: string | null
          score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_24h?: string | null
          behaviors?: string[] | null
          behaviors_reflection?: string | null
          broken_text?: string | null
          commitment?: string | null
          completed_at?: string | null
          created_at?: string
          current_score?: number | null
          excuse?: string | null
          excuse_decision?: string | null
          id?: string
          misplaced_text?: string | null
          missing_text?: string | null
          pillar_id?: number
          result_text?: string | null
          score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "autorresponsabilidade_sessions_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_closing_answers: {
        Row: {
          answer: string | null
          created_at: string
          daily_closing_id: string
          id: string
          question: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          daily_closing_id: string
          id?: string
          question: string
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          daily_closing_id?: string
          id?: string
          question?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_closing_answers_daily_closing_id_fkey"
            columns: ["daily_closing_id"]
            isOneToOne: false
            referencedRelation: "daily_closings"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_closings: {
        Row: {
          ai_summary: string | null
          closing_date: string
          completed_actions_count: number
          created_at: string
          id: string
          not_completed_actions_count: number
          planned_actions_count: number
          rescheduled_actions_count: number
          updated_at: string
          user_id: string
          user_reflection: string | null
        }
        Insert: {
          ai_summary?: string | null
          closing_date: string
          completed_actions_count?: number
          created_at?: string
          id?: string
          not_completed_actions_count?: number
          planned_actions_count?: number
          rescheduled_actions_count?: number
          updated_at?: string
          user_id: string
          user_reflection?: string | null
        }
        Update: {
          ai_summary?: string | null
          closing_date?: string
          completed_actions_count?: number
          created_at?: string
          id?: string
          not_completed_actions_count?: number
          planned_actions_count?: number
          rescheduled_actions_count?: number
          updated_at?: string
          user_id?: string
          user_reflection?: string | null
        }
        Relationships: []
      }
      expert_videos: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          expert_name: string | null
          id: string
          pillar_id: number
          title: string
          updated_at: string
          youtube_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          expert_name?: string | null
          id?: string
          pillar_id: number
          title: string
          updated_at?: string
          youtube_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          expert_name?: string | null
          id?: string
          pillar_id?: number
          title?: string
          updated_at?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_videos_pillar_id_fkey"
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
          daily_closing_id: string | null
          execution_status: string | null
          id: string
          log_date: string
          non_execution_reason: string | null
          pillar_id: number
          rescheduled_from: string | null
          rescheduled_to: string | null
          status: string
          user_id: string
          user_note: string | null
        }
        Insert: {
          action_id: string
          created_at?: string
          daily_closing_id?: string | null
          execution_status?: string | null
          id?: string
          log_date?: string
          non_execution_reason?: string | null
          pillar_id: number
          rescheduled_from?: string | null
          rescheduled_to?: string | null
          status: string
          user_id: string
          user_note?: string | null
        }
        Update: {
          action_id?: string
          created_at?: string
          daily_closing_id?: string | null
          execution_status?: string | null
          id?: string
          log_date?: string
          non_execution_reason?: string | null
          pillar_id?: number
          rescheduled_from?: string | null
          rescheduled_to?: string | null
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
            foreignKeyName: "pillar_action_logs_daily_closing_id_fkey"
            columns: ["daily_closing_id"]
            isOneToOne: false
            referencedRelation: "daily_closings"
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
      pillar_action_plans: {
        Row: {
          broken_text: string | null
          created_at: string
          how: string | null
          how_much: string | null
          id: string
          misplaced_text: string | null
          missing_text: string | null
          pillar_id: number
          status: string
          updated_at: string
          user_id: string
          what: string | null
          when_due: string | null
          when_start: string | null
          where_text: string | null
          who_text: string | null
          why: string | null
        }
        Insert: {
          broken_text?: string | null
          created_at?: string
          how?: string | null
          how_much?: string | null
          id?: string
          misplaced_text?: string | null
          missing_text?: string | null
          pillar_id: number
          status?: string
          updated_at?: string
          user_id: string
          what?: string | null
          when_due?: string | null
          when_start?: string | null
          where_text?: string | null
          who_text?: string | null
          why?: string | null
        }
        Update: {
          broken_text?: string | null
          created_at?: string
          how?: string | null
          how_much?: string | null
          id?: string
          misplaced_text?: string | null
          missing_text?: string | null
          pillar_id?: number
          status?: string
          updated_at?: string
          user_id?: string
          what?: string | null
          when_due?: string | null
          when_start?: string | null
          where_text?: string | null
          who_text?: string | null
          why?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pillar_action_plans_pillar_id_fkey"
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
          calendar_status: string
          completed_at: string | null
          created_at: string
          days_overdue: number
          description: string | null
          due_date: string | null
          duration_minutes: number | null
          frequency_type: string | null
          frequency_value: number | null
          id: string
          next_due_date: string | null
          obstacle_expected: string | null
          pillar_id: number
          plan_id: string | null
          priority: string
          reminder_at: string | null
          reminder_enabled: boolean
          required_resource: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          start_date: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type?: string
          calendar_status?: string
          completed_at?: string | null
          created_at?: string
          days_overdue?: number
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          frequency_type?: string | null
          frequency_value?: number | null
          id?: string
          next_due_date?: string | null
          obstacle_expected?: string | null
          pillar_id: number
          plan_id?: string | null
          priority?: string
          reminder_at?: string | null
          reminder_enabled?: boolean
          required_resource?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          start_date?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          calendar_status?: string
          completed_at?: string | null
          created_at?: string
          days_overdue?: number
          description?: string | null
          due_date?: string | null
          duration_minutes?: number | null
          frequency_type?: string | null
          frequency_value?: number | null
          id?: string
          next_due_date?: string | null
          obstacle_expected?: string | null
          pillar_id?: number
          plan_id?: string | null
          priority?: string
          reminder_at?: string | null
          reminder_enabled?: boolean
          required_resource?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
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
          {
            foreignKeyName: "pillar_actions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pillar_action_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_checkin_questions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          pillar_id: number
          question_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          pillar_id: number
          question_text: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          pillar_id?: number
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_checkin_questions_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_criteria: {
        Row: {
          created_at: string
          hint: string | null
          id: string
          is_active: boolean
          key: string
          label: string
          order_index: number
          pillar_id: number
          question_text: string
          weight: number
        }
        Insert: {
          created_at?: string
          hint?: string | null
          id?: string
          is_active?: boolean
          key: string
          label: string
          order_index?: number
          pillar_id: number
          question_text: string
          weight?: number
        }
        Update: {
          created_at?: string
          hint?: string | null
          id?: string
          is_active?: boolean
          key?: string
          label?: string
          order_index?: number
          pillar_id?: number
          question_text?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "pillar_criteria_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_criteria_scores: {
        Row: {
          comment: string | null
          created_at: string
          criterion_id: string
          evaluation_id: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          criterion_id: string
          evaluation_id: string
          id?: string
          score: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          criterion_id?: string
          evaluation_id?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_criteria_scores_criterion_id_fkey"
            columns: ["criterion_id"]
            isOneToOne: false
            referencedRelation: "pillar_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pillar_criteria_scores_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "pillar_evaluations"
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
      video_suggestions: {
        Row: {
          approved_video_id: string | null
          created_at: string
          description: string | null
          expert_name: string | null
          id: string
          pillar_id: number
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["suggestion_status"]
          suggested_by: string
          title: string
          updated_at: string
          youtube_id: string
        }
        Insert: {
          approved_video_id?: string | null
          created_at?: string
          description?: string | null
          expert_name?: string | null
          id?: string
          pillar_id: number
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          suggested_by: string
          title: string
          updated_at?: string
          youtube_id: string
        }
        Update: {
          approved_video_id?: string | null
          created_at?: string
          description?: string | null
          expert_name?: string | null
          id?: string
          pillar_id?: number
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          suggested_by?: string
          title?: string
          updated_at?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_suggestions_approved_video_id_fkey"
            columns: ["approved_video_id"]
            isOneToOne: false
            referencedRelation: "expert_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_suggestions_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "pillars"
            referencedColumns: ["id"]
          },
        ]
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
      approve_video_suggestion: {
        Args: { _display_order?: number; _suggestion_id: string }
        Returns: string
      }
      generate_pillar_alerts: { Args: { _user_id: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recalculate_user_pillar: {
        Args: { _pillar_id: number; _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      suggestion_status: "pending" | "approved" | "rejected"
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
      suggestion_status: ["pending", "approved", "rejected"],
    },
  },
} as const
