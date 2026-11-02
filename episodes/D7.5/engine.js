/* Kiko engine: deterministic frame drawing for episode D7.5.
   draw(ctx, t) renders the frame at time t (seconds) on a 1920x1080 canvas. */
(function (global) {
  const W = 1920, H = 1080;
  const FONT = "Inter, 'Segoe UI', Roboto, Arial, sans-serif";
  const C = {
    bg: "#EAF2EE", bg2: "#DCE9E2", ink: "#1F2A33", ink2: "#4A5A66", panel: "#FFFFFF",
    tile: "#F7FAF8", tileLine: "#C9D8D0", table: "#A4653A", tableTop: "#C98A57",
    kiko: "#2E7E9A", kikoDark: "#1F5A6E", kikoLight: "#8FD0E6", eye: "#FFFFFF", pupil: "#1F2A33",
    accent: "#F2B134", accentDark: "#B57A12", good: "#2E9E5B", bad: "#D9443B", goodBg: "#DDF3E4", badBg: "#FBE1DF",
    sub: "#1F2A33", subText: "#FFFFFF", star: "#F2B134", skin: "#F1C9A5", skin2: "#C98A57", hair: "#2B2118",
    uniform: "#FFFFFF", pants: "#2F4E7D", bubble: "#FFFFFF", muted: "#9AAFA6"
  };
  const CMD = {
    MAJU: { word: "MAJU", icon: "up" },
    KIRI: { word: "BELOK KIRI", icon: "left" },
    KANAN: { word: "BELOK KANAN", icon: "right" },
    AMBIL: { word: "AMBIL", icon: "grab" }
  };
  const ease = u => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;

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

  // ---------- drawing helpers ----------
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function text(ctx, s, x, y, size, opt = {}) {
    ctx.font = `${opt.weight || 600} ${size}px ${FONT}`; ctx.fillStyle = opt.color || C.ink;
    ctx.textAlign = opt.align || "left"; ctx.textBaseline = opt.base || "alphabetic"; ctx.fillText(s, x, y);
  }
  function wrap(ctx, s, size, weight, maxW) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    const words = s.split(" "), lines = []; let cur = "";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }
  function para(ctx, s, x, y, size, maxW, opt = {}) {
    const lines = wrap(ctx, s, size, opt.weight || 500, maxW); const lh = size * (opt.lh || 1.35);
    lines.forEach((l, i) => text(ctx, l, x, y + i * lh, size, opt));
    return lines.length * lh;
  }
  function arrowIcon(ctx, kind, cx, cy, s, color) {
    ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = s * 0.16; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (kind === "up") {
      ctx.beginPath(); ctx.moveTo(0, s * 0.45); ctx.lineTo(0, -s * 0.3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.32, -s * 0.05); ctx.lineTo(0, -s * 0.45); ctx.lineTo(s * 0.32, -s * 0.05); ctx.stroke();
    } else if (kind === "left" || kind === "right") {
      const k = kind === "left" ? -1 : 1;
      ctx.beginPath(); ctx.moveTo(0, s * 0.45); ctx.lineTo(0, -s * 0.05); ctx.quadraticCurveTo(0, -s * 0.32, k * s * 0.28, -s * 0.32); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(k * s * 0.12, -s * 0.5); ctx.lineTo(k * s * 0.4, -s * 0.32); ctx.lineTo(k * s * 0.12, -s * 0.14); ctx.stroke();
    } else if (kind === "east") {
      ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(s * 0.3, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 0.28); ctx.lineTo(s * 0.4, 0); ctx.lineTo(s * 0.05, s * 0.28); ctx.stroke();
    } else if (kind === "grab") {
      ctx.beginPath(); ctx.arc(0, s * 0.12, s * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.42); ctx.lineTo(-s * 0.4, -s * 0.12); ctx.moveTo(s * 0.4, -s * 0.42); ctx.lineTo(s * 0.4, -s * 0.12);
      ctx.moveTo(-s * 0.4, -s * 0.42); ctx.lineTo(s * 0.4, -s * 0.42); ctx.stroke();
    }
    ctx.restore();
  }
  function bakso(ctx, cx, cy, s, opt = {}) {
    // a bowl of bakso: the goal
    ctx.save(); ctx.translate(cx, cy);
    if (opt.glow) { ctx.beginPath(); ctx.arc(0, 0, s * 0.62, 0, Math.PI * 2); ctx.fillStyle = "rgba(242,177,52,0.22)"; ctx.fill(); }
    ctx.fillStyle = "#E4EEF5"; ctx.beginPath(); ctx.moveTo(-s * 0.46, -s * 0.05); ctx.quadraticCurveTo(-s * 0.4, s * 0.45, 0, s * 0.45); ctx.quadraticCurveTo(s * 0.4, s * 0.45, s * 0.46, -s * 0.05); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#8FA9BD"; ctx.lineWidth = s * 0.05; ctx.stroke();
    ctx.fillStyle = "#C8B49A"; ctx.beginPath(); ctx.ellipse(0, -s * 0.05, s * 0.44, s * 0.14, 0, 0, Math.PI * 2); ctx.fill();
    for (const [dx, dy, r] of [[-0.16, -0.1, 0.13], [0.14, -0.12, 0.13], [0, -0.22, 0.12]]) {
      ctx.fillStyle = "#9A7B5B"; ctx.beginPath(); ctx.arc(dx * s, dy * s, r * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#B8977A"; ctx.beginPath(); ctx.arc(dx * s - r * s * 0.3, dy * s - r * s * 0.3, r * s * 0.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#4CA64C"; for (const dx of [-0.26, 0.1, 0.26]) { ctx.beginPath(); ctx.arc(dx * s, -s * 0.07, s * 0.045, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function table(ctx, x, y, w, h) {
    ctx.fillStyle = C.table; rr(ctx, x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.55, 10); ctx.fill();
    ctx.fillStyle = C.tableTop; rr(ctx, x + w * 0.06, y + h * 0.18, w * 0.88, h * 0.3, 10); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(x + w * 0.16, y + h * 0.5, w * 0.08, h * 0.35); ctx.fillRect(x + w * 0.76, y + h * 0.5, w * 0.08, h * 0.35);
  }
  function kiko(ctx, cx, cy, s, ang, opt = {}) {
    ctx.save(); ctx.translate(cx, cy);
    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.beginPath(); ctx.ellipse(0, s * 0.42, s * 0.42, s * 0.12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(ang);
    // wheels
    ctx.fillStyle = C.kikoDark; rr(ctx, -s * 0.46, -s * 0.2, s * 0.12, s * 0.5, 5); ctx.fill(); rr(ctx, s * 0.34, -s * 0.2, s * 0.12, s * 0.5, 5); ctx.fill();
    // body
    ctx.fillStyle = opt.flash ? `rgba(217,68,59,${0.5 + 0.5 * opt.flash})` : C.kiko; rr(ctx, -s * 0.38, -s * 0.36, s * 0.76, s * 0.72, s * 0.16); ctx.fill();
    // visor (front, facing up)
    ctx.fillStyle = C.kikoLight; rr(ctx, -s * 0.26, -s * 0.33, s * 0.52, s * 0.3, s * 0.1); ctx.fill();
    // eyes
    const mood = opt.mood || "happy";
    ctx.fillStyle = C.pupil;
    if (mood === "sad") { ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.18, s * 0.05, 0, Math.PI * 2); ctx.arc(s * 0.12, -s * 0.18, s * 0.05, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.03; ctx.beginPath(); ctx.arc(0, -s * 0.03, s * 0.08, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (mood === "confused") { ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.18, s * 0.05, 0, Math.PI * 2); ctx.arc(s * 0.12, -s * 0.18, s * 0.035, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.03; ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.06); ctx.lineTo(s * 0.08, -s * 0.09); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.18, s * 0.055, 0, Math.PI * 2); ctx.arc(s * 0.12, -s * 0.18, s * 0.055, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.03; ctx.beginPath(); ctx.arc(0, -s * 0.1, s * 0.08, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    // front pointer
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.38); ctx.lineTo(s * 0.1, -s * 0.38); ctx.lineTo(0, -s * 0.5); ctx.closePath(); ctx.fill();
    // antenna
    ctx.strokeStyle = C.kikoDark; ctx.lineWidth = s * 0.04; ctx.beginPath(); ctx.moveTo(0, s * 0.36); ctx.lineTo(0, s * 0.5); ctx.stroke();
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(0, s * 0.52, s * 0.07, 0, Math.PI * 2); ctx.fill();
    // tray with bakso when grabbed
    if (opt.grabbed) bakso(ctx, 0, s * 0.05, s * 0.45);
    ctx.restore();
    if (opt.wave !== undefined) { // arm waving (title scene)
      ctx.save(); ctx.translate(cx + s * 0.42, cy - s * 0.1); ctx.rotate(-0.6 + Math.sin(opt.wave * 6) * 0.4);
      ctx.strokeStyle = C.kikoDark; ctx.lineWidth = s * 0.08; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s * 0.3, -s * 0.3); ctx.stroke();
      ctx.fillStyle = C.kikoLight; ctx.beginPath(); ctx.arc(s * 0.32, -s * 0.33, s * 0.09, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
  function kid(ctx, cx, cy, s, opt = {}) {
    // simple student figure, standing, facing viewer
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.beginPath(); ctx.ellipse(0, s * 1.02, s * 0.5, s * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pants; rr(ctx, -s * 0.3, s * 0.35, s * 0.6, s * 0.5, s * 0.1); ctx.fill();
    ctx.fillStyle = C.skin; ctx.fillRect(-s * 0.24, s * 0.8, s * 0.16, s * 0.2); ctx.fillRect(s * 0.08, s * 0.8, s * 0.16, s * 0.2);
    ctx.fillStyle = C.uniform; rr(ctx, -s * 0.36, -s * 0.12, s * 0.72, s * 0.56, s * 0.12); ctx.fill();
    ctx.strokeStyle = "#D5DDE2"; ctx.lineWidth = s * 0.025; rr(ctx, -s * 0.36, -s * 0.12, s * 0.72, s * 0.56, s * 0.12); ctx.stroke();
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(0, -s * 0.42, s * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = opt.hairColor || C.hair; ctx.beginPath(); ctx.arc(0, -s * 0.5, s * 0.33, Math.PI, 0); ctx.fill();
    if (opt.hair === "long") { ctx.fillRect(-s * 0.33, -s * 0.5, s * 0.12, s * 0.45); ctx.fillRect(s * 0.21, -s * 0.5, s * 0.12, s * 0.45); }
    ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(-s * 0.11, -s * 0.4, s * 0.035, 0, Math.PI * 2); ctx.arc(s * 0.11, -s * 0.4, s * 0.035, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.025; ctx.beginPath(); ctx.arc(0, -s * 0.33, s * 0.08, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    // arms
    ctx.strokeStyle = C.skin; ctx.lineWidth = s * 0.11; ctx.lineCap = "round"; ctx.beginPath();
    if (opt.point) { ctx.moveTo(s * 0.32, s * 0.02); ctx.lineTo(s * 0.75, -s * 0.2); } else { ctx.moveTo(s * 0.34, s * 0.02); ctx.lineTo(s * 0.42, s * 0.38); }
    ctx.moveTo(-s * 0.34, s * 0.02); ctx.lineTo(-s * 0.42, s * 0.38); ctx.stroke();
    ctx.restore();
  }
  function bubble(ctx, x, y, w, s, size, opt = {}) {
    const lines = wrap(ctx, s, size, 600, w - 48); const h = lines.length * size * 1.3 + 40;
    ctx.fillStyle = opt.fill || C.bubble; ctx.strokeStyle = opt.stroke || "#B7C7BF"; ctx.lineWidth = 3;
    rr(ctx, x, y - h, w, h, 22); ctx.fill(); ctx.stroke();
    const tx = opt.tailX !== undefined ? opt.tailX : x + 60;
    ctx.beginPath(); ctx.moveTo(tx - 16, y); ctx.lineTo(tx + 16, y); ctx.lineTo(tx + (opt.tailDir || 0), y + 28); ctx.closePath(); ctx.fillStyle = opt.fill || C.bubble; ctx.fill();
    ctx.strokeStyle = opt.stroke || "#B7C7BF"; ctx.beginPath(); ctx.moveTo(tx - 16, y); ctx.lineTo(tx + (opt.tailDir || 0), y + 28); ctx.lineTo(tx + 16, y); ctx.stroke();
    lines.forEach((l, i) => text(ctx, l, x + 24, y - h + 24 + size + i * size * 1.3, size, { color: opt.color || C.ink, weight: 600 }));
    return h;
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
  function card(ctx, x, y, w, h, opt = {}) { ctx.fillStyle = opt.fill || C.panel; rr(ctx, x, y, w, h, opt.r || 26); ctx.fill(); if (opt.stroke) { ctx.strokeStyle = opt.stroke; ctx.lineWidth = opt.lw || 4; ctx.stroke(); } }

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

  // run progress within a beat: steps spread over the reading window
  function runU(beat, local, n, lead = 1.2) { const span = Math.max(1, beat.audio - lead - 0.6); return clamp((local - lead) / span * n, 0, n); }

  // ---------- scenes ----------
  const GX = 150, GY = 150, CELL = 136;
  const SCENES = {
    title(ctx, b, l, t, TL) {
      card(ctx, 160, 160, 1600, 700, { fill: C.panel });
      kiko(ctx, 420, 520, 260, 0, { wave: l, mood: "happy" });
      text(ctx, "Informatika · Fase D · Episode " + TL.episode, 720, 330, 34, { color: C.ink2, weight: 700 });
      para(ctx, TL.title, 720, 440, 92, 980, { weight: 900, lh: 1.1 });
      text(ctx, "Dengarkan, atau baca teksnya pelan-pelan.", 720, 700, 36, { color: C.ink2, weight: 600 });
      arrowIcon(ctx, "up", 1560, 360, 70, C.kikoLight); arrowIcon(ctx, "right", 1660, 360, 70, C.kikoLight);
    },
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
    quiz(ctx, b, l, t, TL, answered) {
      const q = TL.quizzes[b.quiz]; card(ctx, 200, 150, 1520, 740, { stroke: C.accent, lw: 6 });
      text(ctx, "CEK PEMAHAMAN", 960, 230, 32, { align: "center", color: C.accentDark, weight: 800 });
      para(ctx, q.q, 960, 320, 44, 1360, { weight: 800, align: "center", lh: 1.3 });
      q.options.forEach((o, i) => {
        const y = 470 + i * 120; const right = answered && i === q.answer;
        card(ctx, 320, y, 1280, 96, { fill: right ? C.goodBg : answered ? "#F4F6F5" : C.bg2, stroke: right ? C.good : "#CFDCD5", lw: right ? 6 : 3 });
        ctx.fillStyle = right ? C.good : C.kiko; ctx.beginPath(); ctx.arc(380, y + 48, 30, 0, Math.PI * 2); ctx.fill();
        text(ctx, "ABC"[i], 380, y + 61, 34, { align: "center", color: "#fff", weight: 900 });
        text(ctx, o, 440, y + 62, 38, { weight: 700, color: answered && !right ? C.muted : C.ink });
        if (right) text(ctx, "✓", 1540, y + 66, 54, { align: "center", color: C.good, weight: 900 });
      });
      if (!answered) { // thinking timer
        const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(1640, 230, 40, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1640, 230, 40, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
        text(ctx, "Pikirkan dulu, jangan buru-buru.", 960, 860, 32, { align: "center", color: C.ink2, weight: 600 });
      }
    },
    quiz_answer(ctx, b, l, t, TL) { SCENES.quiz(ctx, b, l, t, TL, true); },
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
      if (opt.result) { text(ctx, "Kiko berhenti di sini", 1290, 790, 40, { align: "center", color: C.good, weight: 900 }); text(ctx, "Tebak → Jalankan → Bandingkan", 1290, 860, 32, { align: "center", color: C.ink2, weight: 700 }); }
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
      if (b.id === "s5c") { card(ctx, 1000, 720, 620, 150, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "PSEUDOCODE", 1310, 780, 40, { align: "center", weight: 900 }); text(ctx, "urut, jelas, mudah jadi program", 1310, 835, 30, { align: "center", color: C.ink2, weight: 700 }); }
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
    },
    recap(ctx, b, l) {
      card(ctx, 160, 140, 1600, 760);
      text(ctx, "TIGA HAL UNTUK DIINGAT", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = ["Mesin hanya mengerti perintah yang terbatas.", "Urutan perintah menentukan hasil.", "Tebak, jalankan, perbaiki."];
      const show = clamp(Math.floor((l - 0.6) / 2.2) + 1, 1, 3);
      items.forEach((s, i) => { if (i >= show) return; card(ctx, 300, 290 + i * 180, 1320, 140, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(380, 360 + i * 180, 40, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 380, 376 + i * 180, 40, { align: "center", color: "#fff", weight: 900 }); text(ctx, s, 450, 375 + i * 180, 42, { weight: 800 }); });
      kiko(ctx, 1620, 820, 130, 0);
    },
    outro(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE BERIKUTNYA", 960, 320, 34, { align: "center", color: C.accentDark, weight: 900 });
      text(ctx, "D7.6", 960, 440, 60, { align: "center", weight: 900 });
      text(ctx, "Data Terstruktur di Sekitar Kita", 960, 530, 54, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Latihan robot Kiko ada di halaman episode ini.", 960, 680, 34, { align: "center", color: C.ink2, weight: 600 });
      kiko(ctx, 960, 760 + 20, 140, 0, { wave: l });
    }
  };

  function beatAt(TL, t) {
    let b = TL.beats[0];
    for (const x of TL.beats) { if (t >= x.start) b = x; else break; }
    return b;
  }
  function draw(ctx, t, TL, opt = {}) {
    const b = beatAt(TL, t); const l = t - b.start;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    // header
    text(ctx, TL.episode + " · " + TL.title, 60, 78, 30, { color: C.ink2, weight: 700 });
    text(ctx, TL.segments[b.seg], 1860, 78, 30, { color: C.accentDark, weight: 800, align: "right" });
    ctx.fillStyle = C.bg2; ctx.fillRect(0, 100, W, 6); ctx.fillStyle = C.accent; ctx.fillRect(0, 100, W * clamp(t / TL.total, 0, 1), 6);
    const fn = SCENES[b.scene]; if (fn) fn(ctx, b, l, t, TL);
    // narration card (burned-in text the student reads)
    if (opt.subtitles !== false) {
      const size = 44; const lines = wrap(ctx, b.text, size, 700, 1660);
      const h = lines.length * size * 1.3 + 44; const y0 = 1056 - h;
      ctx.fillStyle = "rgba(31,42,51,0.92)"; rr(ctx, 100, y0, 1720, h, 20); ctx.fill();
      // reading progress (how far along the text the reader should be)
      const frac = clamp(l / b.audio, 0, 1); ctx.fillStyle = C.accent; rr(ctx, 100, y0 + h - 8, 1720 * frac, 8, 4); ctx.fill();
      lines.forEach((ln, i) => text(ctx, ln, 960, y0 + 22 + size + i * size * 1.3, size, { align: "center", color: C.subText, weight: 700 }));
    }
    ctx.restore();
    return b;
  }

  global.Kiko = { draw, beatAt, simulate, pose, W, H, C, CMD, FONT, helpers: { rr, text, wrap, para, arrowIcon, bakso, table, kiko, kid, bubble, gridGeom, cellCenter, drawGrid, drawRobotOnGrid, drawProgram, card },
    worlds: { WORLD_A, WORLD_P, WORLD_BUG, WORLD_MAKE, WORLD_DEMO }, programs: { PROG_A, PROG_B, PROG_P, PROG_BUG, PROG_FIX } };
})(typeof window !== "undefined" ? window : globalThis);
