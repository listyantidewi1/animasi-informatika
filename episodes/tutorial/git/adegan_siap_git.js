// Adegan persiapan dan layar GitHub untuk seri "Git dan Kerja Tim" (digambar dengan kode, tanpa logo).
// a._kal = detik mulai tiap kalimat narasi (diisi rakit_git.py), supaya gambar muncul tepat saat disebut.
(() => {
const C = K.C, T = K.text, S = K.seg, O = K.out, AD = K.adegan;
const REPO = 'github.com/listyantidewi1/SiAntre-git';
const kt = (a, i, d = 0) => (a && a._kal && a._kal[i] != null ? a._kal[i] : (a && a._cad ? a._cad * i : 9e9)) + d;
const muncul = (t, t0, d = .5) => O(S(t, t0, t0 + d));
const antara = (t, t0, t1, d = .4) => Math.min(O(S(t, t0, t0 + d)), 1 - O(S(t, t1 - d, t1)));
const alpha = (c, a, fn) => { if (a <= 0) return; c.save(); c.globalAlpha *= a; fn(); c.restore(); };
const GH = {bg: '#ffffff', abu: '#f6f8fa', garis: '#d0d7de', teks: '#1f2328', redup: '#59636e', biru: '#0969da', hijau: '#1f883d'};

// ---------- pembantu ----------
const sorot = (c, x, y, w, h, p, t = 0) => { if (p <= 0) return; const g = 6 + 4 * Math.sin(t * 5); c.save(); c.globalAlpha *= p;
  K.rrect(c, x - g, y - g, w + 2 * g, h + 2 * g, 12 + g, 'rgba(255,176,32,.16)', C.amber, 5); c.restore(); };
const tombol = (c, x, y, w, h, teks, warna, o = {}) => { K.rrect(c, x, y, w, h, o.r ?? 10, warna, o.garis, 2); let fs = o.size || h * .42;
  while (fs > 12 && K.lebar(c, teks, fs, 700) > w - 28) fs -= 1; T(c, teks, x + w / 2, y + h / 2 + 1, {size: fs, weight: 700, align: 'center', color: o.warnaTeks || '#fff'}); };
const label = (c, teks, x, y, p, warna = C.amber) => alpha(c, p, () => { const w = K.lebar(c, teks, 30, 800) + 44; K.rrect(c, x, y, w, 60, 14, '#0d1222', warna, 4); T(c, teks, x + 22, y + 31, {size: 30, weight: 800}); });
const judulAlat = (c, n, nama, ket, t, warna = C.amber) => alpha(c, muncul(t, .1), () => { c.fillStyle = warna; c.beginPath(); c.arc(114, 96, 34, 0, 7); c.fill();
  T(c, String(n), 114, 98, {size: 38, weight: 900, align: 'center', color: '#141a2c'}); T(c, nama, 170, 96, {size: 54, weight: 900}); T(c, ket, 190 + K.lebar(c, nama, 54, 900), 100, {size: 32, weight: 600, color: C.redup}); });
// kotak alamat repo, selalu tampil saat repo disebut
K.chipRepo = (c, p, o = {}) => { if (p <= 0) return; const w = o.w || 1180, x = o.x ?? (1920 - w) / 2, y = o.y ?? 900, dy = (1 - p) * 24;
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 26; K.rrect(c, x, y + dy, w, 124, 22, '#0d1222', C.amber, 4); c.shadowColor = 'transparent';
  K.rrect(c, x + 24, y + dy + 24, 170, 76, 14, C.amber); T(c, o.tag || 'GitHub', x + 109, y + dy + 63, {size: 28, weight: 900, align: 'center', color: '#141a2c'});
  T(c, o.ket || 'Proyek awal ada di halaman Releases', x + 220, y + dy + 40, {size: 26, weight: 700, color: C.redup});
  T(c, o.alamat || REPO, x + 220, y + dy + 86, {size: 38, weight: 800, mono: true}); c.restore(); };
// jendela terminal. baris: [{at, cmd, prompt?, out?: [teks | [teks, warna]], jeda?}]; o.sorot = [[baris, out(-1 = perintah), t0, t1?]]
K.term = (c, x, y, w, h, t, baris, o = {}) => {
  const size = o.size || 30, lh = size * 1.6, cps = o.cps || 18, p = o.p ?? 1; if (p <= 0) return;
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 16, '#0a0f1e', '#3b4a75', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 50, 16, '#1b2440'); c.fillStyle = '#1b2440'; c.fillRect(x + 2, y + 30, w - 4, 22);
  T(c, o.judul || 'Terminal', x + w / 2, y + 26, {size: 22, weight: 700, align: 'center', color: C.redup});
  c.beginPath(); c.rect(x, y + 52, w, h - 54); c.clip();
  let yy = y + 52 + 22 + lh / 2;
  const kotak = (i, j) => { for (const s of (o.sorot || [])) if (s[0] === i && s[1] === j && t >= s[2] && t < (s[3] ?? 9e9)) K.rrect(c, x + 10, yy - lh / 2 + 2, w - 20, lh - 4, 8, 'rgba(255,176,32,.2)', C.amber, 3); };
  baris.forEach((b, i) => { if (t < b.at) return; const pr = b.prompt ?? '$ ', n = Math.floor((t - b.at) * cps), sel = b.at + b.cmd.length / cps;
    kotak(i, -1); T(c, pr, x + 26, yy, {size, weight: 700, mono: true, color: b.warnaPrompt || C.lime}); const px = x + 26 + K.lebar(c, pr, size, 700, true);
    T(c, b.cmd.slice(0, n), px, yy, {size, weight: 500, mono: true});
    if (t < sel + .15 && Math.floor(t * 2.5) % 2 === 0) { c.fillStyle = '#e6e9f2'; c.fillRect(px + K.lebar(c, b.cmd.slice(0, n), size, 500, true) + 2, yy - size * .55, size * .5, size * 1.1); }
    yy += lh;
    if (t >= sel + (b.jeda ?? .45)) (b.out || []).forEach((u, j) => { const [s, w2] = Array.isArray(u) ? u : [u, '#aab4d0']; kotak(i, j);
      T(c, s, x + 26, yy, {size, weight: 500, mono: true, color: w2}); yy += lh; });
  });
  c.restore();
};
// jendela browser terang; isi(c, x, y, w, h)
K.browser = (c, x, y, w, h, url, isi, p = 1, z = 1.2) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; y += (1 - p) * 26;
  c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 16, '#ffffff', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 70, 16, '#dbe2ee'); c.fillStyle = '#dbe2ee'; c.fillRect(x + 2, y + 40, w - 4, 32);
  [0, 1, 2].forEach(i => { c.fillStyle = '#94a3b8'; c.beginPath(); c.arc(x + 32 + i * 28, y + 35, 8, 0, 7); c.fill(); });
  K.rrect(c, x + 130, y + 13, w - 160, 44, 22, '#ffffff', '#b6c2d6', 2); T(c, url, x + 156, y + 36, {size: 25, weight: 700, mono: true, color: '#1e293b'});
  c.beginPath(); c.rect(x, y + 72, w, h - 74); c.clip(); if (isi) { c.translate(x, y + 72); c.scale(z, z); isi(c, 0, 0, w / z, (h - 72) / z); } c.restore(); };
