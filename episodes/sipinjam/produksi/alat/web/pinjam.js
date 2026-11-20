// Pustaka adegan SiPinjam (dimuat setelah kanvas.js dan antre.js)
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const REPO = 'github.com/listyantidewi1/SiPinjam';
const kt = (a, i, d = 0) => (a.kal && a.kal[i] !== undefined ? a.kal[i] : 9e9) + d;          // waktu kalimat ke-i
const muncul = (t, t0, d = .5) => O(S(t, t0, t0 + d));
const antara = (t, t0, t1, d = .4) => Math.min(O(S(t, t0, t0 + d)), 1 - O(S(t, t1 - d, t1))); // tampil di [t0, t1]

// kotak alamat GitHub: selalu tampil saat narasi menyebut README
K.chipRepo = (c, p, o = {}) => { if (p <= 0) return; const w = o.w || 1060, x = o.x ?? (1920 - w) / 2, y = o.y ?? 900, dy = (1 - p) * 24;
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 26; K.rrect(c, x, y + dy, w, 124, 22, '#0d1222', C.amber, 4); c.shadowColor = 'transparent';
  K.rrect(c, x + 24, y + dy + 24, 150, 76, 14, C.amber); K.text(c, 'README', x + 99, y + dy + 63, {size: 28, weight: 900, align: 'center', color: '#141a2c'});
  K.text(c, o.ket || 'Panduan lengkap ada di README', x + 200, y + dy + 40, {size: 26, weight: 700, color: C.redup});
  K.text(c, REPO, x + 200, y + dy + 86, {size: 38, weight: 800, mono: true}); c.restore(); };

// jendela terminal. baris: [{at, cmd, prompt?, out?: [teks | [teks, warna]], jeda?}]; o.sorot = [[idxBaris, idxOut(-1 = baris perintah), t0, t1?]]
K.term = (c, x, y, w, h, t, baris, o = {}) => {
  const size = o.size || 28, lh = size * 1.6, cps = o.cps || 24, p = o.p ?? 1; if (p <= 0) return {};
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 16, '#0a0f1e', '#3b4a75', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 50, 16, '#1b2440'); c.fillStyle = '#1b2440'; c.fillRect(x + 2, y + 30, w - 4, 22);
  ['#ff6b6b', '#ffb020', '#a3e635'].forEach((k, i) => { c.fillStyle = k; c.beginPath(); c.arc(x + 30 + i * 28, y + 26, 8, 0, 7); c.fill(); });
  K.text(c, o.judul || 'Terminal', x + w / 2, y + 26, {size: 22, weight: 700, align: 'center', color: C.redup});
  c.beginPath(); c.rect(x, y + 52, w, h - 54); c.clip();
  let yy = y + 52 + 22 + lh / 2; const pos = {};
  baris.forEach((b, i) => { if (t < b.at) return; const pr = b.prompt ?? '$ ', n = Math.floor((t - b.at) * cps), sel = b.at + b.cmd.length / cps;
    for (const s of (o.sorot || [])) if (s[0] === i && s[1] === -1 && t >= s[2] && t < (s[3] ?? 9e9)) K.rrect(c, x + 10, yy - lh / 2 + 2, w - 20, lh - 4, 8, 'rgba(255,176,32,.2)', C.amber, 3);
    K.text(c, pr, x + 26, yy, {size, weight: 700, mono: true, color: b.warnaPrompt || C.lime}); const px = x + 26 + K.lebar(c, pr, size, 700, true);
    K.text(c, b.cmd.slice(0, n), px, yy, {size, weight: 500, mono: true});
    if (t < sel + .15 && Math.floor(t * 2.5) % 2 === 0) { c.fillStyle = '#e6e9f2'; c.fillRect(px + K.lebar(c, b.cmd.slice(0, n), size, 500, true) + 2, yy - size * .55, size * .5, size * 1.1); }
    pos[i + ':-1'] = yy; yy += lh;
    if (t >= sel + (b.jeda ?? .45)) (b.out || []).forEach((u, j) => { const [s, w2] = Array.isArray(u) ? u : [u, '#aab4d0'];
      for (const z of (o.sorot || [])) if (z[0] === i && z[1] === j && t >= z[2] && t < (z[3] ?? 9e9)) K.rrect(c, x + 10, yy - lh / 2 + 2, w - 20, lh - 4, 8, 'rgba(255,176,32,.2)', C.amber, 3);
      K.text(c, s, x + 26, yy, {size, weight: 500, mono: true, color: w2}); pos[i + ':' + j] = yy; yy += lh; });
  });
  c.restore(); return pos;
};
// jendela browser sederhana; isi(c, x, y, w, h)
K.browser = (c, x, y, w, h, url, isi, p = 1) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; const dy = (1 - p) * 26; y += dy;
  c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 16, '#f8fafc', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 70, 16, '#dbe2ee'); c.fillStyle = '#dbe2ee'; c.fillRect(x + 2, y + 40, w - 4, 32);
  ['#94a3b8', '#94a3b8', '#94a3b8'].forEach((k, i) => { c.fillStyle = k; c.beginPath(); c.arc(x + 32 + i * 28, y + 35, 8, 0, 7); c.fill(); });
  K.rrect(c, x + 130, y + 13, w - 160, 44, 22, '#ffffff', '#b6c2d6', 2); K.text(c, url, x + 156, y + 36, {size: 26, weight: 700, mono: true, color: '#1e293b'});
  c.beginPath(); c.rect(x, y + 72, w, h - 74); c.clip(); if (isi) isi(c, x, y + 72, w, h - 72); c.restore(); };
