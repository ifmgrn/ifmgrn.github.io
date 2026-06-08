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
      atoms: {
        Row: {
          atomic_number: number
          atomic_weight: number
          atomic_weight_uncertainty: number | null
          chemical_serie: Database["public"]["Enums"]["chemical_serie"]
          group: number
          name: string
          period: number
          short_lived: boolean
          state: Database["public"]["Enums"]["phase"] | null
          symbol: string
          updated_at: string | null
        }
        Insert: {
          atomic_number?: number
          atomic_weight: number
          atomic_weight_uncertainty?: number | null
          chemical_serie: Database["public"]["Enums"]["chemical_serie"]
          group: number
          name: string
          period: number
          short_lived?: boolean
          state?: Database["public"]["Enums"]["phase"] | null
          symbol: string
          updated_at?: string | null
        }
        Update: {
          atomic_number?: number
          atomic_weight?: number
          atomic_weight_uncertainty?: number | null
          chemical_serie?: Database["public"]["Enums"]["chemical_serie"]
          group?: number
          name?: string
          period?: number
          short_lived?: boolean
          state?: Database["public"]["Enums"]["phase"] | null
          symbol?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          catalysts: string[]
          catalysts_tsv: unknown
          classifications: string[] | null
          classifications_tsv: unknown
          created_at: string
          description: string | null
          equation: string | null
          fts: unknown
          id: number
          name: string
          name_fts: unknown
          products: string[]
          products_tsv: unknown
          reactants: string[]
          reactants_tsv: unknown
          user_id: number | null
          youtube_video_id: string | null
        }
        Insert: {
          catalysts?: string[]
          catalysts_tsv?: unknown
          classifications?: string[] | null
          classifications_tsv?: unknown
          created_at?: string
          description?: string | null
          equation?: string | null
          fts?: unknown
          id?: number
          name: string
          name_fts?: unknown
          products: string[]
          products_tsv?: unknown
          reactants: string[]
          reactants_tsv?: unknown
          user_id?: number | null
          youtube_video_id?: string | null
        }
        Update: {
          catalysts?: string[]
          catalysts_tsv?: unknown
          classifications?: string[] | null
          classifications_tsv?: unknown
          created_at?: string
          description?: string | null
          equation?: string | null
          fts?: unknown
          id?: number
          name?: string
          name_fts?: unknown
          products?: string[]
          products_tsv?: unknown
          reactants?: string[]
          reactants_tsv?: unknown
          user_id?: number | null
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "suap_users"
            referencedColumns: ["suap_id"]
          },
        ]
      }
      suap_users: {
        Row: {
          auth_id: string
          created_at: string | null
          name: string
          photo_relurl: string | null
          ra: string
          role: string | null
          suap_id: number
          updated_at: string
        }
        Insert: {
          auth_id: string
          created_at?: string | null
          name: string
          photo_relurl?: string | null
          ra: string
          role?: string | null
          suap_id?: number
          updated_at?: string
        }
        Update: {
          auth_id?: string
          created_at?: string | null
          name?: string
          photo_relurl?: string | null
          ra?: string
          role?: string | null
          suap_id?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_reaction_by_id: {
        Args: { reaction_id: number }
        Returns: {
          catalysts: string[]
          classifications: string[]
          description: string
          equation: string
          id: number
          name: string
          products: string[]
          reactants: string[]
          user_id: number
          youtube_video_id: string
        }[]
      }
      search_reactions:
        | {
            Args: {
              classification_q?: string
              l?: number
              products_q?: string
              q?: string
              reactants_q?: string
            }
            Returns: {
              catalysts: string[]
              classifications: string[]
              description: string
              equation: string
              id: number
              name: string
              products: string[]
              reactants: string[]
              user_id: number
              youtube_video_id: string
            }[]
          }
        | {
            Args: { l: number; q: string }
            Returns: {
              catalysts: string[]
              catalysts_tsv: unknown
              classifications: string[] | null
              classifications_tsv: unknown
              created_at: string
              description: string | null
              equation: string | null
              fts: unknown
              id: number
              name: string
              name_fts: unknown
              products: string[]
              products_tsv: unknown
              reactants: string[]
              reactants_tsv: unknown
              user_id: number | null
              youtube_video_id: string | null
            }[]
            SetofOptions: {
              from: "*"
              to: "reactions"
              isOneToOne: false
              isSetofReturn: true
            }
          }
        | {
            Args: {
              l: number
              products_q?: string
              q: string
              reactants_q?: string
            }
            Returns: {
              classifications: Database["public"]["Enums"]["reaction_type"][]
              description: string
              equation: string
              id: number
              name: string
              products: string
              reactants: string
              user_id: number
              youtube_video_id: string
            }[]
          }
    }
    Enums: {
      chemical_serie:
        | "Não-Metal"
        | "Gás Nobre"
        | "Metal Alcalino"
        | "Metal Alcalino-Terroso"
        | "Semimetal"
        | "Metal Pós-Transição"
        | "Halogênio"
        | "Metal de Transição"
        | "Lantanídeo"
        | "Actinídeo"
      phase: "Gás" | "Líquido" | "Sólido" | "Aquoso"
      reaction_type:
        | "Síntese"
        | "Decomposição"
        | "Substituição"
        | "Metátese"
        | "Oxirredução"
        | "Combustão"
        | "Ácido-Base"
      specie_role: "Reagente" | "Produto" | "Catalisador"
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
      chemical_serie: [
        "Não-Metal",
        "Gás Nobre",
        "Metal Alcalino",
        "Metal Alcalino-Terroso",
        "Semimetal",
        "Metal Pós-Transição",
        "Halogênio",
        "Metal de Transição",
        "Lantanídeo",
        "Actinídeo",
      ],
      phase: ["Gás", "Líquido", "Sólido", "Aquoso"],
      reaction_type: [
        "Síntese",
        "Decomposição",
        "Substituição",
        "Metátese",
        "Oxirredução",
        "Combustão",
        "Ácido-Base",
      ],
      specie_role: ["Reagente", "Produto", "Catalisador"],
    },
  },
} as const
