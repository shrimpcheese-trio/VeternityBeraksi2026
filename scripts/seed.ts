import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const workers = [
  { full_name: "Agus Priyanto", city: "Jakarta Selatan", job_category: "tukang", years_experience: 12, score: 82.5 },
  { full_name: "Budi Santoso", city: "Jakarta Timur", job_category: "ac", years_experience: 8, score: 75.0 },
  { full_name: "Dodi Hermawan", city: "Surabaya", job_category: "montir", years_experience: 15, score: 90.2 },
  { full_name: "Rina Wijaya", city: "Bandung", job_category: "fotografer", years_experience: 6, score: 68.3 },
  { full_name: "Sari Indah", city: "Jakarta Selatan", job_category: "guru", years_experience: 4, score: 71.8 },
  { full_name: "Teguh Prasetyo", city: "Jakarta Utara", job_category: "tukang", years_experience: 10, score: 78.9 },
  { full_name: "Fitri Handayani", city: "Bandung", job_category: "tata_rias", years_experience: 7, score: 85.1 },
  { full_name: "Dimas Ardianto", city: "Surabaya", job_category: "tukang_kayu", years_experience: 9, score: 73.4 },
  { full_name: "Lina Marlina", city: "Jakarta Barat", job_category: "tukang_cat", years_experience: 5, score: 65.7 },
  { full_name: "Hendra Gunawan", city: "Jakarta Pusat", job_category: "ac", years_experience: 11, score: 80.0 },
];

const proofs: { worker_idx: number; job_type: string; job_value: number; verified: boolean }[] = [
  { worker_idx: 0, job_type: "Renovasi Rumah", job_value: 15000000, verified: true },
  { worker_idx: 0, job_type: "Pasang Keramik", job_value: 5000000, verified: true },
  { worker_idx: 0, job_type: "Buat Tembok", job_value: 3000000, verified: true },
  { worker_idx: 1, job_type: "Instalasi AC Split", job_value: 350000, verified: true },
  { worker_idx: 1, job_type: "Service AC", job_value: 200000, verified: true },
  { worker_idx: 1, job_type: "Cuci AC", job_value: 150000, verified: true },
  { worker_idx: 2, job_type: "Service Mobil", job_value: 500000, verified: true },
  { worker_idx: 2, job_type: "Ganti Oli", job_value: 250000, verified: true },
  { worker_idx: 3, job_type: "Paket Wedding", job_value: 3500000, verified: true },
  { worker_idx: 3, job_type: "Prewedding", job_value: 1500000, verified: true },
  { worker_idx: 4, job_type: "Les Matematika", job_value: 75000, verified: true },
  { worker_idx: 4, job_type: "Les Bahasa Inggris", job_value: 100000, verified: true },
  { worker_idx: 5, job_type: "Renovasi Kamar Mandi", job_value: 8500000, verified: true },
  { worker_idx: 5, job_type: "Cat Rumah", job_value: 4000000, verified: false },
  { worker_idx: 6, job_type: "Rias Pengantin", job_value: 2000000, verified: true },
  { worker_idx: 7, job_type: "Buat Lemari", job_value: 3500000, verified: true },
  { worker_idx: 8, job_type: "Cat Interior", job_value: 5000000, verified: true },
  { worker_idx: 9, job_type: "Instalasi AC Central", job_value: 5000000, verified: true },
  { worker_idx: 9, job_type: "Service AC Besar", job_value: 750000, verified: false },
];

const verifications: { worker_idx: number; verifier_name: string; verifier_role: string; rating: number }[] = [
  { worker_idx: 0, verifier_name: "Pak RT 05", verifier_role: "Ketua RT", rating: 8.5 },
  { worker_idx: 0, verifier_name: "Bambang", verifier_role: "Mandor", rating: 9.0 },
  { worker_idx: 1, verifier_name: "Bu Lurah", verifier_role: "Ketua RT", rating: 7.5 },
  { worker_idx: 2, verifier_name: "Haji Sulaiman", verifier_role: "Pemilik Toko", rating: 9.5 },
  { worker_idx: 3, verifier_name: "Mega Wati", verifier_role: "Ketua Banjar", rating: 8.0 },
  { worker_idx: 4, verifier_name: "Pak Guru Budi", verifier_role: "Pemilik Toko", rating: 7.0 },
  { worker_idx: 6, verifier_name: "Ibu Asih", verifier_role: "Ketua RT", rating: 9.0 },
];