const tombol = (c, x, y, w, h, teks, warna, sorotP = 0, t = 0) => { K.rrect(c, x, y, w, h, 12, warna); let fs = h * .42; while (fs > 12 && K.lebar(c, teks, fs, 800) > w - 36) fs -= 1; K.text(c, teks, x + w / 2, y + h / 2 + 1, {size: fs, weight: 800, align: 'center', color: '#fff'});
  if (sorotP > 0) { const g = 8 + 5 * Math.sin(t * 5); c.save(); c.globalAlpha *= sorotP; K.rrect(c, x - g, y - g, w + 2 * g, h + 2 * g, 16 + g, null, C.amber, 6); c.restore(); } };
// jendela penginstal; isi(c, x, y, w, h)
const wizard = (c, x, y, w, h, judul, isi, p = 1, o = {}) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; const dy = (1 - p) * 26; y += dy;
  c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 12, '#f1f5f9', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 58, 12, '#334155'); c.fillStyle = '#334155'; c.fillRect(x + 2, y + 34, w - 4, 26); K.text(c, judul, x + 26, y + 30, {size: 26, weight: 800, color: '#f8fafc'});
  if (isi) isi(c, x, y + 60, w, h - 150);
  c.fillStyle = '#cbd5e1'; c.fillRect(x + 2, y + h - 88, w - 4, 2);
  K.rrect(c, x + w - 370, y + h - 68, 160, 48, 8, '#e2e8f0', '#94a3b8', 2); K.text(c, '< Back', x + w - 290, y + h - 43, {size: 22, weight: 700, align: 'center', color: '#475569'});
  tombol(c, x + w - 190, y + h - 68, 160, 48, o.akhir ? 'Finish' : 'Next >', '#2563eb', o.sorotNext || 0, o.t || 0); c.restore(); };
const centangKotak = (c, x, y, teks, on, o = {}) => { K.rrect(c, x, y - 17, 34, 34, 6, '#fff', '#64748b', 3);
  if (on > 0) K.centang(c, x + 17, y, 30, on, '#16a34a'); K.text(c, teks, x + 52, y + 1, {size: o.size || 28, weight: 600, color: o.warna || '#1e293b'}); };
const sorotKuning = (c, x, y, w, h, p) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, x, y, w, h, 12, 'rgba(255,176,32,.2)', C.amber, 5); c.restore(); };
const laptop = (c, x, y, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); K.rrect(c, -150, -110, 300, 190, 12, '#1e293b', '#94a3b8', 5); c.fillStyle = '#94a3b8'; c.fillRect(-190, 80, 380, 18); c.restore(); };
const nomor = (c, n, x, y, warna = C.amber) => { c.fillStyle = warna; c.beginPath(); c.arc(x, y, 34, 0, 7); c.fill(); K.text(c, String(n), x, y + 2, {size: 38, weight: 900, align: 'center', color: '#141a2c'}); };
const judulAlat = (c, n, nama, ket, t, warna) => { const p = muncul(t, .1); c.save(); c.globalAlpha = p; nomor(c, n, 114, 100, warna); K.text(c, nama, 170, 100, {size: 54, weight: 900});
  K.text(c, ket, 174 + K.lebar(c, nama, 54, 900), 104, {size: 32, weight: 600, color: C.redup}); c.restore(); };


Object.assign(K, {kt, muncul, antara, tombol, wizard, centangKotak, sorotKuning, laptop, nomor, judulAlat, REPO});
// ---------- peta arsitektur SiLapor ----------
K.peta = (c, x, y, s, aktif, p = 1) => { c.save(); c.globalAlpha *= K.out(p); c.translate(x, y); c.scale(s, s);
  const kotak = [['Kebutuhan', 'siswa · petugas', C.pink, 0, 150], ['Browser', 'HP · laptop', C.sky, 245, 150], ['PHP', 'halaman dan aturan', C.violet, 490, 150], ['MySQL', 'tabel · prosedur · trigger', C.teal, 735, 150]];
  kotak.forEach(([n, sub, w, kx, ky], i) => { const on = aktif === undefined || aktif === 'semua' || K.LAPIS[aktif] === i || aktif === 'deploy';
    c.save(); c.globalAlpha *= on ? 1 : .32; K.rrect(c, kx, ky - 60, 215, 120, 20, on ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.02)', w, on ? 5 : 3);
    K.text(c, n, kx + 107, ky - 12, {size: 32, weight: 800, align: 'center'}); K.text(c, sub, kx + 107, ky + 28, {size: 20, weight: 600, align: 'center', color: C.redup}); c.restore();
    if (i < 3) K.arrow(c, kx + 218, ky, kx + 242, ky, '#64748b', 4, 1, 12); });
  if (aktif === 'deploy') { K.rrect(c, 215, 40, 760, 240, 26, null, C.amber, 4); K.text(c, 'Server online', 595, 20, {size: 26, weight: 800, align: 'center', color: C.amber}); }
  c.restore(); };
