// Thumbnail D06: judul kiri (putih + amber), panel grafik kanan dengan garis hijau naik dan garis merah turun, piktogram developer, Bip kaget.
const K = Kiko, U = K.d06, KB = K.kit.bipkit, P = D.P, t = 2.0;
const g = ctx.createLinearGradient(0, 0, 1920, 1080); g.addColorStop(0, "#141C4A"); g.addColorStop(1, "#3A2C78"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
D.glow(ctx, 1400, 520, 800, P.red, 0.3); D.glow(ctx, 1300, 300, 500, P.amber, 0.22);
// panel grafik
ctx.save(); ctx.translate(1380, 520); ctx.rotate(0.04); ctx.translate(-1380, -520);
U.panel(ctx, 960, 170, 860, 640, { stroke: "rgba(242,246,255,0.35)", lw: 5 });
ctx.strokeStyle = "rgba(242,246,255,0.14)"; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(1010, 280 + i * 150); ctx.lineTo(1770, 280 + i * 150); ctx.stroke(); }
const A = [], B = []; for (let i = 0; i <= 30; i++) { const u = i / 30; A.push([1020 + u * 730, 520 - u * 250 + Math.sin(i * 1.1) * 8]); B.push([1020 + u * 730, 520 + (u < 0.3 ? -u * 40 : -12 + Math.pow((u - 0.3) / 0.7, 1.3) * 250)]); }
const e1 = U.garis(ctx, A, 1, P.green, 18), e2 = U.garis(ctx, B, 1, P.red, 22); U.titik(ctx, e1[0], e1[1], 22, P.green); U.titik(ctx, e2[0], e2[1], 26, P.red);
ctx.restore();
U.orang(ctx, 1480, 1040, 300, P.amber, 1, { laptop: true });
// judul kiri
[["SOFTWARE", "#F4F6FF", 150], ["ENGINEER", "#F4F6FF", 150], ["AKAN", "#FFB547", 170], ["HILANG?", "#FFB547", 190]].forEach(([s, col, sz], i) => {
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; D.txt(ctx, s, 90, [250, 410, 600, 790][i], sz, { weight: 900, color: col, fit: 860 }); ctx.restore(); });
ctx.fillStyle = "rgba(8,14,44,0.92)"; H.rr(ctx, 90, 870, 760, 110, 30); ctx.fill(); ctx.strokeStyle = P.teal; ctx.lineWidth = 5; ctx.stroke();
D.txt(ctx, "data 5 lembaga riset", 130, 946, 66, { weight: 900, color: "#F4F6FF" });
KB.draw(ctx, 1150, 940, 200, { pose: "kaget", t, mood: "wow" });
