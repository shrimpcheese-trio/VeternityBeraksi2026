/**
 * design-tokens.css — SATU-SATUNYA file yang boleh diedit untuk mengubah palet warna.
 *
 * Cara ganti warna: ubah nilai hex di bawah ini saja.
 * JANGAN edit DESIGN.md, tailwind.config.ts, atau file komponen manapun untuk urusan warna —
 * semuanya menunjuk ke variabel di file ini lewat var(--color-...).
 *
 * Palet saat ini: Happy Hues Palette #3 (https://www.happyhues.co/palettes/3)
 */

:root {
  /* Brand & Aksen */
  --color-navy: #094067;
  --color-navy-active: #062c47;
  --color-sky: #3da9fc;
  --color-sky-active: #1c8ee0;
  --color-sky-disabled: #bfe1fd;
  --color-coral: #ef4565;
  --color-coral-active: #c92e4c;

  /* Surface */
  --color-bg: #fffffe;
  --color-bg-alt: #d8eefe;
  --color-bg-card: #f4faff;
  --color-border: #c7e3fb;

  /* Teks */
  --color-text-heading: var(--color-navy);
  --color-text-body: #3a4a5c;
  --color-text-muted: #5f6c7b;
  --color-text-on-accent: #fffffe;

  /* Semantik — status badge, dsb. Jangan pakai hijau/merah generik framework. */
  --color-status-pending: var(--color-text-muted);
  --color-status-confirmed: var(--color-sky);
  --color-status-warning: var(--color-coral);
}

/**
 * CATATAN SAAT GANTI PALET:
 * 1. Ganti nilai hex di atas.
 * 2. Cek ulang rasio penggunaan di DESIGN.md §2.1 (netral ~60%, heading ~30%, aksen ~10%)
 *    masih masuk akal dengan palet baru — kalau warna baru terlalu terang/gelap,
 *    sesuaikan --color-*-active dan --color-*-disabled supaya kontrasnya tetap cukup (WCAG AA).
 * 3. Tidak perlu edit tailwind.config.ts — sudah menunjuk ke var(--color-...), bukan hex literal.
 * 4. Tidak perlu edit DESIGN.md — semua referensi warna di sana pakai nama token, bukan hex.
 */