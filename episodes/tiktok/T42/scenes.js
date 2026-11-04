/* T42 Pertanyaan yang jelas membuat AI menjawab lebih baik — adegan khusus. Aplikasi obrolan AI generik; pantun buatan sendiri. */
(function () {
  const T = TikTok, C = T.C, { rr, text, wrap, card, pill, arrow, check, cross, bip, bubble, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const PANTUN = ["Jalan-jalan ke kantin sekolah,", "beli cilok sambal kacang.", "Penonton jangan gelisah,", "pentas seni dimulai sekarang!"];

  // gelembung obrolan: kanan = pengguna (biru), kiri = AI (panel). Mengembalikan tinggi.
  function chat(ctx, s, right, y, size, u, opt = {}) {
    if (u <= 0) return 0;
    const lines = opt.lines || wrap(ctx, s, size, 700, 560), h = lines.length * size * 1.3 + 44;
    const w = Math.min(640, Math.max(...lines.map(ln => { T.helpers.font(ctx, size, 700); return ctx.measureText(ln).width; })) + 60);
    const x = right ? 880 - w : 80;
    ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate(0, (1 - clamp(u, 0, 1)) * 30);
    card(ctx, x, y, w, h, { fill: right ? C.biru : (opt.fill || C.panel2), stroke: right ? null : opt.stroke, lw: 4, r: 28 });
    lines.forEach((ln, i) => text(ctx, ln, x + 30, y + 22 + size + i * size * 1.3, size, { weight: 700, color: opt.color || C.ink }));
    ctx.restore(); return h;
  }
  function aiIcon(ctx, x, y, s) {
    ctx.fillStyle = C.tosca; ctx.beginPath(); ctx.arc(x, y, s / 2, 0, Math.PI * 2); ctx.fill();
    text(ctx, "AI", x, y + s * 0.17, s * 0.45, { align: "center", weight: 900, color: C.bg });
  }
  function header(ctx, A) {
    card(ctx, 70, A.y, 820, 90, { fill: C.panel, r: 24 }); aiIcon(ctx, 120, A.y + 45, 56);
    text(ctx, "Asisten AI", 165, A.y + 58, 36, { weight: 900, color: C.ink });
  }

  Object.assign(T.SCENES, {
    // kait: pertanyaan singkat, jawaban yang kurang pas
    t42_chat(ctx, b, l, t, TL, A) {
      let y = A.y + 10;
      y += chat(ctx, "buatkan pantun", true, y, 40, back(clamp((l - 0.1) / 0.4, 0, 1))) + 24;
      const ua = back(clamp((l - 0.8) / 0.4, 0, 1));
      const h = chat(ctx, "", false, y, 34, ua, { lines: ["Ada ikan di dalam kolam,", "ikan berenang ke sana kemari…"], color: C.ink2 });
      const u = pop(b, l, "kurang jelas");
      if (u > 0) { ctx.save(); ctx.translate(700, y + h + 60); ctx.rotate(-0.08); ctx.scale(u, u); pill(ctx, "Kurang pas…", 0, 0, 42, { fill: C.kuning }); ctx.restore(); }
      if (A.h > 520) bip(ctx, 250, Math.min(A.bot - 90, y + h + 120), Math.min(170, A.bot - y - h - 30), { mood: "think", t });
    },
    // AI harus menebak tema, jumlah, gaya
    t42_tebak(ctx, b, l, t, TL, A) {
      header(ctx, A);
      chat(ctx, "buatkan pantun", true, A.y + 130, 44, pop(b, l, 0));
      bip(ctx, 480, A.y + 560, 280, { mood: "think", t });
      const qs = [["Tema apa?", "tema", 230, A.y + 330, C.kuning], ["Berapa banyak?", "jumlah", 700, A.y + 330, C.pink], ["Gaya lucu atau sedih?", "gayanya", 480, A.y + 800, C.tosca]];
      qs.forEach(([s, c, x, y, col]) => {
        const u = pop(b, l, c); if (u <= 0) return;
        ctx.save(); ctx.translate(x, y + Math.sin(l * 3 + x) * 6); ctx.scale(u, u); pill(ctx, s, 0, 0, 40, { fill: col }); ctx.restore();
      });
      const um = pop(b, l, "menebak");
      if (um > 0) { ctx.save(); ctx.translate(650, A.y + 470); ctx.scale(um, um); text(ctx, "?", 0, 0, 120, { align: "center", weight: 900, color: C.kuning, shadow: true }); ctx.restore();
        ctx.save(); ctx.translate(310, A.y + 500); ctx.scale(um, um); text(ctx, "?", 0, 0, 90, { align: "center", weight: 900, color: C.pink, shadow: true }); ctx.restore(); }
    },
    // pertanyaan disusun dari bagian-bagian berwarna
    t42_baik(ctx, b, l, t, TL, A) {
      header(ctx, A);
      const parts = [["Tugas + bentuk", "buatkan dua pantun lucu", "buatkan", C.kuning], ["Tema", "tentang kantin sekolah", "tentang", C.pink], ["Tujuan", "untuk pembuka acara pentas seni", "untuk", C.tosca]];
      let y = A.y + 140;
      parts.forEach(([lab, s, c, col], i) => {
        const u = pop(b, l, c); if (u <= 0) { y += 190; return; }
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - clamp(u, 0, 1)) * 60, 0);
        text(ctx, lab, 90, y + 30, 32, { weight: 800, color: col });
        card(ctx, 80, y + 50, 800, 110, { fill: C.panel, stroke: col, lw: 6, r: 26 });
        text(ctx, s, 110, y + 122, 44, { weight: 800, color: C.ink, fit: 740 }); ctx.restore();
        y += 190;
      });
      const ud = ph(b, l, "seni", 0.5);
      if (ud > 0) { ctx.save(); ctx.globalAlpha = ud; arrow(ctx, 480, y + 10, 480, y + 80, C.ink2, 8, 26);
        card(ctx, 230, y + 90, 500, 100, { fill: C.biru, r: 50 }); text(ctx, "Kirim pertanyaan", 480, y + 152, 40, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
    },
    // jawaban yang pas, lalu minta perbaikan dan periksa isinya
    t42_ulang(ctx, b, l, t, TL, A) {
      header(ctx, A);
      let y = A.y + 120;
      const ua = pop(b, l, 0);
      if (ua > 0) {
        ctx.save(); ctx.globalAlpha = clamp(ua, 0, 1);
        card(ctx, 80, y, 680, 330, { fill: C.panel2, r: 28 });
        text(ctx, "Pantun 1", 110, y + 52, 30, { weight: 800, color: C.tosca });
        PANTUN.forEach((ln, i) => text(ctx, ln, 110, y + 110 + i * 54, 38, { weight: 700, color: C.ink, fit: 620 }));
        ctx.restore();
      }
      y += 360;
      const hb = chat(ctx, "Bagus! Baris ketiga dibuat lebih lucu, ya.", true, y, 38, pop(b, l, "sebutkan"));
      y += Math.max(hb, 120) + 40;
      const up = pop(b, l, "periksa");
      if (up > 0) { ctx.save(); ctx.translate(480, Math.min(y + 70, A.bot - 80)); ctx.scale(up, up);
        card(ctx, -330, -70, 660, 140, { fill: C.goodBg, stroke: C.good, lw: 6, r: 30 });
        ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(-250, 0, 44, 0, Math.PI * 2); ctx.fill(); check(ctx, -250, 0, 50, C.bg);
        text(ctx, "Periksa isinya", 30, 16, 50, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
    }
  });
})();
