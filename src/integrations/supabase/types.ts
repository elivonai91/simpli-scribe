export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      budgets: {
        Row: {
          category_limits: Json | null
          created_at: string
          id: string
          monthly_limit: number
          user_id: string
        }
        Insert: {
          category_limits?: Json | null
          created_at?: string
          id?: string
          monthly_limit: number
          user_id: string
        }
        Update: {
          category_limits?: Json | null
          created_at?: string
          id?: string
          monthly_limit?: number
          user_id?: string
        }
        Relationships: []
      }
      feature_usage: {
        Row: {
          created_at: string | null
          feature_name: string
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_schedules: {
        Row: {
          created_at: string
          days_before: number
          enabled: boolean | null
          id: string
          notification_time: string
          subscription_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_before: number
          enabled?: boolean | null
          id?: string
          notification_time: string
          subscription_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_before?: number
          enabled?: boolean | null
          id?: string
          notification_time?: string
          subscription_id?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_services: {
        Row: {
          affiliate_rate: number | null
          api_integration: boolean | null
          base_price: number
          category: string | null
          created_at: string | null
          genre: string[] | null
          id: string
          popularity_score: number | null
          premium_discount: number | null
          release_date: string | null
          service_name: string
        }
        Insert: {
          affiliate_rate?: number | null
          api_integration?: boolean | null
          base_price: number
          category?: string | null
          created_at?: string | null
          genre?: string[] | null
          id?: string
          popularity_score?: number | null
          premium_discount?: number | null
          release_date?: string | null
          service_name: string
        }
        Update: {
          affiliate_rate?: number | null
          api_integration?: boolean | null
          base_price?: number
          category?: string | null
          created_at?: string | null
          genre?: string[] | null
          id?: string
          popularity_score?: number | null
          premium_discount?: number | null
          release_date?: string | null
          service_name?: string
        }
        Relationships: []
      }
      premium_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          is_active: boolean
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          is_active?: boolean
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          is_active?: boolean
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          notification_preferences: Json | null
          plan_type: string | null
          stripe_customer_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          notification_preferences?: Json | null
          plan_type?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          plan_type?: string | null
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      recommendation_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          rating: number
          service_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating: number
          service_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number
          service_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_feedback_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "partner_services"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string
          filters: Json | null
          id: string
          query: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json | null
          id?: string
          query: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json | null
          id?: string
          query?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_combinations: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          subscriptions: Json
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          subscriptions: Json
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          subscriptions?: Json
          user_id?: string
        }
        Relationships: []
      }
      subscription_detection_logs: {
        Row: {
          detected_subscriptions: Json | null
          email: string
          error: string | null
          id: string
          scan_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          detected_subscriptions?: Json | null
          email: string
          error?: string | null
          id?: string
          scan_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          detected_subscriptions?: Json | null
          email?: string
          error?: string | null
          id?: string
          scan_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_logos: {
        Row: {
          created_at: string | null
          id: string
          logo_path: string
          service_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_path: string
          service_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_path?: string
          service_name?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          monthly_price: number
          name: string
          yearly_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          monthly_price: number
          name: string
          yearly_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          monthly_price?: number
          name?: string
          yearly_price?: number
        }
        Relationships: []
      }
      subscription_recommendations: {
        Row: {
          created_at: string
          id: string
          reason: Json | null
          score: number
          service_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: Json | null
          score: number
          service_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: Json | null
          score?: number
          service_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_recommendations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "partner_services"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_analytics: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          features_used: Json | null
          id: string
          pages_visited: Json | null
          session_end: string | null
          session_start: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          features_used?: Json | null
          id?: string
          pages_visited?: Json | null
          session_end?: string | null
          session_start?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          features_used?: Json | null
          id?: string
          pages_visited?: Json | null
          session_end?: string | null
          session_start?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_amount: number
          billing_currency: string | null
          billing_cycle: string | null
          created_at: string | null
          id: string
          last_billing_date: string | null
          next_billing_date: string
          notes: string | null
          payment_method_id: string | null
          service_category: string | null
          service_name: string
          status: string | null
          subscription_plan_id: string | null
          subscription_url: string | null
          user_id: string | null
        }
        Insert: {
          billing_amount: number
          billing_currency?: string | null
          billing_cycle?: string | null
          created_at?: string | null
          id?: string
          last_billing_date?: string | null
          next_billing_date: string
          notes?: string | null
          payment_method_id?: string | null
          service_category?: string | null
          service_name: string
          status?: string | null
          subscription_plan_id?: string | null
          subscription_url?: string | null
          user_id?: string | null
        }
        Update: {
          billing_amount?: number
          billing_currency?: string | null
          billing_cycle?: string | null
          created_at?: string | null
          id?: string
          last_billing_date?: string | null
          next_billing_date?: string
          notes?: string | null
          payment_method_id?: string | null
          service_category?: string | null
          service_name?: string
          status?: string | null
          subscription_plan_id?: string | null
          subscription_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
