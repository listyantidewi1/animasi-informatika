/* S24 Simulasi praktik: membaca CSV, program Cek Bulan Kemah, test case dengan assert, dan README di notebook generik.
   Kode dan data sama dengan episode F11.10 (data hujan rekaan "hujan_sukamaju.csv"); semua output sudah diuji dengan python3.
   Jendela notebook di kiri (x 110–1410), panel langkah di kanan (x 1450–1820). Muat setelah kiko-core.js, layar.js, layar_kode.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, LK = K.layarKode;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const BLUE = "#1A73C8", GREEN = C.good, RED = LK.T.errInk;
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const ph = LK.phase;
  const blinkAt = l => Math.floor(l * 2.2) % 2 === 0;
  const stepAt = (f, marks) => { let n = 0; marks.forEach((m, i) => { if (f >= m) n = i + 1; }); return n; };

  // ---------- data dan kode (diuji dengan python3) ----------
  const FILE = "hujan_sukamaju.csv";
  const CSV = ["tanggal,mm", "2025-07-01,5", "2025-07-02,0", "2025-07-03,12", "2025-07-04,7", "2025-07-05,8", "2025-08-01,0", "2025-08-02,12", "2025-08-02,12", "2025-08-03,", "2025-08-04,999", "2025-08-05,3",
    "2025-09-01,20", "2025-09-02,7", "2025-09-03,0", "2025-09-04,15", "2025-09-05,9"];
  const C1 = ["import csv", "", "def baca_data(nama_file):", "    with open(nama_file) as f:", "        baris = list(csv.reader(f))", "    return baris[1:]   # lewati judul", "", 'print(baca_data("hujan_sukamaju.csv")[:3])'];
  const OUT1 = "[['2025-07-01', '5'], ['2025-07-02', '0'], ['2025-07-03', '12']]";
  const C2 = ["def bersihkan(baris):", "    bersih, terlihat = [], set()", "    for tgl, mm in baris:", '        if mm == "" or mm == "999" or tgl in terlihat:', "            continue", "        terlihat.add(tgl)", "        bersih.append((tgl, float(mm)))", "    return bersih"];
  const C3 = ["def rangkum(bersih):", "    hari_hujan = {}", "    for tgl, mm in bersih:", "        bulan = tgl[5:7]", "        if mm > 0:", "            hari_hujan[bulan] = hari_hujan.get(bulan, 0) + 1", "    return hari_hujan", "", "def rekomendasi(hari_hujan):", "    return min(hari_hujan, key=hari_hujan.get)"];
  const C3BUG = C3.slice(); C3BUG[4] = "        if mm >= 0:";
  const C4 = ['baris = baca_data("hujan_sukamaju.csv")', "bersih = bersihkan(baris)", 'print("Dibaca:", len(baris), "baris, terpakai:", len(bersih))', "hari_hujan = rangkum(bersih)", 'print("Hari hujan per bulan:", hari_hujan)', 'print("Bulan terbaik untuk kemah:", rekomendasi(hari_hujan))'];
  const OUT4 = ["Dibaca: 16 baris, terpakai: 13", "Hari hujan per bulan: {'07': 4, '08': 2, '09': 4}", "Bulan terbaik untuk kemah: 08"];
  const OUT4BUG = ["Dibaca: 16 baris, terpakai: 13", "Hari hujan per bulan: {'07': 5, '08': 3, '09': 5}", "Bulan terbaik untuk kemah: 08"];
  const C5 = ['uji1 = [["2025-08-01", "5"], ["2025-08-02", ""], ["2025-08-03", "999"]]', "assert len(bersihkan(uji1)) == 1", 'uji2 = [["2025-08-04", "12"], ["2025-08-04", "12"]]', "assert len(bersihkan(uji2)) == 1",
    'uji3 = [("2025-08-01", 5.0), ("2025-08-02", 0.0), ("2025-08-03", 7.0)]', 'assert rangkum(uji3) == {"08": 2}', 'assert rekomendasi({"07": 5, "08": 3}) == "08"', 'print("Semua test lolos.")'];
  const ERR_ASSERT = { name: "AssertionError", msg: "", kind: "runtime", line: 6, ctx: [[null, "<ipython-input-5> in <cell line: 0>()"], [5, C5[4]], [6, C5[5]], [7, C5[6]]] };
  const ERR_FILE = { name: "FileNotFoundError", msg: "[Errno 2] No such file or directory: 'hujan_sukamaju.csv'", kind: "runtime", line: -1,
    ctx: [[null, "<ipython-input-4> in <cell line: 0>()"], [1, C4[0], true], [null, "<ipython-input-1> in baca_data(nama_file)"], [3, C1[2], false], [4, C1[3], true]] };
  const README = ["# Cek Bulan Kemah v1.0", "Program ini membaca data hujan harian (CSV), melewati", "data rusak, lalu menyebut bulan dengan hari hujan paling sedikit.", "## Cara menjalankan", "1. Unggah `hujan_sukamaju.csv` lewat ikon folder.", "2. Pilih Runtime → Jalankan semua.",
    "## Contoh", "- Masukan: `2025-08-02,12` (tanggal, mm; 999 = tidak terukur)", "- Keluaran: `Bulan terbaik untuk kemah: 08`", "Sumber data: Portal Data Terbuka (fiktif)"];

  // ---------- bingkai dan pembantu ----------
  const nb = (ctx, opt = {}) => LK.notebook(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { name: "Cek_Bulan_Kemah.ipynb", status: "tersambung", compact: true, ...opt });
  const cx0 = a => a.x + 20, cw0 = a => a.w - 40;
  function keys(ctx, k, u) { if (u > 0 && u < 1) L.keys(ctx, 1635, 720, k, { press: u, align: "center", size: 30 }); }
  function call(ctx, y, s, tx, ty, opt = {}) { return L.callout(ctx, opt.x || 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt }); }
  function cellFit(ctx, a, opt) {
    const y0 = a.y + 18, h = LK.cellHeight(ctx, cw0(a), opt), off = Math.max(0, y0 + h - (a.y + a.h - 14));
    let g; LK.clip(ctx, { x: a.x, y: a.y, w: a.w, h: a.h - 6 }, () => { g = LK.cell(ctx, cx0(a), y0 - off, cw0(a), opt); }); return g;
  }
  // penampil file teks (CSV)
  function viewer(ctx, opt = {}) {
    const x = WIN.x, y = WIN.y, w = opt.w || 760, h = WIN.h;
    const area = L.window(ctx, x, y, w, h, { title: FILE + " — Teks" });
    return LK.code(ctx, area.x + 16, area.y + 14, CSV, { size: 22, lh: 35, w: w - 32, hl: opt.hl, err: opt.err, boxes: opt.boxes, dim: opt.dim });
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["mengunggah dan membaca file CSV", "menjalankan Cek Bulan Kemah", "menulis test case dengan assert", "menulis README singkat"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 31, { weight: 800 }); ctx.globalAlpha = 1;
      });
      card(ctx, 1100, 280, 560, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      LK.icons.doc(ctx, 1140, 310, 44, C.kiko); text(ctx, FILE, 1200, 345, 24, { weight: 800 });
      LK.code(ctx, 1130, 380, CSV.slice(0, 4).concat(["…"]), { size: 22, nums: false, w: 500 });
      text(ctx, "→  Bulan terbaik: 08 (Agustus)", 1380, 650, 26, { align: "center", weight: 900, color: GREEN });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      [["F11.5", "Data Terbuka untuk Keputusan", "membersihkan data, 999"], ["F11.10", "Proyek: Aplikasi Berbasis Data Terbuka", "Cek Bulan Kemah, test case, README"], ["S21", "Program Kas Kelas dengan Python", "simulasi sebelumnya"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490; card(ctx, x, 300, 460, 320, { fill: i === 2 ? "#F4F6F5" : C.bg2, r: 22 });
        text(ctx, c, x + 230, 380, 54, { align: "center", weight: 900, color: i === 2 ? C.ink2 : C.kiko }); para(ctx, t, x + 230, 445, 29, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 590, 23, { align: "center", weight: 600, color: C.ink2 });
      });
      kiko(ctx, 1660, 730, 100, 0, { wave: l });
    },
    kenal_csv(ctx, b, l) {
      const A = b.audio || b.dur;
      const g = viewer(ctx, { hl: l > A * 0.2 && l < A * 0.5 ? [1] : [], boxes: l > A * 0.55 ? [{ line: 0, from: 7, to: 8, color: C.accent }, { line: 1, from: 10, to: 11, color: C.accent }, { line: 2, from: 10, to: 11, color: C.accent }] : [] });
      call(ctx, 150, "CSV = teks biasa. Baris 1: judul kolom.", g.at(0, 11).x + 6, g.at(0, 11).y, { x: 920, maxW: 360 });
      if (l > A * 0.2) call(ctx, 320, "Satu baris = satu hari.", g.at(1, 12).x + 6, g.at(1, 12).y, { x: 920, fill: "#E7F1FB", color: BLUE });
      if (l > A * 0.55) { call(ctx, 450, "Koma memisahkan kolom: tanggal , mm", g.at(2, 11).x + 6, g.at(2, 11).y, { x: 920, maxW: 360 });
        const tx = 960, ty = 590; card(ctx, tx - 20, ty - 20, 520, 220, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 14 }); text(ctx, "Kalau dibuka sebagai tabel:", tx, ty + 14, 20, { weight: 800, color: C.ink2 });
        [["tanggal", "mm"], ["2025-07-01", "5"], ["2025-07-02", "0"], ["2025-07-03", "12"]].forEach((r, i) => r.forEach((v, j) => { const x = tx + j * 300, y = ty + 30 + i * 38, cw = j ? 180 : 300; ctx.strokeStyle = "#DDE5EA"; ctx.lineWidth = 2; ctx.strokeRect(x, y, cw, 38); text(ctx, v, x + 12, y + 27, 20, { weight: i ? 600 : 800 }); })); }
    },
    data_rusak(ctx, b, l) {
      const A = b.audio || b.dur; const on = k => l > A * (0.15 + k * 0.17);
      const err = [], marks = [[8, "kembar: tanggal sudah ada", RED], [9, "kosong: tidak ada angka", RED], [10, "999 = tidak terukur", RED]];
      const g = viewer(ctx, { hl: [6, 7, 11].filter(() => l > A * 0.08), dim: [1, 2, 3, 4, 5, 12, 13, 14, 15, 16] });
      marks.forEach(([i, s], k) => { if (!on(k)) return; ctx.fillStyle = "rgba(226,91,82,0.18)"; ctx.fillRect(g.x, g.top(i), g.w, g.lh); ctx.fillStyle = LK.T.errBar; ctx.fillRect(g.x, g.top(i), 5, g.lh);
        call(ctx, 300 + k * 110, s, g.at(i, 15).x, g.at(i, 15).y, { x: 920, fill: "#FDECEA", color: RED, ink: RED }); });
      text(ctx, "Agustus", 940, 250, 30, { weight: 900, color: C.accentDark });
      if (l > A * 0.75) call(ctx, 640, "Dilewati, bukan dihitung.", null, null, { x: 920, fill: C.goodBg, color: GREEN });
    },
    unggah(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const open = f > 0.14, done = f > 0.64;
      const a = nb(ctx, { compact: false, files: open ? { items: done ? ["sample_data/", FILE] : ["sample_data/"], hl: done ? 1 : null, hlColor: C.goodBg, upHover: f > 0.22 && f < 0.3 } : null, railOn: open ? "files" : null });
      LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [""], size: 22, run: "idle", minLines: 2 });
      if (f > 0.3 && f < 0.62) { // dialog pilih file milik sistem operasi (generik)
        ctx.fillStyle = "rgba(31,42,51,0.25)"; ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
        const dx = 420, dy = 250; card(ctx, dx, dy, 760, 440, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 16 });
        text(ctx, "Pilih file untuk diunggah", dx + 36, dy + 56, 28, { weight: 900 }); text(ctx, "📁 Dokumen › Informatika", dx + 36, dy + 100, 22, { weight: 700, color: C.ink2 });
        ["catatan_kemah.docx", FILE, "foto_lab.jpg"].forEach((s, i) => { const y = dy + 130 + i * 62, on = i === 1 && f > 0.42; if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, dx + 30, y, 700, 54, 8); ctx.fill(); }
          LK.icons.doc(ctx, dx + 50, y + 12, 30, "#5B6B76"); text(ctx, s, dx + 100, y + 36, 24, { weight: 700, color: on ? "#1A5FA8" : C.ink }); });
        card(ctx, dx + 560, dy + 360, 170, 54, { fill: f > 0.56 ? "#155FA6" : BLUE, r: 10 }); text(ctx, "Buka", dx + 645, dy + 396, 24, { align: "center", weight: 800, color: "#FFFFFF" });
      }
      if (done) call(ctx, 470, "File muncul di daftar.", a.x - 70, a.fileItem(1).y + 20, { fill: C.goodBg, color: GREEN });
      LK.steps(ctx, "LANGKAH", ["Klik ikon folder di kiri.", "Klik ikon upload.", "Pilih " + FILE + ".", "File muncul di daftar."], stepAt(f, [0.14, 0.3, 0.6, 0.66]));
      const up = a.upload || { x: 230, y: 330 };
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 650 }, { at: 0.14, x: a.rail ? a.rail.files.x : 136, y: a.rail ? a.rail.files.y : 560, click: true }, { at: 0.28, x: up.x, y: up.y, click: true }, { at: 0.44, x: 640, y: 440, click: true }, { at: 0.58, x: 1060, y: 636, click: true }, { at: 0.8, x: 700, y: 650 }]);
    },
    unggah_catatan(ctx, b, l) {
      const A = b.audio || b.dur;
      const a = nb(ctx, { compact: false, files: { items: ["sample_data/", FILE], hl: 1, hlColor: C.goodBg, note: "File yang diunggah terhapus saat sesi berakhir. Simpan salinannya di tempat lain." }, railOn: "files" });
      LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [""], size: 22, run: "idle", minLines: 2 });
      if (l > A * 0.1) { LK.focus(ctx, { x: a.x - 330, y: WIN.y + WIN.h - 120, w: 316, h: 100 }, { t: l, color: RED }); call(ctx, 300, "Sesi berakhir = file hilang.", a.x - 20, WIN.y + WIN.h - 70, { fill: "#FDECEA", color: RED }); }
      if (l > A * 0.5) call(ctx, 460, "Simpan file asli di komputer atau drive, lalu unggah lagi.", null, null, { fill: "#E7F1FB", color: BLUE, size: 22 });
    },

    ketik_baca(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = LK.typed(C1.slice(0, 6), ph(l, sp, 0.04, 0.9));
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: T.lines, size: 26, active: true, run: "ready", caret: T.caret, blink: f < 0.9 || blinkAt(l), minLines: 6 });
      if (f > 0.14) call(ctx, 400, "import csv: modul bawaan untuk file CSV.", c.code.at(0, 10).x + 6, c.code.at(0, 10).y, { fill: "#E7F1FB", color: BLUE, size: 22 });
      if (f > 0.4) call(ctx, 540, "def baca_data: fungsi untuk membaca file.", c.code.at(2, 25).x + 6, c.code.at(2, 25).y, { size: 22 });
      LK.steps(ctx, "SEL 1", ["import csv", "def baca_data(nama_file):", "buka file, baca semua baris"], stepAt(f, [0.14, 0.4, 0.9]));
    },
    arti_baca(ctx, b, l) {
      const a = nb(ctx); const A = b.audio || b.dur;
      const bx = [l > A * 0.05 ? { line: 3, from: 4, to: 29, color: BLUE } : null, l > A * 0.22 ? { line: 4, from: 21, to: 34, color: C.accent } : null, l > A * 0.48 ? { line: 5, from: 11, to: 20, color: GREEN } : null].filter(Boolean);
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: C1.slice(0, 6), size: 26, active: true, run: "ready", boxes: bx });
      if (l > A * 0.05) call(ctx, 150, "with open: membuka file.", c.code.at(3, 29).x + 6, c.code.at(3, 29).y, { fill: "#E7F1FB", color: BLUE });
      if (l > A * 0.22) call(ctx, 300, "csv.reader: potong tiap baris di tanda koma.", c.code.at(4, 34).x + 6, c.code.at(4, 34).y);
      if (l > A * 0.48) { call(ctx, 470, "baris[1:]: mulai baris kedua, judul dilewati.", c.code.at(5, 20).x + 6, c.code.at(5, 20).y, { fill: C.goodBg, color: GREEN });
        const y = c.bottom + 40; LK.code(ctx, c.x + 90, y, ["tanggal,mm      ← indeks 0, dilewati", "2025-07-01,5    ← indeks 1, mulai dari sini"], { size: 22, nums: false, w: 800, dim: [0] }); }
    },
    jalan_baca(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = LK.insert(C1.slice(0, 6), 6, ["", C1[7]], ph(l, sp, 0.02, 0.24));
      const run = f < 0.28 ? "ready" : f < 0.36 ? "running" : "done";
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: T.lines, size: 24, active: true, run, spin: l, count: 1, out: run === "done" ? [OUT1] : null, outSize: 22, caret: f < 0.28 ? T.caret : null, blink: blinkAt(l) });
      if (run === "done" && f > 0.45) { const cw = LK.mono(ctx, 22), ox = c.x + 72 + 16, oy = c.out.lines[0];
        LK.focus(ctx, { x: ox + 1 * cw, y: oy - 22, w: 19 * cw, h: 30 }, { t: l, pad: 3 }); call(ctx, 420, "Satu baris = list berisi dua string.", ox + 10 * cw, oy + 10);
        if (f > 0.66) { LK.focus(ctx, { x: ox + 16 * cw, y: oy - 22, w: 3 * cw, h: 30 }, { t: l + 1, pad: 3, color: RED }); call(ctx, 560, "'5' masih string: ada tanda kutip.", ox + 17.5 * cw, oy + 10, { fill: "#FDECEA", color: RED }); } }
      LK.steps(ctx, "LANGKAH", ["Cetak tiga baris pertama.", "Jalankan sel.", "Baca output-nya."], stepAt(f, [0.24, 0.36, 0.6]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.28, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.44, x: c.play.x + 40, y: c.play.y + 420 }]);
    },

    ketik_bersih(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = LK.typed(C2, ph(l, sp, 0.03, 0.6));
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: T.lines, size: 23, active: true, run: f > 0.92 ? "done" : "ready", count: 2, caret: f < 0.6 ? T.caret : null, blink: blinkAt(l), minLines: 8,
        hl: f > 0.62 ? (f < 0.8 ? [3, 4] : [6]) : [] });
      if (f > 0.62 && f < 0.8) call(ctx, 420, "Kosong, 999, atau tanggal kembar: continue = lewati.", c.code.at(3, 48).x + 4, c.code.at(3, 48).y, { fill: "#FDECEA", color: RED, size: 22 });
      if (f >= 0.8) call(ctx, 420, "float(mm): teks angka menjadi angka.", c.code.at(6, 38).x + 4, c.code.at(6, 38).y, { fill: C.goodBg, color: GREEN, size: 22 });
      LK.steps(ctx, "SEL 2: bersihkan()", ["Periksa tiap baris.", "Lewati yang rusak.", "Ubah mm dengan float."], stepAt(f, [0.6, 0.8, 0.95]));
    },
    ketik_rangkum(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = LK.typed(C3, ph(l, sp, 0.03, 0.62));
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: T.lines, size: 22, active: true, run: f > 0.92 ? "done" : "ready", count: 3, caret: f < 0.62 ? T.caret : null, blink: blinkAt(l), minLines: 10,
        hl: f > 0.64 ? (f < 0.82 ? [4, 5] : [9]) : [] });
      if (f > 0.64 && f < 0.82) call(ctx, 430, "mm > 0: hanya hari hujan yang dihitung, per bulan.", c.code.at(5, 59).x + 4, c.code.at(5, 59).y, { size: 22 });
      if (f >= 0.82) call(ctx, 430, "min(…, key=…): bulan dengan nilai terkecil.", c.code.at(9, 46).x + 4, c.code.at(9, 46).y, { fill: "#E7F1FB", color: BLUE, size: 22 });
      LK.steps(ctx, "SEL 3", ["rangkum(): hitung per bulan.", "Simpan di dictionary.", "rekomendasi(): pilih terkecil."], stepAt(f, [0.5, 0.82, 0.95]));
    },
    jalan_utama(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const run = f < 0.12 ? "ready" : f < 0.2 ? "running" : "done";
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: C4, size: 22, active: true, run, spin: l, count: 4, out: run === "done" ? OUT4.slice(0, f < 0.3 ? 1 : f < 0.5 ? 2 : 3) : null, outSize: 22 });
      if (run === "done") { const y0 = 150; card(ctx, 1450, y0, 370, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "HARI HUJAN", 1474, y0 + 44, 24, { weight: 900, color: C.accentDark });
        [["Juli", 4], ["Agustus", 2], ["September", 4]].forEach(([m, v], i) => { const y = y0 + 80 + i * 90, best = i === 1 && f > 0.55; if (f < 0.3) return;
          text(ctx, m, 1474, y + 32, 24, { weight: 800, color: best ? GREEN : C.ink }); ctx.fillStyle = best ? GREEN : "#9AB7C4"; rr(ctx, 1474, y + 44, v * 70, 26, 6); ctx.fill(); text(ctx, String(v), 1484 + v * 70, y + 66, 24, { weight: 900, color: best ? GREEN : C.ink2 }); });
        if (f > 0.55) text(ctx, "Terbaik: 08 (Agustus)", 1635, y0 + 395, 26, { align: "center", weight: 900, color: GREEN }); }
      if (run === "done" && f > 0.3) call(ctx, 600, "16 dibaca, 13 terpakai: 3 dilewati.", c.x + 600, c.out.lines[0] - 8, { size: 22 });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.12, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.3, x: c.play.x + 30, y: c.play.y + 440 }]);
    },

    tabel_test(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "TEST CASE UNTUK TIAP FUNGSI (DARI F11.10)", 960, 215, 32, { align: "center", weight: 900, color: C.accentDark });
      const cols = [260, 640, 360], hdr = ["Fungsi", "Data uji", "Diharapkan"], x0 = 260, y0 = 260;
      ctx.fillStyle = "#EEF2F5"; rr(ctx, x0, y0, 1400, 56, 10); ctx.fill(); let x = x0; hdr.forEach((h, i) => { text(ctx, h, x + 20, y0 + 38, 26, { weight: 900, color: C.ink2 }); x += cols[i]; });
      [["bersihkan", "3 baris: baik, kosong, 999", "1 baris tersisa"], ["bersihkan", "2 baris kembar", "1 baris tersisa"], ["rangkum", "2 hari hujan + 1 kering di Agustus", '{"08": 2}'], ["rekomendasi", '{"07": 5, "08": 3}', '"08"']].forEach((r, i) => {
        const y = y0 + 64 + i * 92; if (l < A * (0.1 + i * 0.16)) return;
        ctx.fillStyle = i % 2 ? "#FFFFFF" : "#F7FAF8"; rr(ctx, x0, y, 1400, 84, 10); ctx.fill(); let xx = x0;
        r.forEach((v, j) => { if (j === 0) { LK.mono(ctx, 26, 700); ctx.fillStyle = LK.T.fn; LK.monoText(ctx, v + "()", xx + 20, y + 52); } else if (j === 2 && l < A * (0.16 + i * 0.16)) {} else text(ctx, v, xx + 20, y + 52, 26, { weight: j === 2 ? 900 : 700, color: j === 2 ? GREEN : C.ink }); xx += cols[j]; });
      });
      if (l > A * 0.8) text(ctx, "Hasil yang diharapkan sudah diketahui sebelum menjalankan.", 960, 760, 28, { align: "center", weight: 800, color: C.ink2 });
    },
    ketik_assert(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = LK.typed(C5, ph(l, sp, 0.03, 0.7));
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: T.lines, size: 21, active: true, run: "ready", caret: f < 0.7 ? T.caret : null, blink: blinkAt(l), minLines: 8, hl: f > 0.3 ? [1, 3, 5, 6].filter(i => i < T.lines.length) : [] });
      card(ctx, 1450, 150, 370, 330, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "assert …", 1474, 200, 30, { weight: 900, color: LK.T.kw });
      text(ctx, "benar →", 1474, 270, 26, { weight: 800, color: GREEN }); text(ctx, "diam, lanjut", 1600, 270, 26, { weight: 700 });
      if (f > 0.4) { text(ctx, "salah →", 1474, 340, 26, { weight: 800, color: RED }); text(ctx, "berhenti:", 1600, 340, 26, { weight: 700 }); LK.mono(ctx, 22, 800); ctx.fillStyle = RED; LK.monoText(ctx, "AssertionError", 1500, 400); }
    },
    jalan_assert(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const run = f < 0.16 ? "ready" : f < 0.3 ? "running" : "done";
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: C5, size: 21, active: true, run, spin: l, count: 5, out: run === "done" ? [{ t: "Semua test lolos.", k: "ok" }] : null, outSize: 22 });
      if (run === "done") { LK.focus(ctx, { x: c.x + 82, y: c.out.lines[0] - 24, w: 260, h: 32 }, { t: l, color: GREEN }); call(ctx, 420, "Keempat assert benar.", c.x + 360, c.out.lines[0] - 8, { fill: C.goodBg, color: GREEN }); }
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.16, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.36, x: c.play.x + 40, y: c.play.y + 440 }]);
    },
    bug_rangkum(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      if (f < 0.48) {
        const lines = C3.slice(); if (f > 0.2) lines[4] = C3BUG[4];
        const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines, size: 22, active: true, run: f < 0.32 ? "done" : f < 0.4 ? "running" : "done", spin: l, count: f < 0.32 ? 3 : 6, caret: f > 0.1 && f < 0.32 ? { line: 4, col: f > 0.2 ? 18 : 17 } : null, blink: blinkAt(l),
          boxes: f > 0.2 ? [{ line: 4, from: 14, to: 18, color: RED }] : [] });
        if (f > 0.2) call(ctx, 300, "> menjadi >= (sengaja salah)", c.code.at(4, 19).x + 4, c.code.at(4, 19).y, { fill: "#FDECEA", color: RED });
        LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.1, x: c.code.at(4, 17).x, y: c.code.at(4, 17).y + 6, click: true, kind: "text" }, { at: 0.32, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.46, x: c.play.x + 40, y: c.play.y + 400 }]);
      } else {
        const run = f < 0.56 ? "ready" : f < 0.64 ? "running" : "done";
        const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: C4, size: 22, active: true, run, spin: l, count: 7, out: run === "done" ? OUT4BUG : (f < 0.56 ? OUT4 : null), outSize: 22 });
        if (run === "done" && f > 0.68) { const cw = LK.mono(ctx, 22); LK.focus(ctx, { x: c.x + 86, y: c.out.lines[2] - 24, w: 30 * cw, h: 32 }, { t: l });
          call(ctx, 420, "Bulan terbaik tetap 08. Seolah tidak ada masalah…", c.x + 86 + 30 * cw, c.out.lines[2] - 8, { size: 22 }); }
        LK.pointer(ctx, l, sp, [{ at: 0.48, x: 900, y: 700 }, { at: 0.56, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.7, x: c.play.x + 40, y: c.play.y + 440 }]);
      }
      LK.steps(ctx, "LANGKAH", ["Ubah > menjadi >= di rangkum.", "Jalankan sel 3.", "Jalankan program utama."], stepAt(f, [0.22, 0.42, 0.66]));
    },
    assert_gagal(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const run = f < 0.06 ? "ready" : f < 0.14 ? "running" : "done";
      const c = cellFit(ctx, a, { lines: C5, size: 21, active: true, run, spin: l, count: 8, out: run === "done" ? [{ err: ERR_ASSERT }] : null, outSize: 19 });
      if (run === "done" && c.out && c.out.err) { const e = c.out.err;
        if (f > 0.2) { LK.focus(ctx, e.arrowBox, { t: l, color: RED }); call(ctx, 160, "Baris 6: test untuk rangkum gagal.", e.arrowBox.x + e.arrowBox.w + 6, e.arrowBox.y + 16, { fill: "#FDECEA", color: RED }); }
        if (f > 0.45) { card(ctx, 1450, 340, 370, 250, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "rangkum(uji3)", 1474, 384, 24, { weight: 900, color: LK.T.fn });
          text(ctx, "diharapkan:", 1474, 430, 22, { weight: 700, color: C.ink2 }); LK.mono(ctx, 24, 800); ctx.fillStyle = GREEN; LK.monoText(ctx, '{"08": 2}', 1630, 431);
          text(ctx, "hasil bug:", 1474, 480, 22, { weight: 700, color: C.ink2 }); LK.mono(ctx, 24, 800); ctx.fillStyle = RED; LK.monoText(ctx, '{"08": 3}', 1630, 481);
          para(ctx, "Hari kering ikut dihitung.", 1474, 540, 22, 330, { weight: 800, color: RED }); }
        if (f > 0.72) call(ctx, 620, "Test case menangkap bug yang tersembunyi.", null, null, { fill: C.goodBg, color: GREEN, size: 22 }); }
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.06, x: 160, y: a.y + 40, click: true }, { at: 0.2, x: 200, y: a.y + 500 }]);
    },
    bug_perbaiki(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      if (f < 0.45) {
        const lines = f > 0.16 ? C3 : C3BUG;
        const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines, size: 22, active: true, run: f < 0.26 ? "done" : f < 0.34 ? "running" : "done", spin: l, count: f < 0.26 ? 6 : 9, caret: f > 0.06 && f < 0.26 ? { line: 4, col: f > 0.16 ? 17 : 18 } : null, blink: blinkAt(l),
          boxes: [{ line: 4, from: 14, to: f > 0.16 ? 17 : 18, color: f > 0.16 ? GREEN : RED }] });
        LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.06, x: c.code.at(4, 18).x, y: c.code.at(4, 18).y + 6, click: true, kind: "text" }, { at: 0.26, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.42, x: c.play.x + 40, y: c.play.y + 400 }]);
      } else {
        const run = f < 0.52 ? "ready" : f < 0.6 ? "running" : "done";
        const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: C5, size: 21, active: true, run, spin: l, count: 10, out: run === "done" ? [{ t: "Semua test lolos.", k: "ok" }] : null, outSize: 22 });
        if (run === "done") call(ctx, 460, "Lolos lagi.", c.x + 360, c.out.lines[0] - 8, { fill: C.goodBg, color: GREEN });
        LK.pointer(ctx, l, sp, [{ at: 0.45, x: 900, y: 700 }, { at: 0.52, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.7, x: c.play.x + 40, y: c.play.y + 440 }]);
      }
      LK.steps(ctx, "LANGKAH", ["Kembalikan >= menjadi >.", "Jalankan sel 3.", "Jalankan sel test."], stepAt(f, [0.18, 0.36, 0.62]));
    },

    readme_tulis(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { compact: false });
      const T = LK.typed(README, ph(l, sp, 0.14, 0.92));
      let tc = null;
      if (f > 0.08) tc = LK.textCell(ctx, cx0(a), a.y + 16, cw0(a), { lines: T.lines.length ? T.lines : [""], size: 18, active: true, caret: T.caret, blink: f < 0.92 || blinkAt(l) });
      LK.clip(ctx, { x: a.x, y: a.y, w: a.w, h: a.h - 6 }, () => LK.cell(ctx, cx0(a), (tc ? tc.bottom : a.y) + 18, cw0(a), { lines: C1.slice(0, 4), size: 20, run: "done", count: 1 }));
      LK.steps(ctx, "README", ["Klik + Teks.", "Nama, fungsi program.", "Cara menjalankan.", "Contoh, sumber data."], stepAt(f, [0.1, 0.3, 0.55, 0.92]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 700 }, { at: 0.07, x: a.plus.teks.x, y: a.plus.teks.y, click: true }, { at: 0.2, x: a.plus.teks.x + 200, y: a.plus.teks.y + 500 }]);
    },
    readme_jadi(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { compact: false });
      let tc;
      if (f < 0.18) tc = LK.textCell(ctx, cx0(a), a.y + 16, cw0(a), { lines: README, size: 18, active: true });
      else { ctx.fillStyle = "#FFFFFF"; tc = LK.textCell(ctx, cx0(a), a.y + 10, cw0(a), { lines: README, rendered: true }); }
      keys(ctx, ["Shift", "Enter"], ph(l, sp, 0.04, 0.2));
      if (f > 0.3) call(ctx, 300, "Judul, daftar, dan kode tampil rapi.", cx0(a) + 520, a.y + 50, { fill: C.goodBg, color: GREEN });
      if (f > 0.55) call(ctx, 460, "Teman bisa memakai programmu tanpa bertanya.", null, null, { fill: "#E7F1FB", color: BLUE, size: 22 });
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 280, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 300, 245, 20, 70, 6); ctx.fill(); rr(ctx, 340, 245, 20, 70, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 265, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 315, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 250, 380 + i * 100, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 296, 433 + i * 100, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 340, 433 + i * 100, 28, { weight: 700, fit: 670 }); });
      card(ctx, 1080, 360, 600, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Contoh CSV kecilmu", 1104, 400, 22, { weight: 900, color: C.ink2 });
      LK.code(ctx, 1100, 420, ["tanggal,mm", "2025-10-01,4", "2025-10-02,0", "2025-10-02,0", "2025-10-03,999", "2025-11-01,0"], { size: 20, w: 560 });
      text(ctx, "sengaja beri satu baris rusak", 1380, 700, 22, { align: "center", weight: 700, color: C.ink2 });
    },
    masalah_file(ctx, b, l) {
      const A = b.audio || b.dur;
      const a = nb(ctx, { files: { items: ["sample_data/"], w: 240 }, railOn: "files" });
      const c = cellFit(ctx, a, { lines: C4, size: 18, active: true, run: "done", count: 1, out: [{ err: ERR_FILE }], outSize: 18 });
      if (c.out && c.out.err && l > A * 0.12) { LK.focus(ctx, c.out.err.lastBox, { t: l, color: RED }); call(ctx, 200, "FileNotFoundError: file tidak ditemukan.", c.out.err.lastBox.x + c.out.err.lastBox.w, c.out.err.lastBox.y + 14, { fill: "#FDECEA", color: RED, size: 22 }); }
      if (l > A * 0.45) call(ctx, 420, "File belum diunggah lagi: daftarnya kosong.", null, null, { x: 172, maxW: 190, size: 21 });
      if (l > A * 0.7) call(ctx, 560, "Atau namanya beda satu huruf: Hujan_sukamaju.csv.", null, null, { fill: "#E7F1FB", color: BLUE, size: 22 });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.10", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "perakit program · penguji fungsi", 620, 410, 26, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "pemeriksa README", 620, 445, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 480, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f1110", 620, 526, 26, { align: "center", weight: 800, color: C.kikoDark });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Tambahkan satu test case milikmu untuk fungsi bersihkan.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      LK.code(ctx, 1040, 560, ['uji4 = [["2025-08-06", "0"]]', "assert len(bersihkan(uji4)) == 1"], { size: 20, nums: false, w: 540 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
