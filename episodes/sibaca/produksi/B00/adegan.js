// B00 Pembuka: janji, bukti kegagalan versi AI, peta bab
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul, S = K.seg;
const kartu = (c, x, y, w, h, judul, isi, warna, p, o = {}) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; const dy = (1 - p) * 20;
  K.rrect(c, x, y + dy, w, h, 22, 'rgba(255,255,255,.05)', warna, 4); K.text(c, judul, x + 36, y + dy + (isi ? 56 : h / 2), {size: o.sj || 36, weight: 900, color: warna, maxW: w - 70, lh: 1.2, mono: !!o.mono});
  if (isi) K.text(c, isi, x + 36, y + dy + (o.yi || 112), {size: o.si || 28, weight: 600, maxW: w - 70, lh: 1.28}); c.restore(); };
// layar laptop berisi tangkapan layar
const laptop = (c, x, y, w, img, img2, campur, p = 1) => { if (p <= 0) return; const h = w * .6; c.save(); c.globalAlpha *= p; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 40; K.rrect(c, x, y, w, h, 18, '#0b1020', '#64748b', 5); c.shadowColor = 'transparent';
  c.save(); c.beginPath(); c.roundRect(x + 14, y + 14, w - 28, h - 28, 8); c.clip(); c.fillStyle = '#f1f5f4'; c.fillRect(x, y, w, h);
  const g = (s, al) => { const im = K.IMG[s]; if (!im || al <= 0) return; c.save(); c.globalAlpha *= al; const sk = (w - 28) / im.width; c.drawImage(im, x + 14, y + 14, w - 28, im.height * sk); c.restore(); }; g(img, 1); if (img2) g(img2, campur); c.restore();
  c.fillStyle = '#475569'; c.beginPath(); c.moveTo(x - w * .07, y + h + 34); c.lineTo(x + w * 1.07, y + h + 34); c.lineTo(x + w, y + h + 6); c.lineTo(x, y + h + 6); c.closePath(); c.fill(); c.restore(); };
// jendela browser berisi tangkapan layar
const jendela = (c, x, y, w, h, url, img, p = 1, zoom = 1) => K.browser(c, x, y, w, h, url, (c, bx, by, bw, bh) => { const im = K.IMG[img]; if (!im) return; c.save(); c.beginPath(); c.rect(bx, by, bw, bh); c.clip(); const sk = bw / im.width * zoom; c.drawImage(im, bx, by, im.width * sk, im.height * sk); c.restore(); }, p);
const cap = (c, teks, x, y, warna, p, o = {}) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; const size = o.size || 30, w = K.lebar(c, teks, size, 900) + 56; K.rrect(c, x, y, w, size * 2, size, o.isi || '#0d1222', warna, 4); K.text(c, teks, x + 28, y + size + 1, {size, weight: 900, color: warna}); c.restore(); return w; };

