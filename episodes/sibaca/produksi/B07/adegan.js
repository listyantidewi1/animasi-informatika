// B07 Pencarian
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b4: arti % dan _ di dalam LIKE
AD.polaLike = (c, t, D, a) => { K.bg(c); K.judul(c, 'Satu lubang kecil di dalam LIKE', t, C.coral);
  const t1 = kt(a, 1), t2 = kt(a, 2);
  const kartu = (x, tanda, arti, contoh, cocok, warna, p) => { if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, x, 220, 780, 400, 24, '#18213c', warna, 5); K.text(c, tanda, x + 110, 340, {size: 130, weight: 900, mono: true, color: warna, align: 'center'});
    K.text(c, arti, x + 230, 300, {size: 40, weight: 900}); K.text(c, contoh, x + 230, 380, {size: 34, weight: 700, mono: true, color: C.amber}); K.text(c, cocok, x + 60, 520, {size: 30, weight: 700, color: C.redup, maxW: 680, lh: 1.3}); c.restore(); };
  kartu(140, '%', 'apa saja', "LIKE '%bumi%'", 'cocok dengan: Bumi, Bumi Manusia, Di Bumi Lain', C.sky, muncul(t, t1));
  kartu(1000, '_', 'satu huruf apa saja', "LIKE 'b_mi'", 'cocok dengan: bumi, bami, bomi', C.violet, muncul(t, t1 + 3.6));
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 690, 1640, 280, 24, 'rgba(255,107,107,.08)', C.coral, 5);
    K.text(c, 'Nadia mengetik:', 200, 760, {size: 32, weight: 700, color: C.redup}); K.rrect(c, 480, 722, 200, 76, 12, '#fff', C.coral, 4); K.text(c, '%', 580, 762, {size: 44, weight: 900, mono: true, align: 'center', color: '#b91c1c'});
    K.text(c, "LIKE '%%%'", 760, 762, {size: 44, weight: 900, mono: true, color: C.amber, alpha: muncul(t, t2 + 1.2)}); K.text(c, 'Semua buku cocok, padahal ia mencari judul yang mengandung tanda persen.', 200, 890, {size: 36, weight: 800, alpha: muncul(t, t2 + 2.2)}); c.restore(); }
};
})();
