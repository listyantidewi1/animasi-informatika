/* PNG11 Pembahasan Soal Bebras 2018-TW-06 "Kode Bendera" (Taiwan), kategori Penggalang (SMP).
   Papan tulis: berang-berang memegang bendera mendatar (0) atau tegak (1), kartu kode P–T, pesan delapan bendera,
   pemeriksaan pilihan angka demi angka, dan kode awalan yang membuat pesan bisa dibaca lebih dari satu cara.
   Semua pilihan diubah menjadi angka di kode; K._warn bila yang cocok bukan hanya B. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Kode Bendera", tahun: "2018", negara: "Taiwan", kode: "2018-TW-06", flag: "TW", sumber: "Buku Tantangan Bebras Indonesia 2018", bukaFrasa: "Bebras",
    tingkat: "kelas 7, 8, dan 9 SMP (Penggalang)",
    langkah: ["Ubah setiap posisi bendera menjadi angka 0 atau 1.", "Ubah setiap pilihan menjadi angka.", "Bandingkan dengan pesan, angka demi angka, termasuk jumlah angkanya."],
    cta: "Apa bunyi pesan bendera ini?", gambarUlang: "Berang-berang dan bendera digambar ulang untuk video ini." };

  // ---------- data soal (0 = mendatar, 1 = tegak) ----------
  const CODE = { P: "0", Q: "1", R: "10", S: "001", T: "1001" }, LET = "PQRST".split("");
  const MSG = "10010010";
  const OPT = { A: "RPSP", B: "QPPTP", C: "TSQ", D: "RPQSR" }, OL = "ABCD".split("");
  const enc = s => s.split("").map(c => CODE[c]).join("");
  const ALT = ["QPPTP", "TSP", "QSSP", "RPTP"];
  const cocok = OL.filter(L => enc(OPT[L]) === MSG);
  if (cocok.join("") !== "B" || ALT.some(s => enc(s) !== MSG) || enc("RPSP").length !== 7 || enc("RPQSR").length !== 9 || enc("TSQ")[7] !== "1")
    (K._warn = K._warn || []).push("data salah: cocok=" + cocok.join(","));

  // ---------- gambar ----------
  const FLAG = "#D9302B", POLE = "#5E4632";
  function glyph(ctx, x, y, s, v, o = {}) {   // ikon bendera dalam kotak (s = sisi kotak)
    if (!o.noBox) card(ctx, x - s / 2, y - s / 2, s, s, { fill: "#FFFFFF", stroke: "#C9D0D6", lw: 2, r: s * 0.14 });
    ctx.strokeStyle = POLE; ctx.lineWidth = Math.max(3, s * 0.07); ctx.lineCap = "round"; ctx.fillStyle = FLAG; ctx.beginPath();
    if (v === "1") { ctx.moveTo(x - s * 0.12, y + s * 0.38); ctx.lineTo(x - s * 0.12, y - s * 0.38); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - s * 0.12, y - s * 0.38); ctx.lineTo(x + s * 0.3, y - s * 0.38); ctx.lineTo(x - s * 0.12, y - s * 0.02); }
    else { ctx.moveTo(x - s * 0.38, y - s * 0.1); ctx.lineTo(x + s * 0.38, y - s * 0.1); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + s * 0.38, y - s * 0.1); ctx.lineTo(x + s * 0.38, y + s * 0.32); ctx.lineTo(x - s * 0.04, y - s * 0.1); }
    ctx.closePath(); ctx.fill();
  }
  function fb(ctx, x, y, s, v) {   // berang-berang memegang bendera (titik tengah badan di x, y)
    B.beaver(ctx, x, y, s, {});
    const k = s / 100, hx = x + 30 * k, hy = y + 12 * k;
    ctx.strokeStyle = POLE; ctx.lineWidth = Math.max(3, 4 * k); ctx.lineCap = "round"; ctx.fillStyle = FLAG;
    if (v === "1") { ctx.beginPath(); ctx.moveTo(hx, hy + 30 * k); ctx.lineTo(hx, y - 92 * k); ctx.stroke(); ctx.beginPath(); ctx.moveTo(hx, y - 92 * k); ctx.lineTo(hx + 42 * k, y - 92 * k); ctx.lineTo(hx, y - 58 * k); ctx.closePath(); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(hx - 6 * k, hy); ctx.lineTo(hx + 78 * k, hy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(hx + 78 * k, hy); ctx.lineTo(hx + 78 * k, hy + 42 * k); ctx.lineTo(hx + 44 * k, hy); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = "#8B5E3C"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2 * k; ctx.beginPath(); ctx.arc(hx, hy, 7 * k, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  const sp = s => s.split("").join(" ");
  // kartu kode satu huruf
  function codeCard(ctx, L, x, y, w, h, o = {}) {
    card(ctx, x, y, w, h, { fill: "#FFFDF7", stroke: o.stroke || ORANGE, lw: 4, r: 18 });
    text(ctx, L, x + w / 2, y + 62, 54, { align: "center", weight: 900, color: INK });
    const c = CODE[L], gs = Math.min(64, (w - 30) / 4 - 8), step = gs + 8, x0 = x + w / 2 - (c.length - 1) * step / 2;
    c.split("").forEach((v, i) => glyph(ctx, x0 + i * step, y + 120, gs, v));
    if (o.bits > 0) alpha(ctx, o.bits, () => c.split("").forEach((v, i) => {
      const hi = o.hi && i === 0 ? o.hi : 0;
      if (hi > 0) alpha(ctx, hi, () => { ctx.fillStyle = "#FFE3B0"; ctx.beginPath(); ctx.arc(x0 + i * step, y + 202, 30, 0, Math.PI * 2); ctx.fill(); });
      text(ctx, v, x0 + i * step, y + 220, 50, { align: "center", weight: 900, color: hi > 0 ? ORANGE : INK });
    }));
  }
  const CX = k => 110 + k * 342;
  function cards(ctx, y, o = {}) { LET.forEach((L, k) => alpha(ctx, o.a ? o.a(k) : 1, () => codeCard(ctx, L, CX(k), y, 320, 250, { bits: o.bits ? o.bits(k) : 0, hi: o.hi ? o.hi(k) : 0 }))); }
  const MX = i => 210 + i * 205;
  function msgRow(ctx, y, o = {}) {
    MSG.split("").forEach((v, i) => alpha(ctx, o.a ? o.a(i) : 1, () => { fb(ctx, MX(i), y, 120, v);
      if (o.bits && o.bits(i) > 0) alpha(ctx, o.bits(i), () => text(ctx, v, MX(i) + 10, y + 128, 54, { align: "center", weight: 900, color: o.hi && o.hi(i) ? ORANGE : INK })); }));
  }
  function optCard(ctx, L, x, y, w, h) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#9AA5AE", lw: 3, r: 16 });
    letter(ctx, L, x + 50, y + h / 2, 28, false);
    text(ctx, sp(OPT[L]), x + 100, y + h / 2 + 20, 56, { weight: 900, color: INK });
  }
  // baris kotak angka (pemeriksaan); groups = huruf-huruf pilihan
  const BX = i => 420 + i * 100;
  function bitBoxes(ctx, bits, y, o = {}) {
    bits.split("").forEach((v, i) => alpha(ctx, o.a ? o.a(i) : 1, () => {
      const st = o.cmp ? (i >= MSG.length ? "x" : v === MSG[i] ? "ok" : "x") : "";
      card(ctx, BX(i), y, 88, 88, { fill: st === "ok" ? "#E9F6EE" : st === "x" ? "#FBE3E1" : "#FFFFFF", stroke: st === "ok" ? GREEN : st === "x" ? RED : INK, lw: 3, r: 12 });
      text(ctx, v, BX(i) + 44, y + 64, 54, { align: "center", weight: 900, color: INK });
    }));
  }
  function groups(ctx, s, y, a, col = C.ink2) {   // tanda kurung + huruf di bawah kelompok angka
    let i = 0; s.split("").forEach((L, k) => { const n = CODE[L].length, x1 = BX(i) + 6, x2 = BX(i + n - 1) + 82; i += n;
      alpha(ctx, a(k), () => { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1, y + 12); ctx.lineTo(x2, y + 12); ctx.lineTo(x2, y); ctx.stroke();
        text(ctx, L, (x1 + x2) / 2, y + 52, 38, { align: "center", weight: 900, color: ORANGE }); }); });
  }
  const JB = { j1: ["R adalah", "Hasilnya"], j2: ["Q adalah", "Hasilnya"], j3: ["Hasilnya", "Angka terakhirnya"], j4: ["Hasilnya", null] };
  const JV = { j1: "Jadi, pilihan A", j2: "sama persis", j3: "Jadi, pilihan C", j4: "Jadi, pilihan D" };

  function bendera(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "soal1") {
      [["0", 620, "mendatar"], ["1", 1300, "tegak"]].forEach(([v, x, s], k) => alpha(ctx, P(l, at(b, k ? "tegak ke atas" : "mendatar"), 0.5), () => { fb(ctx, x, 430, 260, v); hand(ctx, s, x + 60, 690, 54, { color: ORANGE }); }));
      if (P(l, at(b, "mendatar"), 0.5) <= 0) fb(ctx, 960, 430, 260, "1");
      return;
    }
    if (id === "soal2" || id === "soal3") {
      const ph = ["Huruf P", "Huruf Q", "Huruf R", "Huruf S", "Huruf T"];
      cards(ctx, 300, { a: k => id === "soal3" ? (k < 3 ? 1 : P(l, at(b, ph[k]), 0.5)) : (k < 3 ? P(l, at(b, ph[k]), 0.5) : 0) });
      if (id === "soal2") hand(ctx, "P   Q   R   S   T", 960, 230, 50, { color: ORANGE, alpha: 1 - P(l, at(b, "Huruf P"), 0.5) });
      return;
    }
    if (id === "soal4" || id === "soal5") {
      msgRow(ctx, 300, { a: i => id === "soal4" ? P(l, at(b, "delapan bendera") + i * 0.25, 0.4) : 1 });
      if (id === "soal4") alpha(ctx, P(l, at(b, "apa bunyi"), 0.5), () => hand(ctx, "Apa bunyi pesan ini?", 960, 560, 60, { color: INK }));
      else OL.forEach((L, k) => alpha(ctx, P(l, at(b, "Pilihan " + L), 0.4), () => optCard(ctx, L, 110 + (k % 2) * 860, 470 + Math.floor(k / 2) * 150, 800, 125)));
      return;
    }
    if (id === "m1") {
      [["0", 560, "mendatar"], ["1", 1360, "tegak"]].forEach(([v, x, s], k) => alpha(ctx, P(l, at(b, k ? "tegak kita" : "mendatar kita"), 0.5), () => {
        glyph(ctx, x - 130, 420, 220, v); text(ctx, "= " + v, x + 90, 460, 130, { align: "center", weight: 900, color: ORANGE }); hand(ctx, "bendera " + s, x - 20, 640, 46, { color: INK }); }));
      return;
    }
    if (id === "m2" || id === "m3" || id === "m4") {
      const ph = ["P adalah", "Q adalah", "R adalah", "S adalah", "T adalah"];
      msgRow(ctx, 260, { bits: i => id === "m2" ? 0 : id === "m3" ? P(l, at(b, "pesannya adalah") + i * 0.45, 0.3) : 1, hi: i => id === "m4" && i === 0 && P(l, at(b, "Angka pertamanya"), 0.4) > 0 });
      cards(ctx, 470, { bits: k => id === "m2" ? P(l, at(b, ph[k]), 0.4) : 1 });
      if (id === "m4") {
        ring(ctx, MX(0) + 10, 370, 46, 46, P(l, at(b, "Angka pertamanya"), 0.5), ORANGE, 6);
        [1, 2, 4].forEach((k, j) => ring(ctx, CX(k) + 160, 610, 175, 150, P(l, at(b, j === 0 ? "berarti Q" : "awal dari R") + (j === 2 ? 0.5 : 0), 0.5), RED, 5));
      }
      return;
    }
    if (id === "m5") {
      msgRow(ctx, 260, { bits: () => 1 });
      OL.forEach((L, k) => optCard(ctx, L, 110 + k * 432, 470, 400, 110));
      thinkBadge(ctx, 460, 625, 1000, 90, l, b.hold + 2, "Ubah setiap pilihan menjadi angka.");
      return;
    }
    const seg2 = ["j1", "j2", "j3", "j4", "j5"], n = seg2.indexOf(id);
    if (n >= 0) {
      text(ctx, "pesan", 390, 228, 40, { align: "right", weight: 900, color: INK });
      bitBoxes(ctx, MSG, 170, {});
      // legenda kode
      card(ctx, 1450, 160, 380, 360, { fill: "#FFFDF7", stroke: ORANGE, lw: 3, r: 18 });
      LET.forEach((L, k) => text(ctx, L + "  =  " + sp(CODE[L]), 1490, 225 + k * 64, 40, { weight: 900, color: INK }));
      // hasil sebelumnya
      OL.forEach((L, k) => { const done = k < n || (k === n && P(l, at(b, JV[id] || "jawabannya"), 0.4) > 0); if (!done && id !== "j5") return;
        const x = 1450 + k * 95, ok = L === "B"; letter(ctx, L, x + 30, 600, 28, false); (ok ? tick : cross)(ctx, x + 30, 670, 54, 1, ok ? GREEN : RED); });
      if (id === "j5") { alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, 420, 330, 900, 150, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: B. Q P P T P", 870, 425, 62, { align: "center", weight: 900, color: GREEN }); }); bitBoxes(ctx, enc("QPPTP"), 540, { cmp: true }); groups(ctx, "QPPTP", 640, () => 1); return; }
      const L = OL[n], s = OPT[L], bits = enc(s), [p0, p1] = JB[id], t0 = at(b, p0), t1 = p1 ? at(b, p1) : t0 + 1.2;
      let cum = 0; const starts = s.split("").map(c => { const st = cum; cum += CODE[c].length; return st; });
      const tg = k => t0 + (t1 - t0) * k / s.length;
      const ga = i => { let k = 0; while (k + 1 < starts.length && starts[k + 1] <= i) k++; return P(l, tg(k), 0.35); };
      text(ctx, L, 390, 350, 44, { align: "right", weight: 900, color: ORANGE }); text(ctx, sp(s), 390, 392, 28, { align: "right", weight: 900, color: ORANGE });
      const cmpOn = P(l, t1, 0.4) > 0;
      bitBoxes(ctx, bits, 310, { a: ga, cmp: cmpOn });
      if (id === "j1") alpha(ctx, P(l, t1, 0.4), () => { ctx.setLineDash([10, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.strokeRect(BX(7), 310, 88, 88); ctx.setLineDash([]); text(ctx, "?", BX(7) + 44, 374, 54, { align: "center", weight: 900, color: RED }); });
      groups(ctx, s, 410, k => P(l, tg(k), 0.35));
      if (id === "j1" || id === "j4") alpha(ctx, P(l, at(b, id === "j1" ? "tujuh angka" : "sembilan angka"), 0.5), () => text(ctx, id === "j1" ? "7 angka, bukan 8" : "9 angka, bukan 8", 870, 560, 50, { align: "center", weight: 900, color: RED }));
      if (id === "j3") ring(ctx, BX(7) + 44, 354, 60, 60, P(l, at(b, "Angka terakhirnya"), 0.5), RED, 6);
      if (id === "j2") alpha(ctx, P(l, at(b, "sama persis"), 0.5), () => text(ctx, "8 angka, semuanya sama!", 870, 560, 50, { align: "center", weight: 900, color: GREEN }));
      return;
    }
    if (id === "k1") {
      ALT.forEach((s, r) => { const y = 150 + r * 155, a = r === 0 ? 1 : P(l, at(b, ["", "T, S, P", "Q, S, S, P", "R, P, T, P"][r]), 0.5);
        alpha(ctx, a, () => { text(ctx, sp(s), 390, y + 62, 40, { align: "right", weight: 900, color: ORANGE }); bitBoxes(ctx, MSG, y, {}); groups(ctx, s, y + 92, () => 1); }); });
      // kotak angka di k1 dibuat lebih rapat
      alpha(ctx, P(l, at(b, "sama persis"), 0.5), () => { card(ctx, 1300, 300, 520, 200, { fill: "#FFF4DE", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "angkanya sama,", 1560, 385, 46, { align: "center", weight: 900, color: INK }); text(ctx, "bacaannya beda!", 1560, 445, 46, { align: "center", weight: 900, color: RED }); });
      return;
    }
    if (id === "k2") {
      const tQ = at(b, "Kode Q"), tP = at(b, "Kode P");
      cards(ctx, 200, { bits: () => 1, hi: k => k === 2 || k === 4 ? P(l, at(b, "awal dari kode R"), 0.4) : k === 3 ? P(l, at(b, "awal dari kode S"), 0.4) : 0 });
      ring(ctx, CX(1) + 160, 325, 172, 150, P(l, tQ, 0.5), ORANGE, 6);
      ring(ctx, CX(0) + 160, 325, 172, 150, P(l, tP, 0.5), C.ink2, 5);
      alpha(ctx, P(l, at(b, "awal dari kode R"), 0.5), () => text(ctx, "1  adalah awal dari  1 0  dan  1 0 0 1", 960, 560, 46, { align: "center", weight: 900, color: ORANGE }));
      alpha(ctx, P(l, at(b, "awal dari kode S"), 0.5), () => text(ctx, "0  adalah awal dari  0 0 1", 960, 630, 46, { align: "center", weight: 900, color: C.ink2 }));
      alpha(ctx, P(l, at(b, "lebih dari satu cara"), 0.5), () => hand(ctx, "→ pesan bisa dibaca lebih dari satu cara", 960, 720, 44, { color: RED }));
      return;
    }
    if (id === "k3") {
      alpha(ctx, P(l, 0.2, 0.5), () => { card(ctx, 160, 180, 1600, 170, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 22 }); text(ctx, "Cara 1: tidak ada kode yang menjadi awal kode lain", 960, 260, 50, { align: "center", weight: 900, color: GREEN, fit: 1520 }); text(ctx, "contoh: P = 0, Q = 10, R = 110, S = 1110, T = 1111", 960, 320, 38, { align: "center", weight: 800, color: C.ink2, fit: 1520 }); });
      alpha(ctx, P(l, at(b, "sama panjang"), 0.5), () => { card(ctx, 160, 390, 1600, 170, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 22 }); text(ctx, "Cara 2: semua kode sama panjang", 960, 470, 50, { align: "center", weight: 900, color: GREEN }); text(ctx, "contoh: P = 000, Q = 001, R = 010, S = 011, T = 100", 960, 530, 38, { align: "center", weight: 800, color: C.ink2, fit: 1520 }); });
      alpha(ctx, P(l, at(b, "satu arti"), 0.5), () => hand(ctx, "→ setiap pesan hanya punya satu arti", 960, 680, 50, { color: ORANGE }));
      return;
    }
    if (id === "c2") {
      alpha(ctx, P(l, 0.2, 0.5), () => { text(ctx, "Q P P T P", 400, 330, 64, { align: "center", weight: 900, color: INK }); text(ctx, "1 0 0 1 0 0 1 0", 1430, 330, 64, { align: "center", weight: 900, color: INK }); });
      alpha(ctx, P(l, at(b, "encoding"), 0.5), () => { B.arrow(ctx, 640, 300, 1110, 300, 1, ORANGE, 7); hand(ctx, "encoding", 875, 270, 46, { color: ORANGE }); });
      alpha(ctx, P(l, at(b, "decoding"), 0.5), () => { B.arrow(ctx, 1110, 390, 640, 390, 1, GREEN, 7); hand(ctx, "decoding", 875, 450, 46, { color: GREEN }); });
      alpha(ctx, P(l, at(b, "Komputer"), 0.5), () => { card(ctx, 360, 540, 1200, 150, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "komputer: semua huruf = deretan 0 dan 1", 960, 610, 46, { align: "center", weight: 900, color: INK, fit: 1120 }); text(ctx, "kodenya harus tidak membingungkan", 960, 665, 36, { align: "center", weight: 800, color: C.ink2 }); });
      return;
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function bendera_v(ctx, b, l) {
    board(ctx);
    const id = b.id;
    MSG.split("").forEach((v, i) => { const x = 560 + i * 114; glyph(ctx, x, 200, 92, v);
      if (id !== "h0") alpha(ctx, id === "h1" ? P(l, 0.2 + i * 0.4, 0.3) : 1, () => text(ctx, v, x, 300, 52, { align: "center", weight: 900, color: INK })); });
    LET.forEach((L, k) => { const x = 480 + k * 196; card(ctx, x, 330, 180, 130, { fill: "#FFFDF7", stroke: ORANGE, lw: 3, r: 14 });
      text(ctx, L, x + 90, 382, 44, { align: "center", weight: 900, color: INK });
      alpha(ctx, id === "h0" ? P(l, at(b, ["P adalah", "Q adalah", "R adalah", "S adalah", "T adalah"][k]), 0.4) : 1, () => text(ctx, sp(CODE[L]), x + 90, 440, 38, { align: "center", weight: 900, color: ORANGE })); });
    OL.forEach((L, k) => { const y = 470 + k * 68, bits = enc(OPT[L]);
      letter(ctx, L, 510, y + 34, 24, false); text(ctx, sp(OPT[L]), 550, y + 50, 40, { weight: 900, color: INK });
      const show = id === "h2" ? (L === "B" ? 0 : P(l, at(b, ["Pilihan A hanya", "", "pilihan C adalah", "pilihan D sembilan"][k]), 0.4)) : id === "h3" ? 1 : 0;
      alpha(ctx, show, () => { bits.split("").forEach((v, i) => { const ok = i < 8 && v === MSG[i]; text(ctx, v, 800 + i * 50, y + 50, 40, { align: "center", weight: 900, color: ok ? GREEN : RED }); });
        if (L === "B") { if (id === "h3") ring(ctx, 980, y + 34, 205, 40, P(l, at(b, "Sama persis"), 0.5), GREEN, 5); }
        else cross(ctx, 1410, y + 36, 46, 1, RED); });
    });
    if (id === "h0") alpha(ctx, P(l, at(b, "Bendera mendatar"), 0.4), () => text(ctx, "mendatar = 0   ·   tegak = 1", 960, 300, 40, { align: "center", weight: 900, color: RED }));
    if (id === "h1") thinkBadge(ctx, 610, 762, 700, 64, l, b.hold + 2, "");
    if (id === "h3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: B", 960, 815, 52, { align: "center", weight: 900, color: GREEN }));
  }

  Object.assign(K.SCENES, B.umum(META), { bendera, bendera_v });
})(typeof window !== "undefined" ? window : globalThis);
