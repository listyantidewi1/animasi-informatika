// A "PHP retak dibidik": huruf PHP raksasa (huruf biasa, bukan logo resmi) terbelah retakan merah, retikel bidikan di retakan; kanan: BOCOR LAGI.
latar(RED, [560, 560]); vinyet();
const cv2 = document.createElement("canvas"); cv2.width = W; cv2.height = HH; const c2 = cv2.getContext("2d");
c2.font = `900 470px ${SANS}`; c2.letterSpacing = "-10px"; const g2 = c2.createLinearGradient(0, 400, 0, 760); g2.addColorStop(0, "#C3C8F5"); g2.addColorStop(1, "#6A71B8"); c2.fillStyle = g2; c2.fillText("PHP", 70, 760);
const pw = c2.measureText("PHP").width, x0 = 70;
const cr = [[x0 + 120, 380], [x0 + 260, 470], [x0 + 210, 520], [x0 + 400, 590], [x0 + 340, 640], [x0 + 560, 720], [x0 + 520, 800]];
const garisRetak = (c, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineJoin = "miter"; c.beginPath(); cr.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); };
c2.globalCompositeOperation = "source-atop"; c2.shadowColor = RED; c2.shadowBlur = 40; garisRetak(c2, 60, RED); c2.shadowBlur = 0; garisRetak(c2, 40, "#FF8A96");
c2.globalCompositeOperation = "destination-out"; garisRetak(c2, 18, "#000");
ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 80; ctx.shadowOffsetY = 30; ctx.drawImage(cv2, 0, 0); ctx.restore();
ctx.save(); ctx.shadowColor = RED; ctx.shadowBlur = 50; garisRetak(ctx, 4, "rgba(255,59,78,0.0)"); ctx.restore();
X.glow(ctx, x0 + 340, 600, 300, RED, 0.45);
bidik(x0 + 380, 610, 115, RED);
judul("BOCOR", 1870, 450, 240, { align: "right" });
judul("LAGI", 1870, 690, 240, { align: "right", color: RED, glow: "rgba(255,59,78,0.55)" });
pita("AI IKUT MEMBURU", 1870 - 790, 860, 66, AMB, "#16130A");
