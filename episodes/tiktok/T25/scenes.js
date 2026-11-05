/* T25 Kenapa Wi-Fi gratisan perlu diwaspadai? — adegan khusus (sisi pertahanan saja). Nama jaringan, situs, dan pesan rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, cross, lock, bip, rnd, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;

  function wifi(ctx, cx, cy, s, col, bars = 3) {
    ctx.save(); ctx.strokeStyle = col || C.tosca; ctx.fillStyle = col || C.tosca; ctx.lineCap = "round"; ctx.lineWidth = s * 0.12;
    for (let i = 1; i <= 3; i++) { ctx.globalAlpha = i <= bars ? 1 : 0.25; ctx.beginPath(); ctx.arc(cx, cy, s * 0.25 * i, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke(); }
    ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, cy, s * 0.09, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function wifiRow(ctx, x, y, w, name, note, opt = {}) {
    card(ctx, x, y, w, 120, { fill: opt.fill || C.panel, stroke: opt.stroke || C.line, lw: 4, r: 22 });
    wifi(ctx, x + 70, y + 86, 90, opt.col || C.tosca);
    text(ctx, name, x + 140, y + 62, 46, { weight: 900, color: C.ink, fit: w - 300 });
    if (note) text(ctx, note, x + 140, y + 100, 30, { weight: 700, color: C.ink2, fit: w - 200 });
  }
  function toggle(ctx, x, y, on, col) {
    card(ctx, x, y, 130, 70, { fill: on > 0.5 ? (col || C.good) : C.panel2, r: 35 });
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x + 35 + 60 * on, y + 35, 27, 0, Math.PI * 2); ctx.fill();
  }
  function eye(ctx, cx, cy, s) {
    ctx.save(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(cx - s, cy); ctx.quadraticCurveTo(cx, cy - s * 0.9, cx + s, cy); ctx.quadraticCurveTo(cx, cy + s * 0.9, cx - s, cy); ctx.fill();
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(cx, cy, s * 0.36, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(cx, cy, s * 0.16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function routerBox(ctx, cx, cy, s, col) {
    ctx.save(); ctx.strokeStyle = C.ink2; ctx.lineWidth = 7; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx - s * 0.3, cy - s * 0.15); ctx.lineTo(cx - s * 0.36, cy - s * 0.5); ctx.moveTo(cx + s * 0.3, cy - s * 0.15); ctx.lineTo(cx + s * 0.36, cy - s * 0.5); ctx.stroke();
    card(ctx, cx - s * 0.5, cy - s * 0.17, s, s * 0.34, { fill: C.panel2, r: 12, stroke: col || C.tosca, lw: 4 }); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: daftar Wi-Fi dengan jaringan gratis, tanda tanya pemiliknya
    t25_kait(ctx, b, l, t, TL, A) {
      const y = A.y + 10, u = pop(b, l, 0.05);
      ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
      card(ctx, 80, y, 800, 330, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "Wi-Fi di sekitar", 120, y + 64, 40, { weight: 800, color: C.ink2 });
      wifiRow(ctx, 110, y + 100, 740, "GRATIS Kafe Senja", "terbuka, tanpa sandi", { stroke: C.kuning, col: C.kuning });
      text(ctx, "Rumah_Pak_Budi", 250, y + 290, 36, { weight: 700, color: C.mute }); lock(ctx, 790, y + 262, 44, 0, C.mute);
      ctx.restore();
      const uq = pop(b, l, "siapa pemilik");
      if (uq > 0) { ctx.save(); ctx.translate(480, y + 470); ctx.scale(uq, uq); card(ctx, -260, -70, 520, 140, { fill: C.bg, stroke: C.pink, lw: 6, r: 30 });
        text(ctx, "Pemilik: ???", 0, 22, 62, { align: "center", weight: 900, color: C.pink }); ctx.restore(); }
      const by = y + 560; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: uq > 0 ? "think" : "happy", t });
    },

    // dua jaringan bernama sama: satu dari kafe, satu dari laptop orang lain
    t25_kembar(ctx, b, l, t, TL, A) {
      const y = A.y + 20, x = 80, w = 800;
      text(ctx, "Pilih Wi-Fi", x, y + 40, 44, { weight: 900, color: C.kuning });
      const u1 = pop(b, l, 0.05), u2 = pop(b, l, "dua jaringan"), sy = y + 520, us = ph(b, l, "Kafe Senja", 0.6);
      if (us > 0) { ctx.save(); ctx.globalAlpha = us; ctx.lineWidth = 6; ctx.setLineDash([12, 10]);
        ctx.strokeStyle = C.tosca; ctx.beginPath(); ctx.moveTo(250, sy - 20); ctx.lineTo(250, y + 200); ctx.stroke();
        ctx.strokeStyle = C.pink; ctx.beginPath(); ctx.moveTo(720, sy - 30); ctx.lineTo(720, y + 350); ctx.stroke(); ctx.restore(); }
      if (u1 > 0) { ctx.save(); ctx.globalAlpha = clamp(u1, 0, 1); wifiRow(ctx, x, y + 80, w, "Kafe Senja", null); ctx.restore(); }
      if (u2 > 0) { ctx.save(); ctx.globalAlpha = clamp(u2, 0, 1); wifiRow(ctx, x, y + 230, w, "Kafe Senja", null); ctx.restore(); }
      // sumber masing-masing jaringan
      if (us > 0) {
        ctx.save(); ctx.globalAlpha = us;
        routerBox(ctx, 250, sy + 40, 200, C.tosca); text(ctx, "router kafe", 250, sy + 140, 38, { align: "center", weight: 800, color: C.tosca });
        // laptop orang lain
        card(ctx, 620, sy - 20, 200, 120, { fill: "#05061A", r: 10, stroke: C.ink2, lw: 5 }); card(ctx, 636, sy - 6, 168, 92, { fill: C.pink, r: 6 }); card(ctx, 596, sy + 100, 248, 20, { fill: C.ink2, r: 8 });
        text(ctx, "laptop orang lain", 720, sy + 170, 36, { align: "center", weight: 800, color: C.pink });
        ctx.restore();
      }
      const uw = pop(b, l, "Kafe Senja", 0.5);
      if (cue(b, l, "Kafe Senja") > 0.8) { ctx.save(); ctx.translate(480, sy + 260); ctx.scale(uw, uw); pill(ctx, "Namanya sama, pemiliknya beda!", 0, 0, 42, { fill: C.kuning }); ctx.restore(); }
    },

    // pemilik jaringan bisa melihat situs yang dibuka
    t25_lihat(ctx, b, l, t, TL, A) {
      const y = A.y + 20;
      // HP -> router -> internet
      card(ctx, 110, y + 40, 140, 240, { fill: "#05061A", r: 22, stroke: C.ink2, lw: 5 }); card(ctx, 124, y + 56, 112, 208, { fill: C.biru, r: 12 });
      routerBox(ctx, 480, y + 170, 200, C.kuning);
      ctx.save(); ctx.fillStyle = C.panel2; ctx.beginPath(); ctx.arc(780, y + 150, 90, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.ink2; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(780, y + 150, 40, 90, 0, 0, Math.PI * 2); ctx.moveTo(690, y + 150); ctx.lineTo(870, y + 150); ctx.stroke(); ctx.restore();
      // paket berjalan
      for (let i = 0; i < 3; i++) { const k = ((l * 0.7 + i / 3) % 1); const px = k < 0.5 ? lerp(260, 470, k * 2) : lerp(490, 690, (k - 0.5) * 2);
        ctx.fillStyle = [C.kuning, C.pink, C.tosca][i]; rr(ctx, px - 18, y + 150, 36, 30, 6); ctx.fill(); }
      // panel pemilik jaringan
      const ue = pop(b, l, "melihat"), py = y + 360;
      if (ue > 0) {
        ctx.save(); ctx.globalAlpha = clamp(ue, 0, 1);
        card(ctx, 80, py, 800, 440, { fill: C.panel, stroke: C.pink, lw: 5 });
        eye(ctx, 150, py + 70, 46); text(ctx, "Layar pemilik jaringan", 220, py + 86, 42, { weight: 900, color: C.ink, fit: 620 });
        ctx.restore();
        ["belajarseru.example", "kantinsehat.example", "videolucu.example", "tokobuku.example"].forEach((s, i) => {
          const u = ph(b, l, "situs", 0.3 + i * 0.25); if (u <= 0) return; const ry = py + 140 + i * 72;
          if (ry + 60 > py + 440) return;
          ctx.save(); ctx.globalAlpha = u; card(ctx, 110, ry, 740, 60, { fill: C.bg2, r: 14 });
          text(ctx, "HP-mu membuka " + s, 140, ry + 42, 34, { weight: 800, color: i % 2 ? C.ink2 : C.ink, fit: 680 }); ctx.restore();
        });
      }
    },

    // dengan gembok: data teracak; tanpa gembok: data terbaca
    t25_gembok(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y1 = A.y + 20, h = 330;
      const row = (y, safe, u) => {
        if (u <= 0) return; ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        card(ctx, x, y, w, h, { fill: safe ? C.goodBg : C.badBg, stroke: safe ? C.good : C.bad, lw: 5 });
        card(ctx, x + 30, y + 30, w - 60, 80, { fill: C.bg, r: 40 });
        if (safe) lock(ctx, x + 80, y + 54, 44, 0, C.good); else { ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(x + 80, y + 70, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, "!", x + 80, y + 82, 32, { align: "center", weight: 900, color: C.ink }); }
        text(ctx, safe ? "tokobuku.example" : "situs-lama.example", x + 130, y + 84, 40, { weight: 800, color: C.ink });
        text(ctx, "Yang terlihat oleh orang lain:", x + 30, y + 170, 34, { weight: 700, color: C.ink2 });
        const msg = "Halo, ini pesanku untuk Rara";
        const shown = safe ? msg.split("").map((ch, i) => ch === " " ? " " : "#@%&*kQ9xZ!"[Math.floor(rnd(i * 7 + Math.floor(l * 10)) * 11)]).join("") : msg;
        text(ctx, shown, x + 30, y + 250, 46, { weight: 900, color: safe ? C.good : C.kuning, fit: w - 60 });
        ctx.restore();
      };
      row(y1, false, pop(b, l, 0.02));
      if (ph(b, l, "diintip", 0.3) > 0) { eye(ctx, x + w - 80, y1 + 70, 40 * ph(b, l, "diintip", 0.3)); }
      row(y1 + h + 40, true, pop(b, l, "periksa"));
      const by = y1 + 2 * h + 60; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: "happy", t });
    },

    // pengaturan: matikan sambung otomatis, nyalakan data seluler
    t25_atur(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y = A.y + 20;
      card(ctx, x, y, w, 520, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "Pengaturan HP", x + 40, y + 70, 48, { weight: 900, color: C.ink });
      const r1 = y + 130, r2 = y + 330, off = ph(b, l, "matikan", 0.4), on = ph(b, l, "data seluler", 0.4);
      card(ctx, x + 30, r1, w - 60, 160, { fill: C.bg2, r: 20, stroke: off > 0 ? C.kuning : null, lw: 4 });
      wifi(ctx, x + 90, r1 + 110, 80);
      text(ctx, "Wi-Fi gratisan", x + 150, r1 + 65, 40, { weight: 800, color: C.ink });
      text(ctx, "Sambung otomatis", x + 150, r1 + 115, 34, { weight: 700, color: C.ink2 });
      toggle(ctx, x + w - 200, r1 + 45, 1 - off);
      card(ctx, x + 30, r2, w - 60, 160, { fill: C.bg2, r: 20, stroke: on > 0 ? C.kuning : null, lw: 4 });
      for (let i = 0; i < 4; i++) { ctx.fillStyle = on > 0.5 ? C.tosca : C.mute; rr(ctx, x + 60 + i * 18, r2 + 110 - i * 16, 12, 22 + i * 16, 4); ctx.fill(); }
      text(ctx, "Data seluler", x + 150, r2 + 65, 40, { weight: 800, color: C.ink });
      text(ctx, "untuk urusan penting", x + 150, r2 + 115, 34, { weight: 700, color: C.ink2 });
      toggle(ctx, x + w - 200, r2 + 45, on);
      // jari mengetuk sakelar
      const tapAt = cue(b, l, "data seluler") > -0.4 ? [x + w - 135, r2 + 80, cue(b, l, "data seluler")] : [x + w - 135, r1 + 80, cue(b, l, "matikan")];
      if (tapAt[2] > -0.4 && tapAt[2] < 0.6) { ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(tapAt[0] + Math.max(0, -tapAt[2]) * 100, tapAt[1] + Math.max(0, -tapAt[2]) * 120, 26, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      const by = y + 560; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(220, A.bot - by - 10), { mood: on > 0 ? "happy" : "think", t, bounce: on > 0 ? 1 : 0 });
    }
  });
})();
