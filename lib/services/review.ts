import { createAdminClient } from "@/lib/supabase/admin";
import { getAgreementById } from "@/lib/repositories/agreement.repo";
import {
  getProofOfWorkByAgreement,
  updateProofOfWork,
} from "@/lib/repositories/proof-of-work.repo";
import { upsertReview } from "@/lib/repositories/review.repo";
import type { ReviewInput } from "@/lib/validators/review";
import { computeTrustScore } from "@/lib/services/trust-engine";

export class ReviewNotFoundError extends Error {
  constructor() {
    super("Agreement not found");
    this.name = "ReviewNotFoundError";
  }
}

export class ReviewForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewForbiddenError";
  }
}

export class InvalidReviewPhotoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidReviewPhotoError";
  }
}

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BUCKET = "review-photos";

export async function uploadReviewPhoto(
  agreementId: string,
  file: File,
  employerId: string,
) {
  const admin = createAdminClient();
  const agreement = await getAgreementById(admin, agreementId);
  if (!agreement) {
    throw new ReviewNotFoundError();
  }
  if (agreement.employer_id !== employerId) {
    throw new ReviewForbiddenError("Only the employer of this agreement can attach photos");
  }
  if (agreement.status !== "completed") {
    throw new ReviewForbiddenError(
      "Photos can only be attached once the agreement is completed",
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new InvalidReviewPhotoError("File harus berupa gambar PNG, JPEG, atau WebP");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new InvalidReviewPhotoError("Ukuran file maksimal 5 MB");
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const objectKey = `${employerId}/${agreementId}/photo-${Date.now()}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(objectKey, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new InvalidReviewPhotoError("Gagal mengunggah foto. Silakan coba lagi.");
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(objectKey);
  return urlData.publicUrl;
}

export async function submitReview(input: ReviewInput, employerId: string) {
  const admin = createAdminClient();
  const agreement = await getAgreementById(admin, input.agreementId);
  if (!agreement) {
    throw new ReviewNotFoundError();
  }
  if (agreement.employer_id !== employerId) {
    throw new ReviewForbiddenError("Only the employer of this agreement can review it");
  }
  if (agreement.status !== "completed") {
    throw new ReviewForbiddenError(
      "Reviews can only be submitted once the agreement is completed",
    );
  }

  const proof = await getProofOfWorkByAgreement(admin, input.agreementId);
  if (proof && !proof.customer_confirmed) {
    await updateProofOfWork(admin, proof.proof_id, { customerConfirmed: true });
  }

  const review = await upsertReview(admin, {
    agreementId: input.agreementId,
    employerId,
    workerId: agreement.worker_id,
    rating: input.rating,
    comment: input.comment ?? null,
    photoUrls: input.photoUrls,
  });

  await computeTrustScore(agreement.worker_id);

  return review;
}
