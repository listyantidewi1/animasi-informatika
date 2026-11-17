// Thumbnail D05: HP penuh kartu "Bersponsor", gembok emas dirantai di HP, judul kanan, Bip kaget.
const K = Kiko, U = K.d05, KY = K.kit.layar, KB = K.kit.bipkit, t = 2.0;
const g = ctx.createLinearGradient(0, 0, 1920, 1080); g.addColorStop(0, "#2B2F7A"); g.addColorStop(1, "#5A3E8E"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
D.glow(ctx, 560, 560, 760, "#FF6F91", 0.35); D.glow(ctx, 560, 520, 420, "#FFC94D", 0.25);
// spanduk iklan berserakan di belakang HP
[[170, 230, -0.2, "IKLAN", "#FF5A5F"], [930, 200, 0.18, "PROMO!", "#FFB547"], [140, 820, 0.15, "BELI!", "#9584FF"], [960, 860, -0.15, "IKLAN", "#5AA9FF"]].forEach(([x, y, r, s, c]) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.fillStyle = "rgba(10,8,30,0.3)"; ctx.fillRect(-150 + 8, -48 + 10, 300, 96); ctx.fillStyle = c; ctx.fillRect(-150, -48, 300, 96);
  D.txt(ctx, s, 0, 22, 62, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore(); });
// HP besar penuh kartu bersponsor
ctx.save(); ctx.translate(560, 560); ctx.rotate(-0.08); ctx.translate(-560, -560);
KY.hp(ctx, 560, 560, 900, { t, screen: (c, w, h, tt) => U.layarFeed(c, w, h, tt, { kartu: ["iklan", "iklan", "teman", "iklan", "iklan"], tagSize: w * 0.075, judul: false }) });
ctx.restore();
// rantai + gembok
ctx.strokeStyle = "#C9CEE6"; ctx.lineWidth = 14;
for (let i = -7; i <= 7; i++) { const x = 560 + i * 58, y = 640 + i * 6; ctx.beginPath(); ctx.ellipse(x, y, 30, 18, 0.1 + (i % 2) * 1.4, 0, Math.PI * 2); ctx.stroke(); }
D.glow(ctx, 560, 700, 300, "#FFC94D", 0.55);
KB.gembok(ctx, 560, 760, 230, { locked: 1, t, color: "#FFC94D" });
// judul kanan
ctx.fillStyle = "rgba(20,22,70,0.82)"; H.rr(ctx, 1110, 140, 760, 620, 44); ctx.fill();
[["APLIKASI", "#F4F6FF", 128], ["FAVORITMU", "#F4F6FF", 128], ["MAKIN", "#FFB547", 150], ["MENYEBALKAN?", "#FFB547", 112]].forEach(([s, col, sz], i) =>
  D.txt(ctx, s, 1160, [290, 430, 585, 705][i], sz, { weight: 900, color: col, fit: 680 }));
KB.draw(ctx, 1560, 1010, 200, { pose: "kaget", t, mood: "wow" });
