// A2 "php retak dibidik": huruf "php" kecil, miring, tebal membulat dengan garis tepi gelap (gaya mirip huruf logo PHP, digambar ulang dengan kode,
// bukan berkas logo resmi), terbelah retakan merah, retikel bidikan di retakan; kanan: BOCOR LAGI.
latar(RED, [540, 560]); vinyet();
const cv2 = document.createElement("canvas"); cv2.width = W; cv2.height = HH; const c2 = cv2.getContext("2d");
const BX = 120, BY = 690, SZ = 430;
c2.save(); c2.translate(BX, BY); c2.transform(1, 0, -0.2, 1, 0, 0);
c2.font = `900 ${SZ}px ${SANS}`; c2.letterSpacing = "14px"; c2.lineJoin = "round"; c2.textBaseline = "alphabetic";
c2.lineWidth = 36; c2.strokeStyle = "#17162A"; c2.strokeText("php", 0, 0);                // garis tepi gelap
const g2 = c2.createLinearGradient(0, -SZ * 0.75, 0, SZ * 0.25); g2.addColorStop(0, "#B8BEF0"); g2.addColorStop(0.55, "#8C94D8"); g2.addColorStop(1, "#5E64A8");
c2.lineWidth = 8; c2.strokeStyle = g2; c2.strokeText("php", 0, 0); c2.fillStyle = g2; c2.fillText("php", 0, 0);  // isi membulat
c2.globalCompositeOperation = "source-atop"; const hl = c2.createLinearGradient(0, -SZ * 0.75, 0, -SZ * 0.2); hl.addColorStop(0, "rgba(255,255,255,0.28)"); hl.addColorStop(1, "rgba(255,255,255,0)");
c2.fillStyle = hl; c2.fillRect(-100, -SZ, 1400, SZ * 0.7);                                   // kilau atas
c2.restore();
const cr = [[BX + 640, 330], [BX + 740, 440], [BX + 690, 490], [BX + 840, 570], [BX + 780, 620], [BX + 900, 720], [BX + 840, 860]];
const garisRetak = (c, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineJoin = "miter"; c.beginPath(); cr.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); };
c2.globalCompositeOperation = "source-atop"; c2.shadowColor = RED; c2.shadowBlur = 40; garisRetak(c2, 34, RED); c2.shadowBlur = 0; garisRetak(c2, 20, "#FF8A96");
c2.globalCompositeOperation = "destination-out"; garisRetak(c2, 9, "#000");
ctx.save(); ctx.translate(10, 58); ctx.scale(0.9, 0.9);   // diperkecil supaya ada ruang lega ke judul
ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 80; ctx.shadowOffsetY = 30; ctx.drawImage(cv2, 0, 0); ctx.restore();
X.glow(ctx, BX + 780, 560, 300, RED, 0.45);
bidik(BX + 790, 560, 100, RED);
ctx.restore();
judul("BOCOR", 1870, 535, 240, { align: "right" });
judul("LAGI", 1870, 780, 240, { align: "right", color: RED, glow: "rgba(255,59,78,0.55)" });
