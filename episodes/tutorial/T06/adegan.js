// T06 AI Penebak Kelulusan: fitur & label, data latih/uji, pohon keputusan, akurasi, batas model, overfitting
const LU = '#60a5fa', BE = '#fb923c'; // Lulus biru, Belum oranye (sama dengan warna plot_tree)
K.murid = (c, x, y, s, warna, o = {}) => { // kartu murid kecil, (x,y) = pojok kiri atas, s = lebar
  const h = s * 1.25; c.save(); c.globalAlpha *= (o.alpha ?? 1);
  K.rrect(c, x, y, s, h, s * .14, o.isi || '#1e2a4a', warna, Math.max(2, s * .05));
  c.fillStyle = warna; c.beginPath(); c.arc(x + s / 2, y + h * .36, s * .17, 0, 7); c.fill();
  c.beginPath(); c.ellipse(x + s / 2, y + h * .8, s * .3, s * .2, 0, Math.PI, 0); c.fill();
  c.restore();
};
K.kucingKecil = (c, x, y, s, warna = '#e8954a') => { c.save(); c.translate(x, y); c.scale(s / 100, s / 100); c.fillStyle = warna;
  [-1, 1].forEach(k => { c.beginPath(); c.moveTo(k * 46, -10); c.lineTo(k * 38, -66); c.lineTo(k * 10, -40); c.fill(); });
  c.beginPath(); c.ellipse(0, 0, 50, 44, 0, 0, 7); c.fill(); c.fillStyle = '#1f2937'; [-1, 1].forEach(k => { c.beginPath(); c.ellipse(k * 18, -4, 5, 8, 0, 0, 7); c.fill(); }); c.restore(); };
K.anjingKecil = (c, x, y, s, warna = '#c8915a') => { c.save(); c.translate(x, y); c.scale(s / 100, s / 100);
  c.fillStyle = warna; c.beginPath(); c.ellipse(0, 0, 48, 48, 0, 0, 7); c.fill(); c.fillStyle = '#7c4a24'; [-1, 1].forEach(k => { c.beginPath(); c.ellipse(k * 48, 8, 16, 34, k * .2, 0, 7); c.fill(); });
  c.fillStyle = '#f5e6d3'; c.beginPath(); c.ellipse(0, 22, 26, 20, 0, 0, 7); c.fill(); c.fillStyle = '#1f2937'; c.beginPath(); c.ellipse(0, 12, 10, 7, 0, 0, 7); c.fill();
  [-1, 1].forEach(k => { c.beginPath(); c.ellipse(k * 18, -10, 6, 7, 0, 0, 7); c.fill(); }); c.restore(); };
