// Adegan bab "Memasang alat": semua layar digambar dengan kode sebagai aplikasi generik (tanpa logo merek).
(() => {
const C = K.C, T = K.text, S = K.seg, O = K.out, AD = K.adegan;
const mun = (t, t0, d = .5) => O(S(t, t0, t0 + d));
const denyut = (c, x, y, w, h, t, p = 1, r = 14) => { if (p <= 0) return; const g = 8 + 5 * Math.sin(t * 5); c.save(); c.globalAlpha *= p; K.rrect(c, x - g, y - g, w + 2 * g, h + 2 * g, r + g, null, C.amber, 6); c.restore(); };
const ketik = (s, t, t0, cps = 10) => s.slice(0, Math.max(0, Math.floor((t - t0) * cps)));
const kursor = (c, x, y, h, t) => { if (Math.floor(t * 2.5) % 2 === 0) { c.fillStyle = '#1e293b'; c.fillRect(x, y - h / 2, 3, h); } };
const jendela = (c, x, y, w, h, judul, p = 1, o = {}) => { c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 34;
  K.rrect(c, x, y, w, h, 14, o.isi || '#f1f5f9', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 58, 14, o.bar || '#334155'); c.fillStyle = o.bar || '#334155'; c.fillRect(x + 2, y + 34, w - 4, 26);
  T(c, judul, x + 26, y + 30, {size: 26, weight: 800, color: '#f8fafc'});
  T(c, '—   ☐   ✕', x + w - 26, y + 30, {size: 22, weight: 700, align: 'right', color: '#cbd5e1'}); c.restore(); };
const tombol = (c, x, y, w, h, teks, warna = '#2563eb', tw = '#fff') => { K.rrect(c, x, y, w, h, 10, warna, warna === '#e2e8f0' ? '#94a3b8' : null, 2); T(c, teks, x + w / 2, y + h / 2 + 1, {size: Math.min(30, h * .44), weight: 800, align: 'center', color: tw}); };
const chip = (c, teks, t, t0 = .3, ket = 'Alamat situs') => { const p = mun(t, t0); if (p <= 0) return; const w = Math.max(700, K.lebar(c, teks, 56, 800, true) + 330), x = (1920 - w) / 2, y = 916 + (1 - p) * 24;
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 26; K.rrect(c, x, y, w, 120, 22, '#0d1222', C.amber, 4); c.shadowColor = 'transparent';
  K.rrect(c, x + 22, y + 22, 230, 76, 14, C.amber); T(c, ket, x + 137, y + 61, {size: 26, weight: 900, align: 'center', color: '#141a2c'});
  T(c, teks, x + 280, y + 62, {size: 56, weight: 800, mono: true}); c.restore(); };
const centang = (c, x, y, r, p, warna = '#22c55e') => { if (p <= 0) return; c.save(); c.globalAlpha *= p; c.fillStyle = warna; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.strokeStyle = '#fff'; c.lineWidth = r * .22; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x - r * .45, y + r * .02); c.lineTo(x - r * .1, y + r * .38); c.lineTo(x + r * .48, y - r * .32); c.stroke(); c.restore(); };

const ALAT = [['Blender', 'Tempat film dibangun dan dirender.', 'amber'], ['Git', 'Menyimpan riwayat pekerjaan.', 'coral'], ['VS Code', 'Tempat membuka dan membaca kode.', 'sky'], ['FFmpeg', 'Menggabungkan gambar, suara, dan teks menjadi video.', 'lime'], ['Claude Code', 'Asisten AI yang menulis kodenya.', 'violet']];
// daftar lima alat. a.wkt = detik muncul tiap alat (bawaan: merata); a.cek: centang hijau menyala satu per satu; a.aktif: alat yang disorot
AD.alat = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul || 'Lima alat yang kita pasang', t, C.amber, a.sub);
  ALAT.forEach(([n, k, w], i) => { const t0 = a.wkt ? a.wkt[i] : a.cek ? .2 + i * .08 : .5 + i * (D * .62 / 5), p = mun(t, t0), y = 250 + i * 142, wr = C[w] || C.amber;
    c.save(); c.globalAlpha = p * (a.aktif != null && a.aktif !== i ? .4 : 1); K.rrect(c, 160 + (1 - p) * 30, y, 1600, 120, 20, 'rgba(255,255,255,.06)', a.aktif === i ? wr : null, 4); K.rrect(c, 160 + (1 - p) * 30, y, 14, 120, 7, wr);
    T(c, String(i + 1), 232, y + 62, {size: 48, weight: 900, color: wr, align: 'center'}); T(c, n, 300, y + 62, {size: 46, weight: 800}); T(c, k, 640, y + 62, {size: 34, weight: 500, color: C.redup}); c.restore();
    if (a.cek) centang(c, 1690, y + 60, 36, mun(t, .8 + i * Math.min(1.1, (D - 2.5) / 5), .35)); });
  if (a.cap) { const p = mun(t, D * .72); c.save(); c.globalAlpha = p; T(c, a.cap, 960, 1000, {size: 34, weight: 600, align: 'center', color: C.redup}); c.restore(); } };

