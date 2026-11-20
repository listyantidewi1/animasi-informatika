/* Thumbnail ON10 (deret bit dari scenes.js): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx, b0, l0, t0, TL) {
  const { C } = Kiko, H = Kiko.helpers, K = Kiko.ON10;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 70, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1830, 112, 36, { mono: true, weight: 700, color: C.green, align: "right" });
  H.text(ctx, "String lebih panjang", 90, 300, 130, { disp: true, weight: 800 });
  H.text(ctx, "dari alam semesta.", 90, 440, 130, { disp: true, weight: 800 });
  H.text(ctx, "Karakter ke-2025?", 90, 600, 130, { disp: true, weight: 800, color: C.red });
  const s = K.TM(3) + "…", d = 170;
  K.bits(ctx, s.slice(0, 8), 90, 730, d, { h: 200, fill: i => i >= 4 ? "#F9E3DF" : "#E3F0E6", stroke: i => i >= 4 ? C.red : C.green, col: i => i >= 4 ? C.red : C.green, lw: 5 });
  H.text(ctx, "…", 90 + 8 * d + 40, 880, 120, { mono: true, weight: 800, color: C.mut });
  H.text(ctx, "?", 90 + 8 * d + 230, 900, 200, { mono: true, weight: 800, color: C.red, align: "center" });
};
