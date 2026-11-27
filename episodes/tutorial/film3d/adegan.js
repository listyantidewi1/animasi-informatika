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

// ---------------------------------------------------------------- adegan F00, F08 lanjutan, F09, F10 (27 Nov)
(() => {
const C = K.C, T = K.text, S = K.seg, O = K.out;
const DAFTAR = ['Memasang alat', 'Dari ide ke storyboard', 'Kerangka film', 'Kota yang basah', 'Kurir, motor, kucing', 'Kamera sinematik', 'Suara', 'Render', 'Cek kerjaan AI', 'Penutup'];

// orang dan robot kecil (ikon datar)
function orang(c, x, y, s, w) { c.save(); c.fillStyle = w; c.beginPath(); c.arc(x, y - 34 * s, 22 * s, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.roundRect(x - 34 * s, y - 6 * s, 68 * s, 56 * s, [30 * s, 30 * s, 8 * s, 8 * s]); c.fill(); c.restore(); }
function robot(c, x, y, s, w) { c.save(); c.fillStyle = w; c.beginPath(); c.roundRect(x - 36 * s, y - 52 * s, 72 * s, 52 * s, 12 * s); c.fill();
  c.fillRect(x - 3 * s, y - 70 * s, 6 * s, 18 * s); c.beginPath(); c.arc(x, y - 72 * s, 7 * s, 0, Math.PI * 2); c.fill();
  c.fillStyle = C.bg1; c.beginPath(); c.arc(x - 14 * s, y - 27 * s, 7 * s, 0, Math.PI * 2); c.arc(x + 14 * s, y - 27 * s, 7 * s, 0, Math.PI * 2); c.fill();
  c.fillStyle = w; c.beginPath(); c.roundRect(x - 30 * s, y + 6 * s, 60 * s, 44 * s, 8 * s); c.fill(); c.restore(); }

// lima langkah cara kerja, berputar. a.judul
K.adegan.siklus = (c, t, D, a) => {
  K.bg(c); K.judul(c, a.judul || 'Cara kerja kita', t, C.amber, a.sub);
  const L = [['Storyboard', 'rencana dulu', C.sky], ['Prompt kecil', 'satu tugas', C.teal], ['Lihat', 'gambar cek cepat', C.violet], ['Periksa frame', 'frame demi frame', C.coral], ['Commit', 'simpan di Git', C.lime]];
  const cx = 960, cy = 600, R = 330, n = L.length, muncul = Math.min(D * .7, n * 1.6), aktif = t < muncul ? Math.floor(t / (muncul / n)) : Math.floor((t - muncul) / 1.1) % n;
  c.save(); c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke(); c.restore();
  L.forEach(([j, s, w], i) => { const ang = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
    const t0 = i * muncul / n, p = O(S(t, t0, t0 + .5)), on = i === aktif;
    const a0 = ang + .2, a1 = ang + 2 * Math.PI / n - .2, q = O(S(t, t0 + .4, t0 + 1.2));
    if (q > 0) { c.save(); c.strokeStyle = w; c.globalAlpha = .7; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R, a0, a0 + (a1 - a0) * q); c.stroke();
      const ae = a0 + (a1 - a0) * q, hx = cx + R * Math.cos(ae), hy = cy + R * Math.sin(ae), dir = ae + Math.PI / 2;
      c.fillStyle = w; c.beginPath(); c.moveTo(hx + 16 * Math.cos(dir), hy + 16 * Math.sin(dir)); c.lineTo(hx - 12 * Math.cos(dir) + 12 * Math.cos(ae), hy - 12 * Math.sin(dir) + 12 * Math.sin(ae));
      c.lineTo(hx - 12 * Math.cos(dir) - 12 * Math.cos(ae), hy - 12 * Math.sin(dir) - 12 * Math.sin(ae)); c.fill(); c.restore(); }
    c.save(); c.globalAlpha = p; const bw = 300, bh = 120, sc = on ? 1.08 : 1;
    c.translate(x, y); c.scale(sc, sc); K.rrect(c, -bw / 2, -bh / 2, bw, bh, 24, on ? w : C.panel, w, 4);
    T(c, j, 0, -16, {size: 36, weight: 800, align: 'center', color: on ? '#141a2c' : C.teks}); T(c, s, 0, 28, {size: 24, weight: 600, align: 'center', color: on ? '#141a2c' : C.redup}); c.restore(); });
  const pc = O(S(t, .3, 1)); c.save(); c.globalAlpha = pc; orang(c, cx - 70, cy + 10, 1.3, C.amber); robot(c, cx + 70, cy + 10, 1.3, C.sky);
  T(c, 'Manusia', cx - 70, cy + 110, {size: 26, weight: 700, align: 'center', color: C.amber}); T(c, 'AI', cx + 70, cy + 110, {size: 26, weight: 700, align: 'center', color: C.sky}); c.restore();
};

// daftar bab menyala satu per satu
K.adegan.daftar = (c, t, D, a) => {
  K.bg(c); K.judul(c, a.judul || 'Isi video ini', t, C.amber, a.sub);
  DAFTAR.forEach((s, i) => { const kol = i < 5 ? 0 : 1, r = i % 5, x = 160 + kol * 820, y = 300 + r * 130, t0 = .5 + i * (D - 1.5) / DAFTAR.length, p = O(S(t, t0, t0 + .5));
    c.save(); c.globalAlpha = .25 + .75 * p; K.rrect(c, x, y - 48, 740, 96, 20, p > .5 ? C.panel : 'rgba(255,255,255,.04)', i === 8 ? C.coral : (p > .5 ? C.amber : C.garis), 3);
    T(c, 'BAB ' + (i + 1), x + 34, y, {size: 26, weight: 800, color: i === 8 ? C.coral : C.amber}); T(c, s, x + 170, y, {size: 38, weight: 700}); c.restore(); });
};

// grafik batang waktu render per shot. a.data=[[label, detik, warna]], a.rata, a.cap
K.adegan.batang = (c, t, D, a) => {
  K.bg(c); K.judul(c, a.judul, t, C.amber, a.sub);
  const d = a.data, n = d.length, x0 = 220, x1 = 1760, y0 = 860, H = 480, mx = a.maks || Math.max(...d.map(v => v[1])) * 1.15, bw = (x1 - x0) / n * .62;
  c.fillStyle = 'rgba(255,255,255,.15)'; c.fillRect(x0 - 20, y0, x1 - x0 + 40, 3);
  d.forEach(([l, v, w], i) => { const x = x0 + (i + .5) * (x1 - x0) / n, p = O(S(t, .5 + i * .25, 1.3 + i * .25)), h = H * v / mx * p, wr = C[w] || C.amber;
    K.rrect(c, x - bw / 2, y0 - h, bw, h, 10, wr); T(c, l, x, y0 + 40, {size: 30, weight: 800, align: 'center'});
    c.save(); c.globalAlpha = p; T(c, v + ' dtk', x, y0 - h - 30, {size: 30, weight: 700, align: 'center', color: wr}); c.restore(); });
  if (a.rata) { const p = O(S(t, 3, 3.6)), y = y0 - H * a.rata / mx; c.save(); c.globalAlpha = p; c.setLineDash([18, 12]); c.strokeStyle = C.teks; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x0 - 20, y); c.lineTo(x1 + 20, y); c.stroke(); c.setLineDash([]); T(c, 'rata-rata ' + a.rata + ' dtk', x1 + 20, y - 24, {size: 26, weight: 700, align: 'right'}); c.restore(); }
  (a.legenda || []).forEach(([s, w], i) => { const p = O(S(t, 2.5 + i * .3, 3 + i * .3)); c.save(); c.globalAlpha = p; K.rrect(c, 1180 + i * 330, 196, 28, 28, 6, C[w]); T(c, s, 1220 + i * 330, 210, {size: 26, weight: 600, color: C.redup}); c.restore(); });
  if (a.cap) { const p = O(S(t, D * .55, D * .55 + .6)); c.save(); c.globalAlpha = p; T(c, a.cap, 960, 960, {size: 40, weight: 800, align: 'center', color: C.amber}); c.restore(); }
};

// shutter (rana) motion blur di pergantian shot. Bagian 1: berpusat di frame (salah). Bagian 2: START/END (benar).
K.adegan.rana = (c, t, D, a) => {
  K.bg(c); const benar = a.benar; K.judul(c, benar ? 'Sesudah: shutter tidak menyeberang' : 'Sebelum: shutter berpusat di nomor frame', t, benar ? C.lime : C.coral, 'Motion blur = shutter kamera terbuka sebentar di setiap frame');
  const F = [166, 167, 168, 169, 170, 171], x0 = 220, fw = 300, y = 560, cut = x0 + 3 * fw - fw / 2;
  const p0 = O(S(t, .3, 1));
  c.save(); c.globalAlpha = p0; c.fillStyle = 'rgba(96,165,250,.10)'; c.fillRect(x0 - fw / 2, 300, cut - (x0 - fw / 2), 420); c.fillStyle = 'rgba(45,212,191,.10)'; c.fillRect(cut, 300, x0 + 5 * fw + fw / 2 - cut, 420);
  T(c, 'Shot 1: kamera di jalan', (x0 - fw / 2 + cut) / 2, 340, {size: 32, weight: 800, align: 'center', color: C.sky}); T(c, 'Shot 2: kamera di depan HP', (cut + x0 + 5.5 * fw) / 2, 340, {size: 32, weight: 800, align: 'center', color: C.teal});
  c.strokeStyle = C.amber; c.lineWidth = 5; c.setLineDash([16, 10]); c.beginPath(); c.moveTo(cut, 300); c.lineTo(cut, 760); c.stroke(); c.setLineDash([]);
  T(c, 'potongan kamera', cut, 790, {size: 26, weight: 700, align: 'center', color: C.amber});
  c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x0 - fw / 2, y, 6 * fw, 4); c.restore();
  F.forEach((f, i) => { const x = x0 + i * fw, p = O(S(t, .5 + i * .15, 1 + i * .15));
    c.save(); c.globalAlpha = p; c.fillStyle = C.teks; c.fillRect(x - 2, y - 26, 4, 56); T(c, String(f), x, y + 70, {size: 34, weight: 800, align: 'center', mono: true}); c.restore();
    // jendela shutter 0,25 frame
    let s0 = -.125, s1 = .125; if (benar && f === 169) { s0 = 0; s1 = .25; } if (benar && f === 168) { s0 = -.25; s1 = 0; }
    const q = O(S(t, 1.6 + i * .2, 2.1 + i * .2)), wx0 = x + s0 * fw, wx1 = x + s1 * fw, salah = !benar && (f === 168 || f === 169);
    c.save(); c.globalAlpha = q; K.rrect(c, wx0, y - 70, wx1 - wx0, 44, 8, salah ? 'rgba(255,107,107,.35)' : 'rgba(163,230,53,.28)', salah ? C.coral : C.lime, 3);
    if (salah) { const lx = f === 169 ? wx0 : cut, rx = f === 169 ? cut : wx1; K.rrect(c, lx, y - 70, rx - lx, 44, 4, 'rgba(255,107,107,.85)'); }
    c.restore(); });
  const r = O(S(t, D * .5, D * .5 + .6)); c.save(); c.globalAlpha = r;
  T(c, benar ? 'Frame pertama shot: shutter mulai di frame itu (START).  Frame terakhir: berhenti di frame itu (END).' : 'Frame 169 mengintip ke shot 1, frame 168 mengintip ke shot 2: gambarnya berbayang.', 960, 900, {size: 34, weight: 700, align: 'center', color: benar ? C.lime : C.coral, maxW: 1700, lh: 1.35});
  c.restore();
};

