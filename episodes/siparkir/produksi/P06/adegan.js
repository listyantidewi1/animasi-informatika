// P06 Halaman admin
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b1: empat hal, satu pola CRUD
AD.crud = (c, t, D, a) => { K.bg(c); K.judul(c, 'Empat hal, satu pola', t, C.amber, 'Yang dikelola Bu Sinta sebagai admin');
  const T0 = kt(a, 1) < 9e8 ? kt(a, 1) : .5, t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4);
  K.tokoh(c, 'sinta', 250, 700, 340, muncul(t, T0 - .2));
  const hal = [['Area parkir', C.sky], ['Tarif', C.lime], ['Kendaraan', C.pink], ['Pengguna', C.violet]];
  hal.forEach(([n, w], i) => { const p = muncul(t, T0 + 2.2 + i * .75); if (p <= 0) return; const x = 520 + i * 320, y = 250 + (1 - p) * 20; c.save(); c.globalAlpha = p * (t >= t3 && t < t4 && i > 0 ? .55 : 1);
    K.rrect(c, x, y, 290, 130, 22, 'rgba(255,255,255,.05)', w, t >= t3 && i === 0 ? 7 : 4); K.text(c, n, x + 145, y + 66, {size: 34, weight: 900, align: 'center', color: w}); c.restore();
    const q = muncul(t, t3 + .4 + (i ? 1.6 : 0)); if (q > 0 && t < t4 + 1) { c.save(); c.globalAlpha = q * (1 - muncul(t, t4)); K.text(c, i ? 'salin polanya' : 'ditulis teliti', x + 145, y + 166, {size: 26, weight: 800, align: 'center', color: i ? C.redup : C.amber}); c.restore(); } });
  const crud = [['C', 'Create', 'membuat'], ['R', 'Read', 'membaca'], ['U', 'Update', 'mengubah'], ['D', 'Delete', 'menghapus']];
  crud.forEach(([h, e, id], i) => { const p = muncul(t, t2 + 3.2 + i * .9); if (p <= 0) return; const x = 520 + i * 320, y = 470 + (1 - p) * 20; c.save(); c.globalAlpha = p;
    K.rrect(c, x, y, 290, 230, 22, 'rgba(255,176,32,.08)', C.amber, 3); K.text(c, h, x + 145, y + 76, {size: 96, weight: 900, align: 'center', color: C.amber}); K.text(c, e, x + 145, y + 150, {size: 28, weight: 700, align: 'center', mono: true}); K.text(c, id, x + 145, y + 194, {size: 28, weight: 700, align: 'center', color: C.redup}); c.restore(); });
  const p4 = muncul(t, t4); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 520, 760, 1250, 150, 22, 'rgba(45,212,191,.10)', C.teal, 4); K.text(c, 'Log aktivitas', 560, 808, {size: 32, weight: 900, color: C.teal});
    K.text(c, '23/11/2026 10.05   Bu Sinta   mengubah   tarif motor: 3000, 1000, maksimal 8000', 560, 866, {size: 25, weight: 600, mono: true}); c.restore(); }
};
})();
