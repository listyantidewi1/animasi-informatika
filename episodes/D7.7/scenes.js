/* Adegan episode D7.7: Ruang Publik Virtual dan Empati. Muat setelah kiko-core.js, kiko-devices.js, empati.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.empati, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  // percakapan inti bagian 2
  const STORY = [
    { who: "Rani", text: "Jawaban PR no 3: 45 km/jam (eh salah kirim)", mood: "flat" },
    { who: "Bayu", text: "dasar bodoh 😂", tone: "bad", mood: "angry" },
    { who: "Tari", text: "wkwkwk", tone: "bad", mood: "happy" },
    { who: "Agus", text: "🤣🤣", tone: "bad", mood: "happy" }];
  const A = [...STORY, { who: "Aku", text: "hahaha parah 🤣", tone: "bad" }, { who: "Bayu", text: "nih memenya", tone: "bad", meme: true, mood: "angry" }, { who: "Agus", text: "kirim ke grup sebelah juga", tone: "bad" }, { tone: "sys", text: "Rani keluar dari grup" }];
  const B = [...STORY, { who: "Bayu", text: "besok PR-nya minta diajarin Rani aja 😂", tone: "bad", mood: "angry" }, { who: "Tari", text: "😂😂", tone: "bad" }];
  const Cc = [...STORY, { who: "Aku", text: "sudah, ini salah kirim saja", tone: "good" }, { who: "Sinta", text: "iya, lanjut bahas PR yuk", tone: "good", mood: "happy" }, { who: "Bayu", text: "oke oke", mood: "flat" }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const items = [["Ruang publik", "chat"], ["Menahan diri", "komentar"], ["Menolong teman", "sosial"]];
      const n = reveal(l, 0.6, 1.4, 3);
      items.forEach(([t, ic], i) => { const x = 700 + i * 380; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.15; card(ctx, x - 160, 300, 320, 320, { fill: C.bg2 }); Q.spaceIcon(ctx, x, 420, 120, ic); text(ctx, t, x, 570, 30, { align: "center", weight: 900, color: C.accentDark }); ctx.restore(); });
      if (l > 5) bubble(ctx, 180, 330, 340, "Grup kelas 7B ramai sekali malam ini…", 28, { tailX: 330, tailDir: 0 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.3", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Kata Sandi Aman dan Rekam Jejak Digital", 960, 500, 46, { align: "center", weight: 700, color: C.ink2 });
      ["Jejak sulit dihapus", "Salinan di HP lain", "Tiga pertanyaan"].forEach((s, i) => { card(ctx, 420 + i * 380, 580, 340, 120, { fill: C.bg2 }); text(ctx, s, 590 + i * 380, 652, 30, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_whisper(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      // kiri: bisik ke teman sebangku
      kid(ctx, 380, 560, 150, { point: true }); kid(ctx, 560, 560, 150, { hair: "long" });
      if (l > 0.8) bubble(ctx, 250, 390, 260, "psst… (bisik)", 26, { tailX: 400, tailDir: 0 });
      text(ctx, "dua orang mendengar", 470, 800, 26, { align: "center", weight: 800, color: C.ink2 });
      // kanan: di depan kelas, 30 orang
      kid(ctx, 1000, 500, 130, { point: true }); Q.crowd(ctx, 1180, 440, 12, 4);
      if (l > 4) bubble(ctx, 860, 340, 300, "(kalimat yang sama)", 24, { tailX: 1000, tailDir: 0, fill: "#FFF3D6", stroke: C.accent });
      text(ctx, "tiga puluh orang mendengar", 1400, 800, 26, { align: "center", weight: 800, color: C.ink2 });
      if (l > 7) label(ctx, "rasanya beda, kan?", 960, 800, { size: 30 });
    },
    unplugged_public(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.chat(ctx, 200, 200, 620, 620, "Grup 7B", [{ who: "Dito", text: "PR matematika sampai nomor berapa?" }, { who: "Sinta", text: "Sampai nomor 5" }, { who: "Rani", text: "Makasih!" }], { members: 32, n: reveal(l, 0.5, 1.0, 3) });
      Q.crowd(ctx, 960, 300, 8, 4); text(ctx, "32 orang membaca", 1115, 520, 28, { align: "center", weight: 900, color: C.kiko });
      if (l > 4) { card(ctx, 900, 580, 760, 110, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "tulisannya tidak hilang: bisa di-screenshot", 1280, 645, 28, { align: "center", weight: 900, color: C.bad }); }
      if (l > 7) banner(ctx, "grup kelas = RUANG PUBLIK, bukan berbisik", 740, 900);
    },

    spaces(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "RUANG PUBLIK VIRTUAL", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const items = [["Grup chat", "chat"], ["Media sosial", "sosial"], ["Kolom komentar", "komentar"], ["Game online", "game"], ["Forum", "forum"]];
      const n = reveal(l, 0.6, 0.9, 5);
      items.forEach(([t, ic], i) => { const x = 330 + i * 315; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.15; card(ctx, x - 135, 290, 270, 300, { fill: C.bg2 }); Q.spaceIcon(ctx, x, 400, 110, ic); text(ctx, t, x, 550, 26, { align: "center", weight: 900 }); ctx.restore(); });
      if (l > 6) banner(ctx, "bedanya hanya: siapa yang bisa melihat", 700, 900);
    },
    spaces_who(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      // kiri: grup kelas 32; kanan: komentar video, dunia
      card(ctx, 200, 230, 700, 560, { fill: C.bg2 }); card(ctx, 1020, 230, 700, 560, { fill: C.bg2 });
      Q.spaceIcon(ctx, 300, 310, 90, "chat"); text(ctx, "Grup kelas", 370, 322, 30, { weight: 900 });
      Q.crowd(ctx, 280, 420, 8, 4); text(ctx, "32 orang", 550, 640, 40, { align: "center", weight: 900, color: C.kiko });
      Q.spaceIcon(ctx, 1120, 310, 90, "komentar"); text(ctx, "Komentar di video", 1190, 322, 30, { weight: 900 });
      ctx.fillStyle = "#DCEBF2"; ctx.beginPath(); ctx.arc(1370, 470, 110, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.ellipse(1330, 450, 40, 30, 0.5, 0, Math.PI * 2); ctx.ellipse(1400, 500, 45, 28, -0.4, 0, Math.PI * 2); ctx.ellipse(1380, 400, 25, 18, 0, 0, Math.PI * 2); ctx.fill();
      text(ctx, "siapa saja di dunia", 1370, 640, 40, { align: "center", weight: 900, color: C.bad });
      if (l > 5) banner(ctx, "sebelum menulis: siapa yang akan membaca ini?", 745, 1000, { size: 32 });
    },

    tone_msg(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const ph = D.phone(ctx, 520, 520, 360, 560);
      text(ctx, "Sinta", ph.x + 20, ph.y + 60, 24, { weight: 900, color: C.ink2 });
      card(ctx, ph.x + 20, ph.y + 90, 220, 70, { fill: "#DCEBF2", r: 14 }); text(ctx, "mau makan di mana?", ph.x + 30, ph.y + 134, 20, { weight: 700 });
      if (l > 1) { card(ctx, ph.x + 120, ph.y + 180, 200, 70, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 14 }); text(ctx, "terserah", ph.x + 150, ph.y + 226, 28, { weight: 900 }); }
      // Dito membaca
      kid(ctx, 1100, 520, 170, {}); text(ctx, "Dito", 1100, 728, 26, { align: "center", weight: 800, color: C.ink2 });
      if (l > 2.5) bubble(ctx, 1000, 330, 300, "Kok marah?", 30, { tailX: 1100, tailDir: 0, fill: C.badBg, stroke: C.bad, color: C.bad });
      // Sinta sebenarnya
      if (l > 5) { kid(ctx, 1560, 520, 170, { hair: "long" }); text(ctx, "Sinta", 1560, 728, 26, { align: "center", weight: 800, color: C.ink2 }); bubble(ctx, 1420, 330, 320, "Buru-buru, bukan marah!", 26, { tailX: 1560, tailDir: 0, fill: C.goodBg, stroke: C.good, color: C.good }); }
      if (l > 7.5) banner(ctx, "nada suara tidak terdengar di tulisan", 745, 900);
    },
    tone_fix(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "SUPAYA TIDAK SALAH PAHAM", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      card(ctx, 200, 280, 740, 400, { fill: C.bg2 }); card(ctx, 980, 280, 740, 400, { fill: C.bg2 });
      text(ctx, "1. Tanya dulu", 240, 340, 32, { weight: 900, color: C.kiko });
      card(ctx, 240, 380, 500, 70, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 14 }); text(ctx, "kamu lagi sibuk ya?", 260, 425, 26, { weight: 700 });
      if (l > 1.5) { card(ctx, 420, 470, 460, 70, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "iya, lagi di angkot, nanti ya", 440, 515, 24, { weight: 700, color: C.good }); }
      text(ctx, "bukan langsung tersinggung", 570, 640, 24, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "2. Tulis lebih jelas", 1020, 340, 32, { weight: 900, color: C.kiko });
      card(ctx, 1020, 380, 300, 70, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "TERSERAH!!!", 1040, 426, 26, { weight: 900, color: C.bad }); text(ctx, "✕ huruf besar", 1340, 426, 24, { weight: 800, color: C.bad });
      if (l > 4) { card(ctx, 1020, 470, 660, 70, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "aku ikut saja, lagi buru-buru nih 😊", 1040, 515, 24, { weight: 700, color: C.good }); text(ctx, "✓ tambah kata", 1350, 640, 24, { align: "center", weight: 800, color: C.good }); }
      if (l > 6.5) banner(ctx, "tambah kata, bukan huruf besar", 730, 800);
    },
    tolerance(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "BEDA PENDAPAT ITU BIASA", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const kids = [["Dito", {}], ["Sinta", { hair: "long" }], ["Rani", { hair: "long", hairColor: "#4A2E1A" }], ["Bayu", { hairColor: "#1B1B1B" }]];
      kids.forEach(([n, o], i) => { kid(ctx, 330 + i * 180, 470, 120, o); text(ctx, n, 330 + i * 180, 640, 22, { align: "center", weight: 800, color: C.ink2 }); });
      text(ctx, "beda suku, agama, kesukaan: bukan lawan", 600, 700, 26, { align: "center", weight: 800, color: C.ink2 });
      card(ctx, 1060, 290, 640, 170, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "✕ serang orangnya", 1090, 345, 28, { weight: 900, color: C.bad }); text(ctx, "\"dasar kampungan, selera kamu jelek\"", 1090, 400, 24, { weight: 700, color: C.bad });
      if (l > 3) { card(ctx, 1060, 490, 640, 170, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "✓ bantah idenya dengan sopan", 1090, 545, 28, { weight: 900, color: C.good }); text(ctx, "\"menurutku lagu itu kurang cocok, karena…\"", 1090, 600, 24, { weight: 700, color: C.good }); }
      if (l > 6) banner(ctx, "bantah idenya, jangan serang orangnya", 745, 900);
    },

    story_start(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.chat(ctx, 200, 200, 700, 620, "Grup 7B", STORY, { members: 32, n: reveal(l, 0.5, 1.6, 4) });
      kid(ctx, 1250, 500, 170, {}); text(ctx, "Dito membaca semuanya", 1250, 740, 26, { align: "center", weight: 800, color: C.ink2 });
      if (l > 6) { Q.avatar(ctx, 1600, 420, 60, "Rani", "sad"); text(ctx, "Rani", 1600, 520, 26, { align: "center", weight: 800, color: C.ink2 }); Q.mood(ctx, 1500, 580, 200, 0.25, "perasaan Rani"); }
    },
    story_choice(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.chat(ctx, 160, 200, 560, 620, "Grup 7B", STORY, { members: 32, size: 20 });
      text(ctx, "Dito punya tiga pilihan", 1260, 250, 34, { align: "center", weight: 900, color: C.accentDark });
      const n = reveal(l, 0.8, 1.4, 3);
      const opts = ["Ikut tertawa", "Diam saja", "Tulis: \"sudah, ini salah kirim saja\" + pesan pribadi ke Rani"];
      opts.forEach((o, i) => { if (i < n) Q.choice(ctx, 800, 290 + i * 150, 920, 120, i + 1, o, {}); });
      if (l > 6) banner(ctx, "pilih dulu, baru lihat akibatnya", 760, 700, { size: 30 });
    },
    story_a(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.chat(ctx, 160, 200, 620, 620, "Grup 7B", A, { members: 31, n: 4 + reveal(l, 0.5, 1.2, 4), size: 20, from: 2 });
      Q.choice(ctx, 840, 220, 860, 100, 1, "Ikut tertawa", { bad: true });
      const n = reveal(l, 1.5, 1.6, 3);
      ["ejekan bertambah, ada yang membuat meme", "Rani keluar dari grup", "besoknya Rani tidak mau sekolah"].forEach((s, i) => { if (i < n) { text(ctx, "✕ " + s, 860, 400 + i * 70, 28, { weight: 800, color: C.bad }); } });
      if (n >= 3) { Q.avatar(ctx, 1600, 700, 60, "Rani", "sad"); Q.mood(ctx, 880, 690, 560, 0.05, ""); }
    },
    story_b(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.chat(ctx, 160, 200, 620, 620, "Grup 7B", B, { members: 32, n: 4 + reveal(l, 0.5, 1.5, 2), size: 20, from: 1 });
      Q.choice(ctx, 840, 220, 860, 100, 2, "Diam saja", { dim: true });
      const n = reveal(l, 1.5, 1.8, 3);
      ["ejekan tidak bertambah…", "…tetapi tidak berhenti juga", "32 orang membaca, tak satu pun membela"].forEach((s, i) => { if (i < n) text(ctx, (i < 2 ? "• " : "✕ ") + s, 860, 400 + i * 70, 28, { weight: 800, color: i < 2 ? C.ink2 : C.bad }); });
      if (n >= 3) { Q.avatar(ctx, 1600, 700, 60, "Rani", "sad"); Q.mood(ctx, 880, 690, 560, 0.25, ""); text(ctx, "Rani merasa sendirian", 1160, 790, 26, { align: "center", weight: 800, color: C.ink2 }); }
    },
    story_c(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.chat(ctx, 160, 200, 620, 620, "Grup 7B", Cc, { members: 32, n: 4 + reveal(l, 0.5, 1.4, 3), size: 20, hl: l > 0.5 ? 4 : -1, from: 1 });
      Q.choice(ctx, 840, 220, 860, 100, 3, "\"sudah, ini salah kirim saja\"", { good: true });
      const n = reveal(l, 2.0, 1.6, 3);
      ["Sinta ikut menimpali, Bayu berhenti", "pesan pribadi ke Rani", "Rani: \"makasih ya\""].forEach((s, i) => { if (i < n) text(ctx, "✓ " + s, 860, 400 + i * 70, 28, { weight: 800, color: C.good }); });
      if (n >= 2) { const ph = D.phone(ctx, 1620, 500, 240, 300); text(ctx, "Rani", ph.x + 14, ph.y + 44, 18, { weight: 900, color: C.ink2 }); card(ctx, ph.x + 14, ph.y + 60, 200, 56, { fill: "#DCEBF2", r: 10 }); text(ctx, "kamu nggak bodoh kok", ph.x + 22, ph.y + 95, 16, { weight: 700 }); if (n >= 3) { card(ctx, ph.x + 60, ph.y + 130, 160, 50, { fill: C.goodBg, r: 10 }); text(ctx, "makasih ya 🙂", ph.x + 70, ph.y + 162, 18, { weight: 800, color: C.good }); } }
      if (n >= 3) { Q.mood(ctx, 880, 720, 520, 0.85, ""); label(ctx, "satu kalimat mengubah malam Rani", 1160, 805, { size: 28, color: C.good }); }
    },

    bully_define(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "PERUNDUNGAN DIGITAL (cyberbullying)", 960, 240, 36, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Berulang", "bukan sekali, terus-menerus"], ["Sengaja", "memang untuk menyakiti"], ["Dilihat banyak orang", "di grup, komentar, atau game"]];
      const n = reveal(l, 1.0, 1.2, 3);
      items.forEach(([t, s], i) => { const x = 400 + i * 560; ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.15; card(ctx, x - 240, 300, 480, 300, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, String(i + 1), x, 390, 60, { align: "center", weight: 900, color: C.bad }); text(ctx, t, x, 470, 32, { align: "center", weight: 900 }); text(ctx, s, x, 530, 24, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) banner(ctx, "tiga ciri itu bersama-sama", 680, 700);
    },
    bully_impact(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      card(ctx, 200, 230, 700, 560, { fill: C.bg2 }); card(ctx, 1020, 230, 700, 560, { fill: C.bg2 });
      text(ctx, "Ejekan di kelas", 550, 290, 30, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "Perundungan digital", 1370, 290, 30, { align: "center", weight: 900, color: C.bad });
      ["berhenti saat bel pulang", "didengar yang ada di situ", "lama-lama dilupakan"].forEach((s, i) => text(ctx, "• " + s, 260, 370 + i * 60, 26, { weight: 700 }));
      const n = reveal(l, 0.8, 1.4, 3);
      ["24 jam, sampai ke kamar tidur", "dilihat banyak orang, bisa disebar", "jejaknya tetap ada"].forEach((s, i) => { if (i < n) text(ctx, "• " + s, 1080, 370 + i * 60, 26, { weight: 800, color: C.bad }); });
      if (l > 5.5) { Q.avatar(ctx, 1130, 650, 50, "Rani", "sad"); text(ctx, "takut sekolah, sulit tidur", 1440, 660, 28, { align: "center", weight: 900, color: C.bad }); }
      if (l > 8) banner(ctx, "itu sebabnya kita tidak boleh ikut-ikutan", 745, 900, { fill: C.badBg, stroke: C.bad, color: C.bad, size: 30 });
    },

    steps_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "LIMA LANGKAH", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 2.5, 2);
      Q.step(ctx, 200, 280, 740, 1, "Jangan ikut", "dan jangan balas dengan kasar", n >= 1);
      Q.step(ctx, 980, 280, 740, 2, "Dukung yang dirundung", "cukup lewat pesan pribadi: \"kamu nggak sendirian\"", n >= 2);
      Q.step(ctx, 200, 460, 480, 3, "Simpan bukti", "screenshot", false); Q.step(ctx, 720, 460, 480, 4, "Lapor", "orang dewasa / tombol lapor", false); Q.step(ctx, 1240, 460, 480, 5, "Blokir", "bila perlu", false);
      if (n >= 2) banner(ctx, "satu pesan pribadi sudah menolong", 745, 900, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    steps_rest(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "LIMA LANGKAH", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      Q.step(ctx, 200, 280, 740, 1, "Jangan ikut", "dan jangan balas dengan kasar", true);
      Q.step(ctx, 980, 280, 740, 2, "Dukung yang dirundung", "cukup lewat pesan pribadi", true);
      const n = reveal(l, 0.6, 1.6, 3);
      Q.step(ctx, 200, 460, 480, 3, "Simpan bukti", "screenshot pesannya, jangan dihapus dulu", n >= 1);
      Q.step(ctx, 720, 460, 480, 4, "Lapor", "guru, orang tua, atau tombol lapor di aplikasi", n >= 2);
      Q.step(ctx, 1240, 460, 480, 5, "Blokir", "bila perlu, supaya kamu tenang", n >= 3);
      if (l > 6.5) banner(ctx, "melapor bukan mengadu, itu menolong", 745, 900, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Mainkan 3 skenario", "pilih tanggapanmu, lihat akibatnya", (x, y) => { Q.choice(ctx, x - 200, y - 80, 400, 70, 1, "ikut tertawa", { dim: true }); Q.choice(ctx, x - 200, y, 400, 70, 3, "bela dengan sopan", { good: true }); }],
        ["Susun lima langkah", "jangan ikut, dukung, bukti, lapor, blokir", (x, y) => { ["jangan ikut", "dukung", "simpan bukti"].forEach((s, i) => { card(ctx, x - 150, y - 90 + i * 60, 300, 50, { fill: C.bg2, stroke: "#CFDCD5", lw: 3, r: 10 }); text(ctx, (i + 1) + ". " + s, x - 130, y - 56 + i * 60, 24, { weight: 800 }); }); }],
        ["Satu pesan baik", "untuk teman di grup kelasmu minggu ini", (x, y) => { const ph = D.phone(ctx, x, y - 20, 190, 190); card(ctx, ph.x + 14, ph.y + 60, 160, 56, { fill: C.goodBg, r: 10 }); text(ctx, "semangat ya!", ph.x + 24, ph.y + 96, 20, { weight: 800, color: C.good }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 610, 28, { align: "center", weight: 900 }); text(ctx, t2, x, 650, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
