/* Adegan episode E.6: Pencarian dan Pengurutan. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, alur.js, kartu.js, urut.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Al = K.alur, Kr = K.kartu, U = K.urut, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const LIN = [12, 45, 30, 78, 91, 65, 20, 55], SRT = [20, 40, 60, 65, 80, 85, 90, 95], FIVE = [48, 37, 25, 12, 56];
  const TR = { bubble: U.trace("bubble", FIVE), selection: U.trace("selection", FIVE), insertion: U.trace("insertion", FIVE) };
  const stepAt = (steps, l, t0, per) => steps[clamp(Math.floor((l - t0) / per), 0, steps.length - 1)];
  const sortScene = (ctx, kind, title, l, per, note) => {
    card(ctx, 120, 150, 1680, 740); heading(ctx, title, 215);
    const st = l < 1 ? { a: FIVE, hl: [], done: [], cmp: 0, sw: 0, note: "data awal" } : stepAt(TR[kind], l, 1, per);
    U.cards(ctx, 300, 360, st, { w: 150, h: 130, gap: 20 });
    U.counters(ctx, 1200, 330, st.cmp, st.sw, { swLabel: kind === "insertion" ? "geseran" : "pertukaran" });
    card(ctx, 1200, 460, 500, 70, { fill: C.bg2, r: 12 }); text(ctx, st.note, 1450, 505, 22, { align: "center", weight: 900 });
    if (note) text(ctx, note, 960, 600, 24, { align: "center", weight: 800, color: C.ink2 });
  };

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      card(ctx, 520, 260, 1200, 90, { fill: C.bg2, r: 16 }); text(ctx, "kelas VIII: mencari dan mengurutkan kartu dengan tangan", 1120, 315, 26, { align: "center", weight: 900, color: C.ink2 });
      arrowIcon(ctx, "down", 1120, 385, 26, C.ink2);
      const n = reveal(l, 3.0, 1.4, 3);
      [["🏷️", "beri nama algoritmanya", "linear, biner, bubble, selection, insertion"], ["📜", "tulis pseudocode-nya", "perulangan bersarang"], ["🔢", "pasang penghitung langkah", "bandingkan dengan adil"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 540 + i * 400; card(ctx, x, 420, 370, 240, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, ic, x + 185, 500, 56, { align: "center" }); text(ctx, t, x + 185, 560, 24, { align: "center", weight: 900 }); para(ctx, s, x + 185, 600, 19, 330, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D8.2", "Memecahkan Persoalan dengan Data Kecil"], ["E.5", "Struktur Data Standar"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 30, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_tebak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: TEBAK ANGKA 1–100");
      kid(ctx, 380, 560, 150, { hair: "long" }); bubble(ctx, 300, 390, 260, "Angkaku: 37", 24, { tailX: 380 });
      kid(ctx, 1540, 560, 150, { point: true });
      const n = reveal(l, 3, 1.3, 6);
      card(ctx, 600, 300, 400, 400, { fill: C.badBg, stroke: C.bad, lw: 3, r: 16 }); text(ctx, "BABAK 1: dari 1, 2, 3, …", 800, 340, 22, { align: "center", weight: 900, color: C.bad });
      ["1? lebih besar", "2? lebih besar", "3? lebih besar", "…", "36? lebih besar", "37! (37 tebakan)"].forEach((s, i) => { if (i < n) text(ctx, s, 640, 390 + i * 48, 22, { weight: 800 }); });
      card(ctx, 1040, 300, 400, 400, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 }); text(ctx, "BABAK 2: selalu tengah", 1240, 340, 22, { align: "center", weight: 900, color: C.good });
      ["50? lebih kecil", "25? lebih besar", "37! (3 tebakan)"].forEach((s, i) => { if (i < n - 3) text(ctx, s, 1080, 390 + i * 48, 22, { weight: 800 }); });
      if (n >= 6) label(ctx, "hitung tebakanmu di tiap babak", 960, 740, { size: 24 });
    },
    unplugged_hasil(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PALING BANYAK TUJUH TEBAKAN", 215);
      const n = reveal(l, 1.5, 1.0, 8);
      [100, 50, 25, 13, 7, 4, 2, 1].forEach((v, i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 250 + i * 190; card(ctx, x, 330, 160, 110, { fill: i === 7 ? C.goodBg : "#fff", stroke: i === 7 ? C.good : "#B7C4CC", lw: 3, r: 12 }); text(ctx, String(v), x + 80, 400, 40, { align: "center", weight: 900 }); text(ctx, i === 0 ? "sisa angka" : "÷2", x + 80, 470, 18, { align: "center", weight: 800, color: C.ink2 }); if (i < 7) arrowIcon(ctx, "right", x + 175, 385, 20, C.ink2); ctx.restore(); });
      if (n >= 8) { label(ctx, "7 kali membelah dua: 100 → 1", 960, 560); card(ctx, 460, 610, 1000, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "syaratnya satu: angkanya terurut", 960, 660, 28, { align: "center", weight: 900, color: C.accentDark }); }
    },

    linear(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LINEAR SEARCH: SATU PER SATU", 215);
      const steps = U.linear(LIN, 65); const st = l < 1.5 ? { a: LIN, hl: [], cmp: 0, note: "cari 65" } : stepAt(steps, l, 1.5, 1.1);
      U.cards(ctx, 260, 330, st, { w: 150, h: 130, gap: 20 });
      Kr.counter(ctx, 1500, 560, st.cmp, "langkah", {}); card(ctx, 260, 560, 700, 70, { fill: C.bg2, r: 12 }); text(ctx, st.note, 610, 605, 24, { align: "center", weight: 900, color: st.found ? C.good : C.ink });
      if (l > 10) label(ctx, "kalau tidak ada: baru tahu setelah 8 langkah", 960, 710, { size: 24, color: C.ink2 });
    },
    biner(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BINARY SEARCH: BELAH DUA (DATA URUT)", 215);
      const steps = U.binary(SRT, 65); const st = l < 1.5 ? { a: SRT, hl: [], cmp: 0, note: "cari 65 · array sudah urut" } : stepAt(steps, l, 1.5, 3.2);
      U.cards(ctx, 260, 330, st, { w: 150, h: 130, gap: 20 });
      if (st.lo != null) { if (st.lo === st.hi) text(ctx, "kiri = kanan", 260 + st.lo * 170 + 75, 310, 18, { align: "center", weight: 900, color: C.kiko }); else { text(ctx, "kiri", 260 + st.lo * 170 + 75, 310, 18, { align: "center", weight: 900, color: C.kiko }); text(ctx, "kanan", 260 + st.hi * 170 + 75, 310, 18, { align: "center", weight: 900, color: C.kiko }); } }
      Kr.counter(ctx, 1500, 560, st.cmp, "langkah", {}); card(ctx, 260, 560, 900, 70, { fill: C.bg2, r: 12 }); text(ctx, st.note, 710, 605, 24, { align: "center", weight: 900, color: st.found ? C.good : C.ink });
      if (l > 11) label(ctx, "3 langkah, bukan 6", 960, 710, { color: C.good });
    },
    banding_cari(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAKIN BESAR DATANYA, MAKIN JAUH BEDANYA", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      U.table(ctx, 360, 280, [360, 420, 420], ["banyak data", "linear (terburuk)", "biner (terburuk)"], [["8", "8", "3"], ["1.000", "1.000", "10"], ["1.000.000", "1.000.000", "20"], ["1 miliar", "1 miliar", "30"]], { n, rh: 70, hlRow: n - 1 });
      if (n >= 4) label(ctx, "biner: tiap langkah membuang setengah", 960, 700);
    },
    pseudo_cari(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PSEUDOCODE BINARY SEARCH", 215);
      const n = reveal(l, 1.0, 1.4, 7);
      Al.pseudo(ctx, 220, 250, 900, [{ t: "kiri ← 1, kanan ← n" }, { t: "SELAMA kiri ≤ kanan:" }, { t: "tengah ← (kiri + kanan) / 2, dibulatkan ke atas", ind: 1 }, { t: "JIKA data[tengah] = target MAKA ketemu, berhenti", ind: 1 }, { t: "JIKA target < data[tengah] MAKA kanan ← tengah − 1", ind: 1 }, { t: "LAINNYA kiri ← tengah + 1", ind: 1 }, { t: "tidak ketemu" }].map((p, i) => ({ ...p, hl: i === n - 1, t: i < n ? p.t : "" })), { rh: 56, size: 22 });
      if (n >= 7) { const steps = U.binary(SRT, 65); card(ctx, 1180, 260, 540, 400, { fill: C.bg2, r: 14 }); text(ctx, "pelacakan: cari 65", 1450, 300, 20, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "kiri · kanan · tengah · data", 1450, 340, 18, { align: "center", weight: 800, color: C.ink2 }); steps.forEach((s, i) => { const mid = Math.ceil((s.lo + s.hi) / 2); text(ctx, `${s.lo + 1} · ${s.hi + 1} · ${mid + 1} · ${SRT[mid]}` + (s.found ? " ✓" : ""), 1450, 400 + i * 50, 26, { align: "center", weight: 900, color: s.found ? C.good : C.ink }); }); }
    },

    bubble(ctx, b, l) { sortScene(ctx, "bubble", "BUBBLE SORT: TUKAR TETANGGA, YANG TERBESAR MENGENDAP", l, 0.75, l > 14 ? "4 putaran · 10 perbandingan · 6 pertukaran" : ""); },
    selection(ctx, b, l) { sortScene(ctx, "selection", "SELECTION SORT: PILIH YANG TERKECIL, TUKAR KE DEPAN", l, 0.8, l > 14 ? "10 perbandingan · hanya 2 pertukaran" : ""); },
    insertion(ctx, b, l) { sortScene(ctx, "insertion", "INSERTION SORT: SISIPKAN KE BAGIAN YANG SUDAH URUT", l, 0.75, l > 14 ? "7 perbandingan · 6 geseran" : ""); },
    banding_urut(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LIMA KARTU YANG SAMA, TIGA ALGORITMA", 215);
      Kr.row(ctx, 560, 260, FIVE, { w: 140, h: 60, gap: 16 });
      const n = reveal(l, 1.5, 2.4, 3);
      U.table(ctx, 360, 350, [360, 420, 420], ["algoritma", "perbandingan", "tukar / geser"], [["Bubble", "10", "6"], ["Selection", "10", "2"], ["Insertion", "7", "6"]], { n, rh: 70, hlRow: n - 1 });
      if (l > 10) { card(ctx, 360, 650, 1200, 70, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "10 kartu? sekitar 4× langkahnya: pertumbuhan kuadrat", 960, 695, 24, { align: "center", weight: 900, color: C.accentDark }); }
    },
    pseudo_urut(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PSEUDOCODE BUBBLE SORT: DUA PERULANGAN BERSARANG", 215);
      const n = reveal(l, 1.0, 1.6, 4);
      Al.pseudo(ctx, 220, 250, 900, [{ t: "UNTUK i dari 1 sampai n − 1:" }, { t: "UNTUK j dari 1 sampai n − i:", ind: 1 }, { t: "JIKA data[j] > data[j+1] MAKA", ind: 2 }, { t: "tukar data[j] dan data[j+1]", ind: 3 }].map((p, i) => ({ ...p, hl: i === n - 1, t: i < n ? p.t : "" })), { rh: 60, size: 26 });
      if (l > 8) { const st = stepAt(TR.bubble, l, 8, 0.6); U.cards(ctx, 1180, 300, st, { w: 90, h: 80, gap: 10, index: false }); text(ctx, st.cmp + " perbandingan", 1420, 440, 22, { align: "center", weight: 900, color: C.accentDark }); }
      if (l > 10) { card(ctx, 1180, 500, 520, 160, { fill: C.bg2, r: 14 }); text(ctx, "perulangan luar × perulangan dalam", 1440, 545, 22, { align: "center", weight: 900 }); text(ctx, "≈ n × n / 2 perbandingan", 1440, 585, 24, { align: "center", weight: 900, color: C.kiko }); text(ctx, "tumbuh kuadrat", 1440, 625, 20, { align: "center", weight: 800, color: C.ink2 }); }
    },
    skala(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SKALA: n × n / 2", 215);
      const n = reveal(l, 1.5, 2.4, 3);
      U.table(ctx, 300, 280, [320, 480], ["banyak data", "perbandingan (≈)"], [["10", "50"], ["100", "5.000"], ["1.000.000", "500.000.000.000"]], { n, rh: 70, hlRow: n - 1 });
      // kurva
      card(ctx, 1160, 280, 540, 380, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); ctx.strokeStyle = C.ink2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1200, 620); ctx.lineTo(1660, 620); ctx.moveTo(1200, 620); ctx.lineTo(1200, 310); ctx.stroke();
      ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40; const x = 1200 + u * 440, y = 620 - u * u * 290; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); text(ctx, "n²", 1600, 360, 24, { weight: 900, color: C.bad });
      ctx.strokeStyle = C.good; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40; const x = 1200 + u * 440, y = 620 - Math.log2(1 + u * 63) / 6 * 120; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); text(ctx, "n log n", 1600, 480, 22, { weight: 900, color: C.good });
      text(ctx, "banyak data →", 1430, 650, 18, { align: "center", weight: 800, color: C.ink2 });
      if (n >= 3) label(ctx, "data besar butuh algoritma lebih cerdas: cerita kelas XI", 960, 720, { size: 24 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Visualisator", "pilih algoritma, tekan Langkah", (x, y) => { U.cards(ctx, x - 200, y - 80, { a: [37, 12, 25], hl: [0, 1], done: [], cmp: 3, sw: 1 }, { w: 110, h: 90, gap: 10, index: false }); text(ctx, "3 perbandingan · 1 pertukaran", x, y + 70, 20, { align: "center", weight: 900, color: C.accentDark }); }],
        ["Lomba tiga algoritma", "data acak vs hampir urut", (x, y) => [["Bubble", "10 · 6"], ["Selection", "10 · 2"], ["Insertion", "7 · 6"]].forEach(([t, v], i) => { card(ctx, x - 190, y - 90 + i * 60, 380, 50, { fill: i === 2 ? C.goodBg : "#fff", stroke: i === 2 ? C.good : "#B7C4CC", lw: 2, r: 10 }); text(ctx, t, x - 170, y - 57 + i * 60, 22, { weight: 900 }); text(ctx, v, x + 170, y - 57 + i * 60, 22, { align: "right", weight: 900, color: C.ink2 }); })],
        ["Tebak langkah biner", "target mana, berapa langkah?", (x, y) => { U.cards(ctx, x - 215, y - 70, { a: [20, 40, 60, 65, 80], hl: [2], lo: 0, hi: 4 }, { w: 78, h: 70, gap: 8, index: false }); text(ctx, "cari 80: tengah 60 → ?", x, y + 60, 20, { align: "center", weight: 900, color: C.kiko }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — tebak dulu siapa yang menang, lalu buktikan", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
