// Adegan konsep seri "Git dan Kerja Tim". Memakai pustaka K (kanvas.js). Semua deterministik terhadap t.
(() => {
const C = K.C, T = K.text, S = K.seg, O = K.out, E = K.ease;
const fadeIn = (t, a = 0, b = .5) => O(S(t, a, b));
const alpha = (c, a, fn) => { c.save(); c.globalAlpha *= a; fn(); c.restore(); };
const M = K.M;
// waktu mulai kalimat ke-k narasi (dari rakit: a._kal), atau cadangan bila tidak ada
const kt = (a, k, d) => (a && a._kal && a._kal[k] != null) ? a._kal[k] : d;

// ---------- pembantu gambar ----------
// simpul commit
K.simpul = (c, x, y, o = {}) => {
  const r = o.r || 26, w = o.warna || C.teal, p = o.p ?? 1; if (p <= 0) return;
  c.save(); c.globalAlpha *= K.clamp(p * 2); const s = K.lerp(.4, 1, K.back(p)); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fillStyle = o.isi ? w : (o.hantu ? 'rgba(0,0,0,0)' : '#141a2b'); c.fill();
  c.lineWidth = 7; c.strokeStyle = w; if (o.hantu) c.setLineDash([8, 7]); c.stroke(); c.setLineDash([]);
  c.restore();
  if (o.hash) T(c, o.hash, x, y + r + 34, {size: o.uk || 26, weight: 700, mono: true, align: 'center', color: o.hantu ? '#7d88a8' : '#cdd6ee', alpha: K.clamp(p * 2)});
};
// label (chip) branch / HEAD
K.chip = (c, x, y, teks, warna, o = {}) => {
  const sz = o.size || 30; const w = K.lebar(c, teks, sz, 800) + 34, h = sz + 22;
  const ax = o.tengah === false ? x : x - w / 2;
  c.save(); c.globalAlpha *= (o.a ?? 1);
  K.rrect(c, ax, y - h / 2, w, h, 12, warna, o.garis ? '#fff' : null, 3);
  T(c, teks, ax + w / 2, y + 1, {size: sz, weight: 800, align: 'center', color: o.gelap ? '#fff' : '#101626'});
  c.restore(); return w;
};
K.garisCommit = (c, x1, y1, x2, y2, p = 1, warna = '#5b6a96') => {
  if (p <= 0) return; c.save(); c.strokeStyle = warna; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1);
  if (y1 === y2) c.lineTo(K.lerp(x1, x2, p), y2);
  else { const mx = (x1 + x2) / 2; const pts = []; for (let i = 0; i <= 30 * p; i++) { const u = i / 30; const bx = (1 - u) ** 3 * x1 + 3 * (1 - u) ** 2 * u * mx + 3 * (1 - u) * u * u * mx + u ** 3 * x2; const by = (1 - u) ** 3 * y1 + 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u ** 3 * y2; c.lineTo(bx, by); } }
  c.stroke(); c.restore();
};
// ikon folder
K.folder = (c, x, y, w, h, warna = C.amber, o = {}) => {
  c.save(); c.globalAlpha *= (o.a ?? 1);
  K.rrect(c, x, y, w * .42, h * .2, 10, warna); K.rrect(c, x, y + h * .12, w, h * .88, 16, warna);
  K.rrect(c, x + 8, y + h * .24, w - 16, h * .7, 12, 'rgba(255,255,255,.12)');
  if (o.label) T(c, o.label, x + w / 2, y + h + 34, {size: o.uk || 28, weight: 700, align: 'center', mono: o.mono});
  c.restore();
};
// berkas kecil
K.berkas = (c, x, y, nama, o = {}) => {
  const w = o.w || K.lebar(c, nama, o.size || 28, 600, true) + 70, h = o.h || 58, warna = o.warna || '#c7cfe6';
  c.save(); c.globalAlpha *= (o.a ?? 1);
  K.rrect(c, x, y, w, h, 12, o.isi || 'rgba(255,255,255,.07)', warna, 3);
  K.rrect(c, x + 14, y + 14, 20, h - 28, 4, warna);
  T(c, nama, x + 48, y + h / 2 + 1, {size: o.size || 28, weight: 600, mono: true, color: o.warnaTeks || C.teks});
  if (o.coret) { c.strokeStyle = C.coral; c.lineWidth = 5; c.beginPath(); c.moveTo(x + 6, y + h / 2); c.lineTo(x + w - 6, y + h / 2); c.stroke(); }
  c.restore(); return w;
};
// laptop
K.laptop = (c, cx, cy, s, o = {}) => {
  const w = 300 * s, h = 190 * s; c.save(); c.globalAlpha *= (o.a ?? 1);
  K.rrect(c, cx - w / 2, cy - h, w, h, 14 * s, '#0b0f1a', o.warna || '#3a4566', 5 * s);
  K.rrect(c, cx - w / 2 + 12 * s, cy - h + 12 * s, w - 24 * s, h - 24 * s, 8 * s, o.layar || '#1c2a4a');
  if (o.isi) o.isi(c, cx - w / 2 + 12 * s, cy - h + 12 * s, w - 24 * s, h - 24 * s);
  c.beginPath(); c.moveTo(cx - w / 2 - 30 * s, cy + 18 * s); c.lineTo(cx + w / 2 + 30 * s, cy + 18 * s); c.lineTo(cx + w / 2, cy); c.lineTo(cx - w / 2, cy); c.closePath();
  c.fillStyle = '#3a4566'; c.fill();
  if (o.nama) T(c, o.nama, cx, cy + 66 * s, {size: 34 * s, weight: 800, align: 'center', color: o.warnaNama || C.teks});
  c.restore();
};
// server
K.server = (c, cx, cy, s, o = {}) => {
  c.save(); c.globalAlpha *= (o.a ?? 1);
  for (let i = 0; i < 3; i++) { const y = cy - 120 * s + i * 82 * s; K.rrect(c, cx - 120 * s, y, 240 * s, 70 * s, 12 * s, '#1f2a48', o.warna || C.sky, 4 * s);
    c.fillStyle = C.lime; c.beginPath(); c.arc(cx + 88 * s, y + 35 * s, 8 * s, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(cx - 96 * s, y + 28 * s, 110 * s, 14 * s); }
  if (o.nama) T(c, o.nama, cx, cy + 160 * s, {size: 34 * s, weight: 800, align: 'center'});
  c.restore();
};
// kotak kode sederhana (tanpa pewarnaan rumit)
K.kodeBaris = (c, x, y, baris, o = {}) => {
  const sz = o.size || 30, lh = sz * 1.55; let yy = y;
  baris.forEach((b, i) => {
    const bg = o.latar && o.latar[i]; if (bg) { c.fillStyle = bg; c.fillRect(x - 16, yy - lh / 2, o.w || 1500, lh); }
    if (o.nomor) T(c, String(o.mulai ? o.mulai + i : i + 1), x, yy, {size: sz * .85, weight: 500, mono: true, color: '#5c6a90'});
    T(c, b, x + (o.nomor ? sz * 2.4 : 0), yy, {size: sz, weight: 500, mono: true, color: (o.warna && o.warna[i]) || '#e6e9f2'});
    yy += lh;
  });
  return yy;
};

// ---------- kartu umum ----------
K.adegan.judulGit = (c, t, D, a) => {
  K.bg(c);
  const p1 = O(S(t, .1, .7)), p2 = O(S(t, .5, 1.2)), p3 = O(S(t, 1.1, 1.8));
  alpha(c, p1, () => { const w = K.lebar(c, 'GIT DAN KERJA TIM · ' + a.kode, 24, 800) + 60; K.rrect(c, 140, 250, w, 56, 28, C.amber); T(c, 'GIT DAN KERJA TIM · ' + a.kode, 140 + w / 2, 279, {size: 24, weight: 800, align: 'center', color: '#141a2c'}); });
  let y = 380 + 20 * (1 - p2);
  alpha(c, p2, () => { for (const b of a.judul.split('\n')) { T(c, b, 140, y, {size: 88, weight: 800}); y += 106; } });
  if (a.hook) alpha(c, p3, () => T(c, a.hook, 140, y + 30, {size: 38, weight: 500, color: '#c9d3ee', maxW: 1060, lh: 1.38}));
  // hiasan graf di kanan
  const xs = 1500, ys = [220, 360, 500, 640, 780], wr = [C.teal, C.teal, C.amber, C.amber, C.teal];
  for (let i = 0; i < 5; i++) {
    const p = O(S(t, .6 + i * .18, 1.1 + i * .18)); const x = i === 2 || i === 3 ? xs + 160 : xs;
    if (i > 0) { const px = (i - 1 === 2 || i - 1 === 3) ? xs + 160 : xs; K.garisCommit(c, px, ys[i - 1], x, ys[i], p); }
    if (i === 4) K.garisCommit(c, xs + 160, ys[3], xs, ys[4], p);
    K.simpul(c, x, ys[i], {p, warna: wr[i], isi: i === 4});
  }
  alpha(c, O(S(t, 1.6, 2.1)), () => { K.chip(c, xs + 60, ys[4], 'main', C.teal, {tengah: false, size: 28}); K.chip(c, xs + 220, ys[3], a.cabang || 'fitur', C.amber, {tengah: false, size: 28}); });
};
K.adegan.prasyarat = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Sebelum mulai', t, C.sky, a.sub || 'Tonton dulu episode ini kalau belum');
  const n = a.isi.length, w = Math.min(560, (1640 - (n - 1) * 30) / n), x0 = (K.W - (n * w + (n - 1) * 30)) / 2;
  a.isi.forEach(([kode, judul], i) => { const p = O(S(t, .4 + i * .25, 1 + i * .25)), x = x0 + i * (w + 30);
    K.panel(c, x, 330, w, 380, p, C.sky);
    alpha(c, p, () => { T(c, kode, x + 50, 420, {size: 44, weight: 800, color: C.sky}); T(c, judul, x + 50, 500, {size: 38, weight: 700, maxW: w - 90, lh: 1.3}); });
  });
  if (a.catatan) alpha(c, O(S(t, 1.2, 1.8)), () => T(c, a.catatan, 160, 860, {size: 36, weight: 500, color: C.redup, maxW: 1600}));
};
K.adegan.kartuBab = (c, t, D, a) => {
  // kartu antarbab: memberi jeda dan menunjukkan posisi di peta episode
  K.bg(c);
  const fo = 1 - O(S(t, D - .55, D - .05)), p1 = O(S(t, .15, .7)), p2 = O(S(t, .4, 1.0));
  alpha(c, fo, () => {
    alpha(c, p1, () => { const lb = 'BAGIAN ' + a.no; const w = K.lebar(c, lb, 26, 800) + 64; K.rrect(c, 160, 330, w, 58, 29, C.amber); T(c, lb, 160 + w / 2, 360, {size: 26, weight: 800, align: 'center', color: '#141a2c'}); });
    alpha(c, p2, () => { T(c, a.judul, 160, 480 + 16 * (1 - p2), {size: 84, weight: 800, maxW: 1600}); if (a.sub) T(c, a.sub, 160, 580 + 16 * (1 - p2), {size: 38, weight: 500, color: '#c9d3ee', maxW: 1600}); });
    const n = a.semua.length, gap = 24, w = (1600 - (n - 1) * gap) / n;
    a.semua.forEach((nm, i) => { const x = 160 + i * (w + gap), p = O(S(t, .5 + i * .08, .9 + i * .08)), kini = i + 1 === a.no, lewat = i + 1 < a.no;
      alpha(c, p, () => { K.rrect(c, x, 790, w, 10, 5, kini ? C.amber : lewat ? C.teal : 'rgba(255,255,255,.14)');
        T(c, nm, x, 850, {size: 26, weight: kini ? 800 : 600, color: kini ? '#fff' : lewat ? C.teal : C.redup, maxW: w}); }); });
  });
};
K.adegan.rangkumanGit = (c, t, D, a) => {
  K.bg(c); K.judul(c, a.judul || 'Rangkuman', t, C.teal);
  const n = a.item.length, lh = Math.min(118, 680 / n);
  a.item.forEach(([kiri, kanan], i) => { const L = a._kal ? a._kal.length : 0, j = Math.min(i + 1, L - 1);
    const t0 = (a.sinkron && L > 1) ? a._kal[j] + (i + 1 - j) * 1.6 : .5 + i * (D * .55 / n);
    const p = O(S(t, t0, t0 + .5)), y = 260 + i * lh;
    alpha(c, p, () => { const dx = 30 * (1 - p);
      K.rrect(c, 140 + dx, y, 1640, lh - 18, 18, C.panel);
      K.rrect(c, 140 + dx, y, 10, lh - 18, 5, a.warna?.[i] || C.teal);
      T(c, kiri, 190 + dx, y + (lh - 18) / 2, {size: 38, weight: 700, mono: true, color: a.warna?.[i] || C.teal});
      T(c, kanan, 780 + dx, y + (lh - 18) / 2, {size: 36, weight: 600, maxW: 960}); });
  });
};
K.adegan.tantanganGit = (c, t, D, a) => {
  K.bg(c); const p = O(S(t, 0, .6)), p2 = O(S(t, Math.min(D * .45, 4), Math.min(D * .45, 4) + .6));
  K.judul(c, 'Tantangan untukmu', t, C.amber);
  K.panel(c, 140, 220, 1640, 330, p, C.amber);
  alpha(c, p, () => T(c, a.tantangan, 200, 300, {size: 44, weight: 600, maxW: 1520, lh: 1.4}));
  if (a.berikut) alpha(c, p2, () => { T(c, a.berikutLabel || 'Episode berikutnya', 140, 680, {size: 30, weight: 700, color: C.redup}); T(c, a.berikut, 140, 760, {size: 62, weight: 800, maxW: 1640}); });
};
K.adegan.peringatan = (c, t, D, a) => {
  K.bg(c); const p = O(S(t, .1, .7));
  K.panel(c, 200, 230, 1520, 560, p, C.coral);
  alpha(c, p, () => { K.rrect(c, 280, 320, 330, 60, 30, C.coral); T(c, a.label || 'INGAT', 445, 351, {size: 28, weight: 800, align: 'center', color: '#141a2c'});
    T(c, a.judul, 280, 470, {size: 60, weight: 800, maxW: 1360});
    if (a.isi) T(c, a.isi, 280, 600, {size: 38, weight: 500, color: '#d6dcef', maxW: 1360, lh: 1.4}); });
};

// ---------- G01 ----------
K.adegan.salinan = (c, t, D, a) => {
  K.bg(c);
  const nama = ['app.js', 'app_final.js', 'app_final2.js', 'app_final_BENERAN.js', 'app_final_BENERAN_2.js', 'app_revisi_bu_dewi.js', 'app_jangan_dihapus.js'];
  const n = a.banyak ? nama.length : 4;
  K.folder(c, 150, 170, 260, 200, C.amber, {label: 'proyek/', mono: true});
  for (let i = 0; i < n; i++) { const p = O(S(t, .3 + i * (a.banyak ? .5 : .55), .8 + i * (a.banyak ? .5 : .55)));
    alpha(c, p, () => K.berkas(c, 520 + 20 * (1 - p), 150 + i * 92, nama[i], {warna: i === 0 ? C.teal : C.amber})); }
  if (!a.banyak) { // terminal error
    const p = O(S(t, 2.6, 3.2)); K.panel(c, 1180, 300, 600, 330, p, C.coral);
    alpha(c, p, () => { T(c, '$ node server.js', 1230, 370, {size: 30, weight: 600, mono: true, color: '#cdd6ee'});
      T(c, 'TypeError: formatNomor', 1230, 440, {size: 30, weight: 700, mono: true, color: C.coral}); T(c, 'is not a function', 1230, 485, {size: 30, weight: 700, mono: true, color: C.coral});
      T(c, 'Kemarin masih jalan...', 1230, 570, {size: 32, weight: 600, color: C.redup}); });
  } else {
    for (let i = 0; i < 3; i++) { const p = O(S(t, 3.6 + i * .3, 4.1 + i * .3)); T(c, '?', 1300 + i * 170, 380 + (i % 2) * 90, {size: 160, weight: 800, color: [C.amber, C.coral, C.sky][i], alpha: p}); }
    const p = O(S(t, 4.6, 5.2)); alpha(c, p, () => { K.laptop(c, 1450, 840, .9, {nama: '', isi: (c, x, y, w, h) => { T(c, 'AI: 10 berkas diubah', x + w / 2, y + h / 2, {size: 22, weight: 700, align: 'center', color: C.sky}); }}); });
  }
};
K.adegan.kamera = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Commit = foto proyek', t, C.teal, 'Git memotret seluruh proyek pada satu saat');
  // folder proyek
  K.folder(c, 180, 360, 300, 230, C.amber, {label: 'siantre/', mono: true});
  // kamera
  const pk = O(S(t, .8, 1.4)); alpha(c, pk, () => {
    const cx = 700, cy = 470; K.rrect(c, cx - 110, cy - 70, 220, 150, 22, '#2a3558', '#c7cfe6', 4); K.rrect(c, cx - 50, cy - 95, 100, 30, 8, '#c7cfe6');
    c.beginPath(); c.arc(cx, cy + 5, 48, 0, 7); c.fillStyle = '#0b0f1a'; c.fill(); c.lineWidth = 8; c.strokeStyle = C.sky; c.stroke(); });
  // kilat
  const fl = K.clamp(1 - Math.abs(t - 2.2) / .25); if (fl > 0) { c.fillStyle = `rgba(255,255,255,${fl * .55})`; c.fillRect(0, 0, K.W, K.H); }
  // kartu commit
  const tp = kt(a, 2, 2.3), p = O(S(t, tp, tp + .7)); K.panel(c, 980, 260, 800, 520, p, C.teal);
  alpha(c, p, () => {
    K.simpul(c, 1070, 350, {warna: C.teal, isi: true});
    T(c, 'commit', 1130, 352, {size: 36, weight: 800});
    const rows = [['hash', '3f2a9c1', C.amber], ['pesan', 'Buat kerangka SiAntre', C.teks], ['oleh', 'Raka', C.teks], ['waktu', 'Selasa, 09.14', C.teks]];
    rows.forEach(([k, v, w], i) => { const q = O(S(t, kt(a, 3, 3.0) + i * .45, kt(a, 3, 3.0) + .5 + i * .45)); alpha(c, q, () => { T(c, k, 1040, 450 + i * 78, {size: 30, weight: 600, color: C.redup}); T(c, v, 1220, 450 + i * 78, {size: 34, weight: 700, mono: k === 'hash', color: w}); }); });
  });
};
K.adegan.tigaTempat = (c, t, D, a) => {
  const tA = kt(a, 5, D * .3), tC = tA + Math.max(1.2, (D - tA) * .45);
  K.bg(c); K.judul(c, 'Tiga tempat di Git', t, C.teal, a.sub);
  const kol = [['Folder kerja', 'berkas yang sedang kamu edit', C.coral], ['Staging', 'meja: perubahan yang mau difoto', C.lime], ['Repository', 'album: semua foto (commit)', C.sky]];
  const X = [150, 720, 1290], w = 480;
  const t1 = kt(a, 1, -1); if (t1 >= 0) X.forEach((x, i) => { const q = O(S(t, t1 + i * .25, t1 + .4 + i * .25)) * (1 - O(S(t, kt(a, 2 + i, 99), kt(a, 2 + i, 99) + .3))); if (q > 0) { c.save(); c.globalAlpha = q * .8; c.setLineDash([12, 10]); c.strokeStyle = '#5b6a96'; c.lineWidth = 3; c.strokeRect(x, 290, w, 470); c.restore(); T(c, String(i + 1), x + w / 2, 525, {size: 90, weight: 800, align: 'center', color: '#5b6a96', alpha: q}); } });
  kol.forEach(([j, s, wr], i) => { const t0 = kt(a, 2 + i, .3 + i * .35), p = O(S(t, t0, t0 + .6)); K.panel(c, X[i], 290, w, 470, p, wr);
    alpha(c, p, () => { T(c, j, X[i] + 50, 350, {size: 44, weight: 800, color: wr}); T(c, s, X[i] + 50, 410, {size: 28, weight: 500, color: C.redup, maxW: w - 90}); }); });
  // berkas bergerak
  const f1 = S(t, tA + .4, tA + 1.6), f2 = S(t, tC + .4, tC + 1.6);
  const fx = K.lerp(X[0] + 50, X[1] + 50, E(f1)); const fy = 520;
  const tf = kt(a, 2, 1.0) + .6, pf = O(S(t, tf, tf + .5));
  if (f2 <= 0) alpha(c, pf, () => K.berkas(c, fx, fy, 'antrean.js', {warna: f1 >= 1 ? C.lime : C.coral, size: 30}));
  K.berkas(c, X[0] + 50, 620, 'server.js', {warna: C.coral, size: 30, a: O(S(t, tf + .3, tf + .8))});
  if (f2 > 0) { // dipotret
    const fl = K.clamp(1 - Math.abs(f2 - .3) / .2); if (fl > 0) { c.fillStyle = `rgba(255,255,255,${fl * .35})`; c.fillRect(X[1], 290, w, 470); }
    K.simpul(c, X[2] + 110, 560, {warna: C.sky, isi: true, p: O(S(f2, .3, .8)), hash: 'a41c0d2'});
    T(c, 'commit baru', X[2] + 170, 562, {size: 30, weight: 700, alpha: O(S(f2, .5, 1))});
  }
  K.arrow(c, X[0] + w + 10, 470, X[1] - 10, 470, C.lime, 6, O(S(t, tA, tA + .5)));
  alpha(c, O(S(t, tA, tA + .5)), () => T(c, 'git add', (X[0] + w + X[1]) / 2, 820, {size: 38, weight: 800, mono: true, align: 'center', color: C.lime}));
  K.arrow(c, X[1] + w + 10, 470, X[2] - 10, 470, C.sky, 6, O(S(t, tC, tC + .5)));
  alpha(c, O(S(t, tC, tC + .5)), () => T(c, 'git commit', (X[1] + w + X[2]) / 2, 820, {size: 38, weight: 800, mono: true, align: 'center', color: C.sky}));
};
K.adegan.alurAI = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Kebiasaan saat bekerja dengan AI', t, C.violet);
  const L = [['1', 'Commit dulu', 'git commit', C.teal], ['2', 'Minta AI mengubah', 'prompt', C.violet], ['3', 'Periksa hasilnya', 'git diff', C.amber]];
  L.forEach(([n, j, k, w], i) => { const x = 140 + i * 420, t0 = [kt(a, 1, .4), kt(a, 1, .4) + 1.2, kt(a, 2, 1.8)][i], p = O(S(t, t0, t0 + .6)); K.panel(c, x, 330, 360, 300, p, w);
    alpha(c, p, () => { T(c, n, x + 50, 400, {size: 56, weight: 800, color: w}); T(c, j, x + 50, 490, {size: 36, weight: 800, maxW: 280}); T(c, k, x + 50, 580, {size: 30, weight: 600, mono: true, color: w}); });
    if (i) K.arrow(c, x - 52, 480, x - 10, 480, C.redup, 5, O(S(t, t0 - .2, t0 + .2))); });
  const tb = kt(a, 3, 2.8), tr = kt(a, 4, 3.2), p = O(S(t, tb, tb + .6)); K.arrow(c, 1400, 440, 1470, 330, C.lime, 5, p); K.arrow(c, 1400, 520, 1470, 640, C.coral, 5, p);
  K.panel(c, 1490, 240, 300, 170, p, C.lime); K.panel(c, 1490, 560, 300, 170, O(S(t, tr, tr + .6)), C.coral);
  alpha(c, p, () => { T(c, 'Bagus', 1530, 295, {size: 34, weight: 800, color: C.lime}); T(c, 'commit', 1530, 355, {size: 30, weight: 600, mono: true}); });
  alpha(c, O(S(t, tr, tr + .6)), () => { T(c, 'Buruk', 1530, 615, {size: 34, weight: 800, color: C.coral}); T(c, 'kembali ke foto', 1530, 675, {size: 30, weight: 600}); });
};

