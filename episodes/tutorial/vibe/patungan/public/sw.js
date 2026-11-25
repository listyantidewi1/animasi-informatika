// Service worker Patungan: membuat aplikasi tetap jalan tanpa internet.

// 1. Nama cache berversi. Penanda __VERSI__ diganti otomatis saat `npm run build`
//    (scripts/versi-sw.mjs) dengan hash isi build, jadi tiap perubahan = versi baru.
//    Cache versi lama dihapus otomatis (lihat langkah "activate").
const VERSI = '__VERSI__';
const NAMA_CACHE = `patungan-${VERSI}`;

// 2. Berkas dasar yang pasti disimpan. Path relatif terhadap lokasi sw.js,
//    jadi tetap benar kalau aplikasi dipasang di subfolder.
const BERKAS_DASAR = ['./', 'manifest.webmanifest', 'ikon/ikon-192.png', 'ikon/ikon-512.png', 'ikon/ikon.svg'];

// 3. Vite memberi nama berkas JS/CSS dengan hash (mis. index-CccTiZrP.js),
//    jadi daftarnya tidak bisa ditulis tangan. Kita baca index.html lalu
//    ambil semua alamat src/href di dalamnya.
async function daftarBerkas() {
  const awal = new URL(self.registration.scope);
  const respons = await fetch('./', { cache: 'reload' }); // 'reload' = lewati cache HTTP
  const html = await respons.text();
  const dariHtml = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => new URL(m[1], awal))
    .filter((u) => u.origin === awal.origin) // hanya berkas milik sendiri
    .map((u) => u.href);
  return [...new Set([...BERKAS_DASAR.map((b) => new URL(b, awal).href), ...dariHtml])];
}

// 4. INSTALL: simpan semua berkas ke cache baru. Kalau satu saja gagal diunduh,
//    instalasi dibatalkan supaya tidak ada cache setengah jadi.
//    skipWaiting() membuat versi baru langsung aktif, tanpa menunggu tab ditutup.
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(NAMA_CACHE);
      await cache.addAll(await daftarBerkas());
      await self.skipWaiting();
    })(),
  );
});

// 5. ACTIVATE: hapus cache "patungan-*" yang bukan versi sekarang,
//    lalu clients.claim() agar halaman yang sudah terbuka langsung memakai worker ini.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const nama = await caches.keys();
      await Promise.all(
        nama.filter((n) => n.startsWith('patungan-') && n !== NAMA_CACHE).map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

// 6. FETCH: cache dulu, internet kalau belum ada (cache-first).
//    Yang berhasil diambil dari internet ikut disimpan untuk lain kali.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Hanya tangani GET milik sendiri; sisanya (mis. tautan WhatsApp) dibiarkan.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(NAMA_CACHE);
      const tersimpan = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      if (tersimpan) return tersimpan;
      try {
        const baru = await fetch(request);
        if (baru.ok) cache.put(request, baru.clone());
        return baru;
      } catch (galat) {
        // Offline dan belum tersimpan: untuk pindah halaman, tampilkan aplikasi.
        if (request.mode === 'navigate') return (await cache.match('./')) ?? Response.error();
        throw galat;
      }
    })(),
  );
});
