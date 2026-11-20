// B11 Uji, backup, dan panduan
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const flash = (c, x, y, s, p = 1) => { if (p <= 0) return; c.save(); c.globalAlpha *= p; K.rrect(c, x - 50 * s, y - 24 * s, 100 * s, 48 * s, 8 * s, '#e2e8f0', '#64748b', 3); K.rrect(c, x + 50 * s, y - 16 * s, 34 * s, 32 * s, 3 * s, '#94a3b8'); K.text(c, 'CADANGAN', x, y + 1, {size: 15 * s, weight: 900, align: 'center', color: '#0f172a'}); c.restore(); };
// b6: cadangan harus keluar dari laptop
AD.flashdisk = (c, t, D, a) => { K.bg(c);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4);
  const A = t < t1 ? 1 : 1 - muncul(t, t1 - .3, .4);
  if (A > 0) { c.save(); c.globalAlpha = A; K.judul(c, 'Cadangan di laptop yang sama?', t, C.coral); K.laptop(c, 960, 480, 2.2); K.rrect(c, 800, 350, 320, 110, 14, '#18213c', C.teal, 4); K.text(c, 'database', 960, 384, {size: 26, weight: 800, align: 'center'}); K.text(c, 'backup/sibaca.sql', 960, 428, {size: 24, weight: 700, align: 'center', mono: true, color: C.amber});
    const r = muncul(t, 2.4, .5); if (r > 0) { K.coret(c, 720, 280, 1200, 700, r); K.coret(c, 1200, 280, 720, 700, r); K.text(c, 'Laptop rusak: data dan cadangannya hilang bersama', 960, 880, {size: 42, weight: 900, align: 'center', color: C.coral, alpha: muncul(t, 3.2)}); } c.restore(); }
  const B = muncul(t, t1); if (B <= 0) return; c.save(); c.globalAlpha = B; K.judul(c, 'Cadangan harian ke flashdisk', 9, C.lime);
  // desktop Bu Ratih
  K.rrect(c, 140, 200, 900, 560, 18, '#1e3a8a', '#64748b', 4); K.text(c, 'Desktop laptop perpustakaan', 170, 236, {size: 22, weight: 700, color: '#bfdbfe'});
  const ikon = (x, y, nama, warna, sorot) => { K.rrect(c, x - 54, y - 54, 108, 108, 18, warna); K.text(c, nama.split(' ')[0], x, y + 86, {size: 22, weight: 800, align: 'center', color: '#fff'}); K.text(c, nama.split(' ').slice(1).join(' '), x, y + 114, {size: 22, weight: 800, align: 'center', color: '#fff'}); if (sorot > 0) K.sorotKuning(c, x - 90, y - 70, 180, 210, sorot); };
  ikon(300, 360, 'Mulai SiBaca', '#16a34a', 0); const p2 = muncul(t, t2); c.globalAlpha = B * p2; ikon(520, 360, 'Cadangkan SiBaca', '#d97706', muncul(t, t2 + .8)); c.globalAlpha = B;
  if (t >= t3 + 2.6 && t < t3 + 4.2) { const q = (t - t3 - 2.6) / 1.6, n = q < .5 ? 0 : 1; [0, n].forEach((_, i) => { c.save(); c.globalAlpha = B * (1 - ((q * 2) % 1)); c.strokeStyle = C.amber; c.lineWidth = 6; c.beginPath(); c.arc(520, 360, 30 + ((q * 2) % 1) * 50, 0, 7); c.stroke(); c.restore(); }); K.text(c, 'klik dua kali', 520, 540, {size: 26, weight: 800, align: 'center', color: C.amber}); }
  K.chipRepo(c, B * muncul(t, t1 + 1.5) * (t < t3 ? 1 : 1 - muncul(t, t3, .3)), {y: 800, x: 140, w: 1000, ket: 'Isi berkas kecil itu ada di README'});
  const p3 = muncul(t, t3); if (p3 > 0) { c.globalAlpha = B * p3; flash(c, 1400, 330, 2.2, 1); K.text(c, 'Setiap sore: colokkan, klik dua kali', 1400, 440, {size: 30, weight: 800, align: 'center'});
    const q = muncul(t, t3 + 4.4); if (q > 0) { c.globalAlpha = B * q; K.rrect(c, 1130, 500, 540, 110, 16, 'rgba(163,230,53,.1)', C.lime, 4); K.text(c, 'sibaca-(tanggal hari itu).sql', 1400, 556, {size: 28, weight: 800, align: 'center', mono: true, color: C.lime}); } }
  const p4 = muncul(t, t4); if (p4 > 0) { c.globalAlpha = B * p4; K.rrect(c, 140, 820, 1640, 170, 24, 'rgba(255,176,32,.1)', C.amber, 5); K.text(c, 'Sebulan sekali, coba pulihkan di komputer lain.', 960, 880, {size: 44, weight: 900, align: 'center', color: C.amber}); K.text(c, 'Cadangan yang tidak pernah dicoba dipulihkan belum bisa disebut cadangan.', 960, 944, {size: 28, weight: 700, align: 'center'}); }
  c.restore(); };
