// T13 Chatbot: kata kunci, kemiripan potongan huruf, chatbot AI besar
K.gelembung = (c, x, y, w, teks, o = {}) => { const h = o.h || 72, kanan = o.kanan;
  K.rrect(c, x, y, w, h, 22, o.isi || (kanan ? '#2563eb' : '#1f2a48'), o.garis || null, 3);
  K.text(c, teks, x + 26, y + h / 2, {size: o.size || 28, weight: 600, color: o.warna || K.C.teks}); };
Object.assign(K.adegan, {
  kunci(c, t, D) {
    K.bg(c); K.judul(c, 'Chatbot kata kunci', t, K.C.coral, 'Kalau pesan berisi kata tertentu, beri jawaban tertentu');
    const p1 = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p1;
    K.kode(c, ['if "kantin" in pesan:', '    jam buka kantin', 'elif "perpustakaan" in pesan:', '    letak perpustakaan', 'else:', '    "Maaf, aku tidak mengerti."'], 120, 240, {size: 32}); c.restore();
    const Q = [[D * .25, 'Kantin buka jam berapa?', 'Kantin buka jam 7 pagi.', true], [D * .55, 'Perpus di mana ya?', 'Maaf, aku tidak mengerti.', false], [D * .72, 'Perpustakan di mana?', 'Maaf, aku tidak mengerti.', false]];
    Q.forEach(([a, q, j, ok], i) => { const p = K.out(K.seg(t, a, a + .6)), pj = K.out(K.seg(t, a + .8, a + 1.4)); if (p <= 0) return; const y = 240 + i * 230;
      c.save(); c.globalAlpha = p; K.gelembung(c, 1100, y, 640, q, {kanan: true}); c.restore();
      if (pj > 0) { c.save(); c.globalAlpha = pj; K.gelembung(c, 980, y + 92, 640, j, {garis: ok ? K.C.lime : K.C.coral}); K.text(c, ok ? '✓' : '✗', 1660, y + 128, {size: 48, weight: 800, color: ok ? K.C.lime : K.C.coral}); c.restore(); } });
    const pc = K.out(K.seg(t, D * .82, D * .9)); if (pc > 0) K.text(c, 'Singkatan dan salah ketik tidak dikenali', 120, 760, {size: 36, weight: 800, color: K.C.coral, alpha: pc});
  },
  mirip(c, t, D) {
    K.bg(c); K.judul(c, 'Mencari yang paling mirip', t, K.C.teal, 'Potongan huruf → skor kemiripan 0 sampai 1');
    const pot = s => { const r = []; for (let i = 0; i + 3 <= s.length; i++) r.push(s.slice(i, i + 3)); return r; };
    const a = 'perpus', b = 'perpustakaan', pa = pot(a), pb = pot(b);
    const p1 = K.out(K.seg(t, .4, 1.2)), p2 = K.out(K.seg(t, D * .18, D * .3)), p3 = K.out(K.seg(t, D * .3, D * .45));
    c.save(); c.globalAlpha = p1; K.text(c, '"perpus"', 140, 270, {size: 44, weight: 800, mono: true, color: K.C.amber}); K.text(c, '"perpustakaan"', 140, 430, {size: 44, weight: 800, mono: true, color: K.C.sky}); c.restore();
    if (p2 > 0) { c.save(); c.globalAlpha = p2; pa.forEach((x, i) => { K.rrect(c, 560 + i * 120, 240, 104, 60, 12, 'rgba(255,176,32,.16)', K.C.amber, 3); K.text(c, x, 612 + i * 120, 270, {size: 30, weight: 800, mono: true, align: 'center', color: K.C.amber}); });
      pb.forEach((x, i) => { const sama = pa.includes(x) && p3 > 0; K.rrect(c, 560 + i * 112, 400, 100, 60, 12, sama ? 'rgba(163,230,53,.25)' : '#16203a', sama ? K.C.lime : K.C.garis, 3); K.text(c, x, 610 + i * 112, 430, {size: 28, weight: 800, mono: true, align: 'center', color: sama ? K.C.lime : K.C.redup}); }); c.restore(); }
    if (p3 > 0) K.text(c, '4 potongan sama → tetap mirip', 560, 520, {size: 34, weight: 800, color: K.C.lime, alpha: p3});
    // skor
    const ps = K.out(K.seg(t, D * .55, D * .65)); if (ps <= 0) return;
    const S = [['kantin buka jam berapa', .03], ['kapan ulangan matematika', .08], ['di mana ruang perpustakaan', .67], ['ekskul apa saja yang ada', .10], ['seragam hari jumat apa', .05]];
    c.save(); c.globalAlpha = ps; K.text(c, 'Pesan: "Perpus di mana ya?"', 140, 620, {size: 34, weight: 800, color: K.C.amber});
    S.forEach(([q, s], i) => { const y = 680 + i * 70, g = K.out(K.seg(t, D * .62 + i * .25, D * .62 + i * .25 + .6)), top = s > .5 && t > D * .85;
      K.text(c, q, 140, y + 22, {size: 28, weight: 700, mono: true, color: top ? K.C.lime : K.C.teks}); K.rrect(c, 760, y, 800, 44, 10, '#16203a');
      K.rrect(c, 760, y, Math.max(1, 800 * s * g), 44, 10, top ? K.C.lime : K.C.teal); K.text(c, (s * g).toFixed(2), 1590, y + 22, {size: 28, weight: 800, mono: true, color: top ? K.C.lime : K.C.redup}); });
    if (t > D * .85) K.text(c, '← skor tertinggi', 1680, 680 + 2 * 70 + 22, {size: 28, weight: 800, color: K.C.lime});
    c.restore();
  },
  besar(c, t, D) {
    K.bg(c); K.judul(c, 'Chatbot AI besar', t, K.C.violet, 'Belajar dari miliaran kalimat, menebak kata berikutnya');
    const p1 = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p1;
    for (let i = 0; i < 60; i++) { const x = 140 + (i % 10) * 46, y = 260 + Math.floor(i / 10) * 60; K.rrect(c, x, y, 38, 48, 4, '#1f2a48', K.C.garis, 2); }
    K.text(c, 'miliaran kalimat', 370, 660, {size: 34, weight: 800, align: 'center', color: K.C.redup}); c.restore();
    const p2 = K.out(K.seg(t, D * .2, D * .3)); if (p2 > 0) { K.arrow(c, 620, 450, 720, 450, K.C.teks, 6, p2); c.save(); c.globalAlpha = p2;
      const kata = ['Kantin', 'buka', 'jam', '7', 'pagi'], n = Math.min(5, 1 + Math.floor(K.seg(t, D * .3, D * .6) * 5)); let x = 760;
      for (let i = 0; i < n; i++) { const w = K.lebar(c, kata[i], 40, 800) + 40, baru = i === n - 1 && n > 1; K.rrect(c, x, 410, w, 80, 16, baru ? 'rgba(167,139,250,.25)' : '#1f2a48', baru ? K.C.violet : K.C.garis, 3);
        K.text(c, kata[i], x + w / 2, 450, {size: 40, weight: 800, align: 'center', color: baru ? K.C.violet : K.C.teks}); x += w + 16; }
      K.text(c, 'menebak kata berikutnya, satu per satu', 760, 560, {size: 32, weight: 700, color: K.C.redup}); c.restore(); }
    const p3 = K.out(K.seg(t, D * .62, D * .72)); if (p3 > 0) { K.panel(c, 760, 640, 1000, 300, p3, K.C.amber); c.save(); c.globalAlpha = p3;
      K.text(c, 'Bisa salah atau mengarang', 820, 710, {size: 40, weight: 800, color: K.C.amber}); K.text(c, '• Periksa lagi jawabannya', 820, 790, {size: 34, weight: 600});
      K.text(c, '• Jangan bagikan data pribadimu', 820, 860, {size: 34, weight: 600}); c.restore(); }
  },
});
K.ikonKunci = (c, x, y, s, w) => { c.save(); c.strokeStyle = w; c.lineWidth = s * .06; c.beginPath(); c.arc(x - s * .15, y, s * .16, 0, 7); c.moveTo(x, y); c.lineTo(x + s * .34, y); c.lineTo(x + s * .34, y + s * .12); c.moveTo(x + s * .22, y); c.lineTo(x + s * .22, y + s * .1); c.stroke(); c.restore(); };
K.ikonMirip = (c, x, y, s, w) => { c.save(); c.strokeStyle = w; c.lineWidth = s * .05; c.beginPath(); c.arc(x - s * .1, y, s * .22, 0, 7); c.stroke(); c.beginPath(); c.arc(x + s * .1, y, s * .22, 0, 7); c.stroke(); c.restore(); };
K.ikonAmbang = (c, x, y, s, w) => { c.save(); c.strokeStyle = w; c.lineWidth = s * .05; c.setLineDash([s * .06, s * .05]); c.beginPath(); c.moveTo(x - s * .35, y); c.lineTo(x + s * .35, y); c.stroke(); c.setLineDash([]);
  [[-.25, .25], [-.05, -.2], [.15, .3], [.3, -.1]].forEach(([a, b]) => { c.fillStyle = w; c.fillRect(x + a * s - s * .04, y + (b < 0 ? b * s : 0), s * .08, Math.abs(b) * s); }); c.restore(); };
