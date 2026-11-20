/* ON07 Jadwal Pembinaan (OSN-K 2026 SMA no. 14–16): jadwal 10 hari dengan jeda, cara rakus vs pemrograman dinamis.
   Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, para, panel, label, chip, check, cross, arrow, clamp, ap, at, speechEnd } = H;
  const { fadeIn, bigNote, note, heading } = U;

  const P14 = { T: Array(10).fill(2), O: Array(10).fill(3), K: Array(10).fill(5) };
  const P16 = { T: [2, 2, 2, 1, 7, 8, 4, 5, 3, 4], O: [3, 3, 3, 1, 5, 6, 9, 7, 5, 6], K: [5, 5, 5, 1, 4, 3, 5, 6, 8, 9] };
  const DPV = { T: [2, 7, 10, 14, 21, 27, 31, 41, 45, 53], O: [3, 8, 11, 14, 19, 27, 36, 39, 47, 55], K: [5, 8, 13, 12, 18, 24, 32, 42, 49, 56] };
  const BEST = "KOKTOTOKOK", GREEDY_O = "KOKOTOKOKO";
  const COL = { T: C.green, O: C.goldRim, K: C.red, I: C.mut };
  const NAMA = { T: "Teori", O: "Observasi", K: "Kompetisi", I: "Istirahat" };
  const LX = 230, X0 = 380, CW = 130;
  const cx = d => X0 + CW * d + CW / 2;
  const T = (b, w) => at(b, w[0], w[1] || 1);

  function badge(ctx, k, x, y, r = 26, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = COL[k]; ctx.fill();
    text(ctx, k, x, y + r * 0.38, r * 1.05, { mono: true, weight: 800, align: "center", color: C.white }); ctx.restore();
  }
  /* tabel poin/DP: P {T:[],O:[],K:[]}; o.y, o.col(d)->alpha, o.hlCol(d)->warna, o.cell(r,d)->warna, o.title, o.val(r,d)->alpha */
  function tbl(ctx, P, o = {}) {
    const y = o.y || 120, rh = o.rh || 64, hh = 56, h = hh + 3 * rh;
    ctx.save(); ctx.globalAlpha *= o.alpha === undefined ? 1 : o.alpha;
    panel(ctx, LX, y, X0 - LX + CW * 10, h, { stroke: o.stroke || C.line, lw: o.stroke ? 3 : 2 });
    text(ctx, o.title || "Hari", LX + (X0 - LX) / 2, y + 38, 26, { mono: true, weight: 800, align: "center", color: C.mut });
    for (let d = 0; d < 10; d++) {
      const a = o.col ? o.col(d) : 1; if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha *= a;
      const hc = o.hlCol && o.hlCol(d);
      if (hc) { ctx.fillStyle = hc; ctx.globalAlpha *= 0.16; ctx.fillRect(X0 + CW * d + 4, y + 4, CW - 8, h - 8); ctx.globalAlpha /= 0.16; ctx.lineWidth = 4; ctx.strokeStyle = hc; rr(ctx, X0 + CW * d + 4, y + 4, CW - 8, h - 8, 8); ctx.stroke(); }
      text(ctx, String(d + 1), cx(d), y + 38, 28, { mono: true, weight: 800, align: "center", color: C.mut });
      ["T", "O", "K"].forEach((k, r) => {
        const cy = y + hh + rh * r; const cc = o.cell && o.cell(k, d);
        if (cc) { rr(ctx, cx(d) - 48, cy + 6, 96, rh - 12, 10); ctx.fillStyle = cc; ctx.globalAlpha *= 0.2; ctx.fill(); ctx.globalAlpha /= 0.2; ctx.lineWidth = 4; ctx.strokeStyle = cc; ctx.stroke(); }
        const va = o.val ? o.val(k, d) : 1;
        if (va > 0) fadeIn(ctx, va, () => text(ctx, String(P[k][d]), cx(d), cy + rh / 2 + 13, 36, { mono: true, weight: 800, align: "center", color: cc || C.ink }));
      });
      ctx.restore();
    }
    ["T", "O", "K"].forEach((k, r) => badge(ctx, k, LX + (X0 - LX) / 2, y + hh + rh * r + rh / 2, 24));
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LX + 10, y + hh); ctx.lineTo(X0 + CW * 10 - 10, y + hh); ctx.stroke();
    ctx.restore();
    return h;
  }
  /* baris jadwal: seq string (T/O/K/I/?/spasi), o.y, o.h, o.u(d)->alpha, o.pts P (poin di bawah), o.x(d) silang, o.mark(d) warna garis, o.lab */
  function sched(ctx, seq, o = {}) {
    const y = o.y || 450, h = o.h || 96;
    if (o.lab) text(ctx, o.lab, LX + (X0 - LX) / 2 - 6, y + h / 2 + 10, o.labSize || 26, { weight: 800, align: "center", color: o.labColor || C.mut, fit: X0 - LX - 10 });
    for (let d = 0; d < 10; d++) {
      const s = seq[d] || " "; const u = o.u ? o.u(d) : 1; const x = cx(d) - 55;
      ctx.save();
      rr(ctx, x, y, 110, h, 12); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.setLineDash(s === " " || s === "?" ? [8, 7] : []); ctx.stroke(); ctx.setLineDash([]);
      if (u > 0 && s !== " ") {
        ctx.globalAlpha *= u;
        if (s === "?") text(ctx, "?", cx(d), y + h / 2 + 18, 50, { disp: true, weight: 800, align: "center", color: C.mut });
        else { rr(ctx, x, y, 110, h, 12); ctx.fillStyle = COL[s] || C.mut; ctx.fill(); text(ctx, s, cx(d), y + h / 2 + 18, h > 80 ? 54 : 40, { mono: true, weight: 800, align: "center", color: C.white }); }
        if (o.pts && "TOK".includes(s)) text(ctx, String(o.pts[s][d]), cx(d), y + h + 42, 32, { mono: true, weight: 800, align: "center", color: COL[s] });
        if (o.pts && s === "I") text(ctx, "0", cx(d), y + h + 42, 32, { mono: true, weight: 800, align: "center", color: C.mut });
      }
      ctx.restore();
      const mk = o.mark && o.mark(d); if (mk) { ctx.lineWidth = 6; ctx.strokeStyle = mk; rr(ctx, x - 6, y - 6, 122, h + 12, 16); ctx.stroke(); }
      const xa = o.x ? o.x(d) : 0; if (xa > 0) cross(ctx, cx(d), y + h / 2, 34, C.red, xa);
    }
  }
  function total(ctx, v, y, u, o = {}) {
    if (u <= 0) return;
    fadeIn(ctx, u, () => { panel(ctx, 1700, y, 180, o.h || 96, { stroke: o.color || C.red, lw: 4 }); text(ctx, "total", 1790, y + 30, 22, { mono: true, weight: 800, align: "center", color: C.mut });
      text(ctx, String(v), 1790, y + (o.h || 96) - 16, 48, { mono: true, weight: 800, align: "center", color: o.color || C.red }); });
  }
  function jedaChips(ctx, abc, y, u) {
    fadeIn(ctx, u, () => ["A", "B", "C"].forEach((k, i) => { const x = 960 + (i - 1) * 300; const kk = "TOK"[i];
      panel(ctx, x - 130, y, 260, 90, { stroke: COL[kk], lw: 3 }); badge(ctx, kk, x - 80, y + 45, 24); text(ctx, k + " = " + abc[i], x + 30, y + 60, 40, { mono: true, weight: 800, align: "center" }); }));
  }
  const sum = (seq, P) => seq.split("").reduce((s, c, d) => s + ("TOK".includes(c) ? P[c][d] : 0), 0);

  Object.assign(Kiko.SCENES, {
    jadwal(ctx, b, l) {
      const m = b.mode;
      if (m === "kait") {
        const tS = at(b, "sepuluh"), tA = at(b, "agenda"), tP = at(b, "poin"), tB = at(b, "besar");
        tbl(ctx, P16, { y: 130, col: d => ap(l, tS + d * 0.08), val: (k, d) => ap(l, tP - 0.2 + d * 0.06) });
        sched(ctx, "??????????", { y: 450, u: d => ap(l, tA + d * 0.08), lab: "jadwal" });
        total(ctx, "?", 450, ap(l, tB - 0.2));
        fadeIn(ctx, ap(l, tB - 0.2), () => text(ctx, "Total poin paling besar?", 960, 650, 46, { disp: true, weight: 800, align: "center", color: C.red }));
        return;
      }
      if (m === "rakus_kait") {
        const tM = at(b, "memilih"), tJ = at(b, "menjebak"), tE = at(b, "keempat"), tB = at(b, "berkurang");
        tbl(ctx, P16, { y: 110, hlCol: d => d === 3 && l > tE - 0.2 ? C.purple : null });
        sched(ctx, GREEDY_O, { y: 420, h: 84, u: d => ap(l, tM + d * 0.12), lab: "pilih O", labColor: C.goldInk, mark: d => d === 3 && l > tE - 0.2 ? C.purple : null });
        sched(ctx, BEST, { y: 560, h: 84, u: d => ap(l, tE + 0.4 + d * 0.08), lab: "pilih T", labColor: C.green, mark: d => d === 3 && l > tE + 0.3 ? C.purple : null });
        total(ctx, sum(GREEDY_O, P16), 414, ap(l, tB - 0.3), { color: C.red });
        total(ctx, sum(BEST, P16), 554, ap(l, tB - 0.3), { color: C.green });
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "rakus: ambil poin terbesar hari ini", 960, 690, { size: 30, color: C.white, fill: C.purple, stroke: C.purple, center: true }));
        return;
      }
      if (m === "agenda") {
        const tN = at(b, "berlangsung");
        fadeIn(ctx, ap(l, tN - 0.2), () => { for (let d = 0; d < 10; d++) { const x = 330 + d * 130; rr(ctx, x, 140, 110, 70, 10); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke();
          text(ctx, d < 8 ? "hari " + (d + 1) : d === 8 ? "…" : "hari N", x + 55, 186, 24, { mono: true, weight: 800, align: "center", color: C.mut }); } });
        ["T", "O", "K", "I"].forEach((k, i) => {
          const tk = at(b, NAMA[k]); const x = 960 + (i - 1.5) * 410;
          fadeIn(ctx, ap(l, tk - 0.2), () => { panel(ctx, x - 180, 290, 360, 330, { stroke: COL[k], lw: 4 }); badge(ctx, k, x, 400, 64);
            text(ctx, k === "I" ? "Istirahat" : "Latihan", x, 530, 32, { weight: 700, align: "center", color: C.mut }); text(ctx, k === "I" ? "0 poin" : NAMA[k], x, 585, 44, { disp: true, weight: 800, align: "center", color: COL[k] }); });
        });
        return;
      }
      if (m === "tabel") {
        const tP = at(b, "poin"), tT = at(b, "tabel"), tI = at(b, "Istirahat");
        tbl(ctx, P16, { y: 170, col: d => ap(l, tP - 0.2 + d * 0.08), stroke: l > tT - 0.2 ? C.green : null });
        fadeIn(ctx, ap(l, tT - 0.2), () => label(ctx, "// TABEL POIN MANFAAT", 960, 140, { align: "center" }));
        fadeIn(ctx, ap(l, tI - 0.2), () => { badge(ctx, "I", 820, 560, 34); text(ctx, "Istirahat = 0 poin", 880, 575, 40, { weight: 800, color: C.mut }); });
        return;
      }
      if (m === "aturan") {
        const ts = [at(b, "Teori"), at(b, "Observasi"), at(b, "Kompetisi")]; const tJ = at(b, "jeda");
        fadeIn(ctx, ap(l, tJ - 0.2), () => label(ctx, "// ATURAN JEDA", 960, 150, { align: "center" }));
        ["T", "O", "K"].forEach((k, i) => fadeIn(ctx, ap(l, ts[i] - 0.2), () => {
          const y = 200 + i * 160; panel(ctx, 260, y, 1400, 130, { stroke: COL[k], lw: 3 }); badge(ctx, k, 340, y + 65, 40);
          text(ctx, `Setelah ${NAMA[k]}, selama ${"ABC"[i]} hari berikutnya: tidak boleh ${k}`, 420, y + 80, 42, { weight: 800, fit: 1200 });
        }));
        return;
      }
      if (m === "contoh") {
        const tP = at(b, "pertama"), tK = at(b, "ketiga"), tE = at(b, "keempat"), tI = at(b, "Istirahat");
        fadeIn(ctx, ap(l, 0.2), () => { panel(ctx, 760, 130, 400, 100, { stroke: C.red, lw: 4 }); text(ctx, "C = 2", 960, 198, 56, { mono: true, weight: 800, align: "center", color: C.red }); });
        const seq = (l > tE - 0.2 ? "K" + (l > tI - 0.2 ? "II" : "  ") + "K" : "K");
        sched(ctx, seq, { y: 330, u: d => d === 0 ? ap(l, tP - 0.2) : d === 3 ? ap(l, tE - 0.2) : ap(l, tI - 0.2), x: d => (d === 1 || d === 2) && l > tK - 0.3 && l < tI - 0.2 ? 1 : 0 });
        for (let d = 0; d < 10; d++) text(ctx, "hari " + (d + 1), cx(d), 310, 22, { mono: true, weight: 700, align: "center", color: C.mut });
        fadeIn(ctx, ap(l, tK - 0.3), () => { ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx(1) - 50, 460); ctx.lineTo(cx(1) - 50, 480); ctx.lineTo(cx(2) + 50, 480); ctx.lineTo(cx(2) + 50, 460); ctx.stroke();
          text(ctx, "2 hari tanpa K", (cx(1) + cx(2)) / 2, 525, 30, { weight: 800, align: "center", color: C.red }); });
        fadeIn(ctx, ap(l, tE - 0.2), () => text(ctx, "K boleh lagi", cx(3), 580, 30, { weight: 800, align: "center", color: C.green }));
        fadeIn(ctx, ap(l, tI - 0.2), () => text(ctx, "Istirahat boleh mengisi hari kosong", 960, 700, 40, { weight: 800, align: "center", color: C.mut }));
        return;
      }
      if (m === "tanya") {
        const tT = at(b, "tiga"), tS = at(b, "sepuluh"), tB = at(b, "besar");
        [["Soal 14", "poin tetap", "A = B = C = 1"], ["Soal 15", "poin tetap", "A = 1, B = 2, C = 3"], ["Soal 16", "poin berubah", "A = B = C = 1"]].forEach(([s, p, j], i) => fadeIn(ctx, ap(l, tT - 0.2 + i * 0.4), () => {
          const x = 960 + (i - 1) * 560; panel(ctx, x - 250, 170, 500, 300, { stroke: C.red, lw: 3 });
          text(ctx, s, x, 250, 48, { disp: true, weight: 800, align: "center", color: C.red }); text(ctx, p, x, 330, 36, { weight: 800, align: "center" }); text(ctx, j, x, 400, 32, { mono: true, weight: 800, align: "center", color: C.mut });
        }));
        fadeIn(ctx, ap(l, tS - 0.2), () => chip(ctx, "N = 10 hari", 960, 520, { size: 40, color: C.white, fill: C.green, stroke: C.green, center: true }));
        fadeIn(ctx, ap(l, tB - 0.2), () => text(ctx, "total poin maksimum = ?", 960, 680, 52, { disp: true, weight: 800, align: "center", color: C.red }));
        return;
      }
      if (m === "soal") {
        const P = b.soal === 16 ? P16 : P14, abc = b.soal === 15 ? [1, 2, 3] : [1, 1, 1];
        const tT = b.soal === 16 ? at(b, "poinnya") : at(b, "Teori"), tJ = at(b, "jeda"), tB = at(b, "Berapa");
        tbl(ctx, P, { y: 120, col: d => ap(l, tT - 0.2 + d * 0.06) });
        jedaChips(ctx, abc, 430, ap(l, tJ - 0.2));
        fadeIn(ctx, ap(l, tB - 0.2), () => { panel(ctx, 560, 570, 800, 110, { stroke: C.red, lw: 4 }); text(ctx, "total maksimum = ?", 960, 645, 52, { mono: true, weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "a3") {
        const tK = at(b, "Kompetisi"), tB = at(b, "berturut");
        tbl(ctx, P14, { y: 120, cell: (k, d) => k === "K" && l > tK - 0.2 ? C.red : null });
        sched(ctx, l > tB - 0.3 ? "KK" : "K", { y: 450, u: d => d === 0 ? ap(l, tK) : ap(l, tB - 0.3), x: d => d === 1 && l > tB ? 1 : 0, lab: "jadwal" });
        fadeIn(ctx, ap(l, tB), () => text(ctx, "K tidak boleh dua hari berturut-turut", 960, 660, 42, { weight: 800, align: "center", color: C.red }));
        return;
      }
      if (m === "a4") {
        const tD = at(b, "dua"), tO = at(b, "Observasi"), tL = at(b, "delapan");
        tbl(ctx, P14, { y: 120 });
        const seq = l > tO - 0.2 ? "KOKOKOKOKO" : "K K K K K ";
        sched(ctx, seq, { y: 440, u: d => d === 0 || d === 1 ? 1 : ap(l, tL - 0.2), pts: P14, lab: "jadwal" });
        for (let p = 0; p < 5; p++) {
          const u = p === 0 ? ap(l, tD - 0.2) : ap(l, tL - 0.2 + p * 0.15); if (u <= 0) continue;
          fadeIn(ctx, u, () => { const x1 = cx(2 * p) - 55, x2 = cx(2 * p + 1) + 55; ctx.strokeStyle = C.purple; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, 420); ctx.lineTo(x1, 404); ctx.lineTo(x2, 404); ctx.lineTo(x2, 420); ctx.stroke();
            if (l > tL - 0.2) chip(ctx, "≤ 8", (x1 + x2) / 2, 640, { size: 30, color: C.white, fill: C.purple, stroke: C.purple, center: true }); });
        }
        return;
      }
      if (m === "a5") {
        const tE = at(b, "empat"), tJ = at(b, "Jawaban");
        tbl(ctx, P14, { y: 120 });
        sched(ctx, "KOKOKOKOKO", { y: 440, pts: P14, lab: "jadwal" });
        fadeIn(ctx, ap(l, 0.2), () => text(ctx, "5 pasang × 8 = 40", 960, 680, 46, { mono: true, weight: 800, align: "center" }));
        total(ctx, 40, 440, ap(l, tE - 0.2));
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: 40", 1790, 580, { size: 34, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
      if (m === "b3" || m === "b4") {
        const isK = m === "b3"; const k = isK ? "K" : "O";
        const pos = isK ? [0, 4, 8] : [0, 3, 6, 9]; const keys = isK ? ["pertama", "kelima", "kesembilan"] : ["pertama", "keempat", "ketujuh", "kesepuluh"];
        jedaChips(ctx, [1, 2, 3], 130, 1);
        const seq = Array.from({ length: 10 }, (_, d) => pos.includes(d) ? k : " ").join("");
        sched(ctx, seq, { y: 330, u: d => { const i = pos.indexOf(d); return i < 0 ? 0 : ap(l, at(b, keys[i]) - 0.2); }, lab: isK ? "Kompetisi" : "Observasi", labColor: COL[k] });
        pos.slice(1).forEach((d, i) => { const d0 = pos[i]; const u = ap(l, at(b, keys[i + 1]) - 0.2); if (u <= 0) return;
          fadeIn(ctx, u, () => { ctx.strokeStyle = C.mut; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx(d0), 440); ctx.quadraticCurveTo((cx(d0) + cx(d)) / 2, 500, cx(d), 440); ctx.stroke();
            text(ctx, "+" + (d - d0), (cx(d0) + cx(d)) / 2, 520, 30, { mono: true, weight: 800, align: "center", color: C.mut }); }); });
        const tM = isK ? at(b, "tiga", 2) : at(b, "empat");
        fadeIn(ctx, ap(l, tM - 0.2), () => chip(ctx, isK ? "K paling banyak 3 kali" : "O paling banyak 4 kali, hanya 1 cara", 960, 600, { size: 36, color: C.white, fill: COL[k], stroke: COL[k], center: true }));
        return;
      }
      if (m === "b5") {
        const tS = at(b, "setiap"), tP = at(b, "pertama"), tK = at(b, "kesepuluh"), tO = at(b, "empat");
        const KS = [[0, 4, 8], [0, 4, 9], [0, 5, 9], [1, 5, 9]];
        KS.forEach((pos, i) => { const seq = Array.from({ length: 10 }, (_, d) => pos.includes(d) ? "K" : " ").join("");
          sched(ctx, seq, { y: 120 + i * 92, h: 72, u: d => ap(l, tS - 0.2 + i * 0.25), lab: i === 0 ? "3 K" : "", labColor: C.red,
            mark: d => pos.includes(d) && ((d === 0 && l > tP - 0.2) || (d === 9 && l > tK - 0.2)) ? C.purple : null }); });
        sched(ctx, "O  O  O  O", { y: 520, h: 72, u: d => ap(l, tO - 0.2), lab: "4 O", labColor: C.goldInk, mark: d => (d === 0 || d === 9) && l > tO ? C.purple : null });
        fadeIn(ctx, ap(l, tO + 0.4), () => text(ctx, "selalu bentrok di hari 1 atau hari 10", 960, 680, 42, { weight: 800, align: "center", color: C.purple }));
        return;
      }
      if (m === "b6") {
        const tT = at(b, "Teori"), tC = at(b, "Contohnya"), tL = at(b, "lima"), tR = at(b, "tiga", 3);
        jedaChips(ctx, [1, 2, 3], 120, 1);
        const SEQ = "KTOTKTOTKO";
        sched(ctx, SEQ, { y: 300, pts: P14, lab: "jadwal", u: d => SEQ[d] === "T" ? ap(l, tT - 0.2) : SEQ[d] === "K" ? 1 : ap(l, 0.4) });
        fadeIn(ctx, ap(l, tL - 0.2), () => text(ctx, "3 × 5  +  3 × 3  +  4 × 2  =  15 + 9 + 8", 960, 560, 44, { mono: true, weight: 800, align: "center" }));
        total(ctx, 32, 300, ap(l, tR - 0.2));
        fadeIn(ctx, ap(l, tC - 0.2), () => text(ctx, "T tidak pernah berturut-turut", 960, 650, 32, { weight: 700, align: "center", color: C.green }));
        return;
      }
      if (m === "b7") {
        const rows = [["3 K + 3 O + 4 T", "= 32", C.green, at(b, "Pilihan")], ["≤ 2 K + 4 O + 4 T", "≤ 30", C.mut, at(b, "empat")], ["3 K + 2 O + 5 T", "≤ 31", C.mut, at(b, "satu")]];
        heading(ctx, "// SOAL 15", "Bandingkan semua pilihan", 1, 140);
        rows.forEach(([a, v, col, t0], i) => fadeIn(ctx, ap(l, t0 - 0.2), () => { const y = 250 + i * 130; panel(ctx, 460, y, 1000, 105, { stroke: col, lw: i === 0 ? 4 : 2 });
          text(ctx, a, 520, y + 68, 44, { mono: true, weight: 800 }); text(ctx, v, 1400, y + 68, 48, { mono: true, weight: 800, align: "right", color: i === 0 ? C.green : C.mut }); }));
        fadeIn(ctx, ap(l, at(b, "Jawaban") - 0.2), () => chip(ctx, "JAWABAN: 32", 960, 650, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
      if (m === "c3") {
        const tR = at(b, "rakus"), tE = at(b, "keempat"), tO = at(b, "lima"), tT = at(b, "lima", 2), tD = at(b, "dipercaya");
        tbl(ctx, P16, { y: 110, hlCol: d => d === 3 && l > tE - 0.2 ? C.purple : null, cell: (k, d) => GREEDY_O[d] === k && l > tR && l < tT - 0.3 ? COL[k] : null });
        sched(ctx, GREEDY_O, { y: 420, h: 84, u: d => ap(l, tR + d * 0.25), lab: "rakus + O", labColor: C.goldInk, pts: null, mark: d => d === 3 && l > tE - 0.2 ? C.purple : null });
        total(ctx, 53, 414, ap(l, tO - 0.2), { color: C.red });
        sched(ctx, BEST, { y: 560, h: 84, u: d => ap(l, tT - 0.4 + d * 0.06), lab: "rakus + T", labColor: C.green, mark: d => d === 3 && l > tT - 0.4 ? C.purple : null });
        total(ctx, 56, 554, ap(l, tT - 0.2), { color: C.green });
        fadeIn(ctx, ap(l, tD - 0.3), () => chip(ctx, "hasil rakus bergantung pada untung-untungan", 960, 690, { size: 30, color: C.white, fill: C.purple, stroke: C.purple, center: true }));
        return;
      }
      if (m === "dp") {
        const id = b.id;
        // c4: tabel kosong muncul; c5: kolom 1; c6: kolom 2; c7: kolom 3..10; c8: telusuri mundur
        let shown = d => 0;
        if (id === "c5") { const t1 = at(b, "dua", 1); shown = (k, d) => d === 0 ? ap(l, t1 - 0.2 + "TOK".indexOf(k) * 0.4) : 0; }
        if (id === "c6") { const tk = { T: at(b, "tujuh"), O: at(b, "delapan"), K: at(b, "delapan", 2) }; shown = (k, d) => d === 0 ? 1 : d === 1 ? ap(l, tk[k] - 0.2) : 0; }
        if (id === "c7") { const t0 = 0.3, step = Math.max(0.35, (speechEnd(b) * 0.55) / 8); shown = (k, d) => d <= 1 ? 1 : ap(l, t0 + (d - 2) * step); }
        if (id === "c8") shown = () => 1;
        const tTr = id === "c8" ? at(b, "telusuri") : 1e9, tJd = id === "c8" ? at(b, "jadwalnya") : 1e9, tKm = id === "c8" ? at(b, "Kompetisi") : 1e9;
        const hlCell = (k, d) => {
          if (id === "c6" && d === 1) { const tk = { T: at(b, "tujuh"), O: at(b, "delapan"), K: at(b, "delapan", 2) }; if (l > tk[k] - 0.8 && l < tk[k] + 0.9) return COL[k]; }
          if (id === "c6" && d === 0) { const tT = at(b, "tujuh"), tO = at(b, "delapan"), tK = at(b, "delapan", 2);
            if ((k === "K" && ((l > tT - 0.8 && l < tT + 0.9) || (l > tO - 0.8 && l < tO + 0.9))) || (k === "O" && l > tK - 0.8 && l < tK + 0.9)) return C.purple; }
          if (id === "c8") { if (d === 9 && k === "K" && l > tKm - 0.2) return C.red; const back = Math.floor((l - tTr) / 0.3); if (l > tTr - 0.1 && 9 - d <= back && BEST[d] === k) return COL[k]; }
          return null;
        };
        const yD = 150;
        fadeIn(ctx, ap(l, id === "c4" ? 0.2 : 0), () => tbl(ctx, DPV, { y: yD, title: "Hari", val: shown, cell: hlCell, stroke: C.green }));
        fadeIn(ctx, ap(l, id === "c4" ? at(b, "simpan") - 0.2 : 0), () => label(ctx, "// TABEL: total terbesar kalau hari itu diakhiri T / O / K", 960, 132, { align: "center" }));
        if (id !== "c8" || l < tJd - 0.3) {
          ctx.save(); ctx.globalAlpha *= id === "c8" ? clamp((tJd - 0.3 - l) / 0.4, 0, 1) : 1;
          tbl(ctx, P16, { y: 450, title: "poin", rh: 56 });
          ctx.restore();
          if (id === "c5") fadeIn(ctx, ap(l, at(b, "Aturannya") - 0.2), () => { panel(ctx, 330, 700, 1260, 80, { stroke: C.red, lw: 3 }); text(ctx, "angka hari ini = poin hari ini + terbesar kemarin (latihan lain)", 960, 753, 34, { mono: true, weight: 800, align: "center", fit: 1200 }); });
        } else {
          sched(ctx, BEST, { y: 470, pts: P16, lab: "jadwal", u: d => ap(l, tJd - 0.3 + d * 0.06) });
          total(ctx, 56, 470, ap(l, tJd));
          fadeIn(ctx, ap(l, at(b, "Jawaban") - 0.2), () => chip(ctx, "JAWABAN: 56", 960, 680, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
        }
        if (id === "c7") fadeIn(ctx, ap(l, at(b, "Istirahat") - 0.2), () => { panel(ctx, 330, 700, 1260, 80, { stroke: C.mut, lw: 2 }); text(ctx, "Istirahat tidak dibutuhkan: selalu ada latihan lain yang boleh", 960, 753, 34, { weight: 800, align: "center", color: C.mut, fit: 1200 }); });
        return;
      }
    },
    kait_judul(ctx, b, l) {
      const tP = at(b, "pemrograman");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "Jadwal 10 Hari, Poin Terbesar", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Kapan Cara Rakus Menjebak?", 960, 400, 72, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2026 · SMA · No. 14, 15, 16 · Jadwal Pembinaan Tim Olimpiade", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center", fit: 1700 });
      fadeIn(ctx, ap(l, tP - 0.3), () => chip(ctx, "pemrograman dinamis", 960, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
    },
    konsep_rakus(ctx, b, l) {
      const tH = at(b, "hari"), tB = at(b, "besok");
      heading(ctx, "// KONSEP", "Cara rakus (greedy)", 1, 150);
      fadeIn(ctx, ap(l, tH - 0.2), () => { panel(ctx, 260, 300, 420, 260, { stroke: C.purple, lw: 4 }); text(ctx, "hari 4", 470, 380, 40, { mono: true, weight: 800, align: "center", color: C.purple });
        text(ctx, "T = O = K = 1", 470, 450, 36, { mono: true, weight: 800, align: "center" }); text(ctx, "kelihatannya sama saja", 470, 510, 28, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tB - 0.4), () => {
        arrow(ctx, 700, 380, 960, 330, { color: C.green, lw: 5 }); arrow(ctx, 700, 480, 960, 540, { color: C.red, lw: 5 });
        panel(ctx, 980, 260, 680, 140, { stroke: C.green, lw: 3 }); text(ctx, "pilih T → besok boleh O 5", 1010, 320, 34, { weight: 800, fit: 620 }); text(ctx, "total 56", 1010, 375, 34, { mono: true, weight: 800, color: C.green });
        panel(ctx, 980, 470, 680, 140, { stroke: C.red, lw: 3 }); text(ctx, "pilih O → besok O dilarang", 1010, 530, 34, { weight: 800, fit: 620 }); text(ctx, "total 53", 1010, 585, 34, { mono: true, weight: 800, color: C.red });
      });
    },
    konsep_tabel(ctx, b, l) {
      const tS = at(b, "menyimpan"), tT = at(b, "terakhir", 2);
      heading(ctx, "// KONSEP", "Pemrograman dinamis: simpan semua kemungkinan terbaik", 1, 150);
      for (let d = 0; d < 4; d++) {
        const x = 330 + d * 330, u = ap(l, tS - 0.2 + d * 0.3); if (u <= 0) continue;
        fadeIn(ctx, u, () => { text(ctx, d < 3 ? "hari " + (d + 1) : "hari 10", x + 100, 290, 28, { mono: true, weight: 800, align: "center", color: C.mut });
          ["T", "O", "K"].forEach((k, r) => { const y = 320 + r * 110; panel(ctx, x, y, 200, 90, { stroke: COL[k], lw: 3 }); badge(ctx, k, x + 45, y + 45, 24); text(ctx, String(DPV[k][d < 3 ? d : 9]), x + 140, y + 60, 40, { mono: true, weight: 800, align: "center" }); });
          if (d < 3) text(ctx, d < 2 ? "→" : "…", x + 265, 480, 60, { weight: 800, align: "center", color: C.mut }); });
      }
      fadeIn(ctx, ap(l, tT - 0.2), () => { ctx.lineWidth = 6; ctx.strokeStyle = C.red; rr(ctx, 1320 - 8, 540 - 8, 216, 106, 14); ctx.stroke(); text(ctx, "pilih terbesar di akhir", 1420, 700, 30, { weight: 800, align: "center", color: C.red }); });
    },
    konsep_mirip(ctx, b, l) {
      const tP = at(b, "Perjalanan"), tJ = at(b, "menjumlahkan"), tB = at(b, "terbesar");
      heading(ctx, "// KONSEP", "Satu cara berpikir, dua kegunaan", 1, 150);
      fadeIn(ctx, ap(l, tP - 0.2), () => { panel(ctx, 220, 290, 700, 360, { stroke: C.green, lw: 3 }); text(ctx, "Perjalanan ke Timur", 570, 370, 44, { disp: true, weight: 800, align: "center" });
        text(ctx, "banyak cara", 570, 440, 32, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tJ - 0.2), () => text(ctx, "jumlahkan  +", 570, 560, 56, { mono: true, weight: 800, align: "center", color: C.green }));
      fadeIn(ctx, ap(l, tJ + 0.4), () => { panel(ctx, 1000, 290, 700, 360, { stroke: C.red, lw: 3 }); text(ctx, "Jadwal Pembinaan", 1350, 370, 44, { disp: true, weight: 800, align: "center" });
        text(ctx, "nilai terbesar", 1350, 440, 32, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tB - 0.2), () => text(ctx, "ambil  max", 1350, 560, 56, { mono: true, weight: 800, align: "center", color: C.red }));
    }
  });
})();
