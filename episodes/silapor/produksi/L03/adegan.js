// L03 Merancang data
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const T = {users: [['id', 'pk'], ['name', ''], ['email', ''], ['password', ''], ['role', ''], ['classroom', '']], categories: [['id', 'pk'], ['name', '']],
  reports: [['id', 'pk'], ['user_id', 'fk'], ['category_id', 'fk'], ['title', ''], ['description', ''], ['location', ''], ['photo', ''], ['status', ''], ['created_at', '']],
  report_updates: [['id', 'pk'], ['report_id', 'fk'], ['user_id', 'fk'], ['status', ''], ['note', ''], ['photo', ''], ['created_at', '']]};
const W = {users: C.sky, categories: C.violet, reports: C.amber, report_updates: C.teal};
const tab = (c, n, x, y, o = {}) => K.tabelERD(c, x, y, n, T[n], Object.assign({warna: W[n]}, o));
AD.kataBenda = (c, t, D, a) => { K.bg(c); K.judul(c, 'Mencari kata benda', t, C.teal, 'Setiap kata benda adalah calon tabel');
  const kal = ['Sebagai siswa, saya ingin melihat riwayat laporan saya.', 'Sebagai petugas, saya ingin menyaring laporan per kategori.']; const kata = ['siswa', 'petugas', 'kategori', 'laporan', 'riwayat']; const t1 = kt(a, 1);
  c.save(); c.globalAlpha = muncul(t, .4); K.rrect(c, 140, 230, 1640, 250, 20, '#fef3c7', '#d6b56b', 3); K.text(c, 'Catatan kebutuhan', 180, 272, {size: 24, weight: 800, color: '#8a6d3b'});
  kal.forEach((s, j) => { let x = 180; s.split(' ').forEach(w => { const b = w.replace(/[.,]/g, ''), i = kata.indexOf(b), on = i >= 0 && t > t1 + .6 + i * .9, lw = K.lebar(c, w + ' ', 36, 700);
      if (on) K.rrect(c, x - 6, 330 + j * 76 - 28, lw - 2, 56, 10, 'rgba(45,212,191,.45)'); K.text(c, w, x, 332 + j * 76, {size: 36, weight: 700, color: '#3b2f1d'}); x += lw; }); }); c.restore();
  kata.forEach((k, i) => { const p = muncul(t, t1 + .9 + i * .9); if (p <= 0) return; c.save(); c.globalAlpha = p; const x = 140 + i * 332; K.rrect(c, x, 600 + (1 - p) * 20, 300, 130, 20, 'rgba(45,212,191,.1)', C.teal, 4); K.text(c, k, x + 150, 666, {size: 40, weight: 900, align: 'center'}); c.restore(); });
  K.text(c, 'Setiap kata benda itu calon tabel.', 960, 860, {size: 40, weight: 800, align: 'center', color: C.amber, alpha: muncul(t, kt(a, 2))});
};
AD.tabelUsers = (c, t, D, a) => { K.bg(c); K.judul(c, 'Satu tabel untuk semua yang login', t, C.sky);
  K.tokoh(c, 'lina', 260, 560, 300, muncul(t, .4)); K.tokoh(c, 'hendra', 520, 560, 300, muncul(t, .8)); K.arrow(c, 700, 420, 880, 420, '#94a3b8', 6, muncul(t, 1.6));
  const t1 = kt(a, 1), t2 = kt(a, 2); tab(c, 'users', 940, 230, {w: 460, rh: 60, p: muncul(t, 1.8), sorotKolom: t > t2 ? ['classroom'] : t > t1 ? ['role'] : []});
  const p1 = muncul(t, t1 + .8); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.text(c, 'role', 1460, 560, {size: 30, weight: 800, mono: true, color: C.amber}); K.rrect(c, 1460, 600, 150, 56, 28, C.sky); K.text(c, 'siswa', 1535, 629, {size: 26, weight: 800, align: 'center', color: '#0e1424'}); K.text(c, 'atau', 1650, 629, {size: 24, weight: 600, align: 'center', color: C.redup}); K.rrect(c, 1690, 600, 150, 56, 28, C.teal); K.text(c, 'admin', 1765, 629, {size: 26, weight: 800, align: 'center', color: '#0e1424'}); c.restore(); }
  const p2 = muncul(t, t2 + .6); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 760, 1640, 190, 20, 'rgba(255,255,255,.04)', C.garis, 2);
    [['Lina', 'siswa', 'XI RPL 1'], ['Dimas', 'siswa', 'XI RPL 2'], ['Pak Hendra', 'admin', '(kosong)']].forEach((r, i) => r.forEach((v, j) => K.text(c, v, 200 + j * 520, 800 + i * 54, {size: 30, weight: j ? 600 : 800, mono: j > 0, color: j === 2 ? C.amber : C.teks}))); c.restore(); }
};
AD.kategoriTabel = (c, t, D, a) => { K.bg(c); K.judul(c, 'Kenapa kategori menjadi tabel sendiri?', t, C.violet);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), kiri = t < t4 ? 1 : .3;
  c.save(); c.globalAlpha = muncul(t, t1) * kiri; K.text(c, 'Diketik bebas', 140, 250, {size: 32, weight: 900, color: C.coral});
  ['proyektor', 'infokus', 'proyektr', 'Proyektor kelas'].forEach((s, i) => { const p = muncul(t, t2 + i * 1.0); if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, 140, 290 + i * 100, 560, 80, 12, '#fff', '#94a3b8', 3); K.text(c, s, 170, 331 + i * 100, {size: 32, weight: 700, color: '#1e293b'});
    if (t > t3 + .8) { if (i === 0) K.centang(c, 760, 330, 44, muncul(t, t3 + .8), C.lime); else { c.globalAlpha *= muncul(t, t3 + .8 + i * .3); K.text(c, '✕', 760, 332 + i * 100, {size: 44, weight: 900, align: 'center', color: C.coral}); } } c.restore(); });
  const p3 = muncul(t, t3); if (p3 > 0) { c.globalAlpha = p3 * kiri; K.rrect(c, 140, 710, 760, 110, 16, 'rgba(255,107,107,.1)', C.coral, 3); K.text(c, 'Saring “proyektor”: hanya 1 dari 4 yang ketemu', 170, 766, {size: 26, weight: 800, maxW: 720}); } c.restore();
  const p4 = muncul(t, t4); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.text(c, 'Dipilih dari tabel categories', 1000, 250, {size: 32, weight: 900, color: C.lime}); K.rrect(c, 1000, 290, 700, 80, 12, '#fff', '#16a34a', 4); K.text(c, 'Pilih kategori', 1030, 331, {size: 32, weight: 700, color: '#64748b'}); K.text(c, '▾', 1650, 331, {size: 32, color: '#1e293b'});
    ['Ruang kelas', 'Laboratorium', 'Toilet', 'Listrik dan lampu', 'Perpustakaan', 'Lapangan dan kantin'].forEach((s, i) => { const q = muncul(t, t4 + .6 + i * .25); c.globalAlpha = p4 * q; K.rrect(c, 1000, 380 + i * 72, 700, 66, 8, i === 0 ? '#dbeafe' : '#f8fafc', '#cbd5e1', 2); K.text(c, s, 1030, 414 + i * 72, {size: 28, weight: 700, color: '#1e293b'}); }); c.restore(); }
};
AD.tabelReports = (c, t, D, a) => { K.bg(c); K.judul(c, 'Tabel utama: reports', t, C.amber);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), L = (t2 < 9e8 ? t2 : D) - t1, n = t < t1 ? 1 : Math.min(9, 1 + Math.ceil((t - t1) / (L / 8.5)));
  const ket = {user_id: 'siapa pelapornya', category_id: 'apa kategorinya', title: 'judul singkat', description: 'cerita masalahnya', location: 'lokasi', photo: 'foto', status: 'status', created_at: 'waktu laporan dibuat'};
  const b = tab(c, 'reports', 140, 220, {w: 520, rh: 66, n, p: muncul(t, .5), sorotKolom: t > t2 ? ['photo'] : []});
  T.reports.slice(1, n).forEach(([k]) => K.text(c, ket[k], 700, b.baris(k), {size: 30, weight: 600, color: C.redup}));
  const p2 = muncul(t, t2 + .5); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 1160, 300, 640, 230, 20, 'rgba(255,176,32,.08)', C.amber, 4); K.text(c, 'Di database: nama berkasnya', 1195, 350, {size: 28, weight: 800, color: C.amber}); K.text(c, 'foto/k3Xw…9aQ.jpg', 1195, 430, {size: 36, weight: 700, mono: true}); c.restore(); }
  const p3 = muncul(t, t3 + 1.5); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.arrow(c, 1480, 540, 1480, 620, C.amber, 5, p3); K.rrect(c, 1160, 630, 640, 280, 20, 'rgba(255,255,255,.04)', '#64748b', 3); K.text(c, 'Di server: berkas fotonya', 1195, 680, {size: 28, weight: 800});
    K.rrect(c, 1380, 720, 200, 150, 12, '#1e293b', '#94a3b8', 3); K.rrect(c, 1430, 770, 100, 50, 8, '#475569'); c.fillStyle = '#fde68a'; c.beginPath(); c.arc(1545, 795, 14, 0, 7); c.fill(); c.restore(); }
};
AD.foreignKey = (c, t, D, a) => { K.bg(c); K.judul(c, 'Nomor id yang menunjuk ke tabel lain', t, C.sky);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  const u = tab(c, 'users', 140, 240, {w: 400, rh: 52, n: 2, p: muncul(t, .4)}), k = tab(c, 'categories', 140, 640, {w: 400, rh: 52, p: muncul(t, .4)});
  const r = tab(c, 'reports', 760, 300, {w: 460, rh: 56, n: 4, p: muncul(t, .6), sorotKolom: t > t1 ? ['user_id', 'category_id'] : []});
  K.kakiGagak(c, 540, u.baris('id'), 760, r.baris('user_id'), S(t, 1.2, 2)); K.kakiGagak(c, 540, k.baris('id'), 760, r.baris('category_id'), S(t, 1.6, 2.4));
  K.text(c, 'foreign key', 1280, 420, {size: 44, weight: 900, color: C.sky, alpha: muncul(t, t1 + .8)});
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 1280, 500, 520, 150, 18, 'rgba(255,255,255,.05)', C.lime, 3); K.text(c, 'Satu siswa: banyak laporan', 1310, 550, {size: 28, weight: 800}); K.text(c, 'Satu kategori: banyak laporan', 1310, 604, {size: 28, weight: 800}); c.restore(); }
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 760, 740, 1040, 190, 18, 'rgba(255,107,107,.1)', C.coral, 4); K.text(c, "INSERT INTO reports (user_id, ...) VALUES (99, ...)", 795, 796, {size: 28, weight: 700, mono: true});
    K.text(c, 'Ditolak database: pengguna nomor 99 tidak ada', 795, 868, {size: 32, weight: 900, color: C.coral}); c.restore(); }
};
const barisWaktu = (c, x, y, w, hari, teks, p, o = {}) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, x, y, w, 96, 14, o.latar || 'rgba(255,255,255,.05)', o.warna || '#64748b', 3); K.text(c, hari, x + 30, y + 49, {size: 28, weight: 900, color: o.warna || C.redup}); K.text(c, teks, x + 190, y + 49, {size: 30, weight: 700, color: o.coret ? C.redup : C.teks});
  if (o.coret) K.coret(c, x + 180, y + 49, x + 200 + K.lebar(c, teks, 30, 700), y + 49, o.coret); c.restore(); };
