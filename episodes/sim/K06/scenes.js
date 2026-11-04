/* K06 Simulasi konsep: mencari dan mengurutkan kartu, sambil menghitung langkah.
   Cari satu per satu (kartu acak), cari belah dua (kartu urut), mengurutkan dengan cara D8.2 (cari terkecil, pindah ke depan),
   lalu 8 lawan 16 kartu. Memakai pembantu gambar D8.2 (Kiko.kartu). Semua hitungan langkah disimulasikan dengan python3 (lihat laporan). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Q = K.kartu;
  const { rr, text, para, wrap, card, kiko, bubble, ease, clamp, lerp } = H;
  const DEEP = "#1F5A6E", AMBER = "#B57A12";
  const RAND = [72, 55, 90, 60, 78, 68, 95, 85], SORTED = [55, 60, 68, 72, 78, 85, 90, 95];
  // deretan 8 kartu besar
  const CWD = 150, CHT = 190, GAP = 22, X0 = 960 - (8 * CWD + 7 * GAP) / 2, ROWY = 270;
  const cxOf = i => X0 + i * (CWD + GAP) + CWD / 2;
  // langkah cari belah dua: [{m, v, lo, hi}] (lo/hi sesudah langkah)
  function binSteps(a, t) { let lo = 0, hi = a.length - 1; const s = []; while (lo <= hi) { const m = Math.floor((lo + hi) / 2); const r = { m, v: a[m], lo0: lo, hi0: hi }; if (a[m] === t) { r.found = true; s.push(r); break; } if (a[m] < t) lo = m + 1; else hi = m - 1; r.lo = lo; r.hi = hi; s.push(r); } return s; }
  // langkah mengurutkan (cari terkecil, pindah ke depan), sama dengan D8.2
  function selSteps(a) {
    const arr = a.slice(), st = []; let cmp = 0, mv = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      let m = i;
      for (let j = i + 1; j < arr.length; j++) { cmp++; st.push({ arr: arr.slice(), i, j, m, cmp, mv, kind: "cmp", round: i }); if (arr[j] < arr[m]) m = j; }
      if (m !== i) { st.push({ arr: arr.slice(), i, j: -1, m, cmp, mv, kind: "pick", round: i }); [arr[i], arr[m]] = [arr[m], arr[i]]; mv++; st.push({ arr: arr.slice(), i, j: -1, m: i, cmp, mv, kind: "mv", from: m, round: i }); }
      else st.push({ arr: arr.slice(), i, j: -1, m: i, cmp, mv, kind: "stay", round: i });
    }
    st.push({ arr: arr.slice(), i: arr.length, j: -1, m: -1, cmp, mv, kind: "done", round: arr.length - 1 });
    return st;
  }
  const SEL = selSteps(RAND);
  const at = (b, f) => (b.audio || b.dur) * f;
  function header(ctx, s, x, y, opt = {}) { text(ctx, s, x, y, opt.size || 28, { weight: 900, color: opt.color || C.accentDark, align: opt.align || "left" }); }
  function ring(ctx, x, y, frac) {
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 40, -Math.PI / 2, -Math.PI / 2 + clamp(frac, 0, 1) * Math.PI * 2); ctx.stroke();
  }
  function counterBox(ctx, x, y, w, n, label, opt = {}) {
    card(ctx, x, y, w, 120, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 18 });
    text(ctx, String(n), x + w / 2, y + 68, 58, { align: "center", weight: 900, color: opt.color || AMBER });
    text(ctx, label, x + w / 2, y + 104, 22, { align: "center", weight: 800, color: C.ink2 });
  }
  // panah penunjuk di atas kartu
  function pointer(ctx, cx, y, col) { ctx.fillStyle = col || C.accent; ctx.beginPath(); ctx.moveTo(cx - 18, y - 30); ctx.lineTo(cx + 18, y - 30); ctx.lineTo(cx, y - 6); ctx.closePath(); ctx.fill(); }
  function bigRow(ctx, values, opt = {}) {
    Q.row(ctx, X0, ROWY, values, { w: CWD, h: CHT, gap: GAP, index: true, ...opt });
  }
  // papan langkah (kanan)
  const BOARD = [["v1", "cari 72 (paling depan)", "1"], ["v1", "cari 85 (paling belakang)", "8"], ["v2", "cari 80 (tidak ada)", "8"], ["v3", "kartu urut, cari 85", "2"], ["v3", "kartu urut, cari 80", "3"], ["v4", "mengurutkan 8 kartu", "28"]];
  function board(ctx, x, y, w, upto) {
    const keys = ["v1", "v2", "v3", "v4"], rows = BOARD.filter(r => keys.indexOf(r[0]) <= keys.indexOf(upto));
    const h = 84 + rows.length * 76;
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 });
    header(ctx, "PAPAN LANGKAH", x + w / 2, y + 48, { align: "center", size: 26 });
    rows.forEach(([k, s, n], i) => {
      const yy = y + 70 + i * 76, now = k === upto;
      ctx.fillStyle = now ? "#FFF3D6" : "#F4F7F5"; rr(ctx, x + 14, yy, w - 28, 66, 12); ctx.fill();
      text(ctx, s, x + 30, yy + 42, 23, { weight: 800, fit: w - 150 });
      text(ctx, n, x + w - 30, yy + 44, 30, { align: "right", weight: 900, color: n === "28" ? DEEP : +n <= 3 ? C.good : C.bad });
    });
    if (upto === "v4") text(ctx, "28 = membandingkan", x + w - 24, y + h + 30, 20, { align: "right", weight: 700, color: C.ink2 });
  }
  const VQ = {
    v1: { no: 1, lab: "ANGKA DI DEPAN DAN DI BELAKANG", line: "Kartu acak, dibuka satu per satu dari kiri." },
    v2: { no: 2, lab: "ANGKA YANG TIDAK ADA", line: "Kartu acak. Kita mencari 80." },
    v3: { no: 3, lab: "KARTU SUDAH URUT", line: "Kartu urut dari kecil ke besar. Kita mencari 85." },
    v4: { no: 4, lab: "MENGURUTKAN", line: "Cara D8.2: cari yang terkecil, pindahkan ke depan." },
    v5: { no: 5, lab: "8 LAWAN 16 KARTU", line: "Kartunya dua kali lebih banyak." }
  };
  // gambar kecil untuk pertanyaan tiap variasi
  function qVisual(ctx, v, x, y, s = 1) {
    const w = 96 * s, h = 124 * s, g = 14 * s;
    if (v === "v1" || v === "v2" || v === "v3") {
      const vals = v === "v3" ? SORTED : RAND;
      Q.row(ctx, x, y, vals, { w, h, gap: g, open: [] });
      if (v === "v1") { text(ctx, "paling depan", x + w / 2, y + h + 40 * s, 24 * s, { align: "center", weight: 900, color: C.good }); text(ctx, "paling belakang", x + 7 * (w + g) + w / 2, y + h + 40 * s, 24 * s, { align: "center", weight: 900, color: C.bad }); }
      if (v === "v2") { card(ctx, x + 8 * (w + g) + 10, y + 10 * s, 150 * s, h - 20 * s, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 14 }); text(ctx, "80?", x + 8 * (w + g) + 10 + 75 * s, y + h / 2 + 16 * s, 46 * s, { align: "center", weight: 900, color: AMBER }); }
      if (v === "v3") { text(ctx, "kecil  →  besar", x + 4 * (w + g) - g / 2, y + h + 40 * s, 26 * s, { align: "center", weight: 900, color: DEEP }); }
    } else if (v === "v4") {
      Q.row(ctx, x, y, RAND, { w, h, gap: g });
      text(ctx, "urutkan dari kecil ke besar", x + 4 * (w + g) - g / 2, y + h + 40 * s, 26 * s, { align: "center", weight: 900, color: DEEP });
    } else {
      const sw = 44 * s, sh = 58 * s, sg = 8 * s;
      text(ctx, "8 kartu", x, y + 22 * s, 24 * s, { weight: 900, color: C.ink2 }); Q.row(ctx, x + 130 * s, y, RAND, { w: sw, h: sh, gap: sg, open: [] });
      text(ctx, "16 kartu", x, y + 112 * s, 24 * s, { weight: 900, color: C.ink2 }); Q.row(ctx, x + 130 * s, y + 90 * s, RAND.concat(RAND), { w: sw, h: sh, gap: sg, open: [] });
    }
  }

  Object.assign(K.SCENES, {
    k6_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      header(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, { size: 30 });
      ["menghitung langkah mencari", "mencari dengan cara belah dua", "menghitung langkah mengurutkan", "memilih cara yang paling hemat"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800, fit: 670 }); ctx.globalAlpha = 1;
      });
      const open = [0, 1, 2, 3].filter(i => l > 1 + i * 0.8);
      Q.row(ctx, 1100, 330, SORTED.slice(0, 4), { w: 120, h: 156, gap: 18, open });
      counterBox(ctx, 1170, 560, 360, open.length, "langkah");
    },
    k6_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      header(ctx, "EPISODE YANG DILENGKAPI", 960, 240, { align: "center", size: 32 });
      card(ctx, 330, 290, 600, 300, { fill: C.bg2, r: 22 });
      text(ctx, "D8.2", 630, 370, 56, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Memecahkan Persoalan dengan Data Kecil", 630, 430, 34, 520, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "mencari · mengurutkan · menghitung langkah", 630, 560, 24, { align: "center", weight: 600, color: C.ink2 });
      card(ctx, 990, 290, 600, 300, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 4, r: 22 });
      text(ctx, "Ikut bermain di rumah:", 1290, 350, 30, { align: "center", weight: 900 });
      [55, 72, 90, 60].forEach((v, i) => Q.card(ctx, 1060 + i * 120, 380, 100, 130, v, { size: 40 }));
      text(ctx, "8 kertas kecil berisi angka", 1290, 560, 26, { align: "center", weight: 800, color: C.ink2 });
      kiko(ctx, 1640, 720, 110, 0, { wave: l });
    },
    k6_aturan(ctx, b, l) {
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "ATURAN MAIN", 960, 205, { align: "center", size: 30 });
      const opened = l > at(b, 0.55) ? [0] : [];
      bigRow(ctx, RAND, { open: opened, hl: opened.length ? { 0: C.accent } : {} });
      const r1 = l > at(b, 0.45), r2 = l > at(b, 0.7);
      card(ctx, 260, 560, 560, 130, { fill: r1 ? "#FFF3D6" : "#F4F7F5", stroke: r1 ? C.accent : null, lw: 4, r: 18 }); text(ctx, "buka 1 kartu", 540, 615, 34, { align: "center", weight: 900 }); text(ctx, "= 1 langkah", 540, 665, 30, { align: "center", weight: 800, color: AMBER });
      card(ctx, 860, 560, 560, 130, { fill: r2 ? "#FFF3D6" : "#F4F7F5", stroke: r2 ? C.accent : null, lw: 4, r: 18 }); text(ctx, "bandingkan 2 kartu", 1140, 615, 34, { align: "center", weight: 900 }); text(ctx, "= 1 langkah", 1140, 665, 30, { align: "center", weight: 800, color: AMBER });
      counterBox(ctx, 1480, 565, 260, opened.length + (r2 ? 1 : 0), "langkah");
      text(ctx, "Langkah paling sedikit = cara paling cepat.", 960, 770, 30, { align: "center", weight: 800, color: DEEP });
    },
    k6_tanya(ctx, b, l) {
      const q = VQ[b.v];
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "VARIASI " + q.no + " DARI 5 · " + q.lab, 200, 210);
      text(ctx, "Menurutmu, apa yang terjadi kalau…", 200, 290, 44, { weight: 900 });
      text(ctx, q.line, 200, 350, 32, { weight: 800, color: C.ink2 });
      qVisual(ctx, b.v, 200, 410, b.v === "v5" ? 1.15 : 1.22);
      kiko(ctx, 1620, 650, 170, 0, { mood: "confused" });
      if (l > 0.6) bubble(ctx, 1480, 470, 260, "Berapa langkah, ya?", 30, { tailX: 1600, tailDir: 10 });
    },
    k6_tebak(ctx, b, l) {
      const q = VQ[b.v];
      card(ctx, 120, 140, 1680, 690, { stroke: C.accent, lw: 6 });
      header(ctx, "VARIASI " + q.no + " · TEBAK DULU", 200, 210, { size: 30 });
      text(ctx, q.line, 200, 270, 34, { weight: 800, color: C.ink2 });
      (b.pilih || []).forEach((o, i) => {
        const x = 200 + i * 520; card(ctx, x, 380, 480, 240, { fill: C.bg2, stroke: "#CFDCD5", lw: 3, r: 22 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 240, 445, 32, 0, Math.PI * 2); ctx.fill();
        text(ctx, "ABC"[i], x + 240, 458, 34, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, o, x + 240, 565, 42, { align: "center", weight: 900, fit: 440 });
      });
      ring(ctx, 1700, 210, l / b.dur);
      text(ctx, "Pilih satu dalam hati, lalu lihat hasilnya.", 960, 720, 32, { align: "center", weight: 700, color: C.ink2 });
    },
    k6_linear(ctx, b, l) {
      const t = b.target, a = b.audio || b.dur, pos = RAND.indexOf(t), last = pos >= 0 ? pos : 7;
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "MENCARI " + t + " DI KARTU ACAK · SATU PER SATU DARI KIRI", 960, 205, { align: "center" });
      const t0 = t === 72 ? 0.62 : 0.2, t1 = t === 72 ? 0.62 : 0.82;
      const k = t === 72 ? (l > at(b, t0) ? 1 : 0) : clamp(Math.floor((l - at(b, t0)) / ((at(b, t1) - at(b, t0)) / last)) + 1, 0, last + 1);
      const open = [...Array(k).keys()], hl = {}, fills = {};
      open.forEach(i => { if (RAND[i] === t) { hl[i] = C.good; fills[i] = C.goodBg; } else fills[i] = "#F4F6F5"; });
      if (k > 0 && k <= 8 && RAND[k - 1] !== t) hl[k - 1] = C.accent;
      bigRow(ctx, RAND, { open, hl, fills });
      if (k < 8 && !(pos >= 0 && k > pos)) pointer(ctx, cxOf(k), ROWY, C.accent);
      const done = pos >= 0 ? k > pos : k >= 8;
      counterBox(ctx, 283, 560, 300, k, "langkah", done ? (pos >= 0 ? { fill: C.goodBg, stroke: C.good, color: C.good } : { fill: C.badBg, stroke: C.bad, color: C.bad }) : {});
      let msg = "", col = C.ink2;
      if (k > 0 && !done) { msg = RAND[k - 1] + "? Bukan " + t + ". Lanjut ke kartu berikutnya."; }
      if (done) { msg = pos >= 0 ? "Ketemu! " + t + " di kartu ke-" + (pos + 1) + ": " + (pos + 1) + " langkah." : "Semua kartu sudah dibuka: 80 tidak ada."; col = pos >= 0 ? C.good : C.bad; }
      if (msg) text(ctx, msg, 630, 632, 34, { weight: 900, color: col, fit: 1080 });
      if (done && pos < 0) text(ctx, "Baru yakin setelah 8 langkah.", 630, 680, 28, { weight: 800, color: C.ink2 });
      if (done && pos === 7) text(ctx, "Paling sial: kartu terakhir.", 630, 680, 28, { weight: 800, color: C.ink2 });
      if (done && pos === 0) text(ctx, "Untung: kartu pertama.", 630, 680, 28, { weight: 800, color: C.ink2 });
    },
    k6_biner(ctx, b, l) {
      const t = b.target, a = b.audio || b.dur, S = binSteps(SORTED, t);
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "MENCARI " + t + " DI KARTU URUT · CARA BELAH DUA", 960, 186, { align: "center" });
      // jadwal: buka kartu, lalu buang sebagian
      const marks = t === 85 ? [[0.1, 0.32], [0.62, 0.62]] : [[0.12, 0.25], [0.32, 0.45], [0.52, 0.62]];
      let k = 0, discarded = false;
      marks.forEach(([o, d], i) => { if (l > at(b, o)) { k = i + 1; discarded = l > at(b, d); } });
      const open = [], hl = {}, dim = [], fills = {};
      for (let i = 0; i < k; i++) { const s = S[i]; open.push(s.m); hl[s.m] = s.found ? C.good : C.accent; if (s.found) fills[s.m] = C.goodBg; }
      // kartu yang sudah dibuang
      const lastDone = discarded ? k : k - 1;
      if (lastDone > 0) { const s = S[lastDone - 1]; if (!s.found) for (let i = 0; i < 8; i++) if (i < s.lo || i > s.hi) dim.push(i); }
      bigRow(ctx, SORTED, { open, hl, dim, fills });
      // kurung sisa kandidat
      const cur = k < S.length ? S[k] : null, s0 = lastDone > 0 ? S[lastDone - 1] : null;
      const lo = s0 ? (s0.found ? s0.m : s0.lo) : 0, hi = s0 ? (s0.found ? s0.m : s0.hi) : 7;
      if (lo <= hi) { const x1 = X0 + lo * (CWD + GAP) - 8, x2 = X0 + hi * (CWD + GAP) + CWD + 8; ctx.strokeStyle = DEEP; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x1, ROWY - 12); ctx.lineTo(x1, ROWY - 24); ctx.lineTo(x2, ROWY - 24); ctx.lineTo(x2, ROWY - 12); ctx.stroke(); text(ctx, "masih mungkin: " + (hi - lo + 1) + " kartu", (x1 + x2) / 2, ROWY - 34, 22, { align: "center", weight: 800, color: DEEP }); }
      const found = S[k - 1] && S[k - 1].found, none = !found && lo > hi;
      counterBox(ctx, 283, 560, 300, k, "langkah", found ? { fill: C.goodBg, stroke: C.good, color: C.good } : none ? { fill: "#E7F1FB", stroke: DEEP, color: DEEP } : {});
      const lines = [];
      for (let i = 0; i < k; i++) { const s = S[i]; lines.push((i + 1) + ". buka " + s.v + (s.found ? ": ketemu!" : s.v < t ? " < " + t + ": buang kiri" : " > " + t + ": buang kanan")); }
      lines.forEach((s, i) => text(ctx, s, 630, 600 + i * 46, 30, { weight: 900, color: i === lines.length - 1 ? (found ? C.good : C.ink) : C.ink2, fit: 700 }));
      if (none && discarded) text(ctx, "Tidak ada kartu tersisa, jadi 80 pasti tidak ada.", 630, 760, 30, { weight: 900, color: DEEP, fit: 1100 });
      if (found) text(ctx, "Hanya " + k + " langkah!", 1350, 600, 34, { weight: 900, color: C.good });
    },
    k6_hasil(ctx, b, l) {
      const a = b.audio || b.dur;
      card(ctx, 120, 140, 1130, 690);
      header(ctx, "HASIL VARIASI " + VQ[b.v].no, 170, 200);
      if (b.v === "v1") {
        [[72, 0, "paling cepat: 1 langkah", C.good], [85, 7, "paling lama: 8 langkah", C.bad]].forEach(([t, p, s, col], r) => {
          const y = 250 + r * 250; text(ctx, "cari " + t, 170, y + 40, 30, { weight: 900 });
          const open = [...Array(p + 1).keys()]; const fills = {}; open.forEach(i => fills[i] = i === p ? C.goodBg : "#F4F6F5");
          Q.row(ctx, 170, y + 60, RAND, { w: 96, h: 120, gap: 12, open, hl: { [p]: C.good }, fills });
          text(ctx, s, 1180, y + 40, 30, { align: "right", weight: 900, color: col });
        });
      } else if (b.v === "v2") {
        const fills = {}; RAND.forEach((_, i) => fills[i] = "#F4F6F5");
        Q.row(ctx, 170, 260, RAND, { w: 110, h: 140, gap: 18, fills });
        text(ctx, "80 tidak ada di kartu mana pun.", 170, 480, 34, { weight: 900, color: C.bad });
        para(ctx, "Selama masih ada kartu tertutup, 80 mungkin ada di sana. Jadi semua kartu harus dibuka: 8 langkah.", 170, 540, 30, 1020, { weight: 700, color: C.ink2, lh: 1.3 });
      } else if (b.v === "v3") {
        const ns = [8, 4, 2, 1], u = clamp(Math.floor((l - 0.3) / (a * 0.18)) + 1, 1, 4);
        ns.slice(0, u).forEach((n, i) => {
          const y = 240 + i * 135; text(ctx, "langkah " + (i + 1), 170, y + 60, 28, { weight: 900, color: C.ink2 });
          for (let c = 0; c < 8; c++) { const on = c < n; ctx.fillStyle = on ? C.kiko : "#E3EAE6"; rr(ctx, 340 + c * 82, y + 20, 70, 88, 10); ctx.fill(); }
          text(ctx, n + (n > 1 ? " kartu masih mungkin" : " kartu tersisa"), 1010, y + 72, 26, { weight: 800, color: n === 1 ? C.good : C.ink2, fit: 220 });
        });
        if (u >= 4) text(ctx, "Paling lama 4 langkah, bukan 8.", 170, 805, 30, { weight: 900, color: C.good });
      } else {
        // tangga 7 + 6 + … + 1 = 28
        const rows = [7, 6, 5, 4, 3, 2, 1], u = clamp(Math.floor((l - 0.3) / (a * 0.08)) + 1, 0, 7);
        rows.forEach((n, i) => { if (i >= u) return; const y = 235 + i * 62;
          text(ctx, "putaran " + (i + 1), 170, y + 38, 24, { weight: 800, color: C.ink2 });
          for (let c = 0; c < n; c++) { ctx.fillStyle = "#FFF3D6"; rr(ctx, 320 + c * 70, y + 6, 60, 46, 8); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 2; rr(ctx, 320 + c * 70, y + 6, 60, 46, 8); ctx.stroke(); }
          text(ctx, String(n), 320 + n * 70 + 14, y + 40, 28, { weight: 900, color: AMBER });
        });
        if (u >= 7) { card(ctx, 860, 520, 360, 200, { fill: "#E7F1FB", stroke: DEEP, lw: 3, r: 18 }); text(ctx, "28", 1040, 610, 70, { align: "center", weight: 900, color: DEEP }); text(ctx, "kali membandingkan", 1040, 650, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "+ 5 kali memindahkan", 1040, 694, 24, { align: "center", weight: 900, color: C.good }); }
      }
      board(ctx, 1290, 140, 500, b.v);
    },
    k6_urut(ctx, b, l) {
      const a = b.audio || b.dur, n1 = SEL.findIndex(s => s.round === 1);
      const [s0, s1] = b.part === 1 ? [0, n1] : [n1, SEL.length];
      const t0 = b.part === 1 ? at(b, 0.12) : 0.2, span = (b.part === 1 ? at(b, 0.9) : b.dur - 0.8) - t0;
      const idx = clamp(s0 + Math.floor((l - t0) / (span / (s1 - s0))), s0, s1 - 1), st = l < t0 && b.part === 1 ? { ...SEL[0], kind: "start", cmp: 0 } : SEL[idx];
      card(ctx, 120, 140, 1680, 690);
      header(ctx, st.kind === "done" ? "SELESAI: URUT DARI KECIL KE BESAR" : "PUTARAN " + (st.round + 1) + " · CARI YANG TERKECIL, PINDAHKAN KE DEPAN", 960, 205, { align: "center" });
      const hl = {}, fills = {};
      for (let i = 0; i < Math.min(st.i, 8); i++) fills[i] = C.goodBg;
      if (st.kind === "done") for (let i = 0; i < 8; i++) fills[i] = C.goodBg;
      if (st.kind === "cmp") { hl[st.m] = C.accent; hl[st.j] = C.kiko; fills[st.m] = "#FFF3D6"; }
      if (st.kind === "pick") { hl[st.m] = C.accent; fills[st.m] = "#FFF3D6"; hl[st.i] = C.good; }
      if (st.kind === "mv" || st.kind === "stay") { hl[st.i] = C.good; fills[st.i] = C.goodBg; }
      bigRow(ctx, st.arr, { hl, fills });
      if (st.kind === "cmp") { pointer(ctx, cxOf(st.m), ROWY, C.accent); pointer(ctx, cxOf(st.j), ROWY, C.kiko); }
      if (st.kind === "pick") { // panah tukar
        const x1 = cxOf(st.i), x2 = cxOf(st.m), y = ROWY + CHT + 50; ctx.strokeStyle = C.good; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x2, y - 10); ctx.quadraticCurveTo((x1 + x2) / 2, y + 40, x1, y - 10); ctx.stroke();
        ctx.fillStyle = C.good; ctx.beginPath(); ctx.moveTo(x1, y - 22); ctx.lineTo(x1 - 12, y); ctx.lineTo(x1 + 12, y); ctx.closePath(); ctx.fill();
      }
      counterBox(ctx, 283, 600, 320, st.cmp, "membandingkan", { fill: "#E7F1FB", stroke: DEEP, color: DEEP });
      counterBox(ctx, 633, 600, 320, st.mv, "memindahkan", { fill: C.goodBg, stroke: C.good, color: C.good });
      let msg = "";
      if (st.kind === "start") msg = "Kartu kuning = calon terkecil.";
      else if (st.kind === "cmp") msg = st.arr[st.m] + " dibandingkan dengan " + st.arr[st.j] + (st.arr[st.j] < st.arr[st.m] ? ": " + st.arr[st.j] + " lebih kecil, jadi calon baru." : ": " + st.arr[st.m] + " tetap calon.");
      else if (st.kind === "pick") msg = "Terkecil: " + st.arr[st.m] + ". Pindahkan ke depan.";
      else if (st.kind === "mv") msg = st.arr[st.i] + " sudah di tempatnya.";
      else if (st.kind === "stay") msg = st.arr[st.i] + " sudah di depan: tidak perlu dipindah.";
      else msg = "28 kali membandingkan, 5 kali memindahkan.";
      text(ctx, msg, 990, 650, 30, { weight: 900, color: st.kind === "done" ? C.good : C.ink, fit: 790 });
      if (st.kind === "cmp") { text(ctx, "kuning = calon terkecil", 990, 700, 24, { weight: 800, color: AMBER }); text(ctx, "biru = kartu yang dibandingkan", 1310, 700, 24, { weight: 800, color: C.kiko }); }
    },
    k6_banding(ctx, b, l) {
      const a = b.audio || b.dur, full = !!b.full;
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "8 KARTU LAWAN 16 KARTU (PALING LAMA)", 960, 205, { align: "center", size: 30 });
      text(ctx, "8 kartu", 1010, 262, 26, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "16 kartu", 1330, 262, 26, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "berubah", 1630, 262, 26, { align: "center", weight: 900, color: C.ink2 });
      const rows = [["cari satu per satu", "kartu acak", 8, 16, "× 2", C.bad], ["cari belah dua", "kartu urut", 4, 5, "+ 1", C.good], ["mengurutkan", "membandingkan", 28, 120, "× 4,3", DEEP]];
      rows.forEach(([nm, sub, x8, x16, ch, col], i) => {
        const show = full ? true : l > at(b, 0.1 + i * 0.4) && i < 2; if (!show) return;
        const y = 290 + i * 170, g = full && i < 2 ? 1 : ease(clamp((l - (full ? 0.3 : at(b, 0.1 + i * 0.4))) / 1.2, 0, 1));
        card(ctx, 160, y, 1600, 150, { fill: full && i === 2 ? "#E7F1FB" : "#F7FAF8", stroke: full && i === 2 ? DEEP : "#D7E2DC", lw: full && i === 2 ? 4 : 2, r: 18 });
        text(ctx, nm, 190, y + 66, 34, { weight: 900 }); text(ctx, sub, 190, y + 110, 24, { weight: 700, color: C.ink2 });
        // batang kecil sebanding (maks 120)
        const bw = v => 40 + 200 * Math.min(1, v / 120);
        text(ctx, String(x8), 1010, y + 92, 52, { align: "center", weight: 900, color: C.ink2 });
        if (g > 0) { ctx.globalAlpha = g; text(ctx, String(x16), 1330, y + 92, 52, { align: "center", weight: 900, color: col }); text(ctx, ch, 1630, y + 92, 48, { align: "center", weight: 900, color: col }); ctx.globalAlpha = 1; }
      });
    },
    k6_latihan(ctx, b, l) {
      const a = b.audio || b.dur;
      const X = 130, Y = 130, Wd = 1120, Hd = 700;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.18)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, X, Y, Wd, Hd, 16); ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, X, Y, Wd, Hd, 16); ctx.clip();
      ctx.fillStyle = "#EEF2F5"; ctx.fillRect(X, Y, Wd, 64);
      ["#E5675F", "#F2B134", "#4CB46A"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X + 28 + i * 26, Y + 32, 8, 0, Math.PI * 2); ctx.fill(); });
      card(ctx, X + 120, Y + 12, Wd - 150, 40, { fill: "#FFFFFF", r: 20 }); text(ctx, "belajar-informatika.vercel.app/d82", X + 145, Y + 40, 22, { weight: 700, color: C.ink2 });
      ctx.fillStyle = C.bg; ctx.fillRect(X, Y + 64, Wd, Hd - 64);
      card(ctx, X + 30, Y + 84, Wd - 60, Hd - 104, { fill: "#FFFFFF", r: 18 });
      const cx = X + 60;
      text(ctx, "Latihan: kartu nilai", cx, Y + 136, 30, { weight: 900 });
      const tL = at(b, 0.1), tU = at(b, 0.24), tM = at(b, 0.36), tF = at(b, 0.48);
      const lv = ["1 Cari dengan langkah sedikit", "2 Urutkan, hitung langkah", "3 Saring dan kelompokkan"]; let bx = cx; const btn = {};
      lv.forEach((s, i) => { ctx.font = "800 20px Inter"; const w = ctx.measureText(s).width + 30; const on = i === 0 && l > tL;
        card(ctx, bx, Y + 156, w, 46, { fill: on ? "#FFF3D6" : "#F1F5F3", stroke: on ? C.accent : "#D7E2DC", lw: on ? 3 : 2, r: 12 }); text(ctx, s, bx + 15, Y + 186, 20, { weight: 800 }); btn[i] = { x: bx + w / 2, y: Y + 180 }; bx += w + 10; });
      const urut = l > tU;
      [["Kartu acak", !urut], ["Kartu urut (55…95)", urut]].forEach(([s, on], i) => { const x = cx + i * 200; card(ctx, x, Y + 226, i ? 240 : 180, 48, { fill: on ? "#E7F1FB" : "#FFFFFF", stroke: on ? C.kiko : "#C9D4DB", lw: on ? 3 : 2, r: 12 }); text(ctx, s, x + (i ? 120 : 90), Y + 258, 21, { align: "center", weight: 800 }); });
      const modeBtn = { x: cx + 320, y: Y + 250 };
      const vals = urut ? SORTED : RAND, open = []; if (urut && l > tM) open.push(3); if (urut && l > tF) open.push(5);
      const fills = {}, hl = {}, dim = []; if (urut && l > tM) { hl[3] = C.accent; } if (urut && l > tF) { hl[5] = C.good; fills[5] = C.goodBg; [0, 1, 2, 3].forEach(i => dim.push(i)); }
      Q.row(ctx, cx, Y + 300, vals, { w: 112, h: 140, gap: 14, open, hl, fills, dim });
      const steps = open.length;
      card(ctx, cx, Y + 470, 200, 90, { fill: "#F4F7F5", r: 12 }); text(ctx, String(steps), cx + 100, Y + 520, 40, { align: "center", weight: 900 }); text(ctx, "langkah", cx + 100, Y + 548, 18, { align: "center", weight: 700, color: C.ink2 });
      if (urut && l > tF) { ctx.fillStyle = C.goodBg; rr(ctx, cx + 220, Y + 470, 760, 90, 12); ctx.fill(); text(ctx, "Di kartu urut cukup 2 langkah. Data urut lebih cepat dicari.", cx + 240, Y + 524, 22, { weight: 900, color: C.good, fit: 720 }); }
      else if (urut && l > tM) { ctx.fillStyle = "#E7F1FB"; rr(ctx, cx + 220, Y + 470, 760, 90, 12); ctx.fill(); text(ctx, "72 lebih kecil dari 85: semua kartu di kirinya tidak mungkin.", cx + 240, Y + 524, 22, { weight: 800, color: DEEP, fit: 720 }); }
      ctx.restore();
      const c3 = { x: cx + 3 * 126 + 56, y: Y + 420 }, c5 = { x: cx + 5 * 126 + 56, y: Y + 420 };
      const pts = [[0, { x: 900, y: 790 }], [tL, btn[0]], [tU, modeBtn], [tM, c3], [tF, c5]];
      let p = pts[0][1], clk = 0;
      for (let i = 1; i < pts.length; i++) { const [t1, q1] = pts[i], [t0, q0] = pts[i - 1]; if (l >= t1) { p = q1; clk = (l - t1) / 0.5; } else { const u = ease((l - t0 - (i > 1 ? 0.5 : 0)) / Math.max(0.3, t1 - t0 - (i > 1 ? 0.5 : 0))); p = { x: lerp(q0.x, q1.x, u), y: lerp(q0.y, q1.y, u) }; break; } }
      if (clk > 0 && clk < 1) { ctx.strokeStyle = `rgba(242,177,52,${1 - clk})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(p.x, p.y, 12 + clk * 34, 0, Math.PI * 2); ctx.stroke(); }
      ctx.save(); ctx.translate(p.x, p.y); ctx.scale(1.3, 1.3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.lineTo(8, 23); ctx.lineTo(13, 35); ctx.lineTo(18, 33); ctx.lineTo(13, 21); ctx.lineTo(23, 21); ctx.closePath();
      ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.stroke(); ctx.restore();
      card(ctx, 1290, 130, 510, 700, { fill: "#FFF9E0", r: 22 });
      header(ctx, "TUGAS NYATA", 1545, 195, { align: "center", size: 30 });
      ["Tulis 8 angka di 8 kertas kecil.", "Urutkan dengan cara mencari yang terkecil.", "Hitung berapa kali kamu membandingkan."].forEach((s, i) => {
        const y = 240 + i * 150; ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1345, y + 40, 26, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 1345, y + 51, 30, { align: "center", weight: 900, color: "#FFFFFF" });
        para(ctx, s, 1390, y + 32, 30, 380, { weight: 800, lh: 1.25 });
      });
      text(ctx, "Bandingkan dengan 28, ya!", 1545, 760, 26, { align: "center", weight: 900, color: DEEP });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
