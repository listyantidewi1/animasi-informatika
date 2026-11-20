// P12 Online
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const kotak = (c, x, y, w, h, judul, sub, warna, p, isi) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, x, y + (1 - p) * 20, w, h, 24, 'rgba(255,255,255,.05)', warna, 4); K.text(c, judul, x + w / 2, y + 60, {size: 34, weight: 900, align: 'center', color: warna}); if (sub) K.text(c, sub, x + w / 2, y + 108, {size: 24, weight: 600, align: 'center', color: C.redup, maxW: w - 40}); if (isi) isi(); c.restore(); };
// b2: image, container, dua container, compose.yaml
AD.dockerKonsep = (c, t, D, a) => { K.bg(c); K.judul(c, 'Docker: program dan kebutuhannya dalam satu kemasan', t, C.sky);
  const T = i => kt(a, a['k' + i]) < 9e8 ? kt(a, a['k' + i]) : i * 3, p0 = muncul(t, .6), p1 = muncul(t, T(1)), fase2 = t >= T(2);
  if (!fase2) { kotak(c, 260, 330, 520, 420, 'Image', 'program + semua kebutuhannya', C.sky, p0, () => { ['kode aplikasi', 'PHP 8.3', 'pustaka'].forEach((s, i) => { K.rrect(c, 320, 470 + i * 80, 400, 62, 12, 'rgba(56,189,248,.15)', C.sky, 2); K.text(c, s, 520, 502 + i * 80, {size: 26, weight: 700, align: 'center'}); }); });
    K.arrow(c, 800, 540, 1120, 540, C.amber, 7, p1); if (p1 > 0) K.text(c, 'dijalankan', 960, 500, {size: 26, weight: 800, align: 'center', color: C.amber, alpha: p1});
    kotak(c, 1140, 330, 520, 420, 'Container', 'image yang sedang berjalan', C.lime, p1, () => { c.fillStyle = C.lime; c.beginPath(); c.moveTo(1360, 510); c.lineTo(1360, 650); c.lineTo(1470, 580); c.closePath(); c.fill(); }); return; }
  const p3 = muncul(t, T(3)), p4 = muncul(t, T(4)), p5 = muncul(t, T(5));
  K.text(c, 'Kita butuh dua container', 960, 250, {size: 38, weight: 900, align: 'center', alpha: muncul(t, T(2))});
  kotak(c, 240, 330, 640, 380, 'app', 'Laravel kita, dijalankan FrankenPHP', C.sky, p3, () => { K.rrect(c, 300, 500, 520, 70, 12, 'rgba(56,189,248,.15)', C.sky, 2); K.text(c, 'server web + PHP dalam satu program', 560, 536, {size: 25, weight: 700, align: 'center'}); K.text(c, 'port 80 dan 443', 560, 630, {size: 26, weight: 700, mono: true, align: 'center', color: C.redup}); });
  kotak(c, 1040, 330, 640, 380, 'db', 'MySQL', C.amber, p4, () => { K.rrect(c, 1100, 500, 520, 70, 12, 'rgba(255,176,32,.15)', C.amber, 2); K.text(c, 'enam tabel SiParkir', 1360, 536, {size: 25, weight: 700, align: 'center'}); K.text(c, 'data disimpan di volume', 1360, 630, {size: 26, weight: 700, align: 'center', color: C.redup}); });
  if (p4 > 0) { K.arrow(c, 890, 520, 1030, 520, '#94a3b8', 5, p4); }
  if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, 240, 770, 1440, 150, 24, 'rgba(163,230,53,.08)', C.lime, 4); K.text(c, 'compose.yaml', 300, 846, {size: 44, weight: 900, mono: true, color: C.lime}); K.text(c, 'Satu berkas yang mengatur keduanya.', 720, 846, {size: 32, weight: 700}); c.restore(); }
};
// b5: VPS, domain, README
AD.server = (c, t, D, a) => { K.bg(c); K.judul(c, 'Pindah ke server', t, C.teal, 'Komputer sewaan yang menyala terus');
  const T = i => kt(a, a['k' + i]) < 9e8 ? kt(a, a['k' + i]) : i * 3, p1 = muncul(t, T(1) + .2), p2 = muncul(t, T(2)), p2b = muncul(t, T(2) + 3.0), p3 = muncul(t, T(3));
  kotak(c, 1080, 280, 600, 360, 'VPS', 'Ubuntu 24.04', C.teal, p2, () => { for (let i = 0; i < 3; i++) { K.rrect(c, 1140, 420 + i * 62, 480, 48, 8, '#1e293b', '#475569', 2); c.fillStyle = C.lime; c.beginPath(); c.arc(1172, 444 + i * 62, 7, 0, 7); c.fill(); } });
  if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 240, 330, 520, 260, 20, 'rgba(255,255,255,.05)', '#64748b', 3); K.text(c, 'Laptop', 500, 390, {size: 34, weight: 900, align: 'center'}); K.text(c, 'kode sudah di GitHub', 500, 450, {size: 26, weight: 600, align: 'center', color: C.redup}); c.restore(); }
  if (p2b > 0) { c.save(); c.globalAlpha = p2b; K.rrect(c, 420, 690, 1080, 110, 55, 'rgba(255,176,32,.10)', C.amber, 4); K.text(c, 'parkir.sekolahmu.sch.id', 720, 746, {size: 34, weight: 800, mono: true, align: 'center'}); K.arrow(c, 1000, 746, 1100, 746, C.amber, 5, p2b); K.text(c, '203.0.113.25', 1290, 746, {size: 34, weight: 800, mono: true, align: 'center', color: C.amber}); c.restore(); }
  K.chipRepo(c, p3, {ket: 'Cara menyewa server dan mengarahkan domain: README', y: 860});
};
// b7: gembok HTTPS dan halaman masuk
AD.online = (c, t, D, a) => { K.bg(c); K.judul(c, 'SiParkir sudah online', t, C.lime);
  const T = i => kt(a, a['k' + i]) < 9e8 ? kt(a, a['k' + i]) : i * 3, p3 = muncul(t, T(3) + .2), p4 = muncul(t, T(4)), p5 = muncul(t, T(5)), im = K.IMG[a.img];
  K.browser(c, 200, 200, 1100, 640, '🔒 https://parkir.sekolahmu.sch.id/masuk', (c, x, y, w, h) => { if (im) c.drawImage(im, x, y, w, w * im.height / im.width); }, p3);
  if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 1360, 260, 420, 170, 20, 'rgba(163,230,53,.10)', C.lime, 4); K.text(c, 'HTTPS', 1570, 316, {size: 40, weight: 900, align: 'center', color: C.lime}); K.text(c, 'sertifikat diurus FrankenPHP', 1570, 376, {size: 24, weight: 600, align: 'center'}); c.restore(); }
  if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, 1360, 480, 420, 330, 20, 'rgba(255,107,107,.12)', C.coral, 5); K.text(c, 'Langkah pertama', 1570, 534, {size: 30, weight: 900, align: 'center', color: C.coral}); K.text(c, 'Ganti kata sandi keempat akun contoh.', 1390, 610, {size: 28, weight: 700, maxW: 360, lh: 1.3}); K.text(c, 'Kata sandinya tertulis terbuka di GitHub.', 1390, 730, {size: 24, weight: 600, maxW: 360, lh: 1.3, color: C.redup}); c.restore(); }
};
// b11: rangkuman
AD.akhir = (c, t, D, a) => { K.bg(c); K.judul(c, 'Dari folder kosong sampai online', t, C.amber);
  const T = i => kt(a, a['k' + i]) < 9e8 ? kt(a, a['k' + i]) : i * 3, t1 = T(1), L = Math.max(6, T(2) - t1 - 1);
  const langkah = [['Kebutuhan', C.pink], ['Enam tabel', C.teal], ['Rumus tarif + test', C.lime], ['Struk 58 mm', C.sky], ['Rekap yang benar', C.violet], ['Online', C.amber]];
  langkah.forEach(([s, w], i) => { const p = muncul(t, t1 + .8 + i * L / 6.4); if (p <= 0) return; const x = 140 + (i % 3) * 560, y = 250 + Math.floor(i / 3) * 170; c.save(); c.globalAlpha = p; K.rrect(c, x, y + (1 - p) * 18, 520, 130, 22, 'rgba(255,255,255,.05)', w, 4); K.nomor(c, i + 1, x + 60, y + 65, w); K.text(c, s, x + 110, y + 66, {size: 32, weight: 900}); c.restore(); });
  const p2 = muncul(t, T(2)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 620, 1640, 150, 24, 'rgba(244,114,182,.10)', C.pink, 4); K.text(c, '12', 240, 696, {size: 84, weight: 900, color: C.pink, align: 'center'}); K.text(c, 'kesalahan yang lazim muncul dari AI, dan cara menemukannya', 340, 696, {size: 34, weight: 800}); c.restore(); }
  K.chipRepo(c, muncul(t, T(3)), {ket: 'Daftar periksa kode AI ada di README', y: 830});
};
// b12: tantangan terakhir dan ajakan ke playlist
AD.tantanganAkhir = (c, t, D, a) => { K.bg(c); K.judul(c, 'Tantangan terakhir', t, C.lime, 'Bangun ulang untuk kebutuhan di sekitarmu');
  const T = i => kt(a, a['k' + i]) < 9e8 ? kt(a, a['k' + i]) : i * 4;
  [['Penitipan helm', C.sky], ['Sewa lapangan', C.amber], ['Peminjaman alat', C.violet]].forEach(([s, w], i) => { const p = muncul(t, 3.4 + i * 1.3); if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, 140 + i * 560, 250 + (1 - p) * 18, 520, 130, 22, 'rgba(255,255,255,.05)', w, 4); K.text(c, s, 400 + i * 560, 316, {size: 34, weight: 900, align: 'center', color: w}); c.restore(); });
  [['Tanyakan aturannya langsung kepada orangnya', 0], ['Tulis test-nya dulu', 3.2], ['Jangan langsung percaya hasil AI sebelum kamu memeriksanya', 5.0]].forEach(([s, d], i) => { const p = muncul(t, T(1) + d); if (p <= 0) return; c.save(); c.globalAlpha = p; K.centang(c, 200, 480 + i * 90, 26, C.lime, p); K.text(c, s, 260, 480 + i * 90, {size: 34, weight: 800}); c.restore(); });
  const p2 = muncul(t, T(2)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 300, 780, 1320, 180, 28, '#0d1222', C.amber, 5); K.text(c, 'Video berikutnya', 960, 836, {size: 28, weight: 700, align: 'center', color: C.redup}); K.text(c, 'Playlist: Membangun Aplikasi dari Nol', 960, 900, {size: 46, weight: 900, align: 'center', color: C.amber}); c.restore(); }
};
})();
