/* Adegan episode F11.6: Strategi Algoritmik dan Alternatif Solusi. Gaya diagram Fase F.
   Muat setelah kiko-core.js, kiko-devices.js, kartu.js, urut.js, py.js, strategi.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Kt = K.kartu, U = K.urut, Py = K.py, St = K.strategi, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const COMBOS6 = [{ c: [1, 1, 1, 1, 1, 1] }, { c: [3, 1, 1, 1] }, { c: [4, 1, 1] }, { c: [3, 3] }];
  const GUESS = [[1, 100, 50], [51, 100, 75], [51, 74, 62], [63, 74, 68], [63, 67, 65], [66, 67, 66], [67, 67, 67]]; // rahasia 67
  const SUM_FRAMES = [{ call: "jumlah([2, 5, 3])", ret: "10" }, { call: "jumlah([5, 3])", ret: "8" }, { call: "jumlah([3])", ret: "3" }, { call: "jumlah([])", ret: "0" }];
  const SUM_PY = [{ t: "def jumlah(daftar):" }, { t: "    if daftar == []:" }, { t: "        return 0" }, { t: "    return daftar[0] + jumlah(daftar[1:])" }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 260, 560, 160, 0, { mood: "think" });
      const n = reveal(l, 1.5, 1.6, 4);
      [["🧱", "brute force", "coba semua kemungkinan"], ["🤑", "greedy", "ambil terbesar dulu"], ["✂️", "divide and conquer", "pecah menjadi bagian serupa"], ["🔁", "rekursi", "fungsi memanggil dirinya"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 500 + i * 320; card(ctx, x, 280, 300, 300, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 150, 380, 60, { align: "center" }); para(ctx, t, x + 150, 445, 26, 270, { align: "center", weight: 900 }); para(ctx, s, x + 150, 515, 20, 260, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) banner(ctx, "satu persoalan, banyak jalan: pilih dengan alasan", 640, 1000);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.3", "Algoritma Standar dalam Kode dan Kualitas Program"], ["F11.2", "Dari Pseudocode ke Kode"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_koin(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU: KEMBALIAN 6 DENGAN KOIN 1, 3, 4", 215);
      const n = reveal(l, 1.5, 1.8, 7);
      text(ctx, "koin kertas:", 240, 300, 24, { weight: 900, color: C.ink2 }); St.coins(ctx, 400, 262, [1, 3, 4], { r: 34 });
      card(ctx, 240, 360, 680, 300, { fill: C.bg2, r: 16 }); text(ctx, "cara 1: ambil terbesar yang muat", 264, 400, 24, { weight: 900, color: C.kiko });
      if (n >= 2) { St.coins(ctx, 264, 420, [4, 1, 1].slice(0, Math.min(3, n - 1)), { r: 30 }); text(ctx, ["sisa 6", "sisa 2", "sisa 1", "sisa 0 · 3 koin"][Math.min(3, n - 1)], 264, 540, 22, { weight: 800, color: C.ink2 }); }
      ctx.save(); if (n < 5) ctx.globalAlpha = 0.2; card(ctx, 960, 360, 720, 300, { fill: C.bg2, r: 16 }); text(ctx, "cara 2: tulis semua kombinasi", 984, 400, 24, { weight: 900, color: "#8E6BBF" }); St.combos(ctx, 984, 420, 670, COMBOS6, n >= 6 ? 4 : n >= 5 ? 2 : 0, { best: n >= 7 ? 3 : null, rh: 56 }); ctx.restore();
      if (n >= 7) label(ctx, "3 koin lawan 2 koin: cara cepat tidak selalu cara terbaik", 960, 710, { size: 26 });
    },
    unplugged_tebak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TEBAK ANGKA 1–100: URUT ATAU TENGAH?", 215);
      const n = reveal(l, 1.5, 1.5, 9);
      text(ctx, "cara 1: tebak urut dari 1", 240, 300, 24, { weight: 900, color: C.bad }); St.range(ctx, 260, 340, 1000, 100, 1, 100, Math.min(67, Math.max(1, (n - 1) * 10)), { secret: 67, color: "#FDE2E0" }); Kt.counter(ctx, 1400, 290, Math.min(67, Math.max(0, (n - 1) * 10)), "tebakan");
      ctx.save(); if (n < 3) ctx.globalAlpha = 0.25; text(ctx, "cara 2: selalu tebak tengah dari sisa", 240, 480, 24, { weight: 900, color: C.good }); const k = clamp(n - 2, 0, GUESS.length); const g = k > 0 ? GUESS[k - 1] : [1, 100, null]; St.range(ctx, 260, 520, 1000, 100, g[0], g[1], g[2], { secret: 67 }); Kt.counter(ctx, 1400, 470, k, "tebakan"); ctx.restore();
      if (n >= 9) label(ctx, "67 tebakan lawan 7 tebakan: membuang separuh tiap langkah", 960, 700, { size: 26 });
    },
    brute_force(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "STRATEGI 1 · BRUTE FORCE: COBA SEMUA KEMUNGKINAN", 215);
      const n = reveal(l, 1.5, 1.6, 7);
      St.combos(ctx, 240, 270, 640, COMBOS6, clamp(n - 1, 0, 4), { best: n >= 6 ? 3 : null, rh: 64 });
      Py.code(ctx, 940, 270, 740, [{ t: "terbaik = None" }, { t: "for a in range(7):        # koin 1" }, { t: "    for b in range(3):    # koin 3" }, { t: "        for c in range(2):# koin 4" }, { t: "            if a + 3*b + 4*c == 6:" }, { t: "                simpan jika lebih sedikit" }], { rh: 40, size: 18 });
      if (n >= 6) { card(ctx, 940, 540, 740, 90, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "✓ pasti menemukan yang terbaik: tidak ada yang terlewat", 1310, 594, 22, { align: "center", weight: 900, color: C.good }); }
      if (n >= 7) label(ctx, "semua jalan dicoba, lalu dipilih", 560, 600, { size: 26 });
    },
    ledakan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "HARGANYA: JUMLAH KEMUNGKINAN MELEDAK", 215);
      const n = reveal(l, 1.5, 2.0, 5);
      U.table(ctx, 240, 270, [560, 420, 420], ["persoalan", "kemungkinan", "rumus"], [["gembok 3 angka", "1.000", "10³"], ["gembok 4 angka", "10.000", "10⁴"], ["urutan 10 kartu", "3.628.800", "10!"]], { rh: 62, n: Math.min(3, Math.max(0, n - 1)), hlRow: Math.min(2, n - 2) });
      if (n >= 4) { ["persoalan kecil", "pembanding untuk mengecek strategi lain"].forEach((s, i) => { card(ctx, 240 + i * 720, 560, 690, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "cocok untuk: " + s, 585 + i * 720, 615, 24, { align: "center", weight: 900, color: C.accentDark }); }); }
      if (n >= 5) label(ctx, "satu angka tambahan: sepuluh kali lebih lama", 960, 720, { size: 26 });
    },
    greedy(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "STRATEGI 2 · GREEDY: AMBIL YANG TERBESAR DULU", 215);
      const n = reveal(l, 1.5, 1.7, 7);
      text(ctx, "koin:", 240, 300, 24, { weight: 900, color: C.ink2 }); St.coins(ctx, 320, 262, [500, 200, 100], { r: 34, gap: 16 });
      text(ctx, "kembalian 800", 960, 300, 28, { weight: 900 });
      const steps = [[500, 300], [200, 100], [100, 0]]; const k = clamp(n - 1, 0, 3);
      steps.forEach(([c, sisa], i) => { ctx.save(); if (i >= k) ctx.globalAlpha = 0.2; card(ctx, 240 + i * 490, 360, 460, 170, { fill: i === k - 1 ? "#FFF3D6" : C.bg2, stroke: i === k - 1 ? C.accent : undefined, lw: 3, r: 14 }); text(ctx, "langkah " + (i + 1) + ": terbesar yang muat", 264 + i * 490, 400, 20, { weight: 900, color: C.ink2 }); St.coins(ctx, 264 + i * 490, 420, [c], { r: 32 }); text(ctx, "sisa " + sisa, 360 + i * 490, 462, 28, { weight: 900 }); ctx.restore(); });
      if (n >= 5) Py.code(ctx, 240, 560, 900, [{ t: "for koin in [500, 200, 100]:" }, { t: "    while sisa >= koin: ambil koin; sisa -= koin" }], { rh: 36, size: 18, title: "" });
      if (n >= 6) { card(ctx, 1180, 560, 500, 110, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "3 koin · cepat · optimal", 1430, 605, 26, { align: "center", weight: 900, color: C.good }); text(ctx, "untuk pecahan rupiah", 1430, 640, 18, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 7) label(ctx, "tanpa menoleh ke belakang", 690, 720, { size: 24 });
    },
    greedy_gagal(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "SAAT GREEDY GAGAL: KOIN 1, 3, 4 UNTUK 6", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      card(ctx, 240, 270, 700, 300, { fill: C.badBg, stroke: C.bad, lw: 3, r: 16 }); text(ctx, "greedy", 264, 310, 26, { weight: 900, color: C.bad }); St.coins(ctx, 264, 330, [4, 1, 1].slice(0, clamp(n - 1, 0, 3)), { r: 34 }); if (n >= 4) text(ctx, "3 koin", 264, 470, 36, { weight: 900, color: C.bad }); if (n >= 2) text(ctx, ["", "ambil 4, sisa 2 (3 tak muat)", "ambil 1, sisa 1", "ambil 1, sisa 0"][clamp(n - 1, 1, 3)], 264, 530, 20, { weight: 800, color: C.ink2 });
      ctx.save(); if (n < 5) ctx.globalAlpha = 0.2; card(ctx, 980, 270, 700, 300, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 }); text(ctx, "brute force", 1004, 310, 26, { weight: 900, color: C.good }); St.coins(ctx, 1004, 330, [3, 3], { r: 34 }); text(ctx, "2 koin", 1004, 470, 36, { weight: 900, color: C.good }); text(ctx, "semua kombinasi dicoba, ini yang paling sedikit", 1004, 530, 20, { weight: 800, color: C.ink2 }); ctx.restore();
      if (n >= 6) banner(ctx, "terbaik saat ini ≠ terbaik seluruhnya: buktikan dulu, atau uji dengan brute force", 620, 1400, { size: 26 });
    },
    divide(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "STRATEGI 3 · DIVIDE AND CONQUER: PECAH DAN SELESAIKAN", 215);
      const n = reveal(l, 1.5, 1.5, 9);
      const k = clamp(n - 1, 0, GUESS.length); const g = k > 0 ? GUESS[k - 1] : [1, 100, null];
      St.range(ctx, 300, 330, 1300, 100, g[0], g[1], g[2], { secret: 67 }); Kt.counter(ctx, 1640, 280, k, "tebakan");
      if (k > 0) text(ctx, "sisa kemungkinan: " + (g[1] - g[0] + 1) + " angka" + (k < 7 ? (67 > g[2] ? " → lebih besar" : " → lebih kecil") : " → ketemu!"), 960, 440, 26, { align: "center", weight: 900, color: k >= 7 ? C.good : C.accentDark });
      [["100", "50", "25", "13", "7", "4", "2", "1"]].forEach(seq => seq.forEach((s, i) => { ctx.save(); if (i > k) ctx.globalAlpha = 0.2; card(ctx, 300 + i * 165, 500, 150, 70, { fill: i === k ? "#FFF3D6" : C.bg2, stroke: i === k ? C.accent : undefined, lw: 3, r: 10 }); text(ctx, s, 375 + i * 165, 546, 28, { align: "center", weight: 900 }); ctx.restore(); }));
      text(ctx, "banyak kemungkinan tiap langkah", 300, 600, 20, { weight: 800, color: C.ink2 });
      if (n >= 9) label(ctx, "100 angka, 7 tebakan: persoalan besar jadi bagian serupa yang kecil", 960, 690, { size: 26 });
    },
    merge(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MERGE SORT: BAGI, URUTKAN TIAP BAGIAN, GABUNGKAN", 215);
      const n = reveal(l, 1.5, 2.2, 6);
      St.mergeTree(ctx, 240, 270, 900, [38, 27, 43, 3], clamp(n - 1, 0, 4));
      [["bagi", "daftar dibelah dua terus sampai satu angka"], ["urutkan", "satu angka sudah urut"], ["gabungkan", "dua daftar urut disatukan: bandingkan kepala, ambil yang kecil"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; card(ctx, 1200, 280 + i * 120, 480, 100, { fill: C.bg2, r: 12 }); text(ctx, (i + 1) + ". " + t, 1224, 318 + i * 120, 24, { weight: 900 }); para(ctx, s, 1224, 350 + i * 120, 17, 440, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) { card(ctx, 1200, 650, 480, 70, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "n log n: jauh lebih cepat dari bubble sort", 1440, 694, 20, { align: "center", weight: 900, color: C.good }); }
    },
    rekursi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "STRATEGI 4 · REKURSI: FUNGSI MEMANGGIL DIRINYA", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      Py.code(ctx, 240, 270, 820, SUM_PY.map((p, i) => ({ ...p, hl: (n === 3 && (i === 1 || i === 2)) || (n === 4 && i === 3) })), { rh: 52, size: 24 });
      if (n >= 2) { card(ctx, 1120, 270, 560, 110, { fill: C.bg2, r: 12 }); text(ctx, "jumlah([2, 5, 3])", 1400, 315, 26, { align: "center", weight: 900, color: C.kiko }); text(ctx, "= 2 + jumlah([5, 3])", 1400, 355, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 3) { card(ctx, 1120, 410, 560, 100, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "kasus dasar: berhenti", 1400, 450, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "daftar kosong → 0", 1400, 485, 20, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 4) { card(ctx, 1120, 530, 560, 100, { fill: "#F4F0FA", stroke: "#8E6BBF", lw: 3, r: 12 }); text(ctx, "kasus rekursif: mengecilkan", 1400, 570, 24, { align: "center", weight: 900, color: "#5B3F8E" }); text(ctx, "persoalan dengan satu elemen lebih sedikit", 1400, 605, 20, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 6) label(ctx, "dua bagian wajib: berhenti dan mengecil", 650, 580, { size: 26 });
    },
    rekursi_lacak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LACAK: BINGKAI BERTUMPUK, LALU TERBUKA LAGI", 215);
      const n = reveal(l, 1.5, 1.5, 10);
      const open = clamp(n, 0, 4), closing = clamp(n - 4, 0, 4);
      St.stack(ctx, 240, 290, 760, SUM_FRAMES, open, { closing });
      text(ctx, ["", "2 + jumlah([5, 3])", "5 + jumlah([3])", "3 + jumlah([])", "kasus dasar: 0", "3 + 0 = 3", "5 + 3 = 8", "2 + 8 = 10", "hasil: 10"][clamp(n, 0, 8)], 1340, 340, 30, { align: "center", weight: 900, color: n >= 8 ? C.good : C.ink });
      if (n >= 9) { card(ctx, 1080, 400, 600, 150, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "⚠ tanpa kasus dasar", 1380, 445, 24, { align: "center", weight: 900, color: C.bad }); para(ctx, "tumpukan bertambah tanpa henti → RecursionError: maximum recursion depth exceeded", 1380, 485, 18, 560, { align: "center", weight: 800 }); }
      if (n >= 10) label(ctx, "kasus dasar ditulis lebih dulu", 1380, 640, { size: 26 });
    },
    justifikasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PILIH DENGAN ALASAN: BENAR? CEPAT? MUDAH?", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      St.table(ctx, 240, 270, [420, 360, 340, 320], [["brute force", "✓", "✕", "✓"], ["greedy", "△ harus dibuktikan", "✓", "✓"], ["divide and conquer", "✓", "✓", "△ lebih rumit"], ["rekursi", "✓ dengan kasus dasar", "△", "△"]], Math.min(4, Math.max(0, n - 1)), { hlRow: n - 2 });
      if (n >= 6) banner(ctx, "tidak ada strategi terbaik untuk semua: ada yang paling cocok untuk persoalanmu", 600, 1300, { size: 26 });
    },
    alternatif(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ALTERNATIF SOLUSI: JADWAL KEGIATAN DI SATU AULA", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      const EV = [["Pentas", 1, 5], ["Rapat", 2, 3], ["Lomba", 4, 6], ["Latihan", 6, 8], ["Nonton", 5, 9]];
      EV.forEach(([nm, s, e], i) => { const picked = n >= 3 && [1, 2, 3].includes(i); ctx.fillStyle = picked ? C.goodBg : n >= 3 ? "#E6EDF2" : C.bg2; rr(ctx, 300 + (s - 1) * 150, 280 + i * 44, (e - s) * 150, 36, 8); ctx.fill(); if (picked) { ctx.strokeStyle = C.good; ctx.lineWidth = 3; rr(ctx, 300 + (s - 1) * 150, 280 + i * 44, (e - s) * 150, 36, 8); ctx.stroke(); } text(ctx, nm + " (" + s + "–" + e + ")", 310 + (s - 1) * 150, 305 + i * 44, 18, { weight: 900, color: picked ? C.good : C.ink }); });
      for (let h = 1; h <= 9; h++) text(ctx, h + ":00", 300 + (h - 1) * 150, 520, 16, { align: "center", weight: 800, color: C.ink2 });
      [["alternatif 1: greedy, selesai paling awal", "pilih Rapat, lalu Lomba, lalu Latihan: 3 kegiatan", "✓ terbukti optimal · cepat", C.good], ["alternatif 2: brute force semua himpunan", "coba 32 kombinasi, pilih terbanyak tanpa tabrakan", "✓ benar · ✕ meledak bila kegiatan banyak", C.ink2]].forEach(([t, s, r, col], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; card(ctx, 240 + i * 740, 560, 700, 130, { fill: i === 0 && n >= 5 ? "#FFF3D6" : C.bg2, stroke: i === 0 && n >= 5 ? C.accent : undefined, lw: 3, r: 14 }); text(ctx, t, 264 + i * 740, 598, 22, { weight: 900 }); text(ctx, s, 264 + i * 740, 630, 18, { weight: 700, color: C.ink2 }); text(ctx, r, 264 + i * 740, 664, 18, { weight: 900, color: col }); ctx.restore(); });
      if (n >= 6) label(ctx, "pilihan + alasan + keterbatasan = justifikasi", 960, 740, { size: 24 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Mesin kembalian", "greedy lawan brute force", (x, y) => { St.coins(ctx, x - 200, y - 110, [1, 3, 4], { r: 26 }); text(ctx, "greedy: 4+1+1 = 3 koin", x - 200, y + 10, 20, { weight: 900, color: C.bad }); text(ctx, "brute force: 3+3 = 2 koin", x - 200, y + 44, 20, { weight: 900, color: C.good }); }],
        ["Tebak angka", "urut lawan tengah, hitung tebakan", (x, y) => { St.range(ctx, x - 200, y - 60, 400, 100, 51, 74, 62, { secret: 67 }); Kt.counter(ctx, x - 60, y + 10, 3, "tebakan"); }],
        ["Pelacak rekursi", "buka dan tutup bingkai", (x, y) => St.stack(ctx, x - 220, y - 130, 440, SUM_FRAMES.slice(0, 3), 3, { closing: 1 })]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 400, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu dua versi kembalian dalam Python dan satu paragraf justifikasi", 960, 820, 24, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
