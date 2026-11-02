/* Pembantu gambar E.3: kartu akun, brankas kata sandi, formulir masuk, layar kode autentikator, daftar sesi aktif,
   panel pengaturan router, lampu status. Gaya diagram Fase E. Semua akun dan kode fiktif. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, clamp, lerp } = H;
  const A = {};
  // kartu akun: ikon, nama, sandi (opsional), status "open"|"safe"|null
  A.account = function (ctx, x, y, w, icon, name, pw, status, opt = {}) {
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.25;
    card(ctx, x, y, w, 90, { fill: status === "open" ? C.badBg : status === "safe" ? C.goodBg : "#fff", stroke: status === "open" ? C.bad : status === "safe" ? C.good : "#B7C4CC", lw: status ? 5 : 3, r: 14 });
    text(ctx, icon, x + 36, y + 58, 34, { align: "center" }); text(ctx, name, x + 70, y + 40, 22, { weight: 900 });
    if (pw) text(ctx, pw, x + 70, y + 72, 20, { weight: 700, color: status === "open" ? C.bad : C.ink2 });
    if (status) text(ctx, status === "open" ? "terbuka ✕" : "aman ✓", x + w - 16, y + 56, 20, { align: "right", weight: 900, color: status === "open" ? C.bad : C.good });
    ctx.restore();
  };
  // brankas manajer kata sandi
  A.vault = function (ctx, x, y, w, h, entries, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#1F2A33", r: 18 }); text(ctx, "🔐 BRANKAS KATA SANDI", x + w / 2, y + 40, 22, { align: "center", weight: 900, color: "#fff" });
    entries.forEach(([n, pw], i) => { if (opt.n != null && i >= opt.n) return; ctx.fillStyle = "#2B3A46"; rr(ctx, x + 16, y + 60 + i * 52, w - 32, 44, 10); ctx.fill(); text(ctx, n, x + 30, y + 88 + i * 52, 20, { weight: 800, color: "#C9D4DB" }); text(ctx, pw, x + w - 30, y + 88 + i * 52, 18, { align: "right", weight: 700, color: "#8FD0E6" }); });
    if (opt.master) { ctx.fillStyle = C.accent; rr(ctx, x + 16, y + h - 60, w - 32, 44, 10); ctx.fill(); text(ctx, "sandi induk: " + opt.master, x + w / 2, y + h - 32, 18, { align: "center", weight: 900, color: "#1F2A33" }); }
  };
  // formulir masuk: step 0 sandi, 1 kode; opt.pw, opt.code, opt.ok, opt.bad
  A.login = function (ctx, x, y, w, step, opt = {}) {
    card(ctx, x, y, w, 230, { fill: "#fff", stroke: opt.bad ? C.bad : opt.ok ? C.good : "#B7C4CC", lw: opt.bad || opt.ok ? 6 : 3, r: 16 });
    text(ctx, opt.title || "Masuk ke akun", x + w / 2, y + 40, 22, { align: "center", weight: 900 });
    const f = (label, val, hl, yy) => { text(ctx, label, x + 24, yy, 16, { weight: 800, color: C.ink2 }); ctx.fillStyle = hl ? "#FFF3D6" : "#F4F8FB"; ctx.strokeStyle = hl ? C.accent : "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x + 24, yy + 8, w - 48, 44, 8); ctx.fill(); ctx.stroke(); text(ctx, val, x + 36, yy + 38, 22, { weight: 800 }); };
    f("Kata sandi", opt.pw || "", step === 0, y + 70); f("Kode 6 angka", opt.code || "", step === 1, y + 140);
    if (opt.ok) text(ctx, "✓ masuk", x + w - 24, y + 218, 20, { align: "right", weight: 900, color: C.good });
    if (opt.bad) text(ctx, opt.bad, x + w - 24, y + 218, 18, { align: "right", weight: 900, color: C.bad });
  };
  // layar autentikator di HP: kode + sisa detik (0..30)
  A.authApp = function (ctx, cx, cy, code, secs, opt = {}) {
    const sc = D.phone(ctx, cx, cy, 220, 360);
    text(ctx, "Autentikator", cx, sc.y + 50, 18, { align: "center", weight: 900, color: C.ink2 });
    text(ctx, opt.name || "Surel sekolah", cx, sc.y + 110, 16, { align: "center", weight: 700, color: C.ink2 });
    text(ctx, code, cx, sc.y + 170, 40, { align: "center", weight: 900, color: C.kiko });
    ctx.strokeStyle = "#E6EDF2"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, sc.y + 250, 34, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = secs < 8 ? C.bad : C.good; ctx.beginPath(); ctx.arc(cx, sc.y + 250, 34, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * secs / 30); ctx.stroke(); text(ctx, String(Math.ceil(secs)), cx, sc.y + 258, 22, { align: "center", weight: 900 });
    text(ctx, "berganti tiap 30 detik", cx, sc.y + 320, 14, { align: "center", weight: 700, color: C.muted });
    return sc;
  };
  // daftar sesi aktif: rows [[perangkat, lokasi, waktu, bad]]
  A.sessions = function (ctx, x, y, w, rows, opt = {}) {
    const sc = D.windowFrame(ctx, x, y, w, 90 + rows.length * 70, "Perangkat yang masuk");
    rows.forEach(([d, loc, t, bad], i) => { const ry = sc.y + i * 70; card(ctx, sc.x, ry, sc.w, 60, { fill: bad ? C.badBg : "#F7FAF8", stroke: bad ? C.bad : "#E1E8E4", lw: bad ? 4 : 2, r: 10 }); text(ctx, d, sc.x + 16, ry + 26, 20, { weight: 900 }); text(ctx, loc + " · " + t, sc.x + 16, ry + 50, 16, { weight: 700, color: bad ? C.bad : C.ink2 }); if (bad && opt.kick) { ctx.fillStyle = C.bad; rr(ctx, sc.x + sc.w - 130, ry + 12, 116, 36, 8); ctx.fill(); text(ctx, "Keluarkan", sc.x + sc.w - 72, ry + 36, 16, { align: "center", weight: 900, color: "#fff" }); } });
    return sc;
  };
  // panel router: rows [[label, nilai, ok]]
  A.routerPanel = function (ctx, x, y, w, rows, opt = {}) {
    const sc = D.windowFrame(ctx, x, y, w, 90 + rows.length * 56, "Pengaturan router · 192.168.1.1");
    rows.forEach(([lab, val, ok], i) => { if (opt.n != null && i >= opt.n) return; const ry = sc.y + i * 56; ctx.fillStyle = ok ? C.good : C.bad; ctx.beginPath(); ctx.arc(sc.x + 16, ry + 22, 10, 0, Math.PI * 2); ctx.fill(); text(ctx, lab, sc.x + 40, ry + 29, 19, { weight: 900 }); text(ctx, val, sc.x + sc.w - 12, ry + 29, 18, { align: "right", weight: 800, color: ok ? C.good : C.bad }); });
    return sc;
  };
  // stiker router
  A.sticker = function (ctx, x, y, w) { card(ctx, x, y, w, 110, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 2, r: 8 }); text(ctx, "Wi-Fi: RUMAH-KITA-12", x + 14, y + 32, 16, { weight: 800 }); text(ctx, "Sandi Wi-Fi: 12345678", x + 14, y + 60, 16, { weight: 800 }); text(ctx, "Admin: admin / admin", x + 14, y + 88, 16, { weight: 900, color: C.bad }); };
  K.akun = A;
})(typeof window !== "undefined" ? window : globalThis);