// b1: kait. Detik 0-3 sama dengan thumbnail.
AD.pembuka = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4);
  const pA = 1 - muncul(t, t3 - .45, .4), pB = muncul(t, t3) * (1 - muncul(t, t4 - .45, .4)), pC = muncul(t, t4);
  if (pA > 0) { c.save(); c.globalAlpha = pA;
    K.hpLangkahGambar(c, t, {kal: a.kal, internet: false, alamat: '192.168.1.10:3000', langkah: [{k: 0, img: a.hp[0]}, {k: 2, d: 1.9, img: a.hp[1], ketuk: [.8, .37]}, {k: 2, d: 4.4, img: a.hp[2], ketuk: [.6, .045]}]}, 150, 86, 440);
    K.pilTanpaInternet(c, 150 + 220 - 172, 86 + 440 * 2.06 - 110, 1, .8);
    const hil = 1 - muncul(t, t2 - .4, .4);
    if (hil > 0) { c.globalAlpha = pA * hil; K.text(c, 'Perpustakaan sekolah di HP,', 700, 250, {size: 74, weight: 900, color: '#eef2ff'}); K.text(c, 'tanpa internet.', 700, 380, {size: 118, weight: 900, color: C.lime});
      const p1 = muncul(t, t1); kartu(c, 700, 560, 1100, 190, 'Di akhir video ini, kamu bisa membangunnya sendiri', 'React · Express · MySQL, dari nol, dan paham setiap baris kodenya', C.amber, p1); }
    const pN = muncul(t, t2); if (pN > 0) { c.globalAlpha = pA * pN; K.tokoh(c, 'nadia', 860, 560, 330, 1); K.text(c, 'Dari HP-nya sendiri', 1040, 300, {size: 34, weight: 800, color: C.redup});
      [['Mencari buku', 0], ['Menekan tombol Pinjam', 1.9], ['Mengambil bukunya di rak', 4.4]].forEach(([s, d], i) => { const q = muncul(t, t2 + d); if (q <= 0) return; c.globalAlpha = pA * pN * q; const y = 370 + i * 96; K.nomor ? 0 : 0;
        c.fillStyle = C.amber; c.beginPath(); c.arc(1070, y, 28, 0, 7); c.fill(); K.text(c, String(i + 1), 1070, y + 2, {size: 30, weight: 900, align: 'center', color: '#141a2c'}); K.text(c, s, 1120, y + 1, {size: 40, weight: 800}); });
      const q = muncul(t, t2 + 4.6); c.globalAlpha = pA * pN * q; kartu(c, 700, 720, 1100, 150, 'Kode B0004-2', 'Aplikasi memberi tahu eksemplar mana yang harus diambil.', C.teal, q, {sj: 40, mono: true, yi: 106}); }
    c.restore(); }
  if (pB > 0) { c.save(); c.globalAlpha = pB; const g = S(t, t3 + 3.0, t3 + 3.5); laptop(c, 640, 190, 1120, a.pc[0], a.pc[1], g, 1); K.tokoh(c, 'ratih', 330, 800, 430, 1);
    cap(c, g < .5 ? 'Mencatat pengembalian' : 'Menyetujui anggota baru', 690, 930, C.teal, 1, {size: 34}); c.restore(); }
  if (pC > 0) { c.save(); c.globalAlpha = pC; K.judul(c, 'Gedung perpustakaan SMK Nusa Bakti', 9, C.coral);
    K.hpPenuh(c, 260, 260, 300, {img: a.hp[2], internet: false}); laptop(c, 700, 330, 720, a.pc[0], null, 0, 1);
    K.wifi(c, 1640, 400, 150, '#e2e8f0', true); K.text(c, 'Sinyal hampir', 1640, 560, {size: 40, weight: 900, align: 'center', color: C.coral}); K.text(c, 'tidak ada', 1640, 612, {size: 40, weight: 900, align: 'center', color: C.coral});
    K.text(c, 'Semuanya tetap berjalan.', 1060, 930, {size: 60, weight: 900, align: 'center', color: C.lime, alpha: muncul(t, t4 + 1.8)}); c.restore(); } };

