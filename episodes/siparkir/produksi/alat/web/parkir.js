// Pustaka adegan SiParkir (dimuat setelah lapor.js): tokoh, peta, dan adegan generik tambahan
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// ---------- peta arsitektur ----------
K.peta = (c, x, y, s, aktif, p = 1) => { c.save(); c.globalAlpha *= K.out(p); c.translate(x, y); c.scale(s, s);
  const kotak = [['Kebutuhan', 'petugas · pengelola', C.pink, 0, 150], ['Browser', 'HP · laptop', C.sky, 245, 150], ['Laravel', 'PHP di server', C.violet, 490, 150], ['MySQL', 'database', C.teal, 735, 150]];
  kotak.forEach(([n, sub, w, kx, ky], i) => { const on = aktif === undefined || aktif === 'semua' || K.LAPIS[aktif] === i || aktif === 'deploy';
    c.save(); c.globalAlpha *= on ? 1 : .32; K.rrect(c, kx, ky - 60, 215, 120, 20, on ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.02)', w, on ? 5 : 3);
    K.text(c, n, kx + 107, ky - 12, {size: 32, weight: 800, align: 'center'}); K.text(c, sub, kx + 107, ky + 28, {size: 20, weight: 600, align: 'center', color: C.redup}); c.restore();
    if (i < 3) K.arrow(c, kx + 218, ky, kx + 242, ky, '#64748b', 4, 1, 12); });
  if (aktif === 'deploy') { K.rrect(c, 215, 40, 760, 240, 26, null, C.amber, 4); K.text(c, 'Server online (Docker)', 595, 20, {size: 26, weight: 800, align: 'center', color: C.amber}); }
  c.restore(); };
// ---------- tokoh ----------
K.TOKOH = {ratna: ['Bu Ratna', 'pembina koperasi (owner)', '#be185d', {jilbab: '#f9a8d4'}], joko: ['Pak Joko', 'petugas jaga pagi', '#1d4ed8', {kumis: true, topi: '#1e3a8a'}],
  agus: ['Mas Agus', 'petugas jaga siang', '#0f766e', {topi: '#134e4a'}], sinta: ['Bu Sinta', 'tata usaha (admin)', '#7c3aed', {jilbab: '#c4b5fd'}]};
K.tokoh = (c, siapa, x, y, s, p = 1, o = {}) => { if (p <= 0) return; const [n, k, w, op] = K.TOKOH[siapa]; c.save(); c.globalAlpha *= p;
  if (op.jilbab) { c.fillStyle = op.jilbab; c.beginPath(); c.arc(x, y - s * .78, s * .2, 0, 7); c.fill(); K.rrect(c, x - s * .2, y - s * .8, s * .4, s * .3, s * .1, op.jilbab); }
  K.orang(c, x, y, s, w, Object.assign({}, op, o, {topi: null}));
  if (op.topi) { c.fillStyle = op.topi; c.beginPath(); c.arc(x, y - s * .85, s * .165, Math.PI, 0); c.fill(); c.fillRect(x - s * .165, y - s * .862, s * .4, s * .035); }
  if (op.jilbab) { c.strokeStyle = op.jilbab; c.lineWidth = s * .05; c.beginPath(); c.arc(x, y - s * .78, s * .165, Math.PI * 1.02, Math.PI * 1.98); c.stroke(); }
  if (!o.tanpaNama) { K.text(c, n, x, y + s * .11, {size: s * .1, weight: 900, align: 'center'}); K.text(c, k, x, y + s * .21, {size: s * .065, weight: 600, align: 'center', color: C.redup}); } c.restore(); };
// mobil sederhana, (x, y) = tanah tengah
K.mobil = (c, x, y, s, warna = C.sky) => { c.save(); K.rrect(c, x - s * .5, y - s * .3, s, s * .2, s * .06, warna); K.rrect(c, x - s * .28, y - s * .46, s * .5, s * .2, s * .07, warna);
  K.rrect(c, x - s * .22, y - s * .42, s * .17, s * .12, s * .03, '#dbeafe'); K.rrect(c, x - s * .01, y - s * .42, s * .17, s * .12, s * .03, '#dbeafe');
  for (const dx of [-.28, .28]) { c.fillStyle = '#1e293b'; c.beginPath(); c.arc(x + dx * s, y - s * .1, s * .1, 0, 7); c.fill(); c.fillStyle = '#94a3b8'; c.beginPath(); c.arc(x + dx * s, y - s * .1, s * .04, 0, 7); c.fill(); } c.restore(); };
