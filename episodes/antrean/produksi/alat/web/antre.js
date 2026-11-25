// Pustaka adegan seri "Membangun Sistem Antrean dari Nol" (dimuat setelah kanvas.js)
(() => {
const C = K.C;
// --- pewarnaan sintaks SQL, JS, Markdown ---
const KW = new Set(('select from where and or not join on left inner group by order having limit as insert into values update set delete ' +
  'create table drop if exists primary key references unique check default null serial integer text char date timestamptz timestamp ' +
  'count min max avg sum distinct case when then else end begin commit rollback for skip locked returning in is ' +
  'const let var function async await return require new try catch finally throw class import export of true false').split(' '));
K.token = (line) => {
  const out = []; const re = /(--.*$|\/\/.*$|"[^"]*"?|'[^']*'?|`[^`]*`?|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|.)/g; let m;
  while ((m = re.exec(line))) { const s = m[0]; let col = '#e6e9f2';
    if (/^(--|\/\/)/.test(s)) col = '#7c8aa8'; else if (/^["'`]/.test(s)) col = '#f9a07a'; else if (/^\d/.test(s)) col = '#b5e48c';
    else if (KW.has(s.toLowerCase()) && /^[A-Za-z]/.test(s)) col = '#c792ea'; else if (/^[=<>+\-*/%]+$/.test(s)) col = '#ffcb6b';
    out.push([s, col]); }
  return out;
};
// --- tokoh dan benda datar ---
K.orang = (c, x, y, s, warna = C.sky, o = {}) => { // (x,y) = titik kaki tengah, s = tinggi
  c.save(); c.globalAlpha *= (o.alpha ?? 1);
  K.rrect(c, x - s * .2, y - s * .62, s * .4, s * .62, s * .14, warna);
  c.fillStyle = o.kulit || '#f2c39b'; c.beginPath(); c.arc(x, y - s * .78, s * .16, 0, Math.PI * 2); c.fill();
  if (o.topi) { c.fillStyle = o.topi; c.beginPath(); c.arc(x, y - s * .8, s * .165, Math.PI, 0); c.fill(); c.fillRect(x - s * .02, y - s * .82, s * .22, s * .04); }
  if (o.kumis) { c.fillStyle = '#3b2a20'; c.fillRect(x - s * .07, y - s * .74, s * .14, s * .025); }
  c.fillStyle = '#1e293b'; c.beginPath(); c.arc(x - s * .055, y - s * .8, s * .018, 0, 7); c.arc(x + s * .055, y - s * .8, s * .018, 0, 7); c.fill();
  if (o.ekspresi === 'kesal') { c.strokeStyle = '#1e293b'; c.lineWidth = s * .015; c.beginPath(); c.arc(x, y - s * .68, s * .05, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  else { c.strokeStyle = '#1e293b'; c.lineWidth = s * .015; c.beginPath(); c.arc(x, y - s * .74, s * .05, Math.PI * .15, Math.PI * .85); c.stroke(); }
  c.restore();
};
K.motor = (c, x, y, s, warna = C.coral) => { // (x,y) = tanah tengah
  c.save(); c.strokeStyle = '#cbd5e1'; c.lineWidth = s * .06;
  for (const dx of [-.32, .32]) { c.beginPath(); c.arc(x + dx * s, y - s * .16, s * .15, 0, 7); c.stroke(); }
  K.rrect(c, x - s * .26, y - s * .42, s * .5, s * .18, s * .08, warna);
  K.rrect(c, x - s * .1, y - s * .5, s * .26, s * .08, s * .04, '#334155');
  c.strokeStyle = warna; c.beginPath(); c.moveTo(x + s * .24, y - s * .36); c.lineTo(x + s * .34, y - s * .58); c.stroke(); c.restore();
};
K.hp = (c, x, y, w, h, isi) => { // ponsel; isi(c, x, y, w, h) menggambar layar
  K.rrect(c, x, y, w, h, w * .12, '#0b1020', '#475569', 4); c.save(); c.beginPath(); c.roundRect(x + 10, y + 26, w - 20, h - 46, w * .07); c.clip();
  c.fillStyle = '#f1f5f9'; c.fillRect(x + 10, y + 26, w - 20, h - 46); if (isi) isi(c, x + 10, y + 26, w - 20, h - 46); c.restore();
};
K.tiketKertas = (c, x, y, label, o = {}) => { // x,y = tengah
  const w = o.w || 220, h = o.h || 130; c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha *= (o.alpha ?? 1);
  K.rrect(c, -w / 2, -h / 2, w, h, 10, '#fff7e6', o.garis || '#e2c08d', 3);
  K.text(c, o.atas || 'NOMOR ANTREAN', 0, -h * .28, {size: h * .12, weight: 800, align: 'center', color: '#8a6d3b'});
  K.text(c, label, 0, h * .1, {size: h * .34, weight: 900, align: 'center', color: '#1e293b'});
  if (o.bawah) K.text(c, o.bawah, 0, h * .37, {size: h * .1, weight: 600, align: 'center', color: '#8a6d3b'});
  c.restore();
};
// --- peta arsitektur (dipakai di kartu bab dan peta video) ---
K.LAPIS = {kebutuhan: 0, database: 3, server: 2, frontend: 1, deploy: 4};
K.peta = (c, x, y, s, aktif, p = 1) => { // s = skala (1 = lebar ~900)
  c.save(); c.globalAlpha *= K.out(p); c.translate(x, y); c.scale(s, s);
  const kotak = [['Kebutuhan', 'pemakai', C.pink, 0, 150], ['Browser', 'HP · TV · petugas', C.sky, 245, 150], ['Server', 'Node.js + Express', C.violet, 490, 150], ['Database', 'PostgreSQL', C.teal, 735, 150]];
  kotak.forEach(([n, sub, w, kx, ky], i) => {
    const on = aktif === undefined || K.LAPIS[aktif] === i || (aktif === 'deploy');
    c.save(); c.globalAlpha *= on ? 1 : .32;
    K.rrect(c, kx, ky - 60, 215, 120, 20, on ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.02)', w, on ? 5 : 3);
    K.text(c, n, kx + 107, ky - 12, {size: 32, weight: 800, align: 'center'}); K.text(c, sub, kx + 107, ky + 28, {size: 20, weight: 600, align: 'center', color: C.redup});
    c.restore();
    if (i < 3) K.arrow(c, kx + 218, ky, kx + 242, ky, '#64748b', 4, 1, 12);
  });
  if (aktif === 'deploy') { K.rrect(c, 215, 40, 690, 240, 26, null, C.amber, 4); K.text(c, 'Server online', 560, 20, {size: 26, weight: 800, align: 'center', color: C.amber}); }
  c.restore();
};
K.kartuBab = (c, t, D, a) => {
  K.bg(c); const p1 = K.out(K.seg(t, .1, .7)), p2 = K.out(K.seg(t, .4, 1.1)), p3 = K.out(K.seg(t, .9, 1.7));
  c.save(); c.globalAlpha = p1; K.rrect(c, 160, 250, 210, 64, 32, C.amber); K.text(c, a.bab, 265, 283, {size: 30, weight: 900, align: 'center', color: '#141a2c'}); c.restore();
  c.save(); c.globalAlpha = p2; let y = 400 + 20 * (1 - p2);
  for (const b of a.judul.split('\n')) { K.text(c, b, 160, y, {size: 84, weight: 900}); y += 104; } c.restore();
  if (a.sub) K.text(c, a.sub, 160, y + 6, {size: 36, weight: 500, color: '#c9d3ee', alpha: p3});
  K.peta(c, 1010, 760, .92, a.lapis, p3);
  if (a.catatan) { const q = K.out(K.seg(t, 1.6, 2.2)); c.save(); c.globalAlpha = q; K.rrect(c, 160, 690, 700, 110, 18, 'rgba(45,212,191,.1)', C.teal, 3);
    K.text(c, a.catatan[0], 190, 726, {size: 26, weight: 800, color: C.teal}); K.text(c, a.catatan[1], 190, 768, {size: 26, weight: 600}); c.restore(); }
};
// --- kartu segmen "Cek kerjaan AI" + hitungan "Pikirkan dulu" ---
K.labelAI = (c, x, y, p = 1) => { c.save(); c.globalAlpha *= p; K.rrect(c, x, y, 470, 50, 25, 'rgba(244,114,182,.16)', C.pink, 2);
  K.text(c, 'Contoh kode bergaya hasil AI', x + 235, y + 26, {size: 24, weight: 800, align: 'center', color: C.pink}); c.restore(); };
K.pikirkan = (c, t, D, x = 1660, y = 900) => { // hitungan mundur 5 detik di akhir adegan
  const t0 = Math.max(.5, D - 5.2); if (t < t0) return; const q = t - t0, sisa = Math.ceil(K.clamp(5 - q, 0, 5)); const p = K.out(K.seg(q, 0, .4));
  c.save(); c.globalAlpha = p; K.rrect(c, x - 230, y - 200, 400, 300, 30, 'rgba(15,20,40,.92)', C.amber, 4);
  K.text(c, 'Pikirkan dulu', x - 30, y - 150, {size: 34, weight: 800, align: 'center', color: C.amber});
  if (q < 5) { const f = q % 1; c.strokeStyle = C.amber; c.lineWidth = 10; c.beginPath(); c.arc(x - 30, y - 10, 70, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - f)); c.stroke();
    K.text(c, String(sisa), x - 30, y - 6, {size: 84, weight: 900, align: 'center'}); }
  c.restore();
};
K.cekAIjudul = (c, t, warna = C.pink) => { const p = K.out(K.seg(t, 0, .5)); c.save(); c.globalAlpha = p;
  K.rrect(c, 80, 60, 380, 64, 32, warna); c.fillStyle = '#141a2c'; c.beginPath(); c.arc(130, 92, 15, 0, 7); c.lineWidth = 5; c.strokeStyle = '#141a2c'; c.stroke(); c.beginPath(); c.moveTo(141, 103); c.lineTo(154, 116); c.stroke();
  K.text(c, 'Cek kerjaan AI', 290, 93, {size: 32, weight: 900, align: 'center', color: '#141a2c'}); c.restore(); };
// --- ERD ---
K.tabelERD = (c, x, y, nama, kolom, o = {}) => { // kolom: [[nama, 'pk'|'fk'|'', tipe?]]
  const w = o.w || 330, rh = o.rh || 44, warna = o.warna || C.teal, p = o.p ?? 1; if (p <= 0) return {x, y, w, h: 0, baris: () => 0};
  c.save(); c.globalAlpha *= K.out(p); const dy = (1 - K.out(p)) * 24; y += dy;
  const n = o.n ?? kolom.length, h = 58 + n * rh + 12;
  c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 20; K.rrect(c, x, y, w, h, 16, '#18213c', o.sorot ? C.amber : warna, o.sorot ? 5 : 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 58, 16, warna); c.fillStyle = warna; c.fillRect(x, y + 40, w, 18);
  K.text(c, nama, x + 20, y + 30, {size: 28, weight: 800, mono: true, color: '#0e1424'});
  kolom.slice(0, n).forEach(([k, jenis, tipe], i) => { const yy = y + 58 + 6 + i * rh + rh / 2;
    if (o.sorotKolom && o.sorotKolom.includes(k)) K.rrect(c, x + 6, yy - rh / 2 + 3, w - 12, rh - 6, 8, 'rgba(255,176,32,.22)', C.amber, 2);
    if (o.coretKolom && o.coretKolom.includes(k)) K.rrect(c, x + 6, yy - rh / 2 + 3, w - 12, rh - 6, 8, 'rgba(255,107,107,.18)', C.coral, 2);
    if (jenis === 'pk') { K.text(c, 'PK', x + 22, yy, {size: 18, weight: 900, color: C.amber}); }
    if (jenis === 'fk') { K.text(c, 'FK', x + 22, yy, {size: 18, weight: 900, color: C.sky}); }
    K.text(c, k, x + 64, yy, {size: 24, weight: 600, mono: true, color: C.teks});
    if (tipe && o.tipe !== false) K.text(c, tipe, x + w - 18, yy, {size: 20, weight: 500, mono: true, color: C.redup, align: 'right'});
  });
  c.restore(); return {x, y, w, h, baris: (k) => y + 58 + 6 + kolom.findIndex(z => z[0] === k) * rh + rh / 2};
};
K.kakiGagak = (c, x1, y1, x2, y2, p = 1, warna = '#cbd5e1', banyakDi = 2) => { // garis satu-ke-banyak; banyakDi: 1 atau 2 (ujung yang "banyak")
  if (p <= 0) return; c.save(); c.strokeStyle = warna; c.lineWidth = 4; c.lineCap = 'round';
  const xm = (x1 + x2) / 2; const pts = [[x1, y1], [xm, y1], [xm, y2], [x2, y2]];
  K.path(c, pts, warna, 4, p, false);
  if (p >= 1) { const [bx, by, d] = banyakDi === 2 ? [x2, y2, Math.sign(x2 - xm) || 1] : [x1, y1, Math.sign(x1 - xm) || 1];
    c.beginPath(); c.moveTo(bx - d * 22, by); c.lineTo(bx, by - 14); c.moveTo(bx - d * 22, by); c.lineTo(bx, by + 14); c.moveTo(bx - d * 22, by); c.lineTo(bx, by); c.stroke();
    const [sx, sy, e] = banyakDi === 2 ? [x1, y1, Math.sign(x1 - xm) || -1] : [x2, y2, Math.sign(x2 - xm) || -1];
    c.beginPath(); c.moveTo(sx - e * 14, sy - 14); c.lineTo(sx - e * 14, sy + 14); c.stroke(); }
  c.restore();
};
// kartu teks dengan judul kecil
K.kartu = (c, x, y, w, h, judul, isi, o = {}) => { const p = o.p ?? 1; if (p <= 0) return; c.save(); c.globalAlpha *= K.out(p); const dy = (1 - K.out(p)) * 26;
  K.panel(c, x, y + dy, w, h, 1, o.warna || C.amber);
  if (judul) K.text(c, judul, x + 40, y + dy + 48, {size: o.sj || 26, weight: 800, color: o.warna || C.amber});
  if (isi) K.text(c, isi, x + 40, y + dy + (judul ? 100 : h / 2), {size: o.size || 34, weight: 600, maxW: w - 80, lh: 1.35});
  c.restore(); };
K.coret = (c, x1, y1, x2, y2, p, warna = C.coral) => { if (p <= 0) return; c.save(); c.strokeStyle = warna; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(K.lerp(x1, x2, K.out(p)), K.lerp(y1, y2, K.out(p))); c.stroke(); c.restore(); };
K.centang = (c, x, y, s, p, warna = C.lime) => { if (p <= 0) return; K.path(c, [[x - s * .4, y], [x - s * .1, y + s * .3], [x + s * .45, y - s * .35]], warna, s * .14, K.out(p), false); };
// catatan: latar beku rekaman + kartu berisi beberapa baris (a.judul, a.baris[], a.warna)
K.adegan.catatan = (c, t, D, a) => {
  if (a.bg) K.latar(c, a.bg, .8); else K.bg(c);
  const w = a.warna || C.amber, n = a.baris.length, h = 130 + n * 78, y0 = (1080 - h) / 2, p = K.out(K.seg(t, .1, .6));
  c.save(); c.globalAlpha = p; K.rrect(c, 260, y0 + (1 - p) * 30, 1400, h, 28, 'rgba(14,20,36,.94)', w, 4);
  K.text(c, a.judul, 320, y0 + 70, {size: 40, weight: 900, color: w}); c.restore();
  a.baris.forEach((b, i) => { const q = K.out(K.seg(t, .5 + i * (a.jeda || .8), 1 + i * (a.jeda || .8))); if (q <= 0) return;
    K.text(c, b, 320, y0 + 150 + i * 78, {size: 34, weight: 600, mono: !!a.mono, maxW: 1280, alpha: q}); });
};
// kartu judul video
K.adegan.judulVideo = (c, t, D, a) => {
  if (a.bg) K.latar(c, a.bg, 0.9); else K.bg(c);
  const p1 = K.out(K.seg(t, .1, .7)), p2 = K.out(K.seg(t, .5, 1.2)), p3 = K.out(K.seg(t, 1.1, 1.8));
  c.save(); c.globalAlpha = p1; K.rrect(c, 140, 260, 560, 56, 28, C.amber); K.text(c, 'MEMBANGUN APLIKASI DARI NOL', 420, 289, {size: 24, weight: 900, align: 'center', color: '#141a2c'}); c.restore();
  c.save(); c.globalAlpha = p2; let y = 390 + 20 * (1 - p2); for (const b of a.judul.split('\n')) { K.text(c, b, 140, y, {size: 92, weight: 900}); y += 112; } c.restore();
  if (a.hook) { c.save(); c.globalAlpha = p3; K.text(c, a.hook, 140, y + 50, {size: 38, weight: 500, color: '#c9d3ee', maxW: 1560, lh: 1.35}); c.restore(); }
};
K.adegan.kartuBab = K.kartuBab;
K.adegan.tantangan = (c, t, D, a) => {
  K.bg(c); const p = K.out(K.seg(t, 0, .6)), p2 = K.out(K.seg(t, D * .55, D * .55 + .6));
  K.judul(c, 'Tantangan untukmu', t, C.amber);
  K.panel(c, 140, 230, 1640, 340, p, C.amber);
  c.save(); c.globalAlpha = p; K.text(c, a.tantangan, 200, 310, {size: 42, weight: 600, maxW: 1520, lh: 1.4}); c.restore();
  if (a.berikut) { c.save(); c.globalAlpha = p2; K.text(c, 'Bab berikutnya', 140, 690, {size: 30, weight: 700, color: C.redup});
    K.text(c, a.berikut, 140, 760, {size: 58, weight: 900, maxW: 1640}); c.restore(); }
};
K.serverKotak = (c, x, y, s = 1, label = 'Server') => { c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 3; i++) { K.rrect(c, -110, -150 + i * 100, 220, 86, 12, '#1e2a4a', C.violet, 4); c.fillStyle = C.lime; c.beginPath(); c.arc(-80, -107 + i * 100, 9, 0, 7); c.fill();
    for (let k = 0; k < 4; k++) c.fillRect(-40 + k * 30, -112 + i * 100, 18, 8); }
  K.text(c, label, 0, 180, {size: 34, weight: 800, align: 'center'}); c.restore(); };
})();
