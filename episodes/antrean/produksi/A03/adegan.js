// A03 SQL dengan tangan sendiri
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const grid = (...a) => K.grid ? K.grid(...a) : null;
// tabel data sederhana (salinan dari A02 supaya mandiri)
function tabel(c, x, y, kol, baris, o = {}) {
  const cw = o.cw || kol.map(() => 220), rh = o.rh || 54, W = cw.reduce((a, b) => a + b, 0), p = o.p ?? 1; if (p <= 0) return {W, rh};
  c.save(); c.globalAlpha *= O(p);
  K.rrect(c, x, y, W, rh * (baris.length + 1), 12, '#0f1528', '#334155', 2);
  K.rrect(c, x, y, W, rh, 12, o.warna || C.teal); let xx = x;
  kol.forEach((k, i) => { K.text(c, k, xx + 16, y + rh / 2, {size: 23, weight: 800, mono: true, color: '#0e1424'}); xx += cw[i]; });
  baris.forEach((b, r) => { const yy = y + rh * (r + 1); xx = x;
    if (o.warnaBaris && o.warnaBaris[r]) K.rrect(c, x + 3, yy + 3, W - 6, rh - 6, 8, o.warnaBaris[r], o.garisBaris && o.garisBaris[r]);
    b.forEach((v, i) => { K.text(c, String(v), xx + 16, yy + rh / 2, {size: 23, weight: 600, mono: true, color: (o.redupBaris && o.redupBaris[r]) ? '#5b6788' : C.teks}); xx += cw[i]; }); });
  c.restore(); return {W, rh};
}

// b04: constraint sebagai penjaga
AD.gerbang = (c, t, D) => {
  K.bg(c); K.judul(c, 'Constraint', t, C.teal, 'Aturan yang dijaga oleh database itu sendiri');
  const G = [['NOT NULL', 'tidak boleh kosong', C.sky], ['UNIQUE', 'tidak boleh kembar', C.violet], ['CHECK', 'harus memenuhi syarat', C.amber]];
  G.forEach(([n, s, w], i) => { const p = S(t, .4 + i * .5, 1 + i * .5); if (p <= 0) return; const x = 260 + i * 520;
    c.save(); c.globalAlpha = O(p); K.rrect(c, x, 300, 400, 120, 20, 'rgba(255,255,255,.04)', w, 5);
    K.text(c, n, x + 200, 345, {size: 40, weight: 900, align: 'center', mono: true, color: w}); K.text(c, s, x + 200, 392, {size: 26, weight: 600, align: 'center', color: '#cbd5e1'}); c.restore(); });
  // pintu masuk data dari berbagai jalan
  const jalan = [['Kode JavaScript kita', 300], ['Skrip impor data', 430], ['Orang yang mengetik di psql', 560]];
  const pj = S(t, D * .35, D * .35 + .6);
  if (pj > 0) { c.save(); c.globalAlpha = O(pj);
    K.rrect(c, 1380, 560, 400, 360, 26, 'rgba(45,212,191,.08)', C.teal, 5); K.text(c, 'Database', 1580, 610, {size: 38, weight: 900, align: 'center', color: C.teal});
    [0, 1, 2].forEach(i => K.rrect(c, 1420, 660 + i * 80, 320, 56, 10, 'rgba(255,255,255,.05)', '#475569', 2));
    jalan.forEach(([n, y], i) => { const q = S(t, D * .4 + i * .5, D * .4 + i * .5 + .6); if (q <= 0) return;
      K.text(c, n, 140, y + 330, {size: 30, weight: 700, alpha: O(q)}); K.arrow(c, 620, y + 330, 1240, 740, '#94a3b8', 4, O(q), 16); });
    c.restore(); }
  const pp = O(S(t, D * .6, D * .6 + .6)); if (pp > 0) { c.save(); c.globalAlpha = pp; c.translate(1300, 740);
    K.rrect(c, -60, -170, 120, 340, 20, C.amber); K.text(c, 'penjaga', 0, 0, {size: 26, weight: 900, align: 'center', color: '#141a2c'}); c.restore();
    const pb = O(S(t, D * .78, D * .78 + .6)); if (pb > 0) K.text(c, 'Penjaga terakhir: tetap bekerja walaupun kode punya bug.', 960, 1020, {size: 36, weight: 800, align: 'center', color: C.lime, alpha: pb}); }
};

