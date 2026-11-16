// T14 Olah nilai: Excel -> pandas -> Excel, axis, rank method min
const NM = ['Ayu', 'Bima', 'Citra', 'Dimas', 'Eka', 'Fajar', 'Gita', 'Hana'];
const NL = [[88, 90, 86], [92, 84, 79], [75, 70, 78], [80, 86, 89], [95, 93, 91], [68, 72, 75], [85, 82, 88], [79, 81, 77]];
K.tabel = (c, x, y, kol, baris, o = {}) => { const cw = o.cw || 150, rh = o.rh || 52;
  kol.forEach((k, j) => { K.rrect(c, x + j * cw, y, cw - 4, rh - 4, 6, o.kepala || '#2a3a66'); K.text(c, k, x + j * cw + cw / 2 - 2, y + rh / 2, {size: o.size || 26, weight: 800, align: 'center', color: K.C.teks}); });
  baris.forEach((b, i) => b.forEach((v, j) => { const s = o.sorot ? o.sorot(i, j) : null;
    K.rrect(c, x + j * cw, y + (i + 1) * rh, cw - 4, rh - 4, 6, s || '#16203a'); K.text(c, String(v), x + j * cw + cw / 2 - 2, y + (i + 1) * rh + rh / 2, {size: o.size || 26, weight: 600, align: 'center', mono: j > 0, color: K.C.teks}); })); };
