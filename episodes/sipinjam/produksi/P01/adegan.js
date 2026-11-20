// Adegan Bab 1 (persiapan): XAMPP, Path, Git + VS Code, coba di HP. Indeks kalimat 0-based.
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul, tombol = K.tombol, wizard = K.wizard, centangKotak = K.centangKotak, sorotKuning = K.sorotKuning;
const jendela = (c, x, y, w, h, judul, p, warna = '#334155') => { c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 12, '#f1f5f9', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 58, 12, warna); c.fillStyle = warna; c.fillRect(x + 2, y + 34, w - 4, 26); K.text(c, judul, x + 26, y + 30, {size: 26, weight: 800, color: '#f8fafc'}); };

// ---------- b2: XAMPP ----------
AD.siapXampp = (c, t, D, a) => { K.bg(c); K.judulAlat(c, 1, 'XAMPP', '   memasang PHP dan MySQL sekaligus', t, C.amber);
  const t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6), t7 = kt(a, 7);
  // kalimat 0-1: satu paket, dua isi
  const pA = t < t2 ? muncul(t, .5) : 1 - muncul(t, t2, .4);
  if (pA > 0) { c.save(); c.globalAlpha = pA; K.rrect(c, 460, 300, 1000, 460, 30, 'rgba(255,176,32,.07)', C.amber, 5);
    K.text(c, 'XAMPP', 960, 370, {size: 60, weight: 900, align: 'center', color: C.amber}); K.text(c, 'satu paket, gratis', 960, 430, {size: 30, weight: 600, align: 'center', color: C.redup});
    [['PHP', 'bahasa di sisi server', C.violet], ['MySQL', 'database', C.teal]].forEach(([n, k, w], i) => { const p = muncul(t, kt(a, 1) + .4 + i * 1.3); if (p <= 0) return; c.save(); c.globalAlpha *= p; const x = 520 + i * 460;
      K.rrect(c, x, 500 + (1 - p) * 20, 420, 200, 22, 'rgba(255,255,255,.05)', w, 4); K.text(c, n, x + 210, 580, {size: 56, weight: 900, align: 'center', color: w}); K.text(c, k, x + 210, 650, {size: 28, weight: 600, align: 'center'}); c.restore(); });
    c.restore(); }
  // kalimat 2: unduh; kalimat 5: Control Panel menggantikan browser
  const pB = t < t5 ? muncul(t, t2 + .3) : 1 - muncul(t, t5, .4);
  if (pB > 0) K.browser(c, 110, 200, 880, 520, 'apachefriends.org', (c, x, y, w, h) => { K.text(c, 'XAMPP', x + 60, y + 90, {size: 64, weight: 900, color: '#c2410c'});
    K.text(c, 'Apache + MariaDB + PHP + Perl', x + 60, y + 160, {size: 28, weight: 600, color: '#475569'}); K.text(c, 'Download', x + 60, y + 240, {size: 30, weight: 800, color: '#1e293b'});
    tombol(c, x + 60, y + 276, 420, 92, 'XAMPP untuk Windows', '#ea580c', muncul(t, t2 + 2.6), t);
    K.rrect(c, x + 510, y + 276, 150, 92, 12, '#e2e8f0', '#94a3b8', 2); K.text(c, 'Linux', x + 585, y + 323, {size: 26, weight: 700, align: 'center', color: '#64748b'});
    K.rrect(c, x + 680, y + 276, 150, 92, 12, '#e2e8f0', '#94a3b8', 2); K.text(c, 'macOS', x + 755, y + 323, {size: 26, weight: 700, align: 'center', color: '#64748b'}); }, pB);
  // kalimat 3-4: penginstal
  const pW = t < t5 ? muncul(t, t3) : Math.max(.0, 1 - muncul(t, t5, .4));
  if (pW > 0) wizard(c, 1050, 200, 760, 560, t < t4 ? 'Setup: Select Components' : 'Setup: Installation folder', (c, x, y, w, h) => {
    if (t < t4) { K.text(c, 'Server', x + 34, y + 44, {size: 24, weight: 800, color: '#64748b'}); K.text(c, 'Program Languages', x + 400, y + 44, {size: 24, weight: 800, color: '#64748b'});
      [['Apache', 1], ['MySQL', 1], ['FileZilla FTP Server', 0], ['Mercury Mail Server', 0], ['Tomcat', 0]].forEach(([n, on], i) => centangKotak(c, x + 34, y + 100 + i * 60, n, on, {size: 26}));
      [['PHP', 1], ['Perl', 0], ['phpMyAdmin', 1]].forEach(([n, on], i) => centangKotak(c, x + 400, y + 100 + i * 60, n, on, {size: 26}));
      sorotKuning(c, x + 22, y + 132, 250, 56, muncul(t, t3 + 2.2)); sorotKuning(c, x + 388, y + 72, 200, 56, muncul(t, t3 + 3.2)); }
    else { K.text(c, 'Select a folder', x + 34, y + 70, {size: 26, weight: 700, color: '#475569'}); K.rrect(c, x + 34, y + 110, w - 68, 70, 8, '#fff', '#64748b', 3);
      K.text(c, 'C:\\xampp', x + 56, y + 146, {size: 34, weight: 800, mono: true, color: '#0f172a'}); sorotKuning(c, x + 26, y + 102, w - 52, 86, muncul(t, t4 + .8) * (t < t4 + 3.4 ? 1 : 0));
      K.text(c, 'Biarkan apa adanya.', x + 34, y + 240, {size: 26, weight: 700, color: '#b45309'}); }
  }, pW, {sorotNext: t >= t4 ? muncul(t, t4 + 3.4) : 0, t});
  // kalimat 5: XAMPP Control Panel
  const pC = muncul(t, t5 + .3);
  if (pC > 0) { c.save(); c.globalAlpha = pC; const x = 110, y = 200 + (1 - pC) * 24, w = 1700, h = 520; jendela(c, x, y, w, h, 'XAMPP Control Panel', pC, '#9a3412');
    ['Module', 'PID(s)', 'Port(s)', 'Actions'].forEach((s, i) => K.text(c, s, x + [60, 480, 760, 1080][i], y + 110, {size: 26, weight: 800, color: '#64748b'}));
    const hijau = t >= t5 + 5.6;
    [['Apache', 0], ['MySQL', 1], ['FileZilla', 0], ['Mercury', 0]].forEach(([n, my], i) => { const yy = y + 190 + i * 82, on = my && hijau;
      K.rrect(c, x + 44, yy - 30, 330, 60, 8, on ? '#86efac' : '#e2e8f0', on ? '#16a34a' : '#cbd5e1', 2); K.text(c, n, x + 64, yy + 1, {size: 30, weight: 800, color: '#0f172a'});
      if (on) { K.text(c, '4812', x + 480, yy, {size: 28, weight: 700, mono: true, color: '#0f172a'}); K.text(c, '3306', x + 760, yy, {size: 28, weight: 700, mono: true, color: '#0f172a'}); }
      K.rrect(c, x + 1080, yy - 28, 170, 56, 8, '#fff', '#64748b', 3); K.text(c, on ? 'Stop' : 'Start', x + 1165, yy + 1, {size: 28, weight: 800, align: 'center', color: '#0f172a'});
      K.rrect(c, x + 1270, yy - 28, 170, 56, 8, '#f8fafc', '#cbd5e1', 2); K.text(c, 'Admin', x + 1355, yy + 1, {size: 26, weight: 600, align: 'center', color: '#94a3b8'});
      if (my) { sorotKuning(c, x + 1068, yy - 40, 194, 80, muncul(t, t5 + 3.2) * (hijau ? 0 : 1)); sorotKuning(c, x + 32, yy - 42, 354, 84, hijau ? muncul(t, t5 + 5.8) : 0); } });
    if (hijau) K.text(c, 'Hijau = MySQL sudah berjalan', x + 1480, y + 272, {size: 26, weight: 800, color: '#15803d', maxW: 200, lh: 1.25});
    c.restore(); }
  // kalimat 6: MariaDB
  const p6 = t < t7 ? muncul(t, t6) : 1 - muncul(t, t7, .3); if (p6 > 0) { c.save(); c.globalAlpha = p6; K.rrect(c, 110, 770, 1700, 110, 20, 'rgba(45,212,191,.08)', C.teal, 4);
    K.text(c, 'MariaDB', 150, 825, {size: 40, weight: 900, color: C.teal}); K.text(c, '= kembaran MySQL. Beberapa pesan di layarmu bisa sedikit berbeda.', 340, 826, {size: 30, weight: 700}); c.restore(); }
  K.chipRepo(c, muncul(t, t7 + .3), {y: 780, w: 1160, ket: 'Mac dan Linux: cara memasangnya ada di README'});
};

