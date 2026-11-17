// T11 AI penyaring spam: aturan vs contoh, kantong kata, Naive Bayes, penyaring sungguhan
K.pesan = (c, x, y, w, teks, o = {}) => { // gelembung pesan
  const h = o.h || 70; K.rrect(c, x, y, w, h, 16, o.isi || '#1f2a48', o.garis || K.C.garis, 3);
  K.text(c, teks, x + 22, y + h / 2, {size: o.size || 26, weight: 600, color: o.warna || K.C.teks});
  if (o.label) { const lw = K.lebar(c, o.label, 22, 800) + 30; K.rrect(c, x + w - lw - 14, y + h / 2 - 18, lw, 36, 18, o.lc);
    K.text(c, o.label, x + w - lw / 2 - 14, y + h / 2 + 1, {size: 22, weight: 800, align: 'center', color: '#141a2c'}); }
};
Object.assign(K.adegan, {
  aturan(c, t, D) {
    K.bg(c); K.judul(c, 'Aturan atau belajar dari contoh?', t, K.C.coral, 'Dua cara membuat penyaring');
    const p1 = K.out(K.seg(t, .4, 1.2)); K.panel(c, 100, 220, 820, 760, p1, K.C.coral);
    c.save(); c.globalAlpha = p1; K.text(c, 'Cara 1: menulis aturan', 150, 285, {size: 38, weight: 800, color: K.C.coral});
    K.kode(c, ['if "gratis" in pesan:', '    spam'], 150, 330, {size: 30});
    const ps = [[D * .14, 'Hadiah menantimu, klaim sekarang', 'normal?', '✗ lolos'], [D * .24, 'Aku traktir es teh gratis', 'spam?', '✗ salah']];
    ps.forEach(([a, s, l, x], i) => { const q = K.out(K.seg(t, a, a + .6)); if (q <= 0) return; c.save(); c.globalAlpha *= q;
      K.pesan(c, 150, 560 + i * 170, 720, s, {label: l, lc: i ? K.C.coral : K.C.lime}); K.text(c, x, 170, 665 + i * 170, {size: 28, weight: 800, color: K.C.coral}); c.restore(); });
    c.restore();
    const p2 = K.out(K.seg(t, D * .38, D * .46)); if (p2 <= 0) return;
    K.panel(c, 1000, 220, 820, 760, p2, K.C.teal); c.save(); c.globalAlpha = p2;
    K.text(c, 'Cara 2: machine learning', 1050, 285, {size: 38, weight: 800, color: K.C.teal});
    const ex = [['Menang undian, klik link', 'spam'], ['Besok kerja kelompok', 'normal'], ['Pulsa gratis, klaim', 'spam'], ['Jangan lupa PR', 'normal']];
    ex.forEach(([s, l], i) => { const q = K.out(K.seg(t, D * .48 + i * .4, D * .48 + i * .4 + .5)); c.save(); c.globalAlpha *= q;
      K.pesan(c, 1050, 340 + i * 90, 560, s, {h: 70, size: 24, label: l, lc: l === 'spam' ? K.C.coral : K.C.lime}); c.restore(); });
    const pm = K.out(K.seg(t, D * .7, D * .8)); if (pm > 0) { K.arrow(c, 1330, 710, 1330, 780, K.C.teal, 6, pm);
      K.rrect(c, 1130, 790, 400, 130, 24, 'rgba(45,212,191,.14)', K.C.teal, 4); K.ikonPutar(c, 1210, 855, 70, K.C.teal, t * 2);
      K.text(c, 'mencari pola', 1270, 855, {size: 34, weight: 800, color: K.C.teal, alpha: pm}); }
    c.restore();
  },
  kantong(c, t, D) {
    K.bg(c); K.judul(c, 'Kata menjadi angka', t, K.C.sky, 'Bag of words: hitung setiap kata');
    const msgs = ['klik link hadiah gratis', 'besok kerja kelompok ya', 'pulsa gratis klik link'], kata = ['klik', 'link', 'hadiah', 'gratis', 'besok', 'kerja', 'ya', 'pulsa'];
    const p1 = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p1;
    msgs.forEach((m, i) => K.pesan(c, 100, 250 + i * 110, 560, m, {h: 80, size: 28})); c.restore();
    // potongan kata
    const pp = K.out(K.seg(t, D * .2, D * .35)); if (pp > 0) { const w0 = msgs[0].split(' '); let x = 100;
      w0.forEach((w, i) => { const ww = K.lebar(c, w, 28, 700) + 30; const yy = 620 + Math.sin(t * 3 + i) * 4 * pp; K.rrect(c, x, yy, ww, 56, 12, '#16203a', K.C.amber, 3);
        K.text(c, w, x + ww / 2, yy + 29, {size: 28, weight: 700, align: 'center', color: K.C.amber, alpha: pp}); x += ww + 16; });
      K.text(c, 'dipotong menjadi kata', 100, 720, {size: 28, weight: 700, color: K.C.redup, alpha: pp}); }
    // tabel
    const pt = K.out(K.seg(t, D * .4, D * .5)); if (pt <= 0) return;
    c.save(); c.globalAlpha = pt; const tx = 760, ty = 250, cw = 128, rh = 110;
    kata.forEach((k, j) => K.text(c, k, tx + 40 + j * cw, ty - 10, {size: 24, weight: 800, align: 'center', color: K.C.sky}));
    msgs.forEach((m, i) => { const ws = m.split(' '); kata.forEach((k, j) => { const n = ws.filter(w => w === k).length, q = K.out(K.seg(t, D * .5 + i * 1.2 + j * .1, D * .5 + i * 1.2 + j * .1 + .4));
      K.rrect(c, tx + j * cw, ty + 25 + i * rh, cw - 12, rh - 20, 10, n ? 'rgba(96,165,250,.22)' : '#16203a', K.C.garis, 2);
      K.text(c, String(n), tx + j * cw + (cw - 12) / 2, ty + 25 + i * rh + (rh - 20) / 2, {size: 40, weight: 800, mono: true, align: 'center', color: n ? K.C.teks : K.C.redup, alpha: q}); }); });
    K.text(c, 'baris = pesan,  kolom = kata', tx, 620, {size: 32, weight: 800, color: K.C.teal}); c.restore();
  },
  bayes(c, t, D) {
    K.bg(c); K.judul(c, 'Naive Bayes: setiap kata adalah bukti', t, K.C.violet, 'Berapa kali kata muncul di spam dan di pesan normal?');
    const W = [['hadiah', 4, 0], ['klaim', 4, 0], ['undian', 3, 0], ['besok', 0, 4], ['sekolah', 0, 3], ['jangan', 0, 3]];
    K.text(c, 'spam', 520, 235, {size: 30, weight: 800, align: 'center', color: K.C.coral}); K.text(c, 'normal', 860, 235, {size: 30, weight: 800, align: 'center', color: K.C.lime});
    W.forEach(([k, s, n], i) => { const q = K.out(K.seg(t, .5 + i * D * .06, 1 + i * D * .06)), y = 290 + i * 95; c.save(); c.globalAlpha = q;
      K.text(c, k, 340, y + 20, {size: 34, weight: 800, align: 'right'}); K.rrect(c, 380, y, 280, 40, 8, '#16203a'); K.rrect(c, 720, y, 280, 40, 8, '#16203a');
      if (s) K.rrect(c, 380, y, 280 * s / 4 * q, 40, 8, K.C.coral); if (n) K.rrect(c, 720, y, 280 * n / 4 * q, 40, 8, K.C.lime);
      K.text(c, String(s), 670, y + 20, {size: 24, weight: 800, mono: true, color: K.C.redup}); K.text(c, String(n), 1010, y + 20, {size: 24, weight: 800, mono: true, color: K.C.redup}); c.restore(); });
    // timbangan
    const pb = K.out(K.seg(t, D * .55, D * .65)); if (pb <= 0) return;
    c.save(); c.globalAlpha = pb; K.pesan(c, 1120, 250, 680, 'Klaim hadiah undian sekarang', {h: 80, size: 30});
    const nB = Math.min(3, Math.floor(K.seg(t, D * .65, D * .85) * 3.999)), miring = .22 * K.ease(nB / 3), bx = 1460, by = 640;
    c.strokeStyle = K.C.teks; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, 880); c.moveTo(bx - 120, 880); c.lineTo(bx + 120, 880); c.stroke();
    c.save(); c.translate(bx, by); c.rotate(-miring); c.beginPath(); c.moveTo(-260, 0); c.lineTo(260, 0); c.stroke();
    K.rrect(c, -330, 10, 140, 18, 9, K.C.coral); K.rrect(c, 190, 10, 140, 18, 9, K.C.lime);
    for (let i = 0; i < nB; i++) K.rrect(c, 230 - 30, -40 - i * 44 + 10, 120, 40, 8, null, null); c.restore();
    const ky = ['klaim', 'hadiah', 'undian']; for (let i = 0; i < nB; i++) { const ax = bx - 260 * Math.cos(miring) - 0, ay = by + 260 * Math.sin(miring);
      K.rrect(c, ax - 75, ay - 54 - i * 46, 150, 40, 10, K.C.coral); K.text(c, ky[i], ax, ay - 33 - i * 46, {size: 24, weight: 800, align: 'center', color: '#141a2c'}); }
    K.text(c, 'spam', bx - 260, by + 120 + 260 * Math.sin(miring) * 0, {size: 30, weight: 800, align: 'center', color: K.C.coral}); K.text(c, 'normal', bx + 260, by + 120 - 0, {size: 30, weight: 800, align: 'center', color: K.C.lime});
    if (t > D * .87) K.text(c, '→ spam', 1460, 960, {size: 46, weight: 800, align: 'center', color: K.C.coral, alpha: K.out(K.seg(t, D * .87, D * .93))});
    c.restore();
  },
  nyata(c, t, D) {
    K.bg(c); K.judul(c, 'Penyaring spam sungguhan', t, K.C.teal, 'Belajar dari jutaan contoh');
    const p1 = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p1;
    K.rrect(c, 120, 230, 1100, 700, 20, '#eef2f7', K.C.garis, 4); K.rrect(c, 120, 230, 260, 700, [20, 0, 0, 20], '#dfe5ee');
    [['Kotak masuk', 0], ['Terkirim', 0], ['Spam', 1]].forEach(([s, a], i) => { if (a) K.rrect(c, 140, 290 + i * 70, 220, 54, 27, t > D * .7 ? '#fecaca' : '#dfe5ee'); K.text(c, s, 170, 317 + i * 70, {size: 28, weight: 700, color: '#1f2937'}); });
    const ms = [['Bu Guru', 'Link kelas online besok pagi', 0], ['Hadiah!!', 'Klaim undian 50 juta sekarang', 1], ['Dina', 'Jadi kerja kelompok jam 3?', 0], ['Promo', 'Pulsa gratis, isi data diri', 1]];
    ms.forEach(([d, s, sp], i) => { const y = 260 + i * 100, k = sp && t > D * .3 ? K.out(K.seg(t, D * .3 + i * .2, D * .42 + i * .2)) : 0;
      c.save(); c.globalAlpha *= 1 - k * .8; K.text(c, d, 420, y + 40, {size: 28, weight: 800, color: '#111827'}); K.text(c, s, 600, y + 40, {size: 26, weight: 500, color: '#374151'}); c.restore();
      c.fillStyle = '#d1d5db'; c.fillRect(400, y + 88, 800, 2); });
    c.restore();
    const pr = K.out(K.seg(t, D * .25, D * .35)); if (pr > 0) { c.save(); c.globalAlpha = pr; K.rrect(c, 1290, 260, 500, 110, 55, '#ff6b6b'); K.text(c, 'Laporkan spam', 1540, 315, {size: 38, weight: 800, align: 'center', color: '#141a2c'});
      K.text(c, '= contoh baru untuk AI', 1540, 420, {size: 30, weight: 700, align: 'center', color: K.C.redup}); c.restore(); }
    const pw = K.out(K.seg(t, D * .6, D * .7)); if (pw > 0) { c.save(); c.globalAlpha = pw; K.panel(c, 1290, 520, 500, 380, 1, K.C.amber);
      K.text(c, 'AI bisa salah', 1340, 590, {size: 36, weight: 800, color: K.C.amber}); K.text(c, '• Sesekali periksa folder Spam', 1340, 670, {size: 28, weight: 600, maxW: 430});
      K.text(c, '• Jangan pernah mengirim kode OTP kepada siapa pun', 1340, 760, {size: 28, weight: 600, maxW: 430}); c.restore(); }
  },
});
K.ikonAturan = (c, x, y, s, w) => { K.rrect(c, x - s * .3, y - s * .38, s * .6, s * .76, s * .06, null, w, s * .05); for (let i = 0; i < 3; i++) K.rrect(c, x - s * .18, y - s * .2 + i * s * .16, s * .36, s * .05, 3, w); };
K.ikonTimbangan = (c, x, y, s, w) => { c.save(); c.strokeStyle = w; c.lineWidth = s * .06; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y - s * .3); c.lineTo(x, y + s * .35); c.moveTo(x - s * .35, y - s * .15); c.lineTo(x + s * .35, y - s * .25); c.moveTo(x - s * .15, y + s * .35); c.lineTo(x + s * .15, y + s * .35); c.stroke();
  c.beginPath(); c.arc(x - s * .35, y - s * .05, s * .12, 0, Math.PI); c.stroke(); c.beginPath(); c.arc(x + s * .35, y - s * .15, s * .12, 0, Math.PI); c.stroke(); c.restore(); };
K.ikonData = (c, x, y, s, w) => { c.save(); c.strokeStyle = w; c.lineWidth = s * .05; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(x, y - s * .25 + i * s * .22, s * .3, s * .1, 0, 0, 7); c.stroke(); } c.restore(); };
