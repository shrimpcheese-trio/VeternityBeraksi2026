export type ProfileData = {
  id: string
  name: string
  role: string
  trustScore: number
  bio: string
  company?: string
  location: string
  locationVisible?: boolean
  memberSince: string
  contact?: string
  website?: string
  completedJobs: number
  activeListings: number
  rating: number
  reviewCount: number
  avatarUrl?: string
  verifications: {
    idVerified: boolean
    companyVerified: boolean
    paymentVerified: boolean
  }
}

export type Listing = {
  id: string
  name: string
  status: "active" | "paused" | "completed"
  type: string
  price: number
  quantity: number
  datePosted: string
  tags: string[]
}

export type Contract = {
  id: string
  counterparty: string
  type: string
  value: number
  status: "active" | "completed" | "disputed"
  date: string
}

export type Review = {
  id: string
  reviewerAvatar?: string
  reviewerInitials: string
  reviewerName: string
  rating: number
  comment: string
  date: string
  service?: string
}

export type Document = {
  id: string
  name: string
  type: string
  uploadDate: string
  verified: boolean
}

export type ActivityEntry = {
  icon: string
  description: string
  timestamp: string
}

export type ActivityGroup = {
  label: string
  entries: ActivityEntry[]
}

export type ChartData = {
  month: string
  value: number
}

const profiles: Record<string, ProfileData> = {
  "user_1": {
    id: "user_1",
    name: "Budi Santoso",
    role: "Tukang Bangunan",
    trustScore: 4.2,
    bio: "Berpengalaman 10 tahun dalam renovasi rumah, pemasangan keramik, dan perbaikan atap. Sudah mengerjakan lebih dari 50 proyek di Jakarta Selatan dan sekitarnya.",
    company: "Bangun Bersama",
    location: "Jakarta Selatan, DKI Jakarta",
    memberSince: "Januari 2025",
    contact: "budi.santoso@email.com",
    website: "bangunbersama.com",
    completedJobs: 48,
    activeListings: 3,
    rating: 4.5,
    reviewCount: 32,
    verifications: {
      idVerified: true,
      companyVerified: true,
      paymentVerified: true,
    },
  },
  "user_2": {
    id: "user_2",
    name: "Siti Rahmawati",
    role: "Montir Mobil",
    trustScore: 4.5,
    bio: "Montir profesional spesialis mobil Jepang. Servis rutin, perbaikan mesin, dan ganti oli. Garansi pengerjaan 3 bulan.",
    company: "Bengkel Siti",
    location: "Bandung, Jawa Barat",
    memberSince: "Maret 2025",
    contact: "siti.rahmawati@email.com",
    completedJobs: 36,
    activeListings: 5,
    rating: 4.7,
    reviewCount: 28,
    verifications: {
      idVerified: true,
      companyVerified: true,
      paymentVerified: false,
    },
  },
  "user_3": {
    id: "user_3",
    name: "Ahmad Fauzi",
    role: "Fotografer",
    trustScore: 4.8,
    bio: "Fotografer profesional untuk pernikahan, event korporat, portrait, dan produk. Hasil edit berkualitas tinggi dengan turnaround cepat.",
    location: "Surabaya, Jawa Timur",
    memberSince: "Februari 2025",
    contact: "ahmad.fauzi@email.com",
    website: "fauziphoto.com",
    completedJobs: 72,
    activeListings: 8,
    rating: 4.8,
    reviewCount: 45,
    verifications: {
      idVerified: true,
      companyVerified: false,
      paymentVerified: true,
    },
  },
}

