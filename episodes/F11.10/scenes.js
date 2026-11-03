/* Adegan episode F11.10: Proyek: Aplikasi Berbasis Data Terbuka. Gaya diagram Fase F. Data dan tokoh fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, lembar.js, py.js, alur_dev.js, terbuka.js, proyek_data.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Lb = K.lembar, Py = K.py, A = K.alurdev, Tb = K.terbuka, Pd = K.proyekdata, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const stageHead = (ctx, i, title) => { heading(ctx, title, 215); A.STAGES.forEach(([n, t], k) => { const x = 300 + k * 230; ctx.fillStyle = k === i ? C.accent : "#E6EDF2"; rr(ctx, x, 245, 210, 30, 8); ctx.fill(); text(ctx, n + " " + t, x + 105, 266, 15, { align: "center", weight: 900, color: k === i ? "#fff" : C.ink2 }); }); };
  const RAW = [["2025-08-01", "0"], ["2025-08-02", "12"], ["2025-08-02", "12"], ["2025-08-03", ""], ["2025-08-04", "999"], ["2025-08-05", "3"]];
  const CODE_BACA = [{ t: "import csv" }, { t: "" }, { t: "def baca_data(nama_file):" }, { t: "    with open(nama_file) as f:" }, { t: "        baris = list(csv.reader(f))" }, { t: "    return baris[1:]   # lewati judul" }];
  const CODE_BERSIH = [{ t: "def bersihkan(baris):" }, { t: "    bersih, terlihat = [], set()" }, { t: "    for tgl, mm in baris:" }, { t: "        if mm == \"\" or mm == \"999\" or tgl in terlihat:" }, { t: "            continue" }, { t: "        terlihat.add(tgl)" }, { t: "        bersih.append((tgl, float(mm)))" }, { t: "    return bersih" }];
  const CODE_RANGKUM = [{ t: "def rangkum(bersih):" }, { t: "    hari_hujan = {}" }, { t: "    for tgl, mm in bersih:" }, { t: "        bulan = tgl[5:7]" }, { t: "        if mm > 0:" }, { t: "            hari_hujan[bulan] = hari_hujan.get(bulan, 0) + 1" }, { t: "    return hari_hujan" }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); kiko(ctx, 260, 560, 160, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 2.0, 4);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; A.cycle(ctx, 680, 430, 130, -1, { n: 6, center: "F11.1" }); text(ctx, "alur pengembangan", 680, 620, 22, { align: "center", weight: 900, color: C.kiko }); ctx.restore();
      if (n >= 2) { text(ctx, "+", 920, 445, 64, { align: "center", weight: 900, color: C.accentDark }); card(ctx, 1000, 290, 680, 300, { fill: C.bg2, r: 16 }); Tb.STEPS.forEach(([s], i) => { const x = 1030 + (i % 2) * 330, y = 320 + Math.floor(i / 2) * 88; ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 22, y + 30, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 22, y + 38, 20, { align: "center", weight: 900, color: "#fff" }); text(ctx, s, x + 54, y + 38, 24, { weight: 900 }); }); text(ctx, "siklus data terbuka (F11.5)", 1340, 620, 22, { align: "center", weight: 900, color: C.kiko }); }
      if (n >= 3) banner(ctx, "= program Cek Bulan Kemah: ±30 baris Python + README + test case", 660, 1300, { size: 28 });
    },
    prereq(ctx, b, l) {
      card(ctx, 160, 200, 1600, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.1", "Alur Pengembangan Program"], ["F11.5", "Data Terbuka untuk Keputusan"], ["F11.2", "Dari Pseudocode ke Kode"]].forEach(([c, t], i) => { const x = 220 + i * 500; card(ctx, x, 340, 460, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 230, 430, 44, { align: "center", weight: 900 }); para(ctx, t, x + 230, 500, 26, 420, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1660, 760, 140, 0);
    },
    unplugged_kartu(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU: KARTU DATA BERPINDAH TANGAN", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      Pd.rows(ctx, 220, 270, 420, RAW.map((r, i) => [r[0], r[1], n >= 3 ? (i === 2 ? "dup" : i === 3 || i === 4 ? "bad" : null) : null]), { title: "kartu data (fiktif)" });
      [["🧹", "fungsi bersihkan"], ["🧮", "fungsi rangkum"], ["🏕️", "fungsi rekomendasi"]].forEach(([ic, t], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; const x = 760 + i * 330; kid(ctx, x + 120, 560, 120, { hair: i === 1 ? "long" : "short" }); card(ctx, x, 290, 240, 80, { fill: C.bg2, r: 12 }); text(ctx, ic + " " + t, x + 120, 340, 19, { align: "center", weight: 900 }); if (i < 2) arrowIcon(ctx, "right", x + 285, 330, 30, C.accent); ctx.restore(); });
      if (n >= 6) label(ctx, "kartu berpindah tangan seperti data berpindah antarfungsi", 960, 740, { size: 24 });
    },
    unplugged_estafet(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TIAP ORANG SATU TUGAS: KESALAHAN MUDAH DILACAK", 215);
      const n = reveal(l, 1.5, 2.2, 5);
      Pd.pipe(ctx, 240, 300, 1440, 4, { active: n >= 3 ? 1 : null });
      if (n >= 2) { card(ctx, 240, 520, 680, 120, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "hasil akhir: Agustus 4 hari hujan ✕", 580, 565, 24, { align: "center", weight: 900, color: C.bad }); text(ctx, "seharusnya 2", 580, 605, 20, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 3) { card(ctx, 1000, 520, 680, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "periksa hasil tiap tangan", 1340, 565, 24, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "bersihkan() lupa membuang baris kembar", 1340, 605, 20, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 5) label(ctx, "program dipecah menjadi fungsi kecil", 960, 720, { size: 26 });
    },
    kebutuhan_proyek(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 0, "TAHAP 1 · KEBUTUHAN DARI KETUA OSIS");
      const n = reveal(l, 1.5, 1.7, 7);
      [["baca file data hujan dari portal terbuka", "wajib"], ["abaikan data rusak, catat jumlahnya", "wajib"], ["jumlah hari hujan per bulan", "wajib"], ["sebutkan bulan terbaik", "wajib"], ["grafik", "tambahan"], ["beberapa kota", "tambahan"]].forEach(([s, k], i) => A.need(ctx, 240 + (i % 2) * 730, 310 + Math.floor(i / 2) * 90, 700, s, k, { dim: i >= n - 1 }));
      if (n >= 7) label(ctx, "kebutuhan datang dari pengguna, bukan dari ide pengembang", 960, 640, { size: 24 });
    },
    lingkup(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 0, "JAGA LINGKUP TETAP KECIL");
      const n = reveal(l, 1.5, 2.2, 5);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; A.version(ctx, 240, 310, 640, "1.0", ["satu kota: Sukamaju (fiktif)", "satu file CSV", "hari hujan per bulan + bulan terbaik"], { title: "isi versi pertama" }); ctx.restore();
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; A.version(ctx, 1040, 310, 640, "1.1+", ["grafik batang", "beberapa kota", "data tahun baru"], { title: "menunggu versi berikutnya", stroke: "#B7C4CC" }); ctx.restore();
      if (n >= 4) banner(ctx, "proyek kecil yang selesai > proyek besar yang berhenti di tengah", 600, 1300, { size: 28 });
    },
    alur_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 1, "TAHAP 2 · DESAIN ALUR DATA");
      const n = reveal(l, 1.5, 1.7, 7);
      Pd.pipe(ctx, 240, 320, 1440, Math.min(4, n), { active: Math.min(3, n - 1) });
      if (n >= 6) label(ctx, "panah = data yang diserahkan dari satu fungsi ke fungsi berikutnya", 960, 560, { size: 24 });
      if (n >= 7) { card(ctx, 560, 600, 800, 70, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 12 }); text(ctx, "input awal: file hujan_sukamaju.csv dari portal data terbuka (fiktif)", 960, 643, 20, { align: "center", weight: 900 }); }
    },
    struktur_data(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 1, "PILIH STRUKTUR DATA: LIST DAN DICTIONARY");
      const n = reveal(l, 1.5, 2.0, 6);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; text(ctx, "satu baris = list", 240, 320, 24, { weight: 900, color: C.kiko }); Py.code(ctx, 240, 335, 640, [{ t: "[\"2025-08-02\", \"12\"]" }, { t: "[\"2025-08-03\", \"\"]" }], { rh: 42, size: 20, title: "LIST BARIS" }); ctx.restore();
      ctx.save(); if (n < 3) ctx.globalAlpha = 0.2; text(ctx, "ringkasan = dictionary", 1000, 320, 24, { weight: 900, color: C.kiko }); Pd.dict(ctx, 1000, 335, 600, [["Jul", 5], ["Agu", 3], ["Sep", 6]], { hl: n >= 4 ? "Agu" : null }); ctx.restore();
      if (n >= 4) text(ctx, "hari_hujan[\"Agu\"] → 3", 1300, 580, 24, { align: "center", weight: 900, color: C.good });
      if (n >= 5) Py.code(ctx, 240, 500, 640, [{ t: "FUNGSI rangkum(bersih) → dictionary" }, { t: "  UNTUK tiap (tgl, mm) dalam bersih:" }, { t: "    JIKA mm > 0 MAKA tambah 1 ke bulannya" }], { rh: 40, size: 18, title: "PSEUDOCODE" });
    },
    kode_baca(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 2, "TAHAP 3 · FUNGSI PERTAMA: baca_data()");
      const n = reveal(l, 1.5, 2.0, 6);
      Py.code(ctx, 240, 310, 780, CODE_BACA.map((c, i) => ({ ...c, hl: (n === 2 && i === 0) || (n === 3 && (i === 3 || i === 4)) || (n === 4 && i === 5) })), { rh: 44, size: 21 });
      if (n >= 5) Py.console(ctx, 1080, 310, 600, [["> print(baca_data(\"hujan_sukamaju.csv\")[:3])", "in"], ["[['2025-08-01','0'], ['2025-08-02','12'],", "out"], [" ['2025-08-02','12']]", "out"]]);
      if (n >= 6) label(ctx, "jalankan dan cetak dulu, baru lanjut ke fungsi berikutnya", 1380, 560, { size: 22 });
    },
    kode_bersih(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 2, "bersihkan() DAN rangkum()");
      const n = reveal(l, 1.5, 1.8, 7);
      Py.code(ctx, 200, 300, 820, CODE_BERSIH.map((c, i) => ({ ...c, hl: (n === 2 && i === 3) || (n === 3 && i === 6) })), { rh: 34, size: 17 });
      if (n < 4) Pd.rows(ctx, 1080, 300, 600, RAW.map((r, i) => [r[0], r[1], n >= 2 ? (i === 2 ? "dup" : i === 3 || i === 4 ? "bad" : "ok") : null]), {});
      else Py.code(ctx, 1060, 300, 640, CODE_RANGKUM.map((c, i) => ({ ...c, hl: n >= 5 && (i === 4 || i === 5) })), { rh: 34, size: 15 });
      if (n >= 6) Pd.dict(ctx, 1060, 600, 640, [["08", 2]], { title: "hari_hujan = {" });
    },
    uji_fungsi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 3, "TAHAP 4 · TEST CASE UNTUK TIAP FUNGSI");
      const n = reveal(l, 1.5, 2.0, 6);
      A.tests(ctx, 240, 310, [["bersihkan", "3 baris: kosong, 999, baik", "1 baris", n >= 3 ? "ok" : ""], ["bersihkan", "2 baris kembar", "1 baris", n >= 4 ? "ok" : ""], ["rangkum", "2 hujan + 1 kering di Agu", "Agu: 2", n >= 5 ? "ok" : ""], ["rekomendasi", "{Jul:5, Agu:3}", "Agu", n >= 5 ? "ok" : ""]], { n: Math.max(1, n - 1) });
      if (n >= 6) label(ctx, "hasil yang diharapkan ditulis sebelum menjalankan", 1400, 400, { size: 22 });
    },
    rilis_readme(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); stageHead(ctx, 4, "TAHAP 5–6 · RILIS DENGAN README, LALU PELIHARA");
      const n = reveal(l, 1.5, 1.6, 8);
      Pd.readme(ctx, 240, 300, 720, ["# Cek Bulan Kemah v1.0", "Cara pakai: python kemah.py hujan.csv", "Format file: tanggal, mm (999 = tidak terukur)", "Sumber data: Portal Data Terbuka (fiktif)", "Pembuat: Kelompok 3, XI-2"], { n: Math.max(0, n - 1) });
      if (n >= 6) A.version(ctx, 1020, 300, 660, "1.1", ["baru: data tahun 2026", "baru: grafik batang per bulan", "perbaikan: tanggal format lain"], {});
      if (n >= 8) label(ctx, "siklus berputar lagi, seperti di F11.1", 1350, 560, { size: 24 });
    },
    proyek_kelompok(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PROYEK KELOMPOKMU", 215);
      const n = reveal(l, 1.5, 1.6, 8);
      [["🌦️", "cuaca"], ["🌫️", "kualitas udara"], ["📚", "pengunjung perpustakaan"]].forEach(([ic, t], i) => { ctx.save(); if (n < i + 1) ctx.globalAlpha = 0.2; card(ctx, 240 + i * 490, 270, 460, 110, { fill: C.bg2, r: 14 }); text(ctx, ic + "  data " + t, 470 + i * 490, 335, 24, { align: "center", weight: 900 }); ctx.restore(); });
      [["Analis", "kebutuhan"], ["Desainer", "alur data"], ["Pengembang", "kode"], ["Penguji", "test case"], ["Penulis", "README"]].forEach(([r, t], i) => { ctx.save(); if (n < i + 4) ctx.globalAlpha = 0.2; const x = 260 + i * 290; kid(ctx, x + 100, 600, 110, { hair: i % 2 ? "long" : "short" }); ctx.fillStyle = C.kiko; rr(ctx, x + 20, 420, 160, 36, 10); ctx.fill(); text(ctx, r, x + 100, 445, 18, { align: "center", weight: 900, color: "#fff" }); text(ctx, t, x + 100, 715, 17, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
    },
    rubrik(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "YANG DINILAI", 215);
      const n = reveal(l, 1.5, 1.4, 8);
      [["📋", "dokumen kebutuhan"], ["🗺️", "gambar alur data"], ["🧩", "kode berfungsi kecil, terbaca"], ["🧪", "tabel test case"], ["📄", "README"], ["📝", "catatan perubahan"], ["🎤", "presentasi + demo"]].forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.18; const x = 240 + (i % 4) * 365, y = 290 + Math.floor(i / 4) * 200; card(ctx, x, y, 340, 170, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 16 }); text(ctx, ic, x + 170, y + 72, 48, { align: "center" }); para(ctx, t, x + 170, y + 120, 21, 300, { align: "center", weight: 900 }); ctx.restore(); });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Perakit program", "susun fungsi dan urutannya", (x, y) => { ctx.save(); ctx.translate(x - 220, y - 100); ctx.scale(0.3, 0.3); Pd.pipe(ctx, 0, 0, 1440, 4, {}); ctx.restore(); Py.code(ctx, x - 210, y - 20, 420, [{ t: "hasil = rekomendasi(rangkum(" }, { t: "  bersihkan(baca_data(f))))" }], { rh: 30, size: 15, title: "" }); }],
        ["Penguji fungsi", "tebak hasil test case", (x, y) => A.tests(ctx, x - 230, y - 110, [["rangkum", "2 hujan Agu", "Agu: 2", "ok"], ["bersihkan", "999", "dilewati", "ok"]], {})],
        ["Pemeriksa README", "lengkapi yang hilang", (x, y) => Pd.readme(ctx, x - 210, y - 120, 420, ["# Cek Bulan Kemah", "Cara pakai: …", "Sumber data: ?"], {})]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 400, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu ketik program Cek Bulan Kemah di komputer", 960, 820, 24, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
