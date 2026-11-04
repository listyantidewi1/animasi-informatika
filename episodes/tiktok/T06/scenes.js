/* T06 Tebak angka 1 sampai 100 cukup dengan 7 tebakan — adegan khusus. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, bip, bubble, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  // urutan tebakan untuk angka 83 (selalu tebak tengah): [tebakan, jawaban, rentang sisa lo..hi sesudahnya]
  const G = [[50, "Lebih besar!", 51, 100], [75, "Lebih besar!", 76, 100], [88, "Lebih kecil!", 76, 87], [81, "Lebih besar!", 82, 87],
             [84, "Lebih kecil!", 82, 83], [82, "Lebih besar!", 83, 83], [83, "BENAR!", 83, 83]];

  // papan 10x10 angka 1..100; st(n) -> {on: masih mungkin, hi: sorotan warna}
  function board(ctx, x, y, w, st, t) {
    const g = 6, c = (w - 9 * g) / 10;
    for (let n = 1; n <= 100; n++) {
      const i = (n - 1) % 10, j = Math.floor((n - 1) / 10), s = st(n), cx = x + i * (c + g), cy = y + j * (c + g);
      ctx.save(); ctx.globalAlpha = s.a ?? 1;
      card(ctx, cx, cy, c, c, { fill: s.hi || (s.on ? C.panel2 : "#121741"), r: c * 0.2, stroke: s.hi ? null : s.on ? C.line : null, lw: 2 });
      text(ctx, String(n), cx + c / 2, cy + c * 0.64, c * 0.42, { align: "center", weight: 800, color: s.hi ? C.bg : s.on ? C.ink : C.mute });
      ctx.restore();
    }
    return w;
  }

  Object.assign(T.SCENES, {
    // di bawah kait: papan 1..100 dengan sorotan acak yang berlari, lalu tanda "?"
    t06_grid(ctx, b, l, t, TL, A) {
      const w = Math.min(540, A.h - 60), x = 90, y = A.y + (A.h - w) / 2, k = Math.floor(t * 9);
      board(ctx, x, y, w, n => ({ on: true, hi: n === 1 + Math.floor(rnd(k) * 100) ? C.kuning : null, a: ph(b, l, 0, 0.5) }), t);
      const u = pop(b, l, "7 tebakan");
      bip(ctx, 820, y + w * 0.35, 150, { mood: "happy", t });
      if (u > 0) { ctx.save(); ctx.translate(820, y + w * 0.78); ctx.scale(u, u); ctx.rotate(0.08); card(ctx, -100, -70, 200, 140, { fill: C.kuning, r: 26 });
        text(ctx, "≤ 7", 0, 30, 82, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
    },
    // tebakan pertama 50 -> "Lebih besar!" -> angka 1..50 dicoret
    t06_tebak(ctx, b, l, t, TL, A) {
      const w = Math.min(820, A.h - 300), x = A.x + (820 - w) / 2, y = A.y + 230;
      const ug = pop(b, l, "menebak 50"), ua = pop(b, l, "lebih besar"), dim = ph(b, l, "lebih besar", 0.8), mid = ph(b, l, "di tengah", 0.5);
      board(ctx, x, y, w, n => ({ on: !(n <= 50 && dim > 0.5), hi: n === 50 && (mid > 0 || ug > 0) ? C.kuning : null, a: n <= 50 ? 1 - 0.6 * dim : 1 }), t);
      // Bip menebak, murid menjawab
      bip(ctx, A.x + 90, A.y + 120, 150, { mood: "think", t });
      if (ug > 0) { ctx.save(); ctx.globalAlpha = clamp(ug, 0, 1); bubble(ctx, "50?", A.x + 180, A.y + 150, 200, 60, {}); ctx.restore(); }
      if (ua > 0) { ctx.save(); ctx.globalAlpha = clamp(ua, 0, 1); bubble(ctx, "Lebih besar!", A.x + 420, A.y + 150, 400, 52, { fill: C.tosca, tailX: A.x + 760 }); ctx.restore(); }
      const u83 = pop(b, l, "83");
      if (u83 > 0 && ug <= 0) { ctx.save(); ctx.translate(A.x + 620, A.y + 100); ctx.scale(u83, u83); pill(ctx, "Angkamu: 83 (rahasia)", 0, 0, 38, { fill: C.pink, color: C.ink }); ctx.restore(); }
      // garis tengah
      if (mid > 0 && ug <= 0) { ctx.save(); ctx.globalAlpha = mid; ctx.strokeStyle = C.kuning; ctx.lineWidth = 6; ctx.setLineDash([16, 12]);
        ctx.beginPath(); ctx.moveTo(x - 10, y + w / 2 - 3); ctx.lineTo(x + w + 10, y + w / 2 - 3); ctx.stroke(); ctx.restore(); }
    },
    // tebakan berikutnya: kemungkinan tinggal separuh tiap kali, sampai 83 ketemu
    t06_buang(ctx, b, l, t, TL, A) {
      const cues = ["menjadi 50", "25", "12", " 6,", "sampai", "tinggal", "satu."];
      let k = -1; cues.forEach((c, i) => { if (cue(b, l, c) > 0) k = i; });
      const w = Math.min(760, A.h - 330), x = A.x + (820 - w) / 2, y = A.y + 200;
      const cur = k >= 0 ? G[k] : null, lo = cur ? cur[2] : 1, hi = cur ? cur[3] : 100, found = k === 6;
      board(ctx, x, y, w, n => ({ on: n >= lo && n <= hi, hi: found && n === 83 ? C.good : cur && n === cur[0] && !found ? C.kuning : null, a: n >= lo && n <= hi ? 1 : 0.35 }), t);
      // tebakan ke-n dan jawabannya
      if (cur) {
        const u = pop(b, l, cues[k], 0.35);
        ctx.save(); ctx.translate(A.x + 200, A.y + 70); ctx.scale(u, u);
        card(ctx, -190, -60, 380, 120, { fill: C.panel, stroke: C.kuning, lw: 4, r: 24 });
        text(ctx, "Tebakan ke-" + (k + 1), 0, -10, 32, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, String(cur[0]), 0, 46, 56, { align: "center", weight: 900, color: C.kuning }); ctx.restore();
        ctx.save(); ctx.translate(A.x + 610, A.y + 70); ctx.scale(u, u); pill(ctx, cur[1], 0, 0, 44, { fill: found ? C.good : cur[1].includes("besar") ? C.tosca : C.pink, color: found ? C.bg : C.ink }); ctx.restore();
      }
      // penghitung sisa kemungkinan
      const n = hi - lo + 1, yb = y + w + 30;
      if (A.bot - yb > 80) {
        card(ctx, A.x, yb, 820, 90, { fill: C.bg2, stroke: C.line, lw: 3, r: 24 });
        text(ctx, "Sisa kemungkinan:", A.x + 30, yb + 60, 40, { weight: 800, color: C.ink2 });
        text(ctx, String(n), A.x + 790, yb + 64, 58, { weight: 900, color: n === 1 ? C.good : C.kuning, align: "right" });
      }
      if (found) { const u = pop(b, l, "satu."); ctx.save(); ctx.translate(480, y + w / 2); ctx.rotate(-0.1); ctx.scale(u, u);
        card(ctx, -300, -80, 600, 160, { fill: C.good, r: 30, glow: "rgba(34,227,196,0.6)" }); text(ctx, "7 tebakan!", 0, 30, 90, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
    }
  });
})();
