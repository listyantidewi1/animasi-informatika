// P00 Pembuka
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul, O = K.out, S = K.seg;
const B = 'file:///home/user/pinjam/bahan/';
// kamera digambar dengan kode; (x, y) = tengah, s = lebar
K.kameraIkon = (c, x, y, s, warna = '#e2e8f0') => { c.save(); c.translate(x, y);
  K.rrect(c, -s * .5, -s * .28, s, s * .62, s * .08, '#1e293b', warna, s * .035); K.rrect(c, -s * .2, -s * .4, s * .4, s * .14, s * .04, '#1e293b', warna, s * .035);
  c.strokeStyle = warna; c.lineWidth = s * .04; c.beginPath(); c.arc(0, s * .03, s * .2, 0, 7); c.stroke(); c.fillStyle = '#60a5fa'; c.beginPath(); c.arc(0, s * .03, s * .11, 0, 7); c.fill();
  c.fillStyle = C.amber; c.beginPath(); c.arc(s * .36, -s * .15, s * .035, 0, 7); c.fill(); c.restore(); };
// layar HP berisi tangkapan layar asli (lebar penuh, dipotong dari atas); zoom opsional
K.hpGambar = (c, x, y, w, h, im, o = {}) => K.hp(c, x, y, w, h, (c, lx, ly, lw, lh) => { if (!im) return; const sk = lw / im.width * (o.zoom || 1); c.drawImage(im, lx - (o.dx || 0) * sk, ly - (o.dy || 0) * sk, im.width * sk, im.height * sk); });
const ketuk = (c, x, y, p) => { if (p <= 0 || p >= 1) return; c.save(); c.globalAlpha = 1 - p; c.strokeStyle = C.amber; c.lineWidth = 8; c.beginPath(); c.arc(x, y, 20 + 60 * p, 0, 7); c.stroke(); c.fillStyle = 'rgba(255,176,32,.5)'; c.beginPath(); c.arc(x, y, 18, 0, 7); c.fill(); c.restore(); };
// Kait: dua HP, satu kamera. a.img1..img4 = rafi sebelum, nadia sebelum, rafi sesudah, nadia sesudah
AD.duaHP = (c, t, D, a) => { K.bg(c);
  const t1 = a.tanpaJanji ? 9e9 : kt(a, 1), t2 = kt(a, 2), keluar = t >= t1 ? O(S(t, t1, t1 + .7)) : 0;
  const tk = a.kTk !== undefined ? kt(a, a.kTk, a.dTk || 0) : (a.tk ?? 1.5), tb = a.kTb !== undefined ? kt(a, a.kTb, .3) : tk + .7, sudah = t >= tb, w = 400, h = 800, y = 150, xs = [300 - keluar * 180, 1220 + keluar * 180], sk = 1 - keluar * .22;
  c.save(); c.globalAlpha = 1 - keluar * .93;
  [['Rafi', 'XI RPL 1', a.img1, a.img3], ['Nadia', 'XI DKV 2', a.img2, a.img4]].forEach(([n, k, s0, s1], i) => { const x = xs[i];
    K.text(c, n, x + w / 2, 78, {size: 52, weight: 900, align: 'center'}); K.text(c, k, x + w / 2, 124, {size: 26, weight: 600, align: 'center', color: C.redup});
    K.hpGambar(c, x, y, w, h, K.IMG[sudah ? s1 : s0]);
    if (!sudah) ketuk(c, x + 10 + 110 * (w - 20) / 400, y + 26 + 400 * (w - 20) / 400, S(t, tk, tk + .7));
    const pb = O(S(t, tb + .2, tb + .7)) * (1 - keluar); if (pb > 0) { c.save(); c.globalAlpha *= pb; K.rrect(c, x + 40, y + h - 150 + (1 - pb) * 20, w - 80, 84, 42, '#16a34a'); K.text(c, 'BERHASIL', x + w / 2, y + h - 107 + (1 - pb) * 20, {size: 40, weight: 900, align: 'center', color: '#fff'}); c.restore(); } });
  // tengah: satu kamera
  const pk = O(S(t, .15, .7)) * (1 - keluar); c.globalAlpha = pk; K.kameraIkon(c, 960, 430, 300); K.text(c, 'Kamera DSLR', 960, 610, {size: 44, weight: 900, align: 'center'});
  K.rrect(c, 800, 650, 320, 70, 35, sudah ? C.coral : C.amber); K.text(c, sudah ? '1 kamera, 2 peminjam' : 'tersisa 1', 960, 686, {size: sudah ? 28 : 34, weight: 900, align: 'center', color: '#141a2c'});
  if (!sudah) { K.arrow(c, 760, 500, 720, 500, C.amber, 6, pk); K.arrow(c, 1160, 500, 1200, 500, C.amber, 6, pk); }
  K.labelAI(c, 725, 760, O(S(t, tb + .8, tb + 1.4))); c.restore();
  // janji
  if (keluar > 0) { c.save(); c.globalAlpha = keluar; const dy = (1 - keluar) * 30;
    K.text(c, 'Di video ini, kamu membangun:', 960, 300 + dy, {size: 40, weight: 700, align: 'center', color: C.redup});
    K.text(c, 'Aplikasi peminjaman alat', 960, 400 + dy, {size: 96, weight: 900, align: 'center'});
    K.text(c, 'yang tidak bisa dikalahkan dengan cara itu', 960, 495 + dy, {size: 44, weight: 700, align: 'center', color: C.amber});
    [['PHP + MySQL', C.sky], ['stored procedure · trigger', C.teal], ['dari nol sampai online', C.lime]].forEach(([s, wr], i) => { const q = muncul(t, t1 + 2.2 + i * 1.3); if (q <= 0) return; c.save(); c.globalAlpha = q; K.rrect(c, 330 + i * 430, 600 + (1 - q) * 20, 400, 96, 48, 'rgba(255,255,255,.06)', wr, 4); K.text(c, s, 530 + i * 430, 649, {size: 30, weight: 800, align: 'center'}); c.restore(); });
    const q2 = muncul(t, t2); if (q2 > 0) { c.globalAlpha = q2; K.rrect(c, 380, 780, 1160, 110, 24, 'rgba(244,114,182,.12)', C.pink, 4); K.text(c, 'dan belajar menemukan kesalahan seperti tadi, sebelum pemakaimu.', 960, 836, {size: 32, weight: 800, align: 'center'}); }
    c.restore(); } };
