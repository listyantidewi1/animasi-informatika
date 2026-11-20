/* Thumbnail ON11 (koridor dan penguat dari scenes.js): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx, b0, l0, t0, TL) {
  const { C } = Kiko, H = Kiko.helpers, K = Kiko.ON11;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 70, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1830, 112, 36, { mono: true, weight: 700, color: C.green, align: "right" });
  H.text(ctx, "150 ruang kelas.", 90, 300, 130, { disp: true, weight: 800 });
  H.text(ctx, "Berapa penguat", 90, 440, 130, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "sinyal?", 90, 580, 130, { disp: true, weight: 800, color: C.red });
  // deretan ruang dengan profil sinyal
  const x0 = 60, cw = 60, base = 940;
  for (let r = 0; r < 30; r++) { H.rr(ctx, x0 + r * cw + 3, base, cw - 6, 70, 8); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke(); }
  [4.5, 12.5, 20.5].forEach(a => { K.tent(ctx, x0 + a * cw, base - 6, 5.5 * cw, 240, { lw: 5 }); K.wifi(ctx, x0 + a * cw, base - 260, 60, C.purple); });
  K.wifi(ctx, x0 + 27.5 * cw, base - 260, 60, C.red, 0.9);
  H.text(ctx, "?", x0 + 27.5 * cw + 70, base - 280, 150, { disp: true, weight: 800, color: C.red });
  ctx.save(); ctx.setLineDash([14, 10]); ctx.lineWidth = 5; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(x0, base - 140); ctx.lineTo(x0 + 30 * cw, base - 140); ctx.stroke(); ctx.restore();
};
