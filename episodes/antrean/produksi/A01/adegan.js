// A01 Kebutuhan
(() => {
const C = K.C, S = K.seg, O = K.out;
// ---------- diagram status (dipakai b08, b09) ----------
const N = {M: [330, 430, 'Menunggu', C.sky], P: [800, 430, 'Dipanggil', C.amber], L: [1270, 430, 'Dilayani', C.teal], S: [1690, 430, 'Selesai', C.lime],
  W: [800, 760, 'Dilewati', C.coral], B: [330, 760, 'Batal', '#94a3b8']};
const E = {MP: ['M', 'P'], PL: ['P', 'L'], LS: ['L', 'S'], PW: ['P', 'W'], WP: ['W', 'P'], MB: ['M', 'B']};
function ujung(a, b, geser = 0) { const [x1, y1] = N[a], [x2, y2] = N[b]; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  const ox = -dy / L * geser, oy = dx / L * geser; const rx = Math.abs(dx) > 1 ? 150 : 60, ry = Math.abs(dy) > 1 ? 58 : 0;
  const kx = dx / L, ky = dy / L; const m = Math.abs(dx) > 1 ? 150 : 58;
  return [x1 + kx * m + ox, y1 + ky * m + oy, x2 - kx * m + ox, y2 - ky * m + oy]; }
K.diagramStatus = (c, pn, pe, o = {}) => { // pn[node] dan pe[edge] = progres 0..1
  for (const k in E) { const p = pe[k] ?? 0; if (p <= 0) continue; const g = k === 'PW' ? -28 : k === 'WP' ? -28 : 0;
    const [x1, y1, x2, y2] = ujung(...E[k], k === 'PW' ? 30 : k === 'WP' ? 30 : 0);
    K.arrow(c, x1, y1, x2, y2, (o.warnaEdge && o.warnaEdge[k]) || '#cbd5e1', (o.warnaEdge && o.warnaEdge[k]) ? 10 : 6, O(p), 24); }
  for (const k in N) { const p = pn[k] ?? 0; if (p <= 0) continue; const [x, y, nama, w] = N[k];
    c.save(); c.globalAlpha *= O(p); const s = K.lerp(.8, 1, K.back(p)); c.translate(x, y); c.scale(s, s);
    const on = o.sorot === k; K.rrect(c, -140, -54, 280, 108, 54, on ? w : 'rgba(255,255,255,.05)', w, 5);
    K.text(c, nama, 0, 3, {size: 40, weight: 800, align: 'center', color: on ? '#0e1424' : C.teks}); c.restore(); }
};
K.tokenTiket = (c, jalur, q, label = 'A-012') => { // jalur: daftar node, q 0..1 sepanjang jalur
  if (q < 0) return; const n = jalur.length - 1, f = K.clamp(q) * n, i = Math.min(n - 1, Math.floor(f)), k = K.ease(f - i);
  const [x1, y1] = N[jalur[i]], [x2, y2] = N[jalur[i + 1]]; const x = K.lerp(x1, x2, k), y = K.lerp(y1, y2, k) - 110;
  K.tiketKertas(c, x, y, label, {w: 150, h: 86});
};
const AD = K.adegan;
AD.bengkel = (c, t, D) => {
  K.bg(c); K.judul(c, 'Bengkel Maju Jaya', t, C.amber, 'Setiap pagi, ruang tunggu penuh');
  // gedung
  const p0 = O(S(t, .2, 1)); c.save(); c.globalAlpha = p0;
  K.rrect(c, 760, 300, 1060, 560, 18, '#1c2747', '#334155', 4); K.rrect(c, 820, 250, 940, 90, 16, C.amber);
  K.text(c, 'BENGKEL MAJU JAYA', 1290, 297, {size: 46, weight: 900, align: 'center', color: '#141a2c'});
  K.rrect(c, 1450, 430, 330, 430, 10, '#0f172a', '#475569', 3); for (let i = 0; i < 6; i++) c.fillRect(1460, 450 + i * 66, 310, 6);
  K.motor(c, 1610, 860, 210, C.coral);
  // bangku dan pelanggan
  K.rrect(c, 800, 760, 600, 26, 8, '#475569');
  const n = 6; for (let i = 0; i < n; i++) { const pergi = i === 1 ? S(t, D * .72, D * .9) : 0; const x = 850 + i * 95 - pergi * 900;
    K.orang(c, x, 780, 160, [C.sky, C.pink, C.violet, C.teal, C.lime, C.amber][i], {alpha: 1 - pergi * .9, ekspresi: i === 1 && t > D * .55 ? 'kesal' : ''}); }
  // jam dinding berputar
  c.strokeStyle = C.teks; c.lineWidth = 6; c.beginPath(); c.arc(1100, 440, 70, 0, 7); c.stroke();
  const a = t * 2.4; c.beginPath(); c.moveTo(1100, 440); c.lineTo(1100 + Math.cos(a) * 52, 440 + Math.sin(a) * 52); c.stroke();
  c.beginPath(); c.moveTo(1100, 440); c.lineTo(1100 + Math.cos(a / 12) * 34, 440 + Math.sin(a / 12) * 34); c.stroke();
  c.restore();
  // Pak Rahmat + buku antrean
  const p1 = O(S(t, .5, 1.3)); c.save(); c.globalAlpha = p1; K.orang(c, 300, 900, 400, '#1d4ed8', {topi: '#ef4444', kumis: true});
  K.text(c, 'Pak Rahmat', 300, 960, {size: 34, weight: 800, align: 'center'}); c.restore();
  const p2 = O(S(t, D * .2, D * .2 + .6)); if (p2 > 0) { c.save(); c.globalAlpha = p2;
    K.rrect(c, 450, 600, 290, 260, 14, '#fef3c7', '#d6b56b', 3); K.text(c, 'Buku antrean', 595, 642, {size: 24, weight: 800, align: 'center', color: '#8a6d3b'});
    ['1. Budi - oli', '2. Sari - servis', '3. Andi - oli', '4. ...'].forEach((s, i) => K.text(c, s, 478, 690 + i * 40, {size: 24, weight: 600, color: '#3b2f1d'}));
    c.restore(); }
  const p3 = O(S(t, D * .32, D * .32 + .5)) * (1 - S(t, D * .55, D * .6)); if (p3 > 0) { c.save(); c.globalAlpha = p3;
    K.rrect(c, 760, 150, 520, 84, 42, '#fff', null); K.text(c, 'Sudah sampai mana, Pak?', 1020, 193, {size: 34, weight: 800, align: 'center', color: '#1e293b'}); c.restore(); }
  const p4 = O(S(t, D * .78, D * .86)); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.text(c, '− Rp', 150, 400, {size: 70, weight: 900, color: C.coral}); c.restore(); }
};
AD.pertanyaan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Pertanyaan yang baik', t, C.pink, 'Tanyakan pekerjaannya, bukan aplikasinya');
  const pb = O(S(t, .3, .9)), cr = S(t, D * .2, D * .27), hilang = S(t, D * .3, D * .36);
  if (hilang < 1) { c.save(); c.globalAlpha = pb * (1 - hilang);
    K.kartu(c, 300, 300, 1320, 160, null, '“Bapak mau aplikasi seperti apa?”', {warna: C.coral, size: 48});
    const pj = O(S(t, D * .1, D * .15)); c.globalAlpha *= pj; K.rrect(c, 1080, 500, 460, 100, 50, '#fff'); K.text(c, '“Yang bagus saja.”', 1310, 550, {size: 40, weight: 800, align: 'center', color: '#1e293b'});
    c.restore(); K.coret(c, 320, 380, 1600, 380, cr * (1 - hilang)); }
  const Q = ['Ceritakan apa yang terjadi sejak pelanggan datang sampai motornya selesai.', 'Apa yang paling sering membuat Bapak pusing?', 'Apa yang terjadi kalau pelanggan dipanggil, tetapi orangnya tidak ada?'];
  const mulai = [.4, .62, .77];
  Q.forEach((q, i) => K.kartu(c, 220, 250 + i * 240, 1480, 200, `Pertanyaan ${i + 1}`, q, {warna: C.teal, p: S(t, D * mulai[i], D * mulai[i] + .6), size: 40}));
};
AD.fakta = (c, t, D) => {
  K.bg(c); K.judul(c, 'Hasil wawancara', t, C.teal, 'Fakta penting dari Pak Rahmat');
  const it = [[.12, 'Tiga layanan, bisa di loket berbeda'], [.38, 'Datang langsung, atau pesan jam dulu'], [.6, 'Dipanggil tapi tidak ada: dilewati, boleh dipanggil ulang'], [.82, 'Ingin tahu jam paling ramai']];
  it.forEach(([m, s], i) => { const p = S(t, D * m, D * m + .6); if (p <= 0) return; const y = 260 + i * 190;
    c.save(); c.globalAlpha = O(p); K.panel(c, 140, y, 1640, 160, 1, [C.amber, C.sky, C.coral, C.lime][i]);
    const x = 280, yy = y + 80;
    if (i === 0) ['A', 'B', 'C'].forEach((h, j) => { K.rrect(c, 190 + j * 0, 0, 0, 0, 0); });
    if (i === 0) { ['A', 'B', 'C'].forEach((h, j) => { K.rrect(c, 180 + j * 62, yy - 26, 52, 52, 12, [C.amber, C.sky, C.violet][j]); K.text(c, h, 206 + j * 62, yy + 2, {size: 30, weight: 900, align: 'center', color: '#0e1424'}); }); }
    if (i === 1) { K.orang(c, 220, yy + 50, 100, C.sky); K.rrect(c, 270, yy - 34, 66, 66, 10, null, C.teks, 4); c.fillStyle = C.teks; c.fillRect(270, yy - 34, 66, 16); }
    if (i === 2) { K.tiketKertas(c, 250, yy, 'A-07', {w: 130, h: 80}); K.arrow(c, 330, yy, 370, yy, C.coral, 5, 1, 14); }
    if (i === 3) { [30, 70, 55, 25].forEach((h, j) => K.rrect(c, 190 + j * 40, yy + 40 - h, 30, h, 4, j === 1 ? C.coral : C.lime)); }
    K.text(c, s, 400, yy, {size: 44, weight: 700}); c.restore(); });
};
AD.storyKartu = (c, t, D) => {
  K.bg(c); K.judul(c, 'User story', t, C.violet, 'Sebagai siapa, aku ingin apa, supaya apa');
  const bag = [['Sebagai', 'siapa?', C.sky], ['aku ingin', 'apa?', C.amber], ['supaya', 'kenapa?', C.lime]];
  bag.forEach(([a, b, w], i) => { const p = S(t, .5 + i * D * .1, 1.1 + i * D * .1); if (p <= 0) return; const x = 160 + i * 540;
    c.save(); c.globalAlpha = O(p); let s = 1; if (i === 2 && t > D * .4) s = 1 + .04 * Math.sin((t - D * .4) * 6) * (1 - S(t, D * .85, D));
    c.translate(x + 250, 560); c.scale(s, s); c.translate(-(x + 250), -560);
    K.rrect(c, x, 380, 500, 360, 26, 'rgba(255,255,255,.04)', w, i === 2 && t > D * .4 ? 8 : 5);
    K.text(c, a, x + 250, 480, {size: 54, weight: 900, align: 'center', color: w}); K.text(c, b, x + 250, 600, {size: 48, weight: 600, align: 'center', color: C.redup}); c.restore(); });
  const p = O(S(t, D * .45, D * .45 + .6)); if (p > 0) K.text(c, 'Alasannya tetap, caranya boleh berganti.', 960, 860, {size: 44, weight: 700, align: 'center', alpha: p, color: C.lime});
};
AD.papanStory = (c, t, D) => {
  K.bg(c); K.judul(c, 'Contoh user story', t, C.violet);
  const kol = [['Pelanggan', C.sky, 'Sebagai pelanggan, aku ingin melihat posisi antreanku di HP, supaya aku bisa menunggu di warung sebelah tanpa takut terlewat.'],
    ['Petugas', C.amber, 'Sebagai petugas loket, aku ingin memanggil pelanggan berikutnya dengan satu tombol, supaya aku tidak perlu berteriak.'],
    ['Pemilik', C.lime, 'Sebagai pemilik, aku ingin melihat jam tersibuk, supaya aku bisa mengatur jadwal mekanik.']];
  const m = [.12, .42, .72];
  kol.forEach(([n, w, s], i) => { const x = 130 + i * 570; c.save(); c.globalAlpha = O(S(t, .2, .8));
    K.rrect(c, x, 220, 520, 760, 22, 'rgba(255,255,255,.03)', '#334155', 2); K.text(c, n, x + 260, 270, {size: 38, weight: 800, align: 'center', color: w}); c.restore();
    const p = S(t, D * m[i], D * m[i] + .7); if (p <= 0) return; c.save(); c.globalAlpha = O(p); c.translate(x + 260, 560); c.rotate((i - 1) * .015 + (1 - O(p)) * .2); c.translate(-(x + 260), -560 - (1 - O(p)) * 40);
    K.rrect(c, x + 30, 330, 460, 470, 14, '#fef9c3'); K.text(c, s, x + 60, 390, {size: 34, weight: 600, maxW: 400, lh: 1.4, color: '#1e293b'});
    c.fillStyle = C.coral; c.beginPath(); c.arc(x + 260, 340, 12, 0, 7); c.fill(); c.restore(); });
};
AD.kriteria = (c, t, D) => {
  K.bg(c); K.judul(c, 'Kriteria terima', t, C.lime, 'Syarat yang bisa diuji');
  const flip = S(t, D * .18, D * .26); const sx = Math.abs(Math.cos(flip * Math.PI)); const depan = flip < .5;
  c.save(); c.translate(760, 590); c.scale(Math.max(.02, sx), 1); c.translate(-760, -590);
  if (depan) { K.rrect(c, 260, 300, 1000, 580, 18, '#fef9c3'); K.text(c, 'Sebagai pelanggan, aku ingin melihat posisi antreanku di HP, supaya aku bisa menunggu di warung sebelah tanpa takut terlewat.', 320, 400, {size: 40, weight: 600, maxW: 880, lh: 1.4, color: '#1e293b'});
    const pz = S(t, D * .05, D * .12); if (pz > 0) K.rrect(c, 300 + 0, 395 + 56, 0, 0, 0); }
  else { K.rrect(c, 260, 300, 1000, 580, 18, '#ecfccb'); K.text(c, 'Kriteria terima', 320, 370, {size: 34, weight: 900, color: '#3f6212'});
    const kr = ['Posisi berubah < 3 detik setelah petugas memanggil', 'Tanpa me-refresh halaman', 'Bisa diuji dengan stopwatch'];
    kr.forEach((k, i) => { const p = S(t, D * (.32 + i * .14), D * (.32 + i * .14) + .5); c.save(); c.globalAlpha = O(p);
      K.rrect(c, 320, 440 + i * 130 - 30, 60, 60, 12, null, '#3f6212', 4); K.centang(c, 350, 440 + i * 130, 50, S(t, D * (.32 + i * .14) + .3, D * (.32 + i * .14) + .8), '#3f6212');
      K.text(c, k, 410, 440 + i * 130, {size: 38, weight: 700, color: '#1e293b', maxW: 800}); c.restore(); }); }
  c.restore();
  // stopwatch
  const ps = O(S(t, D * .55, D * .55 + .6)); if (ps > 0) { c.save(); c.globalAlpha = ps; const x = 1550, y = 590;
    c.strokeStyle = C.teks; c.lineWidth = 12; c.beginPath(); c.arc(x, y, 170, 0, 7); c.stroke(); c.fillStyle = C.teks; c.fillRect(x - 30, y - 230, 60, 40);
    const q = K.clamp((t - D * .6) / 2.6, 0, 1) * 2.6; c.strokeStyle = C.lime; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(q / 3 * Math.PI * 2) * 130, y - Math.cos(q / 3 * Math.PI * 2) * 130); c.stroke();
    K.text(c, q.toFixed(1) + ' dtk', x, y + 80, {size: 40, weight: 800, align: 'center', mono: true, color: C.lime}); c.restore(); }
};
AD.diagramStatus = (c, t, D) => {
  K.bg(c); K.judul(c, 'Perjalanan sebuah tiket', t, C.amber, 'Diagram status');
  const m = {M: .2, P: .29, L: .44, W: .52, S: .74, B: .86}, pn = {}, pe = {};
  for (const k in m) pn[k] = S(t, D * m[k], D * m[k] + .5);
  pe.MP = S(t, D * .27, D * .3); pe.PL = S(t, D * .42, D * .45); pe.PW = S(t, D * .5, D * .53); pe.WP = S(t, D * .62, D * .66); pe.LS = S(t, D * .72, D * .75); pe.MB = S(t, D * .84, D * .87);
  const sor = t < D * .29 ? 'M' : t < D * .44 ? 'P' : t < D * .5 ? 'L' : t < D * .62 ? 'W' : t < D * .72 ? 'P' : t < D * .84 ? 'S' : 'B';
  K.diagramStatus(c, pn, pe, {sorot: t > D * .2 ? sor : null});
};
AD.diagramTombol = (c, t, D) => {
  K.bg(c); K.judul(c, 'Tombol = perpindahan status', t, C.amber);
  const pn = {M: 1, P: 1, L: 1, S: 1, W: 1, B: 1}, pe = {MP: 1, PL: 1, LS: 1, PW: 1, WP: 1, MB: 1};
  const T = [['Panggil', 'MP', C.amber], ['Mulai layani', 'PL', C.teal], ['Selesai', 'LS', C.lime], ['Lewati', 'PW', C.coral], ['Panggil ulang', 'WP', C.sky]];
  const we = {}; T.forEach(([n, e, w], i) => { if (t > D * (.12 + i * .07)) we[e] = w; });
  K.diagramStatus(c, pn, pe, {warnaEdge: we});
  T.forEach(([n, e, w], i) => { const p = S(t, D * (.12 + i * .07), D * (.12 + i * .07) + .5); if (p <= 0) return;
    const bx = 170 + i * 330, by = 960; c.save(); c.globalAlpha = O(p); K.rrect(c, bx, by - 40, 290, 80, 18, w); K.text(c, n, bx + 145, by, {size: 30, weight: 800, align: 'center', color: '#0e1424'});
    c.restore(); });
  // panah terlarang Selesai -> Dipanggil
  const pf = S(t, D * .62, D * .72); if (pf > 0) { c.save(); const [sx, sy] = N.S, [px, py] = N.P;
    c.setLineDash([16, 12]); c.strokeStyle = C.coral; c.lineWidth = 6; c.beginPath(); c.moveTo(sx, sy - 56); c.quadraticCurveTo((sx + px) / 2, 170, px + 40, py - 56); c.stroke(); c.setLineDash([]);
    const px2 = O(S(t, D * .74, D * .8)); if (px2 > 0) { c.globalAlpha = px2; K.coret(c, 1180, 180, 1300, 300, 1); K.coret(c, 1300, 180, 1180, 300, 1); K.rrect(c, 1360, 175, 160, 70, 35, C.coral); K.text(c, 'bug!', 1440, 211, {size: 38, weight: 900, align: 'center', color: '#0e1424'}); }
    c.restore(); }
};
const SPEC = ['# Kebutuhan Aplikasi Antrean Bengkel', '', '## Fitur utama', '- Pelanggan mengambil nomor antrean', '- Petugas memanggil nomor berikutnya', '- Layar TV menampilkan nomor yang dipanggil',
  '- Program poin loyalitas pelanggan', '- Chat langsung dengan mekanik', '', '## Pengguna', '- Admin, petugas, pelanggan', '', '## Teknologi', '- Web, responsif, real time'];
