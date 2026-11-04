/* T43 AI bisa mengarang jawaban yang terdengar meyakinkan — adegan khusus. Buku, tokoh, dan angka rekaan (sengaja tidak ada). */
(function () {
  const T = TikTok, C = T.C, { rr, text, wrap, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;

  function aiIcon(ctx, x, y, s) {
    ctx.fillStyle = C.tosca; ctx.beginPath(); ctx.arc(x, y, s / 2, 0, Math.PI * 2); ctx.fill();
    text(ctx, "AI", x, y + s * 0.17, s * 0.45, { align: "center", weight: 900, color: C.bg });
  }
  function boks(ctx, lines, x, y, w, size, fill, col, u) {   // gelembung obrolan sederhana
    if (u <= 0) return 0; const h = lines.length * size * 1.3 + 40;
    ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate(0, (1 - clamp(u, 0, 1)) * 30);
    card(ctx, x, y, w, h, { fill, r: 26 }); lines.forEach((ln, i) => text(ctx, ln, x + 28, y + 20 + size + i * size * 1.3, size, { weight: 700, color: col || C.ink, fit: w - 50 }));
    ctx.restore(); return h;
  }
  function stamp(ctx, s, x, y, u, col, size) {
    if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(-0.1); ctx.scale(u, u);
    T.helpers.font(ctx, size, 900); const w = ctx.measureText(s).width + 70;
    ctx.strokeStyle = col; ctx.lineWidth = 8; rr(ctx, -w / 2, -size * 0.85, w, size * 1.5, 18); ctx.stroke();
    text(ctx, s, 0, size * 0.32, size, { align: "center", weight: 900, color: col }); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // kait: AI menjawab sangat yakin tentang buku yang tidak ada
    t43_yakin(ctx, b, l, t, TL, A) {
      let y = A.y + 10;
      y += boks(ctx, ["Siapa penulis buku", "Sejarah Robot Nusantara?"], 360, y, 520, 34, C.biru, C.ink, back(clamp((l - 0.1) / 0.4, 0, 1))) + 20;
      const ua = back(clamp((l - 0.7) / 0.4, 0, 1));
      if (ua > 0) aiIcon(ctx, 110, y + 40, 60);
      const h = boks(ctx, ["Tentu! Buku itu ditulis oleh", "Prof. Robi Nusantoro", "pada tahun 1987."], 160, y, 580, 34, C.panel2, C.ink, ua);
      if (ua > 0.5) { ctx.save(); ctx.translate(660, y + h + 10); pill(ctx, "yakin 100%", 0, 0, 30, { fill: C.good }); ctx.restore(); }
      stamp(ctx, "DIKARANG!", 480, y + h / 2 + 10, pop(b, l, "dikarang"), C.bad, 76);
    },
    // menebak kata berikutnya yang paling mungkin
    t43_tebak(ctx, b, l, t, TL, A) {
      const ub = pop(b, l, 0.02);
      // tumpukan tulisan yang dipelajari
      for (let i = 0; i < 5; i++) { const u = clamp(ub * 1.5 - i * 0.15, 0, 1); if (u <= 0) continue;
        ctx.save(); ctx.globalAlpha = u; ctx.translate(140 + i * 160, A.y + 90 + (i % 2) * 20); ctx.rotate((i - 2) * 0.06);
        card(ctx, -60, -70, 120, 150, { fill: "#F2F4FF", r: 10 }); ctx.fillStyle = "#B8C0EE"; for (let k = 0; k < 5; k++) ctx.fillRect(-42, -45 + k * 24, k === 4 ? 50 : 84, 8); ctx.restore(); }
      const sy = A.y + 290, us = pop(b, l, "menebak");
      if (us > 0) {
        ctx.save(); ctx.globalAlpha = clamp(us, 0, 1);
        card(ctx, 70, sy, 820, 120, { fill: C.panel, stroke: C.line, lw: 4, r: 24 });
        const pick = cue(b, l, "paling mungkin") > 0.2;
        text(ctx, "Nasi goreng paling enak dimakan saat", 100, sy + 75, 38, { weight: 800, color: C.ink, fit: 560 });
        if (pick) { card(ctx, 690, sy + 25, 170, 70, { fill: C.kuning, r: 16 }); text(ctx, "malam", 775, sy + 74, 38, { align: "center", weight: 900, color: C.bg }); }
        else { ctx.fillStyle = C.kuning; if (Math.sin(l * 8) > 0) ctx.fillRect(700, sy + 30, 8, 60); }
        const opts = [["malam", 46, C.kuning], ["hujan", 31, C.pink], ["pagi", 23, C.biru]];
        text(ctx, "peluang kata berikutnya (contoh)", 860, sy + 165, 28, { align: "right", weight: 700, color: C.ink2 });
        opts.forEach(([w, p, col], i) => {
          const y = sy + 180 + i * 120, k = ease(cue(b, l, "kata berikutnya") / 0.8);
          text(ctx, w, 100, y + 52, 44, { weight: 900, color: C.ink });
          card(ctx, 260, y + 10, 500, 60, { fill: C.panel, r: 30 });
          if (k > 0) card(ctx, 260, y + 10, Math.max(60, 500 * p / 50 * k), 60, { fill: col, r: 30 });
          text(ctx, Math.round(p * k) + "%", 860, y + 54, 40, { align: "right", weight: 900, color: col });
          if (i === 0 && pick) { ctx.strokeStyle = C.kuning; ctx.lineWidth = 6; rr(ctx, 80, y - 8, 800, 96, 22); ctx.stroke(); }
        });
        ctx.restore();
      }
      if (sy + 560 < A.bot - 120) bip(ctx, 480, A.bot - 110, Math.min(190, A.bot - sy - 580), { mood: "think", t });
    },
    // terdengar benar tidak sama dengan sudah diperiksa
    t43_cek(ctx, b, l, t, TL, A) {
      const g1 = clamp(cue(b, l, "terdengar") / 0.9, 0, 1), u2 = pop(b, l, "tidak selalu");
      const gauge = (lab, y, k, col, u, sub) => {
        if (u <= 0) return; ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        card(ctx, 70, y, 820, 300, { fill: C.panel, stroke: col, lw: 5, r: 30 });
        text(ctx, lab, 110, y + 70, 46, { weight: 900, color: C.ink, fit: 740 });
        card(ctx, 110, y + 120, 740, 70, { fill: C.bg, r: 35 }); if (k > 0) card(ctx, 110, y + 120, Math.max(70, 740 * k), 70, { fill: col, r: 35 });
        text(ctx, sub, 110, y + 255, 38, { weight: 800, color: col }); ctx.restore();
      };
      gauge("Terdengar meyakinkan?", A.y + 40, ease(g1), C.good, pop(b, l, 0), Math.round(100 * ease(g1)) + "%");
      gauge("Faktanya sudah dicek?", A.y + 400, 0, C.kuning, u2, "belum tentu");
      const uq = pop(b, l, "faktanya");
      if (uq > 0) { ctx.save(); ctx.translate(790, A.y + 650); ctx.scale(uq, uq); ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(0, 0, 60, 0, Math.PI * 2); ctx.fill();
        text(ctx, "?", 0, 30, 84, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      if (A.bot - A.y - 740 > 150) bip(ctx, 480, A.y + 740 + (A.bot - A.y - 740) / 2, Math.min(200, A.bot - A.y - 760), { mood: uq > 0 ? "think" : "happy", t });
    },
    // dicari di katalog perpustakaan: tidak ditemukan
    t43_palsu(ctx, b, l, t, TL, A) {
      const chips = [["buku", C.kuning, 210], ["tanggal", C.pink, 480], ["tokoh", C.tosca, 750]];
      chips.forEach(([s, col, x]) => { const u = pop(b, l, s); if (u <= 0) return; ctx.save(); ctx.translate(x, A.y + 50); ctx.scale(u, u); pill(ctx, s, 0, 0, 44, { fill: col }); ctx.restore(); });
      const y = A.y + 150;
      card(ctx, 70, y, 820, 470, { fill: C.panel, stroke: C.line, lw: 4, r: 30 });
      text(ctx, "Katalog Perpustakaan", 110, y + 70, 40, { weight: 900, color: C.ink });
      card(ctx, 110, y + 110, 740, 90, { fill: "#F2F4FF", r: 20 });
      const q = "Sejarah Robot Nusantara", k = clamp(cue(b, l, 0.05) / 1.2, 0, 1);
      text(ctx, q.slice(0, Math.round(k * q.length)), 140, y + 170, 38, { weight: 700, color: C.bg, fit: 600 });
      ctx.strokeStyle = C.bg; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(800, y + 148, 18, 0, Math.PI * 2); ctx.moveTo(813, y + 161); ctx.lineTo(830, y + 178); ctx.stroke();
      const un = pop(b, l, "tidak ada");
      if (un > 0) { ctx.save(); ctx.globalAlpha = clamp(un, 0, 1);
        text(ctx, "0 hasil", 480, y + 300, 90, { align: "center", weight: 900, color: C.bad });
        text(ctx, "Buku ini tidak ditemukan.", 480, y + 370, 40, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); }
      else if (k >= 1) { const d = Math.floor(l * 3) % 4; text(ctx, "Mencari" + ".".repeat(d), 480, y + 320, 44, { align: "center", weight: 800, color: C.ink2 }); }
      const uh = pop(b, l, "halusinasi");
      if (uh > 0) { ctx.save(); ctx.translate(480, y + 560); ctx.scale(uh, uh);
        card(ctx, -320, -60, 640, 120, { fill: C.pink, r: 30, glow: "rgba(255,79,154,0.5)" }); text(ctx, "Halusinasi AI", 0, 22, 62, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
    }
  });
})();
