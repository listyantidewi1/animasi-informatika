/* Adegan episode E.7: Pseudocode Dekat Bahasa Komputer. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, alur.js, memori.js, sd.js, kode.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Al = K.alur, Mm = K.memori, Sd = K.sd, Kd = K.kode, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const NILAI = [70, 85, 90, 65, 78];
  const MAKS = [{ t: "DEKLARASI" }, { t: "nilai : larik[0..4] dari bulat", ind: 1 }, { t: "maks, i : bulat", ind: 1 }, { t: "ALGORITMA" }, { t: "maks ← nilai[0]", ind: 1 }, { t: "UNTUK i dari 1 sampai 4:", ind: 1 }, { t: "JIKA nilai[i] > maks MAKA maks ← nilai[i]", ind: 2 }, { t: "TULIS maks", ind: 1 }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      const n = reveal(l, 2.0, 1.3, 4);
      [["🏷️", "Deklarasi tipe", "bulat · pecahan · teks · boolean"], ["➗", "Operator lengkap", "DIV, MOD, DAN, ATAU"], ["0️⃣", "Larik dari nol", "indeks 0 … n−1"], ["📞", "Fungsi", "parameter, nilai balik"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 520 + i * 310; card(ctx, x, 280, 290, 300, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 18 }); text(ctx, ic, x + 145, 380, 56, { align: "center" }); text(ctx, t, x + 145, 440, 26, { align: "center", weight: 900 }); para(ctx, s, x + 145, 485, 20, 250, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) banner(ctx, "jembatan terakhir menuju bahasa pemrograman", 650, 900);
    },
    prereq(ctx, b, l) {
      card(ctx, 200, 200, 1520, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D9.1", "Pseudocode Lengkap: Perulangan dan Data"], ["E.5", "Struktur Data Standar"], ["E.6", "Pencarian dan Pengurutan"]].forEach(([c, t], i) => { const x = 260 + i * 470; card(ctx, x, 340, 440, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 220, 420, 44, { align: "center", weight: 900 }); para(ctx, t, x + 220, 480, 26, 400, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1660, 820, 120, 0);
    },
    unplugged_tipe(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: KARTU MASUK KOTAK TIPE");
      const cards = [["17", 0], ["3,5", 1], ["Sinta", 2], ["benar", 3], ["0812…", 2], ["salah", 3]];
      const n = reveal(l, 2.0, 1.4, 6);
      const groups = [[], [], [], []]; cards.slice(0, n).forEach(([t, k]) => groups[k].push(t));
      Kd.TYPES.forEach((tp, i) => Kd.typeBox(ctx, 230 + i * 390, 290, 350, 300, i, groups[i], { on: n > 0 && n <= 6 && cards[n - 1][1] === i }));
      if (n >= 5) { card(ctx, 560, 620, 800, 70, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 12 }); text(ctx, "nomor HP: teks, karena tidak pernah dihitung (dan nol di depannya penting)", 960, 664, 20, { align: "center", weight: 900, color: C.accentDark }); }
    },
    unplugged_resep(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SATU RESEP, TIGA PESANAN: FUNGSI DENGAN PARAMETER");
      Kd.code(ctx, 240, 280, 620, [{ t: "FUNGSI buat_teh(gula : bulat)" }, { t: "panaskan air", ind: 1 }, { t: "seduh teh", ind: 1 }, { t: "tambahkan gula sebanyak gula", ind: 1 }, { t: "KEMBALIKAN secangkir teh", ind: 1 }], { title: "RESEP (ditulis sekali)", rh: 44, size: 22 });
      const n = reveal(l, 3.0, 1.8, 3);
      [["Dito", 2], ["Sinta", 0], ["Rani", 1]].forEach(([nm, g], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; kid(ctx, 1000 + i * 240, 480, 110, { hair: i === 1 ? "long" : null }); card(ctx, 930 + i * 240, 560, 180, 60, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 10 }); text(ctx, "buat_teh(" + g + ")", 1020 + i * 240, 598, 22, { align: "center", weight: 900, color: C.accentDark }); text(ctx, nm, 1020 + i * 240, 650, 20, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) label(ctx, "dipanggil tiga kali, dengan gula berbeda", 1260, 720, { size: 24 });
    },

    tipe_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "EMPAT TIPE DATA DASAR", 215);
      const n = reveal(l, 1.5, 2.4, 4);
      const ex = [["17", "−3"], ["3,5"], ["\"Sinta\"", "\"0812…\""], ["benar", "salah"]];
      Kd.TYPES.forEach((tp, i) => Kd.typeBox(ctx, 230 + i * 390, 270, 350, 320, i, ex[i], { dim: i >= n, on: i === n - 1 }));
      if (n >= 4) { card(ctx, 360, 620, 1200, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "tipe menentukan apa yang boleh dilakukan: bulat dijumlahkan, teks digabung, boolean dipakai di JIKA", 960, 668, 22, { align: "center", weight: 900, color: C.accentDark }); }
    },
    deklarasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DEKLARASI: SEBUT TIPENYA DULU", 215);
      Kd.code(ctx, 220, 260, 620, [{ t: "DEKLARASI" }, { t: "umur : bulat", ind: 1 }, { t: "nama : teks", ind: 1 }, { t: "lulus : boolean", ind: 1 }, { t: "ALGORITMA" }, { t: "umur ← 17", ind: 1 }, { t: "nama ← \"Sinta\"", ind: 1 }, { t: "lulus ← benar", ind: 1 }], { rh: 42, size: 22 });
      const n = reveal(l, 5, 3.0, 2);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 920, 280, 780, 150, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "teks:   \"17\" + \"1\"  →  \"171\"", 1310, 340, 28, { align: "center", weight: 900 }); text(ctx, "teks digabung, bukan dijumlahkan", 1310, 390, 20, { align: "center", weight: 800, color: C.bad }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; card(ctx, 920, 460, 780, 150, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "bulat:   17 + 1  →  18", 1310, 520, 28, { align: "center", weight: 900 }); text(ctx, "bilangan dijumlahkan", 1310, 570, 20, { align: "center", weight: 800, color: C.good }); ctx.restore();
      if (n >= 2) label(ctx, "salah tipe, salah hasil", 1310, 680, { color: C.bad });
    },
    ekspresi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "OPERATOR: ARITMATIKA · PERBANDINGAN · LOGIKA", 215);
      const n = reveal(l, 1.5, 1.5, 6);
      [["+ − × /", "aritmatika", "17 / 5 = 3,4"], ["DIV", "hasil bagi bulat", "17 DIV 5 = 3"], ["MOD", "sisa bagi", "17 MOD 5 = 2"], ["= ≠ < > ≤ ≥", "perbandingan → boolean", "17 > 5 = benar"], ["DAN · ATAU", "logika", "benar DAN salah = salah"], ["TIDAK", "membalik", "TIDAK benar = salah"]].forEach(([sym, nm, ex], i) => Kd.opCard(ctx, 230 + (i % 2) * 740, 270 + Math.floor(i / 2) * 130, 700, sym, nm, ex, { dim: i >= n, on: i === n - 1 }));
      if (n >= 6) label(ctx, "MOD: genap-ganjil, kelipatan · DIV: pembagian tanpa koma", 960, 700, { size: 24 });
    },
    baca_tulis(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BACA DAN TULIS: PROGRAM KONVERSI SUHU", 215);
      const n = reveal(l, 1.5, 1.4, 6);
      Kd.code(ctx, 220, 260, 760, [{ t: "DEKLARASI" }, { t: "celsius, fahrenheit : pecahan", ind: 1 }, { t: "ALGORITMA" }, { t: "BACA celsius", ind: 1 }, { t: "fahrenheit ← celsius × 9 / 5 + 32", ind: 1 }, { t: "TULIS fahrenheit", ind: 1 }].map((p, i) => ({ ...p, hl: i === n - 1 })), { rh: 48, size: 22 });
      Mm.board(ctx, 1040, 270, 660, [{ name: "celsius", value: n >= 4 ? 30 : null, changed: n === 4 }, { name: "fahrenheit", value: n >= 5 ? 86 : null, changed: n === 5 }], { bw: 280, bh: 110 });
      Kd.console(ctx, 1040, 500, 660, [["30", "in"], ...(n >= 6 ? [["86", "out"]] : [])]);
      if (n >= 6) label(ctx, "masukan 30 → keluaran 86", 1370, 710, { size: 24, color: C.good });
    },
    larik0(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LARIK MULAI DARI INDEKS NOL", 215);
      const n = reveal(l, 1.5, 2.0, 3);
      Sd.array(ctx, 360, 320, NILAI, { name: "nilai : larik[0..4] dari bulat", from0: true, hl: n >= 2 ? 4 : null, bad: n >= 3 ? 5 : null, w: 200, h: 110 });
      if (n >= 1) { card(ctx, 360, 520, 500, 70, { fill: C.bg2, r: 12 }); text(ctx, "panjang = 5", 610, 565, 28, { align: "center", weight: 900 }); }
      if (n >= 2) { card(ctx, 900, 520, 500, 70, { fill: C.bg2, r: 12 }); text(ctx, "indeks terakhir = 4", 1150, 565, 28, { align: "center", weight: 900 }); }
      if (n >= 3) label(ctx, "nilai[5] tidak ada: kesalahan paling sering saat mulai dari nol", 960, 680, { color: C.bad, size: 26 });
    },
    larik_prog(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PROGRAM CARI NILAI TERBESAR: LACAK DI PAPAN MEMORI", 215);
      const k = reveal(l, 1.0, 1.4, 9); // 1 deklarasi..4 maks←nilai[0], lalu i=1..4
      let maks = NILAI[0], i = null, hlLine = Math.min(k, 4) - 1;
      if (k >= 5) { for (let t = 1; t <= Math.min(4, k - 4); t++) { i = t; if (NILAI[t] > maks) maks = NILAI[t]; } hlLine = k > 8 ? 7 : 6; }
      Kd.code(ctx, 220, 260, 820, MAKS.map((p, idx) => ({ ...p, hl: idx === hlLine })), { rh: 42, size: 21 });
      Sd.array(ctx, 1080, 300, NILAI, { from0: true, hl: i, w: 110, h: 70 });
      Mm.board(ctx, 1080, 440, 620, [{ name: "i", value: i == null ? null : i }, { name: "maks", value: k >= 4 ? maks : null, changed: k >= 5 && i != null && NILAI[i] === maks && NILAI[i] !== NILAI[0] }], { bw: 260, bh: 110 });
      if (k > 8) Kd.console(ctx, 1080, 650, 620, [["90", "out"]]);
    },
    fungsi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "FUNGSI: PROGRAM KECIL BERNAMA, DIPANGGIL BERKALI-KALI", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      Kd.code(ctx, 220, 270, 760, [{ t: "FUNGSI luas_persegi(sisi : bulat) → bulat", hl: n === 1 }, { t: "KEMBALIKAN sisi × sisi", ind: 1, hl: n === 2 }], { rh: 50, size: 24 });
      [["nama fungsi", "luas_persegi"], ["parameter", "sisi : bulat"], ["tipe nilai balik", "→ bulat"], ["KEMBALIKAN", "mengirim hasil ke pemanggil"]].forEach(([k, v], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1040, 270 + i * 90, 660, 76, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, k, 1064, 318 + i * 90, 22, { weight: 800, color: C.ink2 }); text(ctx, v, 1676, 318 + i * 90, 24, { align: "right", weight: 900 }); ctx.restore(); });
      if (l > 11) { Kd.code(ctx, 220, 450, 760, [{ t: "PROSEDUR garis()" }, { t: "TULIS \"----------\"", ind: 1 }], { title: "PROSEDUR: tanpa nilai balik", rh: 46, size: 22 }); }
      if (l > 11) label(ctx, "satu tugas, satu nama, tulis sekali", 960, 720, { size: 26 });
    },
    pemanggilan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PELACAKAN PEMANGGILAN: ARGUMEN → PARAMETER → NILAI BALIK", 215);
      const n = reveal(l, 1.5, 2.4, 4);
      Kd.code(ctx, 220, 270, 640, [{ t: "FUNGSI luas_persegi(sisi : bulat) → bulat", hl: n === 2 }, { t: "KEMBALIKAN sisi × sisi", ind: 1, hl: n === 3 }, { t: "" }, { t: "ALGORITMA (program utama)" }, { t: "TULIS luas_persegi(3)", ind: 1, hl: n === 1 || n === 4 }], { rh: 46, size: 22 });
      if (n >= 1) { arrowIcon(ctx, "right", 900, 420, 36, C.accent); text(ctx, "3", 900, 390, 26, { align: "center", weight: 900, color: C.accentDark }); }
      if (n >= 2) Kd.frame(ctx, 960, 290, 420, "luas_persegi", [["sisi", 3]], { ret: n >= 3 ? 9 : null });
      if (n >= 4) { arrowIcon(ctx, "left", 900, 560, 36, C.good); text(ctx, "9", 900, 530, 26, { align: "center", weight: 900, color: C.good }); Kd.console(ctx, 1420, 290, 280, [["9", "out"]]); }
      if (n >= 4) label(ctx, "sisi hanya hidup di dalam fungsi: variabel lokal", 1200, 620, { size: 24 });
    },
    program_utuh(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SATU PROGRAM UTUH", 215);
      const n = reveal(l, 1.0, 1.0, 14);
      const L1 = [{ t: "PROGRAM rata_kelas" }, { t: "DEKLARASI" }, { t: "nilai : larik[0..4] dari bulat", ind: 1 }, { t: "rata : pecahan", ind: 1 }, { t: "" }, { t: "FUNGSI rata_rata(a : larik dari bulat, n : bulat) → pecahan" }, { t: "DEKLARASI total, i : bulat", ind: 1 }, { t: "total ← 0", ind: 1 }, { t: "UNTUK i dari 0 sampai n − 1:", ind: 1 }, { t: "total ← total + a[i]", ind: 2 }, { t: "KEMBALIKAN total / n", ind: 1 }, { t: "" }, { t: "ALGORITMA" }, { t: "rata ← rata_rata(nilai, 5)", ind: 1 }, { t: "TULIS rata", ind: 1 }];
      Kd.code(ctx, 220, 255, 900, L1.map((p, i) => ({ ...p, t: i < n + 1 ? p.t : "" })), { rh: 32, size: 19 });
      const tags = [["deklarasi + tipe", 3], ["fungsi + parameter", 6], ["larik dari 0 + perulangan", 9], ["nilai balik", 10], ["pemanggilan", 13]];
      tags.forEach(([t, at], i) => { ctx.save(); if (n < at) ctx.globalAlpha = 0.2; card(ctx, 1180, 290 + i * 80, 520, 64, { fill: C.bg2, r: 12 }); text(ctx, "✓ " + t, 1204, 331 + i * 80, 24, { weight: 900 }); ctx.restore(); });
      if (n >= 14) Kd.console(ctx, 1180, 700, 520, [["77,6", "out"]]);
    },
    menuju_kode(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "INTIP KELAS XI: PSEUDOCODE DAN PYTHON BERDAMPINGAN", 215);
      Kd.code(ctx, 220, 270, 740, [{ t: "FUNGSI rata_rata(a, n) → pecahan" }, { t: "total ← 0", ind: 1 }, { t: "UNTUK i dari 0 sampai n − 1:", ind: 1 }, { t: "total ← total + a[i]", ind: 2 }, { t: "KEMBALIKAN total / n", ind: 1 }], { rh: 46, size: 22 });
      const n = reveal(l, 3, 2.0, 3);
      card(ctx, 1000, 270, 700, 280, { fill: "#1F2A33", r: 14 }); text(ctx, "PYTHON", 1018, 302, 18, { weight: 900, color: "#8FD0E6" });
      ["def rata_rata(a, n):", "    total = 0", "    for i in range(n):", "        total = total + a[i]", "    return total / n"].forEach((s, i) => text(ctx, s, 1020, 350 + i * 40, 22, { weight: 800, color: i === 0 || i === 4 ? "#F2B134" : "#fff" }));
      [["deklarasi tipe tersembunyi", "Python menebak tipenya"], ["indeks tetap dari 0", "range(n) = 0 … n−1"], ["def dan return", "FUNGSI dan KEMBALIKAN"]].forEach(([t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1000 + 0, 580 + i * 56, 700, 48, { fill: C.bg2, r: 10 }); text(ctx, t + " · " + s, 1020, 611 + i * 56, 19, { weight: 800 }); ctx.restore(); });
      if (n >= 3) label(ctx, "bentuk beda tipis, cara berpikir persis sama", 590, 640, { size: 26 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pelacak", "larik dan fungsi, papan memori", (x, y) => { ctx.save(); ctx.translate(x - 220, y - 100); ctx.scale(0.65, 0.65); Mm.board(ctx, 0, 0, 660, [{ name: "i", value: 2 }, { name: "maks", value: 90, changed: true }], { bw: 280, bh: 110 }); ctx.restore(); }],
        ["Perbaiki tipe", "deklarasi yang salah", (x, y) => { ctx.save(); ctx.translate(x - 215, y - 110); ctx.scale(0.7, 0.7); Kd.code(ctx, 0, 0, 600, [{ t: "umur : teks", bad: true }, { t: "nama : teks" }, { t: "lulus : bulat", bad: true }], { rh: 44, size: 24 }); ctx.restore(); }],
        ["Susun program", "potongan jadi utuh", (x, y) => ["DEKLARASI", "FUNGSI …", "ALGORITMA", "TULIS …"].forEach((t, i) => { card(ctx, x - 190, y - 100 + i * 52, 380, 44, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, (i + 1) + ". " + t, x - 170, y - 72 + i * 52, 20, { weight: 900, color: C.kiko }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — periksa indeks, urutan pemanggilan, nilai balik", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
