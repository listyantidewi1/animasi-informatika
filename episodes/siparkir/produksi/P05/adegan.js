// P05 Login dan tiga peran
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b6 middleware = pos pemeriksaan di depan controller
AD.pos = (c, t, D, a) => { K.bg(c); K.judul(c, 'Middleware: pos pemeriksaan', t, C.violet, 'Dilewati setiap permintaan sebelum sampai ke controller');
  const t1 = kt(a, 1) < 9e8 ? kt(a, 1) : 1, p1 = muncul(t, t1), pj = muncul(t, t1 + 3.2), ps = muncul(t, t1 + 5.6);
  const yA = 430, yB = 760;
  // pos + controller
  c.save(); c.globalAlpha = p1; K.rrect(c, 820, 250, 300, 680, 26, 'rgba(167,139,250,.10)', C.violet, 5); K.text(c, 'MIDDLEWARE', 970, 300, {size: 30, weight: 900, align: 'center', color: C.violet}); K.text(c, 'Peran', 970, 346, {size: 34, weight: 800, align: 'center', mono: true});
  K.text(c, 'Perannya ada', 970, 580, {size: 26, weight: 700, align: 'center', color: C.redup}); K.text(c, 'dalam daftar?', 970, 616, {size: 26, weight: 700, align: 'center', color: C.redup});
  K.rrect(c, 1400, 330, 380, 200, 22, 'rgba(45,212,191,.10)', C.teal, 4); K.text(c, 'Controller', 1590, 400, {size: 36, weight: 900, align: 'center', color: C.teal}); K.text(c, 'halaman admin', 1590, 456, {size: 26, weight: 600, align: 'center', color: C.redup}); c.restore();
  // Bu Sinta: lolos
  if (ps > 0) { K.tokoh(c, 'sinta', 250, yA + 110, 200, ps, {tanpaNama: 1}); c.save(); c.globalAlpha = ps; K.text(c, 'Bu Sinta · admin', 250, yA + 150, {size: 26, weight: 800, align: 'center'});
    K.rrect(c, 400, yA - 36, 360, 72, 36, 'rgba(255,255,255,.06)', '#64748b', 3); K.text(c, '/admin/area', 580, yA, {size: 28, weight: 700, mono: true, align: 'center'}); c.restore();
    K.arrow(c, 770, yA, 1390, yA, C.lime, 7, muncul(t, t1 + 6.2, .9)); const q = muncul(t, t1 + 7.0); c.save(); c.globalAlpha = q; K.centang(c, 970, yA - 6, 34, C.lime, q); c.restore(); }
  // Pak Joko: ditolak
  if (pj > 0) { K.tokoh(c, 'joko', 250, yB + 110, 200, pj, {tanpaNama: 1}); c.save(); c.globalAlpha = pj; K.text(c, 'Pak Joko · petugas', 250, yB + 150, {size: 26, weight: 800, align: 'center'});
    K.rrect(c, 400, yB - 36, 360, 72, 36, 'rgba(255,255,255,.06)', '#64748b', 3); K.text(c, '/admin/area', 580, yB, {size: 28, weight: 700, mono: true, align: 'center'}); c.restore();
    K.arrow(c, 770, yB, 900, yB, C.coral, 7, muncul(t, t1 + 3.8, .6)); const q = muncul(t, t1 + 4.4); c.save(); c.globalAlpha = q; K.rrect(c, 1180, yB - 60, 420, 120, 22, 'rgba(255,107,107,.14)', C.coral, 5);
    K.text(c, '403', 1260, yB, {size: 56, weight: 900, color: C.coral, mono: true, align: 'center'}); K.text(c, 'Terlarang', 1450, yB, {size: 34, weight: 800, align: 'center'}); K.arrow(c, 1040, yB, 1170, yB, C.coral, 7, q); c.restore(); }
};
})();