// ---------- G02 ----------
K.adegan.petaAlat = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Empat alat untuk mundur', t, C.amber, 'Pilih sesuai keadaannya');
  const L = [['restore', 'Perubahan belum di-commit', 'kembali ke commit terakhir', C.coral], ['commit --amend', 'Commit terakhir kurang', 'ganti dengan versi lengkap', C.lime],
    ['revert', 'Commit lama yang salah', 'commit baru yang membalik', C.sky], ['reset', 'Penunjuk branch', 'mundur ke commit sebelumnya', C.violet]];
  L.forEach(([k, j, s, w], i) => { const x = 140 + (i % 2) * 830, y = 270 + Math.floor(i / 2) * 330, t0 = kt(a, 1 + i, .4 + i * (D * .17)), p = O(S(t, t0, t0 + .6));
    const on = a.sorot === undefined || a.sorot === i; K.panel(c, x, y, 790, 290, p, w);
    alpha(c, p * (on ? 1 : .35), () => { T(c, 'git ' + k, x + 50, y + 70, {size: 42, weight: 800, mono: true, color: w}); T(c, j, x + 50, y + 150, {size: 36, weight: 700}); T(c, s, x + 50, y + 215, {size: 30, weight: 500, color: C.redup}); }); });
};
K.adegan.resetDiagram = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'git reset: penunjuk branch mundur', t, C.violet);
  const xs = [260, 520, 780, 1040, 1300], y = 420, mundur = O(S(t, kt(a, 1, 1.6) + .8, kt(a, 1, 1.6) + 1.8));
  for (let i = 0; i < 5; i++) { const hilang = i >= 3; const pa = hilang ? K.lerp(1, .3, mundur) : 1;
    if (i) K.garisCommit(c, xs[i - 1], y, xs[i], y, O(S(t, .2 + i * .15, .5 + i * .15)), hilang ? `rgba(91,106,150,${pa})` : '#5b6a96');
    alpha(c, pa, () => K.simpul(c, xs[i], y, {p: O(S(t, .2 + i * .15, .6 + i * .15)), warna: C.teal, hantu: hilang && mundur > .5})); }
  const lx = K.lerp(xs[4], xs[2], E(mundur)); K.chip(c, lx, y - 80, 'main', C.teal); K.chip(c, lx, y - 140, 'HEAD', '#000', {gelap: true, garis: true});
  const ps = O(S(t, kt(a, 2, 3.2), kt(a, 2, 3.2) + .6)), ph = O(S(t, kt(a, 3, 4.2), kt(a, 3, 4.2) + .6));
  K.panel(c, 160, 620, 760, 300, ps, C.lime); K.panel(c, 1000, 620, 760, 300, ph, C.coral);
  alpha(c, ps, () => { T(c, '--soft', 210, 690, {size: 42, weight: 800, mono: true, color: C.lime}); T(c, 'Perubahan tetap ada di staging.', 210, 770, {size: 34, weight: 600, maxW: 660}); T(c, 'Aman untuk menyusun ulang commit.', 210, 840, {size: 30, weight: 500, color: C.redup, maxW: 660}); });
  alpha(c, ph, () => { T(c, '--hard', 1050, 690, {size: 42, weight: 800, mono: true, color: C.coral}); T(c, 'Semua perubahan dibuang,', 1050, 770, {size: 34, weight: 600}); T(c, 'termasuk isi folder kerja.', 1050, 830, {size: 34, weight: 600});
    K.rrect(c, 1500, 650, 230, 50, 25, C.coral); T(c, 'HATI-HATI', 1615, 676, {size: 24, weight: 800, align: 'center', color: '#141a2c'}); });
};

