/* T10 Iklan yang seolah membaca pikiranmu — adegan khusus. Toko, akun, dan iklan rekaan; aplikasi generik. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, bubble, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;

  function shoe(ctx, x, y, s, col) {           // sepatu sederhana
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = col || C.pink;
    ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.15); ctx.lineTo(-s * 0.5, -s * 0.25); ctx.quadraticCurveTo(-s * 0.3, -s * 0.3, -s * 0.15, -s * 0.12);
    ctx.quadraticCurveTo(s * 0.2, -s * 0.05, s * 0.45, s * 0.02); ctx.quadraticCurveTo(s * 0.55, s * 0.1, s * 0.5, s * 0.15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-s * 0.5, s * 0.12, s * 1.0, s * 0.1);
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = s * 0.03; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.22 + i * s * 0.08, -s * 0.14 + i * s * 0.02); ctx.lineTo(-s * 0.12 + i * s * 0.08, -s * 0.2 + i * s * 0.03); ctx.stroke(); }
    ctx.restore();
  }
  function ball(ctx, x, y, s) { ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(x, y, s / 2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bg; ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 - Math.PI / 2; ctx.lineTo(x + Math.cos(a) * s * 0.18, y + Math.sin(a) * s * 0.18); } ctx.fill(); }
  function bowl(ctx, x, y, s) { ctx.fillStyle = "#D9A066"; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(x + i * s * 0.18, y - s * 0.08, s * 0.14, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = C.biru; ctx.beginPath(); ctx.moveTo(x - s * 0.45, y - s * 0.05); ctx.lineTo(x + s * 0.45, y - s * 0.05); ctx.quadraticCurveTo(x + s * 0.4, y + s * 0.35, x, y + s * 0.35); ctx.quadraticCurveTo(x - s * 0.4, y + s * 0.35, x - s * 0.45, y - s * 0.05); ctx.fill(); }
  function guitar(ctx, x, y, s) { ctx.fillStyle = "#C9783B"; ctx.beginPath(); ctx.arc(x, y + s * 0.15, s * 0.22, 0, Math.PI * 2); ctx.arc(x, y - s * 0.08, s * 0.16, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#5A3B28"; ctx.fillRect(x - s * 0.03, y - s * 0.5, s * 0.06, s * 0.45); ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(x, y + s * 0.08, s * 0.06, 0, Math.PI * 2); ctx.fill(); }
  function adCard(ctx, x, y, w, h, kind) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", r: 16 });
    pill(ctx, "Iklan", x + 52, y + 26, 18, { fill: C.kuning });
    if (kind === "sepatu") shoe(ctx, x + w / 2, y + h * 0.55, Math.min(w, h) * 0.6, C.pink);
    else if (kind === "bakso") bowl(ctx, x + w / 2, y + h * 0.55, Math.min(w, h) * 0.6);
    else guitar(ctx, x + w / 2, y + h * 0.58, Math.min(w, h) * 0.7);
  }
  function foot(ctx, x, y, s, ang, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.22, s * 0.36, 0, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s * 0.15 + i * s * 0.1, -s * 0.46 + Math.abs(i - 1.5) * s * 0.04, s * 0.06, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function phone(ctx, x, y, w, h) { card(ctx, x, y, w, h, { fill: "#0A0D24", stroke: "#4A55A8", lw: 7, r: w * 0.13 }); ctx.fillStyle = "#4A55A8"; rr(ctx, x + w / 2 - 30, y + 14, 60, 10, 5); ctx.fill(); }

  Object.assign(T.SCENES, {
    // di bawah kait: "sepatu" dicari, lalu iklan sepatu bermunculan di mana-mana
    t10_sepatu(ctx, b, l, t, TL, A) {
      const y = A.y + 10;
      card(ctx, A.x + 40, y, 560, 90, { fill: "#FFFFFF", r: 45 });
      const q = "sepatu lari", n = Math.min(q.length, Math.floor(l / 0.07));
      text(ctx, q.slice(0, n), A.x + 90, y + 60, 44, { weight: 700, color: C.bg });
      const spots = [[150, 0.25], [400, 0.4], [650, 0.55], [270, 0.7], [530, 0.82]];
      spots.forEach(([x, f], i) => {
        const u = pop(b, l, f); if (u <= 0) return;
        const yy = y + 140 + (i % 2) * Math.min(170, (A.h - 300) / 2), s = Math.min(170, A.h * 0.32);
        ctx.save(); ctx.translate(x, yy + s / 2); ctx.scale(u, u); ctx.rotate((rnd(i) - 0.5) * 0.2); adCard(ctx, -s / 2, -s / 2, s, s, "sepatu"); ctx.restore();
      });
      bip(ctx, 800, y + 60, 130, { mood: cue(b, l, "pikiran") > 0 ? "wow" : "think", t });
      const uq = pop(b, l, "pikiran");
      if (uq > 0) { ctx.save(); ctx.translate(800, A.bot - 70); ctx.scale(uq, uq); text(ctx, "?!", 0, 40, 130, { align: "center", weight: 900, color: C.kuning, shadow: true }); ctx.restore(); }
    },
    // jejak kaki: cari, tonton, sukai -> tiap jejak menjadi catatan
    t10_jejak(ctx, b, l, t, TL, A) {
      const items = [["cari", "Mencari: “sepatu lari”", C.pink], ["tonton", "Menonton: video bola 3 menit", C.tosca], ["sukai", "Menyukai: foto bakso", C.kuning]];
      const n = Math.floor(l / 0.22);
      for (let i = 0; i < Math.min(n, 14); i++) {
        const x = A.x + 60 + i * 55, y = A.bot - 80 - (i % 2) * 50 - i * 6;
        foot(ctx, x, y, 70, 1.35, "rgba(184,192,238,0.35)");
      }
      text(ctx, "Catatan aplikasi", A.x, A.y + 60, 52, { weight: 900, color: C.kuning });
      items.forEach(([w, s, col], i) => {
        const u = pop(b, l, w); if (u <= 0) return;
        const y = A.y + 110 + i * 170;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * -60, 0);
        card(ctx, A.x, y, 820, 140, { fill: C.panel, stroke: col, lw: 5, r: 24 });
        foot(ctx, A.x + 70, y + 70, 80, 0.2, col);
        text(ctx, s, A.x + 140, y + 86, 42, { weight: 800, color: C.ink, fit: 650 });
        ctx.restore();
      });
      if (pop(b, l, "sukai") > 0) { const u = pop(b, l, "sukai", 0.5); ctx.save(); ctx.translate(480, A.y + 650); ctx.scale(u, u); pill(ctx, "+ jam, lokasi, lama menonton…", 0, 0, 34, { fill: C.panel2, color: C.ink2 }); ctx.restore(); }
    },
    // kartu profil minat dengan label yang muncul
    t10_profil(ctx, b, l, t, TL, A) {
      const h = Math.min(760, A.h - 30), y = A.y + 10;
      card(ctx, A.x, y, 820, h, { fill: C.panel, stroke: C.biru, lw: 5, r: 30 });
      ctx.fillStyle = C.panel2; ctx.beginPath(); ctx.arc(A.x + 110, y + 110, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.ink2; ctx.beginPath(); ctx.arc(A.x + 110, y + 90, 26, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(A.x + 110, y + 160, 44, Math.PI, 0); ctx.fill();
      text(ctx, "Profil minat", A.x + 210, y + 100, 52, { weight: 900, color: C.ink });
      text(ctx, "Pengguna #4821", A.x + 210, y + 148, 34, { weight: 700, color: C.ink2 });
      const tags = [["sepak bola", ball, C.tosca, 0.9], ["sepatu", null, C.pink, 0.8], ["bakso", bowl, C.kuning, 0.65]];
      tags.forEach(([w, fn, col, v], i) => {
        const u = pop(b, l, w); if (u <= 0) return;
        const yy = y + 230 + i * Math.min(170, (h - 260) / 3);
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * 60, 0);
        if (fn) fn(ctx, A.x + 90, yy + 40, 80); else shoe(ctx, A.x + 90, yy + 45, 90, C.pink);
        text(ctx, "suka " + w, A.x + 160, yy + 40, 44, { weight: 800, color: C.ink });
        card(ctx, A.x + 160, yy + 64, 600, 26, { fill: C.bg2, r: 13 });
        card(ctx, A.x + 160, yy + 64, 600 * v * ph(b, l, w, 0.8), 26, { fill: col, r: 13 });
        ctx.restore();
      });
    },
    // tempat iklan kosong diisi iklan yang paling cocok dengan profil
    t10_pilih(ctx, b, l, t, TL, A) {
      const px = A.x + 20, py = A.y + 20, pw = 340, phh = Math.min(640, A.h - 60);
      phone(ctx, px, py, pw, phh);
      for (let i = 0; i < 3; i++) { ctx.fillStyle = "rgba(184,192,238,0.25)"; rr(ctx, px + 30, py + 60 + i * 50, pw - 60 - i * 40, 24, 12); ctx.fill(); }
      const sy = py + 240, sh = 220, go = cue(b, l, "dipilih"), win = ease(go / 0.6);
      ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = win > 0 ? "rgba(0,0,0,0)" : C.kuning; ctx.lineWidth = 5; rr(ctx, px + 30, sy, pw - 60, sh, 18); ctx.stroke(); ctx.restore();
      if (win <= 0) text(ctx, "tempat iklan", px + pw / 2, sy + sh / 2 + 12, 34, { align: "center", weight: 800, color: C.kuning });
      const ads = [["sepatu", "Toko Sepatu", 92], ["gitar", "Les Gitar", 18], ["bakso", "Warung Bakso", 64]];
      ads.forEach(([k, name, m], i) => {
        const u = pop(b, l, 0.25 + i * 0.08); if (u <= 0) return;
        const x0 = A.x + 410, y0 = A.y + 30 + i * 200, best = i === 0;
        let x = x0, y = y0, s = 1;
        if (best && win > 0) { x = lerp(x0, px + 30, win); y = lerp(y0, sy, win); s = lerp(1, (pw - 60) / 410, win); }
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1) * (!best && win > 0 ? 1 - 0.6 * win : 1); ctx.translate(x, y); ctx.scale(s, s);
        card(ctx, 0, 0, 410, 170, { fill: C.panel, stroke: best && cue(b, l, "paling cocok") > 0 ? C.good : C.line, lw: 5, r: 22 });
        if (k === "sepatu") shoe(ctx, 75, 95, 110, C.pink); else if (k === "bakso") bowl(ctx, 75, 90, 110); else guitar(ctx, 75, 95, 120);
        text(ctx, name, 150, 70, 38, { weight: 800, color: C.ink, fit: 250 });
        text(ctx, "cocok " + m + "%", 150, 125, 36, { weight: 900, color: m > 80 ? C.good : m > 50 ? C.kuning : C.mute });
        ctx.restore();
      });
      const ut = pop(b, l, "sepersekian");
      if (ut > 0) { ctx.save(); ctx.translate(A.x + 620, A.y + 720); ctx.scale(ut, ut); pill(ctx, "±0,1 detik", 0, 0, 56, { fill: C.kuning }); ctx.restore(); }
    },
    // pengaturan HP generik: matikan iklan yang dipersonalisasi, hapus riwayat
    t10_atur(ctx, b, l, t, TL, A) {
      const px = A.x + 60, py = A.y + 10, pw = 700, phh = Math.min(820, A.h - 20);
      phone(ctx, px, py, pw, phh);
      text(ctx, "‹  Pengaturan  ›  Iklan", px + 50, py + 100, 40, { weight: 800, color: C.ink });
      const off = ease(cue(b, l, "mematikan") / 0.35), y1 = py + 170;
      card(ctx, px + 30, y1, pw - 60, 150, { fill: C.panel, r: 24 });
      text(ctx, "Iklan yang", px + 60, y1 + 65, 40, { weight: 800, color: C.ink });
      text(ctx, "dipersonalisasi", px + 60, y1 + 115, 40, { weight: 800, color: C.ink });
      const tx = px + pw - 190, ty = y1 + 45;
      card(ctx, tx, ty, 130, 64, { fill: off > 0.5 ? C.mute : C.good, r: 32 });
      ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(lerp(tx + 98, tx + 32, off), ty + 32, 26, 0, Math.PI * 2); ctx.fill();
      if (off > 0) text(ctx, off > 0.5 ? "MATI" : "", tx + 65, ty + 110, 30, { align: "center", weight: 900, color: C.ink2 });
      const y2 = y1 + 200, del = cue(b, l, "menghapus riwayat");
      card(ctx, px + 30, y2, pw - 60, 130, { fill: del > 0.3 ? C.badBg : C.panel, r: 24, stroke: del > 0 ? C.bad : null, lw: 4 });
      // ikon tempat sampah
      ctx.fillStyle = C.bad; rr(ctx, px + 70, y2 + 45, 50, 60, 8); ctx.fill(); ctx.fillRect(px + 60, y2 + 32, 70, 10); ctx.fillRect(px + 82, y2 + 22, 26, 12);
      text(ctx, "Hapus riwayat pencarian", px + 150, y2 + 80, 40, { weight: 800, color: C.ink, fit: pw - 210 });
      // jari mengetuk toggle lalu tombol hapus
      const f1 = cue(b, l, "mematikan"), tapX = del > -0.4 ? px + 350 : tx + 65, tapY = del > -0.4 ? y2 + 65 : ty + 32;
      if (f1 > -0.5) { const d = Math.max(0, Math.min(-f1, -del)); ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(tapX + 20, tapY + 20 + clamp(d, 0, 0.4) * 80, 26, 0, Math.PI * 2); ctx.fill(); }
      // riwayat yang terhapus
      const hist = ["sepatu lari", "video bola", "bakso enak"], y3 = y2 + 170;
      hist.forEach((s, i) => {
        const gone = clamp((del - 0.3 - i * 0.15) / 0.3, 0, 1); if (y3 + i * 80 + 60 > py + phh - 20) return;
        ctx.save(); ctx.globalAlpha = 1 - gone; ctx.translate(gone * 200, 0);
        card(ctx, px + 30, y3 + i * 80, pw - 60, 64, { fill: C.bg2, r: 16 });
        text(ctx, "↺  " + s, px + 60, y3 + i * 80 + 44, 34, { weight: 700, color: C.ink2 }); ctx.restore();
      });
    }
  });
})();
