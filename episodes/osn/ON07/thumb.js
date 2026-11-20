/* Thumbnail ON07 (digambar dengan adegan jadwal): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx, b0, l0, t0, TL) {
  const { C } = Kiko, H = Kiko.helpers;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 70, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1830, 112, 36, { mono: true, weight: 700, color: C.green, align: "right" });
  H.text(ctx, "10 hari latihan,", 90, 270, 130, { disp: true, weight: 800 });
  H.text(ctx, "poin terbesar?", 90, 410, 130, { disp: true, weight: 800, color: C.red });
  const fb = { id: "x", text: "sepuluh agenda poin besar", start: 0, speech: 0, audio: 1, mode: "kait" };
  ctx.save(); ctx.translate(150, 360); ctx.scale(0.88, 0.88);
  Kiko.SCENES.jadwal(ctx, fb, 50, 50, TL);
  ctx.restore();
};
