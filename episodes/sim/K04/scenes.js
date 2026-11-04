/* K04 Simulasi konsep: program robot Kiko di papan kantin (aturan dan gambar papan dari kiko-grid.js / D7.5).
   Papan kiri (x 130–760, y 170–800), panel program tengah (x 840–1370), kolom kanan (x 1400–1800) untuk catatan, pilihan, hasil.
   Baris program (kunci "prog"): "MAJU", "KIRI", "KANAN", "AMBIL"; "U4" = ULANGI 4 KALI:, ">MAJU" = baris menjorok di dalam ULANGI.
   Kunci beat lain: world (W1–W4), cues (potongan narasi tempat tiap langkah mulai), options, marks [[x,y,"A"]], hideGoal, banner,
   phase (telusur a/b), fix (baris yang diganti). Semua gambar di atas y 830. Muat setelah kiko-grid.js dan D7.5/scenes.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, CMD = K.CMD;
  const { rr, text, para, card, kiko, kid, bubble, arrowIcon, ease, clamp, lerp, gridGeom, drawGrid, drawRobotOnGrid, cellCenter } = H;
  const WORLDS = {
    W1: { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [1, 3], tables: [[0, 2], [2, 1]] },
    W2: { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [3, 2], tables: [[1, 2], [2, 0]] },
    W3: { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [4, 4], tables: [[2, 2], [1, 2], [3, 1]] },
    W4: { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [3, 1], tables: [[1, 0], [1, 2]] }
  };
  const PROG_SINTA = ["MAJU", "KIRI", "KIRI", "KIRI", "MAJU", "MAJU", "MAJU", "AMBIL"];
  const PROG_DITO = ["MAJU", "KANAN", "MAJU", "MAJU", "MAJU", "AMBIL"];
  const PROG_LOOP4 = ["MAJU", "KANAN", "U3", ">MAJU", "AMBIL"];
  const GX = 130, GY = 170, CELL = 126;
  const DIRNAME = ["atas", "kanan", "bawah", "kiri"];

  // ---------- program: baris -> langkah ----------
  const parse = s => s[0] === ">" ? { c: s.slice(1), ind: 1 } : s[0] === "U" ? { rep: +s.slice(1) } : { c: s };
  function flat(prog) {
    const rows = prog.map(parse), out = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (r.rep) { const body = []; let j = i + 1; while (j < rows.length && rows[j].ind) body.push(j++); for (let k = 0; k < r.rep; k++) body.forEach(bi => out.push({ c: rows[bi].c, row: bi, loop: i, iter: k + 1 })); i = j - 1; }
      else out.push({ c: r.c, row: i });
    }
    return out;
  }
  const lead = b => b.speech != null && b.start != null ? b.speech - b.start : 0.4;
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * (b.audio || b.dur); };
  // posisi pecahan langkah (u) pada detik l: dari cues bila cocok, kalau tidak dibagi rata dalam ±88% narasi
  function runU(b, l, n, opt = {}) {
    const a = b.audio || b.dur, t0 = opt.t0 != null ? opt.t0 : lead(b) + 0.9, t1 = opt.t1 != null ? opt.t1 : lead(b) + a * 0.88;
    let T;
    const idx = (b.cues || []).map(c => b.text.indexOf(c));
    if (!opt.even && b.cues && idx.every(i => i >= 0)) T = idx.map(i => lead(b) + i / b.text.length * a);
    else T = Array.from({ length: n }, (_, i) => t0 + i * (t1 - t0) / n);
    if (l < T[0]) return 0;
    let k = 0; while (k + 1 < T.length && l >= T[k + 1]) k++;
    const d = Math.max(0.25, Math.min(0.85, (k + 1 < T.length ? T[k + 1] - T[k] : 0.85) - 0.05));
    return Math.min(n, k + clamp((l - T[k]) / d, 0, 1));
  }
  function visited(st, u) { const out = []; for (let i = 0; i <= Math.min(st.length - 1, Math.floor(u)); i++) if (!st[i].crash) out.push([st[i].x, st[i].y]); return out; }

  // ---------- panel program ----------
  function progPanel(ctx, x, y, prog, opt = {}) {
    const rows = prog.map(parse), rh = opt.rh || (rows.length > 8 ? 62 : 68), w = opt.w || 530, sz = opt.size || Math.round(rh * 0.46), ic = opt.icon || Math.round(rh * 0.6);
    if (opt.title) text(ctx, opt.title, x, y - 20, opt.titleSize || 28, { weight: 900, color: C.accentDark });
    rows.forEach((r, i) => {
      const ry = y + i * rh, rx = x + (r.ind ? Math.round(rh * 0.8) : 0), rw = w - (rx - x);
      const active = opt.cur === i || (opt.curLoop === i), done = opt.done && opt.done.includes(i), bad = opt.bad === i, changed = opt.changed === i, dim = opt.dimFrom != null && i >= opt.dimFrom;
      ctx.fillStyle = bad ? C.badBg : active ? "#FFF3D6" : changed ? C.goodBg : r.rep ? "#EEF4FA" : C.panel; rr(ctx, rx, ry, rw, rh - 8, 12); ctx.fill();
      ctx.strokeStyle = bad ? C.bad : active ? C.accent : changed ? C.good : "#D7E2DC"; ctx.lineWidth = active || bad || changed ? 5 : 2; ctx.stroke();
      ctx.save(); if (dim) ctx.globalAlpha = 0.4;
      const cy = ry + (rh - 8) / 2, nr = Math.round(rh * 0.27);
      ctx.fillStyle = done ? C.good : bad ? C.bad : C.ink2; ctx.beginPath(); ctx.arc(rx + nr + 12, cy, nr, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), rx + nr + 12, cy + nr * 0.42, Math.round(nr * 1.1), { align: "center", weight: 900, color: "#fff" });
      const tx = rx + nr * 2 + 26;
      if (r.rep) { text(ctx, "↻", tx + ic * 0.45, cy + sz * 0.42, ic * 0.9, { align: "center", weight: 900, color: C.kikoDark }); text(ctx, "ULANGI " + r.rep + " KALI:", tx + ic + 10, cy + sz * 0.38, sz, { weight: 900, color: C.kikoDark }); if (opt.iter && opt.iter[i]) text(ctx, opt.iter[i], x + w + 22, cy + 10, 28, { weight: 900, color: C.accentDark }); }
      else { arrowIcon(ctx, CMD[r.c].icon, tx + ic * 0.45, cy, ic, C.ink); text(ctx, CMD[r.c].word, tx + ic + 10, cy + sz * 0.38, sz, { weight: 800, color: C.ink }); }
      ctx.restore();
      if (opt.strike === i) { ctx.strokeStyle = C.bad; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(tx, cy); ctx.lineTo(rx + rw - 20, cy); ctx.stroke(); }
      if (opt.notes && opt.notes[i]) { const [s, col] = opt.notes[i]; text(ctx, s, x + w + 22, cy + 10, 26, { weight: 800, color: col || C.good }); }
    });
    return y + rows.length * rh;
  }
  // papan + robot pada langkah u
  function board(ctx, b, prog, u, opt = {}) {
    const world = WORLDS[opt.world || b.world], g = gridGeom(opt.gx || GX, opt.gy || GY, opt.cell || CELL, world), F = flat(prog);
    const p = K.pose(F.map(s => s.c), world, u), st = p.states || K.simulate(F.map(s => s.c), world);
    const hl = (opt.highlight || []).slice();
    drawGrid(ctx, g, world, { hideGoal: p.grabbed || opt.hideGoal, path: u > 0 ? visited(st, u).concat(u % 1 && !p.crash ? [[p.x, p.y]] : []) : null, highlight: hl, marks: opt.marks && opt.marks.map(m => [m[0], m[1], m[2], C.accentDark]) });
    drawRobotOnGrid(ctx, g, p, world);
    return { g, p, F, st, world };
  }
  // baris aktif / selesai dari langkah u
  function rowsState(prog, F, u, p) {
    const crashed = !!(p.finalCrash && u >= p.lastStep), fin = !crashed && u >= F.length;
    const k = Math.min(F.length - 1, Math.floor(u)), doneSteps = fin ? F.length : Math.floor(u);
    const done = [];
    prog.forEach((_, r) => { const idx = []; F.forEach((s, i) => { if (s.row === r || s.loop === r) idx.push(i); }); if (idx.length && Math.max(...idx) < doneSteps) done.push(r); });
    const cur = crashed ? F[p.lastStep - 1].row : fin ? -1 : F[k].row;
    const curLoop = crashed || fin || F[k].loop == null ? -1 : F[k].loop;
    const iter = {}; if (curLoop >= 0) iter[curLoop] = "putaran " + F[k].iter + "/" + parse(prog[curLoop]).rep;
    return { done, cur, curLoop, iter, crashed };
  }
  function resultCard(ctx, s, good, y = 600) {
    card(ctx, 1400, y, 400, 150, { fill: good ? C.goodBg : C.badBg, stroke: good ? C.good : C.bad, lw: 5, r: 20 });
    para(ctx, s, 1600, y + 62, 34, 360, { align: "center", weight: 900, color: good ? C.good : C.bad, lh: 1.2 });
  }
  function startNote(ctx) { text(ctx, "mulai: pojok kiri bawah, menghadap ke atas", GX + 315, GY + 670, 24, { align: "center", weight: 700, color: C.ink2 }); }

  Object.assign(K.SCENES, {
    k4_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menebak ke mana robot berjalan", "menemukan baris yang salah (bug)", "memperbaiki programnya", "menulis program lebih pendek"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 760, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      board(ctx, { world: "W1" }, ["KANAN", "MAJU", "KIRI", "MAJU", "MAJU", "MAJU", "AMBIL"], clamp((l - 1) / 1.1, 0, 7), { world: "W1", gx: 1150, gy: 250, cell: 96 });
    },
    k4_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SIMULASI INI MELENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 460, 290, 1000, 330, { fill: C.bg2, r: 22 });
      text(ctx, "Episode D7.5", 960, 380, 60, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Instruksi untuk Manusia dan Mesin", 960, 450, 40, { align: "center", weight: 800 });
      text(ctx, "maju · belok kiri · belok kanan · ambil", 960, 530, 30, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1640, 700, 110, 0, { wave: l });
    },
    k4_tanya(ctx, b, l) {
      board(ctx, b, b.prog, 0, { hideGoal: b.hideGoal, marks: b.marks });
      progPanel(ctx, 840, 220, b.prog, { title: b.title || "Program" });
      kiko(ctx, 1600, 560, 120, 0, { mood: "confused" });
      const p = 1 + 0.1 * Math.sin(l * 5); text(ctx, "?", 1690, 470, 70 * p, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "Apa yang terjadi?", 1600, 680, 30, { align: "center", weight: 900, color: C.ink2 });
      para(ctx, "Kiko mulai di pojok kiri bawah, menghadap ke atas.", 1600, 730, 24, 380, { align: "center", weight: 700, color: C.ink2, lh: 1.25 });
    },
    k4_tebak(ctx, b, l) {
      const pulse = (b.marks || []).map(m => [m[0], m[1], `rgba(242,177,52,${0.3 + 0.2 * Math.sin(l * 4 + m[0])})`]);
      board(ctx, b, b.prog, 0, { hideGoal: b.hideGoal, marks: b.marks, highlight: pulse });
      progPanel(ctx, 840, 220, b.prog, { title: b.title || "Program" });
      card(ctx, 1390, 140, 420, 690, { fill: "#FFFFFF", stroke: C.accent, lw: 5, r: 22 });
      text(ctx, "TEBAK DULU", 1600, 200, 32, { align: "center", weight: 900, color: C.accentDark });
      b.options.forEach((o, i) => {
        const y = 250 + i * 150; card(ctx, 1410, y, 380, 130, { fill: C.bg2, r: 18 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1456, y + 65, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, "ABC"[i], 1456, y + 76, 30, { align: "center", weight: 900, color: "#fff" });
        const lines = H.wrap(ctx, o, 30, 800, 290); lines.forEach((ln, j) => text(ctx, ln, 1496, y + 65 + 11 - (lines.length - 1) * 18 + j * 36, 30, { weight: 800 }));
      });
      const frac = clamp(l / b.dur, 0, 1); ctx.lineWidth = 12; ctx.strokeStyle = "#D7E2DC"; ctx.beginPath(); ctx.arc(1600, 760, 34, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1600, 760, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    },
    k4_jalan(ctx, b, l) {
      const F = flat(b.prog), u = runU(b, l, F.length, { even: !b.cues });
      const B = board(ctx, b, b.prog, u, { marks: b.marks, hideGoal: b.hideGoal });
      const R = rowsState(b.prog, F, u, B.p);
      progPanel(ctx, 840, 220, b.prog, { title: "Program", cur: R.crashed ? -1 : R.cur, curLoop: R.curLoop, done: R.done, iter: R.iter, changed: b.changed, bad: B.p.crash || R.crashed ? F[B.p.lastStep - 1].row : undefined });
      if (B.p.crash || R.crashed) resultCard(ctx, "Kiko menabrak meja!", false);
      else if (B.p.grabbed) resultCard(ctx, "Bakso terambil!", true);
      else if (B.p.done && !B.p.grabbed) resultCard(ctx, "Tidak ada bakso.", false);
      if (!B.p.done && !B.p.crash) text(ctx, "menghadap ke " + DIRNAME[((Math.round(B.p.ang / (Math.PI / 2)) % 4) + 4) % 4], 1600, 560, 28, { align: "center", weight: 800, color: C.ink2 });
    },
    k4_hasil(ctx, b, l) {
      const F = flat(b.prog), B = board(ctx, b, b.prog, F.length);
      progPanel(ctx, 840, 220, b.prog, { title: "Program", done: b.prog.map((_, i) => i) });
      resultCard(ctx, b.banner, b.good, 300);
      if (l > at(b, "Sekarang")) { kiko(ctx, 1600, 640, 110, 0, { mood: "happy" }); }
    },
    k4_telusur(ctx, b, l) {
      const F = flat(b.prog);
      if (b.phase === "a") {
        const t1 = at(b, "Baris satu"), t2 = at(b, "Kiko menabrak");
        const step = l < t1 ? 0 : l < t2 ? clamp((l - t1) / ((t2 - t1) * 0.9) * 4, 0, 4) : 4;
        const B = board(ctx, b, b.prog, l < t2 ? step : 5.6);
        const notes = {}; ["aman ✓", "menghadap kanan ✓", "aman ✓", "aman ✓"].forEach((s, i) => { if (step >= i + 1) notes[i] = [s, C.good]; });
        if (l > t2) notes[5] = ["menabrak di sini ✕", C.bad];
        progPanel(ctx, 840, 220, b.prog, { title: "Telusuri satu per satu", w: 500, done: Object.keys(notes).map(Number).filter(i => i < 4), cur: l < t2 ? Math.min(3, Math.floor(step)) : 5, bad: l > t2 ? 5 : undefined, notes });
        if (l < at(b, "Kita telusuri")) resultCard(ctx, "Kesalahan dalam program = BUG", false, 600);
      } else {
        const B = board(ctx, b, b.prog, l < at(b, "Seharusnya") ? 5 : 4);
        const world = WORLDS[b.world], g = B.g, [px, py] = cellCenter(g, 2, 1);
        const notes = { 4: ["menghadap ke bawah ✕", C.bad], 5: ["menabrak", C.bad] };
        if (l > at(b, "ke arah meja")) { const [tx, ty] = cellCenter(g, 2, 0); ctx.strokeStyle = C.bad; ctx.lineWidth = 8; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(px, py + 40); ctx.lineTo(tx, ty - 30); ctx.stroke(); ctx.setLineDash([]); }
        if (l > at(b, "Seharusnya")) { notes[4] = ["harus BELOK KIRI", C.good]; const [ux, uy] = cellCenter(g, 2, 2); ctx.strokeStyle = C.good; ctx.lineWidth = 8; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(px, py - 40); ctx.lineTo(ux, uy + 30); ctx.stroke(); ctx.setLineDash([]); }
        progPanel(ctx, 840, 220, b.prog, { title: "Baris yang salah", w: 500, done: [0, 1, 2, 3], bad: 4, notes, dimFrom: 6 });
      }
    },
    k4_perbaiki(ctx, b, l) {
      board(ctx, b, b.prog, 0);
      const t = at(b, "menjadi belok kiri"), old = ["MAJU", "KANAN", "MAJU", "MAJU", "KANAN", "MAJU", "KANAN", "MAJU", "AMBIL"];
      if (l < t) progPanel(ctx, 840, 220, old, { title: "Perbaiki baris 5", w: 500, strike: l > at(b, "diganti") ? b.fix : undefined, bad: b.fix });
      else progPanel(ctx, 840, 220, b.prog, { title: "Perbaiki baris 5", w: 500, changed: b.fix, notes: { [b.fix]: ["diganti ✓", C.good] } });
      if (l > at(b, "Baris yang lain")) resultCard(ctx, "Baris lain tetap sama", true, 640);
    },
    k4_ulangi_kenal(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "PERULANGAN", 960, 196, 36, { align: "center", weight: 900, color: C.accentDark });
      progPanel(ctx, 220, 290, ["MAJU", "MAJU", "MAJU", "MAJU"], { title: "Tanpa perulangan: 4 baris", w: 460, rh: 80 });
      const t1 = at(b, "ulangi empat"), t2 = at(b, "Cara menulis");
      if (l > t1) { const u = ease((l - t1) / 0.6); ctx.save(); ctx.globalAlpha = u; arrowIcon(ctx, "right", 860, 450, 90, C.accent); text(ctx, "lebih singkat", 860, 540, 28, { align: "center", weight: 900, color: C.accentDark }); progPanel(ctx, 1040, 290, ["U4", ">MAJU"], { title: "Dengan perulangan: 2 baris", w: 560, rh: 80 }); ctx.restore(); }
      if (l > t2) { card(ctx, 1040, 520, 560, 150, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); para(ctx, "Baris yang menjorok dijalankan 4 kali.", 1320, 582, 32, 500, { align: "center", weight: 900, lh: 1.25 }); }
      kiko(ctx, 450, 720, 90, 0);
    },
    k4_banding_ulangi(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "HASILNYA SAMA", 960, 190, 34, { align: "center", weight: 900, color: C.accentDark });
      progPanel(ctx, 200, 270, ["MAJU", "MAJU", "MAJU", "MAJU", "KANAN", "MAJU", "MAJU", "MAJU", "MAJU", "AMBIL"], { title: "Tanpa perulangan: 10 baris", w: 440, rh: 52, size: 24, icon: 28 });
      if (l > at(b, "Dengan perulangan")) {
        text(ctx, "=", 790, 520, 90, { align: "center", weight: 900, color: C.ink2 });
        progPanel(ctx, 900, 270, ["U4", ">MAJU", "KANAN", "U4", ">MAJU", "AMBIL"], { title: "Dengan perulangan: 6 baris", w: 520, rh: 70, changed: -1 });
        board(ctx, { world: "W3" }, ["U4", ">MAJU", "KANAN", "U4", ">MAJU", "AMBIL"], 10, { world: "W3", gx: 1480, gy: 470, cell: 58 });
      }
      if (l > at(b, "angkanya")) { card(ctx, 900, 720, 520, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "mau 10 kotak? ganti 4 jadi 10", 1160, 777, 28, { align: "center", weight: 900 }); }
    },
    k4_dua(ctx, b, l) {
      const run = b.run, u = run ? clamp((l - lead(b) - 0.8) / ((b.audio || b.dur) * 0.8), 0, 1) : 0;
      [[PROG_SINTA, "Program Sinta", 130, u * 8], [PROG_DITO, "Program Dito", 980, Math.min(6, u * 8)]].forEach(([prog, title, x0, uu]) => {
        card(ctx, x0 - 10, 130, 830, 700, { fill: "#FFFFFF", stroke: title.includes("Sinta") ? C.bad : C.kiko, lw: 4, r: 22 });
        text(ctx, title + " (" + prog.length + " baris)", x0 + 405, 182, 30, { align: "center", weight: 900, color: title.includes("Sinta") ? C.bad : C.kiko });
        const B = board(ctx, { world: "W4" }, prog, uu, { world: "W4", gx: x0 + 20, gy: 230, cell: 84 });
        const R = rowsState(prog, flat(prog), uu, B.p);
        progPanel(ctx, x0 + 470, 230, prog, { w: 330, rh: 54, size: 22, icon: 30, cur: run ? R.cur : -1, done: run ? R.done : [], changed: !run && l > at(b, "diganti") && title.includes("Dito") ? 1 : undefined });
        if (!run && l > at(b, "tiga baris belok") && title.includes("Sinta")) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, x0 + 462, 230 + 54 - 6, 346, 54 * 3 + 4, 14); ctx.stroke(); }
        if (run && B.p.grabbed) { card(ctx, x0 + 20, 700, 790, 100, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 }); text(ctx, title.includes("Dito") ? "Sampai! Selesai lebih dulu." : "Sampai juga!", x0 + 415, 762, 32, { align: "center", weight: 900, color: C.good }); }
      });
    },
    k4_pendek(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "TUJUAN SAMA, PANJANG BERBEDA", 960, 190, 34, { align: "center", weight: 900, color: C.accentDark });
      const cols = [[PROG_SINTA, "Sinta: 8 baris", C.bad, 0], [PROG_DITO, "Dito: 6 baris", C.kiko, at(b, "program Dito")], [PROG_LOOP4, "Perulangan: 5 baris", C.good, at(b, "dengan perulangan")]];
      cols.forEach(([prog, t, col, t0], i) => { if (l < t0) return; const x = 200 + i * 540; text(ctx, t, x + 210, 262, 30, { align: "center", weight: 900, color: col }); progPanel(ctx, x, 290, prog, { w: 420, rh: 52, size: 22, icon: 28, bad: i === 0 && l < at(b, "Program Sinta") ? undefined : undefined }); });
      if (l < at(b, "Program Sinta")) { card(ctx, 700, 300, 600, 140, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "3 × belok kiri = 1 × belok kanan", 1000, 385, 34, { align: "center", weight: 900 }); }
      if (l > at(b, "Makin pendek")) { card(ctx, 660, 740, 600, 76, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "makin pendek, makin mudah diperiksa", 960, 790, 28, { align: "center", weight: 900, color: C.good }); }
    },
    k4_latihan(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "COBA SENDIRI DI HALAMAN LATIHAN", 960, 192, 32, { align: "center", weight: 900, color: C.accentDark });
      // tiruan halaman latihan D7.5 (generik)
      card(ctx, 200, 230, 760, 570, { fill: C.bg, stroke: "#B7C4CC", lw: 3, r: 20 });
      card(ctx, 220, 248, 720, 50, { fill: "#fff", r: 10 }); text(ctx, "belajar-informatika.vercel.app/d75", 580, 282, 24, { align: "center", weight: 800, color: C.kikoDark });
      const tB = at(b, "Buat 3"), lv = l > tB ? 4 : 1;
      ["Tebak", "Perbaiki", "Buat 1", "Buat 2", "Buat 3"].forEach((s, i) => { card(ctx, 222 + i * 144, 314, 134, 48, { fill: i === lv ? C.accent : "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, s, 289 + i * 144, 346, 22, { align: "center", weight: 900 }); });
      const world = lv === 1 ? { cols: 5, rows: 5, start: [0, 0], dir: 0, goal: [1, 2], tables: [[0, 2]] } : { cols: 5, rows: 5, start: [0, 0], dir: 1, goal: [4, 3], tables: [[0, 1], [2, 2], [3, 0], [2, 4]] };
      const g = gridGeom(240, 390, 76, world); drawGrid(ctx, g, world); drawRobotOnGrid(ctx, g, { x: world.start[0], y: world.start[1], ang: world.dir * Math.PI / 2 }, world);
      ["MAJU", "BELOK KIRI", "BELOK KANAN", "AMBIL"].forEach((s, i) => { card(ctx, 660 + (i % 2) * 140, 400 + Math.floor(i / 2) * 60, 130, 50, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, s, 725 + (i % 2) * 140, 432 + Math.floor(i / 2) * 60, 18, { align: "center", weight: 800 }); });
      card(ctx, 660, 700, 270, 60, { fill: C.accent, r: 12 }); text(ctx, "▶ Jalankan", 795, 740, 26, { align: "center", weight: 900 });
      text(ctx, lv === 1 ? "Perbaiki: cari baris yang salah" : "Buat 3: paling banyak 12 perintah", 795, 600, 20, { align: "center", weight: 800, color: C.ink2 });
      card(ctx, 1040, 260, 700, 330, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1390, 330, 34, { align: "center", weight: 900 });
      para(ctx, "Gambar papan 5×5 di kertas, tulis program untuk Kiko, lalu tukar dengan temanmu. Tebak, jalankan dengan jari, dan perbaiki bersama.", 1390, 390, 30, 620, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1680, 730, 90, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
