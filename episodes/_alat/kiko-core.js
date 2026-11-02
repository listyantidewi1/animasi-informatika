/* Kiko core: mesin gambar bersama untuk semua episode Fase D.
   Kiko.draw(ctx, t, TL) menggambar frame pada detik t di kanvas 1920x1080 secara deterministik.
   Berisi palet, pembantu gambar, tokoh (Kiko, murid), dan adegan umum (judul, kuis, ringkasan, penutup).
   Setiap episode menambahkan adegannya sendiri di scenes.js: Object.assign(Kiko.SCENES, {...}). */
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
  const ease = u => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;

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
  function card(ctx, x, y, w, h, opt = {}) { ctx.fillStyle = opt.fill || C.panel; rr(ctx, x, y, w, h, opt.r || 26); ctx.fill(); if (opt.stroke) { ctx.strokeStyle = opt.stroke; ctx.lineWidth = opt.lw || 4; ctx.stroke(); } }

  // ---------- adegan umum (semua episode) ----------
  const SCENES = {
    title(ctx, b, l, t, TL) {
      card(ctx, 160, 160, 1600, 700, { fill: C.panel });
      kiko(ctx, 420, 520, 260, 0, { wave: l, mood: "happy" });
      text(ctx, "Informatika · Fase D · Episode " + TL.episode, 720, 330, 34, { color: C.ink2, weight: 700 });
      para(ctx, TL.title, 720, 440, 92, 980, { weight: 900, lh: 1.1 });
      text(ctx, "Dengarkan, atau baca teksnya pelan-pelan.", 720, 700, 36, { color: C.ink2, weight: 600 });
      arrowIcon(ctx, "up", 1560, 360, 70, C.kikoLight); arrowIcon(ctx, "right", 1660, 360, 70, C.kikoLight);
    },
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
    recap(ctx, b, l, t, TL) {
      // TL.recap: tiga kalimat pendek dari script.json
      card(ctx, 160, 140, 1600, 760);
      text(ctx, "TIGA HAL UNTUK DIINGAT", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = TL.recap || [];
      const show = clamp(Math.floor((l - 0.6) / 2.2) + 1, 1, Math.max(1, items.length));
      items.forEach((s, i) => { if (i >= show) return; card(ctx, 300, 290 + i * 180, 1320, 140, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(380, 360 + i * 180, 40, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 380, 376 + i * 180, 40, { align: "center", color: "#fff", weight: 900 }); text(ctx, s, 450, 375 + i * 180, 42, { weight: 800 }); });
      kiko(ctx, 1620, 820, 130, 0);
    },
    outro(ctx, b, l, t, TL) {
      // TL.next: {code, title, note} episode berikutnya, dari script.json
      const n = TL.next || {};
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE BERIKUTNYA", 960, 320, 34, { align: "center", color: C.accentDark, weight: 900 });
      text(ctx, n.code || "", 960, 440, 60, { align: "center", weight: 900 });
      text(ctx, n.title || "", 960, 530, 54, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, n.note || "", 960, 680, 34, { align: "center", color: C.ink2, weight: 600 });
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

  global.Kiko = { draw, beatAt, W, H, C, FONT, SCENES,
    helpers: { rr, text, wrap, para, arrowIcon, bakso, table, kiko, kid, bubble, card, ease, clamp, lerp } };
})(typeof window !== "undefined" ? window : globalThis);