// ---------- G03 ----------
K.adegan.cabang = (c, t, D, a) => {
  K.bg(c); K.judul(c, a.judul || 'Dua pekerjaan, satu proyek', t, C.amber);
  const y0 = 560, xs = [220, 460, 700];
  for (let i = 0; i < 3; i++) { if (i) K.garisCommit(c, xs[i - 1], y0, xs[i], y0, O(S(t, .2 + i * .2, .5 + i * .2))); K.simpul(c, xs[i], y0, {p: O(S(t, .2 + i * .2, .6 + i * .2)), warna: C.teal}); }
  const b = [[340, C.amber, 'fitur suara'], [780, C.coral, 'perbaikan bug']];
  b.forEach(([yy, w, nm], k) => { const p0 = 1.2 + k * .5;
    for (let j = 0; j < 3; j++) { const x = 980 + j * 240, px = j ? x - 240 : 700, py = j ? yy : y0; K.garisCommit(c, px, py, x, yy, O(S(t, p0 + j * .25, p0 + .3 + j * .25)), w); K.simpul(c, x, yy, {p: O(S(t, p0 + j * .25, p0 + .4 + j * .25)), warna: w}); }
    alpha(c, O(S(t, p0 + .9, p0 + 1.3)), () => K.chip(c, 1700, yy - 70, nm, w)); });
  alpha(c, O(S(t, .8, 1.2)), () => K.chip(c, 460, y0 - 80, 'main', C.teal));
};
K.adegan.bukanSalinan = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Branch bukan salinan folder', t, C.amber);
  // kiri: salinan dicoret
  K.folder(c, 200, 330, 230, 180, C.amber, {label: 'siantre/', mono: true, uk: 26});
  K.folder(c, 520, 330, 230, 180, C.amber, {label: 'siantre_fitur/', mono: true, uk: 26, a: O(S(t, .6, 1.1))});
  K.arrow(c, 440, 420, 510, 420, C.redup, 5, O(S(t, .5, .9)));
  const cr = O(S(t, 1.5, 2.1)); if (cr > 0) { c.save(); c.strokeStyle = C.coral; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(170, 300); c.lineTo(K.lerp(170, 790, cr), K.lerp(300, 620, cr)); c.stroke(); c.restore(); }
  alpha(c, cr, () => T(c, 'Bukan begini', 480, 700, {size: 40, weight: 800, align: 'center', color: C.coral}));
  // kanan: label
  const xs = [1050, 1270, 1490], y = 470, p = O(S(t, 2.4, 3));
  alpha(c, p, () => { for (let i = 0; i < 3; i++) { if (i) K.garisCommit(c, xs[i - 1], y, xs[i], y); K.simpul(c, xs[i], y, {warna: C.teal, isi: i === 2}); } K.chip(c, xs[2], y - 80, 'main', C.teal); });
  const p2 = O(S(t, 3.6, 4.2)); alpha(c, p2, () => K.chip(c, xs[2], y + 90, 'fitur/suara-panggilan', C.amber, {size: 28}));
  alpha(c, O(S(t, 4.4, 5)), () => { T(c, 'Hanya label kecil di satu commit', 1270, 700, {size: 40, weight: 800, align: 'center', color: C.lime}); T(c, 'Tidak ada berkas yang disalin', 1270, 760, {size: 32, weight: 500, align: 'center', color: C.redup}); });
};
K.adegan.headDiagram = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'HEAD = "kamu di sini"', t, '#e6e9f2');
  const y = 560, xs = [300, 600, 900, 1200], tm = kt(a, 3, D * .45), maju = O(S(t, tm, tm + 1));
  for (let i = 0; i < 3; i++) { if (i) K.garisCommit(c, xs[i - 1], y, xs[i], y); K.simpul(c, xs[i], y, {warna: C.teal, p: O(S(t, .2 + i * .2, .6 + i * .2))}); }
  K.garisCommit(c, xs[2], y, xs[3], y, maju); K.simpul(c, xs[3], y, {warna: C.teal, p: maju, isi: true});
  const lx = K.lerp(xs[2], xs[3], E(O(S(t, tm + .6, tm + 1.4))));
  alpha(c, O(S(t, .9, 1.4)), () => { K.chip(c, lx, y - 85, 'main', C.teal); });
  alpha(c, O(S(t, kt(a, 1, 1.6), kt(a, 1, 1.6) + .5)), () => { K.chip(c, lx, y - 155, 'HEAD', '#000', {gelap: true, garis: true}); K.arrow(c, lx, y - 128, lx, y - 112, '#fff', 4, 1, 12); });
  alpha(c, O(S(t, tm, tm + .5)), () => T(c, 'git commit', xs[3], y + 110, {size: 36, weight: 800, mono: true, align: 'center', color: C.amber}));
};

