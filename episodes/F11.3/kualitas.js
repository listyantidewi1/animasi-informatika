/* Pembantu gambar F11.3: turus perbandingan, batang jumlah operasi, penelusuran biner versi Python (pembagian bulat ke bawah),
   penanda kiri/kanan/tengah di deretan kartu, kartu traceback. Gaya diagram Fase F. Muat setelah kiko-core.js, urut.js, py.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, clamp } = H;
  const Qk = {};
  // turus: kelompok lima
  Qk.tally = function (ctx, x, y, n, opt = {}) {
    const s = opt.size || 34, gap = opt.gap || 10, col = opt.color || C.ink; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5; const gx = x + g * (4 * gap + 26); if (k < 4) { ctx.beginPath(); ctx.moveTo(gx + k * gap, y); ctx.lineTo(gx + k * gap, y + s); ctx.stroke(); } else { ctx.beginPath(); ctx.moveTo(gx - 4, y + s - 4); ctx.lineTo(gx + 3 * gap + 4, y + 4); ctx.stroke(); } }
    if (opt.label) text(ctx, opt.label + " " + n, x, y + s + 30, 22, { weight: 900, color: C.ink2 });
  };
  // batang mendatar: rows [[label, nilai, warna, keterangan]]; skala ke nilai terbesar; opt.n = baris tampil; opt.fmt
  Qk.bars = function (ctx, x, y, w, rows, opt = {}) {
    const max = Math.max(...rows.map(r => r[1])), bh = opt.bh || 54, n = opt.n == null ? rows.length : opt.n;
    rows.forEach(([lab, v, col, ket], i) => { if (i >= n) return; const ry = y + i * (bh + 46); text(ctx, lab, x, ry - 10, 22, { weight: 900 }); if (ket) text(ctx, ket, x + w, ry - 10, 20, { align: "right", weight: 800, color: C.ink2 }); ctx.fillStyle = "#E6EDF2"; rr(ctx, x, ry, w, bh, 10); ctx.fill(); const bw = Math.max(12, w * v / max); ctx.fillStyle = col || C.kiko; rr(ctx, x, ry, bw, bh, 10); ctx.fill(); const s = (opt.fmt || (q => q.toLocaleString("id-ID")))(v); text(ctx, s, bw > 200 ? x + bw - 14 : x + bw + 14, ry + bh / 2 + 9, 24, { align: bw > 200 ? "right" : "left", weight: 900, color: bw > 200 ? "#fff" : C.ink }); });
  };
  // penelusuran biner seperti Python: tengah = (kiri + kanan) // 2 ; langkah {lo, hi, mid, v, found, note}
  Qk.binary = function (arr, target) {
    const steps = []; let lo = 0, hi = arr.length - 1;
    while (lo <= hi) { const mid = Math.floor((lo + hi) / 2), v = arr[mid]; if (v === target) { steps.push({ lo, hi, mid, v, found: true, note: `tengah ${v} = ${target}: ketemu di indeks ${mid}` }); break; } if (v < target) { steps.push({ lo, hi, mid, v, note: `tengah ${v} < ${target}: kiri = ${mid + 1}` }); lo = mid + 1; } else { steps.push({ lo, hi, mid, v, note: `tengah ${v} > ${target}: kanan = ${mid - 1}` }); hi = mid - 1; } }
    return steps;
  };
  // deretan kartu + penanda kiri/kanan/tengah; st = langkah biner, arr = data
  Qk.pointers = function (ctx, x, y, arr, st, opt = {}) {
    const w = opt.w || 110, h = opt.h || 100, gap = opt.gap || 12;
    arr.forEach((v, i) => { const cx = x + i * (w + gap); const dim = st && (i < st.lo || i > st.hi), mid = st && i === st.mid; ctx.save(); if (dim) ctx.globalAlpha = 0.18; ctx.fillStyle = mid ? (st.found ? C.goodBg : "#FFF3D6") : "#fff"; rr(ctx, cx, y, w, h, 12); ctx.fill(); ctx.strokeStyle = mid ? (st.found ? C.good : C.accent) : "#B7C4CC"; ctx.lineWidth = mid ? 6 : 3; rr(ctx, cx, y, w, h, 12); ctx.stroke(); text(ctx, String(v), cx + w / 2, y + h / 2 + 13, 36, { align: "center", weight: 900 }); text(ctx, String(i), cx + w / 2, y + h + 24, 18, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); });
    if (st) { const px = i => x + i * (w + gap) + w / 2; const same = st.lo === st.hi; text(ctx, "kiri", px(st.lo) - (same ? 30 : 0), y - 16, 20, { align: "center", weight: 900, color: C.kiko }); text(ctx, "kanan", px(st.hi) + (same ? 36 : 0), y - 16, 20, { align: "center", weight: 900, color: C.kiko }); text(ctx, "tengah", px(st.mid), y + h + 50, 20, { align: "center", weight: 900, color: st.found ? C.good : C.accentDark }); }
  };
  // kartu traceback: baris-baris, dengan penanda nomor baris dan jenis galat
  Qk.traceback = function (ctx, x, y, w, lines, opt = {}) {
    const h = 44 + lines.length * 34 + 16; card(ctx, x, y, w, h, { fill: "#0E1418", stroke: C.bad, lw: 3, r: 12 });
    lines.forEach(([t, kind], i) => text(ctx, t, x + 18, y + 40 + i * 34, 19, { weight: kind === "err" ? 900 : 700, color: kind === "err" ? "#FF8A80" : kind === "hl" ? "#F2B134" : "#D7E2DC" }));
    return h;
  };
  K.kualitas = Qk;
})(typeof window !== "undefined" ? window : globalThis);
