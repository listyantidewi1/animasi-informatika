/* D12 bab 3 — Variations (b3_1 … b3_6): nama yang jarang terdengar, uji coba bertahap, daftar sakelar dari server, kuasa penuh, validasi masukan (loket), laporan terkunci. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d12, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout, rng } = D, { ramp, T } = U, TAU = Math.PI * 2;
  const S = {};
  const DOTS = (() => { const r = rng(12); return Array.from({ length: 150 }, () => [140 + r() * 1640, 560 + r() * 380, r()]); })();

  S.b3_1 = function (ctx, b, l, t) {
    const tS = U.at(b, "setiap browser"), u = ramp(l, tS - 0.2, 1.6);
    ctx.save(); ctx.translate(0, -eio(ramp(l, tS - 0.4, 0.6)) * 130);
    U.muncul(ctx, l, 0.3, 960, 470, () => { T(ctx, "Variations", 960, 500, 190, { align: "center", weight: 900, color: C.amber, glow: C.amber, blur: 30 }); });
    U.muncul(ctx, l, 0.9, 1560, 400, () => T(ctx, "?", 1560, 480, 150, { align: "center", weight: 900, color: C.text2 }));
    ctx.restore();
    if (u > 0) { DOTS.forEach(([x, y, r]) => { if (r > u) return; X.glow(ctx, x, y, 18, C.amber, 0.5); ctx.fillStyle = C.amber; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill(); });
      U.muncul(ctx, l, tS + 0.5, 960, 1000, () => U.pill(ctx, "bekerja di setiap browser Chrome", 960, 990, { size: 40, col: C.amber, fill: "rgba(11,11,13,0.96)" })); }
  };

  S.b3_2 = function (ctx, b, l, t) {
    const t1 = U.at(b, "sebagian kecil"), t2 = U.at(b, "diperluas"), t3 = U.at(b, "sedikit demi sedikit");
    const n = l < t1 ? 0 : l < t2 ? 1 : l < t3 ? 10 : Math.round(lerp(10, 100, eio(ramp(l, t3, 2.2)))), r = rng(5), ord = Array.from({ length: 100 }, (_, i) => [r(), i]).sort((a, c) => a[0] - c[0]).map(a => a[1]), on = new Set(ord.slice(0, n));
    U.judul(ctx, "Fitur baru tidak dinyalakan sekaligus", l, 0.3, { y: 150, col: C.php });
    for (let i = 0; i < 100; i++) { const x = 220 + (i % 20) * 62, y = 290 + Math.floor(i / 20) * 110, a = on.has(i); if (a) X.glow(ctx, x, y, 40, C.term, 0.5); U.orang(ctx, x, y, 54, a ? C.term : C.dim); }
    U.kotak(ctx, 1500, 330, 300, 300, "", { col: C.term }); T(ctx, n + "%", 1650, 500, 110, { align: "center", mono: true, weight: 700, color: C.term }); T(ctx, "pengguna", 1650, 570, 38, { align: "center", weight: 700, color: C.text2 });
    U.muncul(ctx, l, t3 + 0.4, 960, 900, () => U.pill(ctx, "diperluas bila tidak ada masalah", 960, 900, { size: 42, col: C.term }));
  };

  const FITUR = ["Fitur A", "Fitur B", "Fitur C", "Fitur D"], ARAH = [1, 0, 1, 1];
  S.b3_3 = function (ctx, b, l, t) {
    const tV = U.at(b, "sistem yang mengatur"), tD = U.at(b, "menerima daftar"), tM = U.at(b, "menyalakan atau"), fl = ramp(l, tD, 1.2);
    U.judul(ctx, "Variations", l, tV - 0.6, { y: 150, col: C.amber, size: 72 });
    U.geser(ctx, l, 0.2, -200, 0, () => { U.server(ctx, 330, 520, 300, { glow: 0.25 }); T(ctx, "server Google", 330, 760, 44, { align: "center", weight: 800 }); });
    const f = U.browser(ctx, 980, 250, 800, 620, { tabs: ["Chrome"], url: "" });
    T(ctx, "daftar pengaturan", f.x + 10, f.y + 60, 38, { weight: 800, color: C.amber });
    FITUR.forEach((s, i) => { const y = f.y + 100 + i * 92, u = ARAH[i] ? ramp(l, tM + i * 0.35, 0.3) : 1 - ramp(l, tM + i * 0.35, 0.3); T(ctx, s, f.x + 10, y + 46, 44, { weight: 700 }); U.sakelar(ctx, f.x + f.w - 130, y + 6, u, 1.15); });
    U.panah(ctx, 520, 520, 960, 520, C.amber, eio(ramp(l, tD - 0.5, 0.6)), { lw: 6, dash: [14, 12] });
    if (fl > 0 && fl < 1) { const x = lerp(540, 900, eio(fl)); U.kotak(ctx, x - 70, 430, 140, 170, "", { col: C.amber, fill: "rgba(24,23,28,0.98)" }); for (let i = 0; i < 4; i++) { ctx.fillStyle = C.amber; U.rr(ctx, x - 46, 458 + i * 34, 92, 12, 5); ctx.fill(); } }
    U.muncul(ctx, l, tD + 0.2, 740, 400, () => T(ctx, "secara berkala", 740, 400, 38, { align: "center", weight: 700, color: C.text2 }));
  };

  S.b3_4 = function (ctx, b, l, t) {
    const tK = U.at(b, "kuasa penuh"), tD = U.at(b, "data yang keliru"), tL = U.at(b, "di luar sandbox"), bo = ramp(l, tL - 0.4, 1.5);
    const dn = U.denah(ctx, { kaca: 1, kendali: ramp(l, tK - 0.3, 0.4), isiKendali: "Variations", bocor: bo });
    const fl = ramp(l, tD - 0.3, 0.9); if (fl > 0 && fl < 1) { const x = lerp(60, dn.kx + 120, eio(fl)); U.kotak(ctx, x - 60, dn.ky + 60, 120, 80, "data", { col: C.red, size: 34, glow: 0.5 }); }
    if (bo > 0) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 7; ctx.shadowColor = C.red; ctx.shadowBlur = 18; ctx.lineCap = "round"; [0, 1, 2].forEach(i => { const u = clamp(bo * 3 - i); if (u <= 0) return; const y1 = dn.y + 137 + i * 205; ctx.beginPath(); ctx.moveTo(dn.kx + dn.kw, dn.ky + 90); ctx.lineTo(lerp(dn.kx + dn.kw, dn.x + 1080, u), lerp(dn.ky + 90, y1, u)); ctx.stroke(); }); ctx.restore(); }
    U.muncul(ctx, l, tD, 575, 120, () => U.pill(ctx, "data yang keliru masuk ke bagian berkuasa", 600, 110, { size: 38, col: C.red }));
  };

  S.b3_5 = function (ctx, b, l, t) {
    const tF = U.at(b, "menerima formulir"), tC = U.at(b, "tanpa mengecek"), tA = U.at(b, "program menerima");
    U.judul(ctx, "improper input validation", l, 0.4, { y: 130, col: C.red, mono: true, size: 64 });
    U.judul(ctx, "data diterima tanpa diperiksa dengan teliti", l, tA - 0.2, { y: 205, size: 42, col: C.text2 });
    U.loket(ctx, { masuk: ramp(l, tF - 0.6, 0.8), sorot: ramp(l, tC - 0.1, 0.4), cap: "DITERIMA", capCol: C.term, capU: l > tC + 0.9 ? 1 : 0, capL: l, capT: tC + 0.9 });
    U.sumber(ctx, "perumpamaan, bukan mekanisme sebenarnya");
  };

  S.b3_6 = function (ctx, b, l, t) {
    const tG = U.at(b, "sengaja belum"), tA = U.at(b, "alasannya");
    U.judul(ctx, "Bagaimana tepatnya caranya?", l, 0.3, { y: 180, size: 72 });
    U.muncul(ctx, l, 0.8, 960, 560, () => { U.kotak(ctx, 560, 290, 800, 520, "", { col: C.text2, fill: "rgba(24,23,28,0.96)" }); T(ctx, "LAPORAN TEKNIS", 620, 370, 36, { weight: 800, color: C.text2, spacing: 5 }); T(ctx, "issue 554051967", 620, 440, 52, { mono: true, weight: 700 });
      for (let i = 0; i < 4; i++) { ctx.fillStyle = "rgba(238,237,242,0.5)"; U.rr(ctx, 620, 500 + i * 62, [640, 520, 600, 380][i], 34, 6); ctx.fill(); } });
    U.muncul(ctx, l, tG, 960, 600, () => X.cap(ctx, "TERKUNCI", 960, 600, -0.09, C.red, 110), { k0: 1.8 });
    U.muncul(ctx, l, tA, 960, 910, () => U.pill(ctx, "mengapa dirahasiakan?", 960, 910, { size: 46, col: C.amber }));
  };

  U.reg(3, S);
})(typeof window !== "undefined" ? window : globalThis);
