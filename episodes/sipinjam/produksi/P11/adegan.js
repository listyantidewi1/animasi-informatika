// Adegan Bab 11: jendela cetak browser (digambar), dengan pratinjau laporan asli.
(() => { const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
AD.cetakPDF = (c, t, D, a) => { K.bg(c); K.judul(c, 'Cetak ke PDF, tanpa pustaka tambahan', t, C.sky, 'Tombol Cetak memanggil window.print() milik browser');
  const p = muncul(t, .3), x = 200, y = 200 + (1 - p) * 24, w = 1520, h = 800; c.save(); c.globalAlpha = p; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 36; K.rrect(c, x, y, w, h, 16, '#e5e7eb', '#475569', 3); c.shadowColor = 'transparent';
  // pratinjau
  c.fillStyle = '#9ca3af'; c.fillRect(x + 3, y + 3, 960, h - 6); const im = K.IMG[a.img], pw = 520, ph = 736; c.fillStyle = '#fff'; c.fillRect(x + 220, y + 32, pw, ph);
  if (im) { const sk = pw / im.width; c.drawImage(im, 0, 0, im.width, Math.min(im.height, ph / sk), x + 220, y + 32, pw, Math.min(ph, im.height * sk)); }
  else { K.text(c, 'Laporan Peminjaman', x + 250, y + 90, {size: 26, weight: 900, color: '#111'}); for (let i = 0; i < 9; i++) { c.fillStyle = i ? '#e5e7eb' : '#cbd5e1'; c.fillRect(x + 250, y + 130 + i * 44, pw - 60, 30); } }
  // panel kanan
  const rx = x + 1000; K.text(c, 'Print', rx, y + 60, {size: 36, weight: 800, color: '#111827'}); K.text(c, '1 page', rx + 420, y + 62, {size: 24, weight: 600, color: '#6b7280'});
  [['Destination', 'Save as PDF'], ['Pages', 'All'], ['Layout', 'Portrait']].forEach(([k, v], i) => { const yy = y + 150 + i * 96; K.text(c, k, rx, yy, {size: 26, weight: 600, color: '#374151'}); K.rrect(c, rx + 190, yy - 30, 290, 60, 8, '#fff', '#9ca3af', 2);
    K.text(c, v, rx + 208, yy + 1, {size: 26, weight: 700, color: '#111827'}); K.text(c, '▾', rx + 450, yy, {size: 22, weight: 700, color: '#6b7280'}); });
  K.sorotKuning(c, rx + 178, y + 108, 314, 84, muncul(t, 1.0) * (t < 3.2 ? 1 : 0));
  K.rrect(c, rx + 190, y + h - 100, 140, 60, 30, '#2563eb'); K.text(c, 'Save', rx + 260, y + h - 69, {size: 26, weight: 800, align: 'center', color: '#fff'}); K.rrect(c, rx + 346, y + h - 100, 140, 60, 30, '#fff', '#9ca3af', 2); K.text(c, 'Cancel', rx + 416, y + h - 69, {size: 26, weight: 700, align: 'center', color: '#2563eb'});
  K.sorotKuning(c, rx + 180, y + h - 110, 160, 80, muncul(t, 3.2));
  c.restore();
  const q = muncul(t, 4.2); if (q > 0) { c.save(); c.globalAlpha = q; const fx = 1186, fy = 660 + (1 - q) * 20; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 24; K.rrect(c, fx, fy, 500, 150, 18, '#0d1222', C.lime, 4); c.shadowColor = 'transparent';
    K.rrect(c, fx + 26, fy + 30, 76, 90, 8, '#ef4444'); K.text(c, 'PDF', fx + 64, fy + 76, {size: 24, weight: 900, align: 'center', color: '#fff'}); K.text(c, 'laporan-peminjaman.pdf', fx + 122, fy + 60, {size: 24, weight: 800, mono: true}); K.text(c, 'rapi, siap dicetak', fx + 122, fy + 100, {size: 22, weight: 600, color: C.redup}); c.restore(); }
};
})();
