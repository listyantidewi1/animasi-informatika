/* D09 "Celah Keamanan PHP Bocor Lagi": kit gambar bertema PHP + ruang kendali keamanan siber.
   Berdiri sendiri (Canvas 2D, 1920x1080), tanpa logo atau maskot bermerek. Dipakai oleh adegan bab*.js dan sampel.html.
   Semua fungsi menerima ctx dan koordinat; waktu t (detik) hanya untuk denyut/kedip. */
(function (global) {
  const W = 1920, HH = 1080;
  const C = {
    ink0: "#09090B", ink2: "#1C1B20",                            // latar grafit (tema bawaan)
    grid: "rgba(140,148,216,0.07)",
    win: "#121115", bar: "#1E1D23", termBg: "#0B0B0D", lokKosong: "#18171C", lokBebas: "#222127", row1: "#1C1B21", row2: "#16151A",
    php: "#8C94D8", php2: "#5B63A8", phpDeep: "#2B2F5C",           // ungu khas PHP
    term: "#3DDC97", termDim: "#1F7A55",                          // hijau terminal = aman/patch
    red: "#FF4D5E", redDeep: "#7A1424",                           // merah alarm = celah
    amber: "#FFC24B", text: "#EEEDF2", text2: "#B4B1BE", dim: "#6E6A78",
    panel: "rgba(24,23,28,0.94)", line: "rgba(238,237,242,0.14)", white: "#FFFFFF"
  };
  const TEMA = {
    grafit: {},
    plum: { ink0: "#0C070F", ink2: "#221429", win: "#160E1A", bar: "#24172B", termBg: "#0D0810", lokKosong: "#1E1424", lokBebas: "#2A1E30", row1: "#24172B", row2: "#1C1121",
      text: "#F1EAF5", text2: "#BBAFC4", dim: "#75667F", panel: "rgba(30,18,36,0.94)", grid: "rgba(160,120,200,0.08)" }
  };
  const BASE = Object.assign({}, C);
  function tema(n) { Object.assign(C, BASE, TEMA[n] || {}); }
  const SANS = "Inter, 'DejaVu Sans', sans-serif";
  const MONO = "'JetBrains Mono', 'DejaVu Sans Mono', monospace";
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const eio = t => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function text(ctx, s, x, y, size, o = {}) {
    ctx.save(); ctx.font = `${o.weight || 700} ${size}px ${o.mono ? MONO : SANS}`; ctx.fillStyle = o.color || C.text;
    ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic";
    if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur || 18; }
    if (o.spacing) ctx.letterSpacing = o.spacing + "px";
    ctx.fillText(s, x, y); const w = ctx.measureText(s).width; ctx.restore(); return w;
  }
  function glow(ctx, x, y, r, col, a = 1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, 0.55 * a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }

  // ---------- latar: biru tinta + grid radar + pindai tipis ----------
  function bg(ctx, t = 0, o = {}) {
    const g = ctx.createRadialGradient(W * 0.5, HH * 0.42, 80, W * 0.5, HH * 0.5, W * 0.75);
    g.addColorStop(0, C.ink2); g.addColorStop(1, C.ink0); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 64) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, HH); ctx.stroke(); }
    for (let y = 0; y <= HH; y += 64) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
    if (o.scan !== false) { const sy = (t * 140) % (HH + 200) - 100; const s = ctx.createLinearGradient(0, sy - 80, 0, sy + 4); s.addColorStop(0, rgba(C.php, 0)); s.addColorStop(1, rgba(C.php, 0.07)); ctx.fillStyle = s; ctx.fillRect(0, sy - 80, W, 84); }
    if (o.tint) { const tg = ctx.createRadialGradient(W * 0.5, HH * 0.45, 50, W * 0.5, HH * 0.5, W * 0.6); tg.addColorStop(0, rgba(o.tint, 0.14)); tg.addColorStop(1, rgba(o.tint, 0)); ctx.fillStyle = tg; ctx.fillRect(0, 0, W, HH); }
    const v = ctx.createRadialGradient(W / 2, HH / 2, HH * 0.45, W / 2, HH / 2, HH * 1.05); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.45)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, HH);
  }

  // ---------- sorotan sintaks PHP/C sederhana ----------
  const KW = /^(<\?php|\?>|function|return|if|else|for|while|echo|new|null|true|false|static|void|int|char|size_t|const|struct|unsigned|free|memcpy|use|class|public|private)$/;
  function tokens(line) {
    const out = []; const re = /(\/\/.*$|\/\*.*?\*\/|"[^"]*"|'[^']*'|<\?php|\?>|\$[A-Za-z_]\w*|\b\d+(?:\.\d+)*\b|[A-Za-z_]\w*|\s+|.)/g; let m;
    while ((m = re.exec(line))) {
      const s = m[0]; let k = "txt";
      if (s.startsWith("//") || s.startsWith("/*")) k = "com"; else if (s[0] === '"' || s[0] === "'") k = "str";
      else if (s[0] === "$") k = "var"; else if (KW.test(s)) k = "kw"; else if (/^\d/.test(s)) k = "num";
      else if (/^[A-Za-z_]\w*$/.test(s) && line.slice(m.index + s.length).trimStart()[0] === "(") k = "fn";
      out.push({ s, k });
    }
    return out;
  }
  const SYN = { kw: "#C792EA", var: "#8C94D8", str: "#C3E88D", num: "#F78C6C", com: "#6B78A8", fn: "#82AAFF", txt: "#E8ECFF" };
  function code(ctx, x, y, lines, o = {}) {
    const size = o.size || 30, lh = o.lh || size * 1.6; ctx.save(); ctx.font = `500 ${size}px ${MONO}`; const cw = ctx.measureText("M").width;
    lines.forEach((ln, i) => {
      const L = typeof ln === "string" ? { t: ln } : ln, by = y + i * lh;
      if (L.bg) { ctx.fillStyle = L.bg; ctx.fillRect(x - (o.pad || 16), by - size * 1.05, (o.w || 900), lh); }
      if (o.nums) { ctx.fillStyle = C.dim; ctx.textAlign = "right"; ctx.fillText(String(i + (o.start || 1)), x - 28, by); ctx.textAlign = "left"; }
      if (L.mark) { ctx.fillStyle = L.mark; ctx.fillText(L.markCh || " ", x - (o.pad || 16) + 4, by); }
      let cx = x; tokens(L.t).forEach(tk => { ctx.fillStyle = L.color || SYN[tk.k]; ctx.globalAlpha = L.dim ? 0.35 : 1; ctx.fillText(tk.s, cx, by); cx += tk.s.length * cw; });
      ctx.globalAlpha = 1;
    });
    ctx.restore(); return { cw, lh, size };
  }

  // ---------- jendela editor / terminal generik ----------
  function windowFrame(ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18;
    ctx.fillStyle = o.fill || C.win; rr(ctx, x, y, w, h, 18); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 18); ctx.clip();
    ctx.fillStyle = o.bar || C.bar; ctx.fillRect(x, y, w, 58);
    ["#FF5F57", "#FEBC2E", "#28C840"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 32 + i * 30, y + 29, 9, 0, 6.283); ctx.fill(); });
    if (o.tab) { ctx.fillStyle = o.fill || C.win; rr(ctx, x + 140, y + 12, Math.max(220, o.tab.length * 17 + 70), 46, 10); ctx.fill(); ctx.fillRect(x + 140, y + 40, Math.max(220, o.tab.length * 17 + 70), 20);
      ctx.fillStyle = C.php; ctx.beginPath(); ctx.arc(x + 166, y + 36, 7, 0, 6.283); ctx.fill(); text(ctx, o.tab, x + 184, y + 45, 24, { mono: true, weight: 500, color: C.text }); }
    if (o.title) text(ctx, o.title, x + w / 2, y + 38, 24, { align: "center", weight: 600, color: C.text2 });
    ctx.restore();
    ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; rr(ctx, x, y, w, h, 18); ctx.stroke();
    return { x: x + 40, y: y + 58, w: w - 80, h: h - 58 };
  }

  // ---------- kartu bab = berkas bab-N.php ----------
  function kartuBab(ctx, n, judul, t = 0, u = 1) {
    bg(ctx, t);
    const w = 1400, h = 560, x = (W - w) / 2, y = (HH - h) / 2 - 20;
    const in_ = windowFrame(ctx, x, y, w, h, { tab: `bab-${n}.php` });
    const l1 = "<?php", l2 = `// BAB ${n} · ${judul}`;
    const k = Math.floor(eio(u) * (l1.length + l2.length + 4));
    const s1 = l1.slice(0, k), s2 = k > l1.length + 2 ? l2.slice(0, k - l1.length - 2) : "";
    code(ctx, in_.x + 70, in_.y + 120, [s1, "", s2], { size: 44, lh: 74, nums: true });
    // kursor
    if (Math.floor(t * 2) % 2 === 0) { ctx.font = `500 44px ${MONO}`; const cw = ctx.measureText("M").width; const line = s2 ? 2 : 0; const col = s2 ? s2.length : s1.length; ctx.fillStyle = C.term; ctx.fillRect(in_.x + 70 + col * cw + 2, in_.y + 120 + line * 74 - 40, 4, 50); }
    text(ctx, `BAB ${n}`, x + w - 60, y + h - 50, 30, { align: "right", weight: 800, color: C.php, spacing: 6 });
  }

  // ---------- kartu CVE + meter CVSS ----------
  function meterCVSS(ctx, cx, cy, r, v, o = {}) {
    const a0 = Math.PI * 0.8, a1 = Math.PI * 2.2;
    ctx.lineCap = "round"; ctx.lineWidth = r * 0.16;
    ctx.strokeStyle = "rgba(232,236,255,0.10)"; ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke();
    const g = ctx.createLinearGradient(cx - r, cy, cx + r, cy); g.addColorStop(0, C.term); g.addColorStop(0.55, C.amber); g.addColorStop(1, C.red);
    ctx.strokeStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, a0, a0 + (a1 - a0) * v / 10); ctx.stroke();
    text(ctx, String(v).replace(".", ","), cx, cy + r * 0.18, r * 0.62, { align: "center", weight: 800, color: v >= 9 ? C.red : C.amber, mono: true });
    text(ctx, o.label || "CVSS", cx, cy + r * 0.52, r * 0.2, { align: "center", weight: 700, color: C.text2, spacing: 3 });
  }
  function kartuCVE(ctx, x, y, o) {
    const w = o.w || 620, h = o.h || 300;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 40; ctx.fillStyle = C.panel; rr(ctx, x, y, w, h, 20); ctx.fill(); ctx.restore();
    ctx.strokeStyle = rgba(o.col || C.red, 0.7); ctx.lineWidth = 2; rr(ctx, x, y, w, h, 20); ctx.stroke();
    ctx.fillStyle = o.col || C.red; rr(ctx, x, y, 12, h, 6); ctx.fill();
    text(ctx, o.tag || "PENGUMUMAN KEAMANAN", x + 44, y + 58, 26, { weight: 800, color: o.col || C.red, spacing: 4 });
    text(ctx, o.id, x + 44, y + 116, o.idSize || 44, { mono: true, weight: 700 });
    text(ctx, o.title, x + 44, y + 172, o.titleSize || 34, { weight: 600, color: C.text2 });
    if (o.date) text(ctx, o.date, x + 44, y + h - 36, 28, { mono: true, weight: 500, color: C.dim });
    if (o.cvss != null) meterCVSS(ctx, x + w - 120, y + h / 2 + 10, 78, o.cvss);
  }
  function cap(ctx, s, cx, cy, ang, col = C.red, size = 64) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.font = `900 ${size}px ${SANS}`; const w = ctx.measureText(s).width + 110;
    ctx.strokeStyle = col; ctx.lineWidth = 7; rr(ctx, -w / 2, -size * 0.85, w, size * 1.5, 14); ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.letterSpacing = "8px"; ctx.fillText(s, 4, 0); ctx.restore();
  }

  // ---------- peta memori = loker server ----------
  function loker(ctx, x, y, cols, rows, o = {}) {
    const lw = o.lw || 150, lh = o.lh || 170, gap = 18; const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, lx = x + c * (lw + gap), ly = y + r * (lh + gap), st = (o.state && o.state[i]) || "kosong";
      const fill = { kosong: C.lokKosong, php: C.phpDeep, bebas: C.lokBebas, baru: "#123B2E", rusak: C.redDeep }[st];
      const edge = { kosong: C.line, php: C.php, bebas: "rgba(169,179,218,0.35)", baru: C.term, rusak: C.red }[st];
      if (st === "rusak") glow(ctx, lx + lw / 2, ly + lh / 2, lw, C.red, 0.5);
      ctx.fillStyle = fill; rr(ctx, lx, ly, lw, lh, 10); ctx.fill(); ctx.strokeStyle = edge; ctx.lineWidth = st === "kosong" ? 1.5 : 3; rr(ctx, lx, ly, lw, lh, 10); ctx.stroke();
      for (let k = 0; k < 3; k++) { ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(lx + 22, ly + 34 + k * 12, lw - 44, 4); }   // kisi ventilasi
      ctx.fillStyle = edge; ctx.beginPath(); ctx.arc(lx + lw - 16, ly + 24, 6, 0, 6.283); ctx.fill();             // lampu
      text(ctx, "0x7f3a" + (0x10 * i + 0x40).toString(16).padStart(3, "0"), lx + lw / 2, ly + lh - 18, 17, { mono: true, weight: 500, align: "center", color: C.dim });
      if (o.labels && o.labels[i]) text(ctx, o.labels[i], lx + lw / 2, ly + lh / 2 + 22, o.labelSize || 24, { mono: true, weight: 700, align: "center", color: edge });
      cells.push({ x: lx, y: ly, w: lw, h: lh });
    }
    return cells;
  }
  function kunci(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(0, 0, 22, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(90, 0); ctx.moveTo(70, 0); ctx.lineTo(70, 18); ctx.moveTo(86, 0); ctx.lineTo(86, 14); ctx.stroke(); ctx.restore();
  }

  // ---------- terminal ----------
  function terminal(ctx, x, y, w, h, lines, o = {}) {
    const in_ = windowFrame(ctx, x, y, w, h, { title: o.title || "Terminal", fill: C.termBg });
    const size = o.size || 32, lh = size * 1.55; ctx.save(); ctx.font = `500 ${size}px ${MONO}`;
    lines.forEach((L, i) => {
      const by = in_.y + 70 + i * lh; const l = typeof L === "string" ? { t: L } : L;
      if (l.hl) { ctx.fillStyle = rgba(l.hl, 0.16); ctx.fillRect(in_.x - 14, by - size * 1.05, in_.w + 28, lh); ctx.fillStyle = l.hl; ctx.fillRect(in_.x - 14, by - size * 1.05, 5, lh); }
      if (l.cmd) { ctx.fillStyle = C.term; ctx.fillText("$ ", in_.x, by); ctx.fillStyle = C.text; ctx.fillText(l.t, in_.x + ctx.measureText("$ ").width, by); }
      else { ctx.fillStyle = l.color || C.text2; ctx.fillText(l.t, in_.x, by); }
    });
    ctx.restore();
    if (o.contoh) text(ctx, "contoh", x + w - 28, y + h - 24, 20, { align: "right", weight: 600, color: C.dim });
    return in_;
  }

  // ---------- jendela patch (motif utama) ----------
  function jendelaPatch(ctx, x0, x1, y, o = {}) {
    const a = x0 + 40, b = x1 - 40, gap = o.gap == null ? 1 : o.gap; const bx = lerp(a, b, 0.12 + 0.88 * gap);
    ctx.strokeStyle = C.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    const g = ctx.createLinearGradient(a, 0, bx, 0); g.addColorStop(0, rgba(C.red, 0.35)); g.addColorStop(1, rgba(C.red, 0.12));
    ctx.fillStyle = g; rr(ctx, a, y - 150, bx - a, 300, 16); ctx.fill(); ctx.strokeStyle = rgba(C.red, 0.8); ctx.lineWidth = 2; ctx.setLineDash([10, 8]); rr(ctx, a, y - 150, bx - a, 300, 16); ctx.stroke(); ctx.setLineDash([]);
    // daun jendela
    [[a, -1], [bx, 1]].forEach(([px, d]) => { ctx.fillStyle = rgba(C.php, 0.25); ctx.strokeStyle = C.php; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, y - 150); ctx.lineTo(px + d * 46, y - 120); ctx.lineTo(px + d * 46, y + 120); ctx.lineTo(px, y + 150); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    const mk = (px, lab, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, y, 14, 0, 6.283); ctx.fill(); text(ctx, lab, px, y + 214, 40, { align: "center", weight: 700, color: col }); };
    if (o.noLabels) { ctx.fillStyle = C.amber; ctx.beginPath(); ctx.arc(a, y, 14, 0, 6.283); ctx.fill(); ctx.fillStyle = C.term; ctx.beginPath(); ctx.arc(bx, y, 14, 0, 6.283); ctx.fill(); } else { mk(a, "Patch terbit", C.amber); mk(bx, "Server diperbarui", C.term); }
    text(ctx, o.label || "JENDELA PATCH", (a + bx) / 2, y - 184, 40, { align: "center", weight: 800, color: C.red, spacing: 6 });
    (o.dots || []).forEach(([u, v]) => { const px = lerp(a + 20, bx - 20, u), py = y + v * 120; glow(ctx, px, py, 26, C.red, 0.8); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(px, py, 7, 0, 6.283); ctx.fill(); });
    return { a, b: bx };
  }
  function jam(ctx, cx, cy, s, t = 0, lab) {
    const hw = (lab ? 310 : 210) * s; ctx.save(); ctx.fillStyle = C.panel; rr(ctx, cx - hw, cy - 80 * s, 2 * hw, 160 * s, 24 * s); ctx.fill(); ctx.strokeStyle = rgba(C.red, 0.8); ctx.lineWidth = 3; rr(ctx, cx - hw, cy - 80 * s, 2 * hw, 160 * s, 24 * s); ctx.stroke();
    text(ctx, lab || "??:??", cx, cy + (lab ? 28 : 40) * s, (lab ? 64 : 110) * s, { align: "center", mono: true, weight: 700, color: C.red, glow: C.red, blur: 24 }); ctx.restore();
  }

  global.D09 = { tema, TEMA, W, HH, C, SANS, MONO, clamp, lerp, eio, rgba, rr, text, glow, bg, tokens, code, windowFrame, kartuBab, meterCVSS, kartuCVE, cap, loker, kunci, terminal, jendelaPatch, jam };
})(typeof window !== "undefined" ? window : globalThis);