K.adegan.judulVideo = (c, t, D, a) => { if (a.bg) K.latar(c, a.bg, 0.9); else K.bg(c);
  const p1 = O(S(t, .1, .7)), p2 = O(S(t, .5, 1.2)), p3 = O(S(t, 1.1, 1.8));
  c.save(); c.globalAlpha = p1; K.rrect(c, 140, 260, 560, 56, 28, C.amber); K.text(c, 'MEMBANGUN APLIKASI DARI NOL', 420, 289, {size: 24, weight: 900, align: 'center', color: '#141a2c'}); c.restore();
  c.save(); c.globalAlpha = p2; let y = 390 + 20 * (1 - p2); for (const b of a.judul.split('\n')) { K.text(c, b, 140, y, {size: 92, weight: 900}); y += 112; } c.restore();
  if (a.hook) { c.save(); c.globalAlpha = p3; K.text(c, a.hook, 140, y + 50, {size: 38, weight: 500, color: '#c9d3ee', maxW: 1560, lh: 1.35}); c.restore(); } };
// pewarnaan sintaks: tambah kata kunci PHP
const KWP = new Set(('public private protected static function return class extends use namespace new if else elseif foreach as fn const self true false null array string bool int void ' +
  'select from where and or join on group by order limit insert into values update set delete create table like count show between desc asc declare begin end if then call procedure trigger returns for each row after before start transaction commit rollback signal resignal primary key foreign references not null default unique index drop exists handler exit left interval day curdate').split(' '));