// b06: zona waktu
function jam(c, x, y, r, h, m, w, label, sub) {
  c.save(); K.rrect(c, x - r - 20, y - r - 20, 2 * r + 40, 2 * r + 40, r + 20, 'rgba(255,255,255,.03)');
  c.strokeStyle = w; c.lineWidth = 8; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; c.lineWidth = 4; c.beginPath(); c.moveTo(x + Math.sin(a) * r * .85, y - Math.cos(a) * r * .85); c.lineTo(x + Math.sin(a) * r * .95, y - Math.cos(a) * r * .95); c.stroke(); }
  const ah = ((h % 12) + m / 60) / 12 * Math.PI * 2, am = m / 60 * Math.PI * 2; c.lineCap = 'round';
  c.strokeStyle = C.teks; c.lineWidth = 10; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(ah) * r * .5, y - Math.cos(ah) * r * .5); c.stroke();
  c.lineWidth = 6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(am) * r * .78, y - Math.cos(am) * r * .78); c.stroke();
  K.text(c, label, x, y + r + 60, {size: 34, weight: 800, align: 'center'}); K.text(c, sub, x, y + r + 104, {size: 28, weight: 700, align: 'center', color: w, mono: true});
  c.restore();
}
AD.zonaWaktu = (c, t, D, a = {}) => {
  if (a.bg) K.latar(c, a.bg, .86); else K.bg(c);
  K.judul(c, 'timestamptz', t, C.teal, 'tz = time zone, zona waktu');
  const p1 = O(S(t, D * .25, D * .25 + .6)), p2 = O(S(t, D * .32, D * .32 + .6)), p3 = O(S(t, D * .5, D * .5 + .6));
  if (p1 > 0) { c.save(); c.globalAlpha = p1; jam(c, 360, 520, 150, 8, 0, C.sky, 'Server di Singapura', '08.00 +08'); c.restore(); }
  if (p2 > 0) { c.save(); c.globalAlpha = p2; jam(c, 1560, 520, 150, 8, 0, C.amber, 'Bengkel di Makassar', '08.00 WITA'); c.restore(); }
  if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 700, 420, 520, 200, 26, 'rgba(45,212,191,.1)', C.teal, 4);
    K.text(c, 'Satu acuan', 960, 470, {size: 32, weight: 800, align: 'center', color: C.teal}); K.text(c, '00.00 UTC', 960, 540, {size: 48, weight: 900, align: 'center', mono: true});
    K.arrow(c, 560, 520, 690, 520, C.sky, 5, 1, 16); K.arrow(c, 1230, 520, 1360, 520, C.amber, 5, 1, 16); c.restore(); }
  const p4 = O(S(t, D * .75, D * .75 + .6)); if (p4 > 0) K.text(c, 'Disimpan dalam satu acuan, ditampilkan sesuai zona pemakainya.', 960, 960, {size: 36, weight: 800, align: 'center', color: C.lime, alpha: p4});
};

// b11: JOIN dua lembar daftar
AD.join = (c, t, D) => {
  K.bg(c); K.judul(c, 'JOIN', t, C.teal, 'Menyambungkan dua tabel lewat kolom yang cocok');
  const tk = [['B-007', '2'], ['C-007', '3'], ['A-007', '1'], ['B-008', '2']], sv = [['1', 'Ganti oli cepat'], ['2', 'Servis ringan'], ['3', 'Servis besar']];
  const geser = K.ease(K.clamp((t - D * .3) / (D * .2)));
  tabel(c, 140, 260, ['label', 'service_id'], tk, {cw: [180, 220], p: S(t, .3, .9), warna: C.amber});
  const sx = K.lerp(1280, 700, geser);
  tabel(c, sx, 260, ['id', 'name'], sv, {cw: [100, 330], p: S(t, .5, 1.1)});
  K.text(c, 'tickets', 140, 230, {size: 28, weight: 800, mono: true, color: C.amber, alpha: O(S(t, .3, .9))});
  K.text(c, 'services', sx, 230, {size: 28, weight: 800, mono: true, color: C.teal, alpha: O(S(t, .5, 1.1))});
  const idx = {'1': 0, '2': 1, '3': 2};
  if (geser > .99) tk.forEach(([l, s], i) => { const p = S(t, D * .52 + i * .35, D * .52 + i * .35 + .5); if (p <= 0) return;
    const y1 = 260 + 54 * (i + 1) + 27, y2 = 260 + 54 * (idx[s] + 1) + 27; K.arrow(c, 540, y1, 700, y2, [C.sky, C.violet, C.lime, C.pink][i], 4, O(p), 14); });
  const pr = S(t, D * .72, D * .72 + .7); if (pr > 0) {
    tabel(c, 140, 640, ['label', 'name'], tk.map(([l, s]) => [l, sv[idx[s]][1]]), {cw: [180, 360], p: pr, warna: C.lime});
    K.text(c, 'tickets JOIN services ON services.id = tickets.service_id', 760, 760, {size: 30, weight: 700, mono: true, alpha: O(pr), maxW: 1060});
  }
};

