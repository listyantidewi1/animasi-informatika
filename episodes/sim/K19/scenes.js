/* K19 Simulasi konsep: Saat Data Membesar (episode induk F11.3). Gaya diagram Fase F.
   Memakai pembantu F11.3 (kualitas.js: Qk.pointers, Qk.binary, Qk.bars) dan E.6 (urut.js: U.trace, U.cards, U.table).
   Semua gambar di atas y≈830 (kartu narasi tiga baris mulai y≈841). Angka langkah = kasus terburuk:
   linear n, biner ⌈log2(n+1)⌉ (sama dengan kode cari_biner F11.3), bubble sort n(n−1)/2, sorted() ≈ n·log2 n (perkiraan). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, U = K.urut, Qk = K.kualitas, Kt = K.kartu, Py = K.py;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const PURPLE = "#8E6BBF";
  const fmt = n => Math.round(n).toLocaleString("id-ID");
  const A = b => b.audio || b.dur;
  const prog = (l, b, a0, a1) => clamp((l - A(b) * a0) / (A(b) * (a1 - a0)), 0, 1);
  const panel = ctx => card(ctx, 120, 128, 1680, 694);
  const heading = (ctx, s, y = 190) => text(ctx, s, 960, y, 32, { align: "center", color: C.accentDark, weight: 900 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.18; fn(); ctx.restore(); };
  const banner = (ctx, s, y, w = 1200, opt = {}) => { card(ctx, 960 - w / 2, y, w, 76, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 16 }); text(ctx, s, 960, y + 50, opt.size || 30, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  const ARR10 = [12, 18, 25, 31, 40, 47, 56, 63, 72, 85];
  const BUB10 = [56, 12, 85, 31, 72, 18, 47, 25, 63, 40];
  const log2c = n => Math.ceil(Math.log2(n + 1));
  const nlogn = n => n * Math.log2(n);

  // deretan kartu sederhana: st(i) → "now" | "seen" | "found" | "dim" | ""
  function row(ctx, x, y, arr, st, opt = {}) {
    const w = opt.w || 110, h = opt.h || 96, gap = opt.gap || 12;
    arr.forEach((v, i) => { const s = st ? st(i) : ""; const cx = x + i * (w + gap); ctx.save(); if (s === "dim") ctx.globalAlpha = 0.18;
      const fill = s === "now" ? "#FFF3D6" : s === "found" ? C.goodBg : s === "seen" ? "#EEF1F3" : "#fff";
      const stroke = s === "now" ? C.accent : s === "found" ? C.good : s === "seen" ? "#C9D4DB" : "#B7C4CC";
      ctx.fillStyle = fill; rr(ctx, cx, y, w, h, 12); ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = s === "now" || s === "found" ? 6 : 3; rr(ctx, cx, y, w, h, 12); ctx.stroke();
      text(ctx, String(v), cx + w / 2, y + h / 2 + 12, opt.size || 34, { align: "center", weight: 900, color: s === "seen" ? C.muted : C.ink });
      if (opt.index !== false) text(ctx, String(i), cx + w / 2, y + h + 24, 18, { align: "center", weight: 800, color: C.ink2 });
      ctx.restore(); });
    return x + arr.length * (w + gap) - gap;
  }
  function counter(ctx, x, y, n, label, opt = {}) {
    const w = opt.w || 260; card(ctx, x, y, w, 110, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 16 });
    text(ctx, typeof n === "string" ? n : fmt(n), x + w / 2, y + 62, opt.size || 50, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 20 });
    text(ctx, label, x + w / 2, y + 96, 20, { align: "center", weight: 800, color: C.ink2 });
  }
  function chip(ctx, x, y, w, s, opt = {}) { card(ctx, x, y, w, opt.h || 56, { fill: opt.fill || C.bg2, stroke: opt.stroke, lw: 3, r: 12 }); text(ctx, s, x + w / 2, y + (opt.h || 56) / 2 + 10, opt.size || 26, { align: "center", weight: 900, color: opt.color || C.ink, fit: w - 16 }); }
  // jam dinding sederhana
  function stopwatch(ctx, x, y, r, frac) {
    ctx.fillStyle = "#fff"; ctx.strokeStyle = C.ink2; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.ink2; rr(ctx, x - 14, y - r - 26, 28, 20, 5); ctx.fill();
    ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); const a = -Math.PI / 2 + frac * Math.PI * 2; ctx.lineTo(x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.75); ctx.stroke();
    for (let i = 0; i < 12; i++) { const q = i / 12 * Math.PI * 2; ctx.strokeStyle = C.ink2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + Math.cos(q) * r * 0.82, y + Math.sin(q) * r * 0.82); ctx.lineTo(x + Math.cos(q) * r * 0.92, y + Math.sin(q) * r * 0.92); ctx.stroke(); }
  }

  // ---------- data variasi (untuk adegan tanya/tebak) ----------
  const VQ = {
    1: { n: "10", q: "Target di posisi terakhir. Berapa perbandingannya?", algo: ["cari linear", "cari biner"] },
    2: { n: "100", q: "Data sepuluh kali lebih banyak. Apakah cari biner juga naik sepuluh kali?", algo: ["cari linear", "cari biner"] },
    3: { n: "1.000.000", q: "Sejuta nomor peserta ujian. Berapa perbandingan cari biner?", algo: ["cari linear", "cari biner"] },
    4: { n: "10", q: "Mengurutkan sepuluh data. Seberapa jauh bubble sort tertinggal?", algo: ["bubble sort", "sorted()"] },
    5: { n: "1.000", q: "Mengurutkan seribu data. Berapa perbandingan bubble sort?", algo: ["bubble sort", "sorted()"] }
  };
  function tanya(ctx, b, l, tebak) {
    const v = VQ[b.v]; panel(ctx);
    text(ctx, "VARIASI " + b.v, 200, 200, 30, { weight: 900, color: C.kiko });
    text(ctx, b.v >= 4 ? "PENGURUTAN" : "PENCARIAN", 200, 240, 24, { weight: 800, color: C.ink2 });
    card(ctx, 200, 270, 520, 200, { fill: C.bg2, r: 22 });
    text(ctx, "banyak data (n)", 460, 320, 26, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, v.n, 460, 420, v.n.length > 6 ? 76 : 96, { align: "center", weight: 900, color: C.ink });
    para(ctx, v.q, 780, 300, 38, 900, { weight: 800, lh: 1.3 });
    v.algo.forEach((s, i) => { const x = 780 + i * 470; card(ctx, x, 420, 440, 130, { fill: "#fff", stroke: i ? C.good : C.bad, lw: 4, r: 18 }); text(ctx, s, x + 30, 472, 30, { weight: 900, color: i ? C.good : C.bad }); text(ctx, "?", x + 380, 512, 72, { align: "center", weight: 900, color: C.accent }); text(ctx, "perbandingan", x + 30, 522, 22, { weight: 700, color: C.ink2 }); });
    if (!tebak) { kiko(ctx, 330, 690, 110, 0, { mood: "happy" }); text(ctx, "Menurutmu?", 470, 700, 40, { weight: 900, color: C.accentDark }); return; }
    const opts = b.pilih || []; const ow = Math.min(440, (1440 - (opts.length - 1) * 30) / opts.length);
    text(ctx, "TEBAK DULU", 200, 640, 28, { weight: 900, color: C.accentDark });
    opts.forEach((o, i) => { const x = 200 + i * (ow + 30), u = ease((l - 0.3 - i * 0.35) / 0.4); ctx.save(); ctx.globalAlpha = u; card(ctx, x, 664, ow, 100, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 18 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 50, 714, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, "ABC"[i], x + 50, 726, 32, { align: "center", weight: 900, color: "#fff" });
      text(ctx, o, x + 96, 728, 36, { weight: 900, fit: ow - 110 }); ctx.restore(); });
    const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(1690, 220, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1690, 220, 40, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
  }

  // ---------- grafik pertumbuhan ----------
  const G = { x: 300, y: 250, w: 1060, h: 500, nx: 1000, ny: 10000 };
  const CURVES = [
    ["cari biner", "log n", n => log2c(n), C.good],
    ["cari linear", "n", n => n, C.kiko],
    ["sorted()", "n log n", n => nlogn(Math.max(1, n)), PURPLE],
    ["bubble sort", "n²", n => n * (n - 1) / 2, C.bad]];
  function chart(ctx, show, g = G, labels = true) {
    const px = n => g.x + n / g.nx * g.w, py = v => g.y + g.h - v / g.ny * g.h;
    ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i++) { const v = i * 2500; ctx.beginPath(); ctx.moveTo(g.x, py(v)); ctx.lineTo(g.x + g.w, py(v)); ctx.stroke(); if (labels) text(ctx, fmt(v), g.x - 14, py(v) + 8, 20, { align: "right", weight: 800, color: C.ink2 }); }
    if (labels) for (let i = 0; i <= 4; i++) { const n = i * 250; text(ctx, fmt(n), px(n), g.y + g.h + 32, 20, { align: "center", weight: 800, color: C.ink2 }); }
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(g.x, g.y - 10); ctx.lineTo(g.x, g.y + g.h); ctx.lineTo(g.x + g.w + 10, g.y + g.h); ctx.stroke();
    if (labels) { text(ctx, "banyak data (n) →", g.x + g.w, g.y + g.h + 66, 22, { align: "right", weight: 900, color: C.ink2 }); text(ctx, "perbandingan", g.x - 10, g.y - 26, 22, { align: "left", weight: 900, color: C.ink2 }); }
    CURVES.forEach(([name, big, f, col], k) => {
      if (!show[k]) return; const end = g.nx * show[k];
      ctx.save(); ctx.beginPath(); ctx.rect(g.x - 4, g.y - 4, g.w + 8, g.h + 8); ctx.clip();
      ctx.strokeStyle = col; ctx.lineWidth = labels ? 7 : 6; ctx.lineJoin = "round"; ctx.beginPath();
      for (let n = 1; n <= end; n += 2) { const X = px(n), Y = py(f(n)); if (n === 1) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); if (Y < g.y - 10) break; }
      ctx.stroke(); ctx.restore();
    });
  }
  function legend(ctx, x, y, show) {
    CURVES.forEach(([name, big, f, col], k) => { ctx.save(); if (!show[k]) ctx.globalAlpha = 0.18; card(ctx, x, y + k * 112, 380, 96, { fill: "#fff", stroke: col, lw: 4, r: 14 });
      ctx.fillStyle = col; rr(ctx, x + 20, y + k * 112 + 42, 46, 12, 6); ctx.fill(); text(ctx, name, x + 84, y + k * 112 + 44, 26, { weight: 900, color: col }); text(ctx, big, x + 84, y + k * 112 + 78, 22, { weight: 800, color: C.ink2 }); ctx.restore(); });
  }

  Object.assign(K.SCENES, {
    k19_tujuan(ctx, b, l) {
      panel(ctx);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 220, 220, 30, { weight: 900, color: C.accentDark });
      ["menghitung perbandingan, bukan detik", "membandingkan n, log n, n log n, dan n²", "memilih algoritma yang tetap cepat"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.8) / 0.5); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u;
        card(ctx, 220, 260 + i * 120, 860, 96, { fill: C.bg2, r: 16 }); text(ctx, "✓", 262, 322 + i * 120, 38, { weight: 900, color: C.good }); text(ctx, s, 316, 320 + i * 120, 32, { weight: 800, fit: 740 }); ctx.restore(); });
      chart(ctx, [0, 1, 2, 3].map(k => clamp((l - 0.6 - k * 0.5) / 1.2, 0, 1)), { x: 1200, y: 290, w: 480, h: 330, nx: 1000, ny: 10000 }, false);
      text(ctx, "data membesar →", 1680, 668, 24, { align: "right", weight: 800, color: C.ink2 });
    },
    k19_prasyarat(ctx, b, l) {
      panel(ctx);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 210, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 260, 640, 380, { fill: C.bg2, r: 22 });
      text(ctx, "F11.3", 620, 360, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Algoritma Standar dalam Kode dan Kualitas Program", 620, 430, 32, 560, { align: "center", weight: 800, lh: 1.25 });
      text(ctx, "yang perlu kamu kenal:", 1040, 300, 26, { weight: 800, color: C.ink2 });
      ["cari linear", "cari biner", "bubble sort", "sorted() bawaan"].forEach((s, i) => { const u = ease((l - 1 - i * 0.6) / 0.4); ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * u; card(ctx, 1040, 330 + i * 86, 560, 70, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 14 }); text(ctx, s, 1070, 376 + i * 86, 30, { weight: 900 }); ctx.restore(); });
      kiko(ctx, 1700, 740, 90, 0, { wave: l });
    },
    k19_aturan(ctx, b, l) {
      panel(ctx); heading(ctx, "CARA MENGHITUNG: PERBANDINGAN, BUKAN DETIK");
      const u1 = l > A(b) * 0.05, u2 = l > A(b) * 0.4;
      dim(ctx, u1, () => { card(ctx, 200, 240, 700, 520, { fill: C.badBg, stroke: C.bad, lw: 4, r: 20 });
        stopwatch(ctx, 550, 430, 110, (l * 0.4) % 1);
        ctx.strokeStyle = C.bad; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(420, 300); ctx.lineTo(680, 560); ctx.stroke(); ctx.lineCap = "butt";
        text(ctx, "stopwatch", 550, 620, 32, { align: "center", weight: 900, color: C.bad });
        para(ctx, "hasilnya berbeda di laptop lama dan laptop baru", 550, 670, 24, 600, { align: "center", weight: 800, color: C.ink2 }); });
      dim(ctx, u2, () => { card(ctx, 1020, 240, 700, 520, { fill: C.goodBg, stroke: C.good, lw: 4, r: 20 });
        const k = u2 ? clamp(Math.floor((l - A(b) * 0.45) / 0.45) + 1, 1, 6) : 0;
        Py.code(ctx, 1060, 280, 620, [{ t: "for i in range(len(daftar)):" }, { t: "    if daftar[i] == target:", hl: true }, { t: "        return i" }], { rh: 46, size: 21 });
        counter(ctx, 1240, 480, k, "perbandingan", { fill: "#fff", stroke: C.good, color: C.good });
        para(ctx, "satu perbandingan = satu kali dua nilai dibandingkan", 1370, 660, 24, 600, { align: "center", weight: 800, color: C.ink2 }); });
    },
    k19_terburuk(ctx, b, l) {
      panel(ctx); heading(ctx, "KASUS TERBURUK: LANGKAH PALING BANYAK");
      const p1 = prog(l, b, 0.3, 0.55), p2 = prog(l, b, 0.62, 0.9);
      const k1 = Math.floor(p1 * 10), k2 = Math.floor(p2 * 10);
      text(ctx, "1. target 85 di posisi terakhir", 220, 270, 28, { weight: 900, color: C.ink });
      row(ctx, 220, 290, ARR10, i => i < k1 ? (i === 9 && p1 >= 1 ? "found" : "seen") : i === k1 && p1 > 0 ? "now" : "", { w: 104, h: 84, size: 30, index: false });
      if (p1 >= 1) text(ctx, "10 perbandingan", 1500, 345, 30, { weight: 900, color: C.good });
      dim(ctx, l > A(b) * 0.55, () => {
        text(ctx, "2. target 90 tidak ada sama sekali", 220, 470, 28, { weight: 900, color: C.ink });
        row(ctx, 220, 490, ARR10, i => i < k2 ? "seen" : i === k2 && p2 > 0 ? "now" : "", { w: 104, h: 84, size: 30, index: false });
        if (p2 >= 1) text(ctx, "10 perbandingan", 1500, 545, 30, { weight: 900, color: C.bad }); });
      if (p2 >= 1) banner(ctx, "kasus terburuk: semua data harus diperiksa", 650, 1000);
    },
    k19_dua_cara(ctx, b, l) {
      panel(ctx); heading(ctx, "DUA CARA MENCARI");
      text(ctx, "cari linear", 200, 260, 32, { weight: 900, color: C.bad });
      Py.code(ctx, 200, 280, 700, [{ t: "def cari_linear(daftar, target):" }, { t: "    for i in range(len(daftar)):" }, { t: "        if daftar[i] == target:" }, { t: "            return i" }, { t: "    return -1" }], { rh: 40, size: 19 });
      const k = Math.floor(l * 2.2) % 8; row(ctx, 200, 590, ARR10.slice(0, 8), i => i < k ? "seen" : i === k ? "now" : "", { w: 76, h: 64, size: 24, gap: 12, index: false });
      text(ctx, "satu per satu dari depan →", 200, 700, 24, { weight: 800, color: C.ink2 });
      dim(ctx, l > A(b) * 0.3, () => {
        text(ctx, "cari biner", 1000, 260, 32, { weight: 900, color: C.good });
        Py.code(ctx, 1000, 280, 720, [{ t: "def cari_biner(daftar, target):" }, { t: "    kiri, kanan = 0, len(daftar) - 1" }, { t: "    while kiri <= kanan:" }, { t: "        tengah = (kiri + kanan) // 2" }, { t: "        if daftar[tengah] == target:" }, { t: "            return tengah" }, { t: "        elif daftar[tengah] < target:" }, { t: "            kiri = tengah + 1" }, { t: "        else:" }, { t: "            kanan = tengah - 1" }, { t: "    return -1" }], { rh: 36, size: 17 });
      });
      if (l > A(b) * 0.72) { card(ctx, 1000, 740, 720, 64, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 14 }); text(ctx, "⚠ syarat: data sudah urut", 1360, 783, 28, { align: "center", weight: 900, color: C.accentDark }); }
    },
    k19_tanya(ctx, b, l) { tanya(ctx, b, l, false); },
    k19_tebak(ctx, b, l) { tanya(ctx, b, l, true); },
    k19_v1_linear(ctx, b, l) {
      panel(ctx); heading(ctx, "VARIASI 1 · CARI LINEAR PADA 10 DATA");
      text(ctx, "target: 85", 200, 270, 30, { weight: 900, color: C.accentDark });
      const p = prog(l, b, 0.08, 0.7), k = Math.min(9, Math.floor(p * 10));
      row(ctx, 200, 320, ARR10, i => i < k ? "seen" : i === k ? (p >= 1 ? "found" : "now") : "", { w: 110, h: 100 });
      const cmp = Math.min(10, Math.floor(p * 10) + 1);
      text(ctx, k < 9 || p < 1 ? `${ARR10[k]} ≠ 85, lanjut ke kanan` : "85 = 85: ketemu di indeks 9", 200, 530, 30, { weight: 900, color: p >= 1 ? C.good : C.ink2 });
      counter(ctx, 1470, 316, cmp, "perbandingan", p >= 1 ? { fill: C.goodBg, stroke: C.good, color: C.good } : {});
      if (p >= 1) banner(ctx, "cari linear: 10 data → 10 perbandingan", 640, 1000, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },
    k19_v1_biner(ctx, b, l) {
      panel(ctx); heading(ctx, "VARIASI 1 · CARI BINER PADA 10 DATA");
      const steps = Qk.binary(ARR10, 85); const p = prog(l, b, 0.08, 0.72); const k = clamp(Math.floor(p * steps.length), 0, steps.length - 1);
      text(ctx, "target: 85", 200, 260, 30, { weight: 900, color: C.accentDark });
      Qk.pointers(ctx, 200, 330, ARR10, steps[k], { w: 110, h: 100, gap: 12 });
      text(ctx, steps[k].note, 200, 540, 30, { weight: 900, color: steps[k].found ? C.good : C.ink2 });
      const sizes = [10, 5, 2, 1];
      text(ctx, "sisa data:", 200, 620, 26, { weight: 900, color: C.ink2 });
      sizes.forEach((s, i) => { if (i > k) return; chip(ctx, 360 + i * 150, 580, 120, String(s), { fill: i === k ? "#FFF3D6" : C.bg2, stroke: i === k ? C.accent : undefined, size: 32 }); if (i < k) text(ctx, "→", 495 + i * 150, 620, 26, { align: "center", weight: 900, color: C.ink2 }); });
      counter(ctx, 1480, 316, k + 1, "perbandingan", steps[k].found ? { fill: C.goodBg, stroke: C.good, color: C.good, w: 240 } : { w: 240 });
      chip(ctx, 1480, 470, 240, "linear: 10", { fill: C.badBg, color: C.bad, size: 26 });
      if (steps[k].found && p >= 1) banner(ctx, "cari biner: 10 data → 4 perbandingan", 690, 1000, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    k19_v2_jalan(ctx, b, l) {
      panel(ctx); heading(ctx, "VARIASI 2 · 100 DATA");
      const X = 220, CW = 11, GAP = 2;
      const strip = (y, st) => { for (let i = 0; i < 100; i++) { const s = st(i); ctx.fillStyle = s === "now" ? C.accent : s === "found" ? C.good : s === "seen" ? "#C9D4DB" : s === "in" ? "#FFF3D6" : s === "dim" ? "#F1F4F6" : "#E6EDF2"; ctx.fillRect(X + i * (CW + GAP), y, CW, 70); if (s === "in") { ctx.strokeStyle = C.accent; ctx.lineWidth = 1; ctx.strokeRect(X + i * (CW + GAP), y, CW, 70); } } };
      // linear
      const pl = prog(l, b, 0.03, 0.3), kl = Math.min(99, Math.floor(pl * 100));
      text(ctx, "cari linear", X, 260, 28, { weight: 900, color: C.bad });
      strip(280, i => i < kl ? "seen" : i === kl ? (pl >= 1 ? "found" : "now") : "");
      counter(ctx, 1560, 240, Math.min(100, kl + 1), "perbandingan", { w: 200, size: 44, fill: C.badBg, stroke: C.bad, color: C.bad });
      // biner: ke kanan terus (target = data terakhir)
      const R = []; let lo = 0, hi = 99; while (lo <= hi) { const m = (lo + hi) >> 1; R.push([lo, hi, m]); lo = m + 1; }
      const pb = prog(l, b, 0.38, 0.92), kb = clamp(Math.floor(pb * R.length), 0, R.length - 1), on = l > A(b) * 0.33;
      dim(ctx, on, () => {
        text(ctx, "cari biner", X, 440, 28, { weight: 900, color: C.good });
        const [a, z, m] = R[kb]; strip(460, i => i < a || i > z ? "dim" : i === m ? (kb === R.length - 1 ? "found" : "now") : "in");
        counter(ctx, 1560, 420, on ? kb + 1 : 0, "perbandingan", { w: 200, size: 44, fill: C.goodBg, stroke: C.good, color: C.good });
        text(ctx, "sisa data tiap langkah:", X, 600, 24, { weight: 900, color: C.ink2 });
        R.forEach(([a, z], i) => { if (!on || i > kb) return; const x = X + i * 190; chip(ctx, x, 620, 150, String(z - a + 1), { fill: i === kb ? "#FFF3D6" : C.bg2, stroke: i === kb ? C.accent : undefined, size: 32, h: 64 }); if (i < kb) text(ctx, "→", x + 170, 662, 26, { align: "center", weight: 900, color: C.ink2 }); });
      });
      if (pb >= 1) text(ctx, "100 lawan 7", 1660, 760, 34, { align: "center", weight: 900, color: C.accentDark });
    },
    k19_v2_hasil(ctx, b, l) {
      panel(ctx); heading(ctx, "LINEAR NAIK SEPULUH KALI, BINER HANYA BERTAMBAH SEDIKIT");
      const n = 2 + (l > A(b) * 0.08 ? 1 : 0);
      U.table(ctx, 220, 250, [320, 380, 380], ["banyak data (n)", "cari linear", "cari biner"], [["10", "10", "4"], ["100", "100", "7"], ["1.000", "1.000", "10"]], { rh: 80, n, hlRow: n === 3 ? 2 : -1, colors: [null, null, null] });
      if (l > A(b) * 0.5) { card(ctx, 1380, 250, 340, 400, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 });
        text(ctx, "data × 2", 1550, 320, 36, { align: "center", weight: 900, color: C.ink });
        text(ctx, "↓", 1550, 380, 44, { align: "center", weight: 900, color: C.good });
        text(ctx, "biner + 1", 1550, 450, 36, { align: "center", weight: 900, color: C.good });
        ["250 → 8", "500 → 9", "1.000 → 10"].forEach((s, i) => text(ctx, s, 1550, 525 + i * 40, 26, { align: "center", weight: 800, color: C.ink2 })); }
      if (l > A(b) * 0.7) banner(ctx, "biner membuang separuh data di setiap langkah", 690, 1100);
    },
    k19_v3_jalan(ctx, b, l) {
      panel(ctx); heading(ctx, "VARIASI 3 · 1.000.000 DATA");
      const pl = prog(l, b, 0.03, 0.3);
      text(ctx, "cari linear", 220, 260, 28, { weight: 900, color: C.bad });
      counter(ctx, 220, 280, Math.round(1000000 * Math.pow(pl, 2.2)), "perbandingan", { w: 460, size: 56, fill: C.badBg, stroke: C.bad, color: C.bad });
      const seq = []; let lo = 0, hi = 999999; while (lo <= hi) { seq.push(hi - lo + 1); const m = Math.floor((lo + hi) / 2); lo = m + 1; }
      const on = l > A(b) * 0.33, pb = prog(l, b, 0.36, 0.88), kb = on ? clamp(Math.floor(pb * seq.length), 0, seq.length - 1) : -1;
      dim(ctx, on, () => {
        text(ctx, "cari biner: sisa data tiap langkah", 760, 260, 28, { weight: 900, color: C.good });
        counter(ctx, 1500, 150 + 130, kb + 1, "perbandingan", { w: 220, size: 50, fill: C.goodBg, stroke: C.good, color: C.good });
        seq.forEach((s, i) => { if (i > kb) return; const c = i % 4, r = Math.floor(i / 4); const x = 220 + c * 330, y = 420 + r * 76;
          chip(ctx, x, y, 270, fmt(s), { fill: i === kb ? "#FFF3D6" : i === seq.length - 1 ? C.goodBg : C.bg2, stroke: i === kb ? C.accent : undefined, size: 28, h: 60 });
          text(ctx, String(i + 1), x - 14, y + 40, 18, { align: "right", weight: 900, color: C.ink2 }); });
      });
      if (kb === seq.length - 1 && pb >= 1) { card(ctx, 1560, 430, 160, 360, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "20", 1640, 600, 64, { align: "center", weight: 900, color: C.good }); text(ctx, "kali belah", 1640, 640, 20, { align: "center", weight: 800, color: C.ink2 }); }
    },
    k19_v3_hasil(ctx, b, l) {
      panel(ctx); heading(ctx, "SEJUTA LAWAN DUA PULUH");
      const n = l > A(b) * 0.05 ? 2 : 1;
      Qk.bars(ctx, 240, 300, 1440, [["cari linear (n)", 1000000, C.bad, "1.000.000 perbandingan"], ["cari biner (log n)", 20, C.good, "20 perbandingan"]], { n, bh: 70 });
      if (l > A(b) * 0.3) { card(ctx, 240, 540, 680, 120, { fill: C.bg2, r: 16 }); text(ctx, "1.000.000 ÷ 20 = 50.000", 580, 594, 34, { align: "center", weight: 900 }); text(ctx, "kali lebih sedikit", 580, 636, 24, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > A(b) * 0.6) { card(ctx, 1000, 540, 680, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "n  lawan  log n", 1340, 610, 44, { align: "center", weight: 900, color: C.accentDark }); }
    },
    k19_urut_intro(ctx, b, l) {
      panel(ctx); heading(ctx, "DUA CARA MENGURUTKAN");
      card(ctx, 180, 240, 760, 540, { fill: C.badBg, stroke: C.bad, lw: 4, r: 20 });
      text(ctx, "bubble sort", 220, 300, 34, { weight: 900, color: C.bad });
      const st = U.trace("bubble", [48, 37, 25, 12, 56]); const s = st[Math.floor(l * 1.6) % st.length];
      U.cards(ctx, 230, 400, s, { w: 120, h: 110, gap: 18, index: false });
      para(ctx, "bandingkan dua tetangga, tukar bila terbalik, ulangi", 560, 600, 28, 660, { align: "center", weight: 800, lh: 1.3 });
      dim(ctx, l > A(b) * 0.35, () => {
        card(ctx, 980, 240, 760, 540, { fill: C.goodBg, stroke: C.good, lw: 4, r: 20 });
        text(ctx, "sorted() bawaan Python", 1020, 300, 34, { weight: 900, color: C.good });
        const box = (cx, y, vals, ok) => { const w = vals.length * 52 + 16; card(ctx, cx - w / 2, y, w, 56, { fill: ok ? "#fff" : "#F4F8FB", stroke: ok ? C.good : "#B7C4CC", lw: 3, r: 10 }); vals.forEach((v, i) => text(ctx, String(v), cx - w / 2 + 34 + i * 52, y + 38, 26, { align: "center", weight: 900 })); };
        const ln = (x1, y1, x2, y2) => { ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
        box(1400, 340, [48, 37, 25, 12, 56, 9], false);
        ln(1340, 396, 1270, 450); ln(1460, 396, 1530, 450);
        box(1270, 450, [25, 37, 48], true); box(1530, 450, [9, 12, 56], true);
        ln(1270, 506, 1360, 566); ln(1530, 506, 1440, 566); box(1400, 566, [9, 12, 25, 37, 48, 56], true);
        [["1. pecah", 425], ["2. urutkan", 485], ["3. gabungkan", 602]].forEach(([s, y]) => text(ctx, s, 1010, y, 22, { weight: 900, color: C.ink2 }));
        Py.code(ctx, 1080, 680, 560, [{ t: "hasil = sorted(data)" }], { rh: 40, size: 20, title: "" });
      });
    },
    k19_v4_jalan(ctx, b, l) {
      panel(ctx); heading(ctx, "VARIASI 4 · BUBBLE SORT PADA 10 DATA");
      const st = U.trace("bubble", BUB10); const p = prog(l, b, 0.04, 0.85); const s = st[clamp(Math.floor(p * (st.length - 1)), 0, st.length - 1)];
      U.cards(ctx, 340, 300, s, { w: 110, h: 100, gap: 14, index: false });
      counter(ctx, 1500, 160 + 0, s.cmp, "perbandingan", p >= 1 ? { w: 230, fill: C.badBg, stroke: C.bad, color: C.bad } : { w: 230 });
      const pass = Math.min(9, s.done.length - (p >= 1 ? 1 : 0));
      text(ctx, "perbandingan tiap putaran:", 220, 520, 26, { weight: 900, color: C.ink2 });
      [9, 8, 7, 6, 5, 4, 3, 2, 1].forEach((v, i) => { const x = 220 + i * 140; const on = i < pass || p >= 1, now = i === pass && p < 1;
        chip(ctx, x, 550, 90, String(v), { fill: now ? "#FFF3D6" : on ? C.badBg : "#F4F6F5", stroke: now ? C.accent : undefined, color: on || now ? C.ink : C.muted, size: 34, h: 70 });
        if (i < 8) text(ctx, "+", x + 115, 597, 32, { align: "center", weight: 900, color: C.ink2 }); });
      if (p >= 1) { text(ctx, "= 45", 1500, 600, 48, { weight: 900, color: C.bad }); banner(ctx, "bubble sort: 10 data → 45 perbandingan", 680, 1000, { fill: C.badBg, stroke: C.bad, color: C.bad }); }
    },
    k19_v4_hasil(ctx, b, l) {
      panel(ctx); heading(ctx, "10 DATA: HAMPIR SAMA");
      Qk.bars(ctx, 240, 300, 1440, [["bubble sort (n²)", 45, C.bad, "n(n − 1) ÷ 2 = 45"], ["sorted() (n log n)", 33, C.good, "perkiraan: n × log₂ n ≈ 33"]], { n: l > A(b) * 0.05 ? 2 : 1, bh: 70, fmt: v => v === 33 ? "≈ 33" : String(v) });
      if (l > A(b) * 0.4) banner(ctx, "bedanya kecil: keduanya selesai dalam sekejap", 560, 1100, { fill: C.goodBg, stroke: C.good, color: C.good });
      if (l > A(b) * 0.6) kiko(ctx, 1640, 740, 80, 0, { mood: "happy" });
    },
    k19_v5_jalan(ctx, b, l) {
      panel(ctx); heading(ctx, "VARIASI 5 · BUBBLE SORT PADA 1.000 DATA");
      // segitiga: tiap baris = satu putaran (contoh 20 data: 19 + 18 + … + 1)
      const N = 20, S = 22, X = 220, Y = 250; const rowsOn = Math.floor(prog(l, b, 0.02, 0.3) * (N - 1));
      for (let r = 0; r < N - 1; r++) for (let c = 0; c < N - 1 - r; c++) { ctx.fillStyle = r < rowsOn ? C.bad : "#E6EDF2"; ctx.globalAlpha = r < rowsOn ? 0.75 : 1; ctx.fillRect(X + c * S, Y + r * S, S - 3, S - 3); ctx.globalAlpha = 1; }
      ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; ctx.strokeRect(X - 4, Y - 4, N * S + 4, N * S + 4);
      text(ctx, "contoh 20 data:", X, Y + N * S + 40, 24, { weight: 900, color: C.ink2 });
      text(ctx, "19 + 18 + … + 1 = 190", X, Y + N * S + 76, 26, { weight: 900 });
      text(ctx, "setengah persegi 20 × 19", X, Y + N * S + 110, 22, { weight: 800, color: C.ink2 });
      const lines = [["rumus:", "n × (n − 1) ÷ 2", 0.05], ["n = 1.000:", "1.000 × 999 ÷ 2", 0.35], ["", "= 999.000 ÷ 2", 0.55], ["", "= 499.500", 0.72]];
      lines.forEach(([k, s, t], i) => { if (l < A(b) * t) return; const last = i === 3; if (k) text(ctx, k, 800, 300 + i * 110, 28, { weight: 900, color: C.ink2 });
        if (last) card(ctx, 990, 300 + i * 110 - 66, 640, 96, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 });
        text(ctx, s, 1020, 300 + i * 110, last ? 54 : 44, { weight: 900, color: last ? C.bad : C.ink }); });
      if (l > A(b) * 0.85) text(ctx, "perbandingan", 1520, 665, 26, { align: "center", weight: 900, color: C.ink2 });
    },
    k19_v5_hasil(ctx, b, l) {
      panel(ctx); heading(ctx, "1.000 DATA: SELISIHNYA MENGANGA");
      Qk.bars(ctx, 240, 300, 1440, [["bubble sort (n²)", 499500, C.bad, "n(n − 1) ÷ 2"], ["sorted() (n log n)", 9966, C.good, "perkiraan: n × log₂ n"]], { n: l > A(b) * 0.05 ? 2 : 1, bh: 70, fmt: v => v === 9966 ? "≈ 10.000" : fmt(v) });
      if (l > A(b) * 0.45) { card(ctx, 240, 540, 1440, 110, { fill: C.bg2, r: 16 }); text(ctx, "499.500 ÷ 10.000 ≈ 50 kali lebih banyak", 960, 610, 38, { align: "center", weight: 900 }); }
    },
    k19_v5_juta(ctx, b, l) {
      panel(ctx); heading(ctx, "1.000.000 DATA");
      const u2 = l > A(b) * 0.4;
      card(ctx, 200, 230, 720, 470, { fill: C.badBg, stroke: C.bad, lw: 4, r: 20 });
      text(ctx, "bubble sort", 560, 290, 34, { align: "center", weight: 900, color: C.bad });
      text(ctx, "499.999.500.000", 560, 370, 50, { align: "center", weight: 900, fit: 660 });
      text(ctx, "perbandingan (hampir 500 miliar)", 560, 410, 24, { align: "center", weight: 800, color: C.ink2 });
      dim(ctx, u2, () => { stopwatch(ctx, 400, 560, 70, u2 ? (l * 0.8) % 1 : 0); text(ctx, "≈ 13,9 jam", 680, 580, 48, { align: "center", weight: 900, color: C.bad }); });
      card(ctx, 1000, 230, 720, 470, { fill: C.goodBg, stroke: C.good, lw: 4, r: 20 });
      text(ctx, "sorted()", 1360, 290, 34, { align: "center", weight: 900, color: C.good });
      text(ctx, "≈ 19.931.569", 1360, 370, 50, { align: "center", weight: 900 });
      text(ctx, "perbandingan (sekitar 20 juta)", 1360, 410, 24, { align: "center", weight: 800, color: C.ink2 });
      dim(ctx, u2, () => { text(ctx, "⚡", 1200, 590, 80, { align: "center" }); text(ctx, "≈ 2 detik", 1460, 580, 48, { align: "center", weight: 900, color: C.good }); });
      if (l > A(b) * 0.25) text(ctx, "andaikan komputer membandingkan 10 juta pasang angka setiap detik", 960, 760, 26, { align: "center", weight: 800, color: C.ink2 });
    },
    k19_grafik(ctx, b, l) {
      panel(ctx); heading(ctx, "GRAFIK PERTUMBUHAN: SAMPAI 1.000 DATA", 182);
      const a = A(b); let show;
      if (b.part === 1) show = [prog(l, b, 0.3, 0.55), prog(l, b, 0.6, 0.9), 0, 0];
      else show = [1, 1, prog(l, b, 0.03, 0.4), prog(l, b, 0.5, 0.8)];
      chart(ctx, show);
      legend(ctx, 1400, 250, show.map(v => v > 0));
      if (b.part === 2 && show[3] > 0.15) { const X = G.x + 142 / G.nx * G.w; ctx.fillStyle = C.bad; text(ctx, "↑ keluar grafik di n ≈ 142", X + 20, G.y + 30, 24, { weight: 900, color: C.bad }); }
      if (b.part === 2 && show[2] >= 1) text(ctx, "≈ 10.000", G.x + G.w - 10, G.y + 130, 24, { align: "right", weight: 900, color: PURPLE });
      if (b.part === 1 && show[1] >= 1) text(ctx, "1.000", G.x + G.w - 10, G.y + G.h - 70, 24, { align: "right", weight: 900, color: C.kiko });
      if (b.part === 1 && show[0] >= 1) text(ctx, "hanya 10", G.x + G.w - 10, G.y + G.h - 16, 22, { align: "right", weight: 900, color: C.good });
    },
    k19_tabel(ctx, b, l) {
      panel(ctx); heading(ctx, "TABEL LENGKAP: PERBANDINGAN PADA KASUS TERBURUK", 182);
      const n = clamp(Math.floor((l - 0.3) / 0.8) + 1, 0, 4);
      const rows = [["10", "10", "4", "45", "≈ 33"], ["100", "100", "7", "4.950", "≈ 664"], ["1.000", "1.000", "10", "499.500", "≈ 9.966"], ["1.000.000", "1.000.000", "20", "499.999.500.000", "≈ 19.931.569"]];
      U.table(ctx, 190, 220, [260, 300, 240, 400, 340], ["banyak data", "cari linear", "cari biner", "bubble sort", "sorted()"], rows, { rh: 76, n, hlRow: n - 1 });
      const cols = [["", C.ink], ["n", C.kiko], ["log n", C.good], ["n²", C.bad], ["n log n", PURPLE]]; let x = 190;
      [260, 300, 240, 400, 340].forEach((w, i) => { if (i && n >= 4) chip(ctx, x + 20, 618, w - 40, cols[i][0], { fill: "#fff", stroke: cols[i][1], color: cols[i][1], size: 30, h: 62 }); x += w; });
      if (n >= 4) text(ctx, "pola pertumbuhan:", 210, 658, 24, { weight: 900, color: C.ink2 });
      if (n >= 4) text(ctx, "sorted(): perkiraan n × log₂ n; jumlah sebenarnya bisa sedikit lebih kecil.", 960, 735, 22, { align: "center", weight: 700, color: C.ink2 });
    },
    k19_latihan(ctx, b, l) {
      panel(ctx);
      const a = A(b), t = [a * 0.12, a * 0.32, a * 0.45, a * 0.62];
      K.halaman(ctx, 240, 196, 1.25, { url: "belajar-informatika.vercel.app/f113", judul: "Balapan algoritma, pemburu bug batas, perapi kode",
        rows: [{ tabs: ["1 Balapan algoritma", "2 Pemburu bug batas", "3 Perapi kode"], on: -1 }, { task: "Pilih pencarian atau pengurutan dan ukuran data, lihat jumlah perbandingannya." }, { label: "Langkah 1: pilih jenis dan ukuran data" },
          { buttons: ["pencarian", "pengurutan"], cols: 2, on: -1 }, { buttons: ["8", "100", "1.000", "10.000"], cols: 4, on: -1 },
          { bars: [["bubble (n²): " + (l >= t[3] ? "49.995.000" : "499.500"), 1, C.bad], ["selection (n²)", 1, C.bad], ["sorted() (n log n)", 0.03, C.good]], after: t[2] }],
        taps: [[0, 0, t[0]], [3, 1, t[1]], [4, 2, t[2]], [4, 3, t[3]]] }, l, { h: 478 });
      const n = l < t[0] ? 0 : l < t[1] ? 1 : l < t[2] ? 2 : l < t[3] ? 3 : 4;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN F11.3", ["Klik Balapan algoritma.", "Pilih pengurutan.", "Ketuk 1.000, lalu 10.000.", "Tebak dulu, baru lihat batangnya."], n);
      card(ctx, 840, 560, 880, 200, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 605, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Di Colab, ukur waktu bubble_sort dan sorted() untuk 1.000 dan 10.000 data dengan modul time.", 870, 650, 28, 820, { weight: 700, lh: 1.3 });
    }
  });

  // ---------- adegan khusus Short (kanvas 1920×1080, area 40..1040 × 30..810; crop [40, 30, 1000, 780]) ----------
  function shortCards(ctx, st, opt = {}) {
    ARR10.forEach((v, i) => { const r = Math.floor(i / 5), c = i % 5; const x = 70 + c * 192, y = 200 + r * 210; const s = st(i);
      ctx.save(); if (s === "dim") ctx.globalAlpha = 0.18;
      const fill = s === "now" ? "#FFF3D6" : s === "found" ? C.goodBg : s === "seen" ? "#EEF1F3" : "#fff", stroke = s === "now" ? C.accent : s === "found" ? C.good : s === "seen" ? "#C9D4DB" : "#B7C4CC";
      ctx.fillStyle = fill; rr(ctx, x, y, 170, 150, 16); ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = s === "now" || s === "found" ? 8 : 4; rr(ctx, x, y, 170, 150, 16); ctx.stroke();
      text(ctx, String(v), x + 85, y + 95, 60, { align: "center", weight: 900, color: s === "seen" ? C.muted : C.ink }); ctx.restore(); });
  }
  Object.assign(K.SCENES, {
    k19s_cari(ctx, b, l) {
      const lin = b.mode === "linear";
      text(ctx, lin ? "cari linear · 10 data" : "cari biner · 10 data", 70, 90, 44, { weight: 900, color: lin ? C.bad : C.good });
      text(ctx, "target: 85", 70, 160, 40, { weight: 900, color: C.accentDark });
      let cmp, done;
      if (lin) { const p = prog(l, b, 0.08, 0.7), k = Math.min(9, Math.floor(p * 10)); done = p >= 1; cmp = Math.min(10, k + 1); shortCards(ctx, i => i < k ? "seen" : i === k ? (done ? "found" : "now") : ""); }
      else { const steps = Qk.binary(ARR10, 85); const p = prog(l, b, 0.08, 0.72); const k = clamp(Math.floor(p * steps.length), 0, steps.length - 1); const st = steps[k]; done = st.found && p >= 1; cmp = k + 1;
        shortCards(ctx, i => i < st.lo || i > st.hi ? "dim" : i === st.mid ? (st.found ? "found" : "now") : "");
        text(ctx, "sisa data:", 70, 690, 36, { weight: 900, color: C.ink2 }); [10, 5, 2, 1].forEach((v, i) => { if (i > k) return; const x = 270 + i * 180; card(ctx, x, 640, 130, 76, { fill: i === k ? "#FFF3D6" : C.bg2, stroke: i === k ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, String(v), x + 65, 693, 44, { align: "center", weight: 900 }); if (i < k) text(ctx, "→", x + 155, 692, 34, { align: "center", weight: 900, color: C.ink2 }); }); }
      counter(ctx, 700, 40, cmp, "perbandingan", { w: 320, size: 64, ...(done ? { fill: C.goodBg, stroke: C.good, color: C.good } : {}) });
      if (lin) text(ctx, done ? "85 = 85: ketemu" : "satu per satu →", 70, 700, 44, { weight: 900, color: done ? C.good : C.ink2 });
    },
    k19s_juta(ctx, b, l) {
      const fin = b.fin; const pl = fin ? 1 : prog(l, b, 0.03, 0.3);
      counter(ctx, 60, 40, Math.round(1000000 * Math.pow(pl, 2.2)), "cari linear", { w: 560, size: 70, fill: C.badBg, stroke: C.bad, color: C.bad });
      const seq = []; let lo = 0, hi = 999999; while (lo <= hi) { seq.push(hi - lo + 1); const m = Math.floor((lo + hi) / 2); lo = m + 1; }
      const pb = fin ? 1 : prog(l, b, 0.36, 0.88), kb = fin ? 19 : (l > A(b) * 0.33 ? clamp(Math.floor(pb * 20), 0, 19) : -1);
      counter(ctx, 660, 40, kb + 1, "cari biner", { w: 360, size: 70, fill: C.goodBg, stroke: C.good, color: C.good });
      seq.forEach((s, i) => { if (i > kb) return; const c = i % 4, r = Math.floor(i / 4); const x = 60 + c * 245, y = 200 + r * 92;
        card(ctx, x, y, 230, 76, { fill: i === kb ? "#FFF3D6" : i === 19 ? C.goodBg : C.bg2, stroke: i === kb ? C.accent : undefined, lw: 4, r: 12 }); text(ctx, fmt(s), x + 115, y + 52, 36, { align: "center", weight: 900, fit: 210 }); });
      if (fin) { card(ctx, 60, 680, 960, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 5, r: 18 }); text(ctx, "1.000.000 lawan 20", 540, 755, 60, { align: "center", weight: 900, color: C.accentDark }); }
    },
    k19s_urut(ctx, b, l) {
      const u2 = l > A(b) * 0.4;
      card(ctx, 60, 40, 960, 330, { fill: C.badBg, stroke: C.bad, lw: 5, r: 22 }); text(ctx, "bubble sort · sejuta data", 100, 110, 42, { weight: 900, color: C.bad });
      text(ctx, "499.999.500.000", 100, 200, 66, { weight: 900 }); text(ctx, "perbandingan", 100, 245, 32, { weight: 800, color: C.ink2 });
      dim(ctx, u2, () => { stopwatch(ctx, 860, 200, 70, (l * 0.8) % 1); text(ctx, "≈ 13,9 jam", 100, 335, 60, { weight: 900, color: C.bad }); });
      card(ctx, 60, 400, 960, 330, { fill: C.goodBg, stroke: C.good, lw: 5, r: 22 }); text(ctx, "sorted() · sejuta data", 100, 470, 42, { weight: 900, color: C.good });
      text(ctx, "≈ 19.931.569", 100, 560, 66, { weight: 900 }); text(ctx, "perbandingan", 100, 605, 32, { weight: 800, color: C.ink2 });
      dim(ctx, u2, () => { text(ctx, "⚡", 860, 590, 110, { align: "center" }); text(ctx, "≈ 2 detik", 100, 695, 60, { weight: 900, color: C.good }); });
      text(ctx, "andaikan 10 juta perbandingan per detik", 540, 785, 32, { align: "center", weight: 800, color: C.ink2 });
    },
    k19s_grafik(ctx, b, l) {
      const show = [1, 1, prog(l, b, 0.03, 0.4), prog(l, b, 0.5, 0.8)];
      chart(ctx, show, { x: 180, y: 80, w: 800, h: 480, nx: 1000, ny: 10000 });
      CURVES.forEach(([name, big, f, col], k) => { const x = 60 + (k % 2) * 490, y = 640 + Math.floor(k / 2) * 80; ctx.save(); if (!show[k]) ctx.globalAlpha = 0.2; ctx.fillStyle = col; rr(ctx, x, y + 18, 50, 14, 7); ctx.fill(); text(ctx, name + " (" + big + ")", x + 66, y + 38, 36, { weight: 900, color: col, fit: 400 }); ctx.restore(); });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
