// L09 Test dan online
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
AD.susunanServer = (c, t, D, a) => { K.bg(c); K.judul(c, 'Membuat SiLapor online', t, C.amber);
  const t1 = kt(a, 1), t3 = kt(a, 3);
  K.text(c, 'Sejauh ini SiLapor hanya hidup di laptop kita.', 960, 460, {size: 44, weight: 800, align: 'center', alpha: muncul(t, .8) * (t > t1 ? 0 : 1)});
  [['Server Linux', 'VPS sewaan, atau komputer server di sekolah', C.sky], ['Nama domain', 'misalnya silapor.sekolahmu.sch.id', C.pink]].forEach((s, i) => { const p = muncul(t, t1 + .5 + i * 3); if (p <= 0) return; c.save(); c.globalAlpha = p * (t > t3 - .5 ? .0 : 1);
    K.rrect(c, 140 + i * 840, 330, 800, 260, 22, 'rgba(255,255,255,.05)', s[2], 4); K.text(c, s[0], 190 + i * 840, 420, {size: 48, weight: 900, color: s[2]}); K.text(c, s[1], 190 + i * 840, 500, {size: 28, weight: 600, maxW: 700}); c.restore(); });
  const kot = [['Internet', 'pengunjung', C.sky], ['Nginx', 'menerima request', C.lime], ['PHP-FPM', 'menjalankan Laravel', C.violet], ['MySQL', 'menyimpan data', C.teal]];
  kot.forEach((s, i) => { const p = muncul(t, t3 + i * 2.0); if (p <= 0) return; c.save(); c.globalAlpha = p; const x = 140 + i * 425; K.rrect(c, x, 400 + (1 - p) * 20, 365, 220, 22, 'rgba(255,255,255,.05)', s[2], 4);
    K.text(c, s[0], x + 182, 480, {size: 42, weight: 900, align: 'center', color: s[2]}); K.text(c, s[1], x + 182, 550, {size: 26, weight: 600, align: 'center'}); if (i) K.arrow(c, x - 56, 510, x - 6, 510, '#94a3b8', 6, p, 14); c.restore(); });
  const p4 = muncul(t, t3 + 6.5); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 555, 350, 1235, 320, 30, null, C.amber, 4); K.text(c, 'Satu server Linux', 1172, 720, {size: 30, weight: 800, align: 'center', color: C.amber}); c.restore(); }
};
AD.selesai = (c, t, D, a) => { K.bg(c); K.judul(c, 'Selesai', t, C.lime, 'Dari komputer kosong sampai aplikasi online');
  const langkah = ['Memasang alat', 'Kebutuhan', 'Rancangan data', 'Tabel dan SQL', 'Login', 'Upload aman', 'Alur status', 'Hak akses', 'Test dan online'], t1 = kt(a, 1), L = Math.max(4, kt(a, 2) - t1 - 1);
  langkah.forEach((s, i) => { const p = muncul(t, t1 + .3 + i * L / 9); if (p <= 0) return; c.save(); c.globalAlpha = p; const x = 140 + (i % 5) * 332 + (i >= 5 ? 166 : 0), y = 260 + Math.floor(i / 5) * 150;
    K.rrect(c, x, y + (1 - p) * 16, 300, 110, 18, 'rgba(255,255,255,.05)', [C.sky, C.pink, C.teal, C.violet, C.amber, C.lime, C.coral, C.sky, C.amber][i], 4); K.text(c, String(i + 1), x + 26, y + 56, {size: 34, weight: 900, color: C.redup}); K.text(c, s, x + 70, y + 56, {size: 28, weight: 800, maxW: 220}); c.restore(); });
  const p2 = muncul(t, kt(a, 2)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 590, 1640, 130, 20, 'rgba(244,114,182,.1)', C.pink, 4); K.text(c, 'Kamu tahu apa saja yang perlu diperiksa saat AI menyodorkan kode.', 190, 656, {size: 38, weight: 900, maxW: 1540}); c.restore(); }
  const p3 = muncul(t, kt(a, 3)); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, 'Daftar periksa: lihat deskripsi video', 960, 780, {size: 32, weight: 800, align: 'center', color: C.amber}); c.restore(); }
  const p4 = muncul(t, kt(a, 4)); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.text(c, 'Tantangan terakhir: kerjakan satu tantangan dari bab mana pun, lalu ceritakan di kolom komentar.', 960, 850, {size: 28, weight: 700, align: 'center', maxW: 1500}); c.restore(); }
  K.chipRepo(c, muncul(t, kt(a, 3) + 1.2), {ket: 'Kode lengkap, satu tag untuk setiap bab', y: 930});
};
})();
