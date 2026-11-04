/* T01 Kenapa sandi 123456 bisa ketebak dalam sekejap? — adegan khusus. Semua data rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, lock, bip, check, ease, clamp, back, rnd, fmt, cue, ph, pop } = T.helpers;

  Object.assign(T.SCENES, {
    // gambar di bawah kait: kolom kata sandi terisi titik, lalu terbuka "123456" dan gembok terbuka
    t01_sandi(ctx, b, l, t, TL, A) {
      const cx = 480, h = Math.min(420, A.h - 20), y = A.y + (A.h - h) / 2;
      card(ctx, cx - 380, y, 760, h, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "Kata sandi", cx - 320, y + 80, 40, { weight: 800, color: C.ink2 });
      const fy = y + 110, open = ph(b, l, 0.25, 0.3);
      card(ctx, cx - 320, fy, 640, 130, { fill: C.bg, stroke: open > 0 ? C.bad : C.biru, lw: 5, r: 22, glow: open > 0 ? "rgba(255,90,95,0.6)" : null });
      const dots = Math.min(6, Math.floor(l / 0.12));
      if (open <= 0) for (let i = 0; i < dots; i++) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx - 250 + i * 64, fy + 65, 16, 0, Math.PI * 2); ctx.fill(); }
      else text(ctx, "123456", cx - 280, fy + 92, 84, { weight: 900, color: C.bad });
      lock(ctx, cx + 230, fy + 50, 90, open, open > 0 ? C.bad : C.kuning);
      const st = pop(b, l, 0.3);
      if (st > 0) {
        ctx.save(); ctx.translate(cx, y + h - 70); ctx.rotate(-0.08); ctx.scale(st, st);
        card(ctx, -230, -52, 460, 104, { fill: C.bad, r: 20 });
        text(ctx, "KETEBAK!", 0, 26, 70, { align: "center", weight: 900, color: C.ink });
        ctx.restore();
      }
    },

    // daftar sandi terpopuler dicoba dari atas; baris pertama langsung cocok
    t01_daftar(ctx, b, l, t, TL, A) {
      const list = ["123456", "password", "123456789", "12345678", "qwerty", "111111", "abc123"];
      const x = A.x, w = 820, rowH = Math.min(96, (A.h - 250) / list.length), hit = cue(b, l, "urutan pertama");
      card(ctx, x, A.y, w, 120 + rowH * list.length + 20, { fill: C.panel, stroke: C.line, lw: 4 });
      // kepala panel: "mesin pembobol" berupa ikon roda gigi yang berputar
      ctx.save(); ctx.translate(x + 70, A.y + 60); ctx.rotate(l * 2.5); ctx.fillStyle = C.pink;
      for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); ctx.fillRect(-9, -36, 18, 16); }
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.panel; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      text(ctx, "Mesin pembobol", x + 125, A.y + 58, 46, { weight: 900, color: C.ink });
      text(ctx, "mencoba daftar sandi terpopuler", x + 125, A.y + 100, 30, { weight: 700, color: C.ink2 });
      list.forEach((s, i) => {
        const u = ph(b, l, 0.05 + i * 0.05, 0.3); if (u <= 0) return;
        const y = A.y + 120 + i * rowH, first = i === 0;
        ctx.save(); ctx.globalAlpha = u * (hit > 0 && !first ? 0.35 : 1); ctx.translate((1 - u) * 60, 0);
        if (first) {
          const scan = hit > 0 ? 1 : 0.5 + 0.5 * Math.sin(l * 12);
          card(ctx, x + 20, y + 6, w - 40, rowH - 12, { fill: hit > 0 ? C.goodBg : `rgba(77,163,255,${0.15 + 0.2 * scan})`, stroke: hit > 0 ? C.good : C.biru, lw: 4, r: 18 });
        }
        text(ctx, (i + 1) + ".", x + 60, y + rowH * 0.66, 40, { weight: 800, color: C.ink2 });
        text(ctx, s, x + 130, y + rowH * 0.66, 46, { weight: 800, color: first ? C.ink : C.ink2 });
        if (first && hit > 0) { check(ctx, x + w - 240, y + rowH / 2, 44, C.good); text(ctx, "COCOK!", x + w - 50, y + rowH * 0.66, 40, { weight: 900, color: C.good, align: "right" }); }
        ctx.restore();
      });
      const u2 = pop(b, l, "urutan pertama");
      if (u2 > 0) { ctx.save(); ctx.translate(x + 300, A.y + 120 + rowH * list.length + 110); ctx.scale(u2, u2); pill(ctx, "Tebakan pertama langsung benar", 0, 0, 38, { fill: C.kuning }); ctx.restore(); }
      bip(ctx, x + 720, A.bot - 90, 150, { mood: hit > 0 ? "wow" : "think", t });
    },

    // satu miliar tebakan per detik: angka tebakan berkelebat, batang satu juta kemungkinan penuh dalam sekejap
    t01_cepat(ctx, b, l, t, TL, A) {
      const u = pop(b, l, "satu miliar");
      if (u > 0) {
        ctx.save(); ctx.translate(540, A.y + 130); ctx.scale(u, u);
        text(ctx, "1.000.000.000", 0, 0, 120, { align: "center", weight: 900, color: C.kuning, fit: 940, shadow: true }); ctx.restore();
        text(ctx, "tebakan per detik", 540, A.y + 200, 48, { align: "center", weight: 800, color: C.ink });
      }
      // kolom tebakan yang berganti tiap frame
      const fy = A.y + 260, done = cue(b, l, "seperseribu") > 0;
      card(ctx, 100, fy, 760, 150, { fill: C.bg, stroke: done ? C.bad : C.biru, lw: 5, r: 24 });
      const g = done ? "123456" : String(Math.floor(rnd(Math.floor(t * 30)) * 1e6)).padStart(6, "0");
      text(ctx, g, 480, fy + 106, 96, { align: "center", weight: 900, color: done ? C.bad : C.ink });
      // batang kemungkinan
      const by = fy + 220, k = ease(cue(b, l, "jadi") / 0.5);
      text(ctx, "1.000.000 kemungkinan", 100, by, 40, { weight: 800, color: C.ink2 });
      card(ctx, 100, by + 24, 760, 60, { fill: C.panel, r: 30 });
      if (k > 0) card(ctx, 100, by + 24, Math.max(60, 760 * k), 60, { fill: C.bad, r: 30 });
      text(ctx, fmt(1e6 * k) + " dicoba", 480, by + 68, 34, { align: "center", weight: 800, color: C.ink });
      // stopwatch
      const us = pop(b, l, "seperseribu");
      if (us > 0) {
        const sy = by + 230; ctx.save(); ctx.translate(300, sy); ctx.scale(us, us);
        ctx.strokeStyle = C.ink; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = C.ink; ctx.fillRect(-18, -112, 36, 22);
        ctx.strokeStyle = C.bad; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -58); ctx.stroke();
        ctx.restore();
        text(ctx, "0,001", 420, sy + 10, 110, { weight: 900, color: C.bad, shadow: true });
        text(ctx, "detik", 425, sy + 82, 46, { weight: 800, color: C.ink });
      }
    }
  });
})();
