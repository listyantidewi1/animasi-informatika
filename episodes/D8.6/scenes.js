/* Adegan episode D8.6: Proyek Cek Data, Cek Fakta. Muat setelah kiko-core.js, kiko-devices.js, cek.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.cek, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const CLAIM = "Murid kelas 8 lebih sering telat daripada kelas 7";
  const K7 = [3, 2, 4, 3, 6, 2, 3, 4, 3, 2], K8 = [3, 3, 4, 4, 7, 2, 3, 3, 4, 2];
  const NOTES = ["", "", "", "", "hujan deras", "", "", "", "", ""];
  const avg = a => Math.round(a.reduce((x, y) => x + y, 0) / a.length * 10) / 10;
  const DATA = n => [["Tanggal", "Kelas 7", "Kelas 8", "Catatan"], ...K7.slice(0, n).map((v, i) => ["Hari " + (i + 1), v, K8[i], NOTES[i]])];
  const STEPS = [["Rumuskan pertanyaan", "klaim → pertanyaan yang bisa dihitung"], ["Kumpulkan data", "apa, siapa, kapan, berapa lama"], ["Olah di lembar kerja", "AVERAGE, MAX, grafik"], ["Baca dan simpulkan", "benar, salah, belum cukup"], ["Sajikan", "lima slide, balas di grup"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      Q.claim(ctx, 620, 230, 1100, CLAIM, null, { size: 30, h: 90 });
      const n = reveal(l, 1.0, 0.9, 5);
      STEPS.forEach(([t], i) => { const x = 640 + i * 220; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.2; card(ctx, x, 360, 200, 200, { fill: C.bg2, r: 16 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 100, 410, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 100, 419, 24, { align: "center", color: "#fff", weight: 900 }); para(ctx, t, x + 100, 470, 20, 180, { align: "center", weight: 900, lh: 1.2 }); ctx.restore(); });
      if (l > 6) banner(ctx, "proyek akhir kelas delapan: cek data, cek fakta", 760, 1000, { size: 30 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D8.1", "Lembar Kerja Pengolah Data"], ["D8.4", "Menilai Informasi"], ["D8.5", "Fakta, Opini, dan Hoaks"]].forEach(([c, t], i) => { const x = 420 + i * 380; card(ctx, x, 360, 340, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 170, 430, 36, { align: "center", weight: 900 }); para(ctx, t, x + 170, 500, 26, 300, { align: "center", weight: 700, color: C.ink2, lh: 1.3 }); });
      text(ctx, "proyek ini memakai tiga episode itu", 960, 730, 28, { align: "center", weight: 800, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_claim(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER: KLAIM DI SEKOLAH", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.6, 3);
      [["Kelas 8 lebih sering telat daripada kelas 7", "uji", "BISA DIUJI", "data: catatan telat per hari"], ["Kantin kita paling enak se-kecamatan", "opini", "OPINI", "'paling enak' = selera"], ["Perpustakaan lebih ramai saat hujan", "uji", "BISA DIUJI", "data: pengunjung per hari + cuaca"]].forEach(([s, k, tag, why], i) => { if (i < n) { Q.claim(ctx, 200, 290 + i * 150, 900, s, k, { size: 26, h: 90, tag }); text(ctx, why, 1150, 345 + i * 150, 24, { weight: 800, color: k === "uji" ? C.good : C.kiko }); } });
      if (n >= 3) banner(ctx, "tanya: data apa yang bisa membuktikannya?", 760, 900);
    },
    unplugged_question(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.claim(ctx, 260, 240, 1400, CLAIM, null, { size: 30, h: 90, tag: "KLAIM" });
      if (l > 1.5) { arrowIcon(ctx, "down", 960, 380, 44, C.ink2); Q.claim(ctx, 260, 430, 1400, "Berapa rata-rata murid telat per hari di kelas 7 dan kelas 8 selama dua minggu?", "uji", { size: 28, h: 120, tag: "PERTANYAAN" }); }
      if (l > 4.5) { ["jelas: rata-rata per hari", "bisa dihitung: jumlah murid telat", "ada batas: dua minggu, dua kelas"].forEach((s, i) => text(ctx, "✓ " + s, 300 + i * 480, 640, 24, { weight: 900, color: C.good })); }
      if (l > 7) banner(ctx, "pertanyaan yang jelas, datanya bisa dihitung", 745, 900);
    },

    steps(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "LIMA LANGKAH PROYEK", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.0, 5);
      STEPS.forEach(([t, s], i) => Q.step(ctx, 200 + i * 310, 280, 290, 300, i + 1, t, s, { dim: i >= n, on: i === n - 1 }));
      if (n >= 5) { label(ctx, "tim 3–4 orang · 6 pertemuan", 960, 660, { size: 28 }); label(ctx, "hasil: satu lembar kerja + satu presentasi", 960, 710, { size: 24, color: C.ink2 }); }
    },
    plan_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "RENCANA PENGUMPULAN DATA", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.3, 4);
      [["APA yang dicatat", "jumlah murid yang datang setelah bel"], ["SIAPA yang mencatat", "petugas piket tiap kelas"], ["KAPAN", "tiap pagi, saat bel masuk"], ["BERAPA LAMA", "10 hari sekolah (dua minggu)"]].forEach(([t, s], i) => { if (i < n) { card(ctx, 220 + (i % 2) * 760, 290 + Math.floor(i / 2) * 200, 720, 170, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 16 }); text(ctx, t, 260 + (i % 2) * 760, 350 + Math.floor(i / 2) * 200, 30, { weight: 900, color: C.kiko }); text(ctx, s, 260 + (i % 2) * 760, 410 + Math.floor(i / 2) * 200, 26, { weight: 700 }); } });
      if (n >= 4) banner(ctx, "rencana yang jelas = data yang bisa dibandingkan", 745, 1000, { size: 30 });
    },

    collect(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MENGUMPULKAN DATA DENGAN JUJUR", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      kid(ctx, 360, 540, 160, { hair: "long" }); text(ctx, "petugas piket", 360, 770, 24, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 1.0, 1.5, 3);
      [["catat apa adanya", "6 tetap ditulis 6, bukan 4 supaya 'cocok'", C.good], ["catat yang mengganggu", "hari hujan, hari ujian, bel rusak", C.good], ["jangan pilih-pilih hari", "hari sepi dan ramai sama-sama dicatat", C.good]].forEach(([t, s, col], i) => { if (i < n) { card(ctx, 620, 290 + i * 150, 1080, 120, { fill: C.goodBg, stroke: col, lw: 3, r: 14 }); text(ctx, "✓ " + t, 660, 338 + i * 150, 28, { weight: 900, color: col }); text(ctx, s, 660, 380 + i * 150, 22, { weight: 700, color: C.ink2 }); } });
      if (n >= 3) banner(ctx, "data jujur lebih berharga daripada data bagus", 745, 1000, { size: 30 });
    },
    sheet_raw(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 0.6, 10);
      Q.sheet(ctx, 300, 220, DATA(n), { hl: n >= 5 ? { D6: "#FFF3D6" } : {} });
      if (n >= 10) { label(ctx, "satu baris = satu hari", 1400, 400, { size: 28 }); label(ctx, "10 hari × 2 kelas = 20 angka", 1400, 450, { size: 26, color: C.ink2 }); label(ctx, "catatan ikut disimpan", 1400, 500, { size: 26, color: C.ink2 }); }
    },

    sheet_formula(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 1.0, 1.4, 2);
      const data = DATA(10); if (n >= 1) data.push(["Rata-rata", avg(K7), avg(K8), ""]); if (n >= 2) data.push(["Terburuk", Math.max(...K7), Math.max(...K8), ""]);
      Q.sheet(ctx, 240, 230, data, { rh: 40, changed: n >= 1 ? ["B12", "C12"] : [], active: n >= 2 ? "B13" : n >= 1 ? "B12" : undefined });
      Q.formulaBar(ctx, 240, 170, 900, n >= 2 ? "B13" : "B12", n >= 2 ? "=MAX(B2:B11)" : "=AVERAGE(B2:B11)");
      if (n >= 1) { card(ctx, 1240, 300, 460, 200, { fill: C.bg2 }); text(ctx, "rata-rata telat per hari", 1470, 350, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "kelas 7: 3,2", 1470, 400, 30, { align: "center", weight: 900, color: C.kiko }); text(ctx, "kelas 8: 3,5", 1470, 450, 30, { align: "center", weight: 900, color: C.accentDark }); }
      if (n >= 2) { card(ctx, 1240, 540, 460, 120, { fill: C.bg2 }); text(ctx, "hari terburuk: 6 dan 7", 1470, 590, 26, { align: "center", weight: 900 }); text(ctx, "sama-sama hari hujan", 1470, 630, 22, { align: "center", weight: 700, color: C.ink2 }); }
    },
    sheet_chart(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const grow = ease(clamp((l - 0.8) / 1.5, 0, 1));
      Q.bars(ctx, 200, 230, 640, 460, [["Kelas 7", avg(K7), C.kiko], ["Kelas 8", avg(K8), C.accent]], { grow, max: 5, title: "rata-rata telat per hari" });
      if (l > 3.5) Q.lines(ctx, 900, 230, 820, 460, [{ name: "Kelas 7", v: K7, col: C.kiko }, { name: "Kelas 8", v: K8, col: C.accent }], { mark: 4 });
      if (l > 3.5) label(ctx, "batang: dua kelas hampir sama", 520, 740, { size: 26 }); if (l > 6) label(ctx, "garis: naik bersamaan di hari hujan", 1310, 740, { size: 26 });
    },

    conclude(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MEMBACA HASIL", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      Q.bars(ctx, 200, 280, 520, 400, [["Kelas 7", 3.2, C.kiko], ["Kelas 8", 3.5, C.accent]], { max: 5 });
      const n = reveal(l, 1.0, 1.6, 3);
      [["selisih 0,3 murid per hari", "dari sekitar 100 murid tiap kelas"], ["kecil sekali", "satu murid pun bisa mengubahnya"], ["klaim tidak terbukti", "perbedaannya hampir tidak ada"]].forEach(([t, s], i) => { if (i < n) { card(ctx, 800, 290 + i * 140, 900, 110, { fill: i === 2 ? C.goodBg : C.bg2, stroke: i === 2 ? C.good : undefined, lw: 4, r: 14 }); text(ctx, t, 840, 335 + i * 140, 28, { weight: 900, color: i === 2 ? C.good : C.ink }); text(ctx, s, 840, 375 + i * 140, 22, { weight: 700, color: C.ink2 }); } });
      if (n >= 3) banner(ctx, "kesimpulan yang jujur mengikuti angkanya", 1250, 880, { size: 28 });
    },
    conclude_rules(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "TIGA KESIMPULAN YANG BOLEH", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.0, 3);
      Q.verdict(ctx, 200, 290, 480, "benar", "BENAR", "data mendukung klaim", { on: n >= 1 }); Q.verdict(ctx, 720, 290, 480, "salah", "SALAH / TIDAK TERBUKTI", "data tidak mendukung", { on: n >= 2 }); Q.verdict(ctx, 1240, 290, 480, "kurang", "BELUM CUKUP DATA", "perlu dicatat lebih lama", { on: n >= 3 });
      if (l > 4.5) { card(ctx, 300, 470, 1320, 180, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "✕ jangan melebih-lebihkan", 340, 525, 28, { weight: 900, color: C.bad }); text(ctx, "dua minggu dan dua kelas belum mewakili semua kelas sepanjang tahun", 340, 570, 24, { weight: 700, color: C.ink2 }); text(ctx, "tulis apa yang kamu temukan, bukan apa yang ingin kamu temukan", 340, 615, 24, { weight: 800 }); }
    },

    present(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "LIMA SLIDE", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.0, 5);
      ["Pertanyaan", "Cara mengumpulkan data", "Grafik", "Kesimpulan", "Usul untuk sekolah"].forEach((t, i) => { if (i < n) { const x = 200 + i * 310; card(ctx, x, 290, 290, 220, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); ctx.fillStyle = C.kiko; rr(ctx, x, 290, 290, 40, 12); ctx.fill(); ctx.fillRect(x, 310, 290, 20); text(ctx, "Slide " + (i + 1), x + 16, 318, 18, { weight: 900, color: "#fff" }); para(ctx, t, x + 145, 400, 24, 250, { align: "center", weight: 900, lh: 1.2 }); if (i === 2) { ctx.fillStyle = C.kiko; ctx.fillRect(x + 90, 430, 40, 60); ctx.fillStyle = C.accent; ctx.fillRect(x + 160, 420, 40, 70); } if (i === 3) text(ctx, "3,2 ≈ 3,5", x + 145, 470, 30, { align: "center", weight: 900, color: C.good }); } });
      if (n >= 5) banner(ctx, "satu ide per slide, angka besar, grafik lebih banyak daripada kata", 745, 1100, { size: 28 });
    },
    present_reply(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const ph = D.phone(ctx, 560, 520, 380, 620); text(ctx, "Grup 8B", ph.x + 20, ph.y + 60, 24, { weight: 900 });
      card(ctx, ph.x + 16, ph.y + 80, ph.w - 32, 90, { fill: C.badBg, stroke: C.bad, lw: 2, r: 12 }); text(ctx, "Bayu", ph.x + 30, ph.y + 104, 16, { weight: 900, color: C.ink2 }); para(ctx, "Kelas 8 tukang telat semua!!", ph.x + 30, ph.y + 132, 18, ph.w - 60, { weight: 700, color: C.bad, lh: 1.3 });
      if (l > 1.5) { card(ctx, ph.x + 40, ph.y + 200, ph.w - 56, 190, { fill: C.goodBg, stroke: C.good, lw: 2, r: 12 }); text(ctx, "Tim Cek Data", ph.x + 54, ph.y + 224, 16, { weight: 900, color: C.ink2 }); para(ctx, "Kami mencatat dua minggu: rata-rata telat kelas 7 = 3,2 dan kelas 8 = 3,5 per hari. Hampir sama. 🙂", ph.x + 54, ph.y + 254, 18, ph.w - 90, { weight: 700, lh: 1.35 }); }
      if (l > 5) { card(ctx, ph.x + 16, ph.y + 420, ph.w - 32, 70, { fill: "#fff", stroke: "#D7E2DC", lw: 2, r: 12 }); text(ctx, "Bayu", ph.x + 30, ph.y + 444, 16, { weight: 900, color: C.ink2 }); text(ctx, "oh, oke. maaf ya 😅", ph.x + 30, ph.y + 472, 18, { weight: 700 }); }
      card(ctx, 900, 280, 760, 260, { fill: C.bg2 }); ["✓ sopan, tanpa menyerang", "✓ sebut cara dan angkanya", "✓ singkat"].forEach((s, i) => text(ctx, s, 940, 350 + i * 60, 28, { weight: 900, color: C.good }));
      if (l > 7) banner(ctx, "data mengakhiri perdebatan yang tidak perlu", 1280, 760, { size: 28, fill: C.goodBg, stroke: C.good, color: C.good });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Perencana proyek", "klaim → pertanyaan → rencana data", (x, y) => { Q.claim(ctx, x - 200, y - 90, 400, "Klaim: …", null, { size: 20, h: 50 }); Q.claim(ctx, x - 200, y - 20, 400, "Pertanyaan: berapa …?", "uji", { size: 20, h: 50 }); Q.claim(ctx, x - 200, y + 50, 400, "Apa · siapa · kapan · berapa lama", null, { size: 18, h: 50 }); }],
        ["Lembar data contoh", "AVERAGE, MAX, grafik", (x, y) => { ctx.save(); ctx.translate(x - 200, y - 100); ctx.scale(0.7, 0.7); Q.sheet(ctx, 0, 0, [["Hari", "K7", "K8"], ["1", 3, 3], ["2", 2, 3], ["Rata", 2.5, 3]], { cw: [120, 90, 90], rh: 44, changed: ["B4", "C4"] }); ctx.restore(); }],
        ["Latihan menyimpulkan", "benar, salah, belum cukup", (x, y) => { Q.verdict(ctx, x - 200, y - 110, 400, "kurang", "BELUM CUKUP DATA", "3 hari saja", { on: true }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 630, 26, { align: "center", weight: 900 }); text(ctx, t2, x, 668, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu kerjakan proyeknya enam pertemuan di kelas", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
