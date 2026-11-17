/* PNG12 Pembahasan Soal Bebras 2018-TR-06 "Mutasi Makhluk Luar Angkasa" (Turki), kategori Penggalang (SMP).
   Papan tulis: alien dengan kepala (H), badan (B), lengan (A), kaki (L); perintah mutasi dijalankan berurutan di tabel,
   lalu jalan pintas: perintah terakhir untuk setiap bagian. Keadaan akhir dihitung ulang di kode dan dibandingkan
   dengan pilihan A–D; K._warn bila yang cocok bukan hanya C. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Mutasi Makhluk Luar Angkasa", tahun: "2018", negara: "Turki", kode: "2018-TR-06", flag: "TR", sumber: "Buku Tantangan Bebras Indonesia 2018", bukaFrasa: "Bebras",
    tingkat: "kelas 7, 8, dan 9 SMP (Penggalang)",
    langkah: ["Jalankan perintah satu per satu sesuai urutannya.", "Catat keadaan setiap bagian di sebuah tabel.", "Perintah terakhir untuk setiap bagian yang menentukan hasil akhirnya."],
    cta: "Seperti apa alien ini pada akhirnya?", gambarUlang: "Alien digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const KEY = { H: "h", B: "b", A: "a", L: "l" };
  const S0 = { h: "T", b: "T", a: "+", l: "+" };                        // alien awal (seperti gambar contoh di buku)
  const EXR = { h: "S", b: "S", a: "-", l: "-" };                       // hasil contoh H(S), B(S), A(-), L(-)
  const CMDS = [["H", "T"], ["L", "+"], ["B", "T"], ["A", "+"], ["H", "C"], ["A", "-"], ["B", "C"]];
  const run = n => { const s = Object.assign({}, S0); CMDS.slice(0, n).forEach(([p, v]) => s[KEY[p]] = v); return s; };
  const FIN = run(7);
  const OPT = { A: { h: "S", b: "S", a: "-", l: "+" }, B: { h: "T", b: "S", a: "-", l: "-" }, C: { h: "C", b: "C", a: "-", l: "+" }, D: { h: "S", b: "C", a: "+", l: "+" } };
  const same = (x, y) => ["h", "b", "a", "l"].every(k => x[k] === y[k]);
  const cocok = "ABCD".split("").filter(L => same(OPT[L], FIN));
  const LAST = {}; CMDS.forEach(([p], i) => LAST[p] = i);
  if (cocok.join("") !== "C" || LAST.H !== 4 || LAST.B !== 6 || LAST.A !== 5 || LAST.L !== 1) (K._warn = K._warn || []).push("data salah: cocok=" + cocok.join(","));
  const lab = ([p, v]) => p + "(" + (v === "-" ? "−" : v) + ")";
  const WORD = { C: "lingkaran", S: "kotak", T: "segitiga", "+": "panjang", "-": "pendek" };

  // ---------- gambar alien ----------
  const GR = "#3F7D33", GD = "#24451D";
  function shape(ctx, kind, x, y, w, h) {   // bentuk terisi; x, y = tengah
    ctx.beginPath();
    if (kind === "C") ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
    else if (kind === "S") rr(ctx, x - w / 2, y - h / 2, w, h, Math.min(w, h) * 0.16);
    else { ctx.moveTo(x, y - h / 2); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x - w / 2, y + h / 2); ctx.closePath(); }
    ctx.lineJoin = "round"; ctx.fill(); ctx.stroke();
  }
  function alien(ctx, x, y, s, st, o = {}) {
    ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    ctx.fillStyle = GR; ctx.strokeStyle = GD; ctx.lineWidth = Math.max(2, s * 0.02); ctx.lineCap = "round";
    const lw = s * 0.07;
    // kaki
    const L = st.l === "+" ? 0.42 : 0.16;
    for (const k of [-1, 1]) { ctx.strokeStyle = GR; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x + k * 0.1 * s, y + 0.44 * s); ctx.lineTo(x + k * 0.1 * s, y + (0.5 + L) * s); ctx.stroke();
      ctx.fillStyle = GR; ctx.beginPath(); ctx.ellipse(x + k * 0.15 * s, y + (0.52 + L) * s, 0.09 * s, 0.045 * s, 0, 0, Math.PI * 2); ctx.fill(); }
    // lengan
    for (const k of [-1, 1]) { ctx.strokeStyle = GR; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x + k * 0.12 * s, y + 0.18 * s);
      let hx, hy; if (st.a === "+") { ctx.quadraticCurveTo(x + k * 0.4 * s, y + 0.3 * s, x + k * 0.52 * s, y + 0.08 * s); hx = x + k * 0.53 * s; hy = y + 0.05 * s; }
      else { ctx.lineTo(x + k * 0.28 * s, y + 0.22 * s); hx = x + k * 0.3 * s; hy = y + 0.2 * s; }
      ctx.stroke(); ctx.fillStyle = GR; ctx.beginPath(); ctx.arc(hx, hy, 0.06 * s, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = GR; ctx.strokeStyle = GD; ctx.lineWidth = Math.max(2, s * 0.015);
    // badan
    if (st.b === "C") shape(ctx, "C", x, y + 0.25 * s, 0.46 * s, 0.46 * s);
    else if (st.b === "S") shape(ctx, "S", x, y + 0.26 * s, 0.38 * s, 0.5 * s);
    else shape(ctx, "T", x, y + 0.24 * s, 0.56 * s, 0.5 * s);
    // kepala
    if (st.h === "C") shape(ctx, "C", x, y - 0.24 * s, 0.48 * s, 0.48 * s);
    else if (st.h === "S") shape(ctx, "S", x, y - 0.22 * s, 0.58 * s, 0.42 * s);
    else shape(ctx, "T", x, y - 0.3 * s, 0.62 * s, 0.56 * s);
    const ey = st.h === "T" ? y - 0.17 * s : y - 0.26 * s, my = st.h === "T" ? y - 0.07 * s : y - 0.13 * s;
    for (const k of [-1, 1]) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + k * 0.085 * s, ey, 0.055 * s, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#1E1E1E"; ctx.beginPath(); ctx.arc(x + k * 0.085 * s + 0.01 * s, ey + 0.01 * s, 0.026 * s, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(x, my, 0.05 * s, 0.022 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function icon(ctx, kind, x, y, r) { ctx.save(); ctx.fillStyle = GR; ctx.strokeStyle = GD; ctx.lineWidth = 2; shape(ctx, kind, x, y, r * 2, r * 2); ctx.restore(); }
  function chip(ctx, x, y, w, h, s, st) {
    const cur = st === "cur";
    card(ctx, x, y, w, h, { fill: cur ? "#FFE3B0" : "#FFFFFF", stroke: cur ? ORANGE : INK, lw: cur ? 5 : 3, r: 14 });
    text(ctx, s, x + w / 2, y + h / 2 + 15, 42, { align: "center", weight: 900, color: INK });
  }
  const CHX = i => 110 + i * 245;
  function chips(ctx, y, o = {}) { CMDS.forEach((c, i) => alpha(ctx, o.a ? o.a(i) : 1, () => chip(ctx, CHX(i), y, 215, 76, lab(c), o.st ? o.st(i) : ""))); }
  const OX = k => 330 + k * 420;
  function options(ctx, y, s, o = {}) {
    "ABCD".split("").forEach((L, k) => { letter(ctx, L, OX(k), y - 0.62 * s - 34, 26, false); alien(ctx, OX(k), y, s, OPT[L]);
      if (o.mark && o.mark(k) > 0) { if (L === "C") ring(ctx, OX(k), y + 0.18 * s, 0.75 * s, 0.95 * s, o.mark(k), GREEN, 6); else cross(ctx, OX(k), y + 0.15 * s, 0.9 * s, o.mark(k), RED, 9); } });
  }
  function cell(ctx, p, v, x, y, w, h) {   // isi sel tabel
    if (p === "H" || p === "B") { icon(ctx, v, x + 40, y + h / 2, 17); text(ctx, WORD[v], x + 68, y + h / 2 + 11, 30, { weight: 800, color: INK }); }
    else text(ctx, WORD[v], x + w / 2, y + h / 2 + 11, 30, { align: "center", weight: 800, color: INK });
  }

  function alienScene(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "soal1") {
      alien(ctx, 960, 390, 300, S0);
      [["kepala (H)", "kepala", 600, 250, 900, 300], ["lengan (A)", "lengan", 560, 470, 820, 410], ["badan (B)", "badan", 1360, 470, 1020, 470], ["kaki (L)", "kaki", 1340, 690, 1000, 640]].forEach(([s, ph, tx, ty, px, py]) => alpha(ctx, P(l, at(b, ph), 0.4), () => {
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tx + (tx < 960 ? 110 : -110), ty - 12); ctx.lineTo(px, py); ctx.stroke(); text(ctx, s, tx, ty, 46, { align: "center", weight: 900, color: ORANGE }); }));
      return;
    }
    if (id === "soal2") {
      [["H", "kepala", 170, "Perintah H"], ["B", "badan", 460, "Perintah B"]].forEach(([p, nm, y, ph]) => alpha(ctx, P(l, at(b, ph), 0.4), () => {
        card(ctx, 110, y, 1080, 250, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 });
        text(ctx, p + " = mengubah " + nm, 150, y + 62, 44, { weight: 900, color: INK });
        ["C", "S", "T"].forEach((v, k) => alpha(ctx, p === "B" ? 1 : P(l, at(b, "H, " + v), 0.4), () => { const x = 150 + k * 345; icon(ctx, v, x + 45, y + 165, 42); text(ctx, p + "(" + v + ")", x + 105, y + 155, 40, { weight: 900, color: ORANGE }); text(ctx, WORD[v], x + 105, y + 200, 32, { weight: 800, color: C.ink2 }); }));
      }));
      alien(ctx, 1530, 400, 260, S0);
      return;
    }
    if (id === "soal3") {
      [["A", "+", "lengan lebih panjang", "A plus"], ["A", "-", "lengan lebih pendek", "A minus"], ["L", "+", "kaki lebih panjang", "L plus"], ["L", "-", "kaki lebih pendek", "L minus"]].forEach(([p, v, s, ph], k) => alpha(ctx, P(l, at(b, ph), 0.4), () => {
        alien(ctx, OX(k), 340, 210, Object.assign({}, S0, { [KEY[p]]: v }));
        text(ctx, lab([p, v]), OX(k), 640, 52, { align: "center", weight: 900, color: ORANGE }); text(ctx, s, OX(k), 690, 32, { align: "center", weight: 800, color: INK }); }));
      return;
    }
    if (id === "soal4") {
      alien(ctx, 560, 380, 270, S0);
      alpha(ctx, P(l, at(b, "H, S"), 0.5), () => { B.arrow(ctx, 800, 440, 1120, 440, 1, ORANGE, 7); text(ctx, "H(S), B(S), A(−), L(−)", 960, 400, 38, { align: "center", weight: 900, color: ORANGE }); });
      alpha(ctx, P(l, at(b, "mengubah alien"), 0.5), () => alien(ctx, 1360, 380, 270, EXR));
      return;
    }
    if (id === "soal5" || id === "soal6") {
      const ph = ["H, T.", "L plus", "B, T.", "A plus", "H, C.", "A minus", "Dan B, C"];
      chips(ctx, 165, { a: i => id === "soal5" ? P(l, at(b, ph[i]), 0.4) : 1 });
      if (id === "soal5") { alien(ctx, 900, 470, 210, S0); alpha(ctx, P(l, at(b, "bagaimana bentuk"), 0.5), () => text(ctx, "?", 1150, 520, 160, { align: "center", weight: 900, color: ORANGE })); B.arrow(ctx, 160, 300, 1700, 300, P(l, at(b, "secara berurutan"), 1.2), C.ink2, 4); }
      else { options(ctx, 450, 190); thinkBadge(ctx, 560, 670, 800, 84, l, b.hold + 2, "Ikuti perintahnya satu per satu."); }
      return;
    }
    const RB = ["r1", "r2", "r3", "r4", "r5"], ri = RB.indexOf(id);
    if (ri >= 0) {
      const PH = { r2: ["Perintah pertama", "Perintah kedua", "Perintah ketiga"], r3: ["Perintah keempat", "Perintah kelima"], r4: ["Perintah keenam", "Perintah ketujuh"] };
      const first = { r1: 0, r2: 0, r3: 3, r4: 5, r5: 7 }[id];
      const tRow = i => i < first ? -9 : (PH[id] && PH[id][i - first] != null ? at(b, PH[id][i - first]) : 1e9);
      const shown = i => P(l, tRow(i), 0.4), n = CMDS.filter((c, i) => shown(i) > 0.5).length;
      chips(ctx, 165, { st: i => (shown(i) > 0 && (i === CMDS.length - 1 || shown(i + 1) <= 0) && id !== "r5") ? "cur" : "", a: i => id === "r1" ? 1 : (shown(i) > 0 || i >= first ? 1 : 1) });
      // tabel
      const X0 = 110, cw = [180, 225, 225, 220, 220], hy = 268, rh = 56, cols = ["perintah", "kepala", "badan", "lengan", "kaki"], cx = k => X0 + cw.slice(0, k).reduce((a, c) => a + c, 0);
      ctx.fillStyle = "#F3EBDD"; ctx.fillRect(X0, hy, 1070, 50);
      cols.forEach((s, k) => text(ctx, s, cx(k) + cw[k] / 2, hy + 36, 32, { align: "center", weight: 900, color: INK }));
      ctx.strokeStyle = "#C9D0D6"; ctx.lineWidth = 2;
      for (let r = 0; r <= 7; r++) { ctx.beginPath(); ctx.moveTo(X0, hy + 50 + r * rh); ctx.lineTo(X0 + 1070, hy + 50 + r * rh); ctx.stroke(); }
      for (let k = 0; k <= 5; k++) { ctx.beginPath(); ctx.moveTo(cx(k), hy); ctx.lineTo(cx(k), hy + 50 + 7 * rh); ctx.stroke(); }
      CMDS.forEach(([p, v], i) => alpha(ctx, shown(i), () => { const y = hy + 50 + i * rh, k = "HBAL".indexOf(p) + 1;
        text(ctx, (i + 1) + ".  " + lab([p, v]), cx(0) + 20, y + 39, 32, { weight: 900, color: ORANGE });
        cell(ctx, p, v, cx(k), y, cw[k], rh);
        const nx = CMDS.findIndex((c, j) => j > i && c[0] === p);
        if (nx >= 0) { const sa = P(l, tRow(nx) + 0.8, 0.5); if (sa > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx(k) + 14, y + rh / 2); ctx.lineTo(cx(k) + 14 + (cw[k] - 28) * sa, y + rh / 2); ctx.stroke(); } } }));
      const st = run(id === "r5" ? 7 : n);
      alien(ctx, 1520, id === "r5" ? 360 : 420, 230, st);
      if (id === "r5") alpha(ctx, P(l, at(b, "keadaan akhirnya"), 0.5), () => { card(ctx, 1230, 610, 600, 150, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "kepala & badan: lingkaran", 1530, 670, 36, { align: "center", weight: 900, color: GREEN }); text(ctx, "lengan pendek, kaki panjang", 1530, 725, 36, { align: "center", weight: 900, color: GREEN }); });
      return;
    }
    if (id === "j1" || id === "j2") {
      card(ctx, 110, 160, 1700, 90, { fill: "#E9F6EE", stroke: GREEN, lw: 3, r: 16 });
      text(ctx, "Keadaan akhir:  kepala lingkaran · badan lingkaran · lengan pendek · kaki panjang", 960, 220, 38, { align: "center", weight: 900, color: INK, fit: 1640 });
      options(ctx, 450, 190, { mark: k => id === "j2" ? (k === 2 ? P(l, at(b, "Semuanya cocok"), 0.5) : 1) : (k === 0 || k === 3 ? P(l, at(b, "Alien A dan"), 0.5) : k === 1 ? P(l, at(b, "Alien B"), 0.5) : 0) });
      if (id === "j2") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, 1380, 670, 420, 90, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 16 }); text(ctx, "Jawaban: C", 1590, 732, 48, { align: "center", weight: 900, color: GREEN }); });
      return;
    }
    if (id === "k1" || id === "k2") {
      const LX = i => 330 + i * 218, parts = [["H", "kepala"], ["B", "badan"], ["A", "lengan"], ["L", "kaki"]];
      const tF = id === "k1" ? at(b, "menimpa") : -9, tR = id === "k1" ? at(b, "perintah terakhirnya") : -9;
      const tK = { H: "untuk kepala", B: "Untuk badan", A: "Untuk lengan", L: "untuk kaki" };
      parts.forEach(([p, nm], r) => { const y = 180 + r * 120;
        text(ctx, nm, 110, y + 50, 38, { weight: 900, color: INK });
        ctx.strokeStyle = "#DDE2E6"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(300, y + 38); ctx.lineTo(1830, y + 38); ctx.stroke();
        CMDS.forEach((c, i) => { if (c[0] !== p) return; const last = LAST[p] === i;
          alpha(ctx, last ? 1 : 1 - 0.7 * P(l, tF, 0.6), () => chip(ctx, LX(i), y, 190, 76, lab(c), last && (id === "k2" ? P(l, at(b, tK[p]), 0.4) > 0 : P(l, tR, 0.4) > 0) ? "cur" : ""));
          if (!last && P(l, tF, 0.6) > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(LX(i) + 20, y + 38); ctx.lineTo(LX(i) + 20 + 150 * P(l, tF + 0.3, 0.6), y + 38); ctx.stroke(); } });
      });
      CMDS.forEach((c, i) => text(ctx, String(i + 1), LX(i) + 95, 168, 26, { align: "center", weight: 800, color: C.ink2 }));
      if (id === "k2") alpha(ctx, P(l, at(b, "Hasilnya sama"), 0.5), () => hand(ctx, "Hasilnya: alien C", 960, 720, 52, { color: GREEN }));
      return;
    }
    if (id === "c2") {
      const V = [["kepala", ["segitiga", "lingkaran"]], ["badan", ["segitiga", "lingkaran"]], ["lengan", ["panjang", "pendek"]], ["kaki", ["panjang"]]];
      const tG = at(b, "mengganti nilai"), tL = at(b, "terakhir disimpan");
      V.forEach(([nm, vals], k) => { const x = 150 + k * 420;
        text(ctx, nm, x + 180, 270, 44, { align: "center", weight: 900, color: ORANGE });
        card(ctx, x, 295, 360, 240, { fill: "#FFFFFF", stroke: INK, lw: 4, r: 16 });
        if (vals.length === 2) { text(ctx, vals[0], x + 180, 370, 36, { align: "center", weight: 800, color: C.ink2 });
          const sa = P(l, tG, 0.6); if (sa > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 90, 358); ctx.lineTo(x + 90 + 180 * sa, 358); ctx.stroke(); }
          alpha(ctx, P(l, tG + 0.4, 0.5), () => text(ctx, vals[1], x + 180, 470, 48, { align: "center", weight: 900, color: GREEN })); }
        else text(ctx, vals[0], x + 180, 440, 48, { align: "center", weight: 900, color: GREEN });
      });
      alpha(ctx, P(l, 0.3, 0.5), () => hand(ctx, "variabel = tempat menyimpan nilai", 960, 630, 46, { color: INK }));
      alpha(ctx, P(l, tL, 0.5), () => hand(ctx, "nilai terakhir yang dipakai", 960, 710, 46, { color: GREEN }));
      return;
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function alien_v(ctx, b, l) {
    board(ctx);
    const id = b.id, tK = { H: "Untuk kepala", B: "Untuk badan", A: "Untuk lengan", L: "untuk kaki" };
    CMDS.forEach((c, i) => { const x = i < 4 ? 490 + i * 240 : 610 + (i - 4) * 240, y = i < 4 ? 160 : 246, last = LAST[c[0]] === i;
      const fade = id === "h2" || id === "h3" ? (last ? 1 : 0.3) : 1;
      alpha(ctx, fade, () => chip(ctx, x, y, 220, 72, lab(c), (id === "h2" && last && P(l, at(b, tK[c[0]]), 0.4) > 0) || (id === "h3" && last) ? "cur" : "")); });
    "ABCD".split("").forEach((L, k) => { const x = 585 + k * 250; letter(ctx, L, x, 372, 22, false); alien(ctx, x, 480, 150, OPT[L]);
      if (id === "h3") { const u = P(l, at(b, L === "C" ? "Jawabannya" : "Jadi, alien"), 0.5); if (L === "C") ring(ctx, x, 522, 112, 120, u, GREEN, 6); else cross(ctx, x, 500, 130, u, RED, 8); } });
    if (id === "h0") { [["H kepala · B badan · A lengan · L kaki", "H mengubah"], ["C lingkaran · S kotak · T segitiga", "C berarti"], ["+ lebih panjang · − lebih pendek", "Plus berarti"]].forEach(([s, ph], k) => alpha(ctx, P(l, at(b, ph), 0.4), () => text(ctx, s, 960, 690 + k * 50, 32, { align: "center", weight: 900, color: k === 0 ? ORANGE : INK }))); }
    if (id === "h1") thinkBadge(ctx, 610, 700, 700, 76, l, b.hold + 2, "");
    if (id === "h2") alpha(ctx, P(l, at(b, "Untuk kepala"), 0.4), () => { text(ctx, "perintah terakhir yang menentukan", 960, 700, 36, { align: "center", weight: 900, color: ORANGE }); text(ctx, "kepala H(C) · badan B(C) · lengan A(−) · kaki L(+)", 960, 755, 30, { align: "center", weight: 900, color: INK }); });
    if (id === "h3") alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => text(ctx, "Jawaban: C", 960, 760, 56, { align: "center", weight: 900, color: GREEN }));
  }

  Object.assign(K.SCENES, B.umum(META), { alien: alienScene, alien_v });
})(typeof window !== "undefined" ? window : globalThis);
