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
      achievements: {
        Row: {
          context: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          metric: string | null
          title: string
          updated_at: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          metric?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          context?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          metric?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          display_order: number
          file_url: string | null
          id: string
          is_active: boolean
          issue_date: string | null
          issuer: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number
          file_url?: string | null
          id?: string
          is_active?: boolean
          issue_date?: string | null
          issuer?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number
          file_url?: string | null
          id?: string
          is_active?: boolean
          issue_date?: string | null
          issuer?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          display_order: number
          end_year: string | null
          field: string | null
          id: string
          institution: string
          is_active: boolean
          location: string | null
          score: string | null
          start_year: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          display_order?: number
          end_year?: string | null
          field?: string | null
          id?: string
          institution: string
          is_active?: boolean
          location?: string | null
          score?: string | null
          start_year?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          display_order?: number
          end_year?: string | null
          field?: string | null
          id?: string
          institution?: string
          is_active?: boolean
          location?: string | null
          score?: string | null
          start_year?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          company_logo_url: string | null
          company_website: string | null
          created_at: string
          description: string | null
          display_order: number
          employment_type: string | null
          end_date: string | null
          id: string
          is_active: boolean
          is_current: boolean
          location: string | null
          responsibilities: string[]
          role: string
          start_date: string | null
          technologies: string[]
          updated_at: string
        }
        Insert: {
          company: string
          company_logo_url?: string | null
          company_website?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_current?: boolean
          location?: string | null
          responsibilities?: string[]
          role: string
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
        }
        Update: {
          company?: string
          company_logo_url?: string | null
          company_website?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_current?: boolean
          location?: string | null
          responsibilities?: string[]
          role?: string
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      leadership_experiences: {
        Row: {
          created_at: string
          date_range: string | null
          description: string | null
          display_order: number
          id: string
          impact: string | null
          is_active: boolean
          logo_url: string | null
          metrics: Json
          organization: string | null
          recognition: string | null
          responsibilities: string[]
          role: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_range?: string | null
          description?: string | null
          display_order?: number
          id?: string
          impact?: string | null
          is_active?: boolean
          logo_url?: string | null
          metrics?: Json
          organization?: string | null
          recognition?: string | null
          responsibilities?: string[]
          role?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_range?: string | null
          description?: string | null
          display_order?: number
          id?: string
          impact?: string | null
          is_active?: boolean
          logo_url?: string | null
          metrics?: Json
          organization?: string | null
          recognition?: string | null
          responsibilities?: string[]
          role?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      positions_of_responsibility: {
        Row: {
          created_at: string
          date_range: string | null
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          organization: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_range?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          organization?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_range?: string | null
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          organization?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about_heading: string
          biography: string
          created_at: string
          current_status: string
          display_order: number
          email: string
          full_name: string
          id: string
          is_active: boolean
          location: string
          phone: string
          professional_focus: string
          professional_title: string
          profile_image_url: string | null
          short_description: string
          summary: string
          tagline: string
          updated_at: string
        }
        Insert: {
          about_heading?: string
          biography?: string
          created_at?: string
          current_status?: string
          display_order?: number
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          location?: string
          phone?: string
          professional_focus?: string
          professional_title?: string
          profile_image_url?: string | null
          short_description?: string
          summary?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          about_heading?: string
          biography?: string
          created_at?: string
          current_status?: string
          display_order?: number
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          location?: string
          phone?: string
          professional_focus?: string
          professional_title?: string
          profile_image_url?: string | null
          short_description?: string
          summary?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          contribution: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          display_order: number
          docs_url: string | null
          end_date: string | null
          features: string[]
          github_url: string | null
          id: string
          images: string[]
          is_active: boolean
          is_featured: boolean
          is_published: boolean
          live_url: string | null
          metrics: Json
          overview: string | null
          problem: string | null
          slug: string | null
          solution: string | null
          start_date: string | null
          status: string | null
          technologies: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          contribution?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          docs_url?: string | null
          end_date?: string | null
          features?: string[]
          github_url?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          is_featured?: boolean
          is_published?: boolean
          live_url?: string | null
          metrics?: Json
          overview?: string | null
          problem?: string | null
          slug?: string | null
          solution?: string | null
          start_date?: string | null
          status?: string | null
          technologies?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          contribution?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          docs_url?: string | null
          end_date?: string | null
          features?: string[]
          github_url?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          is_featured?: boolean
          is_published?: boolean
          live_url?: string | null
          metrics?: Json
          overview?: string | null
          problem?: string | null
          slug?: string | null
          solution?: string | null
          start_date?: string | null
          status?: string | null
          technologies?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          display_order: number
          file_name: string | null
          file_path: string
          id: string
          is_active: boolean
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          file_name?: string | null
          file_path: string
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          file_name?: string | null
          file_path?: string
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string
          contact_email: string
          copyright: string
          created_at: string
          default_theme: string
          favicon_url: string | null
          footer_text: string
          id: string
          is_active: boolean
          meta_description: string
          meta_title: string
          og_image_url: string | null
          site_title: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          contact_email?: string
          copyright?: string
          created_at?: string
          default_theme?: string
          favicon_url?: string | null
          footer_text?: string
          id?: string
          is_active?: boolean
          meta_description?: string
          meta_title?: string
          og_image_url?: string | null
          site_title?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          contact_email?: string
          copyright?: string
          created_at?: string
          default_theme?: string
          favicon_url?: string | null
          footer_text?: string
          id?: string
          is_active?: boolean
          meta_description?: string
          meta_title?: string
          og_image_url?: string | null
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          level: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          level?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          level?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          label: string | null
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          label?: string | null
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          label?: string | null
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
