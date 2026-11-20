/* ON03 Mesin BCS (OSN-K 2025 SMA no. 11–13): tabung koin = stack. Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, para, panel, label, chip, coin, check, cross, arrow, strike, hilite, ease, clamp, lerp, ap, at, speechEnd } = H;
  const { fadeIn, bigNote, note, heading } = U;
  const norm = s => s.toLowerCase().replace(/[^0-9a-z]/g, "");

  // ---------- simulasi mesin ----------
  function run(seq, k) {   // keadaan setelah k tekanan pertama
    let st = [], n = 0, out = "", done = false;
    for (let i = 0; i < k; i++) { const c = seq[i]; if (c === "B") st.push(++n); else if (c === "C") out += st.pop(); else done = true; }
    return { st, n, out, done };
  }
  // waktu tiap tekanan dalam beat: keys [[kata, ke-n, jumlah?], ...]
  function pressTimes(b) {
    const T = []; (b.keys || []).forEach(([w, n, cnt]) => { const t0 = at(b, w, n); for (let k = 0; k < (cnt || 1); k++) T.push(t0 + k * 0.3); }); return T;
  }
  // waktu kata-kata satu huruf B/C/S (untuk memunculkan deretan tombol saat dibacakan)
  function letterTimes(b) {
    if (!b.words) return []; return b.words.filter(w => ["b", "c", "s"].includes(norm(w[0]))).map(w => w[1]);
  }

  /* tabung: x tengah, yb dasar; st = isi dari bawah; o.hl {indeks: warna}; o.hide = sembunyikan koin teratas (sedang terbang) */
  const TR = 38, TS = 84;
  function tube(ctx, x, yb, st, o = {}) {
    const cap = o.cap || 6, w = 120, h = cap * TS + 30, top = yb - h;
    ctx.save();
    ctx.fillStyle = "rgba(255,252,244,0.75)"; rr(ctx, x - w / 2, top, w, h, 14); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(x - w / 2, top - 6); ctx.lineTo(x - w / 2, yb); ctx.lineTo(x + w / 2, yb); ctx.lineTo(x + w / 2, top - 6); ctx.stroke();
    // tutup terbuka di atas
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - w / 2 - 6, top - 6); ctx.lineTo(x - w / 2 - 40, top - 46); ctx.stroke();
    text(ctx, "atas", x + w / 2 + 16, top + 8, 22, { mono: true, weight: 700, color: C.mut });
    st.forEach((v, i) => { if (o.hide && i === st.length - 1) return; const hl = o.hl && o.hl[i];
      if (hl) { ctx.beginPath(); ctx.arc(x, yb - 20 - TR - i * TS, TR + 10, 0, Math.PI * 2); ctx.fillStyle = hl; ctx.fill(); }
      coin(ctx, x, yb - 20 - TR - i * TS, TR, String(v), { fake: o.fakeAt === i }); });
    ctx.restore();
    return i => [x, yb - 20 - TR - i * TS];
  }
  function seqRow(ctx, seq, x0, y, o = {}) {   // deretan tombol; o.cur indeks yang sedang ditekan, o.done jumlah yang sudah, o.a(i) alpha
    const d = o.d || 56; let x = x0;
    for (let i = 0; i < seq.length; i++) {
      const a = o.a ? o.a(i) : 1; if (a <= 0) { x += d; continue; }
      const c = seq[i], cur = i === o.cur, done = i < (o.done || 0);
      ctx.save(); ctx.globalAlpha *= a;
      rr(ctx, x, y, d - 8, 52, 8); ctx.fillStyle = cur ? C.gold2 : done ? "#EFE8D6" : C.panel; ctx.fill();
      ctx.lineWidth = cur ? 4 : 2; ctx.strokeStyle = cur ? C.goldRim : c === "S" ? C.red : C.line; ctx.stroke();
      text(ctx, c, x + (d - 8) / 2, y + 38, 32, { mono: true, weight: 800, align: "center", color: done ? C.mut : c === "B" ? C.green : c === "C" ? C.red : C.ink });
      ctx.restore(); x += d;
    }
    return x0 + seq.length * d;
  }
  function paper(ctx, s, x, y, w, o = {}) {   // kertas cetakan; s = digit yang sudah tercetak
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    rr(ctx, x, y, w, o.h || 110, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.stroke || C.line; ctx.stroke();
    ctx.fillStyle = C.line; for (let k = 0; k < Math.floor(w / 30); k++) { ctx.beginPath(); ctx.arc(x + 15 + k * 30, y, 5, 0, Math.PI); ctx.fill(); }
    const d = o.d || 72; [...s].forEach((c, i) => text(ctx, c, x + 50 + i * d, y + (o.h || 110) / 2 + 24, o.size || 64, { mono: true, weight: 800, align: "center", color: o.colors ? o.colors(i) : C.ink }));
    ctx.restore();
    return i => [x + 50 + i * d, y + (o.h || 110) / 2];
  }
  function supply(ctx, from, n, x, y, o = {}) {   // koin yang belum masuk
    label(ctx, "// KOIN BELUM MASUK", x, y - 50);
    if (from > n) { text(ctx, "semua sudah masuk", x, y + 12, 28, { weight: 700, color: C.mut }); return; }
    for (let v = from; v <= n; v++) { if (o.skipFirst && v === from) continue; coin(ctx, x + 34 + (v - from) * 80, y, 30, String(v), {}); }
  }
  function flyCoin(ctx, x0, y0, x1, y1, u, s, r = TR) { const e = ease(u); coin(ctx, lerp(x0, x1, e), lerp(y0, y1, e) - Math.sin(Math.PI * e) * 80, r, s, {}); }
  function buttons(ctx, x, y, hl, o = {}) {   // tiga tombol mesin
    [["B", "Buka", C.green], ["C", "Cetak", C.red], ["S", "Stop", C.ink]].forEach(([k, s, c], i) => {
      const cx = x + i * (o.d || 150), on = hl === k, r = o.r || 48;
      ctx.save(); ctx.globalAlpha *= (hl && !on && o.dim) ? 0.35 : 1;
      ctx.beginPath(); ctx.arc(cx, y + 6, r, 0, Math.PI * 2); ctx.fillStyle = "rgba(60,45,10,0.18)"; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, y, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); if (on) { ctx.lineWidth = 8; ctx.strokeStyle = C.gold; ctx.stroke(); }
      text(ctx, k, cx, y + r * 0.36, r, { mono: true, weight: 800, align: "center", color: C.white });
      if (o.labels !== false) text(ctx, s, cx, y + r + 40, 28, { weight: 800, align: "center", color: c });
      ctx.restore();
    });
  }

  Object.assign(Kiko.SCENES, {
    // ================= KAIT =================
    kait_lima(ctx, b, l) {
      const O = ["453216", "321654", "243651", "534621", "123456"];
      const t4 = at(b, "Empat"), tS = at(b, "satu"), tB = at(b, "Bisakah");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 150, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      O.forEach((s, i) => { const u = ap(l, 0.3 + i * 0.3); const y = 210 + i * 110;
        fadeIn(ctx, u, () => { paper(ctx, s, 560, y, 600, { h: 90, size: 56, d: 96 }); text(ctx, "ABCDE"[i], 500, y + 64, 44, { mono: true, weight: 800, align: "center", color: C.green }); });
        fadeIn(ctx, ap(l, t4 + 0.2), () => text(ctx, "?", 1220, y + 66, 56, { disp: true, weight: 800, color: C.red })); });
      fadeIn(ctx, ap(l, tS), () => { panel(ctx, 1320, 300, 460, 260, { stroke: C.red, lw: 4 }); text(ctx, "1 deretan", 1550, 400, 52, { disp: true, weight: 800, align: "center", color: C.red }); text(ctx, "tidak mungkin", 1550, 470, 40, { weight: 800, align: "center" }); text(ctx, "dicetak", 1550, 520, 40, { weight: 800, align: "center" }); });
      bigNote(ctx, "Yang mana?", 1550, 660, 56, ap(l, tB - 0.2), { color: C.red });
    },
    kait_mesin(ctx, b, l) {
      const tT = at(b, "tiga"), tTb = at(b, "tabung"), T = [at(b, "menjalankan"), at(b, "membalik"), at(b, "menemukan")];
      fadeIn(ctx, ap(l, tTb - 0.3), () => tube(ctx, 360, 760, [1, 3, 4], { cap: 5 }));
      fadeIn(ctx, ap(l, tT - 0.3), () => buttons(ctx, 620, 250, null, {}));
      const S = ["Jalankan mesinnya", "Balik cara kerjanya", "Temukan yang mustahil"];
      S.forEach((s, i) => fadeIn(ctx, ap(l, T[i] - 0.2), () => { const y = 430 + i * 110; panel(ctx, 600, y, 1100, 90, {}); text(ctx, String(i + 1), 650, y + 62, 44, { mono: true, weight: 800, align: "center", color: C.red }); text(ctx, s, 700, y + 60, 42, { disp: true, weight: 800 }); text(ctx, "Soal " + (11 + i), 1660, y + 58, 30, { mono: true, weight: 700, align: "right", color: C.mut }); }));
    },
    kait_judul(ctx, b, l) {
      const tS = at(b, "stack");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "Mesin Koin yang Ternyata", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Sebuah Stack", 960, 400, 84, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2025 · SMA · No. 11, 12, 13 · Mesin BCS", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tS - 0.3), () => { chip(ctx, "stack", 960, 580, { size: 48, color: C.white, fill: C.green, stroke: C.green, center: true, px: 30 }); text(ctx, "struktur data", 960, 720, 30, { mono: true, weight: 700, align: "center", color: C.mut }); });
    },

    // ================= MESIN BCS =================
    m_tabung(ctx, b, l) {
      const tT = at(b, "tabung"), tA = at(b, "atas"), tK = at(b, "koin");
      bigNote(ctx, "“Mesin BCS”", 960, 170, 60, ap(l, 0.1));
      fadeIn(ctx, ap(l, tT - 0.3), () => tube(ctx, 480, 770, [], { cap: 5 }));
      fadeIn(ctx, ap(l, tA - 0.3), () => { arrow(ctx, 640, 240, 520, 330, { color: C.red, lw: 5 }); text(ctx, "hanya dibuka dari atas", 660, 240, 32, { weight: 800, color: C.red }); });
      fadeIn(ctx, ap(l, tK - 0.3), () => { label(ctx, "// KOIN PAK DENGKLEK", 900, 470); for (let v = 1; v <= 6; v++) coin(ctx, 940 + (v - 1) * 110, 560, 42, v < 6 ? String(v) : "…", {}); });
    },
    m_tombol(ctx, b, l) {
      const k = b.tombol;
      buttons(ctx, 330, 230, k, { dim: true, d: 170 });
      const info = { B: ["Buka", "masukkan koin bernomor terkecil yang belum pernah masuk"], C: ["Cetak", "cetak nomor koin paling atas, lalu koin itu keluar"], S: ["Stop", "tabung harus kosong; kertas hasil cetakan keluar"] }[k];
      fadeIn(ctx, ap(l, 0.4), () => { panel(ctx, 160, 380, 760, 260, { stroke: C.green, lw: 3 }); text(ctx, "Tombol " + k + " = " + info[0], 200, 460, 48, { disp: true, weight: 800 }); para(ctx, info[1], 200, 530, 32, 680, { weight: 700, color: C.mut }); });
      // peragaan kecil di kanan
      const X = 1260, YB = 760;
      if (k === "B") {
        const tM = at(b, "memasukkan"); const u = clamp((l - tM) / 0.7, 0, 1);
        const pos = tube(ctx, X, YB, [1, 2], { cap: 5 });
        supply(ctx, 3, 6, 1400, 300, { skipFirst: u > 0 });
        if (u > 0 && u < 1) { const [tx, ty] = pos(2); flyCoin(ctx, 1434, 300, tx, ty, u, "3"); }
        if (u >= 1) { const [tx, ty] = pos(2); coin(ctx, tx, ty, TR, "3", {}); }
      } else if (k === "C") {
        const tM = at(b, "mencetak"); const u = clamp((l - tM) / 0.7, 0, 1);
        const pos = tube(ctx, X, YB, [1, 2, 3], { cap: 5, hide: u > 0 });
        const pp = paper(ctx, u >= 1 ? "3" : "", 1440, 420, 380, { h: 100 });
        if (u > 0 && u < 1) { const [sx, sy] = pos(2), [tx, ty] = pp(0); flyCoin(ctx, sx, sy, tx, ty, u, "3"); }
        label(ctx, "// KERTAS", 1440, 400);
      } else {
        const tK = at(b, "kertas"); const u = clamp((l - tK) / 0.8, 0, 1);
        tube(ctx, X, YB, [], { cap: 5 }); text(ctx, "kosong", X, YB - 200, 30, { mono: true, weight: 700, align: "center", color: C.mut });
        paper(ctx, "2431", 1400, 420 + (1 - ease(u)) * 60, 420, { h: 100, alpha: u, d: 80 });
        fadeIn(ctx, ap(l, tK + 0.6), () => text(ctx, "tanpa spasi", 1610, 590, 28, { mono: true, weight: 700, align: "center", color: C.mut }));
      }
    },
    mesin(ctx, b, l) {
      const seq = b.seq, N = b.n, off = b.off;
      const PT = pressTimes(b); let k = off; PT.forEach(t => { if (l >= t) k++; });
      const curIdx = k > off ? k - 1 : -1, tCur = k > off ? PT[k - off - 1] : -9, u = clamp((l - tCur) / 0.55, 0, 1);
      const prev = run(seq, Math.max(off, k - 1)), now = run(seq, k);
      // deretan tombol
      const d = seq.length > 14 ? 58 : 70, rowW = seq.length * d, x0 = 960 - rowW / 2;
      const LT = b.intro ? letterTimes(b) : null;
      seqRow(ctx, seq, x0, 120, { d, cur: curIdx, done: Math.max(0, k - 1) + (u >= 1 ? 1 : 0), a: LT ? (i => ap(l, (LT[i] || 99) - 0.15, 0.25)) : null });
      // tabung (kiri)
      const TX = 300, YB = 790; const cap = Math.max(5, ...[...Array(seq.length + 1).keys()].map(i => run(seq, i).st.length));
      const animating = curIdx >= 0 && u < 1; const c = animating ? seq[curIdx] : null;
      const showSt = animating && c === "C" ? prev.st : animating && c === "B" ? prev.st : now.st;
      const pos = tube(ctx, TX, YB, showSt, { cap: Math.min(cap, 6), hide: animating && c === "C" });
      // koin belum masuk
      const nextFrom = (animating && c === "B" ? prev.n : now.n) + 1;
      supply(ctx, nextFrom, N, 640, 330, { skipFirst: animating && c === "B" });
      // kertas target (soal 12 & 13)
      let PY = 470;
      if (b.target) {
        label(ctx, "// KERTAS YANG DICARI", 640, 440);
        const got = animating && c === "C" ? prev.out.length : now.out.length;
        paper(ctx, b.target, 640, 460, 110 + b.target.length * 72, { h: 90, size: 52, colors: i => i < got ? C.green : i === got ? C.red : C.mut });
        const [px] = [640 + 50 + got * 72]; if (got < b.target.length) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(px, 564); ctx.lineTo(px - 12, 584); ctx.lineTo(px + 12, 584); ctx.fill(); }
        PY = 640;
      }
      label(ctx, "// KERTAS HASIL CETAKAN", 640, PY - 20);
      const outS = animating && c === "C" ? prev.out : now.out;
      const pp = paper(ctx, outS, 640, PY, Math.max(600, 110 + N * 72), { h: b.target ? 100 : 120, size: b.target ? 56 : 64, stroke: now.done && u >= 1 ? C.green : C.line, lw: now.done ? 5 : 3 });
      if (animating && c === "B") { const [tx, ty] = pos(prev.st.length); flyCoin(ctx, 674, 330, tx, ty, u, String(prev.n + 1)); }
      if (animating && c === "C") { const [sx, sy] = pos(prev.st.length - 1), [tx, ty] = pp(prev.out.length); flyCoin(ctx, sx, sy, tx, ty, u, String(prev.st[prev.st.length - 1])); }
      if (now.done) fadeIn(ctx, ap(l, tCur + 0.2), () => chip(ctx, "SELESAI", 640 + Math.max(600, 110 + N * 72) + 30, PY + 28, { size: 30, color: C.white, fill: C.green, stroke: C.green }));
      // isi tabung dibacakan (m7, c5): tanda bawah→atas
      if (/dari bawah|paling atas/.test(b.text) && l > speechEnd(b) - 3) fadeIn(ctx, ap(l, speechEnd(b) - 3), () => { arrow(ctx, TX - 120, YB - 40, TX - 120, YB - 40 - (now.st.length) * TS + 20, { color: C.green, lw: 5 }); text(ctx, "bawah → atas", TX - 140, YB + 40, 24, { mono: true, weight: 700, color: C.green }); });
    },
    m_kunci(ctx, b, l) {
      const tA = at(b, "akhir"), tD = at(b, "dulu"), tH = at(b, "hanya");
      heading(ctx, "// KUNCI", "Masuk terakhir, keluar pertama", 1, 160);
      const pos = tube(ctx, 560, 790, [1, 3, 4], { cap: 5, hl: l > tA ? { 2: "rgba(232,197,90,0.55)" } : null });
      fadeIn(ctx, ap(l, tA - 0.2), () => { arrow(ctx, 780, 330, 620, 420, { color: C.green, lw: 6 }); text(ctx, "4 masuk paling akhir", 800, 330, 34, { weight: 800, color: C.green }); });
      fadeIn(ctx, ap(l, tD - 0.2), () => { arrow(ctx, 620, 400, 780, 470, { color: C.red, lw: 6 }); text(ctx, "4 keluar paling dulu", 800, 490, 34, { weight: 800, color: C.red }); });
      fadeIn(ctx, ap(l, tH - 0.2), () => { panel(ctx, 1000, 560, 760, 130, { stroke: C.line }); text(ctx, "Hanya koin paling atas yang bisa dicetak.", 1380, 640, 32, { weight: 800, align: "center", fit: 720 }); });
    },

    // ================= SOAL 11 =================
    soal_seq(ctx, b, l) {
      const LT = letterTimes(b), tK = at(b, "enam"), tA = at(b, "Apa");
      bigNote(ctx, "Soal 11", 960, 170, 56, ap(l, 0.1), { color: C.green });
      fadeIn(ctx, ap(l, tK - 0.3), () => { label(ctx, "// 6 KOIN", 400, 260); for (let v = 1; v <= 6; v++) coin(ctx, 440 + (v - 1) * 90, 330, 36, String(v), {}); });
      label(ctx, "// TOMBOL YANG DITEKAN", 400, 440);
      seqRow(ctx, b.seq, 400, 470, { d: 84, a: i => ap(l, (LT[i] || 99) - 0.15, 0.25) });
      fadeIn(ctx, ap(l, tA - 0.3), () => { text(ctx, "Isi kertas hasil cetakan:", 400, 680, 44, { weight: 800 }); paper(ctx, "??????", 980, 620, 520, { h: 90, size: 52, colors: () => C.red }); });
    },
    jawab11(ctx, b, l) {
      const tJ = at(b, "Jebakannya"), tM = at(b, "masuk");
      label(ctx, "// JAWABAN SOAL 11", 960, 170, { align: "center" });
      paper(ctx, "235416", 540, 220, 840, { h: 160, size: 110, d: 130, colors: i => i === 4 && l > tJ ? C.red : C.ink });
      fadeIn(ctx, ap(l, tJ - 0.2), () => { panel(ctx, 260, 450, 1400, 280, { stroke: C.red, lw: 3 }); label(ctx, "// JEBAKAN: KOIN 1", 300, 500, { color: C.red });
        tube(ctx, 1500, 720, [1, 4, 5], { cap: 3, hl: { 0: "rgba(210,56,43,0.35)" } }); });
      fadeIn(ctx, ap(l, tM - 0.2), () => { text(ctx, "Koin 1 masuk paling awal,", 300, 580, 40, { weight: 800 }); text(ctx, "tetapi tertahan di dasar tabung.", 300, 640, 40, { weight: 800, color: C.red }); });
    },

    // ================= SOAL 12 =================
    soal12(ctx, b, l) {
      const tK = at(b, "kertasnya"), tL = at(b, "lima"), tT = at(b, "Tombol");
      bigNote(ctx, "Soal 12 · Balik arah", 960, 170, 56, ap(l, 0.1), { color: C.green });
      fadeIn(ctx, ap(l, tK - 0.3), () => { label(ctx, "// 9 KOIN · KERTAS HASIL CETAKAN", 360, 280); });
      const D = "543628971";
      fadeIn(ctx, ap(l, tK - 0.3), () => paper(ctx, "", 360, 310, 1200, { h: 140 }));
      [...D].forEach((c, i) => { const u = ap(l, tL + i * 0.45, 0.25); if (u > 0) fadeIn(ctx, u, () => text(ctx, c, 430 + i * 125, 405, 90, { mono: true, weight: 800, align: "center" })); });
      fadeIn(ctx, ap(l, tT - 0.3), () => { text(ctx, "Tombol apa saja, dan urutannya?", 960, 560, 52, { disp: true, weight: 800, align: "center", color: C.red });
        seqRow(ctx, "?????????????????S", 960 - 18 * 58 / 2, 620, { d: 58 }); });
    },
    aturan(ctx, b, l) {
      const tU = at(b, "Untuk"), tS = at(b, "Setelah");
      heading(ctx, "// CARA MEMBALIK", "Dari kertas ke tombol", 1, 160);
      fadeIn(ctx, ap(l, tU - 0.2), () => { panel(ctx, 260, 300, 1400, 150, { stroke: C.green, lw: 3 }); chip(ctx, "B", 300, 340, { size: 44, color: C.white, fill: C.green, stroke: C.green }); text(ctx, "Tekan B sampai koin nomor itu sudah masuk", 420, 395, 40, { weight: 800, fit: 1200 }); });
      fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, 260, 480, 1400, 150, { stroke: C.red, lw: 3 }); chip(ctx, "C", 300, 520, { size: 44, color: C.white, fill: C.red, stroke: C.red }); text(ctx, "Kalau koin itu paling atas, tekan C", 420, 575, 40, { weight: 800, fit: 1200 }); });
      note(ctx, "ulangi untuk setiap nomor di kertas, lalu S", 960, 700, 30, ap(l, tS + 1.2), { mono: true, color: C.mut });
    },
    jawab12(ctx, b, l) {
      const tT = at(b, "Totalnya"), G = [["BBBBB", "5"], ["CCC", "3"], ["B", ""], ["CC", "2"], ["BB", "2"], ["C", ""], ["B", ""], ["CCC", "3"], ["S", ""]];
      label(ctx, "// JAWABAN SOAL 12", 960, 170, { align: "center" });
      let x = 960 - 19 * 84 / 2; const TL2 = letterish(b);
      G.forEach(([s, n], gi) => { const u = ap(l, TL2[gi] - 0.2); fadeIn(ctx, u, () => {
        seqRow(ctx, s, x, 300, { d: 84 }); if (n) text(ctx, n + "×", x + s.length * 84 / 2 - 4, 400, 30, { mono: true, weight: 800, align: "center", color: C.mut });
        rr(ctx, x - 4, 290, s.length * 84, 72, 10); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(124,115,95,0.5)"; ctx.stroke(); }); x += s.length * 84; });
      fadeIn(ctx, ap(l, tT - 0.2), () => { panel(ctx, 460, 480, 1000, 200, { stroke: C.green, lw: 4 }); text(ctx, "19 tombol = 2 × 9 + 1", 960, 600, 64, { mono: true, weight: 800, align: "center", color: C.green }); });
      function letterish(b) {   // waktu tiap kelompok: dibagi rata antara "adalah" dan "lalu S"
        const t0 = at(b, "adalah"), t1 = at(b, "S"); return G.map((_, i) => lerp(t0, t1, i / (G.length - 1)));
      }
    },

    // ================= SOAL 13 =================
    pilihan(ctx, b, l) {
      const O = ["453216", "321654", "243651", "534621", "123456"]; const mode = b.mode;
      const tE = at(b, "pilihan"), tQ = at(b, "manakah");
      const X = mode === "tanya" ? 560 : 260;
      O.forEach((s, i) => { const y = 160 + i * 112; const u = mode === "tanya" ? ap(l, tE + i * 0.3) : 1;
        fadeIn(ctx, u, () => {
          const isD = i === 3; paper(ctx, s, X, y, 560, { h: 92, size: 56, d: 88 });
          text(ctx, "ABCDE"[i], X - 50, y + 64, 44, { mono: true, weight: 800, align: "center", color: C.green });
          if (mode === "cek") { const tc = at(b, i === 4 ? "E" : "ABCE"[i] ? ["A", "B", "C", "x", "E"][i] : "x", i === 4 ? 2 : 1); const tt = at(b, "selesai");
            if (!isD) check(ctx, X + 610, y + 46, 54, C.green, clamp((l - tt + 0.4 - i * 0.15) / 0.4, 0, 1)); else note(ctx, "?", X + 610, y + 66, 56, ap(l, tt), { color: C.red }); }
        }); });
      if (mode === "tanya") fadeIn(ctx, ap(l, tQ - 0.3), () => { panel(ctx, 1240, 300, 520, 220, { stroke: C.red, lw: 4 }); text(ctx, "Mana yang", 1500, 390, 44, { weight: 800, align: "center" }); text(ctx, "TIDAK MUNGKIN?", 1500, 460, 48, { disp: true, weight: 800, align: "center", color: C.red }); });
      if (mode === "aturan") {
        const tK = at(b, "Kalau", 1), tK2 = at(b, "Kalau", 2);
        fadeIn(ctx, ap(l, 0.2), () => { panel(ctx, 960, 200, 820, 140, { stroke: C.line }); text(ctx, "Pakai cara soal 12 pada setiap kertas", 1370, 285, 34, { weight: 800, align: "center", fit: 760 }); });
        fadeIn(ctx, ap(l, tK - 0.2), () => { panel(ctx, 960, 370, 820, 140, { stroke: C.green, lw: 3 }); text(ctx, "berjalan sampai akhir → mungkin", 1370, 455, 34, { weight: 800, align: "center", color: C.green, fit: 760 }); });
        fadeIn(ctx, ap(l, tK2 - 0.2), () => { panel(ctx, 960, 540, 820, 140, { stroke: C.red, lw: 3 }); text(ctx, "nomornya tertutup koin lain → mustahil", 1370, 625, 34, { weight: 800, align: "center", color: C.red, fit: 760 }); });
      }
      if (mode === "cek") { const tM = at(b, "Misalnya");
        fadeIn(ctx, ap(l, tM - 0.2), () => { panel(ctx, 1000, 640, 800, 120, { stroke: C.green, lw: 3 }); text(ctx, "E: BC BC BC BC BC BC S", 1400, 715, 36, { mono: true, weight: 800, align: "center", color: C.green, fit: 760 }); });
        hilite(ctx, X - 90, 160 + 4 * 112 - 10, 760, 112, C.green, ap(l, tM - 0.2), "rgba(31,122,85,0.06)"); }
    },
    macet(ctx, b, l) {
      const tT = at(b, "tiga"), tTt = at(b, "tertutup"), tP = at(b, "atas"), tJ = at(b, "Jadi");
      const hl = l > tTt ? { 2: "rgba(210,56,43,0.4)", 3: l > tP ? "rgba(232,197,90,0.6)" : null } : null;
      tube(ctx, 380, 790, [1, 2, 3, 4], { cap: 5, hl });
      label(ctx, "// KERTAS YANG DICARI", 700, 220);
      paper(ctx, "534621", 700, 240, 560, { h: 100, size: 60, colors: i => i === 0 ? C.green : i === 1 && l > tT - 0.2 ? C.red : C.mut });
      label(ctx, "// SUDAH TERCETAK", 700, 420); paper(ctx, "5", 700, 440, 560, { h: 100, size: 60 });
      fadeIn(ctx, ap(l, tTt - 0.2), () => { arrow(ctx, 640, 560, 480, 560, { color: C.red, lw: 6 }); text(ctx, "3 di bawah 4", 660, 590, 36, { weight: 800, color: C.red }); });
      fadeIn(ctx, ap(l, tP - 0.2), () => text(ctx, "yang bisa dicetak hanya 4", 660, 650, 32, { weight: 700, color: C.goldInk }));
      fadeIn(ctx, ap(l, tJ - 0.2), () => { panel(ctx, 1340, 420, 420, 260, { stroke: C.purple, lw: 5 }); text(ctx, "D", 1550, 560, 120, { mono: true, weight: 800, align: "center", color: C.purple }); text(ctx, "mustahil", 1550, 640, 36, { weight: 800, align: "center", color: C.purple }); cross(ctx, 1640, 470, 50, C.purple, clamp((l - tJ) / 0.5, 0, 1)); });
    },
    jawab13(ctx, b, l) {
      const tP = at(b, "Pola"), tS = at(b, "Setelah");
      label(ctx, "// JAWABAN SOAL 13", 960, 170, { align: "center" });
      paper(ctx, "534621", 560, 210, 600, { h: 110, size: 64, d: 88, colors: i => i === 1 || i === 2 ? C.purple : C.ink }); text(ctx, "D", 500, 286, 56, { mono: true, weight: 800, align: "center", color: C.purple });
      fadeIn(ctx, ap(l, tP - 0.2), () => { panel(ctx, 260, 400, 1400, 340, { stroke: C.green, lw: 3 }); label(ctx, "// POLA UMUM", 300, 450); });
      fadeIn(ctx, ap(l, tS - 0.2), () => {
        text(ctx, "Setelah 5 dicetak, sisa di tabung harus keluar menurun:", 300, 520, 34, { weight: 800, fit: 1320 });
        ["4", "3", "2", "1"].forEach((s, i) => { const u = ap(l, tS + 0.8 + i * 0.35); fadeIn(ctx, u, () => { coin(ctx, 420 + i * 220, 630, 44, s, {}); if (i < 3) text(ctx, "→", 530 + i * 220, 645, 44, { mono: true, weight: 800, align: "center", color: C.green }); }); });
        text(ctx, "(boleh diselingi koin baru)", 1180, 645, 28, { mono: true, weight: 700, color: C.mut, fit: 440 });
      });
    },

    // ================= KONSEP =================
    stack(ctx, b, l) {
      const tT = at(b, "tumpukan"), tP = at(b, "push"), tO = at(b, "pop");
      heading(ctx, "// KONSEP", "Stack (tumpukan)", 1, 150);
      const X = 600, items = ["data 1", "data 2", "data 3"];
      fadeIn(ctx, ap(l, tT - 0.3), () => items.forEach((s, i) => { rr(ctx, X - 160, 650 - i * 90, 320, 76, 10); ctx.fillStyle = i === 2 ? C.gold2 : C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.stroke(); text(ctx, s, X, 650 - i * 90 + 50, 32, { mono: true, weight: 800, align: "center" }); }));
      fadeIn(ctx, ap(l, tP - 0.3), () => { arrow(ctx, X + 300, 340, X + 180, 440, { color: C.green, lw: 6 }); chip(ctx, "push", X + 310, 300, { size: 40, color: C.white, fill: C.green, stroke: C.green }); text(ctx, "taruh di atas", X + 320, 400, 30, { weight: 700, color: C.green }); });
      fadeIn(ctx, ap(l, tO - 0.3), () => { arrow(ctx, X - 180, 440, X - 300, 340, { color: C.red, lw: 6 }); chip(ctx, "pop", X - 440, 300, { size: 40, color: C.white, fill: C.red, stroke: C.red }); text(ctx, "ambil yang atas", X - 500, 400, 30, { weight: 700, color: C.red }); });
      fadeIn(ctx, ap(l, tP - 0.3), () => { panel(ctx, 1200, 420, 560, 200, {}); text(ctx, "hanya bagian atas", 1480, 510, 40, { disp: true, weight: 800, align: "center" }); text(ctx, "yang bisa disentuh", 1480, 570, 32, { weight: 700, align: "center", color: C.mut }); });
    },
    lifo(ctx, b, l) {
      const tL = at(b, "last"), tA = at(b, "artinya"), tB = at(b, "B"), tC = at(b, "C");
      heading(ctx, "// KONSEP", "LIFO", 1, 150);
      fadeIn(ctx, ap(l, tL - 0.3), () => { let x = 645; [["L", "ast "], ["I", "n, "], ["F", "irst "], ["O", "ut"]].forEach(([a, r]) => { const w1 = text(ctx, a, x, 380, 80, { disp: true, weight: 800, color: C.red }); const w2 = text(ctx, r, x + w1, 380, 80, { disp: true, weight: 800 }); x += w1 + w2 + 10; }); });
      note(ctx, "= masuk terakhir, keluar pertama", 960, 460, 38, ap(l, tA - 0.3), { color: C.green, weight: 800 });
      fadeIn(ctx, ap(l, tB - 0.3), () => { panel(ctx, 520, 540, 400, 150, { stroke: C.green, lw: 3 }); chip(ctx, "B", 560, 575, { size: 44, color: C.white, fill: C.green, stroke: C.green }); text(ctx, "= push", 660, 635, 48, { mono: true, weight: 800, color: C.green }); });
      fadeIn(ctx, ap(l, tC - 0.3), () => { panel(ctx, 1000, 540, 400, 150, { stroke: C.red, lw: 3 }); chip(ctx, "C", 1040, 575, { size: 44, color: C.white, fill: C.red, stroke: C.red }); text(ctx, "= pop", 1140, 635, 48, { mono: true, weight: 800, color: C.red }); });
    },
    sehari(ctx, b, l) {
      const tU = at(b, "undo"), tK = at(b, "kembali");
      heading(ctx, "// STACK DI SEKITAR KITA", "Kamu memakainya setiap hari", 1, 150);
      fadeIn(ctx, ap(l, tU - 0.3), () => {
        panel(ctx, 300, 320, 600, 400, {});
        ctx.save(); ctx.strokeStyle = C.green; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(620, 480, 80, Math.PI * 1.05, Math.PI * 1.95, false); ctx.stroke();
        ctx.fillStyle = C.green; ctx.beginPath(); ctx.moveTo(522, 440); ctx.lineTo(560, 500); ctx.lineTo(500, 510); ctx.fill(); ctx.restore();
        text(ctx, "Undo", 600, 640, 52, { disp: true, weight: 800, align: "center" }); text(ctx, "batalkan langkah terakhir dulu", 600, 690, 26, { weight: 700, align: "center", color: C.mut });
      });
      fadeIn(ctx, ap(l, tK - 0.3), () => {
        panel(ctx, 1020, 320, 600, 400, {}); rr(ctx, 1020, 320, 600, 56, 16); ctx.fillStyle = "#EFE8D6"; ctx.fill();
        text(ctx, "←", 1060, 362, 40, { mono: true, weight: 800, color: C.red });
        ["halaman 3", "halaman 2", "halaman 1"].forEach((s, i) => { rr(ctx, 1170, 410 + i * 64, 300, 52, 8); ctx.fillStyle = i === 0 ? C.gold2 : C.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke(); text(ctx, s, 1320, 445 + i * 64, 26, { mono: true, weight: 700, align: "center" }); });
        text(ctx, "Kembali di browser", 1320, 690, 40, { disp: true, weight: 800, align: "center", fit: 560 });
      });
    }
  });
})();
