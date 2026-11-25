// A05 REST API
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const MW = {GET: C.sky, POST: C.lime, PATCH: C.amber, DELETE: C.coral};
const metode = (c, m, x, y, p = 1) => { c.save(); c.globalAlpha *= p; K.rrect(c, x, y - 26, 140, 52, 12, MW[m]); K.text(c, m, x + 70, y + 1, {size: 26, weight: 900, align: 'center', mono: true, color: '#0e1424'}); c.restore(); };
AD.tabelEndpoint = (c, t, D) => {
  K.bg(c); K.judul(c, 'Merancang alamat API', t, C.violet, 'REST: alamat = kata benda, method = kata kerja');
  // contoh salah
  const ps = O(S(t, D * .2, D * .27)); if (ps > 0) { c.save(); c.globalAlpha = ps; K.rrect(c, 140, 230, 820, 90, 16, 'rgba(255,107,107,.08)', C.coral, 3);
    K.text(c, 'POST /ambilNomorBaru', 180, 275, {size: 34, weight: 700, mono: true, color: C.redup}); K.coret(c, 170, 275, 600, 275, S(t, D * .32, D * .38)); c.restore(); }
  const rows = [['GET', '/api/layanan', 'daftar layanan'], ['POST', '/api/tiket', 'ambil nomor baru'], ['GET', '/api/tiket/:kode', 'lihat tiket'], ['POST', '/api/tiket/:kode/batal', 'batalkan tiket']];
  const f = [.05, .4, .62, .8];
  rows.forEach(([m, a, k], i) => { const p = O(S(t, D * f[i], D * f[i] + .5)); if (p <= 0) return; const y = 420 + i * 130;
    c.save(); c.globalAlpha = p; K.rrect(c, 140, y - 50, 1640, 100, 18, 'rgba(255,255,255,.04)', C.garis, 2); metode(c, m, 180, y);
    K.text(c, a, 360, y, {size: 38, weight: 700, mono: true}); K.text(c, k, 1740, y, {size: 30, weight: 600, align: 'right', color: C.redup}); c.restore(); });
};
AD.crud = (c, t, D) => {
  K.bg(c); K.judul(c, 'CRUD', t, C.amber, 'Empat hal yang dilakukan hampir semua aplikasi');
  const d = [['Create', 'POST'], ['Read', 'GET'], ['Update', 'PATCH'], ['Delete', 'DELETE']];
  d.forEach(([n, m], i) => { const p = O(S(t, D * (.08 + i * .1), D * (.08 + i * .1) + .5)); if (p <= 0) return; const x = 140 + i * 420;
    c.save(); c.globalAlpha = p; K.rrect(c, x, 280, 380, 300, 22, 'rgba(255,255,255,.05)', MW[m], 4);
    K.text(c, n[0], x + 190, 370, {size: 90, weight: 900, align: 'center', color: MW[m]}); K.text(c, n, x + 190, 460, {size: 38, weight: 800, align: 'center'});
    metode(c, m, x + 120, 530); c.restore(); });
  const pc = S(t, D * .58, D * .66); if (pc > 0) { K.coret(c, 1400, 300, 1740, 560, pc); }
  const p2 = O(S(t, D * .66, D * .74)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 900, 660, 880, 230, 22, 'rgba(14,20,36,.94)', C.amber, 4);
    K.text(c, 'Tiket batal tidak dihapus', 940, 720, {size: 34, weight: 900, color: C.amber});
    K.text(c, "UPDATE tickets SET status = 'cancelled'", 940, 790, {size: 28, weight: 600, mono: true});
    K.text(c, 'Datanya penting untuk laporan Pak Rahmat.', 940, 850, {size: 28, weight: 600, color: C.redup}); c.restore(); }
};
AD.saringan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Jangan percaya input dari luar', t, C.coral);
  // corong saringan
  c.save(); c.fillStyle = 'rgba(255,255,255,.06)'; c.strokeStyle = C.teks; c.lineWidth = 5; c.beginPath(); c.moveTo(760, 380); c.lineTo(1160, 380); c.lineTo(1020, 600); c.lineTo(900, 600); c.closePath(); c.fill(); c.stroke();
  for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(800 + i * 40, 390); c.lineTo(800 + i * 40, 410); c.stroke(); } c.restore();
  K.text(c, 'Number.isInteger(x) && x > 0', 960, 340, {size: 28, weight: 700, mono: true, align: 'center', color: C.amber});
  const masuk = [['"abc"', false], ['-5', false], ['(kosong)', false], ['1', true]];
  masuk.forEach(([v, ok], i) => { const a = D * (.12 + i * .18), q = S(t, a, a + D * .14); if (q <= 0) return;
    let x, y; if (q < .5) { x = K.lerp(300, 960, q * 2); y = K.lerp(200, 380, q * 2); } else if (ok) { x = 960; y = K.lerp(380, 820, (q - .5) * 2); } else { x = K.lerp(960, 1500, (q - .5) * 2); y = K.lerp(380, 300 - Math.sin((q - .5) * 2 * Math.PI) * 120, (q - .5) * 2); }
    K.rrect(c, x - 90, y - 34, 180, 68, 34, ok ? C.lime : C.coral); K.text(c, v, x, y + 1, {size: 28, weight: 900, align: 'center', mono: true, color: '#0e1424'}); });
  const p = O(S(t, D * .55, D * .62)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 1240, 620, 540, 140, 20, 'rgba(255,107,107,.1)', C.coral, 3);
    K.text(c, '400 Bad Request', 1280, 670, {size: 32, weight: 900, mono: true, color: C.coral}); K.text(c, 'service_id harus berupa angka', 1280, 720, {size: 26, weight: 600}); c.restore(); }
};
AD.rakNomor = (c, t, D) => {
  K.bg(c); K.judul(c, 'Nomor per layanan, per hari', t, C.teal, 'Besok pagi kembali ke 1');
  const hari = t > D * .62 ? 'Rabu' : 'Selasa', reset = t > D * .62;
  K.rrect(c, 1500, 220, 280, 70, 16, C.amber); K.text(c, hari, 1640, 256, {size: 36, weight: 900, align: 'center', color: '#141a2c'});
  const L = [['A', 'Ganti oli', 7, C.sky], ['B', 'Servis ringan', 4, C.violet], ['C', 'Servis besar', 2, C.teal]];
  L.forEach(([k, n, m, w], i) => { const y = 360 + i * 200; K.rrect(c, 140, y, 300, 150, 18, 'rgba(255,255,255,.05)', w, 4);
    K.text(c, k, 200, y + 75, {size: 80, weight: 900, color: w}); K.text(c, n, 270, y + 75, {size: 26, weight: 700});
    const n2 = reset ? 1 : Math.max(1, Math.min(m, Math.ceil(m * S(t, .3, D * .45))));
    for (let j = 0; j < n2; j++) K.tiketKertas(c, 540 + j * 140, y + 75, `${k}-${String(j + 1).padStart(3, '0')}`, {w: 120, h: 80, rot: (j % 2 ? .03 : -.03)}); });
  const p = O(S(t, D * .75, D * .82)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 1000, 950 - 60, 780, 100, 18, 'rgba(14,20,36,.94)', C.amber, 3);
    K.text(c, "String(7).padStart(3, '0') → \"007\"", 1030, 940, {size: 30, weight: 700, mono: true, color: C.amber}); c.restore(); }
};
AD.tabelError = (c, t, D) => {
  K.bg(c); K.judul(c, 'Error yang jujur', t, C.amber, 'Setiap jenis kesalahan punya kode sendiri');
  const d = [['400', 'Bad Request', 'permintaanmu salah bentuk', C.amber], ['404', 'Not Found', 'yang kamu cari tidak ada', C.amber], ['409', 'Conflict', 'bertabrakan dengan keadaan sekarang', C.amber], ['500', 'Internal Server Error', 'detail dicatat di log, pengguna menerima pesan umum', C.coral]];
  const f = [.1, .25, .38, .6];
  d.forEach(([k, n, s, w], i) => { const p = O(S(t, D * f[i], D * f[i] + .5)); if (p <= 0) return; const y = 300 + i * 160;
    c.save(); c.globalAlpha = p; K.rrect(c, 140, y - 60, 1640, 130, 18, 'rgba(255,255,255,.04)', w, 3);
    K.text(c, k, 180, y + 5, {size: 64, weight: 900, color: w, mono: true}); K.text(c, n, 380, y - 18, {size: 32, weight: 800}); K.text(c, s, 380, y + 30, {size: 28, weight: 600, color: C.redup}); c.restore(); });
};
const KODE = ["app.post('/api/tickets', async (req, res) => {", "  const result = await pool.query('SELECT MAX(number) AS max FROM tickets');", "  const next = (result.rows[0].max || 0) + 1;", "  const ticket = await pool.query(", "    'INSERT INTO tickets (number) VALUES ($1) RETURNING *', [next]);", "  res.json(ticket.rows[0]);", "});"];
AD.cekAI05 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "buatkan API ambil nomor antrean"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE, 140, 310, {size: 28, w: 1500, chars: Math.floor(500 * S(t, .8, 3.5))});
  K.pikirkan(c, t, D, 1660, 900);
};

