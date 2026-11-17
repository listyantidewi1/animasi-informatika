// A04 Server pertama
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
// amplop pesan
K.amplop = (c, x, y, w, h, warna, teks, o = {}) => { c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha *= (o.alpha ?? 1);
  K.rrect(c, -w / 2, -h / 2, w, h, 12, '#fdf6e3', warna, 4);
  c.strokeStyle = warna; c.lineWidth = 3; c.beginPath(); c.moveTo(-w / 2 + 6, -h / 2 + 6); c.lineTo(0, h * .08); c.lineTo(w / 2 - 6, -h / 2 + 6); c.stroke();
  if (teks) K.text(c, teks, 0, h * .28, {size: h * .2, weight: 900, align: 'center', color: warna}); c.restore(); };
K.serverKotak = (c, x, y, s = 1, label = 'Server') => { c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 3; i++) { K.rrect(c, -110, -150 + i * 100, 220, 86, 12, '#1e2a4a', C.violet, 4); c.fillStyle = C.lime; c.beginPath(); c.arc(-80, -107 + i * 100, 9, 0, 7); c.fill();
    for (let k = 0; k < 4; k++) c.fillRect(-40 + k * 30, -112 + i * 100, 18, 8); }
  K.text(c, label, 0, 180, {size: 34, weight: 800, align: 'center'}); c.restore(); };
AD.reqResp = (c, t, D) => {
  K.bg(c); K.judul(c, 'Request dan response', t, C.violet, 'Aturannya bernama HTTP');
  K.hp(c, 220, 300, 260, 520, (c, x, y, w, h) => { K.rrect(c, x + 14, y + 20, w - 28, 44, 12, '#e2e8f0'); K.text(c, 'bengkel.id', x + 30, y + 42, {size: 20, weight: 600, color: '#334155'});
    if (t > D * .62) { K.rrect(c, x + 20, y + 100, w - 40, 60, 10, '#1d4ed8'); K.rrect(c, x + 20, y + 180, w - 40, 60, 10, '#1d4ed8'); K.rrect(c, x + 20, y + 260, w - 40, 60, 10, '#1d4ed8'); } });
  K.text(c, 'Browser', 350, 880, {size: 34, weight: 800, align: 'center'});
  K.serverKotak(c, 1500, 560, 1.2);
  const q1 = K.ease(S(t, D * .15, D * .4)); if (q1 > 0 && q1 < 1) K.amplop(c, K.lerp(560, 1300, q1), 470 - Math.sin(q1 * Math.PI) * 80, 200, 130, C.sky, 'request');
  if (q1 >= 1 && t < D * .45) K.amplop(c, 1300, 470, 200, 130, C.sky, 'request', {alpha: 1 - S(t, D * .4, D * .45)});
  const q2 = K.ease(S(t, D * .45, D * .62)); if (q2 > 0 && q2 < 1) K.amplop(c, K.lerp(1300, 560, q2), 650 + Math.sin(q2 * Math.PI) * 80, 200, 130, C.lime, 'response');
  const p = O(S(t, D * .2, D * .25)); K.arrow(c, 600, 380, 1280, 380, C.sky, 5, p); K.text(c, 'request', 940, 345, {size: 30, weight: 800, align: 'center', color: C.sky, alpha: p});
  const p2 = O(S(t, D * .5, D * .55)); K.arrow(c, 1280, 760, 600, 760, C.lime, 5, p2); K.text(c, 'response', 940, 800, {size: 30, weight: 800, align: 'center', color: C.lime, alpha: p2});
  const p3 = O(S(t, D * .72, D * .78)); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 640, 900, 640, 80, 40, 'rgba(168,85,247,.16)', C.violet, 3);
    K.text(c, 'halaman · gambar · data', 960, 941, {size: 32, weight: 800, align: 'center', color: C.violet}); c.restore(); }
};
AD.isiRequest = (c, t, D) => {
  K.bg(c); K.judul(c, 'Isi sebuah request', t, C.sky);
  const pa = O(S(t, .2, .9)); K.amplop(c, 420, 560, 420 * (1 - .3 * pa), 280 * (1 - .3 * pa), C.sky, pa < .6 ? 'request' : '', {alpha: 1});
  const bag = [['Method', 'POST', 'kata kerja: GET meminta, POST mengirim', C.amber, .16], ['Path', '/api/layanan', 'alamat yang diminta', C.sky, .42], ['Body', '{ "service_id": 1 }', 'isi kiriman, hanya saat mengirim data', C.lime, .66]];
  bag.forEach(([n, v, s, w, f], i) => { const p = O(S(t, D * f, D * f + .6)); if (p <= 0) return; const y = 270 + i * 230 + (1 - p) * 20;
    c.save(); c.globalAlpha = p; K.rrect(c, 760, y, 1020, 190, 22, 'rgba(255,255,255,.05)', w, 4);
    K.text(c, n, 800, y + 50, {size: 30, weight: 900, color: w}); K.text(c, v, 800, y + 110, {size: 44, weight: 700, mono: true});
    K.text(c, s, 800, y + 160, {size: 26, weight: 600, color: C.redup}); c.restore();
    K.arrow(c, 560, 560, 750, y + 95, w, 3, p, 12); });
};
const wajah = (c, x, y, r, warna, jenis) => { c.fillStyle = warna; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.fillStyle = '#1e293b'; c.beginPath(); c.arc(x - r * .33, y - r * .15, r * .09, 0, 7); c.arc(x + r * .33, y - r * .15, r * .09, 0, 7); c.fill();
  c.strokeStyle = '#1e293b'; c.lineWidth = r * .08; c.beginPath();
  if (jenis === 0) c.arc(x, y + r * .1, r * .4, .2 * Math.PI, .8 * Math.PI);
  else if (jenis === 1) { c.moveTo(x - r * .3, y + r * .4); c.lineTo(x + r * .3, y + r * .3); }
  else { c.arc(x, y + r * .5, r * .3, 1.15 * Math.PI, 1.85 * Math.PI); c.moveTo(x + r * .75, y - r * .6); c.lineTo(x + r * .75, y - r * .35); }
  c.stroke(); };
