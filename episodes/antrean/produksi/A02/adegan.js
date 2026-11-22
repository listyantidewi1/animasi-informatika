// A02 Merancang database
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const T = {
  services: [['id', 'pk', 'serial'], ['code', '', 'char(1)'], ['name', '', 'text'], ['avg_minutes', '', 'integer']],
  counters: [['id', 'pk', 'serial'], ['name', '', 'text']],
  counter_services: [['counter_id', 'fk', 'integer'], ['service_id', 'fk', 'integer']],
  users: [['id', 'pk', 'serial'], ['username', '', 'text'], ['password_hash', '', 'text'], ['role', '', 'text'], ['counter_id', 'fk', 'integer']],
  tickets: [['id', 'pk', 'serial'], ['service_id', 'fk', 'integer'], ['service_date', '', 'date'], ['number', '', 'integer'], ['label', '', 'text'],
    ['status', '', 'text'], ['code', '', 'text'], ['counter_id', 'fk', 'integer'], ['created_at', '', 'timestamptz']],
  ticket_events: [['id', 'pk', 'serial'], ['ticket_id', 'fk', 'integer'], ['status', '', 'text'], ['user_id', 'fk', 'integer'], ['created_at', '', 'timestamptz']],
  slots: [['id', 'pk', 'serial'], ['service_id', 'fk', 'integer'], ['starts_at', '', 'timestamptz'], ['quota', '', 'integer']],
  bookings: [['id', 'pk', 'serial'], ['slot_id', 'fk', 'integer'], ['name', '', 'text'], ['phone', '', 'text'], ['code', '', 'text'], ['status', '', 'text']],
};
K.T_A02 = T;
// tabel data sederhana (sel teks)
function grid(c, x, y, kol, baris, o = {}) {
  const cw = o.cw || kol.map(() => 220), rh = o.rh || 56, W = cw.reduce((a, b) => a + b, 0), p = o.p ?? 1; if (p <= 0) return;
  c.save(); c.globalAlpha *= O(p);
  K.rrect(c, x, y, W, rh * (baris.length + 1), 12, '#0f1528', '#334155', 2);
  K.rrect(c, x, y, W, rh, 12, o.warna || C.teal); let xx = x;
  kol.forEach((k, i) => { K.text(c, k, xx + 18, y + rh / 2, {size: 24, weight: 800, mono: true, color: '#0e1424'}); xx += cw[i]; });
  baris.forEach((b, r) => { const yy = y + rh * (r + 1); xx = x;
    if (o.warnaBaris && o.warnaBaris[r]) K.rrect(c, x + 3, yy + 3, W - 6, rh - 6, 8, o.warnaBaris[r]);
    b.forEach((v, i) => { const sel = o.sel && o.sel[r] && o.sel[r][i];
      if (sel) K.rrect(c, xx + 4, yy + 4, cw[i] - 8, rh - 8, 8, sel[0], sel[1], 2);
      K.text(c, String(v), xx + 18, yy + rh / 2, {size: 24, weight: 600, mono: true, color: (sel && sel[2]) || C.teks}); xx += cw[i]; });
    c.strokeStyle = '#26314f'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, yy); c.lineTo(x + W, yy); c.stroke(); });
  c.restore(); return {W, rh};
}
K.grid = grid;