AD.masalahAI05 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t);
  const b = .42 * D, dua = t >= b;
  K.text(c, 'Perintah: "buatkan API ambil nomor antrean"', 140, 200, {size: 30, weight: 600, color: C.redup});
  K.kode(c, KODE, 140, 240, {size: 28, w: 1500, sorot: dua ? [1, 2, 3, 4] : [1], pSorot: O(S(t, dua ? b : .3, (dua ? b : .3) + .5))});
  const p1 = O(S(t, .6, 1.2));
  if (!dua) {
    c.save(); c.globalAlpha = p1; K.rrect(c, 140, 640, 1500, 150, 18, 'rgba(255,176,32,.08)', C.amber, 3);
    K.text(c, 'Masalah 1: MAX(number) dari SEMUA tiket', 180, 690, {size: 34, weight: 800, color: C.amber});
    K.text(c, 'Tidak ada WHERE layanan dan tanggal, jadi nomor A dan B tercampur dan tidak kembali ke 1 besok pagi.', 180, 745, {size: 28, weight: 600}); c.restore();
  } else {
    const p2 = O(S(t, b + .3, b + 1));
    c.save(); c.globalAlpha = p2; K.text(c, 'Masalah 2: dua orang menekan bersamaan', 140, 680, {size: 34, weight: 800, color: C.coral}); c.restore();
    [['Pelanggan 1', 0], ['Pelanggan 2', 1]].forEach(([n, i]) => {
      const q = O(S(t, b + .6 + i * .4, b + 1.2 + i * .4)); if (q <= 0) return; const y = 760 + i * 120;
      c.save(); c.globalAlpha = q; K.rrect(c, 140, y - 45, 1500, 90, 16, 'rgba(255,255,255,.04)', C.garis, 2);
      K.text(c, n, 180, y, {size: 30, weight: 800});
      K.text(c, 'baca MAX = 6', 520, y, {size: 30, weight: 700, mono: true, color: C.redup});
      K.text(c, '→  simpan nomor 7', 900, y, {size: 30, weight: 800, mono: true, color: C.coral}); c.restore();
    });
    const q = O(S(t, b + 2.2, b + 2.8)); if (q > 0) K.text(c, 'Hasilnya: dua tiket bernomor 7!', 140, 1000, {size: 40, weight: 900, color: C.coral, alpha: q});
  }
};
})();
