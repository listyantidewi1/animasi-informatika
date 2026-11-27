// Thumbnail D13: frame asli video yang beredar (diredupkan) di latar, judul neon "4K 120 FPS?" di kiri,
// kaca pembesar menyorot catatan kinerja di pojok. Tanpa stempel PALSU/FAKE: penonton diajak memeriksa sendiri.
// thumbnail_dok.py menyetel window.__ok segera setelah badan ini berjalan; __ok dibuat getter supaya tangkapan
// layar menunggu semua gambar asli termuat.
let selesai = false;
Object.defineProperty(window, "__ok", { configurable: true, get() { return selesai; }, set() {} });
const K = Kiko, U = K.d08, N = U.N, Z = K.d13;
function gambar() {
  if (!K.aset || K.aset.ok < K.aset.n) return setTimeout(gambar, 100);
  ctx.fillStyle = "#0A041A"; ctx.fillRect(0, 0, 1920, 1080);
  const im = Z.img("utuh5"); if (im) { ctx.save(); ctx.globalAlpha = 0.62; ctx.drawImage(im, 0, 0, 1920, 1080); ctx.restore(); }
  // gelap di kanan agar judul terbaca, log asli tetap terlihat di kiri atas
  const g = ctx.createLinearGradient(700, 0, 1920, 0); g.addColorStop(0, "rgba(10,4,26,0)"); g.addColorStop(0.35, "rgba(10,4,26,0.78)"); g.addColorStop(1, "rgba(10,4,26,0.92)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  const g2 = ctx.createLinearGradient(0, 640, 0, 1080); g2.addColorStop(0, "rgba(10,4,26,0)"); g2.addColorStop(1, "rgba(10,4,26,0.85)"); ctx.fillStyle = g2; ctx.fillRect(0, 640, 1920, 440);
  // kaca pembesar di atas catatan kinerja (pojok kiri atas frame)
  ctx.save(); ctx.strokeStyle = N.gold; ctx.lineWidth = 8; ctx.shadowColor = N.gold; ctx.shadowBlur = 24;
  ctx.beginPath(); ctx.roundRect(24, 40, 860, 560, 22); ctx.stroke(); ctx.restore();
  // lensa memperbesar angka fps di bilah bawah catatan
  if (im) { const cx = 300, cy = 527, r = 130, z = 2.0, sx = im.naturalWidth / 1920; ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = "#0A041A"; ctx.fill();
    ctx.drawImage(im, (cx - r / z) * sx, (cy - r / z) * sx, (2 * r / z) * sx, (2 * r / z) * sx, cx - r, cy - r, 2 * r, 2 * r); ctx.restore();
    ctx.save(); ctx.strokeStyle = N.gold; ctx.lineCap = "round"; ctx.shadowColor = N.gold; ctx.shadowBlur = 24; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(cx + r * 0.72, cy + r * 0.72); ctx.lineTo(cx + r * 1.5, cy + r * 1.5); ctx.stroke(); ctx.restore(); }
  // judul kanan
  U.neon(ctx, "GTA 6 DI PC", 1880, 230, 110, N.pink, { align: "right" });
  U.neon(ctx, "4K", 1880, 500, 260, N.cyan, { align: "right" });
  U.neon(ctx, "120 FPS?", 1880, 760, 210, N.gold, { align: "right", fit: 1000 });
  ctx.save(); ctx.fillStyle = "rgba(10,4,26,0.85)"; ctx.beginPath(); ctx.roundRect(1060, 850, 820, 110, 26); ctx.fill(); ctx.strokeStyle = N.pink; ctx.lineWidth = 4; ctx.stroke();
  ctx.restore(); U.txt(ctx, "Bisakah kamu memeriksanya?", 1470, 925, 58, { align: "center", weight: 900, color: "#FFFFFF", fit: 760 });
  selesai = true;
}
gambar();