// b02: kata benda -> entitas
AD.kataBenda = (c, t, D) => {
  K.bg(c); K.judul(c, 'Mencari entitas', t, C.teal, 'Garis bawahi kata benda di kebutuhan');
  const kal = [['Pelanggan mengambil nomor ', '', '|tiket|', ' untuk satu ', '|layanan|', '.'],
    ['Petugas', '', ' memanggil dari sebuah ', '|loket|', '.'], ['Pelanggan bisa memesan ', '|slot|', ' jam; ', '|pemesanan|', ' masuk daftar.']];
  // tulis kalimat (Petugas juga kata benda)
  const kata = []; const pk = O(S(t, .3, 1));
  c.save(); c.globalAlpha = pk; K.panel(c, 140, 210, 1640, 330, 1, '#475569');
  kal.forEach((bag, i) => { let x = 200; const y = 290 + i * 90;
    bag.forEach(s => { if (!s) return; const kb = s.startsWith('|'), w = s.replace(/\|/g, '');
      const isi = (s === 'Petugas') ? true : kb;
      K.text(c, w, x, y, {size: 40, weight: isi ? 800 : 500, color: isi ? C.teks : '#cbd5e1'});
      const lw = K.lebar(c, w, 40, isi ? 800 : 500); if (isi) kata.push([w, x, y, lw]); x += lw; }); });
  c.restore();
  kata.forEach(([w, x, y, lw], i) => { const p = S(t, 1.4 + i * .45, 1.9 + i * .45); if (p > 0) K.path(c, [[x, y + 30], [x + lw, y + 30]], C.amber, 6, O(p), false); });
  // kotak entitas
  const ent = [['Tiket', C.amber], ['Layanan', C.teal], ['Petugas', C.violet], ['Loket', C.sky], ['Slot', C.lime], ['Pemesanan', C.pink]];
  const t0 = D * .45;
  ent.forEach(([n, w], i) => { const p = S(t, t0 + i * .35, t0 + i * .35 + .6); if (p <= 0) return; const x = 150 + i * 275, y = 700;
    c.save(); c.globalAlpha = O(p); const s = K.lerp(.7, 1, K.back(p)); c.translate(x + 120, y + 70); c.scale(s, s);
    K.rrect(c, -120, -70, 240, 140, 22, 'rgba(255,255,255,.05)', w, 5); K.text(c, n, 0, 0, {size: 36, weight: 800, align: 'center'}); c.restore(); });
  const pe = O(S(t, D * .78, D * .78 + .6)); if (pe > 0) K.text(c, 'Satu entitas biasanya menjadi satu tabel.', 960, 940, {size: 38, weight: 700, align: 'center', color: C.lime, alpha: pe});
};

// b03: atribut + primary key
AD.atribut = (c, t, D) => {
  K.bg(c); K.judul(c, 'Atribut dan primary key', t, C.teal);
  const n1 = Math.min(4, Math.floor(K.clamp((t - .5) / (D * .25)) * 4.99));
  K.tabelERD(c, 200, 210, 'services', T.services, {n: n1, w: 560, rh: 62, p: S(t, .3, .9), sorotKolom: t > D * .62 ? ['id'] : []});
  const sub = [T.tickets[0], T.tickets[1], T.tickets[3], T.tickets[5], T.tickets[8]];
  const n2 = Math.min(5, Math.floor(K.clamp((t - D * .25) / (D * .25)) * 5.99));
  K.tabelERD(c, 1000, 210, 'tickets', sub.map(([a, j, ty]) => [a, j === 'fk' ? '' : j, ty]), {n: n2, w: 600, rh: 62, warna: C.amber, p: S(t, D * .22, D * .22 + .6), sorotKolom: t > D * .62 ? ['id'] : []});
  const p = O(S(t, D * .62, D * .62 + .7)); if (p > 0) { c.save(); c.globalAlpha = p;
    K.rrect(c, 200, 800, 1520, 190, 24, 'rgba(255,176,32,.08)', C.amber, 3);
    K.text(c, 'PK', 250, 860, {size: 34, weight: 900, color: C.amber}); K.text(c, 'Primary key: nilainya pasti berbeda di setiap baris.', 320, 860, {size: 36, weight: 700});
    K.text(c, 'id serial  →  1, 2, 3, 4, …  diisi otomatis oleh database', 320, 930, {size: 32, weight: 500, mono: true, color: '#cbd5e1'}); c.restore(); }
};

