/* Adegan episode D8.3: Flowchart dan Pseudocode Dasar. Muat setelah kiko-core.js, kiko-devices.js, alur.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.alur, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const TEA = ["siapkan gelas", "masukkan teh", "tuang air panas", "tambah gula", "aduk"];
  // flowchart teh: kolom vertikal
  function teaFlow(ctx, x, y, opt = {}) {
    const gap = opt.gap || 78; const nodes = []; let cy = y;
    nodes.push(Q.node(ctx, "term", x, cy, 200, 50, "MULAI", { hl: opt.hl === 0, dim: opt.n != null && 0 >= opt.n })); cy += gap;
    TEA.forEach((t, i) => { nodes.push(Q.node(ctx, "proc", x, cy, 300, 52, t, { hl: opt.hl === i + 1, dim: opt.n != null && i + 1 >= opt.n })); cy += gap; });
    nodes.push(Q.node(ctx, "term", x, cy, 200, 50, "SELESAI", { hl: opt.hl === 6, dim: opt.n != null && 6 >= opt.n }));
    for (let i = 0; i < nodes.length - 1; i++) { if (opt.n == null || i + 1 < opt.n) Q.arrow(ctx, [nodes[i].bottom, nodes[i + 1].top], {}); }
    return nodes;
  }
  // flowchart nilai: mulai -> baca nilai -> nilai > 70? -> ya: cetak lulus / tidak: cetak remedi -> selesai
  function gradeFlow(ctx, x, y, opt = {}) {
    const a = Q.node(ctx, "term", x, y, 200, 50, "MULAI", { hl: opt.hl === "mulai" });
    const b = Q.node(ctx, "io", x, y + 90, 260, 52, "baca nilai", { hl: opt.hl === "baca" });
    const c = Q.node(ctx, "dec", x, y + 210, 300, 110, "nilai > 70?", { hl: opt.hl === "dec" });
    const d1 = Q.node(ctx, "io", x - 240, y + 350, 220, 52, "cetak LULUS", { hl: opt.hl === "lulus" });
    const d2 = Q.node(ctx, "io", x + 240, y + 350, 220, 52, "cetak REMEDI", { hl: opt.hl === "remedi" });
    const e = Q.node(ctx, "term", x, y + 470, 200, 50, "SELESAI", { hl: opt.hl === "selesai" });
    Q.arrow(ctx, [a.bottom, b.top], { on: opt.on === "ab" }); Q.arrow(ctx, [b.bottom, c.top], { on: opt.on === "bc" });
    Q.arrow(ctx, [c.left, [x - 240, y + 210], d1.top], { label: "ya", dy: -12, on: opt.on === "ya" }); Q.arrow(ctx, [c.right, [x + 240, y + 210], d2.top], { label: "tidak", dy: -12, on: opt.on === "tidak" });
    Q.arrow(ctx, [d1.bottom, [x - 240, y + 470], e.left], { on: opt.on === "e1" }); Q.arrow(ctx, [d2.bottom, [x + 240, y + 470], e.right], { on: opt.on === "e2" });
    return { a, b, c, d1, d2, e };
  }
  const PATH_YES = x => y => [[x, y], [x, y + 90], [x, y + 210], [x - 150, y + 210], [x - 240, y + 210], [x - 240, y + 350], [x - 240, y + 470], [x - 100, y + 470]];
  const PATH_NO = x => y => [[x, y], [x, y + 90], [x, y + 210], [x + 150, y + 210], [x + 240, y + 210], [x + 240, y + 350], [x + 240, y + 470], [x + 100, y + 470]];
  const GRADE_PSEUDO = v => [{ t: "baca nilai" }, { t: "JIKA nilai > 70 MAKA" }, { t: "cetak LULUS", ind: 1 }, { t: "LAINNYA" }, { t: "cetak REMEDI", ind: 1 }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      card(ctx, 600, 230, 560, 580, { fill: C.bg2 }); text(ctx, "FLOWCHART", 880, 290, 28, { align: "center", weight: 900, color: C.accentDark });
      const m = Q.node(ctx, "term", 880, 350, 160, 44, "MULAI"); const p = Q.node(ctx, "proc", 880, 440, 240, 48, "lihat langit"); const d = Q.node(ctx, "dec", 880, 560, 240, 90, "hujan?"); Q.arrow(ctx, [m.bottom, p.top]); Q.arrow(ctx, [p.bottom, d.top]); Q.arrow(ctx, [d.left, [700, 560], [700, 680]], { label: "ya" }); Q.arrow(ctx, [d.right, [1060, 560], [1060, 680]], { label: "tidak" }); Q.node(ctx, "proc", 700, 720, 180, 48, "bawa payung", { size: 20 }); Q.node(ctx, "proc", 1060, 720, 180, 48, "tanpa payung", { size: 20 });
      card(ctx, 1200, 230, 560, 580, { fill: C.bg2 }); text(ctx, "PSEUDOCODE", 1480, 290, 28, { align: "center", weight: 900, color: C.accentDark });
      Q.pseudo(ctx, 1230, 330, 500, [{ t: "lihat langit" }, { t: "JIKA hujan MAKA" }, { t: "bawa payung", ind: 1 }, { t: "LAINNYA" }, { t: "tanpa payung", ind: 1 }], { title: "", size: 24, rh: 46 });
      if (l > 6) bubble(ctx, 170, 330, 320, "dua bahasa, satu cerita", 28, { tailX: 330, tailDir: 0 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D8.0", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Jembatan Kelas VIII: Empat Jurus dan Instruksi", 960, 500, 44, { align: "center", weight: 700, color: C.ink2 });
      ["Perintah terbatas", "Pseudocode bernomor", "Tebak, jalankan"].forEach((s, i) => { card(ctx, 420 + i * 380, 580, 340, 120, { fill: C.bg2 }); text(ctx, s, 590 + i * 380, 652, 28, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_cards(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const shuffled = ["tambah gula", "siapkan gelas", "aduk", "tuang air panas", "masukkan teh"];
      shuffled.forEach((t, i) => Q.stepCard(ctx, 230 + i * 300, 300 + ((i * 37) % 3) * 20, 260, 110, null, t, {}));
      if (l > 4) { kid(ctx, 500, 650, 130, { point: true }); bubble(ctx, 580, 520, 420, "tehnya dulu atau airnya dulu?", 26, { tailX: 600, tailDir: 20, fill: C.badBg, stroke: C.bad, color: C.bad }); }
      if (l > 7) banner(ctx, "dua susunan masuk akal = langkah belum jelas", 745, 1000, { fill: C.badBg, stroke: C.bad, color: C.bad, size: 30 });
    },
    unplugged_arrows(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.5, 0.7, 5);
      TEA.forEach((t, i) => { if (i < n) { Q.stepCard(ctx, 700, 220 + i * 110, 520, 80, i + 1, t, {}); if (i) Q.arrow(ctx, [[960, 220 + (i - 1) * 110 + 80], [960, 220 + i * 110]], { on: true }); } });
      if (n >= 5) { label(ctx, "panah: urutannya tidak bisa salah baca", 1500, 480, { size: 26 }); label(ctx, "benih flowchart", 1500, 530, { size: 30, color: C.good }); }
    },

    shapes(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "LIMA BENTUK FLOWCHART", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.3, 5);
      const items = [["term", "MULAI / SELESAI", "oval", 160, 50], ["proc", "proses", "kotak: pekerjaan", 180, 56], ["io", "input / output", "jajar genjang", 200, 56], ["dec", "keputusan?", "belah ketupat: ya/tidak", 200, 100]];
      items.forEach(([k, lab, desc, w, h], i) => { if (i < n) { const x = 330 + i * 330; card(ctx, x - 150, 290, 300, 300, { fill: C.bg2 }); Q.node(ctx, k, x, 400, w, h, lab, { size: 20 }); text(ctx, desc, x, 550, 22, { align: "center", weight: 800, color: C.ink2 }); } });
      if (n >= 5) { card(ctx, 1500, 290, 260, 300, { fill: C.bg2 }); Q.arrow(ctx, [[1630, 340], [1630, 470]], { on: true }); text(ctx, "panah: arah", 1630, 550, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 5) banner(ctx, "bentuknya bercerita, panahnya mengarahkan", 745, 900);
    },
    flow_tea(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 0.8, 7);
      teaFlow(ctx, 600, 210, { n, hl: n - 1, gap: 92 });
      if (n >= 7) { label(ctx, "satu kotak = satu pekerjaan", 1300, 400, { size: 28 }); label(ctx, "panah ke bawah: tidak ada yang tertukar", 1300, 450, { size: 26, color: C.good }); }
    },

    pseudo_tea(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 1.0, 0.9, 5);
      teaFlow(ctx, 480, 210, { gap: 92 });
      Q.pseudo(ctx, 900, 230, 700, TEA.slice(0, n).map((t, i) => ({ t, hl: i === n - 1 })), { rh: 60, size: 28 });
      if (n >= 5) label(ctx, "cerita yang sama, bahasa yang berbeda", 1250, 680, { size: 26, color: C.ink2 });
    },
    pseudo_rules(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ATURAN PSEUDOCODE", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.2, 3);
      [["satu baris, satu pekerjaan"], ["kata kerja di depan"], ["tanpa kata basa-basi"]].forEach(([t], i) => { if (i < n) { card(ctx, 200 + i * 540, 290, 480, 100, { fill: C.goodBg, stroke: C.good, lw: 4, r: 14 }); text(ctx, "✓ " + t, 440 + i * 540, 352, 28, { align: "center", weight: 900, color: C.good }); } });
      if (l > 4.5) { Q.pseudo(ctx, 240, 430, 680, [{ t: "tolong tuangkan airnya ya", bad: true }], { title: "✕ bukan begini", rh: 60, size: 28 }); Q.pseudo(ctx, 1000, 430, 680, [{ t: "tuang air panas", good: true }], { title: "✓ begini", rh: 60, size: 28 }); }
      if (l > 7) banner(ctx, "flowchart dan pseudocode: dua bahasa, satu cerita", 745, 1000, { size: 30 });
    },

    branch_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 400, 540, 170, { hair: "long" }); text(ctx, "Sinta", 400, 780, 26, { align: "center", weight: 800, color: C.ink2 });
      if (l > 1) bubble(ctx, 480, 330, 360, "Hujan tidak, ya?", 30, { tailX: 500, tailDir: 20 });
      const n = reveal(l, 2.5, 1.5, 2);
      if (n >= 1) { card(ctx, 900, 280, 380, 240, { fill: "#DCEBF2", stroke: C.kiko, lw: 4 }); text(ctx, "🌧️", 1090, 380, 70, { align: "center" }); text(ctx, "hujan → bawa payung", 1090, 470, 24, { align: "center", weight: 900 }); }
      if (n >= 2) { card(ctx, 1320, 280, 380, 240, { fill: "#FFF9E0", stroke: C.accent, lw: 4 }); text(ctx, "☀️", 1510, 380, 70, { align: "center" }); text(ctx, "tidak → tanpa payung", 1510, 470, 24, { align: "center", weight: 900 }); }
      if (l > 6.5) banner(ctx, "dua jalan = PERCABANGAN", 745, 800);
    },
    branch_flow(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.5, 1.0, 6);
      const x = 960; const m = Q.node(ctx, "term", x, 210, 200, 50, "MULAI", {}); const p = Q.node(ctx, "proc", x, 300, 260, 52, "lihat langit", {});
      Q.arrow(ctx, [m.bottom, p.top]);
      if (n >= 2) { const d = Q.node(ctx, "dec", x, 420, 300, 110, "hujan?", { hl: n === 2 }); Q.arrow(ctx, [p.bottom, d.top]); if (n >= 3) { const y1 = Q.node(ctx, "proc", x - 300, 560, 240, 52, "bawa payung", {}); Q.arrow(ctx, [d.left, [x - 300, 420], y1.top], { label: "ya", dy: -12, on: n === 3 }); if (n >= 4) { const y2 = Q.node(ctx, "proc", x + 300, 560, 240, 52, "tanpa payung", {}); Q.arrow(ctx, [d.right, [x + 300, 420], y2.top], { label: "tidak", dy: -12, on: n === 4 }); if (n >= 5) { const e = Q.node(ctx, "proc", x, 680, 240, 52, "berangkat", { hl: n === 5 }); Q.arrow(ctx, [y1.bottom, [x - 300, 680], e.left]); Q.arrow(ctx, [y2.bottom, [x + 300, 680], e.right]); } } } }
      if (n >= 6) { label(ctx, "belah ketupat: pertanyaan", 400, 440, { size: 26 }); label(ctx, "dua panah keluar: ya, tidak", 400, 490, { size: 24, color: C.ink2 }); label(ctx, "bertemu lagi di sini", 1500, 700, { size: 24, color: C.good }); }
    },
    branch_pseudo(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 1.0, 5);
      const lines = [{ t: "lihat langit" }, { t: "JIKA hujan MAKA" }, { t: "bawa payung", ind: 1 }, { t: "LAINNYA" }, { t: "tanpa payung", ind: 1 }, { t: "berangkat" }];
      Q.pseudo(ctx, 240, 220, 760, lines.slice(0, Math.max(1, n + 1)).map((ln, i) => ({ ...ln, hl: i === n })), { rh: 62, size: 30 });
      if (n >= 3) { ["JIKA", "MAKA", "LAINNYA"].forEach((k, i) => { card(ctx, 1100, 260 + i * 110, 600, 90, { fill: C.bg2 }); text(ctx, k, 1140, 318 + i * 110, 34, { weight: 900, color: C.kiko }); text(ctx, ["kondisi: ya atau tidak", "jalan bila ya", "jalan bila tidak"][i], 1330, 318 + i * 110, 26, { weight: 700, color: C.ink2 }); }); }
      if (l > 7) banner(ctx, "kondisi harus bisa dijawab ya atau tidak", 745, 900);
    },

    token_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const f = gradeFlow(ctx, 760, 210, {});
      const u = clamp((l - 1.0) / 6, 0, 1); const pos = Q.along(PATH_YES(760)(210).slice(0, 4), u); Q.token(ctx, pos[0], pos[1], {});
      card(ctx, 1240, 300, 460, 200, { fill: C.bg2 }); Q.token(ctx, 1290, 350, { r: 14 }); text(ctx, "token berjalan mengikuti panah", 1320, 358, 24, { weight: 800 }); text(ctx, "di belah ketupat: baca kondisi,", 1270, 420, 24, { weight: 700, color: C.ink2 }); text(ctx, "lalu pilih satu cabang", 1270, 456, 24, { weight: 700, color: C.ink2 });
      if (l > 6) label(ctx, "tebak hasilnya tanpa menjalankan apa pun", 1470, 600, { size: 26, color: C.good });
    },
    token_run(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const path = PATH_YES(760)(210); const u = clamp((l - 0.8) / 7.5, 0, 1); const stage = u < 0.12 ? "mulai" : u < 0.3 ? "baca" : u < 0.5 ? "dec" : u < 0.8 ? "lulus" : "selesai";
      gradeFlow(ctx, 760, 210, { hl: stage, on: u >= 0.3 && u < 0.8 ? "ya" : undefined });
      const pos = Q.along(path, u); Q.token(ctx, pos[0], pos[1], {});
      card(ctx, 1240, 260, 460, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "nilai = 78", 1470, 335, 44, { align: "center", weight: 900 });
      if (u >= 0.3) { card(ctx, 1240, 410, 460, 130, { fill: C.bg2 }); text(ctx, "78 > 70?", 1470, 460, 30, { align: "center", weight: 900 }); text(ctx, "YA → belok ke LULUS", 1470, 510, 28, { align: "center", weight: 900, color: C.good }); }
      if (u >= 0.8) { Q.pseudo(ctx, 1240, 570, 460, [{ t: "output: LULUS", good: true }], { title: "HASIL", rh: 56, size: 28 }); }
    },
    token_run2(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const path = PATH_NO(760)(210); const u = clamp((l - 0.8) / 7.5, 0, 1); const stage = u < 0.12 ? "mulai" : u < 0.3 ? "baca" : u < 0.5 ? "dec" : u < 0.8 ? "remedi" : "selesai";
      gradeFlow(ctx, 760, 210, { hl: stage, on: u >= 0.3 && u < 0.8 ? "tidak" : undefined });
      const pos = Q.along(path, u); Q.token(ctx, pos[0], pos[1], { color: C.bad });
      card(ctx, 1240, 260, 460, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "nilai = 65", 1470, 335, 44, { align: "center", weight: 900 });
      if (u >= 0.3) { card(ctx, 1240, 410, 460, 130, { fill: C.bg2 }); text(ctx, "65 > 70?", 1470, 460, 30, { align: "center", weight: 900 }); text(ctx, "TIDAK → belok ke REMEDI", 1470, 510, 28, { align: "center", weight: 900, color: C.bad }); }
      if (u >= 0.8) { Q.pseudo(ctx, 1240, 570, 460, [{ t: "output: REMEDI", bad: true }], { title: "HASIL", rh: 56, size: 28 }); label(ctx, "satu flowchart, dua jalan, tergantung datanya", 960, 820, { size: 26, color: C.ink2 }); }
    },

    nested(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 0.9, 6);
      const lines = [{ t: "baca nilai" }, { t: "JIKA nilai > 85 MAKA" }, { t: "tulis SANGAT BAIK", ind: 1 }, { t: "LAINNYA JIKA nilai > 70 MAKA" }, { t: "tulis LULUS", ind: 1 }, { t: "LAINNYA" }, { t: "tulis REMEDI", ind: 1 }];
      Q.pseudo(ctx, 240, 210, 820, lines.slice(0, Math.max(1, n + 1)).map((ln, i) => ({ ...ln, hl: i === n })), { rh: 60, size: 28 });
      card(ctx, 1140, 260, 560, 360, { fill: C.bg2 }); text(ctx, "tiga jalan, satu dilewati", 1420, 320, 28, { align: "center", weight: 900 });
      [["> 85", "SANGAT BAIK", C.good], ["71 – 85", "LULUS", C.kiko], ["≤ 70", "REMEDI", C.bad]].forEach(([k, v, c], i) => { card(ctx, 1180, 360 + i * 80, 480, 64, { fill: "#fff", stroke: c, lw: 3, r: 12 }); text(ctx, k, 1220, 402 + i * 80, 26, { weight: 900 }); text(ctx, "→ " + v, 1400, 402 + i * 80, 26, { weight: 900, color: c }); });
      if (n >= 6) banner(ctx, "token tetap hanya lewat satu jalan", 745, 900);
    },
    side_by_side(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      gradeFlow(ctx, 520, 200, {});
      Q.pseudo(ctx, 1000, 230, 700, GRADE_PSEUDO(), { rh: 56, size: 28 });
      if (l > 2) { card(ctx, 1000, 600, 340, 100, { fill: C.bg2 }); text(ctx, "FLOWCHART", 1170, 640, 24, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "enak dibaca sekilas", 1170, 676, 22, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 4) { card(ctx, 1360, 600, 340, 100, { fill: C.bg2 }); text(ctx, "PSEUDOCODE", 1530, 640, 24, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "enak ditulis dan diubah", 1530, 676, 22, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 7) banner(ctx, "dua cara menulis algoritma sebelum menjadi program", 745, 1000, { size: 30 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pasangkan bentuk", "oval, kotak, jajar genjang, belah ketupat", (x, y) => { Q.node(ctx, "proc", x - 100, y - 40, 150, 46, "proses", { size: 20 }); Q.node(ctx, "dec", x + 100, y - 40, 170, 80, "ya/tidak?", { size: 18 }); Q.node(ctx, "io", x, y + 50, 170, 46, "output", { size: 20 }); }],
        ["Jalankan token", "pilih nilainya, tebak jalannya", (x, y) => { const d = Q.node(ctx, "dec", x, y - 40, 200, 90, "nilai > 70?", { size: 20 }); Q.arrow(ctx, [d.left, [x - 170, y - 40], [x - 170, y + 40]], { label: "ya" }); Q.arrow(ctx, [d.right, [x + 170, y - 40], [x + 170, y + 40]], { label: "tidak" }); Q.token(ctx, x, y - 110, {}); }],
        ["Susun pseudocode", "JIKA, MAKA, LAINNYA", (x, y) => Q.pseudo(ctx, x - 200, y - 100, 400, [{ t: "JIKA hujan MAKA" }, { t: "bawa payung", ind: 1 }, { t: "LAINNYA" }], { title: "", rh: 40, size: 20 })]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 630, 26, { align: "center", weight: 900 }); text(ctx, t2, x, 668, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu buat flowchart kegiatanmu dengan satu percabangan", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
