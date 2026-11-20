/* ON08 Bebek Gayung (OSN-K 2025 SMA no. 23–25): bilangan yang bisa disusun dari dua ukuran (masalah koin / Frobenius), trik tangga sisa bagi.
   Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, para, panel, label, chip, check, cross, arrow, clamp, ap, at, speechEnd } = H;
  const { fadeIn, bigNote, note, heading } = U;
  const WATER = "#5FA8C8", WATER_BG = "#DCEEF4";

  /* gayung: x,y = pusat bibir, s = skala, liter = label */
  function gayung(ctx, x, y, liter, s = 1, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const col = o.color || C.green;
    // gagang
    ctx.strokeStyle = C.ink; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(70, 20); ctx.lineTo(170, -40); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(72, 18); ctx.lineTo(168, -38); ctx.stroke();
    // badan
    ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(80, 0); ctx.lineTo(62, 120); ctx.quadraticCurveTo(0, 136, -62, 120); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
    if (o.water) { ctx.save(); ctx.clip(); ctx.fillStyle = WATER; ctx.globalAlpha = 0.85; ctx.fillRect(-90, 14, 180, 130); ctx.restore(); }
    ctx.beginPath(); ctx.ellipse(0, 0, 80, 14, 0, 0, Math.PI * 2); ctx.fillStyle = o.water ? WATER : "#EDE3CB"; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
    text(ctx, liter, 0, 86, 46, { mono: true, weight: 800, align: "center", color: C.white });
    ctx.restore();
  }
  /* bebek orisinal: x,y = pusat badan, s = skala, n = nomor */
  function bebek(ctx, x, y, n, s = 1, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha === undefined ? 1 : o.alpha;
    const body = o.sad ? "#E9E2D0" : "#F6D24A", rim = o.sad ? C.mut : "#B48A1E";
    ctx.beginPath(); ctx.ellipse(0, 10, 58, 40, 0, 0, Math.PI * 2); ctx.fillStyle = body; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = rim; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(-80, -18); ctx.lineTo(-52, -12); ctx.closePath(); ctx.fillStyle = body; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(36, -34, 28, 0, Math.PI * 2); ctx.fillStyle = body; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(60, -38); ctx.lineTo(86, -30); ctx.lineTo(60, -24); ctx.closePath(); ctx.fillStyle = "#E07A2E"; ctx.fill();
    ctx.beginPath(); ctx.arc(42, -40, 4.5, 0, Math.PI * 2); ctx.fillStyle = C.ink; ctx.fill();
    if (n !== undefined && n !== null) text(ctx, String(n), -6, 26, String(n).length > 2 ? 30 : 38, { mono: true, weight: 800, align: "center", color: C.ink });
    ctx.restore();
    if (o.ok > 0) { ctx.save(); ctx.globalAlpha *= o.ok; check(ctx, x + 60 * s, y - 70 * s, 26 * s, C.green); ctx.restore(); }
    if (o.no > 0) cross(ctx, x + 60 * s, y - 70 * s, 24 * s, C.red, o.no);
  }
  function tetes(ctx, parts, x, y, size, u, o = {}) {   // "3 + 5 + 5 = 13"
    fadeIn(ctx, u, () => text(ctx, parts, x, y, size, { mono: true, weight: 800, align: o.align || "center", color: o.color || C.ink }));
  }
  const Tw = (b, w) => at(b, w[0], w[1] || 1);

  /* tangga: 3 kolom sisa bagi 3; o.rows: daftar r (null = ⋮); n = 3r + c (c = 0,1,2; baris r=0 kolom 0 kosong) */
  function tangga(ctx, o) {
    const cols = [0, 1, 2], X0 = o.x || 560, CW = o.cw || 190, Y0 = o.y || 150, RH = o.rh || 62;
    cols.forEach(c => fadeIn(ctx, o.head ? o.head(c) : 1, () => {
      const x = X0 + c * CW; panel(ctx, x - CW / 2 + 8, Y0, CW - 16, 52, { stroke: C.green, lw: 2 });
      text(ctx, "sisa " + c, x, Y0 + 36, 28, { mono: true, weight: 800, align: "center", color: C.green });
    }));
    o.rows.forEach((r, i) => {
      const y = Y0 + 64 + i * RH;
      cols.forEach(c => {
        const x = X0 + c * CW;
        if (r === null) { if (c === 1) text(ctx, "⋮", x, y + RH / 2 + 14, 40, { weight: 800, align: "center", color: C.mut }); return; }
        const n = 3 * r + c; if (n === 0 || (o.max && n > o.max)) return;
        const ua = o.show ? o.show(n, c, i) : 1; if (ua <= 0) return;
        ctx.save(); ctx.globalAlpha *= ua;
        const okA = o.good ? o.good(c) : 0, badA = o.bad ? o.bad(c) : 0, isOk = n >= o.first[c];
        let fill = C.panel, stroke = C.line, tc = C.ink;
        if (isOk && okA > 0) { fill = C.greenBg; stroke = C.green; tc = C.green; }
        if (!isOk && badA > 0) { fill = C.redBg; stroke = C.red; tc = C.red; }
        rr(ctx, x - CW / 2 + 14, y + 4, CW - 28, RH - 8, 10); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke();
        text(ctx, String(n), x, y + RH / 2 + 12, 34, { mono: true, weight: 800, align: "center", color: tc });
        const st = o.star ? o.star(c) : 0;
        if (n === o.first[c] && st > 0) { ctx.globalAlpha *= st; ctx.lineWidth = 6; ctx.strokeStyle = C.goldRim; rr(ctx, x - CW / 2 + 6, y - 2, CW - 12, RH + 4, 14); ctx.stroke(); }
        ctx.restore();
      });
    });
  }
  const SPEC = {
    a4: { first: [3, 10, 5], rows: [0, 1, 2, 3, 4, 5, 6], max: 20 },
    a5: { first: [3, 10, 5], rows: [0, 1, 2, 3, 4, 5, 6], max: 20 },
    a6: { first: [3, 10, 5], rows: [0, 1, 2, 3, 4, 5, 6], max: 20 },
    b6: { first: [3, 7, 14], rows: [0, 1, 2, 3, 4, 5], max: 17 },
    c3: { first: [3, 100, 200], rows: [0, 1, 2, null, 32, 33, 34, null, 65, 66, 67], rh: 52 },
    c4: { first: [3, 100, 200], rows: [0, 1, 2, null, 32, 33, 34, null, 65, 66, 67], rh: 52 },
    c5: { first: [3, 100, 200], rows: [0, 1, 2, null, 32, 33, 34, null, 65, 66, 67], rh: 52 },
    c6: { first: [3, 100, 200], rows: [0, 1, 2, null, 32, 33, 34, null, 65, 66, 67], rh: 52 }
  };
  function side(ctx, lines, l, b, x = 1260, y = 220) {   // catatan di kanan tangga
    lines.forEach(([s, w, col, size], i) => fadeIn(ctx, ap(l, Tw(b, w) - 0.3), () => text(ctx, s, x, y + i * 70, size || 36, { weight: 800, color: col || C.ink, fit: 600 })));
  }

  Kiko.ON08 = { gayung, bebek };
  Object.assign(Kiko.SCENES, {
    gayung(ctx, b, l) {
      const m = b.mode;
      if (m === "kait") {
        const tG = at(b, "gayung"), tT = at(b, "tiga", 2), tB = at(b, "Bisa"), tJ = at(b, "tujuh");
        fadeIn(ctx, ap(l, tG - 0.2), () => { gayung(ctx, 300, 260, "3L", 1); gayung(ctx, 300, 520, "5L", 1.2, { color: C.red }); });
        fadeIn(ctx, ap(l, tT - 0.2), () => { bebek(ctx, 900, 330, 13, 1.6, { ok: ap(l, tB) }); });
        tetes(ctx, "3 + 5 + 5 = 13", 900, 480, 54, ap(l, tB), { color: C.green });
        fadeIn(ctx, ap(l, tJ - 0.2), () => { bebek(ctx, 1450, 330, 7, 1.6, { sad: true, no: ap(l, tJ + 0.3) }); text(ctx, "7 liter? tidak mungkin", 1450, 480, 40, { weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "besar") {
        const tM = at(b, "miliar"), tG = at(b, "gayungnya"), tB = at(b, "berapa"), tT = at(b, "tanpa");
        fadeIn(ctx, ap(l, tM - 0.2), () => { text(ctx, "1.000.000.000.000.000.000", 960, 230, 84, { mono: true, weight: 800, align: "center", fit: 1700 }); text(ctx, "ekor bebek", 960, 300, 40, { weight: 800, align: "center", color: C.mut }); });
        fadeIn(ctx, ap(l, tG - 0.2), () => { gayung(ctx, 700, 420, "3L", 1); gayung(ctx, 1150, 420, "100L", 1.3, { color: C.red }); });
        fadeIn(ctx, ap(l, tB - 0.2), () => text(ctx, "Berapa yang tidak bisa mandi?", 960, 700, 56, { disp: true, weight: 800, align: "center", color: C.red }));
        fadeIn(ctx, ap(l, tT - 0.2), () => chip(ctx, "tanpa memeriksa satu per satu", 960, 730, { size: 30, color: C.white, fill: C.green, stroke: C.green, center: true }));
        return;
      }
      if (m === "bebek") {
        const tN = at(b, "nomor"), tH = at(b, "Mandi");
        for (let i = 0; i < 8; i++) { const u = ap(l, tN - 0.2 + i * 0.12); if (u <= 0) continue; fadeIn(ctx, u, () => bebek(ctx, 260 + i * 200, 360, i < 6 ? i + 1 : i === 6 ? null : "N", 1.15)); }
        fadeIn(ctx, ap(l, tN + 0.8), () => text(ctx, "…", 260 + 6 * 200, 380, 60, { weight: 800, align: "center", color: C.mut }));
        fadeIn(ctx, ap(l, tH - 0.3), () => chip(ctx, "HARI MANDI NASIONAL", 960, 560, { size: 40, color: C.white, fill: WATER, stroke: WATER, center: true, px: 30 }));
        return;
      }
      if (m === "dua") {
        const tX = at(b, "X"), tY = at(b, "Y"), tS = at(b, "setengah");
        fadeIn(ctx, ap(l, tX - 0.3), () => { gayung(ctx, 520, 250, "X", 1.3, { water: true }); text(ctx, "tepat X liter", 560, 520, 40, { weight: 800, align: "center" }); });
        fadeIn(ctx, ap(l, tY - 0.3), () => { gayung(ctx, 1100, 250, "Y", 1.3, { water: true, color: C.red }); text(ctx, "tepat Y liter", 1140, 520, 40, { weight: 800, align: "center" }); });
        fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, 560, 590, 800, 110, { stroke: C.red, lw: 3 }); text(ctx, "½ gayung, ⅓ gayung: tidak boleh", 960, 662, 42, { weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "syarat") {
        const t1 = at(b, "Pertama"), t2 = at(b, "Kedua");
        fadeIn(ctx, ap(l, t1 - 0.2), () => { panel(ctx, 260, 170, 1400, 180, { stroke: C.green, lw: 3 }); text(ctx, "1", 330, 285, 72, { disp: true, weight: 800, align: "center", color: C.green });
          text(ctx, "Air yang diambil langsung dipakai untuk mandi.", 400, 280, 44, { weight: 800, fit: 1220 }); });
        fadeIn(ctx, ap(l, t2 - 0.2), () => { panel(ctx, 260, 400, 1400, 260, { stroke: C.red, lw: 3 }); text(ctx, "2", 330, 520, 72, { disp: true, weight: 800, align: "center", color: C.red });
          text(ctx, "Bebek nomor P mandi dengan tepat P liter.", 400, 490, 44, { weight: 800, fit: 900 }); bebek(ctx, 1450, 540, "P", 1.1); });
        return;
      }
      if (m === "contoh") {
        const tG = at(b, "gayungnya"), tT = at(b, "belas"), tD = at(b, "dua", 2), tE = at(b, "empat");
        fadeIn(ctx, ap(l, tG - 0.2), () => { gayung(ctx, 230, 230, "3L", 0.9); gayung(ctx, 230, 480, "5L", 1.05, { color: C.red }); });
        fadeIn(ctx, ap(l, tT - 0.2), () => { bebek(ctx, 760, 320, 13, 1.5, { ok: ap(l, tD - 0.5) }); });
        tetes(ctx, "3 + 5 + 5 = 13", 760, 470, 50, ap(l, tD - 0.6), { color: C.green });
        fadeIn(ctx, ap(l, tE - 0.6), () => { bebek(ctx, 1240, 320, 2, 1.3, { sad: true, no: ap(l, tE - 0.2) }); bebek(ctx, 1600, 320, 4, 1.3, { sad: true, no: ap(l, tE) }); text(ctx, "tidak bisa", 1420, 470, 44, { weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "tanya") {
        fadeIn(ctx, ap(l, 0.2), () => { panel(ctx, 360, 230, 1200, 300, { stroke: C.red, lw: 4 }); text(ctx, "Ada berapa bebek yang", 960, 350, 60, { disp: true, weight: 800, align: "center" });
          text(ctx, "tidak bisa dimandikan?", 960, 440, 60, { disp: true, weight: 800, align: "center", color: C.red }); });
        return;
      }
      if (m === "soal") {
        const P = { 23: ["20", "3L", "5L"], 24: ["1000", "9L", "21L"], 25: ["10¹⁸", "3L", "100L"] }[b.soal];
        const tN = at(b, b.soal === 25 ? "miliar" : b.soal === 24 ? "seribu" : "dua", b.soal === 23 ? 3 : 1), tG = at(b, "gayungnya"), tB = at(b, b.soal === 25 ? "Benar" : "Berapa");
        fadeIn(ctx, ap(l, tN - 0.3), () => { panel(ctx, 220, 150, 520, 280, { stroke: C.green, lw: 3 }); bebek(ctx, 340, 300, null, 1.2); text(ctx, "N = " + P[0], 600, 315, 50, { mono: true, weight: 800, align: "center", fit: 230 }); });
        fadeIn(ctx, ap(l, tG - 0.3), () => { gayung(ctx, 1000, 220, P[1], 1); gayung(ctx, 1420, 220, P[2], 1.1, { color: C.red }); });
        fadeIn(ctx, ap(l, tB - 0.2), () => { panel(ctx, 260, 520, 1400, 150, { stroke: C.red, lw: 4 });
          text(ctx, b.soal === 25 ? "BENAR/SALAH: yang tidak bisa < 100 ekor?" : "Berapa bebek yang tidak bisa dimandikan?", 960, 615, 48, { weight: 800, align: "center", color: C.red, fit: 1320 }); });
        return;
      }
      if (m === "tambah") {
        const tP = at(b, "P"), tT = at(b, "tiga"), tC = at(b, "Caranya");
        [13, 16, 19, 22].forEach((n, i) => { const u = i === 0 ? ap(l, tP - 0.2) : ap(l, tT - 0.2 + (i - 1) * 0.6); if (u <= 0) return;
          fadeIn(ctx, u, () => { bebek(ctx, 330 + i * 420, 330, n, 1.3, { ok: 1 }); if (i > 0) { arrow(ctx, 330 + (i - 1) * 420 + 110, 400, 330 + i * 420 - 110, 400, { color: C.green, lw: 5 }); chip(ctx, "+3", 330 + (i - 0.5) * 420, 430, { size: 32, color: C.white, fill: C.green, stroke: C.green, center: true }); } }); });
        fadeIn(ctx, ap(l, tC - 0.2), () => { gayung(ctx, 800, 560, "3L", 0.8); text(ctx, "tambah satu gayung 3 liter", 1000, 640, 42, { weight: 800, color: C.green }); });
        return;
      }
      if (m === "kelipatan") {
        const tK = at(b, "kelipatan"), tJ = at(b, "jumlah");
        fadeIn(ctx, ap(l, 0.2), () => { gayung(ctx, 420, 220, "9L", 1); gayung(ctx, 820, 220, "21L", 1.1, { color: C.red }); });
        fadeIn(ctx, ap(l, tK - 0.2), () => { text(ctx, "9 = 3 × 3", 1350, 250, 52, { mono: true, weight: 800 }); text(ctx, "21 = 3 × 7", 1350, 330, 52, { mono: true, weight: 800 }); });
        fadeIn(ctx, ap(l, tJ - 0.2), () => { panel(ctx, 360, 470, 1200, 140, { stroke: C.green, lw: 4 }); text(ctx, "jumlah air selalu kelipatan 3", 960, 560, 52, { weight: 800, align: "center", color: C.green }); });
        return;
      }
      if (m === "hitung667") {
        const tT = at(b, "tiga"), tE = at(b, "enam");
        for (let n = 1; n <= 30; n++) { const x = 250 + ((n - 1) % 15) * 100, y = 200 + Math.floor((n - 1) / 15) * 110; const m3 = n % 3 === 0;
          rr(ctx, x - 40, y, 80, 80, 10); ctx.fillStyle = m3 ? C.greenBg : (l > tE - 0.2 ? C.redBg : C.panel); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = m3 ? C.green : l > tE - 0.2 ? C.red : C.line; ctx.stroke();
          text(ctx, String(n), x, y + 52, 32, { mono: true, weight: 800, align: "center", color: m3 ? C.green : l > tE - 0.2 ? C.red : C.ink }); }
        text(ctx, "… sampai 1000", 960, 470, 34, { weight: 700, align: "center", color: C.mut });
        fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "kelipatan 3: 333 nomor", 560, 580, 46, { weight: 800, align: "center", color: C.green }));
        fadeIn(ctx, ap(l, tE - 0.2), () => text(ctx, "pasti tidak bisa: 1000 − 333 = 667", 1300, 580, 46, { weight: 800, align: "center", color: C.red, fit: 760 }));
        return;
      }
      if (m === "bagi") {
        const tB = at(b, "dibagi"), tT = at(b, "tujuh");
        fadeIn(ctx, ap(l, 0.2), () => { gayung(ctx, 380, 230, "9L", 0.9); gayung(ctx, 380, 500, "21L", 1, { color: C.red }); });
        fadeIn(ctx, ap(l, tB - 0.2), () => { arrow(ctx, 680, 400, 1060, 400, { color: C.green, lw: 8, head: 26 }); text(ctx, "÷ 3", 870, 370, 56, { mono: true, weight: 800, align: "center", color: C.green }); });
        fadeIn(ctx, ap(l, tT - 0.6), () => { gayung(ctx, 1320, 230, "3L", 0.9); gayung(ctx, 1320, 500, "7L", 1, { color: C.red }); text(ctx, "nomor 3k bisa  ⇔  k bisa dengan 3 dan 7", 960, 730, 38, { weight: 800, align: "center", fit: 1500 }); });
        return;
      }
      if (m === "total24") {
        const tK = at(b, "dikali"), tT = at(b, "totalnya");
        const L = [3, 6, 12, 15, 24, 33];
        L.forEach((n, i) => fadeIn(ctx, ap(l, tK + 0.6 + i * 0.5), () => bebek(ctx, 290 + i * 270, 290, n, 1.1, { sad: true, no: 1 })));
        fadeIn(ctx, ap(l, tK - 0.2), () => text(ctx, "1, 2, 4, 5, 8, 11  × 3", 960, 160, 44, { mono: true, weight: 800, align: "center", color: C.mut }));
        fadeIn(ctx, ap(l, tT - 0.2), () => { panel(ctx, 460, 470, 1000, 150, { stroke: C.red, lw: 5 }); text(ctx, "667 + 6 = 673", 960, 575, 76, { mono: true, weight: 800, align: "center", color: C.red }); });
        return;
      }
    },
    tangga(ctx, b, l) {
      const id = b.spec, S = SPEC[id];
      const o = { first: S.first, rows: S.rows, max: S.max, rh: S.rh, x: 520, y: S.rh ? 110 : 140 };
      if (id === "a4") {
        const tT = at(b, "tiga"), tK = at(b, "terkecil");
        o.head = c => ap(l, tT - 0.2 + c * 0.2); o.show = (n) => ap(l, 0.2 + n * 0.08);
        tangga(ctx, o);
        side(ctx, [["Tulis 1 sampai 20", ["tulis"], C.mut], ["dalam 3 kolom", ["kolom"], C.ink], ["cari yang terkecil", ["terkecil"], C.goldInk]], l, b);
        return;
      }
      if (id === "a5") {
        const tN = at(b, "nol"), tS = at(b, "sepuluh"), tL = at(b, "lima", 2);
        o.good = c => c === 0 ? ap(l, tN + 0.6) : c === 1 ? ap(l, tS + 0.8) : ap(l, tL + 0.5); o.star = c => c === 1 ? ap(l, tS - 0.2) : c === 2 ? ap(l, tL - 0.2) : 0;
        tangga(ctx, o);
        side(ctx, [["sisa 0: semua bisa", ["nol"], C.green], ["sisa 1: mulai 10 = 5 + 5", ["sepuluh"], C.goldInk], ["sisa 2: mulai 5", ["lima", 2], C.goldInk], ["ke bawah: +3, pasti bisa", ["lima", 2], C.green, 30]], l, b);
        return;
      }
      if (id === "a6") {
        const tY = at(b, "tidak"), tJ = at(b, "Jawaban");
        o.good = () => 1; o.star = c => c > 0 ? 1 : 0; o.bad = c => ap(l, tY - 0.2 + c * 0.3);
        tangga(ctx, o);
        side(ctx, [["tidak bisa: 1, 4, 7, 2", ["tidak"], C.red]], l, b);
        fadeIn(ctx, ap(l, tJ - 0.2), () => chip(ctx, "JAWABAN: 4", 1460, 400, { size: 44, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
      if (id === "b6") {
        const tT = at(b, "tujuh"), tE = at(b, "empat"), tY = at(b, "tidak");
        o.good = c => c === 0 ? 1 : c === 1 ? ap(l, tT + 0.4) : ap(l, tE + 0.6); o.star = c => c === 1 ? ap(l, tT - 0.2) : c === 2 ? ap(l, tE - 0.2) : 0; o.bad = c => ap(l, tY - 0.2);
        tangga(ctx, o);
        fadeIn(ctx, ap(l, 0.2), () => { gayung(ctx, 1380, 190, "3L", 0.6); gayung(ctx, 1650, 190, "7L", 0.65, { color: C.red }); });
        side(ctx, [["sisa 1: mulai 7", ["tujuh"], C.goldInk], ["sisa 2: mulai 14 = 7 + 7", ["empat"], C.goldInk], ["tidak bisa: 6 nomor", ["tidak"], C.red]], l, b, 1260, 380);
        return;
      }
      // soal 25: 3 dan 100
      const tN = id === "c3" ? at(b, "nol") : 0;
      const t100 = id === "c4" ? at(b, "seratus") : -1, t33 = id === "c4" ? at(b, "tiga", 2) : -1;
      const t200 = id === "c5" ? at(b, "ratus") : -1, t66 = id === "c5" ? at(b, "enam") : -1;
      o.good = c => c === 0 ? (id === "c3" ? ap(l, tN + 0.3) : 1) : c === 1 ? (id === "c4" ? ap(l, t100 + 0.5) : id === "c3" ? 0 : 1) : (id === "c5" ? ap(l, t200 + 0.5) : id === "c6" ? 1 : 0);
      o.star = c => c === 1 ? (id === "c4" ? ap(l, t100 - 0.2) : id === "c3" ? 0 : 1) : c === 2 ? (id === "c5" ? ap(l, t200 - 0.2) : id === "c6" ? 1 : 0) : 0;
      o.bad = c => c === 1 ? (id === "c4" ? ap(l, t33 - 1.5) : id === "c3" ? 0 : 1) : c === 2 ? (id === "c5" ? ap(l, t66 - 1.5) : id === "c6" ? 1 : 0) : 0;
      tangga(ctx, o);
      if (id !== "c6") fadeIn(ctx, ap(l, 0.1), () => { gayung(ctx, 1380, 170, "3L", 0.55); gayung(ctx, 1660, 170, "100L", 0.6, { color: C.red }); });
      const lines = [];
      if (id !== "c3") lines.push(["sisa 1: mulai 100", id === "c4" ? ["seratus"] : ["Totalnya"], C.goldInk], ["1, 4, …, 97 → 33 nomor", id === "c4" ? ["tiga", 2] : ["Totalnya"], C.red]);
      if (id === "c5" || id === "c6") lines.push(["sisa 2: mulai 200", id === "c5" ? ["ratus"] : ["Totalnya"], C.goldInk], ["2, 5, …, 197 → 66 nomor", id === "c5" ? ["enam"] : ["Totalnya"], C.red]);
      if (id === "c3") lines.push(["sisa 0: semua bisa", ["nol"], C.green]);
      side(ctx, lines, l, b, 1260, 340);
      if (id === "c6") {
        const tS = at(b, "sembilan"), tB = at(b, "BENAR"), tA = at(b, "atas");
        fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, 1240, 590, 620, 100, { stroke: C.red, lw: 4 }); text(ctx, "33 + 66 = 99 < 100", 1550, 658, 44, { mono: true, weight: 800, align: "center", color: C.red }); });
        fadeIn(ctx, ap(l, tA - 0.2), () => text(ctx, "> 197: semua bisa", 1550, 735, 32, { weight: 800, align: "center", color: C.green }));
        fadeIn(ctx, ap(l, tB - 0.2), () => chip(ctx, "JAWABAN: BENAR", 1550, 170, { size: 44, color: C.white, fill: C.red, stroke: C.red, center: true }));
      }
    },
    kait_judul(ctx, b, l) {
      const tT = at(b, "tangga");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "Gayung 3 Liter dan 5 Liter", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Bebek Mana yang Tidak Bisa Mandi?", 960, 400, 72, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2025 · SMA · No. 23, 24, 25 · Bebek Gayung", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tT - 0.3), () => chip(ctx, "trik tangga sisa bagi", 960, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
    },
    konsep_koin(ctx, b, l) {
      const tK = at(b, "koin"), tF = at(b, "Frobenius"), tP = at(b, "Pertanyaannya");
      heading(ctx, "// KONSEP", "Masalah koin (Frobenius)", 1, 150);
      fadeIn(ctx, ap(l, tK - 0.2), () => { [3, 5].forEach((v, i) => { const x = 620 + i * 220; H.coin(ctx, x, 380, 80, String(v)); }); text(ctx, "koin 3 dan 5", 730, 520, 36, { weight: 800, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tF - 0.2), () => { gayung(ctx, 1240, 330, "3L", 0.8); gayung(ctx, 1480, 330, "5L", 0.85, { color: C.red }); text(ctx, "gayung 3 dan 5", 1380, 520, 36, { weight: 800, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tP - 0.2), () => text(ctx, "Bilangan apa saja yang bisa disusun?", 960, 650, 52, { disp: true, weight: 800, align: "center", color: C.red }));
    },
    konsep_fpb(ctx, b, l) {
      const tS = at(b, "sembilan"), tS2 = at(b, "FPB", 2);
      heading(ctx, "// KONSEP", "Peran FPB", 1, 150);
      fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, 220, 280, 700, 340, { stroke: C.red, lw: 3 }); text(ctx, "FPB(9, 21) = 3", 570, 380, 48, { mono: true, weight: 800, align: "center" });
        text(ctx, "hanya kelipatan 3", 570, 460, 38, { weight: 800, align: "center", color: C.red }); text(ctx, "tak terhingga yang tidak bisa", 570, 530, 30, { weight: 700, align: "center", color: C.mut }); });
      fadeIn(ctx, ap(l, tS2 - 0.2), () => { panel(ctx, 1000, 280, 700, 340, { stroke: C.green, lw: 3 }); text(ctx, "FPB(3, 100) = 1", 1350, 380, 48, { mono: true, weight: 800, align: "center" });
        text(ctx, "hampir semua bisa", 1350, 460, 38, { weight: 800, align: "center", color: C.green }); text(ctx, "yang tidak bisa: sedikit", 1350, 530, 30, { weight: 700, align: "center", color: C.mut }); });
    },
    konsep_rumus(ctx, b, l) {
      const tX = at(b, "kurang"), tT = at(b, "seratus"), tS = at(b, "sama");
      heading(ctx, "// KONSEP", "Rumus singkat (FPB = 1)", 1, 150);
      fadeIn(ctx, ap(l, tX - 0.3), () => { panel(ctx, 360, 260, 1200, 170, { stroke: C.red, lw: 4 }); text(ctx, "banyak yang tidak bisa = (X − 1)(Y − 1) / 2", 960, 365, 50, { mono: true, weight: 800, align: "center", fit: 1120 }); });
      fadeIn(ctx, ap(l, tT - 0.2), () => text(ctx, "X = 3, Y = 100:  2 × 99 / 2 = 99", 960, 530, 48, { mono: true, weight: 800, align: "center", color: C.green }));
      fadeIn(ctx, ap(l, tS - 0.2), () => text(ctx, "X = 3, Y = 5:  2 × 4 / 2 = 4 ✓", 960, 620, 40, { mono: true, weight: 800, align: "center", color: C.mut }));
    }
  });
})();