// browser generik: alamat diketik, menu Download disorot, lalu tombol unduh disorot. a.url, a.merek, a.ket, a.tombol, a.menu
AD.situs = (c, t, D, a) => { K.bg(c); const x = 260, y = 70, w = 1400, h = 790, p = mun(t, .1);
  c.save(); c.globalAlpha = p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 34; K.rrect(c, x, y, w, h, 16, '#f8fafc', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 84, 16, '#dbe2ee'); c.fillStyle = '#dbe2ee'; c.fillRect(x + 2, y + 50, w - 4, 36);
  T(c, '←   →   ⟳', x + 30, y + 42, {size: 28, weight: 700, color: '#64748b'}); K.rrect(c, x + 210, y + 16, w - 250, 52, 26, '#fff', '#b6c2d6', 2);
  const tk = .7, u = a.langsung ? a.url : ketik(a.url, t, tk, 9), sel = a.langsung ? 0 : tk + a.url.length / 9;
  T(c, u, x + 240, y + 43, {size: 30, weight: 700, mono: true, color: '#1e293b'}); if (t < sel + .4) kursor(c, x + 244 + K.lebar(c, u, 30, 700, true), y + 43, 34, t);
  if (!a.langsung && t < sel) denyut(c, x + 210, y + 16, w - 250, 52, t, 1, 26);
  const q = mun(t, sel + .5); c.globalAlpha = p * q;
  if (q > 0) { c.fillStyle = a.gelap || '#1e293b'; c.fillRect(x + 2, y + 86, w - 4, 80); T(c, a.merek, x + 50, y + 127, {size: 36, weight: 900, color: '#fff'});
    (a.nav || ['Features', 'Download', 'Support']).forEach((s, i) => T(c, s, x + w - 560 + i * 180, y + 127, {size: 26, weight: 700, color: '#e2e8f0'}));
    T(c, a.judulHal || a.merek, x + w / 2, y + 290, {size: 60, weight: 900, align: 'center', color: '#0f172a'});
    T(c, a.ket || '', x + w / 2, y + 370, {size: 30, weight: 500, align: 'center', color: '#475569', maxW: w - 200});
    const bw = Math.max(480, K.lebar(c, a.tombol, 34, 800) + 110), bx = x + (w - bw) / 2, by = y + 470; tombol(c, bx, by, bw, 96, a.tombol, a.warna || '#2563eb');
    if (a.sub) T(c, a.sub, x + w / 2, by + 140, {size: 24, weight: 500, align: 'center', color: '#64748b'});
    const t1 = sel + 1.4, t2 = a.menu === false ? t1 : t1 + Math.min(3, (D - t1) * .35);
    if (a.menu !== false && t >= t1 && t < t2) denyut(c, x + w - 580, y + 100, 170, 54, t, q);
    if (t >= t2) denyut(c, bx, by, bw, 96, t, mun(t, t2, .3)); }
  c.restore(); chip(c, a.url, t, .3); };

