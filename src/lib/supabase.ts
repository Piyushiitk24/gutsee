import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'

// Browser client for client-side operations
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server client for server-side operations (to be used in Server Components and API routes)
export const createServerClient = (cookieStore: any) => {
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options)
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
          colostomy_date: string | null
          medical_notes: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
          colostomy_date?: string | null
          medical_notes?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
          colostomy_date?: string | null
          medical_notes?: string | null
        }
      }
      foods: {
        Row: {
          id: string
          name: string
          brand: string | null
          barcode: string | null
          category: string | null
          description: string | null
          calories: number | null
          protein: number | null
          fat: number | null
          carbs: number | null
          fiber: number | null
          sugar: number | null
          sodium: number | null
          is_custom: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand?: string | null
          barcode?: string | null
          category?: string | null
          description?: string | null
          calories?: number | null
          protein?: number | null
          fat?: number | null
          carbs?: number | null
          fiber?: number | null
          sugar?: number | null
          sodium?: number | null
          is_custom?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string | null
          barcode?: string | null
          category?: string | null
          description?: string | null
          calories?: number | null
          protein?: number | null
          fat?: number | null
          carbs?: number | null
          fiber?: number | null
          sugar?: number | null
          sodium?: number | null
          is_custom?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          name: string | null
          notes: string | null
          timestamp: string
          location: string | null
          meal_type: string
          is_planned: boolean
          confidence: number | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          notes?: string | null
          timestamp: string
          location?: string | null
          meal_type: string
          is_planned?: boolean
          confidence?: number | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          notes?: string | null
          timestamp?: string
          location?: string | null
          meal_type?: string
          is_planned?: boolean
          confidence?: number | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      stoma_outputs: {
        Row: {
          id: string
          timestamp: string
          volume: number | null
          consistency: string | null
          color: string | null
          notes: string | null
          is_first_after_irrigation: boolean
          hours_since_irrigation: number | null
          hours_since_last_meal: number | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          timestamp: string
          volume?: number | null
          consistency?: string | null
          color?: string | null
          notes?: string | null
          is_first_after_irrigation?: boolean
          hours_since_irrigation?: number | null
          hours_since_last_meal?: number | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          timestamp?: string
          volume?: number | null
          consistency?: string | null
          color?: string | null
          notes?: string | null
          is_first_after_irrigation?: boolean
          hours_since_irrigation?: number | null
          hours_since_last_meal?: number | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      gas_sessions: {
        Row: {
          id: string
          timestamp: string
          duration: number | null
          intensity: number
          frequency: number | null
          notes: string | null
          is_nighttime: boolean
          is_public: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          timestamp: string
          duration?: number | null
          intensity: number
          frequency?: number | null
          notes?: string | null
          is_nighttime?: boolean
          is_public?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          timestamp?: string
          duration?: number | null
          intensity?: number
          frequency?: number | null
          notes?: string | null
          is_nighttime?: boolean
          is_public?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      irrigations: {
        Row: {
          id: string
          timestamp: string
          quality: string
          duration: number | null
          volume: number | null
          notes: string | null
          completeness: number
          comfort: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          timestamp: string
          quality: string
          duration?: number | null
          volume?: number | null
          notes?: string | null
          completeness: number
          comfort: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          timestamp?: string
          quality?: string
          duration?: number | null
          volume?: number | null
          notes?: string | null
          completeness?: number
          comfort?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meal_type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'OTHER'
      output_consistency: 'LIQUID' | 'SOFT' | 'FORMED' | 'HARD'
      irrigation_quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      symptom_type: 'CRAMPING' | 'BLOATING' | 'NAUSEA' | 'FATIGUE' | 'PAIN' | 'OTHER'
      pattern_type: 'FOOD_OUTPUT' | 'FOOD_GAS' | 'TIMING' | 'IRRIGATION' | 'SYMPTOM'
    }
  }
}