// ---------- b3: Path ----------
AD.siapPath = (c, t, D, a) => { K.bg(c); K.judul(c, 'Langkah yang sering terlewat: Path', t, C.coral, 'Supaya Windows tahu letak program php dan mysql');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  // kalimat 0-1: masalahnya
  const pA = t < t2 ? muncul(t, .6) : 1 - muncul(t, t2, .4);
  if (pA > 0) { c.save(); c.globalAlpha = pA; K.term(c, 260, 260, 1400, 330, t, [{at: 1.2, cmd: 'php --version', out: [['bash: php: command not found', '#ff8a8a']]}, {at: 4.2, cmd: 'mysql --version', out: [['bash: mysql: command not found', '#ff8a8a']]}], {size: 32, judul: 'Git Bash'});
    const q = muncul(t, t1 + .5); if (q > 0) { c.globalAlpha = pA * q; K.rrect(c, 260, 650, 1400, 130, 20, 'rgba(255,107,107,.08)', C.coral, 4);
      K.text(c, 'Programnya sudah terpasang, tetapi Windows belum tahu letaknya.', 960, 716, {size: 32, weight: 800, align: 'center'}); } c.restore(); }
  if (t < t2) return;
  const W = 546, X = [110, 687, 1264], Y = 230, H = 640;
  // panel 1: pencarian
  const p1 = muncul(t, t2 + .3); c.save(); c.globalAlpha = p1; K.nomor(c, 1, X[0] + 34, Y + 6, C.amber); K.text(c, 'Tombol Windows, ketik', X[0] + 84, Y + 8, {size: 28, weight: 800});
  K.rrect(c, X[0], Y + 60, W, H - 60, 14, '#1f2937', '#475569', 3); K.rrect(c, X[0] + 24, Y + 86, W - 48, 64, 32, '#fff', '#94a3b8', 2);
  const kata = 'environment', n = Math.floor(K.clamp((t - t2 - 2.4) * 8, 0, kata.length)); K.text(c, kata.slice(0, n), X[0] + 56, Y + 119, {size: 30, weight: 700, color: '#0f172a'});
  const r1 = muncul(t, t2 + 4.2); if (r1 > 0) { c.globalAlpha = p1 * r1; K.text(c, 'Best match', X[0] + 30, Y + 196, {size: 22, weight: 700, color: '#9ca3af'}); K.rrect(c, X[0] + 20, Y + 222, W - 40, 130, 10, '#374151');
    K.text(c, 'Edit the system', X[0] + 44, Y + 266, {size: 30, weight: 800, color: '#f9fafb'}); K.text(c, 'environment variables', X[0] + 44, Y + 306, {size: 30, weight: 800, color: '#f9fafb'}); K.text(c, 'Control panel', X[0] + 300, Y + 336, {size: 20, weight: 600, color: '#9ca3af'});
    sorotKuning(c, X[0] + 12, Y + 214, W - 24, 146, muncul(t, t2 + 5.4)); }
  c.restore();
  // panel 2: System Properties
  const p2 = muncul(t, t3); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.nomor(c, 2, X[1] + 34, Y + 6, C.amber); K.text(c, 'Path, lalu Edit', X[1] + 84, Y + 8, {size: 28, weight: 800});
    jendela(c, X[1], Y + 60, W, H - 60, 'System Properties', p2);
    K.rrect(c, X[1] + 110, Y + 150, 410, 60, 8, '#e2e8f0', '#64748b', 3); K.text(c, 'Environment Variables...', X[1] + 315, Y + 181, {size: 26, weight: 700, align: 'center', color: '#0f172a'});
    sorotKuning(c, X[1] + 100, Y + 140, 430, 80, muncul(t, t3 + .5) * (t < t3 + 2.6 ? 1 : 0));
    const q = muncul(t, t3 + 2.2); if (q > 0) { c.globalAlpha = p2 * q; K.text(c, 'System variables', X[1] + 28, Y + 260, {size: 24, weight: 800, color: '#475569'}); K.rrect(c, X[1] + 24, Y + 284, W - 48, 210, 6, '#fff', '#94a3b8', 2);
      [['ComSpec', 'C:\\Windows\\system32\\cmd.exe'], ['Path', 'C:\\Windows\\system32;C:\\Win...'], ['TEMP', 'C:\\Windows\\TEMP']].forEach(([k, v], i) => { const yy = Y + 320 + i * 64; if (i === 1) K.rrect(c, X[1] + 28, yy - 28, W - 56, 56, 4, '#bfdbfe');
        K.text(c, k, X[1] + 44, yy, {size: 25, weight: 800, color: '#0f172a'}); K.text(c, v, X[1] + 180, yy, {size: 20, weight: 600, mono: true, color: '#475569'}); });
      sorotKuning(c, X[1] + 20, Y + 350, W - 40, 68, muncul(t, t3 + 2.8) * (t < t3 + 4.6 ? 1 : 0));
      K.rrect(c, X[1] + 330, Y + 520, 180, 56, 8, '#e2e8f0', '#64748b', 3); K.text(c, 'Edit...', X[1] + 420, Y + 549, {size: 26, weight: 700, align: 'center', color: '#0f172a'}); sorotKuning(c, X[1] + 320, Y + 510, 200, 76, muncul(t, t3 + 4.6)); }
    c.restore(); }
  // panel 3: Edit environment variable
  const p3 = muncul(t, t4); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.nomor(c, 3, X[2] + 34, Y + 6, C.lime); K.text(c, 'New: dua baris baru', X[2] + 84, Y + 8, {size: 28, weight: 800});
    jendela(c, X[2], Y + 60, W, H - 60, 'Edit environment variable', p3); K.rrect(c, X[2] + 24, Y + 140, W - 48, 350, 6, '#fff', '#94a3b8', 2);
    ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\Git\\cmd'].forEach((s, i) => K.text(c, s, X[2] + 44, Y + 176 + i * 58, {size: 24, weight: 600, mono: true, color: '#475569'}));
    ['C:\\xampp\\php', 'C:\\xampp\\mysql\\bin'].forEach((s, i) => { const q = muncul(t, t4 + 1.6 + i * 2.2); if (q <= 0) return; c.save(); c.globalAlpha = p3 * q; const yy = Y + 350 + i * 64; K.rrect(c, X[2] + 30, yy - 30, W - 60, 60, 6, '#dcfce7', '#16a34a', 3);
      K.text(c, s, X[2] + 46, yy + 1, {size: 30, weight: 900, mono: true, color: '#14532d'}); c.restore(); });
    K.rrect(c, X[2] + 250, Y + 520, 130, 56, 8, '#2563eb'); K.text(c, 'OK', X[2] + 315, Y + 549, {size: 26, weight: 800, align: 'center', color: '#fff'}); K.rrect(c, X[2] + 396, Y + 520, 130, 56, 8, '#e2e8f0', '#64748b', 2); K.text(c, 'Cancel', X[2] + 461, Y + 549, {size: 24, weight: 700, align: 'center', color: '#475569'});
    sorotKuning(c, X[2] + 240, Y + 510, 150, 76, muncul(t, t5 + .3)); c.restore(); }
  const p5 = muncul(t, t5 + .6); if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, 110, 910, 1700, 100, 18, 'rgba(163,230,53,.08)', C.lime, 4);
    K.text(c, 'Tekan OK di semua jendela, lalu buka ulang terminalnya.', 960, 960, {size: 32, weight: 800, align: 'center'}); c.restore(); }
};

