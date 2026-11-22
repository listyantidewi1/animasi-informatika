// A07 Reservasi slot
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const parkir = (c, x, y, isi, warna) => { K.rrect(c, x, y, 230, 300, 14, 'rgba(255,255,255,.03)', '#94a3b8', 4); c.setLineDash([]);
  if (isi) K.motor(c, x + 115, y + 250, 190, warna); };
AD.slotKuota = (c, t, D) => {
  K.bg(c); K.judul(c, 'Slot dan kuota', t, C.teal, 'Satu slot = satu jadwal untuk satu layanan');
  const p = O(S(t, .3, 1)); c.save(); c.globalAlpha = p;
  K.rrect(c, 140, 260, 640, 420, 26, 'rgba(45,212,191,.06)', C.teal, 4);
  K.text(c, 'Servis besar', 190, 330, {size: 36, weight: 800, color: C.teal}); K.text(c, 'Sabtu', 190, 430, {size: 60, weight: 900}); K.text(c, '09.00 WIB', 190, 520, {size: 70, weight: 900, color: C.amber});
  K.text(c, 'kuota: 2', 190, 620, {size: 40, weight: 800, mono: true}); c.restore();
  const q = O(S(t, D * .4, D * .5)); c.save(); c.globalAlpha = q; parkir(c, 960, 320, t > D * .55, C.coral); parkir(c, 1240, 320, t > D * .7, C.sky);
  K.text(c, 'dua mekanik = dua tempat', 1200, 700, {size: 34, weight: 700, align: 'center', color: C.redup});
  K.orang(c, 1075, 300, 120, C.teal, {topi: C.amber}); K.orang(c, 1355, 300, 120, C.violet, {topi: C.amber}); c.restore();
};
const jam = (c, x, y, r, h, m, warna, nama, sub) => { c.strokeStyle = warna; c.lineWidth = 8; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; c.lineWidth = 4; c.beginPath(); c.moveTo(x + Math.sin(a) * r * .85, y - Math.cos(a) * r * .85); c.lineTo(x + Math.sin(a) * r * .95, y - Math.cos(a) * r * .95); c.stroke(); }
  const ah = ((h % 12) + m / 60) / 12 * Math.PI * 2, am = m / 60 * Math.PI * 2; c.lineCap = 'round';
  c.lineWidth = 10; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(ah) * r * .5, y - Math.cos(ah) * r * .5); c.stroke();
  c.lineWidth = 6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(am) * r * .78, y - Math.cos(am) * r * .78); c.stroke();
  K.text(c, nama, x, y + r + 60, {size: 36, weight: 800, align: 'center'}); K.text(c, sub, x, y + r + 110, {size: 30, weight: 700, align: 'center', color: warna}); };
