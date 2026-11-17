/* PG09 Pembahasan Soal Bebras 2018-BE-04 "Jadwal Gladi Resik" (Belgia), kategori Penegak (SMA).
   Papan tulis: enam penari sebagai simpul, sepuluh pasangan sebagai sisi, tarian berantai sebagai jalan di graf,
   derajat simpul (hanya Ana dan Fani ganjil), lalu jalur Euler bernomor 1–10.
   Derajat, pasangan pertama yang mungkin, dan contoh jadwal diperiksa ulang di kode (brute force); K._warn bila berbeda.
   Papan: x 52–1868, y 130–830. Graf di kiri (x 130–990), panel kanan x 1060–1840. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter, noteCard } = B;
  const BLUE = "#2F6FD0";
  const META = { judul: "Jadwal Gladi Resik", tahun: "2018", negara: "Belgia", kode: "2018-BE-04", flag: "BE", sumber: "Buku Tantangan Bebras Indonesia 2018", bukaFrasa: "Bebras",
    tingkat: "kelas 10, 11, dan 12 SMA (Penegak)",
    langkah: ["Gambarlah soal sebagai graf: penari = simpul, pasangan = garis.", "Ubah aturan soal menjadi aturan berjalan di graf.", "Hitung garis di setiap simpul untuk mencari awal dan akhir."],
    cta: "Siapa yang tidak bisa menari pertama?", gambarUlang: "Graf dan kartu tarian digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const NAMA = { A: "Ana", B: "Budi", C: "Cinta", D: "Dori", E: "Evi", F: "Fani" };
  const KEYS = "ABCDEF".split("");
  const PAIRS = [["A", "B"], ["E", "D"], ["A", "E"], ["B", "C"], ["D", "A"], ["F", "B"], ["C", "E"], ["B", "D"], ["D", "F"], ["F", "E"]];
  const has = (p, k) => p[0] === k || p[1] === k;
  const DEG = {}; KEYS.forEach(k => DEG[k] = PAIRS.filter(p => has(p, k)).length);
  const ODD = KEYS.filter(k => DEG[k] % 2);
  const TRAIL = ["A", "B", "C", "E", "D", "A", "E", "F", "B", "D", "F"];   // contoh jadwal (jalur Euler)
  // pemeriksaan: semua jadwal sah dengan brute force
  const FIRST = new Set(); let NSCHED = 0;
  (function go(seq, used) {
    if (seq.length === PAIRS.length) { NSCHED++; FIRST.add(PAIRS[seq[0]].slice().sort().join("")); return; }
    for (let i = 0; i < PAIRS.length; i++) {
      if (used & (1 << i)) continue;
      const p = PAIRS[i], n = seq.length;
      if (n) { const q = PAIRS[seq[n - 1]]; if (!(has(q, p[0]) || has(q, p[1]))) continue; }
      if (n >= 2) { const q = PAIRS[seq[n - 1]], r = PAIRS[seq[n - 2]]; if (KEYS.some(k => has(p, k) && has(q, k) && has(r, k))) continue; }
      go(seq.concat(i), used | (1 << i));
    }
  })([], 0);
  const trailOk = (() => { const seen = new Set(); for (let i = 1; i < TRAIL.length; i++) { const k = [TRAIL[i - 1], TRAIL[i]].sort().join(""); if (seen.has(k) || !PAIRS.some(p => p.slice().sort().join("") === k)) return false; seen.add(k); } return seen.size === 10; })();
  const firstStr = [...FIRST].sort().join(" ");
  if (ODD.join("") !== "AF" || DEG.C !== 2 || [...FIRST].some(s => s.includes("C")) || !trailOk || NSCHED !== 264 || firstStr !== "AB AD AE BF DF EF")
    (K._warn = K._warn || []).push("data salah: ganjil=" + ODD.join("") + " jadwal=" + NSCHED + " pertama=" + firstStr + " trail=" + trailOk);
  const OPTS = ["Ana", "Cinta", "Evi", "Dori", "Budi", "Fani"];

  // ---------- tata letak graf ----------
  const BASE = { A: [0, 260], B: [320, 0], D: [320, 260], E: [320, 520], F: [540, 260], C: [750, 260] };
  let OX = 180, OY = 200, SC = 1, SY = 0.9, R = 54;
  const pos = k => [OX + BASE[k][0] * SC, OY + BASE[k][1] * SC * SY];
  function seg(a, b, ra = R + 6, rb = R + 6) {
    const [x1, y1] = pos(a), [x2, y2] = pos(b), d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d;
    return [[x1 + ux * ra, y1 + uy * ra], [x2 - ux * rb, y2 - uy * rb]];
  }
  function edge(ctx, p, u = 1, col = INK, w = 6) { if (u <= 0) return; mline(ctx, [pos(p[0]), pos(p[1])], u, col, w); }
  function node(ctx, k, a = 1, opt = {}) {
    alpha(ctx, a, () => {
      const [x, y] = pos(k), r = R * (opt.big || 1);
      ctx.fillStyle = opt.fill || "#FFF6E8"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = opt.stroke || ORANGE; ctx.lineWidth = 5; ctx.stroke();
      text(ctx, NAMA[k], x, y + r * 0.2, r * 0.56, { align: "center", weight: 900, color: INK });
    });
  }
  function degBadge(ctx, k, a, odd) {
    alpha(ctx, a, () => {
      const [x, y] = pos(k), bx = x + R * 0.78, by = y - R * 0.86, r = R * 0.42;
      ctx.fillStyle = odd ? RED : BLUE; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(DEG[k]), bx, by + r * 0.4, r * 1.15, { align: "center", weight: 900, color: "#fff" });
    });
  }
  // jalan bernomor (arah) sepanjang daftar simpul
  function walk(ctx, keys, u, col, numbered) {
    const n = keys.length - 1, f = clamp(u, 0, 1) * n;
    for (let i = 0; i < n; i++) {
      const v = clamp(f - i, 0, 1); if (v <= 0) break;
      mline(ctx, seg(keys[i], keys[i + 1]), v, col, 9, true);
      if (numbered && v > 0.5) {
        const [[x1, y1], [x2, y2]] = seg(keys[i], keys[i + 1]), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = y2 - y1, dy = x1 - x2, d = Math.hypot(dx, dy);
        const nx = mx + dx / d * 26, ny = my + dy / d * 26;
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(nx, ny, 19, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
        text(ctx, String(i + 1), nx, ny + 9, 24, { align: "center", weight: 900, color: col });
      }
    }
  }
  const pairName = p => NAMA[p[0]] + " – " + NAMA[p[1]];
  // kartu tarian di panel kanan
  function danceCard(ctx, x, y, w, s, a, opt = {}) {
    alpha(ctx, a, () => {
      card(ctx, x, y, w, 92, { fill: opt.fill || "#FFFDF7", stroke: opt.stroke || ORANGE, lw: 4, r: 18 });
      text(ctx, s, x + w / 2, y + 60, 40, { align: "center", weight: 900, color: INK, fit: w - 40 });
    });
  }
  function pairList(ctx, x, y, a = () => 1, opt = {}) {
    PAIRS.forEach((p, i) => {
      const xx = x + (i % 2) * 390, yy = y + Math.floor(i / 2) * 82;
      alpha(ctx, a(i), () => {
        text(ctx, (i + 1) + ".", xx, yy, 34, { weight: 900, color: C.ink2 });
        text(ctx, pairName(p), xx + 66, yy, 36, { weight: 800, color: INK, fit: 300 });
        if (opt.check) tick(ctx, xx - 26, yy - 12, 30, opt.check(i), GREEN);
      });
    });
  }

  // kapan setiap sisi muncul pada beat g1
  const edgeShown = (b, l) => {
    if (b.id === "g1") { const t0 = at(b, "sebagai garis"); return i => P(l, t0 + 0.2 + i * 0.45, 0.4); }
    return ["soal1", "soal2", "soal3", "soal4", "soal5"].includes(b.id) ? () => 0 : () => 1;
  };
  const DEG_LATER = ["e5", "k1", "k2", "k3", "j1", "j2", "c3"];

  // ---------- adegan utama ----------
  function graf(ctx, b, l) {
    board(ctx);
    OX = 180; OY = 200; SC = 1; SY = 0.9; R = 54;
    const id = b.id, eu = edgeShown(b, l), RX = 1060, RW = 780;
    // sisi
    PAIRS.forEach((p, i) => {
      let col = INK, w = 6;
      if (id === "k1") { if (has(p, "A") && l > at(b, "Garis milik Ana")) { col = ORANGE; w = 10; } if (has(p, "F") && l > at(b, "Garis milik Fani")) { col = ORANGE; w = 10; } }
      if (id === "k2" || id === "j2") if (has(p, "A") || has(p, "F")) { col = ORANGE; w = 10; }
      if (["g3", "g4", "k3"].includes(id)) col = "rgba(43,52,64,0.35)";
      edge(ctx, p, eu(i), col, w);
    });
    if (id === "g3" || id === "g4") {
      const t0 = at(b, id === "g3" ? "kita berjalan" : "kita lanjut");
      const keys = id === "g3" ? ["A", "E", "C"] : ["A", "E", "C", "B"];
      if (id === "g4") walk(ctx, ["A", "E", "C"], 1, BLUE);
      const u = id === "g3" ? clamp((l - t0) / 3, 0, 1) : (l > t0 ? 1 : 2 / 3);
      if (id === "g3") walk(ctx, keys, u, BLUE); else { walk(ctx, keys.slice(2), P(l, t0, 1), BLUE); }
    }
    if (id === "k3") walk(ctx, TRAIL, clamp((l - at(b, "inilah")) / 7, 0, 1), GREEN, true);
    if (id === "e1") {
      const a = P(l, at(b, "masuk lewat"), 0.6), c = P(l, at(b, "keluar lewat"), 0.6);
      mline(ctx, seg("A", "D"), a, ORANGE, 10, true); mline(ctx, seg("D", "B"), c, ORANGE, 10, true);
      const t2 = at(b, "terpakai berpasangan");
      mline(ctx, seg("F", "D"), P(l, t2, 0.6), GREEN, 10, true); mline(ctx, seg("D", "E"), P(l, t2 + 0.6, 0.6), GREEN, 10, true);
    }
    // simpul
    const nodeA = id === "soal1" ? k => P(l, Math.min(at(b, NAMA[k]), at(b, "enam penari") + KEYS.indexOf(k) * 0.35), 0.5) : () => 1;
    if (id === "soal1") alpha(ctx, P(l, 0.5, 0.6) * (1 - P(l, at(b, "enam penari"), 0.5)), () => { hand(ctx, "pertunjukan tari berpasangan", 560, 420, 56, { color: ORANGE }); const sw = Math.sin(l * 3) * 12; B.beaver(ctx, 1320, 470 + sw, 170); B.beaver(ctx, 1560, 470 - sw, 170, { flip: true, shirt: "#E07AA0" }); });
    KEYS.forEach(k => {
      const opt = {};
      if (id === "e1" && k === "D") opt.big = 1 + 0.15 * P(l, 0.3, 0.6);
      if ((id === "soal3" || id === "soal4") && k === "E") { opt.fill = "#FFE7C7"; }
      node(ctx, k, nodeA(k), opt);
    });
    // derajat
    if (id === "e3") KEYS.forEach(k => { const [x, y] = pos(k); hand(ctx, "?", x + R * 0.9, y - R * 0.7, 48, { color: RED, alpha: P(l, 0.6, 0.5) }); });
    if (id === "e4") {
      const ph = { A: "Ana punya", B: "Budi punya", C: "Cinta punya", D: "Dori punya", E: "Evi punya", F: "Fani punya" };
      KEYS.forEach(k => degBadge(ctx, k, P(l, at(b, ph[k]) + 0.6, 0.4), DEG[k] % 2));
      const t = at(b, "yang ganjil");
      ["A", "F"].forEach(k => { const [x, y] = pos(k); ring(ctx, x, y, R + 22, R + 22, P(l, t, 0.6), RED, 6); });
    }
    if (DEG_LATER.includes(id)) KEYS.forEach(k => degBadge(ctx, k, 1, DEG[k] % 2));
    if (["e5", "k1"].includes(id)) ["A", "F"].forEach(k => { const [x, y] = pos(k); ring(ctx, x, y, R + 22, R + 22, 1, RED, 6); });

    // ---------- panel kanan ----------
    if (id === "soal2") pairList(ctx, RX + 60, 250, i => P(l, at(b, NAMA[PAIRS[i][0]] + " dengan " + NAMA[PAIRS[i][1]]), 0.4));
    if (id === "soal3" || id === "soal4") {
      text(ctx, "tarian berantai", RX + RW / 2, 210, 40, { align: "center", weight: 900, color: INK });
      const t1 = at(b, id === "soal3" ? "setelah Ana dan Evi" : "Jadi, setelah"), t2 = at(b, "Cinta dan Evi");
      danceCard(ctx, RX + 140, 250, 500, "1.  Ana – Evi", P(l, t1, 0.5));
      mline(ctx, [[RX + 390, 350], [RX + 390, 388]], P(l, t2, 0.4), INK, 5, true);
      danceCard(ctx, RX + 140, 395, 500, "2.  Cinta – Evi", P(l, t2, 0.5));
      if (id === "soal3") alpha(ctx, P(l, at(b, "Evi tetap"), 0.5), () => { hand(ctx, "Evi tetap di panggung", RX + RW / 2, 560, 44, { color: ORANGE }); });
      if (id === "soal4") {
        const t3 = at(b, "tarian berikutnya");
        mline(ctx, [[RX + 390, 495], [RX + 390, 533]], P(l, t3, 0.4), INK, 5, true);
        danceCard(ctx, RX + 140, 540, 500, "3.  ? – Evi", P(l, t3, 0.5), { stroke: RED });
        cross(ctx, RX + 390, 586, 80, P(l, t3 + 0.8, 0.5), RED, 8);
        hand(ctx, "Evi lelah: tiga kali berturut-turut", RX + RW / 2, 700, 38, { color: RED, alpha: P(l, at(b, "tidak boleh menari"), 0.5), fit: RW - 40 });
      }
    }
    if (id === "soal5") {
      card(ctx, RX, 180, RW, 150, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Siapa yang tidak boleh", RX + RW / 2, 242, 42, { align: "center", weight: 900, color: INK });
      text(ctx, "menari di tarian pertama?", RX + RW / 2, 298, 42, { align: "center", weight: 900, color: INK });
      OPTS.forEach((o, i) => alpha(ctx, P(l, at(b, "ABCDEF"[i] + " " + o), 0.4), () => { const x = RX + 60 + (i % 2) * 380, y = 430 + Math.floor(i / 2) * 110; letter(ctx, "ABCDEF"[i], x + 30, y - 16, 32, false); text(ctx, o, x + 84, y, 52, { weight: 900, color: INK }); }));
    }
    if (id === "g1") {
      const t0 = at(b, "sebagai garis");
      pairList(ctx, RX + 60, 250, () => 1, { check: i => P(l, t0 + 0.2 + i * 0.45, 0.4) });
      hand(ctx, "penari = titik", RX + 220, 720, 40, { color: ORANGE, alpha: P(l, at(b, "sebagai titik"), 0.5) });
      hand(ctx, "pasangan = garis", RX + 590, 720, 40, { color: ORANGE, alpha: P(l, t0, 0.5) });
    }
    if (id === "g2") {
      hand(ctx, "graf", RX + RW / 2, 280, 96, { color: ORANGE, alpha: P(l, at(b, "disebut graf"), 0.5) });
      noteCard(ctx, RX + 90, 360, 600, ["titik = simpul", "garis = sisi"], P(l, at(b, "Titiknya"), 0.5), { size: 44 });
      alpha(ctx, P(l, at(b, "enam simpul"), 0.5), () => text(ctx, "6 simpul, 10 sisi", RX + RW / 2, 640, 56, { align: "center", weight: 900, color: GREEN }));
      const [dx, dy] = pos("D"); ring(ctx, dx, dy, R + 18, R + 18, P(l, at(b, "disebut simpul"), 0.6), BLUE, 5);
      const [[x1, y1], [x2, y2]] = seg("D", "F"); ring(ctx, (x1 + x2) / 2, (y1 + y2) / 2, 60, 30, P(l, at(b, "disebut sisi"), 0.6), BLUE, 5);
    }
    if (id === "g3" || id === "g4") {
      const cards = ["1.  Ana – Evi", "2.  Evi – Cinta", "3.  Cinta – Budi"];
      const tt = id === "g3" ? [at(b, "Ana dan Evi menari"), at(b, "bersama Cinta"), 1e9] : [-1, -1, at(b, "kita lanjut")];
      cards.forEach((s, i) => danceCard(ctx, RX + 140, 200 + i * 125, 500, s, P(l, tt[i], 0.5)));
      if (id === "g4") {
        alpha(ctx, P(l, at(b, "Jadi, jadwal"), 0.5), () => {
          card(ctx, RX + 20, 590, RW - 40, 150, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 20 });
          text(ctx, "jadwal = jalan yang melewati", RX + RW / 2, 650, 40, { align: "center", weight: 900, color: INK, fit: RW - 80 });
          text(ctx, "setiap garis tepat satu kali", RX + RW / 2, 708, 40, { align: "center", weight: 900, color: GREEN, fit: RW - 80 });
        });
      }
    }
    if (id === "e1") {
      hand(ctx, "masuk", RX + 200, 300, 52, { color: ORANGE, alpha: P(l, at(b, "masuk lewat"), 0.5) });
      hand(ctx, "keluar", RX + 520, 300, 52, { color: ORANGE, alpha: P(l, at(b, "keluar lewat"), 0.5) });
      alpha(ctx, P(l, at(b, "terpakai berpasangan"), 0.5), () => {
        text(ctx, "Dori: 4 garis = 2 pasang", RX + RW / 2, 450, 46, { align: "center", weight: 900, color: INK });
        text(ctx, "(masuk, keluar) + (masuk, keluar)", RX + RW / 2, 520, 36, { align: "center", weight: 800, color: GREEN, fit: RW - 40 });
      });
    }
    if (id === "e2") {
      noteCard(ctx, RX + 40, 230, RW - 80, ["simpul di tengah perjalanan", "jumlah garis harus genap"], P(l, 0.4, 0.5), { size: 40, stroke: BLUE });
      noteCard(ctx, RX + 40, 460, RW - 80, ["simpul awal dan akhir", "boleh ganjil"], P(l, at(b, "Hanya simpul awal"), 0.5), { size: 40, stroke: RED });
    }
    if (id === "e3") thinkBadge(ctx, RX + 20, 300, RW - 40, 180, l, b.hold + 2, "Simpul mana yang garisnya ganjil?");
    if (id === "e4") {
      alpha(ctx, P(l, at(b, "yang ganjil"), 0.5), () => {
        card(ctx, RX + 60, 300, RW - 120, 200, { fill: "#FFF0EE", stroke: RED, lw: 5, r: 20 });
        text(ctx, "ganjil:", RX + RW / 2, 380, 44, { align: "center", weight: 900, color: INK });
        text(ctx, "Ana dan Fani", RX + RW / 2, 455, 60, { align: "center", weight: 900, color: RED });
      });
    }
    if (id === "e5") {
      alpha(ctx, P(l, at(b, "harus dimulai"), 0.5), () => text(ctx, "mulai: Ana atau Fani", RX + RW / 2, 330, 54, { align: "center", weight: 900, color: GREEN }));
      alpha(ctx, P(l, at(b, "berakhir"), 0.5), () => text(ctx, "selesai: simpul yang satunya", RX + RW / 2, 420, 42, { align: "center", weight: 800, color: INK, fit: RW - 40 }));
      alpha(ctx, P(l, at(b, "Artinya"), 0.5), () => {
        card(ctx, RX + 40, 500, RW - 80, 150, { fill: "#FFF8E8", stroke: ORANGE, lw: 5, r: 20 });
        text(ctx, "tarian pertama pasti", RX + RW / 2, 560, 40, { align: "center", weight: 900, color: INK });
        text(ctx, "melibatkan Ana atau Fani", RX + RW / 2, 615, 40, { align: "center", weight: 900, color: ORANGE });
      });
    }
    if (id === "k1" || id === "k2" || id === "j2") {
      text(ctx, "tarian pertama yang mungkin", RX + RW / 2, 210, 38, { align: "center", weight: 900, color: INK });
      const L = [["A", "B"], ["A", "E"], ["A", "D"], ["F", "B"], ["F", "D"], ["F", "E"]];
      L.forEach((p, i) => {
        const a = id === "k1" ? P(l, at(b, NAMA[p[0]] + " dengan " + NAMA[p[1]]), 0.4) : 1;
        const x = RX + 60 + (i >= 3) * 380, y = 290 + (i % 3) * 82;
        alpha(ctx, a, () => text(ctx, pairName(p), x, y, 40, { weight: 900, color: id === "j2" && (p[1] === "D" || p[1] === "E") ? GREEN : ORANGE }));
      });
      if (id === "k2") {
        alpha(ctx, P(l, at(b, "Penari yang muncul"), 0.5), () => text(ctx, "Ana, Budi, Dori, Evi, Fani", RX + RW / 2, 580, 42, { align: "center", weight: 800, color: INK }));
        alpha(ctx, P(l, at(b, "Cinta tidak pernah"), 0.5), () => text(ctx, "tidak ada Cinta!", RX + RW / 2, 680, 60, { align: "center", weight: 900, color: RED }));
      }
      if (id === "j2") alpha(ctx, P(l, at(b, "Misalnya"), 0.5), () => text(ctx, "Dori dan Evi bisa memulai", RX + RW / 2, 600, 44, { align: "center", weight: 900, color: GREEN }));
    }
    if (id === "k2" || id === "c3") {
      const [x, y] = pos("C"), t = id === "k2" ? at(b, "Cinta tidak pernah") : 0.3;
      ring(ctx, x, y, R + 24, R + 24, P(l, t, 0.6), RED, 7);
      if (id === "k2") cross(ctx, x, y + R + 60, 50, P(l, at(b, "tidak mungkin"), 0.5), RED, 8);
    }
    if (id === "k3") {
      const t0 = at(b, "inilah");
      for (let i = 0; i < 10; i++) {
        const x = RX + 40 + (i >= 5) * 390, y = 230 + (i % 5) * 76;
        alpha(ctx, P(l, t0 + i * 0.7 + 0.3, 0.4), () => { text(ctx, (i + 1) + ".", x, y, 32, { weight: 900, color: GREEN }); text(ctx, NAMA[TRAIL[i]] + " – " + NAMA[TRAIL[i + 1]], x + 60, y, 34, { weight: 800, color: INK, fit: 300 }); });
      }
      alpha(ctx, P(l, at(b, "Setiap pasangan"), 0.5), () => { text(ctx, "10 pasangan, masing-masing sekali", RX + RW / 2, 660, 38, { align: "center", weight: 900, color: GREEN, fit: RW - 40 }); text(ctx, "tidak ada yang menari 3 kali beruntun", RX + RW / 2, 720, 34, { align: "center", weight: 800, color: INK, fit: RW - 40 }); });
    }
    if (id === "j1") {
      const t = at(b, "jawabannya");
      OPTS.forEach((o, i) => { const x = RX + 60 + (i % 2) * 380, y = 250 + Math.floor(i / 2) * 100; letter(ctx, "ABCDEF"[i], x + 30, y - 16, 30, i === 1 && l > t); text(ctx, o, x + 80, y, 46, { weight: 900, color: INK }); if (i === 1) ring(ctx, x + 130, y - 16, 150, 44, P(l, t, 0.5), GREEN, 5); });
      alpha(ctx, P(l, t + 0.4, 0.5), () => { card(ctx, RX + 120, 560, RW - 240, 150, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: B. Cinta", RX + RW / 2, 655, 58, { align: "center", weight: 900, color: GREEN }); });
      const [x, y] = pos("C"); ring(ctx, x, y, R + 24, R + 24, P(l, t, 0.6), GREEN, 7);
    }
    if (id === "c2") {
      hand(ctx, "jalur Euler", RX + RW / 2, 260, 80, { color: ORANGE, alpha: P(l, at(b, "disebut jalur Euler"), 0.5) });
      alpha(ctx, P(l, at(b, "Leonhard"), 0.5), () => text(ctx, "Leonhard Euler, 1707–1783", RX + RW / 2, 330, 34, { align: "center", weight: 800, color: C.ink2 }));
      walk(ctx, TRAIL, clamp((l - at(b, "disebut jalur Euler")) / 4, 0, 1), GREEN);
      const icons = [["rute", "rute pengiriman"], ["jadwal", "menyusun jadwal"], ["jaringan", "jaringan komputer"]];
      icons.forEach(([k, s], i) => alpha(ctx, P(l, at(b, s), 0.5), () => icon(ctx, k, RX + 130 + i * 260, 520, s)));
    }
    if (id === "c3") alpha(ctx, P(l, 0.6, 0.5), () => {
      card(ctx, RX + 40, 330, RW - 80, 200, { fill: "#FFF8E8", stroke: ORANGE, lw: 5, r: 22 });
      text(ctx, "Cinta tidak bisa", RX + RW / 2, 410, 52, { align: "center", weight: 900, color: INK });
      text(ctx, "menari pertama", RX + RW / 2, 480, 52, { align: "center", weight: 900, color: RED });
    });
  }
  function icon(ctx, k, x, y, label) {
    card(ctx, x - 100, y - 100, 200, 180, { fill: "#F7F9FA", stroke: INK, lw: 3, r: 18 });
    ctx.save(); ctx.lineCap = "round";
    if (k === "rute") {
      mline(ctx, [[x - 70, y + 40], [x - 20, y - 10], [x + 20, y + 20], [x + 70, y - 50]], 1, BLUE, 7);
      [[x - 70, y + 40], [x - 20, y - 10], [x + 20, y + 20], [x + 70, y - 50]].forEach(([a, c]) => { ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(a, c, 11, 0, Math.PI * 2); ctx.fill(); });
    } else if (k === "jadwal") {
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(x - 70, y - 60, 140, 120); ctx.fillStyle = RED; ctx.fillRect(x - 70, y - 60, 140, 28);
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 70 + i * 35, y - 32); ctx.lineTo(x - 70 + i * 35, y + 60); ctx.stroke(); }
      for (let j = 1; j < 3; j++) { ctx.beginPath(); ctx.moveTo(x - 70, y - 32 + j * 31); ctx.lineTo(x + 70, y - 32 + j * 31); ctx.stroke(); }
    } else {
      const pts = [[x, y - 55], [x - 65, y + 35], [x + 65, y + 35], [x, y + 5]];
      [[0, 1], [0, 2], [1, 2], [0, 3], [1, 3], [2, 3]].forEach(([a, c]) => mline(ctx, [pts[a], pts[c]], 1, C.ink2, 4));
      pts.forEach(([a, c]) => { ctx.fillStyle = BLUE; ctx.fillRect(a - 18, c - 13, 36, 26); ctx.fillStyle = "#BFE6F2"; ctx.fillRect(a - 13, c - 9, 26, 16); });
    }
    ctx.restore();
    text(ctx, label, x, y + 130, 28, { align: "center", weight: 800, color: INK, fit: 250 });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function graf_v(ctx, b, l) {
    board(ctx);
    OX = 641; OY = 200; SC = 0.85; SY = 1; R = 46;
    const id = b.id;
    const eu = id === "h2" ? i => P(l, at(b, "pasangan sebagai garis") + i * 0.3, 0.4) : (id === "h0" || id === "h1" ? () => 0 : () => 1);
    PAIRS.forEach((p, i) => edge(ctx, p, eu(i), id === "h4" && (has(p, "A") || has(p, "F")) ? ORANGE : INK, id === "h4" && (has(p, "A") || has(p, "F")) ? 8 : 5));
    KEYS.forEach(k => node(ctx, k, 1));
    const TX = 960;
    if (id === "h0") {
      alpha(ctx, P(l, at(b, "sepuluh pasangan"), 0.5), () => text(ctx, "10 pasangan, tarian berantai", TX, 690, 42, { align: "center", weight: 900, color: INK }));
      alpha(ctx, P(l, at(b, "satu penari tetap"), 0.5), () => text(ctx, "satu penari tetap di panggung", TX, 750, 36, { align: "center", weight: 800, color: GREEN }));
      alpha(ctx, P(l, at(b, "tiga kali"), 0.5), () => text(ctx, "tidak boleh 3 kali berturut-turut", TX, 805, 36, { align: "center", weight: 800, color: RED }));
    }
    if (id === "h1") {
      text(ctx, "Siapa yang tidak boleh menari pertama?", TX, 680, 38, { align: "center", weight: 900, color: INK, fit: 960 });
      thinkBadge(ctx, 610, 710, 700, 110, l, b.hold + 2, "");
    }
    if (id === "h2") alpha(ctx, P(l, at(b, "Jadwal yang benar"), 0.5), () => { text(ctx, "jadwal = jalan yang melewati", TX, 700, 40, { align: "center", weight: 900, color: INK }); text(ctx, "setiap garis tepat satu kali", TX, 760, 40, { align: "center", weight: 900, color: GREEN }); });
    if (id === "h3" || id === "h4") {
      const t0 = id === "h3" ? at(b, "Yang ganjil") : -9;
      KEYS.forEach((k, i) => degBadge(ctx, k, id === "h3" ? P(l, at(b, "garis genap") + i * 0.3, 0.4) : 1, DEG[k] % 2));
      ["A", "F"].forEach(k => { const [x, y] = pos(k); ring(ctx, x, y, R + 18, R + 18, P(l, t0, 0.6), RED, 6); });
      if (id === "h3") {
        alpha(ctx, P(l, at(b, "garis genap"), 0.5), () => text(ctx, "tengah jalan: garis genap", TX, 700, 40, { align: "center", weight: 900, color: INK }));
        alpha(ctx, P(l, t0, 0.5), () => text(ctx, "mulai di Ana atau Fani", TX, 765, 44, { align: "center", weight: 900, color: RED }));
      }
    }
    if (id === "h4") {
      const [x, y] = pos("C"), t = at(b, "Cinta tidak pernah");
      ring(ctx, x, y, R + 20, R + 20, P(l, t, 0.6), RED, 6);
      alpha(ctx, P(l, t, 0.5), () => text(ctx, "Cinta tidak bertetangga dengan Ana/Fani", TX, 695, 34, { align: "center", weight: 800, color: INK, fit: 960 }));
      alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: Cinta", TX, 775, 60, { align: "center", weight: 900, color: GREEN }));
    }
  }

  Object.assign(K.SCENES, B.umum(META), { graf, graf_v });
})(typeof window !== "undefined" ? window : globalThis);
