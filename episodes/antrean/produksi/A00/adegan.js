// A00 Pembuka
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
// b2: satu kalimat ke AI, kode muncul cepat, lalu pertanyaan
AD.chatAI = (c, t, D) => {
  K.bg(c);
  // jendela chat
  K.rrect(c, 140, 120, 1000, 840, 26, '#0f1528', C.garis, 3);
  K.text(c, 'Asisten AI', 190, 172, {size: 28, weight: 800, color: C.redup});
  const p1 = O(S(t, .3, .9)); c.save(); c.globalAlpha = p1;
  K.rrect(c, 420, 220, 680, 120, 26, C.sky); K.text(c, 'Buatkan aplikasi antrean untuk bengkel, pakai Node.js dan PostgreSQL.', 450, 262, {size: 28, weight: 600, color: '#0e1424', maxW: 620, lh: 1.3}); c.restore();
  const kode = ["const express = require('express');", "const { Pool } = require('pg');", 'const app = express();', '', "app.post('/api/tiket', async (req, res) => {", "  const r = await pool.query('SELECT MAX(nomor) ...');", '  const nomor = r.rows[0].terakhir + 1;', "  await pool.query('INSERT INTO tiket ...');", '  res.json({ nomor });', '});', '', 'app.listen(3000);'];
  const n = kode.join('\n').length, ch = Math.floor(n * S(t, 1.4, D * .55));
  if (t > 1.2) K.kode(c, kode, 190, 380, {size: 24, chars: ch, w: 900});
  // centang "berjalan"
  const p2 = O(S(t, D * .55, D * .55 + .5)); if (p2 > 0) { K.rrect(c, 1200, 380, 560, 110, 24, 'rgba(163,230,53,.12)', C.lime, 3);
    K.centang(c, 1260, 435, 60, p2); K.text(c, 'Server jalan. Selesai!', 1310, 435, {size: 34, weight: 800, color: C.lime, alpha: p2}); }
  const p3 = O(S(t, D * .72, D * .72 + .6)); if (p3 > 0) { c.save(); c.globalAlpha = p3;
    K.text(c, 'Lalu, kenapa', 1200, 640, {size: 62, weight: 900}); K.text(c, 'masih membangun', 1200, 720, {size: 62, weight: 900});
    K.text(c, 'sendiri?', 1200, 800, {size: 62, weight: 900, color: C.amber}); c.restore(); }
};
// b3 akhir: dua pelanggan dengan tiket yang sama
AD.duaTujuh = (c, t, D) => {
  K.bg(c); K.judul(c, 'Di bengkel sungguhan', t, C.coral);
  K.rrect(c, 1180, 300, 520, 560, 18, '#1c2747', '#334155', 4); K.rrect(c, 1230, 340, 420, 80, 14, C.amber);
  K.text(c, 'LOKET 1', 1440, 382, {size: 40, weight: 900, align: 'center', color: '#141a2c'});
  K.rrect(c, 1230, 460, 420, 150, 14, '#0b1020', '#475569', 3); K.text(c, 'A-002', 1440, 537, {size: 80, weight: 900, align: 'center', color: C.amber});
  const p = O(S(t, .3, 1.2));
  K.orang(c, K.lerp(500, 820, p), 880, 300, C.sky, {ekspresi: t > 2 ? 'kesal' : ''}); K.orang(c, K.lerp(240, 1010, p), 880, 300, C.pink, {ekspresi: t > 2 ? 'kesal' : ''});
  K.tiketKertas(c, K.lerp(500, 820, p), 470, 'A-002', {w: 170, h: 100, rot: -.08}); K.tiketKertas(c, K.lerp(240, 1010, p), 470, 'A-002', {w: 170, h: 100, rot: .08});
  const q = O(S(t, 2, 2.6)); if (q > 0) { c.save(); c.globalAlpha = q; K.rrect(c, 700, 210, 420, 90, 45, C.coral);
    K.text(c, '"Saya duluan!"', 910, 256, {size: 38, weight: 800, align: 'center', color: '#141a2c'}); c.restore(); }
};
// b4: tukang cepat dan mandor
AD.mandor = (c, t, D) => {
  K.bg(c); K.judul(c, 'Tukang yang cepat butuh mandor', t, C.amber);
  // tanah dan pondasi
  c.fillStyle = '#3b2f2a'; c.fillRect(0, 820, K.W, 260); c.fillStyle = '#2a211d'; c.fillRect(0, 820, K.W, 8);
  const pond = K.lerp(170, 50, O(S(t, D * .3, D * .45))); // pondasi makin dangkal
  K.rrect(c, 700, 820, 760, pond, 6, '#8b8f99', '#cbd5e1', 2);
  // dinding bata tumbuh cepat
  const nb = Math.floor(K.clamp(t / (D * .5)) * 36);
  for (let i = 0; i < nb; i++) { const r = Math.floor(i / 6), k = i % 6; K.rrect(c, 720 + k * 120 + (r % 2) * 30, 760 - r * 62, 110, 54, 6, '#c2573a', '#7c2d12', 2); }
  // tukang (AI)
  K.orang(c, 560, 820, 220, C.violet, {topi: C.amber}); K.text(c, 'AI: sangat cepat', 560, 560, {size: 30, weight: 800, align: 'center', color: C.violet});
  // mandor
  const pm = O(S(t, D * .42, D * .52)); if (pm > 0) { c.save(); c.globalAlpha = pm;
    K.orang(c, 1640, 820, 240, C.teal, {topi: '#f8fafc'}); K.text(c, 'Kamu: mandor', 1640, 540, {size: 30, weight: 800, align: 'center', color: C.teal}); c.restore(); }
  const pw = O(S(t, D * .55, D * .62)); if (pw > 0) { c.save(); c.globalAlpha = pw;
    K.rrect(c, 1180, 860, 560, 150, 20, 'rgba(14,20,36,.94)', C.coral, 4);
    K.text(c, 'Pondasi terlalu dangkal!', 1210, 910, {size: 34, weight: 900, color: C.coral}); K.text(c, 'Bongkar dan perbaiki.', 1210, 965, {size: 30, weight: 600}); c.restore(); }
  const pc = O(S(t, D * .78, D * .86)); if (pc > 0) { c.save(); c.globalAlpha = pc;
    K.rrect(c, 140, 230, 820, 120, 24, 'rgba(163,230,53,.12)', C.lime, 3); K.text(c, 'Tahu kapan hasilnya benar,', 180, 272, {size: 32, weight: 700}); K.text(c, 'dan kapan harus ditolak.', 180, 318, {size: 32, weight: 700, color: C.lime}); c.restore(); }
};
// b5: peta 12 bab
const BAB = [['1', 'Kebutuhan', C.pink], ['2', 'Desain database', C.teal], ['3', 'SQL dengan tangan', C.teal], ['4', 'Server pertama', C.violet], ['5', 'REST API', C.violet],
  ['6', 'Nomor ganda', C.coral], ['7', 'Booking dobel', C.coral], ['8', 'Login petugas', C.amber], ['9', 'Layar real time', C.sky], ['10', 'Pelanggan & petugas', C.sky],
  ['11', 'Testing', C.lime], ['12', 'Online!', C.amber]];
