/* Adegan episode F11.0: Jembatan Menuju Pemrograman. Gaya diagram Fase F. Muat setelah kiko-core.js, kiko-devices.js, alur.js, memori.js, kode.js, py.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Al = K.alur, Mm = K.memori, Kd = K.kode, Py = K.py, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const NILAI = [80, 60, 90, 75, 50];
  const PS = [{ t: "lulus ← 0" }, { t: "UNTUK tiap nilai dalam daftar:" }, { t: "JIKA nilai ≥ 75 MAKA lulus ← lulus + 1", ind: 1 }, { t: "TULIS lulus" }];
  const PYL = [{ t: "nilai = [80, 60, 90, 75, 50]" }, { t: "lulus = 0" }, { t: "for n in nilai:" }, { t: "    if n >= 75:" }, { t: "        lulus = lulus + 1" }, { t: "print(lulus)" }];
  const traceAt = k => { let lulus = 0, i = null; for (let t = 0; t < Math.min(k, 5); t++) { i = t; if (NILAI[t] >= 75) lulus++; } return { i, lulus }; };

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.6, 3);
      [["📜", "pseudocode", "kelas IX dan X", C.bg2], ["✅", "logika benar-salah", "DAN · ATAU · TIDAK", C.bg2], ["🐍", "Python", "bekal baru: paling dekat pseudocode", "#FFF3D6"]].forEach(([ic, t, s, bg], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 540 + i * 400; card(ctx, x, 280, 370, 300, { fill: bg, stroke: i === 2 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 185, 380, 64, { align: "center" }); text(ctx, t, x + 185, 450, 28, { align: "center", weight: 900 }); para(ctx, s, x + 185, 500, 20, 330, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) banner(ctx, "bukan ulangan: diagnostik, lalu program pertama", 650, 1000);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "KALAU PERLU MENGULANG", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D9.1", "Pseudocode Lengkap: Perulangan dan Data"], ["E.7", "Pseudocode Dekat Bahasa Komputer"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "kuis diagnostik di halaman latihan memberi tahu bagian mana", 960, 690, { size: 24, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_benar_salah(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: BERDIRI = BENAR, DUDUK = SALAH");
      const n = reveal(l, 2.0, 2.4, 4);
      const st = [["Hari ini Senin", true], ["Hari ini Senin DAN sekarang pagi", true], ["Hari ini Senin ATAU hari ini Minggu", true], ["TIDAK hari ini Senin", false]];
      st.forEach(([s, v], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 230, 280 + i * 100, 900, 84, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, s, 260, 332 + i * 100, 26, { weight: 900 }); text(ctx, v ? "berdiri" : "duduk", 1100, 332 + i * 100, 22, { align: "right", weight: 900, color: v ? C.good : C.bad }); ctx.restore(); });
      const stand = n < 4; kid(ctx, 1400, stand ? 520 : 600, stand ? 160 : 120, { hair: "long" }); kid(ctx, 1620, stand ? 520 : 600, stand ? 160 : 120);
      text(ctx, "(hari Senin pagi)", 1510, 740, 20, { align: "center", weight: 800, color: C.ink2 });
    },
    unplugged_robot_kata(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ROBOT KATA: TIGA PERINTAH, HARUS PERSIS");
      kid(ctx, 420, 560, 150, { point: true }); kid(ctx, 1500, 560, 150, { hair: "long" }); text(ctx, "komputer: tulis · simpan · jika", 1500, 740, 20, { align: "center", weight: 900, color: C.ink2 });
      const n = reveal(l, 2.0, 2.6, 3);
      [["simpan 5 ke x", "✓ x = 5", true], ["tuliskan x", "✕ error: perintah 'tuliskan' tidak dikenal", false], ["tulis x", "✓ layar: 5", true]].forEach(([cmd, res, ok], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 640, 290 + i * 130, 660, 110, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 3, r: 14 }); text(ctx, "\"" + cmd + "\"", 670, 335 + i * 130, 26, { weight: 900 }); text(ctx, res, 670, 375 + i * 130, 20, { weight: 800, color: ok ? C.good : C.bad }); ctx.restore(); });
      if (n >= 3) label(ctx, "salah satu huruf, komputer berhenti: itulah rasanya menulis kode", 960, 700, { size: 24 });
    },

    pseudo_ulang(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 1 · PSEUDOCODE: VARIABEL, JIKA, ULANGI", 215);
      const n = reveal(l, 3, 1.6, 4);
      Al.pseudo(ctx, 220, 260, 900, PS.map((p, i) => ({ ...p, hl: i === n - 1 })), { rh: 56, size: 26 });
      [["📦", "variabel", "lulus menyimpan hitungan"], ["🔀", "JIKA", "memilih: ≥ 75 atau tidak"], ["🔁", "UNTUK", "mengulang untuk tiap nilai"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= reveal(l, 1, 0.8, 3)) ctx.globalAlpha = 0.2; card(ctx, 1180, 270 + i * 120, 520, 100, { fill: C.bg2, r: 14 }); text(ctx, ic, 1225, 332 + i * 120, 36, { align: "center" }); text(ctx, t, 1270, 312 + i * 120, 24, { weight: 900 }); text(ctx, s, 1270, 346 + i * 120, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
      Mm.list(ctx, 220, 620, NILAI, { name: "daftar nilai", w: 120, h: 60 });
    },
    pelacakan_ulang(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TABEL PELACAKAN: JANGAN MENEBAK", 215);
      const k = reveal(l, 1.5, 1.6, 6); const tr = traceAt(k - 1);
      Al.pseudo(ctx, 220, 260, 760, PS.map((p, i) => ({ ...p, hl: k >= 2 && k <= 6 && i === 2 })), { rh: 50, size: 24 });
      Mm.list(ctx, 220, 590, NILAI, { name: "nilai", w: 120, h: 60, hl: tr.i == null ? null : tr.i + 1 });
      const rows = [["nilai", "≥ 75?", "lulus"]]; for (let t = 0; t < Math.min(k - 1, 5); t++) rows.push([String(NILAI[t]), NILAI[t] >= 75 ? "ya" : "tidak", String(traceAt(t + 1).lulus)]);
      Kd.code && 0; // (tidak dipakai)
      const x = 1060, y = 260, cw = [160, 160, 160], rh = 48; card(ctx, x, y, 480, rh * 7, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 10 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, 480, rh, 10); ctx.fill(); ctx.fillRect(x, y + rh / 2, 480, rh / 2);
      [["awal", "", "0"], ...rows.slice(1)].forEach((r, i) => { r.forEach((v, c) => text(ctx, v, x + c * 160 + 80, y + rh * (i + 1) + rh / 2 + 8, 22, { align: "center", weight: c === 2 ? 900 : 700, color: v === "ya" ? C.good : v === "tidak" ? C.bad : C.ink })); });
      rows[0].forEach((h, c) => text(ctx, h, x + c * 160 + 80, y + rh / 2 + 8, 20, { align: "center", weight: 900, color: C.ink2 }));
      if (k >= 6) { card(ctx, 1060, 620, 480, 70, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "TULIS lulus → 3", 1300, 665, 28, { align: "center", weight: 900, color: C.good }); }
    },
    logika(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BEKAL 2 · LOGIKA: DAN, ATAU, TIDAK", 215);
      const n = reveal(l, 1.5, 2.6, 3);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; text(ctx, "DAN: keduanya benar", 420, 290, 24, { align: "center", weight: 900, color: C.kiko }); Py.truth(ctx, 240, 310, "DAN", { hlRow: 0 }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; text(ctx, "ATAU: salah satu benar", 960, 290, 24, { align: "center", weight: 900, color: C.kiko }); Py.truth(ctx, 780, 310, "ATAU", { hlRow: 3 }); ctx.restore();
      ctx.save(); if (n < 3) ctx.globalAlpha = 0.2; text(ctx, "TIDAK: membalik", 1480, 290, 24, { align: "center", weight: 900, color: C.kiko }); card(ctx, 1340, 310, 280, 140, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 10 }); text(ctx, "TIDAK benar = salah", 1480, 360, 22, { align: "center", weight: 800 }); text(ctx, "TIDAK salah = benar", 1480, 410, 22, { align: "center", weight: 800 }); ctx.restore();
      if (n >= 3) label(ctx, "dua pernyataan: empat baris kemungkinan", 960, 620, { size: 26 });
    },
    logika_program(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LOGIKA MENJAGA PINTU", 215);
      const n = reveal(l, 1.5, 2.4, 3);
      [["boleh_masuk_lab", "punya_kartu DAN sudah_izin", "keduanya harus benar"], ["dapat_diskon", "pelajar ATAU lansia", "salah satu cukup"], ["lampu_nyala", "TIDAK siang", "dibalik"]].forEach(([v, e, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 230, 270 + i * 130, 1460, 112, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, "JIKA " + e + " MAKA " + v + " ← benar", 260, 320 + i * 130, 26, { weight: 900 }); text(ctx, s, 260, 358 + i * 130, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) { card(ctx, 360, 670, 1200, 70, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "satu kata logika yang salah membuka pintu yang seharusnya tertutup", 960, 715, 24, { align: "center", weight: 900, color: C.bad }); }
    },

    python_pertama(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PROGRAM PYTHON PERTAMA", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      Py.code(ctx, 220, 270, 820, [{ t: 'nama = input("Siapa namamu? ")', hl: n === 1 || n === 2 }, { t: 'print("Halo, " + nama)', hl: n === 3 }], { rh: 54, size: 26 });
      Py.console(ctx, 220, 452, 820, [["Siapa namamu? ", "out"], ...(n >= 2 ? [["Sinta", "in"]] : []), ...(n >= 3 ? [["Halo, Sinta", "out"]] : [])]);
      if (n >= 4) { card(ctx, 1100, 270, 600, 200, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 14 }); text(ctx, "tanpa deklarasi tipe", 1400, 320, 24, { align: "center", weight: 900, color: C.accentDark }); para(ctx, "Python menebak tipe dari nilainya: input selalu memberi teks", 1400, 370, 20, 540, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 4) label(ctx, "dua baris, satu program yang berjalan", 1400, 560, { size: 26 });
    },
    bandingkan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PSEUDOCODE DAN PYTHON BERDAMPINGAN", 215);
      const n = reveal(l, 1.5, 2.0, 5);
      Kd.code(ctx, 220, 260, 740, [{ t: "BACA umur", hl: n === 1 }, { t: "JIKA umur ≥ 17 MAKA", hl: n === 3 || n === 4 }, { t: "TULIS \"boleh\"", ind: 1, hl: n === 2 || n === 5 }], { rh: 54, size: 24 });
      Py.code(ctx, 980, 260, 720, [{ t: "umur = int(input())", hl: n === 1 }, { t: "if umur >= 17:", hl: n === 3 || n === 4 }, { t: '    print("boleh")', hl: n === 2 || n === 5 }], { rh: 54, size: 24 });
      [["BACA → input", "int() mengubah teks menjadi bilangan"], ["TULIS → print", ""], ["← → =", "tanda sama dengan untuk menyimpan"], ["JIKA MAKA → if … :", "titik dua di akhir"], ["blok → indentasi", "spasi di awal baris, bukan hiasan"]].forEach(([t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 220 + (i % 3) * 500, 500 + Math.floor(i / 3) * 100, 480, 84, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, t, 244 + (i % 3) * 500, 536 + Math.floor(i / 3) * 100, 24, { weight: 900 }); text(ctx, s, 244 + (i % 3) * 500, 566 + Math.floor(i / 3) * 100, 16, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 5) label(ctx, "caranya sama, hurufnya berbeda", 1460, 650, { size: 24 });
    },
    jalankan_lacak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PROGRAM KEDUA: LACAK BARIS DEMI BARIS", 215);
      const k = reveal(l, 1.5, 1.4, 8); const tr = traceAt(Math.max(0, k - 2));
      const hl = k <= 1 ? 0 : k === 2 ? 1 : k <= 7 ? (NILAI[tr.i] >= 75 ? 4 : 3) : 5;
      Py.code(ctx, 220, 260, 760, PYL.map((p, i) => ({ ...p, hl: i === hl })), { rh: 48, size: 22 });
      Mm.list(ctx, 1040, 300, NILAI, { name: "nilai", w: 110, h: 60, hl: k >= 3 && k <= 7 ? tr.i + 1 : null });
      Mm.board(ctx, 1040, 420, 640, [{ name: "n", value: k >= 3 ? NILAI[tr.i] : null }, { name: "lulus", value: k >= 2 ? tr.lulus : null, changed: k >= 3 && k <= 7 && NILAI[tr.i] >= 75 }], { bw: 270, bh: 110 });
      if (k >= 8) Py.console(ctx, 1040, 630, 640, [["3", "out"]]);
      if (k >= 8) label(ctx, "hasilnya 3, sama seperti pseudocode", 600, 650, { size: 26, color: C.good });
    },
    galat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SENGAJA SALAH: BACA PESAN ERROR-NYA", 215);
      const n = reveal(l, 1.5, 2.6, 4);
      Py.code(ctx, 220, 260, 760, PYL.map((p, i) => ({ ...p, t: i === 3 && n >= 1 ? "    if n >= 75" : p.t, bad: i === 3 && n >= 2 })), { rh: 48, size: 22 });
      if (n >= 2) Py.error(ctx, 1040, 270, 660, "SyntaxError", ["File \"lulus.py\", line 4", "    if n >= 75", "               ^", "expected ':'"]);
      if (n >= 3) { ["1. baca nomor barisnya: 4", "2. baca jenisnya: SyntaxError, kurang ':'", "3. perbaiki, jalankan lagi"].forEach((s, i) => { card(ctx, 1040, 460 + i * 64, 660, 54, { fill: C.bg2, r: 10 }); text(ctx, s, 1064, 495 + i * 64, 22, { weight: 900 }); }); }
      if (n >= 4) label(ctx, "error adalah petunjuk, bukan hukuman", 1370, 700);
    },
    ubah_program(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "UBAH PROGRAMNYA: TEBAK, JALANKAN, BANDINGKAN", 215);
      const n = reveal(l, 1.5, 2.6, 3);
      const vars = [["batas 75 → 80", [{ t: "nilai = [80, 60, 90, 75, 50]" }, { t: "    if n >= 80:", hl: true }], "2"], ["tambah nilai 95", [{ t: "nilai = [80, 60, 90, 75, 50, 95]", hl: true }, { t: "    if n >= 75:" }], "4"], ["print kalimat", [{ t: 'print("Lulus:", lulus, "siswa")', hl: true }], "Lulus: 3 siswa"]];
      vars.forEach(([t, code, out], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 500; card(ctx, x, 270, 460, 400, { fill: C.bg2, r: 16 }); text(ctx, t, x + 230, 310, 24, { align: "center", weight: 900 }); Py.code(ctx, x + 20, 330, 420, code, { rh: 40, size: 16, title: "" }); Py.console(ctx, x + 20, 500, 420, [[out, "out"]]); ctx.restore(); });
      if (n >= 3) label(ctx, "mengubah program: cara belajar tercepat", 960, 720, { size: 26 });
    },
    peta11(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PETA KELAS XI", 215);
      const s1 = [["F11.1", "Alur Pengembangan Program"], ["F11.2", "Dari Pseudocode ke Kode"], ["F11.3", "Algoritma Standar dalam Kode"], ["F11.4", "Riset Digital dan Verifikasi"], ["F11.5", "Data Terbuka untuk Keputusan"]];
      const s2 = [["F11.6", "Strategi Algoritmik"], ["F11.7", "Model Jaringan dan Pengiriman Data"], ["F11.8", "Troubleshooting dan Keamanan"], ["F11.9", "Merancang Kebutuhan Sistem"], ["F11.10", "Proyek Aplikasi Data Terbuka"]];
      const n = reveal(l, 1.0, 0.8, 10);
      text(ctx, "SEMESTER 1", 540, 280, 24, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "SEMESTER 2", 1380, 280, 24, { align: "center", weight: 900, color: C.ink2 });
      s1.forEach(([c, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 240, 300 + i * 82, 600, 70, { fill: C.bg2, r: 12 }); ctx.fillStyle = C.kiko; rr(ctx, 256, 312 + i * 82, 100, 46, 10); ctx.fill(); text(ctx, c, 306, 343 + i * 82, 20, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, 376, 345 + i * 82, 23, { weight: 800 }); ctx.restore(); });
      s2.forEach(([c, t], i) => { ctx.save(); if (i + 5 >= n) ctx.globalAlpha = 0.2; card(ctx, 1080, 300 + i * 82, 600, 70, { fill: i === 4 ? "#FFF3D6" : C.bg2, r: 12 }); ctx.fillStyle = C.kiko; rr(ctx, 1096, 312 + i * 82, 100, 46, 10); ctx.fill(); text(ctx, c, 1146, 343 + i * 82, 20, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, 1216, 345 + i * 82, 23, { weight: 800 }); ctx.restore(); });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Kuis diagnostik", "9 soal, 3 per bekal", (x, y) => [["📜", "pseudocode"], ["✅", "logika"], ["🐍", "Python"]].forEach(([ic, t], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, ic + "  " + t + " · 3 soal", x - 180, y - 64 + i * 66, 22, { weight: 900 }); })],
        ["Peta belajarmu", "aman atau tonton ulang", (x, y) => [["pseudocode", "✓ aman", C.goodBg, C.good], ["logika", "↺ ulangi", "#FFF3D6", C.accentDark], ["Python", "✓ aman", C.goodBg, C.good]].forEach(([t, v, bg, col], i) => { card(ctx, x - 190, y - 100 + i * 66, 380, 56, { fill: bg, r: 10 }); text(ctx, t, x - 170, y - 64 + i * 66, 22, { weight: 800 }); text(ctx, v, x + 170, y - 64 + i * 66, 22, { align: "right", weight: 900, color: col }); })],
        ["Pelacak Python mini", "tiga program, tebak isinya", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 110); ctx.scale(0.7, 0.7); Py.code(ctx, 0, 0, 600, [{ t: "x = 5" }, { t: "x = x + 2", hl: true }, { t: "print(x)" }], { rh: 44, size: 24 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu ketik program halo-nama di komputer sungguhan", 960, 745, 26, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
