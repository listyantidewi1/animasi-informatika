/* Adegan episode F11.1: Alur Pengembangan Program dan Produk Digital. Gaya diagram Fase F. Muat setelah kiko-core.js, kiko-devices.js, proyek.js, py.js, alur_dev.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Pr = K.proyek, Py = K.py, A = K.alurdev, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const stageHead = (ctx, i, title) => { heading(ctx, title, 215); A.STAGES.forEach(([n, t], k) => { const x = 300 + k * 230; ctx.fillStyle = k === i ? C.accent : "#E6EDF2"; rr(ctx, x, 245, 210, 30, 8); ctx.fill(); text(ctx, n + " " + t, x + 105, 266, 15, { align: "center", weight: 900, color: k === i ? "#fff" : C.ink2 }); }); };
  const NEEDS = [["catat pemasukan dan pengeluaran", "wajib"], ["lihat saldo kapan saja", "wajib"], ["simpan ke file, jangan hilang", "wajib"], ["grafik bulanan", "tambahan"], ["pengingat iuran", "tambahan"], ["ekspor ke lembar kerja", "tambahan"]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 260, 560, 160, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.1, 6);
      A.cycle(ctx, 1060, 470, 200, n - 1, { n, center: n >= 6 ? "berulang" : "" });
      if (n >= 6) label(ctx, "satu aplikasi kecil: pencatat kas kelas", 1060, 745, { size: 24 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.0", "Jembatan Menuju Pemrograman"], ["D9.6", "Proyek Akhir Fase D"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 30, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_wawancara(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: WAWANCARA, HANYA BERTANYA");
      kid(ctx, 420, 560, 150, { point: true }); text(ctx, "pengembang", 420, 740, 20, { align: "center", weight: 900, color: C.ink2 });
      kid(ctx, 1500, 560, 150, { hair: "long" }); text(ctx, "bendahara", 1500, 740, 20, { align: "center", weight: 900, color: C.ink2 });
      const n = reveal(l, 2.0, 2.4, 3);
      [["Apa yang kamu catat?", "tanggal, jumlah, untuk apa"], ["Siapa yang melihat?", "aku dan wali kelas"], ["Apa yang paling sering salah?", "kertasnya hilang, salah jumlah"]].forEach(([q, a], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; bubble(ctx, 560, 330 + i * 130, 380, q, 20, { tailX: 600, tailDir: -40 }); card(ctx, 1000, 280 + i * 130, 400, 70, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 2, r: 12 }); text(ctx, a, 1200, 324 + i * 130, 20, { align: "center", weight: 800 }); ctx.restore(); });
      if (n >= 3) label(ctx, "tulis apa adanya; jangan mengusulkan dulu", 960, 700, { size: 24 });
    },
    unplugged_kertas(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "APLIKASI DI KERTAS: DICOBA DENGAN JARI");
      A.wire(ctx, 520, 530, "Kas Kelas", [["Rp 350.000", "big"], ["+ Tambah", "btn"], ["03/11 iuran Rani +10.000", "row"], ["02/11 spidol −15.000", "row"]]);
      const n = reveal(l, 3, 2.5, 3);
      [["bendahara mencoba", "\"tombol tambahnya di mana?\""], ["perbaiki gambarnya", "tombol dibuat besar di bawah"], ["tiga tahap tanpa kode", "kebutuhan · desain · pengujian"]].forEach(([t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 820, 290 + i * 130, 860, 110, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, t, 850, 335 + i * 130, 26, { weight: 900 }); text(ctx, s, 850, 372 + i * 130, 20, { weight: 700, color: C.ink2 }); ctx.restore(); });
      D.finger(ctx, 560, 470, { s: 30, angle: -0.5 });
    },

    kebutuhan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 0, "TAHAP 1 · ANALISIS KEBUTUHAN: DENGARKAN, JANGAN MENEBAK");
      const n = reveal(l, 2.0, 1.4, 6);
      NEEDS.forEach(([s], i) => A.need(ctx, 240 + (i % 2) * 740, 310 + Math.floor(i / 2) * 80, 700, s, null, { dim: i >= n }));
      kid(ctx, 1700, 640, 110, { hair: "long" });
      if (n >= 6) label(ctx, "semua dari wawancara bendahara, bukan dari pengembang", 960, 600, { size: 24 });
    },
    wajib_tambahan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 0, "WAJIB DULU, TAMBAHAN MENYUSUL");
      const n = reveal(l, 1.5, 1.2, 6);
      text(ctx, "VERSI 1.0", 610, 320, 22, { align: "center", weight: 900, color: C.good }); text(ctx, "NANTI", 1350, 320, 22, { align: "center", weight: 900, color: C.accentDark });
      let w = 0, t = 0; NEEDS.forEach(([s, k], i) => { if (i >= n) return; if (k === "wajib") { A.need(ctx, 240, 340 + w * 80, 740, s, k); w++; } else { A.need(ctx, 1000, 340 + t * 80, 700, s, k); t++; } });
      if (n >= 6) { card(ctx, 360, 610, 1200, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "versi pertama kecil: cepat ke tangan pengguna, cepat dapat umpan balik", 960, 660, 24, { align: "center", weight: 900, color: C.accentDark }); }
    },
    desain_layar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 1, "TAHAP 2 · DESAIN: ALUR LAYAR DAN DATA");
      const n = reveal(l, 1.5, 2.4, 3);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; A.wire(ctx, 420, 540, "Kas Kelas", [["Rp 350.000", "big"], ["+ Tambah", "btn"], ["03/11 iuran +10.000", "row"], ["02/11 spidol −15.000", "row"]]); ctx.restore();
      if (n >= 2) arrowIcon(ctx, "east", 620, 540, 40, C.accent);
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; A.wire(ctx, 820, 540, "Tambah transaksi", [["tanggal", "field"], ["jenis: masuk / keluar", "field"], ["jumlah", "field"], ["keterangan", "field"], ["Simpan", "btn"]]); ctx.restore();
      ctx.save(); if (n < 3) ctx.globalAlpha = 0.2; card(ctx, 1080, 320, 620, 300, { fill: "#fff", stroke: "#8E6BBF", lw: 4, r: 14 }); ctx.fillStyle = "#8E6BBF"; rr(ctx, 1080, 320, 620, 44, 14); ctx.fill(); ctx.fillRect(1080, 342, 620, 22); text(ctx, "record transaksi", 1100, 350, 20, { weight: 900, color: "#fff" }); [[".tanggal", "teks tanggal"], [".jenis", "masuk | keluar"], [".jumlah", "integer > 0"], [".keterangan", "string"]].forEach(([k, v], i) => { text(ctx, k, 1110, 405 + i * 46, 22, { weight: 900, color: C.kiko }); text(ctx, v, 1670, 405 + i * 46, 20, { align: "right", weight: 800 }); }); text(ctx, "daftar transaksi = array berisi record", 1390, 650, 18, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
    },
    desain_pseudo(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 1, "DESAIN: PSEUDOCODE BAGIAN INTI");
      const n = reveal(l, 1.5, 1.4, 6);
      const lines = [{ t: "FUNGSI saldo(daftar) → integer" }, { t: "KEMBALIKAN jumlah(masuk) − jumlah(keluar)", ind: 1 }, { t: "" }, { t: "PROSEDUR tambah(tanggal, jenis, jumlah, ket)" }, { t: "JIKA jumlah bukan angka ATAU jumlah ≤ 0 MAKA tolak", ind: 1 }, { t: "simpan record ke daftar, tulis ke file", ind: 1 }];
      K.kode ? K.kode.code(ctx, 240, 300, 1000, lines.map((p, i) => ({ ...p, hl: i === n - 1 })), { rh: 50, size: 22 }) : null;
      if (n >= 6) { card(ctx, 1280, 300, 440, 200, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); para(ctx, "desain yang jelas membuat kode tinggal diterjemahkan", 1500, 370, 24, 400, { align: "center", weight: 900, color: C.accentDark }); }
    },

    implementasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 2, "TAHAP 3 · IMPLEMENTASI: SEDIKIT DEMI SEDIKIT, JALANKAN TIAP KALI");
      const n = reveal(l, 1.5, 2.6, 3);
      const steps = [["fungsi saldo", [{ t: "def saldo(daftar):" }, { t: "    masuk = 0; keluar = 0" }, { t: "    for t in daftar:" }, { t: '        if t["jenis"] == "masuk": masuk += t["jumlah"]' }, { t: '        else: keluar += t["jumlah"]' }, { t: "    return masuk - keluar" }], "saldo([]) → 0 ✓"], ["tambah transaksi", [{ t: "def tambah(daftar, tgl, jenis, jumlah, ket):" }, { t: "    daftar.append({...})" }, { t: "    return True" }], "tambah(..., 10000) → True ✓"], ["simpan ke file", [{ t: "def simpan(daftar):" }, { t: '    with open("kas.csv", "w") as f:' }, { t: "        ..." }], "kas.csv tersimpan ✓"]];
      steps.forEach(([t, code, out], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 500; text(ctx, (i + 1) + ". " + t, x + 230, 320, 22, { align: "center", weight: 900 }); Py.code(ctx, x, 335, 460, code, { rh: 30, size: 12, title: "" }); card(ctx, x, 585, 460, 50, { fill: C.goodBg, stroke: C.good, lw: 2, r: 10 }); text(ctx, "jalankan: " + out, x + 230, 617, 18, { align: "center", weight: 900, color: C.good }); ctx.restore(); });
      if (n >= 3) label(ctx, "jangan menulis seratus baris lalu baru menjalankan", 960, 680, { size: 24 });
    },
    pengujian(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 3, "TAHAP 4 · PENGUJIAN: KASUS NORMAL, BATAS, SALAH");
      const n = reveal(l, 1.5, 1.8, 4);
      A.tests(ctx, 240, 310, [["normal", "masuk 50.000", "saldo bertambah 50.000", n >= 1 ? "ok" : ""], ["batas", "jumlah 0", "ditolak dengan pesan", n >= 2 ? "ok" : ""], ["salah", "jumlah \"abc\"", "ditolak dengan pesan", n >= 3 ? "ok" : ""], ["salah", "jumlah −50.000", "ditolak dengan pesan", n >= 4 ? "bug" : ""]], { n: Math.max(1, n) });
      if (n >= 4) { A.bug(ctx, 1100, 310, 600, "BUG #1", ["jumlah negatif diterima, saldo berkurang", "penyebab: cek jumlah <= 0 belum dipasang"]); text(ctx, "catat → perbaiki → uji lagi dengan kasus yang sama", 1400, 480, 20, { align: "center", weight: 900, color: C.kiko }); }
      if (n >= 4) label(ctx, "siapkan kasus uji sebelum mencoba; program menolak dengan ramah, bukan berhenti", 960, 620, { size: 22 });
    },
    rilis(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 4, "TAHAP 5 · RILIS: VERSI 1.0 KE TANGAN PENGGUNA");
      const n = reveal(l, 1.5, 2.2, 3);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; A.version(ctx, 240, 310, 600, "1.0", ["catat pemasukan dan pengeluaran", "lihat saldo", "simpan ke file kas.csv"], { title: "fitur" }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; card(ctx, 880, 310, 400, 190, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 14 }); text(ctx, "PANDUAN SINGKAT", 1080, 350, 20, { align: "center", weight: 900, color: C.accentDark }); ["1. tekan Tambah, isi, Simpan", "2. saldo tampil di atas", "3. file: kas.csv"].forEach((s, i) => text(ctx, s, 900, 395 + i * 34, 19, { weight: 800 })); ctx.restore();
      ctx.save(); if (n < 3) ctx.globalAlpha = 0.2; kid(ctx, 1500, 560, 120, { hair: "long" }); bubble(ctx, 1320, 420, 360, "Kupakai seminggu, lalu kuberi masukan.", 20, { tailX: 1480 }); ctx.restore();
      if (n >= 3) label(ctx, "umpan balik dari pemakaian sungguhan", 960, 680, { size: 24 });
    },
    pemeliharaan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 5, "TAHAP 6 · PEMELIHARAAN: SIKLUS BERPUTAR LAGI");
      const n = reveal(l, 1.5, 2.2, 3);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 240, 310, 560, 170, { fill: C.bg2, r: 14 }); text(ctx, "UMPAN BALIK SEMINGGU", 520, 350, 20, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "🐞 tanggal sering salah ketik", 270, 400, 22, { weight: 800 }); text(ctx, "✨ ingin daftar siapa yang belum bayar", 270, 440, 22, { weight: 800 }); ctx.restore();
      if (n >= 2) arrowIcon(ctx, "east", 860, 395, 40, C.accent);
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; A.version(ctx, 940, 310, 620, "1.1", ["perbaikan: tanggal dipilih dari kalender", "baru: daftar belum bayar", "diuji ulang dengan 6 kasus"], {}); ctx.restore();
      if (n >= 3) { label(ctx, "kebutuhan baru → desain → kode → uji → rilis 1.1", 960, 560, { size: 24 }); label(ctx, "aplikasi hidup selama dipakai", 960, 640, { size: 26 }); }
    },
    siklus(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BUKAN GARIS LURUS, MELAINKAN LINGKARAN", 215);
      const k = Math.floor(l / 1.1) % 6;
      A.cycle(ctx, 620, 520, 220, k, { center: "putaran " + (Math.floor(l / 6.6) + 1) });
      const n = reveal(l, 3, 3.0, 3);
      [["📱", "tiap pembaruan aplikasi = satu putaran", "produk besar berputar ratusan kali"], ["⏱️", "putaran pendek lebih aman", "kesalahan ketahuan saat masih kecil"], ["🔁", "versi 1.0 → 1.1 → 1.2 → …", "tiap versi punya catatan perubahan"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1000, 300 + i * 130, 700, 112, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, ic, 1050, 370 + i * 130, 40, { align: "center" }); text(ctx, t, 1100, 350 + i * 130, 23, { weight: 900 }); text(ctx, s, 1100, 385 + i * 130, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    peran_tim(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DI TIM SUNGGUHAN, TAHAPNYA DIBAGI", 215);
      const n = reveal(l, 1.5, 1.4, 5);
      [["Analis", "berbicara dengan pengguna", "long"], ["Desainer", "menggambar alur layar", null], ["Pengembang", "menulis kode", "long"], ["Penguji", "merancang kasus uji", null], ["Manajer produk", "menjaga arah", "long"]].forEach(([t, s, hair], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 300 + i * 330; kid(ctx, x, 470, 120, { hair }); ctx.fillStyle = C.kiko; rr(ctx, x - 110, 290, 220, 40, 10); ctx.fill(); text(ctx, t, x, 317, 20, { align: "center", weight: 900, color: "#fff" }); para(ctx, s, x, 610, 19, 220, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 5) label(ctx, "di proyek kelas, kalian bergantian memegang semua peran", 960, 710, { size: 24 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Pilah kebutuhan", "wajib atau tambahan", (x, y) => [["catat transaksi", "wajib"], ["grafik bulanan", "tambahan"]].forEach(([s, k], i) => A.need(ctx, x - 200, y - 90 + i * 70, 400, s, k))],
        ["Kasus uji dan bug", "normal, batas, salah", (x, y) => { ctx.save(); ctx.translate(x - 215, y - 100); ctx.scale(0.52, 0.52); A.tests(ctx, 0, 0, [["normal", "masuk 50.000", "saldo +50.000", "ok"], ["salah", "−50.000", "ditolak", "bug"]], {}); ctx.restore(); }],
        ["Urutkan ke tahapnya", "kejadian sehari-hari", (x, y) => { ctx.save(); ctx.translate(x, y + 20); ctx.scale(0.45, 0.45); A.cycle(ctx, 0, 0, 220, 2, {}); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu wawancara dan aplikasi kertas berpasangan", 960, 745, 26, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
