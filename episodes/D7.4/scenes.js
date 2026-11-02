/* Adegan episode D7.4: Mesin Pencari. Muat setelah kiko-core.js, kiko-devices.js, pencari.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.pencari, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 800, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const PAGES = [[300, 300, "Klinik Hewan"], [720, 230, "Resep Bakso"], [1140, 300, "Merawat Kucing"], [520, 560, "Berita Kota"], [940, 620, "Toko Pakan"], [1360, 560, "Blog Sinta"]];
  const RESULTS = [{ title: "Makanan Kucing Murah — beli sekarang!", url: "tokopakan.example", ad: true }, { title: "Kucing tidak mau makan: 6 penyebab dan kapan ke dokter", url: "klinikhewan.example", date: "2026" }, { title: "Cerita kucingku yang lucu", url: "blog-sinta.example", date: "2019", bad: true }];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 400, 560, 200, { hair: "long", point: true }); text(ctx, "Sinta", 400, 830, 30, { align: "center", color: C.ink2, weight: 700 });
      Q.searchBox(ctx, 640, 300, 1000, "kucing tidak mau makan", {});
      text(ctx, "Sekitar 2.340.000 hasil (0,41 detik)", 660, 430, 28, { color: C.ink2, weight: 700 });
      Q.results(ctx, 640, 460, 1000, RESULTS.slice(0, 2), {});
      if (l > 2) bubble(ctx, 560, 240, 420, "Kok bisa secepat itu?", 30, { tailX: 600, tailDir: -120 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.0", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Cara Memakai Komputer dan HP", 960, 500, 52, { align: "center", weight: 700, color: C.ink2 });
      ["Keyboard", "Kotak search", "Enter"].forEach((s, i) => { card(ctx, 480 + i * 340, 580, 300, 120, { fill: C.bg2 }); text(ctx, s, 630 + i * 340, 652, 34, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      Q.shelf(ctx, 200, 270, 1100, 4, {});
      kid(ctx, 1500, 560, 200, {}); const n = Math.floor(Math.max(0, l - 0.5) / 0.6);
      bubble(ctx, 1330, 350, 360, "buku ke-" + Math.min(1000, n + 1) + "… bukan", 30, { tailX: 1500, tailDir: 0, fill: C.badBg, stroke: C.bad, color: C.bad });
      text(ctx, "seribu buku, tanpa daftar: buka satu per satu", 750, 800, 32, { align: "center", color: C.ink2, weight: 800 });
    },
    unplugged_catalog(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.cabinet(ctx, 220, 260, 420, 430, ["anjing", "ikan", "kucing", "sapi"], { open: l > 1.2 ? 2 : -1 });
      if (l > 1.2) Q.indexCard(ctx, 700, 300, 420, "kucing", ["rak 2", "rak 5", "rak 9"], { hl: l > 3 ? ["rak 2", "rak 5", "rak 9"] : [] });
      Q.shelf(ctx, 1180, 300, 560, 3, { hl: l > 3 ? [104, 208, 312] : [] });
      text(ctx, "lemari kartu", 430, 728, 30, { align: "center", weight: 900, color: C.ink2 });
      if (l > 3) banner(ctx, "sekali lihat kartu, langsung ketemu", 745, 800, { fill: C.goodBg, stroke: C.good, color: C.good });
    },

    crawl_intro(ctx, b, l) {
      PAGES.forEach(([x, y, t], i) => { if (i) Q.link(ctx, PAGES[i - 1][0] + 80, PAGES[i - 1][1] + 60, x + 80, y + 60, false); });
      PAGES.forEach(([x, y, t]) => Q.page(ctx, x, y, 160, 120, t, {}));
      const u = clamp((l - 1.0) / 1.5, 0, 1); Q.spider(ctx, lerp(200, 470, u), lerp(500, 270, u), 60, { label: "laba-laba perayap", above: true });
      banner(ctx, "merayapi (crawling): kunjungi halaman, baca, ikuti tautan", 750, 1100);
    },
    crawl_links(ctx, b, l) {
      const u = clamp(l * 0.9, 0, PAGES.length - 1); const i = Math.floor(u), f = u - i;
      PAGES.forEach(([x, y], k) => { if (k) Q.link(ctx, PAGES[k - 1][0] + 80, PAGES[k - 1][1] + 60, x + 80, y + 60, k <= i); });
      PAGES.forEach(([x, y, t], k) => Q.page(ctx, x, y, 160, 120, t, { stroke: k <= i ? C.good : "#C9D4DB", lw: k <= i ? 5 : 3 }));
      const a = PAGES[i], bb = PAGES[Math.min(i + 1, PAGES.length - 1)]; Q.spider(ctx, lerp(a[0], bb[0], f) + 80, lerp(a[1], bb[1], f) + 60, 50);
      text(ctx, "halaman dikunjungi: " + Math.min(PAGES.length, i + 1) + " dari miliaran…", 960, 820, 32, { align: "center", color: C.ink2, weight: 800 });
    },
    index_intro(ctx, b, l) {
      Q.page(ctx, 200, 250, 300, 220, "Merawat Kucing", { words: ["kucing", "makan", "sakit", "dokter"] });
      text(ctx, "halaman 12", 350, 500, 24, { align: "center", color: C.ink2, weight: 800 });
      const n = reveal(l, 1.0, 0.8, 3);
      Q.cabinet(ctx, 620, 240, 360, 440, ["dokter", "kucing", "makan", "sakit"], { open: n >= 1 ? 1 : -1 });
      if (n >= 1) Q.indexCard(ctx, 1060, 260, 380, "kucing", ["12", "87", "301"].slice(0, n), {});
      if (n >= 3) { H.arrowIcon(ctx, "east", 560, 360, 60, C.accentDark); banner(ctx, "mengindeks (indexing): kata → halaman tempatnya", 740, 1100); }
    },
    index_lookup(ctx, b, l) {
      Q.searchBox(ctx, 200, 170, 1100, "kucing tidak mau makan", {});
      const n = reveal(l, 1.2, 1.0, 3);
      if (n >= 1) Q.indexCard(ctx, 200, 300, 380, "kucing", ["12", "87", "301"], { hl: n >= 3 ? ["12", "87"] : [] });
      if (n >= 2) Q.indexCard(ctx, 640, 300, 380, "makan", ["5", "12", "87", "456"], { hl: n >= 3 ? ["12", "87"] : [] });
      if (n >= 3) { card(ctx, 1100, 300, 620, 200, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "ada di keduanya:", 1410, 370, 30, { align: "center", color: C.ink2, weight: 800 }); text(ctx, "halaman 12 dan 87", 1410, 440, 40, { align: "center", weight: 900, color: C.good }); }
      text(ctx, "mesin tidak membaca semua halaman, hanya membuka kartu", 960, 760, 32, { align: "center", color: C.accentDark, weight: 800 });
    },

    rank_intro(ctx, b, l) {
      Q.searchBox(ctx, 360, 170, 1200, "kucing tidak mau makan", {});
      const n = reveal(l, 0.8, 0.12, 12);
      for (let i = 0; i < n; i++) Q.page(ctx, 300 + (i % 6) * 230, 300 + Math.floor(i / 6) * 180, 170, 130, "Halaman " + (i + 1), {});
      if (n >= 12) banner(ctx, "ribuan halaman cocok. Mana yang paling atas?", 740, 1000);
    },
    rank_rules(ctx, b, l) {
      const rules = ["kata kunci ada di judul", "sering ditautkan halaman lain", "isinya baru", "mudah dibuka di HP"]; const n = reveal(l, 0.6, 0.9, 4);
      rules.forEach((r, i) => { if (i >= n) return; card(ctx, 160, 240 + i * 110, 700, 90, { fill: C.bg2 }); text(ctx, "+", 210, 300 + i * 110, 40, { align: "center", weight: 900, color: C.good }); text(ctx, r, 250, 298 + i * 110, 30, { weight: 800 }); });
      text(ctx, "PAPAN PERINGKAT", 1300, 230, 30, { align: "center", color: C.accentDark, weight: 800 });
      const items = [{ title: "Kucing tidak mau makan: 6 penyebab", url: "klinikhewan.example", date: "2026" }, { title: "Merawat kucing sakit di rumah", url: "dokterhewan.example", date: "2025" }, { title: "Cerita kucingku yang lucu", url: "blog-sinta.example", date: "2019", bad: true }];
      Q.results(ctx, 920, 260, 800, items, { scores: n >= 4 ? ["nilai 95", "nilai 88", "nilai 40"] : ["", "", ""] });
      if (n >= 4) text(ctx, "nilai tertinggi tampil paling atas", 1320, 680, 28, { align: "center", color: C.ink2, weight: 800 });
      text(ctx, "memeringkat (ranking)", 510, 740, 34, { align: "center", color: C.accentDark, weight: 900 });
    },
    rank_ads(ctx, b, l) {
      Q.searchBox(ctx, 360, 170, 1200, "kucing tidak mau makan", {});
      Q.results(ctx, 360, 280, 1200, RESULTS, { hl: -1 });
      if (l > 1.5) { ctx.strokeStyle = C.bad; ctx.lineWidth = 6; rr(ctx, 350, 270, 1220, 124, 16); ctx.stroke(); text(ctx, "dibayar,", 1590, 322, 28, { weight: 900, color: C.bad }); text(ctx, "bukan paling cocok", 1590, 358, 28, { weight: 900, color: C.bad }); }
      banner(ctx, "lihat tulisan kecil: Iklan / Sponsor", 680, 900, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },

    kw_bad(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 360, 560, 200, { hair: "long" });
      Q.searchBox(ctx, 560, 260, 1140, "kenapa ya kucing aku dari kemarin diam saja tidak mau makan", { size: 26 });
      const items = [{ title: "Kenapa ya? 10 pertanyaan anak", url: "forum.example", bad: true }, { title: "Diam saja: lagu terbaru", url: "musik.example", bad: true }, { title: "Resep makan siang", url: "resep.example", bad: true }];
      if (l > 1.5) { Q.results(ctx, 560, 380, 1140, items, {}); text(ctx, "hasilnya campur aduk ✕", 1130, 760, 34, { align: "center", weight: 900, color: C.bad }); }
    },
    kw_good(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const bad = "kenapa ya kucing aku dari kemarin diam saja tidak mau makan".split(" "), keep = ["kucing", "tidak", "mau", "makan"];
      let x = 240; bad.forEach(w => { const on = keep.includes(w); const drop = l > 1.2 && !on; ctx.font = `800 30px ${K.FONT}`; const tw = ctx.measureText(w).width + 26; card(ctx, x, 250, tw, 54, { fill: on ? C.goodBg : drop ? "#F4F6F5" : C.bg2, stroke: on ? C.good : "#D7E2DC", lw: on ? 4 : 2, r: 10 }); text(ctx, w, x + 13, 288, 30, { weight: 800, color: drop ? C.muted : C.ink }); if (drop) { ctx.strokeStyle = C.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 6, 277); ctx.lineTo(x + tw - 6, 277); ctx.stroke(); } x += tw + 10; });
      if (l > 2.4) { Q.searchBox(ctx, 360, 360, 1200, "kucing tidak mau makan lemas", { stroke: C.good }); text(ctx, "4–5 kata spesifik", 960, 480, 28, { align: "center", color: C.ink2, weight: 800 }); }
      if (l > 3.6) { Q.results(ctx, 360, 520, 1200, [RESULTS[1], { title: "Kucing lemas tidak mau makan: pertolongan pertama", url: "dokterhewan.example", date: "2025" }], { hl: 0 }); text(ctx, "langsung tepat ✓", 960, 790, 34, { align: "center", weight: 900, color: C.good }); }
    },
    kw_quotes(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 1.5, 3);
      const tips = [["tanda kutip = frasa persis", "\"kucing persia\" tidak mau makan"], ["tambah konteks", "kucing tidak mau makan Bandung 2026"], ["coba kata lain (sinonim)", "kucing tidak nafsu makan"]];
      tips.forEach(([t, ex], i) => { if (i >= n) return; const y = 230 + i * 200; text(ctx, t, 300, y + 40, 32, { weight: 900, color: C.accentDark }); Q.searchBox(ctx, 300, y + 60, 1320, ex, { size: 30 }); });
    },

    judge_intro(ctx, b, l) {
      Q.searchBox(ctx, 360, 170, 1200, "kucing tidak mau makan lemas", {});
      Q.results(ctx, 360, 280, 1200, RESULTS, {});
      const n = reveal(l, 1.0, 1.0, 3); const tags = [["siapa sumbernya?", 1320, 390], ["kapan ditulis?", 1320, 510], ["iklan?", 1320, 320]];
      tags.forEach(([t, x, y], i) => { if (i >= n) return; card(ctx, 1600, y - 30, 260, 56, { fill: "#FFF3D6", stroke: C.accent, lw: 3 }); text(ctx, t, 1730, y + 8, 24, { align: "center", weight: 900 }); });
      text(ctx, "jangan asal klik yang pertama", 960, 700, 34, { align: "center", color: C.bad, weight: 900 });
    },
    judge_source(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 1.3, 3);
      const cols = [["SUMBER", "klinikhewan.example ✓", "halaman-tanpa-nama ✕", "dokter hewan / situs resmi lebih tepercaya"], ["TANGGAL", "2026 ✓", "2014 ✕", "untuk kesehatan, pilih yang baru"], ["BANDINGKAN", "sumber A", "sumber B", "dua sumber sepakat → lebih yakin"]];
      cols.forEach(([t, a, bb, d], i) => { if (i >= n) return; const x = 200 + i * 530; card(ctx, x, 240, 480, 540, { fill: C.bg2 }); text(ctx, t, x + 240, 310, 32, { align: "center", color: C.accentDark, weight: 900 }); card(ctx, x + 40, 350, 400, 70, { fill: C.goodBg, stroke: C.good, lw: 3 }); text(ctx, a, x + 240, 396, 26, { align: "center", weight: 800 }); card(ctx, x + 40, 440, 400, 70, { fill: i === 2 ? C.goodBg : C.badBg, stroke: i === 2 ? C.good : C.bad, lw: 3 }); text(ctx, bb, x + 240, 486, 26, { align: "center", weight: 800 }); para(ctx, d, x + 240, 580, 26, 420, { align: "center", weight: 700, color: C.ink2, lh: 1.3 }); });
    },
    judge_result(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.results(ctx, 200, 230, 1000, RESULTS.map((r, i) => ({ ...r, mark: l > 1 ? (i === 1 ? "✓" : "✕") : "" })), { hl: l > 1 ? 1 : -1 });
      kid(ctx, 1480, 560, 200, { hair: "long", point: true }); text(ctx, "Sinta", 1480, 830, 30, { align: "center", color: C.ink2, weight: 700 });
      if (l > 3) bubble(ctx, 1280, 360, 420, "Ke dokter hewan, sekarang!", 30, { tailX: 1480, tailDir: 0, fill: C.goodBg, stroke: C.good, color: C.good });
      text(ctx, "pencarian yang jitu menolong", 700, 680, 34, { align: "center", color: C.good, weight: 900 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Urutkan pekerjaannya", "merayap, mengindeks, memeringkat", (x, y) => { Q.spider(ctx, x - 90, y, 36); Q.cabinet(ctx, x - 30, y - 50, 70, 100, ["a", "b"], {}); text(ctx, "#1", x + 110, y + 12, 36, { align: "center", weight: 900, color: C.accentDark }); }], ["Susun kata kunci", "spesifik, tanpa kata tak perlu", (x, y) => Q.searchBox(ctx, x - 190, y - 40, 380, "kucing … makan", { size: 24 })], ["Pilih hasil tepercaya", "sumber, tanggal, iklan", (x, y) => Q.results(ctx, x - 190, y - 50, 380, [{ title: "Hasil", url: "sumber?", date: "tahun?" }], {})]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 610, 30, { align: "center", weight: 900 }); text(ctx, t2, x, 655, 24, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu coba sungguhan untuk tugas sekolahmu", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