const listingsData: Record<string, Listing[]> = {
  "user_1": [
    { id: "l1", name: "Renovasi Rumah 2 Lantai", status: "active", type: "Renovasi", price: 25000000, quantity: 1, datePosted: "2025-06-15", tags: ["Renovasi", "Rumah"] },
    { id: "l2", name: "Pemasangan Keramik Kamar Mandi", status: "active", type: "Pemasangan", price: 3500000, quantity: 2, datePosted: "2025-06-20", tags: ["Keramik", "Kamar Mandi"] },
    { id: "l3", name: "Perbaikan Atap Bocor", status: "paused", type: "Perbaikan", price: 1500000, quantity: 1, datePosted: "2025-05-10", tags: ["Atap", "Perbaikan"] },
    { id: "l4", name: "Cat Ulang Rumah", status: "completed", type: "Pengecatan", price: 8000000, quantity: 1, datePosted: "2025-04-01", tags: ["Cat", "Rumah"] },
  ],
  "user_2": [
    { id: "l5", name: "Servis Rutin Mobil Avanza", status: "active", type: "Servis", price: 500000, quantity: 10, datePosted: "2025-06-18", tags: ["Servis", "Mobil"] },
    { id: "l6", name: "Ganti Oli & Filter", status: "active", type: "Servis", price: 350000, quantity: 15, datePosted: "2025-06-22", tags: ["Oli", "Filter"] },
    { id: "l7", name: "Overhaul Mesin", status: "completed", type: "Perbaikan", price: 5000000, quantity: 1, datePosted: "2025-05-05", tags: ["Mesin", "Overhaul"] },
  ],
  "user_3": [
    { id: "l8", name: "Paket Foto Pernikahan Premium", status: "active", type: "Fotografi", price: 15000000, quantity: 3, datePosted: "2025-06-10", tags: ["Pernikahan", "Premium"] },
    { id: "l9", name: "Sesi Foto Portrait", status: "active", type: "Fotografi", price: 500000, quantity: 20, datePosted: "2025-06-25", tags: ["Portrait", "Individu"] },
    { id: "l10", name: "Dokumentasi Event Korporat", status: "paused", type: "Fotografi", price: 8000000, quantity: 2, datePosted: "2025-05-15", tags: ["Event", "Korporat"] },
  ],
}

const contractsData: Record<string, Contract[]> = {
  "user_1": [
    { id: "c1", counterparty: "PT Griya Indah", type: "Renovasi", value: 25000000, status: "active", date: "2025-06-15" },
    { id: "c2", counterparty: "Ibu Ratna", type: "Pemasangan", value: 3500000, status: "active", date: "2025-06-20" },
    { id: "c3", counterparty: "Pak Surya", type: "Perbaikan", value: 1500000, status: "completed", date: "2025-05-10" },
    { id: "c4", counterparty: "Bapak Hendra", type: "Pengecatan", value: 8000000, status: "completed", date: "2025-04-01" },
  ],
  "user_2": [
    { id: "c5", counterparty: "PT Transport Jaya", type: "Servis Rutin", value: 5000000, status: "active", date: "2025-06-18" },
    { id: "c6", counterparty: "Taksi Biru", type: "Ganti Oli", value: 5250000, status: "active", date: "2025-06-22" },
    { id: "c7", counterparty: "Pak Dodi", type: "Overhaul", value: 5000000, status: "completed", date: "2025-05-05" },
  ],
}

const reviewsData: Record<string, Review[]> = {
  "user_1": [
    { id: "r1", reviewerInitials: "HR", reviewerName: "Hendra", rating: 5, comment: "Pengerjaan rapi dan tepat waktu. Sangat merekomendasikan!", date: "2025-06-10" },
    { id: "r2", reviewerInitials: "RN", reviewerName: "Ratna", rating: 4, comment: "Hasil keramiknya bagus, hanya sedikit terlambat dari jadwal.", date: "2025-06-01" },
    { id: "r3", reviewerInitials: "SY", reviewerName: "Surya", rating: 5, comment: "Atap bocor beres dalam sehari. Harga terjangkau.", date: "2025-05-15" },
  ],
  "user_2": [
    { id: "r4", reviewerInitials: "DJ", reviewerName: "Dodi", rating: 5, comment: "Montir handal, mesin mobil saya kembali mulus.", date: "2025-05-10" },
    { id: "r5", reviewerInitials: "TJ", reviewerName: "Tanjung", rating: 4, comment: "Servis rutin cepat dan profesional.", date: "2025-06-05" },
  ],
  "user_3": [
    { id: "r6", reviewerInitials: "AN", reviewerName: "Anindya", rating: 5, comment: "Foto pernikahan kami luar biasa! Hasil editnya memukau.", date: "2025-06-12" },
    { id: "r7", reviewerInitials: "BS", reviewerName: "Budi S.", rating: 5, comment: "Sesi portrait profesional, hasil sesuai ekspektasi.", date: "2025-05-20" },
    { id: "r8", reviewerInitials: "KP", reviewerName: "Korporat Pro", rating: 4, comment: "Dokumentasi event perusahaan berjalan lancar.", date: "2025-05-01" },
  ],
}

const documentsData: Record<string, Document[]> = {
  "user_1": [
    { id: "d1", name: "KTP", type: "ID", uploadDate: "2025-01-15", verified: true },
    { id: "d2", name: "SIUP Bangun Bersama", type: "Company License", uploadDate: "2025-02-01", verified: true },
    { id: "d3", name: "Sertifikat Pelatihan Konstruksi", type: "Certificate", uploadDate: "2025-03-10", verified: true },
    { id: "d4", name: "NPWP", type: "Tax ID", uploadDate: "2025-01-20", verified: false },
  ],
  "user_2": [
    { id: "d5", name: "KTP", type: "ID", uploadDate: "2025-03-01", verified: true },
    { id: "d6", name: "Tanda Daftar Bengkel", type: "Company License", uploadDate: "2025-03-15", verified: true },
  ],
  "user_3": [
    { id: "d7", name: "KTP", type: "ID", uploadDate: "2025-02-01", verified: true },
    { id: "d8", name: "Portfolio Fotografi", type: "Certificate", uploadDate: "2025-02-10", verified: false },
  ],
}

