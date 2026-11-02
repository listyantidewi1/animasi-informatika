/* Pembantu gambar D9.4: kartu informasi diri, kotak pilah, kartu pelajar (dengan/ tanpa penutup), unggahan media sosial,
   pengukur celah data, layar profil, sakelar, lingkaran napas. Semua fiktif. Muat setelah kiko-core.js, kiko-devices.js, empati.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Em = K.empati;
  const { rr, text, wrap, card, clamp, lerp } = H;
  const Q = {};
  const KIND = { publik: ["#DDF3E4", "#2E9E5B", "PUBLIK"], privat: ["#FBE1DF", "#D9443B", "PRIVAT"], tergantung: ["#FFF3D6", "#B57A12", "TERGANTUNG"] };
  Q.kind = KIND;
  // kartu informasi: ikon + label; kind mewarnai; opt.dim, opt.on (disorot), opt.small
  Q.info = function (ctx, x, y, w, h, icon, label, kind, opt = {}) {
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2;
    const k = KIND[kind]; card(ctx, x, y, w, h, { fill: k ? k[0] : "#FFF9E0", stroke: opt.on ? C.accent : k ? k[1] : "#E0B04B", lw: opt.on ? 6 : 3, r: 14 });
    const sz = opt.size || 24; text(ctx, icon, x + 16, y + h / 2 + sz * 0.6, sz * 1.4);
    const lines = wrap(ctx, label, sz, 800, w - 70 - sz * 1.4); lines.forEach((ln, i) => text(ctx, ln, x + 30 + sz * 1.5, y + h / 2 + sz * 0.38 + (i - (lines.length - 1) / 2) * sz * 1.2, sz, { weight: 800 }));
    if (k && opt.tag) { ctx.fillStyle = k[1]; rr(ctx, x + w - 112, y + 8, 104, 24, 6); ctx.fill(); text(ctx, k[2], x + w - 60, y + 26, 15, { align: "center", weight: 900, color: "#fff" }); }
    ctx.restore();
  };
  // kotak pilah bertutup terbuka; items: daftar [icon,label] yang sudah masuk
  Q.box = function (ctx, x, y, w, h, kind, sub, items = [], opt = {}) {
    const k = KIND[kind];
    ctx.fillStyle = k[0]; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.strokeStyle = k[1]; ctx.lineWidth = 5; rr(ctx, x, y, w, h, 16); ctx.stroke();
    ctx.fillStyle = k[1]; rr(ctx, x - 10, y - 22, w + 20, 44, 10); ctx.fill(); text(ctx, k[2], x + w / 2, y + 10, 26, { align: "center", weight: 900, color: "#fff" });
    text(ctx, sub, x + w / 2, y + 58, 20, { align: "center", weight: 700, color: C.ink2 });
    items.forEach(([ic, lab], i) => Q.info(ctx, x + 16, y + 76 + i * 58, w - 32, 50, ic, lab, null, { size: 20 }));
  };
  // kartu pelajar fiktif; opt.mask = tutup data berisiko; opt.s skala lebar (default 420)
  Q.idCard = function (ctx, x, y, opt = {}) {
    const w = opt.w || 420, h = w * 0.63, s = w / 420;
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 14 * s });
    ctx.fillStyle = C.kiko; rr(ctx, x, y, w, 46 * s, 14 * s); ctx.fill(); ctx.fillRect(x, y + 24 * s, w, 22 * s);
    text(ctx, "KARTU PELAJAR · SMP NUSA BANGSA", x + w / 2, y + 31 * s, 17 * s, { align: "center", weight: 900, color: "#fff" });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x + 18 * s, y + 66 * s, 96 * s, 120 * s, 8 * s); ctx.fill();
    ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(x + 66 * s, y + 104 * s, 26 * s, Math.PI, 0); ctx.fill(); ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(x + 66 * s, y + 112 * s, 22 * s, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.uniform; rr(ctx, x + 36 * s, y + 138 * s, 60 * s, 44 * s, 8 * s); ctx.fill();
    const rows = [["Nama", "Sinta Pramesti", false], ["NIS", "0012345", true], ["TTL", "Bandung, 12-04-2011", true], ["Alamat", "Jl. Mawar No. 12, RT 03", true], ["Kelas", "IX B", false]];
    rows.forEach(([k, v, risky], i) => { const ry = y + 86 * s + i * 30 * s; text(ctx, k, x + 130 * s, ry, 15 * s, { weight: 700, color: C.ink2 }); if (opt.mask && risky) { ctx.fillStyle = C.ink; rr(ctx, x + 196 * s, ry - 15 * s, 200 * s, 22 * s, 4 * s); ctx.fill(); } else text(ctx, v, x + 196 * s, ry, 16 * s, { weight: 800, color: risky && opt.flag ? C.bad : C.ink }); });
    if (opt.mask) text(ctx, "data berisiko ditutup", x + w / 2, y + h - 8 * s, 15 * s, { align: "center", weight: 900, color: C.good });
  };
  // unggahan media sosial: {who, text, loc, img: fn(ctx,x,y,w,h), likes}; opt.tone "bad"|"good"; opt.w
  Q.post = function (ctx, x, y, w, p, opt = {}) {
    const lines = wrap(ctx, p.text, 24, 700, w - 40); const imgH = p.img ? (opt.imgH || 200) : 0; const h = 70 + lines.length * 31 + (p.loc ? 34 : 0) + imgH + 70;
    card(ctx, x, y, w, h, { fill: "#fff", stroke: opt.tone === "bad" ? C.bad : opt.tone === "good" ? C.good : "#C9D4DB", lw: opt.tone ? 6 : 3, r: 18 });
    Em.avatar(ctx, x + 40, y + 36, 24, p.who, "happy"); text(ctx, p.who, x + 76, y + 32, 22, { weight: 900 }); text(ctx, p.when || "baru saja", x + 76, y + 54, 17, { weight: 700, color: C.muted });
    let cy = y + 96; lines.forEach(ln => { text(ctx, ln, x + 20, cy, 24, { weight: 700 }); cy += 31; });
    if (p.loc) { ctx.fillStyle = opt.tone === "bad" ? C.badBg : C.bg2; rr(ctx, x + 20, cy - 20, Math.min(w - 40, p.loc.length * 13 + 60), 30, 8); ctx.fill(); text(ctx, "📍 " + p.loc, x + 30, cy + 2, 19, { weight: 800, color: opt.tone === "bad" ? C.bad : C.ink2 }); cy += 34; }
    if (p.img) { ctx.fillStyle = "#E6EDF2"; rr(ctx, x + 20, cy, w - 40, imgH, 12); ctx.fill(); ctx.save(); ctx.beginPath(); rr(ctx, x + 20, cy, w - 40, imgH, 12); ctx.clip(); p.img(ctx, x + 20, cy, w - 40, imgH); ctx.restore(); cy += imgH + 12; }
    text(ctx, "♡ " + (p.likes == null ? 12 : p.likes) + "   💬 " + (p.comments == null ? 3 : p.comments) + "   ↗ bagikan", x + 20, cy + 30, 19, { weight: 700, color: C.ink2 });
    return h;
  };
  // pengukur celah data: v 0 (tertutup) .. 1 (terbuka lebar)
  Q.gap = function (ctx, x, y, w, v, opt = {}) {
    v = clamp(v, 0, 1); text(ctx, opt.title || "CELAH DATA", x + w / 2, y - 12, 20, { align: "center", weight: 900, color: C.ink2 });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 30, 15); ctx.fill();
    const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, C.good); g.addColorStop(0.5, C.accent); g.addColorStop(1, C.bad); ctx.fillStyle = g; rr(ctx, x, y, Math.max(30, w * v), 30, 15); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + w * v, y + 15, 19, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (opt.label) text(ctx, opt.label, x + w / 2, y + 62, 24, { align: "center", weight: 900, color: v > 0.6 ? C.bad : v > 0.3 ? C.accentDark : C.good });
    else { text(ctx, "tertutup", x, y + 58, 18, { weight: 800, color: C.good }); text(ctx, "terbuka lebar", x + w, y + 58, 18, { align: "right", weight: 800, color: C.bad }); }
  };
  // layar profil di dalam bingkai HP; p: {name, handle, pub, loc, bio:[[text, risky]], tags}; opt.fix = tampilkan versi rapi
  Q.profile = function (ctx, cx, cy, w, h, p, opt = {}) {
    const sc = D.phone(ctx, cx, cy, w, h); const x = sc.x, y = sc.y;
    Em.avatar(ctx, x + 60, y + 90, 36, p.avatar || "Rani", "happy");
    text(ctx, p.name, x + 110, y + 82, 24, { weight: 900 }); text(ctx, p.handle, x + 110, y + 108, 18, { weight: 700, color: C.muted });
    const pub = opt.fix ? false : p.pub; ctx.fillStyle = pub ? C.badBg : C.goodBg; rr(ctx, x + 16, y + 140, w - 32, 36, 10); ctx.fill(); text(ctx, pub ? "🌐 Publik: semua orang bisa melihat" : "🔒 Privat: hanya teman yang disetujui", x + 28, y + 164, 15, { weight: 800, color: pub ? C.bad : C.good });
    let by = y + 210; text(ctx, "Bio", x + 16, by, 16, { weight: 900, color: C.ink2 }); by += 26;
    p.bio.forEach(([t, risky]) => { if (opt.fix && risky) return; if (risky && opt.flag) { ctx.fillStyle = C.badBg; rr(ctx, x + 12, by - 20, w - 24, 30, 6); ctx.fill(); } text(ctx, t, x + 20, by, 18, { weight: 700, color: risky && opt.flag ? C.bad : C.ink }); by += 34; });
    if (opt.fix) { text(ctx, "+ hobi: menggambar", x + 20, by, 18, { weight: 700, color: C.good }); by += 34; }
    const loc = opt.fix ? false : p.loc; by += 8; Q.toggle(ctx, x + 20, by, loc, "Lokasi langsung", { onBad: true }); by += 50;
    if (p.tags != null) { text(ctx, "Foto menandaimu: " + p.tags + " menunggu tinjauan", x + 20, by + 8, 15, { weight: 700, color: C.ink2 }); }
    return { x, y, w, h };
  };
  // sakelar; on; opt.onBad = kondisi nyala dianggap berisiko (merah)
  Q.toggle = function (ctx, x, y, on, label, opt = {}) {
    const col = on ? (opt.onBad ? C.bad : C.good) : "#9AAFA6";
    ctx.fillStyle = col; rr(ctx, x, y - 14, 56, 28, 14); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + (on ? 42 : 14), y, 11, 0, Math.PI * 2); ctx.fill();
    text(ctx, label + ": " + (on ? "nyala" : "mati"), x + 70, y + 7, 18, { weight: 800, color: col });
  };
  // lingkaran napas; phase 0..1 membesar-mengecil
  Q.breath = function (ctx, cx, cy, r, phase, label) {
    const k = 0.75 + 0.25 * Math.sin(phase * Math.PI * 2);
    ctx.fillStyle = "rgba(46,126,154,0.15)"; ctx.beginPath(); ctx.arc(cx, cy, r * k * 1.25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(46,126,154,0.35)"; ctx.beginPath(); ctx.arc(cx, cy, r * k, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r * k * 0.6, 0, Math.PI * 2); ctx.fill();
    if (label) text(ctx, label, cx, cy + 10, 26, { align: "center", weight: 900, color: "#fff" });
  };
  // siluet orang dengan tanda tanya / tanda ketemu
  Q.silhouette = function (ctx, cx, cy, s, opt = {}) {
    ctx.fillStyle = opt.color || "#7B8B95"; ctx.beginPath(); ctx.arc(cx, cy - s * 0.55, s * 0.28, 0, Math.PI * 2); ctx.fill(); rr(ctx, cx - s * 0.4, cy - s * 0.2, s * 0.8, s * 0.9, s * 0.25); ctx.fill();
    if (opt.mark) text(ctx, opt.mark, cx, cy + s * 0.2, s * 0.5, { align: "center", weight: 900, color: "#fff" });
  };
  K.privasi = Q;
})(typeof window !== "undefined" ? window : globalThis);
