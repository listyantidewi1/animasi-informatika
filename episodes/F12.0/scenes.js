/* Adegan episode F12.0: Jembatan Kelas XII (perulangan, list, fungsi). Gaya diagram Fase F.
   Muat setelah kiko-core.js, kiko-devices.js, memori.js (D9.1), py.js (F11.0). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Mm = K.memori, Py = K.py, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, rr, clamp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 665, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 32, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.2; fn(); ctx.restore(); };
  // list Python berindeks nol: values[], opt.hl indeks (0-based), opt.name, opt.w, opt.add (indeks kotak baru), opt.ghost (indeks kosong bertanda ?)
  const pyList = (ctx, x, y, values, opt = {}) => {
    const w = opt.w || 120, h = opt.h || 70, g = 10;
    if (opt.name) text(ctx, opt.name, x, y - 16, 24, { weight: 900, color: C.kiko });
    values.forEach((v, i) => { const cx = x + i * (w + g); const on = opt.hl === i, nw = opt.add === i, seen = opt.seen != null && i < opt.seen;
      ctx.fillStyle = on ? "#FFF3D6" : nw ? C.goodBg : seen ? "#EEF3F6" : "#fff"; rr(ctx, cx, y, w, h, 10); ctx.fill(); ctx.strokeStyle = on ? C.accent : nw ? C.good : "#B7C4CC"; ctx.lineWidth = on || nw ? 5 : 3; rr(ctx, cx, y, w, h, 10); ctx.stroke();
      text(ctx, String(v), cx + w / 2, y + h / 2 + 10, opt.size || 28, { align: "center", weight: 900 }); text(ctx, String(i), cx + w / 2, y + h + 30, 22, { align: "center", weight: 900, color: on ? C.accentDark : C.ink2 }); });
    if (opt.ghost != null) { const cx = x + opt.ghost * (w + g); ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = C.bad; ctx.lineWidth = 3; rr(ctx, cx, y, w, h, 10); ctx.stroke(); ctx.restore(); text(ctx, "?", cx + w / 2, y + h / 2 + 10, 30, { align: "center", weight: 900, color: C.bad }); text(ctx, String(opt.ghost), cx + w / 2, y + h + 30, 22, { align: "center", weight: 900, color: C.bad }); }
    if (opt.idxLabel !== false) text(ctx, "indeks", x - 14, y + h + 30, 18, { align: "right", weight: 800, color: C.ink2 });
  };
  // trace table kecil: head [..], rows [[..]], opt.cw lebar kolom
  const trace = (ctx, x, y, head, rows, total, opt = {}) => {
    const cw = opt.cw || 150, rh = opt.rh || 46, W = cw * head.length; card(ctx, x, y, W, rh * (total + 1), { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 10 });
    ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 10); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    head.forEach((h, c) => text(ctx, h, x + c * cw + cw / 2, y + rh / 2 + 8, 20, { align: "center", weight: 900, color: C.ink2 }));
    rows.forEach((r, i) => { const ry = y + rh * (i + 1); if (i === rows.length - 1 && opt.hlLast) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 2, ry, W - 4, rh); } r.forEach((v, c) => text(ctx, String(v), x + c * cw + cw / 2, ry + rh / 2 + 8, 22, { align: "center", weight: c === r.length - 1 ? 900 : 700 })); });
  };
  const arrow = (ctx, x1, y1, x2, y2, col = C.kiko, lw = 6) => { ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); const a = Math.atan2(y2 - y1, x2 - x1); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 20 * Math.cos(a - 0.45), y2 - 20 * Math.sin(a - 0.45)); ctx.lineTo(x2 - 20 * Math.cos(a + 0.45), y2 - 20 * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill(); };
  const KARTU = [70, 85, 60, 90, 75];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.6, 3);
      [["🔁", "perulangan", "for · while · range"], ["📚", "list", "indeks mulai dari 0"], ["🧩", "fungsi", "def · parameter · return"]].forEach(([ic, t, s], i) => dim(ctx, i < n, () => { const x = 540 + i * 400; card(ctx, x, 260, 370, 300, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 185, 360, 64, { align: "center" }); text(ctx, t, x + 185, 440, 30, { align: "center", weight: 900 }); text(ctx, s, x + 185, 490, 22, { align: "center", weight: 800, color: C.ink2 }); }));
      if (n >= 3) banner(ctx, "bukan ulangan: diagnostik, lalu peta kelas XII", 620, 1000);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "KALAU PERLU MENGULANG", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.2", "Dari Pseudocode ke Kode"], ["F11.3", "Algoritma Standar dalam Kode dan Kualitas Program"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "kuis diagnostik di halaman latihan memberi tahu bagian mana", 960, 690, { size: 24, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_list(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: LIST MANUSIA");
      const n = reveal(l, 3.0, 4.0, 3); // 1 nomor, 2 panggil nomor 2, 3 perulangan
      const loopI = n >= 3 ? Math.floor((l - 11) / 0.9) % 5 : -1;
      KARTU.forEach((v, i) => { const x = 440 + i * 260; const up = (n === 2 && i === 2) || loopI === i; kid(ctx, x, 560, 120, i % 2 ? { hair: "long" } : {});
        Mm.numCard(ctx, x - 35, up ? 300 : 360, v, up ? { fill: "#FFF3D6", stroke: C.accent } : {});
        if (n >= 1) { ctx.fillStyle = up ? C.accent : C.kiko; ctx.beginPath(); ctx.arc(x, 715, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i), x, 724, 24, { align: "center", weight: 900, color: "#fff" }); } });
      if (n >= 1) text(ctx, "nomor dimulai dari 0", 300, 724, 20, { align: "center", weight: 900, color: C.kiko });
      if (n === 2) label(ctx, "\"nomor 2, angkat kartumu!\" → 60", 960, 280, { size: 26 });
      if (n >= 3) label(ctx, "\"dari kiri, satu per satu\": itulah perulangan", 960, 280, { size: 26 });
    },
    unplugged_fungsi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: SATU TEMAN MENJADI FUNGSI");
      const n = reveal(l, 1.5, 3.0, 4);
      kid(ctx, 330, 520, 130, { point: true }); text(ctx, "pemanggil", 330, 700, 22, { align: "center", weight: 900, color: C.ink2 });
      dim(ctx, n >= 1, () => { [3, 5, 4].forEach((v, i) => Mm.numCard(ctx, 480 + i * 80, 300, v)); text(ctx, "yang diberikan: parameter", 600, 430, 22, { align: "center", weight: 900, color: C.kiko }); arrow(ctx, 720, 345, 790, 345); });
      ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = C.kiko; ctx.lineWidth = 4; rr(ctx, 800, 255, 420, 445, 24); ctx.stroke(); ctx.restore();
      text(ctx, "fungsi jumlahkan", 1010, 300, 24, { align: "center", weight: 900, color: C.kiko });
      kid(ctx, 1010, 570, 110, { hair: "long" });
      dim(ctx, n >= 3, () => { ctx.fillStyle = "rgba(31,42,51,0.82)"; rr(ctx, 830, 320, 360, 120, 16); ctx.fill(); text(ctx, "3 + 5 + 4", 1010, 375, 30, { align: "center", weight: 900, color: "#fff" }); text(ctx, "caranya: urusan fungsi", 1010, 415, 18, { align: "center", weight: 800, color: "#8FD0E6" }); });
      dim(ctx, n >= 2, () => { arrow(ctx, 1230, 470, 1380, 470, C.good); Mm.numCard(ctx, 1400, 420, 12, { fill: C.goodBg, stroke: C.good }); text(ctx, "yang dikembalikan: satu hasil", 1440, 560, 22, { align: "center", weight: 900, color: C.good }); text(ctx, "(return)", 1440, 592, 20, { align: "center", weight: 800, color: C.good }); });
      if (n >= 4) label(ctx, "pemanggil cukup tahu: apa yang diberikan, apa yang dikembalikan", 960, 745, { size: 24 });
    },
    for_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 1 · PERULANGAN FOR DAN RANGE");
      const k = reveal(l, 3.5, 1.5, 7); // 1..5 putaran, 6 print, 7 akhir
      const hl = k === 0 ? 1 : k <= 5 ? 2 : 3;
      Py.code(ctx, 220, 260, 700, [{ t: "total = 0" }, { t: "for i in range(1, 6):", hl: hl === 1 }, { t: "    total = total + i", hl: hl === 2 }, { t: "print(total)", hl: hl === 3 }], { rh: 52, size: 26 });
      text(ctx, "range(1, 6)", 1000, 290, 26, { weight: 900, color: C.kiko });
      [1, 2, 3, 4, 5, 6].forEach((v, i) => { const x = 1000 + i * 108; const on = k >= 1 && k <= 5 && v === k, out = v === 6; ctx.fillStyle = out ? C.badBg : on ? "#FFF3D6" : v <= Math.min(k, 5) ? C.goodBg : "#fff"; rr(ctx, x, 310, 92, 70, 10); ctx.fill(); ctx.strokeStyle = out ? C.bad : on ? C.accent : "#B7C4CC"; ctx.lineWidth = on || out ? 5 : 3; rr(ctx, x, 310, 92, 70, 10); ctx.stroke(); text(ctx, String(v), x + 46, 358, 30, { align: "center", weight: 900, color: out ? C.bad : C.ink });
        if (out) { ctx.strokeStyle = C.bad; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 12, 322); ctx.lineTo(x + 80, 368); ctx.stroke(); text(ctx, "tidak ikut", x + 46, 410, 18, { align: "center", weight: 900, color: C.bad }); } });
      const rows = []; let t = 0; for (let i = 1; i <= Math.min(k, 5); i++) { t += i; rows.push([i, t]); }
      text(ctx, "trace table", 1000, 460, 22, { weight: 900, color: C.ink2 });
      trace(ctx, 1000, 476, ["i", "total"], [["awal", 0], ...rows], 6, { cw: 160, rh: 38, hlLast: k >= 1 && k <= 5 });
      if (k >= 6) { Py.console(ctx, 220, 545, 700, [["15", "out"]]); label(ctx, "lima putaran: i = 1 sampai 5", 570, 700, { size: 26, color: C.good }); }
    },
    while_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 1 · PERULANGAN WHILE");
      const k = reveal(l, 3.0, 1.6, 6); // 1..4 putaran, 5 berhenti, 6 infinite loop
      const bad = k >= 6;
      const saldo = bad ? 100000 : 100000 - 25000 * Math.min(k, 4);
      Py.code(ctx, 220, 260, 760, [{ t: "saldo = 100000" }, { t: "minggu = 0" }, { t: "while saldo > 0:", hl: !bad && (k === 0 || k === 5) }, { t: bad ? "    (baris ini lupa ditulis)" : "    saldo = saldo - 25000", hl: !bad && k >= 1 && k <= 4, bad }, { t: "    minggu = minggu + 1", hl: !bad && k >= 1 && k <= 4 }, { t: "print(minggu)" }], { rh: 50, size: 24 });
      if (bad) { text(ctx, "putaran", 1060, 288, 20, { weight: 800, color: C.ink2 }); text(ctx, "1, 2, 3, 4, 5, 6, … tidak berhenti", 1060, 330, 26, { weight: 900, color: C.bad }); } else Mm.rounds(ctx, 1060, 300, 4, Math.min(k, 4), { label: "putaran" });
      text(ctx, "saldo", 1060, 420, 22, { weight: 900, color: C.ink2 });
      ctx.fillStyle = "#E1E8E4"; rr(ctx, 1060, 436, 600, 50, 12); ctx.fill(); ctx.fillStyle = C.good; if (saldo > 0) { rr(ctx, 1060, 436, 600 * saldo / 100000, 50, 12); ctx.fill(); }
      text(ctx, "Rp" + saldo.toLocaleString("id-ID"), 1660, 420, 24, { align: "right", weight: 900 });
      if (k === 5) { card(ctx, 1060, 520, 620, 100, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "saldo > 0 salah → berhenti", 1370, 565, 26, { align: "center", weight: 900, color: C.good }); text(ctx, "print(minggu) → 4", 1370, 600, 20, { align: "center", weight: 800 }); }
      if (bad) { card(ctx, 1060, 520, 620, 120, { fill: C.badBg, stroke: C.bad, lw: 4, r: 14 }); text(ctx, "lupa mengurangi saldo?", 1370, 562, 24, { align: "center", weight: 900, color: C.bad }); text(ctx, "saldo > 0 selalu benar: infinite loop", 1370, 604, 22, { align: "center", weight: 900, color: C.bad }); }
    },
    list_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 2 · LIST: INDEKS MULAI DARI NOL");
      const n = reveal(l, 1.5, 2.4, 5); // 1 buat, 2 nilai[0], 3 len, 4 append, 5 IndexError
      const lines = [{ t: "nilai = [80, 60, 90]", hl: n === 1 }, { t: "print(nilai[0])", hl: n === 2 }, { t: "print(len(nilai))", hl: n === 3 }, { t: "nilai.append(75)", hl: n === 4 }, { t: "print(nilai[5])", bad: n >= 5 }];
      Py.code(ctx, 220, 260, 680, lines.slice(0, Math.max(1, n)), { rh: 50, size: 24 });
      const vals = n >= 4 ? [80, 60, 90, 75] : [80, 60, 90];
      pyList(ctx, 1040, 300, vals, { name: "nilai", w: 110, hl: n === 2 ? 0 : null, add: n === 4 ? 3 : null, ghost: n >= 5 ? 5 : null });
      const out = n === 2 ? [["80", "out"]] : n === 3 ? [["3", "out"]] : n === 4 ? [["(nilai sekarang berisi 4)", "out"]] : [];
      if (out.length) Py.console(ctx, 1040, 460, 640, out);
      if (n >= 5) Py.error(ctx, 1040, 460, 640, "IndexError", ["list index out of range", "indeks 5 tidak ada: hanya 0 sampai 3"]);
    },
    list_loop(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LIST + PERULANGAN: MENCARI NILAI TERBESAR");
      const k = reveal(l, 2.0, 1.5, 7); // 1 anggap pertama, 2..6 bandingkan indeks 0..4, 7 hasil
      const i = k >= 2 && k <= 6 ? k - 2 : null;
      let best = KARTU[0]; const upto = i == null ? (k >= 7 ? 5 : 0) : i + 1; for (let j = 0; j < upto; j++) if (KARTU[j] > best) best = KARTU[j];
      const changed = i != null && i > 0 && KARTU[i] > Math.max(...KARTU.slice(0, i));
      const hl = k === 1 ? 1 : i != null ? (changed ? 4 : 3) : k >= 7 ? 5 : -1;
      Py.code(ctx, 220, 260, 740, [{ t: "nilai = [70, 85, 60, 90, 75]" }, { t: "terbesar = nilai[0]", hl: hl === 1 }, { t: "for n in nilai:", hl: false }, { t: "    if n > terbesar:", hl: hl === 3 }, { t: "        terbesar = n", hl: hl === 4 }, { t: "print(terbesar)", hl: hl === 5 }], { rh: 50, size: 24 });
      pyList(ctx, 1040, 300, KARTU, { name: "nilai", w: 110, hl: i, seen: i == null ? (k >= 7 ? 5 : null) : i });
      Mm.board(ctx, 1040, 440, 640, [{ name: "n", value: i == null ? (k >= 7 ? KARTU[4] : null) : KARTU[i] }, { name: "terbesar", value: k >= 1 ? best : null, changed: changed || k === 1 }], { bw: 280, bh: 100 });
      if (k >= 7) { Py.console(ctx, 220, 630, 740, [["90", "out"]]); label(ctx, "algoritma standar dari F11.3", 1360, 690, { size: 24 }); }
    },
    fungsi_recall(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 3 · FUNGSI: DEF, PARAMETER, RETURN");
      const n = reveal(l, 1.5, 2.6, 4); // 1 def, 2 return, 3 panggil A, 4 panggil B
      Py.code(ctx, 220, 260, 860, [{ t: "def rata_rata(daftar):", hl: n === 1 }, { t: "    return sum(daftar) / len(daftar)", hl: n === 2 }, { t: "" }, { t: "a = rata_rata([80, 90, 70])", hl: n === 3 }, { t: "b = rata_rata([60, 75])", hl: n === 4 }], { rh: 50, size: 24 });
      const call = n >= 4 ? ["[60, 75]", "67.5", "nilai XII B"] : ["[80, 90, 70]", "80.0", "nilai XII A"];
      if (n >= 3) { text(ctx, call[2] + ": " + call[0], 1290, 300, 26, { align: "center", weight: 900 }); text(ctx, "masuk sebagai parameter daftar", 1290, 334, 20, { align: "center", weight: 800, color: C.kiko }); arrow(ctx, 1290, 346, 1290, 384, C.kiko); }
      dim(ctx, n >= 1, () => { card(ctx, 1140, 392, 300, 150, { fill: "#F4F0FA", stroke: "#8E6BBF", lw: 4, r: 18 }); text(ctx, "rata_rata", 1290, 462, 30, { align: "center", weight: 900, color: "#8E6BBF" }); text(ctx, "fungsi", 1290, 500, 20, { align: "center", weight: 800, color: C.ink2 }); });
      dim(ctx, n >= 2, () => { arrow(ctx, 1450, 467, 1540, 467, C.good); text(ctx, "return", 1495, 448, 18, { align: "center", weight: 900, color: C.good }); });
      if (n >= 3) { card(ctx, 1550, 430, 190, 74, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, call[1], 1645, 479, 30, { align: "center", weight: 900, color: C.good }); }
      if (n >= 4) label(ctx, "ditulis sekali, dipanggil berkali-kali", 650, 640, { size: 26 });
    },
    print_return(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "JEBAKAN: PRINT ATAU RETURN?");
      const n = reveal(l, 1.5, 2.8, 4);
      dim(ctx, n >= 1, () => { text(ctx, "hanya mencetak", 560, 275, 26, { align: "center", weight: 900, color: C.bad }); Py.code(ctx, 220, 290, 680, [{ t: "def luas_cetak(p, l):" }, { t: "    print(p * l)" }, { t: "x = luas_cetak(4, 3)", hl: n >= 2 }], { rh: 46, size: 22 }); Py.console(ctx, 220, 495, 320, [["12", "out"]]); });
      dim(ctx, n >= 2, () => Mm.board(ctx, 560, 495, 340, [{ name: "x", value: "None", hl: true }], { bw: 300, bh: 110, h: 190, title: "ISI VARIABEL" }));
      dim(ctx, n >= 3, () => { text(ctx, "mengembalikan", 1360, 275, 26, { align: "center", weight: 900, color: C.good }); Py.code(ctx, 1020, 290, 680, [{ t: "def luas(p, l):" }, { t: "    return p * l" }, { t: "x = luas(4, 3)", hl: n >= 3 }], { rh: 46, size: 22 }); Py.console(ctx, 1020, 495, 320, [["(tidak tampil)", "out"]]); Mm.board(ctx, 1360, 495, 340, [{ name: "x", value: 12, changed: true }], { bw: 300, bh: 110, h: 190, title: "ISI VARIABEL" }); });
      if (n >= 4) label(ctx, "pakai return bila hasilnya masih akan diolah", 960, 730, { size: 26 });
    },
    dict_teaser(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL TAMBAHAN DARI F11.10: DICTIONARY");
      const n = reveal(l, 1.5, 2.8, 4);
      Py.code(ctx, 220, 260, 780, [{ t: 'stok = {"teh": 12, "roti": 5, "susu": 8}', hl: n === 1 }, { t: 'print(stok["teh"])', hl: n >= 2 }], { rh: 52, size: 24 });
      if (n >= 2) Py.console(ctx, 220, 420, 780, [["12", "out"]]);
      const rows = [["\"teh\"", 12], ["\"roti\"", 5], ["\"susu\"", 8]]; const x = 1120, y = 280, rh = 64;
      card(ctx, x, y, 520, rh * 4, { fill: "#FFFDF5", stroke: "#E0B04B", lw: 3, r: 12 }); ctx.fillStyle = "#FFF3D6"; rr(ctx, x, y, 520, rh, 12); ctx.fill(); ctx.fillRect(x, y + rh / 2, 520, rh / 2);
      text(ctx, "kunci", x + 130, y + 42, 22, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "nilai", x + 390, y + 42, 22, { align: "center", weight: 900, color: C.ink2 });
      rows.forEach(([kk, v], i) => { const ry = y + rh * (i + 1); if (n >= 2 && i === 0) { ctx.fillStyle = C.goodBg; ctx.fillRect(x + 3, ry, 514, rh); } text(ctx, kk, x + 130, ry + 42, 26, { align: "center", weight: 900, color: C.kiko }); text(ctx, String(v), x + 390, ry + 42, 26, { align: "center", weight: 900 }); });
      if (n >= 2) { arrow(ctx, 1006, 388, 1112, 376, C.good); text(ctx, "langsung ke kunci \"teh\"", 1380, 580, 22, { align: "center", weight: 900, color: C.good }); }
      if (n >= 3) { card(ctx, 220, 560, 780, 120, { fill: C.bg2, r: 14 }); text(ctx, "list: periksa satu per satu sampai ketemu", 250, 605, 22, { weight: 900, color: C.ink2 }); text(ctx, "dictionary: minta kuncinya, nilainya keluar", 250, 650, 22, { weight: 900, color: C.good }); }
      if (n >= 4) label(ctx, "mengapa secepat itu? kita bahas di F12.1", 1380, 660, { size: 24 });
    },
    peta12(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PETA KELAS XII");
      const s1 = [["F12.1", "Struktur Data Kompleks dan Abstrak"], ["F12.2", "Memilih Solusi Optimal"], ["F12.3", "Analisis Data untuk Prediksi"], ["F12.4", "Hukum Digital dan Demokrasi Digital"], ["F12.5", "Transaksi Digital yang Aman"]];
      const s2 = [["F12.6", "Kreasi Konten Digital"], ["F12.7", "Proyek Akhir Fase F"]];
      const n = reveal(l, 1.0, 1.2, 7);
      text(ctx, "SEMESTER 1", 560, 275, 24, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "SEMESTER 2", 1380, 275, 24, { align: "center", weight: 900, color: C.ink2 });
      const row = (c, t, x, y, hl) => { card(ctx, x, y, 660, 70, { fill: hl ? "#FFF3D6" : C.bg2, r: 12 }); ctx.fillStyle = C.kiko; rr(ctx, x + 16, y + 12, 100, 46, 10); ctx.fill(); text(ctx, c, x + 66, y + 43, 20, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, x + 136, y + 45, 23, { weight: 800 }); };
      s1.forEach(([c, t], i) => dim(ctx, i < n, () => row(c, t, 230, 295 + i * 82, i === 0)));
      s2.forEach(([c, t], i) => dim(ctx, i + 5 < n, () => row(c, t, 1050, 295 + i * 82, i === 1)));
      dim(ctx, n >= 1, () => { text(ctx, "di F12.1:", 1060, 520, 20, { weight: 900, color: C.ink2 }); [["linked list", "🔗"], ["tree (pohon)", "🌳"], ["graph (graf)", "🕸️"]].forEach(([t, ic], i) => { card(ctx, 1060 + i * 215, 540, 200, 110, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); text(ctx, ic, 1160 + i * 215, 590, 34, { align: "center" }); text(ctx, t, 1160 + i * 215, 632, 19, { align: "center", weight: 900 }); }); });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Kuis diagnostik", "9 soal, 3 per bekal", (x, y) => [["🔁", "perulangan"], ["📚", "list"], ["🧩", "fungsi"]].forEach(([ic, t], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, ic + "  " + t + " · 3 soal", x - 180, y - 64 + i * 66, 22, { weight: 900 }); })],
        ["Peta belajarmu", "aman atau tonton ulang", (x, y) => [["perulangan", "✓ aman", C.goodBg, C.good], ["list", "↺ ulangi", "#FFF3D6", C.accentDark], ["fungsi", "✓ aman", C.goodBg, C.good]].forEach(([t, v, bg, col], i) => { card(ctx, x - 190, y - 100 + i * 66, 380, 56, { fill: bg, r: 10 }); text(ctx, t, x - 170, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, v, x + 170, y - 64 + i * 66, 22, { align: "right", weight: 900, color: col }); })],
        ["Pelacak Python", "tiga program, tebak isinya", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 110); ctx.scale(0.7, 0.7); Py.code(ctx, 0, 0, 600, [{ t: "def dobel(x):" }, { t: "    return x * 2", hl: true }, { t: "y = dobel(4)" }], { rh: 44, size: 24 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 270, 500, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 320, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 332, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 332, 26, { weight: 900 }); text(ctx, t2, x - 160, 366, 20, { weight: 700, color: C.ink2 }); draw(x, 530); });
      text(ctx, "lalu di komputer: tulis fungsi terbesar(daftar) tanpa max, uji dengan tiga list", 960, 725, 24, { align: "center", color: C.ink2, weight: 800 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
