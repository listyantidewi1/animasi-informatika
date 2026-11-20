// P10 Rekap pendapatan
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const garis = (c, x0, x1, y, hari, p) => { c.save(); c.globalAlpha *= p; c.strokeStyle = '#64748b'; c.lineWidth = 5; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
  hari.forEach(([f, s, tebal]) => { const x = x0 + (x1 - x0) * f; c.strokeStyle = tebal ? C.teks : '#64748b'; c.lineWidth = tebal ? 5 : 3; c.beginPath(); c.moveTo(x, y - (tebal ? 26 : 14)); c.lineTo(x, y + (tebal ? 26 : 14)); c.stroke(); K.text(c, s, x, y + 62, {size: 24, weight: 700, align: 'center', color: tebal ? C.teks : C.redup}); }); c.restore(); };
// b3: batas bawah ikut, batas atas tidak
AD.rentang = (c, t, D, a) => { K.bg(c); K.judul(c, 'Batas bawah ikut, batas atas tidak', t, C.teal, 'Rekap 1 sampai 31 Oktober');
  const t4 = kt(a, a.k4) < 9e8 ? kt(a, a.k4) : .5, t5 = kt(a, a.k5), x0 = 200, x1 = 1720, y = 560, X = f => x0 + (x1 - x0) * f;
  garis(c, x0, x1, y, [[.1, '1 Okt 00.00', 1], [.3, '2 Okt'], [.56, '30 Okt'], [.72, '31 Okt 00.00'], [.9, '1 Nov 00.00', 1]], muncul(t, .3));
  const p = muncul(t, t4 + .3); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, X(.1), y - 110, (X(.9) - X(.1)) * p, 80, 12, 'rgba(45,212,191,.22)', C.teal, 3);
    c.fillStyle = C.teal; c.beginPath(); c.arc(X(.1), y - 70, 18, 0, 7); c.fill(); K.text(c, '>= ikut', X(.1), y - 150, {size: 30, weight: 900, align: 'center', color: C.teal});
    c.strokeStyle = C.teal; c.lineWidth = 6; c.fillStyle = '#141a2c'; c.beginPath(); c.arc(X(.9), y - 70, 18, 0, 7); c.fill(); c.stroke(); K.text(c, '< tidak ikut', X(.9), y - 150, {size: 30, weight: 900, align: 'center', color: C.teal}); c.restore(); }
  const q = muncul(t, t5); if (q > 0) { c.save(); c.globalAlpha = q; const x = X(.84); c.fillStyle = C.amber; c.beginPath(); c.arc(x, y - 70, 14, 0, 7); c.fill(); K.arrow(c, x, y + 180, x, y - 44, C.amber, 5, q);
    K.rrect(c, x - 330, y + 190, 520, 130, 20, '#0d1222', C.amber, 4); K.text(c, 'Keluar 31 Oktober pukul 23.10', x - 70, y + 234, {size: 30, weight: 900, align: 'center', color: C.amber}); K.text(c, 'tetap terhitung', x - 70, y + 282, {size: 28, weight: 700, align: 'center'}); c.restore(); }
};
// b5: masalah N + 1
AD.nPlusSatu = (c, t, D, a) => { K.bg(c); K.judul(c, 'Masalah N + 1', t, C.coral, 'Dua puluh baris, masing-masing butuh plat dan nama area');
  const t3 = kt(a, a.k3) < 9e8 ? kt(a, a.k3) : .5, t4 = kt(a, a.k4);
  const kol = (x, judul, w, n, t0, ket, lama) => { const p = muncul(t, t0); if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, x, 230, 760, 720, 24, 'rgba(255,255,255,.04)', w, 4); K.text(c, judul, x + 40, 286, {size: 34, weight: 900, color: w});
    K.rrect(c, x + 40, 330, 680, 50, 10, 'rgba(255,255,255,.08)', '#64748b', 2); K.text(c, 'SELECT * FROM parkings ... LIMIT 20', x + 60, 356, {size: 22, weight: 600, mono: true});
    const tampil = Math.min(n, Math.floor((t - t0 - .5) / lama * n)); for (let i = 0; i < Math.max(0, tampil); i++) { const besar = n <= 2, yy = besar ? 400 + i * 70 : 396 + Math.floor(i / 2) * 24, xx = besar ? x + 40 : x + 40 + (i % 2) * 345;
      K.rrect(c, xx, yy, besar ? 680 : 335, besar ? 50 : 19, besar ? 10 : 5, besar ? 'rgba(163,230,53,.12)' : 'rgba(255,107,107,.25)', w, besar ? 2 : 1); if (besar) K.text(c, i ? 'SELECT * FROM areas WHERE id IN (...)' : 'SELECT * FROM vehicles WHERE id IN (...)', xx + 20, yy + 26, {size: 22, weight: 600, mono: true}); }
    K.text(c, ket, x + 380, 900, {size: 40, weight: 900, align: 'center', color: w}); c.restore(); };
  kol(140, 'Tanpa with', C.coral, 40, t3, '1 + 40 query', 4.5); kol(1020, "Dengan with('vehicle', 'area')", C.lime, 2, t4, '1 + 2 query', 1.6);
};
// b10: '2026-10-31' dibaca sebagai pukul 00.00
AD.tengahMalam = (c, t, D, a) => { K.bg(c); K.cekAIjudul(c, t);
  const t4 = kt(a, a.k4) < 9e8 ? kt(a, a.k4) : .5, t5 = kt(a, a.k5), t6 = kt(a, a.k6), t7 = kt(a, a.k7), x0 = 200, x1 = 1720, y = 600, X = f => x0 + (x1 - x0) * f;
  K.kode(c, ["WHERE exited_at BETWEEN '2026-10-01' AND '2026-10-31'"], 300, 170, {size: 34, w: 1320});
  const p4 = muncul(t, t4 + .3); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.text(c, "'2026-10-31'  =  '2026-10-31 00:00:00'", 960, 330, {size: 40, weight: 900, mono: true, align: 'center', color: C.amber}); c.restore(); }
  garis(c, x0, x1, y, [[.1, '1 Okt 00.00', 1], [.4, '15 Okt'], [.74, '31 Okt 00.00', 1], [.9, '1 Nov 00.00']], muncul(t, .5));
  const pb = muncul(t, t4 + 1.5); if (pb > 0) { c.save(); c.globalAlpha = pb; K.rrect(c, X(.1), y - 100, (X(.74) - X(.1)) * pb, 70, 12, 'rgba(56,189,248,.2)', C.sky, 3); K.text(c, 'yang dihitung BETWEEN', (X(.1) + X(.74)) / 2, y - 64, {size: 26, weight: 800, align: 'center', color: C.sky}); c.restore(); }
  const p5 = muncul(t, t5); if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, X(.74), y - 100, X(.9) - X(.74), 70, 12, 'rgba(255,107,107,.25)', C.coral, 4); K.text(c, 'hilang', (X(.74) + X(.9)) / 2, y - 64, {size: 28, weight: 900, align: 'center', color: C.coral});
    K.rrect(c, X(.74) - 140, y + 110, 560, 150, 20, '#0d1222', C.coral, 4); K.text(c, 'Seluruh tanggal 31', X(.74) + 140, y + 156, {size: 30, weight: 800, align: 'center'}); K.text(c, '30 kendaraan · Rp177.000', X(.74) + 140, y + 212, {size: 36, weight: 900, align: 'center', color: C.coral, mono: true}); c.restore(); }
  const p6 = muncul(t, t6); if (p6 > 0) { c.save(); c.globalAlpha = p6; K.rrect(c, 200, 880, 900, 110, 20, '#0d1222', C.amber, 4); K.text(c, p6 > 0 && t >= t7 ? 'Yang salah adalah maknanya.' : 'Tidak ada error. Query-nya sah.', 650, 936, {size: 36, weight: 900, align: 'center', color: t >= t7 ? C.amber : C.teks}); c.restore(); }
};
})();
