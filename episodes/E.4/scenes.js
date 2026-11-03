/* Adegan episode E.4: Mencari, Memeriksa, Membaca Lateral. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, pencari.js, pers.js, hoaks.js, lateral.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Pc = K.pencari, Pr = K.pers, Hx = K.hoaks, Lt = K.lateral, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const SITE = "sehatnusantara-info.example";
  const OPS = [["\"…\"", "frasa persis", [["\"beasiswa", "op"], ["kuliah", "kw"], ["2027\"", "op"]]], ["-kata", "buang kata pengganggu", [["jaguar", "kw"], ["-mobil", "op"]]], ["site:", "hanya situs tertentu", [["beasiswa", "kw"], ["site:go.id", "op"]]], ["waktu", "hanya hasil terbaru", [["gempa", "kw"], ["⏱ setahun terakhir", "op"]]]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      card(ctx, 520, 260, 1200, 90, { fill: C.bg2, r: 16 }); text(ctx, "SMP: cara kerja mesin pencari · ciri hoaks · empat pertanyaan", 1120, 315, 26, { align: "center", weight: 900, color: C.ink2 });
      arrowIcon(ctx, "down", 1120, 385, 26, C.ink2);
      const n = reveal(l, 3.0, 1.4, 3);
      [["🔍", "Operator pencarian", "kutip, minus, site:, waktu, gambar"], ["↔️", "Membaca lateral", "tab baru: siapa di baliknya?"], ["🛡️", "Menyaring konten negatif", "kenali, jangan sebar, lapor, blokir"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 540 + i * 400; card(ctx, x, 420, 370, 240, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, ic, x + 185, 500, 56, { align: "center" }); text(ctx, t, x + 185, 560, 24, { align: "center", weight: 900 }); para(ctx, s, x + 185, 600, 19, 330, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) label(ctx, "SMA: seperti pemeriksa fakta profesional", 1120, 720);
    },
    prereq(ctx, b, l) {
      card(ctx, 200, 200, 1520, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.4", "Mesin Pencari: Cara Kerja dan Strategi"], ["D8.4", "Menilai Informasi dan Ekosistem Pers Digital"], ["D8.5", "Fakta, Opini, dan Hoaks"]].forEach(([c, t], i) => { const x = 260 + i * 470; card(ctx, x, 340, 440, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 220, 420, 44, { align: "center", weight: 900 }); para(ctx, t, x + 220, 480, 26, 400, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "semua situs dan klaim di sini fiktif", 960, 690, { size: 24, color: C.ink2 });
      kiko(ctx, 1660, 820, 120, 0);
    },
    unplugged_dua_pembaca(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: DUA PEMBACA, SATU KARTU");
      const cardSite = (x, y, w, h) => { card(ctx, x, y, w, h, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 10 }); ctx.fillStyle = "#1F5A6E"; rr(ctx, x, y, w, 30, 8); ctx.fill(); text(ctx, "🏛️ Institut Sehat", x + 10, y + 21, 14, { weight: 900, color: "#fff" }); for (let i = 0; i < 5; i++) { ctx.fillStyle = "#D7E2DC"; rr(ctx, x + 10, y + 44 + i * 16, (w - 20) * (0.6 + (i % 3) * 0.13), 8, 4); ctx.fill(); } };
      kid(ctx, 420, 560, 150, { hair: "long" }); cardSite(340, 300, 160, 140); text(ctx, "PEMBACA 1", 420, 720, 22, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "hanya kartu ini", 420, 750, 18, { align: "center", weight: 700, color: C.ink2 });
      kid(ctx, 920, 560, 150); cardSite(840, 300, 160, 140); text(ctx, "PEMBACA 2", 920, 720, 22, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "boleh bertanya ke tiga teman", 920, 750, 18, { align: "center", weight: 700, color: C.ink2 });
      const n = reveal(l, 4, 1.6, 3);
      [["siapa pemiliknya?", "PT Suplemen Jaya"], ["apa kata sumber lain?", "lembaga kesehatan: tidak benar"], ["kapan dibuat?", "dua minggu lalu"]].forEach(([q, a], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; kid(ctx, 1300 + i * 160, 440 + (i % 2) * 180, 90, { hair: i === 1 ? "long" : null }); card(ctx, 1220 + i * 160, 300 + (i % 2) * 180, 170, 70, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 2, r: 8 }); para(ctx, q, 1305 + i * 160, 325 + (i % 2) * 180, 14, 150, { align: "center", weight: 900 }); ctx.restore(); if (i < n) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(990, 520); ctx.lineTo(1260 + i * 160, 470 + (i % 2) * 180); ctx.stroke(); ctx.setLineDash([]); } });
    },
    unplugged_hasil(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SATU MENIT KEMUDIAN", 215);
      const n = reveal(l, 1.5, 3.5, 2);
      [["PEMBACA 1 · vertikal", "\"Logonya resmi, artikelnya panjang, ada dewan pakar. Bisa dipercaya.\"", "terkecoh tampilan", C.bad, "long"], ["PEMBACA 2 · lateral", "\"Pemiliknya penjual suplemen, lembaga kesehatan bilang sebaliknya. Tidak dipercaya.\"", "menemukan siapa di baliknya", C.good, null]].forEach(([t, q, v, col, hair], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 780; card(ctx, x, 270, 700, 400, { fill: C.bg2, r: 18 }); text(ctx, t, x + 350, 315, 24, { align: "center", weight: 900, color: col }); kid(ctx, x + 110, 480, 120, { hair }); bubble(ctx, x + 200, 500, 470, q, 20, { tailX: x + 240 }); text(ctx, v, x + 350, 640, 22, { align: "center", weight: 900, color: col }); ctx.restore(); });
      if (n >= 2) label(ctx, "vertikal: menilai dari dalam halaman · lateral: bertanya ke luar", 960, 730, { size: 26 });
    },

    operator(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MENCARI LEBIH TAJAM: EMPAT OPERATOR", 215);
      const n = reveal(l, 1.5, 2.6, 4);
      OPS.forEach(([op, s, q], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const y = 265 + i * 120; card(ctx, 220, y, 1480, 104, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, op, 250, y + 50, 30, { weight: 900, color: C.accentDark }); text(ctx, s, 250, y + 84, 19, { weight: 700, color: C.ink2 }); Lt.query(ctx, 640, y + 17, 1040, q); ctx.restore(); });
    },
    gambar_terbalik(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PENCARIAN GAMBAR TERBALIK", 215);
      const n = reveal(l, 1.5, 2.6, 3);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 240, 280, 440, 360, { fill: "#fff", stroke: C.bad, lw: 4, r: 14 }); ctx.fillStyle = "#9FD6EA"; rr(ctx, 260, 300, 400, 200, 8); ctx.fill(); ctx.fillStyle = "#4C9BE0"; rr(ctx, 260, 400, 400, 100, 0); ctx.fill(); ctx.fillStyle = "#7B8B95"; rr(ctx, 300, 330, 80, 120, 4); ctx.fill(); rr(ctx, 420, 350, 100, 100, 4); ctx.fill(); text(ctx, "\"Banjir di kota kita HARI INI!\"", 460, 540, 20, { align: "center", weight: 900, color: C.bad }); text(ctx, "pesan viral di grup", 460, 580, 16, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "📤 upload foto ke pencarian gambar", 460, 620, 16, { align: "center", weight: 800, color: C.kiko }); ctx.restore();
      if (n >= 2) arrowIcon(ctx, "east", 740, 450, 40, C.ink2);
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; Pc.results(ctx, 820, 290, 860, [{ title: "Banjir melanda Kota Y, 2021", url: "arsip-berita.example · 5 tahun lalu", date: "" }, { title: "Foto banjir Kota Y dipakai ulang untuk hoaks", url: "cekfakta.example · tahun lalu", date: "" }, { title: "Galeri: banjir 2021", url: "fotonews.example", date: "" }], { hl: n >= 3 ? 1 : -1 }); ctx.restore();
      if (n >= 3) label(ctx, "foto lama, kota lain: klaim \"hari ini\" gugur", 1250, 680, { size: 24, color: C.bad });
    },
    vertikal(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const a = Lt.browser(ctx, 200, 230, 820, 640, [{ title: "Vaksin X Terbukti Berbahaya…", active: true }], SITE + "/artikel/vaksin-x");
      Lt.site(ctx, a, { paras: 7, quote: "Dewan pakar kami menemukan…", share: true });
      const n = reveal(l, 2.5, 2.2, 4);
      text(ctx, "PEMBACA VERTIKAL MELIHAT:", 1360, 300, 24, { align: "center", weight: 900, color: C.ink2 });
      [["🏛️", "logo lembaga"], ["📄", "artikel panjang"], ["👥", "halaman \"tentang kami\": dewan pakar"], ["❝", "banyak kutipan"]].forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1080, 330 + i * 80, 600, 66, { fill: C.bg2, r: 12 }); text(ctx, ic, 1120, 374 + i * 80, 30, { align: "center" }); text(ctx, t, 1160, 372 + i * 80, 22, { weight: 800 }); ctx.restore(); });
      if (l > 12) { card(ctx, 1080, 670, 600, 90, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); para(ctx, "semua itu bisa dibuat siapa saja dalam satu sore", 1380, 710, 22, 560, { align: "center", weight: 900, color: C.bad }); }
    },
    lateral(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 1.0, 3.0, 3);
      const tabs = [{ title: "Vaksin X Terbukti…", active: n < 1 }, { title: "siapa pemilik " + SITE.split(".")[0], active: n === 1 || n === 2, hl: n === 1 }, { title: "vaksin X lembaga kesehatan", active: n >= 3, hl: n === 3 }].slice(0, n >= 3 ? 3 : n >= 1 ? 2 : 1);
      const a = Lt.browser(ctx, 200, 230, 1000, 640, tabs, n >= 3 ? "cari.example/?q=vaksin+X+lembaga+kesehatan" : n >= 1 ? "cari.example/?q=siapa+pemilik+" + SITE.split(".")[0] : SITE, { plus: true });
      if (n < 1) Lt.site(ctx, a, { paras: 7, quote: "Dewan pakar kami menemukan…" });
      else if (n < 3) { Lt.query(ctx, a.x + 10, a.y + 6, a.w - 20, [["siapa pemilik", "kw"], [SITE.split(".")[0], "op"]]); Pc.results(ctx, a.x + 10, a.y + 96, a.w - 20, [{ title: "Situs sehatnusantara-info dimiliki PT Suplemen Jaya", url: "cekmedia.example", date: "" }, { title: "Daftar situs kesehatan yang menjual produk sendiri", url: "pemeriksafakta.example", date: "" }, { title: "Dewan pakar yang tidak pernah ada", url: "jurnalisme.example", date: "" }], { hl: n === 2 ? 0 : -1 }); }
      else { Lt.query(ctx, a.x + 10, a.y + 6, a.w - 20, [["vaksin X", "kw"], ["site:go.id", "op"]]); Pc.results(ctx, a.x + 10, a.y + 96, a.w - 20, [{ title: "Lembaga kesehatan: vaksin X aman, telah diuji", url: "kesehatan.go.id (fiktif)", date: "" }, { title: "Tanya jawab resmi tentang vaksin X", url: "kesehatan.go.id (fiktif)", date: "" }], { hl: 0 }); }
      const steps = [["tab baru", "cari: siapa pemilik situs ini"], ["hasil", "milik PT Suplemen Jaya"], ["tab lain", "lembaga resmi berkata sebaliknya"]];
      steps.forEach(([t, s], i) => { ctx.save(); if (i + 1 > n) ctx.globalAlpha = 0.2; card(ctx, 1240, 300 + i * 120, 480, 100, { fill: i + 1 === n ? "#FFF3D6" : C.bg2, stroke: i + 1 === n ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, (i + 1) + ". " + t, 1264, 340 + i * 120, 24, { weight: 900 }); text(ctx, s, 1264, 374 + i * 120, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (l > 11) { card(ctx, 1240, 680, 480, 80, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "dua menit, satu kesimpulan: tidak dipercaya", 1480, 728, 20, { align: "center", weight: 900, color: C.good }); }
    },

    tiga_langkah(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TIGA LANGKAH MEMBACA LATERAL");
      const n = reveal(l, 2.0, 3.2, 3);
      [["✋", "1. BERHENTI", "jangan langsung percaya atau membagikan"], ["🗂️", "2. TAB BARU", "siapa di balik sumber ini? apa kata sumber lain?"], ["🧵", "3. TELUSURI KLAIM", "cari sumber aslinya"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 500; card(ctx, x, 290, 460, 360, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 5, r: 18 }); text(ctx, ic, x + 230, 390, 72, { align: "center" }); text(ctx, t, x + 230, 460, 28, { align: "center", weight: 900 }); para(ctx, s, x + 230, 510, 22, 400, { align: "center", weight: 700, color: C.ink2 }); if (i < 2) arrowIcon(ctx, "east", x + 480, 470, 30, C.ink2); ctx.restore(); });
      if (n >= 3) label(ctx, "cara kerja pemeriksa fakta profesional", 960, 720);
    },
    ekosistem(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "EKOSISTEM PERIKSA FAKTA: KAMU TIDAK SENDIRIAN", 215);
      const n = reveal(l, 1.5, 1.8, 4);
      [["📰", "tim periksa fakta di media"], ["🤝", "jaringan pemeriksa fakta Indonesia"], ["🏛️", "kanal aduan hoaks pemerintah"], ["🏷️", "label periksa fakta di platform"]].forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + (i % 2) * 740, y = 270 + Math.floor(i / 2) * 130; card(ctx, x, y, 700, 110, { fill: C.bg2, r: 14 }); text(ctx, ic, x + 55, y + 72, 44, { align: "center" }); text(ctx, t, x + 110, y + 68, 26, { weight: 900 }); ctx.restore(); });
      if (l > 9) { Lt.query(ctx, 360, 560, 1200, [["\"air rebusan daun X sembuhkan diabetes\"", "kw"], ["cek fakta", "op"]], { stroke: C.accent }); Pr.badge(ctx, 1500, 670, "bad"); text(ctx, "[SALAH] Klaim air rebusan daun X menyembuhkan diabetes", 1000, 680, 22, { align: "center", weight: 900, color: C.bad }); }
    },
    telusuri_klaim(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TELUSURI KLAIM KE SUMBER ASLINYA", 215);
      card(ctx, 220, 280, 620, 190, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); text(ctx, "artikel:", 240, 312, 18, { weight: 800, color: C.ink2 }); para(ctx, "\"Menurut penelitian Universitas X, vaksin ini berbahaya.\"", 530, 350, 22, 580, { align: "center", weight: 900 });
      if (l > 2) { Lt.flag(ctx, 250, 418, "tanpa link"); Lt.flag(ctx, 430, 418, "tanpa nama peneliti"); }
      arrowIcon(ctx, "east", 900, 355, 40, C.ink2); text(ctx, "cari penelitiannya", 900, 410, 18, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 4, 2.2, 3);
      [["🐭", "ternyata tentang hal lain", "penelitian itu soal dosis pada 10 tikus"], ["🔍", "sampelnya terlalu kecil", "tidak bisa disimpulkan untuk manusia"], ["👻", "tidak pernah ada", "nama universitas dipinjam"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 980, 280 + i * 130, 720, 112, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, ic, 1030, 350 + i * 130, 40, { align: "center" }); text(ctx, t, 1080, 325 + i * 130, 24, { weight: 900 }); text(ctx, s, 1080, 360 + i * 130, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 3) label(ctx, "kutipan tanpa link adalah tanda bahaya", 960, 720, { color: C.bad });
    },
    tanda_bahaya(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "TANDA BAHAYA LAIN", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      const items = [["🔗", "alamat meniru media besar", "kompas-news.example vs kornpas-news.example"], ["📅", "tanggal tidak ada", "kapan ditulis? tidak tahu"], ["👤", "penulis tanpa nama", "\"Tim Redaksi\" tanpa orang"], ["🚨", "desakan membagikan sekarang", "BAGIKAN SEBELUM DIHAPUS!"]];
      items.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + (i % 2) * 740, y = 270 + Math.floor(i / 2) * 180; card(ctx, x, y, 700, 160, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, ic, x + 55, y + 90, 48, { align: "center" }); text(ctx, t, x + 110, y + 70, 26, { weight: 900 }); text(ctx, s, x + 110, y + 110, 19, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) label(ctx, "satu tanda saja cukup untuk membuka tab baru", 960, 700);
    },
    konten_negatif(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MENYARING KONTEN NEGATIF: EMPAT LANGKAH", 215);
      const kinds = ["ujaran kebencian", "perundungan", "pornografi", "ajakan kekerasan", "penipuan"];
      kinds.forEach((k, i) => { card(ctx, 230 + i * 300, 270, 280, 60, { fill: C.badBg, stroke: C.bad, lw: 2, r: 10 }); text(ctx, k, 370 + i * 300, 308, 20, { align: "center", weight: 900, color: C.bad }); });
      const n = reveal(l, 3, 2.2, 4);
      [["👀", "Kenali", "tandanya: merendahkan, mengancam, memancing"], ["🚫", "Jangan sebarkan", "walau untuk mengecam: itu memperluasnya"], ["🚩", "Laporkan", "tombol lapor di platform atau kanal resmi"], ["⛔", "Blokir", "akunnya tidak bisa menjangkaumu lagi"]].forEach(([ic, t, s], i) => Lt.action(ctx, 230 + (i % 2) * 740, 360 + Math.floor(i / 2) * 140, 700, ic, t, s, { dim: i >= n, on: i === n - 1 }));
      if (n >= 4) label(ctx, "mengecam dengan membagikan tetap menyebarkan", 960, 680, { size: 24, color: C.ink2 });
    },
    atur_umpan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ATUR UMPANMU: BERI ALGORITMA SINYAL YANG KAMU MAU", 215);
      const sc = D.phone(ctx, 500, 540, 300, 480);
      [["👎 Tidak tertarik", true], ["🔕 Berhenti ikuti", true], ["🔒 Saring sensitif", true]].forEach(([t, on], i) => { card(ctx, sc.x + 20, sc.y + 60 + i * 110, sc.w - 40, 80, { fill: "#F7FAF8", stroke: "#C9D4DB", lw: 2, r: 12 }); text(ctx, t, sc.x + 32, sc.y + 110 + i * 110, 17, { weight: 900 }); ctx.fillStyle = l > 2 + i * 2 ? C.good : "#9AAFA6"; rr(ctx, sc.x + sc.w - 90, sc.y + 86 + i * 110, 50, 26, 13); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(sc.x + sc.w - 90 + (l > 2 + i * 2 ? 37 : 13), sc.y + 99 + i * 110, 10, 0, Math.PI * 2); ctx.fill(); });
      const n = reveal(l, 2, 2.2, 3);
      [["umpan mengikuti yang kamu klik", "klik marah → lebih banyak yang memancing marah"], ["tandai tidak tertarik, berhenti ikuti", "sinyal: ini bukan yang kumau"], ["umpan berubah dalam beberapa hari", "lebih tenang, lebih berguna"]].forEach(([t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 760, 300 + i * 150, 940, 120, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, (i + 1) + ". " + t, 790, 348 + i * 150, 26, { weight: 900 }); text(ctx, s, 790, 386 + i * 150, 20, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Susun query", "operator yang tepat", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 90); ctx.scale(0.42, 0.42); Lt.query(ctx, 0, 0, 1000, [["beasiswa", "kw"], ["site:go.id", "op"]]); Lt.query(ctx, 0, 110, 1000, [["\"gempa", "op"], ["hari ini\"", "op"], ["-film", "op"]]); ctx.restore(); }],
        ["Simulasi membaca lateral", "tab-tab fiktif, temukan pemiliknya", (x, y) => { ctx.save(); ctx.translate(x - 210, y - 100); ctx.scale(0.46, 0.46); Lt.browser(ctx, 0, 0, 900, 380, [{ title: "artikel" }, { title: "siapa pemilik…", active: true, hl: true }, { title: "cek fakta" }], "cari.example", { plus: true }); ctx.restore(); }],
        ["Pilah konten", "tindakan yang tepat", (x, y) => [["kenali", "🚫 jangan sebar"], ["🚩 lapor", "⛔ blokir"]].forEach((row, r) => row.forEach((t, c) => { card(ctx, x - 200 + c * 205, y - 90 + r * 80, 195, 66, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 10 }); text(ctx, t, x - 102 + c * 205, y - 48 + r * 80, 20, { align: "center", weight: 900 }); }))]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu baca lateral satu klaim viral minggu ini", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
