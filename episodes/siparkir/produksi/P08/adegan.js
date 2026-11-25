// P08 Kendaraan masuk dan keluar
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b4: dua petugas, satu tempat terakhir; baris area dikunci
AD.kunci = (c, t, D, a) => { K.bg(c); K.judul(c, 'lockForUpdate: satu per satu', t, C.amber, 'Dua petugas menekan tombol pada detik yang sama, untuk tempat terakhir');
  const t0 = kt(a, a.k) < 9e8 ? kt(a, a.k) : .5, p0 = muncul(t, t0 + .2), p1 = muncul(t, t0 + 2.6), p2 = muncul(t, t0 + 5.0), p3 = muncul(t, t0 + 7.4);
  K.tokoh(c, 'joko', 260, 480, 240, p0); K.tokoh(c, 'agus', 260, 860, 240, p0);
  c.save(); c.globalAlpha = p0; K.rrect(c, 860, 250, 420, 190, 22, 'rgba(255,176,32,.10)', C.amber, 5); K.text(c, 'Area Motor', 1070, 306, {size: 34, weight: 900, align: 'center', color: C.amber}); K.text(c, p3 > 0 ? '40 dari 40 tempat' : '39 dari 40 tempat', 1070, 362, {size: 28, weight: 700, align: 'center', mono: true});
  K.text(c, p1 > 0 ? 'terkunci' : '', 1070, 408, {size: 24, weight: 800, align: 'center', color: C.coral}); c.restore();
  // Pak Joko dapat kunci
  K.arrow(c, 420, 400, 850, 350, C.lime, 6, p1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 1380, 300, 400, 100, 20, 'rgba(163,230,53,.12)', C.lime, 4); K.text(c, 'Tiket dibuat', 1580, 350, {size: 32, weight: 900, align: 'center', color: C.lime}); c.restore(); }
  // Mas Agus menunggu, lalu ditolak
  if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 520, 720, 300, 90, 45, 'rgba(255,255,255,.06)', '#64748b', 3); K.text(c, 'menunggu …', 670, 766, {size: 30, weight: 800, align: 'center'}); c.restore(); }
  K.arrow(c, 830, 760, 1060, 460, C.coral, 6, p3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 1180, 700, 600, 130, 20, 'rgba(255,107,107,.14)', C.coral, 5); K.text(c, 'Area motor sudah penuh.', 1480, 766, {size: 36, weight: 900, align: 'center', color: C.coral}); c.restore(); }
};
// b12: race condition pada "periksa dulu, lalu simpan"
AD.balapan = (c, t, D, a) => { K.bg(c); K.cekAIjudul(c, t);
  const t1 = kt(a, a.k1) < 9e8 ? kt(a, a.k1) : 3, t2 = kt(a, a.k2), t3 = kt(a, a.k3);
  K.text(c, 'Dua permintaan datang hampir bersamaan', 140, 200, {size: 36, weight: 900, alpha: muncul(t, .4)});
  const jalur = [['Pak Joko', 'joko', 330, C.sky], ['Mas Agus', 'agus', 600, C.violet]];
  jalur.forEach(([n, id, y, w], i) => { const p = muncul(t, .8 + i * .5); if (p <= 0) return; c.save(); c.globalAlpha = p * (t >= t3 ? .35 : 1); K.tokoh(c, id, 230, y + 190, 200, 1, {tanpaNama: 1}); K.text(c, n, 230, y + 222, {size: 26, weight: 800, align: 'center'});
    const langkah = [['periksa', 'N1234AB sudah di dalam?', t1 + .2 + i * .8], ['jawaban', 'belum ada', t1 + 2.2 + i * .8], ['simpan', 'baris baru dibuat', t1 + 4.6 + i * .8]];
    langkah.forEach(([j, s, ts], k) => { const q = muncul(t, ts); if (q <= 0) return; const x = 400 + k * 420; c.save(); c.globalAlpha *= q; K.rrect(c, x, y + 20, 380, 150, 20, 'rgba(255,255,255,.05)', k === 2 ? C.coral : w, 4);
      K.text(c, j, x + 30, y + 68, {size: 32, weight: 900, color: k === 2 ? C.coral : w}); K.text(c, s, x + 30, y + 122, {size: 26, weight: 600, maxW: 330}); if (k < 2) K.arrow(c, x + 386, y + 95, x + 414, y + 95, '#94a3b8', 4, q); c.restore(); });
    c.restore(); });
  const pH = muncul(t, t1 + 6.4); if (pH > 0 && t < t3) { c.save(); c.globalAlpha = pH; K.rrect(c, 1640, 350, 160, 400, 20, 'rgba(255,107,107,.14)', C.coral, 5); K.text(c, '2', 1720, 500, {size: 110, weight: 900, align: 'center', color: C.coral}); K.text(c, 'baris', 1720, 590, {size: 28, weight: 800, align: 'center'}); K.text(c, 'N1234AB', 1720, 640, {size: 24, weight: 700, align: 'center', mono: true}); c.restore(); }
  const p2 = muncul(t, t2); if (p2 > 0 && t < t3) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 860, 1640, 130, 22, '#0d1222', C.coral, 4); K.text(c, 'Race condition', 180, 906, {size: 34, weight: 900, color: C.coral}); K.text(c, 'Celah antara memeriksa dan menyimpan. Tidak pernah muncul saat kamu mencoba sendirian.', 180, 954, {size: 27, weight: 600}); c.restore(); }
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 260, 400, 1400, 330, 26, '#0d1222', C.lime, 5); K.text(c, 'Kode kita punya dua lapis', 960, 462, {size: 38, weight: 900, align: 'center', color: C.lime});
    K.nomor(c, 1, 340, 560, C.amber); K.text(c, 'Pemeriksaan di dalam transaction yang terkunci', 400, 560, {size: 32, weight: 700}); K.nomor(c, 2, 340, 650, C.sky); K.text(c, 'Aturan unik di database, sebagai penjaga terakhir', 400, 650, {size: 32, weight: 700}); c.restore(); }
};
})();
