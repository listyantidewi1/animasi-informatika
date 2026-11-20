/* ON09 Kartu Huruf Ajaib (OSN-K 2025 SMA no. 20–22): fungsi pada 26 huruf, ekor + siklus, sisa bagi KPK panjang siklus.
   Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, panel, chip, check, arrow, clamp, ap, at } = H;
  const { fadeIn, heading } = U;

  const AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const F = {}; "BCBCFHFIFEENLMPTPQQUVWXTWV".split("").forEach((c, i) => F[AB[i]] = c);
  const step = (c, k) => { for (let i = 0; i < k; i++) c = F[c]; return c; };
  const CYC = [["B", "C"], ["F", "H", "I"], ["L", "N", "M"], ["T", "U", "V", "W", "X"]];
  const CCOL = [C.purple, C.green, C.goldRim, C.red];
  const CBG = [C.purpleBg, C.greenBg, C.gold2, C.redBg];
  const cycOf = {}; CYC.forEach((cy, k) => cy.forEach(c => cycOf[c] = k));

  /* kartu: x,y = kiri atas */
  function kartu(ctx, x, y, ch, o = {}) {
    const w = o.w || 110, h = o.h || 140, fl = o.flip === undefined ? 1 : clamp(o.flip, 0, 1);
    const sx = Math.abs(Math.cos(Math.PI * fl)), show = fl < 0.5 && o.from !== undefined ? o.from : ch;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(Math.max(sx, 0.02), 1); ctx.globalAlpha *= o.alpha === undefined ? 1 : o.alpha;
    ctx.fillStyle = "rgba(60,45,10,0.12)"; rr(ctx, -w / 2 + 5, -h / 2 + 7, w, h, 14); ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = o.fill || C.panel; ctx.fill();
    ctx.lineWidth = o.hl ? 6 : 3; ctx.strokeStyle = o.hl || C.line; ctx.stroke();
    text(ctx, show, 0, h * 0.2, o.size || Math.round(h * 0.5), { mono: true, weight: 800, align: "center", color: o.color || C.ink });
    ctx.restore();
    if (o.num !== undefined) text(ctx, String(o.num), x + w / 2, y + h + 30, 24, { mono: true, weight: 700, align: "center", color: o.numColor || C.mut });
  }
  /* 26 kartu dalam dua baris; letters(i) -> huruf; opt(i) -> opsi tambahan */
  function deret(ctx, letters, y0, opt = () => ({}), o = {}) {
    const w = o.w || 110, h = o.h || 140, gap = o.gap || 18, x0 = (1920 - (13 * w + 12 * gap)) / 2;
    for (let i = 0; i < 26; i++) {
      const r = Math.floor(i / 13), c = i % 13, ex = opt(i);
      if (ex.hide) continue;
      kartu(ctx, x0 + c * (w + gap), y0 + r * (h + (o.rowGap || 70)), letters(i), Object.assign({ w, h, num: o.nums ? i + 1 : undefined }, ex));
    }
    return i => ({ x: x0 + (i % 13) * (w + gap), y: y0 + Math.floor(i / 13) * (h + (o.rowGap || 70)), w, h });
  }
  /* tabel aturan: dua blok 13 kolom; baris atas = huruf, baris bawah = hasil */
  function tabelAturan(ctx, y0, o = {}) {
    const cw = o.cw || 104, ch = o.ch || 66, x0 = (1920 - 13 * cw) / 2 + 60, row2 = o.row2 || ((c) => F[c]);
    for (let blk = 0; blk < 2; blk++) {
      const y = y0 + blk * (2 * ch + (o.blkGap || 40));
      fadeIn(ctx, o.u === undefined ? 1 : o.u, () => {
        text(ctx, o.lab1 || "sebelum", x0 - 24, y + ch * 0.64, 26, { weight: 800, align: "right", color: C.mut });
        text(ctx, o.lab2 || "menjadi", x0 - 24, y + ch * 1.64, 26, { weight: 800, align: "right", color: C.green });
        for (let c = 0; c < 13; c++) {
          const L = AB[blk * 13 + c], x = x0 + c * cw, ex = o.cell ? o.cell(L) : {};
          rr(ctx, x, y, cw, ch, 0); ctx.fillStyle = ex.top || "#EFE7D3"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke();
          rr(ctx, x, y + ch, cw, ch, 0); ctx.fillStyle = ex.bot || C.panel; ctx.fill(); ctx.stroke();
          text(ctx, L, x + cw / 2, y + ch * 0.7, 36, { mono: true, weight: 800, align: "center", color: ex.topColor || C.ink });
          text(ctx, row2(L), x + cw / 2, y + ch * 1.7, 36, { mono: true, weight: 800, align: "center", color: ex.botColor || C.green });
          if (ex.ring) { ctx.save(); ctx.globalAlpha *= ex.ring; ctx.lineWidth = 6; ctx.strokeStyle = ex.ringColor || C.red; rr(ctx, x + 3, y + 3, cw - 6, 2 * ch - 6, 10); ctx.stroke(); ctx.restore(); }
        }
      });
    }
    return L => { const i = AB.indexOf(L), blk = Math.floor(i / 13), c = i % 13; return { x: x0 + c * cw, y: y0 + blk * (2 * ch + (o.blkGap || 40)), w: cw, h: 2 * ch }; };
  }
  /* simpul huruf */
  function simpul(ctx, x, y, L, o = {}) {
    const r = o.r || 34; ctx.save(); ctx.globalAlpha *= o.alpha === undefined ? 1 : o.alpha;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = o.fill || C.panel; ctx.fill();
    ctx.lineWidth = o.lw || 4; ctx.strokeStyle = o.stroke || C.mut; ctx.stroke();
    text(ctx, L, x, y + r * 0.36, r * 1.05, { mono: true, weight: 800, align: "center", color: o.color || C.ink });
    if (o.badge) { chip(ctx, o.badge, x, y - r - 46, { size: 22, color: C.white, fill: o.stroke || C.red, stroke: o.stroke || C.red, center: true, px: 10, py: 6 }); }
    ctx.restore();
  }
  /* panah antar simpul (dipendekkan sebesar jari-jari); bend = lengkung */
  function panah(ctx, a, b2, o = {}) {
    const r = o.r || 34, dx = b2[0] - a[0], dy = b2[1] - a[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    const col = o.color || C.mut, lw = o.lw || 4, u = o.u === undefined ? 1 : o.u; if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= Math.min(1, u * 1.5) * (o.alpha === undefined ? 1 : o.alpha);
    if (!o.bend) { arrow(ctx, a[0] + ux * r, a[1] + uy * r, b2[0] - ux * (r + 4), b2[1] - uy * (r + 4), { color: col, lw, head: 18, u: Math.min(1, u * 1.2) }); ctx.restore(); return; }
    const mx = (a[0] + b2[0]) / 2 - uy * o.bend, my = (a[1] + b2[1]) / 2 + ux * o.bend;
    const s0 = Math.atan2(my - a[1], mx - a[0]), e0 = Math.atan2(b2[1] - my, b2[0] - mx);
    const p0 = [a[0] + Math.cos(s0) * r, a[1] + Math.sin(s0) * r], p1 = [b2[0] - Math.cos(e0) * (r + 4), b2[1] - Math.sin(e0) * (r + 4)];
    ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(mx, my, p1[0], p1[1]); ctx.stroke();
    const ang = Math.atan2(p1[1] - my, p1[0] - mx), hs = 18;
    ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p1[0] - Math.cos(ang - 0.45) * hs, p1[1] - Math.sin(ang - 0.45) * hs); ctx.lineTo(p1[0] - Math.cos(ang + 0.45) * hs, p1[1] - Math.sin(ang + 0.45) * hs); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  /* tata letak graf fungsional */
  const P = {};
  (function () {
    P.A = [200, 175]; P.B = [200, 305]; P.C = [200, 455]; P.D = [200, 585];
    const tri = (cx, cy, r, ls) => ls.forEach((L, i) => { const a = Math.PI + i * 2 * Math.PI / 3; P[L] = [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
    tri(560, 380, 88, ["F", "H", "I"]); P.G = [380, 270]; P.E = [380, 500]; P.J = [300, 650]; P.K = [470, 660];
    tri(880, 380, 88, ["L", "N", "M"]);
    ["T", "U", "V", "W", "X"].forEach((L, i) => { const a = Math.PI + i * 2 * Math.PI / 5; P[L] = [1420 + 125 * Math.cos(a), 380 + 125 * Math.sin(a)]; });
    P.P = [1160, 470]; P.O = [1060, 330]; P.Q = [1160, 610]; P.R = [1050, 690]; P.S = [1280, 690]; P.Y = [1680, 540]; P.Z = [1680, 220];
  })();
  const CEN = [[200, 380], [560, 380], [880, 380], [1420, 380]];
  /* o.node(L) -> opsi simpul; o.edge(L) -> opsi panah dari L */
  function graf(ctx, o = {}) {
    for (const L of AB) {
      const e = o.edge ? o.edge(L) : {}; if (e.hide) continue;
      const k = cycOf[L], inCyc = k !== undefined && cycOf[F[L]] === k;
      panah(ctx, P[L], P[F[L]], Object.assign({ color: inCyc ? CCOL[k] : C.mut, lw: inCyc ? 5 : 4, bend: (L === "B" || L === "C") ? 70 : 0 }, e));
    }
    for (const L of AB) {
      const n = o.node ? o.node(L) : {}; if (n.hide) continue;
      const k = cycOf[L];
      simpul(ctx, P[L][0], P[L][1], L, Object.assign(k !== undefined ? { fill: CBG[k], stroke: CCOL[k] } : {}, n));
    }
  }
  function cycBadge(ctx, k, s, u) { fadeIn(ctx, u, () => { const [x, y] = CEN[k]; text(ctx, s, x, y + 14, 40, { mono: true, weight: 800, align: "center", color: CCOL[k] }); }); }

  Kiko.ON09 = { kartu, deret, graf, simpul, F, AB };
  Object.assign(Kiko.SCENES, {
    kartu(ctx, b, l) {
      const m = b.mode;
      if (m === "kait") {
        const tK = at(b, "kartu"), tJ = at(b, "menjentikkan"), tS = at(b, "kesepuluh"), tT = at(b, "tiga");
        const flip = ap(l, tJ, 0.8);
        deret(ctx, i => i === 9 && l > tS - 0.2 ? "?" : step(AB[i], 1), 170, i => ({ alpha: ap(l, tK - 0.3 + i * 0.03), flip, from: AB[i], hl: i === 9 && l > tS - 0.2 ? C.red : null }), {});
        fadeIn(ctx, ap(l, tT - 0.2), () => chip(ctx, "33 kali jentik", 960, 590, { size: 48, color: C.white, fill: C.green, stroke: C.green, center: true, px: 30 }));
        fadeIn(ctx, ap(l, tS - 0.2), () => { const x = (1920 - (13 * 110 + 12 * 18)) / 2 + 9 * 128 + 55; text(ctx, "kartu ke-10: ?", x, 150, 34, { weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "besar") {
        const tB = at(b, "ratus"), tP = at(b, "perlu"), tS = at(b, "sama");
        fadeIn(ctx, ap(l, tB - 0.2), () => { text(ctx, "333.333", 960, 290, 150, { mono: true, weight: 800, align: "center" }); text(ctx, "kali jentik", 960, 370, 48, { weight: 800, align: "center", color: C.mut }); });
        fadeIn(ctx, ap(l, tP - 0.2), () => { for (let i = 0; i < 7; i++) kartu(ctx, 520 + i * 125, 430, AB[i], { w: 100, h: 120, alpha: 0.5 }); });
        fadeIn(ctx, ap(l, tS - 0.3), () => { panel(ctx, 560, 600, 800, 120, { stroke: C.red, lw: 5 }); text(ctx, "= 3 kali jentik", 960, 682, 64, { disp: true, weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "kartu") {
        const tA = at(b, "A"), tB = at(b, "B"), tZ = at(b, "Z");
        deret(ctx, i => AB[i], 170, i => ({ alpha: i === 0 ? ap(l, tA - 0.3) : i === 1 ? ap(l, tB - 0.3) : i === 25 ? ap(l, tZ - 0.3) : ap(l, tB + 0.2 + (i - 2) * ((tZ - tB - 0.6) / 23)) }), { nums: true });
        return;
      }
      if (m === "tabel") {
        const tT = at(b, "tabel"), tA = at(b, "A"), tB = at(b, "B", 2), tC = at(b, "C", 2);
        tabelAturan(ctx, 160, { u: ap(l, tT - 0.4), cell: L => ({ ring: L === "A" ? ap(l, tA - 0.2) * (l < tB ? 1 : 0.35) : L === "B" ? ap(l, tB - 0.2) * (l < tC ? 1 : 0.35) : L === "C" ? ap(l, tC - 0.2) : 0 }) });
        fadeIn(ctx, ap(l, 0.2) * (1 - ap(l, tT - 0.6)), () => { text(ctx, "satu jentik = semua kartu berubah", 960, 420, 56, { disp: true, weight: 800, align: "center", color: C.green }); });
        return;
      }
      if (m === "jentik") {
        const tS = at(b, "satu"), t1 = at(b, "pertama"), t2 = at(b, "kedua"), t3 = at(b, "ketiga"), tW = at(b, "saat");
        const flip = ap(l, tS, 0.8);
        deret(ctx, i => F[AB[i]], 170, i => ({ flip, from: AB[i], hl: (i === 0 && l > t1 - 0.2) || (i === 1 && l > t2 - 0.2) || (i === 2 && l > t3 - 0.2) ? C.green : null }), { nums: true });
        fadeIn(ctx, ap(l, tW - 0.3), () => chip(ctx, "semua berubah bersamaan", 960, 600, { size: 40, color: C.white, fill: C.green, stroke: C.green, center: true }));
        return;
      }
      if (m === "contoh") {
        const seq = ["A", "B", "C", "B", "C", "B"], ts = [0.2, at(b, "B"), at(b, "C"), at(b, "B", 2), at(b, "C", 2), at(b, "seterusnya")];
        seq.forEach((L, i) => {
          const x = 300 + i * 240, u = ap(l, ts[i] - 0.3);
          fadeIn(ctx, u, () => { kartu(ctx, x - 70, 260, L, { w: 140, h: 180, hl: i > 0 ? (i % 2 ? C.purple : C.purple) : null, fill: i > 0 ? C.purpleBg : C.panel }); text(ctx, i === 0 ? "awal" : i + "×", x, 500, 32, { mono: true, weight: 800, align: "center", color: C.mut }); });
          if (i > 0) arrow(ctx, x - 160, 350, x - 90, 350, { u: ap(l, ts[i] - 0.4), color: C.mut, lw: 4 });
        });
        fadeIn(ctx, ap(l, at(b, "berulang") - 0.3), () => chip(ctx, "B, C, B, C, … berulang", 960, 600, { size: 44, color: C.white, fill: C.purple, stroke: C.purple, center: true }));
        return;
      }
      if (m === "tanya") {
        const ts = [at(b, "puluh"), at(b, "ribu"), at(b, "ribu", 2)];
        [["33", "kartu ke-10?"], ["3.333", "berapa huruf berbeda?"], ["333.333", "huruf terbanyak?"]].forEach(([n, q], i) => fadeIn(ctx, ap(l, ts[i] - 0.4), () => {
          const x = 220 + i * 520; panel(ctx, x, 200, 460, 420, { stroke: C.green, lw: 3 });
          text(ctx, "SOAL " + (20 + i), x + 230, 260, 28, { mono: true, weight: 800, align: "center", color: C.green });
          text(ctx, n, x + 230, 400, 96, { mono: true, weight: 800, align: "center", fit: 420 });
          text(ctx, "kali jentik", x + 230, 460, 34, { weight: 800, align: "center", color: C.mut });
          text(ctx, q, x + 230, 560, 36, { weight: 800, align: "center", color: C.red, fit: 420 });
        }));
        return;
      }
      if (m === "soal") {
        const P2 = { 20: ["33", "Huruf apa di kartu ke-10?"], 21: ["3.333", "Berapa huruf berbeda yang terlihat?"], 22: ["333.333", "Huruf apa yang paling banyak muncul?"] }[b.soal];
        const tN = at(b, b.soal === 20 ? "tiga" : b.soal === 21 ? "ribu" : "ratus"), tQ = at(b, b.soal === 20 ? "Huruf" : b.soal === 21 ? "berapa" : "Huruf");
        fadeIn(ctx, ap(l, tN - 0.4), () => { panel(ctx, 260, 160, 1400, 260, { stroke: C.green, lw: 3 }); text(ctx, P2[0], 960, 310, 120, { mono: true, weight: 800, align: "center" }); text(ctx, "kali jentik", 960, 385, 40, { weight: 800, align: "center", color: C.mut }); });
        fadeIn(ctx, ap(l, tQ - 0.3), () => { panel(ctx, 260, 480, 1400, 150, { stroke: C.red, lw: 3 }); text(ctx, P2[1], 960, 575, 52, { weight: 800, align: "center", color: C.red, fit: 1320 });
          if (b.soal === 22) text(ctx, "seri? pilih yang paling awal menurut abjad", 960, 700, 34, { weight: 700, align: "center", color: C.mut }); });
        return;
      }
      if (m === "rantai") {
        const seq = ["J", "E", "F", "H", "I", "F"], ts = [at(b, "J"), at(b, "E"), at(b, "F"), at(b, "H"), at(b, "I", 1), at(b, "F", 3)];
        fadeIn(ctx, ap(l, 0.1), () => { kartu(ctx, 130, 240, "J", { w: 130, h: 170, hl: C.red }); text(ctx, "kartu ke-10", 195, 460, 28, { weight: 800, align: "center", color: C.mut }); });
        seq.forEach((L, i) => {
          const x = 420 + i * 240, u = ap(l, ts[i] - 0.3), k = cycOf[L];
          fadeIn(ctx, u, () => { simpul(ctx, x, 325, L, Object.assign({ r: 62 }, k === 1 ? { fill: C.greenBg, stroke: C.green } : {})); if (i > 0) text(ctx, i + "×", x, 430, 32, { mono: true, weight: 800, align: "center", color: C.mut }); });
          if (i > 0) arrow(ctx, x - 240 + 66, 325, x - 70, 325, { u: ap(l, ts[i] - 0.45), color: i >= 3 ? C.green : C.mut, lw: 5 });
        });
        fadeIn(ctx, ap(l, ts[5] - 0.2), () => { text(ctx, "kembali ke F", 420 + 5 * 240, 220, 32, { weight: 800, align: "center", color: C.green }); });
        return;
      }
      if (m === "putar" || m === "sisa") {
        const isS = m === "sisa", cx = isS ? 1350 : 1150, cy = 390, R = isS ? 150 : 170;
        const pos = { F: [cx - R, cy], H: [cx + R * 0.5, cy - R * 0.87], I: [cx + R * 0.5, cy + R * 0.87] };
        const tS = isS ? 0 : at(b, "siklus"), tP = isS ? 0 : at(b, "panjang");
        if (!isS) {
          fadeIn(ctx, ap(l, 0.1), () => { simpul(ctx, 300, cy, "J", { r: 56 }); simpul(ctx, 560, cy, "E", { r: 56 }); });
          arrow(ctx, 360, cy, 496, cy, { u: ap(l, 0.3), color: C.mut, lw: 5 }); arrow(ctx, 620, cy, pos.F[0] - 64, cy, { u: ap(l, 0.5), color: C.mut, lw: 5 });
          text(ctx, "ekor: 2 jentik", 430, cy + 120, 34, { weight: 800, align: "center", color: C.mut });
        }
        ["F", "H", "I"].forEach((L, i) => { const nx = ["H", "I", "F"][i]; panah(ctx, pos[L], pos[nx], { r: 60, color: C.green, lw: 6, bend: -40, u: ap(l, isS ? 0 : at(b, "putaran") + i * 0.15) }); });
        ["F", "H", "I"].forEach(L => simpul(ctx, pos[L][0], pos[L][1], L, { r: 58, fill: C.greenBg, stroke: C.green }));
        if (!isS) {
          fadeIn(ctx, ap(l, tS - 0.2), () => text(ctx, "siklus", cx, cy + 14, 44, { weight: 800, align: "center", color: C.green }));
          fadeIn(ctx, ap(l, tP - 0.2), () => chip(ctx, "panjang 3", cx, cy + R + 70, { size: 40, color: C.white, fill: C.green, stroke: C.green, center: true }));
          return;
        }
        const t31 = at(b, "satu"), tD = at(b, "dibagi"), tM = at(b, "maju"), tJ = at(b, "Jawaban");
        fadeIn(ctx, ap(l, 0.2), () => text(ctx, "33 − 2 = 31", 520, 260, 72, { mono: true, weight: 800, align: "center" }));
        fadeIn(ctx, ap(l, tD - 0.2), () => text(ctx, "31 = 3 × 10 + 1", 520, 400, 72, { mono: true, weight: 800, align: "center", color: C.green }));
        fadeIn(ctx, ap(l, tD + 0.6), () => text(ctx, "sisa 1 → maju 1 langkah", 520, 490, 40, { weight: 800, align: "center", color: C.mut }));
        const um = ap(l, tM - 0.2, 0.8);
        if (um > 0) { const x = pos.F[0] + (pos.H[0] - pos.F[0]) * um, y = pos.F[1] + (pos.H[1] - pos.F[1]) * um; ctx.save(); ctx.beginPath(); ctx.arc(x, y, 72, 0, Math.PI * 2); ctx.lineWidth = 8; ctx.strokeStyle = C.red; ctx.stroke(); ctx.restore(); }
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: H", 520, 600, { size: 52, color: C.white, fill: C.red, stroke: C.red, center: true }));
        void t31; return;
      }
      if (m === "sisa30") {
        const tD = at(b, "dibagi"), tJ = at(b, "Jadi"), tP = at(b, "Perhatikan"), tB = at(b, "bersisa");
        fadeIn(ctx, ap(l, tD - 0.3), () => text(ctx, "333.333 = 30 × 11.111 + 3", 960, 230, 76, { mono: true, weight: 800, align: "center", fit: 1700 }));
        fadeIn(ctx, ap(l, tJ - 0.2), () => { panel(ctx, 560, 290, 800, 110, { stroke: C.red, lw: 5 }); text(ctx, "= 3 kali jentik", 960, 370, 60, { disp: true, weight: 800, align: "center", color: C.red }); });
        fadeIn(ctx, ap(l, tP - 0.2), () => text(ctx, "3.333 = 30 × 111 + 3", 960, 520, 60, { mono: true, weight: 800, align: "center", color: C.green }));
        fadeIn(ctx, ap(l, tB - 0.8), () => text(ctx, "33 = 30 × 1 + 3", 960, 620, 60, { mono: true, weight: 800, align: "center", color: C.green }));
        fadeIn(ctx, ap(l, tB - 0.2), () => text(ctx, "ketiga soal = 3 kali jentik", 960, 720, 40, { weight: 800, align: "center", color: C.mut }));
        return;
      }
      if (m === "tiga" || m === "hitung") {
        const isH = m === "hitung", tB = isH ? 0 : at(b, "Baris"), tT = isH ? at(b, "T") : 99, tL = isH ? at(b, "lebih") : 99;
        const f3 = L => step(L, 3);
        tabelAturan(ctx, 140, { lab1: "awal", lab2: "3 jentik", u: 1, row2: L => (isH || ap(l, tB - 0.4 + AB.indexOf(L) * 0.05) > 0.5) ? f3(L) : "",
          cell: L => isH && f3(L) === "T" ? { ring: ap(l, tT - 0.2), ringColor: C.red, bot: C.redBg, botColor: C.red } : (isH && l > tL - 0.3 && ["H", "I", "U"].includes(f3(L)) ? { botColor: C.goldInk } : {}) });
        if (isH) {
          const cnt = {}; AB.forEach(L => { const v = f3(L); cnt[v] = (cnt[v] || 0) + 1; });
          const list = Object.keys(cnt).sort();
          fadeIn(ctx, ap(l, 0.3), () => list.forEach((L, i) => {
            const x = 150 + i * 125, y = 610, hot = L === "T";
            panel(ctx, x, y, 110, 90, { stroke: hot ? C.red : C.line, lw: hot ? 5 : 2, fill: hot ? C.redBg : C.panel });
            text(ctx, L + ":" + cnt[L], x + 55, y + 60, 34, { mono: true, weight: 800, align: "center", color: hot ? C.red : cnt[L] === 3 ? C.goldInk : C.ink });
          }));
          fadeIn(ctx, ap(l, at(b, "Jawaban") - 0.2), () => chip(ctx, "JAWABAN: T", 960, 722, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
        }
        return;
      }
    },

    graf(ctx, b, l) {
      const s = b.spec;
      if (s === "b3") {
        const tG = at(b, "gambar"), tE = at(b, "keluar"), tS = at(b, "empat"), tP = at(b, "panjang");
        graf(ctx, { node: L => ({ alpha: ap(l, tG - 0.3 + AB.indexOf(L) * 0.06) }), edge: L => ({ u: ap(l, tG + 0.5 + AB.indexOf(L) * 0.07), alpha: 1 }) });
        CYC.forEach((cy, k) => { const u = ap(l, tS - 0.2 + k * 0.3); if (u > 0) cy.forEach(L => { ctx.save(); ctx.globalAlpha *= u; ctx.beginPath(); ctx.arc(P[L][0], P[L][1], 44, 0, Math.PI * 2); ctx.lineWidth = 5; ctx.strokeStyle = CCOL[k]; ctx.stroke(); ctx.restore(); }); });
        ["2", "3", "3", "5"].forEach((n, k) => cycBadge(ctx, k, n, ap(l, tP + k * 0.5)));
        void tE; return;
      }
      if (s === "b4") {
        const tE = at(b, "ekor"), tR = at(b, "terpanjang"), tS = at(b, "setelah"), path = ["R", "Q", "P", "T"];
        const hot = L => path.includes(L) && l > tR - 0.2;
        graf(ctx, { node: L => cycOf[L] === undefined ? { stroke: hot(L) ? C.red : C.ink, lw: hot(L) ? 6 : 4, fill: hot(L) ? C.redBg : "#FFFFFF" } : {},
          edge: L => hot(L) && L !== "T" ? { color: C.red, lw: 7 } : (cycOf[L] === undefined ? { color: l > tE - 0.2 ? C.ink : C.mut, lw: l > tE - 0.2 ? 5 : 4 } : {}) });
        ["2", "3", "3", "5"].forEach((n, k) => cycBadge(ctx, k, n, 1));
        [["R", "1"], ["Q", "2"], ["P", "3"]].forEach(([L, n], i) => fadeIn(ctx, ap(l, tR + 0.5 + i * 0.5), () => text(ctx, n + "×", (P[L][0] + P[F[L]][0]) / 2 + 30, (P[L][1] + P[F[L]][1]) / 2 + 10, 30, { mono: true, weight: 800, color: C.red })));
        fadeIn(ctx, ap(l, tS - 0.2), () => chip(ctx, "setelah 3 jentik: semua kartu di siklus", 1180, 120, { size: 30, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
      if (s === "b5" || s === "b6" || s === "c3") {
        const tEk = s === "b5" ? at(b, "Sebaliknya") : 0, dimTail = s !== "b5" || l > tEk - 0.2;
        graf(ctx, { node: L => cycOf[L] === undefined ? { alpha: dimTail ? 0.25 : 1 } : {}, edge: L => cycOf[L] === undefined || cycOf[F[L]] === undefined ? { alpha: dimTail ? 0.2 : 1 } : {} });
        if (s === "b5") {   // kartu berputar di siklus
          const ph = ap(l, at(b, "berputar") - 0.3) > 0 ? (l * 0.7) % 1 : 0;
          CYC.forEach((cy, k) => cy.forEach((L, i) => {
            const nx = cy[(i + 1) % cy.length], u = ease(ph), x = P[L][0] + (P[nx][0] - P[L][0]) * u, y = P[L][1] + (P[nx][1] - P[L][1]) * u;
            ctx.save(); ctx.globalAlpha *= ap(l, at(b, "berputar") - 0.3); rr(ctx, x + 18, y - 52, 30, 40, 6); ctx.fillStyle = CCOL[k]; ctx.fill(); ctx.restore();
          }));
          fadeIn(ctx, ap(l, at(b, "selalu") - 0.3), () => chip(ctx, "huruf siklus: selalu terlihat", 1180, 120, { size: 30, color: C.white, fill: C.green, stroke: C.green, center: true }));
          fadeIn(ctx, ap(l, tEk - 0.2), () => text(ctx, "huruf ekor: hilang", 1180, 790 - 30, 32, { weight: 800, align: "center", color: C.mut }));
        }
        if (s === "b6") {
          const ts = [at(b, "dua"), at(b, "tiga"), at(b, "tiga", 2), at(b, "lima")], tB = at(b, "belas");
          ["2", "3", "3", "5"].forEach((n, k) => cycBadge(ctx, k, n, ap(l, ts[k] - 0.3)));
          fadeIn(ctx, ap(l, ts[0] - 0.3), () => text(ctx, "2 + 3 + 3 + 5 = " + (l > tB - 0.3 ? "13" : ""), 1100, 140, 56, { mono: true, weight: 800, align: "center" }));
          fadeIn(ctx, ap(l, at(b, "Jawaban") - 0.2), () => chip(ctx, "JAWABAN: 13", 1740, 680, { size: 44, color: C.white, fill: C.red, stroke: C.red, center: true }));
        }
        if (s === "c3") {
          const ts = [at(b, "dua"), at(b, "tiga"), at(b, "lima")], tK = at(b, "KPK"), tS = at(b, "semula");
          ["2", "3", "3", "5"].forEach((n, k) => cycBadge(ctx, k, n, ap(l, ts[[0, 1, 1, 2][k]] - 0.3)));
          fadeIn(ctx, ap(l, tS - 0.3), () => text(ctx, "30 jentik → semua siklus kembali", 1100, 140, 44, { weight: 800, align: "center", color: C.green }));
          fadeIn(ctx, ap(l, tK - 0.3), () => chip(ctx, "KPK(2, 3, 5) = 30", 1640, 680, { size: 36, color: C.white, fill: C.red, stroke: C.red, center: true }));
        }
        return;
      }
    },

    kait_judul(ctx, b, l) {
      const tS = at(b, "siklus");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "26 Kartu, 333.333 Jentikan", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Huruf Apa yang Tersisa?", 960, 400, 72, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2025 · SMA · No. 20, 21, 22 · Kartu Huruf Ajaib", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tS - 0.3), () => chip(ctx, "siklus dan sisa bagi", 960, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
    },
    konsep_fungsi(ctx, b, l) {
      const tF = at(b, "fungsi"), tE = at(b, "ekor"), tS = at(b, "siklus");
      heading(ctx, "// KONSEP", "Fungsi: setiap huruf punya satu tujuan", ap(l, tF - 0.3), 130);
      // bentuk rho: ekor lurus lalu lingkaran
      const tail = [[360, 560], [560, 520], [760, 480]], cx = 1060, cy = 430, R = 150, ring = 6;
      const rp = i => { const a = Math.PI + i * 2 * Math.PI / ring; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; };
      const uE = ap(l, tE - 0.3), uS = ap(l, tS - 0.3);
      tail.forEach((p, i) => { const q = i < 2 ? tail[i + 1] : rp(0); panah(ctx, p, q, { r: 30, color: C.mut, u: uE }); fadeIn(ctx, uE, () => simpul(ctx, p[0], p[1], "", { r: 30, fill: "#FFFFFF" })); });
      for (let i = 0; i < ring; i++) panah(ctx, rp(i), rp((i + 1) % ring), { r: 30, color: C.green, lw: 5, u: uS });
      for (let i = 0; i < ring; i++) fadeIn(ctx, Math.max(uE, uS), () => { const p = rp(i); simpul(ctx, p[0], p[1], "", { r: 30, fill: C.greenBg, stroke: C.green }); });
      fadeIn(ctx, uE, () => text(ctx, "ekor", 560, 640, 44, { weight: 800, align: "center", color: C.mut }));
      fadeIn(ctx, uS, () => text(ctx, "siklus", cx, cy + 14, 44, { weight: 800, align: "center", color: C.green }));
    },
    konsep_langkah(ctx, b, l) {
      const t1 = at(b, "Pertama"), t2 = at(b, "Kedua");
      heading(ctx, "// KONSEP", "Dua langkah untuk angka besar", 1, 130);
      fadeIn(ctx, ap(l, t1 - 0.2), () => { panel(ctx, 260, 300, 650, 340, { stroke: C.ink, lw: 3 }); text(ctx, "1", 340, 400, 72, { disp: true, weight: 800, color: C.ink });
        text(ctx, "Jalankan sampai", 420, 390, 44, { weight: 800 }); text(ctx, "ekornya habis", 420, 450, 44, { weight: 800 }); text(ctx, "J → E → F", 585, 570, 48, { mono: true, weight: 800, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, t2 - 0.2), () => { panel(ctx, 1010, 300, 650, 340, { stroke: C.green, lw: 3 }); text(ctx, "2", 1090, 400, 72, { disp: true, weight: 800, color: C.green });
        text(ctx, "Sisa langkah dibagi", 1170, 390, 44, { weight: 800, fit: 470 }); text(ctx, "panjang siklus", 1170, 450, 44, { weight: 800 }); text(ctx, "31 mod 3 = 1", 1335, 570, 48, { mono: true, weight: 800, align: "center", color: C.green }); });
    },
    konsep_pakai(ctx, b, l) {
      const tP = at(b, "pangkat"), tB = at(b, "berputar"), tS = at(b, "Seratus"), tJ = at(b, "jadi");
      heading(ctx, "// KONSEP", "Trik yang sama: 3¹⁰⁰", 1, 130);
      const seq = [["3¹", "3"], ["3²", "9"], ["3³", "27"], ["3⁴", "81"], ["3⁵", "243"], ["3⁶", "729"], ["3⁷", "2187"], ["3⁸", "6561"]];
      seq.forEach(([p, v], i) => fadeIn(ctx, ap(l, tB - 0.5 + i * 0.25), () => {
        const x = 230 + i * 210; text(ctx, p, x, 330, 40, { mono: true, weight: 800, align: "center", color: C.mut });
        text(ctx, v.slice(0, -1), x - 4, 420, 44, { mono: true, weight: 700, align: "right", color: C.mut });
        text(ctx, v.slice(-1), x - 4, 420, 56, { mono: true, weight: 800, align: "left", color: C.green });
      }));
      fadeIn(ctx, ap(l, tB + 1.4), () => chip(ctx, "3, 9, 7, 1, 3, 9, 7, 1, …  panjang 4", 960, 480, { size: 36, color: C.white, fill: C.green, stroke: C.green, center: true }));
      fadeIn(ctx, ap(l, tS - 0.2), () => text(ctx, "100 = 4 × 25 + 0", 960, 630, 60, { mono: true, weight: 800, align: "center" }));
      fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "angka terakhir 3¹⁰⁰ = 1", 960, 686, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
      void tP;
    }
  });
  function ease(u) { return u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u); }
})();