// b12: posisi dihitung
AD.posisi = (c, t, D) => {
  K.bg(c); K.judul(c, 'Posisi dihitung, bukan disimpan', t, C.teal);
  const L = [['A-006', 'waiting', '09.54'], ['A-007', 'waiting', '10.18'], ['A-008', 'waiting', '10.42'], ['A-009', 'done', '11.06'], ['A-010', 'waiting', '11.30'], ['A-011', 'waiting', '11.54'], ['A-012', 'waiting', '12.18'], ['A-013', 'waiting', '12.42']];
  const sorot = K.clamp((t - D * .3) / (D * .35));
  L.forEach(([l, st, w], i) => { const p = S(t, .2 + i * .12, .7 + i * .12); if (p <= 0) return; const x = 150 + i * 210, y = 420;
    const ok = st === 'waiting' && i < 6, tgt = l === 'A-012', on = ok && sorot * 6 > i;
    c.save(); c.globalAlpha = O(p) * (st === 'done' ? .35 : (i > 6 ? .35 : 1));
    K.tiketKertas(c, x + 90, y, l, {w: 180, h: 110, garis: tgt ? C.amber : (on ? C.lime : '#e2c08d'), bawah: w});
    K.text(c, st, x + 90, y + 90, {size: 22, weight: 700, align: 'center', mono: true, color: st === 'waiting' ? C.sky : C.redup});
    if (on) K.centang(c, x + 90, y - 110, 50, 1); if (tgt) K.text(c, 'yang ditanya', x + 90, y - 110, {size: 24, weight: 800, align: 'center', color: C.amber}); c.restore(); });
  const n = Math.min(5, Math.floor(sorot * 6)); const pn = O(S(t, D * .3, D * .3 + .4));
  if (pn > 0) { c.save(); c.globalAlpha = pn; K.text(c, `menunggu dan datang lebih dulu: ${n}`, 150, 640, {size: 36, weight: 700}); c.restore(); }
  const pf = O(S(t, D * .7, D * .7 + .6)); if (pf > 0) { c.save(); c.globalAlpha = pf; K.rrect(c, 150, 720, 1620, 230, 26, 'rgba(163,230,53,.06)', C.lime, 4);
    K.text(c, 'posisi = 5 + 1 = 6', 200, 790, {size: 46, weight: 900, color: C.lime});
    K.text(c, 'SELECT count(*) + 1 FROM tickets WHERE ... created_at < waktu A-012', 200, 880, {size: 30, weight: 600, mono: true, color: '#cbd5e1'}); c.restore(); }
};

// b13: GROUP BY seperti keranjang
AD.keranjang = (c, t, D) => {
  K.bg(c); K.judul(c, 'GROUP BY', t, C.teal, 'Memilah kartu ke keranjang, lalu menghitung per keranjang');
  const B = [['Ganti oli cepat', C.sky], ['Servis ringan', C.amber], ['Servis besar', C.violet]];
  B.forEach(([n, w], i) => { const x = 260 + i * 520; c.save(); c.globalAlpha = O(S(t, .3, .9));
    c.strokeStyle = w; c.lineWidth = 6; c.beginPath(); c.moveTo(x - 170, 640); c.lineTo(x - 130, 900); c.lineTo(x + 130, 900); c.lineTo(x + 170, 640); c.stroke();
    K.text(c, n, x, 950, {size: 32, weight: 800, align: 'center', color: w}); c.restore(); });
  const kartu = [[0, 31], [1, 40], [2, 35], [0, 28], [1, 33], [2, 51], [0, 34], [1, 38], [2, 44], [0, 30], [1, 36]];
  const isi = [0, 0, 0];
  kartu.forEach(([b, m], i) => { const t0 = D * .12 + i * D * .03, p = K.clamp((t - t0) / .7); if (p <= 0) return; const k = isi[b]++;
    const x0 = 960, y0 = 280, x1 = 260 + b * 520 - 90 + (k % 3) * 90, y1 = 860 - Math.floor(k / 3) * 70;
    const e = K.ease(p); const x = K.lerp(x0, x1, e), y = K.lerp(y0, y1, e) - Math.sin(e * Math.PI) * 120;
    K.rrect(c, x - 40, y - 28, 80, 56, 10, '#fff7e6', B[b][1], 3); K.text(c, m + "'", x, y, {size: 24, weight: 800, align: 'center', color: '#1e293b'}); });
  const ra = ['00:30:48', '00:36:51', '00:43:12'];
  B.forEach(([n, w], i) => { const p = O(S(t, D * .72 + i * .3, D * .72 + i * .3 + .5)); if (p <= 0) return; const x = 260 + i * 520;
    c.save(); c.globalAlpha = p; K.rrect(c, x - 150, 480, 300, 100, 20, w); K.text(c, 'AVG', x, 510, {size: 24, weight: 900, align: 'center', color: '#0e1424'});
    K.text(c, ra[i], x, 552, {size: 34, weight: 900, align: 'center', mono: true, color: '#0e1424'}); c.restore(); });
};

