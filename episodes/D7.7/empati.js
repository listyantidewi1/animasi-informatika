/* Pembantu gambar D7.7: panel grup chat, avatar, kerumunan pendengar, pengukur perasaan, kartu pilihan, kartu langkah,
   ikon ruang publik. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, kid, clamp } = H;
  const Q = {};
  const COLORS = { Dito: "#2E7E9A", Sinta: "#8E6BBF", Rani: "#2E9E5B", Bayu: "#D9443B", Tari: "#E0A23B", Agus: "#7B8B95", Aku: "#1F5A6E" };
  // avatar bulat berinisial; mood: "happy" | "sad" | "angry" | "flat"
  Q.avatar = function (ctx, cx, cy, r, name, mood = "flat") {
    ctx.fillStyle = COLORS[name] || "#7B8B95"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.15, r * 0.1, 0, Math.PI * 2); ctx.arc(cx + r * 0.3, cy - r * 0.15, r * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = Math.max(2, r * 0.08); ctx.lineCap = "round"; ctx.beginPath();
    if (mood === "happy") ctx.arc(cx, cy + r * 0.15, r * 0.3, Math.PI * 0.15, Math.PI * 0.85);
    else if (mood === "sad") ctx.arc(cx, cy + r * 0.55, r * 0.3, Math.PI * 1.15, Math.PI * 1.85);
    else if (mood === "angry") { ctx.moveTo(cx - r * 0.3, cy + r * 0.4); ctx.lineTo(cx + r * 0.3, cy + r * 0.4); ctx.moveTo(cx - r * 0.45, cy - r * 0.4); ctx.lineTo(cx - r * 0.15, cy - r * 0.3); ctx.moveTo(cx + r * 0.45, cy - r * 0.4); ctx.lineTo(cx + r * 0.15, cy - r * 0.3); }
    else { ctx.moveTo(cx - r * 0.25, cy + r * 0.35); ctx.lineTo(cx + r * 0.25, cy + r * 0.35); }
    ctx.stroke();
  };
  // panel grup chat. msgs: [{who, text, tone: "bad"|"good"|"laugh"|"sys", mood}], opt.n jumlah tampil, opt.hl indeks disorot, opt.members
  Q.chat = function (ctx, x, y, w, h, title, msgs, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#F7FAF8", stroke: "#B7C4CC", lw: 3, r: 18 });
    ctx.fillStyle = C.kiko; rr(ctx, x, y, w, 64, 18); ctx.fill(); ctx.fillRect(x, y + 32, w, 32);
    text(ctx, title, x + 24, y + 42, 28, { weight: 900, color: "#fff" });
    if (opt.members) text(ctx, opt.members + " anggota", x + w - 24, y + 42, 22, { align: "right", weight: 700, color: "#DDF3E4" });
    const n = opt.n == null ? msgs.length : clamp(opt.n, 0, msgs.length); let cy = y + 84; const size = opt.size || 24; const from = opt.from || 0;
    ctx.save(); ctx.beginPath(); rr(ctx, x, y + 64, w, h - 64, 18); ctx.clip();
    if (from) { text(ctx, "⋯ pesan sebelumnya", x + w / 2, cy + 10, 18, { align: "center", weight: 700, color: C.muted }); cy += 30; }
    for (let i = from; i < n; i++) {
      const m = msgs[i]; const hl = opt.hl === i;
      if (m.tone === "sys") { text(ctx, m.text, x + w / 2, cy + 20, 20, { align: "center", weight: 700, color: C.ink2 }); cy += 44; continue; }
      const mine = m.who === "Aku" || m.mine; const bw = Math.min(w - 110, Math.max(160, m.text.length * size * 0.56 + 40));
      const lines = wrap(ctx, m.text, size, 700, bw - 32); const bh = 36 + lines.length * size * 1.3;
      const bx = mine ? x + w - 20 - bw : x + 70;
      if (!mine) Q.avatar(ctx, x + 40, cy + 26, 22, m.who, m.mood || "flat");
      ctx.fillStyle = hl ? "#FFF3B0" : m.tone === "bad" ? C.badBg : m.tone === "good" ? C.goodBg : mine ? "#DCEBF2" : "#FFFFFF";
      ctx.strokeStyle = hl ? C.accent : m.tone === "bad" ? C.bad : m.tone === "good" ? C.good : "#D7E2DC"; ctx.lineWidth = hl ? 5 : 3;
      rr(ctx, bx, cy, bw, bh + (mine ? 0 : 0), 14); ctx.fill(); ctx.stroke();
      if (!mine) text(ctx, m.who, bx + 16, cy + 22, 18, { weight: 900, color: COLORS[m.who] || C.ink2 });
      lines.forEach((ln, k) => text(ctx, ln, bx + 16, cy + (mine ? 30 : 46) + k * size * 1.3, size, { weight: 700, color: m.tone === "bad" ? C.bad : C.ink }));
      if (m.meme) { ctx.fillStyle = "#E6EDF2"; rr(ctx, bx + 16, cy + bh - 6, 120, 70, 8); ctx.fill(); text(ctx, "MEME", bx + 76, cy + bh + 36, 20, { align: "center", weight: 900, color: C.bad }); cy += 76; }
      cy += bh + 14;
    }
    ctx.restore();
    return cy;
  };
  // kerumunan kepala kecil (pendengar)
  Q.crowd = function (ctx, x, y, cols, rows, opt = {}) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const cx = x + c * 44, cy = y + r * 48; ctx.fillStyle = ["#2B2118", "#4A2E1A", "#1B1B1B"][(r + c) % 3]; ctx.beginPath(); ctx.arc(cx, cy, 14, Math.PI, 0); ctx.fill(); ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(cx, cy + 4, 12, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.uniform; rr(ctx, cx - 14, cy + 16, 28, 18, 6); ctx.fill(); }
  };
  // pengukur perasaan: 0 sedih .. 1 senang
  Q.mood = function (ctx, x, y, w, v, label) {
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 26, 13); ctx.fill();
    const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, C.bad); g.addColorStop(0.5, C.accent); g.addColorStop(1, C.good); ctx.fillStyle = g; rr(ctx, x, y, w, 26, 13); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + w * clamp(v, 0, 1), y + 13, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    text(ctx, "😢", x - 10, y + 22, 24, { align: "right" }); text(ctx, "😊", x + w + 12, y + 22, 24);
    if (label) text(ctx, label, x + w / 2, y + 62, 24, { align: "center", weight: 800, color: C.ink2 });
  };
  // kartu pilihan bernomor
  Q.choice = function (ctx, x, y, w, h, n, label, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : opt.dim ? "#F4F6F5" : C.panel, stroke: opt.on ? C.accent : opt.good ? C.good : opt.bad ? C.bad : "#CFDCD5", lw: opt.on || opt.good || opt.bad ? 6 : 3, r: 16 });
    ctx.fillStyle = opt.good ? C.good : opt.bad ? C.bad : C.kiko; ctx.beginPath(); ctx.arc(x + 40, y + 40, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x + 40, y + 50, 26, { align: "center", color: "#fff", weight: 900 });
    const lines = wrap(ctx, label, 26, 800, w - 100); lines.forEach((ln, i) => text(ctx, ln, x + 80, y + 50 + i * 34, 26, { weight: 800, color: opt.dim ? C.muted : C.ink }));
  };
  // kartu langkah
  Q.step = function (ctx, x, y, w, n, title, sub, on = true) {
    ctx.save(); ctx.globalAlpha = on ? 1 : 0.25;
    card(ctx, x, y, w, 150, { fill: C.bg2, r: 18 });
    ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 44, y + 44, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x + 44, y + 54, 26, { align: "center", color: "#fff", weight: 900 });
    text(ctx, title, x + 84, y + 54, 28, { weight: 900 });
    const lines = wrap(ctx, sub, 22, 700, w - 40); lines.forEach((ln, i) => text(ctx, ln, x + 20, y + 100 + i * 28, 22, { weight: 700, color: C.ink2 }));
    ctx.restore();
  };
  // ikon ruang publik: "chat" | "sosial" | "komentar" | "game" | "forum"
  Q.spaceIcon = function (ctx, cx, cy, s, kind) {
    ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = C.kiko; ctx.strokeStyle = C.kiko; ctx.lineWidth = s * 0.08; ctx.lineCap = "round";
    if (kind === "chat") { rr(ctx, -s * 0.5, -s * 0.45, s * 0.7, s * 0.5, s * 0.12); ctx.fill(); ctx.fillStyle = C.kikoLight; rr(ctx, -s * 0.2, -s * 0.1, s * 0.7, s * 0.5, s * 0.12); ctx.fill(); }
    else if (kind === "sosial") { rr(ctx, -s * 0.45, -s * 0.45, s * 0.9, s * 0.9, s * 0.16); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(0, s * 0.25); ctx.bezierCurveTo(-s * 0.5, -s * 0.1, -s * 0.2, -s * 0.4, 0, -s * 0.15); ctx.bezierCurveTo(s * 0.2, -s * 0.4, s * 0.5, -s * 0.1, 0, s * 0.25); ctx.fill(); }
    else if (kind === "komentar") { for (let i = 0; i < 3; i++) { ctx.fillStyle = i ? C.kikoLight : C.kiko; rr(ctx, -s * 0.45, -s * 0.4 + i * s * 0.3, s * (0.9 - i * 0.2), s * 0.2, s * 0.06); ctx.fill(); } }
    else if (kind === "game") { rr(ctx, -s * 0.5, -s * 0.25, s, s * 0.5, s * 0.2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillRect(-s * 0.36, -s * 0.04, s * 0.2, s * 0.08); ctx.fillRect(-s * 0.3, -s * 0.1, s * 0.08, s * 0.2); ctx.beginPath(); ctx.arc(s * 0.22, -s * 0.06, s * 0.05, 0, Math.PI * 2); ctx.arc(s * 0.34, s * 0.06, s * 0.05, 0, Math.PI * 2); ctx.fill(); }
    else { rr(ctx, -s * 0.45, -s * 0.45, s * 0.9, s * 0.9, s * 0.1); ctx.fill(); ctx.fillStyle = "#fff"; for (let i = 0; i < 3; i++) { ctx.fillRect(-s * 0.3, -s * 0.3 + i * s * 0.22, s * 0.6, s * 0.1); } }
    ctx.restore();
  };
  K.empati = Q;
})(typeof window !== "undefined" ? window : globalThis);
