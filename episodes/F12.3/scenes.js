/* Adegan episode F12.3: Analisis Data untuk Prediksi. Gaya diagram Fase F. Data fiktif (Bank Sampah SMA Tunas).
   Muat setelah kiko-core.js, kiko-devices.js, lembar.js (D8.1), py.js (F11.0), tren.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Lb = K.lembar, Py = K.py, Tr = K.tren, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, rr, clamp, lerp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 665, w = 1100, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 30, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.2; fn(); ctx.restore(); };
  const REG = { a: 17, b: 3, col: C.good }, COBA = { a: 15, b: 3.5, col: C.accent };
  const Y = Tr.DATA.map(d => d[1]);
  const fmt = v => String(v).replace(".", ",").replace("-", "−");

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 290, 560, 170, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 2.2, 4);
      dim(ctx, n >= 1, () => { card(ctx, 520, 250, 1160, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "prediksi = tebakan beralasan dari pola data, bukan ramalan pasti", 1100, 302, 26, { align: "center", weight: 900, color: C.accentDark }); });
      [["📊", "rata-rata", "satu angka tengah"], ["📈", "garis tren", "arah perubahan"], ["📐", "regresi linear", "error paling kecil"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 2, () => { const x = 520 + i * 395; card(ctx, x, 370, 370, 260, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 185, 460, 56, { align: "center" }); text(ctx, t, x + 185, 530, 30, { align: "center", weight: 900 }); text(ctx, s, x + 185, 575, 20, { align: "center", weight: 800, color: C.ink2 }); }));
      if (n >= 4) label(ctx, "lalu: memakainya dengan hati-hati", 1100, 700, { size: 26 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE SEBELUMNYA", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.5", "Data Terbuka untuk Keputusan"], ["F12.0", "Jembatan Kelas XII: list dan fungsi Python"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_benang(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: BENANG DI KERTAS BERPETAK");
      const n = reveal(l, 2.0, 3.0, 4);
      // kertas berpetak
      card(ctx, 260, 260, 860, 460, { fill: "#FFFDF5", stroke: "#E0B04B", lw: 3, r: 10 }); ctx.strokeStyle = "#F0E2B8"; ctx.lineWidth = 1.5; for (let gx = 280; gx < 1110; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, 270); ctx.lineTo(gx, 710); ctx.stroke(); } for (let gy = 280; gy < 710; gy += 30) { ctx.beginPath(); ctx.moveTo(270, gy); ctx.lineTo(1110, gy); ctx.stroke(); }
      const px = v => 300 + v * 110, py = v => 700 - v * 9;
      Tr.DATA.slice(0, n >= 1 ? 6 : 0).forEach(([x, y]) => { ctx.beginPath(); ctx.arc(px(x), py(y), 11, 0, Math.PI * 2); ctx.fillStyle = C.kiko; ctx.fill(); });
      if (n >= 2) { const t = clamp((l - 8) / 6, 0, 1); const a = lerp(28, 17, t), bb = lerp(1, 3, t); ctx.strokeStyle = "#C0392B"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px(0.3), py(a + bb * 0.3)); ctx.lineTo(px(7.2), py(a + bb * 7.2)); ctx.stroke(); ctx.fillStyle = "#C0392B"; [0.3, 7.2].forEach(v => { ctx.beginPath(); ctx.arc(px(v), py(a + bb * v), 7, 0, Math.PI * 2); ctx.fill(); }); }
      text(ctx, "bulan →", 1100, 745, 18, { align: "right", weight: 800, color: C.ink2 }); text(ctx, "kg ↑", 250, 255, 18, { align: "right", weight: 800, color: C.ink2 });
      kid(ctx, 1330, 560, 110, { point: true }); kid(ctx, 1580, 560, 110, { hair: "long" });
      if (n >= 3) label(ctx, "benang lurus yang paling pas", 1460, 330, { size: 26 });
    },
    unplugged_ukur(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "UKUR JARAK TEGAK: ITULAH ERROR");
      const n = reveal(l, 2.0, 2.6, 5);
      Tr.plot(ctx, 340, 300, 720, 380, { line: { a: 17, b: 3, col: "#C0392B", lw: 3 }, errs: n >= 1 ? "label" : false, ymin: 10, ymax: 45, xmax: 7, n: 6 });
      [["Kelompok 1", "total jarak 9 kotak", false], ["Kelompok 2", "total jarak 6 kotak", false], ["Kelompok 3", "total jarak 4 kotak", true]].forEach(([t, s, win], i) => dim(ctx, n >= i + 2, () => { card(ctx, 1220, 290 + i * 120, 480, 100, { fill: win && n >= 5 ? C.goodBg : C.bg2, stroke: win && n >= 5 ? C.good : undefined, lw: 3, r: 14 }); text(ctx, t, 1250, 332 + i * 120, 26, { weight: 900 }); text(ctx, s + (win && n >= 5 ? "  🏆" : ""), 1250, 368 + i * 120, 22, { weight: 800, color: C.ink2 }); }));
      if (n >= 5) label(ctx, "terbaik: paling dekat dengan semua titik", 1460, 690, { size: 24, color: C.good });
    },
    rata_rata(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "RATA-RATA TIDAK MELIHAT ARAH");
      const k = reveal(l, 1.5, 1.6, 8);
      const rows = [["bulan", "kg"], ...Tr.DATA.slice(0, Math.min(k, 6)).map(([x, y]) => [x, y])];
      Lb.sheet(ctx, 220, 270, rows, { cw: 130, rh: 46, cols: 2 });
      Tr.plot(ctx, 820, 290, 820, 370, { n: Math.min(k, 6), mean: k >= 7 ? 27.5 : null, values: true });
      if (k >= 7) { card(ctx, 220, 640, 380, 64, { fill: "#F4F0FA", stroke: "#8E6BBF", lw: 3, r: 12 }); text(ctx, "rata-rata = 165 ÷ 6 = 27,5", 410, 682, 22, { align: "center", weight: 900, color: "#8E6BBF" }); }
      if (k >= 8) label(ctx, "tetapi datanya terus naik", 410, 742, { size: 24, color: C.good });
    },
    kenaikan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TREN: RATA-RATA KENAIKAN PER BULAN");
      const n = reveal(l, 2.0, 2.6, 5);
      const g = Tr.plot(ctx, 300, 290, 820, 370, { values: true, pred: n >= 4 ? { x: 7, y: 38 } : null });
      if (n >= 1) { const d = Y.slice(1).map((v, i) => v - Y[i]); d.forEach((v, i) => text(ctx, "+" + v, (g.px(i + 1) + g.px(i + 2)) / 2, g.py((Y[i] + Y[i + 1]) / 2) + 34, 18, { align: "center", weight: 900, color: C.good })); }
      dim(ctx, n >= 2, () => { card(ctx, 1260, 290, 450, 210, { fill: C.bg2, r: 16 }); text(ctx, "35 − 20 = 15", 1485, 350, 30, { align: "center", weight: 900 }); text(ctx, "dalam 5 langkah", 1485, 395, 22, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "15 ÷ 5 = 3 kg/bulan", 1485, 460, 30, { align: "center", weight: 900, color: C.good }); });
      dim(ctx, n >= 4, () => { card(ctx, 1260, 530, 450, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "bulan 7: 35 + 3 = 38", 1485, 602, 30, { align: "center", weight: 900, color: C.accentDark }); });
    },
    garis_tren(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "GARIS TREN: y = a + b·x");
      const n = reveal(l, 1.5, 3.2, 5);
      const g = Tr.plot(ctx, 300, 290, 820, 370, { line: n >= 1 ? COBA : null, errs: n >= 4 ? "label" : false });
      if (n >= 2) { const x1 = 2, x2 = 3; const A = [g.px(x1), g.py(15 + 3.5 * x1)], B2 = [g.px(x2), g.py(15 + 3.5 * x1)], Cc = [g.px(x2), g.py(15 + 3.5 * x2)]; ctx.strokeStyle = C.accentDark; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B2); ctx.lineTo(...Cc); ctx.stroke(); text(ctx, "b = 3,5", B2[0] + 14, (B2[1] + Cc[1]) / 2 + 7, 20, { weight: 900, color: C.accentDark }); }
      if (n >= 3) { ctx.beginPath(); ctx.arc(g.px(0), g.py(15), 11, 0, Math.PI * 2); ctx.fillStyle = C.accent; ctx.fill(); text(ctx, "a = 15", g.px(0) + 18, g.py(15) + 30, 20, { weight: 900, color: C.accentDark }); }
      [["y = 15 + 3,5x", "contoh garis coba-coba", C.accent], ["b: kemiringan", "kenaikan tiap bulan", C.accentDark], ["a: titik awal", "nilai saat x = 0", C.accentDark], ["error = asli − garis", "hijau positif, merah negatif", C.ink]].forEach(([t, s, col], i) => dim(ctx, n >= i + 1, () => { card(ctx, 1260, 280 + i * 110, 450, 94, { fill: C.bg2, r: 14 }); text(ctx, t, 1290, 320 + i * 110, 26, { weight: 900, color: col }); text(ctx, s, 1290, 354 + i * 110, 19, { weight: 800, color: C.ink2 }); }));
    },
    kuadrat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KUADRATKAN ERROR, LALU JUMLAHKAN");
      const n = reveal(l, 1.5, 3.4, 5); const L = n >= 4 ? REG : COBA;
      Tr.plot(ctx, 300, 290, 720, 330, { line: L, squares: n >= 2, errs: "label" });
      const es = Tr.DATA.map(([x, y]) => y - L.a - L.b * x);
      card(ctx, 1150, 270, 560, 300, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 });
      text(ctx, L === REG ? "y = 17 + 3x" : "y = 15 + 3,5x", 1430, 310, 24, { align: "center", weight: 900, color: L.col });
      text(ctx, "error: " + es.map(e => (e > 0 ? "+" : "") + fmt(+e.toFixed(1))).join("  "), 1430, 360, 20, { align: "center", weight: 800 });
      text(ctx, "jumlah error: " + fmt(+es.reduce((a, c) => a + c, 0).toFixed(2)), 1430, 410, 22, { align: "center", weight: 900, color: C.ink2 });
      dim(ctx, n >= 2, () => text(ctx, "jumlah kuadrat error: " + fmt(+Tr.sse(L.a, L.b).toFixed(2)), 1430, 460, 24, { align: "center", weight: 900, color: C.accentDark }));
      dim(ctx, n >= 1, () => text(ctx, "plus dan minus saling menghapus!", 1430, 530, 20, { align: "center", weight: 900, color: C.bad }));
      if (n >= 3) Tr.bars(ctx, 1150, 590, 560, [["y = 15 + 3,5x", 8.75, false], ["y = 17 + 3x", 4, n >= 4]], { max: 9, rh: 54 });
      if (n >= 5) label(ctx, "regresi linear: y = 17 + 3x", 660, 742, { size: 26, color: C.good });
    },
    lembar_kerja(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DI LEMBAR KERJA");
      const n = reveal(l, 1.5, 3.0, 6);
      const rows = [["bulan", "kg"], ...Tr.DATA];
      Lb.sheet(ctx, 220, 340, rows, { cw: 120, rh: 46, cols: 2, hl: n >= 1 ? { A2: "#E5F1F6", B2: "#E5F1F6", A3: "#E5F1F6", B3: "#E5F1F6", A4: "#E5F1F6", B4: "#E5F1F6", A5: "#E5F1F6", B5: "#E5F1F6", A6: "#E5F1F6", B6: "#E5F1F6", A7: "#E5F1F6", B7: "#E5F1F6" } : null });
      const f = n >= 6 ? ["D2", "=FORECAST(7; B2:B7; A2:A7)", "38"] : n >= 5 ? ["D2", "=INTERCEPT(B2:B7; A2:A7)", "17"] : n >= 4 ? ["D2", "=SLOPE(B2:B7; A2:A7)", "3"] : null;
      if (f) { Lb.formulaBar(ctx, 220, 260, 1480, f[0], f[1]); card(ctx, 560, 340, 300, 120, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "hasil: " + f[2], 710, 412, 34, { align: "center", weight: 900, color: C.good }); }
      dim(ctx, n >= 2, () => Tr.plot(ctx, 1000, 380, 620, 260, { line: n >= 3 ? { a: 17, b: 3, col: C.good, lw: 4 } : null, small: true }));
      if (n >= 3) text(ctx, "garis tren di diagram titik", 1310, 330, 22, { align: "center", weight: 900, color: C.good });
      text(ctx, "pemisah argumen: titik koma (pengaturan Indonesia) atau koma (pengaturan Inggris)", 560, 720, 18, { weight: 800, color: C.ink2 });
    },
    prediksi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PREDIKSI BULAN KE-7");
      const n = reveal(l, 1.5, 3.0, 5);
      const outlier = n >= 3; const data = outlier ? Tr.DATA.slice(0, 5).concat([[6, 41]]) : Tr.DATA;
      Tr.plot(ctx, 300, 290, 760, 370, { data, line: outlier ? { a: 15, b: 3.857, col: C.good } : { a: 17, b: 3, col: C.good, upto: 6 }, lines: n >= 1 && !outlier ? [{ a: 17, b: 3, col: C.good, dash: true }] : [], pred: n >= 1 ? (outlier ? { x: 7, y: 42 } : { x: 7, y: 38 }) : null, hl: outlier ? 5 : null, values: outlier });
      dim(ctx, n >= 1, () => { card(ctx, 1200, 280, 510, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "17 + 3 × 7 = 38 kg", 1455, 348, 32, { align: "center", weight: 900, color: C.accentDark }); });
      dim(ctx, n >= 3, () => { card(ctx, 1200, 420, 510, 270, { fill: C.bg2, r: 16 }); text(ctx, "andaikan bulan 6 salah ketik: 41", 1455, 465, 22, { align: "center", weight: 900, color: C.bad }); text(ctx, "awal–akhir: 41 + 4,2 = 45,2", 1455, 530, 24, { align: "center", weight: 900 }); text(ctx, "regresi: 42", 1455, 585, 28, { align: "center", weight: 900, color: C.good }); text(ctx, "semua titik ikut menahan garis", 1455, 645, 20, { align: "center", weight: 800, color: C.ink2 }); });
    },
    python_regresi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "REGRESI LINEAR DI PYTHON");
      const n = reveal(l, 1.5, 3.0, 5);
      Py.code(ctx, 220, 260, 960, [{ t: "from statistics import linear_regression", hl: n === 1 }, { t: "bulan = [1, 2, 3, 4, 5, 6]", hl: n === 2 }, { t: "sampah = [20, 24, 25, 28, 33, 35]", hl: n === 2 }, { t: "slope, intercept = linear_regression(bulan, sampah)", hl: n === 3 }, { t: "print(slope, intercept)", hl: n === 3 }, { t: "print(intercept + slope * 7)", hl: n >= 4 }], { rh: 50, size: 22 });
      Py.console(ctx, 220, 620, 960, [...(n >= 3 ? [["3.0 17.0", "out"]] : []), ...(n >= 4 ? [["38.0", "out"]] : [])]);
      dim(ctx, n >= 3, () => { card(ctx, 1240, 270, 470, 200, { fill: C.bg2, r: 16 }); text(ctx, "slope = b = 3.0", 1475, 335, 28, { align: "center", weight: 900 }); text(ctx, "intercept = a = 17.0", 1475, 390, 28, { align: "center", weight: 900 }); text(ctx, "Python memakai titik desimal", 1475, 440, 18, { align: "center", weight: 800, color: C.ink2 }); });
      if (n >= 5) label(ctx, "modul bawaan Python 3.10 ke atas", 1475, 540, { size: 22, color: C.ink2 });
    },
    python_error(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MEMERIKSA ERROR DENGAN PERULANGAN");
      const n = reveal(l, 1.5, 3.0, 5);
      Py.code(ctx, 220, 260, 900, [{ t: "total = 0" }, { t: "for i in range(len(bulan)):", hl: n === 1 }, { t: "    garis = intercept + slope * bulan[i]", hl: n === 1 }, { t: "    e = sampah[i] - garis", hl: n === 2 }, { t: "    total = total + e * e", hl: n === 2 }, { t: "print(total)", hl: n >= 3 }], { rh: 48, size: 22 });
      if (n >= 3) Py.console(ctx, 220, 600, 900, [["4.0", "out"]]);
      dim(ctx, n >= 4, () => { text(ctx, "jumlah kuadrat error", 1200, 290, 22, { weight: 900, color: C.ink2 }); Tr.bars(ctx, 1200, 310, 520, [["17 + 3x", 4, true], ["15 + 3,5x", 8.75], ["20 + 2,5x", 17.75], ["rata-rata 27,5", 161.5]], { rh: 70 }); });
      if (n >= 5) label(ctx, "regresi: paling kecil", 1460, 640, { size: 26, color: C.good });
    },
    hati_hati(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "HATI-HATI SAAT MEMPREDIKSI");
      const n = reveal(l, 1.5, 4.5, 3);
      [["🔭", "terlalu jauh", "2 tahun ke depan? tren bisa berubah: libur, aturan baru", (x, y) => { ctx.save(); ctx.translate(x - 200, y); ctx.strokeStyle = C.good; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 90); ctx.lineTo(160, 40); ctx.stroke(); ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(160, 40); ctx.lineTo(400, -20); ctx.stroke(); ctx.fillStyle = "rgba(217,68,59,0.12)"; ctx.beginPath(); ctx.moveTo(160, 40); ctx.lineTo(400, -60); ctx.lineTo(400, 60); ctx.closePath(); ctx.fill(); ctx.restore(); }],
        ["✏️", "salah ketik", "satu data aneh menarik garis; periksa data dulu", (x, y) => { ctx.save(); ctx.translate(x - 180, y); [[0, 80], [60, 66], [120, 60], [180, 46], [240, 36], [300, -40]].forEach(([px, py], i) => { ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fillStyle = i === 5 ? C.bad : C.kiko; ctx.fill(); }); ctx.restore(); }],
        ["🔗", "naik bersama ≠ menyebabkan", "jualan es dan setoran sampah sama-sama naik saat kemarau", (x, y) => { text(ctx, "🍧 ↗   ♻️ ↗", x, y + 50, 40, { align: "center" }); text(ctx, "penyebab lain: cuaca panas", x, y + 100, 18, { align: "center", weight: 800, color: C.ink2 }); }]].forEach(([ic, t, s, draw], i) => dim(ctx, n >= i + 1, () => { const x = 230 + i * 500; card(ctx, x, 270, 460, 440, { fill: C.bg2, r: 18 }); text(ctx, ic + " " + t, x + 230, 320, 26, { align: "center", weight: 900 }); para(ctx, s, x + 230, 365, 20, 400, { align: "center", weight: 800, color: C.ink2 }); draw(x + 230, 520); }));
    },
    keputusan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DARI PREDIKSI KE KEPUTUSAN");
      const n = reveal(l, 1.5, 3.4, 4);
      const g = Tr.plot(ctx, 300, 300, 720, 340, { line: REG, pred: { x: 7, y: 38 } });
      ctx.fillStyle = "rgba(242,177,52,0.25)"; ctx.fillRect(g.px(7) - 18, g.py(40), 36, g.py(36) - g.py(40)); text(ctx, "rentang 36–40", g.px(7) - 26, g.py(36) + 30, 20, { weight: 900, color: C.accentDark });
      [["prediksi", "± 38 kg (kira-kira 36–40 kg)", "#FFF3D6", C.accentDark], ["keputusan", "siapkan karung tambahan", C.goodBg, C.good], ["batasan", "data baru 6 bulan; bisa berubah", C.bg2, C.ink2]].forEach(([t, s, bg, col], i) => dim(ctx, n >= i + 1, () => { card(ctx, 1150, 280 + i * 140, 560, 120, { fill: bg, r: 16 }); text(ctx, t, 1180, 328 + i * 140, 24, { weight: 900, color: col }); text(ctx, s, 1180, 370 + i * 140, 24, { weight: 900 }); }));
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Penggeser garis tren", "geser a dan b, error mengecil", (x, y) => { ctx.save(); ctx.translate(x - 190, y - 140); ctx.scale(0.42, 0.42); Tr.plot(ctx, 80, 40, 760, 360, { line: COBA, squares: true }); ctx.restore(); }],
        ["Kalkulator prediksi", "a + b × bulan", (x, y) => [["a = 17, b = 3", "bulan 9?"], ["a = 12, b = 2", "bulan 5?"], ["a = 40, b = −1,5", "bulan 6?"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 20, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 20, { align: "right", weight: 900, color: C.kiko }); })],
        ["Detektif prediksi", "temukan klaim menyesatkan", (x, y) => [["terlalu jauh", "🔭"], ["salah ketik", "✏️"], ["sebab-akibat?", "🔗"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 24, { align: "right" }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 270, 500, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 320, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 332, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 332, 24, { weight: 900 }); text(ctx, t2, x - 160, 366, 19, { weight: 700, color: C.ink2 }); draw(x, 530); });
      text(ctx, "lalu di komputer: data terbuka daerahmu, garis tren di lembar kerja dan Python, satu keputusan", 960, 725, 24, { align: "center", color: C.ink2, weight: 800 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
