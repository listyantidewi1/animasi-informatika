/* K20 Simulasi konsep: Rekursi dan Call Stack (episode induk F11.6). Gaya diagram Fase F.
   Memakai pembantu F11.6 (strategi.js: St.coins, St.combos) dan F11.0 (py.js: Py.code).
   Semua gambar di atas y≈830. Nilai: jumlah([2,5,3]) = 10 (4 frame), faktorial(4) = 24 (5 frame), batas rekursi Python 1000;
   kembalian 800 dengan 500/200/100 → greedy 3 koin = optimal; 6 dengan 1/3/4 → greedy 4+1+1, brute force 3+3. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Py = K.py, St = K.strategi;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const PURPLE = "#8E6BBF", PURPLE_D = "#5B3F8E";
  const A = b => b.audio || b.dur;
  const prog = (l, b, a0, a1) => clamp((l - A(b) * a0) / (A(b) * (a1 - a0)), 0, 1);
  const panel = ctx => card(ctx, 120, 128, 1680, 694);
  const heading = (ctx, s, y = 190) => text(ctx, s, 960, y, 32, { align: "center", color: C.accentDark, weight: 900 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.18; fn(); ctx.restore(); };
  const banner = (ctx, s, y, w = 1200, opt = {}) => { card(ctx, 960 - w / 2, y, w, 76, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 16 }); text(ctx, s, 960, y + 50, opt.size || 30, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  function counter(ctx, x, y, n, label, opt = {}) {
    const w = opt.w || 260; card(ctx, x, y, w, 110, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 16 });
    text(ctx, String(n), x + w / 2, y + 62, opt.size || 50, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 20 });
    text(ctx, label, x + w / 2, y + 96, 20, { align: "center", weight: 800, color: C.ink2 });
  }

  // ---------- data ----------
  const CODE = {
    jumlah: [{ t: "def jumlah(daftar):" }, { t: "    if daftar == []:" }, { t: "        return 0" }, { t: "    return daftar[0] + jumlah(daftar[1:])" }],
    faktorial: [{ t: "def faktorial(n):" }, { t: "    if n == 0:" }, { t: "        return 1" }, { t: "    return n * faktorial(n - 1)" }]
  };
  const FRAMES = {
    jumlah: [
      { call: "jumlah([2, 5, 3])", wait: "2 + jumlah([5, 3])", done: "2 + 8 = 10", ret: "10" },
      { call: "jumlah([5, 3])", wait: "5 + jumlah([3])", done: "5 + 3 = 8", ret: "8" },
      { call: "jumlah([3])", wait: "3 + jumlah([])", done: "3 + 0 = 3", ret: "3" },
      { call: "jumlah([])", wait: "base case", done: "base case", ret: "0", base: true }],
    faktorial: [
      { call: "faktorial(4)", wait: "4 × faktorial(3)", done: "4 × 6 = 24", ret: "24" },
      { call: "faktorial(3)", wait: "3 × faktorial(2)", done: "3 × 2 = 6", ret: "6" },
      { call: "faktorial(2)", wait: "2 × faktorial(1)", done: "2 × 1 = 2", ret: "2" },
      { call: "faktorial(1)", wait: "1 × faktorial(0)", done: "1 × 1 = 1", ret: "1" },
      { call: "faktorial(0)", wait: "base case", done: "base case", ret: "1", base: true }]
  };
  const SX = 960, SW = 760, FH = 76, FG = 10, SB = 790;
  // satu frame call stack
  function frame(ctx, i, f, mode, opt = {}) {
    const y = SB - (i + 1) * (FH + FG) + (opt.dy || 0), x = SX + (opt.indent === false ? 0 : 0);
    ctx.save(); ctx.globalAlpha = opt.alpha == null ? 1 : opt.alpha;
    const fill = mode === "ret" ? C.goodBg : mode === "top" ? "#FFF3D6" : mode === "err" ? C.badBg : "#F4F0FA";
    const stroke = mode === "ret" ? C.good : mode === "top" ? C.accent : mode === "err" ? C.bad : PURPLE;
    card(ctx, x, y, SW, FH, { fill, stroke, lw: mode === "top" || mode === "ret" ? 5 : 3, r: 12 });
    text(ctx, f.call, x + 20, y + FH / 2 + 10, 28, { weight: 900, color: mode === "ret" ? C.good : mode === "err" ? C.bad : PURPLE_D });
    const right = mode === "ret" ? (f.base ? "base case → " + f.ret : (opt.doneTxt || f.done) + "  → " + f.ret) : opt.doneTxt || (f.base ? "base case" : "menunggu " + f.wait);
    text(ctx, right, x + SW - 20, y + FH / 2 + 9, 24, { align: "right", weight: 800, color: mode === "ret" ? C.good : C.ink2, fit: SW - 330 });
    ctx.restore();
    return y;
  }
  // tumpukan pada kemajuan e (0..2n): 0..n mendorong, n..2n membuka
  function stackAt(ctx, frames, e) {
    const n = frames.length; const s = Math.floor(e), u = e - s;
    text(ctx, "CALL STACK", SX, 236, 26, { weight: 900, color: PURPLE_D }); text(ctx, "frame teratas = sedang berjalan", SX + SW, 236, 20, { align: "right", weight: 800, color: C.ink2 });
    ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(SX - 14, 262); ctx.lineTo(SX - 14, SB + 12); ctx.lineTo(SX + SW + 14, SB + 12); ctx.lineTo(SX + SW + 14, 262); ctx.stroke();
    if (e < n) { // dorong
      for (let i = 0; i <= Math.min(s, n - 1); i++) { const entering = i === s; frame(ctx, i, frames[i], i === s ? "top" : "wait", entering ? { alpha: ease(u * 2.5), dy: -40 * (1 - ease(u * 2.5)) } : {}); }
      return { depth: Math.min(n, s + 1), top: s };
    }
    const j = Math.min(n - 1, s - n), pop = n - 1 - j; // frame yang sedang dibuka
    if (e >= 2 * n) return { depth: 0, top: -1, doneAll: true };
    for (let i = 0; i < pop; i++) frame(ctx, i, frames[i], "wait", i === pop - 1 && u > 0.55 ? { doneTxt: frames[i].done } : {});
    const fu = clamp((u - 0.5) / 0.5, 0, 1);
    frame(ctx, pop, frames[pop], "ret", { alpha: 1 - fu, dy: -50 * fu, doneTxt: frames[pop].done });
    return { depth: pop + 1, top: pop };
  }

  // ---------- tanya / tebak ----------
  const VQ = {
    1: { title: "REKURSI", q: "Berapa frame yang bertumpuk paling banyak?", draw: (ctx, x, y) => { Py.code(ctx, x, y, 560, [{ t: "jumlah([2, 5, 3])" }], { rh: 70, size: 34, title: "PANGGILAN" }); } },
    2: { title: "REKURSI", q: "faktorial(4) = 4 × 3 × 2 × 1. Berapa frame yang bertumpuk?", draw: (ctx, x, y) => { Py.code(ctx, x, y, 560, [{ t: "faktorial(4)" }], { rh: 70, size: 34, title: "PANGGILAN" }); } },
    3: { title: "BASE CASE TERHAPUS", q: "Apa yang terjadi saat faktorial(3) dipanggil?", draw: (ctx, x, y) => { Py.code(ctx, x, y, 560, [{ t: "def faktorial(n):" }, { t: "    # if n == 0: return 1  (hilang)", bad: true }, { t: "    return n * faktorial(n - 1)" }], { rh: 50, size: 20 }); } },
    4: { title: "GREEDY", q: "Kembalian 800 rupiah. Apakah greedy menemukan koin paling sedikit?", draw: (ctx, x, y) => { text(ctx, "koin:", x, y + 40, 26, { weight: 900, color: C.ink2 }); St.coins(ctx, x + 90, y, [500, 200, 100], { r: 40, gap: 18 }); text(ctx, "kembalian 800", x, y + 150, 40, { weight: 900 }); } },
    5: { title: "GREEDY", q: "Koin 1, 3, dan 4; kembalian 6. Berapa koin yang diberikan greedy?", draw: (ctx, x, y) => { text(ctx, "koin:", x, y + 40, 26, { weight: 900, color: C.ink2 }); St.coins(ctx, x + 90, y, [1, 3, 4], { r: 40, gap: 18 }); text(ctx, "kembalian 6", x, y + 150, 40, { weight: 900 }); } }
  };
  function tanya(ctx, b, l, tebak) {
    const v = VQ[b.v]; panel(ctx);
    text(ctx, "VARIASI " + b.v, 200, 200, 30, { weight: 900, color: C.kiko }); text(ctx, v.title, 200, 240, 24, { weight: 800, color: C.ink2 });
    card(ctx, 180, 268, 640, 300, { fill: C.bg2, r: 22 }); v.draw(ctx, 220, 320);
    para(ctx, v.q, 880, 320, 40, 840, { weight: 800, lh: 1.3 });
    if (!tebak) { kiko(ctx, 960, 690, 110, 0, { mood: "happy" }); text(ctx, "Menurutmu?", 1100, 700, 40, { weight: 900, color: C.accentDark }); return; }
    const opts = b.pilih || []; const ow = Math.min(440, (1440 - (opts.length - 1) * 30) / opts.length);
    text(ctx, "TEBAK DULU", 200, 640, 28, { weight: 900, color: C.accentDark });
    opts.forEach((o, i) => { const x = 200 + i * (ow + 30), u = ease((l - 0.3 - i * 0.35) / 0.4); ctx.save(); ctx.globalAlpha = u; card(ctx, x, 664, ow, 100, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 18 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 50, 714, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, "ABC"[i], x + 50, 726, 32, { align: "center", weight: 900, color: "#fff" });
      text(ctx, o, x + 96, 728, 36, { weight: 900, fit: ow - 110 }); ctx.restore(); });
    const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(1690, 220, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1690, 220, 40, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
  }
  // langkah greedy: [koin, sisa] atau [koin, sisa, "skip"]
  const GSTEP = { rupiah: { coins: [500, 200, 100], amt: 800, steps: [[500, 300], [200, 100], [100, 0]], best: [500, 200, 100] },
    "134": { coins: [1, 3, 4], amt: 6, steps: [[4, 2], [3, 2, "skip"], [1, 1], [1, 0]], best: [3, 3] } };
  const COMBOS6 = [{ c: [1, 1, 1, 1, 1, 1] }, { c: [3, 1, 1, 1] }, { c: [4, 1, 1] }, { c: [3, 3] }];

  Object.assign(K.SCENES, {
    k20_tujuan(ctx, b, l) {
      panel(ctx);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 220, 220, 30, { weight: 900, color: C.accentDark });
      ["melacak frame di call stack", "menemukan base case yang terlupa", "menguji greedy dengan brute force"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.8) / 0.5); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u;
        card(ctx, 220, 260 + i * 120, 860, 96, { fill: C.bg2, r: 16 }); text(ctx, "✓", 262, 322 + i * 120, 38, { weight: 900, color: C.good }); text(ctx, s, 316, 320 + i * 120, 32, { weight: 800, fit: 740 }); ctx.restore(); });
      const n = clamp(Math.floor(l / 0.7), 0, 4);
      ["jumlah([2, 5, 3])", "jumlah([5, 3])", "jumlah([3])", "jumlah([])"].forEach((s, i) => { if (i >= n) return; const y = 640 - i * 90; card(ctx, 1200, y, 480, 76, { fill: i === n - 1 ? "#FFF3D6" : "#F4F0FA", stroke: i === n - 1 ? C.accent : PURPLE, lw: 4, r: 12 }); text(ctx, s, 1440, y + 48, 28, { align: "center", weight: 900, color: PURPLE_D }); });
      text(ctx, "call stack", 1440, 760, 26, { align: "center", weight: 900, color: C.ink2 });
    },
    k20_prasyarat(ctx, b, l) {
      panel(ctx);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 260, 640, 380, { fill: C.bg2, r: 22 });
      text(ctx, "F11.6", 620, 360, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Strategi Algoritmik dan Alternatif Solusi", 620, 430, 32, 560, { align: "center", weight: 800, lh: 1.25 });
      text(ctx, "yang perlu kamu kenal:", 1040, 300, 26, { weight: 800, color: C.ink2 });
      ["rekursi", "base case", "greedy", "brute force"].forEach((s, i) => { const u = ease((l - 1 - i * 0.6) / 0.4); ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * u; card(ctx, 1040, 330 + i * 86, 560, 70, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 14 }); text(ctx, s, 1070, 376 + i * 86, 30, { weight: 900 }); ctx.restore(); });
      kiko(ctx, 1700, 740, 90, 0, { wave: l });
    },
    k20_kode(ctx, b, l) {
      panel(ctx); heading(ctx, b.fn === "jumlah" ? "FUNGSI REKURSIF: jumlah(daftar)" : "FUNGSI REKURSIF: faktorial(n)");
      const p1 = l > A(b) * (b.fn === "jumlah" ? 0.2 : 0.25), p2 = l > A(b) * (b.fn === "jumlah" ? 0.5 : 0.55);
      Py.code(ctx, 200, 250, 900, CODE[b.fn].map((c, i) => ({ ...c, hl: (p1 && !p2 && (i === 1 || i === 2)) || (p2 && i === 3) })), { rh: 64, size: 30 });
      dim(ctx, p1, () => { card(ctx, 1160, 250, 560, 150, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "base case: berhenti", 1440, 305, 32, { align: "center", weight: 900, color: C.good }); text(ctx, b.fn === "jumlah" ? "daftar kosong → 0" : "n == 0 → 1", 1440, 360, 28, { align: "center", weight: 800, color: C.ink2 }); });
      dim(ctx, p2, () => { card(ctx, 1160, 430, 560, 150, { fill: "#F4F0FA", stroke: PURPLE, lw: 4, r: 16 }); text(ctx, "recursive case: mengecil", 1440, 485, 32, { align: "center", weight: 900, color: PURPLE_D, fit: 520 }); text(ctx, b.fn === "jumlah" ? "daftar tanpa elemen pertama" : "n − 1", 1440, 540, 28, { align: "center", weight: 800, color: C.ink2 }); });
      if (l > A(b) * 0.8) text(ctx, b.fn === "jumlah" ? "jumlah([2, 5, 3]) = 2 + jumlah([5, 3])" : "faktorial(4) = 4 × faktorial(3)", 650, 640, 32, { align: "center", weight: 900, color: C.kiko });
    },
    k20_frame(ctx, b, l) {
      panel(ctx); heading(ctx, "SETIAP PANGGILAN MENDAPAT SATU FRAME");
      const show = [l > A(b) * 0.1, l > A(b) * 0.35, l > A(b) * 0.65];
      [["jumlah([2, 5, 3])", "daftar = [2, 5, 3]"], ["jumlah([5, 3])", "daftar = [5, 3]"]].forEach(([c, v], i) => dim(ctx, show[i], () => {
        const x = 220 + i * 520; card(ctx, x, 260, 460, 300, { fill: "#F4F0FA", stroke: PURPLE, lw: 4, r: 18 });
        text(ctx, "FRAME", x + 24, 300, 22, { weight: 900, color: PURPLE }); text(ctx, c, x + 24, 350, 32, { weight: 900, color: PURPLE_D, fit: 410 });
        card(ctx, x + 24, 380, 412, 70, { fill: "#fff", r: 12 }); text(ctx, v, x + 44, 426, 28, { weight: 800 });
        text(ctx, "nilai milik panggilan ini saja", x + 24, 510, 22, { weight: 800, color: C.ink2 }); }));
      dim(ctx, show[2], () => { ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1300, 300); ctx.lineTo(1300, 700); ctx.lineTo(1700, 700); ctx.lineTo(1700, 300); ctx.stroke();
        card(ctx, 1316, 610, 368, 76, { fill: "#F4F0FA", stroke: PURPLE, lw: 3, r: 12 }); text(ctx, "jumlah([2, 5, 3])", 1500, 658, 26, { align: "center", weight: 900, color: PURPLE_D });
        card(ctx, 1316, 524, 368, 76, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 12 }); text(ctx, "jumlah([5, 3])", 1500, 572, 26, { align: "center", weight: 900, color: PURPLE_D });
        text(ctx, "call stack", 1500, 750, 26, { align: "center", weight: 900, color: C.ink2 }); });
    },
    k20_piring(ctx, b, l) {
      panel(ctx); heading(ctx, "SEPERTI TUMPUKAN PIRING DI KANTIN");
      const a = A(b); const n = clamp(Math.floor((l - a * 0.05) / (a * 0.1)) + 1, 0, 4); const take = l > a * 0.55;
      const plate = (y, col, off = 0) => { ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.beginPath(); ctx.ellipse(560 + off, y + 14, 230, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(560 + off, y, 230, 34, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.stroke(); ctx.beginPath(); ctx.ellipse(560 + off, y, 150, 18, 0, 0, Math.PI * 2); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 3; ctx.stroke(); };
      const cols = [C.kiko, C.good, PURPLE, C.accent];
      const tu = take ? ease((l - a * 0.55) / (a * 0.2)) : 0;
      for (let i = 0; i < n; i++) { const top = i === n - 1 && take; plate(720 - i * 56 - (top ? tu * 120 : 0), cols[i], top ? tu * 300 : 0); }
      if (!take && n >= 1) { text(ctx, "↓ taruh", 840, 700 - (n - 1) * 56 - 40, 30, { weight: 900, color: C.kiko }); }
      if (take) text(ctx, "↑ ambil", 1060, 470, 30, { weight: 900, color: C.accentDark });
      text(ctx, "piring 1 = paling bawah", 560, 800, 22, { align: "center", weight: 800, color: C.ink2 });
      if (take) { text(ctx, "yang terakhir ditaruh,", 1500, 330, 30, { align: "center", weight: 900 }); text(ctx, "yang pertama diambil", 1500, 375, 30, { align: "center", weight: 900, color: C.accentDark }); }
      if (l > a * 0.75) { card(ctx, 1220, 450, 540, 170, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "frame teratas", 1490, 515, 32, { align: "center", weight: 900 }); text(ctx, "= yang sedang berjalan", 1490, 565, 28, { align: "center", weight: 800, color: C.ink2 }); }
    },
    k20_tanya(ctx, b, l) { tanya(ctx, b, l, false); },
    k20_tebak(ctx, b, l) { tanya(ctx, b, l, true); },
    k20_stack(ctx, b, l) {
      const frames = FRAMES[b.fn], n = frames.length;
      panel(ctx); heading(ctx, b.phase === "push" ? "FRAME BERTUMPUK" : b.phase === "pop" ? "FRAME KEMBALI SATU PER SATU" : "TERAKHIR MASUK, PERTAMA KELUAR");
      let e = b.phase === "push" ? n * prog(l, b, 0.05, 0.85) - 0.001 : b.phase === "pop" ? n + n * prog(l, b, 0.12, 0.92) : 2 * n;
      if (b.phase === "push" && e >= n - 0.002) e = n - 0.001;
      const st = b.phase === "done" ? { doneAll: true } : stackAt(ctx, frames, e);
      const atBase = b.phase === "push" && st.top === n - 1;
      Py.code(ctx, 180, 236, 720, CODE[b.fn].map((c, i) => ({ ...c, hl: b.phase !== "done" && ((atBase && (i === 1 || i === 2)) || (!atBase && i === 3)) })), { rh: 50, size: 21 });
      if (b.phase === "push") counter(ctx, 180, 520, st.depth, "frame bertumpuk", { w: 300 });
      if (b.phase === "push" && st.depth === n && e > n - 0.4) text(ctx, n + " frame", 520, 590, 40, { weight: 900, color: C.accentDark });
      if (b.phase === "pop") { counter(ctx, 180, 520, st.doneAll ? 0 : st.depth, "frame tersisa", { w: 300 }); }
      if (st.doneAll || (b.phase === "pop" && e >= 2 * n - 0.05)) {
        card(ctx, 520, 520, 380, 110, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "hasil: " + frames[0].ret, 710, 590, 44, { align: "center", weight: 900, color: C.good }); }
      if (b.phase === "done") {
        text(ctx, "CALL STACK", SX, 236, 26, { weight: 900, color: PURPLE_D });
        const cw = 360; text(ctx, "urutan masuk", SX, 290, 24, { weight: 900, color: C.ink2 }); text(ctx, "urutan keluar", SX + 400, 290, 24, { weight: 900, color: C.ink2 });
        frames.forEach((f, i) => { const y = 310 + i * 84; card(ctx, SX, y, cw, 70, { fill: "#F4F0FA", stroke: PURPLE, lw: 3, r: 12 }); text(ctx, (i + 1) + ". " + f.call, SX + 16, y + 46, 24, { weight: 900, color: PURPLE_D, fit: cw - 30 });
          const k = n - 1 - i, y2 = 310 + k * 84; const on = l > A(b) * (0.15 + k * 0.1); dim(ctx, on, () => { card(ctx, SX + 400, y2, cw, 70, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, (k + 1) + ". " + f.call + " → " + f.ret, SX + 416, y2 + 46, 24, { weight: 900, color: C.good, fit: cw - 30 }); }); });
        card(ctx, 180, 660, 720, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "yang terakhir masuk, keluar pertama", 540, 728, 30, { align: "center", weight: 900, color: C.accentDark, fit: 680 });
      }
    },
    k20_overflow(ctx, b, l) {
      panel(ctx); heading(ctx, b.phase === "grow" ? "TANPA BASE CASE: CALL STACK TERUS MENINGGI" : "STACK OVERFLOW: PYTHON MENGHENTIKAN PROGRAM");
      Py.code(ctx, 180, 236, 720, [{ t: "def faktorial(n):" }, { t: "    return n * faktorial(n - 1)", hl: true }, { t: "" }, { t: "faktorial(3)" }], { rh: 50, size: 22 });
      // kedalaman: grow 1 → ±120; error 120 → 1000, lalu berhenti
      let depth;
      if (b.phase === "grow") { const p = prog(l, b, 0.05, 0.95); depth = p < 0.45 ? 1 + Math.floor(p / 0.45 * 6) : Math.floor(7 + Math.pow((p - 0.45) / 0.55, 2) * 113); }
      else { const p = prog(l, b, 0.0, 0.18); depth = Math.floor(120 + p * 880); }
      const err = b.phase === "error" && depth >= 1000;
      // gambar maksimal 6 frame teratas + frame dasar
      text(ctx, "CALL STACK", SX, 236, 26, { weight: 900, color: PURPLE_D }); text(ctx, "kedalaman: " + depth.toLocaleString("id-ID"), SX + SW, 236, 26, { align: "right", weight: 900, color: depth > 50 ? C.bad : C.ink2 });
      ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(SX - 14, 262); ctx.lineTo(SX - 14, SB + 12); ctx.lineTo(SX + SW + 14, SB + 12); ctx.lineTo(SX + SW + 14, 262); ctx.stroke();
      const nArg = k => 3 - k, lab = v => String(v).replace("-", "−"); // frame ke-k (0 = dasar) memanggil faktorial(3 − k)
      const mk = k => ({ call: "faktorial(" + lab(nArg(k)) + ")", wait: lab(nArg(k)) + " × faktorial(" + lab(nArg(k) - 1) + ")" });
      if (depth <= 6) { for (let i = 0; i < depth; i++) frame(ctx, i, mk(i), err ? "err" : i === depth - 1 ? "top" : "wait"); }
      else {
        frame(ctx, 0, mk(0), err ? "err" : "wait");
        text(ctx, "⋮   " + (depth - 5).toLocaleString("id-ID") + " frame lain   ⋮", SX + SW / 2, SB - 2 * (FH + FG) + FH / 2 + 10, 26, { align: "center", weight: 900, color: err ? C.bad : C.ink2 });
        for (let j = 0; j < 4; j++) { const k = depth - 4 + j; frame(ctx, 2 + j, mk(k), err ? "err" : j === 3 ? "top" : "wait"); }
      }
      // meteran batas
      const mh = 420, my = 520 - 0; card(ctx, 180, 520, 720, 120, { fill: C.bg2, r: 16 });
      text(ctx, "batas rekursi Python: 1.000 frame", 210, 560, 24, { weight: 900, color: C.ink2 });
      ctx.fillStyle = "#fff"; rr(ctx, 210, 580, 660, 36, 12); ctx.fill(); ctx.fillStyle = depth >= 1000 ? C.bad : depth > 300 ? C.accent : C.kiko; rr(ctx, 210, 580, Math.max(14, 660 * Math.min(1, depth / 1000)), 36, 12); ctx.fill();
      if (b.phase === "grow" && l > A(b) * 0.45) text(ctx, "n terus mengecil: 0, −1, −2, … tidak pernah berhenti", 180, 690, 26, { weight: 900, color: C.bad });
      if (err) {
        const u = ease((l - A(b) * 0.18) / 0.5); ctx.save(); ctx.globalAlpha = u;
        card(ctx, 180, 660, 720, 150, { fill: "#0E1418", stroke: C.bad, lw: 4, r: 14 });
        [["Traceback (most recent call last):", "#D7E2DC"], ["  File \"main.py\", line 2, in faktorial", "#D7E2DC"], ["    return n * faktorial(n - 1)", "#F2B134"], ["RecursionError: maximum recursion depth exceeded", "#FF8A80"]].forEach(([s, col], i) => text(ctx, s, 200, 696 + i * 32, 20, { weight: i === 3 ? 900 : 700, color: col, fit: 680 }));
        ctx.restore();
        if (l > A(b) * 0.3) { ctx.save(); ctx.translate(SX + SW / 2, 470); ctx.rotate(-0.12); card(ctx, -230, -60, 460, 120, { fill: C.bad, r: 20 }); text(ctx, "BERHENTI", 0, 22, 60, { align: "center", weight: 900, color: "#fff" }); ctx.restore(); }
      }
    },
    k20_perbaiki(ctx, b, l) {
      panel(ctx); heading(ctx, "PERBAIKAN: TULIS BASE CASE LEBIH DULU");
      const u1 = l > A(b) * 0.15, u2 = l > A(b) * 0.55;
      card(ctx, 180, 240, 720, 330, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "✗ tanpa base case", 210, 290, 28, { weight: 900, color: C.bad });
      Py.code(ctx, 210, 310, 660, [{ t: "def faktorial(n):" }, { t: "    return n * faktorial(n - 1)" }], { rh: 52, size: 22 });
      text(ctx, "→ RecursionError", 210, 520, 28, { weight: 900, color: C.bad });
      dim(ctx, u1, () => { card(ctx, 1000, 240, 720, 330, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 }); text(ctx, "✓ dengan base case", 1030, 290, 28, { weight: 900, color: C.good });
        Py.code(ctx, 1030, 310, 660, [{ t: "def faktorial(n):" }, { t: "    if n == 0:", hl: true }, { t: "        return 1", hl: true }, { t: "    return n * faktorial(n - 1)" }], { rh: 46, size: 22 }); });
      dim(ctx, u2, () => { text(ctx, "setiap panggilan mendekat ke base case:", 960, 640, 28, { align: "center", weight: 900, color: C.ink2 });
        ["3", "2", "1", "0 ✓"].forEach((s, i) => { const x = 620 + i * 180; card(ctx, x, 670, 140, 80, { fill: i === 3 ? C.goodBg : C.bg2, stroke: i === 3 ? C.good : undefined, lw: 3, r: 14 }); text(ctx, s, x + 70, 724, 36, { align: "center", weight: 900, color: i === 3 ? C.good : C.ink }); if (i < 3) text(ctx, "→", x + 160, 722, 30, { align: "center", weight: 900, color: C.ink2 }); }); });
    },
    k20_greedy_intro(ctx, b, l) {
      panel(ctx); heading(ctx, "DUA STRATEGI MEMBERI KEMBALIAN");
      const u2 = l > A(b) * 0.45;
      card(ctx, 180, 240, 760, 540, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "greedy", 220, 300, 36, { weight: 900, color: C.accentDark }); text(ctx, "ambil koin terbesar yang masih muat", 220, 345, 26, { weight: 800, color: C.ink2 });
      St.coins(ctx, 240, 400, [500, 200, 100], { r: 50, gap: 30, hl: Math.floor(l * 1.2) % 3 === 0 ? 0 : null });
      text(ctx, "↑ terbesar dulu", 290, 560, 28, { weight: 900, color: C.accentDark });
      text(ctx, "cepat, tanpa menoleh ke belakang", 220, 700, 26, { weight: 800 });
      dim(ctx, u2, () => { card(ctx, 980, 240, 760, 540, { fill: C.goodBg, stroke: C.good, lw: 4, r: 20 });
        text(ctx, "brute force", 1020, 300, 36, { weight: 900, color: C.good }); text(ctx, "coba semua kombinasi, pilih yang paling sedikit", 1020, 345, 26, { weight: 800, color: C.ink2, fit: 690 });
        St.combos(ctx, 1020, 380, 680, COMBOS6, 4, { rh: 70 });
        text(ctx, "pasti terbaik, tetapi lambat untuk soal besar", 1020, 700 + 30, 26, { weight: 800, fit: 690 }); });
    },
    k20_greedy(ctx, b, l) {
      const G = GSTEP[b.set]; panel(ctx); heading(ctx, b.set === "rupiah" ? "VARIASI 4 · GREEDY: KEMBALIAN 800" : "VARIASI 5 · GREEDY: KOIN 1, 3, 4 UNTUK 6");
      text(ctx, "koin:", 200, 270, 26, { weight: 900, color: C.ink2 }); St.coins(ctx, 280, 232, G.coins, { r: 34, gap: 14 });
      text(ctx, "kembalian " + G.amt, 1720, 270, 32, { align: "right", weight: 900 });
      const ns = G.steps.length, k = clamp(Math.floor(prog(l, b, 0.04, b.set === "rupiah" ? 0.62 : 0.8) * ns) + 1, 1, ns); const done = l > A(b) * (b.set === "rupiah" ? 0.62 : 0.8);
      const sw = (1520 - (ns - 1) * 20) / ns;
      G.steps.forEach(([c, sisa, skip], i) => dim(ctx, i < k, () => { const x = 200 + i * (sw + 20); card(ctx, x, 320, sw, 230, { fill: skip ? C.badBg : i === k - 1 && !done ? "#FFF3D6" : C.bg2, stroke: skip ? C.bad : i === k - 1 && !done ? C.accent : undefined, lw: 4, r: 16 });
        text(ctx, "langkah " + (i + 1), x + 24, 362, 22, { weight: 900, color: C.ink2 }); St.coins(ctx, x + 24, 384, [c], { r: 38, dim: !!skip });
        if (skip) { ctx.strokeStyle = C.bad; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 24, 384); ctx.lineTo(x + 100, 460); ctx.moveTo(x + 100, 384); ctx.lineTo(x + 24, 460); ctx.stroke(); text(ctx, c + " tidak muat", x + 24, 520, 24, { weight: 900, color: C.bad }); }
        else { text(ctx, "ambil " + c, x + 120, 420, 28, { weight: 900 }); text(ctx, "sisa " + sisa, x + 24, 520, 30, { weight: 900, color: sisa === 0 ? C.good : C.ink }); } }));
      if (done) {
        const taken = G.steps.filter(s => !s[2]).map(s => s[0]);
        card(ctx, 200, 590, 740, 160, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "greedy", 230, 636, 26, { weight: 900, color: C.accentDark }); St.coins(ctx, 230, 656, taken, { r: 30 }); text(ctx, taken.length + " koin", 900, 700, 40, { align: "right", weight: 900 });
        if (b.set === "rupiah") { const u = l > A(b) * 0.75; dim(ctx, u, () => { card(ctx, 980, 590, 740, 160, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "brute force", 1010, 636, 26, { weight: 900, color: C.good }); St.coins(ctx, 1010, 656, G.best, { r: 30 }); text(ctx, "3 koin ✓ sama", 1690, 700, 36, { align: "right", weight: 900, color: C.good }); }); }
        else text(ctx, "Apakah ini yang paling sedikit?", 1340, 690, 32, { align: "center", weight: 900, color: C.ink2 });
      }
    },
    k20_brute(ctx, b, l) {
      panel(ctx); heading(ctx, "VARIASI 5 · BRUTE FORCE: COBA SEMUA KOMBINASI");
      const n = clamp(Math.floor(prog(l, b, 0.08, 0.7) * 4) + 1, 1, 4), best = l > A(b) * 0.75 ? 3 : null;
      St.combos(ctx, 200, 250, 760, COMBOS6, n, { rh: 92, best });
      Py.code(ctx, 1020, 250, 700, [{ t: "terbaik = None" }, { t: "for a in range(7):        # koin 1" }, { t: "    for b in range(3):    # koin 3" }, { t: "        for c in range(2):# koin 4" }, { t: "            if a + 3*b + 4*c == 6:" }, { t: "                simpan jika lebih sedikit" }], { rh: 44, size: 19 });
      if (best != null) { card(ctx, 1020, 620, 700, 110, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "3 + 3 = 6: hanya 2 koin", 1370, 690, 38, { align: "center", weight: 900, color: C.good }); }
    },
    k20_banding(ctx, b, l) {
      panel(ctx); heading(ctx, "KOIN 1, 3, 4 UNTUK 6: GREEDY KALAH");
      card(ctx, 200, 240, 720, 330, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "greedy", 230, 290, 30, { weight: 900, color: C.bad }); St.coins(ctx, 230, 320, [4, 1, 1], { r: 46, gap: 16 }); text(ctx, "3 koin", 230, 500, 48, { weight: 900, color: C.bad });
      text(ctx, "ambil 4 dulu → jalan ke 3 + 3 tertutup", 230, 545, 22, { weight: 800, color: C.ink2 });
      card(ctx, 1000, 240, 720, 330, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 }); text(ctx, "brute force", 1030, 290, 30, { weight: 900, color: C.good }); St.coins(ctx, 1030, 320, [3, 3], { r: 46, gap: 16 }); text(ctx, "2 koin ★", 1030, 500, 48, { weight: 900, color: C.good });
      if (l > A(b) * 0.45) banner(ctx, "terbaik saat ini ≠ terbaik seluruhnya", 600, 1100);
      if (l > A(b) * 0.65) text(ctx, "greedy: buktikan dulu, atau uji dengan brute force pada kasus kecil", 960, 740, 28, { align: "center", weight: 900, color: C.ink2 });
    },
    k20_latihan(ctx, b, l) {
      panel(ctx);
      const a = A(b), t = [a * 0.08, a * 0.2, a * 0.27, a * 0.34, a * 0.41, a * 0.62, a * 0.8];
      const rek = l < t[5];
      const stackRow = { custom: (ctx, x, y, w, ll) => {
        const lines = ["def faktorial(n):", "    if n == 0:", "        return 1", "    return n * faktorial(n - 1)"];
        ctx.fillStyle = "#1F2A33"; rr(ctx, x, y, w, lines.length * 17 + 14, 8); ctx.fill(); lines.forEach((s, i) => text(ctx, s, x + 10, y + 20 + i * 17, 11, { weight: 700, color: "#fff" })); y += lines.length * 17 + 22;
        text(ctx, "call stack (yang teratas = yang sedang berjalan)", x, y + 10, 10, { weight: 800, color: C.ink2 }); y += 18;
        const presses = [t[1], t[2], t[3], t[4]].filter(q => ll >= q).length; const fr = ["faktorial(4)", "faktorial(3)", "faktorial(2)", "faktorial(1)", "faktorial(0)"].slice(0, presses + 1).reverse();
        fr.forEach((f, i) => { ctx.fillStyle = i === 0 ? "#FFF3D6" : "#F4F0FA"; rr(ctx, x, y, w, 24, 6); ctx.fill(); text(ctx, f, x + 10, y + 16, 11, { weight: 800, color: PURPLE_D }); text(ctx, i === 0 && presses === 4 ? "base case" : "menunggu…", x + w - 10, y + 16, 10, { align: "right", weight: 700, color: C.ink2 }); y += 28; });
        return y + 2; } };
      const spec = rek ? { url: "belajar-informatika.vercel.app/f116", judul: "Mesin kembalian, tebak angka, pelacak rekursi",
        rows: [{ tabs: ["1 Mesin kembalian", "2 Tebak angka", "3 Pelacak rekursi"], on: 0 }, { label: "Program 2 dari 2 · langkah" }, stackRow, { buttons: ["▶ Langkah", "↺ Dari awal"], cols: 2, on: -1 }],
        taps: [[0, 2, t[0]], [3, 0, t[1]], [3, 0, t[2]], [3, 0, t[3]], [3, 0, t[4]]] }
        : { url: "belajar-informatika.vercel.app/f116", judul: "Mesin kembalian, tebak angka, pelacak rekursi",
        rows: [{ tabs: ["1 Mesin kembalian", "2 Tebak angka", "3 Pelacak rekursi"], on: 2 }, { label: "Langkah 1: pilih set koin dan jumlah kembalian" }, { buttons: ["koin 1, 3, 4", "koin 100, 200, 500", "koin 1, 5, 10, 25"], on: -1 }, { buttons: ["6", "7", "8", "10"], cols: 4, on: 0 },
          { custom: (ctx, x, y, w, ll) => { if (ll < t[6]) return y; ctx.fillStyle = C.badBg; rr(ctx, x, y, w / 2 - 4, 70, 8); ctx.fill(); ctx.fillStyle = C.goodBg; rr(ctx, x + w / 2 + 4, y, w / 2 - 4, 70, 8); ctx.fill(); text(ctx, "greedy: 4 1 1 = 3 koin", x + 8, y + 40, 11, { weight: 800 }); text(ctx, "brute force: 3 3 = 2 koin", x + w / 2 + 12, y + 40, 11, { weight: 800 }); return y + 80; } }],
        taps: [[0, 0, t[5]], [2, 0, t[6]]] };
      if (rek) spec.taps = spec.taps.map(q => q);
      // tab "Pelacak rekursi" aktif setelah diketuk; untuk halaman mesin, tab 0 aktif setelah ketukan t[5]
      if (rek && l < t[0]) spec.rows[0].on = 0;
      K.halaman(ctx, 240, 196, 1.25, spec, l, { h: 478 });
      const n = l < t[0] ? 0 : l < t[4] + 0.5 ? 1 : l < t[5] ? 2 : l < t[6] ? 3 : 4;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN F11.6", ["Klik Pelacak rekursi.", "Tekan Langkah sampai semua frame tertutup.", "Klik Mesin kembalian.", "Pilih koin 1, 3, 4."], n);
      card(ctx, 840, 580, 880, 190, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 625, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Di Colab, tulis kembalian versi greedy dan versi brute force, lalu uji dengan koin 1, 3, 4.", 870, 670, 28, 820, { weight: 700, lh: 1.3 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
