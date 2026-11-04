/* T26 Verifikasi dua langkah: kunci kedua untuk akunmu — adegan khusus (sisi pertahanan). Sandi, kode, dan pesan rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, cross, lock, bip, rnd, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const CODE1 = "482913", CODE2 = "705266";

  function phone(ctx, cx, cy, s, col) {
    card(ctx, cx - s * 0.3, cy - s * 0.5, s * 0.6, s, { fill: "#05061A", r: s * 0.1, stroke: C.ink2, lw: 5 });
    card(ctx, cx - s * 0.25, cy - s * 0.43, s * 0.5, s * 0.84, { fill: col || C.bg2, r: s * 0.06 });
  }
  function codeBoxes(ctx, code, n, cx, y, s, col) {
    const gap = s * 0.18, w = 6 * s + 5 * gap + gap, x0 = cx - w / 2;
    for (let i = 0; i < 6; i++) { const x = x0 + i * (s + gap) + (i >= 3 ? gap : 0);
      card(ctx, x, y, s, s * 1.25, { fill: C.bg, stroke: i < n ? (col || C.tosca) : C.line, lw: 4, r: 14 });
      if (i < n) text(ctx, code[i], x + s / 2, y + s * 0.88, s * 0.7, { align: "center", weight: 900, color: C.ink }); }
  }
  function key(ctx, x, y, s, col) {
    ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, s * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(x, y, s * 0.11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(x + s * 0.2, y - s * 0.06, s * 0.75, s * 0.12); ctx.fillRect(x + s * 0.75, y, s * 0.08, s * 0.2); ctx.fillRect(x + s * 0.6, y, s * 0.08, s * 0.15); ctx.restore();
  }
  function avatar(ctx, cx, cy, s, col) {
    ctx.save(); ctx.fillStyle = col || C.mute; ctx.beginPath(); ctx.arc(cx, cy - s * 0.22, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.32, s * 0.38, s * 0.26, 0, Math.PI, 0); ctx.fill(); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: sandi bocor, tetapi akun tetap terkunci
    t26_kait(ctx, b, l, t, TL, A) {
      const y = A.y + 20, u1 = pop(b, l, 0.02);
      ctx.save(); ctx.translate(250, y + 150); ctx.rotate(-0.06); ctx.scale(u1, u1);
      card(ctx, -170, -120, 340, 240, { fill: "#F4F6FF", r: 12 });
      text(ctx, "sandi:", -130, -40, 40, { weight: 700, color: "#4A5288" }); text(ctx, "kucingoren7", -130, 30, 48, { weight: 900, color: C.bg, fit: 280 });
      const st = pop(b, l, "bocor"); if (st > 0) { ctx.save(); ctx.rotate(-0.15); ctx.scale(st, st); card(ctx, -140, 50, 280, 80, { fill: C.bad, r: 14 }); text(ctx, "BOCOR", 0, 108, 52, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
      ctx.restore();
      const u2 = pop(b, l, "akunmu");
      if (u2 > 0) { ctx.save(); ctx.translate(690, y + 150); ctx.scale(u2, u2); card(ctx, -170, -140, 340, 280, { fill: C.panel, stroke: C.good, lw: 6, glow: "rgba(34,227,196,0.4)" });
        lock(ctx, 0, -60, 130, 0, C.good); text(ctx, "Akunmu", 0, 110, 44, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
      const ua = pop(b, l, "tetap aman");
      if (ua > 0) { ctx.save(); ctx.translate(480, y + 400); ctx.scale(ua, ua); pill(ctx, "tetap aman", 0, 0, 52, { fill: C.good }); ctx.restore(); }
      const by = y + 480; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: ua > 0 ? "wow" : "sad", t });
    },

    // dua kunci: sandi yang kamu tahu + HP yang kamu pegang
    t26_dua(ctx, b, l, t, TL, A) {
      const y = A.y + 20;
      // pintu dengan dua lubang kunci
      card(ctx, 330, y, 300, 420, { fill: C.panel2, stroke: C.line, lw: 6, r: 24 });
      const k1 = ph(b, l, "sandi yang", 0.6), k2 = ph(b, l, "HP yang", 0.6);
      [[y + 140, k1, C.kuning], [y + 290, k2, C.pink]].forEach(([hy, k, col]) => {
        ctx.fillStyle = k >= 1 ? col : C.bg; ctx.beginPath(); ctx.arc(480, hy, 34, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(470, hy, 20, 50);
      });
      text(ctx, "1", 400, y + 156, 48, { align: "center", weight: 900, color: C.kuning }); text(ctx, "2", 400, y + 306, 48, { align: "center", weight: 900, color: C.pink });
      // kartu kunci 1 dan 2
      const c1 = pop(b, l, "sandi yang"), c2 = pop(b, l, "HP yang"), ky = y + 500;
      if (c1 > 0) { ctx.save(); ctx.translate(250, ky + 130); ctx.scale(c1, c1); card(ctx, -180, -130, 360, 260, { fill: C.panel, stroke: C.kuning, lw: 5 });
        for (let i = 0; i < 6; i++) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(-100 + i * 40, -50, 13, 0, Math.PI * 2); ctx.fill(); }
        text(ctx, "Sandi", 0, 30, 50, { align: "center", weight: 900, color: C.kuning }); text(ctx, "yang kamu tahu", 0, 90, 34, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
      if (c2 > 0) { ctx.save(); ctx.translate(710, ky + 130); ctx.scale(c2, c2); card(ctx, -180, -130, 360, 260, { fill: C.panel, stroke: C.pink, lw: 5 });
        phone(ctx, 0, -55, 110, C.pink);
        text(ctx, "HP", 0, 50, 50, { align: "center", weight: 900, color: C.pink }); text(ctx, "yang kamu pegang", 0, 100, 34, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
      // kunci melayang ke lubang
      if (k1 > 0 && k1 < 1) key(ctx, lerp(250, 420, k1), lerp(ky + 40, y + 140, k1), 120, C.kuning);
      if (k2 > 0 && k2 < 1) key(ctx, lerp(710, 420, k2), lerp(ky + 40, y + 290, k2), 120, C.pink);
    },

    // setelah sandi benar, kode 6 angka dari HP dimasukkan
    t26_kode(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y = A.y + 20;
      card(ctx, x, y, w, 170, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "Sandi", x + 40, y + 70, 36, { weight: 800, color: C.ink2 });
      for (let i = 0; i < 10; i++) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x + 60 + i * 44, y + 120, 13, 0, Math.PI * 2); ctx.fill(); }
      const ok = pop(b, l, "benar"); if (ok > 0) { ctx.save(); ctx.translate(x + w - 90, y + 85); ctx.scale(ok, ok); ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(0, 0, 44, 0, Math.PI * 2); ctx.fill(); check(ctx, 0, 0, 52, C.bg); ctx.restore(); }
      // notifikasi kode di HP
      const un = pop(b, l, "muncul"), ny = y + 220;
      phone(ctx, 700, ny + 210, 380);
      if (un > 0) { ctx.save(); ctx.translate(700, ny + 90); ctx.scale(un, un); card(ctx, -100, -50, 200, 100, { fill: "#F4F6FF", r: 16 });
        text(ctx, "Kode masuk:", 0, -12, 22, { align: "center", weight: 700, color: "#4A5288" });
        text(ctx, CODE1.slice(0, 3) + " " + CODE1.slice(3), 0, 30, 38, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      // kotak kode di layar login
      const uc = ph(b, l, "kode enam", 0.4);
      if (uc > 0) { ctx.save(); ctx.globalAlpha = uc;
        text(ctx, "Masukkan kode", 90, ny + 70, 46, { weight: 900, color: C.kuning });
        const n = Math.min(6, Math.floor(Math.max(0, cue(b, l, "muncul") - 0.4) * 6));
        codeBoxes(ctx, CODE1, n, 300, ny + 110, 68, C.tosca); ctx.restore(); }
      const by = ny + 300; if (A.bot - by > 140) bip(ctx, 260, (by + A.bot) / 2 + 20, Math.min(200, A.bot - by - 10), { mood: "happy", t });
    },

    // kode berlaku sebentar, lalu berganti
    t26_timer(ctx, b, l, t, TL, A) {
      const cx = 480, cy = A.y + 280, r = 220, period = 2.6, k = (l % period) / period, cycle = Math.floor(l / period);
      const code = cue(b, l, "berganti") > 0 && cycle >= 1 ? (cycle % 2 ? CODE2 : CODE1) : CODE1;
      ctx.save(); ctx.lineWidth = 26; ctx.lineCap = "round"; ctx.strokeStyle = C.panel2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = k > 0.75 ? C.bad : C.tosca; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - k)); ctx.stroke(); ctx.restore();
      text(ctx, code.slice(0, 3) + " " + code.slice(3), cx, cy + 30, 82, { align: "center", weight: 900, color: C.ink, shadow: true });
      text(ctx, "berlaku sebentar", cx, cy + 110, 40, { align: "center", weight: 800, color: k > 0.75 ? C.bad : C.ink2 });
      const ub = pop(b, l, "kode baru"), py = cy + r + 110;
      if (ub > 0 && py + 50 < A.bot) { ctx.save(); ctx.translate(480, py); ctx.scale(ub, ub); pill(ctx, "Kode lama tidak berlaku lagi", 0, 0, 42, { fill: C.kuning }); ctx.restore(); }
      text(ctx, "Kode di HP-mu", 480, A.y + 30, 44, { align: "center", weight: 700, color: C.mute });
      const by = py + 60; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(190, A.bot - by - 10), { mood: "think", t });
    },

    // orang lain hanya tahu sandi: tertahan di langkah kedua
    t26_tolak(ctx, b, l, t, TL, A) {
      const y = A.y + 20;
      avatar(ctx, 200, y + 130, 200, C.mute); text(ctx, "orang lain", 200, y + 270, 38, { align: "center", weight: 800, color: C.ink2 });
      // langkah 1 lolos, langkah 2 tertahan
      const s1 = ph(b, l, 0.1, 0.4), s2 = ph(b, l, "tetap", 0.4);
      card(ctx, 380, y + 30, 500, 110, { fill: s1 > 0 ? C.goodBg : C.panel, stroke: s1 > 0 ? C.good : C.line, lw: 4, r: 20 });
      text(ctx, "1. Sandi", 420, y + 102, 44, { weight: 900, color: C.ink });
      if (s1 > 0) check(ctx, 820, y + 85, 50, C.good);
      card(ctx, 380, y + 170, 500, 110, { fill: s2 > 0 ? C.badBg : C.panel, stroke: s2 > 0 ? C.bad : C.line, lw: 4, r: 20 });
      text(ctx, "2. Kode dari HP", 420, y + 242, 44, { weight: 900, color: C.ink, fit: 360 });
      if (s2 > 0) cross(ctx, 830, y + 225, 50, C.bad);
      const ug = pop(b, l, "tidak bisa masuk"), gy = y + 470;
      if (ug > 0) { ctx.save(); ctx.translate(480, gy); ctx.rotate(-0.04); ctx.scale(ug, ug); card(ctx, -330, -75, 660, 150, { fill: C.bad, r: 28, glow: "rgba(255,90,95,0.5)" });
        lock(ctx, -240, -30, 90, 0, C.ink); text(ctx, "Gagal masuk", 50, 22, 66, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
      const by = gy + 110; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(210, A.bot - by - 10), { mood: ug > 0 ? "happy" : "think", t, bounce: ug > 0 ? 1.2 : 0 });
    },

    // jangan berikan kode kepada siapa pun
    t26_jangan(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y = A.y + 20;
      avatar(ctx, x + 40, y + 40, 70, C.mute); text(ctx, "Mengaku petugas", x + 96, y + 54, 40, { weight: 800, color: C.ink2 });
      const u = pop(b, l, 0.02);
      if (u > 0) { ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        card(ctx, x, y + 100, w, 300, { fill: "#FFFFFF", r: 34 });
        ["Halo, saya petugas.", "Tolong kirim kode", "6 angka yang barusan", "masuk ke HP-mu, ya."].forEach((s, i) => text(ctx, s, x + 40, y + 170 + i * 64, 48, { weight: i ? 700 : 900, color: C.bg }));
        ctx.restore(); }
      const st = pop(b, l, "jangan pernah");
      if (st > 0) { ctx.save(); ctx.translate(480, y + 470); ctx.rotate(-0.05); ctx.scale(st, st); card(ctx, -340, -66, 680, 132, { fill: C.bad, r: 26, glow: "rgba(255,90,95,0.5)" });
        text(ctx, "JANGAN DIBERIKAN!", 0, 24, 62, { align: "center", weight: 900, color: C.ink, fit: 640 }); ctx.restore(); }
      const up = pop(b, l, "mengaku petugas"), py = y + 600;
      if (up > 0 && py + 50 < A.bot) { ctx.save(); ctx.translate(480, py); ctx.scale(up, up); pill(ctx, "Petugas asli tidak pernah minta kode", 0, 0, 38, { fill: C.kuning }); ctx.restore(); }
      const by = py + 50; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: st > 0 ? "sad" : "think", t });
    }
  });
})();
