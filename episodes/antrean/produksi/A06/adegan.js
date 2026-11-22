// A06 Konkurensi
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
// garis waktu dua request
const jalur = (c, t, D, langkah, o = {}) => {
  [['Request 1', 330, C.sky], ['Request 2', 620, C.pink]].forEach(([n, y, w]) => {
    K.text(c, n, 140, y, {size: 32, weight: 800, color: w}); c.strokeStyle = '#475569'; c.lineWidth = 4; c.beginPath(); c.moveTo(380, y); c.lineTo(1780, y); c.stroke(); });
  if (o.amplop) [[330, C.sky, o.amplop[0]], [620, C.pink, o.amplop[1]]].forEach(([y, w, [x1, x2]]) => {
    K.rrect(c, x1, y - 80, x2 - x1, 160, 20, 'rgba(255,255,255,.03)', w, 2); K.text(c, 'BEGIN', x1 + 14, y - 62, {size: 20, weight: 800, mono: true, color: w}); K.text(c, 'COMMIT', x2 - 14, y - 62, {size: 20, weight: 800, mono: true, color: w, align: 'right'}); });
  langkah.forEach(([j, x, teks, f, buruk]) => { const p = O(S(t, D * f, D * f + .5)); if (p <= 0) return; const y = j ? 620 : 330;
    c.save(); c.globalAlpha = p; const w = K.lebar(c, teks, 28, 800, true) + 40;
    K.rrect(c, x - w / 2, y - 34 + (1 - p) * 20, w, 68, 34, buruk ? C.coral : (j ? C.pink : C.sky)); K.text(c, teks, x, y + 1 + (1 - p) * 20, {size: 28, weight: 800, mono: true, align: 'center', color: '#0e1424'}); c.restore(); });
};
AD.balapan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Race condition', t, C.coral, 'Hasilnya bergantung pada siapa yang lebih cepat');
  jalur(c, t, D, [[0, 560, 'baca max = 6', .12], [1, 760, 'baca max = 6', .3], [0, 1130, 'tulis 7', .48], [1, 1330, 'tulis 7', .6, true]]);
  const p = O(S(t, D * .72, D * .78)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 560, 800, 800, 140, 24, 'rgba(255,107,107,.1)', C.coral, 4);
    K.text(c, 'Dua pelanggan, nomor A-007', 960, 870, {size: 44, weight: 900, align: 'center', color: C.coral}); c.restore(); }
};
AD.balapanTransaksi = (c, t, D) => {
  K.bg(c); K.judul(c, 'Transaksi saja belum cukup', t, C.coral, 'Semua atau tidak sama sekali, tetapi tidak membuat orang lain menunggu');
  jalur(c, t, D, [[0, 600, 'baca 6', .1], [1, 760, 'baca 6', .25], [0, 1100, 'tulis 7', .4], [1, 1260, 'tulis 7', .55, true]], {amplop: [[440, 1480], [620, 1660]]});
};
AD.jamPasir = (c, t, D) => {
  K.bg(c); K.judul(c, 'Kenapa lolos saat dicoba sendiri?', t, C.amber, 'Jarak waktunya hanya beberapa milidetik');
  // kiri: satu pengguna
  K.rrect(c, 140, 260, 760, 600, 24, 'rgba(255,255,255,.03)', C.lime, 3); K.text(c, 'Kamu mencoba sendiri', 520, 320, {size: 34, weight: 800, align: 'center', color: C.lime});
  K.orang(c, 520, 720, 260, C.sky); K.centang(c, 520, 800, 60, O(S(t, D * .2, D * .3)));
  // kanan: senin pagi
  const pk = O(S(t, D * .4, D * .5)); c.save(); c.globalAlpha = pk;
  K.rrect(c, 1020, 260, 760, 600, 24, 'rgba(255,255,255,.03)', C.coral, 3); K.text(c, 'Senin pagi di bengkel', 1400, 320, {size: 34, weight: 800, align: 'center', color: C.coral});
  for (let i = 0; i < 10; i++) K.orang(c, 1090 + (i % 5) * 150, 580 + Math.floor(i / 5) * 230, 170, [C.sky, C.pink, C.violet, C.teal, C.lime, C.amber][i % 6], {ekspresi: t > D * .7 && i % 3 === 0 ? 'kesal' : ''});
  c.restore();
  const p = O(S(t, D * .68, D * .75)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 1180, 860, 440, 80, 40, C.coral); K.text(c, 'Tabrakan!', 1400, 901, {size: 38, weight: 900, align: 'center', color: '#0e1424'}); c.restore(); }
};
AD.amplopTransaksi = (c, t, D) => {
  K.bg(c); K.judul(c, 'Transaksi', t, C.teal, 'Semuanya berhasil, atau tidak satu pun tersimpan');
  const gagal = t > D * .55, rob = S(t, D * .62, D * .75);
  c.save(); if (rob > 0) { c.globalAlpha = 1 - rob * .6; }
  K.rrect(c, 360, 280, 1200, 480, 30, 'rgba(45,212,191,.05)', gagal ? C.coral : C.teal, 5);
  K.text(c, 'BEGIN', 400, 330, {size: 34, weight: 900, mono: true, color: C.teal}); K.text(c, gagal ? 'ROLLBACK' : 'COMMIT', 1520, 710, {size: 34, weight: 900, mono: true, align: 'right', color: gagal ? C.coral : C.teal});
  K.rrect(c, 440, 390, 1040, 110, 18, '#0d1222', C.garis, 2); K.text(c, 'INSERT INTO tickets ...', 480, 445, {size: 32, weight: 700, mono: true});
  K.rrect(c, 440, 540, 1040, 110, 18, '#0d1222', gagal ? C.coral : C.garis, gagal ? 4 : 2); K.text(c, 'INSERT INTO ticket_events ...', 480, 595, {size: 32, weight: 700, mono: true});
  if (gagal) { K.text(c, '✕ gagal', 1440, 595, {size: 32, weight: 900, align: 'right', color: C.coral}); }
  c.restore();
  if (rob > 0) { c.save(); c.strokeStyle = C.coral; c.lineWidth = 10; c.beginPath(); c.moveTo(960, 270); for (let i = 0; i < 8; i++) c.lineTo(960 + (i % 2 ? 40 : -40), 270 + (i + 1) * 62 * rob); c.stroke(); c.restore();
    K.text(c, 'Tidak ada tiket tanpa riwayat', 960, 860, {size: 40, weight: 800, align: 'center', color: C.amber, alpha: O(rob)}); }
};
const gembok = (c, x, y, s, warna, buka = 0) => { c.save(); c.strokeStyle = warna; c.lineWidth = s * .14; c.beginPath(); c.arc(x, y - s * .35 - buka * s * .3, s * .32, Math.PI, 0); c.stroke();
  K.rrect(c, x - s * .5, y - s * .35, s, s * .8, s * .12, warna); c.fillStyle = '#0e1424'; c.beginPath(); c.arc(x, y + s * .02, s * .1, 0, 7); c.fill(); c.restore(); };