// Thumbnail (digambar di kanvas 1920x1080, diperkecil ke 1280x720)
AD.thumb = (c, t, D, a) => { const g = c.createLinearGradient(0, 0, 1920, 1080); g.addColorStop(0, '#0b1224'); g.addColorStop(1, '#16233f'); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
  const hp = (x, y, w, rot, im, nama) => { c.save(); c.translate(x + w / 2, y + w); c.rotate(rot); c.translate(-(x + w / 2), -(y + w)); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 50; K.hpGambar(c, x, y, w, w * 2, im, {zoom: 1.0}); c.shadowColor = 'transparent';
    K.rrect(c, x + 20, y + w * 2 - 190, w - 40, 110, 55, '#16a34a', '#fff', 5); K.text(c, 'BERHASIL ✓', x + w / 2, y + w * 2 - 133, {size: 52, weight: 900, align: 'center', color: '#fff'});
    K.rrect(c, x + w / 2 - 110, y - 74, 220, 64, 32, '#f8fafc'); K.text(c, nama, x + w / 2, y - 41, {size: 38, weight: 900, align: 'center', color: '#0f172a'}); c.restore(); };
  hp(70, 190, 400, -.05, K.IMG[a.img3], 'Rafi'); hp(560, 190, 400, .05, K.IMG[a.img4], 'Nadia');
  c.save(); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 30; c.fillStyle = '#ffb020'; c.beginPath(); c.arc(515, 470, 150, 0, 7); c.fill(); c.shadowColor = 'transparent'; K.kameraIkon(c, 515, 450, 190, '#0f172a'); K.text(c, 'SISA 1', 515, 558, {size: 44, weight: 900, align: 'center', color: '#0f172a'}); c.restore();
  ['JANGAN', 'HANYA', 'PERCAYA AI'].forEach((s, i) => { let z = 170; c.font = `900 ${z}px Inter`; const l = c.measureText(s).width; if (l > 820) z = Math.floor(z * 820 / l); K.text(c, s, 1030, 250 + i * 170, {size: z, weight: 900, color: i === 2 ? '#ffb020' : '#fff'}); });
  K.rrect(c, 1030, 720, 800, 110, 20, '#f472b6'); K.text(c, '1 kamera, 2 peminjam?', 1430, 777, {size: 62, weight: 900, align: 'center', color: '#141a2c'});
  K.text(c, 'Aplikasi Peminjaman Alat', 1030, 900, {size: 56, weight: 900}); K.text(c, 'PHP + MySQL · dari nol sampai online', 1030, 970, {size: 40, weight: 700, color: '#9aa6c4'}); };