AD.statusWajah = (c, t, D) => {
  K.bg(c); K.judul(c, 'Status code', t, C.amber, 'Raut wajah petugas loket');
  const d = [['2xx', 'berhasil', '200 OK · 201 Created', C.lime, .1], ['4xx', 'salah di pihak peminta', '404 Not Found · 400', C.amber, .38], ['5xx', 'server bermasalah', '500 Internal Error', C.coral, .62]];
  d.forEach(([k, a, b, w, f], i) => { const p = O(S(t, D * f, D * f + .6)); if (p <= 0) return; const x = 330 + i * 630;
    c.save(); c.globalAlpha = p; wajah(c, x, 470, 130 * K.lerp(.8, 1, K.back(p)), w, i);
    K.text(c, k, x, 690, {size: 80, weight: 900, align: 'center', color: w}); K.text(c, a, x, 770, {size: 32, weight: 700, align: 'center'});
    K.text(c, b, x, 830, {size: 26, weight: 600, align: 'center', color: C.redup, mono: true}); c.restore(); });
};
AD.pohonFolder = (c, t, D) => {
  K.bg(c); K.judul(c, 'Struktur folder', t, C.amber, 'Siapa pun langsung tahu harus mencari di mana');
  K.text(c, 'siantre/', 300, 300, {size: 44, weight: 900, mono: true});
  const d = [['src/', 'kode server', C.violet], ['public/', 'halaman untuk browser', C.sky], ['db/', 'berkas SQL dari bab 3', C.teal]];
  d.forEach(([n, k, w], i) => { const p = O(S(t, .4 + i * D * .2, .9 + i * D * .2)); if (p <= 0) return; const y = 420 + i * 150;
    c.save(); c.globalAlpha = p; c.strokeStyle = '#64748b'; c.lineWidth = 4; c.beginPath(); c.moveTo(330, y - 120); c.lineTo(330, y); c.lineTo(400, y); c.stroke();
    K.rrect(c, 420, y - 50, 360, 100, 18, 'rgba(255,255,255,.05)', w, 4); K.text(c, n, 460, y, {size: 40, weight: 800, mono: true, color: w});
    K.text(c, k, 840, y, {size: 34, weight: 600, color: C.redup}); c.restore(); });
};
AD.pintuPort = (c, t, D) => {
  K.bg(c); K.judul(c, 'localhost dan port', t, C.violet, 'localhost = komputer ini sendiri');
  K.rrect(c, 360, 260, 1200, 640, 20, '#1c2747', '#475569', 4); K.rrect(c, 300, 220, 1320, 70, 14, '#334155');
  K.text(c, 'localhost', 960, 256, {size: 38, weight: 900, align: 'center'});
  const pintu = [[22, '#475569'], [80, '#475569'], [3000, C.violet], [5432, C.teal], [8080, '#475569']];
  pintu.forEach(([n, w], i) => { const x = 440 + i * 220, on = n === 3000 ? S(t, D * .35, D * .45) : n === 5432 ? S(t, D * .6, D * .7) : 0;
    K.rrect(c, x, 520, 170, 380, 10, on > 0 ? w : '#0f172a', w, 4); c.fillStyle = '#fbbf24'; c.beginPath(); c.arc(x + 140, 720, 9, 0, 7); c.fill();
    K.rrect(c, x + 20, 440, 130, 56, 10, '#0b1020', w, 3); K.text(c, String(n), x + 85, 469, {size: 30, weight: 900, align: 'center', mono: true, color: on > 0 ? C.teks : C.redup});
    if (on > 0) K.text(c, n === 3000 ? 'Server kita' : 'PostgreSQL', x + 85, 960, {size: 30, weight: 800, align: 'center', color: w, alpha: O(on)}); });
};
AD.kolamPool = (c, t, D) => {
  if (K.IMG && D) {} K.bg(c); K.judul(c, 'Pool: kumpulan koneksi', t, C.teal, 'Dipakai bergantian, tidak dibuka-tutup setiap request');
  K.serverKotak(c, 330, 560, 1);
  // database
  const dx = 1560, dy = 560; c.fillStyle = '#134e4a'; K.rrect(c, dx - 150, dy - 160, 300, 320, 30, '#134e4a', C.teal, 4);
  for (let i = 0; i < 3; i++) { c.strokeStyle = C.teal; c.lineWidth = 4; c.beginPath(); c.ellipse(dx, dy - 120 + i * 100, 150, 30, 0, 0, Math.PI); c.stroke(); }
  K.text(c, 'PostgreSQL', dx, dy + 210, {size: 34, weight: 800, align: 'center'});
  K.rrect(c, 620, 330, 680, 460, 40, 'rgba(45,212,191,.06)', C.teal, 3); K.text(c, 'Pool', 960, 370, {size: 32, weight: 900, align: 'center', color: C.teal});
  for (let i = 0; i < 4; i++) { const y = 440 + i * 95; c.strokeStyle = '#64748b'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(700, y); c.lineTo(1220, y); c.stroke();
    const sibuk = Math.floor(t * 1.3 + i * 1.7) % 3 === 0; if (sibuk) { const q = (t * 1.3 + i * 1.7) % 1; c.fillStyle = C.amber; c.beginPath(); c.arc(K.lerp(700, 1220, q), y, 14, 0, 7); c.fill(); } }
  c.strokeStyle = '#64748b'; c.lineWidth = 6; c.beginPath(); c.moveTo(450, 560); c.lineTo(620, 560); c.moveTo(1300, 560); c.lineTo(1410, 560); c.stroke();
  const p = O(S(t, D * .55, D * .62)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 420, 880, 1080, 110, 24, 'rgba(14,20,36,.94)', C.amber, 3);
    K.text(c, 'DATABASE_URL', 470, 935, {size: 34, weight: 900, mono: true, color: C.amber}); K.text(c, 'kata sandi di environment, bukan di kode', 800, 935, {size: 30, weight: 600}); c.restore(); }
};
AD.alirData = (c, t, D) => {
  K.bg(c); K.judul(c, 'Data mengalir', t, C.amber, 'Database → server → browser');
  const k = [['Database', 'SELECT ... FROM services', C.teal], ['Server', 'res.json(rows)', C.violet], ['Browser', '[{ "code": "A", ... }]', C.sky]];
  k.forEach(([n, s, w], i) => { const on = O(S(t, .3 + i * D * .22, .8 + i * D * .22)); const x = 140 + i * 600;
    K.rrect(c, x, 380, 480, 260, 24, on > 0 ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.02)', w, on > 0 ? 5 : 2);
    K.text(c, n, x + 240, 460, {size: 46, weight: 900, align: 'center', alpha: .4 + .6 * on}); K.text(c, s, x + 240, 560, {size: 24, weight: 600, align: 'center', mono: true, color: w, alpha: on});
    if (i < 2) { const q = O(S(t, .8 + i * D * .22, .8 + (i + 1) * D * .22)); K.arrow(c, x + 490, 510, x + 590, 510, w, 6, q, 18); } });
};
const KODE_AI = ["app.get('/api/tiket/:kode', async (req, res) => {", "  const { rows } = await pool.query(", "    'SELECT * FROM tickets WHERE code = $1', [req.params.kode]);", "  const ticket = rows[0];", "  if (!ticket) {", "    return res.json({ error: 'Ticket not found' });", "  }", "  res.json(ticket);", "});"];
AD.cekAI04 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "buatkan endpoint detail tiket"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE_AI, 140, 310, {size: 30, w: 1200, chars: Math.floor(600 * S(t, .8, 3.5))});
  K.pikirkan(c, t, D, 1660, 900);
};
const baris = (c, x, y, nama, kode, w, sorot) => { if (sorot) K.rrect(c, x - 10, y - 26, 980, 52, 8, 'rgba(255,176,32,.16)', C.amber, 2);
  K.text(c, nama, x, y, {size: 28, weight: 600, mono: true}); c.fillStyle = w; c.beginPath(); c.arc(x + 600, y, 11, 0, 7); c.fill();
  K.text(c, kode, x + 625, y, {size: 28, weight: 800, mono: true, color: w}); };
