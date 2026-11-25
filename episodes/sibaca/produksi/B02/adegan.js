// B02 Kebutuhan: seluruh bab digambar
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const hpKecil = (c, x, y, s, warna = '#94a3b8') => { K.rrect(c, x - 34 * s, y - 62 * s, 68 * s, 124 * s, 12 * s, '#0b1020', warna, 4); K.rrect(c, x - 26 * s, y - 50 * s, 52 * s, 92 * s, 4 * s, '#0f766e'); c.fillStyle = '#e2e8f0'; c.fillRect(x - 20 * s, y - 28 * s, 40 * s, 8 * s); c.fillRect(x - 20 * s, y - 10 * s, 40 * s, 8 * s); c.fillRect(x - 20 * s, y + 8 * s, 28 * s, 8 * s); };
// b3: perpustakaan tanpa internet -> laptop menjadi server, router kecil tanpa internet
AD.tanpaInternet = (c, t, D, a) => { K.bg(c); K.judul(c, 'Satu hal yang mengubah seluruh rancangan', t, C.coral);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6);
  const A = t < t4 ? 1 : 1 - muncul(t, t4 - .3, .4);
  if (A > 0) { c.save(); c.globalAlpha = A;
    // gedung utama dan gedung belakang
    const p1 = muncul(t, t1 - .3); c.globalAlpha = A * p1;
    K.rrect(c, 180, 420, 520, 330, 16, 'rgba(255,255,255,.05)', '#64748b', 4); K.text(c, 'Gedung utama', 440, 470, {size: 30, weight: 800, align: 'center'}); K.wifi(c, 440, 600, 150, C.lime); K.text(c, 'WiFi sekolah', 440, 700, {size: 26, weight: 600, align: 'center', color: C.redup});
    K.rrect(c, 1180, 420, 560, 330, 16, 'rgba(255,107,107,.06)', C.coral, 5); K.text(c, 'Perpustakaan', 1460, 470, {size: 34, weight: 900, align: 'center', color: C.coral}); K.text(c, 'gedung belakang', 1460, 512, {size: 24, weight: 600, align: 'center', color: C.redup});
    c.strokeStyle = '#475569'; c.lineWidth = 4; c.setLineDash([14, 14]); c.beginPath(); c.moveTo(720, 585); c.lineTo(1160, 585); c.stroke(); c.setLineDash([]); K.text(c, 'terlalu jauh', 940, 550, {size: 26, weight: 700, align: 'center', color: C.redup});
    const p2 = muncul(t, t2); if (p2 > 0) { c.globalAlpha = A * p2; K.wifi(c, 1360, 630, 130, '#e2e8f0', true); K.text(c, 'WiFi tidak sampai', 1360, 716, {size: 24, weight: 700, align: 'center', color: C.coral});
      [0, 1, 2, 3].forEach(i => { c.fillStyle = i === 0 ? C.coral : '#334155'; c.fillRect(1540 + i * 26, 660 - i * 22, 18, 20 + i * 22); }); K.text(c, 'sinyal HP lemah', 1580, 716, {size: 24, weight: 700, align: 'center', color: C.coral}); }
    const p3 = muncul(t, t3); if (p3 > 0) { c.globalAlpha = A * p3; K.rrect(c, 360, 820, 1200, 130, 26, 'rgba(255,176,32,.12)', C.amber, 5); K.text(c, 'Aplikasi harus berjalan tanpa internet', 960, 886, {size: 52, weight: 900, align: 'center', color: C.amber}); }
    c.restore(); }
  const B = muncul(t, t4); if (B <= 0) return; c.save(); c.globalAlpha = B;
  K.laptop(c, 420, 560, 1.5); K.text(c, 'Laptop Bu Ratih', 420, 740, {size: 34, weight: 900, align: 'center'}); K.text(c, 'menjadi server', 420, 786, {size: 28, weight: 700, align: 'center', color: C.lime});
  const p5 = muncul(t, t5); if (p5 > 0) { c.globalAlpha = B * p5; K.rrect(c, 850, 520, 220, 90, 18, '#1e293b', C.sky, 5); [0, 1, 2].forEach(i => { c.fillStyle = C.lime; c.beginPath(); c.arc(900 + i * 34, 565, 8, 0, 7); c.fill(); }); c.strokeStyle = C.sky; c.lineWidth = 6; [880, 1040].forEach(x => { c.beginPath(); c.moveTo(x, 520); c.lineTo(x - 14 * Math.sign(960 - x), 440); c.stroke(); });
    K.text(c, 'Router WiFi kecil', 960, 660, {size: 30, weight: 900, align: 'center'}); K.pilTanpaInternet(c, 960 - 172, 700, p5, .8);
    K.arrow(c, 650, 565, 835, 565, C.sky, 6, p5); [0, 1, 2].forEach(i => { const y = 380 + i * 190; K.arrow(c, 1085, 565, 1330, y, C.sky, 5, muncul(t, t5 + 1.2 + i * .4)); const q = muncul(t, t5 + 1.2 + i * .4); if (q > 0) { c.globalAlpha = B * q; hpKecil(c, 1400, y, 1.05); K.text(c, ['HP Nadia', 'HP Raka', 'HP Bima'][i], 1470, y, {size: 28, weight: 800}); } }); }
  const p6 = muncul(t, t6); if (p6 > 0) { c.globalAlpha = B * p6; K.rrect(c, 360, 880, 1200, 110, 22, 'rgba(163,230,53,.08)', C.lime, 4); K.text(c, 'Cukup browser di HP, tanpa memasang aplikasi', 960, 936, {size: 40, weight: 800, align: 'center'}); }
  c.restore(); };