K.rp = n => 'Rp' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
K.kotakT = (c, x, y, w, h, judul, warna, p = 1, o = {}) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, x, y + (1 - p) * 20, w, h, o.r || 20, o.isi || 'rgba(255,255,255,.05)', warna, o.lw || 4); if (judul) K.text(c, judul, o.kiri ? x + 30 : x + w / 2, y + (o.ty || 44) + (1 - p) * 20, {size: o.size || 28, weight: 900, color: o.warnaTeks || warna, align: o.kiri ? 'left' : 'center', mono: !!o.mono}); c.restore(); };
// tiket / struk kertas kecil: baris = [[kiri, kanan?, {tebal, besar}]]
K.kertas = (c, x, y, w, baris, p = 1, o = {}) => { if (p <= 0) return 0; const lh = o.lh || 34, h = 40 + baris.length * lh; c.save(); c.globalAlpha *= p; c.translate(x + w / 2, y + h / 2); c.rotate(o.rot || 0); c.translate(-(x + w / 2), -(y + h / 2));
  c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 24; K.rrect(c, x, y, w, h, 4, '#fff'); c.shadowColor = 'transparent';
  baris.forEach(([a, b, op], i) => { const yy = y + 36 + i * lh, z = (op && op.besar) ? 30 : 21, wt = (op && (op.tebal || op.besar)) ? 800 : 500, col = (op && op.warna) || '#111827';
    if (a === '-') { c.strokeStyle = '#111827'; c.setLineDash([6, 5]); c.lineWidth = 2; c.beginPath(); c.moveTo(x + 16, yy); c.lineTo(x + w - 16, yy); c.stroke(); c.setLineDash([]); return; }
    if (b === undefined) K.text(c, a, x + w / 2, yy, {size: z, weight: wt, mono: true, align: 'center', color: col});
    else { K.text(c, a, x + 20, yy, {size: z, weight: wt, mono: true, color: col}); K.text(c, b, x + w - 20, yy, {size: z, weight: wt, mono: true, align: 'right', color: col}); } });
  c.restore(); return h; };
// ---------- adegan generik ----------
// Obrolan: a = {judul, sub, warna, tokoh, balon: [{k, d, teks, kita}], kartu: [{k, d, judul, isi, besar, warna}], kol, tutup: {k, teks, warna}}
AD.obrolan = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul, t, a.warna || C.pink, a.sub);
  K.tokoh(c, a.tokoh, 300, 820, 400, muncul(t, .3));
  let y = 215; (a.balon || []).forEach(b => { const p = muncul(t, kt(a, b.k, b.d || 0)); if (p <= 0) { return; }
    const w = b.w || (b.kita ? 900 : 860), x = b.kita ? 1780 - w : 520, h = K.balon(c, x, y, w, b.teks, p, b.kita ? {warna: C.sky, teks: '#0e1424', size: b.size || 32, ekor: 'kanan'} : {size: b.size || 32}); y += (h || 0) + 46; });
  const kr = a.kartu || [], kol = a.kol || Math.min(3, kr.length || 1), gw = 30, x0 = 560, lebar = 1780 - x0, w = (lebar - (kol - 1) * gw) / kol, y0 = Math.max(y + 10, a.yKartu || 0), bar = Math.ceil(kr.length / kol), h = a.tinggi || Math.min(230, (940 - y0 - (bar - 1) * 26) / Math.max(1, bar));
  kr.forEach((it, i) => { const p = muncul(t, kt(a, it.k, it.d || 0)); if (p <= 0) return; const x = x0 + (i % kol) * (w + gw), yy = y0 + Math.floor(i / kol) * (h + 26) + (1 - p) * 20, wr = it.warna || [C.amber, C.lime, C.sky, C.violet, C.teal, C.pink][i % 6];
    c.save(); c.globalAlpha = p; K.rrect(c, x, yy, w, h, 20, 'rgba(255,255,255,.05)', wr, 4);
    if (it.besar) { K.text(c, it.besar, x + 30, yy + h * .3, {size: Math.min(54, h * .26), weight: 900, color: wr}); K.text(c, it.judul, x + 30, yy + h * .6, {size: 30, weight: 800, maxW: w - 60}); if (it.isi) K.text(c, it.isi, x + 30, yy + h * .82, {size: 23, weight: 600, color: C.redup, maxW: w - 60}); }
    else { K.text(c, it.judul, x + 30, yy + (it.isi ? h * .3 : h * .5), {size: 32, weight: 900, color: wr, maxW: w - 60, lh: 1.2}); if (it.isi) K.text(c, it.isi, x + 30, yy + h * .64, {size: 25, weight: 600, maxW: w - 60, lh: 1.3}); } c.restore(); });
  if (a.tutup) K.text(c, a.tutup.teks, 1170, 990, {size: 34, weight: 900, align: 'center', color: a.tutup.warna || C.amber, alpha: muncul(t, kt(a, a.tutup.k, a.tutup.d || 0))}); };
