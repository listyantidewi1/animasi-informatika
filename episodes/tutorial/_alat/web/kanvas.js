// Pustaka animasi konsep: diagram datar bersih, latar gelap. Semua fungsi deterministik terhadap waktu t (detik).
const K = {W: 1920, H: 1080, SC: {}, IMG: {}};
K.C = {bg1: '#121829', bg2: '#1b2440', grid: 'rgba(255,255,255,0.035)', teks: '#eef2fb', redup: '#9aa6c4', panel: '#1f2a48', garis: '#33406a',
  teal: '#2dd4bf', amber: '#ffb020', coral: '#ff6b6b', sky: '#60a5fa', violet: '#a78bfa', lime: '#a3e635', pink: '#f472b6'};
K.F = 'Inter, sans-serif'; K.M = '"DejaVu Sans Mono", monospace';
K.clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
K.ease = x => { x = K.clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
K.out = x => { x = K.clamp(x); return 1 - Math.pow(1 - x, 3); };
K.back = x => { x = K.clamp(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
K.seg = (t, a, b) => K.clamp((t - a) / Math.max(1e-6, b - a));
K.lerp = (a, b, p) => a + (b - a) * p;
K.bg = (c, t = 0) => {
  const g = c.createLinearGradient(0, 0, 0, K.H); g.addColorStop(0, K.C.bg1); g.addColorStop(1, K.C.bg2);
  c.fillStyle = g; c.fillRect(0, 0, K.W, K.H);
  c.fillStyle = K.C.grid; for (let x = 40; x < K.W; x += 48) for (let y = 40; y < K.H; y += 48) c.fillRect(x, y, 2, 2);
};
K.text = (c, s, x, y, o = {}) => {
  c.save(); c.globalAlpha *= (o.alpha ?? 1); c.fillStyle = o.color || K.C.teks;
  c.font = `${o.weight || 600} ${o.size || 40}px ${o.mono ? K.M : K.F}`; c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'middle';
  if (o.maxW) { // bungkus kata
    const words = String(s).split(' '); let line = '', yy = y; const lh = (o.size || 40) * (o.lh || 1.3);
    for (const w of words) { const tl = line ? line + ' ' + w : w; if (c.measureText(tl).width > o.maxW && line) { c.fillText(line, x, yy); line = w; yy += lh; } else line = tl; }
    c.fillText(line, x, yy); c.restore(); return yy;
  }
  c.fillText(s, x, y); c.restore(); return y;
};
K.lebar = (c, s, size = 40, weight = 600, mono = false) => { c.save(); c.font = `${weight} ${size}px ${mono ? K.M : K.F}`; const w = c.measureText(s).width; c.restore(); return w; };
K.rrect = (c, x, y, w, h, r, fill, stroke, lw = 3) => {
  c.beginPath(); c.roundRect(x, y, w, h, r); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
};
K.panel = (c, x, y, w, h, p = 1, warna) => {
  c.save(); c.globalAlpha *= K.out(p); const dy = (1 - K.out(p)) * 30;
  c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 30; c.shadowOffsetY = 10;
  K.rrect(c, x, y + dy, w, h, 22, K.C.panel); c.shadowColor = 'transparent';
  if (warna) K.rrect(c, x, y + dy, 10, h, 5, warna);
  c.restore();
};
K.arrow = (c, x1, y1, x2, y2, warna = K.C.teks, lw = 5, p = 1, head = 18) => {
  if (p <= 0) return; const x = K.lerp(x1, x2, p), y = K.lerp(y1, y2, p);
  c.save(); c.strokeStyle = warna; c.fillStyle = warna; c.lineWidth = lw; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x, y); c.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1); c.beginPath(); c.moveTo(x, y);
  c.lineTo(x - head * Math.cos(a - .45), y - head * Math.sin(a - .45)); c.lineTo(x - head * Math.cos(a + .45), y - head * Math.sin(a + .45)); c.closePath(); c.fill(); c.restore();
};
K.path = (c, pts, warna, lw = 5, p = 1, panah = true) => { // polyline bertahap
  let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let sisa = L * K.clamp(p); c.save(); c.strokeStyle = warna; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(...pts[0]);
  let last = pts[0], ang = 0;
  for (let i = 1; i < pts.length && sisa > 0; i++) { const d = seg[i - 1], f = Math.min(1, sisa / d); const x = K.lerp(pts[i - 1][0], pts[i][0], f), y = K.lerp(pts[i - 1][1], pts[i][1], f); c.lineTo(x, y); ang = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]); last = [x, y]; sisa -= d; }
  c.stroke(); c.restore();
  if (panah && p > 0.02) { c.save(); c.fillStyle = warna; c.beginPath(); c.moveTo(...last); const h = 18; c.lineTo(last[0] - h * Math.cos(ang - .45), last[1] - h * Math.sin(ang - .45)); c.lineTo(last[0] - h * Math.cos(ang + .45), last[1] - h * Math.sin(ang + .45)); c.fill(); c.restore(); }
};
// judul adegan di kiri atas
K.judul = (c, s, t, warna = K.C.amber, sub) => {
  const p = K.out(K.seg(t, 0, .5)); c.save(); c.globalAlpha = p;
  K.rrect(c, 80, 70, 12, 56, 6, warna); K.text(c, s, 112, 99, {size: 46, weight: 800});
  if (sub) K.text(c, sub, 112, 150, {size: 28, weight: 500, color: K.C.redup});
  c.restore();
};
// kotak variabel: label di atas, nilai di dalam
K.kotakVar = (c, x, y, label, nilai, o = {}) => {
  const w = o.w || 300, h = o.h || 170, warna = o.warna || K.C.teal, p = o.p ?? 1, pv = o.pv ?? 1;
  c.save(); c.globalAlpha *= K.out(p); const s = K.lerp(.85, 1, K.back(p)); c.translate(x + w / 2, y + h / 2); c.scale(s, s); c.translate(-(x + w / 2), -(y + h / 2));
  // label
  c.font = `700 30px ${K.M}`; const lw = c.measureText(label).width + 36;
  K.rrect(c, x + w / 2 - lw / 2, y - 26, lw, 52, 14, warna); K.text(c, label, x + w / 2, y, {size: 30, weight: 700, mono: true, color: '#0e1424', align: 'center'});
  // kotak
  K.rrect(c, x, y + 36, w, h, 18, 'rgba(255,255,255,0.04)', warna, 4);
  if (nilai !== null && nilai !== undefined && pv > 0) {
    const dy = (1 - K.out(pv)) * -140; c.globalAlpha *= K.clamp(pv * 3);
    K.text(c, String(nilai), x + w / 2, y + 36 + h / 2 + dy, {size: o.size || 76, weight: 800, align: 'center', mono: o.mono ?? true, color: o.warnaNilai || K.C.teks});
  }
  c.restore();
};
// pewarnaan sintaks Python/HTML/CSS sederhana
K.KW = new Set(['import', 'from', 'as', 'while', 'for', 'in', 'if', 'elif', 'else', 'break', 'True', 'False', 'None', 'def', 'return', 'and', 'or', 'not']);
K.BI = new Set(['print', 'input', 'int', 'len', 'round', 'str', 'range', 'float']);
K.token = (line) => {
  const out = []; const re = /("[^"]*"?|'[^']*'?|#.*$|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|.)/g; let m;
  while ((m = re.exec(line))) { const s = m[0]; let col = '#e6e9f2';
    if (/^["']/.test(s)) col = '#f9a07a'; else if (s[0] === '#') col = '#7c8aa8'; else if (/^\d/.test(s)) col = '#b5e48c';
    else if (K.KW.has(s)) col = '#c792ea'; else if (K.BI.has(s)) col = '#7fdbff'; else if (/^[=<>+\-*/%]+$/.test(s)) col = '#ffcb6b';
    out.push([s, col]); }
  return out;
};
// blok kode; o.chars = jumlah karakter tampil (untuk efek ketik), o.sorot = [baris...]
K.kode = (c, lines, x, y, o = {}) => {
  const size = o.size || 34, lh = size * 1.55, cw = K.lebar(c, 'M', size, 500, true);
  const w = o.w || (Math.max(...lines.map(l => l.length)) * cw + 80), h = lines.length * lh + 50;
  if (!o.tanpaPanel) { K.rrect(c, x, y, w, h, 18, '#0d1222', K.C.garis, 2); }
  let sisa = o.chars ?? 1e9;
  lines.forEach((ln, i) => {
    const yy = y + 25 + lh * i + lh / 2;
    if (o.sorot && o.sorot.includes(i)) { c.save(); c.globalAlpha = o.pSorot ?? 1; K.rrect(c, x + 8, yy - lh / 2 + 2, w - 16, lh - 4, 8, 'rgba(255,176,32,0.16)', 'rgba(255,176,32,0.7)', 2); c.restore(); }
    let xx = x + 40; c.save(); c.font = `500 ${size}px ${K.M}`; c.textBaseline = 'middle';
    if (o.redup && !o.redup.includes(i)) c.globalAlpha = 0.35;
    for (const [s, col] of K.token(ln)) { if (sisa <= 0) break; const ss = s.slice(0, sisa); sisa -= s.length; c.fillStyle = col; c.fillText(ss, xx, yy); xx += c.measureText(ss).width; }
    c.restore(); sisa -= 1;
  });
  return {w, h, lh, cw, x0: x + 40, y0: y + 25};
};
// latar foto beku dari rekaman, diredupkan
K.latar = (c, src, redup = 0.55) => {
  const im = K.IMG[src]; if (im) c.drawImage(im, 0, 0, K.W, K.H); else K.bg(c);
  c.fillStyle = `rgba(10,14,28,${redup})`; c.fillRect(0, 0, K.W, K.H);
};
K.sorotKotak = (c, src, r, p, redup = 0.62) => { // r dalam piksel keluaran: [x,y,w,h]
  const im = K.IMG[src]; if (im) c.drawImage(im, 0, 0, K.W, K.H); else K.bg(c);
  c.save(); c.fillStyle = `rgba(10,14,28,${redup * K.out(p)})`; c.beginPath(); c.rect(0, 0, K.W, K.H);
  c.roundRect(r[0] - 12, r[1] - 10, r[2] + 24, r[3] + 20, 14); c.fill('evenodd');
  c.strokeStyle = K.C.amber; c.lineWidth = 4; c.globalAlpha = K.out(p); c.beginPath(); c.roundRect(r[0] - 12, r[1] - 10, r[2] + 24, r[3] + 20, 14); c.stroke(); c.restore();
};
K.tebak = (c, t, D, src) => { // kartu "Tebak dulu" + hitungan mundur
  K.latar(c, src, 0.72); const p = K.out(K.seg(t, 0, .5));
  c.save(); c.globalAlpha = p; K.rrect(c, K.W / 2 - 260, 180, 520, 92, 46, K.C.amber); K.text(c, 'Tebak dulu!', K.W / 2, 226, {size: 52, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  const t0 = Math.max(.6, D - 3.6), sisa = Math.ceil(K.clamp(3 - (t - t0), 0, 3));
  if (t > t0 && t < t0 + 3) { const f = (t - t0) % 1; c.save(); c.strokeStyle = K.C.amber; c.lineWidth = 14; c.beginPath(); c.arc(K.W / 2, 600, 130, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - f)); c.stroke();
    K.text(c, String(sisa), K.W / 2, 604, {size: 150, weight: 800, align: 'center'}); c.restore(); }
  else if (t <= t0) { K.text(c, '?', K.W / 2, 600, {size: 220, weight: 800, align: 'center', color: K.C.amber, alpha: p}); }
};
K.ikonKotak = (c, x, y, s, warna) => { K.rrect(c, x - s / 2, y - s / 2, s, s, s * .14, null, warna, s * .07); K.text(c, '42', x, y + 3, {size: s * .36, weight: 800, align: 'center', mono: true, color: warna}); };
K.ikonPutar = (c, x, y, s, warna, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); c.strokeStyle = warna; c.lineWidth = s * .08; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, s * .36, .4, Math.PI * 1.75); c.stroke();
  const a = Math.PI * 1.75; c.fillStyle = warna; c.beginPath(); const px = Math.cos(a) * s * .36, py = Math.sin(a) * s * .36; c.moveTo(px + s * .14, py); c.lineTo(px - s * .08, py - s * .12); c.lineTo(px - s * .06, py + s * .13); c.fill(); c.restore(); };
K.ikonCabang = (c, x, y, s, warna) => { c.save(); c.strokeStyle = warna; c.lineWidth = s * .08; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y + s * .4); c.lineTo(x, y); c.lineTo(x - s * .32, y - s * .36); c.moveTo(x, y); c.lineTo(x, y - s * .4); c.moveTo(x, y); c.lineTo(x + s * .32, y - s * .36); c.stroke(); c.restore(); };
// kartu judul episode
K.kartuJudul = (c, t, D, a) => {
  if (a.bg) K.latar(c, a.bg, 0.8); else K.bg(c);
  const p1 = K.out(K.seg(t, .1, .7)), p2 = K.out(K.seg(t, .5, 1.2)), p3 = K.out(K.seg(t, 1.1, 1.8));
  c.save(); c.globalAlpha = p1; K.rrect(c, 140, 300 - 10 * (1 - p1), 500, 56, 28, K.C.amber);
  K.text(c, 'PROYEK PEMROGRAMAN SEDERHANA', 390, 329 - 10 * (1 - p1), {size: 22, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  c.save(); c.globalAlpha = p2; let y = 420 + 20 * (1 - p2);
  for (const b of a.judul.split('\n')) { K.text(c, b, 140, y, {size: 88, weight: 800}); y += 108; } c.restore();
  if (a.ep) K.text(c, a.ep, 140, y + 10, {size: 30, weight: 700, color: K.C.amber, alpha: p2});
  if (a.hook) { c.save(); c.globalAlpha = p3; K.text(c, a.hook, 140, y + 80, {size: 40, weight: 500, color: '#c9d3ee', maxW: 1500, lh: 1.35}); c.restore(); }
};
K.kartuPenutup = (c, t, D, a) => {
  K.bg(c); const p = K.out(K.seg(t, 0, .6)), p2 = K.out(K.seg(t, D * .45, D * .45 + .6));
  K.judul(c, 'Tantangan untukmu', t, K.C.amber);
  K.panel(c, 140, 220, 1640, 330, p, K.C.amber);
  c.save(); c.globalAlpha = p; K.text(c, a.tantangan, 200, 300, {size: 44, weight: 600, maxW: 1520, lh: 1.4}); c.restore();
  if (a.berikut) { c.save(); c.globalAlpha = p2; K.text(c, 'Episode berikutnya', 140, 680, {size: 30, weight: 700, color: K.C.redup});
    K.text(c, a.berikut, 140, 750, {size: 60, weight: 800, maxW: 1640}); c.restore(); }
};
K.rangkuman = (c, t, D, a) => { // a.item = [{ikon:'kotak'|'putar'|'cabang'|..., warna, judul, kode}]
  K.bg(c); K.judul(c, a.judul || 'Yang kamu pelajari hari ini', t, K.C.teal);
  const n = a.item.length, w = Math.min(520, (1680 - (n - 1) * 40) / n), x0 = (K.W - (n * w + (n - 1) * 40)) / 2;
  a.item.forEach((it, i) => {
    const p = K.out(K.seg(t, .5 + i * (D * .5 / n), 1.1 + i * (D * .5 / n))); const x = x0 + i * (w + 40);
    K.panel(c, x, 260, w, 560, p, it.warna);
    c.save(); c.globalAlpha = p; const fn = K['ikon' + it.ikon]; if (fn) fn(c, x + w / 2, 410, 170, it.warna, 0); else if (it.gambar) it.gambar(c, x + w / 2, 410, 170, it.warna);
    K.text(c, it.judul, x + w / 2, 560, {size: 46, weight: 800, align: 'center'});
    K.text(c, it.sub, x + w / 2, 620, {size: 28, weight: 500, align: 'center', color: K.C.redup, maxW: w - 60});
    if (it.kode) K.text(c, it.kode, x + w / 2, 740, {size: 30, weight: 600, align: 'center', mono: true, color: it.warna});
    c.restore();
  });
};
K.adegan = {judul: K.kartuJudul, penutup: K.kartuPenutup, rangkuman: K.rangkuman, tebak: (c, t, D, a) => K.tebak(c, t, D, a.bg)};
