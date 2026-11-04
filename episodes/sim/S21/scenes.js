/* S21 Simulasi praktik: program kas kelas dengan Python (input, if-elif-else, while, kasus uji) di notebook generik.
   Bagian 2–3: jendela notebook lebar (x 110–1410) + panel langkah kanan. Bagian 4: jendela sempit (x 110–1110) + tabel kasus uji kanan.
   Semua kode sudah diuji dengan python3; output persis sama. Data dan tokoh rekaan. Muat setelah kiko-core.js, layar.js, layar_kode.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, LK = K.layarKode;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 }, WIN2 = { x: 110, y: 122, w: 1000, h: 700 };
  const BLUE = "#1A73C8", GREEN = C.good, RED = LK.T.errInk;
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const ph = LK.phase;
  const blinkAt = l => Math.floor(l * 2.2) % 2 === 0;
  const stepAt = (f, marks) => { let n = 0; marks.forEach((m, i) => { if (f >= m) n = i + 1; }); return n; };

  // ---------- program (diuji dengan python3) ----------
  const K1 = ['saldo = 50000', 'jumlah = int(input("Jumlah pengeluaran: "))', 'if jumlah <= saldo:', '    saldo = saldo - jumlah', '    print("Berhasil. Saldo:", saldo)', 'else:', '    print("Ditolak: saldo tidak cukup.")'];
  const K2 = ['saldo = 50000', 'jawaban = "ya"', 'while jawaban == "ya":'].concat(K1.slice(1).map(s => "    " + s), ['    jawaban = input("Lagi? (ya/tidak) ")', 'print("Saldo akhir:", saldo)']);
  const FIX = ['    if jumlah <= 0:', '        print("Ditolak: jumlah harus lebih dari nol.")'];
  const K3 = K2.slice(0, 4).concat(FIX, ['    elif jumlah <= saldo:'], K2.slice(5));
  const PJ = "Jumlah pengeluaran: ", PL = "Lagi? (ya/tidak) ";
  // kasus uji: input, hasil versi lama (K2), hasil versi baru (K3)
  const CASES = [
    { jenis: "normal", inp: "20000", exp: "Berhasil. Saldo: 30000", v1: ["Berhasil. Saldo: 30000", "Saldo akhir: 30000"], ok1: true, v2: ["Berhasil. Saldo: 30000", "Saldo akhir: 30000"], ok2: true },
    { jenis: "batas", inp: "50000", exp: "Berhasil. Saldo: 0", v1: ["Berhasil. Saldo: 0", "Saldo akhir: 0"], ok1: true, v2: ["Berhasil. Saldo: 0", "Saldo akhir: 0"], ok2: true },
    { jenis: "batas", inp: "0", exp: "Ditolak", v1: ["Berhasil. Saldo: 50000", "Saldo akhir: 50000"], ok1: false, v2: ["Ditolak: jumlah harus lebih dari nol.", "Saldo akhir: 50000"], ok2: true },
    { jenis: "salah", inp: "-5000", exp: "Ditolak", v1: ["Berhasil. Saldo: 55000", "Saldo akhir: 55000"], ok1: false, v2: ["Ditolak: jumlah harus lebih dari nol.", "Saldo akhir: 50000"], ok2: true },
    { jenis: "salah", inp: "lima", exp: "Ditolak dengan pesan ramah", v2err: true, ok2: false }];
  const ERR_VAL = { name: "ValueError", msg: "invalid literal for int() with base 10: 'lima'", kind: "runtime", line: 4, ctx: [[3, K3[2]], [4, K3[3]], [5, K3[4]]] };

  // ---------- bingkai dan pembantu ----------
  const nb = (ctx, opt = {}, win = WIN) => LK.notebook(ctx, win.x, win.y, win.w, win.h, { name: "Kas_Kelas.ipynb", status: "tersambung", compact: true, ...opt });
  const cx0 = a => a.x + 20, cw0 = a => a.w - 40;
  function keys(ctx, k, u, x = 1635, y = 720) { if (u > 0 && u < 1) L.keys(ctx, x, y, k, { press: u, align: "center", size: 30 }); }
  function call(ctx, y, s, tx, ty, opt = {}) { return L.callout(ctx, opt.x || 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt }); }
  // sesi input/output: langkah [{p: prompt, v: jawaban, t0, t1} | {o: teks} | {err}] -> {out, done, enterU}
  function sesi(f, steps) {
    const out = []; let enterU = 0;
    for (const s of steps) {
      if (s.p != null) {
        if (f < s.t0) { out.push({ k: "in", t: s.p, v: "", active: true }); return { out, done: false, enterU }; }
        if (f < s.t1) { out.push({ k: "in", t: s.p, v: LK.typeStr(s.v, (f - s.t0) / (s.t1 - s.t0 - 0.03)), active: true }); enterU = clamp((f - (s.t1 - 0.04)) / 0.08, 0, 1); return { out, done: false, enterU }; }
        out.push({ k: "in", t: s.p, v: s.v }); const ue = (f - (s.t1 - 0.04)) / 0.08; if (ue < 1) enterU = clamp(ue, 0, 1);
      } else if (s.err) out.push({ err: s.err }); else out.push(s.o);
    }
    return { out, done: true, enterU };
  }
  function caseSteps(c, t0, t1, v2) { const m = t0 + (t1 - t0) * 0.55;
    if (v2 && c.v2err) return [{ p: PJ, v: c.inp, t0, t1: m }, { err: ERR_VAL }];
    const r = v2 ? c.v2 : c.v1; return [{ p: PJ, v: c.inp, t0, t1: m }, { o: r[0] }, { p: PL, v: "tidak", t0: m + 0.02, t1 }, { o: r[1] }]; }
  // tabel kasus uji di kanan (x 1140–1820). st: {n: baris tampil, exp: baris dengan harapan tampil, res: [{t, ok}|null], hl: baris disorot}
  function tabel(ctx, st, y0 = 122) {
    const x = 1140, w = 680, cols = [36, 84, 96, 196, 228], hdr = ["#", "Jenis", "Input", "Diharapkan", "Hasil"], rh = 74;
    card(ctx, x, y0, w, 70 + 5 * rh + 14, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
    text(ctx, "TABEL KASUS UJI", x + 22, y0 + 36, 22, { weight: 900, color: C.accentDark });
    let cx = x + 10; const hy = y0 + 52; ctx.fillStyle = "#EEF2F5"; ctx.fillRect(x + 10, hy, w - 20, 30);
    hdr.forEach((h, i) => { text(ctx, h, cx + 8, hy + 22, 17, { weight: 800, color: C.ink2 }); cx += cols[i]; });
    CASES.forEach((c, i) => {
      if (i >= (st.n == null ? 5 : st.n)) return; const ry = hy + 30 + i * rh;
      const r = st.res && st.res[i];
      if (st.hl === i) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 10, ry, w - 20, rh); }
      else if (r) { ctx.fillStyle = r.ok ? "#EFF8F2" : "#FDF0EF"; ctx.fillRect(x + 10, ry, w - 20, rh); }
      ctx.fillStyle = "#E4EAEE"; ctx.fillRect(x + 10, ry + rh - 1.5, w - 20, 1.5);
      let px = x + 10; const mid = ry + rh / 2 + 7;
      text(ctx, String(i + 1), px + 12, mid, 19, { weight: 800 }); px += cols[0];
      const jc = { normal: GREEN, batas: "#B57A12", salah: RED }[c.jenis]; text(ctx, c.jenis, px + 8, mid, 18, { weight: 800, color: jc }); px += cols[1];
      LK.mono(ctx, 18, 700); ctx.fillStyle = LK.T.bi; ctx.textAlign = "left"; ctx.fillText(c.inp, px + 8, mid); px += cols[2];
      if (st.exp == null || i < st.exp) { ctx.font = `700 18px ${K.FONT}`; const ls = H.wrap(ctx, c.exp, 18, 700, cols[3] - 16); ls.forEach((s, k) => text(ctx, s, px + 8, mid - (ls.length - 1) * 11 + k * 22, 18, { weight: 700 })); }
      px += cols[3];
      if (r) { ctx.font = `700 17px ${K.FONT}`; const ls = H.wrap(ctx, r.t, 17, 700, cols[4] - 52); ls.forEach((s, k) => text(ctx, s, px + 6, mid - (ls.length - 1) * 10 + k * 21, 17, { weight: 700, color: r.ok ? C.ink : RED }));
        text(ctx, r.ok ? "✓" : "✗", x + w - 22, mid + 3, 28, { align: "right", weight: 900, color: r.ok ? GREEN : RED }); }
    });
    return hy + 30 + 5 * rh + 14;
  }
  // sel yang digulir supaya bagian bawahnya (output) tetap terlihat di dalam jendela
  function cellFit(ctx, a, opt) {
    const y0 = a.y + 16, h = LK.cellHeight(ctx, cw0(a), opt), off = Math.max(0, y0 + h - (a.y + a.h - 14));
    let g; LK.clip(ctx, { x: a.x, y: a.y, w: a.w, h: a.h - 6 }, () => { g = LK.cell(ctx, cx0(a), y0 - off, cw0(a), opt); }); return g;
  }
  const res1 = i => ({ t: CASES[i].v1[0], ok: CASES[i].ok1 });
  const res2 = i => CASES[i].v2err ? { t: "ValueError, program berhenti", ok: false } : ({ t: CASES[i].v2[0], ok: CASES[i].ok2 });

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["membaca angka dengan input dan int", "memilih jalan dengan if dan else", "mengulang transaksi dengan while", "menguji: normal, batas, salah"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 31, { weight: 800 }); ctx.globalAlpha = 1;
      });
      card(ctx, 1100, 290, 560, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Kas kelas XI-2", 1380, 350, 30, { align: "center", weight: 900 });
      [["Saldo awal", "50.000"], ["Beli spidol", "− 20.000"], ["Saldo", "30.000"]].forEach(([k, v], i) => { const y = 410 + i * 70; text(ctx, k, 1150, y, 28, { weight: i === 2 ? 900 : 700 }); text(ctx, v, 1610, y, 28, { align: "right", weight: 900, color: i === 1 ? RED : C.ink }); });
      ctx.fillStyle = C.ink; ctx.fillRect(1150, 528, 460, 3);
      text(ctx, "saldo tidak boleh minus", 1380, 650, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      [["F11.1", "Alur Pengembangan Program", "kebutuhan dan kasus uji"], ["F11.2", "Dari Pseudocode ke Kode", "if, while, program kas kelas"], ["S20", "Program Python Pertama di Colab", "simulasi sebelumnya"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490; card(ctx, x, 300, 460, 320, { fill: i === 2 ? "#F4F6F5" : C.bg2, r: 22 });
        text(ctx, c, x + 230, 380, 54, { align: "center", weight: 900, color: i === 2 ? C.ink2 : C.kiko }); para(ctx, t, x + 230, 445, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 585, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      kiko(ctx, 1660, 730, 100, 0, { wave: l });
    },
    rencana(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "RENCANA: PSEUDOCODE DARI F11.2", 260, 220, 30, { weight: 900, color: C.accentDark });
      const A = b.audio || b.dur, n = clamp(Math.floor((l - 0.8) / (A * 0.11)) + 1, 1, 7);
      const PS = ["saldo ← 50000", "BACA jumlah", "JIKA jumlah ≤ saldo MAKA", "    saldo ← saldo − jumlah", '    TULIS "Berhasil", saldo', "LAINNYA", '    TULIS "Ditolak: saldo tidak cukup"'];
      card(ctx, 250, 260, 860, 420, { fill: "#F6F8F9", stroke: "#D7E2DC", lw: 3, r: 16 });
      LK.code(ctx, 270, 290, PS.slice(0, n), { size: 28, nums: false, w: 820, hl: [n - 1] });
      card(ctx, 1170, 260, 480, 420, { fill: "#FFF9E0", r: 16 }); text(ctx, "Kebutuhan dari bendahara", 1200, 310, 26, { weight: 900 });
      ["catat pengeluaran", "saldo tidak boleh minus", "tolak jumlah yang salah"].forEach((s, i) => { text(ctx, "•", 1205, 380 + i * 70, 30, { weight: 900, color: C.accentDark }); text(ctx, s, 1235, 380 + i * 70, 28, { weight: 700 }); });
      kiko(ctx, 1600, 720, 90, 0);
    },
    primm(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "POLA PRIMM", 960, 220, 34, { align: "center", weight: 900, color: C.accentDark });
      const A = b.audio || b.dur;
      [["P", "Predict", "tebak output"], ["R", "Run", "jalankan"], ["I", "Investigate", "selidiki"], ["M", "Modify", "ubah"], ["M", "Make", "buat sendiri"]].forEach(([k, t, s], i) => {
        const on = l > A * (0.08 + i * 0.13); const x = 250 + i * 290; ctx.globalAlpha = on ? 1 : 0.25;
        card(ctx, x, 290, 260, 320, { fill: i === 0 ? "#FFF3D6" : C.bg2, stroke: i === 0 ? C.accent : null, lw: 5, r: 20 });
        text(ctx, k, x + 130, 400, 90, { align: "center", weight: 900, color: i === 0 ? C.accentDark : C.kiko }); text(ctx, t, x + 130, 480, 30, { align: "center", weight: 800 }); text(ctx, s, x + 130, 530, 26, { align: "center", weight: 700, color: C.ink2 }); ctx.globalAlpha = 1;
      });
      if (l > A * 0.8) text(ctx, "Tebak dulu, baru jalankan!", 960, 700, 32, { align: "center", weight: 900, color: C.accentDark });
    },

    ketik_awal(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = LK.typed(K1.slice(0, 2), ph(l, sp, 0.18, 0.72));
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: f < 0.18 ? [""] : T.lines, size: 26, active: true, run: "ready", caret: f < 0.18 ? { line: 0, col: 0 } : T.caret, blink: f < 0.72 || blinkAt(l), minLines: 3 });
      if (f > 0.76) { const p = c.code.at(1, 9); LK.focus(ctx, { x: p.x - 4, y: c.code.top(1) + 2, w: c.code.cw * 4 + 8, h: c.code.lh - 4 }, { t: l, pad: 2 });
        call(ctx, 420, "int( ): jawaban input diubah menjadi angka.", p.x + 30, c.code.top(1) + 2, { fill: "#E7F1FB", color: BLUE }); }
      if (f < 0.2) call(ctx, 420, "Notebook baru: Kas_Kelas.ipynb", 300, a.y - 30);
      LK.steps(ctx, "LANGKAH", ["Notebook baru: Kas_Kelas.", "Baris 1: saldo = 50000", "Baris 2: baca jumlah."], stepAt(f, [0.16, 0.36, 0.74]));
    },
    ketik_if(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const T = LK.insert(K1.slice(0, 2), 2, K1.slice(2), ph(l, sp, 0.04, 0.82));
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: T.lines, size: 26, active: true, run: "ready", caret: T.caret, blink: f < 0.82 || blinkAt(l), minLines: 3 });
      if (f > 0.2 && T.lines.length >= 4) { const yb = c.code.top(3), ye = c.code.top(Math.min(T.lines.length, 5)); ctx.fillStyle = "rgba(242,177,52,0.35)"; ctx.fillRect(c.code.x0 - 6, yb + 4, 4 * c.code.cw, ye - yb - 8);
        call(ctx, 400, "Menjorok otomatis setelah titik dua.", c.code.x0 + 2 * c.code.cw, yb + 14); }
      if (f > 0.84) call(ctx, 560, "else: dijalankan kalau syaratnya salah.", c.code.at(5, 5).x, c.code.at(5, 5).y, { fill: "#FDECEA", color: RED });
      keys(ctx, ["Enter"], ph(l, sp, 0.2, 0.28));
      LK.steps(ctx, "LANGKAH", ["Ketik if jumlah <= saldo:", "Enter: baris menjorok.", "Ketik else: dan pesannya."], stepAt(f, [0.2, 0.55, 0.84]));
    },
    tebak(ctx, b, l) {
      const a = nb(ctx);
      LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: K1, size: 26, active: true, run: "ready" });
      card(ctx, 1450, 160, 370, 420, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 });
      text(ctx, "TEBAK DULU", 1635, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "Input:", 1480, 280, 24, { weight: 700, color: C.ink2 }); LK.mono(ctx, 30, 700); ctx.fillStyle = LK.T.bi; ctx.textAlign = "left"; ctx.fillText("20000", 1580, 282);
      text(ctx, "Output:", 1480, 350, 24, { weight: 700, color: C.ink2 });
      card(ctx, 1480, 370, 310, 120, { fill: "#FFFFFF", r: 12 });
      const q = 0.5 + 0.5 * Math.sin(l * 4); text(ctx, "?", 1635, 455, 70, { align: "center", weight: 900, color: `rgba(181,122,18,${0.5 + 0.5 * q})` });
      text(ctx, "tulis di kertas", 1635, 545, 24, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1640, 720, 90, 0, { mood: "happy" });
    },
    jalan_20(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const S = sesi(f, [{ p: PJ, v: "20000", t0: 0.18, t1: 0.36 }, { o: "Berhasil. Saldo: 30000" }]);
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: K1, size: 26, active: true, run: f < 0.06 ? "ready" : S.done ? "done" : "running", spin: l, count: 1, out: f < 0.1 ? null : S.out,
        dim: S.done ? [5, 6] : [], hl: S.done ? [3, 4] : [] });
      keys(ctx, ["Enter"], S.enterU);
      if (S.done) { card(ctx, 1450, 420, 370, 220, { fill: C.goodBg, r: 18 }); text(ctx, "BANDINGKAN", 1474, 460, 22, { weight: 900, color: GREEN });
        text(ctx, "Tebakanmu sama?", 1474, 510, 26, { weight: 800 }); LK.mono(ctx, 21, 700); ctx.fillStyle = C.ink; ctx.textAlign = "left"; ctx.fillText("Berhasil. Saldo: 30000", 1474, 560);
        text(ctx, "Beda? Cari barisnya.", 1474, 610, 22, { weight: 700, color: C.ink2 }); }
      LK.steps(ctx, "LANGKAH", ["Jalankan sel.", "Ketik 20000, tekan Enter.", "Bandingkan dengan tebakan."], stepAt(f, [0.12, 0.38, 0.5]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.06, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.16, x: c.x + 600, y: c.codeBottom + 30, click: true, kind: "text" }, { at: 0.45, x: c.x + 700, y: c.codeBottom + 160 }]);
    },
    jalan_60(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const S = sesi(f, [{ p: PJ, v: "60000", t0: 0.1, t1: 0.26 }, { o: "Ditolak: saldo tidak cukup." }]);
      const c = LK.cell(ctx, cx0(a), a.y + 30, cw0(a), { lines: K1, size: 26, active: true, run: f < 0.04 ? "done" : S.done ? "done" : "running", spin: l, count: S.done ? 2 : 1, out: f < 0.04 ? [{ k: "in", t: PJ, v: "20000" }, "Berhasil. Saldo: 30000"] : S.out,
        hl: S.done && f > 0.34 ? (f < 0.55 ? [2] : [5, 6]) : [], dim: S.done && f > 0.55 ? [3, 4] : [] });
      keys(ctx, ["Enter"], S.enterU);
      if (S.done && f > 0.34) { const p = c.code.at(2, 18); call(ctx, 400, "60000 <= 50000 ? Salah.", p.x + 10, p.y, { fill: "#FDECEA", color: RED }); }
      if (S.done && f > 0.55) call(ctx, 540, "Python melompat ke else.", c.code.at(6, 30).x, c.code.at(6, 30).y, { fill: "#E7F1FB", color: BLUE });
      LK.steps(ctx, "LANGKAH", ["Jalankan lagi.", "Ketik 60000.", "Ikuti jalannya: else."], stepAt(f, [0.08, 0.28, 0.56]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.04, x: c.play.x + 4, y: c.play.y + 4, click: true }, { at: 0.3, x: c.play.x + 60, y: c.codeBottom + 180 }]);
    },

    tambah_while(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      let lines, caret = null, sel = null;
      if (f < 0.34) { const r = LK.insert(K1, 1, K2.slice(1, 3), ph(l, sp, 0.04, 0.3)); lines = r.lines; caret = r.caret; }
      else if (f < 0.56) { lines = K2.slice(0, 3).concat(K1.slice(1)); sel = [3, 8]; if (f > 0.5) lines = K2.slice(0, 9); }
      else { const r = LK.insert(K2.slice(0, 9), 9, K2.slice(9), ph(l, sp, 0.6, 0.92)); lines = r.lines; caret = r.caret; }
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines, size: 22, active: true, run: "ready", caret, blink: blinkAt(l) || f < 0.92 });
      if (sel && f > 0.38) { ctx.fillStyle = "rgba(26,115,200,0.18)"; ctx.fillRect(c.code.x0 - 4, c.code.top(sel[0]), c.w - 200, c.code.top(sel[1] + 1) - c.code.top(sel[0])); }
      keys(ctx, ["Tab"], ph(l, sp, 0.44, 0.56));
      if (f > 0.6) { const yb = c.code.top(3), ye = c.code.top(Math.min(lines.length, 10)); ctx.fillStyle = C.accent; ctx.fillRect(c.code.x0 - 14, yb + 4, 5, ye - yb - 8);
        call(ctx, 460, "Semua baris ini masuk ke dalam while.", c.code.x0 - 12, (yb + ye) / 2, { size: 22 }); }
      LK.steps(ctx, "LANGKAH", ['Tambah jawaban = "ya"', "Tambah while …:", "Pilih baris di bawahnya, tekan Tab.", "Tambah dua baris terakhir."], stepAt(f, [0.18, 0.32, 0.56, 0.92]));
      LK.pointer(ctx, l, sp, [{ at: 0, x: 900, y: 760 }, { at: 0.36, x: c.code.x0, y: c.code.top(3) + 8, click: true, kind: "text" }, { at: 0.44, x: c.code.x0 + 500, y: c.code.top(8) + 26, kind: "text" }, { at: 0.62, x: c.code.x0 + 520, y: c.code.top(10) + 40 }], { down: f > 0.36 && f < 0.44 });
    },
    arti_while(ctx, b, l) {
      const a = nb(ctx); const A = b.audio || b.dur;
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: K2, size: 22, active: true, run: "ready", hl: l > A * 0.08 && l < A * 0.5 ? [9] : l >= A * 0.5 ? [10] : [] });
      const yb = c.code.top(3), ye = c.code.top(10), bx = c.x + c.w - 60;
      ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx - 20, c.code.top(2) + 18); ctx.lineTo(bx, c.code.top(2) + 18); ctx.lineTo(bx, ye - 6); ctx.lineTo(bx - 20, ye - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx - 32, c.code.top(2) + 8); ctx.lineTo(bx - 18, c.code.top(2) + 18); ctx.lineTo(bx - 32, c.code.top(2) + 28); ctx.stroke();
      call(ctx, 180, 'Diulang selama jawaban == "ya".', bx + 4, (yb + ye) / 2);
      if (l > A * 0.08) call(ctx, 360, "Di akhir blok: Lagi? (ya/tidak)", c.code.at(9, 40).x, c.code.at(9, 40).y, { fill: "#E7F1FB", color: BLUE });
      if (l > A * 0.5) call(ctx, 540, "Tidak menjorok: sekali, setelah perulangan selesai.", c.code.at(10, 29).x, c.code.at(10, 29).y, { fill: C.goodBg, color: GREEN });
    },
    jalan_loop(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx);
      const S = sesi(f, [{ p: PJ, v: "20000", t0: 0.1, t1: 0.22 }, { o: "Berhasil. Saldo: 30000" }, { p: PL, v: "ya", t0: 0.26, t1: 0.33 }, { p: PJ, v: "40000", t0: 0.36, t1: 0.48 }, { o: "Ditolak: saldo tidak cukup." }, { p: PL, v: "tidak", t0: 0.62, t1: 0.72 }, { o: "Saldo akhir: 30000" }]);
      const c = cellFit(ctx, a, { lines: K2, size: 21, active: true, run: f < 0.05 ? "ready" : S.done ? "done" : "running", spin: l, count: 3, out: f < 0.08 ? null : S.out, outSize: 20 });
      keys(ctx, ["Enter"], S.enterU);
      if (f > 0.5 && f < 0.75 && c.out) call(ctx, 420, "Saldo tinggal 30000, jadi 40000 ditolak.", c.x + 520, c.out.lines[4] - 8, { fill: "#FDECEA", color: RED, size: 22 });
      if (S.done) call(ctx, 560, "Saldo akhir hanya tampil sekali.", c.x + 420, c.out.lines[6] - 8, { fill: C.goodBg, color: GREEN, size: 22 });
      LK.steps(ctx, "LANGKAH", ["20000, lalu ya.", "40000: ditolak.", "tidak: selesai."], stepAt(f, [0.34, 0.5, 0.74]));
    },

    tabel_uji(ctx, b, l) {
      const A = b.audio || b.dur;
      const a = nb(ctx, {}, WIN2);
      LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines: K2, size: 19, active: false, run: "done", count: 3 });
      const n = clamp(Math.floor((l - A * 0.15) / (A * 0.1)) + 1, 0, 5);
      const by = tabel(ctx, { n: 5, exp: n, hl: n > 0 && n <= 5 ? n - 1 : null });
      if (l > A * 0.25) call(ctx, by + 20, "Hasil yang diharapkan ditulis SEBELUM menjalankan.", null, null, { x: 1140, maxW: 640, size: 22 });
    },
    uji_normal(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {}, WIN2); const k = f < 0.5 ? 0 : 1; const t0 = k ? 0.52 : 0.04;
      const S = sesi(f, caseSteps(CASES[k], t0 + 0.04, t0 + 0.3, false));
      const c = cellFit(ctx, a, { lines: K2, size: 19, active: true, run: S.done ? "done" : "running", spin: l, count: 4 + k, out: S.out, outSize: 19 });
      keys(ctx, ["Enter"], S.enterU, 1480, 730);
      const res = [f > 0.36 ? res1(0) : null, f > 0.86 ? res1(1) : null];
      tabel(ctx, { res, hl: f < 0.36 ? 0 : (f > 0.5 && f < 0.86 ? 1 : null) });
    },
    uji_salah(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {}, WIN2); const k = f < 0.42 ? 2 : 3; const t0 = k === 3 ? 0.44 : 0.04;
      const S = sesi(f, caseSteps(CASES[k], t0 + 0.04, t0 + 0.28, false));
      const c = cellFit(ctx, a, { lines: K2, size: 19, active: true, run: S.done ? "done" : "running", spin: l, count: 6 + (k - 2), out: S.out, outSize: 19 });
      keys(ctx, ["Enter"], S.enterU, 1480, 730);
      if (S.done && c.out && c.out.lines[1]) { LK.focus(ctx, { x: c.x + 86, y: c.out.lines[1] - 22, w: 330, h: 30 }, { t: l, color: RED }); }
      const res = [res1(0), res1(1), f > 0.34 ? res1(2) : null, f > 0.74 ? res1(3) : null];
      const by = tabel(ctx, { res, hl: f < 0.34 ? 2 : (f > 0.42 && f < 0.74 ? 3 : null) });
      if (f > 0.78) call(ctx, by + 20, "Bug! Pengeluaran minus malah menambah saldo.", null, null, { x: 1140, maxW: 640, fill: "#FDECEA", color: RED, ink: RED });
    },
    perbaiki(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {}, WIN2);
      let lines, caret;
      if (f < 0.56) { const r = LK.insert(K2, 4, FIX, ph(l, sp, 0.06, 0.5)); lines = r.lines; caret = r.caret; }
      else { const el = LK.typeStr("el", ph(l, sp, 0.6, 0.7)); lines = K3.slice(); lines[6] = "    " + el + "if jumlah <= saldo:"; caret = { line: 6, col: 4 + el.length }; }
      const c = LK.cell(ctx, cx0(a), a.y + 24, cw0(a), { lines, size: 19, active: true, run: "ready", caret, blink: blinkAt(l) || f < 0.7, hl: f > 0.06 ? (f < 0.56 ? [4, 5] : [6]) : [] });
      tabel(ctx, { res: [res1(0), res1(1), res1(2), res1(3)] });
      const by = 122 + 52 + 30 + 5 * 74 + 14;
      if (f > 0.12 && f < 0.56) call(ctx, by + 20, "Syarat baru di paling atas: jumlah <= 0 ditolak.", null, null, { x: 1140, maxW: 640, fill: C.goodBg, color: GREEN, size: 22 });
      if (f >= 0.56) call(ctx, by + 20, "if menjadi elif: diperiksa dari atas ke bawah.", null, null, { x: 1140, maxW: 640, fill: "#E7F1FB", color: BLUE, size: 22 });
    },
    uji_ulang(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {}, WIN2); const k = clamp(Math.floor(f / 0.22), 0, 3); const t0 = k * 0.22;
      const S = sesi(f, caseSteps(CASES[k], t0 + 0.02, t0 + 0.17, true));
      cellFit(ctx, a, { lines: K3, size: 19, active: true, run: S.done ? "done" : "running", spin: l, count: 8 + k, out: S.out, outSize: 19 });
      keys(ctx, ["Enter"], S.enterU, 1480, 730);
      const res = [0, 1, 2, 3].map(i => (f > i * 0.22 + 0.19) ? res2(i) : null);
      const by = tabel(ctx, { res, hl: f < 0.88 ? k : null });
      if (f > 0.9) call(ctx, by + 20, "Empat kasus lolos. Kasus 1 dan 2 tetap benar.", null, null, { x: 1140, maxW: 640, fill: C.goodBg, color: GREEN, size: 22 });
    },
    uji_huruf(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const a = nb(ctx, {}, WIN2);
      const S = sesi(f, [{ p: PJ, v: "lima", t0: 0.06, t1: 0.2 }, { err: ERR_VAL }]);
      const c = cellFit(ctx, a, { lines: K3, size: 19, active: true, run: S.done ? "done" : "running", spin: l, count: 12, out: S.out, outSize: 18 });
      keys(ctx, ["Enter"], S.enterU, 1480, 730);
      if (S.done && c.out && c.out.err && f > 0.3) LK.focus(ctx, c.out.err.lastBox, { t: l, color: RED });
      const res = [0, 1, 2, 3].map(res2).concat([f > 0.5 ? res2(4) : null]);
      const by = tabel(ctx, { res, hl: f < 0.5 ? 4 : null });
      if (f > 0.66) { card(ctx, 1140, by + 16, 680, 150, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, "TANTANGAN", 1164, by + 52, 22, { weight: 900, color: C.accentDark });
        para(ctx, "Periksa dulu teksnya dengan isdigit() sebelum diubah dengan int(), lalu tolak dengan pesan ramah.", 1164, by + 88, 21, 630, { weight: 700, lh: 1.3 }); }
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 250, 420 + i * 110, 760, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 296, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 340, 476 + i * 110, 28, { weight: 700, fit: 650 }); });
      card(ctx, 1050, 360, 640, 420, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Program yang dituju", 1074, 398, 22, { weight: 900, color: C.ink2 });
      LK.code(ctx, 1064, 412, K3, { size: 15.5, w: 610 });
    },
    masalah_int(ctx, b, l) {
      const a = nb(ctx); const A = b.audio || b.dur;
      const bad = K3.slice(); bad[3] = '    jumlah = input("Jumlah pengeluaran: ")';
      const fixed = l > A * 0.7;
      const err = { name: "TypeError", msg: "'<=' not supported between instances of 'str' and 'int'", kind: "runtime", line: 5, ctx: [[4, bad[3]], [5, K3[4]], [6, K3[5]]] };
      const c = cellFit(ctx, a, { lines: fixed ? K3 : bad, size: 20, active: true, run: "done", count: 13, out: fixed ? null : [{ k: "in", t: PJ, v: "20000" }, { err }], outSize: 19,
        boxes: [{ line: 3, from: 13, to: fixed ? 46 : 41, color: fixed ? GREEN : RED }] });
      if (!fixed && c.out && c.out.err && l > A * 0.25) { LK.focus(ctx, c.out.err.lastBox, { t: l, color: RED }); call(ctx, 300, "TypeError: string dibandingkan dengan angka.", c.out.err.lastBox.x + c.out.err.lastBox.w + 6, c.out.err.lastBox.y + 16, { fill: "#FDECEA", color: RED, size: 22 }); }
      if (!fixed) call(ctx, 160, "Lupa int( ).", c.code.at(3, 42).x, c.code.top(3) + 4, { fill: "#FDECEA", color: RED });
      if (fixed) call(ctx, 160, "Benar: jumlah = int(input(…))", c.code.at(3, 47).x, c.code.top(3) + 4, { fill: C.goodBg, color: GREEN });
    },
    masalah_indent(ctx, b, l) {
      const a = nb(ctx); const A = b.audio || b.dur;
      const bad = K3.slice(); bad[5] = FIX[1].trimStart();
      const fixed = l > A * 0.72;
      const err = { name: "IndentationError", msg: "expected an indented block after 'if' statement on line 5", kind: "syntax", line: 6, code: bad[5], col: 0, carets: "^^^^^", file: "<ipython-input-14>" };
      const c = cellFit(ctx, a, { lines: fixed ? K3 : bad, size: 20, active: true, run: "done", count: 14, out: fixed ? null : [{ err }], outSize: 19, hl: [5] });
      if (!fixed && c.out && c.out.err && l > A * 0.22) { LK.focus(ctx, c.out.err.lastBox, { t: l, color: RED }); LK.focus(ctx, c.out.err.lineBox, { t: l + 1, color: BLUE }); }
      if (!fixed) call(ctx, 160, "Baris 6 tidak menjorok.", c.code.at(5, 10).x, c.code.at(5, 10).y - 10, { fill: "#FDECEA", color: RED });
      if (fixed) { call(ctx, 160, "Tambah 4 spasi atau tekan Tab.", c.code.at(5, 4).x, c.code.at(5, 4).y, { fill: C.goodBg, color: GREEN }); keys(ctx, ["Tab"], clamp((l - A * 0.72) / (A * 0.12), 0, 1)); }
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.1", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "kasus uji dan pemburu bug", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f111", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "beri jenis kasus, temukan bug, pilih perbaikan", 620, 600, 23, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Tambahkan pilihan pemasukan ke program kas kelasmu, lalu buat kasus ujinya.", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      LK.code(ctx, 1080, 580, ['jenis = input("masuk/keluar? ")'], { size: 21, nums: false, w: 470 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
