/* Adegan episode E.9: Proyek Digitalisasi Budaya Lokal. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, proyek.js, konten.js, data.js, budaya.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Pr = K.proyek, Kt = K.konten, Dq = K.dataq, B = K.budaya, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const NOTES = [[160, 110, "🎶", "lagu dolanan · Nek Sumi"], [420, 190, "🍲", "resep sayur lodeh · Bu Ani"], [700, 100, "🧵", "motif tenun · Pak Darto"], [250, 320, "🪀", "gasing · Kang Udin"], [560, 330, "📖", "cerita Si Kancil · Mbah Karto"]];
  const META = [["Judul", "jenis", "narasumber", "lokasi", "tanggal", "perekam", "lisensi", "kata kunci"], ["Cublak-cublak Suweng", "lagu", "Nek Sumi", "Ds. Mekar", "2026-11-03", "Tim 10A", "CC BY-SA", "dolanan, lagu"], ["Gasing bambu", "video", "Kang Udin", "Ds. Mekar", "2026-11-05", "Tim 10B", "CC BY-SA", "permainan"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.4, 3);
      [["🎬", "produksi konten", "D9.5"], ["🔍", "membaca lateral", "E.4"], ["🧹", "data berkualitas", "E.8"]].forEach(([ic, t, ep], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 540 + i * 400; card(ctx, x, 260, 360, 170, { fill: C.bg2, r: 16 }); text(ctx, ic, x + 60, 350, 44, { align: "center" }); text(ctx, t, x + 110, 335, 24, { weight: 900 }); text(ctx, ep, x + 110, 370, 18, { weight: 800, color: C.kiko }); ctx.restore(); });
      const m = reveal(l, 6, 1.0, 4);
      [["©", "hak cipta"], ["CC", "lisensi"], ["✍️", "atribusi"], ["👩‍💻", "profesi"]].forEach(([ic, t], i) => { ctx.save(); if (i >= m) ctx.globalAlpha = 0.2; const x = 540 + i * 300; card(ctx, x, 470, 270, 190, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, ic, x + 135, 550, 48, { align: "center" }); text(ctx, t, x + 135, 610, 24, { align: "center", weight: 900 }); ctx.restore(); });
      if (m >= 4) label(ctx, "yang baru di proyek ini", 1140, 720);
    },
    prereq(ctx, b, l) {
      card(ctx, 200, 200, 1520, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D9.5", "Produksi dan Diseminasi Konten Digital"], ["E.4", "Mencari, Memeriksa, Membaca Lateral"], ["E.8", "Data Berkualitas dari Komputasi Manusia"]].forEach(([c, t], i) => { const x = 260 + i * 470; card(ctx, x, 340, 440, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 220, 420, 44, { align: "center", weight: 900 }); para(ctx, t, x + 220, 480, 26, 400, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1660, 820, 120, 0);
    },
    unplugged_peta(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: PETA BUDAYA KAMPUNG");
      B.map(ctx, 240, 270, 900, 440, NOTES, { n: reveal(l, 2, 1.6, 5) });
      kid(ctx, 1300, 560, 130, { point: true }); kid(ctx, 1500, 580, 110, { hair: "long" });
      if (l > 10) { card(ctx, 1200, 280, 520, 170, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 14 }); para(ctx, "satu tempelan: budaya apa, di mana, siapa yang masih menguasainya", 1460, 330, 22, 480, { align: "center", weight: 900, color: C.accentDark }); }
    },
    unplugged_pilih(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PILIH SATU: TIGA SYARAT", 215);
      const n = reveal(l, 1.5, 2.2, 3);
      [["🧓", "ada narasumber yang bisa ditemui", "bukan hanya cerita dari internet"], ["📅", "bisa direkam dalam dua minggu", "jarak, waktu, perangkat tersedia"], ["🔍", "belum banyak terdokumentasi", "cek dengan membaca lateral: apa yang sudah ada?"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 230, 270 + i * 130, 1000, 112, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, ic, 290, 340 + i * 130, 44, { align: "center" }); text(ctx, (i + 1) + ". " + t, 350, 320 + i * 130, 26, { weight: 900 }); text(ctx, s, 350, 356 + i * 130, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) { card(ctx, 1280, 280, 440, 370, { fill: "#FFF59D", r: 10 }); text(ctx, "🎶 lagu dolanan", 1500, 340, 28, { align: "center", weight: 900 }); ["✓ Nek Sumi bersedia", "✓ 2 kali kunjungan", "✓ belum ada rekamannya"].forEach((s, i) => text(ctx, s, 1320, 410 + i * 50, 24, { weight: 800, color: C.good })); text(ctx, "pilihan Tim 10A", 1500, 610, 20, { align: "center", weight: 800, color: C.ink2 }); }
    },

    riset_izin(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LANGKAH 1 · RISET DAN IZIN", 215);
      const n = reveal(l, 1.5, 1.6, 3);
      [["🔍", "baca lateral", "apa yang sudah ditulis, siapa ahlinya"], ["🤝", "temui narasumber", "jelaskan tujuan, minta izin rekam dan sebar"], ["📝", "izin ditulis", "nama yang ingin dicantumkan, boleh untuk apa"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 230, 270 + i * 120, 760, 104, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, ic, 290, 335 + i * 120, 40, { align: "center" }); text(ctx, t, 350, 315 + i * 120, 24, { weight: 900 }); text(ctx, s, 350, 350 + i * 120, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) B.consent(ctx, 1060, 270, 640, [["Narasumber", "Nek Sumi (nama panggilan)"], ["Karya", "lagu dolanan, rekaman suara"], ["Boleh direkam", "ya"], ["Boleh disebarkan", "ya, dengan atribusi"], ["Lisensi disepakati", "CC BY-SA"]], { signed: l > 9 });
      if (l > 9) label(ctx, "izin ditulis, bukan diingat", 1380, 700, { size: 24 });
    },
    perangkat(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LANGKAH 2 · PERANGKAT YANG SESUAI", 215);
      const n = reveal(l, 1.5, 1.9, 4);
      [["📱", "Video HP + tumpuan", "permainan, tarian", "MP4"], ["🎙️", "Perekam suara", "cerita, lagu · tempat sepi", "MP3"], ["📷", "Foto tiap langkah", "resep, kerajinan", "JPG"], ["🖨️", "Pemindai / foto rata", "motif kain, naskah", "JPG · PDF"]].forEach(([ic, nm, f, fmt], i) => B.device(ctx, 230 + (i % 2) * 740, 270 + Math.floor(i / 2) * 150, 700, ic, nm, f, fmt, { dim: i >= n, on: i === n - 1 }));
      if (n >= 4) label(ctx, "format umum supaya bisa dibuka siapa saja, sepuluh tahun lagi", 960, 630, { size: 24 });
    },
    metadata(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LANGKAH 3 · METADATA: DATA TENTANG DATA", 215);
      const n = reveal(l, 1.0, 0.7, 8);
      Dq.table(ctx, 220, 270, [230, 90, 130, 130, 140, 120, 120, 170], META[0].slice(0, Math.max(1, n)), META.slice(1).map(r => r.slice(0, Math.max(1, n))), {}, { rh: 52 });
      if (l > 8) { card(ctx, 220, 460, 700, 130, { fill: "#1F2A33", r: 12 }); text(ctx, "nama file seragam", 240, 495, 16, { weight: 900, color: "#8FD0E6" }); text(ctx, "lagu_cublak-cublak-suweng_2026-11-03.mp3", 240, 535, 20, { weight: 900, color: "#fff" }); text(ctx, "video_gasing-bambu_2026-11-05.mp4", 240, 568, 20, { weight: 900, color: "#fff" }); }
      if (l > 11) { card(ctx, 980, 460, 720, 130, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "tanpa metadata: 100 file = tumpukan", 1340, 515, 26, { align: "center", weight: 900, color: C.bad }); text(ctx, "video1.mp4, video2.mp4, rekaman nenek.mp3 …", 1340, 555, 18, { align: "center", weight: 700, color: C.ink2 }); }
    },
    label_budaya(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LABEL DENGAN PANDUAN, TRANSKRIP DUA BAHASA", 215);
      card(ctx, 230, 270, 560, 300, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 14 }); text(ctx, "PANDUAN KATEGORI", 510, 310, 20, { align: "center", weight: 900, color: C.accentDark }); ["permainan · lagu · cerita", "kuliner · kriya · upacara", "ragu? bahas berdua, catat keputusannya"].forEach((s, i) => text(ctx, s, 260, 360 + i * 44, 20, { weight: 800 }));
      Dq.agree(ctx, 260, 520, 500, 90, { label: "kesepakatan dua pelabel" });
      const n = reveal(l, 5, 2.2, 2);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 850, 270, 850, 300, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); text(ctx, "TRANSKRIP", 870, 305, 18, { weight: 900, color: C.ink2 }); text(ctx, "Cublak-cublak suweng, suwenge ting gelenter …", 870, 350, 22, { weight: 900 }); text(ctx, "(bahasa Jawa, asli)", 870, 380, 16, { weight: 700, color: C.muted }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; text(ctx, "Tempat anting, antingnya berserakan …", 870, 450, 22, { weight: 900, color: C.kiko }); text(ctx, "(terjemahan Indonesia)", 870, 480, 16, { weight: 700, color: C.muted }); ctx.restore();
      if (n >= 2) label(ctx, "transkrip membuat arsip bisa dicari", 1275, 630, { size: 24 });
    },

    hak_cipta(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "HAK CIPTA LAHIR OTOMATIS", 215);
      const n = reveal(l, 1.5, 1.2, 5);
      [["📷", "foto"], ["🎬", "video"], ["📝", "tulisan"], ["🎵", "lagu"], ["💻", "kode"]].forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 300; card(ctx, x, 270, 270, 160, { fill: C.bg2, r: 16 }); text(ctx, ic, x + 135, 340, 48, { align: "center" }); text(ctx, t, x + 135, 400, 22, { align: "center", weight: 900 }); text(ctx, "©", x + 230, 310, 30, { align: "center", weight: 900, color: C.bad }); ctx.restore(); });
      if (n >= 5) { card(ctx, 230, 470, 700, 170, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "pembuat berhak menentukan:", 580, 515, 22, { align: "center", weight: 900, color: C.good }); text(ctx, "siapa boleh menyalin · mengubah · menyebarkan", 580, 560, 22, { align: "center", weight: 800 }); text(ctx, "tidak perlu didaftarkan", 580, 600, 18, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 9) { card(ctx, 1000, 470, 700, 170, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "\"ada di internet\" ≠ bebas dipakai", 1350, 540, 28, { align: "center", weight: 900, color: C.bad }); text(ctx, "tanpa keterangan lisensi: hak cipta penuh berlaku", 1350, 590, 18, { align: "center", weight: 700, color: C.ink2 }); }
    },
    lisensi_cc(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LISENSI CREATIVE COMMONS: EMPAT UNSUR", 215);
      const n = reveal(l, 2.0, 2.0, 4);
      [["BY", "Atribusi", "sebutkan pembuatnya"], ["SA", "Berbagi serupa", "karya turunan memakai lisensi yang sama"], ["NC", "Nonkomersial", "tidak untuk dijual atau dimonetisasi"], ["ND", "Tanpa turunan", "tidak boleh diubah"]].forEach(([c, nm, d], i) => B.ccCard(ctx, 230 + (i % 2) * 740, 270 + Math.floor(i / 2) * 170, 700, c, nm, d, { dim: i >= n, on: i === n - 1 }));
      if (n >= 4) { let x = 360; [["CC BY", "paling bebas"], ["CC BY-SA", "bebas, turunan tetap terbuka"], ["CC BY-NC-ND", "paling ketat"]].forEach(([c, d]) => { const w = B.badge(ctx, x, 630, c); text(ctx, d, x + w / 2, 700, 16, { align: "center", weight: 800, color: C.ink2 }); x += w + 120; }); }
    },
    atribusi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ATRIBUSI: EMPAT HAL", 215);
      const n = reveal(l, 1.5, 2.0, 4);
      B.attribution(ctx, 230, 270, 760, [["judul karya", "Lagu Cublak-cublak Suweng"], ["pembuat", "dibawakan Nek Sumi, direkam Tim 10A"], ["sumber", "arsip-budaya.sekolah.example"], ["lisensi", "CC BY-SA 4.0"]], { n });
      if (n >= 4) { card(ctx, 1060, 270, 640, 220, { fill: "#1F2A33", r: 14 }); text(ctx, "DESKRIPSI VIDEO", 1080, 305, 16, { weight: 900, color: "#8FD0E6" }); para(ctx, "\"Lagu Cublak-cublak Suweng\" dibawakan Nek Sumi, direkam Tim 10A SMA Nusa Bangsa (arsip-budaya.sekolah.example), CC BY-SA 4.0", 1380, 350, 18, 600, { align: "center", weight: 800, color: "#fff" }); }
      if (l > 10) label(ctx, "ditulis di deskripsi, bukan disembunyikan", 1380, 580, { size: 24 });
    },
    pakai_aset(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MEMAKAI ASET ORANG LAIN", 215);
      const n = reveal(l, 1.5, 2.0, 4);
      [["🔎", "cari yang berlisensi terbuka atau domain publik", "filter lisensi di mesin pencari gambar/musik"], ["📜", "baca syaratnya", "BY? SA? NC? ND?"], ["✍️", "tulis atribusinya", "judul · pembuat · sumber · lisensi"], ["🙋", "ragu? buat sendiri atau minta izin tertulis", "musik NC tidak boleh di video yang dimonetisasi"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 230, 270 + i * 105, 1460, 92, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, ic, 290, 330 + i * 105, 40, { align: "center" }); text(ctx, (i + 1) + ". " + t, 350, 310 + i * 105, 24, { weight: 900 }); text(ctx, s, 350, 345 + i * 105, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) label(ctx, "karya orang lain ada pemiliknya (ingat D9.5)", 960, 720, { size: 24 });
    },
    profesi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SIAPA DI BALIK ARSIP DIGITAL?", 215);
      const n = reveal(l, 1.5, 1.6, 6);
      [["🗄️", "Arsiparis digital", "menata koleksi dan metadata"], ["🌐", "Pengembang web", "membangun situs arsip"], ["📊", "Analis data", "membaca pola dari metadata"], ["🎨", "Desainer UX", "membuatnya mudah dipakai"], ["🛡️", "Spesialis keamanan", "menjaga akun dan data"], ["📶", "Teknisi jaringan", "menyambungkan server dan sekolah"]].forEach(([ic, nm, d], i) => B.job(ctx, 230 + (i % 2) * 740, 270 + Math.floor(i / 2) * 135, 700, ic, nm, d, { dim: i >= n, on: i === n - 1 }));
      if (n >= 6) label(ctx, "semua berawal dari yang kamu pelajari tahun ini", 960, 700, { size: 24 });
    },
    pameran(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "RENCANA EMPAT MINGGU DAN PAMERAN", 215);
      const n = reveal(l, 1.5, 1.6, 4);
      Pr.timeline(ctx, 260, 330, 1400, ["riset + rekam", "riset + rekam", "metadata + sunting", "tayang + pameran"], { n });
      if (n >= 4) { [["🗂️", "arsip digital berlisensi"], ["🎬", "satu konten sosialisasi"], ["🎤", "presentasi di hadapan narasumber"]].forEach(([ic, t], i) => { card(ctx, 260 + i * 480, 470, 440, 120, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, ic, 310 + i * 480, 545, 40, { align: "center" }); para(ctx, t, 360 + i * 480, 520, 22, 320, { weight: 900 }); }); }
      if (l > 9) label(ctx, "undang narasumber: itu bentuk terima kasih", 960, 680);
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pemilih lisensi", "empat pertanyaan → kode", (x, y) => { ["boleh diubah? ya", "boleh komersial? tidak", "turunan serupa? ya"].forEach((s, i) => { card(ctx, x - 190, y - 100 + i * 52, 380, 44, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, s, x - 175, y - 72 + i * 52, 20, { weight: 800 }); }); B.badge(ctx, x - 80, y + 70, "CC BY-NC-SA"); }],
        ["Penyusun atribusi", "tiga karya fiktif", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 110); ctx.scale(0.62, 0.62); B.attribution(ctx, 0, 0, 660, [["judul", "Gasing Bambu"], ["pembuat", "Kang Udin · Tim 10B"], ["sumber", "arsip…"], ["lisensi", "CC BY-SA"]], {}); ctx.restore(); }],
        ["Metadata arsipmu", "rancang kolomnya", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 100); ctx.scale(0.6, 0.6); Dq.table(ctx, 0, 0, [220, 110, 180, 170], ["Judul", "jenis", "narasumber", "lisensi"], [["Cublak-cublak", "lagu", "Nek Sumi", "CC BY-SA"], ["Gasing bambu", "video", "Kang Udin", "CC BY-SA"]], {}, { rh: 50 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu temui narasumber minggu ini", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