// jendela penginstal
const wizard = (c, x, y, w, h, judul, isi, p = 1, o = {}) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; y += (1 - p) * 26;
  c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 12, '#f1f5f9', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 58, 12, '#334155'); c.fillStyle = '#334155'; c.fillRect(x + 2, y + 34, w - 4, 26); T(c, judul, x + 26, y + 30, {size: 26, weight: 800, color: '#f8fafc'});
  if (isi) isi(c, x, y + 60, w, h - 150);
  c.fillStyle = '#cbd5e1'; c.fillRect(x + 2, y + h - 88, w - 4, 2);
  tombol(c, x + w - 370, y + h - 68, 160, 48, '< Back', '#e2e8f0', {garis: '#94a3b8', warnaTeks: '#475569'}); tombol(c, x + w - 190, y + h - 68, 160, 48, 'Next >', '#2563eb');
  if (o.sorotNext) sorot(c, x + w - 190, y + h - 68, 160, 48, o.sorotNext, o.t || 0); c.restore(); };
// jendela VS Code sederhana (gelap); menu = nama menu yang terbuka
const vscode = (c, x, y, w, h, isi, p = 1) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; y += (1 - p) * 26;
  c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 12, '#1e1e1e', '#3c3c3c', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 46, 12, '#2d2d2d'); c.fillStyle = '#2d2d2d'; c.fillRect(x + 2, y + 26, w - 4, 22);
  ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].forEach((m, i) => T(c, m, x + 30 + i * 112, y + 24, {size: 22, weight: 600, color: '#cccccc'}));
  c.fillStyle = '#333333'; c.fillRect(x + 2, y + 48, 64, h - 50);
  c.beginPath(); c.rect(x, y + 48, w, h - 50); c.clip(); if (isi) isi(c, x, y + 48, w, h - 48); c.restore(); };
const menu = (c, x, y, w, item, pilih, p, t) => alpha(c, p, () => { const h = 54 * item.length + 16; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 24;
  K.rrect(c, x, y, w, h, 8, '#252526', '#454545', 2); c.shadowColor = 'transparent';
  item.forEach((s, i) => { if (i === pilih) K.rrect(c, x + 8, y + 8 + i * 54, w - 16, 50, 6, '#04395e'); T(c, s, x + 28, y + 34 + i * 54, {size: 24, weight: 600, color: '#e5e5e5'}); });
  if (pilih != null) sorot(c, x + 8, y + 8 + pilih * 54, w - 16, 50, 1, t); });
// halaman GitHub (terang, tanpa logo): kepala + isi
const ghKepala = (c, x, y, w, o = {}) => { c.fillStyle = GH.abu; c.fillRect(x, y, w, 76); c.fillStyle = GH.garis; c.fillRect(x, y + 75, w, 2);
  K.rrect(c, x + 30, y + 20, 36, 36, 18, '#1f2328'); if (o.jalur) T(c, o.jalur, x + 86, y + 38, {size: 26, weight: 700, color: GH.teks});
  if (o.plus !== false) { K.rrect(c, x + w - 190, y + 18, 60, 40, 8, '#fff', GH.garis, 2); T(c, '+ ▾', x + w - 160, y + 39, {size: 22, weight: 800, align: 'center', color: GH.teks}); }
  K.rrect(c, x + w - 110, y + 18, 40, 40, 20, '#8c959f'); };
const ghTab = (c, x, y, tabs, aktif) => { let xx = x; tabs.forEach((s, i) => { const w = K.lebar(c, s, 24, 600) + 40;
  T(c, s, xx + 20, y, {size: 24, weight: i === aktif ? 700 : 500, color: GH.teks}); if (i === aktif) K.rrect(c, xx + 8, y + 24, w - 16, 5, 3, '#fd8c73'); xx += w; }); };
const masukan = (c, x, y, w, judul, isi, o = {}) => { T(c, judul, x, y, {size: 24, weight: 700, color: GH.teks}); K.rrect(c, x, y + 22, w, 54, 8, '#fff', o.fokus ? GH.biru : GH.garis, o.fokus ? 3 : 2);
  T(c, isi, x + 18, y + 50, {size: 24, weight: 500, color: isi ? GH.teks : GH.redup, mono: o.mono}); };
const kotakCentang = (c, x, y, teks, on) => { K.rrect(c, x, y - 15, 30, 30, 6, on ? GH.biru : '#fff', on ? GH.biru : '#8c959f', 2);
  if (on) { c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.moveTo(x + 7, y); c.lineTo(x + 13, y + 7); c.lineTo(x + 24, y - 7); c.stroke(); }
  T(c, teks, x + 46, y + 1, {size: 26, weight: 600, color: GH.teks}); };

