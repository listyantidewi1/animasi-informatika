// L01 Persiapan: pemasangan alat digambar (penginstal Windows tidak bisa direkam di sini)
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b2 Laravel Herd
AD.siapHerd = (c, t, D, a) => { K.bg(c); K.judulAlat(c, 1, 'Laravel Herd', '   PHP, Composer, dan Node.js sekaligus', t, C.coral);
  const t1 = kt(a, 1), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6);
  // tiga isi Herd
  [['PHP', 'menjalankan Laravel', C.violet], ['Composer', 'memasang pustaka PHP', C.amber], ['Node.js', 'menyiapkan aset halaman', C.lime]].forEach(([n, k, w], i) => { const p = muncul(t, t1 + .6 + i * 1.3) * (t < t3 ? 1 : 1 - muncul(t, t3 - .2, .4)); if (p <= 0) return;
    c.save(); c.globalAlpha = p; const x = 170 + i * 540, y = 330; K.rrect(c, x, y, 500, 260, 24, 'rgba(255,255,255,.05)', w, 5); K.text(c, n, x + 250, y + 100, {size: 64, weight: 900, align: 'center', color: w}); K.text(c, k, x + 250, y + 185, {size: 30, weight: 600, align: 'center'}); c.restore(); });
  const pg = muncul(t, kt(a, 2)) * (t < t3 ? 1 : 1 - muncul(t, t3 - .2, .4)); if (pg > 0) { c.save(); c.globalAlpha = pg; K.rrect(c, 170, 670, 1580, 120, 22, 'rgba(163,230,53,.08)', C.lime, 4); K.text(c, 'Herd memasang ketiganya sekaligus. Versi dasarnya gratis.', 960, 730, {size: 38, weight: 800, align: 'center'}); c.restore(); }
  // browser + penginstal
  const pb = muncul(t, t3) * (t < t6 ? 1 : .25);
  K.browser(c, 110, 200, 1020, 640, 'herd.laravel.com', (c, x, y, w, h) => { K.text(c, 'Laravel Herd', x + 70, y + 110, {size: 68, weight: 900, color: '#b91c1c'});
    K.text(c, 'Lingkungan PHP siap pakai', x + 70, y + 185, {size: 30, weight: 600, color: '#475569'});
    K.tombol(c, x + 70, y + 260, 400, 92, 'Download for Windows', '#dc2626', muncul(t, t3 + 2.2) * (t < t4 ? 1 : 0), t);
    K.tombol(c, x + 500, y + 260, 400, 92, 'Download for macOS', '#475569', 0, t);
    K.text(c, 'Pilih sesuai komputermu, lalu jalankan berkas yang terunduh.', x + 70, y + 430, {size: 26, weight: 700, color: '#475569'}); }, pb);
  const pu = muncul(t, t4) * (t < t5 ? 1 : 1 - muncul(t, t5, .4)) * (t < t6 ? 1 : 0); if (pu > 0) { c.save(); c.globalAlpha = pu; const x = 1180, y = 280; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 30; K.rrect(c, x, y, 640, 380, 14, '#f1f5f9', '#475569', 3); c.shadowColor = 'transparent';
    K.rrect(c, x, y, 640, 58, 14, '#1d4ed8'); c.fillStyle = '#1d4ed8'; c.fillRect(x + 2, y + 34, 636, 26); K.text(c, 'User Account Control', x + 26, y + 30, {size: 26, weight: 800, color: '#fff'});
    K.text(c, 'Izinkan aplikasi ini membuat', x + 36, y + 120, {size: 28, weight: 700, color: '#1e293b'}); K.text(c, 'perubahan di perangkatmu?', x + 36, y + 160, {size: 28, weight: 700, color: '#1e293b'}); K.text(c, 'Herd Setup', x + 36, y + 220, {size: 26, weight: 600, color: '#475569'});
    K.tombol(c, x + 250, y + 290, 170, 60, 'Yes', '#2563eb', muncul(t, t4 + 1.2), t); K.rrect(c, x + 440, y + 290, 170, 60, 12, '#e2e8f0', '#94a3b8', 2); K.text(c, 'No', x + 525, y + 321, {size: 26, weight: 700, align: 'center', color: '#475569'}); c.restore(); }
  const ph = muncul(t, t5) * (t < t6 ? 1 : .25); if (ph > 0) { c.save(); c.globalAlpha = ph; const x = 1180, y = 280; K.rrect(c, x, y, 640, 380, 18, '#18181b', '#dc2626', 4); K.text(c, 'Herd', x + 40, y + 60, {size: 40, weight: 900, color: '#f87171'});
    [['PHP 8.4', 'siap'], ['Composer', 'siap'], ['Node.js', 'siap']].forEach(([n, s], i) => { const q = muncul(t, t5 + 1 + i * .7); K.text(c, n, x + 50, y + 140 + i * 66, {size: 30, weight: 700, color: '#e4e4e7'}); if (q > 0) { K.centang(c, x + 520, y + 140 + i * 66, 34, q, C.lime); } });
    K.text(c, 'Buka Herd satu kali setelah terpasang', x + 320, y + 345, {size: 24, weight: 700, align: 'center', color: C.amber}); c.restore(); }
  K.chipRepo(c, muncul(t, t6), {y: 880, ket: 'Linux: perintah pemasangan ada di README'});
};
// b3 MySQL Installer
AD.siapMySQL = (c, t, D, a) => { K.bg(c); K.judulAlat(c, 2, 'MySQL', '   database kita', t, C.teal);
  const tW = kt(a, 2), A = t < tW ? 1 : 1 - muncul(t, tW, .4);
  if (A > 0) K.browser(c, 360, 220, 1200, 640, 'dev.mysql.com/downloads', (c, x, y, w, h) => { K.text(c, 'MySQL Community Downloads', x + 70, y + 90, {size: 50, weight: 900, color: '#0e7490'});
    ['MySQL Community Server', 'MySQL Installer for Windows', 'MySQL Workbench', 'MySQL Shell'].forEach((s, i) => { const yy = y + 190 + i * 84; K.text(c, '›  ' + s, x + 90, yy, {size: 34, weight: i === 1 ? 900 : 600, color: i === 1 ? '#0e7490' : '#475569'});
      if (i === 1) K.sorotKuning(c, x + 66, yy - 38, 640, 76, muncul(t, kt(a, 1) + 3.4)); }); }, Math.min(A, muncul(t, Math.min(kt(a, 1), 2.5))));
  const W = muncul(t, tW + .3); if (W <= 0) return;
  const langkah = [['Choosing a Setup Type', kt(a, 2)], ['Accounts and Roles', kt(a, 3)], ['Apply Configuration', kt(a, 6)]]; let aktif = 0; langkah.forEach(([, tt], i) => { if (t >= tt) aktif = i; });
  c.save(); c.globalAlpha = W; langkah.forEach(([n], i) => { const y = 300 + i * 110, on = i === aktif; K.rrect(c, 110, y, 450, 86, 16, on ? 'rgba(45,212,191,.14)' : 'rgba(255,255,255,.03)', on ? C.teal : '#3b4a75', on ? 5 : 2);
    K.text(c, n, 136, y + 44, {size: 28, weight: on ? 900 : 600, color: on ? C.teks : C.redup}); if (i < aktif) K.centang(c, 520, y + 44, 30, 1, C.lime); });
  K.text(c, 'Halaman lain di penginstal:', 110, 700, {size: 26, weight: 700, color: C.redup, alpha: muncul(t, kt(a, 3))}); K.text(c, 'biarkan bawaannya, tekan Next', 110, 744, {size: 28, weight: 800, alpha: muncul(t, kt(a, 3))}); c.restore();
  const t0 = langkah[aktif][1], q = aktif === 0 ? 1 : muncul(t, t0, .35);
  K.wizard(c, 620, 240, 1180, 700, 'MySQL Installer  ·  ' + langkah[aktif][0], (c, x, y, w, h) => { c.save(); c.globalAlpha *= q;
    if (aktif === 0) { K.text(c, 'Pilih jenis pemasangan:', x + 50, y + 70, {size: 30, weight: 700, color: '#1e293b'});
      ['Developer Default', 'Server only', 'Client only', 'Full', 'Custom'].forEach((s, i) => { const yy = y + 150 + i * 74; c.strokeStyle = '#64748b'; c.lineWidth = 3; c.beginPath(); c.arc(x + 86, yy, 15, 0, 7); c.stroke();
        if (i === 1 && t > t0 + 1.6) { c.fillStyle = '#2563eb'; c.beginPath(); c.arc(x + 86, yy, 8, 0, 7); c.fill(); } if (i === 0 && t <= t0 + 1.6) { c.fillStyle = '#2563eb'; c.beginPath(); c.arc(x + 86, yy, 8, 0, 7); c.fill(); }
        K.text(c, s, x + 120, yy + 1, {size: 30, weight: i === 1 ? 800 : 600, color: '#1e293b'}); });
      K.sorotKuning(c, x + 50, y + 190, 520, 70, muncul(t, t0 + 1.4)); K.text(c, 'Kita hanya butuh servernya', x + 620, y + 226, {size: 28, weight: 800, color: '#b45309', alpha: muncul(t, t0 + 2.4)}); }
    if (aktif === 1) { K.text(c, 'Kata sandi untuk pengguna root:', x + 50, y + 70, {size: 30, weight: 700, color: '#1e293b'});
      ['MySQL Root Password', 'Repeat Password'].forEach((s, i) => { const yy = y + 150 + i * 110; K.text(c, s, x + 70, yy, {size: 28, weight: 600, color: '#334155'}); K.rrect(c, x + 420, yy - 30, 520, 60, 8, '#fff', '#64748b', 3);
        const n = Math.floor(K.clamp((t - kt(a, 4) - 1.0 - i * 1.4) * 7, 0, 9)); K.text(c, '●'.repeat(n), x + 440, yy + 2, {size: 24, color: '#1e293b'}); });
      K.sorotKuning(c, x + 50, y + 104, 920, 190, muncul(t, kt(a, 4)));
      const g = muncul(t, kt(a, 5)); if (g > 0) { c.save(); c.globalAlpha *= g; K.rrect(c, x + 50, y + 350, 1080, 130, 14, '#fef3c7', '#d97706', 4); K.text(c, 'Catat kata sandi root ini!', x + 80, y + 392, {size: 34, weight: 900, color: '#92400e'});
        K.text(c, 'root adalah pemilik seluruh database di komputermu.', x + 80, y + 442, {size: 27, weight: 600, color: '#92400e'}); c.restore(); } }
    if (aktif === 2) { K.text(c, 'Menerapkan pengaturan:', x + 50, y + 70, {size: 30, weight: 700, color: '#1e293b'});
      ['Menulis berkas pengaturan', 'Menyalakan server MySQL', 'Menerapkan kata sandi root'].forEach((s, i) => { const yy = y + 150 + i * 70; const g = muncul(t, t0 + 1.4 + i * .6); K.text(c, s, x + 120, yy, {size: 28, weight: 600, color: '#334155'}); if (g > 0) K.centang(c, x + 84, yy, 30, g, '#16a34a'); });
      K.tombol(c, x + 70, y + 380, 200, 60, 'Execute', '#2563eb', muncul(t, t0 + .5) * (t < t0 + 3 ? 1 : 0), t); K.text(c, 'Execute, lalu Finish', x + 310, y + 412, {size: 30, weight: 800, color: '#b45309'}); }
    c.restore(); }, W, {akhir: aktif === 2, sorotNext: aktif === 2 ? muncul(t, t0 + 3.4) : (aktif === 0 ? muncul(t, kt(a, 3) - 1.2) : 0), t});
};
// b4 Git dan VS Code
AD.siapGitVS = (c, t, D, a) => { K.bg(c); const tB = kt(a, 3), A = t < tB ? 1 : 1 - muncul(t, tB, .4), B = muncul(t, tB + .3), t4 = kt(a, 4), t5 = kt(a, 5);
  if (A > 0) { c.save(); c.globalAlpha = A; K.judulAlat(c, 3, 'Git', '   menyimpan riwayat kode', t, C.coral);
    K.browser(c, 110, 200, 880, 560, 'git-scm.com', (c, x, y, w, h) => { K.text(c, 'Git', x + 70, y + 110, {size: 76, weight: 900, color: '#c2410c'});
      K.tombol(c, x + 70, y + 210, 420, 92, 'Download untuk Windows', '#ea580c', muncul(t, kt(a, 1) + 1.2), t); K.text(c, 'Pasang dengan pilihan bawaannya', x + 70, y + 370, {size: 28, weight: 700, color: '#475569'}); }, muncul(t, Math.min(kt(a, 1), 2.2)));
    const g = muncul(t, kt(a, 2)); if (g > 0) { c.save(); c.globalAlpha *= g; K.term(c, 1060, 240, 760, 330, t, [{at: kt(a, 2) + .8, cmd: 'git --version', out: ['git version 2.43.0']}], {judul: 'Git Bash', size: 30});
      K.text(c, 'Git Bash ikut terpasang di Windows', 1440, 630, {size: 30, weight: 800, align: 'center', color: C.amber}); c.restore(); }
    c.restore(); }
  if (B > 0) { c.save(); c.globalAlpha = B; K.judulAlat(c, 4, 'VS Code', '   tempat kita menulis kode', 1, C.sky);
    K.browser(c, 110, 200, 700, 300, 'code.visualstudio.com', (c, x, y, w, h) => { K.tombol(c, x + 60, y + 70, 420, 92, 'Download VS Code', '#2563eb', muncul(t, tB + 1.4) * (t < t4 ? 1 : 0), t); }, 1);
    const px = 110, py = 560, pw = 1700, ph = 420, q = muncul(t, t4);
    c.save(); c.globalAlpha *= q; K.rrect(c, px, py, pw, ph, 14, '#1e1e2e', '#3b4a75', 3); K.rrect(c, px, py, pw, 56, 14, '#181825'); c.fillStyle = '#181825'; c.fillRect(px + 2, py + 30, pw - 4, 28);
    ['PROBLEMS', 'OUTPUT', 'TERMINAL'].forEach((s, i) => K.text(c, s, px + 40 + i * 190, py + 29, {size: 22, weight: 800, color: i === 2 ? '#f8fafc' : '#7c8aa8'})); c.fillStyle = '#60a5fa'; c.fillRect(px + 416, py + 52, 140, 4);
    K.text(c, '+', px + pw - 330, py + 28, {size: 34, weight: 700, color: '#f8fafc'}); K.text(c, '⌄', px + pw - 292, py + 30, {size: 30, weight: 900, color: '#f8fafc'});
    K.sorotKuning(c, px + pw - 356, py + 6, 96, 46, muncul(t, t5) * (t < t5 + 2.4 ? 1 : 0)); K.text(c, '$ ', px + 36, py + 110, {size: 28, weight: 700, mono: true, color: C.lime});
    const m = muncul(t, t5 + 1.4); if (m > 0) { c.globalAlpha *= m; const mx = px + pw - 640, my = py + 64; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 24; K.rrect(c, mx, my, 420, 300, 10, '#2a2a3c', '#4b5578', 2); c.shadowColor = 'transparent';
      ['PowerShell', 'Command Prompt', 'Git Bash', 'JavaScript Debug Terminal'].forEach((s, i) => { const yy = my + 46 + i * 68; if (i === 2) { K.rrect(c, mx + 8, yy - 30, 404, 60, 8, '#2563eb'); K.sorotKuning(c, mx + 2, yy - 36, 416, 72, muncul(t, t5 + 2.2)); }
        K.text(c, s, mx + 30, yy, {size: 26, weight: i === 2 ? 800 : 600, color: '#f8fafc'}); }); }
    c.restore();
    K.text(c, 'Menu Terminal → New Terminal', 880, 330, {size: 32, weight: 800, color: C.amber, alpha: muncul(t, t4 + .3)});
    K.text(c, 'Panah di samping tanda +  →  Git Bash', 880, 390, {size: 32, weight: 800, color: C.amber, alpha: muncul(t, t5)});
    K.text(c, 'Perintahmu jadi sama persis dengan di video', 880, 450, {size: 28, weight: 700, alpha: muncul(t, kt(a, 6))}); c.restore(); }
};
// b5 akhir: kalau "command not found"
AD.tidakDikenal = (c, t, D, a) => { K.latar(c, a.bg, .82); const t3 = kt(a, 3), t4 = kt(a, 4);
  K.term(c, 260, 200, 1400, 300, t, [{at: Math.max(.4, t3 - .4), cmd: 'mysql --version', out: [['bash: mysql: command not found', C.coral]]}], {size: 32, judul: 'Kalau ada yang tidak dikenali'});
  const p = muncul(t, t3 + 2); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 260, 540, 1400, 130, 20, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'Tutup VS Code, buka lagi, lalu coba sekali lagi.', 960, 605, {size: 36, weight: 800, align: 'center'}); c.restore(); }
  const q = muncul(t, t4); if (q > 0) K.text(c, 'Masih tidak dikenali? Windows belum tahu letak programnya (PATH).', 960, 740, {size: 30, weight: 700, align: 'center', color: C.coral, alpha: q});
  K.chipRepo(c, muncul(t, t4 + 1.5), {y: 820, ket: 'Cara mengatasinya: README, bagian "Memasang alat"'});
};
// b6: arti tiga pilihan
AD.tigaPilihan = (c, t, D, a) => { K.latar(c, a.bg, .86); const p0 = muncul(t, .2);
  c.save(); c.globalAlpha = p0; K.kode(c, ['laravel new silapor --database=mysql --phpunit --no-boost'], 140, 150, {size: 36, w: 1640}); c.restore();
  [['--database=mysql', 'Database yang dipakai: MySQL', C.teal, 2], ['--phpunit', 'Alat test bawaan Laravel', C.lime, 3], ['--no-boost', 'Melewati alat tambahan yang belum kita perlukan', C.violet, 4]].forEach(([k, s, w, i], j) => { const p = muncul(t, kt(a, i)); if (p <= 0) return;
    c.save(); c.globalAlpha = p; const y = 330 + j * 190 + (1 - p) * 20; K.rrect(c, 140, y, 1640, 160, 22, 'rgba(14,20,36,.94)', w, 4); K.text(c, k, 190, y + 80, {size: 44, weight: 900, mono: true, color: w}); K.text(c, s, 760, y + 80, {size: 34, weight: 700, maxW: 980}); c.restore(); });
};
// b8 akhir: kenapa tidak memakai root
AD.kenapaBukanRoot = (c, t, D, a) => { K.bg(c); K.judul(c, 'Kenapa tidak memakai root saja?', t, C.coral);
  const t7 = kt(a, 7), dua = muncul(t, t7);
  const db = ['silapor', 'nilai_siswa', 'perpustakaan', 'keuangan'];
  [['root', 'pemilik semua database', C.coral, 160, [0, 1, 2, 3]], ['silapor', 'hanya untuk aplikasi ini', C.lime, 1000, [0]]].forEach(([n, s, w, x, kena], k) => { const p = k === 0 ? muncul(t, .5) : dua; if (p <= 0) return; c.save(); c.globalAlpha = p;
    K.rrect(c, x, 230, 760, 700, 26, 'rgba(255,255,255,.04)', w, 4); K.text(c, 'Pengguna: ' + n, x + 40, 290, {size: 40, weight: 900, color: w}); K.text(c, s, x + 40, 344, {size: 28, weight: 600, color: C.redup});
    db.forEach((d, i) => { const yy = 410 + i * 120, on = kena.includes(i); K.rrect(c, x + 40, yy, 680, 96, 16, on ? 'rgba(255,107,107,.14)' : 'rgba(255,255,255,.04)', on ? C.coral : '#3b4a75', on ? 4 : 2);
      K.text(c, d, x + 76, yy + 49, {size: 32, weight: 800, mono: true, color: on ? C.teks : C.redup}); K.text(c, on ? 'ikut terbuka' : 'aman', x + 690, yy + 49, {size: 26, weight: 800, align: 'right', color: on ? C.coral : C.lime}); });
    c.restore(); });
  K.text(c, 'Kalau aplikasi dibobol:', 960, 990, {size: 30, weight: 800, align: 'center', color: C.amber, alpha: dua});
};
// b11: selisih tujuh jam
AD.zonaWaktu = (c, t, D, a) => { K.latar(c, a.bg, .86); const p = muncul(t, .3), q = muncul(t, Math.min(kt(a, 3), D - 6));
  const jam = (x, y, h, m, w, lab, sub) => { c.save(); c.strokeStyle = w; c.lineWidth = 8; c.beginPath(); c.arc(x, y, 130, 0, 7); c.stroke(); c.lineCap = 'round'; c.strokeStyle = C.teks;
    const ah = (h % 12 + m / 60) / 12 * Math.PI * 2 - Math.PI / 2, am = m / 60 * Math.PI * 2 - Math.PI / 2; c.lineWidth = 10; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(ah) * 70, y + Math.sin(ah) * 70); c.stroke(); c.lineWidth = 6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(am) * 105, y + Math.sin(am) * 105); c.stroke();
    K.text(c, lab, x, y + 190, {size: 44, weight: 900, align: 'center', color: w}); K.text(c, sub, x, y + 245, {size: 28, weight: 600, align: 'center'}); c.restore(); };
  c.save(); c.globalAlpha = p; K.rrect(c, 260, 160, 1400, 760, 28, 'rgba(14,20,36,.95)', C.amber, 4); K.text(c, "'timezone' => 'Asia/Jakarta'", 960, 240, {size: 40, weight: 800, mono: true, align: 'center', color: C.amber});
  jam(620, 500, 7, 0, C.lime, '07.00 WIB', 'laporan dikirim'); c.restore();
  if (q > 0) { c.save(); c.globalAlpha = q; jam(1300, 500, 0, 0, C.coral, '00.00', 'yang tercatat kalau masih UTC'); K.arrow(c, 790, 500, 1130, 500, C.coral, 6, q); K.text(c, 'selisih 7 jam', 960, 460, {size: 30, weight: 800, align: 'center', color: C.coral}); c.restore(); }
};
// b14: penutup bab
AD.lanjut = (c, t, D, a) => { K.bg(c); const p = muncul(t, .2), p2 = muncul(t, 1.0);
  c.save(); c.globalAlpha = p; K.rrect(c, 140, 250, 1640, 220, 26, 'rgba(163,230,53,.08)', C.lime, 4); K.centang(c, 230, 360, 70, p, C.lime); K.text(c, a.selesai, 320, 360, {size: 44, weight: 800, maxW: 1400, lh: 1.25}); c.restore();
  c.save(); c.globalAlpha = p2; K.text(c, 'Bab berikutnya', 140, 620, {size: 30, weight: 700, color: C.redup}); K.text(c, a.berikut, 140, 700, {size: 60, weight: 900, maxW: 1640}); c.restore(); };
})();
