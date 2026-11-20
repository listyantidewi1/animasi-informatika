// B04 API dengan Express
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const kotak = (c, x, y, nama, sub, warna, p = 1) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, x, y, 380, 220, 24, '#18213c', warna, 5); K.text(c, nama, x + 190, y + 90, {size: 46, weight: 900, align: 'center', color: warna}); K.text(c, sub, x + 190, y + 150, {size: 26, weight: 600, align: 'center', color: C.redup}); c.restore(); };
// b2: browser -> Express -> MySQL
AD.alurAPI = (c, t, D, a) => { K.bg(c); K.judul(c, 'Siapa yang berbicara dengan database?', t, C.sky);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), Y = 360;
  kotak(c, 140, Y, 'Browser', 'di HP siswa', C.sky, muncul(t, .3)); kotak(c, 1400, Y, 'MySQL', 'database', C.teal, muncul(t, .6));
  const A = t < t1 ? muncul(t, 1.4) : 1 - muncul(t, t1 - .2, .4);
  if (A > 0) { c.save(); c.globalAlpha = A; K.arrow(c, 540, Y + 110, 1380, Y + 110, C.coral, 6, muncul(t, 1.4, .8)); K.coret(c, 880, Y + 60, 1040, Y + 160, muncul(t, 3.2, .4)); K.coret(c, 1040, Y + 60, 880, Y + 160, muncul(t, 3.5, .4));
    const p = muncul(t, 4.2); if (p > 0) { c.globalAlpha = A * p; K.rrect(c, 360, 680, 1200, 130, 22, 'rgba(255,107,107,.08)', C.coral, 4); K.text(c, 'Kata sandi database ikut sampai ke setiap HP', 960, 746, {size: 42, weight: 900, align: 'center', color: C.coral}); } c.restore(); }
  kotak(c, 770, Y, 'Express', 'server, perantara', C.lime, muncul(t, t1));
  const p2 = muncul(t, t2, .6); if (p2 > 0) { K.arrow(c, 530, Y + 70, 760, Y + 70, C.sky, 6, p2); K.text(c, 'GET /api/buku?q=bumi', 330, Y - 50, {size: 34, weight: 800, mono: true, align: 'center', color: C.sky, alpha: p2}); }
  const p3 = muncul(t, t3 + 1.2, .6); if (p3 > 0) { K.arrow(c, 1160, Y + 70, 1390, Y + 70, C.lime, 6, p3); K.text(c, 'SELECT ... WHERE judul LIKE ?', 1280, Y - 50, {size: 30, weight: 800, mono: true, align: 'center', color: C.lime, alpha: p3}); }
  const p4 = muncul(t, t3 + 3.2, .6); if (p4 > 0) { K.arrow(c, 1390, Y + 150, 1160, Y + 150, C.teal, 6, p4); K.text(c, 'baris data', 1275, Y + 270, {size: 30, weight: 800, align: 'center', color: C.teal, alpha: p4}); }
  const p5 = muncul(t, t3 + 4.6, .6); if (p5 > 0) { K.arrow(c, 760, Y + 150, 530, Y + 150, C.amber, 6, p5); K.text(c, 'JSON', 645, Y + 270, {size: 34, weight: 900, align: 'center', color: C.amber, alpha: p5}); K.text(c, '[{ "judul": "Bumi", ... }]', 330, Y + 330, {size: 28, weight: 700, mono: true, align: 'center', color: C.amber, alpha: p5}); }
  const p6 = muncul(t, t4); if (p6 > 0) { c.save(); c.globalAlpha = p6; K.rrect(c, 140, 800, 1640, 190, 24, 'rgba(255,255,255,.05)', C.violet, 4); K.text(c, 'API', 220, 895, {size: 72, weight: 900, color: C.violet}); K.text(c, 'kumpulan alamat yang dijawab server', 420, 850, {size: 32, weight: 700, color: C.redup});
    ['/api/buku', '/api/auth/masuk', '/api/pinjam'].forEach((s, i) => K.text(c, s, 420 + i * 440, 930, {size: 36, weight: 800, mono: true, alpha: muncul(t, t4 + .5 + i * .4)})); c.restore(); }
};
// b10: SQL injection pada kode AI
AD.injeksi = (c, t, D, a) => { K.bg(c); K.cekAIjudul(c, t);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), size = 30, cw = K.lebar(c, 'M', size, 500, true);
  K.text(c, 'Kode AI', 140, 190, {size: 28, weight: 800, color: C.pink}); K.kode(c, ['db.query("SELECT judul, penulis FROM buku WHERE judul LIKE \'%" + q + "%\'")'], 140, 215, {size, w: 1640});
  const SER = "' UNION SELECT nis, sandi_hash FROM pengguna -- "; const n = t < t2 ? 0 : Math.floor(K.clamp((t - t2 - .3) / 4.5) * SER.length); const q = t < t1 ? 'bumi' : SER.slice(0, n);
  K.text(c, 'Yang diketik di kotak cari', 140, 380, {size: 28, weight: 800, color: C.redup}); K.rrect(c, 140, 405, 1640, 84, 14, '#fff', t >= t1 ? C.coral : C.sky, 5); K.text(c, q + (Math.floor(t * 2) % 2 ? '|' : ''), 170, 449, {size: 34, weight: 700, mono: true, color: t >= t1 ? '#b91c1c' : '#0f172a'});
  K.text(c, 'Perintah yang sampai ke MySQL', 140, 560, {size: 28, weight: 800, color: C.redup}); K.rrect(c, 140, 585, 1640, 96, 14, '#0d1222', C.garis, 2);
  const pre = "SELECT judul, penulis FROM buku WHERE judul LIKE '%", s2 = 25, c2 = K.lebar(c, 'M', s2, 600, true); let x = 164;
  K.text(c, pre, x, 634, {size: s2, weight: 600, mono: true}); x += pre.length * c2; K.text(c, q, x, 634, {size: s2, weight: 800, mono: true, color: t >= t1 ? C.coral : C.amber}); x += q.length * c2; K.text(c, "%'", x, 634, {size: s2, weight: 600, mono: true, color: t >= t2 + 5 ? '#475569' : C.teks});
  if (t < t1) K.text(c, 'Dengan kata "bumi", hasilnya benar.', 140, 750, {size: 34, weight: 800, color: C.lime, alpha: muncul(t, 1.5)});
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, 'Jawaban server', 140, 750, {size: 28, weight: 800, color: C.redup});
    [['petugas', '$2b$10$T6awiWYNdfnOqkYV/TwJRuyMwwSThje2yW...'], ['2425011', '$2b$10$T6awiWYNdfnOqkYV/TwJRuyMwwSThje2yW...'], ['2425102', '$2b$10$T6awiWYNdfnOqkYV/TwJRuyMwwSThje2yW...']].forEach(([n, h], i) => { const g = muncul(t, t3 + 1.5 + i * .6); if (g <= 0) return; c.globalAlpha = p3 * g; const y = 775 + i * 78; K.rrect(c, 140, y, 1100, 66, 12, 'rgba(255,107,107,.08)', C.coral, 2);
      K.text(c, n, 170, y + 34, {size: 28, weight: 800, mono: true}); K.text(c, h, 360, y + 34, {size: 24, weight: 600, mono: true, color: C.coral}); });
    c.globalAlpha = p3 * muncul(t, t3 + 1.5); K.text(c, 'nis', 170, 1022, {size: 22, weight: 700, color: C.redup}); K.text(c, 'kata sandi teracak', 360, 1022, {size: 22, weight: 700, color: C.redup}); c.restore(); }
  const p4 = muncul(t, t4); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 1300, 790, 480, 200, 24, 'rgba(255,107,107,.14)', C.coral, 6); K.text(c, 'SQL', 1540, 860, {size: 64, weight: 900, align: 'center', color: C.coral}); K.text(c, 'injection', 1540, 932, {size: 56, weight: 900, align: 'center', color: C.coral}); c.restore(); }
};
})();
