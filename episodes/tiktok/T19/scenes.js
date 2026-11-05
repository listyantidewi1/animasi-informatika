/* T19 Link palsu yang mirip aslinya — adegan khusus. Nama toko, alamat situs, dan pesan semuanya rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, cross, bip, wrap, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const REAL = "belanjaria.example", FAKE = "beIanjaria.example";

  // teks berpotongan: pieces [{s, color}] digambar berurutan; mengembalikan posisi tiap potongan [{x, w}]
  function pieces(ctx, ps, x, y, size, weight = 800) {
    font(ctx, size, weight); const out = [];
    for (const p of ps) { const w = ctx.measureText(p.s).width; text(ctx, p.s, x, y, size, { weight, color: p.color || C.ink }); out.push({ x, w }); x += w; }
    return out;
  }
  function linkCard(ctx, s, x, y, w, h, opt = {}) {
    card(ctx, x, y, w, h, { fill: C.panel, stroke: opt.stroke || C.line, lw: 5, r: 26, glow: opt.glow });
    // ikon rantai sederhana
    ctx.save(); ctx.strokeStyle = C.biru; ctx.lineWidth = 8; ctx.translate(x + 60, y + h / 2); ctx.rotate(-0.6);
    rr(ctx, -30, -12, 34, 24, 12); ctx.stroke(); rr(ctx, -4, -12, 34, 24, 12); ctx.stroke(); ctx.restore();
    const size = opt.size || 60;
    text(ctx, s, x + 110, y + h / 2 + size * 0.36, size, { weight: 800, color: C.biru, fit: w - 140 });
    font(ctx, size, 800); const tw = Math.min(w - 140, ctx.measureText(s).width);
    ctx.fillStyle = C.biru; ctx.fillRect(x + 110, y + h / 2 + size * 0.5, tw, 4);
  }
  function magnifier(ctx, x, y, r) {
    ctx.save(); ctx.strokeStyle = C.kuning; ctx.lineWidth = 12; ctx.fillStyle = "rgba(255,210,63,0.12)";
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.lineCap = "round"; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(x + r * 0.72, y + r * 0.72); ctx.lineTo(x + r * 1.45, y + r * 1.45); ctx.stroke(); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: dua link yang tampak sama, kaca pembesar menyisir
    t19_dua(ctx, b, l, t, TL, A) {
      const h = 150, y1 = A.y + 10, y2 = y1 + h + 50;
      [[REAL, y1, "A"], [FAKE, y2, "B"]].forEach(([s, y, k], i) => {
        const u = pop(b, l, 0.05 + i * 0.12); if (u <= 0) return;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * 80, 0);
        linkCard(ctx, s + "/promo", 80, y, 800, h, { size: 62 });
        ctx.fillStyle = [C.tosca, C.pink][i]; ctx.beginPath(); ctx.arc(80, y, 34, 0, Math.PI * 2); ctx.fill();
        text(ctx, k, 80, y + 15, 40, { align: "center", weight: 900, color: C.bg }); ctx.restore();
      });
      const s = ph(b, l, 0.3, 0.3);
      if (s > 0) { const k = (Math.sin(l * 1.6) + 1) / 2; magnifier(ctx, lerp(260, 720, k), lerp(y1 + h / 2, y2 + h / 2, (Math.sin(l * 0.9) + 1) / 2), 70); }
      const qb = A.bot - (y2 + h + 30);
      if (qb > 140) bip(ctx, 480, y2 + h + 30 + qb / 2, Math.min(240, qb - 20), { mood: "think", t, look: [Math.sin(l * 1.6), -0.3] });
    },

    // huruf demi huruf: l kecil vs I besar
    t19_huruf(ctx, b, l, t, TL, A) {
      const word = [REAL.split(".")[0], FAKE.split(".")[0]], tw = 78, x0 = 480 - (tw * 10) / 2;
      const rows = [A.y + 60, A.y + 330], hl = [cue(b, l, "L kecil"), cue(b, l, "I besar")];
      word.forEach((wd, r) => {
        const y = rows[r], u = pop(b, l, r * 0.08); if (u <= 0) return;
        text(ctx, r ? "Palsu?" : "Asli", x0, y - 14, 36, { weight: 800, color: r ? C.pink : C.tosca });
        wd.split("").forEach((ch, i) => {
          const on = i === 2 && hl[r] > 0, ui = clamp(u * 1.5 - i * 0.05, 0, 1); if (ui <= 0) return;
          const bump = on ? 1 + 0.12 * back(hl[r] / 0.4) - 0.12 : 1;
          ctx.save(); ctx.translate(x0 + i * tw + tw / 2, y + 70); ctx.scale(ui * bump, ui * bump);
          card(ctx, -tw / 2 + 4, -70, tw - 8, 140, { fill: on ? (r ? C.badBg : C.goodBg) : C.panel, stroke: on ? (r ? C.pink : C.tosca) : C.line, lw: on ? 6 : 3, r: 16 });
          text(ctx, ch, 0, 34, 96, { align: "center", weight: 800, color: on ? C.ink : C.ink2 }); ctx.restore();
        });
        if (hl[r] > 0) { const ua = ph(b, l, r ? "I besar" : "L kecil", 0.3); ctx.save(); ctx.globalAlpha = ua;
          arrow(ctx, x0 + 2.5 * tw, y + 250, x0 + 2.5 * tw, y + 160, r ? C.pink : C.tosca, 8, 26);
          text(ctx, r ? "huruf I besar" : "huruf L kecil", x0 + 2.5 * tw + 40, y + 238, 44, { weight: 900, color: r ? C.pink : C.tosca }); ctx.restore(); }
      });
      const up = pop(b, l, "I besar", 0.5), py = A.y + 680;
      if (cue(b, l, "I besar") > 0.8 && py + 60 < A.bot) { ctx.save(); ctx.translate(480, py); ctx.scale(up, up); pill(ctx, "Sekilas tampak sama!", 0, 0, 48, { fill: C.kuning }); ctx.restore(); }
      if (A.bot - (py + 60) > 150) bip(ctx, 480, (py + 60 + A.bot) / 2, Math.min(200, A.bot - py - 80), { mood: up > 0 ? "wow" : "think", t });
    },

    // nama asli di depan, pemilik sebenarnya di belakang
    t19_depan(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y = A.y + 30, h = 300;
      card(ctx, x, y, w, h, { fill: C.panel, stroke: C.line, lw: 5, r: 28 });
      text(ctx, "Link di pesan", x + 40, y + 62, 36, { weight: 800, color: C.ink2 });
      const p1 = pieces(ctx, [{ s: REAL + ".", color: C.biru }], x + 40, y + 150, 46);
      const p2 = pieces(ctx, [{ s: "hadiah-gratis.example", color: C.biru }, { s: "/login", color: C.mute }], x + 40, y + 250, 46);
      const ua = ph(b, l, "nama asli", 0.4), ub = ph(b, l, "bagian belakang", 0.4);
      if (ua > 0) { ctx.save(); ctx.globalAlpha = ua; ctx.strokeStyle = C.tosca; ctx.lineWidth = 6; rr(ctx, p1[0].x - 12, y + 104, (p1[0].w - 12) * ua + 24, 62, 14); ctx.stroke();
        pill(ctx, "Kelihatan asli", 640, y + 360, 38, { fill: C.tosca }); ctx.restore(); }
      if (ub > 0) { ctx.save(); ctx.globalAlpha = ub; ctx.strokeStyle = C.pink; ctx.lineWidth = 6; rr(ctx, p2[0].x - 12, y + 204, p2[0].w * ub + 24, 62, 14); ctx.stroke(); ctx.restore();
        const uq = pop(b, l, "bagian belakang"); ctx.save(); ctx.translate(480, y + 470); ctx.scale(uq, uq);
        card(ctx, -380, -70, 760, 140, { fill: C.badBg, stroke: C.pink, lw: 5, r: 28 });
        text(ctx, "Pemilik sebenarnya:", 0, -12, 38, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, "hadiah-gratis.example", 0, 44, 52, { align: "center", weight: 900, color: C.pink }); ctx.restore(); }
      const by = y + 560; if (A.bot - by > 150) bip(ctx, 480, (by + A.bot) / 2, Math.min(220, A.bot - by - 20), { mood: ub > 0 ? "wow" : "think", t });
    },

    // aturan baca: ujung alamat tepat sebelum garis miring pertama
    t19_baca(ctx, b, l, t, TL, A) {
      const x = 80, w = 800;
      const ex = [
        { y: A.y + 20, lines: [[{ s: "belanjaria.example", own: 1 }, { s: "/promo" }]], ok: true, cueS: 0.05 },
        { y: A.y + 300, lines: [[{ s: "belanjaria.example." }], [{ s: "hadiah-gratis.example", own: 1 }, { s: "/login" }]], ok: false, cueS: 0.32 }
      ];
      ex.forEach((e, i) => {
        const u = pop(b, l, e.cueS); if (u <= 0) return;
        const h = 120 + e.lines.length * 86 + 10;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        card(ctx, x, e.y, w, h, { fill: C.panel, stroke: C.line, lw: 4, r: 26 });
        const sweep = ph(b, l, e.cueS + 0.12, 0.9), mark = ph(b, l, e.cueS + 0.3, 0.5);
        let sx = x + 560, sy = e.y + 100;
        e.lines.forEach((ln, k) => {
          const yy = e.y + 140 + k * 86;
          const pos = pieces(ctx, ln.map(p => ({ s: p.s, color: p.own && mark > 0 ? (e.ok ? C.tosca : C.pink) : C.ink })), x + 40, yy, 46);
          ln.forEach((p, j) => {
            if (p.own && mark > 0) { ctx.strokeStyle = e.ok ? C.tosca : C.pink; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(pos[j].x + pos[j].w * (1 - mark), yy + 12); ctx.lineTo(pos[j].x + pos[j].w, yy + 12); ctx.stroke(); }
            if (p.s[0] === "/") { sx = pos[j].x + 10; sy = yy; }
            if (p.s[0] === "/" && sweep > 0) { // garis miring pertama ditandai kuning
              ctx.save(); ctx.globalAlpha = 0.35 + 0.25 * Math.sin(l * 8); ctx.fillStyle = C.kuning; rr(ctx, pos[j].x - 6, yy - 44, 32, 58, 8); ctx.fill(); ctx.restore();
              text(ctx, "/", pos[j].x, yy, 46, { weight: 900, color: C.kuning });
            }
          });
        });
        // jari penunjuk menyisir dari kiri ke garis miring
        if (sweep > 0 && sweep < 1) { ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(lerp(x + 60, sx, sweep), lerp(e.y + 170, sy + 34, sweep), 22, 0, Math.PI * 2); ctx.fill(); }
        if (mark >= 1) {
          const cx = x + w - 70, cy = e.y + 50; ctx.fillStyle = e.ok ? C.good : C.bad; ctx.beginPath(); ctx.arc(cx, cy, 36, 0, Math.PI * 2); ctx.fill();
          if (e.ok) check(ctx, cx, cy, 44, C.bg); else cross(ctx, cx, cy, 44, C.bg);
          text(ctx, e.ok ? "Pemilik: belanjaria.example" : "Pemilik: hadiah-gratis.example", x + 40, e.y + 62, 38, { weight: 800, color: e.ok ? C.tosca : C.pink, fit: w - 160 });
        }
        ctx.restore();
      });
      const ur = pop(b, l, "itulah"), ry = A.y + 680;
      if (A.bot - (ry + 60) > 150) bip(ctx, 480, (ry + 60 + A.bot) / 2, Math.min(200, A.bot - ry - 80), { mood: ur > 0 ? "happy" : "think", t });
      if (ur > 0 && ry + 70 < A.bot) { ctx.save(); ctx.translate(480, ry); ctx.scale(ur, ur); pill(ctx, "Lihat sebelum tanda /", 0, 0, 46, { fill: C.kuning }); ctx.restore(); }
    },

    // pesan hadiah yang menyuruh buru-buru: tanda bahaya
    t19_pesan(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y = A.y + 20;
      // kepala chat
      ctx.fillStyle = C.mute; ctx.beginPath(); ctx.arc(x + 40, y + 40, 36, 0, Math.PI * 2); ctx.fill();
      text(ctx, "?", x + 40, y + 56, 44, { align: "center", weight: 900, color: C.bg });
      text(ctx, "Nomor tidak dikenal", x + 96, y + 54, 40, { weight: 800, color: C.ink2 });
      const u = pop(b, l, 0); if (u <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
      card(ctx, x, y + 100, w, 420, { fill: "#FFFFFF", r: 34 });
      text(ctx, "SELAMAT! Kamu", x + 40, y + 180, 50, { weight: 900, color: C.bg });
      text(ctx, "menang HP baru!", x + 40, y + 245, 50, { weight: 900, color: C.bg });
      text(ctx, "Cuma 10 menit lagi!", x + 40, y + 320, 46, { weight: 700, color: "#333A66" });
      text(ctx, "Klaim di sini:", x + 40, y + 378, 46, { weight: 700, color: "#333A66" });
      text(ctx, "hadiah-gratis.example/klaim", x + 40, y + 460, 46, { weight: 800, color: "#1F6FD1" });
      ctx.fillStyle = "#1F6FD1"; ctx.fillRect(x + 40, y + 472, 540, 4);
      ctx.restore();
      const f1 = ph(b, l, "hadiah", 0.35), f2 = ph(b, l, "cepat-cepat", 0.35);
      ctx.lineWidth = 7; ctx.strokeStyle = C.pink;
      if (f1 > 0) { ctx.save(); ctx.globalAlpha = f1; rr(ctx, x + 22, y + 196, 410 * f1 + 30, 70, 20); ctx.stroke(); pill(ctx, "Hadiah?", x + 650, y + 232, 36, { fill: C.pink, color: C.ink }); ctx.restore(); }
      if (f2 > 0) { ctx.save(); ctx.globalAlpha = f2; rr(ctx, x + 22, y + 274, 420 * f2 + 30, 66, 20); ctx.stroke(); pill(ctx, "Buru-buru?", x + 650, y + 308, 36, { fill: C.pink, color: C.ink }); ctx.restore(); }
      const st = pop(b, l, "jangan klik");
      if (st > 0) { ctx.save(); ctx.translate(480, y + 600); ctx.rotate(-0.05); ctx.scale(st, st); card(ctx, -300, -62, 600, 124, { fill: C.bad, r: 24, glow: "rgba(255,90,95,0.5)" });
        text(ctx, "JANGAN KLIK!", 0, 24, 70, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
      const by = y + 690; if (A.bot - by > 150) bip(ctx, 480, (by + A.bot) / 2, Math.min(220, A.bot - by - 20), { mood: st > 0 ? "sad" : "think", t });
    }
  });
})();
