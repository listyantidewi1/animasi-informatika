// pembantu bersama alternatif thumbnail D09 (disisipkan di depan tiap thumb_*.js)
const X = window.D09, C = X.C, W = 1920, HH = 1080, SANS = X.SANS, MONO = X.MONO;
const RED = "#FF3B4E", PUR = "#8C94D8", AMB = "#FFC24B", WHT = "#F7F7FA";
function latar(tint, sisi) {
  ctx.fillStyle = "#0B0B0E"; ctx.fillRect(0, 0, W, HH);
  const g = ctx.createRadialGradient(sisi[0], sisi[1], 40, sisi[0], sisi[1], 1100); g.addColorStop(0, X.rgba(tint, 0.34)); g.addColorStop(0.45, X.rgba(tint, 0.08)); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
  ctx.strokeStyle = "rgba(255,255,255,0.035)"; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, HH); ctx.stroke(); }
  for (let y = 0; y <= HH; y += 48) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
}
function vinyet() { const v = ctx.createRadialGradient(W / 2, HH / 2, HH * 0.4, W / 2, HH / 2, HH * 1.1); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.6)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, HH); }
// teks tebal dengan bayangan jatuh dan garis tepi, opsi isi gradien
function judul(s, x, y, size, o = {}) {
  ctx.save(); ctx.font = `${o.weight || 900} ${size}px ${o.mono ? MONO : SANS}`; ctx.textAlign = o.align || "left"; ctx.textBaseline = "alphabetic";
  ctx.letterSpacing = (o.spacing != null ? o.spacing : -size * 0.03) + "px";
  const w = ctx.measureText(s).width, x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  ctx.shadowColor = "rgba(0,0,0,0.75)"; ctx.shadowBlur = size * 0.25; ctx.shadowOffsetY = size * 0.06; ctx.fillStyle = "#000"; ctx.fillText(s, x, y);
  ctx.shadowColor = "transparent";
  if (o.stroke) { ctx.lineJoin = "round"; ctx.lineWidth = o.stroke; ctx.strokeStyle = o.strokeCol || "#000"; ctx.strokeText(s, x, y); }
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = size * 0.35; }
  if (o.grad) { const g = ctx.createLinearGradient(0, y - size * 0.8, 0, y); g.addColorStop(0, o.grad[0]); g.addColorStop(1, o.grad[1]); ctx.fillStyle = g; } else ctx.fillStyle = o.color || WHT;
  ctx.fillText(s, x, y); ctx.restore(); return { x0, w };
}
function pita(s, x, y, size, bg, fg, o = {}) {   // label pil padat
  ctx.save(); ctx.font = `900 ${size}px ${SANS}`; ctx.letterSpacing = (o.spacing || size * 0.08) + "px"; const w = ctx.measureText(s).width, px = size * 0.55, h = size * 1.5;
  const x0 = o.align === "center" ? x - w / 2 - px : o.align === "right" ? x - w - px * 2 : x; ctx.translate(x0, y); if (o.rot) ctx.rotate(o.rot);
  ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = bg; X.rr(ctx, 0, -h * 0.72, w + px * 2, h, o.r != null ? o.r : 12); ctx.fill(); ctx.shadowColor = "transparent";
  ctx.fillStyle = fg; ctx.textBaseline = "alphabetic"; ctx.fillText(s, px, size * 0.08); ctx.restore(); return w + px * 2;
}
function bidik(cx, cy, r, col) {   // retikel bidikan
  ctx.save(); ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke(); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, 6.283); ctx.stroke();
  ctx.lineWidth = 10; [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(cx + a * r * 0.75, cy + b * r * 0.75); ctx.lineTo(cx + a * r * 1.3, cy + b * r * 1.3); ctx.stroke(); });
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, 10, 0, 6.283); ctx.fill(); ctx.restore();
}
