/* SG11 Pembahasan Soal Bebras 2017-IE-01 "Permen Loli dan Sikat Gigi" (Irlandia), kategori Siaga (kelas 4–6 SD).
   Papan tulis: lorong 11 kotak (loli/sikat gigi), berang-berang berjalan ke kanan dengan penghitung loli sejak gosok gigi.
   Jalan terbaik dan maksimum (semua 2^7 pilihan makan diperiksa) dihitung di kode; K._warn bila bukan 6.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Permen Loli dan Sikat Gigi", tahun: "2017", negara: "Irlandia", kode: "2017-IE-01", flag: "IE", sumber: "Buku Tantangan Bebras Indonesia 2017", bukaFrasa: "lomba",
    tingkat: "kelas 4, 5, dan 6 SD (Siaga)",
    langkah: ["Pahami aturannya dengan teliti.", "Berjalan kotak demi kotak sambil memakai penghitung.", "Periksa apakah hasil yang lebih besar mungkin dicapai."],
    cta: "Berapa permen loli paling banyak?", gambarUlang: "Lorong, permen loli, sikat gigi, dan berang-berang digambar ulang untuk video ini." };

  // ---------- data soal (L = permen loli, T = sikat gigi) ----------
  const ROW = "LTLLTTLLLTL".split(""), COL = { 0: "#4FB3E8", 2: "#8CC63F", 3: "#F26B6B", 6: "#4FB3E8", 7: "#8CC63F", 8: "#F26B6B", 10: "#4FB3E8" };
  // jalan serakah: makan setiap kali boleh
  const ACT = [], CNT = []; let cnt = 0;
  ROW.forEach(c => { if (c === "T") { ACT.push("gosok"); cnt = 0; } else if (cnt < 2) { ACT.push("makan"); cnt++; } else ACT.push("lewat"); CNT.push(cnt); });
  const NE = ACT.filter(a => a === "makan").length;
  // periksa semua pilihan makan/tidak untuk 7 loli (gosok gigi selalu dilakukan karena tidak pernah merugikan)
  const Li = ROW.map((c, i) => c === "L" ? i : -1).filter(i => i >= 0); let best = 0;
  for (let m = 0; m < 1 << Li.length; m++) { let ok = true, c = 0, n = 0; ROW.forEach((x, i) => { if (x === "T") c = 0; else { const k = Li.indexOf(i); if (m >> k & 1) { if (c >= 2) ok = false; c++; n++; } } }); if (ok) best = Math.max(best, n); }
  if (NE !== 6 || best !== 6 || ACT[8] !== "lewat") (K._warn = K._warn || []).push("data salah: serakah=" + NE + " maks=" + best);

  // ---------- gambar ----------
  function lolli(ctx, x, y, s, col) {
    ctx.strokeStyle = "#D9D2C5"; ctx.lineWidth = s * 0.09; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y + s * 0.1); ctx.lineTo(x, y + s * 0.62); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - s * 0.12, s * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = s * 0.05; ctx.beginPath();
    for (let t = 0; t < 9; t += 0.15) { const r = s * 0.03 * t; ctx.lineTo(x + Math.cos(t * 1.4) * r, y - s * 0.12 + Math.sin(t * 1.4) * r); } ctx.stroke();
  }
  function brush(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.6);
    ctx.fillStyle = "#6D7BE0"; rr(ctx, -s * 0.48, -s * 0.06, s * 0.72, s * 0.12, s * 0.06); ctx.fill();
    ctx.fillStyle = "#6D7BE0"; ctx.fillRect(s * 0.2, -s * 0.06, s * 0.28, s * 0.12);
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#9AA5AE"; ctx.lineWidth = 2; ctx.fillRect(s * 0.22, -s * 0.22, s * 0.24, s * 0.16); ctx.strokeRect(s * 0.22, -s * 0.22, s * 0.24, s * 0.16);
    ctx.restore();
  }
  const L0 = { x0: 215, cw: 145, y: 300, ch: 150, bs: 104, fn: 30, fa: 30 };
  const cx = (g, i) => g.x0 + i * g.cw + g.cw / 2;
  // done(i) = 0..1 kapan aksi kotak i terjadi
  function corridor(ctx, g, o = {}) {
    ROW.forEach((c, i) => { const x = g.x0 + i * g.cw;
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.fillRect(x, g.y, g.cw, g.ch); ctx.strokeRect(x, g.y, g.cw, g.ch);
      const d = o.done ? o.done(i) : 0, eaten = c === "L" && ACT[i] === "makan" ? d : 0;
      alpha(ctx, 1 - 0.75 * eaten, () => c === "L" ? lolli(ctx, x + g.cw / 2, g.y + g.ch * 0.42, g.ch * 0.8, COL[i]) : brush(ctx, x + g.cw / 2, g.y + g.ch * 0.5, g.ch * 0.8));
      if (o.nums) text(ctx, String(i + 1), x + g.cw / 2, g.y + g.ch + g.fn + 8, g.fn, { align: "center", weight: 800, color: C.ink2 });
      if (d > 0) alpha(ctx, d, () => { const a = ACT[i], col = a === "makan" ? GREEN : a === "gosok" ? "#4B5BD0" : RED;
        text(ctx, a, x + g.cw / 2, g.y + g.ch + g.fn + 16 + g.fa + 6, g.fa, { align: "center", weight: 900, color: col });
        if (a === "lewat") cross(ctx, x + g.cw / 2, g.y + g.ch * 0.45, g.ch * 0.6, 1, RED, 7); });
    });
  }
  // posisi berang-berang: kotak i (−1 = sebelum lorong), bergerak halus
  function walker(ctx, g, pos) { const x = pos < 0 ? g.x0 - g.cw * 0.55 : cx(g, 0) + pos * g.cw; B.beaver(ctx, x, g.y - g.bs * 0.62, g.bs, {}); }
  function counter(ctx, x, y, n, a = 1) {
    alpha(ctx, a, () => { card(ctx, x, y, 560, 170, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 });
      text(ctx, "penghitung", x + 30, y + 52, 36, { weight: 900, color: INK });
      for (let k = 0; k < 2; k++) { ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.fillStyle = k < n ? "#FFE3B0" : "#FFFFFF"; ctx.beginPath(); ctx.arc(x + 70 + k * 100, y + 115, 36, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); if (k < n) lolli(ctx, x + 70 + k * 100, y + 120, 60, "#F26B6B"); }
      text(ctx, String(n), x + 380, y + 140, 90, { align: "center", weight: 900, color: n >= 2 ? RED : ORANGE });
      if (n >= 2) text(ctx, "gosok dulu!", x + 470, y + 52, 30, { align: "center", weight: 900, color: RED }); });
  }
  const WB = { w2: [[0, "Kotak pertama"], [1, "Kotak kedua"]], w3: [[2, "memakan keduanya"], [3, "+0.9"], [4, "kotak kelima"], [5, "Kotak keenam"]], w4: [[6, "memakan keduanya"], [7, "+0.9"], [8, "harus dilewati"]], w5: [[9, "Kotak kesepuluh"], [10, "Kotak kesebelas"]] };
  const WO = ["w2", "w3", "w4", "w5"];

  function lorong(ctx, b, l) {
    board(ctx);
    const id = b.id, g = L0;
    if (id === "soal1" || id === "soal2" || id === "soal3" || id === "soal4") {
      alpha(ctx, id === "soal1" ? P(l, at(b, "sebelas kotak"), 0.6) : 1, () => corridor(ctx, g, { nums: true }));
      walker(ctx, g, -1);
      if (id === "soal2") { alpha(ctx, P(l, at(b, "dari kiri ke kanan"), 0.5), () => { B.arrow(ctx, 300, 200, 1700, 200, 1, ORANGE, 6); hand(ctx, "tidak boleh mundur", 1000, 180, 40, { color: ORANGE }); });
        [["makan permen loli", GREEN, "makan permen loli"], ["gosok gigi", "#4B5BD0", "menggosok gigi"], ["lewat saja", RED, "hanya lewat"]].forEach(([s, col, ph], k) => alpha(ctx, P(l, at(b, ph), 0.4), () => { card(ctx, 160 + k * 540, 560, 500, 100, { fill: "#FFFFFF", stroke: col, lw: 4, r: 18 }); text(ctx, s, 410 + k * 540, 625, 42, { align: "center", weight: 900, color: col }); }));
        alpha(ctx, P(l, at(b, "tidak boleh membawa"), 0.4), () => text(ctx, "tidak boleh membawa barang ke kotak berikutnya", 960, 730, 34, { align: "center", weight: 800, color: C.ink2 })); }
      if (id === "soal3") alpha(ctx, P(l, at(b, "Setelah makan"), 0.5), () => { card(ctx, 260, 560, 1400, 170, { fill: "#FFF4DE", stroke: ORANGE, lw: 5, r: 22 });
        lolli(ctx, 360, 640, 80, "#F26B6B"); lolli(ctx, 440, 640, 80, "#8CC63F"); text(ctx, "2 permen loli  →  gosok gigi dulu,", 1000, 630, 50, { align: "center", weight: 900, color: INK }); text(ctx, "baru boleh makan lagi", 1000, 695, 44, { align: "center", weight: 900, color: ORANGE }); });
      if (id === "soal4") { card(ctx, 160, 560, 760, 170, { fill: "#FFF4DE", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "Berapa permen loli", 540, 630, 46, { align: "center", weight: 900, color: INK }); text(ctx, "paling banyak?", 540, 690, 46, { align: "center", weight: 900, color: INK });
        [3, 5, 6, 7].forEach((v, k) => alpha(ctx, P(l, at(b, "Pilihannya"), 0.5), () => { card(ctx, 980 + k * 200, 560, 170, 90, { fill: "#FFFFFF", stroke: "#9AA5AE", lw: 3, r: 14 }); text(ctx, String(v), 1065 + k * 200, 622, 52, { align: "center", weight: 900, color: INK }); }));
        thinkBadge(ctx, 980, 668, 770, 76, l, b.hold + 2, ""); }
      return;
    }
    const wi = WO.indexOf(id), seg1 = id === "w1" || wi >= 0 || id === "w6";
    if (seg1) {
      // waktu aksi tiap kotak di beat ini
      const tAct = {}; if (wi >= 0) { let prev = 0; WB[id].forEach(([i, ph]) => { const t = ph[0] === "+" ? prev + parseFloat(ph) : at(b, ph) + 0.6; tAct[i] = t; prev = t; }); }
      const doneBefore = i => { if (id === "w6") return true; if (wi < 0) return false; return WO.slice(0, wi).some(w => WB[w].some(([j]) => j === i)); };
      const done = i => doneBefore(i) ? 1 : tAct[i] != null ? P(l, tAct[i], 0.4) : 0;
      // posisi berang-berang
      let pos = -1; for (let i = 0; i < 11; i++) if (done(i) >= 1 || (tAct[i] != null && l > tAct[i] - 0.5)) pos = i;
      let px = pos; const nxt = Object.keys(tAct).map(Number).find(i => l > tAct[i] - 0.5 && l < tAct[i]); if (nxt != null) px = nxt - 1 + clamp((l - (tAct[nxt] - 0.5)) / 0.5, 0, 1);
      corridor(ctx, g, { nums: true, done });
      walker(ctx, g, id === "w6" ? 10 : px);
      let n = 0; for (let i = 0; i < 11; i++) if (done(i) > 0.5) n = CNT[i];
      counter(ctx, 160, 568, id === "w1" ? 0 : n, id === "w1" ? P(l, at(b, "penghitung"), 0.5) : 1);
      if (id === "w1") alpha(ctx, P(l, at(b, "sudah dua"), 0.5), () => text(ctx, "2 = berhenti makan, cari sikat gigi", 1280, 668, 40, { align: "center", weight: 900, color: RED }));
      const eatenSoFar = ACT.filter((a, i) => a === "makan" && done(i) > 0.5).length;
      if (id !== "w1") { card(ctx, 1270, 568, 500, 170, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "sudah dimakan", 1520, 623, 36, { align: "center", weight: 900, color: INK }); text(ctx, String(id === "w6" ? Math.min(6, Math.max(0, Math.floor((l - at(b, "Satu")) / 0.62) + 1)) : eatenSoFar), 1520, 713, 80, { align: "center", weight: 900, color: GREEN }); }
      if (id === "w6") { let k = 0; ACT.forEach((a, i) => { if (a !== "makan") return; const kk = k++; alpha(ctx, P(l, at(b, "Satu") + kk * 0.62, 0.3), () => { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(cx(g, i), g.y + 26, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, String(kk + 1), cx(g, i), g.y + 36, 28, { align: "center", weight: 900, color: "#FFFFFF" }); }); });
        alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, 760, 595, 440, 110, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 18 }); text(ctx, "Jawaban: 6", 980, 670, 54, { align: "center", weight: 900, color: GREEN }); }); }
      return;
    }
    if (id === "x1" || id === "x2") {
      corridor(ctx, g, { nums: true });
      if (id === "x1") ROW.forEach((c, i) => { if (c === "L") ring(ctx, cx(g, i), g.y + g.ch * 0.45, 66, 70, P(l, at(b, "ada tujuh") + Li.indexOf(i) * 0.25, 0.4), ORANGE, 6); });
      if (id === "x1") alpha(ctx, P(l, at(b, "ada tujuh"), 0.5), () => { card(ctx, 560, 580, 800, 150, { fill: "#FFF4DE", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "ada 7 permen loli", 960, 640, 50, { align: "center", weight: 900, color: INK }); text(ctx, "7 berarti semuanya dimakan", 960, 700, 40, { align: "center", weight: 800, color: C.ink2 }); });
      if (id === "x2") { const u = P(l, at(b, "kotak ketujuh"), 0.6), x1 = g.x0 + 6 * g.cw, x2 = g.x0 + 9 * g.cw;
        alpha(ctx, u, () => { ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.strokeRect(x1 + 4, g.y + 4, x2 - x1 - 8, g.ch - 8); ctx.beginPath(); ctx.moveTo(x1 + 6, g.y + g.ch + 60); ctx.lineTo(x1 + 6, g.y + g.ch + 80); ctx.lineTo(x2 - 6, g.y + g.ch + 80); ctx.lineTo(x2 - 6, g.y + g.ch + 60); ctx.stroke(); });
        alpha(ctx, P(l, at(b, "tiga permen loli"), 0.5), () => text(ctx, "3 loli berturut-turut, tanpa sikat gigi", (x1 + x2) / 2, g.y + g.ch + 130, 38, { align: "center", weight: 900, color: RED }));
        alpha(ctx, P(l, at(b, "hanya dua"), 0.5), () => text(ctx, "paling banyak 2 yang boleh dimakan", (x1 + x2) / 2, g.y + g.ch + 180, 36, { align: "center", weight: 800, color: INK }));
        alpha(ctx, P(l, at(b, "tujuh tidak mungkin"), 0.5), () => { card(ctx, 160, 600, 640, 140, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "7 tidak mungkin", 480, 655, 44, { align: "center", weight: 900, color: RED }); text(ctx, "6 paling banyak", 480, 712, 44, { align: "center", weight: 900, color: GREEN }); }); }
      return;
    }
    if (id === "c2") {
      alpha(ctx, P(l, 0.2, 0.5), () => { card(ctx, 260, 180, 1400, 130, { fill: "#FFF4DE", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "batasan = aturan yang harus ditaati", 960, 262, 52, { align: "center", weight: 900, color: INK }); });
      alpha(ctx, P(l, at(b, "jadwal pelajaran"), 0.5), () => { card(ctx, 260, 360, 660, 300, { fill: "#FFFFFF", stroke: INK, lw: 3, r: 18 }); text(ctx, "jadwal pelajaran", 590, 420, 40, { align: "center", weight: 900, color: INK });
        ["Senin 07.00  Matematika", "Senin 07.00  Informatika"].forEach((s, k) => text(ctx, s, 590, 490 + k * 55, 32, { align: "center", weight: 800, color: C.ink2 })); hand(ctx, "tidak boleh bentrok!", 590, 625, 36, { color: RED }); });
      alpha(ctx, P(l, at(b, "mengisi tas"), 0.5), () => { card(ctx, 1000, 360, 660, 300, { fill: "#FFFFFF", stroke: INK, lw: 3, r: 18 }); text(ctx, "mengisi tas", 1330, 420, 40, { align: "center", weight: 900, color: INK });
        text(ctx, "boleh dibawa: 5 kg", 1330, 490, 34, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "isi tas: 4 kg", 1330, 545, 34, { align: "center", weight: 800, color: GREEN }); hand(ctx, "tidak boleh lebih berat!", 1330, 625, 36, { color: RED }); });
      return;
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  const LV = { x0: 476, cw: 88, y: 330, ch: 96, bs: 76, fn: 24, fa: 22 };
  function lorong_v(ctx, b, l) {
    board(ctx);
    const id = b.id, g = LV;
    const t0 = id === "h2" ? at(b, "Makan permen") + 0.4 : 0, step = 0.62;
    const done = i => id === "h3" ? 1 : id === "h2" ? P(l, t0 + i * step, 0.3) : 0;
    corridor(ctx, g, { nums: true, done });
    let px = 0; if (id === "h3") px = 10; else if (id === "h2") px = clamp((l - t0) / step, 0, 10);
    walker(ctx, g, px);
    if (id === "h0" || id === "h1") alpha(ctx, id === "h0" ? P(l, at(b, "Setelah makan"), 0.5) : 1, () => { card(ctx, 520, 520, 880, 120, { fill: "#FFF4DE", stroke: ORANGE, lw: 4, r: 18 }); text(ctx, "2 permen loli → gosok gigi dulu", 960, 595, 42, { align: "center", weight: 900, color: INK }); });
    if (id === "h1") thinkBadge(ctx, 610, 670, 700, 76, l, b.hold + 2, "");
    if (id === "h2") alpha(ctx, P(l, at(b, "kotak kesembilan"), 0.5), () => text(ctx, "kotak 9 dilewati", 960, 590, 44, { align: "center", weight: 900, color: RED }));
    if (id === "h3") { const x1 = g.x0 + 6 * g.cw, x2 = g.x0 + 9 * g.cw; alpha(ctx, P(l, at(b, "Tujuh tidak"), 0.5), () => { ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.strokeRect(x1 + 3, g.y + 3, x2 - x1 - 6, g.ch - 6); });
      alpha(ctx, P(l, at(b, "Tujuh tidak"), 0.5), () => text(ctx, "7 tidak mungkin: 3 loli berturut-turut", 960, 580, 34, { align: "center", weight: 900, color: RED }));
      alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => text(ctx, "Jawaban: 6", 960, 680, 60, { align: "center", weight: 900, color: GREEN })); }
  }

  Object.assign(K.SCENES, B.umum(META), { lorong, lorong_v });
})(typeof window !== "undefined" ? window : globalThis);