K.token = (line) => { const out = []; const re = /(--.*$|\/\/.*$|#\[.*$|"[^"]*"?|'[^']*'?|\$[A-Za-z_]\w*|@[a-z]+|\{\{|\}\}|\{!!|!!\}|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|.)/g; let m;
  while ((m = re.exec(line))) { const s = m[0]; let col = '#e6e9f2';
    if (/^(--|\/\/)/.test(s)) col = '#7c8aa8'; else if (/^["']/.test(s)) col = '#f9a07a'; else if (/^\d/.test(s)) col = '#b5e48c'; else if (s[0] === '$') col = '#9cdcfe'; else if (s[0] === '@' && s.length > 1) col = '#f472b6';
    else if (/^(\{\{|\}\}|\{!!|!!\})$/.test(s)) col = '#ffcb6b'; else if (KWP.has(s.toLowerCase()) && /^[A-Za-z]/.test(s)) col = '#c792ea'; else if (/^[=<>+\-*/%]+$/.test(s)) col = '#ffcb6b';
    out.push([s, col]); } return out; };

// ---------- pembantu tokoh dan aplikasi ----------
K.WS = {diajukan: '#d97706', disetujui: '#2563eb', dikembalikan: '#16a34a', ditolak: '#94a3b8', dibatalkan: '#94a3b8', terlambat: '#dc2626'};
K.chipStatus = (c, s, x, y, o = {}) => { const size = o.size || 26, w = o.w || (K.lebar(c, s, size, 800) + size * 1.4), h = size * 1.8; c.save(); c.globalAlpha *= (o.p ?? 1);
  K.rrect(c, x, y - h / 2, w, h, h / 2, K.WS[s] || '#64748b'); K.text(c, s, x + w / 2, y + 1, {size, weight: 800, align: 'center', color: '#fff'}); c.restore(); return w; };
K.balon = (c, x, y, w, teks, p = 1, o = {}) => { if (p <= 0) return; const size = o.size || 30; c.save(); c.globalAlpha *= p; c.font = `700 ${size}px ${K.F}`;
  const kata = teks.split(' '); let baris = [], br = ''; for (const k of kata) { const tl = br ? br + ' ' + k : k; if (c.measureText(tl).width > w - 56 && br) { baris.push(br); br = k; } else br = tl; } baris.push(br);
  const h = baris.length * size * 1.35 + 44, dy = (1 - p) * 18; K.rrect(c, x, y + dy, w, h, 26, o.warna || '#f8fafc');
  c.fillStyle = o.warna || '#f8fafc'; c.beginPath(); const ex = o.ekor === 'kanan' ? x + w - 70 : x + 70; c.moveTo(ex - 18, y + dy + h - 2); c.lineTo(ex + 18, y + dy + h - 2); c.lineTo(ex + (o.ekor === 'kanan' ? 26 : -26), y + dy + h + 30); c.fill();
  baris.forEach((b, i) => K.text(c, b, x + 28, y + dy + 22 + size * .68 + i * size * 1.35, {size, weight: 700, color: o.teks || '#1e293b'})); c.restore(); return h; };
K.TOKOH = {yusuf: ['Pak Yusuf', 'petugas lab', '#0f766e', {kumis: true}], sari: ['Bu Sari', 'kepala lab', '#7c3aed', {}], nadia: ['Nadia', 'XI DKV 2', '#db2777', {}], rafi: ['Rafi', 'XI RPL 1', '#2563eb', {}]};
K.tokoh = (c, siapa, x, y, s, p = 1, o = {}) => { if (p <= 0) return; const [n, k, w, op] = K.TOKOH[siapa]; c.save(); c.globalAlpha *= p; K.orang(c, x, y, s, w, Object.assign({}, op, o));
  if (siapa !== 'yusuf') { const pr = siapa === 'nadia' || siapa === 'sari'; c.fillStyle = pr ? '#3b2a20' : '#1f2937'; c.beginPath(); c.arc(x, y - s * .82, s * .165, Math.PI, 0); c.fill(); if (pr) { c.fillRect(x - s * .165, y - s * .82, s * .05, s * .2); c.fillRect(x + s * .115, y - s * .82, s * .05, s * .2); } }
  if (!o.tanpaNama) { K.text(c, n, x, y + s * .11, {size: s * .1, weight: 900, align: 'center'}); K.text(c, k, x, y + s * .21, {size: s * .065, weight: 600, align: 'center', color: C.redup}); } c.restore(); };
// kartu laporan kecil (seperti di aplikasi)
K.kartuLaporan = (c, x, y, w, o = {}) => { const h = o.h || 150; c.save(); c.globalAlpha *= (o.p ?? 1); K.rrect(c, x, y, w, h, 16, '#fff', o.garis || '#e2e8f0', o.garis ? 5 : 2);
  K.chipStatus(c, o.status || 'baru', x + 20, y + 34, {size: 18}); K.text(c, o.judul || 'Proyektor tidak menyala', x + 20, y + 80, {size: 26, weight: 800, color: '#0f172a'});
  K.text(c, o.sub || 'Ruang kelas · 17 November 2026', x + 20, y + 118, {size: 19, weight: 600, color: '#64748b'}); c.restore(); };
// ---------- adegan generik ----------
// Cek kerjaan AI: a = {perintah, kode[], size, w, ket?}
AD.cekAI = (c, t, D, a) => { K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 140, 160, O(S(t, .4, 1)));
  if (a.perintah) K.text(c, 'Perintah: "' + a.perintah + '"', 140, 260, {size: 30, weight: 600, color: C.redup, alpha: O(S(t, .6, 1.2))});
  const n = a.kode.join('\n').length; K.kode(c, a.kode, 140, 310, {size: a.size || 30, w: a.w || 1500, chars: Math.floor(n * S(t, kt(a, 1) < 9e8 ? kt(a, 1) : 1, (kt(a, 1) < 9e8 ? kt(a, 1) : 1) + Math.min(4, n / 60)))});
  if (a.ket) K.text(c, a.ket, 140, 990, {size: 28, weight: 700, color: C.lime, alpha: muncul(t, kt(a, a.ketK ?? 3))});
  K.pikirkan(c, t, D, 1660, 900); };
// Jawaban: a = {perintah?, kode[], size, w, masalah: [{k, judul, isi, sorot: [], warna}]}
AD.masalahAI = (c, t, D, a) => { if (a.tantangan && t >= kt(a, a.tantangan.k)) { const t0 = kt(a, a.tantangan.k); return K.adegan.tantangan(c, t - t0, D - t0, a.tantangan); }
  K.bg(c); K.cekAIjudul(c, t);
  let akt = -1; a.masalah.forEach((m, i) => { if (t >= kt(a, m.k)) akt = i; });
  const size = a.size || 28, kb = K.kode(c, a.kode, 140, 170, {size, w: a.w || 1640, sorot: akt >= 0 ? (a.masalah[akt].sorot || []) : [], pSorot: akt >= 0 ? muncul(t, kt(a, a.masalah[akt].k)) : 0});
  const y0 = 170 + kb.h + 36, n = a.masalah.length, h = Math.min(190, (1040 - y0 - (n - 1) * 20) / n);
  a.masalah.forEach((m, i) => { const p = muncul(t, kt(a, m.k)); if (p <= 0) return; const y = y0 + i * (h + 20) + (1 - p) * 20, w = m.warna || [C.amber, C.coral, C.violet, C.sky][i % 4];
    c.save(); c.globalAlpha = p * (i === akt ? 1 : .6); K.rrect(c, 140, y, a.w || 1640, h, 18, 'rgba(255,255,255,.04)', w, i === akt ? 4 : 2);
    K.nomor(c, i + 1, 196, y + h / 2, w); K.text(c, m.judul, 250, y + h * .32, {size: Math.min(34, h * .22), weight: 900, color: w});
    K.text(c, m.isi, 250, y + h * .68, {size: Math.min(27, h * .18), weight: 600, maxW: (a.w || 1640) - 150, lh: 1.25}); c.restore(); }); };
// Poin: a = {judul, sub, warna, kol, item: [{k, d, judul, isi, warna, besar}], tinggi}
AD.poin = (c, t, D, a) => { if (a.bg) K.latar(c, a.bg, .86); else K.bg(c); K.judul(c, a.judul, t, a.warna || C.amber, a.sub);
  const n = a.item.length, kol = a.kol || (n <= 3 ? n : n === 4 ? 2 : 3), bar = Math.ceil(n / kol), gw = 40, w = (1640 - (kol - 1) * gw) / kol, h = a.tinggi || Math.min(340, (760 - (bar - 1) * 40) / bar), y0 = 230 + (780 - (bar * h + (bar - 1) * 40)) / 2 - 20;
  a.item.forEach((it, i) => { const p = muncul(t, it.k === undefined ? .4 + i * .5 : kt(a, it.k, it.d || 0)); if (p <= 0) return; const x = 140 + (i % kol) * (w + gw), y = y0 + Math.floor(i / kol) * (h + 40) + (1 - p) * 24, wr = it.warna || [C.sky, C.amber, C.lime, C.pink, C.violet, C.teal][i % 6];
    c.save(); c.globalAlpha = p; K.rrect(c, x, y, w, h, 22, 'rgba(255,255,255,.05)', wr, 4);
    if (it.besar) { K.text(c, it.besar, x + 36, y + h * .3, {size: Math.min(64, h * .26), weight: 900, color: wr, mono: !!it.mono}); K.text(c, it.judul, x + 36, y + h * .58, {size: 32, weight: 800, maxW: w - 70}); if (it.isi) K.text(c, it.isi, x + 36, y + h * .8, {size: 24, weight: 600, color: C.redup, maxW: w - 70, lh: 1.25}); }
    else { K.text(c, it.judul, x + 36, y + (it.isi ? h * .28 : h * .5), {size: a.sj || 36, weight: 900, color: wr, maxW: w - 70, lh: 1.2, mono: !!it.mono}); if (it.isi) K.text(c, it.isi, x + 36, y + h * .58, {size: a.si || 27, weight: 600, maxW: w - 70, lh: 1.3}); }
    c.restore(); });
  if (a.repo) K.chipRepo(c, muncul(t, kt(a, a.repo.k)), {ket: a.repo.ket, y: a.repo.y}); };
// Kode dengan penjelasan per kalimat: a = {judul, sub, warna, kode[], size, w, langkah: [{k, sorot: [], ket}], berkas}
AD.kodeJelas = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul, t, a.warna || C.violet, a.sub);
  let akt = -1; (a.langkah || []).forEach((m, i) => { if (t >= kt(a, m.k, m.d || 0)) akt = i; }); const L = akt >= 0 ? a.langkah[akt] : null;
  if (a.berkas) K.text(c, a.berkas, 140, 226, {size: 24, weight: 700, mono: true, color: C.redup});
  const kb = K.kode(c, a.kode, 140, 250, {size: a.size || 30, w: a.w || 1640, sorot: L ? L.sorot : [], pSorot: L ? muncul(t, kt(a, L.k, L.d || 0)) : 0});
  if (L && L.ket) { const p = muncul(t, kt(a, L.k, L.d || 0)); c.save(); c.globalAlpha = p; const y = Math.min(250 + kb.h + 30, 900); K.rrect(c, 140, y, a.w || 1640, 110, 18, 'rgba(255,176,32,.1)', C.amber, 3);
    K.text(c, L.ket, 180, y + 56, {size: 32, weight: 700, maxW: (a.w || 1640) - 80, lh: 1.2}); c.restore(); }
  if (a.repo) K.chipRepo(c, muncul(t, kt(a, a.repo.k)), {ket: a.repo.ket, y: a.repo.y}); };
