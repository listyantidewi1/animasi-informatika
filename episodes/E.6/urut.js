/* Pembantu E.6: penelusuran algoritma pencarian dan pengurutan (daftar langkah), gambar deretan kartu dengan sorotan,
   penghitung ganda, tabel perbandingan, kurva skala. Gaya diagram Fase E. Muat setelah kiko-core.js dan kartu.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp, lerp } = H;
  const U = {};
  // langkah: {a, hl:[idx...], swap:[i,j]|null, done:[idx...], cmp, sw, note}
  U.trace = function (kind, arr0) {
    const a = arr0.slice(), steps = []; let cmp = 0, sw = 0; const n = a.length;
    const push = (hl, swap, done, note, extra) => steps.push(Object.assign({ a: a.slice(), hl, swap, done: done.slice(), cmp, sw, note }, extra || {}));
    if (kind === "bubble") { const done = []; for (let i = 0; i < n - 1; i++) { for (let j = 0; j < n - 1 - i; j++) { cmp++; push([j, j + 1], null, done, `bandingkan ${a[j]} dan ${a[j + 1]}`); if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; sw++; push([j, j + 1], [j, j + 1], done, "tukar"); } } done.unshift(n - 1 - i); } done.unshift(0); push([], null, done, "selesai"); }
    else if (kind === "selection") { const done = []; for (let i = 0; i < n - 1; i++) { let m = i; for (let j = i + 1; j < n; j++) { cmp++; push([m, j], null, done, `bandingkan ${a[j]} dengan terkecil ${a[m]}`, { min: m }); if (a[j] < a[m]) m = j; } if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; sw++; push([i, m], [i, m], done, "tukar ke depan"); } done.push(i); push([], null, done, `posisi ${i + 1} beres`); } done.push(n - 1); push([], null, done, "selesai"); }
    else if (kind === "insertion") { const done = [0]; for (let i = 1; i < n; i++) { const key = a[i]; let j = i - 1; push([i], null, done, `ambil ${key}`); while (j >= 0) { cmp++; push([j, j + 1], null, done, `bandingkan ${a[j]} dan ${key}`); if (a[j] > key) { a[j + 1] = a[j]; sw++; push([j, j + 1], [j, j + 1], done, "geser ke kanan"); j--; } else break; } a[j + 1] = key; done.push(i); push([j + 1], null, done, `sisipkan ${key}`); } push([], null, done, "selesai"); }
    else if (kind === "linear") { const target = arr0.target; }
    return steps;
  };
  U.linear = function (arr, target) { const steps = []; for (let i = 0; i < arr.length; i++) { steps.push({ a: arr, hl: [i], cmp: i + 1, note: arr[i] === target ? `ketemu di kotak ${i + 1}` : `${arr[i]} ≠ ${target}` , found: arr[i] === target }); if (arr[i] === target) break; } return steps; };
  U.binary = function (arr, target) { const steps = []; let lo = 0, hi = arr.length - 1, k = 0; while (lo <= hi) { const mid = Math.ceil((lo + hi) / 2); k++; const v = arr[mid]; if (v === target) { steps.push({ a: arr, hl: [mid], lo, hi, cmp: k, note: `tengah ${v}: ketemu`, found: true }); break; } if (target < v) { steps.push({ a: arr, hl: [mid], lo, hi, cmp: k, note: `tengah ${v}: target lebih kecil, buang kanan`, cut: "right" }); hi = mid - 1; } else { steps.push({ a: arr, hl: [mid], lo, hi, cmp: k, note: `tengah ${v}: target lebih besar, buang kiri`, cut: "left" }); lo = mid + 1; } } return steps; };
  // deretan kartu dari langkah; opt.w, opt.h, opt.y; done = hijau; hl = kuning; swap = panah
  U.cards = function (ctx, x, y, st, opt = {}) {
    const w = opt.w || 120, h = opt.h || 120, gap = opt.gap || 14; const a = st.a;
    a.forEach((v, i) => { const cx = x + i * (w + gap); const hl = (st.hl || []).includes(i), done = (st.done || []).includes(i), dim = st.lo != null && (i < st.lo || i > st.hi); ctx.save(); if (dim) ctx.globalAlpha = 0.18; ctx.fillStyle = hl ? "#FFF3D6" : done ? C.goodBg : "#fff"; rr(ctx, cx, y, w, h, 12); ctx.fill(); ctx.strokeStyle = hl ? C.accent : done ? C.good : "#B7C4CC"; ctx.lineWidth = hl ? 6 : 3; rr(ctx, cx, y, w, h, 12); ctx.stroke(); text(ctx, String(v), cx + w / 2, y + h / 2 + 14, Math.min(40, w * 0.4), { align: "center", weight: 900 }); if (opt.index !== false) text(ctx, String(i + 1), cx + w / 2, y + h + 26, 20, { align: "center", weight: 800, color: C.ink2 }); if (st.min === i) text(ctx, "min", cx + w / 2, y - 12, 18, { align: "center", weight: 900, color: C.kiko }); ctx.restore(); });
    if (st.swap) { const [i, j] = st.swap; const x1 = x + i * (w + gap) + w / 2, x2 = x + j * (w + gap) + w / 2; ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x1, y - 30); ctx.quadraticCurveTo((x1 + x2) / 2, y - 80, x2, y - 30); ctx.stroke(); text(ctx, "⇄", (x1 + x2) / 2, y - 60, 34, { align: "center", weight: 900, color: C.bad }); }
  };
  U.counters = function (ctx, x, y, cmp, sw, opt = {}) { card(ctx, x, y, 240, 100, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, String(cmp), x + 120, y + 56, 44, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "perbandingan", x + 120, y + 88, 18, { align: "center", weight: 800, color: C.ink2 }); card(ctx, x + 260, y, 240, 100, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, String(sw), x + 380, y + 56, 44, { align: "center", weight: 900, color: C.bad }); text(ctx, opt.swLabel || "pertukaran", x + 380, y + 88, 18, { align: "center", weight: 800, color: C.ink2 }); };
  // tabel perbandingan: head[], rows[][]; opt.hlRow
  U.table = function (ctx, x, y, cw, head, rows, opt = {}) {
    const W = cw.reduce((a, b) => a + b, 0), rh = opt.rh || 56; card(ctx, x, y, W, rh * (rows.length + 1), { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 });
    ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 12); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    let cx = x; head.forEach((hd, c) => { text(ctx, hd, cx + cw[c] / 2, y + rh / 2 + 9, 22, { align: "center", weight: 900, color: C.ink2 }); cx += cw[c]; });
    rows.forEach((r, i) => { if (opt.n != null && i >= opt.n) return; const ry = y + rh * (i + 1); if (opt.hlRow === i) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 2, ry, W - 4, rh); } let cx = x; r.forEach((v, c) => { text(ctx, String(v), cx + cw[c] / 2, ry + rh / 2 + 9, 24, { align: "center", weight: c === 0 ? 900 : 700, color: opt.colors && opt.colors[i] && c > 0 ? opt.colors[i] : C.ink }); cx += cw[c]; }); ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + W, ry); ctx.stroke(); });
  };
  K.urut = U;
})(typeof window !== "undefined" ? window : globalThis);
