const DATA = [['Andi', 80, 75, 85], ['Bunga', 92, 88, 90], ['Citra', 70, 65, 72], ['Dimas', 85, 90, 78], ['Eka', 60, 72, 70], ['Fajar', 78, 80, 82], ['Gita', 88, 85, 94], ['Hana', 75, 70, 79], ['Iqbal', 90, 82, 76], ['Jihan', 82, 79, 85]];
const RATA = DATA.map(r => Math.round((r[1] + r[2] + r[3]) / 3 * 10) / 10);
K.tabel = (c, x, y, rows, o = {}) => { // rows: array of arrays; o.kolW, o.sorotBaris, o.sorotKolom, o.p
  const kw = o.kolW || [200, 190, 130, 150, 160], rh = o.rh || 56, head = o.head || ['Nama', 'Matematika', 'IPA', 'Bahasa', 'Rata-rata'];
  const n = o.kolom || head.length, W = kw.slice(0, n).reduce((a, b) => a + b, 0);
  K.rrect(c, x, y, W, rh * (rows.length + 1) + 8, 14, '#0d1222', K.C.garis, 2);
  let xx = x; head.slice(0, n).forEach((h, j) => { K.text(c, h, xx + kw[j] / 2, y + rh / 2 + 4, {size: 26, weight: 800, align: 'center', color: o.sorotKolom === j ? K.C.amber : K.C.sky}); xx += kw[j]; });
  rows.forEach((r, i) => { const yy = y + rh * (i + 1) + 4, pa = o.pBaris ? o.pBaris(i) : 1; if (pa <= 0) return; c.save(); c.globalAlpha *= pa;
    if (o.sorotBaris && o.sorotBaris.includes(i)) K.rrect(c, x + 6, yy + 3, W - 12, rh - 6, 8, 'rgba(255,176,32,.16)', K.C.amber, 2);
    let xx = x; r.slice(0, n).forEach((v, j) => { K.text(c, String(v), xx + kw[j] / 2, yy + rh / 2, {size: 26, weight: j ? 600 : 700, align: 'center', mono: j > 0, color: o.warnaSel ? o.warnaSel(i, j) : K.C.teks}); xx += kw[j]; });
    c.restore(); });
  return {W, H: rh * (rows.length + 1) + 8, rh};
};
Object.assign(K.adegan, {
  rakKeTabel(c, t, D) {
    K.bg(c); K.judul(c, 'Dari list ke tabel', t, K.C.sky, 'Data yang besar butuh wadah yang lebih rapi');
    const p = K.ease(K.seg(t, 2, 5));
    c.save(); c.globalAlpha = 1 - p; for (let i = 0; i < 3; i++) { K.rrect(c, 300, 300 + i * 170, 700, 140, 16, '#18203a', K.C.garis, 3); K.text(c, String(i), 260, 370 + i * 170, {size: 40, weight: 800, mono: true, color: K.C.amber}); } c.restore();
    c.save(); c.globalAlpha = p; K.tabel(c, 420, 260, DATA.slice(0, 6).map(r => r.slice(0, 4)), {kolom: 4}); c.restore();
  },
  csv(c, t, D) {
    K.bg(c); K.judul(c, 'Tabel dan file CSV', t, K.C.teal, 'Comma separated values: nilai dipisah koma');
    const raw = ['Nama,Matematika,IPA,Bahasa'].concat(DATA.slice(0, 6).map(r => r.join(',')));
    const p1 = K.out(K.seg(t, 1, 2)); c.save(); c.globalAlpha = p1; K.rrect(c, 110, 230, 700, 520, 16, '#0d1222', K.C.garis, 2);
    K.text(c, 'nilai.csv', 140, 270, {size: 26, weight: 700, color: K.C.redup, mono: true});
    const kedip = K.seg(t, D * .35, D * .35 + 1.5);
    raw.forEach((l, i) => { let xx = 140; c.font = `500 30px ${K.M}`; for (const ch of l) { c.fillStyle = ch === ',' ? (kedip > 0 ? K.C.amber : '#e6e9f2') : '#e6e9f2'; c.fillText(ch, xx, 330 + i * 56); xx += c.measureText(ch).width; } });
    c.restore();
    const p2 = K.seg(t, D * .45, D * .45 + 2);
    K.arrow(c, 830, 490, 930, 490, K.C.amber, 6, K.out(p2));
    c.save(); c.globalAlpha = K.out(p2); const tb = K.tabel(c, 950, 230, DATA.slice(0, 6).map(r => r.slice(0, 4)), {kolom: 4, sorotBaris: t > D * .7 ? [1] : [], sorotKolom: t > D * .82 ? 1 : undefined}); c.restore();
    if (t > D * .7) K.text(c, 'baris = satu murid', 1620, 910, {size: 32, weight: 800, align: 'center', color: K.C.amber});
    if (t > D * .82) K.text(c, 'kolom = satu mapel', 1620, 960, {size: 32, weight: 800, align: 'center', color: K.C.amber});
  },
  axis(c, t, D) {
    K.bg(c); K.judul(c, 'Rata-rata: ke samping atau ke bawah?', t, K.C.violet, 'axis=1 per baris, axis=0 per kolom');
    const rows = DATA.slice(0, 6).map((r, i) => r.concat([RATA[i]]));
    const tb = K.tabel(c, 200, 240, rows, {kolom: t > D * .4 ? 5 : 4, warnaSel: (i, j) => j === 4 ? K.C.lime : K.C.teks, pBaris: () => 1});
    const p = K.seg(t, D * .18, D * .4); const yy = 240 + 56 * 2 + 4 + 28;
    if (p > 0) { c.save(); c.globalAlpha = .22 * K.out(p); c.fillStyle = K.C.violet; c.fillRect(205, yy - 26, K.lerp(0, 820, K.ease(p)), 52); c.restore();
      K.arrow(c, 1050, yy, 1050 + 130 * K.ease(p), yy, K.C.violet, 6, K.out(p)); K.text(c, 'axis = 1', 1210, yy, {size: 42, weight: 800, mono: true, color: K.C.violet, alpha: K.out(p)}); K.text(c, 'ke samping: rata-rata satu murid', 1210, yy + 50, {size: 28, weight: 600, color: K.C.redup, alpha: K.out(p)}); }
    const q = K.seg(t, D * .6, D * .82);
    if (q > 0) { const xx = 495; c.save(); c.globalAlpha = .22 * K.out(q); c.fillStyle = K.C.amber; c.fillRect(xx - 80, 262, 160, K.lerp(0, 380, K.ease(q))); c.restore();
      K.arrow(c, xx, 660, xx, 660 + 70 * K.ease(q), K.C.amber, 6, K.out(q));
      K.text(c, '77.5', xx, 770, {size: 40, weight: 800, mono: true, color: K.C.amber, align: 'center', alpha: K.seg(t, D * .75, D * .85)});
      K.text(c, 'axis = 0', 1210, 640, {size: 42, weight: 800, mono: true, color: K.C.amber, alpha: K.out(q)}); K.text(c, 'ke bawah: rata-rata satu mapel', 1210, 690, {size: 28, weight: 600, color: K.C.redup, alpha: K.out(q)}); }
  },
  g_rata(c, t, D, a, r) {
    const p = K.out(K.seg(t, 1, 2)); c.save(); c.globalAlpha = p;
    K.text(c, 'Cek satu baris dengan tangan:', r.x, r.y + 20, {size: 32, weight: 700, color: K.C.redup});
    K.text(c, 'Andi:  (80 + 75 + 85) ÷ 3', r.x, r.y + 100, {size: 46, weight: 700, mono: true}); c.restore();
    const q = K.out(K.seg(t, 3, 4)); K.text(c, '= 80.0  ✓', r.x + 760, r.y + 100, {size: 46, weight: 800, mono: true, color: K.C.lime, alpha: q});
    K.text(c, 'Komputer menghitung 10 murid sekaligus, tanpa salah hitung.', r.x, r.y + 200, {size: 32, weight: 600, color: K.C.teks, alpha: K.out(K.seg(t, 5, 6))});
  },
  saring(c, t, D) {
    K.bg(c); K.judul(c, 'Mengurutkan dan menyaring', t, K.C.coral, 'sort_values dan syarat di dalam kurung siku');
    const rows = DATA.map((r, i) => [r[0], RATA[i]]); const urut = rows.slice().sort((a, b) => b[1] - a[1]);
    const p = K.ease(K.seg(t, 3, 6)); const rh = 52, x = 200, y = 230;
    K.rrect(c, x, y, 420, rh * 11 + 8, 14, '#0d1222', K.C.garis, 2); K.text(c, 'Nama', x + 110, y + 30, {size: 26, weight: 800, align: 'center', color: K.C.sky}); K.text(c, 'Rata-rata', x + 310, y + 30, {size: 26, weight: 800, align: 'center', color: K.C.sky});
    rows.forEach((r, i) => { const j = urut.indexOf(r), yy = y + rh * (1 + K.lerp(i, j, p)) + 4;
      K.text(c, r[0], x + 110, yy + rh / 2, {size: 26, weight: 700, align: 'center'}); K.text(c, r[1].toFixed(1), x + 310, yy + rh / 2, {size: 26, weight: 600, mono: true, align: 'center', color: r[1] < 75 ? K.C.coral : K.C.teks}); });
    K.text(c, 'sort_values(...)', x + 210, y + rh * 11 + 60, {size: 30, weight: 700, mono: true, align: 'center', color: K.C.violet, alpha: K.out(K.seg(t, 2, 3))});
    // saringan
    const q = K.seg(t, D * .5, D * .5 + 1); c.save(); c.globalAlpha = K.out(q);
    const sx = 1000, sy = 420; c.fillStyle = '#26304f'; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 600, sy); c.lineTo(sx + 380, sy + 220); c.lineTo(sx + 220, sy + 220); c.closePath(); c.fill();
    c.strokeStyle = K.C.coral; c.lineWidth = 4; c.stroke(); for (let k = 0; k < 9; k++) { c.beginPath(); c.moveTo(sx + 60 + k * 60, sy + 10); c.lineTo(sx + 230 + k * 18, sy + 210); c.strokeStyle = 'rgba(255,107,107,.3)'; c.lineWidth = 2; c.stroke(); }
    K.text(c, 'Rata-rata < 75', sx + 300, sy - 40, {size: 38, weight: 800, mono: true, align: 'center', color: K.C.coral}); c.restore();
    const lolos = rows.filter(r => r[1] < 75); lolos.forEach((r, i) => { const z = K.seg(t, D * .62 + i * .7, D * .62 + i * .7 + 1.2); if (z <= 0) return;
      const yy = K.lerp(sy + 100, sy + 300 + i * 64, K.ease(z)); K.rrect(c, sx + 180, yy - 26, 240, 52, 10, 'rgba(255,107,107,.15)', K.C.coral, 2);
      K.text(c, r[0] + '  ' + r[1].toFixed(1), sx + 300, yy, {size: 28, weight: 700, mono: true, align: 'center'}); });
  },
  batang(c, t, D) {
    K.bg(c); K.judul(c, 'Dari angka ke grafik batang', t, K.C.lime, 'Semakin tinggi batang, semakin besar nilainya');
    const x0 = 180, y0 = 880, w = 150, H = 7.5;
    c.strokeStyle = K.C.redup; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, 260); c.lineTo(x0, y0); c.lineTo(x0 + 10 * (w + 10) + 20, y0); c.stroke();
    DATA.forEach((r, i) => { const p = K.ease(K.seg(t, 1.5 + i * .35, 2.7 + i * .35)), v = RATA[i], h = (v - 50) * H * p * 1.6, x = x0 + 20 + i * (w + 10);
      c.fillStyle = v < 75 && t > D * .55 ? K.C.coral : K.C.teal; c.fillRect(x, y0 - h, w - 20, h);
      K.text(c, r[0], x + (w - 20) / 2, y0 + 30, {size: 24, weight: 700, align: 'center'});
      if (p > .9) K.text(c, v.toFixed(1), x + (w - 20) / 2, y0 - h - 22, {size: 22, weight: 700, mono: true, align: 'center', color: K.C.redup}); });
    const q = K.seg(t, D * .5, D * .5 + 1.2); if (q > 0) { const yl = y0 - (75 - 50) * H * 1.6; c.save(); c.setLineDash([18, 12]); c.strokeStyle = K.C.coral; c.lineWidth = 5;
      c.beginPath(); c.moveTo(x0, yl); c.lineTo(K.lerp(x0, x0 + 1640, K.ease(q)), yl); c.stroke(); c.restore(); K.text(c, 'batas tuntas 75', x0 + 1480, yl - 26, {size: 28, weight: 800, color: K.C.coral, alpha: K.out(q)}); }
  },
});
