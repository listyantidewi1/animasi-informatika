/* Adegan episode D7.1: Empat Jurus Berpikir Komputasional. Muat setelah ../_alat/kiko-core.js dan pentas.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, P = K.pentas, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const TASKS = ["panggung", "kostum", "latihan tari", "snack", "undangan", "sound system", "dekorasi", "latihan drama", "kursi", "foto", "MC", "jadwal", "spanduk", "air minum", "latihan musik"];

  Object.assign(SCENES, {
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "KALAU PERLU, TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.0", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Cara Memakai Komputer dan HP", 960, 500, 52, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "Episode ini sendiri tidak memakai komputer sama sekali.", 960, 620, 36, { align: "center", weight: 600, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      kid(ctx, 420, 560, 220, { point: true }); kid(ctx, 720, 560, 220, { hair: "long" });
      bubble(ctx, 250, 372, 760, "Pentas kelas minggu depan! Apa saja yang harus disiapkan?", 32, { tailX: 420, tailDir: 0 });
      const n = reveal(l, 1.5, 0.9, 4);
      for (let i = 0; i < n; i++) P.note(ctx, 1000 + i * 190, 420, 170, 130, TASKS[i], { i, rot: (i % 2 ? 1 : -1) * 0.06, size: 26 });
      text(ctx, "satu kertas, satu hal", 1380, 650, 32, { align: "center", color: C.ink2, weight: 700 });
    },
    unplugged_pile(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.3, 0.28, TASKS.length);
      for (let i = 0; i < n; i++) { const r = Math.floor(i / 5), c = i % 5; P.note(ctx, 220 + c * 240 + (r % 2) * 40, 260 + r * 150, 190, 120, TASKS[i], { i, rot: ((i * 7) % 5 - 2) * 0.06, size: 26 }); }
      kid(ctx, 1560, 560, 200, {}); text(ctx, "Dito", 1560, 830, 30, { align: "center", color: C.ink2, weight: 700 });
      if (n >= TASKS.length) bubble(ctx, 1380, 330, 330, "Mulai dari mana, ya?", 32, { tailX: 1540, tailDir: 20, fill: C.badBg, stroke: C.bad, color: C.bad });
    },
    big_task(ctx, b, l) {
      P.jurusBar(ctx, 0, -1);
      P.box(ctx, 560, 300, 800, 170, "PENTAS KELAS", { size: 56, stroke: C.bad, lw: 6, fill: C.badBg });
      const n = reveal(l, 1.0, 0.25, TASKS.length);
      for (let i = 0; i < n; i++) P.note(ctx, 300 + (i * 97) % 1300, 500 + (i * 53) % 170, 180, 90, TASKS[i], { i, rot: ((i * 7) % 5 - 2) * 0.1, size: 24 });
      if (n >= TASKS.length) { card(ctx, 560, 800, 800, 70, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "terlalu besar untuk dikerjakan sekaligus", 960, 846, 32, { align: "center", weight: 900 }); }
    },
    decompose1(ctx, b, l) {
      P.jurusBar(ctx, 0, 0);
      P.box(ctx, 660, 240, 600, 110, "PENTAS KELAS", { size: 44, stroke: C.accent, lw: 5 });
      const parts = ["Acara", "Panggung", "Kostum", "Konsumsi"]; const n = reveal(l, 1.2, 0.8, 4);
      parts.forEach((s, i) => { if (i >= n) return; const x = 260 + i * 380; P.link(ctx, 960, 350, x + 160, 470); P.box(ctx, x, 470, 320, 120, s, { size: 40, fill: C.goodBg, stroke: C.good, lw: 4 }); });
      if (n >= 4) text(ctx, "satu tugas besar → empat bagian", 960, 720, 36, { align: "center", color: C.ink2, weight: 800 });
    },
    decompose2(ctx, b, l) {
      P.jurusBar(ctx, 0, 0);
      P.box(ctx, 660, 240, 600, 100, "Konsumsi", { size: 40, fill: C.goodBg, stroke: C.good, lw: 4 });
      const parts = ["hitung orang", "pilih snack", "beli", "bagikan"]; const n = reveal(l, 1.2, 0.8, 4);
      parts.forEach((s, i) => { if (i >= n) return; const x = 260 + i * 380; P.link(ctx, 960, 340, x + 160, 450); P.box(ctx, x, 450, 320, 110, s, { size: 36, fill: "#FFF3D6", stroke: C.accent, lw: 4 }); });
      if (n >= 4) { text(ctx, "tiap bagian kecil, jelas, bisa langsung dikerjakan", 960, 700, 36, { align: "center", color: C.ink2, weight: 800 }); }
      ["Acara", "Panggung", "Kostum"].forEach((s, i) => P.box(ctx, 160 + i * 170, 790, 150, 60, s, { size: 24, fill: C.bg2, stroke: "#D7E2DC", color: C.ink2 }));
      text(ctx, "← bagian lain dipecah dengan cara yang sama", 700, 830, 26, { color: C.ink2, weight: 700 });
    },
    decompose_assign(ctx, b, l) {
      P.jurusBar(ctx, 0, 0);
      const who = [["Panggung", (x, y) => kid(ctx, x, y, 170, { point: true }), "Dito"], ["Kostum", (x, y) => kid(ctx, x, y, 170, { hair: "long" }), "Sinta"], ["Konsumsi", (x, y) => kiko(ctx, x, y + 20, 160, 0), "Kiko"]];
      const n = reveal(l, 1.0, 1.0, 3);
      who.forEach(([task, draw, name], i) => { if (i >= n) return; const x = 330 + i * 520; P.box(ctx, x - 160, 240, 320, 100, task, { size: 36, fill: C.goodBg, stroke: C.good, lw: 4 }); P.link(ctx, x, 340, x, 400); draw(x, 540); text(ctx, name, x, 760, 32, { align: "center", color: C.ink2, weight: 800 }); });
      if (n >= 3) text(ctx, "dikerjakan bersamaan, selesai lebih cepat", 960, 840, 34, { align: "center", color: C.ink2, weight: 800 });
    },
    decompose_name(ctx, b, l) { P.jurusBar(ctx, 1, 0); P.jurusCard(ctx, 0, "decomposition"); },

    pattern_chairs(ctx, b, l) {
      P.jurusBar(ctx, 1, 1);
      const rows = reveal(l, 0.8, 1.2, 3);
      for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) P.chair(ctx, 500 + c * 110, 300 + r * 100, 70, r < rows);
      kid(ctx, 1400, 520, 200, { hair: "long", point: true }); text(ctx, "Sinta", 1400, 790, 30, { align: "center", color: C.ink2, weight: 700 });
      if (rows >= 3) { card(ctx, 1180, 240, 520, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "tiap baris: 6 kursi, berulang", 1440, 292, 30, { align: "center", weight: 900 }); }
    },
    pattern_count(ctx, b, l) {
      P.jurusBar(ctx, 1, 1);
      for (let r = 0; r < 5; r++) { for (let c = 0; c < 6; c++) P.chair(ctx, 500 + c * 110, 300 + r * 100, 70, true); text(ctx, "6", 1200, 312 + r * 100, 40, { weight: 900, color: C.accentDark }); }
      ctx.strokeStyle = C.accent; ctx.lineWidth = 6; for (let r = 0; r < 5; r++) { ctx.beginPath(); ctx.moveTo(440, 300 + r * 100); ctx.lineTo(1120, 300 + r * 100); ctx.stroke(); }
      if (l > 2.5) { card(ctx, 1300, 380, 460, 220, { fill: C.goodBg, stroke: C.good, lw: 5 }); text(ctx, "5 baris × 6 kursi", 1530, 460, 40, { align: "center", weight: 900 }); text(ctx, "= 30 kursi", 1530, 540, 56, { align: "center", weight: 900, color: C.good }); }
      text(ctx, "tidak perlu dihitung satu per satu", 960, 850, 34, { align: "center", color: C.ink2, weight: 800 });
    },
    pattern_schedule(ctx, b, l) {
      P.jurusBar(ctx, 1, 1);
      text(ctx, "JADWAL LATIHAN", 960, 260, 34, { align: "center", color: C.accentDark, weight: 800 });
      const days = [["Senin", "tari", "#D9443B"], ["Selasa", "musik", "#2E9E5B"], ["Rabu", "drama", "#8E6BBF"], ["Senin", "tari", "#D9443B"], ["Selasa", "musik", "#2E9E5B"], ["Rabu", "drama", "#8E6BBF"], ["Kamis", l > 5 ? "musik" : "", "#2E9E5B"]];
      const n = reveal(l, 0.6, 0.55, 7);
      P.schedule(ctx, 180, 300, days.slice(0, n).map((d, i) => i === 6 ? d : d), { w: 200, h: 180, highlight: n >= 7 ? 6 : -1 });
      if (n >= 7) { text(ctx, "tari → musik → drama, berulang", 960, 560, 36, { align: "center", color: C.ink2, weight: 800 }); if (l > 5) text(ctx, "setelah tari (Rabu minggu depan) pasti musik ✓", 960, 620, 34, { align: "center", color: C.good, weight: 900 }); }
    },
    pattern_around(ctx, b, l) {
      P.jurusBar(ctx, 1, 1);
      const items = [["Bel sekolah", "tiap 40 menit", "🔔"], ["Angkot", "tiap 10 menit", "🚐"], ["Menu kantin", "berulang tiap minggu", "🍜"]];
      const n = reveal(l, 0.8, 1.3, 3);
      items.forEach(([t1, t2, ic], i) => { if (i >= n) return; const x = 200 + i * 530; card(ctx, x, 280, 480, 440, { fill: C.bg2 }); text(ctx, ic, x + 240, 440, 110, { align: "center" }); text(ctx, t1, x + 240, 560, 38, { align: "center", weight: 900 }); text(ctx, t2, x + 240, 630, 32, { align: "center", weight: 700, color: C.accentDark }); });
      if (n >= 3) text(ctx, "pola ada di mana-mana", 960, 820, 36, { align: "center", color: C.ink2, weight: 800 });
    },
    pattern_name(ctx, b, l) { P.jurusBar(ctx, 2, 1); P.jurusCard(ctx, 1, "pattern recognition"); },

    abstract_map(ctx, b, l) {
      P.jurusBar(ctx, 2, 2);
      P.stagePlan(ctx, 200, 230, 980, 620, true);
      kid(ctx, 1450, 560, 190, {}); kid(ctx, 1680, 560, 190, { hair: "long" });
      if (l > 2.5) bubble(ctx, 1300, 330, 420, "Yang mana panggungnya?", 30, { tailX: 1450, tailDir: 0, fill: C.badBg, stroke: C.bad, color: C.bad });
      text(ctx, "denah 1: terlalu banyak hal", 690, 222, 30, { align: "center", color: C.bad, weight: 800 });
    },
    abstract_map2(ctx, b, l) {
      P.jurusBar(ctx, 2, 2);
      P.stagePlan(ctx, 200, 230, 980, 620, false);
      kid(ctx, 1450, 560, 190, {}); kid(ctx, 1680, 560, 190, { hair: "long" });
      if (l > 1.5) bubble(ctx, 1320, 330, 400, "Oh, paham!", 32, { tailX: 1450, tailDir: 0, fill: C.goodBg, stroke: C.good, color: C.good });
      text(ctx, "denah 2: hanya yang penting", 690, 222, 30, { align: "center", color: C.good, weight: 800 });
    },
    abstract_angkot(ctx, b, l) {
      P.jurusBar(ctx, 2, 2);
      const k = ease(clamp((l - 2.5) / 1.2, 0, 1));
      P.angkotMap(ctx, 140, 240, 780, 560, false); P.angkotMap(ctx, 1000, 240, 780, 560, true);
      ctx.globalAlpha = 1 - k; card(ctx, 1000, 240, 780, 560, { fill: "#EAF2EE" }); ctx.globalAlpha = 1;
      H.arrowIcon(ctx, "east", 960, 520, 70, C.accentDark);
      text(ctx, "jalan sebenarnya", 530, 840, 30, { align: "center", color: C.ink2, weight: 800 }); if (k > 0.5) text(ctx, "peta jalur: rute + tempat berhenti", 1390, 840, 30, { align: "center", color: C.good, weight: 800 });
    },
    abstract_name(ctx, b, l) { P.jurusBar(ctx, 3, 2); P.jurusCard(ctx, 2, "abstraction"); if (l > 3) text(ctx, "yang penting tergantung tujuannya", 960, 780, 32, { align: "center", color: C.ink2, weight: 700 }); },

    algo_messy(ctx, b, l) {
      P.jurusBar(ctx, 3, 3);
      const items = ["bagikan snack", "sambutan", "tari", "musik", "drama", "foto bersama"]; const n = reveal(l, 1.0, 0.6, 6);
      items.forEach((s, i) => { if (i >= n) return; P.note(ctx, 240 + (i % 3) * 400 + (i % 2) * 30, 300 + Math.floor(i / 3) * 220, 330, 140, s, { i, rot: ((i * 7) % 5 - 2) * 0.08, size: 34 }); });
      kiko(ctx, 1560, 560, 170, 0, { mood: n >= 6 ? "confused" : "happy" });
      if (n >= 6) bubble(ctx, 1380, 360, 360, "Yang mana dulu?", 32, { tailX: 1540, tailDir: 20, fill: C.badBg, stroke: C.bad, color: C.bad });
    },
    algo_order(ctx, b, l) {
      P.jurusBar(ctx, 3, 3);
      const items = ["sambutan", "tari", "musik", "drama", "foto bersama", "bagikan snack"]; const n = reveal(l, 0.8, 0.75, 6);
      P.steps(ctx, 560, 240, items.slice(0, Math.max(1, n)), { w: 800, rowH: 92, size: 36 });
      if (n >= 6) text(ctx, "semua tahu gilirannya", 960, 830, 34, { align: "center", color: C.good, weight: 900 });
    },
    algo_matters(ctx, b, l) {
      P.jurusBar(ctx, 3, 3);
      text(ctx, "URUTAN A", 480, 250, 30, { align: "center", color: C.bad, weight: 900 }); text(ctx, "URUTAN B", 1440, 250, 30, { align: "center", color: C.good, weight: 900 });
      P.steps(ctx, 180, 280, ["bagikan snack", "sambutan", "tari", "musik"], { w: 600, rowH: 80, size: 32, state: ["bad", "", "bad", ""] , notes: ["", "", "penonton sibuk makan", ""] });
      P.steps(ctx, 1140, 280, ["sambutan", "tari", "musik", "bagikan snack"], { w: 600, rowH: 80, size: 32, state: ["", "good", "", "good"] });
      if (l > 3) { card(ctx, 480, 680, 960, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "langkah sama, urutan beda, hasil beda", 960, 732, 36, { align: "center", weight: 900 }); }
    },
    algo_name(ctx, b, l) { P.jurusBar(ctx, 4, 3); P.jurusCard(ctx, 3, "algorithm"); if (l > 3.5) text(ctx, "resep masakan dan petunjuk jalan juga algoritma", 960, 780, 32, { align: "center", color: C.ink2, weight: 700 }); },

    bebrasBoard(ctx, order, opt = {}) {
      // kartu penampilan sesuai urutan (indeks ke P.SHOWS); opt.badges = nomor urut; opt.mark[i] = "good"|"bad"
      order.forEach((si, i) => { const [name, players] = P.SHOWS[si]; const st = (opt.mark || [])[i]; P.show(ctx, 200 + i * 400, opt.y || 300, 340, 220, name, players, { badge: opt.badges ? String(i + 1) : null, fill: st === "bad" ? C.badBg : st === "good" ? C.goodBg : C.panel, stroke: st === "bad" ? C.bad : st === "good" ? C.good : "#D7E2DC", lw: st ? 5 : 3 }); });
      if (opt.legend !== false) Object.entries(P.PLAYER).forEach(([k, [nm]], i) => { P.token(ctx, 560 + i * 280, 600, k, 22); text(ctx, nm, 600 + i * 280, 610, 30, { weight: 800 }); });
    },
    bebras_intro(ctx, b, l) {
      P.jurusBar(ctx, 4, -1);
      text(ctx, "SOAL GAYA BEBRAS", 960, 250, 34, { align: "center", color: C.accentDark, weight: 800 });
      SCENES.bebrasBoard(ctx, [0, 1, 2, 3], { legend: true });
      card(ctx, 360, 680, 1200, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); para(ctx, "Pemain yang sama tidak boleh tampil dua kali berturut-turut: perlu waktu ganti kostum.", 960, 728, 30, 1120, { align: "center", weight: 800, lh: 1.25 });
    },
    bebras_decompose(ctx, b, l) {
      P.jurusBar(ctx, 4, 0);
      const n = reveal(l, 0.8, 1.0, 4); SCENES.bebrasBoard(ctx, [0, 1, 2, 3].slice(0, Math.max(1, n)), {});
      text(ctx, "dekomposisi: daftar penampilan dan pemainnya", 960, 720, 34, { align: "center", color: C.ink2, weight: 800 });
    },
    bebras_pattern(ctx, b, l) {
      P.jurusBar(ctx, 4, 1);
      SCENES.bebrasBoard(ctx, [0, 1, 2, 3], { legend: false });
      const pairs = [["S", [0, 2]], ["D", [0, 3]], ["R", [1, 2]]]; const n = reveal(l, 1.0, 1.1, 3);
      pairs.forEach(([who, idx], i) => { if (i >= n) return; const y = 600 + i * 70; P.token(ctx, 400, y, who, 24); text(ctx, P.PLAYER[who][0] + ": " + idx.map(k => P.SHOWS[k][0]).join(" dan "), 450, y + 10, 32, { weight: 800 }); idx.forEach(k => { const pl = P.SHOWS[k][1], off = (pl.indexOf(who) - (pl.length - 1) / 2) * 64; ctx.strokeStyle = P.PLAYER[who][1]; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(370 + k * 400 + off, 474, 34, 0, Math.PI * 2); ctx.stroke(); }); });
      if (n >= 3) text(ctx, "pola: tiap pemain muncul dua kali", 1400, 700, 32, { align: "center", color: C.accentDark, weight: 900 });
    },
    bebras_abstract(ctx, b, l) {
      P.jurusBar(ctx, 4, 2);
      const keep = l > 2.0;
      const notes = [["lagu pengiring", true], ["warna kostum", true], ["pemain yang sama tidak berurutan", false], ["panjang acara", true], ["siapa MC", true]];
      notes.forEach(([s, drop], i) => { const x = 220 + (i % 3) * 520, y = 300 + Math.floor(i / 3) * 200; const gone = drop && keep; ctx.globalAlpha = gone ? 0.25 : 1; P.note(ctx, x, y, 440, 130, s, { i, size: 30, stroke: !drop ? C.good : null, fill: !drop ? C.goodBg : undefined }); ctx.globalAlpha = 1; if (gone) { ctx.strokeStyle = C.bad; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 20, y + 20); ctx.lineTo(x + 420, y + 110); ctx.stroke(); } });
      text(ctx, keep ? "abstraksi: hanya satu syarat yang penting" : "mana yang penting?", 960, 760, 36, { align: "center", color: C.ink2, weight: 800 });
    },
    bebras_algo(ctx, b, l) {
      P.jurusBar(ctx, 4, 3);
      const n = reveal(l, 1.2, 1.3, 3); const mark = n >= 1 ? ["good", "good", "", ""] : []; if (n >= 2) { mark[1] = "bad"; mark[2] = "bad"; }
      SCENES.bebrasBoard(ctx, [0, 1, 2, 3], { badges: true, mark, legend: false });
      const notes = ["tari → musik: pemain beda, aman ✓", "musik → drama: Rama dua kali berurutan ✕"]; notes.slice(0, n).forEach((s, i) => text(ctx, s, 960, 620 + i * 60, 34, { align: "center", weight: 900, color: i ? C.bad : C.good }));
      if (n >= 3) { card(ctx, 560, 740, 800, 80, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "urutan ini gagal, coba lagi", 960, 792, 34, { align: "center", weight: 900, color: C.bad }); }
    },
    bebras_solve(ctx, b, l) {
      P.jurusBar(ctx, 4, 3);
      const n = reveal(l, 1.2, 1.1, 4); const mark = ["", "", "", ""]; for (let i = 0; i < Math.min(n, 3) + (n >= 1 ? 1 : 0) && i < 4; i++) mark[i] = n > i ? "good" : "";
      SCENES.bebrasBoard(ctx, [0, 1, 3, 2], { badges: true, mark: n >= 3 ? ["good", "good", "good", "good"] : mark, legend: false });
      ["tari → musik ✓", "musik → puisi ✓", "puisi → drama ✓"].slice(0, n).forEach((s, i) => text(ctx, s, 560 + i * 400, 640, 34, { align: "center", weight: 900, color: C.good }));
      if (n >= 4) { card(ctx, 560, 720, 800, 90, { fill: C.goodBg, stroke: C.good, lw: 5 }); text(ctx, "Berhasil! Tari, musik, puisi, drama.", 960, 778, 38, { align: "center", weight: 900, color: C.good }); }
    },
    bebras_wrap(ctx, b, l) {
      P.jurusBar(ctx, 4, -1);
      const n = reveal(l, 0.6, 1.0, 4);
      P.JURUS.forEach(([num, name, desc], i) => { if (i >= n) return; const x = 160 + i * 410; card(ctx, x, 260, 380, 380, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, num, x + 190, 370, 90, { align: "center", weight: 900, color: C.good }); text(ctx, name, x + 190, 470, 38, { align: "center", weight: 900 }); text(ctx, desc, x + 190, 540, 28, { align: "center", weight: 700, color: C.ink2 }); });
      if (n >= 4) text(ctx, "bisa dipakai tanpa komputer", 960, 760, 36, { align: "center", color: C.accentDark, weight: 900 });
      kiko(ctx, 960, 850, 90, 0, { wave: l });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pecah tugas", "kelompokkan potongan tugas"], ["Lanjutkan pola", "tebak yang berikutnya"], ["Pilih yang penting", "buang yang tidak perlu"], ["Urutkan langkah", "susun jadi algoritma"]];
      items.forEach(([t1, t2], i) => { const x = 230 + i * 370; card(ctx, x, 300, 330, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 165, 400, 48, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 165, 418, 48, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x + 165, 530, 32, { align: "center", weight: 900 }); text(ctx, t2, x + 165, 590, 26, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "soal gaya Bebras di halaman latihan episode ini", 960, 800, 34, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