// jendela penginstal. a.judul, a.teks, a.opsi = [[label, dicentang], ...], a.akhir
AD.pasang = (c, t, D, a) => { K.bg(c); const x = 410, y = 120, w = 1100, h = 720, p = mun(t, .1); jendela(c, x, y, w, h, a.judul, p);
  c.save(); c.globalAlpha = p; T(c, a.kepala || 'Setup', x + 50, y + 120, {size: 40, weight: 900, color: '#0f172a'}); T(c, a.teks || '', x + 50, y + 180, {size: 27, weight: 500, color: '#475569', maxW: w - 100, lh: 1.4});
  const op = a.opsi || [], lg = Math.max(1.2, (D - 3) / Math.max(1, op.filter(o => o[1]).length + 1)); let k = 0;
  op.forEach(([s, on], i) => { const yy = y + 290 + i * 74; K.rrect(c, x + 60, yy - 19, 38, 38, 6, '#fff', '#64748b', 3); T(c, s, x + 120, yy + 1, {size: 29, weight: 600, color: '#1e293b'});
    if (on) { const t0 = 1.2 + k * lg; k++; if (t >= t0 - .9 && t < t0 + lg - .9) denyut(c, x + 50, yy - 30, w - 100, 60, t, 1, 10); centang(c, x + 79, yy, 17, mun(t, t0, .25), '#16a34a'); } });
  if (!op.length) { K.rrect(c, x + 60, y + 330, w - 120, 34, 8, '#e2e8f0'); K.rrect(c, x + 60, y + 330, (w - 120) * O(S(t, 1, D - 2.5)), 34, 8, '#22c55e'); }
  c.fillStyle = '#cbd5e1'; c.fillRect(x + 2, y + h - 100, w - 4, 2); tombol(c, x + w - 420, y + h - 76, 180, 54, '< Back', '#e2e8f0', '#475569'); tombol(c, x + w - 220, y + h - 76, 180, 54, a.akhir ? 'Finish' : 'Next >');
  const tn = op.length ? 1.2 + k * lg : D - 2.5; if (t >= tn) denyut(c, x + w - 220, y + h - 76, 180, 54, t, mun(t, tn, .3)); c.restore();
  if (a.cap) { const q = mun(t, .6); c.save(); c.globalAlpha = q; T(c, a.cap, 960, 960, {size: 36, weight: 700, align: 'center'}); c.restore(); } };

