/* B11 Pembahasan Soal Bebras 2020-CH-04 "Pohon Sudoku" (Swiss), kategori SiKecil (kelas 1–3 SD).
   Papan tulis: empat petak ladang dengan pohon setinggi 1–4, papan di kedua ujung, garis pandang dari berang-berang,
   pohon tersembunyi menjadi pucat. Banyak pohon terlihat dihitung ulang di kode; K._warn bila berbeda.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, cross, ring, hand, alpha, thinkBadge, letter, beaver } = B;
  const META = { judul: "Pohon Sudoku", tahun: "2020", negara: "Swiss", kode: "2020-CH-04", flag: "CH", sumber: "Buku Tantangan Bebras Indonesia 2020", bukaFrasa: "Bebras",
    tingkat: "kelas 1, 2, dan 3 SD (SiKecil)",
    langkah: ["Berdirilah di papan, lihat pohon satu per satu.", "Ingat pohon paling tinggi yang sudah kamu lihat.", "Hitung pohon yang lebih tinggi dari pohon itu."],
    cta: "Berapa pohon yang terlihat?", gambarUlang: "Pohon, papan, dan berang-berang digambar ulang untuk video ini." };

  // ---------- data ----------
  const EX = [3, 1, 4, 2], Q = [1, 3, 4, 2];
  const NAMA = { 1: "kecil", 2: "sedang", 3: "besar", 4: "paling besar" };
  function seen(row, fromLeft) {   // indeks pohon terlihat, urut dari papan
    const idx = fromLeft ? [0, 1, 2, 3] : [3, 2, 1, 0]; let mx = 0; const out = [];
    idx.forEach(i => { if (row[i] > mx) { out.push(i); mx = row[i]; } });
    return out;
  }
  if (seen(EX, true).length !== 2 || seen(EX, false).length !== 2 || seen(Q, true).length !== 3 || seen(Q, false).length !== 2)
    (K._warn = K._warn || []).push("data salah: " + seen(Q, true) + " / " + seen(Q, false));

  // ---------- gambar ----------
  let L = { x0: 420, cw: 270, gy: 700, sc: 1, ax: 300, bx: 1620 };
  const cx = i => L.x0 + L.cw * (i + 0.5);
  const th = s => (110 + s * 95) * L.sc;
  function tree(ctx, x, s, a = 1, faded = false) {
    alpha(ctx, a, () => {
      const h = th(s), w = (90 + s * 30) * L.sc, y0 = L.gy;
      ctx.fillStyle = faded ? "#C9BBAA" : "#6B4A2B"; ctx.fillRect(x - w * 0.07, y0 - h * 0.16, w * 0.14, h * 0.16);
      const cols = faded ? ["#D5DDD2", "#C8D2C4", "#BCC7B7"] : ["#2E7D32", "#3F9142", "#5BAE4E"];
      for (let k = 0; k < 3; k++) {
        const yb = y0 - h * (0.12 + k * 0.27), yt = yb - h * 0.42, ww = w * (1 - k * 0.22) / 2;
        ctx.fillStyle = cols[k]; ctx.beginPath(); ctx.moveTo(x - ww, yb); ctx.lineTo(x, yt); ctx.lineTo(x + ww, yb); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = faded ? "#C0C8BC" : "#1F5E23"; ctx.lineWidth = 2; ctx.stroke();
      }
    });
  }
  function field(ctx) {
    ctx.fillStyle = "#E8D9A8"; rr(ctx, L.x0 - 330 * L.sc, L.gy - 8, L.cw * 4 + 660 * L.sc, 70 * L.sc + 8, 30); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.fillStyle = "#A0603A"; ctx.fillRect(L.x0 + i * L.cw + 3, L.gy - 4, L.cw - 6, 56 * L.sc); }
  }
  function sign(ctx, x, label, col) {
    const w = 90 * L.sc, h = 64 * L.sc, y = L.gy - 120 * L.sc;
    ctx.fillStyle = "#7A5230"; ctx.fillRect(x - 5 * L.sc, y, 10 * L.sc, 120 * L.sc);
    ctx.fillStyle = "#A9744A"; rr(ctx, x - w / 2, y - h / 2, w, h, 8); ctx.fill(); ctx.strokeStyle = "#5C3B20"; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, label, x, y + h * 0.28, 44 * L.sc, { align: "center", weight: 900, color: col || "#FFF3C4" });
  }
  function bubble(ctx, i, s, n, a, col = GREEN) {
    alpha(ctx, a, () => { const x = cx(i), y = L.gy - th(s) - 44 * L.sc; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 30 * L.sc, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x, y + 12 * L.sc, 36 * L.sc, { align: "center", weight: 900, color: "#fff" }); });
  }
  const eye = left => [left ? L.ax - 120 * L.sc : L.bx + 120 * L.sc, L.gy - 110 * L.sc];
  function sight(ctx, left, i, s, u, col) {
    const [ex, ey] = eye(left), x = cx(i), y = L.gy - th(s) + 10;
    ctx.save(); ctx.setLineDash([12, 10]); mline(ctx, [[ex, ey], [x, y]], u, col, 5 * L.sc, true); ctx.restore();
  }
  function scene(ctx, row, o = {}) {
    field(ctx);
    if (o.beavers !== false) { if (o.bl !== 0) alpha(ctx, o.bl == null ? 1 : o.bl, () => beaver(ctx, L.ax - 130 * L.sc, L.gy - 60 * L.sc, 120 * L.sc)); if (o.br !== 0) alpha(ctx, o.br == null ? 1 : o.br, () => beaver(ctx, L.bx + 130 * L.sc, L.gy - 60 * L.sc, 120 * L.sc, { flip: true, shirt: "#E07AA0" })); }
    row.forEach((s, i) => tree(ctx, cx(i), s, o.grow ? o.grow(i) : 1, o.faded ? o.faded(i) : false));
    if (o.sa != null) sign(ctx, L.ax, o.sa, o.saCol); if (o.sb != null) sign(ctx, L.bx, o.sb, o.sbCol);
    if (o.labels) row.forEach((s, i) => alpha(ctx, o.labels(i), () => text(ctx, NAMA[s], cx(i), L.gy + 42 * L.sc, 30 * L.sc, { align: "center", weight: 900, color: "#FFF3C4" })));
  }
  // jalan pandang bertahap: steps = [[beatId, phrase]] satu per pohon dari papan
  function walk(ctx, b, l, left, steps, row = Q) {
    const order = left ? [0, 1, 2, 3] : [3, 2, 1, 0];
    let mx = 0, cnt = 0;
    order.forEach((i, k) => {
      const t = steps[k]; if (t == null || l < t) return;
      const s = row[i], vis = s > mx;
      if (vis) { cnt++; mx = s; sight(ctx, left, i, s, P(l, t, 0.6), left ? ORANGE : "#8E44AD"); bubble(ctx, i, s, cnt, P(l, t + 0.6, 0.4), left ? ORANGE : "#8E44AD"); }
      else { cross(ctx, cx(i), L.gy - th(s) / 2, 60 * L.sc, P(l, t + 0.3, 0.5), RED, 7); }
    });
    return { mx, cnt };
  }

  // ---------- adegan utama ----------
  function kebun(ctx, b, l) {
    board(ctx);
    L = { x0: 420, cw: 270, gy: 700, sc: 1, ax: 300, bx: 1620 };
    const id = b.id;
    if (id === "c2") return scan(ctx, b, l);
    if (["soal1", "soal2", "soal3"].includes(id)) {
      const o = { beavers: id !== "soal1" };
      if (id === "soal1") { const ph = ["pohon kecil", "pohon sedang", "pohon besar", "pohon paling besar"]; o.grow = i => P(l, at(b, ph[EX[i] - 1]), 0.6); o.labels = o.grow; }
      else o.labels = () => 1;
      if (id === "soal2") { const t = at(b, "tersembunyi"); o.faded = i => l > t && !seen(EX, true).includes(i); o.br = 0; }
      if (id === "soal3") { o.sa = l > at(b, "dari kiri") ? "2" : ""; o.sb = l > at(b, "dari kanan") ? "2" : ""; if (l < at(b, "Contohnya")) { o.sa = ""; o.sb = ""; } }
      scene(ctx, EX, o);
      if (id === "soal2") { const t = at(b, "melihat ke arah"); seen(EX, true).forEach((i, k) => sight(ctx, true, i, EX[i], P(l, t + k * 0.5, 0.6), ORANGE)); hand(ctx, "tersembunyi", cx(1), L.gy - th(4) - 40, 46, { color: RED, alpha: P(l, at(b, "tersembunyi"), 0.5) }); }
      if (id === "soal3") {
        seen(EX, true).forEach((i, k) => sight(ctx, true, i, EX[i], P(l, at(b, "dari kiri") + k * 0.4, 0.5), ORANGE));
        seen(EX, false).forEach((i, k) => sight(ctx, false, i, EX[i], P(l, at(b, "dari kanan") + k * 0.4, 0.5), "#8E44AD"));
        hand(ctx, "papan = banyak pohon yang terlihat", 960, 210, 44, { color: INK, alpha: P(l, at(b, "menulis"), 0.5) });
      }
      return;
    }
    // baris soal
    const o = { labels: () => 1, sa: "A", sb: "B" };
    const A_DONE = ["b0", "b1", "b2", "b3", "j1"].includes(id);
    if (["soal4", "soal5"].includes(id)) { o.sa = id === "soal5" || l > at(b, "angka berapa") ? "?" : "A"; o.sb = o.sa === "?" ? "?" : "B"; }
    if (["a1", "a2", "a3"].includes(id)) { o.sa = "A"; o.sb = "B"; o.br = 0.3; }
    if (id === "a4") { o.sa = l > at(b, "Jadi, angka") ? "3" : "A"; o.br = 0.3; o.faded = i => i === 3 && l > at(b, "tersembunyi"); }
    if (A_DONE) { o.sa = "3"; o.saCol = "#FFE08A"; o.sb = id === "b3" && l > at(b, "Jadi, angka") || id === "j1" ? "2" : "?"; o.bl = 0.3; }
    if (id === "b3") o.faded = i => (i === 0 || i === 1) && l > at(b, "tersembunyi");
    scene(ctx, Q, o);
    if (id === "soal4") { ring(ctx, L.ax, L.gy - 120, 70, 50, P(l, at(b, "papan A"), 0.5), ORANGE, 5); ring(ctx, L.bx, L.gy - 120, 70, 50, P(l, at(b, "papan B"), 0.5), ORANGE, 5); }
    if (id === "soal5") {
      const opts = ["A = 2, B = 3", "A = 3, B = 2", "A = 2, B = 4", "A = 4, B = 1"];
      opts.forEach((s, i) => alpha(ctx, P(l, at(b, ["A, papan", "B, papan", "C, papan", "D, papan"][i]), 0.4), () => { const x = 140 + i * 430, y = 220; letter(ctx, "ABCD"[i], x + 30, y - 14, 30, false); text(ctx, s, x + 74, y, 40, { weight: 900, color: INK }); }));
    }
    // langkah dari A
    const SA = { a1: ["a1"], a2: ["a1", "a2"], a3: ["a1", "a2", "a3"], a4: ["a1", "a2", "a3", "a4"] };
    const PH_A = { a1: "jadi pohon kecil terlihat", a2: "jadi pohon besar terlihat", a3: "jadi terlihat juga", a4: "jadi tidak terlihat" };
    if (SA[id]) {
      const steps = SA[id].map(bid => bid === id ? at(b, PH_A[bid]) - 0.8 : -1);
      const r = walk(ctx, b, l, true, steps);
      if (id === "a1") hand(ctx, "lihat ke kanan →", 700, 210, 48, { color: ORANGE, alpha: P(l, at(b, "melihat ke kanan"), 0.5) });
      if (r.mx) alpha(ctx, 1, () => { card(ctx, 1240, 170, 560, 110, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 18 }); text(ctx, "paling tinggi sejauh ini:", 1520, 215, 30, { align: "center", weight: 800, color: INK }); text(ctx, "pohon " + NAMA[r.mx], 1520, 262, 38, { align: "center", weight: 900, color: ORANGE }); });
      if (id === "a4") ring(ctx, L.ax, L.gy - 120, 70, 50, P(l, at(b, "Jadi, angka"), 0.5), GREEN, 6);
    }
    if (A_DONE && id !== "j1") {
      // jejak dari A tetap tipis
      alpha(ctx, 0.25, () => seen(Q, true).forEach(i => sight(ctx, true, i, Q[i], 1, ORANGE)));
    }
    if (id === "b0") { thinkBadge(ctx, 1080, 170, 740, 150, l, b.hold + 2, "Berapa pohon terlihat dari B?"); ring(ctx, L.bx, L.gy - 120, 70, 50, P(l, 0.3, 0.5), "#8E44AD", 5); }
    const SB = { b1: ["b1"], b2: ["b1", "b2"], b3: ["b1", "b2", "b3", "b3"] };
    if (SB[id]) {
      let steps;
      if (id === "b1") steps = [at(b, "Pohon sedang terlihat") - 0.6];
      else if (id === "b2") steps = [-1, at(b, "jadi terlihat") - 0.8];
      else { const t = at(b, "tersembunyi"); steps = [-1, -1, t, t + 0.5]; }
      const r = walk(ctx, b, l, false, steps);
      if (id === "b1") hand(ctx, "← lihat ke kiri", 1220, 210, 48, { color: "#8E44AD", alpha: P(l, at(b, "melihat ke kiri"), 0.5) });
      if (r.mx && id !== "b1") alpha(ctx, 1, () => { card(ctx, 120, 170, 560, 110, { fill: "#F6EEFA", stroke: "#8E44AD", lw: 4, r: 18 }); text(ctx, "paling tinggi sejauh ini:", 400, 215, 30, { align: "center", weight: 800, color: INK }); text(ctx, "pohon " + NAMA[r.mx], 400, 262, 38, { align: "center", weight: 900, color: "#8E44AD" }); });
      if (id === "b3") ring(ctx, L.bx, L.gy - 120, 70, 50, P(l, at(b, "Jadi, angka"), 0.5), GREEN, 6);
    }
    if (id === "j1") {
      seen(Q, true).forEach(i => sight(ctx, true, i, Q[i], 1, ORANGE)); seen(Q, false).forEach(i => sight(ctx, false, i, Q[i], 1, "#8E44AD"));
      alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => { card(ctx, 1180, 160, 640, 120, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: B (A = 3, B = 2)", 1500, 238, 44, { align: "center", weight: 900, color: GREEN, fit: 600 }); });
    }
  }
  // c2: memeriksa data satu per satu sambil mengingat nilai terbesar
  function scan(ctx, b, l) {
    const D = [2, 5, 3, 7, 4], t0 = at(b, "memeriksa data"), k = Math.floor(clamp((l - t0) / 1.2, 0, D.length - 0.001));
    let mx = 0; for (let i = 0; i <= k; i++) mx = Math.max(mx, D[i]);
    D.forEach((v, i) => {
      const x = 560 + i * 160, y = 420, on = l > t0 + i * 1.2;
      card(ctx, x - 60, y - 60, 120, 120, { fill: on && v === mx && i <= k ? "#FFF0D6" : "#F7F9FA", stroke: i === k && l > t0 ? ORANGE : INK, lw: i === k && l > t0 ? 6 : 3, r: 16 });
      text(ctx, String(v), x, y + 22, 64, { align: "center", weight: 900, color: INK });
    });
    if (l > t0) mline(ctx, [[560 + k * 160, 300], [560 + k * 160, 352]], 1, ORANGE, 7, true);
    alpha(ctx, P(l, at(b, "sambil mengingat"), 0.5), () => { card(ctx, 760, 540, 400, 130, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 20 }); text(ctx, "terbesar sejauh ini", 960, 590, 30, { align: "center", weight: 800, color: INK }); text(ctx, String(mx), 960, 650, 56, { align: "center", weight: 900, color: GREEN }); });
    hand(ctx, "periksa satu per satu", 960, 230, 50, { color: ORANGE, alpha: P(l, t0, 0.5) });
  }

  // ---------- pemanasan: barisan anak ----------
  function kid(ctx, x, gy, h, col, a = 1, hidden = false) {
    alpha(ctx, a, () => {
      ctx.fillStyle = hidden ? "#D5DBE0" : col; rr(ctx, x - 36, gy - h + 60, 72, h - 60, 24); ctx.fill();
      ctx.fillStyle = hidden ? "#E3E7EB" : "#F2C9A0"; ctx.beginPath(); ctx.arc(x, gy - h + 34, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = hidden ? "#C5CCD2" : "#3A2A1E"; ctx.beginPath(); ctx.arc(x, gy - h + 26, 34, Math.PI, 0); ctx.fill();
    });
  }
  function barisan(ctx, b, l) {
    board(ctx);
    const gy = 760, eyeX = 240, eyeY = 520, KIDS = b.id === "w1" ? [[560, 300], [760, 230], [960, 260]] : [[560, 300], [760, 230], [960, 260], [1180, 380]];
    ctx.fillStyle = "#C9D3DA"; ctx.fillRect(140, gy, 1500, 10);
    // mata pengamat
    ctx.fillStyle = "#fff"; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(eyeX, eyeY, 50, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(eyeX + 14, eyeY, 14, 0, Math.PI * 2); ctx.fill();
    text(ctx, "dari depan", eyeX, eyeY + 80, 30, { align: "center", weight: 800, color: C.ink2 });
    let mx = 0;
    const tH = b.id === "w1" ? at(b, "tertutup") : 0;
    KIDS.forEach(([x, h], i) => {
      const vis = h > mx; mx = Math.max(mx, h);
      const hid = !vis && l > tH;
      kid(ctx, x, gy, h, ["#4F8FD8", "#E07AA0", "#F2B134", "#6BB36B"][i], b.id === "w2" && i === 3 ? P(l, 0.4, 0.6) : 1, hid);
      if (vis && (b.id === "w2" || l > at(b, "berbaris"))) { ctx.save(); ctx.setLineDash([10, 8]); mline(ctx, [[eyeX + 50, eyeY], [x, gy - h + 20]], b.id === "w2" && i === 3 ? P(l, at(b, "tetap terlihat"), 0.6) : 1, GREEN, 4, true); ctx.restore(); }
    });
    if (b.id === "w1") { hand(ctx, "tertutup", 760, gy - 400, 48, { color: RED, alpha: P(l, tH, 0.5) }); hand(ctx, "lebih pendek", 960, gy - 330, 38, { color: RED, alpha: P(l, tH, 0.5) }); }
    if (b.id === "w2") alpha(ctx, P(l, at(b, "Jadi, seseorang"), 0.5), () => { card(ctx, 1260, 170, 560, 170, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "terlihat kalau lebih tinggi", 1540, 240, 36, { align: "center", weight: 900, color: INK, fit: 520 }); text(ctx, "dari semua di depannya", 1540, 300, 36, { align: "center", weight: 900, color: ORANGE, fit: 520 }); });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function kebun_v(ctx, b, l) {
    board(ctx);
    L = { x0: 600, cw: 180, gy: 600, sc: 0.8, ax: 548, bx: 1372 };
    const id = b.id, TX = 960;
    const o = { beavers: false, labels: () => 1, sa: "A", sb: "B" };
    if (id === "h1") { o.sa = "?"; o.sb = "?"; }
    if (id === "h2") o.sa = l > at(b, "Jadi, papan A") ? "3" : "A";
    if (id === "h3") { o.sa = "3"; o.sb = l > at(b, "Jadi, papan B") ? "2" : "B"; }
    scene(ctx, Q, o);
    if (id === "h0") alpha(ctx, P(l, at(b, "tersembunyi"), 0.5), () => text(ctx, "pendek tersembunyi di balik yang tinggi", TX, 720, 34, { align: "center", weight: 900, color: INK, fit: 960 }));
    if (id === "h1") thinkBadge(ctx, 610, 690, 700, 110, l, b.hold + 2, "");
    if (id === "h2") { const t = at(b, "terlihat pohon kecil"); walk(ctx, b, l, true, [t, t + 1.2, t + 2.4, t + 3.6]); alpha(ctx, P(l, at(b, "Jadi, papan A"), 0.5), () => text(ctx, "papan A = 3", TX, 740, 56, { align: "center", weight: 900, color: ORANGE })); }
    if (id === "h3") {
      alpha(ctx, 0.3, () => seen(Q, true).forEach(i => sight(ctx, true, i, Q[i], 1, ORANGE)));
      const t = at(b, "terlihat pohon sedang"); walk(ctx, b, l, false, [t, t + 1.4, t + 2.4, t + 2.8]);
      alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => text(ctx, "Jawaban: B (A = 3, B = 2)", TX, 740, 50, { align: "center", weight: 900, color: GREEN, fit: 960 }));
    }
  }

  Object.assign(K.SCENES, B.umum(META), { kebun, barisan, kebun_v });
})(typeof window !== "undefined" ? window : globalThis);
