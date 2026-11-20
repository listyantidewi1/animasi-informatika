/* ON02 Empat Soal OSN-K Tanpa Coding (OSN-K 2026 SMA no. 1, 2, 3 + 2025 no. 6).
   Adegan per beat; waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers;
  const { rr, text, para, panel, label, chip, coin, check, cross, arrow, strike, hilite, ease, clamp, lerp, ap, at, speechEnd } = H;
  const GREY = "#CFC5AE";

  function fadeIn(ctx, u, fn) { if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; fn(); ctx.restore(); }
  function bigNote(ctx, s, x, y, size, u, o = {}) { fadeIn(ctx, u, () => text(ctx, s, x, y + (1 - u) * 14, size, { disp: true, weight: 800, align: o.align || "center", color: o.color || C.ink, fit: o.fit })); }
  function note(ctx, s, x, y, size, u, o = {}) { fadeIn(ctx, u, () => text(ctx, s, x, y, size, { weight: o.weight || 700, align: o.align || "center", color: o.color || C.ink, mono: o.mono, fit: o.fit })); }
  function heading(ctx, small, big, u = 1, y = 170) {
    fadeIn(ctx, u, () => { label(ctx, small, 960, y, { align: "center" }); text(ctx, big, 960, y + 78, 64, { disp: true, weight: 800, align: "center", fit: 1700 }); });
  }

  /* ---------- ubin bilangan (soal 1) ---------- */
  function tile(ctx, v, x, y, o = {}) {   // x,y = pusat
    const s = o.s || 76; const st = o.state;
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    ctx.fillStyle = "rgba(60,45,10,0.12)"; rr(ctx, x - s / 2 + 3, y - s / 2 + 5, s, s, 12); ctx.fill();
    rr(ctx, x - s / 2, y - s / 2, s, s, 12);
    ctx.fillStyle = st === "take" ? C.redBg : st === "new" ? C.greenBg : st === "gold" ? C.gold2 : st === "q" ? C.panel : C.panel; ctx.fill();
    ctx.lineWidth = st ? 4 : 3; ctx.strokeStyle = st === "take" ? C.red : st === "new" ? C.green : st === "gold" ? C.goldRim : C.line;
    if (st === "q") ctx.setLineDash([9, 7]); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, String(v), x, y + s * 0.19, s * 0.52, { mono: true, weight: 800, align: "center", color: st === "take" ? C.red : st === "new" ? C.green : C.ink });
    ctx.restore();
  }
  function row(ctx, arr, x0, y, o = {}) {  // x0 = pusat ubin pertama; o.st(i) = keadaan
    const d = o.d || 90; arr.forEach((v, i) => tile(ctx, v, x0 + i * d, y + (o.dy ? o.dy(i) : 0), { s: o.s, state: o.st ? o.st(i) : null, alpha: o.a ? o.a(i) : 1 }));
  }
  const rowC = (n, d = 90, cx = 960) => cx - (n - 1) * d / 2;
  function opChip(ctx, s, x, y, o = {}) {
    const kw = s.includes("KWAK"); return chip(ctx, s, x, y, { size: o.size || 30, color: C.white, fill: kw ? C.green : C.red, stroke: kw ? C.green : C.red, center: o.center, alpha: o.alpha });
  }

  /* ---------- tembolok (soal 2) ---------- */
  const SEQ = ["A", "B", "C", "A", "D", "B", "E", "A"];
  const LRU = (() => {   // keadaan setelah akses ke-i (1..8); slot tetap pada tempatnya
    const st = [{ slots: [], ev: null, hit: false }]; let slots = [];
    SEQ.forEach((k, i) => {
      const t = i + 1; slots = slots.map(s => ({ ...s })); let ev = null, hit = false, at_ = -1;
      const f = slots.findIndex(s => s.k === k);
      if (f >= 0) { slots[f].t = t; hit = true; at_ = f; }
      else if (slots.length < 3) { slots.push({ k, t }); at_ = slots.length - 1; }
      else { let m = 0; slots.forEach((s, j) => { if (s.t < slots[m].t) m = j; }); ev = slots[m].k; slots[m] = { k, t }; at_ = m; }
      st.push({ slots, ev, hit, at: at_ });
    });
    return st;
  })();
  const SX = [700, 960, 1220];
  function slotBox(ctx, i, s, o = {}) {   // s = {k,t} atau null
    const x = (o.xs || SX)[i], y = o.y || 420, w = o.w || 210, h = o.h || 200;
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    rr(ctx, x - w / 2, y - h / 2, w, h, 16); ctx.fillStyle = o.fill || (s ? C.panel : "rgba(255,252,244,0.5)"); ctx.fill();
    ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.stroke || C.line; if (!s) ctx.setLineDash([10, 8]); ctx.stroke(); ctx.setLineDash([]);
    if (s) {
      text(ctx, s.k, x, y + 18, 96, { mono: true, weight: 800, align: "center", color: o.color || C.ink });
      if (s.t && o.times !== false) {
        rr(ctx, x - 70, y + h / 2 - 50, 140, 40, 8); ctx.fillStyle = o.tFill || C.greenBg; ctx.fill();
        text(ctx, "waktu " + s.t, x, y + h / 2 - 21, 24, { mono: true, weight: 800, align: "center", color: o.tColor || C.green });
      }
    }
    ctx.restore();
  }
  function slotFrame(ctx, o = {}) {
    const x0 = (o.xs || SX)[0] - 135, x1 = (o.xs || SX)[2] + 135, y = o.y || 420;
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    rr(ctx, x0, y - 140, x1 - x0, 280, 22); ctx.lineWidth = 4; ctx.strokeStyle = C.green; ctx.stroke();
    chip(ctx, "TEMBOLOK · muat 3", x0 + 24, y - 162, { size: 22, color: C.green, stroke: C.green, fill: C.bg });
    ctx.restore();
  }
  function strip(ctx, upto, cur, o = {}) {   // deretan akses dengan nomor waktu
    const d = 104, x0 = o.x0 || (960 - 8 * d / 2), y = o.y || 180;
    for (let i = 0; i < 9; i++) {
      const k = i < 8 ? SEQ[i] : "F"; const a = o.a ? o.a(i) : 1; if (a <= 0) continue;
      const x = x0 + i * d; const isCur = i + 1 === cur, done = i + 1 < cur || (i + 1 <= upto && !isCur && cur > 0);
      ctx.save(); ctx.globalAlpha *= a;
      rr(ctx, x - 40, y - 40, 80, 80, 12);
      ctx.fillStyle = isCur ? C.gold2 : i === 8 ? C.panel : done ? "#EFE8D6" : C.panel; ctx.fill();
      ctx.lineWidth = isCur ? 5 : 3; ctx.strokeStyle = isCur ? C.goldRim : i === 8 ? C.red : C.line; if (i === 8) ctx.setLineDash([8, 6]); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, k, x, y + 18, 52, { mono: true, weight: 800, align: "center", color: i === 8 ? C.red : done ? C.mut : C.ink });
      if (o.nums) { const na = typeof o.nums === "number" ? o.nums : 1; ctx.globalAlpha *= na; text(ctx, i < 8 ? String(i + 1) : "?", x, y + 78, 26, { mono: true, weight: 700, align: "center", color: isCur ? C.red : C.mut }); }
      ctx.restore();
    }
    if (o.nums) note(ctx, "waktu", x0 - 70, y + 78, 24, typeof o.nums === "number" ? o.nums : 1, { mono: true, color: C.mut, align: "right" });
  }

  /* ---------- bebek dan graf (soal 3) ---------- */
  function duck(ctx, x, y, r, s, o = {}) {
    const f = o.fill || C.ink;
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    if (o.ring) { ctx.beginPath(); ctx.arc(x, y, r * 1.45, 0, Math.PI * 2); ctx.fillStyle = o.ring; ctx.fill(); }
    ctx.fillStyle = f;
    ctx.beginPath(); ctx.ellipse(x - r * 0.1, y + r * 0.28, r * 1.0, r * 0.62, 0, 0, Math.PI * 2); ctx.fill();          // badan
    ctx.beginPath(); ctx.moveTo(x - r * 1.05, y + r * 0.05); ctx.lineTo(x - r * 1.3, y - r * 0.3); ctx.lineTo(x - r * 0.75, y + r * 0.0); ctx.fill(); // ekor
    ctx.beginPath(); ctx.arc(x + r * 0.42, y - r * 0.42, r * 0.46, 0, Math.PI * 2); ctx.fill();                          // kepala
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(x + r * 0.82, y - r * 0.5); ctx.lineTo(x + r * 1.18, y - r * 0.36); ctx.lineTo(x + r * 0.8, y - r * 0.24); ctx.fill(); // paruh
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(x + r * 0.52, y - r * 0.55, r * 0.09, 0, Math.PI * 2); ctx.fill();   // mata
    if (s) text(ctx, s, x - r * 0.1, y + r * 0.56, r * 0.76, { mono: true, weight: 800, align: "center", color: C.white });
    ctx.restore();
  }
  const P = { A: [250, 455], B: [520, 245], C: [520, 665], D: [810, 455], E: [810, 665], F: [1090, 245], G: [1090, 665], H: [1340, 455] };
  const EDGES = [["A", "B"], ["A", "C"], ["B", "F"], ["C", "D"], ["C", "E"], ["D", "F"], ["E", "G"], ["F", "H"], ["G", "H"]];
  const MIN = { A: 0, B: 1, C: 1, D: 2, E: 2, F: 2, G: 3, H: 3 };
  const DR = 50;
  function edgeEnds(a, b, sh = 70) {
    const [x1, y1] = P[a], [x2, y2] = P[b]; const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    return [x1 + ux * sh, y1 + uy * sh, x2 - ux * sh, y2 - uy * sh];
  }
  function edge(ctx, a, b, o = {}) {
    const [x1, y1, x2, y2] = edgeEnds(a, b); arrow(ctx, x1, y1, x2, y2, { u: o.u === undefined ? 1 : o.u, color: o.color || C.ink, lw: o.lw || 6, head: 22, dash: o.dash });
  }
  function envelope(ctx, x, y, s = 1, color = C.red) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(ctx, -26, -18, 52, 36, 5); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = color; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-24, -15); ctx.lineTo(0, 4); ctx.lineTo(24, -15); ctx.stroke(); ctx.restore();
  }
  function travel(ctx, a, b, u) {   // amplop berjalan di sepanjang panah
    if (u <= 0 || u >= 1) return; const [x1, y1, x2, y2] = edgeEnds(a, b); const e = ease(u); envelope(ctx, lerp(x1, x2, e), lerp(y1, y2, e) - 6, 0.8);
  }

  /* ---------- barisan 255 bebek (soal 4) ---------- */
  const QS = [{ m: 128, a: "barat", lo: 1, hi: 127 }, { m: 64, a: "barat", lo: 1, hi: 63 }, { m: 32, a: "timur", lo: 33, hi: 63 },
    { m: 48, a: "barat", lo: 33, hi: 47 }, { m: 40, a: "timur", lo: 41, hi: 47 }, { m: 44, a: "koin", lo: 44, hi: 44 }];
  /* o.view [v0,v1]; o.lo/hi rentang hidup; o.mark nomor yang ditanya; o.y; o.nums tulis nomor tiap sel */
  function line255(ctx, o = {}) {
    const [v0, v1] = o.view || [1, 255]; const X0 = 160, X1 = 1760, y = o.y || 300, h = o.h || 70; const n = v1 - v0 + 1, cw = (X1 - X0) / n;
    const xOf = v => X0 + (v - v0 + 0.5) * cw;
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    rr(ctx, X0 - 6, y - 6, X1 - X0 + 12, h + 12, 10); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke();
    const lo = o.lo === undefined ? v0 : o.lo, hi = o.hi === undefined ? v1 : o.hi;
    for (let v = Math.ceil(v0); v <= v1; v++) {
      const x = X0 + (v - v0) * cw; if (x > X1 + 0.5 || x + cw < X0 - 0.5) continue;
      const alive = v >= lo && v <= hi;
      ctx.fillStyle = alive ? (o.coinAt === v ? C.gold : C.greenBg) : "#E4DCC8"; ctx.fillRect(x + (cw > 8 ? 2 : 0.3), y, Math.max(0.6, cw - (cw > 8 ? 4 : 0.6)), h);
      if (o.nums && cw > 30) text(ctx, String(v), x + cw / 2, y + h / 2 + 8, Math.min(22, cw * 0.42), { mono: true, weight: 700, align: "center", color: alive ? C.green : C.mut });
    }
    if (lo <= hi && hi >= v0 && lo <= v1) {
      const a = Math.max(lo, v0), b2 = Math.min(hi, v1); const xa = X0 + (a - v0) * cw, xb = X0 + (b2 - v0 + 1) * cw;
      ctx.lineWidth = 4; ctx.strokeStyle = C.green; rr(ctx, xa - 2, y - 4, xb - xa + 4, h + 8, 6); ctx.stroke();
      if (o.rangeLabel !== false) text(ctx, lo === hi ? String(lo) : lo + "–" + hi, (xa + xb) / 2, y + h + 46, 30, { mono: true, weight: 800, align: "center", color: C.green });
    }
    if (o.mark) {
      const x = xOf(o.mark), mu = o.markU === undefined ? 1 : o.markU;
      ctx.save(); ctx.globalAlpha *= mu; ctx.fillStyle = C.red;
      ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x - 16, y - 36); ctx.lineTo(x + 16, y - 36); ctx.closePath(); ctx.fill();
      chip(ctx, String(o.mark), x, y - 92, { size: 28, color: C.white, fill: C.red, stroke: C.red, center: true });
      ctx.restore();
    }
    text(ctx, String(v0), X0, y + h + 46, 26, { mono: true, weight: 700, color: C.mut });
    text(ctx, String(v1), X1, y + h + 46, 26, { mono: true, weight: 700, color: C.mut, align: "right" });
    if (o.ends !== false) {
      text(ctx, "← BARAT", X0, y - 24, 24, { mono: true, weight: 800, color: C.mut });
      text(ctx, "TIMUR →", X1, y - 24, 24, { mono: true, weight: 800, color: C.mut, align: "right" });
    }
    ctx.restore();
    return xOf;
  }

  /* ---------- kartu jawaban akhir ---------- */
  const SOAL = [["SOAL 1", "KWAK dan KWIK", "12"], ["SOAL 2", "Tembolok Komputer", "B"], ["SOAL 3", "Pesan Rahasia", "G"], ["SOAL 4", "Pencarian Koin", "44"]];
  function soalCard(ctx, i, x, y, w, h, o = {}) {
    const [k, j, ans] = SOAL[i];
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    panel(ctx, x - w / 2, y, w, h, { stroke: o.stroke || C.line, lw: o.stroke ? 4 : 2 });
    text(ctx, k, x, y + 52, 24, { mono: true, weight: 800, align: "center", color: C.green, ls: 2 });
    text(ctx, j, x, y + 102, 32, { weight: 800, align: "center", fit: w - 40 });
    if (o.ans !== undefined && o.ans > 0) { ctx.save(); ctx.globalAlpha *= o.ans; text(ctx, ans, x, y + h - 50, 96, { mono: true, weight: 800, align: "center", color: C.red }); ctx.restore(); }
    else if (o.mini) o.mini(x, y + 120);
    ctx.restore();
  }

  const KW_ROWS = [[2, 5, 3, 4, 1, 2], [3, 3, 4, 1, 2], [5, 5, 6, 3], [0, 6, 3], [3, 9], [12]];
  const KW_OPS = ["awal", "KWAK", "KWIK", "KWAK", "KWIK", "KWIK"];
  const KW_CALC = ["", "|2 − 5| = 3", "+2 ke setiap bilangan", "|5 − 5| = 0", "+3 ke setiap bilangan", "3 + 9 = 12"];
  const KW_TAKE = k => KW_OPS[k] === "KWAK" ? [0, 1] : [KW_ROWS[k - 1].length - 1];

  Object.assign(Kiko.SCENES, {
    // ================= 0. KAIT =================
    kait_empat(ctx, b, l) {
      const tK = at(b, "Keempatnya"), tKr = at(b, "kertas"), tP = at(b, "pensil"), tT = at(b, "tanpa");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 170, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      for (let i = 0; i < 4; i++) {
        const u = ap(l, 0.2 + i * 0.25); const x = 420 + i * 360;
        fadeIn(ctx, u, () => { panel(ctx, x - 150, 220 + (1 - u) * 30, 300, 220, {}); text(ctx, String(i + 1), x, 380 + (1 - u) * 30, 140, { mono: true, weight: 800, align: "center", color: C.red }); });
      }
      bigNote(ctx, "4 soal, dijawab dengan:", 960, 540, 48, ap(l, tK - 0.2));
      // kertas + pensil
      fadeIn(ctx, ap(l, tKr - 0.2), () => {
        ctx.save(); ctx.translate(700, 650); ctx.rotate(-0.05); panel(ctx, -110, -70, 220, 150, {}); ctx.fillStyle = C.line; for (let k = 0; k < 4; k++) ctx.fillRect(-85, -40 + k * 30, 170, 3); ctx.restore();
        text(ctx, "kertas", 700, 780, 32, { weight: 800, align: "center" });
      });
      fadeIn(ctx, ap(l, tP - 0.2), () => {
        ctx.save(); ctx.translate(960, 650); ctx.rotate(-0.6); ctx.fillStyle = C.gold; ctx.fillRect(-110, -14, 180, 28); ctx.fillStyle = C.goldRim; ctx.fillRect(-130, -14, 22, 28);
        ctx.fillStyle = "#E8D2A8"; ctx.beginPath(); ctx.moveTo(70, -14); ctx.lineTo(110, 0); ctx.lineTo(70, 14); ctx.fill(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(98, -4); ctx.lineTo(110, 0); ctx.lineTo(98, 4); ctx.fill(); ctx.restore();
        text(ctx, "pensil", 960, 780, 32, { weight: 800, align: "center" });
      });
      fadeIn(ctx, ap(l, tT - 0.2), () => {
        panel(ctx, 1130, 590, 260, 130, {}); text(ctx, "</>", 1260, 680, 72, { mono: true, weight: 800, align: "center", color: C.mut });
        text(ctx, "tanpa kode", 1260, 780, 32, { weight: 800, align: "center", color: C.red });
      });
      strike(ctx, 1140, 710, 1380, 600, clamp((l - tT - 0.2) / 0.5, 0, 1));
    },
    kait_daftar(ctx, b, l) {
      const T = [at(b, "mesin"), at(b, "tembolok"), at(b, "pesan"), at(b, "permainan")], tH = at(b, "Hitung");
      const cw = 400, xs = [270, 690, 1110, 1530], y = 150, h = 430;
      for (let i = 0; i < 4; i++) {
        const u = ap(l, T[i] - 0.3); if (u <= 0) continue; const x = xs[i];
        soalCard(ctx, i, x, y + (1 - u) * 30, cw - 30, h, { alpha: u, mini: (cx, cy) => {
          if (i === 0) { [2, 5, 3, 4].forEach((v, k) => tile(ctx, v, cx - 120 + k * 80, cy + 150, { s: 64 })); opChip(ctx, "KWAK", cx - 150, cy + 220, { size: 22 }); opChip(ctx, "KWIK", cx + 20, cy + 220, { size: 22 }); }
          if (i === 1) { ["A", "B", "C"].forEach((k, j) => slotBox(ctx, j, { k }, { xs: [cx - 105, cx, cx + 105], y: cy + 150, w: 92, h: 110, times: false })); text(ctx, "keluar siapa?", cx, cy + 260, 26, { mono: true, weight: 700, align: "center", color: C.red }); }
          if (i === 2) { duck(ctx, cx - 110, cy + 110, 26, "A", { fill: C.green }); duck(ctx, cx + 20, cy + 60, 22, ""); duck(ctx, cx + 20, cy + 180, 22, ""); duck(ctx, cx + 130, cy + 120, 22, "?");
            arrow(ctx, cx - 80, cy + 95, cx - 10, cy + 70, { lw: 4, head: 14, color: C.ink }); arrow(ctx, cx - 80, cy + 125, cx - 10, cy + 170, { lw: 4, head: 14, color: C.ink }); arrow(ctx, cx + 50, cy + 70, cx + 100, cy + 105, { lw: 4, head: 14, color: C.ink }); envelope(ctx, cx - 110, cy + 40, 0.7); }
          if (i === 3) { for (let k = 0; k < 7; k++) { ctx.fillStyle = k === 4 ? C.gold : C.greenBg; ctx.fillRect(cx - 160 + k * 46, cy + 110, 40, 60); } coin(ctx, cx - 160 + 4 * 46 + 20, cy + 70, 24, "?", {}); text(ctx, "1 … 255", cx, cy + 230, 28, { mono: true, weight: 700, align: "center", color: C.mut }); }
        } });
      }
      fadeIn(ctx, ap(l, tH - 0.2), () => {
        text(ctx, "Skormu:", 820, 690, 48, { disp: true, weight: 800, align: "right" });
        rr(ctx, 850, 630, 110, 80, 10); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.setLineDash([10, 7]); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "/ 4", 990, 690, 56, { mono: true, weight: 800, color: C.red });
      });
    },
    kait_judul(ctx, b, l) {
      const tE = at(b, "empat"), tI = at(b, "informatika");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "Empat Soal OSN-K yang Bisa", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Kamu Jawab Tanpa Coding", 960, 400, 84, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2026 SMA No. 1, 2, 3  ·  OSN-K 2025 SMA No. 6", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      const ideas = ["menelusuri langkah", "LRU cache", "BFS", "pencarian biner"];
      ideas.forEach((s, i) => { const u = ap(l, tE + i * 0.35); if (u <= 0) return; chip(ctx, s, 390 + i * 380, 590, { size: 30, color: C.green, stroke: C.green, lw: 3, center: true, alpha: u }); });
      note(ctx, "4 ide penting dalam informatika", 960, 720, 30, ap(l, tI - 0.4), { mono: true, color: C.mut });
    },

    // ================= 1. PENGANTAR =================
    tahap(ctx, b, l) {
      const tK = at(b, "kabupaten"), tB = at(b, "babak"), tP = at(b, "provinsi"), tN = at(b, "nasional", 2);
      const tAd = at(b, "adalah");
      fadeIn(ctx, clamp((tAd - l) / 0.4, 0, 1), () => { text(ctx, "Selamat datang di", 960, 400, 40, { weight: 700, align: "center", color: C.mut }); text(ctx, "Bedah Soal OSN-K Informatika", 960, 500, 80, { disp: true, weight: 800, align: "center", fit: 1700 }); });
      heading(ctx, "// TAHAP OLIMPIADE SAINS NASIONAL", "OSN-K = tingkat kabupaten/kota", ap(l, tAd), 170);
      const S = [["OSN-K", "Kabupaten/Kota", tK], ["OSN-P", "Provinsi", tP], ["OSN", "Nasional", tN]];
      S.forEach(([a, s, t0], i) => {
        const x = 480 + i * 480, u = ap(l, t0 - 0.3); if (u <= 0) return;
        fadeIn(ctx, u, () => {
          const first = i === 0;
          panel(ctx, x - 190, 330, 380, 260, { stroke: first ? C.green : C.line, lw: first ? 5 : 2, fill: first ? "#F1F6EC" : C.panel });
          text(ctx, a, x, 450, 72, { mono: true, weight: 800, align: "center", color: first ? C.green : C.ink });
          text(ctx, s, x, 530, 34, { weight: 700, align: "center", color: C.mut });
          if (i < 2) arrow(ctx, x + 200, 460, x + 280, 460, { color: C.mut, u: ap(l, t0 + 0.2) });
        });
      });
      fadeIn(ctx, ap(l, tB - 0.2), () => chip(ctx, "BABAK PERTAMA", 480, 620, { size: 26, color: C.white, fill: C.red, stroke: C.red, center: true }));
    },
    sumber(ctx, b, l) {
      const t1 = at(b, "Tiga"), tN = at(b, "nomor"), t4 = at(b, "keempat"), tN2 = at(b, "nomor", 2), tJ = at(b, "jenjang"), tT = at(b, "Tim");
      heading(ctx, "// SUMBER SOAL", "Empat soal dari dua tahun", 1, 160);
      const card = (x, w, yr, nums, t0, tn) => fadeIn(ctx, ap(l, t0 - 0.3), () => {
        panel(ctx, x, 300, w, 300, {}); text(ctx, "OSN-K Informatika " + yr, x + 40, 370, 40, { disp: true, weight: 800 });
        nums.forEach((n, i) => { const u = ap(l, tn + i * 0.4); if (u > 0) chip(ctx, "No. " + n, x + 40 + i * 190, 420, { size: 40, color: C.red, stroke: C.red, lw: 3, alpha: u }); });
        fadeIn(ctx, ap(l, tJ - 0.3), () => text(ctx, "Jenjang SMA", x + 40, 565, 30, { weight: 700, color: C.mut }));
      });
      card(200, 860, "2026", [1, 2, 3], t1, tN);
      card(1120, 600, "2025", [6], t4, tN2);
      fadeIn(ctx, ap(l, tT - 0.3), () => text(ctx, "Penyusun: Tim Olimpiade Komputer Indonesia (TOKI)", 960, 690, 36, { weight: 800, align: "center", color: C.green }));
    },
    alur(ctx, b, l) {
      const T = [at(b, "pahami"), at(b, "mencoba"), at(b, "bahas")];
      heading(ctx, "// CARA KITA BELAJAR", "Setiap soal, tiga langkah", 1, 170);
      const S = [["1", "Pahami soal", "baca aturannya pelan-pelan"], ["2", "Coba dulu", "pause, kerjakan sendiri"], ["3", "Bahas bersama", "langkah demi langkah"]];
      S.forEach(([n, a, s], i) => {
        const x = 420 + i * 540, u = ap(l, T[i] - 0.3); if (u <= 0) return;
        fadeIn(ctx, u, () => {
          panel(ctx, x - 230, 300, 460, 340, { stroke: i === 1 ? C.red : C.line, lw: i === 1 ? 4 : 2 });
          ctx.beginPath(); ctx.arc(x, 390, 50, 0, Math.PI * 2); ctx.fillStyle = i === 1 ? C.red : C.green; ctx.fill();
          text(ctx, n, x, 412, 56, { mono: true, weight: 800, align: "center", color: C.white });
          text(ctx, a, x, 520, 48, { disp: true, weight: 800, align: "center" });
          text(ctx, s, x, 585, 28, { weight: 600, align: "center", color: C.mut });
          if (i < 2) arrow(ctx, x + 240, 470, x + 300, 470, { color: C.mut });
        });
      });
    },

    // ================= COBA DULU (semua soal) =================
    coba(ctx, b, l) {
      const tE = speechEnd(b) + 0.2, N = b.countdown || 8;
      text(ctx, "SOAL " + b.soal + " · PAUSE VIDEONYA", 960, 230, 32, { mono: true, weight: 700, color: C.red, align: "center", ls: 6 });
      text(ctx, "Bisakah kamu memecahkan ini?", 960, 360, 104, { disp: true, weight: 800, align: "center", fit: 1700 });
      const left = l < tE ? N : Math.max(0, N - (l - tE)); const s = Math.ceil(left - 1e-6);
      text(ctx, "00:" + String(s).padStart(2, "0"), 960, 590, 190, { mono: true, weight: 800, color: C.green, align: "center" });
      ctx.fillStyle = C.line; rr(ctx, 360, 670, 1200, 16, 8); ctx.fill();
      ctx.fillStyle = C.red; rr(ctx, 360, 670, 1200 * clamp((l - tE) / N, 0, 1), 16, 8); ctx.fill();
      const R = {
        1: ["Deretan 2 5 3 4 1 2  ·  KWAK, KWIK, KWAK, KWIK, KWIK", "Bilangan apa yang tersisa?"],
        2: ["Tembolok muat 3  ·  akses A B C A D B E A  ·  keluarkan yang paling lama tidak diakses", "Siapa yang keluar saat F datang?"],
        3: ["Pesan diterima di menit X diteruskan ke semua kontak di menit X + 1", "Bebek mana yang paling terakhir menerima pesan?"],
        4: ["255 bebek  ·  selalu tanya yang di tengah  ·  barat, barat, timur, barat, timur, ketemu", "Bebek nomor berapa yang memegang koin?"]
      }[b.soal];
      if (R && l > tE - 0.2) fadeIn(ctx, ap(l, tE), () => {
        text(ctx, R[0], 960, 790, 30, { mono: true, weight: 600, color: C.mut, align: "center", fit: 1700 });
        text(ctx, R[1], 960, 860, 44, { weight: 800, align: "center" });
      });
    },

    // ================= 2. SOAL 1 KWAK DAN KWIK =================
    kw_intro(ctx, b, l) {
      const tM = at(b, "mesin"), tK = at(b, "kiri"), tD = at(b, "dua");
      bigNote(ctx, "“Operasi KWAK dan KWIK”", 960, 200, 64, ap(l, 0.1));
      fadeIn(ctx, ap(l, tM - 0.3), () => {
        panel(ctx, 460, 260, 1000, 300, { stroke: C.ink, lw: 4 });
        label(ctx, "// MESIN PAK DENGKLEK", 500, 310);
        row(ctx, [2, 5, 3, 4, 1, 2], rowC(6, 100), 420, { d: 100, s: 80 });
      });
      fadeIn(ctx, ap(l, tK - 0.2), () => { arrow(ctx, 600, 510, 1320, 510, { color: C.red, lw: 5 }); text(ctx, "kiri", 560, 520, 28, { mono: true, weight: 700, color: C.red, align: "right" }); text(ctx, "kanan", 1360, 520, 28, { mono: true, weight: 700, color: C.red }); });
      fadeIn(ctx, ap(l, tD - 0.2), () => { opChip(ctx, "KWAK", 800, 610, { size: 44, center: true }); opChip(ctx, "KWIK", 1120, 610, { size: 44, center: true }); text(ctx, "2 operasi", 960, 760, 32, { mono: true, weight: 700, align: "center", color: C.mut }); });
    },
    kw_kwak(ctx, b, l) {
      const tA = at(b, "mengambil"), tS = at(b, "selisihnya"), tP = at(b, "positif"), tM = at(b, "dimasukkan");
      opChip(ctx, "KWAK", 200, 150, { size: 40 });
      text(ctx, "ambil 2 paling kiri → selisih → taruh di kiri", 450, 192, 30, { weight: 700, color: C.mut });
      const src = [6, 2, 5, 1], x0 = 520, d = 110, y = 380;
      const lift = clamp((l - tA) / 0.5, 0, 1), gone = l > tM;
      src.forEach((v, i) => {
        const take = i < 2 && l > tA; if (take && gone && l > tM + 0.6) return;
        tile(ctx, v, x0 + i * d, y - (take ? 70 * ease(lift) : 0), { s: 90, state: take ? "take" : null, alpha: take && gone ? clamp(1 - (l - tM) / 0.6, 0, 1) : 1 });
      });
      fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, 1160, 250, 600, 230, {}); label(ctx, "// SELISIH", 1200, 300); text(ctx, "|6 − 2| = 4", 1460, 410, 72, { mono: true, weight: 800, align: "center", color: C.red }); });
      fadeIn(ctx, ap(l, tP - 0.2), () => text(ctx, "yang besar − yang kecil, tidak pernah negatif", 1460, 530, 26, { weight: 700, align: "center", color: C.mut, fit: 580 }));
      fadeIn(ctx, ap(l, tM - 0.2), () => {
        text(ctx, "hasil:", 400, 640, 32, { mono: true, weight: 700, color: C.mut, align: "right" });
        row(ctx, [4, 5, 1], x0, 630, { d, s: 90, st: i => i === 0 ? "new" : null });
        text(ctx, "← masuk di ujung kiri", x0 + 3 * d - 20, 642, 30, { weight: 700, color: C.green });
      });
    },
    kw_kwik(ctx, b, l) {
      const tK = at(b, "kanan"), tT = at(b, "menambahkan"), tS = at(b, "setiap");
      opChip(ctx, "KWIK", 200, 150, { size: 40 });
      text(ctx, "ambil 1 paling kanan → tambahkan ke semua sisanya", 440, 192, 30, { weight: 700, color: C.mut });
      const src = [4, 5, 1], x0 = 620, d = 120, y = 380;
      const lift = clamp((l - tK) / 0.5, 0, 1);
      src.forEach((v, i) => { const take = i === 2 && l > tK; tile(ctx, v, x0 + i * d, y - (take ? 70 * ease(lift) : 0), { s: 90, state: take ? "take" : null, alpha: take && l > tS + 0.4 ? clamp(1 - (l - tS - 0.4) / 0.6, 0.15, 1) : 1 }); });
      [0, 1].forEach(i => { const u = ap(l, tT + i * 0.25); if (u > 0) chip(ctx, "+1", x0 + i * d, y - 120 - (1 - u) * 20, { size: 30, color: C.white, fill: C.red, stroke: C.red, center: true, alpha: u }); });
      fadeIn(ctx, ap(l, tS + 0.2), () => {
        text(ctx, "hasil:", 520, 642, 32, { mono: true, weight: 700, color: C.mut, align: "right" });
        row(ctx, [5, 6], x0, 630, { d, s: 90, st: () => "new" });
        text(ctx, "4 + 1   5 + 1", x0 - 50, 730, 26, { mono: true, weight: 700, color: C.green });
        panel(ctx, 1180, 560, 560, 150, {}); text(ctx, "1 diambil, tidak tersisa", 1460, 650, 34, { weight: 800, align: "center", color: C.red });
      });
    },
    kw_soal(ctx, b, l) {
      const tD = at(b, "Deretan"), tS = at(b, "satu", 2), tB = at(b, "berapakah");
      const ops = [["KWAK", 1], ["KWIK", 1], ["KWAK", 2], ["KWIK", 2], ["KWIK", 3]];
      label(ctx, "// DERETAN AWAL", 260, 200);
      row(ctx, [2, 5, 3, 4, 1, 2], rowC(6, 110), 290, { d: 110, s: 92, a: i => ap(l, tD + 0.3 + i * 0.35) });
      label(ctx, "// URUTAN OPERASI", 260, 430);
      let x = 260; ops.forEach(([s, n], i) => { const u = ap(l, at(b, s, n) - 0.15, 0.3); const w = opChip(ctx, (i + 1) + ". " + s, x, 460, { size: 34, alpha: u }); x += w + 30; });
      fadeIn(ctx, ap(l, tS - 0.2), () => { text(ctx, "sisa satu bilangan:", 1010, 680, 40, { weight: 800, align: "right" }); tile(ctx, "?", 1100, 665, { s: 110, state: "q" }); });
      fadeIn(ctx, ap(l, tB - 0.2), () => text(ctx, "berapa?", 1190, 685, 48, { disp: true, weight: 800, color: C.red }));
    },
    kw_jalan(ctx, b, l) {
      const k = b.langkah; const steps = k === 5 ? [4, 5] : [k];
      const T = {};
      if (k === 1) T[1] = [at(b, "mengambil"), at(b, "Selisihnya"), at(b, "menjadi")];
      if (k === 2) T[2] = [at(b, "mengambil"), at(b, "menambahkan"), at(b, "Deretannya")];
      if (k === 3) T[3] = [at(b, "mengambil"), at(b, "Selisihnya"), at(b, "menjadi")];
      if (k === 5) { T[4] = [at(b, "mengambil", 1), at(b, "menambahkannya", 1), at(b, "Deretannya")]; T[5] = [at(b, "mengambil", 2), at(b, "menambahkannya", 2), at(b, "Hasilnya")]; }
      const Y = i => 150 + i * 96, X0 = 640, D = 92;
      label(ctx, "// JEJAK LANGKAH", 150, 125);
      for (let i = 0; i <= 5; i++) {
        const live = steps.includes(i); const t = T[i]; if (i > Math.max(...steps)) break;
        const rowU = live ? ap(l, (KW_OPS[i] === "KWIK" && i < 5 ? t[1] + 0.3 : t[2] - 0.1)) : 1; const y = Y(i) + 40;
        // label baris
        fadeIn(ctx, live ? ap(l, t[0] - 0.4) : 1, () => {
          if (i === 0) text(ctx, "awal", 470, y + 12, 30, { mono: true, weight: 700, color: C.mut, align: "right" });
          else { text(ctx, i + ".", 300, y + 12, 30, { mono: true, weight: 800, color: C.mut, align: "right" }); opChip(ctx, KW_OPS[i], 320, y - 26, { size: 26 }); }
        });
        const next = steps.find(s => s === i + 1);   // baris ini sumber untuk langkah aktif?
        const takeIdx = next ? KW_TAKE(next) : []; const tTake = next ? T[next][0] : 1e9;
        row(ctx, KW_ROWS[i], X0, y, { d: D, s: 76, a: () => rowU,
          st: j => (l > tTake && takeIdx.includes(j)) ? "take" : (i === 5 && live && l > t[2]) ? "gold" : (live && l < t[2] + 1.2 && ((KW_OPS[i] === "KWAK" && j === 0) || KW_OPS[i] === "KWIK")) ? "new" : null });
        if (live && KW_OPS[i] === "KWIK" && i < 5) {   // tanda +n di atas ubin baru
          const add = KW_ROWS[i - 1][KW_ROWS[i - 1].length - 1]; const u = ap(l, t[1] + 0.3) * clamp((t[2] + 1.0 - l) / 0.4, 0, 1);
          if (u > 0) KW_ROWS[i].forEach((_, j) => chip(ctx, "+" + add, X0 + j * D + 32, y - 52, { size: 18, color: C.white, fill: C.red, stroke: C.red, center: true, alpha: u }));
        }
      }
      // panel hitungan
      const cur = steps.filter(s => l > T[s][1] - 0.2).pop();
      if (cur) {
        panel(ctx, 1260, 180, 520, 260, {}); label(ctx, "// LANGKAH " + cur + " · " + KW_OPS[cur], 1300, 230);
        text(ctx, KW_CALC[cur], 1520, 350, KW_CALC[cur].length > 12 ? 38 : 64, { mono: true, weight: 800, align: "center", color: C.red, fit: 460 });
      }
      if (k === 5) fadeIn(ctx, ap(l, T[5][2] + 0.3), () => { text(ctx, "← tersisa satu bilangan", X0 + 70, Y(5) + 52, 34, { weight: 800, color: C.green }); });
    },
    kw_jawab(ctx, b, l) {
      const tJ = at(b, "Jebakannya"), tB = at(b, "banyaknya");
      label(ctx, "// JAWABAN SOAL 1", 960, 170, { align: "center" });
      tile(ctx, 12, 960, 320, { s: 180, state: "gold" }); check(ctx, 1110, 300, 90, C.green, clamp(l / 0.6, 0, 1));
      fadeIn(ctx, ap(l, tJ - 0.2), () => {
        panel(ctx, 260, 480, 1400, 280, { stroke: C.red, lw: 3 }); label(ctx, "// JEBAKAN: OPERASI KWIK", 300, 530, { color: C.red });
        text(ctx, "Bilangan yang diambil KWIK tidak ikut tersisa.", 300, 595, 38, { weight: 800, fit: 1320 });
      });
      fadeIn(ctx, ap(l, tB - 0.4), () => {
        const N = [6, 5, 4, 3, 2, 1]; N.forEach((n, i) => { const u = ap(l, tB - 0.2 + i * 0.2); if (u <= 0) return; fadeIn(ctx, u, () => { text(ctx, n + " bilangan", 380 + i * 225, 700, 30, { mono: true, weight: 800, align: "center", color: i === 5 ? C.green : C.ink }); if (i < 5) text(ctx, "→", 380 + i * 225 + 112, 700, 30, { mono: true, weight: 800, align: "center", color: C.mut }); }); });
      });
    },
    kw_konsep(ctx, b, l) {
      const tT = at(b, "Tulis"), tJ = at(b, "jangan"), tP = at(b, "Programmer");
      heading(ctx, "// KONSEP", "Menelusuri langkah demi langkah", 1, 160);
      fadeIn(ctx, ap(l, tT - 0.3), () => {
        panel(ctx, 220, 300, 760, 420, {}); label(ctx, "// CATATAN DI KERTAS", 260, 350);
        KW_ROWS.forEach((r, i) => { text(ctx, (i ? i + ". " + KW_OPS[i] : "awal"), 260, 410 + i * 50, 26, { mono: true, weight: 700, color: C.mut }); text(ctx, r.join("  "), 520, 410 + i * 50, 30, { mono: true, weight: 800 }); });
      });
      fadeIn(ctx, ap(l, tJ - 0.3), () => { panel(ctx, 1040, 300, 660, 160, { stroke: C.red, lw: 3 }); text(ctx, "Jangan melompat", 1370, 370, 40, { disp: true, weight: 800, align: "center", color: C.red }); text(ctx, "di dalam kepala", 1370, 420, 32, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tP - 0.3), () => { panel(ctx, 1040, 500, 660, 220, { stroke: C.green, lw: 3 }); text(ctx, "Programmer juga begitu", 1370, 570, 38, { disp: true, weight: 800, align: "center" }); chip(ctx, "trace table", 1370, 610, { size: 32, color: C.green, stroke: C.green, center: true }); });
    },

    // ================= 3. SOAL 2 TEMBOLOK =================
    tb_intro(ctx, b, l) {
      const tC = at(b, "cache"), tK = at(b, "Komputer", 2), tD = at(b, "diambil");
      bigNote(ctx, "“Tembolok Komputer”", 960, 200, 64, ap(l, 0.1));
      fadeIn(ctx, ap(l, tK - 0.3), () => {
        panel(ctx, 160, 330, 380, 260, {}); // prosesor
        rr(ctx, 270, 380, 160, 130, 12); ctx.fillStyle = C.ink; ctx.fill(); for (let k = 0; k < 5; k++) { ctx.fillStyle = C.mut; ctx.fillRect(285 + k * 28, 366, 10, 14); ctx.fillRect(285 + k * 28, 510, 10, 14); }
        text(ctx, "CPU", 350, 460, 40, { mono: true, weight: 800, align: "center", color: C.white });
        text(ctx, "Prosesor", 350, 565, 32, { weight: 800, align: "center" });
        panel(ctx, 1380, 290, 380, 340, {}); for (let k = 0; k < 4; k++) { rr(ctx, 1430, 330 + k * 56, 280, 40, 6); ctx.fillStyle = "#EFE8D6"; ctx.fill(); }
        text(ctx, "Penyimpanan besar", 1570, 600, 30, { weight: 800, align: "center" });
      });
      fadeIn(ctx, ap(l, tC - 0.3), () => {
        panel(ctx, 780, 350, 360, 220, { stroke: C.green, lw: 5, fill: "#F1F6EC" });
        text(ctx, "Tembolok", 960, 435, 44, { disp: true, weight: 800, align: "center" });
        chip(ctx, "cache", 960, 465, { size: 32, color: C.green, stroke: C.green, center: true });
      });
      fadeIn(ctx, ap(l, tD - 0.3), () => {
        arrow(ctx, 770, 460, 560, 460, { color: C.green, lw: 7 }); text(ctx, "cepat", 665, 440, 30, { mono: true, weight: 800, align: "center", color: C.green });
        arrow(ctx, 1370, 460, 1150, 460, { color: C.mut, lw: 4, dash: [12, 10] }); text(ctx, "lambat", 1260, 440, 30, { mono: true, weight: 700, align: "center", color: C.mut });
      });
    },
    tb_aturan(ctx, b, l) {
      const R = b.rule;
      const rules = [["1", "Belum ada & masih ada tempat", "→ langsung masukkan"], ["2", "Sudah penuh", "→ keluarkan yang paling lama tidak diakses"], ["3", "Setiap akses", "→ catat waktunya (juga kalau sudah ada)"]];
      const tR = R === 1 ? [at(b, "Kalau"), 1e9, 1e9] : [-1, at(b, "mengeluarkan"), at(b, "Setiap")];
      const xs = [1120, 1380, 1640], y = 400;
      // kartu aturan (kiri bawah)
      rules.forEach(([n, a, s], i) => {
        const u = ap(l, tR[i] - 0.3); if (u <= 0) return; const yy = 160 + i * 150;
        fadeIn(ctx, u, () => {
          panel(ctx, 120, yy, 820, 126, { stroke: (R === 1 && i === 0) || (R === 2 && i > 0 && l > tR[i] && (i === 2 ? true : l < tR[2])) ? C.green : C.line, lw: 3 });
          ctx.beginPath(); ctx.arc(180, yy + 63, 34, 0, Math.PI * 2); ctx.fillStyle = C.green; ctx.fill(); text(ctx, n, 180, yy + 78, 40, { mono: true, weight: 800, align: "center", color: C.white });
          text(ctx, a, 240, yy + 54, 34, { weight: 800, fit: 680 }); text(ctx, s, 240, yy + 100, 28, { weight: 600, color: C.mut, fit: 680 });
        });
      });
      // contoh di kanan
      const frame = { xs, y, alpha: 1 };
      if (R === 1) {
        const tT = at(b, "tiga"), tK = at(b, "kosong"), tM = at(b, "dimasukkan");
        fadeIn(ctx, ap(l, tT - 0.3), () => { slotFrame(ctx, frame); xs.forEach((_, i) => slotBox(ctx, i, null, { xs, y, w: 220 })); });
        fadeIn(ctx, ap(l, tK - 0.3) * clamp((tM - l) / 0.3, 0, 1), () => text(ctx, "awalnya kosong", 1380, 600, 32, { weight: 800, align: "center", color: C.mut }));
        if (l > tM - 0.6) { const u = clamp((l - tM + 0.6) / 0.6, 0, 1); slotBox(ctx, 0, { k: "P" }, { xs, y: lerp(y - 260, y, ease(u)), w: 220, fill: C.greenBg, stroke: C.green, times: false }); }
        fadeIn(ctx, ap(l, tM + 0.2), () => text(ctx, "P masuk", 1120, 600, 32, { weight: 800, align: "center", color: C.green }));
      } else {
        const tP = at(b, "paling"), tD = at(b, "diakses", 2), tS = at(b, "Setiap"), tTr = at(b, "termasuk");
        slotFrame(ctx, frame);
        const kick = l > tD; const upd = l > tTr + 0.3;
        const S0 = [{ k: kick ? "S" : "P", t: kick ? 4 : 1 }, { k: "Q", t: upd ? 5 : 2 }, { k: "R", t: 3 }];
        S0.forEach((s, i) => slotBox(ctx, i, s, { xs, y, w: 220,
          stroke: i === 0 && l > tP && !kick ? C.red : i === 0 && kick && l < tS ? C.green : i === 1 && upd ? C.green : C.line, lw: 5,
          fill: i === 0 && l > tP && !kick ? C.redBg : i === 0 && kick && l < tS ? C.greenBg : i === 1 && upd ? C.greenBg : C.panel,
          color: i === 0 && l > tP && !kick ? C.red : C.ink }));
        if (!kick) { const u = ap(l, 0.3); fadeIn(ctx, u, () => { tile(ctx, "S", 1380, 170, { s: 80, state: "gold" }); text(ctx, "data baru datang", 1440, 182, 28, { weight: 700, color: C.mut }); }); }
        fadeIn(ctx, ap(l, tP - 0.2) * (kick ? clamp(1 - (l - tD) / 0.4, 0, 1) : 1), () => chip(ctx, "paling lama", 1120, 556, { size: 24, color: C.white, fill: C.red, stroke: C.red, center: true }));
        fadeIn(ctx, ap(l, tD) * clamp((tS - l) / 0.4, 0, 1), () => text(ctx, "P keluar, S masuk", 1120, 640, 30, { weight: 800, align: "center", color: C.green }));
        fadeIn(ctx, ap(l, tTr - 0.1), () => { tile(ctx, "Q", 1380, 170, { s: 80, state: "gold" }); text(ctx, "Q diakses lagi → waktunya diperbarui", 1380, 640, 28, { weight: 800, align: "center", color: C.green }); });
      }
    },
    tb_soal(ctx, b, l) {
      const T = [["A", 1], ["B", 1], ["C", 1], ["A", 2], ["D", 1], ["B", 2], ["E", 1], ["A", 3]].map(([k, n]) => at(b, k, n));
      const tF = at(b, "F"), tQ = at(b, "apakah");
      label(ctx, "// URUTAN AKSES DATA", 960, 120, { align: "center" });
      strip(ctx, 0, 0, { y: 230, a: i => i < 8 ? ap(l, T[i] - 0.15, 0.3) : ap(l, tF - 0.2) });
      fadeIn(ctx, ap(l, 0.3), () => { slotFrame(ctx, { y: 520 }); [0, 1, 2].forEach(i => slotBox(ctx, i, null, { y: 520 })); text(ctx, "awalnya kosong", 960, 700, 28, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tQ - 0.2), () => { panel(ctx, 1440, 400, 400, 240, { stroke: C.red, lw: 4 }); text(ctx, "Saat F datang,", 1640, 480, 34, { weight: 800, align: "center" }); text(ctx, "siapa yang", 1640, 530, 34, { weight: 800, align: "center" }); text(ctx, "keluar?", 1640, 590, 48, { disp: true, weight: 800, align: "center", color: C.red }); });
    },
    tb_jalan(ctx, b, l) {
      const u = b.upto; const prev = { 3: 0, 4: 3, 5: 4, 7: 5, 8: 7 }[u];
      // langkah aktif: [i, tMulai, tSelesai]
      let S = [];
      if (u === 3) S = [[1, at(b, "A", 1)], [2, at(b, "B", 1)], [3, at(b, "C", 1)]].map(([i, t]) => [i, t - 0.1, t + 0.5]);
      if (u === 4) S = [[4, at(b, "diakses"), at(b, "berubah")]];
      if (u === 5) S = [[5, at(b, "datang"), at(b, "keluar")]];
      if (u === 7) S = [[6, at(b, "datang", 1), at(b, "keluar", 1)], [7, at(b, "datang", 2), at(b, "keluar", 2)]];
      if (u === 8) S = [[8, at(b, "datang"), at(b, "keluar")]];
      let shown = prev, cur = 0, pending = null;
      for (const [i, t0, t1] of S) { if (l >= t0) { cur = i; if (l >= t1) shown = i; else pending = [i, t0, t1]; } }
      if (!cur && prev) cur = 0;
      const nums = u === 3 ? ap(l, at(b, "nomor") - 0.2) : 1;
      strip(ctx, shown, cur, { y: 170, nums });
      const st = LRU[shown]; const Y = 470;
      slotFrame(ctx, { y: Y });
      // korban (paling lama) saat langkah tertunda akan mengeluarkan data
      let victim = -1, hitIdx = -1;
      if (pending) { const nx = LRU[pending[0]]; if (nx.ev) victim = st.slots.findIndex(s => s.k === nx.ev); if (nx.hit) hitIdx = nx.at; }
      const justIn = shown > prev && LRU[shown] && l < (S.find(s => s[0] === shown) || [0, 0, 0])[2] + 1.0 ? LRU[shown].at : -1;
      [0, 1, 2].forEach(i => {
        const s = st.slots[i] || null; const isV = i === victim, isH = i === hitIdx, isN = i === justIn;
        slotBox(ctx, i, s, { y: Y, stroke: isV ? C.red : (isH || isN) ? C.green : C.line, lw: 5, fill: isV ? C.redBg : (isH || isN) ? C.greenBg : undefined, color: isV ? C.red : C.ink, tFill: isN && LRU[shown].hit ? C.gold2 : undefined });
        if (isV) chip(ctx, "paling lama", SX[i], Y + 120, { size: 24, color: C.white, fill: C.red, stroke: C.red, center: true });
      });
      if (pending && LRU[pending[0]].ev) { const k = SEQ[pending[0] - 1]; tile(ctx, k, 1560, Y - 20, { s: 100, state: "gold" }); text(ctx, "masuk →", 1560, Y + 80, 26, { mono: true, weight: 700, align: "center", color: C.mut }); }
      // log data yang keluar
      const evs = []; for (let i = 1; i <= shown; i++) if (LRU[i].ev) evs.push([LRU[i].ev, i]);
      if (evs.length) {
        text(ctx, "keluar:", 560, 715, 30, { mono: true, weight: 700, color: C.mut, align: "right" });
        evs.forEach(([k, i], j) => chip(ctx, k + " · di waktu " + i, 590 + j * 270, 680, { size: 26, color: C.red, stroke: C.red }));
      }
      if (u === 8) fadeIn(ctx, ap(l, at(b, "Isi") - 0.2), () => hilite(ctx, SX[0] - 125, Y - 115, SX[2] - SX[0] + 250, 230, C.green, 1, "rgba(31,122,85,0.06)"));
    },
    tb_jawab(ctx, b, l) {
      const tF = at(b, "F"), tP = at(b, "paling"), tJ = at(b, "jawaban"), tD = at(b, "D");
      const st = LRU[8]; const Y = 360; const out = l > tJ;
      slotFrame(ctx, { y: Y });
      [0, 1, 2].forEach(i => {
        const s = out && st.slots[i].k === "B" ? { k: "F", t: 9 } : st.slots[i]; const isB = st.slots[i].k === "B" && l > tP && !out;
        slotBox(ctx, i, s, { y: Y, stroke: isB ? C.red : out && s.k === "F" ? C.green : C.line, lw: 5, fill: isB ? C.redBg : out && s.k === "F" ? C.greenBg : undefined, color: isB ? C.red : C.ink });
        if (isB) chip(ctx, "paling lama", SX[i], Y + 120, { size: 24, color: C.white, fill: C.red, stroke: C.red, center: true });
      });
      if (!out) fadeIn(ctx, ap(l, tF - 0.2), () => tile(ctx, "F", 1560, Y - 20, { s: 100, state: "gold" }));
      fadeIn(ctx, ap(l, tJ - 0.2), () => { panel(ctx, 1440, 230, 380, 250, { stroke: C.green, lw: 4 }); label(ctx, "// JAWABAN", 1630, 285, { align: "center" }); text(ctx, "B", 1630, 430, 130, { mono: true, weight: 800, align: "center", color: C.red }); });
      fadeIn(ctx, ap(l, tD - 0.2), () => {
        panel(ctx, 300, 560, 1320, 200, {});
        text(ctx, "paling lama MASUK (FIFO)", 340, 630, 34, { weight: 800, color: C.purple }); text(ctx, "→ D", 1180, 630, 40, { mono: true, weight: 800, color: C.purple }); cross(ctx, 1320, 618, 36, C.purple);
        text(ctx, "paling lama TIDAK DIAKSES (LRU)", 340, 710, 34, { weight: 800, color: C.green }); text(ctx, "→ B", 1180, 710, 40, { mono: true, weight: 800, color: C.green }); check(ctx, 1320, 700, 46, C.green);
      });
    },
    tb_konsep(ctx, b, l) {
      const tS = at(b, "singkatan"), tA = at(b, "artinya"), tBr = at(b, "Browser"), tPr = at(b, "prosesor");
      heading(ctx, "// KONSEP", "LRU cache", 1, 160);
      fadeIn(ctx, ap(l, tS - 0.3), () => {
        const W = [["L", "east"], ["R", "ecently"], ["U", "sed"]]; let x = 520;
        W.forEach(([a, r]) => { const w1 = text(ctx, a, x, 400, 80, { disp: true, weight: 800, color: C.red }); const w2 = text(ctx, r, x + w1, 400, 80, { disp: true, weight: 800 }); x += w1 + w2 + 30; });
      });
      note(ctx, "= paling lama tidak dipakai, dia yang keluar", 960, 480, 36, ap(l, tA - 0.3), { color: C.green, weight: 800 });
      fadeIn(ctx, ap(l, tBr - 0.3), () => {
        panel(ctx, 420, 540, 460, 220, {}); rr(ctx, 420, 540, 460, 46, 16); ctx.fillStyle = "#EFE8D6"; ctx.fill();
        [C.red, C.gold, C.green].forEach((c, i) => { ctx.beginPath(); ctx.arc(450 + i * 28, 563, 8, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); });
        text(ctx, "Browser", 650, 690, 40, { disp: true, weight: 800, align: "center" });
      });
      fadeIn(ctx, ap(l, tPr - 0.3), () => {
        panel(ctx, 1040, 540, 460, 220, {}); rr(ctx, 1200, 580, 140, 110, 10); ctx.fillStyle = C.ink; ctx.fill(); text(ctx, "CPU", 1270, 648, 34, { mono: true, weight: 800, align: "center", color: C.white });
        text(ctx, "Prosesor", 1270, 740, 34, { disp: true, weight: 800, align: "center" });
      });
    },

    // ================= 4. SOAL 3 PESAN RAHASIA =================
    ps_graf(ctx, b, l) {
      const mode = b.mode, M = b.menit || 0;
      // waktu kejadian (per beat)
      let tNodes = 0, tEdges = 0, tA0 = 1e9;
      if (mode === "intro") { tNodes = at(b, "delapan") - 0.2; tEdges = at(b, "tanda") - 0.2; }
      if (mode === "tanya") tA0 = at(b, "menerima");
      const nodesU = mode === "intro" ? ap(l, tNodes) : 1;
      // pengiriman per menit dalam beat ini: [dari, ke, t0, diabaikan]
      let sends = [];
      if (mode === "jalan" && M === 1) sends = [["A", "B", at(b, "meneruskan")], ["A", "C", at(b, "meneruskan")]];
      if (mode === "jalan" && M === 2) { const tb = at(b, "B"), tc = at(b, "C"); sends = [["B", "F", tb], ["C", "D", tc], ["C", "E", tc]]; }
      if (mode === "jalan" && M === 3) sends = [["D", "F", at(b, "D"), true], ["E", "G", at(b, "E")], ["F", "H", at(b, "F", 3)]];
      if (mode === "jalan" && M === 4) sends = [["G", "H", at(b, "G"), true]];
      const known = n => { // menit diterima, sudah tampil?
        const m = MIN[n]; if (mode === "intro" || mode === "aturan") return false;
        if (mode === "tanya") return n === "A" && l > tA0;
        if (mode === "jawab") return true;
        if (m < M) return true; if (m > M) return false;
        const s = sends.find(x => x[1] === n && !x[3]); return s ? l > s[2] + 0.8 : false;
      };
      // panah
      EDGES.forEach(([a, c], i) => {
        const u = mode === "intro" ? clamp((l - tEdges - i * 0.12) / 0.4, 0, 1) : 1; if (u <= 0) return;
        let color = C.ink, lw = 6; const done = known(c) && known(a) && MIN[c] === MIN[a] + 1;
        if (mode === "jalan" || mode === "jawab") { if (done) color = C.green; else { color = GREY; } }
        const ign = sends.find(x => x[0] === a && x[1] === c && x[3]);
        const pastIgn = (mode === "jalan" && M >= 3 && a === "D" && c === "F" && M > 3) || (mode === "jalan" && M === 4 && a === "D") || mode === "jawab" && ((a === "D" && c === "F") || (a === "G" && c === "H"));
        if ((ign && l > ign[2] + 0.8) || pastIgn) color = "rgba(138,63,168,0.55)";
        if (mode === "jawab" && l > at(b, "Jebakannya") && ["A>B", "B>F", "F>H"].includes(a + ">" + c)) { color = C.red; lw = 9; }
        edge(ctx, a, c, { u, color, lw, dash: (ign && l > ign[2] + 0.8) || pastIgn ? [10, 9] : null });
        if ((ign && l > ign[2] + 0.8)) { const [x1, y1, x2, y2] = edgeEnds(a, c); cross(ctx, (x1 + x2) / 2, (y1 + y2) / 2, 36, C.purple, clamp((l - ign[2] - 0.8) / 0.4, 0, 1)); }
      });
      // amplop berjalan
      sends.forEach(([a, c, t0]) => travel(ctx, a, c, (l - t0) / 0.8));
      // bebek
      Object.keys(P).forEach((n, i) => {
        const u = mode === "intro" ? clamp((l - tNodes - i * 0.12) / 0.3, 0, 1) : 1; if (u <= 0) return;
        const k = known(n); const isAns = mode === "jawab" && (n === "G" || n === "H") && l > at(b, "G", 1) - 0.2;
        const win = mode === "jawab" && n === "G" && l > at(b, "jawaban") - 0.2;
        const isNew = mode === "jalan" && MIN[n] === M && k;
        duck(ctx, P[n][0], P[n][1], DR, n, { alpha: u, fill: k ? (isAns ? C.red : C.green) : C.ink, ring: win ? "rgba(232,197,90,0.6)" : isNew ? "rgba(31,122,85,0.16)" : null });
        if (k) chip(ctx, "menit " + MIN[n], P[n][0], P[n][1] + 66, { size: 20, center: true, color: isAns ? C.red : C.green, stroke: isAns ? C.red : C.green, fill: C.panel });
      });
      if (mode === "tanya" && l > tA0) envelope(ctx, P.A[0] - 10, P.A[1] - 90, 1);
      // contoh pangkal-ujung (intro)
      if (mode === "intro") {
        const tPk = at(b, "pangkal");
        fadeIn(ctx, ap(l, tPk - 0.3), () => {
          const [x1, y1, x2, y2] = edgeEnds("A", "B"); edge(ctx, "A", "B", { color: C.red, lw: 9 });
          chip(ctx, "pangkal", x1 - 120, y1 - 40, { size: 22, color: C.red, stroke: C.red, center: true });
          chip(ctx, "ujung", x2 - 40, y2 - 110, { size: 22, color: C.red, stroke: C.red, center: true });
          panel(ctx, 1440, 230, 400, 200, { stroke: C.red, lw: 3 }); text(ctx, "A → B", 1640, 310, 56, { mono: true, weight: 800, align: "center", color: C.red });
          text(ctx, "B ada di kontak A", 1640, 380, 30, { weight: 800, align: "center" });
        });
      }
      // panel kanan
      const PX = 1460, PW = 380;
      if (mode === "aturan") {
        const t1 = at(b, "Kalau", 1), t2 = at(b, "Kalau", 2);
        fadeIn(ctx, ap(l, t1 - 0.3), () => { panel(ctx, PX - 20, 150, PW + 20, 280, { stroke: C.green, lw: 3 }); label(ctx, "// ATURAN 1", PX + 10, 200);
          text(ctx, "pertama terima: menit X", PX + 10, 260, 28, { weight: 800, fit: PW - 30 }); text(ctx, "kirim ke SEMUA kontak:", PX + 10, 320, 28, { weight: 800, fit: PW - 30 }); text(ctx, "menit X + 1", PX + 10, 385, 44, { mono: true, weight: 800, color: C.green }); });
        fadeIn(ctx, ap(l, t2 - 0.3), () => { panel(ctx, PX - 20, 460, PW + 20, 200, { stroke: C.purple, lw: 3 }); label(ctx, "// ATURAN 2", PX + 10, 510, { color: C.purple });
          text(ctx, "pesan datang lagi", PX + 10, 570, 30, { weight: 800 }); text(ctx, "→ diabaikan", PX + 10, 625, 34, { weight: 800, color: C.purple }); });
      }
      if (mode === "tanya") {
        const tB = at(b, "manakah"), tK = at(b, "lebih");
        fadeIn(ctx, ap(l, tA0 - 0.2), () => chip(ctx, "menit 0", P.A[0], P.A[1] + 66, { size: 20, center: true, color: C.green, stroke: C.green }));
        fadeIn(ctx, ap(l, tB - 0.3), () => { panel(ctx, PX - 20, 180, PW + 20, 220, { stroke: C.red, lw: 4 }); text(ctx, "Siapa yang", PX + 170, 260, 36, { weight: 800, align: "center" }); text(ctx, "paling terakhir?", PX + 170, 320, 40, { disp: true, weight: 800, align: "center", color: C.red }); });
        fadeIn(ctx, ap(l, tK - 0.3), () => { panel(ctx, PX - 20, 430, PW + 20, 150, {}); text(ctx, "seri → huruf", PX + 170, 495, 32, { weight: 800, align: "center" }); text(ctx, "paling awal (abjad)", PX + 170, 545, 30, { weight: 700, align: "center", color: C.mut }); });
      }
      if (mode === "jalan" || mode === "jawab") {
        panel(ctx, PX - 20, 140, PW + 20, 470, {}); label(ctx, "// MENIT", PX + 10, 190);
        const rowsM = [["0", "A"], ["1", "B, C"], ["2", "D, E, F"], ["3", "G, H"], ["4", "tidak ada yang baru"]];
        rowsM.forEach(([m, s], i) => {
          const mm = +m; let vis = mode === "jawab" || mm < M; let u = 1;
          if (mode === "jalan" && mm === M) { const last = sends.filter(x => !x[3]).map(x => x[2]); const t = last.length ? Math.max(...last) + 0.8 : (sends[0] ? sends[0][2] + 1.0 : 0); u = ap(l, t); vis = u > 0; }
          if (!vis) return;
          fadeIn(ctx, u, () => { text(ctx, m, PX + 20, 260 + i * 76, 40, { mono: true, weight: 800, color: mm === 3 && mode === "jawab" ? C.red : C.green });
            text(ctx, s, PX + 80, 258 + i * 76, mm === 4 ? 26 : 36, { weight: 800, color: mm === 4 ? C.mut : mm === 3 && mode === "jawab" ? C.red : C.ink, fit: PW - 90 }); });
        });
        if (mode === "jawab") fadeIn(ctx, ap(l, at(b, "jawaban") - 0.2), () => { panel(ctx, PX - 20, 630, PW + 20, 120, { stroke: C.green, lw: 4 }); text(ctx, "Jawaban: G", PX + 170, 710, 52, { disp: true, weight: 800, align: "center", color: C.red }); });
        if (mode === "jawab") fadeIn(ctx, ap(l, at(b, "Jebakannya") - 0.2), () => chip(ctx, "jalur atas: A → B → F → H", 795, 120, { size: 26, color: C.red, stroke: C.red, center: true }));
      }
    },
    ps_konsep(ctx, b, l) {
      const tB = at(b, "BFS"), tJ = at(b, "jarak"), tR = at(b, "rute");
      heading(ctx, "// KONSEP", "Pencarian melebar (BFS)", 1, 150);
      fadeIn(ctx, ap(l, tB - 0.3), () => chip(ctx, "BFS = breadth-first search", 960, 250, { size: 28, color: C.green, stroke: C.green, center: true }));
      const L = [["A"], ["B", "C"], ["D", "E", "F"], ["G", "H"]];
      L.forEach((ns, m) => {
        const u = ap(l, 0.4 + m * 0.5); if (u <= 0) return; const x = 260 + m * 260;
        fadeIn(ctx, u, () => {
          rr(ctx, x - 100, 340, 200, 400, 18); ctx.fillStyle = m % 2 ? "rgba(31,122,85,0.10)" : "rgba(31,122,85,0.05)"; ctx.fill();
          text(ctx, "lapis " + m, x, 380, 26, { mono: true, weight: 800, align: "center", color: C.green });
          ns.forEach((n, k) => duck(ctx, x, 480 + k * 100, 40, n, { fill: C.green }));
        });
      });
      fadeIn(ctx, ap(l, tJ - 0.3), () => text(ctx, "menit = jarak terpendek dari A", 650, 790, 32, { weight: 800, align: "center", color: C.red }));
      fadeIn(ctx, ap(l, tR - 0.3), () => {
        panel(ctx, 1260, 340, 520, 400, {}); ctx.save(); rr(ctx, 1260, 340, 520, 400, 16); ctx.clip();
        ctx.fillStyle = "#E9E1CC"; for (let k = 0; k < 5; k++) { ctx.fillRect(1260, 380 + k * 80, 520, 18); ctx.fillRect(1300 + k * 110, 340, 18, 400); }
        ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(1309, 709); ctx.lineTo(1309, 469); ctx.lineTo(1529, 469); ctx.lineTo(1529, 389); ctx.lineTo(1639, 389); ctx.stroke(); ctx.restore();
        ctx.beginPath(); ctx.arc(1309, 709, 14, 0, Math.PI * 2); ctx.fillStyle = C.green; ctx.fill(); ctx.beginPath(); ctx.arc(1639, 389, 14, 0, Math.PI * 2); ctx.fillStyle = C.red; ctx.fill();
        text(ctx, "aplikasi peta", 1520, 790, 32, { weight: 800, align: "center" });
      });
    },

    // ================= 5. SOAL 4 PENCARIAN KOIN =================
    bs_intro(ctx, b, l) {
      const tD = at(b, "Ada"), tB = at(b, "barat"), tN = at(b, "bernomor"), tK = at(b, "koin", 2);
      bigNote(ctx, "“Pencarian Koin”", 960, 170, 60, ap(l, 0.1));
      note(ctx, "OSN-K 2025 · SMA · No. 6", 960, 225, 28, ap(l, 0.3), { mono: true, color: C.mut });
      fadeIn(ctx, ap(l, tD - 0.2), () => {
        const xs = [260, 380, 500, 0, 1420, 1540, 1660], ns = ["1", "2", "3", "", "253", "254", "255"];
        xs.forEach((x, i) => { if (!x) { text(ctx, "· · ·", 960, 360, 60, { weight: 800, align: "center", color: C.mut }); return; } duck(ctx, x, 340, 36, "", {}); fadeIn(ctx, ap(l, tN - 0.2), () => text(ctx, ns[i], x, 420, 28, { mono: true, weight: 800, align: "center", color: C.green })); });
        text(ctx, "255 bebek", 960, 290, 32, { mono: true, weight: 800, align: "center" });
      });
      fadeIn(ctx, ap(l, tB - 0.2), () => line255(ctx, { y: 540, rangeLabel: false }));
      fadeIn(ctx, ap(l, tB + 0.6), () => text(ctx, "1 garis = 1 bebek", 960, 690, 26, { mono: true, weight: 700, align: "center", color: C.mut }));
      fadeIn(ctx, ap(l, tK - 0.3), () => { coin(ctx, 1000, 470, 30, "?", {}); text(ctx, "satu bebek memegang koin", 1050, 480, 28, { weight: 800, color: C.goldInk }); });
    },
    bs_aturan(ctx, b, l) {
      const tK1 = at(b, "Kalau", 1), tK2 = at(b, "Kalau", 2), tT = at(b, "timur");
      const lo = l > tT + 0.1 ? 101 : 1;
      const xOf = line255(ctx, { y: 360, lo, hi: 255, mark: 100, markU: ap(l, 0.4), rangeLabel: l > tT + 0.1 });
      fadeIn(ctx, ap(l, 0.6), () => { panel(ctx, xOf(100) - 30, 150, 470, 90, { stroke: C.red, lw: 3 }); text(ctx, "“Kamu pegang koin?”", xOf(100) + 205, 208, 32, { weight: 800, align: "center" }); });
      fadeIn(ctx, ap(l, tK1 - 0.3), () => { panel(ctx, 200, 520, 680, 150, { stroke: C.green, lw: 3 }); text(ctx, "Ya, pegang koin", 240, 585, 36, { weight: 800 }); text(ctx, "→ permainan selesai", 240, 640, 30, { weight: 700, color: C.green }); });
      fadeIn(ctx, ap(l, tK2 - 0.3), () => { panel(ctx, 1000, 520, 720, 150, { stroke: C.red, lw: 3 }); text(ctx, "Tidak", 1040, 585, 36, { weight: 800 }); text(ctx, "→ “koinnya di barat” atau “di timur”", 1040, 640, 30, { weight: 700, color: C.red, fit: 660 }); });
      fadeIn(ctx, ap(l, tT + 0.1), () => text(ctx, "contoh: jawab “timur” → nomor 1–100 dibuang", 960, 740, 28, { mono: true, weight: 700, align: "center", color: C.mut }));
    },
    bs_soal(ctx, b, l) {
      const tT = at(b, "tengah"), tN = at(b, "berapakah");
      const A = [["barat", 1], ["barat", 2], ["timur", 1], ["barat", 3], ["timur", 2]].map(([s, n]) => [s, at(b, s, n)]); A.push(["koin!", at(b, "keenam")]);
      line255(ctx, { y: 260, mark: 128, markU: ap(l, tT - 0.2), rangeLabel: false });
      fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "selalu tanya bebek di TENGAH barisan yang masih mungkin", 960, 140, 32, { weight: 800, align: "center", color: C.red, fit: 1600 }));
      label(ctx, "// JAWABAN BERTURUT-TURUT", 200, 470);
      A.forEach(([s, t], i) => { const u = ap(l, t - 0.15, 0.3); if (u <= 0) return; const x = 200 + i * 260;
        chip(ctx, (i + 1) + ". " + s, x, 500, { size: 32, color: s === "koin!" ? C.goldInk : C.ink, stroke: s === "koin!" ? C.goldRim : C.line, fill: s === "koin!" ? C.gold2 : undefined, alpha: u }); });
      fadeIn(ctx, ap(l, tN - 0.3), () => text(ctx, "Bebek nomor berapa yang memegang koin?", 960, 680, 46, { disp: true, weight: 800, align: "center" }));
    },
    bs_jalan(ctx, b, l) {
      const q = b.q; let T = {};
      if (q[0] === 1) T[1] = [at(b, "seratus"), at(b, "barat"), at(b, "tersisa")];
      if (q[0] === 2) { T[2] = [at(b, "enam"), at(b, "barat"), at(b, "tersisa", 1)]; T[3] = [at(b, "Lalu") + 0.3, at(b, "timur"), at(b, "Tersisa", 2)]; }
      if (q[0] === 4) { T[4] = [at(b, "Tengahnya", 1), at(b, "barat"), at(b, "Tersisa", 1)]; T[5] = [at(b, "Tengahnya", 2), at(b, "timur"), at(b, "Tersisa", 2)]; }
      if (q[0] === 6) T[6] = [at(b, "tengah"), at(b, "ternyata"), 1e9];
      // rentang yang tampil
      let lo = 1, hi = 255, mark = 0, mU = 0, done = q[0] - 1;
      for (let i = 1; i <= 6; i++) {
        if (i < q[0]) { lo = QS[i - 1].lo; hi = QS[i - 1].hi; continue; }
        if (!T[i]) break; const [ta, , tc] = T[i];
        if (l >= ta - 0.1) { mark = QS[i - 1].m; mU = ap(l, ta - 0.1, 0.3); }
        if (l >= tc) { lo = QS[i - 1].lo; hi = QS[i - 1].hi; done = i; mark = 0; }
      }
      const z = q[0] >= 4 ? (q[0] === 4 ? ap(l, 0.1, 0.9) : 1) : 0;
      const view = [lerp(1, 33, z), lerp(255, 63, z)];
      const coinAt = q[0] === 6 && l > T[6][1] ? 44 : null;
      line255(ctx, { y: 210, h: z > 0.5 ? 80 : 70, view, lo, hi, mark: coinAt ? null : (mark || null), markU: mU, nums: z > 0.9, coinAt, rangeLabel: !coinAt });
      if (z > 0 && z < 1) note(ctx, "diperbesar: nomor 33–63", 960, 150, 24, 1, { mono: true, color: C.mut });
      if (coinAt) { coin(ctx, 160 + (44 - 33 + 0.5) * (1600 / 31), 150, 34, "", {}); }
      // tabel jejak
      const TY = 380, cols = [220, 420, 680, 930];
      ["ke-", "tanya", "jawab", "sisa"].forEach((h, i) => text(ctx, h, cols[i], TY, 24, { mono: true, weight: 700, color: C.mut }));
      ctx.fillStyle = C.line; ctx.fillRect(200, TY + 14, 1100, 2);
      for (let i = 1; i <= 6; i++) {
        const Q = QS[i - 1]; const y = TY + 20 + i * 55; let ua = 1, ub = 1, uc = 1;
        if (i >= q[0]) { if (!T[i]) continue; ua = ap(l, T[i][0] - 0.2); ub = ap(l, T[i][1] - 0.15); uc = ap(l, T[i][2] - 0.15); }
        if (ua <= 0) continue;
        const cur = T[i] && l < (T[i][2] || 1e9) + 0.6;
        if (cur && q.includes(i)) hilite(ctx, 200, y - 42, 1100, 54, C.green, ua);
        note(ctx, String(i), cols[0] + 10, y, 36, ua, { mono: true, align: "left" });
        note(ctx, String(Q.m), cols[1], y, 36, ua, { mono: true, align: "left", color: C.red });
        note(ctx, Q.a, cols[2], y, 36, ub, { mono: true, align: "left", color: Q.a === "koin" ? C.goldInk : C.ink });
        note(ctx, Q.a === "koin" ? "ketemu: 44" : Q.lo + "–" + Q.hi, cols[3], y, 36, Q.a === "koin" ? ub : uc, { mono: true, align: "left", color: C.green });
      }
      if (q[0] === 6) fadeIn(ctx, ap(l, at(b, "jawaban") - 0.2), () => { panel(ctx, 1400, 420, 400, 260, { stroke: C.green, lw: 4 }); label(ctx, "// JAWABAN", 1600, 480, { align: "center" }); text(ctx, "44", 1600, 630, 130, { mono: true, weight: 800, align: "center", color: C.red }); });
    },
    bs_konsep(ctx, b, l) {
      const tS = at(b, "separuh"), tD = at(b, "delapan"), tK = at(b, "Kalau");
      heading(ctx, "// KONSEP", "Pencarian biner (binary search)", 1, 150);
      const chain = [255, 127, 63, 31, 15, 7, 3, 1];
      chain.forEach((n, i) => { const u = ap(l, tS - 0.2 + i * 0.25, 0.3); if (u <= 0) return; const x = 240 + i * 205;
        chip(ctx, String(n), x, 300, { size: 40, color: i === 7 ? C.green : C.ink, stroke: i === 7 ? C.green : C.line, center: true, alpha: u });
        if (i < 7) note(ctx, "→", x + 102, 345, 34, u, { mono: true, color: C.mut }); });
      fadeIn(ctx, ap(l, tS + 1.6), () => text(ctx, "setiap pertanyaan membuang separuh", 960, 440, 30, { mono: true, weight: 700, align: "center", color: C.mut }));
      fadeIn(ctx, ap(l, tD - 0.3), () => {
        text(ctx, "pencarian biner", 220, 560, 32, { weight: 800 }); rr(ctx, 560, 528, 1100 * 8 / 255, 44, 6); ctx.fillStyle = C.green; ctx.fill(); text(ctx, "paling banyak 8", 620, 562, 32, { mono: true, weight: 800, color: C.green });
      });
      fadeIn(ctx, ap(l, tK - 0.3), () => {
        text(ctx, "satu per satu", 220, 660, 32, { weight: 800 }); const w = 1100 * clamp((l - tK) / 1.2, 0, 1); rr(ctx, 560, 628, Math.max(10, w), 44, 6); ctx.fillStyle = C.red; ctx.fill();
        text(ctx, "sampai 255", 560 + Math.max(10, w) - 16, 662, 32, { mono: true, weight: 800, color: C.white, align: "right" });
      });
    },

    // ================= 6. PENUTUP =================
    skor(ctx, b, l) {
      const T = [at(b, "belas"), at(b, "B"), at(b, "G"), at(b, "puluh")], tB = at(b, "Berapa");
      label(ctx, "// KUNCI JAWABAN", 960, 150, { align: "center" });
      for (let i = 0; i < 4; i++) soalCard(ctx, i, 300 + i * 440, 200, 400, 360, { ans: ap(l, T[i] - 0.1), stroke: l > T[i] ? C.green : null });
      fadeIn(ctx, ap(l, tB - 0.2), () => {
        text(ctx, "Skormu:", 860, 700, 52, { disp: true, weight: 800, align: "right" });
        rr(ctx, 890, 638, 110, 80, 10); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.setLineDash([10, 7]); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "/ 4", 1030, 700, 60, { mono: true, weight: 800, color: C.red });
      });
    },
    ringkas(ctx, b, l) {
      const tM = at(b, "menjalankan"), tS = at(b, "langkah", 2), tC = at(b, "mencatat"), tP = at(b, "program");
      heading(ctx, "// SATU KEBIASAAN", "Teliti, satu langkah demi satu langkah", 1, 150);
      const S = [["Baca aturan", tM], ["Jalankan satu langkah", tS], ["Catat keadaannya", tC]];
      S.forEach(([s, t0], i) => { const x = 420 + i * 540; fadeIn(ctx, ap(l, t0 - 0.3), () => {
        panel(ctx, x - 220, 320, 440, 200, { stroke: C.green, lw: 3 }); ctx.beginPath(); ctx.arc(x, 320, 34, 0, Math.PI * 2); ctx.fillStyle = C.green; ctx.fill();
        text(ctx, String(i + 1), x, 334, 38, { mono: true, weight: 800, align: "center", color: C.white }); text(ctx, s, x, 440, 40, { disp: true, weight: 800, align: "center", fit: 400 });
        if (i < 2) arrow(ctx, x + 230, 420, x + 310, 420, { color: C.mut }); }); });
      fadeIn(ctx, ap(l, tC + 0.6), () => { ctx.save(); ctx.strokeStyle = C.mut; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(1500, 530); ctx.bezierCurveTo(1500, 640, 960, 640, 420 + 0, 640); ctx.lineTo(420, 540); ctx.stroke(); ctx.restore();
        text(ctx, "ulangi sampai selesai", 960, 680, 28, { mono: true, weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tP - 0.3), () => chip(ctx, "menulis dan memeriksa program", 960, 720, { size: 30, color: C.green, stroke: C.green, center: true }));
    },
    kredit(ctx, b, l) {
      const tT = at(b, "Terima");
      fadeIn(ctx, ap(l, 0.2), () => {
        panel(ctx, 260, 120, 1400, 660, {}); label(ctx, "// KREDIT SOAL", 320, 190);
        const R = [["“Operasi KWAK dan KWIK”", "OSN-K Informatika 2026 · SMA · No. 1"], ["“Tembolok Komputer”", "OSN-K Informatika 2026 · SMA · No. 2"],
          ["“Aplikasi Pesan Rahasia”", "OSN-K Informatika 2026 · SMA · No. 3"], ["“Pencarian Koin”", "OSN-K Informatika 2025 · SMA · No. 6"]];
        R.forEach(([j, s], i) => { const u = ap(l, 0.3 + i * 0.3); fadeIn(ctx, u, () => { text(ctx, j, 320, 270 + i * 80, 40, { disp: true, weight: 800, fit: 640 }); text(ctx, s, 1000, 268 + i * 80, 28, { mono: true, weight: 600, color: C.mut, fit: 620 }); }); });
        text(ctx, "Tingkat Kabupaten/Kota", 320, 590, 30, { weight: 600, color: C.mut });
      });
      fadeIn(ctx, ap(l, tT - 0.2), () => {
        text(ctx, "Penyusun: Tim Olimpiade Komputer Indonesia (TOKI)", 320, 660, 36, { weight: 800, color: C.green, fit: 1300 });
        text(ctx, "Naskah soal: osn.toki.id  ·  Gambar soal digambar ulang untuk video ini.", 320, 725, 26, { weight: 600, color: C.mut, fit: 1300 });
      });
    },
    akhir(ctx, b, l) {
      const tS = at(b, "situs"), tT = at(b, "Tulis"), tJ = at(b, "Sampai");
      ctx.save(); ctx.globalAlpha = ap(l, tS - 0.5);
      text(ctx, "BERLATIH SOAL LAIN", 960, 180, 30, { mono: true, weight: 700, align: "center", color: C.green, ls: 4 });
      chip(ctx, "tlx.toki.id", 960, 215, { size: 72, color: C.ink, stroke: C.green, lw: 4, center: true, px: 40, py: 20 });
      ctx.restore();
      fadeIn(ctx, ap(l, tT - 0.3), () => text(ctx, "Tulis skormu di kolom komentar: … / 4", 960, 420, 40, { weight: 800, align: "center", color: C.red }));
      const u = ap(l, tJ - 0.3);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; panel(ctx, 460, 480, 1000, 250, { stroke: C.line });
        label(ctx, "// BERIKUTNYA DI SERI INI", 960, 545, { align: "center" });
        para(ctx, "Mesin BCS: soal stack OSN-K 2025", 960, 625, 52, 900, { disp: true, weight: 800, align: "center", lh: 1.15 }); ctx.restore(); }
    }
  });
})();
