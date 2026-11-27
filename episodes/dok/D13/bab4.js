/* D13 bab 4 — Petunjuk 2: baris Co-Authored-By di tengah log. Potongan log asli (t6.4), sorotan baris, contoh git log
   generik di Terminal, (opsional) kutipan README proyek, analogi speedometer yang menampilkan nama montir. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = Math.PI * 2;
  const SRC = [0, 30, 940, 520], CA = [3, 9, 14];
  const log = (ctx, o) => Z.logAsli(ctx, "log6.4", SRC, 110, 250, 1000, o);

  S.b4_1 = function (ctx, b, l, t) {
    const tLog = D.at(b, "disebut log"), tBuk = D.at(b, "buku harian");
    U.ruang(ctx, t, { col: N.cyan });
    const p = U.pop(l, 0.1); log(ctx, { a: p.a, col: N.cyan });
    const q = U.pop(l, tLog - 0.2); if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; U.panel(ctx, 1170, 250, 640, 553, { col: N.gold });
      I.buku(ctx, 1490, 400, 200, N.gold); U.neon(ctx, "LOG", 1490, 620, 100, N.gold, { align: "center" }); ctx.restore(); }
    if (l > tBuk - 0.2) { ctx.save(); ctx.globalAlpha *= ramp(l, tBuk - 0.2, 0.4); X.para(ctx, "buku harian program saat berjalan", 1490, 710, 42, 560, { align: "center", color: N.ink }); ctx.restore(); }
    Z.labelAsli(ctx, "Catatan asli di pojok video", 1);
  };
  S.b4_2 = function (ctx, b, l, t) {
    const tCA = D.at(b, "Co-Authored-By"), tAI = D.at(b, "nama model AI");
    U.ruang(ctx, t, { col: N.pink });
    const k = ramp(l, tCA - 0.2, 0.4), redup = [[30, 151, k], [174, 286, k], [309, 399, k], [422, 550, k]];
    log(ctx, { col: N.pink, redup, hl: CA.map((i, j) => Z.rowHL(i, N.pink, ramp(l, tCA - 0.1 + j * 0.15, 0.3))) });
    const q = U.pop(l, tCA + 0.3); if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; U.panel(ctx, 1170, 300, 640, 420, { col: N.pink });
      X.mono(ctx, "Co-Authored-By:", 1210, 390, 52, { color: N.pink, weight: 800, fit: 560 });
      const r = ramp(l, tAI - 0.2, 0.4); if (r > 0) { ctx.globalAlpha *= r; X.mono(ctx, "Claude Fable 5.2", 1210, 500, 46, { color: N.ink, fit: 560 }); X.mono(ctx, "Claude Opus 5.5", 1210, 570, 46, { color: N.ink, fit: 560 });
        txt(ctx, "nama model AI", 1210, 670, 42, { weight: 800, color: N.ink2 }); } ctx.restore(); }
    Z.labelAsli(ctx, "Catatan asli di pojok video", 1);
  };
  S.b4_3 = function (ctx, b, l, t) {
    const tGit = D.at(b, "dari Git"), tSat = D.at(b, "satu kali"), tSim = D.at(b, "menyimpan perubahan"), tSia = D.at(b, "siapa yang");
    U.ruang(ctx, t, { col: N.green });
    const p = U.pop(l, tGit - 0.3); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a;
      X.kode(ctx, 110, 260, 1060, [{ s: "$ git log", col: N.green }, { s: "commit 7c1e9a2", col: N.gold }, { s: "Author: Modder", col: N.ink2 }, { s: "" },
        { s: "    Perbaiki pengatur frame", col: N.ink }, { s: "" }, { s: "    Co-Authored-By: Claude", col: N.pink, hl: ramp(l, tSia - 0.3, 0.4), hlCol: N.pink }], l, { size: 42, judul: "Terminal (contoh)", col: N.green });
      ctx.restore(); }
    [[tSat, "Ditulis 1 kali", "bukan setiap detik", N.gold], [tSim, "Saat commit", "menyimpan perubahan", N.green], [tSia, "Mencatat", "siapa ikut menulis kode", N.pink]].forEach(([t0, j, s, col], i) => {
      const q = U.pop(l, t0 - 0.3); if (q.a <= 0) return; X.kartu(ctx, { x: 1230, y: 226 + i * 196, w: 580, h: 186, cx: 1520 }, { col, judul: j, sub: s, a: q.a, sp: q.sp, ih: 0, js: 46, ss: 40 }); });
  };
  // (beat tambahan, bila disetujui) asal baris tersebut di proyek port yang asli
  S.b4_3a = function (ctx, b, l, t) {
    const tPro = D.at(b, "proyek port"), tRiw = D.at(b, "riwayat Git"), tBen = D.at(b, "ada benarnya");
    U.ruang(ctx, t, { col: N.violet });
    Z.kutipan(ctx, 160, 280, 1600, ["“This fork's changes were made", "with Claude Code.”"], { size: 60, judul: "README proyek port victory-scarlett, 26 Nov 2026", col: N.violet, a: ramp(l, tPro - 0.3, 0.4) });
    X.bawah(ctx, "Riwayat Git-nya memang berisi commit bersama Claude", l, tRiw - 0.3, N.violet, { y: 640 });
    U.tag(ctx, "Bagian AI: ada benarnya", 600, 780, l, tBen - 0.2, { col: N.green, size: 50 });
    U.tag(ctx, "Tempatnya: bukan di layar game", 1340, 780, l, tBen + 0.8, { col: N.red, size: 50 });
  };
  function speedo(ctx, x, y, r, l, t, montir) {
    ctx.save(); U.panel(ctx, x - r - 30, y - r - 30, 2 * r + 60, 2 * r + 120, { col: N.cyan, r: 40 });
    ctx.lineCap = "round"; ctx.strokeStyle = D.hexA(N.ink2, 0.35); ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(x, y, r * 0.8, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();
    const v = 0.45 + 0.08 * Math.sin(t * 2); ctx.strokeStyle = N.cyan; ctx.shadowColor = N.cyan; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(x, y, r * 0.8, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * v)); ctx.stroke(); ctx.shadowBlur = 0;
    const an = Math.PI * (0.8 + 1.4 * v); ctx.strokeStyle = N.pink; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * r * 0.62, y + Math.sin(an) * r * 0.62); ctx.stroke();
    ctx.fillStyle = "#05030C"; RR(ctx, x - r * 0.9, y + r * 0.55, r * 1.8, 96, 16); ctx.fill(); ctx.strokeStyle = D.hexA(N.cyan, 0.6); ctx.lineWidth = 3; ctx.stroke();
    const s = montir ? "Montir: Pak Joko" : Math.round(60 + 8 * Math.sin(t * 2)) + " km/jam";
    X.mono(ctx, s, x, y + r * 0.55 + 66, 44, { align: "center", color: montir ? N.pink : N.green, fit: r * 1.7 }); ctx.restore(); }
  S.b4_4 = function (ctx, b, l, t) {
    const tBer = D.at(b, "berulang kali"), tBay = D.at(b, "Bayangkan");
    U.ruang(ctx, t, { col: N.pink });
    const kd = (Math.sin(t * 6) + 1) / 2;
    log(ctx, { col: N.pink, hl: CA.map(i => Z.rowHL(i, N.pink, l > tBer - 0.3 ? 0.4 + 0.6 * kd : 1)) });
    X.bawah(ctx, "Muncul berulang, sekitar 2 kali setiap detik", l, tBer - 0.2, N.pink, { x: 610, y: 868, size: 42, fit: 960 });
    if (l > tBay - 0.3) { const p = U.pop(l, tBay - 0.3); ctx.save(); ctx.globalAlpha *= p.a; speedo(ctx, 1490, 450, 230, l, t, Math.floor(t * 1.6) % 2 === 0); ctx.restore(); }
  };
  Z.reg(4, S);
})(typeof window !== "undefined" ? window : globalThis);
