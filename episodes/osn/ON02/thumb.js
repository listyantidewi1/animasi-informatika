/* Thumbnail ON02 (digambar dengan inti OSN-K): 1920x1080, diperkecil ke 1280x720. */
Kiko.SCENES.thumb = function (ctx) {
  const { C } = Kiko, H = Kiko.helpers;
  H.chip(ctx, "SOAL OSN-K INFORMATIKA · SMA", 90, 80, { size: 40, color: "#FFFFFF", fill: C.green, stroke: C.green, px: 26, py: 14 });
  H.text(ctx, "4 soal OSN-K", 90, 340, 150, { disp: true, weight: 800 });
  H.text(ctx, "tanpa", 90, 520, 150, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "coding.", 90, 690, 150, { disp: true, weight: 800, color: C.red });
  H.text(ctx, "Berapa yang bisa kamu jawab?", 90, 840, 60, { disp: true, weight: 800, fit: 1000 });
  // empat kartu kecil
  const cards = [[1180, 160], [1530, 160], [1180, 520], [1530, 520]];
  cards.forEach(([x, y], i) => {
    H.panel(ctx, x, y, 320, 320, { stroke: C.ink, lw: 4 });
    H.text(ctx, "SOAL " + (i + 1), x + 160, y + 52, 30, { mono: true, weight: 800, align: "center", color: C.green });
    const cx = x + 160, cy = y + 190;
    if (i === 0) { [2, 5, 3].forEach((v, k) => { H.rr(ctx, cx - 125 + k * 85, cy - 40, 74, 74, 10); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.line; ctx.stroke(); H.text(ctx, String(v), cx - 88 + k * 85, cy + 14, 44, { mono: true, weight: 800, align: "center" }); });
      H.text(ctx, "KWAK · KWIK", cx, cy + 100, 30, { mono: true, weight: 800, align: "center", color: C.red }); }
    if (i === 1) { ["A", "B", "C"].forEach((k, j) => { H.rr(ctx, cx - 130 + j * 88, cy - 50, 80, 96, 10); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.line; ctx.stroke(); H.text(ctx, k, cx - 90 + j * 88, cy + 20, 56, { mono: true, weight: 800, align: "center" }); });
      H.text(ctx, "cache: keluar siapa?", cx, cy + 100, 26, { mono: true, weight: 800, align: "center", color: C.green }); }
    if (i === 2) { const P = [[cx - 100, cy], [cx, cy - 60], [cx, cy + 60], [cx + 100, cy]];
      [[0, 1], [0, 2], [1, 3], [2, 3]].forEach(([a, b]) => H.arrow(ctx, P[a][0] + 22, P[a][1] + (P[b][1] - P[a][1]) * 0.3, P[b][0] - 22, P[b][1] - (P[b][1] - P[a][1]) * 0.3, { color: C.ink, lw: 5, head: 16 }));
      P.forEach(([px, py], k) => { ctx.beginPath(); ctx.arc(px, py, 24, 0, Math.PI * 2); ctx.fillStyle = k === 3 ? C.red : C.green; ctx.fill(); H.text(ctx, "ABCG"[k] === "G" ? "?" : "ABC"[k], px, py + 10, 28, { mono: true, weight: 800, align: "center", color: "#FFFFFF" }); });
      H.text(ctx, "pesan berantai", cx, cy + 112, 28, { mono: true, weight: 800, align: "center", color: C.mut }); }
    if (i === 3) { for (let k = 0; k < 7; k++) { ctx.fillStyle = k === 4 ? C.gold : C.greenBg; ctx.fillRect(cx - 140 + k * 40, cy - 10, 34, 50); }
      H.coin(ctx, cx - 140 + 4 * 40 + 17, cy - 50, 26, "?", {}); H.text(ctx, "1 … 255", cx, cy + 100, 30, { mono: true, weight: 800, align: "center", color: C.mut }); }
  });
  H.text(ctx, "Bedah Soal OSN-K Informatika", 1525, 1010, 40, { mono: true, weight: 700, color: C.green, align: "center" });
};
