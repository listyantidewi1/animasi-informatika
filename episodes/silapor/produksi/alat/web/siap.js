// Adegan persiapan (pasang alat, DATABASE_URL, akun, coba di HP, siapkan server). Dimuat lewat SKRIP di spec.
// a.kal = detik mulai tiap kalimat narasi (diisi rakit.py), supaya gambar muncul tepat saat disebut.
(() => {
const C = K.C, S = K.seg, O = K.out, AD = K.adegan;
const REPO = 'github.com/listyantidewi1/SiAntre';
const kt = (a, i, d = 0) => (a.kal && a.kal[i] !== undefined ? a.kal[i] : 9e9) + d;          // waktu kalimat ke-i
const muncul = (t, t0, d = .5) => O(S(t, t0, t0 + d));
const antara = (t, t0, t1, d = .4) => Math.min(O(S(t, t0, t0 + d)), 1 - O(S(t, t1 - d, t1))); // tampil di [t0, t1]

// kotak alamat GitHub: selalu tampil saat narasi menyebut README
K.chipRepo = (c, p, o = {}) => { if (p <= 0) return; const w = o.w || 1060, x = o.x ?? (1920 - w) / 2, y = o.y ?? 900, dy = (1 - p) * 24;
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 26; K.rrect(c, x, y + dy, w, 124, 22, '#0d1222', C.amber, 4); c.shadowColor = 'transparent';
  K.rrect(c, x + 24, y + dy + 24, 150, 76, 14, C.amber); K.text(c, 'README', x + 99, y + dy + 63, {size: 28, weight: 900, align: 'center', color: '#141a2c'});
  K.text(c, o.ket || 'Panduan lengkap ada di README', x + 200, y + dy + 40, {size: 26, weight: 700, color: C.redup});
  K.text(c, REPO, x + 200, y + dy + 86, {size: 38, weight: 800, mono: true}); c.restore(); };

// jendela terminal. baris: [{at, cmd, prompt?, out?: [teks | [teks, warna]], jeda?}]; o.sorot = [[idxBaris, idxOut(-1 = baris perintah), t0, t1?]]
K.term = (c, x, y, w, h, t, baris, o = {}) => {
  const size = o.size || 28, lh = size * 1.6, cps = o.cps || 24, p = o.p ?? 1; if (p <= 0) return {};
  c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 16, '#0a0f1e', '#3b4a75', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 50, 16, '#1b2440'); c.fillStyle = '#1b2440'; c.fillRect(x + 2, y + 30, w - 4, 22);
  ['#ff6b6b', '#ffb020', '#a3e635'].forEach((k, i) => { c.fillStyle = k; c.beginPath(); c.arc(x + 30 + i * 28, y + 26, 8, 0, 7); c.fill(); });
  K.text(c, o.judul || 'Terminal', x + w / 2, y + 26, {size: 22, weight: 700, align: 'center', color: C.redup});
  c.beginPath(); c.rect(x, y + 52, w, h - 54); c.clip();
  let yy = y + 52 + 22 + lh / 2; const pos = {};
  baris.forEach((b, i) => { if (t < b.at) return; const pr = b.prompt ?? '$ ', n = Math.floor((t - b.at) * cps), sel = b.at + b.cmd.length / cps;
    for (const s of (o.sorot || [])) if (s[0] === i && s[1] === -1 && t >= s[2] && t < (s[3] ?? 9e9)) K.rrect(c, x + 10, yy - lh / 2 + 2, w - 20, lh - 4, 8, 'rgba(255,176,32,.2)', C.amber, 3);
    K.text(c, pr, x + 26, yy, {size, weight: 700, mono: true, color: b.warnaPrompt || C.lime}); const px = x + 26 + K.lebar(c, pr, size, 700, true);
    K.text(c, b.cmd.slice(0, n), px, yy, {size, weight: 500, mono: true});
    if (t < sel + .15 && Math.floor(t * 2.5) % 2 === 0) { c.fillStyle = '#e6e9f2'; c.fillRect(px + K.lebar(c, b.cmd.slice(0, n), size, 500, true) + 2, yy - size * .55, size * .5, size * 1.1); }
    pos[i + ':-1'] = yy; yy += lh;
    if (t >= sel + (b.jeda ?? .45)) (b.out || []).forEach((u, j) => { const [s, w2] = Array.isArray(u) ? u : [u, '#aab4d0'];
      for (const z of (o.sorot || [])) if (z[0] === i && z[1] === j && t >= z[2] && t < (z[3] ?? 9e9)) K.rrect(c, x + 10, yy - lh / 2 + 2, w - 20, lh - 4, 8, 'rgba(255,176,32,.2)', C.amber, 3);
      K.text(c, s, x + 26, yy, {size, weight: 500, mono: true, color: w2}); pos[i + ':' + j] = yy; yy += lh; });
  });
  c.restore(); return pos;
};
// jendela browser sederhana; isi(c, x, y, w, h)
K.browser = (c, x, y, w, h, url, isi, p = 1) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; const dy = (1 - p) * 26; y += dy;
  c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 16, '#f8fafc', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 70, 16, '#dbe2ee'); c.fillStyle = '#dbe2ee'; c.fillRect(x + 2, y + 40, w - 4, 32);
  ['#94a3b8', '#94a3b8', '#94a3b8'].forEach((k, i) => { c.fillStyle = k; c.beginPath(); c.arc(x + 32 + i * 28, y + 35, 8, 0, 7); c.fill(); });
  K.rrect(c, x + 130, y + 13, w - 160, 44, 22, '#ffffff', '#b6c2d6', 2); K.text(c, url, x + 156, y + 36, {size: 26, weight: 700, mono: true, color: '#1e293b'});
  c.beginPath(); c.rect(x, y + 72, w, h - 74); c.clip(); if (isi) isi(c, x, y + 72, w, h - 72); c.restore(); };
const tombol = (c, x, y, w, h, teks, warna, sorotP = 0, t = 0) => { K.rrect(c, x, y, w, h, 12, warna); let fs = h * .42; while (fs > 12 && K.lebar(c, teks, fs, 800) > w - 36) fs -= 1; K.text(c, teks, x + w / 2, y + h / 2 + 1, {size: fs, weight: 800, align: 'center', color: '#fff'});
  if (sorotP > 0) { const g = 8 + 5 * Math.sin(t * 5); c.save(); c.globalAlpha *= sorotP; K.rrect(c, x - g, y - g, w + 2 * g, h + 2 * g, 16 + g, null, C.amber, 6); c.restore(); } };
