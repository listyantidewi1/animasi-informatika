/* D13 bab 3 — Petunjuk 1: berkas videonya sendiri. Klip asli + info berkas (24 detik, 1.440 gambar), 1.440 ÷ 24 = 60,
   dua pita (klaim 120 vs isi video 60), angka fps di overlay asli = tulisan. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;

  S.b3_1 = function (ctx, b, l, t) {
    const tVid = D.at(b, "Berkas video"), t24 = D.at(b, "24 detik"), t1440 = D.at(b, "1.440 gambar");
    U.ruang(ctx, t, { col: N.gold });
    const p = U.pop(l, 0.1); ctx.save(); ctx.globalAlpha *= p.a; Z.klip(ctx, l, 110, 270, 960, 540, { col: N.cyan, dim: 0.15 }); ctx.restore();
    const q = U.pop(l, tVid - 0.2); if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; U.panel(ctx, 1130, 270, 680, 540, { col: N.gold });
      txt(ctx, "Info berkas", 1170, 345, 48, { weight: 900, color: N.gold });
      const r1 = ramp(l, t24 - 0.2, 0.3), r2 = ramp(l, t1440 - 0.2, 0.3);
      if (r1 > 0) { ctx.save(); ctx.globalAlpha *= r1; txt(ctx, "Durasi", 1170, 460, 44, { weight: 700, color: N.ink2 }); txt(ctx, "24 detik", 1770, 460, 56, { align: "right", weight: 900 }); ctx.restore(); }
      if (r2 > 0) { ctx.save(); ctx.globalAlpha *= r2; txt(ctx, "Jumlah gambar", 1170, 580, 44, { weight: 700, color: N.ink2 });
        Z.angkaGulir(ctx, 1770, 584, 64, N.gold, 0, 1440, ramp(l, t1440 - 0.2, 1.4), { align: "right" }); ctx.restore(); }
      txt(ctx, "dihitung dengan ffprobe", 1170, 760, 40, { weight: 700, color: N.dim }); ctx.restore(); }
    Z.labelAsli(ctx, "Klip asli yang beredar", 1);
  };
  S.b3_2 = function (ctx, b, l, t) {
    const tHas = D.at(b, "hasilnya 60"), tArt = D.at(b, "Artinya");
    U.ruang(ctx, t, { col: N.cyan });
    const p = U.pop(l, 0.1); ctx.save(); ctx.globalAlpha *= p.a; txt(ctx, "1.440 ÷ 24", 900, 440, 130, { align: "right", weight: 900 }); ctx.restore();
    U.neonPop(ctx, "= 60", 1180, 440, 150, N.cyan, l, tHas - 0.1, { align: "center" });
    if (l > tArt - 0.2) { const u = clamp(((l - tArt) % 1.6) / 1); ctx.save(); ctx.globalAlpha *= ramp(l, tArt - 0.2, 0.4);
      txt(ctx, "Isi video: 60 gambar setiap detik", 160, 630, 52, { weight: 900, color: N.cyan }); Z.pita(ctx, 160, 660, 1600, 80, 60, Math.floor(u * 60), { col: N.cyan }); ctx.restore(); }
  };
  S.b3_3 = function (ctx, b, l, t) {
    const t120 = D.at(b, "memperlihatkan 120"), tTul = D.at(b, "hanyalah tulisan"), tMata = D.at(b, "mata kita");
    U.ruang(ctx, t, { col: N.pink });
    const sh = eio(ramp(l, tTul - 0.4, 0.7));
    if (sh < 1) { ctx.save(); ctx.globalAlpha *= 1 - sh;
      txt(ctx, "Klaim: 120 gambar setiap detik", 160, 320, 50, { weight: 900, color: N.pink });
      // 120 kotak: hanya kotak ganjil yang benar-benar ada di video
      const gap = 1, bw = (1600 - 119 * gap) / 120, k = ramp(l, t120, 0.8);
      for (let i = 0; i < 120; i++) { const ada = i % 2 === 0; ctx.fillStyle = ada ? N.cyan : D.hexA(N.red, 0.12 + 0.5 * k); ctx.fillRect(160 + i * (bw + gap), 350, bw, 90); }
      ctx.strokeStyle = D.hexA(N.ink2, 0.5); ctx.lineWidth = 3; RR(ctx, 152, 342, 1616, 106, 12); ctx.stroke();
      if (k > 0) { ctx.globalAlpha *= k; txt(ctx, "Separuhnya tidak ada di dalam video", 960, 530, 54, { align: "center", weight: 900, color: N.red }); }
      ctx.restore(); }
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh;
      // bilah bawah overlay asli, diperbesar: angka fps hanyalah tulisan
      const r = Z.logAsli(ctx, "log6.4", [0, 500, 940, 55], 110, 360, 1700, { col: N.gold, hl: [{ x0: 230, x1: 330, y0: 510, y1: 545, col: N.pink }] });
      U.neonPop(ctx, "hanya tulisan", 960, 640, 90, N.pink, l, tTul, { align: "center" });
      ctx.restore(); Z.labelAsli(ctx, "Overlay asli, diperbesar", sh); }
    X.bawah(ctx, "Buktinya tidak bisa kita lihat sendiri", l, tMata - 0.4, N.gold, { y: 760 });
  };
  Z.reg(3, S);
})(typeof window !== "undefined" ? window : globalThis);
