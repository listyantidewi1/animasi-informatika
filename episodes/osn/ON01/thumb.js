/* Thumbnail ON01 (digambar dengan inti OSN-K): 1920x1080, diperkecil ke 1280x720. */
Kiko.SCENES.thumb = function (ctx) {
  const { C } = Kiko, H = Kiko.helpers;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 80, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "20 koin,", 90, 330, 150, { disp: true, weight: 800 });
  H.text(ctx, "1 label palsu.", 90, 480, 150, { disp: true, weight: 800, color: C.purple });
  H.text(ctx, "Cukup sekali", 90, 690, 150, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "timbang?", 90, 840, 150, { disp: true, weight: 800, color: C.red });
  H.scale(ctx, 1500, 640, 640, "? g", { dispColor: C.red });
  const L = "ABCDE"; for (let i = 0; i < 5; i++) H.coin(ctx, 1240 + i * 130, 560, 58, i === 2 ? "?" : L[i], { fake: i === 2 });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1500, 1010, 40, { mono: true, weight: 700, color: C.green, align: "center" });
};