// b04: relasi satu ke banyak, foreign key
AD.relasi1N = (c, t, D) => {
  K.bg(c); K.judul(c, 'Satu ke banyak', t, C.teal, 'Satu layanan, banyak tiket');
  const a = K.tabelERD(c, 160, 260, 'services', T.services, {w: 440, p: S(t, .2, .8)});
  const sub = [T.tickets[0], T.tickets[1], T.tickets[3], T.tickets[5]];
  const b = K.tabelERD(c, 1000, 260, 'tickets', sub, {w: 500, warna: C.amber, p: S(t, .5, 1.1), sorotKolom: t > D * .3 ? ['service_id'] : []});
  const pg = S(t, D * .2, D * .32); K.kakiGagak(c, 160 + 440, a.baris('id'), 1000, b.baris('service_id'), pg, C.sky, 2);
  const p1 = O(S(t, D * .3, D * .3 + .5)); if (p1 > 0) { K.text(c, '1', 640, a.baris('id') - 30, {size: 34, weight: 900, color: C.sky, alpha: p1}); K.text(c, 'banyak', 870, b.baris('service_id') - 50, {size: 30, weight: 800, color: C.sky, alpha: p1}); }
  const p2 = O(S(t, D * .34, D * .34 + .6)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 1540, 400, 300, 120, 20, 'rgba(96,165,250,.12)', C.sky, 3);
    K.text(c, 'FK', 1580, 440, {size: 28, weight: 900, color: C.sky}); K.text(c, 'foreign key', 1640, 440, {size: 28, weight: 700});
    K.text(c, '→ services.id', 1580, 485, {size: 24, weight: 600, mono: true, color: '#cbd5e1'}); c.restore(); }
  // tiket yatim ditolak
  const p3 = S(t, D * .72, D * .72 + .8); if (p3 > 0) { c.save(); c.globalAlpha = O(p3);
    grid(c, 160, 790, ['id', 'service_id', 'number', 'status'], [['31', '99', '1', 'waiting']], {cw: [140, 240, 180, 220], p: 1, warna: C.amber, sel: [[null, ['rgba(255,107,107,.2)', C.coral, C.coral]]]});
    K.text(c, 'Layanan nomor 99 tidak ada.', 1000, 860, {size: 34, weight: 700, color: '#cbd5e1'});
    const p4 = O(S(t, D * .82, D * .82 + .4)); if (p4 > 0) { K.rrect(c, 1000, 900, 260, 64, 32, C.coral); K.text(c, 'DITOLAK', 1130, 933, {size: 32, weight: 900, align: 'center', color: '#0e1424'}); }
    c.restore(); }
};

// b05: banyak ke banyak, tabel penghubung
AD.relasiNN = (c, t, D) => {
  K.bg(c); K.judul(c, 'Banyak ke banyak', t, C.teal, 'Loket dan layanan');
  const L = [['Loket 1', 300], ['Loket 2', 520]], Y = [['Ganti oli', 260], ['Servis ringan', 440], ['Servis besar', 620]];
  const pasang = [[0, 0], [0, 1], [1, 0], [1, 2]]; const fase2 = K.clamp((t - D * .55) / .9);
  const xs = K.lerp(220, 120, O(fase2)), xy = K.lerp(1100, 1500, O(fase2));
  L.forEach(([n, y], i) => { const p = S(t, .3 + i * .2, .9 + i * .2); if (p <= 0) return; c.save(); c.globalAlpha = O(p);
    K.rrect(c, xs, y - 50, 300, 100, 20, 'rgba(96,165,250,.1)', C.sky, 4); K.text(c, n, xs + 150, y, {size: 36, weight: 800, align: 'center'}); c.restore(); });
  Y.forEach(([n, y], i) => { const p = S(t, .6 + i * .2, 1.2 + i * .2); if (p <= 0) return; c.save(); c.globalAlpha = O(p);
    K.rrect(c, xy, y - 50, 330, 100, 20, 'rgba(45,212,191,.1)', C.teal, 4); K.text(c, n, xy + 165, y, {size: 34, weight: 800, align: 'center'}); c.restore(); });
  if (fase2 <= 0) pasang.forEach(([a, b], i) => { const p = S(t, D * .12 + i * D * .07, D * .12 + i * D * .07 + .7);
    K.arrow(c, xs + 300, L[a][1], xy, Y[b][1], '#cbd5e1', 5, O(p), 0); });
  else { // tabel penghubung di tengah
    const g = grid(c, 640, 250, ['counter_id', 'service_id'], [['1', '1'], ['1', '2'], ['2', '1'], ['2', '3']], {cw: [270, 270], p: fase2, warna: C.violet});
    K.text(c, 'counter_services', 910, 215, {size: 30, weight: 800, mono: true, align: 'center', color: C.violet, alpha: O(fase2)});
    pasang.forEach(([a, b], i) => { const yy = 250 + 56 * (i + 1) + 28, p = S(t, D * .55 + .9 + i * .3, D * .55 + 1.5 + i * .3);
      K.arrow(c, xs + 300, L[a][1], 640, yy, C.sky, 4, O(p), 12); K.arrow(c, 1180, yy, xy, Y[b][1], C.teal, 4, O(p), 12); });
    const p = O(S(t, D * .8, D * .8 + .6)); if (p > 0) K.text(c, 'Isinya hanya pasangan id loket dan id layanan.', 960, 900, {size: 38, weight: 700, align: 'center', color: C.lime, alpha: p});
  }
  const pt = O(S(t, D * .4, D * .4 + .5)); if (pt > 0 && fase2 <= 0) { c.save(); c.globalAlpha = pt; K.rrect(c, 560, 830, 800, 90, 45, 'rgba(255,107,107,.12)', C.coral, 3);
    K.text(c, 'Satu foreign key tidak cukup', 960, 876, {size: 36, weight: 800, align: 'center', color: C.coral}); c.restore(); }
};

