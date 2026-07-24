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
          created_at?: string;
          updated_at?: string;
        };
      };
      community_verifications: {
        Row: {
          verification_id: string;
          worker_id: string;
          verifier_name: string;
          verifier_role: string;
          statement: string | null;
          created_at: string;
        };
        Insert: {
          verification_id?: string;
          worker_id: string;
          verifier_name: string;
          verifier_role: string;
          statement?: string | null;
          created_at?: string;
        };
        Update: {
          verification_id?: string;
          worker_id?: string;
          verifier_name?: string;
          verifier_role?: string;
          statement?: string | null;
          created_at?: string;
        };
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
          job_date?: string;
          created_at?: string;
        };
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
          created_at?: string;
        };
      };
    };
  };
}