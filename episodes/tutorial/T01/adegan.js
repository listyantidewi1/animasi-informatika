Object.assign(K.adegan, {
  // b03: algoritma sebagai diagram alir
  alur(c, t, D) {
    K.bg(c); K.judul(c, 'Rencana dulu: algoritma', t, K.C.amber, 'Urutan langkah yang jelas sebelum menulis kode');
    const T = i => K.out(K.seg(t, 1 + i * 2.6, 1.8 + i * 2.6));
    const node = (x, y, w, h, s, warna, p, bentuk) => { c.save(); c.globalAlpha = p; const sc = K.lerp(.9, 1, p);
      c.translate(x, y); c.scale(sc, sc);
      if (bentuk === 'ketupat') { c.beginPath(); c.moveTo(0, -h / 2); c.lineTo(w / 2, 0); c.lineTo(0, h / 2); c.lineTo(-w / 2, 0); c.closePath(); c.fillStyle = K.C.panel; c.fill(); c.strokeStyle = warna; c.lineWidth = 4; c.stroke(); }
      else K.rrect(c, -w / 2, -h / 2, w, h, 20, K.C.panel, warna, 4);
      K.text(c, s, 0, 2, {size: 34, weight: 700, align: 'center'}); c.restore(); };
    const xs = 330, xt = 860, xp = 1380;
    node(xs, 560, 360, 120, '1. Pilih angka', K.C.teal, T(0));
    K.arrow(c, xs + 185, 560, xt - 205, 560, K.C.redup, 5, K.out(K.seg(t, 2.6, 3.4)));
    node(xt, 560, 400, 120, '2. Pemain menebak', K.C.sky, T(1));
    K.arrow(c, xt + 205, 560, xp - 195, 560, K.C.redup, 5, K.out(K.seg(t, 5.2, 6)));
    node(xp, 560, 380, 220, '3. Periksa', K.C.amber, T(2), 'ketupat');
    const p3 = K.out(K.seg(t, 8.4, 9.4));
    c.save(); c.globalAlpha = p3;
    K.arrow(c, xp + 190, 560, 1700, 560, K.C.lime, 5, p3); K.text(c, 'Benar', 1710, 560, {size: 32, weight: 700, color: K.C.lime});
    K.text(c, 'Terlalu kecil / terlalu besar', xp, 330, {size: 30, weight: 600, align: 'center', color: K.C.coral}); c.restore();
    const pb = K.out(K.seg(t, 10.5, 12)); const blink = 0.55 + 0.45 * Math.sin(t * 6);
    c.save(); c.globalAlpha = pb * (t > 12 ? blink : 1); K.path(c, [[xp, 450], [xp, 380], [xt, 380], [xt, 500]], K.C.coral, 6, pb); c.restore();
    const pa = K.out(K.seg(t, D - 7, D - 6));
    c.save(); c.globalAlpha = pa; K.rrect(c, 560, 820, 800, 110, 55, 'rgba(255,176,32,.15)', K.C.amber, 3);
    K.text(c, 'Urutan langkah ini = algoritma', 960, 875, {size: 44, weight: 800, align: 'center', color: K.C.amber}); c.restore();
  },
  // b04: variabel = kotak berlabel
  variabel(c, t, D) {
    K.bg(c); K.judul(c, 'Variabel: kotak berlabel', t, K.C.teal, 'Cara komputer mengingat sesuatu');
    K.kotakVar(c, 330, 380, 'angka_rahasia', 42, {w: 420, h: 240, p: K.seg(t, 2.5, 3.3), pv: K.seg(t, 7, 8.2), size: 110});
    const pk = K.out(K.seg(t, 13, 14));
    c.save(); c.globalAlpha = pk; K.kode(c, ['angka_rahasia = 42'], 960, 420, {size: 50}); c.restore();
    const pe = K.out(K.seg(t, 17, 18.5));
    if (pe > 0) { c.save(); c.globalAlpha = pe; K.arrow(c, 1520, 600, 1210, 600, K.C.amber, 7, pe);
      K.text(c, '=  artinya  “masukkan ke kotak”', 960, 700, {size: 44, weight: 800, color: K.C.amber});
      K.text(c, 'bukan “sama dengan” seperti di matematika', 960, 770, {size: 34, weight: 500, color: K.C.redup}); c.restore(); }
  },
  // catatan umum di atas rekaman beku: panel kanan berisi kode + penjelasan + gambar
  catatan(c, t, D, a) {
    K.latar(c, a.bg, 0.72); const p = K.seg(t, 0, .6);
    K.panel(c, 120, 110, 1680, 860, p, a.warna || K.C.amber);
    c.save(); c.globalAlpha = K.out(p);
    K.text(c, a.judul, 190, 190, {size: 46, weight: 800});
    const kb = K.kode(c, a.kode, 190, 250, {size: a.ukuran || 34, sorot: a.sorot, pSorot: K.out(K.seg(t, .8, 1.4))});
    c.restore();
    if (K.adegan[a.gambar]) K.adegan[a.gambar](c, t, D, a, {x: 190, y: 250 + kb.h + 40, w: 1540, h: 860 - kb.h - 210});
  },
  g_dadu(c, t, D, a, r) { // dadu digital -> kotak angka_rahasia
    const roll = K.seg(t, 2, 6), x = r.x + 260, y = r.y + r.h / 2;
    const n = t < 6 ? 1 + Math.floor((Math.sin(t * 37) * .5 + .5) * 100) : a.angka || 42;
    c.save(); c.globalAlpha = K.out(K.seg(t, 1.2, 1.8));
    c.translate(x, y); c.rotate(t < 6 ? Math.sin(t * 9) * .15 * (1 - roll) : 0); K.rrect(c, -110, -110, 220, 220, 34, '#fff', null);
    K.text(c, String(n), 0, 4, {size: 92, weight: 800, align: 'center', mono: true, color: '#141a2c'}); c.restore();
    K.text(c, 'randint(1, 100)', x, y + 160, {size: 32, weight: 600, mono: true, align: 'center', color: K.C.sky, alpha: K.out(K.seg(t, 1.2, 1.8))});
    const pm = K.out(K.seg(t, 7, 8.5)); K.arrow(c, x + 150, y, x + 500, y, K.C.amber, 6, pm);
    K.kotakVar(c, x + 560, y - 130, 'angka_rahasia', a.angka || 42, {w: 380, h: 200, p: K.seg(t, 6.5, 7.2), pv: K.seg(t, 8.5, 9.5), size: 92});
    K.text(c, 'import random = meminjam alat pengocok angka', r.x, r.y + r.h + 10, {size: 30, weight: 600, color: K.C.redup, alpha: K.out(K.seg(t, 1, 2))});
  },
  g_duaKotak(c, t, D, a, r) {
    const y = r.y + 30;
    K.kotakVar(c, r.x + 120, y, 'angka_rahasia', '?', {w: 360, h: 180, p: 1, size: 86, warna: K.C.teal});
    K.kotakVar(c, r.x + 640, y, 'jumlah_tebakan', 0, {w: 360, h: 180, p: K.seg(t, 1.5, 2.3), pv: K.seg(t, 2.5, 3.5), size: 86, warna: K.C.sky});
    const pp = K.out(K.seg(t, D * .55, D * .55 + .6));
    c.save(); c.globalAlpha = pp; K.rrect(c, r.x + 1140, y + 40, 420, 150, 18, '#0d1222', K.C.garis, 2);
    K.text(c, 'print(...)', r.x + 1350, y + 80, {size: 32, weight: 600, mono: true, align: 'center', color: K.C.sky});
    K.text(c, '= tampilkan ke layar', r.x + 1350, y + 140, {size: 30, weight: 600, align: 'center'}); c.restore();
  },
  // b09: perulangan
  perulangan(c, t, D) {
    K.bg(c); K.judul(c, 'Perulangan: while True', t, K.C.violet, 'Baris yang menjorok ke dalam diulang terus');
    const lines = ['while True:', '    tebakan = int(input("Tebakanmu: "))', '    jumlah_tebakan = jumlah_tebakan + 1', '    ... periksa tebakan ...'];
    const p = K.out(K.seg(t, .8, 1.6)); c.save(); c.globalAlpha = p;
    const kb = K.kode(c, lines, 260, 330, {size: 38, w: 1060});
    // bayangan indentasi
    c.fillStyle = 'rgba(167,139,250,.13)'; c.fillRect(260 + 40 + kb.cw * 4 - 14, kb.y0 + kb.lh, 1060 - 40 - kb.cw * 4 - 10, kb.lh * 3); c.restore();
    // lintasan melingkar di kanan
    const cx = 1590, cy = 540, R = 180, pl = K.out(K.seg(t, 3, 4.5));
    c.save(); c.globalAlpha = pl; c.strokeStyle = K.C.violet; c.lineWidth = 10; c.setLineDash([2, 22]); c.lineCap = 'round'; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    const putaran = Math.max(0, t - 4.5), ang = -Math.PI / 2 + putaran * Math.PI;
    c.fillStyle = K.C.amber; c.shadowColor = K.C.amber; c.shadowBlur = 30; c.beginPath(); c.arc(cx + R * Math.cos(ang), cy + R * Math.sin(ang), 22, 0, 7); c.fill(); c.shadowBlur = 0;
    K.text(c, 'ulangi', cx, cy - 20, {size: 44, weight: 800, align: 'center', color: K.C.violet});
    K.text(c, 'putaran ke-' + (1 + Math.floor(putaran / 2)), cx, cy + 40, {size: 30, weight: 600, align: 'center', color: K.C.redup}); c.restore();
    const pb = K.out(K.seg(t, D - 5, D - 4));
    c.save(); c.globalAlpha = pb; K.rrect(c, 260, 820, 1060, 100, 20, 'rgba(255,107,107,.12)', K.C.coral, 3);
    K.text(c, 'Berhenti hanya jika ada perintah break', 790, 870, {size: 38, weight: 700, align: 'center', color: K.C.coral}); c.restore();
  },
  g_int(c, t, D, a, r) {
    const y = r.y + r.h / 2 - 40; const p1 = K.out(K.seg(t, 1, 2));
    c.save(); c.globalAlpha = p1; K.text(c, 'input( ) selalu memberi teks', r.x, r.y + 10, {size: 32, weight: 700, color: K.C.redup}); c.restore();
    const mv = K.seg(t, D * .5, D * .5 + 2.2), x = K.lerp(r.x + 120, r.x + 1300, K.ease(mv));
    // mesin int
    c.save(); c.globalAlpha = K.out(K.seg(t, 2, 3)); K.rrect(c, r.x + 620, y - 90, 300, 180, 24, '#2a2050', K.C.violet, 4);
    K.text(c, 'int( )', r.x + 770, y, {size: 54, weight: 800, mono: true, align: 'center', color: K.C.violet}); c.restore();
    const masuk = x > r.x + 640 && x < r.x + 900; const sudah = x >= r.x + 900;
    if (!masuk) { c.save(); c.globalAlpha = K.out(K.seg(t, 1.5, 2.4));
      if (!sudah) { K.rrect(c, x - 90, y - 60, 180, 120, 16, '#3a2a1a', '#f9a07a', 3); K.text(c, '"50"', x, y + 2, {size: 52, weight: 800, mono: true, align: 'center', color: '#f9a07a'}); K.text(c, 'teks', x, y + 95, {size: 28, weight: 600, align: 'center', color: K.C.redup}); }
      else { K.rrect(c, x - 90, y - 60, 180, 120, 16, '#17321f', K.C.lime, 3); K.text(c, '50', x, y + 2, {size: 60, weight: 800, mono: true, align: 'center', color: K.C.lime}); K.text(c, 'angka', x, y + 95, {size: 28, weight: 600, align: 'center', color: K.C.redup}); }
      c.restore(); }
  },
  g_tambah(c, t, D, a, r) {
    const y = r.y + 40, x = r.x + 160;
    const p1 = K.seg(t, 1, 3), p2 = K.seg(t, 3.5, 5.5), p3 = K.seg(t, 6, 8);
    const isi = p3 > .5 ? 1 : 0;
    K.kotakVar(c, x, y, 'jumlah_tebakan', p1 > 0 && p3 < .5 ? '' : isi, {w: 360, h: 180, size: 86, warna: K.C.sky});
    if (p1 > 0 && p3 < 1) { const xx = K.lerp(x + 180, x + 760, K.ease(p1)), yy = y + 126 - Math.sin(Math.PI * K.clamp(p1)) * 120;
      const s = p2 > 0 ? (p2 < 1 ? '0 + 1' : '1') : '0'; const xb = p3 > 0 ? K.lerp(x + 760, x + 180, K.ease(p3)) : xx;
      const yb = p3 > 0 ? y + 126 - Math.sin(Math.PI * K.clamp(p3)) * 120 : yy;
      K.text(c, s, xb, yb, {size: 80, weight: 800, align: 'center', mono: true, color: p2 > 0 ? K.C.amber : K.C.teks}); }
    K.text(c, 'ambil isi lama → tambah satu → simpan lagi', x + 560, y + 330, {size: 34, weight: 700, color: K.C.redup, align: 'center', alpha: K.out(K.seg(t, 1, 2))});
  },
  // b12: percabangan
  cabang(c, t, D) {
    K.bg(c); K.judul(c, 'Percabangan: if, elif, else', t, K.C.coral, 'Hanya satu jalan yang dipilih setiap kali');
    const ox = 330, oy = 600, cab = [[1150, 330, 'if', 'tebakan < rahasia', 'Terlalu kecil!', K.C.sky], [1150, 600, 'elif', 'tebakan > rahasia', 'Terlalu besar!', K.C.amber], [1150, 870, 'else', 'selain itu', 'Benar!', K.C.lime]];
    const pj = K.out(K.seg(t, .8, 2.5));
    cab.forEach(([x, y, k, syarat, hasil, w], i) => {
      const p = K.out(K.seg(t, 1 + i * 1.2, 2.2 + i * 1.2)); c.save(); c.globalAlpha = p;
      K.path(c, [[ox + 120, oy], [ox + 300, oy], [ox + 300, y], [x - 210, y]], w, 8, p, true);
      K.rrect(c, x - 200, y - 62, 400, 124, 18, K.C.panel, w, 4); K.text(c, k, x - 170, y - 18, {size: 36, weight: 800, mono: true, color: w});
      K.text(c, syarat, x - 170, y + 26, {size: 28, weight: 600, mono: true, color: K.C.redup});
      K.text(c, hasil, x + 240, y, {size: 38, weight: 800, color: w}); c.restore(); });
    // bola tebakan
    const rahasia = 42, urut = [30, 70, 42]; const mulai = 6;
    urut.forEach((g, i) => { const t0 = mulai + i * ((D - mulai - 1) / 3), q = K.seg(t, t0, t0 + 2.6); if (q <= 0 || q >= 1) return;
      const j = g < rahasia ? 0 : g > rahasia ? 1 : 2; const pts = [[ox, oy], [ox + 300, oy], [ox + 300, cab[j][1]], [cab[j][0] - 210, cab[j][1]]];
      let L = 0, seg = []; for (let k = 1; k < pts.length; k++) { const d = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); seg.push(d); L += d; }
      let s = L * K.ease(K.seg(q, 0, .7)), px = pts[0][0], py = pts[0][1]; for (let k = 1; k < pts.length; k++) { if (s <= seg[k - 1]) { px = K.lerp(pts[k - 1][0], pts[k][0], s / seg[k - 1]); py = K.lerp(pts[k - 1][1], pts[k][1], s / seg[k - 1]); break; } s -= seg[k - 1]; px = pts[k][0]; py = pts[k][1]; }
      c.save(); c.globalAlpha = K.clamp(Math.min(q * 8, (1 - q) * 6)); c.fillStyle = cab[j][5]; c.beginPath(); c.arc(px, py, 52, 0, 7); c.fill();
      K.text(c, String(g), px, py + 2, {size: 44, weight: 800, mono: true, align: 'center', color: '#141a2c'}); c.restore(); });
    K.kotakVar(c, 110, 470, 'angka_rahasia', 42, {w: 240, h: 150, size: 70, p: K.seg(t, .3, 1)});
  },
  // b14: garis bilangan menyusut sesuai tebakan sungguhan
  garis(c, t, D, a) {
    K.bg(c); K.judul(c, 'Trik: selalu tebak di tengah', t, K.C.amber, 'Sisa kemungkinan tinggal separuh setiap kali');
    const x0 = 160, x1 = 1760, y = 560, X = n => K.lerp(x0, x1, (n - 1) / 99);
    c.save(); c.strokeStyle = '#3a4670'; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); c.restore();
    [1, 25, 50, 75, 100].forEach(n => K.text(c, String(n), X(n), y + 60, {size: 28, weight: 600, align: 'center', color: K.C.redup}));
    let lo = 1, hi = 100; const g = a.tebakan || []; const step = (D - 2) / Math.max(1, g.length);
    g.forEach(([n, hasil], i) => { const q = K.seg(t, 1 + i * step, 1 + i * step + step * .6); if (q <= 0) return;
      const nlo = hasil === 'kecil' ? n + 1 : lo, nhi = hasil === 'besar' ? n - 1 : hi;
      const L = K.lerp(lo, hasil === 'benar' ? n : nlo, K.ease(K.seg(q, .4, 1))), H = K.lerp(hi, hasil === 'benar' ? n : nhi, K.ease(K.seg(q, .4, 1)));
      if (i === g.length - 1 || q < 1) { c.save(); c.strokeStyle = K.C.teal; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(L), y); c.lineTo(X(Math.max(H, L + .01)), y); c.stroke(); c.restore(); }
      const col = hasil === 'benar' ? K.C.lime : hasil === 'kecil' ? K.C.sky : K.C.coral; const pa = K.out(K.seg(q, 0, .3));
      c.save(); c.globalAlpha = pa; c.fillStyle = col; c.beginPath(); c.arc(X(n), y - 70 - (i % 3) * 70, 34, 0, 7); c.fill();
      K.text(c, String(n), X(n), y - 68 - (i % 3) * 70, {size: 30, weight: 800, mono: true, align: 'center', color: '#141a2c'}); c.restore();
      if (q >= 1) { lo = nlo; hi = nhi; } });
    if (g.length) { const q = K.seg(t, D - 3, D - 2.4); K.text(c, `Tertebak dalam ${g.length} kali`, 960, 820, {size: 50, weight: 800, align: 'center', color: K.C.lime, alpha: K.out(q)}); }
  },
});
