/* Thumbnail ON08 (gayung dan bebek dari scenes.js): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx, b0, l0, t0, TL) {
  const { C } = Kiko, H = Kiko.helpers, G = Kiko.ON08;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 70, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1830, 112, 36, { mono: true, weight: 700, color: C.green, align: "right" });
  H.text(ctx, "2 gayung,", 90, 300, 140, { disp: true, weight: 800 });
  H.text(ctx, "bebek mana", 90, 450, 140, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "tak bisa mandi?", 90, 600, 140, { disp: true, weight: 800, color: C.red });
  G.gayung(ctx, 1330, 330, "3L", 1.25);
  G.gayung(ctx, 1640, 330, "100L", 1.35, { color: C.red });
  [[230, 900, "1", 1], [480, 900, "2", 1], [730, 900, "3", 0], [980, 900, "6", 0], [1230, 900, "…", 2], [1530, 900, "?", 2]].forEach(([x, y, n, k]) =>
    G.bebek(ctx, x, y, n, 1.35, { sad: k === 1, no: k === 1 ? 1 : 0, ok: k === 0 ? 1 : 0 }));
};
