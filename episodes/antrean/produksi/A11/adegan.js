// A11 Laporan dan pengujian
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
AD.duaPertanyaan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Tiga pertanyaan', t, C.amber);
  K.orang(c, 300, 720, 280, C.amber, {topi: '#1e293b'}); K.text(c, 'Pak Rahmat', 300, 780, {size: 30, weight: 800, align: 'center'});
  const q = [['Berapa lama pelangganku menunggu?', C.amber], ['Jam berapa bengkelku paling ramai?', C.amber], ['Bagaimana kita tahu aplikasinya masih benar setelah satu baris diubah?', C.sky]];
  q.forEach(([s, w], i) => { const p = O(S(t, .4 + i * D * .25, 1 + i * D * .25)); if (p <= 0) return;
    K.rrect(c, 560, 260 + i * 190, 1220, 140, 70, 'rgba(255,255,255,.04)', w, 4, p); K.text(c, s, 1170, 332 + i * 190, {size: 32, weight: 800, align: 'center', color: w, alpha: p, maxW: 1160}); });
};
AD.withDua = (c, t, D) => {
  K.bg(c); K.judul(c, 'Memperbaiki jebakan rata-rata', t, C.amber, 'WITH: tabel sementara yang diberi nama');
  const kotak = (x, y, nama, isi, w, p) => { if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, x, y, 520, 220, 18, '#0d1222', w, 3);
    K.text(c, nama, x + 26, y + 40, {size: 32, weight: 900, mono: true, color: w}); isi.forEach((s, i) => K.text(c, s, x + 26, y + 100 + i * 44, {size: 24, weight: 600, mono: true})); c.restore(); };
  kotak(140, 260, 'panggil', ['ticket_id', 'min(created_at) AS pertama'], C.sky, O(S(t, .4, 1)));
  kotak(140, 520, 'batal', ['ticket_id', 'created_at (status cancelled)'], C.coral, O(S(t, D * .25, D * .32)));
  const p = O(S(t, D * .45, D * .55)); if (p > 0) { K.arrow(c, 680, 370, 860, 470, '#64748b', 4, p, 14); K.arrow(c, 680, 630, 860, 530, '#64748b', 4, p, 14);
    c.save(); c.globalAlpha = p; K.rrect(c, 880, 330, 900, 360, 20, 'rgba(255,176,32,.06)', C.amber, 3);
    [['dilayani', 'rata-rata tunggu sampai dipanggil', C.lime], ['batal', 'berapa orang menyerah', C.coral], ['tunggu sebelum batal', 'berapa lama mereka bertahan', C.amber]].forEach(([a, b, w], i) => {
      K.text(c, a, 920, 400 + i * 100, {size: 34, weight: 900, color: w}); K.text(c, b, 920, 440 + i * 100, {size: 24, weight: 600, color: C.redup}); }); c.restore(); }
  const q = O(S(t, D * .8, D * .88)); if (q > 0) K.text(c, 'Pelanggan yang pulang kini ikut terhitung', 960, 860, {size: 38, weight: 800, align: 'center', alpha: q});
};
AD.jamZona = (c, t, D) => {
  K.bg(c); K.judul(c, 'Jam tersibuk', t, C.sky, 'extract(hour FROM created_at AT TIME ZONE ...)');
  K.rrect(c, 140, 270, 760, 160, 20, '#0d1222', '#334155', 3); K.text(c, 'tersimpan', 180, 315, {size: 26, weight: 700, color: C.redup});
  K.text(c, '2026-11-17 00:05+00', 180, 375, {size: 40, weight: 800, mono: true});
  const p = O(S(t, D * .2, D * .3)); if (p > 0) { K.arrow(c, 920, 350, 1060, 350, C.coral, 5, p, 16); c.save(); c.globalAlpha = p; K.rrect(c, 1080, 270, 700, 160, 20, 'rgba(255,107,107,.06)', C.coral, 3);
    K.text(c, 'tanpa zona waktu', 1120, 315, {size: 26, weight: 700, color: C.coral}); K.text(c, 'jam 0', 1120, 375, {size: 46, weight: 900, color: C.coral}); c.restore(); }
  const q = O(S(t, D * .45, D * .55)); if (q > 0) { K.arrow(c, 920, 350, 1060, 600, C.lime, 5, q, 16); c.save(); c.globalAlpha = q; K.rrect(c, 1080, 520, 700, 160, 20, 'rgba(163,230,53,.06)', C.lime, 3);
    K.text(c, "AT TIME ZONE 'Asia/Jakarta'", 1120, 565, {size: 26, weight: 700, mono: true, color: C.lime}); K.text(c, 'jam 7 pagi', 1120, 625, {size: 46, weight: 900, color: C.lime}); c.restore(); }
  const r = O(S(t, D * .7, D * .8)); if (r > 0) K.text(c, 'lalu count(*) per jam', 960, 820, {size: 38, weight: 800, align: 'center', mono: true, alpha: r});
};
AD.ujiOtomatis = (c, t, D) => {
  K.bg(c); K.judul(c, 'Testing', t, C.lime, 'Kode yang menguji kode kita');
  const hal = ['nomor ganda', 'status terlarang', 'validasi', 'login', 'kuota slot', 'XSS', 'SSE', 'laporan'];
  hal.forEach((h, i) => { const p = O(S(t, .3 + i * .25, .7 + i * .25)); if (p <= 0) return; const x = 160 + (i % 4) * 420, y = 280 + Math.floor(i / 4) * 130;
    K.rrect(c, x, y, 380, 90, 45, 'rgba(255,107,107,.08)', C.coral, 3); K.text(c, h, x + 190, y + 46, {size: 30, weight: 800, align: 'center', color: C.coral, alpha: p}); });
  const p = O(S(t, D * .4, D * .5)); if (p > 0) { K.orang(c, 400, 860, 200, C.teal); K.text(c, 'klik satu per satu, setiap hari?', 760, 760, {size: 32, weight: 800, color: C.redup, alpha: p}); K.coret(c, 740, 760, 1240, 760, O(S(t, D * .55, D * .62))); }
  const q = O(S(t, D * .65, D * .75)); if (q > 0) { K.rrect(c, 760, 820, 820, 100, 20, '#0d1222', C.lime, 3); K.text(c, '$ npm test   ✓ 4 lulus', 800, 870, {size: 36, weight: 800, mono: true, color: C.lime, alpha: q}); }
};
AD.supertest = (c, t, D) => {
  K.bg(c); K.judul(c, 'node:test dan supertest', t, C.sky, 'Request ke aplikasi, tanpa membuka port');
  K.rrect(c, 140, 280, 520, 300, 22, '#0d1222', C.lime, 3); K.text(c, 'test', 400, 330, {size: 34, weight: 900, align: 'center', mono: true, color: C.lime});
  K.text(c, "request(app)", 400, 420, {size: 30, weight: 700, align: 'center', mono: true}); K.text(c, ".post('/api/tiket')", 400, 470, {size: 30, weight: 700, align: 'center', mono: true});
  K.arrow(c, 680, 430, 1060, 430, C.sky, 6, O(S(t, .6, 1.4)), 18);
  K.rrect(c, 1080, 280, 700, 300, 22, '#0d1222', C.violet, 3); K.text(c, 'app (Express)', 1430, 330, {size: 34, weight: 900, align: 'center', mono: true, color: C.violet});
  K.text(c, 'tanpa listen di port 3000', 1430, 440, {size: 28, weight: 700, align: 'center', color: C.redup});
  const p = O(S(t, D * .45, D * .55)); if (p > 0) { c.save(); c.globalAlpha = p;
    K.kode(c, ["if (require.main === module) app.listen(3000);", "module.exports = app;"], 140, 660, {size: 32, w: 1100});
    K.text(c, 'listen hanya kalau dijalankan langsung', 1290, 700, {size: 28, weight: 800, color: C.amber}); c.restore(); }
};
AD.dbTest = (c, t, D) => {
  K.bg(c); K.judul(c, 'Database khusus test', t, C.teal, 'Test tidak boleh menyentuh data sungguhan');
  const tabung = (x, nama, w, p) => { c.save(); c.globalAlpha = p; c.fillStyle = w; c.strokeStyle = w; c.lineWidth = 4;
    c.beginPath(); c.ellipse(x, 340, 150, 40, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(x - 150, 340); c.lineTo(x - 150, 600); c.ellipse(x, 600, 150, 40, 0, Math.PI, 0, true); c.lineTo(x + 150, 340); c.stroke();
    K.text(c, nama, x, 690, {size: 36, weight: 900, align: 'center', mono: true, color: w}); c.restore(); };
  tabung(480, 'antrean', C.sky, 1); K.text(c, 'data Pak Rahmat', 480, 740, {size: 26, weight: 700, align: 'center', color: C.redup});
  tabung(1440, 'antrean_test', C.lime, O(S(t, D * .2, D * .3)));
  const p = O(S(t, D * .4, D * .5)); if (p > 0) { c.save(); c.globalAlpha = p; ['DROP SCHEMA', 'schema.sql', 'seed.sql'].forEach((s, i) => { K.rrect(c, 820, 330 + i * 90, 300, 64, 12, '#1e293b', C.lime, 2); K.text(c, s, 970, 363 + i * 90, {size: 26, weight: 800, align: 'center', mono: true, color: C.lime}); });
    K.arrow(c, 1130, 450, 1280, 450, C.lime, 5, 1, 14); c.restore(); }
  const q = O(S(t, D * .7, D * .8)); if (q > 0) K.text(c, 'Setiap test mulai dari keadaan yang sama', 960, 860, {size: 38, weight: 800, align: 'center', alpha: q});
};
AD.panahTerlarang = (c, t, D) => {
  K.bg(c); K.judul(c, 'Menguji diagram status', t, C.coral, 'Di panah terlarang, bug biasanya bersembunyi');
  const st = [['waiting', 220], ['called', 620], ['serving', 1020], ['done', 1420]];
  st.forEach(([s, x], i) => { K.rrect(c, x, 400, 280, 100, 50, i === 3 ? 'rgba(163,230,53,.1)' : '#1e293b', i === 3 ? C.lime : '#64748b', 3); K.text(c, s, x + 140, 451, {size: 32, weight: 800, align: 'center', mono: true});
    if (i) K.arrow(c, st[i - 1][1] + 290, 450, x - 10, 450, '#94a3b8', 4, 1, 14); });
  const p = O(S(t, D * .25, D * .45)); if (p > 0) { c.save(); c.globalAlpha = p; c.strokeStyle = C.coral; c.lineWidth = 5; c.setLineDash([14, 10]);
    c.beginPath(); c.moveTo(1560, 510); c.bezierCurveTo(1560, 760, 760, 760, 760, 510); c.stroke(); c.setLineDash([]);
    K.text(c, 'ulang', 1160, 760, {size: 32, weight: 800, align: 'center', mono: true, color: C.coral}); c.restore(); }
  const q = O(S(t, D * .5, D * .6)); if (q > 0) { K.rrect(c, 1020, 770, 300, 90, 16, 'rgba(255,107,107,.1)', C.coral, 3); K.text(c, '409', 1170, 816, {size: 50, weight: 900, align: 'center', color: C.coral, alpha: q}); }
};
const JEJAK = ['error: column t.servce_id does not exist', '    at node_modules/pg-pool/index.js:45:11', '    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)', '    at async src/routes/tiket.js:38:20', '    at async node_modules/express/lib/router/layer.js:152:17'];
AD.bacaJejak = (c, t, D) => {
  K.bg(c); K.judul(c, 'Membaca stack trace', t, C.amber, 'Jangan panik');
  K.rrect(c, 140, 260, 1640, 380, 16, '#0d1222', '#334155', 3);
  JEJAK.forEach((s, i) => K.text(c, s, 180, 320 + i * 64, {size: 30, weight: i === 0 ? 800 : 500, mono: true, color: i === 0 ? C.coral : '#94a3b8'}));
  const p = O(S(t, D * .3, D * .4)); if (p > 0) { c.save(); c.globalAlpha = p; c.strokeStyle = C.coral; c.lineWidth = 4; c.strokeRect(166, 290, 900, 56); K.text(c, '1. pesan error-nya', 1100, 320, {size: 30, weight: 800, color: C.coral}); c.restore(); }
  const q = O(S(t, D * .55, D * .65)); if (q > 0) { c.save(); c.globalAlpha = q; c.strokeStyle = C.lime; c.lineWidth = 4; c.strokeRect(166, 482, 740, 56); K.text(c, '2. baris pertama di berkasmu', 940, 512, {size: 30, weight: 800, color: C.lime}); c.restore(); }
  const r = O(S(t, D * .75, D * .82)); if (r > 0) K.text(c, 'Lewati baris node_modules: itu kode orang lain', 960, 760, {size: 36, weight: 800, align: 'center', color: C.redup, alpha: r});
};
const KODE = ["test('POST /api/tiket membuat tiket baru', async () => {", "  const res = await request(app).post('/api/tiket').send({ service_id: 1 });", "  assert.ok(res);", "});"];
AD.cekAI11 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "buatkan test untuk API ambil nomor"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE, 140, 310, {size: 30, w: 1640, chars: Math.floor(200 * S(t, .8, 3))});
  const p = O(S(t, 3, 3.5)); if (p > 0) { K.rrect(c, 140, 560, 520, 80, 14, '#0d1222', C.lime, 3); K.text(c, '✔ 1 lulus, 0 gagal', 170, 601, {size: 32, weight: 800, mono: true, color: C.lime, alpha: p}); }
  K.pikirkan(c, t, D, 1660, 900);
};
AD.testPalsu = (c, t, D, a = {}) => {
  K.bg(c); K.cekAIjudul(c, t, C.lime); K.text(c, 'assert.ok(res) hanya memeriksa bahwa res ada', 140, 200, {size: 40, weight: 900, color: C.coral});
  const kol = [['201 Created', C.lime], ['400 Bad Request', C.amber], ['500 Server Error', C.coral]];
  kol.forEach(([s, w], i) => { const p = O(S(t, .4 + i * .6, 1 + i * .6)); if (p <= 0) return; const x = 160 + i * 560;
    K.rrect(c, x, 280, 500, 120, 18, 'rgba(255,255,255,.03)', w, 3); K.text(c, s, x + 250, 340, {size: 34, weight: 800, align: 'center', mono: true, color: w, alpha: p});
    K.text(c, 'assert.ok(res): lulus', x + 250, 450, {size: 26, weight: 700, align: 'center', mono: true, color: C.lime, alpha: p}); });
  const q = O(S(t, D * .35, D * .45)) * (a.awal ? 0 : 1); if (q > 0) K.text(c, 'Test yang tidak bisa gagal = tidak punya test', 960, 570, {size: 40, weight: 900, align: 'center', color: C.amber, alpha: q});
  const r = O(S(t, D * .55, D * .65)) * (a.awal ? 0 : 1); if (r > 0) { c.save(); c.globalAlpha = r; K.kode(c, ["assert.strictEqual(res.status, 201);", "assert.strictEqual(res.body.label, 'A-001');"], 140, 640, {size: 32, w: 1000}); c.restore(); }
  const s = O(S(t, D * .78, D * .86)) * (a.awal ? 0 : 1); if (s > 0) { K.rrect(c, 1200, 650, 580, 130, 20, 'rgba(163,230,53,.08)', C.lime, 3); K.text(c, 'Rusak kodenya,', 1490, 695, {size: 32, weight: 800, align: 'center', alpha: s}); K.text(c, 'pastikan test berubah merah', 1490, 745, {size: 32, weight: 800, align: 'center', color: C.lime, alpha: s}); }
};
})();