const chartData: Record<string, ChartData[]> = {
  "user_1": [
    { month: "Jan", value: 3 }, { month: "Feb", value: 5 }, { month: "Mar", value: 4 },
    { month: "Apr", value: 6 }, { month: "Mei", value: 7 }, { month: "Jun", value: 5 },
  ],
  "user_2": [
    { month: "Jan", value: 2 }, { month: "Feb", value: 4 }, { month: "Mar", value: 3 },
    { month: "Apr", value: 5 }, { month: "Mei", value: 6 }, { month: "Jun", value: 4 },
  ],
  "user_3": [
    { month: "Jan", value: 6 }, { month: "Feb", value: 8 }, { month: "Mar", value: 7 },
    { month: "Apr", value: 9 }, { month: "Mei", value: 10 }, { month: "Jun", value: 8 },
  ],
}

const activityData: Record<string, ActivityGroup[]> = {
  "user_1": [
    {
      label: "Hari Ini",
      entries: [
        { icon: "CheckCircle", description: "Menyelesaikan kontrak renovasi di PT Griya Indah", timestamp: "2 jam yang lalu" },
        { icon: "MessageSquare", description: "Menerima pesan dari Ibu Ratna", timestamp: "5 jam yang lalu" },
      ],
    },
    {
      label: "Kemarin",
      entries: [
        { icon: "Star", description: "Mendapat ulasan bintang 5 dari Hendra", timestamp: "Kemarin" },
      ],
    },
    {
      label: "Pekan Ini",
      entries: [
        { icon: "FileText", description: "Menambahkan listing baru: Pemasangan Keramik", timestamp: "3 hari lalu" },
        { icon: "CheckCircle", description: "Proyek cat rumah selesai", timestamp: "5 hari lalu" },
      ],
    },
  ],
  "user_2": [
    {
      label: "Hari Ini",
      entries: [
        { icon: "CheckCircle", description: "Menyelesaikan servis rutin Avanza", timestamp: "1 jam yang lalu" },
      ],
    },
    {
      label: "Kemarin",
      entries: [
        { icon: "MessageSquare", description: "Menjadwalkan ganti oli dengan Taksi Biru", timestamp: "Kemarin" },
      ],
    },
  ],
  "user_3": [
    {
      label: "Hari Ini",
      entries: [
        { icon: "Star", description: "Mendapat ulasan bintang 5 dari Anindya", timestamp: "3 jam yang lalu" },
        { icon: "FileText", description: "Menambahkan listing: Sesi Foto Portrait", timestamp: "6 jam yang lalu" },
      ],
    },
    {
      label: "Kemarin",
      entries: [
        { icon: "CheckCircle", description: "Menyerahkan hasil edit foto pernikahan", timestamp: "Kemarin" },
      ],
    },
  ],
}

export function getProfile(id: string): ProfileData | undefined {
  return profiles[id]
}

export function getProfileForUser(userId: string, email?: string, name?: string): ProfileData {
  if (profiles[userId]) return profiles[userId]!

  if (email) {
    const byEmail = Object.values(profiles).find((p) => p.contact === email)
    if (byEmail) return byEmail
  }

  if (name) {
    const byName = Object.values(profiles).find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    )
    if (byName) return byName
  }

  return profiles["user_1"]!
}

export function getAllProfileIds(): string[] {
  return Object.keys(profiles)
}

export function getListings(id: string): Listing[] {
  return listingsData[id] ?? []
}

export function getContracts(id: string): Contract[] {
  return contractsData[id] ?? []
}

export function getReviews(id: string): Review[] {
  return reviewsData[id] ?? []
}

export function getDocuments(id: string): Document[] {
  return documentsData[id] ?? []
}

export function getChartData(id: string): ChartData[] {
  return chartData[id] ?? []
}

export function getActivity(id: string): ActivityGroup[] {
  return activityData[id] ?? []
}

export function getRatingBreakdown(id: string): Record<number, number> {
  const reviews = getReviews(id)
  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  for (const r of reviews) {
    breakdown[r.rating] = (breakdown[r.rating] ?? 0) + 1
  }
  return breakdown
}
