/* Pembantu gambar D8.4: kartu berita (portal, akun, pesan grup), lencana centang/tanya, pohon tumbang, kamera wartawan, meja redaksi,
   daftar empat pertanyaan, bilah perjalanan berita. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp } = H;
  const Q = {};
  // kartu kabar: kind "pers" | "akun" | "grup"; opt.title, by, time, body, photo (bool), badge "ok"|"bad"|null, hl
  Q.news = function (ctx, x, y, w, h, kind, opt = {}) {
    const col = kind === "pers" ? C.kiko : kind === "akun" ? "#D9443B" : "#2E9E5B";
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: opt.hl || "#B7C4CC", lw: opt.hl ? 6 : 3, r: 16 });
    ctx.fillStyle = col; rr(ctx, x, y, w, 44, 16); ctx.fill(); ctx.fillRect(x, y + 22, w, 22);
    text(ctx, kind === "pers" ? "PORTAL BERITA" : kind === "akun" ? "AKUN GOSIP" : "GRUP KELAS", x + 16, y + 30, 20, { weight: 900, color: "#fff" });
    let cy = y + 80; const size = opt.size || 24;
    if (opt.title) { const lines = wrap(ctx, opt.title, size, 900, w - 32); lines.forEach(ln => { text(ctx, ln, x + 16, cy, size, { weight: 900 }); cy += size * 1.25; }); cy += 6; }
    if (opt.by != null) { text(ctx, opt.by, x + 16, cy, 20, { weight: 700, color: opt.by ? C.ink2 : C.bad }); cy += 28; }
    if (opt.time != null) { text(ctx, opt.time, x + 16, cy, 20, { weight: 700, color: opt.time ? C.ink2 : C.bad }); cy += 28; }
    if (opt.photo) { ctx.fillStyle = "#DCEBF2"; rr(ctx, x + 16, cy + 4, w - 32, 110, 8); ctx.fill(); ctx.fillStyle = "#C9D4DB"; ctx.fillRect(x + 16, cy + 90, w - 32, 24); ctx.save(); rr(ctx, x + 16, cy + 4, w - 32, 110, 8); ctx.clip(); Q.tree(ctx, x + w / 2 - 50, cy + 92, 70, { fallen: true }); ctx.restore(); if (opt.photoNote) { ctx.fillStyle = C.bad; rr(ctx, x + w - 150, cy + 10, 128, 26, 6); ctx.fill(); text(ctx, opt.photoNote, x + w - 86, cy + 29, 16, { align: "center", weight: 900, color: "#fff" }); } cy += 142; }
    if (opt.body) { const lines = wrap(ctx, opt.body, 20, 700, w - 32); lines.forEach(ln => { text(ctx, ln, x + 16, cy, 20, { weight: 700, color: C.ink2 }); cy += 26; }); }
    if (opt.badge) Q.badge(ctx, x + w - 30, y + 22, opt.badge);
    return cy;
  };
  Q.badge = function (ctx, cx, cy, kind) { ctx.fillStyle = kind === "ok" ? C.good : kind === "bad" ? C.bad : C.accent; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, kind === "ok" ? "✓" : kind === "bad" ? "✕" : "?", cx, cy + 9, 26, { align: "center", weight: 900, color: "#fff" }); };
  // pohon; fallen = tumbang
  Q.tree = function (ctx, x, y, s, opt = {}) {
    ctx.save(); ctx.translate(x, y); if (opt.fallen) { ctx.rotate(-1.35); ctx.translate(0, s * 0.1); }
    ctx.fillStyle = "#8B5A2B"; rr(ctx, -s * 0.12, -s * 1.1, s * 0.24, s * 1.1, s * 0.05); ctx.fill();
    if (opt.fallen) { ctx.fillStyle = "#6B4423"; ctx.beginPath(); ctx.moveTo(-s * 0.3, s * 0.05); ctx.lineTo(0, -s * 0.15); ctx.lineTo(s * 0.3, s * 0.05); ctx.lineTo(s * 0.15, s * 0.2); ctx.lineTo(-s * 0.15, s * 0.2); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = "#2E9E5B"; ctx.beginPath(); ctx.arc(0, -s * 1.2, s * 0.45, 0, Math.PI * 2); ctx.arc(-s * 0.3, -s * 0.95, s * 0.35, 0, Math.PI * 2); ctx.arc(s * 0.3, -s * 0.95, s * 0.35, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  };
  // kamera (wartawan)
  Q.camera = function (ctx, x, y, s) { ctx.fillStyle = "#1F2A33"; rr(ctx, x - s * 0.5, y - s * 0.3, s, s * 0.6, s * 0.1); ctx.fill(); ctx.fillStyle = "#7B8B95"; ctx.beginPath(); ctx.arc(x, y, s * 0.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#DCEBF2"; ctx.beginPath(); ctx.arc(x, y, s * 0.1, 0, Math.PI * 2); ctx.fill(); };
  // buku catatan
  Q.notepad = function (ctx, x, y, w, h, lines = []) { ctx.fillStyle = "#FFF9E0"; rr(ctx, x, y, w, h, 8); ctx.fill(); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 8); ctx.stroke(); lines.forEach((ln, i) => text(ctx, ln, x + 14, y + 32 + i * 28, 18, { weight: 700, color: C.ink2 })); };
  // bilah perjalanan: steps [label], n aktif
  Q.journey = function (ctx, x, y, w, steps, opt = {}) {
    const n = opt.n == null ? steps.length : opt.n; const sw = w / steps.length;
    steps.forEach((s, i) => { const cx = x + sw * i + sw / 2; const on = i < n; ctx.save(); ctx.globalAlpha = on ? 1 : 0.25; card(ctx, cx - sw / 2 + 12, y, sw - 24, 110, { fill: i === n - 1 && opt.hlLast ? "#FFF3D6" : C.bg2, stroke: i === n - 1 && opt.hlLast ? C.accent : undefined, lw: 4, r: 16 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(cx - sw / 2 + 44, y + 32, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), cx - sw / 2 + 44, y + 40, 20, { align: "center", color: "#fff", weight: 900 }); const lines = wrap(ctx, s, 22, 900, sw - 50); lines.forEach((ln, k) => text(ctx, ln, cx, y + 76 + k * 26, 22, { align: "center", weight: 900 })); ctx.restore(); if (i && i < n) { ctx.fillStyle = C.ink2; ctx.beginPath(); ctx.moveTo(cx - sw / 2 - 12, y + 45); ctx.lineTo(cx - sw / 2 + 8, y + 55); ctx.lineTo(cx - sw / 2 - 12, y + 65); ctx.closePath(); ctx.fill(); } });
  };
  // daftar empat pertanyaan: answers = [null|"ok"|"bad"], hl indeks
  Q.fourQ = function (ctx, x, y, w, answers = [], opt = {}) {
    const Qs = ["Siapa sumbernya?", "Apa buktinya?", "Kapan terjadi?", "Sumber lain sepakat?"];
    Qs.forEach((q, i) => { const ry = y + i * 86; const on = opt.hl === i; card(ctx, x, ry, w, 72, { fill: on ? "#FFF3D6" : C.bg2, stroke: on ? C.accent : undefined, lw: 4, r: 14 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 36, ry + 36, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 36, ry + 44, 20, { align: "center", color: "#fff", weight: 900 }); text(ctx, q, x + 70, ry + 45, 26, { weight: 900 }); if (answers[i]) Q.badge(ctx, x + w - 36, ry + 36, answers[i]); if (opt.notes && opt.notes[i]) text(ctx, opt.notes[i], x + w - 70, ry + 45, 20, { align: "right", weight: 700, color: answers[i] === "ok" ? C.good : C.bad }); });
  };
  K.pers = Q;
})(typeof window !== "undefined" ? window : globalThis);
