// Adegan kanvas untuk video "Vibe Coding Film Animasi 3D: Paket Terakhir Malam Ini". Memakai pustaka K (kanvas.js).
(() => {
const C = K.C, T = K.text, S = K.seg, O = K.out;
const BAB = ['Kait', 'Memasang alat', 'Dari ide ke storyboard', 'Kerangka film', 'Kota yang basah', 'Kurir, motor, kucing', 'Kamera sinematik', 'Suara', 'Render', 'Cek kerjaan AI', 'Penutup'];

// gambar a.bg ditampilkan utuh (contain) di dalam kotak [x,y,w,h]; mengembalikan kotak gambar
function pasang(c, src, x, y, w, h, p = 1) {
  const im = K.IMG[src]; if (!im) return [x, y, w, h];
  const k = Math.min(w / im.width, h / im.height), gw = im.width * k, gh = im.height * k, gx = x + (w - gw) / 2, gy = y + (h - gh) / 2;
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 40; c.shadowOffsetY = 12;
  c.fillStyle = '#000'; c.fillRect(gx, gy, gw, gh); c.shadowColor = 'transparent'; c.drawImage(im, gx, gy, gw, gh);
  c.strokeStyle = '#3a4566'; c.lineWidth = 3; c.strokeRect(gx, gy, gw, gh); c.restore();
  return [gx, gy, gw, gh];
}
function pita(c, teks, y, p, warna = C.amber) {
  c.save(); c.globalAlpha *= p; const w = Math.min(1700, K.lebar(c, teks, 38, 700) + 90);
  K.rrect(c, 960 - w / 2, y - 42, w, 84, 22, 'rgba(20,24,38,.95)'); K.rrect(c, 960 - w / 2, y - 42, 14, 84, 7, warna);
  T(c, teks, 960 + 7, y, {size: 38, weight: 700, align: 'center', maxW: w - 70}); c.restore();
}

K.adegan.judul = (c, t, D, a) => {
  if (a.bg) K.latar(c, a.bg, 0.72); else K.bg(c);
  const p = O(S(t, .2, .9)), q = O(S(t, .8, 1.5));
  c.save(); c.globalAlpha = p; K.rrect(c, 160, 250, 330, 60, 30, C.amber); T(c, 'VIBE CODING', 325, 281, {size: 26, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  (a.judul || '').split('\n').forEach((s, i) => T(c, s, 160 + 30 * (1 - p), 400 + i * 104, {size: 88, weight: 800, alpha: p}));
  if (a.hook) T(c, a.hook, 160, 720, {size: 40, weight: 500, color: C.redup, maxW: 1500, lh: 1.4, alpha: q});
};

K.adegan.bab = (c, t, D, a) => {
  K.bg(c); const n = a.n, p = O(S(t, .15, .8)), q = O(S(t, .5, 1.2)), out = K.clamp((D - t) / .45);
  c.save(); c.globalAlpha = out;
  c.save(); c.globalAlpha *= p; K.rrect(c, 160, 330, 210, 60, 30, C.amber); T(c, 'BAB ' + n, 265, 361, {size: 28, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  c.save(); c.globalAlpha *= q; T(c, BAB[n], 160 + 30 * (1 - q), 470, {size: 96, weight: 800}); if (a.sub) T(c, a.sub, 160, 570, {size: 40, weight: 500, color: C.redup}); c.restore();
  const x0 = 160, w = 1600, y = 760;
  c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(x0, y - 3, w, 6);
  for (let i = 0; i < BAB.length; i++) { const x = x0 + w * i / (BAB.length - 1), on = i === n, done = i < n;
    c.save(); c.globalAlpha *= O(S(t, .2 + i * .04, .6 + i * .04)); c.beginPath(); c.arc(x, y, on ? 18 : 10, 0, Math.PI * 2);
    c.fillStyle = on ? C.amber : done ? C.teal : '#3a4566'; c.fill(); c.restore(); }
  c.restore();
};

K.adegan.teks = (c, t, D, a) => { // kartu teks sederhana; isi muncul merata sepanjang durasi
  K.bg(c); K.judul(c, a.judul, t, a.warna || C.amber, a.sub);
  const n = (a.isi || []).length, langkah = a.cepat ? .5 : Math.max(.5, (D * .75) / Math.max(1, n));
  (a.isi || []).forEach((s, i) => { const p = O(S(t, .5 + i * langkah, 1.1 + i * langkah)); c.save(); c.globalAlpha = p;
    K.rrect(c, 160, 318 + i * (a.jarak || 118), 14, 14, 7, a.warna || C.amber);
    T(c, s, 200, 326 + i * (a.jarak || 118), {size: a.size || 44, weight: 600, maxW: 1560, lh: 1.3}); c.restore(); });
};

K.adegan.pelajaran = (c, t, D, a) => { // tulisan besar: pelajaran dari sesi
  if (a.bg) K.latar(c, a.bg, 0.82); else K.bg(c);
  const p = O(S(t, .2, .9)), q = O(S(t, .9, 1.6));
  c.save(); c.globalAlpha = p; const lab = a.label || 'PELAJARAN', lw = K.lebar(c, lab, 26, 800) + 70;
  K.rrect(c, 960 - lw / 2, 300, lw, 60, 30, a.warna || C.coral); T(c, lab, 960, 331, {size: 26, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  T(c, a.teks, 960, 520 + 20 * (1 - p), {size: a.size || 68, weight: 800, align: 'center', maxW: 1500, lh: 1.3, alpha: p});
  if (a.sub) T(c, a.sub, 960, 800, {size: 38, weight: 500, align: 'center', color: C.redup, maxW: 1400, alpha: q});
};

// gambar hasil (lembar kontak, foto) dengan keterangan dan tanda. a.tanda: [{x,y,r,k:'salah'|'benar',teks,kal}] dalam 0..1 terhadap gambar
K.adegan.gambar = (c, t, D, a) => {
  K.bg(c); if (a.judul) K.judul(c, a.judul, t, a.warna || C.teal, a.sub);
  const atas = a.judul ? 190 : 50, bawah = a.cap ? 130 : 50;
  const z = 1 + (a.zoom || 0) * K.ease(t / D);
  c.save(); c.translate(960, 540); c.scale(z, z); c.translate(-960, -540);
  const [gx, gy, gw, gh] = pasang(c, a.bg, 60, atas, 1800, 1080 - atas - bawah, O(S(t, 0, .5)));
  const n = (a.tanda || []).length;
  (a.tanda || []).forEach((m, i) => { const t0 = m.dari != null ? m.dari * D : .8 + i * Math.max(.8, (D - 2) / Math.max(1, n)), p = O(S(t, t0, t0 + .5));
    const x = gx + m.x * gw, y = gy + m.y * gh, r = (m.r || .08) * gw, w = m.k === 'benar' ? C.lime : C.coral;
    c.save(); c.globalAlpha = p; c.strokeStyle = w; c.lineWidth = 7; c.beginPath(); c.ellipse(x, y, r, r * (m.ry || .7), 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); c.stroke();
    if (m.teks) { const tw = K.lebar(c, m.teks, 30, 700) + 40, tx = K.clamp(x - tw / 2, 20, 1900 - tw), ty = y + r * (m.ry || .7) + 14 > 1000 ? y - r * (m.ry || .7) - 64 : y + r * (m.ry || .7) + 14;
      K.rrect(c, tx, ty, tw, 50, 14, 'rgba(20,24,38,.95)'); T(c, m.teks, tx + tw / 2, ty + 26, {size: 30, weight: 700, align: 'center', color: w}); }
    c.restore(); });
  c.restore();
  if (a.cap) pita(c, a.cap, 1010, O(S(t, .4, .9)), a.warna || C.teal);
};

// flipbook: bola memantul, nomor frame
K.adegan.flipbook = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Video = gambar diam yang berganti cepat', t, C.amber, '24 gambar per detik × 75 detik = 1.800 frame');
  const fps = t < D * .45 ? 4 : 24, f = Math.floor(t * fps), ph = (f % 24) / 24;
  const x0 = 560, y0 = 260, w = 800, h = 560;
  for (let i = 3; i >= 1; i--) K.rrect(c, x0 + i * 10, y0 + i * 10, w, h, 14, '#d9d3c2');
  K.rrect(c, x0, y0, w, h, 14, '#f6f1e3', '#b9b29c', 3);
  const by = y0 + h - 110 - Math.abs(Math.sin(ph * Math.PI)) * 330, bx = x0 + 120 + ph * (w - 240);
  c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(bx, y0 + h - 70, 50, 10, 0, 0, 7); c.fill();
  c.fillStyle = C.coral; c.beginPath(); c.arc(bx, by, 48, 0, 7); c.fill();
  T(c, 'frame ' + (f % 24 + 1), x0 + w - 30, y0 + 44, {size: 30, weight: 700, align: 'right', color: '#555', mono: true});
  T(c, fps === 4 ? 'Pelan: tiap gambar terlihat' : 'Cepat: terlihat bergerak', 960, 900, {size: 40, weight: 700, align: 'center', color: fps === 4 ? C.redup : C.lime});
};

// keyframe + easing
K.adegan.keyframe = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Keyframe dan easing', t, C.amber, 'Kita menentukan frame penting, Blender mengisi sisanya');
  const x0 = 260, x1 = 1660, y = 430, ph = (t % 4) / 3, lin = K.clamp(ph), es = K.ease(ph), on = t > D * .5;
  c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(x0, y + 90, x1 - x0, 6);
  for (let i = 0; i <= 47; i++) { const x = x0 + (x1 - x0) * i / 47; c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x - 1, y + 82, 2, i % 12 === 0 ? 22 : 12); }
  [[x0, 'frame 1'], [x1, 'frame 48']].forEach(([x, s]) => { c.save(); c.translate(x, y + 93); c.rotate(Math.PI / 4); c.fillStyle = C.amber; c.fillRect(-13, -13, 26, 26); c.restore(); T(c, s, x, y + 150, {size: 28, weight: 700, align: 'center', color: C.amber, mono: true}); });
  const bx = x0 + (x1 - x0) * (on ? es : lin);
  c.fillStyle = C.coral; c.beginPath(); c.arc(bx, y, 44, 0, 7); c.fill();
  T(c, on ? 'Dengan easing: pelan, cepat, lalu melambat' : 'Tanpa easing: kecepatan tetap', 960, 300, {size: 40, weight: 700, align: 'center', color: on ? C.lime : C.redup});
  // dua kurva
  const gx = 660, gy = 660, gw = 600, gh = 300; K.rrect(c, gx, gy, gw, gh, 14, C.panel);
  c.strokeStyle = on ? '#44507a' : C.sky; c.lineWidth = 5; c.beginPath(); c.moveTo(gx + 30, gy + gh - 30); c.lineTo(gx + gw - 30, gy + 30); c.stroke();
  c.strokeStyle = on ? C.lime : '#44507a'; c.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, px = gx + 30 + (gw - 60) * u, py = gy + gh - 30 - (gh - 60) * K.ease(u); i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke();
  const u = K.clamp(ph), pv = on ? es : lin; c.fillStyle = '#fff'; c.beginPath(); c.arc(gx + 30 + (gw - 60) * u, gy + gh - 30 - (gh - 60) * pv, 10, 0, 7); c.fill();
};

// alur: kotak-kotak berpanah. a.kotak: [[judul, sub, warna]], a.judul
K.adegan.alur = (c, t, D, a) => {
  K.bg(c); K.judul(c, a.judul, t, a.warna || C.teal, a.sub);
  const kt = a.kotak, n = kt.length, w = Math.min(380, (1700 - (n - 1) * 70) / n), tot = n * w + (n - 1) * 70, x0 = 960 - tot / 2, y = 400, h = 260, lg = Math.max(.6, D * .7 / n);
  kt.forEach(([j, s, wr], i) => { const x = x0 + i * (w + 70), p = O(S(t, .5 + i * lg, 1.1 + i * lg)); K.panel(c, x, y, w, h, p, C[wr] || C.teal);
    c.save(); c.globalAlpha = p; T(c, j, x + w / 2 + 5, y + 95, {size: 38, weight: 800, align: 'center', maxW: w - 40, mono: !!a.mono, color: C[wr] || C.teks});
    T(c, s, x + w / 2 + 5, y + 180, {size: 27, weight: 500, align: 'center', color: C.redup, maxW: w - 44, lh: 1.3}); c.restore();
    if (i < n - 1) K.arrow(c, x + w + 12, y + h / 2, x + w + 58, y + h / 2, C.redup, 5, O(S(t, .9 + i * lg, 1.3 + i * lg))); });
  if (a.cap) T(c, a.cap, 960, 820, {size: 38, weight: 700, align: 'center', color: C.amber, maxW: 1600, alpha: O(S(t, D * .75, D * .75 + .6))});
};

// kartu: beberapa kartu sejajar dengan judul dan penjelasan, menyala bergantian. a.kartu: [[judul, isi, warna]]
K.adegan.kartu = (c, t, D, a) => {
  if (a.bg) K.latar(c, a.bg, 0.86); else K.bg(c);
  K.judul(c, a.judul, t, a.warna || C.amber, a.sub);
  const kt = a.kartu, n = kt.length, gap = 40, w = (1680 - (n - 1) * gap) / n, y = 270, h = a.h || 560, lg = D / n;
  kt.forEach(([j, s, wr], i) => { const x = 120 + i * (w + gap), p = O(S(t, .4 + i * (a.serempak ? .25 : lg * .92), 1 + i * (a.serempak ? .25 : lg * .92)));
    const aktif = a.serempak || a.sorot === i || (a.sorot == null && Math.min(n - 1, Math.floor(t / lg)) === i);
    K.panel(c, x, y, w, h, p, C[wr] || C.amber); c.save(); c.globalAlpha = p * (aktif ? 1 : .45);
    T(c, String(i + 1), x + 50, y + 70, {size: 44, weight: 800, color: C[wr] || C.amber});
    T(c, j, x + 40, y + 150, {size: n > 3 ? 36 : 44, weight: 800, maxW: w - 70, lh: 1.2});
    T(c, s, x + 40, y + (a.ysub || 290), {size: n > 3 ? 27 : 31, weight: 500, color: C.redup, maxW: w - 70, lh: 1.4}); c.restore(); });
};

// dua kolom: tanpa storyboard vs dengan storyboard
K.adegan.duaJalan = (c, t, D, a) => {
  K.bg(c); K.judul(c, a.judul, t, C.amber);
  [[a.kiri, 120, C.coral, 0], [a.kanan, 990, C.lime, D * .45]].forEach(([k, x, w, t0]) => { const p = O(S(t, .4 + t0, 1 + t0)); K.panel(c, x, 250, 810, 620, p, w);
    c.save(); c.globalAlpha = p; T(c, k[0], x + 50, 320, {size: 34, weight: 800, color: w});
    K.rrect(c, x + 50, 370, 710, 110, 14, '#0f1526'); T(c, k[1], x + 75, 425, {size: 28, weight: 500, mono: true, maxW: 660, lh: 1.3});
    K.arrow(c, x + 405, 500, x + 405, 570, C.redup, 5, O(S(t, 1 + t0, 1.5 + t0)));
    T(c, k[2], x + 405, 680, {size: 44, weight: 800, align: 'center', maxW: 680, lh: 1.3, alpha: O(S(t, 1.4 + t0, 2 + t0))}); c.restore(); });
};
})();
