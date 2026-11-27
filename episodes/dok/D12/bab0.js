/* D12 bab 0 — kait (b0_1 … b0_5): satu halaman web, garis merah merambat, email peringatan + nilai 9,6, dua pertanyaan, daftar periksa dengan satu baris disamarkan. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d12, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U;
  const S = {};

  S.b0_1 = function (ctx, b, l, t) {
    const k = lerp(0.82, 1, eout(ramp(l, 0, 0.9))); ctx.save(); ctx.globalAlpha *= ramp(l, 0, 0.4); ctx.translate(960, 440); ctx.scale(k, k); ctx.translate(-960, -440);
    const f = U.browser(ctx, 380, 150, 1160, 560, { tabs: ["Halaman web"], url: "https://situs-apa-saja.example" }); U.isiHalaman(ctx, f, ramp(l, 0.5, 0.6)); ctx.restore();
    [["unduh", "mengunduh", "tidak mengunduh"], ["pasang", "memasang", "tidak memasang"], ["sandi", "kata sandi", "tidak mengetik"]].forEach(([ik, nm, ph], i) => { const t0 = U.at(b, ph), cx = 480 + i * 480;
      U.muncul(ctx, l, t0 - 0.15, cx, 850, () => { U.kotak(ctx, cx - 190, 780, 380, 140, "", { col: C.text2 }); U.ikon(ctx, ik, cx - 120, 850, 80, C.text2); T(ctx, nm, cx - 60, 866, 42, { weight: 800 }); });
      U.silang(ctx, cx - 120, 850, 100, ramp(l, t0 + 0.25, 0.3)); });
  };

  S.b0_2 = function (ctx, b, l, t) {
    const tC = U.at(b, "Google Chrome"), tM = U.at(b, "menjalankan perintah"), m = ramp(l, tM - 0.6, 1.4);
    U.laptop(ctx, 960, 560, 1300, C.text2);
    const f = U.browser(ctx, 420, 140, 1080, 600, { tabs: ["Halaman web"], url: "https://situs-apa-saja.example" }); U.isiHalaman(ctx, f, 1);
    U.muncul(ctx, l, tC - 0.2, 960, 800, () => U.pill(ctx, "Google Chrome yang belum diperbarui", 960, 800, { size: 42, col: C.amber }));
    if (m > 0) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.shadowColor = C.red; ctx.shadowBlur = 22;
      const pts = [[700, 420], [640, 520], [560, 560], [470, 640], [380, 700], [330, 780], [300, 900]]; const n = eio(m) * (pts.length - 1); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= Math.floor(n); i++) ctx.lineTo(pts[i][0], pts[i][1]); const i0 = Math.floor(n); if (i0 < pts.length - 1) ctx.lineTo(lerp(pts[i0][0], pts[i0 + 1][0], n - i0), lerp(pts[i0][1], pts[i0 + 1][1], n - i0)); ctx.stroke(); ctx.restore(); }
    U.muncul(ctx, l, tM + 0.5, 520, 930, () => { U.kotak(ctx, 160, 930, 760, 100, "", { col: C.red, fill: "rgba(11,11,13,0.96)", glow: 0.3 }); T(ctx, "> perintah dari orang lain", 200, 994, 42, { mono: true, weight: 700, color: C.red }); });
  };

  S.b0_3 = function (ctx, b, l, t) {
    const tN = U.at(b, "sembilan koma enam");
    U.geser(ctx, l, 0.1, -300, 0, () => { const f = X.windowFrame(ctx, 130, 190, 980, 640, { title: "Kotak masuk" });
      T(ctx, "PERINGATAN KEAMANAN", f.x + 10, f.y + 90, 44, { weight: 900, color: C.amber, spacing: 3 }); T(ctx, "Kepada: semua orang", f.x + 10, f.y + 150, 32, { weight: 600, color: C.text2 });
      ["Ditemukan celah keamanan pada browser", "dengan tingkat risiko sangat tinggi.", "", "Segera perbarui browser Anda."].forEach((s, i) => T(ctx, s, f.x + 10, f.y + 250 + i * 62, 40, { weight: i === 3 ? 800 : 600, color: i === 3 ? C.text : C.text2 }));
      T(ctx, "digambar ulang, bukan email asli", f.x + f.w - 10, f.y + f.h - 30, 26, { align: "right", weight: 600, color: C.dim }); });
    U.muncul(ctx, l, tN - 0.5, 1480, 500, () => { const v = lerp(0, 9.6, eio(ramp(l, tN - 0.4, 1.1))); X.meterCVSS(ctx, 1480, 500, 240, Math.round(v * 10) / 10, { label: "DARI 10" }); });
    U.muncul(ctx, l, tN + 1.0, 1480, 850, () => U.pill(ctx, "tingkat bahaya: Critical", 1480, 850, { size: 44, col: C.red }));
  };

  S.b0_4 = function (ctx, b, l, t) {
    const t2 = U.at(b, "Apakah Chrome"), d = ramp(l, t2 - 0.3, 0.5);
    ctx.save(); ctx.globalAlpha *= lerp(1, 0.35, d); ctx.translate(0, lerp(120, 0, d));
    U.judul(ctx, "Bagaimana sebuah halaman web", l, 0.2, { y: 300, size: 84 }); U.judul(ctx, "bisa keluar dari browser?", l, 0.5, { y: 410, size: 84, col: C.red }); ctx.restore();
    U.judul(ctx, "Apakah Chrome di perangkatmu", l, t2 - 0.1, { y: 650, size: 84 }); U.judul(ctx, "termasuk yang terkena?", l, t2 + 0.3, { y: 760, size: 84, col: C.amber });
  };

  S.b0_5 = function (ctx, b, l, t) {
    const tS = U.at(b, "satu langkah kecil");
    U.judul(ctx, "Yang akan kita bedah", l, 0.2, { y: 150, col: C.php });
    U.daftar(ctx, 460, 210, 1000, [{ s: "Apa sebenarnya celahnya", a: ramp(l, 0.4, 0.4) }, { s: "Seberapa gawat", a: ramp(l, 0.9, 0.4) }, { s: "Cara cek dan update", a: ramp(l, 1.4, 0.4) }, { s: "", samar: 1, a: ramp(l, tS - 0.2, 0.4), col: C.amber }]);
    U.muncul(ctx, l, tS + 0.6, 960, 800, () => U.pill(ctx, "satu langkah kecil yang sering terlewat", 960, 800, { size: 44, col: C.amber }));
  };

  U.reg(0, S);
})(typeof window !== "undefined" ? window : globalThis);
