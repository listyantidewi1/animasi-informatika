// C "AI memburu celah": judul dua baris di kiri atas, dinding kode PHP redup dengan satu baris merah, chip AI bercahaya memindai baris itu.
latar(RED, [1460, 600]); vinyet();
judul("AI MEMBURU", 70, 230, 175, {});
judul("CELAH PHP", 70, 410, 175, { color: RED, glow: "rgba(255,59,78,0.5)" });
const kode = ['if ($len > $max) {', '  return false;', '}', 'memcpy($buf, $data, $len);', '$sesi = load($id);', 'echo render($sesi);'];
ctx.save(); ctx.font = `600 52px ${MONO}`;
kode.forEach((s, i) => { const y = 560 + i * 80, hot = i === 3;
  if (hot) { ctx.fillStyle = "rgba(255,59,78,0.28)"; ctx.fillRect(60, y - 56, 900, 78); ctx.fillStyle = RED; ctx.fillRect(60, y - 56, 10, 78); }
  ctx.fillStyle = hot ? WHT : "rgba(201,204,232,0.3)"; ctx.fillText(s, 100, y); });
ctx.restore();
const ax = 1480, ay = 620, ly = 560 + 3 * 80 - 17;
ctx.save(); const g = ctx.createLinearGradient(ax, 0, 960, 0); g.addColorStop(0, "rgba(255,59,78,0.6)"); g.addColorStop(1, "rgba(255,59,78,0.06)");
ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ax - 170, ay - 50); ctx.lineTo(960, ly - 39); ctx.lineTo(960, ly + 39); ctx.lineTo(ax - 170, ay + 50); ctx.fill(); ctx.restore();
X.glow(ctx, ax, ay, 460, RED, 0.65);
window.Kiko.d09.ai(ctx, ax, ay, 340, RED, { glow: 0.6 });
pita("BOCOR LAGI", ax, 960, 70, AMB, "#16130A", { align: "center", rot: -0.04 });
