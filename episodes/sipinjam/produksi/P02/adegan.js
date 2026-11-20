// Adegan Bab 2 (kebutuhan). Indeks kalimat 0-based.
(() => { const C = K.C, AD = K.adegan, kt = K.kt, muncul = K.muncul;
AD.bukuTulis = (c, t, D, a) => { K.bg(c); K.judul(c, 'Selama ini: buku tulis', t, C.amber, 'Lab SMK Nusa Bakti');
  K.tokoh(c, 'yusuf', 330, 800, 470, muncul(t, .4));
  // buku
  const p = muncul(t, kt(a, 1)); if (p > 0) { c.save(); c.globalAlpha = p; const x = 620, y = 220 + (1 - p) * 24, w = 600, h = 700; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 30; K.rrect(c, x, y, w, h, 10, '#fdf6dc', '#b9a56a', 3); c.shadowColor = 'transparent';
    c.fillStyle = '#e11d48'; c.fillRect(x + 70, y + 4, 3, h - 8); K.text(c, 'Buku Peminjaman Lab', x + 96, y + 52, {size: 30, weight: 900, color: '#1e293b'});
    c.strokeStyle = '#c7d2e5'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(x + 10, y + 110 + i * 66); c.lineTo(x + w - 10, y + 110 + i * 66); c.stroke(); }
    const baris = [['Rafi', 'kamera DSLR', '10/11'], ['Nadia', 'tripod', '10/11'], ['Dimas', 'proyektor', '14/11'], ['~~~~~', 'mikrof~~', '1?/11'], ['Lina', 'proyektor', '14/11'], ['Bu Wulan', 'speaker', '15/11']];
    baris.forEach(([n, al, tg], i) => { const q = muncul(t, kt(a, 2) + i * .55, .3); if (q <= 0) return; c.save(); c.globalAlpha = p * q; const yy = y + 143 + i * 66; c.translate(x + 96, yy); c.rotate((i % 2 ? 1 : -1) * .012);
      const o = {size: 30, weight: 500, color: i === 3 ? '#64748b' : '#1e3a8a'}; c.font = `italic 500 30px ${K.F}`; c.fillStyle = o.color; c.textBaseline = 'middle'; c.fillText(n, 0, 0); c.fillText(al, 170, 0); c.fillText(tg, 400, 0); c.restore(); });
    // sorotan masalah
    const t4 = kt(a, 4), s = (i, d) => K.sorotKuning(c, x + 80, y + 113 + i * 66, w - 100, 60, muncul(t, t4 + d));
    s(3, .3); if (t >= t4 + 5.2) { s(2, 5.2); s(4, 5.2); }
    c.restore(); }
  const t3 = kt(a, 3), t4 = kt(a, 4); K.text(c, 'Masalahnya ada tiga', 1290, 260, {size: 36, weight: 900, color: C.coral, alpha: muncul(t, t3)});
  [['Tulisan sulit dibaca', 'Siapa yang meminjam mikrofon?', .2], ['Terlambat tidak ketahuan', 'Tidak ada yang menghitung harinya.', 2.6], ['Satu proyektor, dua janji', 'Dimas dan Lina, untuk hari yang sama.', 5.2]].forEach(([j, s, d], i) => { const q = muncul(t, t4 + d); if (q <= 0) return; c.save(); c.globalAlpha = q;
    const y = 320 + i * 200 + (1 - q) * 20; K.rrect(c, 1290, y, 520, 170, 20, 'rgba(255,107,107,.07)', C.coral, 4); K.nomor(c, i + 1, 1346, y + 56, C.coral); K.text(c, j, 1396, y + 58, {size: 30, weight: 900});
    K.text(c, s, 1316, y + 124, {size: 25, weight: 600, color: C.redup}); c.restore(); });
};
})();
