/* Adegan episode F12.2: Memilih Solusi Optimal. Gaya diagram Fase F.
   Muat setelah kiko-core.js, kiko-devices.js, py.js (F11.0), struktur.js (F12.1). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Py = K.py, Sk = K.struktur, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, clamp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 665, w = 1100, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 30, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.2; fn(); ctx.restore(); };
  const KOTA = { A: [300, 480], B: [540, 320], C: [580, 640], D: [860, 470], E: [1090, 610] };
  const JALAN = [["A", "B", 2], ["A", "C", 5], ["B", "C", 2], ["B", "D", 6], ["C", "D", 2], ["C", "E", 7], ["D", "E", 3]];
  const INF = "∞";
  // langkah Dijkstra dari A
  const ST = [
    { done: [], d: { A: 0, B: INF, C: INF, D: INF, E: INF }, via: {}, cur: null },
    { done: ["A"], d: { A: 0, B: 2, C: 5, D: INF, E: INF }, via: { B: "A", C: "A" }, cur: "A" },
    { done: ["A", "B"], d: { A: 0, B: 2, C: 4, D: 8, E: INF }, via: { B: "A", C: "B", D: "B" }, cur: "B", upd: ["C", "D"] },
    { done: ["A", "B", "C"], d: { A: 0, B: 2, C: 4, D: 6, E: 11 }, via: { B: "A", C: "B", D: "C", E: "C" }, cur: "C", upd: ["D", "E"] },
    { done: ["A", "B", "C", "D"], d: { A: 0, B: 2, C: 4, D: 6, E: 9 }, via: { B: "A", C: "B", D: "C", E: "D" }, cur: "D", upd: ["E"] },
    { done: ["A", "B", "C", "D", "E"], d: { A: 0, B: 2, C: 4, D: 6, E: 9 }, via: { B: "A", C: "B", D: "C", E: "D" }, cur: "E" }];
  const viaEdges = st => Object.entries(st.via).filter(([k]) => st.done.includes(k)).map(([k, v]) => [k, v]);
  const drawState = (ctx, st, opt = {}) => Sk.graph(ctx, KOTA, JALAN, { weights: true, tags: st.d, done: st.done.filter(x => x !== st.cur), hlNodes: st.cur ? [st.cur] : [], hlEdges: opt.route || viaEdges(st), r: 46, size: 26 });
  const table = (ctx, x, y, st) => {
    const rh = 58, cw = [90, 140, 140, 150]; const W = cw.reduce((a, b) => a + b); card(ctx, x, y, W, rh * 6, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 12); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    ["kota", "jarak", "dari", "status"].forEach((h, i) => text(ctx, h, x + cw.slice(0, i).reduce((a, b) => a + b, 0) + cw[i] / 2, y + 38, 20, { align: "center", weight: 900, color: C.ink2 }));
    "ABCDE".split("").forEach((k, r) => { const ry = y + rh * (r + 1); const up = (st.upd || []).includes(k), dn = st.done.includes(k); if (k === st.cur) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 2, ry, W - 4, rh); } else if (up) { ctx.fillStyle = "#E5F1F6"; ctx.fillRect(x + 2, ry, W - 4, rh); }
      const vals = [k, String(st.d[k]), st.via[k] || "–", dn ? "pasti ✓" : "sementara"]; vals.forEach((v, i) => text(ctx, v, x + cw.slice(0, i).reduce((a, b) => a + b, 0) + cw[i] / 2, ry + 38, i === 3 ? 18 : 24, { align: "center", weight: 900, color: i === 3 ? (dn ? C.good : C.ink2) : C.ink })); });
  };

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 290, 560, 170, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 2.2, 4);
      dim(ctx, n >= 1, () => { card(ctx, 520, 250, 1160, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "optimal = terbaik menurut satu ukuran: jarak, waktu, atau biaya", 1100, 302, 26, { align: "center", weight: 900, color: C.accentDark }); });
      [["🔁", "brute force", "coba semua kemungkinan"], ["👉", "greedy", "yang terdekat dulu"], ["🧭", "Dijkstra", "pastikan yang terdekat, perbarui"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 2, () => { const x = 520 + i * 395; card(ctx, x, 370, 370, 260, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 185, 460, 56, { align: "center" }); text(ctx, t, x + 185, 530, 30, { align: "center", weight: 900 }); text(ctx, s, x + 185, 575, 20, { align: "center", weight: 800, color: C.ink2 }); }));
      if (n >= 4) label(ctx, "lalu ide yang sama untuk jadwal", 1100, 700, { size: 26 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE SEBELUMNYA", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.6", "Strategi Algoritmik: brute force dan greedy"], ["F12.1", "Struktur Data Kompleks: graph dan dictionary"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_peta(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: PETA KOTA DARI TALI");
      const n = reveal(l, 2.0, 3.0, 4);
      ctx.save(); ctx.translate(-20, 0); Sk.graph(ctx, KOTA, JALAN.slice(0, n >= 2 ? 7 : 0), { weights: n >= 2, r: 46, size: 26 }); ctx.restore();
      text(ctx, "kertas = kota · tali = jalan · label = km", 640, 270, 22, { align: "center", weight: 900, color: C.ink2 });
      if (n >= 3) { kid(ctx, 1330, 540, 100, {}); kid(ctx, 1600, 540, 100, { hair: "long" }); bubble(ctx, 1200, 360, 250, "lewat C saja!", 22); bubble(ctx, 1480, 360, 260, "lewat B lebih dekat!", 22); }
      if (n >= 4) label(ctx, "cari rute terpendek dari A ke E", 1460, 720, { size: 26 });
    },
    unplugged_kartu(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "CARA RAPI: KARTU JARAK SEMENTARA");
      const n = reveal(l, 2.0, 3.0, 4);
      const st = n >= 3 ? ST[1] : { done: [], d: { A: 0, B: "?", C: "?", D: "?", E: "?" }, via: {}, cur: null };
      ctx.save(); ctx.translate(-20, 0); Sk.graph(ctx, KOTA, JALAN, { weights: true, tags: n >= 1 ? st.d : null, done: n >= 3 ? ["A"] : [], r: 46, size: 26 }); ctx.restore();
      [["kartu angka", "jarak sementara dari A", "#FFF9E0"], ["kartu dibalik (hijau)", "jaraknya sudah pasti", C.goodBg], ["semua kelompok", "mendapat jawaban sama", C.bg2]].forEach(([t, s, bg], i) => dim(ctx, n >= i + 2, () => { card(ctx, 1250, 290 + i * 135, 460, 115, { fill: bg, r: 14 }); text(ctx, t, 1280, 338 + i * 135, 26, { weight: 900 }); text(ctx, s, 1280, 375 + i * 135, 20, { weight: 800, color: C.ink2 }); }));
    },
    bobot(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "GRAPH BERBOBOT: TERBAIK MENURUT APA?");
      const n = reveal(l, 1.5, 3.0, 4);
      [["jarak", "km", "📏"], ["waktu", "menit", "⏱️"], ["ongkos", "rupiah", "💰"]].forEach(([t, u, ic], i) => dim(ctx, n >= 1, () => { card(ctx, 230 + i * 300, 270, 270, 120, { fill: C.bg2, r: 14 }); text(ctx, ic + " " + t, 365 + i * 300, 320, 28, { align: "center", weight: 900 }); text(ctx, "bobot dalam " + u, 365 + i * 300, 360, 20, { align: "center", weight: 800, color: C.ink2 }); }));
      dim(ctx, n >= 2, () => { [["rute lewat pasar", "8 km", "35 menit (macet)", C.badBg, C.bad], ["rute lewat lingkar", "12 km", "18 menit", C.goodBg, C.good]].forEach(([t, km, mn, bg, col], i) => { card(ctx, 230, 430 + i * 130, 870, 110, { fill: bg, stroke: col, lw: 3, r: 14 }); text(ctx, t, 260, 478 + i * 130, 26, { weight: 900 }); text(ctx, km + " · " + mn, 260, 518 + i * 130, 22, { weight: 800, color: col }); }); });
      dim(ctx, n >= 3, () => { card(ctx, 1170, 430, 530, 240, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); para(ctx, "terpendek: lewat pasar", 1435, 495, 26, 480, { align: "center", weight: 900 }); para(ctx, "tercepat: lewat lingkar", 1435, 545, 26, 480, { align: "center", weight: 900 }); para(ctx, "tentukan ukurannya dulu", 1435, 620, 26, 480, { align: "center", weight: 900, color: C.accentDark }); });
    },
    greedy_gagal(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BRUTE FORCE MELEDAK, GREEDY BISA TERSESAT");
      const n = reveal(l, 1.5, 3.4, 4);
      dim(ctx, n >= 1, () => { card(ctx, 220, 270, 640, 420, { fill: C.bg2, r: 18 }); text(ctx, "brute force: coba semua rute", 540, 320, 26, { align: "center", weight: 900 });
        text(ctx, "graph lengkap 5 kota", 540, 400, 22, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "16 rute dari A ke E", 540, 445, 32, { align: "center", weight: 900, color: C.good });
        dim(ctx, n >= 2, () => { text(ctx, "graph lengkap 20 kota", 540, 530, 22, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "> 10.000.000.000.000.000", 540, 580, 32, { align: "center", weight: 900, color: C.bad }); text(ctx, "rute dari kota pertama ke terakhir", 540, 620, 18, { align: "center", weight: 800, color: C.ink2 }); }); });
      dim(ctx, n >= 3, () => { const G = { A: [1000, 480], B: [1250, 345], C: [1250, 640], E: [1560, 480] };
        Sk.graph(ctx, G, [["A", "B", 1], ["B", "E", 9], ["A", "C", 3], ["C", "E", 3]], { weights: true, hlEdges: n >= 4 ? [["A", "B"]] : [], hlNodes: n >= 4 ? ["B"] : ["A"], r: 44, size: 26 });
        text(ctx, "greedy: pilih jalan terdekat dulu", 1280, 270, 22, { align: "center", weight: 900, color: C.kiko }); if (n >= 4) text(ctx, "A → B: hanya 1 km… lalu?", 1280, 735, 22, { align: "center", weight: 900, color: C.accentDark }); });
    },
    dijkstra_aturan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ALGORITMA DIJKSTRA: TIGA ATURAN");
      const n = reveal(l, 1.5, 3.4, 4);
      drawState(ctx, ST[0]);
      [["1", "jarak awal: 0 di asal, ∞ di kota lain"], ["2", "ambil kota belum pasti dengan jarak terkecil, tandai pasti"], ["3", "perbarui tetangganya bila lewat kota itu lebih dekat"]].forEach(([k, s], i) => dim(ctx, n >= i + 1, () => { card(ctx, 1220, 280 + i * 140, 500, 120, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1265, 340 + i * 140, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, k, 1265, 349 + i * 140, 26, { align: "center", weight: 900, color: "#fff" }); para(ctx, s, 1305, 330 + i * 140, 22, 390, { weight: 900 }); }));
    },
    dijkstra_langkah(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DIJKSTRA DENGAN TANGAN: DARI A");
      const st = l < 8 ? ST[1] : ST[2];
      ctx.save(); ctx.translate(-60, 0); drawState(ctx, st); ctx.restore();
      table(ctx, 1150, 270, st);
      if (l < 8) label(ctx, "A pasti: B = 0 + 2 = 2, C = 0 + 5 = 5", 640, 745, { size: 24 });
      else label(ctx, "lewat B: C = 2 + 2 = 4 < 5, diperbarui · D = 2 + 6 = 8", 640, 745, { size: 24 });
    },
    dijkstra_tuntas(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DIJKSTRA SAMPAI SELESAI");
      const k = reveal(l, 1.5, 5.0, 3); const st = ST[2 + Math.max(1, k)];
      ctx.save(); ctx.translate(-60, 0); drawState(ctx, st); ctx.restore();
      table(ctx, 1150, 270, st);
      if (k <= 1) label(ctx, "lewat C: D = 4 + 2 = 6 < 8 · E = 4 + 7 = 11", 640, 745, { size: 24 });
      if (k === 2) label(ctx, "lewat D: E = 6 + 3 = 9 < 11, diperbarui", 640, 745, { size: 24 });
      if (k >= 3) label(ctx, "E pasti: 9 km", 640, 745, { size: 26, color: C.good });
    },
    telusur(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TELUSURI RUTENYA: DATANG DARI MANA?");
      const n = reveal(l, 1.5, 1.6, 5); const route = [["D", "E"], ["C", "D"], ["B", "C"], ["A", "B"]].slice(0, Math.min(n, 4));
      ctx.save(); ctx.translate(-60, 0); Sk.graph(ctx, KOTA, JALAN, { weights: true, tags: ST[5].d, done: ["A", "B", "C", "D", "E"], hlEdges: route, r: 46, size: 26 }); ctx.restore();
      const rows = [["E", "D"], ["D", "C"], ["C", "B"], ["B", "A"]];
      rows.forEach(([a, c], i) => dim(ctx, n >= i + 1, () => { card(ctx, 1150, 280 + i * 78, 260, 64, { fill: C.bg2, r: 12 }); text(ctx, a + " datang dari " + c, 1280, 322 + i * 78, 24, { align: "center", weight: 900 }); }));
      if (n >= 5) { card(ctx, 1440, 280, 290, 300, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "baca terbalik", 1585, 330, 22, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "A → B → C", 1585, 400, 30, { align: "center", weight: 900 }); text(ctx, "→ D → E", 1585, 445, 30, { align: "center", weight: 900 }); text(ctx, "9 km", 1585, 520, 40, { align: "center", weight: 900, color: C.good }); }
      if (n >= 5) label(ctx, "trace table menyimpan semua langkah: bisa diperiksa ulang", 1440, 650, { size: 22, color: C.ink2 });
    },
    struktur_rute(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "GRAPH BERBOBOT: DICTIONARY BERISI DICTIONARY");
      const n = reveal(l, 1.5, 3.0, 4);
      Py.code(ctx, 220, 260, 880, [{ t: "graf = {" }, { t: '  "A": {"B": 2, "C": 5},', hl: n >= 2 && n < 4 }, { t: '  "B": {"A": 2, "C": 2, "D": 6},' }, { t: '  "C": {"A": 5, "B": 2, "D": 2, "E": 7},' }, { t: '  "D": {"B": 6, "C": 2, "E": 3},' }, { t: '  "E": {"C": 7, "D": 3}' }, { t: "}" }, { t: 'graf["A"]["C"]   # 5', hl: n >= 3 && n < 4 }], { rh: 44, size: 21 });
      dim(ctx, n >= 2, () => { card(ctx, 1180, 270, 520, 200, { fill: C.bg2, r: 16 }); text(ctx, "dari A:", 1210, 320, 24, { weight: 900, color: C.kiko }); text(ctx, "ke B: 2 km", 1210, 370, 26, { weight: 900 }); text(ctx, "ke C: 5 km", 1210, 420, 26, { weight: 900 }); });
      dim(ctx, n >= 4, () => { card(ctx, 1180, 500, 520, 200, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); para(ctx, "langkah utama Dijkstra:", 1440, 555, 22, 470, { align: "center", weight: 900, color: C.ink2 }); para(ctx, "ambil kota dengan jarak terkecil, berulang-ulang", 1440, 605, 26, 470, { align: "center", weight: 900, color: C.accentDark }); });
    },
    heapq(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PRIORITY QUEUE: YANG TERKECIL KELUAR DULU");
      const n = reveal(l, 1.5, 2.6, 6);
      Py.code(ctx, 220, 260, 780, [{ t: "import heapq" }, { t: "antre = []" }, { t: 'heapq.heappush(antre, (5, "C"))', hl: n === 2 }, { t: 'heapq.heappush(antre, (2, "B"))', hl: n === 2 }, { t: 'heapq.heappush(antre, (8, "D"))', hl: n === 2 }, { t: 'heapq.heappop(antre)   # (2, "B")', hl: n === 3 || n === 4 }], { rh: 46, size: 22 });
      const items = n >= 3 ? [[5, "C"], [8, "D"]] : n >= 2 ? [[2, "B"], [5, "C"], [8, "D"]] : [];
      text(ctx, "priority queue", 1080, 290, 24, { weight: 900, color: C.kiko });
      items.forEach(([d, k], i) => { card(ctx, 1080 + i * 200, 310, 180, 90, { fill: i === 0 ? "#FFF3D6" : "#fff", stroke: i === 0 ? C.accent : "#B7C4CC", lw: 3, r: 12 }); text(ctx, "(" + d + ", " + k + ")", 1170 + i * 200, 365, 28, { align: "center", weight: 900 }); });
      if (n >= 3) { card(ctx, 1080, 430, 300, 80, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "keluar: (2, B)", 1230, 480, 26, { align: "center", weight: 900, color: C.good }); text(ctx, "terkecil, bukan yang pertama masuk", 1400, 545, 20, { weight: 800, color: C.ink2 }); }
      dim(ctx, n >= 5, () => { card(ctx, 220, 600, 1480, 110, { fill: C.bg2, r: 14 }); text(ctx, "library graph:", 250, 645, 22, { weight: 900, color: C.ink2 }); text(ctx, 'networkx.shortest_path(G, "A", "E", weight="weight")', 250, 688, 24, { weight: 900, color: C.kiko }); });
    },
    jadwal(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "JADWAL LAB: SELESAI PALING AWAL DULU");
      const A = [["Rapat OSIS", 13, 14], ["Robotik", 13, 15], ["Remedial", 14, 15.5], ["Desain poster", 15, 16], ["Klub coding", 15.5, 17]];
      const pick = { 0: "ok", 1: "x", 2: "ok", 3: "x", 4: "ok" };
      const k = reveal(l, 3.0, 2.2, 5); const x0 = 560, pw = 260;
      for (let h = 13; h <= 17; h++) { const x = x0 + (h - 13) * pw; ctx.strokeStyle = "#DCE6EC"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 260); ctx.lineTo(x, 690); ctx.stroke(); text(ctx, h + ".00", x, 255, 18, { align: "center", weight: 800, color: C.ink2 }); }
      A.forEach(([nm, s, e], i) => { const y = 290 + i * 82; const st = i < k ? pick[i] : null; text(ctx, nm, 230, y + 42, 24, { weight: 900, color: st === "x" ? "#9AA7AF" : C.ink }); card(ctx, x0 + (s - 13) * pw, y + 8, (e - s) * pw, 54, { fill: st === "ok" ? C.goodBg : st === "x" ? "#F1F3F4" : "#E5F1F6", stroke: st === "ok" ? C.good : st === "x" ? "#C9D1D6" : C.kiko, lw: 3, r: 10 }); if (st) text(ctx, st === "ok" ? "✓ dipilih" : "✕ bentrok", x0 + (s - 13) * pw + 16, y + 44, 20, { weight: 900, color: st === "ok" ? C.good : C.bad }); });
      text(ctx, "urut berdasarkan jam selesai", 230, 275, 18, { weight: 800, color: C.ink2 });
      if (k >= 5) label(ctx, "3 kegiatan: jumlah terbanyak yang mungkin", 960, 735, { size: 26, color: C.good });
    },
    bandingkan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MEMILIH SOLUSI");
      const n = reveal(l, 1.5, 2.6, 6);
      [["📏", "tentukan ukurannya"], ["🔢", "hitung langkahnya"], ["📦", "pikirkan besar datanya"]].forEach(([ic, t], i) => dim(ctx, n >= i + 1, () => { card(ctx, 230 + i * 500, 260, 460, 90, { fill: C.bg2, r: 14 }); text(ctx, ic + "  " + t, 460 + i * 500, 316, 26, { align: "center", weight: 900 }); }));
      [["brute force", "data kecil; pasti benar", "16 rute: oke · 10¹⁶ rute: tidak"], ["Dijkstra", "rute dengan bobot positif", "pastikan terdekat, perbarui tetangga"], ["greedy", "hanya bila terbukti benar", "jadwal: selesai paling awal ✓ · rute: ✕"]].forEach(([t, s, ex], i) => dim(ctx, n >= i + 4, () => { card(ctx, 230, 390 + i * 110, 1460, 96, { fill: i === n - 4 ? "#FFF3D6" : "#fff", stroke: i === n - 4 ? C.accent : "#B7C4CC", lw: 3, r: 14 }); text(ctx, t, 260, 448 + i * 110, 30, { weight: 900, color: C.kiko }); text(ctx, s, 560, 438 + i * 110, 24, { weight: 900 }); text(ctx, ex, 560, 470 + i * 110, 20, { weight: 800, color: C.ink2 }); }));
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Dijkstra langkah demi langkah", "pilih kota, perbarui jarak", (x, y) => { ctx.save(); ctx.translate(x - 190, y - 170); ctx.scale(0.36, 0.36); Sk.graph(ctx, KOTA, JALAN, { weights: true, tags: ST[2].d, done: ["A"], hlNodes: ["B"], r: 46, size: 26 }); ctx.restore(); }],
        ["Penjadwal lab", "lima kegiatan, tanpa bentrok", (x, y) => [["Rapat OSIS", "✓"], ["Robotik", "✕"], ["Remedial", "✓"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: s === "✓" ? C.goodBg : "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 24, { align: "right", weight: 900, color: s === "✓" ? C.good : C.bad }); })],
        ["Pembanding solusi", "empat kasus, pilih caranya", (x, y) => [["rute kurir", "Dijkstra"], ["5 kota", "brute force"], ["jadwal", "greedy"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 22, { align: "right", weight: 900, color: C.kiko }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 270, 480, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 320, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 332, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 332, 22, { weight: 900 }); text(ctx, t2, x - 160, 366, 19, { weight: 700, color: C.ink2 }); draw(x, 530); });
      text(ctx, "lalu di komputer: Dijkstra dengan heapq, ubah satu bobot, tambahkan kota F", 960, 725, 24, { align: "center", color: C.ink2, weight: 800 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