// b06: normalisasi, data dobel
AD.normalisasi = (c, t, D) => {
  K.bg(c); K.judul(c, 'Normalisasi', t, C.teal, 'Setiap fakta disimpan di satu tempat saja');
  const ganti = K.clamp((t - D * .55) / (D * .3));
  const rows = [['A-001', 'Ganti oli cepat', '10'], ['B-001', 'Servis ringan', '30'], ['B-002', 'Servis ringan', '30'], ['A-002', 'Ganti oli cepat', '10'], ['B-003', 'Servis ringan', '30'], ['B-004', 'Servis ringan', '30']];
  const idxB = [1, 2, 4, 5]; const sel = {}, warna = {};
  rows.forEach((r, i) => { const k = idxB.indexOf(i); if (k < 0) return;
    if (t > D * .35 && t < D * .55) sel[i] = [null, ['rgba(255,176,32,.18)', C.amber]];
    if (ganti > 0 && k !== 2) { const pk = K.clamp(ganti * 4 - k); if (pk > .5) { r[1] = 'Servis berkala'; sel[i] = [null, ['rgba(163,230,53,.15)', C.lime, C.lime]]; } }
    if (ganti >= 1 && k === 2) sel[i] = [null, ['rgba(255,107,107,.22)', C.coral, C.coral]]; });
  grid(c, 250, 230, ['label', 'service_name', 'avg_minutes'], rows, {cw: [220, 480, 300], p: S(t, .3, 1), warna: C.amber, sel});
  K.text(c, 'tickets (rancangan buruk)', 250, 200, {size: 26, weight: 700, color: C.redup, alpha: O(S(t, .3, 1))});
  const pr = O(S(t, D * .55, D * .55 + .5)); if (pr > 0) { c.save(); c.globalAlpha = pr; K.rrect(c, 1330, 300, 440, 150, 20, 'rgba(255,176,32,.08)', C.amber, 3);
    K.text(c, 'Pak Rahmat mengganti nama:', 1360, 345, {size: 26, weight: 700, color: C.redup}); K.text(c, 'Servis ringan', 1360, 390, {size: 30, weight: 700, color: '#cbd5e1'});
    K.text(c, '→ Servis berkala', 1360, 430, {size: 30, weight: 800, color: C.lime}); c.restore(); }
  const pb = O(S(t, D * .88, D * .88 + .5)); if (pb > 0) { c.save(); c.globalAlpha = pb; K.rrect(c, 1330, 560, 440, 140, 20, 'rgba(255,107,107,.12)', C.coral, 3);
    K.text(c, 'Satu baris terlewat.', 1360, 610, {size: 32, weight: 800, color: C.coral}); K.text(c, 'Data saling bertentangan.', 1360, 660, {size: 28, weight: 600}); c.restore(); }
  const pn = O(S(t, D * .3, D * .3 + .5)); if (pn > 0 && t < D * .55) K.text(c, 'Nama dan lama layanan ditulis berulang di setiap tiket', 250, 700, {size: 32, weight: 700, color: C.amber, alpha: pn});
};