// jendela penginstal; isi(c, x, y, w, h)
const wizard = (c, x, y, w, h, judul, isi, p = 1, o = {}) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; const dy = (1 - p) * 26; y += dy;
  c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 12, '#f1f5f9', '#475569', 3); c.shadowColor = 'transparent';
  K.rrect(c, x, y, w, 58, 12, '#334155'); c.fillStyle = '#334155'; c.fillRect(x + 2, y + 34, w - 4, 26); K.text(c, judul, x + 26, y + 30, {size: 26, weight: 800, color: '#f8fafc'});
  if (isi) isi(c, x, y + 60, w, h - 150);
  c.fillStyle = '#cbd5e1'; c.fillRect(x + 2, y + h - 88, w - 4, 2);
  K.rrect(c, x + w - 370, y + h - 68, 160, 48, 8, '#e2e8f0', '#94a3b8', 2); K.text(c, '< Back', x + w - 290, y + h - 43, {size: 22, weight: 700, align: 'center', color: '#475569'});
  tombol(c, x + w - 190, y + h - 68, 160, 48, o.akhir ? 'Finish' : 'Next >', '#2563eb', o.sorotNext || 0, o.t || 0); c.restore(); };
const centangKotak = (c, x, y, teks, on, o = {}) => { K.rrect(c, x, y - 17, 34, 34, 6, '#fff', '#64748b', 3);
  if (on > 0) K.centang(c, x + 17, y, 30, on, '#16a34a'); K.text(c, teks, x + 52, y + 1, {size: o.size || 28, weight: 600, color: o.warna || '#1e293b'}); };
const sorotKuning = (c, x, y, w, h, p) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, x, y, w, h, 12, 'rgba(255,176,32,.2)', C.amber, 5); c.restore(); };
const laptop = (c, x, y, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); K.rrect(c, -150, -110, 300, 190, 12, '#1e293b', '#94a3b8', 5); c.fillStyle = '#94a3b8'; c.fillRect(-190, 80, 380, 18); c.restore(); };
const nomor = (c, n, x, y, warna = C.amber) => { c.fillStyle = warna; c.beginPath(); c.arc(x, y, 34, 0, 7); c.fill(); K.text(c, String(n), x, y + 2, {size: 38, weight: 900, align: 'center', color: '#141a2c'}); };
const judulAlat = (c, n, nama, ket, t, warna) => { const p = muncul(t, .1); c.save(); c.globalAlpha = p; nomor(c, n, 114, 100, warna); K.text(c, nama, 170, 100, {size: 54, weight: 900});
  K.text(c, ket, 174 + K.lebar(c, nama, 54, 900), 104, {size: 32, weight: 600, color: C.redup}); c.restore(); };

