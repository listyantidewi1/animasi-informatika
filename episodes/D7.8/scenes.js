/* Adegan episode D7.8: Proyek Panduan Digital. Muat setelah kiko-core.js, kiko-devices.js, proyek.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.proyek, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const STEPS = ["Tentukan pembaca dan tujuan", "Kumpulkan bahan", "Susun kerangka", "Tulis dokumen", "Buat slide", "Tampil, lalu perbaiki"];
  const BULLETS = ["Pakai 12 huruf atau lebih.", "Jangan beri tahu siapa pun.", "Satu akun, satu kata sandi."];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const n = reveal(l, 0.5, 1.0, 6);
      STEPS.forEach((s, i) => { const x = 700 + (i % 3) * 380, y = i < 3 ? 280 : 560; Q.stepCard(ctx, x - 160, y, 320, 230, i + 1, s, { dim: i >= n }); });
      if (l > 7) bubble(ctx, 170, 330, 300, "Dari awal sampai tampil!", 28, { tailX: 330, tailDir: 0 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.3", "Kata Sandi Aman dan Rekam Jejak Digital"], ["D7.4", "Mesin Pencari"], ["D7.7", "Ruang Publik Virtual dan Empati"]].forEach(([c, t], i) => { const x = 420 + i * 380; card(ctx, x, 360, 340, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 170, 430, 36, { align: "center", weight: 900 }); para(ctx, t, x + 170, 500, 26, 300, { align: "center", weight: 700, color: C.ink2, lh: 1.3 }); });
      text(ctx, "isi panduan diambil dari tiga episode ini", 960, 730, 28, { align: "center", weight: 800, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_interview(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      kid(ctx, 520, 560, 170, { point: true }); text(ctx, "kamu", 520, 800, 24, { align: "center", weight: 800, color: C.ink2 });
      kid(ctx, 800, 600, 120, { hair: "long", hairColor: "#4A2E1A" }); text(ctx, "adik kelas 6", 800, 800, 24, { align: "center", weight: 800, color: C.ink2 });
      const qs = ["Apa yang sering kamu lakukan di HP?", "Apa yang membuatmu bingung?", "Apa yang membuatmu takut?"]; const n = reveal(l, 1.0, 2.0, 3);
      qs.forEach((q, i) => { if (i < n) { card(ctx, 1000, 300 + i * 150, 700, 110, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 16 }); text(ctx, (i + 1) + ". " + q, 1030, 365 + i * 150, 28, { weight: 800 }); } });
      if (l > 7.5) label(ctx, "catat jawabannya", 1350, 800, { size: 26 });
    },
    unplugged_reader(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 360, 540, 150, { hair: "long", hairColor: "#4A2E1A" }); text(ctx, "pembacamu: kelas 6 SD", 360, 735, 26, { align: "center", weight: 900, color: C.kiko });
      const items = [["kata sederhana", "\"kata sandi\" bukan \"kredensial\""], ["banyak gambar", "satu gambar tiap aturan"], ["contoh yang dekat", "grup kelas, game, HP ibu"]];
      const n = reveal(l, 1.0, 1.6, 3);
      items.forEach(([t, s], i) => { if (i < n) { card(ctx, 640, 260 + i * 170, 1040, 140, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, "✓ " + t, 680, 318 + i * 170, 32, { weight: 900, color: C.good }); text(ctx, s, 680, 362 + i * 170, 24, { weight: 700, color: C.ink2 }); } });
      if (l > 7) banner(ctx, "jawaban mereka menentukan isi panduanmu", 775, 900, { size: 30 });
    },

    steps_six(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ENAM LANGKAH PROYEK", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.3, 6);
      STEPS.forEach((s, i) => { const x = 420 + (i % 3) * 540, y = i < 3 ? 270 : 530; Q.stepCard(ctx, x - 240, y, 480, 230, i + 1, s, { dim: i >= n, on: i === n - 1 }); });
      if (n >= 6) label(ctx, "urut, satu per satu", 960, 805, { size: 26, color: C.ink2 });
    },
    team_roles(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "TIM 3–4 ORANG, BAGI PERAN", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const roles = [["Dito", "Penulis", {}], ["Sinta", "Perancang gambar", { hair: "long" }], ["Rani", "Penyaji", { hair: "long", hairColor: "#4A2E1A" }], ["Bayu", "Pemeriksa", { hairColor: "#1B1B1B" }]];
      const n = reveal(l, 0.6, 1.0, 4);
      roles.forEach(([nm, r, o], i) => { if (i < n) Q.roleCard(ctx, 230 + i * 380, 270, 320, nm, r, { kid: o }); });
      if (l > 5) Q.timeline(ctx, 300, 580, 1320, ["pembaca, bahan, kerangka", "tulis dokumen", "buat slide, latihan", "tampil, perbaiki"], {});
      if (l > 7) label(ctx, "satu langkah besar tiap pertemuan", 960, 740, { size: 26, color: C.ink2 });
    },

    content_map(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ISI PANDUAN: TIGA BAB", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 0.8, 1.6, 3);
      [["Kata sandi yang aman", "D7.3"], ["Mencari informasi yang jitu", "D7.4"], ["Sopan dan aman di grup kelas", "D7.7"]].forEach(([t, s], i) => { if (i < n) Q.chapter(ctx, 200 + i * 520, 280, 480, i + 1, t, s, { h: 300 }); });
      if (n >= 3) banner(ctx, "satu bab, satu episode yang sudah kamu tonton", 745, 1000, { size: 30 });
    },
    content_rule(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 1.0, 3);
      Q.chapter(ctx, 200, 230, 620, 1, "Kata sandi yang aman", "D7.3", { h: 300, parts: n });
      // contoh isi di kanan
      const d = Q.docWindow(ctx, 880, 200, 800, 620, { name: "panduan-aman-internet-7B", title: "Bab 1: Kata sandi yang aman", bullets: n >= 1 ? ["Aturan: pakai 12 huruf atau lebih."] : [], lines: 0, image: false });
      if (n >= 2) text(ctx, "Contoh: \"kucingku makan 3 bakso!\" lebih kuat daripada \"rani2013\".", d.px + 30, d.cy + 20, 20, { weight: 700, color: C.ink2 });
      if (n >= 3) Q.picture(ctx, d.px + 30, d.cy + 44, 220, 120, {});
      if (l > 5) label(ctx, "dengan kata-katamu sendiri, bukan menyalin", 510, 620, { size: 24, color: C.bad });
      if (l > 7.5) banner(ctx, "satu aturan, satu contoh, satu gambar", 745, 900);
    },

    doc_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const d = Q.docWindow(ctx, 260, 190, 1100, 600, { name: "Pengolah Dokumen (word processor)", title: "Panduan Aman Berinternet", lines: 5, image: false });
      if (l > 2.5) { ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; rr(ctx, d.px - 20, d.py - 70, d.pw + 40, 56, 10); ctx.stroke(); bubble(ctx, 1400, 330, 330, "baris alat di atas", 26, { tailX: 1400, tailDir: -140 }); }
      if (l > 5) { ctx.strokeStyle = C.good; ctx.lineWidth = 6; rr(ctx, d.px, d.py, d.pw, d.ph, 6); ctx.stroke(); bubble(ctx, 1400, 600, 330, "halaman putih: tempat menulis", 26, { tailX: 1400, tailDir: -140, fill: C.goodBg, stroke: C.good, color: C.good }); }
      label(ctx, "untuk tulisan panjang: panduan, laporan, surat", 810, 830, { size: 24, color: C.ink2 });
    },
    doc_tools(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const tools = [["heading", "judul (heading)", "agar bab terlihat"], ["bullet", "daftar bertitik (bullet)", "agar aturan rapi"], ["image", "sisipkan gambar (insert image)", "satu gambar tiap aturan"], ["save", "simpan (save)", "sesering mungkin"]];
      const n = clamp(reveal(l, 0.5, 1.8, 4), 1, 4); const cur = tools[n - 1];
      Q.docWindow(ctx, 200, 190, 1000, 660, { name: "panduan-aman-internet-7B", title: "Bab 1: Kata sandi yang aman", bullets: n >= 2 ? BULLETS : [], lines: n >= 2 ? 0 : 3, image: n >= 3, hlTool: cur[0], toolLabel: cur[1] });
      tools.forEach(([id, t, s], i) => { const on = i < n; ctx.save(); ctx.globalAlpha = on ? 1 : 0.25; card(ctx, 1260, 220 + i * 150, 460, 120, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, (i + 1) + ". " + t, 1290, 268 + i * 150, 24, { weight: 900 }); text(ctx, s, 1290, 306 + i * 150, 22, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    doc_save(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const f = D.windowFrame(ctx, 260, 200, 900, 560, "Simpan sebagai", {});
      text(ctx, "Nama file:", f.x + 20, f.y + 40, 26, { weight: 800, color: C.ink2 });
      const good = l > 2.5; D.textBox(ctx, f.x + 20, f.y + 60, f.w - 40, 80, [good ? "panduan-aman-internet-7B.docx" : "Dokumen1.docx"], l, { size: 30, stroke: good ? C.good : C.bad });
      text(ctx, good ? "✓ menyebut isi dan pemilik, mudah dicari" : "✕ akan hilang di antara ratusan file", f.x + 20, f.y + 190, 26, { weight: 900, color: good ? C.good : C.bad });
      text(ctx, "Folder:", f.x + 20, f.y + 260, 26, { weight: 800, color: C.ink2 });
      [["Sekolah", false], ["Kelas 7", false], ["Proyek Panduan", l > 5]].forEach(([nm, on], i) => { D.fileIcon(ctx, f.x + 60 + i * 60, f.y + 320 + i * 56, 44, "folder", { selected: on }); text(ctx, nm, f.x + 100 + i * 60, f.y + 330 + i * 56, 24, { weight: on ? 900 : 700, color: on ? C.good : C.ink }); });
      if (l > 5) bubble(ctx, 1220, 560, 420, "simpan di folder proyek, seperti di episode D7.0", 26, { tailX: 1230, tailDir: -160, fill: C.goodBg, stroke: C.good, color: C.good });
      kiko(ctx, 1500, 760, 140, 0);
    },

    slide_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "PRESENTASI: KUMPULAN SLIDE", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      // deretan slide kecil
      ["Judul", "Bab 1", "Bab 2", "Bab 3", "Terima kasih"].forEach((t, i) => Q.slide(ctx, 220 + i * 190, 270, 170, { title: t, bg: i === 1 ? "#FFF9E0" : "#fff" }));
      const n = reveal(l, 1.5, 1.4, 4);
      const rules = ["satu ide per slide", "paling banyak lima kata", "satu gambar", "huruf besar (24 ke atas)"];
      rules.forEach((r, i) => { if (i < n) { card(ctx, 260 + i * 360, 430, 330, 110, { fill: C.goodBg, stroke: C.good, lw: 4, r: 14 }); text(ctx, "✓ " + r, 425 + i * 360, 495, 24, { align: "center", weight: 900, color: C.good }); } });
      Q.slide(ctx, 730, 565, 460, { title: "Bab 1", words: "Kata sandi: panjang dan rahasia", image: true, good: n >= 4 });
    },
    slide_compare(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.slide(ctx, 180, 230, 760, { title: "Kata sandi", lines: 12, bad: l > 2 });
      Q.slide(ctx, 980, 230, 760, { title: "Kata sandi", words: "Panjang dan rahasia", image: true, good: l > 4.5 });
      if (l > 2) { text(ctx, "✕ dua belas kalimat kecil", 560, 690, 28, { align: "center", weight: 900, color: C.bad }); text(ctx, "penonton sibuk membaca, tidak mendengarkanmu", 560, 725, 22, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 4.5) { text(ctx, "✓ lima kata, satu gambar", 1360, 690, 28, { align: "center", weight: 900, color: C.good }); text(ctx, "mata ke slide sebentar, lalu kembali kepadamu", 1360, 725, 22, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 7) banner(ctx, "slide = pendukung, bukan pengganti ceritamu", 750, 900, { size: 30 });
    },

    present_tips(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      // penyaji di depan, penonton adik kelas
      Q.slide(ctx, 200, 230, 520, { title: "Bab 2", words: "Cari dengan kata kunci jitu", image: true });
      kid(ctx, 820, 560, 160, { hair: "long", hairColor: "#4A2E1A", point: true }); text(ctx, "Rani (penyaji)", 820, 800, 22, { align: "center", weight: 800, color: C.ink2 });
      for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) kid(ctx, 1080 + c * 130 + (r % 2) * 40, 520 + r * 140, 90, { hair: (r + c) % 2 ? "long" : undefined, hairColor: ["#2B2118", "#4A2E1A", "#1B1B1B"][(r + c) % 3] });
      text(ctx, "adik kelas 6", 1380, 810, 22, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 0.8, 1.8, 3);
      const tips = ["berlatih dulu: 2 menit per orang", "lihat penonton, bukan membaca slide", "ajukan satu pertanyaan kepada mereka"];
      tips.forEach((t, i) => { if (i < n) { card(ctx, 760 + i * 10, 220 + i * 70, 900, 60, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "✓ " + t, 790 + i * 10, 260 + i * 70, 24, { weight: 900, color: C.good }); } });
      if (n >= 3) bubble(ctx, 330, 640, 320, "Siapa yang punya grup kelas?", 24, { tailX: 600, tailDir: 20, fill: "#FFF3D6", stroke: C.accent });
    },
    rubric(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "SETELAH TAMPIL", 560, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      card(ctx, 200, 270, 720, 200, { fill: C.bg2, r: 16 }); text(ctx, "1. minta SATU masukan dari adik kelas", 240, 330, 26, { weight: 900 }); text(ctx, "2. ubah SATU hal", 240, 380, 26, { weight: 900 }); text(ctx, "\"gambarnya kurang besar, Kak\" → perbesar gambar", 240, 430, 22, { weight: 700, color: C.ink2 });
      const n = reveal(l, 2.0, 1.4, 4);
      Q.rubric(ctx, 980, 230, 720, [["Isi benar", "sesuai episode D7.3, D7.4, D7.7"], ["Bahasa sesuai", "kata sederhana untuk kelas 6"], ["Tampilan jelas", "judul, daftar, gambar, huruf besar"], ["Kerja tim", "semua peran berjalan"]], { n });
      if (n >= 4) label(ctx, "rubrik: nilai sendiri dulu, baru dinilai guru", 560, 620, { size: 26, color: C.ink2 });
      kiko(ctx, 560, 760, 140, 0, { mood: "happy" });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Perencana proyek", "pembaca, tujuan, peran tim", (x, y) => { ["Pembaca: kelas 6", "Tujuan: aman", "Tim: 4 peran"].forEach((s, i) => { card(ctx, x - 170, y - 90 + i * 60, 340, 50, { fill: "#fff", stroke: "#CFDCD5", lw: 3, r: 10 }); text(ctx, s, x - 150, y - 56 + i * 60, 22, { weight: 800 }); }); }],
        ["Kerangka slide", "lima slide, lima kata", (x, y) => { ["Judul", "Bab 1", "Bab 2"].forEach((s, i) => Q.slide(ctx, x - 190 + i * 130, y - 50, 120, { title: s })); }],
        ["Cek rubrik", "nilai sendiri sebelum tampil", (x, y) => { ["Isi benar", "Bahasa sesuai", "Tampilan jelas"].forEach((s, i) => { text(ctx, "☑ " + s, x - 150, y - 60 + i * 50, 26, { weight: 800, color: C.good }); }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 610, 28, { align: "center", weight: 900 }); text(ctx, t2, x, 650, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu kerjakan proyeknya empat pertemuan di kelas", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
