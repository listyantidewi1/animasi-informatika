// B05 Daftar dan login
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b2: hash satu arah, lalu cookie bertanda tangan
AD.hashCookie = (c, t, D, a) => { K.bg(c);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  const A = t < t4 ? 1 : 1 - muncul(t, t4 - .3, .4);
  if (A > 0) { c.save(); c.globalAlpha = A; K.judul(c, '1. Kata sandi tidak disimpan apa adanya', t, C.amber);
    const p1 = muncul(t, t1); c.globalAlpha = A * p1; K.rrect(c, 140, 380, 460, 180, 22, '#18213c', C.sky, 5); K.text(c, 'kata sandi', 370, 425, {size: 26, weight: 700, align: 'center', color: C.redup}); K.text(c, 'rahasia123', 370, 495, {size: 48, weight: 900, align: 'center', mono: true});
    const p2 = muncul(t, t2); if (p2 > 0) { c.globalAlpha = A * p2; K.arrow(c, 620, 470, 800, 470, C.amber, 7, p2); K.rrect(c, 820, 400, 240, 140, 70, 'rgba(255,176,32,.14)', C.amber, 5); K.text(c, 'bcrypt', 940, 472, {size: 40, weight: 900, align: 'center', color: C.amber});
      const q = muncul(t, t2 + 1.2); c.globalAlpha = A * q; K.arrow(c, 1080, 470, 1240, 470, C.amber, 7, q); K.rrect(c, 1260, 380, 520, 180, 22, '#18213c', C.lime, 5); K.text(c, 'hash, yang disimpan', 1520, 425, {size: 26, weight: 700, align: 'center', color: C.redup}); K.text(c, '$2b$10$T6awiWYN...', 1520, 495, {size: 38, weight: 900, align: 'center', mono: true, color: C.lime}); }
    const p3 = muncul(t, t3 + 3.2); if (p3 > 0) { c.globalAlpha = A * p3; K.arrow(c, 1250, 680, 620, 680, C.coral, 7, p3); K.coret(c, 880, 630, 990, 730, muncul(t, t3 + 4.2, .4)); K.coret(c, 990, 630, 880, 730, muncul(t, t3 + 4.5, .4));
      K.text(c, 'Dari hash, tidak bisa kembali ke kata sandi', 960, 820, {size: 44, weight: 900, align: 'center', color: C.coral}); }
    c.restore(); }
  const B = muncul(t, t4); if (B <= 0) return; c.save(); c.globalAlpha = B; K.judul(c, '2. Server mengingat lewat cookie', 9, C.violet);
  K.rrect(c, 140, 300, 420, 420, 24, '#18213c', C.sky, 5); K.text(c, 'Browser', 350, 360, {size: 44, weight: 900, align: 'center', color: C.sky});
  K.rrect(c, 1360, 300, 420, 420, 24, '#18213c', C.lime, 5); K.text(c, 'Server', 1570, 360, {size: 44, weight: 900, align: 'center', color: C.lime});
  const kartu = (x, y, p) => { if (p <= 0) return; c.save(); c.globalAlpha = B * p; K.rrect(c, x, y, 300, 170, 16, '#fef3c7', '#d97706', 4); K.text(c, 'KARTU ANGGOTA', x + 150, y + 36, {size: 22, weight: 900, align: 'center', color: '#92400e'}); K.text(c, 'id pengguna: 3', x + 150, y + 86, {size: 26, weight: 800, align: 'center', color: '#1e293b', mono: true}); K.text(c, 'tanda tangan ✓', x + 150, y + 134, {size: 24, weight: 800, align: 'center', color: '#b45309'}); c.restore(); };
  const g = K.ease(K.seg(t, t4 + 2.2, t4 + 4.0)); K.text(c, 'login berhasil', 960, 330, {size: 30, weight: 800, align: 'center', color: C.redup, alpha: muncul(t, t4 + .8)});
  if (t < t5) kartu(K.lerp(1420, 200, g), 440, muncul(t, t4 + 1.4));
  else { const u = (t - t5) % 3.2 / 3.2, pergi = K.ease(K.seg(u, .05, .55)); kartu(200, 440, 1); K.arrow(c, 580, 560, 1340, 560, C.sky, 6, pergi); K.text(c, 'setiap permintaan membawa kartu itu', 960, 520, {size: 30, weight: 800, align: 'center', color: C.sky});
    const cek = muncul(t, t5 + 3.4); if (cek > 0) { c.globalAlpha = B * cek; K.rrect(c, 1400, 440, 340, 170, 16, 'rgba(163,230,53,.12)', C.lime, 4); K.text(c, 'memeriksa', 1570, 494, {size: 30, weight: 800, align: 'center'}); K.text(c, 'tanda tangan', 1570, 544, {size: 34, weight: 900, align: 'center', color: C.lime}); } }
  c.globalAlpha = B * muncul(t, t4 + 4.2); K.text(c, 'Tanda tangan dibuat dengan kunci rahasia yang hanya dimiliki server.', 960, 850, {size: 36, weight: 800, align: 'center', color: C.amber});
  c.restore(); };
})();
