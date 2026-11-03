/* Pembantu gambar F12.1 (dipakai ulang F12.2): node linked list dan rantainya, stack tegak, queue mendatar, laci hash map,
   binary search tree (tata letak otomatis, jalur pencarian), graph berbobot. Gaya diagram Fase F.
   Muat setelah kiko-core.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, card } = H;
  const Sk = {};
  const arrow = Sk.arrow = (ctx, x1, y1, x2, y2, col = C.kiko, lw = 5) => { ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); const a = Math.atan2(y2 - y1, x2 - x1); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 18 * Math.cos(a - 0.45), y2 - 18 * Math.sin(a - 0.45)); ctx.lineTo(x2 - 18 * Math.cos(a + 0.45), y2 - 18 * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill(); };
  // node linked list: kotak data + kotak penunjuk; opt {hl, fresh, dim, w}
  Sk.NW = 190; Sk.NH = 76;
  Sk.node = function (ctx, x, y, data, opt = {}) {
    const w = opt.w || Sk.NW, h = Sk.NH, pw = 50; ctx.save(); if (opt.dim) ctx.globalAlpha = 0.25;
    const st = opt.hl ? C.accent : opt.fresh ? C.good : C.kiko;
    card(ctx, x, y, w, h, { fill: opt.hl ? "#FFF3D6" : opt.fresh ? C.goodBg : "#fff", stroke: st, lw: opt.hl || opt.fresh ? 5 : 3, r: 12 });
    ctx.strokeStyle = st; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + w - pw, y + 6); ctx.lineTo(x + w - pw, y + h - 6); ctx.stroke();
    text(ctx, data, x + (w - pw) / 2, y + h / 2 + 9, 26, { align: "center", weight: 900 });
    ctx.fillStyle = st; ctx.beginPath(); ctx.arc(x + w - pw / 2, y + h / 2, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    return { x, y, w, h, px: x + w - pw / 2, py: y + h / 2 };
  };
  // rantai mendatar: items [teks], opt {gap, hl, head, none, dimFrom}
  Sk.chain = function (ctx, x, y, items, opt = {}) {
    const gap = opt.gap || 70, out = [];
    items.forEach((d, i) => { out.push(Sk.node(ctx, x + i * (Sk.NW + gap), y, d, { hl: opt.hl === i, dim: opt.dimFrom != null && i >= opt.dimFrom })); });
    out.forEach((n, i) => { if (i < out.length - 1) arrow(ctx, n.px, n.py, out[i + 1].x - 4, n.py); });
    if (opt.none !== false && out.length) { const n = out[out.length - 1]; arrow(ctx, n.px, n.py, n.px + 70, n.py, "#7B8B95"); text(ctx, "None", n.px + 80, n.py + 8, 22, { weight: 900, color: "#7B8B95" }); }
    if (opt.head !== false && out.length) { text(ctx, "head", out[0].x + 70, y - 40, 22, { align: "center", weight: 900, color: C.accentDark }); arrow(ctx, out[0].x + 70, y - 32, out[0].x + 70, y - 4, C.accentDark, 4); }
    return out;
  };
  // stack tegak dari bawah: items [teks]; opt {w, hl (indeks), label}
  Sk.stack = function (ctx, x, yb, items, opt = {}) {
    const w = opt.w || 200, h = 60; ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 10, yb - (opt.cap || 5) * (h + 6) - 10); ctx.lineTo(x - 10, yb + 8); ctx.lineTo(x + w + 10, yb + 8); ctx.lineTo(x + w + 10, yb - (opt.cap || 5) * (h + 6) - 10); ctx.stroke();
    items.forEach((d, i) => { const y = yb - (i + 1) * (h + 6); const top = i === items.length - 1; card(ctx, x, y, w, h, { fill: top ? "#FFF3D6" : "#fff", stroke: top ? C.accent : "#B7C4CC", lw: 3, r: 10 }); text(ctx, String(d), x + w / 2, y + 40, 26, { align: "center", weight: 900 }); });
    if (items.length) text(ctx, "← atas", x + w + 24, yb - items.length * (h + 6) + 38, 20, { weight: 900, color: C.accentDark });
    if (opt.label) text(ctx, opt.label, x + w / 2, yb + 44, 22, { align: "center", weight: 900, color: C.ink2 });
  };
  // queue mendatar: items [teks]; opt {w, label}
  Sk.queue = function (ctx, x, y, items, opt = {}) {
    const w = opt.w || 140, h = 64, cap = opt.cap || 5; ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + cap * (w + 8) + 2, y - 10); ctx.moveTo(x - 10, y + h + 10); ctx.lineTo(x + cap * (w + 8) + 2, y + h + 10); ctx.stroke();
    items.forEach((d, i) => { const cx = x + i * (w + 8); card(ctx, cx, y, w, h, { fill: i === 0 ? "#FFF3D6" : "#fff", stroke: i === 0 ? C.accent : "#B7C4CC", lw: 3, r: 10 }); text(ctx, String(d), cx + w / 2, y + 42, 24, { align: "center", weight: 900 }); });
    text(ctx, "depan", x + w / 2, y + h + 44, 20, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "belakang", x + cap * (w + 8) - w / 2, y + h + 44, 20, { align: "center", weight: 900, color: C.ink2 });
    if (opt.label) text(ctx, opt.label, x, y - 24, 22, { weight: 900, color: C.ink2 });
  };
  // laci hash map: n laci tegak; isi = {indeks: [[kunci, nilai, hl]]}; opt {hl indeks, w}
  Sk.buckets = function (ctx, x, y, n, isi, opt = {}) {
    const w = opt.w || 520, h = opt.h || 76;
    for (let i = 0; i < n; i++) { const by = y + i * (h + 10); const on = opt.hl === i; card(ctx, x, by, w, h, { fill: on ? "#FFF3D6" : "#F4F8FB", stroke: on ? C.accent : "#B7C4CC", lw: on ? 5 : 3, r: 12 });
      ctx.fillStyle = on ? C.accent : C.kiko; rr(ctx, x + 10, by + 10, 56, h - 20, 10); ctx.fill(); text(ctx, String(i), x + 38, by + h / 2 + 10, 26, { align: "center", weight: 900, color: "#fff" });
      (isi[i] || []).forEach(([k, v, hl], j) => { const cx = x + 86 + j * 210; card(ctx, cx, by + 12, 196, h - 24, { fill: hl === "bad" ? C.badBg : hl ? C.goodBg : "#fff", stroke: hl === "bad" ? C.bad : hl ? C.good : "#B7C4CC", lw: 3, r: 10 }); text(ctx, k + ": " + v, cx + 98, by + h / 2 + 8, 22, { align: "center", weight: 900 }); }); }
    text(ctx, "laci", x + 38, y - 14, 18, { align: "center", weight: 900, color: C.ink2 });
  };
  // binary search tree: sisipkan berurutan; kembalikan node dengan posisi
  Sk.bstBuild = function (values) {
    let root = null; const all = [];
    values.forEach(v => { const nd = { v, l: null, r: null, d: 0, parent: null }; all.push(nd); if (!root) { root = nd; return; } let c = root; while (true) { if (v < c.v) { if (c.l) c = c.l; else { c.l = nd; break; } } else { if (c.r) c = c.r; else { c.r = nd; break; } } } nd.parent = c; nd.d = c.d + 1; });
    return { root, all };
  };
  Sk.bstPath = function (values, target) { const { root } = Sk.bstBuild(values); const path = []; let c = root; while (c) { path.push(c.v); if (target === c.v) return { path, found: true }; c = target < c.v ? c.l : c.r; } return { path, found: false }; };
  // gambar BST: values (urutan sisip), cx pusat, y0 atas; opt {n tampil, path [v], ghost {v, parent, side}, spread, dy, r}
  Sk.bst = function (ctx, cx, y0, values, opt = {}) {
    const vs = values.slice(0, opt.n == null ? values.length : opt.n); const { root, all } = Sk.bstBuild(vs); const spread = opt.spread || 380, dy = opt.dy || 120, r = opt.r || 40;
    const place = (nd, x, y, s) => { if (!nd) return; nd.x = x; nd.y = y; place(nd.l, x - s, y + dy, s / 2); place(nd.r, x + s, y + dy, s / 2); };
    place(root, cx, y0, spread);
    const onPath = v => opt.path && opt.path.includes(v);
    all.forEach(nd => { if (nd.parent) { const on = onPath(nd.v) && onPath(nd.parent.v); ctx.strokeStyle = on ? C.accent : "#B7C4CC"; ctx.lineWidth = on ? 7 : 4; ctx.beginPath(); ctx.moveTo(nd.parent.x, nd.parent.y); ctx.lineTo(nd.x, nd.y); ctx.stroke(); } });
    if (opt.ghost) { const p = all.find(n => n.v === opt.ghost.parent); if (p) { const s = spread / Math.pow(2, p.d + 1); const gx = p.x + (opt.ghost.side === "l" ? -s : s), gy = p.y + dy; ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = C.good; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(gx, gy); ctx.stroke(); ctx.beginPath(); ctx.arc(gx, gy, r, 0, Math.PI * 2); ctx.fillStyle = C.goodBg; ctx.fill(); ctx.stroke(); ctx.restore(); text(ctx, String(opt.ghost.v), gx, gy + 10, 28, { align: "center", weight: 900, color: C.good }); } }
    all.forEach(nd => { const on = onPath(nd.v), last = opt.path && opt.path[opt.path.length - 1] === nd.v; ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2); ctx.fillStyle = last ? C.accent : on ? "#FFF3D6" : nd === all[all.length - 1] && opt.fresh ? C.goodBg : "#fff"; ctx.fill(); ctx.strokeStyle = on ? C.accent : C.kiko; ctx.lineWidth = on ? 6 : 4; ctx.stroke(); text(ctx, String(nd.v), nd.x, nd.y + 10, 28, { align: "center", weight: 900, color: last ? "#fff" : C.ink }); });
    return { root, all };
  };
  // graph: nodes {id: [x, y]}, edges [[a, b, w]]; opt {hlNodes, hlEdges [[a,b]], weights, r, done}
  Sk.graph = function (ctx, nodes, edges, opt = {}) {
    const r = opt.r || 54; const hasE = (a, b) => (opt.hlEdges || []).some(([p, q]) => (p === a && q === b) || (p === b && q === a));
    edges.forEach(([a, b, w]) => { const [x1, y1] = nodes[a], [x2, y2] = nodes[b]; const on = hasE(a, b); ctx.strokeStyle = on ? C.accent : "#B7C4CC"; ctx.lineWidth = on ? 8 : 5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      if (opt.weights && w != null) { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; ctx.fillStyle = "#fff"; rr(ctx, mx - 30, my - 20, 60, 40, 10); ctx.fill(); ctx.strokeStyle = on ? C.accent : "#B7C4CC"; ctx.lineWidth = 2; rr(ctx, mx - 30, my - 20, 60, 40, 10); ctx.stroke(); text(ctx, String(w), mx, my + 8, 22, { align: "center", weight: 900, color: on ? C.accentDark : C.ink2 }); } });
    Object.entries(nodes).forEach(([id, [x, y]]) => { const on = (opt.hlNodes || []).includes(id), dn = (opt.done || []).includes(id); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = on ? "#FFF3D6" : dn ? C.goodBg : "#fff"; ctx.fill(); ctx.strokeStyle = on ? C.accent : dn ? C.good : C.kiko; ctx.lineWidth = on ? 6 : 4; ctx.stroke(); text(ctx, id, x, y + 7, opt.size || 19, { align: "center", weight: 900 }); if (opt.tags && opt.tags[id] != null) { ctx.fillStyle = C.kiko; rr(ctx, x - 34, y - r - 34, 68, 30, 8); ctx.fill(); text(ctx, String(opt.tags[id]), x, y - r - 12, 18, { align: "center", weight: 900, color: "#fff" }); } });
  };
  K.struktur = Sk;
})(typeof window !== "undefined" ? window : globalThis);