// b07: tiga aturan
AD.tigaAturan = (c, t, D) => {
  K.bg(c); K.judul(c, 'Bentuk normal', t, C.teal, 'Tiga aturan yang perlu diingat');
  const p1 = S(t, .3, .9); if (p1 > 0) { c.save(); c.globalAlpha = O(p1);
    K.rrect(c, 140, 220, 120, 64, 32, C.teal); K.text(c, '1NF', 200, 253, {size: 30, weight: 900, align: 'center', color: '#0e1424'});
    K.text(c, 'Setiap sel hanya berisi satu nilai.', 290, 253, {size: 36, weight: 700}); c.restore();
    const pp = S(t, D * .12, D * .3);
    grid(c, 200, 330, ['ticket', 'layanan'], [['A-005', 'oli, servis']], {cw: [200, 320], p: 1, warna: '#64748b', sel: pp > .3 ? [[null, ['rgba(255,107,107,.2)', C.coral, C.coral]]] : null});
    if (pp > .5) { K.arrow(c, 760, 390, 880, 390, C.lime, 5, O(K.clamp(pp * 2 - 1)));
      grid(c, 920, 330, ['ticket', 'layanan'], [['A-005', 'oli'], ['A-005', 'servis']], {cw: [200, 260], p: K.clamp(pp * 2 - 1), warna: C.lime}); }
  }
  const p2 = S(t, D * .38, D * .38 + .6); if (p2 > 0) { c.save(); c.globalAlpha = O(p2);
    K.rrect(c, 140, 590, 220, 64, 32, C.teal); K.text(c, '2NF + 3NF', 250, 623, {size: 30, weight: 900, align: 'center', color: '#0e1424'});
    K.text(c, 'Setiap kolom bergantung pada kunci tabelnya.', 390, 623, {size: 36, weight: 700}); c.restore(); }
  const pm = K.clamp((t - D * .55) / (D * .25));
  if (p2 > 0) {
    K.tabelERD(c, 200, 700, 'tickets', [['id', 'pk'], ['service_id', 'fk'], ['service_name', '']], {w: 420, warna: C.amber, rh: 46, n: pm > .2 ? 2 : 3, p: p2, sorotKolom: ['service_id']});
    K.tabelERD(c, 1200, 700, 'services', [['id', 'pk'], ['name', '']], {w: 420, rh: 46, p: p2, sorotKolom: pm > .9 ? ['name'] : []});
    if (pm > 0 && pm < 1) { const x = K.lerp(264, 1264, K.ease(pm)), y = K.lerp(700 + 58 + 6 + 2 * 46 + 23, 700 + 58 + 6 + 46 + 23, K.ease(pm));
      K.rrect(c, x - 10, y - 22, 280, 44, 10, 'rgba(255,176,32,.3)', C.amber, 2); K.text(c, 'name', x + 4, y, {size: 24, weight: 700, mono: true}); }
    const pk = O(S(t, D * .85, D * .85 + .5)); if (pk > 0) K.arrow(c, 620, 700 + 58 + 6 + 46 + 23, 1200, 700 + 58 + 6 + 23, C.sky, 5, pk, 18);
  }
};

// b08: label sebagai fakta sejarah
AD.labelSejarah = (c, t, D) => {
  K.bg(c); K.judul(c, 'Pengecualian yang disengaja', t, C.amber, 'Label tiket adalah fakta sejarah');
  const pa = O(S(t, .3, .9)); K.tiketKertas(c, 420, 450, 'A-012', {w: 380, h: 230, alpha: pa, bawah: 'Senin, 09.14'});
  const pb = O(S(t, D * .15, D * .15 + .6)); if (pb > 0) { c.save(); c.globalAlpha = pb;
    grid(c, 860, 300, ['tickets.label'], [['A-012']], {cw: [380], warna: C.amber, sel: [[['rgba(255,176,32,.2)', C.amber]]]});
    K.text(c, 'disimpan apa adanya', 1050, 450, {size: 28, weight: 700, color: C.amber, align: 'center'}); c.restore(); }
  const pc = S(t, D * .38, D * .38 + .8); if (pc > 0) { c.save(); c.globalAlpha = O(pc);
    K.text(c, 'Besok kode layanan diganti:', 860, 560, {size: 30, weight: 700, color: C.redup});
    grid(c, 860, 600, ['services.code'], [[pc > .6 ? 'O' : 'A']], {cw: [380], sel: pc > .6 ? [[['rgba(163,230,53,.2)', C.lime, C.lime]]] : null}); c.restore();
    const pd = O(S(t, D * .52, D * .52 + .5)); if (pd > 0) { K.centang(c, 1320, 370, 70, pd); K.text(c, 'Tiket kemarin tetap A-012', 1380, 375, {size: 32, weight: 800, color: C.lime, alpha: pd}); } }
  const pe = O(S(t, D * .72, D * .72 + .6)); if (pe > 0) { c.save(); c.globalAlpha = pe; K.rrect(c, 300, 860, 1320, 110, 55, 'rgba(255,176,32,.1)', C.amber, 3);
    K.text(c, 'Normalisasi adalah pedoman, bukan hukum.', 960, 915, {size: 42, weight: 900, align: 'center'}); c.restore(); }
};

