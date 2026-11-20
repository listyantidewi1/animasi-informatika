/* ON12 Dua dari Tujuh Telur (OSN-K 2025 SMA no. 10): mesin pendeteksi telur emas (uji kelompok).
   Batas bawah: 21 pasangan > 2^4 = 16 jawaban → K ≥ 5. Strategi 5: uji pasang {1,2},{3,4},{5,6}, telur 7 disisihkan.
   Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, panel, label, chip, arrow, check, cross, clamp, ap, at } = H;
  const { fadeIn, heading } = U;

  /* telur: (x, y) = pusat, r = setengah lebar. o.gold, o.q (tanda tanya), o.alpha, o.dim, o.ring (warna lingkar sorot) */
  function egg(ctx, x, y, r, s, o = {}) {
    const a = o.alpha === undefined ? 1 : o.alpha; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a * (o.dim ? 0.35 : 1);
    const path = () => { ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.3, 0, 0, Math.PI * 2); };
    ctx.save(); ctx.translate(4, 6); path(); ctx.fillStyle = "rgba(60,45,10,0.12)"; ctx.fill(); ctx.restore();
    path(); ctx.fillStyle = o.gold ? C.gold : "#FBF7EC"; ctx.fill(); ctx.lineWidth = Math.max(3, r * 0.08); ctx.strokeStyle = o.gold ? C.goldRim : "#B9AC8E"; ctx.stroke();
    if (o.gold) { ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.5, r * 0.18, r * 0.3, -0.4, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.fill(); }
    if (o.ring) { ctx.beginPath(); ctx.ellipse(x, y, r * 1.22, r * 1.55, 0, 0, Math.PI * 2); ctx.lineWidth = 5; ctx.strokeStyle = o.ring; ctx.stroke(); }
    if (s) text(ctx, s, x, y + r * 0.32, r * 0.85, { mono: true, weight: 800, align: "center", color: o.gold ? C.goldInk : C.ink });
    if (o.q) text(ctx, "?", x + r * 0.95, y - r * 1.05, r * 0.8, { disp: true, weight: 800, color: C.red });
    ctx.restore();
  }
  /* mesin: x,y kiri atas; o.res: "ada" | "tidak" | null; o.u alpha */
  function mesin(ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    rr(ctx, x + 6, y + 10, w, h, 22); ctx.fillStyle = "rgba(60,45,10,0.12)"; ctx.fill();
    rr(ctx, x, y, w, h, 22); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(ctx, x + w * 0.3, y - 22, w * 0.4, 30, 10); ctx.fillStyle = "#E9E1CC"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke();
    text(ctx, "MESIN PENDETEKSI", x + w / 2, y + 48, 26, { mono: true, weight: 800, align: "center", color: C.mut, ls: 2 });
    const dx = x + 30, dy = y + 70, dw = w - 60, dh = h - 100, res = o.res;
    rr(ctx, dx, dy, dw, dh, 12); ctx.fillStyle = res === "ada" ? "#FBE9C4" : res === "tidak" ? "#E3F0E6" : "#EEF3E6"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
    const s = res === "ada" ? "TELUR EMAS TERDETEKSI" : res === "tidak" ? "TIDAK ADA TELUR EMAS" : (o.idle || "ADA  /  TIDAK ?");
    text(ctx, s, dx + dw / 2, dy + dh * 0.62, Math.min(40, dh * 0.42), { mono: true, weight: 800, align: "center", color: res === "ada" ? C.red : res === "tidak" ? C.green : C.mut, fit: dw - 30 });
    ctx.restore();
  }
  function hasil(ctx, res, x, y, o = {}) {   // chip hasil mesin; x = tengah
    const ada = res === "ada";
    chip(ctx, ada ? "TERDETEKSI" : "TIDAK ADA", x, y, { size: o.size || 30, color: C.white, fill: ada ? C.red : C.green, stroke: ada ? C.red : C.green, center: true, alpha: o.alpha });
  }
  const PAIRS = []; for (let i = 1; i <= 7; i++) for (let j = i + 1; j <= 7; j++) PAIRS.push([i, j]);

  // satu baris telur 1..7 dengan jarak gap, berpusat di cx
  function baris(ctx, cx, y, r, gap, f) {
    for (let i = 1; i <= 7; i++) { const x = cx + (i - 4) * gap; const o = f ? f(i) : {}; if (o) egg(ctx, x, y, r, String(i), o); }
  }
  // tiga pasang + telur 7 (strategi); f(i) memberi opsi telur, box(k) memberi {col, alpha}
  function grup(ctx, y, r, f, box) {
    const X = [300, 720, 1140], X7 = 1600;
    X.forEach((cx, k) => {
      const bo = box ? box(k) : { alpha: 1 };
      if (bo && bo.alpha > 0) { ctx.save(); ctx.globalAlpha *= bo.alpha; rr(ctx, cx - 170, y - r * 1.7, 340, r * 3.4, 26); ctx.fillStyle = bo.fill || "rgba(255,252,244,0.6)"; ctx.fill(); ctx.lineWidth = 4; ctx.setLineDash(bo.dash ? [12, 9] : []); ctx.strokeStyle = bo.col || C.ink; ctx.stroke(); ctx.restore(); }
      [2 * k + 1, 2 * k + 2].forEach((e, j) => { const o = f ? f(e) : {}; if (o) egg(ctx, cx - 80 + j * 160, y, r, String(e), o); });
    });
    const o7 = f ? f(7) : {}; if (o7) egg(ctx, X7, y, r, "7", o7);
    return { X, X7 };
  }

  Kiko.ON12 = { egg, mesin, hasil, baris, grup };

  Object.assign(Kiko.SCENES, {
    telur(ctx, b, l) {
      const m = b.mode;
      if (m === "kait") {
        const tE = at(b, "emas"), tM = at(b, "mesin"), tB = at(b, "Berapa");
        baris(ctx, 960, 230, 58, 200, i => ({ alpha: ap(l, 0.2 + i * 0.12), q: l > tE - 0.2 }));
        fadeIn(ctx, ap(l, tE - 0.2), () => chip(ctx, "2 di antaranya telur emas", 960, 340, { size: 34, color: C.goldInk, fill: "#FBE9C4", stroke: C.goldRim, center: true }));
        mesin(ctx, 610, 450, 700, 230, { alpha: ap(l, tM - 0.3), res: l > tM + 1.6 ? (Math.floor((l - tM) / 1.1) % 2 ? "ada" : "tidak") : null });
        fadeIn(ctx, ap(l, tB - 0.3), () => chip(ctx, "berapa kali?", 1560, 520, { size: 48, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
      if (m === "besar") {
        const t1 = at(b, "cukup", 1), t2 = at(b, "sedikit");
        fadeIn(ctx, ap(l, t1 - 0.4), () => { panel(ctx, 360, 180, 1200, 170, { stroke: C.green, lw: 4, fill: C.greenBg }); text(ctx, "K kali", 460, 290, 72, { mono: true, weight: 800, color: C.green }); text(ctx, "pasti cukup", 1370, 288, 50, { weight: 800, align: "right", color: C.green }); check(ctx, 1440, 268, 70, C.green, 1); });
        fadeIn(ctx, ap(l, t2 - 0.3), () => { panel(ctx, 360, 400, 1200, 170, { stroke: C.red, lw: 4 }); text(ctx, "K − 1 kali", 460, 510, 72, { mono: true, weight: 800, color: C.red }); text(ctx, "pasti tidak cukup", 1370, 508, 50, { weight: 800, align: "right", color: C.red }); cross(ctx, 1440, 488, 56, C.red, 1); });
        return;
      }
      if (m === "soal") {
        const t7 = at(b, "tujuh"), tD = at(b, "dua"), tS = at(b, "sama");
        baris(ctx, 960, 330, 70, 220, i => ({ alpha: ap(l, t7 - 0.4 + i * 0.12) }));
        fadeIn(ctx, ap(l, tD - 0.3), () => chip(ctx, "tepat 2 telur emas", 960, 120, { size: 44, color: C.goldInk, fill: "#FBE9C4", stroke: C.goldRim, center: true }));
        fadeIn(ctx, ap(l, tS - 0.3), () => text(ctx, "semua terlihat sama: mana yang emas?", 960, 560, 44, { weight: 800, align: "center", color: C.mut }));
        return;
      }
      if (m === "mesin") {
        const tM = at(b, "mesin"), tI = at(b, "memasukkan"), tT = at(b, "tidak"), tD = at(b, "terdeteksi"), tN = at(b, "tanpa");
        mesin(ctx, 160, 230, 760, 300, { alpha: ap(l, tM - 0.3), idle: "masukkan telur" });
        [1, 3, 4].forEach((e, k) => { const u = ap(l, tI + k * 0.25, 0.6); if (u <= 0) return; egg(ctx, 400 + k * 140, 150 + (1 - u) * -40, 44, String(e), { alpha: u }); });
        fadeIn(ctx, ap(l, tT - 0.3), () => { panel(ctx, 1040, 200, 720, 120, { stroke: C.green, lw: 4, fill: C.greenBg }); text(ctx, "TIDAK ADA TELUR EMAS", 1400, 278, 42, { mono: true, weight: 800, align: "center", color: C.green, fit: 680 }); });
        fadeIn(ctx, ap(l, tD - 0.3), () => { panel(ctx, 1040, 350, 720, 120, { stroke: C.red, lw: 4, fill: "#FBE9C4" }); text(ctx, "TELUR EMAS TERDETEKSI", 1400, 428, 42, { mono: true, weight: 800, align: "center", color: C.red, fit: 680 }); });
        fadeIn(ctx, ap(l, tN - 0.3), () => text(ctx, "tidak memberi tahu telur yang mana", 1400, 540, 36, { weight: 800, align: "center", color: C.mut }));
        return;
      }
      if (m === "contoh") {
        const tM = at(b, "Misalnya"), tA = at(b, "Kalau", 1), tR1 = at(b, "terdeteksi"), tB = at(b, "Kalau", 2), tR2 = at(b, "tidak");
        label(ctx, "// CONTOH: TELUR 2 DAN 3 EMAS", 160, 135);
        baris(ctx, 960, 230, 50, 170, i => ({ gold: (i === 2 || i === 3) && l > tM + 0.6, alpha: 1 }));
        const rowT = (y, set, t0, tr, res) => fadeIn(ctx, ap(l, t0 - 0.2), () => {
          panel(ctx, 260, y, 1400, 150, { stroke: C.line });
          text(ctx, "masukkan", 300, y + 88, 30, { weight: 800, color: C.mut });
          set.forEach((e, k) => egg(ctx, 520 + k * 120, y + 75, 38, String(e), { gold: e === 2 || e === 3, ring: e === 2 || e === 3 ? C.red : null }));
          arrow(ctx, 520 + set.length * 120, y + 75, 1080, y + 75, { u: ap(l, tr - 0.6), color: C.ink, lw: 4, head: 16 });
          if (l > tr - 0.3) hasil(ctx, res, 1350, y + 46, { size: 38, alpha: ap(l, tr - 0.3) });
        });
        rowT(360, [1, 2, 5], tA, tR1, "ada");
        rowT(540, [1, 4], tB, tR2, "tidak");
        return;
      }
      if (m === "tanya") {
        const tS = at(b, "strategi"), tP = at(b, "Paling"), tK = at(b, "K");
        fadeIn(ctx, ap(l, tS - 0.3), () => { panel(ctx, 260, 140, 1400, 190, { stroke: C.green, lw: 3 }); text(ctx, "Strategi terbaik: kedua telur emas pasti ketemu,", 960, 225, 46, { weight: 800, align: "center", fit: 1320 }); text(ctx, "apa pun pasangannya.", 960, 290, 46, { weight: 800, align: "center", color: C.goldInk }); });
        fadeIn(ctx, ap(l, tP - 0.3), () => { panel(ctx, 260, 370, 1400, 140, { stroke: C.red, lw: 4 }); text(ctx, "Paling banyak berapa kali mesin dipakai?", 960, 462, 50, { weight: 800, align: "center", color: C.red, fit: 1320 }); });
        fadeIn(ctx, ap(l, tK - 0.2), () => chip(ctx, "K = ?", 960, 560, { size: 64, color: C.white, fill: C.red, stroke: C.red, center: true, px: 36 }));
        return;
      }
      // ---------- batas bawah ----------
      if (m === "pasangan" || m === "kurang") {
        const p = m === "pasangan";
        const tH = p ? at(b, "hitung") : 0, tC = p ? at(b, "Memilih") : 0;
        const tP = p ? 0 : at(b, "pasti"), tE = p ? 0 : at(b, "empat"), tL = p ? 0 : at(b, "lima");
        if (p) {
          PAIRS.forEach(([i, j], k) => fadeIn(ctx, ap(l, tH + k * 0.12, 0.3), () => {
            const x = 200 + (k % 7) * 220, y = 130 + Math.floor(k / 7) * 120;
            panel(ctx, x, y, 190, 90, { stroke: C.goldRim, lw: 3, fill: "#FFF6DA" }); text(ctx, i + " & " + j, x + 95, y + 60, 40, { mono: true, weight: 800, align: "center", color: C.goldInk });
          }));
          fadeIn(ctx, ap(l, tC - 0.3), () => chip(ctx, "C(7, 2) = 7 × 6 ÷ 2 = 21 pasangan", 960, 540, { size: 44, color: C.white, fill: C.red, stroke: C.red, center: true }));
          return;
        }
        // kurang: 21 pasangan ke 16 kotak jawaban
        text(ctx, "16 urutan jawaban", 960, 140, 40, { weight: 800, align: "center", color: C.green });
        for (let s = 0; s < 16; s++) { const x = 150 + s * 102; panel(ctx, x, 170, 90, 300, { stroke: C.green, lw: 2, fill: s === 3 ? C.redBg : C.panel }); }
        PAIRS.forEach(([i, j], k) => {
          const s = k < 16 ? k : 3, lev = k < 16 ? 0 : (k - 15);
          const u = ap(l, (k < 16 ? 0.1 + k * 0.05 : tP - 0.4 + (k - 16) * 0.25), 0.3); if (u <= 0) return;
          const x = 150 + s * 102 + 6, y = 400 - lev * 46;
          fadeIn(ctx, u, () => { panel(ctx, x, y, 78, 40, { stroke: k >= 16 ? C.red : C.goldRim, lw: 2, fill: "#FFF6DA", r: 8 }); text(ctx, i + "&" + j, x + 39, y + 29, 22, { mono: true, weight: 800, align: "center", color: k >= 16 ? C.red : C.goldInk }); });
        });
        fadeIn(ctx, ap(l, tP), () => text(ctx, "ada pasangan yang tertukar!", 960, 540, 40, { weight: 800, align: "center", color: C.red }));
        fadeIn(ctx, ap(l, tE - 0.3), () => chip(ctx, "4 kali: tidak cukup", 640, 600, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
        fadeIn(ctx, ap(l, tL - 0.3), () => chip(ctx, "K ≥ 5", 1300, 600, { size: 48, color: C.white, fill: C.green, stroke: C.green, center: true, px: 30 }));
        return;
      }
      if (m === "cabang" || m === "empat") {
        const c = m === "cabang";
        const tD = c ? at(b, "dua") : 0, tB = c ? at(b, "membagi") : 0, tE = c ? 0 : at(b, "empat"), t16 = c ? 0 : at(b, "enam"), tP = c ? 0 : at(b, "Padahal");
        const L = c ? 1 : 4, top = 140, dy = c ? 260 : 105;
        const lvT = k => c ? (k === 0 ? 0 : tD) : (k === 0 ? 0 : tE + (k - 1) * 0.5);
        for (let k = 0; k <= L; k++) {
          const n = 1 << k, w = 1620 / n, y = top + k * dy;
          for (let i = 0; i < n; i++) {
            const x = 150 + w * (i + 0.5); const u = ap(l, lvT(k) - 0.2); if (u <= 0) continue;
            fadeIn(ctx, u, () => {
              if (k > 0) { const px = 150 + (1620 / (n / 2)) * (Math.floor(i / 2) + 0.5); ctx.strokeStyle = i % 2 ? C.green : C.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, y - dy + 30); ctx.lineTo(x, y - 24); ctx.stroke(); }
              const r = c ? 70 : Math.max(16, 40 - k * 6); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = k === L && !c ? "#FFF6DA" : C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = k === L && !c ? C.goldRim : C.ink; ctx.stroke();
              if (c && k === 0) text(ctx, "21", x, y + 18, 52, { mono: true, weight: 800, align: "center", color: C.red });
              if (c && k === 1) text(ctx, i ? "TIDAK" : "ADA", x, y + 12, 32, { mono: true, weight: 800, align: "center", color: i ? C.green : C.red });
            });
          }
        }
        if (c) {
          fadeIn(ctx, ap(l, tB - 0.3), () => { text(ctx, "kelompok 1", 150 + 405, 560, 34, { weight: 800, align: "center", color: C.red }); text(ctx, "kelompok 2", 150 + 1215, 560, 34, { weight: 800, align: "center", color: C.green }); text(ctx, "satu pemakaian = dua jawaban", 960, 680, 40, { weight: 800, align: "center", color: C.mut }); });
          return;
        }
        fadeIn(ctx, ap(l, t16 - 0.3), () => chip(ctx, "2 × 2 × 2 × 2 = 16", 520, 610, { size: 46, color: C.goldInk, fill: "#FFF6DA", stroke: C.goldRim, center: true }));
        fadeIn(ctx, ap(l, tP - 0.3), () => chip(ctx, "21 pasangan > 16", 1400, 610, { size: 46, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
      // ---------- strategi ----------
      if (m === "kelompok" || m === "tiga") {
        const k1 = m === "kelompok";
        const tK = k1 ? at(b, "Kelompokkan") : 0, tA = k1 ? at(b, "satu") : 0, tB = k1 ? at(b, "tiga", 2) : 0, tC = k1 ? at(b, "lima", 2) : 0, t7 = k1 ? at(b, "tujuh") : 0;
        const tM = k1 ? 0 : at(b, "Masukkan"), tT = k1 ? 0 : at(b, "tiga"), tR = k1 ? 0 : at(b, "Karena");
        const bt = [tA, tB, tC];
        grup(ctx, 300, 60, e => e === 7 ? { alpha: k1 ? ap(l, t7 - 0.3) : 1, dim: true } : {}, k => ({ alpha: k1 ? ap(l, bt[k] - 0.2) : 1 }));
        if (k1) fadeIn(ctx, ap(l, t7 - 0.2), () => text(ctx, "disisihkan", 1600, 450, 34, { weight: 800, align: "center", color: C.mut }));
        if (!k1) {
          [300, 720, 1140].forEach((x, k) => fadeIn(ctx, ap(l, tM + k * 0.6), () => { chip(ctx, "uji ke-" + (k + 1), x, 450, { size: 34, color: C.white, fill: C.ink, stroke: C.ink, center: true }); }));
          fadeIn(ctx, ap(l, tT - 0.3), () => chip(ctx, "3 pemakaian", 1600, 450, { size: 34, color: C.red, stroke: C.red, center: true }));
          fadeIn(ctx, ap(l, tR - 0.3), () => text(ctx, "paling sedikit satu pasang pasti TERDETEKSI", 960, 620, 42, { weight: 800, align: "center", color: C.red }));
        }
        return;
      }
      if (m === "dua") {
        const tD = at(b, "dua"), tB = at(b, "Berarti"), tC = at(b, "Cek"), tL = at(b, "lima");
        const G = [1, 6], R = ["ada", "tidak", "ada"];
        const show = l > tC + 1.2;
        grup(ctx, 260, 54, e => e === 7 ? { dim: true } : { gold: show && G.includes(e), dim: R[Math.floor((e - 1) / 2)] === "tidak" }, k => ({ alpha: 1, col: R[k] === "ada" ? C.red : C.green }));
        fadeIn(ctx, ap(l, tD - 0.3), () => [300, 720, 1140].forEach((x, k) => hasil(ctx, R[k], x, 380, { size: 30 })));
        fadeIn(ctx, ap(l, tB - 0.3), () => text(ctx, "setiap pasang yang terdeteksi berisi tepat 1 telur emas", 960, 500, 38, { weight: 800, align: "center", color: C.goldInk, fit: 1600 }));
        fadeIn(ctx, ap(l, tC - 0.3), () => { chip(ctx, "cek telur 1 → TERDETEKSI", 520, 560, { size: 32, color: C.red, stroke: C.red, center: true }); });
        fadeIn(ctx, ap(l, tC + 0.6), () => { chip(ctx, "cek telur 5 → TIDAK ADA", 1300, 560, { size: 32, color: C.green, stroke: C.green, center: true }); });
        fadeIn(ctx, ap(l, tL - 0.3), () => chip(ctx, "3 + 2 = 5 kali", 960, 640, { size: 44, color: C.white, fill: C.ink, stroke: C.ink, center: true }));
        return;
      }
      if (m === "satu" || m === "sisa") {
        const s1 = m === "satu", R = ["ada", "tidak", "tidak"];
        const tH = s1 ? at(b, "hanya") : 0, tT = s1 ? at(b, "tiga") : 0;
        grup(ctx, 200, 46, e => e === 7 ? { ring: s1 ? null : C.purple } : { dim: e > 2 }, k => ({ alpha: 1, col: R[k] === "ada" ? C.red : C.green }));
        if (s1) fadeIn(ctx, ap(l, tH - 0.3), () => [300, 720, 1140].forEach((x, k) => hasil(ctx, R[k], x, 300, { size: 28 })));
        else [300, 720, 1140].forEach((x, k) => hasil(ctx, R[k], x, 300, { size: 28 }));
        const opts = [["1 & 2", 1, 2], ["1 & 7", 1, 7], ["2 & 7", 2, 7]];
        if (s1) {
          opts.forEach(([s], k) => fadeIn(ctx, ap(l, tT + 0.3 + k * 0.5), () => { panel(ctx, 360 + k * 420, 430, 360, 130, { stroke: C.goldRim, lw: 3, fill: "#FFF6DA" }); text(ctx, s, 540 + k * 420, 515, 56, { mono: true, weight: 800, align: "center", color: C.goldInk }); }));
          fadeIn(ctx, ap(l, tT - 0.3), () => text(ctx, "tinggal 3 kemungkinan", 960, 640, 40, { weight: 800, align: "center", color: C.red }));
          return;
        }
        // sisa: pohon keputusan
        const tC1 = at(b, "Cek", 1), tK1 = at(b, "Kalau", 1), tK2 = at(b, "Kalau", 2), tC2 = at(b, "cek", 2), tTot = at(b, "Totalnya");
        const node = (s, x, y, col, u) => fadeIn(ctx, u, () => chip(ctx, s, x, y, { size: 34, color: col, stroke: col, center: true }));
        node("uji ke-4: cek telur 7", 600, 400, C.ink, ap(l, tC1 - 0.3));
        fadeIn(ctx, ap(l, tK1 - 0.3), () => { arrow(ctx, 520, 460, 330, 560, { u: 1, color: C.green, lw: 4, head: 14 }); text(ctx, "TIDAK ADA", 360, 510, 26, { mono: true, weight: 800, align: "right", color: C.green }); chip(ctx, "1 & 2", 300, 570, { size: 40, color: C.white, fill: C.gold, stroke: C.goldRim, center: true }); });
        fadeIn(ctx, ap(l, tK2 - 0.3), () => { arrow(ctx, 700, 460, 900, 560, { u: 1, color: C.red, lw: 4, head: 14 }); text(ctx, "TERDETEKSI", 840, 510, 26, { mono: true, weight: 800, color: C.red }); });
        node("uji ke-5: cek telur 1", 1000, 570, C.ink, ap(l, tC2 - 0.3));
        fadeIn(ctx, ap(l, tC2 + 0.4), () => {
          arrow(ctx, 920, 630, 800, 690, { u: 1, color: C.red, lw: 4, head: 14 }); chip(ctx, "1 & 7", 720, 680, { size: 36, color: C.white, fill: C.gold, stroke: C.goldRim, center: true });
          arrow(ctx, 1080, 630, 1200, 690, { u: 1, color: C.green, lw: 4, head: 14 }); chip(ctx, "2 & 7", 1290, 680, { size: 36, color: C.white, fill: C.gold, stroke: C.goldRim, center: true });
        });
        fadeIn(ctx, ap(l, tTot - 0.3), () => chip(ctx, "3 + 2 = 5 kali", 1560, 420, { size: 44, color: C.white, fill: C.ink, stroke: C.ink, center: true }));
        return;
      }
      if (m === "jawab") {
        const tL = at(b, "lima"), tE = at(b, "empat"), tJ = at(b, "Jawaban");
        fadeIn(ctx, ap(l, tL - 0.3), () => { panel(ctx, 360, 150, 1200, 140, { stroke: C.green, lw: 4, fill: C.greenBg }); text(ctx, "5 kali: selalu cukup", 460, 240, 56, { weight: 800, color: C.green }); check(ctx, 1460, 220, 64, C.green, 1); });
        fadeIn(ctx, ap(l, tE - 0.3), () => { panel(ctx, 360, 320, 1200, 140, { stroke: C.red, lw: 4 }); text(ctx, "4 kali: pasti tidak cukup", 460, 410, 56, { weight: 800, color: C.red }); cross(ctx, 1460, 390, 50, C.red, 1); });
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: K = 5", 960, 520, { size: 60, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
    },

    kait_judul(ctx, b, l) {
      const tB = at(b, "batas");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "7 Telur, 2 Telur Emas", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1720 });
      text(ctx, "Berapa Kali Mesin Harus Dipakai?", 960, 400, 70, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2025 · SMA · No. 10 · Dua dari Tujuh Telur Bebek", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tB - 0.3), () => chip(ctx, "batas bawah + strategi", 960, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
    },
    konsep_kelompok(ctx, b, l) {
      const tP = at(b, "pengujian"), tS = at(b, "sekaligus"), tM = at(b, "memperkecil");
      heading(ctx, "// KONSEP", "Pengujian kelompok", ap(l, tP - 0.3), 130);
      fadeIn(ctx, ap(l, tS - 0.3), () => {
        for (let i = 0; i < 6; i++) egg(ctx, 260 + i * 110, 380, 40, "");
        arrow(ctx, 900, 380, 1060, 380, { u: ap(l, tS), color: C.ink, lw: 5, head: 18 });
        mesin(ctx, 1090, 270, 600, 220, { res: "ada" });
        text(ctx, "banyak benda, satu kali uji", 580, 500, 34, { weight: 800, align: "center", color: C.mut });
      });
      fadeIn(ctx, ap(l, tM - 0.3), () => chip(ctx, "jawabannya mempersempit kemungkinan", 960, 600, { size: 40, color: C.white, fill: C.green, stroke: C.green, center: true }));
    },
    konsep_batas(ctx, b, l) {
      const tB = at(b, "batas"), tN = at(b, "N"), tK = at(b, "pangkat"), tC = at(b, "biner");
      heading(ctx, "// KONSEP", "Batas bawah: 2ᵏ ≥ N", ap(l, tB - 0.3), 130);
      const V = [2, 4, 8, 16, 32];
      V.forEach((v, i) => fadeIn(ctx, ap(l, tK - 0.3 + i * 0.25), () => {
        const x = 260 + i * 300, h = v * 9;
        rr(ctx, x, 600 - h, 160, h, 10); ctx.fillStyle = v >= 21 ? C.greenBg : "#FFF6DA"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = v >= 21 ? C.green : C.goldRim; ctx.stroke();
        text(ctx, String(v), x + 80, 590 - h, 40, { mono: true, weight: 800, align: "center", color: v >= 21 ? C.green : C.goldInk });
        text(ctx, "k = " + (i + 1), x + 80, 650, 32, { mono: true, weight: 800, align: "center", color: C.mut });
      }));
      fadeIn(ctx, ap(l, tN - 0.3), () => { const y = 600 - 21 * 9; ctx.save(); ctx.setLineDash([12, 9]); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(220, y); ctx.lineTo(1720, y); ctx.stroke(); ctx.restore(); text(ctx, "N = 21", 1730, y + 10, 32, { mono: true, weight: 800, color: C.red }); });
      fadeIn(ctx, ap(l, tC - 0.3), () => chip(ctx, "ide yang sama: pencarian biner", 960, 690, { size: 36, color: C.white, fill: C.ink, stroke: C.ink, center: true }));
    }
  });
})();
