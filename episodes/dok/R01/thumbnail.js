// Thumbnail R01: judul besar kiri atas, peta lima stasiun menanjak ke kanan, tiga tokoh kecil di awal jalan.
const K = Kiko, U = K.d06, R = K.r01, KB = K.kit.bipkit, P = D.P, t = 2.0, TAU = Math.PI * 2;
const g = ctx.createLinearGradient(0, 0, 1920, 1080); g.addColorStop(0, "#121A48"); g.addColorStop(1, "#2B3F8C"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
D.glow(ctx, 1500, 380, 800, P.amber, 0.28); D.glow(ctx, 400, 900, 600, P.teal, 0.2);
const X = i => 250 + i * 365, Y = i => 880 - i * 118, NC = [P.teal, P.blue, P.green, P.amber, P.pink];
ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "rgba(6,10,36,0.95)"; ctx.lineWidth = 70; ctx.beginPath(); ctx.moveTo(-40, 960); for (let i = 0; i < 5; i++) ctx.lineTo(X(i), Y(i)); ctx.lineTo(1960, 330); ctx.stroke();
ctx.strokeStyle = "rgba(242,246,255,0.6)"; ctx.lineWidth = 8; ctx.setLineDash([34, 30]); ctx.beginPath(); ctx.moveTo(-40, 960); for (let i = 0; i < 5; i++) ctx.lineTo(X(i), Y(i)); ctx.lineTo(1960, 330); ctx.stroke(); ctx.setLineDash([]);
for (let i = 0; i < 5; i++) { D.glow(ctx, X(i), Y(i), 190, NC[i], 0.5); ctx.fillStyle = NC[i]; ctx.beginPath(); ctx.arc(X(i), Y(i), 92, 0, TAU); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.stroke(); D.txt(ctx, String(i + 1), X(i), Y(i) + 36, 104, { align: "center", weight: 900, color: "#10142E" }); }
[["ROADMAP", "#FFB547", 176, 215], ["SOFTWARE", "#F4F6FF", 150, 370], ["ENGINEER", "#F4F6FF", 150, 515]].forEach(([s, col, sz, y]) => { ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 8; D.txt(ctx, s, 90, y, sz, { weight: 900, color: col }); ctx.restore(); });
KB.draw(ctx, X(4), Y(4) - 215, 190, { pose: "diam", t, mood: "happy" });