// File Explorer generik. a.path, a.isi = [[nama, 'folder'|'file'], ...], a.sorot, a.salin (sorot kolom alamat), a.menu = [..], a.menuSorot, a.baru (nama folder baru diketik)
AD.explorer = (c, t, D, a) => { K.bg(c); const x = 310, y = 110, w = 1300, h = 760, p = mun(t, .1); jendela(c, x, y, w, h, 'File Explorer', p);
  c.save(); c.globalAlpha = p; K.rrect(c, x + 30, y + 80, w - 60, 56, 8, '#fff', '#94a3b8', 2); T(c, a.path, x + 54, y + 109, {size: 28, weight: 600, mono: true, color: '#1e293b'});
  const ts = a.tsalin ?? D * .55; if (a.salin && t >= ts) { denyut(c, x + 30, y + 80, w - 60, 56, t, mun(t, ts, .3), 8); const q = mun(t, ts + 1.2); c.globalAlpha = p * q; K.rrect(c, x + w - 330, y + 150, 300, 56, 10, '#0f172a'); T(c, 'Ctrl + C  ·  disalin', x + w - 180, y + 179, {size: 24, weight: 700, align: 'center', color: '#fff'}); c.globalAlpha = p; }
  (a.isi || []).forEach(([n, jenis], i) => { const yy = y + 190 + i * 76, on = a.sorot === i && t >= (a.tsorot ?? 1.2);
    if (on) K.rrect(c, x + 30, yy - 32, w - 60, 64, 8, '#dbeafe', '#2563eb', 2);
    if (jenis === 'file') { K.rrect(c, x + 60, yy - 22, 36, 44, 4, '#fff', '#64748b', 3); } else { K.rrect(c, x + 56, yy - 18, 46, 36, 5, '#f59e0b'); K.rrect(c, x + 56, yy - 26, 22, 12, 4, '#f59e0b'); }
    const nm = a.baru === i ? ketik(n, t, 1.4, 8) : n; T(c, nm, x + 126, yy + 1, {size: 30, weight: 600, color: '#1e293b'}); if (a.baru === i && t > 1 && t < 1.8 + n.length / 8) kursor(c, x + 130 + K.lebar(c, nm, 30, 600), yy, 34, t);
    if (on && a.denyut !== false && !a.menu) denyut(c, x + 30, yy - 32, w - 60, 64, t, 1, 8); });
  if (a.menu) { const tm = a.tmenu ?? D * .4, q = mun(t, tm, .25); if (q > 0) { const mx = x + 520, my = y + 190 + (a.sorot || 0) * 76 + 10, mw = 460, mh = a.menu.length * 62 + 20; c.globalAlpha = p * q; c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 24; K.rrect(c, mx, my, mw, mh, 10, '#fff', '#94a3b8', 2); c.shadowColor = 'transparent';
      a.menu.forEach((s, i) => { const yy = my + 41 + i * 62, on = a.menuSorot === i && t >= tm + 1.2; if (on) K.rrect(c, mx + 8, yy - 28, mw - 16, 56, 8, '#dbeafe'); T(c, s, mx + 34, yy + 1, {size: 28, weight: on ? 800 : 600, color: '#1e293b'}); if (on) denyut(c, mx + 8, yy - 28, mw - 16, 56, t, 1, 8); }); } }
  c.restore(); if (a.cap) { const q = mun(t, .6); c.save(); c.globalAlpha = q; T(c, a.cap, 960, 960, {size: 36, weight: 700, align: 'center'}); c.restore(); } };

// menu Start: kata diketik, hasil disorot. a.ketik, a.hasil, a.jenis
AD.start = (c, t, D, a) => { K.bg(c); const x = 460, y = 150, w = 1000, h = 640, p = mun(t, .1); c.save(); c.globalAlpha = p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 34; K.rrect(c, x, y, w, h, 22, '#eef2f7', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x + 40, y + 40, w - 80, 70, 35, '#fff', '#2563eb', 3); const u = ketik(a.ketik, t, .8, 7), sel = .8 + a.ketik.length / 7; T(c, '⌕', x + 70, y + 75, {size: 36, weight: 700, color: '#64748b'}); T(c, u, x + 120, y + 76, {size: 34, weight: 600, color: '#1e293b'}); if (t < sel + .4) kursor(c, x + 124 + K.lebar(c, u, 34, 600), y + 76, 38, t);
  const q = mun(t, sel + .3); c.globalAlpha = p * q; T(c, 'Best match', x + 50, y + 170, {size: 24, weight: 700, color: '#64748b'}); K.rrect(c, x + 40, y + 200, w - 80, 110, 12, '#dbeafe'); K.rrect(c, x + 64, y + 222, 66, 66, 12, '#334155');
  T(c, a.hasil, x + 156, y + 240, {size: 32, weight: 800, color: '#0f172a'}); T(c, a.jenis || 'Control panel', x + 156, y + 284, {size: 24, weight: 500, color: '#475569'});
  if (t >= sel + 1.4) denyut(c, x + 40, y + 200, w - 80, 110, t, q, 12); c.restore();
  T(c, 'Menu Start', 960, 90, {size: 34, weight: 700, align: 'center', color: C.redup}); if (a.cap) { const r = mun(t, .6); c.save(); c.globalAlpha = r; T(c, a.cap, 960, 900, {size: 36, weight: 700, align: 'center'}); c.restore(); } };

