/* T16 Tombol undo bekerja seperti tumpukan piring — adegan khusus. Pengolah kata generik. */
(function () {
  const T = TikTok, C = T.C, { rr, text, font, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const STEPS = [["Ketik “Halo semua”", C.biru], ["Tebalkan huruf", C.pink], ["Hapus “semua”", C.kuning]];

  // piring dengan label; (cx, cy) = tengah piring
  function plate(ctx, cx, cy, w, label, col, alpha) {
    ctx.save(); ctx.globalAlpha = alpha ?? 1;
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(cx, cy + 14, w / 2, 26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#E8ECF8"; ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, 30, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#C7CEEF"; ctx.beginPath(); ctx.ellipse(cx, cy - 4, w * 0.36, 18, 0, 0, Math.PI * 2); ctx.fill();
    if (col) { ctx.fillStyle = col; ctx.fillRect(cx - w / 2 + 6, cy - 3, w - 12, 8); }
    if (label) { card(ctx, cx - w / 2 + 24, cy - 32, w - 48, 62, { fill: col || C.panel2, r: 18 }); text(ctx, label, cx, cy + 13, 38, { align: "center", weight: 900, color: C.bg, fit: w - 80 }); }
    ctx.restore();
  }
  // tumpukan: items dari bawah ke atas; mengembalikan y piring paling atas berikutnya
  function stack(ctx, cx, base, w, items, gap) {
    items.forEach(([lab, col, a, dy], i) => plate(ctx, cx, base - i * gap + (dy || 0), w, lab, col, a));
    return base - items.length * gap;
  }
  // dokumen generik: state 0 kosong, 1 "Halo semua", 2 tebal, 3 "Halo" (semua dihapus)
  function doc(ctx, x, y, w, h, st, t) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", r: 18 });
    ctx.fillStyle = "#DDE2F5"; ctx.fillRect(x, y, w, 56); text(ctx, "Dokumen", x + 24, y + 38, 26, { weight: 800, color: C.bg });
    const s = st >= 3 ? "Halo" : st >= 1 ? "Halo semua" : "";
    text(ctx, s, x + 30, y + 130, 52, { weight: st >= 2 ? 900 : 400, color: C.bg, fit: w - 60 });
    font(ctx, 52, st >= 2 ? 900 : 400); const cw = ctx.measureText(s).width;
    if (Math.floor(t * 2.5) % 2 === 0) { ctx.fillStyle = C.biru; ctx.fillRect(x + 34 + cw, y + 86, 4, 56); }
  }
  function undoBtn(ctx, x, y, s, pressed, col, redo) {
    ctx.save(); ctx.translate(x, y); const k = pressed ? 0.9 : 1; ctx.scale(k, k);
    card(ctx, -s / 2, -s / 2, s, s, { fill: pressed ? (col || C.kuning) : C.panel2, stroke: col || C.kuning, lw: 5, r: s * 0.24, glow: pressed ? "rgba(255,210,63,0.6)" : null });
    ctx.strokeStyle = pressed ? C.bg : C.ink; ctx.lineWidth = s * 0.09; ctx.lineCap = "round"; if (redo) ctx.scale(-1, 1);
    ctx.beginPath(); ctx.arc(s * 0.02, s * 0.1, s * 0.22, Math.PI * 0.2, Math.PI * 1.02, true); ctx.stroke();
    ctx.fillStyle = pressed ? C.bg : C.ink; ctx.beginPath(); ctx.moveTo(-s * 0.36, s * 0.04); ctx.lineTo(-s * 0.04, s * 0.04); ctx.lineTo(-s * 0.2, s * 0.28); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: tumpukan piring + tombol undo; piring teratas terangkat
    t16_piring(ctx, b, l, t, TL, A) {
      const base = A.y + A.h - 60, cx = 330, gap = Math.min(60, (A.h - 120) / 6);
      const lift = ease((cue(b, l, "lebih dulu") ) / 0.6);
      const items = [0, 1, 2, 3, 4].map(i => [null, null, 1, 0]);
      stack(ctx, cx, base, 380, items.slice(0, 4), gap);
      plate(ctx, cx + lift * 150, base - 4 * gap - lift * 110, 380, null, C.kuning, 1);
      undoBtn(ctx, 760, A.y + A.h * 0.45, 170, cue(b, l, "undo") > 0 && cue(b, l, "undo") < 0.3, C.kuning);
      text(ctx, "Undo", 760, A.y + A.h * 0.45 + 140, 44, { align: "center", weight: 900, color: C.kuning });
    },
    // tiap langkah jadi piring baru di atas tumpukan; dokumen berubah
    t16_tumpuk(ctx, b, l, t, TL, A) {
      const cues = ["mengetik", "menebalkan", "menghapus"], n = cues.filter(c => cue(b, l, c) > 0).length;
      doc(ctx, A.x, A.y + 10, 820, 200, n, t);
      const base = A.bot - 60, cx = 480, gap = 110;
      text(ctx, "Tumpukan langkah", A.x, A.y + 290, 44, { weight: 900, color: C.kuning });
      const items = [];
      for (let i = 0; i < n; i++) { const d = ease(cue(b, l, cues[i]) / 0.5); items.push([STEPS[i][0], STEPS[i][1], d, -(1 - d) * 260]); }
      stack(ctx, cx, base, 640, items, gap);
    },
    // undo: piring teratas ("Hapus semua") diambil, dokumen kembali
    t16_undo(ctx, b, l, t, TL, A) {
      const go = cue(b, l, "undo"), k = ease((go - 0.15) / 0.6), st = k > 0.5 ? 2 : 3;
      doc(ctx, A.x, A.y + 10, 600, 200, st, t);
      undoBtn(ctx, A.x + 730, A.y + 110, 150, go > 0 && go < 0.3);
      const base = A.bot - 60, cx = 480, gap = 110;
      stack(ctx, cx, base, 640, [[STEPS[0][0], STEPS[0][1], 1], [STEPS[1][0], STEPS[1][1], 1]], gap);
      const top = cue(b, l, "paling atas") > 0;
      plate(ctx, cx + k * 120, base - 2 * gap - k * 220, 640, STEPS[2][0], STEPS[2][1], 1 - 0.3 * k);
      if (k > 0.5) { const u = pop(b, l, "piring paling atas"); if (u > 0) { ctx.save(); ctx.translate(480, A.y + 300); ctx.scale(u, u); pill(ctx, "“semua” kembali!", 0, 0, 44, { fill: C.tosca }); ctx.restore(); } }
      if (top && k <= 0.5) { ctx.save(); ctx.strokeStyle = C.kuning; ctx.lineWidth = 6; ctx.setLineDash([12, 8]); rr(ctx, cx - 330, base - 2 * gap - 50, 660, 100, 30); ctx.stroke(); ctx.restore(); }
    },
    // stack: terakhir masuk, pertama keluar
    t16_stack(ctx, b, l, t, TL, A) {
      const us = pop(b, l, "stack");
      if (us > 0) { ctx.save(); ctx.translate(480, A.y + 70); ctx.scale(us, us); text(ctx, "stack", 0, 30, 110, { align: "center", weight: 900, color: C.kuning, shadow: true }); ctx.restore(); }
      // wadah tumpukan
      const cx = 400, base = A.bot - 60, gap = 100, wx = cx - 260, top = A.y + 320;
      ctx.strokeStyle = C.ink2; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(wx, top); ctx.lineTo(wx, base + 50); ctx.lineTo(wx + 520, base + 50); ctx.lineTo(wx + 520, top); ctx.stroke();
      const ui = ease(cue(b, l, "terakhir masuk") / 0.6), uo = ease(cue(b, l, "pertama keluar") / 0.6);
      const items = [["1", C.biru], ["2", C.pink], ["3", C.tosca]].map(([s, c]) => ["Langkah " + s, c, 1]);
      stack(ctx, cx, base, 460, items, gap);
      // piring 4 masuk lalu keluar
      const yIn = lerp(top - 90, base - 3 * gap, ui), yOut = lerp(base - 3 * gap, top - 90, uo), y4 = uo > 0 ? yOut : yIn;
      if (ui > 0) plate(ctx, cx + (uo > 0 ? uo * 120 : 0), y4, 460, "Langkah 4", C.kuning, 1);
      const ax = cx + 330;
      if (ui > 0) { ctx.save(); ctx.globalAlpha = ui; arrow(ctx, ax, top - 60, ax, top + 120, C.tosca, 10, 30); text(ctx, "masuk", ax + 20, top + 170, 40, { weight: 900, color: C.tosca }); ctx.restore(); }
      if (uo > 0) { ctx.save(); ctx.globalAlpha = uo; arrow(ctx, ax + 60, top + 120, ax + 60, top - 60, C.pink, 10, 30); text(ctx, "keluar", ax + 20, top + 230, 40, { weight: 900, color: C.pink }); ctx.restore(); }
    },
    // dua tumpukan: undo memindah piring ke tumpukan redo; redo mengembalikannya
    t16_redo(ctx, b, l, t, TL, A) {
      const base = A.bot - 80, gap = 90, w = 360, lx = A.x + 200, rx = A.x + 620;
      const mv = ease(cue(b, l, "dipindah") / 0.8), back2 = ease(cue(b, l, "mengembalikannya") / 0.8);
      text(ctx, "Undo", lx, A.y + 60, 50, { align: "center", weight: 900, color: C.kuning });
      text(ctx, "Redo", rx, A.y + 60, 50, { align: "center", weight: 900, color: C.tosca });
      undoBtn(ctx, lx, A.y + 170, 120, cue(b, l, "dibatalkan") > 0 && cue(b, l, "dibatalkan") < 0.3, C.kuning);
      undoBtn(ctx, rx, A.y + 170, 120, cue(b, l, "redo") > 0 && cue(b, l, "redo") < 0.3, C.tosca, true);
      stack(ctx, lx, base, w, [[STEPS[0][0], STEPS[0][1], 1], [STEPS[1][0], STEPS[1][1], 1]], gap);
      // piring yang berpindah: kiri atas -> kanan bawah -> kembali ke kiri
      const p0 = [lx, base - 2 * gap], p1 = [rx, base], k = mv - back2;
      const x = lerp(p0[0], p1[0], k), y = lerp(p0[1], p1[1], k) - Math.sin(k * Math.PI) * 220;
      plate(ctx, x, y, w, STEPS[2][0], STEPS[2][1], 1);
      ctx.strokeStyle = "rgba(184,192,238,0.35)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(lx - w / 2 - 10, base + 50); ctx.lineTo(lx + w / 2 + 10, base + 50); ctx.moveTo(rx - w / 2 - 10, base + 50); ctx.lineTo(rx + w / 2 + 10, base + 50); ctx.stroke();
    }
  });
})();
