/* ON10 Mondar-Mandir (OSN-K 2026 SMA no. 32–34): MONDAR membalik bit, MANDIR rekursif = barisan Thue-Morse.
   Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, panel, label, chip, arrow, clamp, ap, at } = H;
  const { fadeIn, heading } = U;
  const MONO = Kiko.FONTS.MONO;

  // ---------- kode C++ ----------
  const MONDAR = ["string MONDAR(string P) {", "    string C;", "    for (int i = 0; i < P.length(); i++) {", "        if (P[i] == '0') {", "            C += '1';",
    "        } else {", "            C += '0';", "        }", "    }", "    return C;", "}"];
  const MANDIR = ["string MANDIR(int n) {", "    if (n == 0) {", "        return \"0\";", "    }", "    return MANDIR(n - 1) + MONDAR(MANDIR(n - 1));", "}"];
  const KW = /^(int|if|else|return|for|string)$/, FN = /^(MONDAR|MANDIR)$/;
  function codeLine(ctx, s, x, y, size) {
    ctx.font = `600 ${size}px ${MONO}`; const cw = ctx.measureText("M").width;
    const toks = s.match(/'[^']*'|"[^"]*"|[A-Za-z_]+|\d+|\s+|[^\sA-Za-z_\d]/g) || []; let cx = x;
    toks.forEach(t => {
      const col = KW.test(t) ? C.green : FN.test(t) ? C.red : /^\d+$|^'|^"/.test(t) ? C.purple : C.ink;
      text(ctx, t, cx, y, size, { mono: true, weight: KW.test(t) || FN.test(t) ? 800 : 600, color: col }); cx += cw * t.length;
    });
  }
  function codeBlock(ctx, lines, x, y, w, size, o = {}) {
    const lh = size * 1.45, h = lines.length * lh + 44;
    panel(ctx, x, y, w, h, { fill: "#FFFDF7", stroke: o.stroke || C.line, lw: o.lw || 2, alpha: o.alpha });
    lines.forEach((s, i) => {
      const u = o.hl ? o.hl(i) : 0, yy = y + 22 + i * lh;
      if (u > 0) { ctx.save(); ctx.globalAlpha *= u; ctx.fillStyle = "rgba(232,197,90,0.35)"; ctx.fillRect(x + 8, yy, w - 16, lh); ctx.fillStyle = C.goldRim; ctx.fillRect(x + 8, yy, 5, lh); ctx.restore(); }
      ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha) * (o.hl && o.dim !== undefined && u <= 0 ? o.dim : 1);
      codeLine(ctx, s, x + 28, yy + lh * 0.74, size); ctx.restore();
    });
    return { h };
  }
  /* deret bit: x,y kiri atas, d = lebar sel; o.col(i), o.fill(i), o.alpha(i) */
  function bits(ctx, s, x, y, d, o = {}) {
    [...s].forEach((c, i) => {
      const a = o.alpha ? o.alpha(i) : 1; if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; const xx = x + i * d, w = d - (o.gap === undefined ? 8 : o.gap), h = o.h || d * 1.15;
      rr(ctx, xx, y, w, h, Math.min(10, w / 4)); ctx.fillStyle = o.fill ? o.fill(i) : c === "1" ? "#FFF6DA" : C.panel; ctx.fill();
      ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.stroke ? o.stroke(i) : c === "1" ? C.goldRim : C.line; ctx.stroke();
      text(ctx, c, xx + w / 2, y + h * 0.72, Math.min(w, h) * 0.62, { mono: true, weight: 800, align: "center", color: o.col ? o.col(i) : c === "1" ? C.ink : C.mut });
      ctx.restore();
    });
    return s.length * d;
  }
  const flip = s => [...s].map(c => c === "0" ? "1" : "0").join("");
  const TM = n => { let s = "0"; for (let i = 0; i < n; i++) s += flip(s); return s; };
  const pop = n => n.toString(2).split("").filter(c => c === "1").length;
  const half = (len, front, back) => i => i < len / 2 ? front : back;
  const GREEN_BG = "#E3F0E6", RED_BG = "#F9E3DF";

  Kiko.ON10 = { bits, TM, codeBlock, MANDIR, MONDAR };
  Object.assign(Kiko.SCENES, {
    kode(ctx, b, l) {
      if (b.fokus === "mondar") {
        const tN = at(b, "MONDAR"), tM = at(b, "menerima"), tB = at(b, "membalik"), t1 = at(b, "nol", 2), t0 = at(b, "satu", 3);
        codeBlock(ctx, MONDAR, 90, 110, 900, 27, { dim: 0.4, hl: i => l < tM - 0.2 ? (ap(l, tN - 0.2) * (i === 0 ? 1 : 0)) : l < t1 - 0.2 ? (i === 0 || (i >= 2 && i <= 8) ? 1 : 0) : l < t0 - 0.2 ? (i === 3 || i === 4 ? 1 : 0) : (i === 5 || i === 6 ? 1 : 0) });
        const X = 1080;
        fadeIn(ctx, ap(l, tN - 0.2), () => { label(ctx, "// MONDAR(P)", X, 170); text(ctx, "membalik setiap karakter", X, 225, 38, { weight: 800 }); });
        fadeIn(ctx, ap(l, tB - 0.2), () => {
          text(ctx, "P", X, 320, 34, { mono: true, weight: 800, color: C.mut }); bits(ctx, "0110", X + 60, 280, 90);
          text(ctx, "C", X, 470, 34, { mono: true, weight: 800, color: C.mut });
          bits(ctx, "1001", X + 60, 430, 90, { alpha: i => ap(l, tB + 0.2 + i * 0.25), fill: () => RED_BG, stroke: () => C.red, col: () => C.red });
          for (let i = 0; i < 4; i++) arrow(ctx, X + 101 + i * 90, 392, X + 101 + i * 90, 424, { u: ap(l, tB + 0.1 + i * 0.25), color: C.red, lw: 4, head: 14 });
        });
        fadeIn(ctx, ap(l, t1 - 0.2), () => { panel(ctx, X, 580, 700, 110, { stroke: C.purple, lw: 3 }); text(ctx, "'0' → '1'    '1' → '0'", X + 350, 650, 44, { mono: true, weight: 800, align: "center", color: C.purple }); });
        return;
      }
      // mandir
      const tN = at(b, "MANDIR"), tZ = at(b, "nol"), tP = at(b, "memanggil"), tS = at(b, "menyambung");
      codeBlock(ctx, MANDIR, 90, 110, 1000, 28, { dim: 0.4, hl: i => l < tZ - 0.3 ? (i === 0 ? ap(l, tN - 0.2) : 0) : l < tP - 0.3 ? (i >= 1 && i <= 3 ? 1 : 0) : (i === 4 ? 1 : 0) });
      const X = 1160;
      fadeIn(ctx, ap(l, tZ - 0.2), () => { panel(ctx, X, 130, 660, 120, { stroke: C.green, lw: 3 }); text(ctx, "n == 0  →  \"0\"", X + 330, 205, 44, { mono: true, weight: 800, align: "center", color: C.green }); });
      const y0 = 470;
      fadeIn(ctx, ap(l, tP - 0.2), () => {
        rr(ctx, 160, y0, 640, 120, 14); ctx.fillStyle = GREEN_BG; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.green; ctx.stroke();
        text(ctx, "MANDIR(n − 1)", 480, y0 + 75, 40, { mono: true, weight: 800, align: "center", color: C.green });
        text(ctx, "bagian depan", 480, y0 + 165, 30, { weight: 800, align: "center", color: C.mut });
      });
      fadeIn(ctx, ap(l, tS - 0.2), () => {
        text(ctx, "+", 860, y0 + 80, 64, { mono: true, weight: 800, align: "center" });
        rr(ctx, 920, y0, 640, 120, 14); ctx.fillStyle = RED_BG; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.stroke();
        text(ctx, "MONDAR(MANDIR(n − 1))", 1240, y0 + 75, 36, { mono: true, weight: 800, align: "center", color: C.red, fit: 600 });
        text(ctx, "bagian belakang = kebalikan", 1240, y0 + 165, 30, { weight: 800, align: "center", color: C.mut });
      });
    },

    tm(ctx, b, l) {
      const m = b.mode;
      if (m === "kait") {
        const tS = at(b, "salin"), tB = at(b, "balik"), tT = at(b, "tempelkan"), rowsT = [at(b, "nol", 1), at(b, "nol", 3), at(b, "nol", 5), at(b, "nol", 7)];
        const rows = ["0", "01", "0110", "01101001"];
        rows.forEach((s, r) => fadeIn(ctx, ap(l, rowsT[r] - 0.3), () => {
          const y = 150 + r * 150; text(ctx, "langkah " + r, 110, y + 62, 30, { mono: true, weight: 800, color: C.mut });
          bits(ctx, s, 380, y, 96, { fill: i => r > 0 && i >= s.length / 2 ? RED_BG : GREEN_BG, stroke: i => r > 0 && i >= s.length / 2 ? C.red : C.green, col: i => r > 0 && i >= s.length / 2 ? C.red : C.green });
        }));
        [["salin", tS, C.green], ["balik", tB, C.purple], ["tempel di belakang", tT, C.red]].forEach(([s, t0, c], i) => fadeIn(ctx, ap(l, t0 - 0.2), () => chip(ctx, (i + 1) + ". " + s, 1260, 170 + i * 90, { size: 36, color: C.white, fill: c, stroke: c })));
        return;
      }
      if (m === "besar") {
        const tD = at(b, "ribu"), tA = at(b, "atom"), tK = at(b, "karakter");
        fadeIn(ctx, ap(l, tD - 0.4), () => { text(ctx, "2026 langkah", 960, 230, 96, { disp: true, weight: 800, align: "center" }); text(ctx, "panjang = 2²⁰²⁶ karakter ≈ 10⁶⁰⁹", 960, 320, 48, { mono: true, weight: 800, align: "center", color: C.mut }); });
        fadeIn(ctx, ap(l, tA - 0.3), () => text(ctx, "atom di alam semesta ≈ 10⁸⁰", 960, 410, 44, { mono: true, weight: 700, align: "center", color: C.mut }));
        fadeIn(ctx, ap(l, tK - 0.3), () => { panel(ctx, 460, 480, 1000, 150, { stroke: C.red, lw: 5 }); text(ctx, "karakter ke-2025 = ?", 960, 578, 66, { mono: true, weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "tabel") {
        const ts = [0.1, at(b, "MANDIR", 1), at(b, "MANDIR", 2), at(b, "MANDIR", 3)], tP = at(b, "panjangnya");
        ["0", "01", "0110", "01101001"].forEach((s, r) => fadeIn(ctx, ap(l, ts[r] - 0.3), () => {
          const y = 140 + r * 150; text(ctx, "MANDIR(" + r + ")", 110, y + 62, 38, { mono: true, weight: 800, color: C.red });
          bits(ctx, s, 470, y, 96, { fill: i => r > 0 && i >= s.length / 2 ? RED_BG : GREEN_BG, stroke: i => r > 0 && i >= s.length / 2 ? C.red : C.green, col: i => r > 0 && i >= s.length / 2 ? C.red : C.green });
          fadeIn(ctx, ap(l, tP - 0.2 + r * 0.2), () => text(ctx, "panjang " + s.length, 1810, y + 62, 34, { mono: true, weight: 800, align: "right", color: C.goldInk }));
        }));
        return;
      }
      if (m === "tanya") {
        const ts = [at(b, "pertama"), at(b, "kedua"), at(b, "ketiga")];
        [["32", "MANDIR(12)", "banyak '1'?"], ["33", "MANDIR(2026)", "posisi 2025–2027?"], ["34", "MANDIR(12)", "banyak \"00\"?"]].forEach(([n, f, q], i) => fadeIn(ctx, ap(l, ts[i] - 0.3), () => {
          const x = 220 + i * 520; panel(ctx, x, 200, 460, 400, { stroke: C.green, lw: 3 });
          text(ctx, "SOAL " + n, x + 230, 260, 28, { mono: true, weight: 800, align: "center", color: C.green });
          text(ctx, f, x + 230, 390, 52, { mono: true, weight: 800, align: "center", color: C.red, fit: 420 });
          text(ctx, q, x + 230, 520, 42, { mono: true, weight: 800, align: "center", fit: 420 });
        }));
        return;
      }
      if (m === "soal") {
        const P2 = { 32: ["MANDIR(12)", "Berapa banyak karakter '1'?"], 33: ["S = MANDIR(2026)", "Karakter ke-2025 sampai ke-2027?"], 34: ["MANDIR(12)", "Berapa banyak substring \"00\"?"] }[b.soal];
        const tN = at(b, "MANDIR"), tQ = at(b, b.soal === 32 ? "Ada" : b.soal === 33 ? "karakter" : "Ada");
        fadeIn(ctx, ap(l, tN - 0.4), () => { panel(ctx, 260, 140, 1400, 200, { stroke: C.green, lw: 3 }); text(ctx, P2[0], 960, 270, 88, { mono: true, weight: 800, align: "center", color: C.red }); });
        fadeIn(ctx, ap(l, tQ - 0.3), () => { panel(ctx, 260, 380, 1400, 140, { stroke: C.red, lw: 3 }); text(ctx, P2[1], 960, 470, 52, { mono: true, weight: 800, align: "center", fit: 1320 }); });
        if (b.soal === 33) fadeIn(ctx, ap(l, at(b, "Posisi") - 0.3), () => text(ctx, "posisi dihitung mulai dari 1", 960, 600, 40, { weight: 800, align: "center", color: C.mut }));
        if (b.soal === 34) {
          const tC = at(b, "contoh"), ex = "000110010", x0 = 960 - ex.length * 70 / 2;
          fadeIn(ctx, ap(l, tC - 0.3), () => {
            bits(ctx, ex, x0, 560, 70, { h: 72 });
            [[0, 1], [1, 2], [5, 6]].forEach(([a], k) => { const u = ap(l, tC + 0.3 + k * 0.4); if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; ctx.strokeStyle = [C.red, C.purple, C.green][k]; ctx.lineWidth = 5;
              const xa = x0 + a * 70 + 4, xb = x0 + (a + 2) * 70 - 12, yy = 650 + (k === 1 ? 26 : 0); ctx.beginPath(); ctx.moveTo(xa, yy - 10); ctx.lineTo(xa, yy); ctx.lineTo(xb, yy); ctx.lineTo(xb, yy - 10); ctx.stroke(); ctx.restore(); });
            fadeIn(ctx, ap(l, tC + 1.4), () => text(ctx, "= 3", x0 + ex.length * 70 + 30, 615, 48, { mono: true, weight: 800, color: C.red }));
          });
        }
        return;
      }
      if (m === "panjang") {
        const tS = at(b, "setiap"), tJ = at(b, "Jadi");
        const vals = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
        vals.forEach((v, n) => fadeIn(ctx, ap(l, (n === 0 ? at(b, "nol") : tS) - 0.3 + (n === 0 ? 0 : n * 0.18)), () => {
          const x = 120 + (n % 7) * 250, y = n < 7 ? 200 : 400;
          panel(ctx, x, y, 220, 140, { stroke: n === 12 ? C.red : C.line, lw: n === 12 ? 5 : 2, fill: n === 12 ? RED_BG : C.panel });
          text(ctx, "n = " + n, x + 110, y + 45, 28, { mono: true, weight: 700, align: "center", color: C.mut });
          text(ctx, String(v), x + 110, y + 110, 52, { mono: true, weight: 800, align: "center", color: n === 12 ? C.red : C.ink });
        }));
        fadeIn(ctx, ap(l, tJ - 0.2), () => text(ctx, "panjang MANDIR(12) = 2¹² = 4096", 960, 650, 56, { mono: true, weight: 800, align: "center", color: C.red }));
        return;
      }
      if (m === "separuh" || m === "jawab32") {
        const s = TM(4), tB = m === "separuh" ? at(b, "Setiap") : 0, tJ = m === "separuh" ? at(b, "Jadi") : 0;
        bits(ctx, s, 160, 200, 100, { fill: half(16, GREEN_BG, RED_BG), stroke: half(16, C.green, C.red), col: half(16, C.green, C.red) });
        text(ctx, "depan", 560, 180, 34, { weight: 800, align: "center", color: C.green }); text(ctx, "belakang = kebalikan", 1360, 180, 34, { weight: 800, align: "center", color: C.red });
        if (m === "separuh") {
          for (let i = 0; i < 8; i++) { const u = ap(l, tB - 0.2 + i * 0.25); if (u <= 0) continue; ctx.save(); ctx.globalAlpha *= u; ctx.strokeStyle = C.purple; ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
            const xa = 160 + i * 100 + 46, xb = 160 + (i + 8) * 100 + 46; ctx.beginPath(); ctx.moveTo(xa, 325); ctx.quadraticCurveTo((xa + xb) / 2, 410 + i * 12, xb, 325); ctx.stroke(); ctx.restore(); }
          fadeIn(ctx, ap(l, tJ - 0.2), () => { panel(ctx, 260, 520, 1400, 170, { stroke: C.green, lw: 4 }); text(ctx, "'1' di belakang = '0' di depan", 960, 590, 44, { mono: true, weight: 800, align: "center", color: C.purple });
            text(ctx, "total '1' = panjang depan = ½ panjang", 960, 660, 44, { mono: true, weight: 800, align: "center", color: C.green }); });
        } else {
          const tS = at(b, "Setengah"), tJ2 = at(b, "Jawaban");
          fadeIn(ctx, ap(l, tS - 0.3), () => text(ctx, "4096 ÷ 2 = 2048", 960, 520, 96, { mono: true, weight: 800, align: "center" }));
          fadeIn(ctx, ap(l, tJ2 - 0.2), () => chip(ctx, "JAWABAN: 2048", 960, 600, { size: 52, color: C.white, fill: C.red, stroke: C.red, center: true }));
        }
        return;
      }
      if (m === "awalan") {
        const tD = at(b, "depannya"), tS = at(b, "sebelas"), tA = at(b, "ada", 1);
        const X0 = 160, W = 1600, lvl = [[2026, W, "MANDIR(2026)"], [12, W * 0.5, "MANDIR(12)"], [11, W * 0.25, "MANDIR(11) · 2048"]];
        lvl.forEach(([n, w, s], k) => fadeIn(ctx, ap(l, (k === 0 ? 0.1 : k === 1 ? tD : tS) - 0.3), () => {
          const y = 170 + k * 150; rr(ctx, X0, y, k === 0 ? W : w, 90, 12); ctx.fillStyle = k === 2 ? GREEN_BG : C.panel; ctx.fill(); ctx.lineWidth = k === 2 ? 5 : 3; ctx.strokeStyle = k === 2 ? C.green : C.line; ctx.stroke();
          if (k === 0) { ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = C.mut; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0 + W, y + 45); ctx.lineTo(X0 + W + 60, y + 45); ctx.stroke(); ctx.restore(); }
          text(ctx, s, X0 + 24, y + 60, 36, { mono: true, weight: 800, color: k === 2 ? C.green : C.ink });
          if (k === 0) text(ctx, "awalnya sama", X0 + W - 20, y + 60, 30, { weight: 800, align: "right", color: C.mut });
        }));
        fadeIn(ctx, ap(l, tA - 0.3), () => { const x = X0 + W * 0.25 * 2025 / 2048; ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, 150); ctx.lineTo(x, 640); ctx.stroke(); ctx.restore();
          chip(ctx, "posisi 2025–2027", x, 660, { size: 34, color: C.white, fill: C.red, stroke: C.red, center: true }); });
        return;
      }
      if (m === "lacak") {
        const tK = at(b, "kebalikan"), tU = at(b, "ulangi");
        const steps = [[2025, 1024], [1001, 512], [489, 256], [233, 128], [105, 64], [41, 32], [9, 8]];
        fadeIn(ctx, ap(l, 0.2), () => { text(ctx, "posisi 2025 di MANDIR(11) (panjang 2048)", 960, 150, 38, { mono: true, weight: 800, align: "center", fit: 1700 }); });
        steps.forEach(([p, h2], k) => {
          const u = ap(l, (k === 0 ? tK - 0.2 : tU - 1.6 + k * 0.45)); if (u <= 0) return;
          fadeIn(ctx, u, () => { const col = k < 4 ? 0 : 1, row = k % 4, x = 200 + col * 820, y = 240 + row * 95;
            text(ctx, `${p} − ${h2} = ${p - h2}`, x, y, 44, { mono: true, weight: 800 });
            chip(ctx, "balik " + (k + 1), x + 560, y - 40, { size: 26, color: C.white, fill: C.purple, stroke: C.purple }); });
        });
        fadeIn(ctx, ap(l, tU + 0.6), () => { panel(ctx, 1020, 520, 760, 170, { stroke: C.red, lw: 4 }); text(ctx, "posisi 1 = '0'", 1400, 590, 44, { mono: true, weight: 800, align: "center" });
          text(ctx, "dibalik 7 kali → '1'", 1400, 655, 44, { mono: true, weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "biner" || m === "biner3") {
        if (m === "biner") {
          const tH = at(b, "hilang"), tT = at(b, "Tulis"), tG = at(b, "ganjil"), tE = at(b, "genap");
          fadeIn(ctx, ap(l, 0.2), () => text(ctx, "2025 − 1 = 2024 =", 160, 200, 50, { mono: true, weight: 800 }));
          const s = (2024).toString(2);
          bits(ctx, s, 760, 140, 90, { alpha: () => ap(l, 0.4), fill: i => s[i] === "1" && l > tH - 0.3 + i * 0.25 ? "#F3E6F6" : C.panel, stroke: i => s[i] === "1" && l > tH - 0.3 + i * 0.25 ? C.purple : C.line, col: i => s[i] === "1" ? C.purple : C.mut });
          fadeIn(ctx, ap(l, tH), () => text(ctx, "setiap angka 1 = satu kali dibalik", 1255, 300, 34, { weight: 800, align: "center", color: C.purple }));
          fadeIn(ctx, ap(l, tT - 0.2), () => { panel(ctx, 260, 380, 1400, 290, { stroke: C.green, lw: 4 }); text(ctx, "posisi k → biner(k − 1) → hitung angka 1", 960, 460, 44, { mono: true, weight: 800, align: "center", fit: 1320 }); });
          fadeIn(ctx, ap(l, tG - 0.2), () => text(ctx, "ganjil → '1'", 660, 590, 56, { mono: true, weight: 800, align: "center", color: C.red }));
          fadeIn(ctx, ap(l, tE - 0.2), () => text(ctx, "genap → '0'", 1260, 590, 56, { mono: true, weight: 800, align: "center", color: C.green }));
          return;
        }
        const rows = [[2025, 2024], [2026, 2025], [2027, 2026]], ts = [at(b, "tujuh"), at(b, "lima"), at(b, "enam")], tJ = at(b, "Jawaban");
        rows.forEach(([p, q], k) => fadeIn(ctx, ap(l, (k === 0 ? 0.2 : ts[1] - 0.6 + (k - 1) * 0.6)), () => {
          const y = 140 + k * 150, s = q.toString(2), c = pop(q);
          text(ctx, "posisi " + p, 110, y + 65, 36, { mono: true, weight: 800, color: C.mut });
          bits(ctx, s, 520, y, 76, { col: i => s[i] === "1" ? C.purple : C.mut });
          text(ctx, c + " → '" + (c % 2) + "'", 1400, y + 65, 46, { mono: true, weight: 800, color: c % 2 ? C.red : C.green });
        }));
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: 100", 960, 610, { size: 56, color: C.white, fill: C.red, stroke: C.red, center: true }));
        void ts[0]; return;
      }
      if (m === "sambung" || m === "tengah") {
        const s = TM(3), t = flip(s), d = 96, x0 = 960 - 16 * d / 2, y = 200;
        bits(ctx, s, x0, y, d, { fill: () => GREEN_BG, stroke: () => C.green, col: () => C.green });
        bits(ctx, t, x0 + 8 * d, y, d, { alpha: () => ap(l, 0.3), fill: () => RED_BG, stroke: () => C.red, col: () => C.red });
        text(ctx, "MANDIR(3)", x0 + 4 * d, y - 30, 32, { mono: true, weight: 800, align: "center", color: C.green }); text(ctx, "kebalikannya", x0 + 12 * d, y - 30, 32, { weight: 800, align: "center", color: C.red });
        const br = (a, col, u, lab, dy = 0) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; ctx.strokeStyle = col; ctx.lineWidth = 6; const xa = x0 + a * d + 6, xb = x0 + (a + 2) * d - 14, yy = y + 140 + dy;
          ctx.beginPath(); ctx.moveTo(xa, yy - 14); ctx.lineTo(xa, yy); ctx.lineTo(xb, yy); ctx.lineTo(xb, yy - 14); ctx.stroke(); text(ctx, lab, (xa + xb) / 2, yy + 44, 30, { mono: true, weight: 800, align: "center", color: col }); ctx.restore(); };
        if (m === "sambung") {
          const tD = at(b, "depan"), tB = at(b, "belakang", 1), tS = at(b, "satu", 1);
          br(5, C.green, ap(l, tD - 0.2), "00 tetap");
          br(1, C.purple, ap(l, tB - 0.2), "11");
          br(9, C.red, ap(l, tS + 0.4), "→ 00");
          fadeIn(ctx, ap(l, tS + 0.8), () => { panel(ctx, 260, 480, 1400, 200, { stroke: C.ink, lw: 3 }); text(ctx, "00 di MANDIR(4) = 00 di depan + 11 di depan", 960, 560, 44, { mono: true, weight: 800, align: "center", fit: 1320 });
            text(ctx, "1 + 1 = 2", 960, 635, 44, { mono: true, weight: 800, align: "center", color: C.green }); });
        } else {
          const tB = at(b, "dimulai"), tN = at(b, "tidak");
          const u = ap(l, tB - 0.3);
          if (u > 0) { ctx.save(); ctx.globalAlpha *= u; ctx.strokeStyle = C.goldRim; ctx.lineWidth = 7; rr(ctx, x0 + 7 * d - 6, y - 8, 2 * d + 4, d * 1.15 + 16, 14); ctx.stroke(); ctx.restore(); }
          fadeIn(ctx, ap(l, tB - 0.1), () => text(ctx, "belakang selalu mulai dengan '1'", 960, 420, 44, { weight: 800, align: "center", color: C.red }));
          fadeIn(ctx, ap(l, tB + 1.0), () => text(ctx, "karena MANDIR selalu mulai dengan '0'", 960, 480, 36, { weight: 700, align: "center", color: C.mut }));
          fadeIn(ctx, ap(l, tN - 0.2), () => { panel(ctx, 460, 540, 1000, 130, { stroke: C.green, lw: 4 }); text(ctx, "sambungan: ?1 → tidak pernah 00", 960, 622, 46, { mono: true, weight: 800, align: "center", color: C.green }); });
        }
        return;
      }
      if (m === "rumus") {
        const tA = at(b, "Artinya"), tK = at(b, "kembar"), tD = at(b, "dua"), tT = at(b, "ditambah", 2);
        fadeIn(ctx, ap(l, tA - 0.2), () => { panel(ctx, 200, 160, 1520, 170, { stroke: C.red, lw: 4 }); text(ctx, "00 di MANDIR(n + 1)  =  kembar di MANDIR(n)", 960, 265, 50, { mono: true, weight: 800, align: "center", color: C.red, fit: 1440 }); });
        fadeIn(ctx, ap(l, tK + 0.6), () => text(ctx, "kembar = banyak 00 + banyak 11", 960, 400, 42, { mono: true, weight: 800, align: "center", color: C.purple }));
        fadeIn(ctx, ap(l, tD - 0.2), () => { panel(ctx, 200, 460, 1520, 170, { stroke: C.green, lw: 4 }); text(ctx, "kembar(n + 1)  =  2 × kembar(n)  +  ?", 960, 560, 50, { mono: true, weight: 800, align: "center", color: C.green, fit: 1440 }); });
        fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "+1 kalau sambungannya \"11\"", 960, 690, 38, { mono: true, weight: 800, align: "center", color: C.mut }));
        return;
      }
      if (m === "tabel34") {
        const K = [null, 0, 1, 2, 5, 10, 21, 42, 85, 170, 341, 682];
        const ts = [at(b, "satu"), at(b, "dua", 2), at(b, "lima"), at(b, "sepuluh"), at(b, "puluh", 1), at(b, "seterusnya")], tE = at(b, "enam"), tJ = at(b, "Jawaban");
        for (let n = 2; n <= 11; n++) {
          const k = n - 2, x = 110 + k * 172, tt = k < 5 ? ts[k] : ts[5] + (k - 5) * 0.25;
          fadeIn(ctx, ap(l, tt - 0.3), () => {
            panel(ctx, x, 180, 156, 200, { stroke: n === 11 ? C.red : C.line, lw: n === 11 ? 5 : 2, fill: n === 11 ? RED_BG : C.panel });
            text(ctx, "n = " + n, x + 78, 230, 28, { mono: true, weight: 700, align: "center", color: C.mut });
            text(ctx, String(K[n]), x + 78, 320, K[n] > 99 ? 42 : 52, { mono: true, weight: 800, align: "center", color: n === 11 ? C.red : C.ink });
            if (n > 2) text(ctx, n % 2 === 0 ? "×2+1" : "×2", x + 78, 160, 24, { mono: true, weight: 800, align: "center", color: n % 2 === 0 ? C.purple : C.green });
          });
        }
        fadeIn(ctx, ap(l, 0.2), () => label(ctx, "// BANYAK PASANGAN KEMBAR DI MANDIR(n)", 110, 130));
        fadeIn(ctx, ap(l, tE - 0.3), () => { panel(ctx, 300, 450, 1320, 130, { stroke: C.red, lw: 4 }); text(ctx, "00 di MANDIR(12) = kembar(11) = 682", 960, 532, 50, { mono: true, weight: 800, align: "center", color: C.red, fit: 1260 }); });
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: 682", 960, 620, { size: 52, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
    },

    kait_judul(ctx, b, l) {
      const tB = at(b, "biner");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "String Lebih Panjang dari Alam Semesta", 960, 300, 80, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Karakter ke-2025 Itu Apa?", 960, 400, 72, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2026 · SMA · No. 32, 33, 34 · Mondar-Mandir", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tB - 0.3), () => chip(ctx, "rekursi dan bilangan biner", 960, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
    },
    konsep_tm(ctx, b, l) {
      const tT = at(b, "Thue"), tP = at(b, "teratur");
      heading(ctx, "// KONSEP", "Barisan Thue-Morse", ap(l, tT - 0.3), 130);
      const s = TM(6), d = 56;
      for (let r = 0; r < 2; r++) bits(ctx, s.slice(r * 32, r * 32 + 32), 960 - 16 * d, 300 + r * 110, d, { gap: 4, h: 80, alpha: i => ap(l, tT + (r * 32 + i) * 0.03), fill: i => s[r * 32 + i] === "1" ? C.ink : C.panel, col: i => s[r * 32 + i] === "1" ? C.white : C.mut, stroke: () => C.line, lw: 2 });
      fadeIn(ctx, ap(l, tP - 0.2), () => text(ctx, "teratur, tetapi tidak pernah berulang persis", 960, 600, 44, { weight: 800, align: "center", color: C.green }));
    },
    konsep_rekursi(ctx, b, l) {
      const tD = at(b, "depan"), tB = at(b, "belakang"), tT = at(b, "tidak");
      heading(ctx, "// KONSEP", "Kunci: sifat rekursi", 1, 130);
      const lv = 4, X0 = 160, W = 1600;
      for (let k = 0; k < lv; k++) {
        const w = W / Math.pow(2, k), y = 280 + k * 90;
        fadeIn(ctx, ap(l, (k === 0 ? tD : tD + 0.5 * k) - 0.3), () => {
          rr(ctx, X0, y, w / 2, 70, 10); ctx.fillStyle = GREEN_BG; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.green; ctx.stroke();
          fadeIn(ctx, ap(l, tB - 0.3), () => { rr(ctx, X0 + w / 2, y, w / 2, 70, 10); ctx.fillStyle = RED_BG; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.red; ctx.stroke();
            if (k < 2) text(ctx, "kebalikan", X0 + w * 0.75, y + 46, 30, { weight: 800, align: "center", color: C.red }); });
          if (k < 2) text(ctx, "MANDIR(n − " + (k + 1) + ")", X0 + w / 4, y + 46, 30, { mono: true, weight: 800, align: "center", color: C.green });
        });
      }
      fadeIn(ctx, ap(l, tT - 0.2), () => chip(ctx, "tidak perlu menulis string yang panjang", 960, 660, { size: 36, color: C.white, fill: C.green, stroke: C.green, center: true }));
    },
    konsep_biner(ctx, b, l) {
      const tK = at(b, "k"), tG = at(b, "ganjil");
      heading(ctx, "// KONSEP", "Karakter ke-k dari biner(k − 1)", 1, 130);
      const s = TM(3);
      for (let k = 1; k <= 8; k++) fadeIn(ctx, ap(l, tK - 0.3 + k * 0.3), () => {
        const x = 170 + (k - 1) * 200, bin = (k - 1).toString(2).padStart(3, "0"), c = pop(k - 1);
        text(ctx, "k = " + k, x + 80, 300, 30, { mono: true, weight: 700, align: "center", color: C.mut });
        text(ctx, bin, x + 80, 370, 44, { mono: true, weight: 800, align: "center", color: C.purple });
        bits(ctx, s[k - 1], x + 40, 410, 90, { fill: () => c % 2 ? RED_BG : GREEN_BG, stroke: () => c % 2 ? C.red : C.green, col: () => c % 2 ? C.red : C.green });
      });
      fadeIn(ctx, ap(l, tG - 0.2), () => chip(ctx, "banyak angka 1 ganjil → '1', genap → '0'", 960, 610, { size: 38, color: C.white, fill: C.ink, stroke: C.ink, center: true }));
    }
  });
})();
