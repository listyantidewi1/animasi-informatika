// L06 Form laporan dan upload foto
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// Data tersembunyi (EXIF) sebelum dan sesudah ditulis ulang
AD.exif = (c, t, D, a) => { K.bg(c); K.judul(c, 'Data tersembunyi di dalam foto', t, C.amber);
  const t1 = kt(a, 2), t2 = kt(a, 3), t3 = kt(a, 4);
  const panel = (x, judul, berkas, baris, warna, p, kosong) => { if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, x, 230 + (1 - p) * 20, 780, 640, 20, '#f8fafc', warna, 5);
    K.text(c, judul, x + 36, 282, {size: 30, weight: 900, color: '#0f172a'}); K.text(c, berkas, x + 36, 326, {size: 24, weight: 600, mono: true, color: '#64748b'}); c.fillStyle = '#e2e8f0'; c.fillRect(x + 30, 356, 720, 3);
    baris.forEach(([k, v, sorot], i) => { const y = 410 + i * 84; if (sorot && t > t2) K.rrect(c, x + 24, y - 34, 732, 70, 10, 'rgba(239,68,68,.18)', '#ef4444', 3);
      K.text(c, k, x + 44, y, {size: 28, weight: 700, color: '#475569'}); K.text(c, v, x + 330, y, {size: 28, weight: 800, mono: !kosong, color: kosong ? '#94a3b8' : '#0f172a'}); }); c.restore(); };
  panel(140, 'Foto asli dari HP Lina', 'proyektor.jpg', [['Kamera', 'Galaxia A15'], ['Waktu', '18-11-2026 09.12'], ['Lokasi GPS', '6°54\'17"S 107°36\'35"E', true], ['Ukuran', '2000 × 1500'], ['Berkas', '388 KB']], C.coral, muncul(t, t1));
  panel(1000, 'Foto yang disimpan aplikasi', 'foto/k3Vx…9aQ.jpg', [['Kamera', '(tidak ada)'], ['Waktu', '(tidak ada)'], ['Lokasi GPS', '(tidak ada)'], ['Ukuran', '1600 × 1200'], ['Berkas', '±150 KB']], C.lime, muncul(t, t3), true);
  if (t < t1) { const p = muncul(t, .5); c.save(); c.globalAlpha = p; ['Tipe HP', 'Waktu pemotretan', 'Lokasi GPS'].forEach((s, i) => { const q = muncul(t, kt(a, 1) + i * 1.2); c.globalAlpha = q; K.rrect(c, 300 + i * 460, 440, 400, 150, 20, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, s, 500 + i * 460, 515, {size: 34, weight: 800, align: 'center'}); }); c.restore(); }
};
// Folder public vs storage
AD.folderPrivat = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di mana berkasnya disimpan?', t, C.teal);
  const t1 = kt(a, 2), t2 = kt(a, 3), p0 = muncul(t, .5);
  const kol = (x, nama, isi, warna, p, ket) => { c.save(); c.globalAlpha = p; K.rrect(c, x, 250, 780, 470, 20, 'rgba(255,255,255,.05)', warna, 4); K.text(c, nama, x + 36, 304, {size: 34, weight: 900, mono: true, color: warna});
    isi.forEach((s, i) => K.text(c, s, x + 60, 380 + i * 56, {size: 28, weight: 600, mono: true})); K.text(c, ket, x + 36, 670, {size: 26, weight: 800, color: warna, maxW: 700}); c.restore(); };
  kol(140, 'public/', ['index.php', 'css/gaya.css', 'build/'], C.amber, p0, 'Punya alamat: bisa dibuka dari browser');
  kol(1000, 'storage/app/private/', ['foto/k3Vx…9aQ.jpg', 'foto/Zp81…mT2.jpg'], C.lime, muncul(t, .9), 'Tidak punya alamat');
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 140, 770, 1640, 80, 40, '#fff', '#cbd5e1', 3); K.text(c, 'silapor.sekolah.id/storage/app/private/foto/k3Vx…9aQ.jpg', 190, 811, {size: 28, weight: 600, mono: true, color: '#334155'});
    K.text(c, '404', 1730, 811, {size: 34, weight: 900, color: '#ef4444', align: 'right'}); c.restore(); }
  K.text(c, 'Berkas jahat yang lolos pun tidak akan pernah dijalankan server.', 960, 920, {size: 32, weight: 800, align: 'center', color: C.lime, alpha: muncul(t, t2)});
};
// Tiga lapis pengaman (pembuka bab)
AD.tigaLapis = (c, t, D, a) => { K.bg(c); K.judul(c, 'Upload: pintu yang paling sering dibobol', t, C.coral);
  [['1', 'Periksa isinya', 'bukan namanya'], ['2', 'Tulis ulang', 'sebagai JPEG baru, nama acak'], ['3', 'Simpan di luar public', 'tidak punya alamat']].forEach((s, i) => { const p = muncul(t, kt(a, 2) + .8 + i * .9); if (p <= 0) return; c.save(); c.globalAlpha = p;
    const x = 140 + i * 560; K.rrect(c, x, 360 + (1 - p) * 20, 520, 300, 22, 'rgba(255,255,255,.05)', [C.sky, C.amber, C.lime][i], 4); K.text(c, s[0], x + 40, 440, {size: 70, weight: 900, color: [C.sky, C.amber, C.lime][i]}); K.text(c, s[1], x + 40, 540, {size: 36, weight: 900, maxW: 440}); K.text(c, s[2], x + 40, 600, {size: 26, weight: 600, color: C.redup, maxW: 440}); c.restore(); });
};
})();
