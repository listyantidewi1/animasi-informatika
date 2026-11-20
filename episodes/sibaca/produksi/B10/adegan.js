// B10 Berjalan tanpa internet
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
const prog = (c, x, y, w, nama, sub, warna, p = 1, mati = false) => { if (p <= 0) return; c.save(); c.globalAlpha *= p * (mati ? .35 : 1); K.rrect(c, x, y, w, 190, 22, '#18213c', warna, 5); K.text(c, nama, x + w / 2, y + 76, {size: 44, weight: 900, align: 'center', color: warna}); K.text(c, sub, x + w / 2, y + 134, {size: 26, weight: 700, align: 'center', color: C.redup}); c.restore(); };
// b2: Vite mengemas React menjadi berkas biasa
AD.kemas = (c, t, D, a) => { K.bg(c); K.judul(c, 'Dari dua program menjadi satu', t, C.lime);
  const t1 = kt(a, 1), t2 = kt(a, 2);
  prog(c, 140, 250, 520, 'Express', 'server API  ·  port 3000', C.lime, muncul(t, .4)); prog(c, 140, 500, 520, 'Vite', 'menayangkan React  ·  port 5173', C.violet, muncul(t, .9));
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 210, 706, 380, 64, 32, 'rgba(167,139,250,.14)', C.violet, 3); K.text(c, 'hanya alat bantu', 400, 740, {size: 28, weight: 800, align: 'center', color: C.violet}); c.restore(); }
  const p2 = muncul(t, t2); if (p2 <= 0) return; c.save(); c.globalAlpha = p2; K.arrow(c, 680, 595, 880, 595, C.amber, 7, p2); K.text(c, 'npm run build', 780, 545, {size: 21, weight: 800, align: 'center', mono: true, color: C.amber});
  K.rrect(c, 900, 250, 880, 640, 24, 'rgba(255,176,32,.06)', C.amber, 5); K.text(c, 'web/dist', 950, 310, {size: 40, weight: 900, mono: true, color: C.amber}); K.text(c, 'berkas biasa, siap disajikan', 1240, 312, {size: 28, weight: 700, color: C.redup});
  [['index.html', 'satu halaman'], ['assets/index-xxxx.js', 'seluruh kode React'], ['assets/index-xxxx.css', 'seluruh gaya tampilan'], ['assets/inter-latin-400.woff2 ...', 'huruf Inter']].forEach(([f, k], i) => { const q = muncul(t, t2 + 1.4 + i * .8); if (q <= 0) return; c.globalAlpha = p2 * q; const y = 370 + i * 120; K.rrect(c, 950, y, 780, 96, 14, '#18213c', '#3b4a75', 2); K.text(c, f, 980, y + 34, {size: 28, weight: 800, mono: true}); K.text(c, k, 980, y + 72, {size: 24, weight: 600, color: C.redup}); });
  c.restore(); };
