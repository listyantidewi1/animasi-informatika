/* T18 Situs yang baik tidak menyimpan sandimu — adegan khusus. Nama akun dan sandi rekaan; hash = 16 huruf pertama SHA-256 sungguhan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, lock, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const PW = "kucingoren7", PW2 = "kucingoren8";
  const H1 = "bf51 c9cd b088 7770", H2 = "bcd5 2415 9158 c4d9", HEX = "0123456789abcdef";

  // hash yang "berputar" acak lalu berhenti pada nilai akhirnya (u: 0 acak .. 1 tetap)
  function scramble(s, u, seed) {
    return s.split("").map((ch, i) => ch === " " || i / s.length < u ? ch : HEX[Math.floor(rnd(seed * 31 + i * 7) * 16)]).join("");
  }
  function field(ctx, label, val, x, y, w, h, opt = {}) {
    if (label) text(ctx, label, x + 4, y - 16, 34, { weight: 800, color: C.ink2 });
    card(ctx, x, y, w, h, { fill: C.bg, stroke: opt.stroke || C.line, lw: 5, r: 22, glow: opt.glow });
    text(ctx, val, x + (opt.center ? w / 2 : 34), y + h / 2 + (opt.size || 60) * 0.36, opt.size || 60,
      { weight: 900, color: opt.color || C.ink, align: opt.center ? "center" : "left", fit: w - 60 });
  }
  // "mesin" hash: kotak dengan dua roda gigi berputar
  function gear(ctx, x, y, r, a, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = col;
    for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); ctx.fillRect(-r * 0.22, -r * 1.25, r * 0.44, r * 0.5); }
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.panel2; ctx.beginPath(); ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function machine(ctx, x, y, w, h, spin) {
    card(ctx, x, y, w, h, { fill: C.panel2, stroke: C.pink, lw: 6, glow: "rgba(255,79,154,0.35)" });
    gear(ctx, x + 90, y + h / 2, 42, spin, C.pink); gear(ctx, x + 170, y + h / 2 + 10, 28, -spin * 1.5, C.kuning);
    text(ctx, "Fungsi hash", x + 240, y + h / 2 + 22, 60, { weight: 900, color: C.ink, fit: w - 270 });
  }

  Object.assign(T.SCENES, {
    // di bawah kait: data akun di situs, kolom sandi berganti dari sandi asli menjadi hash
    t18_kait(ctx, b, l, t, TL, A) {
      const h = Math.min(430, A.h - 10), y = A.y + 10, x = 90, w = 780, sw = ph(b, l, 0.35, 0.5);
      if (A.bot - (y + h) > 150) bip(ctx, 480, (y + h + A.bot) / 2 + 10, Math.min(230, A.bot - y - h - 20), { mood: sw > 0.5 ? "wow" : "think", t });
      card(ctx, x, y, w, h, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "Data akun di situs", x + 40, y + 74, 46, { weight: 900, color: C.kuning });
      const rowH = (h - 110) / 2;
      text(ctx, "Nama akun", x + 40, y + 110 + rowH * 0.55, 38, { weight: 700, color: C.ink2 });
      text(ctx, "rara07", x + 260, y + 110 + rowH * 0.55, 56, { weight: 900, color: C.ink });
      const ry = y + 110 + rowH * 1.55;
      text(ctx, "Sandi", x + 40, ry, 38, { weight: 700, color: C.ink2 });
      if (sw < 1) {
        ctx.save(); ctx.globalAlpha = 1 - sw; text(ctx, PW, x + 260, ry, 56, { weight: 900, color: C.bad });
        ctx.strokeStyle = C.bad; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 250, ry - 16); ctx.lineTo(x + 260 + 300 * clamp(sw * 3, 0, 1), ry - 16); ctx.stroke(); ctx.restore();
      }
      if (sw > 0) { ctx.save(); ctx.globalAlpha = sw; text(ctx, scramble(H1, sw * 1.4 - 0.2, Math.floor(l * 18)), x + 260, ry, 56, { weight: 900, color: C.tosca, fit: 480 }); ctx.restore(); }
      lock(ctx, x + w - 70, y + 52, 64, 0, C.tosca);
    },

    // sandi masuk ke fungsi hash, keluar kode acak
    t18_mesin(ctx, b, l, t, TL, A) {
      const x = 80, w = 780, typed = Math.min(PW.length, Math.floor(Math.max(0, cue(b, l, "mendaftar")) * 14));
      field(ctx, "Sandi yang kamu buat", PW.slice(0, typed) + (typed < PW.length && (l * 2) % 1 < 0.5 ? "|" : ""), x, A.y + 70, w, 160, { stroke: C.biru, size: 70 });
      const go = ph(b, l, "diubah", 0.6), my = A.y + 340;
      if (go > 0) { const k = clamp(go, 0, 1); arrow(ctx, 480, A.y + 244, 480, A.y + 244 + 80 * k, C.ink2, 10, 28); }
      machine(ctx, x, my, w, 220, cue(b, l, "diubah") > 0 ? l * 4 : 0);
      if (go > 0) {   // huruf-huruf sandi tersedot ke mesin
        PW.split("").forEach((ch, i) => {
          const u = clamp(go * 1.6 - i * 0.05, 0, 1); if (u <= 0 || u >= 1) return;
          text(ctx, ch, lerp(140 + i * 52, 480, u), lerp(A.y + 175, my + 110, u), 54, { weight: 900, color: C.kuning, align: "center" });
        });
      }
      const out = ph(b, l, "kode acak", 0.3), oy = my + 360;
      if (out > 0) {
        arrow(ctx, 480, my + 232, 480, my + 316, C.ink2, 10, 28);
        const settle = clamp(cue(b, l, "kode acak") / 1.2, 0, 1);
        field(ctx, "Yang disimpan situs", scramble(H1, settle, Math.floor(l * 18)), x, oy, w, 160, { size: 66, stroke: C.tosca, color: C.tosca, glow: settle >= 1 ? "rgba(34,227,196,0.4)" : null });
      }
      const ul = pop(b, l, "hash");
      if (ul > 0 && oy + 290 < A.bot) { ctx.save(); ctx.translate(480, oy + 255); ctx.scale(ul, ul); pill(ctx, "Ini namanya hash", 0, 0, 50, { fill: C.kuning }); ctx.restore(); }
    },

    // beda satu huruf, hash berubah total
    t18_beda(ctx, b, l, t, TL, A) {
      const x = 80, w = 780, gap = Math.min(470, (A.h - 40) / 2);
      const row = (pw, hs, y, u, diff, seed) => {
        if (u <= 0) return;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * 80, 0);
        card(ctx, x, y, w, gap - 40, { fill: C.panel, stroke: diff ? C.pink : C.line, lw: 4 });
        text(ctx, "Sandi", x + 36, y + 66, 36, { weight: 800, color: C.ink2 });
        const base = pw.slice(0, -1), last = pw.slice(-1);
        T.helpers.font(ctx, 76, 900); const bw = ctx.measureText(base).width;
        text(ctx, base, x + 36, y + 160, 76, { weight: 900, color: C.ink });
        text(ctx, last, x + 36 + bw, y + 160, 76, { weight: 900, color: diff ? C.pink : C.ink });
        if (diff) { ctx.strokeStyle = C.pink; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x + 36 + bw + 23, y + 133, 54, 0, Math.PI * 2); ctx.stroke(); }
        arrow(ctx, 480, y + 200, 480, y + 270, C.ink2, 10, 28);
        const settle = diff ? clamp(cue(b, l, "berubah") / 1.0, 0, 1) : 1;
        text(ctx, scramble(hs, settle, seed + Math.floor(l * 18)), 480, y + 350, 70, { align: "center", weight: 900, color: diff ? C.pink : C.tosca, fit: w - 80 });
        ctx.restore();
      };
      row(PW, H1, A.y + 20, pop(b, l, 0), false, 3);
      row(PW2, H2, A.y + 20 + gap, pop(b, l, "satu huruf"), true, 9);
      const ub = pop(b, l, "berubah total");
      if (ub > 0) { ctx.save(); ctx.translate(480, A.y + 20 + gap * 2 + 10); ctx.rotate(-0.05); ctx.scale(ub, ub); pill(ctx, "Beda total!", 0, 0, 50, { fill: C.kuning }); ctx.restore(); }
    },

    // login: sandi yang diketik di-hash lalu dicocokkan dengan hash tersimpan
    t18_login(ctx, b, l, t, TL, A) {
      const x = 80, w = 780, y0 = A.y + 10;
      card(ctx, x, y0, w, 300, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "Masuk", x + 40, y0 + 72, 48, { weight: 900, color: C.ink });
      const dots = Math.min(PW.length, Math.floor(Math.max(0, cue(b, l, "ketik")) * 12)), conv = ph(b, l, "diubah", 0.5);
      card(ctx, x + 40, y0 + 110, w - 80, 120, { fill: C.bg, stroke: C.biru, lw: 5, r: 20 });
      if (conv < 1) { ctx.save(); ctx.globalAlpha = 1 - conv; for (let i = 0; i < dots; i++) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x + 100 + i * 52, y0 + 170, 15, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
      if (conv > 0) { ctx.save(); ctx.globalAlpha = conv; text(ctx, scramble(H1, clamp(cue(b, l, "diubah") / 0.9, 0, 1), Math.floor(l * 18)), x + 80, y0 + 192, 56, { weight: 900, color: C.tosca, fit: w - 160 }); ctx.restore(); }
      text(ctx, "hash dari sandi yang diketik", x + 40, y0 + 278, 30, { weight: 700, color: conv > 0 ? C.ink2 : "rgba(0,0,0,0)" });
      // hash tersimpan
      const ys = y0 + 500, us = ph(b, l, 0.05, 0.4);
      ctx.save(); ctx.globalAlpha = us;
      text(ctx, "Hash yang tersimpan di situs", x + 4, ys - 20, 34, { weight: 800, color: C.ink2 });
      card(ctx, x, ys, w, 140, { fill: C.bg, stroke: C.tosca, lw: 5, r: 22 });
      text(ctx, H1, x + 80, ys + 92, 56, { weight: 900, color: C.tosca, fit: w - 160 }); ctx.restore();
      const m = pop(b, l, "dicocokkan");
      // tanda sama dengan di antara keduanya
      if (m > 0) {
        ctx.save(); ctx.translate(480, y0 + 385); ctx.scale(m, m); ctx.fillStyle = C.kuning;
        rr(ctx, -50, -24, 100, 16, 8); ctx.fill(); rr(ctx, -50, 8, 100, 16, 8); ctx.fill(); ctx.restore();
        ctx.save(); ctx.translate(480, ys + 250); ctx.scale(m, m);
        card(ctx, -330, -60, 660, 120, { fill: C.goodBg, stroke: C.good, lw: 5, r: 60 });
        check(ctx, -240, 0, 60, C.good); text(ctx, "Cocok, boleh masuk!", 40, 18, 48, { align: "center", weight: 900, color: C.ink, fit: 480 }); ctx.restore();
      }
      if (A.bot - (ys + 330) > 120) bip(ctx, 480, (ys + 330 + A.bot) / 2, Math.min(200, A.bot - ys - 330), { mood: m > 0 ? "happy" : "think", t, bounce: m > 0 ? 1.2 : 0 });
    },

    // satu arah: sandi -> hash bisa, hash -> sandi tidak bisa
    t18_balik(ctx, b, l, t, TL, A) {
      const x = 80, w = 780, yA = A.y + 20, yB = A.y + 470, gone = ph(b, l, "jadi", 0.5);
      ctx.save(); ctx.globalAlpha = 1 - gone * 0.7;
      field(ctx, "Sandi", PW, x, yA, w, 140, { stroke: C.biru, center: true }); ctx.restore();
      field(ctx, "Hash", H1, x, yB, w, 140, { stroke: C.tosca, color: C.tosca, center: true, size: 56 });
      // panah turun (bisa) dan panah naik (tidak bisa)
      const ud = ph(b, l, 0, 0.5); if (ud > 0) { arrow(ctx, 300, yA + 160, 300, yA + 160 + 250 * ud, C.good, 14, 40); }
      const uu = ph(b, l, "dibalik", 0.5);
      if (uu > 0) {
        const shake = cue(b, l, "dibalik") < 0.9 ? Math.sin(l * 40) * 6 : 0;
        arrow(ctx, 660 + shake, yB - 20, 660 + shake, yB - 20 - 250 * uu, C.bad, 14, 40);
        const uc = pop(b, l, "dibalik", 0.4); ctx.save(); ctx.translate(660, yB - 145); ctx.scale(uc, uc);
        ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(0, 0, 54, 0, Math.PI * 2); ctx.fill(); cross(ctx, 0, 0, 62, C.ink); ctx.restore();
        text(ctx, "tidak bisa", 740, yB - 128, 36, { weight: 800, color: C.bad });
      }
      if (ud > 0) text(ctx, "bisa", 210, yA + 300, 38, { weight: 800, color: C.good, align: "right" });
      const st = pop(b, l, "jadi");
      if (st > 0) { ctx.save(); ctx.translate(480, yA + 70); ctx.rotate(-0.06); ctx.scale(st, st); card(ctx, -300, -50, 600, 100, { fill: C.bad, r: 20 });
        text(ctx, "TIDAK DISIMPAN", 0, 20, 54, { align: "center", weight: 900, color: C.ink, fit: 560 }); ctx.restore(); }
      if (yB + 330 < A.bot) bip(ctx, 480, yB + 260 + (A.bot - yB - 260) / 2, Math.min(200, A.bot - yB - 240), { mood: st > 0 ? "happy" : "think", t });
    },

    // lupa sandi: situs tidak bisa mengirim sandi lama, kamu membuat sandi baru
    t18_lupa(ctx, b, l, t, TL, A) {
      const x = 80, w = 780, y0 = A.y + 10;
      card(ctx, x, y0, w, 150, { fill: C.panel, stroke: C.line, lw: 4 });
      lock(ctx, x + 80, y0 + 62, 80, 0, C.kuning);
      text(ctx, "Lupa sandi?", x + 160, y0 + 96, 60, { weight: 900, color: C.ink });
      const u1 = pop(b, l, "tidak bisa");
      if (u1 > 0) {
        const y = y0 + 200; ctx.save(); ctx.globalAlpha = clamp(u1, 0, 1); ctx.translate((1 - u1) * -80, 0);
        card(ctx, x, y, w, 220, { fill: C.badBg, stroke: C.bad, lw: 5 });
        text(ctx, "Sandi lamamu adalah …", x + 40, y + 80, 44, { weight: 800, color: C.ink });
        text(ctx, "? ? ? ? ? ?", x + 40, y + 170, 60, { weight: 900, color: C.bad });
        ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(x + w - 90, y + 110, 56, 0, Math.PI * 2); ctx.fill(); cross(ctx, x + w - 90, y + 110, 64, C.ink);
        ctx.restore();
        if (ph(b, l, "tidak bisa", 0.4) > 0) text(ctx, "Situsnya sendiri tidak tahu.", 480, y + 270, 38, { align: "center", weight: 700, color: C.ink2 });
      }
      const u2 = pop(b, l, "sandi baru");
      if (u2 > 0) {
        const y = y0 + 560, tap = cue(b, l, "sandi baru") - 0.5, pr = tap > 0 && tap < 0.2 ? 0.94 : 1;
        ctx.save(); ctx.translate(480, y + 70); ctx.scale(u2 * pr, u2 * pr);
        card(ctx, -360, -70, 720, 140, { fill: C.pink, r: 70, glow: "rgba(255,79,154,0.5)" });
        text(ctx, "Buat sandi baru", 0, 22, 60, { align: "center", weight: 900, color: C.ink, fit: 620 }); ctx.restore();
        if (tap > 0 && tap < 0.8) { ctx.save(); ctx.globalAlpha = 1 - tap / 0.8; ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(700, y + 90, 30 + tap * 120, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        if (tap > 0.3 && y + 300 < A.bot) { const uc = pop(b, l, "sandi baru", 0.4); ctx.save(); ctx.translate(480, y + 240); ctx.scale(uc, uc); check(ctx, -180, 0, 60, C.good);
          text(ctx, "Akun aman lagi", 40, 16, 46, { align: "center", weight: 900, color: C.good }); ctx.restore(); }
      }
      if (A.bot - (y0 + 880) > 120) bip(ctx, 480, (y0 + 880 + A.bot) / 2, Math.min(200, A.bot - y0 - 880), { mood: u2 > 0 ? "happy" : "think", t });
    }
  });
})();
