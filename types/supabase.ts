export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      worker_profiles: {
        Row: {
          worker_id: string;
          full_name: string;
          city: string;
          job_category: string;
          years_experience: number;
          trust_score: number;
          bio: string;
          location_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          worker_id: string;
          full_name: string;
          city: string;
          job_category: string;
          years_experience?: number;
          trust_score?: number;
          bio?: string;
          location_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          worker_id?: string;
          full_name?: string;
          city?: string;
          job_category?: string;
          years_experience?: number;
          trust_score?: number;
          bio?: string;
          location_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      employer_profiles: {
        Row: {
          employer_id: string;
          company_name: string;
          city: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          employer_id: string;
          company_name: string;
          city: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          employer_id?: string;
          company_name?: string;
          city?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      community_verifications: {
        Row: {
          verification_id: string;
          worker_id: string;
          verifier_name: string;
          verifier_role: string;
          statement: string | null;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          verification_id?: string;
          worker_id: string;
          verifier_name: string;
          verifier_role: string;
          statement?: string | null;
          rating?: number | null;
          created_at?: string;
        };
        Update: {
          verification_id?: string;
          worker_id?: string;
          verifier_name?: string;
          verifier_role?: string;
          statement?: string | null;
          rating?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      proof_of_work: {
        Row: {
          proof_id: string;
          worker_id: string;
          job_type: string;
          job_value: number | null;
          photo_before_url: string | null;
          photo_after_url: string | null;
          location_lat: number | null;
          location_lng: number | null;
          customer_confirmed: boolean;
          verified: boolean;
          job_date: string;
          created_at: string;
        };
        Insert: {
          proof_id?: string;
          worker_id: string;
          job_type: string;
          job_value?: number | null;
          photo_before_url?: string | null;
          photo_after_url?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          customer_confirmed?: boolean;
          verified?: boolean;
          job_date: string;
          created_at?: string;
        };
        Update: {
          proof_id?: string;
          worker_id?: string;
          job_type?: string;
          job_value?: number | null;
          photo_before_url?: string | null;
          photo_after_url?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          customer_confirmed?: boolean;
          verified?: boolean;
          job_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      wage_estimates: {
        Row: {
          estimate_id: string;
          city: string;
          job_type: string;
          experience_band: string;
          min_wage: number;
          max_wage: number;
          updated_at: string;
        };
        Insert: {
          estimate_id?: string;
          city: string;
          job_type: string;
          experience_band: string;
          min_wage: number;
          max_wage: number;
          updated_at?: string;
        };
        Update: {
          estimate_id?: string;
          city?: string;
          job_type?: string;
          experience_band?: string;
          min_wage?: number;
          max_wage?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      agreements: {
        Row: {
          agreement_id: string;
          worker_id: string;
          employer_id: string | null;
          price: number;
          location: string | null;
          work_hours: string | null;
          job_description: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          agreement_id?: string;
          worker_id: string;
          employer_id?: string | null;
          price: number;
          location?: string | null;
          work_hours?: string | null;
          job_description?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          agreement_id?: string;
          worker_id?: string;
          employer_id?: string | null;
          price?: number;
          location?: string | null;
          work_hours?: string | null;
          job_description?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      worker_services: {
        Row: {
          service_id: string;
          worker_id: string;
          name: string;
          description: string | null;
          price: number;
          price_unit: string;
          category: string | null;
          is_active: boolean;
          thumbnail_url: string | null;
          image_urls: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          service_id?: string;
          worker_id: string;
          name: string;
          description?: string | null;
          price: number;
          price_unit?: string;
          category?: string | null;
          is_active?: boolean;
          thumbnail_url?: string | null;
          image_urls?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          service_id?: string;
          worker_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          price_unit?: string;
          category?: string | null;
          is_active?: boolean;
          thumbnail_url?: string | null;
          image_urls?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trust_score: {
        Row: {
          worker_id: string;
          score: number;
          breakdown: Json;
          updated_at: string;
        };
        Insert: {
          worker_id: string;
          score?: number;
          breakdown?: Json;
          updated_at?: string;
        };
        Update: {
          worker_id?: string;
          score?: number;
          breakdown?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