// simpul pohon: kotak pertanyaan atau daun
K.simpul = (c, cx, cy, teks, o = {}) => {
  const size = o.size || 34, w = K.lebar(c, teks, size, 800) + 60, h = size * 2.1, p = o.p ?? 1; if (p <= 0) return {w, h};
  c.save(); c.globalAlpha *= K.out(p); const s = K.lerp(.8, 1, K.back(p)); c.translate(cx, cy); c.scale(s, s);
  K.rrect(c, -w / 2, -h / 2, w, h, o.daun ? h / 2 : 16, o.isi || '#16203a', o.warna || K.C.teks, o.lw || 4);
  K.text(c, teks, 0, 2, {size, weight: 800, align: 'center', color: o.warnaTeks || o.warna || K.C.teks}); c.restore(); return {w, h};
};
K.cabang = (c, x1, y1, x2, y2, label, p, warna = K.C.garis, aktif = false) => {
  if (p <= 0) return; c.save(); c.strokeStyle = aktif ? K.C.amber : warna; c.lineWidth = aktif ? 8 : 5; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(K.lerp(x1, x2, K.out(p)), K.lerp(y1, y2, K.out(p))); c.stroke();
  if (label) K.text(c, label, (x1 + x2) / 2 + (x2 > x1 ? 34 : -34), (y1 + y2) / 2 - 10, {size: 28, weight: 800, align: 'center', color: aktif ? K.C.amber : K.C.redup, alpha: K.out(p)});
  c.restore();
};
const DATA5 = [[10, 79, 63, 'Lulus'], [4, 68, 51, 'Belum'], [4, 74, 55, 'Belum'], [5, 76, 89, 'Lulus'], [2, 97, 86, 'Lulus']];
// 60 murid: 40 Lulus, 20 Belum, urutan acak tetap
const SEMUA = (() => { const a = []; let s = 7; for (let i = 0; i < 60; i++) { s = (s * 9301 + 49297) % 233280; a.push(i % 3 === 2 ? 'B' : 'L'); } return a; })();
const UJI = new Set([3, 8, 14, 19, 23, 27, 33, 38, 42, 47, 51, 56]);
Object.assign(K.adegan, {
  pengingat(c, t, D) {
    K.bg(c); K.judul(c, 'Dua hal yang sudah kamu kenal', t, K.C.amber);
    const p1 = K.out(K.seg(t, .6, 1.4)), p2 = K.out(K.seg(t, D * .35, D * .35 + .8)), p3 = K.out(K.seg(t, D * .7, D * .7 + .8));
    K.panel(c, 140, 230, 760, 560, p1, K.C.sky); K.panel(c, 1020, 230, 760, 560, p2, K.C.violet);
    c.save(); c.globalAlpha = p1; K.text(c, 'Tabel data (pandas)', 520, 300, {size: 38, weight: 800, align: 'center', color: K.C.sky});
    const kol = ['Nama', 'MTK', 'IPA'], isi = [['Andi', 80, 75], ['Bunga', 92, 88], ['Citra', 70, 65], ['Dimas', 85, 90]];
    kol.forEach((k, j) => K.text(c, k, 250 + j * 220, 380, {size: 30, weight: 800, color: K.C.redup}));
    isi.forEach((r, i) => { c.fillStyle = i % 2 ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.07)'; c.fillRect(210, 410 + i * 66, 620, 62);
      r.forEach((v, j) => K.text(c, String(v), 250 + j * 220, 442 + i * 66, {size: 32, weight: 600, mono: j > 0})); });
    K.text(c, 'episode nilai rapor', 520, 740, {size: 28, weight: 600, align: 'center', color: K.C.redup}); c.restore();
    c.save(); c.globalAlpha = p2; K.text(c, 'Belajar dari contoh', 1400, 300, {size: 38, weight: 800, align: 'center', color: K.C.violet});
    for (let i = 0; i < 6; i++) { const x = 1150 + (i % 3) * 170, y = 390 + Math.floor(i / 3) * 170; K.rrect(c, x, y, 140, 140, 14, '#eadcc6');
      (i % 2 ? K.anjingKecil : K.kucingKecil)(c, x + 70, y + 76, 70); }
    K.text(c, 'episode kucing dan anjing', 1400, 740, {size: 28, weight: 600, align: 'center', color: K.C.redup}); c.restore();
    if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, '+', 960, 510, {size: 90, weight: 800, align: 'center', color: K.C.amber});
      K.rrect(c, 560, 850, 800, 100, 50, 'rgba(255,176,32,.15)', K.C.amber, 4); K.text(c, 'Model dari data tabel', 960, 901, {size: 42, weight: 800, align: 'center', color: K.C.amber}); c.restore(); }
  },
  fitur(c, t, D) {
    K.bg(c); K.judul(c, 'Fitur dan label', t, K.C.teal, 'Satu baris = satu murid');
    const kol = ['jam_belajar', 'kehadiran', 'nilai_tugas', 'lulus'], X0 = 260, CW = [330, 300, 320, 260], Y0 = 330, RH = 74;
    const xs = []; let xx = X0; CW.forEach(w => { xs.push(xx); xx += w; });
    const p = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p;
    kol.forEach((k, j) => K.text(c, k, xs[j] + 20, Y0, {size: 32, weight: 800, mono: true, color: K.C.redup}));
    DATA5.forEach((r, i) => { const y = Y0 + 40 + i * RH; c.fillStyle = i % 2 ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.07)'; c.fillRect(X0, y, xx - X0, RH - 6);
      r.forEach((v, j) => K.text(c, String(v), xs[j] + 20, y + RH / 2 - 3, {size: 34, weight: 600, mono: true, color: j === 3 ? (v === 'Lulus' ? LU : BE) : K.C.teks})); });
    c.restore();
    // satu baris = satu murid
    const pr = K.out(K.seg(t, D * .12, D * .2)) * (1 - K.out(K.seg(t, D * .3, D * .34)));
    if (pr > 0) { c.save(); c.globalAlpha = pr; K.rrect(c, X0 - 10, Y0 + 34, xx - X0 + 20, RH + 6, 12, null, K.C.amber, 5); K.murid(c, X0 - 120, Y0 + 30, 70, K.C.amber); c.restore(); }
    // fitur
    const pf = K.out(K.seg(t, D * .3, D * .4)); const yb = Y0 + 40 + 5 * RH + 20;
    if (pf > 0) { c.save(); c.globalAlpha = pf; K.rrect(c, xs[0] - 4, Y0 - 34, xs[3] - xs[0] - 8, yb - Y0 + 14, 16, 'rgba(45,212,191,.08)', K.C.teal, 5);
      K.text(c, 'fitur (X): petunjuk yang boleh dilihat model', (xs[0] + xs[3]) / 2, yb + 50, {size: 34, weight: 800, align: 'center', color: K.C.teal}); c.restore(); }
    const pl = K.out(K.seg(t, D * .5, D * .6));
    if (pl > 0) { c.save(); c.globalAlpha = pl; K.rrect(c, xs[3] + 4, Y0 - 34, CW[3] - 8, yb - Y0 + 14, 16, 'rgba(167,139,250,.1)', K.C.violet, 5);
      K.text(c, 'label (y)', xs[3] + CW[3] / 2, yb + 50, {size: 34, weight: 800, align: 'center', color: K.C.violet});
      K.text(c, 'jawaban yang ditebak', xs[3] + CW[3] / 2, yb + 95, {size: 26, weight: 600, align: 'center', color: K.C.redup}); c.restore(); }
    const pk = K.out(K.seg(t, D * .74, D * .84));
    if (pk > 0) { c.save(); c.globalAlpha = pk; const y = 960; K.rrect(c, 420, y - 60, 120, 120, 14, '#eadcc6'); K.kucingKecil(c, 480, y + 6, 60);
      K.text(c, 'fitur = gambar', 570, y, {size: 34, weight: 800, color: K.C.teal}); K.arrow(c, 860, y, 960, y, K.C.teks, 5, 1);
      K.text(c, 'label = "Kucing"', 990, y, {size: 34, weight: 800, color: K.C.violet}); K.text(c, '(episode sebelumnya)', 1330, y, {size: 28, weight: 600, color: K.C.redup}); c.restore(); }
  },
  bagi(c, t, D) {
    K.bg(c); K.judul(c, 'Sisihkan data uji', t, K.C.amber, '80% untuk latihan, 20% untuk ujian');
    const pin = K.out(K.seg(t, .3, 1.2)), pm = K.ease(K.seg(t, D * .3, D * .55));
    const s = 64; let iL = 0, iU = 0;
    // kotak tujuan
    const pk = K.out(K.seg(t, D * .28, D * .4));
    if (pk > 0) { c.save(); c.globalAlpha = pk;
      K.rrect(c, 120, 300, 1080, 640, 26, 'rgba(255,255,255,.03)', K.C.teal, 4); K.text(c, 'LATIHAN  48 murid (80%)', 660, 980, {size: 36, weight: 800, align: 'center', color: K.C.teal});
      K.rrect(c, 1300, 360, 500, 520, 26, '#f1e4c8', '#c9a86a', 5); c.fillStyle = '#e2cfa6'; c.beginPath(); c.moveTo(1300, 360); c.lineTo(1550, 560); c.lineTo(1800, 360); c.fill();
      K.text(c, 'UJIAN  12 murid (20%)', 1550, 920, {size: 36, weight: 800, align: 'center', color: K.C.amber}); c.restore(); }
    SEMUA.forEach((k, i) => {
      const x0 = 300 + (i % 15) * 88, y0 = 380 + Math.floor(i / 15) * 120; let x1, y1;
      if (UJI.has(i)) { x1 = 1350 + (iU % 4) * 104; y1 = 420 + Math.floor(iU / 4) * 140; iU++; } else { x1 = 170 + (iL % 12) * 84; y1 = 340 + Math.floor(iL / 12) * 140; iL++; }
      const p = UJI.has(i) ? pm : K.ease(K.seg(t, D * .25, D * .45));
      c.save(); c.globalAlpha = pin; K.murid(c, K.lerp(x0, x1, p), K.lerp(y0, y1, p) - Math.sin(p * Math.PI) * (UJI.has(i) ? 80 : 0), s, k === 'L' ? LU : BE); c.restore();
    });
    const pg = K.out(K.seg(t, D * .7, D * .8));
    if (pg > 0) { c.save(); c.globalAlpha = pg; K.rrect(c, 360, 170, 1200, 90, 45, 'rgba(255,176,32,.12)', K.C.amber, 3);
      K.text(c, 'Soal ujian tidak sama persis dengan soal latihan', 960, 216, {size: 36, weight: 700, align: 'center', color: K.C.amber}); c.restore(); }
  },
  pohon(c, t, D) {
    K.bg(c); K.judul(c, 'Pohon keputusan', t, K.C.teal, 'Rangkaian if dan else yang disusun komputer dari data');
    const pk = K.out(K.seg(t, .5, 1.3));
    c.save(); c.globalAlpha = pk; K.kode(c, ['if kehadiran <= 71:', '    tebak "Belum"', 'else:', '    if nilai_tugas <= 55:', '        tebak "Belum"', '    else:', '        tebak "Lulus"'], 90, 300, {size: 28, w: 560,
      sorot: t > D * .45 ? (t > D * .62 ? [3] : [0]) : [], pSorot: 1}); c.restore();
    const R = [1220, 330], A = [930, 600], B = [1510, 600], B1 = [1300, 860], B2 = [1720, 860];
    const p0 = K.seg(t, D * .2, D * .3), p1 = K.seg(t, D * .35, D * .45), p2 = K.seg(t, D * .55, D * .65);
    K.cabang(c, R[0], R[1] + 30, A[0], A[1] - 40, 'ya', p1); K.cabang(c, R[0], R[1] + 30, B[0], B[1] - 40, 'tidak', p1);
    K.cabang(c, B[0], B[1] + 30, B1[0], B1[1] - 40, 'ya', p2); K.cabang(c, B[0], B[1] + 30, B2[0], B2[1] - 40, 'tidak', p2);
    K.simpul(c, ...R, 'Kehadiran ≤ 71%?', {p: p0, warna: K.C.teks});
    K.simpul(c, ...A, 'kemungkinan Belum', {p: K.seg(t, D * .4, D * .48), warna: BE, daun: true, size: 30});
    K.simpul(c, ...B, 'Nilai tugas ≤ 55?', {p: K.seg(t, D * .45, D * .53), warna: K.C.teks});
    K.simpul(c, ...B1, 'Belum', {p: K.seg(t, D * .6, D * .68), warna: BE, daun: true, size: 30});
    K.simpul(c, ...B2, 'Lulus', {p: K.seg(t, D * .6, D * .68), warna: LU, daun: true, size: 30});
    // murid jatuh melewati pohon
    const jalur = [[R, A, 'B'], [R, B, B2, 'L'], [R, B, B1, 'B'], [R, B, B2, 'L'], [R, A, 'B'], [R, B, B2, 'L']];
    jalur.forEach((j, i) => { const a = D * .7 + i * D * .045, q = K.seg(t, a, a + 1.6); if (q <= 0) return;
      const pts = j.slice(0, -1), n = pts.length - 1, f = K.ease(q) * n, k = Math.min(n - 1, Math.floor(f)), r = f - k;
      const x = K.lerp(pts[k][0], pts[k + 1][0], r), y = K.lerp(pts[k][1], pts[k + 1][1], r);
      const tujuan = pts[n], off = (i % 3 - 1) * 58; const xx = q >= 1 ? tujuan[0] + off : x, yy = q >= 1 ? tujuan[1] + 70 : y;
      K.murid(c, xx - 22, yy - 28, 44, j[j.length - 1] === 'L' ? LU : BE); });
    const pz = K.out(K.seg(t, D * .9, D * .97)); if (pz > 0) K.text(c, 'Komputer memilih pertanyaan yang paling berguna lebih dulu', 380, 1010, {size: 32, weight: 700, color: K.C.amber, alpha: pz});
  },
  akurasi(c, t, D) {
    K.bg(c); K.judul(c, 'Akurasi', t, K.C.teal, 'Tebakan benar dibagi semua tebakan');
    const asli = ['L', 'B', 'B', 'L', 'L', 'L', 'B', 'L', 'L', 'B', 'L', 'L'], teb = ['L', 'B', 'B', 'L', 'L', 'L', 'B', 'L', 'L', 'B', 'B', 'L'];
    K.text(c, 'jawaban asli', 160, 330, {size: 28, weight: 700, color: K.C.redup}); K.text(c, 'tebakan model', 160, 560, {size: 28, weight: 700, color: K.C.redup});
    let benar = 0;
    asli.forEach((k, i) => { const x = 160 + i * 134, p = K.out(K.seg(t, .3 + i * .05, .8 + i * .05));
      c.save(); c.globalAlpha = p; K.murid(c, x, 370, 90, k === 'L' ? LU : BE); c.restore();
      const q = K.out(K.seg(t, D * .2 + i * D * .03, D * .2 + i * D * .03 + .4)); if (q <= 0) return;
      c.save(); c.globalAlpha = q; K.murid(c, x, 600, 90, teb[i] === 'L' ? LU : BE); c.restore();
      const ok = k === teb[i]; if (ok) benar++;
      c.save(); c.globalAlpha = q; c.strokeStyle = ok ? '#4ade80' : K.C.coral; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath();
      if (ok) { c.moveTo(x + 22, 780); c.lineTo(x + 40, 800); c.lineTo(x + 72, 760); } else { c.moveTo(x + 24, 758); c.lineTo(x + 68, 802); c.moveTo(x + 68, 758); c.lineTo(x + 24, 802); } c.stroke(); c.restore(); });
    const pf = K.out(K.seg(t, D * .62, D * .72));
    if (pf > 0) { c.save(); c.globalAlpha = pf; K.text(c, `${benar} benar ÷ 12 tebakan = 92%`, 960, 930, {size: 54, weight: 800, mono: true, align: 'center', color: K.C.teal}); c.restore(); }
  },
  batas(c, t, D) {
    K.bg(c); K.judul(c, 'Batas model', t, K.C.coral, 'Model hanya tahu tiga hal tentang seorang murid');
    const p = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p; K.murid(c, 820, 300, 280, K.C.sky); c.restore();
    [['jam belajar 4', 330], ['kehadiran 90%', 420], ['nilai tugas 78', 510]].forEach(([s, y], i) => { const q = K.out(K.seg(t, .8 + i * .4, 1.3 + i * .4));
      c.save(); c.globalAlpha = q; K.rrect(c, 300, y - 32, 400, 64, 32, 'rgba(45,212,191,.12)', K.C.teal, 3); K.text(c, s, 500, y, {size: 32, weight: 800, align: 'center', color: K.C.teal}); K.arrow(c, 710, y, 800, y + 40 - i * 20, K.C.teal, 4, 1, 14); c.restore(); });
    [['sedang sakit', 330], ['membantu orang tua', 420], ['baru pindah sekolah', 510]].forEach(([s, y], i) => { const q = K.out(K.seg(t, D * .2 + i * D * .07, D * .2 + i * D * .07 + .5));
      c.save(); c.globalAlpha = q; c.setLineDash([10, 8]); K.rrect(c, 1220, y - 32, 440, 64, 32, null, K.C.redup, 3); c.setLineDash([]);
      K.text(c, '? ' + s, 1440, y, {size: 32, weight: 700, align: 'center', color: K.C.redup}); c.restore(); });
    const pt = K.out(K.seg(t, D * .42, D * .5)); if (pt > 0) K.text(c, 'tidak terlihat oleh model', 1440, 600, {size: 28, weight: 700, align: 'center', color: K.C.redup, alpha: pt});
    const px = K.out(K.seg(t, D * .55, D * .65)), pv = K.out(K.seg(t, D * .75, D * .85));
    if (px > 0) { c.save(); c.globalAlpha = px; K.rrect(c, 200, 740, 680, 170, 24, 'rgba(255,107,107,.1)', K.C.coral, 4);
      K.text(c, '✗  Menghakimi murid', 540, 825, {size: 42, weight: 800, align: 'center', color: K.C.coral}); c.restore(); }
    if (pv > 0) { c.save(); c.globalAlpha = pv; K.rrect(c, 1000, 740, 720, 170, 24, 'rgba(74,222,128,.1)', '#4ade80', 4);
      K.text(c, '✓  Membantu guru menemukan', 1360, 800, {size: 38, weight: 800, align: 'center', color: '#4ade80'});
      K.text(c, 'siapa yang butuh bantuan lebih awal', 1360, 855, {size: 32, weight: 600, align: 'center', color: '#bbf7d0'}); c.restore(); }
  },
  overfit(c, t, D) {
    K.bg(c); K.judul(c, 'Overfitting', t, K.C.coral, 'Terlalu menghafal soal latihan');
    const kol = (x, judul, lat, uji, col, p0) => { const p = K.out(K.seg(t, p0, p0 + .6)); if (p <= 0) return; c.save(); c.globalAlpha = p;
      K.text(c, judul, x + 300, 290, {size: 40, weight: 800, mono: true, align: 'center', color: col});
      [[lat, 'latihan', K.C.violet], [uji, 'ujian', K.C.teal]].forEach(([v, n, cc], i) => { const bx = x + 90 + i * 260, h = 420 * v / 100 * K.ease(K.seg(t, p0 + .4, p0 + 1.4));
        K.rrect(c, bx, 800 - h, 160, h, 12, cc); K.text(c, `${Math.round(v * K.ease(K.seg(t, p0 + .4, p0 + 1.4)))}%`, bx + 80, 770 - h, {size: 40, weight: 800, mono: true, align: 'center'});
        K.text(c, n, bx + 80, 840, {size: 32, weight: 700, align: 'center', color: K.C.redup}); }); c.restore(); };
    kol(200, 'max_depth=3', 94, 92, K.C.teal, .3); kol(1100, 'max_depth=20', 100, 83, K.C.coral, D * .3);
    const pz = K.out(K.seg(t, D * .6, D * .7)); if (pz > 0) { c.save(); c.globalAlpha = pz; K.arrow(c, 1690, 450, 1690, 520, K.C.coral, 6, 1);
      K.text(c, 'Hafal soal latihan, gagal di soal baru', 960, 960, {size: 42, weight: 800, align: 'center', color: K.C.coral}); c.restore(); }
  },
  akhir(c, t, D, a) {
    K.bg(c); const p = K.out(K.seg(t, 0, .6)), p2 = K.out(K.seg(t, D * .4, D * .4 + .6));
    K.judul(c, 'Tantangan untukmu', t, K.C.amber);
    K.panel(c, 140, 200, 1640, 260, p, K.C.amber);
    c.save(); c.globalAlpha = p; K.text(c, a.tantangan, 200, 280, {size: 44, weight: 600, maxW: 1520, lh: 1.4}); c.restore();
    if (p2 > 0) { c.save(); c.globalAlpha = p2; K.text(c, 'Portofolio Proyek Pemrograman Sederhana', 140, 560, {size: 34, weight: 800, color: K.C.redup});
      const P = ['Game Tebak Angka', 'Kuis Otomatis', 'Nilai Rapor + Grafik', 'Website Profil Diri', 'Kucing vs Anjing', 'AI Penebak Kelulusan'], W = [K.C.amber, K.C.sky, K.C.lime, K.C.pink, K.C.violet, K.C.teal];
      P.forEach((s, i) => { const q = K.back(K.seg(t, D * .45 + i * .25, D * .45 + i * .25 + .5)); const x = 140 + (i % 3) * 553, y = 610 + Math.floor(i / 3) * 150;
        c.save(); c.globalAlpha *= K.clamp(q); K.rrect(c, x, y, 520, 120, 20, '#1f2a48', W[i], 4); K.text(c, '✓', x + 50, y + 62, {size: 48, weight: 800, align: 'center', color: W[i]});
        K.text(c, s, x + 95, y + 62, {size: 36, weight: 800}); c.restore(); }); c.restore(); }
  },
  g_empat(c, t, D, a, r) { // empat bagian hasil train_test_split
    const B = [['X_latih', '48 baris fitur', K.C.teal, 48], ['X_uji', '12 baris fitur', K.C.teal, 12], ['y_latih', '48 label', K.C.violet, 48], ['y_uji', '12 label', K.C.violet, 12]];
    B.forEach(([n, s, w, k], i) => { const q = K.out(K.seg(t, 1 + i * .5, 1.6 + i * .5)); if (q <= 0) return; const x = r.x + 20 + i * 390, y = r.y + 20;
      c.save(); c.globalAlpha = q; K.rrect(c, x, y, 350, r.h - 40, 20, 'rgba(255,255,255,.04)', w, 4);
      K.text(c, n, x + 175, y + 50, {size: 36, weight: 800, mono: true, align: 'center', color: w}); K.text(c, s, x + 175, y + 100, {size: 26, weight: 600, align: 'center', color: K.C.redup});
      const n2 = k === 48 ? 48 : 12, kol = 8; for (let j = 0; j < n2; j++) { const bx = x + 35 + (j % kol) * 36, by = y + 140 + Math.floor(j / kol) * 30; if (by > y + r.h - 70) break;
        K.rrect(c, bx, by, 28, 20, 4, w === K.C.teal ? 'rgba(45,212,191,.55)' : 'rgba(167,139,250,.6)'); } c.restore(); });
  },
  g_jalur(c, t, D, a, r) { // jalur murid baru melewati pohon
    const p = K.seg(t, 1.2, D * .8), box = [[r.x + 180, 'Kehadiran ≤ 71?', 'tidak, 90'], [r.x + 640, 'Nilai tugas ≤ 55,5?', 'tidak, 78'], [r.x + 1110, 'Nilai tugas ≤ 63,5?', 'tidak, 78']], y = r.y + 110;
    box.forEach(([x, s, j], i) => { const q = K.seg(p, i / 3.3, i / 3.3 + .25); K.simpul(c, x, y, s, {p: q, size: 28, warna: K.C.teks});
      if (q > .5) K.text(c, j, x, y + 80, {size: 28, weight: 800, align: 'center', color: K.C.amber, alpha: K.out((q - .5) * 2)});
      if (i < 2) K.arrow(c, x + 190, y, box[i + 1][0] - 190, y, K.C.amber, 5, K.seg(p, i / 3.3 + .2, i / 3.3 + .3), 14); });
    const ql = K.seg(p, .82, 1); K.arrow(c, box[2][0] + 190, y, r.x + 1400, y, K.C.amber, 5, ql, 14); K.simpul(c, r.x + 1470, y, 'Lulus', {p: ql, warna: LU, daun: true, size: 32});
  },
});
K.ikonTabel = (c, x, y, s, w) => { c.strokeStyle = w; c.lineWidth = s * .05; K.rrect(c, x - s * .4, y - s * .3, s * .8, s * .6, s * .06, null, w, s * .05);
  c.beginPath(); c.moveTo(x - s * .4, y - s * .1); c.lineTo(x + s * .4, y - s * .1); c.moveTo(x + s * .15, y - s * .3); c.lineTo(x + s * .15, y + s * .3); c.stroke(); };