AD.duaKota = (c, t, D) => {
  K.bg(c); K.judul(c, 'Zona waktu', t, C.amber, 'Saat yang sama, jam dinding berbeda');
  jam(c, 480, 470, 170, 8, 0, C.sky, 'Jakarta', '08.00 WIB'); jam(c, 1440, 470, 170, 9, 0, C.violet, 'Makassar', '09.00 WITA');
  K.arrow(c, 700, 470, 1220, 470, '#64748b', 5, O(S(t, .5, 1.2))); K.text(c, 'saat yang sama', 960, 430, {size: 28, weight: 700, align: 'center', color: C.redup});
  const p = O(S(t, D * .4, D * .48)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 520, 840, 880, 110, 24, '#0d1222', C.amber, 4);
    K.text(c, "'2026-11-21 09:00+07'", 960, 896, {size: 44, weight: 800, mono: true, align: 'center', color: C.amber}); c.restore(); }
  const q = O(S(t, D * .75, D * .82)); if (q > 0) K.text(c, 'Tanpa zona waktu: datang satu jam terlambat', 960, 1010, {size: 32, weight: 800, align: 'center', color: C.coral, alpha: q});
};
AD.duaHP = (c, t, D) => {
  K.bg(c); K.judul(c, 'Apa yang bisa salah?', t, C.coral, 'Slot Sabtu 09.00 tinggal satu tempat');
  const tekan = t > D * .4, layar = (nama) => (c, x, y, w, h) => { K.text(c, 'Sabtu 09.00', x + w / 2, y + 60, {size: 26, weight: 800, align: 'center', color: '#0f172a'});
    K.text(c, 'sisa 1', x + w / 2, y + 130, {size: 44, weight: 900, align: 'center', color: '#16a34a'});
    K.rrect(c, x + 20, y + 200, w - 40, 64, 14, tekan ? '#1e40af' : '#2563eb'); K.text(c, 'Pesan', x + w / 2, y + 233, {size: 28, weight: 800, align: 'center', color: '#fff'});
    K.text(c, nama, x + w / 2, y + h - 40, {size: 22, weight: 600, align: 'center', color: '#64748b'}); };
  K.hp(c, 160, 260, 260, 480, layar('Pelanggan 1')); K.hp(c, 480, 260, 260, 480, layar('Pelanggan 2'));
  if (tekan && t < D * .5) { c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(290, 506, 30, 0, 7); c.arc(610, 506, 30, 0, 7); c.fill(); }
  const p = O(S(t, D * .55, D * .65)); if (p > 0) { c.save(); c.globalAlpha = p;
    K.rrect(c, 900, 300, 880, 440, 22, 'rgba(255,107,107,.06)', C.coral, 4); K.text(c, 'Sabtu 09.00', 1340, 350, {size: 32, weight: 800, align: 'center', color: C.coral});
    parkir(c, 960, 400, true, C.coral); parkir(c, 1240, 400, true, C.sky); K.motor(c, 1600, 700, 190, C.lime);
    K.text(c, '3 motor, 2 mekanik', 1340, 800, {size: 40, weight: 900, align: 'center', color: C.coral}); c.restore(); }
};
AD.uniqueKunci = (c, t, D) => {
  K.bg(c); K.judul(c, 'Kenapa bukan UNIQUE?', t, C.amber);
  const p1 = O(S(t, .3, .9)); K.kartu(c, 140, 260, 780, 420, 'Kuota 1', 'Cukup UNIQUE (slot_id): baris kedua langsung ditolak.', {p: p1, warna: C.lime});
  const p2 = O(S(t, D * .35, D * .45)); K.kartu(c, 1000, 260, 780, 420, 'Kuota 2 atau lebih', 'UNIQUE tidak bisa menghitung sampai dua. Perlu transaksi dan kunci.', {p: p2, warna: C.amber});
  const p3 = O(S(t, D * .72, D * .8)); if (p3 > 0) K.text(c, 'Kembali ke pola bab 6', 960, 800, {size: 44, weight: 900, align: 'center', color: C.amber, alpha: p3});
};
AD.jadiTiket = (c, t, D) => {
  K.bg(c); K.judul(c, 'Check-in', t, C.teal, 'Pemesanan berubah menjadi tiket, dalam satu transaksi');
  const q = K.ease(S(t, D * .25, D * .6));
  c.save(); c.globalAlpha = 1 - q; K.rrect(c, 260, 330, 560, 340, 24, '#f8fafc'); K.text(c, 'PEMESANAN', 540, 390, {size: 28, weight: 900, align: 'center', color: '#334155'});
  K.text(c, 'Sabtu 09.00 · Servis besar', 540, 460, {size: 30, weight: 700, align: 'center', color: '#0f172a'}); K.text(c, 'kode: Xc9pQ2', 540, 530, {size: 32, weight: 800, align: 'center', mono: true, color: '#0f172a'});
  K.text(c, 'booked → checked_in', 540, 610, {size: 28, weight: 700, align: 'center', color: '#0d9488'}); c.restore();
  K.arrow(c, 860, 500, 1060, 500, C.teal, 6, O(S(t, D * .2, D * .4)));
  if (q > 0) K.tiketKertas(c, 1400, 500, 'C-001', {w: 400 * (.6 + .4 * q), h: 240 * (.6 + .4 * q), alpha: q});
  const p = O(S(t, D * .7, D * .78)); if (p > 0) K.text(c, "WHERE status = 'booked': kode tidak bisa dipakai dua kali", 960, 860, {size: 34, weight: 800, align: 'center', color: C.amber, alpha: p});
};
const KODE = ["app.post('/api/booking', async (req, res) => {", "  const { slot_id, name, phone } = req.body;", "  const slot = await pool.query('SELECT quota FROM slots WHERE id = $1', [slot_id]);", "  const count = await pool.query('SELECT count(*) FROM bookings WHERE slot_id = $1', [slot_id]);", "  if (count.rows[0].count < slot.rows[0].quota) {", "    await pool.query('INSERT INTO bookings ...', [...]);", "    return res.status(201).json({ ok: true });", "  }", "  res.status(409).json({ error: 'Slot full' });", "});"];
AD.cekAI07 = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  K.text(c, 'Perintah: "buatkan fitur booking dengan kuota"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  K.kode(c, KODE, 140, 310, {size: 26, w: 1640, chars: Math.floor(700 * S(t, .8, 3.5))});
  K.pikirkan(c, t, D, 1660, 900);
};
AD.celah = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t, C.lime); K.text(c, 'Periksa dulu, baru simpan: ada celah', 140, 200, {size: 40, weight: 900, color: C.coral});
  [['Pemesan 1', 360, C.sky], ['Pemesan 2', 620, C.pink]].forEach(([n, y, w], j) => { K.text(c, n, 140, y, {size: 30, weight: 800, color: w});
    c.strokeStyle = '#475569'; c.lineWidth = 4; c.beginPath(); c.moveTo(380, y); c.lineTo(1780, y); c.stroke();
    const p1 = O(S(t, .4 + j * .5, 1 + j * .5)), p2 = O(S(t, 2 + j * .5, 2.6 + j * .5));
    if (p1 > 0) { K.rrect(c, 480 + j * 120, y - 32, 260, 64, 32, w); K.text(c, 'hitung: 1 < 2', 610 + j * 120, y + 1, {size: 26, weight: 800, mono: true, align: 'center', color: '#0e1424'}); }
    if (p2 > 0) { K.rrect(c, 1200 + j * 120, y - 32, 220, 64, 32, j ? C.coral : w); K.text(c, 'simpan', 1310 + j * 120, y + 1, {size: 26, weight: 800, mono: true, align: 'center', color: '#0e1424'}); } });
  const pc = O(S(t, 1.6, 2.2)); if (pc > 0) { c.save(); c.globalAlpha = pc * .9; c.fillStyle = 'rgba(255,107,107,.18)'; c.fillRect(860, 280, 320, 420); c.strokeStyle = C.coral; c.lineWidth = 3; c.strokeRect(860, 280, 320, 420);
    K.text(c, 'celah', 1020, 740, {size: 34, weight: 900, align: 'center', color: C.coral}); c.restore(); }
  const p = O(S(t, D * .55, D * .62)); if (p > 0) K.text(c, 'Tanyakan: bagaimana kalau dua orang melakukannya bersamaan?', 960, 880, {size: 36, weight: 800, align: 'center', color: C.amber, alpha: p});
};
})();
