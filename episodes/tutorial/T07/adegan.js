// T07 Game Ular: koordinat, array, game loop, event keyboard, makan dan tumbuh
const HIJAU = '#4ade80', MERAH = '#ef4444';
K.papan = (c, x, y, sel, n = 20, o = {}) => { // papan hitam berkisi; kembalikan fungsi alamat->piksel
  c.save(); c.globalAlpha *= (o.p ?? 1); K.rrect(c, x - 6, y - 6, sel * n + 12, sel * n + 12, 10, '#000', K.C.garis, 3);
  c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 1;
  for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo(x + i * sel, y); c.lineTo(x + i * sel, y + n * sel); c.stroke(); c.beginPath(); c.moveTo(x, y + i * sel); c.lineTo(x + n * sel, y + i * sel); c.stroke(); }
  c.restore(); return (gx, gy) => [x + gx * sel, y + gy * sel];
};
K.sel = (c, P, gx, gy, sel, warna, a = 1) => { const [px, py] = P(gx, gy); c.save(); c.globalAlpha *= a; K.rrect(c, px + 2, py + 2, sel - 4, sel - 4, 4, warna); c.restore(); };
K.tombol = (c, x, y, s, teks, aktif) => { K.rrect(c, x, y, s, s, 14, aktif ? K.C.amber : '#1f2a48', aktif ? '#fff' : K.C.garis, 3); K.text(c, teks, x + s / 2, y + s / 2 + 2, {size: s * .45, weight: 800, align: 'center', color: aktif ? '#141a2c' : K.C.teks}); };
Object.assign(K.adegan, {
  koordinat(c, t, D) {
    K.bg(c); K.judul(c, 'Papan koordinat', t, K.C.amber, 'Canvas dibagi menjadi 20 × 20 kotak');
    const sel = 34, X = 220, Y = 300, P = K.papan(c, X, Y, sel, 20, {p: K.out(K.seg(t, .3, 1))});
    const px = K.out(K.seg(t, D * .2, D * .3)), py = K.out(K.seg(t, D * .35, D * .45));
    if (px > 0) { K.arrow(c, X, Y - 40, X + 20 * sel * px, Y - 40, K.C.sky, 6, 1); K.text(c, 'x bertambah ke kanan', X + 340, Y - 78, {size: 32, weight: 800, align: 'center', color: K.C.sky, alpha: px}); }
    if (py > 0) { K.arrow(c, X - 40, Y, X - 40, Y + 20 * sel * py, K.C.coral, 6, 1); c.save(); c.translate(X - 80, Y + 340); c.rotate(-Math.PI / 2); K.text(c, 'y bertambah ke BAWAH', 0, 0, {size: 32, weight: 800, align: 'center', color: K.C.coral, alpha: py}); c.restore(); }
    K.text(c, '0', X + 6, Y - 10, {size: 22, weight: 700, color: K.C.redup, base: 'bottom'});
    const ph = K.out(K.seg(t, D * .55, D * .62)), pm = K.out(K.seg(t, D * .65, D * .72));
    if (ph > 0) { K.sel(c, P, 10, 10, sel, HIJAU, ph); K.text(c, 'x = 10, y = 10', 1230, 520, {size: 40, weight: 800, mono: true, color: HIJAU, alpha: ph}); }
    if (pm > 0) { K.sel(c, P, 15, 5, sel, MERAH, pm); K.text(c, 'x = 15, y = 5', 1230, 600, {size: 40, weight: 800, mono: true, color: MERAH, alpha: pm}); }
    const pq = K.out(K.seg(t, D * .78, D * .86));
    if (pq > 0) { c.save(); c.globalAlpha = pq; K.panel(c, 1200, 700, 560, 200, 1, K.C.sky); K.text(c, 'Piksel = alamat × 20', 1250, 765, {size: 34, weight: 800});
      K.text(c, '10 × 20 = 200 piksel', 1250, 835, {size: 32, weight: 600, mono: true, color: K.C.redup}); c.restore(); }
  },
  array(c, t, D) {
    K.bg(c); K.judul(c, 'Ular adalah array', t, K.C.teal, 'Deretan alamat, seperti gerbong kereta');
    const isi = [[10, 10], [9, 10], [8, 10]];
    isi.forEach(([x, y], i) => { const p = K.back(K.seg(t, .6 + i * .5, 1.2 + i * .5)); if (p <= 0) return; const bx = 230 + i * 470;
      c.save(); c.globalAlpha = K.clamp(p); K.rrect(c, bx, 330, 400, 170, 22, '#16203a', i === 0 ? K.C.amber : HIJAU, 5);
      K.text(c, `{x: ${x}, y: ${y}}`, bx + 200, 415, {size: 40, weight: 800, mono: true, align: 'center'});
      K.text(c, `ular[${i}]`, bx + 200, 550, {size: 34, weight: 800, mono: true, align: 'center', color: i === 0 ? K.C.amber : K.C.redup});
      if (i < 2) { c.fillStyle = K.C.garis; c.fillRect(bx + 400, 410, 70, 10); } c.restore(); });
    const pk = K.out(K.seg(t, D * .55, D * .65)); if (pk > 0) { c.save(); c.globalAlpha = pk; K.rrect(c, 200, 300, 460, 300, 30, null, K.C.amber, 4); K.text(c, 'nomor 0 = kepala', 430, 650, {size: 38, weight: 800, align: 'center', color: K.C.amber}); c.restore(); }
    const pg = K.out(K.seg(t, D * .7, D * .8));
    if (pg > 0) { const sel = 28, P = K.papan(c, 1300, 660, sel, 12, {p: pg}); [[6, 3], [5, 3], [4, 3]].forEach(([x, y], i) => K.sel(c, P, x, y, sel, i ? HIJAU : '#bbf7d0', pg));
      K.text(c, 'di papan', 1470, 1030, {size: 30, weight: 700, align: 'center', color: K.C.redup, alpha: pg}); }
    const pf = K.out(K.seg(t, D * .82, D * .9)); if (pf > 0) c.save(), c.globalAlpha = pf, K.kode(c, ['let ular = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];'], 200, 740, {size: 26}), c.restore();
  },
  loop(c, t, D) {
    K.bg(c); K.judul(c, 'Game loop', t, K.C.violet, 'Diulang setiap 150 milidetik');
    const L = ['1. Hitung kepala baru', '2. Tambah kepala, buang ekor', '3. Gambar ulang papan'], W = [K.C.amber, HIJAU, K.C.sky];
    const tick = 2.2, t0 = D * .3, k = t > t0 ? Math.floor((t - t0) / tick) : -1, f = t > t0 ? ((t - t0) % tick) / tick : 0, fase = k < 0 ? -1 : Math.min(2, Math.floor(f * 3));
    L.forEach((s, i) => { const p = K.out(K.seg(t, .6 + i * D * .07, 1.1 + i * D * .07)); c.save(); c.globalAlpha = p;
      K.rrect(c, 140, 300 + i * 150, 680, 110, 20, fase === i ? 'rgba(255,255,255,.08)' : '#16203a', fase === i ? W[i] : K.C.garis, fase === i ? 5 : 3);
      K.text(c, s, 180, 356 + i * 150, {size: 38, weight: 800, color: fase === i ? W[i] : K.C.teks}); c.restore(); });
    const pc = K.out(K.seg(t, D * .25, D * .3)); if (pc > 0) { c.save(); c.globalAlpha = pc; K.path(c, [[830, 655], [900, 655], [900, 355], [830, 355]], K.C.violet, 5, 1); K.text(c, '150 ms', 960, 505, {size: 34, weight: 800, mono: true, color: K.C.violet}); c.restore(); }
    const sel = 44, P = K.papan(c, 1160, 280, sel, 13, {p: K.out(K.seg(t, .3, 1))});
    const n = Math.max(0, k), base = [[4, 6], [3, 6], [2, 6]].map(([x, y]) => [x + n, y]);
    base.forEach(([x, y], i) => { let a = 1; if (fase >= 1 && i === 2) a = 1 - K.clamp((f * 3 - 1) * 2); K.sel(c, P, x, y, sel, i ? HIJAU : '#bbf7d0', a); });
    if (fase >= 0) { const [hx, hy] = [base[0][0] + 1, base[0][1]]; if (fase === 0) { const [px, py] = P(hx, hy); c.save(); c.setLineDash([8, 6]); K.rrect(c, px + 2, py + 2, sel - 4, sel - 4, 4, null, K.C.amber, 4); c.restore(); } else K.sel(c, P, hx, hy, sel, '#bbf7d0'); }
    if (fase === 2) { c.save(); c.globalAlpha = .3 * (1 - (f * 3 - 2)); c.fillStyle = K.C.sky; const [px, py] = P(0, 0); c.fillRect(px, py, 13 * sel, 13 * sel); c.restore(); }
  },
  event(c, t, D) {
    K.bg(c); K.judul(c, 'Event keyboard', t, K.C.sky, 'Kabar dari browser setiap kali tombol ditekan');
    const tekan = t > D * .35 && t < D * .7 ? 'atas' : (t >= D * .7 ? 'kanan' : null), s = 110, X = 260, Y = 420;
    K.tombol(c, X + s + 10, Y, s, '↑', tekan === 'atas'); K.tombol(c, X, Y + s + 10, s, '←', false); K.tombol(c, X + s + 10, Y + s + 10, s, '↓', false); K.tombol(c, X + 2 * s + 20, Y + s + 10, s, '→', tekan === 'kanan');
    if (tekan) { const a = tekan === 'atas' ? ['ArrowUp', '{x: 0, y: -1}'] : ['ArrowRight', '{x: 1, y: 0}'], p = K.out(K.seg(t, tekan === 'atas' ? D * .35 : D * .7, (tekan === 'atas' ? D * .35 : D * .7) + .6));
      c.save(); c.globalAlpha = p; K.arrow(c, 660, 540, 760, 540, K.C.amber, 6, 1); K.rrect(c, 780, 470, 420, 140, 70, 'rgba(255,176,32,.12)', K.C.amber, 4);
      K.text(c, 'keydown', 990, 515, {size: 30, weight: 700, align: 'center', color: K.C.redup}); K.text(c, a[0], 990, 565, {size: 38, weight: 800, mono: true, align: 'center', color: K.C.amber});
      K.arrow(c, 1210, 540, 1290, 540, K.C.amber, 6, 1); K.text(c, 'arah = ' + a[1], 1310, 540, {size: 34, weight: 800, mono: true, color: HIJAU}); c.restore(); }
    else K.text(c, 'menunggu tombol...', 990, 540, {size: 32, weight: 600, align: 'center', color: K.C.redup, alpha: K.out(K.seg(t, .6, 1.2))});
    const pk = K.out(K.seg(t, D * .12, D * .25)); if (pk > 0) { c.save(); c.globalAlpha = pk; K.kode(c, ['document.addEventListener("keydown", function (e) {', '  if (e.key === "ArrowUp") arah = {x: 0, y: -1};', '});'], 260, 780, {size: 28, sorot: tekan === 'atas' ? [1] : [], pSorot: 1}); c.restore(); }
  },
  makan(c, t, D) {
    K.bg(c); K.judul(c, 'Makan dan tumbuh', t, K.C.amber, 'Kalau kepala sampai di makanan, ekor tidak dibuang');
    const lajur = (y, judul, makan, p0) => { const p = K.out(K.seg(t, p0, p0 + .6)); if (p <= 0) return; c.save(); c.globalAlpha = p;
      K.text(c, judul, 140, y - 40, {size: 34, weight: 800, color: makan ? K.C.amber : K.C.redup});
      const sel = 56, P = (gx, gy) => [140 + gx * sel, y + gy * sel]; c.fillStyle = '#000'; c.fillRect(140, y, 12 * sel, sel);
      const q = K.seg(t, p0 + .8, p0 + 2.6), st = q < .33 ? 0 : q < .66 ? 1 : 2, badan = [4, 3, 2];
      if (makan && st < 2) K.sel(c, P, 5, 0, sel, MERAH);
      badan.forEach((x, i) => K.sel(c, P, x, 0, sel, (i || st >= 1) ? HIJAU : '#bbf7d0', !makan && i === 2 && st === 2 ? .15 : 1));
      if (st >= 1) K.sel(c, P, 5, 0, sel, '#bbf7d0');
      if (st === 2) K.text(c, makan ? 'panjang 4: tumbuh!' : 'panjang tetap 3', 140 + 12 * sel + 40, y + sel / 2, {size: 34, weight: 800, color: makan ? K.C.amber : K.C.redup});
      if (st === 2 && !makan) K.text(c, 'ular.pop()', 140 + 2 * sel + 28, y + sel + 30, {size: 26, weight: 700, mono: true, align: 'center', color: K.C.coral});
      c.restore(); };
    lajur(300, 'Langkah biasa: tambah kepala, buang ekor', false, .5); lajur(600, 'Kepala di makanan: ekor tidak dibuang', true, D * .38);
    const pr = K.out(K.seg(t, D * .78, D * .86)); if (pr > 0) { c.save(); c.globalAlpha = pr; K.kode(c, ['makanan = {x: Math.floor(Math.random() * 20), y: ...};'], 140, 830, {size: 28}); K.text(c, 'makanan pindah ke alamat acak', 1320, 880, {size: 30, weight: 700, color: K.C.redup}); c.restore(); }
  },
});
K.ikonPapan = (c, x, y, s, w) => { K.rrect(c, x - s * .4, y - s * .4, s * .8, s * .8, s * .06, '#000', w, s * .04); K.rrect(c, x - s * .1, y, s * .16, s * .16, 3, HIJAU); K.rrect(c, x + s * .14, y - s * .25, s * .16, s * .16, 3, MERAH); };
K.ikonGerbong = (c, x, y, s, w) => { for (let i = 0; i < 3; i++) K.rrect(c, x - s * .44 + i * s * .3, y - s * .1, s * .26, s * .22, s * .04, i ? w : '#bbf7d0'); };
K.ikonLoop = (c, x, y, s, w) => K.ikonPutar(c, x, y, s, w);
K.ikonPanah = (c, x, y, s, w) => { K.tombol(c, x - s * .2, y - s * .42, s * .4, '↑', true); K.tombol(c, x - s * .2, y + s * .02, s * .4, '↓', false); };
