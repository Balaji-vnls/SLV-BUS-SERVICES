import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      buses: {
        Row: {
          id: string
          bus_number: string
          bus_type: string
          operator: string
          total_seats: number
          amenities: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bus_number: string
          bus_type: string
          operator: string
          total_seats: number
          amenities?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bus_number?: string
          bus_type?: string
          operator?: string
          total_seats?: number
          amenities?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          from_city: string
          to_city: string
          distance_km: number
          duration_hours: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          from_city: string
          to_city: string
          distance_km: number
          duration_hours: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          from_city?: string
          to_city?: string
          distance_km?: number
          duration_hours?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          bus_id: string
          route_id: string
          departure_time: string
          arrival_time: string
          price: number
          available_seats: number
          journey_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bus_id: string
          route_id: string
          departure_time: string
          arrival_time: string
          price: number
          available_seats: number
          journey_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bus_id?: string
          route_id?: string
          departure_time?: string
          arrival_time?: string
          price?: number
          available_seats?: number
          journey_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          schedule_id: string
          seat_numbers: string[]
          passenger_details: any
          total_amount: number
          booking_status: string
          payment_status: string
          payment_id: string | null
          booking_reference: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          schedule_id: string
          seat_numbers: string[]
          passenger_details: any
          total_amount: number
          booking_status?: string
          payment_status?: string
          payment_id?: string | null
          booking_reference: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          schedule_id?: string
          seat_numbers?: string[]
          passenger_details?: any
          total_amount?: number
          booking_status?: string
          payment_status?: string
          payment_id?: string | null
          booking_reference?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string | null
          date_of_birth: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone?: string | null
          date_of_birth?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string | null
          date_of_birth?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}