// b09: ticket_events
AD.riwayat = (c, t, D) => {
  K.bg(c); K.judul(c, 'Menyimpan riwayat', t, C.teal, 'Status terakhir saja tidak cukup');
  const st = [['Menunggu', C.sky], ['Dipanggil', C.amber], ['Dilayani', C.teal], ['Selesai', C.lime]];
  const p0 = O(S(t, .3, .9));
  st.forEach(([n, w], i) => { c.save(); c.globalAlpha = p0; K.rrect(c, 160 + i * 300, 210, 240, 80, 40, 'rgba(255,255,255,.04)', w, 4); K.text(c, n, 280 + i * 300, 250, {size: 30, weight: 800, align: 'center'});
    if (i < 3) K.arrow(c, 405 + i * 300, 250, 455 + i * 300, 250, '#94a3b8', 4, 1, 12); c.restore(); });
  const pw = O(S(t, D * .2, D * .2 + .6)); if (pw > 0) { c.save(); c.globalAlpha = pw;
    K.text(c, 'Berapa lama menunggu?', 1440, 230, {size: 30, weight: 800, color: C.amber});
    c.strokeStyle = C.amber; c.lineWidth = 4; c.beginPath(); c.moveTo(280, 310); c.lineTo(280, 340); c.lineTo(580, 340); c.lineTo(580, 310); c.stroke(); K.text(c, '?', 430, 370, {size: 34, weight: 900, color: C.amber, align: 'center'}); c.restore(); }
  const ev = [['1', '12', 'waiting', '', '08.02'], ['2', '12', 'called', '2', '08.19'], ['3', '12', 'serving', '2', '08.21'], ['4', '12', 'done', '2', '08.33']];
  const n = Math.floor(K.clamp((t - D * .42) / (D * .4)) * 4.99);
  const pg = S(t, D * .38, D * .38 + .5); if (pg > 0) {
    grid(c, 330, 460, ['id', 'ticket_id', 'status', 'user_id', 'created_at'], ev.slice(0, n), {cw: [120, 220, 240, 200, 260], p: pg, warna: C.violet,
      warnaBaris: ev.map((_, i) => i === n - 1 ? 'rgba(167,139,250,.18)' : null)});
    K.text(c, 'ticket_events', 330, 430, {size: 30, weight: 800, mono: true, color: C.violet, alpha: O(pg)});
    const pn = O(S(t, D * .82, D * .82 + .5)); if (pn > 0) K.text(c, 'Baris lama tidak pernah diubah, hanya ditambah.', 330, 820, {size: 34, weight: 700, color: C.lime, alpha: pn});
  }
};

