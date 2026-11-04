/* K13 Simulasi konsep: sistem operasi membagi giliran prosesor (giliran berputar / round robin) dan memori (swap).
   Memakai pembantu E.2 (Kiko.os: memmap, taskman). Semua angka giliran sudah dicek dengan python3 (lihat catatan di bawah).
   Variasi: v0 Musik sendirian (selesai 3) · v1 Musik3+Chat2 (C4, M5) · v2 M3 C2 B2 G3 K2 (C7 B8 K10 M11 G12)
   v3 Video8 C2 M3 (C5 M8 V13; tanpa giliran C10 M13) · v4 RAM 8 blok, swap 2 irisan (C12 B15 M17 K18; tanpa penuh 10)
   v4s Browser ditutup: M3 C2 K3 (C5 M7 K8). Gambar penting di atas y≈830 (kartu narasi tiga baris). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, O = K.os;
  const { rr, text, para, card, kiko, ease, clamp, lerp, arrowIcon } = H;
  const AP = { M: ["🎵", "Musik", "#8E6BBF"], C: ["💬", "Chat", "#2E9E5B"], B: ["🌐", "Browser", "#2E7E9A"], G: ["🎮", "Game", "#D9443B"], K: ["📷", "Kamera", "#E07B39"], V: ["🎬", "Edit video", "#C2477E"], S: ["⇄", "swap", "#8A99A3"] };
  const BLOK = { M: 2, C: 2, B: 3, K: 2 };

  function rrPlan(procs) {
    const rem = {}, slots = [], done = {}; procs.forEach(([id, w]) => rem[id] = w);
    while (procs.some(([id]) => rem[id] > 0)) procs.forEach(([id]) => { if (rem[id] > 0) { rem[id]--; slots.push(id); if (!rem[id]) done[id] = slots.length; } });
    return { slots, done };
  }
  const VARS = {
    v0: { title: "MUSIK SENDIRIAN DI PROSESOR", procs: [["M", 3]] },
    v1: { title: "VARIASI 1 · DUA PROSES", procs: [["M", 3], ["C", 2]] },
    v2: { title: "VARIASI 2 · LIMA PROSES", procs: [["M", 3], ["C", 2], ["B", 2], ["G", 3], ["K", 2]] },
    v3: { title: "VARIASI 3 · SATU PROSES BERAT", procs: [["V", 8], ["C", 2], ["M", 3]] },
    v4s: { title: "BROWSER DITUTUP: SEMUA MUAT DI RAM", procs: [["M", 3], ["C", 2], ["K", 3]] },
    v4: { title: "VARIASI 4 · RAM PENUH", procs: [["M", 3], ["C", 2], ["B", 2], ["K", 3]] }
  };
  Object.values(VARS).forEach(v => Object.assign(v, rrPlan(v.procs)));
  // v4: jadwal dengan swap (hasil simulasi python3: proses yang paling lama menunggu dikeluarkan; swap = 2 irisan menunggu)
  const V4 = VARS.v4;
  V4.mslots = ["M", "C", "B", "S", "S", "K", "S", "S", "M", "S", "S", "C", "S", "S", "B", "K", "M", "K"];
  V4.mdone = { C: 12, B: 15, M: 17, K: 18 };
  // isi RAM (id, blok awal) dan penyimpanan saat irisan ke-s (1..18) dikerjakan; mv = sedang di-swap
  const R0 = [["M", 0], ["C", 2], ["B", 4]];
  const MEM = [null,
    { ram: R0, disk: ["K"] }, { ram: R0, disk: ["K"] }, { ram: R0, disk: ["K"] },
    { ram: [["K", 0], ["C", 2], ["B", 4]], disk: ["M"], mv: { in: "K", out: "M" } }, { ram: [["K", 0], ["C", 2], ["B", 4]], disk: ["M"], mv: { in: "K", out: "M" } },
    { ram: [["K", 0], ["C", 2], ["B", 4]], disk: ["M"] },
    { ram: [["K", 0], ["M", 2], ["B", 4]], disk: ["C"], mv: { in: "M", out: "C" } }, { ram: [["K", 0], ["M", 2], ["B", 4]], disk: ["C"], mv: { in: "M", out: "C" } },
    { ram: [["K", 0], ["M", 2], ["B", 4]], disk: ["C"] },
    { ram: [["K", 0], ["M", 2], ["C", 4]], disk: ["B"], mv: { in: "C", out: "B" } }, { ram: [["K", 0], ["M", 2], ["C", 4]], disk: ["B"], mv: { in: "C", out: "B" } },
    { ram: [["K", 0], ["M", 2], ["C", 4]], disk: ["B"] },
    { ram: [["K", 0], ["M", 2], ["B", 4]], disk: [], mv: { in: "B" } }, { ram: [["K", 0], ["M", 2], ["B", 4]], disk: [], mv: { in: "B" } },
    { ram: [["K", 0], ["M", 2], ["B", 4]], disk: [] },
    { ram: [["K", 0], ["M", 2]], disk: [] }, { ram: [["K", 0], ["M", 2]], disk: [] }, { ram: [["K", 0]], disk: [] }];

  const heading = (ctx, s, y = 168) => text(ctx, s, 960, y, 34, { align: "center", weight: 900, color: C.accentDark });
  const prog = (b, l, a0 = 0.06, a1 = 0.88) => { const a = b.audio || b.dur; return clamp((l - a * a0) / (a * (a1 - a0)), 0, 1); };

  // ---------- pembantu gambar ----------
  // garis waktu: slots = daftar id per irisan; k = banyak irisan yang sudah berjalan (pecahan = irisan yang sedang berjalan)
  function strip(ctx, slots, k, opt = {}) {
    const N = opt.n || slots.length, sw = Math.min(110, 1640 / N), x0 = opt.x0 != null ? opt.x0 : 960 - N * sw / 2, y = opt.y || 650, h = opt.h || 78;
    const n = Math.floor(k), u = k - n, done = opt.done || {};
    if (opt.label !== false) text(ctx, opt.label || "GARIS WAKTU · satu kotak = satu irisan", x0, y - 16, 22, { weight: 900, color: C.ink2 });
    const finishAt = {}; Object.entries(done).forEach(([id, s]) => finishAt[s] = id);
    for (let i = 0; i < N; i++) {
      const x = x0 + i * sw + 3, w = sw - 6, id = slots[i], ap = id && AP[id];
      const shown = i < n, cur = !opt.idle && i === n && k < N && id;
      ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 10); ctx.fill();
      if (shown || cur) {
        ctx.save(); if (cur) { ctx.beginPath(); ctx.rect(x, y, w * clamp(u * 1.15, 0, 1), h); ctx.clip(); }
        ctx.fillStyle = id === "S" ? "#B7C4CC" : ap[2]; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.restore();
        if (shown || u > 0.3) text(ctx, ap[0], x + w / 2, y + h / 2 + 12, Math.min(34, sw * 0.42), { align: "center", weight: 900, color: id === "S" ? "#FFFFFF" : C.ink });
      }
      ctx.strokeStyle = cur ? C.accent : "#CFDAE0"; ctx.lineWidth = cur ? 5 : 2; rr(ctx, x, y, w, h, 10); ctx.stroke();
      const fin = shown && finishAt[i + 1];
      if (fin && opt.hl === fin) { ctx.strokeStyle = C.accent; ctx.lineWidth = 7; rr(ctx, x - 3, y - 3, w + 6, h + 6, 12); ctx.stroke(); }
      if (fin) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + w - 4, y + 4, 13, 0, Math.PI * 2); ctx.fill(); text(ctx, "✓", x + w - 4, y + 11, 18, { align: "center", weight: 900, color: C.good }); }
      text(ctx, String(i + 1), x + w / 2, y + h + 30, 22, { align: "center", weight: fin ? 900 : 700, color: fin ? (fin === opt.hl ? C.accentDark : C.ink) : C.muted });
    }
    return { x0, sw, y, h };
  }
  // status proses pada saat k irisan
  function stat(slots, done, id, k, idle) {
    if (idle) return { used: 0, part: 0, cur: false, fin: false };
    const n = Math.floor(k), u = k - n, N = slots.length;
    const used = slots.slice(0, n).filter(s => s === id).length, cur = n < N && slots[n] === id;
    return { used, part: cur ? u : 0, cur, fin: done[id] != null && done[id] <= n };
  }
  // daftar proses di kiri
  function rows(ctx, V, slots, done, k, opt = {}) {
    const x = opt.x || 140, w = opt.w || 620, y0 = opt.y || 200, gap = opt.gap || (V.procs.length > 4 ? 76 : 80);
    V.procs.forEach(([id, need], i) => {
      const ap = AP[id], y = y0 + i * gap, s = stat(slots, done, id, k, opt.idle);
      ctx.save(); if (s.fin) ctx.globalAlpha = 0.55;
      card(ctx, x, y, w, 66, { fill: s.cur ? "#FFF3D6" : "#FFFFFF", stroke: s.cur ? C.accent : ap[2], lw: s.cur ? 5 : 3, r: 14 });
      text(ctx, ap[0], x + 34, y + 45, 30, { align: "center" });
      if (opt.blok) { text(ctx, ap[1], x + 68, y + 30, 23, { weight: 900 }); text(ctx, BLOK[id] + " blok RAM", x + 68, y + 55, 17, { weight: 700, color: "#8E6BBF" }); }
      else text(ctx, ap[1], x + 68, y + 42, 24, { weight: 900 });
      const sq = 24, sx = x + (opt.sqx || 236);
      for (let j = 0; j < need; j++) {
        const f = j < s.used ? 1 : j === s.used ? s.part : 0;
        ctx.fillStyle = "#E6EDF2"; rr(ctx, sx + j * 30, y + 21, sq, sq, 5); ctx.fill();
        if (f > 0) { ctx.save(); ctx.beginPath(); ctx.rect(sx + j * 30, y + 21, sq * f, sq); ctx.clip(); ctx.fillStyle = ap[2]; rr(ctx, sx + j * 30, y + 21, sq, sq, 5); ctx.fill(); ctx.restore(); }
      }
      const st = s.fin ? "✓ selesai" : s.cur ? "giliran" : "menunggu";
      text(ctx, st, x + w - 16, y + 42, 20, { align: "right", weight: 900, color: s.fin ? C.good : s.cur ? C.accentDark : C.ink2 });
      ctx.restore();
    });
    text(ctx, "kotak kecil = irisan yang dibutuhkan", x, y0 + V.procs.length * gap + 12, 18, { weight: 700, color: C.ink2 });
  }
  // prosesor dengan proses yang sedang dilayani
  function cpu(ctx, cx, cy, id, u, label) {
    card(ctx, cx - 130, cy - 120, 260, 240, { fill: "#F7FAF8", stroke: C.kiko, lw: 4, r: 18 });
    text(ctx, "PROSESOR", cx, cy - 84, 20, { align: "center", weight: 900, color: C.kiko });
    if (id === "S") { text(ctx, "⏳", cx, cy, 52, { align: "center" }); text(ctx, "menunggu swap", cx, cy + 40, 21, { align: "center", weight: 900, color: C.bad }); }
    else if (id) { text(ctx, AP[id][0], cx, cy, 56, { align: "center" }); text(ctx, AP[id][1], cx, cy + 40, 22, { align: "center", weight: 900 }); }
    else text(ctx, "kosong", cx, cy + 10, 22, { align: "center", weight: 800, color: C.muted });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, cx - 100, cy + 62, 200, 16, 8); ctx.fill();
    if (id) { ctx.fillStyle = id === "S" ? "#8A99A3" : C.accent; rr(ctx, cx - 100, cy + 62, 200 * clamp(u, 0, 1), 16, 8); ctx.fill(); }
    if (label) text(ctx, label, cx, cy + 104, 20, { align: "center", weight: 800, color: C.ink2 });
  }
  // panel kanan: urutan selesai
  function finished(ctx, V, done, k, opt = {}) {
    const x = 1230, y = 200, w = 570, n = Math.floor(k);
    card(ctx, x, y, w, opt.h || 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, "SELESAI DI IRISAN KE-", x + 28, y + 46, 24, { weight: 900, color: C.accentDark });
    const list = V.procs.map(([id]) => id).filter(id => done[id] <= n).sort((a, b) => done[a] - done[b]);
    if (!list.length) text(ctx, "belum ada", x + 28, y + 100, 22, { weight: 700, color: C.muted });
    list.forEach((id, i) => {
      const yy = y + 66 + i * 64, on = opt.hl === id;
      ctx.fillStyle = on ? "#FFF3D6" : "#F4F6F5"; rr(ctx, x + 16, yy, w - 32, 56, 12); ctx.fill();
      if (on) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, x + 16, yy, w - 32, 56, 12); ctx.stroke(); }
      text(ctx, AP[id][0] + "  " + AP[id][1], x + 36, yy + 38, 26, { weight: 900 });
      text(ctx, String(done[id]), x + w - 40, yy + 41, 34, { align: "right", weight: 900, color: on ? C.accentDark : C.ink });
    });
  }
  // papan lengkap satu variasi giliran berputar
  function board(ctx, V, k, opt = {}) {
    heading(ctx, V.title);
    const slots = V.slots, done = V.done, N = slots.length, n = Math.floor(k), cur = n < N ? slots[n] : null;
    const idle = opt.ask || opt.idle;
    if (!opt.noRows) rows(ctx, V, slots, done, k, { idle });
    if (!opt.noCpu) {
      const go = !idle && (k > 0 || opt.run);
      cpu(ctx, 1000, 380, go ? cur : null, k - n, cur && go ? "irisan ke-" + (n + 1) : "belum mulai");
      if (cur && go) { const i = V.procs.findIndex(p => p[0] === cur); arrowIcon(ctx, "east", 815, 233 + i * (V.procs.length > 4 ? 76 : 80), 30, C.accent); }
    }
    if (opt.ask) {
      card(ctx, 1230, 200, 570, 400, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 18 });
      text(ctx, "?", 1515, 330, 110, { align: "center", weight: 900, color: C.accent });
      para(ctx, opt.ask, 1515, 420, 34, 500, { align: "center", weight: 900, lh: 1.25 });
    } else if (!opt.noFin) finished(ctx, V, done, k, { hl: opt.hl });
    strip(ctx, slots, k, { done, hl: opt.hl, idle });
  }

  // ---------- adegan ----------
  Object.assign(K.SCENES, {
    k13_tujuan(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 230, 30, { weight: 900, color: C.accentDark });
      ["menjalankan giliran berputar", "mencatatnya di garis waktu", "menghitung kapan proses selesai", "menjelaskan swap saat RAM penuh"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 270 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 326 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 324 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      cpu(ctx, 1400, 380, ["M", "C", "B", "G"][Math.floor(l / 1.2) % 4], (l / 1.2) % 1, ""); text(ctx, "satu prosesor, banyak proses", 1400, 540, 24, { align: "center", weight: 800, color: C.ink2 });
      O.memmap(ctx, 1150, 600, 500, 80, 8, [{ app: AP.M, start: 0, size: 2 }, { app: AP.C, start: 2, size: 2 }, { app: AP.B, start: 4, size: 3 }], { title: "RAM" });
    },
    k13_prasyarat(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 330, 290, 860, 360, { fill: C.bg2, r: 22 });
      text(ctx, "E.2", 760, 380, 64, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Peran Sistem Operasi", 760, 450, 40, { align: "center", weight: 800 });
      ["proses dan irisan waktu", "memori (RAM)", "pengelola tugas"].forEach((s, i) => text(ctx, "• " + s, 520, 520 + i * 40, 28, { weight: 700, color: C.ink2 }));
      card(ctx, 1240, 290, 360, 360, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Istilah", 1420, 350, 30, { align: "center", weight: 900 });
      [["proses", "aplikasi berjalan"], ["irisan", "time slice"], ["swap", "pindah ke penyimpanan"]].forEach(([a, s], i) => { text(ctx, a, 1420, 410 + i * 76, 28, { align: "center", weight: 900, color: C.kikoDark }); text(ctx, s, 1420, 440 + i * 76, 21, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1680, 740, 100, 0, { wave: l });
    },
    k13_sendiri(ctx, b, l) {
      const V = VARS.v0, a = b.audio || b.dur, k = clamp((l - a * 0.55) / (a * 0.38), 0, 1) * V.slots.length;
      board(ctx, V, k, { hl: "M", run: true, idle: l < a * 0.55 });
      if (l < a * 0.55) { card(ctx, 1230, 200, 570, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
        text(ctx, "PROSES", 1515, 260, 26, { align: "center", weight: 900, color: C.accentDark });
        para(ctx, "aplikasi yang sedang berjalan", 1515, 320, 32, 480, { align: "center", weight: 800, lh: 1.25 });
        if (l > a * 0.25) { text(ctx, "irisan waktu", 1515, 460, 30, { align: "center", weight: 900, color: C.kikoDark }); text(ctx, "(time slice) = jatah di prosesor", 1515, 500, 24, { align: "center", weight: 700, color: C.ink2 }); } }
    },
    k13_aturan(ctx, b, l) {
      heading(ctx, "ATURAN GILIRAN BERPUTAR (ROUND ROBIN)");
      const a = b.audio || b.dur, ids = ["M", "C", "B"], p = l < a * 0.35 ? 0 : Math.floor((l - a * 0.35) / 1.6) + 1;
      const run = ids[p % 3], q = [1, 2].map(j => ids[(p + j) % 3]);
      // antrean: dua proses menunggu, satu di prosesor
      q.forEach((id, j) => O.proc(ctx, 230 + j * 230, 380, 200, AP[id], {}));
      text(ctx, "ANTREAN", 345, 300, 24, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "berikutnya", 230, 335, 20, { align: "center", weight: 800, color: C.accentDark });
      arrowIcon(ctx, "east", 640, 380, 34, C.ink2);
      cpu(ctx, 860, 380, run, ((l - a * 0.35) / 1.6) % 1, "satu irisan");
      // jalur kembali
      ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(860, 505); ctx.lineTo(860, 580); ctx.lineTo(460, 580); ctx.lineTo(460, 432); ctx.stroke(); ctx.setLineDash([]);
      arrowIcon(ctx, "up", 460, 440, 30, C.accent);
      text(ctx, "belum selesai → kembali ke belakang antrean", 660, 625, 24, { align: "center", weight: 800, color: C.accentDark });
      card(ctx, 1150, 210, 650, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "SETIAP GILIRAN", 1180, 258, 26, { weight: 900, color: C.accentDark });
      [["1", "Proses terdepan mendapat satu irisan."], ["2", "Prosesor pindah, selesai atau belum."], ["3", "Yang belum selesai kembali ke belakang antrean."]].forEach(([n, s], i) => {
        const on = l > a * (0.3 + i * 0.2); ctx.globalAlpha = on ? 1 : 0.25;
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1205, 320 + i * 100, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, n, 1205, 329 + i * 100, 24, { align: "center", weight: 900, color: "#fff" });
        para(ctx, s, 1245, 328 + i * 100, 27, 520, { weight: 800, lh: 1.2 }); ctx.globalAlpha = 1;
      });
    },
    k13_garis(ctx, b, l) {
      heading(ctx, "YANG SELESAI KELUAR, SEMUA IRISAN DICATAT");
      const a = b.audio || b.dur;
      card(ctx, 140, 210, 760, 330, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(185, 270, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, "4", 185, 279, 24, { align: "center", weight: 900, color: "#fff" });
      para(ctx, "Proses yang selesai keluar dari antrean.", 225, 280, 28, 640, { weight: 800 });
      O.proc(ctx, 360, 410, 300, AP.C, { sub: "✓ selesai" }); arrowIcon(ctx, "east", 580, 410, 34, C.good); text(ctx, "keluar", 690, 420, 28, { weight: 900, color: C.good });
      card(ctx, 960, 210, 820, 330, { fill: "#FFF9E0", r: 18 });
      text(ctx, "1 irisan ≈ beberapa milidetik", 1370, 300, 34, { align: "center", weight: 900 });
      para(ctx, "Pergantiannya ribuan kali setiap detik, jadi semua aplikasi terasa berjalan bersamaan.", 1370, 370, 28, 700, { align: "center", weight: 700, lh: 1.3, color: C.ink2 });
      const k = clamp((l - a * 0.3) / (a * 0.55), 0, 1) * 10;
      strip(ctx, new Array(10).fill(null), 0, { n: 10, label: "GARIS WAKTU · irisan ke-1, ke-2, ke-3, …" });
      const sw = 110, x0 = 960 - 5 * sw, i = Math.min(9, Math.floor(k));
      if (l > a * 0.3) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; rr(ctx, x0 + i * sw, 647, sw, 84, 12); ctx.stroke(); }
    },
    k13_tanya(ctx, b, l) { board(ctx, VARS[b.v], 0, { ask: b.ask }); },
    k13_tebak(ctx, b, l) {
      const V = VARS[b.v], ps = V.procs, w = b.v === "v4" ? 370 : ps.length > 3 ? 310 : 360, gap = w + 20;
      heading(ctx, V.title);
      ps.forEach(([id, need], i) => O.proc(ctx, 960 + (i - (ps.length - 1) / 2) * gap, 250, w, AP[id], { sub: need + " irisan" + (b.v === "v4" ? " · " + BLOK[id] + " blok" : "") }));
      text(ctx, "TEBAK DULU", 960, 360, 30, { align: "center", weight: 900, color: C.ink2 });
      b.opts.forEach((o, i) => {
        const y = 390 + i * 116; card(ctx, 420, y, 1080, 96, { fill: C.bg2, stroke: "#CFDCD5", lw: 3 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(480, y + 48, 30, 0, Math.PI * 2); ctx.fill();
        text(ctx, "ABC"[i], 480, y + 61, 34, { align: "center", color: "#fff", weight: 900 }); text(ctx, o, 540, y + 62, 38, { weight: 800 });
      });
      const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(1660, 560, 46, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1660, 560, 46, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
      text(ctx, "?", 1660, 576, 44, { align: "center", weight: 900, color: C.accentDark });
    },
    k13_jalan(ctx, b, l) { const V = VARS[b.v]; board(ctx, V, prog(b, l) * V.slots.length, { run: true }); },
    k13_hasil(ctx, b, l) {
      const V = VARS[b.v], a = b.audio || b.dur;
      board(ctx, V, V.slots.length, { hl: b.hl, noRows: true, noCpu: true });
      card(ctx, 140, 200, 1050, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, AP[b.hl][0] + " " + AP[b.hl][1].toUpperCase() + " (BUTUH 3 IRISAN) SELESAI DI IRISAN KE-", 170, 250, 24, { weight: 900, color: C.accentDark });
      const max = 12, bx = 420, bw = 700;
      b.cmp.forEach(([lab, v], i) => {
        const u = ease((l - a * 0.1 - i * a * 0.18) / (a * 0.15)); if (u <= 0) return; const y = 290 + i * 96, last = i === b.cmp.length - 1;
        text(ctx, lab, bx - 20, y + 44, 26, { align: "right", weight: 800, color: last ? C.ink : C.ink2 });
        ctx.fillStyle = "#EEF2F4"; rr(ctx, bx, y + 10, bw, 50, 10); ctx.fill();
        ctx.fillStyle = last ? AP[b.hl][2] : "#C7B6E0"; rr(ctx, bx, y + 10, bw * v / max * u, 50, 10); ctx.fill();
        text(ctx, String(v), bx + bw * v / max * u + 14, y + 47, 34, { weight: 900, color: last ? C.accentDark : C.ink2 });
      });
    },
    k13_fcfs(ctx, b, l) {
      heading(ctx, "TANPA GILIRAN ATAU DENGAN GILIRAN BERPUTAR?");
      const a = b.audio || b.dur, F = ["V", "V", "V", "V", "V", "V", "V", "V", "C", "C", "M", "M", "M"], R = VARS.v3;
      const draw = (y, slots, done, title, note, u) => {
        text(ctx, title, 140, y - 22, 24, { weight: 900, color: C.ink });
        strip(ctx, slots, u * 13, { done, hl: "C", y, x0: 140, n: 13, label: false, h: 70 });
        if (u >= 1) { card(ctx, 1600, y - 4, 200, 78, { fill: note[1] ? C.goodBg : C.badBg, stroke: note[1] ? C.good : C.bad, lw: 3, r: 14 }); text(ctx, note[0], 1700, y + 48, 28, { align: "center", weight: 900, color: note[1] ? C.good : C.bad }); }
      };
      // lebar kotak 110 dari x 140 → 13 kotak sampai x 1570
      draw(270, F, { V: 8, C: 10, M: 13 }, "Tanpa giliran: video dikerjakan sampai selesai dulu", ["Chat: 10", false], clamp((l - a * 0.05) / (a * 0.3), 0, 1));
      draw(470, R.slots, R.done, "Dengan giliran berputar", ["Chat: 5", true], clamp((l - a * 0.45) / (a * 0.3), 0, 1));
      if (l > a * 0.8) { card(ctx, 360, 660, 1200, 84, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "Proses berat tidak menguasai prosesor; proses ringan tetap lancar.", 960, 714, 30, { align: "center", weight: 900, color: C.accentDark }); }
    },
    // ---------- memori ----------
    k13_ram(ctx, b, l) {
      heading(ctx, "VARIASI 4 · RAM PENUH");
      const a = b.audio || b.dur, n = b.ask ? 3 : clamp(Math.floor((l - a * 0.3) / (a * 0.14)) + 1, 0, 3);
      const al = [{ app: AP.M, start: 0, size: 2 }, { app: AP.C, start: 2, size: 2 }, { app: AP.B, start: 4, size: 3 }].slice(0, n);
      O.memmap(ctx, 260, 250, 1400, 130, 8, al, { title: "RAM LAPTOP: 8 BLOK" });
      if (n >= 3) { text(ctx, "kosong", 260 + 7.5 * 175, 325, 26, { align: "center", weight: 900, color: C.muted }); }
      if (!b.ask && l > a * 0.12) text(ctx, "satu blok = satu potong RAM", 1660, 230, 22, { align: "right", weight: 700, color: C.ink2 });
      if (n >= 3 && !b.ask) { card(ctx, 560, 480, 800, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "terpakai 7 blok, kosong 1 blok", 960, 538, 34, { align: "center", weight: 900, color: C.accentDark }); }
      if (b.ask) {
        O.proc(ctx, 560, 520, 420, AP.K, { sub: "butuh 2 blok", on: true });
        arrowIcon(ctx, "up", 560, 450, 32, C.accent);
        text(ctx, "?", 840, 545, 80, { align: "center", weight: 900, color: C.accent });
        card(ctx, 960, 470, 760, 120, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
        text(ctx, "Pekerjaan (irisan):", 990, 515, 24, { weight: 900, color: C.ink2 });
        text(ctx, "Musik 3 + Chat 2 + Browser 2 + Kamera 3 = 10", 990, 560, 28, { weight: 900 });
      }
    },
    k13_swap(ctx, b, l) {
      heading(ctx, "KAMERA TIDAK MUAT: SWAP");
      const a = b.audio || b.dur, u1 = ease((l - a * 0.3) / (a * 0.22)), u2 = ease((l - a * 0.5) / (a * 0.22)), ks = clamp((l - a * 0.55) / (a * 0.35), 0, 0.999);
      const V = VARS.v4;
      rows(ctx, V, V4.mslots, V4.mdone, 3 + ks * 2, { w: 560, blok: true, sqx: 220 });
      cpu(ctx, 860, 380, ks > 0 ? "S" : null, ks, ks > 0 ? "irisan ke-" + (ks < 0.5 ? 4 : 5) : "");
      const RX = 1060, RW = 740, bw = RW / 8;
      const al = [{ app: AP.C, start: 2, size: 2 }, { app: AP.B, start: 4, size: 3 }];
      if (u1 < 0.02) al.push({ app: AP.M, start: 0, size: 2, hl: l > a * 0.12 });
      if (u2 >= 0.98) al.push({ app: AP.K, start: 0, size: 2 });
      O.memmap(ctx, RX, 240, RW, 110, 8, al, { title: "RAM: 8 BLOK" });
      card(ctx, RX, 440, RW, 150, { fill: "#F7FAF8", stroke: "#7B8B95", lw: 3, r: 14 }); text(ctx, "PENYIMPANAN (jauh lebih lambat)", RX + 20, 476, 20, { weight: 900, color: C.ink2 });
      // chip yang bergerak: Musik keluar, Kamera masuk
      const chip = (id, x, y) => { ctx.fillStyle = AP[id][2]; rr(ctx, x, y, 2 * bw - 6, 86, 8); ctx.fill(); text(ctx, AP[id][0] + " " + AP[id][1], x + bw - 3, y + 52, 20, { align: "center", weight: 900, color: "#fff" }); };
      if (u1 >= 0.02) chip("M", lerp(RX + 3, RX + 420, u1), lerp(246, 492, u1));
      if (u2 < 0.98) chip("K", lerp(RX + 40, RX + 3, u2), lerp(492, 246, u2));
      if (l < a * 0.3) { text(ctx, "Kamera butuh 2 blok, kosong hanya 1 ✕", RX + RW / 2, 420, 22, { align: "center", weight: 900, color: C.bad }); }
      else if (u2 < 1) text(ctx, "⇅ swap", RX + RW / 2, 420, 26, { align: "center", weight: 900, color: C.ink2 });
      if (l > a * 0.12 && l < a * 0.5) text(ctx, "paling lama menunggu", RX + bw, 228 - 26, 18, { align: "center", weight: 900, color: C.accentDark });
      strip(ctx, V4.mslots, 3 + ks * 2, { done: V4.mdone });
    },
    k13_mem(ctx, b, l) {
      const V = VARS.v4, N = 18, k = b.full ? N : 3 + prog(b, l, 0.04, 0.9) * (N - 3), n = Math.floor(k), s = Math.min(N, n + 1);
      heading(ctx, b.full ? "VARIASI 4 · HASILNYA" : "VARIASI 4 · SWAP BERULANG");
      rows(ctx, V, V4.mslots, V4.mdone, k, { w: 560, blok: true, sqx: 220 });
      const cur = n < N ? V4.mslots[n] : null;
      cpu(ctx, 860, 380, cur, k - n, cur ? "irisan ke-" + (n + 1) : "semua selesai");
      const RX = 1060, RW = 740, bw = RW / 8;
      if (!b.full) {
        const m = MEM[s];
        O.memmap(ctx, RX, 240, RW, 110, 8, m.ram.map(([id, st]) => ({ app: AP[id], start: st, size: BLOK[id], hl: m.mv && m.mv.in === id })), { title: "RAM: 8 BLOK" });
        card(ctx, RX, 440, RW, 150, { fill: "#F7FAF8", stroke: "#7B8B95", lw: 3, r: 14 }); text(ctx, "PENYIMPANAN (jauh lebih lambat)", RX + 20, 476, 20, { weight: 900, color: C.ink2 });
        m.disk.forEach((id, i) => { ctx.fillStyle = AP[id][2]; rr(ctx, RX + 20 + i * 200, 492, BLOK[id] * 70, 80, 8); ctx.fill(); text(ctx, AP[id][0] + " " + AP[id][1], RX + 20 + i * 200 + BLOK[id] * 35, 540, 19, { align: "center", weight: 900, color: "#fff" }); });
        if (m.mv) text(ctx, "⇅ swap: " + (m.mv.out ? AP[m.mv.out][1] + " keluar, " : "") + AP[m.mv.in][1] + " masuk", RX + RW / 2, 420, 22, { align: "center", weight: 900, color: C.bad });
      } else {
        card(ctx, RX, 200, RW, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
        const a = b.audio || b.dur;
        [["bekerja", "10 irisan", C.ink], ["menunggu swap (4 × 2)", "8 irisan", C.bad], ["semua selesai di irisan ke-", "18", C.accentDark], ["kalau RAM cukup", "10", C.good]].forEach(([t, v, col], i) => {
          if (l < a * (0.05 + i * 0.16)) return; const y = 230 + i * 88;
          ctx.fillStyle = i === 2 ? "#FFF3D6" : "#F4F6F5"; rr(ctx, RX + 20, y, RW - 40, 72, 12); ctx.fill();
          text(ctx, t, RX + 44, y + 47, 26, { weight: 800 }); text(ctx, v, RX + RW - 44, y + 49, 32, { align: "right", weight: 900, color: col });
        });
      }
      strip(ctx, V4.mslots, k, { done: V4.mdone });
    },
    k13_solusi(ctx, b, l) {
      const V = VARS.v4s, a = b.audio || b.dur, k = clamp((l - a * 0.42) / (a * 0.48), 0, 1) * V.slots.length;
      heading(ctx, V.title);
      O.memmap(ctx, 140, 250, 1000, 110, 8, [{ app: AP.M, start: 0, size: 2 }, { app: AP.C, start: 2, size: 2 }, { app: AP.K, start: 4, size: 2, hl: l < a * 0.42 }], { title: "RAM: 8 BLOK · terpakai 6, kosong 2" });
      const u = ease(l / (a * 0.25));
      ctx.save(); ctx.globalAlpha = 1 - 0.6 * u; O.proc(ctx, 380, 480, 420, AP.B, { sub: "3 blok" }); ctx.restore();
      if (u > 0.3) { ctx.strokeStyle = C.bad; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(190, 450); ctx.lineTo(570, 510); ctx.moveTo(190, 510); ctx.lineTo(570, 450); ctx.stroke(); text(ctx, "ditutup", 640, 490, 28, { weight: 900, color: C.bad }); }
      if (l > a * 0.3) { card(ctx, 780, 440, 360, 90, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "tanpa swap", 960, 497, 32, { align: "center", weight: 900, color: C.good }); }
      finished(ctx, V, V.done, k, { hl: "K" });
      strip(ctx, V.slots, k, { done: V.done, hl: "K" });
    },
    k13_banding(ctx, b, l) {
      heading(ctx, "MUSIK BUTUH 3 IRISAN. KAPAN IA SELESAI?");
      const a = b.audio || b.dur, M = VARS;
      const sched = [["sendirian", M.v0.slots, 3], ["bersama Chat", M.v1.slots, 5], ["lima proses", M.v2.slots, 11], ["bersama proses berat", M.v3.slots, 8], ["RAM penuh", V4.mslots, 17]];
      const sw = 58, x0 = 520;
      sched.slice(0, b.n).forEach(([lab, sl, fin], i) => {
        const old = b.n === 5 && i < 3, t0 = old ? -1 : a * (0.12 + (i % 3) * 0.24), u = clamp((l - t0) / (a * 0.16), 0, 1); if (u <= 0) return;
        const y = 210 + i * 100; text(ctx, lab, x0 - 24, y + 46, 28, { align: "right", weight: 800 });
        const show = Math.round(fin * u);
        for (let j = 0; j < show; j++) { const id = sl[j]; ctx.fillStyle = id === "M" ? AP.M[2] : id === "S" ? "#8A99A3" : "#DDE4E8"; rr(ctx, x0 + j * sw + 2, y + 8, sw - 4, 56, 8); ctx.fill(); if (id === "M") text(ctx, "🎵", x0 + j * sw + sw / 2, y + 46, 24, { align: "center" }); if (id === "S") text(ctx, "⇄", x0 + j * sw + sw / 2, y + 46, 24, { align: "center", weight: 900, color: "#fff" }); }
        if (u >= 1) text(ctx, String(fin), x0 + fin * sw + 16, y + 50, 38, { weight: 900, color: C.accentDark });
      });
      const ly = 735; [["#8E6BBF", "Musik bekerja"], ["#DDE4E8", "proses lain bekerja"], ["#8A99A3", "menunggu swap"]].forEach(([c, s], i) => { ctx.fillStyle = c; rr(ctx, 520 + i * 400, ly - 26, 34, 34, 6); ctx.fill(); text(ctx, s, 566 + i * 400, ly, 24, { weight: 800, color: C.ink2 }); });
    },
    k13_latihan(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "COBA SENDIRI", 960, 220, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 260, 760, 500, { fill: C.bg2, r: 22 });
      text(ctx, "Halaman latihan E.2", 600, 320, 34, { align: "center", weight: 900 });
      card(ctx, 290, 345, 620, 64, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/e2", 600, 387, 26, { align: "center", weight: 800, color: C.kikoDark });
      const a = b.audio || b.dur, on1 = l > a * 0.15, on2 = l > a * 0.32;
      card(ctx, 290, 440, 300, 60, { fill: on1 ? "#FFF3D6" : "#FFFFFF", stroke: on1 ? C.accent : "#C9D4DB", lw: on1 ? 5 : 2, r: 12 }); text(ctx, "1 Giliran prosesor", 440, 479, 24, { align: "center", weight: 900 });
      card(ctx, 610, 440, 300, 60, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 12 }); text(ctx, "2 Peta memori", 760, 479, 24, { align: "center", weight: 800, color: C.ink2 });
      card(ctx, 290, 530, 360, 64, { fill: on2 ? "#C98A1A" : C.accent, r: 12 }); text(ctx, "▶ Giliran berikutnya", 470, 571, 26, { align: "center", weight: 900, color: "#fff" });
      text(ctx, "tekan berulang, tebak urutan selesai", 600, 650, 24, { align: "center", weight: 700, color: C.ink2 });
      if (l > a * 0.5) {
        card(ctx, 1030, 260, 670, 500, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1365, 320, 34, { align: "center", weight: 900 });
        O.taskman(ctx, 1080, 350, 570, [["Browser (12 tab)", "18%", "3,1 GB"], ["Game", "35%", "2,4 GB"], ["Musik", "2%", "0,3 GB"]]);
        text(ctx, "buka banyak aplikasi, amati RAM", 1365, 720, 24, { align: "center", weight: 700, color: C.ink2 });
      }
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
