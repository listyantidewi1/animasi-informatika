// P07 Rumus tarif
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b7: hasil test untuk rumus dari AI
AD.hasilAI = (c, t, D, a) => { K.bg(c); K.cekAIjudul(c, t);
  const t3 = kt(a, a.k3) < 9e8 ? kt(a, a.k3) : .5, t4 = kt(a, a.k4), t5 = kt(a, a.k5);
  K.text(c, 'php artisan test: 5 gagal, 3 lolos', 140, 190, {size: 34, weight: 800, mono: true, alpha: muncul(t, .3)});
  const baris = [[0, 'contoh dari Bu Ratna: mobil menginap', '20.000', '27.000', 0], [1, 'baru masuk lalu keluar (1 menit)', '2.000', '2.000', 0], [1, '59 menit', '2.000', '2.000', 0], [0, '60 menit pas', '3.000', '2.000', t3 + .6], [0, '65 menit, masih toleransi', '3.000', '2.000', t4 + .3], [1, '66 menit', '3.000', '3.000', 0], [0, '2 jam pas', '4.000', '3.000', 0], [0, 'menginap 24 jam 30 menit', '8.000', '10.000', t4 + 4.2]];
  K.text(c, 'hasil rumus AI', 1260, 262, {size: 24, weight: 700, color: C.redup, align: 'right', alpha: muncul(t, .5)}); K.text(c, 'seharusnya', 1560, 262, {size: 24, weight: 700, color: C.redup, align: 'right', alpha: muncul(t, .5)});
  baris.forEach(([ok, n, h, s, ts], i) => { const p = muncul(t, .5 + i * .18); if (p <= 0) return; const y = 284 + i * 74, w = ok ? C.lime : C.coral, akt = ts && t >= ts && (t < t5); c.save(); c.globalAlpha = p * (t >= t5 ? .5 : 1);
    K.rrect(c, 140, y, 1640, 62, 14, akt ? 'rgba(255,107,107,.16)' : 'rgba(255,255,255,.04)', w, akt ? 5 : 2); K.text(c, ok ? '✓' : '✗', 184, y + 32, {size: 32, weight: 900, color: w, align: 'center'});
    K.text(c, n, 240, y + 32, {size: 28, weight: 700}); K.text(c, 'Rp' + h, 1260, y + 32, {size: 29, weight: 800, mono: true, align: 'right', color: ok ? C.teks : C.coral}); K.text(c, 'Rp' + s, 1560, y + 32, {size: 29, weight: 800, mono: true, align: 'right'});
    if (!ok) K.text(c, 'salah', 1740, y + 32, {size: 26, weight: 900, color: C.coral, align: 'right'}); c.restore(); });
  const p5 = muncul(t, t5); if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, 260, 896, 1400, 104, 22, '#0d1222', C.amber, 4); K.text(c, 'Tanpa test, selisih seribu rupiah ini baru ketahuan setelah ada yang protes.', 960, 949, {size: 32, weight: 800, align: 'center'}); c.restore(); }
};
// b9: dikurangi lima, dibagi enam puluh, dibulatkan ke atas
AD.bulatAtas = (c, t, D, a) => { K.bg(c); K.judul(c, 'ceil: dibulatkan ke atas', t, C.sky, 'Setelah dikurangi kelonggaran lima menit');
  K.kode(c, ['$jam = (int) ceil(($menit - 5) / 60);'], 360, 220, {size: 40, w: 1200});
  const baris = [[65, 60, '1', '1 jam', 'Rp2.000', kt(a, a.k2) < 9e8 ? kt(a, a.k2) : .5, C.lime], [66, 61, '1,02', '2 jam', 'Rp3.000', kt(a, a.k3), C.amber]];
  baris.forEach(([m, s, bagi, jam, rp, t0, w], i) => { const y = 420 + i * 250; const kol = [[`${m} menit`, 'parkir'], [`${m} − 5 = ${s}`, 'dikurangi kelonggaran'], [`${s} ÷ 60 = ${bagi}`, 'dibagi 60'], [jam, 'dibulatkan ke atas'], [rp, 'biaya motor']];
    kol.forEach(([besar, kecil], j) => { const p = muncul(t, t0 + .2 + j * (i ? 1.5 : 1.1)); if (p <= 0) return; const x = 140 + j * 334; c.save(); c.globalAlpha = p; K.rrect(c, x, y + (1 - p) * 16, 304, 180, 20, 'rgba(255,255,255,.05)', j >= 3 ? w : '#475569', j >= 3 ? 5 : 3);
      K.text(c, besar, x + 152, y + 78, {size: j === 0 || j >= 3 ? 44 : 29, weight: 900, align: 'center', mono: j > 0 && j < 3, color: j >= 3 ? w : C.teks}); K.text(c, kecil, x + 152, y + 136, {size: 24, weight: 600, align: 'center', color: C.redup});
      if (j < 4) K.arrow(c, x + 308, y + 90, x + 330, y + 90, '#94a3b8', 4, p); c.restore(); }); });
};
})();
