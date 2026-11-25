/* Thumbnail ON06 (digambar dengan adegan graf): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx, b0, l0, t0, TL) {
  const { C } = Kiko, H = Kiko.helpers;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 70, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1830, 112, 36, { mono: true, weight: 700, color: C.green, align: "right" });
  H.text(ctx, "Berapa rute", 90, 300, 150, { disp: true, weight: 800 });
  H.text(ctx, "dari A ke H?", 955, 300, 150, { disp: true, weight: 800, color: C.red });
  const fb = { id: "x", text: "A gembok x x x x x x x x berapa", start: 0, speech: 0, audio: 100, mode: "kait" };
  ctx.save(); ctx.translate(40, 290);
  Kiko.SCENES.graf(ctx, fb, 50, 50, TL);
  ctx.restore();
  // tanda tanya di atas H
  const hx = 40 + 1720, hy = 290 + 470 - 95;
  ctx.beginPath(); ctx.arc(hx, hy, 46, 0, Math.PI * 2); ctx.fillStyle = C.red; ctx.fill();
  H.text(ctx, "?", hx, hy + 22, 64, { disp: true, weight: 800, align: "center", color: "#FFFFFF" });
};
