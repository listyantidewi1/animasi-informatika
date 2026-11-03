/* Adegan episode F11.5: Data Terbuka untuk Keputusan. Gaya diagram Fase F. Semua portal, lembaga, dan angka fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, lembar.js, data.js, terbuka.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Lb = K.lembar, Dq = K.dataq, Tb = K.terbuka, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const RAW = [["2025-08-01", "0"], ["2025-08-02", "12"], ["2025-08-02", "12"], ["2025-08-03", ""], ["2025-08-04", "1,5 cm"], ["2025-08-05", "-5"], ["2025-08-06", "999"], ["2025-08-07", "3"]];
  const MARKS_BAD = { "2,0": "bad", "2,1": "bad", "3,1": "bad", "4,1": "bad", "5,1": "bad", "6,1": "bad" };
  const FIXED = [["2025-08-01", "0"], ["2025-08-02", "12"], ["(duplikat disatukan)", ""], ["2025-08-03", "(dilewati)"], ["2025-08-04", "15"], ["2025-08-05", "(tidak valid)"], ["2025-08-06", "(tidak terukur)"], ["2025-08-07", "3"]];
  const MARKS_FIX = { "2,0": "fix", "3,1": "fix", "4,1": "fix", "5,1": "fix", "6,1": "fix" };
  const A_DAYS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40], B_DAYS = [8, 12, 6, 15, 9, 11, 7, 14, 10, 8, 12, 9, 13, 10, 11, 9, 8, 12, 10, 7, 11, 9, 13, 10, 8, 12, 9, 11, 10, 6];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 260, 500, 150, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.4, 7);
      Tb.flow(ctx, 420, 280, 1300, Tb.STEPS, Math.min(n, 6), { h: 190 });
      if (n >= 7) banner(ctx, "data terbuka: bisa di-download siapa saja, terpercaya, boleh dipakai ulang", 560, 1300, { size: 28 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["E.8", "Data Berkualitas dari Manusia"], ["D8.1", "Lembar Kerja"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_turus(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU: TURUS JAJANAN TIGA HARI", 215);
      const n = reveal(l, 1.5, 2.2, 5);
      const rows = [["gorengan", "|||| ||||", "|||| ||||", "|||| ||||", 27], ["buah potong", "|||", "||||", "||||", 11], ["roti", "||||", "|||| |", "||||", 16], ["minuman manis", "|||| ||||", "|||| |||| |", "|||| ||||", 28]];
      Lb.paper(ctx, 260, 290, ["jajanan", "hari 1", "hari 2", "hari 3", "total"], rows.map(r => n >= 4 ? r : r.slice(0, 1 + Math.min(3, n)).concat(Array(4 - Math.min(3, n)).fill(""))), { cw: 190, rh: 54 });
      if (n >= 5) { card(ctx, 1280, 300, 420, 260, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "KEPUTUSAN", 1490, 345, 20, { align: "center", weight: 900, color: C.accentDark }); para(ctx, "minuman manis dan gorengan paling laku: usulkan es buah dan jagung rebus sebagai pengganti sehat", 1490, 395, 22, 380, { align: "center", weight: 800 }); }
      if (n >= 5) label(ctx, "analisis data tanpa komputer: catat, jumlahkan, putuskan", 960, 710, { size: 24 });
    },
    unplugged_detektif_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "DETEKTIF DATA: LINGKARI YANG MENCURIGAKAN", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      text(ctx, "tabel A", 280, 290, 22, { weight: 900, color: C.good }); Dq.table(ctx, 260, 300, [120, 150, 140, 160], ["nama", "tgl lahir", "umur", "tinggi"], [["Rani", "2009-03-12", "17", "160 cm"], ["Dito", "2009-11-02", "16", "168 cm"], ["Sinta", "2010-01-20", "16", "157 cm"], ["Bima", "2009-07-07", "17", "171 cm"]], {}, { rh: 48 });
      const marks = {}; if (n >= 2) marks["0,2"] = "bad"; if (n >= 3) marks["1,1"] = "bad"; if (n >= 4) { marks["3,0"] = "bad"; marks["3,1"] = "bad"; } if (n >= 5) marks["2,3"] = "bad";
      text(ctx, "tabel B", 960, 290, 22, { weight: 900, color: C.bad }); Dq.table(ctx, 940, 300, [120, 160, 130, 160], ["nama", "tgl lahir", "umur", "tinggi"], [["Rani", "2009-03-12", "150", "160 cm"], ["Dito", "2031-11-02", "16", "168 cm"], ["Sinta", "2010-01-20", "16", "1,57 m"], ["Dito", "2031-11-02", "16", "168 cm"]], marks, { rh: 48 });
      [["umur 150", "nilai mustahil"], ["tahun 2031", "tanggal di masa depan"], ["baris Dito dua kali", "duplikat"], ["1,57 m di antara cm", "satuan berganti"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; card(ctx, 260 + i * 350, 580, 320, 80, { fill: C.badBg, stroke: C.bad, lw: 2, r: 10 }); text(ctx, t, 280 + i * 350, 614, 20, { weight: 900, color: C.bad }); text(ctx, s, 280 + i * 350, 644, 16, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) label(ctx, "mata manusia dulu, baru rumus", 960, 720, { size: 26 });
    },
    siklus(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 1 · PERTANYAAN YANG BISA DIJAWAB DATA", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      Tb.flow(ctx, 240, 255, 1440, Tb.STEPS, 6, { h: 110, active: 0 });
      card(ctx, 240, 400, 700, 100, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "✕ “Bulan apa yang enak untuk kemah?”", 590, 445, 24, { align: "center", weight: 900, color: C.bad }); text(ctx, "enak menurut siapa? diukur dengan apa?", 590, 480, 18, { align: "center", weight: 700, color: C.ink2 });
      if (n >= 2) { card(ctx, 980, 400, 700, 100, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); para(ctx, "✓ “Bulan apa yang jumlah hari hujannya paling sedikit dalam 3 tahun terakhir?”", 1330, 440, 22, 660, { align: "center", weight: 900, color: C.good }); }
      [["data apa?", "curah hujan harian, 3 tahun"], ["ukuran apa?", "jumlah hari hujan per bulan"], ["keputusan apa?", "bulan pelaksanaan kemah"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 3) ctx.globalAlpha = 0.2; card(ctx, 240 + i * 490, 540, 460, 100, { fill: n === i + 3 ? "#FFF3D6" : C.bg2, stroke: n === i + 3 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, t, 264 + i * 490, 580, 24, { weight: 900 }); text(ctx, s, 264 + i * 490, 615, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) label(ctx, "pertanyaan tajam menentukan data dan ukurannya", 960, 710, { size: 26 });
    },
    sumber_terbuka(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 2 · CARI DATA TERBUKA", 215);
      const n = reveal(l, 1.5, 1.8, 7);
      Tb.flow(ctx, 240, 255, 1440, Tb.STEPS, 6, { h: 110, active: 1 });
      if (n >= 2) Tb.portal(ctx, 240, 390, 760, 320, { metaN: n >= 4 ? 3 : n >= 3 ? 1 : 0 });
      Tb.check(ctx, 1040, 400, 640, "terbuka", "bisa di-download, format CSV/JSON", n >= 5 ? true : null, { dim: n < 5 });
      Tb.check(ctx, 1040, 505, 640, "terpercaya", "lembaga yang mengukur, ada metadata, diperbarui", n >= 6 ? true : null, { dim: n < 6 });
      Tb.check(ctx, 1040, 610, 640, "legal", "lisensi mengizinkan pakai ulang, sebut sumber", n >= 7 ? true : null, { dim: n < 7 });
      if (n < 2) [["portal data pemerintah", "🏛️"], ["badan statistik", "📊"], ["lembaga cuaca", "🌦️"]].forEach(([t, ic], i) => { card(ctx, 240 + i * 260, 420, 240, 120, { fill: C.bg2, r: 14 }); text(ctx, ic, 360 + i * 260, 475, 40, { align: "center" }); text(ctx, t, 360 + i * 260, 520, 18, { align: "center", weight: 900 }); });
    },
    data_kotor(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 3 · DATA MENTAH JARANG RAPI", 215);
      const n = reveal(l, 1.5, 1.6, 7);
      Tb.flow(ctx, 240, 255, 1440, Tb.STEPS, 6, { h: 110, active: 2 });
      const marks = {}; const order = [["3,1"], ["4,1"], ["2,0", "2,1"], ["5,1", "6,1"]]; order.slice(0, Math.max(0, n - 2)).forEach(ks => ks.forEach(k => marks[k] = "bad"));
      Dq.table(ctx, 240, 390, [260, 220], ["tanggal", "curah hujan (mm)"], RAW, marks, { rh: 40 });
      [["sel kosong", "baris 4: tidak ada angka"], ["satuan berbeda", "baris 5: 1,5 cm, bukan mm"], ["tanggal kembar", "baris 2 dan 3 sama persis"], ["nilai mustahil", "−5 mm; 999 = kode tidak terukur"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 3) ctx.globalAlpha = 0.2; card(ctx, 780, 400 + i * 80, 900, 68, { fill: n === i + 3 ? "#FFF3D6" : C.bg2, stroke: n === i + 3 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, "⚠ " + t, 804, 430 + i * 80, 22, { weight: 900, color: C.bad }); text(ctx, s, 804, 456 + i * 80, 17, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 7) label(ctx, "1.095 baris: periksa dulu sebelum dihitung", 1230, 745, { size: 24 });
    },
    bersihkan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TANDAI, JANGAN HAPUS DIAM-DIAM; CATAT KEPUTUSANMU", 215);
      const n = reveal(l, 1.5, 1.8, 7);
      Tb.flow(ctx, 240, 255, 1440, Tb.STEPS, 6, { h: 110, active: 2 });
      const marks = {}; const order = ["6,1", "3,1", "2,0", "4,1", "5,1"]; order.slice(0, Math.max(0, n - 1)).forEach(k => marks[k] = "fix");
      Dq.table(ctx, 240, 390, [260, 220], ["tanggal", "curah hujan (mm)"], n >= 2 ? FIXED.map((r, i) => (order.slice(0, n - 1).some(k => k.startsWith(i + ",")) ? r : RAW[i])) : RAW, marks, { rh: 40 });
      Tb.note(ctx, 780, 400, 900, ["999 = tidak terukur (dari metadata): dilewati", "sel kosong: hari itu dilewati", "duplikat tanggal: disatukan", "1,5 cm → 15 mm: satuan diseragamkan", "−5 mm: tidak valid, dilewati", "dari 1095 baris, 1060 terpakai"], { n: Math.max(0, n - 1) });
    },
    agregasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 4 · OLAH: SERIBU BARIS MENJADI DUA BELAS", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      Tb.flow(ctx, 240, 255, 1440, Tb.STEPS, 6, { h: 110, active: 3 });
      const rows = Tb.BULAN.map((m, i) => [m, String(Tb.HARI_HUJAN[i])]); const shown = Math.min(12, Math.max(0, (n - 1) * 3));
      Dq.table(ctx, 240, 390, [160, 200], ["bulan", "hari hujan (rata-rata 3 thn)"], rows.slice(0, shown).concat(Array(12 - shown).fill(["", ""])), shown >= 12 ? { "7,0": "fix", "7,1": "fix" } : {}, { rh: 28 });
      if (n >= 2) { card(ctx, 660, 400, 1020, 110, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); text(ctx, "LEMBAR KERJA", 684, 432, 16, { weight: 900, color: C.ink2 }); text(ctx, '=COUNTIFS(hujan; ">0"; bulan; "Agu")', 684, 476, 24, { weight: 900, color: C.kiko }); }
      if (n >= 4) { card(ctx, 660, 530, 1020, 130, { fill: "#1F2A33", r: 12 }); text(ctx, "PYTHON", 684, 562, 16, { weight: 900, color: "#8FD0E6" }); text(ctx, "hari_hujan = data[data.mm > 0]", 684, 600, 22, { weight: 800, color: "#fff" }); text(ctx, "hari_hujan.groupby(\"bulan\").size()", 684, 636, 22, { weight: 800, color: "#fff" }); }
      if (n >= 6) label(ctx, "tabel kecil yang bisa dibaca sekali lihat", 1170, 715, { size: 24 });
    },
    ukuran(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PILIH UKURAN DENGAN SADAR: RATA-RATA, MEDIAN, HARI HUJAN", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      [["Bulan A", A_DAYS, ["8 mm", "0 mm", "2 hari"]], ["Bulan B", B_DAYS, ["10 mm", "10 mm", "30 hari"]]].forEach(([t, d, st], i) => { const x = 240 + i * 740; card(ctx, x, 270, 700, 400, { fill: C.bg2, r: 16 }); text(ctx, t, x + 24, 310, 26, { weight: 900 }); Tb.days(ctx, x + 24, 330, 650, d, { label: "30 hari · tinggi batang = curah hujan" });
        [["rata-rata", 0], ["median", 1], ["hari hujan", 2]].forEach(([k, j]) => { ctx.save(); if (n < j + 2) ctx.globalAlpha = 0.2; const on = n >= 5 && j === 2; card(ctx, x + 24 + j * 220, 480, 200, 90, { fill: on ? "#FFF3D6" : "#fff", stroke: on ? C.accent : "#B7C4CC", lw: on ? 4 : 2, r: 12 }); text(ctx, k, x + 124 + j * 220, 512, 18, { align: "center", weight: 800, color: C.ink2 }); text(ctx, st[j], x + 124 + j * 220, 552, 28, { align: "center", weight: 900, color: on ? C.accentDark : C.ink }); ctx.restore(); });
        if (n >= 2 && i === 0) text(ctx, "satu badai 200 mm menaikkan rata-rata", x + 24, 620, 19, { weight: 800, color: C.bad }); if (n >= 2 && i === 1) text(ctx, "gerimis hampir tiap hari", x + 24, 620, 19, { weight: 800, color: C.kiko }); });
      if (n >= 6) label(ctx, "untuk kemah: hari hujan, bukan derasnya; pertanyaan menentukan ukuran", 960, 720, { size: 24 });
    },
    grafik(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 5 · GAMBARKAN DENGAN JUJUR", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      Lb.barChart(ctx, 240, 260, 900, 400, Tb.BULAN.map((m, i) => [m, Tb.HARI_HUJAN[i]]), { hl: 7, title: "hari hujan per bulan (rata-rata 2023–2025)", values: false });
      text(ctx, "sumber: Portal Data Terbuka Kota Sukamaju (fiktif), curah hujan harian 2023–2025", 240, 690, 16, { weight: 700, color: C.ink2 });
      if (n >= 2) Lb.lineChart(ctx, 1180, 260, 500, 220, [["2023", 4], ["2024", 2], ["2025", 3]], { title: "hari hujan Agustus per tahun", n: Math.min(3, n - 1) });
      if (n >= 4) Tb.cutBars(ctx, 1180, 500, 500, 190, [["Jul", 45], ["Agu", 42]], 40, { title: "✕ sumbu mulai dari 40: menyesatkan", bad: true });
      if (n >= 6) { ["sumbu dari nol", "label + satuan", "sumber ditulis"].forEach((s, i) => { card(ctx, 240 + i * 300, 710, 280, 50, { fill: C.goodBg, stroke: C.good, lw: 2, r: 10 }); text(ctx, "✓ " + s, 380 + i * 300, 743, 20, { align: "center", weight: 900, color: C.good }); }); }
    },
    keputusan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 6 · PUTUSKAN, DENGAN KEYAKINAN DAN CADANGAN", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      Tb.flow(ctx, 240, 255, 1440, Tb.STEPS, 6, { h: 110, active: 5 });
      card(ctx, 240, 400, 820, 290, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "REKOMENDASI UNTUK OSIS", 264, 440, 20, { weight: 900, color: C.accentDark });
      if (n >= 2) para(ctx, "Kemah sekolah: minggu kedua Agustus. Agustus memiliki hari hujan paling sedikit di ketiga tahun (3 hari rata-rata).", 264, 480, 24, 770, { weight: 900 });
      if (n >= 3) Tb.confidence(ctx, 264, 590, 400, 0.78);
      if (n >= 4) { text(ctx, "risiko: tetap bisa hujan", 720, 600, 20, { weight: 900, color: C.bad }); text(ctx, "cadangan: tenda tambahan,", 720, 630, 19, { weight: 800, color: C.ink2 }); text(ctx, "tanggal pengganti minggu ketiga", 720, 656, 19, { weight: 800, color: C.ink2 }); }
      if (n >= 5) { card(ctx, 1100, 400, 580, 290, { fill: C.bg2, r: 16 }); text(ctx, "yang membuat keputusan ini kuat", 1390, 440, 20, { align: "center", weight: 900, color: C.ink2 }); ["pertanyaan jelas", "data 3 tahun dari lembaga pengukur", "ukuran yang tepat: hari hujan", "keyakinan dan risiko disebut"].forEach((s, i) => text(ctx, "✓ " + s, 1130, 490 + i * 44, 22, { weight: 800, color: C.good })); }
      if (n >= 6) label(ctx, "keputusan dari data selalu menyebut keyakinannya", 960, 740, { size: 24 });
    },
    etika_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "DATA TERBUKA BUKAN DATA BEBAS", 215);
      const n = reveal(l, 1.5, 2.4, 4);
      [["📜", "patuhi lisensi, sebut sumber", "“Sumber: Portal Data Terbuka Kota Sukamaju, 2026”"], ["🫥", "jangan sampai orang dikenali", "data per orang → dirangkum per kelompok atau dianonimkan"], ["🙅", "data pribadi teman bukan data terbuka", "nilai, alamat, nomor HP: butuh izin, bukan portal"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 240 + i * 490; card(ctx, x, 280, 460, 340, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 230, 370, 64, { align: "center" }); para(ctx, t, x + 230, 440, 24, 420, { align: "center", weight: 900 }); para(ctx, s, x + 230, 520, 19, 420, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 2) { Dq.table(ctx, 760, 640, [120, 110], ["nama", "nilai"], [["Rani", "92"], ["Dito", "61"]], { "0,0": "bad", "1,0": "bad" }, { rh: 30 }); arrowIcon(ctx, "right", 1010, 690, 36, C.good); Dq.table(ctx, 1060, 640, [150, 110], ["kelas", "rata-rata"], [["XI-1", "78"], ["XI-2", "81"]], { "0,0": "fix", "1,0": "fix" }, { rh: 30 }); }
    },
    batas_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "KENALI BATAS DATA", 215);
      const n = reveal(l, 1.5, 2.2, 5);
      [["↗↗", "naik bersama ≠ sebab-akibat", "penjualan jas hujan naik dan nilai ujian turun di bulan yang sama: keduanya dipengaruhi musim, bukan saling menyebabkan"], ["📅", "data lama ≠ jaminan", "tiga tahun kering bukan janji tahun depan kering"], ["📍", "alat ukur punya jarak", "stasiun cuaca 12 km dari lokasi kemah di bukit"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 240 + i * 490; card(ctx, x, 280, 460, 330, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 230, 360, 48, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 230, 420, 24, 420, { align: "center", weight: 900 }); para(ctx, s, x + 230, 480, 18, 420, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) { card(ctx, 240, 640, 1440, 60, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, "Keterbatasan: data dari satu stasiun, 2023–2025; nilai 999 dan sel kosong (35 baris) dilewati.", 960, 678, 20, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 5) label(ctx, "menulis keterbatasan adalah tanda analisis yang jujur", 960, 745, { size: 26 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pembersih data", "temukan baris bermasalah, pilih tindakan", (x, y) => Dq.table(ctx, x - 220, y - 110, [200, 180], ["tanggal", "mm"], [["2025-08-04", "1,5 cm"], ["2025-08-05", "-5"], ["2025-08-06", "3"]], { "0,1": "bad", "1,1": "bad" }, { rh: 40 })],
        ["Ukuran dan grafik", "cocokkan dengan pertanyaannya", (x, y) => { Lb.barChart(ctx, x - 220, y - 120, 440, 220, [["Jun", 7], ["Jul", 5], ["Agu", 3], ["Sep", 6]], { hl: 2 }); }],
        ["Pembuat keputusan", "baca grafik, pilih rekomendasi + keyakinan", (x, y) => { card(ctx, x - 220, y - 110, 440, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); para(ctx, "kemah minggu kedua Agustus, cadangan minggu ketiga", x, y - 70, 20, 400, { align: "center", weight: 900 }); Tb.confidence(ctx, x - 200, y + 40, 400, 0.78); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 380, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu satu set data terbuka sungguhan untuk sekolahmu", 960, 745, 26, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
