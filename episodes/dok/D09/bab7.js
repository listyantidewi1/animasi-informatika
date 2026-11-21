/* D09 bab 7 — Penutup (b7_1 … b7_99): titik celah 2021–2026 yang makin rapat, AI di dua sisi, AI membantu menutup jendela,
   tantangan php -v + composer audit + kartu komentar, berkas ditutup dengan ?>, catatan AI, layar akhir. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d09, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080, TAU = U.TAU;
  const S = {};
  const PTS = (() => { const r = D.rng(3), a = []; for (let i = 0; i < 40; i++) a.push(Math.pow(r(), 0.35)); return a.sort(); })();

  S.b7_1 = function (ctx, b, l, t) {
    const tKec = U.at(b, "Yang berubah"), x0 = 200, x1 = 1720, y = 520;
    U.garisWaktu(ctx, x0, x1, y, 1);
    ["2021", "2022", "2023", "2024", "2025", "2026"].forEach((s, i) => T(ctx, s, lerp(x0, x1, i / 5), y + 80, 40, { align: "center", weight: 700, color: C.text2 }));
    const rap = eio(ramp(l, tKec, 1.4));
    PTS.forEach((p, i) => { const even = lerp(0.03, 0.97, i / 39), u = lerp(even, p, rap), yy = y - 60 - ((i * 37) % 5) * 34;
      ctx.fillStyle = C.red; X.glow(ctx, lerp(x0, x1, u), yy, 20, C.red, 0.5); ctx.beginPath(); ctx.arc(lerp(x0, x1, u), yy, 8, 0, TAU); ctx.fill(); });
    U.judul(ctx, "Celah keamanan selalu ada", l, U.at(b, "Celah keamanan") - 0.2, { y: 200 });
    if (l > tKec) U.pill(ctx, "yang berubah: kecepatannya", 960, 800, { size: 52, col: C.amber });
  };

  S.b7_2 = function (ctx, b, l, t) {
    const tPen = U.at(b, "dan AI juga");
    ctx.fillStyle = U.rgba(C.term, 0.05); ctx.fillRect(0, 0, 960, HH); ctx.fillStyle = U.rgba(C.red, 0.06); ctx.fillRect(960, 0, 960, HH);
    ctx.fillStyle = C.line; ctx.fillRect(958, 140, 4, 800);
    U.muncul(ctx, l, 0.2, 480, 480, () => { U.perisai(ctx, 480, 420, 280, C.term, { glow: 0.4 }); U.ai(ctx, 480, 700, 140, C.php); T(ctx, "peneliti", 480, 860, 56, { align: "center", weight: 900, color: C.term }); });
    U.muncul(ctx, l, tPen, 1440, 480, () => { X.glow(ctx, 1440, 420, 200, C.red, 0.8); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(1440, 420, 60, 0, TAU); ctx.fill(); U.ai(ctx, 1440, 700, 140, C.php); T(ctx, "penyerang", 1440, 860, 56, { align: "center", weight: 900, color: C.red }); });
    if (l > tPen + 0.8) U.pill(ctx, "AI yang sama", 960, 180, { size: 44, col: C.php });
  };

  S.b7_3 = function (ctx, b, l, t) {
    const tMen = U.at(b, "Pemenangnya"), close = eio(ramp(l, tMen, 2.2)), gap = lerp(0.8, 0.0, close);
    const j = X.jendelaPatch(ctx, 200, 1660, 470, { gap, dots: [], label: close > 0.95 ? "JENDELA TERTUTUP" : "JENDELA PATCH", noLabels: close > 0.4 });
    const tasks = [["membaca pengumuman", U.at(b, "membaca pengumuman")], ["memeriksa versi", U.at(b, "memeriksa versi")], ["menulis tes", U.at(b, "menulis tes")]];
    tasks.forEach(([s, t0], i) => { if (l > t0 - 0.2) U.pill(ctx, s, 420 + i * 540, 860, { size: 40, col: C.term }); });
    const ax = lerp(1780, j.b + 100, eio(ramp(l, 0.3, 1))); U.ai(ctx, ax, 470, 130, C.term, { glow: 0.5 });
    if (close > 0.95) { X.glow(ctx, j.b, 470, 220, C.term, 0.5 * (1 - ramp(l, tMen + 2.4, 1))); U.centang(ctx, j.b + 260, 470, 90, ramp(l, tMen + 2.2, 0.4)); }
  };

  S.b7_4 = function (ctx, b, l, t) {
    const tPhp = U.at(b, "php spasi"), tCo = U.at(b, "composer spasi"), tKom = U.at(b, "kolom komentar"), tVer = U.at(b, "Versi PHP berapa");
    U.judul(ctx, "Giliranmu hari ini", l, 0.1, { y: 150, col: C.amber });
    U.termKetik(ctx, 160, 210, 1000, 520, [{ cmd: "php -v", t0: tPhp, cps: 8, out: [{ t: "PHP 8.3.?? (cli)", color: C.amber }] }, { cmd: "composer audit", t0: tCo, cps: 12, out: [] }], l, { size: 44, contoh: false });
    U.geser(ctx, l, tKom - 0.2, 300, 0, () => { const x = 1220, y = 320; U.kotak(ctx, x, y, 600, 300, "", { col: C.text2 });
      ctx.fillStyle = C.php2; ctx.beginPath(); ctx.arc(x + 70, y + 80, 36, 0, TAU); ctx.fill(); T(ctx, "kamu", x + 130, y + 92, 40, { weight: 800 });
      T(ctx, "PHP 8.3.?? di laptopku", x + 40, y + 180, 44, { weight: 700 }); T(ctx, "Balas · Suka", x + 40, y + 250, 32, { weight: 600, color: C.dim }); });
    if (l > tVer) U.pill(ctx, "tulis hasilnya di kolom komentar", 960, 830, { size: 44, col: C.amber });
  };

  S.b7_5 = function (ctx, b, l, t) {
    const f = X.windowFrame(ctx, 260, 220, 1400, 560, { tab: "bab-7.php" });
    const lines = ["<?php", "// terima kasih sudah menonton", "", U.ketik("?>", l, 0.6, 3)];
    X.code(ctx, f.x + 70, f.y + 110, lines, { size: 48, lh: 84, nums: true });
    if (Math.floor(t * 2) % 2 === 0 && l > 0.3) { ctx.font = `500 48px ${X.MONO}`; const cw = ctx.measureText("M").width; ctx.fillStyle = C.term; ctx.fillRect(f.x + 70 + U.ketik("?>", l, 0.6, 3).length * cw + 2, f.y + 110 + 3 * 84 - 42, 5, 54); }
  };

  const SUB = { x: 440, y: 300, r: 118 }, SLOT = { x: 1060, y: 236, w: 760, h: 428 };
  S.b7_99 = function (ctx, b, l, t) {
    const tAI = U.at(b, "bantuan AI"), tCl = U.at(b, "Claude"), tF = U.at(b, "diperiksa faktanya"), tS = U.at(b, "disunting"), tD = U.at(b, "Semua sumber"), tEnd = D.speechEnd(b) + 1.0;
    const ca = eout(ramp(l, 0.2, 0.6)) * (1 - ramp(l, tEnd, 0.6));
    if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; U.kotak(ctx, 360, 170, 1200, 660, "", { col: C.php, fill: "rgba(18,17,21,0.96)" });
      T(ctx, "// catatan tentang naskah", 960, 270, 52, { align: "center", mono: true, weight: 700, color: C.php });
      [[tAI, "disusun dengan bantuan AI", 390], [tF, "diperiksa faktanya", 530], [tS, "disunting oleh manusia", 630], [tD, "semua sumber ada di deskripsi", 730]].forEach(([t0, s, y], i) => { const a = ramp(l, t0 - 0.2, 0.4);
        ctx.save(); ctx.globalAlpha *= 0.3 + 0.7 * a; U.centang(ctx, 470, y - 16, 40, a, C.term); T(ctx, s, 530, y, 50, { weight: 800 });
        if (i === 0) { ctx.globalAlpha *= ramp(l, tCl - 0.1, 0.4); T(ctx, "termasuk Claude buatan Anthropic", 530, y + 58, 40, { weight: 600, color: C.text2 }); } ctx.restore(); });
      ctx.restore(); }
    const ea = eout(ramp(l, tEnd + 0.4, 0.8)); if (ea <= 0) return;
    ctx.save(); ctx.globalAlpha *= ea; ctx.translate(0, (1 - ea) * 30);
    X.glow(ctx, SUB.x, SUB.y, SUB.r * 2, C.php, 0.3 + 0.1 * Math.sin(t * 2));
    ctx.fillStyle = C.win; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r, 0, TAU); ctx.fill(); ctx.strokeStyle = C.php; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = C.panel; U.rr(ctx, SUB.x - 320, SUB.y + SUB.r + 22, 640, 154, 34); ctx.fill();
    T(ctx, "I Teach", SUB.x, SUB.y + SUB.r + 76, 56, { align: "center", weight: 900, color: C.amber }); T(ctx, "Software Engineering", SUB.x, SUB.y + SUB.r + 142, 52, { align: "center", weight: 900, color: C.white });
    U.kotak(ctx, SLOT.x, SLOT.y, SLOT.w, SLOT.h, "", { col: C.php, fill: "rgba(18,17,21,0.7)" }); T(ctx, "VIDEO BERIKUTNYA", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h / 2 + 20, 60, { align: "center", weight: 900, color: C.php });
    ctx.restore();
    if (l > tEnd + 1.2) U.pill(ctx, "youtube.com/@iTeachSWE", SUB.x, SUB.y + SUB.r + 250, { size: 44, col: C.php });
    if (l > tEnd + 1.6) U.pill(ctx, "sumber lengkap ada di deskripsi", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h + 90, { size: 40, col: C.text2 });
    if (l > tEnd + 2) T(ctx, "?>", W / 2, 900, 64, { align: "center", mono: true, weight: 700, color: C.php });
  };
  S.b7_99.noCam = true;

  U.reg(7, S);
})(typeof window !== "undefined" ? window : globalThis);
