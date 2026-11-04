/* T29 Jejak digital tidak benar-benar hilang — adegan khusus. Nama, grup, dan foto rekaan, digambar dengan kode. */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, cross, bip, rnd, fmt, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;

  function photo(ctx, x, y, w, h) {   // foto rekaan: pemandangan pantai sederhana
    ctx.save(); rr(ctx, x, y, w, h, Math.min(w, h) * 0.08); ctx.clip();
    ctx.fillStyle = "#4DA3FF"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#FFD23F"; ctx.beginPath(); ctx.arc(x + w * 0.72, y + h * 0.3, h * 0.13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1F6FD1"; ctx.fillRect(x, y + h * 0.58, w, h * 0.2); ctx.fillStyle = "#F2D49B"; ctx.fillRect(x, y + h * 0.78, w, h * 0.22);
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(x + w * 0.3, y + h * 0.66, h * 0.08, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x + w * 0.27, y + h * 0.7, w * 0.06, h * 0.14);
    ctx.restore();
  }
  function phone(ctx, cx, cy, s) {
    card(ctx, cx - s * 0.3, cy - s * 0.5, s * 0.6, s, { fill: "#05061A", r: s * 0.1, stroke: C.ink2, lw: 5 });
    card(ctx, cx - s * 0.25, cy - s * 0.43, s * 0.5, s * 0.84, { fill: C.bg2, r: s * 0.06 });
  }
  function trash(ctx, cx, cy, s, lid) {
    ctx.save(); ctx.fillStyle = C.ink2;
    ctx.save(); ctx.translate(cx - s * 0.4, cy - s * 0.42); ctx.rotate(-lid * 0.6); rr(ctx, 0, -s * 0.06, s * 0.8, s * 0.1, 6); ctx.fill(); rr(ctx, s * 0.3, -s * 0.14, s * 0.2, s * 0.1, 4); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(cx - s * 0.34, cy - s * 0.3); ctx.lineTo(cx + s * 0.34, cy - s * 0.3); ctx.lineTo(cx + s * 0.27, cy + s * 0.45); ctx.lineTo(cx - s * 0.27, cy + s * 0.45); ctx.fill();
    ctx.strokeStyle = C.bg; ctx.lineWidth = s * 0.05; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(cx + i * s * 0.14, cy - s * 0.18); ctx.lineTo(cx + i * s * 0.12, cy + s * 0.34); ctx.stroke(); }
    ctx.restore();
  }
  function server(ctx, cx, cy, s) {
    card(ctx, cx - s * 0.5, cy - s * 0.6, s, s * 1.2, { fill: C.panel2, r: 16, stroke: C.line, lw: 4 });
    for (let i = 0; i < 4; i++) { ctx.fillStyle = C.ink2; rr(ctx, cx - s * 0.38, cy - s * 0.48 + i * s * 0.27, s * 0.76, s * 0.17, 6); ctx.fill();
      ctx.fillStyle = (i + 1) % 2 ? C.tosca : C.kuning; ctx.beginPath(); ctx.arc(cx + s * 0.28, cy - s * 0.395 + i * s * 0.27, s * 0.04, 0, Math.PI * 2); ctx.fill(); }
  }
  function person(ctx, cx, cy, s, col) {
    ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy - s * 0.2, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.32, s * 0.36, s * 0.26, 0, Math.PI, 0); ctx.fill(); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: foto dibuang ke tempat sampah, tetapi salinannya masih melayang
    t29_kait(ctx, b, l, t, TL, A) {
      const cy = A.y + Math.min(A.h, 560) / 2, k = ph(b, l, 0.15, 0.8);
      trash(ctx, 480, cy + 90, 200, k > 0 && k < 1 ? 1 : 0);
      if (k < 1) { const s = lerp(1, 0.3, k); photo(ctx, lerp(380, 480 - 60, k), lerp(cy - 220, cy + 20, k), 200 * s + 40 * (1 - s), 150 * s + 30 * (1 - s)); }
      const g = ph(b, l, "benar-benar", 0.6);
      if (g > 0) [[180, cy - 120], [790, cy - 60], [230, cy + 160], [740, cy + 190]].forEach(([x, y], i) => {
        ctx.save(); ctx.globalAlpha = g * 0.85; ctx.translate(x, y + Math.sin(l * 2 + i) * 12); ctx.rotate((i % 2 ? 1 : -1) * 0.12); photo(ctx, -70, -52, 140, 104); ctx.restore(); });
    },

    // teman mengambil screenshot sebelum foto dihapus
    t29_ss(ctx, b, l, t, TL, A) {
      const cx = 480, cy = A.y + 380;
      phone(ctx, cx, cy, 620);
      photo(ctx, cx - 130, cy - 200, 260, 200);
      text(ctx, "Unggahan Rara", cx - 130, cy + 50, 30, { weight: 800, color: C.ink });
      const f = cue(b, l, "screenshot");
      if (f > 0 && f < 0.35) { ctx.save(); ctx.globalAlpha = 1 - f / 0.35; ctx.fillStyle = "#FFFFFF"; rr(ctx, cx - 140, cy - 240, 280, 476, 18); ctx.fill(); ctx.restore(); }
      if (f > 0.2) { const u = pop(b, l, "screenshot", 0.5);
        ctx.save(); ctx.translate(cx, cy + 330); ctx.scale(u, u); card(ctx, -300, -50, 600, 100, { fill: C.panel2, stroke: C.kuning, lw: 4, r: 50 });
        text(ctx, "Screenshot tersimpan", 0, 16, 44, { align: "center", weight: 900, color: C.kuning, fit: 560 }); ctx.restore();
        // gambar kecil di galeri teman
        const k = ease(clamp((f - 0.4) / 0.6, 0, 1)); ctx.save(); ctx.translate(lerp(cx, 760, k), lerp(cy, cy + 160, k)); ctx.scale(lerp(1, 0.5, k), lerp(1, 0.5, k)); ctx.globalAlpha = 0.95;
        card(ctx, -100, -80, 200, 160, { fill: C.ink, r: 12 }); photo(ctx, -92, -72, 184, 144); ctx.restore(); }
      person(ctx, 150, cy + 120, 160, C.tosca); text(ctx, "temanmu", 150, cy + 240, 36, { align: "center", weight: 800, color: C.tosca });
    },

    // dibagikan ulang ke grup lain, menyebar
    t29_sebar(ctx, b, l, t, TL, A) {
      const cx = 480, top = A.y + 90, k = clamp(cue(b, l, "dibagikan") / 2.4, 0, 1);
      card(ctx, cx - 70, top - 50, 140, 105, { fill: C.ink, r: 12 }); photo(ctx, cx - 64, top - 44, 128, 93);
      const lv1 = [185, 480, 770], names = ["Grup Kelas", "Grup Futsal", "Grup Keluarga"], y1 = top + 250, y2 = top + 520;
      let people = 0;
      lv1.forEach((x, i) => {
        const u = clamp(k * 3 - i * 0.3, 0, 1); if (u <= 0) return;
        ctx.save(); ctx.globalAlpha = u; arrow(ctx, cx, top + 70, lerp(cx, x, u), lerp(top + 70, y1 - 70, u), C.ink2, 6, 22);
        card(ctx, x - 132, y1 - 55, 264, 110, { fill: C.panel, stroke: C.biru, lw: 4, r: 20 });
        text(ctx, names[i], x, y1 + 14, 36, { align: "center", weight: 900, color: C.ink, fit: 230 }); ctx.restore();
        for (let j = 0; j < 4; j++) { const uj = clamp(k * 3 - 1 - i * 0.3 - j * 0.15, 0, 1); if (uj <= 0) continue; people++;
          const px = x - 105 + j * 70; ctx.save(); ctx.globalAlpha = uj; arrow(ctx, x, y1 + 60, px, y2 - 70, "rgba(184,192,238,0.5)", 4, 14);
          person(ctx, px, y2 - 20, 70, [C.pink, C.kuning, C.tosca, C.biru][j]);
          card(ctx, px - 22, y2 + 30, 44, 34, { fill: C.ink, r: 6 }); photo(ctx, px - 19, y2 + 33, 38, 28); ctx.restore(); }
      });
      const un = pop(b, l, "banyak orang"), ny = y2 + 140;
      if (un > 0 && ny + 40 < A.bot) { ctx.save(); ctx.translate(480, ny); ctx.scale(un, un); pill(ctx, "Sudah di tangan " + people + " orang!", 0, 0, 44, { fill: C.pink, color: C.ink }); ctx.restore(); }
    },

    // dihapus dari tampilan, salinan di server masih ada untuk sementara
    t29_server(ctx, b, l, t, TL, A) {
      const y = A.y + 20;
      phone(ctx, 230, y + 240, 460);
      text(ctx, "Unggahan", 230, y + 170, 34, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "dihapus", 230, y + 212, 34, { align: "center", weight: 800, color: C.ink2 });
      cross(ctx, 230, y + 280, 70, C.bad);
      const us = pop(b, l, "server");
      if (us > 0) { ctx.save(); ctx.translate(700, y + 230); ctx.scale(us, us); server(ctx, 0, 0, 260); ctx.restore(); }
      const uc = ph(b, l, "salinan", 0.6);
      if (uc > 0) { ctx.save(); ctx.globalAlpha = uc; ctx.translate(700, y + 230); card(ctx, -90, -70, 180, 140, { fill: C.ink, r: 12, glow: "rgba(255,210,63,0.5)" }); photo(ctx, -82, -62, 164, 124); ctx.restore();
        text(ctx, "salinan masih ada", 700, y + 450, 36, { align: "center", weight: 900, color: C.kuning }); }
      const ut = pop(b, l, "sementara"), ty = y + 580;
      if (ut > 0 && ty + 50 < A.bot) { ctx.save(); ctx.translate(480, ty); ctx.scale(ut, ut); pill(ctx, "untuk sementara waktu", 0, 0, 46, { fill: C.panel2, color: C.ink }); ctx.restore(); }
      const by = ty + 60; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: "wow", t });
    },

    // pikir dulu: kalender maju lima tahun
    t29_pikir(ctx, b, l, t, TL, A) {
      const cx = 480, y = A.y + 40, k = clamp(cue(b, l, "lima tahun") / 1.2, 0, 1), year = 2026 + Math.round(5 * ease(k));
      card(ctx, cx - 210, y, 420, 360, { fill: "#F4F6FF", r: 30 });
      card(ctx, cx - 210, y, 420, 110, { fill: C.pink, r: 30 }); ctx.fillStyle = C.pink; ctx.fillRect(cx - 210, y + 70, 420, 40);
      text(ctx, "TAHUN", cx, y + 78, 48, { align: "center", weight: 900, color: C.ink });
      text(ctx, String(year), cx, y + 280, 140, { align: "center", weight: 900, color: C.bg });
      if (k > 0) text(ctx, "+" + Math.round(5 * ease(k)) + " tahun", cx, y + 430, 50, { align: "center", weight: 900, color: C.kuning });
      const ub = pop(b, l, "apakah");
      if (ub > 0) { ctx.save(); ctx.globalAlpha = clamp(ub, 0, 1); T.helpers.bubble(ctx, "Aku masih nyaman kalau ini dilihat?", 120, y + 640, 720, 44, { em: ["nyaman"], tailX: 480 }); ctx.restore(); }
      const by = y + 680; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2 + 10, Math.min(220, A.bot - by - 10), { mood: "think", t });
      const up = pop(b, l, "pikir dulu");
      if (up > 0 && ub <= 0) { ctx.save(); ctx.translate(480, y + 520); ctx.scale(up, up); pill(ctx, "Pikir dulu sebelum upload", 0, 0, 44, { fill: C.kuning }); ctx.restore(); }
    }
  });
})();
