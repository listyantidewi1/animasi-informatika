/* Adegan episode D8.0: Jembatan Kelas VIII. Muat setelah kiko-core.js dan kiko-grid.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, SCENES = K.SCENES, CMD = K.CMD, pose = K.pose;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon, gridGeom, drawGrid, drawRobotOnGrid, drawProgram, runU } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const JURUS = [["Dekomposisi", "pecah jadi bagian kecil"], ["Pola", "cari yang berulang"], ["Abstraksi", "simpan yang penting"], ["Algoritma", "urutkan langkahnya"]];
  const WORLD = { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [2, 2], tables: [] };
  const WORLD_BUG = { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [2, 2], tables: [[0, 2]] };
  const PROG = ["MAJU", "MAJU", "KANAN", "MAJU", "MAJU", "AMBIL"];
  const jurusCard = (ctx, x, y, w, h, i, opt = {}) => { card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 5, r: 16 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 44, y + 44, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 44, y + 54, 26, { align: "center", color: "#fff", weight: 900 }); text(ctx, JURUS[i][0], x + 84, y + 54, 30, { weight: 900 }); text(ctx, JURUS[i][1], x + 24, y + 100, 22, { weight: 700, color: C.ink2 }); };
  const lombaIcons = (ctx, x, y, n = 3) => ["🏃", "🍘", "🪢"].slice(0, n).forEach((e, i) => text(ctx, e, x + i * 170, y, 56, { align: "center" }));
  function robotScene(ctx, world, prog, opt = {}) {
    const g = gridGeom(200, 190, 110, world); drawGrid(ctx, g, world, { hideGoal: opt.p && opt.p.grabbed, highlight: opt.highlight });
    if (opt.p) drawRobotOnGrid(ctx, g, opt.p, world); else drawRobotOnGrid(ctx, g, { x: world.start[0], y: world.start[1], ang: 0, grabbed: false }, world);
    drawProgram(ctx, 900, 230, prog, { title: "Program", rowH: 86, w: 560, active: opt.active, done: opt.done, bad: opt.bad });
    return g;
  }

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      card(ctx, 620, 260, 1100, 180, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "Bukan ulangan.", 1170, 330, 40, { align: "center", weight: 900, color: C.good }); text(ctx, "Kuis diagnostik di halaman latihan: hasilnya hanya untukmu.", 1170, 390, 26, { align: "center", weight: 700, color: C.ink2 });
      if (l > 3) { [["D7.1", "Empat Jurus"], ["D7.5", "Instruksi untuk Mesin"]].forEach(([c, t], i) => { card(ctx, 700 + i * 520, 500, 460, 180, { fill: C.bg2 }); text(ctx, "tonton ulang " + c + "?", 930 + i * 520, 570, 28, { align: "center", weight: 900 }); text(ctx, t, 930 + i * 520, 620, 26, { align: "center", weight: 700, color: C.ink2 }); }); label(ctx, "peta belajarmu akan menjawabnya", 1170, 760, { size: 26, color: C.ink2 }); }
    },
    unplugged(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Lomba 17 Agustus · 100 murid", 960, 300, 36, { align: "center", weight: 900 });
      lombaIcons(ctx, 790, 400);
      ["balap karung", "makan kerupuk", "tarik tambang"].forEach((s, i) => text(ctx, s, 790 + i * 170, 445, 20, { align: "center", weight: 800, color: C.ink2 }));
      // kerumunan kacau
      for (let i = 0; i < 24; i++) { const x = 300 + (i % 8) * 70 + ((i * 13) % 17), y = 560 + Math.floor(i / 8) * 80 + ((i * 7) % 11); kid(ctx, x, y, 48, { hair: i % 2 ? "long" : undefined }); }
      if (l > 4) { kid(ctx, 1500, 560, 150, { point: true }); bubble(ctx, 1240, 400, 300, "kacau!", 32, { tailX: 1480, tailDir: 20, fill: C.badBg, stroke: C.bad, color: C.bad }); }
      if (l > 7) label(ctx, "kalau dikerjakan sekaligus…", 960, 800, { size: 26, color: C.bad });
    },
    unplugged_split(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 330, 540, 170, { point: true }); text(ctx, "Dito", 330, 780, 24, { align: "center", weight: 800, color: C.ink2 });
      // kertas pembagian
      ctx.fillStyle = "#FFF9E0"; rr(ctx, 560, 230, 760, 560, 12); ctx.fill(); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 3; rr(ctx, 560, 230, 760, 560, 12); ctx.stroke();
      text(ctx, "Lomba 17 Agustus", 940, 290, 32, { align: "center", weight: 900 });
      const n = reveal(l, 0.8, 1.0, 4);
      [["Tempat", "lapangan, garis"], ["Alat", "karung, kerupuk, tambang"], ["Peserta", "daftar nama"], ["Hadiah", "beli, bungkus"]].forEach(([t, s], i) => { if (i < n) { card(ctx, 600 + (i % 2) * 350, 330 + Math.floor(i / 2) * 210, 320, 180, { fill: "#fff", stroke: "#CFDCD5", lw: 3, r: 12 }); text(ctx, t, 760 + (i % 2) * 350, 400 + Math.floor(i / 2) * 210, 32, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 760 + (i % 2) * 350, 450 + Math.floor(i / 2) * 210, 22, { align: "center", weight: 700, color: C.ink2 }); } });
      if (n >= 4) { text(ctx, "empat urusan,", 1560, 420, 30, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "empat kelompok", 1560, 462, 30, { align: "center", weight: 900, color: C.accentDark }); }
      if (l > 6.5) label(ctx, "jurus pertama, tanpa sadar", 1560, 560, { size: 26, color: C.ink2 });
    },

    jurus1(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      JURUS.forEach((j, i) => jurusCard(ctx, 180, 220 + i * 150, 420, 130, i, { on: i === 0 }));
      text(ctx, "Lomba 17 Agustus", 1250, 260, 34, { align: "center", weight: 900 });
      const n = reveal(l, 1.0, 1.0, 4);
      ["Tempat", "Alat", "Peserta", "Hadiah"].forEach((t, i) => { if (i < n) { ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1250, 280); ctx.lineTo(760 + i * 330, 380); ctx.stroke(); card(ctx, 660 + i * 330, 380, 200, 90, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, t, 760 + i * 330, 435, 28, { align: "center", weight: 900, color: C.good }); } });
      if (n >= 4) { for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) kid(ctx, 700 + i * 330 + k * 50, 580, 50, { hair: k % 2 ? "long" : undefined }); label(ctx, "masalah besar → bagian kecil yang bisa dibagi", 1250, 740, { size: 28 }); }
    },
    jurus2(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      JURUS.forEach((j, i) => jurusCard(ctx, 180, 220 + i * 150, 420, 130, i, { on: i === 1 }));
      ["Balap karung", "Makan kerupuk", "Tarik tambang"].forEach((t, i) => { card(ctx, 680 + i * 360, 230, 330, 420, { fill: C.bg2 }); text(ctx, t, 845 + i * 360, 285, 26, { align: "center", weight: 900 }); text(ctx, ["🏃", "🍘", "🪢"][i], 845 + i * 360, 360, 50, { align: "center" }); });
      const n = reveal(l, 1.2, 1.1, 3);
      ["garis start", "wasit", "daftar peserta"].forEach((s, k) => { if (k < n) for (let i = 0; i < 3; i++) { card(ctx, 700 + i * 360, 400 + k * 72, 290, 56, { fill: C.goodBg, stroke: C.good, lw: 3, r: 10 }); text(ctx, "✓ " + s, 845 + i * 360, 437 + k * 72, 24, { align: "center", weight: 900, color: C.good }); } });
      if (n >= 3) banner(ctx, "berulang tiga kali → satu rencana dipakai tiga kali", 700, 1000, { size: 30 });
    },
    jurus3(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      JURUS.forEach((j, i) => jurusCard(ctx, 180, 220 + i * 150, 420, 130, i, { on: i === 2 }));
      text(ctx, "Daftar peserta", 1250, 260, 34, { align: "center", weight: 900 });
      const cols = [["Nama", true], ["Kelas", true], ["Warna baju", false], ["Makanan kesukaan", false]];
      const n = reveal(l, 1.5, 1.0, 2);
      cols.forEach(([c, keep], i) => { const gone = !keep && n > (i - 2); const x = 700 + i * 270; ctx.save(); ctx.globalAlpha = gone ? 0.25 : 1; card(ctx, x, 300, 250, 300, { fill: keep ? C.goodBg : C.badBg, stroke: keep ? C.good : C.bad, lw: 4, r: 12 }); text(ctx, c, x + 125, 350, 24, { align: "center", weight: 900, color: keep ? C.good : C.bad }); ["Dito", "Sinta", "Rani"].forEach((nm, k) => text(ctx, [nm, "7B", ["merah", "biru", "hijau"][k], ["bakso", "mie", "soto"][k]][i], x + 125, 410 + k * 50, 22, { align: "center", weight: 700 })); ctx.restore(); if (gone) { ctx.strokeStyle = C.bad; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 30, 320); ctx.lineTo(x + 220, 580); ctx.stroke(); } });
      if (n >= 2) banner(ctx, "simpan yang penting, buang yang tidak perlu", 700, 1000, { size: 30 });
    },
    jurus4(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      JURUS.forEach((j, i) => jurusCard(ctx, 180, 220 + i * 150, 420, 130, i, { on: i === 3 }));
      const steps = ["Pasang garis start", "Panggil peserta", "Beri aba-aba", "Catat pemenang"]; const n = reveal(l, 0.8, 1.0, 4);
      steps.forEach((s, i) => { if (i < n) { card(ctx, 760, 240 + i * 115, 760, 90, { fill: C.panel, stroke: "#CFDCD5", lw: 3, r: 14 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(800, 285 + i * 115, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 800, 294 + i * 115, 24, { align: "center", color: "#fff", weight: 900 }); text(ctx, s, 850, 296 + i * 115, 30, { weight: 800 }); if (i) arrowIcon(ctx, "down", 1600, 240 + i * 115 - 12, 28, C.ink2); } });
      if (n >= 4) banner(ctx, "urutannya tidak boleh tertukar", 720, 900, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },

    robot_recall(ctx, b, l) {
      const g = gridGeom(200, 190, 110, WORLD); drawGrid(ctx, g, { ...WORLD, goal: null });
      drawRobotOnGrid(ctx, g, { x: 2, y: 2, ang: 0, grabbed: false }, WORLD);
      text(ctx, "Kiko hanya mengerti 4 perintah", 1320, 250, 34, { align: "center", weight: 900 });
      const n = reveal(l, 1.0, 0.9, 4);
      ["MAJU", "KIRI", "KANAN", "AMBIL"].forEach((c, i) => { if (i < n) { card(ctx, 900, 290 + i * 120, 840, 100, { stroke: "#D7E2DC", lw: 3 }); arrowIcon(ctx, CMD[c].icon, 970, 340 + i * 120, 60, C.kiko); text(ctx, CMD[c].word, 1040, 356 + i * 120, 40, { weight: 800 }); } });
      if (l > 6) label(ctx, "tidak bisa menebak: persis seperti yang ditulis", 1320, 820, { size: 28, color: C.ink2 });
    },
    robot_predict(ctx, b, l) {
      const g = robotScene(ctx, WORLD, PROG, {});
      card(ctx, 900, 760, 560, 70, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "Kiko berhenti di kotak mana?", 1180, 806, 30, { align: "center", weight: 900 });
      if (l > 5) { const pulse = 0.5 + 0.5 * Math.sin(l * 4); ctx.fillStyle = `rgba(242,177,52,${0.15 + 0.25 * pulse})`; rr(ctx, 200, 190, g.w, g.h, 12); ctx.fill(); label(ctx, "tunjuk kotaknya", 200 + g.w / 2, 190 + g.h + 55, { size: 28 }); }
    },
    robot_run(ctx, b, l) {
      const u = runU(b, l, PROG.length, 1.0); const p = pose(PROG, WORLD, u);
      robotScene(ctx, WORLD, PROG, { p, active: Math.min(Math.floor(u), PROG.length - 1), done: Math.floor(u) });
      if (p.grabbed) { card(ctx, 900, 760, 560, 70, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "sampai di bakso! sama dengan tebakanmu?", 1180, 806, 26, { align: "center", weight: 900, color: C.good }); }
    },
    robot_bug(ctx, b, l) {
      const u = runU(b, l, 2, 0.8); const p = pose(PROG, WORLD_BUG, u);
      robotScene(ctx, WORLD_BUG, PROG, { p, active: Math.min(Math.floor(u), 1), done: Math.floor(u), bad: p.crash ? 1 : undefined });
      if (p.crash) { card(ctx, 900, 760, 560, 70, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "menabrak pada perintah ke-2: BUG", 1180, 806, 28, { align: "center", weight: 900, color: C.bad }); }
      if (l > 6) label(ctx, "mencari dan memperbaikinya = debugging", 200 + 275, 190 + 550 + 55, { size: 26, color: C.ink2 });
    },

    words_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "PSEUDOCODE", 560, 240, 34, { align: "center", color: C.accentDark, weight: 800 });
      drawProgram(ctx, 280, 280, PROG, { rowH: 70, w: 560, style: "words" });
      text(ctx, "kata-kata terbatas, bernomor", 560, 760, 24, { align: "center", weight: 700, color: C.ink2 });
      if (l > 4) { text(ctx, "KELAS 8: ADA PERCABANGAN", 1340, 240, 34, { align: "center", color: C.accentDark, weight: 800 }); card(ctx, 1000, 280, 680, 300, { fill: C.bg2 }); ["1  MAJU", "2  JIKA ada meja di depan", "3     MAKA BELOK KANAN", "4  MAJU"].forEach((s, i) => text(ctx, s, 1040, 340 + i * 60, 28, { weight: i === 1 || i === 2 ? 900 : 700, color: i === 1 || i === 2 ? C.kiko : C.ink })); label(ctx, "jika begini, maka begitu", 1340, 650, { size: 28 }); }
    },
    map8(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "PETA KELAS VIII", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const units = [["D8.1", "Lembar kerja pengolah data"], ["D8.2", "Persoalan dengan data kecil"], ["D8.3", "Flowchart dan pseudocode"], ["D8.4", "Menilai informasi"], ["D8.5", "Fakta, opini, hoaks"], ["D8.6", "Proyek: cek data, cek fakta"]];
      const n = reveal(l, 0.8, 1.0, 6);
      units.forEach(([c, t], i) => { const x = 420 + (i % 3) * 540, y = i < 3 ? 280 : 480; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.2; card(ctx, x - 240, y, 480, 160, { fill: C.bg2, r: 16 }); text(ctx, c, x, y + 55, 30, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x, y + 105, 26, 440, { align: "center", weight: 800, lh: 1.2 }); ctx.restore(); });
      if (n >= 6) banner(ctx, "semuanya memakai empat jurus dan instruksi", 690, 1000, { size: 30 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU: KUIS DIAGNOSTIK", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["8 soal bergambar", "empat jurus dan instruksi", (x, y) => { for (let i = 0; i < 8; i++) { card(ctx, x - 190 + (i % 4) * 95, y - 70 + Math.floor(i / 4) * 80, 85, 70, { fill: i < 5 ? C.goodBg : "#fff", stroke: i < 5 ? C.good : "#CFDCD5", lw: 3, r: 10 }); text(ctx, String(i + 1), x - 147 + (i % 4) * 95, y - 26 + Math.floor(i / 4) * 80, 26, { align: "center", weight: 900, color: i < 5 ? C.good : C.ink2 }); } }],
        ["Hasil hanya untukmu", "salah tidak apa-apa", (x, y) => { kiko(ctx, x, y + 10, 150, 0, { mood: "happy" }); }],
        ["Peta belajarmu", "tonton ulang D7.1 atau D7.5?", (x, y) => { [["D7.1", true], ["D7.5", false]].forEach(([c, on], i) => { card(ctx, x - 170, y - 80 + i * 90, 340, 70, { fill: on ? "#FFF3D6" : C.goodBg, stroke: on ? C.accent : C.good, lw: 3, r: 12 }); text(ctx, (on ? "↺ tonton ulang " : "✓ aman ") + c, x, y - 36 + i * 90, 24, { align: "center", weight: 900, color: on ? C.accentDark : C.good }); }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 610, 28, { align: "center", weight: 900 }); text(ctx, t2, x, 650, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini, sebelum lanjut ke lembar kerja", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
