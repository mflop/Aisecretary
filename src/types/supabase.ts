export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          company_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          notes: string | null
          last_appointment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          company_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          last_appointment?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          last_appointment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      client_custom_fields: {
        Row: {
          id: string
          created_at: string
          company_id: string
          field_name: string
          field_type: "text" | "number" | "date" | "boolean" | "select"
          field_options: string[] | null
          is_required: boolean
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          company_id: string
          field_name: string
          field_type: "text" | "number" | "date" | "boolean" | "select"
          field_options?: string[] | null
          is_required?: boolean
          display_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string
          field_name?: string
          field_type?: "text" | "number" | "date" | "boolean" | "select"
          field_options?: string[] | null
          is_required?: boolean
          display_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_custom_fields_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      client_custom_values: {
        Row: {
          id: string
          created_at: string
          client_id: string
          field_id: string
          value: string
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          field_id: string
          value: string
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          field_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_custom_values_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_custom_values_field_id_fkey"
            columns: ["field_id"]
            referencedRelation: "client_custom_fields"
            referencedColumns: ["id"]
          }
        ]
      }
      companies: {
        Row: {
          id: string
          created_at: string
          name: string
          address: string | null
          cui: string | null
          reg_number: string | null
          user_id: string
          email: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          address?: string | null
          cui?: string | null
          reg_number?: string | null
          user_id: string
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          address?: string | null
          cui?: string | null
          reg_number?: string | null
          user_id?: string
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          company_id: string
          client_id: string
          start_time: string
          end_time: string
          title: string
          notes: string | null
          status: "scheduled" | "completed" | "cancelled"
        }
        Insert: {
          id?: string
          created_at?: string
          company_id: string
          client_id: string
          start_time: string
          end_time: string
          title: string
          notes?: string | null
          status?: "scheduled" | "completed" | "cancelled"
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string
          client_id?: string
          start_time?: string
          end_time?: string
          title?: string
          notes?: string | null
          status?: "scheduled" | "completed" | "cancelled"
        }
        Relationships: [
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          created_at: string
          company_id: string
          client_id: string | null
          content: string
          type: "sms" | "email" | "whatsapp"
          status: "draft" | "sent" | "delivered" | "failed"
          is_ai_generated: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          company_id: string
          client_id?: string | null
          content: string
          type: "sms" | "email" | "whatsapp"
          status?: "draft" | "sent" | "delivered" | "failed"
          is_ai_generated?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string
          client_id?: string | null
          content?: string
          type?: "sms" | "email" | "whatsapp"
          status?: "draft" | "sent" | "delivered" | "failed"
          is_ai_generated?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      message_templates: {
        Row: {
          id: string
          created_at: string
          company_id: string
          name: string
          content: string
          type: "sms" | "email" | "whatsapp"
          industry: string | null
          purpose: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          company_id: string
          name: string
          content: string
          type: "sms" | "email" | "whatsapp"
          industry?: string | null
          purpose?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string
          name?: string
          content?: string
          type?: "sms" | "email" | "whatsapp"
          industry?: string | null
          purpose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          created_at: string
          company_id: string
          client_id: string
          invoice_number: string
          issue_date: string
          due_date: string
          status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
          total_amount: number
          payment_method: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          company_id: string
          client_id: string
          invoice_number: string
          issue_date: string
          due_date: string
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled"
          total_amount: number
          payment_method?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string
          client_id?: string
          invoice_number?: string
          issue_date?: string
          due_date?: string
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled"
          total_amount?: number
          payment_method?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      invoice_items: {
        Row: {
          id: string
          created_at: string
          invoice_id: string
          name: string
          description: string | null
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          id?: string
          created_at?: string
          invoice_id: string
          name: string
          description?: string | null
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: {
          id?: string
          created_at?: string
          invoice_id?: string
          name?: string
          description?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          created_at: string
          company_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: "free" | "pro"
          status: "active" | "canceled" | "past_due" | "unpaid"
          current_period_end: string | null
          ai_messages_used: number
          ai_messages_limit: number
        }
        Insert: {
          id?: string
          created_at?: string
          company_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: "free" | "pro"
          status?: "active" | "canceled" | "past_due" | "unpaid"
          current_period_end?: string | null
          ai_messages_used?: number
          ai_messages_limit?: number
        }
        Update: {
          id?: string
          created_at?: string
          company_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: "free" | "pro"
          status?: "active" | "canceled" | "past_due" | "unpaid"
          current_period_end?: string | null
          ai_messages_used?: number
          ai_messages_limit?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
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