// ---------- G01 Persiapan ----------
AD.siapAlat = (c, t, D, a) => { K.bg(c); const p1 = muncul(t, .1, .6), p2 = muncul(t, .4, .7);
  alpha(c, p1, () => { K.rrect(c, 160, 230, 280, 64, 32, C.amber); T(c, 'PERSIAPAN', 300, 263, {size: 30, weight: 900, align: 'center', color: '#141a2c'}); });
  alpha(c, p2, () => T(c, 'Memasang alat', 160, 390 + 20 * (1 - p2), {size: 92, weight: 900}));
  T(c, 'Dua alat, keduanya gratis', 160, 490, {size: 38, weight: 500, color: '#c9d3ee', alpha: muncul(t, .9)});
  [['Git', 'menyimpan riwayat kode', C.coral], ['VS Code', 'menulis kode dan terminal', C.sky]].forEach(([n, k, w], i) => { const p = muncul(t, 1.2 + i * .35);
    alpha(c, p, () => { const x = 1060 + (1 - p) * 30, y = 260 + i * 170; K.rrect(c, x, y, 700, 136, 20, 'rgba(255,255,255,.05)', w, 4);
      c.fillStyle = w; c.beginPath(); c.arc(x + 66, y + 68, 34, 0, 7); c.fill(); T(c, String(i + 1), x + 66, y + 70, {size: 38, weight: 900, align: 'center', color: '#141a2c'});
      T(c, n, x + 124, y + 48, {size: 42, weight: 900}); T(c, k, x + 124, y + 98, {size: 26, weight: 600, color: C.redup}); }); });
  const q = muncul(t, kt(a, 1)); alpha(c, q, () => { K.rrect(c, 160, 640, 800, 150, 22, 'rgba(163,230,53,.08)', C.lime, 4);
    T(c, 'Sudah terpasang?', 200, 690, {size: 34, weight: 800, color: C.lime}); T(c, 'Lompat lewat cap waktu di deskripsi', 200, 744, {size: 30, weight: 600}); });
};
AD.siapGit = (c, t, D, a) => { K.bg(c); judulAlat(c, 1, 'Git', '   menyimpan riwayat kode', t, C.coral);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  const pB = 1 - muncul(t, t2 - .2, .5);
  K.browser(c, 110, 190, 1100, 640, 'git-scm.com', (c, x, y) => { T(c, 'git', x + 70, y + 110, {size: 86, weight: 900, color: '#f05033'});
    T(c, 'Unduh untuk Windows, macOS, atau Linux', x + 70, y + 200, {size: 32, weight: 600, color: '#475569'});
    tombol(c, x + 70, y + 270, 460, 92, 'Download for Windows', '#f05033'); sorot(c, x + 70, y + 270, 460, 92, antara(t, t1 + .8, t2), t);
    T(c, 'macOS · Linux/Unix', x + 70, y + 420, {size: 28, weight: 600, color: '#64748b'}); }, muncul(t, .3) * pB);
  if (t >= t2 - .2) { const hal = t < t4 ? 0 : 1, p = muncul(t, t2);
    wizard(c, 260, 180, 1400, 680, 'Git Setup', (c, x, y, w) => {
      if (hal === 0) { T(c, 'Choosing the default editor used by Git', x + 40, y + 50, {size: 32, weight: 800, color: '#0f172a'});
        const on = t >= t3 + 1.2; K.rrect(c, x + 40, y + 110, w - 80, 64, 8, '#fff', on ? '#2563eb' : '#94a3b8', on ? 3 : 2);
        T(c, on ? "Use Visual Studio Code as Git's default editor" : 'Use Vim (the ubiquitous text editor) as Git\'s default editor', x + 62, y + 143, {size: 26, weight: 600, color: '#0f172a'});
        T(c, '▾', x + w - 76, y + 143, {size: 28, weight: 800, color: '#475569'}); sorot(c, x + 40, y + 110, w - 80, 64, antara(t, t3 + .3, t4), t);
        alpha(c, muncul(t, t3 + 1.4), () => label(c, 'Pilih VS Code, bukan Vim', x + 40, y + 230, 1));
      } else { T(c, 'Adjusting the name of the initial branch in new repositories', x + 40, y + 50, {size: 30, weight: 800, color: '#0f172a'});
        const ov = t >= t4 + 1.0, ket = Math.min(4, Math.floor(Math.max(0, t - t4 - 1.6) * 6));
        [['Let Git decide', !ov], ['Override the default branch name for new repositories', ov]].forEach(([s, on], i) => { const yy = y + 130 + i * 70;
          c.beginPath(); c.arc(x + 58, yy, 15, 0, 7); c.fillStyle = '#fff'; c.fill(); c.strokeStyle = '#64748b'; c.lineWidth = 3; c.stroke();
          if (on) { c.beginPath(); c.arc(x + 58, yy, 8, 0, 7); c.fillStyle = '#2563eb'; c.fill(); } T(c, s, x + 90, yy + 1, {size: 26, weight: 600, color: '#0f172a'}); });
        K.rrect(c, x + 90, y + 250, 420, 60, 8, '#fff', ov ? '#2563eb' : '#cbd5e1', ov ? 3 : 2); T(c, 'main'.slice(0, ket), x + 110, y + 281, {size: 28, weight: 700, mono: true, color: '#0f172a'});
        sorot(c, x + 40, y + 160, w - 80, 160, antara(t, t4 + .5, t5 + .2), t);
      } }, p, {sorotNext: antara(t, t5, D + 1), t});
  }
};
AD.siapVSCode = (c, t, D, a) => { K.bg(c); judulAlat(c, 2, 'VS Code', '   menulis kode dan terminal', t, C.sky);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4);
  K.browser(c, 110, 190, 1100, 640, 'code.visualstudio.com', (c, x, y) => { T(c, 'Visual Studio Code', x + 70, y + 110, {size: 66, weight: 900, color: '#0065a9'});
    T(c, 'Editor kode gratis', x + 70, y + 190, {size: 32, weight: 600, color: '#475569'}); tombol(c, x + 70, y + 270, 460, 92, 'Download for Windows', '#0065a9'); }, muncul(t, .3) * (1 - muncul(t, t1 - .2, .5)));
  if (t < t1 - .2) return;
  vscode(c, 160, 170, 1600, 720, (c, x, y, w, h) => {
    const adaTerm = t >= t1 + 2.2; if (adaTerm) { c.fillStyle = '#181818'; c.fillRect(x + 66, y + h - 330, w - 66, 330); c.fillStyle = '#2b2b2b'; c.fillRect(x + 66, y + h - 330, w - 66, 44);
      T(c, 'TERMINAL', x + 100, y + h - 308, {size: 20, weight: 700, color: '#e5e5e5'}); const sh = t >= t2 + 2.0 ? 'bash' : 'powershell';
      T(c, sh, x + w - 300, y + h - 308, {size: 20, weight: 600, color: '#cccccc'}); T(c, '+  ▾', x + w - 190, y + h - 308, {size: 24, weight: 800, color: '#e5e5e5'});
      sorot(c, x + w - 152, y + h - 326, 40, 36, antara(t, t2 + .2, t2 + 1.4), t);
      if (t >= t2 + 2.0) K.term(c, x + 70, y + h - 286, w - 74, 282, t, [{at: t3 + .3, cmd: 'git --version', out: [['git version 2.47.1.windows.1', '#e6e9f2']], jeda: .6}],
        {judul: 'Git Bash', size: 30, cps: 14, sorot: [[0, 0, t4, D + 1]]});
      else T(c, 'PS C:\\Users\\kamu>', x + 100, y + h - 250, {size: 26, weight: 500, mono: true, color: '#cccccc'}); }
    T(c, 'Selamat datang', x + 120, y + 90, {size: 40, weight: 800, color: '#e5e5e5'});
  }, muncul(t, t1 - .1));
  menu(c, 160 + 30 + 6 * 112 - 10, 170 + 46, 320, ['New Terminal', 'Split Terminal', 'Run Task...'], t >= t1 + 1 ? 0 : null, antara(t, t1 + .3, t1 + 2.2), t);
  menu(c, 1290, 890 - 330 + 10, 330, ['PowerShell', 'Git Bash', 'Command Prompt'], t >= t2 + 1.1 ? 1 : null, antara(t, t2 + .5, t2 + 2.0), t);
};
AD.siapProyek = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  const pB = muncul(t, .2) * (1 - muncul(t, t2 - .2, .5));
  K.browser(c, 160, 110, 1600, 700, REPO + '/releases', (c, x, y, w) => { ghKepala(c, x, y, w, {jalur: 'listyantidewi1 / SiAntre-git', plus: false});
    ghTab(c, x + 30, y + 120, ['Code', 'Issues', 'Pull requests', 'Releases'], 3);
    T(c, 'Proyek awal seri Git dan Kerja Tim', x + 40, y + 210, {size: 34, weight: 800, color: GH.teks});
    K.rrect(c, x + 40, y + 250, w - 80, 360, 8, '#fff', GH.garis, 2); T(c, 'Assets', x + 66, y + 284, {size: 24, weight: 700, color: GH.teks});
    ['g01-awal.zip', 'g02-awal.zip', 'g03-awal.zip', 'g04-awal.zip', 'g05-awal.zip', 'g06-awal.zip'].forEach((f, i) => { const yy = y + 330 + i * 46;
      T(c, '📦 ' + f, x + 70, yy, {size: 24, weight: 600, color: GH.biru}); });
    sorot(c, x + 56, y + 312, 300, 40, antara(t, t1 + .6, t2), t); }, pB, 1);
  K.chipRepo(c, antara(t, .2, t2 + .4), {y: 880});
  if (t >= t2 - .2) vscode(c, 160, 150, 1600, 720, (c, x, y, w, h) => { const buka = t >= t2 + 2.6;
    if (buka) { c.fillStyle = '#252526'; c.fillRect(x + 66, y, 380, h); T(c, 'EXPLORER', x + 90, y + 30, {size: 18, weight: 700, color: '#bbbbbb'}); T(c, '∨ SIANTRE', x + 90, y + 70, {size: 22, weight: 800, color: '#e5e5e5'});
      ['› public', '.env', 'antrean.js', 'package.json', 'server.js'].forEach((f, i) => T(c, f, x + 116, y + 112 + i * 40, {size: 22, weight: 500, color: '#cccccc'}));
      alpha(c, muncul(t, t3 + .4), () => label(c, 'Belum ada folder .git', x + 500, y + 120, 1, C.lime)); }
    else T(c, 'Selamat datang', x + 120, y + 90, {size: 40, weight: 800, color: '#e5e5e5'}); }, muncul(t, t2));
  if (t >= t2) { menu(c, 190, 196, 320, ['New File...', 'Open File...', 'Open Folder...'], t >= t2 + 1.0 ? 2 : null, antara(t, t2 + .3, t2 + 1.6), t);
    alpha(c, antara(t, t2 + 1.6, t2 + 2.6), () => { K.rrect(c, 560, 330, 800, 300, 12, '#2d2d2d', '#555', 2); T(c, 'Open Folder', 590, 370, {size: 24, weight: 700, color: '#e5e5e5'});
      T(c, 'Unduhan  ›  g01-awal  ›  siantre', 590, 440, {size: 24, weight: 600, color: '#cccccc', mono: true}); tombol(c, 1150, 560, 180, 50, 'Select Folder', '#0e639c'); sorot(c, 1150, 560, 180, 50, 1, t); }); }
};
AD.siapConfig = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2);
  K.term(c, 160, 170, 1600, 520, t, [
    {at: -9, cmd: 'git config --global user.name "Raka"', jeda: .2}, {at: -9, cmd: 'git config --global user.email "raka@majujaya.id"', jeda: .2},
    {at: t1 + .2, cmd: 'git config --global init.defaultBranch main', jeda: .2}, {at: t2 + .2, cmd: 'git config --global core.editor "code --wait"', jeda: .2}],
    {judul: 'Git Bash', size: 32, cps: 16, sorot: [[2, -1, t1 + 2.8, t2], [3, -1, t2 + 2.8, D + 1]]});
  alpha(c, muncul(t, t1 + 2.6), () => label(c, 'branch pertama: main', 160, 740, 1, C.teal));
  alpha(c, muncul(t, t2 + 2.6), () => label(c, 'pesan commit dibuka di VS Code', 700, 740, 1, C.sky));
};
AD.logQ = (c, t, D, a) => { K.bg(c); K.term(c, 260, 160, 1400, 620, t, [{at: .2, cmd: 'git log', jeda: .3, out: ['commit 6b05a91... (HEAD -> main)', 'Author: Raka <raka@majujaya.id>', '', '    Ubah format nomor menjadi tiga digit', 'commit faaadef...', ['', '#aab4d0'], [':', '#e6e9f2']]}],
  {judul: 'Git Bash', size: 30, sorot: [[0, 6, 1.6, D + 1]]});
  alpha(c, muncul(t, 2.0), () => { K.rrect(c, 760, 830, 120, 120, 18, '#e2e8f0', '#94a3b8', 4); T(c, 'q', 820, 890, {size: 64, weight: 900, align: 'center', color: '#0f172a'});
    T(c, 'tekan q untuk keluar', 910, 890, {size: 36, weight: 700}); });
};
// prasyarat + alamat repo (G02..G06): kalimat ke-a.kalRepo menyebut alamat
const prasAsli = AD.prasyarat;
AD.prasyaratRepo = (c, t, D, a) => { prasAsli(c, t + 5, D, a); K.chipRepo(c, muncul(t, kt(a, a.kalRepo ?? 1)), {y: 880, tag: 'Releases', ket: 'Unduh ' + a.berkas + ' dari halaman Releases'}); };