const wageData: { city: string; job_type: string; min: number; max: number }[] = [
  { city: "Jakarta Selatan", job_type: "tukang", min: 100000, max: 250000 },
  { city: "Jakarta Timur", job_type: "tukang", min: 90000, max: 220000 },
  { city: "Jakarta Utara", job_type: "tukang", min: 95000, max: 230000 },
  { city: "Jakarta Barat", job_type: "tukang_cat", min: 80000, max: 200000 },
  { city: "Jakarta Pusat", job_type: "ac", min: 120000, max: 300000 },
  { city: "Jakarta Timur", job_type: "ac", min: 100000, max: 250000 },
  { city: "Surabaya", job_type: "montir", min: 75000, max: 200000 },
  { city: "Surabaya", job_type: "tukang_kayu", min: 100000, max: 250000 },
  { city: "Bandung", job_type: "fotografer", min: 150000, max: 500000 },
  { city: "Bandung", job_type: "tata_rias", min: 200000, max: 500000 },
  { city: "Jakarta Selatan", job_type: "guru", min: 50000, max: 150000 },
];

async function seed() {
  console.log("Seeding database...");

  await admin.from("agreements").delete().neq("agreement_id", "00000000-0000-0000-0000-000000000000");
  await admin.from("trust_score").delete().neq("worker_id", "00000000-0000-0000-0000-000000000000");
  await admin.from("proof_of_work").delete().neq("proof_id", "00000000-0000-0000-0000-000000000000");
  await admin.from("community_verifications").delete().neq("verification_id", "00000000-0000-0000-0000-000000000000");
  await admin.from("wage_estimates").delete().neq("estimate_id", "00000000-0000-0000-0000-000000000000");
  await admin.from("worker_profiles").delete().neq("worker_id", "00000000-0000-0000-0000-000000000000");

  const userIds: string[] = [];

  for (const w of workers) {
    const { data: user, error: userError } = await admin.auth.admin.createUser({
      email: `${w.full_name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      password: "password123",
      email_confirm: true,
      user_metadata: { full_name: w.full_name, role: "worker" },
    });

    if (userError) {
      console.error(`Failed to create auth user for ${w.full_name}:`, userError.message);
      continue;
    }

    const id = user.user.id;
    userIds.push(id);

    const { error: profileError } = await admin.from("worker_profiles").insert({
      worker_id: id,
      full_name: w.full_name,
      city: w.city,
      job_category: w.job_category,
      years_experience: w.years_experience,
    });

    if (profileError) {
      console.error(`Failed to create profile for ${w.full_name}:`, profileError.message);
      continue;
    }

    const { error: scoreError } = await admin.from("trust_score").insert({
      worker_id: id,
      score: w.score,
      breakdown: {
        verificationScore: Math.round(w.score * 0.4),
        proofScore: Math.round(w.score * 0.25),
        completionScore: Math.round(w.score * 0.25),
        tenureScore: Math.round(w.score * 0.1),
      },
    });

    if (scoreError) {
      console.error(`Failed to create trust score for ${w.full_name}:`, scoreError.message);
    }
  }

  console.log(`Created ${userIds.length} worker accounts`);

  for (const p of proofs) {
    const workerId = userIds[p.worker_idx];
    if (!workerId) continue;

    const jobDate = new Date();
    jobDate.setDate(jobDate.getDate() - Math.floor(Math.random() * 365));

    const { error } = await admin.from("proof_of_work").insert({
      worker_id: workerId,
      job_type: p.job_type,
      job_value: p.job_value,
      photo_before_url: null,
      photo_after_url: null,
      customer_confirmed: p.verified,
      verified: p.verified,
      job_date: jobDate.toISOString().split("T")[0],
    });

    if (error) console.error("Failed to insert proof:", error.message);
  }

  console.log(`Inserted ${proofs.length} proofs of work`);

  for (const v of verifications) {
    const workerId = userIds[v.worker_idx];
    if (!workerId) continue;

    const { error } = await admin.from("community_verifications").insert({
      worker_id: workerId,
      verifier_name: v.verifier_name,
      verifier_role: v.verifier_role,
      rating: v.rating,
      statement: `Saya merekomendasikan pekerja ini berdasarkan pengalaman kerja sama.`,
    });

    if (error) console.error("Failed to insert verification:", error.message);
  }

  console.log(`Inserted ${verifications.length} verifications`);

  for (const w of wageData) {
    const { error } = await admin.from("wage_estimates").insert({
      city: w.city,
      job_type: w.job_type,
      experience_band: "1-3y",
      min_wage: w.min,
      max_wage: w.max,
    });

    if (error && !error.message.includes("duplicate")) {
      console.error("Failed to insert wage estimate:", error.message);
    }
  }

  console.log(`Inserted ${wageData.length} wage estimates`);
  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
