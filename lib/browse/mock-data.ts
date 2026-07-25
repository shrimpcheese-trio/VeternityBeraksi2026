export interface BrowseListing {
  id: string;
  title: string;
  code: string;
  category: string;
  status: "tersedia" | "dalam_proyek" | "segera";
  imageUrl: string;
  projectCount: number;
  price: number;
  workerName: string;
  workerRole: string;
  isFavorite: boolean;
}

export const categories = [
  { id: "tukang", label: "Tukang", count: 1230 },
  { id: "ac", label: "Teknisi AC", count: 856 },
  { id: "montir", label: "Montir", count: 1120 },
  { id: "fotografer", label: "Fotografer", count: 543 },
  { id: "guru", label: "Guru Les", count: 721 },
  { id: "tata_rias", label: "Tata Rias", count: 389 },
  { id: "tukang_kayu", label: "Tukang Kayu", count: 267 },
  { id: "tukang_cat", label: "Tukang Cat", count: 412 },
];

export const listings: BrowseListing[] = [
  {
    id: "1",
    title: "Renovasi Rumah Total",
    code: "AGUS 1001",
    category: "tukang",
    status: "tersedia",
    imageUrl: "",
    projectCount: 47,
    price: 15000000,
    workerName: "Agus Priyanto",
    workerRole: "Tukang Bangunan",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Instalasi AC Split 1 PK",
    code: "BUDI 2004",
    category: "ac",
    status: "tersedia",
    imageUrl: "",
    projectCount: 89,
    price: 350000,
    workerName: "Budi Santoso",
    workerRole: "Teknisi AC",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Service Mobil Tahunan",
    code: "DODI 3007",
    category: "montir",
    status: "dalam_proyek",
    imageUrl: "",
    projectCount: 156,
    price: 500000,
    workerName: "Dodi Hermawan",
    workerRole: "Montir Mobil",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Paket Wedding Premium",
    code: "RINA 4002",
    category: "fotografer",
    status: "segera",
    imageUrl: "",
    projectCount: 23,
    price: 3500000,
    workerName: "Rina Wijaya",
    workerRole: "Fotografer",
    isFavorite: false,
  },
  {
    id: "5",
    title: "Les Matematika SD-SMP",
    code: "SARI 5009",
    category: "guru",
    status: "tersedia",
    imageUrl: "",
    projectCount: 34,
    price: 75000,
    workerName: "Sari Indah",
    workerRole: "Guru Les",
    isFavorite: false,
  },
  {
    id: "6",
    title: "Renovasi Kamar Mandi",
    code: "TEGUH 6012",
    category: "tukang",
    status: "tersedia",
    imageUrl: "",
    projectCount: 18,
    price: 8500000,
    workerName: "Teguh Prasetyo",
    workerRole: "Tukang Bangunan",
    isFavorite: true,
  },
];
