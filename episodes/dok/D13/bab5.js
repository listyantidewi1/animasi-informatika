/* D13 bab 5 — Petunjuk 3: log berulang seperti lagu. Delapan jenis baris diberi warna pada potongan log asli,
   urutan satu putaran (transkrip dari potongan t6.4) dengan jarak waktu yang selalu +0,113 detik, lalu
   perbandingan detak "program sungguhan" (tidak teratur) dan "log di video" (rapi seperti metronom). */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = Math.PI * 2;
  const SRC = [0, 30, 940, 520];
  const WARNA = { input: N.cyan, stream: N.green, host: N.gold, host2: N.gold, swapchain: N.violet, shader: N.pink, lighting: N.orange, vram: N.sun, native: N.red, ca: N.dim };
  const NAMA = [["input", "input"], ["stream", "stream"], ["host", "host"], ["swapchain", "swapchain"], ["shader", "shader"], ["lighting", "lighting"], ["vram", "VRAM"], ["native", "native"]];
  function logWarna(ctx, l, kapan, o = {}) {
    const r = Z.logAsli(ctx, "log6.4", SRC, 110, 250, 1000, { col: o.col || N.cyan });
    Z.JENIS.forEach((j, i) => { const t0 = kapan[j]; if (j === "ca" || t0 == null) return; const a = ramp(l, t0, 0.3); if (a <= 0) return; const [x0, y0] = r.map(4, Z.baris(i) - 11), [, y1] = r.map(4, Z.baris(i) + 11);
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = WARNA[j]; ctx.shadowColor = WARNA[j]; ctx.shadowBlur = 10; RR(ctx, x0, y0, 14, y1 - y0, 6); ctx.fill(); ctx.fillStyle = D.hexA(WARNA[j], 0.13); ctx.fillRect(x0 + 16, y0, r.w - 30, y1 - y0); ctx.restore(); });
    return r; }

  S.b5_1 = function (ctx, b, l, t) {
    U.ruang(ctx, t, { col: N.violet });
    const kapan = {}; NAMA.forEach(([j, s]) => { kapan[j] = D.at(b, s === "VRAM" ? "VRAM" : s + (s === "native" ? "." : ","), -0.15); }); kapan.host2 = kapan.host;
    logWarna(ctx, l, kapan);
    NAMA.forEach(([j, s], i) => { const p = U.pop(l, kapan[j]); if (p.a <= 0) return; const x = 1170 + (i % 2) * 330, y = 270 + Math.floor(i / 2) * 135;
      ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(x + 150, y + 50); const k = lerp(0.85, 1, p.sp); ctx.scale(k, k); ctx.fillStyle = "rgba(16,8,38,0.9)"; RR(ctx, -150, -50, 300, 100, 22); ctx.fill();
      ctx.strokeStyle = WARNA[j]; ctx.lineWidth = 4; ctx.shadowColor = WARNA[j]; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0; X.mono(ctx, s, 0, 16, 44, { align: "center", color: WARNA[j], fit: 270 }); ctx.restore(); });
    X.judul(ctx, "Delapan jenis baris", l, D.at(b, "delapan jenis") - 0.2, N.violet);
    Z.labelAsli(ctx, "Catatan asli di pojok video", 1);
  };
  // satu putaran dari potongan t6.4 (baris 4 sampai 14)
  const PUT = [["16.876", "input"], ["16.989", "stream"], ["17.102", "host"], ["17.215", "swapchain"], ["17.328", "shader"], [null, "ca"], ["17.441", "lighting"], ["17.554", "vram"], ["17.667", "native"], ["17.780", "host2"], [null, "ca"]];
  const LAB = { input: "input", stream: "stream", host: "host", host2: "host", swapchain: "swapchain", shader: "shader", lighting: "lighting", vram: "VRAM", native: "native", ca: "Co-Authored-By" };
  function kolom(ctx, x, y, w, judul, waktu, l, t0, col) { const lh = 46; ctx.save(); U.panel(ctx, x, y, w, 84 + PUT.length * lh, { col }); txt(ctx, judul, x + 30, y + 54, 42, { weight: 900, color: col, fit: w - 60 });
    PUT.forEach(([tm, j], i) => { const a = ramp(l, t0 + i * 0.12, 0.25); if (a <= 0) return; const yy = y + 84 + i * lh; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = WARNA[j]; RR(ctx, x + 26, yy + 6, 14, lh - 12, 6); ctx.fill();
      X.mono(ctx, (waktu && tm ? tm + "  " : "") + LAB[j], x + 58, yy + lh * 0.76, 40, { color: j === "ca" ? N.dim : WARNA[j], fit: w - 80 }); ctx.restore(); }); ctx.restore(); }
  S.b5_2 = function (ctx, b, l, t) {
    const tSam = D.at(b, "urutan yang sama"), tLag = D.at(b, "lagi dan lagi"), tAng = D.at(b, "angka kecil");
    U.ruang(ctx, t, { col: N.gold });
    kolom(ctx, 110, 210, 600, "Putaran 1", true, l, 0.1, N.cyan);
    if (l > tLag - 0.4) kolom(ctx, 760, 210, 440, "Putaran 2", false, l, tLag - 0.4, N.cyan);
    const p = U.pop(l, tSam); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, 1260, 260, 550, 250, { col: N.gold }); txt(ctx, "Jarak antarbaris", 1535, 330, 42, { align: "center", weight: 800, color: N.ink2 });
      U.neon(ctx, "+0,113 dtk", 1535, 430, 76, N.gold, { align: "center", fit: 500 }); txt(ctx, "selalu sama", 1535, 490, 40, { align: "center", weight: 800, color: N.gold }); ctx.restore(); }
    const q = U.pop(l, tAng - 0.2); if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; U.panel(ctx, 1260, 560, 550, 230, { col: N.pink }); txt(ctx, "Yang berubah hanya", 1535, 630, 42, { align: "center", weight: 800, color: N.ink2 });
      X.mono(ctx, "120.1 → 119.6 fps", 1535, 720, 46, { align: "center", color: N.pink, fit: 500 }); ctx.restore(); }
    X.sumber(ctx, l, 0.6, "transkrip catatan asli, detik ke-6 video");
  };
  function detak(ctx, x, y, w, ts, l, col, lab) { ctx.save(); txt(ctx, lab, x, y - 30, 46, { weight: 900, color: col, fit: w });
    ctx.strokeStyle = D.hexA(N.ink2, 0.4); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y + 60); ctx.lineTo(x + w, y + 60); ctx.stroke();
    ts.forEach(tt => { const xx = x + w - (l - tt) * 220; if (xx < x || xx > x + w || tt > l) return; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12; RR(ctx, xx - 6, y, 12, 120, 6); ctx.fill(); }); ctx.restore(); }
  S.b5_3 = function (ctx, b, l, t) {
    const tSun = D.at(b, "Program sungguhan"), tTem = D.at(b, "templat");
    U.ruang(ctx, t, { col: N.green });
    const r = U.rng(41), acak = []; let tt = -8; while (tt < 30) { tt += 0.06 + r() * r() * 1.6; acak.push(tt); }
    const rapi = []; for (let k = -80; k < 300; k++) rapi.push(k * 0.113 * 2.2);
    const a1 = ramp(l, tSun - 0.2, 0.4), a2 = ramp(l, tSun + 1.6, 0.4);
    if (a1 > 0) { ctx.save(); ctx.globalAlpha *= a1; detak(ctx, 160, 320, 1600, acak, l, N.green, "Program sungguhan: mencatat saat ada kejadian"); ctx.restore(); }
    if (a2 > 0) { ctx.save(); ctx.globalAlpha *= a2; detak(ctx, 160, 600, 1600, rapi, l, N.pink, "Log di video: rapi seperti metronom"); ctx.restore(); }
    U.tag(ctx, "Mirip templat yang diputar ulang", 960, 868, l, tTem - 0.2, { col: N.pink, size: 50 });
  };
  Z.reg(5, S);
})(typeof window !== "undefined" ? window : globalThis);