AD.gembokLayanan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Mengunci baris', t, C.amber, 'SELECT ... FROM services WHERE id = $1 FOR UPDATE');
  K.rrect(c, 140, 280, 900, 90, 14, '#18213c', C.teal, 3); ['id', 'code', 'name'].forEach((h, i) => K.text(c, h, 180 + i * 220, 325, {size: 28, weight: 800, mono: true, color: C.teal}));
  [['1', 'A', 'Ganti oli'], ['2', 'B', 'Servis ringan'], ['3', 'C', 'Servis besar']].forEach((r, j) => { const y = 410 + j * 90; const on = j === 0 && t > D * .15;
    K.rrect(c, 140, y - 40, 900, 80, 12, on ? 'rgba(255,176,32,.18)' : 'rgba(255,255,255,.03)', on ? C.amber : C.garis, on ? 4 : 2);
    r.forEach((v, i) => K.text(c, v, 180 + i * 220, y, {size: 28, weight: 600, mono: true})); });
  if (t > D * .15) gembok(c, 1000, 420, 60, C.amber, 0);
  // antrean request
  for (let i = 0; i < 5; i++) { const a = D * (.25 + i * .1), q = K.clamp((t - a) / 1.2); if (q <= 0) continue; const giliran = Math.floor(K.clamp((t - D * .3) / (D * .5)) * 5);
    const x = i < giliran ? 1180 : 1300 + (i - giliran) * 110; const y = i < giliran ? 300 + i * 80 : 410;
    K.rrect(c, x, y - 30, 90, 60, 30, i < giliran ? C.lime : C.sky); K.text(c, i < giliran ? `A-0${10 + i}` : 'req', x + 45, y + 1, {size: 20, weight: 900, align: 'center', color: '#0e1424'}); }
  const p = O(S(t, D * .82, D * .88)); if (p > 0) K.text(c, 'Satu per satu, seperti mesin nomor di meja depan', 960, 900, {size: 38, weight: 800, align: 'center', color: C.amber, alpha: p});
};
// petugas dan TV
const tv = (c, x, y, baris) => { K.rrect(c, x, y, 520, 300, 18, '#0b1020', '#475569', 6); K.text(c, 'LAYAR TV', x + 260, y + 40, {size: 22, weight: 800, align: 'center', color: C.redup});
  baris.forEach(([l, k, w], i) => { K.text(c, l, x + 50, y + 110 + i * 80, {size: 52, weight: 900, color: w || C.amber}); K.text(c, k, x + 470, y + 110 + i * 80, {size: 36, weight: 800, align: 'right', color: w || C.amber}); }); };