// b10: slot dan pemesanan
AD.slotBooking = (c, t, D) => {
  K.bg(c); K.judul(c, 'Pemesanan', t, C.teal, 'Dua tabel: slots dan bookings');
  const ps = S(t, .3, 1); K.tabelERD(c, 160, 230, 'slots', T.slots, {w: 440, p: ps});
  const pb = S(t, D * .3, D * .3 + .6); K.tabelERD(c, 1300, 230, 'bookings', T.bookings.slice(0, 4), {w: 440, warna: C.pink, p: pb, sorotKolom: t > D * .45 ? ['slot_id'] : []});
  if (pb > 0) K.kakiGagak(c, 600, 230 + 58 + 6 + 22, 1300, 230 + 58 + 6 + 44 + 22, S(t, D * .4, D * .5), C.pink, 2);
  // kartu slot dengan kuota
  const pk = O(S(t, D * .2, D * .2 + .6)); if (pk > 0) { c.save(); c.globalAlpha = pk; K.rrect(c, 160, 640, 640, 330, 24, 'rgba(163,230,53,.06)', C.lime, 4);
    K.text(c, 'Servis besar', 200, 700, {size: 36, weight: 800}); K.text(c, 'Sabtu, 09.00', 200, 750, {size: 30, weight: 600, color: '#cbd5e1'});
    K.text(c, 'kuota 2 motor', 560, 700, {size: 28, weight: 800, color: C.lime});
    [0, 1].forEach(i => { const p = S(t, D * .55 + i * .5, D * .55 + i * .5 + .5); if (p > 0) { c.globalAlpha = pk * O(p); K.motor(c, 300 + i * 220, 930, 150, [C.sky, C.amber][i]); } });
    c.restore(); }
  const p3 = S(t, D * .72, D * .72 + 1); if (p3 > 0) { const x = K.lerp(1150, 900, Math.sin(Math.min(1, p3) * Math.PI));
    c.save(); c.globalAlpha = O(p3); K.motor(c, x, 930, 150, C.violet); K.text(c, 'motor ketiga?', x, 760, {size: 30, weight: 800, align: 'center', color: C.coral}); c.restore();
    const pq = O(S(t, D * .82, D * .82 + .5)); if (pq > 0) { c.save(); c.globalAlpha = pq; K.rrect(c, 1100, 560, 640, 110, 26, 'rgba(255,176,32,.1)', C.amber, 3);
      K.text(c, 'Mencegah lebih dari kuota: bab 7', 1420, 615, {size: 34, weight: 800, align: 'center', color: C.amber}); c.restore(); } }
};

// b11 dan gambar docs/erd.png: rancangan lengkap
const POS = {services: [80, 330], counters: [80, 650], counter_services: [80, 870], tickets: [560, 170], ticket_events: [1060, 170],
  users: [1060, 560], slots: [1520, 170], bookings: [1520, 500]};
function erd(c, t, D, dari) {
  const urut = ['services', 'counters', 'counter_services', 'users', 'tickets', 'ticket_events', 'slots', 'bookings']; const R = {};
  urut.forEach((n, i) => { const p = dari ? 1 : S(t, .3 + i * .35, .9 + i * .35);
    const warna = {tickets: C.amber, ticket_events: C.violet, bookings: C.pink, slots: C.lime, users: C.sky, counters: C.sky, counter_services: C.sky}[n] || C.teal;
    R[n] = K.tabelERD(c, POS[n][0], POS[n][1], n, T[n], {w: 380, rh: 36, p, warna, tipe: false}); });
  const pl = dari ? 1 : S(t, 3.3, 4.6); const L = (a, ka, b, kb, off = 30) => { if (!R[a].baris || !R[b].baris) return;
    const ra = R[a], rb = R[b]; const kanan = rb.x > ra.x; const x1 = kanan ? ra.x + ra.w : ra.x, x2 = kanan ? rb.x : rb.x + rb.w;
    if (Math.abs(ra.x - rb.x) < 5) { const xx = ra.x; c.save(); c.strokeStyle = '#94a3b8'; c.lineWidth = 3; c.globalAlpha = O(pl);
      c.beginPath(); c.moveTo(xx, ra.baris(ka)); c.lineTo(xx - off, ra.baris(ka)); c.lineTo(xx - off, rb.baris(kb)); c.lineTo(xx, rb.baris(kb)); c.stroke(); c.restore(); return; }
    K.kakiGagak(c, x1, ra.baris(ka), x2, rb.baris(kb), pl, '#94a3b8', 2); };
  L('services', 'id', 'tickets', 'service_id'); L('tickets', 'id', 'ticket_events', 'ticket_id'); L('services', 'id', 'counter_services', 'service_id', 46);
  L('counters', 'id', 'counter_services', 'counter_id', 16); L('counters', 'id', 'users', 'counter_id'); L('users', 'id', 'ticket_events', 'user_id');
  L('slots', 'id', 'bookings', 'slot_id');
}
AD.erdLengkap = (c, t, D) => { K.bg(c); erd(c, t, D); K.text(c, 'Rancangan lengkap: 8 tabel', 80, 90, {size: 46, weight: 800, alpha: O(S(t, 0, .5))}); };
AD.erdGambar = (c, t, D) => { c.fillStyle = '#121829'; c.fillRect(0, 0, K.W, K.H); erd(c, t, D, true); K.text(c, 'SiAntre: rancangan database', 80, 90, {size: 46, weight: 800}); };

