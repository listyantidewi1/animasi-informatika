// Thumbnail D08: kota neon 3D, judul neon besar di kiri ("GTA 6 BOCOR?"), di kanan build 209 GB, Raka kaget.
const K = Kiko, U = K.d08, N = U.N, t = 3.2;
K.kota3d.draw(ctx, t, { z: 60, dim: 0.18, sway: 0.6, bloom: 0.9 });
const g = ctx.createLinearGradient(0, 0, 1100, 0); g.addColorStop(0, "rgba(10,4,26,0.88)"); g.addColorStop(1, "rgba(10,4,26,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1100, 1080);
U.neon(ctx, "GTA 6", 80, 300, 230, N.pink, {});
U.neon(ctx, "BOCOR?", 80, 540, 230, N.gold, {});
ctx.fillStyle = "rgba(10,4,26,0.92)"; H.rr(ctx, 86, 620, 620, 120, 30); ctx.fill(); ctx.strokeStyle = N.cyan; ctx.lineWidth = 6; ctx.stroke();
D.txt(ctx, "lewat torrent", 126, 702, 76, { weight: 900, color: "#F6F2FF", fit: 820 });
// kanan: build 209 GB saja (tanpa petunjuk jebakan, supaya penonton penasaran; Dewi 21 Nov)
D.glow(ctx, 1480, 470, 560, N.violet, 0.35);
U.berkas(ctx, 1480, 420, 420, { jenis: "torrent", t });
D.txt(ctx, "209 GB", 1480, 760, 120, { align: "center", weight: 900, color: N.violet });
U.raka(ctx, 560, 1800, 1000, { t, pose: "panik", face: "panik", look: [0.8, -0.3] });
