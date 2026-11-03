/* Adegan episode D8.5: Fakta, Opini, dan Hoaks. Muat setelah kiko-core.js, kiko-devices.js, hoaks.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.hoaks, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const HOAX = "UJIAN BESOK DIBATALKAN!!! Sebarkan ke semua sekarang juga!";
  const ROWS = [1, 3, 9, 27, 81];
  const cum = n => ROWS.slice(0, n + 1).reduce((a, b) => a + b, 0);

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const items = [["FAKTA", "bisa dicek", C.good, C.goodBg], ["OPINI", "pendapat, boleh beda", C.kiko, "#DCEBF2"], ["HOAKS", "bohong menyamar fakta", C.bad, C.badBg]];
      const n = reveal(l, 0.6, 1.3, 3);
      items.forEach(([t, s, col, bg], i) => { if (i < n) { card(ctx, 620 + i * 380, 280, 340, 260, { fill: bg, stroke: col, lw: 5 }); text(ctx, t, 790 + i * 380, 380, 44, { align: "center", weight: 900, color: col }); text(ctx, s, 790 + i * 380, 450, 26, { align: "center", weight: 800, color: C.ink2 }); } });
      if (l > 5) Q.msg(ctx, 620, 600, 1100, HOAX, { who: "Grup 8B · diteruskan 16 kali", fill: C.badBg, stroke: C.bad, color: C.bad, size: 26 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D8.4", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Menilai Informasi dan Ekosistem Pers Digital", 960, 500, 44, { align: "center", weight: 700, color: C.ink2 });
      ["Siapa sumbernya", "Apa buktinya", "Sumber lain sepakat"].forEach((s, i) => { card(ctx, 420 + i * 380, 580, 340, 120, { fill: C.bg2 }); text(ctx, s, 590 + i * 380, 652, 28, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_sort(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER: PILAH KARTU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      card(ctx, 200, 280, 740, 440, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "BISA DICEK", 570, 330, 28, { align: "center", weight: 900, color: C.good });
      card(ctx, 980, 280, 740, 440, { fill: "#DCEBF2", stroke: C.kiko, lw: 4 }); text(ctx, "PENDAPAT", 1350, 330, 28, { align: "center", weight: 900, color: C.kiko });
      const n = reveal(l, 1.0, 1.0, 6);
      const cards = [["Kantin buka jam 09.00", 0], ["Kantin kita paling enak", 1], ["Kelas 8B ada 32 murid", 0], ["Pelajaran olahraga paling seru", 1], ["Upacara tiap Senin", 0], ["Seragam kita paling keren", 1]];
      let yl = 360, yr = 360; cards.slice(0, n).forEach(([s, k]) => { if (k === 0) { Q.sentence(ctx, 240, yl, 660, s, null, { size: 24, h: 60 }); yl += 74; } else { Q.sentence(ctx, 1020, yr, 660, s, null, { size: 24, h: 60 }); yr += 74; } });
      if (n >= 6) label(ctx, "bisa dicek = ada bukti; pendapat = boleh beda", 960, 790, { size: 26, color: C.ink2 });
    },
    unplugged_fake(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.sentence(ctx, 300, 260, 600, "Kantin buka jam 09.00", "fakta", { size: 26, h: 70 });
      Q.sentence(ctx, 300, 370, 600, "Kantin kita paling enak", "opini", { size: 26, h: 70 });
      if (l > 1.5) { Q.sentence(ctx, 300, 480, 600, "Kantin tutup selamanya mulai besok!", l > 4 ? "hoaks" : null, { size: 26, h: 70 }); text(ctx, "kartu nakal: terdengar bisa dicek,", 1240, 500, 26, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "padahal dikarang", 1240, 540, 26, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > 4) { kid(ctx, 1240, 340, 140, { point: true }); bubble(ctx, 1320, 230, 320, "eh, beneran?!", 28, { tailX: 1300, tailDir: 20, fill: C.badBg, stroke: C.bad, color: C.bad }); }
      if (l > 7) banner(ctx, "HOAKS: bohong yang menyamar jadi fakta", 745, 900, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },

    three_kinds(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "TIGA JENIS KALIMAT", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const items = [["FAKTA", ["bisa dicek dengan bukti", "benar atau salahnya jelas", "contoh: suhu, jumlah, jam"], C.good, C.goodBg], ["OPINI", ["pendapat atau perasaan", "orang boleh berbeda", "kata kunci: menurutku, paling, lebih"], C.kiko, "#DCEBF2"], ["HOAKS", ["kabar bohong", "sengaja dibuat seolah fakta", "tidak ada buktinya"], C.bad, C.badBg]];
      const n = reveal(l, 0.8, 1.6, 3);
      items.forEach(([t, ls, col, bg], i) => { if (i < n) { card(ctx, 200 + i * 520, 280, 480, 400, { fill: bg, stroke: col, lw: 5 }); text(ctx, t, 440 + i * 520, 350, 40, { align: "center", weight: 900, color: col }); ls.forEach((s, k) => text(ctx, "• " + s, 240 + i * 520, 420 + k * 50, 24, { weight: 800 })); } });
      if (n >= 3) banner(ctx, "pertanyaannya: bisa dicek? ada buktinya?", 745, 900);
    },
    sort_examples(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.8, 1.8, 3);
      const ex = [["Suhu kelas 31 derajat", "fakta", "ada termometer"], ["Kelas kita terlalu panas", "opini", "'terlalu' = perasaan, boleh beda"], ["Sekolah akan dipindah ke bulan", "hoaks", "tidak ada bukti, tidak masuk akal"]];
      ex.slice(0, n).forEach(([s, k, why], i) => { Q.sentence(ctx, 240, 250 + i * 160, 800, s, k, { size: 30, h: 90 }); text(ctx, why, 1100, 305 + i * 160, 26, { weight: 800, color: k === "fakta" ? C.good : k === "opini" ? C.kiko : C.bad }); });
      if (n >= 3) banner(ctx, "cek buktinya, bukan kerasnya suara", 745, 800);
    },

    five_signs(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "LIMA CIRI HOAKS", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.2, 5);
      Q.signs(ctx, 460, 280, 1000, [], { n, hl: n - 1 });
      if (n >= 5) label(ctx, "makin banyak centang, makin curiga", 960, 700, { size: 26, color: C.bad });
    },
    signs_apply(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.msg(ctx, 180, 240, 640, HOAX, { who: "Grup 8B · Fwd", fill: C.badBg, stroke: C.bad, color: C.bad, size: 28 });
      const n = reveal(l, 0.8, 1.1, 5);
      Q.signs(ctx, 880, 240, 820, [true, true, true, true, true].slice(0, n), { hl: n - 1 });
      ["\"sekarang juga\"", "tanpa nama pengirim pertama", "bikin senang: libur!", "\"sebarkan ke semua\"", "tidak ada pengumuman sekolah"].slice(0, n).forEach((s, i) => text(ctx, s, 200, 480 + i * 44, 24, { weight: 800, color: C.bad }));
      if (n >= 5) banner(ctx, "lima ciri, lima centang: HOAKS", 745, 800, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },

    spread_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "JARINGAN PERTEMANAN: TIAP ORANG PUNYA 3 TEMAN", 960, 230, 32, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.5, 2.0, 2);
      Q.spreadTree(ctx, 360, 300, 1200, 280, n, { counts: true });
      if (n >= 1) text(ctx, "1 orang mengirim ke 3 teman", 960, 600, 26, { align: "center", weight: 800, color: C.ink2 });
      if (n >= 2) text(ctx, "tiap teman mengirim lagi ke 3 teman", 960, 650, 26, { align: "center", weight: 800, color: C.ink2 });
    },
    spread_run(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 1.0, 5) - 1;
      Q.spreadTree(ctx, 360, 230, 1200, 440, n, { counts: true });
      text(ctx, ROWS.slice(0, n + 1).join(" → "), 960, 730, 32, { align: "center", weight: 900, color: C.bad });
      if (n >= 4) { Q.counter(ctx, 1480, 240, 260, cum(4), "orang menerima", C.bad); label(ctx, "lima putaran saja", 1610, 400, { size: 24, color: C.ink2 }); }
      if (l > 7) banner(ctx, "itu sebabnya hoaks terasa ada di mana-mana dalam sekejap", 745, 1100, { size: 30 });
    },

    compare_share(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "PILIHAN 1: SEMUA LANGSUNG MEMBAGIKAN", 960, 230, 32, { align: "center", color: C.bad, weight: 900 });
      const n = reveal(l, 0.6, 0.8, 5) - 1;
      Q.spreadTree(ctx, 300, 290, 1000, 400, n, { counts: true });
      Q.counter(ctx, 1400, 300, 300, cum(n), "percaya hoaks", C.bad);
      if (n >= 4) { for (let i = 0; i < 6; i++) { ctx.save(); ctx.globalAlpha = i % 2 ? 0.25 : 1; kid(ctx, 1420 + i * 50, 560, 50, { hair: i % 2 ? "long" : undefined }); ctx.restore(); } text(ctx, "besok: separuh kelas tidak datang", 1550, 650, 22, { align: "center", weight: 900, color: C.bad }); }
    },
    compare_check(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "PILIHAN 2: TIAP ORANG PERIKSA DULU", 960, 230, 32, { align: "center", color: C.good, weight: 900 });
      const n = reveal(l, 0.6, 1.0, 2) - 1;
      Q.spreadTree(ctx, 300, 290, 1000, 400, Math.min(n, 1), { counts: true, color: C.good, stop: n >= 1 ? [0, 0] : undefined });
      if (n >= 1) { [0, 1, 2].forEach(i => { const px = 300 + (i + 0.5) * (1000 / 3); text(ctx, "periksa dulu ✓", px, 420, 20, { align: "center", weight: 900, color: C.good }); }); }
      Q.counter(ctx, 1400, 300, 300, n >= 1 ? 3 : 1, "membaca", C.kiko); Q.counter(ctx, 1400, 440, 300, 0, "tertipu", C.good);
      if (l > 4) { bubble(ctx, 1380, 720, 340, "\"Bu, ujian besok jadi?\" \"Jadi.\"", 22, { tailX: 1400, tailDir: -160 }); }
      if (l > 7) banner(ctx, "satu kebiasaan, hasilnya jauh berbeda", 745, 900, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    compare_one(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "KALAU HANYA KAMU YANG BERHENTI", 960, 230, 32, { align: "center", color: C.accentDark, weight: 900 });
      const n = reveal(l, 0.6, 0.9, 5) - 1;
      const r = Q.spreadTree(ctx, 300, 290, 1000, 400, n, { counts: true, stop: [1, 1] });
      if (n >= 1) { text(ctx, "kamu: periksa dulu", 800, 330, 22, { align: "center", weight: 900, color: C.good }); }
      const saved = n >= 4 ? 3 + 9 + 27 : n >= 3 ? 3 + 9 : n >= 2 ? 3 : 0;
      Q.counter(ctx, 1400, 300, 300, saved, "tidak jadi menerima", C.good);
      if (n >= 4) banner(ctx, "satu orang yang periksa dulu = puluhan orang selamat", 745, 1000, { fill: C.goodBg, stroke: C.good, color: C.good, size: 30 });
    },

    check_how(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "CARA MEMERIKSA: TIGA LANGKAH CEPAT", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.6, 3);
      const steps = [["Cari sumber resminya", "pengumuman sekolah, situs pemerintah, media pers"], ["Cari di mesin pencari", "kata kunci + kata \"hoaks\""], ["Tanya yang berwenang", "wali kelas, guru piket, orang tua"]];
      steps.forEach(([t, s], i) => { if (i < n) { card(ctx, 200 + i * 520, 290, 480, 300, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 16 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(440 + i * 520, 350, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 440 + i * 520, 360, 28, { align: "center", color: "#fff", weight: 900 }); text(ctx, t, 440 + i * 520, 430, 28, { align: "center", weight: 900 }); para(ctx, s, 440 + i * 520, 480, 22, 420, { align: "center", weight: 700, color: C.ink2, lh: 1.3 }); } });
      if (n >= 2) { card(ctx, 760, 620, 400, 60, { fill: C.panel, stroke: "#B7C4CC", lw: 3, r: 30 }); text(ctx, "🔍 ujian dibatalkan hoaks", 960, 659, 22, { align: "center", weight: 700 }); }
      if (n >= 3) label(ctx, "dua menit memeriksa, puluhan orang tidak tertipu", 960, 730, { size: 26, color: C.good });
    },
    check_reply(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const ph = D.phone(ctx, 560, 520, 380, 620);
      text(ctx, "Grup 8B", ph.x + 20, ph.y + 60, 24, { weight: 900 });
      Q.msg(ctx, ph.x + 16, ph.y + 80, ph.w - 32, HOAX, { who: "Fwd", fill: C.badBg, stroke: C.bad, color: C.bad, size: 18 });
      if (l > 1.5) Q.msg(ctx, ph.x + 40, ph.y + 250, ph.w - 56, "Aku sudah cek ke wali kelas: ujian tetap besok, ya. 🙂", { who: "Kamu", fill: C.goodBg, stroke: C.good, size: 18 });
      if (l > 4) Q.msg(ctx, ph.x + 16, ph.y + 400, ph.w - 32, "Oh iya, makasih! Hapus pesan tadi, ya.", { who: "Bayu", size: 18 });
      card(ctx, 900, 260, 760, 300, { fill: C.bg2 });
      ["✓ sebut sumber yang kamu cek", "✓ nada sopan, tanpa menyalahkan", "✓ satu kalimat, jelas"].forEach((s, i) => text(ctx, s, 940, 330 + i * 70, 28, { weight: 900, color: C.good }));
      if (l > 6.5) banner(ctx, "satu balasan menghentikan puluhan pesan berikutnya", 1280, 740, { size: 28, fill: C.goodBg, stroke: C.good, color: C.good });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pilah 12 kalimat", "fakta, opini, atau hoaks", (x, y) => { Q.sentence(ctx, x - 200, y - 90, 400, "Kantin buka jam 09.00", "fakta", { size: 20, h: 50 }); Q.sentence(ctx, x - 200, y - 20, 400, "Kantin paling enak", "opini", { size: 20, h: 50 }); Q.sentence(ctx, x - 200, y + 50, 400, "Kantin tutup selamanya!", "hoaks", { size: 20, h: 50 }); }],
        ["Centang ciri hoaks", "pada tiga pesan", (x, y) => { ctx.save(); ctx.translate(x - 190, y - 100); ctx.scale(0.6, 0.6); Q.signs(ctx, 0, 0, 640, [true, true, false, true, true], {}); ctx.restore(); }],
        ["Simulasi penyebaran", "bagikan vs periksa dulu", (x, y) => { Q.spreadTree(ctx, x - 200, y - 90, 400, 160, 3, { stop: [1, 1] }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 630, 26, { align: "center", weight: 900 }); text(ctx, t2, x, 668, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu buat kesepakatan grup kelasmu: periksa dulu", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