// ---------- G04 ----------
K.adegan.konflikTanya = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Konflik = Git bertanya', t, C.amber, 'Bukan error. Tidak ada yang rusak.');
  const p = O(S(t, .4, 1)); K.panel(c, 560, 470, 800, 140, p, C.amber);
  alpha(c, p, () => T(c, "return 'A' + ...", 620, 540, {size: 40, weight: 600, mono: true}));
  K.arrow(c, 260, 300, 600, 470, C.amber, 7, O(S(t, 1, 1.7))); K.arrow(c, 260, 780, 600, 610, C.violet, 7, O(S(t, 1.3, 2)));
  alpha(c, O(S(t, 1, 1.5)), () => K.chip(c, 240, 260, 'Nadia: A-001', C.amber));
  alpha(c, O(S(t, 1.3, 1.8)), () => K.chip(c, 240, 830, 'Raka: S001', C.violet));
  T(c, '?', 1500, 545, {size: 240, weight: 800, color: C.amber, alpha: O(S(t, 2.2, 2.8))});
};
K.adegan.kapanKonflik = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Kapan konflik terjadi?', t, C.amber);
  const blok = (x, judul, baris, warna, p) => { K.panel(c, x, 260, 780, 660, p, warna);
    alpha(c, p, () => { T(c, judul, x + 50, 320, {size: 34, weight: 800, color: warna});
      for (let i = 0; i < 9; i++) { const y = 390 + i * 56, b = baris[i]; const w = b ? b[1] : 'rgba(255,255,255,.08)';
        K.rrect(c, x + 50, y, b ? 600 : 120 + ((i * 97) % 380), 30, 8, w);
        if (b) T(c, b[0], x + 670, y + 16, {size: 26, weight: 700, color: b[1]}); } }); };
  const t2 = kt(a, 1, D * .5), p1 = O(S(t, .3, .9)), p2 = O(S(t, t2, t2 + .6));
  blok(140, 'Baris berbeda: digabung sendiri', {1: ['Raka', C.violet], 7: ['Nadia', C.amber]}, C.lime, p1);
  alpha(c, O(S(t, 1.6, 2.1)), () => K.chip(c, 530, 880, 'aman', C.lime));
  blok(1000, 'Baris yang sama: konflik', {4: ['keduanya', C.coral]}, C.coral, p2);
  alpha(c, O(S(t, t2 + .8, t2 + 1.3)), () => K.chip(c, 1390, 880, 'CONFLICT', C.coral));
};
K.adegan.tandaKonflik = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Membaca tanda konflik', t, C.amber, a.berkas || 'antrean.js');
  const baris = a.baris, lat = baris.map(b => b.startsWith('<<<<<<<') ? 'rgba(45,212,191,.28)' : b.startsWith('>>>>>>>') ? 'rgba(96,165,250,.28)' : b.startsWith('=======') ? 'rgba(255,255,255,.08)' : null);
  const zona = []; let z = 0; baris.forEach((b, i) => { if (b.startsWith('<<<<<<<')) z = 1; else if (b.startsWith('=======')) z = 2; else if (b.startsWith('>>>>>>>')) z = 3; zona.push(z); if (z === 3) z = 0; });
  const lat2 = baris.map((b, i) => lat[i] || (zona[i] === 1 ? 'rgba(45,212,191,.10)' : zona[i] === 2 ? 'rgba(96,165,250,.10)' : null));
  const p = O(S(t, .3, .9)); K.panel(c, 140, 230, 1060, 120 + baris.length * 56, p, C.amber);
  alpha(c, p, () => K.kodeBaris(c, 190, 300, baris, {size: 32, latar: lat2, w: 1000}));
  const lab = [[1, 'versi main (Nadia)', C.teal, 0], [2, 'pemisah', '#c7cfe6', 1], [3, 'versi Raka', C.sky, 2]];
  lab.forEach(([zz, s, w, k]) => { const idx = zz === 2 ? baris.findIndex(b => b.startsWith('=======')) : zona.findIndex(v => v === zz) ; const q = O(S(t, 1.2 + k * (D * .2), 1.7 + k * (D * .2)));
    const y = 300 + (zz === 2 ? idx : (idx + (zz === 1 ? 1 : 0))) * 56 * (32 * 1.55 / 56) ; alpha(c, q, () => { K.arrow(c, 1300, y, 1215, y, w, 5, 1, 16); T(c, s, 1320, y, {size: 36, weight: 800, color: w}); }); });
};

