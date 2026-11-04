/* T08 Kenapa hoaks menyebar secepat itu? — adegan khusus. Pesan, grup, dan nama rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, fmt, cue, ph, pop } = T.helpers;
  const HOAX = "PENTING!!! Besok semua sekolah libur. Sebarkan ke semua grup!!!";

  // wajah ekspresi sederhana (digambar sendiri)
  function face(ctx, x, y, s, kind) {
    ctx.save(); ctx.translate(x, y);
    const g = ctx.createLinearGradient(0, -s / 2, 0, s / 2);
    if (kind === "takut") { g.addColorStop(0, "#7FB2FF"); g.addColorStop(0.45, "#FFD23F"); } else { g.addColorStop(0, "#FFD23F"); g.addColorStop(1, "#FFB800"); }
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg;
    ctx.beginPath(); ctx.ellipse(-s * 0.17, -s * 0.08, s * 0.07, s * 0.1, 0, 0, Math.PI * 2); ctx.ellipse(s * 0.17, -s * 0.08, s * 0.07, s * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    if (kind === "takut") {
      ctx.strokeStyle = C.bg; ctx.lineWidth = s * 0.05; ctx.beginPath();
      for (let i = 0; i <= 6; i++) { const xx = -s * 0.2 + i * s * 0.4 / 6, yy = s * 0.2 + (i % 2 ? -1 : 1) * s * 0.04; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
    } else { ctx.beginPath(); ctx.ellipse(0, s * 0.2, s * 0.09, s * 0.12, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function msgBubble(ctx, s, x, y, w, size, opt = {}) {
    const lines = T.helpers.wrap(ctx, s, size, 800, w - 60), h = lines.length * size * 1.25 + 60;
    card(ctx, x, y, w, h, { fill: opt.fill || C.panel2, stroke: opt.stroke || C.bad, lw: 5, r: 30 });
    lines.forEach((ln, i) => text(ctx, ln, x + 30, y + 30 + size * 0.95 + i * size * 1.25, size, { weight: 800, color: C.ink }));
    return h;
  }
  function person(ctx, x, y, s, col) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - s * 0.22, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y + s * 0.42, s * 0.38, Math.PI, 0); ctx.fill();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: pesan berantai "PENTING!!!" melesat ke banyak HP
    t08_pesan(ctx, b, l, t, TL, A) {
      const u = pop(b, l, 0.02);
      if (u > 0) { ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate(0, (1 - u) * 40); msgBubble(ctx, HOAX, A.x + 40, A.y + 10, 740, 44); ctx.restore(); }
      const top = A.y + 230, n = 8;
      for (let i = 0; i < n; i++) {
        const k = ph(b, l, 0.25 + i * 0.06, 0.35); if (k <= 0) continue;
        const ang = Math.PI * (0.1 + 0.8 * i / (n - 1)), r = Math.min(360, A.bot - top - 40) * k;
        const x = 480 - Math.cos(ang) * r * 1.1, y = top + 10 + Math.sin(ang) * r * 0.75;
        ctx.save(); ctx.globalAlpha = 0.5; arrow(ctx, 480, top + 10, lerp(480, x, 0.85), lerp(top + 10, y, 0.85), C.pink, 5, 18); ctx.restore();
        card(ctx, x - 32, y - 52, 64, 104, { fill: "#0A0D24", stroke: C.pink, lw: 4, r: 12 });
        ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(x + 26, y - 50, 14, 0, Math.PI * 2); ctx.fill();
        text(ctx, "!", x + 26, y - 41, 22, { align: "center", weight: 900, color: C.ink });
      }
      if (A.bot - top > 200) bip(ctx, 480, top + 40, 110, { mood: "wow", t });
    },
    // reaksi: kaget dan takut, lalu jari mengetuk "Teruskan"
    t08_emosi(ctx, b, l, t, TL, A) {
      msgBubble(ctx, HOAX, A.x + 40, A.y + 20, 740, 44);
      const uk = pop(b, l, "mengejutkan"), ut = pop(b, l, "menakutkan"), y = A.y + 400;
      if (uk > 0) { ctx.save(); ctx.translate(A.x + 220, y); ctx.scale(uk, uk); ctx.rotate(Math.sin(t * 9) * 0.06); face(ctx, 0, 0, 200, "kaget"); ctx.restore(); text(ctx, "kaget", A.x + 220, y + 150, 44, { align: "center", weight: 800, color: C.kuning }); }
      if (ut > 0) { ctx.save(); ctx.translate(A.x + 600, y); ctx.scale(ut, ut); ctx.translate(Math.sin(t * 40) * 3, 0); face(ctx, 0, 0, 200, "takut"); ctx.restore(); text(ctx, "takut", A.x + 600, y + 150, 44, { align: "center", weight: 800, color: C.biru }); }
      // tombol Teruskan diketuk
      const uf = pop(b, l, "segera"), tap = cue(b, l, "meneruskannya"), by = y + 290;
      if (uf > 0 && by + 60 < A.bot) {
        const pressed = tap > 0 && tap < 0.2;
        ctx.save(); ctx.translate(480, by); ctx.scale(uf * (pressed ? 0.94 : 1), uf * (pressed ? 0.94 : 1));
        card(ctx, -230, -60, 460, 120, { fill: tap > 0 ? C.pink : C.panel2, r: 60, glow: tap > 0 ? "rgba(255,79,154,0.6)" : null });
        arrow(ctx, -150, 0, -80, 0, C.ink, 10, 26);
        text(ctx, "Teruskan", 40, 20, 54, { align: "center", weight: 900, color: C.ink }); ctx.restore();
        if (tap > -0.5 && tap < 1) { const d = Math.max(0, -tap) * 2; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(600 + d * 60, by + 20 + d * 80, 26, 0, Math.PI * 2); ctx.fill(); }
        if (tap > 0) { const k = (tap * 1.5) % 1; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(600, by + 20, 30 + k * 90, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      }
    },
    // penyebaran berantai: tiap orang meneruskan ke 5 teman, 6 putaran
    t08_sebar(ctx, b, l, t, TL, A) {
      const cx = 480, cy = A.y + Math.min(380, A.h * 0.4), R = Math.min(360, A.h * 0.38);
      const g0 = cue(b, l, "lima teman"), gs = cue(b, l, "setelah");
      // putaran 1 pada "lima teman", putaran 2..6 menyusul cepat setelah "setelah"
      const gen = g0 <= 0 ? 0 : gs <= 0 ? 1 : Math.min(6, 1 + Math.floor(gs / 0.4) + (gs > 0 ? 1 : 0));
      const ring = [0, 0.2, 0.42, 0.62, 0.8, 0.92, 1.0];
      for (let g = Math.min(gen, 6); g >= 1; g--) {
        const n = Math.min(Math.pow(5, g), 260), r = R * ring[g], col = [C.kuning, C.pink, C.tosca, C.biru, C.kuning, C.pink][g - 1], sz = Math.max(4, 26 - g * 4);
        for (let i = 0; i < n; i++) {
          const a = i / n * Math.PI * 2 + g * 0.3, rr2 = r + (g >= 4 ? (rnd(i + g * 100) - 0.5) * R * 0.14 : 0);
          const x = cx + Math.cos(a) * rr2, y = cy + Math.sin(a) * rr2 * 0.95;
          if (g <= 2) person(ctx, x, y, sz * 2.2, col); else { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, sz * 0.6, 0, Math.PI * 2); ctx.fill(); }
        }
      }
      person(ctx, cx, cy, 70, C.ink);
      // penghitung
      const tot = [0, 5, 30, 155, 780, 3905, 19530][gen], yb = cy + R + 50;
      card(ctx, A.x, yb, 820, 140, { fill: C.bg2, stroke: C.line, lw: 3, r: 26 });
      text(ctx, "Putaran " + gen, A.x + 30, yb + 58, 40, { weight: 800, color: C.ink2 });
      text(ctx, "orang menerima", A.x + 30, yb + 110, 36, { weight: 700, color: C.ink2 });
      text(ctx, fmt(tot), A.x + 790, yb + 100, 84, { weight: 900, color: gen === 6 ? C.bad : C.kuning, align: "right" });
      if (gen >= 1) { const u = pop(b, l, "lima teman"); ctx.save(); ctx.translate(A.x + 640, A.y + 40); ctx.scale(u, u); pill(ctx, "1 orang → 5 teman", 0, 0, 36, { fill: C.kuning }); ctx.restore(); }
    },
    // balapan: berita palsu vs berita benar menuju 1.500 orang
    t08_balap(ctx, b, l, t, TL, A) {
      const go = Math.max(0, cue(b, l, "berita palsu")), Tf = 1.4, kf = clamp(go / Tf, 0, 1), kt = clamp(go / (Tf * 6), 0, 1);
      text(ctx, "Siapa duluan sampai ke 1.500 orang?", A.x, A.y + 60, 44, { weight: 900, color: C.ink, fit: 820 });
      const lane = (y, label, col, k, done) => {
        text(ctx, label, A.x, y - 20, 42, { weight: 800, color: col });
        card(ctx, A.x, y, 820, 110, { fill: C.bg2, stroke: C.line, lw: 3, r: 24 });
        if (k > 0) card(ctx, A.x, y, Math.max(110, 760 * k + 60), 110, { fill: col, r: 24 });
        // bendera finis
        ctx.fillStyle = C.ink; ctx.fillRect(A.x + 790, y - 30, 6, 150); ctx.fillStyle = done ? col : C.ink; ctx.beginPath(); ctx.moveTo(A.x + 796, y - 30); ctx.lineTo(A.x + 850, y - 12); ctx.lineTo(A.x + 796, y + 6); ctx.fill();
        // amplop pesan di ujung batang
        const ex = A.x + Math.max(55, 760 * k + 10);
        card(ctx, ex - 45, y + 25, 90, 60, { fill: C.ink, r: 8 }); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ex - 40, y + 30); ctx.lineTo(ex, y + 60); ctx.lineTo(ex + 40, y + 30); ctx.stroke();
      };
      lane(A.y + 200, "Berita palsu", C.bad, kf, kf >= 1);
      lane(A.y + 420, "Berita benar", C.tosca, kt, kt >= 1);
      const u = pop(b, l, "enam kali");
      if (u > 0) { ctx.save(); ctx.translate(480, A.y + 680); ctx.scale(u, u); ctx.rotate(-0.04);
        card(ctx, -360, -80, 720, 160, { fill: C.badBg, stroke: C.bad, lw: 6, r: 30 });
        text(ctx, "±6× lebih cepat", 0, 30, 84, { align: "center", weight: 900, color: C.bad, fit: 680 }); ctx.restore(); }
      const un = ph(b, l, "penelitian", 0.5);
      if (un > 0 && A.bot - (A.y + 780) > 60) { ctx.save(); ctx.globalAlpha = un; text(ctx, "Penelitian berita di media sosial, 2018", 480, A.y + 830, 34, { align: "center", weight: 700, color: C.ink2, fit: 800 }); ctx.restore(); }
    }
  });
})();
