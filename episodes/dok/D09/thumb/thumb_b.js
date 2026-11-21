// B "Terminal miring + pertanyaan besar": terminal 3D miring dengan php -v dan baris alarm, teks besar "SERVERMU AMAN?" di kanan.
latar(PUR, [560, 600]); vinyet();
ctx.save(); ctx.translate(530, 570); ctx.transform(1, -0.12, 0.05, 1, 0, 0); ctx.rotate(-0.04);
ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 90; ctx.shadowOffsetY = 40; ctx.fillStyle = "#121216"; X.rr(ctx, -520, -330, 1040, 660, 28); ctx.fill(); ctx.shadowColor = "transparent";
ctx.strokeStyle = "rgba(140,148,216,0.55)"; ctx.lineWidth = 4; ctx.stroke();
ctx.fillStyle = "#1D1C22"; ctx.save(); X.rr(ctx, -520, -330, 1040, 660, 28); ctx.clip(); ctx.fillRect(-520, -330, 1040, 80); ctx.restore();
[["#FF5F57", -470], ["#FEBC2E", -430], ["#28C840", -390]].forEach(([c, x]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, -290, 13, 0, 6.283); ctx.fill(); });
ctx.font = `700 78px ${MONO}`; ctx.fillStyle = "#3DDC97"; ctx.fillText("$", -460, -140); ctx.fillStyle = WHT; ctx.fillText("php -v", -400, -140);
ctx.fillStyle = "rgba(255,59,78,0.22)"; ctx.fillRect(-500, -90, 1000, 120); ctx.fillStyle = RED; ctx.fillRect(-500, -90, 12, 120);
ctx.fillStyle = WHT; ctx.fillText("PHP 8.?.??", -460, -2);
ctx.font = `700 62px ${MONO}`; ctx.fillStyle = "#7D80A8"; ctx.fillText("<?php // celah?", -460, 140);
ctx.fillStyle = "#3DDC97"; ctx.fillRect(-460, 190, 40, 64);
ctx.restore();
X.glow(ctx, 560, 520, 300, RED, 0.35);
pita("KRITIS", 600, 830, 80, RED, WHT, { rot: -0.1, spacing: 8 });
judul("SERVERMU", 1890, 420, 175, { align: "right" });
judul("AMAN?", 1890, 650, 250, { align: "right", color: AMB, glow: "rgba(255,194,75,0.35)" });
pita("CELAH PHP BOCOR LAGI", 1890, 830, 54, "#2A2930", WHT, { align: "right" });