K.ikonAmplop = (c, x, y, s, w) => { K.rrect(c, x - s * .4, y - s * .26, s * .8, s * .52, s * .05, null, w, s * .05); c.strokeStyle = w; c.lineWidth = s * .05; c.beginPath(); c.moveTo(x - s * .4, y - s * .26); c.lineTo(x, y + s * .06); c.lineTo(x + s * .4, y - s * .26); c.stroke(); };
K.ikonPohon = (c, x, y, s, w) => { c.strokeStyle = w; c.lineWidth = s * .05; c.beginPath(); c.moveTo(x, y - s * .25); c.lineTo(x - s * .28, y + s * .2); c.moveTo(x, y - s * .25); c.lineTo(x + s * .28, y + s * .2); c.stroke();
  [[x, y - s * .3], [x - s * .3, y + s * .25], [x + s * .3, y + s * .25]].forEach(([a, b]) => K.rrect(c, a - s * .12, b - s * .08, s * .24, s * .16, s * .04, w)); };
K.ikonMata = (c, x, y, s, w) => { c.strokeStyle = w; c.lineWidth = s * .05; c.beginPath(); c.ellipse(x, y, s * .4, s * .22, 0, 0, 7); c.stroke(); c.fillStyle = w; c.beginPath(); c.arc(x, y, s * .1, 0, 7); c.fill(); };
K.ikonTarget = (c, x, y, s, w) => { c.strokeStyle = w; c.lineWidth = s * .05; [.38, .24].forEach(r => { c.beginPath(); c.arc(x, y, s * r, 0, 7); c.stroke(); }); c.fillStyle = w; c.beginPath(); c.arc(x, y, s * .09, 0, 7); c.fill(); };
K.ikonMurid = (c, x, y, s, w) => K.murid(c, x - s * .3, y - s * .38, s * .6, w);
