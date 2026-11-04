/* T21 Berapa banyak huruf muat dalam 1 megabyte? — adegan khusus. Angka: 1 MB ≈ 1.000.000 byte; huruf biasa 1 byte; emoji umumnya 4 byte (UTF-8). */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, bip, rnd, fmt, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const BOOK = [C.pink, C.biru, C.tosca, C.kuning, "#A77BFF"];

  function bitTile(ctx, d, x, y, s, on) {
    card(ctx, x, y, s, s * 1.25, { fill: d === "1" ? C.kuning : C.panel2, r: s * 0.2, stroke: on ? C.ink : null, lw: 3 });
    text(ctx, d, x + s / 2, y + s * 0.88, s * 0.62, { align: "center", weight: 900, color: d === "1" ? C.bg : C.ink });
  }
  function book(ctx, x, y, w, h, col) {
    card(ctx, x, y, w, h, { fill: col, r: 10 });
    ctx.fillStyle = "rgba(255,255,255,0.85)"; rr(ctx, x + w - 26, y + 6, 18, h - 12, 4); ctx.fill();
    ctx.fillStyle = "rgba(11,14,42,0.25)"; ctx.fillRect(x + 30, y + 8, 8, h - 16);
  }
  function smiley(ctx, cx, cy, r) {
    ctx.save(); ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.ellipse(cx - r * 0.33, cy - r * 0.2, r * 0.11, r * 0.17, 0, 0, Math.PI * 2); ctx.ellipse(cx + r * 0.33, cy - r * 0.2, r * 0.11, r * 0.17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.bg; ctx.lineWidth = r * 0.12; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(cx, cy + r * 0.05, r * 0.5, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); ctx.restore();
  }
  function photo(ctx, x, y, w, h) {
    card(ctx, x, y, w, h, { fill: "#2B6CB0", r: 24, stroke: C.ink, lw: 8 });
    ctx.save(); rr(ctx, x + 4, y + 4, w - 8, h - 8, 20); ctx.clip();
    ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(x + w * 0.75, y + h * 0.3, h * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1E9E7E"; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w * 0.35, y + h * 0.4); ctx.lineTo(x + w * 0.6, y + h * 0.75); ctx.lineTo(x + w * 0.78, y + h * 0.55); ctx.lineTo(x + w, y + h * 0.85); ctx.lineTo(x + w, y + h); ctx.fill();
    ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: kotak 1 MB diisi hujan huruf, penghitung naik
    t21_kait(ctx, b, l, t, TL, A) {
      const w = 520, h = Math.min(330, A.h - 120), x = 480 - w / 2, y = A.y + 70;
      // huruf berjatuhan ke dalam kotak
      for (let i = 0; i < 26; i++) {
        const ph0 = (l * 0.9 + rnd(i) * 1.0) % 1, lx = x + 40 + rnd(i + 50) * (w - 80);
        ctx.save(); ctx.globalAlpha = 1 - ph0 * 0.7; text(ctx, "abcdefghijklmnopqrstuvwxyz"[i], lx, lerp(A.y - 10, y + h - 30, ph0), 44, { align: "center", weight: 900, color: [C.ink, C.kuning, C.tosca, C.pink][i % 4] }); ctx.restore();
      }
      const k = ease(l / 3.2);
      card(ctx, x, y, w, h, { fill: "rgba(37,46,110,0.55)", stroke: C.kuning, lw: 6, r: 30 });
      ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, 26); ctx.clip(); ctx.fillStyle = "rgba(255,210,63,0.25)"; ctx.fillRect(x, y + h * (1 - k), w, h * k); ctx.restore();
      text(ctx, "1 MB", 480, y + h / 2 + 30, 110, { align: "center", weight: 900, color: C.kuning, shadow: true });
      text(ctx, fmt(1e6 * k) + " huruf", 480, y + h + 80, 60, { align: "center", weight: 900, color: C.ink });
    },

    // satu huruf = satu byte = delapan digit 0 dan 1
    t21_byte(ctx, b, l, t, TL, A) {
      const y = A.y + 40, bits = "01000001", s = 74, gx = 480 - (8 * s + 7 * 12) / 2;
      const ua = pop(b, l, 0);
      ctx.save(); ctx.translate(480, y + 110); ctx.scale(ua, ua); card(ctx, -110, -110, 220, 220, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "A", 0, 62, 170, { align: "center", weight: 900, color: C.ink }); ctx.restore();
      const ud = ph(b, l, "satu byte", 0.4); if (ud > 0) arrow(ctx, 480, y + 240, 480, y + 240 + 70 * ud, C.ink2, 10, 30);
      const by = y + 340;
      for (let i = 0; i < 8; i++) { const u = back(clamp((cue(b, l, "satu byte") - i * 0.07) / 0.3, 0, 1)); if (u <= 0) continue;
        ctx.save(); ctx.translate(gx + i * (s + 12) + s / 2, by + s * 0.62); ctx.scale(u, u); bitTile(ctx, bits[i], -s / 2, -s * 0.62, s, cue(b, l, "delapan digit") > 0); ctx.restore(); }
      const ub = ph(b, l, "satu byte", 0.5);
      if (ub > 0) { ctx.save(); ctx.globalAlpha = ub; ctx.strokeStyle = C.tosca; ctx.lineWidth = 6; const yy = by + s * 1.25 + 24;
        ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx, yy + 20); ctx.lineTo(gx + 8 * s + 84, yy + 20); ctx.lineTo(gx + 8 * s + 84, yy); ctx.stroke();
        pill(ctx, "1 huruf = 1 byte", 480, yy + 80, 46, { fill: C.tosca }); ctx.restore(); }
      const u8 = pop(b, l, "delapan digit");
      if (u8 > 0) { ctx.save(); ctx.translate(480, by + s * 1.25 + 210); ctx.scale(u8, u8); text(ctx, "8 digit 0 dan 1", 0, 0, 52, { align: "center", weight: 900, color: C.kuning }); ctx.restore(); }
      const bb = by + s * 1.25 + 250; if (A.bot - bb > 150) bip(ctx, 480, (bb + A.bot) / 2, Math.min(200, A.bot - bb - 20), { mood: "happy", t });
    },

    // 1.000.000 huruf ÷ 2.000 huruf per halaman = 500 halaman
    t21_buku(ctx, b, l, t, TL, A) {
      const y = A.y + 20, up = pop(b, l, 0);
      // satu halaman
      ctx.save(); ctx.translate(230, y + 170); ctx.scale(up, up); card(ctx, -120, -160, 240, 320, { fill: "#F4F6FF", r: 16 });
      ctx.fillStyle = "#9AA3D6"; for (let i = 0; i < 11; i++) { rr(ctx, -90, -120 + i * 24, i === 10 ? 110 : 180, 9, 4); ctx.fill(); } ctx.restore();
      const uh = ph(b, l, "dua ribu", 0.4);
      if (uh > 0) { ctx.save(); ctx.globalAlpha = uh; text(ctx, "1 halaman", 400, y + 140, 50, { weight: 800, color: C.ink2 }); text(ctx, "≈ 2.000 huruf", 400, y + 215, 64, { weight: 900, color: C.ink }); ctx.restore(); }
      // tumpukan buku yang tumbuh
      const k = clamp(cue(b, l, "itu sama") / 1.6, 0, 1), n = Math.round(10 * ease(k)), base = y + 720;
      for (let i = 0; i < n; i++) book(ctx, 480 - 170 + (rnd(i) - 0.5) * 30, base - (i + 1) * 36, 340, 32, BOOK[i % 5]);
      if (k > 0) {
        text(ctx, fmt(500 * ease(k)), 760, base - 160, 110, { align: "center", weight: 900, color: C.kuning, shadow: true });
        text(ctx, "halaman", 760, base - 100, 44, { align: "center", weight: 800, color: C.ink });
      }
      const ue = pop(b, l, "lima ratus");
      if (ue > 0 && base + 90 < A.bot) { ctx.save(); ctx.translate(480, base + 70); ctx.scale(ue, ue); pill(ctx, "1.000.000 ÷ 2.000 = 500", 0, 0, 44, { fill: C.panel2, color: C.ink }); ctx.restore(); }
      const bb = base + 130; if (A.bot - bb > 140) bip(ctx, 480, (bb + A.bot) / 2, Math.min(190, A.bot - bb - 10), { mood: ue > 0 ? "wow" : "think", t });
    },

    // huruf 1 byte, emoji 4 byte
    t21_emoji(ctx, b, l, t, TL, A) {
      const s = 110, rows = [A.y + 60, A.y + 360];
      const box = (x, y, u) => { ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.scale(u, u); card(ctx, -s / 2, -s / 2, s, s, { fill: C.panel2, stroke: C.tosca, lw: 5, r: 18 });
        text(ctx, "byte", 0, 12, 30, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); };
      // baris huruf
      card(ctx, 70, rows[0] - 30, 200, 200, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "A", 170, rows[0] + 125, 140, { align: "center", weight: 900, color: C.ink });
      text(ctx, "=", 320, rows[0] + 100, 80, { align: "center", weight: 900, color: C.ink2 });
      box(380, rows[0] + 15, 1); text(ctx, "1 byte", 620, rows[0] + 92, 56, { weight: 900, color: C.tosca });
      // baris emoji (digambar sendiri)
      const ue = pop(b, l, "emoji");
      if (ue > 0) {
        ctx.save(); ctx.globalAlpha = clamp(ue, 0, 1);
        card(ctx, 70, rows[1] - 30, 200, 200, { fill: C.panel, stroke: C.kuning, lw: 4 }); smiley(ctx, 170, rows[1] + 70, 72 * ue);
        text(ctx, "=", 320, rows[1] + 100, 80, { align: "center", weight: 900, color: C.ink2 }); ctx.restore();
        for (let i = 0; i < 4; i++) { const u = back(clamp((cue(b, l, "empat byte") - i * 0.15) / 0.3, 0, 1)); if (u > 0) box(380 + (i % 2) * (s + 14), rows[1] - 30 + Math.floor(i / 2) * (s + 14) - 0, u); }
        if (cue(b, l, "empat byte") > 0.6) text(ctx, "4 byte", 660, rows[1] + 92, 56, { weight: 900, color: C.kuning });
      }
      const uk = pop(b, l, "empat kali"), py = rows[1] + 330;
      if (uk > 0 && py + 60 < A.bot) { ctx.save(); ctx.translate(480, py); ctx.rotate(-0.04); ctx.scale(uk, uk); pill(ctx, "4 kali lebih berat!", 0, 0, 56, { fill: C.pink, color: C.ink }); ctx.restore(); }
      const bb = py + 70; if (A.bot - bb > 140) bip(ctx, 480, (bb + A.bot) / 2, Math.min(190, A.bot - bb - 10), { mood: uk > 0 ? "wow" : "happy", t });
    },

    // satu foto HP ≈ 3 MB ≈ 3 juta huruf ≈ 1.500 halaman
    t21_foto(ctx, b, l, t, TL, A) {
      const y = A.y + 20, up = pop(b, l, 0);
      ctx.save(); ctx.translate(300, y + 160); ctx.scale(up, up); photo(ctx, -200, -150, 400, 300); ctx.restore();
      const um = pop(b, l, "tiga megabyte");
      if (um > 0) { ctx.save(); ctx.translate(720, y + 160); ctx.scale(um, um); text(ctx, "3 MB", 0, 30, 110, { align: "center", weight: 900, color: C.kuning, shadow: true }); ctx.restore(); }
      const uj = ph(b, l, "setara", 0.4);
      if (uj > 0) {
        ctx.save(); ctx.globalAlpha = uj; text(ctx, "≈", 480, y + 420, 100, { align: "center", weight: 900, color: C.ink2 }); ctx.restore();
        const k = clamp(cue(b, l, "setara") / 1.2, 0, 1);
        text(ctx, fmt(3e6 * ease(k)), 480, y + 560, 120, { align: "center", weight: 900, color: C.ink, shadow: true, fit: 800 });
        text(ctx, "huruf", 480, y + 625, 50, { align: "center", weight: 800, color: C.ink2 });
      }
      const ub = pop(b, l, "juta huruf", 0.5), by = y + 700;
      if (ub > 0 && by + 140 < A.bot) {
        for (let i = 0; i < 3; i++) { const u = clamp(ub * 2 - i * 0.3, 0, 1); if (u <= 0) continue; ctx.save(); ctx.globalAlpha = u;
          for (let j = 0; j < 4; j++) book(ctx, 90 + i * 130, by + 110 - j * 30, 115, 26, BOOK[(i + j) % 5]); ctx.restore(); }
        text(ctx, "≈ 1.500 halaman", 690, by + 100, 46, { align: "center", weight: 900, color: C.kuning });
      }
    }
  });
})();
