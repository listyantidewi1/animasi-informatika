/* PG12 Pembahasan Soal Bebras 2018-TW-04 "Peta Harta Karun" (Taiwan), kategori Penegak (SMA).
   Papan tulis: peta 8 × 8 hitam-putih dan catatan quadtree (1 kanan atas, 2 kiri atas, 3 kiri bawah, 4 kanan bawah).
   Catatan diubah kembali menjadi peta di kode dan dibandingkan dengan pilihan A–D; K._warn bila yang cocok bukan hanya B.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Peta Harta Karun", tahun: "2018", negara: "Taiwan", kode: "2018-TW-04", flag: "TW", sumber: "Buku Tantangan Bebras Indonesia 2018", bukaFrasa: "Bebras",
    tingkat: "SMA (Penegak)",
    langkah: ["Pahami nomor bagian: 1 kanan atas, 2 kiri atas, 3 kiri bawah, 4 kanan bawah.", "Baca catatan tingkat demi tingkat sambil mewarnai peta.", "Cari bagian yang mudah diperiksa untuk mencoret pilihan."],
    cta: "Peta mana yang cocok?", gambarUlang: "Peta dan catatan digambar ulang untuk video ini." };

  // ---------- data soal ----------
  // simpul: 0 = persegi putih, 1 = persegi hitam, [b1, b2, b3, b4] = lingkaran (1 kanan atas, 2 kiri atas, 3 kiri bawah, 4 kanan bawah)
  const TREE = [[[0, 0, 1, 0], [0, 0, 0, 1], 1, 1], [[0, 0, 1, 0], [0, 0, 0, 1], 1, 1], [1, [1, 0, 0, 0], 0, [1, 0, 0, 0]], [[0, 1, 0, 0], 1, [0, 1, 0, 0], 0]];
  const EX = [1, [1, 0, 0, 0], 0, [0, 0, [0, 0, 1, 1], 1]];
  const OFF = (k, h) => [[0, h], [0, 0], [h, 0], [h, h]][k];
  // peta sampai kedalaman maksimum dmax (null = belum diketahui)
  function toMap(t, dmax = 9) {
    const g = [...Array(8)].map(() => Array(8).fill(null));
    (function f(n, r, c, s, d) {
      if (Array.isArray(n)) { if (d >= dmax) return; n.forEach((ch, k) => { const [dr, dc] = OFF(k, s / 2); f(ch, r + dr, c + dc, s / 2, d + 1); }); }
      else for (let i = 0; i < s; i++) for (let j = 0; j < s; j++) g[r + i][j + c] = n;
    })(t, 0, 0, 8, 0);
    return g;
  }
  const rows = s => s.map(l => l.split("").map(ch => ch === "#" ? 1 : 0));
  const OPT = {
    A: rows(["...##...", "..####..", "..####..", "########", "########", ".######.", "...##...", "..####.."]),
    B: rows(["........", ".##..##.", "########", "########", ".######.", "..####..", "...##...", "........"]),
    C: rows(["...#....", "..###...", ".#####..", "#######.", ".#####..", "..###...", "...#....", "........"]),
    D: rows(["...##...", "..####..", ".######.", "########", "########", ".######.", "...##...", "..####.."]),
  };
  const FULL = toMap(TREE), same = (a, b) => a.every((r, i) => r.every((v, j) => v === b[i][j]));
  const COCOK = Object.keys(OPT).filter(L => same(FULL, OPT[L])).join("");
  const count = n => Array.isArray(n) ? 1 + n.reduce((s, c) => s + count(c), 0) : 1;
  const ROW23 = Object.keys(OPT).filter(L => [2, 3].every(r => OPT[L][r].every(v => v === 1))).join("");
  if (COCOK !== "B" || count(EX) !== 17 || ROW23 !== "B") (K._warn = K._warn || []).push("data salah: " + COCOK + " " + count(EX) + " " + ROW23);

  // ---------- gambar peta ----------
  function grid(ctx, x, y, cell, g, o = {}) {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = g[r][c]; ctx.fillStyle = v === 1 ? "#1E1E1E" : v === 0 ? "#FFFFFF" : "#E4E8EB"; ctx.fillRect(x + c * cell, y + r * cell, cell, cell); }
    ctx.strokeStyle = "rgba(120,130,140,0.55)"; ctx.lineWidth = 1; for (let k = 0; k <= 8; k++) { ctx.beginPath(); ctx.moveTo(x + k * cell, y); ctx.lineTo(x + k * cell, y + 8 * cell); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y + k * cell); ctx.lineTo(x + 8 * cell, y + k * cell); ctx.stroke(); }
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(x, y, 8 * cell, 8 * cell);
    if (o.split) { ctx.strokeStyle = RED; ctx.lineWidth = Math.max(3, cell * 0.08); ctx.globalAlpha = clamp(o.split, 0, 1); ctx.beginPath(); ctx.moveTo(x + 4 * cell, y); ctx.lineTo(x + 4 * cell, y + 8 * cell); ctx.moveTo(x, y + 4 * cell); ctx.lineTo(x + 8 * cell, y + 4 * cell); ctx.stroke(); ctx.globalAlpha = 1; }
    if (o.nums) [[0, 4], [0, 0], [4, 0], [4, 4]].forEach(([r, c], k) => alpha(ctx, o.nums(k), () => { ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(x + (c + 2) * cell, y + (r + 2) * cell, cell * 0.8, 0, Math.PI * 2); ctx.fill(); text(ctx, String(k + 1), x + (c + 2) * cell, y + (r + 2) * cell + cell * 0.5, cell * 1.4, { align: "center", weight: 900, color: RED }); }));
  }
  // ---------- gambar catatan (quadtree) ----------
  function units(n) { return Array.isArray(n) ? n.reduce((s, c) => s + units(c), 0) + 1.5 : 1; }
  function layout(t, x0, w, ys) {
    const u = w / units(t), out = [];
    (function f(n, left, d, key, parent) {
      const span = units(n) * u, me = { n, x: left + span / 2, y: ys[d], d, key, parent };
      out.push(me);
      if (Array.isArray(n)) { let l = left; n.forEach((ch, k) => { f(ch, l, d + 1, key ? key + "-" + (k + 1) : String(k + 1), me); l += (units(ch) + 0.5) * u; }); }
    })(t, x0, 0, "", null);
    return out;
  }
  function drawTree(ctx, nodes, sz, o = {}) {
    const vis = nd => (o.depth == null || nd.d <= o.depth) ? (o.dA ? o.dA(nd.d) : 1) : 0;
    nodes.forEach(nd => { if (nd.parent && vis(nd) > 0) alpha(ctx, vis(nd), () => { ctx.strokeStyle = "#5A6670"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nd.parent.x, nd.parent.y + sz * 0.5); ctx.lineTo(nd.x, nd.y - sz * 0.5); ctx.stroke(); }); });
    nodes.forEach(nd => { const a = vis(nd); if (a <= 0) return; alpha(ctx, a * (o.dim && o.dim(nd) ? 0.3 : 1), () => {
      if (Array.isArray(nd.n)) { ctx.fillStyle = "#fff"; ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(nd.x, nd.y, sz * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      else { ctx.fillStyle = nd.n ? "#1E1E1E" : "#fff"; ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.fillRect(nd.x - sz * 0.5, nd.y - sz * 0.5, sz, sz); ctx.strokeRect(nd.x - sz * 0.5, nd.y - sz * 0.5, sz, sz); }
      if (o.label && o.label(nd)) text(ctx, nd.key, nd.x, nd.y + sz * 0.5 + 22, 18, { align: "center", weight: 900, color: o.labelCol || ORANGE });
    }); });
  }
  const findN = (nodes, key) => nodes.find(nd => nd.key === key);
  function opts(ctx, x0, dx, y, cell, o = {}) {
    "ABCD".split("").forEach((L, i) => { const x = x0 + i * dx;
      letter(ctx, L, x + 4 * cell, y - 26, 20, false);
      grid(ctx, x, y, cell, OPT[L]);
      if (o.band) alpha(ctx, o.band, () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.strokeRect(x - 6, y + 2 * cell - 3, 8 * cell + 12, 2 * cell + 6); });
      if (o.mark && o.mark(i) > 0) { if (L === "B") ring(ctx, x + 4 * cell, y + 4 * cell, 6 * cell, 6 * cell, o.mark(i), GREEN, 6); else cross(ctx, x + 4 * cell, y + 4 * cell, 7 * cell, o.mark(i), RED, 8); }
    });
  }
  function boat(ctx, x, y) { ctx.fillStyle = "#8C5A3A"; ctx.beginPath(); ctx.moveTo(x - 110, y); ctx.lineTo(x + 110, y); ctx.lineTo(x + 70, y + 60); ctx.lineTo(x - 70, y + 60); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#6B4A2E"; ctx.fillRect(x - 4, y - 150, 8, 150); ctx.fillStyle = "#F4EFE4"; ctx.beginPath(); ctx.moveTo(x + 6, y - 140); ctx.lineTo(x + 90, y - 30); ctx.lineTo(x + 6, y - 30); ctx.fill();
    ctx.strokeStyle = "#3D8BD0"; ctx.lineWidth = 5; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(x - 120 + k * 80, y + 70, 30, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } }

  // ---------- adegan utama ----------
  const PT = layout(TREE, 110, 1590, [180, 250, 325, 395]);
  const PT_EX = layout(EX, 760, 1060, [230, 380, 530, 680]);
  const L2 = [["1-3", "1-4", "2-3", "2-4"], ["3-1", "4-2"], ["3-3", "4-4"]], L2PH = ["Bagian satu-tiga", "tiga-satu", "tiga-tiga"];
  function peta(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "soal1" || id === "soal2") {
      B.beaver(ctx, 300, 520, 300, { hat: "#2A2A2A" });
      alpha(ctx, id === "soal1" ? P(l, at(b, "dipotong"), 0.5) : 1, () => { grid(ctx, 640, 190, 66, toMap(EX)); hand(ctx, "8 × 8 petak", 1460, 300, 52, { color: ORANGE }); });
      if (id === "soal2") { alpha(ctx, P(l, at(b, "terlalu kecil"), 0.5), () => { boat(ctx, 1560, 560); hand(ctx, "kapal kecil", 1560, 720, 40, { color: INK }); });
        alpha(ctx, P(l, at(b, "mencatat"), 0.5), () => { card(ctx, 1290, 380, 140, 100, { fill: "#F6E7C8", stroke: "#8C5A3A", lw: 3, r: 10 }); text(ctx, "catatan", 1360, 440, 26, { align: "center", weight: 900, color: "#8C5A3A" }); }); }
      return;
    }
    if (id === "soal3" || id === "soal4") {
      grid(ctx, 110, 190, 66, toMap(EX), { split: id === "soal4" ? 1 : id === "soal3" ? P(l, at(b, "empat bagian"), 0.5) : 0, nums: id === "soal4" ? k => P(l, at(b, ["Nomor satu", "nomor dua", "nomor tiga", "nomor empat"][k]), 0.4) : null });
      if (id === "soal3") {
        alpha(ctx, P(l, at(b, "Aturan pertama"), 0.5), () => { card(ctx, 760, 190, 1080, 250, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 });
          text(ctx, "Aturan 1: semua petak sama warna", 800, 255, 40, { weight: 900, color: INK });
          [[1, 820], [0, 1000]].forEach(([v, x]) => { ctx.fillStyle = v ? "#1E1E1E" : "#fff"; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.fillRect(x, 300, 90, 90); ctx.strokeRect(x, 300, 90, 90); });
          text(ctx, "→ gambar persegi warna itu", 1130, 360, 38, { weight: 800, color: C.ink2 }); });
        alpha(ctx, P(l, at(b, "Aturan kedua"), 0.5), () => { card(ctx, 760, 470, 1080, 250, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 });
          text(ctx, "Aturan 2: warnanya campur", 800, 535, 40, { weight: 900, color: INK });
          ctx.fillStyle = "#fff"; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(865, 625, 45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          text(ctx, "→ gambar lingkaran, lalu bagi 4", 950, 640, 38, { weight: 800, color: C.ink2 }); });
      } else {
        const x = 1100, y = 210, s = 440;
        [[0, 1, "1", "kanan atas"], [0, 0, "2", "kiri atas"], [1, 0, "3", "kiri bawah"], [1, 1, "4", "kanan bawah"]].forEach(([r, c, nn, lab], k) => alpha(ctx, P(l, at(b, ["Nomor satu", "nomor dua", "nomor tiga", "nomor empat"][k]), 0.4), () => {
          ctx.fillStyle = "#FFF4DE"; ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.fillRect(x + c * s / 2, y + r * s / 2, s / 2, s / 2); ctx.strokeRect(x + c * s / 2, y + r * s / 2, s / 2, s / 2);
          text(ctx, nn, x + c * s / 2 + s / 4, y + r * s / 2 + s / 4 + 10, 80, { align: "center", weight: 900, color: RED }); text(ctx, lab, x + c * s / 2 + s / 4, y + r * s / 2 + s / 4 + 60, 28, { align: "center", weight: 800, color: INK }); }));
        hand(ctx, "diulang sampai semua tercatat", 1320, 735, 40, { color: ORANGE, alpha: P(l, at(b, "diulang"), 0.5) });
      }
      return;
    }
    if (id === "soal5") {
      drawTree(ctx, PT, 24, { dA: d => P(l, 0.3 + d * 0.5, 0.5) });
      ["8 × 8", "4 × 4", "2 × 2", "1 × 1"].forEach((s, d) => text(ctx, s, 1845, [180, 250, 325, 395][d] + 8, 24, { align: "right", weight: 900, color: C.ink2 }));
      alpha(ctx, P(l, at(b, "Pilihannya"), 0.5), () => opts(ctx, 290, 380, 520, 32));
      hand(ctx, "Peta mana yang cocok?", 960, 475, 40, { color: INK, alpha: P(l, at(b, "Pertanyaannya"), 0.5) });
      return;
    }
    if (id === "e1" || id === "e2" || id === "e3") {
      const dmax = id === "e1" ? 0 : id === "e2" ? 1 : 3;
      grid(ctx, 110, 190, 66, toMap(EX), { split: 1, nums: () => 1 });
      drawTree(ctx, PT_EX, 34, { depth: dmax, dA: d => id === "e1" ? P(l, at(b, "lingkaran"), 0.5) : id === "e2" ? (d < 1 ? 1 : P(l, at(b, "Bagian satu"), 0.5)) : (d < 2 ? 1 : P(l, at(b, "sampai ukurannya") + (d - 2) * 0.8, 0.5)), label: nd => nd.d === 1, labelCol: RED });
      if (id === "e3") alpha(ctx, P(l, at(b, "Enam puluh"), 0.5), () => { card(ctx, 1240, 700, 590, 100, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "64 petak → 17 tanda", 1535, 765, 44, { align: "center", weight: 900, color: GREEN }); });
      return;
    }
    // membaca catatan bajak laut
    const order = ["r1", "r2", "r3", "j1", "j2", "j3", "j4", "c2"], n = order.indexOf(id), from = k => n >= order.indexOf(k);
    const tL2 = k => id === "r2" ? at(b, L2PH[k]) : from("r3") ? -9 : 1e9;
    const known = {}; L2.forEach((g, k) => g.forEach(key => known[key] = P(l, tL2(k) + 0.6, 0.4)));
    const t1 = id === "j3" ? at(b, "warnai sisanya") : from("j4") ? -9 : 1e9;
    drawTree(ctx, PT, 24, { label: nd => nd.d === 2 && !Array.isArray(nd.n) && known[nd.key] > 0, dim: nd => id === "c2" ? false : nd.d === 3 && !(P(l, t1, 0.5) > 0) });
    ["8 × 8", "4 × 4", "2 × 2", "1 × 1"].forEach((s, d) => text(ctx, s, 1845, [180, 250, 325, 395][d] + 8, 24, { align: "right", weight: 900, color: C.ink2 }));
    if (id === "r1") { ring(ctx, PT[0].x, PT[0].y, 26, 26, P(l, at(b, "paling atas"), 0.5), ORANGE, 5); PT.filter(nd => nd.d === 1).forEach((nd, k) => ring(ctx, nd.x, nd.y, 26, 26, P(l, at(b, "keempatnya") + k * 0.2, 0.5), ORANGE, 5)); }
    if (id === "r3" || id === "j1") L2[0].forEach(key => { const nd = findN(PT, key); ring(ctx, nd.x, nd.y, 24, 24, 1, RED, 4); });
    if (id === "c2") { alpha(ctx, 1, () => { hand(ctx, "quadtree = pohon empat cabang", 960, 520, 60, { color: ORANGE }); }); alpha(ctx, P(l, at(b, "dicatat satu kali"), 0.5), () => { card(ctx, 560, 600, 800, 110, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "contoh tadi: 64 petak → 17 tanda", 960, 670, 44, { align: "center", weight: 900, color: GREEN }); }); return; }
    // peta kerja
    const g = toMap(TREE, 2), work = [...Array(8)].map(() => Array(8).fill(null));
    // tingkat 2 × 2 yang sudah dibaca
    const leaf2 = PT.filter(nd => nd.d === 2 && !Array.isArray(nd.n));
    leaf2.forEach(nd => { if (known[nd.key] > 0.5) { const [a, bq] = nd.key.split("-").map(Number); const [r0, c0] = OFF(a - 1, 4), [r1, c1] = OFF(bq - 1, 2); for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) work[r0 + r1 + i][c0 + c1 + j] = nd.n; } });
    if (P(l, t1, 0.5) > 0) { const full = FULL; const frac = clamp((l - t1) / 3, 0, 1), cells = []; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (work[r][c] === null) cells.push([r, c]); cells.forEach(([r, c], k) => { if (k / cells.length < frac) work[r][c] = full[r][c]; }); }
    grid(ctx, 120, 455, 38, work, { split: 0 });
    if (id === "r1") text(ctx, "peta kosong", 440, 625, 28, { weight: 800, color: C.ink2 });
    if (id === "j1" || id === "j2") alpha(ctx, id === "j1" ? P(l, at(b, "baris ketiga"), 0.5) : 1, () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.strokeRect(112, 455 + 76 - 4, 320, 84); text(ctx, "baris 3–4", 444, 455 + 125, 30, { weight: 900, color: ORANGE }); });
    opts(ctx, 620, 300, 520, 26, { band: id === "j2" ? P(l, at(b, "periksa pilihannya"), 0.5) : 0, mark: id === "j2" ? i => P(l, at(b, i === 1 ? "Hanya peta B" : "Peta A, C") + (i === 1 ? 0 : i * 0.3), 0.5) : from("j3") ? i => (i === 1 ? 1 : 0) : null });
    if (id === "r3") thinkBadge(ctx, 620, 745, 1180, 80, l, b.hold + 2, "Bagian 1-3, 1-4, 2-3, 2-4 ada di mana?");
    if (id === "j3") alpha(ctx, P(l, at(b, "gambar hati"), 0.5), () => text(ctx, "peta kerja = peta B", 1180, 815, 40, { align: "center", weight: 900, color: GREEN }));
    if (id === "j4") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, 900, 768, 560, 70, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 16 }); text(ctx, "Jawaban: B", 1180, 817, 44, { align: "center", weight: 900, color: GREEN }); });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  const PTV = layout(TREE, 480, 960, [175, 240, 310, 375]);
  function peta_v(ctx, b, l) {
    board(ctx);
    const id = b.id;
    drawTree(ctx, PTV, 16, {});
    if (id === "h2" || id === "h3") L2[0].forEach(key => { const nd = findN(PTV, key); ring(ctx, nd.x, nd.y, 17, 17, id === "h2" ? P(l, at(b, "satu-tiga"), 0.5) : 1, RED, 3); });
    opts(ctx, 500, 245, 500, 24, { band: id === "h2" ? P(l, at(b, "baris ketiga"), 0.5) : id === "h3" ? 1 : 0, mark: id === "h3" ? i => P(l, at(b, "Hanya peta B") + (i === 1 ? 0.6 : 0), 0.5) : null });
    if (id === "h0") {       alpha(ctx, P(l, at(b, "satu kanan"), 0.4), () => text(ctx, "1 kanan atas · 2 kiri atas · 3 kiri bawah · 4 kanan bawah", 960, 760, 28, { align: "center", weight: 900, color: RED }));
      alpha(ctx, P(l, at(b, "persegi"), 0.4), () => text(ctx, "persegi = satu warna   ·   lingkaran = campur", 960, 805, 28, { align: "center", weight: 900, color: INK })); }
    if (id === "h1") thinkBadge(ctx, 610, 745, 700, 80, l, b.hold + 2, "");
    if (id === "h2") alpha(ctx, P(l, at(b, "baris ketiga"), 0.5), () => text(ctx, "baris 3–4 hitam penuh", 960, 790, 40, { align: "center", weight: 900, color: ORANGE }));
    if (id === "h3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: B", 960, 795, 52, { align: "center", weight: 900, color: GREEN }));
  }

  Object.assign(K.SCENES, B.umum(META), { peta, peta_v });
})(typeof window !== "undefined" ? window : globalThis);