// jendela Environment Variables. a.langkah: 0 = pilih Path lalu Edit; 1 = New, tempel alamat, OK
AD.envpath = (c, t, D, a) => { K.bg(c); const x = 360, y = 90, w = 1200, h = 800, p = mun(t, .1), L = a.langkah || 0; jendela(c, x, y, w, h, L ? 'Edit environment variable' : 'Environment Variables', p);
  c.save(); c.globalAlpha = p; const baris = (s, v, i, on) => { const yy = y + 190 + i * 66; if (on) K.rrect(c, x + 44, yy - 29, w - 240, 58, 6, '#dbeafe', '#2563eb', 2); T(c, s, x + 64, yy + 1, {size: 27, weight: 600, mono: true, color: '#1e293b'}); if (v) T(c, v, x + 330, yy + 1, {size: 25, weight: 500, mono: true, color: '#475569'}); return yy; };
  K.rrect(c, x + 40, y + 150, w - 230, 500, 8, '#fff', '#94a3b8', 2);
  if (!L) { T(c, 'User variables', x + 44, y + 112, {size: 28, weight: 800, color: '#0f172a'}); baris('OneDrive', 'C:\\Users\\kamu\\OneDrive', 0); const t1 = D * .3, yy = baris('Path', 'C:\\Users\\kamu\\AppData\\Local\\...', 1, t >= t1); baris('TEMP', 'C:\\Users\\kamu\\AppData\\Local\\Temp', 2);
    ['New...', 'Edit...', 'Delete'].forEach((s, i) => tombol(c, x + w - 170, y + 160 + i * 74, 140, 56, s, '#e2e8f0', '#1e293b'));
    const t2 = D * .62; if (t >= t1 && t < t2) denyut(c, x + 44, yy - 29, w - 240, 58, t, 1, 6); if (t >= t2) denyut(c, x + w - 170, y + 234, 140, 56, t, 1, 10); }
  else { baris('C:\\Users\\kamu\\AppData\\Local\\Microsoft\\WindowsApps', '', 0); ['New', 'Edit', 'Browse...'].forEach((s, i) => tombol(c, x + w - 170, y + 160 + i * 74, 140, 56, s, '#e2e8f0', '#1e293b'));
    const t1 = D * .12, t2 = D * .3, t3 = D * .68; if (t >= t1 && t < t2) denyut(c, x + w - 170, y + 160, 140, 56, t, 1, 10);
    if (t >= t2) { const s = a.alamat.slice(0, t < t2 + .5 ? 0 : 999), yy = baris(s, '', 1, true); if (t < t3) denyut(c, x + 44, yy - 29, w - 240, 58, t, 1, 6); if (t >= t2 + .5 && t < t2 + 3) { K.rrect(c, x + w - 520, yy + 44, 330, 54, 10, '#0f172a'); T(c, 'Ctrl + V  ·  ditempel', x + w - 355, yy + 72, {size: 24, weight: 700, align: 'center', color: '#fff'}); } }
    if (t >= t3) denyut(c, x + w - 370, y + h - 86, 150, 56, t, 1, 10); }
  tombol(c, x + w - 370, y + h - 86, 150, 56, 'OK'); tombol(c, x + w - 200, y + h - 86, 150, 56, 'Cancel', '#e2e8f0', '#1e293b'); c.restore();
  if (a.cap) { const r = mun(t, .6); c.save(); c.globalAlpha = r; T(c, a.cap, 960, 970, {size: 36, weight: 700, align: 'center'}); c.restore(); } };

