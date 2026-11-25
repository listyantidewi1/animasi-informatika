/* PG11 Pembahasan Soal Bebras 2018-HR-05 "Siapa Berbohong?" (Kroasia), kategori Penegak (SMA).
   Papan tulis: empat anak dengan gelembung kata, jendela pecah; tabel kemungkinan pelaku × pernyataan (benar/bohong).
   Nilai setiap pernyataan dihitung di kode; K._warn bila pelaku dengan tepat satu pembohong bukan hanya David.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr, kid, bubble } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Siapa Berbohong?", tahun: "2018", negara: "Kroasia", kode: "2018-HR-05", flag: "HR", sumber: "Buku Tantangan Bebras Indonesia 2018", bukaFrasa: "Bebras",
    tingkat: "SMA (Penegak)",
    langkah: ["Tulis semua kemungkinan pelaku.", "Untuk setiap kemungkinan, periksa benar atau salahnya setiap pernyataan.", "Pilih kemungkinan yang pembohongnya tepat satu."],
    cta: "Siapa yang memecahkan kaca?", gambarUlang: "Anak-anak, bola, dan jendela digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const ANAK = ["Marko", "Iva", "Maya", "David"];
  const KATA = { Marko: "Bukan saya yang memecahkan kaca.", Iva: "Marko atau David yang memecahkan kaca.", Maya: "David yang memecahkan kaca.", David: "Bukan saya, Maya bohong!" };
  const SINGKAT = { Marko: ["bukan saya"], Iva: ["Marko atau", "David"], Maya: ["David"], David: ["bukan saya,", "Maya bohong"] };
  const benar = {
    Marko: c => c !== "Marko", Iva: c => c === "Marko" || c === "David", Maya: c => c === "David",
    David: c => c !== "David" && !(c === "David"),   // "Maya bohong" ⇔ pernyataan Maya salah ⇔ c ≠ David
  };
  const nilai = c => ANAK.map(a => benar[a](c));
  const bohong = c => nilai(c).filter(v => !v).length;
  const COCOK = ANAK.filter(c => bohong(c) === 1);
  const EXP = { Marko: [false, true, false, true], Maya: [true, false, false, true], Iva: [true, false, false, true], David: [true, true, true, false] };
  if (COCOK.join() !== "David" || Object.keys(EXP).some(c => nilai(c).join() !== EXP[c].join())) (K._warn = K._warn || []).push("data salah: " + COCOK.join());
  const HAIR = { Marko: { hairColor: "#3B2A20" }, Iva: { hairColor: "#7A3E1D", hair: "long" }, Maya: { hairColor: "#1E1A18", hair: "long" }, David: { hairColor: "#C99A3C" } };
  const NCOL = { Marko: "#2F6FD0", Iva: "#C2410C", Maya: "#9333EA", David: "#0F766E" };

  // ---------- adegan kelas ----------
  const KX = [300, 640, 980, 1320], KY = 625, KS = 135;
  function windowPane(ctx, x, y, w, h, crack) {
    ctx.fillStyle = "#8C6A4A"; rr(ctx, x - 12, y - 12, w + 24, h + 24, 8); ctx.fill();
    ctx.fillStyle = "#CFE9F7"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#8C6A4A"; ctx.fillRect(x + w / 2 - 5, y, 10, h); ctx.fillRect(x, y + h / 2 - 5, w, 10);
    if (crack > 0) { const cx = x + w * 0.3, cy = y + h * 0.3; ctx.save(); ctx.globalAlpha *= clamp(crack, 0, 1); ctx.strokeStyle = "#455A64"; ctx.lineWidth = 3;
      [[-60, -50], [70, -30], [50, 70], [-40, 60], [10, -75], [-75, 10]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx * 0.5, cy + dy * 0.6); ctx.lineTo(cx + dx, cy + dy); ctx.stroke(); });
      ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  }
  function ball(ctx, x, y, r) { ctx.fillStyle = "#fff"; ctx.strokeStyle = "#222"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#222"; ctx.beginPath(); for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k * Math.PI * 2 / 5; ctx.lineTo(x + Math.cos(a) * r * 0.38, y + Math.sin(a) * r * 0.38); } ctx.fill(); }
  function tag(ctx, s, x, y, col, a = 1) { alpha(ctx, a, () => { ctx.font = `900 30px ${K.FONT}`; const w = ctx.measureText(s).width + 36; ctx.fillStyle = col; rr(ctx, x - w / 2, y - 26, w, 44, 22); ctx.fill(); text(ctx, s, x, y + 7, 30, { align: "center", weight: 900, color: "#fff" }); }); }
  function kelas(ctx, b, l) {
    board(ctx);
    const id = b.id, order = ["soal1", "soal2", "soal3", "soal4", "soal5", "p1", "p2", "p3"], n = order.indexOf(id), from = k => n >= order.indexOf(k);
    const crack = id === "soal1" ? P(l, at(b, "memecahkan kaca"), 0.4) : 1;
    windowPane(ctx, 1570, 220, 250, 260, crack);
    if (id === "soal1") { const u = clamp((l - at(b, "melempar bola")) / 1.2, 0, 1); if (u > 0 && u < 1) ball(ctx, 980 + (1640 - 980) * u, 560 - 300 * u + 260 * u * u - 240 * Math.sin(Math.PI * u) * 0.6, 22); }
    if (from("soal1") && crack >= 1) ball(ctx, 1700, 770, 22);
    ANAK.forEach((a, i) => alpha(ctx, id === "soal1" ? P(l, at(b, a) , 0.4) : 1, () => {
      kid(ctx, KX[i], KY, KS, HAIR[a]); text(ctx, a, KX[i], 790, 36, { align: "center", weight: 900, color: NCOL[a] });
    }));
    // gelembung kata
    const tB = { Marko: id === "soal3" ? at(b, "Marko berkata") : (from("soal4") ? -9 : 1e9), Iva: id === "soal3" ? at(b, "Iva berkata") : (from("soal4") ? -9 : 1e9),
      Maya: id === "soal4" ? at(b, "Maya berkata") : (from("soal5") ? -9 : 1e9), David: id === "soal4" ? at(b, "David berkata") : (from("soal5") ? -9 : 1e9) };
    ANAK.forEach((a, i) => alpha(ctx, P(l, tB[a], 0.4) * (id === "p1" && (a === "Marko" || a === "Iva") ? 0.45 : 1), () => {
      bubble(ctx, KX[i] - 160, 480, 320, "“" + KATA[a] + "”", 32, { tailX: KX[i], stroke: NCOL[a] });
    }));
    if (id === "soal2") { alpha(ctx, P(l, at(b, "tiga dari empat"), 0.5), () => text(ctx, "3 anak selalu jujur", 820, 230, 50, { align: "center", weight: 900, color: GREEN })); alpha(ctx, P(l, at(b, "tepat satu"), 0.5), () => text(ctx, "tepat 1 anak berbohong", 820, 310, 56, { align: "center", weight: 900, color: RED })); }
    if (id === "soal5") alpha(ctx, P(l, 0.2, 0.5), () => { text(ctx, "Siapa yang memecahkan kaca?", 820, 210, 50, { align: "center", weight: 900, color: INK });
      ["A. David", "B. Marko", "C. Maya", "D. Iva"].forEach((s, k) => alpha(ctx, P(l, at(b, ["A David", "B Marko", "C Maya", "D Iva"][k]), 0.4), () => text(ctx, s, 300 + k * 340, 290, 40, { weight: 900, color: C.accentDark }))); });
    if (id === "p1") { const u = P(l, at(b, "tidak mungkin"), 0.6);
      alpha(ctx, u, () => { ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(KX[2] + 20, 330); ctx.lineTo(KX[2] + 120, 290); ctx.lineTo(KX[2] + 220, 330); ctx.lineTo(KX[3] - 20, 290); ctx.stroke(); text(ctx, "tidak mungkin sama-sama benar", KX[2] + 170, 250, 38, { align: "center", weight: 900, color: RED }); }); }
    if (id === "p2" || id === "p3") {
      text(ctx, "pembohong: Maya atau David", KX[2] + 170, 250, 38, { align: "center", weight: 900, color: RED });
      [0, 1].forEach(i => tag(ctx, "JUJUR", KX[i], 245, GREEN, id === "p2" ? P(l, at(b, "Marko dan Iva") + i * 0.3, 0.4) : 1));
    }
    if (id === "p3") {
      cross(ctx, KX[0], KY, 150, P(l, at(b, "bukan Marko"), 0.5), RED, 10);
      alpha(ctx, P(l, at(b, "pasti David"), 0.5), () => { ring(ctx, KX[3], KY + 20, 110, 150, 1, GREEN, 7); });
      mline(ctx, [[KX[1] + 100, 520], [KX[2], 560], [KX[3] - 110, 600]], P(l, at(b, "Karena bukan"), 0.8), GREEN, 7, true);
      hand(ctx, "pelaku: David", 1690, 600, 46, { color: GREEN, alpha: P(l, at(b, "pasti David"), 0.5) });
    }
  }

  // ---------- adegan tabel ----------
  const ROWS = ["Marko", "Maya", "Iva", "David"], CXS = [560, 830, 1100, 1370], NX = 1580, VX = 1760, RY = r => 357 + r * 115;
  function tabel(ctx, b, l) {
    board(ctx);
    const id = b.id, order = ["m1", "m2", "m3", "m4", "m5", "j1", "j2", "j3", "c2", "c3"], n = order.indexOf(id), from = k => n >= order.indexOf(k);
    const dimAll = id === "c2" || id === "c3" ? 0.22 : 1;
    alpha(ctx, dimAll, () => {
      text(ctx, "Kalau pelakunya …", 235, 215, 32, { align: "center", weight: 900, color: INK });
      ANAK.forEach((a, k) => { text(ctx, a, CXS[k], 185, 32, { align: "center", weight: 900, color: NCOL[a] }); SINGKAT[a].forEach((s, j) => text(ctx, "“" + s.replace(/^/, "") + (j === SINGKAT[a].length - 1 ? "”" : ""), CXS[k], 230 + j * 32, 28, { align: "center", weight: 700, color: C.ink2 })); });
      text(ctx, "pembohong", NX, 215, 30, { align: "center", weight: 900, color: INK });
      ctx.strokeStyle = "#CBD3D9"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, 297); ctx.lineTo(1840, 297); ctx.stroke();
      [410, 695, 965, 1235, 1505, 1665].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 150); ctx.lineTo(x, 760); ctx.stroke(); });
      ROWS.forEach((c, r) => {
        const y = RY(r);
        // waktu isi per baris
        let t0 = 1e9;
        if (r === 0) t0 = id === "m2" ? at(b, "Pernyataan Marko") : (from("m3") ? -9 : 1e9);
        if (r === 1) t0 = id === "j1" ? at(b, "Kalau Maya") : (from("j2") ? -9 : 1e9);
        if (r === 2) t0 = id === "j1" ? at(b, "Kalau Iva") : (from("j2") ? -9 : 1e9);
        if (r === 3) t0 = id === "j2" ? at(b, "Kalau David") : (from("j3") ? -9 : 1e9);
        const hl = (r === 3 && (id === "j2" ? P(l, at(b, "cocok"), 0.4) : from("j3") ? 1 : 0));
        if (hl > 0) alpha(ctx, hl, () => { ctx.fillStyle = "rgba(46,170,90,0.15)"; rr(ctx, 84, y - 52, 1752, 104, 12); ctx.fill(); });
        text(ctx, c, 235, y + 12, 38, { align: "center", weight: 900, color: NCOL[c] });
        const v = nilai(c);
        ANAK.forEach((a, k) => {
          let u = P(l, t0 + k * (r === 0 ? 0 : 0.6), 0.4);
          if (r === 0) { const ph = { Marko: "Pernyataan Marko", Iva: "Pernyataan Iva", Maya: "Pernyataan Maya" }[a]; u = id === "m2" ? (ph ? P(l, at(b, ph) + 1.2, 0.4) : 0) : id === "m3" ? (a === "David" ? P(l, at(b, "Jadi, pernyataan David"), 0.4) : 1) : (from("m4") ? 1 : 0); }
          if (v[k]) tick(ctx, CXS[k], y, 54, u, GREEN); else cross(ctx, CXS[k], y, 50, u, RED, 8);
        });
        const tn = r === 0 ? (id === "m4" ? at(b, "Pembohongnya ada dua") : from("m5") ? -9 : 1e9) : t0 + 2.6;
        alpha(ctx, P(l, tn, 0.4), () => text(ctx, String(bohong(c)), NX, y + 18, 56, { align: "center", weight: 900, color: bohong(c) === 1 ? GREEN : RED }));
        const tv = r === 0 ? (id === "m4" ? at(b, "baris ini") : from("m5") ? -9 : 1e9) : r === 3 ? (id === "j2" ? at(b, "cocok") : from("j3") ? -9 : 1e9) : (id === "j1" ? at(b, "keduanya dicoret") : from("j2") ? -9 : 1e9);
        const uv = P(l, tv, 0.6);
        if (bohong(c) === 1) tick(ctx, VX, y, 60, uv, GREEN); else { cross(ctx, VX, y, 54, uv, RED, 8); mline(ctx, [[110, y], [1490, y]], uv, "rgba(214,40,40,0.55)", 5); }
      });
      if (from("m1") && id !== "c2" && id !== "c3" && id !== "j3") alpha(ctx, id === "m1" ? P(l, at(b, "benar atau salah"), 0.5) : 1, () => {
        tick(ctx, 520, 795, 34, 1, GREEN); text(ctx, "= benar", 548, 806, 30, { weight: 800, color: INK }); cross(ctx, 790, 795, 30, 1, RED, 6); text(ctx, "= bohong", 818, 806, 30, { weight: 800, color: INK });
        text(ctx, "aturan: pembohong tepat 1", 1100, 806, 30, { weight: 900, color: ORANGE }); });
    });
    if (id === "m2") ring(ctx, 235, RY(0), 120, 48, P(l, at(b, "anggap Marko"), 0.5), ORANGE, 5);
    if (id === "m3") alpha(ctx, P(l, 0.2, 0.5), () => {
      card(ctx, 640, 420, 760, 300, { fill: "#FFFDF7", stroke: NCOL.David, lw: 4, r: 20 });
      text(ctx, "Pernyataan David (kalau pelakunya Marko)", 1020, 470, 30, { align: "center", weight: 900, color: NCOL.David });
      [["“bukan saya”", "Bagian pertama"], ["“Maya bohong”", "Bagian kedua"]].forEach(([s, ph], k) => alpha(ctx, P(l, at(b, ph), 0.4), () => { text(ctx, s, 700, 545 + k * 64, 34, { weight: 800, color: INK }); text(ctx, "benar", 1110, 545 + k * 64, 34, { weight: 900, color: GREEN }); tick(ctx, 1250, 533 + k * 64, 36, 1, GREEN); }));
      alpha(ctx, P(l, at(b, "Jadi, pernyataan David"), 0.4), () => text(ctx, "benar DAN benar → benar", 1020, 685, 36, { align: "center", weight: 900, color: GREEN }));
    });
    if (id === "m5") thinkBadge(ctx, 440, 440, 1050, 150, l, b.hold + 2, "Baris mana yang pembohongnya tepat 1?");
    if (id === "j3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, 1240, 772, 600, 56, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 14 }); text(ctx, "Jawaban: A. David", 1540, 812, 36, { align: "center", weight: 900, color: GREEN }); });
    if (id === "c2") {
      [["benar", "1", "true", GREEN], ["salah", "0", "false", RED]].forEach(([w, d, e, col], k) => alpha(ctx, P(l, at(b, "benar atau salah") + k * 0.4, 0.5), () => {
        card(ctx, 360 + k * 620, 300, 560, 220, { fill: "#FFFFFF", stroke: col, lw: 5, r: 24 }); text(ctx, w, 640 + k * 620, 390, 64, { align: "center", weight: 900, color: col }); text(ctx, d + "  ·  " + e, 640 + k * 620, 470, 44, { align: "center", weight: 800, color: INK }); }));
      hand(ctx, "nilai logika = boolean", 960, 640, 64, { color: ORANGE, alpha: P(l, at(b, "boolean"), 0.5) });
    }
    if (id === "c3") {
      [["brute force", "coba semua kemungkinan", "4 baris diperiksa", "brute force"], ["jalan pintas", "pakai penalaran", "2 langkah", "Jalan pintas"]].forEach(([h1, h2, h3, ph], k) => alpha(ctx, P(l, at(b, ph), 0.5), () => {
        card(ctx, 260 + k * 720, 260, 640, 380, { fill: "#FFFFFF", stroke: k ? GREEN : ORANGE, lw: 5, r: 24 });
        text(ctx, h1, 580 + k * 720, 360, 60, { align: "center", weight: 900, color: k ? GREEN : ORANGE }); text(ctx, h2, 580 + k * 720, 450, 38, { align: "center", weight: 800, color: INK }); text(ctx, h3, 580 + k * 720, 540, 38, { align: "center", weight: 700, color: C.ink2 }); }));
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function kelas_v(ctx, b, l) {
    board(ctx);
    const id = b.id, XV = [585, 835, 1085, 1335];
    ANAK.forEach((a, k) => alpha(ctx, id === "h0" ? P(l, at(b, a + " berkata"), 0.4) : 1, () => {
      const y = 205 + k * 82; text(ctx, a + ":", 500, y, 38, { weight: 900, color: NCOL[a] }); text(ctx, "“" + KATA[a].replace(" yang memecahkan kaca", "") + "”", 660, y, 36, { weight: 700, color: INK, fit: 680 }); }));
    alpha(ctx, id === "h0" ? P(l, at(b, "tepat satu"), 0.4) : 1, () => text(ctx, "tepat 1 anak berbohong", 960, 520, 40, { align: "center", weight: 900, color: RED }));
    ANAK.forEach((a, k) => { kid(ctx, XV[k], 660, 80, HAIR[a]); text(ctx, a, XV[k], 575, 30, { align: "center", weight: 900, color: NCOL[a] }); });
    if (id === "h1") thinkBadge(ctx, 610, 758, 700, 66, l, b.hold + 2, "");
    if (id === "h2" || id === "h3") {
      const u = id === "h2" ? P(l, at(b, "tidak mungkin"), 0.5) : 1;
      alpha(ctx, u, () => { ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(480, 350); ctx.lineTo(466, 350); ctx.lineTo(466, 440); ctx.lineTo(480, 440); ctx.stroke(); });
      const u2 = id === "h2" ? P(l, at(b, "pasti jujur"), 0.5) : 1;
      [0, 1].forEach(k => tag(ctx, "JUJUR", 1360, 195 + k * 82, GREEN, u2));
    }
    if (id === "h3") { cross(ctx, XV[0], 660, 110, P(l, at(b, "bukan Marko"), 0.5), RED, 9); ring(ctx, XV[3], 670, 80, 110, P(l, at(b, "adalah David"), 0.6), GREEN, 6);
      alpha(ctx, P(l, at(b, "adalah David"), 0.5), () => text(ctx, "Pelaku: David", 960, 812, 46, { align: "center", weight: 900, color: GREEN })); }
  }

  Object.assign(K.SCENES, B.umum(META), { kelas, tabel, kelas_v });
})(typeof window !== "undefined" ? window : globalThis);
