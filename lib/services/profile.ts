import { createClient } from "@/lib/supabase/server"
import type { ProfileData, Listing, Contract, Review, Document, ChartData, ActivityEntry } from "@/lib/profile/mock-data"

export async function getWorkerProfile(userId: string): Promise<ProfileData | null> {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("worker_id", userId)
    .single()

  if (error || !profile) return null

  const { data: { user } } = await supabase.auth.getUser()

  const { count: completedJobs } = await supabase
    .from("proof_of_work")
    .select("*", { count: "exact", head: true })
    .eq("worker_id", userId)
    .eq("customer_confirmed", true)

  const { count: totalProofs } = await supabase
    .from("proof_of_work")
    .select("*", { count: "exact", head: true })
    .eq("worker_id", userId)

  const { count: verificationCount } = await supabase
    .from("community_verifications")
    .select("*", { count: "exact", head: true })
    .eq("worker_id", userId)

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "-"

  const avatarUrl = user?.user_metadata?.avatar_url ?? undefined

  return {
    id: userId,
    name: profile.full_name,
    role: profile.job_category,
    trustScore: profile.trust_score,
    bio: "",
    location: profile.city,
    memberSince,
    contact: user?.email ?? undefined,
    completedJobs: completedJobs ?? 0,
    activeListings: 0,
    rating: 0,
    reviewCount: 0,
    avatarUrl,
    verifications: {
      idVerified: false,
      companyVerified: false,
      paymentVerified: false,
    },
  }
}

export function getEmptyProfile(userId: string, fullName: string): ProfileData {
  return {
    id: userId,
    name: fullName,
    role: "-",
    trustScore: 0,
    bio: "",
    location: "-",
    memberSince: "-",
    contact: undefined,
    completedJobs: 0,
    activeListings: 0,
    rating: 0,
    reviewCount: 0,
    avatarUrl: undefined,
    verifications: {
      idVerified: false,
      companyVerified: false,
      paymentVerified: false,
    },
  }
}

export async function getWorkerListings(userId: string): Promise<Listing[]> {
  return []
}

export async function getWorkerContracts(userId: string): Promise<Contract[]> {
  return []
}

export async function getWorkerReviews(userId: string): Promise<Review[]> {
  return []
}

export async function getWorkerDocuments(userId: string): Promise<Document[]> {
  return []
}

export async function getWorkerChartData(userId: string): Promise<ChartData[]> {
  return []
}

export async function getWorkerActivity(userId: string): Promise<ActivityEntry[]> {
  return []
}
