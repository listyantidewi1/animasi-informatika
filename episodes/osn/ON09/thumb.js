/* Thumbnail ON09 (kartu dari scenes.js): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx, b0, l0, t0, TL) {
  const { C } = Kiko, H = Kiko.helpers, K = Kiko.ON09;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 70, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1830, 112, 36, { mono: true, weight: 700, color: C.green, align: "right" });
  H.text(ctx, "333.333 jentikan,", 90, 300, 140, { disp: true, weight: 800 });
  H.text(ctx, "huruf apa", 90, 450, 140, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "yang tersisa?", 90, 600, 140, { disp: true, weight: 800, color: C.red });
  const L = ["A", "B", "C", "D", "E", "F", "G", "H", "?"];
  L.forEach((ch, i) => K.kartu(ctx, 90 + i * 196, 720, ch, { w: 170, h: 230, size: 120, hl: ch === "?" ? C.red : null, color: ch === "?" ? C.red : C.ink, fill: ch === "?" ? C.redBg : C.panel }));
  K.simpul(ctx, 1560, 330, "F", { r: 70, fill: C.greenBg, stroke: C.green });
  K.simpul(ctx, 1760, 220, "H", { r: 70, fill: C.greenBg, stroke: C.green });
  K.simpul(ctx, 1760, 440, "I", { r: 70, fill: C.greenBg, stroke: C.green });
  H.arrow(ctx, 1625, 290, 1690, 245, { color: C.green, lw: 7, head: 24 }); H.arrow(ctx, 1760, 295, 1760, 365, { color: C.green, lw: 7, head: 24 }); H.arrow(ctx, 1695, 420, 1630, 370, { color: C.green, lw: 7, head: 24 });
};