AD.jawab04 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t, C.lime);
  K.rrect(c, 140, 170, 1040, 330, 18, '#f8fafc'); K.text(c, 'Name', 170, 210, {size: 24, weight: 800, color: '#334155'}); K.text(c, 'Status', 770, 210, {size: 24, weight: 800, color: '#334155'});
  c.save(); c.fillStyle = '#334155'; const b0 = (n, k, w, y) => { K.text(c, n, 170, y, {size: 28, weight: 600, mono: true, color: '#0f172a'}); c.fillStyle = w; c.beginPath(); c.arc(780, y, 11, 0, 7); c.fill(); K.text(c, k, 805, y, {size: 28, weight: 800, mono: true, color: '#0f172a'}); };
  b0('tiket/xYz123', '200 OK', '#16a34a', 270); const pb = O(S(t, D * .55, D * .62)); if (pb > 0) { c.globalAlpha = pb; b0('tiket/xYz123', '404 Not Found', '#dc2626', 330); } c.restore();
  K.rrect(c, 160, 400, 1000, 80, 12, '#fee2e2', '#dc2626', 2); K.text(c, '{ "error": "Ticket not found" }', 190, 440, {size: 28, weight: 700, mono: true, color: '#991b1b'});
  const p1 = O(S(t, D * .15, D * .22)); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 1240, 170, 540, 330, 22, 'rgba(255,107,107,.1)', C.coral, 3);
    K.text(c, 'Status 200 = berhasil.', 1280, 230, {size: 30, weight: 900, color: C.coral}); K.text(c, 'Browser, aplikasi lain, dan alat pemantau membaca angkanya, bukan kalimatnya.', 1280, 290, {size: 28, weight: 600, maxW: 470}); c.restore(); }
  const p2 = O(S(t, D * .5, D * .58)); if (p2 > 0) { c.save(); c.globalAlpha = p2;
    K.kode(c, ['if (!ticket) {', "  return res.status(404).json({ error: 'Tiket tidak ditemukan' });", '}'], 140, 600, {size: 32, w: 1640, sorot: [1]}); c.restore(); }
  const p3 = O(S(t, D * .78, D * .85)); if (p3 > 0) K.text(c, 'Status code adalah bagian dari jawaban, bukan hiasan.', 140, 900, {size: 40, weight: 800, color: C.amber, alpha: p3});
};
})();
