// Adegan konsep untuk video "Vibe Coding Aplikasi Patungan". Memakai pustaka K (kanvas.js).
(() => {
const C = K.C, T = K.text, S = K.seg, O = K.out;
const rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID');
const fade = (t, D, a = .4) => Math.min(1, K.clamp(t / a), K.clamp((D - t) / .35));

// bingkai HP yang digambar dengan kode; isi(c, x, y, w, h) menggambar layar
K.hp = (c, cx, cy, h, isi, o = {}) => {
  const w = h * 0.47, x = cx - w / 2, y = cy - h / 2, r = h * 0.07;
  c.save(); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 40; c.shadowOffsetY = 16;
  K.rrect(c, x, y, w, h, r, '#0b0f1a'); c.restore();
  K.rrect(c, x, y, w, h, r, null, '#3a4566', 4);
  const m = h * 0.025, sx = x + m, sy = y + m, sw = w - 2 * m, sh = h - 2 * m;
  c.save(); c.beginPath(); c.roundRect(sx, sy, sw, sh, r * 0.8); c.clip();
  c.fillStyle = o.layar || '#f4f4f4'; c.fillRect(sx, sy, sw, sh);
  if (isi) isi(c, sx, sy, sw, sh);
  c.restore();
  K.rrect(c, cx - w * 0.12, sy + 10, w * 0.24, 16, 8, '#0b0f1a');
};

// --- Kartu judul ---
K.adegan.judul = (c, t, D, a) => {
  if (a.bg) K.latar(c, a.bg, 0.8); else K.bg(c);
  const p1 = O(S(t, .1, .7)), p2 = O(S(t, .5, 1.2)), p3 = O(S(t, 1.1, 1.8));
  c.save(); c.globalAlpha = p1; K.rrect(c, 140, 270, 330, 56, 28, C.amber);
  T(c, 'VIBE CODING', 305, 299, {size: 24, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  c.save(); c.globalAlpha = p2; let y = 400 + 20 * (1 - p2);
  for (const b of a.judul.split('\n')) { T(c, b, 140, y, {size: 86, weight: 800}); y += 104; } c.restore();
  if (a.hook) { c.save(); c.globalAlpha = p3; T(c, a.hook, 140, y + 40, {size: 38, weight: 500, color: '#c9d3ee', maxW: 1100, lh: 1.35}); c.restore(); }
  // HP kecil di kanan berisi ringkasan
  const pp = O(S(t, .8, 1.6));
  c.save(); c.globalAlpha = pp; K.hp(c, 1560, 560 + 40 * (1 - pp), 820, (c, x, y, w, h) => layarRingkas(c, x, y, w, h, 1)); c.restore();
};
function layarRingkas(c, x, y, w, h, p) {
  T(c, 'Patungan', x + 30, y + 80, {size: 36, weight: 800, color: '#1d2333'});
  T(c, 'Kafe Senja · total Rp187.110', x + 30, y + 125, {size: 20, weight: 500, color: '#667'});
  const data = [['Andi', 50300], ['Bela', 50300], ['Citra', 47100], ['Dimas', 39700]];
  data.forEach(([n, v], i) => {
    const q = K.clamp(p * 5 - i * .6); const yy = y + 190 + i * 92;
    c.save(); c.globalAlpha = q; K.rrect(c, x + 22, yy, w - 44, 76, 14, '#fff', '#e3e6ee', 2);
    T(c, n, x + 44, yy + 38, {size: 28, weight: 700, color: '#1d2333'}); T(c, rp(v), x + w - 44, yy + 38, {size: 28, weight: 800, color: '#0a7a50', align: 'right'}); c.restore();
  });
  K.rrect(c, x + 22, y + h - 120, w - 44, 76, 16, '#0a7a50');
  T(c, 'Bagikan ke WhatsApp', x + w / 2, y + h - 82, {size: 24, weight: 800, color: '#fff', align: 'center'});
}

// --- V01: apa itu vibe coding ---
K.adegan.vibe = (c, t, D) => {
  K.bg(c); K.judul(c, 'Vibe coding', t, C.amber, 'Kamu menjelaskan, AI menulis kodenya');
  const p = O(S(t, .4, 1.2));
  K.panel(c, 140, 280, 720, 520, p, C.sky);
  c.save(); c.globalAlpha = p; T(c, 'Kamu', 190, 340, {size: 32, weight: 800, color: C.sky});
  const kal = 'Buatkan aplikasi untuk membagi tagihan makan bareng.'; const n = Math.floor(K.clamp((t - 1) / 2.2) * kal.length);
  T(c, kal.slice(0, n), 190, 420, {size: 40, weight: 600, maxW: 620, lh: 1.35}); c.restore();
  K.arrow(c, 900, 540, 1020, 540, C.amber, 6, O(S(t, 3, 3.6)));
  const p2 = O(S(t, 3.4, 4));
  K.panel(c, 1060, 280, 720, 520, p2, C.teal);
  c.save(); c.globalAlpha = p2; T(c, 'AI', 1110, 340, {size: 32, weight: 800, color: C.teal});
  const kode = ['function hitung(struk) {', '  const total = ...', '  for (const m of struk.menu) {', '    ...', '  }', '  return bagian;', '}'];
  const ch = Math.floor(K.clamp((t - 3.8) / 3) * 160);
  K.kode(c, kode, 1100, 380, {size: 28, tanpaPanel: true, chars: ch}); c.restore();
};
K.adegan.duaKolom = (c, t, D, a) => {
  K.bg(c); K.judul(c, a.judul || 'Kapan aman, kapan berbahaya?', t, C.amber);
  const kol = a.kolom || [
    {judul: 'Aman untuk vibe coding', warna: C.teal, item: ['Prototipe', 'Alat pribadi', 'Belajar hal baru']},
    {judul: 'Berbahaya tanpa pemeriksaan', warna: C.coral, item: ['Uang', 'Data pribadi', 'Keamanan', 'Dipakai banyak orang']}];
  kol.forEach((k, i) => {
    const x = 140 + i * 840, p = O(S(t, .4 + i * .9, 1.1 + i * .9));
    K.panel(c, x, 220, 800, 700, p, k.warna);
    c.save(); c.globalAlpha = p; T(c, k.judul, x + 50, 300, {size: 44, weight: 800, color: k.warna, maxW: 720});
    k.item.forEach((it, j) => { const q = O(S(t, 1 + i * .9 + j * .45, 1.5 + i * .9 + j * .45)); c.globalAlpha = p * q;
      K.rrect(c, x + 50, 380 + j * 120, 700, 96, 18, 'rgba(255,255,255,.05)'); T(c, it, x + 90, 428 + j * 120, {size: 40, weight: 600, maxW: 640}); });
    c.restore();
  });
  if (a.sorot !== undefined) { const p = O(S(t, D * .55, D * .55 + .6)); c.save(); c.globalAlpha = p;
    K.rrect(c, 980 + 50, 380 + a.sorot * 120, 700, 96, 18, null, C.amber, 5); T(c, '← Patungan', 1560, 428 + a.sorot * 120, {size: 32, weight: 800, color: C.amber}); c.restore(); }
};
const LANGKAH = [['Spek', 'tulis apa yang dibuat', C.sky], ['Prompt kecil', 'satu tugas', C.violet], ['Baca', 'sampai paham', C.teal], ['Uji', 'dengan kunci jawaban', C.amber], ['Commit', 'titik aman', C.lime]];
K.adegan.siklus = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Vibe coding dengan disiplin', t, C.amber, 'Lima langkah yang berulang');
  const cx = 960, cy = 590, R = 330, sorot = a.sorot ?? -1;
  c.save(); c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke(); c.restore();
  // panah berputar
  const rot = t * 0.5; c.save(); c.strokeStyle = C.amber; c.lineWidth = 8; c.lineCap = 'round'; c.globalAlpha = .55;
  c.beginPath(); c.arc(cx, cy, R, rot, rot + .6); c.stroke(); c.restore();
  LANGKAH.forEach(([j, s, w], i) => {
    const ang = -Math.PI / 2 + i * Math.PI * 2 / 5, x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R;
    const p = a.semua ? 1 : O(S(t, .4 + i * (D * .12), .9 + i * (D * .12)));
    const on = sorot === i || (Array.isArray(sorot) && sorot.includes(i)), redup = sorot !== -1 && !on;
    c.save(); c.globalAlpha = p * (redup ? .35 : 1); const s2 = on ? 1 + .06 * Math.sin(t * 4) : 1;
    c.translate(x, y); c.scale(s2, s2);
    K.rrect(c, -170, -70, 340, 140, 28, C.panel, w, on ? 6 : 3);
    T(c, (i + 1) + '. ' + j, 0, -18, {size: 38, weight: 800, align: 'center', color: w});
    T(c, s, 0, 30, {size: 24, weight: 500, align: 'center', color: C.redup}); c.restore();
  });
  T(c, 'ulangi', cx, cy, {size: 34, weight: 700, align: 'center', color: C.redup, alpha: O(S(t, 1, 2))});
};
K.adegan.alat = (c, t, D) => {
  K.bg(c); K.judul(c, 'Alat boleh apa saja', t, C.amber, 'Yang penting lima langkahnya');
  const p = O(S(t, .3, 1));
  K.panel(c, 140, 230, 900, 640, p, C.teal);
  c.save(); c.globalAlpha = p; K.rrect(c, 180, 280, 820, 540, 14, '#0d1222');
  T(c, 'Terminal', 210, 315, {size: 22, weight: 700, color: C.redup});
  T(c, '$ claude', 210, 380, {size: 32, weight: 600, mono: true, color: C.lime});
  T(c, '> Buat kerangka proyek Vite...', 210, 440, {size: 28, weight: 500, mono: true});
  T(c, '● Kerangka sudah jadi.', 210, 500, {size: 28, weight: 500, mono: true, color: C.teal}); c.restore();
  const nama = [['Claude Code', 'yang dipakai di video ini'], ['Gemini CLI', 'ada kuota gratis'], ['GitHub Copilot', 'gratis untuk pelajar dan mahasiswa'], ['Cursor', 'editor dengan AI']];
  nama.forEach(([n, s], i) => { const q = O(S(t, 1 + i * .5, 1.5 + i * .5)); c.save(); c.globalAlpha = q;
    K.rrect(c, 1100, 250 + i * 150, 680, 124, 20, C.panel, i ? C.garis : C.amber, 3);
    T(c, n, 1140, 296 + i * 150, {size: 40, weight: 800, color: i ? C.teks : C.amber}); T(c, s, 1140, 342 + i * 150, {size: 26, weight: 500, color: C.redup}); c.restore(); });
};

// --- V04: pola data -> tampil -> layar ---
K.adegan.pola = (c, t, D) => {
  K.bg(c); K.judul(c, 'Pola yang dipakai di seluruh aplikasi', t, C.teal);
  const box = [[260, 'Data', 'state.menu\nstate.orang', C.sky], [960, 'tampil()', 'gambar ulang', C.amber], [1660, 'Layar', 'yang dilihat pengguna', C.teal]];
  box.forEach(([x, j, s, w], i) => { const p = O(S(t, .4 + i * .7, 1 + i * .7)); c.save(); c.globalAlpha = p;
    K.rrect(c, x - 230, 400, 460, 280, 28, C.panel, w, 4); T(c, j, x, 480, {size: 52, weight: 800, align: 'center', color: w, mono: i === 1});
    s.split('\n').forEach((l, k) => T(c, l, x, 560 + k * 46, {size: 32, weight: 500, align: 'center', color: C.redup, mono: i === 0})); c.restore(); });
  K.arrow(c, 500, 540, 720, 540, C.teks, 6, O(S(t, 1.1, 1.6))); K.arrow(c, 1200, 540, 1420, 540, C.teks, 6, O(S(t, 1.8, 2.3)));
  const p = O(S(t, 2.6, 3.2));
  c.save(); c.globalAlpha = p; K.path(c, [[1660, 690], [1660, 820], [260, 820], [260, 690]], C.violet, 5, O(S(t, 2.6, 3.8)));
  T(c, 'tombol diketuk → data berubah → tampil() dipanggil lagi', 960, 870, {size: 32, weight: 600, align: 'center', color: C.violet}); c.restore();
};

// --- V05: batang proporsional ---
const ORG = [['Andi', 47500, C.sky], ['Bela', 47500, C.violet], ['Citra', 44500, C.pink], ['Dimas', 37500, C.lime]];
K.adegan.batang = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Dibagi sebanding', t, C.amber, 'Struk berempat: subtotal Rp177.000, total Rp187.110');
  const x0 = 160, Wmax = 1600, sub = 177000, tot = 187110;
  const regang = a.regang ? O(S(t, D * .35, D * .35 + 2.2)) : 0;
  const skala = K.lerp(1, tot / sub, regang), W = Wmax * sub / tot * skala;
  // batang total di atas (pucat)
  const pT = O(S(t, .4, 1));
  c.save(); c.globalAlpha = pT; K.rrect(c, x0, 300, Wmax, 90, 16, 'rgba(255,255,255,.06)', C.garis, 2);
  T(c, 'Total struk ' + rp(tot), x0 + 24, 345, {size: 32, weight: 700, color: C.redup}); c.restore();
  // batang subtotal dipotong 4 warna
  let x = x0;
  ORG.forEach(([n, v, w], i) => {
    const p = O(S(t, 1 + i * .45, 1.5 + i * .45)), ww = W * v / sub;
    c.save(); c.globalAlpha = p; K.rrect(c, x + 3, 470, ww - 6, 150, 14, w);
    T(c, n, x + ww / 2, 520, {size: 34, weight: 800, align: 'center', color: '#141a2c'});
    T(c, rp(K.lerp(v, v * tot / sub, regang)), x + ww / 2, 575, {size: 30, weight: 700, align: 'center', color: '#141a2c'}); c.restore();
    x += ww;
  });
  const lab = regang > .5 ? 'meregang menjadi total, setiap warna ikut meregang' : 'subtotal ' + rp(sub);
  T(c, lab, x0, 680, {size: 32, weight: 600, color: regang > .5 ? C.amber : C.redup, alpha: O(S(t, 2.5, 3))});
  // voucher, service, pajak
  if (a.regang) { const q = O(S(t, D * .2, D * .2 + .6)); c.save(); c.globalAlpha = q;
    [['voucher −15.000', C.coral], ['service 5% +8.100', C.teal], ['pajak 10% +17.010', C.amber]].forEach(([s, w], i) => {
      K.rrect(c, x0 + i * 540, 780, 500, 90, 18, C.panel, w, 3); T(c, s, x0 + i * 540 + 250, 825, {size: 34, weight: 700, align: 'center', color: w}); }); c.restore(); }
};
K.adegan.rumus = (c, t, D) => {
  K.bg(c); K.judul(c, 'Rumusnya hanya satu baris', t, C.amber);
  const p = O(S(t, .3, 1));
  c.save(); c.globalAlpha = p; K.rrect(c, 260, 320, 1400, 200, 30, C.panel, C.amber, 4);
  T(c, 'bagian = porsi × total ÷ subtotal', 960, 420, {size: 64, weight: 800, align: 'center'}); c.restore();
  const p2 = O(S(t, 1.5, 2.2));
  c.save(); c.globalAlpha = p2; T(c, 'Andi: 47.500 × 187.110 ÷ 177.000 = 50.213,14...', 960, 640, {size: 44, weight: 600, align: 'center', mono: true, color: C.sky}); c.restore();
  const p3 = O(S(t, 2.8, 3.5));
  c.save(); c.globalAlpha = p3; T(c, 'Yang membuatnya rumit adalah pembulatan.', 960, 780, {size: 44, weight: 700, align: 'center', color: C.amber}); c.restore();
};
K.adegan.bulat = (c, t, D) => {
  K.bg(c); K.judul(c, 'Dibulatkan ke mana?', t, C.amber);
  const kol = [['Ke terdekat', [50200, 50200, 47000, 39600], 187000, 'kurang Rp110, Andi rugi', C.coral], ['Ke atas', [50300, 50300, 47100, 39700], 187400, 'lebih Rp290 untuk Andi', C.teal]];
  kol.forEach(([j, vals, sum, ket, w], i) => {
    const x = 160 + i * 820, p = O(S(t, .4 + i * (D * .3), 1 + i * (D * .3)));
    K.panel(c, x, 220, 780, 740, p, w);
    c.save(); c.globalAlpha = p; T(c, j, x + 50, 300, {size: 48, weight: 800, color: w});
    ORG.forEach(([n], k) => { T(c, n, x + 60, 400 + k * 80, {size: 38, weight: 600}); T(c, rp(vals[k]), x + 720, 400 + k * 80, {size: 38, weight: 700, align: 'right', mono: true}); });
    c.fillStyle = C.garis; c.fillRect(x + 50, 710, 680, 3);
    T(c, 'Jumlah', x + 60, 770, {size: 38, weight: 800}); T(c, rp(sum), x + 720, 770, {size: 40, weight: 800, align: 'right', mono: true});
    K.rrect(c, x + 50, 840, 680, 80, 40, w); T(c, ket, x + 390, 880, {size: 32, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  });
};
K.adegan.ujian = (c, t, D) => { // analogi tes ditulis duluan
  K.bg(c); K.judul(c, 'Tes dulu, baru kode', t, C.amber);
  const p = O(S(t, .4, 1));
  K.panel(c, 160, 240, 760, 600, p, C.coral);
  c.save(); c.globalAlpha = p; T(c, 'AI menulis kode DAN tesnya', 210, 320, {size: 38, weight: 800, color: C.coral, maxW: 680});
  T(c, 'Seperti murid yang membuat soal ujian sekaligus kunci jawabannya sendiri.', 210, 440, {size: 34, weight: 500, maxW: 660, lh: 1.4, color: C.redup}); c.restore();
  const p2 = O(S(t, D * .45, D * .45 + .6));
  K.panel(c, 1000, 240, 760, 600, p2, C.teal);
  c.save(); c.globalAlpha = p2; T(c, 'Kita menulis kunci jawaban', 1050, 320, {size: 38, weight: 800, color: C.teal, maxW: 680});
  T(c, 'Angka di tes berasal dari hitungan manual di SPEK.md, bukan dari AI.', 1050, 440, {size: 34, weight: 500, maxW: 660, lh: 1.4, color: C.redup}); c.restore();
};
K.adegan.licik = (c, t, D) => {
  K.bg(c); K.judul(c, 'Contoh yang lebih licik', t, C.amber, 'Satu tes hanya membuktikan satu contoh');
  const it = [['1', 'Tiga orang berbagi Rp10.000', 'masing-masing Rp3.400, kelebihan Rp200', C.sky], ['2', 'Tanpa voucher, service, pajak', 'hasil = porsi pesanan', C.violet], ['3', 'Menu tanpa pemakan', '???', C.coral]];
  it.forEach(([n, j, s, w], i) => { const p = O(S(t, .6 + i * (D * .22), 1.2 + i * (D * .22))); c.save(); c.globalAlpha = p;
    K.rrect(c, 160, 240 + i * 230, 1600, 190, 26, C.panel, w, 3); K.rrect(c, 200, 290 + i * 230, 90, 90, 45, w);
    T(c, n, 245, 336 + i * 230, {size: 48, weight: 800, align: 'center', color: '#141a2c'});
    T(c, j, 340, 310 + i * 230, {size: 44, weight: 800}); T(c, s, 340, 372 + i * 230, {size: 34, weight: 600, color: i === 2 ? C.coral : C.redup, mono: i < 2}); c.restore(); });
};
K.adegan.pikir = (c, t, D, a) => { // kartu "Pikirkan dulu" di atas latar beku
  if (a.bg) K.latar(c, a.bg, 0.78); else K.bg(c);
  const p = O(S(t, 0, .5));
  c.save(); c.globalAlpha = p; K.rrect(c, 960 - 300, 200, 600, 96, 48, C.amber); T(c, 'Pikirkan dulu', 960, 248, {size: 54, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  if (a.tanya) T(c, a.tanya, 960, 440, {size: 50, weight: 700, align: 'center', maxW: 1400, alpha: p});
  const t0 = Math.max(.6, D - 3.4), sisa = Math.ceil(K.clamp(3 - (t - t0), 0, 3));
  if (t > t0 && t < t0 + 3) { const f = (t - t0) % 1; c.save(); c.strokeStyle = C.amber; c.lineWidth = 14; c.beginPath(); c.arc(960, 720, 120, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - f)); c.stroke();
    T(c, String(sisa), 960, 724, {size: 140, weight: 800, align: 'center'}); c.restore(); }
  else if (t <= t0) T(c, '?', 960, 720, {size: 200, weight: 800, align: 'center', color: C.amber, alpha: p});
};

// --- V06: jangkauan jempol ---
K.adegan.jempol = (c, t, D) => {
  K.bg(c); K.judul(c, 'Jangkauan jempol', t, C.teal, 'HP dipegang satu tangan');
  K.hp(c, 700, 600, 860, (c, x, y, w, h) => {
    const p = O(S(t, .6, 1.4)); c.save(); c.globalAlpha = p;
    const g = c.createRadialGradient(x + w * .85, y + h * 1.02, 10, x + w * .85, y + h * 1.02, h * .72);
    g.addColorStop(0, 'rgba(45,212,191,.75)'); g.addColorStop(.62, 'rgba(45,212,191,.35)'); g.addColorStop(.63, 'rgba(255,176,32,.28)'); g.addColorStop(.85, 'rgba(255,176,32,.22)'); g.addColorStop(.86, 'rgba(255,107,107,.32)'); g.addColorStop(1, 'rgba(255,107,107,.38)');
    c.fillStyle = g; c.fillRect(x, y, w, h); c.restore();
    const q = O(S(t, D * .5, D * .5 + .6)); c.save(); c.globalAlpha = q; K.rrect(c, x + 20, y + h - 110, w - 40, 80, 16, '#0a7a50');
    T(c, 'Hitung', x + w / 2, y + h - 70, {size: 30, weight: 800, align: 'center', color: '#fff'}); c.restore();
  }, {layar: '#e9ecf2'});
  const leg = [['mudah dijangkau', C.teal], ['masih bisa', C.amber], ['sulit', C.coral]];
  leg.forEach(([s, w], i) => { const p = O(S(t, 1.2 + i * .3, 1.7 + i * .3)); c.save(); c.globalAlpha = p; K.rrect(c, 1150, 380 + i * 110, 60, 60, 14, w); T(c, s, 1240, 410 + i * 110, {size: 40, weight: 700}); c.restore(); });
  const p = O(S(t, D * .5, D * .5 + .6)); c.save(); c.globalAlpha = p; T(c, 'Tombol utama di bawah, minimal 48 px', 1150, 760, {size: 36, weight: 700, color: C.amber, maxW: 640}); c.restore();
};

// --- V07: laci localStorage ---
K.adegan.laci = (c, t, D) => {
  K.bg(c); K.judul(c, 'localStorage: laci kecil di browser', t, C.sky, 'Tetap ada walau browser ditutup, tidak dikirim ke server');
  K.hp(c, 420, 600, 720, (c, x, y, w, h) => { T(c, 'Patungan', x + 30, y + 80, {size: 30, weight: 800, color: '#1d2333'});
    ['Nasi goreng  32.000', 'Mie ayam  28.000', 'Kentang  30.000'].forEach((s, i) => T(c, s, x + 30, y + 150 + i * 56, {size: 22, weight: 600, color: '#333'})); });
  // laci
  const p = O(S(t, .6, 1.2)); c.save(); c.globalAlpha = p;
  K.rrect(c, 1100, 380, 640, 420, 26, '#2a3354', C.sky, 4); K.rrect(c, 1100, 380, 640, 70, 26, C.sky); T(c, 'localStorage', 1420, 416, {size: 34, weight: 800, align: 'center', color: '#141a2c'});
  K.rrect(c, 1380, 470, 80, 18, 9, '#55608a'); c.restore();
  // teks JSON terbang dari HP ke laci
  const f = K.clamp((t - 1.6) / 2.2); const ex = K.lerp(560, 1150, O(f)), ey = K.lerp(500, 560, O(f));
  c.save(); c.globalAlpha = K.clamp(f * 4); K.rrect(c, ex - 10, ey - 40, 560, 160, 16, '#0d1222', C.amber, 3);
  K.kode(c, ['{"menu":[{"nama":"Nasi goreng",', '  "harga":32000}, ...]}'], ex, ey - 40, {size: 24, tanpaPanel: true}); c.restore();
  const q = O(S(t, 4.2, 4.8)); c.save(); c.globalAlpha = q; T(c, 'JSON.stringify saat menyimpan  ·  JSON.parse saat membaca', 960, 920, {size: 34, weight: 600, align: 'center', color: C.amber}); c.restore();
};

// --- V08: pesan WhatsApp dan dua jalur ---
K.adegan.pesan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Pesan yang enak dibaca', t, C.teal);
  const bad = ['Andi: 50213.14', 'Bela: 50213.14', 'Citra 47041.78', 'Dimas: 39641.95000001'];
  const good = ['Patungan Kafe Senja, 17 Nov', 'Total struk Rp187.110 (ditalangi Andi)', '', 'Bela  Rp50.300', 'Citra Rp47.100', 'Dimas Rp39.700', '', 'Bagian Andi Rp50.300.', 'Kelebihan Rp290 karena pembulatan ke atas.', 'Transfer ke Andi ya.'];
  const p = O(S(t, .4, 1));
  c.save(); c.globalAlpha = p; T(c, 'Berantakan', 160, 250, {size: 36, weight: 800, color: C.coral});
  K.rrect(c, 160, 290, 640, 280, 22, '#e7fcd9'); bad.forEach((s, i) => T(c, s, 190, 340 + i * 54, {size: 30, weight: 500, color: '#222', mono: true})); c.restore();
  const p2 = O(S(t, 1.4, 2));
  c.save(); c.globalAlpha = p2; T(c, 'Rapi', 900, 250, {size: 36, weight: 800, color: C.teal});
  K.rrect(c, 900, 290, 860, 640, 22, '#e7fcd9'); good.forEach((s, i) => T(c, s, 930, 340 + i * 56, {size: 30, weight: i === 0 ? 800 : 500, color: '#1a1a1a'})); c.restore();
};
K.adegan.jalur = (c, t, D) => {
  K.bg(c); K.judul(c, 'Tombol Bagikan: dua jalur', t, C.teal);
  const rows = [[340, 'Web Share API', ['Menu bagikan HP', 'WhatsApp / Telegram / salin'], C.teal, 'di HP'], [700, 'Cadangan: link wa.me', ['wa.me/?text=...', 'WhatsApp terbuka dengan pesan terisi'], C.amber, 'di laptop']];
  rows.forEach(([y, j, langkah, w, ket], i) => { const p = O(S(t, .4 + i * 1.4, 1 + i * 1.4)); c.save(); c.globalAlpha = p;
    K.rrect(c, 160, y - 70, 340, 140, 70, '#0a7a50'); T(c, 'Bagikan', 330, y, {size: 40, weight: 800, align: 'center', color: '#fff'});
    T(c, j, 330, y + 110, {size: 28, weight: 700, align: 'center', color: w});
    K.arrow(c, 520, y, 680, y, C.teks, 5, O(S(t, .8 + i * 1.4, 1.2 + i * 1.4)));
    K.rrect(c, 700, y - 80, 560, 160, 22, C.panel, w, 3); T(c, langkah[0], 980, y - 20, {size: 36, weight: 800, align: 'center', mono: i === 1}); T(c, langkah[1], 980, y + 30, {size: 26, weight: 500, align: 'center', color: C.redup});
    K.rrect(c, 1320, y - 40, 260, 80, 40, w); T(c, ket, 1450, y, {size: 30, weight: 800, align: 'center', color: '#141a2c'}); c.restore(); });
};

// --- V09: PWA ---
K.adegan.pwaKartu = (c, t, D) => {
  K.bg(c); K.judul(c, 'Dua bagian PWA', t, C.violet);
  const k = [['manifest', 'KTP aplikasi', ['nama: Patungan', 'ikon 192 / 512 px', 'warna tema', 'buka layar penuh'], C.sky], ['service worker', 'penjaga gudang', ['berdiri di antara aplikasi', 'dan internet', 'menyimpan salinan berkas', 'di cache'], C.amber]];
  k.forEach(([j, s, it, w], i) => { const x = 160 + i * 840, p = O(S(t, .4 + i * (D * .35), 1 + i * (D * .35))); K.panel(c, x, 220, 780, 720, p, w);
    c.save(); c.globalAlpha = p; T(c, j, x + 60, 310, {size: 54, weight: 800, mono: true, color: w}); T(c, s, x + 60, 380, {size: 36, weight: 600, color: C.redup});
    it.forEach((s2, q) => T(c, '• ' + s2, x + 60, 490 + q * 76, {size: 36, weight: 500})); c.restore(); });
};
K.adegan.gudang = (c, t, D, a) => {
  K.bg(c); const offline = t > D * .5;
  K.judul(c, offline ? 'Kunjungan berikutnya: mode pesawat' : 'Kunjungan pertama: online', t, offline ? C.amber : C.teal);
  // HP, penjaga, internet, gudang
  K.hp(c, 260, 600, 560, (c, x, y, w, h) => T(c, 'Patungan', x + w / 2, y + h / 2, {size: 30, weight: 800, align: 'center', color: '#1d2333'}));
  const pj = [960, 540];
  c.save(); c.fillStyle = C.amber; c.beginPath(); c.arc(pj[0], pj[1] - 70, 46, 0, Math.PI * 2); c.fill(); K.rrect(c, pj[0] - 70, pj[1] - 20, 140, 160, 40, C.amber);
  T(c, 'service worker', pj[0], pj[1] + 190, {size: 32, weight: 800, align: 'center', color: C.amber}); c.restore();
  // internet
  c.save(); c.globalAlpha = offline ? .3 : 1; K.rrect(c, 1450, 300, 330, 200, 100, C.panel, C.sky, 4); T(c, 'internet', 1615, 400, {size: 38, weight: 800, align: 'center', color: C.sky});
  if (offline) { c.strokeStyle = C.coral; c.lineWidth = 10; c.beginPath(); c.moveTo(1470, 310); c.lineTo(1760, 490); c.stroke(); } c.restore();
  // gudang
  K.rrect(c, 1450, 640, 330, 220, 20, '#2a3354', C.lime, 4); T(c, 'cache (gudang)', 1615, 690, {size: 32, weight: 800, align: 'center', color: C.lime});
  const isi = offline ? 1 : K.clamp((t - D * .25) / (D * .15));
  ['index.html', 'main.js', 'style.css'].forEach((s, i) => { c.save(); c.globalAlpha = K.clamp(isi * 3 - i); T(c, s, 1615, 740 + i * 38, {size: 26, weight: 600, align: 'center', mono: true}); c.restore(); });
  // panah
  const lt = (t % (D * .5)) / (D * .5);
  K.arrow(c, 420, 560, 880, 560, C.teks, 5, O(K.clamp(lt * 4)));
  if (!offline) { K.arrow(c, 1040, 500, 1440, 410, C.sky, 5, O(K.clamp(lt * 4 - 1))); K.arrow(c, 1040, 600, 1440, 740, C.lime, 5, O(K.clamp(lt * 4 - 2))); }
  else { K.arrow(c, 1440, 760, 1040, 620, C.lime, 6, O(K.clamp(lt * 4 - 1))); T(c, 'diambil dari gudang', 1200, 860, {size: 32, weight: 700, color: C.lime, align: 'center', alpha: K.clamp(lt * 4 - 1.5)}); }
};
K.adegan.versi = (c, t, D) => {
  K.bg(c); K.judul(c, 'Jebakan: versi lama terus dipakai', t, C.coral, 'Solusi: beri nomor versi pada gudang');
  const p = O(S(t, .4, 1));
  c.save(); c.globalAlpha = p;
  K.rrect(c, 200, 300, 620, 300, 24, '#2a3354', C.redup, 3); T(c, 'patungan-v1', 510, 360, {size: 40, weight: 800, align: 'center', mono: true, color: C.redup});
  T(c, 'main.js (lama, ada bug)', 510, 450, {size: 30, weight: 600, align: 'center', mono: true}); c.restore();
  const p2 = O(S(t, D * .4, D * .4 + .6));
  c.save(); c.globalAlpha = p2; K.arrow(c, 860, 450, 1060, 450, C.amber, 6, p2);
  K.rrect(c, 1100, 300, 620, 300, 24, '#2a3354', C.lime, 4); T(c, 'patungan-v2', 1410, 360, {size: 40, weight: 800, align: 'center', mono: true, color: C.lime});
  T(c, 'main.js (baru, diperbaiki)', 1410, 450, {size: 30, weight: 600, align: 'center', mono: true}); c.restore();
  const p3 = O(S(t, D * .6, D * .6 + .6));
  c.save(); c.globalAlpha = p3; c.strokeStyle = C.coral; c.lineWidth = 8; c.beginPath(); c.moveTo(200, 300); c.lineTo(820, 600); c.moveTo(820, 300); c.lineTo(200, 600); c.stroke();
  T(c, 'nama gudang berganti → gudang lama dibuang', 960, 720, {size: 40, weight: 700, align: 'center', color: C.amber}); c.restore();
};
K.adegan.swTiga = (c, t, D, a) => {
  if (a.bg) K.latar(c, a.bg, 0.8); else K.bg(c);
  K.judul(c, 'Tiga peristiwa di sw.js', t, C.amber);
  const it = [['install', 'penjaga baru datang', 'isi gudang', C.sky], ['activate', 'penjaga mulai bertugas', 'buang gudang lama', C.violet], ['fetch', 'aplikasi meminta berkas', 'dari gudang atau internet?', C.lime]];
  it.forEach(([j, s, d, w], i) => { const x = 160 + i * 547, p = O(S(t, .5 + i * (D * .25), 1.1 + i * (D * .25))); K.panel(c, x, 280, 507, 520, p, w);
    c.save(); c.globalAlpha = p; T(c, j, x + 253, 380, {size: 54, weight: 800, align: 'center', mono: true, color: w}); T(c, s, x + 253, 480, {size: 32, weight: 500, align: 'center', color: C.redup, maxW: 440});
    T(c, d, x + 253, 640, {size: 38, weight: 800, align: 'center', maxW: 440}); c.restore(); });
};
K.adegan.pasang = (c, t, D) => {
  K.bg(c); K.judul(c, 'Pasang ke layar utama', t, C.violet, 'Di HP sungguhan: menu browser → Tambahkan ke layar utama');
  const p = O(S(t, 1.2, 2.2)), off = t > D * .55;
  K.hp(c, 960, 600, 760, (c, x, y, w, h) => {
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#2b3a67'); g.addColorStop(1, '#5a3d6b'); c.fillStyle = g; c.fillRect(x, y, w, h);
    const ik = [['#ff6b6b', 'Foto'], ['#60a5fa', 'Peta'], ['#a3e635', 'Musik'], ['#ffb020', 'Kalender'], ['#f472b6', 'Galeri'], ['#2dd4bf', 'Catatan']];
    ik.forEach(([w2, n], i) => { const ix = x + 40 + (i % 3) * 105, iy = y + 120 + Math.floor(i / 3) * 130; K.rrect(c, ix, iy, 76, 76, 20, w2); T(c, n, ix + 38, iy + 100, {size: 16, weight: 600, align: 'center', color: '#fff'}); });
    c.save(); c.globalAlpha = p; const ix = x + 40, iy = y + 380; const s = K.lerp(.3, 1, K.back(p));
    c.translate(ix + 38, iy + 38); c.scale(s, s); K.rrect(c, -38, -38, 76, 76, 20, '#0a7a50'); T(c, 'Rp', 0, 2, {size: 30, weight: 800, align: 'center', color: '#fff'}); c.restore();
    c.save(); c.globalAlpha = p; T(c, 'Patungan', ix + 38, iy + 100, {size: 16, weight: 700, align: 'center', color: '#fff'}); c.restore();
    if (off) { T(c, '✈', x + w - 40, y + 50, {size: 28, weight: 800, align: 'center', color: '#fff'}); }
  });
  if (off) T(c, 'Mode pesawat: aplikasi tetap terbuka', 960, 1030, {size: 36, weight: 800, align: 'center', color: C.amber, alpha: O(S(t, D * .55, D * .55 + .5))});
};

// --- V10: daftar periksa ---
const CEK = ['Masukan aneh', 'Angka tidak masuk akal', 'Data ke mana?', 'Kode yang tidak dipakai', 'Bisakah aku menjelaskannya?'];
K.adegan.cek = (c, t, D, a) => {
  K.bg(c); K.judul(c, 'Daftar periksa sebelum rilis', t, C.amber);
  const n = a.n ?? -1;
  CEK.forEach((s, i) => { const p = O(S(t, .3 + i * .25, .8 + i * .25)); const aktif = i === n, done = i < n || a.semua;
    c.save(); c.globalAlpha = p * (n >= 0 && !aktif && !done ? .45 : 1); const y = 230 + i * 150;
    K.rrect(c, 300, y, 1320, 120, 24, C.panel, aktif ? C.amber : C.garis, aktif ? 5 : 2);
    K.rrect(c, 340, y + 25, 70, 70, 14, null, done ? C.lime : C.redup, 5);
    if (done) { c.strokeStyle = C.lime; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(355, y + 60); c.lineTo(372, y + 80); c.lineTo(400, y + 40); c.stroke(); }
    T(c, (i + 1) + '. ' + s, 450, y + 62, {size: 44, weight: aktif ? 800 : 600, color: aktif ? C.amber : C.teks}); c.restore(); });
};

// --- V11: alur terbit ---
K.adegan.terbit = (c, t, D) => {
  K.bg(c); K.judul(c, 'Menerbitkan aplikasi', t, C.teal, 'git push → GitHub → Vercel → link → HP');
  const st = [['git push', 'dari laptop', C.sky], ['GitHub', 'menyimpan kode + riwayat', C.violet], ['Vercel', 'build otomatis, gratis', C.teal], ['link', 'patungan-xxx.vercel.app', C.amber], ['HP teman', 'buka dan pasang', C.lime]];
  st.forEach(([j, s, w], i) => { const x = 210 + i * 375, p = O(S(t, .5 + i * (D * .14), 1 + i * (D * .14)));
    c.save(); c.globalAlpha = p; K.rrect(c, x - 165, 420, 330, 220, 28, C.panel, w, 4); T(c, j, x, 500, {size: 42, weight: 800, align: 'center', color: w, mono: i === 0});
    T(c, s, x, 575, {size: 24, weight: 500, align: 'center', color: C.redup, maxW: 290}); c.restore();
    if (i < 4) K.arrow(c, x + 170, 530, x + 205, 530, C.teks, 5, O(S(t, .9 + i * (D * .14), 1.2 + i * (D * .14)))); });
  const p = O(S(t, D * .8, D * .8 + .5)); c.save(); c.globalAlpha = p; T(c, 'Setiap push → versi baru terbit otomatis', 960, 780, {size: 40, weight: 700, align: 'center', color: C.amber}); c.restore();
};

// --- V12: penutup ---
K.adegan.siapa = (c, t, D) => {
  K.duaKolom = K.adegan.duaKolom;
  K.adegan.duaKolom(c, t, D, {judul: 'Siapa mengerjakan apa?', kolom: [
    {judul: 'Dikerjakan AI', warna: C.sky, item: ['Mengetik kode', 'Membuat kerangka', 'Menulis CSS', 'Menulis service worker']},
    {judul: 'Dikerjakan kamu', warna: C.amber, item: ['Memahami masalah', 'Spek dan aturan hitung', 'Kunci jawaban dan tes', 'Membaca, memutuskan']}]});
};
K.adegan.tantangan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Tantangan untukmu', t, C.amber);
  const it = [['Pindai struk', 'tulis dulu di spek cara mengujinya', C.sky], ['Banyak penalang', 'Andi bayar makanan, Bela bayar minuman', C.violet], ['Play Store', 'bungkus dengan Capacitor', C.teal]];
  it.forEach(([j, s, w], i) => { const x = 160 + i * 547, p = O(S(t, .5 + i * (D * .22), 1.1 + i * (D * .22))); K.panel(c, x, 300, 507, 460, p, w);
    c.save(); c.globalAlpha = p; T(c, String(i + 1), x + 253, 420, {size: 90, weight: 800, align: 'center', color: w}); T(c, j, x + 253, 540, {size: 44, weight: 800, align: 'center'});
    T(c, s, x + 253, 620, {size: 30, weight: 500, align: 'center', color: C.redup, maxW: 430}); c.restore(); });
};
K.adegan.seri = (c, t, D) => {
  K.bg(c); const p = O(S(t, .3, 1));
  c.save(); c.globalAlpha = p; K.rrect(c, 160, 260, 480, 56, 28, C.teal); T(c, 'TONTON JUGA DI KANAL INI', 400, 288, {size: 22, weight: 800, align: 'center', color: '#141a2c'});
  T(c, 'Membangun Aplikasi dari Nol', 160, 410, {size: 84, weight: 800}); T(c, 'Sistem antrean dan reservasi, ditulis dengan tangan sendiri, baris demi baris.', 160, 510, {size: 40, weight: 500, color: C.redup, maxW: 1500}); c.restore();
  const q = O(S(t, 1.5, 2.2));
  ['database', 'API', 'server', 'deploy'].forEach((s, i) => { c.save(); c.globalAlpha = q * O(S(t, 1.5 + i * .3, 2 + i * .3)); K.rrect(c, 160 + i * 300, 640, 260, 90, 45, C.panel, C.teal, 3); T(c, s, 290 + i * 300, 685, {size: 34, weight: 700, align: 'center'}); c.restore(); });
  const r = O(S(t, D * .6, D * .6 + .6)); c.save(); c.globalAlpha = r; T(c, 'Semakin paham kodenya, semakin cepat kamu menangkap kesalahan AI.', 160, 860, {size: 40, weight: 700, color: C.amber, maxW: 1600}); c.restore();
};
// catatan bergaya label di atas latar beku dengan sorotan kotak
K.adegan.sorot = (c, t, D, a) => {
  K.sorotKotak(c, a.bg, a.r, O(S(t, .2, .8)));
  if (a.teks) { const p = O(S(t, .5, 1)); c.save(); c.globalAlpha = p; const y = a.atas ? 70 : 940;
    const w = K.lebar(c, a.teks, 40, 700) + 80; K.rrect(c, 960 - w / 2, y - 45, w, 90, 24, 'rgba(20,24,38,.94)'); K.rrect(c, 960 - w / 2, y - 45, 14, 90, 7, C.amber);
    T(c, a.teks, 960, y, {size: 40, weight: 700, align: 'center'}); c.restore(); }
};
K.adegan.teks = (c, t, D, a) => { // kartu teks sederhana
  K.bg(c); K.judul(c, a.judul, t, a.warna || C.amber, a.sub);
  if (a.isi) a.isi.forEach((s, i) => { const p = O(S(t, .5 + i * .5, 1 + i * .5)); c.save(); c.globalAlpha = p; T(c, s, 160, 330 + i * 110, {size: 46, weight: 600, maxW: 1600}); c.restore(); });
};
})();

// --- kartu bab (jeda lega antarbab) ---
(() => {
const C = K.C, T = K.text, S = K.seg, O = K.out;
const BAB = ['Kait', 'Vibe coding yang benar', 'Spek satu halaman', 'Siapkan proyek', 'Prompt pertama', 'Logika inti dan tes', 'Rasa aplikasi HP', 'Simpan offline', 'Kirim ke WhatsApp', 'Jadikan aplikasi', 'Cek kerjaan AI', 'Terbitkan', 'Penutup'];
K.adegan.bab = (c, t, D, a) => {
  K.bg(c); const n = a.n, p = O(S(t, .15, .8)), q = O(S(t, .5, 1.2)), out = K.clamp((D - t) / .45);
  c.save(); c.globalAlpha = out;
  c.save(); c.globalAlpha *= p; K.rrect(c, 160, 330, 210, 60, 30, C.amber); T(c, 'BAB ' + n, 265, 361, {size: 28, weight: 800, align: 'center', color: '#141a2c'}); c.restore();
  c.save(); c.globalAlpha *= q; T(c, BAB[n], 160 + 30 * (1 - q), 470, {size: 96, weight: 800}); if (a.sub) T(c, a.sub, 160, 570, {size: 40, weight: 500, color: C.redup}); c.restore();
  // jalur bab
  const x0 = 160, w = 1600, y = 760;
  c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(x0, y - 3, w, 6);
  for (let i = 0; i < BAB.length; i++) { const x = x0 + w * i / (BAB.length - 1), on = i === n, done = i < n;
    c.save(); c.globalAlpha *= O(S(t, .2 + i * .04, .6 + i * .04)); c.beginPath(); c.arc(x, y, on ? 18 : 10, 0, Math.PI * 2);
    c.fillStyle = on ? C.amber : done ? C.teal : '#3a4566'; c.fill(); c.restore(); }
  c.restore();
};
})();