// ---------- P1: kartu chapter ----------
AD.siapKartu = (c, t, D, a) => { K.bg(c); const p1 = muncul(t, .1, .6), p2 = muncul(t, .4, .7);
  c.save(); c.globalAlpha = p1; K.rrect(c, 160, 230, 280, 64, 32, C.amber); K.text(c, 'PERSIAPAN', 300, 263, {size: 30, weight: 900, align: 'center', color: '#141a2c'}); c.restore();
  c.save(); c.globalAlpha = p2; K.text(c, 'Memasang alat', 160, 390 + 20 * (1 - p2), {size: 92, weight: 900}); c.restore();
  K.text(c, 'Empat alat, semuanya gratis', 160, 490, {size: 38, weight: 500, color: '#c9d3ee', alpha: muncul(t, .9)});
  const alat = [['Node.js', 'menjalankan server', C.lime], ['Git', 'menyimpan riwayat kode', C.coral], ['VS Code', 'menulis kode', C.sky], ['PostgreSQL', 'database', C.teal]];
  alat.forEach(([n, k, w], i) => { const p = muncul(t, 1.2 + i * .35); if (p <= 0) return; c.save(); c.globalAlpha = p; const x = 1060 + (1 - p) * 30, y = 210 + i * 150;
    K.rrect(c, x, y, 700, 124, 20, 'rgba(255,255,255,.05)', w, 4); nomor(c, i + 1, x + 66, y + 62, w); K.text(c, n, x + 124, y + 44, {size: 40, weight: 900}); K.text(c, k, x + 124, y + 90, {size: 26, weight: 600, color: C.redup}); c.restore(); });
  const q = muncul(t, kt(a, 1)); if (q > 0) { c.save(); c.globalAlpha = q; K.rrect(c, 160, 640, 760, 150, 22, 'rgba(163,230,53,.08)', C.lime, 4);
    K.text(c, 'Sudah punya semuanya?', 200, 690, {size: 34, weight: 800, color: C.lime}); K.text(c, 'Lompat ke Bab 1 lewat cap waktu di deskripsi', 200, 744, {size: 30, weight: 600}); c.restore(); }
};
// ---------- P2: Node.js ----------
AD.siapNode = (c, t, D, a) => { K.bg(c); judulAlat(c, 1, 'Node.js', '   program yang menjalankan server kita', t, C.lime);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  K.browser(c, 110, 200, 1000, 620, 'nodejs.org', (c, x, y, w, h) => { K.text(c, 'Node.js', x + 70, y + 110, {size: 76, weight: 900, color: '#166534'});
    K.text(c, 'Jalankan JavaScript di mana saja', x + 70, y + 190, {size: 32, weight: 600, color: '#475569'});
    tombol(c, x + 70, y + 270, 470, 96, 'Download Node.js (LTS)', '#16a34a', muncul(t, t1 + 1.6), t);
    K.rrect(c, x + 580, y + 270, 300, 96, 12, '#e2e8f0', '#94a3b8', 2); K.text(c, 'Versi lain', x + 730, y + 319, {size: 30, weight: 700, align: 'center', color: '#64748b'});
    const q = muncul(t, t1 + 2.4); if (q > 0) { c.save(); c.globalAlpha = q; K.text(c, 'LTS = versi yang paling stabil', x + 70, y + 430, {size: 30, weight: 800, color: '#b45309'}); c.restore(); } }, muncul(t, Math.min(t1, 2.5)));
  wizard(c, 1180, 300, 640, 440, 'Node.js Setup', (c, x, y, w, h) => { K.text(c, 'Selamat datang di penginstal Node.js', x + 30, y + 60, {size: 26, weight: 700, color: '#1e293b'});
    K.text(c, 'Biarkan semua pilihan apa adanya,', x + 30, y + 130, {size: 24, weight: 600, color: '#475569'}); K.text(c, 'lalu tekan Next sampai selesai.', x + 30, y + 168, {size: 24, weight: 600, color: '#475569'}); }, muncul(t, t2), {sorotNext: muncul(t, t2 + 1.8), t});
  const q = muncul(t, t3); if (q > 0) { c.save(); c.globalAlpha = q; K.rrect(c, 110, 880, 1710, 110, 20, 'rgba(163,230,53,.08)', C.lime, 4);
    K.text(c, 'Ikut terpasang:', 150, 935, {size: 32, weight: 700, color: C.redup}); K.text(c, 'npm', 400, 935, {size: 44, weight: 900, mono: true, color: C.lime}); K.text(c, 'alat untuk memasang pustaka', 520, 936, {size: 32, weight: 600}); c.restore(); }
};
// ---------- P3: Git dan VS Code ----------
AD.siapGitVS = (c, t, D, a) => { K.bg(c); const tB = kt(a, 4), A = t < tB ? 1 : 1 - muncul(t, tB, .4), B = muncul(t, tB + .3);
  if (A > 0) { c.save(); c.globalAlpha = A; judulAlat(c, 2, 'Git', '   menyimpan riwayat kode', t, C.coral);
    K.browser(c, 110, 200, 880, 560, 'git-scm.com', (c, x, y, w, h) => { K.text(c, 'Git', x + 70, y + 110, {size: 76, weight: 900, color: '#c2410c'});
      tombol(c, x + 70, y + 210, 420, 92, 'Download untuk Windows', '#ea580c', muncul(t, kt(a, 1) + 1.2), t);
      K.text(c, 'Pasang dengan pilihan bawaannya', x + 70, y + 370, {size: 28, weight: 700, color: '#475569'}); }, muncul(t, Math.min(kt(a, 1), 2.2)));
    const g = muncul(t, kt(a, 2)); if (g > 0) { c.save(); c.globalAlpha *= g; K.term(c, 1060, 240, 760, 330, t, [{at: kt(a, 2) + .8, cmd: 'git --version', out: ['git version 2.43.0']}], {judul: 'Git Bash', size: 30});
      K.text(c, 'Git Bash ikut terpasang di Windows', 1440, 630, {size: 30, weight: 800, align: 'center', color: C.amber});
      const g2 = muncul(t, kt(a, 3)); if (g2 > 0) { c.globalAlpha *= g2; K.rrect(c, 1060, 680, 760, 130, 18, 'rgba(255,176,32,.1)', C.amber, 4);
        K.text(c, 'Pakai terminal ini: hampir semua perintah', 1440, 724, {size: 28, weight: 700, align: 'center'}); K.text(c, 'bisa diketik persis seperti di video', 1440, 768, {size: 28, weight: 700, align: 'center'}); } c.restore(); }
    c.restore(); }
  if (B > 0) { c.save(); c.globalAlpha = B; judulAlat(c, 3, 'VS Code', '   tempat kita menulis kode', tB + 1 > t ? 1 : 1, C.sky);
    K.browser(c, 110, 200, 700, 300, 'code.visualstudio.com', (c, x, y, w, h) => { tombol(c, x + 60, y + 70, 420, 92, 'Download VS Code', '#2563eb', muncul(t, tB + 1.4) * (t < kt(a, 5) ? 1 : 0), t); }, 1);
    // panel terminal VS Code dengan menu pilihan terminal
    const px = 110, py = 560, pw = 1700, ph = 420, q = muncul(t, kt(a, 5));
    c.save(); c.globalAlpha *= q; K.rrect(c, px, py, pw, ph, 14, '#1e1e2e', '#3b4a75', 3); K.rrect(c, px, py, pw, 56, 14, '#181825'); c.fillStyle = '#181825'; c.fillRect(px + 2, py + 30, pw - 4, 28);
    ['PROBLEMS', 'OUTPUT', 'TERMINAL'].forEach((s, i) => K.text(c, s, px + 40 + i * 190, py + 29, {size: 22, weight: 800, color: i === 2 ? '#f8fafc' : '#7c8aa8'})); c.fillStyle = '#60a5fa'; c.fillRect(px + 416, py + 52, 140, 4);
    K.text(c, '+', px + pw - 330, py + 28, {size: 34, weight: 700, color: '#f8fafc'}); K.text(c, '⌄', px + pw - 292, py + 30, {size: 30, weight: 900, color: '#f8fafc'});
    sorotKuning(c, px + pw - 356, py + 6, 96, 46, muncul(t, kt(a, 5) + 1.6) * (t < kt(a, 5) + 4 ? 1 : .0));
    K.text(c, '$ ', px + 36, py + 110, {size: 28, weight: 700, mono: true, color: C.lime});
    const m = muncul(t, kt(a, 5) + 3.2); if (m > 0) { c.globalAlpha *= m; const mx = px + pw - 640, my = py + 64; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 24; K.rrect(c, mx, my, 420, 300, 10, '#2a2a3c', '#4b5578', 2); c.shadowColor = 'transparent';
      ['PowerShell', 'Command Prompt', 'Git Bash', 'JavaScript Debug Terminal'].forEach((s, i) => { const yy = my + 46 + i * 68; if (i === 2) { K.rrect(c, mx + 8, yy - 30, 404, 60, 8, '#2563eb'); sorotKuning(c, mx + 2, yy - 36, 416, 72, muncul(t, kt(a, 5) + 4.2)); }
        K.text(c, s, mx + 30, yy, {size: 26, weight: i === 2 ? 800 : 600, color: '#f8fafc'}); }); }
    c.restore();
    const ket = muncul(t, kt(a, 5) + .4); K.text(c, 'Panel terminal → panah di samping tanda +  →  Git Bash', 880, 400, {size: 30, weight: 800, color: C.amber, alpha: ket}); c.restore(); }
};
// ---------- P4: PostgreSQL ----------
AD.siapPg = (c, t, D, a) => { K.bg(c); judulAlat(c, 4, 'PostgreSQL', '   database kita', t, C.teal);
  const tW = kt(a, 2), A = t < tW ? 1 : 1 - muncul(t, tW, .4);
  if (A > 0) K.browser(c, 360, 220, 1200, 640, 'postgresql.org/download', (c, x, y, w, h) => { K.text(c, 'Downloads', x + 70, y + 90, {size: 60, weight: 900, color: '#1e3a8a'});
    K.text(c, 'Pilih sistem operasimu', x + 70, y + 160, {size: 30, weight: 600, color: '#475569'});
    ['Linux', 'macOS', 'Windows'].forEach((s, i) => { const bx = x + 70 + i * 360; K.rrect(c, bx, y + 230, 320, 150, 16, '#e0e7ff', '#6366f1', 3); K.text(c, s, bx + 160, y + 306, {size: 40, weight: 800, align: 'center', color: '#312e81'});
      if (i === 2) sorotKuning(c, bx - 10, y + 220, 340, 170, muncul(t, kt(a, 1) + 2.6)); });
    K.text(c, 'Windows: klik "Download the installer"', x + 70, y + 450, {size: 28, weight: 700, color: '#475569'}); }, Math.min(A, muncul(t, Math.min(kt(a, 1), 2.5))));
  const W = muncul(t, tW + .3); if (W <= 0) return;
  const langkah = [['Select Components', kt(a, 2)], ['Password', kt(a, 4)], ['Port', kt(a, 5)], ['Finish', kt(a, 6)]]; let aktif = 0; langkah.forEach(([, tt], i) => { if (t >= tt) aktif = i; });
  // daftar langkah di kiri
  c.save(); c.globalAlpha = W; langkah.forEach(([n], i) => { const y = 300 + i * 110, on = i === aktif; K.rrect(c, 110, y, 430, 86, 16, on ? 'rgba(45,212,191,.14)' : 'rgba(255,255,255,.03)', on ? C.teal : '#3b4a75', on ? 5 : 2);
    K.text(c, n, 140, y + 44, {size: 30, weight: on ? 900 : 600, color: on ? C.teks : C.redup}); if (i < aktif) K.centang(c, 500, y + 44, 30, 1, C.lime); });
  K.text(c, 'Halaman yang perlu diperhatikan:', 110, 800, {size: 26, weight: 700, color: C.redup, alpha: muncul(t, kt(a, 3))}); K.text(c, 'Password dan Port', 110, 846, {size: 34, weight: 900, color: C.amber, alpha: muncul(t, kt(a, 3))});
  K.text(c, 'Halaman lain yang muncul di penginstal:', 110, 920, {size: 24, weight: 700, color: C.redup, alpha: muncul(t, kt(a, 3) + 1)}); K.text(c, 'biarkan apa adanya, lalu tekan Next', 110, 958, {size: 26, weight: 800, alpha: muncul(t, kt(a, 3) + 1)}); c.restore();
  const t0 = langkah[aktif][1], q = aktif === 0 ? 1 : muncul(t, t0, .35);
  wizard(c, 620, 240, 1180, 700, 'PostgreSQL Setup  ·  ' + langkah[aktif][0], (c, x, y, w, h) => { c.save(); c.globalAlpha *= q;
    if (aktif === 0) { K.text(c, 'Pilih komponen yang dipasang:', x + 50, y + 70, {size: 30, weight: 700, color: '#1e293b'});
      ['PostgreSQL Server', 'pgAdmin 4', 'Stack Builder', 'Command Line Tools'].forEach((s, i) => centangKotak(c, x + 70, y + 150 + i * 80, s, 1, {size: 32}));
      sorotKuning(c, x + 50, y + 104, 620, 330, muncul(t, t0 + 2.4)); K.text(c, 'Biarkan semua tercentang', x + 720, y + 190, {size: 28, weight: 800, color: '#b45309', alpha: muncul(t, t0 + 2.4)});
      K.text(c, 'psql ada di Command Line Tools', x + 720, y + 390, {size: 24, weight: 700, color: '#475569', alpha: muncul(t, t0 + 3.4)}); }
    if (aktif === 1) { K.text(c, 'Kata sandi untuk pengguna postgres:', x + 50, y + 70, {size: 30, weight: 700, color: '#1e293b'});
      ['Password', 'Retype password'].forEach((s, i) => { const yy = y + 150 + i * 110; K.text(c, s, x + 70, yy, {size: 28, weight: 600, color: '#334155'}); K.rrect(c, x + 360, yy - 30, 520, 60, 8, '#fff', '#64748b', 3);
        const n = Math.floor(K.clamp((t - t0 - 1.5 - i * 1.4) * 7, 0, 9)); K.text(c, '●'.repeat(n), x + 380, yy + 2, {size: 24, color: '#1e293b'}); });
      sorotKuning(c, x + 50, y + 104, 860, 190, muncul(t, t0 + 1.2));
      const g = muncul(t, t0 + 5); if (g > 0) { c.save(); c.globalAlpha *= g; K.rrect(c, x + 50, y + 350, 1080, 110, 14, '#fef3c7', '#d97706', 4); K.text(c, 'Catat kata sandi ini!', x + 80, y + 388, {size: 32, weight: 900, color: '#92400e'});
        K.text(c, 'Dipakai setiap kali kita menyambung ke database.', x + 80, y + 432, {size: 26, weight: 600, color: '#92400e'}); c.restore(); } }
    if (aktif === 2) { K.text(c, 'Port tempat server database menunggu:', x + 50, y + 70, {size: 30, weight: 700, color: '#1e293b'}); K.text(c, 'Port', x + 70, y + 180, {size: 30, weight: 600, color: '#334155'});
      K.rrect(c, x + 200, y + 144, 300, 72, 8, '#fff', '#64748b', 3); K.text(c, '5432', x + 224, y + 182, {size: 40, weight: 800, mono: true, color: '#1e293b'}); sorotKuning(c, x + 186, y + 130, 328, 100, muncul(t, t0 + .9));
      K.text(c, 'Biarkan 5432, jangan diubah', x + 560, y + 182, {size: 30, weight: 800, color: '#b45309', alpha: muncul(t, t0 + 1.4)}); }
    if (aktif === 3) { K.text(c, 'Pemasangan PostgreSQL selesai.', x + 50, y + 70, {size: 30, weight: 700, color: '#1e293b'});
      const on = 1 - muncul(t, t0 + 2.2, .3); centangKotak(c, x + 70, y + 170, 'Launch Stack Builder at exit?', on, {size: 30}); sorotKuning(c, x + 50, y + 126, 640, 90, muncul(t, t0 + 1.2));
      K.text(c, 'Hilangkan centangnya, lalu Finish', x + 70, y + 290, {size: 30, weight: 800, color: '#b45309', alpha: muncul(t, t0 + 2.4)}); }
    c.restore(); }, W, {akhir: aktif === 3, sorotNext: aktif === 3 ? muncul(t, t0 + 4) : 0, t});
};
// ---------- P5: memeriksa ----------
AD.siapCek = (c, t, D, a) => { K.bg(c); K.judul(c, 'Periksa: apakah semua alat sudah terpasang?', t, C.lime);
  const t1 = kt(a, 1) + .8, t3 = kt(a, 3), t4 = kt(a, 4), sempit = muncul(t, t3 - .3, .5);
  const baris = [{at: t1, cmd: 'node --version', out: ['v22.23.4']}, {at: t1 + 2.6, cmd: 'git --version', out: ['git version 2.43.0']}, {at: t1 + 5.2, cmd: 'psql --version', out: ['psql (PostgreSQL) 16.15']}];
  K.term(c, 110, 190, 1000, 470, t, baris, {size: 32, judul: 'Terminal baru'});
  const ok = muncul(t, kt(a, 2) + .6); if (ok > 0) { c.save(); c.globalAlpha = ok; [0, 1, 2].forEach(i => K.centang(c, 1040, 190 + 52 + 22 + 25 + 51.2 + i * 102.4, 38, 1, C.lime));
    K.rrect(c, 1180, 190, 630, 150, 20, 'rgba(163,230,53,.1)', C.lime, 4); K.text(c, 'Tiga nomor versi muncul:', 1215, 240, {size: 30, weight: 700}); K.text(c, 'semua alat siap', 1215, 294, {size: 40, weight: 900, color: C.lime}); c.restore(); }
  if (sempit > 0) { c.save(); c.globalAlpha = sempit; K.term(c, 1180, 380, 630, 280, t, [{at: t3 + .3, cmd: 'psql --version', out: [['bash: psql: command not found', C.coral]]}], {size: 26, judul: 'Kalau psql tidak dikenali'});
    c.restore(); K.text(c, 'Windows belum tahu letak programnya (PATH)', 1495, 700, {size: 26, weight: 800, align: 'center', color: C.coral, alpha: muncul(t, t3 + 2.6)}); }
  K.chipRepo(c, muncul(t, t4), {y: 790, ket: 'Cara mengatasinya: README, bagian 2 "Memasang PostgreSQL"'});
};
// ---------- P6: masuk psql + beda kata sandi ----------
AD.siapPsql = (c, t, D, a) => { K.bg(c); K.judul(c, 'Masuk ke PostgreSQL', t, C.teal);
  const t0 = kt(a, 0) + .9, sel = t0 + 16 / 24;
  const baris = [{at: t0, cmd: 'psql -U postgres', out: ['Password for user postgres: ']}];
  if (t >= kt(a, 2)) baris.push({at: kt(a, 2), prompt: 'postgres=# ', cmd: t >= kt(a, 3) + .6 ? '\\q' : '', warnaPrompt: '#e6e9f2'});
  if (t >= kt(a, 3) + .6) baris[1].at = kt(a, 3) + .6;
  const pos = K.term(c, 110, 190, 820, 420, t, baris, {size: 30, sorot: [[0, -1, sel, kt(a, 1)], [1, -1, kt(a, 2) + .2, kt(a, 3) + .4]]});
  const g = antara(t, kt(a, 1), kt(a, 2) + .5); if (g > 0) { c.save(); c.globalAlpha = g; K.rrect(c, 110, 640, 820, 100, 18, 'rgba(255,176,32,.1)', C.amber, 4);
    K.text(c, 'Kata sandi tidak terlihat saat diketik. Itu normal.', 520, 690, {size: 28, weight: 800, align: 'center'}); c.restore(); }
  const h = antara(t, kt(a, 2) + .5, kt(a, 4) + .4); if (h > 0) { c.save(); c.globalAlpha = h; K.rrect(c, 110, 640, 820, 100, 18, 'rgba(163,230,53,.1)', C.lime, 4);
    K.text(c, 'postgres=#  berarti kamu berhasil masuk', 520, 690, {size: 28, weight: 800, align: 'center'}); c.restore(); }
  // tabel perbedaan
  const T = muncul(t, kt(a, 4)); if (T > 0) { c.save(); c.globalAlpha = T; const x = 990, y = 190, w = 830; K.rrect(c, x, y, w, 550, 20, '#0d1222', C.amber, 4);
    K.text(c, 'Catatan penting', x + 36, y + 50, {size: 34, weight: 900, color: C.amber});
    const kol = [['Di video', 'tanpa kata sandi', C.sky, kt(a, 5)], ['Di komputermu', 'dengan kata sandi', C.lime, kt(a, 6)]];
    const brs = [['psql', 'psql -U postgres'], ['psql antrean', 'psql -U postgres -d antrean'], ['createdb …', 'createdb -U postgres …']];
    kol.forEach(([n, k, wn, tt], i) => { const q = muncul(t, tt); if (q <= 0) return; c.save(); c.globalAlpha *= q; const xx = x + 36 + i * 290;
      K.text(c, n, xx, y + 130, {size: 30, weight: 900, color: wn}); K.text(c, k, xx, y + 170, {size: 22, weight: 600, color: C.redup});
      brs.forEach((b, j) => K.text(c, b[i], xx, y + 250 + j * 96, {size: 28, weight: 700, mono: true})); c.restore(); });
    [0, 1, 2].forEach(j => { c.fillStyle = '#2b3558'; c.fillRect(x + 30, y + 204 + j * 96, w - 60, 2); }); c.restore(); }
  K.chipRepo(c, muncul(t, kt(a, 7)), {y: 800, ket: 'Daftar lengkap, juga untuk Mac dan Linux: README'});
};
// ---------- P7: mulai dari tag bab ----------
AD.siapTag = (c, t, D, a) => { K.bg(c); K.judul(c, 'Mulai dari tengah? Pakai tag bab', t, C.violet);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4);
  for (let i = 1; i <= 12; i++) { const x = 110 + (i - 1) * 143, on = i === 5 && t >= t2, p = muncul(t, .5 + i * .08); c.save(); c.globalAlpha = p;
    K.rrect(c, x, 190, 128, 64, 14, on ? 'rgba(255,176,32,.22)' : 'rgba(255,255,255,.04)', on ? C.amber : (i === 6 && t >= t1 ? C.violet : '#3b4a75'), on ? 5 : 3);
    K.text(c, 'bab-' + String(i).padStart(2, '0'), x + 64, 223, {size: 22, weight: 800, mono: true, align: 'center', color: on ? C.amber : C.teks}); c.restore(); }
  const q1 = muncul(t, t1); if (q1 > 0) { K.text(c, 'ingin mulai di sini', 110 + 5 * 143 + 64, 290, {size: 22, weight: 800, align: 'center', color: C.violet, alpha: q1 * (t < t2 + 2 ? 1 : .0)}); }
  const q2 = muncul(t, t2 + 2); if (q2 > 0) K.text(c, 'kode pada akhir Bab 5 = awal Bab 6', 110 + 4 * 143 + 64, 290, {size: 24, weight: 800, align: 'center', color: C.amber, alpha: q2});
  const baris = [{at: t2 + .3, cmd: 'git clone https://github.com/listyantidewi1/SiAntre.git'}, {at: t2 + 3.2, cmd: 'cd SiAntre'}, {at: t2 + 4.4, cmd: 'git checkout bab-05'},
    {at: t3 + .2, cmd: 'npm install'}, {at: t3 + 1.4, cmd: 'psql -U postgres -c "CREATE DATABASE antrean"'}, {at: t3 + 3.2, cmd: 'psql -U postgres -d antrean -f db/schema.sql'}, {at: t3 + 5.0, cmd: 'psql -U postgres -d antrean -f db/seed.sql'}];
  K.term(c, 110, 340, 1700, 480, t, baris, {size: 30, cps: 30, sorot: [[2, -1, t2 + 5.4, t3]]});
  const g = muncul(t, t4); if (g > 0) { c.save(); c.globalAlpha = g; K.rrect(c, 110, 860, 1700, 120, 20, 'rgba(163,230,53,.1)', C.lime, 4);
    K.text(c, 'Kodemu sekarang sama persis dengan kode di awal Bab 6', 960, 920, {size: 38, weight: 900, align: 'center'}); c.restore(); }
};
// ---------- Bab 4: anatomi DATABASE_URL ----------
AD.alamatDB = (c, t, D, a) => { K.bg(c); K.judul(c, 'Mengisi DATABASE_URL di laptop', t, C.amber);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6);
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 110, 190, 1700, 120, 18, '#0a0f1e', '#3b4a75', 3); let x = 150; const size = 32;
    for (const [s, w] of [['$ ', C.lime], ['DATABASE_URL=postgres://postgres@localhost/antrean', C.amber], [' node src/server.js', '#e6e9f2']]) { K.text(c, s, x, 250, {size, weight: 600, mono: true, color: w}); x += K.lebar(c, s, size, 600, true); }
    K.text(c, 'ditulis di depan perintah node', 150 + K.lebar(c, '$ ', size, 600, true), 340, {size: 26, weight: 800, color: C.amber}); c.restore(); }
  // anatomi
  const pakai = t >= t4, sandi = pakai ? ':KATASANDI' : '';
  const bag = [['postgres://', 'jenis database', C.redup, t2], ['postgres', 'nama pengguna', C.sky, t2 + 1.6], [sandi, 'kata sandi', C.coral, t2 + 2.6], ['@localhost', 'lokasi server', C.lime, t2 + 3.6], ['/antrean', 'nama database', C.violet, t2 + 4.8]];
  const size = 58; let tot = 0; bag.forEach(b => { tot += Math.max(K.lebar(c, b[0], size, 800, true), b[0] ? 0 : 150); }); let x = (1920 - tot) / 2;
  bag.forEach(([s, n, w, tt], i) => { const lw = Math.max(K.lebar(c, s, size, 800, true), s ? 0 : 150), q = muncul(t, tt); if (q > 0) { c.save(); c.globalAlpha = q;
      if (s) K.text(c, s, x, 520, {size, weight: 800, mono: true, color: w}); else { c.setLineDash([12, 10]); K.rrect(c, x + 8, 484, lw - 16, 72, 10, null, C.coral, 4); c.setLineDash([]); K.text(c, 'kosong', x + lw / 2, 521, {size: 26, weight: 800, align: 'center', color: C.coral, alpha: muncul(t, t3)}); }
      if (i > 0) { c.fillStyle = w; c.fillRect(x + 6, 572, lw - 12, 6); K.text(c, n, x + lw / 2, i % 2 ? 620 : 668, {size: 28, weight: 800, align: 'center', color: w}); if (!(i % 2)) { c.fillRect(x + lw / 2 - 2, 578, 4, 66); } }
      c.restore(); } x += lw; });
  if (i3(t, t3, t4)) K.text(c, 'PostgreSQL di komputerku tidak memakai kata sandi', 960, 770, {size: 30, weight: 700, align: 'center', color: C.redup, alpha: antara(t, t3, t4 + .45)});
  const p4 = muncul(t, t4 + .45); if (p4 > 0) K.text(c, 'Punyamu memakai kata sandi? Tulis setelah nama pengguna, dipisah titik dua', 960, 770, {size: 30, weight: 800, align: 'center', color: C.coral, alpha: p4 * (t < t5 ? 1 : .0)});
  const p5 = muncul(t, t5); if (p5 > 0 ) { c.save(); c.globalAlpha = p5 * (t < t6 ? 1 : 1 - muncul(t, t6, .3)); ['Git Bash', 'Mac', 'Linux'].forEach((s, i) => { const xx = 500 + i * 320; K.rrect(c, xx, 730, 290, 80, 40, 'rgba(163,230,53,.1)', C.lime, 4); K.centang(c, xx + 50, 770, 30, 1, C.lime); K.text(c, s, xx + 90, 771, {size: 32, weight: 800}); }); c.restore(); }
  K.chipRepo(c, muncul(t, t6 + .2), {y: 850, ket: 'Cara menulisnya di PowerShell: README, bagian 3'});
};
const i3 = (t, a, b) => t >= a && t < b + .5;
// ---------- Bab 8: akun contoh + SESSION_SECRET ----------
AD.akunContoh = (c, t, D, a) => { K.bg(c); K.judul(c, 'Membuat akun untuk mencoba login', t, C.pink);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  [['pakrahmat', 'admin', C.amber, 'melihat laporan'], ['dina', 'petugas', C.sky, 'Loket 1'], ['yoga', 'petugas', C.lime, 'Loket 2']].forEach(([u, r, w, k], i) => { const p = muncul(t, t1 + 1.6 + i * .9); if (p <= 0) return; c.save(); c.globalAlpha = p; const x = 110 + i * 580, y = 190 + (1 - p) * 20;
    K.rrect(c, x, y, 540, 170, 20, 'rgba(255,255,255,.05)', w, 4); K.orang(c, x + 80, y + 150, 130, w); K.text(c, u, x + 160, y + 60, {size: 40, weight: 900, mono: true}); K.text(c, r + '  ·  ' + k, x + 160, y + 118, {size: 26, weight: 700, color: w}); c.restore(); });
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 110, 390, 1700, 90, 18, 'rgba(244,114,182,.08)', C.pink, 3);
    K.text(c, 'password:', 150, 436, {size: 28, weight: 700, color: C.redup}); K.text(c, 'rahasia123', 320, 436, {size: 32, weight: 800, mono: true}); K.arrow(c, 560, 436, 660, 436, C.pink, 4, muncul(t, t2 + 1.5), 14);
    K.text(c, 'di database hanya hash:', 700, 436, {size: 28, weight: 700, color: C.redup, alpha: muncul(t, t2 + 1.8)}); K.text(c, '$2b$12$Kq8…', 1100, 436, {size: 32, weight: 800, mono: true, color: C.pink, alpha: muncul(t, t2 + 1.8)}); c.restore(); }
  const DBU = 'DATABASE_URL=postgres://postgres@localhost/antrean';
  const baris = [{at: t3 + .3, cmd: DBU + ' node db/pengguna.js', out: [['Akun contoh dibuat', C.lime]], jeda: .9}];
  if (t >= t4) baris.push({at: t4 + .6, cmd: 'SESSION_SECRET=rahasia-lokal ' + DBU + ' node src/server.js', out: ['SiAntre berjalan'], jeda: .9});
  const pt = muncul(t, t3); if (pt > 0) { K.term(c, 110, 520, 1700, 330, t, baris, {size: 25, cps: 34, p: pt});
    const sel = t4 + .6 + 28 / 34, q = muncul(t, Math.max(sel, t5)); if (q > 0) { const lw = K.lebar(c, 'SESSION_SECRET=rahasia-lokal', 25, 500, true), px = 110 + 26 + K.lebar(c, '$ ', 25, 700, true); sorotKuning(c, px - 8, 520 + 52 + 22 + 80 - 2, lw + 16, 44, q); } }
  const p5 = muncul(t, t4); if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, 110, 890, 1700, 100, 18, 'rgba(255,176,32,.1)', C.amber, 4);
    K.text(c, 'Mulai sekarang server butuh dua variabel:  DATABASE_URL  dan  SESSION_SECRET', 960, 940, {size: 30, weight: 800, align: 'center'}); c.restore(); }
};
// ---------- Bab 10: coba di HP sungguhan ----------
AD.cobaHP = (c, t, D, a) => { K.bg(c); K.judul(c, 'Coba di HP sungguhan, sebelum online', t, C.sky);
  const t1 = kt(a, 1), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6), t7 = kt(a, 7);
  // router + laptop
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; const rx = 620, ry = 240; K.rrect(c, rx - 90, ry, 180, 50, 12, '#1e2a4a', C.sky, 4); c.strokeStyle = C.sky; c.lineWidth = 5;
    for (let i = 1; i <= 3; i++) { c.globalAlpha = p1 * (.35 + .65 * ((Math.floor(t * 2) + i) % 3 === 0 ? 1 : .4)); c.beginPath(); c.arc(rx, ry - 6, 18 * i, Math.PI * 1.2, Math.PI * 1.8); c.stroke(); } c.globalAlpha = p1;
    K.text(c, 'Wi-Fi yang sama', rx, ry + 82, {size: 28, weight: 800, align: 'center', color: C.sky}); laptop(c, 250, 250, .6); K.text(c, 'laptop', 250, 340, {size: 24, weight: 700, align: 'center', color: C.redup});
    c.setLineDash([10, 10]); c.strokeStyle = C.sky; c.lineWidth = 4; c.beginPath(); c.moveTo(370, 265); c.lineTo(520, 265); c.moveTo(720, 265); c.lineTo(1330, 265); c.stroke(); c.setLineDash([]); c.restore(); }
  // terminal ipconfig
  const p3 = muncul(t, t3 - .2); if (p3 > 0) K.term(c, 110, 400, 1130, 400, t, [{at: t3 + .5, prompt: '> ', cmd: 'ipconfig', out: ['Wireless LAN adapter Wi-Fi:', '   IPv4 Address. . . . . . : 192.168.1.23', '   Subnet Mask . . . . . . : 255.255.255.0', '   Default Gateway . . . . : 192.168.1.1']}],
    {size: 28, judul: 'Terminal (Windows)', p: p3, sorot: [[0, 1, t3 + 2.6]]});
  const p4 = muncul(t, t4); if (p4 > 0) K.text(c, 'Alamat IP laptop: biasanya berawalan 192.168', 675, 840, {size: 30, weight: 800, align: 'center', color: C.amber, alpha: p4 * (t < t7 ? 1 : 0)});
  // HP
  const ph = muncul(t, Math.min(t1, 3)); c.save(); c.globalAlpha = ph; const hx = 1360, hy = 150, hw = 420, hh = 850;
  K.hp(c, hx, hy, hw, hh, (c, x, y, w, h) => { c.fillStyle = '#e2e8f0'; c.fillRect(x, y, w, 70); K.rrect(c, x + 14, y + 12, w - 28, 46, 23, '#fff', '#94a3b8', 2);
    const url = '192.168.1.23:3000', n = Math.floor(K.clamp((t - t5 - 1.2) * 9, 0, url.length)); K.text(c, url.slice(0, n), x + 34, y + 36, {size: 22, weight: 700, mono: true, color: '#1e293b'});
    const q = muncul(t, t6, .5); const im = K.IMG[a.img]; if (q > 0 && im) { c.save(); c.globalAlpha *= q; const ih = w * im.height / im.width; c.drawImage(im, x, y + 70, w, ih); c.restore(); }
    else K.text(c, t >= t5 ? 'ketik alamat IP laptop' : '', x + w / 2, y + 300, {size: 22, weight: 700, align: 'center', color: '#64748b'}); });
  sorotKuning(c, hx + 16, hy + 30, hw - 32, 62, muncul(t, t5 + .6) * (t < t6 + 1 ? 1 : 0)); c.restore();
  // firewall
  const p7 = muncul(t, t7); if (p7 > 0) { c.save(); c.globalAlpha = p7; const x = 190, y = 430 + (1 - p7) * 20; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 30; K.rrect(c, x, y, 970, 330, 14, '#f1f5f9', '#475569', 3); c.shadowColor = 'transparent';
    K.rrect(c, x, y, 970, 58, 14, '#1d4ed8'); c.fillStyle = '#1d4ed8'; c.fillRect(x + 2, y + 34, 966, 26); K.text(c, 'Windows Security Alert', x + 26, y + 30, {size: 26, weight: 800, color: '#fff'});
    K.text(c, 'Firewall memblokir sebagian fitur Node.js', x + 40, y + 120, {size: 30, weight: 700, color: '#1e293b'}); K.text(c, 'Izinkan di jaringan pribadi (Private networks)', x + 40, y + 170, {size: 26, weight: 600, color: '#475569'});
    tombol(c, x + 560, y + 236, 230, 62, 'Allow access', '#2563eb', muncul(t, t7 + 2.2), t); K.rrect(c, x + 810, y + 236, 130, 62, 12, '#e2e8f0', '#94a3b8', 2); K.text(c, 'Cancel', x + 875, y + 268, {size: 24, weight: 700, align: 'center', color: '#475569'}); c.restore(); }
  K.chipRepo(c, muncul(t, t7 + 3.2), {x: 110, y: 880, w: 1130, ket: 'Mac dan Linux: perintahnya ada di README'});
};
// ---------- Bab 12: SSH dan Docker ----------
const SRV = 'root@siantre:~# ';
AD.sshDocker = (c, t, D, a) => { K.bg(c); K.judul(c, 'Menyiapkan server', t, C.lime, 'Langkah 1 dari 3: masuk lewat SSH, lalu pasang Docker');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5);
  const p1 = muncul(t, Math.min(t1, 2.5)); c.save(); c.globalAlpha = p1; laptop(c, 1180, 130, .42); K.text(c, 'laptop', 1180, 196, {size: 22, weight: 700, align: 'center', color: C.redup});
  K.rrect(c, 1560, 70, 250, 120, 16, '#1e2a4a', C.violet, 4); K.text(c, 'VPS', 1685, 108, {size: 30, weight: 900, align: 'center', color: C.violet}); K.text(c, '203.0.113.10', 1685, 154, {size: 24, weight: 700, mono: true, align: 'center'});
  const g = muncul(t, t2); if (g > 0) { K.arrow(c, 1280, 130, 1548, 130, C.lime, 5, g, 16); K.text(c, 'SSH', 1414, 100, {size: 24, weight: 900, align: 'center', color: C.lime, alpha: g}); } c.restore();
  const baris = [{at: t2 + .5, prompt: 'laptop $ ', cmd: 'ssh root@203.0.113.10', out: ["root@203.0.113.10's password: ", 'Welcome to Ubuntu 24.04 LTS'], jeda: .6}];
  if (t >= t3 - .4) baris.push({at: t4 + .4, prompt: SRV, cmd: t >= t4 + .4 ? 'curl -fsSL https://get.docker.com | sh' : '', out: t >= t4 + .4 ? ['# Executing docker install script ...', ['Docker terpasang', C.lime]] : [], jeda: 1.0, warnaPrompt: C.amber});
  if (t >= t5) baris.push({at: t5 + .5, prompt: SRV, cmd: 'docker --version', out: ['Docker version 27.3.1'], warnaPrompt: C.amber});
  if (baris[1] && t < t4 + .4) baris[1].at = t3 - .4;
  K.term(c, 110, 250, 1700, 520, t, baris, {size: 30, cps: 26});
  const p3 = antara(t, t3, t4 + 6); if (p3 > 0) { c.save(); c.globalAlpha = p3; const lw = K.lebar(c, SRV, 30, 700, true); sorotKuning(c, 110 + 18, 250 + 52 + 22 + 144 + 1, lw + 10, 46, 1);
    K.rrect(c, 110, 810, 1700, 110, 20, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'Tanda di depan berubah: mulai sekarang perintahmu dijalankan di server, bukan di laptop', 960, 866, {size: 30, weight: 800, align: 'center'}); c.restore(); }
};
// ---------- Bab 12: DNS ----------
AD.dnsA = (c, t, D, a) => { K.bg(c); K.judul(c, 'Mengarahkan domain ke server', t, C.sky, 'Langkah 2 dari 3: catatan DNS bertipe A');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4);
  const p1 = muncul(t, Math.min(t1, 2.5)); if (p1 > 0) { c.save(); c.globalAlpha = p1; const x = 110, y = 230; K.rrect(c, x, y, 860, 420, 18, '#f1f5f9', '#475569', 3); K.rrect(c, x, y, 860, 64, 18, '#cbd5e1'); c.fillStyle = '#cbd5e1'; c.fillRect(x + 2, y + 40, 856, 26);
    K.text(c, 'Pengaturan DNS  ·  bengkelmajujaya.test', x + 30, y + 34, {size: 26, weight: 800, color: '#1e293b'});
    [['Type', 'A', 120], ['Name', 'antre', 220], ['Value', '203.0.113.10', 380]].reduce((xx, [n, v, w], i) => { K.text(c, n, xx, y + 130, {size: 24, weight: 700, color: '#475569'}); K.rrect(c, xx, y + 160, w, 70, 8, '#fff', '#64748b', 3);
      const tt = t1 + 2.6 + i * 1.5, nn = Math.floor(K.clamp((t - tt) * 10, 0, v.length)); K.text(c, v.slice(0, nn), xx + 18, y + 196, {size: 30, weight: 800, mono: true, color: '#1e293b'}); return xx + w + 30; }, x + 40);
    tombol(c, x + 40, y + 290, 200, 64, 'Simpan', '#2563eb', muncul(t, t1 + 7.4) * (t < t2 ? 1 : 0), t);
    c.restore(); }
  const pd = muncul(t, t1 + 4); if (pd > 0) { c.save(); c.globalAlpha = pd; K.rrect(c, 1060, 250, 750, 90, 18, 'rgba(96,165,250,.1)', C.sky, 4); K.text(c, 'antre.bengkelmajujaya.test', 1435, 296, {size: 30, weight: 800, mono: true, align: 'center'});
    K.arrow(c, 1435, 350, 1435, 430, C.sky, 5, muncul(t, t1 + 5.2), 16); K.text(c, 'A', 1475, 390, {size: 30, weight: 900, color: C.sky});
    const q = muncul(t, t1 + 5.6); c.globalAlpha = pd * q; K.rrect(c, 1160, 440, 550, 90, 18, 'rgba(167,139,250,.1)', C.violet, 4); K.text(c, '203.0.113.10', 1435, 486, {size: 34, weight: 800, mono: true, align: 'center'}); K.text(c, 'alamat IP server', 1435, 560, {size: 24, weight: 700, align: 'center', color: C.violet}); c.restore(); }
  const p2 = antara(t, t2, t3); if (p2 > 0) K.text(c, 'Menyebar dalam beberapa menit, kadang beberapa jam', 1435, 630, {size: 26, weight: 800, align: 'center', color: C.amber, alpha: p2});
  const p3 = muncul(t, t3 - .2); if (p3 > 0) K.term(c, 110, 700, 1700, 280, t, [{at: t3 + .6, cmd: 'ping antre.bengkelmajujaya.test', out: ['PING antre.bengkelmajujaya.test (203.0.113.10) 56(84) bytes of data.', '64 bytes from 203.0.113.10: icmp_seq=1 ttl=54 time=18.2 ms']}], {size: 28, p: p3, sorot: [[0, 1, t4 + .3]]});
};
// ---------- Bab 12: certbot ----------
AD.certbot = (c, t, D, a) => { K.bg(c); K.judul(c, 'Sertifikat HTTPS dengan certbot', t, C.amber, 'Langkah 3 dari 3: gratis dari Let\'s Encrypt');
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), DOM = 'antre.bengkelmajujaya.test';
  const baris = [{at: t1 + .5, prompt: SRV, cmd: 'apt install certbot', out: ['Setting up certbot ...'], warnaPrompt: C.amber, jeda: .8}];
  if (t >= t2) baris.push({at: t2 + .5, prompt: SRV, cmd: 'certbot certonly --standalone -d ' + DOM, warnaPrompt: C.amber, jeda: 9e9});
  if (t >= t3 + .4) { baris[1].jeda = 0; baris[1].out = [['Successfully received certificate.', C.lime], 'Certificate is saved at:', '  /etc/letsencrypt/live/' + DOM + '/fullchain.pem']; }
  K.term(c, 110, 210, 1700, 400, t, baris, {size: 28, cps: 28, judul: 'Terminal (di server)', p: muncul(t, Math.min(t1, 2.5)), sorot: [[1, 2, t3 + 3]]});
  const p4 = muncul(t, t4); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 110, 660, 520, 150, 18, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'folder di server', 370, 704, {size: 24, weight: 700, align: 'center', color: C.redup}); K.text(c, '/etc/letsencrypt', 370, 760, {size: 36, weight: 900, mono: true, align: 'center', color: C.amber});
    K.arrow(c, 650, 735, 800, 735, C.amber, 5, muncul(t, t4 + 1), 16); K.text(c, 'volume', 725, 700, {size: 24, weight: 800, align: 'center', color: C.amber});
    K.rrect(c, 820, 660, 990, 150, 18, '#0d1222', C.lime, 4); K.text(c, 'compose.yaml  ·  layanan nginx', 850, 704, {size: 24, weight: 700, color: C.redup}); K.text(c, '- /etc/letsencrypt:/etc/letsencrypt:ro', 850, 760, {size: 32, weight: 700, mono: true}); c.restore(); }
  const p5 = muncul(t, t5); if (p5 > 0) { c.save(); c.globalAlpha = p5; K.rrect(c, 110, 860, 1700, 110, 20, 'rgba(163,230,53,.1)', C.lime, 4); K.centang(c, 560, 915, 40, muncul(t, t5 + .3), C.lime); K.text(c, 'Server siap menerima aplikasi kita', 1000, 916, {size: 38, weight: 900, align: 'center'}); c.restore(); }
};
})();