function dokSpec(c, t, p, o = {}) { const x = 330, y = 210; c.save(); c.globalAlpha = O(p); K.rrect(c, x, y, 1100, 800, 20, '#0d1222', '#334155', 2);
  const n = o.chars ?? 1e9; let sisa = n;
  SPEC.forEach((l, i) => { const yy = y + 50 + i * 52; if (sisa <= 0) return; const s = l.slice(0, sisa); sisa -= l.length + 1;
    const h = l.startsWith('#'); if (o.extra && (i === 6 || i === 7)) K.rrect(c, x + 20, yy - 24, 1060, 48, 8, 'rgba(255,176,32,.18)', C.amber, 2);
    K.text(c, s, x + 40, yy, {size: h ? (l.startsWith('# ') ? 34 : 30) : 28, weight: h ? 800 : 500, mono: !h, color: h ? C.teks : '#cbd5e1'}); });
  c.restore(); }
AD.specAI = (c, t, D) => { K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 1380, 72, O(S(t, .3, .8)));
  K.rrect(c, 330, 150, 1100, 50, 25, 'rgba(255,255,255,.06)'); K.text(c, '› buatkan kebutuhan aplikasi antrean bengkel', 360, 176, {size: 24, weight: 600, mono: true, color: C.redup, alpha: O(S(t, .2, .6))});
  dokSpec(c, t, S(t, .6, 1), {chars: Math.floor(K.clamp((t - 1) / (D * .45)) * 600)}); K.pikirkan(c, t, D); };