// b2: meminta AI, hasil di rumah
AD.mintaAI = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3);
  const pA = 1 - muncul(t, t2 - .4, .4);
  if (pA > 0) { c.save(); c.globalAlpha = pA; K.judul(c, 'Satu kalimat untuk AI', t, C.pink);
    const teks = 'Buatkan aplikasi perpustakaan sekolah. Siswa bisa mencari dan meminjam buku dari HP.', n = Math.floor(K.clamp((t - .6) / 4.4) * teks.length);
    K.rrect(c, 260, 360, 1400, 260, 28, '#0d1222', C.pink, 4); K.text(c, 'Perintah', 310, 420, {size: 28, weight: 800, color: C.pink}); K.text(c, teks.slice(0, n) + (n < teks.length && Math.floor(t * 2) % 2 ? '▌' : ''), 310, 490, {size: 42, weight: 700, maxW: 1300, lh: 1.35});
    const p1 = muncul(t, t1); cap(c, 'Aku sudah mencobanya', 260, 690, C.amber, p1, {size: 38}); c.restore(); }
  const pB = muncul(t, t2); if (pB <= 0) return; c.save(); c.globalAlpha = pB; K.judul(c, 'Hasilnya, dicoba di rumah', 9, C.lime);
  jendela(c, 120, 200, 1180, 760, 'localhost:3000', a.img, 1); cap(c, 'Di rumah · ada internet', 150, 890, C.lime, 1, {size: 28});
  [['Tampilannya rapi', 0], ['Daftar bukunya muncul', 1.6], ['Pencariannya berfungsi', 3.2]].forEach(([s, d], i) => { const q = muncul(t, t3 + d); if (q <= 0) return; const y = 330 + i * 150; c.save(); c.globalAlpha = pB * q; K.rrect(c, 1350, y, 480, 110, 20, 'rgba(163,230,53,.08)', C.lime, 4); K.centang(c, 1400, y + 55, 40, q, C.lime); K.text(c, s, 1442, y + 56, {size: 29, weight: 800}); c.restore(); });
  c.restore(); };

// b3: dibawa ke perpustakaan
AD.diPerpus = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1); K.judul(c, 'Aplikasi yang sama, di perpustakaan', t, C.coral);
  const p = muncul(t, .3); c.save(); c.globalAlpha = p; const im = K.IMG[a.img]; const pd = S(t, 2.6, 3.2);
  jendela(c, 120, 200, 1180, 760, 'localhost:3000', pd < 1 ? a.img0 : a.img, 1, pd < 1 ? 1 : 2.2); if (pd > 0 && pd < 1) { c.save(); c.globalAlpha = p * pd; jendela(c, 120, 200, 1180, 760, 'localhost:3000', a.img, 1, 2.2); c.restore(); }
  K.pilTanpaInternet(c, 150, 880, muncul(t, 1.6), .78);
  c.restore();
  const q = muncul(t, t1); if (q <= 0) return; c.save(); c.globalAlpha = q; K.text(c, 'Di dalam kode buatan AI', 1360, 250, {size: 28, weight: 800, color: C.redup});
  [['huruf', 'fonts.googleapis.com', 0], ['gaya tampilan', 'cdn.jsdelivr.net', 2.4]].forEach(([n, h, d], i) => { const r = muncul(t, t1 + d); if (r <= 0) return; c.save(); c.globalAlpha = q * r; const y = 300 + i * 230; K.rrect(c, 1360, y, 460, 190, 20, '#0d1222', C.coral, 4); K.text(c, '<link href="https://', 1390, y + 46, {size: 24, weight: 600, mono: true, color: '#7fdbff'}); K.text(c, h, 1390, y + 92, {size: 29, weight: 800, mono: true, color: C.amber}); K.text(c, n + ' diambil dari internet', 1390, y + 146, {size: 24, weight: 700}); c.restore(); });
  K.text(c, 'Setiap kali halaman dibuka.', 1360, 810, {size: 34, weight: 900, color: C.coral, alpha: muncul(t, t1 + 5.2), maxW: 460, lh: 1.25}); c.restore(); };

