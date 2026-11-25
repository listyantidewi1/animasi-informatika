/* B13 Pembahasan Soal Bebras 2020-CA-06 "Beruang yang Mana?" (Kanada), kategori SiKecil (kelas 1–3 SD).
   Papan tulis: empat beruang mainan A–D, tabel tiga syarat (bintang di kaki; selendang ATAU pita; TIDAK berkacamata).
   Syarat diperiksa ulang di kode; K._warn bila yang lolos bukan hanya D.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Beruang yang Mana?", tahun: "2020", negara: "Kanada", kode: "2020-CA-06", flag: "CA", sumber: "Buku Tantangan Bebras Indonesia 2020", bukaFrasa: "Bebras",
    tingkat: "kelas 1, 2, dan 3 SD (SiKecil)",
    langkah: ["Tulis semua syaratnya.", "Periksa setiap pilihan, satu syarat demi satu syarat.", "Coret pilihan yang gagal di salah satu syarat."],
    cta: "Beruang mana yang dipilih Rena?", gambarUlang: "Beruang mainan digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const BR = [
    { L: "A", star: -1, scarf: 1, bow: 0, glasses: 1 },
    { L: "B", star: 1, scarf: 0, bow: 0, glasses: 0 },
    { L: "C", star: -1, scarf: 1, bow: 2, glasses: 1 },   // bow 2 = pita di kepala
    { L: "D", star: -1, scarf: 1, bow: 0, glasses: 0 },
  ];
  const SYARAT = [o => !!o.star, o => !!(o.scarf || o.bow), o => !o.glasses];
  const LOLOS = BR.filter(o => SYARAT.every(f => f(o))).map(o => o.L).join("");
  if (LOLOS !== "D" || SYARAT[1](BR[1]) || !SYARAT[1](BR[2]) || SYARAT[2](BR[0]) || SYARAT[2](BR[2])) (K._warn = K._warn || []).push("data salah: lolos=" + LOLOS);

  // ---------- gambar beruang (tinggi ±s, pusat x,y) ----------
  const FUR = "#9C8173", FUR2 = "#E3CDB8", LINE = "#6E5548", SCARF = "#D9473F", BOW = "#7CC242";
  function bowShape(ctx, x, y, w) {
    ctx.fillStyle = BOW; ctx.strokeStyle = "#4E8A22"; ctx.lineWidth = 1.2;
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + k * w, y - w * 0.6); ctx.lineTo(x + k * w, y + w * 0.6); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y, w * 0.28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  function starShape(ctx, x, y, r) {
    ctx.fillStyle = "#FFD43B"; ctx.strokeStyle = "#B88A00"; ctx.lineWidth = 0.8; ctx.beginPath();
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  function bear(ctx, x, y, s, o) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); ctx.strokeStyle = LINE; ctx.lineWidth = 1.6;
    const E = (cx, cy, rx, ry, col, rot = 0, st = true) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); ctx.fill(); if (st) ctx.stroke(); };
    for (const k of [-1, 1]) { E(k * 17, -40, 8.5, 8.5, FUR); E(k * 17, -40, 4.5, 4.5, FUR2, 0, false); }
    for (const k of [-1, 1]) E(k * 20, 12, 6.5, 12, FUR, k * -0.35);
    E(0, 19, 21, 24, FUR); E(0, 21, 13, 16, FUR2, 0, false);
    for (const k of [-1, 1]) { E(k * 13, 40, 9.5, 9.5, FUR); E(k * 13, 41, 6.5, 6.5, FUR2, 0, false); }
    if (o.star) starShape(ctx, o.star * 13, 41, 5.2);
    E(0, -22, 22, 21, FUR); E(0, -14, 9.5, 7, FUR2, 0, false); E(0, -17, 3.6, 2.6, "#3A2A20", 0, false);
    ctx.strokeStyle = "#3A2A20"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -14.5); ctx.lineTo(0, -11); ctx.stroke();
    for (const k of [-1, 1]) E(k * 8, -26, 2.3, 2.6, "#2A1B12", 0, false);
    if (o.glasses) { ctx.strokeStyle = "#333"; ctx.lineWidth = 1.5; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 8, -26, 5.2, 0, Math.PI * 2); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-2.8, -26.5); ctx.lineTo(2.8, -26.5); ctx.stroke(); }
    if (o.scarf) { ctx.fillStyle = SCARF; ctx.strokeStyle = "#9E2A24"; ctx.lineWidth = 1.2; rr(ctx, -18, -4, 36, 8, 4); ctx.fill(); ctx.stroke(); rr(ctx, 5, 1, 7, 17, 2); ctx.fill(); ctx.stroke(); }
    if (o.bow === 1) bowShape(ctx, 0, 0, 10);
    if (o.bow === 2) bowShape(ctx, 7, -44, 9);
    ctx.restore();
  }
  // titik bagian tubuh (untuk lingkaran), relatif ke pusat beruang
  const part = { star: o => [o.star * 13, 41], neck: () => [0, 0], eyes: () => [0, -26] };
  const pt = (x, y, s, p) => [x + p[0] * s / 100, y + p[1] * s / 100];

  // ---------- adegan utama (tabel) ----------
  const X = [215, 455, 695, 935], BY = 330, BS = 270, RY = [590, 680, 770], LX = 1090, RX = 1100, RW = 740;
  const LBL = ["1. ada bintang di kaki", "2. selendang ATAU pita", "3. TIDAK berkacamata"];
  function table(ctx, rows, la) {
    ctx.strokeStyle = "#D5DCE1"; ctx.lineWidth = 2;
    RY.forEach((y, r) => alpha(ctx, rows[r], () => { ctx.beginPath(); ctx.moveTo(95, y - 45); ctx.lineTo(1840, y - 45); ctx.stroke(); text(ctx, LBL[r], LX + 10, y + 14, 40, { weight: 900, color: la && la[r] ? la[r] : INK }); }));
    if (rows[0] > 0) { ctx.beginPath(); ctx.moveTo(95, RY[2] + 45); ctx.lineTo(1840, RY[2] + 45); ctx.stroke(); [335, 575, 815, 1055].forEach(x => { ctx.beginPath(); ctx.moveTo(x, RY[0] - 45); ctx.lineTo(x, RY[2] + 45); ctx.stroke(); }); }
  }
  function mark(ctx, i, r, ok, u) { if (ok) tick(ctx, X[i], RY[r], 58, u, GREEN); else cross(ctx, X[i], RY[r], 56, u, RED, 8); }
  function beruang(ctx, b, l) {
    board(ctx);
    const id = b.id, order = ["soal1", "soal2", "soal3", "soal4", "k1", "k2", "k2b", "k3", "j1", "j2", "j3", "c2"], n = order.indexOf(id);
    const after = k => n > order.indexOf(k);
    // munculnya beruang & redup bila gagal
    const show = i => id === "soal1" ? P(l, at(b, "Rena boleh") + i * 0.35, 0.4) : 1;
    const tB = id === "k2" ? at(b, "dicoret") : (after("k2") ? -9 : 1e9);
    const tA = id === "j1" ? at(b, "beruang A dicoret") : (after("j1") ? -9 : 1e9), tC = id === "j1" ? at(b, "juga dicoret") : (after("j1") ? -9 : 1e9);
    const dimAt = [tA, tB, tC, 1e9];
    BR.forEach((o, i) => alpha(ctx, show(i) * (1 - 0.62 * P(l, dimAt[i], 0.6)), () => { bear(ctx, X[i], BY, BS, o); letter(ctx, o.L, X[i], 505, 26, false); }));
    // baris tabel
    const rows = [
      id === "soal1" ? 0 : id === "soal2" ? P(l, at(b, "Syarat pertama"), 0.5) : 1,
      id === "soal1" || id === "soal2" ? 0 : id === "soal3" ? P(l, at(b, "Syarat kedua"), 0.5) : 1,
      id === "soal1" || id === "soal2" ? 0 : id === "soal3" ? P(l, at(b, "Syarat ketiga"), 0.5) : 1];
    const la = { k1: [ORANGE], k2: [null, ORANGE], k2b: [null, ORANGE], k3: [null, null, ORANGE], j1: [null, null, ORANGE] }[id];
    table(ctx, rows, la);
    if (id === "soal2") BR.forEach((o, i) => ring(ctx, ...pt(X[i], BY, BS, part.star(o)), 26, 26, P(l, at(b, "bintang di kakinya") + i * 0.25, 0.5), ORANGE, 5));
    if (id === "soal3") {
      BR.forEach((o, i) => { if (o.scarf || o.bow) ring(ctx, ...pt(X[i], BY, BS, part.neck()), 60, 30, P(l, at(b, "selendang di lehernya") + i * 0.2, 0.5), ORANGE, 5); });
      ring(ctx, X[2] + 19, BY - 119, 34, 26, P(l, at(b, "memakai pita"), 0.5), ORANGE, 5);
    }
    // isi tabel
    const r1 = id === "k1" ? i => P(l, at(b, "semuanya punya") + i * 0.3, 0.4) : (after("k1") ? () => 1 : () => 0);
    BR.forEach((o, i) => mark(ctx, i, 0, true, r1(i)));
    const k2t = ["Beruang A memakai", "Beruang B tidak", "Beruang C memakai", "Beruang D memakai"];
    BR.forEach((o, i) => { const own = i < 2 ? "k2" : "k2b"; mark(ctx, i, 1, SYARAT[1](o), id === own ? P(l, at(b, k2t[i]) + 0.8, 0.5) : (after(own) ? 1 : 0)); });
    const r3 = [tA - 1.2, null, tC - 1.2, id === "j2" ? at(b, "Hanya beruang D") : (after("j2") ? -9 : 1e9)];
    BR.forEach((o, i) => { if (i !== 1 && (id === "j1" || after("j1"))) mark(ctx, i, 2, SYARAT[2](o), P(l, r3[i], 0.5)); });
    if (id === "j1") [[0, "Beruang A memakai"], [2, "Beruang C juga"]].forEach(([i, ph]) => ring(ctx, ...pt(X[i], BY, BS, part.eyes()), 40, 22, P(l, at(b, ph), 0.5), RED, 5));
    if (id === "k2") cross(ctx, X[1], BY, 200, P(l, tB, 0.6), RED, 10);
    // panel kanan atas (x 1100–1840, y 160–510)
    if (id === "soal1") hand(ctx, "Rena boleh membawa satu beruang", RX + RW / 2, 330, 40, { color: INK, fit: RW - 20, alpha: P(l, at(b, "Rena boleh"), 0.5) });
    if (id === "soal4") { card(ctx, RX, 220, RW, 200, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 }); text(ctx, "Beruang mana yang", RX + RW / 2, 300, 46, { align: "center", weight: 900, color: INK }); text(ctx, "dibawa Rena?", RX + RW / 2, 365, 46, { align: "center", weight: 900, color: INK });
      BR.forEach((o, i) => ring(ctx, X[i], 505, 36, 36, P(l, at(b, "beruang A, B") + i * 0.3, 0.4), C.accent, 5)); }
    if (id === "k1") hand(ctx, "periksa satu per satu", RX + RW / 2, 330, 52, { color: ORANGE, alpha: P(l, 0.2, 0.5) });
    if (id === "k2") hand(ctx, "B: tanpa selendang, tanpa pita", RX + RW / 2, 330, 40, { color: RED, fit: RW - 20, alpha: P(l, at(b, "Beruang B tidak"), 0.5) });
    if (id === "k2b") hand(ctx, "C dan D: ada selendang", RX + RW / 2, 330, 46, { color: GREEN, fit: RW - 20, alpha: P(l, at(b, "Beruang C memakai"), 0.5) });
    if (id === "k3") thinkBadge(ctx, RX, 250, RW, 170, l, b.hold + 2, "Beruang mana yang berkacamata?");
    if (id === "j1") hand(ctx, "A dan C berkacamata", RX + RW / 2, 330, 50, { color: RED, alpha: P(l, at(b, "Beruang A memakai"), 0.5) });
    if (id === "j2" || id === "j3" || id === "c2") rr(ctx, X[3] - 118, 175, 236, RY[2] + 45 - 175, 18), ctx.save(), ctx.strokeStyle = GREEN, ctx.lineWidth = 7, ctx.globalAlpha = id === "j2" ? P(l, at(b, "Hanya beruang D"), 0.6) : 1, ctx.stroke(), ctx.restore();
    if (id === "j2") hand(ctx, "D lolos ketiga syarat", RX + RW / 2, 330, 52, { color: GREEN, alpha: P(l, at(b, "lolos ketiga"), 0.5) });
    if (id === "j3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, RX + 100, 230, RW - 200, 170, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: D", RX + RW / 2, 337, 70, { align: "center", weight: 900, color: GREEN }); });
    if (id === "c2") alpha(ctx, P(l, at(b, "toko online"), 0.5), () => {
      const x = RX + 90, y = 160, w = RW - 180; card(ctx, x, y, w, 340, { fill: "#FFFFFF", stroke: INK, lw: 4, r: 20 });
      ctx.fillStyle = "#2F6FD0"; rr(ctx, x + 4, y + 4, w - 8, 56, 16); ctx.fill(); text(ctx, "Toko Online · Filter", x + 30, y + 44, 30, { weight: 900, color: "#fff" });
      ["ada bintang", "selendang atau pita", "tanpa kacamata"].forEach((s, k) => { const yy = y + 115 + k * 72, u = P(l, at(b, "menyaring") + k * 0.4, 0.4);
        ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(x + 30, yy - 30, 40, 40); tick(ctx, x + 50, yy - 10, 34, u, GREEN); text(ctx, s, x + 92, yy + 2, 34, { weight: 800, color: INK }); });
    });
  }

  // ---------- adegan "atau" ----------
  function atau(ctx, b, l) {
    board(ctx);
    const XS = [330, 750, 1170, 1590], ex = [{ scarf: 1 }, { bow: 1 }, { scarf: 1, bow: 1 }, {}], lab = ["selendang saja", "pita saja", "keduanya", "tidak keduanya"];
    hand(ctx, "selendang ATAU pita", 960, 215, 60, { color: ORANGE });
    const t = b.id === "a1" ? [at(b, "selendang saja"), at(b, "pita saja"), at(b, "keduanya"), 1e9] : [-9, -9, -9, at(b, "tidak memakai selendang")];
    ex.forEach((o, i) => alpha(ctx, b.id === "a1" ? P(l, t[i], 0.5) : (i < 3 ? 1 : P(l, t[3], 0.5)), () => {
      bear(ctx, XS[i], 450, 300, Object.assign({ star: 0 }, o)); text(ctx, lab[i], XS[i], 680, 40, { align: "center", weight: 900, color: INK });
      if (i < 3) tick(ctx, XS[i], 760, 70, b.id === "a1" ? P(l, t[i] + 0.5, 0.5) : 1, GREEN); else cross(ctx, XS[i], 760, 66, P(l, t[3] + 1.2, 0.5), RED, 9);
    }));
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function beruang_v(ctx, b, l) {
    board(ctx);
    const id = b.id, XV = [592, 827, 1062, 1297], TX = 960, BYV = 320, S = 300;
    const tB = id === "h2" ? at(b, "Beruang B tidak") : (id === "h3" ? -9 : 1e9), tAC = id === "h2" ? at(b, "Beruang A dan C") : (id === "h3" ? -9 : 1e9);
    const dim = [tAC, tB, tAC, 1e9];
    BR.forEach((o, i) => alpha(ctx, 1 - 0.6 * P(l, dim[i] + 0.8, 0.5), () => { bear(ctx, XV[i], BYV, S, o); letter(ctx, o.L, XV[i], 500, 26, false); }));
    BR.forEach((o, i) => { if (i < 3) cross(ctx, XV[i], BYV, 150, P(l, dim[i] + 0.4, 0.5), RED, 9); });
    if (id === "h2" || id === "h3") { alpha(ctx, P(l, tB + 0.4, 0.4), () => (text(ctx, "tanpa", XV[1], 555, 28, { align: "center", weight: 900, color: RED }), text(ctx, "selendang/pita", XV[1], 590, 28, { align: "center", weight: 900, color: RED })));
      [0, 2].forEach(i => alpha(ctx, P(l, tAC + 0.4, 0.4), () => text(ctx, "berkacamata", XV[i], 555, 30, { align: "center", weight: 900, color: RED }))); }
    const lines = [["ada bintang di kaki", "bintang di kaki"], ["selendang ATAU pita", "selendang atau pita"], ["TIDAK berkacamata", "tidak memakai kacamata"]];
    if (id === "h0") lines.forEach(([s, ph], k) => alpha(ctx, id === "h0" ? P(l, at(b, ph), 0.4) : 1, () => text(ctx, (k + 1) + ". " + s, TX, 620 + k * 66, 46, { align: "center", weight: 900, color: INK })));
    if (id === "h1") thinkBadge(ctx, 610, 620, 700, 130, l, b.hold + 2, "Beruang mana yang lolos?");
    if (id === "h3") { ring(ctx, XV[3], BYV + 30, 112, 200, P(l, at(b, "Hanya beruang D"), 0.6), GREEN, 7); alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: D", TX, 720, 80, { align: "center", weight: 900, color: GREEN })); }
  }

  Object.assign(K.SCENES, B.umum(META), { beruang, atau, beruang_v });
})(typeof window !== "undefined" ? window : globalThis);
