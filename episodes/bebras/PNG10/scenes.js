/* PNG10 Pembahasan Soal Bebras 2017-CA-12 "Robot Pengumpul Permen" (Kanada), kategori Penggalang (SMP).
   Papan tulis: lantai 5 × 5 petak berisi permen, robot dari S (kiri bawah) ke F (kanan atas) hanya ke kanan/atas,
   jalan contoh dengan penghitung, lalu tabel nilai terbaik (dynamic programming) yang diisi kolom demi kolom.
   Tabel, jumlah jalan (70), dan jalan terbaik dihitung ulang di kode; K._warn bila berbeda. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Robot Pengumpul Permen", tahun: "2017", negara: "Kanada", kode: "2017-CA-12", flag: "CA", sumber: "Buku Tantangan Bebras Indonesia 2017", bukaFrasa: "Bebras",
    tingkat: "kelas 7, 8, dan 9 SMP (Penggalang)",
    langkah: ["Pahami gerakan yang boleh dilakukan robot.", "Isi tabel nilai terbaik petak demi petak, mulai dari dekat S.", "Baca jawabannya di F, lalu telusuri jalannya mundur."],
    cta: "Berapa permen paling banyak?", gambarUlang: "Lantai, permen, dan robot digambar ulang untuk video ini." };

  // ---------- data soal (baris 0 = atas) ----------
  const G = [[2, 0, 1, 1, 0], [1, 2, 0, 2, 3], [2, 2, 0, 2, 1], [3, 1, 0, 2, 0], [0, 0, 1, 3, 0]];
  const V = G.map(r => r.slice());
  for (let r = 4; r >= 0; r--) for (let c = 0; c < 5; c++) { const cs = []; if (r < 4) cs.push(V[r + 1][c]); if (c > 0) cs.push(V[r][c - 1]); V[r][c] = G[r][c] + (cs.length ? Math.max(...cs) : 0); }
  let NP = 0; (function cnt(r, c) { if (r === 0 && c === 4) { NP++; return; } if (r > 0) cnt(r - 1, c); if (c < 4) cnt(r, c + 1); })(4, 0);
  const walk = s => { let r = 4, c = 0, sum = 0; const pts = [[r, c]]; for (const m of s) { if (m === "U") r--; else c++; sum += G[r][c]; pts.push([r, c]); } return { pts, sum }; };
  const P10 = walk("UUUURRRR"), P13 = walk("RRRUUURU"), PBEST = walk("UURURRRU");
  if (V[0][4] !== 14 || NP !== 70 || P10.sum !== 10 || P13.sum !== 13 || PBEST.sum !== 14) (K._warn = K._warn || []).push("data salah: F=" + V[0][4] + " jalan=" + NP + " " + P10.sum + "/" + P13.sum + "/" + PBEST.sum);
  const OPTS = ["10", "12", "14", "16", "13"];

  // ---------- gambar ----------
  let X0 = 170, Y0 = 160, S = 118;
  const cx = c => X0 + c * S + S / 2, cy = r => Y0 + r * S + S / 2;
  const CANDY = ["#E0473B", "#2F86D8", "#2FA34D"];
  function candy(ctx, x, y, s, col, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.42, s * 0.24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.38, 0); ctx.lineTo(-s * 0.7, -s * 0.22); ctx.lineTo(-s * 0.7, s * 0.22); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s * 0.38, 0); ctx.lineTo(s * 0.7, -s * 0.22); ctx.lineTo(s * 0.7, s * 0.22); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = s * 0.07; for (const k of [-0.15, 0.1]) { ctx.beginPath(); ctx.moveTo(k * s, -s * 0.22); ctx.lineTo(k * s + s * 0.1, s * 0.22); ctx.stroke(); }
    ctx.restore();
  }
  function cellCandies(ctx, r, c, opt = {}) {
    const n = G[r][c], x = cx(c), y = cy(r) - (opt.small ? S * 0.12 : 0), s = S * (opt.small ? 0.36 : 0.44);
    const pos = n === 1 ? [[0, 0]] : n === 2 ? [[-0.16, -0.12], [0.16, 0.12]] : [[-0.18, -0.16], [0.18, -0.08], [-0.02, 0.18]];
    if (n > 0) pos.forEach(([dx, dy], i) => candy(ctx, x + dx * S, y + dy * S, s, CANDY[i], -0.5 + i * 0.6));
  }
  function grid(ctx, opt = {}) {
    ctx.fillStyle = "#FFF6E8"; rr(ctx, X0 - 8, Y0 - 8, 5 * S + 16, 5 * S + 16, 18); ctx.fill();
    ctx.strokeStyle = "#F0A040"; ctx.lineWidth = 5; rr(ctx, X0 - 8, Y0 - 8, 5 * S + 16, 5 * S + 16, 18); ctx.stroke();
    ctx.lineWidth = 3; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(X0 + i * S, Y0); ctx.lineTo(X0 + i * S, Y0 + 5 * S); ctx.moveTo(X0, Y0 + i * S); ctx.lineTo(X0 + 5 * S, Y0 + i * S); ctx.stroke(); }
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const h = opt.hl ? opt.hl(r, c) : 0; if (h > 0) { ctx.fillStyle = `rgba(242,177,52,${0.45 * h})`; ctx.fillRect(X0 + c * S + 3, Y0 + r * S + 3, S - 6, S - 6); }
      if (r === 4 && c === 0) { ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(cx(0), cy(4) - (opt.vals ? 18 : 0), S * 0.22, 0, Math.PI * 2); ctx.fill(); text(ctx, "S", cx(0), cy(4) - (opt.vals ? 18 : 0) + 12, 34, { align: "center", weight: 900, color: "#fff" }); }
      else if (r === 0 && c === 4) { flag(ctx, cx(4), cy(0) - (opt.vals ? 10 : 0), S * 0.5); }
      else cellCandies(ctx, r, c, { small: !!opt.vals });
      if (opt.nums) alpha(ctx, opt.nums, () => text(ctx, String(G[r][c]), X0 + c * S + 12, Y0 + r * S + 30, 24, { weight: 900, color: "#8A6A3C" }));
    }
  }
  function flag(ctx, x, y, w) {
    const h = w * 0.62, n = 6;
    for (let i = 0; i < n; i++) for (let j = 0; j < 4; j++) { ctx.fillStyle = (i + j) % 2 ? "#222" : "#fff"; ctx.fillRect(x - w / 2 + i * w / n, y - h / 2 + j * h / 4, w / n + 0.5, h / 4 + 0.5); }
    ctx.strokeStyle = "#222"; ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    text(ctx, "F", x, y + h * 0.95, 30, { align: "center", weight: 900, color: INK });
  }
  // nilai tabel: a(r,c) 0..1
  function values(ctx, a, ring14) {
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const v = a(r, c); if (v <= 0) continue;
      alpha(ctx, v, () => {
        const x = X0 + c * S + S - 30, y = Y0 + r * S + S - 28;
        ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(V[r][c]), x, y + 10, V[r][c] > 9 ? 26 : 30, { align: "center", weight: 900, color: "#fff" });
      });
    }
    if (ring14) ring(ctx, X0 + 4 * S + S - 30, Y0 + S - 28, 40, 40, ring14, GREEN, 6);
  }
  function path(ctx, pts, u, col, w = 12) {
    const L = pts.map(([r, c]) => [cx(c), cy(r)]);
    mline(ctx, L, u, col, w, true);
  }
  function robot(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
    ctx.fillStyle = "#2B7A99"; rr(ctx, -34, -30, 68, 56, 12); ctx.fill();
    ctx.fillStyle = "#BFE6F2"; rr(ctx, -24, -20, 48, 24, 8); ctx.fill();
    ctx.fillStyle = "#1F2A33"; ctx.beginPath(); ctx.arc(-10, -8, 5, 0, Math.PI * 2); ctx.arc(10, -8, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5C6670"; ctx.beginPath(); ctx.arc(-20, 32, 9, 0, Math.PI * 2); ctx.arc(20, 32, 9, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // posisi sepanjang jalan (u: 0..1)
  function along(pts, u) {
    const n = pts.length - 1, f = clamp(u, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), t = f - i;
    return [cx(pts[i][1]) + (cx(pts[i + 1][1]) - cx(pts[i][1])) * t, cy(pts[i][0]) + (cy(pts[i + 1][0]) - cy(pts[i][0])) * t, i + (t > 0.5 ? 1 : 0)];
  }
  function sumAt(pts, k) { let s = 0; for (let i = 1; i <= k && i < pts.length; i++) s += G[pts[i][0]][pts[i][1]]; return s; }
  function optionsCol(ctx, x, y, marks = {}) {
    OPTS.forEach((o, i) => {
      const yy = y + i * 66;
      letter(ctx, "ABCDE"[i], x + 26, yy - 14, 26, false);
      text(ctx, o + " permen", x + 68, yy, 40, { weight: 900, color: INK });
      const m = marks[i]; if (!m) return;
      if (m.k === "x") mline(ctx, [[x - 6, yy - 14], [x + 260, yy - 14]], m.u, RED, 5);
      if (m.k === "ok") ring(ctx, x + 130, yy - 14, 150, 36, m.u, GREEN, 5);
    });
  }

  // urutan pengisian tabel: [beat, sel, frasa/waktu]
  const FILL = {
    t3: () => [], t4: [[3, 1]], t5: [[2, 1]],
    t7: [[1, 1], [0, 1], [3, 2], [2, 2], [1, 2], [0, 2]],
    t8: [[3, 3], [2, 3], [1, 3], [0, 3], [3, 4], [2, 4], [1, 4], [0, 4]],
  };
  const DPB = ["t3", "t4", "t5", "t6", "t7", "t8", "j1", "j2", "j3", "c2", "c3"];
  function valA(b, l) {
    const id = b.id, k = DPB.indexOf(id); if (k < 0) return () => 0;
    const shown = {};
    const mark = (r, c, v) => { shown[r + "," + c] = Math.max(shown[r + "," + c] || 0, v); };
    // baris bawah dan kolom kiri (t3)
    const base = [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]], left = [[3, 0], [2, 0], [1, 0], [0, 0]];
    if (id === "t3") {
      const tb = at(b, "Nilainya nol"), tl = at(b, "Nilainya tiga");
      base.forEach(([r, c], i) => mark(r, c, P(l, tb + 0.3 + i * 0.55, 0.3)));
      left.forEach(([r, c], i) => mark(r, c, P(l, tl + 0.3 + i * 0.55, 0.3)));
    } else [...base, ...left].forEach(([r, c]) => mark(r, c, 1));
    const later = id => k > DPB.indexOf(id);
    if (later("t4") || id !== "t4" && k > 1) mark(3, 1, 1);
    if (id === "t4") mark(3, 1, P(l, at(b, "yaitu empat"), 0.4));
    if (later("t5")) mark(2, 1, 1);
    if (id === "t5") mark(2, 1, P(l, at(b, "yaitu tujuh"), 0.4));
    if (later("t7")) FILL.t7.forEach(([r, c]) => mark(r, c, 1));
    if (id === "t7") { const a = at(b, "Kolom kedua") + 3.2, bb = at(b, "Kolom ketiga") + 1.6; FILL.t7.forEach(([r, c], i) => mark(r, c, P(l, i < 2 ? a + i * 0.6 : bb + (i - 2) * 0.6, 0.3))); }
    if (later("t8")) FILL.t8.forEach(([r, c]) => mark(r, c, 1));
    if (id === "t8") { const a = at(b, "Kolom keempat") + 1.6, bb = at(b, "Kolom terakhir") + 1.6; FILL.t8.forEach(([r, c], i) => mark(r, c, P(l, i < 4 ? a + i * 0.6 : bb + (i - 4) * 0.6, 0.3))); }
    return (r, c) => shown[r + "," + c] || 0;
  }

  // ---------- adegan utama ----------
  function lantai(ctx, b, l) {
    board(ctx);
    X0 = 170; Y0 = 160; S = 118;
    const id = b.id, va = valA(b, l), dp = DPB.includes(id) || ["t1", "t2"].includes(id);
    let hl = null;
    if (id === "t4") hl = (r, c) => (r === 3 && c === 1) ? 1 : 0;
    if (id === "t5") hl = (r, c) => (r === 2 && c === 1) ? 1 : 0;
    if (id === "t2") hl = (r, c) => (r === 2 && c === 2) ? 1 : 0;
    const appear = id === "soal1" ? P(l, at(b, "petak-petak"), 0.8) : 1;
    alpha(ctx, appear, () => grid(ctx, { vals: dp, hl, nums: id === "soal1" ? P(l, at(b, "nol, satu"), 0.5) : (["soal3", "m2", "t2", "t4", "t5"].includes(id) ? 1 : 0) }));
    values(ctx, va, id === "t8" ? P(l, at(b, "Jadi, nilai"), 0.6) : (["j1", "j2", "c3"].includes(id) ? 1 : 0));
    if (id === "t1") { for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) alpha(ctx, P(l, at(b, "Kita tulis") + (r + c) * 0.08, 0.3), () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(X0 + c * S + S - 30, Y0 + r * S + S - 28, 22, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); }); }
    const RX = 860;   // panel kanan
    // soal2: S, F, arah
    if (id === "soal2") {
      ring(ctx, cx(0), cy(4), 52, 52, P(l, at(b, "petak S"), 0.5), ORANGE, 6);
      ring(ctx, cx(4), cy(0), 56, 56, P(l, at(b, "petak F"), 0.5), ORANGE, 6);
      alpha(ctx, P(l, at(b, "Setiap kali"), 0.5), () => {
        const x = 1250, y = 450;
        robot(ctx, x, y, 110);
        mline(ctx, [[x + 70, y], [x + 220, y]], 1, GREEN, 9, true); mline(ctx, [[x, y - 70], [x, y - 220]], 1, GREEN, 9, true);
        mline(ctx, [[x - 70, y], [x - 200, y]], 1, "#B0B8BF", 9, true); mline(ctx, [[x, y + 70], [x, y + 200]], 1, "#B0B8BF", 9, true);
        cross(ctx, x - 140, y, 60, 1, RED, 7); cross(ctx, x, y + 140, 60, 1, RED, 7);
        text(ctx, "kanan", x + 150, y + 50, 32, { align: "center", weight: 900, color: GREEN }); text(ctx, "atas", x + 70, y - 180, 32, { weight: 900, color: GREEN });
      });
      robot(ctx, cx(0), cy(4) - 6, 70);
    }
    // jalan contoh dengan penghitung
    const walkScene = (W, t0, t1, col, label) => {
      const u = clamp((l - t0) / Math.max(1, t1 - t0), 0, 1);
      path(ctx, W.pts, u, col, 12);
      const [x, y, k] = along(W.pts, u); robot(ctx, x, y - 6, 70);
      card(ctx, RX + 80, 260, 520, 150, { fill: "#F7F9FA", stroke: col, lw: 5, r: 20 });
      text(ctx, label, RX + 340, 315, 34, { align: "center", weight: 900, color: INK });
      text(ctx, sumAt(W.pts, k) + " permen", RX + 340, 380, 52, { align: "center", weight: 900, color: col });
    };
    if (id === "soal3") walkScene(P10, at(b, "Misalnya"), at(b, "Jumlahnya"), BLUE_(), "naik terus, lalu ke kanan");
    if (id === "m2") walkScene(P13, at(b, "Misalnya"), at(b, "Hasilnya"), ORANGE, "kanan dulu, lalu naik");
    if (id === "m3") {
      path(ctx, P10.pts, 1, "rgba(47,111,208,0.45)", 10); path(ctx, P13.pts, 1, ORANGE, 12);
      hand(ctx, "13 > 10", RX + 340, 330, 64, { color: ORANGE, alpha: P(l, 0.4, 0.5) });
      hand(ctx, "tetapi, apakah terbanyak?", RX + 380, 440, 48, { color: INK, alpha: P(l, at(b, "apakah"), 0.5) });
      hand(ctx, "butuh cara lebih pintar", RX + 380, 560, 48, { color: GREEN, alpha: P(l, at(b, "Kita butuh"), 0.5) });
    }
    if (id === "m1") {
      let n = 0; const tot = Math.floor(clamp((l - at(b, "tujuh puluh") + 0.5) / 2.5, 0, 1) * 70);
      (function gen(r, c, p) { if (r === 0 && c === 4) { if (n < tot) { const W = walk(p); ctx.globalAlpha = 0.25; path(ctx, W.pts, 1, ["#2F6FD0", ORANGE, GREEN, RED][n % 4], 5); ctx.globalAlpha = 1; } n++; return; } if (r > 0) gen(r - 1, c, p + "U"); if (c < 4) gen(r, c + 1, p + "R"); })(4, 0, "");
      hand(ctx, "70 jalan!", RX + 360, 350, 90, { color: RED, alpha: P(l, at(b, "tujuh puluh"), 0.5) });
      hand(ctx, "melelahkan dan mudah salah", RX + 380, 480, 44, { color: INK, alpha: P(l, at(b, "melelahkan"), 0.5) });
    }
    if (id === "soal4") {
      card(ctx, RX, 190, 960, 100, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Berapa permen paling banyak?", RX + 480, 256, 44, { align: "center", weight: 900, color: INK });
      OPTS.forEach((o, i) => alpha(ctx, P(l, at(b, "Pilihan " + "ABCDE"[i]), 0.4), () => { const x = RX + 80 + (i % 3) * 300, y = 400 + Math.floor(i / 3) * 110; letter(ctx, "ABCDE"[i], x + 30, y - 18, 32, false); text(ctx, o, x + 80, y, 60, { weight: 900, color: INK }); }));
    }
    // aturan nilai
    if (id === "t1") alpha(ctx, P(l, at(b, "kita catat"), 0.5), () => { card(ctx, RX, 220, 960, 160, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "nilai petak =", RX + 40, 285, 40, { weight: 900, color: INK }); text(ctx, "permen terbanyak sampai petak ini", RX + 40, 345, 40, { weight: 800, color: ORANGE }); });
    if (id === "t2" || id === "t3" || id === "t4" || id === "t5") {
      card(ctx, RX, 190, 960, 120, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 20 });
      text(ctx, "nilai = permen + yang lebih besar", RX + 480, 245, 40, { align: "center", weight: 900, color: INK });
      text(ctx, "dari (nilai kiri, nilai bawah)", RX + 480, 293, 36, { align: "center", weight: 800, color: INK });
    }
    if (id === "t2") {
      const a = P(l, at(b, "dari kiri"), 0.5);
      mline(ctx, [[cx(1) - 30, cy(2)], [cx(2) - 40, cy(2)]], a, GREEN, 8, true); mline(ctx, [[cx(2), cy(3) + 20], [cx(2), cy(2) + 40]], P(l, at(b, "dari bawah"), 0.5), GREEN, 8, true);
      hand(ctx, "robot datang dari kiri atau bawah", RX + 480, 420, 42, { color: GREEN, alpha: a });
    }
    if (id === "t4" || id === "t5") {
      const [r, c, pl, lv, bv, res] = id === "t4" ? [3, 1, 1, 3, 0, 4] : [2, 1, 2, 5, 4, 7];
      mline(ctx, [[cx(c - 1) + 30, cy(r)], [cx(c) - 30, cy(r)]], P(l, at(b, "Nilai kirinya"), 0.5), GREEN, 7, true);
      mline(ctx, [[cx(c), cy(r + 1) - 10], [cx(c), cy(r) + 30]], P(l, at(b, "nilai bawahnya"), 0.5), GREEN, 7, true);
      const lines = [["permen di petak: " + pl, "berisi"], ["kiri: " + lv + "   bawah: " + bv, "nilai bawahnya"], [pl + " + " + Math.max(lv, bv) + " = " + res, id === "t4" ? "nilainya satu" : "nilainya dua"]];
      lines.forEach(([s, ph], i) => alpha(ctx, P(l, at(b, ph), 0.5), () => text(ctx, s, RX + 60, 420 + i * 90, i === 2 ? 64 : 46, { weight: 900, color: i === 2 ? ORANGE : INK })));
      ring(ctx, RX + 60 + (id === "t4" ? 120 : 120), 395 + 90, 70, 40, P(l, at(b, id === "t4" ? "yang lebih besar" : "Jadi"), 0.5), GREEN, 5);
    }
    if (id === "t3") {
      hand(ctx, "baris bawah: hanya dari kiri", RX + 460, 430, 42, { color: INK, alpha: P(l, 0.3, 0.5) });
      hand(ctx, "kolom kiri: hanya dari bawah", RX + 460, 520, 42, { color: INK, alpha: P(l, at(b, "Kolom paling kiri"), 0.5) });
    }
    if (id === "t6") { thinkBadge(ctx, RX + 60, 260, 800, 170, l, b.hold + 2, "Berapa nilai di petak F?"); text(ctx, "?", X0 + 4 * S + S - 30, Y0 + S - 18, 44, { align: "center", weight: 900, color: ORANGE }); }
    if (id === "t7" || id === "t8") hand(ctx, "kolom demi kolom, dari bawah ke atas", RX + 470, 300, 42, { color: INK });
    if (id === "t8") alpha(ctx, P(l, at(b, "Jadi, nilai"), 0.5), () => text(ctx, "F = 14", RX + 470, 450, 90, { align: "center", weight: 900, color: GREEN }));
    if (id === "j1" || id === "j3") {
      const marks = id === "j1" ? { 2: { k: "ok", u: P(l, at(b, "Jawabannya"), 0.5) } } : { 2: { k: "ok", u: 1 }, 3: { k: "x", u: P(l, at(b, "enam belas"), 0.5) }, 4: { k: "x", u: P(l, at(b, "Jalan tiga belas"), 0.5) } };
      optionsCol(ctx, RX + 40, 260, marks);
      if (id === "j1") alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => { card(ctx, RX + 420, 400, 520, 140, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: C. 14", RX + 680, 490, 56, { align: "center", weight: 900, color: GREEN }); });
      if (id === "j3") {
        alpha(ctx, P(l, at(b, "enam belas"), 0.5), () => text(ctx, "16: tidak ada jalannya", RX + 440, 460, 38, { weight: 800, color: RED }));
        alpha(ctx, P(l, at(b, "Jalan tiga belas"), 0.5), () => { text(ctx, "13: kurang 1 permen", RX + 440, 530, 38, { weight: 800, color: ORANGE }); path(ctx, P13.pts, 1, "rgba(238,122,18,0.5)", 8); });
        path(ctx, PBEST.pts, 1, GREEN, 12);
      }
    }
    if (id === "j2" || id === "c3" || id === "c2") {
      const t0 = id === "j2" ? at(b, "berjalan mundur") : -9, t1 = id === "j2" ? at(b, "Salah satu jalan") : -9;
      // mundur dari F (hijau putus-putus), lalu robot berjalan maju
      const back = PBEST.pts.slice().reverse();
      if (id === "j2" && l < t1) path(ctx, back, clamp((l - t0) / Math.max(1, t1 - t0), 0, 1), GREEN, 10);
      else {
        const u = id === "j2" ? clamp((l - t1) / 4.5, 0, 1) : 1;
        path(ctx, PBEST.pts, u, GREEN, 12);
        const [x, y, k] = along(PBEST.pts, u); robot(ctx, x, y - 6, 70);
        if (id !== "c2") { card(ctx, RX + 80, 300, 600, 150, { fill: "#F7F9FA", stroke: GREEN, lw: 5, r: 20 }); text(ctx, "jalan terbaik", RX + 380, 355, 34, { align: "center", weight: 900, color: INK }); text(ctx, sumAt(PBEST.pts, k) + " permen", RX + 380, 422, 54, { align: "center", weight: 900, color: GREEN }); }
      }
      if (id === "j2") alpha(ctx, P(l, at(b, "Salah satu jalan"), 0.5), () => text(ctx, "naik, naik, kanan, naik, kanan ×3, naik", RX + 380, 540, 34, { align: "center", weight: 800, color: GREEN, fit: 900 }));
      if (id === "j2") alpha(ctx, P(l, at(b, "Di setiap petak"), 0.5), () => text(ctx, "ikuti nilai yang lebih besar (kiri atau bawah)", RX + 380, 230, 32, { align: "center", weight: 800, color: INK, fit: 900 }));
    }
    if (id === "c2") {
      hand(ctx, "dynamic programming", RX + 470, 260, 60, { color: ORANGE, alpha: P(l, at(b, "dynamic"), 0.5) });
      alpha(ctx, P(l, at(b, "dicatat"), 0.5), () => text(ctx, "catat jawaban kecil, jangan hitung ulang", RX + 470, 340, 36, { align: "center", weight: 800, color: INK }));
      alpha(ctx, P(l, at(b, "Aplikasi peta"), 0.5), () => {
        const x = RX + 300, y = 420; card(ctx, x, y, 340, 240, { fill: "#EAF4E6", stroke: INK, lw: 4, r: 20 });
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 16; [[x + 20, y + 80, x + 320, y + 80], [x + 120, y + 20, x + 120, y + 220], [x + 20, y + 170, x + 320, y + 170], [x + 250, y + 20, x + 250, y + 220]].forEach(([a, b2, c2, d]) => { ctx.beginPath(); ctx.moveTo(a, b2); ctx.lineTo(c2, d); ctx.stroke(); });
        mline(ctx, [[x + 40, y + 170], [x + 120, y + 170], [x + 120, y + 80], [x + 250, y + 80], [x + 250, y + 40]], 1, "#2F6FD0", 10, true);
        ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x + 250, y + 36, 14, 0, Math.PI * 2); ctx.fill();
      });
    }
    if (id === "c3") hand(ctx, "paling banyak 14 permen", RX + 380, 560, 54, { color: GREEN });
  }
  function BLUE_() { return "#2F6FD0"; }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function lantai_v(ctx, b, l) {
    board(ctx);
    X0 = 710; Y0 = 170; S = 100;
    const id = b.id, dp = id !== "h0" && id !== "h1";
    grid(ctx, { vals: dp && id !== "h2" });
    if (id === "h0") {
      const u = clamp((l - at(b, "Robot mengambil")) / 4, 0, 1);
      path(ctx, P10.pts, u, "#2F6FD0", 9); const [x, y] = along(P10.pts, u); robot(ctx, x, y - 4, 60);
      text(ctx, "hanya ke kanan atau ke atas", 960, 740, 40, { align: "center", weight: 900, color: GREEN });
    }
    if (id === "h1") alpha(ctx, P(l, at(b, "Pilihannya"), 0.5), () => OPTS.forEach((o, i) => { const x = 540 + i * 186; letter(ctx, "ABCDE"[i], x + 22, 732, 22, false); text(ctx, o, x + 52, 746, 42, { weight: 900, color: INK }); }));
    if (id === "h2") {
      text(ctx, "70 jalan → terlalu banyak", 960, 730, 38, { align: "center", weight: 900, color: RED });
      alpha(ctx, P(l, at(b, "Nilai setiap petak"), 0.5), () => text(ctx, "nilai = permen + maks(kiri, bawah)", 960, 795, 38, { align: "center", weight: 900, color: ORANGE }));
    }
    if (id === "h3") {
      const order = []; for (let d = 0; d <= 8; d++) for (let c = 0; c < 5; c++) { const r = 4 - (d - c); if (r >= 0 && r < 5) order.push([r, c]); }
      const t0 = at(b, "Kita isi"), t1 = at(b, "Akhirnya");
      values(ctx, (r, c) => { const i = order.findIndex(([a, bb]) => a === r && bb === c); return P(l, t0 + i * (t1 - t0) / 25, 0.25); }, P(l, t1, 0.5));
      alpha(ctx, P(l, t1, 0.5), () => text(ctx, "F = 14", 960, 760, 64, { align: "center", weight: 900, color: GREEN }));
    }
    if (id === "h4") {
      values(ctx, () => 1, 1);
      const u = clamp((l - at(b, "Salah satu")) / 4, 0, 1); path(ctx, PBEST.pts, u, GREEN, 10); const [x, y] = along(PBEST.pts, u); robot(ctx, x, y - 4, 60);
      text(ctx, "Jawaban: 14 permen", 960, 760, 56, { align: "center", weight: 900, color: GREEN });
    }
  }

  Object.assign(K.SCENES, B.umum(META), { lantai, lantai_v });
})(typeof window !== "undefined" ? window : globalThis);
