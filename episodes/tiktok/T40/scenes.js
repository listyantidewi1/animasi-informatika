/* T40 Antrean: yang datang duluan dilayani duluan — adegan khusus. Dokumen, orang, dan nomor antrean rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, fmt, cue, ph, pop } = T.helpers;
  const COL = [C.kuning, C.pink, C.tosca, C.biru, "#B98CFF"];

  function printer(ctx, cx, cy, s, l, busy) {
    card(ctx, cx - s * 0.6, cy - s * 0.42, s * 1.2, s * 0.22, { fill: "#E3E7FA", r: s * 0.05 });          // baki kertas atas
    card(ctx, cx - s * 0.75, cy - s * 0.25, s * 1.5, s * 0.55, { fill: C.panel2, stroke: C.line, lw: 5, r: s * 0.1 });
    card(ctx, cx - s * 0.55, cy + s * 0.12, s * 1.1, s * 0.07, { fill: "#05071A", r: s * 0.03 });          // celah keluar
    ctx.fillStyle = busy ? (Math.sin(l * 10) > 0 ? C.good : C.goodBg) : C.mute; ctx.beginPath(); ctx.arc(cx + s * 0.55, cy - s * 0.1, s * 0.05, 0, Math.PI * 2); ctx.fill();
  }
  function dok(ctx, x, y, w, h, n, a) {      // kartu dokumen bernomor
    ctx.save(); ctx.globalAlpha = a ?? 1;
    card(ctx, x, y, w, h, { fill: C.panel, stroke: COL[(n - 1) % 5], lw: 5, r: 20 });
    card(ctx, x + 20, y + 14, h * 0.62, h - 28, { fill: "#F2F4FF", r: 8 });
    ctx.fillStyle = "#B8C0EE"; for (let i = 0; i < 3; i++) ctx.fillRect(x + 30, y + 30 + i * (h - 60) / 3, h * 0.42, 6);
    text(ctx, "Dokumen " + n, x + h * 0.62 + 40, y + h / 2 + 16, 44, { weight: 900, color: C.ink, fit: w - h * 0.62 - 60 });
    ctx.restore();
  }
  function orang(ctx, x, y, s, col, mood) {
    ctx.fillStyle = col; rr(ctx, x - s * 0.28, y - s * 0.1, s * 0.56, s * 0.6, s * 0.2); ctx.fill();
    ctx.fillStyle = "#C98B62"; ctx.beginPath(); ctx.arc(x, y - s * 0.32, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2B1B14"; ctx.beginPath(); ctx.arc(x, y - s * 0.38, s * 0.22, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#1A1020"; ctx.beginPath(); ctx.arc(x - s * 0.08, y - s * 0.3, s * 0.03, 0, Math.PI * 2); ctx.arc(x + s * 0.08, y - s * 0.3, s * 0.03, 0, Math.PI * 2); ctx.fill();
  }
  // antrean tegak: printer di atas, dokumen berbaris di bawahnya. shift = berapa dokumen sudah masuk printer (pecahan untuk gerak)
  function antrean(ctx, A, l, ids, shift, enter) {
    const py = A.y + 120; printer(ctx, 480, py, 260, l, true);
    const gap = Math.min(165, (A.bot - py - 170) / 4.3), x = 140, w = 480, h = gap - 24;
    ids.forEach((n, i) => {
      const pos = i - shift; let y = py + 150 + pos * gap, a = 1;
      if (pos < 0) { y = py + 150 + pos * 200; a = clamp(1 + pos * 1.5, 0, 1); }
      if (n === enter?.n) { y = lerp(A.bot + 50, y, ease(enter.u)); a = clamp(enter.u * 2, 0, 1); }
      if (a > 0) dok(ctx, x, y, w, h, n, a);
    });
    return { py, gap, x, w, h };
  }

  Object.assign(T.SCENES, {
    // kait: printer mencetak tiga dokumen sesuai urutan kirim
    t40_printer(ctx, b, l, t, TL, A) {
      const s = Math.min(320, A.h * 0.6), cx = 330, cy = A.y + A.h * 0.42;
      printer(ctx, cx, cy, s, l, true);
      for (let i = 0; i < 3; i++) {
        const k = clamp((l - 0.4 - i * 0.9) / 0.8, 0, 1); if (k <= 0) continue;
        const x = lerp(cx - s * 0.35, 640 + i * 18, ease(k)), y = lerp(cy + s * 0.12, cy + s * 0.1 - i * 18, ease(k)) + Math.sin(k * Math.PI) * 60;
        card(ctx, x, y, s * 0.7, s * 0.5, { fill: "#F2F4FF", stroke: COL[i], lw: 6, r: 12 });
        text(ctx, String(i + 1), x + s * 0.35, y + s * 0.36, s * 0.3, { align: "center", weight: 900, color: COL[i] === C.kuning ? "#C9A21F" : COL[i] });
      }
      const u = pop(b, l, "yang pertama");
      if (u > 0) { ctx.save(); ctx.translate(480, A.bot - 40); ctx.scale(u, u); pill(ctx, "1 → 2 → 3", 0, 0, 46, { fill: C.kuning }); ctx.restore(); }
    },
    // dokumen berbaris; yang depan masuk printer lebih dulu
    t40_antre(ctx, b, l, t, TL, A) {
      const sh = clamp(cue(b, l, "duluan dilayani") / 0.8, 0, 1);
      const g = antrean(ctx, A, l, [1, 2, 3, 4], sh);
      const uq = pop(b, l, "queue");
      if (uq > 0) { ctx.save(); ctx.translate(800, g.py + 10); ctx.rotate(0.08); ctx.scale(uq, uq); pill(ctx, "queue", 0, 0, 44, { fill: C.pink, color: C.ink }); ctx.restore(); }
      const ud = pop(b, l, "duluan");
      if (ud > 0) { ctx.save(); ctx.globalAlpha = clamp(ud, 0, 1); text(ctx, "DEPAN", 760, g.py + 150 + g.h / 2 + 14, 40, { align: "center", weight: 900, color: C.good }); arrow(ctx, 660, g.py + 150 + g.h / 2, 630, g.py + 150 + g.h / 2, C.good, 8, 26); ctx.restore(); }
    },
    // masuk di belakang, keluar di depan
    t40_masuk(ctx, b, l, t, TL, A) {
      const en = clamp(cue(b, l, "masuk") / 0.7, 0, 1), sh = clamp(cue(b, l, "paling depan") / 0.8, 0, 1);
      const g = antrean(ctx, A, l, [2, 3, 4, 5], sh, { n: 5, u: en });
      const yb = g.py + 150 + (3 - sh) * g.gap + g.h / 2;
      const ub = pop(b, l, "belakang");
      if (ub > 0) { ctx.save(); ctx.globalAlpha = clamp(ub, 0, 1); text(ctx, "BELAKANG", 760, yb + 14, 36, { align: "center", weight: 900, color: C.kuning, fit: 220 });
        text(ctx, "masuk", 760, yb + 56, 32, { align: "center", weight: 700, color: C.ink2 }); arrow(ctx, 760, yb + 90, 640, yb + 40, C.kuning, 8, 26); ctx.restore(); }
      const uf = pop(b, l, "paling depan");
      if (uf > 0) { ctx.save(); ctx.globalAlpha = clamp(uf, 0, 1); text(ctx, "DEPAN", 760, g.py + 170, 36, { align: "center", weight: 900, color: C.good });
        text(ctx, "keluar", 760, g.py + 212, 32, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
    },
    // antre di kantin: yang menyerobot ditolak dan pindah ke belakang
    t40_kantin(ctx, b, l, t, TL, A) {
      const gy = A.y + A.h * 0.55;
      // warung kantin
      card(ctx, 70, gy - 260, 170, 330, { fill: C.panel2, stroke: C.line, lw: 4, r: 14 });
      for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? C.ink : C.bad; ctx.beginPath(); ctx.moveTo(60 + i * 38, gy - 270); ctx.lineTo(98 + i * 38, gy - 270); ctx.lineTo(98 + i * 38, gy - 215); ctx.arc(79 + i * 38, gy - 215, 19, 0, Math.PI); ctx.closePath(); ctx.fill(); }
      text(ctx, "Kantin", 155, gy - 110, 38, { align: "center", weight: 900, color: C.kuning });
      ctx.fillStyle = C.line; ctx.fillRect(60, gy + 70, 820, 8);
      const cols = [C.biru, C.tosca, C.kuning, "#B98CFF"];
      for (let i = 0; i < 4; i++) orang(ctx, 330 + i * 135, gy, 170 + Math.sin(l * 3 + i) * 2, cols[i]);
      // penyerobot
      const c = cue(b, l, "menyerobot"), k1 = ease(c / 0.6), k2 = ease((c - 1.2) / 0.8);
      let x = lerp(850, 400, k1), y = lerp(gy - 40, gy - 190, k1);
      if (k2 > 0) { x = lerp(400, 850, k2); y = lerp(gy - 190, gy, k2); }
      if (c > -0.5) orang(ctx, x, y, 150, C.pink);
      if (c > 0.5 && k2 < 1) { const u = back(clamp((c - 0.5) / 0.4, 0, 1)); ctx.save(); ctx.translate(400, gy - 370); ctx.scale(u, u);
        ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(0, 0, 60, 0, Math.PI * 2); ctx.fill(); cross(ctx, 0, 0, 64, C.ink); ctx.restore(); }
      const ua = pop(b, l, "antre di");
      if (ua > 0) { ctx.save(); ctx.translate(480, A.y + 70); ctx.scale(ua, ua); pill(ctx, "Tidak boleh menyerobot!", 0, 0, 48, { fill: C.kuning }); ctx.restore(); }
      bip(ctx, 480, A.bot - 120, Math.min(200, A.bot - gy - 140), { mood: k2 > 0 ? "happy" : c > 0 ? "wow" : "happy", t });
    },
    // antrean tiket konser daring: ribuan orang, dilayani sesuai urutan datang
    t40_tiket(ctx, b, l, t, TL, A) {
      const cr = cue(b, l, "ribuan");
      for (let i = 0; i < 60; i++) {           // kerumunan titik yang menyalur ke antrean
        if (cr < i * 0.02) continue;
        const k = ((l * 0.4 + rnd(i) ) % 1), sx = 80 + rnd(i + 7) * 800, sy = A.y + 20 + rnd(i + 3) * 120;
        const x = lerp(sx, 480, ease(k)), y = lerp(sy, A.y + 300, ease(k));
        ctx.fillStyle = COL[i % 5]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      }
      const h = Math.min(640, A.bot - A.y - 330), w = 440, x = 260, y = A.y + 320;
      card(ctx, x, y, w, h, { fill: "#05071A", stroke: C.line, lw: 6, r: 50 });
      const s = { x: x + 22, y: y + 50, w: w - 44, h: h - 80 }; card(ctx, s.x, s.y, s.w, s.h, { fill: C.bg2, r: 30 });
      text(ctx, "Tiket Konser", s.x + s.w / 2, s.y + 60, 38, { align: "center", weight: 900, color: C.ink });
      text(ctx, "Kamu di antrean ke-", s.x + s.w / 2, s.y + 130, 30, { align: "center", weight: 700, color: C.ink2 });
      const kc = cue(b, l, "pembeli"), k = clamp(kc / 2.0, 0, 1), n = Math.round(1204 - 1203 * ease(k));
      text(ctx, fmt(n), s.x + s.w / 2, s.y + 240, 100, { align: "center", weight: 900, color: n === 1 ? C.good : C.kuning, fit: s.w - 30 });
      card(ctx, s.x + 30, s.y + 290, s.w - 60, 24, { fill: C.panel, r: 12 }); card(ctx, s.x + 30, s.y + 290, Math.max(24, (s.w - 60) * (0.1 + 0.9 * ease(k))), 24, { fill: C.tosca, r: 12 });
      if (n === 1 && s.h > 420) { const ug = back(clamp((kc - 2.0) / 0.4, 0, 1)); ctx.save(); ctx.translate(s.x + s.w / 2, s.y + 390); ctx.scale(ug, ug); pill(ctx, "Giliranmu!", 0, 0, 40, { fill: C.good }); ctx.restore(); }
    }
  });
})();
