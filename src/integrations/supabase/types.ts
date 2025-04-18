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
      assemblies: {
        Row: {
          created_at: string
          description: string
          id: string
          last_maintenance: string
          location: string
          name: string
          next_maintenance: string
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          id: string
          last_maintenance: string
          location: string
          name: string
          next_maintenance: string
          status: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          last_maintenance?: string
          location?: string
          name?: string
          next_maintenance?: string
          status?: string
        }
        Relationships: []
      }
      assembly_assets: {
        Row: {
          assembly_id: string
          asset_id: string
        }
        Insert: {
          assembly_id: string
          asset_id: string
        }
        Update: {
          assembly_id?: string
          asset_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assembly_assets_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assembly_assets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          accessories: string[] | null
          assigned_to: string
          created_at: string
          division: string | null
          expansion_cards: string[] | null
          hostname: string | null
          id: string
          inventory_number: string
          location: string
          monitor: string | null
          motherboard: string | null
          name: string
          operating_system: string | null
          peripherals: string[] | null
          processor: string | null
          purchase_date: string
          ram: string | null
          status: string
          storage: string | null
          type: string
          user_account: string | null
          warranty: string
          windows_license: string | null
        }
        Insert: {
          accessories?: string[] | null
          assigned_to: string
          created_at?: string
          division?: string | null
          expansion_cards?: string[] | null
          hostname?: string | null
          id: string
          inventory_number: string
          location: string
          monitor?: string | null
          motherboard?: string | null
          name: string
          operating_system?: string | null
          peripherals?: string[] | null
          processor?: string | null
          purchase_date: string
          ram?: string | null
          status: string
          storage?: string | null
          type: string
          user_account?: string | null
          warranty: string
          windows_license?: string | null
        }
        Update: {
          accessories?: string[] | null
          assigned_to?: string
          created_at?: string
          division?: string | null
          expansion_cards?: string[] | null
          hostname?: string | null
          id?: string
          inventory_number?: string
          location?: string
          monitor?: string | null
          motherboard?: string | null
          name?: string
          operating_system?: string | null
          peripherals?: string[] | null
          processor?: string | null
          purchase_date?: string
          ram?: string | null
          status?: string
          storage?: string | null
          type?: string
          user_account?: string | null
          warranty?: string
          windows_license?: string | null
        }
        Relationships: []
      }
      components: {
        Row: {
          created_at: string
          id: string
          manufacturer: string | null
          model: string | null
          name: string
          serial_number: string | null
          specifications: Json | null
          subtype: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id: string
          manufacturer?: string | null
          model?: string | null
          name: string
          serial_number?: string | null
          specifications?: Json | null
          subtype?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          manufacturer?: string | null
          model?: string | null
          name?: string
          serial_number?: string | null
          specifications?: Json | null
          subtype?: string | null
          type?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      maintenance_tasks: {
        Row: {
          assembly_id: string | null
          asset_id: string | null
          assigned_to: string
          completed_date: string | null
          created_at: string
          description: string
          id: string
          next_occurrence: string | null
          priority: string
          recurring: string
          scheduled_date: string
          status: string
          title: string
        }
        Insert: {
          assembly_id?: string | null
          asset_id?: string | null
          assigned_to: string
          completed_date?: string | null
          created_at?: string
          description: string
          id: string
          next_occurrence?: string | null
          priority: string
          recurring: string
          scheduled_date: string
          status: string
          title: string
        }
        Update: {
          assembly_id?: string | null
          asset_id?: string | null
          assigned_to?: string
          completed_date?: string | null
          created_at?: string
          description?: string
          id?: string
          next_occurrence?: string | null
          priority?: string
          recurring?: string
          scheduled_date?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          department_id: string | null
          email: string
          id: string
          last_login: string | null
          name: string
          role: string
          status: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email: string
          id: string
          last_login?: string | null
          name: string
          role: string
          status: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
