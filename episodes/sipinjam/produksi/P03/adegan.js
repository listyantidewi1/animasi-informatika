// Adegan Bab 3 (merancang database): ERD. Indeks kalimat 0-based.
(() => { const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
AD.erd1 = (c, t, D, a) => { K.bg(c); K.judul(c, 'Tiga tabel pertama', t, C.teal, 'pengguna, kategori, dan alat');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), s = 1.3; c.save(); c.scale(s, s);
  K.tabelERD(c, 100, 160, 'pengguna', [['id', 'pk'], ['nama', ''], ['username', ''], ['sandi_hash', ''], ['peran', ''], ['kelas', '']], {w: 340, warna: C.sky, p: muncul(t, .5), n: Math.max(1, Math.min(6, 1 + Math.floor((t - 1.2) / .9)))});
  const kat = K.tabelERD(c, 560, 160, 'kategori', [['id', 'pk'], ['nama', '']], {w: 320, warna: C.violet, p: muncul(t, t1), sorotKolom: t >= t4 + 1.5 ? ['id'] : []});
  const al = K.tabelERD(c, 1010, 160, 'alat', [['id', 'pk'], ['kategori_id', 'fk'], ['kode', ''], ['nama', ''], ['jumlah_total', ''], ['stok', '']], {w: 360, warna: C.teal, p: muncul(t, t2),
    sorotKolom: t >= t4 ? ['kategori_id'] : t >= t3 ? ['jumlah_total', 'stok'] : t >= t2 + 2.8 ? ['jumlah_total', 'stok'] : []});
  if (t >= t4 + 1.5) K.kakiGagak(c, kat.x + kat.w, kat.baris('id'), al.x, al.baris('kategori_id'), K.out(K.seg(t, t4 + 1.5, t4 + 2.5)), C.amber, 2);
  c.restore();
  const p0 = t < t3 ? muncul(t, 2.2) * (t < t1 ? 1 : 1 - muncul(t, t1, .4)) : 0; if (p0 > 0) { c.save(); c.globalAlpha = p0; K.rrect(c, 130, 720, 800, 110, 18, 'rgba(56,189,248,.08)', C.sky, 4);
    K.text(c, 'sandi_hash: kata sandi yang sudah diacak', 170, 775, {size: 30, weight: 800}); c.restore(); }
  const p3 = t < t4 ? muncul(t, t3) : 1 - muncul(t, t4, .4); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 130, 720, 1660, 250, 20, 'rgba(45,212,191,.08)', C.teal, 4);
    K.text(c, 'Kamera DSLR', 180, 786, {size: 36, weight: 900, color: C.teal});
    K.text(c, 'jumlah_total = 2', 180, 856, {size: 34, weight: 800, mono: true}); K.text(c, 'banyaknya unit milik lab', 620, 856, {size: 30, weight: 600, color: C.redup});
    K.text(c, 'stok = 1', 180, 920, {size: 34, weight: 800, mono: true}); K.text(c, 'yang sedang tersedia (satu sedang dipinjam)', 620, 920, {size: 30, weight: 600, color: C.redup}); c.restore(); }
  const p4 = muncul(t, t4 + .4); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 130, 720, 1660, 250, 20, 'rgba(255,176,32,.08)', C.amber, 4);
    K.text(c, 'foreign key', 180, 790, {size: 44, weight: 900, color: C.amber, mono: true}); K.text(c, 'Kolom yang menunjuk ke baris di tabel lain.', 180, 862, {size: 32, weight: 700});
    K.text(c, 'alat.kategori_id  menunjuk ke  kategori.id: setiap alat punya tepat satu kategori.', 180, 924, {size: 28, weight: 600, color: C.redup}); c.restore(); }
};
AD.erd2 = (c, t, D, a) => { K.bg(c); K.judul(c, 'peminjaman adalah pusatnya', t, C.amber, t >= kt(a, 4) + 4 ? 'Tujuh tabel: pengguna, kategori, alat, peminjaman, pengembalian, log_aktivitas, pengaturan' : 'Tabel yang menghubungkan pengguna dan alat');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), s = 1.15; c.save(); c.scale(s, s);
  const sP = t >= t2 && t < t3 ? ['status'] : t >= t1 + 4.2 && t < t2 ? ['jumlah', 'tanggal_pinjam', 'jatuh_tempo', 'status'] : t >= t1 && t < t1 + 4.2 ? ['pengguna_id', 'alat_id'] : [];
  const U = K.tabelERD(c, 70, 190, 'pengguna', [['id', 'pk'], ['nama', ''], ['peran', '']], {w: 320, warna: C.sky, p: muncul(t, t1)});
  const P = K.tabelERD(c, 640, 168, 'peminjaman', [['id', 'pk'], ['pengguna_id', 'fk'], ['alat_id', 'fk'], ['jumlah', ''], ['tanggal_pinjam', ''], ['jatuh_tempo', ''], ['status', '']], {w: 380, warna: C.amber, p: muncul(t, .4), sorotKolom: sP});
  const A = K.tabelERD(c, 1270, 190, 'alat', [['id', 'pk'], ['kategori_id', 'fk'], ['nama', ''], ['stok', '']], {w: 320, warna: C.teal, p: muncul(t, t1 + 2.0)});
  if (t >= t1 + .6) K.kakiGagak(c, U.x + U.w, U.baris('id'), P.x, P.baris('pengguna_id'), K.out(K.seg(t, t1 + .6, t1 + 1.5)), '#cbd5e1', 2);
  if (t >= t1 + 2.6) K.kakiGagak(c, A.x, A.baris('id'), P.x + P.w, P.baris('alat_id'), K.out(K.seg(t, t1 + 2.6, t1 + 3.5)), '#cbd5e1', 2);
  const G = K.tabelERD(c, 640, 604, 'pengembalian', [['id', 'pk'], ['peminjaman_id', 'fk'], ['tanggal_kembali', ''], ['denda', ''], ['diterima_oleh', 'fk']], {w: 380, warna: C.lime, p: muncul(t, t3), sorotKolom: t >= t4 ? ['tanggal_kembali', 'denda', 'diterima_oleh'] : []});
  if (t >= t3 + .8) K.path(c, [[P.x, P.baris('id')], [P.x - 50, P.baris('id')], [P.x - 50, G.baris('peminjaman_id')], [G.x, G.baris('peminjaman_id')]], C.lime, 4, K.out(K.seg(t, t3 + .8, t3 + 1.8)), false);
  c.restore();
  // lima status
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2 * (t >= t3 ? .9 : 1); K.rrect(c, 1250, 640, 580, 370, 20, 'rgba(255,176,32,.07)', C.amber, 4); K.text(c, 'status: salah satu dari lima', 1284, 690, {size: 28, weight: 800, color: C.amber});
    ['diajukan', 'disetujui', 'ditolak', 'dibatalkan', 'dikembalikan'].forEach((st, i) => { const q = muncul(t, t2 + 1.6 + i * .8, .3); if (q <= 0) return; K.chipStatus(c, st, 1284 + (i % 2) * 270, 760 + Math.floor(i / 2) * 84, {size: 28, p: q}); }); c.restore(); }
  const p3 = muncul(t, t3 + 1.2); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 80, 700, 560, 290, 20, 'rgba(163,230,53,.07)', C.lime, 4); K.text(c, 'Mengapa dipisah?', 114, 752, {size: 30, weight: 900, color: C.lime});
    K.text(c, 'Tidak semua peminjaman sudah punya pengembalian.', 114, 812, {size: 27, weight: 700, maxW: 500, lh: 1.3}); K.text(c, 'Satu peminjaman: nol atau satu pengembalian.', 114, 904, {size: 24, weight: 600, color: C.redup, maxW: 500, lh: 1.3}); c.restore(); }
};
})();
