/* Pembantu gambar D7.3: gembok & kunci, rumah akun, kotak sandi, pengukur kekuatan, penghitung tebakan, obrolan grup kelas,
   jejak kaki digital, salinan di server. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, kid, ease, clamp, lerp } = H;
  const S = {};
  S.lock = function (ctx, cx, cy, s, opt = {}) {
    ctx.strokeStyle = opt.open ? C.bad : "#6B7B88"; ctx.lineWidth = s * 0.14; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(cx + (opt.open ? s * 0.2 : 0), cy - s * 0.35, s * 0.32, Math.PI, 0); if (!opt.open) ctx.lineTo(cx + s * 0.32, cy - s * 0.1); ctx.stroke();
    ctx.fillStyle = opt.color || (opt.open ? C.badBg : C.accent); rr(ctx, cx - s * 0.5, cy - s * 0.1, s, s * 0.8, s * 0.14); ctx.fill();
    ctx.fillStyle = opt.open ? C.bad : "#5E3E05"; ctx.beginPath(); ctx.arc(cx, cy + s * 0.25, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(cx - s * 0.04, cy + s * 0.25, s * 0.08, s * 0.22);
  };
  S.key = function (ctx, cx, cy, s, opt = {}) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(opt.rot || 0); ctx.strokeStyle = opt.color || "#B57A12"; ctx.fillStyle = opt.color || "#B57A12"; ctx.lineWidth = s * 0.16; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(-s * 0.55, 0, s * 0.28, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * 0.27, 0); ctx.lineTo(s * 0.7, 0); ctx.moveTo(s * 0.45, 0); ctx.lineTo(s * 0.45, s * 0.25); ctx.moveTo(s * 0.65, 0); ctx.lineTo(s * 0.65, s * 0.3); ctx.stroke(); ctx.restore();
    if (opt.label) { card(ctx, cx - s * 0.9, cy + s * 0.45, s * 1.8, s * 0.5, { fill: "#FFF3B0", stroke: "#B57A12", lw: 3, r: 8 }); text(ctx, opt.label, cx, cy + s * 0.8, s * 0.3, { align: "center", weight: 900 }); }
  };
  S.house = function (ctx, cx, cy, w, h, opt = {}) {
    ctx.fillStyle = "#F1C9A5"; rr(ctx, cx - w / 2, cy - h * 0.1, w, h * 0.6, 10); ctx.fill();
    ctx.fillStyle = "#C98A57"; ctx.beginPath(); ctx.moveTo(cx - w * 0.6, cy - h * 0.1); ctx.lineTo(cx, cy - h * 0.55); ctx.lineTo(cx + w * 0.6, cy - h * 0.1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#8E6BBF"; rr(ctx, cx - w * 0.12, cy + h * 0.1, w * 0.24, h * 0.4, 6); ctx.fill();
    if (opt.label) text(ctx, opt.label, cx, cy - h * 0.2, 30, { align: "center", weight: 900, color: "#fff" });
    S.lock(ctx, cx, cy + h * 0.28, w * 0.14, { open: opt.open });
  };
  // kotak kata sandi; mask = tampil sebagai titik
  S.pwBox = function (ctx, x, y, w, s, opt = {}) {
    card(ctx, x, y, w, opt.h || 90, { fill: C.panel, stroke: opt.stroke || "#B7C4CC", lw: 4, r: 14 });
    text(ctx, opt.mask ? "•".repeat(s.length) : s, x + 24, y + (opt.h || 90) / 2 + 16, opt.size || 44, { weight: 800, color: opt.color || C.ink });
    if (opt.count) text(ctx, s.length + " huruf", x + w - 20, y + (opt.h || 90) / 2 + 12, 28, { align: "right", weight: 800, color: C.ink2 });
  };
  // pengukur kekuatan 0..3 (lemah, sedang, kuat, sangat kuat)
  S.meter = function (ctx, x, y, w, level) {
    const names = ["lemah", "sedang", "kuat", "sangat kuat"], cols = [C.bad, "#F2B134", "#2E9E5B", "#1F5A6E"];
    for (let i = 0; i < 4; i++) { ctx.fillStyle = i <= level ? cols[level] : C.bg2; rr(ctx, x + i * (w / 4), y, w / 4 - 8, 26, 8); ctx.fill(); }
    text(ctx, names[level], x + w, y + 60, 30, { align: "right", weight: 900, color: cols[level] });
  };
  // penghitung tebakan yang berputar
  S.counter = function (ctx, x, y, w, n, opt = {}) {
    card(ctx, x, y, w, 100, { fill: "#1F2A33", r: 14 }); text(ctx, n, x + w / 2, y + 68, 48, { align: "center", color: opt.color || "#8FD0E6", weight: 900 });
    if (opt.label) text(ctx, opt.label, x + w / 2, y - 16, 26, { align: "center", color: C.ink2, weight: 800 });
  };
  // obrolan grup kelas di layar HP; msgs: [{who, text, me, img, deleted}]
  S.chat = function (ctx, sc, msgs, opt = {}) {
    text(ctx, opt.title || "Grup Kelas 7A", sc.x + sc.w / 2, sc.y + 60, 26, { align: "center", weight: 900, color: C.ink2 });
    ctx.fillStyle = C.bg2; ctx.fillRect(sc.x + 10, sc.y + 76, sc.w - 20, 3);
    let y = sc.y + 110;
    msgs.forEach(m => {
      const w = sc.w - 80, lines = m.img ? [] : wrap(ctx, m.text, 22, 700, w - 30); const h = m.img ? 150 : lines.length * 28 + 44;
      const x = m.me ? sc.x + sc.w - w - 16 : sc.x + 16;
      ctx.fillStyle = m.deleted ? "#EEF1F0" : m.me ? "#DDF3E4" : "#FFFFFF"; rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = m.deleted ? "#C9D8D0" : "#D7E2DC"; ctx.lineWidth = 2; ctx.stroke();
      if (!m.me) text(ctx, m.who, x + 14, y + 20, 18, { weight: 900, color: m.color || C.kiko });
      if (m.img) { ctx.fillStyle = "#8FD0E6"; rr(ctx, x + 14, y + 30, w - 28, 100, 8); ctx.fill(); ctx.fillStyle = "#2E9E5B"; ctx.beginPath(); ctx.moveTo(x + 14, y + 130); ctx.lineTo(x + 70, y + 70); ctx.lineTo(x + 120, y + 110); ctx.lineTo(x + 160, y + 85); ctx.lineTo(x + w - 14, y + 130); ctx.closePath(); ctx.fill(); kid(ctx, x + w / 2 + 30, y + 95, 28, {}); }
      else lines.forEach((ln, i) => text(ctx, ln, x + 14, y + 42 + i * 28, 22, { weight: m.deleted ? 600 : 700, color: m.deleted ? C.muted : C.ink }));
      y += h + 12;
    });
  };
  // jejak kaki
  S.footprints = function (ctx, pts, opt = {}) {
    pts.forEach(([x, y], i) => { const side = i % 2 ? 1 : -1; ctx.fillStyle = opt.color || "rgba(74,90,102,0.55)"; ctx.beginPath(); ctx.ellipse(x + side * 14, y, 12, 20, side * 0.2, 0, Math.PI * 2); ctx.fill(); for (let t = 0; t < 4; t++) { ctx.beginPath(); ctx.arc(x + side * 14 - 9 + t * 6, y - 26, 4, 0, Math.PI * 2); ctx.fill(); } });
  };
  // server (rak kotak) dengan label
  S.server = function (ctx, cx, cy, s, opt = {}) {
    for (let i = 0; i < 3; i++) { ctx.fillStyle = "#4A5A66"; rr(ctx, cx - s * 0.5, cy - s * 0.6 + i * s * 0.42, s, s * 0.36, 6); ctx.fill(); ctx.fillStyle = i === 1 ? C.good : "#8FD0E6"; ctx.beginPath(); ctx.arc(cx + s * 0.35, cy - s * 0.42 + i * s * 0.42, s * 0.05, 0, Math.PI * 2); ctx.fill(); }
    if (opt.label) text(ctx, opt.label, cx, cy + s * 0.95, 26, { align: "center", weight: 800, color: C.ink2 });
  };
  // kartu foto kecil (salinan)
  S.photo = function (ctx, cx, cy, s, opt = {}) { ctx.fillStyle = "#fff"; rr(ctx, cx - s / 2, cy - s / 2, s, s, 6); ctx.fill(); ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#8FD0E6"; rr(ctx, cx - s * 0.4, cy - s * 0.4, s * 0.8, s * 0.6, 4); ctx.fill(); ctx.fillStyle = "#2E9E5B"; ctx.fillRect(cx - s * 0.4, cy, s * 0.8, s * 0.2); if (opt.x) { ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx - s * 0.4, cy - s * 0.4); ctx.lineTo(cx + s * 0.4, cy + s * 0.4); ctx.moveTo(cx + s * 0.4, cy - s * 0.4); ctx.lineTo(cx - s * 0.4, cy + s * 0.4); ctx.stroke(); } };
  K.sandi = S;
})(typeof window !== "undefined" ? window : globalThis);
