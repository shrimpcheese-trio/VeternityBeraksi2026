import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  listReviewsByWorker,
  listReviewsByEmployer,
} from "@/lib/repositories/review.repo"
import { listServicesByWorker } from "@/lib/repositories/worker-service.repo"
import { resolveAvatarUrl } from "@/lib/avatar"
import type { ProfileData, Review } from "@/lib/profile/mock-data"
import type { Database } from "@/types/supabase"

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

  const { data: reviewRatings } = await supabase
    .from("reviews")
    .select("rating")
    .eq("worker_id", userId)
  const ratings = reviewRatings ?? []
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "-"

  const avatarUrl = resolveAvatarUrl(user)

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
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: ratings.length,
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

export type WorkerServiceRow = Database["public"]["Tables"]["worker_services"]["Row"];

export async function getWorkerServices(userId: string, activeOnly = true): Promise<WorkerServiceRow[]> {
  const admin = createAdminClient()
  return listServicesByWorker(admin, userId, activeOnly)
}

export async function getWorkerReviews(userId: string): Promise<Review[]> {
  const admin = createAdminClient()
  const reviews = await listReviewsByWorker(admin, userId)

  return reviews.map((review) => {
    const reviewerName = review.employer_profiles?.company_name ?? "Pemberi Kerja"
    const initials = reviewerName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    return {
      id: review.review_id,
      reviewerInitials: initials,
      reviewerName,
      rating: review.rating,
      comment: review.comment ?? "",
      date: new Date(review.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      service: review.agreements?.job_description ?? undefined,
    }
  })
}

export async function getEmployerReviews(userId: string): Promise<Review[]> {
  const admin = createAdminClient()
  const reviews = await listReviewsByEmployer(admin, userId)

  return reviews.map((review) => {
    const workerName = review.worker_profiles?.full_name ?? "Pekerja"
    const initials = workerName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    return {
      id: review.review_id,
      reviewerInitials: initials,
      reviewerName: workerName,
      rating: review.rating,
      comment: review.comment ?? "",
      date: new Date(review.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      service: review.agreements?.job_description ?? undefined,
    }
  })
}
