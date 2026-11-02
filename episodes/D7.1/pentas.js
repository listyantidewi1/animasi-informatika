/* Pembantu gambar D7.1 (pentas kelas): kertas catatan, kotak & pohon pemecahan, kursi, jadwal, denah panggung, peta angkot,
   daftar langkah, papan penampilan (soal Bebras), dan bilah "empat jurus". Muat setelah ../_alat/kiko-core.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, kid, kiko, ease, clamp, lerp } = H;
  const P = {};
  P.JURUS = [["1", "Dekomposisi", "pecah jadi kecil"], ["2", "Pola", "cari yang berulang"], ["3", "Abstraksi", "saring yang penting"], ["4", "Algoritma", "susun langkahnya"]];
  const PAPER = ["#FFF3B0", "#FFD6E0", "#D6F5E3", "#DCEBFF", "#FFE2C2"];

  // kertas catatan kecil (sticky note), boleh miring
  P.note = function (ctx, x, y, w, h, s, opt = {}) {
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(opt.rot || 0);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; rr(ctx, -w / 2 + 6, -h / 2 + 8, w, h, 6); ctx.fill();
    ctx.fillStyle = opt.fill || PAPER[(opt.i || 0) % PAPER.length]; rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.fill();
    if (opt.stroke) { ctx.strokeStyle = opt.stroke; ctx.lineWidth = 5; ctx.stroke(); }
    const size = opt.size || 28, lines = wrap(ctx, s, size, 800, w - 24);
    lines.forEach((ln, i) => text(ctx, ln, 0, -((lines.length - 1) * size * 1.2) / 2 + i * size * 1.2 + size * 0.35, size, { align: "center", weight: 800, color: opt.color || C.ink }));
    ctx.restore();
  };
  // kotak berlabel untuk pohon pemecahan
  P.box = function (ctx, x, y, w, h, s, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.fill || C.panel, stroke: opt.stroke || "#D7E2DC", lw: opt.lw || 3, r: 16 });
    const size = opt.size || 30, lines = wrap(ctx, s, size, 800, w - 20);
    lines.forEach((ln, i) => text(ctx, ln, x + w / 2, y + h / 2 - ((lines.length - 1) * size * 1.2) / 2 + i * size * 1.2 + size * 0.35, size, { align: "center", weight: 800, color: opt.color || C.ink }));
  };
  P.link = function (ctx, x1, y1, x2, y2, color = "#9AAFA6") { ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1, (y1 + y2) / 2); ctx.lineTo(x2, (y1 + y2) / 2); ctx.lineTo(x2, y2); ctx.stroke(); };
  // bilah empat jurus di atas adegan; learned = berapa jurus yang sudah dikenal (disorot), active = indeks jurus yang sedang dibahas
  P.jurusBar = function (ctx, learned, active) {
    P.JURUS.forEach(([n, name], i) => {
      const x = 160 + i * 410, on = i < learned, act = i === active;
      card(ctx, x, 128, 380, 64, { fill: act ? "#FFF3D6" : on ? C.goodBg : C.bg2, stroke: act ? C.accent : on ? C.good : "#D7E2DC", lw: act ? 4 : 2, r: 14 });
      ctx.fillStyle = act ? C.accentDark : on ? C.good : C.muted; ctx.beginPath(); ctx.arc(x + 34, 160, 20, 0, Math.PI * 2); ctx.fill();
      text(ctx, n, x + 34, 169, 24, { align: "center", color: "#fff", weight: 900 });
      text(ctx, on || act ? name : "?", x + 70, 170, 28, { weight: 800, color: on || act ? C.ink : C.muted });
    });
  };
  // kartu nama jurus (penutup tiap segmen)
  P.jurusCard = function (ctx, i, en) {
    const [n, name, desc] = P.JURUS[i];
    card(ctx, 360, 300, 1200, 400, { stroke: C.accent, lw: 6 });
    text(ctx, "JURUS " + n, 960, 380, 34, { align: "center", color: C.accentDark, weight: 800 });
    text(ctx, name, 960, 480, 84, { align: "center", weight: 900 });
    text(ctx, "(" + en + ")", 960, 540, 36, { align: "center", weight: 600, color: C.ink2 });
    text(ctx, desc, 960, 630, 40, { align: "center", weight: 800, color: C.ink2 });
  };
  // kursi penonton tampak atas
  P.chair = function (ctx, x, y, s, on = true) { ctx.fillStyle = on ? "#C98A57" : "#E6E0D8"; rr(ctx, x - s / 2, y - s / 2, s, s, s * 0.2); ctx.fill(); ctx.fillStyle = on ? "#A4653A" : "#D5CEC4"; rr(ctx, x - s / 2, y - s / 2, s, s * 0.3, s * 0.2); ctx.fill(); };
  // jadwal mingguan: days = [[nama, kegiatan, warna]], highlight = indeks
  P.schedule = function (ctx, x, y, days, opt = {}) {
    const w = opt.w || 200, h = opt.h || 180;
    days.forEach(([d, act, col], i) => {
      const cx = x + i * (w + 14); card(ctx, cx, y, w, h, { fill: C.panel, stroke: opt.highlight === i ? C.accent : "#D7E2DC", lw: opt.highlight === i ? 6 : 3 });
      text(ctx, d, cx + w / 2, y + 44, 28, { align: "center", weight: 800, color: C.ink2 });
      if (act) { ctx.fillStyle = col; rr(ctx, cx + 20, y + 70, w - 40, 80, 14); ctx.fill(); text(ctx, act, cx + w / 2, y + 122, 32, { align: "center", weight: 900, color: "#fff" }); }
      else text(ctx, "?", cx + w / 2, y + 128, 56, { align: "center", weight: 900, color: C.accentDark });
    });
  };
  // denah panggung: detail = penuh pernak-pernik, atau hanya yang penting
  P.stagePlan = function (ctx, x, y, w, h, detail) {
    card(ctx, x, y, w, h, { fill: "#FBFDFC", stroke: "#B7C7BF", lw: 3 });
    // panggung
    ctx.fillStyle = detail ? "#8E6BBF" : C.bg2; rr(ctx, x + w * 0.25, y + 24, w * 0.5, h * 0.22, 12); ctx.fill();
    if (detail) { ctx.fillStyle = "#D9443B"; for (let i = 0; i < 9; i++) { ctx.fillRect(x + w * 0.25 + i * w * 0.055, y + 24, w * 0.03, h * 0.22); } }
    text(ctx, "PANGGUNG", x + w / 2, y + 24 + h * 0.13, 30, { align: "center", weight: 900, color: detail ? "#fff" : C.ink });
    // kursi
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) P.chair(ctx, x + w * 0.3 + c * w * 0.08, y + h * 0.42 + r * h * 0.14, detail ? 26 : 22, true);
    text(ctx, "kursi penonton", x + w / 2, y + h * 0.84, 24, { align: "center", weight: 700, color: C.ink2 });
    // pintu & meja snack
    ctx.fillStyle = C.good; rr(ctx, x + w - 60, y + h * 0.4, 36, 90, 8); ctx.fill(); text(ctx, "pintu", x + w - 42, y + h * 0.4 + 120, 22, { align: "center", weight: 700, color: C.ink2 });
    ctx.fillStyle = C.accent; rr(ctx, x + 24, y + h * 0.45, 70, 44, 8); ctx.fill(); text(ctx, "snack", x + 59, y + h * 0.45 + 72, 22, { align: "center", weight: 700, color: C.ink2 });
    if (detail) { // pernak-pernik yang tidak perlu
      const notes = ["tirai merah marun", "lampu merek X 60 W", "karpet motif bunga", "kabel 12 meter", "vas bunga 3", "balon 40 buah"];
      notes.forEach((s, i) => { ctx.fillStyle = PAPER[i % PAPER.length]; rr(ctx, x + 20 + (i % 3) * 150, y + h - 130 + Math.floor(i / 3) * 56, 140, 46, 8); ctx.fill(); text(ctx, s, x + 90 + (i % 3) * 150, y + h - 100 + Math.floor(i / 3) * 56, 18, { align: "center", weight: 700 }); });
      ctx.strokeStyle = "#8E6BBF"; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + w * 0.1, y + h * 0.3 + i * 10); ctx.bezierCurveTo(x + w * 0.5, y + h * 0.2 + i * 14, x + w * 0.6, y + h * 0.5, x + w * 0.9, y + h * 0.3 + i * 12); ctx.stroke(); }
    }
  };
  // peta jalur angkot: abstract = hanya rute dan pemberhentian
  P.angkotMap = function (ctx, x, y, w, h, abstract) {
    card(ctx, x, y, w, h, { fill: abstract ? "#FBFDFC" : "#EEF4E8", stroke: "#B7C7BF", lw: 3 });
    const pts = [[0.08, 0.75], [0.3, 0.6], [0.5, 0.7], [0.72, 0.35], [0.92, 0.3]].map(([a, b]) => [x + w * a, y + h * b]);
    if (!abstract) {
      // pohon, warung, rumah
      for (let i = 0; i < 14; i++) { const px = x + 40 + (i * 131) % (w - 80), py = y + 40 + (i * 97) % (h - 80); ctx.fillStyle = "#6DBE6D"; ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2); ctx.fill(); }
      for (let i = 0; i < 6; i++) { const px = x + 70 + i * (w - 140) / 5, py = y + h * 0.15 + (i % 2) * h * 0.65; ctx.fillStyle = "#C98A57"; rr(ctx, px - 30, py - 20, 60, 40, 6); ctx.fill(); text(ctx, ["warung", "rumah", "toko", "masjid", "sekolah", "pasar"][i], px, py + 40, 18, { align: "center", weight: 700, color: C.ink2 }); }
      ctx.strokeStyle = "#9AAFA6"; ctx.lineWidth = 26; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.quadraticCurveTo(p[0] - 60, p[1] + 40, p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.setLineDash([16, 14]); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.quadraticCurveTo(p[0] - 60, p[1] + 40, p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = C.kiko; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    }
    const stops = ["Terminal", "Pasar", "Sekolah", "Puskesmas", "Alun-alun"];
    pts.forEach((p, i) => { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p[0], p[1], 16, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.stroke(); text(ctx, stops[i], p[0], p[1] - 30, 24, { align: "center", weight: 800, color: abstract ? C.ink : C.ink2 }); });
  };
  // daftar langkah (kartu bernomor atau tanpa nomor); opt.state[i] = "good" | "bad" | "active"
  P.steps = function (ctx, x, y, items, opt = {}) {
    const w = opt.w || 640, rowH = opt.rowH || 76;
    items.forEach((s, i) => {
      const ry = y + i * rowH, st = (opt.state || [])[i];
      card(ctx, x, ry, w, rowH - 12, { fill: st === "bad" ? C.badBg : st === "good" ? C.goodBg : st === "active" ? "#FFF3D6" : C.panel, stroke: st === "bad" ? C.bad : st === "good" ? C.good : st === "active" ? C.accent : "#D7E2DC", lw: st ? 5 : 2, r: 14 });
      if (opt.numbered !== false) { ctx.fillStyle = st === "bad" ? C.bad : st === "good" ? C.good : C.ink2; ctx.beginPath(); ctx.arc(x + 36, ry + (rowH - 12) / 2, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 36, ry + (rowH - 12) / 2 + 10, 26, { align: "center", color: "#fff", weight: 800 }); }
      text(ctx, s, x + (opt.numbered !== false ? 76 : 24), ry + (rowH - 12) / 2 + 12, opt.size || 32, { weight: 700 });
      if (opt.notes && opt.notes[i]) text(ctx, opt.notes[i], x + w + 20, ry + (rowH - 12) / 2 + 12, 28, { weight: 800, color: st === "bad" ? C.bad : C.good });
    });
  };
  // token pemain (lingkaran berinisial)
  P.PLAYER = { S: ["Sinta", "#D9443B"], D: ["Dito", "#2E7E9A"], R: ["Rama", "#2E9E5B"] };
  P.token = function (ctx, x, y, who, r = 26) { ctx.fillStyle = P.PLAYER[who][1]; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); text(ctx, who, x, y + r * 0.38, r * 1.1, { align: "center", color: "#fff", weight: 900 }); };
  // kartu penampilan: nama + token pemain
  P.show = function (ctx, x, y, w, h, name, players, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.fill || C.panel, stroke: opt.stroke || "#D7E2DC", lw: opt.lw || 3, r: 16 });
    text(ctx, name, x + w / 2, y + 44, 30, { align: "center", weight: 900 });
    players.forEach((p, i) => P.token(ctx, x + w / 2 + (i - (players.length - 1) / 2) * 64, y + h - 46, p, 26));
    if (opt.badge) { ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x + 28, y + 28, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, opt.badge, x + 28, y + 38, 26, { align: "center", color: "#fff", weight: 900 }); }
  };
  P.SHOWS = [["Tari", ["S", "D"]], ["Musik", ["R"]], ["Drama", ["S", "R"]], ["Puisi", ["D"]]];
  K.pentas = P;
})(typeof window !== "undefined" ? window : globalThis);
