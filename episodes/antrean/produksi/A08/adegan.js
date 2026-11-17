// A08 Login dan keamanan
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
AD.penggiling = (c, t, D) => {
  K.bg(c); K.judul(c, 'Password disimpan sebagai hash', t, C.amber, 'Fungsi satu arah');
  // mesin
  K.rrect(c, 760, 330, 400, 360, 30, '#1e2a4a', C.violet, 5); c.save(); c.translate(960, 510); c.rotate(t * 2);
  for (let i = 0; i < 6; i++) { c.rotate(Math.PI / 3); K.rrect(c, -12, -110, 24, 90, 8, C.violet); } c.restore();
  K.text(c, 'bcrypt', 960, 740, {size: 34, weight: 900, align: 'center', mono: true, color: C.violet});
  const q = K.clamp(t / (D * .35)); K.rrect(c, K.lerp(120, 520, q), 470, 240, 80, 16, C.sky); K.text(c, 'rahasia123', K.lerp(240, 640, q), 511, {size: 28, weight: 800, mono: true, align: 'center', color: '#0e1424'});
  const p = O(S(t, D * .35, D * .5)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 1220, 470, 580, 80, 16, '#0d1222', C.lime, 3);
    K.text(c, '$2b$10$N9qo8uLOickgx2ZMRZoMye', 1240, 511, {size: 24, weight: 700, mono: true, color: C.lime}); c.restore(); }
  const b = O(S(t, D * .62, D * .7)); if (b > 0) { c.save(); c.globalAlpha = b; c.setLineDash([14, 10]); K.arrow(c, 1400, 620, 520, 620, '#94a3b8', 5, 1, 18); c.setLineDash([]);
    K.coret(c, 880, 580, 1040, 660, S(t, D * .72, D * .8)); K.text(c, 'tidak bisa dibalik', 960, 860, {size: 40, weight: 900, align: 'center', color: C.coral}); c.restore(); }
};
AD.gelang = (c, t, D) => {
  K.bg(c); K.judul(c, 'Sesi dan cookie', t, C.sky, 'HTTP itu pelupa');
  K.orang(c, 300, 760, 280, C.teal); K.text(c, 'Dina', 300, 820, {size: 32, weight: 800, align: 'center'});
  const g = O(S(t, D * .35, D * .45)); if (g > 0) { c.save(); c.globalAlpha = g; K.rrect(c, 330, 560, 120, 40, 20, C.amber); K.text(c, 'sid=7f3a…', 390, 581, {size: 18, weight: 900, mono: true, align: 'center', color: '#0e1424'}); c.restore(); }
  K.serverKotak(c, 1555, 600, .9);
  K.rrect(c, 1390, 230, 330, 130, 18, 'rgba(56,189,248,.08)', C.sky, 3); K.text(c, 'Sesi di server', 1555, 270, {size: 26, weight: 800, align: 'center', color: C.sky});
  K.text(c, '7f3a… → dina, petugas', 1555, 320, {size: 22, weight: 700, align: 'center', mono: true, alpha: g});
  const pintu = ['Panggil', 'Lewati', 'Selesai'];
  pintu.forEach((n, i) => { const p = O(S(t, D * (.55 + i * .1), D * (.6 + i * .1))); if (p <= 0) return; const x = 640 + i * 230;
    c.save(); c.globalAlpha = p; K.rrect(c, x, 520, 180, 260, 12, '#0f172a', '#475569', 4); K.text(c, n, x + 90, 490, {size: 26, weight: 800, align: 'center'});
    K.rrect(c, x + 40, 620, 100, 36, 18, C.amber); K.text(c, 'cookie', x + 90, 639, {size: 18, weight: 900, align: 'center', color: '#0e1424'}); K.centang(c, x + 90, 720, 50, 1); c.restore(); });
};
AD.satpam = (c, t, D) => {
  K.bg(c); K.judul(c, 'Penjaga route', t, C.amber, "wajib('petugas', 'admin')");
  K.orang(c, 960, 700, 300, '#334155', {topi: '#1e293b'}); K.text(c, 'wajib()', 960, 760, {size: 30, weight: 900, align: 'center', mono: true, color: C.amber});
  const p1 = O(S(t, D * .25, D * .33)); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.orang(c, 380, 700, 240, '#94a3b8');
    K.rrect(c, 160, 300, 460, 160, 22, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, '401', 390, 360, {size: 60, weight: 900, align: 'center', color: C.amber});
    K.text(c, 'Kami tidak tahu kamu siapa', 390, 420, {size: 26, weight: 700, align: 'center'}); c.restore(); }
  const p2 = O(S(t, D * .55, D * .63)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.orang(c, 1540, 700, 240, C.teal);
    K.rrect(c, 1300, 300, 480, 160, 22, 'rgba(255,107,107,.1)', C.coral, 4); K.text(c, '403', 1540, 360, {size: 60, weight: 900, align: 'center', color: C.coral});
    K.text(c, 'Kenal, tetapi tidak boleh masuk', 1540, 420, {size: 26, weight: 700, align: 'center'}); c.restore(); }
};
AD.gembokAngka = (c, t, D) => {
  K.bg(c); K.judul(c, 'Pelanggan tanpa akun', t, C.teal, 'Halaman tiket dibuka dengan kode acak');
  const huruf = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789-_', kode = 'kQ7vZ2-mPx9a';
  K.rrect(c, 140, 300, 1640, 110, 20, '#f1f5f9'); K.text(c, 'bengkel.id/tiket.html?kode=', 180, 356, {size: 40, weight: 700, mono: true, color: '#334155'});
  for (let i = 0; i < 12; i++) { const berhenti = D * .2 + i * .25, ch = t > berhenti ? kode[i] : huruf[Math.floor((t * 23 + i * 7) % huruf.length)];
    K.rrect(c, 820 + i * 74, 320, 64, 72, 10, t > berhenti ? 'rgba(45,212,191,.25)' : '#e2e8f0'); K.text(c, ch, 852 + i * 74, 357, {size: 40, weight: 800, mono: true, align: 'center', color: '#0f172a'}); }
  const p = O(S(t, D * .55, D * .62)); if (p > 0) { c.save(); c.globalAlpha = p;
    K.text(c, '64¹² ≈ 4.700.000.000.000.000.000.000 kemungkinan', 960, 560, {size: 44, weight: 900, align: 'center', color: C.amber});
    K.text(c, 'lebih dari empat miliar triliun', 960, 640, {size: 34, weight: 700, align: 'center', color: C.redup}); c.restore(); }
  const q = O(S(t, D * .78, D * .85)); if (q > 0) K.text(c, 'Jauh lebih sulit ditebak daripada password', 960, 820, {size: 40, weight: 800, align: 'center', alpha: q});
};
AD.injeksi = (c, t, D) => {
  K.bg(c); K.judul(c, 'SQL injection', t, C.coral, 'Input yang disambung ke teks query bisa mengubah perintah');
  K.text(c, 'username:', 140, 280, {size: 30, weight: 700, color: C.redup}); K.rrect(c, 330, 245, 420, 70, 12, '#f1f5f9'); K.text(c, "' OR '1'='1", 350, 281, {size: 34, weight: 800, mono: true, color: '#b91c1c'});
  const p1 = O(S(t, D * .15, D * .25)); if (p1 > 0) { c.save(); c.globalAlpha = p1;
    K.kode(c, ["SELECT * FROM users", "WHERE username = '' OR '1'='1'"], 140, 380, {size: 34, w: 900, sorot: [1]});
    K.text(c, 'selalu benar → masuk tanpa password', 1080, 460, {size: 32, weight: 800, color: C.coral}); c.restore(); }
  const p2 = O(S(t, D * .6, D * .68)); if (p2 > 0) { c.save(); c.globalAlpha = p2;
    K.kode(c, ["pool.query('SELECT * FROM users WHERE username = $1',", "           [username])"], 140, 640, {size: 34, w: 1200});
    K.text(c, 'input = data, bukan perintah', 1380, 720, {size: 32, weight: 800, color: C.lime}); K.centang(c, 1340, 720, 50, 1); c.restore(); }
};
const KODE = ["app.get('/tiket/:id', async (req, res) => {", "  const { rows } = await pool.query(", "    'SELECT * FROM tiket_pelanggan WHERE id = $1', [req.params.id]);", "  const t = rows[0];", "  res.send(`<h1>Tiket ${t.label}</h1><p>Nama: ${t.nama}</p><p>HP: ${t.hp}</p>`);", "});"];
AD.cekAI08 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "buatkan halaman untuk pelanggan melihat tiketnya"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE, 140, 310, {size: 26, w: 1640, chars: Math.floor(500 * S(t, .8, 3.5))});
  const p = O(S(t, 3, 3.5)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 140, 640, 700, 80, 14, '#f1f5f9'); K.text(c, 'bengkel.id/tiket/124', 170, 681, {size: 34, weight: 700, mono: true, color: '#334155'}); c.restore(); }
  K.pikirkan(c, t, D, 1660, 900);
};
})();
