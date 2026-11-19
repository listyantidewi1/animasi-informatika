// L08 Halaman siswa dan policy
(() => {
const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
AD.policy = (c, t, D, a) => { K.bg(c); K.judul(c, 'Policy: satu pertanyaan', t, C.violet);
  const p0 = muncul(t, 1.2); c.save(); c.globalAlpha = p0; K.text(c, 'Bolehkah', 960, 300, {size: 44, weight: 800, align: 'center', color: C.redup}); c.restore();
  [['pengguna ini', 'Dimas', C.sky], ['melakukan hal ini', 'melihat', C.amber], ['pada data ini?', 'laporan nomor 13', C.pink]].forEach((s, i) => { const p = muncul(t, 2.4 + i * 1.3); if (p <= 0) return; c.save(); c.globalAlpha = p; const x = 140 + i * 560;
    K.rrect(c, x, 380 + (1 - p) * 20, 520, 230, 22, 'rgba(255,255,255,.05)', s[2], 4); K.text(c, s[0], x + 260, 450, {size: 38, weight: 900, align: 'center', color: s[2]}); K.text(c, s[1], x + 260, 540, {size: 34, weight: 700, align: 'center', mono: i === 2 ? false : false}); c.restore(); });
  const p2 = muncul(t, kt(a, 2)); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 140, 700, 800, 150, 20, 'rgba(163,230,53,.08)', C.lime, 4); K.text(c, 'Pemilik laporannya', 180, 750, {size: 34, weight: 900, color: C.lime}); K.text(c, '$user->id === $report->user_id', 180, 806, {size: 26, weight: 600, mono: true});
    K.rrect(c, 980, 700, 800, 150, 20, 'rgba(163,230,53,.08)', C.lime, 4); K.text(c, 'Atau admin', 1020, 750, {size: 34, weight: 900, color: C.lime}); K.text(c, '$user->isAdmin()', 1020, 806, {size: 26, weight: 600, mono: true}); c.restore(); }
};
// Laptop dan HP di WiFi yang sama
AD.hpWifi = (c, t, D, a) => { K.bg(c); K.judul(c, 'Membuka dari HP', t, C.sky, 'HP dan laptop harus berada di WiFi yang sama');
  const t1 = kt(a, a.k1), t2 = kt(a, a.k2), p0 = muncul(t, .5);
  c.save(); c.globalAlpha = p0; K.laptop(c, 420, 520, 1.5); K.text(c, 'Laptop', 420, 720, {size: 30, weight: 800, align: 'center'}); K.text(c, '192.168.1.23', 420, 770, {size: 34, weight: 800, mono: true, align: 'center', color: C.amber});
  // WiFi
  c.strokeStyle = C.sky; c.lineWidth = 8; [50, 90, 130].forEach(r => { c.beginPath(); c.arc(960, 470, r, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); }); c.fillStyle = C.sky; c.beginPath(); c.arc(960, 470, 14, 0, 7); c.fill(); K.text(c, 'WiFi yang sama', 960, 540, {size: 28, weight: 700, align: 'center', color: C.sky});
  K.hp(c, 1370, 300, 260, 480, (c, x, y, w, h) => { const p = muncul(t, t1 + 2.5); c.fillStyle = '#fff'; c.fillRect(x, y, w, 60); K.rrect(c, x + 12, y + 12, w - 24, 38, 19, '#e2e8f0'); c.globalAlpha = muncul(t, t1 + .8); K.text(c, '192.168.1.23:8000', x + 24, y + 32, {size: 19, weight: 700, mono: true, color: '#0f172a'});
    c.globalAlpha = p; c.fillStyle = '#0f766e'; c.fillRect(x, y + 60, w, 50); K.text(c, 'SiLapor', x + 16, y + 86, {size: 22, weight: 900, color: '#fff'}); [0, 1, 2].forEach(i => K.rrect(c, x + 12, y + 126 + i * 92, w - 24, 80, 10, '#fff', '#cbd5e1', 2)); c.globalAlpha = 1; });
  K.text(c, 'HP', 1500, 830, {size: 30, weight: 800, align: 'center'}); c.restore();
  const p1 = muncul(t, t1); if (p1 > 0) { c.save(); c.globalAlpha = p1; K.rrect(c, 140, 860, 1640, 100, 18, 'rgba(255,176,32,.1)', C.amber, 4); K.text(c, 'Di browser HP, ketik:', 180, 911, {size: 30, weight: 700}); K.text(c, '192.168.1.23:8000', 560, 911, {size: 40, weight: 900, mono: true, color: C.amber}); K.text(c, '(alamat IP laptop, lalu :8000)', 1080, 911, {size: 26, weight: 600, color: C.redup}); c.restore(); }
  const p2 = muncul(t, t2); if (p2 > 0) { c.save(); c.globalAlpha = p2; K.rrect(c, 560, 300, 800, 380, 14, '#f8fafc', '#94a3b8', 3); c.fillStyle = '#e2e8f0'; c.fillRect(560, 300, 800, 60); K.text(c, 'Windows Security', 590, 331, {size: 24, weight: 700, color: '#0f172a'});
    K.text(c, 'Windows Firewall memblokir beberapa fitur aplikasi ini', 590, 410, {size: 26, weight: 800, color: '#0f172a', maxW: 740}); K.text(c, 'php.exe', 590, 480, {size: 24, weight: 600, mono: true, color: '#475569'}); K.rrect(c, 590, 520, 30, 30, 4, '#2563eb'); K.text(c, '✓', 605, 536, {size: 22, weight: 900, color: '#fff', align: 'center'}); K.text(c, 'Private networks, such as my home or work network', 636, 536, {size: 22, weight: 600, color: '#334155'});
    K.rrect(c, 1000, 600, 170, 56, 8, '#2563eb'); K.text(c, 'Allow access', 1085, 629, {size: 22, weight: 800, color: '#fff', align: 'center'}); K.rrect(c, 1190, 600, 140, 56, 8, '#e2e8f0'); K.text(c, 'Cancel', 1260, 629, {size: 22, weight: 700, color: '#334155', align: 'center'});
    const q = muncul(t, t2 + 2.5); if (q > 0) { c.globalAlpha = p2 * q; K.rrect(c, 992, 592, 186, 72, 12, null, C.amber, 6); } c.restore(); }
};
})();
