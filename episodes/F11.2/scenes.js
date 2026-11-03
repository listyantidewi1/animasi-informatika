/* Adegan episode F11.2: Dari Pseudocode ke Kode. Gaya diagram Fase F. Muat setelah kiko-core.js, kiko-devices.js, memori.js, kode.js, py.js, terjemah.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Mm = K.memori, Kd = K.kode, Py = K.py, T = K.terjemah, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const DAFTAR = [20000, 15000, 10000];
  const FOR_PS = [{ t: "total ← 0" }, { t: "UNTUK tiap t dalam daftar:" }, { t: "total ← total + t", ind: 1 }, { t: "TULIS total" }];
  const FOR_PY = [{ t: "total = 0" }, { t: "for t in daftar:" }, { t: "    total = total + t" }, { t: "print(total)" }];
  const PROG = ["def hitung_saldo(daftar):", "    total = 0", "    for t in daftar:", "        total = total + t", "    return total", "daftar = []", 'jawaban = ""', 'while jawaban != "selesai":', '    jumlah = int(input("jumlah: "))', "    if jumlah <= 0:", '        print("ditolak")', "    else:", "        daftar.append(jumlah)", '    jawaban = input("lanjut/selesai? ")', 'print("saldo:", hitung_saldo(daftar))'];

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 280, 560, 170, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.5, 4);
      [["📦", "variabel dan tipe", "saldo = 0"], ["🔀", "percabangan", "if … elif … else"], ["🔁", "perulangan", "for · while"], ["🧩", "fungsi", "def … return"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 520 + i * 310; card(ctx, x, 280, 290, 300, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 145, 380, 60, { align: "center" }); text(ctx, t, x + 145, 450, 26, { align: "center", weight: 900 }); text(ctx, s, x + 145, 500, 22, { align: "center", weight: 800, color: C.kiko }); ctx.restore(); });
      if (n >= 4) banner(ctx, "pseudocode | Python | isi memori, berdampingan", 640, 1100);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["F11.0", "Jembatan Menuju Pemrograman"], ["F11.1", "Alur Pengembangan Program dan Produk Digital"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_kamus(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU TANPA KOMPUTER: KAMUS DUA KOLOM", 215);
      const n = reveal(l, 1.5, 1.4, 9);
      T.dict(ctx, 240, 260, 900, T.DICT, { n, hl: n - 1, rh: 48, size: 22 });
      card(ctx, 1220, 300, 460, 200, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); para(ctx, "✏️ tiap menemukan pasangan baru, tambahkan ke kamus", 1450, 370, 26, 400, { align: "center", weight: 900, color: C.accentDark });
      if (n >= 9) { card(ctx, 1220, 540, 460, 150, { fill: C.bg2, r: 14 }); para(ctx, "kamus ini kamu pakai sepanjang episode dan proyekmu", 1450, 600, 24, 400, { align: "center", weight: 800, color: C.ink2 }); }
    },
    unplugged_tebak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "SEBELUM MENJALANKAN: TEBAK DULU", 215);
      const n = reveal(l, 1.5, 2.4, 4);
      Py.code(ctx, 240, 270, 520, [{ t: "x = 5" }, { t: "x = x + 2" }, { t: "x = x * 2", hl: n >= 4 }, { t: "print(x)" }], { rh: 48, size: 24 });
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 820, 270, 380, 150, { fill: "#FFFDF5", stroke: "#E0B04B", lw: 3, r: 14 }); text(ctx, "✏️ tebakanku", 1010, 320, 22, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "12", 1010, 390, 44, { align: "center", weight: 900 }); ctx.restore();
      if (n >= 2) { arrowIcon(ctx, "right", 1230, 345, 40, C.accent); Py.console(ctx, 1280, 270, 400, [["14", "out"]]); }
      if (n >= 3) { card(ctx, 820, 470, 860, 110, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "meleset: 12 ≠ 14 → di sinilah pelajarannya", 1250, 535, 28, { align: "center", weight: 900, color: C.bad }); }
      if (n >= 4) label(ctx, "baris 3 mengalikan setelah ditambah: (5 + 2) × 2 = 14", 960, 680, { size: 26 });
    },
    variabel(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BAHAN 1 · VARIABEL: LAHIR SAAT PERTAMA DIISI", 215);
      const n = reveal(l, 1.5, 1.8, 4);
      T.side(ctx, 220, 260, [{ t: "DEKLARASI saldo: integer" }, { t: "DEKLARASI nama: string" }, { t: "saldo ← 0" }, { t: "nama ← \"Sinta\"" }], [{ t: "" }, { t: "" }, { t: "saldo = 0" }, { t: 'nama = "Sinta"' }], { pairs: [[0, 2], [1, 3], [2, 2], [3, 3]], hl: n >= 1 ? Math.min(n, 4) - 1 : null, rh: 46, size: 22 });
      if (n >= 1) text(ctx, "tanpa deklarasi", 1340, 322, 20, { weight: 800, color: "#7B8B95" });
      if (n >= 3) T.cell(ctx, 240, 560, 300, { name: "saldo", value: 0, type: "int", changed: n === 3 });
      if (n >= 4) T.cell(ctx, 580, 560, 300, { name: "nama", value: "\"Sinta\"", type: "str", changed: true });
      if (n >= 4) label(ctx, "tipe mengikuti isinya", 1340, 620, { size: 28 });
    },
    tipe_input(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "EMPAT TIPE, DAN JEBAKAN input()", 215);
      const n = reveal(l, 1.5, 1.7, 7);
      T.typeCards(ctx, 240, 260, 1440, Math.min(n, 4));
      if (n >= 5) { Py.code(ctx, 240, 430, 640, [{ t: "jumlah = input()", hl: n === 5 }, { t: "jumlah = int(input())", hl: n >= 7 }], { rh: 46, size: 24 }); }
      if (n >= 5) T.cell(ctx, 940, 440, 320, { name: "jumlah", value: "\"50000\"", type: "str", warn: true });
      if (n >= 6) { text(ctx, "string! tidak bisa dihitung", 1100, 585, 22, { align: "center", weight: 900, color: C.bad }); }
      if (n >= 7) { arrowIcon(ctx, "right", 1290, 495, 40, C.good); T.cell(ctx, 1340, 440, 320, { name: "jumlah", value: 50000, type: "int", changed: true }); label(ctx, "bungkus dengan int() supaya jadi bilangan", 960, 690, { size: 26, color: C.good }); }
    },
    percabangan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BAHAN 2 · PERCABANGAN: TITIK DUA, LALU MENJOROK", 215);
      const n = reveal(l, 1.5, 2.0, 5);
      T.side(ctx, 220, 260, [{ t: "JIKA jenis = \"masuk\" MAKA" }, { t: "saldo ← saldo + jumlah", ind: 1 }, { t: "LAINNYA" }, { t: "saldo ← saldo − jumlah", ind: 1 }], [{ t: 'if jenis == "masuk":' }, { t: "    saldo = saldo + jumlah" }, { t: "else:" }, { t: "    saldo = saldo - jumlah" }], { pairs: [[0, 0], [1, 1], [2, 2], [3, 3]], hl: n >= 1 && n <= 4 ? n - 1 : null, rh: 50, size: 22 });
      if (n >= 5) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; [1, 3].forEach(i => { const y = 260 + 50 + i * 50; ctx.beginPath(); ctx.moveTo(1040, y + 6); ctx.lineTo(1040, y + 44); ctx.stroke(); }); text(ctx, "indentasi = isi cabang", 1140, 560, 24, { weight: 900, color: C.accentDark }); }
      [["== untuk membandingkan", "= untuk menyimpan"], ["titik dua di akhir if dan else", ""], ["blok ditandai spasi di awal baris", "bukan hiasan"]].forEach(([t, s], i) => { ctx.save(); if (n < i + 2) ctx.globalAlpha = 0.2; card(ctx, 220 + i * 500, 600, 480, 90, { fill: n === i + 2 ? "#FFF3D6" : C.bg2, stroke: n === i + 2 ? C.accent : undefined, lw: 3, r: 12 }); text(ctx, t, 244 + i * 500, 640, 22, { weight: 900 }); text(ctx, s, 244 + i * 500, 670, 17, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    elif(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TIGA CABANG: PERIKSA DARI ATAS, BERHENTI DI YANG PERTAMA BENAR", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      const hl = n === 3 ? 0 : n === 4 ? 1 : n === 5 ? 2 : -1;
      Py.code(ctx, 220, 260, 760, [{ t: "if jumlah < 0:", hl: hl === 0 }, { t: '    print("ditolak")' }, { t: "elif jumlah == 0:", hl: hl === 1 }, { t: '    print("peringatan: nol")' }, { t: "else:", hl: hl === 2 }, { t: "    daftar.append(jumlah)" }], { rh: 46, size: 22 });
      if (n >= 2) T.cell(ctx, 1040, 270, 260, { name: "jumlah", value: 0, type: "int" });
      if (n >= 3) T.branchCheck(ctx, 1040, 400, 640, [["jumlah < 0", n >= 3 ? false : null], ["jumlah == 0", n >= 4 ? true : null], ["else", null]], n >= 5 ? 3 : n - 2, n >= 4 ? 1 : null);
      if (n >= 6) label(ctx, "urutan kondisi menentukan hasil", 500, 620, { size: 26 });
    },
    for_lacak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BAHAN 3 · PERULANGAN for: LACAK TIAP PUTARAN", 215);
      const k = reveal(l, 1.5, 1.3, 9); // 1: pasangan, 2: total 0, 3..8: tiga putaran (baris for, baris total), 9: print
      const round = k >= 3 && k <= 8 ? Math.floor((k - 3) / 2) : null; const onBody = k >= 3 && k <= 8 && (k - 3) % 2 === 1;
      let total = 0; for (let i = 0; i < 3; i++) { if (round != null && (i < round || (i === round && onBody))) total += DAFTAR[i]; if (k >= 9) total = 45000; }
      const hl = k <= 1 ? null : k === 2 ? 0 : k <= 8 ? (onBody ? 2 : 1) : 3;
      T.side(ctx, 220, 260, FOR_PS, FOR_PY, { pairs: [[0, 0], [1, 1], [2, 2], [3, 3]], hl, rh: 44, size: 20, wl: 560, wr: 520, gap: 30 });
      Mm.list(ctx, 1380, 300, DAFTAR, { name: "daftar", w: 100, h: 56, hl: round != null ? round + 1 : null });
      Mm.board(ctx, 1360, 400, 340, [{ name: "t", value: round != null ? DAFTAR[round] : k >= 9 ? 10000 : null, hl: round != null && !onBody }, { name: "total", value: k >= 2 ? total : null, changed: onBody }], { bw: 140, bh: 100 });
      if (k >= 9) { Py.console(ctx, 1360, 610, 340, [["45000", "out"]]); label(ctx, "tiga putaran, total 45000", 700, 560, { size: 28, color: C.good }); }
    },
    while_lacak(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "while: BERULANG SELAMA KONDISINYA BENAR", 215);
      const n = reveal(l, 1.5, 1.6, 7);
      T.side(ctx, 220, 260, [{ t: "SELAMA jawaban ≠ \"selesai\":" }, { t: "BACA transaksi", ind: 1 }, { t: "BACA jawaban", ind: 1 }], [{ t: 'while jawaban != "selesai":' }, { t: "    transaksi = int(input())" }, { t: "    jawaban = input()" }], { pairs: [[0, 0], [1, 1], [2, 2]], hl: n >= 1 && n <= 3 ? n - 1 : null, rh: 50, size: 22, wl: 600, wr: 580, gap: 30 });
      if (n >= 4) Py.console(ctx, 1440, 270, 260, [["20000", "in"], ["lanjut", "in"], ["15000", "in"], ["selesai", "in"]].slice(0, n >= 5 ? 4 : 2));
      if (n >= 5) Mm.rounds(ctx, 1440, 520, 3, 3, { label: "putaran" });
      if (n >= 6) { card(ctx, 220, 520, 1000, 130, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "⚠ jawaban tidak pernah diubah di dalam blok", 720, 570, 26, { align: "center", weight: 900, color: C.bad }); text(ctx, "kondisi selalu benar → perulangan tak pernah berhenti", 720, 615, 22, { align: "center", weight: 800 }); }
      if (n >= 7) label(ctx, "baris terakhir di dalam blok mengubah jawaban", 720, 710, { size: 24, color: C.good });
    },
    fungsi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BAHAN 4 · FUNGSI: def, PARAMETER, return", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      T.side(ctx, 220, 260, [{ t: "FUNGSI hitung_saldo(daftar) → integer" }, { t: "total ← 0", ind: 1 }, { t: "UNTUK tiap t dalam daftar:", ind: 1 }, { t: "total ← total + t", ind: 2 }, { t: "KEMBALIKAN total", ind: 1 }, { t: "" }, { t: "saldo ← hitung_saldo(daftar)" }], [{ t: "def hitung_saldo(daftar):" }, { t: "    total = 0" }, { t: "    for t in daftar:" }, { t: "        total = total + t" }, { t: "    return total" }, { t: "" }, { t: "saldo = hitung_saldo(daftar)" }], { pairs: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [6, 6]], hl: n >= 1 ? Math.min(n, 6) - 1 : null, rh: 42, size: 20 });
      [["def nama(parameter):", "kepala fungsi"], ["return nilai", "hasil dikirim ke pemanggil"], ["nama(argumen)", "memanggil fungsi"]].forEach(([t, s], i) => { ctx.save(); if (n < [1, 5, 6][i]) ctx.globalAlpha = 0.2; card(ctx, 1500, 270 + i * 110, 200, 96, { fill: C.bg2, r: 12 }); text(ctx, t, 1600, 308 + i * 110, 17, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 1600, 340 + i * 110, 15, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 6) label(ctx, "kode yang sama dipakai lagi tanpa ditulis ulang", 960, 690, { size: 26 });
    },
    fungsi_bingkai(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "SAAT DIPANGGIL: FRAME BARU, LALU DIBUANG", 215);
      const n = reveal(l, 1.5, 2.2, 5);
      Py.code(ctx, 220, 260, 600, [{ t: "def hitung_saldo(daftar):", hl: n === 1 }, { t: "    total = 0", hl: n === 2 }, { t: "    for t in daftar:" }, { t: "        total = total + t", hl: n === 2 }, { t: "    return total", hl: n === 3 }, { t: "" }, { t: "saldo = hitung_saldo(daftar)", hl: n === 4 }], { rh: 42, size: 20 });
      Mm.list(ctx, 880, 310, DAFTAR, { name: "daftar", w: 100, h: 56 }); Mm.board(ctx, 1260, 260, 420, [{ name: "saldo", value: n >= 4 ? 45000 : null, changed: n === 4 }], { bw: 380, bh: 100, title: "MEMORI UTAMA" });
      if (n >= 1 && n <= 3) Kd.frame(ctx, 860, 470, 500, "hitung_saldo", [["daftar", "[20000, 15000, 10000]"], ["total", n >= 2 ? 45000 : 0]], { ret: n >= 3 ? 45000 : null });
      if (n >= 4) { card(ctx, 860, 470, 500, 110, { fill: C.bg2, stroke: "#B7C4CC", lw: 3, r: 14 }); text(ctx, "frame dibuang; total tidak terlihat dari luar", 1110, 535, 22, { align: "center", weight: 900, color: C.ink2 }); }
      if (n >= 5) label(ctx, "karena itu fungsi aman dipakai berulang", 1270, 690, { size: 26 });
    },
    program_utuh(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "PROGRAM KAS KELAS UTUH: EMPAT BAHAN JADI SATU", 215);
      const n = reveal(l, 1.5, 2.4, 4);
      const groups = [[[0, 1, 2, 3, 4], "fungsi", "#8E6BBF"], [[7, 13], "perulangan", "#2E7E9A"], [[9, 10, 11, 12], "percabangan", "#B57A12"], [[5, 6, 8], "variabel", "#2E9E5B"]];
      const g = n >= 1 ? groups[n - 1] : null;
      Py.code(ctx, 220, 250, 920, PROG.map((t, i) => ({ t, hl: g && g[0].includes(i) })), { rh: 30, size: 15 });
      groups.forEach(([ls, nm, col], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1200, 280 + i * 100, 480, 80, { fill: i === n - 1 ? "#FFF3D6" : "#fff", stroke: col, lw: 4, r: 12 }); text(ctx, nm, 1230, 315 + i * 100, 24, { weight: 900, color: col }); text(ctx, "baris " + ls.map(x => x + 1).join(", "), 1230, 345 + i * 100, 17, { weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) label(ctx, "15 baris dari pseudocode episode lalu", 1440, 720, { size: 24 });
    },
    primm(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "CARA BELAJARNYA: PRIMM", 215);
      const n = reveal(l, 1.5, 1.8, 6);
      T.primm(ctx, 200, 280, Math.min(n, 5), { w: 290 });
      if (n >= 6) banner(ctx, "simpan tiap versi yang jalan sebelum mengubahnya lagi", 560, 1100, { size: 30 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Penerjemah", "pasangkan baris pseudocode dan Python", (x, y) => { ctx.save(); ctx.translate(x - 220, y - 120); ctx.scale(0.62, 0.62); T.dict(ctx, 0, 0, 700, [["BACA x", "x = input()"], ["JIKA … MAKA", "if …:"], ["TULIS x", "print(x)"]], { rh: 50, size: 24 }); ctx.restore(); }],
        ["Pelacak", "langkah demi langkah, tebak isi memori", (x, y) => { ctx.save(); ctx.translate(x - 220, y - 120); ctx.scale(0.62, 0.62); Py.code(ctx, 0, 0, 440, [{ t: "total = 0" }, { t: "for t in daftar:", hl: true }, { t: "    total = total + t" }], { rh: 44, size: 24 }); Mm.board(ctx, 460, 0, 260, [{ name: "total", value: 20000, changed: true }], { bw: 200, bh: 90 }); ctx.restore(); }],
        ["Pemburu bug", "temukan baris yang salah ketik", (x, y) => { ctx.save(); ctx.translate(x - 220, y - 120); ctx.scale(0.62, 0.62); Py.code(ctx, 0, 0, 700, [{ t: "jumlah = input()", bad: true }, { t: "if jumlah > 0" , bad: true }, { t: "    print(jumlah)" }], { rh: 44, size: 24 }); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 400, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu ketik program kas kelas di komputer sungguhan", 960, 820, 26, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
