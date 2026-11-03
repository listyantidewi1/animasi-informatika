/* Adegan episode E.8: Data Berkualitas dari Komputasi Manusia. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, cek.js, data.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Ck = K.cek, Dq = K.dataq, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const KINDS = ["apel", "tomat", "wortel", "jagung", "pisang", "bayam"];
  const RAW = [["Rani", "10A", "Bdg", "12/04/2011"], ["Dito", "X-A", "Bandung", "2011-04-15"], ["Bayu", "sepuluh a", "bdg", "17/04/2011"]];
  const CLEAN = [["Rani", "X-A", "Bandung", "2011-04-12"], ["Dito", "X-A", "Bandung", "2011-04-15"], ["Bayu", "X-A", "Bandung", "2011-04-17"]];
  const DIRTY = [["10231", "Rani", "15", "2011-04-12"], ["10232", "Dito", "150", "2011-04-15"], ["10233", "Bayu", "15", "2011-02-31"], ["10234", "Sinta", "15", "2011-03-02"], ["10235", "", "15", "2011-05-20"], ["10234", "Agus", "15", "2010-12-01"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.6, 3);
      [["📝", "mengisi formulir"], ["🏷️", "melabeli gambar"], ["🔍", "memeriksa catatan"]].forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 540 + i * 400; card(ctx, x, 270, 360, 200, { fill: C.bg2, r: 18 }); text(ctx, ic, x + 180, 350, 56, { align: "center" }); text(ctx, t, x + 180, 420, 26, { align: "center", weight: 900 }); ctx.restore(); });
      if (n >= 3) { text(ctx, "komputasi manusia: pekerjaan manusia untuk komputer", 1140, 520, 24, { align: "center", weight: 900, color: C.ink2 }); }
      if (l > 8) { card(ctx, 560, 580, 1160, 100, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "sampah masuk → sampah keluar", 1140, 625, 32, { align: "center", weight: 900, color: C.bad }); text(ctx, "mutu hasil komputer = mutu data masukannya", 1140, 662, 20, { align: "center", weight: 800, color: C.ink2 }); }
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D8.6", "Proyek: Cek Data, Cek Fakta"], ["E.5", "Struktur Data Standar"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 30, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_label(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: PELABEL TANPA ATURAN");
      const n = reveal(l, 1.5, 1.2, 6);
      const labs = [[["A", "buah"], ["B", "buah"], ["C", "buah"]], [["A", "buah"], ["B", "sayur"], ["C", "sayur"]], [["A", "sayur"], ["B", "sayur"], ["C", "sayur"]], [["A", "sayur"], ["B", "buah"], ["C", "sayur"]], [["A", "buah"], ["B", "buah"], ["C", "buah"]], [["A", "sayur"], ["B", "sayur"], ["C", "sayur"]]];
      KINDS.forEach((k, i) => { if (i < n) Dq.photo(ctx, 240 + i * 250, 290, 220, k, labs[i], { agree: l > 9 ? labs[i].every(x => x[1] === labs[i][0][1]) : null }); });
      if (n >= 1) text(ctx, "contoh: label dari 3 pelabel (A, B, C); di kelas ada 5 murid", 960, 512, 22, { align: "center", weight: 800, color: C.ink2 });
      if (l > 9) Dq.agree(ctx, 560, 600, 800, 67, { label: "contoh 6 gambar: labelnya sama 4 dari 6" });
      if (l > 11) label(ctx, "tomat dan jagung jadi rebutan", 960, 700, { color: C.bad });
    },
    unplugged_panduan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BABAK DUA: SEPAKATI PANDUAN DULU");
      card(ctx, 240, 280, 560, 300, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 14 }); text(ctx, "PANDUAN LABEL", 520, 320, 22, { align: "center", weight: 900, color: C.accentDark });
      ["BUAH: ada bijinya dan dimakan segar", "  contoh: apel, pisang, tomat", "SAYUR: selain itu", "  contoh: wortel, bayam, jagung", "ragu? tanya pemeriksa"].forEach((s, i) => text(ctx, s, 270, 370 + i * 40, 20, { weight: s.startsWith("  ") ? 700 : 900, color: s.startsWith("  ") ? C.ink2 : C.ink }));
      const n = reveal(l, 4, 0.9, 6);
      const same = ["buah", "buah", "sayur", "sayur", "buah", "sayur"];
      KINDS.forEach((k, i) => { if (i < n) Dq.photo(ctx, 860 + (i % 3) * 290, 280 + Math.floor(i / 3) * 200, 260, k, [["A", same[i]], ["B", same[i]]], { agree: true }); });
      if (n >= 6) { Dq.agree(ctx, 240, 640, 560, 100, { label: "contoh 6 gambar: kesepakatan 6 dari 6" }); label(ctx, "panduan mengubah segalanya", 520, 720, { size: 24 }); }
    },

    formulir(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LANGKAH 1 · FORMULIR YANG JELAS", 215);
      const n = reveal(l, 1.5, 1.6, 4);
      Dq.form(ctx, 240, 260, 560, [["Nama lengkap", "teks", "Rani Putri", true], ["Kelas", "pilihan", "X-A ▾", true], ["Tanggal lahir", "tanggal", "2011-04-12", true], ["Menu favorit", "pilihan", "bakso ▾", false]], { n: Math.max(1, n) });
      [["satu pertanyaan, satu arti", "\"Menu favorit\" bukan \"makanan?\""], ["pilihan tetap, bukan isian bebas", "kelas dipilih dari daftar"], ["tiap kolom punya tipe", "tanggal · angka · teks · pilihan"], ["kolom penting ditandai wajib *", "tidak bisa dikirim kalau kosong"]].forEach(([t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 860, 280 + i * 110, 840, 94, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, (i + 1) + ". " + t, 890, 320 + i * 110, 24, { weight: 900 }); text(ctx, s, 890, 354 + i * 110, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    entri_rapi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SATU FORMAT UNTUK TIAP KOLOM", 215);
      const marks = {}; RAW.forEach((r, i) => { marks[i + ",1"] = "bad"; marks[i + ",2"] = "bad"; marks[i + ",3"] = "bad"; });
      text(ctx, "✕ tidak seragam", 560, 290, 24, { align: "center", weight: 900, color: C.bad }); Dq.table(ctx, 220, 310, [120, 190, 170, 200], ["Nama", "Kelas", "Kota", "Tgl lahir"], RAW, l > 3 ? marks : {}, { rh: 50 });
      if (l > 6) { arrowIcon(ctx, "east", 960, 420, 40, C.good); text(ctx, "✓ seragam", 1360, 290, 24, { align: "center", weight: 900, color: C.good }); Dq.table(ctx, 1020, 310, [120, 170, 170, 200], ["Nama", "Kelas", "Kota", "Tgl lahir"], CLEAN, {}, { rh: 50 }); }
      if (l > 9) { card(ctx, 1020, 540, 660, 120, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "bisa disaring, diurutkan, dihitung", 1350, 590, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "kiri: komputer menghitung 3 kelas dan 3 kota berbeda", 1350, 630, 18, { align: "center", weight: 800, color: C.ink2 }); }
    },
    panduan_label(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LANGKAH 2 · PANDUAN LABEL DAN DUA PELABEL", 215);
      const n = reveal(l, 1.5, 1.8, 3);
      [["definisi tiap label", "buah: berbiji, dimakan segar"], ["contoh yang jelas", "apel ✓ · wortel ✓"], ["kasus batas", "tomat? jagung? cabai? → putuskan di panduan"]].forEach(([t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 220, 270 + i * 110, 700, 94, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, t, 250, 310 + i * 110, 24, { weight: 900 }); text(ctx, s, 250, 344 + i * 110, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (l > 7) { Dq.photo(ctx, 1000, 270, 240, "tomat", [["A", "buah"], ["B", "sayur"]], { agree: false }); text(ctx, "tidak sepakat → bahas → panduan diperjelas", 1460, 340, 20, { align: "center", weight: 900, color: C.bad }); text(ctx, "pelabel ketiga memutuskan", 1460, 375, 18, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > 10) Dq.agree(ctx, 1000, 520, 700, 85, { label: "kesepakatan antarpelabel" });
      if (l > 12) label(ctx, "di bawah 80%? panduannya belum jelas", 1350, 620, { size: 22, color: C.ink2 });
    },
    label_keliru(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "AKIBAT LABEL KELIRU", 215);
      const n = reveal(l, 1.5, 2.6, 3);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; text(ctx, "kenyataan: 100 foto kucing", 480, 290, 22, { align: "center", weight: 900, color: C.ink2 }); for (let i = 0; i < 20; i++) { const bad = i >= 14; text(ctx, "🐱", 260 + (i % 10) * 46, 340 + Math.floor(i / 10) * 50, 34, { align: "center" }); if (bad && n >= 1) text(ctx, "✕", 260 + (i % 10) * 46, 340 + Math.floor(i / 10) * 50, 34, { align: "center", weight: 900, color: C.bad }); } text(ctx, "30 dilabeli \"anjing\"", 480, 430, 22, { align: "center", weight: 900, color: C.bad }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; Ck.bars(ctx, 760, 270, 460, 300, [["kucing", 70, C.kiko], ["anjing", 30, C.bad]], { title: "data berlabel", max: 100 }); ctx.restore();
      ctx.save(); if (n < 3) ctx.globalAlpha = 0.2; card(ctx, 1280, 270, 440, 300, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 }); text(ctx, "kesimpulan keliru", 1500, 320, 24, { align: "center", weight: 900, color: C.bad }); para(ctx, "\"ada 30 anjing\", padahal semuanya kucing", 1500, 380, 22, 400, { align: "center", weight: 800 }); para(ctx, "program yang belajar dari data ini salah mengenali kucing", 1500, 460, 20, 400, { align: "center", weight: 700, color: C.ink2 }); ctx.restore();
      if (n >= 3) label(ctx, "kesalahan kecil di awal, kesimpulan besar di akhir", 960, 680);
    },
    aturan_validasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "LANGKAH 3 · ATURAN VALIDASI", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      [["Rentang", "nilai harus di antara batas", "umur 10–20"], ["Wajib", "tidak boleh kosong", "nama ≠ kosong"], ["Tipe", "bentuk harus benar", "tanggal yang ada"], ["Unik", "tidak boleh ganda", "NIS unik"]].forEach(([nm, d, ex], i) => Dq.rule(ctx, 230 + (i % 2) * 740, 270 + Math.floor(i / 2) * 130, 700, nm, d, ex, { dim: i >= n, on: i === n - 1 }));
      if (n >= 4) { card(ctx, 360, 560, 1200, 110, { fill: C.bg2, r: 16 }); text(ctx, "diperiksa otomatis saat data masuk → yang melanggar ditolak atau ditandai", 960, 600, 24, { align: "center", weight: 900 }); text(ctx, "lebih murah mencegah daripada membersihkan", 960, 640, 20, { align: "center", weight: 800, color: C.ink2 }); }
    },
    bersihkan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MEMBERSIHKAN TABEL: EMPAT TEMUAN", 215);
      const n = reveal(l, 2.0, 2.2, 4);
      const marks = {}; if (n >= 1) marks["1,2"] = "bad"; if (n >= 2) marks["2,3"] = "bad"; if (n >= 3) { marks["3,0"] = "bad"; marks["5,0"] = "bad"; } if (n >= 4) marks["4,1"] = "bad";
      Dq.table(ctx, 220, 260, [140, 160, 110, 200], ["NIS", "Nama", "Umur", "Tgl lahir"], DIRTY, marks, { rh: 50 });
      [["rentang", "umur 150", "baris 2"], ["tipe", "31 Februari tidak ada", "baris 3"], ["unik", "NIS 10234 ganda", "baris 4 dan 6"], ["wajib", "nama kosong", "baris 5"]].forEach(([r, t, w], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 900, 270 + i * 100, 800, 86, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, r.toUpperCase(), 930, 322 + i * 100, 22, { weight: 900, color: C.bad }); text(ctx, t, 1080, 322 + i * 100, 24, { weight: 800 }); text(ctx, w, 1670, 322 + i * 100, 20, { align: "right", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) label(ctx, "periksa ke sumbernya, bukan ditebak", 1300, 700, { size: 26 });
    },
    peran_kelompok(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TIGA PERAN DAN LOG PERUBAHAN", 215);
      const n = reveal(l, 1.5, 1.6, 3);
      [["Pengumpul", "mengisi formulir", null], ["Pelabel", "memberi label dengan panduan", "long"], ["Pemeriksa", "validasi dan log perubahan", null]].forEach(([t, s, hair], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 330 + i * 300; kid(ctx, x, 460, 120, { hair }); ctx.fillStyle = C.kiko; rr(ctx, x - 100, 280, 200, 40, 10); ctx.fill(); text(ctx, t, x, 307, 20, { align: "center", weight: 900, color: "#fff" }); para(ctx, s, x, 600, 18, 220, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (l > 7) { card(ctx, 1080, 270, 620, 300, { fill: "#1F2A33", r: 14 }); text(ctx, "LOG PERUBAHAN", 1100, 305, 18, { weight: 900, color: "#8FD0E6" }); [["baris 2 umur 150 → 15", "Bayu", "dicek ke formulir asli"], ["baris 3 tgl 31/02 → 28/02", "Rani", "konfirmasi ke murid"], ["baris 6 NIS ganda → ditandai", "Bayu", "menunggu TU"]].forEach(([a, w, y], i) => { text(ctx, a, 1100, 350 + i * 70, 20, { weight: 900, color: "#fff" }); text(ctx, "oleh " + w + " · " + y, 1100, 378 + i * 70, 16, { weight: 700, color: "#C9D4DB" }); }); }
      if (l > 10) label(ctx, "simpan versi sebelum dan sesudah dibersihkan", 1390, 640, { size: 22 });
    },
    etika_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ETIKA DATA", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      [["🙋", "minta izin", "sebelum mengumpulkan data orang"], ["📉", "seminimal mungkin", "tidak perlu alamat untuk menu favorit"], ["🔢", "ganti nama dengan kode", "S01, S02, …"], ["⚖️", "jujur", "jangan hapus data yang tak sesuai harapan"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 230 + (i % 2) * 740, 270 + Math.floor(i / 2) * 150, 700, 130, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, ic, 290 + (i % 2) * 740, 350 + Math.floor(i / 2) * 150, 44, { align: "center" }); text(ctx, t, 350 + (i % 2) * 740, 325 + Math.floor(i / 2) * 150, 26, { weight: 900 }); text(ctx, s, 350 + (i % 2) * 740, 362 + Math.floor(i / 2) * 150, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) label(ctx, "data orang adalah titipan (ingat D9.4)", 960, 640, { size: 26 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Rancang formulir", "tipe dan aturan tiap kolom", (x, y) => { ctx.save(); ctx.translate(x - 200, y - 110); ctx.scale(0.72, 0.72); Dq.form(ctx, 0, 0, 540, [["Kelas", "pilihan", "X-A ▾", true], ["Umur", "angka 10–20", "16", true]], {}); ctx.restore(); }],
        ["Labeli dan ukur", "delapan gambar, panduan", (x, y) => { [["tomat", "buah"], ["wortel", "sayur"]].forEach(([k, lb], i) => Dq.photo(ctx, x - 200 + i * 205, y - 100, 190, k, [["kamu", lb]], { agree: true })); Dq.agree(ctx, x - 200, y + 70, 400, 88, {}); }],
        ["Bersihkan tabel", "temukan dan tangani", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 100); ctx.scale(0.6, 0.6); Dq.table(ctx, 0, 0, [130, 150, 100, 200], ["NIS", "Nama", "Umur", "Tgl"], DIRTY.slice(0, 4), { "1,2": "bad", "2,3": "bad" }, { rh: 46 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu kumpulkan satu data kecil di kelas", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
