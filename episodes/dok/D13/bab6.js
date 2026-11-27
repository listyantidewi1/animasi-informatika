/* D13 bab 6 — Petunjuk 4: dua angka shader yang tidak akur. Bola yang diwarnai shader, bilah "menyiapkan shader",
   baris PSO 18,402/18,402 di log asli, bilah bawah asli pada detik 1, 11, dan 23,5 (17.867 naik ke 18.402), tanda ≠. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = Math.PI * 2;
  const SRC = [0, 30, 940, 520];

  S.b6_1 = function (ctx, b, l, t) {
    const tWar = D.at(b, "warna dan cahaya"), tSia = D.at(b, "disiapkan dulu");
    U.ruang(ctx, t, { col: N.cyan });
    // bola polos -> bola yang diberi cahaya oleh shader
    const k = eio(ramp(l, tWar - 0.4, 1.0)), lx = 560 + 70 * Math.cos(t * 0.9), ly = 460 + 60 * Math.sin(t * 0.9);
    ctx.save(); const gr = ctx.createRadialGradient(lx, ly, 10, 600, 520, 230); gr.addColorStop(0, lerpCol("#8E7FB8", "#FFF2C8", k)); gr.addColorStop(0.5, lerpCol("#8E7FB8", "#FF4FD8", k)); gr.addColorStop(1, lerpCol("#8E7FB8", "#2A0E4A", k));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(600, 520, 230, 0, TAU); ctx.fill(); ctx.restore();
    txt(ctx, k > 0.5 ? "dengan shader" : "tanpa shader", 600, 820, 46, { align: "center", weight: 900, color: k > 0.5 ? N.pink : N.dim });
    U.tag(ctx, "Shader = program kecil untuk warna dan cahaya", 1240, 240, l, 0.3, { col: N.pink, size: 44 });
    if (l > tSia - 0.3) { const u = clamp((l - tSia) / 3); ctx.save(); ctx.globalAlpha *= ramp(l, tSia - 0.3, 0.4); txt(ctx, "Menyiapkan shader…", 1000, 600, 46, { weight: 800, color: N.ink2 });
      ctx.fillStyle = "rgba(10,4,26,0.85)"; RR(ctx, 1000, 630, 720, 40, 20); ctx.fill(); ctx.strokeStyle = N.green; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = N.green; RR(ctx, 1006, 636, 708 * eio(u), 28, 14); ctx.fill();
      txt(ctx, Math.round(eio(u) * 100) + "%", 1720, 730, 46, { align: "right", weight: 900, color: N.green }); ctx.restore(); }
  };
  function lerpCol(a, b, k) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = [16, 8, 0].map(s => Math.round(lerp(pa >> s & 255, pb >> s & 255, k))); return `rgb(${c[0]},${c[1]},${c[2]})`; }

  S.b6_2 = function (ctx, b, l, t) {
    const tSiap = D.at(b, "sudah siap"), tAng = D.at(b, "18.402 dari");
    U.ruang(ctx, t, { col: N.green });
    const k = ramp(l, tSiap - 0.3, 0.4);
    Z.logAsli(ctx, "log6.4", SRC, 110, 250, 1000, { col: N.green, redup: [[30, 264, k], [287, 550, k]], hl: [{ ...Z.rowHL(8, N.green, k), x0: 320, x1: 610 }] });
    const p = U.pop(l, tAng - 0.2); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, 1170, 300, 640, 420, { col: N.green }); txt(ctx, "Kata log:", 1210, 380, 44, { weight: 800, color: N.ink2 });
      U.neon(ctx, "18.402 / 18.402", 1490, 520, 70, N.green, { align: "center", fit: 580 }); txt(ctx, "semua shader siap", 1490, 620, 46, { align: "center", weight: 900, color: N.green }); ctx.restore(); }
    Z.labelAsli(ctx, "Catatan asli di pojok video", 1);
  };
  S.b6_3 = function (ctx, b, l, t) {
    const tBil = D.at(b, "bilah di bawahnya"), tBaru = D.at(b, "baru 17.867"), tNaik = D.at(b, "naik perlahan");
    U.ruang(ctx, t, { col: N.pink });
    const rows = [["log1", "detik ke-1", tBil - 0.3], ["log11", "detik ke-11", tNaik - 0.3], ["log23.5", "detik ke-23", tNaik + 0.5]];
    rows.forEach(([k, lab, t0], i) => { const p = U.pop(l, t0); if (p.a <= 0) return; ctx.save(); ctx.globalAlpha *= p.a; const y = 280 + i * 170;
      txt(ctx, lab, 130, y + 74, 44, { weight: 900, color: N.ink2 });
      Z.logAsli(ctx, k, [0, 503, 940, 48], 420, y, 1360, { col: i === 0 ? N.pink : N.cyan, hl: [{ x0: 610, x1: 770, y0: 510, y1: 545, col: N.pink, a: i === 0 ? ramp(l, tBaru - 0.2, 0.3) : 1 }] }); ctx.restore(); });
    if (l > tNaik - 0.3) { ctx.save(); ctx.globalAlpha *= ramp(l, tNaik - 0.3, 0.4); Z.angkaGulir(ctx, 960, 860, 64, N.gold, 17867, 18402, ramp(l, tNaik, 2.4), { pre: "shaders: " }); ctx.restore(); }
    Z.labelAsli(ctx, "Bilah asli, tiga detik berbeda", ramp(l, tBil, 0.4) * (1 - ramp(l, tNaik - 0.6, 0.3)));
  };
  S.b6_4 = function (ctx, b, l, t) {
    const tCoc = D.at(b, "seharusnya cocok"), tTid = D.at(b, "tidak cocok");
    U.ruang(ctx, t, { col: N.red });
    const rs = X.cols(2, { x0: 160, x1: 1760, y: 360, h: 300, gap: 240 });
    const p1 = U.pop(l, 0.1), p2 = U.pop(l, 0.5);
    X.kartu(ctx, rs[0], { col: N.green, judul: "Kata log", sub: ["18.402 / 18.402", "semua siap"], a: p1.a, sp: p1.sp, ih: 0, js: 56, ss: 50 });
    X.kartu(ctx, rs[1], { col: N.pink, judul: "Kata bilah", sub: ["17.867 → 18.402", "masih bertambah"], a: p2.a, sp: p2.sp, ih: 0, js: 56, ss: 50 });
    U.neonPop(ctx, l > tTid - 0.2 ? "≠" : "=", 960, 580, 200, l > tTid - 0.2 ? N.red : N.gold, l, tCoc - 0.2, { align: "center" });
  };
  Z.reg(6, S);
})(typeof window !== "undefined" ? window : globalThis);
