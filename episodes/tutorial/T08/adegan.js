// T08 Sandi Caesar: geser huruf, huruf jadi angka, fungsi, modulo, brute force, sandi modern
const AB = 'abcdefghijklmnopqrstuvwxyz';
K.ubin = (c, x, y, s, h, o = {}) => { // satu ubin huruf
  K.rrect(c, x, y, s, s, s * .16, o.isi || '#16203a', o.garis || K.C.garis, o.lw || 3);
  K.text(c, h, x + s / 2, y + s / 2 + 2, {size: s * .5, weight: 800, mono: true, align: 'center', color: o.warna || K.C.teks});
  if (o.nomor !== undefined) K.text(c, String(o.nomor), x + s / 2, y + s + 22, {size: s * .3, weight: 700, mono: true, align: 'center', color: o.wn || K.C.redup});
};
Object.assign(K.adegan, {
  caesar(c, t, D) {
    K.bg(c); K.judul(c, 'Sandi Caesar', t, K.C.amber, 'Setiap huruf digeser 3 langkah');
    const s = 62, g = 8, x0 = (K.W - 26 * (s + g)) / 2 + g / 2, p = K.out(K.seg(t, .4, 1.2));
    const geser = 3 * K.ease(K.seg(t, D * .2, D * .35));
    c.save(); c.globalAlpha = p;
    for (let i = 0; i < 26; i++) K.ubin(c, x0 + i * (s + g), 280, s, AB[i].toUpperCase());
    c.save(); c.beginPath(); c.rect(x0 - 4, 420, 26 * (s + g), s + 10); c.clip();
    for (let i = -3; i < 29; i++) { const k = ((i + 26) % 26); K.ubin(c, x0 + (i - geser) * (s + g), 425, s, AB[k].toUpperCase(), {garis: K.C.teal, warna: K.C.teal}); } c.restore();
    c.restore();
    const pa = K.out(K.seg(t, D * .38, D * .5)); if (pa > 0) for (let i = 0; i < 3; i++) K.arrow(c, x0 + i * (s + g) + s / 2, 350, x0 + i * (s + g) + s / 2, 418, K.C.amber, 5, pa, 14);
    if (pa > 0) K.text(c, 'A → D,  B → E,  C → F', K.W / 2, 560, {size: 40, weight: 800, mono: true, align: 'center', color: K.C.amber, alpha: pa});
    const pm = K.out(K.seg(t, D * .55, D * .7));
    if (pm > 0) { c.save(); c.globalAlpha = pm; const w = 'SERANG', v = 'VHUDQJ';
      for (let i = 0; i < 6; i++) { K.ubin(c, 560 + i * 86, 680, 74, w[i]); K.ubin(c, 560 + i * 86, 820, 74, i / 6 < K.seg(t, D * .62, D * .78) ? v[i] : w[i], {garis: K.C.teal, warna: K.C.teal}); }
      K.text(c, 'pesan', 520, 717, {size: 30, weight: 700, align: 'right', color: K.C.redup}); K.text(c, 'sandi', 520, 857, {size: 30, weight: 700, align: 'right', color: K.C.teal}); c.restore(); }
    const pk = K.out(K.seg(t, D * .82, D * .9)); if (pk > 0) { c.save(); c.globalAlpha = pk; K.rrect(c, 1180, 740, 380, 110, 55, 'rgba(255,176,32,.14)', K.C.amber, 4); K.text(c, 'kunci = 3', 1370, 797, {size: 44, weight: 800, mono: true, align: 'center', color: K.C.amber}); c.restore(); }
  },
  nomor(c, t, D) {
    K.bg(c); K.judul(c, 'Huruf menjadi angka', t, K.C.sky, 'Setiap huruf punya nomor urut, mulai dari 0');
    const s = 62, g = 8, x0 = (K.W - 26 * (s + g)) / 2 + g / 2;
    for (let i = 0; i < 26; i++) { const p = K.out(K.seg(t, .3 + i * .04, .7 + i * .04)); c.save(); c.globalAlpha = p;
      const aktif = (t > D * .45 && i === 2) || (t > D * .7 && i === 5);
      K.ubin(c, x0 + i * (s + g), 330, s, AB[i], {nomor: i, garis: aktif ? K.C.amber : K.C.garis, warna: aktif ? K.C.amber : K.C.teks, wn: aktif ? K.C.amber : K.C.redup}); c.restore(); }
    const p1 = K.out(K.seg(t, D * .45, D * .55)), p2 = K.out(K.seg(t, D * .58, D * .68)), p3 = K.out(K.seg(t, D * .7, D * .8));
    if (p1 > 0) { const xc = x0 + 2 * (s + g) + s / 2, xf = x0 + 5 * (s + g) + s / 2; c.save(); c.globalAlpha = p1;
      K.text(c, 'c', 640, 620, {size: 70, weight: 800, mono: true, align: 'center', color: K.C.amber}); K.text(c, '→  2', 760, 620, {size: 60, weight: 800, mono: true, color: K.C.teks}); c.restore();
      if (p2 > 0) { c.save(); c.globalAlpha = p2; K.text(c, '+ 3  =  5', 960, 620, {size: 60, weight: 800, mono: true, color: K.C.teal}); c.restore(); K.path(c, [[xc, 300], [xc, 270], [xf, 270], [xf, 300]], K.C.teal, 4, p2); }
      if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, '→  f', 1340, 620, {size: 60, weight: 800, mono: true, color: K.C.amber}); c.restore(); } }
    const pk = K.out(K.seg(t, D * .82, D * .9)); if (pk > 0) { c.save(); c.globalAlpha = pk; K.kode(c, ['huruf.index("c")   # 2', 'huruf[5]           # "f"'], 640, 760, {size: 32}); c.restore(); }
  },
  fungsi(c, t, D) {
    K.bg(c); K.judul(c, 'Fungsi seperti mesin', t, K.C.violet, 'Masukan → proses → keluaran');
    const p = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p;
    K.rrect(c, 760, 360, 400, 300, 30, '#1e1b3a', K.C.violet, 5); K.text(c, 'kunci( )', 960, 430, {size: 46, weight: 800, mono: true, align: 'center', color: K.C.violet});
    K.ikonPutar(c, 960, 560, 120, K.C.violet, t * 2);
    K.text(c, 'pesan', 380, 430, {size: 34, weight: 800, align: 'center', color: K.C.teks}); K.text(c, 'geser = 3', 380, 590, {size: 34, weight: 800, mono: true, align: 'center', color: K.C.amber});
    K.arrow(c, 520, 430, 750, 450, K.C.teks, 5, 1); K.arrow(c, 520, 590, 750, 570, K.C.amber, 5, 1); K.arrow(c, 1170, 510, 1350, 510, K.C.teal, 5, 1);
    K.text(c, 'sandi', 1500, 510, {size: 34, weight: 800, align: 'center', color: K.C.teal}); c.restore();
    const msg = 'jam 7', out = 'mdp 7', q = K.seg(t, D * .35, D * .85), n = Math.floor(q * msg.length * 1.0001);
    for (let i = 0; i < msg.length; i++) { const lew = i < n, bx = 200 + i * 70, by = 780;
      if (!lew) K.ubin(c, bx, by, 60, msg[i] === ' ' ? '␣' : msg[i]);
      else { const ok = AB.includes(msg[i]); K.ubin(c, 1300 + i * 70, by, 60, out[i] === ' ' ? '␣' : out[i], {garis: ok ? K.C.teal : K.C.redup, warna: ok ? K.C.teal : K.C.redup}); } }
    if (q > 0) { const i = Math.min(msg.length - 1, n), ok = AB.includes(msg[i]);
      K.text(c, ok ? `"${msg[i]}" huruf: geser` : `"${msg[i] === ' ' ? 'spasi' : msg[i]}" bukan huruf: biarkan`, 960, 740, {size: 34, weight: 800, align: 'center', color: ok ? K.C.teal : K.C.redup}); }
  },
  modulo(c, t, D) {
    K.bg(c); K.judul(c, 'Modulo: abjad yang melingkar', t, K.C.teal, '28 % 26 = 2, sisa pembagian');
    // jam dinding
    const pj = K.out(K.seg(t, .4, 1.2)), jx = 420, jy = 580, R = 230; c.save(); c.globalAlpha = pj;
    c.beginPath(); c.arc(jx, jy, R, 0, 7); c.fillStyle = '#16203a'; c.fill(); c.strokeStyle = K.C.garis; c.lineWidth = 6; c.stroke();
    for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; K.text(c, String(i), jx + Math.cos(a) * (R - 40), jy + Math.sin(a) * (R - 40), {size: 34, weight: 800, align: 'center'}); }
    const jam = 11 + 3 * K.ease(K.seg(t, D * .12, D * .3)), aj = jam / 12 * Math.PI * 2 - Math.PI / 2;
    c.strokeStyle = K.C.amber; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(jx, jy); c.lineTo(jx + Math.cos(aj) * (R - 90), jy + Math.sin(aj) * (R - 90)); c.stroke(); c.restore();
    const pt = K.out(K.seg(t, D * .3, D * .38)); if (pt > 0) K.text(c, '11 + 3 → pukul 2', jx, 880, {size: 40, weight: 800, align: 'center', color: K.C.amber, alpha: pt});
    // roda abjad
    const pr = K.out(K.seg(t, D * .4, D * .5)), rx = 1330, ry = 560, RR = 300; if (pr <= 0) return;
    c.save(); c.globalAlpha = pr; c.beginPath(); c.arc(rx, ry, RR + 40, 0, 7); c.strokeStyle = K.C.garis; c.lineWidth = 3; c.stroke();
    const pos = 25 + 3 * K.ease(K.seg(t, D * .55, D * .75));
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 - Math.PI / 2, akt = (i === 25 && t < D * .75) || (i === 2 && t >= D * .75);
      K.text(c, AB[i], rx + Math.cos(a) * RR, ry + Math.sin(a) * RR, {size: 34, weight: 800, mono: true, align: 'center', color: akt ? K.C.amber : K.C.teks}); }
    const ap = pos / 26 * Math.PI * 2 - Math.PI / 2; c.fillStyle = K.C.amber; c.beginPath(); c.arc(rx + Math.cos(ap) * (RR + 40), ry + Math.sin(ap) * (RR + 40), 14, 0, 7); c.fill();
    K.text(c, `${Math.round(pos)} % 26 = ${Math.round(pos) % 26}`, rx, ry - 20, {size: 46, weight: 800, mono: true, align: 'center', color: K.C.teal});
    K.text(c, t >= D * .75 ? 'z → c' : 'z = 25', rx, ry + 50, {size: 40, weight: 800, mono: true, align: 'center', color: K.C.amber}); c.restore();
  },
  bobol(c, t, D) {
    K.bg(c); K.judul(c, 'Membobol sandi: brute force', t, K.C.coral, 'Coba semua kunci, cari yang bisa dibaca');
    const sandi = 'uhuap zvyl', buka = g => sandi.split('').map(h => AB.includes(h) ? AB[(AB.indexOf(h) - g + 26) % 26] : h).join('');
    const n = Math.min(26, Math.floor(K.seg(t, D * .3, D * .8) * 26));
    K.text(c, `Hanya 26 kemungkinan kunci`, 140, 230, {size: 40, weight: 800, color: K.C.amber, alpha: K.out(K.seg(t, .5, 1.2))});
    for (let g = 0; g < n; g++) { const col = Math.floor(g / 9), row = g % 9, x = 140 + col * 600, y = 320 + row * 72, ok = g === 7;
      K.text(c, String(g).padStart(2, ' '), x, y, {size: 32, weight: 700, mono: true, color: K.C.redup});
      K.text(c, buka(g), x + 70, y, {size: 34, weight: ok ? 800 : 600, mono: true, color: ok ? '#4ade80' : K.C.teks, alpha: ok ? 1 : .7});
      if (ok && t > D * .82) { c.save(); c.globalAlpha = K.out(K.seg(t, D * .82, D * .9)); K.rrect(c, x - 16, y - 30, 290, 60, 12, null, '#4ade80', 4); K.text(c, '← bisa dibaca!', x + 290, y, {size: 30, weight: 800, color: '#4ade80'}); c.restore(); } }
  },
  modern(c, t, D) {
    K.bg(c); K.judul(c, 'Sandi modern', t, K.C.teal, 'Kemungkinan kunci yang sangat banyak');
    const p1 = K.out(K.seg(t, .4, 1.2)), p2 = K.out(K.seg(t, D * .25, D * .4)), p3 = K.out(K.seg(t, D * .55, D * .7));
    c.save(); c.globalAlpha = p1; K.panel(c, 140, 260, 1640, 160, 1, K.C.coral); K.text(c, 'Sandi Caesar', 200, 340, {size: 40, weight: 800}); K.text(c, '26 kunci', 1720, 340, {size: 52, weight: 800, mono: true, align: 'right', color: K.C.coral}); c.restore();
    if (p2 > 0) { c.save(); c.globalAlpha = p2; K.panel(c, 140, 470, 1640, 240, 1, K.C.teal); K.text(c, 'Sandi modern (kunci 128 bit)', 200, 540, {size: 40, weight: 800});
      const n = '340.282.366.920.938.463.463.374.607.431.768.211.456', k = Math.floor(n.length * K.seg(t, D * .3, D * .5)); K.text(c, n.slice(0, k), 200, 630, {size: 40, weight: 800, mono: true, color: K.C.teal}); c.restore(); }
    if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, 'Butir pasir di seluruh bumi: kira-kira 7.500.000.000.000.000.000', 140, 800, {size: 34, weight: 700, color: K.C.redup});
      K.text(c, 'Terlalu banyak untuk dicoba satu per satu, bahkan oleh komputer tercepat', 140, 880, {size: 36, weight: 800, color: K.C.amber}); c.restore(); }
  },
});
K.ikonUbin = (c, x, y, s, w) => { K.ubin(c, x - s * .45, y - s * .3, s * .42, 'a', {garis: w}); K.ubin(c, x + s * .05, y - s * .3, s * .42, 'd', {garis: w, warna: w}); };
K.ikonMesin = (c, x, y, s, w) => { K.rrect(c, x - s * .35, y - s * .3, s * .7, s * .6, s * .1, null, w, s * .05); K.ikonPutar(c, x, y, s * .45, w); };
K.ikonRoda = (c, x, y, s, w) => { c.strokeStyle = w; c.lineWidth = s * .05; c.beginPath(); c.arc(x, y, s * .38, 0, 7); c.stroke(); K.text(c, '%', x, y + 4, {size: s * .4, weight: 800, align: 'center', color: w}); };
K.ikonGembok = (c, x, y, s, w) => { c.strokeStyle = w; c.lineWidth = s * .06; c.beginPath(); c.arc(x, y - s * .1, s * .2, Math.PI, 0); c.stroke(); K.rrect(c, x - s * .32, y - s * .1, s * .64, s * .45, s * .06, w); };
