// Pustaka adegan SiBaca (dimuat setelah kanvas.js, antre.js, lapor.js)
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// ---------- pewarnaan sintaks: JavaScript, JSX, SQL ----------
const KWJ = new Set(('import from export default const let function async await return if else for of new try catch finally throw class extends true false null undefined ' +
  'select where and or join left on group by order limit insert into values update set delete create table like count show having union drop index unique primary key foreign references not exists explain').split(' '));
K.token = (line) => { const out = []; const re = /(--.*$|\/\/.*$|#.*$|"[^"]*"?|'[^']*'?|`[^`]*`?|<\/?[A-Za-z][A-Za-z0-9.]*|\/?>|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][A-Za-z0-9_$]*\b|\s+|.)/g; let m;
  while ((m = re.exec(line))) { const s = m[0]; let col = '#e6e9f2';
    if (/^(--|\/\/|#)/.test(s)) col = '#7c8aa8'; else if (/^["'`]/.test(s)) col = '#f9a07a'; else if (/^\d/.test(s)) col = '#b5e48c'; else if (/^<\/?[A-Za-z]/.test(s) || /^\/?>$/.test(s)) col = '#7fdbff';
    else if (KWJ.has(s.toLowerCase()) && /^[A-Za-z]/.test(s)) col = '#c792ea'; else if (/^[=<>+\-*/%!&|?]+$/.test(s)) col = '#ffcb6b';
    out.push([s, col]); } return out; };
// ---------- peta arsitektur SiBaca ----------
K.LAPIS = {kebutuhan: 0, frontend: 1, server: 2, database: 3};
K.peta = (c, x, y, s, aktif, p = 1) => { c.save(); c.globalAlpha *= K.out(p); c.translate(x, y); c.scale(s, s);
  const kotak = [['Kebutuhan', 'Bu Ratih · siswa', C.pink, 0, 150], ['React', 'tampilan di HP', C.sky, 245, 150], ['Express', 'server di laptop', C.violet, 490, 150], ['MySQL', 'database', C.teal, 735, 150]];
  const semua = aktif === undefined || aktif === 'semua' || aktif === 'deploy', daftar = Array.isArray(aktif) ? aktif.map(a => K.LAPIS[a]) : [K.LAPIS[aktif]];
  kotak.forEach(([n, sub, w, kx, ky], i) => { const on = semua || daftar.includes(i);
    c.save(); c.globalAlpha *= on ? 1 : .32; K.rrect(c, kx, ky - 60, 215, 120, 20, on ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.02)', w, on ? 5 : 3);
    K.text(c, n, kx + 107, ky - 12, {size: 32, weight: 800, align: 'center'}); K.text(c, sub, kx + 107, ky + 28, {size: 20, weight: 600, align: 'center', color: C.redup}); c.restore();
    if (i < 3) K.arrow(c, kx + 218, ky, kx + 242, ky, '#64748b', 4, 1, 12); });
  if (aktif === 'deploy') { K.rrect(c, 215, 40, 760, 240, 26, null, C.amber, 4); K.text(c, 'Satu laptop, tanpa internet', 595, 20, {size: 26, weight: 800, align: 'center', color: C.amber}); }
  c.restore(); };
// ---------- tokoh ----------
K.TOKOH = {ratih: ['Bu Ratih', 'petugas perpustakaan', '#0f766e', {}], nadia: ['Nadia', 'kelas X-2', '#db2777', {}], raka: ['Raka', 'kelas XI RPL 1', '#2563eb', {}], bima: ['Bima', 'kelas X-4', '#d97706', {}]};
K.tokoh = (c, siapa, x, y, s, p = 1, o = {}) => { if (p <= 0) return; const [n, k, w, op] = K.TOKOH[siapa]; c.save(); c.globalAlpha *= p; K.orang(c, x, y, s, w, Object.assign({}, op, o));
  if (siapa === 'ratih') { c.fillStyle = '#134e4a'; c.beginPath(); c.arc(x, y - s * .8, s * .185, Math.PI * .95, Math.PI * 2.05); c.fill(); c.fillRect(x - s * .185, y - s * .82, s * .06, s * .26); c.fillRect(x + s * .125, y - s * .82, s * .06, s * .26); }
  else { c.fillStyle = siapa === 'nadia' ? '#3b2a20' : '#1f2937'; c.beginPath(); c.arc(x, y - s * .82, s * .165, Math.PI, 0); c.fill(); if (siapa === 'nadia') { c.fillRect(x - s * .165, y - s * .82, s * .05, s * .2); c.fillRect(x + s * .115, y - s * .82, s * .05, s * .2); } }
  if (!o.tanpaNama) { K.text(c, n, x, y + s * .11, {size: s * .1, weight: 900, align: 'center'}); K.text(c, k, x, y + s * .21, {size: s * .065, weight: 600, align: 'center', color: C.redup}); } c.restore(); };
// ---------- ikon WiFi; mati = dicoret (tanpa internet) ----------
K.wifi = (c, x, y, s, warna = '#fff', mati = false) => { c.save(); c.strokeStyle = warna; c.fillStyle = warna; c.lineCap = 'round'; c.lineWidth = s * .11;
  for (let i = 1; i <= 3; i++) { c.beginPath(); c.arc(x, y + s * .38, s * .27 * i, -Math.PI * .75, -Math.PI * .25); c.stroke(); }
  c.beginPath(); c.arc(x, y + s * .38, s * .08, 0, 7); c.fill();
  if (mati) { c.strokeStyle = C.coral; c.lineWidth = s * .13; c.beginPath(); c.moveTo(x - s * .55, y - s * .5); c.lineTo(x + s * .55, y + s * .5); c.stroke(); } c.restore(); };
K.pilTanpaInternet = (c, x, y, p = 1, s = 1) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; c.translate(x, y); c.scale(s, s); K.rrect(c, 0, 0, 430, 84, 42, '#0d1222', C.coral, 4); K.wifi(c, 56, 34, 46, '#e2e8f0', true);
  K.text(c, 'TANPA INTERNET', 110, 44, {size: 34, weight: 900, color: '#fff'}); c.restore(); };
// ---------- HP dengan bilah status dan bilah alamat; isi = gambar tangkapan layar ----------
// o: {alamat, img, img2, campur (0..1), gulir (px gambar), ketuk: [x, y, p] (pecahan layar), internet: false}
K.hpPenuh = (c, x, y, w, o = {}) => { const h = w * 2.06, r = w * .13; c.save(); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 50; c.shadowOffsetY = 18; K.rrect(c, x, y, w, h, r, '#0b1020', '#64748b', 5); c.restore();
  const lx = x + 12, ly = y + 12, lw = w - 24, lh = h - 24; c.save(); c.beginPath(); c.roundRect(lx, ly, lw, lh, r * .82); c.clip();
  c.fillStyle = '#0f172a'; c.fillRect(lx, ly, lw, lh); const sb = lw * .085, ab = lw * .125;
  K.text(c, o.jam || '09.41', lx + lw * .07, ly + sb * .58, {size: sb * .46, weight: 700, color: '#e2e8f0'});
  K.wifi(c, lx + lw * .8, ly + sb * .36, sb * .5, '#e2e8f0', o.internet === false); K.rrect(c, lx + lw * .87, ly + sb * .32, sb * .62, sb * .34, 4, null, '#e2e8f0', 2); c.fillStyle = '#e2e8f0'; c.fillRect(lx + lw * .87 + 3, ly + sb * .32 + 3, sb * .4, sb * .34 - 6);
  K.rrect(c, lx + lw * .04, ly + sb + ab * .14, lw * .92, ab * .72, ab * .36, '#1e293b'); K.text(c, o.alamat || '192.168.1.10:3000', lx + lw * .5, ly + sb + ab * .52, {size: ab * .34, weight: 700, align: 'center', color: '#e2e8f0', mono: true});
  const iy = ly + sb + ab, ih = lh - sb - ab; c.beginPath(); c.rect(lx, iy, lw, ih); c.clip(); c.fillStyle = '#f1f5f4'; c.fillRect(lx, iy, lw, ih);
  const gbr = (src, al) => { const im = K.IMG[src]; if (!im || al <= 0) return; const sk = lw / im.width, maks = Math.max(0, im.height * sk - ih); c.save(); c.globalAlpha *= al; c.drawImage(im, lx, iy - Math.min(maks, (o.gulir || 0)), lw, im.height * sk); c.restore(); };
  gbr(o.img, 1); if (o.img2) gbr(o.img2, o.campur ?? 0);
  if (o.ketuk && o.ketuk[2] > 0 && o.ketuk[2] < 1) { const q = o.ketuk[2], kx = lx + lw * o.ketuk[0], ky = iy + ih * o.ketuk[1]; c.save(); c.globalAlpha = 1 - q; c.strokeStyle = C.amber; c.lineWidth = 7; c.beginPath(); c.arc(kx, ky, 18 + q * 46, 0, 7); c.stroke(); c.globalAlpha = (1 - q) * .5; c.fillStyle = C.amber; c.beginPath(); c.arc(kx, ky, 20, 0, 7); c.fill(); c.restore(); }
  c.restore(); return {lx, ly: iy, lw, lh: ih}; };
// Langkah-langkah di HP: a = {judul, sub, x, y, w, internet, langkah: [{k, d, img, alamat, ketuk: [x, y]}], item: [{k, d, judul, isi, warna, besar}], pil: true}
// Tiap langkah mulai pada kalimat k (+d): ketukan tampil, lalu gambar berganti.
K.hpLangkahGambar = (c, t, a, x, y, w) => { const L = a.langkah; let i = 0; L.forEach((l, j) => { if (t >= kt(a, l.k, l.d || 0)) i = j; });
  const cur = L[i], nx = L[i + 1], o = {alamat: cur.alamat || a.alamat, img: cur.img, internet: a.internet, jam: a.jam};
  if (nx) { const tn = kt(a, nx.k, nx.d || 0); if (nx.ketuk && t > tn - .9) o.ketuk = [nx.ketuk[0], nx.ketuk[1], S(t, tn - .9, tn - .2)]; }
  const t0 = kt(a, cur.k, cur.d || 0); if (i > 0 && t < t0 + .35) { o.img = L[i - 1].img; o.img2 = cur.img; o.campur = S(t, t0, t0 + .35); }
  if (cur.gulir) o.gulir = cur.gulir * K.ease(S(t, t0 + .6, t0 + .6 + (cur.gulirDur || 3)));
  return K.hpPenuh(c, x, y, w, o); };
AD.hpLangkah = (c, t, D, a) => { if (a.bg) K.latar(c, a.bg, .88); else K.bg(c); if (a.judul) K.judul(c, a.judul, a.langsung ? 9 : t, a.warna || C.sky, a.sub);
  const w = a.w || 440, x = a.x ?? 180, y = a.y ?? (a.judul ? 150 : 86);
  K.hpLangkahGambar(c, t, a, x, y, w);
  if (a.pil) K.pilTanpaInternet(c, x + w / 2 - 172, y + w * 2.06 - 110, a.langsung ? 1 : muncul(t, .3), .8);
  const ix = a.ix ?? (x + w + 110), iw = 1800 - ix;
  (a.item || []).forEach((it, i) => { const p = it.k === undefined ? 1 : muncul(t, kt(a, it.k, it.d || 0)); if (p <= 0) return; const hilang = it.sampai !== undefined ? 1 - muncul(t, kt(a, it.sampai) - .3, .3) : 1; if (hilang <= 0) return;
    c.save(); c.globalAlpha = p * hilang; const yy = (it.y ?? (240 + i * 200)) + (1 - p) * 22, wr = it.warna || C.amber;
    if (it.besar) { K.text(c, it.besar, ix, yy, {size: it.size || 104, weight: 900, color: wr, maxW: iw, lh: 1.05}); }
    else { K.rrect(c, ix, yy, iw, it.h || 160, 22, 'rgba(255,255,255,.05)', wr, 4); K.text(c, it.judul, ix + 36, yy + 54, {size: 34, weight: 900, color: wr, mono: !!it.mono, maxW: iw - 70}); if (it.isi) K.text(c, it.isi, ix + 36, yy + 108, {size: 27, weight: 600, maxW: iw - 70, lh: 1.25}); }
    c.restore(); });
  if (a.repo) K.chipRepo(c, muncul(t, kt(a, a.repo.k)), {ket: a.repo.ket, y: a.repo.y, x: a.repo.x, w: a.repo.w}); };
// Alamat GitHub di atas rekaman beku: a = {bg, ket, k}
AD.dariGitHub = (c, t, D, a) => { K.latar(c, a.bg, a.redup ?? .45); K.chipRepo(c, muncul(t, a.k === undefined ? .2 : kt(a, a.k)), {ket: a.ket || 'Berkasnya ada di GitHub', y: a.y ?? 860}); };
// Obrolan dengan pemakai: a = {judul, sub, tokoh, balon: [{k, teks, sampai}], catatan: [{k, d, teks, warna}], judulCatatan}
AD.obrolan = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul, t, a.warna || C.pink, a.sub);
  K.tokoh(c, a.tokoh || 'ratih', 330, 880, 430, muncul(t, .3));
  let akt = -1; a.balon.forEach((b, i) => { if (t >= kt(a, b.k, b.d || 0)) akt = i; });
  if (akt >= 0) { const b = a.balon[akt], p = muncul(t, kt(a, b.k, b.d || 0), .35); K.balon(c, 150, 230, 620, b.teks, p, {size: 30}); }
  const cx = 880, cw = 900; c.save(); c.globalAlpha = muncul(t, .6); K.rrect(c, cx, 220, cw, 760, 24, '#fef9e7', '#eab308', 4); K.text(c, a.judulCatatan || 'Catatan kebutuhan', cx + 44, 280, {size: 34, weight: 900, color: '#854d0e'}); c.fillStyle = '#eab308'; c.fillRect(cx + 44, 312, cw - 88, 3); c.restore();
  const n = a.catatan.length, jarak = Math.min(118, 640 / n);
  a.catatan.forEach((m, i) => { const p = muncul(t, kt(a, m.k, m.d || 0)); if (p <= 0) return; c.save(); c.globalAlpha = p; const yy = 372 + i * jarak + (1 - p) * 16;
    c.fillStyle = m.warna || '#0f766e'; c.beginPath(); c.arc(cx + 62, yy, 12, 0, 7); c.fill(); K.text(c, m.teks, cx + 96, yy + 1, {size: m.size || 29, weight: 700, color: '#1e293b', maxW: cw - 150, lh: 1.22}); c.restore(); }); };
})();
// Penutup bab: a = {selesai, berikut, tanya}
K.adegan.lanjut = (c, t, D, a) => { const C = K.C, muncul = K.muncul; K.bg(c); const p = muncul(t, .2), p2 = muncul(t, a.tanya ? 3.2 : 1.0);
  c.save(); c.globalAlpha = p; K.rrect(c, 140, 200, 1640, 220, 26, 'rgba(163,230,53,.08)', C.lime, 4); K.centang(c, 230, 310, 70, p, C.lime); K.text(c, a.selesai, 320, 310, {size: 42, weight: 800, maxW: 1400, lh: 1.25}); c.restore();
  if (a.tanya) { const q = muncul(t, 1.2); c.save(); c.globalAlpha = q; K.rrect(c, 140, 470, 1640, 200, 26, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, a.tanya, 190, 570, {size: 44, weight: 900, color: C.amber, maxW: 1540, lh: 1.25}); c.restore(); }
  c.save(); c.globalAlpha = p2; K.text(c, 'Bab berikutnya', 140, a.tanya ? 770 : 620, {size: 30, weight: 700, color: C.redup}); K.text(c, a.berikut, 140, a.tanya ? 850 : 700, {size: 60, weight: 900, maxW: 1640}); c.restore(); };
