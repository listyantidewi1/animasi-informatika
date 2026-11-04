/* T14 AI belajar dari contoh, bukan dari hafalan — adegan khusus. Foto hewan digambar dengan kode; persentase rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const OR = "#FF9F43", HITAM = "#2B2B36", ABU = "#9AA0B4", PUTIH = "#F2F2F2";

  function cat(ctx, x, y, s, col, opt = {}) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(-s * 0.42, -s * 0.05); ctx.lineTo(-s * 0.36, -s * 0.48); ctx.lineTo(-s * 0.1, -s * 0.3); ctx.lineTo(s * 0.1, -s * 0.3); ctx.lineTo(s * 0.36, -s * 0.48); ctx.lineTo(s * 0.42, -s * 0.05); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.44, s * 0.36, 0, 0, Math.PI * 2); ctx.fill();
    if (col === OR) { ctx.fillStyle = "#E07B1F"; for (let i = -1; i <= 1; i++) ctx.fillRect(i * s * 0.1 - s * 0.02, -s * 0.34, s * 0.04, s * 0.14); }
    ctx.fillStyle = col === HITAM ? "#FFD23F" : C.bg; ctx.beginPath(); ctx.arc(-s * 0.15, -s * 0.04, s * 0.06, 0, Math.PI * 2); ctx.arc(s * 0.15, -s * 0.04, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.moveTo(-s * 0.05, s * 0.08); ctx.lineTo(s * 0.05, s * 0.08); ctx.lineTo(0, s * 0.14); ctx.fill();
    ctx.strokeStyle = col === PUTIH ? "#888" : "#FFFFFF"; ctx.lineWidth = s * 0.02; ctx.beginPath();
    for (const d of [-1, 1]) { ctx.moveTo(d * s * 0.12, s * 0.12); ctx.lineTo(d * s * 0.42, s * 0.07); ctx.moveTo(d * s * 0.12, s * 0.16); ctx.lineTo(d * s * 0.42, s * 0.21); }
    ctx.stroke();
    if (opt.ears) { ctx.strokeStyle = C.kuning; ctx.lineWidth = s * 0.04; ctx.globalAlpha = opt.ears; for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * s * 0.44, -s * 0.02); ctx.lineTo(d * s * 0.37, -s * 0.54); ctx.lineTo(d * s * 0.06, -s * 0.33); ctx.stroke(); } ctx.globalAlpha = 1; }
    if (opt.whisk) { ctx.strokeStyle = C.tosca; ctx.lineWidth = s * 0.035; ctx.globalAlpha = opt.whisk; ctx.beginPath(); for (const d of [-1, 1]) { ctx.moveTo(d * s * 0.12, s * 0.12); ctx.lineTo(d * s * 0.46, s * 0.06); ctx.moveTo(d * s * 0.12, s * 0.16); ctx.lineTo(d * s * 0.46, s * 0.22); } ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.restore();
  }
  function dog(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#B07A4A"; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.38, s * 0.36, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#7A4F2A"; ctx.beginPath(); ctx.ellipse(-s * 0.38, s * 0.02, s * 0.12, s * 0.28, 0.3, 0, Math.PI * 2); ctx.ellipse(s * 0.38, s * 0.02, s * 0.12, s * 0.28, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#F2D9B8"; ctx.beginPath(); ctx.ellipse(0, s * 0.14, s * 0.18, s * 0.13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(-s * 0.13, -s * 0.06, s * 0.05, 0, Math.PI * 2); ctx.arc(s * 0.13, -s * 0.06, s * 0.05, 0, Math.PI * 2); ctx.arc(0, s * 0.09, s * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function rabbit(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#EDEDF5"; ctx.beginPath(); ctx.ellipse(-s * 0.12, -s * 0.38, s * 0.08, s * 0.24, -0.15, 0, Math.PI * 2); ctx.ellipse(s * 0.12, -s * 0.38, s * 0.08, s * 0.24, 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s * 0.05, s * 0.3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(-s * 0.1, 0, s * 0.04, 0, Math.PI * 2); ctx.arc(s * 0.1, 0, s * 0.04, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(0, s * 0.1, s * 0.04, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function mug(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.biru; rr(ctx, -s * 0.25, -s * 0.25, s * 0.45, s * 0.5, s * 0.06); ctx.fill(); ctx.strokeStyle = C.biru; ctx.lineWidth = s * 0.07; ctx.beginPath(); ctx.arc(s * 0.22, 0, s * 0.12, -1.3, 1.3); ctx.stroke(); ctx.restore(); }
  function draw(ctx, k, x, y, s, opt) { if (k === "dog") dog(ctx, x, y, s); else if (k === "rabbit") rabbit(ctx, x, y, s); else if (k === "mug") mug(ctx, x, y, s); else cat(ctx, x, y, s, k, opt || {}); }
  // kartu foto dengan label opsional
  function photo(ctx, k, x, y, w, h, label, ok) {
    card(ctx, x, y, w, h, { fill: "#2A3170", r: 18, stroke: label ? (ok ? C.good : C.bad) : C.line, lw: 4 });
    draw(ctx, k, x + w / 2, y + h * (label ? 0.44 : 0.52), Math.min(w, h) * 0.62);
    if (label) { card(ctx, x + 8, y + h - 46, w - 16, 38, { fill: ok ? C.good : C.bad, r: 12 }); text(ctx, label, x + w / 2, y + h - 18, 24, { align: "center", weight: 900, color: ok ? C.bg : C.ink, fit: w - 26 }); }
  }
  // "otak" AI sederhana: jaringan titik
  function brain(ctx, x, y, s, t, act) {
    const L = [3, 4, 2], pts = L.map((n, i) => Array.from({ length: n }, (_, j) => [x + (i - 1) * s * 0.45, y + (j - (n - 1) / 2) * s * 0.28]));
    ctx.save(); ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) for (const a of pts[i]) for (const c of pts[i + 1]) { ctx.strokeStyle = `rgba(77,163,255,${0.2 + 0.5 * (act || 0) * (0.5 + 0.5 * Math.sin(t * 6 + a[1] * 0.05 + c[1] * 0.03))})`; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); }
    pts.flat().forEach((p, i) => { ctx.fillStyle = (act && Math.sin(t * 5 + i) > 0) ? C.kuning : C.biru; ctx.beginPath(); ctx.arc(p[0], p[1], s * 0.06, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
    text(ctx, "AI", x, y - s * 0.62, s * 0.22, { align: "center", weight: 900, color: C.ink });
  }

  Object.assign(T.SCENES, {
    // di bawah kait: buku "Aturan kucing" dicoret, AI melihat foto kucing
    t14_aturan(ctx, b, l, t, TL, A) {
      const y = A.y + 10, h = Math.min(400, A.h - 20);
      card(ctx, A.x + 30, y, 330, h, { fill: "#F4EFE1", r: 18 });
      text(ctx, "Aturan kucing", A.x + 195, y + 60, 36, { align: "center", weight: 900, color: C.bg });
      for (let i = 0; i < 5; i++) { ctx.fillStyle = "rgba(11,14,42,0.25)"; rr(ctx, A.x + 60, y + 100 + i * 50, 270 - (i % 2) * 60, 16, 8); ctx.fill(); }
      const ux = pop(b, l, "tidak ada");
      if (ux > 0) { ctx.save(); ctx.translate(A.x + 195, y + h / 2); ctx.scale(ux, ux); cross(ctx, 0, 0, 260, C.bad); ctx.restore(); }
      photo(ctx, OR, A.x + 470, y, 320, Math.min(260, h - 120));
      const uq = pop(b, l, "bagaimana");
      if (uq > 0) { ctx.save(); ctx.translate(A.x + 630, y + Math.min(260, h - 120) + 70); ctx.scale(uq, uq); bip(ctx, 0, 0, 110, { mood: "think", t }); text(ctx, "?", 80, -20, 80, { weight: 900, color: C.kuning }); ctx.restore(); }
    },
    // ribuan foto berlabel jatuh ke kumpulan data
    t14_label(ctx, b, l, t, TL, A) {
      const set = [[OR, "kucing", 1], ["dog", "bukan kucing", 0], [OR, "kucing", 1], ["mug", "bukan kucing", 0], [OR, "kucing", 1], ["rabbit", "bukan kucing", 0], [OR, "kucing", 1], ["dog", "bukan kucing", 0], [OR, "kucing", 1]];
      const w = 250, h = 230, g = 20, x0 = A.x + 15, y0 = A.y + 30;
      set.forEach(([k, lab, ok], i) => {
        const u = pop(b, l, 0.04 + i * 0.07); if (u <= 0) return;
        const c = i % 3, r = Math.floor(i / 3), x = x0 + c * (w + g), y = y0 + r * (h + g);
        if (y + h > A.bot - 80) return;
        const lu = ph(b, l, i % 2 ? "bukan kucing" : "ini kucing", 0.3);
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate(0, (1 - clamp(u, 0, 1)) * -80);
        photo(ctx, k, x, y, w, h, lu > 0 || l > 2.5 ? lab : null, ok); ctx.restore();
      });
      const un = pop(b, l, "ribuan"), yb = A.bot - 60;
      if (un > 0) { ctx.save(); ctx.translate(480, yb); ctx.scale(un, un); pill(ctx, "+ ribuan foto lainnya", 0, 0, 40, { fill: C.kuning }); ctx.restore(); }
    },
    // AI mencari pola: telinga runcing dan kumis menyala
    t14_pola(ctx, b, l, t, TL, A) {
      const ue = ph(b, l, "telinga", 0.4), uw = ph(b, l, "kumis", 0.4), up = ph(b, l, "pola", 0.4);
      brain(ctx, A.x + 160, A.y + 260, 300, t, up);
      // aliran foto contoh masuk ke "otak"
      for (let i = 0; i < 4; i++) { const s = (l * 0.6 + i / 4) % 1; ctx.save(); ctx.globalAlpha = 0.8 * (1 - s); photo(ctx, i % 2 ? OR : "dog", lerp(A.x - 40, A.x + 60, s), A.y + 520 - s * 200, 120, 110); ctx.restore(); }
      arrow(ctx, A.x + 340, A.y + 260, A.x + 410, A.y + 260, C.kuning, 10, 30);
      card(ctx, A.x + 430, A.y + 40, 390, 440, { fill: "#2A3170", r: 24, stroke: C.line, lw: 4 });
      cat(ctx, A.x + 625, A.y + 280, 320, OR, { ears: ue, whisk: uw });
      const chips = [["telinga runcing", ue, C.kuning], ["kumis", uw, C.tosca]];
      chips.forEach(([s, u, col], i) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; ctx.translate(A.x + 625, A.y + 560 + i * 100); pill(ctx, s, 0, 0, 44, { fill: col }); ctx.restore(); });
      if (up > 0) { ctx.save(); ctx.globalAlpha = up; text(ctx, "pola yang ditemukan:", A.x + 625, A.y + 505, 34, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); }
    },
    // uji dengan foto baru: tebakan tepat
    t14_uji(ctx, b, l, t, TL, A) {
      brain(ctx, 480, A.y + 170, 260, t, 1);
      const tests = [[OR, "kucing", 96, 1], ["rabbit", "bukan kucing", 91, 0]];
      tests.forEach(([k, lab, p, isCat], i) => {
        const u = pop(b, l, i ? "belum pernah" : "foto baru"); if (u <= 0) return;
        const x = A.x + 20 + i * 430, y = A.y + 380;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); photo(ctx, k, x, y, 370, 300); ctx.restore();
        const ur = pop(b, l, "tebakannya", 0.4 + i * 0.3);
        if (ur > 0) {
          ctx.save(); ctx.translate(x + 185, y + 380); ctx.scale(ur, ur);
          card(ctx, -185, -55, 370, 110, { fill: C.goodBg, stroke: C.good, lw: 5, r: 24 });
          text(ctx, lab + " " + p + "%", -10, 14, 38, { align: "center", weight: 900, color: C.ink, fit: 280 });
          check(ctx, 145, 0, 50, C.good); ctx.restore();
        }
      });
      if (pop(b, l, "foto baru") > 0) text(ctx, "belum pernah dilihat", 480, A.y + 360, 36, { align: "center", weight: 800, color: C.kuning });
    },
    // contoh tidak beragam: hanya kucing oranye, kucing hitam salah ditebak
    t14_bias(ctx, b, l, t, TL, A) {
      text(ctx, "Contoh yang dipelajari:", A.x, A.y + 50, 40, { weight: 800, color: C.ink2 });
      for (let i = 0; i < 5; i++) { const u = pop(b, l, 0.03 + i * 0.05); if (u <= 0) continue; ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); photo(ctx, OR, A.x + i * 165, A.y + 80, 150, 140); ctx.restore(); }
      const uo = pop(b, l, "oranye");
      if (uo > 0) { ctx.save(); ctx.translate(480, A.y + 270); ctx.scale(uo, uo); pill(ctx, "semuanya kucing oranye", 0, 0, 40, { fill: OR, color: C.bg }); ctx.restore(); }
      const uh = pop(b, l, "kucing hitam"), y = A.y + 360;
      if (uh > 0 || cue(b, l, "gagal") > 0) {
        const u = Math.max(uh, pop(b, l, "gagal"));
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); photo(ctx, HITAM, A.x + 230, y, 360, 300); ctx.restore();
        const ur = pop(b, l, "kucing hitam", 0.5);
        if (ur > 0) { ctx.save(); ctx.translate(480, y + 380); ctx.scale(ur, ur);
          card(ctx, -280, -60, 560, 120, { fill: C.badBg, stroke: C.bad, lw: 5, r: 26 });
          text(ctx, "bukan kucing 78%", -20, 16, 44, { align: "center", weight: 900, color: C.ink, fit: 440 }); cross(ctx, 220, 0, 56, C.bad); ctx.restore(); }
      }
      if (A.bot - (y + 460) > 120) bip(ctx, 480, A.bot - 70, 120, { mood: cue(b, l, "kucing hitam") > 0.5 ? "sad" : "think", t });
    },
    // contoh yang beragam membuat AI lebih tepat
    t14_ragam(ctx, b, l, t, TL, A) {
      const cols = [OR, HITAM, ABU, PUTIH, OR, HITAM];
      text(ctx, "Contoh yang beragam", A.x, A.y + 56, 50, { weight: 900, color: C.kuning });
      cols.forEach((c, i) => {
        const u = pop(b, l, 0.04 + i * 0.07); if (u <= 0) return;
        const x = A.x + (i % 3) * 280, y = A.y + 100 + Math.floor(i / 3) * 280;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); photo(ctx, c, x, y, 260, 260, "kucing", 1); ctx.restore();
      });
      const ua = pop(b, l, "sebaik contoh"), y2 = A.y + 680;
      if (ua > 0 && A.bot - y2 > 120) { ctx.save(); ctx.translate(480, y2 + 60); ctx.scale(ua, ua);
        card(ctx, -400, -70, 800, 140, { fill: C.goodBg, stroke: C.good, lw: 6, r: 30 });
        text(ctx, "contoh beragam = AI lebih tepat", 0, 18, 44, { align: "center", weight: 900, color: C.ink, fit: 740 }); ctx.restore(); }
    }
  });
})();
