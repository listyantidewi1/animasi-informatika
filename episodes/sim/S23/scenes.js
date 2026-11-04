/* S23 Simulasi praktik: fungsi dan list untuk uang kembalian (terbesar tanpa max, greedy, brute force) di notebook generik ("Colab" di narasi).
   Jendela notebook di kiri (x 110–1410, y 122–822), panel langkah/label/gambar koin di kanan (x 1440–1830).
   Semua kode sudah diuji dengan python3; output persis sama. Waktu brute force dari pengukuran sungguhan (CPython 3.13), dibulatkan
   seperti perintah print di kode. Muat setelah kiko-core.js, layar.js, layar_kode.js. */
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
  const TB = ["def terbesar(daftar):", "    hasil = daftar[0]", "    for x in daftar:", "        if x > hasil:", "            hasil = x", "    return hasil"];
  const TBU = ["print(terbesar([80, 60, 90]))", "print(terbesar([7]))", "print(terbesar([-5, -2, -9]))"];
  const GR = ["def kembalian_greedy(jumlah, koin):", "    # koin harus urut dari terbesar", "    hasil = []", "    for k in koin:", "        while jumlah >= k:",
    "            hasil.append(k)", "            jumlah = jumlah - k", "    return hasil"];
  const GRU1 = ["print(kembalian_greedy(800, [500, 200, 100]))"], GRU2 = ["print(kembalian_greedy(6, [4, 3, 1]))"];
  const BR = ["def kembalian_brute(jumlah, koin):", "    if jumlah == 0:", "        return []", "    terbaik = None", "    for k in koin:", "        if k <= jumlah:",
    "            sisa = kembalian_brute(jumlah - k, koin)", "            if sisa is not None:", "                coba = [k] + sisa",
    "                if terbaik is None or len(coba) < len(terbaik):", "                    terbaik = coba", "    return terbaik"];
  const BRU = ["print(kembalian_brute(6, [4, 3, 1]))", "print(kembalian_brute(800, [500, 200, 100]))"];
  const LB = ["import time", "for jumlah in [20, 30, 35]:", "    mulai = time.perf_counter()", "    kembalian_brute(jumlah, [4, 3, 1])",
    '    print(jumlah, "→", round(time.perf_counter() - mulai, 3), "detik")'];
  const LB_OUT = ["20 → 0.007 detik", "30 → 0.728 detik", "35 → 7.281 detik"];

  // ---------- bingkai dan pembantu ----------
  const nb = (ctx, opt = {}) => LK.notebook(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { name: "Kembalian.ipynb", status: "tersambung", compact: true, ...opt });
  const cx0 = a => a.x + 20, cw0 = a => a.w - 40;
  function keys(ctx, k, u, x = 1635, y = 730) { if (u > 0 && u < 1) L.keys(ctx, x, y, k, { press: u, align: "center", size: 30 }); }
  function call(ctx, y, s, tx, ty, opt = {}) { return L.callout(ctx, opt.x || 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt }); }
  function runOpt(f, t0, t1, out, count, n) {
    if (f < t0) return { run: "ready" };
    if (f < t1) return { run: "running", spin: f * 8, out: n ? out.slice(0, Math.floor((f - t0) / (t1 - t0) * out.length)) : null };
    return { run: "done", count, out };
  }
  function typedCell(lines, u) { const T = LK.typed(lines, u); return { lines: T.lines, caret: T.caret }; }
  function codeBox(g, line, s, lines) { const t = lines[line], c = t.indexOf(s); const p = g.at(line, c); return { x: p.x - 4, y: g.top(line) + 2, w: s.length * g.cw + 8, h: g.lh - 4 }; }
  function lineEnd(g, line, lines) { return { x: g.at(line, lines[line].length).x + 10, y: g.top(line) + g.lh / 2 }; }
  // label di kolom kanan sejajar dengan titik sasarannya; label berikutnya tidak menimpa label sebelumnya
  function sider() { let bottom = 120; return (ctx, s, tx, ty, opt = {}) => { ctx.font = `800 24px Inter`; const n = H.wrap(ctx, s, 24, 800, 320).length, h = n * 30 + 26;
    const y = clamp(Math.max(ty - h / 2, bottom + 12), 126, 820 - h); bottom = y + h; return L.callout(ctx, 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt }); }; }
  // catatan pendek di sebelah kanan baris output (tanpa garis penunjuk)
  function outNote(ctx, cell, i, s, col, x = null) { if (!cell.out || cell.out.lines[i] == null) return; text(ctx, "← " + s, x || cell.x + 260, cell.out.lines[i], 26, { weight: 900, color: col }); }
  // koin bulat bertuliskan nilainya
  const COIN = { 500: "#E0B33A", 200: "#B9C2C8", 100: "#C98A57", 4: "#E0B33A", 3: "#B9C2C8", 1: "#C98A57" };
  function coin(ctx, x, y, v, r = 34, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha = opt.alpha;
    ctx.fillStyle = "rgba(31,42,51,0.18)"; ctx.beginPath(); ctx.arc(x + 2, y + 4, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = COIN[v] || "#D7DEE3"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(31,42,51,0.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, Math.PI * 2); ctx.stroke();
    text(ctx, String(v), x, y + r * 0.32, r * (String(v).length > 2 ? 0.62 : 0.9), { align: "center", weight: 900, color: C.ink }); ctx.restore();
  }
  function coins(ctx, x, y, vals, r = 34, gap = 10) { vals.forEach((v, i) => coin(ctx, x + r + i * (2 * r + gap), y, v, r)); return x + vals.length * (2 * r + gap); }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menulis fungsi terbesar tanpa max", "menghitung kembalian dengan greedy", "mencoba semua cara dengan brute force", "menguji kasus saat greedy gagal"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      card(ctx, 1090, 280, 580, 420, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Kembalian 6, koin 4, 3, 1", 1380, 335, 28, { align: "center", weight: 900 });
      text(ctx, "greedy", 1130, 425, 26, { weight: 900, color: RED }); coins(ctx, 1300, 415, [4, 1, 1], 36);
      text(ctx, "3 koin", 1620, 425, 24, { align: "right", weight: 800, color: RED });
      text(ctx, "brute force", 1130, 545, 26, { weight: 900, color: GREEN }); coins(ctx, 1300, 535, [3, 3], 36);
      text(ctx, "2 koin", 1620, 545, 24, { align: "right", weight: 800, color: GREEN });
      text(ctx, "Mana yang benar? Kita uji!", 1380, 650, 26, { align: "center", weight: 800, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      [["F11.6", "Strategi Algoritmik dan Alternatif Solusi", "greedy, brute force"], ["F12.0", "Perulangan, List, dan Fungsi", "fungsi terbesar tanpa max"]].forEach(([c, t, s], i) => {
        const x = 300 + i * 680; card(ctx, x, 300, 620, 320, { fill: C.bg2, r: 22 });
        text(ctx, c, x + 310, 385, 58, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 310, 455, 32, 560, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 310, 590, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      kiko(ctx, 1660, 735, 90, 0, { wave: l });
    },

    ketik_terbesar(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = typedCell(TB, ph(l, sp, 0.12, 0.6));
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { ...(f < 0.12 ? { lines: [""], caret: { line: 0, col: 0 } } : T), size: 32, active: true, run: "ready", blink: f < 0.6 || blinkAt(l), minLines: 6 });
      if (f < 0.14) call(ctx, 420, "Notebook baru: Kembalian.ipynb", 360, a.y - 30);
      const sd = sider();
      if (f > 0.3) { LK.focus(ctx, codeBox(c.code, 0, "(daftar)", TB), { t: l, pad: 2 }); sd(ctx, "Parameter: sebuah list", lineEnd(c.code, 0, TB).x, lineEnd(c.code, 0, TB).y); }
      if (f > 0.66) { LK.focus(ctx, codeBox(c.code, 1, "hasil = daftar[0]", TB), { t: l + 1, pad: 2, color: GREEN }); sd(ctx, "Nilai awal: isi pertama list (indeks 0)", lineEnd(c.code, 1, TB).x, lineEnd(c.code, 1, TB).y, { fill: C.goodBg, color: GREEN }); }
      card(ctx, 1450, 560, 370, 190, { fill: "#FFF9E0", r: 16 }); text(ctx, "Tanpa max( )", 1635, 610, 28, { align: "center", weight: 900 });
      para(ctx, "tugas dari F12.0: tulis sendiri caranya", 1635, 660, 23, 330, { align: "center", weight: 700, color: C.ink2, lh: 1.25 });
    },
    arti_terbesar(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: TB, size: 32, active: true, run: "ready", minLines: 6 });
      const n = stepAt(f, [0.05, 0.4, 0.75]);
      if (n >= 1) LK.focus(ctx, codeBox(c.code, 2, "for x in daftar:", TB), { t: l, pad: 2 });
      if (n >= 2) LK.focus(ctx, { ...codeBox(c.code, 3, "if x > hasil:", TB), h: c.code.lh * 2 - 4 }, { t: l, pad: 2, color: BLUE });
      if (n >= 3) LK.focus(ctx, codeBox(c.code, 5, "return hasil", TB), { t: l, pad: 2, color: GREEN });
      // pelacak: [80, 60, 90]
      const L3 = [80, 60, 90], k = clamp(Math.floor(ph(l, sp, 0.05, 0.75) * 3), 0, 2), hs = [80, 80, 90];
      card(ctx, 160, 560, 1200, 230, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "daftar = [80, 60, 90]", 190, 605, 26, { weight: 800, color: C.ink2 });
      L3.forEach((v, i) => { const x = 200 + i * 130, on = i === k, done = i < k; ctx.fillStyle = on ? "#FFF3D6" : done ? "#EEF2F5" : "#FFFFFF"; rr(ctx, x, 630, 110, 70, 10); ctx.fill();
        ctx.strokeStyle = on ? C.accent : "#C9D4DB"; ctx.lineWidth = on ? 4 : 2; rr(ctx, x, 630, 110, 70, 10); ctx.stroke(); text(ctx, String(v), x + 55, 678, 34, { align: "center", weight: 800 }); });
      text(ctx, "x = " + L3[k], 640, 678, 32, { weight: 900, color: C.accentDark });
      text(ctx, k === 2 ? "90 > 80 → ganti" : k === 1 ? "60 > 80? tidak" : "mulai", 640, 740, 26, { weight: 800, color: k === 2 ? BLUE : C.ink2 });
      card(ctx, 1000, 620, 320, 120, { fill: k === 2 && f > 0.6 ? C.goodBg : C.bg2, r: 14 }); text(ctx, "hasil", 1160, 660, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, String(hs[k]), 1160, 718, 46, { align: "center", weight: 900 });
      LK.steps(ctx, "ALUR", ["Bandingkan satu per satu.", "Lebih besar? Ganti.", "return hasilnya."], n - 1 < 0 ? 0 : n - 1 + (f > 0.95 ? 1 : 0));
    },
    uji_terbesar(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c1 = LK.cell(ctx, cx0(a), a.y + 18, cw0(a), { lines: TB, size: 26, run: "done", count: 1 });
      const T = typedCell(TBU, ph(l, sp, 0.03, 0.2));
      const r = runOpt(f, 0.24, 0.28, ["90", "7", "-2"], 2);
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 16, cw0(a), { ...(f < 0.24 ? T : { lines: TBU }), size: 26, active: true, blink: blinkAt(l), outSize: 28, ...r });
      keys(ctx, ["Shift", "Enter"], clamp((f - 0.21) / 0.06, 0, 1));
      [["kasus biasa", C.ink], ["isi hanya satu angka", BLUE], ["semua angka negatif", GREEN]].forEach(([s, col], i) => { if (f > 0.3 + i * 0.2) outNote(ctx, c2, i, s, col); });
    },

    ketik_greedy(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = typedCell(GR, ph(l, sp, 0.04, 0.55));
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { ...T, size: 30, active: true, run: "ready", blink: f < 0.55 || blinkAt(l), minLines: 8 });
      const sd = sider();
      if (f > 0.25) { LK.focus(ctx, codeBox(c.code, 0, "(jumlah, koin)", GR), { t: l, pad: 2 }); sd(ctx, "Menerima jumlah dan list koin", lineEnd(c.code, 0, GR).x, lineEnd(c.code, 0, GR).y); }
      if (f > 0.45) { LK.focus(ctx, codeBox(c.code, 1, "# koin harus urut dari terbesar", GR), { t: l + 1, pad: 2, color: RED }); sd(ctx, "Syarat: koin urut dari terbesar", lineEnd(c.code, 1, GR).x, lineEnd(c.code, 1, GR).y, { fill: "#FDECEA", color: RED }); }
      if (f > 0.62) { LK.focus(ctx, codeBox(c.code, 2, "hasil = []", GR), { t: l + 2, pad: 2, color: GREEN }); sd(ctx, "List kosong untuk mengumpulkan koin", lineEnd(c.code, 2, GR).x, lineEnd(c.code, 2, GR).y, { fill: C.goodBg, color: GREEN }); }
    },
    arti_greedy(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: GR, size: 30, active: true, run: "ready", minLines: 8 });
      // pelacak: 800 dengan [500, 200, 100]
      const st = [[800, []], [300, [500]], [100, [500, 200]], [0, [500, 200, 100]]], ks = [500, 500, 200, 100];
      const k = clamp(Math.floor(ph(l, sp, 0.08, 0.8) * 4), 0, 3);
      LK.focus(ctx, { ...codeBox(c.code, 4, "while jumlah >= k:", GR), h: c.code.lh * 3 - 4 }, { t: l, pad: 2, color: BLUE });
      if (f > 0.4) { LK.focus(ctx, codeBox(c.code, 5, "hasil.append(k)", GR), { t: l + 1, pad: 2, color: GREEN }); }
      card(ctx, 1440, 130, 390, 560, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "kembalian 800", 1635, 175, 26, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "koin [500, 200, 100]", 1635, 210, 21, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "jumlah", 1470, 280, 24, { weight: 800, color: C.ink2 }); text(ctx, String(st[k][0]), 1800, 285, 44, { align: "right", weight: 900 });
      if (k > 0) text(ctx, `ambil ${ks[k]}`, 1635, 350, 28, { align: "center", weight: 900, color: GREEN });
      text(ctx, "hasil", 1470, 420, 24, { weight: 800, color: C.ink2 });
      st[k][1].forEach((v, i) => coin(ctx, 1500 + i * 108, 490, v, 46));
      LK.mono(ctx, 22, 700); ctx.fillStyle = C.kikoDark; ctx.textAlign = "center"; ctx.fillText(JSON.stringify(st[k][1]).replace(/,/g, ", "), 1635, 590);
      if (k === 3) text(ctx, "jumlah 0 → selesai", 1635, 650, 24, { align: "center", weight: 900, color: GREEN });
    },
    uji_greedy(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c1 = LK.cell(ctx, cx0(a), a.y + 18, cw0(a), { lines: GR, size: 26, run: "done", count: 3 });
      const T = typedCell(GRU1, ph(l, sp, 0.03, 0.3));
      const r = runOpt(f, 0.34, 0.38, ["[500, 200, 100]"], 4);
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 16, cw0(a), { ...(f < 0.34 ? T : { lines: GRU1 }), size: 26, active: true, blink: blinkAt(l), outSize: 28, ...r });
      keys(ctx, ["Shift", "Enter"], clamp((f - 0.31) / 0.06, 0, 1));
      if (f > 0.4) { card(ctx, 1440, 200, 390, 330, { fill: C.goodBg, r: 18 }); text(ctx, "3 koin", 1635, 260, 34, { align: "center", weight: 900, color: GREEN });
        coins(ctx, 1475, 350, [500, 200, 100], 52, 12); para(ctx, "untuk koin rupiah: jawaban terbaik ✓", 1635, 455, 24, 340, { align: "center", weight: 800, color: GREEN, lh: 1.25 }); }
    },
    greedy_gagal(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c1 = LK.cell(ctx, cx0(a), a.y + 18, cw0(a), { lines: GR, size: 22, run: "done", count: 3 });
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 14, cw0(a), { lines: GRU1, size: 22, run: "done", count: 4, outSize: 24, out: ["[500, 200, 100]"] });
      const T = typedCell(GRU2, ph(l, sp, 0.03, 0.2));
      const r = runOpt(f, 0.23, 0.27, ["[4, 1, 1]"], 5);
      const c3 = LK.cell(ctx, cx0(a), c2.bottom + 14, cw0(a), { ...(f < 0.23 ? T : { lines: GRU2 }), size: 22, active: true, blink: blinkAt(l), outSize: 24, ...r });
      if (f > 0.05) { card(ctx, 1440, 140, 390, 300, { fill: "#FDECEA", stroke: RED, lw: 3, r: 18 }); text(ctx, "greedy: 3 koin", 1635, 195, 30, { align: "center", weight: 900, color: RED });
        coins(ctx, 1500, 290, [4, 1, 1], 44, 12); text(ctx, "4 + 1 + 1 = 6", 1635, 400, 26, { align: "center", weight: 800 }); }
      if (f > 0.68) { card(ctx, 1440, 470, 390, 300, { fill: C.goodBg, stroke: GREEN, lw: 3, r: 18 }); text(ctx, "padahal: 2 koin", 1635, 525, 30, { align: "center", weight: 900, color: GREEN });
        coins(ctx, 1550, 620, [3, 3], 44, 12); text(ctx, "3 + 3 = 6", 1635, 730, 26, { align: "center", weight: 800 }); }
    },

    ketik_brute(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = typedCell(BR, ph(l, sp, 0.03, 0.5));
      const c = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { ...T, size: 27, active: true, run: "ready", blink: f < 0.5 || blinkAt(l), minLines: 12 });
      const sd = sider();
      if (f > 0.5) { LK.focus(ctx, { ...codeBox(c.code, 4, "for k in koin:", BR), h: c.code.lh * 2 - 4 }, { t: l, pad: 2 }); sd(ctx, "Coba setiap koin yang muat", lineEnd(c.code, 4, BR).x, lineEnd(c.code, 4, BR).y); }
      if (f > 0.7) { LK.focus(ctx, codeBox(c.code, 6, "kembalian_brute(jumlah - k, koin)", BR), { t: l + 1, pad: 2, color: BLUE }); sd(ctx, "Cari yang terbaik untuk sisanya: memanggil fungsi yang sama", lineEnd(c.code, 6, BR).x, lineEnd(c.code, 6, BR).y, { fill: "#E7F1FB", color: BLUE }); }
    },
    arti_brute(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c = LK.cell(ctx, cx0(a), a.y + 20, cw0(a), { lines: BR, size: 27, active: true, run: "ready", minLines: 12 });
      const sd = sider();
      if (f > 0.03) { LK.focus(ctx, { ...codeBox(c.code, 1, "if jumlah == 0:", BR), h: c.code.lh * 2 - 4 }, { t: l, pad: 2, color: GREEN }); sd(ctx, "Base case: jumlah 0 → list kosong", lineEnd(c.code, 1, BR).x + 120, lineEnd(c.code, 1, BR).y, { fill: C.goodBg, color: GREEN }); }
      if (f > 0.45) { LK.focus(ctx, { ...codeBox(c.code, 9, "if terbaik is None or len(coba) < len(terbaik):", BR), h: c.code.lh * 2 - 4 }, { t: l + 1, pad: 2, color: C.accent }); sd(ctx, "Lebih sedikit koin? Simpan di terbaik.", lineEnd(c.code, 9, BR).x, lineEnd(c.code, 9, BR).y); }
    },
    uji_brute(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const c1 = LK.cell(ctx, cx0(a), a.y + 16, cw0(a), { lines: BR, size: 19, run: "done", count: 6 });
      const T = typedCell(BRU, ph(l, sp, 0.03, 0.2));
      const r = runOpt(f, 0.23, 0.27, ["[3, 3]", "[500, 200, 100]"], 7);
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 14, cw0(a), { ...(f < 0.23 ? T : { lines: BRU }), size: 21, active: true, blink: blinkAt(l), outSize: 23, ...r });
      // pohon cobaan untuk 6
      if (f > 0.08) { card(ctx, 1440, 130, 390, 470, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "semua cobaan untuk 6", 1635, 172, 23, { align: "center", weight: 900, color: C.accentDark });
        [["ambil 4", "sisa 2 → [1, 1]", [4, 1, 1]], ["ambil 3", "sisa 3 → [3]", [3, 3]], ["ambil 1", "sisa 5 → [4, 1]", [1, 4, 1]]].forEach(([s, t, cs], i) => {
          const on = f > 0.1 + i * 0.12; if (!on) return; const y = 200 + i * 130, best = i === 1 && f > 0.6;
          if (best) { ctx.fillStyle = C.goodBg; rr(ctx, 1452, y, 366, 120, 12); ctx.fill(); }
          text(ctx, s, 1465, y + 32, 22, { weight: 900 }); text(ctx, t, 1580, y + 32, 20, { weight: 700, color: C.ink2 });
          coins(ctx, 1465, y + 82, cs, 26, 8); text(ctx, cs.length + " koin" + (best ? " ✓" : ""), 1805, y + 90, 22, { align: "right", weight: 900, color: best ? GREEN : C.ink }); }); }
      if (f > 0.75) outNote(ctx, c2, 1, "sama dengan greedy", BLUE, c2.x + 330);
    },
    brute_lambat(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      // jeda tampil sebanding (dimampatkan) dengan waktu sungguhan: 20 cepat, 30 sebentar, 35 lama
      const out = f < 0.12 ? [] : f < 0.35 ? LB_OUT.slice(0, 1) : f < 0.7 ? LB_OUT.slice(0, 2) : LB_OUT;
      const running = f >= 0.08 && f < 0.7;
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: LB, size: 25, active: true, run: f < 0.08 ? "ready" : running ? "running" : "done", spin: l, count: 8, outSize: 30, out });
      const bars = [[20, 0.007], [30, 0.728], [35, 7.281]];
      card(ctx, 1440, 130, 390, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "waktu (detik)", 1635, 172, 24, { align: "center", weight: 900, color: C.ink2 });
      bars.forEach(([j, t], i) => { if (out.length <= i) return; const y = 200 + i * 110; text(ctx, "kembalian " + j, 1462, y + 28, 23, { weight: 800 });
        const w = Math.max(6, 250 * t / 7.281); ctx.fillStyle = i === 2 ? RED : C.accent; rr(ctx, 1462, y + 44, w, 34, 8); ctx.fill(); text(ctx, String(t).replace(".", ","), 1474 + w, y + 70, 24, { weight: 900 }); });
      if (f > 0.75) { card(ctx, 1440, 580, 390, 170, { fill: "#FDECEA", r: 18 }); para(ctx, "+5 rupiah → sekitar 10 kali lebih lama", 1635, 640, 28, 340, { align: "center", weight: 900, color: RED, lh: 1.25 }); }
    },
    tabel_uji(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "TABEL KASUS UJI", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      const X = [230, 470, 840, 1150, 1480], hdr = ["jumlah", "koin", "greedy", "brute force", "hasil"];
      ctx.fillStyle = "#EEF2F5"; rr(ctx, 210, 240, 1500, 56, 10); ctx.fill(); hdr.forEach((h, i) => text(ctx, h, X[i], 278, 26, { weight: 900, color: C.ink2 }));
      const R = [["800", "[500, 200, 100]", [500, 200, 100], [500, 200, 100], "sama ✓", GREEN], ["6", "[4, 3, 1]", [4, 1, 1], [3, 3], "greedy gagal ✗", RED]];
      R.forEach(([j, k, g, bf, s, col], i) => { const on = l > A * (0.15 + i * 0.35); if (!on) return; const y = 330 + i * 200;
        ctx.fillStyle = i ? "#FDF0EF" : "#EFF8F2"; rr(ctx, 210, y, 1500, 170, 12); ctx.fill();
        text(ctx, j, X[0], y + 98, 40, { weight: 900 }); LK.mono(ctx, 24, 700); ctx.fillStyle = C.kikoDark; ctx.textAlign = "left"; ctx.fillText(k, X[1], y + 95);
        const r = i ? 34 : 40; coins(ctx, X[2], y + 85, g, r, 8); coins(ctx, X[3], y + 85, bf, r, 8);
        para(ctx, s, X[4] + 100, y + 95, 28, 220, { align: "center", weight: 900, color: col, lh: 1.15 }); });
    },

    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 290, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 252, 22, 76, 6); ctx.fill(); rr(ctx, 340, 252, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 275, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 325, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 400 + i * 98, 860, 82, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 452 + i * 98, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 452 + i * 98, 27, { weight: 700, fit: 740 }); });
      card(ctx, 1140, 380, 560, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Tiga fungsi", 1170, 425, 24, { weight: 900, color: C.ink2 });
      LK.code(ctx, 1160, 450, ["def terbesar(daftar):", "    ...", "def kembalian_greedy(jumlah, koin):", "    ...", "def kembalian_brute(jumlah, koin):", "    ..."], { size: 20, nums: false, w: 520, lh: 50 });
    },
    periksa(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "PERIKSA HASILMU", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      const R = [["terbesar([80, 60, 90])", "90"], ["terbesar([7])", "7"], ["terbesar([-5, -2, -9])", "-2"], ["kembalian_greedy(6, [4, 3, 1])", "[4, 1, 1]"], ["kembalian_brute(6, [4, 3, 1])", "[3, 3]"]];
      R.forEach(([q, v], i) => { const on = l > A * (0.08 + (i < 3 ? 0 : 0.4) + i * 0.05); const y = 280 + i * 100; ctx.globalAlpha = on ? 1 : 0.3;
        ctx.fillStyle = i % 2 ? "#FFFFFF" : "#F4F6F8"; rr(ctx, 240, y - 50, 1440, 80, 12); ctx.fill();
        LK.code(ctx, 270, y - 40, [q], { size: 28, nums: false, w: 900 }); LK.mono(ctx, 32, 800); ctx.fillStyle = i === 3 ? RED : GREEN; ctx.textAlign = "right"; ctx.fillText(v, 1560, y + 2);
        if (on) text(ctx, "✓", 1650, y + 4, 40, { align: "right", weight: 900, color: GREEN }); ctx.globalAlpha = 1; });
    },
    salah_urut(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const fixed = f > 0.72;
      const line = fixed ? "print(kembalian_greedy(6, [4, 3, 1]))" : "print(kembalian_greedy(6, [1, 3, 4]))";
      const c1 = LK.cell(ctx, cx0(a), a.y + 18, cw0(a), { lines: GR, size: 26, run: "done", count: 3 });
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 16, cw0(a), { lines: [line], size: 28, active: true, run: "done", count: fixed ? 10 : 9, outSize: 30, out: [fixed ? "[4, 1, 1]" : "[1, 1, 1, 1, 1, 1]"],
        boxes: [{ line: 0, from: 26, to: 35, color: fixed ? GREEN : RED }] });
      const sd = sider();
      if (!fixed && f > 0.1) { sd(ctx, "Koin ditulis dari yang terkecil", c2.code.at(0, 37).x + 10, c2.code.top(0) + 20, { fill: "#FDECEA", color: RED });
        if (f > 0.3) { coins(ctx, 1460, 230, [1, 1, 1, 1, 1, 1], 26, 6); text(ctx, "6 koin ✗", 1635, 320, 30, { align: "center", weight: 900, color: RED }); } }
      if (!fixed && f > 0.3) LK.focus(ctx, codeBox(c1.code, 1, "# koin harus urut dari terbesar", GR), { t: l, pad: 2, color: RED });
      if (fixed) { sd(ctx, "Urutkan dari terbesar: [4, 3, 1]", c2.code.at(0, 37).x + 10, c2.code.top(0) + 20, { fill: C.goodBg, color: GREEN }); }
    },
    salah_print(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const bad = TB.slice(0, 5).concat(["    print(hasil)"]), good = TB;
      const fixed = f > 0.75;
      const c1 = LK.cell(ctx, cx0(a), a.y + 18, cw0(a), { lines: fixed ? good : bad, size: 28, run: "done", count: fixed ? 13 : 11, active: fixed, boxes: [{ line: 5, from: 4, to: fixed ? 16 : 16, color: fixed ? GREEN : RED }] });
      const T2 = ["y = terbesar([80, 60, 90])", "print(y)"];
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 16, cw0(a), { lines: T2, size: 28, active: !fixed, run: "done", count: fixed ? 14 : 12, outSize: 30, out: fixed ? ["90"] : ["90", "None"] });
      if (!fixed && c2.out) { outNote(ctx, c2, 0, "dari print di dalam fungsi", C.ink, c2.x + 200);
        if (f > 0.35) { LK.focus(ctx, { x: c2.x + 84, y: c2.out.lines[1] - 30, w: 90, h: 40 }, { t: l, color: RED, pad: 2 }); outNote(ctx, c2, 1, "y berisi None", RED, c2.x + 200); } }
      if (fixed) sider()(ctx, "Pakai return: y berisi 90 dan bisa diolah lagi.", c1.code.at(5, 17).x + 10, c1.code.top(5) + 20, { fill: C.goodBg, color: GREEN });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 680, 420, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.6", 600, 360, 34, { align: "center", weight: 900 });
      text(ctx, "mesin kembalian", 600, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 320, 450, 560, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f116", 600, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      coins(ctx, 420, 620, [4, 3, 1], 40, 16); text(ctx, "greedy lawan brute force", 600, 690, 24, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 660, 420, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1330, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Tulis satu paragraf justifikasi: kapan memakai greedy, kapan brute force, dan apa alasannya?", 1330, 430, 28, 560, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1680, 740, 90, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