// b10: penutup
AD.sebelasJebakan = (c, t, D, a) => { K.bg(c); K.judul(c, 'Sebelas jebakan kode buatan AI', t, C.pink);
  const J = ['root dan kata sandi di dalam kode', 'Tabel dibuat tanpa bertanya', 'Kolom stok dikurangi satu', 'SQL injection', 'Peran diambil dari form', 'localhost, key nomor urut', 'Tanpa LIMIT, tanda % lolos', 'Batas pinjam hanya di browser', 'Menghapus anggota beserta riwayat', 'Huruf dan gaya dari internet', 'Cadangan di laptop yang sama'];
  J.forEach((s, i) => { const p = muncul(t, .6 + i * .28); if (p <= 0) return; const k = i % 3, b = Math.floor(i / 3), x = 140 + k * 556, y = 200 + b * 150; c.save(); c.globalAlpha = p; K.rrect(c, x, y, 530, 124, 18, 'rgba(244,114,182,.07)', C.pink, 3); K.nomor(c, i + 1, x + 54, y + 62, C.pink); K.text(c, s, x + 104, y + 62, {size: 26, weight: 800, maxW: 400, lh: 1.2}); c.restore(); });
  const p3 = muncul(t, kt(a, 3)); if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 1252, 650, 530, 124, 18, 'rgba(255,176,32,.12)', C.amber, 5); K.text(c, 'Tidak satu pun menampilkan error.', 1517, 712, {size: 28, weight: 900, align: 'center', color: C.amber, maxW: 480, lh: 1.2}); c.restore(); }
  const p4 = muncul(t, kt(a, 4)); if (p4 > 0) { c.save(); c.globalAlpha = p4; K.rrect(c, 140, 820, 1640, 170, 24, 'rgba(163,230,53,.1)', C.lime, 5); K.text(c, 'Semuanya baru terlihat oleh orang yang paham kebutuhannya dan paham kodenya.', 960, 876, {size: 34, weight: 800, align: 'center'}); K.text(c, 'Sekarang, orang itu adalah kamu.', 960, 940, {size: 46, weight: 900, align: 'center', color: C.lime, alpha: muncul(t, kt(a, 4) + 5.2)}); c.restore(); }
  K.chipRepo(c, muncul(t, kt(a, 5)), {y: 34, x: 900, w: 960, ket: 'Daftar periksanya ada di README'}); };
AD.berikutnya = (c, t, D, a) => { K.bg(c); const p = muncul(t, .3); c.save(); c.globalAlpha = p; K.text(c, 'Mau membangun aplikasi lain dengan cara yang sama?', 960, 150, {size: 48, weight: 900, align: 'center'}); K.text(c, 'Tonton video berikutnya', 960, 230, {size: 36, weight: 800, align: 'center', color: C.amber});
  [[230, 'Video berikutnya'], [1010, 'Seri lengkapnya']].forEach(([x, s]) => { K.rrect(c, x, 330, 680, 383, 20, 'rgba(255,255,255,.04)', '#3b4a75', 3); K.text(c, s, x + 340, 770, {size: 30, weight: 800, align: 'center', color: C.redup}); });
  K.text(c, 'Kode lengkap: ' + (K.REPO || 'github.com/listyantidewi1/SiBaca'), 960, 920, {size: 34, weight: 800, align: 'center', mono: true}); c.restore(); };
})();
