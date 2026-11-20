// B08 Pinjam dan kembali
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b2: balapan dua permintaan, lalu transaksi dengan kunci
AD.balapan = (c, t, D, a) => { K.bg(c);
  const T = i => kt(a, i), A = t < T(6) ? 1 : 1 - muncul(t, T(6) - .3, .4);
  const buku = (x, y, warna, teks, p = 1) => { c.save(); c.globalAlpha *= p; K.rrect(c, x - 90, y - 120, 180, 240, 12, '#134e4a', warna, 5); K.text(c, 'Hujan', x, y - 40, {size: 34, weight: 900, align: 'center'}); K.rrect(c, x - 70, y + 30, 140, 50, 8, '#fff'); K.text(c, 'B0007-2', x, y + 56, {size: 22, weight: 900, align: 'center', color: '#0f172a', mono: true}); if (teks) K.text(c, teks, x, y + 160, {size: 26, weight: 800, align: 'center', color: warna}); c.restore(); };
  const lajur = (y, siapa, warna) => { K.tokoh(c, siapa, 230, y + 90, 200, 1, {tanpaNama: true}); K.text(c, siapa === 'nadia' ? 'Nadia' : 'Raka', 230, y + 130, {size: 30, weight: 900, align: 'center', color: warna}); c.strokeStyle = '#334155'; c.lineWidth = 3; c.beginPath(); c.moveTo(360, y); c.lineTo(1500, y); c.stroke(); };
  const langkah = (x, y, teks, warna, p, w = 300) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, x, y - 44 + (1 - p) * 16, w, 88, 16, '#18213c', warna, 4); K.text(c, teks, x + w / 2, y + (1 - p) * 16, {size: 26, weight: 800, align: 'center', maxW: w - 30, lh: 1.15}); c.restore(); };
  if (A > 0) { c.save(); c.globalAlpha = A; K.judul(c, 'Dua orang, satu eksemplar terakhir', t, C.coral);
    buku(1700, 520, t >= T(4) ? C.coral : C.teal, t >= T(4) ? 'dipinjam dua orang?' : 'tinggal 1', muncul(t, .5));
    c.globalAlpha = A * muncul(t, T(1) - .3); lajur(330, 'nadia', C.pink); lajur(700, 'raka', C.sky);
    c.globalAlpha = A; langkah(400, 330, 'tekan Pinjam', C.pink, muncul(t, T(1))); langkah(400, 700, 'tekan Pinjam', C.sky, muncul(t, T(1) + .3));
    langkah(740, 330, 'periksa: tersedia ✓', C.lime, muncul(t, T(2) + .8)); langkah(900, 700, 'periksa: tersedia ✓', C.lime, muncul(t, T(3) + 2.2));
    langkah(1160, 330, 'catat pinjaman', C.amber, muncul(t, T(4))); langkah(1240, 700, 'catat pinjaman', C.amber, muncul(t, T(4) + 1.0), 260);
    const p5 = muncul(t, T(5)); if (p5 > 0) { c.globalAlpha = A * p5; K.rrect(c, 360, 880, 1200, 120, 24, 'rgba(255,107,107,.14)', C.coral, 6); K.text(c, 'race condition', 960, 942, {size: 60, weight: 900, align: 'center', color: C.coral}); }
    c.restore(); }
  const B = muncul(t, T(6)); if (B <= 0) return; c.save(); c.globalAlpha = B; K.judul(c, 'Obatnya: transaksi dengan kunci', 9, C.lime);
  buku(1700, 520, C.teal, t >= T(7) + 4.2 ? 'dipinjam Nadia' : 'terkunci', 1); lajur(330, 'nadia', C.pink); lajur(700, 'raka', C.sky);
  langkah(400, 330, 'kunci barisnya', C.amber, muncul(t, T(6) + .8), 260); langkah(690, 330, 'periksa ✓', C.lime, muncul(t, T(7)), 220); langkah(940, 330, 'catat', C.amber, muncul(t, T(7) + 1.0), 180); langkah(1150, 330, 'commit', C.lime, muncul(t, T(7) + 2.0), 180);
  const pt = muncul(t, T(7) + .6); if (pt > 0) { c.globalAlpha = B * pt; K.rrect(c, 400, 656, 720, 88, 16, 'rgba(255,255,255,.04)', '#64748b', 3); c.setLineDash([12, 10]); K.text(c, 'menunggu ...', 760, 700, {size: 28, weight: 800, align: 'center', color: C.redup}); c.setLineDash([]); }
  langkah(1150, 700, 'periksa: sudah tidak tersedia', C.coral, B * muncul(t, T(7) + 3.4), 360);
  c.globalAlpha = B * muncul(t, T(7) + 1.5); K.text(c, 'Yang datang lebih dulu mengunci. Yang lain menunggu sampai ia selesai.', 960, 940, {size: 36, weight: 800, align: 'center', color: C.lime});
  c.restore(); };
})();