// ---------- G05 ----------
K.adegan.laptopServer = (c, t, D, a) => {
  K.bg(c); const tp = kt(a, 1, 1.0), ts = Math.max(tp + 2.5, D - 1.6), pecah = O(S(t, tp, tp + .6)), sambung = O(S(t, ts, ts + .8));
  alpha(c, 1 - sambung, () => { K.laptop(c, 960, 600, 1.4, {nama: 'laptop Raka', isi: (c, x, y, w, h) => T(c, 'siantre/ + .git', x + w / 2, y + h / 2, {size: 30, weight: 700, mono: true, align: 'center', color: C.teal})});
    if (pecah > 0) { c.save(); c.strokeStyle = C.coral; c.lineWidth = 18; c.lineCap = 'round'; c.globalAlpha *= pecah; c.beginPath(); c.moveTo(780, 300); c.lineTo(1140, 620); c.moveTo(1140, 300); c.lineTo(780, 620); c.stroke(); c.restore(); }
    alpha(c, pecah, () => T(c, 'Rusak = semua commit hilang', 960, 820, {size: 44, weight: 800, align: 'center', color: C.coral})); });
  alpha(c, sambung, () => { K.server(c, 960, 330, 1, {nama: 'server Git (remote)'});
    K.laptop(c, 420, 860, .9, {nama: 'Raka', warna: C.lime}); K.laptop(c, 1500, 860, .9, {nama: 'Nadia', warna: C.pink});
    K.arrow(c, 560, 700, 820, 470, C.lime, 6, O(S(t, ts + .5, ts + 1.1))); K.arrow(c, 1360, 700, 1100, 470, C.pink, 6, O(S(t, ts + .7, ts + 1.3))); });
};
K.adegan.remoteKonsep = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Remote: repository di server', t, C.sky);
  const p = O(S(t, .3, .9)); K.panel(c, 140, 250, 560, 620, p, C.lime); K.panel(c, 1220, 250, 560, 620, O(S(t, .5, 1.1)), C.sky);
  alpha(c, p, () => { T(c, 'Laptop', 190, 320, {size: 44, weight: 800, color: C.lime}); K.laptop(c, 420, 640, .9); });
  alpha(c, O(S(t, .5, 1.1)), () => { T(c, 'Remote (origin)', 1270, 320, {size: 44, weight: 800, color: C.sky}); K.server(c, 1500, 620, .9); });
  const sp = [['git push', 'kirim commit', 400, C.amber, true, kt(a, 1, D * .25)], ['git fetch', 'ambil, kode tidak diubah', 560, C.violet, false, kt(a, 2, D * .45)], ['git pull', '= fetch + merge', 720, C.teal, false, kt(a, 3, D * .65)]];
  sp.forEach(([k, s, y, w, kanan, ta]) => { const q = O(S(t, ta, ta + .7));
    if (kanan) K.arrow(c, 740, y, 1180, y, w, 7, q); else K.arrow(c, 1180, y, 740, y, w, 7, q);
    alpha(c, q, () => { T(c, k, 960, y - 42, {size: 36, weight: 800, mono: true, align: 'center', color: w}); T(c, s, 960, y + 40, {size: 28, weight: 500, align: 'center', color: C.redup}); }); });
};
K.adegan.forceBahaya = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Kenapa jangan --force?', t, C.coral);
  const y1 = 400, y2 = 720, xs = [260, 480, 700];
  T(c, 'server', 140, y1 - 110, {size: 32, weight: 700, color: C.redup}); T(c, 'laptop Raka', 140, y2 - 110, {size: 32, weight: 700, color: C.redup});
  for (const y of [y1, y2]) for (let i = 0; i < 2; i++) { if (i) K.garisCommit(c, xs[0], y, xs[1], y); K.simpul(c, xs[i], y, {warna: C.teal}); }
  K.garisCommit(c, xs[1], y1, xs[2], y1); const tf = kt(a, 1, D * .4), force = O(S(t, tf + 1.2, tf + 2.0));
  alpha(c, 1 - force * .6, () => K.simpul(c, xs[2], y1, {warna: C.pink, isi: true})); T(c, 'commit Nadia', xs[2] + 50, y1, {size: 32, weight: 700, color: C.pink, alpha: 1 - force * .6});
  K.garisCommit(c, xs[1], y2, xs[2], y2); K.simpul(c, xs[2], y2, {warna: C.lime, isi: true}); T(c, 'commit Raka', xs[2] + 50, y2, {size: 32, weight: 700, color: C.lime});
  if (force > 0) { c.save(); c.strokeStyle = C.coral; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(xs[2] - 50, y1 - 50); c.lineTo(K.lerp(xs[2] - 50, xs[2] + 260, force), K.lerp(y1 - 50, y1 + 50, force)); c.stroke(); c.restore();
    alpha(c, force, () => { K.rrect(c, 1080, y1 - 60, 640, 120, 20, 'rgba(255,107,107,.15)', C.coral, 3); T(c, 'push --force: commit Nadia terhapus', 1110, y1, {size: 32, weight: 800, color: C.coral, maxW: 590}); }); }
  const tb = kt(a, 2, D * .65), benar = O(S(t, tb, tb + .8));
  alpha(c, benar, () => { K.rrect(c, 1080, y2 - 60, 640, 120, 20, 'rgba(163,230,53,.12)', C.lime, 3); T(c, 'git pull, periksa, lalu push', 1110, y2, {size: 34, weight: 800, color: C.lime}); });
};
K.adegan.prKonsep = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Pull request', t, C.violet, '"Tolong periksa kode saya, lalu gabungkan kalau sudah baik."');
  const y = 640, xs = [200, 420, 640, 1580];
  K.garisCommit(c, xs[0], y, xs[1], y); K.garisCommit(c, xs[1], y, xs[2], y); for (let i = 0; i < 3; i++) K.simpul(c, xs[i], y, {warna: C.teal});
  K.chip(c, xs[0] + 60, y + 90, 'main', C.teal);
  const p = O(S(t, .6, 1.4)); for (let j = 0; j < 2; j++) { const x = 560 + j * 200; K.garisCommit(c, j ? x - 200 : xs[1], j ? 420 : y, x, 420, p, C.amber); K.simpul(c, x, 420, {warna: C.amber, p}); }
  alpha(c, p, () => K.chip(c, 760, 340, 'fitur/laporan-tunggu', C.amber, {size: 26}));
  const q = O(S(t, 1.8, 2.5)); K.panel(c, 940, 300, 440, 240, q, C.violet);
  alpha(c, q, () => { T(c, 'Pull request', 990, 360, {size: 38, weight: 800, color: C.violet}); T(c, 'review oleh Nadia', 990, 420, {size: 30, weight: 600, color: C.redup});
    c.save(); c.translate(1300, 470); c.strokeStyle = C.teks; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, 44, 24, 0, 0, 7); c.stroke(); c.beginPath(); c.arc(0, 0, 12, 0, 7); c.fillStyle = C.teks; c.fill(); c.restore(); });
  K.arrow(c, 780, 420, 930, 420, C.amber, 6, q);
  const tm = kt(a, 2, D * .6 - 1.5) + 1.5, m = O(S(t, tm, tm + .8)); K.garisCommit(c, xs[2], y, xs[3], y, m); K.garisCommit(c, 1160, 550, xs[3], y, m, C.violet); K.simpul(c, xs[3], y, {warna: C.teal, isi: true, p: m});
  alpha(c, m, () => T(c, 'merge ke main', xs[3], y + 90, {size: 32, weight: 800, align: 'center', color: C.teal}));
};

