// P03 Merancang database
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const T = {
  users: [['id', 'pk'], ['name', ''], ['email', ''], ['password', ''], ['role', '']],
  rates: [['id', 'pk'], ['type', ''], ['first_hour', ''], ['next_hour', ''], ['daily_max', '']],
  areas: [['id', 'pk'], ['name', ''], ['type', ''], ['capacity', '']],
  vehicles: [['id', 'pk'], ['plate', ''], ['type', ''], ['owner', '']],
  parkings: [['id', 'pk'], ['vehicle_id', 'fk'], ['area_id', 'fk'], ['entry_user_id', 'fk'], ['exit_user_id', 'fk'], ['entered_at', ''], ['exited_at', ''], ['fee', ''], ['open', '']],
  activity_logs: [['id', 'pk'], ['user_id', 'fk'], ['action', ''], ['detail', '']]};
const W = {users: C.violet, rates: C.amber, areas: C.lime, vehicles: C.sky, parkings: C.teal, activity_logs: C.pink};
const tabel = (c, n, x, y, o = {}) => K.tabelERD(c, x, y, n, T[n], Object.assign({warna: W[n], tipe: false}, o));
// b2 kata benda menjadi tabel
AD.kataBenda = (c, t, D, a) => { K.bg(c); K.judul(c, 'Dari kata benda menjadi tabel', t, C.teal, 'Kata benda yang muncul dalam obrolan di bab 2');
  const d = [['pengguna', 'users'], ['tarif', 'rates'], ['area parkir', 'areas'], ['kendaraan', 'vehicles'], ['transaksi parkir', 'parkings'], ['log aktivitas', 'activity_logs']], t1 = kt(a, 1), L = kt(a, 2) - t1, t3 = kt(a, 3), t4 = kt(a, 4);
  d.forEach(([id, en], i) => { const p = muncul(t, i < 5 ? t1 + .2 + i * (L - .6) / 5 : kt(a, 2) + 1.4); if (p <= 0) return; const x = 140 + (i % 3) * 560, y = 280 + Math.floor(i / 3) * 330, w = W[en], q = muncul(t, t3 + i * .25), r = muncul(t, t4 + .3 + i * .3);
    c.save(); c.globalAlpha = p; K.rrect(c, x, y + (1 - p) * 20, 520, 270, 22, 'rgba(255,255,255,.05)', w, 4); K.text(c, id, x + 260, y + 70, {size: 40, weight: 900, align: 'center'});
    if (q > 0) { c.globalAlpha = p * q; K.rrect(c, x + 60, y + 120, 400, 110, 14, '#18213c', w, 3); K.rrect(c, x + 60, y + 120, 400, 44, 14, w); c.fillStyle = w; c.fillRect(x + 60, y + 144, 400, 20); for (let k = 0; k < 2; k++) { c.fillStyle = '#3b4a75'; c.fillRect(x + 80, y + 180 + k * 22, 360, 3); }
      K.text(c, r > 0 ? en : 'tabel', x + 80, y + 143, {size: 24, weight: 800, mono: r > 0, color: '#0e1424'}); } c.restore(); });
  K.text(c, 'Nama tabel dan kolom: bahasa Inggris, mengikuti kebiasaan Laravel', 960, 990, {size: 30, weight: 800, align: 'center', color: C.amber, alpha: muncul(t, t4 + 1)});
};
// b3 users + rates, uang sebagai bilangan bulat
AD.usersRates = (c, t, D, a) => { K.bg(c); K.judul(c, 'users dan rates', t, C.violet, 'Peran pengguna dan tarif tiap jenis kendaraan');
  tabel(c, 'users', 140, 230, {p: muncul(t, .4), w: 400, rh: 52, sorotKolom: t >= kt(a, 1) ? ['role'] : []});
  const p1 = muncul(t, kt(a, 1) + .8); if (p1 > 0) { c.save(); c.globalAlpha = p1; ['admin', 'petugas', 'owner'].forEach((s, i) => { K.rrect(c, 140 + i * 136, 590, 126, 54, 27, 'rgba(167,139,250,.14)', C.violet, 3); K.text(c, s, 203 + i * 136, 618, {size: 22, weight: 800, align: 'center', mono: true}); }); c.restore(); }
  tabel(c, 'rates', 640, 230, {p: muncul(t, kt(a, 2)), w: 400, rh: 52, sorotKolom: t >= kt(a, 3) ? ['first_hour', 'next_hour', 'daily_max'] : []});
  const p2 = muncul(t, kt(a, 2) + 1.5); if (p2 > 0) { c.save(); c.globalAlpha = p2; [['motor', 2000, 1000, 8000], ['mobil', 5000, 2000, 20000]].forEach((r, i) => { const y = 590 + i * 62; K.rrect(c, 640, y, 400, 54, 10, 'rgba(255,176,32,.08)', C.amber, 2); K.text(c, r[0], 656, y + 28, {size: 20, weight: 800, mono: true, color: C.amber}); K.text(c, r.slice(1).join('  '), 1026, y + 28, {size: 20, weight: 700, mono: true, align: 'right'}); }); c.restore(); }
  const p3 = muncul(t, kt(a, 3)); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 1140, 230, 640, 250, 22, 'rgba(163,230,53,.07)', C.lime, 4); K.text(c, 'Bilangan bulat (integer)', 1180, 284, {size: 30, weight: 900, color: C.lime}); K.text(c, 'Rp2.000  →  2000', 1180, 360, {size: 44, weight: 800, mono: true}); K.text(c, 'selalu tepat', 1180, 430, {size: 28, weight: 700, color: C.redup}); c.restore(); }
  const p4 = muncul(t, kt(a, 4)); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 1140, 520, 640, 300, 22, 'rgba(255,107,107,.07)', C.coral, 4); K.text(c, 'Bilangan pecahan (float)', 1180, 574, {size: 30, weight: 900, color: C.coral}); K.text(c, '0.1 + 0.2', 1180, 650, {size: 40, weight: 800, mono: true}); K.text(c, '= 0.30000000000000004', 1180, 710, {size: 36, weight: 800, mono: true, color: C.coral}); K.text(c, 'tidak selalu tepat, dan rupiah tidak punya sen', 1180, 776, {size: 24, weight: 700, color: C.redup}); c.restore(); }
};
// b4 areas: terisi dihitung, bukan disimpan
AD.areas = (c, t, D, a) => { K.bg(c); K.judul(c, 'areas', t, C.lime, 'Nama area, jenis kendaraan, dan kapasitas');
  tabel(c, 'areas', 140, 240, {p: muncul(t, .4), w: 440, rh: 56});
  const p1 = muncul(t, kt(a, 1)); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 140, 560, 440, 70, 12, 'rgba(255,107,107,.1)', C.coral, 3); K.text(c, 'terisi', 204, 596, {size: 26, weight: 700, mono: true, color: C.coral}); K.coret(c, 190, 596, 320, 596, muncul(t, kt(a, 1) + 1.2)); K.text(c, 'tidak disimpan', 560, 596, {size: 24, weight: 800, align: 'right', color: C.coral}); c.restore(); }
  const p2 = muncul(t, kt(a, 2)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 700, 240, 1080, 620, 24, 'rgba(255,255,255,.04)', C.teal, 4); K.text(c, 'Dihitung dari parkings yang masih terbuka', 740, 296, {size: 32, weight: 900, color: C.teal});
    [['N1234AB', 'Area Motor', '1'], ['N4821KD', 'Area Motor', '1'], ['N2290AC', 'Area Motor', 'NULL'], ['N771EF', 'Area Motor', '1']].forEach(([pl, ar, op], i) => { const y = 350 + i * 76, on = op === '1'; K.rrect(c, 740, y, 1000, 62, 10, on ? 'rgba(45,212,191,.12)' : 'rgba(255,255,255,.03)', on ? C.teal : '#3b4a75', on ? 3 : 2); K.text(c, pl, 770, y + 32, {size: 26, weight: 700, mono: true, color: on ? C.teks : C.redup}); K.text(c, ar, 1080, y + 32, {size: 24, weight: 600, color: C.redup}); K.text(c, 'open = ' + op, 1710, y + 32, {size: 26, weight: 800, mono: true, align: 'right', color: on ? C.lime : C.redup}); });
    const q = muncul(t, kt(a, 2) + 2.5); c.globalAlpha = p2 * q; K.text(c, 'Area Motor', 740, 730, {size: 30, weight: 800}); K.text(c, '3 dari 40 tempat', 740, 790, {size: 50, weight: 900, mono: true, color: C.lime}); K.text(c, 'tidak pernah berbeda dengan kenyataan', 1740, 790, {size: 26, weight: 700, align: 'right', color: C.amber}); c.restore(); }
};
// b5 vehicles: plat dirapikan
AD.vehicles = (c, t, D, a) => { K.bg(c); K.judul(c, 'vehicles', t, C.sky, 'Setiap plat hanya boleh muncul satu kali');
  tabel(c, 'vehicles', 140, 240, {p: muncul(t, .4), w: 440, rh: 56, sorotKolom: ['plate']}); K.text(c, 'plate: unique', 360, 580, {size: 28, weight: 900, mono: true, align: 'center', color: C.amber, alpha: muncul(t, 2)});
  const t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), L = t3 - t2; const tulis = ['N 1234 AB', 'N1234AB', 'n 1234 ab'], ket = ['dengan spasi', 'tanpa spasi', 'huruf kecil'];
  tulis.forEach((s, i) => { const p = muncul(t, t2 + .3 + i * (L - .5) / 3); if (p <= 0) return; c.save(); c.globalAlpha = p; const y = 260 + i * 130; K.rrect(c, 700, y, 460, 100, 16, '#fff', '#94a3b8', 3); K.text(c, s, 930, y + 52, {size: 42, weight: 800, mono: true, align: 'center', color: '#0f172a'}); K.text(c, ket[i], 930, y + 122, {size: 22, weight: 700, align: 'center', color: C.redup});
    const q = muncul(t, t4 + .6 + i * .5); if (q > 0) K.arrow(c, 1180, y + 50, 1330, 440, C.lime, 5, q); c.restore(); });
  const p3 = muncul(t, t3) * (t < t4 ? 1 : 1 - muncul(t, t4, .4)); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 1240, 300, 540, 250, 22, 'rgba(255,107,107,.08)', C.coral, 4); K.text(c, 'Bagi manusia: sama', 1280, 370, {size: 32, weight: 800}); K.text(c, 'Bagi database:', 1280, 440, {size: 32, weight: 800}); K.text(c, 'tiga kendaraan berbeda', 1280, 496, {size: 34, weight: 900, color: C.coral}); c.restore(); }
  const p4 = muncul(t, t4 + .4); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 1340, 370, 440, 140, 20, 'rgba(163,230,53,.12)', C.lime, 5); K.text(c, 'N1234AB', 1560, 442, {size: 56, weight: 900, mono: true, align: 'center', color: C.lime});
    K.rrect(c, 700, 720, 1080, 130, 20, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'Sebelum disimpan, plat selalu dirapikan:', 740, 766, {size: 30, weight: 800}); K.text(c, 'huruf besar, tanpa spasi dan tanda lain', 740, 814, {size: 30, weight: 800, color: C.amber}); c.restore(); }
};
// b6 parkings: satu baris = satu kali parkir, biaya disimpan saat keluar
AD.parkings = (c, t, D, a) => { K.bg(c); K.judul(c, 'parkings', t, C.teal, 'Satu baris mewakili satu kali parkir');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4);
  const sor = t >= t3 ? ['fee'] : t >= t2 ? ['exit_user_id', 'exited_at', 'fee'] : t >= t1 ? ['vehicle_id', 'area_id', 'entry_user_id', 'entered_at'] : [];
  tabel(c, 'parkings', 140, 220, {p: muncul(t, .4), w: 480, rh: 62, sorotKolom: sor});
  const kartu = (y, h, w, judul, isi, p, extra) => { if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, 720, y + (1 - p) * 20, 1060, h, 22, 'rgba(255,255,255,.05)', w, 4); K.text(c, judul, 760, y + 52, {size: 32, weight: 900, color: w}); if (isi) K.text(c, isi, 760, y + 108, {size: 27, weight: 600, maxW: 980, lh: 1.3}); if (extra) extra(y); c.restore(); };
  kartu(220, 150, C.lime, 'Diisi saat kendaraan masuk', 'kendaraan, area, petugas pencatat, dan jam masuk', muncul(t, t1) * (t < t3 ? 1 : .4));
  kartu(400, 150, C.sky, 'Masih kosong (NULL) selama kendaraan di dalam', 'jam keluar, biaya, dan petugas pencatat keluar', muncul(t, t2) * (t < t3 ? 1 : .4));
  kartu(580, 340, C.amber, 'fee: disimpan pada saat kendaraan keluar', null, muncul(t, t3), y => { const q = muncul(t, t4); 
    K.text(c, 'Oktober 2026', 760, y + 120, {size: 26, weight: 700, color: C.redup}); K.text(c, 'tarif jam pertama Rp2.000', 760, y + 164, {size: 28, weight: 700}); K.text(c, 'pendapatan Rp7.775.000', 760, y + 214, {size: 34, weight: 900, mono: true, color: C.lime});
    if (q > 0) { c.globalAlpha *= q; K.arrow(c, 1210, y + 170, 1290, y + 170, '#94a3b8', 5, 1); K.text(c, 'Tahun depan', 1320, y + 120, {size: 26, weight: 700, color: C.redup}); K.text(c, 'tarif naik menjadi Rp3.000', 1320, y + 164, {size: 28, weight: 700}); K.text(c, 'Oktober 2026 tetap', 1320, y + 214, {size: 30, weight: 900, color: C.lime}); K.text(c, 'Rp7.775.000', 1320, y + 262, {size: 34, weight: 900, mono: true, color: C.lime}); } });
};
// b7 kolom open + aturan unik
AD.kolomOpen = (c, t, D, a) => { K.bg(c); K.judul(c, 'Kolom open', t, C.amber, 'Satu kolom kecil yang mencegah kendaraan masuk dua kali');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  const baris = [[1, 'N1234AB', 'Senin', 'NULL', 0], [2, 'N1234AB', 'Selasa', 'NULL', 0], [3, 'N1234AB', 'Rabu', t >= t2 + 1 ? 'NULL' : '1', t1], [4, 'N1234AB', 'Kamis', '1', t3 + 1], [5, 'N1234AB', 'Kamis', '1', t4]];
  const x = 140, w = 1000, y0 = 250; c.save(); c.globalAlpha = muncul(t, .4); K.rrect(c, x, y0, w, 64, 12, C.teal); ['id', 'kendaraan', 'masuk hari', 'open'].forEach((s, i) => K.text(c, s, x + [40, 150, 480, 800][i], y0 + 33, {size: 26, weight: 900, mono: true, color: '#0e1424'})); c.restore();
  baris.forEach(([id, pl, hr, op, tm], i) => { const p = i < 2 ? muncul(t, t5 - .2 + i * .4) : muncul(t, tm); if (p <= 0) return; const y = y0 + 84 + i * 84, tolak = i === 4, w2 = tolak ? C.coral : op === '1' ? C.lime : '#3b4a75';
    c.save(); c.globalAlpha = p; K.rrect(c, x, y + (1 - p) * 16, w, 70, 12, tolak ? 'rgba(255,107,107,.12)' : op === '1' ? 'rgba(163,230,53,.08)' : 'rgba(255,255,255,.03)', w2, 3);
    [String(id), pl, hr, op].forEach((s, k) => K.text(c, s, x + [40, 150, 480, 800][k], y + 36, {size: 28, weight: k === 3 ? 900 : 600, mono: true, color: k === 3 ? (op === '1' ? C.lime : C.redup) : C.teks}));
    if (tolak) { const q = muncul(t, t4 + 1.2); K.coret(c, x + 20, y + 36, x + w - 20, y + 36, q); } c.restore(); });
  const kartu = (y, h, wr, judul, isi, p) => { if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, 1200, y + (1 - p) * 20, 580, h, 20, 'rgba(255,255,255,.05)', wr, 4); K.text(c, judul, 1230, y + 46, {size: 28, weight: 900, color: wr, maxW: 520, lh: 1.2}); if (isi) K.text(c, isi, 1230, y + 46 + (h - 60) / 2 + 12, {size: 24, weight: 600, maxW: 520, lh: 1.3}); c.restore(); };
  kartu(250, 130, C.lime, 'Di dalam: open = 1', null, muncul(t, t1)); kartu(400, 130, C.sky, 'Sudah keluar: open = NULL', null, muncul(t, t2));
  kartu(550, 170, C.amber, 'unique (vehicle_id, open)', 'Pasangan kendaraan dan open tidak boleh kembar.', muncul(t, t3));
  kartu(740, 150, C.coral, 'Baris terbuka kedua: ditolak', 'N1234AB + 1 sudah ada.', muncul(t, t4 + 1.2));
  K.text(c, 'NULL tidak pernah dianggap sama dengan NULL yang lain, jadi riwayat boleh sebanyak apa pun.', 960, 1000, {size: 28, weight: 800, align: 'center', color: C.amber, alpha: muncul(t, t5 + 1)});
};
// b8 ERD lengkap
AD.erd = (c, t, D, a) => { K.bg(c); K.judul(c, 'Enam tabel dan hubungannya', t, C.teal, 'Garis bercabang = sisi yang "banyak"');
  const o = {rh: 40, w: 330}, m = i => muncul(t, .3 + i * .15);
  const L = tabel(c, 'activity_logs', 1450, 560, Object.assign({p: m(0), sorot: t < kt(a, 1)}, o));
  const U = tabel(c, 'users', 1450, 215, Object.assign({p: m(1)}, o)), R = tabel(c, 'rates', 140, 745, Object.assign({p: m(4)}, o));
  const V = tabel(c, 'vehicles', 140, 215, Object.assign({p: m(2)}, o)), Ar = tabel(c, 'areas', 140, 480, Object.assign({p: m(3)}, o));
  const P = tabel(c, 'parkings', 780, 230, Object.assign({p: m(5), w: 360}, o));
  const g = (k, d = .4) => K.seg(t, kt(a, k) + d, kt(a, k) + d + 1);
  K.kakiGagak(c, V.x + V.w, V.baris('id'), P.x, P.baris('vehicle_id'), g(2), C.sky); K.kakiGagak(c, Ar.x + Ar.w, Ar.baris('id'), P.x, P.baris('area_id'), g(3), C.lime);
  K.kakiGagak(c, U.x, U.baris('id'), P.x + P.w, P.baris('entry_user_id'), g(4), C.violet); K.kakiGagak(c, U.x, U.baris('id') + 8, P.x + P.w, P.baris('exit_user_id'), g(4, 1.6), C.violet);
  { c.save(); c.strokeStyle = C.pink; c.lineWidth = 4; c.globalAlpha = muncul(t, 2.2); c.beginPath(); c.moveTo(1615, U.y + U.h + 4); c.lineTo(1615, L.y - 4); c.stroke(); c.restore(); }
  [[2, 'Satu kendaraan, banyak transaksi', C.sky], [3, 'Satu area, banyak transaksi', C.lime], [4, 'Satu pengguna, banyak transaksi (masuk dan keluar)', C.violet]].forEach(([k, s, w], i) => { const p = muncul(t, kt(a, k)); if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, 540, 790 + i * 74, 860, 60, 30, 'rgba(14,20,36,.92)', w, 3); K.text(c, s, 970, 821 + i * 74, {size: 25, weight: 800, align: 'center'}); c.restore(); });
};
})();