const tumpuk = (c, x, y, lbl, o = {}) => lbl.forEach((l, i) => { if (o.hilang && o.hilang.includes(l)) return; K.tiketKertas(c, x, y + i * 92, l, {w: 170, h: 80, alpha: o.redup && o.redup.includes(l) ? .35 : 1}); });
AD.duaPetugas = (c, t, D) => {
  K.bg(c); K.judul(c, 'Dua petugas menekan Panggil', t, C.coral);
  K.orang(c, 260, 520, 220, C.teal); K.text(c, 'Loket 1', 260, 560, {size: 30, weight: 800, align: 'center'});
  K.orang(c, 260, 900, 220, C.violet); K.text(c, 'Loket 2', 260, 940, {size: 30, weight: 800, align: 'center'});
  tumpuk(c, 760, 380, ['A-003', 'A-004', 'A-005']);
  const p = S(t, D * .3, D * .5); K.arrow(c, 380, 420, 660, 380, C.teal, 6, O(p)); K.arrow(c, 380, 800, 660, 400, C.violet, 6, O(p));
  if (p > .9) K.rrect(c, 670, 340, 180, 84, 10, null, C.coral, 6);
  const q = O(S(t, D * .6, D * .68)); if (q > 0) { c.save(); c.globalAlpha = q; tv(c, 1180, 300, [['A-003', 'Loket 1', C.coral], ['A-003', 'Loket 2', C.coral]]);
    K.text(c, 'Ke loket mana?', 1440, 700, {size: 40, weight: 900, align: 'center', color: C.coral}); c.restore(); }
};
AD.tungguGembok = (c, t, D) => {
  K.bg(c); K.judul(c, 'FOR UPDATE saja?', t, C.amber, 'Loket 2 menunggu, lalu mendapat jawaban yang salah');
  K.orang(c, 260, 520, 220, C.teal); K.text(c, 'Loket 1', 260, 560, {size: 30, weight: 800, align: 'center'});
  K.orang(c, 260, 900, 220, C.violet); K.text(c, 'Loket 2', 260, 940, {size: 30, weight: 800, align: 'center'});
  const diambil = t > D * .45; tumpuk(c, 760, 380, ['A-003', 'A-004', 'A-005'], {redup: diambil ? ['A-003'] : []});
  gembok(c, 900, 360, 44, C.amber, diambil ? 1 : 0);
  const w = t < D * .45; if (w) { K.text(c, 'menunggu…', 520, 820, {size: 34, weight: 700, color: C.redup}); }
  const p = O(S(t, D * .55, D * .62)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 420, 780, 520, 90, 20, 'rgba(255,107,107,.12)', C.coral, 4);
    K.text(c, '"Antrean kosong"', 680, 826, {size: 36, weight: 900, align: 'center', color: C.coral}); c.restore();
    K.text(c, 'padahal A-004 dan A-005 masih menunggu', 1200, 980, {size: 32, weight: 700, color: C.amber, alpha: p}); }
};
AD.skipLocked = (c, t, D) => {
  K.bg(c); K.judul(c, 'FOR UPDATE SKIP LOCKED', t, C.lime, 'Kunci yang kuambil, lompati yang sedang dikunci orang lain');
  K.orang(c, 260, 520, 220, C.teal); K.text(c, 'Loket 1', 260, 560, {size: 30, weight: 800, align: 'center'});
  K.orang(c, 260, 900, 220, C.violet); K.text(c, 'Loket 2', 260, 940, {size: 30, weight: 800, align: 'center'});
  tumpuk(c, 760, 380, ['A-003', 'A-004', 'A-005']);
  const p = S(t, D * .45, D * .62); K.arrow(c, 380, 420, 660, 380, C.teal, 6, O(p)); K.arrow(c, 380, 800, 660, 470, C.violet, 6, O(p));
  if (p > .5) { gembok(c, 900, 360, 44, C.teal); gembok(c, 900, 452, 44, C.violet); }
  const q = O(S(t, D * .7, D * .78)); if (q > 0) { c.save(); c.globalAlpha = q; tv(c, 1180, 300, [['A-003', 'Loket 1', C.lime], ['A-004', 'Loket 2', C.lime]]); c.restore(); }
};
AD.dariDiagram = (c, t, D) => {
  K.bg(c); K.judul(c, 'Diagram status menjadi kode', t, C.amber);
  const p = O(S(t, .3, 1)); c.save(); c.globalAlpha = p; c.translate(80, 140); c.scale(.55, .55);
  K.diagramStatus(c, {M: 1, P: 1, L: 1, S: 1, W: 1}, {MP: 1, PL: 1, LS: 1, PW: 1, WP: 1}, {warnaEdge: t > D * .7 ? {} : {}}); c.restore();
  if (t > D * .7) { const q = O(S(t, D * .7, D * .76)); c.save(); c.globalAlpha = q; c.translate(80, 140); c.scale(.55, .55);
    c.setLineDash([16, 12]); K.arrow(c, 1600, 360, 900, 360, C.coral, 8, 1, 26); c.setLineDash([]);
    K.text(c, '409', 1250, 310, {size: 60, weight: 900, align: 'center', color: C.coral}); c.restore(); }
  const k = O(S(t, D * .25, D * .35)); if (k > 0) { c.save(); c.globalAlpha = k;
    K.kode(c, ['const BOLEH = {', "  ulang:   { dari: ['called', 'skipped'], ke: 'called' },", "  lewati:  { dari: ['called'],            ke: 'skipped' },", "  layani:  { dari: ['called'],            ke: 'serving' },", "  selesai: { dari: ['serving'],           ke: 'done' },", '};'], 140, 640, {size: 28, w: 1640, sorot: t > D * .45 ? [2, 4] : []}); c.restore(); }
};
const KODE = ["app.post('/api/counters/:id/call', async (req, res) => {", "  const client = await pool.connect();", "  await client.query('BEGIN');", "  const r = await client.query(", "    \"SELECT id FROM tickets WHERE status = 'waiting' ORDER BY created_at LIMIT 1\");", "  await client.query(\"UPDATE tickets SET status = 'called' WHERE id = $1\", [r.rows[0].id]);", "  await client.query('COMMIT');", "  client.release();", "  res.json(r.rows[0]);", "});"];
AD.cekAI06 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "buatkan fitur panggil antrean yang aman"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE, 140, 310, {size: 26, w: 1640, chars: Math.floor(700 * S(t, .8, 3.5))});
  K.pikirkan(c, t, D, 1660, 900);
};

AD.masalahAI06 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t);
  K.text(c, 'Perintah: "buatkan fitur panggil antrean yang aman"', 140, 200, {size: 30, weight: 600, color: C.redup});
  const b = .25 * D, p = O(S(t, b, b + .5));
  K.kode(c, KODE, 140, 240, {size: 26, w: 1640, sorot: t < b ? [2, 6] : [3, 4], pSorot: O(S(t, .3, .8))});
  c.save(); c.globalAlpha = O(S(t, .4, 1)); K.text(c, 'Transaksi bukan kunci', 140, 800, {size: 38, weight: 900, color: C.amber}); c.restore();
  c.save(); c.globalAlpha = p; K.text(c, 'SELECT ini tidak memakai FOR UPDATE SKIP LOCKED, jadi tidak mengunci baris apa pun.', 140, 870, {size: 30, weight: 600});
  K.text(c, 'Loket 1 dan loket 2 bisa membaca tiket yang sama, lalu sama-sama memanggilnya.', 140, 920, {size: 30, weight: 600, color: C.coral}); c.restore();
};
})();