// b4: di HP Nadia, localhost
AD.diHP = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3); K.judul(c, 'Di HP Nadia', t, C.coral);
  K.hpPenuh(c, 150, 150, 410, {img: a.img, internet: false, alamat: '192.168.1.10:3000'});
  const p0 = 1 - muncul(t, t1 - .4, .4); if (p0 > 0) { c.save(); c.globalAlpha = p0 * muncul(t, .5); K.text(c, 'Hasilnya lebih parah.', 780, 580, {size: 72, weight: 900, color: C.coral}); c.restore(); }
  const p1 = muncul(t, t1) * (1 - muncul(t, t2 - .4, .4)); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.sorotKuning ? K.sorotKuning(c, 172, 420, 366, 500, 1) : 0; K.arrow(c, 760, 600, 580, 640, C.coral, 7, 1); K.text(c, 'Halamannya terbuka,', 780, 540, {size: 56, weight: 900}); K.text(c, 'daftar bukunya kosong.', 780, 620, {size: 56, weight: 900, color: C.coral}); c.restore(); }
  const p2 = muncul(t, t2) * (1 - muncul(t, t3 - .4, .4)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.labelAI(c, 700, 190, 1);
    K.kode(c, ["const API = 'http://localhost:3000/api'", "fetch(API + '/buku')"], 700, 260, {size: 34, w: 1100, sorot: [0]});
    const q = muncul(t, t2 + 3.6); c.globalAlpha = p2 * q; kartu(c, 700, 480, 520, 250, 'Di laptop Bu Ratih', 'localhost = laptop itu sendiri. Servernya ada di situ, jadi berhasil.', C.lime, q, {sj: 32, si: 26, yi: 110});
    const r = muncul(t, t2 + 6.4); c.globalAlpha = p2 * r; kartu(c, 1280, 480, 520, 250, 'Di HP Nadia', 'localhost = HP itu sendiri. Di HP tidak ada server, jadi gagal.', C.coral, r, {sj: 32, si: 26, yi: 110});
    K.text(c, 'localhost selalu berarti "perangkat ini sendiri".', 700, 820, {size: 38, weight: 900, color: C.amber, alpha: muncul(t, t2 + 8.2)}); c.restore(); }
  const p3 = muncul(t, t3); if (p3 > 0) { c.save(); c.globalAlpha = p3; kartu(c, 700, 300, 1100, 200, 'Selama dicoba di rumah: tidak ada error satu pun', 'Semua terlihat benar, karena di rumah ada internet dan dicoba di laptop yang sama.', C.amber, p3, {sj: 38, yi: 124});
    const q = muncul(t, t3 + 5.0); c.globalAlpha = p3 * q; K.text(c, 'Kesalahan yang tidak menampilkan error', 700, 620, {size: 46, weight: 900}); K.text(c, 'adalah yang paling sulit ditemukan.', 700, 690, {size: 46, weight: 900, color: C.coral}); c.restore(); } };