// Satu aturan besar di tengah layar: a = {teks, sub, warna}
K.adegan.aturanBesar = (c, t, D, a) => { const C = K.C, muncul = K.muncul; if (a.bg) K.latar(c, a.bg, .9); else K.bg(c); const p = muncul(t, .2), w = a.warna || C.amber;
  c.save(); c.globalAlpha = p; K.rrect(c, 160, 330, 1600, a.sub ? 420 : 320, 36, 'rgba(255,176,32,.08)', w, 6); K.text(c, a.kecil || 'Aturannya', 240, 410, {size: 34, weight: 800, color: C.redup});
  K.text(c, a.teks, 240, 530, {size: a.size || 68, weight: 900, color: w, maxW: 1440, lh: 1.2}); if (a.sub) K.text(c, a.sub, 240, 680, {size: 34, weight: 700, maxW: 1440, lh: 1.3, alpha: muncul(t, 1.2)}); c.restore(); };
// Pita alamat kode per bab (supaya penonton yang mengetik bersama bisa menyamakan atau mengejar): ket + alamat GitHub
K.pitaKode = (c, p, ket, alamat, x, y) => { if (p <= 0) return; const C = K.C, w = Math.max(640, alamat.length * 18.2 + 70);
  c.save(); c.globalAlpha = p; K.rrect(c, x, y + (1 - p) * 16, w, 104, 18, 'rgba(125,170,255,.10)', '#7daaff', 3);
  K.text(c, ket, x + 30, y + 34 + (1 - p) * 16, {size: 24, weight: 800, color: '#7daaff'}); K.text(c, alamat, x + 30, y + 72 + (1 - p) * 16, {size: 30, weight: 800, mono: true}); c.restore(); };
(() => { const kb = K.adegan.kartuBab, lj = K.adegan.lanjut;
  K.adegan.kartuBab = (c, t, D, a) => { kb(c, t, D, a); if (a.mulai) K.pitaKode(c, K.muncul(t, 1.9), 'Tertinggal? Mulai bab ini dari kode di sini', a.mulai, 160, a.catatan ? 830 : 760); };
  K.adegan.lanjut = (c, t, D, a) => { lj(c, t, D, a); if (a.kode) K.pitaKode(c, K.muncul(t, a.tanya ? 3.8 : 1.6), 'Kode sampai akhir bab ini', a.kode, 140, 930); }; })();
