/* ON11 Peta Internet Sekolah (OSN-K 2026 SMA no. 20–22): penguat sinyal di koridor, sinyal melemah 1 per ruang.
   Masalah cakupan: celah aman terbesar → banyak alat = pembagian. Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, panel, label, chip, arrow, check, cross, clamp, ap, at } = H;
  const { fadeIn, heading } = U;
  const GOLD_BG = "#FFF1C9";

  const sig = (amps, r) => amps.reduce((s, a) => s + Math.max(0, a.y - Math.abs(r - a.x)) * (a.a === undefined ? 1 : a.a), 0);
  const S20 = [{ x: 3, y: 6, n: "A" }, { x: 7, y: 5, n: "B" }, { x: 13, y: 7, n: "C" }, { x: 16, y: 5, n: "D" }];
  const NEW = (x, a = 1) => ({ x, y: 4, n: "+", a, fill: C.purpleBg, stroke: C.purple, col: C.purple });

  /* ikon wifi: (x, y) = titik bawah, s = tinggi */
  function wifi(ctx, x, y, s, col = C.purple, alpha = 1) {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * 0.13; ctx.lineCap = "round";
    for (const k of [0.42, 0.71, 1.0]) { ctx.beginPath(); ctx.arc(x, y, s * k, -Math.PI * 0.77, -Math.PI * 0.23); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y, s * 0.13, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function bracket(ctx, x1, x2, y, s, o = {}) {   // kurung datar dengan label di atas (o.down: label di bawah)
    const col = o.color || C.ink, d = o.down ? -1 : 1;
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha); ctx.strokeStyle = col; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x1, y + 14 * d); ctx.lineTo(x1, y); ctx.lineTo(x2, y); ctx.lineTo(x2, y + 14 * d); ctx.stroke(); ctx.restore();
    if (s) fadeIn(ctx, o.alpha === undefined ? 1 : o.alpha, () => text(ctx, s, (x1 + x2) / 2, o.down ? y + 46 : y - 14, o.size || 34, { mono: true, weight: 800, align: "center", color: col }));
  }
  /* koridor: o = {N|rooms, x0, cw, base, unit, amps, P, pA, judge, val, grow(r), ghost, icons, cellA, lbl(r)} */
  function corr(ctx, o) {
    const rooms = o.rooms || Array.from({ length: o.N }, (_, i) => i + 1), { x0, cw, base, unit } = o, amps = o.amps || [];
    const pad = Math.max(4, cw * 0.1), cellA = o.cellA === undefined ? 1 : o.cellA, J = o.judge || 0;
    rooms.forEach((r, i) => {
      const x = x0 + i * cw, cx = x + cw / 2, g = o.grow ? o.grow(r) : 1;
      const tot = sig(amps, r), ok = o.P !== undefined && tot >= o.P - 1e-6;
      // sel ruang
      fadeIn(ctx, cellA, () => {
        rr(ctx, x + 3, base + 10, cw - 6, o.cellH || 56, 8); ctx.fillStyle = J > 0 && ok ? C.greenBg : C.panel; ctx.fill();
        ctx.lineWidth = J > 0 && ok ? 3 : 2; ctx.strokeStyle = J > 0 && ok ? C.green : C.line; ctx.stroke();
        text(ctx, o.lbl ? o.lbl(r) : String(r), cx, base + 10 + (o.cellH || 56) * 0.68, Math.min(28, cw * 0.42), { mono: true, weight: 800, align: "center", color: J > 0 && ok ? C.green : C.mut });
      });
      if (g <= 0) return;
      // batang bertumpuk per penguat
      let yy = base;
      amps.forEach(a => {
        const v = Math.max(0, a.y - Math.abs(r - a.x)) * (a.a === undefined ? 1 : a.a); if (v <= 0) return;
        const h = v * unit * g; rr(ctx, x + pad, yy - h, cw - 2 * pad, h, Math.min(6, h / 2)); ctx.fillStyle = a.fill || GOLD_BG; ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = a.stroke || C.goldRim; ctx.stroke(); yy -= h;
      });
      if (J > 0 && ok && tot > 0) { ctx.save(); ctx.globalAlpha *= J; rr(ctx, x + pad - 2, base - tot * unit * g - 2, cw - 2 * pad + 4, tot * unit * g + 2, 7); ctx.lineWidth = 5; ctx.strokeStyle = C.green; ctx.stroke(); ctx.restore(); }
      if (o.ghost && o.P !== undefined && !ok && tot > 0) {
        fadeIn(ctx, o.ghost(r), () => {
          ctx.save(); ctx.setLineDash([7, 6]); ctx.lineWidth = 3; ctx.strokeStyle = C.red; rr(ctx, x + pad, base - o.P * unit, cw - 2 * pad, (o.P - tot) * unit, 4); ctx.stroke(); ctx.restore();
          text(ctx, "−" + Math.round(o.P - tot), cx, base - o.P * unit - 12, 26, { mono: true, weight: 800, align: "center", color: C.red });
        });
      }
      if (o.val && tot > 0) fadeIn(ctx, typeof o.val === "function" ? o.val(r) : 1, () => text(ctx, String(Math.round(tot)), cx, base - tot * unit * g - 12, Math.min(28, cw * 0.4), { mono: true, weight: 800, align: "center", color: J > 0.5 && ok ? C.green : C.ink }));
    });
    // garis P
    if (o.P !== undefined && (o.pA === undefined || o.pA > 0)) fadeIn(ctx, o.pA === undefined ? 1 : o.pA, () => {
      const y = base - o.P * unit, x2 = x0 + rooms.length * cw;
      ctx.save(); ctx.setLineDash([12, 9]); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(x0 - 10, y); ctx.lineTo(x2 + 10, y); ctx.stroke(); ctx.restore();
      text(ctx, o.pLbl || "P = " + o.P, x0 - 18, y + 10, 28, { mono: true, weight: 800, align: "right", color: C.red });
    });
    // ikon penguat di bawah sel
    if (o.icons !== false) amps.forEach(a => {
      const i = rooms.indexOf(a.x); if (i < 0) return; const al = a.ia === undefined ? (a.a === undefined ? 1 : Math.min(1, a.a * 2)) : a.ia; if (al <= 0) return;
      const cx = x0 + i * cw + cw / 2, yI = base + (o.cellH || 56) + 64;
      wifi(ctx, cx - 16, yI, 34, a.col || C.goldInk, al);
      fadeIn(ctx, al, () => text(ctx, String(a.y), cx + 14, yI - 4, 28, { mono: true, weight: 800, color: a.col || C.goldInk }));
    });
  }
  const layak = (amps, N, P) => { let c = 0; for (let r = 1; r <= N; r++) if (sig(amps, r) >= P) c++; return c; };
  function tent(ctx, cx, base, half, h, o = {}) {   // profil sinyal satu penguat (segitiga)
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    ctx.beginPath(); ctx.moveTo(cx - half, base); ctx.lineTo(cx, base - h); ctx.lineTo(cx + half, base); ctx.closePath();
    ctx.fillStyle = o.fill || "rgba(138,63,168,0.16)"; ctx.fill(); ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.stroke || C.purple; ctx.stroke(); ctx.restore();
  }
  function rowEq(ctx, s, res, ok, x, y, u) {
    fadeIn(ctx, u, () => {
      panel(ctx, x, y, 1240, 110, { stroke: ok ? C.green : C.red, lw: 3, fill: ok ? C.greenBg : C.panel });
      text(ctx, s, x + 40, y + 72, 46, { mono: true, weight: 800, fit: 900 });
      text(ctx, res, x + 1100, y + 72, 44, { mono: true, weight: 800, align: "right", color: ok ? C.green : C.red });
      if (ok) check(ctx, x + 1180, y + 55, 50, C.green, 1); else cross(ctx, x + 1180, y + 55, 40, C.red, 1);
    });
  }

  Kiko.ON11 = { wifi, corr, sig, S20, NEW, tent };

  const K18 = { N: 18, x0: 150, cw: 90, base: 580, unit: 36 };

  Object.assign(Kiko.SCENES, {
    koridor(ctx, b, l) {
      const m = b.mode;
      if (m === "kait") {
        const tK = at(b, "koridor"), tP = at(b, "penguat"), tM = at(b, "melemah"), tB = at(b, "baru"), tD = at(b, "daring");
        const tKu = at(b, "kuat"), gk = r => r === 6 ? ap(l, tKu - 0.3) : ap(l, tM + (Math.abs(r - 6) - 1) * 0.35);
        label(ctx, "// SEKOLAH BEBEK · SATU KORIDOR", 240, 140);
        const amp = { x: 6, y: 4, ia: ap(l, tP - 0.2) };
        corr(ctx, { N: 12, x0: 240, cw: 120, base: 560, unit: 50, amps: [amp], cellA: ap(l, tK - 0.4), grow: gk, val: gk });
        fadeIn(ctx, ap(l, tB - 0.3), () => {
          const u = (l - tB) * 0.35, xr = 2 + 9 * (0.5 - 0.5 * Math.cos(u * Math.PI)), cx = 240 + (xr - 0.5) * 120;
          wifi(ctx, cx, 250, 56, C.purple); text(ctx, "?", cx + 50, 220, 56, { disp: true, weight: 800, color: C.purple });
          chip(ctx, "penguat baru di mana?", 1680, 120, { size: 32, color: C.white, fill: C.purple, stroke: C.purple, center: true });
        });
        fadeIn(ctx, ap(l, tD - 0.3), () => chip(ctx, "kelas yang bisa belajar daring: sebanyak mungkin", 960, 30 + 660, { size: 30, color: C.green, stroke: C.green, center: true }));
        return;
      }
      if (m === "besar") {
        const tS = at(b, "seratus"), tB = at(b, "butuhkan"), tJ = at(b, "jarak");
        fadeIn(ctx, ap(l, tS - 0.4), () => text(ctx, "150 ruang kelas", 960, 210, 96, { disp: true, weight: 800, align: "center" }));
        const x0 = 135, cw = 11, y0 = 520, A = [5, 19, 33, 47, 61, 75, 89, 103, 117, 131, 145, 150];
        fadeIn(ctx, ap(l, tS - 0.2), () => { for (let r = 0; r < 150; r++) { ctx.fillStyle = r % 2 ? "#EFE6D0" : C.panel; ctx.fillRect(x0 + r * cw, y0, cw, 44); } ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.strokeRect(x0, y0, 150 * cw, 44); });
        A.forEach((a, k) => { const u = ap(l, tB + 0.1 + k * 0.12, 0.3); if (u <= 0) return; tent(ctx, x0 + (a - 0.5) * cw, y0, 9.5 * cw, 140, { alpha: u }); wifi(ctx, x0 + (a - 0.5) * cw, y0 - 150, 22, C.purple, u); });
        fadeIn(ctx, ap(l, tB - 0.3), () => chip(ctx, "berapa penguat?", 960, 270, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
        const xa = x0 + (47 - 0.5) * cw, xb = x0 + (61 - 0.5) * cw;
        bracket(ctx, xa, xb, 600, "", { alpha: ap(l, tJ - 0.2), color: C.red, down: true });
        fadeIn(ctx, ap(l, tJ - 0.2), () => text(ctx, "jarak terjauh antara dua penguat", (xa + xb) / 2, 670, 40, { weight: 800, align: "center", color: C.red }));
        return;
      }
      if (m === "ruang") {
        const tN = at(b, "N"), tKi = at(b, "kiri"), tKa = at(b, "kanan"), tP = at(b, "penguat");
        const L = ["1", "2", "3", "4", "5", "6", "7", "…", "N"], x0 = 240, cw = 160, y0 = 380;
        L.forEach((s, i) => fadeIn(ctx, ap(l, tN - 0.3 + i * 0.12), () => {
          const x = x0 + i * cw;
          if (s !== "…") { rr(ctx, x + 6, y0, cw - 12, 130, 12); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke(); }
          text(ctx, s, x + cw / 2, y0 + 88, 52, { mono: true, weight: 800, align: "center", color: s === "N" ? C.red : C.ink });
        }));
        fadeIn(ctx, ap(l, tN), () => { ctx.fillStyle = C.line; ctx.fillRect(x0, y0 + 150, 9 * cw, 8); text(ctx, "koridor", x0 + 4.5 * cw, y0 + 205, 32, { weight: 800, align: "center", color: C.mut }); });
        fadeIn(ctx, ap(l, tKi - 0.2), () => text(ctx, "paling kiri", x0 + cw / 2, y0 - 30, 32, { weight: 800, align: "center", color: C.green }));
        fadeIn(ctx, ap(l, tKa - 0.2), () => text(ctx, "paling kanan", x0 + 8.5 * cw, y0 - 30, 32, { weight: 800, align: "center", color: C.green }));
        [1, 4, 6].forEach((i, k) => wifi(ctx, x0 + i * cw + cw / 2, y0 - 110, 50, C.purple, ap(l, tP + k * 0.25)));
        fadeIn(ctx, ap(l, tP), () => text(ctx, "penguat sinyal internet", 960, 175, 34, { weight: 800, align: "center", color: C.purple }));
        return;
      }
      if (m === "aturan") {
        const tPo = at(b, "posisi"), tX = at(b, "X"), tY = at(b, "Y"), t1 = at(b, "satu"), t2 = at(b, "dua"), tN = at(b, "nol");
        fadeIn(ctx, ap(l, tPo - 0.3), () => { chip(ctx, "posisi X", 700, 110, { size: 36, color: C.ink, stroke: C.ink, center: true }); chip(ctx, "kekuatan Y", 1220, 110, { size: 36, color: C.purple, stroke: C.purple, center: true }); });
        const x0 = 195, cw = 170, base = 600, unit = 56, Yv = 5;
        const lb = d => d === 0 ? "X" : (d < 0 ? "X − " : "X + ") + Math.abs(d);
        const yl = d => d === 0 ? "Y" : Math.abs(d) <= 2 ? "Y − " + Math.abs(d) : "…";
        const tD = d => d === 0 ? tY : Math.abs(d) === 1 ? t1 : Math.abs(d) === 2 ? t2 : tN - 0.6;
        for (let d = -4; d <= 4; d++) {
          const x = x0 + (d + 4) * cw, cx = x + cw / 2;
          fadeIn(ctx, ap(l, tX - 0.3), () => {
            rr(ctx, x + 4, base + 10, cw - 8, 56, 8); ctx.fillStyle = d === 0 ? C.purpleBg : C.panel; ctx.fill(); ctx.lineWidth = d === 0 ? 3 : 2; ctx.strokeStyle = d === 0 ? C.purple : C.line; ctx.stroke();
            text(ctx, lb(d), cx, base + 48, 28, { mono: true, weight: 800, align: "center", color: d === 0 ? C.purple : C.mut });
          });
          const u = ap(l, tD(d) - 0.2), v = Yv - Math.abs(d); if (u <= 0) continue;
          const h = v * unit * u; rr(ctx, x + 24, base - h, cw - 48, h, 6); ctx.fillStyle = d === 0 ? C.purpleBg : GOLD_BG; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = d === 0 ? C.purple : C.goldRim; ctx.stroke();
          fadeIn(ctx, u, () => text(ctx, yl(d), cx, base - h - 14, 32, { mono: true, weight: 800, align: "center", color: d === 0 ? C.purple : C.ink }));
        }
        wifi(ctx, x0 + 4.5 * cw, base + 140, 40, C.purple, ap(l, tX - 0.2));
        fadeIn(ctx, ap(l, tN - 0.3), () => text(ctx, "melemah 1 per ruang, sampai 0", 1730, 235, 34, { weight: 800, align: "right", color: C.mut }));
        return;
      }
      if (m === "contoh" || m === "layak") {
        const c = m === "contoh", A1 = { x: 5, y: 4 }, A2 = { x: 8, y: 3, fill: C.purpleBg, stroke: C.purple, col: C.purple };
        let grow = () => 1, tJ = 0;
        if (c) {
          const ts = [at(b, "sinyal"), at(b, "tiga"), at(b, "dua"), at(b, "satu")]; A1.ia = ap(l, at(b, "empat") - 0.2);
          grow = r => { const d = Math.abs(r - 5); return d > 3 ? 1 : ap(l, ts[d] - 0.2); };
          A2.a = ap(l, at(b, "beberapa") - 0.2, 0.6);
        }
        const o = { N: 9, x0: 420, cw: 120, base: 560, unit: 64, amps: [A1, A2], grow, val: c ? (r => grow(r)) : 1 };
        if (!c) { const tL = at(b, "layak"), tP = at(b, "P"); o.P = 4; o.pA = ap(l, tP - 0.3); o.pLbl = "P = 4"; o.judge = ap(l, tP + 0.3); tJ = tL; }
        corr(ctx, o);
        if (c) fadeIn(ctx, A2.a, () => chip(ctx, "sinyal dijumlahkan", 1500, 120, { size: 32, color: C.purple, stroke: C.purple, center: true }));
        else fadeIn(ctx, ap(l, tJ - 0.3), () => chip(ctx, "layak jika total sinyal ≥ P", 960, 110, { size: 36, color: C.white, fill: C.green, stroke: C.green, center: true }));
        return;
      }
      if (m === "soal") {
        const s = b.soal, tQ = at(b, s === 20 ? "banyak" : s === 21 ? "sedikit" : "kecil");
        if (s === 20) {
          const tN = at(b, "delapan"), tT = at(b, "tabel"), tB = at(b, "berkekuatan"), tP = at(b, "P");
          fadeIn(ctx, ap(l, tT - 0.3), () => {
            panel(ctx, 150, 120, 760, 500, { stroke: C.green, lw: 3 });
            ["Penguat", "Ruang", "Kekuatan"].forEach((h, i) => text(ctx, h, 260 + i * 240, 190, 32, { weight: 800, align: "center", color: C.green }));
            ctx.fillStyle = C.line; ctx.fillRect(180, 215, 700, 3);
            S20.forEach((a, k) => [a.n, a.x, a.y].forEach((v, i) => fadeIn(ctx, ap(l, tT + k * 0.2), () => text(ctx, String(v), 260 + i * 240, 290 + k * 90, 48, { mono: true, weight: 800, align: "center", color: i === 0 ? C.goldInk : C.ink }))));
          });
          fadeIn(ctx, ap(l, tN - 0.3), () => { panel(ctx, 980, 120, 790, 130, { stroke: C.ink, lw: 3 }); text(ctx, "N = 18 ruang", 1375, 205, 54, { mono: true, weight: 800, align: "center" }); });
          fadeIn(ctx, ap(l, tB - 0.3), () => { panel(ctx, 980, 280, 790, 190, { stroke: C.purple, lw: 3, fill: "#FBF6FC" }); wifi(ctx, 1070, 410, 64, C.purple); text(ctx, "+1 penguat baru", 1150, 350, 44, { weight: 800, color: C.purple }); text(ctx, "kekuatan 4, di ruang mana pun", 1150, 420, 34, { weight: 700, color: C.purple, fit: 590 }); });
          fadeIn(ctx, ap(l, tP - 0.3), () => { panel(ctx, 980, 500, 790, 120, { stroke: C.red, lw: 3 }); text(ctx, "P = 8", 1375, 580, 56, { mono: true, weight: 800, align: "center", color: C.red }); });
          fadeIn(ctx, ap(l, tQ - 0.3), () => chip(ctx, "Paling banyak berapa ruang yang layak?", 960, 650, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
          return;
        }
        const tN = at(b, "seratus"), tB = s === 21 ? at(b, "sepuluh") : at(b, "empat"), tP = at(b, "P");
        fadeIn(ctx, ap(l, tN - 0.3), () => { panel(ctx, 260, 130, 1400, 150, { stroke: C.ink, lw: 3 }); text(ctx, s === 21 ? "N = 150 ruang · belum ada penguat" : "N = 150 ruang", 960, 228, 58, { mono: true, weight: 800, align: "center", fit: 1320 }); });
        fadeIn(ctx, ap(l, tB - 0.3), () => {
          panel(ctx, 260, 310, 900, 170, { stroke: C.purple, lw: 3, fill: "#FBF6FC" }); wifi(ctx, 360, 440, 70, C.purple);
          text(ctx, s === 21 ? "semua kekuatan 10" : "hanya 4 penguat", 450, 380, 48, { weight: 800, color: C.purple, fit: 680 });
          text(ctx, s === 21 ? "banyaknya bebas" : "kekuatan sama: Y", 450, 445, 38, { weight: 700, color: C.purple, fit: 680 });
        });
        fadeIn(ctx, ap(l, tP - 0.3), () => { panel(ctx, 1200, 310, 460, 170, { stroke: C.red, lw: 3 }); text(ctx, "P = 6", 1430, 420, 64, { mono: true, weight: 800, align: "center", color: C.red }); });
        fadeIn(ctx, ap(l, tQ - 0.3), () => { panel(ctx, 260, 520, 1400, 140, { stroke: C.red, lw: 4 }); text(ctx, s === 21 ? "Paling sedikit berapa penguat?" : "Kekuatan Y paling kecil berapa?", 960, 612, 56, { weight: 800, align: "center", color: C.red, fit: 1320 }); text(ctx, "semua ruang harus layak", 960, 710, 32, { weight: 800, align: "center", color: C.mut }); });
        return;
      }
      // ---------- soal 20 ----------
      if (m === "awal20") {
        const tH = at(b, "hitung"), tL = at(b, "lima");
        const amps = S20.map(a => ({ ...a }));
        corr(ctx, { ...K18, amps, P: 8, pA: ap(l, tH), grow: r => ap(l, tH - 0.2 + r * 0.08), val: r => ap(l, tH + r * 0.08), judge: ap(l, tL - 0.2) });
        fadeIn(ctx, ap(l, tL - 0.2), () => chip(ctx, "layak: 5 ruang", 1640, 100, { size: 34, color: C.white, fill: C.green, stroke: C.green, px: 18, center: true }) );
        return;
      }
      if (m === "kurang20") {
        const tE = at(b, "empat"), tR = at(b, "enam");
        corr(ctx, { ...K18, amps: S20, P: 8, judge: 1, val: 1, ghost: r => r >= 6 && r <= 12 ? ap(l, tR - 0.2 + (r - 6) * 0.15) : 0 });
        fadeIn(ctx, ap(l, tE - 0.3), () => {
          panel(ctx, 150, 100, 480, 150, { stroke: C.purple, lw: 3, fill: "#FBF6FC" });
          [1, 2, 3, 4, 3, 2, 1].forEach((v, i) => { rr(ctx, 175 + i * 44, 225 - v * 24, 36, v * 24, 4); ctx.fillStyle = C.purpleBg; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.purple; ctx.stroke(); });
          text(ctx, "penguat baru", 500, 170, 28, { weight: 800, align: "center", color: C.purple }); text(ctx, "4 3 2 1", 500, 215, 28, { mono: true, weight: 800, align: "center", color: C.purple });
        });
        fadeIn(ctx, ap(l, tR - 0.2), () => chip(ctx, "kurang 1 atau 2", 960 - 25, 100, { size: 32, color: C.red, stroke: C.red, center: true }));
        return;
      }
      if (m === "pasang20" || m === "jawab20") {
        const p = m === "pasang20";
        let x = 9, tE = 0;
        if (p) {
          const tC = at(b, "coba"), t9 = at(b, "sembilan"); tE = at(b, "enam");
          x = l < t9 - 0.2 ? clamp(1 + Math.floor((l - tC) / Math.max(0.2, (t9 - 0.2 - tC)) * 18), 1, 18) : 9;
        }
        const amps = [...S20, NEW(x)];
        corr(ctx, { ...K18, amps, P: 8, judge: 1, val: 1 });
        const n = layak(amps, 18, 8);
        chip(ctx, "layak: " + n + " ruang", 1640, 100, { size: 34, color: C.white, fill: n === 11 ? C.green : C.mut, stroke: n === 11 ? C.green : C.mut, px: 18, center: true });
        const NR = [6, 8, 9, 10, 11, 12];
        if (p) NR.forEach((r, k) => { const u = ap(l, tE + k * 0.3); if (u > 0) check(ctx, K18.x0 + (r - 0.5) * K18.cw, 140, 40, C.purple, u); });
        else {
          NR.forEach(r => check(ctx, K18.x0 + (r - 0.5) * K18.cw, 140, 40, C.purple, 1));
          const tL = at(b, "lima"), tJ = at(b, "Jawaban");
          fadeIn(ctx, ap(l, tL - 0.3), () => chip(ctx, "5 + 6 = 11", 330, 120, { size: 44, color: C.ink, stroke: C.ink, center: true }));
          fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: 11", 330, 200, { size: 48, color: C.white, fill: C.red, stroke: C.red, center: true }));
        }
        return;
      }
      // ---------- soal 21 ----------
      if (m === "ujung") {
        const tS = at(b, "sepuluh"), tK = at(b, "karena"), tU = at(b, "ujung");
        const g = r => ap(l, tS - 0.2 + Math.abs(r - 5) * 0.12);
        corr(ctx, { N: 12, x0: 240, cw: 120, base: 580, unit: 34, amps: [{ x: 5, y: 10 }], P: 6, pA: ap(l, tK - 0.3), judge: ap(l, tK), grow: g, val: g });
        fadeIn(ctx, ap(l, tK - 0.2), () => chip(ctx, "10 − 4 = 6", 1500, 120, { size: 44, color: C.red, stroke: C.red, center: true }));
        bracket(ctx, 240 + 60, 240 + 4 * 120 + 60, 160, "jarak 4", { alpha: ap(l, tU - 0.3), color: C.green });
        return;
      }
      if (m === "celah") {
        const t14 = at(b, "empat"), t7 = at(b, "tujuh"), t6 = at(b, "enam"), t15 = at(b, "lima", 1), t5 = at(b, "lima", 2);
        const mv = ap(l, t15 - 0.2, 0.8), xr = 14 + mv;     // penguat kanan bergeser 14 → 15
        const rooms = Array.from({ length: 16 }, (_, i) => i);
        const A = { x: 0, y: 10, ia: 1 }, B = { x: Math.round(xr), y: 10, fill: C.purpleBg, stroke: C.purple, col: C.purple };
        const x0 = 160, cw = 100;
        corr(ctx, { rooms, x0, cw, base: 600, unit: 32, amps: [A, B], P: 6, judge: ap(l, t14), val: 1, grow: r => ap(l, 0.3 + r * 0.05) });
        bracket(ctx, x0 + cw / 2, x0 + (B.x + 0.5) * cw, 160, "jarak " + B.x, { alpha: ap(l, t14 - 0.2), color: B.x === 14 ? C.green : C.red });
        const mid = B.x === 14 ? [7] : [7, 8];
        fadeIn(ctx, ap(l, t7 - 0.2) * (1 - mv), () => chip(ctx, "3 + 3 = 6", x0 + 7.5 * cw, 230, { size: 34, color: C.green, stroke: C.green, center: true }));
        fadeIn(ctx, ap(l, t6 - 0.2) * (1 - mv), () => chip(ctx, "masih cukup", 1650, 230, { size: 32, color: C.white, fill: C.green, stroke: C.green, center: true }));
        fadeIn(ctx, ap(l, t5 - 0.2), () => { chip(ctx, "3 + 2 = 5", x0 + 8 * cw, 230, { size: 34, color: C.red, stroke: C.red, center: true }); mid.forEach(r => cross(ctx, x0 + (r + 0.5) * cw, 330, 34, C.red, 1)); });
        return;
      }
      if (m === "rantai" || m === "jawab21") {
        const r = m === "rantai";
        const x0 = 115, cw = 26, base = 470, AM = [5, 19, 33, 47, 61];
        const tL = r ? at(b, "lima") : 0, tB = r ? at(b, "berikutnya") : 0, tK = r ? at(b, "k") : 0;
        if (r) {
          for (let i = 0; i < 65; i++) { ctx.fillStyle = i % 2 ? "#EFE6D0" : C.panel; ctx.fillRect(x0 + i * cw, base, cw, 40); }
          ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.strokeRect(x0, base, 65 * cw, 40);
          ctx.save(); ctx.setLineDash([12, 9]); ctx.lineWidth = 3; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(x0, base - 6 * 22); ctx.lineTo(x0 + 65 * cw, base - 6 * 22); ctx.stroke(); ctx.restore();
          chip(ctx, "P = 6", 1690, 300, { size: 28, color: C.red, stroke: C.red });
          AM.forEach((a, k) => {
            const u = ap(l, (k === 0 ? tL : tB + (k - 1) * 0.5) - 0.2); if (u <= 0) return; const cx = x0 + (a - 0.5) * cw;
            tent(ctx, cx, base, 10 * cw, 220, { alpha: u }); wifi(ctx, cx, base + 100, 30, C.purple, u);
            fadeIn(ctx, u, () => text(ctx, String(a), cx, base + 140, 30, { mono: true, weight: 800, align: "center", color: C.purple }));
          });
          bracket(ctx, x0 + cw / 2, x0 + 4.5 * cw, 200, "4", { alpha: ap(l, tL), color: C.green, size: 30 });
          for (let k = 1; k < 5; k++) bracket(ctx, x0 + (AM[k - 1] - 0.5) * cw, x0 + (AM[k] - 0.5) * cw, 200, "14", { alpha: ap(l, tB + (k - 1) * 0.5), color: C.green, size: 30 });
          fadeIn(ctx, ap(l, tK - 0.3), () => chip(ctx, "k penguat → sampai ruang 14k − 5", 960, 690, { size: 40, color: C.white, fill: C.green, stroke: C.green, center: true }));
          return;
        }
        const t11 = at(b, "Sebelas"), t12 = at(b, "Dua"), tJ = at(b, "Jawaban");
        text(ctx, "k penguat → sampai ruang 14k − 5", 960, 170, 48, { mono: true, weight: 800, align: "center", color: C.green });
        rowEq(ctx, "k = 11:  14·11 − 5 = 149", "< 150", false, 340, 240, ap(l, t11 - 0.3));
        rowEq(ctx, "k = 12:  14·12 − 5 = 163", "≥ 150", true, 340, 380, ap(l, t12 - 0.3));
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: 12", 960, 560, { size: 56, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
      // ---------- soal 22 ----------
      if (m === "umum") {
        const tU = at(b, "ujung"), tA = at(b, "antara"), tJ = at(b, "jaraknya");
        fadeIn(ctx, ap(l, tU - 0.3), () => {
          label(ctx, "// DI UJUNG", 160, 150);
          ctx.fillStyle = C.ink; ctx.fillRect(160, 230, 10, 330);
          const base = 560, cx = 480; ctx.fillStyle = C.line; ctx.fillRect(170, base, 690, 6);
          ctx.save(); ctx.beginPath(); ctx.rect(170, 0, 690, 1080); ctx.clip(); tent(ctx, cx, base, 300, 300, {}); ctx.restore();
          ctx.save(); ctx.setLineDash([10, 8]); ctx.lineWidth = 3; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(170, base - 180); ctx.lineTo(860, base - 180); ctx.stroke(); ctx.restore();
          text(ctx, "6", 868, base - 170, 28, { mono: true, weight: 800, color: C.red });
          wifi(ctx, cx, base + 70, 34, C.purple);
          bracket(ctx, 172, cx, 650, "Y − 6", { down: true, color: C.green, size: 38 });
        });
        fadeIn(ctx, ap(l, tA - 0.3), () => {
          label(ctx, "// DI ANTARA DUA PENGUAT", 960, 150);
          const base = 560, a = 1130, c = 1630, m2 = (a + c) / 2; ctx.fillStyle = C.line; ctx.fillRect(960, base, 840, 6);
          ctx.save(); ctx.beginPath(); ctx.rect(960, 0, 840, 1080); ctx.clip(); tent(ctx, a, base, 300, 300, {}); tent(ctx, c, base, 300, 300, {}); ctx.restore();
          wifi(ctx, a, base + 70, 34, C.purple); wifi(ctx, c, base + 70, 34, C.purple);
          fadeIn(ctx, ap(l, tA + 0.6), () => { text(ctx, "3 + 3", m2, base - 110, 34, { mono: true, weight: 800, align: "center", color: C.ink }); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(m2, base - 86, 8, 0, 7); ctx.fill(); });
          bracket(ctx, a, c, 650, "2Y − 6", { down: true, color: C.green, size: 38, alpha: ap(l, tJ - 0.3) });
        });
        return;
      }
      if (m === "rumus22") {
        const tU = at(b, "ujung"), tC = at(b, "celah"), tS = at(b, "satu"), tH = at(b, "Hasilnya");
        const base = 430, P = [380, 760, 1140, 1520], x0 = 150, x1 = 1770;
        ctx.fillStyle = C.line; ctx.fillRect(x0, base, x1 - x0, 8);
        text(ctx, "ruang 1", x0, base + 50, 26, { mono: true, weight: 800, color: C.mut }); text(ctx, "ruang 150", x1, base + 50, 26, { mono: true, weight: 800, align: "right", color: C.mut });
        P.forEach(x => { tent(ctx, x, base, 230, 200, {}); wifi(ctx, x, base - 215, 30, C.purple); });
        const segs = [[x0, P[0], "Y − 6", tU], [P[0], P[1], "2Y − 6", tC], [P[1], P[2], "2Y − 6", tC + 0.3], [P[2], P[3], "2Y − 6", tC + 0.6], [P[3], x1, "Y − 6", tU + 0.4]];
        segs.forEach(([a, c, s, t]) => bracket(ctx, a + 4, c - 4, base + 80, s, { down: true, alpha: ap(l, t - 0.2), color: [x0, P[3]].includes(a) ? C.green : C.purple, size: 32 }));
        fadeIn(ctx, ap(l, tS - 0.2), () => chip(ctx, "+1", P[0], base - 320, { size: 34, color: C.white, fill: C.red, stroke: C.red, center: true }));
        fadeIn(ctx, ap(l, tH - 0.3), () => { panel(ctx, 260, 620, 1400, 110, { stroke: C.red, lw: 4 }); text(ctx, "2(Y − 6) + 3(2Y − 6) + 1 = 8Y − 29", 960, 694, 50, { mono: true, weight: 800, align: "center", color: C.red, fit: 1340 }); });
        return;
      }
      if (m === "jawab22") {
        const tB = at(b, "butuh"), t22 = at(b, "Untuk", 1), t23 = at(b, "Untuk", 2), tJ = at(b, "Jawaban");
        fadeIn(ctx, ap(l, tB - 0.3), () => text(ctx, "8Y − 29 ≥ 150", 960, 180, 64, { mono: true, weight: 800, align: "center", color: C.red }));
        rowEq(ctx, "Y = 22:  8·22 − 29 = 147", "< 150", false, 340, 240, ap(l, t22 - 0.3));
        rowEq(ctx, "Y = 23:  8·23 − 29 = 155", "≥ 150", true, 340, 380, ap(l, t23 - 0.3));
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: 23", 960, 560, { size: 56, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
    },

    kait_judul(ctx, b, l) {
      const tA = at(b, "alat");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "150 Ruang Kelas, Berapa Penguat Sinyal?", 960, 300, 78, { disp: true, weight: 800, align: "center", fit: 1720 });
      text(ctx, "Hitung Tanpa Mencoba Satu per Satu", 960, 400, 70, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2026 · SMA · No. 20, 21, 22 · Peta Internet Sekolah", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tA - 0.3), () => chip(ctx, "masalah cakupan", 960, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
    },
    konsep_cakupan(ctx, b, l) {
      const tC = at(b, "cakupan"), ts = [at(b, "wifi"), at(b, "lampu"), at(b, "menara")];
      heading(ctx, "// KONSEP", "Masalah cakupan", ap(l, tC - 0.3), 130);
      fadeIn(ctx, ap(l, tC + 0.4), () => text(ctx, "tutupi seluruh area dengan alat sesedikit mungkin", 960, 275, 42, { weight: 800, align: "center", color: C.mut }));
      ["wifi", "lampu jalan", "menara pemancar"].forEach((s, i) => fadeIn(ctx, ap(l, ts[i] - 0.3), () => {
        const cx = 420 + i * 540, base = 660;
        ctx.save(); ctx.beginPath(); ctx.moveTo(cx - 200, base); ctx.lineTo(cx, base - 260); ctx.lineTo(cx + 200, base); ctx.closePath(); ctx.fillStyle = "rgba(232,197,90,0.25)"; ctx.fill(); ctx.restore();
        if (i === 0) wifi(ctx, cx, base - 240, 90, C.purple);
        if (i === 1) { ctx.fillStyle = C.ink; ctx.fillRect(cx - 6, base - 300, 12, 300); ctx.fillRect(cx - 6, base - 300, 70, 12); ctx.beginPath(); ctx.arc(cx + 64, base - 284, 22, 0, Math.PI); ctx.fillStyle = C.gold; ctx.fill(); ctx.strokeStyle = C.goldRim; ctx.lineWidth = 3; ctx.stroke(); }
        if (i === 2) { ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx - 60, base); ctx.lineTo(cx, base - 300); ctx.lineTo(cx + 60, base); ctx.moveTo(cx - 40, base - 100); ctx.lineTo(cx + 40, base - 100); ctx.moveTo(cx - 25, base - 180); ctx.lineTo(cx + 25, base - 180); ctx.stroke(); wifi(ctx, cx, base - 300, 50, C.red); }
        ctx.fillStyle = C.line; ctx.fillRect(cx - 230, base, 460, 6);
        text(ctx, s, cx, base + 60, 38, { weight: 800, align: "center" });
      }));
    },
    konsep_celah(ctx, b, l) {
      const tC = at(b, "celah"), tD = at(b, "pembagian");
      heading(ctx, "// KONSEP", "Cari celah aman terbesar", ap(l, tC - 0.3), 130);
      const base = 540, P = [300, 700, 1100, 1500];
      fadeIn(ctx, ap(l, tC), () => {
        ctx.fillStyle = C.line; ctx.fillRect(150, base, 1620, 8);
        P.forEach(x => { tent(ctx, x, base, 240, 200, {}); wifi(ctx, x, base + 70, 30, C.purple); });
        bracket(ctx, P[1], P[2], 300, "celah terbesar", { color: C.green, size: 34 });
      });
      fadeIn(ctx, ap(l, tD - 0.3), () => { panel(ctx, 360, 640, 1200, 110, { stroke: C.red, lw: 4 }); text(ctx, "banyak alat ≈ panjang ÷ celah", 960, 714, 52, { mono: true, weight: 800, align: "center", color: C.red, fit: 1140 }); });
    },
    konsep_rakus(ctx, b, l) {
      const tR = at(b, "rakus"), tP = at(b, "pertama"), tB = at(b, "berikutnya");
      heading(ctx, "// KONSEP", "Cara rakus (greedy)", ap(l, tR - 0.3), 130);
      const base = 560, x0 = 150, P = [370, 810, 1250, 1690];
      ctx.fillStyle = C.line; ctx.fillRect(x0, base, 1620, 8);
      ctx.fillStyle = C.ink; ctx.fillRect(x0 - 10, base - 200, 10, 210);
      P.forEach((x, k) => {
        const u = ap(l, (k === 0 ? tP : tB + (k - 1) * 0.6) - 0.2, 0.5); if (u <= 0) return;
        const xs = k === 0 ? x0 : P[k - 1], cx = xs + (x - xs) * u;
        tent(ctx, cx, base, 220, 190, { alpha: 1 }); wifi(ctx, cx, base + 70, 30, C.purple);
        if (u >= 1) arrow(ctx, xs + 20, base - 240, x - 20, base - 240, { u: 1, color: C.green, lw: 4, head: 16 });
      });
      fadeIn(ctx, ap(l, tP), () => text(ctx, "sejauh mungkin, selama masih aman", 960, 720, 42, { weight: 800, align: "center", color: C.green }));
    }
  });
})();
