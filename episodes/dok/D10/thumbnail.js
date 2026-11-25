// Thumbnail D10: kota neon 3D, judul neon di kiri ("GTA 6 DI PC?"), di kanan konsol -> monitor hitam berkursor. Tidak membocorkan jawaban.
const K = Kiko, U = K.d08, N = U.N, X = K.d10, I = X.ikon, t = 2.0;
K.kota3d.draw(ctx, t, { z: 60, dim: 0.18, sway: 0.6, bloom: 0.9 });
const g = ctx.createLinearGradient(0, 0, 1150, 0); g.addColorStop(0, "rgba(10,4,26,0.9)"); g.addColorStop(1, "rgba(10,4,26,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1150, 1080);
U.neon(ctx, "GTA 6", 80, 300, 230, N.pink, {});
U.neon(ctx, "DI PC?", 80, 540, 230, N.cyan, {});
// kanan: monitor hitam besar dengan kursor, konsol kecil dan panah
const g2 = ctx.createLinearGradient(900, 0, 1300, 0); g2.addColorStop(0, "rgba(10,4,26,0)"); g2.addColorStop(1, "rgba(10,4,26,0.55)"); ctx.fillStyle = g2; ctx.fillRect(900, 0, 1020, 1080);
D.glow(ctx, 1470, 470, 620, N.violet, 0.4);
I.monitor(ctx, 1470, 450, 620, N.violet, 0);
I.konsol(ctx, 1210, 880, 190, N.pink);
U.panah(ctx, 1340, 870, 1560, 790, N.gold, 1, 16);
U.tanya(ctx, 1700, 930, 200, N.gold, 1);
