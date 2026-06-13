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
      feedback: {
        Row: {
          bill_total: number | null
          created_at: string
          currency: string | null
          id: string
          items_count: number | null
          people_count: number | null
          rating: number
          session_id: string | null
        }
        Insert: {
          bill_total?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          items_count?: number | null
          people_count?: number | null
          rating: number
          session_id?: string | null
        }
        Update: {
          bill_total?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          items_count?: number | null
          people_count?: number | null
          rating?: number
          session_id?: string | null
        }
        Relationships: []
      }
      scan_logs: {
        Row: {
          bill_total: number | null
          created_at: string
          currency: string | null
          id: string
          image_path: string | null
          ip: string | null
          mime_type: string | null
          size_bytes: number | null
          user_id: string
        }
        Insert: {
          bill_total?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          image_path?: string | null
          ip?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          user_id: string
        }
        Update: {
          bill_total?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          image_path?: string | null
          ip?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      split_items: {
        Row: {
          assigned_to: string[] | null
          assignee_count: number | null
          created_at: string
          id: string
          name: string | null
          price: number | null
          quantity: number | null
          session_id: string
        }
        Insert: {
          assigned_to?: string[] | null
          assignee_count?: number | null
          created_at?: string
          id?: string
          name?: string | null
          price?: number | null
          quantity?: number | null
          session_id: string
        }
        Update: {
          assigned_to?: string[] | null
          assignee_count?: number | null
          created_at?: string
          id?: string
          name?: string | null
          price?: number | null
          quantity?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "split_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "split_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      split_participants: {
        Row: {
          amount_owed: number | null
          created_at: string
          id: string
          items_assigned_count: number | null
          name: string | null
          session_id: string
        }
        Insert: {
          amount_owed?: number | null
          created_at?: string
          id?: string
          items_assigned_count?: number | null
          name?: string | null
          session_id: string
        }
        Update: {
          amount_owed?: number | null
          created_at?: string
          id?: string
          items_assigned_count?: number | null
          name?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "split_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "split_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      split_sessions: {
        Row: {
          bill_total: number | null
          created_at: string
          currency: string | null
          id: string
          items_count: number | null
          people_count: number | null
          scan_log_id: string | null
          service_total: number | null
          split_mode: string | null
          subtotal: number | null
          tax_total: number | null
          tip_total: number | null
        }
        Insert: {
          bill_total?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          items_count?: number | null
          people_count?: number | null
          scan_log_id?: string | null
          service_total?: number | null
          split_mode?: string | null
          subtotal?: number | null
          tax_total?: number | null
          tip_total?: number | null
        }
        Update: {
          bill_total?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          items_count?: number | null
          people_count?: number | null
          scan_log_id?: string | null
          service_total?: number | null
          split_mode?: string | null
          subtotal?: number | null
          tax_total?: number | null
          tip_total?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_split_totals: {
        Args: never
        Returns: {
          currency: string
          scan_count: number
          scan_count_30d: number
          scan_count_7d: number
          total_value: number
          total_value_30d: number
          total_value_7d: number
        }[]
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