// b14: query AI
const QAI = ['SELECT s.name,', '  AVG(e.created_at - t.created_at) AS avg_wait', 'FROM tickets t', 'JOIN services s ON s.id = t.service_id', 'LEFT JOIN ticket_events e', "  ON e.ticket_id = t.id AND e.status = 'called'", 'GROUP BY s.name;'];
AD.queryAI = (c, t, D) => { K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 1380, 72, O(S(t, .3, .8)));
  K.rrect(c, 160, 160, 1100, 50, 25, 'rgba(255,255,255,.06)'); K.text(c, '› buatkan query rata-rata waktu tunggu per layanan', 190, 186, {size: 24, weight: 600, mono: true, color: C.redup, alpha: O(S(t, .2, .6))});
  K.kode(c, QAI, 160, 250, {size: 32, chars: Math.floor(K.clamp((t - .8) / (D * .3)) * 400), w: 1100});
  const ph = O(S(t, D * .45, D * .45 + .5)); if (ph > 0) { c.save(); c.globalAlpha = ph;
    tabel(c, 160, 700, ['name', 'avg_wait'], [['Ganti oli cepat', '00:30:48'], ['Servis ringan', '00:36:51'], ['Servis besar', '00:43:12']], {cw: [330, 260], warna: C.lime});
    K.centang(c, 830, 820, 60, 1); K.text(c, 'berjalan, angkanya masuk akal', 880, 825, {size: 30, weight: 700, color: C.lime}); c.restore(); }
  K.pikirkan(c, t, D, 1640, 860); };

// b15: AVG melewati NULL
AD.avgNull = (c, t, D) => {
  K.bg(c); K.judul(c, 'AVG melewati NULL', t, C.coral, 'Yang paling kecewa hilang dari laporan');
  const R = [['C-001', '31 menit'], ['C-002', '38 menit'], ['C-005', 'NULL'], ['C-003', '45 menit'], ['C-010', 'NULL'], ['C-004', '52 menit']];
  const hapus = K.clamp((t - D * .25) / (D * .15));
  tabel(c, 160, 230, ['tiket', 'tunggu'], R, {cw: [200, 260], p: S(t, .3, .9), warna: C.violet,
    warnaBaris: R.map(r => r[1] === 'NULL' ? (hapus > 0 ? 'rgba(255,107,107,.18)' : null) : null), redupBaris: R.map(r => r[1] === 'NULL' && hapus > .5)});
  if (hapus > 0) R.forEach((r, i) => { if (r[1] !== 'NULL') return; const y = 230 + 54 * (i + 1) + 27; K.coret(c, 170, y, 610, y, hapus);
    K.text(c, 'pulang setelah 81 menit', 640, y, {size: 26, weight: 700, color: C.coral, alpha: O(hapus)}); });
  const pa = O(S(t, D * .35, D * .35 + .5)); if (pa > 0) { c.save(); c.globalAlpha = pa; K.rrect(c, 1100, 260, 640, 150, 22, 'rgba(255,255,255,.04)', '#64748b', 3);
    K.text(c, 'AVG = 41,5 menit', 1420, 315, {size: 40, weight: 900, align: 'center'}); K.text(c, 'tampak lebih baik dari kenyataan', 1420, 370, {size: 26, weight: 600, align: 'center', color: C.redup}); c.restore(); }
  const pb = O(S(t, D * .55, D * .55 + .6)); if (pb > 0) { c.save(); c.globalAlpha = pb;
    tabel(c, 160, 700, ['name', 'dilayani', 'rata_tunggu', 'batal', 'tunggu_batal'], [['Servis besar', '5', '00:43:12', '2', '01:21:30']], {cw: [280, 180, 240, 140, 260], warna: C.lime});
    K.text(c, 'Keputusan: tampilkan yang dilayani DAN yang batal, berdampingan.', 160, 880, {size: 34, weight: 800, color: C.lime}); c.restore(); }
  const pc = O(S(t, D * .82, D * .82 + .5)); if (pc > 0) K.text(c, 'Benar secara sintaks belum tentu benar secara makna.', 960, 980, {size: 36, weight: 800, align: 'center', color: C.amber, alpha: pc});
};
})();