// jendela terminal. a.baris = [{cmd, out: [teks | [teks, warna]], at?}], a.judul, a.cps, a.prompt
const gambarTerm = (c, x, y, w, h, t, D, a, p = 1) => { const size = a.size || 34, lh = size * 1.65, cps = a.cps || 9, B = a.baris, n = B.length;
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 34; K.rrect(c, x, y, w, h, 14, '#0a0f1e', '#3b4a75', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 56, 14, '#1b2440'); c.fillStyle = '#1b2440'; c.fillRect(x + 2, y + 32, w - 4, 26); T(c, a.judul || 'Terminal', x + 26, y + 29, {size: 24, weight: 700, color: '#cbd5e1'}); T(c, '—   ☐   ✕', x + w - 26, y + 29, {size: 20, weight: 700, align: 'right', color: '#64748b'});
  c.beginPath(); c.rect(x, y + 58, w, h - 60); c.clip(); let yy = y + 58 + 30 + lh / 2;
  B.forEach((b, i) => { const at = b.at ?? (.8 + i * (D - 1) / n); if (t < at) return; const pr = a.prompt ?? 'PS C:\\Users\\kamu> ', s = ketik(b.cmd, t, at, cps), sel = at + b.cmd.length / cps;
    T(c, pr, x + 30, yy, {size, weight: 600, mono: true, color: '#7dd3fc'}); const px = x + 30 + K.lebar(c, pr, size, 600, true); T(c, s, px, yy, {size, weight: 700, mono: true, color: '#fff'});
    if (t < sel + .3 && Math.floor(t * 2.5) % 2 === 0) { c.fillStyle = '#e6e9f2'; c.fillRect(px + K.lebar(c, s, size, 700, true) + 3, yy - size * .55, size * .5, size * 1.1); }
    if (a.sorot === i && t >= at) K.rrect(c, x + 12, yy - lh / 2 + 2, w - 24, lh - 4, 8, 'rgba(255,176,32,.14)', C.amber, 3);
    yy += lh; if (t >= sel + (b.jeda ?? 1.1)) (b.out || []).forEach(u => { const [o, wr] = Array.isArray(u) ? u : [u, '#aab4d0']; T(c, o, x + 30, yy, {size: size - 3, weight: 500, mono: true, color: wr}); yy += lh * .92; }); yy += lh * .25; });
  c.restore(); };
AD.terminal = (c, t, D, a) => { K.bg(c); const h = a.h || 640; gambarTerm(c, 160, a.y || 150, 1600, h, t, D, a, mun(t, .1));
  if (a.kepala) T(c, a.kepala, 960, 84, {size: 40, weight: 800, align: 'center'}); if (a.cap) { const r = mun(t, .6); c.save(); c.globalAlpha = r; T(c, a.cap, 960, (a.y || 150) + h + 90, {size: 36, weight: 700, align: 'center', maxW: 1700}); c.restore(); } };

