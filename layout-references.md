# Layout Reference Registry

**SATU-SATUNYA file yang boleh diedit untuk mengganti referensi layout.**
`DESIGN.md` tidak pernah menyebut nama situs referensi secara langsung — dia hanya menunjuk ke Label (`LAYOUT-A`, `LAYOUT-B`) di tabel ini. Kalau kamu mau ganti referensi, ganti baris di tabel ini saja. `DESIGN.md` tetap valid selama referensi pengganti masih memenuhi "Elemen Kunci Wajib" di kolom terakhir.

| Label | URL Saat Ini | Peran / Pola yang Diambil | Elemen Kunci Wajib (kalau diganti, pastikan referensi baru masih punya ini) |
|---|---|---|---|
| `LAYOUT-A` | https://ordina.framer.website/ | Pola section insight/masalah dengan statistik besar + interaksi scroll-linked text highlight | 1. Ada section "masalah" di awal dengan minimal 1 statistik besar sebagai penekanan.<br>2. Ada satu momen interaksi scroll-linked (teks yang berubah warna/state saat discroll) — bukan sekadar fade-in biasa. |
| `LAYOUT-B` | https://medicarex.framer.website/ | Kerangka utama halaman: hero profil individual + badge kepercayaan, proses 3 langkah, testimoni foto asli, FAQ, CTA penutup | 1. Hero menampilkan kartu profil individual (bukan search-bar generik) dengan badge kepercayaan/rating.<br>2. Ada section proses kerja 3 langkah yang jelas urutannya.<br>3. Testimoni memakai foto asli + nama + peran, bukan avatar inisial.<br>4. FAQ dalam bentuk accordion.<br>5. CTA penutup menampilkan foto/avatar asli, bukan ilustrasi generik. |

---

## Cara Mengganti Referensi

1. Cari kandidat referensi baru.
2. Cek kandidat itu terhadap kolom "Elemen Kunci Wajib" milik label yang mau diganti (`LAYOUT-A` atau `LAYOUT-B`).
   - **Semua poin terpenuhi** → langsung ganti URL di tabel, selesai. `DESIGN.md` tidak perlu disentuh.
   - **Ada poin yang tidak terpenuhi** → jangan ganti dulu. Diskusikan dulu apakah `DESIGN.md` §4 (Struktur Halaman) atau §8 (Katalog Komponen) perlu diperbarui juga, karena berarti pola strukturalnya benar-benar beda, bukan cuma ganti "kulit".
3. Update juga baris "Peran / Pola yang Diambil" kalau ternyata kandidat baru punya nuansa berbeda dari yang lama (mis. LAYOUT-B baru tidak pakai carousel tapi grid statis) — supaya developer lain tahu detail implementasinya berubah.

## Riwayat Perubahan

| Tanggal | Label | Referensi Lama | Referensi Baru | Alasan |
|---|---|---|---|---|
| — | — | — | — | (belum ada perubahan sejak registry ini dibuat) |