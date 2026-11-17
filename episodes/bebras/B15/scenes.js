/* B15 Pembahasan Soal Bebras 2020-US-03 "Kumpulan Binatang" (Amerika Serikat), kategori SiKecil (kelas 1–3 SD).
   Papan tulis: diagram Venn tiga lingkaran (hijau = berkaki banyak, oranye = bergaris-garis, biru = bersayap) di kiri,
   tabel sifat tujuh hewan di kanan. Keanggotaan dihitung dari posisi hewan; K._warn bila jawaban bukan A dan G.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Kumpulan Binatang", tahun: "2020", negara: "Amerika Serikat", kode: "2020-US-03", flag: "US", sumber: "Buku Tantangan Bebras Indonesia 2020", bukaFrasa: "Bebras",
    tingkat: "kelas 1, 2, dan 3 SD (SiKecil)",
    langkah: ["Cari arti setiap lingkaran.", "Lihat lingkaran mana saja yang memuat setiap hewan.", "Cari bagian yang cocok dengan semua syarat."],
    cta: "Hewan mana yang dipilih?", gambarUlang: "Lingkaran dan hewan digambar ulang untuk video ini." };

  // ---------- data soal: lingkaran (relatif ke titik tengah) dan posisi hewan ----------
  const CIR = [{ k: "kaki", dx: -120, dy: -60, col: "#2DB83C", fill: "rgba(110,215,90,0.22)", lab: "berkaki banyak" },
               { k: "garis", dx: 120, dy: -60, col: "#F08A1C", fill: "rgba(240,160,70,0.20)", lab: "bergaris-garis" },
               { k: "sayap", dx: 0, dy: 140, col: "#2E8FD6", fill: "rgba(90,170,230,0.20)", lab: "bersayap" }];
  const RAD = 200;
  const HW = [{ L: "A", n: "kucing", p: [0, -150] }, { L: "B", n: "anjing", p: [-220, -90] }, { L: "C", n: "lalat", p: [-110, 80] }, { L: "D", n: "ular", p: [220, -90] },
              { L: "E", n: "burung putih", p: [110, 80] }, { L: "F", n: "kupu-kupu", p: [0, 0] }, { L: "G", n: "burung cokelat", p: [0, 260] }];
  const inC = (h, c) => Math.hypot(h.p[0] - c.dx, h.p[1] - c.dy) < RAD - 30;
  HW.forEach(h => { h.f = CIR.map(c => inC(h, c)); });   // [kaki, garis, sayap]
  const S1 = [false, false, true], S2 = [true, true, false];
  const cocok = (h, s) => h.f.every((v, i) => v === s[i]);
  const J1 = HW.filter(h => cocok(h, S1)).map(h => h.L).join(""), J2 = HW.filter(h => cocok(h, S2)).map(h => h.L).join("");
  const EXP = { A: "110", B: "100", C: "101", D: "010", E: "011", F: "111", G: "001" };
  if (J1 !== "G" || J2 !== "A" || HW.some(h => h.f.map(Number).join("") !== EXP[h.L]) || HW.some(h => CIR.some(c => Math.abs(Math.hypot(h.p[0] - c.dx, h.p[1] - c.dy) - RAD) < 40))) (K._warn = K._warn || []).push("data salah: " + J1 + J2);

  // ---------- gambar hewan (±s, pusat) ----------
  function animal(ctx, n, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); ctx.lineJoin = "round"; ctx.lineCap = "round";
    const E = (cx, cy, rx, ry, col, rot = 0) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); ctx.fill(); };
    const eye = (cx, cy, r) => { E(cx, cy, r, r, "#1C1C1C"); E(cx + r * 0.3, cy - r * 0.3, r * 0.35, r * 0.35, "#fff"); };
    if (n === "kucing") {
      ctx.fillStyle = "#F2832B"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 34, -14); ctx.lineTo(k * 38, -46); ctx.lineTo(k * 10, -30); ctx.fill(); }
      E(0, 0, 40, 34, "#F2832B"); ctx.strokeStyle = "#B4511A"; ctx.lineWidth = 4; [-10, 0, 10].forEach(d => { ctx.beginPath(); ctx.moveTo(d, -32); ctx.lineTo(d, -18); ctx.stroke(); });
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 40, 0); ctx.lineTo(k * 28, 2); ctx.moveTo(k * 39, 10); ctx.lineTo(k * 28, 8); ctx.stroke(); }
      eye(-14, -4, 5); eye(14, -4, 5); E(0, 10, 5, 3.5, "#7A2E10"); ctx.strokeStyle = "#7A2E10"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(-5, 15, 5, 0, Math.PI * 0.9); ctx.arc(5, 15, 5, Math.PI * 0.1, Math.PI); ctx.stroke();
    } else if (n === "anjing") {
      ctx.fillStyle = "#8A5A3C"; rr(ctx, -34, -34, 68, 64, 16); ctx.fill(); ctx.fillStyle = "#F4EDE4"; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-4, 10); ctx.lineTo(-10, 40); ctx.lineTo(-34, 30); ctx.fill();
      ctx.fillStyle = "#1C1C1C"; ctx.beginPath(); ctx.moveTo(-38, -26); ctx.lineTo(-6, -26); ctx.lineTo(-24, 0); ctx.fill(); E(-36, -4, 6, 5, "#1C1C1C");
      ctx.fillStyle = "#6E4429"; ctx.beginPath(); ctx.moveTo(16, -34); ctx.lineTo(28, -50); ctx.lineTo(34, -28); ctx.fill(); eye(14, -10, 5);
    } else if (n === "lalat") {
      ctx.fillStyle = "rgba(190,225,250,0.95)"; ctx.strokeStyle = "#7FB6DA"; ctx.lineWidth = 2; for (const k of [-0.5, 0.3]) { ctx.beginPath(); ctx.ellipse(6 + k * 16, -30, 12, 28, k, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.strokeStyle = "#2A1E1E"; ctx.lineWidth = 3; [-14, 0, 14].forEach(d => { ctx.beginPath(); ctx.moveTo(d, 6); ctx.lineTo(d - 6, 22); ctx.lineTo(d - 12, 26); ctx.stroke(); });
      E(10, 4, 26, 13, "#4A2E2E"); E(-22, 0, 14, 13, "#2A1E1E"); E(-26, -4, 5, 5, "#C0392B");
    } else if (n === "ular") {
      ctx.strokeStyle = "#6DB33F"; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(-34, 30); ctx.quadraticCurveTo(-40, 6, -10, 8); ctx.quadraticCurveTo(26, 10, 22, -14); ctx.quadraticCurveTo(18, -34, -2, -30); ctx.stroke();
      ctx.strokeStyle = "#2E5A1A"; ctx.lineWidth = 4; [[-30, 18], [-16, 6], [0, 9], [16, 2], [22, -14], [14, -28]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a - 4, b - 7); ctx.lineTo(a + 4, b + 7); ctx.stroke(); });
      E(-12, -30, 18, 13, "#6DB33F"); E(-12, -34, 6, 6, "#F5E663"); E(-12, -34, 1.6, 5, "#1C1C1C");
      ctx.strokeStyle = "#D62828"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-28, -28); ctx.lineTo(-40, -30); ctx.lineTo(-46, -36); ctx.moveTo(-40, -30); ctx.lineTo(-46, -26); ctx.stroke();
    } else if (n === "burung putih" || n === "burung cokelat") {
      const putih = n === "burung putih";
      if (!putih) { ctx.fillStyle = "#8C5A3A"; [[-2, -34], [6, -38], [12, -32]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(a, b); ctx.lineTo(a + 6, b + 4); ctx.fill(); }); }
      E(4, 0, 32, 30, putih ? "#FFFFFF" : "#A0705A"); if (putih) { ctx.strokeStyle = "#BFC7CC"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(4, 0, 32, 30, 0, 0, Math.PI * 2); ctx.stroke(); }
      if (putih) { ctx.fillStyle = "#2B2B2B"; rr(ctx, 12, -10, 28, 10, 4); ctx.fill(); E(-8, -6, 8, 8, "#7FD3E8"); eye(-8, -6, 4); ctx.fillStyle = "#6E6E6E"; ctx.beginPath(); ctx.moveTo(30, -4); ctx.lineTo(46, 4); ctx.lineTo(30, 10); ctx.fill(); }
      else { eye(-4, -8, 4.5); ctx.fillStyle = "#F09A2A"; ctx.beginPath(); ctx.moveTo(-20, -6); ctx.lineTo(-50, 4); ctx.lineTo(-20, 10); ctx.fill(); }
    } else if (n === "kupu-kupu") {
      ctx.fillStyle = "#F5F08A"; ctx.strokeStyle = "#C9B23A"; ctx.lineWidth = 2;
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 24, -12, 24, 20, k * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(k * 20, 18, 18, 15, -k * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        E(k * 28, -14, 7, 7, "#6E6E6E"); E(k * 20, 20, 5, 5, "#6E6E6E"); }
      ctx.fillStyle = "#F08A1C"; rr(ctx, -6, -24, 12, 52, 6); ctx.fill(); ctx.fillStyle = "#2B2B2B"; [-12, -2, 8, 18].forEach(d => ctx.fillRect(-6, d, 12, 4));
      E(0, -28, 7, 7, "#F08A1C"); ctx.strokeStyle = "#2B2B2B"; ctx.lineWidth = 2; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 2, -34); ctx.quadraticCurveTo(k * 8, -46, k * 14, -48); ctx.stroke(); }
    }
    ctx.restore();
  }

  // ---------- diagram Venn ----------
  function venn(ctx, cx, cy, sc, o = {}) {
    CIR.forEach((c, i) => { const em = o.em ? o.em[i] : 1; alpha(ctx, o.cA ? o.cA(i) : 1, () => {
      ctx.fillStyle = c.fill; ctx.beginPath(); ctx.arc(cx + c.dx * sc, cy + c.dy * sc, RAD * sc, 0, Math.PI * 2); ctx.fill(); }); });
    CIR.forEach((c, i) => { const em = o.em ? o.em[i] : 1; alpha(ctx, (o.cA ? o.cA(i) : 1) * (em === 0 ? 0.3 : 1), () => {
      ctx.strokeStyle = c.col; ctx.lineWidth = (em === 2 ? 10 : 5) * sc; ctx.beginPath(); ctx.arc(cx + c.dx * sc, cy + c.dy * sc, RAD * sc, 0, Math.PI * 2); ctx.stroke(); }); });
    if (o.labels) CIR.forEach((c, i) => alpha(ctx, o.labels(i), () => {
      const pos = [[cx - 250 * sc, cy - 275 * sc, "center"], [cx + 250 * sc, cy - 275 * sc, "center"], [cx + 215 * sc, cy + 345 * sc, "left"]][i];
      text(ctx, c.lab, pos[0], pos[1], 34 * sc, { align: pos[2], weight: 900, color: c.col }); }));
    HW.forEach((h, i) => alpha(ctx, (o.hA ? o.hA(i) : 1), () => { const x = cx + h.p[0] * sc, y = cy + h.p[1] * sc;
      animal(ctx, h.n, x, y, 100 * sc); letter(ctx, h.L, x - 50 * sc, y - 40 * sc, 18 * sc, false, o.lc ? o.lc(i) : null); }));
  }
  const VX = 440, VY = 450, VS = 0.95;
  const hpos = (h, cx = VX, cy = VY, sc = VS) => [cx + h.p[0] * sc, cy + h.p[1] * sc];

  // ---------- tabel sifat (kanan) ----------
  const TX = [960, 1180, 1400, 1620], TY0 = 222, TH = 72, MX = 1770;
  function tableHead(ctx) {
    text(ctx, "hewan", TX[0], TY0 - 8, 28, { align: "center", weight: 900, color: INK });
    ["berkaki banyak", "bergaris", "bersayap"].forEach((s, i) => text(ctx, s, TX[i + 1], TY0 - 8, 28, { align: "center", weight: 900, color: CIR[i].col }));
    ctx.strokeStyle = "#D5DCE1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(880, TY0 + 6); ctx.lineTo(1840, TY0 + 6); ctx.stroke();
  }
  function rowY(i) { return TY0 + 46 + i * TH; }
  function tableRow(ctx, i, u, hl) {
    const h = HW[i], y = rowY(i);
    if (hl) { ctx.fillStyle = hl; rr(ctx, 884, y - 34, 952, 66, 12); ctx.fill(); }
    alpha(ctx, u > 0 ? 1 : 0.35, () => { animal(ctx, h.n, TX[0] + 22, y, 52); letter(ctx, h.L, TX[0] - 34, y, 18, false); });
    h.f.forEach((v, j) => { const uu = clamp(u * 3 - j, 0, 1); if (v) tick(ctx, TX[j + 1], y, 40, uu, GREEN); else cross(ctx, TX[j + 1], y, 36, uu, RED, 6); });
  }
  function pattern(ctx, s, lab, a = 1) {
    alpha(ctx, a, () => { const y = rowY(7) + 14; ctx.fillStyle = "#FFF4DE"; rr(ctx, 884, y - 34, 952, 66, 12); ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.stroke();
      text(ctx, lab, TX[0], y + 10, 28, { align: "center", weight: 900, color: ORANGE });
      s.forEach((v, j) => { if (v) tick(ctx, TX[j + 1], y, 40, 1, GREEN); else cross(ctx, TX[j + 1], y, 36, 1, RED, 6); }); });
  }

  function vennScene(ctx, b, l) {
    board(ctx);
    const id = b.id, order = ["soal1", "soal2", "soal3", "soal4", "soal5", "v1", "v2", "v3", "h1", "h2", "j1", "j2", "j3", "j4", "c2"], n = order.indexOf(id);
    const after = k => n > order.indexOf(k), from = k => n >= order.indexOf(k);
    const o = {};
    if (id === "soal1") { o.cA = i => P(l, 0.3 + i * 0.4, 0.5); o.hA = i => P(l, at(b, "tujuh hewan") + i * 0.5, 0.4); }
    o.labels = id === "soal1" ? null : id === "soal2" ? i => P(l, at(b, ["Lingkaran hijau", "Lingkaran oranye", "Lingkaran biru"][i]), 0.5) : () => 1;
    if (id === "v1") o.em = [2, 2, P(l, at(b, "tidak ada di dalam"), 0.5) > 0 ? 0 : 1];
    if (id === "h1") o.em = [P(l, at(b, "hanya ada"), 0.5) > 0 ? 0 : 1, P(l, at(b, "hanya ada"), 0.5) > 0 ? 0 : 1, 2];
    if (id === "j3") o.em = [2, 2, 0];
    const dimL = { j2: "CFE", j4: "BCDEF", c2: "BCDEF" }[id];
    if (dimL || id === "j3") o.hA = i => (dimL && dimL.includes(HW[i].L)) || (id === "j3" && "CEF".includes(HW[i].L)) ? 0.35 : 1;
    if (id === "c2") { alpha(ctx, 1 - P(l, at(b, "misalnya"), 0.6), () => venn(ctx, VX, VY, VS, o)); }
    else venn(ctx, VX, VY, VS, o);
    // sorotan
    if (id === "soal1") HW.forEach((h, i) => { const nm = h.n.split(" ")[0] === "burung" ? h.n : h.n; });
    if (id === "soal3") { ring(ctx, ...hpos(HW[4]), 62, 62, P(l, at(b, "dua lingkaran"), 0.6), C.accent, 6); hand(ctx, "bersayap + bergaris", 1350, 340, 54, { color: C.accentDark, alpha: P(l, at(b, "dua lingkaran"), 0.5) }); hand(ctx, "→ di bagian tumpukan", 1350, 430, 48, { color: C.accentDark, alpha: P(l, at(b, "lingkaran biru"), 0.5) }); }
    // kartu syarat
    const syaratCard = (y, judul, isi, a) => alpha(ctx, a, () => { card(ctx, 900, y, 930, 170, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 }); text(ctx, judul, 940, y + 58, 40, { weight: 900, color: C.accentDark }); text(ctx, isi, 940, y + 122, 36, { weight: 800, color: INK, fit: 860 }); });
    if (id === "soal4" || id === "soal5" || id === "h2") {
      syaratCard(id === "h2" ? 330 : 200, "Hewan 1", "bersayap, TIDAK bergaris, TIDAK berkaki banyak", id === "soal4" ? P(l, at(b, "Hewan pertama"), 0.5) : 1);
      syaratCard(id === "h2" ? 530 : 420, "Hewan 2", "TANPA sayap, bergaris, berkaki banyak", id === "soal5" ? P(l, at(b, "Hewan kedua"), 0.5) : (id === "soal4" ? 0 : 1));
      if (id === "soal5") HW.forEach((h, i) => ring(ctx, hpos(h)[0] - 48, hpos(h)[1] - 38, 28, 28, P(l, at(b, "hewan A sampai") + i * 0.2, 0.4), C.accent, 4));
      if (id === "soal5") hand(ctx, "Hewan mana saja?", 1365, 700, 52, { color: INK, alpha: P(l, at(b, "Pertanyaannya"), 0.5) });
      if (id === "h2") thinkBadge(ctx, 900, 165, 930, 130, l, b.hold + 2, "Lihat lingkaran mana saja yang memuat hewan itu.");
    }
    // tabel
    if (from("v1") && id !== "h2" && id !== "c2") {
      tableHead(ctx);
      HW.forEach((h, i) => {
        let u = 0;
        if (i === 0) u = id === "v1" ? 0 : id === "v2" ? P(l, at(b, "centang, centang"), 1.2) : 1;
        else u = id === "v3" ? P(l, at(b, "semua hewan") + (i - 1) * 0.55, 0.6) : (after("v3") ? 1 : 0);
        let hl = null;
        if ((id === "j1" && i === 6) || (after("j1") && i === 6)) hl = "rgba(46,170,90,0.16)";
        if ((id === "j3" && i === 0) || (after("j3") && i === 0)) hl = id === "j3" ? (P(l, at(b, "Itulah kucing"), 0.4) > 0 ? "rgba(46,170,90,0.16)" : null) : "rgba(46,170,90,0.16)";
        if (id === "j1" && i === 6 && P(l, at(b, "burung cokelat"), 0.4) <= 0) hl = null;
        tableRow(ctx, i, u, hl);
      });
      if (id === "v1") ring(ctx, ...hpos(HW[0]), 58, 58, P(l, at(b, "Contohnya kucing"), 0.6), C.accent, 6);
      if (id === "h1" || id === "j1" || id === "j2") pattern(ctx, S1, "dicari 1", id === "h1" ? P(l, at(b, "harus bersayap"), 0.5) : 1);
      if (id === "j3" || id === "j4") pattern(ctx, S2, "dicari 2", id === "j3" ? P(l, at(b, "harus tanpa sayap"), 0.5) : 1);
      const mk = (i, ok, t) => { const y = rowY(i); if (ok) tick(ctx, MX, y, 46, P(l, t, 0.5), GREEN); else cross(ctx, MX, y, 40, P(l, t, 0.5), RED, 7); };
      if (from("j1")) { mk(6, true, id === "j1" ? at(b, "burung cokelat") : -9); if (id === "j1") ring(ctx, ...hpos(HW[6]), 60, 60, P(l, at(b, "burung cokelat"), 0.6), GREEN, 6); }
      if (from("j2")) { const j2 = id === "j2"; mk(2, false, j2 ? at(b, "Lalat") : -9); mk(5, false, j2 ? at(b, "kupu-kupu") + 0.3 : -9); mk(4, false, j2 ? at(b, "Burung putih") : -9); }
      if (from("j3")) { mk(0, true, id === "j3" ? at(b, "Itulah kucing") : -9); if (id === "j3") ring(ctx, ...hpos(HW[0]), 60, 60, P(l, at(b, "Itulah kucing"), 0.6), GREEN, 6); }
      if (id === "j4") { mk(1, false, at(b, "Anjing")); mk(3, false, at(b, "ular"));
        alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { [0, 6].forEach(i => ring(ctx, ...hpos(HW[i]), 60, 60, 1, GREEN, 6)); const y = rowY(7) + 14; card(ctx, 884, y - 38, 952, 74, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 14 }); text(ctx, "Jawaban: A dan G", 1360, y + 14, 44, { align: "center", weight: 900, color: GREEN }); }); }
    }
    if (id === "c2") {
      hand(ctx, "diagram Venn", 1600, 500, 64, { color: ORANGE, alpha: P(l, 0.3, 0.5) });
      alpha(ctx, P(l, at(b, "misalnya"), 0.6), () => {
        const cx = 960, cy = 520;
        [[-150, "#2E8FD6", "suka sepak bola"], [150, "#E0457B", "suka menggambar"]].forEach(([dx, col, lab]) => { ctx.fillStyle = col + "22"; ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx + dx, cy, 230, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); text(ctx, lab, cx + dx * 1.9, cy - 250, 38, { align: "center", weight: 900, color: col }); });
        const dots = [[-280, -40], [-230, 70], [-300, 120], [0, -40], [0, 60], [270, -20], [240, 100]];
        dots.forEach(([dx, dy], k) => alpha(ctx, P(l, at(b, "teman yang suka sepak") + k * 0.25, 0.4), () => { ctx.fillStyle = "#3A3A3A"; ctx.beginPath(); ctx.arc(cx + dx, cy + dy - 12, 14, 0, Math.PI * 2); ctx.fill(); rr(ctx, cx + dx - 18, cy + dy + 4, 36, 30, 12); ctx.fill(); }));
        hand(ctx, "keduanya", cx, cy + 150, 40, { color: INK, alpha: P(l, at(b, "suka keduanya"), 0.5) });
      });
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function venn_v(ctx, b, l) {
    board(ctx);
    const id = b.id, cx = 960, cy = 405, sc = 1.0, o = {};
    if (id === "h2" || id === "h3") o.hA = i => "AG".includes(HW[i].L) ? 1 : P(l, id === "h3" ? -9 : at(b, "Hewan pertama"), 0.5) > 0 ? 0.35 : 1;
    venn(ctx, cx, cy, sc, o);
    if (id === "h1") thinkBadge(ctx, 1170, 640, 285, 90, l, b.hold + 2, "");
    if (id !== "h3") CIR.forEach((c, i) => alpha(ctx, id === "h0" ? P(l, at(b, ["Lingkaran hijau", "Lingkaran oranye", "Lingkaran biru"][i]), 0.5) : 1, () => text(ctx, c.lab, 960 + (i - 1) * 310, 808, 36, { align: "center", weight: 900, color: c.col })));
    if (id === "h2" || id === "h3") { ring(ctx, ...hpos(HW[6], cx, cy, sc), 52, 52, id === "h3" ? 1 : P(l, at(b, "burung cokelat"), 0.6), GREEN, 6); ring(ctx, ...hpos(HW[0], cx, cy, sc), 52, 52, id === "h3" ? 1 : P(l, at(b, "yaitu kucing"), 0.6), GREEN, 6); }
    if (id === "h3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: A dan G", cx, 812, 52, { align: "center", weight: 900, color: GREEN }));
  }

  Object.assign(K.SCENES, B.umum(META), { venn: vennScene, venn_v });
})(typeof window !== "undefined" ? window : globalThis);
