/* T13 Bagaimana beranda rekomendasi memilih video untukmu — adegan khusus. Video, akun, dan skor rekaan; aplikasi generik. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;

  function cat(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = col || "#FF9F43";
    ctx.beginPath(); ctx.moveTo(-s * 0.42, -s * 0.05); ctx.lineTo(-s * 0.36, -s * 0.48); ctx.lineTo(-s * 0.1, -s * 0.3); ctx.lineTo(s * 0.1, -s * 0.3); ctx.lineTo(s * 0.36, -s * 0.48); ctx.lineTo(s * 0.42, -s * 0.05); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.44, s * 0.36, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(-s * 0.15, -s * 0.04, s * 0.06, 0, Math.PI * 2); ctx.arc(s * 0.15, -s * 0.04, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.moveTo(-s * 0.05, s * 0.08); ctx.lineTo(s * 0.05, s * 0.08); ctx.lineTo(0, s * 0.14); ctx.fill();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = s * 0.02; ctx.beginPath(); ctx.moveTo(s * 0.12, s * 0.12); ctx.lineTo(s * 0.4, s * 0.08); ctx.moveTo(s * 0.12, s * 0.16); ctx.lineTo(s * 0.4, s * 0.2); ctx.moveTo(-s * 0.12, s * 0.12); ctx.lineTo(-s * 0.4, s * 0.08); ctx.moveTo(-s * 0.12, s * 0.16); ctx.lineTo(-s * 0.4, s * 0.2); ctx.stroke();
    ctx.restore();
  }
  function icon(ctx, kind, x, y, s) {
    if (kind === "kucing") return cat(ctx, x, y, s);
    ctx.save(); ctx.translate(x, y);
    if (kind === "bola") { ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(0, 0, s * 0.36, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bg; ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 - Math.PI / 2; ctx.lineTo(Math.cos(a) * s * 0.13, Math.sin(a) * s * 0.13); } ctx.fill(); }
    else if (kind === "masak") { ctx.fillStyle = "#C7CEEF"; rr(ctx, -s * 0.35, -s * 0.1, s * 0.7, s * 0.34, s * 0.06); ctx.fill(); ctx.fillRect(-s * 0.46, -s * 0.06, s * 0.12, s * 0.06); ctx.fillRect(s * 0.34, -s * 0.06, s * 0.12, s * 0.06); ctx.strokeStyle = "#FFF"; ctx.lineWidth = s * 0.04; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.15, -s * 0.18); ctx.quadraticCurveTo(i * s * 0.15 + s * 0.06, -s * 0.28, i * s * 0.15, -s * 0.38); ctx.stroke(); } }
    else if (kind === "gitar") { ctx.fillStyle = "#C9783B"; ctx.beginPath(); ctx.arc(0, s * 0.12, s * 0.2, 0, Math.PI * 2); ctx.arc(0, -s * 0.06, s * 0.14, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#5A3B28"; ctx.fillRect(-s * 0.03, -s * 0.45, s * 0.06, s * 0.4); }
    else { ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(-s * 0.12, s * 0.16, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#FFF"; ctx.lineWidth = s * 0.06; ctx.beginPath(); ctx.moveTo(-s * 0.03, s * 0.16); ctx.lineTo(-s * 0.03, -s * 0.26); ctx.lineTo(s * 0.2, -s * 0.18); ctx.stroke(); }
    ctx.restore();
  }
  const BG = { kucing: "#3A2A5E", bola: "#1E5B3A", masak: "#5E2A3A", gitar: "#2A3E5E", musik: "#4A2A5E" };
  function thumb(ctx, kind, x, y, w, h, opt = {}) {
    card(ctx, x, y, w, h, { fill: BG[kind], r: 18, stroke: opt.stroke, lw: 5 });
    icon(ctx, kind, x + w / 2, y + h * 0.48, Math.min(w, h) * 0.6);
    if (opt.label) text(ctx, opt.label, x + 14, y + h - 16, Math.min(28, w * 0.13), { weight: 800, color: C.ink, fit: w - 28 });
  }
  function phone(ctx, x, y, w, h) { card(ctx, x, y, w, h, { fill: "#0A0D24", stroke: "#4A55A8", lw: 7, r: w * 0.12 }); ctx.fillStyle = "#4A55A8"; rr(ctx, x + w / 2 - 30, y + 14, 60, 10, 5); ctx.fill(); }
  function heart(ctx, x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col || C.pink; ctx.beginPath(); ctx.moveTo(0, s * 0.35); ctx.bezierCurveTo(-s * 0.6, -s * 0.05, -s * 0.3, -s * 0.5, 0, -s * 0.18); ctx.bezierCurveTo(s * 0.3, -s * 0.5, s * 0.6, -s * 0.05, 0, s * 0.35); ctx.fill(); ctx.restore(); }

  Object.assign(T.SCENES, {
    // di bawah kait: beranda campur-campur berubah jadi penuh kucing
    t13_feed(ctx, b, l, t, TL, A) {
      const kinds = ["bola", "masak", "gitar", "musik", "bola", "masak"], flip = cue(b, l, "penuh");
      const cw = 230, ch = Math.min(200, (A.h - 40) / 2 - 10), x0 = A.x + 30, y0 = A.y + 10;
      kinds.forEach((k, i) => {
        const c = i % 3, r = Math.floor(i / 3), x = x0 + c * (cw + 20), y = y0 + r * (ch + 20);
        const f = clamp((flip - i * 0.12) / 0.3, 0, 1), sx = Math.abs(1 - 2 * f);
        const watched = (i === 1 || i === 3) && cue(b, l, "dua video") > 0 && f <= 0;
        ctx.save(); ctx.translate(x + cw / 2, y); ctx.scale(sx, 1); ctx.translate(-x - cw / 2, -y);
        thumb(ctx, f > 0.5 ? "kucing" : (watched ? "kucing" : k), x, y, cw, ch, { stroke: watched ? C.kuning : null }); ctx.restore();
      });
      const uq = pop(b, l, "tahu");
      if (uq > 0) { ctx.save(); ctx.translate(820, y0 + ch); ctx.scale(uq, uq); bip(ctx, 0, 0, 130, { mood: "wow", t }); ctx.restore(); }
    },
    // sinyal kecil yang dicatat saat menonton
    t13_sinyal(ctx, b, l, t, TL, A) {
      const px = A.x + 10, py = A.y + 20, pw = 360, phh = Math.min(640, A.h - 60);
      phone(ctx, px, py, pw, phh);
      thumb(ctx, "kucing", px + 25, py + 50, pw - 50, phh - 100);
      // garis kemajuan video
      const prog = (l * 0.35) % 1; card(ctx, px + 25, py + phh - 70, pw - 50, 12, { fill: "rgba(255,255,255,0.25)", r: 6 }); card(ctx, px + 25, py + phh - 70, (pw - 50) * prog, 12, { fill: C.pink, r: 6 });
      const sig = [["berapa lama", "Ditonton 15 detik", C.tosca, "jam"], ["mengulang", "Diulang 2 kali", C.biru, "ulang"], ["menyukai", "Disukai", C.pink, "suka"], ["menggeser", "Digeser? Tidak", C.kuning, "geser"]];
      text(ctx, "Catatan sinyal", A.x + 420, py + 40, 42, { weight: 900, color: C.kuning });
      sig.forEach(([w, s, col, ic], i) => {
        const u = pop(b, l, w); if (u <= 0) return;
        const y = py + 80 + i * 140;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * 60, 0);
        card(ctx, A.x + 410, y, 410, 116, { fill: C.panel, stroke: col, lw: 4, r: 22 });
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(A.x + 465, y + 58, 34, 0, Math.PI * 2); ctx.fill();
        if (ic === "suka") heart(ctx, A.x + 465, y + 58, 40, C.bg);
        else if (ic === "jam") { ctx.strokeStyle = C.bg; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(A.x + 465, y + 58, 18, 0, Math.PI * 2); ctx.moveTo(A.x + 465, y + 58); ctx.lineTo(A.x + 465, y + 46); ctx.stroke(); }
        else if (ic === "ulang") { ctx.strokeStyle = C.bg; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(A.x + 465, y + 58, 17, 0.4, Math.PI * 1.8); ctx.stroke(); }
        else arrow(ctx, A.x + 465, y + 76, A.x + 465, y + 38, C.bg, 6, 16);
        text(ctx, s, A.x + 515, y + 72, 36, { weight: 800, color: C.ink, fit: 290 });
        ctx.restore();
      });
      // jari menggeser ke atas pada "menggeser"
      const g = cue(b, l, "menggeser");
      if (g > 0 && g < 1.2) { const k = ease(g / 0.6); ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(px + pw / 2, lerp(py + phh - 160, py + 200, k), 28, 0, Math.PI * 2); ctx.fill(); }
    },
    // setiap video diberi skor peluang ditonton sampai habis
    t13_skor(ctx, b, l, t, TL, A) {
      const V = [["kucing", "Kucing lompat", 92], ["masak", "Resep bakso", 41], ["bola", "Gol keren", 35], ["kucing", "Kucing tidur", 88]];
      text(ctx, "Peluang ditonton sampai habis", A.x, A.y + 56, 42, { weight: 900, color: C.kuning, fit: 820 });
      const rh = Math.min(190, (A.h - 120) / 4 - 16), go = cue(b, l, "skor");
      V.forEach(([k, name, s], i) => {
        const u = pop(b, l, 0.05 + i * 0.06); if (u <= 0) return;
        const y = A.y + 100 + i * (rh + 16);
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        card(ctx, A.x, y, 820, rh, { fill: C.panel, stroke: C.line, lw: 3, r: 22 });
        thumb(ctx, k, A.x + 16, y + 14, rh * 1.1, rh - 28);
        text(ctx, name, A.x + rh * 1.1 + 40, y + rh * 0.4, 40, { weight: 800, color: C.ink, fit: 330 });
        const kk = clamp((go - i * 0.15) / 1.0, 0, 1), bw = 440;
        card(ctx, A.x + rh * 1.1 + 40, y + rh * 0.58, bw - 120, 30, { fill: C.bg2, r: 15 });
        if (kk > 0) card(ctx, A.x + rh * 1.1 + 40, y + rh * 0.58, (bw - 120) * s / 100 * ease(kk), 30, { fill: s > 80 ? C.good : s > 50 ? C.kuning : C.pink, r: 15 });
        if (kk > 0) text(ctx, Math.round(s * ease(kk)) + "%", A.x + 800, y + rh * 0.72, 48, { weight: 900, color: s > 80 ? C.good : C.ink2, align: "right" });
        ctx.restore();
      });
    },
    // skor tertinggi tampil duluan + rekomendasi dari pengguna berselera mirip
    t13_mirip(ctx, b, l, t, TL, A) {
      const top = A.y + 20, cw = 380, ch = 230;
      text(ctx, "Berandamu", A.x, top + 40, 44, { weight: 900, color: C.kuning });
      [["kucing", "92%"], ["kucing", "88%"]].forEach(([k, s], i) => {
        const u = pop(b, l, 0.05 + i * 0.08); if (u <= 0) return;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); thumb(ctx, k, A.x + i * (cw + 40), top + 70, cw, ch, { label: s, stroke: C.good }); ctx.restore();
      });
      // dua pengguna berselera mirip
      const um = ph(b, l, "orang", 0.4), y2 = top + ch + 210;
      if (um > 0) {
        ctx.save(); ctx.globalAlpha = um;
        const P = (x, col, name) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y2, 50, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(x, y2 - 10, 18, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(x, y2 + 40, 30, Math.PI, 0); ctx.fill(); text(ctx, name, x, y2 + 90, 32, { align: "center", weight: 800, color: col }); };
        P(A.x + 90, C.tosca, "Kamu"); P(A.x + 730, C.pink, "Akun lain");
        [0, 1, 2].forEach(i => { heart(ctx, A.x + 300 + i * 110, y2 - 20, 50, C.pink); cat(ctx, A.x + 300 + i * 110, y2 + 40, 60); });
        text(ctx, "selera mirip", 480, y2 - 80, 38, { align: "center", weight: 800, color: C.ink2 });
        ctx.restore();
      }
      const ur = pop(b, l, "selera mirip");
      if (ur > 0 && y2 + 130 + 200 < A.bot + 40) {
        const y3 = y2 + 130;
        arrow(ctx, A.x + 730, y2 + 110, A.x + 560, y3 + 60, C.pink, 8, 26);
        ctx.save(); ctx.translate(A.x + 360, y3 + 90); ctx.scale(ur, ur); thumb(ctx, "kucing", -170, -90, 340, 180, { label: "Kucing main piano", stroke: C.pink }); ctx.restore();
        text(ctx, "disarankan untukmu", A.x + 360, y3 + 220, 32, { align: "center", weight: 800, color: C.pink });
      }
    },
    // membuat beranda beragam: cari topik baru dan tandai "Tidak tertarik"
    t13_ragam(ctx, b, l, t, TL, A) {
      const cw = 250, ch = 190, x0 = A.x + 20, y0 = A.y + 140;
      const us = ph(b, l, "cari", 0.4), q = "cara main gitar", n = Math.floor(clamp(cue(b, l, "cari") / 0.9, 0, 1) * q.length);
      card(ctx, A.x + 20, A.y + 10, 780, 96, { fill: "#FFFFFF", r: 48 });
      text(ctx, n > 0 ? q.slice(0, n) : "Cari…", A.x + 80, A.y + 72, 42, { weight: 700, color: n > 0 ? C.bg : C.mute });
      const mix = ease(cue(b, l, "kamu suka") / 1.0), kinds = ["kucing", "kucing", "kucing", "kucing", "kucing", "kucing"], after = ["gitar", "kucing", "bola", "masak", "gitar", "kucing"];
      kinds.forEach((k, i) => {
        const c = i % 3, r = Math.floor(i / 3), x = x0 + c * (cw + 15), y = y0 + r * (ch + 20);
        const f = clamp((mix * 1.6 - i * 0.12), 0, 1), use = (us > 0 && i === 0) ? "gitar" : (f > 0.5 ? after[i] : k);
        thumb(ctx, use, x, y, cw, ch, { stroke: i === 4 && cue(b, l, "tidak tertarik") > 0 && f < 0.5 ? C.bad : null });
      });
      // menu "Tidak tertarik"
      const ut = pop(b, l, "tidak tertarik");
      if (ut > 0 && mix < 0.6) {
        const mx = x0 + cw + 15 + 40, my = y0 + ch + 20 + 110;
        ctx.save(); ctx.translate(mx, my); ctx.scale(ut, ut);
        card(ctx, 0, 0, 380, 110, { fill: "#FFFFFF", r: 22, glow: "rgba(0,0,0,0.5)" });
        cross(ctx, 50, 55, 40, C.bad); text(ctx, "Tidak tertarik", 90, 70, 40, { weight: 800, color: C.bg }); ctx.restore();
      }
      const ub = pop(b, l, "beragam");
      const by = y0 + 2 * (ch + 20) + 20;
      if (A.bot - by > 130) bip(ctx, 480, by + Math.min(90, (A.bot - by) / 2), Math.min(150, A.bot - by - 10), { mood: mix > 0.8 ? "happy" : "think", t });
    }
  });
})();
