/* T31 CAPTCHA: membuktikan kamu bukan robot — adegan khusus. Kotak tes digambar sebagai tampilan generik (tanpa merek); semua gambar rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, cross, bip, rnd, fmt, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;

  // gambar petak: 0 = lampu lalu lintas, 1 = pohon, 2 = mobil, 3 = rumah
  function tileArt(ctx, kind, x, y, s) {
    ctx.save(); rr(ctx, x, y, s, s, 10); ctx.clip(); ctx.fillStyle = "#8FC3FF"; ctx.fillRect(x, y, s, s); ctx.fillStyle = "#7A8099"; ctx.fillRect(x, y + s * 0.78, s, s * 0.22);
    const cx = x + s / 2;
    if (kind === 0) { ctx.fillStyle = "#3A3F55"; ctx.fillRect(cx - 4, y + s * 0.45, 8, s * 0.35); rr(ctx, cx - s * 0.13, y + s * 0.1, s * 0.26, s * 0.42, 8); ctx.fill();
      ["#FF5A5F", "#FFD23F", "#22E3C4"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, y + s * (0.18 + i * 0.13), s * 0.05, 0, Math.PI * 2); ctx.fill(); }); }
    else if (kind === 1) { ctx.fillStyle = "#7A4E2D"; ctx.fillRect(cx - 6, y + s * 0.5, 12, s * 0.3); ctx.fillStyle = "#1E9E7E"; ctx.beginPath(); ctx.arc(cx, y + s * 0.42, s * 0.22, 0, Math.PI * 2); ctx.fill(); }
    else if (kind === 2) { ctx.fillStyle = C.pink; rr(ctx, cx - s * 0.32, y + s * 0.52, s * 0.64, s * 0.2, 8); ctx.fill(); rr(ctx, cx - s * 0.18, y + s * 0.4, s * 0.36, s * 0.16, 8); ctx.fill();
      ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(cx - s * 0.18, y + s * 0.74, s * 0.06, 0, Math.PI * 2); ctx.arc(cx + s * 0.18, y + s * 0.74, s * 0.06, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.fillStyle = C.kuning; ctx.fillRect(cx - s * 0.22, y + s * 0.45, s * 0.44, s * 0.33); ctx.fillStyle = "#C0392B"; ctx.beginPath(); ctx.moveTo(cx - s * 0.3, y + s * 0.47); ctx.lineTo(cx, y + s * 0.22); ctx.lineTo(cx + s * 0.3, y + s * 0.47); ctx.fill(); }
    ctx.restore();
  }
  function robot(ctx, cx, cy, s, col) {
    ctx.save(); ctx.strokeStyle = C.ink2; ctx.lineWidth = s * 0.04; ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.42); ctx.lineTo(cx, cy - s * 0.55); ctx.stroke();
    ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(cx, cy - s * 0.58, s * 0.05, 0, Math.PI * 2); ctx.fill();
    card(ctx, cx - s * 0.32, cy - s * 0.42, s * 0.64, s * 0.42, { fill: col || "#9AA3C7", r: s * 0.08 });
    ctx.fillStyle = C.bg; rr(ctx, cx - s * 0.22, cy - s * 0.3, s * 0.44, s * 0.16, s * 0.06); ctx.fill();
    ctx.fillStyle = C.bad; ctx.fillRect(cx - s * 0.16, cy - s * 0.25, s * 0.09, s * 0.06); ctx.fillRect(cx + s * 0.07, cy - s * 0.25, s * 0.09, s * 0.06);
    card(ctx, cx - s * 0.26, cy + s * 0.04, s * 0.52, s * 0.4, { fill: col || "#9AA3C7", r: s * 0.06 });
    ctx.restore();
  }
  function human(ctx, cx, cy, s, col) {
    ctx.save(); ctx.fillStyle = col || C.tosca; ctx.beginPath(); ctx.arc(cx, cy - s * 0.25, s * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.3, s * 0.32, s * 0.28, 0, Math.PI, 0); ctx.fill(); ctx.restore();
  }
  function cursorIcon(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = C.bg; ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, s); ctx.lineTo(s * 0.28, s * 0.74); ctx.lineTo(s * 0.48, s * 1.1); ctx.lineTo(s * 0.62, s * 1.02); ctx.lineTo(s * 0.42, s * 0.68); ctx.lineTo(s * 0.75, s * 0.68); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: kotak tes 3x3, petak lampu lalu lintas dipilih
    t31_kait(ctx, b, l, t, TL, A) {
      const kinds = [0, 1, 2, 3, 0, 1, 1, 2, 0], pick = [0, 4, 8], s = Math.min(150, (A.h - 150) / 3 - 10), gw = 3 * s + 20, x0 = 480 - gw / 2, y0 = A.y + 100;
      card(ctx, x0 - 24, A.y, gw + 48, gw + 130, { fill: "#F4F6FF", r: 22 });
      card(ctx, x0 - 24, A.y, gw + 48, 86, { fill: C.biru, r: 22 }); ctx.fillStyle = C.biru; ctx.fillRect(x0 - 24, A.y + 50, gw + 48, 36);
      text(ctx, "Pilih semua lampu lalu lintas", 480, A.y + 56, 34, { align: "center", weight: 900, color: C.ink, fit: gw + 20 });
      kinds.forEach((k, i) => {
        const x = x0 + (i % 3) * (s + 10), y = y0 + Math.floor(i / 3) * (s + 10), pi = pick.indexOf(i), on = pi >= 0 && l > 0.5 + pi * 0.45;
        const sh = on ? 0.86 : 1; ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.scale(sh, sh); tileArt(ctx, k, -s / 2, -s / 2, s); ctx.restore();
        if (on) { ctx.fillStyle = C.biru; ctx.beginPath(); ctx.arc(x + 22, y + 22, 20, 0, Math.PI * 2); ctx.fill(); check(ctx, x + 22, y + 22, 26, "#FFFFFF"); }
      });
      const ub = pop(b, l, "bukan robot");
      if (ub > 0) { ctx.save(); ctx.translate(480, y0 + 3 * (s + 10) + 10); ctx.scale(ub, ub); pill(ctx, "Saya bukan robot ✓", 0, 0, 36, { fill: C.tosca }); ctx.restore(); }
    },

    // manusia lolos, bot tertahan
    t31_beda(ctx, b, l, t, TL, A) {
      const y = A.y + 30;
      const ug = pop(b, l, "CAPTCHA");
      if (ug > 0) { ctx.save(); ctx.translate(480, y + 360); ctx.scale(ug, ug); card(ctx, -60, -260, 120, 520, { fill: C.panel2, stroke: C.kuning, lw: 6, r: 20 });
        ctx.save(); ctx.translate(0, 0); ctx.rotate(-Math.PI / 2); text(ctx, "CAPTCHA", 0, 16, 56, { align: "center", weight: 900, color: C.kuning }); ctx.restore(); ctx.restore(); }
      const um = ph(b, l, "manusia", 0.4), uo = ph(b, l, "bot", 0.4);
      if (um > 0) { const k = ease(clamp(cue(b, l, "manusia") / 1.6, 0, 1)), x = lerp(170, 780, k); ctx.save(); ctx.globalAlpha = um; human(ctx, x, y + 200, 170);
        text(ctx, "manusia", x, y + 330, 40, { align: "center", weight: 900, color: C.tosca }); if (k >= 1) check(ctx, x, y + 60, 60, C.good); ctx.restore(); }
      if (uo > 0) { const k = clamp(cue(b, l, "bot") / 0.8, 0, 1), x = lerp(170, 360, ease(k)) + (k >= 1 ? Math.sin(l * 30) * 4 : 0); ctx.save(); ctx.globalAlpha = uo; robot(ctx, x, y + 560, 190);
        text(ctx, "bot", x, y + 690, 40, { align: "center", weight: 900, color: C.bad }); ctx.restore();
        if (k >= 1) { ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(640, y + 540, 54, 0, Math.PI * 2); ctx.fill(); cross(ctx, 640, y + 540, 60, C.ink); } }
      const up = pop(b, l, "program otomatis"), py = y + 790;
      if (up > 0 && py + 40 < A.bot) { ctx.save(); ctx.translate(480, py); ctx.scale(up, up); pill(ctx, "bot = program yang bekerja sendiri", 0, 0, 38, { fill: C.panel2, color: C.ink }); ctx.restore(); }
    },

    // bot membuat akun palsu dan spam sangat cepat
    t31_bot(ctx, b, l, t, TL, A) {
      const y = A.y + 20; robot(ctx, 200, y + 180, 260);
      const k = clamp(cue(b, l, "ribuan") / 2.2, 0, 1), n = Math.round(5000 * k * k);
      text(ctx, fmt(n), 650, y + 140, 110, { align: "center", weight: 900, color: C.bad, shadow: true });
      text(ctx, "akun palsu", 650, y + 200, 44, { align: "center", weight: 800, color: C.ink });
      // kartu akun berjatuhan
      for (let i = 0; i < Math.min(18, Math.floor(n / 250) + (n > 0 ? 1 : 0)); i++) {
        const x = 110 + (i % 6) * 128, yy = y + 330 + Math.floor(i / 6) * 110;
        card(ctx, x, yy, 112, 92, { fill: C.panel, stroke: C.line, lw: 3, r: 14 }); human(ctx, x + 56, yy + 46, 60, C.mute);
        text(ctx, "user" + (100 + i * 37), x + 56, yy + 84, 18, { align: "center", weight: 700, color: C.ink2 });
      }
      const us = ph(b, l, "spam", 0.4), sy = y + 700;
      if (us > 0) for (let i = 0; i < 8; i++) { const f = (l * 0.8 + i / 8) % 1; const ex = lerp(240, 900, f), ey = sy + Math.sin(i * 2 + f * 6) * 30 + (i % 3) * 50;
        if (ex > 860) continue; ctx.save(); ctx.globalAlpha = us * (1 - f * 0.5); card(ctx, ex - 40, ey - 26, 80, 52, { fill: C.kuning, r: 6 });
        ctx.strokeStyle = C.bg; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ex - 36, ey - 22); ctx.lineTo(ex, ey + 4); ctx.lineTo(ex + 36, ey - 22); ctx.stroke(); ctx.restore(); }
      if (us > 0 && sy + 200 < A.bot) { ctx.save(); ctx.globalAlpha = us; pill(ctx, "spam", 160, sy + 50, 44, { fill: C.bad, color: C.ink }); ctx.restore(); }
    },

    // huruf bengkok: mudah bagi manusia, sulit bagi program
    t31_huruf(ctx, b, l, t, TL, A) {
      const y = A.y + 20, word = "k7Rm2x";
      card(ctx, 80, y, 800, 300, { fill: "#EDEFF8", r: 26 });
      ctx.save(); rr(ctx, 80, y, 800, 300, 26); ctx.clip();
      for (let i = 0; i < 9; i++) { ctx.strokeStyle = ["#9AA3D6", "#C7A6FF", "#7FD3C4"][i % 3]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(80, y + 40 + rnd(i) * 220);
        ctx.bezierCurveTo(300, y + rnd(i + 9) * 300, 600, y + rnd(i + 19) * 300, 880, y + 40 + rnd(i + 29) * 220); ctx.stroke(); }
      word.split("").forEach((ch, i) => { ctx.save(); ctx.translate(180 + i * 115, y + 175 + Math.sin(i * 1.7 + l * 0.8) * 22); ctx.rotate((rnd(i + 3) - 0.5) * 0.9 + Math.sin(l + i) * 0.05);
        ctx.transform(1, (rnd(i + 7) - 0.5) * 0.5, (rnd(i + 11) - 0.5) * 0.6, 1, 0, 0); text(ctx, ch, 0, 40, 130 + rnd(i) * 30, { align: "center", weight: 900, color: ["#2B3270", "#5B2A86", "#1F5F7A"][i % 3] }); ctx.restore(); });
      ctx.restore();
      const up = ph(b, l, "sulit dibaca program", 0.4), um = ph(b, l, "mudah dibaca manusia", 0.4), ry = y + 360;
      if (up > 0) { ctx.save(); ctx.globalAlpha = up; card(ctx, 80, ry, 800, 130, { fill: C.badBg, stroke: C.bad, lw: 4, r: 22 }); robot(ctx, 160, ry + 78, 110);
        text(ctx, "Program: \"k?R?? x\"", 250, ry + 82, 48, { weight: 900, color: C.bad, fit: 560 }); cross(ctx, 830, ry + 65, 50, C.bad); ctx.restore(); }
      if (um > 0) { ctx.save(); ctx.globalAlpha = um; card(ctx, 80, ry + 160, 800, 130, { fill: C.goodBg, stroke: C.good, lw: 4, r: 22 }); human(ctx, 160, ry + 230, 100);
        text(ctx, "Manusia: \"k7Rm2x\"", 250, ry + 242, 48, { weight: 900, color: C.good, fit: 560 }); check(ctx, 830, ry + 225, 50, C.good); ctx.restore(); }
      const by = ry + 320; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: um > 0 ? "happy" : "think", t });
    },

    // cara menggerakkan kursor: manusia berkelok, bot lurus seketika
    t31_kursor(ctx, b, l, t, TL, A) {
      const y = A.y + 20, k = clamp(cue(b, l, "menggerakkan") / 1.8, 0, 1), hk = clamp(cue(b, l, "memperhatikan") / 2.2, 0, 1);
      // kotak centang generik
      card(ctx, 160, y + 380, 640, 150, { fill: "#F4F6FF", r: 20 });
      card(ctx, 200, y + 418, 74, 74, { fill: "#FFFFFF", stroke: "#9AA3D6", lw: 5, r: 12 });
      text(ctx, "Saya bukan robot", 300, y + 472, 46, { weight: 800, color: C.bg });
      if (hk >= 1) check(ctx, 237, y + 455, 56, C.good);
      // jalur manusia (berkelok) dan bot (lurus)
      const hp = u => [lerp(820, 237, u) + Math.sin(u * 9) * 40 * (1 - u), lerp(y + 80, y + 455, u) + Math.sin(u * 5 + 1) * 50 * (1 - u)];
      if (hk > 0) { ctx.save(); ctx.strokeStyle = C.tosca; ctx.lineWidth = 6; ctx.setLineDash([10, 10]); ctx.beginPath(); for (let i = 0; i <= 40; i++) { const u = (i / 40) * hk; const [px, py] = hp(u); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore();
        const [cx, cy] = hp(hk); cursorIcon(ctx, cx, cy, 54); text(ctx, "manusia: berkelok, kecepatan berubah", 480, y + 50, 34, { align: "center", weight: 800, color: C.tosca, fit: 780 }); }
      if (k > 0) { const by = y + 640; ctx.save(); ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(840, by + 160); ctx.lineTo(lerp(840, 250, k > 0.15 ? 1 : k / 0.15), lerp(by + 160, y + 500, k > 0.15 ? 1 : k / 0.15)); ctx.stroke(); ctx.restore();
        robot(ctx, 160, by + 120, 140); text(ctx, "bot: lurus dan seketika", 560, by + 240, 36, { align: "center", weight: 800, color: C.bad, fit: 600 });
        if (k > 0.3) { ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(545, by + 30, 30, 0, Math.PI * 2); ctx.fill(); text(ctx, "!", 545, by + 44, 40, { align: "center", weight: 900, color: C.ink }); } }
    }
  });
})();