// b5: AI sebagai asisten yang rajin
AD.asisten = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4); K.judul(c, 'AI itu asisten yang sangat rajin', t, C.pink);
  // robot kecil
  const p = muncul(t, .3); c.save(); c.globalAlpha = p; const x = 330, y = 560; K.rrect(c, x - 130, y - 150, 260, 220, 40, '#1f2a48', C.pink, 6); c.fillStyle = C.pink; c.beginPath(); c.arc(x - 55, y - 50, 22, 0, 7); c.arc(x + 55, y - 50, 22, 0, 7); c.fill();
  c.strokeStyle = C.pink; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.arc(x, y - 5, 46, Math.PI * .15, Math.PI * .85); c.stroke(); c.beginPath(); c.moveTo(x, y - 150); c.lineTo(x, y - 200); c.stroke(); c.beginPath(); c.arc(x, y - 212, 13, 0, 7); c.fill();
  K.rrect(c, x - 90, y + 90, 180, 150, 26, '#1f2a48', C.pink, 6); K.text(c, 'AI', x, y + 166, {size: 54, weight: 900, align: 'center', color: C.pink}); c.restore();
  K.text(c, 'belum pernah datang ke perpustakaanmu', 330, 880, {size: 30, weight: 800, align: 'center', color: C.redup, alpha: muncul(t, 3.4), maxW: 460, lh: 1.25});
  const X = 660, W = 1140;
  const pA = 1 - muncul(t, t2 - .4, .4); if (pA > 0) { c.save(); c.globalAlpha = pA; kartu(c, X, 250, W, 170, 'Mengerjakan persis apa yang kamu minta', null, C.lime, muncul(t, t1), {sj: 42}); kartu(c, X, 460, W, 170, 'Tidak memikirkan hal yang lupa kamu ceritakan', null, C.coral, muncul(t, t1 + 3.2), {sj: 42});
    const q = muncul(t, t1 + 4.4); c.globalAlpha = pA * q; K.text(c, '"tanpa internet"   ·   "dipakai dari HP"   ·   "maksimal tiga buku"', X + 36, 700, {size: 30, weight: 700, color: C.redup}); c.restore(); }
  const pB = muncul(t, t2) * (1 - muncul(t, t4 - .4, .4)); if (pB > 0) { c.save(); c.globalAlpha = pB; kartu(c, X, 250, W, 200, 'Harus ada orang yang tahu apa saja yang perlu diperiksa', null, C.amber, 1, {sj: 44});
    const q = muncul(t, t3); c.globalAlpha = pB * q; K.text(c, 'Video ini melatihmu', X + 10, 580, {size: 72, weight: 900}); K.text(c, 'menjadi orang itu.', X + 10, 680, {size: 72, weight: 900, color: C.lime}); c.restore(); }
  const pC = muncul(t, t4); if (pC > 0) { c.save(); c.globalAlpha = pC; K.text(c, 'Setelah paham, pakai AI sebanyak yang kamu mau', X + 10, 290, {size: 40, weight: 900, maxW: W});
    const q1 = muncul(t, t4 + 4.6), q2 = muncul(t, t4 + 6.6); c.globalAlpha = pC * q1; K.rrect(c, X, 400, 540, 260, 24, 'rgba(163,230,53,.08)', C.lime, 5); K.centang(c, X + 270, 480, 80, q1, C.lime); K.text(c, 'Hasilnya benar: pakai', X + 270, 600, {size: 34, weight: 900, align: 'center', color: C.lime});
    c.globalAlpha = pC * q2; K.rrect(c, X + 600, 400, 540, 260, 24, 'rgba(255,107,107,.08)', C.coral, 5); K.coret(c, X + 830, 440, X + 910, 520, q2, C.coral); K.coret(c, X + 910, 440, X + 830, 520, q2, C.coral); K.text(c, 'Hasilnya salah: tolak', X + 870, 600, {size: 34, weight: 900, align: 'center', color: C.coral}); c.restore(); } };

