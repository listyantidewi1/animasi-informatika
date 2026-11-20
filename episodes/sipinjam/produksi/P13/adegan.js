// Adegan penutup video (Bab 13 beat terakhir). Indeks kalimat 0-based.
(() => { const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
AD.penutup = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6);
  const A = t < t4 ? 1 : 1 - muncul(t, t4, .5), B = muncul(t, t4 + .4);
  if (A > 0) { c.save(); c.globalAlpha = A; K.judul(c, 'Dari nol sampai online', t, C.lime, 'SiPinjam, peminjaman alat lab dengan PHP dan MySQL');
    const d1 = Math.max(4, t2 - t1), f = [.06, .2, .33, .46, .68, .85, .92];
    [['Memasang alat', C.amber], ['Mewawancarai pemakai', C.pink], ['Merancang tujuh tabel', C.teal], ['Function, stored procedure, trigger', C.violet], ['Halaman untuk tiga peran', C.sky], ['Menguji', C.lime], ['Menyiapkan server', C.coral]].forEach(([s, w], i) => { const p = muncul(t, t1 + d1 * f[i], .4); if (p <= 0) return;
      c.save(); c.globalAlpha = A * p * (t >= t2 ? .5 : 1); const kol = i < 4 ? 0 : 1, br = i < 4 ? i : i - 4, x = 140 + kol * 840 + (1 - p) * 20, y = 220 + br * 112; K.rrect(c, x, y, 800, 92, 18, 'rgba(255,255,255,.05)', w, 4); K.centang(c, x + 50, y + 46, 40, p, w); K.text(c, s, x + 96, y + 48, {size: 32, weight: 800}); c.restore(); });
    const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = A * p2; const y = 690 + (1 - p2) * 20; K.rrect(c, 140, y, 1640, 300, 26, 'rgba(244,114,182,.09)', C.pink, 5); K.text(c, '13 kali', 200, y + 104, {size: 110, weight: 900, color: C.pink});
      K.text(c, 'mencari kesalahan di kode yang kelihatannya benar', 650, y + 90, {size: 38, weight: 800, maxW: 1080, lh: 1.25});
      K.text(c, 'Itulah keahlian yang membuat AI menjadi asisten yang berguna di tanganmu.', 200, y + 232, {size: 32, weight: 700, color: C.lime, alpha: muncul(t, t3)}); c.restore(); }
    c.restore(); }
  if (B > 0) { c.save(); c.globalAlpha = B; K.judul(c, 'Giliranmu', 9, C.amber);
    K.rrect(c, 140, 220, 800, 330, 24, 'rgba(255,176,32,.08)', C.amber, 5); K.text(c, 'TANTANGAN', 180, 274, {size: 26, weight: 900, color: C.amber}); K.text(c, 'Fitur perpanjangan pinjaman', 180, 340, {size: 42, weight: 900, maxW: 730, lh: 1.2});
    K.text(c, 'Lengkap dengan aturannya di database: berapa kali boleh, jatuh tempo baru, dan catatan di log.', 180, 420, {size: 27, weight: 600, color: '#c9d3ee', maxW: 720, lh: 1.35});
    K.chipRepo(c, muncul(t, t5), {x: 140, y: 710, w: 1060, ket: 'Seluruh kode dan README ada di GitHub'});
    const p6 = muncul(t, t6); if (p6 > 0) { c.save(); c.globalAlpha = B * p6; const x = 1010, y = 220 + (1 - p6) * 20, w = 770, h = 433; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 20, '#0d1222', C.sky, 5); c.shadowColor = 'transparent';
      c.fillStyle = C.sky; c.beginPath(); c.moveTo(x + w / 2 - 34, y + h / 2 - 76); c.lineTo(x + w / 2 + 44, y + h / 2 - 30); c.lineTo(x + w / 2 - 34, y + h / 2 + 16); c.fill();
      K.text(c, 'PLAYLIST', x + w / 2, y + h / 2 + 76, {size: 24, weight: 900, align: 'center', color: C.sky}); K.text(c, 'Membangun Aplikasi dari Nol', x + w / 2, y + h / 2 + 126, {size: 38, weight: 900, align: 'center'});
      K.text(c, 'Proyek lain di seri ini memakai Laravel', x + w / 2, y + h / 2 + 176, {size: 26, weight: 700, align: 'center', color: C.redup}); c.restore(); }
    K.text(c, 'Sampai jumpa di sana.', 140, 930, {size: 44, weight: 900, alpha: muncul(t, kt(a, 7))});
    c.restore(); }
};
})();
