/* Pembantu gambar F11.8: rantai koneksi dengan status uji, terminal perintah, tabel aturan firewall dengan paket yang dicocokkan,
   terowongan VPN, gembok, daftar periksa, baris log. Gaya diagram Fase F. Semua alamat dan nama fiktif. Muat setelah kiko-core.js, kiko-devices.js, jaringan.js, lapisan.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan;
  const { rr, text, para, card, clamp } = H;
  const Dt = {};
  Dt.CHAIN = [["perangkat", "💻"], ["kabel / Wi-Fi", "🔌"], ["alamat IP", "🏷️"], ["router", "📡"], ["internet", "🌐"], ["DNS", "📖"], ["server", "🗄️"]];
  // rantai: status[i] = "ok" | "bad" | null ; opt.broken = indeks mata rantai yang rusak (ditampilkan bila opt.reveal)
  Dt.chain = function (ctx, x, y, w, status = [], opt = {}) {
    const n = Dt.CHAIN.length, step = w / (n - 1);
    for (let i = 0; i < n - 1; i++) { const broken = opt.reveal && opt.broken === i + 1; ctx.strokeStyle = broken ? C.bad : "#B7C4CC"; ctx.lineWidth = 8; ctx.setLineDash(broken ? [10, 10] : []); ctx.beginPath(); ctx.moveTo(x + i * step + 34, y); ctx.lineTo(x + (i + 1) * step - 34, y); ctx.stroke(); ctx.setLineDash([]); }
    Dt.CHAIN.forEach(([lab, ic], i) => { const px = x + i * step; const st = status[i]; const broken = opt.reveal && opt.broken === i; ctx.fillStyle = broken ? C.badBg : st === "ok" ? C.goodBg : st === "bad" ? C.badBg : "#fff"; ctx.strokeStyle = broken || st === "bad" ? C.bad : st === "ok" ? C.good : C.kiko; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(px, y, 34, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); text(ctx, ic, px, y + 10, 28, { align: "center" }); para(ctx, lab, px, y + 66, 17, 150, { align: "center", weight: 800, color: C.ink2 }); if (st) text(ctx, st === "ok" ? "✓" : "✕", px + 26, y - 22, 24, { align: "center", weight: 900, color: st === "ok" ? C.good : C.bad }); if (broken) text(ctx, "✕ rusak", px, y - 48, 20, { align: "center", weight: 900, color: C.bad }); });
  };
  // terminal: lines [[teks, kind "cmd"|"out"|"err"|"ok"]]
  Dt.terminal = function (ctx, x, y, w, lines, opt = {}) {
    const h = 44 + lines.length * 30 + 12; card(ctx, x, y, w, h, { fill: "#0E1418", stroke: "#4A5A66", lw: 3, r: 12 }); text(ctx, opt.title || "TERMINAL", x + 14, y + 26, 14, { weight: 900, color: "#8FD0E6" });
    lines.forEach(([t, k], i) => { if (opt.n != null && i >= opt.n) return; text(ctx, (k === "cmd" ? "> " : "  ") + t, x + 14, y + 58 + i * 30, 18, { weight: k === "cmd" ? 900 : 700, color: k === "cmd" ? C.accent : k === "err" ? "#FF8A80" : k === "ok" ? "#9BE7A5" : "#D7E2DC" }); }); return h;
  };
  // tabel aturan firewall: rules [[aksi, port, dari]]; opt.hit = indeks aturan yang cocok; opt.n baris tampil
  Dt.firewall = function (ctx, x, y, w, rules, opt = {}) {
    const rh = 54, cw = [70, 150, 170, w - 390]; card(ctx, x, y, w, rh * (rules.length + 1), { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, w, rh, 12); ctx.fill(); ctx.fillRect(x, y + rh / 2, w, rh / 2);
    ["#", "aksi", "port", "dari"].forEach((h, c) => text(ctx, h, x + cw.slice(0, c).reduce((a, b) => a + b, 0) + 14, y + rh / 2 + 8, 20, { weight: 900, color: C.ink2 }));
    rules.forEach((r, i) => { if (opt.n != null && i >= opt.n) return; const ry = y + rh * (i + 1); if (opt.hit === i) { ctx.fillStyle = r[0] === "izinkan" ? C.goodBg : C.badBg; ctx.fillRect(x + 2, ry, w - 4, rh); } [String(i + 1), r[0].toUpperCase(), r[1], r[2]].forEach((v, c) => text(ctx, v, x + cw.slice(0, c).reduce((a, b) => a + b, 0) + 14, ry + rh / 2 + 8, 20, { weight: c === 1 ? 900 : 700, color: c === 1 ? (r[0] === "izinkan" ? C.good : C.bad) : C.ink })); ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + w, ry); ctx.stroke(); });
  };
  // paket masuk: kartu kecil {port, from}
  Dt.packetCard = function (ctx, x, y, port, from, verdict) { const w = 440; card(ctx, x, y, w, 100, { fill: verdict === "izinkan" ? C.goodBg : verdict === "tolak" ? C.badBg : "#FFF3D6", stroke: verdict === "izinkan" ? C.good : verdict === "tolak" ? C.bad : C.accent, lw: 4, r: 12 }); text(ctx, "📦 paket → port " + port, x + 16, y + 38, 22, { weight: 900 }); text(ctx, "dari: " + from, x + 16, y + 70, 17, { weight: 800, color: C.ink2 }); if (verdict) text(ctx, verdict.toUpperCase(), x + w - 16, y + 40, 20, { align: "right", weight: 900, color: verdict === "izinkan" ? C.good : C.bad }); };
  // gembok
  Dt.lock = function (ctx, cx, cy, s, on = true) { ctx.fillStyle = on ? C.good : C.bad; rr(ctx, cx - s * 0.5, cy - s * 0.1, s, s * 0.8, s * 0.12); ctx.fill(); ctx.strokeStyle = on ? C.good : C.bad; ctx.lineWidth = s * 0.14; ctx.beginPath(); ctx.arc(cx + (on ? 0 : s * 0.15), cy - s * 0.3, s * 0.3, Math.PI, on ? 0 : -0.3, false); ctx.stroke(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy + s * 0.25, s * 0.1, 0, Math.PI * 2); ctx.fill(); };
  // terowongan VPN antara x1 dan x2 pada tinggi y
  Dt.tunnel = function (ctx, x1, x2, y, opt = {}) {
    ctx.fillStyle = "rgba(46,126,154,0.15)"; rr(ctx, x1, y - 40, x2 - x1, 80, 40); ctx.fill(); ctx.strokeStyle = C.kiko; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); rr(ctx, x1, y - 40, x2 - x1, 80, 40); ctx.stroke(); ctx.setLineDash([]);
    const u = opt.u == null ? 0.5 : opt.u; const px = x1 + 40 + (x2 - x1 - 80) * u; J.packet(ctx, px, y, 1, { color: C.good }); Dt.lock(ctx, px + 40, y, 22, true);
    if (opt.label) text(ctx, opt.label, (x1 + x2) / 2, y - 56, 22, { align: "center", weight: 900, color: C.kiko });
  };
  // mata penyadap dengan apa yang dilihatnya
  Dt.eye = function (ctx, cx, cy, sees, opt = {}) { text(ctx, "👁️", cx, cy, 44, { align: "center" }); card(ctx, cx - 160, cy + 16, 320, 50, { fill: opt.bad ? C.badBg : C.bg2, stroke: opt.bad ? C.bad : "#B7C4CC", lw: 2, r: 10 }); text(ctx, sees, cx, cy + 49, 18, { align: "center", weight: 900, color: opt.bad ? C.bad : C.ink2 }); };
  // daftar periksa
  Dt.checklist = function (ctx, x, y, w, items, n, opt = {}) { items.forEach(([t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const ry = y + i * (opt.rh || 64); card(ctx, x, ry, w, (opt.rh || 64) - 8, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, "☑ " + t, x + 18, ry + 30, 22, { weight: 900 }); if (s) text(ctx, s, x + w - 18, ry + 30, 18, { align: "right", weight: 800, color: C.ink2 }); ctx.restore(); }); };
  // baris log
  Dt.log = function (ctx, x, y, w, rows, n, opt = {}) { const h = 44 + rows.length * 32 + 10; card(ctx, x, y, w, h, { fill: "#0E1418", stroke: "#4A5A66", lw: 3, r: 12 }); text(ctx, "LOG ROUTER", x + 14, y + 26, 14, { weight: 900, color: "#8FD0E6" }); rows.forEach(([t, bad], i) => { if (i >= n) return; text(ctx, t, x + 14, y + 60 + i * 32, 17, { weight: bad ? 900 : 700, color: bad ? "#FF8A80" : "#D7E2DC" }); }); return h; };
  K.detektif = Dt;
})(typeof window !== "undefined" ? window : globalThis);