// ---------- G04: menjalankan aplikasi ----------
AD.nodeJalan = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1);
  K.browser(c, 120, 160, 780, 420, 'nodejs.org', (c, x, y) => { T(c, 'Node.js', x + 50, y + 90, {size: 60, weight: 900, color: '#166534'});
    tombol(c, x + 50, y + 170, 400, 80, 'Download Node.js (LTS)', '#16a34a'); sorot(c, x + 50, y + 170, 400, 80, antara(t, .8, t1), t); }, muncul(t, .2));
  K.term(c, 960, 160, 840, 520, t, [{at: t1 + .2, cmd: 'npm install', out: ['added 64 packages in 3s'], jeda: .8}, {at: t1 + 2.6, cmd: 'node server.js', out: [['SiAntre jalan di http://localhost:3001', '#e6e9f2']], jeda: .6}],
    {judul: 'Git Bash', size: 28, cps: 14, sorot: [[1, 0, t1 + 4.2, D + 1]]});
  K.browser(c, 120, 640, 780, 330, 'localhost:3001', (c, x, y) => { T(c, 'Bengkel Maju Jaya', x + 40, y + 70, {size: 40, weight: 800, color: '#1e3a8a'});
    tombol(c, x + 40, y + 130, 320, 70, 'Ambil Nomor', '#2563eb'); }, muncul(t, t1 + 4.6));
};