// b5: dua peran
AD.duaPeran = (c, t, D, a) => { K.bg(c); K.judul(c, 'Dua peran', t, C.violet);
  const kol = [['nadia', 'Anggota', 'siswa', C.pink, kt(a, 1), ['Mencari buku', 'Meminjam buku', 'Melihat pinjamannya sendiri']], ['ratih', 'Petugas', 'Bu Ratih', C.teal, kt(a, 2), ['Melihat semua peminjaman', 'Mencatat pengembalian', 'Menyetujui anggota', 'Menambah buku']]];
  kol.forEach(([tk, n, sub, w, t0, isi], k) => { const p = muncul(t, Math.min(t0, .5 + k * .6)); if (p <= 0) return; const x = 150 + k * 840; c.save(); c.globalAlpha = p; K.rrect(c, x, 230, 780, 640, 26, 'rgba(255,255,255,.04)', w, 4);
    K.tokoh(c, tk, x + 150, 640, 330, 1, {tanpaNama: true}); K.text(c, n, x + 150, 700, {size: 44, weight: 900, align: 'center', color: w}); K.text(c, sub, x + 150, 748, {size: 26, weight: 600, align: 'center', color: C.redup});
    isi.forEach((s, i) => { const q = muncul(t, t0 + .8 + i * 1.0); if (q <= 0) return; const y = 320 + i * 118; const tebal = k === 1 && i === 1 && t >= kt(a, 3); c.globalAlpha = p * q; K.rrect(c, x + 310, y - 44, 440, 92, 16, tebal ? 'rgba(255,176,32,.16)' : 'rgba(255,255,255,.05)', tebal ? C.amber : '#3b4a75', tebal ? 5 : 2); K.text(c, s, x + 334, y + 2, {size: 28, weight: 800, maxW: 400, lh: 1.15}); }); c.restore(); });
  const p3 = muncul(t, kt(a, 3)); if (p3 > 0) K.text(c, 'Pengembalian dicatat petugas: bukunya harus benar-benar sampai di meja Bu Ratih', 960, 940, {size: 32, weight: 800, align: 'center', color: C.amber, alpha: p3}); };
