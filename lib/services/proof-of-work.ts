import { createAdminClient } from "@/lib/supabase/admin";
import { getAgreementById } from "@/lib/repositories/agreement.repo";
import {
  createProofOfWork,
  getProofOfWorkByAgreement,
  updateProofOfWork,
} from "@/lib/repositories/proof-of-work.repo";

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BUCKET = "proof-photos";

export class ProofOfWorkForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProofOfWorkForbiddenError";
  }
}

export class InvalidPhotoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPhotoError";
  }
}

export async function uploadProofPhoto(
  agreementId: string,
  fileType: "before" | "after",
  file: File,
  workerId: string,
) {
  const admin = createAdminClient();
  const agreement = await getAgreementById(admin, agreementId);
  if (!agreement) {
    throw new ProofOfWorkForbiddenError("Agreement not found");
  }
  if (agreement.worker_id !== workerId) {
    throw new ProofOfWorkForbiddenError("Actor is not the worker of this agreement");
  }
  if (agreement.status !== "active") {
    throw new ProofOfWorkForbiddenError(
      "Photos can only be uploaded while the agreement is active",
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new InvalidPhotoError("File harus berupa gambar PNG, JPEG, atau WebP");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new InvalidPhotoError("Ukuran file maksimal 5 MB");
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const objectKey = `${workerId}/${agreementId}/${fileType}-${Date.now()}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(objectKey, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new InvalidPhotoError("Gagal mengunggah foto. Silakan coba lagi.");
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(objectKey);
  const photoUrl = urlData.publicUrl;

  const existing = await getProofOfWorkByAgreement(admin, agreementId);

  if (existing) {
    const patch = fileType === "before"
      ? { photoBeforeUrl: photoUrl }
      : { photoAfterUrl: photoUrl };
    return updateProofOfWork(admin, existing.proof_id, patch);
  }

  const jobCategory = agreement.worker_profiles?.job_category ?? "Pekerjaan";
  return createProofOfWork(admin, {
    workerId,
    agreementId,
    jobType: jobCategory,
    jobValue: agreement.price,
    jobDate: new Date().toISOString().slice(0, 10),
    photoBeforeUrl: fileType === "before" ? photoUrl : null,
    photoAfterUrl: fileType === "after" ? photoUrl : null,
    customerConfirmed: false,
    verified: false,
  });
}