// ---------- G05: GitHub ----------
AD.ghDaftar = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di GitHub: buat akun', t, C.sky); const t1 = kt(a, 1), t2 = kt(a, 2);
  K.browser(c, 260, 190, 1400, 760, 'github.com/signup', (c, x, y, w) => { ghKepala(c, x, y, w, {plus: false});
    if (t < t1) { T(c, 'Tempat menyimpan kode bersama tim', x + 80, y + 220, {size: 44, weight: 800, color: GH.teks}); tombol(c, x + 80, y + 300, 260, 70, 'Sign up', GH.hijau); sorot(c, x + 80, y + 300, 260, 70, antara(t, .9, t1), t); return; }
    T(c, 'Create your free account', x + 80, y + 150, {size: 38, weight: 800, color: GH.teks});
    const n = s => s.slice(0, Math.max(0, Math.floor((t - t1 - .6) * 14) - s.o));
    masukan(c, x + 80, y + 210, 500, 'Email', 'raka@contoh.id'.slice(0, Math.max(0, Math.floor((t - t1 - .4) * 14))));
    masukan(c, x + 80, y + 330, 500, 'Password', '•'.repeat(Math.min(12, Math.max(0, Math.floor((t - t1 - 1.6) * 14)))));
    masukan(c, x + 80, y + 450, 500, 'Username', 'raka-siantre'.slice(0, Math.max(0, Math.floor((t - t1 - 2.8) * 14))));
    if (t >= t2) { K.rrect(c, x + 630, y + 210, 510, 300, 12, GH.abu, GH.garis, 2); T(c, 'Cek emailmu', x + 660, y + 260, {size: 30, weight: 800, color: GH.teks});
      T(c, 'Masukkan kode yang dikirim GitHub', x + 660, y + 310, {size: 24, weight: 500, color: GH.redup});
      ['3', '8', '1', '0', '5', '2', '7', '4'].forEach((d, i) => { K.rrect(c, x + 656 + i * 58, y + 360, 48, 64, 8, '#fff', GH.garis, 2); if (t > t2 + .6 + i * .15) T(c, d, x + 680 + i * 58, y + 393, {size: 30, weight: 800, align: 'center', color: GH.teks}); });
      sorot(c, x + 648, y + 350, 476, 84, antara(t, t2 + .4, D + 1), t); } }, muncul(t, .2));
};
AD.ghRepo = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di GitHub: buat repository', t, C.sky); const [t1, t2, t3, t4] = [1, 2, 3, 4].map(i => kt(a, i));
  const halBaru = t >= t1 - .6, selesai = t >= t4 - .2;
  K.browser(c, 200, 180, 1520, 800, selesai ? 'github.com/raka-siantre/siantre' : 'github.com/new', (c, x, y, w) => { ghKepala(c, x, y, w, {jalur: 'raka-siantre'});
    if (!halBaru) { menu(c, x + w - 420, y + 64, 300, ['New repository', 'Import repository', 'New organization'], t >= .9 ? 0 : null, muncul(t, .4), t);
      return; }
    if (!selesai) { T(c, 'Create a new repository', x + 80, y + 140, {size: 38, weight: 800, color: GH.teks});
      masukan(c, x + 80, y + 200, 600, 'Repository name *', 'siantre'.slice(0, Math.max(0, Math.floor((t - t1 - .4) * 12))), {fokus: t >= t1 && t < t2});
      kotakCentang(c, x + 80, y + 360, 'Add a README file', false); kotakCentang(c, x + 80, y + 420, 'Add .gitignore', false);
      sorot(c, x + 70, y + 336, 360, 48, antara(t, t2 + .2, t4 - .3), t);
      alpha(c, muncul(t, t3 + .3), () => { K.rrect(c, x + 470, y + 330, 740, 130, 12, '#fff8c5', '#d4a72c', 2);
        T(c, 'Jangan dicentang: repository harus kosong,', x + 495, y + 375, {size: 26, weight: 700, color: '#6e4b00'}); T(c, 'kalau tidak, push pertama ditolak.', x + 495, y + 420, {size: 26, weight: 700, color: '#6e4b00'}); });
      tombol(c, x + 80, y + 520, 300, 60, 'Create repository', GH.hijau); return; }
    T(c, 'Quick setup', x + 80, y + 140, {size: 34, weight: 800, color: GH.teks});
    K.rrect(c, x + 80, y + 180, w - 160, 70, 8, GH.abu, GH.garis, 2); tombol(c, x + 98, y + 194, 100, 42, 'HTTPS', '#fff', {garis: GH.garis, warnaTeks: GH.teks});
    T(c, 'https://github.com/raka-siantre/siantre.git', x + 224, y + 216, {size: 26, weight: 600, mono: true, color: GH.teks}); T(c, '⧉', x + w - 130, y + 216, {size: 30, weight: 700, color: GH.redup});
    sorot(c, x + 80, y + 180, w - 160, 70, antara(t, t4 + .3, D + 1), t);
    T(c, '…or push an existing repository from the command line', x + 80, y + 320, {size: 26, weight: 700, color: GH.teks});
    ['git remote add origin https://github.com/raka-siantre/siantre.git', 'git branch -M main', 'git push -u origin main'].forEach((s, i) => T(c, s, x + 100, y + 380 + i * 44, {size: 24, weight: 500, mono: true, color: GH.teks}));
  }, muncul(t, .2));
};
AD.ghLogin = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di GitHub: login saat push pertama', t, C.sky); const [t1, t2, t3] = [1, 2, 3].map(i => kt(a, i)), t4 = t3 + 4.5;
  K.term(c, 120, 200, 820, 380, t, [{at: .3, cmd: 'git push -u origin main', jeda: .4}], {judul: 'Git Bash', size: 26});
  alpha(c, muncul(t, t1), () => { const x = 1000, y = 200; K.rrect(c, x, y, 800, 420, 12, '#fff', '#94a3b8', 2); K.rrect(c, x, y, 800, 54, 12, '#e2e8f0'); T(c, 'Connect to GitHub', x + 24, y + 28, {size: 24, weight: 700, color: '#0f172a'});
    T(c, 'Windows', x + 24, y + 100, {size: 24, weight: 800, color: C.coral}); tombol(c, x + 140, y + 160, 520, 70, 'Sign in with your browser', GH.hijau); sorot(c, x + 140, y + 160, 520, 70, antara(t, t1 + .8, t2), t);
    alpha(c, muncul(t, t1 + 2), () => { T(c, 'Browser terbuka → klik Authorize', x + 140, y + 300, {size: 26, weight: 700, color: '#0f172a'}); }); });
  alpha(c, muncul(t, t2), () => { const x = 120, y = 640; K.rrect(c, x, y, 1680, 330, 16, 'rgba(255,255,255,.05)', C.violet, 3);
    T(c, 'Mac dan Linux', x + 30, y + 46, {size: 30, weight: 800, color: C.violet});
    T(c, 'Password: kata sandi akun DITOLAK, pakai personal access token', x + 30, y + 110, {size: 30, weight: 700, alpha: muncul(t, t2 + .3)});
    alpha(c, muncul(t, t3), () => { ['Settings', 'Developer settings', 'Personal access tokens', 'Generate new token'].forEach((s, i, arr) => { const xx = x + 30 + i * 400;
      K.rrect(c, xx, y + 170, 360, 64, 10, '#1f2a48', C.violet, 2); T(c, s, xx + 180, y + 203, {size: 24, weight: 700, align: 'center'}); if (i < arr.length - 1) T(c, '›', xx + 380, y + 203, {size: 34, weight: 800, color: C.redup}); }); });
    alpha(c, muncul(t, t4), () => T(c, "Password for 'https://github.com':  ghp_••••••••••••  (tempel token)", x + 30, y + 285, {size: 26, weight: 600, mono: true, color: C.lime})); });
};
AD.ghPR = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di GitHub: membuka pull request', t, C.sky); const t1 = kt(a, 1);
  K.browser(c, 200, 180, 1520, 780, t < t1 + 1.6 ? 'github.com/raka-siantre/siantre' : 'github.com/raka-siantre/siantre/compare/main...fitur/laporan-tunggu', (c, x, y, w) => {
    ghKepala(c, x, y, w, {jalur: 'raka-siantre / siantre'}); ghTab(c, x + 30, y + 120, ['Code', 'Issues', 'Pull requests', 'Actions', 'Settings'], t < t1 + 1.6 ? 0 : 2);
    if (t < t1 + 1.6) { K.rrect(c, x + 40, y + 170, w - 80, 90, 8, '#fff8c5', '#d4a72c', 2); T(c, 'fitur/laporan-tunggu had recent pushes 1 minute ago', x + 70, y + 215, {size: 26, weight: 600, color: GH.teks});
      tombol(c, x + w - 430, y + 190, 360, 50, 'Compare & pull request', GH.hijau); sorot(c, x + w - 430, y + 190, 360, 50, antara(t, .9, t1 + 1.6), t); return; }
    T(c, 'Open a pull request', x + 60, y + 200, {size: 36, weight: 800, color: GH.teks}); T(c, 'base: main  ←  compare: fitur/laporan-tunggu', x + 60, y + 250, {size: 24, weight: 600, mono: true, color: GH.redup});
    masukan(c, x + 60, y + 300, w - 120, 'Title', 'Tambah laporan rata-rata waktu tunggu'.slice(0, Math.max(0, Math.floor((t - t1 - 1.8) * 16))));
    T(c, 'Description', x + 60, y + 410, {size: 24, weight: 700, color: GH.teks}); K.rrect(c, x + 60, y + 432, w - 120, 80, 8, '#fff', GH.garis, 2);
    T(c, 'Apa yang berubah, dan cara mengujinya...', x + 80, y + 470, {size: 24, weight: 500, color: GH.redup});
    tombol(c, x + w - 360, y + 526, 300, 52, 'Create pull request', GH.hijau); sorot(c, x + w - 360, y + 526, 300, 52, antara(t, t1 + 4, D + 1), t); }, muncul(t, .2));
};
AD.ghFiles = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di GitHub: review di Files changed', t, C.sky); const t1 = kt(a, 1);
  K.browser(c, 200, 180, 1520, 780, 'github.com/raka-siantre/siantre/pull/1/files', (c, x, y, w) => { ghKepala(c, x, y, w, {jalur: 'raka-siantre / siantre'});
    ghTab(c, x + 30, y + 120, ['Conversation', 'Commits', 'Checks', 'Files changed'], 3); sorot(c, x + 470, y + 98, 200, 48, antara(t, .6, t1), t);
    tombol(c, x + w - 280, y + 100, 220, 46, 'Review changes ▾', GH.hijau); sorot(c, x + w - 280, y + 100, 220, 46, antara(t, t1 + 5.5, D + 1), t);
    K.rrect(c, x + 40, y + 170, w - 80, 420, 8, '#fff', GH.garis, 2); c.fillStyle = GH.abu; c.fillRect(x + 42, y + 172, w - 84, 44); T(c, 'laporan.js', x + 66, y + 194, {size: 22, weight: 700, mono: true, color: GH.teks});
    const kode = ['function rataTunggu(daftar) {', '  const total = daftar.reduce((a, b) => a + b, 0);', '  return total / daftar.length;', '}'];
    kode.forEach((s, i) => { const yy = y + 250 + i * 44; c.fillStyle = '#dafbe1'; c.fillRect(x + 42, yy - 20, w - 84, 42); T(c, String(i + 1), x + 70, yy, {size: 22, mono: true, color: GH.redup});
      T(c, '+ ' + s, x + 120, yy, {size: 22, mono: true, color: GH.teks}); });
    const pk = muncul(t, t1 + .4); alpha(c, pk, () => { K.rrect(c, x + 96, y + 316, 30, 30, 6, GH.biru); T(c, '+', x + 111, y + 331, {size: 26, weight: 900, align: 'center', color: '#fff'}); });
    alpha(c, muncul(t, t1 + 1.2), () => { K.rrect(c, x + 80, y + 440, w - 160, 120, 8, '#fff', GH.biru, 2);
      T(c, 'Kalau hari itu belum ada antrean, daftar.length = 0 dan hasilnya NaN.', x + 100, y + 480, {size: 22, weight: 600, color: GH.teks});
      tombol(c, x + w - 330, y + 506, 230, 42, 'Start a review', GH.hijau); }); }, muncul(t, .2));
};
AD.ghSendiri = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di GitHub: kalau belajar sendirian', t, C.sky); const [t1, t2, t3] = [1, 2, 3].map(i => kt(a, i));
  K.browser(c, 120, 180, 1060, 600, 'github.com/raka-siantre/siantre/pull/1/files', (c, x, y, w) => { ghKepala(c, x, y, w, {jalur: 'raka-siantre / siantre'});
    K.rrect(c, x + 60, y + 120, 640, 300, 10, '#fff', GH.garis, 2); T(c, 'Finish your review', x + 90, y + 160, {size: 26, weight: 800, color: GH.teks});
    ['Comment', 'Approve', 'Request changes'].forEach((s, i) => { const yy = y + 220 + i * 56; c.beginPath(); c.arc(x + 104, yy, 12, 0, 7); c.strokeStyle = '#8c959f'; c.lineWidth = 3; c.stroke();
      T(c, s, x + 132, yy + 1, {size: 24, weight: 600, color: i === 1 ? '#8c959f' : GH.teks}); });
    alpha(c, muncul(t, t1 - .2), () => { T(c, 'Pull request authors can’t approve their own pull request', x + 90, y + 400, {size: 19, weight: 600, color: '#d1242f'}); sorot(c, x + 84, y + 254, 260, 44, antara(t, t1, t2), t); }); }, muncul(t, .2));
  alpha(c, muncul(t, t2), () => { const x = 1240, y = 180; K.rrect(c, x, y, 560, 560, 16, '#ffffff', '#94a3b8', 2);
    T(c, 'Settings › Collaborators', x + 30, y + 50, {size: 26, weight: 800, color: GH.teks}); tombol(c, x + 30, y + 110, 260, 52, 'Add people', GH.hijau); sorot(c, x + 30, y + 110, 260, 52, antara(t, t2 + .5, t3), t);
    T(c, 'Undang teman supaya ia', x + 30, y + 230, {size: 24, weight: 600, color: GH.redup}); T(c, 'bisa me-review dan Approve', x + 30, y + 266, {size: 24, weight: 600, color: GH.redup}); });
  alpha(c, muncul(t, t3), () => { K.rrect(c, 120, 800, 1680, 150, 16, 'rgba(163,230,53,.08)', C.lime, 3);
    T(c, 'Sendirian? Periksa sendiri Files changed, lalu', 160, 850, {size: 32, weight: 700}); tombol(c, 1180, 820, 360, 60, 'Merge pull request', GH.hijau); sorot(c, 1180, 820, 360, 60, antara(t, t3 + .6, D + 1), t); });
};