// Terminal yang digambar: a = {judul, sub, warna, termJudul, size, baris: [{k, d, cmd, out, prompt}], sorot: [[i, j, k]], catatan: [{k, teks, isi, warna}], repo: {k, ket}, lebar}
AD.termGambar = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul, t, a.warna || C.teal, a.sub);
  const lw = a.lebar || (a.catatan ? 1060 : 1640), baris = a.baris.map(b => Object.assign({}, b, {at: kt(a, b.k, b.d ?? .6)}));
  K.term(c, 140, 210, lw, a.tinggi || 620, t, baris, {size: a.size || 28, judul: a.termJudul || 'Terminal', cps: a.cps || 26, sorot: (a.sorot || []).map(([i, j, k, k2]) => [i, j, kt(a, k), k2 === undefined ? undefined : kt(a, k2)])});
  (a.catatan || []).forEach((m, i) => { const p = muncul(t, kt(a, m.k, m.d || 0)); if (p <= 0) return; const x = 140 + lw + 40, w = 1780 - x, h = m.h || 180, y = 210 + i * (h + 24) + (1 - p) * 20, wr = m.warna || C.amber;
    c.save(); c.globalAlpha = p; K.rrect(c, x, y, w, h, 18, 'rgba(255,255,255,.05)', wr, 4); K.text(c, m.teks, x + 30, y + 46, {size: 30, weight: 900, color: wr, maxW: w - 60, lh: 1.2});
    if (m.isi) K.text(c, m.isi, x + 30, y + (m.yi || 100), {size: 25, weight: 600, maxW: w - 60, lh: 1.3}); c.restore(); });
  if (a.repo) K.chipRepo(c, muncul(t, kt(a, a.repo.k)), {ket: a.repo.ket, y: a.repo.y ?? 880}); };
})();

(() => { const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// Layar HP dengan tangkapan layar asli; a.img = berkas, a.gulir = [k, jarak]
AD.hpLayar = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul || 'SiLapor di layar HP', t, C.sky, a.sub);
  const im = K.IMG[a.img], w = 430, h = 800, x = a.x ?? 300, y = 210; const p0 = muncul(t, .4);
  c.save(); c.globalAlpha = p0; K.hp(c, x, y, w, h, (c, lx, ly, lw, lh) => { if (!im) return; const sk = lw / im.width, th = im.height * sk, maks = Math.max(0, th - lh);
    const g = a.gulir ? Math.min(1, Math.max(0, (t - kt(a, a.gulir[0])) / (a.gulir[1] || 8))) : 0; const e = g * g * (3 - 2 * g); c.drawImage(im, lx, ly - maks * e, lw, th); }); c.restore();
  (a.item || []).forEach((it, i) => { const p = muncul(t, kt(a, it.k, it.d || 0)); if (p <= 0) return; c.save(); c.globalAlpha = p; const yy = 300 + i * 190; K.rrect(c, 860, yy + (1 - p) * 20, 920, 160, 20, 'rgba(255,255,255,.05)', it.warna || C.amber, 4);
    K.text(c, it.judul, 900, yy + 54, {size: 32, weight: 900, color: it.warna || C.amber, mono: !!it.mono}); K.text(c, it.isi, 900, yy + 110, {size: 26, weight: 600, maxW: 840, lh: 1.25}); c.restore(); });
};
})();
// Penutup bab: a = {selesai, berikut}
(() => { const C = K.C, muncul = K.muncul;
K.adegan.lanjut = (c, t, D, a) => { K.bg(c); const p = muncul(t, .2), p2 = muncul(t, 1.0);
  c.save(); c.globalAlpha = p; K.rrect(c, 140, 250, 1640, 220, 26, 'rgba(163,230,53,.08)', C.lime, 4); K.centang(c, 230, 360, 70, p, C.lime); K.text(c, a.selesai, 320, 360, {size: 44, weight: 800, maxW: 1400, lh: 1.25}); c.restore();
  c.save(); c.globalAlpha = p2; K.text(c, 'Bab berikutnya', 140, 620, {size: 30, weight: 700, color: C.redup}); K.text(c, a.berikut, 140, 700, {size: 60, weight: 900, maxW: 1640}); c.restore(); };
})();