// Thumbnail versi 2 (Dewi 19 Nov: thumbnail tutorial fokus ke pembuatan aplikasinya, bukan ke cek AI)
AD.thumb2 = (c, t, D, a) => { const g = c.createLinearGradient(0, 0, 1920, 1080); g.addColorStop(0, '#0b1224'); g.addColorStop(1, '#123a3a'); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
  const muat = (s, x, y, z, w, o = {}) => { c.font = `900 ${z}px Inter`; const l = c.measureText(s).width; if (l > w) z = Math.floor(z * w / l); K.text(c, s, x, y, Object.assign({size: z, weight: 900}, o)); };
  // laptop berisi halaman petugas
  c.save(); c.translate(1400, 420); c.rotate(-.035); const lw = 940, lh = lw * 9 / 16; c.shadowColor = 'rgba(0,0,0,.65)'; c.shadowBlur = 60; K.rrect(c, -lw / 2 - 22, -lh / 2 - 22, lw + 44, lh + 44, 26, '#0f172a', '#64748b', 5); c.shadowColor = 'transparent';
  const im = K.IMG[a.img1]; if (im) { c.save(); c.beginPath(); c.rect(-lw / 2, -lh / 2, lw, lh); c.clip(); const z = 1.28, sk = lw / im.width * z; c.drawImage(im, -lw / 2 - 18 * sk, -lh / 2, im.width * sk, im.height * sk); c.restore(); }
  c.fillStyle = '#94a3b8'; K.rrect(c, -lw / 2 - 110, lh / 2 + 22, lw + 220, 34, 14, '#94a3b8'); c.restore();
  // HP berisi daftar alat
  c.save(); c.translate(1690, 650); c.rotate(.06); c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 50; K.hpGambar(c, -170, -330, 340, 680, K.IMG[a.img2], {}); c.restore();
  // teks
  muat('BIKIN APLIKASI', 70, 170, 150, 760); muat('PEMINJAMAN', 70, 345, 190, 760, {color: '#ffb020'}); muat('ALAT DARI NOL', 70, 520, 150, 760);
  K.rrect(c, 70, 640, 520, 120, 26, '#38bdf8'); K.text(c, 'PHP + MySQL', 330, 702, {size: 72, weight: 900, align: 'center', color: '#0b1224'});
  K.text(c, 'Stored Procedure · Trigger · Transaksi', 70, 835, {size: 44, weight: 800, color: '#e2e8f0'});
  K.rrect(c, 70, 915, 790, 92, 46, 'rgba(244,114,182,.18)', '#f472b6', 4); K.text(c, 'Jangan Langsung Percaya Hasil AI', 465, 962, {size: 42, weight: 900, align: 'center', color: '#fbcfe8'}); };
// Pembuka: detik pertama = thumbnail (aplikasi jadi), lalu dua HP, lalu janji. img1 laptop, img2 HP jadi, img3..6 = rafi/nadia sebelum, rafi/nadia sesudah
AD.pembuka = (c, t, D, a) => { const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  if (t < t1) { c.save(); const z = 1 + .012 * t; c.translate(960, 540); c.scale(z, z); c.translate(-960, -540); AD.thumb2(c, t, D, a); c.restore(); return; }
  AD.duaHP(c, t - t1, D, {img1: a.img3, img2: a.img4, img3: a.img5, img4: a.img6, tk: t2 - t1 + 1.6, kal: [0, t3 - t1, t3 - t1 + 4.6]}); };
