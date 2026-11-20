// P04 Migration dan model
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b9: $parking->vehicle->plate, Laravel yang mengambil datanya
AD.panah = (c, t, D, a) => { K.bg(c); K.judul(c, 'Relasi: dari transaksi ke kendaraannya', t, C.violet, 'Hasil fungsi vehicle() dengan belongsTo');
  const t0 = kt(a, a.k) < 9e8 ? kt(a, a.k) : 0, p0 = muncul(t, t0 + .3), p1 = muncul(t, t0 + 1.6), p2 = muncul(t, t0 + 3.0), p3 = muncul(t, t0 + 4.6);
  c.save(); c.globalAlpha = p0; K.kode(c, ['$parking->vehicle->plate'], 560, 220, {size: 48, w: 800}); c.restore();
  c.save(); c.scale(1.5, 1.5);
  const T1 = K.tabelERD(c, 120, 290, 'parkings', [['id', 'pk', '27'], ['vehicle_id', 'fk', '7'], ['entered_at', '', '07.15'], ['open', '', 'true']], {w: 400, p: p1, warna: C.amber, tipe: true, sorotKolom: p2 > 0 ? ['vehicle_id'] : []});
  const T2 = K.tabelERD(c, 680, 290, 'vehicles', [['id', 'pk', '7'], ['plate', '', 'N1234AB'], ['type', '', 'motor']], {w: 400, p: p2, warna: C.sky, tipe: true, sorotKolom: p3 > 0 ? ['plate'] : (p2 > 0 ? ['id'] : [])});
  if (p2 > 0) K.arrow(c, 530, T1.baris('vehicle_id'), 670, T2.baris('id'), C.amber, 5, p2);
  c.restore();
  if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 1020, 830, 600, 120, 20, 'rgba(163,230,53,.12)', C.lime, 4); K.text(c, 'N1234AB', 1320, 892, {size: 52, weight: 900, mono: true, align: 'center', color: C.lime});
    K.text(c, 'Kita tidak menulis query sendiri. Laravel yang mencarinya lewat vehicle_id.', 180, 892, {size: 32, weight: 700, maxW: 780, lh: 1.3}); c.restore(); }
};
})();
