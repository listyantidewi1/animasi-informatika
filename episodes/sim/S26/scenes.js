/* S26 Simulasi praktik: Dijkstra dengan heapq (graf lima kota dari F12.2) dan garis tren dengan statistics.linear_regression
   (data bank sampah dari F12.3) di notebook generik. Tata letak: notebook (x 110–1110, y 122–822) + panel kanan (x 1140–1820):
   gambar graf atau diagram titik. Semua kode sudah diuji dengan python3; output persis sama (E = 9 lewat A-B-C-D-E; jalan D-E = 9
   → A-B-C-E = 11; slope 3.0, intercept 17.0, prediksi 38.0, jumlah kuadrat error 4.0). Muat setelah kiko-core.js, layar.js, layar_kode.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, LK = K.layarKode;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1000, h: 700 };
  const PX = 1140, PW = 680;
  const BLUE = "#1A73C8", GREEN = C.good, RED = LK.T.errInk, AMBER = C.accentDark;
  const SZ = 19;
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const ph = LK.phase;
  const blinkAt = l => Math.floor(l * 2.2) % 2 === 0;

  // ---------- program (diuji dengan python3) ----------
  const G0 = ['import heapq', '', 'graf = {"A": {"B": 2, "C": 5}, "B": {"A": 2, "C": 2, "D": 6},', '        "C": {"A": 5, "B": 2, "D": 2, "E": 7},', '        "D": {"B": 6, "C": 2, "E": 3}, "E": {"C": 7, "D": 3}}'];
  const G1 = ['def dijkstra(graf, asal):', '    jarak = {k: float("inf") for k in graf}', '    dari = {}', '    jarak[asal] = 0', '    antre = [(0, asal)]', '    while antre:',
    '        d, kota = heapq.heappop(antre)', '        if d > jarak[kota]:', '            continue', '        for tetangga, w in graf[kota].items():', '            baru = d + w',
    '            if baru < jarak[tetangga]:', '                jarak[tetangga] = baru', '                dari[tetangga] = kota', '                heapq.heappush(antre, (baru, tetangga))', '    return jarak, dari'];
  const PASTI = '        print("pasti:", kota, d)';
  const G1P = G1.slice(0, 9).concat([PASTI], G1.slice(9));
  const G2 = ['jarak, dari = dijkstra(graf, "A")', 'print(jarak)'];
  const G2O = ["{'A': 0, 'B': 2, 'C': 4, 'D': 6, 'E': 9}"];
  const PO = ["pasti: A 0", "pasti: B 2", "pasti: C 4", "pasti: D 6", "pasti: E 9"];
  const G3 = ['rute = ["E"]', 'while rute[0] != "A":', '    rute.insert(0, dari[rute[0]])', 'print(" - ".join(rute), jarak["E"])'];
  const G3O = ["A - B - C - D - E 9"];
  const G4 = ['graf["D"]["E"] = 9', 'graf["E"]["D"] = 9', 'jarak, dari = dijkstra(graf, "A")'].concat(G3);
  const G4O = ["pasti: A 0", "pasti: B 2", "pasti: C 4", "pasti: D 6", "pasti: E 11", "A - B - C - E 11"];
  const GF = ['graf["C"]["F"] = 4', 'jarak, dari = dijkstra(graf, "A")'];
  const ERR_F = { name: "KeyError", msg: "'F'", kind: "runtime", line: 13, ctx: [[null, "<ipython-input-9> in <cell line: 2>()"], [2, GF[1], true], [null, "<ipython-input-6> in dijkstra(graf, asal)"], [13, G1P[12].trim(), true]] };
  const R1 = ['import statistics', '', 'bulan = [1, 2, 3, 4, 5, 6]', 'sampah = [20, 24, 25, 28, 33, 35]', 'slope, intercept = statistics.linear_regression(bulan, sampah)', 'print("slope:", slope)', 'print("intercept:", intercept)'];
  const R1O = ["slope: 3.0", "intercept: 17.0"];
  const R2 = ['print("prediksi bulan 7:", intercept + slope * 7)'];
  const R2O = ["prediksi bulan 7: 38.0"];
  const R3 = ['total = 0', 'for x, y in zip(bulan, sampah):', '    error = y - (intercept + slope * x)', '    total = total + error ** 2', 'print("jumlah kuadrat error:", total)'];
  const R3O = ["jumlah kuadrat error: 4.0"];
  const R1BAD = R1.slice(0, 5); R1BAD[3] = 'sampah = [20, 24, 25, 28, 33]';
  const ERR_ST = { name: "StatisticsError", msg: "linear regression requires that both inputs have same number of data points", kind: "runtime", line: 5, ctx: [[4, R1BAD[3]], [5, R1BAD[4]]] };
  const BULAN = [1, 2, 3, 4, 5, 6], SAMPAH = [20, 24, 25, 28, 33, 35];

  // ---------- notebook ----------
  const nb = ctx => LK.notebook(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { name: "Rute_dan_Tren.ipynb", status: "tersambung", compact: true });
  function stack(ctx, a, cells) {
    const x = a.x + 20, w = a.w - 40, gap = 18; const hs = cells.map(c => LK.cellHeight(ctx, w, { size: SZ, ...c }));
    const total = hs.reduce((s, h) => s + h, 0) + gap * (cells.length - 1), avail = a.h - 32, off = Math.max(0, total - avail);
    const gs = []; LK.clip(ctx, { x: a.x, y: a.y, w: a.w, h: a.h - 6 }, () => { let y = a.y + 16 - off; cells.forEach((c, i) => { gs.push(LK.cell(ctx, x, y, w, { size: SZ, ...c })); y += hs[i] + gap; }); });
    return gs;
  }
  const doneCell = (lines, out, count, extra = {}) => ({ lines, out, run: "done", count, active: false, ...extra });
  function call(ctx, x, y, s, tx, ty, opt = {}) { return L.callout(ctx, x, y, s, tx, ty, { size: 23, maxW: 560, ...opt }); }
  const play = (c, at) => ({ at, x: c.play.x + 3, y: c.play.y + 3, click: true });
  function panel(ctx, title, h = 700, y = 122) { card(ctx, PX, y, PW, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); if (title) text(ctx, title, PX + 26, y + 44, 24, { weight: 900, color: AMBER }); }

  // ---------- gambar graf ----------
  const POS = { A: [40, 110], B: [130, 40], C: [140, 180], D: [240, 105], E: [320, 170] };
  const P = k => [PX + 70 + POS[k][0] * 1.65, 185 + POS[k][1] * 1.6];
  const EDGES = [["A", "B", 2], ["A", "C", 5], ["B", "C", 2], ["B", "D", 6], ["C", "D", 2], ["C", "E", 7], ["D", "E", 3]];
  // st: {dist {k: angka|null}, done [..], cur, route [..kota], macet, extra: {F: true}, hlEdges [["A","B"]]}
  function graf(ctx, st = {}) {
    panel(ctx, st.title || "GRAF LIMA KOTA", 500);
    const onRoute = (a, b) => { const r = st.route || []; for (let i = 0; i + 1 < r.length; i++) if ((r[i] === a && r[i + 1] === b) || (r[i] === b && r[i + 1] === a)) return true; return false; };
    const hlE = (a, b) => (st.hlEdges || []).some(([p, q]) => (p === a && q === b) || (p === b && q === a));
    EDGES.forEach(([a, b, w]) => { const [x1, y1] = P(a), [x2, y2] = P(b); const mac = st.macet && ((a === "D" && b === "E")); const on = onRoute(a, b), hl = hlE(a, b);
      ctx.strokeStyle = mac ? RED : on ? GREEN : hl ? C.accent : "#B9C6CE"; ctx.lineWidth = on || hl || mac ? 8 : 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(mx, my, 19, 0, 7); ctx.fill(); ctx.strokeStyle = mac ? RED : "#D3DCE2"; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, String(mac ? 9 : w), mx, my + 8, 22, { align: "center", weight: 900, color: mac ? RED : C.ink }); });
    if (st.extra) { const [x1, y1] = P("C"), x2 = x1 + 150, y2 = y1 + 70; ctx.setLineDash([10, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#FDECEA"; ctx.beginPath(); ctx.arc(x2, y2, 30, 0, 7); ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.stroke(); text(ctx, "F", x2, y2 + 10, 28, { align: "center", weight: 900, color: RED }); }
    Object.keys(POS).forEach(k => { const [x, y] = P(k); const done = (st.done || []).includes(k), cur = st.cur === k;
      ctx.fillStyle = done ? GREEN : cur ? C.accent : C.kiko; ctx.beginPath(); ctx.arc(x, y, 32, 0, 7); ctx.fill();
      if (cur) { ctx.strokeStyle = AMBER; ctx.lineWidth = 5; ctx.stroke(); }
      text(ctx, k, x, y + 11, 30, { align: "center", weight: 900, color: "#FFFFFF" });
      if (st.dist) { const v = st.dist[k]; const s = v == null ? "∞" : String(v); const dy = k === "B" ? -48 : 64; ctx.fillStyle = done ? C.goodBg : "#F1F4F6"; rr(ctx, x - 30, y + dy - 26, 60, 36, 10); ctx.fill();
        text(ctx, s, x, y + dy, 25, { align: "center", weight: 900, color: done ? GREEN : C.ink }); } });
  }
  // kotak keterangan di bawah graf (y 640–822)
  function note(ctx, lines, opt = {}) { card(ctx, PX, 640, PW, 182, { fill: opt.fill || "#F7FAF8", r: 18 }); lines.forEach((s, i) => { if (opt.mono) { LK.mono(ctx, 22, 700); ctx.fillStyle = opt.color || C.ink; LK.monoText(ctx, s, PX + 26, 690 + i * 40); } else text(ctx, s, PX + 26, 690 + i * 40, 23, { weight: 700, color: opt.color || C.ink, fit: PW - 52 }); }); }
  const DIST0 = { A: 0 };
  const DIST = { A: 0, B: 2, C: 4, D: 6, E: 9 };

  // ---------- diagram titik ----------
  // st: {n (titik tampil), line (0..1), pred (0..1), errs, xmax}
  function plot(ctx, st = {}) {
    panel(ctx, st.title || "SETORAN BANK SAMPAH (kg)", st.h || 520);
    const x0 = PX + 80, y0 = 122 + (st.h || 520) - 70, w = PW - 130, h = (st.h || 520) - 160, xmax = st.xmax || 8, ymax = 50;
    const X = v => x0 + v / xmax * w, Y = v => y0 - v / ymax * h;
    ctx.strokeStyle = "#E4EAEE"; ctx.lineWidth = 1.5; for (let v = 10; v <= ymax; v += 10) { ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x0 + w, Y(v)); ctx.stroke(); text(ctx, String(v), x0 - 12, Y(v) + 7, 18, { align: "right", weight: 600, color: C.ink2 }); }
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, Y(0)); ctx.lineTo(x0 + w, Y(0)); ctx.moveTo(x0, Y(0)); ctx.lineTo(x0, Y(ymax)); ctx.stroke();
    for (let v = 1; v <= xmax; v++) text(ctx, String(v), X(v), y0 + 26, 18, { align: "center", weight: 600, color: C.ink2 });
    text(ctx, "bulan", x0 + w, y0 + 52, 18, { align: "right", weight: 700, color: C.ink2 });
    if (st.line) { const u = clamp(st.line, 0, 1), xe = lerp(0, st.pred ? 7.5 : 6.5, u); ctx.strokeStyle = BLUE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X(0), Y(17)); ctx.lineTo(X(xe), Y(17 + 3 * xe)); ctx.stroke();
      if (u > 0.9) text(ctx, "y = 17 + 3x", X(1.2), Y(46), 26, { weight: 900, color: BLUE }); }
    if (st.errs) BULAN.forEach((b, i) => { const yl = 17 + 3 * b, yd = SAMPAH[i]; ctx.strokeStyle = yd >= yl ? GREEN : RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X(b), Y(yl)); ctx.lineTo(X(b), Y(yd)); ctx.stroke();
      text(ctx, String(yd - yl), X(b) + 10, (Y(yl) + Y(yd)) / 2 + 30, 18, { weight: 800, color: yd >= yl ? GREEN : RED }); });
    BULAN.slice(0, st.n == null ? 6 : st.n).forEach((b, i) => { ctx.fillStyle = "#C0632F"; ctx.beginPath(); ctx.arc(X(b), Y(SAMPAH[i]), 9, 0, 7); ctx.fill(); });
    if (st.pred) { const u = clamp(st.pred, 0, 1); ctx.globalAlpha = u; ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(X(7), Y(38), 13, 0, 7); ctx.fill(); ctx.strokeStyle = AMBER; ctx.lineWidth = 3; ctx.stroke();
      ctx.setLineDash([6, 6]); ctx.strokeStyle = AMBER; ctx.beginPath(); ctx.moveTo(X(7), Y(38)); ctx.lineTo(X(7), Y(0)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "38", X(7) + 18, Y(38) - 12, 26, { weight: 900, color: AMBER }); ctx.globalAlpha = 1; }
    return { X, Y };
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: AMBER });
      ["mencari jarak terpendek dengan heapq", "menyusun rute dari dictionary dari", "menghitung slope dan intercept", "membuat prediksi dan mengukur error"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 29, { weight: 800 }); ctx.globalAlpha = 1;
      });
      card(ctx, 1100, 280, 560, 190, { fill: "#F7FAF8", stroke: C.kiko, lw: 3, r: 18 }); text(ctx, "Rute terpendek", 1130, 330, 28, { weight: 900, color: C.kiko });
      LK.mono(ctx, 26, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, "A - B - C - D - E  9", 1130, 400);
      card(ctx, 1100, 500, 560, 190, { fill: "#F7FAF8", stroke: BLUE, lw: 3, r: 18 }); text(ctx, "Garis tren", 1130, 550, 28, { weight: 900, color: BLUE });
      LK.mono(ctx, 26, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, "y = 17 + 3x  →  38", 1130, 620);
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: AMBER });
      [["F12.2", "Memilih Solusi Optimal", "Dijkstra pada graf lima kota"], ["F12.3", "Analisis Data untuk Prediksi", "garis tren bank sampah"], ["S06", "Garis Tren di Lembar Kerja", "hasilnya kita cocokkan"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490; card(ctx, x, 300, 460, 320, { fill: i === 2 ? "#F4F6F5" : C.bg2, r: 22 });
        text(ctx, c, x + 230, 380, 54, { align: "center", weight: 900, color: i === 2 ? C.ink2 : C.kiko }); para(ctx, t, x + 230, 445, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 585, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      kiko(ctx, 1660, 730, 100, 0, { wave: l });
    },

    // ----- Dijkstra -----
    g_graf(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(G0, ph(l, sp, 0.06, 0.7));
      const [c] = stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.7 || blinkAt(l), active: true, run: "ready", minLines: 5 }]);
      graf(ctx, { hlEdges: f > 0.72 ? [["A", "B"], ["A", "C"]] : [] });
      if (f > 0.72) { const p = c.code.at(2, 8); LK.focus(ctx, { x: p.x - 4, y: c.code.top(2) + 2, w: c.code.cw * 23 + 8, h: c.code.lh - 4 }, { t: l, pad: 2 }); }
      note(ctx, ['graf["A"] = {"B": 2, "C": 5}', "kota → {tetangga: jarak}"], { mono: false });
    },
    g_fungsi(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(G1, ph(l, sp, 0.04, 0.5));
      stack(ctx, a, [doneCell(G0, null, 1), { lines: T.lines, caret: T.done ? null : T.caret, blink: blinkAt(l), active: true, run: "ready", hl: f > 0.55 ? [1, 3] : [] }]);
      graf(ctx, { dist: f > 0.55 ? DIST0 : null, title: "JARAK AWAL" });
      if (f > 0.55) note(ctx, ['float("inf") = tak hingga (∞)', "kota asal A = 0"], { color: C.ink });
      else note(ctx, ["Kode lengkapnya ada di bagian", "Untuk guru, halaman latihan F12.2."], { color: C.ink2 });
    },
    g_heappop(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const hl = f < 0.48 ? [6] : [9, 10, 11, 12, 13, 14];
      stack(ctx, a, [doneCell(G0, null, 1), { lines: G1, active: true, run: "ready", hl }]);
      const step = f < 0.48 ? 0 : 1;
      graf(ctx, { dist: step ? { A: 0, B: 2, C: 5 } : DIST0, cur: "A", done: step ? ["A"] : [], hlEdges: step ? [["A", "B"], ["A", "C"]] : [], title: "LANGKAH PERTAMA" });
      if (!step) note(ctx, ["antre = [(0, 'A')]", "heappop → (0, 'A')"], { mono: true });
      else note(ctx, ["B: ∞ → 0 + 2 = 2, lalu push (2, 'B')", "C: ∞ → 0 + 5 = 5, lalu push (5, 'C')"], { color: GREEN });
    },
    g_jalan(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(G2, ph(l, sp, 0.04, 0.3)); const ran = f > 0.4;
      const gs = stack(ctx, a, [doneCell(G1, null, 2), { lines: T.lines, caret: ran ? null : T.caret, blink: blinkAt(l), active: true, run: ran ? "done" : f > 0.34 ? "running" : "ready", spin: l, count: 3, out: ran ? G2O : null }]);
      const c = gs[1]; if (ran && c.out) LK.focus(ctx, { x: c.x + 86, y: c.out.lines[0] - 22, w: 500, h: 30 }, { t: l, color: GREEN });
      graf(ctx, { dist: ran ? DIST : DIST0, done: ran ? ["A", "B", "C", "D", "E"] : [], title: "JARAK TERPENDEK DARI A" });
      note(ctx, ran ? ["Sama dengan tabel di F12.2:", "B 2 · C 4 · D 6 · E 9"] : ["dijkstra(graf, \"A\")", "mengembalikan jarak dan dari"]);
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.34), { at: 0.6, x: 800, y: 790 }]);
    },
    g_pasti(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const r = LK.insert(G1, 9, [PASTI], ph(l, sp, 0.04, 0.3)); const ran = f > 0.42;
      const k = ran ? clamp(Math.floor((f - 0.42) / 0.08) + 1, 1, 6) : 0;
      const gs = stack(ctx, a, [{ lines: r.lines, caret: f < 0.3 ? r.caret : null, blink: blinkAt(l), active: f < 0.36, run: "ready", hl: [9], size: 17 }, { lines: G2, active: f >= 0.36, run: ran ? (k < 6 ? "running" : "done") : "ready", spin: l, count: 5, out: ran ? PO.slice(0, Math.min(5, k)).concat(k >= 6 ? G2O : []) : null }]);
      const order = ["A", "B", "C", "D", "E"].slice(0, Math.min(5, k));
      const dist = {}; order.forEach(x => dist[x] = DIST[x]);
      graf(ctx, { dist: k ? Object.assign({ A: 0 }, dist) : DIST0, done: order, cur: order[order.length - 1], title: "URUTAN KOTA DIPASTIKAN" });
      note(ctx, [order.length ? "pasti: " + order.join(" → ") : "print(\"pasti:\", kota, d)", "selalu yang jaraknya terkecil"], { color: order.length ? GREEN : C.ink });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(gs[1], 0.4), { at: 0.6, x: 800, y: 790 }]);
    },
    g_rute(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(G3, ph(l, sp, 0.04, 0.55));
      stack(ctx, a, [doneCell(G2, G2O, 5), { lines: T.lines, caret: T.caret, blink: f < 0.55 || blinkAt(l), active: true, run: "ready" }]);
      const back = ["E", "D", "C", "B", "A"]; const n = f < 0.55 ? 1 : clamp(Math.floor((f - 0.55) / 0.09) + 1, 1, 5);
      graf(ctx, { dist: DIST, done: back.slice(0, n), route: back.slice(0, n), title: "MUNDUR DARI E" });
      note(ctx, ["dari = {'B': 'A', 'C': 'B',", "        'D': 'C', 'E': 'D'}"], { mono: true });
    },
    g_rute_jalan(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.12;
      const gs = stack(ctx, a, [doneCell(G2, G2O, 5), { lines: G3, active: true, run: ran ? "done" : "running", spin: l, count: 6, out: ran ? G3O : null }]);
      const c = gs[1]; if (ran && c.out) LK.focus(ctx, { x: c.x + 86, y: c.out.lines[0] - 22, w: 250, h: 30 }, { t: l, color: GREEN });
      graf(ctx, { dist: DIST, done: ["A", "B", "C", "D", "E"], route: ran ? ["A", "B", "C", "D", "E"] : [], title: "RUTE TERPENDEK" });
      note(ctx, ['" - ".join(rute)', "menyambung nama kota dengan strip"], { mono: false });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.06), { at: 0.5, x: 800, y: 790 }]);
    },
    g_macet(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.insert(G4.slice(2), 0, G4.slice(0, 2), ph(l, sp, 0.04, 0.3)); const ran = f > 0.48;
      const k = ran ? clamp(Math.floor((f - 0.48) / 0.06) + 1, 1, 6) : 0;
      const gs = stack(ctx, a, [doneCell(G3, G3O, 6), { lines: T.lines, caret: f < 0.3 ? T.caret : null, blink: blinkAt(l), active: true, run: ran ? (k < 6 ? "running" : "done") : "ready", spin: l, count: 7, hl: f > 0.3 && f < 0.48 ? [0, 1] : [], out: ran ? G4O.slice(0, k) : null }]);
      const c = gs[1]; if (k >= 6 && c.out) LK.focus(ctx, { x: c.x + 86, y: c.out.lines[5] - 22, w: 220, h: 30 }, { t: l, color: GREEN });
      const D2 = { A: 0, B: 2, C: 4, D: 6, E: 11 };
      graf(ctx, { dist: k >= 5 ? D2 : DIST, macet: f > 0.2, done: k >= 6 ? ["A", "B", "C", "E"] : [], route: k >= 6 ? ["A", "B", "C", "E"] : [], title: "JALAN D–E MACET" });
      note(ctx, k >= 6 ? ["Rute baru: A - B - C - E", "panjang 11 (lewat D: 6 + 9 = 15)"] : ["Ubah di kedua arah:", 'graf["D"]["E"] dan graf["E"]["D"]'], { color: k >= 6 ? GREEN : C.ink });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.46), { at: 0.7, x: 800, y: 790 }]);
    },

    // ----- garis tren -----
    r_data(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(R1.slice(0, 4), ph(l, sp, 0.1, 0.75));
      stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.75 || blinkAt(l), active: true, run: "ready", minLines: 7, size: 20 }]);
      const n = T.lines.length >= 4 ? clamp(Math.floor((f - 0.5) / 0.04), 0, 6) : 0;
      plot(ctx, { n, title: "DATA DARI F12.3 (rekaan)" });
      card(ctx, PX, 670, PW, 152, { fill: "#F7FAF8", r: 18 });
      text(ctx, "bulan", PX + 26, 720, 22, { weight: 800, color: C.ink2 }); text(ctx, "sampah", PX + 26, 780, 22, { weight: 800, color: C.ink2 });
      BULAN.forEach((v, i) => { const x = PX + 180 + i * 78; text(ctx, String(v), x, 720, 24, { align: "center", weight: 800 }); if (i < n) text(ctx, String(SAMPAH[i]), x, 780, 24, { align: "center", weight: 800, color: "#C0632F" }); });
    },
    r_regresi(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.insert(R1.slice(0, 4), 4, R1.slice(4), ph(l, sp, 0.06, 0.6));
      const [c] = stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.6 || blinkAt(l), active: true, run: "ready", hl: f > 0.62 ? [4] : [], size: 20 }]);
      plot(ctx, {});
      card(ctx, PX, 670, PW, 152, { fill: "#F7FAF8", r: 18 });
      if (f > 0.62) { LK.mono(ctx, 23, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, "linear_regression(...)", PX + 26, 718); ctx.fillStyle = BLUE; LK.monoText(ctx, "→ slope, intercept", PX + 26, 768);
        text(ctx, "dua nilai sekaligus", PX + PW - 26, 768, 20, { align: "right", weight: 700, color: C.ink2 }); }
      else text(ctx, "Python 3.10 ke atas; Colab sudah memenuhi.", PX + 26, 755, 22, { weight: 700, color: C.ink2 });
    },
    r_hasil(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.12;
      const [c] = stack(ctx, a, [{ lines: R1, active: true, run: ran ? "done" : "running", spin: l, count: 8, out: ran ? R1O : null, size: 20 }]);
      if (ran && c.out) LK.focus(ctx, { x: c.x + 86, y: c.out.lines[0] - 22, w: 230, h: c.out.lines[1] - c.out.lines[0] + 32 }, { t: l, color: GREEN });
      plot(ctx, { line: ran ? (f - 0.2) / 0.3 : 0 });
      if (f > 0.55) { card(ctx, PX, 670, PW, 152, { fill: C.goodBg, r: 18 }); text(ctx, "Sama dengan lembar kerja (S06):", PX + 26, 718, 23, { weight: 800, color: GREEN }); LK.mono(ctx, 23, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, "SLOPE = 3   INTERCEPT = 17", PX + 26, 772); }
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.06), { at: 0.5, x: 800, y: 790 }]);
    },
    r_prediksi(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(R2, ph(l, sp, 0.04, 0.4)); const ran = f > 0.5;
      const [, c] = stack(ctx, a, [doneCell(R1, R1O, 8, { size: 20 }), { lines: T.lines, caret: ran ? null : T.caret, blink: blinkAt(l), active: true, run: ran ? "done" : f > 0.45 ? "running" : "ready", spin: l, count: 9, out: ran ? R2O : null, size: 20 }]);
      if (ran && c.out) LK.focus(ctx, { x: c.x + 86, y: c.out.lines[0] - 22, w: 290, h: 30 }, { t: l, color: GREEN });
      plot(ctx, { line: 1, pred: ran ? (f - 0.5) / 0.15 : 0 });
      card(ctx, PX, 670, PW, 152, { fill: "#FFF9E0", r: 18 });
      LK.mono(ctx, 24, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, "17 + 3 × 7 = 17 + 21 = 38", PX + 26, 735);
      text(ctx, "kalikan dulu, baru tambahkan", PX + 26, 785, 21, { weight: 700, color: C.ink2 });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.45), { at: 0.7, x: 800, y: 790 }]);
    },
    r_error(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(R3, ph(l, sp, 0.04, 0.5)); const ran = f > 0.6;
      const [, , c] = stack(ctx, a, [doneCell(R1, R1O, 8, { size: 20 }), doneCell(R2, R2O, 9, { size: 20 }), { lines: T.lines, caret: ran ? null : T.caret, blink: blinkAt(l), active: true, run: ran ? "done" : f > 0.55 ? "running" : "ready", spin: l, count: 10, out: ran ? R3O : null, size: 20 }]);
      if (ran && c.out) LK.focus(ctx, { x: c.x + 86, y: c.out.lines[0] - 22, w: 340, h: 30 }, { t: l, color: GREEN });
      plot(ctx, { line: 1, errs: f > 0.25 });
      card(ctx, PX, 670, PW, 152, { fill: "#F7FAF8", r: 18 });
      LK.mono(ctx, 22, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, "error: 0, 1, −1, −1, 1, 0", PX + 26, 718);
      if (f > 0.4) { LK.monoText(ctx, "kuadrat: 0+1+1+1+1+0 = 4", PX + 26, 768); }
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.55), { at: 0.8, x: 800, y: 790 }]);
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: AMBER }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 250, 420 + i * 110, 840, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 296, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 340, 476 + i * 110, 28, { weight: 700, fit: 730 }); });
      card(ctx, 1130, 400, 560, 360, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Output yang dituju", 1154, 440, 22, { weight: 900, color: C.ink2 });
      LK.mono(ctx, 20, 600); ctx.fillStyle = C.ink;
      ["{'A': 0, 'B': 2, 'C': 4, 'D': 6, 'E': 9}", "A - B - C - D - E 9", "", "slope: 3.0", "intercept: 17.0", "prediksi bulan 7: 38.0"].forEach((s, i) => LK.monoText(ctx, s, 1154, 490 + i * 40));
    },
    periksa(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "PERIKSA HASILMU", 960, 210, 32, { align: "center", weight: 900, color: AMBER });
      [["Dijkstra", ["jarak E = 9", "A - B - C - D - E"]], ["Garis tren", ["slope 3.0", "intercept 17.0", "prediksi bulan 7: 38.0"]]].forEach(([t, o], i) => {
        const on = l > A * (0.1 + i * 0.4); ctx.globalAlpha = on ? 1 : 0.25; const x = 300 + i * 680;
        card(ctx, x, 260, 640, 440, { fill: C.bg2, r: 20 }); text(ctx, t, x + 320, 320, 32, { align: "center", weight: 900 });
        card(ctx, x + 30, 350, 580, 250, { fill: "#FFFFFF", r: 12 }); LK.mono(ctx, 28, 700); ctx.fillStyle = C.ink; o.forEach((s, k) => LK.monoText(ctx, s, x + 60, 410 + k * 56));
        if (on) text(ctx, "✓", x + 320, 670, 48, { align: "center", weight: 900, color: GREEN }); ctx.globalAlpha = 1; });
    },
    g_keyerror(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.14;
      const gs = stack(ctx, a, [doneCell(G1P, null, 4, { size: 15 }), { lines: GF, active: true, run: ran ? "done" : "ready", count: 11, out: ran ? PO.slice(0, 3).concat([{ err: ERR_F }]) : null, outSize: 17 }]);
      const c = gs[1]; if (ran && c.out && c.out.err && f > 0.24) LK.focus(ctx, c.out.err.lastBox, { t: l, color: RED });
      graf(ctx, { extra: true, title: "F HANYA SEBAGAI TETANGGA" });
      if (f > 0.55) note(ctx, ['graf["F"] = {"C": 4}', "F juga harus menjadi kunci graf"], { color: GREEN, fill: C.goodBg });
      else note(ctx, ['jarak dibuat dari kunci graf,', "jadi jarak[\"F\"] tidak ada."], { color: RED, fill: "#FDECEA" });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.12), { at: 0.5, x: 800, y: 790 }]);
    },
    r_error_panjang(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.14;
      const [c] = stack(ctx, a, [{ lines: R1BAD, active: true, run: ran ? "done" : "ready", count: 12, out: ran ? [{ err: ERR_ST }] : null, outSize: 14, size: 20, boxes: [{ line: 3, from: 9, to: 29, color: RED }] }]);
      if (ran && c.out && c.out.err && f > 0.24) LK.focus(ctx, c.out.err.lastNameBox, { t: l, color: RED });
      panel(ctx, "HITUNG ISINYA", 500);
      [["bulan", BULAN], ["sampah", SAMPAH.slice(0, 5)]].forEach(([nm, arr], i) => { const y = 230 + i * 150; text(ctx, nm, PX + 30, y, 26, { weight: 900, color: i ? "#C0632F" : C.ink });
        for (let k = 0; k < 6; k++) { const x = PX + 30 + k * 104, has = k < arr.length; ctx.fillStyle = has ? C.bg2 : "#FDECEA"; rr(ctx, x, y + 20, 92, 64, 12); ctx.fill();
          if (!has) { ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); rr(ctx, x, y + 20, 92, 64, 12); ctx.stroke(); ctx.setLineDash([]); }
          text(ctx, has ? String(arr[k]) : "?", x + 46, y + 63, 28, { align: "center", weight: 900, color: has ? C.ink : RED }); }
        text(ctx, `${arr.length} data`, PX + PW - 30, y, 24, { align: "right", weight: 800, color: arr.length === 6 ? GREEN : RED }); });
      if (f > 0.55) note(ctx, ["Setiap bulan harus punya", "tepat satu data sampah."], { color: GREEN, fill: C.goodBg });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.12), { at: 0.5, x: 800, y: 790 }]);
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: AMBER });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F12.2", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Dijkstra langkah demi langkah", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f122", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "garis tren: halaman latihan F12.3 (/f123)", 620, 600, 23, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tantangan", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Tambahkan kota F dan jalannya, lalu cari rute terpendek ke F.", 1310, 420, 29, 540, { align: "center", weight: 700, lh: 1.3 });
      LK.code(ctx, 1060, 570, ['graf["F"] = {"C": 4}', 'graf["C"]["F"] = 4'], { size: 22, nums: false, w: 520 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
