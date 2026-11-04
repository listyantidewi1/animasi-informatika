/* T41 Bagaimana aplikasi peta mencari jalan tercepat — adegan khusus. Peta dan waktu tempuh rekaan.
   Graf: A-C 2, A-B 4, C-B 1, C-D 8, B-D 5, B-E 9, D-E 3 (menit). Jalur tercepat A-C-B-D-E = 11 menit (dihitung dengan Dijkstra). */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const N = { A: [160, 760], C: [300, 380], B: [480, 640], D: [660, 360], E: [800, 700] };
  const EDG = [["A", "C", 2], ["A", "B", 4], ["C", "B", 1], ["C", "D", 8], ["B", "D", 5], ["B", "E", 9], ["D", "E", 3]];
  const P = (A, k) => [N[k][0], A.y + 110 + (N[k][1] - 360) / 400 * (A.h - 340)];      // titik dalam area gambar

  function rumah(ctx, x, y, s) {
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 0.05); ctx.lineTo(x, y - s * 0.5); ctx.lineTo(x + s * 0.5, y - s * 0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F2F4FF"; ctx.fillRect(x - s * 0.36, y - s * 0.08, s * 0.72, s * 0.5); ctx.fillStyle = C.pink; ctx.fillRect(x - s * 0.1, y + s * 0.12, s * 0.2, s * 0.3);
  }
  function sekolah(ctx, x, y, s) {
    ctx.fillStyle = "#F2F4FF"; ctx.fillRect(x - s * 0.5, y - s * 0.15, s, s * 0.57); ctx.fillStyle = C.biru; ctx.fillRect(x - s * 0.55, y - s * 0.22, s * 1.1, s * 0.1);
    ctx.fillStyle = C.biru; for (let i = 0; i < 3; i++) ctx.fillRect(x - s * 0.38 + i * s * 0.28, y, s * 0.18, s * 0.16);
    ctx.strokeStyle = C.ink; ctx.lineWidth = s * 0.04; ctx.beginPath(); ctx.moveTo(x, y - s * 0.22); ctx.lineTo(x, y - s * 0.6); ctx.stroke();
    ctx.fillStyle = C.bad; ctx.fillRect(x, y - s * 0.6, s * 0.26, s * 0.1); ctx.fillStyle = C.ink; ctx.fillRect(x, y - s * 0.5, s * 0.26, s * 0.1);
  }
  function jalan(ctx, A, col, lw, a, b, frac) {
    const [x1, y1] = P(A, a), [x2, y2] = P(A, b), f = frac ?? 1;
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, f), lerp(y1, y2, f)); ctx.stroke();
  }
  function graf(ctx, A, l, o = {}) {
    for (const [a, b] of EDG) jalan(ctx, A, "#3A4590", 26, a, b);
    for (const [a, b] of EDG) jalan(ctx, A, "#5A66B0", 4, a, b);
    for (const seg of o.hl || []) jalan(ctx, A, seg[2] || C.tosca, 16, seg[0], seg[1], seg[3]);
    if (o.lab > 0) for (const [a, b, w0] of EDG) {
      const w = (o.w && o.w[a + b]) || w0, red = o.w && o.w[a + b];
      const [x1, y1] = P(A, a), [x2, y2] = P(A, b), u = clamp(o.lab, 0, 1);
      ctx.save(); ctx.translate((x1 + x2) / 2, (y1 + y2) / 2); ctx.scale(u, u); ctx.fillStyle = C.bg; ctx.strokeStyle = red ? C.bad : C.kuning; ctx.lineWidth = 4;
      rr(ctx, -46, -30, 92, 60, 18); ctx.fill(); ctx.stroke(); text(ctx, w + "'", 0, 14, 38, { align: "center", weight: 900, color: red ? C.bad : C.kuning }); ctx.restore();
    }
    if (o.nodes > 0) for (const k of Object.keys(N)) {
      const [x, y] = P(A, k), u = clamp(o.nodes, 0, 1.2), vis = o.visit && o.visit[k] !== undefined;
      ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.fillStyle = vis ? C.kuning : C.panel2; ctx.strokeStyle = C.ink; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      text(ctx, vis ? String(o.visit[k]) : k, 0, 14, 40, { align: "center", weight: 900, color: vis ? C.bg : C.ink }); ctx.restore();
    }
    const [ax, ay] = P(A, "A"), [ex, ey] = P(A, "E");
    rumah(ctx, ax, ay + 100, 80); text(ctx, "Rumah", ax, ay + 175, 32, { align: "center", weight: 800, color: C.ink2 });
    sekolah(ctx, ex, ey + 100, 80); text(ctx, "Sekolah", ex, ey + 175, 32, { align: "center", weight: 800, color: C.ink2 });
  }

  Object.assign(T.SCENES, {
    // kait: peta dengan banyak kemungkinan rute dari rumah ke sekolah
    t41_peta(ctx, b, l, t, TL, A) {
      const h = Math.min(560, A.h - 20), y = A.y + (A.h - h) / 2, x = 80, w = 800;
      ctx.save(); card(ctx, x, y, w, h, { fill: "#16365A", r: 30 }); rr(ctx, x, y, w, h, 30); ctx.clip();
      ctx.strokeStyle = "#2B5C8A"; ctx.lineWidth = 22;
      for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x + i * w / 6, y); ctx.lineTo(x + i * w / 6 + 40, y + h); ctx.stroke(); }
      for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x, y + i * h / 4); ctx.lineTo(x + w, y + i * h / 4 - 30); ctx.stroke(); }
      const s0 = [x + 70, y + h - 70], s1 = [x + w - 70, y + 80];
      const routes = [[s0, [x + 140, y + 90], s1], [s0, [x + w - 90, y + h - 90], s1], [s0, [x + 300, y + h / 2], [x + 560, y + h / 2 - 20], s1]];
      routes.forEach((r, i) => {
        const k = clamp((l - 0.3 - i * 0.5) / 0.8, 0, 1); if (k <= 0) return;
        ctx.strokeStyle = [C.kuning, C.pink, C.tosca][i]; ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.lineDashOffset = -l * 50;
        ctx.beginPath(); ctx.moveTo(r[0][0], r[0][1]); const segs = r.length - 1, upto = k * segs;
        for (let j = 1; j <= segs; j++) { const f = clamp(upto - (j - 1), 0, 1); if (f <= 0) break; ctx.lineTo(lerp(r[j - 1][0], r[j][0], f), lerp(r[j - 1][1], r[j][1], f)); }
        ctx.stroke(); ctx.setLineDash([]);
      });
      ctx.restore();
      rumah(ctx, s0[0], s0[1], 90); sekolah(ctx, s1[0], s1[1] + 20, 90);
      const u = pop(b, l, "paling cepat");
      if (u > 0) { ctx.save(); ctx.translate(480, y + h / 2); ctx.scale(u, u); ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill();
        text(ctx, "?", 0, 34, 100, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
    },
    // jalan menjadi titik dan garis dengan waktu tempuh
    t41_graf(ctx, b, l, t, TL, A) {
      graf(ctx, A, l, { nodes: pop(b, l, "titik"), lab: pop(b, l, "waktu tempuh") });
      const ug = pop(b, l, "garis");
      if (ug > 0) { ctx.save(); ctx.translate(480, A.y + 40); ctx.scale(ug, ug); pill(ctx, "angka = waktu tempuh (menit)", 0, 0, 36, { fill: C.kuning }); ctx.restore(); }
    },
    // menjelajah: selalu lanjut dari titik yang paling cepat dicapai (Dijkstra)
    t41_jelajah(ctx, b, l, t, TL, A) {
      const f = (l - ((b.speech ?? b.start) - b.start)) / (b.audio || 4);
      const steps = [["A", 0], ["C", 2], ["B", 3], ["D", 8], ["E", 11]], at = [0.02, 0.22, 0.42, 0.62, 0.82];
      const visit = {}, hl = [];
      steps.forEach(([k, v], i) => { if (f > at[i]) visit[k] = v; });
      if (f > 0.22) hl.push(["A", "C", C.biru]); if (f > 0.42) hl.push(["C", "B", C.biru]); if (f > 0.62) hl.push(["B", "D", C.biru]); if (f > 0.82) hl.push(["D", "E", C.biru]);
      if (f > 0.95) { hl.length = 0; const k = clamp((f - 0.95) / 0.12, 0, 1); [["A", "C"], ["C", "B"], ["B", "D"], ["D", "E"]].forEach(([a, c], i) => hl.push([a, c, C.tosca, clamp(k * 4 - i, 0, 1)])); }
      graf(ctx, A, l, { nodes: 1, lab: 1, visit, hl });
      // kotak penjelasan langkah
      const msg = f > 0.95 ? "Tercepat: 11 menit!" : f > 0.82 ? "Sekolah: 11 menit" : f > 0.62 ? "Lanjut dari 8 menit" : f > 0.42 ? "Lanjut dari 3 menit" : f > 0.22 ? "Lanjut dari 2 menit" : "Mulai dari rumah: 0";
      ctx.save(); ctx.translate(480, A.y + 40); pill(ctx, msg, 0, 0, 40, { fill: f > 0.95 ? C.tosca : C.kuning }); ctx.restore();
    },
    // rute berubah saat ada macet
    t41_ulang(ctx, b, l, t, TL, A) {
      const macet = cue(b, l, "kemacetan") > 0.3, baru = cue(b, l, "berubah") > 0;
      const r1 = ["A", "C", "B", "D", "E"], r2 = ["A", "C", "B", "E"], r = baru ? r2 : r1;
      const hl = []; for (let i = 0; i < r.length - 1; i++) hl.push([r[i], r[i + 1], baru ? C.pink : C.tosca]);
      if (macet) hl.push(["B", "D", C.bad]);
      graf(ctx, A, l, { nodes: 1, lab: 1, hl, w: macet ? { BD: 15 } : null });
      // mobil berjalan dari A ke C ke B
      const k = clamp(l / 3.5, 0, 1), path = ["A", "C", "B"], seg = Math.min(1, Math.floor(k * 2)), fr = k * 2 - seg;
      const [x1, y1] = P(A, path[seg]), [x2, y2] = P(A, path[Math.min(2, seg + 1)]), cx = lerp(x1, x2, k >= 1 ? 1 : fr), cy = lerp(y1, y2, k >= 1 ? 1 : fr);
      ctx.save(); ctx.translate(cx, cy - 55); card(ctx, -40, -22, 80, 44, { fill: C.kuning, r: 14 }); card(ctx, -24, -36, 48, 22, { fill: C.kuning, r: 8 });
      ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(-22, 22, 10, 0, Math.PI * 2); ctx.arc(22, 22, 10, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      if (macet) { const [bx, by] = P(A, "B"), [dx, dy] = P(A, "D"); ctx.save(); ctx.translate((bx + dx) / 2 - 10, (by + dy) / 2 - 75); const u = pop(b, l, "kemacetan"); ctx.scale(u, u); pill(ctx, "MACET", 0, 0, 34, { fill: C.bad, color: C.ink }); ctx.restore(); }
      const ub = pop(b, l, "berubah");
      ctx.save(); ctx.translate(480, A.y + 40); if (ub > 0) { ctx.scale(ub, ub); pill(ctx, "Rute baru: 12 menit, tidak kena macet", 0, 0, 34, { fill: C.pink, color: C.ink }); }
      else pill(ctx, "Rute: 11 menit", 0, 0, 38, { fill: C.tosca }); ctx.restore();
    }
  });
})();
