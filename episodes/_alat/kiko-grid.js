/* Kiko grid: dunia papan robot (kotak, meja, bakso), simulasi perintah MAJU/KIRI/KANAN/AMBIL,
   dan panel daftar perintah. Dipakai D7.5 dan episode pemrograman berikutnya. Muat setelah kiko-core.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, arrowIcon, bakso, table, kiko, ease, clamp, lerp } = H;
  const CMD = {
    MAJU: { word: "MAJU", icon: "up" },
    KIRI: { word: "BELOK KIRI", icon: "left" },
    KANAN: { word: "BELOK KANAN", icon: "right" },
    AMBIL: { word: "AMBIL", icon: "grab" }
  };

  // ---------- simulation ----------
  const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // up, right, down, left (y up)
  function simulate(program, world) {
    const states = [{ x: world.start[0], y: world.start[1], d: world.dir || 0, crash: false, grabbed: false, moved: false }];
    let s = states[0];
    for (const c of program) {
      let n = { ...s, crash: false, moved: false };
      if (c === "MAJU") {
        const nx = s.x + DIRS[s.d][0], ny = s.y + DIRS[s.d][1];
        const blocked = nx < 0 || ny < 0 || nx >= world.cols || ny >= world.rows || (world.tables || []).some(t => t[0] === nx && t[1] === ny);
        if (blocked) { n.crash = true; n.cx = nx; n.cy = ny; states.push(n); return states; }
        n.x = nx; n.y = ny; n.moved = true;
      } else if (c === "KIRI") n.d = (s.d + 3) % 4;
      else if (c === "KANAN") n.d = (s.d + 1) % 4;
      else if (c === "AMBIL") n.grabbed = (world.goal && s.x === world.goal[0] && s.y === world.goal[1]) ? true : s.grabbed;
      states.push(n); s = n;
    }
    return states;
  }
  // continuous robot pose at "u" steps executed (fractional)
  function pose(program, world, u) {
    const st = simulate(program, world);
    const n = Math.min(st.length - 1, program.length);
    u = clamp(u, 0, n);
    const i = Math.min(Math.floor(u), n - 1 < 0 ? 0 : n - 1), f = n === 0 ? 0 : u - i;
    const a = st[i], b = st[Math.min(i + 1, st.length - 1)];
    if (n === 0) return { x: a.x, y: a.y, ang: a.d * Math.PI / 2, grabbed: a.grabbed, crash: false, step: 0, done: true };
    const cmd = program[i];
    let x = a.x, y = a.y, ang = a.d * Math.PI / 2, crash = false, flash = 0;
    if (b.crash) {
      const dx = b.cx - a.x, dy = b.cy - a.y;
      const k = f < 0.5 ? ease(f / 0.5) * 0.38 : 0.38 * (1 - ease((f - 0.5) / 0.5));
      x = a.x + dx * k; y = a.y + dy * k; crash = f > 0.45; flash = f > 0.45 ? 1 - (f - 0.45) / 0.55 : 0;
    } else if (cmd === "MAJU") { x = lerp(a.x, b.x, ease(f)); y = lerp(a.y, b.y, ease(f)); }
    else if (cmd === "KIRI" || cmd === "KANAN") {
      const da = cmd === "KANAN" ? Math.PI / 2 : -Math.PI / 2; ang = a.d * Math.PI / 2 + da * ease(f);
    }
    const grabbed = f >= 0.6 ? b.grabbed : a.grabbed;
    const grabbing = cmd === "AMBIL" && f < 0.6;
    const finalCrash = st[st.length - 1].crash;
    return { x, y, ang, grabbed, crash, flash, grabbing, step: i, f, done: u >= n, states: st, finalCrash, lastStep: n };
  }

  // ---------- grid ----------
  function gridGeom(x, y, cell, world) { return { x, y, cell, cols: world.cols, rows: world.rows, w: cell * world.cols, h: cell * world.rows }; }
  function cellCenter(g, cx, cy) { return [g.x + cx * g.cell + g.cell / 2, g.y + (g.rows - 1 - cy) * g.cell + g.cell / 2]; }
  function drawGrid(ctx, g, world, opt = {}) {
    ctx.fillStyle = C.panel; rr(ctx, g.x - 14, g.y - 14, g.w + 28, g.h + 28, 22); ctx.fill();
    for (let r = 0; r < g.rows; r++) for (let c = 0; c < g.cols; c++) {
      const [px, py] = cellCenter(g, c, r); ctx.fillStyle = C.tile; rr(ctx, px - g.cell / 2 + 3, py - g.cell / 2 + 3, g.cell - 6, g.cell - 6, 10); ctx.fill();
      ctx.strokeStyle = C.tileLine; ctx.lineWidth = 2; ctx.stroke();
    }
    if (opt.highlight) for (const [hx, hy, col] of opt.highlight) { const [px, py] = cellCenter(g, hx, hy); ctx.fillStyle = col; rr(ctx, px - g.cell / 2 + 3, py - g.cell / 2 + 3, g.cell - 6, g.cell - 6, 10); ctx.fill(); }
    if (opt.path) { ctx.strokeStyle = "rgba(46,126,154,0.35)"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); opt.path.forEach((p, i) => { const [px, py] = cellCenter(g, p[0], p[1]); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); }
    for (const t of world.tables || []) { const [px, py] = cellCenter(g, t[0], t[1]); table(ctx, px - g.cell / 2, py - g.cell / 2, g.cell, g.cell); }
    if (world.goal && !opt.hideGoal) { const [px, py] = cellCenter(g, world.goal[0], world.goal[1]); bakso(ctx, px, py, g.cell * 0.62, { glow: true }); }
    if (opt.marks) for (const m of opt.marks) { const [px, py] = cellCenter(g, m[0], m[1]); text(ctx, m[2], px, py + 16, 44, { align: "center", color: m[3] || C.bad, weight: 800 }); }
  }
  function drawRobotOnGrid(ctx, g, p, world, opt = {}) {
    const [px, py] = cellCenter(g, p.x, p.y);
    kiko(ctx, px, py, g.cell * 0.78, p.ang, { grabbed: p.grabbed, flash: p.flash, mood: p.crash ? "sad" : opt.mood });
    if (p.crash) { text(ctx, "✕", px + g.cell * 0.4, py - g.cell * 0.3, 60, { color: C.bad, weight: 900, align: "center" }); }
  }
  // program list panel
  function drawProgram(ctx, x, y, program, opt = {}) {
    const rowH = opt.rowH || 78, w = opt.w || 520, style = opt.style || "both";
    if (opt.title) text(ctx, opt.title, x, y - 22, 30, { color: C.ink2, weight: 700 });
    program.forEach((c, i) => {
      const ry = y + i * rowH; const active = opt.active === i, done = opt.done !== undefined && i < opt.done;
      const bad = opt.bad === i, good = opt.goodRows && opt.goodRows.includes(i), changed = opt.changed && opt.changed.includes(i);
      ctx.fillStyle = bad ? C.badBg : active ? "#FFF3D6" : good ? C.goodBg : changed ? C.goodBg : C.panel;
      rr(ctx, x, ry, w, rowH - 10, 16); ctx.fill();
      ctx.strokeStyle = bad ? C.bad : active ? C.accent : changed ? C.good : "#D7E2DC"; ctx.lineWidth = active || bad || changed ? 5 : 2; ctx.stroke();
      ctx.fillStyle = done ? C.good : bad ? C.bad : C.ink2; ctx.beginPath(); ctx.arc(x + 36, ry + (rowH - 10) / 2, 22, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 36, ry + (rowH - 10) / 2 + 10, 26, { color: "#fff", align: "center", weight: 800 });
      if (style !== "words") arrowIcon(ctx, CMD[c].icon, x + 100, ry + (rowH - 10) / 2, 44, C.ink);
      if (style !== "arrows") text(ctx, CMD[c].word, x + (style === "words" ? 80 : 140), ry + (rowH - 10) / 2 + 12, 32, { weight: 700, color: C.ink });
      if (opt.notes && opt.notes[i]) text(ctx, opt.notes[i], x + w + 20, ry + (rowH - 10) / 2 + 12, 30, { weight: 700, color: bad ? C.bad : C.good });
    });
  }
  // run progress within a beat: steps spread over the reading window
  function runU(beat, local, n, lead = 1.2) { const span = Math.max(1, beat.audio - lead - 0.6); return clamp((local - lead) / span * n, 0, n); }

  Object.assign(K, { CMD, simulate, pose });
  Object.assign(H, { gridGeom, cellCenter, drawGrid, drawRobotOnGrid, drawProgram, runU });
})(typeof window !== "undefined" ? window : globalThis);
