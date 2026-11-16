// T10 Website daftar tugas: HTML/CSS/JS, data dan tampilan, localStorage + JSON
K.layar = (c, x, y, w, h, items, o = {}) => { // layar browser mini berisi daftar tugas
  K.rrect(c, x, y, w, h, 18, '#eef2ff', K.C.garis, 4); K.rrect(c, x, y, w, 46, [18, 18, 0, 0], '#cfd6ea');
  [0, 1, 2].forEach(i => { c.fillStyle = ['#ff6b6b', '#ffb020', '#4ade80'][i]; c.beginPath(); c.arc(x + 28 + i * 26, y + 23, 8, 0, 7); c.fill(); });
  K.text(c, 'Daftar Tugas', x + 30, y + 95, {size: 38, weight: 800, color: '#4338ca'});
  K.rrect(c, x + 30, y + 135, w * .6, 54, 6, '#fff', '#9aa6c4', 2); K.rrect(c, x + 50 + w * .6, y + 135, w * .3 - 80, 54, 10, '#4338ca');
  K.text(c, 'Tambah', x + 50 + w * .6 + (w * .3 - 80) / 2, y + 163, {size: 24, weight: 700, align: 'center', color: '#fff'});
  items.forEach((it, i) => { const a = it.a ?? 1; if (a <= 0) return; c.save(); c.globalAlpha *= a; const yy = y + 215 + i * 74;
    K.rrect(c, x + 30, yy, w - 60, 60, 10, '#fff'); K.text(c, it.teks, x + 52, yy + 31, {size: 26, weight: 600, color: it.selesai ? '#999' : '#1f2937'});
    if (it.selesai) { c.fillStyle = '#999'; c.fillRect(x + 50, yy + 31, K.lebar(c, it.teks, 26, 600) + 4, 3); } c.restore(); });
};
const TG = ['PR Matematika', 'Bawa baju olahraga', 'Belajar ulangan IPA'];
Object.assign(K.adegan, {
  rumah(c, t, D) {
    K.bg(c); K.judul(c, 'Tiga bahasa sebuah website', t, K.C.sky, 'Kerangka, tampilan, dan perilaku');
    const p1 = K.out(K.seg(t, D * .12, D * .22)), p2 = K.out(K.seg(t, D * .42, D * .52)), p3 = K.out(K.seg(t, D * .72, D * .8));
    // rumah
    const hx = 330, hy = 330; c.save(); c.globalAlpha = K.out(K.seg(t, .4, 1.2));
    c.beginPath(); c.moveTo(hx - 40, hy + 140); c.lineTo(hx + 210, hy - 30); c.lineTo(hx + 460, hy + 140); c.closePath();
    c.fillStyle = p2 > 0 ? `rgba(244,114,182,${.85 * p2})` : 'transparent'; c.fill(); c.strokeStyle = K.C.teks; c.lineWidth = 6; c.stroke();
    c.fillStyle = `rgba(253,230,138,${.9 * p2})`; c.fillRect(hx, hy + 140, 420, 330); c.strokeRect(hx, hy + 140, 420, 330);
    c.fillStyle = p2 > 0 ? `rgba(96,165,250,${p2})` : 'transparent'; c.fillRect(hx + 160, hy + 300, 100, 170); c.strokeRect(hx + 160, hy + 300, 100, 170);
    const lampu = p3 > 0 && t > D * .8; c.fillStyle = lampu ? '#fde047' : '#2a3352'; c.fillRect(hx + 40, hy + 200, 90, 80); c.fillRect(hx + 290, hy + 200, 90, 80);
    c.strokeRect(hx + 40, hy + 200, 90, 80); c.strokeRect(hx + 290, hy + 200, 90, 80);
    if (lampu) { c.fillStyle = 'rgba(253,224,71,.18)'; c.beginPath(); c.arc(hx + 85, hy + 240, 90, 0, 7); c.arc(hx + 335, hy + 240, 90, 0, 7); c.fill(); }
    c.restore();
    const lap = [[p1, 'HTML', 'kerangka dan tembok', '<h1> <input> <button>', K.C.coral], [p2, 'CSS', 'cat dan hiasan', 'color: #4338ca;', K.C.pink], [p3, 'JavaScript', 'listrik: tombol bekerja', 'onclick="tambah()"', K.C.amber]];
    lap.forEach(([p, j, s, k, w], i) => { if (p <= 0) return; const y = 250 + i * 240; K.panel(c, 960, y, 820, 200, p, w);
      c.save(); c.globalAlpha = p; K.text(c, j, 1010, y + 60, {size: 48, weight: 800, color: w}); K.text(c, s, 1010, y + 115, {size: 32, weight: 600, color: K.C.redup});
      K.text(c, k, 1010, y + 165, {size: 28, weight: 600, mono: true, color: K.C.teks}); c.restore(); });
  },
  datatampil(c, t, D) {
    K.bg(c); K.judul(c, 'Data dan tampilan', t, K.C.violet, 'Array berisi object → daftar di layar');
    const p1 = K.out(K.seg(t, .4, 1.2)); c.save(); c.globalAlpha = p1;
    K.text(c, 'DATA', 380, 250, {size: 40, weight: 800, align: 'center', color: K.C.violet}); K.text(c, 'let tugas = [', 120, 320, {size: 32, weight: 700, mono: true});
    TG.forEach((s, i) => { const q = K.out(K.seg(t, D * .15 + i * .5, D * .15 + i * .5 + .5)), y = 370 + i * 150; c.save(); c.globalAlpha *= q;
      K.rrect(c, 150, y, 520, 120, 16, '#1e1b3a', K.C.violet, 4); K.text(c, `teks: "${s}"`, 180, y + 40, {size: 26, weight: 700, mono: true});
      K.text(c, 'selesai: false', 180, y + 85, {size: 26, weight: 700, mono: true, color: K.C.redup}); c.restore(); });
    K.text(c, ']', 120, 830, {size: 32, weight: 700, mono: true}); c.restore();
    const p2 = K.out(K.seg(t, D * .4, D * .5)); if (p2 <= 0) return;
    c.save(); c.globalAlpha = p2; K.rrect(c, 760, 470, 300, 90, 45, 'rgba(255,176,32,.15)', K.C.amber, 4);
    K.text(c, 'tampilkan()', 910, 515, {size: 34, weight: 800, mono: true, align: 'center', color: K.C.amber});
    K.text(c, 'forEach: satu per satu', 910, 600, {size: 28, weight: 700, align: 'center', color: K.C.redup}); c.restore();
    const q = K.seg(t, D * .5, D * .9), n = q * 3;
    const items = TG.map((s, i) => ({teks: s, a: K.out(K.clamp(n - i))}));
    c.save(); c.globalAlpha = p2; K.layar(c, 1140, 230, 660, 700, items); c.restore();
    if (q > 0 && q < 1) { const i = Math.min(2, Math.floor(n)), f = n - i, y = 430 + i * 150;
      c.fillStyle = K.C.amber; c.beginPath(); c.arc(K.lerp(680, 1170, f), K.lerp(y, 475 + i * 74, f), 12, 0, 7); c.fill();
      K.text(c, '<li>', K.lerp(680, 1170, f), K.lerp(y, 475 + i * 74, f) - 30, {size: 24, weight: 800, mono: true, align: 'center', color: K.C.amber}); }
  },
  laci(c, t, D) {
    K.bg(c); K.judul(c, 'localStorage: laci milik browser', t, K.C.teal, 'Hanya menyimpan teks, jadi pakai JSON');
    const pr = K.seg(t, D * .05, D * .3); // memori hilang saat refresh
    K.panel(c, 120, 230, 560, 330, K.out(K.seg(t, .3, 1)), K.C.coral);
    c.save(); c.globalAlpha = K.out(K.seg(t, .3, 1)); K.text(c, 'Memori (variabel)', 170, 290, {size: 34, weight: 800, color: K.C.coral});
    const hilang = K.seg(t, D * .18, D * .26); TG.forEach((s, i) => K.text(c, s, 170, 360 + i * 56, {size: 28, weight: 600, alpha: 1 - hilang}));
    if (pr > .5) K.text(c, 'refresh → kosong!', 400, 520, {size: 30, weight: 800, align: 'center', color: K.C.coral, alpha: K.out(K.seg(t, D * .2, D * .27))}); c.restore();
    // laci
    const pl = K.out(K.seg(t, D * .3, D * .38)); if (pl <= 0) return;
    c.save(); c.globalAlpha = pl; const lx = 1260, ly = 600; K.rrect(c, lx, ly, 520, 340, 18, '#3b2f22', '#a16207', 6);
    const buka = 70 * K.ease(K.seg(t, D * .45, D * .55)) * (1 - K.ease(K.seg(t, D * .72, D * .8)));
    K.rrect(c, lx + 30, ly + 40 + buka, 460, 120, 10, '#5b4630', '#a16207', 4); K.rrect(c, lx + 200, ly + 90 + buka, 120, 22, 11, '#d6b38a');
    K.rrect(c, lx + 30, ly + 190, 460, 120, 10, '#5b4630', '#a16207', 4); K.rrect(c, lx + 200, ly + 240, 120, 22, 11, '#d6b38a');
    K.text(c, 'localStorage', lx + 260, ly - 36, {size: 36, weight: 800, align: 'center', color: K.C.teal}); c.restore();
    // array -> teks -> laci
    const pa = K.out(K.seg(t, D * .4, D * .48)); if (pa <= 0) return;
    c.save(); c.globalAlpha = pa; K.text(c, '[ {…}, {…}, {…} ]', 300, 700, {size: 40, weight: 800, mono: true, align: 'center', color: K.C.violet}); K.text(c, 'array', 300, 760, {size: 28, weight: 700, align: 'center', color: K.C.redup}); c.restore();
    const ps = K.out(K.seg(t, D * .5, D * .6)); if (ps > 0) { K.arrow(c, 520, 700, 720, 700, K.C.amber, 6, ps); K.text(c, 'JSON.stringify', 620, 650, {size: 26, weight: 800, mono: true, align: 'center', color: K.C.amber, alpha: ps});
      c.save(); c.globalAlpha = ps; K.rrect(c, 740, 650, 440, 100, 12, '#16203a', K.C.amber, 3); K.text(c, '\'[{"teks":"PR Ma…', 960, 700, {size: 26, weight: 700, mono: true, align: 'center', color: K.C.amber}); K.text(c, 'teks', 960, 780, {size: 28, weight: 700, align: 'center', color: K.C.redup}); c.restore();
      K.arrow(c, 1180, 700, 1280, 690, K.C.amber, 6, K.out(K.seg(t, D * .6, D * .66))); K.text(c, 'setItem', 1230, 650, {size: 24, weight: 800, mono: true, align: 'center', color: K.C.amber, alpha: K.out(K.seg(t, D * .6, D * .66))}); }
    const pp = K.out(K.seg(t, D * .8, D * .9)); if (pp > 0) { K.path(c, [[1300, 980], [960, 1010], [300, 1010], [300, 790]], K.C.teal, 6, pp);
      K.text(c, 'getItem + JSON.parse → array lagi', 760, 980, {size: 30, weight: 800, align: 'center', color: K.C.teal, alpha: pp}); }
  },
});
K.ikonRumah = (c, x, y, s, w) => { c.save(); c.strokeStyle = w; c.lineWidth = s * .05; c.beginPath(); c.moveTo(x - s * .35, y); c.lineTo(x, y - s * .32); c.lineTo(x + s * .35, y); c.stroke(); c.strokeRect(x - s * .25, y, s * .5, s * .32); c.restore(); };
K.ikonLaci = (c, x, y, s, w) => { K.rrect(c, x - s * .35, y - s * .3, s * .7, s * .6, s * .05, null, w, s * .05); K.rrect(c, x - s * .1, y - s * .05, s * .2, s * .07, s * .03, w); };
K.ikonCentang = (c, x, y, s, w) => { c.save(); c.strokeStyle = w; c.lineWidth = s * .08; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - s * .28, y); c.lineTo(x - s * .08, y + s * .2); c.lineTo(x + s * .3, y - s * .22); c.stroke(); c.restore(); };
