/* B12 Pembahasan Soal Bebras 2020-SK-04 "Terbang ke Mana Saja?" (Slowakia), kategori SiKecil (kelas 1–3 SD).
   Papan tulis: taman 6 × 4 petak, sarang lebah, 11 bunga; jalan lebah langkah demi langkah, lalu petak berjarak
   1, 2, 3 diwarnai seperti gelombang. Jarak dan banyak bunga dihitung ulang di kode; K._warn bila bukan 7.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Terbang ke Mana Saja?", tahun: "2020", negara: "Slowakia", kode: "2020-SK-04", flag: "SK", sumber: "Buku Tantangan Bebras Indonesia 2020", bukaFrasa: "Bebras",
    tingkat: "kelas 1, 2, dan 3 SD (SiKecil)",
    langkah: ["Mulai dari sarang.", "Warnai petak berjarak 1, lalu 2, lalu 3.", "Hitung bunga di petak yang berwarna."],
    cta: "Berapa bunga yang bisa dicapai lebah?", gambarUlang: "Taman, bunga, dan sarang lebah digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const R = 4, CC = 6, HIVE = [1, 3];
  const FL = [[0, 0, "#3D7FC4"], [0, 5, "#E8322E"], [1, 0, "#8E3FD0"], [1, 5, "#3D7FC4"], [2, 0, "#E8322E"], [2, 1, "#E07AC8"], [2, 5, "#E07AC8"], [3, 1, "#3D7FC4"], [3, 2, "#8E3FD0"], [3, 4, "#E07AC8"], [3, 5, "#8E3FD0"]];
  const dist = (r, c) => Math.abs(r - HIVE[0]) + Math.abs(c - HIVE[1]);
  const NEAR = FL.filter(([r, c]) => dist(r, c) <= 3), FAR = FL.filter(([r, c]) => dist(r, c) > 3);
  if (NEAR.length !== 7 || FL.length !== 11 || FAR.some(([r, c]) => dist(r, c) !== 4)) (K._warn = K._warn || []).push("data salah: dekat=" + NEAR.length);

  // ---------- gambar ----------
  let G = { x0: 200, y0: 190, s: 130 };
  const px = c => G.x0 + (c + 0.5) * G.s, py = r => G.y0 + (r + 0.5) * G.s;
  const WAVE = ["", "#FFE7A3", "#FFD873", "#FFC94A"];
  function flower(ctx, x, y, s, col) {
    ctx.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k * Math.PI * 2 / 5 - Math.PI / 2; ctx.beginPath(); ctx.arc(x + Math.cos(a) * s * 0.22, y + Math.sin(a) * s * 0.22, s * 0.17, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#FFE14D"; ctx.beginPath(); ctx.arc(x, y, s * 0.13, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#D9A400"; ctx.lineWidth = 2; ctx.stroke();
  }
  function hive(ctx, x, y, s) {
    ctx.fillStyle = "#F2B134"; ctx.strokeStyle = "#A8720F"; ctx.lineWidth = 3;
    for (let k = 0; k < 4; k++) { const w = s * (0.26 - k * 0.045), yy = y + s * (0.2 - k * 0.13); rr(ctx, x - w, yy - s * 0.07, w * 2, s * 0.14, s * 0.07); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = "#5C3B20"; ctx.beginPath(); ctx.arc(x, y + s * 0.2, s * 0.05, 0, Math.PI * 2); ctx.fill();
  }
  function bee(ctx, x, y, s) {
    ctx.fillStyle = "rgba(200,230,255,0.9)"; ctx.beginPath(); ctx.ellipse(x - s * 0.1, y - s * 0.22, s * 0.16, s * 0.1, -0.5, 0, Math.PI * 2); ctx.ellipse(x + s * 0.1, y - s * 0.22, s * 0.16, s * 0.1, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#F6C945"; ctx.beginPath(); ctx.ellipse(x, y, s * 0.26, s * 0.17, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#3A2A1E"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#3A2A1E"; [-0.08, 0.08].forEach(d => ctx.fillRect(x + d * s - s * 0.03, y - s * 0.16, s * 0.06, s * 0.32));
    ctx.beginPath(); ctx.arc(x + s * 0.22, y - s * 0.03, s * 0.04, 0, Math.PI * 2); ctx.fill();
  }
  // wave(r,c) -> 0..1 untuk warna jarak
  function garden(ctx, o = {}) {
    for (let r = 0; r < R; r++) for (let c = 0; c < CC; c++) {
      const x = G.x0 + c * G.s, y = G.y0 + r * G.s, d = dist(r, c);
      ctx.fillStyle = "#EEF7EA"; ctx.fillRect(x, y, G.s, G.s);
      const w = o.wave ? o.wave(d) : 0;
      if (d > 0 && d <= 3 && w > 0) alpha(ctx, w, () => { ctx.fillStyle = WAVE[d]; ctx.fillRect(x, y, G.s, G.s); text(ctx, String(d), x + 16 * G.s / 130, y + 32 * G.s / 130, 26 * G.s / 130, { weight: 900, color: "#A8720F" }); });
      ctx.strokeStyle = "#B9C9B2"; ctx.lineWidth = 2; ctx.strokeRect(x, y, G.s, G.s);
    }
    hive(ctx, px(HIVE[1]), py(HIVE[0]), G.s);
    FL.forEach(([r, c, col], i) => alpha(ctx, o.fl ? o.fl(i) : 1, () => flower(ctx, px(c), py(r) + 4, G.s, col)));
  }
  function path(ctx, cells, u, col) { mline(ctx, cells.map(([r, c]) => [px(c), py(r)]), u, col, 9 * G.s / 130, true); }
  function along(cells, u) { const n = cells.length - 1, f = clamp(u, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), t = f - i; return [px(cells[i][1]) + (px(cells[i + 1][1]) - px(cells[i][1])) * t, py(cells[i][0]) + (py(cells[i + 1][0]) - py(cells[i][0])) * t]; }
  const W1 = [[1, 3], [1, 4], [1, 5], [0, 5]], W2 = [[1, 3], [0, 3], [0, 4], [0, 5]];
  const ORDER = NEAR.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  function countFlowers(ctx, l, t0, gap = 0.55) {
    ORDER.forEach(([r, c], i) => alpha(ctx, P(l, t0 + i * gap, 0.35), () => {
      tick(ctx, px(c) + G.s * 0.22, py(r) + G.s * 0.22, G.s * 0.36, 1, GREEN);
      const x = px(c) - G.s * 0.3, y = py(r) - G.s * 0.3; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, G.s * 0.16, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), x, y + G.s * 0.07, G.s * 0.2, { align: "center", weight: 900, color: "#fff" });
    }));
  }

  // ---------- adegan utama ----------
  function taman(ctx, b, l) {
    board(ctx);
    G = { x0: 170, y0: 180, s: 146 };
    const id = b.id, RX = 1120, RW = 720;
    const o = {};
    if (id === "soal1") o.fl = i => P(l, at(b, "ada bunga") + i * 0.12, 0.4);
    const W = { p1: [1], p2: [1, 2], p3: [1, 2, 3] }[id];
    if (W) { const t = at(b, { p1: "jaraknya satu", p2: "Petak baru", p3: "Petak baru" }[id]); o.wave = d => d < W.length ? 1 : (d === W.length ? P(l, t, 0.8) : 0); }
    if (["p4", "j1", "j2", "j3"].includes(id)) o.wave = d => 1;
    if (id === "c2") { const t = at(b, "gelombang"); o.wave = d => P(l, t + (d - 1) * 0.7, 0.6); }
    garden(ctx, o);
    if (id === "soal1") alpha(ctx, P(l, at(b, "sarang lebah"), 0.5), () => ring(ctx, px(3), py(1), 70, 70, 1, ORANGE, 6));
    if (id === "soal2") {
      const t = at(b, "satu petak");
      [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dr, dc], k) => mline(ctx, [[px(3) + dc * 50, py(1) + dr * 50], [px(3 + dc), py(1 + dr)]], P(l, t + k * 0.3, 0.5), GREEN, 8, true));
      const tm = at(b, "miring"); mline(ctx, [[px(3) + 40, py(1) + 40], [px(4), py(2)]], P(l, tm, 0.5), "#B0B8BF", 8, true); cross(ctx, px(4) - 20, py(2) - 20, 60, P(l, tm + 0.4, 0.5), RED, 7);
      bee(ctx, px(3) + 40, py(1) - 45, 90);
    }
    if (id === "soal3") alpha(ctx, P(l, 0.3, 0.5), () => { card(ctx, RX + 60, 280, RW - 120, 160, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "paling jauh", RX + RW / 2, 345, 40, { align: "center", weight: 900, color: INK }); text(ctx, "3 petak dari sarang", RX + RW / 2, 405, 44, { align: "center", weight: 900, color: ORANGE }); bee(ctx, RX + RW / 2, 560, 140); });
    if (id === "soal4") {
      card(ctx, RX, 200, RW, 130, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Berapa bunga yang", RX + RW / 2, 255, 40, { align: "center", weight: 900, color: INK }); text(ctx, "bisa dicapai lebah?", RX + RW / 2, 305, 40, { align: "center", weight: 900, color: INK });
      ["5", "6", "7", "8"].forEach((v, i) => alpha(ctx, P(l, at(b, "ABCD"[i] + " " + ["lima", "enam", "tujuh", "delapan"][i]), 0.4), () => { const x = RX + 40 + (i % 2) * 360, y = 450 + Math.floor(i / 2) * 120; letter(ctx, "ABCD"[i], x + 30, y - 20, 32, false); text(ctx, v + " bunga", x + 80, y, 52, { weight: 900, color: INK }); }));
    }
    if (id === "w1" || id === "w2") {
      const t0 = at(b, id === "w1" ? "terbang ke kanan" : "ke atas dulu"), u = clamp((l - t0) / (id === "w1" ? 5 : 3.5), 0, 1);
      if (id === "w2") path(ctx, W1, 1, "rgba(238,122,18,0.35)");
      const Wp = id === "w1" ? W1 : W2, col = id === "w1" ? ORANGE : "#2F6FD0";
      path(ctx, Wp, u, col);
      for (let k = 1; k <= 3; k++) alpha(ctx, u * 3 >= k ? 1 : 0, () => { const [r, c] = Wp[k]; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px(c) + 42, py(r) + 40, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, String(k), px(c) + 42, py(r) + 49, 26, { align: "center", weight: 900, color: "#fff" }); });
      const [bx, by] = along(Wp, u); bee(ctx, bx, by - 30, 80);
      if (id === "w1") ring(ctx, px(5), py(0), 62, 62, P(l, at(b, "bunga merah"), 0.5), RED, 5);
      alpha(ctx, P(l, at(b, id === "w1" ? "jaraknya tiga" : "tetap tiga"), 0.5), () => text(ctx, id === "w1" ? "jarak = 3 petak" : "tetap 3 petak", RX + RW / 2, 330, 56, { align: "center", weight: 900, color: col }));
      if (id === "w2") hand(ctx, "cari jalan terpendek", RX + RW / 2, 440, 46, { color: INK, alpha: P(l, at(b, "Yang penting"), 0.5) });
    }
    if (W) {
      const d = W.length; hand(ctx, "jarak " + d, RX + RW / 2, 300, 72, { color: "#C47F00", alpha: P(l, at(b, { p1: "jaraknya satu", p2: "Petak baru", p3: "Petak baru" }[id]), 0.5) });
      if (id === "p3") hand(ctx, "lebih jauh: tidak kuat", RX + RW / 2, 420, 44, { color: RED, alpha: P(l, at(b, "Lebih jauh"), 0.5) });
      for (let k = 1; k <= 3; k++) alpha(ctx, k <= d ? 1 : 0.25, () => { ctx.fillStyle = WAVE[k]; ctx.fillRect(RX + 140 + (k - 1) * 170, 520, 120, 80); text(ctx, String(k), RX + 200 + (k - 1) * 170, 575, 44, { align: "center", weight: 900, color: "#A8720F" }); });
    }
    if (id === "p4") thinkBadge(ctx, RX, 260, RW, 170, l, b.hold + 2, "Ada berapa bunga di petak berwarna?");
    if (id === "j1" || id === "j3") countFlowers(ctx, l, id === "j1" ? at(b, "Satu,") : -9);
    if (id === "j1") alpha(ctx, P(l, at(b, "Ada tujuh"), 0.5), () => text(ctx, "7 bunga", RX + RW / 2, 380, 90, { align: "center", weight: 900, color: GREEN }));
    if (id === "j2") FAR.forEach(([r, c], i) => { const t = at(b, "berjarak empat") + i * 0.35; alpha(ctx, P(l, t, 0.4), () => text(ctx, "4", px(c) - 40, py(r) - 30, 34, { align: "center", weight: 900, color: RED })); cross(ctx, px(c), py(r) + 4, 70, P(l, t + 0.3, 0.4), RED, 6); });
    if (id === "j2") hand(ctx, "jarak 4: terlalu jauh", RX + RW / 2, 330, 52, { color: RED, alpha: P(l, at(b, "berjarak empat"), 0.5) });
    if (id === "j3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, RX + 100, 280, RW - 200, 160, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: C. 7", RX + RW / 2, 380, 62, { align: "center", weight: 900, color: GREEN }); });
    if (id === "c2") alpha(ctx, P(l, at(b, "aplikasi peta"), 0.5), () => {
      const x = RX + RW / 2 - 170, y = 300; card(ctx, x, y, 340, 240, { fill: "#EAF4E6", stroke: INK, lw: 4, r: 20 });
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 16; [[x + 20, y + 80, x + 320, y + 80], [x + 120, y + 20, x + 120, y + 220], [x + 20, y + 170, x + 320, y + 170], [x + 250, y + 20, x + 250, y + 220]].forEach(([a, b2, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b2); ctx.lineTo(c2, d); ctx.stroke(); });
      ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x + 120, y + 125, 16, 0, Math.PI * 2); ctx.fill();
      [60, 100, 140].forEach((rad, k) => alpha(ctx, P(l, at(b, "aplikasi peta") + 0.4 + k * 0.4, 0.4) * 0.6, () => { ctx.strokeStyle = "#2F6FD0"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + 120, y + 125, rad, 0, Math.PI * 2); ctx.stroke(); }));
      text(ctx, "tempat terdekat", RX + RW / 2, y + 300, 38, { align: "center", weight: 900, color: INK });
    });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function taman_v(ctx, b, l) {
    board(ctx);
    G = { x0: 600, y0: 175, s: 120 };
    const id = b.id, TX = 960, o = {};
    if (id === "h2") { const t = at(b, "berjarak satu"); o.wave = d => P(l, t + (d - 1) * 1.2, 0.6); }
    if (id === "h3") o.wave = () => 1;
    garden(ctx, o);
    if (id === "h0") {
      const t = at(b, "satu petak");
      [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dr, dc], k) => mline(ctx, [[px(3) + dc * 46, py(1) + dr * 46], [px(3 + dc), py(1 + dr)]], P(l, t + k * 0.3, 0.5), GREEN, 7, true));
      alpha(ctx, P(l, at(b, "paling jauh"), 0.5), () => text(ctx, "paling jauh 3 petak", TX, 720, 48, { align: "center", weight: 900, color: ORANGE }));
    }
    if (id === "h1") thinkBadge(ctx, 610, 690, 700, 110, l, b.hold + 2, "");
    if (id === "h2") alpha(ctx, P(l, at(b, "berjarak satu"), 0.5), () => text(ctx, "jarak 1, 2, 3", TX, 730, 52, { align: "center", weight: 900, color: "#C47F00" }));
    if (id === "h3") { countFlowers(ctx, l, at(b, "hitung bunga") + 0.6, 0.4); alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: 7 bunga", TX, 735, 56, { align: "center", weight: 900, color: GREEN })); }
  }

  Object.assign(K.SCENES, B.umum(META), { taman, taman_v });
})(typeof window !== "undefined" ? window : globalThis);
