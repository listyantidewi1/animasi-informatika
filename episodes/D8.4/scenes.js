/* Adegan episode D8.4: Menilai Informasi dan Ekosistem Pers Digital. Muat setelah kiko-core.js, kiko-devices.js, pers.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.pers, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const PERS = { title: "Pohon tumbang di depan SMP 7, jalan ditutup 2 jam", by: "oleh Ratna S. · Kabar Kota", time: "Senin, 07.10 WIB", photo: true, body: "\"Tidak ada korban,\" kata petugas Damkar, Pak Hendra." };
  const AKUN = { title: "GAWAT!!! Pohon raksasa roboh, banyak yang terluka?!", by: "", time: "", photo: true, photoNote: "foto kota lain", body: "katanya sih banyak korban… share ya!" };
  const GRUP = { title: "Fwd: Fwd: pohon tumbang di sekolah, besok libur!!", by: "", time: "", body: "diteruskan 12 kali · tidak ada yang tahu siapa penulis pertamanya · tanpa foto, tanpa jam" };
  const JOURNEY = ["Peristiwa", "Wartawan", "Redaksi", "Layar"];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      Q.tree(ctx, 330, 330, 50, { fallen: l > 0.8 }); text(ctx, "depan sekolah, 07.00", 330, 380, 20, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 1.0, 1.2, 3);
      if (n >= 1) Q.news(ctx, 600, 230, 360, 300, "grup", { ...GRUP, size: 22 });
      if (n >= 2) Q.news(ctx, 990, 230, 360, 300, "akun", { title: AKUN.title, size: 22, body: AKUN.body });
      if (n >= 3) Q.news(ctx, 1380, 230, 360, 300, "pers", { title: PERS.title, by: PERS.by, time: PERS.time, size: 22 });
      if (l > 6) banner(ctx, "tiga kabar, tiga cerita: mana yang bisa dipercaya?", 760, 1000, { size: 30 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.4", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Mesin Pencari: Cara Kerja dan Strategi", 960, 500, 48, { align: "center", weight: 700, color: C.ink2 });
      ["Kata kunci jitu", "Sumber dan tanggal", "Label Iklan"].forEach((s, i) => { card(ctx, 480 + i * 340, 580, 300, 120, { fill: C.bg2 }); text(ctx, s, 630 + i * 340, 652, 30, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_whisper(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER: PESAN BERANTAI", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 0.6, 10);
      for (let i = 0; i < 10; i++) { const x = 260 + i * 150; kid(ctx, x, 500, 90, { hair: i % 2 ? "long" : undefined, hairColor: ["#2B2118", "#4A2E1A", "#1B1B1B"][i % 3] }); if (i < n - 1) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(x + 40, 440); ctx.lineTo(x + 110, 440); ctx.stroke(); ctx.setLineDash([]); } }
      if (n >= 1) bubble(ctx, 160, 340, 420, "\"Pohon di depan sekolah tumbang jam tujuh, tidak ada yang terluka.\"", 20, { tailX: 260, tailDir: 0 });
      if (n >= 10) bubble(ctx, 1300, 340, 440, "\"Pohon roboh, banyak yang terluka, besok libur!\"", 20, { tailX: 1610, tailDir: 0, fill: C.badBg, stroke: C.bad, color: C.bad });
      if (l > 7.5) banner(ctx, "sepuluh orang kemudian: kalimatnya sudah berubah", 745, 1000, { fill: C.badBg, stroke: C.bad, color: C.bad, size: 30 });
    },
    unplugged_compare(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      card(ctx, 200, 260, 720, 400, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "dari mulut ke mulut, grup ke grup", 560, 320, 28, { align: "center", weight: 900, color: C.bad });
      ["ditambah", "dikurangi", "dibumbui"].forEach((s, i) => text(ctx, "• " + s, 300, 390 + i * 50, 28, { weight: 800 }));
      text(ctx, "tidak ada yang memeriksa", 560, 600, 26, { align: "center", weight: 800, color: C.ink2 });
      if (l > 3) { card(ctx, 1000, 260, 720, 400, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "yang perlu kita tahu", 1360, 320, 28, { align: "center", weight: 900, color: C.good }); text(ctx, "1. dari mana kabar berasal?", 1060, 400, 28, { weight: 800 }); text(ctx, "2. siapa yang memeriksanya?", 1060, 460, 28, { weight: 800 }); }
      if (l > 7) banner(ctx, "dua pertanyaan itu yang kita telusuri sekarang", 745, 1000, { size: 30 });
    },

    journey(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "PERJALANAN BERITA DI MEDIA PERS", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.8, 3);
      Q.journey(ctx, 200, 280, 1520, JOURNEY, { n, hlLast: true });
      if (n >= 1) { Q.tree(ctx, 380, 620, 60, { fallen: true }); text(ctx, "pohon tumbang, 07.00", 380, 680, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 2) { kid(ctx, 760, 560, 120, { point: true }); Q.camera(ctx, 830, 500, 50); Q.notepad(ctx, 640, 630, 240, 80, ["saksi: Pak Hendra", "jam: 07.00"]); text(ctx, "wartawan: lihat, tanya, potret", 760, 740, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 3) { card(ctx, 1040, 470, 320, 220, { fill: "#F7FAF8", stroke: "#B7C4CC", lw: 3, r: 12 }); text(ctx, "REDAKSI", 1200, 510, 22, { align: "center", weight: 900, color: C.ink2 }); kid(ctx, 1140, 600, 80, { hair: "long" }); kid(ctx, 1260, 600, 80, {}); text(ctx, "tulisan masuk ke meja editor", 1200, 740, 22, { align: "center", weight: 800, color: C.ink2 }); }
    },
    newsroom(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "DI REDAKSI: VERIFIKASI", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      kid(ctx, 380, 520, 170, { hair: "long" }); text(ctx, "editor", 380, 760, 26, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 0.8, 1.3, 3);
      [["saksinya jelas?", "Pak Hendra, petugas Damkar ✓"], ["fotonya asli?", "diambil wartawan di lokasi ✓"], ["angkanya cocok?", "2 jam ditutup, 0 korban ✓"]].forEach(([q, a], i) => { if (i < n) { card(ctx, 640, 290 + i * 120, 1060, 100, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, q, 680, 330 + i * 120, 28, { weight: 900 }); text(ctx, a, 680, 370 + i * 120, 22, { weight: 700, color: C.good }); } });
      if (l > 5.5) { card(ctx, 640, 660, 500, 90, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "kalau ragu → berita ditahan dulu", 890, 715, 24, { align: "center", weight: 900, color: C.bad }); card(ctx, 1200, 660, 500, 90, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "lolos → tayang di layar", 1450, 715, 24, { align: "center", weight: 900, color: C.good }); }
    },

    three_sources(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 1.8, 3);
      if (n >= 1) Q.news(ctx, 180, 220, 480, 540, "grup", { ...GRUP, size: 24, badge: "bad" });
      if (n >= 2) Q.news(ctx, 720, 220, 480, 540, "akun", { ...AKUN, size: 24, badge: "bad" });
      if (n >= 3) Q.news(ctx, 1260, 220, 480, 540, "pers", { ...PERS, size: 24, badge: "ok" });
      if (n >= 1) text(ctx, "tanpa nama penulis", 420, 800, 22, { align: "center", weight: 900, color: C.bad });
      if (n >= 2) text(ctx, "judul heboh, foto kejadian lain", 960, 800, 22, { align: "center", weight: 900, color: C.bad });
      if (n >= 3) text(ctx, "nama wartawan, kutipan, waktu", 1500, 800, 22, { align: "center", weight: 900, color: C.good });
    },
    press_council(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      card(ctx, 200, 240, 740, 460, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "MEDIA PERS", 570, 300, 30, { align: "center", weight: 900, color: C.good });
      const n = reveal(l, 0.8, 1.2, 3);
      ["punya redaksi dan nama penulis", "kalau salah: pembaca mengadu ke Dewan Pers", "wajib memuat koreksi"].forEach((s, i) => { if (i < n) text(ctx, "✓ " + s, 240, 370 + i * 60, 26, { weight: 800 }); });
      if (n >= 3) { card(ctx, 240, 570, 660, 90, { fill: "#fff", stroke: C.good, lw: 3, r: 12 }); text(ctx, "RALAT: jalan ditutup 1 jam, bukan 2 jam.", 570, 625, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > 4.5) { card(ctx, 980, 240, 740, 460, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "AKUN PERORANGAN", 1350, 300, 30, { align: "center", weight: 900, color: C.bad }); ["tanpa redaksi, sering tanpa nama", "tidak ada yang wajib memeriksa", "salah pun tidak wajib mengoreksi"].forEach((s, i) => text(ctx, "✕ " + s, 1020, 370 + i * 60, 26, { weight: 800 })); }
      if (l > 7.5) banner(ctx, "bedanya: tanggung jawab", 745, 700);
    },

    four_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "EMPAT PERTANYAAN PENILAI INFORMASI", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.3, 4);
      Q.fourQ(ctx, 460, 290, 1000, [], { hl: n - 1 });
      ctx.save(); ctx.globalAlpha = 0.25; for (let i = n; i < 4; i++) { card(ctx, 460, 290 + i * 86, 1000, 72, { fill: "#fff", r: 14 }); } ctx.restore();
      if (n >= 4) label(ctx, "pakai satu per satu untuk kabar apa pun", 960, 700, { size: 26, color: C.ink2 });
    },
    q_who(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.fourQ(ctx, 180, 240, 560, [], { hl: 0 });
      Q.news(ctx, 820, 220, 440, 440, "pers", { ...PERS, size: 22 });
      if (l > 1.5) { ctx.strokeStyle = C.good; ctx.lineWidth = 5; ctx.strokeRect(830, 344, 420, 34); label(ctx, "nama penulis + nama media", 1500, 370, { size: 24, color: C.good }); }
      if (l > 3.5) { card(ctx, 1300, 420, 420, 140, { fill: C.bg2 }); text(ctx, "halaman \"tentang kami\"", 1510, 470, 24, { align: "center", weight: 900 }); text(ctx, "alamat, redaksi, bisa dihubungi", 1510, 510, 22, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 6) banner(ctx, "sumber yang bisa ditanya > akun tanpa nama", 745, 1000, { size: 30 });
    },
    q_proof(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.fourQ(ctx, 180, 240, 560, [], { hl: 1 });
      const n = reveal(l, 0.8, 1.2, 3);
      [["kutipan saksi bernama", "\"Tidak ada korban,\" kata Pak Hendra, petugas Damkar", true], ["foto dari lokasi", "diambil wartawan, bukan dari kota lain", true], ["angka dari petugas", "jalan ditutup 2 jam, 0 korban", true]].forEach(([t, s], i) => { if (i < n) { card(ctx, 820, 240 + i * 120, 900, 100, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "✓ " + t, 850, 280 + i * 120, 26, { weight: 900, color: C.good }); text(ctx, s, 850, 318 + i * 120, 22, { weight: 700, color: C.ink2 }); } });
      if (l > 5) { card(ctx, 820, 610, 900, 100, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "✕ \"katanya banyak yang terluka\"", 850, 650, 26, { weight: 900, color: C.bad }); text(ctx, "siapa yang bilang? berapa? bukan bukti", 850, 688, 22, { weight: 700, color: C.ink2 }); }
    },

    q_when(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.fourQ(ctx, 180, 240, 560, [], { hl: 2 });
      Q.news(ctx, 820, 220, 420, 300, "pers", { title: "Pohon tumbang di depan SMP 7", by: "Kabar Kota", time: "Senin, 07.10 WIB", size: 22, badge: l > 1.5 ? "ok" : null });
      if (l > 3) { Q.news(ctx, 1280, 220, 420, 300, "akun", { title: "Pohon tumbang di depan SMP 7!!", by: "", time: "(tanpa tanggal)", size: 22, badge: "bad" }); text(ctx, "ternyata kejadian tahun lalu,", 1490, 560, 22, { align: "center", weight: 800, color: C.bad }); text(ctx, "dibagikan ulang seolah baru", 1490, 590, 22, { align: "center", weight: 800, color: C.bad }); }
      if (l > 6) banner(ctx, "lihat tanggal dan jamnya", 745, 800);
    },
    q_others(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.fourQ(ctx, 180, 240, 560, [], { hl: 3 });
      card(ctx, 820, 230, 900, 80, { fill: C.panel, stroke: "#B7C4CC", lw: 4, r: 40 }); text(ctx, "🔍", 844, 284, 30); text(ctx, "pohon tumbang SMP 7 senin", 900, 282, 30, { weight: 700 });
      const n = reveal(l, 1.2, 1.1, 3);
      [["Kabar Kota", "Pohon tumbang di depan SMP 7, jalan ditutup", true], ["Harian Pagi", "Angin kencang tumbangkan pohon di Jl. Melati", true], ["akun_gosip88", "GAWAT!!! banyak yang terluka?!", false]].forEach(([src, t, ok], i) => { if (i < n) { card(ctx, 820, 340 + i * 110, 900, 92, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 3, r: 14 }); text(ctx, src, 850, 376 + i * 110, 22, { weight: 900, color: ok ? C.good : C.bad }); text(ctx, t, 850, 410 + i * 110, 22, { weight: 700, color: C.ink2 }); } });
      if (n >= 3) { text(ctx, "dua media pers sepakat: kabarnya makin kuat", 1270, 700, 26, { align: "center", weight: 900, color: C.good }); text(ctx, "yang \"banyak terluka\" hanya satu akun: tahan dulu", 1270, 740, 24, { align: "center", weight: 800, color: C.bad }); }
    },

    apply(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.news(ctx, 180, 220, 520, 540, "pers", { ...PERS, size: 24 });
      const n = reveal(l, 0.8, 1.4, 4);
      Q.fourQ(ctx, 760, 240, 940, ["ok", "ok", "ok", "ok"].slice(0, n), { hl: n - 1, notes: ["Ratna S. · Kabar Kota", "kutipan petugas, foto lokasi", "Senin 07.10", "2 media serupa"].slice(0, n) });
      if (n >= 4) banner(ctx, "empat centang: LOLOS, boleh dipercaya dan dibagikan", 1230, 1000, { fill: C.goodBg, stroke: C.good, color: C.good, size: 28 });
    },
    apply_bad(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.news(ctx, 180, 220, 520, 540, "akun", { ...AKUN, size: 24 });
      const n = reveal(l, 0.8, 1.4, 4);
      Q.fourQ(ctx, 760, 240, 940, ["bad", "bad", "bad", "bad"].slice(0, n), { hl: n - 1, notes: ["tanpa nama", "foto kota lain, \"katanya\"", "tanpa jam", "tidak ada media lain"].slice(0, n) });
      if (n >= 4) banner(ctx, "empat tanda silang: TIDAK diteruskan", 1230, 1000, { fill: C.badBg, stroke: C.bad, color: C.bad, size: 30 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Urutkan perjalanan berita", "peristiwa, wartawan, redaksi, layar", (x, y) => Q.journey(ctx, x - 230, y - 80, 460, ["1", "2", "3", "4"], {})],
        ["Nilai empat kabar", "dengan empat pertanyaan", (x, y) => { ctx.save(); ctx.translate(x - 150, y - 120); ctx.scale(0.62, 0.62); Q.fourQ(ctx, 0, 0, 480, ["ok", "bad", "ok", "ok"], {}); ctx.restore(); }],
        ["Pers atau bukan?", "nama, redaksi, koreksi", (x, y) => { Q.news(ctx, x - 200, y - 100, 190, 200, "pers", { title: "ada nama & redaksi", size: 18, badge: "ok" }); Q.news(ctx, x + 10, y - 100, 190, 200, "akun", { title: "tanpa nama", size: 18, badge: "bad" }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 630, 26, { align: "center", weight: 900 }); text(ctx, t2, x, 668, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu nilai satu berita yang sedang ramai", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
