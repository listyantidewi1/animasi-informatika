/* D09 bab 6 — Lima kebiasaan yang menutup jendela lebih cepat (b6_1 … b6_9). Daftar periksa di kiri, terminal/kartu di kanan.
   Semua keluaran terminal berlabel "contoh"; perintah diketik huruf demi huruf, keluaran muncul 0,8 dtk setelah Enter. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d09, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080, TAU = U.TAU;
  const S = {};
  const KB = ["Cek versi", "Audit library", "Robot pengingat", "Tes otomatis", "Ikuti pengumuman"];
  function daftar(ctx, l, aktif, selesai) {
    T(ctx, "5 kebiasaan", 96, 150, 44, { weight: 900, color: C.php });
    KB.forEach((s, i) => { const y = 220 + i * 128, on = i === aktif, done = i < (selesai == null ? aktif : selesai);
      ctx.save(); ctx.globalAlpha *= on ? 1 : done ? 0.75 : 0.4; U.kotak(ctx, 96, y, 500, 104, "", { col: on ? C.amber : done ? C.term : C.line, lw: on ? 4 : 2, glow: on ? 0.25 : 0 });
      T(ctx, String(i + 1), 140, y + 68, 48, { align: "center", weight: 900, color: on ? C.amber : done ? C.term : C.text2 }); T(ctx, s, 180, y + 66, 38, { weight: 800 });
      if (done && !on) U.centang(ctx, 556, y + 52, 36, 1); ctx.restore(); });
  }
  const R0 = 640;   // tepi kiri area kanan

  S.b6_1 = function (ctx, b, l, t) {
    daftar(ctx, l, 0);
    const tB = U.at(b, "Buka terminal"), q = 1 - ramp(l, tB - 0.4, 0.4);
    if (q > 0) U.muncul(ctx, l, 0.3, R0 + 590, 450, () => { U.tagVersi(ctx, R0 + 590, 400 + Math.sin(t * 2) * 10, 260, C.amber); T(ctx, "PHP-mu versi berapa?", R0 + 590, 650, 56, { align: "center", weight: 900 }); }, { a: q });
    if (l > tB - 0.4) U.termKetik(ctx, R0, 230, 1180, 480, [{ cmd: "php -v", t0: U.at(b, "php spasi") - 0.1, cps: 8, out: [{ t: "PHP 8.3.30 (cli) (NTS)", hl: C.amber, color: C.text }, { t: "Copyright (c) The PHP Group", color: C.dim }] }], l, { size: 44 });
    if (l > U.atEnd(b, "minus v.") + 0.9) U.pill(ctx, "versi PHP-mu: 8.3.30", R0 + 590, 820, { size: 44, col: C.amber });
  };

  S.b6_2 = function (ctx, b, l, t) {
    const tTab = U.at(b, "Untuk PHP delapan"), tAm = U.at(b, "versi amannya"), tJ = U.at(b, "java spasi");
    daftar(ctx, l, 0);
    const x = R0, y = 170, w = 640; U.muncul(ctx, l, 0.2, x + w / 2, 420, () => {
      ctx.fillStyle = C.php2; U.rr(ctx, x, y, w, 92, 14); ctx.fill(); T(ctx, "Versi PHP yang sudah di-patch", x + w / 2, y + 60, 36, { align: "center", weight: 800 });
      ["8.2.36", "8.3.37", "8.4.28", "8.5.13", "8.6.0"].forEach((v, i) => { const ry = y + 100 + i * 84, hl = i === 1 && l > tTab;
        ctx.fillStyle = hl ? U.rgba(C.amber, 0.25) : (i % 2 ? C.row1 : C.row2); ctx.fillRect(x, ry, w, 80);
        T(ctx, "PHP " + v.split(".").slice(0, 2).join("."), x + 30, ry + 54, 40, { weight: 700, color: C.text2 });
        T(ctx, v + " ke atas", x + w - 30, ry + 54, 40, { align: "right", mono: true, weight: 700, color: hl ? C.amber : C.term }); }); });
    if (l > tAm + 0.6) { U.pill(ctx, "8.3.30 → perlu update", x + w / 2, 800, { size: 44, col: C.red }); }
    U.muncul(ctx, l, tJ - 0.5, 1560, 450, () => U.termKetik(ctx, 1320, 260, 504, 400, [{ cmd: "java -version", t0: tJ, cps: 9, out: [{ t: "openjdk version", color: C.text }, { t: "\"21.0.5\"", color: C.amber }] }], l, { size: 32 }));
  };

  S.b6_3 = function (ctx, b, l, t) {
    const tC = U.at(b, "composer spasi"), tPer = U.at(b, "Perintah ini");
    daftar(ctx, l, 1);
    const lock = ramp(l, 0.4, 0.4) * (1 - ramp(l, tC - 0.8, 0.4));
    if (lock > 0) { ctx.save(); ctx.globalAlpha *= lock; const f = X.windowFrame(ctx, R0, 200, 1180, 560, { tab: "composer.lock" });
      X.code(ctx, f.x + 30, f.y + 80, ['"packages": [', '  { "name": "contoh/pengunggah-berkas",', '    "version": "2.1.0" },', '  { "name": "contoh/kirim-surel",', '    "version": "4.0.2" }', ']'], { size: 34, lh: 64, w: 1100, pad: 24 }); ctx.restore(); }
    if (l > tC - 0.8) U.termKetik(ctx, R0, 200, 1180, 520, [{ cmd: "composer audit", t0: tC, cps: 10, out: [
      { t: "Found 1 security vulnerability advisory", color: C.text }, { t: "affecting 1 package:", color: C.text }, { t: "contoh/pengunggah-berkas 2.1.0", color: C.red, hl: C.red }] }], l, { size: 40 });
    if (l > tPer + 0.4) U.pill(ctx, "library dengan celah yang sudah diketahui", R0 + 590, 830, { size: 40, col: C.red });
  };

  S.b6_4 = function (ctx, b, l, t) {
    const tPy = U.at(b, "proyek Python"), tJs = U.at(b, "proyek JavaScript");
    daftar(ctx, l, 1);
    U.muncul(ctx, l, tPy - 0.3, R0 + 290, 480, () => { T(ctx, "Python", R0 + 290, 250, 44, { align: "center", weight: 800, color: C.amber }); U.termKetik(ctx, R0, 290, 570, 400, [{ cmd: "pip-audit", t0: tPy + 0.2, cps: 9, out: [{ t: "No known", color: C.term }, { t: "vulnerabilities found", color: C.term }] }], l, { size: 34 }); });
    U.muncul(ctx, l, tJs - 0.3, R0 + 900, 480, () => { T(ctx, "JavaScript", R0 + 900, 250, 44, { align: "center", weight: 800, color: C.amber }); U.termKetik(ctx, R0 + 610, 290, 570, 400, [{ cmd: "npm audit", t0: tJs + 0.2, cps: 9, out: [{ t: "found 0", color: C.term }, { t: "vulnerabilities", color: C.term }] }], l, { size: 34 }); });
    if (l > U.at(b, "Cara kerjanya")) U.pill(ctx, "cara kerjanya mirip", R0 + 590, 800, { size: 44, col: C.php });
  };

  function kartuPR(ctx, x, y, l, t) {
    U.kotak(ctx, x, y, 1180, 300, "", { col: C.term });
    U.robot(ctx, x + 80, y + 90, 90, C.term);
    T(ctx, "Perbarui contoh/pengunggah-berkas", x + 150, y + 82, 44, { weight: 800 });
    T(ctx, "dari 2.1.0 ke 2.1.3", x + 150, y + 142, 40, { mono: true, weight: 600, color: C.text2 });
    U.pill(ctx, "security", x + 230, y + 230, { size: 36, col: C.red }); T(ctx, "pull request otomatis", x + 420, y + 242, 36, { weight: 600, color: C.dim });
  }
  S.b6_5 = function (ctx, b, l, t) {
    const tD = U.at(b, "fitur Dependabot"), tPR = U.at(b, "pull request otomatis");
    daftar(ctx, l, 2);
    U.muncul(ctx, l, 0.4, R0 + 590, 300, () => { U.robot(ctx, R0 + 590, 330, 220, C.term); T(ctx, "Dependabot", R0 + 590, 520, 52, { align: "center", weight: 800, color: C.term, a: 1 }); }, { a: 1 - ramp(l, tPR - 0.4, 0.4) });
    if (l < tD) T(ctx, "robot pengingat di GitHub", R0 + 590, 620, 44, { align: "center", weight: 700, color: C.text2 });
    U.geser(ctx, l, tPR - 0.3, 0, 200, () => kartuPR(ctx, R0, 330, l, t));
  };

  S.b6_6 = function (ctx, b, l, t) {
    const tLol = U.at(b, "semua tes lolos"), tDen = U.at(b, "Dengan begitu");
    daftar(ctx, l, 3); kartuPR(ctx, R0, 160, l, t);
    ["tes unit", "tes login", "tes unggah berkas"].forEach((s, i) => { const y = 520 + i * 86, ok = l > tLol - 0.6 + i * 0.4; const col = ok ? C.term : C.amber;
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(R0 + 40, y, 16, 0, TAU); ctx.fill(); T(ctx, s, R0 + 80, y + 14, 40, { weight: 700 }); T(ctx, ok ? "lolos" : "berjalan ...", R0 + 700, y + 14, 40, { weight: 800, color: col }); });
    const on = l > tLol + 0.8; U.kotak(ctx, R0 + 860, 720, 300, 100, "Merge", { col: on ? C.term : C.line, fill: on ? U.rgba(C.term, 0.25) : C.panel, size: 44, color: on ? C.text : C.dim, glow: on ? 0.3 : 0 });
    if (l > tDen) U.pill(ctx, "cepat tanpa takut merusak", R0 + 380, 880, { size: 40, col: C.php });
  };

  S.b6_7 = function (ctx, b, l, t) {
    const tP = U.at(b, "Untuk PHP"), tG = U.at(b, "Untuk library");
    daftar(ctx, l, 4);
    U.lonceng(ctx, R0 + 70, 220, 90, C.amber, l > tP ? t : 0); T(ctx, "Pengumuman keamanan", R0 + 140, 240, 48, { weight: 800 });
    [["19 Nov", "PHP 8.3.37 Released (security)", tP], ["21 Okt", "PHP 8.3.36 Released (security)", tP + 0.6]].forEach(([d, s, t0], i) => U.geser(ctx, l, t0, 0, -60, () => {
      const y = 310 + i * 130; U.kotak(ctx, R0, y, 1180, 110, "", { col: C.php }); T(ctx, d, R0 + 30, y + 70, 40, { weight: 800, color: C.amber }); T(ctx, s, R0 + 220, y + 70, 40, { weight: 700 }); }));
    T(ctx, "php.net", R0 + 1150, 290, 32, { align: "right", weight: 700, color: C.dim });
    U.geser(ctx, l, tG - 0.2, 0, 100, () => { U.kotak(ctx, R0, 620, 1180, 200, "", { col: C.text2 }); T(ctx, "Security Advisories", R0 + 40, 700, 48, { weight: 800 }); T(ctx, "di halaman setiap library di GitHub", R0 + 40, 770, 40, { weight: 600, color: C.text2 }); });
  };

  S.b6_8 = function (ctx, b, l, t) {
    const tMen = U.at(b, "menyusut"), gap = lerp(1, 0.18, eio(ramp(l, tMen - 1.0, 2.2)));
    const j = X.jendelaPatch(ctx, 200, 1660, 470, { gap, dots: [] });
    // titik serangan datang dari kanan dan tertahan di luar jendela
    for (let i = 0; i < 14; i++) { const ph = (l * 0.35 + i / 14) % 1, x = lerp(1820, j.b + 60, eout(ph)), y = 470 + Math.sin(i * 1.7) * 110; ctx.save(); ctx.globalAlpha *= clamp(ph * 4) * 0.9; X.glow(ctx, x, y, 22, C.red, 0.8); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); ctx.restore(); }
    { ctx.save(); ctx.font = `800 32px ${X.SANS}`; const ws = KB.map(s => ctx.measureText(s).width + 35 + 24); ctx.restore(); const tot = ws.reduce((a, c) => a + c, 0) + 4 * 20; let x = 960 - tot / 2;
      KB.forEach((s, i) => { const cx = x + ws[i] / 2; x += ws[i] + 20; U.muncul(ctx, l, U.at(b, "lima kebiasaan") + i * 0.2, cx, 870, () => U.pill(ctx, s, cx, 870, { size: 32, col: C.term })); }); }
  };

  S.b6_9 = function (ctx, b, l, t) {
    const tAI = U.at(b, "minta juga AI"), tJan = U.at(b, "jangan langsung percaya"), tJal = U.at(b, "Jalankan sendiri");
    const f = X.windowFrame(ctx, 96, 160, 860, 640, { tab: "composer.json" });
    X.code(ctx, f.x + 30, f.y + 80, ['{', '  "require": {', '    "php": "^8.3",', '    "contoh/pengunggah-berkas": "^2.1"', '  }', '}'], { size: 30, lh: 60, w: 800, pad: 24 });
    U.geser(ctx, l, tAI - 0.2, 200, 0, () => U.panelAI(ctx, 1000, 160, 824, 340, [{ s: "Cek versi dan library proyekku.", saya: true }, { s: "Perbarui PHP ke 8.3.37.", t: tAI + 1.2 }], l, tAI + 0.3));
    if (l > tJan) U.muncul(ctx, l, tJan, 1412, 520, () => U.pill(ctx, "jangan langsung percaya", 1412, 540, { size: 40, col: C.amber }));
    if (l > tJal - 0.6) U.termKetik(ctx, 1000, 600, 824, 280, [{ cmd: "composer audit", t0: tJal, cps: 12, out: [{ t: "No security vulnerability", color: C.term }, { t: "advisories found.", color: C.term }], gap: false }], l, { size: 32 });
  };

  U.reg(6, S);
})(typeof window !== "undefined" ? window : globalThis);
