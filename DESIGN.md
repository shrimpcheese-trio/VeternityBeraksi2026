# DESIGN.md — Upahku Landing Page

> Referensi wajib untuk siapa pun (manusia atau AI agent) yang mengerjakan UI landing page.
> Dokumen ini adalah **source of truth visual**, sejajar dengan `AGENTS.md` (source of truth teknis/scope) dan `content.md` (source of truth copy).
>
> **File ini SENGAJA tidak berisi nilai warna literal (hex) atau URL referensi layout.** Dua hal itu paling sering berubah, jadi dipisah ke file lain supaya mengganti warna atau referensi layout **tidak pernah butuh generate ulang dokumen ini**:
> - Warna → edit `design-tokens.css` saja.
> - Referensi layout → edit `layout-references.md` saja.
>
> Dokumen ini hanya bicara dalam **nama token** (`--color-navy`, dst) dan **label referensi** (`LAYOUT-A`, `LAYOUT-B`) — bukan nilai konkretnya. Kalau ada kebutuhan yang tidak tercakup di tiga dokumen ini, tambahkan dulu sebelum implementasi — jangan improvisasi langsung di kode, dan jangan mengambil token/komponen dari brand lain.

---

## 0. Cara Membaca Dokumen Ini

| Pertanyaan | Jawaban ada di |
|---|---|
| Apa scope MVP-nya, fitur apa yang boleh/tidak boleh dibuat? | `AGENTS.md` |
| Apa isi teks tiap section (headline, body, CTA, FAQ)? | `content.md` |
| Warna, tipografi, layout, komponen, interaksi seperti apa? | Dokumen ini (`DESIGN.md`) |
| Nilai hex warna saat ini apa? | `design-tokens.css` |
| Situs referensi layout yang sedang dipakai apa? | `layout-references.md` |

Urutan implementasi yang benar: **scope (AGENTS.md) → struktur & visual (DESIGN.md + design-tokens.css + layout-references.md) → isi (content.md)**.

Kalau sebuah komponen tidak terdaftar di Bagian 8 (Katalog Komponen), **jangan menebak stylingnya** — tambahkan entri baru dulu (ikuti pola entri yang sudah ada), baru implementasikan.

---

## 1. Prinsip Desain

Produk ini adalah **Trust Engine + Fair Work Engine** (lihat `AGENTS.md`), bukan marketplace pencarian jasa generik. Setiap keputusan visual harus menjawab satu pertanyaan: *apakah ini membuat bukti kerja, verifikasi komunitas, atau upah adil terasa lebih kredibel?* Kalau tidak, itu dekorasi — potong.

Referensi struktural yang dipakai (**hanya untuk pola layout, bukan untuk disalin identik, dan bukan untuk diambil warna/font/token-nya**) — daftar lengkap dan URL aktual ada di `layout-references.md`:

- **`LAYOUT-A`** — pola section insight/masalah dengan statistik besar, dan pola scroll-linked highlight text.
- **`LAYOUT-B`** — kerangka utama: profil individual (dokter → pekerja), badge kepercayaan (rating → Trust Score), proses 3 langkah, testimoni dengan foto asli, FAQ, CTA penutup.