// ---------- b4: Git dan VS Code ----------
AD.siapGit = (c, t, D, a) => { K.bg(c); const tB = kt(a, 3), A = t < tB ? 1 : 1 - muncul(t, tB, .4), B = muncul(t, tB + .3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6);
  if (A > 0) { c.save(); c.globalAlpha = A; K.judulAlat(c, 2, 'Git', '   menyimpan riwayat kode', t, C.coral);
    K.browser(c, 110, 220, 880, 560, 'git-scm.com', (c, x, y, w, h) => { K.text(c, 'Git', x + 70, y + 110, {size: 76, weight: 900, color: '#c2410c'});
      tombol(c, x + 70, y + 210, 420, 92, 'Download untuk Windows', '#ea580c', muncul(t, kt(a, 1) + 1.2), t);
      K.text(c, 'Pasang dengan pilihan bawaannya', x + 70, y + 370, {size: 28, weight: 700, color: '#475569'}); }, muncul(t, Math.min(kt(a, 1), 2.6)));
    const g = muncul(t, kt(a, 2)); if (g > 0) { c.save(); c.globalAlpha *= g; K.term(c, 1060, 260, 760, 330, t, [{at: kt(a, 2) + .8, cmd: 'git --version', out: ['git version 2.47.1.windows.1']}], {judul: 'Git Bash', size: 30});
      K.text(c, 'Git Bash ikut terpasang di Windows', 1440, 650, {size: 30, weight: 800, align: 'center', color: C.amber}); c.restore(); }
    c.restore(); }
  if (B > 0) { c.save(); c.globalAlpha = B; K.judulAlat(c, 3, 'VS Code', '   tempat kita menulis kode', 9, C.sky);
    K.browser(c, 110, 200, 700, 300, 'code.visualstudio.com', (c, x, y, w, h) => { tombol(c, x + 60, y + 70, 420, 92, 'Download VS Code', '#2563eb', muncul(t, tB + 1.6) * (t < t4 ? 1 : 0), t); }, 1);
    // menu Terminal > New Terminal
    const m4 = muncul(t, t4 + .2); if (m4 > 0) { c.save(); c.globalAlpha *= m4; const mx = 880, my = 200; K.rrect(c, mx, my, 930, 60, 10, '#181825', '#3b4a75', 2);
      ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].forEach((s, i) => { const xx = mx + 30 + [0, 80, 160, 310, 400, 470, 550, 700][i]; if (i === 6) K.rrect(c, xx - 14, my + 8, 136, 44, 6, '#313244'); K.text(c, s, xx, my + 31, {size: 24, weight: i === 6 ? 800 : 600, color: '#f8fafc'}); });
      const d = muncul(t, t4 + 1.6); if (d > 0) { c.globalAlpha *= d; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 24; K.rrect(c, mx + 566, my + 62, 360, 190, 10, '#2a2a3c', '#4b5578', 2); c.shadowColor = 'transparent';
        ['New Terminal', 'Split Terminal', 'Run Task...'].forEach((s, i) => { const yy = my + 100 + i * 58; if (i === 0) K.rrect(c, mx + 574, yy - 26, 344, 52, 6, '#2563eb'); K.text(c, s, mx + 596, yy + 1, {size: 25, weight: i === 0 ? 800 : 600, color: '#f8fafc'}); });
        sorotKuning(c, mx + 568, my + 68, 356, 64, muncul(t, t4 + 2.4)); }
      c.restore(); }
    // panel terminal VS Code dengan menu pilihan terminal
    const px = 110, py = 560, pw = 1700, ph = 420, q = muncul(t, t4 + 3.4);
    c.save(); c.globalAlpha *= q; K.rrect(c, px, py, pw, ph, 14, '#1e1e2e', '#3b4a75', 3); K.rrect(c, px, py, pw, 56, 14, '#181825'); c.fillStyle = '#181825'; c.fillRect(px + 2, py + 30, pw - 4, 28);
    ['PROBLEMS', 'OUTPUT', 'TERMINAL'].forEach((s, i) => K.text(c, s, px + 40 + i * 190, py + 29, {size: 22, weight: 800, color: i === 2 ? '#f8fafc' : '#7c8aa8'})); c.fillStyle = '#60a5fa'; c.fillRect(px + 416, py + 52, 140, 4);
    K.text(c, '+', px + pw - 330, py + 28, {size: 34, weight: 700, color: '#f8fafc'}); K.text(c, '⌄', px + pw - 292, py + 30, {size: 30, weight: 900, color: '#f8fafc'});
    sorotKuning(c, px + pw - 356, py + 6, 96, 46, muncul(t, t5 + .4) * (t < t5 + 2.6 ? 1 : 0));
    K.text(c, t >= t5 + 3.6 ? 'user@laptop MINGW64 ~/Documents/sipinjam' : 'PS C:\\Users\\user\\Documents\\sipinjam>', px + 36, py + 110, {size: 26, weight: 700, mono: true, color: t >= t5 + 3.6 ? C.lime : '#cbd5e1'});
    if (t >= t5 + 3.6) K.text(c, '$ ', px + 36, py + 152, {size: 26, weight: 700, mono: true, color: '#f8fafc'});
    const m = t < t5 + 3.6 ? muncul(t, t5 + 1.4) : 1 - muncul(t, t5 + 3.6, .3); if (m > 0) { c.globalAlpha *= m; const mx = px + pw - 640, my = py + 64; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 24; K.rrect(c, mx, my, 420, 300, 10, '#2a2a3c', '#4b5578', 2); c.shadowColor = 'transparent';
      ['PowerShell', 'Command Prompt', 'Git Bash', 'JavaScript Debug Terminal'].forEach((s, i) => { const yy = my + 46 + i * 68; if (i === 2) { K.rrect(c, mx + 8, yy - 30, 404, 60, 8, '#2563eb'); sorotKuning(c, mx + 2, yy - 36, 416, 72, muncul(t, t5 + 2.3)); }
        K.text(c, s, mx + 30, yy, {size: 26, weight: i === 2 ? 800 : 600, color: '#f8fafc'}); }); }
    c.restore();
    const p6 = muncul(t, t6); if (p6 > 0) { c.save(); c.globalAlpha *= p6; K.rrect(c, px + 40, py + 250, 1120, 120, 18, 'rgba(255,176,32,.12)', C.amber, 4);
      K.text(c, 'Pakai Git Bash, supaya perintahmu sama persis', px + 80, py + 290, {size: 30, weight: 800}); K.text(c, 'dengan yang diketik di video ini.', px + 80, py + 334, {size: 30, weight: 800}); c.restore(); }
    c.restore(); }
};

