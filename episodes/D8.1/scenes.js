/* Adegan episode D8.1: Lembar Kerja Pengolah Data. Muat setelah kiko-core.js, kiko-devices.js, lembar.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.lembar, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const HEAD = ["Hari", "Bakso", "Mie ayam", "Es teh"];
  const ROWS = [["Senin", 15, 10, 20], ["Selasa", 12, 8, 18], ["Rabu", 18, 11, 25]];
  const sum = a => a.reduce((s, v) => s + v, 0);
  function sheetData(b3) { const rows = ROWS.map(r => r.slice()); rows[1][1] = b3; const tot = ["Jumlah", sum(rows.map(r => r[1])), sum(rows.map(r => r[2])), sum(rows.map(r => r[3]))]; return [HEAD, ...rows, tot]; }
  const WEEK = [["Sen", 15], ["Sel", 12], ["Rab", 18], ["Kam", 14], ["Jum", 20], ["Sab", 9], ["Min", 11]];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const sh = Q.sheet(ctx, 620, 240, sheetData(l > 3 ? 20 : 12), { cw: 200, rh: 60, changed: l > 3 ? ["B3", "B5"] : [], active: "B5" });
      Q.formulaBar(ctx, 620, 170, 1000, "B5", "=B2+B3+B4", {});
      if (l > 3) bubble(ctx, 900, 700, 440, "ubah satu angka, jumlahnya ikut berubah!", 24, { tailX: 960, tailDir: -140, fill: C.goodBg, stroke: C.good, color: C.good });
      if (l > 6) label(ctx, "lembar kerja (spreadsheet): tabel yang bisa menghitung sendiri", 1120, 775, { size: 26, color: C.ink2 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.6", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Data Terstruktur di Sekitar Kita", 960, 500, 48, { align: "center", weight: 700, color: C.ink2 });
      ["Tabel", "Baris dan kolom", "Urutkan, saring"].forEach((s, i) => { card(ctx, 480 + i * 340, 580, 300, 120, { fill: C.bg2 }); text(ctx, s, 630 + i * 340, 652, 30, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_paper(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const n = reveal(l, 1.0, 1.2, 2);
      const rows = ROWS.map(r => r.slice()); if (n >= 1) rows.forEach(r => r.push(sum(r.slice(1)))); const head = n >= 1 ? [...HEAD, "Jumlah"] : HEAD;
      if (n >= 2) rows.push(["Jumlah", 45, 29, 63, 137]);
      Q.paper(ctx, 400, 300, head, rows, { cw: 170, rh: 56 });
      text(ctx, "✏️", 1340, 420, 60);
      if (n >= 2) label(ctx, "semua dihitung dengan pensil", 1480, 620, { size: 26, color: C.ink2 });
    },
    unplugged_change(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const changed = l > 1.5; const rows = ROWS.map(r => r.slice()); rows.forEach(r => r.push(sum(r.slice(1)))); rows.push(["Jumlah", sum(rows.slice(0, 3).map(r => r[1])), 29, 63, sum(rows.slice(0, 3).map(r => r[4]))]); rows[1][1] = changed ? 20 : 12;  // jumlah tetap nilai lama (dihitung dengan 12): itulah yang harus dicoret dan dihitung ulang
      const erase = l > 3 ? [[1, 4], [3, 1], [3, 4]] : [];
      Q.paper(ctx, 400, 240, [...HEAD, "Jumlah"], rows, { cw: 170, rh: 56, erase });
      if (changed) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.strokeRect(400 + 170, 240 + 56 * 2, 170, 56); bubble(ctx, 1300, 378, 340, "B Selasa: 12 → 20", 26, { tailX: 1310, tailDir: -50, fill: "#FFF3D6", stroke: C.accent }); }
      if (l > 3) { text(ctx, "3 sel harus dihapus dan dihitung ulang", 1535, 540, 26, { align: "center", weight: 900, color: C.bad }); text(ctx, "hanya karena satu angka", 1535, 580, 24, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 7) banner(ctx, "ingat rasa capek ini", 745, 700, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },

    sheet_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const data = [HEAD, ...ROWS, ["Jumlah", "", "", ""]];
      const sh = Q.sheet(ctx, 300, 260, data, { cw: 220, rh: 70 });
      const n = reveal(l, 0.8, 1.6, 3);
      if (n >= 1) { ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.strokeRect(300 + 56, 260, 220 * 4, 70); label(ctx, "kolom: huruf A, B, C, D", 1500, 300, { color: C.kiko, size: 26 }); }
      if (n >= 2) { ctx.strokeStyle = C.good; ctx.lineWidth = 6; ctx.strokeRect(300, 260 + 70, 56, 70 * 5); label(ctx, "baris: nomor 1, 2, 3", 1500, 380, { color: C.good, size: 26 }); }
      if (n >= 3) { const c = sh.cell("B3"); ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.strokeRect(c.x, c.y, c.w, c.h); label(ctx, "satu kotak = sel", 1500, 470, { size: 26 }); label(ctx, "alamat: huruf kolom + nomor baris", 1500, 520, { size: 24, color: C.ink2 }); }
    },
    sheet_address(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const data = [HEAD, ...ROWS, ["Jumlah", "", "", ""]];
      const sh = Q.sheet(ctx, 300, 260, data, { cw: 220, rh: 70, active: "B3", hl: l > 1 ? { B1: "rgba(242,177,52,0.25)", B2: "rgba(242,177,52,0.25)", B4: "rgba(242,177,52,0.25)", B5: "rgba(242,177,52,0.25)", A3: "rgba(46,158,91,0.2)", C3: "rgba(46,158,91,0.2)", D3: "rgba(46,158,91,0.2)" } : {} });
      Q.formulaBar(ctx, 300, 190, 936, "B3", "12", { color: C.ink });
      if (l > 1) { label(ctx, "kolom B", 300 + 56 + 220 * 1.5, 260 + 70 * 6 + 36, { size: 24 }); label(ctx, "baris 3", 240, 260 + 70 * 3.5 + 8, { size: 24, color: C.good }); }
      if (l > 2.5) { card(ctx, 1320, 300, 400, 200, { fill: C.bg2 }); text(ctx, "B3", 1520, 390, 72, { align: "center", weight: 900 }); text(ctx, "= bakso, Selasa = 12", 1520, 450, 24, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 6) banner(ctx, "sebut alamatnya dulu, baru menulis rumus", 745, 900);
    },

    formula_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const typed = "=B2+B3+B4"; const k = clamp(Math.floor((l - 0.8) / 0.45), 0, typed.length); const entered = l > 6.5;
      const data = [HEAD, ...ROWS, ["Jumlah", entered ? 45 : "", "", ""]];
      const sh = Q.sheet(ctx, 300, 260, data, { cw: 220, rh: 70, active: "B5", hl: k >= 3 ? { B2: "rgba(46,126,154,0.18)" } : {}, changed: entered ? ["B5"] : [] });
      Q.formulaBar(ctx, 300, 190, 936, "B5", entered ? "=B2+B3+B4" : typed.slice(0, k), { cursor: !entered });
      ["B2", "B3", "B4"].forEach((a, i) => { if (k >= 3 + i * 3) { const c = sh.cell(a); ctx.strokeStyle = [C.kiko, C.good, C.accent][i]; ctx.lineWidth = 4; ctx.strokeRect(c.x + 3, c.y + 3, c.w - 6, c.h - 6); } });
      if (!entered && k > 0) text(ctx, "ketik di sel B5, bukan angkanya", 1500, 320, 24, { align: "center", weight: 800, color: C.ink2 });
      if (k >= typed.length && !entered) { card(ctx, 1340, 380, 320, 70, { fill: C.bg2, r: 12 }); text(ctx, "tekan Enter ↵", 1500, 425, 28, { align: "center", weight: 900 }); }
      if (entered) { label(ctx, "45 muncul sendiri", 1500, 420, { size: 30, color: C.good }); text(ctx, "yang tersimpan: rumusnya", 1500, 465, 24, { align: "center", weight: 700, color: C.ink2 }); }
      banner(ctx, "rumus selalu dimulai dengan =", 745, 800);
    },
    formula_live(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const changed = l > 2.5; const data = sheetData(changed ? 20 : 12);
      const sh = Q.sheet(ctx, 300, 260, data, { cw: 220, rh: 70, active: "B3", changed: changed ? ["B3", "B5"] : [] });
      Q.formulaBar(ctx, 300, 190, 936, "B3", changed ? "20" : "12", { color: C.ink });
      if (changed) { Q.depArrow(ctx, sh.cell("B3"), sh.cell("B5"), C.good); bubble(ctx, 1290, 640, 400, "B5 ikut berubah: 45 → 53", 26, { tailX: 1300, tailDir: -60, fill: C.goodBg, stroke: C.good, color: C.good }); }
      if (l > 5) { text(ctx, "tidak ada yang dihapus,", 1500, 480, 26, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "tidak ada yang dihitung ulang", 1500, 520, 26, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > 7) banner(ctx, "RUMUS YANG HIDUP", 745, 700, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    formula_chain(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const changed = l > 3; const base = sheetData(changed ? 20 : 12); const data = base.map(r => [...r, r[0] === "Hari" ? "Jumlah" : r[0] === "Jumlah" ? sum(r.slice(1)) : sum(r.slice(1))]);
      const sh = Q.sheet(ctx, 240, 260, data, { cw: 190, rh: 66, changed: changed ? ["B3", "B5", "E3", "E5"] : [], active: changed ? "E5" : "B3" });
      Q.formulaBar(ctx, 240, 190, 1000, changed ? "E5" : "B3", changed ? "=B5+C5+D5" : "12", { color: changed ? C.kiko : C.ink });
      if (changed) { Q.depArrow(ctx, sh.cell("B3"), sh.cell("B5"), C.good); Q.depArrow(ctx, sh.cell("B5"), sh.cell("E5"), C.good); Q.depArrow(ctx, sh.cell("B3"), sh.cell("E3"), C.good); }
      if (l > 5) { [0, 1, 2].forEach(i => { ctx.save(); ctx.translate(1440 + i * 70, 450); ctx.rotate(-0.15 - i * 0.25); ctx.fillStyle = i < 2 ? C.ink2 : C.accent; rr(ctx, -14, -45, 28, 90, 6); ctx.fill(); ctx.restore(); }); label(ctx, "seperti domino", 1520, 540, { size: 28 }); text(ctx, "satu angka → jumlah → total", 1520, 565, 24, { align: "center", weight: 700, color: C.ink2 }); }
    },

    func_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const long = l < 2.5;
      const data = [["Hari", "Bakso"], ...WEEK.map(([d, v]) => [d, v]), ["…", "…"], ["Jumlah", l > 5 ? 420 : ""]];
      const sh = Q.sheet(ctx, 160, 250, data, { cw: 160, rh: 42, size: 20, active: "B32", changed: l > 5 ? ["B32"] : [], rowLabels: [...data.slice(0, -2).map((_, i) => i + 1), "…", 32] });
      Q.formulaBar(ctx, 620, 250, 1060, "B32", long ? "=B2+B3+B4+B5+B6+B7+B8+B9+…" : "=SUM(B2:B31)", { color: long ? C.bad : C.kiko });
      if (long) text(ctx, "✕ panjang dan mudah salah ketik", 1150, 350, 26, { align: "center", weight: 900, color: C.bad });
      else { text(ctx, "✓ satu fungsi untuk banyak sel", 1150, 350, 26, { align: "center", weight: 900, color: C.good }); card(ctx, 700, 400, 900, 220, { fill: C.bg2 }); text(ctx, "=SUM(B2:B31)", 1150, 470, 44, { align: "center", weight: 900, color: C.kiko }); text(ctx, "SUM = jumlah   ·   B2:B31 = rentang dari B2 sampai B31", 1150, 530, 24, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "titik dua dibaca: sampai", 1150, 575, 22, { align: "center", weight: 700, color: C.ink2 }); }
      if (l > 7) banner(ctx, "nama fungsi, lalu rentang sel di dalam kurung", 745, 1000, { size: 30 });
    },
    func_family(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const fam = [["SUM", "jumlah", "=SUM(B2:B8)", 99], ["AVERAGE", "rata-rata", "=AVERAGE(B2:B8)", 14.1], ["MAX", "terbesar", "=MAX(B2:B8)", 20], ["MIN", "terkecil", "=MIN(B2:B8)", 9]];
      const n = reveal(l, 0.6, 1.4, 4);
      Q.sheet(ctx, 200, 250, [["Hari", "Bakso"], ...WEEK.map(([d, v]) => [d, v])], { cw: 160, rh: 52, size: 20 });
      fam.forEach(([f, id, ex, val], i) => { if (i < n) { card(ctx, 640, 230 + i * 130, 1060, 110, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, f, 680, 282 + i * 130, 36, { weight: 900, color: C.kiko }); text(ctx, id, 680, 318 + i * 130, 22, { weight: 700, color: C.ink2 }); text(ctx, ex, 1000, 290 + i * 130, 30, { weight: 800 }); text(ctx, "→ " + val.toLocaleString("id-ID"), 1480, 290 + i * 130, 30, { weight: 900, color: C.good }); } });
      if (n >= 4) label(ctx, "ditulis sama: nama fungsi (rentang)", 1170, 790, { size: 26, color: C.ink2 });
    },
    fill_down(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const filled = l > 3; const W2 = WEEK.map(([d, v], i) => [d, v, [10, 8, 11, 9, 13, 7, 12][i], [20, 18, 25, 17, 22, 14, 19][i]]);
      const data = [["Hari", "Bakso", "Mie ayam", "Es teh"], ...W2, ["Jumlah", 99, filled ? 70 : "", filled ? 135 : ""]];
      const sh = Q.sheet(ctx, 200, 230, data, { cw: 190, rh: 48, size: 20, active: "B9", changed: filled ? ["C9", "D9"] : [] });
      Q.formulaBar(ctx, 200, 165, 900, "B9", "=SUM(B2:B8)", {});
      const c = sh.cell("B9"); const u = ease(clamp((l - 1.0) / 2.0, 0, 1));
      if (l > 1) { D.pointer(ctx, c.x + c.w - 4 + u * 380, c.y + c.h - 4, 40); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.setLineDash([8, 6]); ctx.strokeRect(c.x + 2, c.y + 2, c.w - 4 + u * 380, c.h - 4); ctx.setLineDash([]); }
      if (l > 1) label(ctx, "tarik kotak kecil di sudut sel ke samping", 1420, 330, { size: 26 });
      if (filled) { [["B9", "=SUM(B2:B8)"], ["C9", "=SUM(C2:C8)"], ["D9", "=SUM(D2:D8)"]].forEach(([a, f], i) => { text(ctx, a + "  " + f, 1200, 420 + i * 50, 26, { weight: 800, color: i ? C.good : C.ink }); }); label(ctx, "alamatnya menyesuaikan sendiri: B → C → D", 1420, 620, { size: 26, color: C.good }); }
    },
    chart_bar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      Q.sheet(ctx, 200, 260, [["Menu", "Jumlah"], ["Bakso", 99], ["Mie ayam", 70], ["Es teh", 120], ["Gorengan", 85]], { cw: 180, rh: 60, size: 22 });
      const grow = ease(clamp((l - 1) / 1.5, 0, 1));
      Q.barChart(ctx, 760, 230, 900, 520, [["Bakso", 99], ["Mie ayam", 70], ["Es teh", 120], ["Gorengan", 85]], { grow, hl: l > 4 ? 2 : -1, values: l > 3, title: "Penjualan seminggu" });
      if (l > 4) label(ctx, "yang tertinggi langsung terlihat", 1210, 800, { size: 26, color: C.good });
    },
    chart_line(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 0.5, 7);
      Q.lineChart(ctx, 200, 230, 900, 520, WEEK.map(([d, v]) => [d, v]), { n, title: "Es teh per hari" });
      card(ctx, 1180, 260, 520, 200, { fill: C.bg2 }); text(ctx, "GARIS", 1440, 320, 32, { align: "center", weight: 900, color: C.kiko }); text(ctx, "perubahan dari waktu ke waktu", 1440, 365, 24, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "naik · turun · datar", 1440, 410, 24, { align: "center", weight: 800 });
      if (l > 5) { card(ctx, 1180, 500, 520, 200, { fill: C.bg2 }); text(ctx, "BATANG", 1440, 560, 32, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "membandingkan beberapa hal", 1440, 605, 24, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "mana yang paling besar", 1440, 650, 24, { align: "center", weight: 800 }); }
      if (l > 7) banner(ctx, "batang untuk membandingkan, garis untuk perubahan", 790, 1000, { size: 30 });
    },

    sort_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const items = [["Bakso", 99], ["Mie ayam", 70], ["Es teh", 120], ["Gorengan", 85], ["Soto", 40]];
      const sorted = l > 2.5 ? [...items].sort((a, c) => c[1] - a[1]) : items;
      const sh = Q.sheet(ctx, 300, 260, [["Menu", "Jumlah"], ...sorted], { cw: 220, rh: 62, size: 22, hl: l > 2.5 ? { A2: C.goodBg, B2: C.goodBg } : {} });
      if (l > 1) { card(ctx, 860, 300, 300, 70, { fill: l > 2.5 ? C.accent : C.bg2, r: 12 }); text(ctx, "Urutkan ↓ Z→A", 1010, 345, 26, { align: "center", weight: 900 }); }
      if (l > 2.5) { label(ctx, "terbesar di atas", 1010, 430, { size: 26 }); bubble(ctx, 1240, 330, 440, "menu terlaris: Es teh, 120", 26, { tailX: 1250, tailDir: -160, fill: C.goodBg, stroke: C.good, color: C.good }); }
      if (l > 6) banner(ctx, "pertanyaan Bu Warung terjawab dalam sekejap", 745, 900, { size: 30 });
    },
    sort_use(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 360, 540, 170, { hair: "long", hairColor: "#4A2E1A" }); text(ctx, "Bu Warung", 360, 790, 26, { align: "center", weight: 800, color: C.ink2 });
      const n = reveal(l, 0.8, 1.6, 3);
      [["Es teh 120, bakso 99", "→ masak bakso lebih banyak, es teh siap stok"], ["Soto 40", "→ kurangi, atau ganti menu"], ["Data yang sama", "→ keputusan yang lebih tepat"]].forEach(([a, c], i) => { if (i < n) { card(ctx, 640, 260 + i * 160, 1060, 130, { fill: i === 2 ? C.goodBg : C.bg2, stroke: i === 2 ? C.good : undefined, lw: 4, r: 16 }); text(ctx, a, 680, 312 + i * 160, 28, { weight: 900 }); text(ctx, c, 680, 356 + i * 160, 24, { weight: 700, color: C.ink2 }); } });
      if (n >= 3) banner(ctx, "data menjadi keputusan", 760, 700, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Rumus yang hidup", "ubah angka, tebak sel yang ikut", (x, y) => Q.sheet(ctx, x - 180, y - 80, [["", "B"], ["Sen", 15], ["Sel", 20], ["Jml", 35]], { cw: 120, rh: 40, size: 18, changed: ["B3", "B4"] })],
        ["Tulis rumusnya", "=SUM(…), =AVERAGE(…)", (x, y) => { Q.formulaBar(ctx, x - 200, y - 60, 400, "B5", "=SUM(B2:B4)", {}); Q.formulaBar(ctx, x - 200, y + 10, 400, "C5", "=AVERAGE(…)", {}); }],
        ["Pilih grafik", "batang atau garis?", (x, y) => { Q.barChart(ctx, x - 200, y - 90, 190, 170, [["", 3], ["", 5], ["", 4]], {}); Q.lineChart(ctx, x + 10, y - 90, 190, 170, [["", 2], ["", 4], ["", 3], ["", 5]], {}); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 610, 28, { align: "center", weight: 900 }); text(ctx, t2, x, 650, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu coba di aplikasi lembar kerja apa pun", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
