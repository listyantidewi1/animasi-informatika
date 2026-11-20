/* Thumbnail ON04 (digambar dengan inti OSN-K): 1920x1080, diperkecil ke 1280x720. Tidak membocorkan jawaban. */
Kiko.SCENES.thumb = function (ctx) {
  const { C } = Kiko, H = Kiko.helpers;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 80, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "41 orang", 90, 340, 150, { disp: true, weight: 800 });
  H.text(ctx, "melingkar.", 90, 500, 150, { disp: true, weight: 800 });
  H.text(ctx, "Siapa yang", 90, 680, 120, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "terakhir?", 90, 830, 120, { disp: true, weight: 800, color: C.red });
  // lingkaran kursi
  const cx = 1460, cy = 470, R = 330, n = 41;
  for (let s = 1; s <= n; s++) {
    const a = -Math.PI / 2 + (s - 1) * 2 * Math.PI / n, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    const out = s % 2 === 0;
    ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fillStyle = out ? "rgba(216,205,180,0.6)" : C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = out ? C.line : C.ink; ctx.stroke();
  }
  H.panel(ctx, cx - 250, cy - 90, 500, 180, { stroke: C.ink, lw: 4 });
  H.text(ctx, "KODE(41)", cx, cy + 10, 72, { mono: true, weight: 800, align: "center", color: C.green });
  H.text(ctx, "= ?", cx, cy + 75, 48, { mono: true, weight: 800, align: "center", color: C.red });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1460, 1040, 36, { mono: true, weight: 700, color: C.green, align: "center" });
};
