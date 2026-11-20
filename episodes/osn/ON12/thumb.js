/* Thumbnail ON12 (telur dan mesin dari scenes.js): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx, b0, l0, t0, TL) {
  const { C } = Kiko, H = Kiko.helpers, K = Kiko.ON12;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 70, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1830, 112, 36, { mono: true, weight: 700, color: C.green, align: "right" });
  H.text(ctx, "7 telur, 2 telur emas.", 90, 300, 120, { disp: true, weight: 800 });
  H.text(ctx, "Berapa kali", 90, 440, 130, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "mesin dipakai?", 90, 580, 130, { disp: true, weight: 800, color: C.red });
  for (let i = 1; i <= 7; i++) K.egg(ctx, 190 + (i - 1) * 255, 860, 82, String(i), { q: true });
  K.mesin(ctx, 1240, 330, 600, 230, { res: "ada" });
};