// b8: yang tidak ditanyakan AI
AD.tidakDitanya = (c, t, D, a) => { K.bg(c); K.cekAIjudul(c, t);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  const A = t < t4 ? 1 : 1 - muncul(t, t4 - .3, .4);
  if (A > 0) { c.save(); c.globalAlpha = A * muncul(t, .3);
    K.text(c, 'Tabel buatan AI', 140, 210, {size: 30, weight: 800, color: C.pink}); K.rrect(c, 140, 240, 720, 190, 18, '#0b1020', C.pink, 3); ['judul', 'penulis', 'stok'].forEach((s, i) => K.text(c, s, 180 + i * 240, 290, {size: 26, weight: 800, color: C.redup, mono: true}));
    K.text(c, 'Laskar Pelangi', 180, 360, {size: 26, weight: 700}); K.text(c, 'A. Hirata', 420, 360, {size: 26, weight: 700}); K.text(c, '3', 660, 360, {size: 44, weight: 900, color: C.pink});
    const p1 = muncul(t, t1); if (p1 > 0) { c.globalAlpha = A * p1; K.text(c, 'Rak Bu Ratih', 1000, 210, {size: 30, weight: 800, color: C.lime});
      [0, 1, 2].forEach(i => { const x = 1000 + i * 260, hilang = i === 1 && t >= t2; K.rrect(c, x, 240, 220, 300, 12, hilang ? 'rgba(255,107,107,.1)' : '#134e4a', hilang ? C.coral : C.teal, 5); K.text(c, 'Laskar', x + 110, 330, {size: 30, weight: 900, align: 'center'}); K.text(c, 'Pelangi', x + 110, 370, {size: 30, weight: 900, align: 'center'});
        K.rrect(c, x + 30, 440, 160, 60, 8, '#fff'); K.text(c, 'B0001-' + (i + 1), x + 110, 471, {size: 26, weight: 900, align: 'center', color: '#0f172a', mono: true}); if (hilang) K.text(c, 'hilang?', x + 110, 580, {size: 30, weight: 900, align: 'center', color: C.coral, alpha: muncul(t, t2)}); }); }
    const p2 = muncul(t, t2 + 1.5); if (p2 > 0) { c.globalAlpha = A * p2; K.rrect(c, 140, 660, 1640, 110, 20, 'rgba(255,255,255,.05)', C.amber, 4); K.text(c, 'Eksemplar yang mana? Siapa peminjam terakhirnya?', 960, 716, {size: 40, weight: 800, align: 'center'}); }
    const p3 = muncul(t, t3); if (p3 > 0) { c.globalAlpha = A * p3; K.text(c, 'Angka stok tidak bisa menjawabnya.', 960, 860, {size: 44, weight: 900, align: 'center', color: C.coral}); }
    c.restore(); }
  const B = muncul(t, t4); if (B <= 0) return; c.save(); c.globalAlpha = B; K.text(c, 'Yang juga tidak diketahui AI', 140, 220, {size: 36, weight: 900, color: C.pink});
  ['Perpustakaannya tanpa internet', 'Pendaftar harus disetujui petugas', 'Yang terlambat tidak boleh meminjam'].forEach((s, i) => { const q = muncul(t, t4 + .8 + i * 1.5); if (q <= 0) return; c.globalAlpha = B * q; const y = 290 + i * 150; K.rrect(c, 140, y, 1640, 120, 20, 'rgba(255,255,255,.05)', [C.coral, C.amber, C.violet][i], 4); K.nomor(c, i + 1, 210, y + 60, [C.coral, C.amber, C.violet][i]); K.text(c, s, 290, y + 62, {size: 40, weight: 800}); });
  const p5 = muncul(t, t5); if (p5 > 0) { c.globalAlpha = B * p5; K.rrect(c, 140, 780, 1640, 150, 24, 'rgba(163,230,53,.1)', C.lime, 5); K.text(c, 'Semua itu hanya kita dapat karena bertanya.', 960, 856, {size: 50, weight: 900, align: 'center', color: C.lime}); }
  c.restore(); };
})();