const MULAI = [.06, .2, .26, .32, .37, .47, .55, .66, .7, .74, .78, .82];
AD.petaBab = (c, t, D) => {
  K.bg(c); K.judul(c, 'Dua belas bab', t, C.amber, 'Tiap bab punya cap waktu di deskripsi');
  BAB.forEach(([n, nama, w], i) => { const p = O(S(t, D * MULAI[i], D * MULAI[i] + .6)); if (p <= 0) return;
    const kol = i % 4, bar = Math.floor(i / 4), x = 140 + kol * 420, y = 260 + bar * 250 + (1 - p) * 24;
    const aktif = t < D * (MULAI[i + 1] ?? .95) && t >= D * MULAI[i];
    c.save(); c.globalAlpha = p; K.rrect(c, x, y, 390, 200, 22, aktif ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.04)', w, aktif ? 5 : 3);
    K.text(c, 'BAB ' + n, x + 30, y + 50, {size: 26, weight: 900, color: w}); K.text(c, nama, x + 30, y + 120, {size: 38, weight: 800, maxW: 340}); c.restore(); });
};
// b6: bekal
AD.bekal = (c, t, D) => {
  K.bg(c); K.judul(c, 'Yang kamu butuhkan', t, C.amber, 'Semuanya gratis');
  const alat = [['Node.js', 'menjalankan JavaScript di server', C.lime], ['PostgreSQL', 'database', C.teal], ['VS Code', 'editor kode', C.sky], ['Git', 'mencatat setiap perubahan', C.coral]];
  alat.forEach(([n, s, w], i) => { const p = O(S(t, .4 + i * .7, 1 + i * .7)); K.kartu(c, 140 + i * 420, 240, 390, 200, '', '', {p, warna: w});
    if (p > 0) { K.text(c, n, 190 + i * 420, 310, {size: 44, weight: 900, alpha: p}); K.text(c, s, 190 + i * 420, 380, {size: 24, weight: 600, color: C.redup, maxW: 320, alpha: p}); } });
  const p2 = O(S(t, D * .28, D * .28 + .6)); if (p2 > 0) { c.save(); c.globalAlpha = p2;
    K.text(c, 'Dasar JavaScript', 140, 540, {size: 34, weight: 800, color: C.amber});
    ['let nama = "Rahmat";', 'if (antre > 10) { ... }', 'for (const t of tiket) { ... }', 'function hitung(a, b) { ... }'].forEach((s, i) => {
      const q = O(S(t, D * .3 + i * .5, D * .3 + i * .5 + .4)); K.kode(c, [s], 140 + (i % 2) * 560, 590 + Math.floor(i / 2) * 120, {size: 28, w: 520, chars: q > 0 ? 99 : 0}); });
    c.restore(); }
  const p3 = O(S(t, D * .72, D * .72 + .6)); if (p3 > 0) { c.save(); c.globalAlpha = p3;
    K.rrect(c, 1300, 540, 480, 380, 24, '#0d1222', C.garis, 2); K.text(c, 'Kode di GitHub', 1340, 590, {size: 30, weight: 800, color: C.amber});
    ['bab-01', 'bab-02', 'bab-03', '...', 'bab-12'].forEach((s, i) => { K.rrect(c, 1340, 630 + i * 56, 180, 42, 21, i === 3 ? null : 'rgba(56,189,248,.16)', i === 3 ? null : C.sky, 2);
      K.text(c, s, 1430, 652 + i * 56, {size: 22, weight: 800, align: 'center', mono: true, color: C.sky}); });
    K.text(c, 'satu tag per bab', 1550, 760, {size: 24, weight: 600, color: C.redup, maxW: 200}); c.restore(); }
};
// b7: perkenalan segmen Cek kerjaan AI
AD.cekAIpengantar = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t);
  const p = O(S(t, .6, 1.2)); K.labelAI(c, 140, 200, p);
  if (p > 0) { c.save(); c.globalAlpha = p;
    K.kode(c, ["app.get('/api/tiket/:id', async (req, res) => {", "  const { rows } = await pool.query(", "    'SELECT * FROM tickets WHERE id = ' + req.params.id", '  );', '  res.json(rows[0]);', '});'], 140, 290, {size: 30, w: 1100, sorot: t > D * .55 ? [2] : [], pSorot: O(S(t, D * .55, D * .6))});
    c.restore(); }
  const p2 = O(S(t, D * .35, D * .35 + .6)); if (p2 > 0) { c.save(); c.globalAlpha = p2;
    K.rrect(c, 1300, 290, 480, 300, 24, 'rgba(244,114,182,.10)', C.pink, 3); K.text(c, 'Tugasmu:', 1340, 345, {size: 32, weight: 900, color: C.pink});
    K.text(c, 'temukan masalahnya sebelum aku membuktikannya.', 1340, 410, {size: 32, weight: 600, maxW: 410}); c.restore(); }
  K.pikirkan(c, t, D, 1660, 900);
};
// b8: penutup pembuka
AD.siapkanKopi = (c, t, D) => {
  K.bg(c); const p = O(S(t, .1, .8));
  c.save(); c.globalAlpha = p; const x = 560, y = 640;
  K.rrect(c, x - 150, y - 160, 300, 260, 30, '#f8fafc'); c.strokeStyle = '#f8fafc'; c.lineWidth = 26; c.beginPath(); c.arc(x + 160, y - 40, 60, -1.2, 1.2); c.stroke();
  c.fillStyle = '#7c4a2d'; c.beginPath(); c.ellipse(x, y - 150, 130, 22, 0, 0, 7); c.fill();
  for (let i = 0; i < 3; i++) { const o = (t * .6 + i / 3) % 1; c.strokeStyle = `rgba(226,232,240,${.5 * (1 - o)})`; c.lineWidth = 8; c.beginPath();
    const bx = x - 60 + i * 60, by = y - 200 - o * 160; c.moveTo(bx, by + 80); c.bezierCurveTo(bx - 30, by + 50, bx + 30, by + 30, bx, by); c.stroke(); }
  K.rrect(c, x - 220, y + 100, 440, 24, 12, '#475569'); c.restore();
  const p2 = O(S(t, .8, 1.5)); c.save(); c.globalAlpha = p2;
  K.text(c, 'Kita mulai dari', 1000, 430, {size: 52, weight: 700, color: C.redup}); K.text(c, 'orang yang akan', 1000, 520, {size: 72, weight: 900}); K.text(c, 'memakainya.', 1000, 610, {size: 72, weight: 900, color: C.amber});
  K.rrect(c, 1000, 700, 360, 60, 30, C.pink); K.text(c, 'Bab 1: Kebutuhan', 1180, 731, {size: 28, weight: 900, align: 'center', color: '#141a2c'}); c.restore();
};
})();