(() => { const C = K.C;
// kamera digambar dengan kode; (x, y) = tengah, s = lebar
K.kameraIkon = (c, x, y, s, warna = '#e2e8f0') => { c.save(); c.translate(x, y);
  K.rrect(c, -s * .5, -s * .28, s, s * .62, s * .08, '#1e293b', warna, s * .035); K.rrect(c, -s * .2, -s * .4, s * .4, s * .14, s * .04, '#1e293b', warna, s * .035);
  c.strokeStyle = warna; c.lineWidth = s * .04; c.beginPath(); c.arc(0, s * .03, s * .2, 0, 7); c.stroke(); c.fillStyle = '#60a5fa'; c.beginPath(); c.arc(0, s * .03, s * .11, 0, 7); c.fill();
  c.fillStyle = C.amber; c.beginPath(); c.arc(s * .36, -s * .15, s * .035, 0, 7); c.fill(); c.restore(); };
// layar HP berisi tangkapan layar asli (lebar penuh, dipotong dari atas); zoom opsional
K.hpGambar = (c, x, y, w, h, im, o = {}) => K.hp(c, x, y, w, h, (c, lx, ly, lw, lh) => { if (!im) return; const sk = lw / im.width * (o.zoom || 1); c.drawImage(im, lx - (o.dx || 0) * sk, ly - (o.dy || 0) * sk, im.width * sk, im.height * sk); });
})();

// Dua permintaan berebut stok. a.w = {langkah, mulai, rafi, nadia, cukup, catat, nama}: nomor kalimat atau [kalimat, tunda]; a.nama, a.ket
(() => { const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
AD.race = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul || 'Dua permintaan, satu kamera terakhir', t, C.coral, a.sub);
  const T = n => { const v = (a.w || {})[n]; return v === undefined ? 9e9 : Array.isArray(v) ? kt(a, v[0], v[1]) : kt(a, v); };
  const tl = T('langkah'); ['1  baca stok', '2  cukup?', '3  kurangi stok, catat pinjaman'].forEach((s, i) => { const p = muncul(t, tl + i * 1.3); if (p <= 0) return; const x = [400, 730, 1000][i], w = [300, 240, 520][i]; c.save(); c.globalAlpha = p;
    K.rrect(c, x, 196, w, 66, 33, 'rgba(255,255,255,.06)', C.amber, 3); K.text(c, s, x + w / 2, 230, {size: 28, weight: 800, align: 'center'}); c.restore(); });
  const tm = Math.min(T('mulai'), T('rafi')), pm = muncul(t, tm), tc = T('catat'), habis = t >= tc + 1.4;
  if (pm > 0) { c.save(); c.globalAlpha = pm; K.rrect(c, 760, 310, 400, 270, 22, 'rgba(255,255,255,.05)', habis ? C.coral : C.amber, 5); K.kameraIkon(c, 960, 395, 140); K.text(c, 'Kamera DSLR', 960, 485, {size: 30, weight: 800, align: 'center'});
    K.text(c, 'stok: ' + (habis ? '0' : '1'), 960, 535, {size: 44, weight: 900, align: 'center', color: habis ? C.coral : C.amber, mono: true});
    [['Permintaan Rafi', C.sky, 140], ['Permintaan Nadia', C.pink, 1240]].forEach(([n, w, x]) => { K.rrect(c, x, 310, 540, 70, 18, w); K.text(c, n, x + 270, 346, {size: 32, weight: 900, align: 'center', color: '#141a2c'}); }); c.restore(); }
  const baris = (kiri, i, t0, teks, hasil, warna) => { const p = muncul(t, t0); if (p <= 0) return; const x = kiri ? 140 : 1240, y = 404 + i * 92; c.save(); c.globalAlpha = p; K.rrect(c, x, y + (1 - p) * 16, 540, 76, 14, 'rgba(255,255,255,.05)', warna, 3);
    K.text(c, teks, x + 24, y + 39, {size: 25, weight: 700, mono: true}); K.text(c, hasil, x + 516, y + 39, {size: 26, weight: 900, align: 'right', color: warna});
    if (i === 0) { if (kiri) K.arrow(c, 760, y + 38, 690, y + 38, warna, 5, p); else K.arrow(c, 1160, y + 38, 1230, y + 38, warna, 5, p); } c.restore(); };
  baris(true, 0, T('rafi'), 'SELECT stok', 'hasilnya 1', C.sky); baris(false, 0, T('nadia'), 'SELECT stok', 'hasilnya 1', C.pink);
  baris(true, 1, T('cukup'), '1 >= 1 ?', 'cukup', C.sky); baris(false, 1, T('cukup') + .5, '1 >= 1 ?', 'cukup', C.pink);
  baris(true, 2, tc, 'INSERT pinjaman', 'tercatat', C.sky); baris(false, 2, tc + .6, 'INSERT pinjaman', 'tercatat', C.pink);
  const p2 = muncul(t, tc + 1.4); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 790, 600, 340, 62, 31, C.coral); K.text(c, '2 pinjaman, 1 kamera', 960, 632, {size: 26, weight: 900, align: 'center', color: '#141a2c'}); c.restore(); }
  const pn = muncul(t, T('nama')); if (pn > 0) { c.save(); c.globalAlpha = pn; const y = 730 + (1 - pn) * 20; K.rrect(c, 140, y, 1640, a.ket ? 190 : 130, 24, 'rgba(255,107,107,.1)', C.coral, 4);
    K.text(c, a.nama, 190, y + 62, {size: 50, weight: 900, color: C.coral}); if (a.ket) K.text(c, a.ket, 190, y + 132, {size: 32, weight: 700, maxW: 1540}); c.restore(); }
  const pa = muncul(t, T('akhir')); if (pa > 0 && a.akhir) { c.save(); c.globalAlpha = pa; K.text(c, a.akhir, 960, 990, {size: 34, weight: 800, align: 'center', color: C.amber}); c.restore(); } };
