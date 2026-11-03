/* Pembantu gambar D7.8: jendela pengolah dokumen (toolbar, judul, bullet, gambar), slide dan deretan slide, kartu langkah,
   kartu peran tim, garis jadwal, tabel rubrik, kartu bab. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, clamp } = H;
  const Q = {};
  // gambar placeholder (gunung + matahari)
  Q.picture = function (ctx, x, y, w, h, opt = {}) {
    ctx.fillStyle = opt.fill || "#DCEBF2"; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 10); ctx.stroke();
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x + w * 0.75, y + h * 0.3, Math.min(w, h) * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2E9E5B"; ctx.beginPath(); ctx.moveTo(x + 4, y + h - 4); ctx.lineTo(x + w * 0.35, y + h * 0.4); ctx.lineTo(x + w * 0.6, y + h - 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E7E9A"; ctx.beginPath(); ctx.moveTo(x + w * 0.45, y + h - 4); ctx.lineTo(x + w * 0.7, y + h * 0.55); ctx.lineTo(x + w - 4, y + h - 4); ctx.closePath(); ctx.fill();
  };
  // jendela pengolah dokumen: opt.title (judul bab), opt.bullets [], opt.image, opt.hlTool "heading"|"bullet"|"image"|"save", opt.cursor
  Q.docWindow = function (ctx, x, y, w, h, opt = {}) {
    const f = D.windowFrame(ctx, x, y, w, h, opt.name || "Pengolah Dokumen", {});
    // toolbar
    const tools = [["H", "heading"], ["• —", "bullet"], ["🖼", "image"], ["💾", "save"]];
    ctx.fillStyle = "#F4F8FB"; rr(ctx, f.x, f.y - 4, f.w, 56, 10); ctx.fill();
    tools.forEach(([lab, id], i) => { const tx = f.x + 12 + i * 92; const on = opt.hlTool === id; ctx.fillStyle = on ? C.accent : "#FFFFFF"; rr(ctx, tx, f.y + 4, 80, 40, 8); ctx.fill(); ctx.strokeStyle = on ? C.accentDark : "#C9D4DB"; ctx.lineWidth = on ? 4 : 2; rr(ctx, tx, f.y + 4, 80, 40, 8); ctx.stroke(); text(ctx, lab, tx + 40, f.y + 32, 22, { align: "center", weight: 900, color: on ? "#fff" : C.ink }); });
    if (opt.toolLabel) text(ctx, opt.toolLabel, f.x + f.w - 12, f.y + 32, 20, { align: "right", weight: 800, color: C.accentDark });
    // halaman
    const px = f.x + 30, py = f.y + 72, pw = f.w - 60, ph = f.h - 84;
    ctx.fillStyle = "#FFFFFF"; rr(ctx, px, py, pw, ph, 6); ctx.fill(); ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; rr(ctx, px, py, pw, ph, 6); ctx.stroke();
    let cy = py + 50;
    if (opt.title) { text(ctx, opt.title, px + 30, cy, opt.titleSize || 30, { weight: 900, color: opt.hlTool === "heading" ? C.accentDark : C.ink }); cy += 44; }
    (opt.bullets || []).forEach(b => { ctx.fillStyle = opt.hlTool === "bullet" ? C.accentDark : C.ink; ctx.beginPath(); ctx.arc(px + 40, cy - 8, 5, 0, Math.PI * 2); ctx.fill(); text(ctx, b, px + 58, cy, 22, { weight: 700, color: opt.hlTool === "bullet" ? C.accentDark : C.ink }); cy += 34; });
    if (opt.lines) for (let i = 0; i < opt.lines; i++) { ctx.fillStyle = "#D7E2DC"; rr(ctx, px + 30, cy - 10, (pw - 60) * (0.55 + ((i * 7) % 4) * 0.1), 10, 5); ctx.fill(); cy += 26; }
    if (opt.image) { Q.picture(ctx, px + 30, cy + 4, Math.min(220, pw - 60), 120, {}); if (opt.hlTool === "image") { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, px + 26, cy, Math.min(220, pw - 60) + 8, 128, 10); ctx.stroke(); } cy += 140; }
    return { px, py, pw, ph, cy };
  };
  // satu slide 16:9; opt.title, opt.lines (teks kecil banyak), opt.words (teks besar), opt.image, opt.bad, opt.scale font
  Q.slide = function (ctx, x, y, w, opt = {}) {
    const h = w * 9 / 16;
    ctx.fillStyle = opt.bg || "#FFFFFF"; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.strokeStyle = opt.good ? C.good : opt.bad ? C.bad : "#B7C4CC"; ctx.lineWidth = opt.good || opt.bad ? 6 : 3; rr(ctx, x, y, w, h, 12); ctx.stroke();
    ctx.fillStyle = C.kiko; rr(ctx, x, y, w, h * 0.16, 12); ctx.fill(); ctx.fillRect(x, y + h * 0.08, w, h * 0.08);
    if (opt.title) text(ctx, opt.title, x + w * 0.05, y + h * 0.115, w * 0.055, { weight: 900, color: "#fff" });
    if (opt.lines) { const one = opt.lineText || "Kata sandi harus panjang dan tidak boleh diberitahukan kepada siapa pun termasuk teman dekat."; const ls = wrap(ctx, Array(opt.lines).fill(one).join(" "), w * 0.026, 600, w * 0.9).slice(0, opt.lines); ls.forEach((ln, i) => text(ctx, ln, x + w * 0.05, y + h * 0.26 + i * (h * 0.058), w * 0.026, { weight: 600, color: opt.textColor || C.ink })); }
    if (opt.words) { const lines = wrap(ctx, opt.words, w * 0.075, 900, w * (opt.image ? 0.5 : 0.9)); lines.forEach((ln, i) => text(ctx, ln, x + w * 0.05, y + h * 0.42 + i * w * 0.09, w * 0.075, { weight: 900, color: opt.textColor || C.ink })); }
    if (opt.image) Q.picture(ctx, x + w * 0.6, y + h * 0.3, w * 0.34, h * 0.55, {});
    return h;
  };
  // kartu langkah bernomor (kecil), on = aktif
  Q.stepCard = function (ctx, x, y, w, h, n, title, opt = {}) {
    ctx.save(); ctx.globalAlpha = opt.dim ? 0.25 : 1;
    card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 5, r: 16 });
    ctx.fillStyle = opt.done ? C.good : C.kiko; ctx.beginPath(); ctx.arc(x + 40, y + 40, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, opt.done ? "✓" : String(n), x + 40, y + 50, 26, { align: "center", color: "#fff", weight: 900 });
    const lines = wrap(ctx, title, 24, 900, w - 30); lines.forEach((ln, i) => text(ctx, ln, x + w / 2, y + 100 + i * 30, 24, { align: "center", weight: 900 }));
    if (opt.sub) text(ctx, opt.sub, x + w / 2, y + h - 18, 20, { align: "center", weight: 700, color: C.ink2 });
    ctx.restore();
  };
  // kartu peran tim dengan tokoh
  Q.roleCard = function (ctx, x, y, w, name, role, opt = {}) {
    card(ctx, x, y, w, 230, { fill: C.bg2, r: 16 });
    H.kid(ctx, x + w / 2, y + 90, 90, opt.kid || {});
    text(ctx, name, x + w / 2, y + 200, 22, { align: "center", weight: 800, color: C.ink2 });
    ctx.fillStyle = C.kiko; rr(ctx, x + 14, y + 14, w - 28, 36, 10); ctx.fill(); text(ctx, role, x + w / 2, y + 39, 20, { align: "center", weight: 900, color: "#fff" });
  };
  // garis jadwal empat pertemuan
  Q.timeline = function (ctx, x, y, w, items, opt = {}) {
    ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
    items.forEach((it, i) => { const cx = x + (i + 0.5) * (w / items.length); const on = opt.n == null || i < opt.n; ctx.save(); ctx.globalAlpha = on ? 1 : 0.25; ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(cx, y, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, "P" + (i + 1), cx, y + 8, 18, { align: "center", weight: 900 }); const lines = wrap(ctx, it, 22, 800, w / items.length - 20); lines.forEach((ln, k) => text(ctx, ln, cx, y + 52 + k * 28, 22, { align: "center", weight: 800, color: C.ink2 })); ctx.restore(); });
  };
  // tabel rubrik: rows [[kriteria, deskripsi]], opt.n tampil
  Q.rubric = function (ctx, x, y, w, rows, opt = {}) {
    const rh = 70; card(ctx, x, y, w, rh * (rows.length + 1), { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 12 });
    ctx.fillStyle = C.bg2; rr(ctx, x, y, w, rh, 12); ctx.fill(); ctx.fillRect(x, y + rh / 2, w, rh / 2);
    text(ctx, "Kriteria", x + 24, y + 44, 26, { weight: 900, color: C.ink2 }); text(ctx, "Bagus bila…", x + w * 0.36, y + 44, 26, { weight: 900, color: C.ink2 }); text(ctx, "☆", x + w - 40, y + 46, 28, { align: "center", color: C.ink2 });
    rows.forEach(([k, d], i) => { const ry = y + rh * (i + 1); const on = opt.n == null || i < opt.n; ctx.save(); ctx.globalAlpha = on ? 1 : 0.2; ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + w, ry); ctx.stroke(); text(ctx, k, x + 24, ry + 44, 26, { weight: 900 }); text(ctx, d, x + w * 0.36, ry + 44, 22, { weight: 700, color: C.ink2 }); text(ctx, "★★★", x + w - 40, ry + 46, 24, { align: "center", color: C.accent }); ctx.restore(); });
  };
  // kartu bab panduan: nomor, judul, episode sumber, tiga ikon (aturan, contoh, gambar)
  Q.chapter = function (ctx, x, y, w, n, title, src, opt = {}) {
    card(ctx, x, y, w, opt.h || 300, { fill: C.bg2, r: 18 });
    ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 44, y + 44, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x + 44, y + 54, 26, { align: "center", color: "#fff", weight: 900 });
    const lines = wrap(ctx, title, 28, 900, w - 100); lines.forEach((ln, i) => text(ctx, ln, x + 84, y + 54 + i * 34, 28, { weight: 900 }));
    text(ctx, "dari episode " + src, x + 24, y + 150, 22, { weight: 700, color: C.ink2 });
    if (opt.parts) ["aturan", "contoh", "gambar"].forEach((p, i) => { const on = i < opt.parts; card(ctx, x + 24 + i * ((w - 48) / 3), y + 180, (w - 48) / 3 - 10, 80, { fill: on ? C.goodBg : "#F4F6F5", stroke: on ? C.good : "#E1E8E4", lw: 3, r: 12 }); text(ctx, (on ? "✓ " : "") + p, x + 24 + i * ((w - 48) / 3) + ((w - 48) / 3 - 10) / 2, y + 230, 22, { align: "center", weight: 900, color: on ? C.good : C.muted }); });
  };
  K.proyek = Q;
})(typeof window !== "undefined" ? window : globalThis);
