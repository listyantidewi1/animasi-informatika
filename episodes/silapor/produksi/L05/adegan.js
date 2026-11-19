// L05 Login dan peran
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const kotak = (c, x, y, w, h, judul, warna, p = 1) => { c.save(); c.globalAlpha *= p; K.rrect(c, x, y, w, h, 20, 'rgba(255,255,255,.05)', warna, 4); if (judul) K.text(c, judul, x + w / 2, y + 44, {size: 28, weight: 900, color: warna, align: 'center'}); c.restore(); };
// Hash: fungsi satu arah
AD.hash = (c, t, D, a) => { K.bg(c); K.judul(c, 'Kata sandi tidak pernah disimpan apa adanya', t, C.amber);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = t2 + 3.2;
  const p0 = muncul(t, .6); kotak(c, 140, 330, 420, 200, 'Kata sandi', C.sky, p0); K.text(c, 'rahasia123', 350, 450, {size: 44, weight: 800, mono: true, align: 'center', alpha: p0});
  const p1 = muncul(t, t1); kotak(c, 720, 330, 360, 200, 'Fungsi hash', C.violet, p1); K.text(c, 'bcrypt', 900, 450, {size: 44, weight: 800, mono: true, align: 'center', alpha: p1}); K.arrow(c, 580, 430, 700, 430, C.lime, 7, p1);
  const p1b = muncul(t, t1 + .8); kotak(c, 1240, 330, 540, 200, 'Yang disimpan di database', C.amber, p1b); K.text(c, '$2y$12$Qm8rT1…kV9eXu', 1510, 450, {size: 36, weight: 800, mono: true, align: 'center', alpha: p1b}); K.arrow(c, 1100, 430, 1220, 430, C.lime, 7, p1b);
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.text(c, 'kata sandi  →  hash', 660, 640, {size: 36, weight: 800, color: C.lime, align: 'center'}); K.centang(c, 900, 640, 44, p2, C.lime); c.restore(); }
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, 'hash  →  kata sandi', 660, 740, {size: 36, weight: 800, color: C.coral, align: 'center'}); K.text(c, '✕', 900, 742, {size: 50, weight: 900, color: C.coral, align: 'center'});
    K.text(c, 'Satu arah: kalau database bocor, kata sandi aslinya tetap tidak terbaca.', 960, 880, {size: 32, weight: 700, align: 'center'}); c.restore(); }
};
// Sesi dan cookie; regenerate
AD.sesi = (c, t, D, a) => { K.bg(c); K.judul(c, 'Bagaimana server mengenali kita?', t, C.sky);
  const t1 = kt(a, 2), t2 = kt(a, 3), baru = t > t2 + .8, no = baru ? 'k7Pz…91' : 'a3Xf…20';
  const p0 = muncul(t, .5); kotak(c, 140, 300, 560, 300, 'Browser', C.sky, p0); kotak(c, 1220, 300, 560, 300, 'Server', C.teal, p0);
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 200, 420, 440, 130, 16, '#fef3c7', '#d6b56b', 3); K.text(c, 'cookie: nomor sesi', 230, 462, {size: 24, weight: 800, color: '#8a6d3b'}); K.text(c, no, 230, 512, {size: 38, weight: 800, mono: true, color: baru ? '#15803d' : '#3b2f1d'});
    K.rrect(c, 1280, 420, 440, 130, 16, 'rgba(45,212,191,.12)', C.teal, 3); K.text(c, 'sesi ' + no, 1310, 462, {size: 26, weight: 800, mono: true, color: C.teal}); K.text(c, baru ? 'ini Lina' : 'tamu', 1310, 512, {size: 34, weight: 800});
    K.arrow(c, 720, 470, 1200, 470, '#94a3b8', 6, p1); K.text(c, 'setiap request membawa nomor ini', 960, 430, {size: 24, weight: 700, color: C.redup, align: 'center'}); c.restore(); }
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 680, 1640, 150, 18, 'rgba(163,230,53,.08)', C.lime, 4); K.text(c, 'session()->regenerate()', 180, 730, {size: 34, weight: 900, mono: true, color: C.lime});
    K.text(c, 'Nomor lama dibuang tepat setelah login. Kalau ada yang sempat mengintipnya, nomor itu sudah tidak berlaku.', 180, 786, {size: 26, weight: 600, maxW: 1560}); c.restore(); }
};
// Keluar lewat GET bisa dipicu situs lain
AD.keluarGet = (c, t, D, a) => { K.bg(c); K.judul(c, 'Kenapa keluar harus POST?', t, C.coral);
  const t1 = kt(a, 1), p0 = muncul(t, .5), p1 = muncul(t, t1), p2 = muncul(t, t1 + 3.5);
  K.text(c, 'Seandainya keluar cukup dengan membuka alamat:', 140, 270, {size: 30, weight: 700, alpha: p0}); c.save(); c.globalAlpha = p0; K.kode(c, ['<a href="/keluar">Keluar</a>'], 140, 300, {size: 34, w: 1640}); c.restore();
  if (p1 > 0) { c.save(); c.globalAlpha = p1; K.text(c, 'Situs lain cukup memasang gambar seperti ini:', 140, 500, {size: 30, weight: 700, color: C.coral}); K.kode(c, ['<img src="https://silapor.sekolah.id/keluar">'], 140, 530, {size: 34, w: 1640}); c.restore(); }
  if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 720, 1640, 190, 18, 'rgba(255,107,107,.1)', C.coral, 4); K.text(c, 'Browser membuka alamat itu diam-diam, dan pengguna keluar sendiri.', 180, 780, {size: 34, weight: 800, maxW: 1560});
    K.text(c, 'Form POST dengan @csrf tidak bisa dipicu dengan cara ini.', 180, 850, {size: 30, weight: 700, color: C.lime}); c.restore(); }
};
// Middleware: pos pemeriksaan
AD.middleware = (c, t, D, a) => { K.bg(c); K.judul(c, 'Middleware: pos pemeriksaan', t, C.violet, 'Dilewati setiap request sebelum sampai ke controller');
  const t1 = kt(a, a.k1 ?? 2), t2 = kt(a, a.k2 ?? 3), p0 = muncul(t, .5);
  kotak(c, 140, 380, 360, 200, 'Request', C.sky, p0); K.text(c, 'GET /laporan', 320, 500, {size: 32, weight: 800, mono: true, align: 'center', alpha: p0});
  const p1 = muncul(t, t1); kotak(c, 720, 340, 440, 280, 'middleware auth', C.violet, p1); K.text(c, 'Sudah login?', 940, 500, {size: 40, weight: 900, align: 'center', alpha: p1}); K.arrow(c, 520, 480, 700, 480, '#94a3b8', 7, p1);
  const p1b = muncul(t, t1 + 1.2); kotak(c, 1380, 280, 400, 180, 'Controller', C.lime, p1b); K.arrow(c, 1180, 420, 1360, 380, C.lime, 7, p1b); K.text(c, 'ya', 1260, 360, {size: 30, weight: 900, color: C.lime, align: 'center', alpha: p1b}); K.text(c, 'halaman tampil', 1580, 400, {size: 30, weight: 700, align: 'center', alpha: p1b});
  const p2 = muncul(t, t2); kotak(c, 1380, 520, 400, 180, 'Dialihkan', C.amber, p2); K.arrow(c, 1180, 540, 1360, 600, C.amber, 7, p2); K.text(c, 'belum', 1250, 620, {size: 30, weight: 900, color: C.amber, align: 'center', alpha: p2}); K.text(c, 'ke /masuk', 1580, 640, {size: 34, weight: 800, mono: true, align: 'center', alpha: p2});
};
})();
