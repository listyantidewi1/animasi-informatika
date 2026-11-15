/* PG10 Pembahasan Soal Bebras 2018-LT-04 "Dua Berang-berang Pekerja" (Lituania), kategori Penegak (SMA).
   Papan tulis: skema tugas A–H dengan panah urutan (kiri atas), garis waktu dua baris (bawah), panel kanan.
   Jadwal "pilih tugas terlama" disimulasikan ulang di kode (harus 32 jam, menganggur 18 jam);
   jadwal 23 jam diperiksa (urutan, tidak bertumpuk, tanpa menganggur); K._warn bila berbeda.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, ring, hand, alpha, thinkBadge, beaver } = B;
  const BLUE = "#2F6FD0";
  const META = { judul: "Dua Berang-berang Pekerja", tahun: "2018", negara: "Lituania", kode: "2018-LT-04", flag: "LT", sumber: "Buku Tantangan Bebras Indonesia 2018", bukaFrasa: "Bebras",
    tingkat: "kelas 10, 11, dan 12 SMA (Penegak)",
    langkah: ["Gambarlah tugas dan urutannya, lalu susun jadwal di garis waktu.", "Hitung batas tercepat: jumlah jam kerja dibagi banyak pekerja.", "Cari jadwal tanpa menganggur supaya batas itu tercapai."],
    cta: "Paling cepat berapa jam?", gambarUlang: "Skema tugas dan garis waktu digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const DUR = { A: 2, B: 3, C: 5, D: 7, E: 10, F: 9, G: 4, H: 6 };
  const PRE = { A: [], B: [], C: [], D: [], E: ["A", "B"], F: ["C"], G: ["D"], H: ["E"] };
  const TASKS = Object.keys(DUR);
  const TOTAL = TASKS.reduce((s, k) => s + DUR[k], 0);
  const COL = { A: "#F2B134", B: "#E8833A", C: "#6BB36B", D: "#B48FD6", E: "#4F8FD8", F: "#3FB3A6", G: "#E07AA0", H: "#8C9C3C" };
  // jadwal greedy (simulasi ulang): baris = berang-berang, s = mulai
  const GREEDY = [{ t: "D", r: 0, s: 0 }, { t: "C", r: 1, s: 0 }, { t: "F", r: 1, s: 5 }, { t: "G", r: 0, s: 7 }, { t: "B", r: 0, s: 11 }, { t: "A", r: 0, s: 14 }, { t: "E", r: 1, s: 16 }, { t: "H", r: 0, s: 26 }];
  const IDLE_G = [{ r: 1, s: 14, e: 16 }, { r: 0, s: 16, e: 26 }, { r: 1, s: 26, e: 32 }];
  const OPT = [{ t: "A", r: 0, s: 0 }, { t: "C", r: 0, s: 2 }, { t: "B", r: 1, s: 0 }, { t: "D", r: 1, s: 3 }, { t: "E", r: 0, s: 7 }, { t: "F", r: 1, s: 10 }, { t: "H", r: 0, s: 17 }, { t: "G", r: 1, s: 19 }];
  function simGreedy() {
    const done = {}, free = [0, 0], last = [0, 0], out = []; let left = TASKS.slice();
    while (left.length) {
      const w = free[0] < free[1] || (free[0] === free[1] && last[0] <= last[1]) ? 0 : 1, t = free[w];
      const ready = left.filter(k => PRE[k].every(p => done[p] != null && done[p] <= t));
      if (!ready.length) { const nx = Math.min(...Object.values(done).filter(v => v > t)); free[w] = nx; continue; }
      ready.sort((a, b) => DUR[b] - DUR[a]); const k = ready[0];
      out.push({ t: k, r: w, s: t }); done[k] = t + DUR[k]; free[w] = last[w] = t + DUR[k]; left = left.filter(x => x !== k);
    }
    return out;
  }
  function check(S) {
    const end = {}; S.forEach(x => end[x.t] = x.s + DUR[x.t]);
    const okPre = S.every(x => PRE[x.t].every(p => end[p] <= x.s));
    const okRow = [0, 1].every(r => { const L = S.filter(x => x.r === r).sort((a, b) => a.s - b.s); return L.every((x, i) => i === 0 || L[i - 1].s + DUR[L[i - 1].t] <= x.s); });
    const fin = Math.max(...Object.values(end));
    const busy = S.reduce((s, x) => s + DUR[x.t], 0);
    return { okPre, okRow, fin, idle: 2 * fin - busy };
  }
  {
    const g = simGreedy(), cg = check(GREEDY), co = check(OPT);
    const same = g.length === 8 && g.every(x => GREEDY.some(y => y.t === x.t && y.r === x.r && y.s === x.s));
    if (TOTAL !== 46 || !same || cg.fin !== 32 || cg.idle !== 18 || !co.okPre || !co.okRow || co.fin !== 23 || co.idle !== 0 || !cg.okPre || !cg.okRow)
      (K._warn = K._warn || []).push("data salah: total=" + TOTAL + " greedy=" + JSON.stringify(g) + " " + JSON.stringify(cg) + " opt=" + JSON.stringify(co));
  }

  // ---------- skema tugas ----------
  const NPOS = { A: [0, 0], B: [0, 1], C: [0, 2], D: [0, 3], E: [1, 0.5], F: [1, 2], G: [1, 3], H: [2, 0.5] };
  let SK = { x: 300, y: 180, dx: 290, dy: 72, w: 150, h: 56, f: 30 };
  const npos = k => [SK.x + NPOS[k][0] * SK.dx, SK.y + NPOS[k][1] * SK.dy];
  function skema(ctx, o) {
    const durA = o.dur == null ? 1 : o.dur, arrA = o.arr || (() => 1);
    TASKS.forEach(k => PRE[k].forEach(p => {
      const [x1, y1] = npos(p), [x2, y2] = npos(k);
      const hot = o.hotEdge && o.hotEdge(p, k);
      mline(ctx, [[x1 + SK.w / 2 + 4, y1], [x2 - SK.w / 2 - 8, y2]], arrA(k), hot ? ORANGE : INK, hot ? 7 : 4, true);
    }));
    TASKS.forEach(k => alpha(ctx, o.node ? o.node(k) : 1, () => {
      const [x, y] = npos(k), fill = o.fill ? o.fill(k) : 0;
      card(ctx, x - SK.w / 2, y - SK.h / 2, SK.w, SK.h, { fill: "#FFFFFF", stroke: COL[k], lw: 4, r: 14 });
      if (fill > 0) alpha(ctx, fill, () => { ctx.fillStyle = COL[k]; rr(ctx, x - SK.w / 2, y - SK.h / 2, SK.w, SK.h, 14); ctx.fill(); });
      const dur = durA > 0;
      text(ctx, k, dur ? x - SK.w * 0.26 : x, y + SK.f * 0.36, SK.f * 1.05, { align: "center", weight: 900, color: INK });
      if (dur) alpha(ctx, durA, () => text(ctx, DUR[k] + " jam", x + SK.w * 0.16, y + SK.f * 0.32, SK.f * 0.8, { align: "center", weight: 800, color: INK }));
      if (o.ring && o.ring(k) > 0) ring(ctx, x, y, SK.w * 0.62, SK.h * 0.8, o.ring(k), RED, 5);
    }));
  }

  // ---------- garis waktu ----------
  let GT = { x0: 280, ppx: 48, y: 470, rh: 76, gap: 22, f: 30, lab: ["Berang-berang 1", "Berang-berang 2"], lx: 70, lw: 200 };
  const gx = t => GT.x0 + t * GT.ppx, gy = r => GT.y + r * (GT.rh + GT.gap);
  function axis(ctx, a = 1, maxT = 32) {
    alpha(ctx, a, () => {
      [0, 1].forEach(r => {
        ctx.fillStyle = "#F4F6F7"; ctx.fillRect(gx(0), gy(r), gx(maxT) - gx(0), GT.rh);
        text(ctx, GT.lab[r], GT.lx, gy(r) + GT.rh * 0.62, GT.f * 0.8, { weight: 900, color: INK, fit: GT.lw });
      });
      const ya = gy(1) + GT.rh + 12;
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx(0), ya); ctx.lineTo(gx(maxT), ya); ctx.stroke();
      for (let t = 0; t <= maxT; t++) { const big = t % 5 === 0; ctx.beginPath(); ctx.moveTo(gx(t), ya); ctx.lineTo(gx(t), ya + (big ? 12 : 6)); ctx.stroke(); if (big) text(ctx, String(t), gx(t), ya + 38, GT.f * 0.75, { align: "center", weight: 800, color: C.ink2 }); }
      text(ctx, "jam", gx(maxT) + 8, ya + 38, GT.f * 0.7, { weight: 800, color: C.ink2 });
    });
  }
  function bar(ctx, x, u) {
    if (u <= 0) return;
    const X = gx(x.s), W = DUR[x.t] * GT.ppx * clamp(u, 0, 1), Y = gy(x.r);
    ctx.fillStyle = COL[x.t]; rr(ctx, X + 2, Y, Math.max(1, W - 4), GT.rh, 10); ctx.fill();
    if (u > 0.6) alpha(ctx, (u - 0.6) / 0.4, () => text(ctx, x.t, X + DUR[x.t] * GT.ppx / 2, Y + GT.rh * 0.66, GT.f * 1.1, { align: "center", weight: 900, color: INK }));
  }
  function idle(ctx, z, u) {
    if (u <= 0) return;
    const X = gx(z.s), W = (z.e - z.s) * GT.ppx, Y = gy(z.r);
    alpha(ctx, u, () => {
      ctx.save(); ctx.beginPath(); ctx.rect(X, Y, W, GT.rh); ctx.clip();
      ctx.fillStyle = "rgba(217,68,59,0.12)"; ctx.fillRect(X, Y, W, GT.rh);
      ctx.strokeStyle = "rgba(217,68,59,0.55)"; ctx.lineWidth = 3;
      for (let i = -GT.rh; i < W; i += 16) { ctx.beginPath(); ctx.moveTo(X + i, Y + GT.rh); ctx.lineTo(X + i + GT.rh, Y); ctx.stroke(); }
      ctx.restore();
      if (W > 60) text(ctx, "menganggur", X + W / 2, Y + GT.rh * 0.62, Math.min(GT.f * 0.8, W / 6.5), { align: "center", weight: 900, color: RED });
    });
  }
  function endLine(ctx, t, u, col, label) {
    if (u <= 0) return;
    const x = gx(t), y0 = gy(0) - 30, y1 = gy(1) + GT.rh + 12;
    alpha(ctx, u, () => {
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore();
      if (label) text(ctx, label, x, y0 - 8, GT.f * 0.85, { align: "center", weight: 900, color: col });
    });
  }

  // ---------- urutan kemunculan ----------
  const GSEQ = [["r1", "D", "Berang-berang pertama mengambil D"], ["r1", "C", "Berang-berang kedua mengambil C"], ["r2", "F", "mengerjakan F"], ["r2", "G", "mengambil G"], ["r2", "B", "lalu B"], ["r2", "A", "lalu A"], ["r3", "E", "Lalu, selama"], ["r4", "H", "H dikerjakan"]];
  const GIDLE = [["r3", "menunggu selama"], ["r3", "tidak punya tugas"], ["r4", "banyak waktu terbuang"]];
  const OSEQ = [["s2", "A", "mengerjakan A"], ["s2", "C", "lalu C"], ["s2", "B", "mengerjakan B"], ["s2", "D", "lalu D"], ["s3", "E", "bisa mengerjakan E"], ["s3", "F", "mengerjakan F"], ["s4", "H", "mengerjakan H"], ["s4", "G", "mengerjakan G"]];
  const RB = ["r1", "r2", "r3", "r4"], SB = ["s2", "s3", "s4"];
  function greedyU(b, l) {
    if (RB.includes(b.id)) {
      const k = RB.indexOf(b.id), u = {}, z = [];
      GSEQ.forEach(([bid, t, ph]) => { const j = RB.indexOf(bid); u[t] = j < k ? 1 : (j === k ? P(l, at(b, ph), 0.7) : 0); });
      GIDLE.forEach(([bid, ph]) => { const j = RB.indexOf(bid); z.push(j < k ? 1 : (j === k ? P(l, at(b, ph), 0.6) : 0)); });
      return { u, z };
    }
    return null;
  }
  function optU(b, l) {
    if (SB.includes(b.id)) {
      const k = SB.indexOf(b.id), u = {};
      OSEQ.forEach(([bid, t, ph]) => { const j = SB.indexOf(bid); u[t] = j < k ? 1 : (j === k ? P(l, at(b, ph), 0.7) : 0); });
      return u;
    }
    if (["s5", "j1", "j2", "c3", "c2"].includes(b.id)) { const u = {}; TASKS.forEach(t => u[t] = 1); return u; }
    return null;
  }

  // ---------- adegan utama ----------
  function kerja(ctx, b, l) {
    board(ctx);
    SK = { x: 300, y: 172, dx: 300, dy: 78, w: 172, h: 62, f: 34 };
    GT = { x0: 280, ppx: 48, y: 470, rh: 76, gap: 22, f: 30, lab: ["Berang-berang 1", "Berang-berang 2"], lx: 70, lw: 200 };
    const id = b.id, RX = 1150, RW = 690;
    const G = greedyU(b, l), O = optU(b, l);
    const greedyAll = ["soal5", "b1"].includes(id);
    // skema
    const so = {};
    if (id === "soal1") so.node = k => P(l, at(b, "delapan tugas") + TASKS.indexOf(k) * 0.25, 0.4);
    if (id === "soal1") so.dur = 0; else if (id === "soal2") so.dur = P(l, at(b, "Tugas A"), 0.5);
    if (id === "soal1" || id === "soal2") so.arr = () => 0;
    if (id === "soal3") { const ph = { E: "Tugas E", H: "Tugas H", F: "Tugas F", G: "tugas G" }; so.arr = k => P(l, at(b, ph[k]), 0.6); }
    if (G) so.fill = k => (G.u[k] || 0) * 0.5;
    if (O) so.fill = k => (O[k] || 0) * 0.5;
    if (greedyAll) so.fill = () => 0.5;
    if (id === "s1") { so.ring = k => (k === "E" || k === "F") ? P(l, at(b, "tugas E dan F"), 0.6) : 0; so.hotEdge = (p, k) => p === "E" && k === "H" && l > at(b, "karena H"); }
    if (id === "soal2") so.ring = k => P(l, at(b, k === "A" ? "Tugas A" : " " + k + " ", 8), 0.5) * (1 - P(l, at(b, " " + k + " ", 8) + 1.6, 0.4));
    skema(ctx, so);
    // garis waktu
    const showAxis = !["soal1", "soal2", "soal3"].includes(id);
    if (showAxis) {
      axis(ctx, id === "soal4" ? P(l, at(b, "Kita gambar"), 0.6) : 1);
      if (id === "soal4") [0, 1].forEach(r => alpha(ctx, P(l, at(b, "satu baris"), 0.5), () => beaver(ctx, 1700 + r * 110, 360, 70, { flip: r === 1 })));
      if (G) { GREEDY.forEach(x => bar(ctx, x, G.u[x.t])); IDLE_G.forEach((z, i) => idle(ctx, z, G.z[i])); }
      if (greedyAll) alpha(ctx, id === "b1" ? 0.35 : P(l, at(b, "tiga puluh dua"), 0.8), () => { GREEDY.forEach(x => bar(ctx, x, 1)); IDLE_G.forEach(z => idle(ctx, z, 1)); });
      if (id === "r4" || id === "soal5") endLine(ctx, 32, P(l, at(b, id === "r4" ? "tiga puluh dua" : "tiga puluh dua"), 0.5), RED, "32");
      if (O) OPT.forEach(x => bar(ctx, x, O[x.t]));
      if (["b2", "b3", "s1", "s2", "s3", "s4", "s5", "j1", "j2", "c3"].includes(id)) endLine(ctx, 23, id === "b2" ? P(l, at(b, "dua puluh tiga jam. Kalau"), 0.6) : 1, GREEN, "23");
      if (id === "j2") endLine(ctx, 32, P(l, at(b, "tiga puluh dua"), 0.5), RED, "32");
    }

    // ---------- panel kanan ----------
    if (id === "soal1") alpha(ctx, P(l, at(b, "Dua berang-berang"), 0.6), () => { beaver(ctx, 1350, 330, 150); beaver(ctx, 1620, 330, 150, { flip: true }); hand(ctx, "membangun bendungan", 1485, 560, 46, { color: ORANGE }); });
    if (id === "soal2") alpha(ctx, P(l, 0.4, 0.5), () => text(ctx, "angka = lama tugas (jam)", RX + RW / 2, 260, 38, { align: "center", weight: 900, color: INK, fit: RW }));
    if (id === "soal3") {
      hand(ctx, "panah = harus menunggu", RX + RW / 2, 220, 44, { color: ORANGE, alpha: P(l, 0.4, 0.5) });
      [["E menunggu A dan B", "Tugas E"], ["H menunggu E", "Tugas H"], ["F menunggu C", "Tugas F"], ["G menunggu D", "tugas G"]].forEach(([s, ph], i) =>
        alpha(ctx, P(l, at(b, ph), 0.5), () => text(ctx, s, RX + 80, 300 + i * 52, 36, { weight: 800, color: INK })));
    }
    if (id === "soal4") alpha(ctx, P(l, 0.4, 0.5), () => { text(ctx, "bekerja bersamaan", RX + RW / 2, 230, 42, { align: "center", weight: 900, color: INK }); text(ctx, "satu tugas pada satu waktu", RX + RW / 2, 290, 36, { align: "center", weight: 800, color: GREEN }); });
    if (id === "soal5") {
      alpha(ctx, P(l, at(b, "Kalau ada"), 0.5), () => { card(ctx, RX + 20, 170, RW - 40, 140, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "aturan berang-berang:", RX + RW / 2, 225, 34, { align: "center", weight: 800, color: INK }); text(ctx, "pilih tugas terlama", RX + RW / 2, 285, 46, { align: "center", weight: 900, color: ORANGE }); });
      alpha(ctx, P(l, at(b, "tiga puluh dua"), 0.5), () => text(ctx, "selesai: 32 jam", RX + RW / 2, 390, 56, { align: "center", weight: 900, color: RED }));
    }
    if (id === "soal6") alpha(ctx, P(l, 0.3, 0.5), () => { card(ctx, RX + 20, 190, RW - 40, 200, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 }); text(ctx, "Paling cepat", RX + RW / 2, 270, 50, { align: "center", weight: 900, color: INK }); text(ctx, "berapa jam?", RX + RW / 2, 345, 50, { align: "center", weight: 900, color: ORANGE }); });
    if (id === "r1") alpha(ctx, P(l, at(b, "tugas yang siap"), 0.5), () => { text(ctx, "jam 0, siap: A, B, C, D", RX + RW / 2, 240, 40, { align: "center", weight: 900, color: INK }); hand(ctx, "ambil yang terlama", RX + RW / 2, 320, 40, { color: ORANGE }); });
    if (id === "r2") hand(ctx, "selalu pilih yang terlama", RX + RW / 2, 260, 42, { color: ORANGE, alpha: P(l, 0.4, 0.5) });
    if (id === "r3") alpha(ctx, P(l, at(b, "Tugas E"), 0.5), () => { text(ctx, "E menunggu A selesai", RX + RW / 2, 240, 40, { align: "center", weight: 900, color: INK }); text(ctx, "(jam 16)", RX + RW / 2, 300, 36, { align: "center", weight: 800, color: C.ink2 }); });
    if (id === "r4") alpha(ctx, P(l, at(b, "waktu menganggurnya"), 0.5), () => { card(ctx, RX + 60, 190, RW - 120, 150, { fill: "#FFF0EE", stroke: RED, lw: 5, r: 20 }); text(ctx, "menganggur:", RX + RW / 2, 250, 38, { align: "center", weight: 900, color: INK }); text(ctx, "10 + 2 + 6 = 18 jam", RX + RW / 2, 310, 44, { align: "center", weight: 900, color: RED }); });
    if (id === "b1") {
      const parts = ["2", "3", "5", "7", "10", "9", "4", "6"], ph = ["Dua tambah", "tiga tambah", "lima tambah", "tujuh tambah", "sepuluh tambah", "sembilan tambah", "empat tambah", "tambah enam"];
      hand(ctx, "jumlah semua jam kerja", RX + RW / 2, 200, 40, { color: INK, alpha: P(l, 0.4, 0.5) });
      let s = ""; parts.forEach((p, i) => { if (l > at(b, ph[i]) + 0.2) s += (s ? " + " : "") + p; });
      text(ctx, s, RX + RW / 2, 290, 40, { align: "center", weight: 900, color: INK, fit: RW });
      alpha(ctx, P(l, at(b, "hasilnya"), 0.5), () => text(ctx, "= 46 jam", RX + RW / 2, 380, 64, { align: "center", weight: 900, color: ORANGE }));
    }
    if (id === "b2") {
      alpha(ctx, P(l, at(b, "dibagi untuk"), 0.5), () => text(ctx, "46 : 2 = 23", RX + RW / 2, 230, 64, { align: "center", weight: 900, color: GREEN }));
      alpha(ctx, P(l, at(b, "Kalau tidak sama rata"), 0.5), () => text(ctx, "tidak rata: satu pekerja > 23", RX + RW / 2, 300, 34, { align: "center", weight: 800, color: INK, fit: RW }));
      alpha(ctx, P(l, at(b, "Jadi, tidak ada"), 0.5), () => { card(ctx, RX + 20, 330, RW - 40, 100, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "tidak mungkin < 23 jam", RX + RW / 2, 395, 44, { align: "center", weight: 900, color: GREEN }); });
    }
    if (id === "b3") thinkBadge(ctx, RX + 10, 200, RW - 20, 170, l, b.hold + 2, "Bisakah selesai dalam 23 jam?");
    if (id === "s1") {
      alpha(ctx, P(l, at(b, "tugas E dan F"), 0.5), () => text(ctx, "E dan F: pekerja berbeda", RX + RW / 2, 240, 42, { align: "center", weight: 900, color: INK, fit: RW }));
      alpha(ctx, P(l, at(b, "Selain itu"), 0.5), () => { text(ctx, "E secepat mungkin,", RX + RW / 2, 320, 40, { align: "center", weight: 900, color: ORANGE }); text(ctx, "karena H menunggu", RX + RW / 2, 375, 36, { align: "center", weight: 800, color: INK }); });
    }
    if (SB.includes(id)) {
      const lines = { s2: [["berang-berang 1: A, lalu C", "mengerjakan A"], ["berang-berang 2: B, lalu D", "mengerjakan B"]], s3: [["jam 7: A dan B selesai → E", "jam tujuh"], ["jam 10: C selesai → F", "jam sepuluh"]], s4: [["H setelah E (jam 17)", "mengerjakan H"], ["G setelah D (sejak jam 10)", "mengerjakan G"]] }[id];
      lines.forEach(([s, ph], i) => alpha(ctx, P(l, at(b, ph), 0.5), () => text(ctx, s, RX + 30, 240 + i * 70, 36, { weight: 800, color: INK, fit: RW - 40 })));
    }
    if (id === "s5") {
      const L = [["E mulai 7: A, B selesai", 0], ["F mulai 10: C selesai", 1], ["G mulai 19: D selesai", 2], ["H mulai 17: E selesai", 3]];
      const t0 = at(b, "Setiap tugas");
      L.forEach(([s, i]) => { const u = P(l, t0 + i * 0.7, 0.4); alpha(ctx, u, () => text(ctx, s, RX + 80, 200 + i * 46, 32, { weight: 800, color: INK, fit: RW - 100 })); tick(ctx, RX + 40, 190 + i * 46, 34, u, GREEN); });
      alpha(ctx, P(l, at(b, "tidak pernah menganggur"), 0.5), () => text(ctx, "menganggur: 0 jam", RX + RW / 2, 392, 40, { align: "center", weight: 900, color: GREEN }));
    }
    if (id === "j1") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, RX + 60, 200, RW - 120, 170, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban:", RX + RW / 2, 265, 40, { align: "center", weight: 900, color: INK }); text(ctx, "23 jam", RX + RW / 2, 340, 70, { align: "center", weight: 900, color: GREEN }); });
    if (id === "j2") {
      alpha(ctx, P(l, 0.4, 0.5), () => text(ctx, "pilih tugas terlama: 32 jam", RX + RW / 2, 230, 38, { align: "center", weight: 900, color: RED, fit: RW }));
      alpha(ctx, P(l, at(b, "jadwal terbaik"), 0.5), () => text(ctx, "jadwal terbaik: 23 jam", RX + RW / 2, 300, 38, { align: "center", weight: 900, color: GREEN, fit: RW }));
      alpha(ctx, P(l, at(b, "sembilan jam"), 0.5), () => hand(ctx, "selisih 9 jam!", RX + RW / 2, 390, 52, { color: ORANGE }));
    }
    if (id === "c2") {
      hand(ctx, "algoritma greedy", RX + RW / 2, 210, 60, { color: ORANGE, alpha: P(l, at(b, "disebut algoritma greedy"), 0.5) });
      alpha(ctx, P(l, at(b, "cepat dan sering"), 0.5), () => text(ctx, "cepat, tetapi tidak selalu terbaik", RX + RW / 2, 270, 32, { align: "center", weight: 800, color: INK, fit: RW }));
      alpha(ctx, P(l, at(b, "prosesor"), 0.5), () => cpu(ctx, RX + RW / 2, 365));
    }
    if (id === "c3") alpha(ctx, P(l, 0.4, 0.5), () => { text(ctx, "paling singkat:", RX + RW / 2, 250, 42, { align: "center", weight: 900, color: INK }); text(ctx, "23 jam", RX + RW / 2, 340, 80, { align: "center", weight: 900, color: GREEN }); });
  }
  function cpu(ctx, x, y) {
    ctx.fillStyle = "#5C6670"; rr(ctx, x - 70, y - 60, 140, 120, 10); ctx.fill();
    ctx.strokeStyle = "#5C6670"; ctx.lineWidth = 5;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * 24, y - 60); ctx.lineTo(x + i * 24, y - 78); ctx.moveTo(x + i * 24, y + 60); ctx.lineTo(x + i * 24, y + 78); ctx.moveTo(x - 70, y + i * 22); ctx.lineTo(x - 88, y + i * 22); ctx.moveTo(x + 70, y + i * 22); ctx.lineTo(x + 88, y + i * 22); ctx.stroke(); }
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, c], i) => { ctx.fillStyle = [COL.E, COL.F, COL.A, COL.G][i]; rr(ctx, x + a * 30 - 24, y + c * 26 - 20, 48, 40, 6); ctx.fill(); });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function kerja_v(ctx, b, l) {
    board(ctx);
    SK = { x: 670, y: 178, dx: 280, dy: 62, w: 150, h: 52, f: 30 };
    GT = { x0: 590, ppx: 26, y: 440, rh: 62, gap: 16, f: 26, lab: ["Berang 1", "Berang 2"], lx: 480, lw: 100 };
    const id = b.id, TX = 960;
    const optAll = id === "h4", u = {};
    if (id === "h3") { const t0 = at(b, "Jadwal ini"); OPT.forEach((x, i) => u[x.t] = P(l, t0 + i * 0.45, 0.5)); }
    skema(ctx, { fill: k => id === "h0" ? 0.5 : (id === "h3" ? (u[k] || 0) * 0.5 : (optAll ? 0.5 : 0)), ring: k => id === "h3" && (k === "E" || k === "F") ? P(l, at(b, "Tugas E dan F"), 0.5) : 0 });
    axis(ctx, 1);
    if (id === "h0") { GREEDY.forEach(x => bar(ctx, x, P(l, at(b, "Kalau mereka"), 0.6))); IDLE_G.forEach(z => idle(ctx, z, P(l, at(b, "Kalau mereka") + 0.4, 0.6))); endLine(ctx, 32, P(l, at(b, "tiga puluh dua"), 0.5), RED, "32"); }
    if (id === "h0") alpha(ctx, P(l, at(b, "tiga puluh dua"), 0.5), () => text(ctx, "pilih tugas terlama: 32 jam", TX, 690, 40, { align: "center", weight: 900, color: RED }));
    if (id === "h1") { text(ctx, "Paling cepat berapa jam?", TX, 680, 44, { align: "center", weight: 900, color: INK }); thinkBadge(ctx, 610, 705, 700, 110, l, b.hold + 2, ""); }
    if (id === "h2") {
      alpha(ctx, P(l, 0.3, 0.5), () => text(ctx, "2+3+5+7+10+9+4+6 = 46", TX, 690, 44, { align: "center", weight: 900, color: INK }));
      alpha(ctx, P(l, at(b, "Karena ada"), 0.5), () => text(ctx, "46 : 2 = 23 jam", TX, 770, 56, { align: "center", weight: 900, color: GREEN }));
      endLine(ctx, 23, P(l, at(b, "paling cepat"), 0.5), GREEN, "23");
    }
    if (id === "h3" || id === "h4") {
      OPT.forEach(x => bar(ctx, x, optAll ? 1 : u[x.t])); endLine(ctx, 23, 1, GREEN, "23");
      if (id === "h3") alpha(ctx, P(l, at(b, "tidak ada yang menganggur"), 0.5), () => text(ctx, "tanpa menganggur", TX, 700, 44, { align: "center", weight: 900, color: GREEN }));
      if (id === "h4") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: 23 jam", TX, 720, 60, { align: "center", weight: 900, color: GREEN }));
    }
  }

  Object.assign(K.SCENES, B.umum(META), { kerja, kerja_v });
})(typeof window !== "undefined" ? window : globalThis);