// b5-b6: jendela firewall dan address reservation
AD.firewallRouter = (c, t, D, a) => { K.bg(c);
  const t1 = kt(a, 1), t2 = kt(a, 2), t3 = kt(a, 3), t4 = kt(a, 4), t5 = kt(a, 5), t6 = kt(a, 6);
  const A = t < t4 ? 1 : 1 - muncul(t, t4 - .3, .4);
  if (A > 0) { c.save(); c.globalAlpha = A; K.judul(c, 'Halaman tidak mau terbuka di HP? Periksa firewall', t, C.coral);
    const p1 = muncul(t, t1); if (p1 > 0) { c.globalAlpha = A * p1; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 40; K.rrect(c, 360, 210, 1200, 600, 14, '#f1f5f9', '#94a3b8', 2); c.shadowColor = 'transparent'; K.rrect(c, 360, 210, 1200, 64, 14, '#1e3a8a'); c.fillStyle = '#1e3a8a'; c.fillRect(360, 250, 1200, 24);
      K.text(c, 'Windows Security Alert', 390, 243, {size: 28, weight: 700, color: '#fff'}); K.text(c, 'Windows Defender Firewall has blocked some features of this app', 400, 330, {size: 30, weight: 800, color: '#0f172a'});
      K.text(c, 'Name:', 400, 410, {size: 26, weight: 600, color: '#475569'}); K.text(c, 'Node.js JavaScript Runtime', 560, 410, {size: 26, weight: 800, color: '#0f172a'});
      K.text(c, 'Allow Node.js JavaScript Runtime to communicate on these networks:', 400, 490, {size: 26, weight: 600, color: '#334155'});
      const cek = t >= t2 + .8; [['Private networks, such as my home or work network', true], ['Public networks, such as those in airports and coffee shops', false]].forEach(([s, on], i) => { const y = 560 + i * 70; K.rrect(c, 420, y - 20, 40, 40, 6, '#fff', '#475569', 3); if (on && cek) K.centang(c, 440, y, 30, 1, '#2563eb'); K.text(c, s, 484, y + 1, {size: 26, weight: on ? 800 : 600, color: '#1e293b'}); });
      K.sorotKuning(c, 400, 524, 900, 72, muncul(t, t2)); K.tombol(c, 1240, 716, 280, 64, 'Allow access', '#2563eb', 1, t); K.sorotKuning(c, 1226, 704, 308, 88, muncul(t, t2 + 1.6)); }
    K.chipRepo(c, A * muncul(t, t3), {y: 880, ket: 'Jendela itu telanjur ditutup? Cara membukanya lagi ada di README'});
    c.restore(); }
  const B = muncul(t, t4); if (B <= 0) return; c.save(); c.globalAlpha = B; K.judul(c, 'Supaya alamat laptop tidak berubah', 9, C.sky);
  K.browser(c, 260, 220, 1400, 640, '192.168.1.1  (halaman pengaturan router)', (c, x, y, w, h) => { K.text(c, 'DHCP  ›  Address Reservation', x + 60, y + 80, {size: 40, weight: 900, color: '#0e7490'});
    ['Nama perangkat', 'MAC Address', 'IP yang dikunci', ''].forEach((s, i) => K.text(c, s, x + 60 + i * 340, y + 170, {size: 24, weight: 800, color: '#64748b'})); c.fillStyle = '#cbd5e1'; c.fillRect(x + 60, y + 196, w - 120, 3);
    const q = muncul(t, t6); c.save(); c.globalAlpha *= q; K.text(c, 'Laptop-BuRatih', x + 60, y + 250, {size: 28, weight: 800, color: '#0f172a'}); K.text(c, 'A4-5E-60-1B-2C-9D', x + 400, y + 250, {size: 26, weight: 600, color: '#334155', mono: true}); K.text(c, '192.168.1.10', x + 740, y + 250, {size: 30, weight: 900, color: '#0f172a', mono: true}); K.tombol(c, x + 1080, y + 220, 200, 60, 'Reserve', '#0e7490', 1, t); c.restore();
    K.sorotKuning(c, x + 720, y + 214, 300, 72, muncul(t, t6 + 2.4)); }, B);
  K.text(c, 'Alamat laptop bisa berubah setiap kali router dinyalakan ulang.', 960, 930, {size: 34, weight: 800, align: 'center', color: C.amber, alpha: B * muncul(t, t5)});
  c.restore(); };
// b7: kabel internet dicabut
AD.cabutInternet = (c, t, D, a) => { K.bg(c); K.judul(c, 'Pembuktian', t, C.lime);
  const t1 = kt(a, 1), p = muncul(t, .3), putus = K.ease(K.seg(t, t1 + .4, t1 + 1.4)); c.save(); c.globalAlpha = p;
  c.fillStyle = 'rgba(56,189,248,.14)'; c.strokeStyle = C.sky; c.lineWidth = 5; c.beginPath(); c.ellipse(360, 540, 220, 130, 0, 0, 7); c.fill(); c.stroke(); K.text(c, 'Internet', 360, 540, {size: 48, weight: 900, align: 'center', color: C.sky});
  K.rrect(c, 1180, 470, 380, 140, 22, '#1e293b', C.sky, 5); [0, 1, 2].forEach(i => { c.fillStyle = C.lime; c.beginPath(); c.arc(1260 + i * 50, 540, 11, 0, 7); c.fill(); }); K.text(c, 'Router WiFi perpustakaan', 1370, 670, {size: 32, weight: 900, align: 'center'});
  c.strokeStyle = putus > 0 ? C.coral : '#94a3b8'; c.lineWidth = 10; c.lineCap = 'round'; const xm = 880, g = putus * 70; c.beginPath(); c.moveTo(590, 540); c.lineTo(xm - 20 - g, 540 + g * .5); c.stroke(); c.beginPath(); c.moveTo(xm + 20 + g, 540 - g * .3); c.lineTo(1170, 540); c.stroke();
  if (putus > 0) { K.coret(c, xm - 50, 490, xm + 50, 590, putus, C.coral); K.coret(c, xm + 50, 490, xm - 50, 590, putus, C.coral); K.text(c, 'Kabel internet dicabut', 880, 780, {size: 54, weight: 900, align: 'center', color: C.coral, alpha: putus}); }
  c.restore(); };
})();
