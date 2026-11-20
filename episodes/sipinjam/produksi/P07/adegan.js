// Adegan Bab 7: membedah SQL injection. Indeks kalimat 0-based (adegan mulai di kalimat 4).
(() => { const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
AD.injeksi = (c, t, D, a) => { K.bg(c); K.judul(c, 'Apa yang sebenarnya sampai ke MySQL?', t, C.coral);
  const t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6), t7 = kt(a, 7), t8 = kt(a, 8), akt = t >= t8 ? 3 : t >= t6 ? 2 : t >= t5 ? 1 : t >= t4 ? 0 : -1;
  // kode AI
  const p0 = muncul(t, .2); c.save(); c.globalAlpha = p0; K.text(c, 'Kode login bergaya AI: ketikan pengguna ditempel langsung ke dalam SQL', 140, 204, {size: 26, weight: 700, color: C.redup});
  K.rrect(c, 140, 230, 1640, 76, 14, '#0a0f1e', '#3b4a75', 3); K.text(c, '"SELECT * FROM pengguna WHERE username = \'$username\' AND sandi = \'$sandi\'"', 170, 269, {size: 28, weight: 600, mono: true, color: '#cbd5e1'});
  // ketikan
  K.text(c, 'Yang diketik di kolom username', 140, 352, {size: 26, weight: 700, color: C.redup}); K.rrect(c, 140, 376, 560, 80, 12, '#fff', '#64748b', 3); K.text(c, "' OR 1=1 -- ", 168, 417, {size: 38, weight: 800, mono: true, color: '#0f172a'});
  K.text(c, 'Kata sandi: sembarang', 740, 417, {size: 28, weight: 700, color: C.redup}); c.restore();
  // hasil
  const p1 = muncul(t, .8); c.save(); c.globalAlpha = p1; K.text(c, 'Perintah yang akhirnya dijalankan', 140, 506, {size: 26, weight: 700, color: C.redup});
  K.rrect(c, 140, 530, 1640, 190, 16, '#0a0f1e', C.coral, 4); const size = 38, y1 = 590, y2 = 660; K.text(c, 'SELECT * FROM pengguna', 180, y1, {size, weight: 600, mono: true});
  const seg = [["WHERE username = '", '#eef2fb', -1], ["'", C.amber, 0], [' OR 1=1', C.coral, 1], [" -- ' AND sandi = 'asal'", '#aab4d0', 2]]; let x = 180;
  seg.forEach(([s, w, i]) => { const lw = K.lebar(c, s, size, 700, true), on = i >= 0 && akt >= i && akt < 3 ? (akt === i ? 1 : .0) : 0, sudah = i >= 0 && t >= [t4, t5, t6][i];
    if (i >= 0 && akt === i) { c.save(); c.globalAlpha = p1 * muncul(t, [t4, t5, t6][i], .3); K.rrect(c, x - 6, y2 - 30, lw + 12, 60, 8, 'rgba(255,255,255,.08)', w === '#aab4d0' ? '#94a3b8' : w, 4); c.restore(); }
    K.text(c, s, x, y2, {size, weight: 700, mono: true, color: i === 2 && t >= t6 ? '#6b7690' : sudah || i < 0 ? w : '#eef2fb'});
    if (i === 2 && t >= t6) { const q = muncul(t, t6 + .5, .6); c.strokeStyle = '#94a3b8'; c.lineWidth = 4; c.beginPath(); c.moveTo(x + 14, y2); c.lineTo(x + 14 + (lw - 14) * q, y2); c.stroke(); }
    x += lw; });
  c.restore();
  // tiga penjelasan
  [[t4, C.amber, "Tanda kutip  '", 'menutup teks username lebih awal'], [t5, C.coral, 'OR 1=1', 'selalu benar, jadi semua baris cocok'], [t6, '#94a3b8', 'Dua tanda minus', 'sisanya menjadi komentar, termasuk pemeriksaan kata sandi']].forEach(([tk, w, j, s], i) => { const p = muncul(t, tk); if (p <= 0) return; c.save(); c.globalAlpha = p * (akt === i || akt === 3 ? 1 : .55);
    const x = 140 + i * 556, y = 750 + (1 - p) * 20; K.rrect(c, x, y, 528, 140, 18, 'rgba(255,255,255,.05)', w, akt === i ? 5 : 3); K.text(c, j, x + 26, y + 44, {size: 32, weight: 900, color: w, mono: i < 2}); K.text(c, s, x + 26, y + 84, {size: 24, weight: 600, maxW: 480, lh: 1.25}); c.restore(); });
  const p7 = muncul(t, t7); if (p7 > 0) { c.save(); c.globalAlpha = p7; const w = 420; K.rrect(c, 1780 - w, 476, w, 60, 30, C.coral); K.text(c, 'SQL injection', 1780 - w / 2, 507, {size: 34, weight: 900, align: 'center', color: '#141a2c'}); c.restore(); }
  const p8 = muncul(t, t8); if (p8 > 0) { c.save(); c.globalAlpha = p8; K.rrect(c, 140, 916, 1640, 124, 20, 'rgba(163,230,53,.1)', C.lime, 4); K.text(c, 'Prepared statement', 176, 956, {size: 32, weight: 900, color: C.lime});
    K.text(c, 'WHERE username = ?', 560, 956, {size: 32, weight: 800, mono: true}); K.text(c, 'Ketikan yang sama hanya dianggap sebagai username yang aneh, dan login-nya gagal.', 176, 1004, {size: 27, weight: 600}); c.restore(); }
};
})();