Palet warna: lihat `design-tokens.css` (sumber: Happy Hues Palette #3 pada penulisan awal dokumen ini — tapi cek file tersebut untuk nilai *saat ini*, bisa saja sudah diganti).

**Batasan penting:** dokumen desain brand lain (termasuk brand produk AI apa pun) boleh dibaca sebagai *contoh cara mendokumentasikan design system*, tapi token warna/font/komponennya **tidak pernah** dipindah ke Upahku.

---

## 2. Design Tokens

### 2.1 Warna

**Nilai hex aktual TIDAK ada di sini — lihat `design-tokens.css`.** Tabel ini cuma daftar nama token dan perannya, supaya kalau palet diganti, tabel ini tetap benar tanpa diedit.

| Token (CSS var) | Peran | Kategori |
|---|---|---|
| `--color-navy` | Heading, teks utama, navbar, elemen otoritatif | Brand |
| `--color-navy-active` | State tekan/hover untuk elemen navy | Brand |
| `--color-sky` | CTA utama, tombol, link, ikon interaktif | Brand |
| `--color-sky-active` | State tekan/hover tombol sky | Brand |
| `--color-sky-disabled` | State disabled tombol/input sky | Brand |
| `--color-coral` | Highlight sekunder, badge urgensi, aksen langka | Brand |
| `--color-coral-active` | State tekan/hover elemen coral | Brand |
| `--color-bg` | Background utama (default page floor) | Surface |
| `--color-bg-alt` | Background alternating section | Surface |
| `--color-bg-card` | Background kartu di atas `--color-bg` | Surface |
| `--color-border` | Border hairline 1px pada kartu/input | Surface |
| `--color-text-heading` | H1–H3, judul kartu | Teks |
| `--color-text-body` | Paragraf, deskripsi | Teks |
| `--color-text-muted` | Sub-headline, label sekunder, caption | Teks |
| `--color-text-on-accent` | Teks di atas tombol/badge sky atau coral | Teks |
| `--color-status-pending` | Badge "Menunggu Konfirmasi" | Semantik |
| `--color-status-confirmed` | Badge "Dikonfirmasi Pelanggan" — **bukan hijau**, lihat 8.3 | Semantik |
| `--color-status-warning` | Peringatan upah di bawah standar, error validasi | Semantik |

**Rasio penggunaan** (berlaku untuk palet apa pun yang dipasang di `design-tokens.css`): netral (`bg`/`bg-alt`) mendominasi ~60% ruang, `text-heading`/brand utama ~30%, aksen sky+coral gabungan ~10%. Coral khusus dipakai sangat terbatas — badge, satu highlight kata, bukan untuk section besar atau tombol utama berulang.

```js
// tailwind.config.ts — tulis SEKALI, tidak perlu diedit lagi saat ganti palet,
// karena semua menunjuk ke CSS variable, bukan hex literal.
colors: {
  navy: { DEFAULT: "var(--color-navy)", active: "var(--color-navy-active)" },
  sky: {
    DEFAULT: "var(--color-sky)",
    active: "var(--color-sky-active)",
    disabled: "var(--color-sky-disabled)",
  },
  coral: { DEFAULT: "var(--color-coral)", active: "var(--color-coral-active)" },
  bg: { DEFAULT: "var(--color-bg)", alt: "var(--color-bg-alt)", card: "var(--color-bg-card)" },
  border: { DEFAULT: "var(--color-border)" },
  text: {
    heading: "var(--color-text-heading)",
    body: "var(--color-text-body)",
    muted: "var(--color-text-muted)",
  },
}
```

```css
/* app/globals.css */
@import "../design-tokens.css";
```

### 2.2 Tipografi

Jangan pakai geometric rounded sans (Poppins/Quicksand/Baloo) — itu font yang dipakai di draft lama dan terasa generik/AI-template.

| Peran | Font | Catatan |
|---|---|---|
| Display (H1, headline hero, angka besar) | `Bricolage Grotesque` | Grotesque berkarakter, dipakai dengan restraint — hanya di headline besar, bukan di body |
| Body & UI | `Inter` | Netral, sangat legible untuk teks panjang dan UI berbahasa Indonesia |
| Angka/data (Trust Score, estimasi upah) | `Inter` dengan `font-variant-numeric: tabular-nums` | Supaya angka tidak "melompat" saat berubah |

**Skala Hierarki**

| Token | Ukuran (mobile/desktop) | Weight | Line height | Font | Dipakai untuk |
|---|---|---|---|---|---|
| `--text-display-lg` | 32px / 40px | 600 | 1.1 | Bricolage Grotesque | H1 hero |
| `--text-display-md` | 24px / 32px | 600 | 1.15 | Bricolage Grotesque | H2 judul section |
| `--text-display-sm` | 20px / 24px | 600 | 1.2 | Bricolage Grotesque | Angka Trust Score, angka estimasi upah |
| `--text-title` | 16px / 18px | 500 | 1.4 | Inter | Judul kartu (Kartu Pekerja, Kartu Verifikasi) |
| `--text-body` | 16px | 400 | 1.6 | Inter | Paragraf default |
| `--text-caption` | 13px | 500 | 1.4 | Inter | Label, badge, metadata kartu |
| `--text-button` | 14px | 500 | 1.0 | Inter | Label tombol |

**Prinsip:** display size selalu weight 600 (bukan 400 polos — Bricolage Grotesque di 400 terasa terlalu tipis untuk headline pendek Bahasa Indonesia). Jangan pernah bold (700+) di display.

Tipografi **tidak** dipisah ke file config terpisah seperti warna, karena font-pairing adalah keputusan identitas brand yang jauh lebih jarang berubah dibanding warna/referensi layout — kalau memang mau diganti, edit langsung di sini dan diskusikan dulu, jangan diam-diam diganti developer lain.

### 2.3 Spacing

Base unit 4px.

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--space-xs` | 8px | Gap ikon-label, padding badge |
| `--space-sm` | 12px | Gap antar elemen dalam kartu |
| `--space-md` | 16px | Padding input, gap grid mobile |
| `--space-lg` | 24px | Padding kartu standar |
| `--space-xl` | 32px | Padding kartu penting (Community Verification, Trust Score) |
| `--space-section-mobile` | 64px | Jarak vertikal antar-section di mobile |
| `--space-section-desktop` | 96px | Jarak vertikal antar-section di desktop |

Section dengan konten penting (Community Verification, Trust Score) boleh punya padding lebih besar dari section pendukung — jangan pakai jarak rata sama untuk semua section.

### 2.4 Border Radius

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--radius-sm` | 6px | Badge kecil, chip filter kategori |
| `--radius-md` | 8px | Tombol, input, tab |
| `--radius-lg` | 12px | Kartu (pekerja, proof of work, verifikasi, estimasi upah, testimoni) |
| `--radius-pill` | 9999px | Badge status, badge Trust Score |

Jangan pakai radius seragam besar (20px+) di semua elemen sekaligus.

---

## 3. Elevation & Depth

Filosofi: **warna-blok dan border hairline dulu, shadow jarang dan tipis**.

| Level | Treatment | Dipakai untuk |
|---|---|---|
| Flat | Tanpa shadow, tanpa border | Body section, hero band |
| Hairline | Border 1px `--color-border` | Input, kartu di atas `--color-bg-alt` |
| Card | Background `--color-bg-card`, tanpa shadow | Kartu pekerja, kartu proof of work |
| Elevated (jarang) | `box-shadow: 0 1px 3px rgba(9,64,103,0.08)` | Hover state kartu yang bisa diklik, dropdown menu |

**Jangan** pakai shadow besar/blur tinggi di kartu manapun — itu ciri "card floating ala AI generator".

---

## 4. Struktur Halaman & Sumber Layout

Urutan ini **wajib sinkron dengan `content.md`**. Kolom "Sumber" memakai label dari `layout-references.md` — kalau referensi diganti di sana, tabel ini tetap valid tanpa diedit selama elemen kunci wajibnya masih dipenuhi.

| # | Section | Sumber (lihat `layout-references.md`) | Catatan implementasi |
|---|---|---|---|
| 1 | Navbar | `LAYOUT-B` (nav sederhana + 1 CTA kanan) | Hilangkan menu "Plans" |
| 2 | Hero | `LAYOUT-B` (kartu profil + badge kepercayaan), bukan search-bar ala marketplace | Visual: kartu Proof of Work bertransformasi jadi Trust Score, bukan foto stok |
| 3 | Insight Masalah | `LAYOUT-A` (statistik besar) | Satu insight tajam + maks 1 angka pendukung, bukan daftar bullet masalah |
| 4 | **Signature: Scroll Highlight** | `LAYOUT-A` (interaksi), custom copy | Lihat Bagian 5 |
| 5 | Cara Kerja (3 langkah) | `LAYOUT-B` ("How it works") | Numbering **valid** di sini karena memang proses berurutan |
| 6 | Community Verification | Baru, tidak ada di referensi manapun | Kartu endorsement — lihat Bagian 8.5 |
| 7 | Trust Score | `LAYOUT-B` (badge), dikembangkan jadi breakdown | Tampilkan komponen skor, bukan cuma angka akhir |
| 8 | Fair Wage Estimator | Baru | Wajib ada state "data belum cukup" — lihat `AGENTS.md` § Fair Wage Estimator |
| 9 | Testimoni | `LAYOUT-B` (foto asli + carousel) | Wajib campur pekerja + tokoh komunitas, lihat `content.md` § 8 |
| 10 | Untuk Pemberi Kerja | `LAYOUT-B` (dipersingkat, satu blok) | Jangan seimbang porsi dengan sisi pekerja |
| 11 | FAQ | `LAYOUT-B` (accordion) | Isi wajib dari `content.md` § 11 |
| 12 | CTA Penutup | `LAYOUT-B` (foto/avatar asli) | |
| 13 | Footer | `LAYOUT-B` (ringkas) | |

**Sengaja dihapus dari referensi asli:** pricing tiers, grid layanan bernomor `/001 /002` — lihat Bagian 9.2.

**Sengaja belum diambil (lihat Bagian 11 Known Gaps):** stats-bar di bawah hero (mis. "120+ pekerja terverifikasi") yang ada di `LAYOUT-B` asli — ditunda sampai ada data nyata, supaya tidak melanggar aturan "jangan mengarang angka" di `AGENTS.md`.

---

## 5. Signature Element: Scroll-Linked Highlight

Ini **satu-satunya** momen animasi besar di halaman. Section lain tetap statis/tenang.

**Kalimat (final — jangan diubah tanpa alasan):**
> "Upahku menyatukan **bukti kerja**, **verifikasi komunitas**, dan **upah yang adil** menjadi satu reputasi yang bisa dipercaya."

**Perilaku:**
- Section di-pin selagi user scroll melewati area taller container di belakangnya.
- Tiga frasa berubah dari `--color-text-muted` menjadi warna aksennya masing-masing secara berurutan:
  1. "bukti kerja" → `--color-navy`, aktif di ~20% progress
  2. "verifikasi komunitas" → `--color-sky`, aktif di ~50% progress
  3. "upah yang adil" → `--color-coral`, aktif di ~80% progress
- Transisi warna pakai `transition: color 0.3s`, bukan fade/opacity.

**Implementasi teknis (Next.js + GSAP ScrollTrigger):**

GSAP ScrollTrigger 100% gratis termasuk komersial sejak Webflow mengakuisisi GreenSock (April 2025). Dipakai sebagai implementasi utama untuk signature element ini (bukan Framer Motion).

```tsx
// components/shared/ScrollHighlightStatement.tsx
"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Warna diambil dari CSS var di runtime, bukan hardcode,
// supaya kalau design-tokens.css berubah, komponen ini otomatis ikut berubah.
function readToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function ScrollHighlightStatement() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const phrases = [
      { id: "w1", color: readToken("--color-navy") },
      { id: "w2", color: readToken("--color-sky") },
      { id: "w3", color: readToken("--color-coral") },
    ];

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          scrub: true,
          pin: true,
        },
      });

      phrases.forEach((phrase) => {
        tl.to(`#${phrase.id}`, { color: phrase.color, duration: 1 }, ">-0.2");
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      phrases.forEach((phrase) => {
        gsap.set(`#${phrase.id}`, { color: phrase.color });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex items-center">
      <p className="text-2xl md:text-4xl font-semibold max-w-2xl text-text-muted">
        Upahku menyatukan <span id="w1">bukti kerja</span>,{" "}
        <span id="w2">verifikasi komunitas</span>, dan{" "}
        <span id="w3">upah yang adil</span> menjadi satu reputasi yang bisa dipercaya.
      </p>
    </div>
  );
}
```

> Catatan teknis: membaca warna lewat `getComputedStyle` (bukan hardcode hex di komponen) memastikan signature element ini **otomatis ikut berubah** kalau `design-tokens.css` diedit — tidak perlu sentuh file komponen ini juga saat ganti palet.

**Pembagian tugas GSAP vs Framer Motion:**

| Library | Dipakai untuk |
|---|---|
| **GSAP + ScrollTrigger** | Semua animasi *scroll-linked* — termasuk signature element ini. Satu-satunya yang boleh pasang `pin`/`scrub`. |
| **Framer Motion** | Micro-interaction berbasis state React yang **tidak** sudah tersedia bawaan dari shadcn — hover-lift kartu pekerja, transisi modal booking di luar animasi default `Dialog`/`Sheet`. Untuk accordion FAQ dan carousel testimoni, pakai primitif shadcn (`Accordion`, `Carousel`) yang animasinya sudah bawaan — lihat Bagian 8.0, jangan dobel-implementasi dengan Framer Motion di atasnya. |

**Contoh implementasi Framer Motion (hover-lift kartu pekerja, komponen 8.2):**

```tsx
// components/shared/WorkerCard.tsx
"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function WorkerCard({ name, category, city, trustScore, photoUrl }: WorkerCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card className="border-border bg-bg-card">
        <CardHeader>
          <img src={photoUrl} alt={name} className="aspect-square w-full rounded-lg object-cover" />
        </CardHeader>
        <CardContent>
          <p className="text-title text-navy">{name}</p>
          <p className="text-caption text-text-muted">{category} · {city}</p>
          {/* Badge Trust Score — komponen 8.4 */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

Pola serupa (state React lokal, bukan scroll global) dipakai juga untuk transisi masuk/keluar modal booking kalau butuh animasi kustom di luar default `Dialog`/`Sheet` shadcn.



---

## 6. Photography & Ilustrasi

- **Wajib foto asli** untuk: kartu pekerja, foto before/after Proof of Work, testimoni, kartu Community Verification. Foto adalah bagian dari mekanisme trust produk ini, bukan hiasan.
- **Tidak pernah** pakai avatar lingkaran dengan inisial huruf sebagai pengganti foto asli.
- Ilustrasi (kalau dibutuhkan): line-art sederhana dengan stroke `--color-navy` atau `--color-sky` di atas `--color-bg` — bukan ilustrasi 3D/gradient generik.
- Foto crop ke rasio 1:1 (persegi), bukan lingkaran.

---

## 7. Responsive Behavior

### 7.1 Breakpoints

| Nama | Lebar | Perubahan Utama |
|---|---|---|
| Mobile | < 640px | Nav jadi hamburger; H1 40px→32px; hero image di bawah teks; grid kartu 1 kolom |
| Tablet | 640–1024px | Nav tetap horizontal; grid kartu 2 kolom |
| Desktop | 1024–1440px | Grid kartu 3 kolom (kecuali Community Verification, tetap 2 kolom lebar) |
| Wide | > 1440px | Sama seperti desktop, max content width dibatasi 1200px |

### 7.2 Touch Target
- Tombol utama minimal 40×40px.
- Item accordion FAQ: seluruh baris tap-able.
- Kartu pekerja/testimoni: seluruh kartu tap-able.

### 7.3 Strategi Collapse
- Grid 3 kolom → 2 → 1, kolom dikurangi, bukan kartu diperkecil paksa.
- Community Verification tetap dapat porsi visual besar di semua breakpoint.
- Signature scroll-highlight tetap aktif di mobile, durasi pin dipersingkat (`end: "+=100%"`).

---

## 8. Katalog Komponen

Setiap komponen baru harus ditambahkan ke sini dengan format yang sama. Referensi nama token, jangan hex/px literal.

### 8.0 Basis shadcn/ui — Extend, Jangan Bangun Ulang

Stack ini sudah pakai shadcn/ui (lihat `AGENTS.md` § Technology Stack). **Aturan wajib:** kalau ada primitif shadcn yang cocok untuk sebuah komponen, install dan pakai itu sebagai basis (`npx shadcn add <component>`), lalu kustomisasi lewat token Bagian 2 — jangan bangun ulang dari `<div>` polos. Ini bukan cuma soal kecepatan, tapi shadcn/Radix sudah menangani aksesibilitas (focus trap, keyboard nav, ARIA) yang gampang terlewat kalau bikin manual.

Kustomisasi dilakukan di dua tempat saja:
1. **`app/globals.css`** — override CSS variable shadcn (`--primary`, `--radius`, dst) supaya nilainya narik dari token Bagian 2, bukan default shadcn (slate/zinc).
2. **`components.json` / theme config** — set `radius` default shadcn ke `--radius-md` (8px), bukan default 0.5rem-nya shadcn kalau beda.

**Jangan** override struktur internal komponen shadcn (hapus/tambah wrapper div, ubah cara Radix pasang ref) — cukup override className/CSS variable-nya.

| Komponen di katalog ini | Basis shadcn | Catatan kustomisasi |
|---|---|---|
| 8.1 Tombol | `Button` (`npx shadcn add button`) | Tambah variant baru di `button.tsx`: `cta-coral`, jangan bikin komponen tombol terpisah dari nol |
| 8.2 Kartu Pekerja | `Card` | Pakai `CardHeader`/`CardContent` bawaan, foto ditaruh sebagai elemen custom di dalam `CardHeader` |
| 8.3 Kartu Proof of Work | `Card` + `Badge` | Badge status pakai variant custom (lihat 8.9), bukan variant default shadcn (`default`/`destructive`) |
| 8.4 Badge Trust Score | `Badge` (variant custom, radius pill) | shadcn `Badge` default sudah pill-shaped, tinggal override warna |
| 8.5 Kartu Community Verification | `Card` | Padding di-override ke `--space-xl` lewat className, lebih besar dari default `Card` |
| 8.6 Kartu Estimasi Upah | `Card` | — |
| 8.7 Testimoni | `Card` + `Avatar` | `Avatar` di-override jadi `rounded-lg` (bukan `rounded-full` default) — lihat Bagian 6, tidak boleh lingkaran |
| 8.8 Input & Form | `Input`, `Label`, `Form` (react-hook-form + zod resolver, sesuai `AGENTS.md` § Zod) | Error state pakai pola `Form` bawaan shadcn, bukan styling manual |
| 8.9 Badge & Chip | `Badge` (chip filter = `Badge` variant `outline` di-toggle) | — |
| 8.10 Accordion FAQ | `Accordion` (`npx shadcn add accordion`) | **Ganti dari implementasi Framer Motion manual** — shadcn `Accordion` (berbasis Radix) sudah punya animasi buka/tutup + aksesibilitas keyboard bawaan. Lihat revisi di 8.10 di bawah. |
| Modal booking | `Dialog` atau `Sheet` | `Sheet` (slide dari bawah) lebih pas untuk mobile, `Dialog` untuk desktop — bisa dibuat responsive dengan breakpoint |
| Carousel testimoni | `Carousel` (`npx shadcn add carousel`, berbasis Embla) | Ganti rencana Framer Motion `AnimatePresence` untuk carousel — shadcn `Carousel` sudah menangani swipe/drag, tidak perlu dibangun manual |

**Komponen yang TETAP custom** (tidak ada padanan shadcn yang cocok, boleh dibangun dari primitif dasar seperti `Card`/`div` sesuai token): Badge Trust Score dengan breakdown (8.4), Kartu Estimasi Upah dengan state kosong (8.6), Signature Scroll Highlight (Bagian 5).

### 8.1 Tombol
Basis: shadcn `Button`. **`button-primary`** — Background `--color-sky`, teks `--color-text-on-accent`, radius `--radius-md`, padding 12px×20px, tinggi 40px, `--text-button`. Tekan → `--color-sky-active`. Disabled → `--color-sky-disabled`.

**`button-secondary`** — Background `--color-bg`, teks `--color-navy`, border 1px `--color-border`.

**`button-cta-coral`** — Untuk satu CTA paling penting di halaman. Background `--color-coral`. **Maksimal 1 tempat per halaman.**

**`button-text-link`** — Tanpa background, teks `--color-sky`, underline saat hover/tekan.

### 8.2 Kartu Pekerja
Basis: shadcn `Card`. Foto asli 1:1, nama (`--text-title`), kategori (`--text-caption`, `--color-text-muted`), badge Trust Score (8.4), lokasi kota. Background `--color-bg-card`, radius `--radius-lg`, border 1px `--color-border`.

### 8.3 Kartu Proof of Work
Basis: shadcn `Card` + `Badge`. Foto before/after berdampingan, tanggal, jenis pekerjaan, badge status:
- `Menunggu Konfirmasi` → `--color-status-pending`
- `Dikonfirmasi Pelanggan` → `--color-status-confirmed`

**Jangan** pakai hijau generik untuk status "confirmed".

### 8.4 Badge Trust Score
Basis: shadcn `Badge` (custom variant). Pill radius `--radius-pill`, background `--color-navy`, teks `--color-text-on-accent`, format `"{angka} / 100"`. Selalu disandingkan dengan breakdown singkat di bawahnya.

### 8.5 Kartu Community Verification
Basis: shadcn `Card`. Berbeda bentuk dari kartu testimoni biasa:
- Badge peran verifikator (`Ketua RT`, `Mandor`, `Ketua Banjar`, dll), background `--color-bg-alt`, teks `--color-navy`
- Padding `--space-xl` (bukan `--space-lg` default `Card`)
- Grid section ini 2 kolom lebar di desktop (bukan 3 kolom sempit)

### 8.6 Kartu Estimasi Upah
Basis: shadcn `Card`. Baris atas: kota + jenis pekerjaan + band pengalaman, `--text-caption`, `--color-text-muted`. Baris bawah: angka range besar, `--text-display-sm`, Bricolage Grotesque, `--color-navy`. State kosong (wajib): italic `--color-text-muted` — *"Belum ada cukup data upah untuk kombinasi ini."*

### 8.7 Testimoni
Basis: shadcn `Card` + `Avatar` (override `rounded-lg`, bukan `rounded-full`). Foto asli 1:1, nama (`--text-title`), peran (`--text-caption`, `--color-text-muted`) — termasuk peran non-pekerja. Tidak pakai avatar inisial.

### 8.8 Input & Form
Basis: shadcn `Input`, `Label`, `Form` (react-hook-form + Zod resolver — konsisten dengan `AGENTS.md` § State Validation). **`text-input`** — Background `--color-bg`, border 1px `--color-border`, radius `--radius-md`, tinggi 40px.
**`text-input-focused`** — Border `--color-sky`, outer ring 3px sky 15% opacity.
**`text-input-error`** — Border `--color-coral`, pesan error `--text-caption` `--color-coral` (pakai `FormMessage` bawaan shadcn).

### 8.9 Badge & Chip
Basis: shadcn `Badge`. **`chip-filter`** — Radius `--radius-sm`, padding 8px×14px. Aktif: background `--color-bg-alt`, teks `--color-navy`. Non-aktif: `Badge` variant `outline`, teks `--color-text-muted`.

### 8.10 Accordion FAQ
Basis: shadcn `Accordion` (`npx shadcn add accordion`) — **bukan** implementasi Framer Motion manual. Override lewat className: baris pertanyaan `--text-title`, `--color-navy`, border-bottom 1px `--color-border`. Jawaban `--text-body`, `--color-text-body`. Animasi buka/tutup dan rotasi chevron sudah bawaan dari `AccordionTrigger`/`AccordionContent` shadcn — jangan tambah `motion.div` di atasnya, itu duplikasi.

```tsx
// components/shared/FaqSection.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { question: "Apa itu Upahku?", answer: "..." },
  // isi dari content.md § 11
];

export function FaqSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
          <AccordionTrigger className="text-navy font-medium">{faq.question}</AccordionTrigger>
          <AccordionContent className="text-text-body">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

---


## 9. Anti-Generic / Anti-"Terlihat AI-Generated" Checklist

### 9.1 Dilarang
- Palet krem+terracotta, atau palet brand produk lain apa pun — token warna hanya dari `design-tokens.css`.
- Angka ghost/watermark dekoratif (`01 02 03`) pada grid yang **tidak berurutan**. Numbering hanya valid di Cara Kerja (Bagian 4, baris 5).
- Avatar lingkaran dengan inisial huruf — pakai foto asli (Bagian 6).
- Search bar besar generik di hero.
- Section pricing/subscription — tidak ada representasinya di skema database.
- Grid 3 kolom simetris untuk *semua* section tanpa variasi.
- Copy generik ("Submit", "Learn More") — semua label tombol dari `content.md`.
- Animasi scroll-linked tambahan di luar Bagian 5.
- Shadow besar/blur tinggi (Bagian 3).
- Status "confirmed" memakai hijau generik.
- Radius seragam besar (20px+) di semua elemen.
- Membangun komponen dari `<div>` polos padahal shadcn punya primitif yang cocok (lihat Bagian 8.0) — terutama Accordion, Dialog/Sheet, Carousel, Form.

### 9.2 Kenapa elemen tertentu dari referensi sengaja dibuang
| Elemen di referensi | Kenapa dibuang |
|---|---|
| Pricing tiers (`LAYOUT-A`) | Tidak ada tabel billing/subscription di database |
| Grid `/001 /002 /003` (`LAYOUT-B`) | Kategori jasa tidak benar-benar berurutan |
| FAQ soal asuransi/preskripsi (`LAYOUT-B`) | Spesifik industri kesehatan, tidak relevan |
| Elemen Career Passport dari draft lama | Eksplisit di luar MVP per `AGENTS.md` § Boundaries |

### 9.3 Do's & Don'ts Ringkas

**Do:** anchor section di `--color-bg`/`--color-bg-alt` selang-seling · Bricolage Grotesque hanya untuk display besar · foto asli di semua titik trust · daftarkan komponen baru ke Bagian 8 dulu.

**Don't:** jangan tambah warna keempat di luar navy/sky/coral · jangan pakai `button-cta-coral` di lebih dari 1 tempat · jangan dokumentasikan hover selain default+active · jangan ulangi surface mode yang sama 2 band berturut-turut.

---

## 10. Checklist Sebelum Deploy Section Baru

- [ ] Warna dipakai lewat nama token, bukan hex literal disalin dari `design-tokens.css`
- [ ] Copy diambil langsung dari `content.md`
- [ ] Tidak menyinggung Career Passport/Skill Progress/Certification/Career Path
- [ ] Foto asli/representatif, bukan avatar inisial
- [ ] Numbering dekoratif hanya kalau kontennya berurutan
- [ ] Tidak ada animasi scroll-linked tambahan di luar Bagian 5
- [ ] Fair Wage Estimator: state "data belum cukup" ada
- [ ] Komponen baru sudah didaftarkan di Bagian 8
- [ ] Sudah dicek apakah ada primitif shadcn yang cocok (Bagian 8.0) sebelum membangun manual
- [ ] Breakpoint mobile/tablet/desktop sudah dicek

---

## 11. Known Gaps

- **Stats-bar di bawah hero** (pola dari `LAYOUT-B`, mis. "120+ Trusted") — ditunda sampai ada data pekerja terverifikasi nyata; jangan diimplementasikan dengan angka contoh/dummy yang terlihat seperti data asli.
- Font-loading Bricolage Grotesque (Google Fonts vs self-hosted) belum diputuskan.
- State error network di kartu Proof of Work (gagal upload foto) belum punya desain spesifik — pakai `text-input-error` sebagai acuan sementara.
- Halaman detail profil pekerja penuh belum masuk scope dokumen ini (baru landing page).
- Dark mode belum masuk scope.