AD.riwayatTertimpa = (c, t, D, a) => { K.bg(c); K.judul(c, 'Cara gampang: kolom balasan di tabel reports', t, C.coral);
  const t1 = kt(a, 1), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  c.save(); c.globalAlpha = muncul(t, Math.min(t1, 2)); K.rrect(c, 140, 250, 1640, 220, 18, '#18213c', C.amber, 3); ['id', 'title', 'status', 'balasan'].forEach((h, i) => K.text(c, h, 180 + [0, 110, 600, 860][i], 296, {size: 26, weight: 800, mono: true, color: i === 3 ? C.amber : C.redup}));
  K.text(c, '13', 180, 392, {size: 30, weight: 700, mono: true}); K.text(c, 'Proyektor tidak menyala', 290, 392, {size: 30, weight: 700}); K.chipStatus(c, t > t4 ? 'selesai' : 'diproses', 780, 392, {size: 24});
  const isi = t > t4 + .6 ? 'Lampu proyektor sudah diganti.' : t > t3 + .6 ? 'Teknisi datang besok.' : ''; K.rrect(c, 1020, 350, 720, 84, 10, 'rgba(255,176,32,.12)', C.amber, 3); K.text(c, isi, 1045, 393, {size: 30, weight: 800}); c.restore();
  barisWaktu(c, 240, 560, 1440, 'Senin', 'Petugas menulis: “Teknisi datang besok.”', muncul(t, t3), {coret: t > t5 ? S(t, t5, t5 + .7) : 0});
  barisWaktu(c, 240, 680, 1440, 'Rabu', 'Petugas menulis: “Lampu proyektor sudah diganti.”', muncul(t, t4), {warna: C.sky});
  const p5 = muncul(t, t5 + .8); if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, 240, 830, 1440, 120, 18, 'rgba(255,107,107,.1)', C.coral, 4); K.text(c, 'Balasan hari Senin tertimpa. Kapan laporan ini mulai dikerjakan?', 960, 891, {size: 34, weight: 800, align: 'center'}); c.restore(); }
};
AD.tabelRiwayat = (c, t, D, a) => { K.bg(c); K.judul(c, 'Tabel keempat: report_updates', t, C.teal, 'Setiap kejadian menjadi satu baris baru');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  c.save(); c.globalAlpha = muncul(t, .5); K.rrect(c, 140, 240, 1640, 76, 14, C.teal); ['siapa', 'status', 'catatan', 'foto', 'waktu'].forEach((h, i) => K.text(c, h, 180 + [0, 250, 500, 1180, 1340][i], 279, {size: 28, weight: 900, mono: true, color: '#0e1424'})); c.restore();
  [['Lina', 'baru', 'Laporan dibuat.', '', 'Sen 07.10'], ['Pak Hendra', 'diproses', 'Teknisi datang besok.', '', 'Sen 09.30'], ['Pak Hendra', 'selesai', 'Lampu proyektor sudah diganti.', 'ada', 'Rab 13.05']].forEach((r, i) => { const p = muncul(t, t1 + .8 + i * 2.2); if (p <= 0) return; c.save(); c.globalAlpha = p; const y = 330 + i * 96 + (1 - p) * 30;
    K.rrect(c, 140, y, 1640, 84, 12, 'rgba(255,255,255,.05)', '#3b4a75', 2); K.text(c, r[0], 180, y + 43, {size: 28, weight: 700}); K.chipStatus(c, r[1], 430, y + 43, {size: 22}); K.text(c, r[2], 680, y + 43, {size: 28, weight: 600}); K.text(c, r[3], 1360, y + 43, {size: 26, weight: 700, color: C.amber}); K.text(c, r[4], 1520, y + 43, {size: 26, weight: 600, mono: true, color: C.redup}); c.restore(); });
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2 * (t < t3 ? 1 : .45); K.rrect(c, 140, 660, 800, 280, 20, 'rgba(45,212,191,.08)', C.teal, 4); K.text(c, 'Hanya boleh ditambah', 180, 720, {size: 38, weight: 900, color: C.teal});
    [['INSERT', true], ['UPDATE', false], ['DELETE', false]].forEach(([s, ok], i) => { K.text(c, s, 200, 790 + i * 54, {size: 32, weight: 800, mono: true, color: ok ? C.teks : C.redup}); if (ok) K.centang(c, 420, 790, 36, 1, C.lime); else K.text(c, '✕', 420, 792 + i * 54, {size: 34, weight: 900, align: 'center', color: C.coral}); }); c.restore(); }
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 1000, 660, 780, 280, 14, '#fef3c7', '#d6b56b', 4); K.text(c, 'Buku servis motor', 1040, 712, {size: 30, weight: 900, color: '#8a6d3b'});
    ['12 Jan   ganti oli', '03 Apr   servis ringan', '21 Jul   ganti kampas rem'].forEach((s, i) => K.text(c, s, 1040, 780 + i * 54, {size: 28, weight: 600, mono: true, color: '#3b2f1d'})); K.motor(c, 1660, 900, 180, C.coral); c.restore(); }
};
AD.statusSalinan = (c, t, D, a) => { K.bg(c); K.judul(c, 'Kenapa reports masih punya kolom status?', t, C.amber);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), beda = t > t2 + 1.2 && t < t3;
  c.save(); c.globalAlpha = muncul(t, .5); K.rrect(c, 140, 250, 700, 300, 20, '#18213c', C.amber, 4); K.text(c, 'reports', 180, 300, {size: 30, weight: 900, mono: true, color: C.amber}); K.text(c, 'Proyektor tidak menyala', 180, 380, {size: 30, weight: 700}); K.text(c, 'status', 180, 470, {size: 28, weight: 700, mono: true, color: C.redup}); K.chipStatus(c, beda ? 'diproses' : 'selesai', 320, 470, {size: 30});
  K.rrect(c, 1080, 250, 700, 300, 20, '#18213c', C.teal, 4); K.text(c, 'report_updates', 1120, 300, {size: 30, weight: 900, mono: true, color: C.teal}); ['baru', 'diproses', 'selesai'].forEach((s, i) => { K.chipStatus(c, s, 1120, 370 + i * 60, {size: 24}); if (i === 2) K.text(c, '← status terakhir', 1300, 490, {size: 26, weight: 800, color: C.teal}); }); c.restore();
  const p1 = muncul(t, t1); if (p1 > 0) { K.arrow(c, 1070, 470, 850, 470, C.amber, 6, p1); K.text(c, 'salinan', 960, 430, {size: 28, weight: 900, align: 'center', color: C.amber, alpha: p1});
    c.save(); c.globalAlpha = p1 * (t < t2 ? 1 : .4); K.rrect(c, 140, 620, 1640, 110, 18, 'rgba(163,230,53,.08)', C.lime, 3); K.text(c, 'Daftar laporan bisa disaring dengan cepat, tanpa membuka riwayatnya satu per satu.', 960, 676, {size: 32, weight: 800, align: 'center'}); c.restore(); }
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2 * (t < t3 ? 1 : .4); K.rrect(c, 140, 760, 1640, 110, 18, 'rgba(255,107,107,.1)', C.coral, 3); K.text(c, 'Risikonya: dua tempat itu bisa tidak sama.', 960, 816, {size: 32, weight: 800, align: 'center', color: C.coral}); c.restore(); }
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 140, 900, 1640, 110, 18, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'Bab 7: keduanya selalu diubah bersama, di dalam satu transaksi.', 960, 956, {size: 32, weight: 800, align: 'center'}); c.restore(); }
};
AD.alurStatus = (c, t, D, a) => { K.bg(c); K.judul(c, 'Aturan jalan status', t, C.amber, 'Tidak ada panah yang mundur');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  const N = {baru: [300, 500], diproses: [860, 360], selesai: [1420, 360], ditolak: [860, 700]};
  const simpul = (s, p, akhir) => { if (p <= 0) return; const [x, y] = N[s]; c.save(); c.globalAlpha = p; K.rrect(c, x - 150, y - 60, 300, 120, 60, K.WS[s]); K.text(c, s, x, y + 2, {size: 44, weight: 900, align: 'center', color: '#fff'}); if (akhir > 0) { c.globalAlpha = p * akhir; K.rrect(c, x - 162, y - 72, 324, 144, 72, null, '#fff', 5); K.text(c, 'akhir', x, y + 104, {size: 24, weight: 800, align: 'center', color: C.redup}); } c.restore(); };
  simpul('baru', muncul(t, .5)); simpul('diproses', muncul(t, t1 + .8)); simpul('ditolak', muncul(t, t1 + 2)); simpul('selesai', muncul(t, t2 + .6), muncul(t, t3)); if (t > t3) simpul('ditolak', 1, muncul(t, t3 + 1));
  K.arrow(c, 450, 470, 700, 390, '#e2e8f0', 7, S(t, t1 + .3, t1 + 1)); K.arrow(c, 450, 540, 700, 670, '#e2e8f0', 7, S(t, t1 + 1.5, t1 + 2.2)); K.arrow(c, 1015, 360, 1260, 360, '#e2e8f0', 7, S(t, t2 + .2, t2 + .9));
  const p4 = muncul(t, t4) * (t < t5 ? 1 : .0); if (p4 > 0) { c.save(); c.globalAlpha = p4 * .9; c.setLineDash([14, 12]); K.arrow(c, 1400, 440, 500, 600, C.coral, 6, 1); c.setLineDash([]); K.text(c, '✕', 950, 520, {size: 90, weight: 900, align: 'center', color: C.coral}); c.restore(); }
  const p5 = muncul(t, t5); if (p5 > 0) { c.save(); c.globalAlpha = p5; K.kode(c, ["'baru'     => ['diproses', 'ditolak'],", "'diproses' => ['selesai'],", "'selesai'  => [],", "'ditolak'  => [],"], 1100, 560, {size: 28, w: 700}); c.restore(); }
};
AD.erdLengkap = (c, t, D, a) => { K.bg(c); K.judul(c, 'Rancangan lengkap', t, C.teal, 'ERD: empat tabel, setiap garis berarti satu ke banyak');
  const u = tab(c, 'users', 120, 240, {w: 360, rh: 46, p: muncul(t, .4)}), k = tab(c, 'categories', 120, 720, {w: 360, rh: 46, p: muncul(t, .8)});
  const r = tab(c, 'reports', 740, 240, {w: 400, rh: 46, p: muncul(t, 1.2)}), h = tab(c, 'report_updates', 1400, 330, {w: 400, rh: 46, p: muncul(t, 1.6)});
  const t2 = kt(a, 2); K.kakiGagak(c, 480, u.baris('id'), 740, r.baris('user_id'), S(t, t2, t2 + .7)); K.kakiGagak(c, 480, k.baris('id'), 740, r.baris('category_id'), S(t, t2 + .5, t2 + 1.2));
  K.kakiGagak(c, 1140, r.baris('id'), 1400, h.baris('report_id'), S(t, t2 + 1, t2 + 1.7));
  // users -> report_updates lewat bawah
  const p = S(t, t2 + 1.5, t2 + 2.4); if (p > 0) K.path(c, [[480, u.baris('name')], [600, u.baris('name')], [600, 960], [1280, 960], [1280, h.baris('user_id')], [1400, h.baris('user_id')]], '#cbd5e1', 4, p, false);
  K.text(c, 'Simpan gambar ini: di bab berikutnya kita mengetiknya menjadi tabel sungguhan.', 960, 1020, {size: 28, weight: 800, align: 'center', color: C.amber, alpha: muncul(t, kt(a, 3))});
};
})();
