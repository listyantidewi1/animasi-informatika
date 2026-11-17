const RAK = [['Apa ibu kota Indonesia?', 'jakarta'], ['Berapa 7 x 8?', '56'], ['Planet terdekat dengan Matahari?', 'merkurius']];
K.rak = (c, x, y, w, t0, t, o = {}) => { // rak 3 laci; o.buka = indeks laci terbuka; o.isi = p
  const h = 150;
  RAK.forEach(([q, k], i) => {
    const p = K.out(K.seg(t, t0 + i * .6, t0 + .6 + i * .6)), yy = y + i * (h + 24);
    c.save(); c.globalAlpha = p;
    const buka = o.buka === i ? K.out(o.pb ?? 1) * 120 : 0;
    K.rrect(c, x, yy, w, h, 16, '#18203a', K.C.garis, 3);
    K.rrect(c, x + 14 + buka, yy + 14, w - 28, h - 28, 12, K.C.panel, o.buka === i ? K.C.amber : '#3b4a78', 3);
    K.text(c, String(i), x - 40, yy + h / 2, {size: 46, weight: 800, mono: true, align: 'center', color: K.C.amber});
    const pi = o.isi === undefined ? 1 : K.out(K.seg(t, o.isi + i * 1.2, o.isi + .8 + i * 1.2));
    c.globalAlpha = p * pi;
    K.rrect(c, x + 40 + buka, yy + 36, w * .6, h - 72, 10, '#e9eefb'); K.text(c, q, x + 56 + buka, yy + h / 2, {size: 28, weight: 700, color: '#141a2c'});
    K.rrect(c, x + 60 + w * .6 + buka, yy + 36, w * .4 - 120, h - 72, 10, '#fff1d6'); K.text(c, k, x + 60 + w * .6 + buka + (w * .4 - 120) / 2, yy + h / 2, {size: 30, weight: 800, mono: true, align: 'center', color: '#8a5a00'});
    c.restore();
  });
};
Object.assign(K.adegan, {
  pengingat(c, t, D) {
    K.rangkuman(c, t, D, {judul: 'Ingat lagi dari episode sebelumnya', item: [{ikon: 'Kotak', warna: K.C.teal, judul: 'Variabel', sub: 'mengingat data', kode: 'skor = 0'}, {ikon: 'Putar', warna: K.C.violet, judul: 'Input', sub: 'bertanya ke pemain', kode: 'input(...)'}, {ikon: 'Cabang', warna: K.C.coral, judul: 'if', sub: 'mengambil keputusan', kode: 'if ...:'}]});
  },
  rakList(c, t, D) {
    K.bg(c); K.judul(c, 'List: rak dengan laci berurutan', t, K.C.amber, 'Banyak data disimpan dalam satu variabel');
    K.rak(c, 300, 260, 1100, 2, t, {isi: 7});
    const p = K.out(K.seg(t, D - 9, D - 8));
    c.save(); c.globalAlpha = p; K.rrect(c, 1480, 300, 340, 300, 20, 'rgba(255,176,32,.12)', K.C.amber, 3);
    K.text(c, 'Laci pertama', 1650, 380, {size: 32, weight: 700, align: 'center'}); K.text(c, 'nomor 0', 1650, 450, {size: 60, weight: 800, align: 'center', color: K.C.amber, mono: true});
    K.text(c, 'bukan 1', 1650, 520, {size: 30, weight: 600, align: 'center', color: K.C.redup}); c.restore();
  },
  g_rak(c, t, D, a, r) { c.save(); c.translate(r.x + 60, r.y); c.scale(.72, .72); K.rak(c, 0, 0, 1300, .3, t, {isi: 1}); c.restore(); },
  forLaci(c, t, D) {
    K.bg(c); K.judul(c, 'Perulangan for: buka laci satu per satu', t, K.C.violet, 'Berhenti sendiri setelah laci terakhir');
    const n = Math.floor(K.clamp((t - 6) / 3.2, 0, 3.99)), pb = ((t - 6) % 3.2) / 3.2;
    K.rak(c, 220, 280, 1000, 1, t, t > 6 && t < 6 + 3.2 * 3 ? {buka: n, pb: K.seg(pb, 0, .3) - K.seg(pb, .8, 1)} : {});
    const p = K.out(K.seg(t, 2, 3)); c.save(); c.globalAlpha = p;
    K.kode(c, ['for pertanyaan, kunci in soal:', '    ...'], 1290, 300, {size: 30, w: 560});
    K.text(c, 'putaran ke-' + (t > 6 ? Math.min(3, n + 1) : 0) + ' dari 3', 1570, 520, {size: 36, weight: 800, align: 'center', color: K.C.violet}); c.restore();
    const p2 = K.out(K.seg(t, D - 7, D - 6)); c.save(); c.globalAlpha = p2;
    K.rrect(c, 1290, 620, 560, 260, 18, K.C.panel, K.C.garis, 2);
    K.text(c, 'while', 1330, 680, {size: 34, weight: 800, mono: true, color: K.C.violet}); K.text(c, 'ulangi sampai disuruh berhenti', 1450, 680, {size: 26, weight: 600, color: K.C.redup});
    K.text(c, 'for', 1330, 780, {size: 34, weight: 800, mono: true, color: K.C.amber}); K.text(c, 'ulangi sebanyak isi list', 1450, 780, {size: 26, weight: 600, color: K.C.redup}); c.restore();
  },
  g_for(c, t, D, a, r) {
    const y = r.y + 20; c.save(); c.translate(r.x + 40, y); c.scale(.7, .7); K.rak(c, 0, 0, 900, 0, 99, {buka: 0, pb: K.seg(t, 1, 2)}); c.restore();
    const p = K.ease(K.seg(t, 2.5, 4.5)), p2 = K.ease(K.seg(t, 3.5, 5.5));
    K.kotakVar(c, r.x + 780, y + 20, 'pertanyaan', null, {w: 460, h: 110, warna: K.C.sky});
    K.kotakVar(c, r.x + 1290, y + 20, 'kunci', null, {w: 260, h: 110, warna: K.C.amber});
    K.kotakVar(c, r.x + 1290, y + 250, 'skor', 0, {w: 260, h: 110, warna: K.C.teal, size: 56});
    const x1 = K.lerp(r.x + 120, r.x + 795, p), y1 = K.lerp(y + 26, y + 75, p) - Math.sin(Math.PI * p) * 60;
    K.rrect(c, x1, y1, 430, 62, 10, '#e9eefb'); K.text(c, RAK[0][0], x1 + 14, y1 + 31, {size: 26, weight: 700, color: '#141a2c'});
    const x2 = K.lerp(r.x + 470, r.x + 1310, p2), y2 = K.lerp(y + 26, y + 75, p2) - Math.sin(Math.PI * p2) * 60;
    K.rrect(c, x2, y2, 220, 62, 10, '#fff1d6'); K.text(c, 'jakarta', x2 + 110, y2 + 31, {size: 28, weight: 800, mono: true, align: 'center', color: '#8a5a00'});
    K.text(c, 'putaran berikutnya: laci 1, lalu laci 2', r.x + 780, y + 330, {size: 30, weight: 600, color: K.C.redup, alpha: K.out(K.seg(t, D * .6, D * .6 + .8))});
  },
  timbangan(c, t, D) {
    K.bg(c); K.judul(c, 'Membandingkan teks', t, K.C.sky, 'Bagi komputer, huruf besar dan spasi membuat teks berbeda');
    const rapi = K.seg(t, D * .55, D * .55 + 2.5), miring = (1 - K.ease(rapi)) * 0.22;
    const cx = 960, cy = 520; c.save(); c.translate(cx, cy);
    c.strokeStyle = K.C.teks; c.lineWidth = 8; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 300); c.moveTo(-120, 300); c.lineTo(120, 300); c.stroke();
    c.rotate(-miring); c.beginPath(); c.moveTo(-420, 0); c.lineTo(420, 0); c.stroke();
    const kiri = rapi > .5 ? '"jakarta"' : '" Jakarta "', kanan = '"jakarta"';
    [[-420, kiri, rapi > .5 ? K.C.lime : K.C.coral], [420, kanan, K.C.lime]].forEach(([x, s, w]) => { c.save(); c.translate(x, 0); c.rotate(miring);
      c.beginPath(); c.moveTo(-150, 120); c.lineTo(0, 0); c.lineTo(150, 120); c.strokeStyle = K.C.redup; c.lineWidth = 3; c.stroke();
      K.rrect(c, -170, 120, 340, 90, 14, K.C.panel, w, 4); K.text(c, s, 0, 166, {size: 38, weight: 800, mono: true, align: 'center', color: '#f9a07a'}); c.restore(); });
    c.restore();
    K.text(c, rapi > .5 ? 'sama!' : 'beda', cx, cy - 90, {size: 52, weight: 800, align: 'center', color: rapi > .5 ? K.C.lime : K.C.coral});
    const pm = K.out(K.seg(t, D * .35, D * .35 + 1)); c.save(); c.globalAlpha = pm;
    K.rrect(c, 120, 820, 360, 90, 16, '#2a2050', K.C.violet, 3); K.text(c, '.strip()', 300, 865, {size: 38, weight: 800, mono: true, align: 'center', color: K.C.violet});
    K.text(c, 'buang spasi di ujung', 300, 950, {size: 26, weight: 600, align: 'center', color: K.C.redup});
    K.rrect(c, 520, 820, 360, 90, 16, '#2a2050', K.C.violet, 3); K.text(c, '.lower()', 700, 865, {size: 38, weight: 800, mono: true, align: 'center', color: K.C.violet});
    K.text(c, 'jadikan huruf kecil', 700, 950, {size: 26, weight: 600, align: 'center', color: K.C.redup}); c.restore();
  },
  g_samaDengan(c, t, D, a, r) {
    const y = r.y + 60, p1 = K.out(K.seg(t, 1, 1.8)), p2 = K.out(K.seg(t, D * .45, D * .45 + .8));
    c.save(); c.globalAlpha = p1; K.rrect(c, r.x, y, 700, 230, 20, '#0d1222', K.C.garis, 2);
    K.text(c, 'skor = skor + 1', r.x + 350, y + 60, {size: 40, weight: 700, mono: true, align: 'center'});
    K.text(c, '=  masukkan ke kotak', r.x + 350, y + 160, {size: 36, weight: 800, align: 'center', color: K.C.teal}); c.restore();
    c.save(); c.globalAlpha = p2; K.rrect(c, r.x + 800, y, 740, 230, 20, '#0d1222', K.C.garis, 2);
    K.text(c, 'jawaban == kunci', r.x + 1170, y + 60, {size: 40, weight: 700, mono: true, align: 'center'});
    K.text(c, '==  apakah sama?', r.x + 1170, y + 160, {size: 36, weight: 800, align: 'center', color: K.C.amber}); c.restore();
  },
  persen(c, t, D) {
    K.bg(c); K.judul(c, 'Menghitung nilai', t, K.C.lime, 'Skor dibagi jumlah soal, dikali seratus');
    const p = K.out(K.seg(t, 1.5, 2.5)); c.save(); c.globalAlpha = p;
    K.text(c, '2', 420, 420, {size: 140, weight: 800, align: 'center', mono: true, color: K.C.teal});
    c.fillStyle = K.C.teks; c.fillRect(320, 490, 200, 8);
    K.text(c, '3', 420, 580, {size: 140, weight: 800, align: 'center', mono: true});
    K.text(c, 'skor', 620, 420, {size: 34, weight: 700, color: K.C.redup}); K.text(c, 'len(soal)', 620, 580, {size: 34, weight: 700, mono: true, color: K.C.amber});
    K.text(c, '× 100', 900, 500, {size: 70, weight: 800, mono: true}); c.restore();
    const q = K.seg(t, D * .45, D * .45 + 3), cx = 1500, cy = 500, R = 220;
    c.save(); c.globalAlpha = K.out(K.seg(t, D * .4, D * .4 + .6));
    c.fillStyle = '#26304f'; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill();
    c.fillStyle = K.C.lime; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.667 * K.ease(q)); c.fill();
    c.fillStyle = K.C.bg1; c.beginPath(); c.arc(cx, cy, R * .58, 0, 7); c.fill();
    K.text(c, Math.round(67 * K.ease(q)) + '%', cx, cy + 4, {size: 76, weight: 800, align: 'center'}); c.restore();
    const pl = K.out(K.seg(t, D - 6, D - 5)); c.save(); c.globalAlpha = pl;
    K.rak(c, 280, 760, 0, 0, 0, {}); c.restore();
    c.save(); c.globalAlpha = pl; K.rrect(c, 260, 760, 560, 110, 18, 'rgba(255,176,32,.12)', K.C.amber, 3);
    K.text(c, 'len(soal) = 3 laci', 540, 815, {size: 40, weight: 800, mono: true, align: 'center', color: K.C.amber}); c.restore();
  },
});
