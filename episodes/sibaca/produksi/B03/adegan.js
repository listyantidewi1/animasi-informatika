// B03 Merancang database
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b2: empat tabel dan hubungannya
AD.empatTabel = (c, t, D, a) => { K.bg(c); K.judul(c, 'Empat tabel', t, C.teal);
  const o = {w: 440, rh: 46};
  const pg = K.tabelERD(c, 720, 600, 'pengguna', [['id', 'pk'], ['nama', ''], ['nis', ''], ['kelas', ''], ['sandi_hash', ''], ['peran', ''], ['aktif', '']], {...o, rh: 42, warna: C.pink, p: muncul(t, kt(a, 1))});
  const bk = K.tabelERD(c, 110, 190, 'buku', [['id', 'pk'], ['judul', ''], ['penulis', ''], ['kategori', ''], ['tahun', '']], {...o, warna: C.amber, p: muncul(t, kt(a, 2))});
  const ek = K.tabelERD(c, 720, 190, 'eksemplar', [['id', 'pk'], ['buku_id', 'fk'], ['kode', ''], ['status', '']], {...o, warna: C.teal, p: muncul(t, kt(a, 3)), sorotKolom: t >= kt(a, 3) + 2.5 && t < kt(a, 4) ? ['kode'] : null});
  const pm = K.tabelERD(c, 1370, 190, 'peminjaman', [['id', 'pk'], ['eksemplar_id', 'fk'], ['pengguna_id', 'fk'], ['tgl_pinjam', ''], ['jatuh_tempo', ''], ['tgl_kembali', '']], {...o, warna: C.violet, p: muncul(t, kt(a, 4))});
  const t5 = kt(a, 5);
  if (t >= kt(a, 3) + .8) K.kakiGagak(c, 550, bk.baris('id'), 720, ek.baris('buku_id'), muncul(t, kt(a, 3) + .8, .7), C.amber, 2);
  if (t >= kt(a, 4) + .8) { K.kakiGagak(c, 1160, ek.baris('id'), 1370, pm.baris('eksemplar_id'), muncul(t, kt(a, 4) + .8, .7), C.teal, 2); K.kakiGagak(c, 1160, pg.baris('id'), 1370, pm.baris('pengguna_id'), muncul(t, kt(a, 4) + 2.2, .7), C.pink, 2); }
  const p5 = muncul(t, t5); if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, 110, 600, 520, 380, 22, 'rgba(255,255,255,.05)', C.lime, 4);
    K.text(c, '1 judul', 150, 670, {size: 40, weight: 900, color: C.amber}); K.text(c, '→ banyak eksemplar', 150, 724, {size: 34, weight: 800});
    const q = muncul(t, t5 + 3.2); c.globalAlpha = p5 * q; K.text(c, '1 eksemplar', 150, 830, {size: 40, weight: 900, color: C.teal}); K.text(c, '→ banyak catatan', 150, 884, {size: 34, weight: 800}); K.text(c, '    peminjaman', 150, 930, {size: 34, weight: 800}); c.restore(); }
};
// b10: dihitung dari baris yang nyata
AD.barisNyata = (c, t, D, a) => { K.bg(c); K.judul(c, 'Jumlah dihitung, bukan dipercaya', t, C.lime);
  const p = muncul(t, .3); c.save(); c.globalAlpha = p;
  K.rrect(c, 140, 240, 560, 300, 22, 'rgba(255,107,107,.07)', C.coral, 4); K.text(c, 'Kolom stok', 180, 300, {size: 34, weight: 900, color: C.coral}); K.text(c, 'stok = 3', 180, 400, {size: 72, weight: 900, mono: true}); K.text(c, 'angka yang diketik orang', 180, 490, {size: 28, weight: 700, color: C.redup});
  K.coret(c, 160, 520, 680, 260, muncul(t, 2.2, .5));
  c.restore();
  const q = muncul(t, 1.2); if (q <= 0) return; c.save(); c.globalAlpha = q; K.text(c, 'Tabel eksemplar', 860, 222, {size: 34, weight: 900, color: C.teal});
  [['B0001-1', 'tersedia'], ['B0001-2', 'dipinjam'], ['B0001-3', 'tersedia']].forEach(([k, s], i) => { const g = muncul(t, 1.6 + i * .7); if (g <= 0) return; c.globalAlpha = q * g; const y = 250 + i * 110; K.rrect(c, 860, y, 900, 92, 16, '#18213c', C.teal, 3);
    K.text(c, k, 900, y + 48, {size: 36, weight: 800, mono: true}); K.rrect(c, 1380, y + 20, 320, 54, 27, s === 'tersedia' ? 'rgba(163,230,53,.16)' : 'rgba(255,176,32,.16)', s === 'tersedia' ? C.lime : C.amber, 3); K.text(c, s, 1540, y + 48, {size: 30, weight: 800, align: 'center', color: s === 'tersedia' ? C.lime : C.amber}); });
  const h = muncul(t, 4.2); if (h > 0) { c.globalAlpha = q * h; K.rrect(c, 140, 640, 1620, 260, 26, 'rgba(163,230,53,.08)', C.lime, 5);
    K.text(c, 'COUNT = 3 eksemplar', 220, 730, {size: 54, weight: 900, mono: true}); K.text(c, 'tersedia = 2', 1160, 730, {size: 54, weight: 900, mono: true, color: C.lime});
    K.text(c, 'Setiap baris adalah satu buku fisik yang benar-benar ada di rak.', 220, 830, {size: 34, weight: 700, color: C.redup}); }
  c.restore(); };
})();