AD.specJawab = (c, t, D) => { K.bg(c); K.cekAIjudul(c, t);
  dokSpec(c, t, 1, {extra: t > D * .4});
  const p1 = O(S(t, .3, 1)); if (p1 > 0) { c.save(); c.globalAlpha = p1; c.setLineDash([14, 10]); K.rrect(c, 1470, 300, 400, 220, 18, 'rgba(255,107,107,.1)', C.coral, 4); c.setLineDash([]);
    K.text(c, 'Tidak ada:', 1500, 350, {size: 30, weight: 800, color: C.coral}); K.text(c, 'pelanggan tidak datang saat dipanggil?', 1500, 410, {size: 30, weight: 600, maxW: 340, lh: 1.3}); c.restore(); }
  const p2 = O(S(t, D * .4, D * .4 + .5)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 1470, 560, 400, 70, 35, C.amber); K.text(c, 'tidak diminta', 1670, 596, {size: 32, weight: 900, align: 'center', color: '#141a2c'}); K.arrow(c, 1470, 596, 1240, 560, C.amber, 5, 1); c.restore(); }
  const p3 = O(S(t, D * .62, D * .62 + .6)); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.orang(c, 1650, 980, 230, '#1d4ed8', {topi: '#ef4444', kumis: true}); K.text(c, 'Hanya kamu yang bisa bertanya langsung.', 380, 1045, {size: 34, weight: 800, color: C.lime}); c.restore(); }
};
AD.versi1 = (c, t, D) => { K.bg(c); K.judul(c, 'Batas versi 1', t, C.lime, 'Kecil tapi selesai');
  const v1 = ['Ambil nomor', 'Pesan slot', 'Panggil', 'Layar TV', 'Laporan'], nanti = ['Notifikasi WhatsApp', 'Pembayaran', 'Aplikasi HP'];
  const pa = O(S(t, .3, .9)); c.save(); c.globalAlpha = pa; K.rrect(c, 140, 230, 900, 760, 26, 'rgba(163,230,53,.06)', C.lime, 5); K.text(c, 'Versi 1', 590, 290, {size: 48, weight: 900, align: 'center', color: C.lime});
  K.rrect(c, 1120, 230, 660, 760, 26, 'rgba(255,255,255,.03)', '#475569', 3); K.text(c, 'Nanti', 1450, 290, {size: 48, weight: 900, align: 'center', color: C.redup}); c.restore();
  nanti.forEach((s, i) => { const p = S(t, D * (.22 + i * .07), D * (.22 + i * .07) + .6); if (p <= 0) return; const x = K.lerp(380, 1180, K.ease(p)); c.save(); c.globalAlpha = .9;
    K.rrect(c, x, 360 + i * 120, 540, 90, 16, '#334155'); K.text(c, s, x + 270, 405 + i * 120, {size: 34, weight: 700, align: 'center', color: '#cbd5e1'}); c.restore(); });
  v1.forEach((s, i) => { const p = S(t, D * (.46 + i * .06), D * (.46 + i * .06) + .5); if (p <= 0) return; c.save(); c.globalAlpha = O(p);
    K.rrect(c, 200, 350 + i * 120, 780, 92, 16, C.lime); K.text(c, s, 590, 396 + i * 120, {size: 38, weight: 800, align: 'center', color: '#1a2e05'}); c.restore(); });
};
})();