// b6: peta sebelas bab
const BAB = [['Persiapan', 'semua'], ['Kebutuhan', 'kebutuhan'], ['Merancang database', 'database'], ['API dengan Express', 'server'], ['Daftar dan login', 'server'], ['React pertama', 'frontend'], ['Pencarian', 'server'], ['Pinjam dan kembali', 'server'], ['Halaman petugas', 'semua'], ['Berjalan tanpa internet', 'semua'], ['Uji, backup, panduan', 'semua']];
const WL = {semua: C.amber, kebutuhan: C.pink, database: C.teal, server: C.violet, frontend: C.sky};
AD.petaBab = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3); K.judul(c, 'Sebelas bab, dari komputer kosong sampai dipakai Bu Ratih', t, C.amber);
  const d = Math.min(1.05, (t1 - 1.5) / 11);
  BAB.forEach(([n, l], i) => { const p = muncul(t, .6 + i * d, .4); if (p <= 0) return; const kol = i % 4, br = Math.floor(i / 4), x = 100 + kol * 436, y = 200 + br * 150 + (1 - p) * 16, w = WL[l]; c.save(); c.globalAlpha = p;
    K.rrect(c, x, y, 412, 122, 18, 'rgba(255,255,255,.05)', w, 4); c.fillStyle = w; c.beginPath(); c.arc(x + 52, y + 61, 30, 0, 7); c.fill(); K.text(c, String(i + 1), x + 52, y + 63, {size: 30, weight: 900, align: 'center', color: '#141a2c'});
    K.text(c, n, x + 98, y + (K.lebar(c, n, 28, 800) > 300 ? 46 : 62), {size: 28, weight: 800, maxW: 300, lh: 1.15}); c.restore(); });
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 1408, 500, 412, 122, 18, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'Cap waktu tiap bab', 1438, 540, {size: 28, weight: 900, color: C.amber}); K.text(c, 'ada di deskripsi video', 1438, 584, {size: 26, weight: 700}); c.restore(); }
  const p2 = muncul(t, t2) * (1 - muncul(t, t3 - .4, .4)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.text(c, 'Bekalmu cukup dasar JavaScript', 100, 720, {size: 32, weight: 800, color: C.redup});
    ['variabel', 'fungsi', 'array'].forEach((s, i) => { const q = muncul(t, t2 + 2.2 + i * .9); c.globalAlpha = p2 * q; K.rrect(c, 100 + i * 330, 770, 300, 110, 20, '#0d1222', C.sky, 4); K.text(c, s, 250 + i * 330, 826, {size: 40, weight: 900, align: 'center', mono: true, color: C.sky}); }); c.restore(); }
  const p3 = muncul(t, t3); if (p3 > 0) { K.chipRepo(c, p3, {y: 700, x: 100, w: 1000, ket: 'Seluruh kode ada di GitHub'}); c.save(); c.globalAlpha = muncul(t, t3 + 3.6); K.text(c, 'Setiap bab punya tag:', 1150, 730, {size: 28, weight: 800, color: C.redup}); K.text(c, 'bab-01  bab-02  …  bab-11', 1150, 786, {size: 34, weight: 800, mono: true, color: C.amber}); c.restore(); } };

// b7: segmen Cek kerjaan AI
AD.cekSegmen = (c, t, D, a) => { K.bg(c); const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3); K.cekAIjudul(c, t);
  const pA = 1 - muncul(t, t3 - .4, .4); if (pA > 0) { c.save(); c.globalAlpha = pA; K.text(c, 'Di setiap bab ada segmen ini', 140, 210, {size: 44, weight: 900, alpha: muncul(t, .5)});
    const p1 = muncul(t, t1); if (p1 > 0) { c.globalAlpha = pA * p1; K.labelAI(c, 140, 280, 1); const sorot = t >= t2 ? [0, 2] : [];
      K.kode(c, ['const { nama, nis, sandi, peran } = req.body', "await db.query('INSERT INTO pengguna (nama, nis, sandi, peran) VALUES (?, ?, ?, ?)',", '  [nama, nis, sandi, peran])'], 140, 350, {size: 27, w: 1640, sorot, pSorot: muncul(t, t2)});
      const q = muncul(t, t1 + 5.0) * (1 - muncul(t, t2 - .4, .4)); if (q > 0) { c.globalAlpha = pA * q; K.text(c, 'Tugasmu: temukan masalahnya sebelum aku membuktikannya.', 140, 640, {size: 44, weight: 900, color: C.amber}); }
      const r = muncul(t, t2 + .4); if (r > 0) { c.globalAlpha = pA * r; kartu(c, 140, 600, 1640, 190, 'Siapa pun bisa mendaftar sebagai petugas perpustakaan', 'Cukup mengirim peran: "petugas" dari luar formulir. Buktinya ada di Bab 5.', C.coral, r, {sj: 42, si: 30, yi: 124}); } }
    c.restore(); }
  const pB = muncul(t, t3); if (pB > 0) { c.save(); c.globalAlpha = pB; K.text(c, 'Kita mulai', 960, 430, {size: 44, weight: 800, align: 'center', color: C.redup}); K.text(c, 'Bab 1: Persiapan', 960, 550, {size: 110, weight: 900, align: 'center'}); K.text(c, 'Memasang alat sampai dua server berjalan', 960, 670, {size: 38, weight: 700, align: 'center', color: C.amber}); c.restore(); } };
})();
