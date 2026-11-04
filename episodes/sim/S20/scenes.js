/* S20 Simulasi praktik: program Python pertama di notebook (Colab disebut di narasi; tampilan generik).
   Jendela browser/notebook di kiri (x 110–1410, y 122–822), panel langkah di kanan (x 1450–1820). Semua data rekaan.
   Muat setelah kiko-core.js, layar.js, layar_kode.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, LK = K.layarKode;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const BLUE = "#1A73C8", GREEN = C.good;
  const SZ = 28;
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const ph = LK.phase;
  const blinkAt = l => Math.floor(l * 2.2) % 2 === 0;
  const stepAt = (f, marks) => { let n = 0; marks.forEach((m, i) => { if (f >= m) n = i + 1; }); return n; };

  // ---------- kode yang dipakai (sudah diuji dengan python3) ----------
  const HALO = 'print("Halo, kelas!")';
  const VAR = ['nama = "Sinta"', 'print("Halo, " + nama)'];
  const INP = ['nama = input("Siapa namamu? ")', 'print("Halo, " + nama)'];
  const PROMPT = "Siapa namamu? ";
  const ERR_NAME = { name: "NameError", msg: "name 'nma' is not defined", kind: "runtime", line: 2, ctx: [[1, INP[0]], [2, 'print("Halo, " + nma)']] };
  const ERR_KUTIP = { name: "SyntaxError", msg: "unterminated string literal (detected at line 1)", kind: "syntax", line: 1, code: 'print("Halo, kelas!)', col: 6, file: "<ipython-input-5>" };
  const ERR_KURUNG = { name: "SyntaxError", msg: "'(' was never closed", kind: "syntax", line: 1, code: 'print("Halo, kelas!"', col: 5, file: "<ipython-input-6>" };

  // ---------- bingkai ----------
  function nb(ctx, opt = {}) { return LK.notebook(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { name: "Program_Pertama.ipynb", status: "tersambung", ...opt }); }
  const cx0 = a => a.x + 24, cw0 = a => a.w - 48;
  function keys(ctx, k, u) { if (u > 0 && u < 1) L.keys(ctx, 1635, 720, k, { press: u, align: "center", size: 30 }); }
  function call(ctx, y, s, tx, ty, opt = {}) { return L.callout(ctx, 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt }); }
  function runState(f, t0, t1) { return f < t0 ? "ready" : f < t1 ? "running" : "done"; }
  function cellRun(ctx, a, y, lines, f, opt = {}) {
    // satu sel: opt.click (fraksi klik ▶), opt.done (fraksi output muncul), opt.out (output), opt.count
    const st = opt.click == null ? (opt.run || "idle") : runState(f, opt.click, opt.done);
    return LK.cell(ctx, cx0(a), y, cw0(a), { lines, size: SZ, active: opt.active !== false, run: st, spin: f * 6, count: opt.count, out: st === "done" ? opt.out : (opt.outRun && st === "running" ? opt.outRun : null), caret: opt.caret, blink: opt.blink, marks: opt.marks, boxes: opt.boxes, hl: opt.hl });
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["membuat notebook baru", "menjalankan program pertama", "memakai variabel dan input", "membaca dan memperbaiki error"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 760, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      const a = LK.notebook(ctx, 1080, 290, 600, 380, { compact: true, name: "Program_Pertama.ipynb", status: "" });
      LK.cell(ctx, a.x + 14, a.y + 24, a.w - 28, { lines: [HALO], size: 20, run: "done", count: 1, out: ["Halo, kelas!"] });
      LK.cell(ctx, a.x + 14, a.y + 150, a.w - 28, { lines: ["nama = input(", '  "Siapa namamu? ")'], size: 20, run: "ready", active: true });
      text(ctx, "cukup browser dan internet", 1380, 720, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 300, 640, 360, { fill: C.bg2, r: 22 });
      text(ctx, "F11.0", 580, 390, 60, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Jembatan Menuju Pemrograman", 580, 460, 36, 560, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "program halo nama, pesan error", 580, 600, 26, { align: "center", weight: 600, color: C.ink2 });
      const u = ease((l - 1.2) / 0.6); ctx.globalAlpha = u;
      card(ctx, 980, 300, 680, 360, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
      text(ctx, "Di simulasi ini, langsung praktik:", 1010, 350, 26, { weight: 800, color: C.ink2 });
      LK.code(ctx, 1010, 380, INP, { size: 22, w: 620 });
      LK.error(ctx, 1020, 480, 600, { name: "NameError", msg: "name 'nma' is not defined", kind: "runtime", line: 2, ctx: [[2, 'print("Halo, " + nma)']] }, { size: 19 });
      ctx.globalAlpha = 1;
      kiko(ctx, 1660, 720, 100, 0, { wave: l });
    },

    buka_colab(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const typed = LK.typeStr("colab", ph(l, sp, 0.14, 0.3));
      const stage = f < 0.36 ? "blank" : f < 0.6 ? "hasil" : "awal";
      const a = LK.notebook(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { page: "blank", address: stage === "awal" ? "Colab" : typed, addressCaret: f > 0.1 && f < 0.36 ? blinkAt(l) : null });
      const mid = a.x + a.w / 2;
      let target = { x: 700, y: 500 };
      if (stage === "blank") { text(ctx, "Tab baru", mid, a.y + 200, 34, { align: "center", weight: 700, color: "#9AA8B1" }); }
      else if (stage === "hasil") {
        text(ctx, "Hasil pencarian untuk: colab", a.x + 60, a.y + 60, 24, { weight: 700, color: C.ink2 });
        [["Colab", "Menulis dan menjalankan kode Python di browser."], ["Belajar Python untuk Pemula", "Kumpulan materi dasar Python."], ["Contoh Program Python", "Program pendek untuk latihan."]].forEach(([t, s], i) => {
          const y = a.y + 110 + i * 120; const on = i === 0 && f > 0.5;
          if (on) { ctx.fillStyle = "#EEF4FB"; rr(ctx, a.x + 40, y - 10, 760, 100, 12); ctx.fill(); }
          text(ctx, t, a.x + 60, y + 32, 30, { weight: 800, color: "#1A5FA8" }); text(ctx, s, a.x + 60, y + 70, 22, { weight: 500, color: C.ink2 });
        });
        target = { x: a.x + 120, y: a.y + 140 };
      } else {
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(a.x, a.y, a.w, a.h - 16);
        LK.icons.doc(ctx, mid - 230, a.y + 120, 70, C.kiko);
        text(ctx, "Colab", mid - 130, a.y + 180, 64, { weight: 900 });
        text(ctx, "Tulis dan jalankan kode Python di browser.", mid, a.y + 260, 28, { align: "center", weight: 600, color: C.ink2 });
        const lx = a.x + a.w - 190, ly = a.y + 26; const on = f > 0.78;
        ctx.fillStyle = on ? "#155FA6" : BLUE; rr(ctx, lx, ly, 150, 48, 24); ctx.fill(); text(ctx, "Login", lx + 75, ly + 33, 23, { align: "center", weight: 800, color: "#FFFFFF" });
        if (f > 0.82) { card(ctx, mid - 260, a.y + 320, 520, 150, { fill: "#F7F9FA", stroke: "#C9D4DB", lw: 2, r: 16 }); text(ctx, "Login", mid, a.y + 370, 28, { align: "center", weight: 800 });
          text(ctx, "pakai akun belajarmu", mid, a.y + 420, 24, { align: "center", weight: 600, color: C.ink2 }); }
        target = { x: lx + 75, y: ly + 24 };
      }
      LK.steps(ctx, "LANGKAH", ["Buka browser.", "Ketik colab, tekan Enter.", "Pilih Colab.", "Login bila diminta."], stepAt(f, [0.1, 0.36, 0.6, 0.85]));
      keys(ctx, ["Enter"], ph(l, sp, 0.3, 0.4));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 600 }, { at: 0.1, x: a.address.x + 120, y: a.address.y, click: true, kind: "text" }, { at: 0.36, x: a.address.x + 120, y: a.address.y + 60 }, { at: 0.55, x: a.x + 120, y: a.y + 140, click: true }, { at: 0.78, x: a.x + a.w - 115, y: a.y + 50, click: true }]);
    },
    notebook_baru(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const fresh = f > 0.46;
      const a = nb(ctx, { name: fresh ? "Untitled0.ipynb" : "Selamat_Datang.ipynb", status: fresh ? "Hubungkan" : "", menuOn: f > 0.15 && f < 0.46 ? "File" : null });
      if (!fresh) {
        LK.textCell(ctx, cx0(a), a.y + 20, cw0(a), { rendered: true, lines: ["# Selamat datang", "Notebook adalah lembar kerja untuk kode.", "- Klik File → Notebook baru untuk mulai."] });
      } else {
        LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [""], size: SZ, active: true, run: "ready", caret: { line: 0, col: 0 }, blink: blinkAt(l) });
      }
      let m = null;
      if (f > 0.15 && f < 0.46) { const mx = a.menu.File.x0; m = LK.menu(ctx, mx, a.menu.File.y + 20, ["Notebook baru", "Buka notebook|Ctrl+O", "Upload notebook", "-", "Ganti nama", "Simpan salinan", "-", "Download"], { hl: f > 0.3 ? 0 : null, w: 340 }); }
      if (f > 0.55) call(ctx, 460, "Notebook kosong: satu sel kode.", cx0(a) + 400, a.y + 50);
      if (f > 0.7) call(ctx, 580, "Di tampilan bahasa Inggris: File → New notebook.", null, null, { fill: "#E7F1FB", color: BLUE, size: 22 });
      LK.steps(ctx, "LANGKAH", ["Klik menu File.", "Pilih Notebook baru.", "Notebook kosong terbuka."], stepAt(f, [0.15, 0.4, 0.5]));
      const mi = { x: a.menu.File.x0 + 120, y: a.menu.File.y + 20 + 8 + 22 };
      LK.pointer(ctx, l, sp, [{ at: 0, x: 800, y: 600 }, { at: 0.15, x: a.menu.File.x, y: a.menu.File.y, click: true }, { at: 0.38, x: mi.x, y: mi.y, click: true }, { at: 0.6, x: 900, y: 650 }]);
    },
    kenal_notebook(ctx, b, l) {
      const a = nb(ctx, { name: "Untitled0.ipynb", status: "Hubungkan" });
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [""], size: SZ, active: true, run: "ready", minLines: 2 });
      const A = b.audio || b.dur;
      if (l > A * 0.12) { LK.focus(ctx, { x: a.name.x - 90, y: a.name.y - 22, w: 230, h: 44 }, { t: l }); call(ctx, 160, "Nama notebook", a.name.x + 150, a.name.y); }
      if (l > A * 0.35) { LK.focus(ctx, { x: c.x + 72, y: c.y, w: c.w - 72, h: c.codeBottom - c.y }, { t: l, pad: 4 }); call(ctx, 300, "Sel kode: tempat mengetik program", c.x + 700, c.y + 40); }
      if (l > A * 0.62) { LK.focus(ctx, { x: c.play.x - 26, y: c.play.y - 26, w: 52, h: 52 }, { t: l, pad: 4 }); call(ctx, 470, "Tombol ▶ bulat: menjalankan sel", c.play.x + 24, c.play.y); }
    },
    ganti_nama(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const typed = LK.typeStr("Program_Pertama", ph(l, sp, 0.25, 0.58));
      const editing = f > 0.15 && f < 0.66;
      const a = nb(ctx, { name: f >= 0.66 ? "Program_Pertama.ipynb" : "Untitled0.ipynb", status: "Hubungkan", nameEdit: editing ? { text: (f < 0.25 ? "Untitled0" : typed) + ".ipynb", caret: blinkAt(l) } : null });
      if (editing && f < 0.25) { ctx.font = `700 25px ${K.FONT}`; const w = ctx.measureText("Untitled0").width; ctx.fillStyle = "rgba(26,115,200,0.25)"; ctx.fillRect(a.name.x - 72, a.name.y - 18, w + 4, 34); }
      LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [""], size: SZ, active: false, run: "idle", minLines: 2 });
      keys(ctx, ["Enter"], ph(l, sp, 0.6, 0.72));
      if (f > 0.7) call(ctx, 440, "Tersimpan otomatis di akunmu.", a.name.x + 120, a.name.y + 10, { fill: C.goodBg, color: GREEN });
      LK.steps(ctx, "LANGKAH", ["Klik nama Untitled0.", "Ketik Program_Pertama.", "Tekan Enter."], stepAt(f, [0.15, 0.58, 0.68]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 600 }, { at: 0.15, x: a.name.x - 20, y: a.name.y, click: true, kind: "text" }, { at: 0.75, x: a.name.x + 60, y: a.name.y + 120 }]);
    },

    ketik_print(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { status: "Hubungkan" });
      const T = LK.typed([HALO], ph(l, sp, 0.15, 0.72));
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: f < 0.15 ? [""] : T.lines, size: SZ, active: f > 0.1, run: f > 0.1 ? "ready" : "idle", caret: f > 0.1 ? (f < 0.15 ? { line: 0, col: 0 } : T.caret) : null, blink: f < 0.72 || blinkAt(l), minLines: 2,
        boxes: f > 0.78 ? [{ line: 0, from: 6, to: 20, color: C.accent }] : [] });
      if (f > 0.78) { call(ctx, 380, "String: teks di antara tanda kutip", c.code.at(0, 13).x, c.code.top(0) + 4); call(ctx, 520, "print: tampilkan ke output", c.code.at(0, 2).x, c.code.top(0) + c.code.lh - 4, { fill: "#E7F1FB", color: BLUE }); }
      LK.steps(ctx, "LANGKAH", ["Klik di dalam sel.", 'Ketik print("Halo, kelas!")'], stepAt(f, [0.12, 0.74]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 650 }, { at: 0.1, x: c.x + 400, y: c.play.y, click: true, kind: "text" }, { at: 0.2, x: c.x + 420, y: c.play.y + 120 }]);
    },
    jalankan(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { status: f < 0.15 ? "Hubungkan" : f < 0.5 ? "menyambung" : "tersambung" });
      const run = f < 0.06 ? "ready" : f < 0.15 ? "hover" : f < 0.56 ? "running" : "done";
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [HALO], size: SZ, active: true, run, spin: l * 1.2, count: 1, out: run === "done" ? ["Halo, kelas!"] : null, minLines: 2 });
      if (f > 0.2 && f < 0.56) call(ctx, 380, "Pertama kali: beberapa detik untuk tersambung.", a.status.x, a.status.y + 18, { size: 22 });
      if (f > 0.6) { LK.focus(ctx, { x: c.out.y ? c.x + 86 : 0, y: c.out.y + 4, w: 240, h: 34 }, { t: l }); call(ctx, 520, "Output muncul di bawah sel.", c.x + 340, c.out.y + 22, { fill: C.goodBg, color: GREEN }); }
      LK.steps(ctx, "LANGKAH", ["Klik tombol ▶.", "Tunggu tersambung.", "Lihat output di bawah sel."], stepAt(f, [0.15, 0.56, 0.62]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 650 }, { at: 0.15, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.7, x: c.play.x + 30, y: c.play.y + 200 }]);
    },
    shift_enter(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {});
      const run = f < 0.3 ? "done" : f < 0.42 ? "running" : "done";
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [HALO], size: SZ, active: f < 0.42, run, spin: l, count: f < 0.3 ? 1 : 2, out: run === "done" ? ["Halo, kelas!"] : null, caret: f < 0.42 ? { line: 0, col: HALO.length } : null, blink: blinkAt(l) });
      if (f > 0.44) { const c2 = LK.cell(ctx, cx0(a), c.bottom + 18, cw0(a), { lines: [""], size: SZ, active: true, run: "ready", caret: { line: 0, col: 0 }, blink: blinkAt(l) });
        if (f > 0.66) call(ctx, 540, "Sel baru dibuat otomatis.", c2.x + 500, c2.y + 30, { fill: C.goodBg, color: GREEN }); }
      keys(ctx, ["Shift", "Enter"], ph(l, sp, 0.18, 0.4));
      if (f > 0.12) call(ctx, 380, "Shift+Enter: jalankan, lalu pindah ke sel berikutnya.", null, null, { fill: "#E7F1FB", color: BLUE, size: 22 });
      LK.steps(ctx, "CARA CEPAT", ["Tekan Shift+Enter.", "Sel dijalankan.", "Kursor pindah ke sel baru."], stepAt(f, [0.3, 0.42, 0.5]));
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 250, 420 + i * 110, 820, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 296, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 340, 476 + i * 110, 28, { weight: 700, fit: 700 }); });
      const xs = 1120, ys = 400; card(ctx, xs - 20, ys - 60, 580, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Hasil yang dituju", xs, ys - 22, 24, { weight: 900, color: C.ink2 });
      if (b.target === "input") LK.cell(ctx, xs - 10, ys + 10, 560, { lines: ['nama = input(', '  "Siapa namamu? ")', 'print("Halo, " + nama)'], size: 19, run: "done", count: 3, out: [{ k: "in", t: PROMPT, v: "Sinta" }, "Halo, Sinta"] });
      else LK.cell(ctx, xs - 10, ys + 10, 560, { lines: [HALO], size: 22, run: "done", count: 1, out: ["Halo, kelas!"] });
    },

    variabel(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {});
      const c1 = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [HALO], size: SZ, run: "done", count: 2, out: ["Halo, kelas!"] });
      const T = LK.typed(VAR, ph(l, sp, 0.08, 0.75));
      const c = LK.cell(ctx, cx0(a), c1.bottom + 18, cw0(a), { lines: T.lines, size: SZ, active: true, run: "ready", caret: T.caret, blink: f < 0.75 || blinkAt(l), minLines: 2,
        hl: f > 0.06 && f < 0.42 ? [0] : f >= 0.42 ? [1] : [] });
      LK.steps(ctx, "LANGKAH", ['Baris 1: nama = "Sinta"', 'Baris 2: print("Halo, " + nama)'], stepAt(f, [0.4, 0.76]));
      if (T.lines[0] && T.lines[0].length >= VAR[0].length) { // kotak memori
        const y = 360; card(ctx, 1450, y, 370, 190, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "VARIABEL", 1474, y + 40, 22, { weight: 900, color: C.accentDark });
        text(ctx, "nama", 1500, y + 120, 30, { weight: 800, color: C.kiko }); ctx.fillStyle = "#FFF9E0"; rr(ctx, 1610, y + 76, 180, 70, 12); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, 1610, y + 76, 180, 70, 12); ctx.stroke();
        LK.mono(ctx, 26, 700); ctx.fillStyle = LK.T.str; ctx.textAlign = "center"; ctx.fillText('"Sinta"', 1700, y + 121); ctx.textAlign = "left";
      }
      if (f > 0.8) call(ctx, 590, "Isi variabel ikut disambung ke kata Halo.", c.code.at(1, 18).x, c.code.top(1) + c.code.lh, { size: 22 });
    },
    variabel_jalan(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {});
      const c1 = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [HALO], size: SZ, run: "done", count: 2, out: ["Halo, kelas!"] });
      const nmT = f < 0.4 ? "Sinta" : LK.typeStr("Dito", ph(l, sp, 0.42, 0.56));
      const lines = ['nama = "' + nmT + '"', VAR[1]];
      const second = f > 0.72;
      const run = f < 0.12 ? "ready" : f < 0.2 ? "running" : f < 0.62 ? "done" : f < 0.72 ? "ready" : f < 0.78 ? "running" : "done";
      const out = second ? ["Halo, Dito"] : ["Halo, Sinta"];
      const c = LK.cell(ctx, cx0(a), c1.bottom + 18, cw0(a), { lines, size: SZ, active: true, run, spin: l, count: second ? 4 : 3, out: run === "done" ? out : (f > 0.2 && f < 0.72 ? ["Halo, Sinta"] : null),
        caret: f > 0.34 && f < 0.62 ? { line: 0, col: 8 + nmT.length } : null, blink: blinkAt(l), boxes: f > 0.34 && f < 0.42 ? [{ line: 0, from: 8, to: 13, color: BLUE }] : [] });
      if (f > 0.34 && f < 0.42) { ctx.fillStyle = "rgba(26,115,200,0.2)"; const p = c.code.at(0, 8); ctx.fillRect(p.x, c.code.top(0) + 4, 5 * c.code.cw, c.code.lh - 8); }
      // kotak memori
      const y = 400; card(ctx, 1450, y, 370, 190, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "VARIABEL", 1474, y + 40, 22, { weight: 900, color: C.accentDark });
      text(ctx, "nama", 1500, y + 120, 30, { weight: 800, color: C.kiko }); ctx.fillStyle = second ? C.goodBg : "#FFF9E0"; rr(ctx, 1610, y + 76, 180, 70, 12); ctx.fill(); ctx.strokeStyle = second ? GREEN : C.accent; ctx.lineWidth = 3; rr(ctx, 1610, y + 76, 180, 70, 12); ctx.stroke();
      LK.mono(ctx, 26, 700); ctx.fillStyle = LK.T.str; ctx.textAlign = "center"; ctx.fillText(f > 0.72 ? '"Dito"' : '"Sinta"', 1700, y + 121); ctx.textAlign = "left";
      LK.steps(ctx, "LANGKAH", ["Jalankan: Halo, Sinta.", 'Ganti "Sinta" menjadi "Dito".', "Jalankan lagi: Halo, Dito."], stepAt(f, [0.22, 0.58, 0.8]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 800, y: 700 }, { at: 0.12, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.34, x: c.code.at(0, 11).x, y: c.code.at(0, 11).y + 6, click: true, kind: "text" }, { at: 0.72, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.9, x: c.play.x + 40, y: c.play.y + 200 }]);
    },
    input_ketik(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {});
      const c1 = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [HALO], size: SZ, run: "done", count: 2, out: ["Halo, kelas!"] });
      const add = 'input("Siapa namamu? ")';
      const typed = LK.typeStr(add, ph(l, sp, 0.25, 0.75));
      const l0 = f < 0.25 ? 'nama = "Dito"' : "nama = " + typed;
      const c = LK.cell(ctx, cx0(a), c1.bottom + 18, cw0(a), { lines: [l0, VAR[1]], size: SZ, active: true, run: "ready", caret: f > 0.12 ? { line: 0, col: f < 0.25 ? 7 : 7 + typed.length } : null, blink: f < 0.75 || blinkAt(l),
        boxes: f > 0.8 ? [{ line: 0, from: 7, to: 12, color: BLUE }, { line: 0, from: 13, to: 29, color: C.accent }] : [] });
      if (f > 0.12 && f < 0.25) { ctx.fillStyle = "rgba(26,115,200,0.2)"; const p = c.code.at(0, 7); ctx.fillRect(p.x, c.code.top(0) + 4, 6 * c.code.cw, c.code.lh - 8); }
      if (f > 0.8) { call(ctx, 420, "input( ): program bertanya", c.code.at(0, 9).x, c.code.top(0) + 4, { fill: "#E7F1FB", color: BLUE }); call(ctx, 540, "Pertanyaan yang tampil", c.code.at(0, 21).x, c.code.top(0) + c.code.lh - 4); }
      LK.steps(ctx, "LANGKAH", ['Pilih "Dito" di baris 1.', 'Ketik input("Siapa namamu? ")'], stepAt(f, [0.25, 0.76]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 700 }, { at: 0.12, x: c.code.at(0, 12).x, y: c.code.at(0, 12).y + 6, click: true, kind: "text" }, { at: 0.3, x: c.code.at(0, 14).x, y: c.code.at(0, 14).y + 90 }]);
    },
    input_jalan(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {});
      const c1 = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: [HALO], size: SZ, run: "done", count: 2, out: ["Halo, kelas!"] });
      const v = LK.typeStr("Sinta", ph(l, sp, 0.36, 0.54));
      const answered = f > 0.62;
      const out = f < 0.14 ? null : answered ? [{ k: "in", t: PROMPT, v: "Sinta" }, "Halo, Sinta"] : [{ k: "in", t: PROMPT, v, active: true, caret: blinkAt(l) || f < 0.56 }];
      const c = LK.cell(ctx, cx0(a), c1.bottom + 18, cw0(a), { lines: INP, size: SZ, active: true, run: f < 0.08 ? "ready" : answered ? "done" : "running", spin: l, count: 5, out });
      if (f > 0.18 && f < 0.62 && c.out && c.out.input) { const ib = c.out.input; LK.focus(ctx, ib, { t: l, pad: 4 }); call(ctx, 400, "Program menunggu jawabanmu.", ib.x + ib.w, ib.y + ib.h / 2); }
      if (answered) call(ctx, 520, "Jawaban disimpan di variabel nama.", c.x + 360, c.out.lines[1] - 8, { fill: C.goodBg, color: GREEN, size: 22 });
      keys(ctx, ["Enter"], ph(l, sp, 0.56, 0.66));
      LK.steps(ctx, "LANGKAH", ["Jalankan sel.", "Klik kotak isian.", "Ketik Sinta, tekan Enter."], stepAt(f, [0.1, 0.32, 0.64]));
      const ib = { x: c.x + 72 + 16 + PROMPT.length * LK.mono(ctx, SZ * 0.92) + 60, y: c.codeBottom + 30 };
      LK.pointer(ctx, l, sp, [{ at: 0, x: 800, y: 720 }, { at: 0.08, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.32, x: ib.x, y: ib.y, click: true, kind: "text" }, { at: 0.7, x: ib.x + 60, y: ib.y + 150 }]);
    },

    error_nama(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { compact: true });
      const bad = f > 0.22;
      const lines = [INP[0], bad ? 'print("Halo, " + nma)' : (f > 0.12 ? 'print("Halo, " + nama)' : INP[1])];
      const v = LK.typeStr("Sinta", ph(l, sp, 0.46, 0.56));
      const run = f < 0.36 ? (f > 0.1 ? "ready" : "done") : f < 0.62 ? "running" : "done";
      const out = f < 0.36 ? [{ k: "in", t: PROMPT, v: "Sinta" }, "Halo, Sinta"] : f < 0.42 ? null : f < 0.62 ? [{ k: "in", t: PROMPT, v, active: true, caret: true }] : [{ k: "in", t: PROMPT, v: "Sinta" }, { err: ERR_NAME }];
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines, size: SZ, active: true, run, spin: l, count: f < 0.36 ? 5 : 6, out,
        caret: f > 0.1 && f < 0.36 ? { line: 1, col: bad ? 18 : 18 } : null, blink: blinkAt(l), boxes: f > 0.22 ? [{ line: 1, from: 17, to: 20, color: LK.T.errInk }] : [] });
      if (f > 0.22 && f < 0.6) call(ctx, 380, "nama → nma (salah ketik)", c.code.at(1, 20).x, c.code.top(1) + 6, { fill: "#FDECEA", color: LK.T.errInk, ink: LK.T.errInk });
      if (f > 0.66 && c.out && c.out.err) call(ctx, 520, "Kotak merah = pesan error", c.x + 900, c.out.err.y + 30, { fill: "#FDECEA", color: LK.T.errInk });
      keys(ctx, ["Enter"], ph(l, sp, 0.56, 0.64));
      LK.steps(ctx, "LANGKAH", ["Ubah nama menjadi nma.", "Jalankan sel.", "Muncul pesan error."], stepAt(f, [0.24, 0.62, 0.66]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 700 }, { at: 0.1, x: c.code.at(1, 18).x, y: c.code.at(1, 18).y + 6, click: true, kind: "text" }, { at: 0.36, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.6, x: c.play.x + 30, y: c.play.y + 380 }]);
    },
    baca_error(ctx, b, l) {
      const a = nb(ctx, { compact: true }); const A = b.audio || b.dur;
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: [INP[0], 'print("Halo, " + nma)'], size: SZ, active: true, run: "done", count: 6, out: [{ k: "in", t: PROMPT, v: "Sinta" }, { err: ERR_NAME }] });
      const e = c.out.err;
      if (l > A * 0.1) { LK.focus(ctx, e.lastBox, { t: l }); call(ctx, e.lastBox.y - 40, "1. Baris terakhir: NameError, nama nma tidak dikenal.", e.lastBox.x + e.lastBox.w + 6, e.lastBox.y + e.lastBox.h / 2); }
      if (l > A * 0.56) { LK.focus(ctx, e.arrowBox, { t: l + 1 }); call(ctx, e.arrowBox.y - 120, "2. Tanda panah menunjuk baris 2.", e.arrowBox.x + e.arrowBox.w + 6, e.arrowBox.y + e.arrowBox.h / 2, { fill: "#E7F1FB", color: BLUE }); }
      if (l > A * 0.8) call(ctx, 160, "Di komputer, Python kadang menambah saran: Did you mean: 'nama'?", null, null, { fill: "#F4F6F5", color: "#9AAFA6", size: 20 });
    },
    perbaiki_nama(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { compact: true });
      const fixed = f > 0.16;
      const v = LK.typeStr("Sinta", ph(l, sp, 0.34, 0.44));
      const run = f < 0.26 ? "done" : f < 0.5 ? "running" : "done";
      const out = f < 0.26 ? [{ k: "in", t: PROMPT, v: "Sinta" }, { err: ERR_NAME }] : f < 0.3 ? null : f < 0.5 ? [{ k: "in", t: PROMPT, v, active: true, caret: true }] : [{ k: "in", t: PROMPT, v: "Sinta" }, "Halo, Sinta"];
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: [INP[0], fixed ? INP[1] : 'print("Halo, " + nma)'], size: SZ, active: true, run, spin: l, count: f < 0.26 ? 6 : 7, out,
        caret: f > 0.08 && f < 0.26 ? { line: 1, col: fixed ? 19 : 18 } : null, blink: blinkAt(l), boxes: f > 0.16 && f < 0.3 ? [{ line: 1, from: 17, to: 21, color: GREEN }] : [] });
      keys(ctx, ["Enter"], ph(l, sp, 0.44, 0.5));
      if (f > 0.52) call(ctx, 380, "Kotak merah hilang. Program berjalan.", c.x + 360, c.out.lines[1] - 8, { fill: C.goodBg, color: GREEN, size: 22 });
      if (f > 0.64) { const y = 520; card(ctx, 1450, y, 370, 230, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "HURUF BESAR-KECIL", 1474, y + 40, 22, { weight: 900, color: C.accentDark });
        LK.mono(ctx, 34, 700); ctx.fillStyle = C.ink; ctx.fillText("nama", 1490, y + 110); ctx.fillText("Nama", 1490, y + 180); ctx.fillStyle = LK.T.ok; ctx.textAlign = "left";
        text(ctx, "variabel kita", 1610, y + 106, 22, { weight: 700, color: GREEN }); text(ctx, "nama lain!", 1610, y + 176, 22, { weight: 800, color: LK.T.errInk }); }
      LK.steps(ctx, "LANGKAH", ["Perbaiki nma menjadi nama.", "Jalankan lagi."], stepAt(f, [0.2, 0.52]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 700 }, { at: 0.08, x: c.code.at(1, 18).x, y: c.code.at(1, 18).y + 6, click: true, kind: "text" }, { at: 0.26, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.48, x: c.play.x + 30, y: c.play.y + 330 }]);
    },
    error_kutip(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { compact: true });
      const T = LK.typed([ERR_KUTIP.code], ph(l, sp, 0.05, 0.36));
      const run = f < 0.44 ? "ready" : f < 0.5 ? "running" : "done";
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: T.lines, size: SZ, active: true, run, spin: l, count: 8, out: run === "done" ? [{ err: ERR_KUTIP }] : null, caret: f < 0.44 ? T.caret : null, blink: blinkAt(l), minLines: 2,
        boxes: f > 0.36 && f < 0.5 ? [{ line: 0, from: 19, to: 20, color: LK.T.errInk }] : [] });
      if (f > 0.36 && f < 0.52) call(ctx, 380, 'Tanda kutip penutup " terlupa', c.code.at(0, 20).x, c.code.top(0) + 6, { fill: "#FDECEA", color: LK.T.errInk });
      if (f > 0.54 && c.out) { const e = c.out.err; LK.focus(ctx, e.lastNameBox, { t: l }); call(ctx, 400, "SyntaxError: penulisan tidak sesuai aturan Python.", e.lastNameBox.x + e.lastNameBox.w, e.lastNameBox.y + 16, { size: 22 }); }
      LK.steps(ctx, "LANGKAH", ['Ketik print("Halo, kelas!)', "Jalankan sel."], stepAt(f, [0.38, 0.5]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 700 }, { at: 0.44, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.62, x: c.play.x + 40, y: c.play.y + 330 }]);
    },
    baca_syntax(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { compact: true });
      const fixed = f > 0.72;
      const run = f < 0.78 ? "done" : f < 0.84 ? "running" : "done";
      const out = f < 0.78 ? [{ err: ERR_KUTIP }] : f < 0.84 ? null : ["Halo, kelas!"];
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: [fixed ? HALO : ERR_KUTIP.code], size: SZ, active: true, run, spin: l, count: f < 0.78 ? 8 : 9, out, minLines: 2,
        caret: f > 0.66 && f < 0.78 ? { line: 0, col: fixed ? 20 : 19 } : null, blink: blinkAt(l), boxes: f > 0.72 && f < 0.84 ? [{ line: 0, from: 19, to: 20, color: GREEN }] : [] });
      if (f < 0.78 && c.out) { const e = c.out.err;
        if (f > 0.06) { LK.focus(ctx, e.lineBox, { t: l }); call(ctx, 160, "1. line 1 = baris satu", e.lineBox.x + e.lineBox.w, e.lineBox.y + 16); }
        if (f > 0.26) { LK.focus(ctx, { x: e.codeBox.x, y: e.codeBox.y, w: e.codeBox.w, h: e.codeBox.h * 2 }, { t: l + 1, color: BLUE }); call(ctx, 300, "2. Tanda ^ menunjuk awal string.", e.codeBox.x + e.codeBox.w, e.codeBox.y + 30, { fill: "#E7F1FB", color: BLUE }); }
        if (f > 0.46) { LK.focus(ctx, e.lastBox, { t: l + 2 }); call(ctx, 440, "3. Artinya: string tidak ditutup.", e.lastBox.x + Math.min(e.lastBox.w, 900), e.lastBox.y + 16); } }
      if (f > 0.86) call(ctx, 580, "Benar: Halo, kelas!", c.x + 330, c.out.lines[0] - 8, { fill: C.goodBg, color: GREEN });
      if (f > 0.66 && f < 0.86) call(ctx, 580, '4. Tambah " lalu jalankan lagi.', null, null, { fill: C.goodBg, color: GREEN });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 1000, y: 700 }, { at: 0.66, x: c.code.at(0, 19).x, y: c.code.at(0, 19).y + 6, click: true, kind: "text" }, { at: 0.78, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.95, x: c.play.x + 40, y: c.play.y + 300 }]);
    },
    error_kurung(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { compact: true });
      const T = LK.typed([ERR_KURUNG.code], ph(l, sp, 0.04, 0.24));
      const fixed = f > 0.66;
      const run = f < 0.28 ? "ready" : f < 0.34 ? "running" : f < 0.74 ? "done" : f < 0.8 ? "running" : "done";
      const out = f < 0.34 ? null : f < 0.74 ? [{ err: ERR_KURUNG }] : f < 0.8 ? null : ["Halo, kelas!"];
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: fixed ? [HALO] : T.lines, size: SZ, active: true, run, spin: l, count: f < 0.74 ? 10 : 11, out, minLines: 2,
        caret: f < 0.28 ? T.caret : (f > 0.6 && f < 0.74 ? { line: 0, col: fixed ? 21 : 20 } : null), blink: blinkAt(l), boxes: fixed && f < 0.8 ? [{ line: 0, from: 20, to: 21, color: GREEN }] : [] });
      if (out && out[0].err && c.out) { const e = c.out.err; if (f > 0.4) { LK.focus(ctx, e.lastBox, { t: l }); call(ctx, 400, "'(' was never closed: kurung buka tidak pernah ditutup.", e.lastBox.x + e.lastBox.w, e.lastBox.y + 16, { size: 22 }); } }
      if (f > 0.82) call(ctx, 560, "Benar: Halo, kelas!", c.x + 330, c.out.lines[0] - 8, { fill: C.goodBg, color: GREEN });
      LK.steps(ctx, "LANGKAH", ['Ketik print("Halo, kelas!"', "Jalankan: SyntaxError.", "Tambah ) di akhir baris.", "Jalankan lagi."], stepAt(f, [0.26, 0.4, 0.7, 0.82]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 700 }, { at: 0.28, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.6, x: c.code.at(0, 20).x + 6, y: c.code.at(0, 20).y + 6, click: true, kind: "text" }, { at: 0.74, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.92, x: c.play.x + 40, y: c.play.y + 300 }]);
    },
    tiga_langkah(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "SETIAP KALI ADA ERROR", 960, 215, 34, { align: "center", weight: 900, color: C.accentDark });
      const e = LK.error(ctx, 290, 260, 820, ERR_NAME, { size: 22 });
      const A = b.audio || b.dur;
      const items = [["Baca nama error di baris terakhir.", e.lastBox], ["Lihat nomor barisnya.", e.arrowBox], ["Perbaiki baris itu, lalu jalankan lagi.", null]];
      items.forEach(([s, box], i) => {
        const on = l > A * (0.18 + i * 0.24); if (!on) return;
        const y = 540 + i * 86; card(ctx, 290, y, 1340, 72, { fill: i === 2 ? C.goodBg : "#FFF3D6", r: 14 });
        ctx.fillStyle = i === 2 ? GREEN : C.accent; ctx.beginPath(); ctx.arc(330, y + 36, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 330, y + 46, 28, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, s, 375, y + 47, 30, { weight: 800 });
        if (box) { LK.focus(ctx, box, { pad: 4 }); text(ctx, String(i + 1), box.x + box.w + 24, box.y + box.h / 2 + 12, 34, { weight: 900, color: C.accentDark }); }
      });
      kiko(ctx, 1500, 380, 120, 0, { mood: "happy" });
    },

    idle_buka(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const sh = LK.terminal(ctx, 110, 122, 1300, 700, { theme: "light", title: "IDLE Shell", menus: ["File", "Edit", "Shell", "Debug", "Options", "Window", "Help"], size: 22,
        lines: [{ k: "out", t: "Python 3.13.1 on win32" }, { k: "note", t: 'Type "help", "copyright", "credits" or "license()" for more information.' }], caret: true, blink: blinkAt(l) });
      if (f > 0.18 && f < 0.52) { const m = LK.menu(ctx, 128, 208, ["New File|Ctrl+N", "Open...|Ctrl+O", "Recent Files", "-", "Save|Ctrl+S", "Save As...", "-", "Close Window", "Exit"], { hl: f > 0.32 ? 0 : null, w: 330 }); ctx.fillStyle = "#DCE9F7"; }
      if (f > 0.18 && f < 0.52) { ctx.fillStyle = "rgba(26,95,168,0.12)"; rr(ctx, 128, 172, 62, 32, 6); ctx.fill(); }
      if (f > 0.52) { const e = L.window(ctx, 330, 230, 1000, 560, { title: "untitled — Editor Python", menus: ["File", "Edit", "Format", "Run", "Options", "Window", "Help"] });
        LK.code(ctx, e.x + 20, e.y + 16, [""], { size: 24, nums: false, caret: { line: 0, col: 0 }, blink: blinkAt(l) });
        call(ctx, 460, "Jendela editor kosong", 1100, 500); }
      call(ctx, 600, "Di komputer lab tanpa internet, pakai IDLE.", null, null, { fill: "#E7F1FB", color: BLUE, size: 22 });
      LK.steps(ctx, "LANGKAH", ["Buka IDLE.", "Klik File → New File.", "Jendela editor terbuka."], stepAt(f, [0.15, 0.48, 0.56]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 600 }, { at: 0.18, x: 158, y: 190, click: true }, { at: 0.46, x: 240, y: 238, click: true }, { at: 0.7, x: 700, y: 650 }]);
    },
    idle_run(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const T = LK.typed(INP, ph(l, sp, 0.02, 0.2));
      const saved = f > 0.42;
      const shellFront = f > 0.7;
      const shellLines = [{ k: "out", t: "Python 3.13.1 on win32" }, { k: "cmd", t: "" }];
      if (shellFront) { shellLines.push({ k: "note", t: "= RESTART: C:\\Tugas\\halo.py" }); const v = LK.typeStr("Sinta", ph(l, sp, 0.74, 0.84)); shellLines.push({ k: "out", t: PROMPT + v });
        if (f > 0.86) shellLines.push({ k: "out", t: "Halo, Sinta" }); }
      const drawShell = () => LK.terminal(ctx, 110, 122, 1180, 600, { theme: "light", title: "IDLE Shell", menus: ["File", "Edit", "Shell", "Debug", "Options", "Window", "Help"], size: 22, lines: shellLines, caret: shellFront && f > 0.86, blink: blinkAt(l) });
      const drawEd = () => { const e = L.window(ctx, 330, 210, 1060, 600, { title: (saved ? "halo.py" : "untitled") + " — Editor Python", menus: ["File", "Edit", "Format", "Run", "Options", "Window", "Help"], menuOn: f > 0.24 && f < 0.42 ? "File" : f > 0.48 && f < 0.68 ? "Run" : null });
        LK.code(ctx, e.x + 20, e.y + 16, T.lines, { size: 24, nums: false, caret: f < 0.24 ? T.caret : null, blink: blinkAt(l) }); return e; };
      if (shellFront) { drawEd(); drawShell(); } else { drawShell(); drawEd(); }
      if (f > 0.24 && f < 0.32) LK.menu(ctx, 350, 296, ["New File|Ctrl+N", "Open...|Ctrl+O", "-", "Save|Ctrl+S", "Save As..."], { hl: f > 0.27 ? 3 : null, w: 330 });
      if (f > 0.32 && f < 0.44) { card(ctx, 520, 380, 620, 220, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 14 }); text(ctx, "Save As", 550, 425, 26, { weight: 800 });
        text(ctx, "File name:", 550, 485, 22, { weight: 700, color: C.ink2 }); card(ctx, 680, 455, 420, 46, { fill: "#FFFFFF", stroke: BLUE, lw: 2, r: 6 }); LK.mono(ctx, 22); ctx.fillStyle = C.ink; ctx.fillText(LK.typeStr("halo.py", ph(l, sp, 0.33, 0.39)), 694, 486);
        card(ctx, 960, 530, 140, 46, { fill: BLUE, r: 8 }); text(ctx, "Save", 1030, 561, 22, { align: "center", weight: 800, color: "#FFFFFF" }); }
      if (f > 0.5 && f < 0.68) { const rx = 330 + 24 + 4 * 76; LK.menu(ctx, 560, 296, ["Run Module|F5", "Run... Customized|Shift+F5", "Check Module|Alt+X", "Python Shell"], { hl: f > 0.56 ? 0 : null, w: 400 }); }
      keys(ctx, ["F5"], ph(l, sp, 0.58, 0.7));
      if (f > 0.88) call(ctx, 560, "Output muncul di jendela Shell.", 330, 372, { fill: C.goodBg, color: GREEN });
      LK.steps(ctx, "LANGKAH", ["Ketik program.", "File → Save: halo.py.", "Run → Run Module (F5).", "Lihat output di Shell."], stepAt(f, [0.22, 0.44, 0.7, 0.88]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 650 }, { at: 0.24, x: 375, y: 278, click: true }, { at: 0.28, x: 430, y: 380, click: true }, { at: 0.41, x: 1030, y: 553, click: true }, { at: 0.5, x: 610, y: 278, click: true }, { at: 0.6, x: 680, y: 328, click: true }, { at: 0.8, x: 900, y: 650 }]);
    },

    periksa(ctx, b, l) {
      const a = nb(ctx, { compact: true }); const A = b.audio || b.dur;
      const c1 = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: [HALO], size: SZ, run: "done", count: 1, out: ["Halo, kelas!"] });
      LK.cell(ctx, cx0(a), c1.bottom + 24, cw0(a), { lines: INP, size: SZ, run: "done", count: 2, out: [{ k: "in", t: PROMPT, v: "Sinta" }, "Halo, Sinta"] });
      const items = ["Halo, kelas! tanpa tanda kutip", "Bertanya: Siapa namamu?", "Membalas dengan namamu"];
      card(ctx, 1450, 150, 370, 120 + items.length * 100, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", 1635, 200, 24, { align: "center", weight: 900, color: C.accentDark });
      items.forEach((s, i) => { const on = l > A * (0.15 + i * 0.22); const y = 230 + i * 100;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 1470, y, 330, 84, 12); ctx.fill();
        para(ctx, s, 1490, y + 36, 22, 250, { weight: 700, lh: 1.2 }); if (on) text(ctx, "✓", 1780, y + 54, 34, { align: "right", weight: 900, color: GREEN }); });
    },
    masalah_tunggu(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, { compact: true });
      const v = LK.typeStr("Sinta", ph(l, sp, 0.55, 0.68));
      const ans = f > 0.76;
      const c1 = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: INP, size: SZ, run: ans ? "done" : "running", spin: l, count: 3, active: !ans, out: ans ? [{ k: "in", t: PROMPT, v: "Sinta" }, "Halo, Sinta"] : [{ k: "in", t: PROMPT, v, active: true, caret: blinkAt(l) }] });
      const c2 = LK.cell(ctx, cx0(a), c1.bottom + 24, cw0(a), { lines: [HALO], size: SZ, run: f > 0.82 ? "done" : "idle", count: 4, active: ans, out: f > 0.84 ? ["Halo, kelas!"] : null });
      if (!ans) { text(ctx, "menunggu giliran…", c2.x + c2.w - 24, c2.y + 36, 20, { align: "right", weight: 700, color: "#9AA8B1" });
        LK.focus(ctx, { x: c1.play.x - 26, y: c1.play.y - 26, w: 52, h: 52 }, { t: l, pad: 3, color: LK.T.errInk });
        call(ctx, 160, "Tombol terus berputar: program menunggu input.", c1.play.x + 30, c1.play.y, { fill: "#FDECEA", color: LK.T.errInk, size: 22 }); }
      if (f > 0.3 && !ans && c1.out.input) { LK.focus(ctx, c1.out.input, { t: l, pad: 4 }); call(ctx, 380, "Isi kotak ini, lalu tekan Enter.", c1.out.input.x + c1.out.input.w, c1.out.input.y + 18); }
      if (f > 0.86) call(ctx, 520, "Sel berikutnya ikut berjalan.", c2.x + 330, c2.out ? c2.out.lines[0] - 8 : c2.y + 40, { fill: C.goodBg, color: GREEN });
      keys(ctx, ["Enter"], ph(l, sp, 0.68, 0.78));
      const ib = c1.out && c1.out.input ? c1.out.input : { x: 700, y: 400, w: 100, h: 30 };
      LK.pointer(ctx, l, sp, [{ at: 0, x: 1000, y: 700 }, { at: 0.5, x: ib.x + 40, y: ib.y + 16, click: true, kind: "text" }, { at: 0.8, x: ib.x + 100, y: ib.y + 200 }]);
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.0", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "pelacak Python mini", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f110", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "jalankan baris demi baris, tebak isi variabel", 620, 600, 24, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Ubah program halo nama supaya juga menanyakan kelasmu, lalu tampilkan keduanya.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      LK.code(ctx, 1080, 560, ['kelas = input("Kelas? ")'], { size: 22, nums: false, w: 460 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
