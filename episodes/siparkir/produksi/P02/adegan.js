// P02 Kebutuhan
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b2 Bu Ratna dan cara lama
AD.buRatna = (c, t, D, a) => { K.bg(c); K.judul(c, 'SMK Nusa Bakti', t, C.teal, 'Lahan parkir yang dikelola koperasi sekolah');
  K.tokoh(c, 'ratna', 300, 820, 400, muncul(t, .3));
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  // lahan parkir
  const p1 = muncul(t, t1) * (t < t2 ? 1 : 1 - muncul(t, t2 - .3, .4)); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 620, 250, 1160, 520, 24, 'rgba(255,255,255,.03)', '#475569', 3);
    K.text(c, 'Halaman depan sekolah', 660, 300, {size: 28, weight: 800, color: C.redup});
    for (let i = 0; i < 6; i++) { c.strokeStyle = '#64748b'; c.lineWidth = 3; c.strokeRect(680 + i * 120, 350, 110, 150); if ([0, 1, 3, 4].includes(i)) K.motor(c, 735 + i * 120, 480, 100, [C.coral, C.sky, C.lime, C.amber][i % 4]); }
    for (let i = 0; i < 3; i++) { c.strokeStyle = '#64748b'; c.lineWidth = 3; c.strokeRect(680 + i * 250, 560, 230, 170); if (i !== 1) K.mobil(c, 795 + i * 250, 705, 180, i ? C.violet : C.teal); }
    ['tamu', 'orang tua siswa', 'warga'].forEach((s, i) => { const q = muncul(t, t1 + 2.2 + i * 1.5); c.globalAlpha = p1 * q; K.rrect(c, 1480, 360 + i * 110, 270, 76, 38, 'rgba(45,212,191,.12)', C.teal, 3); K.text(c, s, 1615, 399 + i * 110, {size: 28, weight: 800, align: 'center'}); }); c.restore(); }
  // buku + karcis
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2 * (t < t3 ? 1 : .45); K.rrect(c, 640, 260, 560, 380, 8, '#fef9e7', '#d6b56b', 4); K.text(c, 'Buku parkir', 670, 300, {size: 24, weight: 800, color: '#8a6d3b'});
    [['N 4821 KD', '07.10'], ['N 13?5 B?', '07.2?'], ['N 2290 AC', '08.05'], ['?? 771 EF', '08.4?']].forEach(([pl, j], i) => { c.strokeStyle = '#e5d9b6'; c.lineWidth = 2; c.beginPath(); c.moveTo(660, 370 + i * 64); c.lineTo(1180, 370 + i * 64); c.stroke();
      K.text(c, pl, 680, 345 + i * 64, {size: 32, weight: 600, color: '#1e3a8a'}); K.text(c, j, 1060, 345 + i * 64, {size: 32, weight: 600, color: '#1e3a8a'}); });
    const q = muncul(t, t2 + 2.5); c.globalAlpha = p2 * q * (t < t3 ? 1 : .45); K.kertas(c, 1300, 300, 300, [['KARCIS PARKIR', undefined, {tebal: 1}], ['-'], ['No. 0457', undefined, {besar: 1}], ['Motor'], ['-'], ['Simpan karcis ini']], 1, {rot: .06}); c.restore(); }
  // tiga masalah
  const p3 = muncul(t, t3); if (p3 > 0) { const L = D - t3 - 1; [['Tulisan sulit dibaca', 'plat dan jam sering salah terbaca', C.coral], ['Biaya dihitung di luar kepala', 'tiap petugas bisa berbeda', C.amber], ['Rekap akhir bulan dengan kalkulator', 'ratusan baris dijumlah satu per satu', C.violet]].forEach(([j, s, w], i) => { const q = muncul(t, t3 + .3 + i * Math.min(3.2, L / 3.2)); if (q <= 0) return;
      c.save(); c.globalAlpha = q; const y = 690 + i * 100; K.rrect(c, 640, y + (1 - q) * 16, 1140, 84, 18, 'rgba(14,20,36,.92)', w, 4); K.text(c, j, 680, y + 43, {size: 30, weight: 900, color: w}); K.text(c, s, 1740, y + 43, {size: 24, weight: 600, align: 'right'}); c.restore(); }); }
};
// b3 tarif tiga lapis
AD.tarif = (c, t, D, a) => { K.bg(c); K.judul(c, 'Bagaimana cara Ibu menghitung tarifnya?', t, C.pink, 'Pertanyaan yang paling penting');
  K.tokoh(c, 'ratna', 300, 820, 400, 1);
  K.balon(c, 520, 215, 620, 'Ada tiga lapis.', muncul(t, kt(a, 1)), {size: 32});
  const baris = [['Jam pertama', 2000, 5000, 2, 0], ['Tiap jam berikutnya', 1000, 2000, 2, 1.8], ['Paling banyak per hari', 8000, 20000, 3, 0]];
  const pT = muncul(t, kt(a, 2) - .3); if (pT <= 0) return; c.save(); c.globalAlpha = pT; const x = 560, y = 380, w = 1220;
  K.rrect(c, x, y, w, 520, 24, 'rgba(255,255,255,.04)', '#475569', 3); K.text(c, 'Motor', x + 720, y + 56, {size: 36, weight: 900, align: 'center', color: C.sky}); K.motor(c, x + 720, y + 30, 0, C.sky);
  K.text(c, 'Mobil', x + 1020, y + 56, {size: 36, weight: 900, align: 'center', color: C.violet, alpha: muncul(t, kt(a, 4))}); c.restore();
  baris.forEach(([n, m, mb, k, d], i) => { const p = muncul(t, kt(a, k, d)); if (p <= 0) return; const yy = y + 120 + i * 130; c.save(); c.globalAlpha = p; K.rrect(c, x + 30, yy, w - 60, 104, 16, 'rgba(255,255,255,.05)', [C.amber, C.sky, C.lime][i], 3);
    K.nomor(c, i + 1, x + 90, yy + 52, [C.amber, C.sky, C.lime][i]); K.text(c, n, x + 150, yy + 53, {size: 32, weight: 800}); K.text(c, K.rp(m), x + 720, yy + 53, {size: 40, weight: 900, align: 'center', mono: true});
    K.text(c, K.rp(mb), x + 1020, yy + 53, {size: 40, weight: 900, align: 'center', mono: true, alpha: muncul(t, kt(a, 4) + .5 + i * .9)}); c.restore(); });
};
// b4 kelonggaran lima menit
AD.kelonggaran = (c, t, D, a) => { K.bg(c); K.judul(c, 'Bagaimana kalau lewat sedikit?', t, C.pink, 'Aturan yang tidak tertulis di mana pun');
  K.tokoh(c, 'ratna', 300, 820, 400, 1);
  K.balon(c, 880, 215, 900, 'Kalau satu jam tiga menit, Bu?', muncul(t, .8), {warna: C.sky, teks: '#0e1424', size: 32, ekor: 'kanan'});
  K.balon(c, 520, 350, 760, 'Petugas memberi kelonggaran lima menit.', muncul(t, kt(a, 1) + 1.2), {size: 32});
  const p2 = muncul(t, kt(a, 2)); if (p2 > 0) { c.save(); c.globalAlpha = p2; const x0 = 620, x1 = 1740, y = 640; c.strokeStyle = '#94a3b8'; c.lineWidth = 6; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
    const X = m => x0 + (m - 50) / 25 * (x1 - x0); [50, 55, 60, 65, 70, 75].forEach(m => { c.fillStyle = '#94a3b8'; c.fillRect(X(m) - 2, y - 14, 4, 28); K.text(c, m + "'", X(m), y + 46, {size: 24, weight: 700, align: 'center', color: C.redup}); });
    K.rrect(c, X(60), y - 60, X(65) - X(60), 46, 8, 'rgba(163,230,53,.25)', C.lime, 3); K.text(c, 'kelonggaran', (X(60) + X(65)) / 2, y - 84, {size: 22, weight: 800, align: 'center', color: C.lime});
    const tb = kt(a, 2) + 1; [[65, '1 jam 5 menit', 'masih 1 jam', K.rp(2000), C.lime, 0], [66, '1 jam 6 menit', 'sudah 2 jam', K.rp(3000), C.coral, (kt(a, 3) - kt(a, 2)) * .45]].forEach(([m, s, k, r, w, d], i) => { const q = muncul(t, tb + d); if (q <= 0) return; c.globalAlpha = p2 * q;
      c.fillStyle = w; c.beginPath(); c.arc(X(m), y, 13, 0, 7); c.fill(); const bx = i ? 1290 : 700; K.rrect(c, bx, 740, 440, 170, 20, 'rgba(14,20,36,.94)', w, 4); K.text(c, s, bx + 30, 786, {size: 30, weight: 800}); K.text(c, k, bx + 30, 834, {size: 28, weight: 800, color: w}); K.text(c, r, bx + 30, 880, {size: 30, weight: 900, mono: true});
      c.strokeStyle = w; c.lineWidth = 3; c.beginPath(); c.moveTo(X(m), y + 14); c.lineTo(bx + (i ? 60 : 380), 740); c.stroke(); }); c.restore(); }
  K.text(c, 'Kita mendapatkannya hanya karena bertanya.', 1180, 990, {size: 34, weight: 900, align: 'center', color: C.amber, alpha: muncul(t, kt(a, 4))});
};
// b5 tiga contoh hitungan
AD.tigaContoh = (c, t, D, a) => { K.bg(c); K.judul(c, 'Tiga contoh hitungan dari Bu Ratna', t, C.amber, 'Dicatat apa adanya');
  const d = [['Motor', '07.00', '09.20', '2 jam 20 menit', 4000, '2.000 + 2 × 1.000', C.sky, 1], ['Motor', '07.00', '17.30', '10 jam 30 menit', 8000, 'menyentuh batas harian', C.lime, 2], ['Mobil', '07.00', 'besok 09.00', '1 hari + 2 jam', 27000, '20.000 + 5.000 + 2.000', C.violet, 3]];
  d.forEach(([j, m, k, l, b, ket, w, kk], i) => { const p = muncul(t, kt(a, kk)); if (p <= 0) return; c.save(); c.globalAlpha = p; const y = 230 + i * 215 + (1 - p) * 20; K.rrect(c, 140, y, 1640, 185, 22, 'rgba(255,255,255,.05)', w, 4);
    K.nomor(c, i + 1, 210, y + 92, w); if (j === 'Motor') K.motor(c, 340, y + 130, 130, w); else K.mobil(c, 340, y + 135, 150, w); K.text(c, j, 340, y + 160, {size: 22, weight: 800, align: 'center', color: C.redup});
    K.text(c, 'masuk ' + m, 480, y + 62, {size: 32, weight: 800, mono: true}); K.arrow(c, 740, y + 62, 830, y + 62, '#94a3b8', 5, 1); K.text(c, 'keluar ' + k, 860, y + 62, {size: 32, weight: 800, mono: true});
    K.text(c, l, 480, y + 124, {size: 26, weight: 600, color: C.redup}); const q = muncul(t, kt(a, kk) + 2.4); c.globalAlpha = p * q; K.text(c, K.rp(b), 1740, y + 66, {size: 56, weight: 900, align: 'right', mono: true, color: w}); K.text(c, ket, 1740, y + 132, {size: 26, weight: 700, align: 'right'}); c.restore(); });
  const p4 = muncul(t, kt(a, 4)); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 560, 890, 800, 90, 45, C.amber); K.text(c, 'Di bab 7, ketiganya menjadi test', 960, 936, {size: 34, weight: 900, align: 'center', color: '#141a2c'}); c.restore(); }
};
// b6 Pak Joko
AD.pakJoko = (c, t, D, a) => { K.bg(c); K.judul(c, 'Mengobrol dengan Pak Joko', t, C.pink, 'Petugas jaga pagi');
  K.tokoh(c, 'joko', 300, 820, 400, muncul(t, .3));
  const langkah = (y, w, isi, p, judul) => { if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, 580, y + (1 - p) * 20, 1200, 190, 22, 'rgba(255,255,255,.05)', w, 4); K.text(c, judul, 620, y + 44, {size: 28, weight: 900, color: w});
    isi.forEach((s, i) => { const x = 620 + i * 390; K.rrect(c, x, y + 80, 330, 80, 14, 'rgba(14,20,36,.9)', '#64748b', 2); K.text(c, s, x + 165, y + 121, {size: 26, weight: 800, align: 'center', mono: i < 2 && /\d/.test(s)}); if (i < isi.length - 1) K.arrow(c, x + 338, y + 120, x + 382, y + 120, w, 5, 1, 14); }); c.restore(); };
  langkah(230, C.lime, ['ketik plat', 'pilih jenis', 'tiket tercetak'], muncul(t, kt(a, 1)), 'Kendaraan masuk: secepat mungkin');
  langkah(450, C.sky, ['ketik tiket atau plat', 'aplikasi menghitung', 'struk'], muncul(t, kt(a, 2)), 'Kendaraan keluar: biaya dihitung aplikasi');
  const p3 = muncul(t, kt(a, 3)); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 580, 680, 1200, 250, 22, 'rgba(255,107,107,.08)', C.coral, 4); K.text(c, 'Keluhan Pak Joko', 620, 726, {size: 28, weight: 900, color: C.coral});
    const q = muncul(t, kt(a, 4)); c.globalAlpha = p3 * q; for (let i = 0; i < 20; i++) { K.rrect(c, 620 + (i % 10) * 46, 760 + Math.floor(i / 10) * 60, 38, 50, 6, 'rgba(255,107,107,.5)', C.coral, 2); }
    K.text(c, 'Area Motor', 1140, 790, {size: 30, weight: 800}); K.text(c, '40 dari 40 tempat', 1140, 840, {size: 34, weight: 900, mono: true, color: C.coral}); K.text(c, 'Petugas perlu tahu sebelum kendaraan masuk.', 1140, 892, {size: 24, weight: 700, color: C.amber}); c.restore(); }
};
})();
