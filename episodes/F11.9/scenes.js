/* Adegan episode F11.9: Merancang Kebutuhan Sistem Komputer. Gaya diagram Fase F. Semua merek, harga, dan tokoh fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, komputer.js, spek.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, M = K.komp, Sp = K.spek, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const P = [{ nama: "Bu Rina", ic: "👩‍🏫", peran: "guru Bahasa Indonesia", pakai: ["mengetik dan lembar kerja", "20 tab browser", "rapat video"], beban: "ringan, banyak aplikasi", col: "#2E7E9A" },
             { nama: "Dito", ic: "🎬", peran: "tim video lomba sekolah", pakai: ["menyunting video 4K", "file besar tiap minggu", "efek dan animasi"], beban: "berat: prosesor + grafis", col: "#8E6BBF" },
             { nama: "Lab XI", ic: "🖥️", peran: "kelas pemrograman", pakai: ["Python dan editor kode", "server kecil", "36 murid bergantian"], beban: "seragam, andal, mudah dirawat", col: "#2E9E5B" }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); kiko(ctx, 260, 560, 160, 0, { mood: "think" });
      const n = reveal(l, 1.5, 1.3, 6);
      const steps = [["👤", "pengguna", "dan beban kerja"], ["🧩", "komponen", "dari beban"], ["📋", "spesifikasi", "baca satuannya"], ["💰", "anggaran", "lima tahun"], ["📝", "rekomendasi", "dengan alasan"]];
      steps.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 460 + i * 260; card(ctx, x, 290, 240, 260, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 16 }); text(ctx, ic, x + 120, 380, 56, { align: "center" }); text(ctx, t, x + 120, 450, 24, { align: "center", weight: 900 }); text(ctx, s, x + 120, 488, 18, { align: "center", weight: 800, color: C.ink2 }); if (i < 4) arrowIcon(ctx, "right", x + 250, 420, 22, "#B7C4CC"); ctx.restore(); });
      if (n >= 6) banner(ctx, "merancang, bukan menebak: paling mahal belum tentu paling tepat", 640, 1200, { size: 28 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.2", "Mengenal Komputer: Perjalanan Satu Ketukan"], ["E.2", "Peran Sistem Operasi"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_wawancara(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU: WAWANCARA PENGGUNA, HANYA BERTANYA", 215);
      const n = reveal(l, 1.5, 1.9, 6);
      kid(ctx, 320, 600, 150, { hair: "short" }); text(ctx, "perancang", 320, 772, 20, { align: "center", weight: 800, color: C.ink2 });
      kid(ctx, 1600, 600, 150, { hair: "long" }); text(ctx, "guru pengguna", 1600, 772, 20, { align: "center", weight: 800, color: C.ink2 });
      const Q = [["untuk apa dipakai?", "mengetik, lembar kerja, rapat video"], ["program apa saja?", "browser 20 tab, aplikasi rapat"], ["berapa lama sehari?", "6 jam"], ["berapa file?", "sedikit, kebanyakan di cloud sekolah"]];
      Q.forEach(([q, a], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.15; const y = 310 + i * 95; bubble(ctx, 450, y, 400, q, 20, { tailX: 400 }); card(ctx, 980, y + 6, 480, 56, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 2, r: 12 }); text(ctx, a, 1220, y + 42, 18, { align: "center", weight: 800 }); ctx.restore(); });
      if (n >= 6) label(ctx, "jawaban ditulis menjadi satu kartu profil pengguna", 960, 735, { size: 24 });
    },
    unplugged_iklan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BEDAH IKLAN: LINGKARI, TANDAI, CORET", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      const items = ["Prosesor 8 inti 4,9 GHz", "RAM 32 GB", "SSD 1 TB", "Kartu grafis gaming RGB", "Layar 165 Hz"];
      const marks = n >= 2 ? { 0: "?", 1: "ok", 2: "ok" } : {}; if (n >= 3) { marks[3] = "x"; marks[4] = "x"; }
      Sp.brochure(ctx, 240, 270, 700, 400, "PROMO SUPER! LAPTOP ZETA X9 (fiktif)", items, marks);
      if (n >= 4) Sp.profile(ctx, 1000, 270, 680, P[0], { h: 260 });
      if (n >= 5) banner(ctx, "iklan menjual angka; perancang membeli kebutuhan", 580, 760, { size: 26 });
      if (n >= 6) label(ctx, "untuk Bu Rina, kartu grafis gaming dan layar 165 Hz tak terpakai", 1340, 590, { size: 20 });
    },
    profil(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 1 · PROFIL PENGGUNA DAN BEBAN KERJA", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      P.forEach((p, i) => Sp.profile(ctx, 220 + i * 510, 280, 480, p, { dim: i >= n, on: n === i + 1, h: 330 }));
      if (n >= 4) banner(ctx, "beban kerja berbeda, kebutuhan berbeda", 660, 900);
    },
    beban_ke_komponen(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 2 · TERJEMAHKAN BEBAN KE KOMPONEN", 215);
      const n = reveal(l, 1.5, 2.0, 5);
      const rows = [["banyak tab dan aplikasi bersamaan", "RAM", "ram"], ["menyunting video", "prosesor + kartu grafis", "cpu"], ["file besar", "penyimpanan (SSD)", "ssd"], ["lab: banyak murid", "jaringan andal, perawatan mudah", "net"]];
      rows.forEach(([beban, komp, kind], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.18; const y = 280 + i * 110; card(ctx, 240, y, 620, 90, { fill: C.bg2, r: 14 }); text(ctx, beban, 270, y + 54, 24, { weight: 900 }); arrowIcon(ctx, "right", 900, y + 45, 34, C.accent); card(ctx, 960, y, 720, 90, { fill: i === n - 1 ? "#FFF3D6" : "#fff", stroke: i === n - 1 ? C.accent : "#B7C4CC", lw: 3, r: 14 }); text(ctx, komp, 1000, y + 54, 26, { weight: 900, color: C.kiko }); ctx.restore(); });
      if (n >= 5) label(ctx, "pertanyaan: beban apa yang paling berat untuk pengguna ini?", 960, 740, { size: 24 });
    },
    komponen(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ENAM KOMPONEN UTAMA", 215);
      const n = reveal(l, 1.5, 1.7, 6);
      const parts = [["cpu", "Prosesor (CPU)", "otak · jumlah inti, GHz"], ["ram", "RAM", "meja kerja · GB"], ["ssd", "Penyimpanan", "lemari · SSD jauh lebih cepat dari HDD"], ["gpu", "Kartu grafis", "video, gim, grafik berat"], ["layar", "Layar", "ukuran, resolusi"], ["net", "Jaringan", "kabel LAN atau Wi-Fi"]];
      parts.forEach(([k, t, s], i) => Sp.part(ctx, 200 + (i % 3) * 520, 270 + Math.floor(i / 3) * 250, 480, 230, k, t, s, { dim: i >= n, on: n === i + 1 }));
    },
    baca_spek(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MEMBACA SPESIFIKASI: SATUAN ITU PENTING", 215);
      const n = reveal(l, 1.5, 1.9, 6);
      Sp.sheet(ctx, 240, 270, 760, [["Prosesor", "6 inti, 4,2 GHz", "banyak inti = banyak kerja bersamaan"], ["RAM", "8 GB", "GB memori kerja"], ["Penyimpanan", "SSD 512 GB", "GB tempat simpan"], ["Kartu grafis", "bawaan", "cukup untuk mengetik"]], { hl: clamp(n - 1, 0, 3), title: "LAPTOP A (fiktif)" });
      [["8 GB RAM ≠ 8 GB penyimpanan", "satuan sama, peran beda"], ["GHz bukan segalanya", "jumlah inti dan generasi juga penting"], ["SSD 512 GB terasa lebih cepat", "daripada HDD 2 TB untuk pemakaian harian"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 4) ctx.globalAlpha = 0.2; card(ctx, 1060, 280 + i * 120, 620, 100, { fill: n === i + 4 ? "#FFF3D6" : C.bg2, stroke: n === i + 4 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, t, 1084, 322 + i * 120, 23, { weight: 900 }); text(ctx, s, 1084, 356 + i * 120, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    minimum_anjuran(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MINIMUM ATAU YANG DIANJURKAN?", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      Sp.sheet(ctx, 240, 270, 720, [["RAM", "8 GB", "minimum"], ["RAM", "16 GB", "dianjurkan", true], ["penyimpanan kosong", "50 GB", "minimum"], ["penyimpanan kosong", "200 GB", "dianjurkan", true]], { title: "PENYUNTING VIDEO ZEDIT (fiktif): KEBUTUHAN", hl: n >= 3 ? 1 : null });
      if (n >= 2) Sp.warn(ctx, 1020, 290, 660, "minimum = bisa jalan, sering tersendat");
      if (n >= 3) Sp.warn(ctx, 1020, 370, 660, "rancang untuk yang dianjurkan", { ok: true });
      if (n >= 4) { card(ctx, 1020, 460, 660, 160, { fill: C.bg2, r: 14 }); text(ctx, "ruang untuk 3–5 tahun", 1350, 500, 24, { align: "center", weight: 900 }); text(ctx, "program makin berat tiap tahun", 1350, 540, 19, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "RAM dan penyimpanan paling cepat kurang", 1350, 580, 19, { align: "center", weight: 800, color: C.bad }); }
      if (n >= 6) label(ctx, "beli sekali, pakai lama: rancang ke depan", 960, 720, { size: 26 });
    },
    tiga_spek(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TIGA PROFIL, TIGA RANCANGAN", 215);
      const n = reveal(l, 1.5, 2.4, 4);
      const S = [[["Prosesor", "hemat 4 inti"], ["RAM", "8 GB"], ["SSD", "256 GB"], ["Grafis", "bawaan"]], [["Prosesor", "kencang 8 inti"], ["RAM", "16 GB"], ["SSD", "1 TB"], ["Grafis", "terpisah"]], [["Prosesor", "6 inti, seragam"], ["RAM", "8 GB"], ["SSD", "256 GB"], ["Jaringan", "kabel LAN"]]];
      P.forEach((p, i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.18; Sp.sheet(ctx, 220 + i * 510, 280, 480, S[i], { title: p.ic + " " + p.nama, color: p.col, stroke: p.col, rh: 56 }); ctx.restore(); });
      if (n >= 4) banner(ctx, "bukan satu spesifikasi untuk semua", 640, 900);
    },
    anggaran(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 4 · ANGGARAN LIMA TAHUN, BUKAN HARGA HARI INI", 215);
      const n = reveal(l, 1.5, 1.4, 9);
      const parts = [["perangkat", 80, "#2E7E9A"], ["lisensi", 12, "#8E6BBF"], ["garansi", 8, "#2E9E5B"], ["listrik", 10, "#B57A12"], ["perawatan", 8, "#D9443B"], ["pelatihan", 4, "#5A6B75"], ["cadangan 10%", 12, "#E0B04B"]];
      Sp.budget(ctx, 240, 320, 1440, parts, { n: Math.max(1, n - 1), max: 134, label: "10 komputer lab · 5 tahun (angka fiktif)", shown: parts.slice(0, Math.max(1, n - 1)).reduce((a, p) => a + p[1], 0) });
      parts.forEach(([t, v, col], i) => { ctx.save(); if (i >= n - 1) ctx.globalAlpha = 0.2; card(ctx, 240 + (i % 4) * 365, 430 + Math.floor(i / 4) * 110, 340, 90, { fill: "#fff", stroke: col, lw: 3, r: 12 }); text(ctx, t, 264 + (i % 4) * 365, 468 + Math.floor(i / 4) * 110, 22, { weight: 900, color: col }); text(ctx, "Rp " + v + " juta", 264 + (i % 4) * 365, 500 + Math.floor(i / 4) * 110, 19, { weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 9) label(ctx, "harga perangkat hanya sekitar 60% dari biaya lima tahun", 960, 720, { size: 24 });
    },
    tukar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ANGGARAN TERBATAS: MENUKAR DENGAN ALASAN", 215);
      const n = reveal(l, 1.5, 2.2, 5);
      [["kartu grafis terpisah", "RAM 16 GB", "Bu Rina tidak menyunting video"], ["layar 27 inci", "SSD", "terasa cepat setiap hari"], ["10 komputer tersendat", "8 komputer bagus", "lab dipakai bergantian, bukan sekaligus"]].forEach(([a, c, why], i) => { ctx.save(); if (i >= n - 1 && n < 5) ctx.globalAlpha = i >= n ? 0.15 : 1; const y = 280 + i * 130; card(ctx, 240, y, 400, 100, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "− " + a, 440, y + 60, 23, { align: "center", weight: 900, color: C.bad }); arrowIcon(ctx, "right", 680, y + 50, 34, C.accent); card(ctx, 730, y, 400, 100, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "+ " + c, 930, y + 60, 23, { align: "center", weight: 900, color: C.good }); text(ctx, "alasan: " + why, 1170, y + 60, 20, { weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 5) banner(ctx, "setiap penukaran ditulis alasannya", 680, 900);
    },
    rekomendasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LANGKAH 5 · REKOMENDASI SATU HALAMAN", 215);
      const n = reveal(l, 1.5, 1.6, 8);
      card(ctx, 600, 260, 720, 470, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); text(ctx, "REKOMENDASI: KOMPUTER LAB XI", 960, 300, 22, { align: "center", weight: 900, color: C.kiko });
      ["1. profil pengguna dan beban kerja", "2. spesifikasi + alasan tiap komponen", "3. anggaran lima tahun", "4. alternatif A: 8 komputer lengkap", "5. alternatif B: 10 komputer, RAM 8 GB", "6. risiko dan siapa yang merawat"].forEach((s, i) => { ctx.save(); if (i >= n - 1) ctx.globalAlpha = 0.2; ctx.fillStyle = i === n - 2 ? "#FFF3D6" : C.bg2; rr(ctx, 630, 330 + i * 62, 660, 50, 10); ctx.fill(); text(ctx, s, 650, 362 + i * 62, 21, { weight: 800 }); ctx.restore(); });
      if (n >= 8) label(ctx, "pembaca bisa memutuskan tanpa bertanya lagi", 960, 760, { size: 24 });
    },
    jebakan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "JEBAKAN YANG SERING TERJADI", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      [["📈", "membeli angka terbesar", "bukan kebutuhan"], ["🔑", "lupa lisensi", "sistem operasi, aplikasi"], ["🛠️", "abaikan garansi", "dan layanan purnajual"], ["🎮", "kartu grafis untuk pengetik", "uang tak terpakai"], ["🙋", "siapa yang merawat?", "tidak ditanyakan"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.18; const x = 200 + i * 310; card(ctx, x, 290, 290, 280, { fill: i === n - 1 ? C.badBg : C.bg2, stroke: i === n - 1 ? C.bad : undefined, lw: 3, r: 16 }); text(ctx, ic, x + 145, 380, 52, { align: "center" }); para(ctx, t, x + 145, 440, 22, 260, { align: "center", weight: 900 }); text(ctx, s, x + 145, 535, 17, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) banner(ctx, "rancangan yang baik menjawab semuanya sebelum ditanya", 640, 1100, { size: 28 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Konfigurator", "profil → komponen → anggaran", (x, y) => { Sp.budget(ctx, x - 210, y - 60, 420, [["", 9, "#2E7E9A"], ["", 2, "#8E6BBF"], ["", 2, "#2E9E5B"]], { max: 15, total: false }); Sp.warn(ctx, x - 210, y + 20, 420, "RAM kurang untuk 20 tab"); }],
        ["Pembaca spesifikasi", "angka ↔ artinya", (x, y) => Sp.sheet(ctx, x - 210, y - 120, 420, [["RAM", "16 GB", ""], ["SSD", "512 GB", ""]], { rh: 46, title: "LAPTOP B" })],
        ["Penyusun anggaran", "biaya lima tahun yang terlewat", (x, y) => [["perangkat", true], ["lisensi", false], ["garansi", false]].forEach(([t, ok], i) => { card(ctx, x - 200, y - 110 + i * 64, 400, 54, { fill: ok ? C.goodBg : "#FFF3D6", r: 10 }); text(ctx, (ok ? "✓ " : "＋ ") + t, x, y - 76 + i * 64, 22, { align: "center", weight: 900, color: ok ? C.good : C.accentDark }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 380, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu wawancarai satu guru dan susun rekomendasinya", 960, 745, 24, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
