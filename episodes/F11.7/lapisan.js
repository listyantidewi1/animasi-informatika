/* Pembantu gambar F11.7: tumpukan empat lapisan TCP/IP, paket berheader (enkapsulasi), topologi bus/bintang/mesh/pohon
   dengan kabel putus, jalur lompatan paket, amplop berlapis. Gaya diagram Fase F. Muat setelah kiko-core.js, kiko-devices.js, jaringan.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan;
  const { rr, text, para, card, clamp } = H;
  const Lp = {};
  Lp.LAYERS = [["aplikasi", "HTTP, pesan, isi berkas", "#2E9E5B"], ["transport", "TCP/UDP: segmen bernomor, port", "#2E7E9A"], ["internet", "IP: alamat tujuan, jalur", "#8E6BBF"], ["tautan", "MAC, kabel atau Wi-Fi", "#B57A12"]];
  // tumpukan lapisan: n tampil dari atas, active disorot
  Lp.stack = function (ctx, x, y, w, n, opt = {}) {
    Lp.LAYERS.forEach(([nm, s, col], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const ry = y + i * (opt.h || 90); const on = opt.active === i; card(ctx, x, ry, w, (opt.h || 90) - 10, { fill: on ? "#FFF3D6" : "#fff", stroke: col, lw: on ? 6 : 4, r: 12 }); ctx.fillStyle = col; rr(ctx, x, ry, 14, (opt.h || 90) - 10, 6); ctx.fill(); text(ctx, (4 - i) + ". " + nm, x + 30, ry + 34, 24, { weight: 900, color: col }); text(ctx, s, x + 30, ry + 62, 18, { weight: 700, color: C.ink2 }); ctx.restore(); });
  };
  // paket berheader: k = jumlah header (0..3) dari kanan ke kiri: [MAC][IP][TCP][DATA]
  Lp.packet = function (ctx, x, y, k, opt = {}) {
    const hw = opt.hw || 110, dw = opt.dw || 220, h = opt.h || 56; const heads = [["port 8080 · no. 3", Lp.LAYERS[1][2]], ["ke 10.0.3.12", Lp.LAYERS[2][2]], ["MAC 5A:2F:…", Lp.LAYERS[3][2]]];
    let cx = x + 3 * hw; card(ctx, cx, y, dw, h, { fill: Lp.LAYERS[0][2], r: 8 }); text(ctx, opt.data || "DATA: foto.jpg (bagian 3)", cx + dw / 2, y + h / 2 + 7, 18, { align: "center", weight: 900, color: "#fff" });
    for (let i = 0; i < k; i++) { cx -= hw; card(ctx, cx, y, hw - 4, h, { fill: heads[i][1], r: 8 }); text(ctx, heads[i][0], cx + (hw - 4) / 2, y + h / 2 + 6, 14, { align: "center", weight: 900, color: "#fff" }); }
  };
  // amplop: nested rectangles with labels; depth = jumlah amplop (0..3)
  Lp.envelope = function (ctx, cx, cy, depth, opt = {}) {
    const labels = ["untuk: aplikasi Chat", "pintu: 8080", "alamat: Jl. Melati 12", "kurir: jalur A"]; const cols = [Lp.LAYERS[0][2], Lp.LAYERS[1][2], Lp.LAYERS[2][2], Lp.LAYERS[3][2]];
    for (let i = depth; i >= 0; i--) { const w = 200 + i * 90, h = 120 + i * 60; card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: i === 0 ? "#FFF9E0" : "#fff", stroke: cols[i], lw: 4, r: 10 }); text(ctx, i === 0 ? "pesan" : labels[i], cx, cy - h / 2 + 24, 16, { align: "center", weight: 900, color: cols[i] }); if (i === 0) text(ctx, opt.msg || "“Hai, Dito!”", cx, cy + 12, 22, { align: "center", weight: 900 }); }
  };
  // topologi: kind "bus"|"star"|"mesh"|"tree"; opt.cut = indeks kabel yang diputus; menggambar simpul dan menandai yang terputus dari simpul 0
  Lp.TOPO = {
    bus: { nodes: [[-240, -60], [-120, 60], [0, -60], [120, 60], [240, -60]], links: [[0, 1], [1, 2], [2, 3], [3, 4]] },
    star: { nodes: [[0, 0], [-200, -90], [200, -90], [-200, 90], [200, 90]], links: [[0, 1], [0, 2], [0, 3], [0, 4]], hub: 0 },
    mesh: { nodes: [[-200, -90], [200, -90], [-200, 90], [200, 90], [0, 0]], links: [[0, 1], [0, 2], [0, 4], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]] },
    tree: { nodes: [[0, -110], [-180, 0], [180, 0], [-260, 100], [-100, 100], [100, 100], [260, 100]], links: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]] }
  };
  Lp.reach = function (kind, cut) { const t = Lp.TOPO[kind]; const adj = t.nodes.map(() => []); t.links.forEach(([a, b], i) => { if (i === cut) return; adj[a].push(b); adj[b].push(a); }); const seen = new Set([0]); const q = [0]; while (q.length) { const u = q.shift(); adj[u].forEach(v => { if (!seen.has(v)) { seen.add(v); q.push(v); } }); } return seen; };
  Lp.topo = function (ctx, cx, cy, kind, opt = {}) {
    const t = Lp.TOPO[kind]; const sc = opt.scale || 1; const P = t.nodes.map(([x, y]) => [cx + x * sc, cy + y * sc]); const reach = opt.cut != null ? Lp.reach(kind, opt.cut) : null;
    t.links.forEach(([a, b], i) => { const cutHere = opt.cut === i; ctx.strokeStyle = cutHere ? C.bad : "#7B8B95"; ctx.lineWidth = 5 * sc; ctx.setLineDash(cutHere ? [10, 10] : []); ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke(); ctx.setLineDash([]); if (cutHere) text(ctx, "✂", (P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2 + 10, 30 * sc, { align: "center", weight: 900, color: C.bad }); });
    P.forEach(([x, y], i) => { const dead = reach && !reach.has(i); const hub = t.hub === i || (kind === "tree" && i < 3); ctx.fillStyle = dead ? "#E1E8E4" : hub ? C.kiko : "#fff"; ctx.strokeStyle = dead ? C.bad : hub ? C.kikoDark : C.kiko; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, (hub ? 22 : 18) * sc, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); if (dead) text(ctx, "✕", x, y + 7 * sc, 20 * sc, { align: "center", weight: 900, color: C.bad }); });
    if (opt.label) text(ctx, opt.label, cx, cy + 150 * sc, 24, { align: "center", weight: 900, color: C.ink2 });
    return reach;
  };
  // jalur lompatan: hops [[label, icon fn or null]], pos 0..hops.length-1 (posisi paket, boleh pecahan)
  Lp.hops = function (ctx, x, y, w, hops, pos, opt = {}) {
    const step = w / (hops.length - 1); const pts = hops.map((_, i) => [x + i * step, y]);
    J.cable(ctx, pts, { color: "#B7C4CC", lw: 6 });
    hops.forEach(([lab, kind], i) => { const px = x + i * step; ctx.fillStyle = "#fff"; ctx.strokeStyle = C.kiko; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(px, y, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); text(ctx, kind || "•", px, y + 10, 26, { align: "center" }); para(ctx, lab, px, y + 60, 17, 150, { align: "center", weight: 800, color: C.ink2 }); });
    if (pos != null) { const [px, py] = J.along(pts, clamp(pos / (hops.length - 1), 0, 1)); J.packet(ctx, px, py - 50, 1, { color: opt.color || C.accent }); }
  };
  K.lapisan = Lp;
})(typeof window !== "undefined" ? window : globalThis);
