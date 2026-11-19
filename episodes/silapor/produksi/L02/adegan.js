// L02 Kebutuhan
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const kertas = (c, x, y, teks, rot, p) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; c.translate(x, y); c.rotate(rot); K.rrect(c, -110, -70, 220, 140, 6, '#fef3c7', '#d6b56b', 3); K.text(c, teks, 0, -8, {size: 20, weight: 700, align: 'center', color: '#3b2f1d', maxW: 190, lh: 1.25}); c.restore(); };
AD.pakHendra = (c, t, D, a) => { K.bg(c); K.judul(c, 'SMK Nusa Bakti', t, C.teal, 'Cara melapor selama ini');
  K.tokoh(c, 'hendra', 330, 800, 430, muncul(t, .3));
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  // alur: siswa -> ketua kelas -> kertas / WA
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.orang(c, 800, 420, 170, C.sky); K.text(c, 'siswa', 800, 452, {size: 24, weight: 700, align: 'center', color: C.redup});
    K.arrow(c, 870, 340, 1010, 340, '#94a3b8', 5, muncul(t, t1 + .8)); const q = muncul(t, t1 + 1.2); c.globalAlpha = q; K.orang(c, 1090, 420, 170, C.violet); K.text(c, 'ketua kelas', 1090, 452, {size: 24, weight: 700, align: 'center', color: C.redup}); c.restore(); }
  kertas(c, 1380, 300, 'Proyektor XI RPL 2 mati', -.06, muncul(t, t1 + 3.2));
  const pw = muncul(t, t1 + 5); if (pw > 0) { c.save(); c.globalAlpha = pw; K.rrect(c, 1560, 220, 250, 190, 20, '#dcfce7', '#16a34a', 3); K.text(c, 'WhatsApp', 1685, 256, {size: 22, weight: 800, align: 'center', color: '#166534'});
    K.rrect(c, 1580, 290, 210, 44, 12, '#fff'); K.text(c, 'Pak, proyektor mati', 1592, 313, {size: 18, weight: 600, color: '#1e293b'}); c.restore(); }
  // masalah: kertas terselip, pesan tenggelam
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2; for (let i = 0; i < 5; i++) kertas(c, 940 + i * 46, 690 + (i % 2) * 22, i === 2 ? 'Proyektor XI RPL 2 mati' : '...', -.2 + i * .1, 1);
    K.text(c, 'kertas terselip', 1030, 830, {size: 30, weight: 800, align: 'center', color: C.coral});
    const q = muncul(t, t2 + 2.2); c.globalAlpha = q; ['Jadwal piket besok', 'Info rapat guru', 'Pak, proyektor mati', 'Foto kegiatan (12)', 'Undangan lomba'].forEach((s, i) => { K.rrect(c, 1420, 560 + i * 56, 390, 46, 12, i === 2 ? '#fef3c7' : '#e2e8f0'); K.text(c, s, 1440, 584 + i * 56, {size: 20, weight: i === 2 ? 800 : 600, color: i === 2 ? '#92400e' : '#64748b'}); });
    K.text(c, 'pesan tenggelam', 1615, 880, {size: 30, weight: 800, align: 'center', color: C.coral}); c.restore(); }
  const p3 = muncul(t, t3); K.balon(c, 520, 500, 380, 'Yang mana yang sudah saya tangani?', p3, {size: 26}); 
  const p4 = muncul(t, t3 + 3); if (p4 > 0) K.text(c, 'Siswa merasa laporannya tidak pernah dibaca.', 1280, 970, {size: 32, weight: 800, align: 'center', color: C.amber, alpha: p4});
};
AD.empatSaringan = (c, t, D, a) => { K.bg(c); K.judul(c, 'Bertanya kepada Pak Hendra', t, C.pink, 'Tanyakan pekerjaannya, bukan aplikasinya');
  K.tokoh(c, 'hendra', 300, 820, 400, 1);
  K.balon(c, 560, 220, 900, 'Apa yang ingin Bapak lihat setiap pagi?', muncul(t, kt(a, 0) + .8), {warna: C.sky, teks: '#0e1424', size: 34, ekor: 'kanan'});
  K.balon(c, 470, 380, 760, 'Semua laporan yang masuk, dan saya ingin bisa menyaringnya.', muncul(t, kt(a, 1)), {size: 30});
  const d = [['Per tanggal', '17 November 2026', C.amber], ['Per bulan', 'untuk rapat bulanan', C.lime], ['Per siswa', 'laporan dari satu siswa', C.sky], ['Per kategori', 'misalnya laboratorium saja', C.violet]]; const t2 = kt(a, 2), L = (kt(a, 3) < 9e8 ? kt(a, 3) : D) - t2;
  d.forEach(([n, s, w], i) => { const p = muncul(t, t2 + .6 + i * (L - 1) / 4); if (p <= 0) return; c.save(); c.globalAlpha = p; const x = 640 + (i % 2) * 590, y = 610 + Math.floor(i / 2) * 170 + (1 - p) * 20;
    K.rrect(c, x, y, 560, 140, 20, 'rgba(255,255,255,.05)', w, 4); K.nomor(c, i + 1, x + 60, y + 70, w); K.text(c, n, x + 116, y + 50, {size: 34, weight: 900}); K.text(c, s, x + 116, y + 98, {size: 24, weight: 600, color: C.redup}); c.restore(); });
  K.text(c, 'Satu pertanyaan, empat saringan', 1230, 980, {size: 34, weight: 900, align: 'center', color: C.amber, alpha: muncul(t, kt(a, 3))});
};
AD.aksiPetugas = (c, t, D, a) => { K.bg(c); K.judul(c, 'Apa yang dilakukan pada sebuah laporan?', t, C.pink);
  K.tokoh(c, 'hendra', 300, 820, 400, 1); K.kartuLaporan(c, 620, 230, 620, {p: muncul(t, .6), status: t > kt(a, 2) + 3.5 ? 'selesai' : t > kt(a, 2) + .8 ? 'diproses' : 'baru'});
  const p1 = muncul(t, kt(a, 1)); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 620, 430, 1160, 150, 20, 'rgba(255,255,255,.05)', C.sky, 4); K.text(c, '1  Membalas', 660, 478, {size: 32, weight: 900, color: C.sky}); K.text(c, '“Teknisi datang besok.”', 660, 534, {size: 34, weight: 700}); c.restore(); }
  const t2 = kt(a, 2); [['2  Menandai sedang dikerjakan', 'diproses', .2], ['3  Menandai selesai, dengan foto hasil perbaikan', 'selesai', 3.2]].forEach(([s, st, d], i) => { const p = muncul(t, t2 + d); if (p <= 0) return; c.save(); c.globalAlpha = p; const y = 610 + i * 180;
    K.rrect(c, 620, y, 1160, 150, 20, 'rgba(255,255,255,.05)', K.WS[st], 4); K.text(c, s, 660, y + 50, {size: 32, weight: 900, color: K.WS[st]}); K.chipStatus(c, st, 660, y + 104, {size: 24});
    if (i === 1) { K.rrect(c, 1560, y + 22, 180, 106, 10, '#1e293b', '#94a3b8', 3); K.rrect(c, 1610, y + 52, 80, 40, 6, '#fde68a'); K.text(c, 'foto', 1650, y + 112, {size: 16, weight: 700, align: 'center', color: C.redup}); } c.restore(); });
};
AD.lina = (c, t, D, a) => { K.bg(c); K.judul(c, 'Giliran siswa', t, C.pink);
  K.tokoh(c, 'lina', 300, 820, 400, muncul(t, .3));
  K.balon(c, 470, 220, 900, 'Saya cuma ingin tahu apakah laporan saya sudah dibaca, dan sudah sampai mana.', muncul(t, kt(a, 1)), {size: 32});
  const t2 = kt(a, 2); [['Status laporannya', C.amber], ['Balasan dari petugas', C.sky], ['Perkembangan perbaikannya', C.lime]].forEach(([s, w], i) => { const p = muncul(t, t2 + .8 + i * 1.6); if (p <= 0) return; c.save(); c.globalAlpha = p; const y = 500 + i * 120; K.rrect(c, 640, y, 760, 96, 18, 'rgba(255,255,255,.05)', w, 4); K.centang(c, 700, y + 48, 40, p, w); K.text(c, s, 760, y + 49, {size: 34, weight: 800}); c.restore(); });
  const p3 = muncul(t, kt(a, 3)); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, 'Laporan saya', 1480, 470, {size: 28, weight: 900, color: C.redup}); ['selesai', 'diproses', 'baru'].forEach((s, i) => K.kartuLaporan(c, 1480, 500 + i * 150, 330, {status: s, judul: ['Keran bocor', 'Kursi patah', 'Proyektor mati'][i], sub: ['2 November', '9 November', '17 November'][i], h: 130})); c.restore(); }
};
AD.dimas = (c, t, D, a) => { K.bg(c); K.judul(c, 'Hal yang tidak terpikir oleh kita', t, C.pink);
  K.tokoh(c, 'dimas', 300, 820, 400, muncul(t, .3));
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1 * (t < t3 ? 1 : .35); K.rrect(c, 640, 250, 380, 300, 10, '#bae6fd', '#e2e8f0', 12); c.strokeStyle = '#0f172a'; c.lineWidth = 4; c.beginPath(); [[830, 400, 700, 290], [830, 400, 960, 300], [830, 400, 720, 520], [830, 400, 980, 470], [830, 400, 850, 260]].forEach(([x1, y1, x2, y2]) => { c.moveTo(x1, y1); c.lineTo(x2, y2); }); c.stroke();
    K.text(c, 'kaca jendela pecah', 830, 600, {size: 28, weight: 800, align: 'center'}); K.orang(c, 1250, 560, 300, '#7c3aed', {ekspresi: 'kesal'}); K.text(c, 'kakak kelas', 1250, 600, {size: 28, weight: 800, align: 'center'}); c.restore(); }
  K.balon(c, 1400, 250, 420, 'Jangan sampai dia tahu siapa yang melapor.', muncul(t, t2) * (t < t3 ? 1 : .35), {size: 28});
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 620, 680, 1180, 250, 26, 'rgba(14,20,36,.96)', C.amber, 5); K.text(c, 'ATURAN PENTING', 670, 736, {size: 26, weight: 900, color: C.amber});
    K.text(c, 'Sebuah laporan hanya boleh dilihat oleh', 670, 800, {size: 38, weight: 800}); K.text(c, 'pelapornya dan petugas.', 670, 862, {size: 44, weight: 900, color: C.lime}); c.restore(); }
};
AD.ditolak = (c, t, D, a) => { K.bg(c); K.judul(c, 'Tidak semua laporan bisa dikerjakan', t, C.pink);
  K.tokoh(c, 'hendra', 300, 820, 400, 1); const t2 = kt(a, 2), t3 = kt(a, 3);
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.kartuLaporan(c, 640, 250, 620, {judul: 'Kursi kantin patah', sub: 'Lapangan dan kantin · Dimas (XI RPL 2)', status: t > t3 + 2.5 ? 'ditolak' : 'baru'});
    K.balon(c, 1320, 240, 480, 'Itu milik pengelola kantin, bukan milik sekolah.', muncul(t, t2 + 2.5), {size: 26}); c.restore(); }
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.text(c, 'Empat status', 640, 560, {size: 30, weight: 900, color: C.redup}); let x = 640; ['baru', 'diproses', 'selesai', 'ditolak'].forEach((s, i) => { const q = i < 3 ? 1 : muncul(t, t3 + 2); x += K.chipStatus(c, s, x, 640, {size: 40, p: q}) + 30;
      if (i === 3) K.sorotKuning(c, x - 30 - 230, 596, 240, 90, q * (t < t3 + 6 ? 1 : 0)); });
    const q = muncul(t, t3 + 3.6); c.globalAlpha = q; K.rrect(c, 640, 740, 1160, 130, 20, 'rgba(255,107,107,.1)', C.coral, 4); K.text(c, 'Penolakan harus disertai alasannya.', 680, 806, {size: 38, weight: 800}); c.restore(); }
};
AD.polaCerita = (c, t, D, a) => { K.bg(c); K.judul(c, 'Menulis kebutuhan', t, C.violet, 'Kalimat pendek dengan pola yang sama');
  const bag = [['Sebagai', 'siapa?', C.sky, 'siswa'], ['saya ingin', 'apa?', C.amber, 'melihat riwayat laporan saya'], ['supaya', 'apa?', C.lime, 'saya tahu perkembangannya']]; const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  bag.forEach(([x1, x2, w, isi], i) => { const p = muncul(t, t1 + i * 1.1); if (p <= 0) return; const x = 160 + i * 540; c.save(); c.globalAlpha = p; const tebal = i === 2 && t > t3;
    K.rrect(c, x, 280, 500, 440, 26, tebal ? 'rgba(163,230,53,.1)' : 'rgba(255,255,255,.04)', w, tebal ? 9 : 5); K.text(c, x1, x + 250, 370, {size: 54, weight: 900, align: 'center', color: w});
    const q = muncul(t, t2 + 1 + i * 1.6); if (q > 0) { c.globalAlpha = p * q; K.text(c, isi, x + 250, 520, {size: 36, weight: 800, align: 'center', maxW: 430, lh: 1.25}); } else K.text(c, x2, x + 250, 520, {size: 48, weight: 600, align: 'center', color: C.redup}); c.restore(); });
  K.text(c, 'Dari “supaya”, kita tahu fitur mana yang benar-benar perlu.', 960, 850, {size: 38, weight: 800, align: 'center', color: C.lime, alpha: muncul(t, t3 + .6)});
};
AD.tidakDibuat = (c, t, D, a) => { K.bg(c); K.judul(c, 'Yang tidak kita buat di versi pertama', t, C.coral);
  const t1 = kt(a, 1); ['Notifikasi WhatsApp', 'Komentar berbalas', 'Aplikasi Android'].forEach((s, i) => { const p = muncul(t, t1 + i * 1.5); if (p <= 0) return; c.save(); c.globalAlpha = p; const y = 280 + i * 170; K.rrect(c, 260, y, 1400, 130, 22, 'rgba(255,255,255,.04)', '#475569', 3);
    K.text(c, s, 330, y + 66, {size: 46, weight: 800, color: C.redup}); K.coret(c, 310, y + 66, 330 + K.lebar(c, s, 46, 800) + 20, y + 66, K.seg(t, t1 + i * 1.5 + .5, t1 + i * 1.5 + 1)); c.restore(); });
  const p = muncul(t, kt(a, 2)); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 260, 820, 1400, 130, 22, 'rgba(163,230,53,.08)', C.lime, 4); K.text(c, 'Daftar ini melindungi kita dari proyek yang tidak pernah selesai.', 960, 886, {size: 36, weight: 800, align: 'center'}); c.restore(); }
};
})();
