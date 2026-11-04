/* T36 Mencari satu nama di antara sejuta dalam sekejap — adegan khusus. Nama-nama rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, fmt, cue, ph, pop } = T.helpers;
  const NAMA = ["Agus", "Bayu", "Citra", "Dimas", "Fajar", "Gita", "Indra", "Maya", "Nina", "Putri", "Rizki", "Sari", "Tono", "Wati", "Yogi"];
  const HALF = [1000000, 500000, 250000, 125000, 62500, 31250, 15625, 7813, 3907, 1954, 977, 489, 245, 123, 62, 31, 16, 8, 4, 2, 1];

  function kaca(ctx, x, y, s, col) {      // kaca pembesar
    ctx.save(); ctx.strokeStyle = col || C.kuning; ctx.lineWidth = s * 0.12; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(x, y, s * 0.35, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = s * 0.16; ctx.beginPath(); ctx.moveTo(x + s * 0.27, y + s * 0.27); ctx.lineTo(x + s * 0.6, y + s * 0.6); ctx.stroke(); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // kait: buku nama tebal "1.000.000 nama", kaca pembesar, penghitung langkah sampai 20
    t36_buku(ctx, b, l, t, TL, A) {
      const h = Math.min(520, A.h - 30), w = h * 0.8, x = 140, y = A.y + (A.h - h) / 2;
      for (let i = 6; i >= 0; i--) card(ctx, x + i * 9, y + i * 9, w, h, { fill: i ? "#E8ECFF" : C.biru, stroke: i ? "#B8C0EE" : null, lw: 2, r: 18 });
      card(ctx, x + 30, y + 40, w - 60, 110, { fill: C.bg, r: 14 });
      text(ctx, "DAFTAR NAMA", x + w / 2, y + 112, 40, { align: "center", weight: 900, color: C.ink, fit: w - 90 });
      text(ctx, "1.000.000", x + w / 2, y + h * 0.58, 70, { align: "center", weight: 900, color: C.ink, fit: w - 50 });
      text(ctx, "nama", x + w / 2, y + h * 0.58 + 56, 44, { align: "center", weight: 800, color: C.ink });
      kaca(ctx, x + w * 0.6 + Math.sin(l * 3) * 60, y + h * 0.75 + Math.cos(l * 2.3) * 40, 160, C.kuning);
      const u = pop(b, l, "20 langkah");
      const n = u > 0 ? Math.min(20, 1 + Math.floor(cue(b, l, "20 langkah") / 0.07)) : 0;
      if (u > 0) { ctx.save(); ctx.translate(720, A.y + A.h * 0.5); ctx.scale(u, u);
        ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2); ctx.fill();
        text(ctx, "≤ " + n, 0, 25, 92, { align: "center", weight: 900, color: C.bg });
        text(ctx, "langkah", 0, 80, 34, { align: "center", weight: 800, color: C.bg }); ctx.restore(); }
    },
    // daftar acak disusun menjadi urut abjad
    t36_urut(ctx, b, l, t, TL, A) {
      const names = ["Gita", "Agus", "Rizki", "Citra", "Wati", "Maya", "Bayu", "Putri"], sorted = [...names].sort();
      const k = ease(cue(b, l, "urut abjad") / 0.9), rh = Math.min(96, (A.h - 40) / names.length);
      names.forEach((n, i) => {
        const j = sorted.indexOf(n), yy = A.y + 20 + lerp(i, j, k) * rh, xx = A.x + 20 + Math.sin(k * Math.PI) * (i % 2 ? 60 : -20);
        card(ctx, xx, yy, 440, rh - 14, { fill: C.panel, stroke: k >= 1 ? C.tosca : C.line, lw: 4, r: 18 });
        text(ctx, n[0], xx + 50, yy + rh * 0.6, 44, { align: "center", weight: 900, color: k >= 1 ? C.kuning : C.ink2 });
        text(ctx, n, xx + 100, yy + rh * 0.6, 44, { weight: 800, color: C.ink });
      });
      const ud = pop(b, l, "kamus");
      if (ud > 0) { ctx.save(); ctx.translate(720, A.y + 300); ctx.scale(ud, ud);
        card(ctx, -130, -150, 260, 300, { fill: C.pink, r: 22 }); card(ctx, -110, -130, 220, 260, { fill: "#FFF0F6", r: 12 });
        text(ctx, "A–Z", 0, 30, 84, { align: "center", weight: 900, color: C.pink }); text(ctx, "KAMUS", 0, 100, 34, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      bip(ctx, 720, A.bot - 150, Math.min(240, A.h - 560), { mood: k >= 1 ? "happy" : "think", t });
    },
    // buka di tengah: Maya; Putri sesudahnya, separuh depan dibuang
    t36_tengah(ctx, b, l, t, TL, A) {
      const rh = Math.min(64, (A.h - 20) / NAMA.length), mid = 7, gone = ph(b, l, "dibuang", 0.6);
      NAMA.forEach((n, i) => {
        const yy = A.y + 10 + i * rh, front = i < mid + 1, isMid = i === mid && cue(b, l, "tengah") > 0;
        ctx.save(); if (front) { ctx.globalAlpha = 1 - 0.8 * gone; ctx.translate(-gone * 40, 0); }
        card(ctx, A.x + 10, yy, 400, rh - 8, { fill: isMid ? C.kuning : n === "Putri" ? C.goodBg : C.panel, r: 14, stroke: n === "Putri" ? C.good : null, lw: 3 });
        text(ctx, n, A.x + 40, yy + rh * 0.66, rh * 0.55, { weight: 800, color: isMid ? C.bg : C.ink });
        if (front && gone > 0.5) { ctx.strokeStyle = C.bad; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(A.x + 30, yy + rh / 2 - 4); ctx.lineTo(A.x + 390, yy + rh / 2 - 4); ctx.stroke(); }
        ctx.restore();
      });
      // kartu yang dicari
      card(ctx, 540, A.y + 20, 340, 150, { fill: C.panel, stroke: C.good, lw: 5, r: 26 });
      kaca(ctx, 600, A.y + 85, 80, C.good);
      text(ctx, "Cari:", 650, A.y + 80, 34, { weight: 700, color: C.ink2 }); text(ctx, "Putri", 650, A.y + 135, 54, { weight: 900, color: C.ink });
      const um = pop(b, l, "tengah");
      if (um > 0) { const yy = A.y + 10 + mid * rh + rh / 2; ctx.save(); ctx.globalAlpha = clamp(um, 0, 1); arrow(ctx, 600, yy, 430, yy, C.kuning, 9, 30);
        text(ctx, "tengah", 620, yy + 14, 40, { weight: 900, color: C.kuning }); ctx.restore(); }
      const uk = pop(b, l, "karena");
      if (uk > 0) { ctx.save(); ctx.translate(710, A.y + 300); ctx.scale(uk, uk);
        card(ctx, -170, -70, 340, 140, { fill: C.panel2, r: 24 });
        text(ctx, "P sesudah M", 0, -6, 42, { align: "center", weight: 900, color: C.ink });
        text(ctx, "Putri > Maya", 0, 44, 34, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
      const ug = pop(b, l, "dibuang");
      if (ug > 0) { ctx.save(); ctx.translate(710, A.y + A.h * 0.75); ctx.rotate(-0.08); ctx.scale(ug, ug);
        card(ctx, -170, -55, 340, 110, { fill: C.bad, r: 20 }); text(ctx, "8 nama dibuang!", 0, 16, 40, { align: "center", weight: 900, color: C.ink, fit: 320 }); ctx.restore(); }
    },
    // separuh demi separuh: sejuta -> 1 dalam 20 langkah
    t36_paruh(ctx, b, l, t, TL, A) {
      const c0 = cue(b, l, "sejuta"), c1 = cue(b, l, "lima ratus"), c2 = cue(b, l, "dua ratus"), c3 = cue(b, l, "terus");
      let k = 0; if (c1 > 0) k = 1; if (c2 > 0) k = 2; if (c3 > 0) k = Math.min(20, 2 + Math.floor(c3 / 0.12));
      if (c0 < 0) k = 0;
      const v = HALF[k], y0 = A.y + 40;
      text(ctx, "Sisa nama", 480, y0 + 40, 46, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, fmt(v), 480, y0 + 200, 150, { align: "center", weight: 900, color: k === 20 ? C.good : C.kuning, fit: 820, shadow: true });
      // batang: seluruh daftar, bagian yang tersisa tetap terang
      const bx = A.x + 10, bw = 800, by = y0 + 280;
      card(ctx, bx, by, bw, 70, { fill: C.panel, r: 20 });
      card(ctx, bx, by, Math.max(14, bw * v / 1e6), 70, { fill: k === 20 ? C.good : C.biru, r: 20 });
      // daftar langkah
      const rows = Math.min(k + 1, 21), cols = 3, cw = 270, rh = 62;
      for (let i = 0; i < rows; i++) {
        const c = Math.floor(i / 7), r = i % 7, xx = A.x + 10 + c * cw, yy = by + 120 + r * rh;
        if (yy + rh > A.bot) continue;
        ctx.globalAlpha = i === k ? 1 : 0.65;
        text(ctx, (i === 0 ? "awal" : "langkah " + i), xx, yy + 40, 28, { weight: 700, color: C.ink2 });
        text(ctx, fmt(HALF[i]), xx + 250, yy + 40, 32, { align: "right", weight: 900, color: i === k ? C.kuning : C.ink }); ctx.globalAlpha = 1;
      }
    }
  });
})();
