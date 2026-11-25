/* D09 bab 0 — hook (b0_1 … b0_4): dua rilis keamanan + cap KRITIS, jendela patch dengan jam ??:??, Java4Shell ±1 jam, exploit_agent. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d09, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080;
  const S = {};

  S.b0_1 = function (ctx, b, l, t) {
    const tDua = U.at(b, "Untuk kedua"), tKr = U.at(b, "kritis");
    // frame pertama = komposisi thumbnail: terminal <?php
    const out = ramp(l, tDua - 0.3, 0.5);
    if (out < 1) { ctx.save(); ctx.globalAlpha *= 1 - out;
      X.terminal(ctx, 160, 230, 960, 470, [{ t: "php -v", cmd: true }, { t: "PHP 8.3.30 (cli)", hl: C.red, color: C.text }, { t: "" }, { t: "<?php // celah?", color: C.php }], { size: 48 });
      T(ctx, "CELAH KEAMANAN", 1500, 420, 84, { align: "center", weight: 900, color: C.text });
      T(ctx, "PHP", 1500, 560, 150, { align: "center", weight: 900, color: C.php, glow: C.php, blur: 30 });
      U.muncul(ctx, l, U.at(b, "bocor lagi") - 0.1, 1500, 760, () => X.cap(ctx, "BOCOR LAGI", 1500, 760, -0.06, C.red, 80), { k0: 1.6 });
      ctx.restore(); }
    if (out > 0) {
      ctx.save(); ctx.globalAlpha *= out;
      U.geser(ctx, l, tDua - 0.2, 0, -500, () => X.kartuCVE(ctx, 200, 220, { w: 860, h: 320, tag: "RILIS KEAMANAN PHP", id: "21 Oktober 2026", title: "2 celah · eksekusi kode tanpa login", cvss: 9.2, col: C.php, date: "8.2.35 · 8.3.36 · 8.4.27 · 8.5.12" }));
      U.geser(ctx, l, tDua + 0.6, 0, -600, () => { ctx.save(); ctx.translate(880, 470); ctx.rotate(0.03); X.kartuCVE(ctx, 0, 0, { w: 860, h: 320, tag: "RILIS KEAMANAN PHP", id: "19 November 2026", title: "8 celah berat · 7 skor 9,2", cvss: 9.2, col: C.red, date: "8.2.36 · 8.3.37 · 8.4.28 · 8.5.13" }); ctx.restore(); });
      U.muncul(ctx, l, tKr - 0.15, 1400, 880, () => X.cap(ctx, "KRITIS", 1400, 880, -0.12, C.red, 76), { k0: 1.8 });
      U.sumber(ctx, "Sumber: php.net");
      ctx.restore();
    }
  };

  S.b0_2 = function (ctx, b, l, t) {
    const tCek = U.at(b, "Di video ini"), mv = ramp(l, tCek - 0.2, 0.7);
    ctx.save(); ctx.translate(0, -mv * 40); const s = lerp(1, 0.72, eio(mv)); ctx.translate(960, 420); ctx.scale(s, s); ctx.translate(-960, -420);
    const gu = ramp(l, 0.2, 1.4);
    X.jendelaPatch(ctx, 200, 1720, 560, { gap: lerp(0.2, 0.86, eio(gu)), dots: [] });
    U.muncul(ctx, l, U.at(b, "setelah sebuah"), 960, 180, () => X.jam(ctx, 960, 180, 0.95, t));
    ctx.restore();
    if (mv > 0) U.geser(ctx, l, tCek - 0.1, 0, 200, () => U.termKetik(ctx, 520, 700, 880, 230, [{ cmd: "php -v", t0: U.at(b, "memeriksa") - 0.4, out: [] }], l, { size: 44, contoh: false }));
  };

  S.b0_3 = function (ctx, b, l, t) {
    const tJ = U.at(b, "Java"), tJam = U.at(b, "sekitar satu jam");
    U.geser(ctx, l, 0.1, -300, 0, () => X.kartuCVE(ctx, 150, 330, { w: 900, h: 330, tag: "CELAH JAVA", id: "Java4Shell", title: "CVE-2026-114938", col: C.red, date: "diumumkan 17 Nov 2026" }));
    const sw = U.muncul(ctx, l, 0.6, 1420, 480, () => U.stopwatch(ctx, 1420, 480, 380, eio(ramp(l, 0.8, Math.max(0.8, tJam - 0.2))), C.amber));
    if (sw) { U.muncul(ctx, l, tJam, 1420, 790, () => U.pill(ctx, "±1 jam", 1420, 790, { size: 56, col: C.amber })); }
    U.judul(ctx, "AI ikut mencari celah", l, 0.3, { y: 190, col: C.php });
    T(ctx, "menurut Calif", 1824, 64, 30, { align: "right", weight: 700, color: C.text2 });
  };

  S.b0_4 = function (ctx, b, l, t) {
    const tBaca = U.at(b, "membaca patch"), tSer = U.at(b, "lalu menyerang"), tTanpa = U.at(b, "tanpa bantuan");
    // diff kecil di kiri
    U.geser(ctx, l, 0.1, -300, 0, () => { const f = X.windowFrame(ctx, 110, 300, 620, 420, { tab: "patch.diff" });
      X.code(ctx, f.x + 30, f.y + 70, [{ t: "- memcpy(out, in, len);", color: C.red, bg: U.rgba(C.red, 0.16) }, { t: "+ if (len > cap) return;", color: C.term, bg: U.rgba(C.term, 0.14) }, { t: "+ memcpy(out, in, len);", color: C.term, bg: U.rgba(C.term, 0.14) }], { size: 30, lh: 66, w: 580, pad: 26 }); });
    // kotak exploit_agent
    const bx = 820, by = 400, bw = 520, bh = 220;
    U.muncul(ctx, l, tBaca - 0.4, bx + bw / 2, by + bh / 2, () => { U.kotak(ctx, bx, by, bw, bh, "", { col: C.red, glow: 0.5 + 0.2 * Math.sin(t * 6) }); T(ctx, "exploit_agent", bx + bw / 2, by + 125, 52, { align: "center", mono: true, weight: 700, color: C.red }); });
    // diff mengalir masuk ke kotak
    const fl = ramp(l, tBaca, 0.9); if (fl > 0 && fl < 1) for (let i = 0; i < 4; i++) { const u = clamp(fl * 1.4 - i * 0.12); if (u <= 0 || u >= 1) continue; const x = lerp(720, bx + 40, eio(u)), y = 520 + (i - 1.5) * 30; ctx.fillStyle = i % 2 ? C.term : C.red; ctx.fillRect(x, y, 60, 10); }
    U.panah(ctx, bx + bw, by + bh / 2, 1580, 510, C.red, eio(ramp(l, tSer, 0.5)), { lw: 8, head: 30 });
    U.muncul(ctx, l, tSer + 0.3, 1680, 510, () => U.server(ctx, 1680, 510, 280, { glow: 0.3, led: ramp(l, tSer + 0.5, 0.1) > 0 && Math.floor(t * 6) % 2 ? C.red : C.term }));
    if (l > tTanpa - 0.1) U.muncul(ctx, l, tTanpa - 0.1, 1080, 800, () => { U.orang(ctx, 1080, 790, 110, C.text2); U.silang(ctx, 1080, 800, 160, ramp(l, tTanpa + 0.1, 0.4)); T(ctx, "tanpa manusia", 1080, 930, 44, { align: "center", weight: 800, color: C.red }); });
    U.sumber(ctx, "Sumber: Google Threat Intelligence Group, 16 Nov 2026");
  };

  U.reg(0, S);
})(typeof window !== "undefined" ? window : globalThis);
