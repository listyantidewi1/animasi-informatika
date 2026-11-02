/* Adegan episode D7.5: Instruksi untuk Manusia dan Mesin.
   Muat setelah ../_alat/kiko-core.js dan ../_alat/kiko-grid.js (urutan ada di "engine" pada script.json). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, CMD = K.CMD, SCENES = K.SCENES, pose = K.pose;
  const { text, para, arrowIcon, bakso, table, kiko, kid, bubble, card, rr, ease, clamp, lerp, gridGeom, drawGrid, drawRobotOnGrid, drawProgram, runU } = H;

  // ---------- worlds and programs ----------
  const WORLD_A = { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [1, 2], tables: [] };
  const PROG_A = ["MAJU", "MAJU", "KANAN", "MAJU", "AMBIL"];
  const PROG_B = ["KANAN", "MAJU", "MAJU", "MAJU", "AMBIL"];
  const WORLD_P = { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [2, 2], tables: [] };
  const PROG_P = ["MAJU", "KANAN", "MAJU", "MAJU", "KIRI", "MAJU", "AMBIL"];
  const WORLD_BUG = { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [1, 2], tables: [[0, 2]] };
  const PROG_BUG = ["MAJU", "MAJU", "KANAN", "MAJU", "AMBIL"];
  const PROG_FIX = ["MAJU", "KANAN", "MAJU", "KIRI", "MAJU", "AMBIL"];
  const WORLD_MAKE = { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [2, 3], tables: [[1, 1], [0, 3]] };
  const WORLD_DEMO = { cols: 3, rows: 3, start: [1, 1], dir: 0, goal: null, tables: [] };

  // ---------- scenes ----------
  const GX = 150, GY = 150, CELL = 136;
  Object.assign(SCENES, {
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.1", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Empat Jurus Berpikir Komputasional", 960, 500, 52, { align: "center", weight: 700, color: C.ink2 });
      ["Dekomposisi", "Pola", "Abstraksi", "Algoritma"].forEach((s, i) => { card(ctx, 380 + i * 300, 580, 260, 120, { fill: C.bg2 }); text(ctx, s, 510 + i * 300, 652, 34, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      kid(ctx, 560, 540, 220, { point: true });
      kid(ctx, 1260, 540, 220, { hair: "long", hairColor: "#3A2A1E" });
      // blindfold on the "robot" kid
      ctx.fillStyle = C.ink; rr(ctx, 1260 - 80, 540 - 220 * 0.47, 160, 40, 10); ctx.fill();
      text(ctx, "pemberi perintah", 560, 800, 32, { align: "center", color: C.ink2, weight: 700 });
      text(ctx, "robot", 1260, 800, 32, { align: "center", color: C.ink2, weight: 700 });
      const words = ["maju", "kiri", "kanan"]; const k = Math.floor(l / 1.6) % 3;
      bubble(ctx, 640, 330, 300, words[k], 44, { tailX: 700, tailDir: -30 });
      if (b.id === "play2") { text(ctx, "Robot tidak boleh menebak!", 960, 880, 36, { align: "center", color: C.bad, weight: 800 }); }
    },
    cantin_ask(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const [px, py] = [1500, 560]; table(ctx, px - 110, py - 110, 220, 220); bakso(ctx, px, py - 20, 110);
      kid(ctx, 420, 560, 220, { point: true }); kid(ctx, 820, 560, 220, { hair: "long" });
      text(ctx, "Dito", 420, 820, 32, { align: "center", color: C.ink2, weight: 700 }); text(ctx, "Sinta", 820, 820, 32, { align: "center", color: C.ink2, weight: 700 });
      bubble(ctx, 360, 320, 620, "Ambilkan bakso di meja sana, ya!", 40, { tailX: 460, tailDir: -20 });
    },
    cantin_human(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const [px, py] = [1500, 560]; table(ctx, px - 110, py - 110, 220, 220);
      kid(ctx, 420, 560, 220, {});
      const u = ease(clamp((l - 0.8) / 3.5, 0, 1));
      const kx = lerp(820, 1320, u), ky = 560 + Math.sin(u * Math.PI) * -80;
      if (u < 0.99) bakso(ctx, px, py - 20, 110);
      kid(ctx, kx, ky, 220, { hair: "long" });
      if (u >= 0.99) { bakso(ctx, kx + 80, ky + 20, 90); text(ctx, "✓ paham", kx, ky - 180, 44, { align: "center", color: C.good, weight: 900 }); }
      bubble(ctx, 700, 300, 520, "Meja yang itu. Lewat sini. Lalu ambil.", 34, { tailX: 840, tailDir: 0, fill: "#F3FAF5", stroke: C.good });
    },
    cantin_robot(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const [px, py] = [1500, 560]; table(ctx, px - 110, py - 110, 220, 220); bakso(ctx, px, py - 20, 110);
      kid(ctx, 420, 560, 220, { point: true }); kiko(ctx, 840, 600, 220, 0, { mood: "confused" });
      bubble(ctx, 360, 320, 620, "Ambilkan bakso di meja sana, ya!", 40, { tailX: 460, tailDir: -20 });
      const qs = ["?", "? ?", "? ? ?"][Math.min(2, Math.floor(l / 1.2))];
      bubble(ctx, 900, 360, 220, qs, 48, { tailX: 950, tailDir: -20, fill: C.badBg, stroke: C.bad, color: C.bad });
      text(ctx, "Kiko tidak bisa menebak", 840, 840, 36, { align: "center", color: C.bad, weight: 800 });
    },
    four_cmds(ctx, b, l) {
      const g = gridGeom(GX, GY, CELL, WORLD_DEMO); // small grid, scale cell larger
      const g2 = gridGeom(180, 210, 200, WORLD_DEMO); drawGrid(ctx, g2, WORLD_DEMO);
      drawRobotOnGrid(ctx, g2, { x: 1, y: 1, ang: 0, grabbed: false }, WORLD_DEMO);
      text(ctx, "Kiko hanya mengerti 4 perintah", 1320, 230, 44, { align: "center", weight: 900 });
      const cmds = ["MAJU", "KIRI", "KANAN", "AMBIL"]; const show = b.id === "s1i" ? 4 : Math.min(4, Math.floor((l - 1) / 1.1) + 1);
      cmds.forEach((c, i) => { if (i >= show) return; card(ctx, 900, 290 + i * 140, 840, 120, { stroke: "#D7E2DC", lw: 3 }); arrowIcon(ctx, CMD[c].icon, 980, 350 + i * 140, 70, C.kiko); text(ctx, CMD[c].word, 1060, 368 + i * 140, 46, { weight: 800 }); });
      if (b.id === "s1i") text(ctx, "persis seperti yang ditulis", 1320, 880, 36, { align: "center", color: C.ink2, weight: 700 });
    },
    demo(ctx, b, l, cmd, repeat) {
      const g2 = gridGeom(180, 210, 200, WORLD_DEMO); const world = cmd === "AMBIL" ? { ...WORLD_DEMO, goal: [1, 1] } : WORLD_DEMO;
      const prog = [cmd]; const cycle = 2.2; const u = clamp(((l - 0.8) % cycle) / 1.0, 0, 1) * (l > 0.8 ? 1 : 0);
      const k = Math.floor(Math.max(0, l - 0.8) / cycle);
      const p = pose(prog, world, k % 2 === 0 || cmd !== "MAJU" ? u : u); // same every cycle; robot resets
      drawGrid(ctx, g2, world, { hideGoal: p.grabbed });
      drawRobotOnGrid(ctx, g2, p, world);
      const cmds = ["MAJU", "KIRI", "KANAN", "AMBIL"];
      cmds.forEach((c, i) => { const on = c === cmd; card(ctx, 900, 290 + i * 140, 840, 120, { stroke: on ? C.accent : "#D7E2DC", lw: on ? 6 : 3, fill: on ? "#FFF3D6" : C.panel }); arrowIcon(ctx, CMD[c].icon, 980, 350 + i * 140, 70, on ? C.ink : C.muted); text(ctx, CMD[c].word, 1060, 368 + i * 140, 46, { weight: 800, color: on ? C.ink : C.muted }); });
      const note = { MAJU: "pindah 1 kotak ke depan", KIRI: "berputar, tidak pindah", KANAN: "berputar, tidak pindah", AMBIL: "ambil benda di kotak ini" }[cmd];
      text(ctx, note, 1320, 880, 36, { align: "center", color: C.accentDark, weight: 800 });
    },
    demo_maju(ctx, b, l) { SCENES.demo(ctx, b, l, "MAJU"); },
    demo_kiri(ctx, b, l) { SCENES.demo(ctx, b, l, "KIRI"); },
    demo_kanan(ctx, b, l) { SCENES.demo(ctx, b, l, "KANAN"); },
    demo_ambil(ctx, b, l) { SCENES.demo(ctx, b, l, "AMBIL"); },
    orderScene(ctx, b, l, prog, u, opt = {}) {
      const g = gridGeom(GX, GY, CELL, WORLD_A); const p = pose(prog, WORLD_A, u);
      drawGrid(ctx, g, WORLD_A, { hideGoal: p.grabbed });
      drawRobotOnGrid(ctx, g, p, WORLD_A);
      drawProgram(ctx, 1000, 220, prog, { title: opt.title, active: p.done ? -1 : p.step, done: p.done ? prog.length : p.step, style: "both", w: 560 });
      if (p.done && opt.result) text(ctx, opt.result, 1280, 720, 44, { align: "center", color: opt.good ? C.good : C.bad, weight: 900 });
      if (opt.note) text(ctx, opt.note, 1280, 820, 34, { align: "center", color: C.ink2, weight: 700 });
    },
    order_intro(ctx, b, l) { SCENES.orderScene(ctx, b, l, PROG_A, 0, { title: "Program 1", note: "dijalankan urut dari nomor 1" }); },
    order_runA(ctx, b, l) { SCENES.orderScene(ctx, b, l, PROG_A, runU(b, l, PROG_A.length), { title: "Program 1", result: "Bakso terambil!", good: true }); },
    order_introB(ctx, b, l) { SCENES.orderScene(ctx, b, l, PROG_B, 0, { title: "Program 2", note: "perintah sama, urutan berbeda" }); },
    order_runB(ctx, b, l) { SCENES.orderScene(ctx, b, l, PROG_B, runU(b, l, PROG_B.length), { title: "Program 2", result: "Kotak kosong. Tidak ada bakso.", good: false }); },
    order_compare(ctx, b, l) {
      const small = 90; const g1 = gridGeom(140, 220, small, WORLD_A), g2 = gridGeom(1330, 220, small, WORLD_A);
      const p1 = pose(PROG_A, WORLD_A, 5), p2 = pose(PROG_B, WORLD_A, 5);
      drawGrid(ctx, g1, WORLD_A, { hideGoal: true }); drawRobotOnGrid(ctx, g1, p1, WORLD_A);
      drawGrid(ctx, g2, WORLD_A); drawRobotOnGrid(ctx, g2, p2, WORLD_A);
      drawProgram(ctx, 700, 275, PROG_A, { rowH: 54, w: 420, style: "words", title: "Program 1" });
      drawProgram(ctx, 700, 610, PROG_B, { rowH: 54, w: 420, style: "words", title: "Program 2" });
      text(ctx, "✓ dapat bakso", 365, 740, 36, { align: "center", color: C.good, weight: 900 }); text(ctx, "✕ kotak kosong", 1555, 740, 36, { align: "center", color: C.bad, weight: 900 });
      if (l > 3) { card(ctx, 500, 120, 920, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "Daftar perintah yang urut = ALGORITMA", 960, 173, 38, { align: "center", weight: 900 }); }
    },
    predictScene(ctx, b, l, u, opt = {}) {
      const g = gridGeom(GX, GY, CELL, WORLD_P); const p = pose(PROG_P, WORLD_P, u);
      const hl = opt.wait ? [[1, 1], [2, 2], [2, 3], [3, 1], [1, 3]].map(c => [c[0], c[1], `rgba(242,177,52,${0.25 + 0.2 * Math.sin(l * 3 + c[0] * 2 + c[1])})`]) : opt.result ? [[2, 2, C.goodBg]] : [];
      drawGrid(ctx, g, WORLD_P, { hideGoal: true, highlight: hl });
      drawRobotOnGrid(ctx, g, p, WORLD_P);
      drawProgram(ctx, 1000, 190, PROG_P, { title: "Program", rowH: 72, w: 560, active: opt.run && !p.done ? p.step : -1, done: opt.run ? (p.done ? PROG_P.length : p.step) : 0 });
      if (opt.wait) { card(ctx, 980, 720, 620, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "Kiko berhenti di kotak mana?", 1290, 790, 40, { align: "center", weight: 900 }); }
      if (opt.result) { text(ctx, "Kiko berhenti di sini", 1290, 760, 40, { align: "center", color: C.good, weight: 900 }); text(ctx, "Tebak → Jalankan → Bandingkan", 1290, 815, 32, { align: "center", color: C.ink2, weight: 700 }); }
    },
    predict_show(ctx, b, l) { SCENES.predictScene(ctx, b, l, 0, {}); },
    predict_wait(ctx, b, l) { SCENES.predictScene(ctx, b, l, 0, { wait: true }); },
    predict_run(ctx, b, l) { SCENES.predictScene(ctx, b, l, runU(b, l, PROG_P.length, 2.0), { run: true }); },
    predict_result(ctx, b, l) { SCENES.predictScene(ctx, b, l, PROG_P.length, { run: true, result: true }); },
    bugScene(ctx, b, l, prog, u, opt = {}) {
      const g = gridGeom(GX, GY, CELL, WORLD_BUG); const p = pose(prog, WORLD_BUG, u);
      drawGrid(ctx, g, WORLD_BUG, { hideGoal: p.grabbed, marks: opt.marks, highlight: opt.highlight });
      drawRobotOnGrid(ctx, g, p, WORLD_BUG);
      drawProgram(ctx, 1000, 190, prog, { title: opt.title, rowH: 72, w: 520, active: opt.active !== undefined ? opt.active : (opt.run && !p.done ? p.step : -1), done: opt.done !== undefined ? opt.done : (opt.run ? (p.done ? prog.length : p.step) : 0), bad: opt.bad, notes: opt.notes, changed: opt.changed });
      if (opt.banner) { card(ctx, 980, 700, 640, 110, { fill: opt.good ? C.goodBg : C.badBg, stroke: opt.good ? C.good : C.bad, lw: 4 }); text(ctx, opt.banner, 1300, 770, 40, { align: "center", weight: 900, color: opt.good ? C.good : C.bad }); }
      if (opt.sub) text(ctx, opt.sub, 1300, 860, 32, { align: "center", color: C.ink2, weight: 700 });
    },
    bug_show(ctx, b, l) { SCENES.bugScene(ctx, b, l, PROG_BUG, 0, { title: "Program" }); },
    bug_run(ctx, b, l) { const u = runU(b, l, 2, 1.0); SCENES.bugScene(ctx, b, l, PROG_BUG, u, { title: "Program", run: true, banner: u >= 1.5 ? "Kiko menabrak meja!" : undefined, sub: u >= 1.9 ? "program berhenti" : undefined }); },
    bug_find(ctx, b, l) {
      if (b.id === "s4c") { SCENES.bugScene(ctx, b, l, PROG_BUG, 0, { title: "Program", banner: "Kesalahan = BUG", good: false, sub: "mesin tidak memperbaikinya sendiri" }); return; }
      // s4d: trace step 1 (safe), then step 2 (hits the table)
      const phase = l < 3 ? 0 : l < 6.5 ? 1 : 2;
      const u = phase === 0 ? 0 : phase === 1 ? 1 : 1.5;
      const notes = phase === 0 ? [] : phase === 1 ? ["aman ✓"] : ["aman ✓", "masuk kotak meja ✕"];
      SCENES.bugScene(ctx, b, l, PROG_BUG, u, { title: "Telusuri satu per satu", active: phase === 0 ? -1 : phase - 1, done: phase === 2 ? 1 : 0, bad: phase === 2 ? 1 : undefined, notes, banner: phase === 2 ? "Di sini salahnya" : undefined, good: false });
    },
    bug_fix(ctx, b, l) {
      const show = clamp(Math.floor((l - 0.8) / 1.0) + 1, 0, PROG_FIX.length);
      SCENES.bugScene(ctx, b, l, PROG_FIX.slice(0, Math.max(1, show)), 0, { title: "Program yang diperbaiki", changed: [1, 2, 3], done: 0, active: -1, banner: "Perintah 2–4 diubah", good: true });
    },
    bug_fixrun(ctx, b, l) {
      const u = b.id === "s4g" ? PROG_FIX.length : runU(b, l, PROG_FIX.length, 1.6);
      SCENES.bugScene(ctx, b, l, PROG_FIX, u, { title: "Program yang diperbaiki", run: true, banner: u >= PROG_FIX.length ? "Berhasil!" : undefined, good: true, sub: b.id === "s4g" ? "mencari dan memperbaiki = DEBUGGING" : undefined });
    },
    symbol_arrows(ctx, b, l) {
      card(ctx, 160, 160, 1600, 720);
      text(ctx, "Ditulis dengan SIMBOL", 960, 250, 40, { align: "center", weight: 900, color: C.ink2 });
      PROG_FIX.forEach((c, i) => { card(ctx, 260 + i * 240, 360, 200, 200, { fill: C.bg2 }); arrowIcon(ctx, CMD[c].icon, 360 + i * 240, 460, 110, C.kiko); text(ctx, String(i + 1), 360 + i * 240, 620, 30, { align: "center", color: C.ink2, weight: 800 }); });
      text(ctx, "mudah dibaca, sulit ditulis di buku", 960, 780, 34, { align: "center", color: C.ink2, weight: 700 });
    },
    symbol_words(ctx, b, l) {
      card(ctx, 160, 140, 1600, 760);
      text(ctx, "SIMBOL", 500, 220, 34, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "KATA-KATA TERBATAS", 1300, 220, 34, { align: "center", weight: 900, color: C.accentDark });
      drawProgram(ctx, 260, 250, PROG_FIX, { style: "arrows", rowH: 72, w: 460 });
      const show = b.id === "s5c" ? 6 : clamp(Math.floor((l - 0.5) / 0.9) + 1, 0, 6);
      drawProgram(ctx, 1000, 250, PROG_FIX.slice(0, Math.max(1, show)), { style: "words", rowH: 72, w: 620 });
      for (let i = 0; i < Math.max(1, show); i++) { arrowIcon(ctx, "east", 860, 281 + i * 72, 44, C.muted); }
      if (b.id === "s5c") { card(ctx, 1000, 690, 620, 140, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "PSEUDOCODE", 1310, 745, 40, { align: "center", weight: 900 }); text(ctx, "urut, jelas, mudah jadi program", 1310, 800, 30, { align: "center", color: C.ink2, weight: 700 }); }
    },
    symbol_rule(ctx, b, l) {
      card(ctx, 160, 160, 1600, 720);
      text(ctx, "Kosakatanya terbatas", 960, 260, 44, { align: "center", weight: 900 });
      card(ctx, 260, 340, 640, 200, { fill: C.badBg, stroke: C.bad, lw: 5 }); text(ctx, "tolong ambilkan, ya", 580, 450, 44, { align: "center", weight: 800, color: C.bad });
      ctx.strokeStyle = C.bad; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(300, 380); ctx.lineTo(860, 500); ctx.stroke();
      card(ctx, 1020, 340, 640, 200, { fill: C.goodBg, stroke: C.good, lw: 5 }); text(ctx, "AMBIL", 1340, 460, 64, { align: "center", weight: 900, color: C.good });
      text(ctx, "✕ Kiko tidak mengerti", 580, 600, 34, { align: "center", color: C.bad, weight: 800 }); text(ctx, "✓ Kiko mengerti", 1340, 600, 34, { align: "center", color: C.good, weight: 800 });
      kiko(ctx, 960, 760, 180, 0, { mood: "happy" });
    },
    make_show(ctx, b, l) {
      const g = gridGeom(GX, GY, CELL, WORLD_MAKE); drawGrid(ctx, g, WORLD_MAKE);
      drawRobotOnGrid(ctx, g, { x: 0, y: 0, ang: 0, grabbed: false }, WORLD_MAKE);
      card(ctx, 980, 190, 640, 420, { stroke: "#D7E2DC", lw: 3 });
      text(ctx, "GILIRANMU", 1300, 260, 34, { align: "center", color: C.accentDark, weight: 900 });
      ["1. Tebak dulu jalannya", "2. Tulis daftar perintah", "3. Jalankan", "4. Perbaiki kalau salah"].forEach((s, i) => text(ctx, s, 1040, 340 + i * 64, 36, { weight: 700 }));
      card(ctx, 980, 650, 640, 180, { fill: C.bg2 });
      ["MAJU", "KIRI", "KANAN", "AMBIL"].forEach((c, i) => { arrowIcon(ctx, CMD[c].icon, 1070 + i * 150, 740, 70, C.kiko); });
      text(ctx, "hanya 4 perintah ini", 1300, 810, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });

  // dipakai halaman latihan (page.html)
  K.worlds = { WORLD_A, WORLD_P, WORLD_BUG, WORLD_MAKE, WORLD_DEMO };
  K.programs = { PROG_A, PROG_B, PROG_P, PROG_BUG, PROG_FIX };
})(typeof window !== "undefined" ? window : globalThis);
