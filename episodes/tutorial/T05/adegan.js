// T05 Kucing vs Anjing: machine learning dengan contoh
K.kucing = (c, x, y, s, warna = '#e8954a') => {
  c.save(); c.translate(x, y); c.scale(s / 100, s / 100); c.fillStyle = warna;
  [-1, 1].forEach(k => { c.beginPath(); c.moveTo(k * 46, -10); c.lineTo(k * 38, -66); c.lineTo(k * 10, -40); c.fill(); });
  c.beginPath(); c.ellipse(0, 0, 50, 44, 0, 0, 7); c.fill();
  c.fillStyle = '#1f2937'; [-1, 1].forEach(k => { c.beginPath(); c.ellipse(k * 18, -4, 5, 8, 0, 0, 7); c.fill(); });
  c.fillStyle = '#f472b6'; c.beginPath(); c.moveTo(-5, 10); c.lineTo(5, 10); c.lineTo(0, 16); c.fill();
  c.strokeStyle = '#1f2937'; c.lineWidth = 2; [-1, 1].forEach(k => [-1, 1].forEach(j => { c.beginPath(); c.moveTo(k * 14, 16); c.lineTo(k * 54, 12 + j * 6); c.stroke(); }));
  c.restore();
};
K.anjing = (c, x, y, s, warna = '#c8915a') => {
  c.save(); c.translate(x, y); c.scale(s / 100, s / 100);
  c.fillStyle = warna; c.beginPath(); c.ellipse(0, 0, 48, 48, 0, 0, 7); c.fill();
  c.fillStyle = '#7c4a24'; [-1, 1].forEach(k => { c.beginPath(); c.ellipse(k * 48, 8, 16, 34, k * .2, 0, 7); c.fill(); });
  c.fillStyle = '#f5e6d3'; c.beginPath(); c.ellipse(0, 22, 26, 20, 0, 0, 7); c.fill();
  c.fillStyle = '#1f2937'; c.beginPath(); c.ellipse(0, 12, 10, 7, 0, 0, 7); c.fill(); [-1, 1].forEach(k => { c.beginPath(); c.ellipse(k * 18, -10, 6, 7, 0, 0, 7); c.fill(); });
  c.fillStyle = '#f472b6'; c.beginPath(); c.ellipse(4, 40, 7, 9, 0, 0, 7); c.fill();
  c.restore();
};
K.kartuFoto = (c, x, y, w, jenis, o = {}) => { // kartu gambar contoh
  const h = w; c.save(); K.rrect(c, x, y, w, h, 12, o.rumput ? '#6fbf5a' : (o.latar || '#eadcc6'), o.garis || null, 3);
  if (!o.rumput) { c.fillStyle = '#b48a62'; c.fillRect(x + 3, y + h * .68, w - 6, h * .32 - 3); }
  else { c.fillStyle = '#9fd3f5'; c.fillRect(x + 3, y + 3, w - 6, h * .4); }
  if (jenis === 'kucing') K.kucing(c, x + w / 2, y + h * .5, w * .55, o.warna); else if (jenis === 'anjing') K.anjing(c, x + w / 2, y + h * .5, w * .5, o.warna);
  else if (jenis === 'sepeda') { c.strokeStyle = '#222'; c.lineWidth = w * .04; [-1, 1].forEach(k => { c.beginPath(); c.arc(x + w / 2 + k * w * .2, y + h * .62, w * .15, 0, 7); c.stroke(); }); c.strokeStyle = '#dc2626'; c.beginPath(); c.moveTo(x + w * .3, y + h * .62); c.lineTo(x + w * .45, y + h * .42); c.lineTo(x + w * .65, y + h * .42); c.lineTo(x + w * .7, y + h * .62); c.stroke(); }
  if (o.label) K.text(c, o.label, x + w / 2, y + h + 26, {size: 24, weight: 800, align: 'center', color: o.warnaLabel || K.C.teks});
  c.restore();
};
K.kotakModel = (c, x, y, w, h, p = 1) => { c.save(); c.globalAlpha = p; K.rrect(c, x, y, w, h, 24, '#1e293b', K.C.violet, 4); K.text(c, 'model', x + w / 2, y + h / 2, {size: 44, weight: 800, align: 'center', color: K.C.violet}); c.restore(); };
const WK = ['#e8954a', '#5b5b63', '#d9d6cf', '#8f8f96', '#c27a45'], WA = ['#c8915a', '#5a3c28', '#e8dcc5', '#2b2b2b', '#e0b878'];
Object.assign(K.adegan, {
  aturan(c, t, D) {
    K.bg(c); K.judul(c, 'Menulis aturan atau memberi contoh?', t, K.C.amber, 'Machine learning belajar dari contoh');
    K.text(c, 'Cara aturan', 470, 220, {size: 38, weight: 800, align: 'center', color: K.C.coral});
    const L = ['if telinga runcing:', '    if badan kecil:', '        if ada kumis:', '            if ...', 'else if ekor panjang:', '    if bukan husky:', '        ...'];
    const n = Math.floor(K.clamp(t / (D * .4)) * L.length);
    K.kode(c, L.slice(0, Math.max(1, n)), 120, 270, {size: 30, w: 700});
    if (t > D * .3) { const p = K.out(K.seg(t, D * .3, D * .38)); c.save(); c.globalAlpha = p * .55; c.strokeStyle = K.C.coral; c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(150 + i * 100, 300 + (i % 3) * 90); c.bezierCurveTo(400, 700 - i * 40, 600, 300 + i * 50, 780 - i * 60, 620); c.stroke(); } c.restore();
      K.text(c, 'Terlalu banyak, dan selalu ada pengecualian', 470, 800, {size: 30, weight: 700, align: 'center', color: K.C.coral, alpha: p}); }
    const q = K.seg(t, D * .45, D * .95);
    if (q > 0) { c.save(); c.globalAlpha = K.out(q * 4);
      K.text(c, 'Cara contoh', 1400, 220, {size: 38, weight: 800, align: 'center', color: K.C.teal});
      for (let i = 0; i < 6; i++) { const jenis = i % 2 ? 'anjing' : 'kucing'; const pi = K.out(K.seg(q, i * .06, i * .06 + .15));
        c.save(); c.globalAlpha *= pi; K.kartuFoto(c, 1050 + (i % 3) * 140, 270 + Math.floor(i / 3) * 170, 110, jenis, {warna: (jenis === 'kucing' ? WK : WA)[i % 5], label: jenis}); c.restore(); }
      const pa = K.out(K.seg(q, .45, .6)); if (pa > 0) K.arrow(c, 1400, 600, 1400, 650, K.C.violet, 6, pa);
      K.kotakModel(c, 1280, 660, 240, 130, K.out(K.seg(q, .45, .6)));
      const pp = K.out(K.seg(q, .75, .95)); if (pp > 0) { K.arrow(c, 1540, 725, 1640, 725, K.C.teal, 6, pp); K.text(c, 'pola', 1700, 725, {size: 40, weight: 800, color: K.C.teal, alpha: pp}); }
      c.restore(); }
  },
  kelas(c, t, D) {
    K.bg(c); K.judul(c, 'Kelas dan label', t, K.C.sky, 'Setiap contoh diberi label kelas yang benar');
    const kr = (x, nama, col) => { K.rrect(c, x, 600, 420, 260, 30, 'rgba(255,255,255,.04)', col, 5); K.text(c, nama, x + 210, 900, {size: 40, weight: 800, align: 'center', color: col}); };
    kr(330, 'Kucing', K.C.amber); kr(1170, 'Anjing', K.C.sky);
    const urut = [['kucing', 0], ['anjing', 1], ['kucing', 0], ['anjing', 1], ['kucing', 0], ['kucing', 1]];
    urut.forEach(([j, b], i) => { const a = 1 + i * (D * .55 / 6), p = K.ease(K.seg(t, a, a + 1.2)); if (p <= 0) return;
      const x0 = 860, y0 = 230, x1 = (b ? 1200 : 360) + (i % 3) * 120, y1 = 640 + (i > 2 ? 60 : 0);
      const x = K.lerp(x0, x1, p), y = K.lerp(y0, y1, p) - Math.sin(p * Math.PI) * 120;
      K.kartuFoto(c, x, y, 110, j, {warna: (j === 'kucing' ? WK : WA)[i % 5]});
      if (i === 5 && t > a + 1.6) { const q = K.out(K.seg(t, a + 1.6, a + 2.2)); c.save(); c.globalAlpha = q; c.strokeStyle = K.C.coral; c.lineWidth = 10; c.beginPath(); c.moveTo(x - 10, y - 10); c.lineTo(x + 120, y + 120); c.moveTo(x + 120, y - 10); c.lineTo(x - 10, y + 120); c.stroke();
        K.text(c, 'Label salah: komputer belajar hal yang salah', K.W / 2, 1000, {size: 34, weight: 800, align: 'center', color: K.C.coral}); c.restore(); } });
  },
  latih(c, t, D) {
    K.bg(c); K.judul(c, 'Training: melihat contoh berkali-kali', t, K.C.violet, 'Satu putaran melihat semua gambar = satu epoch');
    K.kotakModel(c, 560, 420, 300, 170, 1);
    for (let i = 0; i < 8; i++) { const ph = ((t * .9 + i / 8) % 1), ang = ph * Math.PI * 2; const x = 710 + Math.cos(ang) * 330 - 45, y = 505 + Math.sin(ang) * 230 - 45;
      K.kartuFoto(c, x, y, 90, i % 2 ? 'anjing' : 'kucing', {warna: (i % 2 ? WA : WK)[i % 5]}); }
    const ep = Math.min(50, Math.floor(K.clamp(t / (D * .85)) * 50));
    K.text(c, `epoch ${ep}`, 710, 860, {size: 44, weight: 800, mono: true, align: 'center', color: K.C.amber});
    const gx = 1150, gy = 280, gw = 620, gh = 460; K.rrect(c, gx, gy, gw, gh, 18, '#0d1222', K.C.garis, 2);
    K.text(c, 'kesalahan', gx + 20, gy + 30, {size: 26, weight: 700, color: K.C.redup}); K.text(c, 'epoch', gx + gw - 20, gy + gh - 20, {size: 26, weight: 700, align: 'right', color: K.C.redup});
    c.strokeStyle = K.C.coral; c.lineWidth = 5; c.beginPath();
    for (let e = 0; e <= ep; e++) { const v = .9 * Math.exp(-e / 9) + .05 + .03 * Math.sin(e * 1.7); const x = gx + 40 + e / 50 * (gw - 80), y = gy + gh - 50 - (gh - 110) * v; e ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
  },
  keyakinan(c, t, D) {
    K.bg(c); K.judul(c, 'Data uji dan tingkat keyakinan', t, K.C.teal, 'Gambar yang belum pernah dilihat model');
    const p = K.out(K.seg(t, .5, 1.5)); c.save(); c.globalAlpha = p; K.rrect(c, 220, 260, 460, 560, 24, '#f8fafc');
    K.text(c, 'UJIAN', 450, 310, {size: 34, weight: 800, align: 'center', color: '#0f172a'}); K.kartuFoto(c, 290, 360, 320, 'kucing', {warna: '#5b5b63'});
    K.text(c, 'belum pernah dilihat', 450, 760, {size: 26, weight: 700, align: 'center', color: '#475569'}); c.restore();
    const q = K.ease(K.seg(t, D * .45, D * .7));
    if (q > 0) { const bar = (y, nama, nilai, col) => { K.text(c, nama, 820, y, {size: 40, weight: 800, color: col}); K.rrect(c, 1040, y - 30, 640, 60, 12, 'rgba(255,255,255,.06)');
        K.rrect(c, 1040, y - 30, Math.max(14, 640 * nilai / 100 * q), 60, 12, col); K.text(c, `${Math.round(nilai * q)}%`, 1700, y, {size: 40, weight: 800, mono: true, color: col}); };
      bar(420, 'Kucing', 96, K.C.amber); bar(540, 'Anjing', 4, K.C.sky);
      const r2 = K.out(K.seg(t, D * .75, D * .85)); K.text(c, '96% + 4% = 100%', 1360, 690, {size: 44, weight: 800, mono: true, align: 'center', color: K.C.teal, alpha: r2}); }
  },
  bias(c, t, D) {
    K.bg(c); K.judul(c, 'Bias data', t, K.C.coral, 'Model bisa belajar dari hal yang salah');
    K.text(c, 'Contoh anjing', 420, 230, {size: 32, weight: 800, align: 'center', color: K.C.sky}); K.text(c, 'Contoh kucing', 420, 560, {size: 32, weight: 800, align: 'center', color: K.C.amber});
    for (let i = 0; i < 4; i++) { const p = K.out(K.seg(t, .5 + i * .3, 1 + i * .3)); c.save(); c.globalAlpha = p; K.kartuFoto(c, 110 + i * 160, 270, 140, 'anjing', {rumput: true, warna: WA[i]}); K.kartuFoto(c, 110 + i * 160, 600, 140, 'kucing', {warna: WK[i]}); c.restore(); }
    const s = K.out(K.seg(t, D * .3, D * .4)); if (s > 0) { c.save(); c.globalAlpha = s; K.rrect(c, 95, 255, 650, 170, 18, null, '#22c55e', 6); K.text(c, 'semuanya di rumput hijau', 420, 470, {size: 28, weight: 800, align: 'center', color: '#4ade80'}); c.restore(); }
    const q = K.out(K.seg(t, D * .5, D * .6)); if (q > 0) { c.save(); c.globalAlpha = q; K.arrow(c, 800, 520, 900, 520, K.C.teks, 5, 1);
      K.kartuFoto(c, 940, 330, 380, 'kucing', {rumput: true, warna: '#e8954a'}); K.text(c, 'kucing di rumput', 1130, 750, {size: 30, weight: 700, align: 'center', color: K.C.redup}); c.restore(); }
    const w = K.out(K.seg(t, D * .62, D * .72)); if (w > 0) { c.save(); c.globalAlpha = w; K.rrect(c, 1400, 430, 380, 150, 20, 'rgba(255,107,107,.15)', K.C.coral, 4);
      K.text(c, 'Tebakan model:', 1590, 475, {size: 28, weight: 700, align: 'center', color: K.C.redup}); K.text(c, 'Anjing', 1590, 530, {size: 50, weight: 800, align: 'center', color: K.C.coral}); c.restore(); }
    const z = K.out(K.seg(t, D * .78, D * .88)); if (z > 0) K.text(c, 'Model mengira warna hijau berarti anjing', K.W / 2, 930, {size: 36, weight: 800, align: 'center', color: K.C.coral, alpha: z});
  },
});
K.ikonContoh = (c, x, y, s) => { K.kartuFoto(c, x - s * .45, y - s * .45, s * .9, 'kucing'); };
K.ikonKeranjang = (c, x, y, s, w) => { K.rrect(c, x - s * .45, y - s * .1, s * .9, s * .5, s * .08, null, w, s * .05); K.anjing(c, x, y - s * .1, s * .4); };
K.ikonGrafik = (c, x, y, s, w) => { c.strokeStyle = w; c.lineWidth = s * .05; c.beginPath(); c.moveTo(x - s * .4, y - s * .35); c.lineTo(x - s * .4, y + s * .35); c.lineTo(x + s * .4, y + s * .35); c.stroke(); c.beginPath(); c.moveTo(x - s * .35, y - s * .25); c.quadraticCurveTo(x - s * .15, y + s * .25, x + s * .35, y + s * .25); c.stroke(); };
K.ikonBar = (c, x, y, s, w) => { K.rrect(c, x - s * .4, y - s * .25, s * .7, s * .16, s * .04, w); K.rrect(c, x - s * .4, y + s * .05, s * .15, s * .16, s * .04, w); };
K.ikonRumput = (c, x, y, s) => { K.kartuFoto(c, x - s * .45, y - s * .45, s * .9, 'anjing', {rumput: true}); };
