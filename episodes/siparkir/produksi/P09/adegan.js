// P09 Tiket dan struk
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const qr = (c, x, y, s) => { c.fillStyle = '#fff'; c.fillRect(x, y, s, s); const n = 21, u = s / n; let z = 7; const acak = () => (z = (z * 1103515245 + 12345) % 2147483648) / 2147483648; c.fillStyle = '#111827';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const sudut = (i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7); if (!sudut && acak() > .52) c.fillRect(x + j * u, y + i * u, u + .5, u + .5); }
  [[0, 0], [0, 14], [14, 0]].forEach(([i, j]) => { c.fillStyle = '#111827'; c.fillRect(x + j * u, y + i * u, 7 * u, 7 * u); c.fillStyle = '#fff'; c.fillRect(x + (j + 1) * u, y + (i + 1) * u, 5 * u, 5 * u); c.fillStyle = '#111827'; c.fillRect(x + (j + 2) * u, y + (i + 2) * u, 3 * u, 3 * u); }); };
const tiket = (c, x, y, w, p) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; const h = 640; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 4, '#fff'); c.shadowColor = 'transparent';
  const T = (s, yy, o = {}) => K.text(c, s, x + w / 2, y + yy, Object.assign({size: 22, weight: 600, mono: true, align: 'center', color: '#111827'}, o));
  T('PARKIR SMK NUSA BAKTI', 44, {weight: 800}); T('Koperasi Sekolah', 76); T('TIKET MASUK', 130); T('P-000027', 176, {size: 38, weight: 900}); qr(c, x + w / 2 - 90, y + 210, 180);
  [['Plat', 'N1234AB'], ['Jenis', 'motor'], ['Area', 'Area Motor'], ['Masuk', '23/11/2026 07:15'], ['Petugas', 'Pak Joko']].forEach(([a, b], i) => { K.text(c, a, x + 28, y + 430 + i * 34, {size: 21, weight: 600, mono: true, color: '#111827'}); K.text(c, b, x + w - 28, y + 430 + i * 34, {size: 21, weight: 600, mono: true, align: 'right', color: '#111827'}); });
  c.restore(); };
// b1: kertas gulung 58 mm
AD.kertas58 = (c, t, D, a) => { K.bg(c); K.judul(c, 'Kertas gulung 58 mm', t, C.sky, 'Ukuran yang umum untuk printer kasir di pos parkir');
  const t1 = kt(a, 1) < 9e8 ? kt(a, 1) : .5, t2 = kt(a, 2), p1 = muncul(t, t1 + .3), p2 = muncul(t, t2);
  // printer
  c.save(); c.globalAlpha = p1; K.rrect(c, 300, 620, 520, 300, 30, '#334155', '#64748b', 4); K.rrect(c, 360, 600, 400, 50, 10, '#1e293b'); K.rrect(c, 700, 820, 70, 40, 10, C.lime); K.text(c, 'printer kasir', 560, 960, {size: 28, weight: 700, align: 'center', color: C.redup});
  K.rrect(c, 410, 250 + (1 - p1) * 300, 300, 372 - (1 - p1) * 300, 2, '#fff'); for (let i = 0; i < 7; i++) { c.fillStyle = '#cbd5e1'; c.fillRect(440, 300 + i * 42, 240 - (i % 3) * 50, 14); }
  c.strokeStyle = C.amber; c.lineWidth = 4; c.beginPath(); c.moveTo(410, 220); c.lineTo(710, 220); c.moveTo(410, 205); c.lineTo(410, 235); c.moveTo(710, 205); c.lineTo(710, 235); c.stroke(); K.text(c, '58 mm', 560, 188, {size: 34, weight: 900, align: 'center', color: C.amber}); c.restore();
  tiket(c, 1080, 240 + (1 - p2) * 30, 420, p2);
  if (p2 > 0) { c.save(); c.globalAlpha = p2; K.text(c, 'Tiket pas di kertas,', 1560, 480, {size: 30, weight: 800}); K.text(c, 'dengan kode QR', 1560, 524, {size: 30, weight: 800, color: C.lime}); c.restore(); }
};
// b8: angka total diganti di alamat
AD.alamatPalsu = (c, t, D, a) => { K.bg(c); K.cekAIjudul(c, t);
  const t1 = kt(a, a.k1) < 9e8 ? kt(a, a.k1) : 6, t2 = kt(a, a.k2), t3 = kt(a, a.k3), t4 = kt(a, a.k4);
  const ganti = t >= 2.2, total = ganti ? '2000' : '8000', fase1 = t < t2;
  if (fase1) { K.browser(c, 200, 180, 1520, 620, 'localhost:8000/struk?plat=N1234AB&lama=7 jam&total=' + total, (c, x, y, w, h) => {
      K.text(c, 'STRUK PARKIR', x + w / 2, y + 80, {size: 34, weight: 800, align: 'center', color: '#0f172a', mono: true}); K.text(c, 'Plat: N1234AB', x + w / 2, y + 170, {size: 32, weight: 600, align: 'center', color: '#0f172a', mono: true});
      K.text(c, 'Lama parkir: 7 jam', x + w / 2, y + 230, {size: 32, weight: 600, align: 'center', color: '#0f172a', mono: true}); K.text(c, 'Total: Rp' + total, x + w / 2, y + 350, {size: 72, weight: 900, align: 'center', color: ganti ? '#dc2626' : '#0f172a', mono: true}); }, muncul(t, .3));
    const pg = muncul(t, 2.2); if (pg > 0) { c.save(); c.globalAlpha = pg; K.rrect(c, 1166, 190, 150, 50, 10, 'rgba(255,107,107,.25)', C.coral, 4); K.text(c, 'diganti di alamat', 1240, 150, {size: 26, weight: 800, align: 'center', color: C.coral}); c.restore(); }
    const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 360, 850, 1200, 130, 22, '#0d1222', C.coral, 4); K.text(c, 'Struk Rp2.000 untuk parkir Rp8.000', 960, 896, {size: 36, weight: 900, align: 'center', color: C.coral}); K.text(c, 'Selisihnya masuk ke saku, dan struknya terlihat resmi.', 960, 946, {size: 27, weight: 600, align: 'center'}); c.restore(); }
    return; }
  K.text(c, 'Aturannya sederhana', 960, 250, {size: 40, weight: 900, align: 'center', alpha: muncul(t, t2)});
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 260, 330, 1400, 160, 24, 'rgba(255,107,107,.12)', C.coral, 5); K.text(c, 'Angka uang tidak boleh berasal dari browser.', 960, 410, {size: 44, weight: 900, align: 'center', color: C.coral}); c.restore(); }
  const p4 = muncul(t, t4); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 260, 560, 1400, 300, 24, 'rgba(163,230,53,.08)', C.lime, 4); K.text(c, 'localhost:8000/parkir/27/struk', 960, 630, {size: 40, weight: 800, mono: true, align: 'center'});
    K.text(c, 'Alamat hanya membawa nomor transaksi.', 960, 720, {size: 32, weight: 700, align: 'center'}); K.text(c, 'Server yang membaca angkanya dari database.', 960, 780, {size: 32, weight: 700, align: 'center', color: C.lime}); c.restore(); }
};
})();
