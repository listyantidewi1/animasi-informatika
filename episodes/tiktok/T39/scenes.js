/* T39 Kenapa update aplikasi itu penting? — adegan khusus. Nama aplikasi dan nomor versi rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;

  function phone(ctx, x, y, w, h, stroke) {
    card(ctx, x, y, w, h, { fill: "#05071A", stroke: stroke || C.line, lw: 6, r: w * 0.13 });
    const s = { x: x + w * 0.05, y: y + w * 0.12, w: w * 0.9, h: h - w * 0.2 };
    card(ctx, s.x, s.y, s.w, s.h, { fill: C.bg2, r: w * 0.08 }); return s;
  }
  function kumbang(ctx, x, y, s, a) {         // "bug": kumbang kecil
    ctx.save(); ctx.translate(x, y); ctx.rotate(a || 0); ctx.strokeStyle = C.bad; ctx.lineWidth = s * 0.06; ctx.lineCap = "round";
    for (const k of [-1, 1]) for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(k * s * 0.2, i * s * 0.18); ctx.lineTo(k * s * 0.45, i * s * 0.24 + Math.sin(i + k) * s * 0.06); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.38); ctx.lineTo(-s * 0.2, -s * 0.55); ctx.moveTo(s * 0.08, -s * 0.38); ctx.lineTo(s * 0.2, -s * 0.55); ctx.stroke();
    ctx.fillStyle = C.bad; ctx.beginPath(); ctx.ellipse(0, s * 0.05, s * 0.26, s * 0.34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s * 0.32, s * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.badBg; ctx.lineWidth = s * 0.04; ctx.beginPath(); ctx.moveTo(0, -s * 0.2); ctx.lineTo(0, s * 0.36); ctx.stroke(); ctx.restore();
  }
  // tembok aplikasi dari bata; crack 0..1 = retakan, patch 0..1 = tambalan
  function tembok(ctx, x, y, w, h, crack, patch, l) {
    const bw = 140, bh = 64;
    ctx.save(); rr(ctx, x, y, w, h, 20); ctx.clip(); ctx.fillStyle = "#3B2A5C"; ctx.fillRect(x, y, w, h);
    for (let r = 0; r * bh < h; r++) for (let c = -1; c * bw < w; c++) {
      const bx = x + c * bw + (r % 2 ? bw / 2 : 0); card(ctx, bx + 4, y + r * bh + 4, bw - 8, bh - 8, { fill: r % 3 === 1 && c % 2 ? "#5A4590" : "#4D3B80", r: 8 });
    }
    ctx.restore();
    const cx = x + w * 0.55, cy = y + h * 0.5;
    if (crack > 0) {
      ctx.save(); ctx.globalAlpha = clamp(crack, 0, 1);
      ctx.fillStyle = "#05071A"; ctx.beginPath(); ctx.moveTo(cx - 70, cy - 60); ctx.lineTo(cx - 10, cy - 20); ctx.lineTo(cx + 40, cy - 70); ctx.lineTo(cx + 70, cy + 10);
      ctx.lineTo(cx + 20, cy + 70); ctx.lineTo(cx - 30, cy + 30); ctx.lineTo(cx - 80, cy + 50); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `rgba(255,90,95,${0.5 + 0.5 * Math.sin(l * 6)})`; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
    }
    if (patch > 0) {
      const py = cy - (1 - ease(patch)) * 220;
      ctx.save(); ctx.translate(cx, py); ctx.rotate(-0.08 * (1 - patch));
      card(ctx, -120, -100, 240, 200, { fill: C.tosca, r: 26, glow: "rgba(34,227,196,0.5)" });
      ctx.fillStyle = "rgba(11,14,42,0.25)"; for (const [dx, dy] of [[-80, -60], [80, -60], [-80, 60], [80, 60]]) { ctx.beginPath(); ctx.arc(dx, dy, 9, 0, Math.PI * 2); ctx.fill(); }
      text(ctx, "v2.1", 0, 22, 66, { align: "center", weight: 900, color: C.bg }); ctx.restore();
    }
    return { cx, cy };
  }
  function perisai(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.lineTo(s * 0.42, -s * 0.34); ctx.lineTo(s * 0.38, s * 0.1); ctx.quadraticCurveTo(s * 0.3, s * 0.38, 0, s * 0.52);
    ctx.quadraticCurveTo(-s * 0.3, s * 0.38, -s * 0.38, s * 0.1); ctx.lineTo(-s * 0.42, -s * 0.34); ctx.closePath(); ctx.fill(); ctx.restore();
    check(ctx, x, y, s * 0.5, C.bg);
  }

  Object.assign(T.SCENES, {
    // kait: notifikasi update; jari menekan "Nanti saja" berulang kali
    t39_notif(ctx, b, l, t, TL, A) {
      const h = Math.min(640, A.h - 10), w = h * 0.55, x = 110, y = A.y + (A.h - h) / 2, s = phone(ctx, x, y, w, h);
      const n = Math.floor(clamp(l - 0.3, 0, 2.9) / 0.95), ph2 = (clamp(l - 0.3, 0, 99) % 0.95) / 0.95;
      const show = !(ph2 > 0.75 && ph2 < 0.95) || l > 3.2;
      if (show) {
        const cy = s.y + 30; card(ctx, s.x + 12, cy, s.w - 24, 230, { fill: "#F2F4FF", r: 22 });
        card(ctx, s.x + 30, cy + 22, 64, 64, { fill: C.biru, r: 16 });
        text(ctx, "Update tersedia", s.x + 108, cy + 52, 28, { weight: 900, color: C.bg, fit: s.w - 130 });
        text(ctx, "Aplikasi Chat v2.1", s.x + 108, cy + 86, 22, { weight: 700, color: "#59618F", fit: s.w - 130 });
        const bw = (s.w - 60) / 2;
        card(ctx, s.x + 24, cy + 140, bw, 64, { fill: "#DDE2FF", r: 32 }); text(ctx, "Nanti saja", s.x + 24 + bw / 2, cy + 181, 22, { align: "center", weight: 900, color: C.bg, fit: bw - 10 });
        card(ctx, s.x + 36 + bw, cy + 140, bw, 64, { fill: C.biru, r: 32 }); text(ctx, "Update", s.x + 36 + bw * 1.5, cy + 181, 24, { align: "center", weight: 900, color: C.ink });
        // jari mengetuk "Nanti saja"
        if (l < 3.2) { const k = ease(ph2 / 0.6), fx = lerp(s.x + s.w + 40, s.x + 24 + bw / 2, k), fy = lerp(cy + 320, cy + 172, k);
          ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(fx, fy, 26, 0, Math.PI * 2); ctx.fill(); }
      }
      if (l > 0.9) { ctx.save(); ctx.translate(x + w + 150, y + 120); const u = back(clamp((l - 0.9) / 0.4, 0, 1)); ctx.scale(u, u);
        text(ctx, "Nanti saja ×" + Math.min(3, n + 1), 0, 0, 44, { align: "center", weight: 900, color: C.kuning, fit: 400 }); ctx.restore(); }
      const uc = pop(b, l, "celah keamanan");
      if (uc > 0) { ctx.save(); ctx.translate(x + w + 160, y + h * 0.6); ctx.scale(uc, uc);
        kumbang(ctx, 0, 0, 170, Math.sin(l * 5) * 0.2); ctx.restore();
        text(ctx, "celah keamanan", x + w + 160, y + h * 0.6 + 140, 36, { align: "center", weight: 900, color: C.bad }); }
    },
    // bug membuka celah di tembok aplikasi
    t39_celah(ctx, b, l, t, TL, A) {
      const w = 820, h = Math.min(620, A.h - 220), x = 70, y = A.y + 130;
      const hu = pop(b, l, 0);
      if (hu > 0) { ctx.save(); ctx.translate(480, A.y + 55); ctx.scale(hu, hu); pill(ctx, "Aplikasi = kode buatan manusia", 0, 0, 40, { fill: C.kuning }); ctx.restore(); }
      const cr = ph(b, l, "celah", 0.5), p = tembok(ctx, x, y, w, h, cr, 0, l);
      const ub = cue(b, l, "bug");
      if (ub > 0) { const k = ease(ub / 1.0); kumbang(ctx, lerp(x + 60, p.cx, k), lerp(y + h - 60, p.cy + 10, k) + Math.sin(l * 12) * 4, 110, lerp(-0.8, 0.3, k)); }
      const uc = pop(b, l, "celah keamanan");
      if (uc > 0) { ctx.save(); ctx.translate(480, y + h + 80); ctx.scale(uc, uc); pill(ctx, "CELAH KEAMANAN", 0, 0, 52, { fill: C.bad, color: C.ink }); ctx.restore(); }
    },
    // celah ditambal, tambalan dikirim lewat update
    t39_tambal(ctx, b, l, t, TL, A) {
      const w = 820, h = Math.min(520, A.h - 400), x = 70, y = A.y + 20;
      const pt = clamp(cue(b, l, "menambalnya") / 0.6, 0, 1);
      tembok(ctx, x, y, w, h, 1 - pt * 0.999, pt, l);
      const uu = pop(b, l, "update");
      const py = y + h + 60;
      if (uu > 0) {
        ctx.save(); ctx.globalAlpha = clamp(uu, 0, 1);
        // awan -> panah -> HP
        ctx.fillStyle = C.panel2; ctx.beginPath(); ctx.arc(230, py + 90, 60, 0, Math.PI * 2); ctx.arc(300, py + 70, 75, 0, Math.PI * 2); ctx.arc(370, py + 95, 55, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(230, py + 95, 140, 55);
        text(ctx, "v2.1", 300, py + 125, 44, { align: "center", weight: 900, color: C.tosca });
        const k = (l * 1.2) % 1; ctx.fillStyle = C.tosca; ctx.beginPath(); ctx.arc(lerp(400, 560, k), py + 110, 14, 0, Math.PI * 2); ctx.fill();
        arrow(ctx, 410, py + 110, 590, py + 110, C.tosca, 8, 28);
        const s = phone(ctx, 620, py - 10, 180, Math.min(330, A.bot - py + 10));
        const pr = clamp(cue(b, l, "update") / 1.2, 0, 1);
        text(ctx, pr < 1 ? Math.round(pr * 100) + "%" : "Selesai", s.x + s.w / 2, s.y + s.h / 2, 34, { align: "center", weight: 900, color: pr < 1 ? C.ink : C.good });
        card(ctx, s.x + 15, s.y + s.h / 2 + 30, s.w - 30, 16, { fill: C.panel, r: 8 }); card(ctx, s.x + 15, s.y + s.h / 2 + 30, Math.max(16, (s.w - 30) * pr), 16, { fill: C.tosca, r: 8 });
        ctx.restore();
      }
    },
    // celah diketahui banyak orang; HP lama jadi sasaran, HP baru aman
    t39_sasaran(ctx, b, l, t, TL, A) {
      const h = Math.min(560, A.h - 300), w = 300, y = A.y + 170;
      const sl = phone(ctx, 90, y, w, h, C.bad), sr = phone(ctx, 570, y, w, h, C.good);
      text(ctx, "v2.0", sl.x + sl.w / 2, sl.y + 90, 60, { align: "center", weight: 900, color: C.bad });
      text(ctx, "belum update", sl.x + sl.w / 2, sl.y + 140, 28, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "v2.1", sr.x + sr.w / 2, sr.y + 90, 60, { align: "center", weight: 900, color: C.good });
      text(ctx, "sudah update", sr.x + sr.w / 2, sr.y + 140, 28, { align: "center", weight: 700, color: C.ink2 });
      kumbang(ctx, sl.x + sl.w / 2, sl.y + sl.h * 0.62, 120, Math.sin(l * 4) * 0.2);
      perisai(ctx, sr.x + sr.w / 2, sr.y + sr.h * 0.62, 150, C.good);
      // banyak orang tahu: tanda seru bermunculan di atas
      const uk = cue(b, l, "diketahui");
      for (let i = 0; i < 7; i++) { const u = uk > i * 0.12 ? back(clamp((uk - i * 0.12) / 0.4, 0, 1)) : 0; if (u <= 0) continue;
        const px = 110 + i * 115, py = A.y + 60 + (i % 2) * 40;
        ctx.save(); ctx.translate(px, py); ctx.scale(u, u); ctx.fillStyle = [C.pink, C.kuning, C.biru][i % 3]; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
        text(ctx, "!", 0, 17, 46, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      const us = ph(b, l, "sasaran", 0.4);
      if (us > 0) { const cx = sl.x + sl.w / 2, cy = sl.y + sl.h * 0.62, r = lerp(260, 110, us);
        ctx.save(); ctx.strokeStyle = C.bad; ctx.lineWidth = 7; ctx.globalAlpha = us;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r - 20, cy); ctx.lineTo(cx - r * 0.3, cy); ctx.moveTo(cx + r * 0.3, cy); ctx.lineTo(cx + r + 20, cy);
        ctx.moveTo(cx, cy - r - 20); ctx.lineTo(cx, cy - r * 0.3); ctx.moveTo(cx, cy + r * 0.3); ctx.lineTo(cx, cy + r + 20); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.translate(sl.x + sl.w / 2, y + h + 70); ctx.scale(us, us); pill(ctx, "SASARAN", 0, 0, 46, { fill: C.bad, color: C.ink }); ctx.restore(); }
      const ua = pop(b, l, "hp yang");
      if (ua > 0) { ctx.save(); ctx.translate(sr.x + sr.w / 2, y + h + 70); ctx.scale(ua, ua); pill(ctx, "AMAN", 0, 0, 46, { fill: C.good }); ctx.restore(); }
    }
  });
})();
