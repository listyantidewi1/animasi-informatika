// B09 Halaman petugas
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b3: JOIN biasa lawan LEFT JOIN
AD.leftJoin = (c, t, D, a) => { K.bg(c); K.judul(c, 'JOIN biasa atau LEFT JOIN?', t, C.violet);
  const t3 = kt(a, 3), left = t >= t3, p = muncul(t, .3);
  const angg = [['Nadia Putri', 2], ['Bima Saputra', 1], ['Sari Wulandari', 0], ['Dodi Kurniawan', 0]];
  c.save(); c.globalAlpha = p; K.text(c, 'Tabel pengguna', 140, 230, {size: 30, weight: 800, color: C.pink}); K.text(c, 'Tabel peminjaman', 720, 230, {size: 30, weight: 800, color: C.violet}); K.text(c, left ? 'Hasil LEFT JOIN' : 'Hasil JOIN biasa', 1300, 230, {size: 30, weight: 900, color: left ? C.lime : C.coral});
  angg.forEach(([n, j], i) => { const y = 270 + i * 110; K.rrect(c, 140, y, 440, 90, 14, '#18213c', C.pink, 3); K.text(c, n, 170, y + 46, {size: 30, weight: 800});
    for (let k = 0; k < j; k++) { K.rrect(c, 720 + k * 210, y + 8, 190, 74, 12, '#18213c', C.violet, 3); K.text(c, 'pinjaman', 815 + k * 210, y + 46, {size: 24, weight: 700, align: 'center'}); K.arrow(c, 590, y + 45, 710, y + 45, C.violet, 4, 1, 12); }
    if (!j) K.text(c, 'belum pernah meminjam', 720, y + 46, {size: 24, weight: 600, color: C.redup});
    const ada = j > 0 || left, q = j > 0 ? muncul(t, 1.2 + i * .3) : (left ? muncul(t, t3 + .4 + i * .2) : 0);
    if (ada && q > 0) { c.save(); c.globalAlpha = p * q; K.rrect(c, 1300, y, 480, 90, 14, j ? '#18213c' : 'rgba(163,230,53,.1)', j ? '#64748b' : C.lime, j ? 3 : 5); K.text(c, n, 1330, y + 46, {size: 28, weight: 800}); K.text(c, String(j), 1740, y + 46, {size: 40, weight: 900, align: 'right', color: j ? C.teks : C.lime}); c.restore(); }
    else if (!left && t >= kt(a, 2)) { c.save(); c.globalAlpha = p * muncul(t, kt(a, 2) + .5); K.rrect(c, 1300, y, 480, 90, 14, null, C.coral, 3); c.setLineDash([10, 10]); K.text(c, 'tidak muncul', 1540, y + 46, {size: 28, weight: 800, align: 'center', color: C.coral}); c.setLineDash([]); c.restore(); } });
  const q = left ? muncul(t, t3 + 1.2) : muncul(t, kt(a, 2) + 1.5); K.text(c, left ? 'LEFT JOIN: semua anggota tetap tampil, yang belum meminjam bernilai 0.' : 'JOIN biasa: hanya anggota yang punya baris peminjaman.', 960, 800, {size: 38, weight: 800, align: 'center', color: left ? C.lime : C.coral, alpha: q});
  c.restore(); };
})();