// Gambar (tangkapan layar) dengan keterangan: a = {judul, sub, warna, img, w, h?, x?, item: [{k, d, judul, isi, warna}], repo, bingkai}
AD.gambarJelas = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul, t, a.warna || C.sky, a.sub);
  const im = K.IMG[a.img], w = a.w || 900, x = a.x ?? 140, y = a.y ?? 215, p0 = muncul(t, .4); let h = a.h || 760;
  if (im) { h = Math.min(h, w * im.height / im.width); c.save(); c.globalAlpha = p0; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 30; K.rrect(c, x - 6, y - 6, w + 12, h + 12, 12, '#fff', '#475569', 3); c.shadowColor = 'transparent';
    c.beginPath(); c.rect(x, y, w, h); c.clip(); const g = a.gulir ? Math.min(1, Math.max(0, (t - kt(a, a.gulir[0])) / (a.gulir[1] || 8))) : 0, th = w * im.height / im.width; c.drawImage(im, x, y - Math.max(0, th - h) * g * g * (3 - 2 * g), w, th); c.restore(); }
  (a.sorot || []).forEach(s => { const p = K.antara(t, kt(a, s.k, s.d || 0), s.k2 === undefined ? 9e9 : kt(a, s.k2)); if (p > 0) K.sorotKuning(c, x + s.r[0] * w, y + s.r[1] * h, s.r[2] * w, s.r[3] * h, p); });
  const xi = x + w + 50, wi = 1780 - xi; (a.item || []).forEach((it, i) => { const p = muncul(t, kt(a, it.k, it.d || 0)); if (p <= 0) return; const hh = it.h || 170, yy = y + i * (hh + 24) + (1 - p) * 20, wr = it.warna || C.amber;
    c.save(); c.globalAlpha = p; K.rrect(c, xi, yy, wi, hh, 20, 'rgba(255,255,255,.05)', wr, 4); K.text(c, it.judul, xi + 30, yy + 50, {size: 31, weight: 900, color: wr, maxW: wi - 60, mono: !!it.mono}); if (it.isi) K.text(c, it.isi, xi + 30, yy + 104, {size: 25, weight: 600, maxW: wi - 60, lh: 1.3}); c.restore(); });
  if (a.repo) K.chipRepo(c, muncul(t, kt(a, a.repo.k)), {ket: a.repo.ket, y: a.repo.y, x: a.repo.x, w: a.repo.w}); };
// HP dengan tangkapan layar (judul bawaan SiParkir)
const hpLama = AD.hpLayar; AD.hpLayar = (c, t, D, a) => { hpLama(c, t, D, Object.assign({judul: 'SiParkir di layar HP'}, a)); if (a.repo) K.chipRepo(c, muncul(t, kt(a, a.repo.k)), {ket: a.repo.ket, y: a.repo.y ?? 880, x: a.repo.x ?? 800, w: a.repo.w ?? 980}); };
// Garis waktu parkir: blok per jam dengan harga. o = {x, y, w, jam (jumlah blok), pertama, berikut, isi (jam terisi, pecahan), p, label[]}
K.garisTarif = (c, o) => { const n = o.jam, bw = o.w / n, p = o.p ?? 1; if (p <= 0) return; c.save(); c.globalAlpha *= p;
  for (let i = 0; i < n; i++) { const x = o.x + i * bw, penuh = Math.max(0, Math.min(1, (o.isi ?? n) - i)), wr = i === 0 ? C.amber : C.sky;
    K.rrect(c, x + 3, o.y, bw - 6, 90, 12, 'rgba(255,255,255,.04)', '#475569', 2); if (penuh > 0) { c.save(); c.beginPath(); c.rect(x + 3, o.y, (bw - 6) * penuh, 90); c.clip(); K.rrect(c, x + 3, o.y, bw - 6, 90, 12, i === 0 ? 'rgba(255,176,32,.28)' : 'rgba(56,189,248,.22)', wr, 3); c.restore(); }
    K.text(c, 'jam ke-' + (i + 1), x + bw / 2, o.y + 30, {size: 20, weight: 700, align: 'center', color: C.redup}); K.text(c, K.rp(i === 0 ? o.pertama : o.berikut), x + bw / 2, o.y + 62, {size: Math.min(26, bw * .17), weight: 900, align: 'center', color: wr}); }
  c.restore(); };
})();
