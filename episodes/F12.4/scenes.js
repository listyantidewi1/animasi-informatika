/* Adegan episode F12.4: Hukum Digital dan Demokrasi Digital. Gaya diagram Fase F. Semua kejadian, nama, toko, dan akun fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, hukum.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Hk = K.hukum, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, clamp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 665, w = 1100, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 30, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 215) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const dim = (ctx, on, fn) => { ctx.save(); if (!on) ctx.globalAlpha = 0.2; fn(); ctx.restore(); };
  const fiktif = (ctx, x = 1780, y = 870) => text(ctx, "contoh fiktif", x, y, 16, { align: "right", weight: 800, color: "#9AA7AF" });

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 270, 560, 170, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.8, 5);
      dim(ctx, n >= 1, () => { card(ctx, 480, 250, 1220, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "pertanyaan kunci: hak siapa yang terlibat?", 1090, 302, 30, { align: "center", weight: 900, color: C.accentDark }); });
      [["⚖️", "UU ITE", "nama baik, hoaks"], ["🔒", "UU PDP", "data pribadi"], ["©️", "UU Hak Cipta", "karya orang"], ["🗳️", "demokrasi", "partisipasi digital"]].forEach(([ic, t, s], i) => dim(ctx, n >= i + 2, () => { const x = 480 + i * 310; card(ctx, x, 370, 290, 260, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 145, 460, 56, { align: "center" }); text(ctx, t, x + 145, 530, 28, { align: "center", weight: 900 }); text(ctx, s, x + 145, 572, 20, { align: "center", weight: 800, color: C.ink2 }); }));
      if (n >= 5) label(ctx, "lewat contoh, bukan hafalan pasal", 1090, 700, { size: 26 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "EPISODE SEBELUMNYA", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D9.4", "Data Pribadi, Identitas Digital, dan Kesadaran Penuh"], ["E.9", "Digitalisasi Budaya Lokal: hak cipta dan lisensi"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 260, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 420, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 490, 26, 520, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "semua contoh fiktif · bukan nasihat hukum", 960, 680, { size: 26, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_kartu(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU: KARTU DILEMA");
      const n = reveal(l, 3.0, 2.6, 4);
      Hk.board(ctx, 220, 260, 1480, 460, [["memotret catatan teman lalu membagikannya ke grup angkatan", 2], ["mengutip satu kalimat buku dengan menyebut sumbernya", 0], ["membagikan foto kartu identitas teman", 1], ["mengunggah video pertandingan antarkelas", 2]], { n });
      fiktif(ctx);
    },
    unplugged_alasan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TERGANTUNG APA?");
      const n = reveal(l, 3.0, 2.4, 4);
      kid(ctx, 330, 560, 120, { point: true }); kid(ctx, 560, 560, 120, { hair: "long" }); kid(ctx, 790, 560, 120);
      bubble(ctx, 200, 330, 330, "boleh, kan cuma catatan?", 22); bubble(ctx, 600, 330, 330, "sudah izin pemiliknya?", 22);
      [["🙋", "izin pemiliknya"], ["✅", "kebenaran isinya"], ["🛡️", "siapa yang bisa dirugikan"]].forEach(([ic, t], i) => dim(ctx, n >= i + 1, () => { card(ctx, 1060, 280 + i * 130, 640, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, ic + "  " + t, 1100, 348 + i * 130, 30, { weight: 900 }); }));
      if (n >= 4) label(ctx, "inilah yang diatur undang-undang", 1380, 700, { size: 26 });
    },
    uu_ite(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "UU INFORMASI DAN TRANSAKSI ELEKTRONIK");
      const n = reveal(l, 1.5, 2.2, 7);
      Hk.law(ctx, 220, 250, 1480, "UU ITE", "UU 11/2008, diubah UU 19/2016 dan UU 1/2024", { ic: "⚖️" });
      text(ctx, "mengakui", 220, 420, 24, { weight: 900, color: C.good }); text(ctx, "melarang, antara lain", 960, 420, 24, { weight: 900, color: C.bad });
      Hk.list(ctx, 220, 440, 680, [["dokumen dan informasi elektronik", "ok"], ["tanda tangan elektronik", "ok"], ["transaksi elektronik", "ok"]], { n: Math.min(n, 3), gap: 72 });
      Hk.list(ctx, 960, 440, 740, [["menuduh untuk menyerang nama baik", "no"], ["berita bohong yang memicu kerusuhan", "no"], ["ujaran kebencian SARA", "no"], ["masuk sistem orang tanpa izin", "no"]], { n: Math.max(0, n - 3), gap: 72 });
    },
    dilema_ulasan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DILEMA 1: PESANAN TERLAMBAT");
      const n = reveal(l, 2.0, 3.0, 4);
      const sc = D.phone(ctx, 400, 500, 300, 480); ctx.fillStyle = "#fff"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 22); ctx.fill();
      text(ctx, "Toko Serba Ada", 400, sc.y + 44, 20, { align: "center", weight: 900 }); text(ctx, "pesanan #1027", 400, sc.y + 72, 16, { align: "center", weight: 700, color: C.ink2 });
      [["dipesan", "3 Maret"], ["janji tiba", "6 Maret"], ["tiba", "20 Maret"]].forEach(([a, c], i) => { text(ctx, a, sc.x + 22, sc.y + 120 + i * 44, 18, { weight: 800, color: C.ink2 }); text(ctx, c, sc.x + sc.w - 22, sc.y + 120 + i * 44, 18, { align: "right", weight: 900, color: i === 2 ? C.bad : C.ink }); });
      Hk.branch(ctx, 560, 500, 720, 280, [["ulasan jujur: tanggal pesan, tanggal tiba, bukti chat", "hak konsumen, berdasar fakta", true], ["\"PEMILIKNYA PENIPU!!\" di grup, tanpa bukti", "tuduhan bisa menyerang nama baik", false]], { reveal: n, judged: n >= 3, w: 980, h: 130 });
      if (n >= 4) label(ctx, "kritik berbeda dengan tuduhan", 1210, 720, { size: 26 });
      fiktif(ctx);
    },
    uu_pdp(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "UU PELINDUNGAN DATA PRIBADI");
      const n = reveal(l, 1.5, 2.2, 7);
      Hk.law(ctx, 220, 250, 1480, "UU PDP", "UU 27/2022 tentang Pelindungan Data Pribadi", { ic: "🔒", col: "#2E7E9A" });
      text(ctx, "hak pemilik data", 220, 420, 24, { weight: 900, color: C.kiko }); text(ctx, "kewajiban pengelola data", 960, 420, 24, { weight: 900, color: C.accentDark });
      Hk.list(ctx, 220, 440, 680, [["tahu datanya dipakai untuk apa", "info"], ["membetulkan dan menghapus", "info"], ["menarik persetujuan", "info"]], { n: Math.min(n, 3), gap: 72 });
      Hk.list(ctx, 960, 440, 740, [["memakai sesuai tujuan yang disetujui", "info"], ["menjaga keamanan data", "info"], ["bocor? beri tahu paling lambat 3 × 24 jam", "info"]], { n: Math.max(0, n - 3), gap: 72 });
      if (n >= 7) text(ctx, "data spesifik: kesehatan, biometrik, data anak, keuangan pribadi", 960, 735, 20, { align: "center", weight: 800, color: C.ink2 });
    },
    dilema_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DILEMA 2: DATA PESERTA LOMBA");
      const n = reveal(l, 1.5, 3.0, 5);
      const x = 220, y = 270, cw = [220, 220, 260]; card(ctx, x, y, 700, 330, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, 700, 54, 12); ctx.fill();
      ["nama", "nomor HP", "alamat"].forEach((h, i) => text(ctx, h, x + 20 + cw.slice(0, i).reduce((a, c) => a + c, 0), y + 36, 22, { weight: 900, color: C.ink2 }));
      [["Peserta A", "08xx-xxxx-11", "Jl. Melati ..."], ["Peserta B", "08xx-xxxx-27", "Jl. Kenanga ..."], ["Peserta C", "08xx-xxxx-35", "Jl. Mawar ..."], ["Peserta D", "08xx-xxxx-42", "Jl. Anggrek ..."]].forEach((r, i) => r.forEach((v, c) => text(ctx, v, x + 20 + cw.slice(0, c).reduce((a, d) => a + d, 0), y + 100 + i * 60, 22, { weight: 700 })));
      text(ctx, "dikumpulkan untuk: pendaftaran lomba", x + 20, y + 370, 22, { weight: 900, color: C.good });
      if (n >= 2) bubble(ctx, 1000, 400, 560, "Sin, kirim datanya dong, buat promosi jualanku.", 24);
      dim(ctx, n >= 3, () => { card(ctx, 1000, 470, 330, 110, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "tujuan: lomba ✓", 1165, 535, 26, { align: "center", weight: 900, color: C.good }); card(ctx, 1370, 470, 330, 110, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "tujuan: jualan ✕", 1535, 535, 26, { align: "center", weight: 900, color: C.bad }); });
      if (n >= 4) label(ctx, "tanpa persetujuan pemiliknya: tidak", 1350, 640, { size: 28 });
      fiktif(ctx);
    },
    uu_hak_cipta(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "UU HAK CIPTA");
      const n = reveal(l, 1.5, 2.8, 6);
      Hk.law(ctx, 220, 250, 1480, "UU Hak Cipta", "UU 28/2014 tentang Hak Cipta", { ic: "©️", col: "#B57A12" });
      dim(ctx, n >= 1, () => { card(ctx, 220, 410, 700, 150, { fill: C.bg2, r: 16 }); text(ctx, "karya diwujudkan", 350, 470, 24, { align: "center", weight: 900 }); text(ctx, "→", 480, 475, 40, { align: "center", weight: 900, color: C.accent }); text(ctx, "hak cipta lahir otomatis", 700, 470, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "tidak perlu didaftarkan dulu", 570, 525, 20, { align: "center", weight: 800, color: C.ink2 }); });
      dim(ctx, n >= 2, () => { card(ctx, 980, 410, 720, 150, { fill: "#FFF9E0", r: 16 }); text(ctx, "lagu, buku: seumur hidup pencipta + 70 tahun", 1340, 470, 22, { align: "center", weight: 900 }); text(ctx, "program komputer: 50 tahun sejak diumumkan", 1340, 520, 22, { align: "center", weight: 900, color: C.ink2 }); });
      dim(ctx, n >= 4, () => Hk.list(ctx, 220, 590, 1480, [["untuk pendidikan, sebut sumber lengkap, dan tidak merugikan kepentingan wajar pencipta", "ok"]], { gap: 80 }));
    },
    dilema_lagu(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DILEMA 3: LAGU UNTUK VIDEO TUGAS");
      const n = reveal(l, 1.5, 3.0, 5);
      card(ctx, 220, 270, 560, 330, { fill: "#1F2A33", r: 16 }); ctx.fillStyle = "#3A4A56"; rr(ctx, 240, 290, 520, 200, 10); ctx.fill(); text(ctx, "🎬 video tugas kelompok", 500, 400, 26, { align: "center", weight: 900, color: "#fff" });
      ctx.fillStyle = "#8E6BBF"; rr(ctx, 240, 510, 520, 34, 8); ctx.fill(); text(ctx, "♪ lagu populer (utuh)", 256, 534, 18, { weight: 900, color: "#fff" }); ctx.fillStyle = "#2E7E9A"; rr(ctx, 240, 552, 380, 30, 8); ctx.fill(); text(ctx, "🎙 suara kelompok", 256, 574, 16, { weight: 900, color: "#fff" });
      Hk.branch(ctx, 790, 435, 880, 270, [["diputar di kelas untuk belajar, sumber disebut", "pemakaian untuk pendidikan", true], ["diunggah ke publik dengan lagu utuh, tanpa izin", "menyebarkan karya orang tanpa izin", false]], { reveal: Math.min(n, 2), judged: n >= 3, w: 820, h: 120 });
      dim(ctx, n >= 4, () => { card(ctx, 880, 560, 820, 150, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 }); text(ctx, "pilihan aman untuk diunggah", 1290, 600, 22, { align: "center", weight: 900, color: C.good }); text(ctx, "musik berlisensi bebas · Creative Commons (cek syaratnya) · buatan sendiri", 1290, 650, 20, { align: "center", weight: 900 }); });
      fiktif(ctx);
    },
    demokrasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TEKNOLOGI DIGITAL UNTUK DEMOKRASI");
      const n = reveal(l, 1.5, 3.0, 4);
      [["📄", "informasi publik", "hak meminta informasi dari badan publik", "UU 14/2008 Keterbukaan Informasi Publik"], ["📣", "kanal aduan resmi", "laporan layanan publik, bisa dipantau", "misalnya SP4N-LAPOR!"], ["🗳️", "informasi pemilu", "dari situs penyelenggara pemilu", "bukan dari pesan berantai"]].forEach(([ic, t, s, f], i) => dim(ctx, n >= i + 1, () => { const x = 220 + i * 500; card(ctx, x, 270, 460, 330, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 230, 360, 60, { align: "center" }); text(ctx, t, x + 230, 430, 28, { align: "center", weight: 900 }); para(ctx, s, x + 230, 480, 21, 400, { align: "center", weight: 800, color: C.ink2 }); text(ctx, f, x + 230, 570, 18, { align: "center", weight: 900, color: C.kiko }); }));
      if (n >= 4) label(ctx, "partisipasi berbasis fakta dan sumber resmi", 960, 680, { size: 28 });
    },
    berpendapat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BERPENDAPAT: HAK DAN TANGGUNG JAWAB");
      const n = reveal(l, 1.5, 3.0, 4);
      Hk.list(ctx, 300, 280, 1320, [["cek fakta sebelum membagikan", "ok"], ["bantah gagasannya, bukan menyerang orangnya", "ok"], ["waspadai akun palsu dan pendengung (buzzer)", "ok"], ["lindungi data saat mengisi formulir dan petisi", "ok"]], { n, gap: 100, size: 30 });
    },
    empat_tanya(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "EMPAT PERTANYAAN SEBELUM BERTINDAK");
      const n = reveal(l, 1.5, 3.4, 4);
      [["1", "hak siapa yang terlibat?", "nama baik · data · karya"], ["2", "benar dan bisa dibuktikan?", "fakta, bukan dugaan"], ["3", "aku punya izin?", "dari pemilik data atau karya"], ["4", "apa akibatnya kalau tersebar?", "jejak digital sulit ditarik"]].forEach(([k, t, s], i) => dim(ctx, n >= i + 1, () => { const x = 220 + (i % 2) * 750, y = 270 + Math.floor(i / 2) * 210; card(ctx, x, y, 730, 180, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 18 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 60, y + 90, 34, 0, Math.PI * 2); ctx.fill(); text(ctx, k, x + 60, y + 103, 36, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, x + 120, y + 82, 30, { weight: 900 }); text(ctx, s, x + 120, y + 124, 22, { weight: 800, color: C.ink2 }); }));
    },
    cek_resmi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "UNDANG-UNDANG BISA BERUBAH");
      const n = reveal(l, 1.5, 2.4, 5);
      ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(320, 420); ctx.lineTo(1600, 420); ctx.stroke();
      [["2008", "UU 11/2008", "UU ITE lahir"], ["2016", "UU 19/2016", "perubahan pertama"], ["2024", "UU 1/2024", "perubahan kedua"]].forEach(([y, nm, s], i) => dim(ctx, n >= i + 1, () => { const x = 420 + i * 540; ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x, 420, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, y, x, 370, 34, { align: "center", weight: 900 }); text(ctx, nm, x, 480, 24, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, x, 516, 20, { align: "center", weight: 800, color: C.ink2 }); }));
      dim(ctx, n >= 4, () => { card(ctx, 320, 570, 1280, 130, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "baca teks resmi di situs peraturan pemerintah (JDIH)", 960, 625, 26, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "untuk hal penting: tanya guru, orang tua, atau ahli hukum", 960, 672, 22, { align: "center", weight: 800, color: C.ink2 }); });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 230, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Skenario bercabang", "pilih tindakan, lihat akibatnya", (x, y) => { text(ctx, "pesanan terlambat. kamu…", x - 200, y - 80, 20, { weight: 800, color: C.ink2 }); [["A. tulis ulasan berisi fakta", "✓ hak konsumen", C.goodBg, C.good], ["B. tuduh penipu tanpa bukti", "✕ menyerang nama baik", C.badBg, C.bad]].forEach(([t, r, bg, col], i) => { card(ctx, x - 200, y - 60 + i * 92, 400, 80, { fill: bg, stroke: col, lw: 3, r: 12 }); text(ctx, t, x - 184, y - 26 + i * 92, 20, { weight: 900 }); text(ctx, r, x - 184, y + 2 + i * 92, 18, { weight: 900, color: col }); }); }],
        ["Pencocok aturan", "situasi ↔ undang-undang", (x, y) => [["ulasan menuduh", "UU ITE"], ["data peserta", "UU PDP"], ["lagu di video", "Hak Cipta"]].forEach(([a, s], i) => { card(ctx, x - 200, y - 100 + i * 66, 400, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, a, x - 180, y - 64 + i * 66, 20, { weight: 800 }); text(ctx, s, x + 180, y - 64 + i * 66, 20, { align: "right", weight: 900, color: C.kiko }); })],
        ["Empat pertanyaan", "sebelum mengunggah", (x, y) => ["hak siapa?", "benar?", "izin?", "akibat?"].forEach((s, i) => { card(ctx, x - 200, y - 110 + i * 54, 400, 46, { fill: "#FFF3D6", r: 10 }); text(ctx, (i + 1) + ". " + s, x - 180, y - 80 + i * 54, 20, { weight: 900 }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 270, 480, 400, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 320, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 332, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 332, 24, { weight: 900 }); text(ctx, t2, x - 160, 366, 19, { weight: 700, color: C.ink2 }); draw(x, 530); });
      text(ctx, "lalu bersama kelompok: tiga dilema dari sekolahmu, nama disamarkan, jadi panduan satu halaman", 960, 725, 24, { align: "center", color: C.ink2, weight: 800 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
