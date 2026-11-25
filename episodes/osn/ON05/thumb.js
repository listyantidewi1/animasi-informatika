/* Thumbnail ON05 (digambar dengan inti OSN-K): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx) {
  const { C } = Kiko, H = Kiko.helpers;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 80, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "10 tombol,", 90, 330, 140, { disp: true, weight: 800 });
  H.text(ctx, "6 tekanan.", 90, 490, 140, { disp: true, weight: 800 });
  H.text(ctx, "Berapa", 90, 670, 130, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "urutan?", 90, 820, 130, { disp: true, weight: 800, color: C.red });
  const TGT = (r, c) => ((r === 2 || r === 5) ? 1 : 0) ^ ((c === 1 || c === 3) ? 1 : 0);
  const x = 1080, y = 200, s = 130;
  ctx.fillStyle = C.ink; H.rr(ctx, x - 8, y - 8, s * 5 + 16, s * 5 + 16, 12); ctx.fill();
  for (let r = 1; r <= 5; r++) for (let c = 0; c < 5; c++) {
    const on = TGT(r, c), cx = x + s * c, cy = y + s * (r - 1);
    ctx.fillStyle = on ? "#EFE6CC" : "#8C877A"; ctx.fillRect(cx + 3, cy + 3, s - 6, s - 6);
    if (on) { ctx.beginPath(); ctx.arc(cx + s / 2, cy + s / 2, s * 0.45, 0, Math.PI * 2); ctx.fillStyle = "rgba(244,222,148,0.6)"; ctx.fill(); }
    ctx.beginPath(); ctx.arc(cx + s / 2, cy + s / 2, s * 0.36, 0, Math.PI * 2); ctx.fillStyle = on ? "#FFFFFF" : C.ink; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = on ? C.goldRim : "#000"; ctx.stroke();
  }
  "ABCDE".split("").forEach((k, c) => H.text(ctx, k, x + s * c + s / 2, y - 30, 44, { mono: true, weight: 800, align: "center", color: C.mut }));
  "12345".split("").forEach((k, r) => H.text(ctx, k, x - 50, y + s * r + s * 0.62, 44, { mono: true, weight: 800, align: "center", color: C.mut }));
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1405, 1040, 36, { mono: true, weight: 700, color: C.green, align: "center" });
};
