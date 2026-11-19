// L04 Migration dan SQL
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// Dua cara bertanya: SQL yang kita tulis, dan Eloquent yang dituliskan Laravel
AD.sqlEloquent = (c, t, D, a) => { K.bg(c); K.judul(c, 'Dua cara, data yang sama', t, C.teal);
  const sql = ['SELECT r.title, u.name, c.name AS kategori', 'FROM reports r', 'JOIN users u ON u.id = r.user_id', 'JOIN categories c ON c.id = r.category_id;'];
  const php = ["Report::with(['user', 'category'])->get();"];
  const p1 = muncul(t, .4), p2 = muncul(t, kt(a, a.k2) + .3), p3 = muncul(t, kt(a, a.k3)), p4 = muncul(t, kt(a, a.k4));
  c.save(); c.globalAlpha = p1 * (p2 > 0 && p3 <= 0 ? .45 : 1); K.text(c, 'SQL, di MySQL', 140, 250, {size: 30, weight: 900, color: C.sky}); K.kode(c, sql, 140, 280, {size: 30, w: 1000}); c.restore();
  if (p2 > 0) { c.save(); c.globalAlpha = p2; K.text(c, 'Eloquent, di Laravel', 140, 610, {size: 30, weight: 900, color: C.amber}); K.kode(c, php, 140, 640, {size: 34, w: 1000}); c.restore(); }
  if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 1200, 280, 580, 456, 20, '#fff', '#cbd5e1', 3);
    [['Proyektor mati', 'Lina', 'Ruang kelas'], ['Keran bocor', 'Dimas', 'Toilet'], ['Lampu redup', 'Lina', 'Listrik dan lampu']].forEach((r, i) => { const y = 340 + i * 140;
      K.text(c, r[0], 1236, y, {size: 30, weight: 800, color: '#0f172a'}); K.text(c, r[1] + '  ·  ' + r[2], 1236, y + 44, {size: 24, weight: 600, color: '#64748b'}); if (i < 2) { c.fillStyle = '#e2e8f0'; c.fillRect(1220, y + 84, 540, 2); } });
    K.arrow(c, 1150, 400, 1195, 400, '#94a3b8', 5, p3); K.arrow(c, 1150, 690, 1195, 690, '#94a3b8', 5, p3); c.restore(); }
  if (p4 > 0) { c.save(); c.globalAlpha = p4; K.text(c, 'kita tulis sendiri', 1140, 250, {size: 28, weight: 800, color: C.sky, align: 'right'}); K.text(c, 'dituliskan Laravel', 1140, 610, {size: 28, weight: 800, color: C.amber, align: 'right'});
    K.text(c, 'Paham SQL membuat kita bisa memeriksa apa yang ditulis Laravel.', 960, 900, {size: 34, weight: 800, align: 'center', color: C.lime}); c.restore(); }
};
// LIKE '%11%' cocok dengan angka 11 di mana saja
AD.likeSalah = (c, t, D, a) => { K.bg(c); K.cekAIjudul(c, t);
  K.kode(c, ["WHERE created_at LIKE '%11%'"], 140, 170, {size: 34, w: 1640});
  const rows = [['2026-11-05 09:30:00', [5], 'bulan November', true], ['2026-10-21 11:42:00', [11], 'bulan Oktober, jam 11', false], ['2026-09-11 08:05:00', [8], 'bulan September, tanggal 11', false], ['2026-10-03 14:11:00', [14], 'bulan Oktober, menit ke-11', false]];
  const size = 40; c.font = `600 ${size}px ${K.FM || 'monospace'}`; const cw = K.lebar(c, 'M', size, 600, true);
  rows.forEach((r, i) => { const p = muncul(t, i < 2 ? .5 + i * .5 : kt(a, a.k1) + (i - 2) * 1.6); if (p <= 0) return; const y = 330 + i * 110; c.save(); c.globalAlpha = p;
    K.rrect(c, 140, y, 1640, 92, 16, 'rgba(255,255,255,.05)', r[3] ? C.lime : C.coral, 3); r[1].forEach(k => K.rrect(c, 180 + k * cw - 4, y + 18, 2 * cw + 8, 56, 8, 'rgba(255,176,32,.5)'));
    K.text(c, r[0], 180, y + 48, {size, weight: 600, mono: true}); K.text(c, r[2], 760, y + 48, {size: 30, weight: 700, color: r[3] ? C.lime : C.coral});
    K.text(c, r[3] ? 'benar' : 'ikut terhitung', 1750, y + 48, {size: 28, weight: 900, align: 'right', color: r[3] ? C.lime : C.coral}); c.restore(); });
  const p2 = muncul(t, kt(a, a.k2)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 800, 1640, 150, 18, 'rgba(167,139,250,.1)', C.violet, 4);
    K.text(c, 'Juga lambat', 180, 846, {size: 34, weight: 900, color: C.violet}); K.text(c, 'Tanda % di depan membuat MySQL membaca semua baris satu per satu. Index pada created_at tidak terpakai.', 180, 902, {size: 27, weight: 600, maxW: 1560}); c.restore(); }
};
})();
