/* SG09 Pembahasan Soal Bebras 2017-IR-02 "Membangun Bendungan" (Iran), kategori Siaga (kelas 4–6 SD).
   Papan tulis: batang kayu 10 meter yang dipotong menjadi potongan 4 m (biru) dan 3 m (hijau), sisa terbuang abu-abu.
   Jawaban dihitung ulang di kode (jumlah batang paling sedikit harus 6, dan 5 harus tidak cukup) dan dilaporkan
   lewat K._warn bila berbeda. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, kiko, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter, beaver } = B;
  const META = { judul: "Membangun Bendungan", tahun: "2017", negara: "Iran", kode: "2017-IR-02", flag: "IR", sumber: "Buku Tantangan Bebras Indonesia 2017", bukaFrasa: "lomba",
    tingkat: "kelas 4, 5, dan 6 SD (Siaga)",
    langkah: ["Daftar semua cara memotong satu batang, beserta sisanya.", "Hitung panjang semua yang dibutuhkan: itulah batas paling sedikit.", "Periksa apakah batas itu bisa dicapai; kalau tidak, tambah satu."],
    cta: "Berapa batang kayu paling sedikit?", gambarUlang: "Batang kayu dan berang-berang digambar ulang untuk video ini." };

  // ---------- pemeriksaan jawaban: batang paling sedikit untuk 7 potong 4 m dan 7 potong 3 m ----------
  (function () {
    const pats = []; for (let a = 0; a <= 2; a++) for (let c = 0; c <= 3; c++) if (4 * a + 3 * c <= 10 && a + c > 0) pats.push([a, c]);
    let reach = new Set(["0,0"]), n = 0;
    while (![...reach].some(s => s === "7,7") && n < 10) {
      const nx = new Set(); reach.forEach(s => { const [x, y] = s.split(",").map(Number); pats.forEach(([a, c]) => nx.add(Math.min(7, x + a) + "," + Math.min(7, y + c))); });
      reach = nx; n++;
    }
    if (n !== 6) (K._warn = K._warn || []).push("jawaban salah: paling sedikit " + n + " batang");
  })();

  const BLUE4 = "#3B78D8", GREEN3 = "#3FA34D", WOOD = "#D9A86C", WOOD_D = "#9C6B3F", WASTE = "#C9CED3";
  const OPTS = ["5", "6", "7", "8"];
  // potongan: 4 = biru, 3 = hijau, "w" = sisa terbuang, "s" = sisa disimpan
  function log(ctx, x, y, sc, h, cuts = [], u = 1) {
    // batang kayu utuh
    ctx.fillStyle = WOOD; rr(ctx, x, y - h / 2, 10 * sc, h, 10); ctx.fill();
    ctx.strokeStyle = "rgba(156,107,63,0.45)"; ctx.lineWidth = 2;
    for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x + 14, y - h / 2 + k * h / 3); ctx.lineTo(x + 10 * sc - 14, y - h / 2 + k * h / 3 + 3); ctx.stroke(); }
    ctx.strokeStyle = WOOD_D; ctx.lineWidth = 3; rr(ctx, x, y - h / 2, 10 * sc, h, 10); ctx.stroke();
    // potongan berwarna (muncul berurutan menurut u: 0..jumlah potongan)
    let px = x;
    cuts.forEach((m, i) => {
      const len = (m === "w" || m === "s") ? 10 - cuts.filter(v => typeof v === "number").reduce((a, v) => a + v, 0) : m;
      const v = clamp(u - i, 0, 1); const w = len * sc;
      if (v > 0) {
        ctx.save(); ctx.globalAlpha *= v;
        if (m === 4 || m === 3) {
          ctx.fillStyle = m === 4 ? BLUE4 : GREEN3; rr(ctx, px + 3, y - h / 2 + 3, w - 6, h - 6, 8); ctx.fill();
          text(ctx, m + " m", px + w / 2, y + h * 0.2, Math.min(h * 0.55, 34), { align: "center", weight: 900, color: "#fff" });
        } else if (m === "w") {
          ctx.fillStyle = WASTE; rr(ctx, px + 3, y - h / 2 + 3, w - 6, h - 6, 8); ctx.fill();
          ctx.save(); rr(ctx, px + 3, y - h / 2 + 3, w - 6, h - 6, 8); ctx.clip(); ctx.strokeStyle = "rgba(90,100,110,0.5)"; ctx.lineWidth = 3;
          for (let k = -h; k < w; k += 16) { ctx.beginPath(); ctx.moveTo(px + k, y + h / 2); ctx.lineTo(px + k + h, y - h / 2); ctx.stroke(); }
          ctx.restore();
          if (w > 70) text(ctx, "sisa", px + w / 2, y + h * 0.18, Math.min(h * 0.45, 28), { align: "center", weight: 900, color: "#4A545D" });
        } else if (m === "s" && w > 120) {
          text(ctx, "sisa disimpan", px + w / 2, y + h * 0.18, Math.min(h * 0.45, 28), { align: "center", weight: 800, color: "#6B4A2B" });
        }
        ctx.restore();
        if (px > x) { ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(px, y - h / 2 - 8); ctx.lineTo(px, y + h / 2 + 8); ctx.stroke(); ctx.setLineDash([]); }
      }
      px += w;
    });
  }
  function piece(ctx, x, y, m, sc, h, a = 1) {
    if (a <= 0) return;
    alpha(ctx, a, () => { ctx.fillStyle = m === 4 ? BLUE4 : GREEN3; rr(ctx, x, y - h / 2, m * sc, h, 8); ctx.fill(); text(ctx, m + " m", x + m * sc / 2, y + h * 0.2, Math.min(h * 0.55, 30), { align: "center", weight: 900, color: "#fff" }); });
  }
  function ruler(ctx, x, y, sc, a = 1) {
    alpha(ctx, a, () => {
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 10 * sc, y); ctx.stroke();
      for (let m = 0; m <= 10; m++) { ctx.beginPath(); ctx.moveTo(x + m * sc, y - 10); ctx.lineTo(x + m * sc, y + 10); ctx.stroke(); text(ctx, String(m), x + m * sc, y + 42, 28, { align: "center", weight: 800, color: INK }); }
    });
  }
  // kebutuhan Ali: 7 potong 4 m dan 7 potong 3 m
  function needs(ctx, x, y, sc, l, b, opt = {}) {
    text(ctx, "4 m", x, y + 12, 36, { weight: 900, color: BLUE4 }); text(ctx, "3 m", x, y + 132, 36, { weight: 900, color: GREEN3 });
    for (let i = 0; i < 7; i++) {
      piece(ctx, x + 90 + i * (4 * sc + 14), y, 4, sc, 60, opt.a4 ? opt.a4(i) : 1);
      piece(ctx, x + 90 + i * (3 * sc + 14), y + 120, 3, sc, 60, opt.a3 ? opt.a3(i) : 1);
    }
  }
  function optionsRow(ctx, x, y0, marks = {}, size = 46, gap = 260, cols = 4) {
    OPTS.forEach((o, i) => {
      const cx = x + (i % cols) * gap, y = y0 + Math.floor(i / cols) * 80;
      letter(ctx, "ABCD"[i], cx + 28, y - 16, 28, false);
      text(ctx, o + " batang", cx + 68, y, size * 0.8, { weight: 900, color: INK });
      const m = marks[i]; if (!m) return;
      if (m.k === "x") mline(ctx, [[cx, y - 14], [cx + Math.min(gap - 35, 230), y - 14]], m.u, RED, 6);
      if (m.k === "ok") ring(ctx, cx + Math.min(gap, 260) / 2 - 18, y - 14, Math.min(gap, 260) / 2 + 2, 40, m.u, GREEN, 6);
    });
  }
  const PATS = [[4, 3, 3], [4, 4, "w"], [3, 3, 3, "w"]], PATSUM = ["4 + 3 + 3 = 10", "4 + 4 = 8", "3 + 3 + 3 = 9"], PATSISA = ["sisa 0", "sisa 2", "sisa 1"];
  // enam batang jawaban
  const SIX = [[4, 3, 3], [4, 3, 3], [4, 3, 3], [4, 4, "w"], [4, 4, "w"], [3, "s"]];
  function counter(ctx, x, y, m, n, need, col) {
    text(ctx, "potongan " + m + " m", x, y, 36, { weight: 900, color: INK });
    for (let i = 0; i < need; i++) {
      const bx = x + i * 62, by = y + 24;
      ctx.lineWidth = 3; ctx.strokeStyle = col; rr(ctx, bx, by, 50, 40, 8); ctx.stroke();
      if (i < n) { ctx.fillStyle = col; rr(ctx, bx, by, 50, 40, 8); ctx.fill(); }
    }
    text(ctx, Math.floor(n) + " dari " + need, x + need * 62 + 16, y + 56, 34, { weight: 900, color: n >= need ? GREEN : INK });
  }

  // ---------- adegan utama ----------
  function kayu(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "soal1") {
      beaver(ctx, 230, 520, 210, { shirt: "#F2B134" }); text(ctx, "Jordan", 230, 690, 40, { align: "center", weight: 900, color: INK });
      const u = P(l, at(b, "Bebras Jordan"), 0.8);
      ctx.save(); ctx.beginPath(); ctx.rect(470, 250, 1260 * u, 300); ctx.clip(); log(ctx, 480, 400, 120, 90); ctx.restore();
      ruler(ctx, 480, 500, 120, P(l, at(b, "satu batang kayu"), 0.6));
      hand(ctx, "1 batang = 10 meter", 1080, 300, 54, { color: ORANGE, alpha: P(l, at(b, "sepuluh meter"), 0.6) });
    }
    if (id === "soal2" || id === "p4") {
      beaver(ctx, 230, 520, 210, { shirt: "#3B78D8" }); text(ctx, "Ali", 230, 690, 40, { align: "center", weight: 900, color: INK });
      if (id === "soal2") {
        hand(ctx, "kayu untuk bendungan", 1080, 210, 46, { color: INK, alpha: P(l, at(b, "membangun bendungan"), 0.5) });
        const t4 = at(b, "tujuh potong kayu"), t3 = at(b, "tujuh potong kayu", "dan");
        needs(ctx, 480, 340, 34, l, b, { a4: i => P(l, t4 + i * 0.15, 0.3), a3: i => P(l, t3 + i * 0.15, 0.3) });
        alpha(ctx, P(l, t4 + 1.2, 0.4), () => text(ctx, "× 7", 1800, 352, 40, { align: "right", weight: 900, color: BLUE4 }));
        alpha(ctx, P(l, t3 + 1.2, 0.4), () => text(ctx, "× 7", 1800, 472, 40, { align: "right", weight: 900, color: GREEN3 }));
      } else {
        needs(ctx, 480, 380, 34, l, b);
        thinkBadge(ctx, 1240, 170, 560, 150, l, b.hold + 2, "Berapa meter jumlahnya?");
        hand(ctx, "jumlah = ? meter", 900, 680, 54, { color: ORANGE, alpha: P(l, 0.6, 0.5) });
      }
    }
    if (id === "soal3") {
      beaver(ctx, 200, 560, 170, { shirt: "#F2B134" }); text(ctx, "Jordan", 200, 700, 34, { align: "center", weight: 900, color: INK });
      beaver(ctx, 1720, 560, 170, { shirt: "#3B78D8", flip: true }); text(ctx, "Ali", 1720, 700, 34, { align: "center", weight: 900, color: INK });
      log(ctx, 360, 330, 120, 90);
      const tc = at(b, "boleh memotong");
      [4, 7].forEach((m, i) => { const v = P(l, tc + i * 0.5, 0.5); if (v > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(360 + m * 120, 330 - 70); ctx.lineTo(360 + m * 120, 330 - 70 + 140 * v); ctx.stroke(); ctx.setLineDash([]); } });
      hand(ctx, "boleh dipotong", 960, 470, 44, { color: RED, alpha: P(l, tc, 0.5) });
      hand(ctx, "batang sesedikit mungkin", 960, 610, 60, { color: ORANGE, alpha: P(l, at(b, "sesedikit mungkin"), 0.5) });
    }
    if (id === "soal4") {
      card(ctx, 260, 180, 1400, 120, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Berapa batang kayu paling sedikit?", 960, 258, 48, { align: "center", weight: 900, color: INK });
      OPTS.forEach((o, i) => alpha(ctx, P(l, at(b, "Pilihan " + "ABCD"[i]), 0.4), () => { const cx = 330 + i * 340; letter(ctx, "ABCD"[i], cx + 34, 420, 34, false); text(ctx, o, cx + 86, 440, 60, { weight: 900, color: INK }); }));
      log(ctx, 300, 600, 60, 54); text(ctx, "1 batang = 10 m", 300, 680, 32, { weight: 800, color: INK });
      for (let i = 0; i < 4; i++) piece(ctx, 1000 + i * 120, 580, 4, 26, 40); for (let i = 0; i < 4; i++) piece(ctx, 1000 + i * 95, 640, 3, 26, 40);
      text(ctx, "butuh 7 × 4 m dan 7 × 3 m", 1000, 710, 32, { weight: 800, color: INK });
      text(ctx, "…", 1490, 590, 40, { weight: 900, color: INK }); text(ctx, "…", 1385, 650, 40, { weight: 900, color: INK });
    }
    if (["p1", "p2", "p3", "q2"].includes(id)) {
      const show = id === "p1" ? 1 : id === "p2" ? 2 : 3;
      for (let r = 0; r < show; r++) {
        const y = 230 + r * 180, cur = (r === 0 && id === "p1") || (r === 1 && id === "p2") || (r === 2 && id === "p3");
        const t0 = cur ? at(b, ["Cara pertama", "Cara kedua", "Cara ketiga"][r]) : -9;
        text(ctx, "Cara " + (r + 1), 90, y + 14, 40, { weight: 900, color: INK });
        log(ctx, 300, y, 80, 76, PATS[r], cur ? clamp((l - t0) / 0.5, 0, PATS[r].length) : 9);
        alpha(ctx, cur ? P(l, at(b, "Jumlahnya"), 0.5) : 1, () => {
          text(ctx, PATSUM[r], 1160, y + 2, 44, { weight: 900, color: INK });
          text(ctx, PATSISA[r], 1160, y + 50, 36, { weight: 900, color: r === 0 ? GREEN : "#6B7680" });
        });
      }
      if (id === "p2") alpha(ctx, P(l, at(b, "Tiga potong empat meter"), 0.5), () => { text(ctx, "4 + 4 + 4 = 12 → tidak muat", 1160, 520, 32, { weight: 800, color: RED }); });
      if (id === "p3") ring(ctx, 1290, 590, 210, 70, P(l, at(b, "tidak menghasilkan"), 0.6), ORANGE, 5);
      if (id === "q2") {
        cross(ctx, 700, 410, 150, P(l, at(b, "tidak boleh dipakai"), 0.5), RED, 12);
        alpha(ctx, P(l, at(b, "membuang dua meter"), 0.5), () => text(ctx, "membuang 2 m", 1460, 460, 34, { weight: 900, color: RED }));
        const tk = at(b, "Yang tersisa");
        tick(ctx, 1700, 230, 60, P(l, tk, 0.5), GREEN); tick(ctx, 1700, 590, 60, P(l, tk + 0.4, 0.5), GREEN);
        hand(ctx, "boleh terbuang: 1 m", 1500, 770 - 40, 40, { color: ORANGE, alpha: 1 });
      }
    }
    if (id === "p5") {
      const L = [["7 × 4 m = 28 m", "Tujuh potong empat", BLUE4], ["7 × 3 m = 21 m", "Tujuh potong tiga", GREEN3], ["28 + 21 = 49 m", "jumlahnya", INK]];
      L.forEach(([s, ph, c], i) => alpha(ctx, P(l, at(b, ph), 0.5), () => text(ctx, s, 160, 250 + i * 110, i === 2 ? 60 : 52, { weight: 900, color: c })));
      mline(ctx, [[150, 395], [640, 395]], P(l, at(b, "jumlahnya") - 0.3, 0.5), INK, 4);
      ring(ctx, 535, 452, 110, 52, P(l, at(b, "empat puluh sembilan") + 0.4, 0.6), ORANGE, 6);
      const t4 = at(b, "Empat batang"), t5 = at(b, "lima batang");
      alpha(ctx, P(l, t4, 0.5), () => { for (let i = 0; i < 4; i++) log(ctx, 900, 210 + i * 58, 42, 42); text(ctx, "4 batang = 40 m", 1360, 310, 44, { weight: 900, color: INK }); text(ctx, "kurang!", 1360, 365, 40, { weight: 900, color: RED }); });
      cross(ctx, 1110, 300, 150, P(l, at(b, "tidak cukup"), 0.5), RED, 10);
      alpha(ctx, P(l, t5, 0.5), () => { for (let i = 0; i < 5; i++) log(ctx, 900, 470 + i * 52, 42, 38); text(ctx, "5 batang = 50 m", 1360, 560, 44, { weight: 900, color: INK }); hand(ctx, "paling sedikit 5?", 1500, 640, 44, { color: ORANGE }); });
    }
    if (id === "q1") {
      for (let i = 0; i < 5; i++) log(ctx, 160, 220 + i * 100, 60, 64);
      text(ctx, "5 batang = 50 m", 1000, 280, 54, { weight: 900, color: INK });
      alpha(ctx, P(l, at(b, "Ali butuh"), 0.5), () => text(ctx, "butuh     49 m", 1000, 380, 54, { weight: 900, color: INK }));
      alpha(ctx, P(l, at(b, "Ali butuh") + 0.6, 0.5), () => mline(ctx, [[990, 410], [1460, 410]], 1, INK, 4));
      alpha(ctx, P(l, at(b, "hanya boleh"), 0.5), () => { text(ctx, "terbuang ≤ 1 m", 1000, 490, 58, { weight: 900, color: ORANGE }); });
      ring(ctx, 1210, 470, 240, 60, P(l, at(b, "satu meter") , 0.6), ORANGE, 6);
    }
    if (id === "q3") {
      const t0 = at(b, "cara pertama"), tf = at(b, "lima batang paling banyak");
      const nLog = l < tf ? 1 : 1 + clamp((l - tf) / 0.5, 0, 4);
      for (let i = 0; i < 5; i++) alpha(ctx, clamp(nLog - i, 0, 1), () => log(ctx, 130, 210 + i * 98, 66, 66, [4, 3, 3], 9));
      ring(ctx, 130 + 132, 210, 150, 52, P(l, t0 + 0.3, 0.6), ORANGE, 5);
      alpha(ctx, P(l, at(b, "cara ketiga"), 0.4), () => { text(ctx, "cara 3: 3 + 3 + 3 → tidak ada 4 m", 860, 210, 34, { weight: 800, color: "#6B7680" }); });
      const n4 = clamp(Math.floor(nLog), 0, 5);
      alpha(ctx, P(l, tf, 0.4), () => counter(ctx, 860, 330, 4, l < tf ? 0 : n4, 7, BLUE4));
      alpha(ctx, P(l, at(b, "Padahal"), 0.5), () => text(ctx, "kurang 2 potong!", 860, 470, 48, { weight: 900, color: RED }));
      alpha(ctx, P(l, at(b, "Lima batang tidak cukup"), 0.5), () => optionsRow(ctx, 860, 640, { 0: { k: "x", u: P(l, at(b, "bukan lima"), 0.5) } }, 44, 240));
    }
    if (["r0", "r1", "r2", "r3", "j1", "j2", "c3"].includes(id)) {
      const k = ["r0", "r1", "r2", "r3"].indexOf(id); const after = k < 0;
      // berapa potongan dari tiap batang yang sudah tampil
      const T = { r1: () => [at(b, "Batang pertama"), at(b, "kedua", "Batang pertama"), at(b, "ketiga", "Batang pertama")], r2: () => [at(b, "Batang keempat"), at(b, "kelima", "Batang keempat")], r3: () => [at(b, "Dari batang keenam")] }[id];
      const TT = T ? T() : [];
      const prog = i => {
        const done = after ? 1 : (k >= 1 && i < 3 && id !== "r1") || (k >= 2 && i < 5 && id === "r3") ? 1 : 0;
        if (done) return 9;
        const own = id === "r1" && i < 3 ? TT[i] : id === "r2" && (i === 3 || i === 4) ? TT[i - 3] : id === "r3" && i === 5 ? TT[0] : null;
        return own == null ? 0 : clamp((l - own - 0.2) / 0.45, 0, SIX[i].length);
      };
      let n4 = 0, n3 = 0;
      SIX.forEach((cuts, i) => {
        const y = 200 + i * 98, u = prog(i);
        text(ctx, String(i + 1), 120, y + 13, 36, { align: "center", weight: 900, color: INK });
        log(ctx, 160, y, 70, 64, cuts, u);
        cuts.forEach((m, j) => { if (u >= j + 0.5) { if (m === 4) n4++; if (m === 3) n3++; } });
      });
      counter(ctx, 1000, 220, 4, n4, 7, BLUE4); counter(ctx, 1000, 360, 3, n3, 7, GREEN3);
      if (id === "r0") thinkBadge(ctx, 1000, 520, 560, 150, l, b.hold + 2, "Bagaimana memotong 6 batang?");
      if (id === "j1") alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => { card(ctx, 1000, 520, 640, 130, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: B. 6 batang", 1320, 605, 54, { align: "center", weight: 900, color: GREEN }); });
      if (id === "j2") {
        optionsRow(ctx, 1000, 560, { 0: { k: "x", u: 1 }, 1: { k: "ok", u: 1 }, 2: { k: "x", u: P(l, at(b, "Tujuh atau delapan"), 0.5) }, 3: { k: "x", u: P(l, at(b, "Tujuh atau delapan") + 0.4, 0.5) } }, 44, 300, 2);
      }
      if (id === "j2") alpha(ctx, P(l, at(b, "bukan yang paling sedikit"), 0.5), () => text(ctx, "cukup, tetapi tidak paling sedikit", 1000, 740, 36, { weight: 800, color: RED }));
      if (id === "c3") hand(ctx, "6 batang", 1400, 620, 90, { color: GREEN, alpha: P(l, at(b, "enam batang"), 0.5) });
    }
    if (id === "c2") {
      const rows = [["kayu", WOOD, WOOD_D], ["pipa", "#AEB8C1", "#5C6670"], ["kain", "#E06B8B", "#A33C5A"], ["kertas", "#F4F1E8", "#9AA4AC"]];
      const tf = at(b, "kayu, pipa");
      rows.forEach(([nm, f, s], i) => alpha(ctx, P(l, tf + i * 0.45, 0.4), () => {
        const y = 230 + i * 130;
        text(ctx, nm, 120, y + 14, 36, { weight: 900, color: INK });
        ctx.fillStyle = f; rr(ctx, 300, y - 34, 640, 68, 10); ctx.fill(); ctx.strokeStyle = s; ctx.lineWidth = 3; ctx.stroke();
        [220, 400, 560].forEach(xx => { ctx.strokeStyle = INK; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(300 + xx, y - 44); ctx.lineTo(300 + xx, y + 44); ctx.stroke(); ctx.setLineDash([]); });
        ctx.fillStyle = WASTE; rr(ctx, 863, y - 30, 74, 60, 8); ctx.fill();
      }));
      // layar komputer
      const X = 1100, Y = 180, W = 640, Hh = 400;
      ctx.fillStyle = "#2B3440"; rr(ctx, X, Y, W, Hh, 22); ctx.fill(); ctx.fillStyle = "#1E2730"; rr(ctx, X + 20, Y + 20, W - 40, Hh - 40, 12); ctx.fill();
      ctx.fillStyle = "#2B3440"; ctx.fillRect(X + W / 2 - 40, Y + Hh, 80, 50); rr(ctx, X + W / 2 - 160, Y + Hh + 44, 320, 24, 10); ctx.fill();
      const tc = at(b, "komputer");
      for (let r = 0; r < 4; r++) { const u = clamp((l - tc - r * 0.6) / 0.6, 0, 3); log(ctx, X + 60, Y + 80 + r * 80, 52, 50, [[4, 3, 3], [4, 4, "w"], [3, 3, 4], [4, 3, 3]][r], u); }
      hand(ctx, "cari cara paling hemat", 1420, 760, 50, { color: ORANGE, alpha: P(l, at(b, "paling hemat"), 0.5) });
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function kayu_v(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "h0" || id === "h1") {
      log(ctx, 510, 250, 90, 64); ruler(ctx, 510, 316, 90, 1);
      text(ctx, "1 batang = 10 m", 960, 196, 40, { align: "center", weight: 900, color: ORANGE });
      const t = id === "h0" ? at(b, "Ali butuh") : -9;
      for (let i = 0; i < 7; i++) { piece(ctx, 500 + i * 136, 440, 4, 30, 54, P(l, t + i * 0.12, 0.3)); piece(ctx, 500 + i * 104, 530, 3, 30, 54, P(l, t + 1.2 + i * 0.12, 0.3)); }
      if (id === "h1") alpha(ctx, P(l, at(b, "Pilihannya"), 0.5), () => OPTS.forEach((o, i) => { const x = 520 + i * 235; letter(ctx, "ABCD"[i], x + 24, 660, 24, false); text(ctx, o, x + 60, 676, 46, { weight: 900, color: INK }); }));
      if (id === "h1") text(ctx, "batang paling sedikit?", 960, 780, 42, { align: "center", weight: 900, color: ORANGE });
    }
    if (id === "h2") {
      text(ctx, "7 × 4 + 7 × 3 = 49 m", 960, 260, 56, { align: "center", weight: 900, color: INK });
      alpha(ctx, P(l, at(b, "Kalau lima batang"), 0.5), () => {
        for (let i = 0; i < 5; i++) log(ctx, 560, 340 + i * 64, 80, 46);
        text(ctx, "5 batang = 50 m", 960, 700, 46, { align: "center", weight: 900, color: INK });
      });
      alpha(ctx, P(l, at(b, "hanya boleh"), 0.5), () => text(ctx, "terbuang ≤ 1 m", 960, 770, 46, { align: "center", weight: 900, color: ORANGE }));
    }
    if (id === "h3") {
      for (let r = 0; r < 3; r++) {
        const y = 230 + r * 150;
        log(ctx, 520, y, 70, 64, PATS[r], 9);
        text(ctx, PATSISA[r], 1260, y + 12, 34, { weight: 900, color: r === 0 ? GREEN : "#6B7680" });
      }
      cross(ctx, 870, 380, 130, P(l, at(b, "tidak boleh dipakai"), 0.5), RED, 10);
      alpha(ctx, P(l, at(b, "Akibatnya"), 0.5), () => { text(ctx, "5 batang → paling banyak", 960, 700, 40, { align: "center", weight: 900, color: INK }); text(ctx, "5 potong 4 m (butuh 7)", 960, 760, 44, { align: "center", weight: 900, color: RED }); });
    }
    if (id === "h4") {
      const t = at(b, "Dengan enam batang");
      SIX.forEach((cuts, i) => log(ctx, 610, 200 + i * 82, 70, 58, cuts, clamp((l - t - 0.5 - i * 0.6) / 0.4, 0, cuts.length)));
      alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => text(ctx, "Jawaban: 6 batang", 960, 760, 54, { align: "center", weight: 900, color: GREEN }));
    }
  }

  Object.assign(K.SCENES, B.umum(META), { kayu, kayu_v });
})(typeof window !== "undefined" ? window : globalThis);