// ---------- G06 ----------
K.adegan.alurTim = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Alur kerja tim', t, C.teal);
  const L = [['Issue', C.redup], ['Branch', C.amber], ['Commit kecil', C.teal], ['Push', C.sky], ['Pull request', C.violet], ['Review + tes', C.pink], ['Merge', C.lime], ['Tag rilis', C.amber]];
  const cx = 960, cy = 590, R = 330;
  L.forEach(([s, w], i) => { const ang = -Math.PI / 2 + i * Math.PI * 2 / L.length, x = cx + Math.cos(ang) * R * 1.45, y = cy + Math.sin(ang) * R * .9;
    const tm = [kt(a, 1), kt(a, 2), kt(a, 3), kt(a, 3) != null ? kt(a, 3) + 1.4 : null, kt(a, 3) != null ? kt(a, 3) + 2.6 : null, kt(a, 4), kt(a, 4) != null ? kt(a, 4) + 1.8 : null, kt(a, 5)][i];
    const t0 = tm != null ? tm : .4 + i * (D * .08); const p = O(S(t, t0, t0 + .5));
    const ang2 = -Math.PI / 2 + (i + 1) * Math.PI * 2 / L.length; const x2 = cx + Math.cos(ang2) * R * 1.45, y2 = cy + Math.sin(ang2) * R * .9;
    if (i < L.length - 1) K.arrow(c, K.lerp(x, x2, .3), K.lerp(y, y2, .3), K.lerp(x, x2, .7), K.lerp(y, y2, .7), '#5b6a96', 5, O(S(t, t0 + .3, t0 + .7)), 14);
    alpha(c, p, () => { const w2 = K.lebar(c, s, 36, 800) + 60; K.rrect(c, x - w2 / 2, y - 40, w2, 80, 40, C.panel, w, 4); T(c, s, x, y + 2, {size: 36, weight: 800, align: 'center'}); }); });
  const tb = kt(a, 2, D * .75) + .8; alpha(c, O(S(t, tb, tb + .6)), () => T(c, 'satu issue = satu branch', cx, cy, {size: 40, weight: 700, align: 'center', color: C.amber}));
};
K.adegan.pesanCommit = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Pesan commit yang baik', t, C.teal, 'Menjawab: apa yang berubah?');
  const t2 = kt(a, 1, 1.2), p1 = O(S(t, .3, .9)), p2 = O(S(t, t2, t2 + .6)), t3 = kt(a, 2, D * .7), sr = O(S(t, t3, t3 + .5)); K.panel(c, 140, 270, 760, 560, p1, C.coral); K.panel(c, 1020, 270, 760, 560, p2, C.lime);
  alpha(c, p1, () => { T(c, 'Sulit dibaca', 190, 330, {size: 36, weight: 800, color: C.coral}); ['fix', 'update', 'coba lagi', 'fix lagi', 'final'].forEach((s, i) => T(c, s, 190, 420 + i * 78, {size: 34, weight: 600, mono: true})); });
  const ok = [['feat:', 'laporan waktu tunggu', C.teal], ['fix:', 'nomor kembali ke 1 tiap hari', C.amber], ['docs:', 'cara menjalankan server', C.sky], ['fix:', 'cegah bagi nol di laporan', C.amber]];
  alpha(c, p2, () => { T(c, 'Jelas', 1070, 330, {size: 36, weight: 800, color: C.lime}); ok.forEach(([k, s, w], i) => { if (i === 1 && sr > 0) K.rrect(c, 1050, 420 + i * 92 - 36, 700, 72, 16, `rgba(255,191,71,${.18 * sr})`, `rgba(255,191,71,${sr})`, 3); T(c, k, 1070, 420 + i * 92, {size: 32, weight: 800, mono: true, color: w}); T(c, s, 1190, 420 + i * 92, {size: 30, weight: 600, mono: true, maxW: 560}); }); });
};
K.adegan.mergeVsRebase = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'merge atau rebase?', t, C.violet);
  const panel = (x, judul, w, p) => { K.panel(c, x, 240, 800, 660, p, w); alpha(c, p, () => T(c, judul, x + 50, 300, {size: 40, weight: 800, mono: true, color: w})); };
  const pa = O(S(t, .3, .9)), pb = O(S(t, .6, 1.2)); panel(120, 'git merge', C.teal, pa); panel(1000, 'git pull --rebase', C.violet, pb);
  const yM = 640, yF = 460;
  // merge: dua induk
  alpha(c, pa, () => { const xs = [200, 360, 520]; for (let i = 0; i < 3; i++) { if (i) K.garisCommit(c, xs[i - 1], yM, xs[i], yM); K.simpul(c, xs[i], yM, {warna: C.teal, r: 22}); }
    K.garisCommit(c, 360, yM, 520, yF, 1, C.amber); K.garisCommit(c, 520, yF, 640, yF, 1, C.amber); K.simpul(c, 520, yF, {warna: C.amber, r: 22}); K.simpul(c, 640, yF, {warna: C.amber, r: 22});
    const m = O(S(t, 1.6, 2.4)); K.garisCommit(c, 520, yM, 800, yM, m); K.garisCommit(c, 640, yF, 800, yM, m, C.amber); K.simpul(c, 800, yM, {warna: C.teal, isi: true, r: 22, p: m});
    alpha(c, m, () => T(c, 'commit gabungan', 640, 800, {size: 30, weight: 700, align: 'center', color: C.redup})); });
  // rebase: diangkat ke ujung
  alpha(c, pb, () => { const xs = [1080, 1240, 1400]; for (let i = 0; i < 3; i++) { if (i) K.garisCommit(c, xs[i - 1], yM, xs[i], yM); K.simpul(c, xs[i], yM, {warna: C.teal, r: 22}); }
    const tr = kt(a, 1, 2.4) + .6, r = E(S(t, tr, tr + 1.2)); const xa = K.lerp(1400, 1560, r), xb = K.lerp(1520, 1720, r), ya = K.lerp(yF, yM, r);
    alpha(c, 1 - r, () => K.garisCommit(c, 1240, yM, 1400, yF, 1, C.amber));
    K.garisCommit(c, K.lerp(1400, 1400, r), yM, xa, ya, r, C.amber);
    K.garisCommit(c, xa, ya, xb, ya, 1, C.amber); K.simpul(c, xa, ya, {warna: C.amber, r: 22, hash: r > .9 ? "9b1e04'" : ''}); K.simpul(c, xb, ya, {warna: C.amber, r: 22, isi: true});
    alpha(c, O(S(t, tr + 1.2, tr + 1.8)), () => T(c, 'lurus, hash berubah', 1400, 800, {size: 30, weight: 700, align: 'center', color: C.redup})); });
  const tw = kt(a, 2, D * .7); alpha(c, O(S(t, tw, tw + .6)), () => { K.rrect(c, 360, 940, 1200, 80, 40, 'rgba(255,107,107,.15)', C.coral, 3); T(c, 'Rebase hanya untuk commit milikmu yang belum dipakai orang lain', 960, 981, {size: 32, weight: 700, align: 'center', color: '#ffd1d1'}); });
};
K.adegan.stashLaci = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'git stash: laci sementara', t, C.sky);
  const masuk = E(S(t, .8, 1.8)), keluar = E(S(t, D * .6, D * .6 + 1));
  K.rrect(c, 760, 560, 400, 240, 20, '#2a3558', '#c7cfe6', 4); K.rrect(c, 900, 660, 120, 24, 12, '#c7cfe6'); T(c, 'stash', 960, 760, {size: 30, weight: 700, mono: true, align: 'center', color: C.redup});
  const y = K.lerp(K.lerp(360, 610, masuk), 360, keluar); const x = K.lerp(K.lerp(300, 850, masuk), 1300, keluar);
  if (masuk < .98 || keluar > .02) K.berkas(c, x, y, 'tv.js (setengah jadi)', {warna: C.amber, size: 28});
  alpha(c, O(S(t, 1.8, 2.4)) * (1 - keluar), () => { K.chip(c, 960, 300, 'perbaiki bug di main', C.coral); });
  alpha(c, O(S(t, .4, .8)), () => T(c, 'git stash', 520, 900, {size: 38, weight: 800, mono: true, align: 'center', color: C.sky}));
  alpha(c, O(S(t, D * .6, D * .6 + .5)), () => T(c, 'git stash pop', 1400, 900, {size: 38, weight: 800, mono: true, align: 'center', color: C.lime}));
};
K.adegan.aiPesan = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Cek pesan commit buatan AI', t, C.violet);
  alpha(c, O(S(t, .2, .6)), () => { K.rrect(c, 1340, 80, 440, 52, 26, 'rgba(167,139,250,.2)', C.violet, 2); T(c, 'contoh pesan bergaya hasil AI', 1560, 107, {size: 22, weight: 700, align: 'center', color: '#ddd3ff'}); });
  const p = O(S(t, .5, 1.1)); K.panel(c, 140, 230, 1640, 150, p, C.violet);
  alpha(c, p, () => { T(c, 'Saran pesan:', 190, 285, {size: 28, weight: 700, color: C.redup}); T(c, 'feat: tambah validasi nomor antrean', 190, 335, {size: 36, weight: 700, mono: true}); });
  const tq = kt(a, 1, 1.6), q = O(S(t, tq, tq + .6)); K.panel(c, 140, 420, 1640, 470, q, C.amber);
  const baris = [' function ambilNomor(layanan) {', '+  if (!KODE[layanan]) {', "+    throw new Error('Layanan tidak dikenal');", '+  }', '-  if (nomorTerakhir >= 999) nomorTerakhir = 0;', '   nomorTerakhir = nomorTerakhir + 1;'];
  const w = baris.map(b => b[0] === '+' ? '#86efac' : b[0] === '-' ? '#fca5a5' : '#e6e9f2');
  const ts2 = kt(a, 2, D * .5 - 2) + 2, sor = O(S(t, ts2, ts2 + .6));
  alpha(c, q, () => { T(c, 'git diff', 190, 470, {size: 28, weight: 700, mono: true, color: C.amber}); K.kodeBaris(c, 190, 540, baris, {size: 32, warna: w, latar: baris.map((b, i) => i === 4 ? `rgba(255,107,107,${.3 * sor})` : null), w: 1560}); });
  alpha(c, sor, () => { K.arrow(c, 1560, 790, 1500, 750, C.coral, 5, 1, 14); T(c, 'tidak disebut di pesan!', 1570, 810, {size: 30, weight: 800, color: C.coral}); });
};
})();
