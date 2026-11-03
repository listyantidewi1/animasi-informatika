/* Adegan episode F11.3: Algoritma Standar dalam Kode dan Kualitas Program. Gaya diagram Fase F.
   Muat setelah kiko-core.js, kiko-devices.js, kartu.js, urut.js, kode.js, py.js, alur_dev.js, kualitas.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Kt = K.kartu, U = K.urut, Kd = K.kode, Py = K.py, Qk = K.kualitas, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const FIVE = [48, 37, 25, 12, 56], LIN = [12, 45, 30, 78, 91, 65, 20, 55], SRT = [20, 40, 60, 65, 80, 85, 90, 95];
  const LINEAR_PY = [{ t: "def cari_linear(daftar, target):" }, { t: "    for i in range(len(daftar)):" }, { t: "        if daftar[i] == target:" }, { t: "            return i" }, { t: "    return -1" }];
  const LINEAR_PS = [{ t: "FUNGSI cari_linear(daftar, target)" }, { t: "UNTUK i dari 0 sampai n−1:", ind: 1 }, { t: "JIKA daftar[i] = target MAKA", ind: 2 }, { t: "KEMBALIKAN i", ind: 3 }, { t: "KEMBALIKAN −1", ind: 1 }];
  const BINER_PY = [{ t: "def cari_biner(daftar, target):" }, { t: "    # syarat: daftar sudah urut" }, { t: "    kiri, kanan = 0, len(daftar) - 1" }, { t: "    while kiri <= kanan:" }, { t: "        tengah = (kiri + kanan) // 2" }, { t: "        if daftar[tengah] == target:" }, { t: "            return tengah" }, { t: "        elif daftar[tengah] < target:" }, { t: "            kiri = tengah + 1" }, { t: "        else:" }, { t: "            kanan = tengah - 1" }, { t: "    return -1" }];
  const BUBBLE_PY = [{ t: "def bubble_sort(a):" }, { t: "    n = len(a)" }, { t: "    for i in range(n - 1):" }, { t: "        for j in range(n - 1 - i):" }, { t: "            if a[j] > a[j + 1]:" }, { t: "                a[j], a[j + 1] = a[j + 1], a[j]" }, { t: "    return a" }];
  const SEL_PY = [{ t: "def selection_sort(a):" }, { t: "    n = len(a)" }, { t: "    for i in range(n - 1):" }, { t: "        m = i" }, { t: "        for j in range(i + 1, n):" }, { t: "            if a[j] < a[m]:" }, { t: "                m = j" }, { t: "        a[i], a[m] = a[m], a[i]" }, { t: "    return a" }];
  const BUB = U.trace("bubble", FIVE), SEL = U.trace("selection", FIVE), BIN = Qk.binary(SRT, 90), LINS = U.linear(LIN, 78);

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 280, 560, 170, 0, { mood: "happy" });
      const n = reveal(l, 1.5, 1.6, 4);
      [["🧩", "tulis", "algoritma sebagai fungsi"], ["🧪", "uji", "kasus batas, traceback"], ["🧹", "rapikan", "nama, komentar, fungsi kecil"], ["⏱", "bandingkan", "hitung operasi, bukan menebak"]].forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 520 + i * 310; card(ctx, x, 280, 290, 300, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 18 }); text(ctx, ic, x + 145, 380, 60, { align: "center" }); text(ctx, t, x + 145, 450, 28, { align: "center", weight: 900 }); para(ctx, s, x + 145, 495, 20, 250, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) banner(ctx, "pencarian dan pengurutan: dari kertas kelas X ke Python", 640, 1100, { size: 30 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["E.6", "Pencarian dan Pengurutan"], ["F11.2", "Dari Pseudocode ke Kode"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 280, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 28, 520, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_balapan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "MAIN DULU: BALAPAN DUA KELOMPOK, HITUNG TURUSNYA", 215);
      const n = reveal(l, 1.5, 1.2, 10);
      const VAL = [48, 37, 25, 12, 56, 9, 71, 33];
      [["Kelompok 1 · bubble sort", 28, C.kiko], ["Kelompok 2 · selection sort", 28, "#8E6BBF"]].forEach(([t, total, col], g) => { const y = 280 + g * 250; text(ctx, t, 240, y, 26, { weight: 900, color: col }); Kt.row(ctx, 240, y + 20, VAL, { w: 84, h: 100, gap: 10 }); Qk.tally(ctx, 1080, y + 40, Math.min(total, Math.max(0, (n - 1 - g) * 4)), { label: "perbandingan:", color: col }); });
      if (n >= 10) label(ctx, "turusnya sama banyak (28); bedanya di jumlah pertukaran", 960, 745, { size: 24 });
    },
    unplugged_cari(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "ENAM BELAS NAMA URUT ABJAD: BUKA SATU-SATU ATAU BELAH DUA", 215);
      const n = reveal(l, 1.5, 1.1, 12);
      const names = "ADI,BUDI,CICI,DEWI,EKA,FANI,GITA,HANA,INA,JOKO,KIKI,LANI,MIRA,NANA,OKI,PUTU".split(",");
      const seq = Math.min(11, Math.max(0, n - 1)); const open1 = new Set([...Array(seq).keys()]);
      const nameRow = (x, y, open, found) => names.forEach((nm, i) => Kt.card(ctx, x + i * 83, y, 76, 70, nm, { face: open.has(i), hl: found && i === 10 ? C.good : undefined, size: 16 }));
      text(ctx, "cara 1: buka satu per satu, cari KIKI", 240, 280, 24, { weight: 900, color: C.kiko });
      nameRow(240, 300, open1, seq >= 11); Kt.counter(ctx, 1600, 300, seq, "bukaan");
      const steps2 = [7, 11, 9, 10]; const k2 = Math.min(4, Math.max(0, n - 8)); const open2 = new Set(steps2.slice(0, k2));
      ctx.save(); if (n < 8) ctx.globalAlpha = 0.25; text(ctx, "cara 2: buka tengah dulu, lalu belah lagi", 240, 470, 24, { weight: 900, color: "#8E6BBF" });
      nameRow(240, 490, open2, k2 >= 4); Kt.counter(ctx, 1600, 490, k2, "bukaan"); ctx.restore();
      if (n >= 12) label(ctx, "11 bukaan lawan 4 bukaan: catat, nanti dibandingkan dengan program", 960, 690, { size: 24 });
    },
    linear_kode(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "LINEAR SEARCH SEBAGAI FUNGSI", 215);
      const n = reveal(l, 1.5, 1.5, 9); const k = clamp(n - 5, 0, LINS.length); const st = k > 0 ? LINS[k - 1] : null;
      const pair = Math.min(n, 5) - 1;
      Kd.code(ctx, 200, 260, 700, LINEAR_PS.map((p, i) => ({ ...p, hl: i === pair && n <= 5 })), { rh: 44, size: 20 });
      Py.code(ctx, 930, 260, 760, LINEAR_PY.map((p, i) => ({ ...p, hl: (n <= 5 && i === pair) || (st && (st.found ? i === 3 : i === 2)) })), { rh: 44, size: 20 });
      if (st) { U.cards(ctx, 200, 560, st, { w: 80, h: 80, gap: 10 }); text(ctx, "target 78 · " + st.note, 1100, 610, 24, { weight: 900, color: st.found ? C.good : C.ink2 }); }
      if (n >= 9) label(ctx, "return -1 berarti tidak ketemu", 1300, 700, { size: 24 });
    },
    biner_kode(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BINARY SEARCH: KIRI, KANAN, TENGAH", 215);
      const n = reveal(l, 1.5, 1.6, 8); const k = clamp(n - 4, 0, BIN.length); const st = k > 0 ? BIN[k - 1] : null;
      const hl = n <= 1 ? [0, 1] : n === 2 ? [2] : n === 3 ? [3, 4] : st ? (st.found ? [5, 6] : st.v < 90 ? [7, 8] : [9, 10]) : [];
      Py.code(ctx, 200, 255, 760, BINER_PY.map((p, i) => ({ ...p, hl: hl.includes(i) })), { rh: 38, size: 19 });
      text(ctx, "cari_biner(daftar, 90)", 1340, 300, 26, { align: "center", weight: 900, color: C.kiko });
      Qk.pointers(ctx, 1000, 350, SRT, st, { w: 78, h: 80, gap: 8 });
      if (st) { card(ctx, 1000, 500, 680, 70, { fill: st.found ? C.goodBg : "#FFF3D6", stroke: st.found ? C.good : C.accent, lw: 3, r: 12 }); text(ctx, st.note, 1340, 545, 22, { align: "center", weight: 900, color: st.found ? C.good : C.accentDark }); }
      if (n >= 8) label(ctx, "3 langkah untuk 8 data; syarat: daftar urut", 1340, 650, { size: 24 });
    },
    bubble_kode(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BUBBLE SORT: DUA PERULANGAN BERSARANG", 215);
      const n = reveal(l, 1.5, 0.75, BUB.length + 2); const k = clamp(n - 2, 0, BUB.length); const st = k > 0 ? BUB[k - 1] : BUB[0];
      const hl = n <= 1 ? [2, 3] : k > 0 ? (st.swap ? [5] : [4]) : [];
      Py.code(ctx, 200, 260, 820, BUBBLE_PY.map((p, i) => ({ ...p, hl: hl.includes(i) })), { rh: 48, size: 21 });
      U.cards(ctx, 1080, 360, k > 0 ? st : { a: FIVE }, { w: 110, h: 110, gap: 12 });
      U.counters(ctx, 1100, 560, k > 0 ? st.cmp : 0, k > 0 ? st.sw : 0);
      if (k > 0) text(ctx, st.note, 1380, 720, 24, { align: "center", weight: 900, color: st.swap ? C.bad : C.ink2 });
      if (n >= BUB.length + 2) label(ctx, "menukar: satu baris, tanpa variabel sementara", 610, 680, { size: 24 });
    },
    selection_kode(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "SELECTION SORT: CARI TERKECIL, TUKAR SEKALI PER PUTARAN", 215);
      const n = reveal(l, 1.5, 0.8, SEL.length + 2); const k = clamp(n - 2, 0, SEL.length); const st = k > 0 ? SEL[k - 1] : SEL[0];
      const hl = n <= 1 ? [2, 4] : k > 0 ? (st.swap ? [7] : [5, 6]) : [];
      Py.code(ctx, 200, 260, 820, SEL_PY.map((p, i) => ({ ...p, hl: hl.includes(i) })), { rh: 44, size: 21 });
      U.cards(ctx, 1080, 360, k > 0 ? st : { a: FIVE }, { w: 110, h: 110, gap: 12 });
      U.counters(ctx, 1100, 560, k > 0 ? st.cmp : 0, k > 0 ? st.sw : 0);
      if (k > 0) text(ctx, st.note, 1380, 720, 24, { align: "center", weight: 900, color: st.swap ? C.bad : C.ink2 });
      if (n >= SEL.length + 2) label(ctx, "perbandingan sama, pertukaran paling banyak n − 1", 610, 740, { size: 24 });
    },
    uji_batas(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "KASUS UJI BATAS UNTUK cari_linear", 215);
      const n = reveal(l, 1.5, 1.7, 7);
      const rows = [["kosong", "cari_linear([], 7)", "-1", "✓ -1"], ["satu elemen", "cari_linear([7], 7)", "0", "✓ 0"], ["di awal", "cari_linear([7, 3, 9], 7)", "0", "✓ 0"], ["di akhir", "cari_linear([3, 9, 7], 7)", "2", "✕ -1"], ["tidak ada", "cari_linear([3, 9], 7)", "-1", "✓ -1"]];
      const shown = Math.min(5, Math.max(0, n - 1)); const got = n >= 7;
      U.table(ctx, 200, 270, [200, 440, 200, 200], ["kasus", "pemanggilan", "harapan", "hasil"], rows.map((r, i) => [r[0], r[1], r[2], got ? r[3] : ""]), { rh: 56, n: shown, colors: got ? rows.map((r, i) => i === 3 ? C.bad : C.good) : null, hlRow: got ? 3 : shown - 1 });
      if (n >= 6 && !got) label(ctx, "tulis hasil yang diharapkan dulu, baru jalankan", 1420, 420, { size: 24 });
      if (got) { K.alurdev.bug(ctx, 1290, 300, 400, "BUG #1", ["target di akhir tak ketemu", "lihat kodenya →"]); }
    },
    traceback(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BUG SELISIH SATU, DAN CARA MEMBACA TRACEBACK", 215);
      const n = reveal(l, 1.5, 2.0, 6);
      Py.code(ctx, 200, 260, 760, [{ t: "def cari_linear(daftar, target):" }, { t: "    for i in range(len(daftar) - 1):", bad: n >= 2 }, { t: "        if daftar[i] == target:" }, { t: "            return i" }, { t: "    return -1" }], { rh: 44, size: 20 });
      if (n >= 3) { card(ctx, 200, 500, 760, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 12 }); text(ctx, "range(3 - 1) → 0, 1 saja; indeks 2 tak pernah diperiksa", 580, 540, 22, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "perbaikan: range(len(daftar))", 580, 572, 20, { align: "center", weight: 800, color: C.good }); }
      if (n >= 4) Qk.traceback(ctx, 1000, 260, 700, [["Traceback (most recent call last):", ""], ['  File "cari.py", line 9, in <module>', n >= 5 ? "hl" : ""], ["    print(daftar[3])", ""], ["IndexError: list index out of range", n >= 6 ? "err" : ""]]);
      if (n >= 5) text(ctx, "① baris ke-9 yang bermasalah", 1000, 470, 22, { weight: 900, color: C.accentDark });
      if (n >= 6) text(ctx, "② jenis error: indeks di luar daftar", 1000, 510, 22, { weight: 900, color: C.bad });
      if (n >= 6) label(ctx, "baca dari bawah ke atas", 1350, 600, { size: 26 });
    },
    keterbacaan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BENAR SAJA BELUM CUKUP: HARUS MUDAH DIBACA", 215);
      const n = reveal(l, 1.5, 2.2, 4);
      Py.code(ctx, 200, 260, 720, [{ t: "def f(x, y):" }, { t: "    a, b = 0, len(x) - 1" }, { t: "    while a <= b:" }, { t: "        z = (a + b) // 2" }, { t: "        if x[z] == y: return z" }, { t: "        ..." }], { rh: 40, size: 19, title: "SEBELUM" });
      ctx.save(); if (n < 2) ctx.globalAlpha = 0.2; Py.code(ctx, 980, 260, 720, [{ t: "def cari_biner(daftar_nilai, target):" }, { t: "    kiri, kanan = 0, len(daftar_nilai) - 1" }, { t: "    while kiri <= kanan:" }, { t: "        indeks_tengah = (kiri + kanan) // 2" }, { t: "        if daftar_nilai[indeks_tengah] == target:" }, { t: "            return indeks_tengah" }], { rh: 40, size: 19, title: "SESUDAH" }); ctx.restore();
      if (n >= 3) { ["nama yang bermakna", "satu fungsi, satu tugas", "mudah dicek dan diuji"].forEach((s, i) => { card(ctx, 200 + i * 510, 560, 480, 70, { fill: C.goodBg, stroke: C.good, lw: 3, r: 12 }); text(ctx, "✓ " + s, 440 + i * 510, 605, 24, { align: "center", weight: 900, color: C.good }); }); }
      if (n >= 4) banner(ctx, "kode dibaca jauh lebih sering daripada ditulis", 680, 1000);
    },
    konvensi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "TIGA KEBIASAAN PENULIS KODE YANG BAIK", 215);
      const n = reveal(l, 1.5, 2.6, 4);
      const items = [["1. nama snake_case bermakna", [{ t: "jml = 0          # kurang jelas" }, { t: "jumlah_lulus = 0  # jelas" }]], ["2. komentar: mengapa, bukan apa", [{ t: "i = i + 1  # tambah satu ke i  ✗" }, { t: "# daftar harus urut (syarat biner)" }]], ["3. satu fungsi satu tugas", [{ t: "def hitung_rata(nilai):" }, { t: '    """Rata-rata daftar nilai."""' }]]];
      items.forEach(([t, code], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 200 + i * 520; card(ctx, x, 270, 490, 330, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 3, r: 16 }); para(ctx, t, x + 245, 320, 24, 450, { align: "center", weight: 900 }); Py.code(ctx, x + 20, 370, 450, code, { rh: 40, size: 15, title: "" }); ctx.restore(); });
      if (n >= 4) label(ctx, "untuk teman sekelompokmu, dan dirimu bulan depan", 960, 690, { size: 26 });
    },
    hitung_operasi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "EFISIENSI: HITUNG OPERASI, JANGAN MENEBAK", 215);
      const n = reveal(l, 1.5, 2.0, 5);
      U.table(ctx, 200, 270, [300, 420, 420], ["banyak data (n)", "linear: paling banyak", "biner: paling banyak"], [["8", "8", "3"], ["1.000", "1.000", "10"], ["1.000.000", "1.000.000", "20"]], { rh: 64, n: Math.max(0, n - 1), hlRow: n - 2 });
      if (n >= 5) { card(ctx, 1380, 270, 320, 260, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "n", 1540, 340, 44, { align: "center", weight: 900, color: C.bad }); text(ctx, "lawan", 1540, 390, 22, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "log n", 1540, 450, 44, { align: "center", weight: 900, color: C.good }); text(ctx, "belah dua = tambah satu langkah", 1540, 500, 17, { align: "center", weight: 800, color: C.ink2 }); }
      if (n >= 5) label(ctx, "tiap kali data berlipat dua, biner hanya bertambah satu langkah", 760, 620, { size: 24 });
    },
    balapan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740); heading(ctx, "BALAPAN PENGURUTAN: 1.000 DATA", 215);
      const n = reveal(l, 1.5, 2.4, 4);
      Qk.bars(ctx, 240, 320, 1200, [["bubble_sort (n²)", 499500, C.bad, "n(n−1)/2 perbandingan"], ["sorted() bawaan (n log n)", 10000, C.good, "≈ n × log₂ n"]], { n: Math.min(n, 2), bh: 60 });
      if (n >= 3) { card(ctx, 240, 560, 1200, 70, { fill: C.bg2, r: 12 }); text(ctx, "10.000 data: bubble ≈ 50 juta, sorted() ≈ 130 ribu; selisihnya makin menganga", 840, 605, 24, { align: "center", weight: 900 }); }
      if (n >= 4) banner(ctx, "tulis sendiri untuk memahami, pakai bawaan untuk pekerjaan nyata", 680, 1200, { size: 30 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Balapan algoritma", "pilih algoritma dan ukuran data", (x, y) => Qk.bars(ctx, x - 210, y - 70, 420, [["bubble", 45, C.bad], ["sorted()", 33, C.good]], { bh: 40 })],
        ["Pemburu bug batas", "selisih satu di tiga fungsi", (x, y) => { ctx.save(); ctx.translate(x - 220, y - 120); ctx.scale(0.62, 0.62); Py.code(ctx, 0, 0, 700, [{ t: "for i in range(len(a) - 1):", bad: true }, { t: "    if a[i] == target:" }, { t: "        return i" }], { rh: 44, size: 22 }); ctx.restore(); }],
        ["Perapi kode", "pilih nama dan komentar terbaik", (x, y) => [["x", C.badBg, C.bad], ["jml", "#FFF3D6", C.accentDark], ["jumlah_lulus ✓", C.goodBg, C.good]].forEach(([t, bg, col], i) => { card(ctx, x - 190, y - 100 + i * 66, 380, 56, { fill: bg, r: 10 }); text(ctx, t, x, y - 64 + i * 66, 24, { align: "center", weight: 900, color: col }); })]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 26, { weight: 900 }); para(ctx, t2, x - 160, 386, 20, 400, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu ukur waktunya sendiri dengan modul time", 960, 820, 26, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