Object.assign(K.adegan, {
  excel(c, t, D) {
    K.bg(c); K.judul(c, 'Dari Excel ke pandas, lalu kembali', t, K.C.lime, 'File → DataFrame → diolah → file baru');
    const p1 = K.out(K.seg(t, .4, 1.2)), p2 = K.out(K.seg(t, D * .2, D * .3)), p3 = K.out(K.seg(t, D * .55, D * .65)), p4 = K.out(K.seg(t, D * .8, D * .9));
    const file = (x, nama, w) => { K.rrect(c, x, 420, 220, 270, 14, '#14532d', w, 4); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) K.rrect(c, x + 30 + j * 56, 470 + i * 44, 48, 34, 4, '#bbf7d0');
      K.text(c, nama, x + 110, 740, {size: 26, weight: 800, align: 'center', mono: true, color: w}); };
    c.save(); c.globalAlpha = p1; file(100, 'nilai_kelas.xlsx', K.C.lime); c.restore();
    if (p2 > 0) { K.arrow(c, 340, 555, 470, 555, K.C.teks, 6, p2); K.text(c, 'read_excel', 405, 515, {size: 24, weight: 800, mono: true, align: 'center', color: K.C.amber, alpha: p2});
      c.save(); c.globalAlpha = p2; K.tabel(c, 500, 300, ['nama', 'mat', 'ipa', 'bahasa'], NM.slice(0, 6).map((n, i) => [n, ...NL[i]]), {cw: 140, rh: 54, size: 24,
        sorot: (i, j) => t > D * .35 && t < D * .55 ? (j === 0 ? 'rgba(96,165,250,.25)' : null) : null}); c.restore();
      if (t > D * .35 && t < D * .55) { K.text(c, 'baris = murid', 1080, 400, {size: 30, weight: 800, color: K.C.sky}); K.text(c, 'kolom = pelajaran', 1080, 450, {size: 30, weight: 800, color: K.C.amber}); } }
    if (p3 > 0) { c.save(); c.globalAlpha = p3; K.rrect(c, 1090, 380, 300, 90, 45, 'rgba(167,139,250,.18)', K.C.violet, 4); K.text(c, 'diolah', 1240, 425, {size: 34, weight: 800, align: 'center', color: K.C.violet});
      K.text(c, '+ rata2, peringkat,', 1240, 510, {size: 26, weight: 700, align: 'center', color: K.C.redup}); K.text(c, 'predikat', 1240, 548, {size: 26, weight: 700, align: 'center', color: K.C.redup}); c.restore(); }
    if (p4 > 0) { K.arrow(c, 1420, 555, 1560, 555, K.C.teks, 6, p4); K.text(c, 'to_excel', 1490, 515, {size: 24, weight: 800, mono: true, align: 'center', color: K.C.amber, alpha: p4});
      c.save(); c.globalAlpha = p4; file(1590, 'hasil_nilai.xlsx', K.C.lime); c.restore(); }
  },
  axis(c, t, D) {
    K.bg(c); K.judul(c, 'Ke bawah atau ke samping?', t, K.C.amber, 'axis=0 per pelajaran, axis=1 per murid');
    const rows = NM.slice(0, 5).map((n, i) => [n, ...NL[i]]), x = 240, y = 260, cw = 150, rh = 66;
    const fase = t < D * .5 ? 0 : 1, q = K.seg(t, fase ? D * .55 : D * .15, fase ? D * .85 : D * .45);
    K.tabel(c, x, y, ['nama', 'mat', 'ipa', 'bahasa'], rows, {cw, rh, size: 28, sorot: (i, j) => {
      if (j === 0) return null; if (fase === 0) return j - 1 === Math.min(2, Math.floor(q * 3)) ? 'rgba(255,176,32,.3)' : null; return i === Math.min(4, Math.floor(q * 5)) ? 'rgba(45,212,191,.3)' : null; }});
    if (fase === 0) { const k = Math.min(2, Math.floor(q * 3)); c.save(); c.globalAlpha = .6; K.arrow(c, x + (k + 1) * cw + cw / 2, y + rh, x + (k + 1) * cw + cw / 2, y + 6 * rh + 30, K.C.amber, 8, 1, 26); c.restore();
      K.text(c, 'axis=0: ke bawah', 1100, 400, {size: 44, weight: 800, color: K.C.amber}); K.text(c, 'rata-rata setiap pelajaran', 1100, 470, {size: 32, weight: 700, color: K.C.redup}); }
    else { const b = Math.min(4, Math.floor(q * 5)); c.save(); c.globalAlpha = .6; K.arrow(c, x + cw, y + (b + 1) * rh + rh / 2 - 2, x + 4 * cw + 40, y + (b + 1) * rh + rh / 2 - 2, K.C.teal, 8, 1, 26); c.restore();
      K.text(c, 'axis=1: ke samping', 1100, 400, {size: 44, weight: 800, color: K.C.teal}); K.text(c, 'rata-rata setiap murid', 1100, 470, {size: 32, weight: 700, color: K.C.redup});
      const v = NL[b], r = ((v[0] + v[1] + v[2]) / 3).toFixed(1); K.text(c, `${NM[b]}: (${v.join(' + ')}) / 3 = ${r}`, 1100, 580, {size: 34, weight: 800, mono: true, color: K.C.teal});
      K.text(c, '← yang kita perlukan', 1100, 660, {size: 32, weight: 800, color: K.C.lime, alpha: K.out(K.seg(t, D * .85, D * .92))}); }
  },
  rank(c, t, D) {
    K.bg(c); K.judul(c, 'Peringkat untuk nilai yang sama', t, K.C.violet, 'rank() biasa vs method="min"');
    const L = [['Eka', 93], ['Ayu', 88], ['Bima', 85], ['Dimas', 85], ['Gita', 85], ['Hana', 79]], A = [1, 2, 4, 4, 4, 6], M = [1, 2, 3, 3, 3, 6];
    const p = K.out(K.seg(t, .3, 1)), pm = K.out(K.seg(t, D * .5, D * .62));
    c.save(); c.globalAlpha = p; K.text(c, 'rank()', 760, 250, {size: 34, weight: 800, mono: true, align: 'center', color: K.C.coral});
    K.text(c, 'method="min"', 1160, 250, {size: 34, weight: 800, mono: true, align: 'center', color: K.C.lime, alpha: pm});
    L.forEach(([n, v], i) => { const y = 310 + i * 100, tie = v === 85; K.rrect(c, 160, y, 420, 80, 14, tie ? 'rgba(167,139,250,.2)' : '#16203a', tie ? K.C.violet : K.C.garis, 3);
      K.text(c, n, 190, y + 40, {size: 34, weight: 800}); K.text(c, String(v), 550, y + 40, {size: 34, weight: 800, mono: true, align: 'right', color: K.C.redup});
      K.text(c, i < 2 || i === 5 ? A[i].toFixed(1) : '4.0', 760, y + 40, {size: 40, weight: 800, mono: true, align: 'center', color: tie ? K.C.coral : K.C.teks});
      if (pm > 0) K.text(c, String(M[i]), 1160, y + 40, {size: 40, weight: 800, mono: true, align: 'center', color: tie ? K.C.lime : K.C.teks, alpha: pm}); });
    const pa = K.out(K.seg(t, D * .2, D * .4)); if (pa > 0) K.text(c, '(3 + 4 + 5) / 3 = 4', 1400, 610, {size: 34, weight: 800, mono: true, color: K.C.coral, alpha: pa * (1 - pm)});
    if (pm > 0) K.text(c, 'nilai sama → peringkat terkecil', 1360, 610, {size: 32, weight: 800, color: K.C.lime, alpha: pm}); c.restore();
  },
});
K.ikonTabel = (c, x, y, s, w) => { for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) K.rrect(c, x - s * .33 + j * s * .23, y - s * .3 + i * s * .2, s * .2, s * .17, 3, i === 0 ? w : null, w, 2); };
K.ikonPanah = (c, x, y, s, w) => { K.arrow(c, x - s * .32, y, x + s * .32, y, w, s * .06, 1, s * .14); };
K.ikonPodium = (c, x, y, s, w) => { c.fillStyle = w; c.fillRect(x - s * .12, y - s * .25, s * .24, s * .5); c.fillRect(x - s * .38, y - s * .05, s * .24, s * .3); c.fillRect(x + s * .14, y + s * .05, s * .24, s * .2); };