// Obat race condition: transaksi dan kunci baris (P05)
AD.obat = (c, t, D, a) => { K.bg(c); K.judul(c, 'Dua obat, keduanya disediakan MySQL', t, C.lime);
  const p1 = muncul(t, kt(a, 1)), p4 = muncul(t, kt(a, 4));
  if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 140, 220, 800, 720, 26, 'rgba(255,255,255,.04)', C.teal, 4); K.nomor(c, 1, 200, 284, C.teal); K.text(c, 'Transaksi', 256, 286, {size: 46, weight: 900}); K.text(c, 'beberapa perintah menjadi satu paket', 200, 352, {size: 28, weight: 600, color: C.redup});
    K.rrect(c, 200, 400, 680, 300, 18, '#0d1222', C.teal, 3); ['START TRANSACTION;', '  SELECT stok ...', '  UPDATE alat ...', '  INSERT INTO peminjaman ...', 'COMMIT;'].forEach((s, i) => K.text(c, s, 232, 446 + i * 54, {size: 30, weight: 700, mono: true, color: i === 0 || i === 4 ? C.teal : C.teks}));
    const q2 = muncul(t, kt(a, 2)), q3 = muncul(t, kt(a, 3)); if (q2 > 0) { c.globalAlpha = p1 * q2; K.rrect(c, 200, 730, 680, 76, 16, 'rgba(163,230,53,.1)', C.lime, 3); K.text(c, 'COMMIT: semuanya tersimpan', 232, 769, {size: 30, weight: 800, color: C.lime}); }
    if (q3 > 0) { c.globalAlpha = p1 * q3; K.rrect(c, 200, 826, 680, 76, 16, 'rgba(255,107,107,.1)', C.coral, 3); K.text(c, 'ROLLBACK: semuanya dibatalkan', 232, 865, {size: 30, weight: 800, color: C.coral}); } c.restore(); }
  if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 980, 220, 800, 720, 26, 'rgba(255,255,255,.04)', C.amber, 4); K.nomor(c, 2, 1040, 284, C.amber); K.text(c, 'Kunci baris', 1096, 286, {size: 46, weight: 900}); K.text(c, 'SELECT ... FOR UPDATE', 1040, 352, {size: 30, weight: 800, mono: true, color: C.amber});
    K.rrect(c, 1040, 410, 680, 130, 18, '#0d1222', C.amber, 4); K.kameraIkon(c, 1120, 475, 90); K.text(c, 'Kamera DSLR', 1190, 455, {size: 30, weight: 800}); K.text(c, 'stok: 1', 1190, 500, {size: 28, weight: 800, mono: true, color: C.amber});
    K.rrect(c, 1560, 440, 130, 70, 14, C.amber); K.text(c, 'terkunci', 1625, 476, {size: 22, weight: 900, align: 'center', color: '#141a2c'});
    K.rrect(c, 1040, 580, 680, 84, 16, 'rgba(56,189,248,.12)', C.sky, 3); K.text(c, 'Rafi: memegang kunci, sedang bekerja', 1070, 623, {size: 28, weight: 800});
    const q5 = muncul(t, kt(a, 5)); if (q5 > 0) { c.globalAlpha = p4 * q5; K.rrect(c, 1040, 690, 680, 84, 16, 'rgba(244,114,182,.12)', C.pink, 3); K.text(c, 'Nadia: mengantre sampai Rafi selesai', 1070, 733, {size: 28, weight: 800});
      K.text(c, 'Saat giliran Nadia tiba, stok yang ia baca', 1040, 830, {size: 27, weight: 600, color: C.redup}); K.text(c, 'sudah angka yang terbaru.', 1040, 868, {size: 27, weight: 600, color: C.redup}); } c.restore(); } };
})();
// ---------- adegan generik tambahan: alur, tanyaJawab, aturan ----------
(() => { const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// Alur langkah: a = {judul, sub, warna, langkah: [{k, d, siapa, judul, isi, warna}], kaki: {k, d, teks, warna}}
AD.alur = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul, t, a.warna || C.sky, a.sub);
  const n = a.langkah.length, gw = 56, w = (1640 - (n - 1) * gw) / n, h = a.tinggi || 420, y0 = a.y || 300;
  a.langkah.forEach((L, i) => { const p = muncul(t, kt(a, L.k, L.d || 0)); if (p <= 0) return; const x = 140 + i * (w + gw), y = y0 + (1 - p) * 24, wr = L.warna || [C.sky, C.amber, C.lime, C.teal, C.coral][i % 5];
    c.save(); c.globalAlpha = p; K.rrect(c, x, y, w, h, 22, 'rgba(255,255,255,.05)', wr, 4); K.nomor(c, i + 1, x + 54, y + 60, wr);
    if (L.siapa) K.text(c, L.siapa, x + 104, y + 62, {size: 26, weight: 800, color: wr});
    K.text(c, L.judul, x + 26, y + 150, {size: a.sj || 32, weight: 900, maxW: w - 44, lh: 1.2}); if (L.isi) K.text(c, L.isi, x + 26, y + (a.yi || 290), {size: a.si || 25, weight: 600, color: C.redup, maxW: w - 44, lh: 1.3});
    if (i > 0) K.arrow(c, x - gw + 8, y + h / 2, x - 8, y + h / 2, '#94a3b8', 5, p, 14); c.restore(); });
  if (a.kaki) { const p = muncul(t, kt(a, a.kaki.k, a.kaki.d || 0)); if (p > 0) { c.save(); c.globalAlpha = p; const wr = a.kaki.warna || C.amber; K.rrect(c, 140, y0 + h + 60, 1640, 120, 20, 'rgba(255,176,32,.08)', wr, 4);
    K.text(c, a.kaki.teks, 960, y0 + h + 121, {size: 34, weight: 800, align: 'center'}); c.restore(); } } };
