export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentGateway = 'razorpay' | 'payu'
export type SubscriptionStatus = 'active' | 'halted' | 'cancelled' | 'completed' | 'pending'

export type Database = {
  public: {
    Tables: {
      quiz_leads: {
        Row: {
          id: string
          name: string
          email: string
          whatsapp: string
          recommendation: string
          quiz_answers: Json | null
          device_type: string | null
          referral_source: string | null
          wix_sync_status: 'pending' | 'synced' | 'failed'
          wix_contact_id: string | null
          wix_sync_error: string | null
          wix_sync_attempts: number
          // Payment fields
          payment_status: PaymentStatus | null
          payment_id: string | null
          payment_amount: number | null
          program_purchased: string | null
          subscription_id: string | null
          payment_gateway: PaymentGateway | null
          paid_at: string | null
          program_start_date: string | null
          // Subscription tracking fields
          wix_order_id: string | null
          wix_member_id: string | null
          subscription_status: SubscriptionStatus | null
          subscription_end_at: string | null
          last_renewal_at: string | null
          renewal_count: number
          // Payment Wix sync tracking
          wix_payment_sync_status: 'pending' | 'synced' | 'failed' | null
          wix_payment_sync_attempts: number
          wix_payment_sync_error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          whatsapp: string
          recommendation: string
          quiz_answers?: Json | null
          device_type?: string | null
          referral_source?: string | null
          wix_sync_status?: 'pending' | 'synced' | 'failed'
          wix_contact_id?: string | null
          wix_sync_error?: string | null
          wix_sync_attempts?: number
          // Payment fields
          payment_status?: PaymentStatus | null
          payment_id?: string | null
          payment_amount?: number | null
          program_purchased?: string | null
          subscription_id?: string | null
          payment_gateway?: PaymentGateway | null
          paid_at?: string | null
          program_start_date?: string | null
          // Subscription tracking fields
          wix_order_id?: string | null
          wix_member_id?: string | null
          subscription_status?: SubscriptionStatus | null
          subscription_end_at?: string | null
          last_renewal_at?: string | null
          renewal_count?: number
          // Payment Wix sync tracking
          wix_payment_sync_status?: 'pending' | 'synced' | 'failed' | null
          wix_payment_sync_attempts?: number
          wix_payment_sync_error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          whatsapp?: string
          recommendation?: string
          quiz_answers?: Json | null
          device_type?: string | null
          referral_source?: string | null
          wix_sync_status?: 'pending' | 'synced' | 'failed'
          wix_contact_id?: string | null
          wix_sync_error?: string | null
          wix_sync_attempts?: number
          // Payment fields
          payment_status?: PaymentStatus | null
          payment_id?: string | null
          payment_amount?: number | null
          program_purchased?: string | null
          subscription_id?: string | null
          payment_gateway?: PaymentGateway | null
          paid_at?: string | null
          program_start_date?: string | null
          // Subscription tracking fields
          wix_order_id?: string | null
          wix_member_id?: string | null
          subscription_status?: SubscriptionStatus | null
          subscription_end_at?: string | null
          last_renewal_at?: string | null
          renewal_count?: number
          // Payment Wix sync tracking
          wix_payment_sync_status?: 'pending' | 'synced' | 'failed' | null
          wix_payment_sync_attempts?: number
          wix_payment_sync_error?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