// ---------- b12: coba di HP ----------
AD.cobaHP1 = (c, t, D, a) => { K.bg(c); K.judul(c, 'Coba di HP sungguhan, dari sekarang', t, C.sky);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4);
  const p1 = muncul(t, Math.min(t1, 3)); if (p1 > 0) K.term(c, 110, 200, 1130, 250, t, [{at: t1 + 1.2, cmd: 'php -S 0.0.0.0:8000 -t public', out: ['PHP 8.2 Development Server (http://0.0.0.0:8000) started']}], {size: 27, judul: 'Git Bash: server', p: p1, sorot: [[0, -1, t1 + 3.2, t2]]});
  const k1 = t < t2 ? muncul(t, t1 + 4.6) : 0; if (k1 > 0) K.text(c, '0.0.0.0 = menerima sambungan dari perangkat lain', 675, 500, {size: 30, weight: 800, align: 'center', color: C.amber, alpha: k1});
  const p2 = muncul(t, t2 - .2); if (p2 > 0) K.term(c, 110, 480, 1130, 330, t, [{at: t2 + .5, cmd: 'ipconfig', out: ['Wireless LAN adapter Wi-Fi:', '   IPv4 Address. . . . . . : 192.168.1.23', '   Subnet Mask . . . . . . : 255.255.255.0']}],
    {size: 27, judul: 'Git Bash: terminal kedua', p: p2, sorot: [[0, 1, t2 + 2.4]]});
  // Wi-Fi yang sama
  const p3 = muncul(t, t3); if (p3 > 0 && t < t4) { c.save(); c.globalAlpha = p3; K.laptop(c, 300, 920, .5); const rx = 675, ry = 930; c.strokeStyle = C.sky; c.lineWidth = 5;
    for (let i = 1; i <= 3; i++) { c.globalAlpha = p3 * ((Math.floor(t * 2) + i) % 3 === 0 ? 1 : .4); c.beginPath(); c.arc(rx, ry, 16 * i, Math.PI * 1.2, Math.PI * 1.8); c.stroke(); } c.globalAlpha = p3;
    K.text(c, 'Wi-Fi yang sama', rx, ry + 44, {size: 28, weight: 800, align: 'center', color: C.sky});
    c.setLineDash([10, 10]); c.lineWidth = 4; c.beginPath(); c.moveTo(400, 920); c.lineTo(590, 920); c.moveTo(760, 920); c.lineTo(1330, 920); c.stroke(); c.setLineDash([]); c.restore(); }
  // HP
  const ph = muncul(t, Math.min(t1, 3)); c.save(); c.globalAlpha = ph; const hx = 1360, hy = 170, hw = 420, hh = 840;
  K.hp(c, hx, hy, hw, hh, (c, x, y, w, h) => { c.fillStyle = '#fff'; c.fillRect(x, y, w, h); c.fillStyle = '#e2e8f0'; c.fillRect(x, y, w, 70); K.rrect(c, x + 14, y + 12, w - 28, 46, 23, '#fff', '#94a3b8', 2);
    const url = '192.168.1.23:8000', n = Math.floor(K.clamp((t - t3 - 3.6) * 7, 0, url.length)); K.text(c, url.slice(0, n), x + 34, y + 36, {size: 22, weight: 700, mono: true, color: '#1e293b'});
    const q = muncul(t, t3 + 3.6 + url.length / 7 + .8, .4); if (q > 0) { c.save(); c.globalAlpha *= q; K.text(c, 'SiPinjam tersambung ke MySQL versi 8.0.46-0ubuntu0.24.04.5', x + 18, y + 116, {size: 25, weight: 500, color: '#111', maxW: w - 36, lh: 1.35}); c.restore(); }
    else if (t < t3 + 3.6) K.text(c, 'ketik alamat IP laptop', x + w / 2, y + 300, {size: 22, weight: 700, align: 'center', color: '#64748b'}); });
  sorotKuning(c, hx + 16, hy + 30, hw - 32, 62, muncul(t, t3 + 3.2) * (t < t3 + 8 ? 1 : 0)); c.restore();
  // firewall
  const p7 = muncul(t, t4); if (p7 > 0) { c.save(); c.globalAlpha = p7; const x = 190, y = 500 + (1 - p7) * 20; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 30; K.rrect(c, x, y, 970, 330, 14, '#f1f5f9', '#475569', 3); c.shadowColor = 'transparent';
    K.rrect(c, x, y, 970, 58, 14, '#1d4ed8'); c.fillStyle = '#1d4ed8'; c.fillRect(x + 2, y + 34, 966, 26); K.text(c, 'Windows Security Alert', x + 26, y + 30, {size: 26, weight: 800, color: '#fff'});
    K.text(c, 'Firewall memblokir sebagian fitur aplikasi ini', x + 40, y + 120, {size: 30, weight: 700, color: '#1e293b'}); K.text(c, 'Name:  CLI (php.exe)     Jaringan pribadi (Private networks)', x + 40, y + 170, {size: 24, weight: 600, color: '#475569'});
    tombol(c, x + 560, y + 236, 230, 62, 'Allow access', '#2563eb', muncul(t, t4 + 1.8), t); K.rrect(c, x + 810, y + 236, 130, 62, 12, '#e2e8f0', '#94a3b8', 2); K.text(c, 'Cancel', x + 875, y + 268, {size: 24, weight: 700, align: 'center', color: '#475569'}); c.restore(); }
};
})();