// Tanya jawab: a = {judul, sub, warna, tj: [{kq, q, ka, j, kb, b}]}
AD.tanyaJawab = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul, t, a.warna || C.pink, a.sub);
  const n = a.tj.length, h = Math.min(240, (800 - (n - 1) * 30) / n), y0 = 220 + (800 - (n * h + (n - 1) * 30)) / 2;
  a.tj.forEach((r, i) => { const y = y0 + i * (h + 30), pq = muncul(t, kt(a, r.kq, r.dq || 0)), pj = muncul(t, kt(a, r.ka, r.da || 0)), pb = r.b ? muncul(t, kt(a, r.kb)) : 0;
    if (pq > 0) { c.save(); c.globalAlpha = pq; K.rrect(c, 140 - (1 - pq) * 20, y, 760, h, 22, 'rgba(56,189,248,.07)', C.sky, 4); K.text(c, '?', 196, y + h / 2 + 2, {size: 64, weight: 900, align: 'center', color: C.sky});
      K.text(c, r.q, 250, y + (h - (r.nq || 2) * 44) / 2 + 22, {size: 32, weight: 800, maxW: 620, lh: 1.35}); c.restore(); }
    if (pj > 0) { c.save(); c.globalAlpha = pj; K.arrow(c, 908, y + h / 2, 952, y + h / 2, '#94a3b8', 5, pj, 14); K.rrect(c, 960 + (1 - pj) * 20, y, 820, h, 22, 'rgba(163,230,53,.07)', C.lime, 4);
      K.text(c, r.j, 1000, y + (r.b ? h * .3 : h / 2), {size: 38, weight: 900, color: C.lime, maxW: 750, lh: 1.2}); c.restore(); }
    if (pb > 0) K.text(c, r.b, 1000, y + h * .62, {size: 26, weight: 600, maxW: 750, lh: 1.3, alpha: pb}); }); };
// Empat aturan SiPinjam: a = {judul, k: [k1..k4], kaki: {k, teks}, sorot: indeks aturan yang ditonjolkan (0-3)}
K.ATURAN = [['Stok tidak boleh minus', 'walaupun banyak orang meminjam bersamaan', C.coral], ['Stok berkurang saat diajukan', 'dan kembali saat ditolak, dibatalkan, atau dikembalikan', C.amber],
  ['Denda dihitung dengan rumus yang sama', 'di mana pun ia ditampilkan', C.sky], ['Setiap perubahan tercatat di log', 'siapa, apa, dan kapan', C.violet]];
AD.aturan = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul || 'Empat aturan SiPinjam', t, C.lime, a.sub);
  const h = 138, y0 = 220; K.ATURAN.forEach(([j, s, w], i) => { const p = a.k ? muncul(t, kt(a, a.k[i])) : muncul(t, .4 + i * .4); if (p <= 0) return; const y = y0 + i * (h + 22) + (1 - p) * 20, redup = a.sorot !== undefined && a.sorot !== i;
    c.save(); c.globalAlpha = p * (redup ? .35 : 1); K.rrect(c, 140, y, 1640, h, 20, 'rgba(255,255,255,.05)', w, a.sorot === i ? 6 : 4); K.nomor(c, i + 1, 210, y + h / 2, w);
    K.text(c, j, 280, y + h * .36, {size: 38, weight: 900}); K.text(c, s, 280, y + h * .72, {size: 27, weight: 600, color: C.redup}); c.restore(); });
  if (a.kaki) { const p = muncul(t, kt(a, a.kaki.k, a.kaki.d || 0)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 140, 880, 1640, 120, 20, 'rgba(45,212,191,.1)', C.teal, 4);
    K.text(c, a.kaki.teks, 960, 941, {size: 33, weight: 800, align: 'center'}); c.restore(); } } };
})();
