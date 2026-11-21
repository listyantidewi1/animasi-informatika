/* D09 bab 3 — Bagaimana AI ikut mencari celah (b3_1 … b3_10): Java4Shell dari Calif, editor + panel AI, ±1 jam / +2 jam / < $200,
   kode sejak Juni 2021, pemindai kode, fuzzing, ahli → laptop, responsible disclosure, alur empat langkah. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d09, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080;
  const S = {};
  const kartuJ = (ctx, x, y, w) => X.kartuCVE(ctx, x, y, { w: w || 1000, h: 330, tag: "CELAH JAVA · OPENJDK", id: "Java4Shell", title: "CVE-2026-114938 · Base64 decoder", col: C.red, date: "diumumkan Calif" });
  const calif = ctx => T(ctx, "menurut Calif", 1824, 64, 30, { align: "right", weight: 700, color: C.text2 });

  S.b3_1 = function (ctx, b, l, t) {
    U.geser(ctx, l, 0.2, 0, 220, () => kartuJ(ctx, 460, 330));
    U.muncul(ctx, l, U.at(b, "tujuh belas November") - 0.1, 1340, 760, () => X.cap(ctx, "17 NOV 2026", 1320, 760, -0.1, C.amber, 56), { k0: 1.7 });
    U.muncul(ctx, l, U.at(b, "bernama Calif"), 700, 800, () => U.pill(ctx, "Calif · perusahaan keamanan", 700, 800, { size: 42, col: C.php }));
  };

  S.b3_2 = function (ctx, b, l, t) {
    const tAI = U.at(b, "memakai asisten"), tJam = U.at(b, "sekitar satu jam");
    calif(ctx);
    const f = X.windowFrame(ctx, 100, 150, 1000, 680, { tab: "Base64Decoder.java" });
    X.code(ctx, f.x + 40, f.y + 80, ["byte[] decode(byte[] src) {", "  int len = outLength(src);", "  byte[] dst = new byte[len];", "  // ...", "  decodeBlock(src, dst);", "  return dst;", "}"], { size: 32, lh: 60, w: 920, pad: 24 });
    U.geser(ctx, l, tAI - 0.2, 300, 0, () => U.panelAI(ctx, 1130, 150, 690, 520, [{ s: "Cari bug memori di decoder ini.", saya: true }, { s: "Baris 5 mencurigakan ...", mono: false }], l, tAI + 0.3));
    T(ctx, "peneliti: Quang Luong", 600, 900, 40, { align: "center", weight: 700, color: C.text2 });
    U.muncul(ctx, l, U.at(b, "Dengan bantuan"), 1470, 790, () => { U.stopwatch(ctx, 1380, 800, 150, eio(ramp(l, U.at(b, "Dengan bantuan"), Math.max(0.8, tJam - U.at(b, "Dengan bantuan"))))); if (l > tJam) U.pill(ctx, "±1 jam", 1600, 800, { size: 52, col: C.amber }); });
  };

  S.b3_3 = function (ctx, b, l, t) {
    const tDua = U.at(b, "Dua jam"), tBi = U.at(b, "Biaya pemakaian"), tDol = U.at(b, "dua ratus dolar");
    calif(ctx);
    const y = 330; U.garisWaktu(ctx, 200, 1720, y, eio(ramp(l, 0, 1.2)));
    U.titik(ctx, 200, y, C.text2, 14); T(ctx, "mulai", 200, y - 40, 40, { align: "center", weight: 700, color: C.text2 });
    U.muncul(ctx, l, 0.4, 700, y, () => { U.titik(ctx, 700, y, C.amber, 16); T(ctx, "1 jam", 700, y - 40, 44, { align: "center", weight: 800, color: C.amber }); T(ctx, "celah ditemukan", 700, y + 70, 40, { align: "center", weight: 700 }); });
    U.muncul(ctx, l, tDua, 1450, y, () => { U.titik(ctx, 1450, y, C.red, 16); T(ctx, "+2 jam", 1450, y - 40, 44, { align: "center", weight: 800, color: C.red }); T(ctx, "exploit awal", 1450, y + 70, 40, { align: "center", weight: 700 }); });
    // isi exploit tidak ditampilkan: kotak buram
    U.muncul(ctx, l, tDua + 0.6, 1450, 620, () => { U.kotak(ctx, 1200, 480, 500, 260, "", { col: C.red }); for (let i = 0; i < 5; i++) { ctx.fillStyle = U.rgba(C.text2, 0.12 + 0.05 * Math.sin(t * 3 + i)); U.rr(ctx, 1240, 520 + i * 42, 300 + (i * 67) % 120, 22, 8); ctx.fill(); }
      T(ctx, "isi exploit tidak ditampilkan", 1450, 800, 34, { align: "center", weight: 600, color: C.dim }); });
    U.muncul(ctx, l, tBi, 600, 650, () => U.struk(ctx, 600, 650, 300, ["BIAYA AI", "Java4Shell", "< $200"]));
    if (l > tDol) X.glow(ctx, 600, 740, 180, C.amber, 0.3);
  };

  S.b3_4 = function (ctx, b, l, t) {
    const tJun = U.at(b, "sejak Juni"), tArt = U.at(b, "Artinya"), y = 520;
    U.judul(ctx, "Kode Base64 di OpenJDK", l, 0.3, { y: 180 });
    const x0 = 260, x1 = 1660; U.garisWaktu(ctx, x0, x1, y, eio(ramp(l, tJun - 0.3, 1.5)));
    U.muncul(ctx, l, tJun, x0, y, () => { U.titik(ctx, x0, y, C.php, 18); T(ctx, "Jun 2021", x0, y - 50, 48, { align: "center", weight: 800, color: C.php }); T(ctx, "kode masuk", x0, y + 80, 40, { align: "center", weight: 700, color: C.text2 }); });
    U.muncul(ctx, l, tJun + 1.4, x1, y, () => { U.titik(ctx, x1, y, C.red, 18); T(ctx, "Nov 2026", x1, y - 50, 48, { align: "center", weight: 800, color: C.red }); T(ctx, "ditemukan", x1, y + 80, 40, { align: "center", weight: 700, color: C.text2 }); });
    const a = ramp(l, tArt, 0.5); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = U.rgba(C.amber, 0.12); ctx.fillRect(x0 + 30, y - 24, x1 - x0 - 60, 48);
      U.pill(ctx, "±5 tahun tidak ketahuan", 960, 720, { size: 52, col: C.amber }); ctx.restore(); }
  };

  S.b3_5 = function (ctx, b, l, t) {
    const tTan = U.at(b, "menandai bagian"), stop = U.at(b, "misalnya tempat");
    U.judul(ctx, "1. Membaca kode tanpa lelah", l, 0.3, { y: 150, col: C.php });
    const f = X.windowFrame(ctx, 260, 210, 1400, 640, { tab: "decoder.c" });
    ctx.save(); ctx.beginPath(); ctx.rect(f.x - 40, f.y, f.w + 80, f.h - 4); ctx.clip();
    const scroll = l < stop ? (l * 340) % (U.KODE_C.length * 52) : 0;
    const lines = []; for (let i = 0; i < 26; i++) { const s = U.KODE_C[i % U.KODE_C.length]; lines.push(l >= stop && i === 7 ? { t: s, bg: U.rgba(C.amber, 0.22), mark: C.amber, markCh: "!" } : s); }
    X.code(ctx, f.x + 40, f.y + 60 - scroll, lines, { size: 32, lh: 52, w: f.w + 40, pad: 30 });
    // pemindai ungu
    const sy = l < stop ? f.y + ((l * 600) % f.h) : f.y + 60 + 7 * 52 - 30; const gr = ctx.createLinearGradient(0, sy - 80, 0, sy + 6); gr.addColorStop(0, U.rgba(C.php, 0)); gr.addColorStop(1, U.rgba(C.php, 0.35));
    ctx.fillStyle = gr; ctx.fillRect(f.x - 40, sy - 80, f.w + 80, 86); ctx.fillStyle = C.php; ctx.fillRect(f.x - 40, sy, f.w + 80, 3);
    ctx.restore();
    if (l > stop) U.pill(ctx, "menulis tanpa cek batas", 1300, 940 - 80, { size: 42, col: C.amber });
    U.ai(ctx, 1730, 300, 120, C.php, { glow: 0.5 });
  };

  S.b3_6 = function (ctx, b, l, t) {
    const tFz = U.at(b, "Cara ini"), tRus = U.at(b, "mulai rusak");
    U.judul(ctx, "2. Ribuan masukan aneh", l, 0.3, { y: 150, col: C.php });
    // pelontar
    U.kotak(ctx, 180, 460, 300, 200, "pelontar\nmasukan", { col: C.php, size: 40 });
    const prog = { x: 1240, y: 380, w: 480, h: 360 }, broken = l > tRus;
    U.kotak(ctx, prog.x, prog.y, prog.w, prog.h, "program", { col: broken ? C.red : C.text2, size: 56, glow: broken ? 0.5 : 0, color: broken ? C.red : C.text });
    if (broken) { ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(prog.x + 180, prog.y); ctx.lineTo(prog.x + 230, prog.y + 120); ctx.lineTo(prog.x + 200, prog.y + 200); ctx.lineTo(prog.x + 260, prog.y + 360); ctx.stroke(); }
    const R = ["%%%%", "\\x00", "A×999", "-1", "😀😀", "==?", "NaN", "{{{"];
    for (let i = 0; i < 9; i++) { const ph = ((l * 1.3 + i / 9) % 1), x = lerp(500, prog.x - 60, ph), y = 560 + Math.sin(i * 2.3) * 120 * (1 - ph);
      ctx.save(); ctx.globalAlpha *= clamp(ph * 5) * clamp((1 - ph) * 8); U.kotak(ctx, x - 60, y - 34, 120, 68, R[i % R.length], { col: C.amber, size: 28, mono: true, r: 10 }); ctx.restore(); }
    const n = Math.floor(Math.max(0, l - 0.5) * 813); T(ctx, "masukan diuji: " + n.toLocaleString("id-ID"), 960, 860, 46, { align: "center", mono: true, weight: 700, color: C.amber });
    U.muncul(ctx, l, tFz, 960, 300, () => T(ctx, "fuzzing", 960, 300, 96, { align: "center", mono: true, weight: 700, color: C.amber, glow: C.amber, blur: 20 }));
  };

  S.b3_7 = function (ctx, b, l, t) {
    const tSek = U.at(b, "Sekarang"), tMur = U.at(b, "jauh lebih murah"), u = ramp(l, tSek - 0.2, 0.6);
    ctx.save(); ctx.globalAlpha *= 1 - u; U.kotak(ctx, 460, 300, 1000, 460, "", { col: C.line });
    [0, 1, 2].forEach(i => U.orang(ctx, 700 + i * 260, 520, 180, C.text2)); T(ctx, "segelintir ahli", 960, 700, 48, { align: "center", weight: 800 }); ctx.restore();
    if (u > 0) { ctx.save(); ctx.globalAlpha *= u; U.laptop(ctx, 860, 520, 420, C.php); U.ai(ctx, 860, 500, 140, C.php, { glow: 0.5 }); T(ctx, "satu laptop + AI", 860, 800, 48, { align: "center", weight: 800 }); ctx.restore(); }
    U.muncul(ctx, l, tMur - 0.2, 1450, 560, () => U.struk(ctx, 1450, 540, 300, ["BIAYA AI", "Java4Shell", "< $200"]));
  };

  S.b3_8 = function (ctx, b, l, t) {
    const tDil = U.at(b, "dilaporkan lebih dulu"), tBer = U.at(b, "terbit bersamaan");
    U.muncul(ctx, l, 0.2, 960, 330, () => { U.perisai(ctx, 960, 320, 240, C.term, { glow: 0.5 }); T(ctx, "peneliti yang bertanggung jawab", 960, 520, 52, { align: "center", weight: 800, color: C.term }); });
    U.muncul(ctx, l, tDil, 960, 600, () => T(ctx, "dilaporkan lebih dulu", 960, 610, 44, { align: "center", weight: 600, color: C.text2 }));
    U.geser(ctx, l, tBer - 0.3, -300, 0, () => U.kotak(ctx, 380, 680, 520, 150, "Pengumuman\n17 Nov", { col: C.amber, size: 44 }));
    U.geser(ctx, l, tBer - 0.3, 300, 0, () => U.kotak(ctx, 1020, 680, 520, 150, "Patch Oracle\n17 Nov", { col: C.term, size: 44, color: C.term }));
    if (l > tBer + 0.4) T(ctx, "=", 960, 790, 70, { align: "center", weight: 900, color: C.text2 });
  };

  const LANGKAH = ["Ditemukan", "Dilaporkan\ndiam-diam", "Patch\ndibuat", "Diumumkan"];
  function alur(ctx, l, ts, fokus) {
    LANGKAH.forEach((s, i) => { const x = 140 + i * 430, y = 400, a = ts ? ramp(l, ts[i] - 0.2, 0.4) : 1; if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; U.kotak(ctx, x, y, 360, 200, s, { col: i === 3 ? C.amber : i === 2 ? C.term : C.php, size: 44, glow: fokus === i ? 0.4 : 0 });
      U.gembok(ctx, x + 180, y + 290, 90, i === 3 ? 1 : 0, i === 3 ? C.amber : C.text2);
      if (i < 3) U.panah(ctx, x + 370, y + 100, x + 420, y + 100, C.text2, 1, { lw: 5, head: 16 }); ctx.restore(); });
  }
  S.b3_9 = function (ctx, b, l, t) {
    U.judul(ctx, "Alur pelaporan yang bertanggung jawab", l, 0.2, { y: 200 });
    alur(ctx, l, [U.at(b, "Celah ditemukan"), U.at(b, "dilaporkan diam-diam"), U.at(b, "Setelah patch"), U.at(b, "diumumkan ke publik")]);
  };
  S.b3_10 = function (ctx, b, l, t) {
    const z = eio(ramp(l, U.at(b, "Jawabannya"), 1.4)), cx = 140 + 2 * 430 + 180, cy = 500;
    ctx.save(); ctx.translate(960, 540); const k = lerp(1, 2.6, z); ctx.scale(k, k); ctx.translate(-lerp(960, cx, z), -lerp(540, cy, z)); alur(ctx, l, null, 2); ctx.restore();
    if (z < 0.5) U.judul(ctx, "Patch sudah ada, kenapa masih berbahaya?", l, 0.3, { y: 200, col: C.amber, a: 1 - z * 2 });
  };

  U.reg(3, S);
})(typeof window !== "undefined" ? window : globalThis);