// Sepuluh siswa, satu kamera
AD.sepuluhSatu = (c, t, D, a) => { K.bg(c); K.judul(c, 'Sepuluh siswa, satu kamera terakhir', t, C.lime);
  const tk = 1.6, th = 2.6, menang = 6;
  for (let i = 0; i < 10; i++) { const x = 162 + i * 164, y = 300, p = muncul(t, .3 + i * .06); if (p <= 0) continue; c.save(); c.globalAlpha = p;
    K.hp(c, x, y, 120, 230, (c, lx, ly, lw, lh) => { c.fillStyle = '#f1f5f9'; c.fillRect(lx, ly, lw, lh); c.fillStyle = '#0f766e'; c.fillRect(lx, ly, lw, 26);
      if (t < th) { K.rrect(c, lx + 12, ly + 110, lw - 24, 40, 8, '#0f766e'); K.text(c, 'Ajukan', lx + lw / 2, ly + 131, {size: 18, weight: 800, align: 'center', color: '#fff'}); K.kameraIkon(c, lx + lw / 2, ly + 70, 50, '#334155'); }
      else if (i === menang) { c.fillStyle = '#dcfce7'; c.fillRect(lx, ly + 26, lw, lh - 26); K.centang(c, lx + lw / 2, ly + 95, 50, muncul(t, th), '#16a34a'); K.text(c, 'Berhasil', lx + lw / 2, ly + 160, {size: 20, weight: 900, align: 'center', color: '#166534'}); }
      else { c.fillStyle = '#fee2e2'; c.fillRect(lx, ly + 26, lw, lh - 26); K.text(c, 'Stok', lx + lw / 2, ly + 96, {size: 19, weight: 800, align: 'center', color: '#991b1b'}); K.text(c, 'tidak cukup', lx + lw / 2, ly + 124, {size: 17, weight: 800, align: 'center', color: '#991b1b'}); } });
    if (t < th) ketuk(c, x + 60, y + 140, S(t, tk + i * .02, tk + .7)); c.restore(); }
  const p2 = muncul(t, th + .6); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 360, 640, 1200, 250, 26, 'rgba(163,230,53,.08)', C.lime, 4); K.kameraIkon(c, 500, 765, 150);
    K.text(c, 'Hanya satu yang berhasil', 640, 725, {size: 54, weight: 900}); K.text(c, 'Stok: 1 menjadi 0, tidak pernah minus.', 640, 800, {size: 34, weight: 700, color: C.lime}); K.text(c, 'Caranya kita bangun di bab 5.', 640, 850, {size: 28, weight: 600, color: C.redup}); c.restore(); } };
// Peta 13 bab
AD.peta13 = (c, t, D, a) => { K.bg(c); K.judul(c, 'Peta perjalanan: 13 bab', t, C.amber);
  const G = [['Siapkan', C.sky, ['1  Persiapan']], ['Rancang', C.pink, ['2  Kebutuhan', '3  Rancang database']], ['Database', C.teal, ['4  SQL dengan tangan', '5  Function, prosedur', '6  Trigger']],
    ['PHP', C.violet, ['7  Kerangka PHP', '8  Login, hak akses', '9  Halaman admin', '10  Halaman peminjam', '11  Halaman petugas']], ['Uji', C.lime, ['12  Pengujian']], ['Online', C.amber, ['13  Online']]];
  const t1 = kt(a, 1); G.forEach(([n, w, bab], i) => { const x = 110 + i * 286, p0 = muncul(t, .3 + i * .12), on = t >= t1 + i * 1.7 ? muncul(t, t1 + i * 1.7, .4) : 0; c.save(); c.globalAlpha = p0 * (.4 + .6 * (t < t1 ? 1 : on));
    K.rrect(c, x, 220, 270, 70, 18, w); K.text(c, n, x + 135, 256, {size: 32, weight: 900, align: 'center', color: '#141a2c'});
    bab.forEach((b, j) => { K.rrect(c, x, 306 + j * 78, 270, 64, 14, 'rgba(255,255,255,.05)', w, 3); K.text(c, b, x + 16, 339 + j * 78, {size: 21, weight: 700}); }); c.restore(); });
  [[2, 'Bekal: cukup dasar PHP dan HTML', C.sky, 110], [3, 'Semua alatnya gratis', C.lime, 690]].forEach(([k, s, w, x]) => { const p = muncul(t, kt(a, k)); if (p <= 0) return; c.save(); c.globalAlpha = p; K.rrect(c, x, 760 + (1 - p) * 20, 550, 84, 42, 'rgba(255,255,255,.06)', w, 4); K.text(c, s, x + 275, 803, {size: 30, weight: 800, align: 'center'}); c.restore(); });
  const p4 = muncul(t, kt(a, 4)); K.chipRepo(c, p4, {y: 880, x: 110, w: 1130, ket: 'Seluruh kode ada di GitHub'}); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 1270, 880, 540, 124, 22, 'rgba(255,255,255,.06)', C.violet, 4); K.text(c, 'Cap waktu setiap bab', 1540, 922, {size: 30, weight: 800, align: 'center'}); K.text(c, 'ada di deskripsi', 1540, 966, {size: 26, weight: 600, align: 'center', color: C.redup}); c.restore(); } };
})();
