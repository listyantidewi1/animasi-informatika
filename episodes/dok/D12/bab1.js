/* D12 bab 1 — isi peringatan (b1_1 … b1_4): catatan rilis, nomor CVE, deskripsi resmi satu kalimat, dua istilah kunci. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d12, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U;
  const S = {};

  S.b1_1 = function (ctx, b, l, t) {
    const tS = U.at(b, "tepat satu"), tC = U.at(b, "Critical");
    const f = U.browser(ctx, 210, 130, 1500, 800, { tabs: ["Catatan rilis"], url: "catatan rilis resmi · kanal Stable" });
    T(ctx, "Stable Channel Update for Desktop", f.x + 20, f.y + 90, 54, { weight: 900 });
    T(ctx, "The Stable channel has been updated to 158.0.8127.88/.89", f.x + 20, f.y + 170, 36, { weight: 600, color: C.text2 });
    T(ctx, "for Windows and Mac and 158.0.8127.88 to Linux", f.x + 20, f.y + 222, 36, { weight: 600, color: C.text2 });
    T(ctx, "Security Fixes and Rewards", f.x + 20, f.y + 320, 42, { weight: 800 });
    const hs = ramp(l, tS - 0.2, 0.4); if (hs > 0) { ctx.fillStyle = U.rgba(C.amber, 0.2 * hs); U.rr(ctx, f.x, f.y + 350, 900, 70, 10); ctx.fill(); }
    T(ctx, "This update includes 1 security fix.", f.x + 20, f.y + 398, 40, { weight: 700, color: hs > 0.5 ? C.amber : C.text2 });
    const hc = ramp(l, tC - 0.2, 0.4); if (hc > 0) { ctx.fillStyle = U.rgba(C.red, 0.2 * hc); U.rr(ctx, f.x, f.y + 450, f.w, 150, 10); ctx.fill(); }
    T(ctx, "Critical", f.x + 20, f.y + 510, 44, { weight: 900, color: C.red }); T(ctx, "CVE-2026-134401", f.x + 220, f.y + 510, 44, { mono: true, weight: 700 });
    T(ctx, "Improper input validation in Variations.", f.x + 20, f.y + 570, 38, { weight: 600, color: C.text2 });
    U.muncul(ctx, l, tS, 1420, 560, () => U.pill(ctx, "hanya 1 perbaikan", 1420, 505, { size: 40, col: C.amber }));
    U.muncul(ctx, l, tC, 1380, 800, () => X.cap(ctx, "CRITICAL", 1380, 800, -0.08, C.red, 84), { k0: 1.7 });
    U.sumber(ctx, "Sumber: Chrome Releases (digambar ulang)");
  };

  S.b1_2 = function (ctx, b, l, t) {
    const tN = U.at(b, "CVE-2026-134401"), tK = U.at(b, "nomor katalog"), id = "CVE-2026-134401", mv = eio(ramp(l, tK - 0.4, 0.7));
    ctx.save(); ctx.translate(0, -120 * mv);
    U.kotak(ctx, 360, 330, 1200, 300, "", { col: C.red, fill: "rgba(18,17,21,0.96)", glow: 0.25 }); T(ctx, "NOMOR IDENTITAS CELAH", 420, 410, 34, { weight: 800, color: C.red, spacing: 5 });
    T(ctx, U.ketik(id, l, tN - 0.3, 7), 420, 540, 110, { mono: true, weight: 700 }); ctx.restore();
    if (mv > 0) { ctx.save(); ctx.globalAlpha *= mv; T(ctx, "katalog dunia untuk celah keamanan", 960, 640, 44, { align: "center", weight: 800, color: C.php });
      ["CVE-…-134399", "CVE-…-134400", "CVE-…-134401", "CVE-…-134402", "CVE-…-134403"].forEach((s, i) => { const x = 130 + i * 340, hi = i === 2; U.kotak(ctx, x, 700, 310, 150, s, { col: hi ? C.red : C.dim, size: 34, mono: true, color: hi ? C.text : C.dim, glow: hi ? 0.4 : 0 }); }); ctx.restore(); }
  };

  const EN = ["…allowed a remote attacker to potentially", "execute arbitrary code outside the sandbox", "via a crafted HTML page."];
  S.b1_3 = function (ctx, b, l, t) {
    const ts = [U.at(b, "Penyerang"), U.at(b, "menjalankan kode"), U.at(b, "melalui halaman")], ID = ["penyerang dari jarak jauh berpotensi", "menjalankan kode di luar sandbox", "lewat halaman HTML yang dibuat khusus"];
    U.judul(ctx, "Deskripsi resmi: satu kalimat", l, 0.2, { y: 150, col: C.php });
    U.kotak(ctx, 160, 210, 1600, 690, "", { col: C.php, fill: "rgba(18,17,21,0.96)" });
    EN.forEach((s, i) => { const a = ramp(l, 0.5 + i * 0.25, 0.4), hi = ramp(l, ts[i] - 0.15, 0.3) * (1 - ramp(l, (ts[i + 1] || 99) - 0.15, 0.3)); ctx.save(); ctx.globalAlpha *= a;
      if (hi > 0) { ctx.fillStyle = U.rgba(C.amber, 0.16 * hi); U.rr(ctx, 200, 262 + i * 76, 1520, 70, 10); ctx.fill(); } T(ctx, s, 230, 312 + i * 76, 44, { mono: true, weight: 600, color: C.text2 }); ctx.restore(); });
    ctx.fillStyle = C.line; ctx.fillRect(230, 520, 1460, 3);
    ID.forEach((s, i) => { const a = ramp(l, ts[i] - 0.1, 0.4); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; T(ctx, s, 230, 620 + i * 92, 60, { weight: 800, color: i === 1 ? C.red : C.text }); ctx.restore(); });
    U.sumber(ctx, "Sumber: NVD, CVE-2026-134401");
  };

  S.b1_4 = function (ctx, b, l, t) {
    const t1 = U.at(b, "Yang pertama"), t2 = U.at(b, "yang kedua"), t3 = U.at(b, "Kita mulai"), k = ramp(l, t3 - 0.2, 0.5);
    U.judul(ctx, "Dua istilah penting", l, 0.2, { y: 190, col: C.php });
    U.muncul(ctx, l, t1 - 0.2, 560, 520, () => { U.kotak(ctx, 240, 360, 640, 320, "", { col: "#BFE9F2", glow: 0.25 + 0.4 * k }); T(ctx, "1", 290, 440, 54, { weight: 900, color: "#BFE9F2" }); T(ctx, "sandbox", 560, 560, 96, { align: "center", weight: 900 }); });
    U.muncul(ctx, l, t2 - 0.2, 1360, 520, () => { ctx.save(); ctx.globalAlpha *= lerp(1, 0.35, k); U.kotak(ctx, 1040, 360, 640, 320, "", { col: C.amber }); T(ctx, "2", 1090, 440, 54, { weight: 900, color: C.amber }); T(ctx, "Variations", 1360, 560, 96, { align: "center", weight: 900 }); ctx.restore(); });
    U.muncul(ctx, l, t3, 560, 800, () => U.pill(ctx, "mulai dari sini", 560, 800, { size: 44, col: "#BFE9F2" }));
  };

  U.reg(1, S);
})(typeof window !== "undefined" ? window : globalThis);
