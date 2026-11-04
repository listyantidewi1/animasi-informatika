/* S22 Simulasi praktik: cari linear, cari biner, bubble sort, lalu mengukur waktunya dengan modul time di notebook generik ("Colab" di narasi).
   Jendela notebook di kiri (x 110–1410, y 122–822), panel langkah/label di kanan (x 1450–1820).
   Semua kode sudah diuji dengan python3; output fungsi persis sama. Angka waktu diambil dari pengukuran sungguhan (CPython 3.13,
   satu komputer) dan dibulatkan seperti perintah print di kode; di komputer lain angkanya berbeda, polanya sama.
   Muat setelah kiko-core.js, layar.js, layar_kode.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, LK = K.layarKode;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const BLUE = "#1A73C8", GREEN = C.good, RED = LK.T.errInk;
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const ph = LK.phase;
  const blinkAt = l => Math.floor(l * 2.2) % 2 === 0;
  const stepAt = (f, marks) => { let n = 0; marks.forEach((m, i) => { if (f >= m) n = i + 1; }); return n; };

  // ---------- kode (diuji dengan python3) ----------
  const LIN = ["def cari_linear(daftar, target):", "    for i in range(len(daftar)):", "        if daftar[i] == target:", "            return i", "    return -1"];
  const NILAI = [12, 25, 31, 47, 58, 63, 79, 88];
  const T1 = ["nilai = [12, 25, 31, 47, 58, 63, 79, 88]", "print(cari_linear(nilai, 58))", "print(cari_linear(nilai, 50))"];
  const BIN = ["def cari_biner(daftar, target):", "    # syarat: daftar sudah urut", "    kiri, kanan = 0, len(daftar) - 1", "    while kiri <= kanan:",
    "        tengah = (kiri + kanan) // 2", "        if daftar[tengah] == target:", "            return tengah", "        elif daftar[tengah] < target:",
    "            kiri = tengah + 1", "        else:", "            kanan = tengah - 1", "    return -1"];
  const T2 = ["print(cari_biner(nilai, 58))", "print(cari_biner(nilai, 50))"];
  const BUB = ["def bubble_sort(a):", "    n = len(a)", "    for i in range(n - 1):", "        for j in range(n - 1 - i):", "            if a[j] > a[j + 1]:",
    "                a[j], a[j + 1] = a[j + 1], a[j]", "    return a"];
  const T3 = ["print(bubble_sort([31, 12, 88, 47, 25]))"];
  const UK = ["import time", "for n in [1000, 10000, 100000, 1000000]:", "    data = list(range(n))", "    mulai = time.perf_counter()", "    cari_linear(data, n - 1)",
    "    t_linear = (time.perf_counter() - mulai) * 1000", "    mulai = time.perf_counter()", "    cari_biner(data, n - 1)",
    "    t_biner = (time.perf_counter() - mulai) * 1000", '    print(n, "data | linear:", round(t_linear, 3), "ms",', '          "| biner:", round(t_biner, 3), "ms")'];
  const UK_OUT = ["1000 data | linear: 0.036 ms | biner: 0.003 ms", "10000 data | linear: 0.351 ms | biner: 0.005 ms",
    "100000 data | linear: 3.796 ms | biner: 0.009 ms", "1000000 data | linear: 38.273 ms | biner: 0.013 ms"];
  const UB = ["import random", "for n in [1000, 2000, 4000]:", "    data = list(range(n))", "    random.shuffle(data)", "    salinan = data.copy()",
    "    mulai = time.perf_counter()", "    bubble_sort(data)", "    t_bubble = (time.perf_counter() - mulai) * 1000", "    mulai = time.perf_counter()",
    "    sorted(salinan)", "    t_sorted = (time.perf_counter() - mulai) * 1000", '    print(n, "data | bubble:", round(t_bubble, 1), "ms",', '          "| sorted:", round(t_sorted, 3), "ms")'];
  const UB_OUT = ["1000 data | bubble: 41.2 ms | sorted: 0.131 ms", "2000 data | bubble: 178.9 ms | sorted: 0.283 ms", "4000 data | bubble: 759.4 ms | sorted: 0.625 ms"];

  // ---------- bingkai dan pembantu ----------
  const nb = (ctx, opt = {}) => LK.notebook(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { name: "Cari_Urut.ipynb", status: "tersambung", compact: true, ...opt });
  const cx0 = a => a.x + 20, cw0 = a => a.w - 40;
  function keys(ctx, k, u, x = 1635, y = 720) { if (u > 0 && u < 1) L.keys(ctx, x, y, k, { press: u, align: "center", size: 30 }); }
  function call(ctx, y, s, tx, ty, opt = {}) { return L.callout(ctx, opt.x || 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt }); }
  // sel yang digulir supaya bagian bawahnya (output) tetap terlihat
  function cellFit(ctx, a, y0, opt) {
    const h = LK.cellHeight(ctx, cw0(a), opt), off = Math.max(0, y0 + h - (a.y + a.h - 14));
    let g; LK.clip(ctx, { x: a.x, y: a.y, w: a.w, h: a.h - 6 }, () => { g = LK.cell(ctx, cx0(a), y0 - off, cw0(a), opt); }); return g;
  }
  // sel yang dijalankan: run "ready" -> "running" (t0..t1) -> "done" dengan output
  function runOpt(f, t0, t1, out, count, n) {
    if (f < t0) return { run: "ready" };
    if (f < t1) return { run: "running", spin: f * 8, out: n ? out.slice(0, Math.floor((f - t0) / (t1 - t0) * out.length)) : null };
    return { run: "done", count, out };
  }
  // ketik sel (kode bertahap) dengan kursor
  function typedCell(lines, u) { const T = LK.typed(lines, u); return { lines: T.lines, caret: T.caret }; }
  // kotak di sekitar potongan teks pada baris kode
  function codeBox(g, line, s, lines) { const t = lines[line], c = t.indexOf(s); const p = g.at(line, c); return { x: p.x - 4, y: g.top(line) + 2, w: s.length * g.cw + 8, h: g.lh - 4 }; }
  // kotak di sekitar potongan teks pada baris output sel
  function outRect(ctx, cell, i, str, part, size) { const out = cell.out; if (!out || out.lines[i] == null) return null; const cw = LK.mono(ctx, size); const c = str.indexOf(part);
    const lh = Math.round(size * 1.5); return { x: cell.x + 72 + 16 + c * cw - 4, y: out.lines[i] - lh * 0.72 + 2, w: part.length * cw + 8, h: lh - 2 }; }
  // deretan kotak daftar dengan indeks (di kanvas, bukan di notebook)
  function strip(ctx, x, y, vals, opt = {}) {
    const w = opt.w || 100, h = opt.h || 70;
    vals.forEach((v, i) => { const st = (opt.state || [])[i] || ""; const xx = x + i * (w + 8);
      ctx.fillStyle = st === "hit" ? C.goodBg : st === "now" ? "#FFF3D6" : st === "off" ? "#EEF2F5" : "#FFFFFF"; rr(ctx, xx, y, w, h, 10); ctx.fill();
      ctx.strokeStyle = st === "hit" ? GREEN : st === "now" ? C.accent : "#C9D4DB"; ctx.lineWidth = st ? 4 : 2; rr(ctx, xx, y, w, h, 10); ctx.stroke();
      ctx.globalAlpha = st === "off" ? 0.35 : 1; text(ctx, String(v), xx + w / 2, y + h / 2 + 12, opt.size || 32, { align: "center", weight: 800 }); ctx.globalAlpha = 1;
      if (opt.idx !== false) { LK.mono(ctx, 18, 600); ctx.fillStyle = "#7F8C95"; ctx.textAlign = "center"; ctx.fillText(String(i), xx + w / 2, y + h + 24); } });
  }
  const OUT_SZ = 21;

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menulis cari linear dan cari biner", "menulis bubble sort", "mengukur waktu dengan modul time", "membandingkan saat data membesar"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 760, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      card(ctx, 1080, 280, 600, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "Waktu mencari (ms)", 1380, 330, 26, { align: "center", weight: 900 });
      [["1.000", 0.036, 0.003], ["1.000.000", 38.273, 0.013]].forEach(([n, a, bb], i) => { const y = 400 + i * 150; text(ctx, n + " data", 1110, y, 24, { weight: 800 });
        const u = ease((l - 1) / 1.5), wl = Math.max(4, 420 * a / 38.273) * u; ctx.fillStyle = C.accent; rr(ctx, 1110, y + 16, wl, 30, 6); ctx.fill(); text(ctx, "linear " + String(a), 1120 + wl, y + 40, 20, { weight: 800 });
        ctx.fillStyle = BLUE; rr(ctx, 1110, y + 56, 4, 30, 2); ctx.fill(); text(ctx, "biner " + String(bb), 1124, y + 80, 20, { weight: 800, color: BLUE }); });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      [["F11.3", "Algoritma Standar dalam Kode", "cari linear, cari biner, bubble sort"], ["S20", "Program Python Pertama di Colab", "simulasi: menjalankan sel"]].forEach(([c, t, s], i) => {
        const x = 300 + i * 680; card(ctx, x, 300, 620, 320, { fill: i ? "#F4F6F5" : C.bg2, r: 22 });
        text(ctx, c, x + 310, 385, 58, { align: "center", weight: 900, color: i ? C.ink2 : C.kiko }); para(ctx, t, x + 310, 455, 32, 560, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 310, 585, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      kiko(ctx, 1660, 735, 90, 0, { wave: l });
    },

    ketik_linear(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = typedCell(LIN, ph(l, sp, 0.2, 0.7));
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { ...(f < 0.2 ? { lines: [""], caret: { line: 0, col: 0 } } : T), size: 26, active: true, run: "ready", blink: f < 0.7 || blinkAt(l), minLines: 5 });
      if (f < 0.2) call(ctx, 420, "Notebook baru: Cari_Urut.ipynb", 360, a.y - 30);
      if (f > 0.72) { LK.focus(ctx, codeBox(c.code, 1, "for i in range(len(daftar)):", LIN), { t: l, pad: 2 }); call(ctx, 430, "Periksa satu per satu: indeks 0, 1, 2, …", c.code.at(1, 33).x, c.code.top(1) + 20); }
      if (f > 0.85) { LK.focus(ctx, codeBox(c.code, 4, "return -1", LIN), { t: l + 1, pad: 2, color: BLUE }); call(ctx, 600, "-1 = tidak ketemu", c.code.at(4, 14).x, c.code.top(4) + 20, { fill: "#E7F1FB", color: BLUE }); }
      LK.steps(ctx, "LANGKAH", ["Notebook baru: Cari_Urut", "Sel 1: def cari_linear", "Jalankan sel ▶"], stepAt(f, [0.18, 0.72]));
    },
    uji_linear(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c1 = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { lines: LIN, size: 22, run: "done", count: 1 });
      const T = typedCell(T1, ph(l, sp, 0.05, 0.3));
      const r = runOpt(f, 0.34, 0.4, ["4", "-1"], 2);
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 18, cw0(a), { ...(f < 0.34 ? T : { lines: T1 }), size: 22, active: true, blink: blinkAt(l), outSize: 24, ...r });
      keys(ctx, ["Shift", "Enter"], clamp((f - 0.31) / 0.06, 0, 1));
      // deretan nilai
      const sy = 650, hit = f > 0.45 && f < 0.72, n = hit ? 5 : f > 0.72 ? 8 : 0, st = NILAI.map((v, i) => i < n - 1 ? "off" : i === n - 1 ? (hit ? "hit" : "now") : "");
      if (f > 0.4) { text(ctx, hit ? "cari 58: periksa satu per satu → indeks 4" : "cari 50: semua diperiksa, tidak ada → -1", 180, sy - 22, 24, { weight: 800, color: hit ? GREEN : BLUE });
        strip(ctx, 180, sy, NILAI, { w: 130, h: 64, state: f > 0.72 ? NILAI.map(() => "off") : st }); }
      if (f > 0.42 && c2.out) { const y0 = c2.out.lines[0]; call(ctx, 300, "4 = indeks tempat 58 berada", c2.x + 110, y0 - 8, { fill: C.goodBg, color: GREEN }); }
      if (f > 0.72 && c2.out) { const y1 = c2.out.lines[1]; call(ctx, 450, "-1 = 50 tidak ada di daftar", c2.x + 130, y1 - 8, { fill: "#E7F1FB", color: BLUE }); }
    },
    ketik_biner(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = typedCell(BIN, ph(l, sp, 0.05, 0.6));
      const c = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { ...T, size: 22, active: true, run: "ready", blink: f < 0.6 || blinkAt(l), minLines: 12 });
      if (f > 0.3) { LK.focus(ctx, codeBox(c.code, 2, "kiri, kanan", BIN), { t: l, pad: 2 }); call(ctx, 300, "Dua penanda: kiri dan kanan", c.code.at(2, 15).x + 10, c.code.top(2) + 18); }
      if (f > 0.55) { LK.focus(ctx, codeBox(c.code, 4, "tengah = (kiri + kanan) // 2", BIN), { t: l + 1, pad: 2, color: BLUE }); call(ctx, 430, "Periksa nilai tengah", c.code.at(4, 36).x + 10, c.code.top(4) + 18, { fill: "#E7F1FB", color: BLUE }); }
      if (f > 0.72) { [8, 10].forEach(k => LK.focus(ctx, codeBox(c.code, k, BIN[k].trim(), BIN), { t: l + k, pad: 2, color: GREEN }));
        call(ctx, 560, "Geser kiri atau kanan: separuh daftar dibuang", c.code.at(8, 29).x + 10, c.code.top(8) + 18, { fill: C.goodBg, color: GREEN }); }
    },
    uji_biner(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c1 = LK.cell(ctx, cx0(a), a.y + 16, cw0(a), { lines: BIN, size: 20, run: "done", count: 3 });
      const T = typedCell(T2, ph(l, sp, 0.03, 0.18));
      const r = runOpt(f, 0.22, 0.28, ["4", "-1"], 4);
      LK.cell(ctx, cx0(a), c1.bottom + 14, cw0(a), { ...(f < 0.22 ? T : { lines: T2 }), size: 20, active: true, blink: blinkAt(l), outSize: 22, ...r });
      // langkah cari 58 di kanan
      const steps = [[0, 7, 3, "47 < 58 → buang kiri"], [4, 7, 5, "63 > 58 → buang kanan"], [4, 4, 4, "58 = 58 → ketemu, indeks 4"]];
      const k = clamp(Math.floor(ph(l, sp, 0.3, 0.62) * 3), 0, 2);
      if (f > 0.3 && f < 0.66) { card(ctx, 1440, 130, 390, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "cari 58", 1460, 170, 24, { weight: 900, color: C.accentDark });
        steps.slice(0, k + 1).forEach(([lo, hi, mid, s], j) => { const y = 200 + j * 115;
          strip(ctx, 1458, y, NILAI, { w: 39, h: 40, size: 17, idx: false, state: NILAI.map((v, i) => i === mid ? (j === 2 ? "hit" : "now") : (i < lo || i > hi) ? "off" : "") });
          text(ctx, s, 1460, y + 76, 21, { weight: 800, color: j === 2 ? GREEN : C.ink }); }); }
      if (f > 0.66) { LK.focus(ctx, codeBox(c1.code, 1, "# syarat: daftar sudah urut", BIN), { t: l, pad: 2, color: RED });
        call(ctx, 200, "Syarat: daftar harus sudah urut!", c1.code.at(1, 31).x + 10, c1.code.top(1) + 16, { fill: "#FDECEA", color: RED }); }
    },
    ketik_bubble(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = typedCell(BUB, ph(l, sp, 0.04, 0.45));
      const c = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { ...T, size: 24, active: true, run: "ready", blink: f < 0.45 || blinkAt(l), minLines: 7 });
      if (f > 0.4) { LK.focus(ctx, codeBox(c.code, 2, "for i in range(n - 1):", BUB), { t: l, pad: 2 }); call(ctx, 200, "Perulangan luar: putaran", c.code.at(2, 27).x + 10, c.code.top(2) + 18); }
      if (f > 0.55) { LK.focus(ctx, codeBox(c.code, 3, "for j in range(n - 1 - i):", BUB), { t: l + 1, pad: 2, color: BLUE }); call(ctx, 330, "Perulangan dalam: dua tetangga, j dan j + 1", c.code.at(3, 34).x + 10, c.code.top(3) + 18, { fill: "#E7F1FB", color: BLUE }); }
      if (f > 0.72) { LK.focus(ctx, codeBox(c.code, 5, "a[j], a[j + 1] = a[j + 1], a[j]", BUB), { t: l + 2, pad: 2, color: GREEN }); call(ctx, 500, "Terbalik? Tukar!", c.code.at(5, 47).x + 10, c.code.top(5) + 18, { fill: C.goodBg, color: GREEN }); }
    },
    uji_bubble(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c1 = LK.cell(ctx, cx0(a), a.y + 16, cw0(a), { lines: BUB, size: 22, run: "done", count: 5 });
      const T = typedCell(T3, ph(l, sp, 0.04, 0.3));
      const r = runOpt(f, 0.36, 0.42, ["[12, 25, 31, 47, 88]"], 6);
      LK.cell(ctx, cx0(a), c1.bottom + 14, cw0(a), { ...(f < 0.36 ? T : { lines: T3 }), size: 22, active: true, blink: blinkAt(l), outSize: 24, ...r });
      keys(ctx, ["Shift", "Enter"], clamp((f - 0.33) / 0.06, 0, 1));
      const P = [[31, 12, 88, 47, 25], [12, 31, 47, 25, 88], [12, 31, 25, 47, 88], [12, 25, 31, 47, 88]];
      const k = clamp(Math.floor(ph(l, sp, 0.42, 0.9) * 4), 0, 3);
      if (f > 0.42) { const y = 620; text(ctx, k === 0 ? "awal" : `setelah putaran ${k}`, 180, y - 18, 26, { weight: 900, color: k === 3 ? GREEN : C.ink });
        strip(ctx, 180, y, P[k], { w: 150, h: 76, size: 36, idx: false, state: P[k].map((v, i) => i >= 5 - k ? "hit" : "") });
        if (k > 0) text(ctx, "angka terbesar \"menggelembung\" ke kanan", 1000, y + 50, 24, { weight: 800, color: C.ink2 }); }
    },
    ketik_ukur(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = typedCell(UK, ph(l, sp, 0.04, 0.4));
      const c = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { ...T, size: 22, active: true, run: "ready", blink: f < 0.4 || blinkAt(l), minLines: 11 });
      const n = stepAt(f, [0.42, 0.58, 0.72]);
      if (n >= 1) LK.focus(ctx, codeBox(c.code, 3, "mulai = time.perf_counter()", UK), { t: l, pad: 2 });
      if (n >= 2) LK.focus(ctx, codeBox(c.code, 4, "cari_linear(data, n - 1)", UK), { t: l, pad: 2, color: BLUE });
      if (n >= 3) LK.focus(ctx, codeBox(c.code, 5, "(time.perf_counter() - mulai) * 1000", UK), { t: l, pad: 2, color: GREEN });
      if (f < 0.42) call(ctx, 450, "import time: memakai modul time", c.code.at(0, 12).x + 10, c.code.top(0) + 18);
      LK.steps(ctx, "STOPWATCH", ["mulai = perf_counter()", "jalankan fungsinya", "selisih × 1000 = milidetik"], n, { y: 380 });
      if (n >= 1) { text(ctx, "⏱", 1635, 300, 90, { align: "center" }); }
    },
    arti_ukur(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { lines: UK, size: 22, active: true, run: "ready", minLines: 11 });
      if (f > 0.05) { LK.focus(ctx, codeBox(c.code, 1, "[1000, 10000, 100000, 1000000]", UK), { t: l, pad: 2 }); call(ctx, 160, "Empat ukuran: seribu sampai sejuta", c.code.at(1, 40).x + 10, c.code.top(1) + 18); }
      if (f > 0.5) { [4, 7].forEach(k => LK.focus(ctx, codeBox(c.code, k, "n - 1", UK), { t: l + k, pad: 2, color: BLUE }));
        call(ctx, 330, "n - 1 = angka paling belakang: linear harus memeriksa semuanya", c.code.at(4, 28).x + 10, c.code.top(4) + 18, { fill: "#E7F1FB", color: BLUE }); }
      if (f > 0.5) { const y = 690; strip(ctx, 180, y, ["0", "1", "2", "…", "n-1"], { w: 120, h: 60, size: 26, idx: false, state: ["", "", "", "", "hit"] }); text(ctx, "← target di ujung", 820, y + 40, 26, { weight: 800, color: GREEN }); }
    },
    hasil_ukur(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const r = runOpt(f, 0.05, 0.4, UK_OUT, 7, true);
      const c = cellFit(ctx, a, a.y + 20, { lines: UK, size: 20, active: true, outSize: OUT_SZ, ...r });
      if (f > 0.42 && c.out) { UK_OUT.forEach((s, i) => { const bx = outRect(ctx, c, i, s, s.slice(s.indexOf("linear:"), s.indexOf(" ms")), OUT_SZ); if (bx) LK.focus(ctx, bx, { t: l + i * 0.3, pad: 1 }); });
        const xs = ["", "×10", "×10", "×10"]; card(ctx, 1450, 300, 370, 330, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
        text(ctx, "cari linear", 1635, 345, 26, { align: "center", weight: 900, color: C.accentDark });
        [["1.000", "0,036"], ["10.000", "0,351"], ["100.000", "3,796"], ["1.000.000", "38,273"]].forEach(([n, t], i) => { const y = 400 + i * 60;
          text(ctx, n, 1470, y, 22, { weight: 800 }); text(ctx, t + " ms", 1720, y, 22, { align: "right", weight: 800 }); if (xs[i] && f > 0.5 + i * 0.08) text(ctx, xs[i], 1800, y - 28, 22, { align: "right", weight: 900, color: GREEN }); });
        text(ctx, "data ×10 → waktu ±×10", 1635, 680, 24, { align: "center", weight: 900, color: GREEN }); }
    },
    banding_cari(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "SEJUTA DATA: LINEAR LAWAN BINER", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      const u = ease(clamp(l / (A * 0.3), 0, 1));
      [["cari linear", 38.273, C.accent, "±1.000.000 pemeriksaan"], ["cari biner", 0.013, BLUE, "±20 pemeriksaan"]].forEach(([s, t, col, cek], i) => {
        const y = 300 + i * 190; text(ctx, s, 250, y, 32, { weight: 900, color: col });
        const w = Math.max(6, 1200 * t / 38.273) * u; ctx.fillStyle = col; rr(ctx, 250, y + 22, w, 54, 10); ctx.fill();
        text(ctx, String(t).replace(".", ",") + " ms", 270 + w, y + 62, 30, { weight: 900 });
        if (l > A * (0.4 + i * 0.15)) text(ctx, cek, 250, y + 120, 28, { weight: 800, color: C.ink2 }); });
      if (l > A * 0.7) { card(ctx, 250, 690, 1420, 90, { fill: C.goodBg, r: 16 }); text(ctx, "Sejuta dibelah dua terus-menerus: sekitar 20 kali sampai tersisa satu.", 960, 748, 30, { align: "center", weight: 900, color: GREEN }); }
    },
    ukur_bubble(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = typedCell(UB, ph(l, sp, 0.04, 0.5));
      const r = f < 0.55 ? { run: "ready" } : runOpt(f, 0.55, 0.95, UB_OUT, 8, true);
      const c = cellFit(ctx, a, a.y + 20, { ...(f < 0.52 ? T : { lines: UB }), size: 20, active: true, blink: f < 0.5 || blinkAt(l), outSize: OUT_SZ, minLines: 13, ...r });
      if (f > 0.2 && f < 0.55) { LK.focus(ctx, codeBox(c.code, 3, "random.shuffle(data)", UB), { t: l, pad: 2 }); call(ctx, 200, "Data diacak dulu", c.code.at(3, 24).x + 10, c.code.top(3) + 16); }
      if (f > 0.35 && f < 0.55) { LK.focus(ctx, codeBox(c.code, 9, "sorted(salinan)", UB), { t: l + 1, pad: 2, color: BLUE }); call(ctx, 340, "sorted: fungsi bawaan Python, untuk salinan yang sama", c.code.at(9, 19).x + 10, c.code.top(9) + 16, { fill: "#E7F1FB", color: BLUE }); }
      if (f > 0.55 && f < 0.95) call(ctx, 300, "Bubble sort butuh waktu… tunggu sampai selesai.", null, null);
      keys(ctx, ["Shift", "Enter"], clamp((f - 0.52) / 0.06, 0, 1));
    },
    banding_urut(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c = cellFit(ctx, a, a.y + 20, { lines: UB, size: 20, active: true, run: "done", count: 8, outSize: OUT_SZ, out: UB_OUT });
      const part = (s, k) => k ? s.slice(s.indexOf("sorted:"), s.lastIndexOf(" ms")) : s.slice(s.indexOf("bubble:"), s.indexOf(" ms"));
      const k = f < 0.5 ? 0 : 1;
      UB_OUT.forEach((s, i) => { const bx = outRect(ctx, c, i, s, part(s, k), OUT_SZ); if (bx) LK.focus(ctx, bx, { t: l + i * 0.3, pad: 1, color: k ? BLUE : C.accent }); });
      card(ctx, 1450, 150, 370, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, k ? "sorted bawaan" : "bubble sort", 1635, 195, 26, { align: "center", weight: 900, color: k ? BLUE : C.accentDark });
      const rows = k ? [["1.000", "0,131"], ["2.000", "0,283"], ["4.000", "0,625"]] : [["1.000", "41,2"], ["2.000", "178,9"], ["4.000", "759,4"]];
      rows.forEach(([n, t], i) => { const y = 260 + i * 70; text(ctx, n, 1470, y, 24, { weight: 800 }); text(ctx, t + " ms", 1730, y, 24, { align: "right", weight: 800 }); if (i && !k) text(ctx, "×4", 1805, y - 32, 22, { align: "right", weight: 900, color: GREEN }); });
      para(ctx, k ? "ribuan kali lebih cepat daripada bubble sort" : "data ×2 → waktu ±×4", 1635, 490, 24, 330, { align: "center", weight: 900, color: k ? BLUE : GREEN, lh: 1.25 });
    },
    beda_komputer(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "ANGKANYA BERBEDA, POLANYA SAMA", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      const M = [["💻", "laptop kami", [41, 179, 759]], ["☁️", "Colab saat ramai", [63, 262, 1040]], ["🖥️", "komputer lab lama", [118, 485, 1930]]];
      M.forEach(([ic, s, v], i) => { const x = 230 + i * 500; const on = l > A * (0.1 + i * 0.15); if (!on) return;
        card(ctx, x, 250, 460, 400, { fill: C.bg2, r: 20 }); text(ctx, ic, x + 230, 330, 60, { align: "center" }); text(ctx, s, x + 230, 385, 28, { align: "center", weight: 900 });
        ["1.000", "2.000", "4.000"].forEach((n, k) => { const y = 450 + k * 62; text(ctx, n + " data", x + 40, y, 24, { weight: 700 }); text(ctx, v[k] + " ms", x + 420, y, 24, { align: "right", weight: 900 }); }); });
      text(ctx, "contoh bubble sort; angka di komputermu pasti lain", 960, 700, 24, { align: "center", weight: 700, color: C.ink2 });
      if (l > A * 0.62) { card(ctx, 460, 720, 1000, 80, { fill: C.goodBg, r: 16 }); text(ctx, "di semua komputer: data ×2 → waktu ±×4", 960, 772, 32, { align: "center", weight: 900, color: GREEN }); }
    },

    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 290, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 252, 22, 76, 6); ctx.fill(); rr(ctx, 340, 252, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 275, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 325, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 400 + i * 98, 780, 82, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 452 + i * 98, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 452 + i * 98, 27, { weight: 700, fit: 670 }); });
      card(ctx, 1060, 380, 640, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Tabel pengukuranmu", 1090, 425, 24, { weight: 900, color: C.ink2 });
      const rows = [["n", "linear", "biner"], ["1.000", "… ms", "… ms"], ["1.000.000", "… ms", "… ms"], ["n", "bubble", "sorted"], ["1.000", "… ms", "… ms"], ["2.000", "… ms", "… ms"]];
      rows.forEach((r, i) => { const y = 475 + i * 50; const head = r[0] === "n"; ctx.fillStyle = head ? "#EEF2F5" : (i % 2 ? "#FFFFFF" : "#F7F9FA"); ctx.fillRect(1080, y - 32, 600, 48);
        r.forEach((s, k) => text(ctx, s, 1100 + k * 200, y, 23, { weight: head ? 900 : 700, color: s.startsWith("…") ? "#9AA8B1" : C.ink })); });
    },
    periksa(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "PERIKSA POLANYA", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      [["cari linear", "data ×10 → waktu ±×10", C.accent], ["cari biner", "hampir tetap, walau data sejuta", BLUE], ["bubble sort", "data ×2 → waktu ±×4", GREEN]].forEach(([s, p, col], i) => {
        const on = l > A * (0.25 + i * 0.18); const y = 270 + i * 150; ctx.globalAlpha = on ? 1 : 0.3;
        card(ctx, 260, y, 1400, 120, { fill: on ? "#FFFFFF" : "#F4F6F5", stroke: on ? col : null, lw: 4, r: 18 });
        text(ctx, s, 300, y + 74, 36, { weight: 900, color: col }); text(ctx, p, 720, y + 74, 34, { weight: 800 }); if (on) text(ctx, "✓", 1620, y + 80, 48, { align: "right", weight: 900, color: GREEN }); ctx.globalAlpha = 1; });
      text(ctx, "Angkamu boleh berbeda dengan video.", 960, 760, 28, { align: "center", weight: 800, color: C.ink2 });
    },
    masalah_nameerror(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const fixed = f > 0.62;
      const err = { name: "NameError", msg: "name 'cari_linear' is not defined", kind: "runtime", line: 2, ctx: [[1, T1[0]], [2, T1[1]]] };
      const c1 = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { lines: LIN, size: 22, run: fixed ? "done" : (f > 0.5 ? "hover" : "idle"), count: 1, active: f > 0.5 && f < 0.7 });
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 18, cw0(a), { lines: T1, size: 22, active: !fixed || f > 0.75, run: "done", count: fixed && f > 0.78 ? 3 : 2, outSize: 21, out: fixed && f > 0.78 ? ["4", "-1"] : fixed ? null : [{ err }] });
      if (!fixed && c2.out && c2.out.err && f > 0.15) { LK.focus(ctx, c2.out.err.lastBox, { t: l, color: RED }); call(ctx, 160, "Fungsi cari_linear belum dikenal", c2.out.err.lastBox.x + c2.out.err.lastBox.w + 6, c2.out.err.lastBox.y + 16, { fill: "#FDECEA", color: RED }); }
      if (!fixed && f > 0.3) call(ctx, 330, "Sel [1] dengan def belum dijalankan.", c1.play.x + 30, c1.play.y, { fill: "#FFF3D6" });
      if (f > 0.42) LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 700 }, { at: 0.55, x: c1.play.x, y: c1.play.y, click: true }, { at: 0.75, x: c2.play.x, y: c2.play.y, click: true }]);
      LK.steps(ctx, "URUTANNYA", ["Jalankan sel def dulu.", "Baru sel penguji."], stepAt(f, [0.58, 0.78]), { y: 470 });
    },
    masalah_lama(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const code = ["data = list(range(1000000))", "random.shuffle(data)", "bubble_sort(data)"];
      const stop = f > 0.72;
      const c = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { lines: code, size: 26, active: true, run: stop ? "done" : "running", spin: l * 1.2, count: 9, outSize: 24, out: stop ? [{ t: "KeyboardInterrupt", k: "bad" }] : null });
      const secs = Math.floor(5 + f * 170), mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
      if (!stop) { text(ctx, `⏱ ${mm}:${ss} … belum selesai`, c.x + 90, c.bottom + 60, 30, { weight: 800, color: RED }); }
      if (f > 0.1 && f < 0.5) call(ctx, 200, "Sejuta data: bisa berjam-jam!", null, null, { fill: "#FDECEA", color: RED });
      if (f > 0.5) { LK.pointer(ctx, l, sp, [{ at: 0.4, x: 900, y: 600 }, { at: 0.7, x: c.play.x, y: c.play.y, click: true }]); if (!stop) call(ctx, 330, "Klik tombol stop (kotak) di kiri sel.", c.play.x + 26, c.play.y, { fill: "#E7F1FB", color: BLUE }); }
      if (stop) call(ctx, 330, "Sel berhenti. Coba ukuran yang lebih kecil, misalnya 4.000.", null, null, { fill: C.goodBg, color: GREEN });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 680, 420, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.3", 600, 360, 34, { align: "center", weight: 900 });
      text(ctx, "balapan algoritma: tebak dulu", 600, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 320, 450, 560, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f113", 600, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "pilih algoritma dan ukuran data, lihat penghitungnya", 600, 600, 23, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 660, 420, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1330, 350, 34, { align: "center", weight: 900 });
      para(ctx, "Ukur juga selection sort, lalu bandingkan dengan bubble sort.", 1330, 400, 28, 580, { align: "center", weight: 700, lh: 1.3 });
      LK.code(ctx, 1040, 490, ["def selection_sort(a):", "    n = len(a)", "    for i in range(n - 1):", "        ..."], { size: 20, nums: false, w: 580 });
      kiko(ctx, 1680, 740, 90, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
