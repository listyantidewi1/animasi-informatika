/* K15 Simulasi konsep: array (akses indeks, sisip/hapus menggeser elemen), stack (push/pop), queue (enqueue/dequeue).
   Indeks array mulai dari 1, sama dengan episode E.5. Memakai pembantu E.5 (Kiko.sd: stack, queue, op).
   Semua hasil sudah dicek dengan python3: v1 sisip es teh di 2 → 3 geseran (nasi 4→5, mi 3→4, soto 2→3);
   v2 hapus indeks 1 → 4 geseran; v3 stack keluar mi, pedas, soto, sisa [aku, suka]; v4 queue dilayani Dito, Sinta, Rani, sisa [Budi];
   v5 stack keluar D, C sisa [A, B]; queue keluar A, B sisa [C, D]. Gambar penting di atas y≈830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Sd = K.sd;
  const { rr, text, para, card, kiko, ease, clamp, lerp, arrowIcon } = H;
  const heading = (ctx, s, y = 168) => text(ctx, s, 960, y, 34, { align: "center", weight: 900, color: C.accentDark });
  const prog = (b, l, a0 = 0.06, a1 = 0.88) => { const a = b.audio || b.dur; return clamp((l - a * a0) / (a * (a1 - a0)), 0, 1); };

  // ---------- array ----------
  const MENU0 = ["bakso", "soto", "mi", "nasi", null, null];
  const ARR = {
    v1: { title: "VARIASI 1 · SISIPKAN es teh DI INDEKS 2", start: MENU0, opText: "sisipkan es teh di indeks 2",
      steps: [{ v: "nasi", from: 4, to: 5 }, { v: "mi", from: 3, to: 4 }, { v: "soto", from: 2, to: 3 }, { v: "es teh", from: "in", to: 2 }], hl: 3 },
    v2: { title: "VARIASI 2 · HAPUS ELEMEN DI INDEKS 1", start: ["bakso", "es teh", "soto", "mi", "nasi", null], opText: "hapus elemen di indeks 1",
      steps: [{ v: "bakso", from: 1, to: "out" }, { v: "es teh", from: 2, to: 1 }, { v: "soto", from: 3, to: 2 }, { v: "mi", from: 4, to: 3 }, { v: "nasi", from: 5, to: 4 }], hl: 1 }
  };
  const AX = 300, AW = 200, AG = 12, AY = 300, AH = 100;
  const bx = i => AX + (i - 1) * (AW + AG);
  function arrBoxes(ctx, vals, opt = {}) {
    text(ctx, "menu", AX - 24, AY + 62, 30, { align: "right", weight: 900, color: C.kiko });
    vals.forEach((v, j) => {
      const i = j + 1, x = bx(i), on = opt.hl === i, src = opt.src === i, dst = opt.dst === i;
      ctx.fillStyle = on ? "#FFF3D6" : v == null ? "#F4F6F5" : "#FFFFFF"; rr(ctx, x, AY, AW, AH, 14); ctx.fill();
      ctx.strokeStyle = on ? C.accent : dst ? C.kiko : "#7B8B95"; ctx.lineWidth = on || dst ? 5 : 3;
      if (v == null) ctx.setLineDash([10, 8]); rr(ctx, x, AY, AW, AH, 14); ctx.stroke(); ctx.setLineDash([]);
      if (v != null) text(ctx, v, x + AW / 2, AY + 62, 34, { align: "center", weight: 900 });
      else text(ctx, "kosong", x + AW / 2, AY + 60, 22, { align: "center", weight: 700, color: C.muted });
      text(ctx, String(i), x + AW / 2, AY + AH + 34, 26, { align: "center", weight: 900, color: on ? C.accentDark : C.ink2 });
    });
    text(ctx, "indeks", AX - 24, AY + AH + 34, 22, { align: "right", weight: 800, color: C.ink2 });
  }
  // keadaan array setelah langkah 0..s, dengan langkah ke-s sedang bergerak (u 0..1)
  function arrState(A, s, u) {
    const vals = A.start.slice(); let mv = null, moves = 0;
    A.steps.forEach((st, i) => {
      if (i > s) return; const full = i < s || u >= 1;
      if (st.from !== "in") vals[st.from - 1] = null;
      if (full) { if (st.to !== "out") vals[st.to - 1] = st.v; if (st.from !== "in" && st.to !== "out") moves++; }
      else mv = { st, u };
    });
    return { vals, mv, moves };
  }
  function arrRun(ctx, A, p, opt = {}) {
    const N = A.steps.length, sp = p * N, s = Math.min(N - 1, Math.floor(sp)), u = p >= 1 ? 1 : ease(clamp((sp - s) / 0.75, 0, 1));
    const S = p <= 0 ? { vals: A.start.slice(), mv: null, moves: 0 } : arrState(A, s, u);
    arrBoxes(ctx, S.vals, { hl: opt.hl, dst: S.mv && S.mv.st.to !== "out" ? S.mv.st.to : null });
    if (S.mv) {
      const { st, u } = S.mv, lift = Math.sin(Math.PI * u) * 70;
      const x0 = st.from === "in" ? bx(st.to) : bx(st.from), y0 = st.from === "in" ? AY - 150 : AY;
      const x1 = st.to === "out" ? bx(st.from) : bx(st.to), y1 = st.to === "out" ? AY - 150 : AY;
      const x = lerp(x0, x1, u), y = lerp(y0, y1, u) - (st.from === "in" || st.to === "out" ? 0 : lift);
      ctx.save(); if (st.to === "out") ctx.globalAlpha = 1 - u * 0.6;
      ctx.fillStyle = st.to === "out" ? C.bad : C.accent; rr(ctx, x, y, AW, AH, 14); ctx.fill();
      text(ctx, st.v, x + AW / 2, y + 62, 34, { align: "center", weight: 900, color: "#fff" }); ctx.restore();
    }
    return { S, s: p <= 0 ? -1 : s, u };
  }
  function stepPanel(ctx, A, s, u, done) {
    const x = 300, y = 520, w = 1270;
    card(ctx, x, y, w, 250, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, "LANGKAH", x + 28, y + 44, 24, { weight: 900, color: C.accentDark });
    const cols = A.steps.length > 4 ? 3 : 2;
    A.steps.forEach((st, i) => {
      const lab = st.from === "in" ? `${st.v} masuk ke kotak ${st.to}` : st.to === "out" ? `${st.v} dihapus dari kotak ${st.from}` : `${st.v}: kotak ${st.from} → ${st.to}`;
      const cx = x + 28 + (i % cols) * (w - 56) / cols, cy = y + 70 + Math.floor(i / cols) * 54, on = i === s && !done, ok = done || i < s || (i === s && u >= 1);
      ctx.globalAlpha = ok || on ? 1 : 0.3;
      if (on) { ctx.fillStyle = "#FFF3D6"; rr(ctx, cx - 8, cy, (w - 56) / cols - 12, 46, 10); ctx.fill(); }
      text(ctx, (ok ? "✓ " : (i + 1) + ". ") + lab, cx + 6, cy + 32, 26, { weight: 800, color: ok ? C.ink : C.ink2 });
      ctx.globalAlpha = 1;
    });
  }
  function moveCount(ctx, n, opt = {}) {
    card(ctx, 1600, 300, 230, 150, { fill: opt.done ? C.goodBg : "#FFF9E0", stroke: opt.done ? C.good : C.accent, lw: 4, r: 18 });
    text(ctx, "geseran", 1715, 345, 24, { align: "center", weight: 900, color: C.ink2 });
    text(ctx, String(n), 1715, 420, 64, { align: "center", weight: 900, color: opt.done ? C.good : C.accentDark });
  }

  // ---------- stack / queue ----------
  const STK = [["push", "aku"], ["push", "suka"], ["push", "mi"], ["pop"], ["push", "soto"], ["push", "pedas"], ["pop"], ["pop"]];
  const QUE = [["enqueue", "Dito"], ["enqueue", "Sinta"], ["enqueue", "Rani"], ["dequeue"], ["enqueue", "Budi"], ["dequeue"], ["dequeue"]];
  const DUA = [["masuk", "A"], ["masuk", "B"], ["masuk", "C"], ["masuk", "D"], ["keluar"], ["keluar"]];
  // jalankan ops sampai progres p: kembalikan isi, yang keluar, elemen bergerak, indeks op aktif
  function play(ops, p, kind) {
    if (p <= 0) return { items: [], out: [], moving: null, s: -1 };
    const N = ops.length, sp = p * N, s = p >= 1 ? N : Math.floor(sp), u = ease(clamp((sp - s) / 0.7, 0, 1));
    const items = [], out = []; let moving = null;
    for (let i = 0; i < Math.min(s + 1, N); i++) {
      const [op, v] = ops[i], put = v != null, full = i < s || u >= 1;
      if (put) { if (full) items.push(v); else moving = { label: v, u, dir: "in" }; }
      else { const x = kind === "stack" ? items.pop() : items.shift(); if (full) out.push(x); else moving = { label: x, u, dir: "out" }; }
    }
    return { items, out, moving, s };
  }
  function opsRow(ctx, ops, s, opt = {}) {
    const labs = ops.map(([op, v]) => v != null ? op + " " + v : op);
    ctx.font = "800 24px Inter"; const ws = labs.map(t => ctx.measureText(t).width + 32), gap = 12;
    const tot = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1); let x = 960 - tot / 2; const y = opt.y || 206;
    labs.forEach((t, i) => {
      const on = i === s, done = i < s;
      card(ctx, x, y, ws[i], 52, { fill: on ? "#FFF3D6" : done ? C.bg2 : "#FFFFFF", stroke: on ? C.accent : "#C9D4DB", lw: on ? 5 : 2, r: 12 });
      text(ctx, t, x + ws[i] / 2, y + 35, 24, { align: "center", weight: 800, color: done ? C.ink2 : C.ink });
      if (opt.nums !== false) text(ctx, String(i + 1), x + ws[i] / 2, y + 80, 18, { align: "center", weight: 800, color: C.muted });
      x += ws[i] + gap;
    });
  }
  // queue sendiri (rel sama dengan Kiko.sd.queue) supaya elemen di belakang maju perlahan saat dequeue
  function queueDraw(ctx, x, y, items, moving, opt = {}) {
    const w = opt.w || 120, h = opt.h || 64, cap = opt.cap || 6, st = w + 6;
    ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 10, y - 14); ctx.lineTo(x + cap * st + 4, y - 14); ctx.moveTo(x - 10, y + h + 14); ctx.lineTo(x + cap * st + 4, y + h + 14); ctx.stroke();
    const shift = moving && moving.dir === "out" ? 1 - moving.u : 0;
    items.forEach((it, i) => { const cx = x + (i + shift) * st, front = i === 0 && !moving; ctx.fillStyle = front ? "#FFF3D6" : C.bg2; rr(ctx, cx, y, w, h, 10); ctx.fill(); ctx.strokeStyle = front ? C.accent : "#9AAFA6"; ctx.lineWidth = 3; rr(ctx, cx, y, w, h, 10); ctx.stroke(); text(ctx, String(it), cx + w / 2, y + h / 2 + 11, opt.size || 28, { align: "center", weight: 900 }); });
    if (moving) { const xIn = x + cap * st + 60, xBack = x + items.length * st, xOut = x - w - (opt.outGap || 70); const cx = moving.dir === "in" ? lerp(xIn, xBack, moving.u) : lerp(x, xOut, moving.u); ctx.fillStyle = C.accent; rr(ctx, cx, y, w, h, 10); ctx.fill(); text(ctx, String(moving.label), cx + w / 2, y + h / 2 + 11, opt.size || 28, { align: "center", weight: 900, color: "#fff" }); }
    text(ctx, "depan ← keluar", x, y - 28, 20, { weight: 800, color: C.good }); text(ctx, "masuk → belakang", x + cap * st, y - 28, 20, { align: "right", weight: 800, color: C.kiko });
  }
  function outPanel(ctx, x, y, w, title, out, opt = {}) {
    const h = opt.h || 170; card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 42, 24, { weight: 900, color: C.accentDark });
    const cw = opt.cw || 150;
    out.forEach((v, i) => { const cx = x + 24 + i * (cw + 14); const last = opt.hlLast && i === out.length - 1; card(ctx, cx, y + 66, cw, 70, { fill: last ? "#FFF3D6" : C.badBg, stroke: last ? C.accent : C.bad, lw: 3, r: 12 }); text(ctx, v, cx + cw / 2, y + 112, 28, { align: "center", weight: 900 }); text(ctx, String(i + 1), cx + cw / 2, y + 160, 18, { align: "center", weight: 800, color: C.muted }); });
    if (!out.length) text(ctx, "belum ada", x + 24, y + 110, 24, { weight: 700, color: C.muted });
  }
  function askCard(ctx, x, y, w, h, s) {
    card(ctx, x, y, w, h, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 18 });
    text(ctx, "?", x + w / 2, y + 110, 100, { align: "center", weight: 900, color: C.accent });
    para(ctx, s, x + w / 2, y + 180, 32, w - 60, { align: "center", weight: 900, lh: 1.25 });
  }

  Object.assign(K.SCENES, {
    k15_tujuan(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 230, 30, { weight: 900, color: C.accentDark });
      ["menghitung geseran di array", "menjalankan push dan pop", "menjalankan enqueue dan dequeue", "menebak isi akhir dan yang keluar"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 270 + i * 104, 800, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 326 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 324 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      Sd.stack(ctx, 1260, 700, ["A", "B", "C"], { w: 150, h: 50, cap: 4, hlTop: true, label: "stack" });
      Sd.queue(ctx, 1420, 330, ["A", "B", "C"], { w: 90, h: 56, cap: 3, hlFront: true, noLabels: true });
      text(ctx, "queue", 1565, 440, 22, { align: "center", weight: 900, color: C.ink2 });
    },
    k15_prasyarat(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 330, 290, 860, 360, { fill: C.bg2, r: 22 });
      text(ctx, "E.5", 760, 380, 64, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Struktur Data Standar", 760, 450, 40, { align: "center", weight: 800 });
      ["array dan indeks", "stack: push, pop", "queue: enqueue, dequeue"].forEach((s, i) => text(ctx, "• " + s, 520, 520 + i * 40, 28, { weight: 700, color: C.ink2 }));
      card(ctx, 1240, 290, 360, 360, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Istilah", 1420, 350, 30, { align: "center", weight: 900 });
      [["indeks", "nomor kotak"], ["push / pop", "taruh / ambil di atas"], ["enqueue / dequeue", "masuk belakang / keluar depan"]].forEach(([a, s], i) => { text(ctx, a, 1420, 410 + i * 76, 26, { align: "center", weight: 900, color: C.kikoDark }); text(ctx, s, 1420, 440 + i * 76, 20, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1680, 740, 100, 0, { wave: l });
    },
    k15_array(ctx, b, l) {
      heading(ctx, "ARRAY: KOTAK BERNOMOR, INDEKS MULAI DARI 1");
      const a = b.audio || b.dur, hl = l > a * 0.45 ? 3 : null;
      arrBoxes(ctx, MENU0, { hl });
      if (hl) { card(ctx, 300, 520, 620, 100, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "menu[3] = mi", 610, 585, 44, { align: "center", weight: 900, color: C.accentDark }); arrowIcon(ctx, "up", bx(3) + AW / 2, 480, 30, C.accent); }
      if (l > a * 0.7) { card(ctx, 1010, 520, 580, 100, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 }); text(ctx, "langsung, tanpa menghitung", 1300, 583, 32, { align: "center", weight: 900, color: C.good }); }
      text(ctx, "Catatan: di Python (episode E.7), indeks mulai dari 0.", 960, 700, 24, { align: "center", weight: 700, color: C.ink2 });
    },
    k15_aturan(ctx, b, l) {
      heading(ctx, "DUA ATURAN YANG BERLAWANAN");
      const a = b.audio || b.dur;
      card(ctx, 160, 210, 780, 560, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "STACK (tumpukan)", 550, 260, 30, { align: "center", weight: 900, color: C.kiko });
      const ps = clamp(l / (a * 0.45), 0, 1), r1 = play([["push", "A"], ["push", "B"], ["push", "C"], ["pop"]], ps, "stack");
      Sd.stack(ctx, 430, 690, r1.items, { w: 150, h: 50, cap: 4, hlTop: !r1.moving, moving: r1.moving });
      text(ctx, "push: taruh di atas", 640, 430, 24, { weight: 800 }); text(ctx, "pop: ambil dari atas", 640, 475, 24, { weight: 800 });
      text(ctx, "terakhir masuk,", 640, 560, 26, { weight: 900, color: C.accentDark }); text(ctx, "pertama keluar", 640, 595, 26, { weight: 900, color: C.accentDark });
      ctx.globalAlpha = l > a * 0.35 ? 1 : 0.25;
      card(ctx, 980, 210, 780, 560, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "QUEUE (antrean)", 1370, 260, 30, { align: "center", weight: 900, color: C.kiko });
      const pq = clamp((l - a * 0.4) / (a * 0.45), 0, 1), r2 = play([["enqueue", "A"], ["enqueue", "B"], ["enqueue", "C"], ["dequeue"]], pq, "queue");
      queueDraw(ctx, 1150, 360, r2.items, r2.moving, { w: 110, h: 60, cap: 4, outGap: 30 });
      text(ctx, "enqueue: masuk di belakang", 1050, 520, 24, { weight: 800 }); text(ctx, "dequeue: keluar dari depan", 1050, 565, 24, { weight: 800 });
      text(ctx, "pertama masuk, pertama keluar", 1050, 640, 26, { weight: 900, color: C.accentDark });
      ctx.globalAlpha = 1;
    },
    k15_arr(ctx, b, l) {
      const A = ARR[b.v]; heading(ctx, A.title);
      const p = b.done ? 1 : b.run ? prog(b, l, 0.08, 0.9) : 0;
      const r = arrRun(ctx, A, p, { hl: b.done ? A.hl : null });
      const moves = b.done ? A.steps.filter(s => s.from !== "in" && s.to !== "out").length : r.S.moves;
      if (b.ask) {
        card(ctx, 300, 520, 790, 250, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
        text(ctx, "OPERASI", 360, 566, 24, { weight: 900, color: C.accentDark });
        text(ctx, A.opText, 360, 640, 40, { weight: 900, color: C.kikoDark });
        text(ctx, "array tidak boleh berlubang di tengah", 360, 715, 26, { weight: 700, color: C.ink2 });
        askCard(ctx, 1130, 500, 460, 290, b.ask);
      } else {
        stepPanel(ctx, A, r.s, r.u, b.done);
        moveCount(ctx, moves, { done: b.done });
      }
      if (b.done) {
        const a = b.audio || b.dur;
        if (b.v === "v1" && l > a * 0.4) { card(ctx, 1600, 480, 230, 130, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); para(ctx, "dari depan: mi tertimpa ✕", 1715, 528, 24, 200, { align: "center", weight: 900, color: C.bad, lh: 1.2 }); }
        if (b.v === "v2" && l > a * 0.55) { card(ctx, 1600, 480, 230, 130, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); para(ctx, "hapus di ujung: 0 geseran", 1715, 528, 24, 200, { align: "center", weight: 900, color: C.good, lh: 1.2 }); }
      }
    },
    k15_tebak(ctx, b, l) {
      const T = { v1: ["menu: bakso · soto · mi · nasi · _ · _", "sisipkan es teh di indeks 2"], v2: ["menu: bakso · es teh · soto · mi · nasi · _", "hapus elemen di indeks 1"],
        v3: ["stack undo", "push aku · push suka · push mi · pop · push soto · push pedas · pop · pop"], v4: ["antrean kantin (queue)", "enqueue Dito · Sinta · Rani · dequeue · enqueue Budi · dequeue · dequeue"],
        v5: ["stack dan queue, operasi sama", "masukkan A, B, C, D · lalu keluarkan dua elemen"] }[b.v];
      heading(ctx, "TEBAK DULU");
      card(ctx, 260, 205, 1400, 120, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, T[0], 960, 252, 28, { align: "center", weight: 900, color: C.kikoDark, fit: 1340 });
      text(ctx, T[1], 960, 298, 26, { align: "center", weight: 800, color: C.ink2, fit: 1340 });
      b.opts.forEach((o, i) => {
        const y = 370 + i * 120; card(ctx, 360, y, 1140, 100, { fill: C.bg2, stroke: "#CFDCD5", lw: 3 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(420, y + 50, 30, 0, Math.PI * 2); ctx.fill();
        text(ctx, "ABC"[i], 420, y + 63, 34, { align: "center", color: "#fff", weight: 900 }); text(ctx, o, 480, y + 64, 38, { weight: 800, fit: 990 });
      });
      const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(1640, 550, 46, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1640, 550, 46, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
      text(ctx, "?", 1640, 566, 44, { align: "center", weight: 900, color: C.accentDark });
    },
    k15_stack(ctx, b, l) {
      heading(ctx, "VARIASI 3 · STACK UNTUK UNDO");
      const p = b.done ? 1 : b.run ? prog(b, l, 0.06, 0.92) : 0, r = play(STK, p, "stack");
      opsRow(ctx, STK, b.ask ? -1 : r.s);
      Sd.stack(ctx, 480, 760, r.items, { w: 230, h: 56, cap: 5, hlTop: !r.moving && r.items.length > 0, moving: r.moving });
      // dokumen: kalimat dari isi stack
      card(ctx, 860, 320, 940, 150, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 3, r: 16 });
      text(ctx, "DOKUMEN", 890, 360, 22, { weight: 900, color: C.ink2 });
      const words = r.items.slice(); const cur = Math.floor(l * 2) % 2 ? "|" : "";
      text(ctx, words.join(" ") + cur, 890, 430, 46, { weight: 800 });
      if (b.ask) askCard(ctx, 860, 500, 940, 300, "Apa yang keluar pada pop terakhir, dan apa yang tersisa?");
      else outPanel(ctx, 860, 500, 940, "KELUAR (undo), urut", r.out, { hlLast: b.done, h: 190 });
      if (b.done) { card(ctx, 860, 720, 940, 80, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "sisa: aku suka · yang terakhir masuk keluar dulu", 1330, 772, 28, { align: "center", weight: 900, color: C.good }); }
    },
    k15_queue(ctx, b, l) {
      heading(ctx, "VARIASI 4 · QUEUE DI ANTREAN KANTIN");
      const p = b.done ? 1 : b.run ? prog(b, l, 0.06, 0.92) : 0, r = play(QUE, p, "queue");
      opsRow(ctx, QUE, b.ask ? -1 : r.s);
      // meja kantin di kiri (tempat dilayani)
      ctx.fillStyle = C.tableTop; rr(ctx, 130, 400, 150, 110, 12); ctx.fill(); text(ctx, "KASIR", 205, 465, 24, { align: "center", weight: 900, color: "#fff" });
      const sh = !!b.short; // versi Short: antrean lebih rapat supaya terbaca di ponsel
      queueDraw(ctx, sh ? 300 : 480, 420, r.items, r.moving, { w: sh ? 140 : 190, h: 72, cap: sh ? 4 : 5, size: 30 });
      if (b.ask) askCard(ctx, 480, 560, 1300, 240, "Siapa yang dilayani pada dequeue ketiga, dan siapa yang tersisa?");
      else outPanel(ctx, sh ? 100 : 480, 580, sh ? 820 : 1300, "DILAYANI (dequeue), urut", r.out, { hlLast: b.done, cw: sh ? 150 : 190, h: 190 });
      if (b.done) { if (sh) ctx.translate(-1140, 135); card(ctx, 1240, 655, 520, 90, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "sisa: Budi (paling depan)", 1500, 712, 30, { align: "center", weight: 900, color: C.good }); }
    },
    k15_dua(ctx, b, l) {
      heading(ctx, "VARIASI 5 · URUTAN SAMA, STACK LAWAN QUEUE");
      const p = b.run ? prog(b, l, 0.04, 0.6) : 0, rs = play(DUA, p, "stack"), rq = play(DUA, p, "queue");
      const labs = [["masukkan A"], ["masukkan B"], ["masukkan C"], ["masukkan D"], ["keluarkan"], ["keluarkan"]].map(x => [x[0]]);
      opsRow(ctx, labs, b.ask ? -1 : rs.s, { nums: false });
      card(ctx, 140, 290, 800, 520, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "STACK (push / pop)", 540, 336, 28, { align: "center", weight: 900, color: C.kiko });
      Sd.stack(ctx, 360, 760, rs.items, { w: 150, h: 54, cap: 5, hlTop: !rs.moving && rs.items.length > 0, moving: rs.moving });
      card(ctx, 980, 290, 800, 520, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "QUEUE (enqueue / dequeue)", 1380, 336, 28, { align: "center", weight: 900, color: C.kiko });
      queueDraw(ctx, 1150, 430, rq.items, rq.moving, { w: 110, h: 64, cap: 5, outGap: 30 });
      const outs = (x, y, out) => { text(ctx, "keluar:", x, y, 26, { weight: 900, color: C.ink2 }); out.forEach((v, i) => { card(ctx, x + 110 + i * 90, y - 44, 76, 64, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, v, x + 148 + i * 90, y - 1, 32, { align: "center", weight: 900 }); }); };
      if (b.ask) { text(ctx, "?", 700, 560, 110, { align: "center", weight: 900, color: C.accent }); text(ctx, "?", 1380, 680, 110, { align: "center", weight: 900, color: C.accent }); }
      else { outs(600, 470, rs.out); outs(1040, 620, rq.out); }
      if (b.run && l > (b.audio || b.dur) * 0.66) {
        card(ctx, 600, 560, 300, 110, { fill: C.goodBg, r: 14 }); text(ctx, "sisa: A, B", 750, 628, 32, { align: "center", weight: 900, color: C.good });
        card(ctx, 1040, 680, 300, 100, { fill: C.goodBg, r: 14 }); text(ctx, "sisa: C, D", 1190, 743, 32, { align: "center", weight: 900, color: C.good });
        card(ctx, 1370, 680, 380, 100, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "urutan keluar terbalik", 1560, 743, 28, { align: "center", weight: 900, color: C.accentDark });
      }
    },
    k15_latihan(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "COBA SENDIRI", 960, 220, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 260, 760, 500, { fill: C.bg2, r: 22 });
      text(ctx, "Halaman latihan E.5", 600, 320, 34, { align: "center", weight: 900 });
      card(ctx, 290, 345, 620, 64, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/e5", 600, 387, 26, { align: "center", weight: 800, color: C.kikoDark });
      const a = b.audio || b.dur, on1 = l > a * 0.12;
      card(ctx, 290, 440, 220, 60, { fill: on1 ? "#FFF3D6" : "#FFFFFF", stroke: on1 ? C.accent : "#C9D4DB", lw: on1 ? 5 : 2, r: 12 }); text(ctx, "1 Simulator", 400, 479, 24, { align: "center", weight: 900 });
      card(ctx, 530, 440, 380, 60, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 12 }); text(ctx, "2 Tebak isi array", 720, 479, 24, { align: "center", weight: 800, color: C.ink2 });
      ["push", "pop", "enqueue", "dequeue"].forEach((s, i) => { const on = l > a * (0.3 + i * 0.07); card(ctx, 290 + i * 155, 535, 140, 56, { fill: on ? C.accent : "#FFFFFF", stroke: C.accent, lw: 2, r: 10 }); text(ctx, s, 360 + i * 155, 571, 22, { align: "center", weight: 900, color: on ? "#fff" : C.accentDark }); });
      text(ctx, "tebak dulu isinya, baru tekan", 600, 650, 24, { align: "center", weight: 700, color: C.ink2 });
      if (l > a * 0.6) {
        card(ctx, 1030, 260, 670, 500, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1365, 320, 34, { align: "center", weight: 900 });
        [["stack", "tombol undo, tumpukan piring"], ["queue", "antrean kantin, antrean cetak"]].forEach(([k, s], i) => { card(ctx, 1080, 370 + i * 150, 570, 120, { fill: "#FFFFFF", r: 16 }); text(ctx, k, 1110, 420 + i * 150, 30, { weight: 900, color: C.kiko }); text(ctx, "contoh: " + s, 1110, 462 + i * 150, 24, { weight: 700, color: C.ink2 }); });
        text(ctx, "cari satu lagi di sekitarmu", 1365, 720, 24, { align: "center", weight: 700, color: C.ink2 });
      }
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
