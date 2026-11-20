/* ON04 Lipat Kode (OSN-K 2026 SMA no. 35–37): LIPAT/KODE/TUNGGAL/GANDA, masalah Josephus, rekursi, biner.
   Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, para, panel, label, chip, check, cross, arrow, strike, hilite, ease, clamp, lerp, ap, at, speechEnd } = H;
  const { fadeIn, bigNote, note, heading } = U;
  const MONO = Kiko.FONTS.MONO;

  // ---------- kode C++ ----------
  const KIRI = ["int LIPAT(int n) {", "    if (n == 1) {", "        return 1;", "    }", "    return 2 * LIPAT(n / 2);", "}", "",
    "int KODE(int n) {", "    return 2 * (n - LIPAT(n)) + 1;", "}"];
  const TUNGGAL = ["int TUNGGAL(int n) {", "    int total = 0;", "    for (int i = 1; i <= n; i++) {", "        total += KODE(i);", "    }", "    return total;", "}"];
  const GANDA = ["int GANDA(int n, int k) {", "    int total = 0;", "    for (int i = 1; i <= n; i++) {", "        int temp = i;", "        for (int j = 1; j <= k; j++) {",
    "            temp = KODE(temp);", "        }", "        total += temp;", "    }", "    return total;", "}"];
  const KW = /^(int|if|return|for)$/, FN = /^(LIPAT|KODE|TUNGGAL|GANDA)$/;
  function codeLine(ctx, s, x, y, size) {
    ctx.font = `600 ${size}px ${MONO}`; const cw = ctx.measureText("M").width;
    const toks = s.match(/[A-Za-z_]+|\d+|\s+|[^\sA-Za-z_\d]/g) || []; let cx = x;
    toks.forEach(t => {
      const col = KW.test(t) ? C.green : FN.test(t) ? C.red : /^\d+$/.test(t) ? C.purple : C.ink;
      const w = KW.test(t) || FN.test(t) ? 800 : 600;
      text(ctx, t, cx, y, size, { mono: true, weight: w, color: col }); cx += cw * t.length;
    });
  }
  /* blok kode: o.hl = fungsi (i) -> 0..1 sorot baris i; o.dim = alpha baris tak disorot */
  function codeBlock(ctx, lines, x, y, w, size, o = {}) {
    const lh = size * 1.45, h = lines.length * lh + 44;
    panel(ctx, x, y, w, h, { fill: "#FFFDF7", stroke: o.stroke || C.line, lw: o.lw || 2, alpha: o.alpha });
    lines.forEach((s, i) => {
      const u = o.hl ? o.hl(i) : 0; const yy = y + 22 + i * lh;
      if (u > 0) { ctx.save(); ctx.globalAlpha *= u; ctx.fillStyle = "rgba(232,197,90,0.35)"; ctx.fillRect(x + 8, yy, w - 16, lh); ctx.fillStyle = C.goldRim; ctx.fillRect(x + 8, yy, 5, lh); ctx.restore(); }
      ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha) * (o.hl && o.dim !== undefined && u <= 0 ? o.dim : 1);
      codeLine(ctx, s, x + 28, yy + lh * 0.74, size); ctx.restore();
    });
    return { h, lineY: i => y + 22 + i * lh + lh / 2 };
  }
  const L = n => n === 1 ? 1 : 2 * L(Math.floor(n / 2));
  const K = n => 2 * (n - L(n)) + 1;
  const range = (a, b) => b >= a ? [a, ...range(a + 1, b)] : [];
  const between = (u, a, b) => u >= a && u <= b;

  // ---------- lingkaran Josephus ----------
  function josephusOrder(n) { const a = range(1, n), out = []; let i = 0; while (a.length > 1) { i = (i + 1) % a.length; out.push(a.splice(i, 1)[0]); } return { out, win: a[0] }; }
  const J41 = josephusOrder(41);
  /* gone: berapa yang sudah keluar (boleh pecahan, untuk animasi); win: sorot pemenang 0..1 */
  function circle(ctx, cx, cy, R, n, o = {}) {
    const gone = o.gone || 0, out = o.order || J41.out;
    for (let s = 1; s <= n; s++) {
      const a = -Math.PI / 2 + (s - 1) * 2 * Math.PI / n, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const k = out.indexOf(s); const g = k < 0 ? 0 : clamp(gone - k, 0, 1);
      const isWin = s === (o.winner || J41.win) && (o.win || 0) > 0;
      ctx.save();
      ctx.beginPath(); ctx.arc(x, y, o.r || 22, 0, Math.PI * 2);
      ctx.fillStyle = isWin ? C.green : g >= 1 ? "rgba(216,205,180,0.5)" : s === o.mark ? C.gold2 : C.panel; ctx.fill();
      ctx.lineWidth = isWin ? 4 : 2.5; ctx.strokeStyle = isWin ? C.green : g >= 1 ? C.line : C.ink; ctx.stroke();
      if (g > 0 && g < 1) { ctx.globalAlpha = 1 - g; ctx.beginPath(); ctx.arc(x, y, (o.r || 22) * (1 + g), 0, Math.PI * 2); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.stroke(); ctx.globalAlpha = 1; }
      text(ctx, String(s), x, y + (o.r || 22) * 0.36, (o.r || 22) * 0.9, { mono: true, weight: 800, align: "center", color: isWin ? C.white : g >= 1 ? C.line : C.ink });
      ctx.restore();
    }
  }

  // ---------- bit biner ----------
  function bits(ctx, s, x, y, d, o = {}) {   // kotak bit; o.col(i) warna; o.alpha(i)
    [...s].forEach((c, i) => {
      const a = o.alpha ? o.alpha(i) : 1; if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; const xx = x + i * d;
      rr(ctx, xx, y, d - 10, d * 1.15, 10); ctx.fillStyle = c === "1" ? "#FFF6DA" : C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = c === "1" ? C.goldRim : C.line; ctx.stroke();
      text(ctx, c, xx + (d - 10) / 2, y + d * 0.82, d * 0.62, { mono: true, weight: 800, align: "center", color: o.col ? o.col(i) : c === "1" ? C.ink : C.mut });
      ctx.restore();
    });
  }

  Object.assign(Kiko.SCENES, {
    // ================= KAIT =================
    kait_lingkar(ctx, b, l) {
      const tS = at(b, "satu"), tK = at(b, "kedua"), tT = at(b, "terus"), tD = at(b, "Di");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 1480, 140, 28, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      const gone = l < tK ? 0 : Math.min(12, (l - tK) * 2.2);
      circle(ctx, 760, 470, 300, 41, { gone, mark: l > tS - 0.2 ? 1 : 0 });
      fadeIn(ctx, ap(l, 0.2), () => { text(ctx, "41", 760, 470, 110, { disp: true, weight: 800, align: "center" }); text(ctx, "orang", 760, 520, 34, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tK - 0.3), () => { panel(ctx, 1200, 220, 560, 170, { stroke: C.red, lw: 3 }); text(ctx, "setiap orang kedua", 1480, 290, 40, { disp: true, weight: 800, align: "center", color: C.red }); text(ctx, "keluar dari lingkaran", 1480, 345, 34, { weight: 700, align: "center" }); });
      fadeIn(ctx, ap(l, tT - 0.3), () => text(ctx, "… sampai tersisa satu orang", 1480, 450, 32, { weight: 700, align: "center", color: C.mut }));
      fadeIn(ctx, ap(l, tD - 0.3), () => { text(ctx, "Kursi nomor", 1480, 590, 52, { disp: true, weight: 800, align: "center" }); text(ctx, "berapa?", 1480, 670, 72, { disp: true, weight: 800, align: "center", color: C.red }); });
    },
    kait_kode(ctx, b, l) {
      const tK = at(b, "kode"), tO = at(b, "OSN-K"), tB = at(b, "membongkarnya");
      fadeIn(ctx, ap(l, Math.max(0.2, tK - 0.5)), () => {
        codeBlock(ctx, KIRI, 200, 130, 760, 26, {});
        codeBlock(ctx, TUNGGAL, 1000, 130, 720, 26, {});
      });
      fadeIn(ctx, ap(l, tO - 0.3), () => chip(ctx, "OSN-K 2026 · SMA · No. 35–37", 1360, 520, { size: 32, color: C.white, fill: C.green, stroke: C.green, center: true }));
      fadeIn(ctx, ap(l, tB - 0.3), () => text(ctx, "→ kita bongkar sampai tuntas", 1360, 660, 40, { disp: true, weight: 800, align: "center", color: C.red }));
    },
    kait_judul(ctx, b, l) {
      const tR = at(b, "rekursif"), tB = at(b, "biner");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "Kode C++ Ini Menyimpan", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Teka-teki Kuno", 960, 400, 84, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2026 · SMA · No. 35, 36, 37 · Lipat Kode", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tR - 0.3), () => chip(ctx, "rekursi", 720, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
      fadeIn(ctx, ap(l, tB - 0.3), () => chip(ctx, "biner 101001", 1110, 580, { size: 44, color: C.white, fill: C.red, stroke: C.red, center: true, px: 28 }));
    },

    // ================= KODE =================
    kode(ctx, b, l) {
      const f = b.fokus;
      if (f === "semua") {
        const tL = at(b, "Lipat"), tK = at(b, "Kode"), tT = at(b, "Tunggal"), tG = at(b, "Ganda");
        const hl = (t0) => i => ap(l, t0 - 0.2, 0.3);
        codeBlock(ctx, KIRI, 110, 110, 760, 24, { hl: i => (i <= 5 ? ap(l, tL - 0.2, 0.3) * (l < tK - 0.2 ? 1 : 0) : between(i, 7, 9) ? ap(l, tK - 0.2, 0.3) * (l < tT - 0.2 ? 1 : 0) : 0) });
        codeBlock(ctx, TUNGGAL, 910, 110, 900, 22, { hl: i => (l > tT - 0.2 && l < tG - 0.2 ? ap(l, tT - 0.2, 0.3) : 0) });
        codeBlock(ctx, GANDA, 910, 410, 900, 22, { hl: i => ap(l, tG - 0.2, 0.3) });
        const tags = [["LIPAT", tL], ["KODE", tK], ["TUNGGAL", tT], ["GANDA", tG]];
        let cx = 110; tags.forEach(([s, t0], i) => { const u = ap(l, t0 - 0.2); const w = chip(ctx, (i + 1) + ". " + s, cx, 540, { size: 24, color: C.red, stroke: C.red, lw: 2, alpha: Math.max(0.001, u), px: 14 }); cx += w + 14; });
        return;
      }
      if (f === "LIPAT" || f === "KODE") {
        const blk = codeBlock(ctx, KIRI, 110, 120, 880, 32, {
          dim: 0.35, hl: i => {
            if (f === "KODE") return between(i, 7, 9) ? 1 : 0;
            if (b.bagi) return i === 4 ? 1 : 0;
            const tS = at(b, "sama"), tM = at(b, "memanggil");
            if (l < tS - 0.2) return i <= 5 ? 1 : 0;
            if (l < tM - 0.2) return between(i, 1, 2) ? 1 : 0;
            return i === 4 ? 1 : 0;
          }
        });
        const X = 1060;
        if (f === "LIPAT" && !b.bagi) {
          const tN = at(b, "menerima"), tS = at(b, "sama"), tM = at(b, "memanggil"), tX = at(b, "dikali");
          fadeIn(ctx, ap(l, tN - 0.2), () => { label(ctx, "// LIPAT(n)", X, 170); text(ctx, "masukan: satu bilangan n", X, 220, 34, { weight: 700 }); });
          fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, X, 270, 740, 120, { stroke: C.green, lw: 3 }); text(ctx, "n == 1  →  kembalikan 1", X + 30, 345, 38, { mono: true, weight: 800, color: C.green }); });
          fadeIn(ctx, ap(l, tM - 0.2), () => { panel(ctx, X, 420, 740, 120, { stroke: C.red, lw: 3 }); text(ctx, "memanggil dirinya sendiri", X + 30, 470, 30, { weight: 800, color: C.red }); text(ctx, "LIPAT(n / 2)", X + 30, 515, 34, { mono: true, weight: 800 }); });
          fadeIn(ctx, ap(l, tX - 0.2), () => { panel(ctx, X, 570, 740, 110, { stroke: C.goldRim, lw: 3 }); text(ctx, "lalu hasilnya × 2", X + 30, 640, 38, { mono: true, weight: 800, color: C.goldInk }); });
        } else if (b.bagi) {
          const tI = at(b, "integer"), tL5 = at(b, "lima"), tB = at(b, "bukan");
          fadeIn(ctx, ap(l, tI - 0.3), () => { label(ctx, "// n BERTIPE int", X, 190); text(ctx, "pembagian integer: sisa dibuang", X, 245, 34, { weight: 700 }); });
          fadeIn(ctx, ap(l, tL5 - 0.2), () => { panel(ctx, X, 300, 740, 220, { stroke: C.green, lw: 3 }); text(ctx, "5 / 2 = 2", X + 370, 440, 96, { mono: true, weight: 800, align: "center" }); });
          fadeIn(ctx, ap(l, tB - 0.2), () => { text(ctx, "bukan 2,5", X + 370, 610, 52, { mono: true, weight: 800, align: "center", color: C.purple }); strike(ctx, X + 230, 595, X + 510, 595, ap(l, tB + 0.3, 0.4), C.purple, 6); });
        } else {
          const tR = at(b, "Rumusnya"), tD = at(b, "dikurangi"), tT = at(b, "ditambah");
          fadeIn(ctx, ap(l, tR - 0.3), () => { label(ctx, "// KODE(n)", X, 200); panel(ctx, X, 230, 740, 200, { stroke: C.red, lw: 3 }); });
          fadeIn(ctx, ap(l, tR - 0.1), () => text(ctx, "2 ×", X + 40, 350, 56, { mono: true, weight: 800 }));
          fadeIn(ctx, ap(l, tD - 0.2), () => text(ctx, "(n − LIPAT(n))", X + 160, 350, 48, { mono: true, weight: 800, color: C.red }));
          fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "+ 1", X + 580, 350, 56, { mono: true, weight: 800 }));
          fadeIn(ctx, ap(l, tT + 0.6), () => text(ctx, "memakai hasil LIPAT", X + 370, 500, 32, { weight: 700, align: "center", color: C.mut }));
        }
        return;
      }
      // TUNGGAL dan GANDA
      const tT = at(b, "Tunggal"), tM = at(b, "menjumlahkan"), tG = at(b, "Ganda"), tB = at(b, "berulang"), tJ = at(b, "menjumlahkan", 2);
      codeBlock(ctx, TUNGGAL, 90, 120, 820, 26, { dim: 0.4, hl: i => l < tG - 0.2 ? (between(i, 2, 3) ? ap(l, tM - 0.2, 0.3) : 0) : 0, alpha: l > tG - 0.2 ? 0.5 : 1 });
      fadeIn(ctx, ap(l, tM - 0.2) * (l < tG ? 1 : 0.5), () => text(ctx, "KODE(1) + KODE(2) + … + KODE(n)", 500, 470, 32, { mono: true, weight: 800, align: "center", color: C.green }));
      fadeIn(ctx, ap(l, tG - 0.4), () => {
        codeBlock(ctx, GANDA, 960, 120, 880, 24, { dim: 0.45, hl: i => (l > tJ - 0.2 ? (i === 7 ? 1 : 0) : l > tB - 0.2 ? (between(i, 4, 6) ? 1 : 0) : between(i, 2, 3) ? 1 : 0) });
      });
      fadeIn(ctx, ap(l, tB - 0.2), () => { panel(ctx, 90, 540, 820, 160, { stroke: C.red, lw: 3 }); text(ctx, "temp = KODE(KODE(…KODE(i)…))", 500, 610, 32, { mono: true, weight: 800, align: "center", color: C.red, fit: 760 }); text(ctx, "sebanyak k kali", 500, 665, 30, { weight: 700, align: "center", color: C.mut }); });
    },

    // ================= SOAL =================
    soal_tanya(ctx, b, l) {
      const s = b.soal; bigNote(ctx, "Soal " + s, 960, 170, 56, ap(l, 0.1), { color: C.green });
      const tB = at(b, "Berapakah"), tA = at(b, "Artinya");
      const Q = { 35: "KODE(41) = ?", 36: "TUNGGAL(63) = ?", 37: "GANDA(63, 64656667) = ?" }[s];
      fadeIn(ctx, ap(l, tB - 0.2), () => { panel(ctx, 260, 240, 1400, 190, { stroke: C.red, lw: 4 }); text(ctx, Q, 960, 365, s === 37 ? 70 : 96, { mono: true, weight: 800, align: "center", fit: 1320 }); });
      if (s === 35) fadeIn(ctx, ap(l, tB + 1.2), () => { codeBlock(ctx, KIRI.slice(7), 460, 480, 1000, 30, {}); });
      if (s === 36) fadeIn(ctx, ap(l, tA - 0.2), () => { text(ctx, "= KODE(1) + KODE(2) + KODE(3) + … + KODE(63)", 960, 540, 44, { mono: true, weight: 800, align: "center", color: C.green, fit: 1500 }); text(ctx, "63 suku", 960, 620, 34, { weight: 700, align: "center", color: C.mut }); });
      if (s === 37) fadeIn(ctx, ap(l, tA - 0.2), () => {
        text(ctx, "untuk setiap i = 1 … 63:", 960, 520, 40, { weight: 800, align: "center" });
        text(ctx, "KODE diulang 64.656.667 kali", 960, 600, 54, { mono: true, weight: 800, align: "center", color: C.red, fit: 1500 });
      });
    },

    lipat_trace(ctx, b, l) {
      const naik = b.mode === "naik"; const ns = [41, 20, 10, 5, 2, 1], vs = [32, 16, 8, 4, 2, 1];
      const T = naik ? ns.map(() => -1) : [at(b, "Lipat", 1), at(b, "Lipat", 3), at(b, "Lipat", 4), at(b, "Lipat", 5), at(b, "Lipat", 6), at(b, "Lipat", 7)];
      const R = naik ? [at(b, "tiga"), at(b, "enam"), at(b, "delapan"), at(b, "empat"), at(b, "dua", 2), at(b, "satu", 2)] : ns.map(() => 1e9);
      label(ctx, naik ? "// KEMBALI KE ATAS" : "// TURUN: PANGGILAN REKURSIF", 200, 150);
      fadeIn(ctx, naik ? 1 : ap(l, 0.2), () => { chip(ctx, "KODE(41)", 200, 175, { size: 34, color: C.red, stroke: C.red, lw: 3 }); text(ctx, "butuh  LIPAT(41)", 470, 222, 32, { mono: true, weight: 700, color: C.mut }); });
      ns.forEach((n, i) => {
        const x = 260 + i * 80, y = 280 + i * 78;
        fadeIn(ctx, ap(l, T[i] - 0.2), () => {
          panel(ctx, x, y, 380, 62, { stroke: i === 5 ? C.green : C.line, lw: i === 5 ? 3 : 2, fill: i === 5 ? "#EEF5EC" : C.panel });
          text(ctx, "LIPAT(" + n + ")", x + 24, y + 43, 32, { mono: true, weight: 800 });
          if (i < 5) text(ctx, n + " / 2 = " + ns[i + 1], x + 410, y + 43, 28, { mono: true, weight: 600, color: C.mut });
          if (i === 5) text(ctx, "base case", x + 410, y + 43, 30, { mono: true, weight: 800, color: C.green });
        });
        if (naik) fadeIn(ctx, ap(l, R[i] - 0.15), () => { text(ctx, "→ " + vs[i], 1320, y + 45, 44, { mono: true, weight: 800, color: i === 0 ? C.red : C.ink }); if (i < 5) text(ctx, "= 2 × " + vs[i + 1], 1480, y + 43, 28, { mono: true, weight: 600, color: C.mut }); });
      });
      if (naik) fadeIn(ctx, ap(l, at(b, "base") - 0.2), () => { const y = 280 + 5 * 78; hilite(ctx, 1290, y + 2, 140, 60, C.green, 1); });
    },
    lipat_pola(ctx, b, l) {
      const tP = at(b, "pangkat"), tE = at(b, "empat"), tT = at(b, "tiga"), tN = at(b, "enam");
      heading(ctx, "// POLA LIPAT", "LIPAT(n) = pangkat dua terbesar ≤ n", 1, 160);
      const P = [1, 2, 4, 8, 16, 32, 64], x0 = 240, dx = 240;
      fadeIn(ctx, ap(l, tP - 0.2), () => {
        ctx.fillStyle = C.line; ctx.fillRect(x0, 450, dx * 6, 6);
        P.forEach((p, i) => { const x = x0 + i * dx; const is32 = p === 32 && l > tT - 0.2, is64 = p === 64 && l > tN - 0.2;
          ctx.beginPath(); ctx.arc(x, 453, 46, 0, Math.PI * 2); ctx.fillStyle = is32 ? C.green : is64 ? C.purpleBg : C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = is32 ? C.green : is64 ? C.purple : C.ink; ctx.stroke();
          text(ctx, String(p), x, 467, 38, { mono: true, weight: 800, align: "center", color: is32 ? C.white : is64 ? C.purple : C.ink });
          text(ctx, "2^" + i, x, 545, 26, { mono: true, weight: 600, align: "center", color: C.mut }); });
      });
      fadeIn(ctx, ap(l, tE - 0.2), () => { const x = x0 + 5 * dx + dx * (41 - 32) / 32; arrow(ctx, x, 330, x, 400, { color: C.red, lw: 6 }); chip(ctx, "n = 41", x, 260, { size: 34, color: C.red, stroke: C.red, lw: 3, center: true }); });
      fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "LIPAT(41) = 32", 960, 700, 52, { mono: true, weight: 800, align: "center", color: C.green }));
      fadeIn(ctx, ap(l, tN - 0.2), () => { text(ctx, "64 > 41", x0 + 6 * dx, 620, 40, { mono: true, weight: 800, align: "center", color: C.purple }); cross(ctx, x0 + 6 * dx + 56, 410, 40, C.purple, clamp((l - tN) / 0.5, 0, 1)); });
    },
    jawab35(ctx, b, l) {
      const fin = !!b.akhir;
      const S = [["KODE(41) = 2 × (41 − LIPAT(41)) + 1", fin ? -1 : 0.2], ["= 2 × (41 − 32) + 1", fin ? -1 : at(b, "tiga")], ["= 2 × 9 + 1", fin ? -1 : at(b, "sembilan", 1)],
        ["= 18 + 1", fin ? -1 : at(b, "delapan")], ["= 19", fin ? -1 : at(b, "sembilan", 3)]];
      label(ctx, fin ? "// JAWABAN SOAL 35" : "// HITUNG KODE(41)", 300, 160);
      S.forEach(([s, t0], i) => fadeIn(ctx, ap(l, t0 - 0.2), () => text(ctx, s, i === 0 ? 300 : 660, 240 + i * 100, i === 4 ? 72 : 52, { mono: true, weight: 800, color: i === 4 ? C.red : C.ink })));
      if (fin) {
        hilite(ctx, 640, 560, 280, 100, C.red, ap(l, 0.3), "rgba(210,56,43,0.08)");
        fadeIn(ctx, ap(l, at(b, "Ingat") - 0.2), () => { panel(ctx, 1160, 470, 520, 190, { stroke: C.goldRim, lw: 3 }); text(ctx, "Ingat angka 19!", 1420, 555, 44, { disp: true, weight: 800, align: "center", color: C.goldInk }); text(ctx, "nanti muncul lagi", 1420, 610, 30, { weight: 700, align: "center", color: C.mut }); });
      }
    },

    tabel36(ctx, b, l) {
      const m = b.mode; const G = [[1, 1], [2, 3], [4, 7], [8, 15]];
      label(ctx, "// NILAI KODE(n)", 200, 150);
      const tRow = m === "kelompok" ? [at(b, "Kode", 1), at(b, "Kode", 2), at(b, "Kode", 3), at(b, "Setiap")] : null;
      const tSum = m === "jumlah" ? [at(b, "pertama"), at(b, "empat"), at(b, "enam"), at(b, "kuadrat")] : null;
      const tSe = m === "kelompok" ? at(b, "Setiap") : 1e9, tNk = m === "kelompok" ? at(b, "naik") : 1e9;
      G.forEach(([a, z], r) => {
        const y = 190 + r * 150; const appear = m === "isi" ? 0.6 + r * 1.1 : -1;
        fadeIn(ctx, ap(l, appear), () => {
          const on = m === "kelompok" && l > tRow[r] - 0.2 && (r === 3 || l < tRow[r + 1] - 0.2);
          text(ctx, a === z ? "n = " + a : "n = " + a + "–" + z, 200, y + 75, 32, { mono: true, weight: 800, color: on ? C.red : C.mut });
          range(a, z).forEach((n, k) => {
            const x = 470 + k * 102; const v = K(n);
            const first = k === 0 && l > tSe - 0.2;
            rr(ctx, x, y + 20, 90, 84, 10); ctx.fillStyle = first ? C.greenBg : on ? "#FFF6DA" : C.panel; ctx.fill(); ctx.lineWidth = first || on ? 3 : 2; ctx.strokeStyle = first ? C.green : on ? C.goldRim : C.line; ctx.stroke();
            text(ctx, String(v), x + 45, y + 78, 40, { mono: true, weight: 800, align: "center", color: first ? C.green : C.ink });
            text(ctx, String(n), x + 45, y + 14, 20, { mono: true, weight: 600, align: "center", color: C.mut });
            if (r === 3 && k < 7 && l > tNk - 0.2) fadeIn(ctx, ap(l, tNk - 0.2 + k * 0.12), () => text(ctx, "+2", x + 96, y + 128, 22, { mono: true, weight: 800, align: "center", color: C.red }));
          });
          if (tSum) fadeIn(ctx, ap(l, tSum[r] - 0.2), () => { const v = (z - a + 1) ** 2; text(ctx, "= " + v, 1330, y + 78, 52, { mono: true, weight: 800, color: C.red }); });
        });
      });
      if (tSum) fadeIn(ctx, ap(l, tSum[3] - 0.2), () => { panel(ctx, 1490, 190, 330, 440, { stroke: C.green, lw: 3 }); label(ctx, "// KUADRAT", 1520, 240); ["1 = 1²", "4 = 2²", "16 = 4²", "64 = 8²"].forEach((s, i) => text(ctx, s, 1520, 320 + i * 80, 40, { mono: true, weight: 800, color: C.green })); });
    },
    jumlah36(ctx, b, l) {
      const fin = !!b.akhir; const R = ["1", "2–3", "4–7", "8–15", "16–31", "32–63"], V = [1, 4, 16, 64, 256, 1024];
      const tK = fin ? -1 : at(b, "kelompok");
      const tV = fin ? V.map(() => -1) : [at(b, "satu", 2), at(b, "empat", 1), at(b, "belas", 1), at(b, "empat", 2), at(b, "dua", 1), at(b, "seribu")];
      label(ctx, "// SEMUA KELOMPOK n = 1 … 63", 960, 160, { align: "center" });
      R.forEach((s, i) => {
        const x = 180 + i * 265;
        fadeIn(ctx, ap(l, tK - 0.2 + i * 0.25), () => {
          panel(ctx, x, 200, 235, 250, {});
          text(ctx, "n = " + s, x + 117, 255, 30, { mono: true, weight: 800, align: "center", color: C.mut });
          text(ctx, (2 ** i) + " suku", x + 117, 300, 26, { weight: 700, align: "center", color: C.mut });
          fadeIn(ctx, ap(l, tV[i] - 0.15), () => text(ctx, String(V[i]), x + 117, 400, 60, { mono: true, weight: 800, align: "center", color: C.red, fit: 210 }));
          if (i < 5) fadeIn(ctx, ap(l, tV[i + 1] - 0.15), () => text(ctx, "+", x + 250, 340, 40, { mono: true, weight: 800, align: "center", color: C.green }));
        });
      });
      if (fin) {
        const tS = at(b, "seribu");
        fadeIn(ctx, ap(l, 0.3), () => text(ctx, "1 + 4 + 16 + 64 + 256 + 1024", 960, 560, 48, { mono: true, weight: 800, align: "center" }));
        fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, 560, 600, 800, 150, { stroke: C.red, lw: 4 }); text(ctx, "TUNGGAL(63) = 1365", 960, 700, 64, { mono: true, weight: 800, align: "center", color: C.red }); });
      }
    },

    iterasi(ctx, b, l) {
      const m = b.mode;
      if (m === "desimal") {
        const C1 = [["41", at(b, "empat")], ["19", at(b, "sembilan")], ["7", at(b, "tujuh", 1)], ["7", at(b, "tujuh", 3)], ["7", at(b, "Setelah") + 0.3]];
        label(ctx, "// KODE BERULANG-ULANG", 960, 170, { align: "center" });
        C1.forEach(([s, t0], i) => {
          const x = 300 + i * 330;
          fadeIn(ctx, ap(l, t0 - 0.2), () => {
            ctx.beginPath(); ctx.arc(x, 400, 90, 0, Math.PI * 2); ctx.fillStyle = i >= 2 ? C.greenBg : C.panel; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = i >= 2 ? C.green : C.ink; ctx.stroke();
            text(ctx, s, x, 428, 80, { mono: true, weight: 800, align: "center", color: i >= 2 ? C.green : C.ink });
            if (i > 0) { arrow(ctx, x - 230, 400, x - 100, 400, { color: C.red, lw: 5 }); text(ctx, "KODE", x - 165, 375, 24, { mono: true, weight: 800, align: "center", color: C.red }); }
          });
        });
        fadeIn(ctx, ap(l, at(b, "Setelah") - 0.2), () => text(ctx, "nilainya berhenti di 7, tidak berubah lagi", 960, 620, 44, { disp: true, weight: 800, align: "center", color: C.green }));
        return;
      }
      if (m === "biner") {
        const tB = at(b, "biner"), tS = at(b, "ditulis"), tM = at(b, "memindahkan"), tJ = at(b, "sehingga"), tY = at(b, "yaitu");
        label(ctx, "// LIHAT DALAM BINER", 960, 140, { align: "center" });
        fadeIn(ctx, ap(l, tB - 0.2), () => text(ctx, "41 =", 330, 360, 64, { mono: true, weight: 800, align: "right" }));
        const D = 120, X0 = 390;
        const u = ap(l, tM + 0.4, 1.2);   // perpindahan bit depan ke belakang
        bits(ctx, "01001", X0 + D - u * D, 270, D, { alpha: i => ap(l, tS - 0.2 + (i + 1) * 0.35) });
        // bit depan bergerak melengkung ke belakang
        fadeIn(ctx, ap(l, tS - 0.2), () => {
          const x = lerp(X0, X0 + 5 * D, u), y = 270 - Math.sin(Math.PI * u) * 105;
          bits(ctx, "1", x, y, D, { col: () => u > 0 && u < 1 ? C.red : C.ink });
        });
        fadeIn(ctx, ap(l, tM - 0.2), () => text(ctx, "angka 1 paling depan → pindah ke paling belakang", 960, 520, 36, { weight: 800, align: "center", color: C.red }));
        fadeIn(ctx, ap(l, tJ - 0.2), () => { strike(ctx, X0 - 6, 340, X0 + D - 14, 340, ap(l, tJ, 0.4), C.purple, 6); text(ctx, "0 di depan tidak ditulis", X0 + 50, 470, 26, { weight: 700, color: C.purple }); });
        fadeIn(ctx, ap(l, tY - 0.2), () => { panel(ctx, 560, 580, 800, 130, { stroke: C.green, lw: 3 }); text(ctx, "10011 = 19 = KODE(41)", 960, 665, 56, { mono: true, weight: 800, align: "center", color: C.green }); });
        return;
      }
      // ujung
      const rows = [["101001", "41", -1], ["10011", "19", at(b, "hilang")], ["111", "7", at(b, "deretan")], ["111", "7", at(b, "yaitu")]];
      const tT = at(b, "tiga");
      label(ctx, "// SEMUA NOL HABIS", 960, 160, { align: "center" });
      rows.forEach(([s, v, t0], i) => fadeIn(ctx, ap(l, t0 - 0.2), () => {
        const y = 190 + i * 140, D = 96, x = 1160 - s.length * D;
        bits(ctx, s, x, y, D, { col: c => (i === 0 && l > tT - 0.2 && s[c] === "1") ? C.red : s[c] === "1" ? C.ink : C.mut });
        text(ctx, "= " + v, 1200, y + 80, 56, { mono: true, weight: 800, color: i >= 2 ? C.green : C.ink });
        if (i > 0) text(ctx, "KODE ↓", 440, y - 6, 26, { mono: true, weight: 800, color: C.red });
      }));
      fadeIn(ctx, ap(l, tT - 0.2), () => { panel(ctx, 1450, 210, 380, 170, { stroke: C.red, lw: 3 }); text(ctx, "tiga angka 1", 1640, 285, 40, { disp: true, weight: 800, align: "center", color: C.red }); text(ctx, "→ ujungnya 111", 1640, 340, 32, { mono: true, weight: 800, align: "center" }); });
    },
    pola37(ctx, b, l) {
      const tD = at(b, "deretan"), tE = at(b, "enam"), tP = at(b, "puluhan");
      heading(ctx, "// POLA GANDA", "Setiap bilangan berhenti di 11…1", 1, 160);
      fadeIn(ctx, ap(l, tD - 0.2), () => {
        panel(ctx, 260, 280, 1400, 150, { stroke: C.green, lw: 3 });
        text(ctx, "hasil akhir = 2^(banyak angka 1) − 1", 960, 375, 52, { mono: true, weight: 800, align: "center", color: C.green, fit: 1340 });
      });
      fadeIn(ctx, ap(l, tE - 0.2), () => { text(ctx, "n ≤ 63 → paling banyak 6 bit → 6 putaran cukup", 960, 520, 40, { mono: true, weight: 800, align: "center", fit: 1600 }); });
      fadeIn(ctx, ap(l, tP - 0.2), () => { text(ctx, "k = 64.656.667 putaran?", 960, 640, 48, { mono: true, weight: 800, align: "center", color: C.purple }); text(ctx, "hasilnya sama saja", 960, 705, 36, { weight: 800, align: "center", color: C.mut }); });
    },
    tabel37(ctx, b, l) {
      const jum = b.mode === "jumlah"; const cnt = [6, 15, 20, 15, 6, 1];
      const tR = jum ? cnt.map(() => -1) : cnt.map((_, i) => at(b, "dengan", i + 1) - 0.4);
      const tP = jum ? [at(b, "kali", 1), at(b, "kali", 2), at(b, "kali", 3), at(b, "kali", 4), at(b, "kali", 5), at(b, "ditambah", 5) + 1.2] : cnt.map(() => 1e9);
      const tH = jum ? at(b, "Hasilnya") : 1e9;
      const X = [300, 640, 940, 1240, 1560], hd = ["banyak angka 1", "berapa bilangan", "hasil akhir", "biner", "jumlah"];
      hd.forEach((s, i) => text(ctx, s, X[i], 160, 26, { mono: true, weight: 800, align: "center", color: C.green }));
      ctx.fillStyle = C.line; ctx.fillRect(160, 180, 1600, 3);
      cnt.forEach((c, i) => {
        const y = 240 + i * 72; const v = 2 ** (i + 1) - 1;
        fadeIn(ctx, ap(l, tR[i]), () => {
          text(ctx, String(i + 1), X[0], y, 40, { mono: true, weight: 800, align: "center" });
          text(ctx, String(c), X[1], y, 40, { mono: true, weight: 800, align: "center", color: C.red });
          text(ctx, String(v), X[2], y, 40, { mono: true, weight: 800, align: "center" });
          text(ctx, "1".repeat(i + 1), X[3], y, 34, { mono: true, weight: 700, align: "center", color: C.mut });
        });
        fadeIn(ctx, ap(l, tP[i] - 0.15), () => text(ctx, c + " × " + v + " = " + c * v, X[4], y, 34, { mono: true, weight: 800, align: "center", color: C.green }));
      });
      fadeIn(ctx, ap(l, tH - 0.2), () => { ctx.fillStyle = C.ink; ctx.fillRect(1400, 672, 320, 3); text(ctx, "665", X[4], 735, 60, { mono: true, weight: 800, align: "center", color: C.red }); });
      if (!jum) fadeIn(ctx, ap(l, at(b, "dengan", 6) + 0.6), () => text(ctx, "total 63 bilangan", X[1], 735, 30, { weight: 700, align: "center", color: C.mut }));
    },
    jawab37(ctx, b, l) {
      const tP = at(b, "Pelajarannya");
      label(ctx, "// JAWABAN SOAL 37", 960, 170, { align: "center" });
      panel(ctx, 360, 210, 1200, 200, { stroke: C.red, lw: 4 });
      text(ctx, "GANDA(63, 64656667) = 665", 960, 335, 64, { mono: true, weight: 800, align: "center", color: C.red, fit: 1120 });
      fadeIn(ctx, ap(l, tP - 0.2), () => { panel(ctx, 360, 470, 1200, 220, { stroke: C.goldRim, lw: 3 }); label(ctx, "// PELAJARAN", 400, 520, { color: C.goldInk });
        text(ctx, "Angka yang sangat besar sering hanya jebakan:", 400, 590, 40, { weight: 800, fit: 1120 }); text(ctx, "prosesnya sudah berhenti jauh sebelum itu.", 400, 645, 36, { weight: 700, color: C.mut, fit: 1120 }); });
    },

    // ================= KONSEP =================
    josephus(ctx, b, l) {
      const tK = at(b, "Kalau"), tS = at(b, "sembilan"), tD = at(b, "Kode");
      const gone = l < tK ? 0 : Math.min(40, (l - tK) / Math.max(0.5, tS - 0.3 - tK) * 40);
      circle(ctx, 700, 450, 310, 41, { gone, win: l > tS - 0.2 ? 1 : 0 });
      fadeIn(ctx, ap(l, tS - 0.2), () => { text(ctx, "19", 700, 480, 120, { disp: true, weight: 800, align: "center", color: C.green }); text(ctx, "bertahan", 700, 535, 32, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, 0.2), () => { label(ctx, "// 41 ORANG, SETIAP ORANG KEDUA KELUAR", 1180, 200); });
      fadeIn(ctx, ap(l, tK - 0.2), () => text(ctx, "keluar: 2, 4, 6, 8, …", 1180, 280, 36, { mono: true, weight: 700, color: C.red }));
      fadeIn(ctx, ap(l, tD - 0.2), () => { panel(ctx, 1180, 380, 600, 180, { stroke: C.green, lw: 4 }); text(ctx, "KODE(41) = 19", 1480, 495, 64, { mono: true, weight: 800, align: "center", color: C.green }); });
    },
    josephus_nama(ctx, b, l) {
      const tJ = at(b, "Josephus"), tR = at(b, "rumus"), tT = at(b, "tanpa");
      heading(ctx, "// TEKA-TEKI KUNO", "Masalah Josephus", ap(l, tJ - 0.3), 160);
      fadeIn(ctx, ap(l, tR - 0.2), () => {
        panel(ctx, 260, 300, 1400, 260, { stroke: C.green, lw: 3 });
        text(ctx, "n = pangkat dua terbesar + sisa", 960, 380, 44, { mono: true, weight: 800, align: "center", fit: 1300 });
        text(ctx, "pemenang = 2 × sisa + 1 = KODE(n)", 960, 470, 48, { mono: true, weight: 800, align: "center", color: C.green, fit: 1300 });
        text(ctx, "41 = 32 + 9  →  2 × 9 + 1 = 19", 960, 535, 32, { mono: true, weight: 700, align: "center", color: C.mut });
      });
      fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "tanpa menyimulasikan lingkaran satu per satu", 960, 660, 40, { weight: 800, align: "center", color: C.red }));
    },
    rekursi(ctx, b, l) {
      const tR = at(b, "rekursi", 1), tM = at(b, "memanggil"), tL = at(b, "lebih"), tB = at(b, "base");
      heading(ctx, "// KONSEP", "Rekursi", ap(l, tR - 0.4), 150);
      const ns = [41, 20, 10, 5, 2, 1];
      ns.forEach((n, i) => fadeIn(ctx, ap(l, tM - 0.2 + i * 0.25), () => {
        const x = 220 + i * 260, y = 300 + i * 60;
        panel(ctx, x, y, 220, 80, { stroke: i === 5 && l > tB - 0.2 ? C.green : C.line, lw: i === 5 && l > tB - 0.2 ? 4 : 2, fill: i === 5 && l > tB - 0.2 ? "#EEF5EC" : C.panel });
        text(ctx, "LIPAT(" + n + ")", x + 110, y + 52, 30, { mono: true, weight: 800, align: "center", fit: 200 });
        if (i < 5) arrow(ctx, x + 225, y + 40, x + 255, y + 95, { color: C.red, lw: 4, head: 12 });
      }));
      fadeIn(ctx, ap(l, tM - 0.2), () => text(ctx, "memanggil dirinya sendiri", 220, 270, 34, { weight: 800, color: C.red }));
      fadeIn(ctx, ap(l, tL - 0.2), () => text(ctx, "masalahnya makin kecil →", 220, 720, 34, { weight: 800, color: C.mut }));
      fadeIn(ctx, ap(l, tB - 0.2), () => { chip(ctx, "base case: n == 1", 1520, 720, { size: 30, color: C.white, fill: C.green, stroke: C.green, center: true }); });
    },
    biner_ide(ctx, b, l) {
      const tR = at(b, "rumit"), tB = at(b, "biner"), tP = at(b, "polanya");
      heading(ctx, "// KONSEP", "Lihat dalam biner", 1, 150);
      fadeIn(ctx, ap(l, tR - 0.2), () => { panel(ctx, 260, 290, 620, 330, {}); text(ctx, "41 → 19 → 7", 570, 420, 56, { mono: true, weight: 800, align: "center" }); text(ctx, "terasa acak?", 570, 500, 36, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tB - 0.2), () => { arrow(ctx, 900, 455, 1020, 455, { color: C.green, lw: 6 }); panel(ctx, 1040, 290, 620, 330, { stroke: C.green, lw: 3 }); text(ctx, "101001", 1350, 390, 52, { mono: true, weight: 800, align: "center" }); text(ctx, "10011", 1350, 460, 52, { mono: true, weight: 800, align: "center" }); text(ctx, "111", 1350, 530, 52, { mono: true, weight: 800, align: "center", color: C.green }); });
      fadeIn(ctx, ap(l, tP - 0.2), () => text(ctx, "polanya langsung terlihat", 1350, 590, 30, { weight: 800, align: "center", color: C.green }));
    }
  });
})();