// b12 / b13: skema AI dengan kolom position
const SKEMA = ['CREATE TABLE tickets (', '  id SERIAL PRIMARY KEY,', '  service_id INTEGER REFERENCES services(id),', '  ticket_number VARCHAR(10),',
  '  position INTEGER,', "  status VARCHAR(20) DEFAULT 'waiting',", '  created_at TIMESTAMP DEFAULT NOW()', ');'];
AD.schemaAI = (c, t, D) => { K.bg(c); K.cekAIjudul(c, t); K.labelAI(c, 1380, 72, O(S(t, .3, .8)));
  K.rrect(c, 160, 160, 1100, 50, 25, 'rgba(255,255,255,.06)'); K.text(c, '› buatkan database aplikasi antrean', 190, 186, {size: 24, weight: 600, mono: true, color: C.redup, alpha: O(S(t, .2, .6))});
  const ch = Math.floor(K.clamp((t - .8) / (D * .3)) * 400);
  K.kode(c, SKEMA, 160, 250, {size: 34, chars: ch, sorot: t > D * .4 ? [4] : [], w: 1100});
  K.pikirkan(c, t, D, 1640, 860); };
AD.positionJawab = (c, t, D) => {
  K.bg(c); K.cekAIjudul(c, t);
  const fase = K.clamp((t - D * .12) / (D * .3)); const geser = K.ease(K.clamp(fase * 1.4 - .2));
  const L = ['A-010', 'A-011', 'A-012', 'A-013', 'A-014', 'A-015'];
  K.text(c, 'Setiap kali satu orang dipanggil…', 140, 200, {size: 36, weight: 700, alpha: O(S(t, .3, .8))});
  L.forEach((l, i) => { const x = 170 + i * 270 - geser * 270, y = 380; if (i === 0 && geser > .6) return; const a = i === 0 ? 1 - geser / .6 : 1;
    K.tiketKertas(c, x + 100, y, l, {w: 200, h: 120, alpha: a});
    const pos = i + 1 - (geser > .5 && i > 0 ? 1 : 0); const ubah = geser > .5 && i > 0;
    K.rrect(c, x + 40, y + 90, 120, 60, 12, ubah ? 'rgba(255,107,107,.2)' : 'rgba(255,255,255,.05)', ubah ? C.coral : '#475569', 2);
    K.text(c, 'pos ' + pos, x + 100, y + 120, {size: 26, weight: 800, align: 'center', mono: true, color: ubah ? C.coral : C.teks, alpha: a}); });
  const pu = O(S(t, D * .3, D * .3 + .6)); if (pu > 0) { c.save(); c.globalAlpha = pu;
    K.text(c, '100 menunggu  →  1 tombol panggil = 100 baris diubah', 140, 620, {size: 36, weight: 800, color: C.coral});
    K.text(c, 'Dua petugas menekan bersamaan  →  angka kacau', 140, 690, {size: 34, weight: 700, color: '#cbd5e1'}); c.restore(); }
  const pf = O(S(t, D * .6, D * .6 + .7)); if (pf > 0) { c.save(); c.globalAlpha = pf; K.rrect(c, 140, 780, 1640, 220, 26, 'rgba(163,230,53,.06)', C.lime, 4);
    K.text(c, 'Posisi tidak perlu disimpan, cukup dihitung:', 190, 835, {size: 34, weight: 800, color: C.lime});
    K.text(c, 'posisi = jumlah tiket menunggu yang datang lebih dulu + 1', 190, 920, {size: 36, weight: 700, mono: true}); c.restore(); }
};
})();
