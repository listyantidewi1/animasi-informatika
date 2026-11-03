/* Adegan episode F11.4: Riset Digital dan Verifikasi Konten. Gaya diagram Fase F. Semua situs, lembaga, dan tokoh fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, pencari.js, hoaks.js, lateral.js, riset.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Pc = K.pencari, Hx = K.hoaks, L = K.lateral, R = K.riset, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 280, 560, 170, 0, { mood: "think" });
      const n = reveal(l, 1.5, 2.2, 3);
      [["🔎", "riset", "pertanyaan → query → sumber primer"], ["🧭", "verifikasi", "teks, foto, video → konteks asli"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 560 + i * 560; card(ctx, x, 280, 520, 300, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 260, 380, 64, { align: "center" }); text(ctx, t, x + 260, 450, 30, { align: "center", weight: 900 }); para(ctx, s, x + 260, 500, 22, 460, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) R.photo(ctx, 1200, 620, 220, 130, { caption: "banjir kemarin?!" });
      if (n >= 3) label(ctx, "satu foto di grup kelas: kita ikuti jejaknya", 760, 700, { size: 26 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["E.4", "Mencari, Memeriksa, Membaca Lateral"], ["D8.5", "Fakta, Opini, dan Hoaks"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_detektif(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU: DETEKTIF FOTO", 215);
      const n = reveal(l, 1.5, 2.0, 5);
      R.photo(ctx, 240, 270, 640, 400, { hl: ["sign", "shadow", "cloth"].slice(0, Math.max(0, n - 1)) });
      [["papan nama", "nama jalan, nama toko, nomor"], ["bayangan dan cahaya", "panjang bayangan → jam berapa"], ["pakaian dan cuaca", "jas hujan, payung, musim"], ["tulisan di latar", "spanduk, plat, poster acara"]].forEach(([t, s], i) => { ctx.save(); if (i >= n - 1) ctx.globalAlpha = 0.2; card(ctx, 940, 270 + i * 100, 740, 84, { fill: i === n - 2 ? "#FFF3D6" : C.bg2, stroke: i === n - 2 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, "🔍 " + t, 964, 306 + i * 100, 24, { weight: 900 }); text(ctx, s, 964, 338 + i * 100, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 5) label(ctx, "tebak kapan dan di mana, lalu cocokkan dengan pemilik foto", 960, 720, { size: 24 });
    },
    unplugged_dua_tab(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "DUA KELOMPOK, SATU KLAIM", 215);
      const n = reveal(l, 1.5, 2.2, 5);
      Hx.msg(ctx, 560, 265, 800, "“Sekolah di kota kita akan diliburkan seminggu karena banjir.” — sumber: pesan berantai", { who: "klaim di kertas", size: 22 });
      [["Kelompok 1", "hanya membaca kertas", "“sepertinya benar, ada kata resmi”", C.bad], ["Kelompok 2", "boleh bertanya ke guru (sumber luar)", "“dinas tidak pernah mengumumkan itu”", C.good]].forEach(([t, s, r, col], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; const x = 260 + i * 740; card(ctx, x, 400, 660, 240, { fill: C.bg2, r: 16 }); text(ctx, t, x + 24, 445, 28, { weight: 900, color: col }); text(ctx, s, x + 24, 485, 22, { weight: 800, color: C.ink2 }); if (n >= i + 4) { card(ctx, x + 24, 520, 612, 90, { fill: "#fff", stroke: col, lw: 3, r: 12 }); para(ctx, r, x + 330, 560, 22, 580, { align: "center", weight: 900, color: col }); } ctx.restore(); });
      if (n >= 5) label(ctx, "membaca vertikal lawan membaca lateral", 960, 700, { size: 28 });
    },
    kueri_riset(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "RISET DIMULAI DARI PERTANYAAN", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      card(ctx, 240, 265, 1440, 70, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 14 }); text(ctx, "❓ Bagaimana dampak banjir terhadap sekolah di kota kita?", 960, 310, 26, { align: "center", weight: 900 });
      if (n >= 2) { ["banjir", "sekolah", "dampak", "kota kita"].forEach((k, i) => { ctx.fillStyle = "#E6EDF2"; rr(ctx, 400 + i * 290, 360, 260, 50, 25); ctx.fill(); text(ctx, k, 530 + i * 290, 393, 24, { align: "center", weight: 900, color: C.kiko }); }); }
      const parts = [["sekolah terdampak banjir", "kw"]]; if (n >= 3) parts.push([" site:go.id", "op"]); if (n >= 4) parts.push([" filetype:pdf", "op"]); if (n >= 5) parts.push([" 2023..2026", "op"]);
      if (n >= 3) L.query(ctx, 240, 450, 1440, parts);
      [["site:go.id", "hanya situs pemerintah"], ["filetype:pdf", "laporan dan data resmi"], ["2023..2026", "rentang tahun"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 3) ctx.globalAlpha = 0.2; card(ctx, 240 + i * 490, 560, 460, 90, { fill: n === i + 3 ? "#FFF3D6" : C.bg2, stroke: n === i + 3 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, t, 264 + i * 490, 598, 24, { weight: 900, color: C.accentDark }); text(ctx, s, 264 + i * 490, 630, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) label(ctx, "pertanyaan → kata kunci → operator", 960, 710, { size: 26 });
    },
    jenis_sumber(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PILAH SUMBER: PRIMER, SEKUNDER, TERSIER", 215);
      const n = reveal(l, 1.5, 2.0, 5);
      [["primer", "Laporan Dinas Pendidikan Kota Sukamaju 2025", "data asli dari yang mengukur"], ["sekunder", "berita: “Puluhan sekolah terendam”", "merangkum sumber lain"], ["tersier", "ensiklopedia daring: “Banjir”", "gambaran umum"]].forEach(([lv, t, s], i) => R.source(ctx, 240 + i * 490, 270, 460, 230, lv, t, s, { dim: i >= n, on: n === i + 1 }));
      if (n >= 4) { card(ctx, 240, 540, 1440, 120, { fill: "#1F2A33", r: 14 }); text(ctx, "CATATAN SUMBER", 264, 575, 16, { weight: 900, color: "#8FD0E6" }); text(ctx, "Dinas Pendidikan Kota Sukamaju (2025). Laporan Dampak Banjir pada Satuan Pendidikan. sukamaju.go.id/… · diakses 3 Nov 2026", 264, 620, 20, { weight: 800, color: "#fff" }); }
      if (n >= 5) label(ctx, "riset mengejar sumber primer; catat agar bisa dilacak ulang", 960, 710, { size: 24 });
    },
    siapa_di_balik(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LATERAL LANJUT: SIAPA DI BALIK SITUS INI?", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      const a = L.browser(ctx, 200, 260, 700, 420, [{ title: "KabarKilat.id", active: n < 2 }, { title: "cari: Kabar Kilat Media", active: n >= 2, hl: n >= 2 }], n < 2 ? "kabarkilat.id/tentang-kami" : "pencarian: \"Kabar Kilat Media\" pendiri pendanaan");
      if (n < 2) L.site(ctx, a, { logo: "⚡ KabarKilat.id", title: "Tentang Kami: media independen terpercaya sejak 2024", by: "ditulis oleh KabarKilat.id sendiri", paras: 4 });
      else Pc.results(ctx, a.x, a.y + 10, a.w, [{ title: "Daftar badan usaha: Kabar Kilat Media", url: "data terbuka · pemilik: PT Promo Sejahtera" }, { title: "Lembaga pers: tidak terdaftar", url: "dewan pers · dicek 2026" }].slice(0, n >= 3 ? 2 : 1));
      [["pendiri dan pemilik", "siapa yang untung?"], ["pendanaan", "iklan, donasi, sponsor?"], ["kata sumber lain", "pernah dikoreksi?"], ["rekam jejak", "pernah menyebar hoaks?"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 3) ctx.globalAlpha = 0.2; card(ctx, 960, 270 + i * 100, 720, 84, { fill: n === i + 3 ? "#FFF3D6" : C.bg2, stroke: n === i + 3 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, "🧭 " + t, 984, 306 + i * 100, 24, { weight: 900 }); text(ctx, s, 984, 338 + i * 100, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) label(ctx, "“tentang kami” bukan bukti; tab baru yang membuktikan", 1320, 710, { size: 24 });
    },
    jejak_kutipan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "JEJAK KUTIPAN: TELEPON RUSAK", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      Hx.msg(ctx, 460, 265, 1000, "“Menurut studi, 90% sekolah rusak akibat banjir.” — KabarKilat.id, tanpa link", { who: "klaim", size: 22 });
      if (n >= 2) R.chain(ctx, 200, 400, 1520, [["studi asli (primer)", "9% dari 10 sekolah sampel"], ["blog ulasan", "hampir 10% sekolah rusak"], ["KabarKilat.id", "90% sekolah rusak"], ["grup kelas", "SEMUA sekolah rusak!!"]], [3, 2, 1, 0][clamp(5 - n, 0, 3)] + 1 > 4 ? 4 : clamp(n - 1, 0, 4));
      if (n >= 6) banner(ctx, "lacak sampai studi aslinya: ada? berkata begitu? sampelnya berapa?", 620, 1300, { size: 28 });
    },
    verifikasi_teks(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "VERIFIKASI TEKS: SCREENSHOT KUTIPAN", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      card(ctx, 240, 270, 620, 300, { fill: "#fff", stroke: "#C9D4DB", lw: 3, r: 14 }); ctx.fillStyle = "#E6EDF2"; rr(ctx, 240, 270, 620, 60, 14); ctx.fill(); ctx.fillRect(240, 300, 620, 30); text(ctx, "📱 screenshot · akun “Wali Kota Sukamaju”", 264, 308, 20, { weight: 900, color: C.ink2 });
      para(ctx, "“Semua sekolah diliburkan satu bulan penuh mulai besok.”", 550, 390, 26, 560, { align: "center", weight: 900 }); text(ctx, "tanpa tanggal · tanpa link · tanda centang buram", 550, 530, 18, { align: "center", weight: 800, color: C.bad });
      [["cari kalimat persis dengan tanda kutip", "“diliburkan satu bulan penuh”", n >= 3 ? "0 hasil di situs resmi" : ""], ["periksa sumber primer", "akun resmi, transkrip, rekaman", n >= 4 ? "tidak ada unggahan itu" : ""], ["cek tanggal dan konteks", "kapan, menjawab apa?", n >= 5 ? "tidak ditemukan" : ""]].forEach(([t, s, r], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; card(ctx, 920, 270 + i * 110, 760, 96, { fill: n === i + 2 ? "#FFF3D6" : C.bg2, stroke: n === i + 2 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, (i + 1) + ". " + t, 944, 306 + i * 110, 22, { weight: 900 }); text(ctx, s, 944, 338 + i * 110, 18, { weight: 700, color: C.ink2 }); if (r) text(ctx, r, 1656, 322 + i * 110, 20, { align: "right", weight: 900, color: C.bad }); ctx.restore(); });
      if (n >= 6) { R.verdicts(ctx, 920, 610, 760, 1); label(ctx, "tidak ketemu di mana pun: curigai", 550, 650, { size: 26, color: C.bad }); }
    },
    jejak_foto(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "JEJAK SEBUAH FOTO", 215);
      const n = reveal(l, 1.5, 1.7, 7);
      R.photo(ctx, 240, 270, 520, 320, { caption: "“banjir kemarin di kota kita”", hl: n >= 6 ? ["sign", "shadow"] : [] });
      if (n >= 2) { arrowIcon(ctx, "right", 800, 420, 40, C.accent); text(ctx, "pencarian gambar terbalik", 920, 300, 22, { weight: 900, color: C.kiko }); }
      if (n >= 2) R.timeline(ctx, 980, 420, 640, [["2023", "berita lokal: banjir Kota Sukamaju, Jl. Melati", C.good], ["2025", "di-upload ulang, keterangan dihapus", "#B57A12"], ["2026", "grup kelas: “kemarin, kota kita”", C.bad]], clamp(n - 1, 0, 3));
      if (n >= 5) R.exif(ctx, 980, 560, 400, [["tanggal", "2023-02-14", false], ["kamera", "ponsel", false], ["lokasi GPS", "", true]], { title: "METADATA · versi media sosial" });
      if (n >= 7) { card(ctx, 1400, 560, 280, 150, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); para(ctx, "petunjuk visual: papan Jl. Melati, bayangan sore, cocok dengan 2023", 1540, 605, 19, 250, { align: "center", weight: 900, color: C.good }); }
      if (n >= 7) label(ctx, "foto asli, konteks salah", 500, 650, { size: 28, color: C.bad });
    },
    verifikasi_video(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "VERIFIKASI VIDEO: FRAME, TANGGAL, POTONGAN", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      R.frames(ctx, 240, 280, 4, { hl: n >= 2 ? 1 : null });
      if (n >= 2) text(ctx, "ambil frame penting → cari gambar terbalik", 560, 430, 22, { align: "center", weight: 900, color: C.kiko });
      [["tanggal upload paling awal", "siapa pengunggah pertamanya?"], ["potongan yang mengubah makna", "cari versi utuh, catat menitnya"], ["suara diganti, wajah rekayasa", "bibir tak sinkron, kedipan janggal, tepi wajah"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 3) ctx.globalAlpha = 0.2; card(ctx, 940, 270 + i * 110, 740, 96, { fill: n === i + 3 ? "#FFF3D6" : C.bg2, stroke: n === i + 3 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, "🎬 " + t, 964, 306 + i * 110, 23, { weight: 900 }); text(ctx, s, 964, 338 + i * 110, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) { card(ctx, 240, 480, 640, 170, { fill: C.bg2, r: 14 }); text(ctx, "contoh: video pidato 12 detik", 560, 520, 22, { align: "center", weight: 900 }); para(ctx, "versi utuh 9 menit: kalimat itu diucapkan saat mengutip pendapat orang lain, lalu dibantah", 560, 560, 20, 600, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 6) label(ctx, "potongan asli pun bisa menyesatkan", 1310, 650, { size: 26 });
    },
    putusan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "AKHIRI DENGAN PUTUSAN YANG JUJUR", 215);
      const n = reveal(l, 1.5, 1.6, 8);
      ["siapa", "apa", "kapan", "di mana", "mengapa dibagikan"].forEach((q, i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; ctx.fillStyle = i === n - 1 ? C.accent : "#E6EDF2"; rr(ctx, 240 + i * 290, 270, 260, 60, 30); ctx.fill(); text(ctx, q, 370 + i * 290, 309, 24, { align: "center", weight: 900, color: i === n - 1 ? "#fff" : C.ink }); ctx.restore(); });
      if (n >= 6) R.verdicts(ctx, 240, 380, 1440, n >= 7 ? 2 : null);
      if (n >= 7) { card(ctx, 240, 510, 1440, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "foto banjir: SALAH KONTEKS — foto asli 2023, bukan kemarin", 960, 555, 28, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "balas di grup dengan link berita aslinya", 960, 600, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 8) label(ctx, "yang belum pasti tidak dibagikan: menahan jempol juga verifikasi", 960, 700, { size: 26 });
    },
    alur_riset(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ALUR RISET DIGITAL", 215);
      const n = reveal(l, 1.5, 1.9, 7);
      R.flow(ctx, 200, 280, 1520, [["pertanyaan", "jelas, bisa dijawab data"], ["query beroperator", "site:, filetype:, kutip, tahun"], ["tiga sumber", "beragam, sampai ke primer"], ["verifikasi klaim", "teks, foto, video"], ["catatan sumber", "judul, penulis, tahun, link, akses"], ["simpulan", "yakin · cukup yakin · belum pasti"]], Math.min(n, 6), { h: 220 });
      if (n >= 7) banner(ctx, "tunjukkan jejaknya, bukan hanya jawabannya", 600, 1000);
    },
    etika(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ETIKA RISET DAN BERBAGI", 215);
      const n = reveal(l, 1.5, 2.0, 5);
      [["📝", "kutip sumber", "jangan menyalin tanpa menyebut"], ["🖼️", "hormati hak cipta", "foto orang lain: izin atau lisensi"], ["🚩", "laporkan yang palsu", "tombol lapor, bukan balas komentar"], ["✋", "jangan ikut menyebar", "yang belum pasti: tahan"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 220 + i * 380; card(ctx, x, 280, 350, 280, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 175, 370, 60, { align: "center" }); text(ctx, t, x + 175, 440, 26, { align: "center", weight: 900 }); para(ctx, s, x + 175, 485, 20, 310, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 5) banner(ctx, "jeda sepuluh detik sebelum membagikan", 620, 900);
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Penyusun query", "pilih operator untuk tiap kebutuhan", (x, y) => { L.query(ctx, x - 230, y - 110, 460, [["banjir sekolah", "kw"], [" site:go.id", "op"]]); card(ctx, x - 230, y - 20, 460, 60, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, "filetype:pdf · “…” · -kata · 2023..2026", x, y + 18, 20, { align: "center", weight: 900, color: C.accentDark }); }],
        ["Jejak foto", "pilih langkah, baca temuannya", (x, y) => { R.photo(ctx, x - 230, y - 120, 220, 140, { caption: "kemarin?" }); R.timeline(ctx, x + 20, y - 50, 180, [["2023", "", C.good], ["2026", "", C.bad]], 2); }],
        ["Putusan klaim", "benar, salah, salah konteks, belum pasti", (x, y) => R.verdicts(ctx, x - 230, y - 90, 460, 2, { size: 13 })]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 400, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu riset sungguhan tentang daerahmu", 960, 820, 26, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
