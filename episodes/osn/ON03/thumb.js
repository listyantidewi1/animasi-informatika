/* Thumbnail ON03 (digambar dengan inti OSN-K): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx) {
  const { C } = Kiko, H = Kiko.helpers;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 80, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "5 kertas,", 90, 340, 150, { disp: true, weight: 800 });
  H.text(ctx, "1 mustahil.", 90, 510, 150, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "Yang mana?", 90, 690, 130, { disp: true, weight: 800 });
  H.text(ctx, "Mesin BCS · stack", 90, 840, 60, { mono: true, weight: 800, color: C.green });
  // tabung berisi koin
  const tx = 1060, tb = 900;
  ctx.save(); ctx.fillStyle = C.panel; ctx.fillRect(tx, 400, 170, tb - 400); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(tx, 400); ctx.lineTo(tx, tb); ctx.lineTo(tx + 170, tb); ctx.lineTo(tx + 170, 400); ctx.stroke(); ctx.restore();
  ["1", "2", "4"].forEach((s, i) => H.coin(ctx, tx + 85, tb - 80 - i * 150, 70, s, {}));
  H.text(ctx, "B · C · S", tx + 85, 340, 52, { mono: true, weight: 800, align: "center", color: C.green });
  // lima kertas
  ["453216", "321654", "243651", "534621", "123456"].forEach((s, i) => {
    const y = 170 + i * 160;
    H.text(ctx, "ABCDE"[i], 1340, y + 92, 56, { mono: true, weight: 800, color: C.green });
    H.rr(ctx, 1400, y + 20, 440, 110, 12); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.line; ctx.stroke();
    [...s].forEach((c, k) => H.text(ctx, c, 1445 + k * 70, y + 98, 64, { mono: true, weight: 800, align: "center" }));
  });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1590, 1040, 36, { mono: true, weight: 700, color: C.green, align: "center" });
};
