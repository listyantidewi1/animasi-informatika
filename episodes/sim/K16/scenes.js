/* K16 Simulasi konsep: balapan algoritma pengurutan (bubble, selection, insertion) dan binary search.
   Memakai pembantu E.6 (K.urut: binary, cards, table) dan adegan baru berawalan k16_. Gaya diagram Fase E.
   Penghitung: 1 langkah = 1 perbandingan atau 1 tukar (insertion: 1 geser), persis seperti urut.js / halaman latihan E.6.
   Semua gambar di atas y≈830 (kartu narasi tiga baris mulai y≈841). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, U = K.urut, L = K.layar;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;

  const DATA = {
    acak: [48, 19, 31, 12, 70, 25, 37, 56],
    hampir: [12, 19, 25, 31, 37, 56, 48, 70],
    terbalik: [70, 56, 48, 37, 31, 25, 19, 12],
    besar: [48, 19, 31, 12, 70, 25, 37, 56, 64, 8, 42, 90, 27, 53, 15, 81]
  };
  const NAMA = { acak: "DATA ACAK · 8 KARTU", hampir: "DATA HAMPIR URUT · 8 KARTU", terbalik: "DATA TERBALIK · 8 KARTU", besar: "DATA ACAK · 16 KARTU" };
  const VAR = { acak: 1, hampir: 2, terbalik: 3, besar: 4, biner: 5 };
  const ALGS = [
    { k: "bubble", name: "Bubble sort", rule: "tukar dua tetangga yang terbalik", col: "#2E7E9A", sw: "tukar" },
    { k: "selection", name: "Selection sort", rule: "pilih terkecil, tukar ke depan", col: "#7E57C2", sw: "tukar" },
    { k: "insertion", name: "Insertion sort", rule: "sisipkan ke bagian yang urut", col: "#D9822B", sw: "geser" }];
  const TARGET = 48;

  // ---------- penelusuran dengan identitas kartu (agar perpindahan bisa dianimasikan) ----------
  // snaps[k] = keadaan setelah langkah ke-k: pos[id] = {s: slot, lift: 0/1}, hl = id yang sedang dikerjakan, op = cmp/swap/shift
  function race(kind, arr) {
    const n = arr.length, order = arr.map((_, i) => i), snaps = [];
    let cmp = 0, sw = 0, done = [], min = null, key = null, hole = -1;
    const snap = (op, hl) => {
      const pos = []; order.forEach((id, s) => { if (id != null) pos[id] = { s, lift: 0 }; });
      if (key != null) pos[key] = { s: hole, lift: 1 };
      snaps.push({ op, hl: hl || [], pos, done: done.slice(), min, cmp, sw });
    };
    const resnap = () => { const last = snaps.pop(); cmp = last.cmp; sw = last.sw; snap(last.op, last.hl); };
    snap("start");
    if (kind === "bubble") {
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
          cmp++; snap("cmp", [order[j], order[j + 1]]);
          if (arr[order[j]] > arr[order[j + 1]]) { [order[j], order[j + 1]] = [order[j + 1], order[j]]; sw++; snap("swap", [order[j], order[j + 1]]); }
        }
        done.push(n - 1 - i); resnap();
      }
    } else if (kind === "selection") {
      for (let i = 0; i < n - 1; i++) {
        let m = i; min = order[i];
        for (let j = i + 1; j < n; j++) {
          const was = order[m]; cmp++;
          if (arr[order[j]] < arr[order[m]]) m = j;
          min = order[m]; snap("cmp", [was, order[j]]);
        }
        if (m !== i) { [order[i], order[m]] = [order[m], order[i]]; sw++; min = null; snap("swap", [order[i], order[m]]); }
        done.push(i); min = null; resnap();
      }
    } else {
      for (let i = 1; i < n; i++) {
        key = order[i]; order[i] = null; hole = i; let j = i - 1;
        while (j >= 0) {
          cmp++; snap("cmp", [order[j], key]);
          if (arr[order[j]] > arr[key]) { order[j + 1] = order[j]; order[j] = null; hole = j; sw++; snap("shift", [order[j + 1], key]); j--; }
          else break;
        }
        order[hole] = key; key = null; done = []; for (let s = 0; s <= i; s++) done.push(s); resnap();
      }
    }
    done = []; for (let s = 0; s < n; s++) done.push(s); resnap();
    return { snaps, cmp, sw, total: cmp + sw, arr };
  }
  const RACES = {};
  function races(d) {
    if (RACES[d]) return RACES[d];
    const R = ALGS.map(a => race(a.k, DATA[d]));
    R.forEach(r => { r.rank = 1 + R.filter(o => o.total < r.total).length; });
    return (RACES[d] = R);
  }
  K.k16 = { race, races, DATA };   // untuk pemeriksaan angka

  // ---------- gambar kartu-batang ----------
  const barH = (v, big) => (big ? 44 : 34) + v / 90 * (big ? 76 : 64);
  function bars(ctx, x0, y0, w, arr, st0, st1, u, opt = {}) {
    const n = arr.length, slot = w / n, bw = Math.min(opt.bw || 104, slot - (n > 8 ? 10 : 22)), base = y0;
    const fs = n > 8 ? 20 : 28;
    const moving = id => (st0.pos[id].s !== st1.pos[id].s ? 1 : 0) + st1.pos[id].lift * 2;
    const order = arr.map((_, id) => id).sort((a, b) => moving(a) - moving(b));
    order.forEach(id => {
      const p0 = st0.pos[id], p1 = st1.pos[id];
      const s = lerp(p0.s, p1.s, u), lift = lerp(p0.lift, p1.lift, u), hop = (p0.s < p1.s && !p1.lift && !p0.lift) ? Math.sin(Math.PI * u) * (st1.op === "swap" ? 44 : 18) : 0;
      const v = arr[id], h = barH(v, opt.big), x = x0 + s * slot + (slot - bw) / 2, y = base - h - lift * (opt.lift || 30) - hop;
      const hl = st1.hl.includes(id), doneNow = st1.done.includes(Math.round(p1.s)) && !p1.lift, isKey = p1.lift > 0 || p0.lift > 0 && u < 1;
      let fill = "#FFFFFF", stroke = "#B7C4CC", lw = 3;
      if (doneNow) { fill = C.goodBg; stroke = C.good; }
      if (isKey) { fill = "#E3F3F9"; stroke = C.kiko; lw = 4; }
      if (hl) { if (st1.op === "cmp") { fill = "#FFF3D6"; stroke = C.accent; lw = 5; } else { fill = C.badBg; stroke = C.bad; lw = 5; } }
      if (st1.min === id && !hl) { stroke = C.kiko; lw = 5; }
      ctx.fillStyle = fill; rr(ctx, x, y, bw, h, 8); ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = lw; rr(ctx, x, y, bw, h, 8); ctx.stroke();
      text(ctx, String(v), x + bw / 2, y + Math.min(fs + 10, h / 2 + fs * 0.36), fs, { align: "center", weight: 900 });
      if (st1.min === id) text(ctx, "min", x + bw / 2, base + 22, 17, { align: "center", weight: 900, color: C.kiko });
    });
  }
  const stillOf = arr => ({ hl: [], done: [], pos: arr.map((_, i) => ({ s: i, lift: 0 })), min: null, op: "start" });
  const sortedOf = arr => { const ids = arr.map((_, i) => i).sort((a, b) => arr[a] - arr[b]); const pos = []; ids.forEach((id, s) => pos[id] = { s, lift: 0 }); return { hl: [], done: arr.map((_, i) => i), pos, min: null, op: "end" }; };

  // ---------- satu lintasan lomba ----------
  const LANE_Y = [166, 382, 598], LANE_H = 208, CX0 = 470, CX1 = 1490;
  function lane(ctx, y0, A, R, T, opt = {}) {
    const N = R.total, fin = T >= N, k = Math.min(N, Math.ceil(T - 1e-9)), u = fin ? 1 : ease(T - (k - 1));
    const s0 = R.snaps[Math.max(0, k - 1)], s1 = fin ? { ...R.snaps[k], hl: [], min: null } : R.snaps[k];
    card(ctx, 110, y0, 1700, LANE_H, { fill: "#FFFFFF", r: 18, stroke: fin && R.rank === 1 ? C.good : "#D7E2DC", lw: fin && R.rank === 1 ? 5 : 3 });
    ctx.fillStyle = A.col; rr(ctx, 110, y0, 14, LANE_H, 7); ctx.fill();
    text(ctx, A.name, 140, y0 + 48, 32, { weight: 900, color: A.col });
    text(ctx, A.rule, 140, y0 + 80, 19, { weight: 700, color: C.ink2 });
    // penghitung
    const c = k ? s1.cmp : 0, s = k ? s1.sw : 0;
    [[c, "perbandingan", "#FFF3D6", C.accentDark], [s, A.sw, C.badBg, C.bad]].forEach(([v, lab, f, col], i) => {
      const x = 134 + i * 156; card(ctx, x, y0 + 104, 144, 86, { fill: f, r: 12 });
      text(ctx, String(v), x + 72, y0 + 152, 38, { align: "center", weight: 900, color: col });
      text(ctx, lab, x + 72, y0 + 178, 17, { align: "center", weight: 800, color: C.ink2 });
    });
    // kartu
    const big = R.arr.length <= 8;
    if (opt.still) bars(ctx, CX0, y0 + 150, CX1 - CX0, R.arr, opt.still, opt.still, 1, { big });
    else bars(ctx, CX0, y0 + 150, CX1 - CX0, R.arr, k ? s0 : R.snaps[0], k ? s1 : R.snaps[0], k ? u : 1, { big, lift: big ? 28 : 24 });
    // lintasan dan pelari
    const ty = y0 + 188; ctx.strokeStyle = "#DCE5E0"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(CX0, ty); ctx.lineTo(CX1, ty); ctx.stroke();
    const fr = clamp(T / N, 0, 1); ctx.strokeStyle = A.col; ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.moveTo(CX0, ty); ctx.lineTo(lerp(CX0, CX1, fr), ty); ctx.stroke(); ctx.globalAlpha = 1; ctx.lineCap = "butt";
    for (let q = 0; q < 4; q++) for (let r = 0; r < 2; r++) { ctx.fillStyle = (q + r) % 2 ? C.ink : "#FFFFFF"; ctx.fillRect(CX1 + 6 + r * 7, ty - 14 + q * 7, 7, 7); }
    ctx.fillStyle = A.col; ctx.beginPath(); ctx.arc(lerp(CX0, CX1, fr), ty, 12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.stroke();
    // total langkah dan peringkat
    const tot = c + s;
    text(ctx, opt.hideTotal ? "?" : String(tot), 1660, y0 + 98, 64, { align: "center", weight: 900, color: opt.hideTotal ? C.muted : C.ink });
    text(ctx, "langkah", 1660, y0 + 128, 22, { align: "center", weight: 800, color: C.ink2 });
    if (fin && !opt.still) {
      const win = R.rank === 1; card(ctx, 1570, y0 + 146, 180, 46, { fill: win ? C.good : C.bg2, r: 23 });
      text(ctx, "JUARA " + R.rank, 1660, y0 + 178, 24, { align: "center", weight: 900, color: win ? "#FFFFFF" : C.ink2 });
    }
  }
  function header(ctx, d, T, opt = {}) {
    card(ctx, 110, 118, 560, 40, { fill: C.kiko, r: 20 }); text(ctx, "VARIASI " + VAR[d] + " · " + NAMA[d], 390, 147, 22, { align: "center", weight: 900, color: "#FFFFFF", fit: 530 });
    if (T != null) text(ctx, "waktu: " + Math.ceil(T - 1e-9) + " langkah", 1810, 150, 26, { align: "right", weight: 900, color: C.accentDark });
    if (opt.note) text(ctx, opt.note, 1180, 150, 22, { align: "center", weight: 800, color: C.ink2 });
  }
  function raceSpan(b) { const a = b.audio || b.dur; return Math.max(a * 0.9, (b.dur || a) - 1.4); }
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 900 });
  const banner = (ctx, s, y, opt = {}) => { const w = opt.w || 1200; card(ctx, 960 - w / 2, y, w, 76, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 3, r: 16 }); text(ctx, s, 960, y + 50, opt.size || 30, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  const at = (b, f) => (b.audio || b.dur) * f;

  // mini ilustrasi aturan tiap algoritma (dipakai di adegan peserta)
  function miniAlg(ctx, k, x, y, l) {
    const vals = k === "bubble" ? [25, 48, 37, 56] : k === "selection" ? [48, 37, 12, 56] : [25, 48, 56, 37];
    const W = 74, G = 16, h = v => 30 + v * 1.6; const ph = (l % 3) / 3;
    vals.forEach((v, i) => {
      let xx = x + i * (W + G), yy = y, fill = "#fff", stroke = "#B7C4CC";
      if (k === "bubble" && (i === 1 || i === 2)) { fill = "#FFF3D6"; stroke = C.accent; const u = ease((ph - 0.3) / 0.4); xx += (i === 1 ? 1 : -1) * u * (W + G); }
      if (k === "selection" && i === 2) { stroke = C.kiko; }
      if (k === "selection" && (i === 0 || i === 2)) { const u = ease((ph - 0.4) / 0.4); xx += (i === 0 ? 1 : -1) * u * 2 * (W + G); if (u > 0) { fill = C.badBg; stroke = C.bad; } }
      if (k === "insertion" && i === 3) { const u = ease((ph - 0.15) / 0.3), w2 = ease((ph - 0.5) / 0.3); yy -= 40 * u * (1 - ease((ph - 0.8) / 0.15)); xx -= w2 * 2 * (W + G); fill = "#E3F3F9"; stroke = C.kiko; }
      if (k === "insertion" && (i === 1 || i === 2)) { const w2 = ease((ph - 0.5) / 0.3); xx += w2 * (W + G); }
      ctx.fillStyle = fill; rr(ctx, xx, yy - h(v), W, h(v), 8); ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 4; rr(ctx, xx, yy - h(v), W, h(v), 8); ctx.stroke();
      text(ctx, String(v), xx + W / 2, yy - h(v) + 34, 26, { align: "center", weight: 900 });
      if (k === "selection" && i === 2) text(ctx, "min", xx + W / 2, yy + 26, 18, { align: "center", weight: 900, color: C.kiko });
    });
  }

  // halaman latihan E.6 (versi ponsel, digambar ulang secara ringkas)
  function pill(ctx, x, y, w, h, s, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.on ? C.accent : opt.fill || "#FFFFFF", stroke: opt.on ? C.accent : opt.done ? C.good : "#CFDCD5", lw: 2, r: 10 });
    text(ctx, s, x + (opt.left ? 14 : w / 2), y + h / 2 + 7, opt.size || 19, { align: opt.left ? "left" : "center", weight: 900, color: opt.on ? "#FFFFFF" : C.ink, fit: w - 16 });
  }
  const PAGE_DATA = { acak: [48, 37, 25, 12, 56, 31], hampir: [12, 25, 31, 37, 56, 48], terbalik: [56, 48, 37, 31, 25, 12] };

  // versi ringkas untuk Short (wilayah 100–1100 × 115–930, dipotong utuh tanpa diperkecil)
  function laneS(ctx, y0, A, R, T, opt = {}) {
    const N = R.total, fin = T >= N && !opt.still, k = opt.still ? 0 : Math.min(N, Math.ceil(T - 1e-9)), u = fin || !k ? 1 : ease(T - (k - 1));
    const s0 = R.snaps[Math.max(0, k - 1)], s1 = fin ? { ...R.snaps[k], hl: [], min: null } : R.snaps[k];
    card(ctx, 100, y0, 1000, 240, { fill: "#FFFFFF", r: 18, stroke: fin && R.rank === 1 ? C.good : "#D7E2DC", lw: fin && R.rank === 1 ? 6 : 3 });
    ctx.fillStyle = A.col; rr(ctx, 100, y0, 14, 240, 7); ctx.fill();
    text(ctx, A.name, 134, y0 + 50, 40, { weight: 900, color: A.col });
    const c = k ? s1.cmp : 0, s = k ? s1.sw : 0;
    text(ctx, opt.still ? "? langkah" : (c + s) + " langkah", 1076, y0 + 52, 44, { align: "right", weight: 900, color: opt.still ? C.muted : C.ink });
    bars(ctx, 130, y0 + 172, 940, R.arr, k ? s0 : R.snaps[0], k ? s1 : R.snaps[0], k ? u : 1, { big: true, lift: 26 });
    const ty = y0 + 194; ctx.strokeStyle = "#DCE5E0"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(134, ty); ctx.lineTo(1066, ty); ctx.stroke(); ctx.lineCap = "butt";
    ctx.fillStyle = A.col; ctx.beginPath(); ctx.arc(lerp(134, 1066, clamp(T / N, 0, 1)), ty, 12, 0, Math.PI * 2); ctx.fill();
    text(ctx, `${c} perbandingan · ${s} ${A.sw}`, 134, y0 + 228, 25, { weight: 800, color: C.ink2 });
    if (fin) { card(ctx, 870, y0 + 200, 206, 34, { fill: R.rank === 1 ? C.good : C.bg2, r: 17 }); text(ctx, "JUARA " + R.rank, 973, y0 + 226, 22, { align: "center", weight: 900, color: R.rank === 1 ? "#fff" : C.ink2 }); }
  }

  Object.assign(K.SCENES, {
    k16s_lomba(ctx, b, l) {
      const d = b.data, R = races(d), max = Math.max(...R.map(r => r.total)), t0 = 0.4, span = raceSpan(b) - t0;
      const T = b.still ? 0 : clamp((l - t0) / span * max, 0, max);
      text(ctx, NAMA[d], 600, 152, 34, { align: "center", weight: 900, color: C.kikoDark });
      ALGS.forEach((A, i) => laneS(ctx, 176 + i * 250, A, R[i], T, { still: b.still }));
    },
    k16s_besar(ctx, b, l) {
      const R8 = races("acak"), R16 = races("besar"), n = clamp(Math.floor((l - 0.3) / 0.7) + 1, 0, 3);
      card(ctx, 100, 120, 1000, 600, { fill: "#FFFFFF", r: 22 });
      text(ctx, "LANGKAH: 8 KARTU → 16 KARTU", 600, 186, 36, { align: "center", weight: 900, color: C.accentDark });
      ALGS.forEach((A, i) => {
        if (i >= n) return; const y = 230 + i * 150, f = R16[i].total / R8[i].total;
        card(ctx, 130, y, 940, 130, { fill: C.bg2, r: 16 }); ctx.fillStyle = A.col; rr(ctx, 130, y, 14, 130, 7); ctx.fill();
        text(ctx, A.name, 168, y + 56, 36, { weight: 900, color: A.col });
        text(ctx, R8[i].total + " → " + R16[i].total, 168, y + 108, 40, { weight: 900 });
        text(ctx, "×" + f.toFixed(1).replace(".", ","), 1040, y + 90, 56, { align: "right", weight: 900, color: C.bad });
      });
    },
    k16_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menebak pemenang lomba pengurutan", "membuktikannya dengan penghitung langkah", "melihat efek data dua kali lipat", "menghitung langkah binary search"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 860, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800, fit: 750 }); ctx.globalAlpha = 1;
      });
      ALGS.forEach((A, i) => {
        const y = 330 + i * 120; card(ctx, 1200, y, 470, 96, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 14 });
        ctx.fillStyle = A.col; rr(ctx, 1200, y, 12, 96, 6); ctx.fill(); text(ctx, A.name, 1230, y + 40, 26, { weight: 900, color: A.col });
        const fr = clamp((l * [0.22, 0.17, 0.28][i]) % 1.15, 0, 1); ctx.strokeStyle = "#DCE5E0"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(1230, y + 70); ctx.lineTo(1620, y + 70); ctx.stroke(); ctx.lineCap = "butt";
        ctx.fillStyle = A.col; ctx.beginPath(); ctx.arc(1230 + 390 * fr, y + 70, 10, 0, Math.PI * 2); ctx.fill();
      });
      text(ctx, "data yang sama, siapa paling hemat?", 1435, 720, 24, { align: "center", weight: 800, color: C.ink2 });
    },
    k16_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 330, 290, 620, 360, { fill: C.bg2, r: 22 });
      text(ctx, "E.6", 640, 380, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Algoritma Standar: Pencarian dan Pengurutan", 640, 450, 34, 540, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas X", 640, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      [["Bubble sort", ALGS[0].col], ["Selection sort", ALGS[1].col], ["Insertion sort", ALGS[2].col], ["Binary search", C.good]].forEach(([s, col], i) => {
        const u = ease((l - 1 - i * 0.6) / 0.4); ctx.globalAlpha = Math.max(0.15, u);
        card(ctx, 1030, 290 + i * 92, 520, 74, { fill: "#fff", stroke: col, lw: 4, r: 37 }); text(ctx, s, 1290, 338 + i * 92, 30, { align: "center", weight: 900, color: col }); ctx.globalAlpha = 1;
      });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    },
    k16_peserta(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "TIGA PESERTA LOMBA");
      const marks = [0.12, 0.36, 0.66];
      ALGS.forEach((A, i) => {
        const u = ease((l - at(b, marks[i])) / 0.5); const x = 180 + i * 530;
        ctx.save(); ctx.globalAlpha = 0.2 + 0.8 * u;
        card(ctx, x, 260, 500, 520, { fill: "#fff", stroke: A.col, lw: 4, r: 20 });
        ctx.fillStyle = A.col; rr(ctx, x, 260, 500, 70, 20); ctx.fill(); ctx.fillRect(x, 300, 500, 30);
        text(ctx, A.name, x + 250, 308, 34, { align: "center", weight: 900, color: "#fff" });
        miniAlg(ctx, A.k, x + 74, 560, u > 0 ? l - at(b, marks[i]) : 0);
        para(ctx, A.rule, x + 250, 650, 28, 440, { align: "center", weight: 800, lh: 1.25 });
        ctx.restore();
      });
    },
    k16_aturan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, b.step === 2 ? "LANGKAH PALING SEDIKIT = SAMPAI FINIS DULUAN" : "ATURAN LOMBA: SEMUA LANGKAH DIHITUNG");
      if (b.step !== 2) {
        // satu kartu data yang sama untuk ketiganya
        U.cards(ctx, 380, 270, { a: DATA.acak, hl: [], done: [] }, { w: 120, h: 90, gap: 12, index: false });
        text(ctx, "kartu yang sama untuk ketiga peserta", 960, 400, 24, { align: "center", weight: 800, color: C.ink2 });
        [["1 perbandingan", "= 1 langkah", "#FFF3D6", C.accentDark, 0.2], ["1 tukar", "= 1 langkah", C.badBg, C.bad, 0.4], ["1 geser (insertion)", "= 1 langkah", C.badBg, C.bad, 0.68]].forEach(([s1, s2, f, col, m], i) => {
          const u = ease((l - at(b, m)) / 0.4); ctx.globalAlpha = Math.max(0.12, u);
          const x = 260 + i * 480; card(ctx, x, 460, 440, 200, { fill: f, r: 20 });
          text(ctx, s1, x + 220, 545, 36, { align: "center", weight: 900, color: col, fit: 400 }); text(ctx, s2, x + 220, 605, 32, { align: "center", weight: 800, color: C.ink });
          ctx.globalAlpha = 1;
        });
        return;
      }
      const sp = [1, 0.62, 0.8], t = Math.max(0, l - 0.8);
      ALGS.forEach((A, i) => {
        const y = 300 + i * 140, fr = clamp(t / 6 * sp[i] * 1.0, 0, 1);
        text(ctx, A.name, 200, y + 12, 30, { weight: 900, color: A.col });
        ctx.strokeStyle = "#DCE5E0"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(500, y); ctx.lineTo(1500, y); ctx.stroke(); ctx.lineCap = "butt";
        for (let q = 0; q < 6; q++) for (let r = 0; r < 2; r++) { ctx.fillStyle = (q + r) % 2 ? C.ink : "#FFFFFF"; ctx.fillRect(1510 + r * 9, y - 27 + q * 9, 9, 9); }
        ctx.fillStyle = A.col; ctx.beginPath(); ctx.arc(500 + 1000 * fr, y, 18, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.stroke();
        if (fr >= 1) text(ctx, "finis!", 1560, y + 12, 26, { weight: 900, color: C.good });
      });
      banner(ctx, "setiap langkah = satu ketukan waktu yang sama", 700, { w: 1100 });
    },
    k16_tanya(ctx, b, l) {
      const d = b.data;
      card(ctx, 120, 150, 1680, 670);
      if (d === "biner") {
        heading(ctx, "VARIASI 5 · BINARY SEARCH: CARI " + TARGET);
        const s8 = DATA.acak.slice().sort((a, c) => a - c), s16 = DATA.besar.slice().sort((a, c) => a - c);
        text(ctx, "8 kartu urut", 180, 300, 26, { weight: 900, color: C.ink2 });
        U.cards(ctx, 400, 250, { a: s8, hl: [s8.indexOf(TARGET)], done: [] }, { w: 82, h: 74, gap: 10, index: false });
        card(ctx, 1180, 252, 520, 70, { fill: C.goodBg, r: 14 }); text(ctx, "binary search: 3 langkah", 1440, 298, 28, { align: "center", weight: 900, color: C.good });
        const u = ease((l - 1.2) / 0.6); ctx.globalAlpha = u;
        text(ctx, "16 kartu urut", 180, 470, 26, { weight: 900, color: C.ink2 });
        U.cards(ctx, 180, 500, { a: s16, hl: [s16.indexOf(TARGET)], done: [] }, { w: 88, h: 74, gap: 10, index: false });
        card(ctx, 1180, 400, 520, 70, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "binary search: ? langkah", 1440, 446, 28, { align: "center", weight: 900, color: C.accentDark });
        ctx.globalAlpha = 1;
        text(ctx, "Dua kali lipat juga? Atau hanya bertambah sedikit?", 960, 700, 30, { align: "center", weight: 800, color: C.ink2 });
        return;
      }
      heading(ctx, "VARIASI " + VAR[d] + " · " + NAMA[d]);
      const arr = DATA[d], n = arr.length, w = n > 8 ? 88 : 150, g = n > 8 ? 10 : 22, x0 = 960 - (n * (w + g) - g) / 2;
      if (d === "besar") {
        const u = ease((l - 1.2) / 0.8);
        arr.forEach((v, i) => {
          const isNew = i >= 8; if (isNew && u <= 0) return;
          ctx.save(); if (isNew) { ctx.globalAlpha = u; ctx.translate((1 - u) * 80, 0); }
          U.cards(ctx, x0 + i * (w + g), 340, { a: [v], hl: isNew ? [0] : [], done: [] }, { w, h: 120, gap: 0, index: false }); ctx.restore();
        });
        text(ctx, "8 kartu lama", x0 + 4 * (w + g) - g / 2, 300, 26, { align: "center", weight: 900, color: C.ink2 });
        if (u > 0) { ctx.globalAlpha = u; text(ctx, "+ 8 kartu baru", x0 + 12 * (w + g) - g / 2, 300, 26, { align: "center", weight: 900, color: C.accentDark }); ctx.globalAlpha = 1; }
      } else {
        const hl = d === "hampir" ? [5, 6] : [];
        U.cards(ctx, x0, 330, { a: arr, hl, done: [] }, { w, h: 140, gap: g, index: false });
        if (d === "hampir") { const xm = x0 + 6 * (w + g) - g / 2; text(ctx, "hanya dua kartu ini yang tertukar", xm, 520, 26, { align: "center", weight: 900, color: C.accentDark }); }
        if (d === "terbalik") { ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0 + 40, 300); ctx.lineTo(x0 + n * (w + g) - 60, 300); ctx.stroke(); H.arrowIcon(ctx, "east", x0 + n * (w + g) - 60, 300, 40, C.bad); text(ctx, "dari yang terbesar sampai yang terkecil", 960, 530, 26, { align: "center", weight: 900, color: C.bad }); }
      }
      ALGS.forEach((A, i) => { const x = 330 + i * 430; card(ctx, x, 600, 400, 90, { fill: "#fff", stroke: A.col, lw: 4, r: 45 }); text(ctx, A.name + " ?", x + 200, 658, 30, { align: "center", weight: 900, color: A.col }); });
      text(ctx, "Siapa yang sampai di garis finis lebih dulu?", 960, 760, 28, { align: "center", weight: 800, color: C.ink2 });
    },
    k16_tebak(ctx, b, l) {
      const d = b.data, R = races(d);
      header(ctx, d, null, { note: "Tebak dulu sebelum lomba dimulai!" });
      ALGS.forEach((A, i) => lane(ctx, LANE_Y[i], A, R[i], 0, { hideTotal: true }));
      thinking(ctx, 1760, 140, l, b.dur);
    },
    k16_lomba(ctx, b, l) {
      const d = b.data, R = races(d), max = Math.max(...R.map(r => r.total)), t0 = 0.6, span = raceSpan(b) - t0;
      const T = clamp((l - t0) / span * max, 0, max);
      header(ctx, d, T, { note: "1 langkah = 1 perbandingan atau 1 tukar/geser" });
      ALGS.forEach((A, i) => lane(ctx, LANE_Y[i], A, R[i], T));
    },
    k16_hasil(ctx, b, l) {
      const d = b.data, R = races(d);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "HASIL VARIASI " + VAR[d] + " · " + NAMA[d]);
      const win = R.findIndex(r => r.rank === 1), n = clamp(Math.floor((l - 0.3) / 0.6) + 1, 0, 3);
      const cw = [360, 270, 270, 230, 200], X = 960 - cw.reduce((a, c) => a + c, 0) / 2, Y = 270, RH = 84;
      U.table(ctx, X, Y, cw, ["algoritma", "perbandingan", "tukar / geser", "langkah", "peringkat"],
        R.map((r, i) => [ALGS[i].name, r.cmp, r.sw, r.total, "juara " + r.rank]), { rh: RH, n, hlRow: b.fokus ? null : (n >= 3 ? win : null), colors: R.map(r => r.rank === 1 ? C.good : C.ink) });
      if (b.fokus === "tukar" && l > 0.5) {
        const xc = X + cw[0] + cw[1]; ctx.strokeStyle = C.bad; ctx.lineWidth = 6; rr(ctx, xc + 8, Y + RH + 6, cw[2] - 16, RH * 2 - 12, 14); ctx.stroke();
        const xp = X + cw[0]; ctx.strokeStyle = C.accent; rr(ctx, xp + 8, Y + RH + 6, cw[1] - 16, RH * 2 - 12, 14); ctx.stroke();
        banner(ctx, `perbandingan sama (${R[0].cmp}), jumlah tukar berbeda: ${R[1].sw} lawan ${R[0].sw}`, 640, { w: 1200 });
      } else if (n >= 3) {
        const winners = R.map((r, i) => r.rank === 1 ? ALGS[i].name : null).filter(Boolean);
        banner(ctx, `juara: ${winners.join(" dan ")} · ${R[win].total} langkah`, 640, { w: 1000, fill: C.goodBg, stroke: C.good, color: C.good });
      }
    },
    k16_besar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "8 KARTU LAWAN 16 KARTU (DATA ACAK)");
      const R8 = races("acak"), R16 = races("besar"), n = clamp(Math.floor((l - 0.3) / 0.7) + 1, 0, 3);
      const fmt = x => x.toFixed(1).replace(".", ",") + "×";
      const cw = [360, 300, 300, 300], X = 960 - 630, Y = 260;
      U.table(ctx, X, Y, cw, ["algoritma", "8 kartu", "16 kartu", "kali lipat"], R8.map((r, i) => [ALGS[i].name, r.total + " langkah", R16[i].total + " langkah", fmt(R16[i].total / r.total)]), { rh: 80, n });
      if (l > at(b, 0.5)) banner(ctx, `perbandingan bubble sort: ${R8[0].cmp} → ${R16[0].cmp}`, 620, { w: 900 });
    },
    k16_skala(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "PERBANDINGAN BUBBLE SORT: TUMBUH KUADRAT");
      const ns = [8, 16, 32, 64], vals = ns.map(n => race("bubble", Array.from({ length: n }, (_, i) => n - i)).cmp), max = vals[vals.length - 1];
      const show = clamp(Math.floor((l - 0.4) / Math.max(0.8, at(b, 0.6) / 4)) + 1, 0, 4);
      ns.forEach((n, i) => {
        if (i >= show) return; const y = 270 + i * 112, w = Math.max(8, vals[i] / max * 1100);
        text(ctx, n + " kartu", 400, y + 52, 32, { align: "right", weight: 900 });
        ctx.fillStyle = i < 2 ? C.kiko : C.kikoLight; rr(ctx, 430, y + 10, w, 64, 10); ctx.fill();
        text(ctx, vals[i].toLocaleString("id-ID"), 450 + w, y + 54, 32, { weight: 900, color: C.ink });
        if (i > 0) text(ctx, "≈ " + (vals[i] / vals[i - 1]).toFixed(1).replace(".", ",") + "×", 1740, y + 54, 28, { align: "right", weight: 900, color: C.bad });
      });
      if (show >= 4) text(ctx, "kartu 2× lipat → perbandingan ±4× lipat", 960, 760, 28, { align: "center", weight: 900, color: C.accentDark });
    },
    k16_tebak_biner(ctx, b, l) {
      K.SCENES.k16_tanya(ctx, { ...b, data: "biner" }, 5);
      thinking(ctx, 1730, 215, l, b.dur);
    },
    k16_biner(ctx, b, l) {
      const n = b.n || 8, arr = (n > 8 ? DATA.besar : DATA.acak).slice().sort((a, c) => a - c);
      const steps = U.binary(arr, TARGET), lin = arr.indexOf(TARGET) + 1;
      card(ctx, 120, 150, 1680, 670); heading(ctx, `BINARY SEARCH · CARI ${TARGET} · ${n} KARTU URUT`);
      const t0 = 1.2, per = Math.max(1.2, (at(b, 0.92) - t0) / steps.length);
      const k = Math.floor((l - t0) / per), st = l < t0 ? { a: arr, hl: [], cmp: 0, note: `cari ${TARGET} · kartunya sudah urut` } : steps[clamp(k, 0, steps.length - 1)];
      const w = n > 8 ? 88 : 150, g = n > 8 ? 10 : 20, x0 = 960 - (n * (w + g) - g) / 2;
      U.cards(ctx, x0, 320, st, { w, h: n > 8 ? 110 : 130, gap: g });
      if (st.lo != null) {
        const cx = i => x0 + i * (w + g) + w / 2, mid = Math.ceil((st.lo + st.hi) / 2);
        if (st.lo === st.hi) text(ctx, "kiri = kanan", cx(st.lo), 300, 20, { align: "center", weight: 900, color: C.kiko });
        else { text(ctx, "kiri", cx(st.lo), 300, 20, { align: "center", weight: 900, color: C.kiko }); text(ctx, "kanan", cx(st.hi), 300, 20, { align: "center", weight: 900, color: C.kiko }); }
        if (mid !== st.lo && mid !== st.hi) text(ctx, "tengah", cx(mid), 300, 20, { align: "center", weight: 900, color: C.accentDark });
      }
      card(ctx, 200, 520, 960, 76, { fill: C.bg2, r: 14 }); text(ctx, st.note, 680, 570, 28, { align: "center", weight: 900, color: st.found ? C.good : C.ink, fit: 920 });
      card(ctx, 1220, 500, 500, 116, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 }); text(ctx, String(st.cmp), 1330, 578, 60, { align: "center", weight: 900, color: C.good }); text(ctx, "langkah binary search", 1400, 568, 24, { weight: 800, color: C.ink2 });
      if (st.found) { card(ctx, 1220, 640, 500, 70, { fill: "#fff", stroke: "#CFDCD5", lw: 3, r: 14 }); text(ctx, `linear search: ${lin} langkah`, 1470, 686, 26, { align: "center", weight: 900, color: C.ink2 }); }
    },
    k16_biner_hasil(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "LINEAR SEARCH LAWAN BINARY SEARCH");
      const rows = [8, 16].map(n => {
        const arr = (n > 8 ? DATA.besar : DATA.acak).slice().sort((a, c) => a - c);
        const last = s => s[s.length - 1].cmp, probe = []; arr.forEach(v => probe.push(v, v + 1)); probe.push(arr[0] - 1);
        const worst = Math.max(...probe.map(t => last(U.binary(arr, t))));
        return [n + " kartu", (arr.indexOf(TARGET) + 1) + " langkah", last(U.binary(arr, TARGET)) + " langkah", worst + " langkah"];
      });
      const n = clamp(Math.floor((l - 0.3) / 0.8) + 1, 0, 2);
      U.table(ctx, 960 - 650, 260, [320, 330, 330, 320], ["banyak kartu", "linear (cari 48)", "binary (cari 48)", "binary paling banyak"], rows, { rh: 84, n, hlRow: n - 1 });
      if (l > at(b, 0.45)) banner(ctx, "kartu 2× lipat: linear ikut 2× lipat, binary cukup +1 langkah", 560, { w: 1200 });
    },
    k16_papan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "PAPAN SKOR LOMBA");
      const win = d => { const R = races(d), i = R.findIndex(r => r.rank === 1); return [ALGS[i].name, R[i].total + " langkah"]; };
      const s16 = DATA.besar.slice().sort((a, c) => a - c), bs = U.binary(s16, TARGET);
      const rows = [["1", "acak, 8 kartu", ...win("acak")], ["2", "hampir urut", ...win("hampir")], ["3", "terbalik", ...win("terbalik")], ["4", "acak, 16 kartu", ...win("besar")],
        ["5", "cari 48 di 16 kartu", "Binary search", bs[bs.length - 1].cmp + " langkah (linear " + (s16.indexOf(TARGET) + 1) + ")"]].slice(0, b.upto || 5);
      const n = clamp(Math.floor((l - 0.2) / 0.5) + 1, 0, rows.length);
      U.table(ctx, 960 - 760, 250, [150, 380, 400, 590], ["variasi", "data", "juara", "langkah"], rows, { rh: 80, n, colors: rows.map(r => r[2].startsWith("Selection") ? ALGS[1].col : r[2].startsWith("Insertion") ? ALGS[2].col : C.good) });
      if ((b.upto || 5) <= 3 && l > at(b, 0.4)) banner(ctx, "tidak ada yang selalu menang: lihat dulu bentuk datanya", 600, { w: 1100 });
    },
    k16_latihan(ctx, b, l) {
      // ponsel berisi halaman latihan E.6
      const PX = 210, PY = 128, PW = 600, PH = 694, s = 1.3;
      ctx.fillStyle = "#2B3A44"; rr(ctx, PX, PY, PW, PH, 36); ctx.fill(); ctx.fillStyle = "#F4F7F5"; rr(ctx, PX + 14, PY + 14, PW - 28, PH - 28, 26); ctx.fill();
      ctx.save(); rr(ctx, PX + 14, PY + 14, PW - 28, PH - 28, 26); ctx.clip();
      const x = PX + 36, w = PW - 72; let y = PY + 40;
      card(ctx, PX + 14, PY + 14, PW - 28, 46, { fill: "#FFFFFF", r: 0 }); text(ctx, "belajar-informatika.vercel.app/e6", PX + PW / 2, PY + 45, 19, { align: "center", weight: 800, color: C.kikoDark });
      y = PY + 100; text(ctx, "Latihan: hitung langkahnya", x, y, 27, { weight: 900 });
      const a = b.audio || b.dur, c1 = a * 0.18, c2 = a * 0.42, lvl = l > c1 + 0.2 ? 1 : 0, guessed = l > c2 + 0.2;
      // tombol level
      const B1 = { x, y: y + 22, w: 200, h: 46 }, B2 = { x: x + 210, y: y + 22, w: w - 210, h: 46 }, B3 = { x, y: y + 78, w: w, h: 46 };
      pill(ctx, B1.x, B1.y, B1.w, B1.h, "1 Visualisator", { on: lvl === 0 }); pill(ctx, B2.x, B2.y, B2.w, B2.h, "2 Lomba tiga algoritma", { on: lvl === 1 }); pill(ctx, B3.x, B3.y, B3.w, B3.h, "3 Tebak langkah binary search", {});
      y += 160;
      let O3 = null;
      if (lvl === 0) {
        para(ctx, "Pilih algoritma dan data, lalu tekan Langkah. Amati penghitung.", x, y, 19, w, { weight: 700, color: C.ink2, lh: 1.3 }); y += 64;
        ["Bubble", "Selection", "Insertion"].forEach((t, i) => pill(ctx, x + i * 176, y, 166, 42, t, { on: i === 0, size: 18 })); y += 52;
        ["data acak", "hampir urut", "terbalik"].forEach((t, i) => pill(ctx, x + i * 176, y, 166, 42, t, { on: i === 0, size: 18 })); y += 60;
        U.cards(ctx, x + 20, y, { a: PAGE_DATA.acak, hl: [0, 1], done: [] }, { w: 70, h: 70, gap: 14, index: false }); y += 100;
        card(ctx, x, y, w / 2 - 6, 70, { fill: "#FFF3D6", r: 12 }); text(ctx, "1", x + w / 4, y + 38, 28, { align: "center", weight: 900 }); text(ctx, "perbandingan", x + w / 4, y + 60, 15, { align: "center", weight: 800, color: C.ink2 });
        card(ctx, x + w / 2 + 6, y, w / 2 - 6, 70, { fill: C.badBg, r: 12 }); text(ctx, "0", x + w * 0.75, y + 38, 28, { align: "center", weight: 900 }); text(ctx, "pertukaran", x + w * 0.75, y + 60, 15, { align: "center", weight: 800, color: C.ink2 }); y += 84;
        pill(ctx, x, y, 170, 44, "▶ Langkah", { fill: "#FFE7B0", size: 18 }); pill(ctx, x + 180, y, 220, 44, "⏩ Sampai selesai", { size: 18 });
      } else if (!guessed) {
        para(ctx, "Tebak dulu algoritma dengan perbandingan paling sedikit untuk data hampir urut, lalu jalankan lombanya.", x, y, 19, w, { weight: 700, color: C.ink2, lh: 1.3 }); y += 92;
        card(ctx, x, y, w, 100, { fill: "#E6EEEA", r: 12 }); para(ctx, "Data hampir urut: " + PAGE_DATA.hampir.join(", ") + ". Algoritma mana yang perbandingannya paling sedikit?", x + 14, y + 34, 19, w - 28, { weight: 800, lh: 1.3 }); y += 116;
        ["Bubble", "Selection", "Insertion"].forEach((t, i) => { pill(ctx, x, y + i * 56, w, 46, t, { left: true }); if (i === 2) O3 = { x: x + 100, y: y + i * 56 + 23 }; });
      } else {
        const tr = (k, arr) => race(k, arr);
        card(ctx, x, y - 10, w, 56, { fill: C.goodBg, r: 12 }); text(ctx, "Tebakanmu: Insertion. Tepat!", x + 14, y + 26, 20, { weight: 900, color: C.good }); y += 64;
        const cw = [120, 136, 136, 136]; let cx = x;
        ["data", "Bubble", "Selection", "Insertion"].forEach((h, i) => { card(ctx, cx, y, cw[i] - 2, 40, { fill: "#E6EEEA", r: 6 }); text(ctx, h, cx + cw[i] / 2, y + 27, 17, { align: "center", weight: 900 }); cx += cw[i]; }); y += 44;
        Object.keys(PAGE_DATA).forEach(d => {
          const r = ALGS.map(A => tr(A.k, PAGE_DATA[d])), mn = Math.min(...r.map(q => q.cmp)); cx = x;
          card(ctx, cx, y, cw[0] - 2, 42, { fill: "#FFFFFF", r: 6 }); text(ctx, d, cx + cw[0] / 2, y + 28, 17, { align: "center", weight: 800 }); cx += cw[0];
          r.forEach((q, i) => { card(ctx, cx, y, cw[i + 1] - 2, 42, { fill: q.cmp === mn ? C.goodBg : "#FFFFFF", r: 6 }); text(ctx, q.cmp + " · " + q.sw, cx + cw[i + 1] / 2, y + 28, 18, { align: "center", weight: q.cmp === mn ? 900 : 700 }); cx += cw[i + 1]; });
          y += 46;
        });
        para(ctx, "angka: perbandingan · pertukaran/geseran; hijau = perbandingan paling sedikit", x, y + 22, 16, w, { weight: 700, color: C.ink2, lh: 1.3 });
      }
      ctx.restore();
      // pointer
      const P2 = { x: B2.x + B2.w / 2, y: B2.y + B2.h / 2 }, P3 = O3 || { x: x + 100, y: PY + 100 + 160 + 92 + 116 + 2 * 56 + 23 }, P0 = { x: 760, y: 760 };
      let p = P0, click = 0;
      if (l < c1) { const u = ease(l / c1); p = { x: lerp(P0.x, P2.x, u), y: lerp(P0.y, P2.y, u) }; }
      else if (l < c2) { const u = ease((l - c1 - 0.5) / (c2 - c1 - 0.5)); p = { x: lerp(P2.x, P3.x, u), y: lerp(P2.y, P3.y, u) }; click = (l - c1) / 0.6; }
      else { const u = ease((l - c2 - 0.9) / 0.8); p = { x: lerp(P3.x, 790, u), y: lerp(P3.y, 800, u) }; click = (l - c2) / 0.6; }
      L.cursor(ctx, p.x, p.y, { click });
      // panel kanan
      card(ctx, 880, 150, 900, 400, { fill: "#FFFFFF", r: 22 });
      text(ctx, "COBA SENDIRI DI HALAMAN LATIHAN E.6", 920, 205, 26, { weight: 900, color: C.accentDark });
      ["Tekan 2 Lomba tiga algoritma.", "Tebak dulu pemenang untuk data hampir urut.", "Bandingkan angka di tabelnya.", "Di 1 Visualisator, coba data terbalik."].forEach((t, i) => {
        const yy = 260 + i * 70, now = (i === 0 && l < c1 + 0.6) || (i === 1 && l >= c1 + 0.6 && l < c2 + 0.6) || (i === 2 && l >= c2 + 0.6 && l < a * 0.7) || (i === 3 && l >= a * 0.7);
        if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, 905, yy - 10, 850, 58, 12); ctx.fill(); }
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(940, yy + 19, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 940, yy + 28, 24, { align: "center", weight: 900, color: "#fff" });
        text(ctx, t, 978, yy + 29, 27, { weight: 800, fit: 770 });
      });
      card(ctx, 880, 580, 900, 230, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Tugas nyata", 920, 632, 28, { weight: 900 });
      para(ctx, "Tulis delapan angka di potongan kertas, acak, lalu urutkan dengan insertion sort sambil menghitung perbandingan dan geserannya.", 920, 680, 26, 820, { weight: 700, lh: 1.3 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
