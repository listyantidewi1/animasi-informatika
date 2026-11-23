// B01 Persiapan: pemasangan alat digambar (penginstal Windows tidak bisa direkam di sini)
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan, kt = K.kt, muncul = K.muncul;
// b2 Node.js
AD.siapNode = (c, t, D, a) => { K.bg(c); K.judulAlat(c, 1, 'Node.js', '   menjalankan JavaScript di luar browser', t, C.lime);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  K.browser(c, 110, 200, 1000, 620, 'nodejs.org', (c, x, y, w, h) => { K.text(c, 'Node.js', x + 70, y + 110, {size: 76, weight: 900, color: '#166534'});
    K.text(c, 'Jalankan JavaScript di mana saja', x + 70, y + 190, {size: 32, weight: 600, color: '#475569'});
    K.tombol(c, x + 70, y + 270, 470, 96, 'Download Node.js (LTS)', '#16a34a', muncul(t, t1 + 1.6) * (t < t2 ? 1 : 0), t);
    K.rrect(c, x + 580, y + 270, 300, 96, 12, '#e2e8f0', '#94a3b8', 2); K.text(c, 'Versi lain', x + 730, y + 319, {size: 30, weight: 700, align: 'center', color: '#64748b'});
    const q = muncul(t, t1 + 2.6); if (q > 0) { c.save(); c.globalAlpha = q; K.text(c, 'LTS = versi yang paling stabil', x + 70, y + 430, {size: 30, weight: 800, color: '#b45309'}); c.restore(); } }, muncul(t, Math.min(t1, 2.5)));
  K.wizard(c, 1180, 300, 640, 440, 'Node.js Setup', (c, x, y, w, h) => { K.text(c, 'Selamat datang di penginstal Node.js', x + 30, y + 60, {size: 26, weight: 700, color: '#1e293b'});
    K.text(c, 'Biarkan semua pilihan apa adanya,', x + 30, y + 130, {size: 24, weight: 600, color: '#475569'}); K.text(c, 'lalu tekan Next sampai selesai.', x + 30, y + 168, {size: 24, weight: 600, color: '#475569'}); }, muncul(t, t2), {sorotNext: muncul(t, t2 + 1.8), t});
  const q = muncul(t, t3); if (q > 0) { c.save(); c.globalAlpha = q; K.rrect(c, 110, 880, 1710, 110, 20, 'rgba(163,230,53,.08)', C.lime, 4);
    K.text(c, 'Ikut terpasang:', 150, 935, {size: 32, weight: 700, color: C.redup}); K.text(c, 'npm', 400, 935, {size: 44, weight: 900, mono: true, color: C.lime}); K.text(c, 'alat untuk memasang pustaka', 520, 936, {size: 32, weight: 600}); c.restore(); }
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
  K.chipRepo(c, muncul(t, kt(a, 7)), {y: 960, ket: 'Mac dan Linux: perintah pemasangan ada di README'});
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
AD.tidakDikenal = (c, t, D, a) => { K.latar(c, a.bg, .82); const t3 = kt(a, 4), t4 = kt(a, 5);
  K.term(c, 260, 200, 1400, 300, t, [{at: Math.max(.4, t3 - .4), cmd: 'mysql --version', out: [['bash: mysql: command not found', C.coral]]}], {size: 32, judul: 'Kalau ada yang tidak dikenali'});
  const p = muncul(t, t3 + 2); if (p > 0) { c.save(); c.globalAlpha = p; K.rrect(c, 260, 540, 1400, 130, 20, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'Tutup VS Code, buka lagi, lalu coba sekali lagi.', 960, 605, {size: 36, weight: 800, align: 'center'}); c.restore(); }
  const q = muncul(t, t4); if (q > 0) K.text(c, 'Masih tidak dikenali? Windows belum tahu letak programnya (PATH).', 960, 740, {size: 30, weight: 700, align: 'center', color: C.coral, alpha: q});
  K.chipRepo(c, muncul(t, t4 + 1.5), {y: 820, ket: 'Cara mengatasinya: README, bagian "Memasang alat"'});
};
// b8 akhir: kenapa tidak memakai root
AD.kenapaBukanRoot = (c, t, D, a) => { K.bg(c); K.judul(c, 'Kenapa tidak memakai root saja?', t, C.coral);
  const t7 = kt(a, 7), dua = muncul(t, t7);
  const db = ['sibaca', 'nilai_siswa', 'absensi', 'keuangan'];
  [['root', 'pemilik semua database', C.coral, 160, [0, 1, 2, 3]], ['sibaca', 'hanya untuk aplikasi ini', C.lime, 1000, [0]]].forEach(([n, s, w, x, kena], k) => { const p = k === 0 ? muncul(t, .5) : dua; if (p <= 0) return; c.save(); c.globalAlpha = p;
    K.rrect(c, x, 230, 760, 700, 26, 'rgba(255,255,255,.04)', w, 4); K.text(c, 'Pengguna: ' + n, x + 40, 290, {size: 40, weight: 900, color: w}); K.text(c, s, x + 40, 344, {size: 28, weight: 600, color: C.redup});
    db.forEach((d, i) => { const yy = 410 + i * 120, on = kena.includes(i); K.rrect(c, x + 40, yy, 680, 96, 16, on ? 'rgba(255,107,107,.14)' : 'rgba(255,255,255,.04)', on ? C.coral : '#3b4a75', on ? 4 : 2);
      K.text(c, d, x + 76, yy + 49, {size: 32, weight: 800, mono: true, color: on ? C.teks : C.redup}); K.text(c, on ? 'ikut terbuka' : 'aman', x + 690, yy + 49, {size: 26, weight: 800, align: 'right', color: on ? C.coral : C.lime}); });
    c.restore(); });
  K.text(c, 'Kalau aplikasi dibobol:', 960, 990, {size: 30, weight: 800, align: 'center', color: C.amber, alpha: dua});
};
// b11: dua program yang berjalan
AD.duaProgram = (c, t, D, a) => { K.bg(c); K.judul(c, 'Dua program berjalan', t, C.sky, 'Biarkan keduanya menyala sepanjang video');
  [['Terminal 1', 'Express', 'server dan data', 'localhost:3000', C.violet, 'npm run dev'], ['Terminal 2', 'Vite', 'tampilan React', 'localhost:5173', C.sky, 'npm run dev (di folder web)']].forEach(([tm, n, k, al, w, cmd], i) => { const p = muncul(t, .5 + i * .9); if (p <= 0) return;
    c.save(); c.globalAlpha = p; const x = 160 + i * 830, y = 300 + (1 - p) * 20; K.rrect(c, x, y, 770, 430, 26, 'rgba(255,255,255,.05)', w, 5);
    K.text(c, tm, x + 44, y + 60, {size: 28, weight: 800, color: C.redup}); K.text(c, n, x + 44, y + 150, {size: 80, weight: 900, color: w}); K.text(c, k, x + 44, y + 230, {size: 32, weight: 600});
    K.rrect(c, x + 44, y + 280, 682, 110, 14, '#0b1020', '#334155', 2); K.text(c, '$ ' + cmd, x + 70, y + 316, {size: 24, weight: 600, mono: true, color: C.lime}); K.text(c, al, x + 70, y + 360, {size: 30, weight: 800, mono: true}); c.restore(); });
  const q = muncul(t, 3.2); if (q > 0) { c.save(); c.globalAlpha = q; K.rrect(c, 160, 790, 1600, 110, 20, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'Terminal 3: untuk mengetik perintah lain', 960, 846, {size: 36, weight: 800, align: 'center'}); c.restore(); }
};
// b14: penutup bab
AD.lanjut = (c, t, D, a) => { K.bg(c); const p = muncul(t, .2), p2 = muncul(t, 1.0);
  c.save(); c.globalAlpha = p; K.rrect(c, 140, 250, 1640, 220, 26, 'rgba(163,230,53,.08)', C.lime, 4); K.centang(c, 230, 360, 70, p, C.lime); K.text(c, a.selesai, 320, 360, {size: 44, weight: 800, maxW: 1400, lh: 1.25}); c.restore();
  c.save(); c.globalAlpha = p2; K.text(c, 'Bab berikutnya', 140, 620, {size: 30, weight: 700, color: C.redup}); K.text(c, a.berikut, 140, 700, {size: 60, weight: 900, maxW: 1640}); c.restore();
  if (a.kode) K.pitaKode(c, muncul(t, 1.6), 'Kode sampai akhir bab ini', a.kode, 140, 930); };
})();
