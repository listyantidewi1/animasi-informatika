// L07 Halaman petugas
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// N+1 query: tanpa with vs dengan with
AD.nPlus1 = (c, t, D, a) => { K.bg(c); K.judul(c, 'Berapa kali bertanya ke database?', t, C.amber);
  const t1 = kt(a, a.k1), t2 = kt(a, a.k2);
  const kol = (x, judul, warna, baris, total, t0, jeda) => { const p = muncul(t, t0); if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, x, 230, 780, 640, 20, 'rgba(255,255,255,.05)', warna, 4); K.text(c, judul, x + 36, 284, {size: 32, weight: 900, color: warna});
    baris.forEach(([s, n], i) => { const q = muncul(t, t0 + .6 + i * jeda); if (q <= 0) return; c.globalAlpha = p * q; K.text(c, s, x + 40, 370 + i * 100, {size: 25, weight: 600, mono: true, maxW: 640}); K.text(c, n, x + 740, 370 + i * 100, {size: 40, weight: 900, align: 'right', color: warna}); });
    const q = muncul(t, t0 + .6 + baris.length * jeda); c.globalAlpha = p * q; c.fillStyle = warna; c.fillRect(x + 36, 690, 708, 4); K.text(c, total, x + 740, 770, {size: 64, weight: 900, align: 'right', color: warna}); K.text(c, 'query', x + 40, 770, {size: 34, weight: 700}); c.restore(); };
  kol(140, 'Tanpa with', C.coral, [['SELECT * FROM reports LIMIT 10', '1'], ['SELECT * FROM users WHERE id = ?', '× 10'], ['SELECT * FROM categories WHERE id = ?', '× 10']], '21', t1, 1.8);
  kol(1000, 'Dengan with', C.lime, [['SELECT * FROM reports LIMIT 10', '1'], ['SELECT * FROM users WHERE id IN (…)', '1'], ['SELECT * FROM categories WHERE id IN (…)', '1']], '3', t2, .9);
};
// Paginate
AD.halaman = (c, t, D, a) => { K.bg(c); K.judul(c, 'paginate(10)', t, C.sky, 'Ambil secukupnya, bukan semuanya');
  const t1 = kt(a, 1), t3 = kt(a, 3), p0 = muncul(t, .5), n = Math.floor(Math.max(0, Math.min(1, (t - t1) / 5)) * 120);
  c.save(); c.globalAlpha = p0 * (t > t3 ? .25 : 1); K.text(c, 'Semua laporan di satu halaman', 140, 260, {size: 30, weight: 800, color: C.coral});
  for (let i = 0; i < 20 + n; i++) { const x = 140 + (i % 20) * 41, y = 290 + Math.floor(i / 20) * 34; K.rrect(c, x, y, 36, 28, 5, i < 20 ? '#e2e8f0' : '#fca5a5'); } c.restore();
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, 'Dengan paginate', 1100, 260, {size: 30, weight: 800, color: C.lime}); for (let i = 0; i < 10; i++) K.rrect(c, 1100, 290 + i * 46, 560, 38, 6, '#e2e8f0');
    K.rrect(c, 1100, 770, 560, 60, 10, 'rgba(255,255,255,.06)', C.lime, 3); K.text(c, '← Sebelumnya     Halaman 1 dari 5     Berikutnya →', 1380, 801, {size: 22, weight: 700, align: 'center'}); c.restore(); }
};
// Pilihan di form bukan pengaman
AD.bukanPengaman = (c, t, D, a) => { K.bg(c); K.judul(c, 'Pilihan di form bukan pengaman', t, C.coral);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), p0 = muncul(t, .5);
  c.save(); c.globalAlpha = p0; K.rrect(c, 140, 250, 620, 300, 20, '#fff', '#cbd5e1', 3); K.text(c, 'Form di halaman', 176, 300, {size: 28, weight: 900, color: '#0f172a'}); K.rrect(c, 176, 340, 548, 70, 10, '#f1f5f9', '#94a3b8', 2); K.text(c, 'Tetap selesai', 200, 376, {size: 28, weight: 600, color: '#334155'});
  K.text(c, 'Tidak ada pilihan lain', 176, 470, {size: 26, weight: 600, color: '#64748b'}); c.restore();
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.text(c, 'Request yang dikirim sendiri (DevTools)', 900, 270, {size: 28, weight: 900, color: C.amber}); K.kode(c, ["POST /kelola/49/tanggapan", "", "status=baru", "note=iseng"], 900, 300, {size: 30, w: 880}); c.restore(); }
  const p2 = muncul(t, t2 + 2.5); K.arrow(c, 1340, 580, 1340, 660, C.amber, 7, p2);
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 140, 680, 1640, 120, 18, '#fee2e2', '#ef4444', 4); K.text(c, 'Laporan berstatus selesai tidak bisa diubah menjadi baru.', 190, 742, {size: 36, weight: 800, color: '#991b1b'}); c.restore(); }
  K.text(c, 'Pengaman yang sesungguhnya selalu ada di server.', 960, 900, {size: 38, weight: 900, align: 'center', color: C.lime, alpha: muncul(t, t4)});
};
})();
