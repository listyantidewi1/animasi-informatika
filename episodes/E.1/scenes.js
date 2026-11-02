/* Adegan episode E.1: Komputer Von Neumann. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, komputer.js, vn.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Km = K.komp, V = K.vn, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const MEM = V.initMem(7, 5);
  // jadwal siklus: mulai detik t0, tiap siklus per detik, dari siklus ke-c0; mengembalikan keadaan + token
  const sched = (l, t0, per, c0, cMax, mem = MEM) => {
    if (l < t0) return { st: V.run(mem, c0, 0), tokens: [] };
    const k = Math.floor((l - t0) / per), f = ((l - t0) % per) / per; const c = c0 + k;
    if (c >= cMax) return { st: V.run(mem, cMax, 0), tokens: [] };
    const phase = f < 0.34 ? 1 : f < 0.62 ? 2 : 3; const st = V.run(mem, c, phase); const tokens = [];
    if (phase === 1) tokens.push({ path: V.PATH.memToCpu, u: f / 0.34, label: st.ir.split(" ")[0].slice(0, 1) + "…" });
    if (phase === 3) { const op = st.ir.split(" ")[0]; const u = (f - 0.62) / 0.38; if (op === "MUAT" || op === "TAMBAH" || op === "KURANG") tokens.push({ path: V.PATH.memToCpu, u, label: st.mem[+st.ir.split(" ")[1]] }); if (op === "SIMPAN") tokens.push({ path: V.PATH.cpuToMem, u, label: st.aku }); if (op === "KELUAR") tokens.push({ path: V.PATH.memToOut, u, label: st.out }); }
    return { st, tokens, c, phase };
  };
  const PARTS = [["🧭", "Unit kendali", "membaca instruksi, mengatur"], ["➕", "ALU", "menghitung, membandingkan"], ["🗄️", "Memori", "menyimpan program dan data"], ["⌨️", "Masukan", "pintu masuk data"], ["🖥️", "Keluaran", "pintu keluar hasil"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.1, 5);
      PARTS.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 480 + i * 260; card(ctx, x, 280, 240, 280, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 120, 370, 56, { align: "center" }); text(ctx, t, x + 120, 430, 24, { align: "center", weight: 900 }); para(ctx, s, x + 120, 470, 19, 210, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 5) { ctx.strokeStyle = "#9AAFA6"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(600, 600); ctx.lineTo(1640, 600); ctx.stroke(); text(ctx, "bus", 1120, 640, 22, { align: "center", weight: 900, color: C.ink2 }); banner(ctx, "sejak 1945: lima bagian, satu siklus berulang", 690, 900); }
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.2", "Mengenal Komputer: Perjalanan Satu Ketukan"], ["E.0", "Jembatan ke Kelas X: Empat Bekal dari SMP"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 30, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_peran(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: KOMPUTER MANUSIA, LIMA PERAN");
      const roles = [["Memori", "pegang kartu 0–15", null], ["Unit kendali", "baca kartu, beri perintah", "long"], ["ALU", "menghitung", null], ["Masukan", "memberi angka", "long"], ["Keluaran", "menulis di papan", null]];
      const n = reveal(l, 1.5, 1.4, 5);
      roles.forEach(([t, s, hair], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 330 + i * 320; kid(ctx, x, 520, 130, { hair, point: i === 1 }); ctx.fillStyle = C.kiko; rr(ctx, x - 110, 300, 220, 44, 10); ctx.fill(); text(ctx, t, x, 330, 22, { align: "center", weight: 900, color: "#fff" }); para(ctx, s, x, 680, 20, 220, { align: "center", weight: 700, color: C.ink2 }); if (i === 0) for (let k = 0; k < 4; k++) { ctx.fillStyle = "#FFF9E0"; ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 2; rr(ctx, x - 150 + k * 14, 400 + k * 6, 60, 80, 6); ctx.fill(); ctx.stroke(); } if (i === 4) { ctx.fillStyle = "#1F2A33"; rr(ctx, x + 60, 380, 120, 90, 6); ctx.fill(); text(ctx, "12", x + 120, 440, 36, { align: "center", weight: 900, color: "#fff" }); } ctx.restore(); });
    },
    unplugged_jalan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ATURANNYA KETAT: SATU KARTU TIAP GILIRAN", 215);
      const rules = ["1. Kendali minta satu kartu: \"kartu nomor PC!\"", "2. Memori memberikannya; kendali membacanya keras-keras", "3. Kendali menyuruh satu bagian bekerja", "4. PC naik satu; ulangi sampai BERHENTI"];
      const n = reveal(l, 1.5, 1.6, 4);
      rules.forEach((r, i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 220, 260 + i * 100, 820, 84, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, r, 250, 312 + i * 100, 24, { weight: 800 }); ctx.restore(); });
      [["0", "MUAT 10"], ["1", "TAMBAH 11"], ["2", "SIMPAN 12"], ["3", "KELUAR 12"], ["4", "BERHENTI"], ["10", "7"], ["11", "5"]].forEach(([a, t], i) => { const x = 1100 + (i % 4) * 160, y = 270 + Math.floor(i / 4) * 200; ctx.fillStyle = +a >= 10 ? "#DDF3E4" : "#EDE6F7"; ctx.strokeStyle = +a >= 10 ? C.good : "#8E6BBF"; ctx.lineWidth = 3; rr(ctx, x, y, 140, 160, 10); ctx.fill(); ctx.stroke(); text(ctx, "kartu " + a, x + 70, y + 36, 18, { align: "center", weight: 900, color: C.ink2 }); para(ctx, t, x + 70, y + 100, 24, 120, { align: "center", weight: 900 }); });
      text(ctx, "kartu 0–4: perintah · kartu 10–11: angka", 1400, 700, 20, { align: "center", weight: 800, color: C.ink2 });
    },

    lima_bagian(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 1.0, 2.6, 5);
      V.machine(ctx, V.run(MEM, 0, 0), { labels: true, show: { ctrl: n >= 1, alu: n >= 2, reg: n >= 1, mem: n >= 3, io: n >= 4, bus: n >= 5 } });
      if (n < 5) { const [ic, t, s] = PARTS[Math.max(0, n - 1)]; card(ctx, 1360, 660, 400, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, ic + " " + t + ": " + s, 1560, 715, 18, { align: "center", weight: 900, color: C.accentDark }); }
    },
    memori_terpadu(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 1.0, 2.2, 4);
      V.machine(ctx, V.run(MEM, 0, 0), { show: { ctrl: n >= 4, alu: n >= 4, reg: n >= 4, mem: 1, io: 0, bus: 0 } });
      if (n >= 1) { ctx.strokeStyle = "#8E6BBF"; ctx.lineWidth = 4; rr(ctx, 996, 288, 288, 107, 6); ctx.stroke(); text(ctx, "◀ program: alamat 0–4", 1300, 345, 22, { weight: 900, color: "#8E6BBF" }); }
      if (n >= 2) { ctx.strokeStyle = C.good; ctx.lineWidth = 4; rr(ctx, 996, 498, 288, 44, 6); ctx.stroke(); text(ctx, "◀ data: alamat 10–11", 1300, 525, 22, { weight: 900, color: C.good }); }
      if (n >= 3) { card(ctx, 1320, 580, 440, 100, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); para(ctx, "satu memori untuk program dan data: tiap sel punya alamat", 1540, 620, 20, 400, { align: "center", weight: 900, color: C.accentDark }); }
      if (n >= 4) label(ctx, "register PC · IR · AKU: kotak kecil yang sangat cepat", 560, 680, { size: 22 });
    },
    siklus(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SATU SIKLUS MESIN: TIGA LANGKAH, LALU PC + 1", 215);
      const n = reveal(l, 1.5, 3.2, 3);
      V.cycle(ctx, 960, 520, 210, n - 1, { center: l > 12 ? "PC + 1 ↺" : "" });
      [["PC", "penghitung program: alamat instruksi berikutnya"], ["IR", "register instruksi: instruksi yang sedang dikerjakan"], ["AKU", "akumulator: tempat hasil hitung"]].forEach(([k, s], i) => { card(ctx, 190, 300 + i * 110, 340, 90, { fill: C.bg2, r: 12 }); text(ctx, k, 230, 355 + i * 110, 28, { weight: 900, color: C.kiko }); para(ctx, s, 300, 335 + i * 110, 17, 220, { weight: 700, color: C.ink2 }); });
    },
    siklus_contoh(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const r = sched(l, 1.0, 10.5, 0, 1);
      V.machine(ctx, r.st, { tokens: r.tokens, pcArrow: true });
      const ph = r.phase || (l >= 11.5 ? 4 : 0); const txt = ["", "AMBIL: isi alamat 0 → IR", "TERJEMAHKAN: MUAT = salin memori ke AKU", "JALANKAN: isi alamat 10 (7) → AKU", "PC + 1 → siklus berikutnya"][ph];
      if (txt) { card(ctx, 1360, 660, 400, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); para(ctx, txt, 1560, 695, 18, 370, { align: "center", weight: 900, color: C.accentDark }); }
    },

    program(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      V.machine(ctx, V.run(MEM, 0, 0), { pcArrow: true, guess: l > 11 });
      const n = reveal(l, 1.5, 1.4, 7);
      card(ctx, 230, 300, 660, 300, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); text(ctx, "PROGRAM", 260, 335, 20, { weight: 900, color: C.ink2 });
      V.PROG.forEach((p, i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.15; text(ctx, i + "  " + p, 270, 380 + i * 42, 26, { weight: 900, color: "#8E6BBF" }); ctx.restore(); });
      [["10", "7"], ["11", "5"]].forEach(([a, v], i) => { ctx.save(); if (i + 5 >= n) ctx.globalAlpha = 0.15; text(ctx, a + "  " + v, 600, 380 + i * 42, 26, { weight: 900, color: C.good }); ctx.restore(); });
      text(ctx, "data", 600, 345, 18, { weight: 900, color: C.ink2 });
      if (l > 11) label(ctx, "tebak dulu: apa yang muncul di layar?", 1560, 740, { size: 22 });
    },
    jalan12(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const r = sched(l, 0.8, 5.2, 0, 2);
      V.machine(ctx, r.st, { tokens: r.tokens, pcArrow: true });
      const c = r.c == null ? (l >= 11.2 ? 2 : 0) : r.c; const ph = r.phase || 0;
      const txt = c === 0 ? ["", "siklus 1 · AMBIL: MUAT 10", "siklus 1 · TERJEMAHKAN", "siklus 1 · JALANKAN: AKU ← 7"][ph] : c === 1 ? ["", "siklus 2 · AMBIL: TAMBAH 11", "siklus 2 · TERJEMAHKAN", "siklus 2 · JALANKAN: 7 + 5 → AKU"][ph] : "AKU = 12, PC = 2";
      if (txt) { card(ctx, 1360, 660, 400, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, txt, 1560, 710, 20, { align: "center", weight: 900, color: C.accentDark }); }
    },
    jalan345(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const r = sched(l, 0.8, 3.8, 2, 5);
      V.machine(ctx, r.st, { tokens: r.tokens, pcArrow: true });
      const c = r.c == null ? (l >= 12.2 ? 5 : 2) : r.c; const ph = r.phase || 0;
      const names = { 2: "siklus 3 · SIMPAN 12: AKU → alamat 12", 3: "siklus 4 · KELUAR 12: alamat 12 → layar", 4: "siklus 5 · BERHENTI" };
      const txt = c >= 5 ? "lima instruksi, lima siklus, satu angka di layar" : (ph ? names[c] : "");
      if (txt) { card(ctx, 1360, 660, 400, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); para(ctx, txt, 1560, 695, 18, 370, { align: "center", weight: 900, color: C.accentDark }); }
    },
    ganti_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PROGRAM SAMA, DATA BERBEDA", 215);
      card(ctx, 700, 260, 520, 280, { fill: "#EDE6F7", stroke: "#8E6BBF", lw: 3, r: 14 }); text(ctx, "PROGRAM (tidak disentuh)", 960, 295, 20, { align: "center", weight: 900, color: "#8E6BBF" });
      V.PROG.forEach((p, i) => text(ctx, i + "  " + p, 760, 340 + i * 38, 24, { weight: 900 }));
      const n = reveal(l, 1.0, 3.5, 2);
      [["SEBELUM", 7, 5, 12, C.ink2], ["SESUDAH", 7, 9, 16, C.good]].forEach(([t, a, bb, out, col], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 220 + i * 1020; card(ctx, x, 260, 440, 400, { fill: C.bg2, r: 16 }); text(ctx, t, x + 220, 300, 24, { align: "center", weight: 900, color: col });
        [["10", a], ["11", bb]].forEach(([ad, v], k) => { card(ctx, x + 40, 330 + k * 70, 360, 56, { fill: k === 1 && i === 1 ? "#FFF3D6" : "#fff", stroke: k === 1 && i === 1 ? C.accent : "#B7C4CC", lw: 3, r: 10 }); text(ctx, "alamat " + ad, x + 60, 366 + k * 70, 22, { weight: 800, color: C.ink2 }); text(ctx, String(v), x + 380, 368 + k * 70, 30, { align: "right", weight: 900 }); });
        arrowIcon(ctx, "down", x + 220, 490, 30, C.ink2);
        card(ctx, x + 120, 530, 200, 100, { fill: "#1F2A33", r: 10 }); text(ctx, String(out), x + 220, 598, 56, { align: "center", weight: 900, color: i ? "#8FD0E6" : "#fff" }); ctx.restore(); });
      if (n >= 2) label(ctx, "kekuatan program tersimpan: ganti data, bukan mesin", 960, 720, { size: 26 });
    },

    bus_detak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BUS: TIGA JALUR · DETAK: TEMPO", 215);
      const n = reveal(l, 1.5, 2.0, 3);
      card(ctx, 220, 270, 200, 300, { fill: "#F7FAF8", stroke: C.kiko, lw: 3, r: 14 }); text(ctx, "CPU", 320, 430, 30, { align: "center", weight: 900, color: C.kiko });
      card(ctx, 1000, 270, 200, 300, { fill: "#F7FAF8", stroke: "#8E6BBF", lw: 3, r: 14 }); text(ctx, "MEMORI", 1100, 430, 26, { align: "center", weight: 900, color: "#8E6BBF" });
      [["jalur alamat", "sel nomor berapa?", "11"], ["jalur data", "isinya: 5", "5"], ["jalur kendali", "baca / tulis", "BACA"]].forEach(([t, s, tok], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 320 + i * 100; ctx.strokeStyle = ["#2E7E9A", "#F2B134", "#D9443B"][i]; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(420, y); ctx.lineTo(1000, y); ctx.stroke(); text(ctx, t + ": " + s, 710, y - 20, 22, { align: "center", weight: 900 }); if (i === n - 1) { const u = ((l - 1.5) % 2) / 2; const x = lerp(440, 980, i === 1 ? 1 - u : u); ctx.fillStyle = "#fff"; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; rr(ctx, x - 34, y - 18, 68, 36, 8); ctx.fill(); ctx.stroke(); text(ctx, tok, x, y + 8, 18, { align: "center", weight: 900 }); } ctx.restore(); });
      if (n >= 3) text(ctx, "satu pesan tiap kali", 710, 600, 22, { align: "center", weight: 800, color: C.ink2 });
      if (l > 8) { card(ctx, 1280, 270, 460, 330, { fill: C.bg2, r: 16 }); text(ctx, "DETAK (CLOCK)", 1510, 310, 22, { align: "center", weight: 900, color: C.kiko }); V.clockWave(ctx, 1310, 420, 400, 5, l * 3); text(ctx, "3 GHz = 3 miliar detak", 1510, 520, 24, { align: "center", weight: 900 }); text(ctx, "tiap detik", 1510, 555, 22, { align: "center", weight: 700, color: C.ink2 }); }
    },
    perangkat_nyata(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DI PERANGKATMU", 215);
      const n = reveal(l, 1.0, 1.6, 4);
      const items = [["CPU", "cip kecil di papan utama", (x, y) => Km.chip(ctx, x, y, 90)], ["Memori", "keping RAM", (x, y) => Km.ram(ctx, x - 110, y - 30, 220, 60)], ["Masukan", "layar sentuh, keyboard", (x, y) => D.keyboard(ctx, x - 110, y - 30, 220, {})], ["Keluaran", "layar, speaker", (x, y) => { ctx.fillStyle = "#1F2A33"; rr(ctx, x - 90, y - 55, 180, 110, 8); ctx.fill(); ctx.fillStyle = "#8FD0E6"; rr(ctx, x - 80, y - 45, 160, 90, 4); ctx.fill(); }]];
      items.forEach(([t, s, d], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 300; card(ctx, x, 270, 270, 300, { fill: C.bg2, r: 16 }); d(x + 135, 380); text(ctx, t, x + 135, 500, 26, { align: "center", weight: 900 }); text(ctx, s, x + 135, 535, 18, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (l > 8) { const sc = D.phone(ctx, 1560, 450, 200, 330); text(ctx, "📱", 1560, 470, 70, { align: "center" }); text(ctx, "HP = komputer", 1560, 540, 20, { align: "center", weight: 900 }); text(ctx, "Von Neumann", 1560, 566, 20, { align: "center", weight: 900 }); }
      if (l > 11) label(ctx, "video ini: miliaran siklus kecil seperti tadi", 960, 700, { size: 26 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Jalankan dan amati", "tebak PC dan AKU, lalu Langkah", (x, y) => { [["PC", "1"], ["IR", "MUAT 10"], ["AKU", "7"]].forEach(([k, v], i) => { card(ctx, x - 200 + i * 135, y - 80, 125, 90, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, k, x - 138 + i * 135, y - 52, 16, { align: "center", weight: 900, color: C.ink2 }); text(ctx, v, x - 138 + i * 135, y - 12, 22, { align: "center", weight: 900 }); }); card(ctx, x - 100, y + 30, 200, 50, { fill: C.kiko, r: 10 }); text(ctx, "▶ Langkah", x, y + 63, 22, { align: "center", weight: 900, color: "#fff" }); }],
        ["Ubah datanya", "supaya layar menampilkan 20", (x, y) => { [["10", "?"], ["11", "?"]].forEach(([a, v], i) => { card(ctx, x - 190, y - 90 + i * 60, 240, 50, { fill: "#DDF3E4", stroke: C.good, lw: 2, r: 10 }); text(ctx, "alamat " + a + ":  " + v, x - 170, y - 57 + i * 60, 22, { weight: 900 }); }); card(ctx, x + 70, y - 90, 120, 110, { fill: "#1F2A33", r: 10 }); text(ctx, "20", x + 130, y - 20, 44, { align: "center", weight: 900, color: "#fff" }); }],
        ["Susun program", "mengurangkan dua angka", (x, y) => ["MUAT 10", "KURANG 11", "SIMPAN 12", "KELUAR 12", "BERHENTI"].forEach((p, i) => { card(ctx, x - 190, y - 100 + i * 46, 380, 40, { fill: i === 1 ? "#FFF3D6" : "#fff", stroke: i === 1 ? C.accent : "#B7C4CC", lw: 2, r: 8 }); text(ctx, i + "  " + p, x - 170, y - 72 + i * 46, 20, { weight: 900, color: "#8E6BBF" }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "simulator komputer mini di halaman latihan episode ini", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