// editor kode generik: menu Terminal > New Terminal, panel terminal muncul di bawah, perintah diketik. a.folder, a.cmd, a.out
AD.editor = (c, t, D, a) => { K.bg(c); const x = 210, y = 70, w = 1500, h = 860, p = mun(t, .1); c.save(); c.globalAlpha = p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 34; K.rrect(c, x, y, w, h, 14, '#1e1e1e', '#3b4a75', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 56, 14, '#2d2d30'); c.fillStyle = '#2d2d30'; c.fillRect(x + 2, y + 30, w - 4, 28); const M = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help']; let mx = x + 30, tx = 0;
  M.forEach(s => { if (s === 'Terminal') tx = mx; T(c, s, mx, y + 29, {size: 24, weight: 600, color: '#d4d4d4'}); mx += K.lebar(c, s, 24, 600) + 36; });
  c.fillStyle = '#252526'; c.fillRect(x + 2, y + 58, 330, h - 60); T(c, 'EXPLORER', x + 26, y + 96, {size: 20, weight: 700, color: '#9da5b4'}); T(c, '⌄ ' + a.folder.toUpperCase(), x + 26, y + 140, {size: 22, weight: 800, color: '#d4d4d4'});
  const t1 = D * .12, t2 = D * .3, t3 = D * .48, tw = K.lebar(c, 'Terminal', 24, 600);
  if (t >= t1 && t < t3) { K.rrect(c, tx - 12, y + 8, tw + 24, 42, 6, '#094771'); T(c, 'Terminal', tx, y + 29, {size: 24, weight: 600, color: '#fff'}); if (t < t2) denyut(c, tx - 12, y + 8, tw + 24, 42, t, 1, 6); }
  if (t >= t2 && t < t3) { K.rrect(c, tx - 12, y + 58, 380, 190, 8, '#252526', '#454545', 2); ['New Terminal', 'Split Terminal', 'Run Task...'].forEach((s, i) => { if (!i) K.rrect(c, tx - 6, y + 68, 368, 52, 6, '#094771'); T(c, s, tx + 12, y + 95 + i * 58, {size: 25, weight: 600, color: i ? '#cccccc' : '#fff'}); }); denyut(c, tx - 6, y + 68, 368, 52, t, 1, 6); }
  if (t >= t3) { const q = mun(t, t3, .35), py = y + h - 330 * q; c.fillStyle = '#181818'; c.fillRect(x + 332, py, w - 334, y + h - py - 2); c.fillStyle = '#3c3c3c'; c.fillRect(x + 332, py, w - 334, 2);
    T(c, 'PROBLEMS     OUTPUT     TERMINAL', x + 360, py + 34, {size: 20, weight: 700, color: '#9da5b4'}); const pr = `PS ...\\Documents\\${a.folder}> `, tk = t3 + (D - t3) * .35, s = ketik(a.cmd || '', t, tk, 7);
    T(c, pr, x + 360, py + 96, {size: 28, weight: 600, mono: true, color: '#7dd3fc'}); const px = x + 360 + K.lebar(c, pr, 28, 600, true); T(c, s, px, py + 96, {size: 28, weight: 700, mono: true, color: '#fff'});
    if (Math.floor(t * 2.5) % 2 === 0) { c.fillStyle = '#e6e9f2'; c.fillRect(px + K.lebar(c, s, 28, 700, true) + 3, py + 80, 14, 32); }
    if (a.out && t >= tk + (a.cmd || '').length / 7 + 1) T(c, a.out, x + 360, py + 146, {size: 25, weight: 500, mono: true, color: '#aab4d0'}); }
  c.restore(); if (a.cap) { const r = mun(t, .6); c.save(); c.globalAlpha = r; T(c, a.cap, 960, 990, {size: 34, weight: 700, align: 'center'}); c.restore(); } };

// tiga kartu error: pesan asli di kiri, solusi di kanan. a.kartu = [[pesan, solusi], ...]; a.aktif
AD.galat = (c, t, D, a) => { K.bg(c); K.judul(c, a.judul || 'Tiga error yang paling sering muncul', t, '#ff6b6b');
  a.kartu.forEach(([e, s, perintah], i) => { const y = 250 + i * 250, t0 = a.wkt ? a.wkt[i] : .5 + i * D / a.kartu.length * .9, p = mun(t, t0), on = a.wkt ? (t >= t0 && (i === a.kartu.length - 1 || t < a.wkt[i + 1])) : true;
    c.save(); c.globalAlpha = p * (on ? 1 : .45); K.rrect(c, 120, y, 800, 220, 16, '#0a0f1e', '#ff6b6b', 3); T(c, String(i + 1), 160, y + 44, {size: 34, weight: 900, color: '#ff6b6b'}); T(c, e, 160, y + 124, {size: 27, weight: 600, mono: true, color: '#fca5a5', maxW: 720, lh: 1.4});
    K.arrow && T(c, '→', 960, y + 110, {size: 50, weight: 900, align: 'center', color: C.amber});
    K.rrect(c, 1000, y, 800, 220, 16, 'rgba(255,255,255,.06)', '#22c55e', 3); T(c, s, 1040, y + (perintah ? 70 : 110), {size: 30, weight: 700, maxW: 720, lh: 1.35}); if (perintah) { K.rrect(c, 1030, y + 136, 740, 60, 10, '#0a0f1e'); T(c, perintah, 1050, y + 167, {size: 22, weight: 700, mono: true, color: '#a3e635'}); } c.restore(); }); };
})();