// ---------- G06: GitHub ----------
AD.ghIssue = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di GitHub: issue', t, C.sky); const t1 = kt(a, 1);
  K.browser(c, 200, 180, 1520, 780, t < t1 ? 'github.com/raka-siantre/siantre/issues/new' : 'github.com/raka-siantre/siantre/pull/7', (c, x, y, w) => { ghKepala(c, x, y, w, {jalur: 'raka-siantre / siantre'});
    ghTab(c, x + 30, y + 120, ['Code', 'Issues', 'Pull requests'], t < t1 ? 1 : 2); if (t < t1) sorot(c, x + 116, y + 98, 120, 48, antara(t, .6, 2.0), t);
    if (t < t1) { tombol(c, x + w - 240, y + 100, 180, 46, 'New issue', GH.hijau); sorot(c, x + w - 240, y + 100, 180, 46, antara(t, 2.0, t1), t);
      masukan(c, x + 60, y + 190, w - 120, 'Title', 'Nomor antrean tidak kembali ke 1 setiap hari'.slice(0, Math.max(0, Math.floor((t - 2.6) * 16))));
      T(c, '#12', x + 60, y + 330, {size: 26, weight: 800, color: GH.redup, alpha: muncul(t, 4.5)}); return; }
    T(c, 'fix: nomor antrean kembali ke 1 setiap hari #7', x + 60, y + 200, {size: 32, weight: 800, color: GH.teks});
    K.rrect(c, x + 60, y + 250, w - 120, 130, 8, '#fff', GH.garis, 2); T(c, 'Nomor direset saat tanggal berganti.', x + 86, y + 290, {size: 24, color: GH.teks});
    T(c, 'Fixes #12', x + 86, y + 340, {size: 26, weight: 800, mono: true, color: GH.teks}); sorot(c, x + 76, y + 318, 170, 44, antara(t, t1 + .8, D + 1), t);
    alpha(c, muncul(t, t1 + 2.8), () => { K.rrect(c, x + 60, y + 420, w - 120, 70, 8, '#fbefff', '#8250df', 2); T(c, '✓ Issue #12 ditutup otomatis setelah pull request digabung', x + 86, y + 455, {size: 24, weight: 700, color: '#8250df'}); }); }, muncul(t, .2));
};
AD.ghRelease = (c, t, D, a) => { K.bg(c); K.judul(c, 'Di GitHub: Releases', t, C.sky); const t1 = kt(a, 1);
  K.browser(c, 200, 180, 1520, 760, 'github.com/raka-siantre/siantre/releases', (c, x, y, w) => { ghKepala(c, x, y, w, {jalur: 'raka-siantre / siantre'});
    ghTab(c, x + 30, y + 120, ['Code', 'Issues', 'Pull requests', 'Releases'], 3);
    K.rrect(c, x + 60, y + 190, w - 120, 110, 8, '#fff', GH.garis, 2); T(c, '🏷  v1.0.0', x + 90, y + 230, {size: 30, weight: 800, mono: true, color: GH.teks}); T(c, 'Rilis pertama SiAntre', x + 90, y + 272, {size: 22, color: GH.redup});
    sorot(c, x + 60, y + 190, w - 120, 110, antara(t, .8, t1), t);
    tombol(c, x + w - 380, y + 216, 300, 52, 'Create release from tag', GH.hijau); sorot(c, x + w - 380, y + 216, 300, 52, antara(t, t1 + .4, D + 1), t);
    alpha(c, muncul(t, t1 + 1.2), () => { masukan(c, x + 60, y + 360, w - 120, 'Release notes', 'Ambil nomor, layar TV, laporan waktu tunggu'.slice(0, Math.max(0, Math.floor((t - t1 - 1.4) * 16)))); }); }, muncul(t, .2));
};
// ---------- G03/G04: tab pesan commit gabungan di VS Code ----------
AD.tabMerge = (c, t, D, a) => { K.bg(c); const tB = kt(a, a.kBuka ?? 0), tS = kt(a, a.kSimpan ?? 1), tX = a.kSelesai != null ? kt(a, a.kSelesai) : tS + 2.8;
  const buka = t >= tB + .5 && t < tX, kotor = t < tS + 1.2;
  vscode(c, 160, 110, 1600, 860, (c, x, y, w, h) => {
    c.fillStyle = '#252526'; c.fillRect(x + 66, y, w - 66, 48);
    if (buka) { K.rrect(c, x + 66, y, 300, 48, 0, '#1e1e1e'); T(c, a.berkas || 'MERGE_MSG', x + 90, y + 25, {size: 22, weight: 600, color: '#e5e5e5'}); T(c, kotor ? '●' : '×', x + 330, y + 25, {size: 24, weight: 800, color: '#cccccc'});
      sorot(c, x + 310, y + 6, 44, 38, antara(t, tS + 1.4, tX), t);
      [[a.pesan, '#e5e5e5'], ['', ''], ['# Please enter a commit message to explain why this merge is necessary,', '#6a9955'], ['# especially if it merges an updated upstream into a topic branch.', '#6a9955'], ['#', '#6a9955'], ["# Lines starting with '#' will be ignored, and an empty message aborts", '#6a9955'], ['# the commit.', '#6a9955']]
        .forEach(([s, w2], i) => { T(c, String(i + 1), x + 110, y + 90 + i * 40, {size: 22, mono: true, color: '#858585', align: 'right'}); if (s) T(c, s, x + 140, y + 90 + i * 40, {size: 24, mono: true, color: w2}); });
      sorot(c, x + 130, y + 68, 760, 44, antara(t, tB + .9, tS), t);
      alpha(c, antara(t, tS + .2, tS + 1.6), () => { K.rrect(c, x + w - 420, y + 80, 150, 76, 12, '#e2e8f0', '#94a3b8', 3); T(c, 'Ctrl', x + w - 345, y + 118, {size: 30, weight: 800, align: 'center', color: '#0f172a'});
        T(c, '+', x + w - 250, y + 118, {size: 34, weight: 800, align: 'center'}); K.rrect(c, x + w - 220, y + 80, 100, 76, 12, '#e2e8f0', '#94a3b8', 3); T(c, 'S', x + w - 170, y + 118, {size: 34, weight: 900, align: 'center', color: '#0f172a'}); }); }
    else T(c, t < tB + .5 ? '' : 'antrean.js', x + 90, y + 25, {size: 22, weight: 600, color: '#9d9d9d'});
    const ty = y + h - 330; c.fillStyle = '#181818'; c.fillRect(x + 66, ty, w - 66, 330); c.fillStyle = '#2b2b2b'; c.fillRect(x + 66, ty, w - 66, 44); T(c, 'TERMINAL', x + 100, ty + 22, {size: 20, weight: 700, color: '#e5e5e5'});
    const baris = [['raka@laptop:siantre$ ' + a.cmd, '#e5e5e5']];
    if (t >= tB + .3 && t < tX) baris.push(['hint: Waiting for your editor to close the file...', '#9aa6c4']);
    if (t >= tX) (a.hasil || []).forEach(s => baris.push([s, '#e5e5e5']));
    baris.forEach(([s, w2], i) => T(c, s, x + 100, ty + 84 + i * 42, {size: 25, mono: true, color: w2}));
    if (t >= tX) sorot(c, x + 90, ty + 106, 900, 42 * (a.hasil || []).length, muncul(t, tX + .2), t);
  }, muncul(t, .1));
  alpha(c, muncul(t, .3), () => label(c, a.ket || 'Di komputermu: tab pesan terbuka di VS Code', 1050, 30, 1, C.sky));
};
})();
