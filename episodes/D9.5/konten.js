/* Pembantu gambar D9.5: kotak storyboard, HP merekam, lampu & tumpuan, penyunting video, daftar periksa, sampul video,
   kartu saluran, kartu kredit karya, tempat sampah tiga warna. Muat setelah kiko-core.js, kiko-devices.js, empati.js, proyek.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, kid, clamp } = H;
  const Q = {};
  // tiga tempat sampah berwarna; opt.n jumlah tampil, opt.label
  Q.bins = function (ctx, cx, cy, s, opt = {}) {
    const bins = [["#2E9E5B", "organik"], ["#F2B134", "anorganik"], ["#D9443B", "B3"]]; const n = opt.n == null ? 3 : opt.n;
    bins.forEach(([col, lab], i) => { if (i >= n) return; const x = cx + (i - 1) * s * 1.3; ctx.fillStyle = col; rr(ctx, x - s * 0.45, cy - s * 0.6, s * 0.9, s * 1.2, s * 0.12); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,0.18)"; rr(ctx, x - s * 0.52, cy - s * 0.7, s * 1.04, s * 0.18, s * 0.06); ctx.fill(); if (opt.label !== false) text(ctx, lab, x, cy + s * 0.85, s * 0.26, { align: "center", weight: 900, color: C.ink2 }); });
  };
  // tumpukan sampah bercampur
  Q.pile = function (ctx, cx, cy, s) { const cols = ["#8E6BBF", "#C98A57", "#7B8B95", "#2E7E9A", "#E0A23B", "#D9443B"]; for (let i = 0; i < 9; i++) { ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.ellipse(cx + ((i * 37) % 60 - 30) * s / 50, cy - ((i * 23) % 40) * s / 50, s * 0.32, s * 0.2, (i * 0.7) % 3, 0, Math.PI * 2); ctx.fill(); } };
  // satu kotak storyboard: nomor, judul, sketsa (fn), kalimat narasi
  Q.frame = function (ctx, x, y, w, h, n, title, draw, caption, opt = {}) {
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2;
    card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : "#FFFFFF", stroke: opt.on ? C.accent : "#B7C4CC", lw: opt.on ? 6 : 3, r: 12 });
    ctx.fillStyle = opt.color || C.kiko; ctx.beginPath(); ctx.arc(x + 26, y + 26, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x + 26, y + 33, 20, { align: "center", weight: 900, color: "#fff" });
    text(ctx, title, x + 52, y + 33, 20, { weight: 900, color: opt.color || C.kiko });
    ctx.fillStyle = "#EAF2EE"; rr(ctx, x + 12, y + 50, w - 24, h - 110, 8); ctx.fill();
    if (draw) { ctx.save(); ctx.beginPath(); rr(ctx, x + 12, y + 50, w - 24, h - 110, 8); ctx.clip(); draw(ctx, x + w / 2, y + 50 + (h - 110) / 2, Math.min(w, h - 110)); ctx.restore(); }
    if (caption) { const lines = wrap(ctx, caption, 18, 700, w - 24); lines.slice(0, 2).forEach((ln, i) => text(ctx, ln, x + 12, y + h - 36 + i * 22, 18, { weight: 700, color: C.ink2 })); }
    ctx.restore();
  };
  // HP merekam: layar jadi jendela bidik; opt.rec = merekam; opt.subject = fn(ctx, sc) menggambar objek; opt.time
  Q.recPhone = function (ctx, cx, cy, w, h, opt = {}) {
    const sc = D.phone(ctx, cx, cy, w, h);
    ctx.fillStyle = "#CFE3D8"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 26); ctx.fill();
    if (opt.subject) { ctx.save(); ctx.beginPath(); rr(ctx, sc.x, sc.y, sc.w, sc.h, 26); ctx.clip(); opt.subject(ctx, sc); ctx.restore(); }
    ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 3; ctx.strokeRect(sc.x + 30, sc.y + 60, sc.w - 60, sc.h - 150);
    if (opt.rec) { ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(sc.x + 40, sc.y + 40, 10, 0, Math.PI * 2); ctx.fill(); text(ctx, "REC " + (opt.time || "00:12"), sc.x + 58, sc.y + 47, 18, { weight: 900, color: C.bad }); }
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, sc.y + sc.h - 46, 26, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(cx, sc.y + sc.h - 46, opt.rec ? 12 : 20, 0, Math.PI * 2); ctx.fill();
    return sc;
  };
  // lampu / cahaya dari arah; dir "front"|"back"
  Q.light = function (ctx, cx, cy, s, opt = {}) {
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, s * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.accent; ctx.lineWidth = s * 0.06; ctx.lineCap = "round";
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + (opt.t || 0) * 0.3; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * s * 0.42, cy + Math.sin(a) * s * 0.42); ctx.lineTo(cx + Math.cos(a) * s * 0.62, cy + Math.sin(a) * s * 0.62); ctx.stroke(); }
  };
  // tumpuan HP (tripod kecil)
  Q.stand = function (ctx, cx, cy, s) { ctx.strokeStyle = "#4A5A66"; ctx.lineWidth = s * 0.08; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - s * 0.5, cy + s); ctx.moveTo(cx, cy); ctx.lineTo(cx + s * 0.5, cy + s); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + s); ctx.stroke(); };
  // mikrofon
  Q.mic = function (ctx, cx, cy, s, opt = {}) { ctx.fillStyle = opt.color || C.kiko; rr(ctx, cx - s * 0.2, cy - s * 0.6, s * 0.4, s * 0.8, s * 0.2); ctx.fill(); ctx.strokeStyle = opt.color || C.kiko; ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.arc(cx, cy, s * 0.38, 0, Math.PI); ctx.moveTo(cx, cy + s * 0.38); ctx.lineTo(cx, cy + s * 0.65); ctx.stroke(); if (opt.waves) for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.arc(cx, cy - s * 0.2, s * (0.6 + i * 0.25), -0.6, 0.6); ctx.stroke(); } };
  // penyunting video: lintasan klip; clips [{w, label, cut}], opt.text = teks besar di pratinjau, opt.assets
  Q.editor = function (ctx, x, y, w, h, clips, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#1F2A33", r: 16 });
    // pratinjau
    ctx.fillStyle = "#CFE3D8"; rr(ctx, x + 20, y + 20, w * 0.5, h - 150, 10); ctx.fill();
    Q.bins(ctx, x + 20 + w * 0.25, y + (h - 150) / 2 + 10, 34, { label: false });
    if (opt.text) { ctx.fillStyle = "rgba(31,42,51,0.85)"; rr(ctx, x + 40, y + h - 190, w * 0.5 - 40, 44, 8); ctx.fill(); text(ctx, opt.text, x + 20 + w * 0.25, y + h - 160, 22, { align: "center", weight: 900, color: "#fff" }); }
    // lintasan
    let cx = x + 20; const ty = y + h - 90;
    text(ctx, "VIDEO", x + 20, ty - 12, 14, { weight: 900, color: "#9AAFA6" });
    clips.forEach(c => { ctx.fillStyle = c.cut ? "#7B8B95" : C.kiko; rr(ctx, cx, ty, c.w, 34, 6); ctx.fill(); if (c.cut) { ctx.strokeStyle = C.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx + 6, ty + 4); ctx.lineTo(cx + c.w - 6, ty + 30); ctx.moveTo(cx + c.w - 6, ty + 4); ctx.lineTo(cx + 6, ty + 30); ctx.stroke(); } text(ctx, c.label, cx + c.w / 2, ty + 23, 15, { align: "center", weight: 800, color: "#fff" }); cx += c.w + 6; });
    text(ctx, "MUSIK", x + 20, ty + 60, 14, { weight: 900, color: "#9AAFA6" });
    ctx.fillStyle = opt.musicBad ? C.bad : C.good; rr(ctx, x + 20, ty + 68, w * 0.55, 18, 6); ctx.fill(); text(ctx, opt.music || "musik bebas lisensi", x + 30, ty + 82, 13, { weight: 800, color: "#fff" });
    // panel aset
    const px = x + w * 0.5 + 40; card(ctx, px, y + 20, w - w * 0.5 - 60, h - 150, { fill: "#2B3A46", r: 10 }); text(ctx, "ASET", px + 14, y + 46, 16, { weight: 900, color: "#9AAFA6" });
    (opt.assets || []).forEach(([t, ok], i) => { ctx.fillStyle = ok ? C.good : C.bad; rr(ctx, px + 14, y + 60 + i * 44, 28, 28, 6); ctx.fill(); text(ctx, ok ? "✓" : "✕", px + 28, y + 81 + i * 44, 20, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, px + 52, y + 80 + i * 44, 17, { weight: 800, color: "#fff" }); });
  };
  // daftar periksa: items [[teks, status]] status true/false/null; opt.n tampil
  Q.checklist = function (ctx, x, y, w, items, opt = {}) {
    items.forEach(([t, st], i) => { const ry = y + i * (opt.rowH || 86); const show = opt.n == null || i < opt.n; ctx.save(); if (!show) ctx.globalAlpha = 0.2; card(ctx, x, ry, w, (opt.rowH || 86) - 12, { fill: st === false ? C.badBg : st ? C.goodBg : C.panel, stroke: st === false ? C.bad : st ? C.good : "#C9D4DB", lw: 3, r: 14 }); ctx.strokeStyle = st === false ? C.bad : st ? C.good : "#9AAFA6"; ctx.lineWidth = 4; rr(ctx, x + 18, ry + 18, 36, 36, 8); ctx.stroke(); if (st != null) text(ctx, st ? "✓" : "✕", x + 36, ry + 47, 30, { align: "center", weight: 900, color: st ? C.good : C.bad }); const lines = wrap(ctx, t, 24, 800, w - 90); lines.forEach((ln, k) => text(ctx, ln, x + 72, ry + 44 + k * 28 - (lines.length - 1) * 12, 24, { weight: 800 })); ctx.restore(); });
  };
  // sampul video: gambar + judul; opt.bait = umpan klik (merah), opt.ok
  Q.thumb = function (ctx, x, y, w, h, title, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.bait ? "#FBE1DF" : "#DDF3E4", stroke: opt.bait ? C.bad : C.good, lw: 5, r: 16 });
    ctx.fillStyle = "#CFE3D8"; rr(ctx, x + 16, y + 16, w - 32, h - 110, 10); ctx.fill();
    if (opt.bait) { text(ctx, "😱", x + w / 2, y + (h - 110) / 2 + 40, 90, { align: "center" }); ctx.fillStyle = C.bad; rr(ctx, x + 30, y + 30, 140, 40, 8); ctx.fill(); text(ctx, "WAJIB TAHU!!!", x + 100, y + 58, 18, { align: "center", weight: 900, color: "#fff" }); }
    else Q.bins(ctx, x + w / 2, y + (h - 110) / 2 + 10, 42, { label: false });
    const lines = wrap(ctx, title, 24, 900, w - 32); lines.slice(0, 2).forEach((ln, i) => text(ctx, ln, x + 16, y + h - 64 + i * 30, 24, { weight: 900, color: opt.bait ? C.bad : C.ink }));
    text(ctx, opt.bait ? "✕ umpan klik" : "✓ jujur", x + w - 16, y + h - 12, 20, { align: "right", weight: 900, color: opt.bait ? C.bad : C.good });
  };
  // kartu saluran: ikon, nama, penonton
  Q.channel = function (ctx, x, y, w, h, icon, name, audience, opt = {}) {
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2;
    card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 5, r: 16 });
    text(ctx, icon, x + w / 2, y + 80, 60, { align: "center" }); text(ctx, name, x + w / 2, y + 130, 26, { align: "center", weight: 900 });
    const lines = wrap(ctx, audience, 22, 700, w - 30); lines.forEach((ln, i) => text(ctx, ln, x + w / 2, y + 166 + i * 28, 22, { align: "center", weight: 700, color: C.ink2 }));
    ctx.restore();
  };
  // kartu kredit karya di akhir video
  Q.credit = function (ctx, x, y, w, h, lines, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#1F2A33", r: 16 });
    let cy = y + 64; lines.forEach(([t, big], i) => { if (opt.n == null || i < opt.n) text(ctx, t, x + w / 2, cy, big ? 30 : 22, { align: "center", weight: big ? 900 : 700, color: big ? "#fff" : "#C9D4DB" }); cy += big ? 52 : 40; });
  };
  K.konten = Q;
})(typeof window !== "undefined" ? window : globalThis);
