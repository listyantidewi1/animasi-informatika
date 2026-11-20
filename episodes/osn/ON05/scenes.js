/* ON05 Papan Lampu (OSN-K 2026 SMA no. 9): papan 5x5, tombol baris/kolom membalik lampu; paritas lalu membilang.
   Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, para, panel, label, chip, check, cross, arrow, strike, hilite, ease, clamp, lerp, ap, at, speechEnd } = H;
  const { fadeIn, bigNote, note, heading } = U;
  const COLS = "ABCDE";
  // target: menyala bila (baris di {2,5}) XOR (kolom di {B,D})
  const TGT = (r, c) => ((r === 2 || r === 5) ? 1 : 0) ^ ((c === 1 || c === 3) ? 1 : 0);
  const OFF = () => 0;
  /* papan: x,y kiri atas; s ukuran sel; st(r,c) -> 0/1 (r 1..5, c 0..4); o.flip(r,c) -> 0..1 animasi balik; o.labels; o.hlRow/o.hlCol (0..1) */
  function board(ctx, x, y, s, st, o = {}) {
    if (o.labels !== false) {
      for (let c = 0; c < 5; c++) text(ctx, COLS[c], x + s * c + s / 2, y - s * 0.22, s * 0.36, { mono: true, weight: 800, align: "center", color: o.colMark && o.colMark(c) ? C.red : C.mut });
      for (let r = 1; r <= 5; r++) text(ctx, String(r), x - s * 0.3, y + s * (r - 1) + s * 0.62, s * 0.36, { mono: true, weight: 800, align: "center", color: o.rowMark && o.rowMark(r) ? C.red : C.mut });
    }
    ctx.save(); rr(ctx, x - 6, y - 6, s * 5 + 12, s * 5 + 12, 10); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
    for (let r = 1; r <= 5; r++) for (let c = 0; c < 5; c++) {
      const cx = x + s * c, cy = y + s * (r - 1); const on = st(r, c);
      ctx.fillStyle = on ? "#EFE6CC" : "#8C877A"; ctx.fillRect(cx + 2, cy + 2, s - 4, s - 4);
      const f = o.flip ? o.flip(r, c) : 0; const rad = s * 0.36 * (f > 0 && f < 1 ? Math.abs(1 - 2 * f) * 0.6 + 0.4 : 1);
      if (on) { ctx.beginPath(); ctx.arc(cx + s / 2, cy + s / 2, rad * 1.25, 0, Math.PI * 2); ctx.fillStyle = "rgba(244,222,148,0.55)"; ctx.fill(); }
      ctx.beginPath(); ctx.arc(cx + s / 2, cy + s / 2, rad, 0, Math.PI * 2); ctx.fillStyle = on ? "#FFFFFF" : C.ink; ctx.fill();
      ctx.lineWidth = Math.max(2, s * 0.03); ctx.strokeStyle = on ? C.goldRim : "#000"; ctx.stroke();
    }
    if (o.hlRow) { const [r, u] = o.hlRow; if (u > 0) hilite(ctx, x - 4, y + s * (r - 1) - 2, s * 5 + 8, s + 4, C.red, u, "rgba(210,56,43,0.10)"); }
    if (o.hlCol) { const [c, u] = o.hlCol; if (u > 0) hilite(ctx, x + s * c - 2, y - 4, s + 4, s * 5 + 8, C.red, u, "rgba(210,56,43,0.10)"); }
  }
  function key(ctx, s, x, y, d, o = {}) {   // satu tombol bulat
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    ctx.beginPath(); ctx.arc(x, y, d / 2, 0, Math.PI * 2); ctx.fillStyle = o.fill || (o.on ? C.red : C.panel); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = o.stroke || (o.on ? C.red : C.ink); ctx.stroke();
    text(ctx, s, x, y + d * 0.17, d * 0.46, { mono: true, weight: 800, align: "center", color: o.color || (o.on ? C.white : C.ink) });
    ctx.restore();
  }
  function seqKeys(ctx, seq, x, y, d, o = {}) {   // deretan tombol; o.a(i) alpha
    seq.forEach((s, i) => { const a = o.a ? o.a(i) : 1; if (a > 0) key(ctx, s, x + i * (d + 14) + d / 2, y, d, { alpha: a, on: o.on && o.on(i), fill: o.fill && o.fill(i), stroke: o.stroke && o.stroke(i), color: o.color && o.color(i) }); });
    return seq.length * (d + 14) - 14;
  }
  // keadaan papan setelah tombol ditekan (daftar), plus animasi tombol terakhir
  function stateOf(pressed) { const rows = new Set(), cols = new Set(); pressed.forEach(p => { const t = /\d/.test(p) ? rows : cols; const k = /\d/.test(p) ? +p : COLS.indexOf(p); t.has(k) ? t.delete(k) : t.add(k); }); return (r, c) => (rows.has(r) ? 1 : 0) ^ (cols.has(c) ? 1 : 0); }
  function hits(p, r, c) { return /\d/.test(p) ? +p === r : COLS.indexOf(p) === c; }
  /* animasi tekanan: presses [[tombol, t0], ...] -> st, flip */
  function animState(presses, l) {
    const done = presses.filter(([p, t0]) => l >= t0 + 0.25).map(([p]) => p);
    const cur = presses.find(([p, t0]) => l >= t0 && l < t0 + 0.5);
    return { st: stateOf(done), flip: (r, c) => cur && hits(cur[0], r, c) ? clamp((l - cur[1]) / 0.5, 0, 1) : 0 };
  }

  Object.assign(Kiko.SCENES, {
    // ================= KAIT =================
    kait_papan(ctx, b, l) {
      const tS = at(b, "Setiap"), tE = at(b, "enam");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 120, 28, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      const A = animState([["2", tS + 0.3], ["C", tS + 1.2], ["2", tS + 2.1], ["C", tS + 2.6]], l);
      board(ctx, 300, 260, 90, A.st, { flip: A.flip });
      fadeIn(ctx, ap(l, tE - 0.4), () => { arrow(ctx, 830, 485, 1000, 485, { color: C.ink, lw: 8, head: 26 }); board(ctx, 1110, 260, 90, TGT, {}); });
      fadeIn(ctx, ap(l, tE - 0.2), () => chip(ctx, "tepat 6 tekanan", 960, 760 - 40, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
    },
    kait_tanya(ctx, b, l) {
      const tB = at(b, "berapa"), tR = at(b, "ribuan"), tM = at(b, "menghitungnya");
      text(ctx, "Ada berapa urutan?", 960, 230, 96, { disp: true, weight: 800, align: "center" });
      const S = [["A", "C", "E", "1", "3", "4"], ["B", "2", "D", "5", "E", "E"], ["4", "3", "1", "E", "C", "A"], ["D", "D", "D", "B", "5", "2"]];
      S.forEach((q, i) => fadeIn(ctx, ap(l, tB + 0.3 + i * 0.5), () => seqKeys(ctx, q, 560, 340 + i * 90, 64, {})));
      fadeIn(ctx, ap(l, tB + 2.3), () => text(ctx, "…", 960, 720, 60, { mono: true, weight: 800, align: "center", color: C.mut }));
      fadeIn(ctx, ap(l, tR - 0.3), () => chip(ctx, "ribuan!", 1500, 450, { size: 52, color: C.white, fill: C.red, stroke: C.red, center: true }));
      fadeIn(ctx, ap(l, tM - 0.3), () => text(ctx, "tanpa mencoba satu per satu", 1500, 600, 34, { weight: 800, align: "center", color: C.green }));
    },
    kait_judul(ctx, b, l) {
      const tP = at(b, "paritas"), tM = at(b, "membilang");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "10 Tombol, 6 Tekanan,", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Berapa Urutan?", 960, 400, 84, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2026 · SMA · No. 9 · Papan Lampu", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tP - 0.3), () => chip(ctx, "paritas", 680, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
      fadeIn(ctx, ap(l, tM - 0.3), () => chip(ctx, "aturan membilang", 1150, 580, { size: 44, color: C.white, fill: C.red, stroke: C.red, center: true, px: 28 }));
    },

    // ================= SOAL =================
    papan_soal(ctx, b, l) {
      const m = b.mode; const X = 560, Y = 210, S = 100;
      let st = OFF, flip = null, hlRow = null, hlCol = null;
      if (m === "baris") {
        const tM = at(b, "membalik"); const A = animState([["2", tM + 0.2]], l); st = A.st; flip = A.flip; hlRow = [2, ap(l, tM - 0.2)];
        fadeIn(ctx, ap(l, at(b, "sepuluh") - 0.2), () => { label(ctx, "// 10 TOMBOL", 1260, 230); seqKeys(ctx, [..."12345"], 1260, 290, 70, { on: i => i === 1 && l > tM - 0.2 }); seqKeys(ctx, [..."ABCDE"], 1260, 390, 70, {}); });
        fadeIn(ctx, ap(l, at(b, "Lampu", 2) - 0.2), () => { text(ctx, "mati → menyala", 1260, 520, 36, { weight: 800, color: C.green }); text(ctx, "menyala → mati", 1260, 575, 36, { weight: 800, color: C.mut }); });
      } else if (m === "kolom") {
        const tC = at(b, "C", 1); const A = animState([["2", -9], ["C", tC + 0.2]], l); st = A.st; flip = A.flip; hlCol = [2, ap(l, tC - 0.2)];
        label(ctx, "// 10 TOMBOL", 1260, 230); seqKeys(ctx, [..."12345"], 1260, 290, 70, {}); seqKeys(ctx, [..."ABCDE"], 1260, 390, 70, { on: i => i === 2 && l > tC - 0.2 });
        fadeIn(ctx, ap(l, tC + 0.8), () => { text(ctx, "lampu 2C dibalik lagi", 1260, 520, 34, { weight: 800, color: C.red }); text(ctx, "→ mati kembali", 1260, 570, 34, { weight: 800, color: C.mut }); });
      } else {
        const tL = at(b, "lima", 1), tK = at(b, "kolom"), tM = at(b, "mati");
        fadeIn(ctx, ap(l, tM - 0.2), () => { panel(ctx, 1260, 300, 520, 140, { stroke: C.ink, lw: 3 }); text(ctx, "awal: semua mati", 1520, 385, 40, { disp: true, weight: 800, align: "center" }); });
        board(ctx, X, Y, S, st, { rowMark: r => l > tL - 0.2 && l < tK - 0.2, colMark: c => l > tK - 0.2 && l < tM - 0.2 });
        return;
      }
      board(ctx, X - 300, Y, S, st, { flip, hlRow, hlCol });
    },
    papan_target(ctx, b, l) {
      const tK = at(b, "kanan"), tP = at(b, "putih"), tH = at(b, "hitam");
      board(ctx, 220, 240, 90, OFF, {});
      text(ctx, "awal", 445, 760, 34, { weight: 800, align: "center", color: C.mut });
      fadeIn(ctx, ap(l, tK - 0.4), () => { arrow(ctx, 740, 465, 900, 465, { color: C.ink, lw: 8, head: 26 }); board(ctx, 1000, 240, 90, TGT, {}); text(ctx, "tujuan", 1225, 760, 34, { weight: 800, align: "center", color: C.red }); });
      fadeIn(ctx, ap(l, tP - 0.2), () => { ctx.beginPath(); ctx.arc(1560, 360, 32, 0, Math.PI * 2); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.goldRim; ctx.stroke(); text(ctx, "menyala", 1610, 372, 34, { weight: 800 }); });
      fadeIn(ctx, ap(l, tH - 0.2), () => { ctx.beginPath(); ctx.arc(1560, 460, 32, 0, Math.PI * 2); ctx.fillStyle = C.ink; ctx.fill(); text(ctx, "mati", 1610, 472, 34, { weight: 800 }); });
    },
    papan_tanya(ctx, b, l) {
      const tE = at(b, "enam"), tB = at(b, "berapa"), tC = at(b, "Contohnya"), tU = at(b, "Urutan");
      board(ctx, 170, 180, 56, OFF, {}); arrow(ctx, 480, 320, 560, 320, { color: C.ink, lw: 6 }); board(ctx, 620, 180, 56, TGT, {});
      fadeIn(ctx, ap(l, tE - 0.3), () => chip(ctx, "tepat 6 tombol", 1500, 210, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
      fadeIn(ctx, ap(l, tB - 0.3), () => text(ctx, "Ada berapa urutan?", 1500, 370, 56, { disp: true, weight: 800, align: "center" }));
      fadeIn(ctx, ap(l, tC - 0.3), () => { label(ctx, "// CONTOH 1", 170, 540); seqKeys(ctx, ["A", "C", "E", "1", "3", "4"], 170, 600, 66, {}); });
      fadeIn(ctx, ap(l, tU - 0.3), () => { label(ctx, "// CONTOH 2", 1000, 540); seqKeys(ctx, ["B", "2", "D", "5", "E", "E"], 1000, 600, 66, {}); });
    },

    // ================= PEMBAHASAN =================
    amati_urutan(ctx, b, l) {
      const tA = at(b, "A", 1), tA2 = at(b, "A", 2), tS = at(b, "sama");
      heading(ctx, "// PENGAMATAN 1", "Urutan tidak mengubah hasil akhir", 1, 160);
      const st = stateOf(["A", "1"]);
      fadeIn(ctx, ap(l, tA - 0.2), () => { seqKeys(ctx, ["A", "1"], 360, 330, 64, {}); board(ctx, 330, 400, 64, st, {}); });
      fadeIn(ctx, ap(l, tA2 - 0.4), () => { seqKeys(ctx, ["1", "A"], 1290, 330, 64, {}); board(ctx, 1260, 400, 64, st, {}); });
      fadeIn(ctx, ap(l, tS - 0.3), () => text(ctx, "=", 960, 600, 120, { mono: true, weight: 800, align: "center", color: C.green }));
    },
    amati_dua(ctx, b, l) {
      const tD = at(b, "dua"), tK = at(b, "kembali"), tG = at(b, "ganjil");
      heading(ctx, "// PENGAMATAN 2", "Dua kali = tidak ditekan", 1, 160);
      const A = animState([["3", tD + 0.2], ["3", tK - 0.2]], l);
      board(ctx, 260, 290, 80, A.st, { flip: A.flip, hlRow: [3, ap(l, tD - 0.2)] });
      fadeIn(ctx, ap(l, tD - 0.2), () => seqKeys(ctx, ["3", "3"], 760, 400, 70, { on: i => (i === 0 ? l > tD + 0.2 : l > tK - 0.2) }));
      fadeIn(ctx, ap(l, tG - 0.3), () => {
        panel(ctx, 1000, 300, 760, 150, { stroke: C.green, lw: 3 }); text(ctx, "ganjil kali", 1040, 365, 44, { disp: true, weight: 800, color: C.green }); text(ctx, "= sama dengan ditekan sekali", 1040, 420, 32, { weight: 700 });
        panel(ctx, 1000, 480, 760, 150, { stroke: C.line, lw: 3 }); text(ctx, "genap kali", 1040, 545, 44, { disp: true, weight: 800, color: C.mut }); text(ctx, "= sama dengan tidak ditekan", 1040, 600, 32, { weight: 700 });
      });
    },
    cari_ganjil(ctx, b, l) {
      const m = b.mode; const X = 300, Y = 230, S = 92;
      label(ctx, "// TOMBOL MANA YANG GANJIL?", 960, 140, { align: "center" });
      const odd = new Set();
      let hlRow = null, rowMark = () => false, colMark = () => false;
      if (m === "kolom") {
        const tB1 = at(b, "baris", 1), tB = at(b, "B", 1), tG = at(b, "ganjil", 2);
        hlRow = [1, ap(l, tB1 - 0.2)];
        if (l > tG - 0.2) { odd.add("B"); odd.add("D"); }
        colMark = c => l > tB - 0.2 && (c === 1 || c === 3);
        fadeIn(ctx, ap(l, at(b, "tidak") - 0.2), () => text(ctx, "baris 1 tidak ditekan →", 920, 300, 36, { weight: 800 }));
      } else if (m === "baris") {
        odd.add("B"); odd.add("D");
        const tD = at(b, "ditekan", 1), tT = at(b, "tiga"), tL = at(b, "lima"), tH = at(b, "Hasilnya");
        if (l > tD - 0.2) odd.add("2"); if (l > tL - 0.2) odd.add("5");
        const r = l < tD ? 2 : l < tT ? 2 : l < tL ? 3 : 5; hlRow = [r, ap(l, 0.2)];
        rowMark = rr_ => (rr_ === 2 && l > tD - 0.2) || (rr_ === 5 && l > tL - 0.2);
        colMark = c => c === 1 || c === 3;
        fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "baris 3 dan 4 = baris 1 → genap", 920, 300, 32, { weight: 800, color: C.mut }));
        fadeIn(ctx, ap(l, tH - 0.2), () => { panel(ctx, 920, 560, 860, 150, { stroke: C.red, lw: 4 }); text(ctx, "ganjil:", 960, 650, 40, { weight: 800 }); seqKeys(ctx, ["B", "D", "2", "5"], 1110, 635, 70, { on: () => true }); });
      } else {
        ["B", "D", "2", "5"].forEach(x => odd.add(x));
        const tK = at(b, "kesepuluh"), tB = at(b, "kebalikannya");
        fadeIn(ctx, ap(l, 0.2), () => { text(ctx, "pilihan 1:", 920, 300, 34, { weight: 800 }); seqKeys(ctx, ["B", "D", "2", "5"], 1110, 290, 64, { on: () => true }); });
        fadeIn(ctx, ap(l, tK - 0.2), () => { text(ctx, "tekan kesepuluh tombol = tiap lampu dibalik 2 kali", 920, 420, 30, { weight: 800, color: C.mut, fit: 860 }); text(ctx, "→ papan tidak berubah", 920, 470, 30, { weight: 800, color: C.green }); });
        fadeIn(ctx, ap(l, tB - 0.2), () => { panel(ctx, 920, 540, 860, 150, { stroke: C.red, lw: 4 }); text(ctx, "pilihan 2:", 950, 630, 34, { weight: 800 }); seqKeys(ctx, ["A", "C", "E", "1", "3", "4"], 1130, 615, 64, { on: () => true }); });
      }
      board(ctx, X, Y, S, TGT, { hlRow, rowMark, colMark });
      // tombol ganjil di tepi papan
      [..."ABCDE"].forEach((s, c) => { if (odd.has(s)) key(ctx, s, X + S * c + S / 2, Y - 52 - 20, 40, { on: true }); });
      [..."12345"].forEach((s, r) => { if (odd.has(s)) key(ctx, s, X - 75, Y + S * r + S / 2, 40, { on: true }); });
    },
    kasus(ctx, b, l) {
      const k = b.kasus;
      label(ctx, k === 1 ? "// KASUS 1: ENAM TOMBOL GANJIL" : "// KASUS 2: EMPAT TOMBOL GANJIL", 200, 160);
      if (k === 1) {
        seqKeys(ctx, ["A", "C", "E", "1", "3", "4"], 200, 260, 90, { on: () => true, a: i => ap(l, 0.2 + i * 0.12) });
        fadeIn(ctx, ap(l, at(b, "sekali") - 0.2), () => text(ctx, "masing-masing tepat sekali → tinggal menyusun urutan", 200, 380, 36, { weight: 800, fit: 1500 }));
        if (b.hitung) {
          const tF = at(b, "faktorial"), tH = at(b, "Hasilnya");
          fadeIn(ctx, ap(l, tF - 0.2), () => text(ctx, "6! = 6 × 5 × 4 × 3 × 2 × 1", 200, 520, 64, { mono: true, weight: 800 }));
          fadeIn(ctx, ap(l, tH - 0.2), () => { text(ctx, "= 720", 1270, 520, 72, { mono: true, weight: 800, color: C.red }); });
          fadeIn(ctx, ap(l, tF + 1), () => text(ctx, "posisi 1 punya 6 pilihan, posisi 2 punya 5 pilihan, dan seterusnya", 200, 600, 30, { weight: 700, color: C.mut, fit: 1500 }));
        }
        return;
      }
      seqKeys(ctx, ["B", "D", "2", "5"], 200, 260, 90, { on: () => true });
      fadeIn(ctx, ap(l, b.sub ? 0 : at(b, "dua", 2) - 0.2), () => { seqKeys(ctx, ["?", "?"], 200 + 4 * 104 + 30, 260, 90, { fill: () => "#FFF6DA", stroke: () => C.goldRim, color: () => C.goldInk }); text(ctx, "+ 2 tekanan lagi", 900, 275, 36, { weight: 800, color: C.goldInk }); });
      if (!b.sub) {
        const tC = at(b, "cara", 1);
        fadeIn(ctx, ap(l, tC - 0.2), () => { panel(ctx, 200, 380, 740, 150, {}); text(ctx, "cara a: satu tombol ganjil ditekan 3 kali", 230, 470, 30, { weight: 800, fit: 680 });
          panel(ctx, 980, 380, 740, 150, {}); text(ctx, "cara b: tombol lain ditekan 2 kali", 1010, 470, 30, { weight: 800, fit: 680 }); });
        return;
      }
      if (b.sub === "a") {
        const tE = at(b, "empat", 1), tF = at(b, "faktorial"), tS = at(b, "seratus"), tT = at(b, "Totalnya");
        fadeIn(ctx, ap(l, 0.3), () => { label(ctx, "// CARA A, CONTOH", 200, 400); seqKeys(ctx, ["B", "B", "B", "D", "2", "5"], 200, 460, 70, { on: i => i < 3 }); });
        fadeIn(ctx, ap(l, tE - 0.2), () => text(ctx, "4 pilihan tombol (B, D, 2, atau 5)", 900, 470, 32, { weight: 800 }));
        fadeIn(ctx, ap(l, tF - 0.2), () => text(ctx, "6! / 3! = 720 / 6", 200, 620, 56, { mono: true, weight: 800 }));
        fadeIn(ctx, ap(l, tS - 0.2), () => text(ctx, "= 120", 800, 620, 56, { mono: true, weight: 800, color: C.red }));
        fadeIn(ctx, ap(l, tT - 0.2), () => { panel(ctx, 1080, 560, 660, 100, { stroke: C.red, lw: 3 }); text(ctx, "4 × 120 = 480", 1410, 630, 52, { mono: true, weight: 800, align: "center", color: C.red }); });
      } else {
        const tE = at(b, "enam", 1), tF = at(b, "faktorial"), tT = at(b, "tiga"), tO = at(b, "Totalnya");
        fadeIn(ctx, ap(l, 0.3), () => { label(ctx, "// CARA B, CONTOH", 200, 400); seqKeys(ctx, ["B", "2", "D", "5", "E", "E"], 200, 460, 70, { on: i => i < 4, fill: i => i >= 4 ? "#FFF6DA" : null, stroke: i => i >= 4 ? C.goldRim : null, color: i => i >= 4 ? C.goldInk : null }); });
        fadeIn(ctx, ap(l, tE - 0.2), () => text(ctx, "6 pilihan tombol (A, C, E, 1, 3, 4)", 900, 470, 32, { weight: 800 }));
        fadeIn(ctx, ap(l, tF - 0.2), () => text(ctx, "6! / 2! = 720 / 2", 200, 620, 56, { mono: true, weight: 800 }));
        fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "= 360", 800, 620, 56, { mono: true, weight: 800, color: C.red }));
        fadeIn(ctx, ap(l, tO - 0.2), () => { panel(ctx, 1080, 560, 660, 100, { stroke: C.red, lw: 3 }); text(ctx, "6 × 360 = 2160", 1410, 630, 52, { mono: true, weight: 800, align: "center", color: C.red }); });
      }
    },
    jumlah(ctx, b, l) {
      const tA = at(b, "tujuh"), tB = at(b, "empat"), tC = at(b, "dua"), tT = at(b, "tiga");
      label(ctx, "// JAWABAN SOAL 9", 960, 170, { align: "center" });
      [["kasus 1", "720", tA], ["kasus 2a", "480", tB], ["kasus 2b", "2160", tC]].forEach(([s, v, t0], i) => fadeIn(ctx, ap(l, t0 - 0.2), () => {
        const x = 330 + i * 450; panel(ctx, x, 220, 360, 200, {}); text(ctx, s, x + 180, 280, 30, { mono: true, weight: 800, align: "center", color: C.green }); text(ctx, v, x + 180, 375, 72, { mono: true, weight: 800, align: "center" });
        if (i < 2) text(ctx, "+", x + 405, 340, 60, { mono: true, weight: 800, align: "center", color: C.mut });
      }));
      fadeIn(ctx, ap(l, tT - 0.2), () => { panel(ctx, 560, 480, 800, 200, { stroke: C.red, lw: 5 }); text(ctx, "3360", 960, 625, 130, { mono: true, weight: 800, align: "center", color: C.red }); });
    },

    // ================= KONSEP =================
    konsep_xor(ctx, b, l) {
      const tX = at(b, "XOR"), tG = at(b, "genap"), tP = at(b, "paritas");
      heading(ctx, "// KONSEP", "Membalik lampu = XOR", 1, 150);
      fadeIn(ctx, ap(l, tX - 0.2), () => {
        panel(ctx, 260, 280, 640, 380, {}); label(ctx, "// TABEL XOR", 300, 330);
        [["0 ⊕ 0", "0"], ["0 ⊕ 1", "1"], ["1 ⊕ 0", "1"], ["1 ⊕ 1", "0"]].forEach(([a, r], i) => { text(ctx, a, 320, 410 + i * 66, 44, { mono: true, weight: 800 }); text(ctx, "= " + r, 560, 410 + i * 66, 44, { mono: true, weight: 800, color: r === "1" ? C.red : C.mut }); });
      });
      fadeIn(ctx, ap(l, tG - 0.2), () => { panel(ctx, 980, 280, 700, 200, { stroke: C.green, lw: 3 }); text(ctx, "dibalik ganjil kali → berubah", 1010, 360, 36, { weight: 800, color: C.green, fit: 640 }); text(ctx, "dibalik genap kali → tetap", 1010, 430, 36, { weight: 800, color: C.mut, fit: 640 }); });
      fadeIn(ctx, ap(l, tP - 0.2), () => chip(ctx, "paritas = ganjil atau genap", 1330, 560, { size: 34, color: C.white, fill: C.green, stroke: C.green, center: true }));
    },
    konsep_bilang(ctx, b, l) {
      const tS = at(b, "menyusun"), tB = at(b, "bagi");
      heading(ctx, "// KONSEP", "Menyusun benda yang ada kembarnya", 1, 150);
      fadeIn(ctx, ap(l, tS - 0.2), () => seqKeys(ctx, ["B", "B", "B", "D", "2", "5"], 560, 330, 90, { on: i => i < 3 }));
      fadeIn(ctx, ap(l, tB - 0.2), () => {
        panel(ctx, 460, 440, 1000, 220, { stroke: C.red, lw: 4 });
        text(ctx, "(banyak semua benda)!", 960, 525, 44, { mono: true, weight: 800, align: "center" });
        ctx.fillStyle = C.ink; ctx.fillRect(620, 550, 680, 4);
        text(ctx, "(banyak yang kembar)!", 960, 615, 44, { mono: true, weight: 800, align: "center", color: C.red });
        text(ctx, "6! / 3! = 120", 960, 740, 44, { mono: true, weight: 800, align: "center", color: C.green });
      });
    }
  });
})();
