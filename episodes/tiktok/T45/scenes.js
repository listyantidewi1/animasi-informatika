/* T45 Bagaimana komputer menyimpan emoji — adegan khusus. Emoji digambar sendiri (bukan gambar emoji vendor).
   Nomor Unicode: wajah tertawa berlinang air mata U+1F602 = 128.514 (UTF-8: F0 9F 98 82), wajah senyum U+1F600 = 128.512,
   jempol U+1F44D = 128.077, warna kulit sedang U+1F3FD = 127.997, hati U+2764 = 10.084. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;

  // wajah emoji; gaya 0 (bulat kuning mengilap) atau 1 (datar oranye, mata lain); jenis: "tawa" | "senyum"
  function wajah(ctx, x, y, s, jenis, gaya) {
    ctx.save(); ctx.translate(x, y);
    if (gaya === 1) { ctx.fillStyle = "#FFB02E"; ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.fill(); }
    else { const g = ctx.createRadialGradient(-s * 0.15, -s * 0.2, s * 0.05, 0, 0, s * 0.5); g.addColorStop(0, "#FFF27A"); g.addColorStop(1, "#F5B800");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = "#5A3200"; ctx.fillStyle = "#5A3200"; ctx.lineWidth = s * 0.05; ctx.lineCap = "round";
    if (jenis === "tawa") {
      for (const k of [-1, 1]) { ctx.beginPath();
        if (gaya === 1) { ctx.moveTo(k * s * 0.26, -s * 0.16); ctx.lineTo(k * s * 0.12, -s * 0.1); ctx.lineTo(k * s * 0.26, -s * 0.04); }
        else ctx.arc(k * s * 0.17, -s * 0.08, s * 0.09, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(-s * 0.27, s * 0.06); ctx.quadraticCurveTo(0, s * (gaya === 1 ? 0.36 : 0.44), s * 0.27, s * 0.06); ctx.closePath(); ctx.fill();
      ctx.fillStyle = gaya === 1 ? "#FF6B6B" : "#E04848"; ctx.beginPath(); ctx.ellipse(0, s * 0.24, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = gaya === 1 ? "#4FC3F7" : "#5AB8FF";
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * s * 0.38, s * 0.02, s * 0.08, s * 0.14, k * 0.4, 0, Math.PI * 2); ctx.fill(); }
    } else {
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * s * 0.15, -s * 0.1, s * 0.05, s * 0.09, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, s * 0.02, s * 0.25, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    }
    ctx.restore();
  }
  function hati(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#F0384A"; ctx.beginPath(); ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s * 0.6, -s * 0.05, -s * 0.3, -s * 0.5, 0, -s * 0.18); ctx.bezierCurveTo(s * 0.3, -s * 0.5, s * 0.6, -s * 0.05, 0, s * 0.35); ctx.fill(); ctx.restore();
  }
  function jempol(ctx, x, y, s, warna) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = warna || "#FFC83D";
    rr(ctx, -s * 0.38, -s * 0.05, s * 0.2, s * 0.45, s * 0.05); ctx.fill();
    rr(ctx, -s * 0.14, -s * 0.06, s * 0.5, s * 0.46, s * 0.12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.12, 0); ctx.quadraticCurveTo(-s * 0.06, -s * 0.48, s * 0.08, -s * 0.44); ctx.quadraticCurveTo(s * 0.16, -s * 0.3, s * 0.06, -s * 0.04); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = s * 0.025;
    for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(s * 0.12, -s * 0.06 + i * s * 0.115); ctx.lineTo(s * 0.36, -s * 0.06 + i * s * 0.115); ctx.stroke(); }
    ctx.restore();
  }
  function hp(ctx, x, y, w, h, label) {
    card(ctx, x, y, w, h, { fill: "#05071A", stroke: C.line, lw: 6, r: w * 0.14 });
    card(ctx, x + w * 0.06, y + w * 0.14, w * 0.88, h - w * 0.24, { fill: C.bg2, r: w * 0.08 });
    if (label) text(ctx, label, x + w / 2, y + h + 50, 36, { align: "center", weight: 800, color: C.ink2 });
  }
  const BYTES = ["11110000", "10011111", "10011000", "10000010"], HEX = ["F0", "9F", "98", "82"];

  Object.assign(T.SCENES, {
    // kait: emoji tertawa berubah menjadi angka
    t45_angka(ctx, b, l, t, TL, A) {
      const s = Math.min(300, A.h * 0.62), cy = A.y + A.h * 0.48, k = ease((l - 1.0) / 0.6);
      ctx.save(); ctx.translate(lerp(480, 230, k), cy); ctx.scale(1 - 0.35 * k, 1 - 0.35 * k); ctx.rotate(Math.sin(l * 6) * 0.06 * (1 - k)); wajah(ctx, 0, 0, s, "tawa", 0); ctx.restore();
      if (k > 0) { ctx.save(); ctx.globalAlpha = k; text(ctx, "=", 400, cy + 30, 110, { align: "center", weight: 900, color: C.ink });
        text(ctx, "128.514", 660, cy + 36, 120, { align: "center", weight: 900, color: C.kuning, fit: 420, shadow: true }); ctx.restore(); }
    },
    // daftar Unicode: setiap emoji punya nomor; semua HP memakai daftar yang sama
    t45_daftar(ctx, b, l, t, TL, A) {
      const rows = [["senyum", "128.512"], ["tawa", "128.514"], ["jempol", "128.077"], ["hati", "10.084"]];
      const hu = pop(b, l, "unicode");
      card(ctx, 70, A.y + 20, 820, 110, { fill: C.panel2, r: 26 });
      text(ctx, "Daftar Unicode", 110, A.y + 92, 50, { weight: 900, color: hu > 0 ? C.kuning : C.ink });
      text(ctx, "nomor", 850, A.y + 92, 36, { align: "right", weight: 800, color: C.ink2 });
      const rh = Math.min(140, (A.h - 420) / 4);
      rows.forEach(([j, n], i) => {
        const u = pop(b, l, 0.04 + i * 0.07); if (u <= 0) return;
        const y = A.y + 150 + i * (rh + 10), hi = j === "tawa";
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - clamp(u, 0, 1)) * -60, 0);
        card(ctx, 70, y, 820, rh, { fill: hi ? "#3A3270" : C.panel, stroke: hi ? C.kuning : null, lw: 5, r: 22 });
        const ex = 160, ey = y + rh / 2, es = rh * 0.72;
        if (j === "hati") hati(ctx, ex, ey + 5, es); else if (j === "jempol") jempol(ctx, ex, ey + 6, es); else wajah(ctx, ex, ey, es, j, 0);
        text(ctx, n, 850, ey + 26, 72, { align: "right", weight: 900, color: hi ? C.kuning : C.ink }); ctx.restore();
      });
      const us = pop(b, l, "semua hp");
      if (us > 0) { const y = A.y + 160 + 4 * (rh + 10);
        for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(250 + i * 230, y + 90); ctx.scale(us, us); hp(ctx, -55, -85, 110, 170); wajah(ctx, 0, 0, 60, "tawa", 0);
          text(ctx, "128.514", 0, 60, 22, { align: "center", weight: 900, color: C.kuning }); ctx.restore(); }
        text(ctx, "daftar yang sama", 480, y + 230, 38, { align: "center", weight: 900, color: C.tosca }); }
    },
    // yang dikirim hanya nomornya, disimpan dalam empat byte
    t45_kirim(ctx, b, l, t, TL, A) {
      hp(ctx, 80, A.y + 20, 200, 320, "pengirim"); hp(ctx, 680, A.y + 20, 200, 320, "penerima");
      wajah(ctx, 180, A.y + 180, 110, "tawa", 0);
      const k = clamp(cue(b, l, "dikirim") / 1.6, 0, 1);
      if (k > 0 && k < 1) { const x = lerp(300, 660, k); ctx.save(); ctx.translate(x, A.y + 170 + Math.sin(k * Math.PI) * -60); card(ctx, -100, -38, 200, 76, { fill: C.kuning, r: 38 });
        text(ctx, "128.514", 0, 14, 40, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      if (k >= 1) text(ctx, "128.514", 780, A.y + 195, 36, { align: "center", weight: 900, color: C.kuning });
      const ub = cue(b, l, "empat byte"), y = A.y + 470;
      if (ub > -0.6) {
        text(ctx, "disimpan sebagai 4 byte", 480, y - 20, 42, { align: "center", weight: 900, color: C.ink });
        BYTES.forEach((bits, i) => { const u = back(clamp((ub + 0.6 - i * 0.18) / 0.4, 0, 1)); if (u <= 0) return;
          const bx = 80 + (i % 2) * 420, by = y + 20 + Math.floor(i / 2) * 170;
          ctx.save(); ctx.translate(bx + 190, by + 70); ctx.scale(u, u);
          card(ctx, -190, -70, 380, 140, { fill: C.panel, stroke: [C.kuning, C.pink, C.tosca, C.biru][i], lw: 5, r: 22 });
          text(ctx, "byte " + (i + 1) + " · " + HEX[i], 0, -22, 30, { align: "center", weight: 800, color: C.ink2 });
          text(ctx, bits, 0, 40, 52, { align: "center", weight: 900, color: C.ink }); ctx.restore(); });
      }
    },
    // HP penerima menggambar nomor yang sama dengan gaya sendiri
    t45_gaya(ctx, b, l, t, TL, A) {
      const un = pop(b, l, 0);
      if (un > 0) { ctx.save(); ctx.translate(480, A.y + 60); ctx.scale(un, un); pill(ctx, "nomor 128.514", 0, 0, 46, { fill: C.kuning }); ctx.restore(); }
      const h = Math.min(520, A.h - 330), w = h * 0.6, y = A.y + 170;
      [[150, 0, "HP 1"], [810 - w, 1, "HP 2"]].forEach(([x, g, lab], i) => {
        hp(ctx, x, y, w, h, lab);
        arrow(ctx, 480 + (i ? 60 : -60), A.y + 100, x + w / 2 + (i ? -20 : 20), y + 30, C.ink2, 6, 22);
        const u = pop(b, l, i ? "gayanya" : "menggambarnya"); if (u <= 0) return;
        ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(u, u); wajah(ctx, 0, 0, w * 0.7, "tawa", g); ctx.restore();
      });
      const ud = pop(b, l, "berbeda");
      if (ud > 0) { ctx.save(); ctx.translate(480, y + h + 120); ctx.scale(ud, ud); pill(ctx, "nomor sama, gambar beda", 0, 0, 44, { fill: C.pink, color: C.ink }); ctx.restore(); }
    },
    // jempol + warna kulit = dua nomor, satu emoji
    t45_gabung(ctx, b, l, t, TL, A) {
      const y = A.y + 60, s = 190;
      const u1 = pop(b, l, 0.02), u2 = pop(b, l, "nomor warna"), u3 = pop(b, l, "gabungan");
      if (u1 > 0) { ctx.save(); ctx.translate(200, y + 130); ctx.scale(u1, u1); card(ctx, -130, -130, 260, 260, { fill: C.panel, r: 30 }); jempol(ctx, 0, 10, s); ctx.restore();
        pill(ctx, "128.077", 200, y + 320, 40, { fill: C.kuning }); text(ctx, "jempol", 200, y + 400, 36, { align: "center", weight: 800, color: C.ink2 }); }
      text(ctx, "+", 480, y + 160, 120, { align: "center", weight: 900, color: C.ink });
      if (u2 > 0) { ctx.save(); ctx.translate(760, y + 130); ctx.scale(u2, u2); card(ctx, -130, -130, 260, 260, { fill: C.panel, r: 30 });
        card(ctx, -80, -80, 160, 160, { fill: "#C68642", r: 30 }); ctx.restore();
        pill(ctx, "127.997", 760, y + 320, 40, { fill: C.kuning }); text(ctx, "warna kulit", 760, y + 400, 36, { align: "center", weight: 800, color: C.ink2 }); }
      const ur = pop(b, l, "nomor warna", 0.6);
      if (ur > 0 && cue(b, l, "nomor warna") > 0.5) { const ry = y + 480; arrow(ctx, 480, ry, 480, ry + 70, C.ink2, 8, 26);
        const u = back(clamp((cue(b, l, "nomor warna") - 0.5) / 0.45, 0, 1)); ctx.save(); ctx.translate(480, ry + 230); ctx.scale(u, u);
        card(ctx, -150, -150, 300, 300, { fill: C.panel2, stroke: C.kuning, lw: 6, r: 34, glow: "rgba(255,210,63,0.4)" }); jempol(ctx, 0, 14, 230, "#C68642"); ctx.restore(); }
      if (u3 > 0 && A.bot - (y + 880) > 40) { ctx.save(); ctx.translate(480, Math.min(A.bot - 40, y + 900)); ctx.scale(u3, u3); pill(ctx, "2 nomor = 1 emoji", 0, 0, 40, { fill: C.tosca }); ctx.restore(); }
    }
  });
})();