// halaman unggah video generik. a.bg = thumbnail, a.judulVid, a.desk
K.adegan.unggah = (c, t, D, a) => {
  K.bg(c); const x = 160, y = 80, w = 1600, h = 900, p = O(S(t, .1, .6));
  c.save(); c.globalAlpha = p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 34; K.rrect(c, x, y, w, h, 18, '#f8fafc'); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 70, 18, '#e2e8f0'); c.fillStyle = '#e2e8f0'; c.fillRect(x, y + 40, w, 30); T(c, 'Unggah video', x + 40, y + 36, {size: 30, weight: 800, color: '#0f172a'});
  const F = [['Judul', a.judulVid], ['Deskripsi', a.desk]], st = [D * .15, D * .4, D * .65];
  F.forEach(([l, v], i) => { const yy = y + 130 + i * 190, on = t >= st[i] && t < st[i + 1], q = O(S(t, st[i], st[i] + .5));
    T(c, l, x + 50, yy, {size: 26, weight: 700, color: '#475569'}); K.rrect(c, x + 50, yy + 24, 900, i ? 220 : 80, 12, '#fff', on ? '#2563eb' : '#cbd5e1', on ? 4 : 2);
    c.save(); c.globalAlpha = q; T(c, v, x + 74, yy + 64, {size: 28, weight: 600, color: '#0f172a', maxW: 850, lh: 1.45}); c.restore(); });
  const on = t >= st[2], tx = x + 1020, ty = y + 130; T(c, 'Thumbnail', tx, ty, {size: 26, weight: 700, color: '#475569'});
  K.rrect(c, tx, ty + 24, 520, 293, 12, '#e2e8f0', on ? '#2563eb' : '#cbd5e1', on ? 4 : 2);
  if (a.bg && K.IMG[a.bg]) { c.save(); c.globalAlpha *= O(S(t, st[2], st[2] + .6)); c.beginPath(); c.roundRect(tx + 4, ty + 28, 512, 285, 10); c.clip(); c.drawImage(K.IMG[a.bg], tx + 4, ty + 28, 512, 288); c.restore(); }
  K.rrect(c, x + w - 260, y + h - 100, 210, 64, 32, '#2563eb'); T(c, 'Unggah', x + w - 155, y + h - 68, {size: 28, weight: 800, align: 'center', color: '#fff'});
  c.restore();
  if (a.cap) { const r = O(S(t, .6, 1.2)); c.save(); c.globalAlpha = r; T(c, a.cap, 960, 1030, {size: 32, weight: 700, align: 'center'}); c.restore(); }
};

// kartu akhir: video berikutnya (a.bg = thumbnail) + tombol subscribe
K.adegan.akhir = (c, t, D, a) => {
  K.bg(c); const p = O(S(t, .2, .8)), q = O(S(t, .8, 1.4));
  c.save(); c.globalAlpha = p; T(c, 'Tonton berikutnya', 160, 190, {size: 34, weight: 800, color: C.amber});
  if (a.bg && K.IMG[a.bg]) { c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 40; c.drawImage(K.IMG[a.bg], 160, 240, 960, 540); c.shadowColor = 'transparent'; c.strokeStyle = C.garis; c.lineWidth = 3; c.strokeRect(160, 240, 960, 540); }
  T(c, a.judulVid || '', 160, 850, {size: 38, weight: 800, maxW: 960, lh: 1.3}); c.restore();
  c.save(); c.globalAlpha = q; K.rrect(c, 1260, 420, 500, 120, 60, '#e11d48'); T(c, 'SUBSCRIBE', 1510, 481, {size: 46, weight: 900, align: 'center', color: '#fff'});
  T(c, a.sub || 'untuk video vibe coding berikutnya', 1510, 600, {size: 30, weight: 600, align: 'center', color: C.redup, maxW: 520}); c.restore();
};
})();
