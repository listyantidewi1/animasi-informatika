/* T38 AND, OR, NOT dalam kehidupan sehari-hari — adegan khusus. Contoh dan barang rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const OPC = { AND: C.kuning, OR: C.pink, NOT: C.tosca };

  // kartu syarat: st = null (belum diketahui), true, false
  function cond(ctx, x, y, w, h, label, st, sub) {
    const col = st === null ? C.line : st ? C.good : C.bad;
    card(ctx, x, y, w, h, { fill: st === null ? C.panel : st ? C.goodBg : C.badBg, stroke: col, lw: 5, r: 24 });
    text(ctx, label, x + w / 2, y + 62, 40, { align: "center", weight: 900, color: C.ink, fit: w - 30 });
    if (sub) text(ctx, sub, x + w / 2, y + 102, 28, { align: "center", weight: 700, color: C.ink2, fit: w - 30 });
    const cy = y + h - 58;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + w / 2, cy, 34, 0, Math.PI * 2); ctx.fill();
    if (st === null) text(ctx, "?", x + w / 2, cy + 15, 44, { align: "center", weight: 900, color: C.ink });
    else if (st) check(ctx, x + w / 2, cy, 40, C.bg); else cross(ctx, x + w / 2, cy, 40, C.bg);
  }
  function gateBox(ctx, op, cx, cy, glow) {
    card(ctx, cx - 150, cy - 65, 300, 130, { fill: C.panel2, stroke: OPC[op], lw: 7, r: 30, glow: glow ? OPC[op] : null });
    text(ctx, op, cx, cy + 30, 84, { align: "center", weight: 900, color: OPC[op] });
  }
  // susunan gerbang: dua syarat -> op -> hasil
  function twoGate(ctx, b, l, t, A, op, head, L, st1, st2, res, resLabel) {
    const hu = pop(b, l, 0);
    if (hu > 0) { ctx.save(); ctx.translate(480, A.y + 55); ctx.scale(hu, hu); pill(ctx, head, 0, 0, 44, { fill: OPC[op] }); ctx.restore(); }
    const y1 = A.y + 140, ch = 230, gy = A.y + 500;
    cond(ctx, 70, y1, 380, ch, L[0], st1, L[2]); cond(ctx, 500, y1, 380, ch, L[1], st2, L[3]);
    ctx.strokeStyle = C.line; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(260, y1 + ch); ctx.lineTo(260, gy - 100); ctx.lineTo(420, gy - 65); ctx.moveTo(690, y1 + ch); ctx.lineTo(690, gy - 100); ctx.lineTo(540, gy - 65); ctx.stroke();
    gateBox(ctx, op, 480, gy, res);
    arrow(ctx, 480, gy + 70, 480, gy + 150, C.ink2, 8, 28);
    const oy = gy + 160, okc = res === null ? C.line : res ? C.good : C.bad;
    card(ctx, 180, oy, 600, 150, { fill: res ? C.goodBg : C.panel, stroke: okc, lw: 6, r: 30, glow: res ? "rgba(34,227,196,0.45)" : null });
    text(ctx, resLabel, 420, oy + 92, 50, { align: "center", weight: 900, color: C.ink, fit: 420 });
    ctx.fillStyle = okc; ctx.beginPath(); ctx.arc(700, oy + 75, 46, 0, Math.PI * 2); ctx.fill();
    if (res === null) text(ctx, "?", 700, oy + 95, 56, { align: "center", weight: 900, color: C.ink }); else if (res) check(ctx, 700, oy + 75, 54, C.bg); else cross(ctx, 700, oy + 75, 54, C.bg);
    const bs = Math.min(190, A.bot - oy - 170); if (bs > 90) bip(ctx, 480, oy + 160 + (A.bot - oy - 160) / 2, bs, { mood: res ? "happy" : "think", t, bounce: res ? 1.5 : 0 });
  }
  function kaos(ctx, cx, cy, s, col) {
    ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = col; ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-s * 0.18, -s * 0.42); ctx.quadraticCurveTo(0, -s * 0.3, s * 0.18, -s * 0.42); ctx.lineTo(s * 0.5, -s * 0.24); ctx.lineTo(s * 0.38, -s * 0.02);
    ctx.lineTo(s * 0.28, -s * 0.08); ctx.lineTo(s * 0.28, s * 0.45); ctx.lineTo(-s * 0.28, s * 0.45); ctx.lineTo(-s * 0.28, -s * 0.08); ctx.lineTo(-s * 0.38, -s * 0.02); ctx.lineTo(-s * 0.5, -s * 0.24); ctx.closePath();
    ctx.fill(); ctx.stroke(); ctx.restore();
  }
  function sepeda(ctx, cx, cy, s, col) {
    ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = col; ctx.lineWidth = s * 0.06; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * s * 0.32, s * 0.12, s * 0.22, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-s * 0.32, s * 0.12); ctx.lineTo(-s * 0.08, -s * 0.2); ctx.lineTo(s * 0.22, -s * 0.2); ctx.lineTo(s * 0.32, s * 0.12);
    ctx.moveTo(-s * 0.08, -s * 0.2); ctx.lineTo(0, s * 0.12); ctx.lineTo(s * 0.22, -s * 0.2); ctx.moveTo(-s * 0.14, -s * 0.3); ctx.lineTo(0, -s * 0.3); ctx.moveTo(s * 0.22, -s * 0.2); ctx.lineTo(s * 0.18, -s * 0.34); ctx.lineTo(s * 0.3, -s * 0.36); ctx.stroke();
    ctx.restore();
  }
  function awan(ctx, cx, cy, s, hujan, l) {
    if (!hujan) { ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(cx, cy, s * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = C.kuning; ctx.lineWidth = s * 0.05; ctx.lineCap = "round";
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + l * 0.5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * s * 0.4, cy + Math.sin(a) * s * 0.4); ctx.lineTo(cx + Math.cos(a) * s * 0.52, cy + Math.sin(a) * s * 0.52); ctx.stroke(); }
      return; }
    ctx.fillStyle = C.ink2; ctx.beginPath(); ctx.arc(cx - s * 0.2, cy, s * 0.2, 0, Math.PI * 2); ctx.arc(cx + s * 0.05, cy - s * 0.1, s * 0.26, 0, Math.PI * 2); ctx.arc(cx + s * 0.28, cy + s * 0.02, s * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.biru; ctx.lineWidth = s * 0.04; for (let i = 0; i < 4; i++) { const yy = ((l * 2 + i * 0.25) % 1) * s * 0.3; ctx.beginPath(); ctx.moveTo(cx - s * 0.25 + i * s * 0.16, cy + s * 0.22 + yy); ctx.lineTo(cx - s * 0.29 + i * s * 0.16, cy + s * 0.32 + yy); ctx.stroke(); }
  }

  Object.assign(T.SCENES, {
    // kait: tiga kata logika muncul satu per satu
    t38_gerbang(ctx, b, l, t, TL, A) {
      const ops = [["AND", "AND,"], ["OR", "OR,"], ["NOT", "NOT!"]];
      const bs = Math.min(150, A.h * 0.28);
      ops.forEach(([op, cw], i) => {
        const u = pop(b, l, cw); if (u <= 0) return;
        ctx.save(); ctx.translate(200 + i * 280, A.y + 90 + Math.sin(l * 4 + i) * 8); ctx.scale(u, u); ctx.rotate((i - 1) * 0.06);
        card(ctx, -125, -70, 250, 140, { fill: C.panel2, stroke: OPC[op], lw: 7, r: 30, glow: OPC[op] });
        text(ctx, op, 0, 30, 80, { align: "center", weight: 900, color: OPC[op] }); ctx.restore();
      });
      if (A.h > 330) bip(ctx, 480, A.y + 190 + (A.h - 190) / 2, Math.min(240, A.h - 230), { mood: cue(b, l, "NOT!") > 0 ? "wow" : "think", t });
    },
    t38_and(ctx, b, l, t, TL, A) {
      const s1 = cue(b, l, "pr selesai") > 0.3 ? true : null, s2 = cue(b, l, "rapi") > 0.2 ? true : null;
      twoGate(ctx, b, l, t, A, "AND", "AND: semua harus benar", ["PR selesai", "Kamar rapi"], s1, s2, s1 && s2 ? true : s1 ? false : null, "Boleh main");
    },
    t38_or(ctx, b, l, t, TL, A) {
      const s1 = cue(b, l, "kartu pelajar") > 0.4 ? false : null, s2 = cue(b, l, "surat izin") > 0.3 ? true : null;
      twoGate(ctx, b, l, t, A, "OR", "OR: cukup satu yang benar", ["Kartu pelajar", "Surat izin", "lupa dibawa", "dibawa"], s1, s2, s2 ? true : s1 === false ? false : null, "Boleh masuk");
    },
    // NOT: hujan (salah) dibalik menjadi benar -> naik sepeda
    t38_not(ctx, b, l, t, TL, A) {
      const hu = pop(b, l, 0);
      if (hu > 0) { ctx.save(); ctx.translate(480, A.y + 55); ctx.scale(hu, hu); pill(ctx, "NOT: membalik nilai", 0, 0, 44, { fill: C.tosca }); ctx.restore(); }
      // contoh singkat: benar -> salah, salah -> benar
      const ub = pop(b, l, "membalik");
      if (ub > 0 && cue(b, l, "kamu naik") < 0) {
        ctx.save(); ctx.globalAlpha = clamp(ub, 0, 1);
        [["BENAR", "SALAH", C.good, C.bad, 0], ["SALAH", "BENAR", C.bad, C.good, 1]].forEach(([a, z, ca, cz, i]) => {
          const y = A.y + 220 + i * 230, show = cue(b, l, i ? "dan salah" : "membalik") > 0;
          if (!show) return;
          card(ctx, 60, y, 230, 130, { fill: C.panel, stroke: ca, lw: 6, r: 24 }); text(ctx, a, 175, y + 82, 50, { align: "center", weight: 900, color: ca, fit: 200 });
          gateBox(ctx, "NOT", 480, y + 65, false);
          card(ctx, 670, y, 210, 130, { fill: C.panel, stroke: cz, lw: 6, r: 24 }); text(ctx, z, 775, y + 82, 50, { align: "center", weight: 900, color: cz, fit: 185 });
        });
        ctx.restore();
      }
      const us = cue(b, l, "kamu naik");
      if (us > 0) {
        const hujan = false, y = A.y + 150;
        card(ctx, 70, y, 380, 260, { fill: C.badBg, stroke: C.bad, lw: 5, r: 24 });
        text(ctx, "Hujan?", 260, y + 60, 44, { align: "center", weight: 900, color: C.ink });
        awan(ctx, 180, y + 170, 150, false, l); text(ctx, "SALAH", 340, y + 190, 44, { align: "center", weight: 900, color: C.bad });
        ctx.strokeStyle = C.line; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(260, y + 260); ctx.lineTo(260, y + 320); ctx.lineTo(400, y + 360); ctx.stroke();
        gateBox(ctx, "NOT", 480, y + 420, ph(b, l, "tidak hujan") > 0);
        arrow(ctx, 480, y + 490, 480, y + 560, C.ink2, 8, 28);
        const ur = pop(b, l, "tidak hujan"), oy = y + 570;
        if (ur > 0) { ctx.save(); ctx.globalAlpha = clamp(ur, 0, 1);
          card(ctx, 180, oy, 600, 200, { fill: C.goodBg, stroke: C.good, lw: 6, r: 30, glow: "rgba(34,227,196,0.45)" });
          text(ctx, "BENAR", 330, oy + 80, 54, { align: "center", weight: 900, color: C.good });
          text(ctx, "naik sepeda!", 330, oy + 140, 40, { align: "center", weight: 800, color: C.ink });
          sepeda(ctx, 640 + Math.sin(l * 3) * 10, oy + 100, 210, C.kuning); ctx.restore(); }
      }
    },
    // filter belanja: ukuran M AND warna hitam
    t38_filter(ctx, b, l, t, TL, A) {
      const f1 = ph(b, l, "ukuran m", 0.4), f2 = ph(b, l, "warna hitam", 0.4), ok = pop(b, l, "kedua syarat");
      const chip = (s, x, u) => { card(ctx, x, A.y + 20, 330, 80, { fill: u > 0.5 ? C.kuning : C.panel, stroke: C.kuning, lw: 4, r: 40 });
        text(ctx, s, x + 165, A.y + 72, 36, { align: "center", weight: 900, color: u > 0.5 ? C.bg : C.ink }); };
      chip("Ukuran: M", 70, f1); chip("Warna: Hitam", 550, f2);
      text(ctx, "AND", 475, A.y + 74, 40, { align: "center", weight: 900, color: f1 > 0.5 && f2 > 0.5 ? C.kuning : C.mute });
      const items = [["#1A1A22", "M", "Hitam"], ["#F0F0F5", "M", "Putih"], ["#1A1A22", "L", "Hitam"], ["#E0464B", "M", "Merah"], ["#1A1A22", "S", "Hitam"], ["#1A1A22", "M", "Hitam"]];
      const cw = 255, chh = Math.min(380, (A.bot - A.y - 150) / 2 - 20);
      items.forEach(([col, size, wn], i) => {
        const x = 70 + (i % 3) * (cw + 25), y = A.y + 140 + Math.floor(i / 3) * (chh + 24);
        const m1 = size === "M", m2 = wn === "Hitam", match = m1 && m2;
        const dim = Math.max(m1 ? 0 : f1, m2 ? 0 : f2);
        ctx.save(); ctx.globalAlpha = 1 - 0.75 * dim;
        card(ctx, x, y, cw, chh, { fill: C.panel, stroke: match && ok > 0 ? C.good : C.line, lw: match && ok > 0 ? 7 : 3, r: 24, glow: match && ok > 0 ? "rgba(34,227,196,0.5)" : null });
        card(ctx, x + 15, y + 15, cw - 30, chh * 0.58, { fill: "#2A3170", r: 16 });
        kaos(ctx, x + cw / 2, y + 15 + chh * 0.29, chh * 0.42, col);
        text(ctx, "Kaos " + wn, x + 20, y + chh * 0.58 + 70, 32, { weight: 800, color: C.ink, fit: cw - 40 });
        text(ctx, "Ukuran " + size, x + 20, y + chh * 0.58 + 112, 28, { weight: 700, color: C.ink2 });
        ctx.restore();
        if (match && ok > 0) { ctx.save(); ctx.translate(x + cw - 35, y + 35); ctx.scale(ok, ok); ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2); ctx.fill(); check(ctx, 0, 0, 36, C.bg); ctx.restore(); }
      });
    }
  });
})();
