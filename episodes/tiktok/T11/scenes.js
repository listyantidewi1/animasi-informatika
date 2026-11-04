/* T11 Enkripsi end-to-end — adegan khusus. Nama dan pesan rekaan; aplikasi chat generik. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, lock, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const MSG = "Jam 4 di taman, ya", ACAK = "Xq9#fL2@w!7zK$pR";

  // teks acak yang perlahan berubah dari/ke pesan asli (k = 0 asli .. 1 acak)
  function scramble(s, k, t) {
    let out = ""; for (let i = 0; i < s.length; i++) { const r = rnd(i * 13 + 1); out += (r < k) ? (s[i] === " " ? " " : ACAK[(i * 7 + Math.floor(t * 12)) % ACAK.length]) : s[i]; }
    return out;
  }
  function phone(ctx, x, y, w, h, name, col) {
    card(ctx, x, y, w, h, { fill: "#0A0D24", stroke: col, lw: 7, r: w * 0.14 });
    ctx.fillStyle = col; rr(ctx, x + w / 2 - 26, y + 14, 52, 9, 5); ctx.fill();
    text(ctx, name, x + w / 2, y + h + 50, 40, { align: "center", weight: 900, color: col });
  }
  function server(ctx, x, y, w, h, t) {
    for (let i = 0; i < 3; i++) {
      const yy = y + i * (h / 3);
      card(ctx, x, yy + 4, w, h / 3 - 8, { fill: C.panel2, stroke: C.line, lw: 3, r: 12 });
      for (let k = 0; k < 3; k++) { ctx.fillStyle = (Math.floor(t * 3 + i + k) % 3) ? C.good : C.mute; ctx.beginPath(); ctx.arc(x + 30 + k * 26, yy + h / 6, 7, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = "rgba(184,192,238,0.35)"; rr(ctx, x + w - 120, yy + h / 6 - 6, 90, 12, 6); ctx.fill();
    }
    text(ctx, "Server", x + w / 2, y - 16, 36, { align: "center", weight: 800, color: C.ink2 });
  }
  function key(ctx, x, y, s, col, ang) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang || 0); ctx.strokeStyle = col || C.kuning; ctx.fillStyle = col || C.kuning; ctx.lineWidth = s * 0.12;
    ctx.beginPath(); ctx.arc(-s * 0.3, 0, s * 0.2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillRect(-s * 0.1, -s * 0.06, s * 0.6, s * 0.12); ctx.fillRect(s * 0.3, 0, s * 0.08, s * 0.2); ctx.fillRect(s * 0.42, 0, s * 0.08, s * 0.15);
    ctx.restore();
  }
  // kotak pesan dengan gembok; locked 0..1
  function box(ctx, x, y, w, s, locked, k, t) {
    card(ctx, x - w / 2, y - 50, w, 100, { fill: locked > 0.5 ? C.badBg : C.biru, stroke: locked > 0.5 ? C.pink : null, lw: 4, r: 26 });
    text(ctx, scramble(s, k, t), x + (locked > 0 ? 30 : 0), y + 14, 34, { align: "center", weight: 800, color: C.ink, fit: w - (locked > 0 ? 100 : 30) });
    if (locked > 0) lock(ctx, x - w / 2 + 40, y - 18, 56, 1 - locked, C.kuning);
  }
  const L = A => ({ ax: A.x + 10, bx: A.x + 600, py: A.y + 300, pw: 210, phh: 360, sx: 480 - 140, sy: A.y + 50, sw: 280, sh: 170 });

  Object.assign(T.SCENES, {
    // di bawah kait: pesan berjalan HP -> server -> HP; server tidak bisa membaca
    t11_jalur(ctx, b, l, t, TL, A) {
      const y = A.y + Math.max(40, A.h * 0.25), k = (l * 0.45) % 1;
      // HP kiri, server tengah, HP kanan (kecil)
      card(ctx, A.x + 20, y - 90, 130, 220, { fill: "#0A0D24", stroke: C.tosca, lw: 6, r: 22 });
      card(ctx, A.x + 670, y - 90, 130, 220, { fill: "#0A0D24", stroke: C.pink, lw: 6, r: 22 });
      server(ctx, 480 - 110, y - 70, 220, 160, t);
      const x = k < 0.5 ? lerp(A.x + 85, 480, k * 2) : lerp(480, A.x + 735, (k - 0.5) * 2), yy = y + 10 - Math.sin(k * Math.PI * 2) * 20;
      card(ctx, x - 60, yy - 30, 120, 60, { fill: C.badBg, stroke: C.pink, lw: 3, r: 16 }); lock(ctx, x - 30, yy - 12, 34, 0, C.kuning);
      text(ctx, "#@!", x + 18, yy + 12, 28, { align: "center", weight: 800, color: C.ink });
      // mata server dicoret
      const ue = pop(b, l, "tidak bisa");
      if (ue > 0) { ctx.save(); ctx.translate(480, y + 160); ctx.scale(ue, ue);
        ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.ellipse(0, 0, 70, 38, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
        cross(ctx, 0, 0, 150, C.bad); ctx.restore(); }
    },
    // HP penerima membagikan gembok terbuka; kunci tetap di HP-nya
    t11_gembok(ctx, b, l, t, TL, A) {
      const P = L(A);
      phone(ctx, P.ax, P.py, P.pw, P.phh, "Rani", C.tosca);
      phone(ctx, P.bx, P.py, P.pw, P.phh, "Bayu", C.pink);
      server(ctx, P.sx, P.sy, P.sw, P.sh, t);
      const ug = ph(b, l, "gembok terbuka", 0.2), fly = ease(cue(b, l, "gembok terbuka") / 1.2);
      // gembok terbuka terbang dari HP Bayu ke HP Rani
      if (ug > 0) {
        const x = lerp(P.bx + P.pw / 2, P.ax + P.pw / 2, fly), y = lerp(P.py + 140, P.py + 140, fly) - Math.sin(fly * Math.PI) * 160;
        lock(ctx, x, y - 30, 110, 1, C.kuning);
        if (fly >= 1) text(ctx, "gembok terbuka", P.ax + P.pw / 2, P.py + 260, 28, { align: "center", weight: 800, color: C.kuning });
      }
      // kunci rahasia tetap di HP Bayu
      const uk = pop(b, l, "kuncinya");
      key(ctx, P.bx + P.pw / 2, P.py + 260, 110, C.kuning, Math.sin(t * 3) * 0.1);
      if (uk > 0) { ctx.save(); ctx.translate(480, P.py + P.phh + 130); ctx.scale(uk, uk); pill(ctx, "Kunci rahasia hanya di HP Bayu", 0, 0, 38, { fill: C.kuning }); ctx.restore();
        ctx.save(); ctx.strokeStyle = C.kuning; ctx.lineWidth = 6; ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 6); ctx.beginPath(); ctx.arc(P.bx + P.pw / 2, P.py + 260, 80, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      const ue = pop(b, l, "enkripsi");
      if (ue > 0 && ug <= 0) { ctx.save(); ctx.translate(480, P.py + 180); ctx.scale(ue, ue); pill(ctx, "end-to-end", 0, 0, 44, { fill: C.tosca }); ctx.restore(); }
    },
    // pesan dikunci di HP pengirim dan menjadi huruf acak
    t11_kunci(ctx, b, l, t, TL, A) {
      const y = A.y + 120, lockK = ease(cue(b, l, "mengunci") / 0.5), scr = ease(cue(b, l, "berubah") / 0.9);
      text(ctx, "Di HP Rani", A.x, A.y + 50, 44, { weight: 900, color: C.tosca });
      // gelembung pesan asli
      card(ctx, A.x + 60, y, 700, 140, { fill: C.tosca, r: 40 });
      text(ctx, scramble(MSG, scr, t), A.x + 410, y + 90, 56, { align: "center", weight: 900, color: C.bg, fit: 640 });
      // gembok turun dan menutup
      const ly = lerp(y - 60, y + 300, ease(cue(b, l, "gembok") / 0.6));
      if (cue(b, l, "gembok") > 0) lock(ctx, 480, ly, 170, 1 - lockK, C.kuning);
      // hasil: kotak terkunci berisi huruf acak
      if (scr > 0) { ctx.save(); ctx.globalAlpha = scr; arrow(ctx, 480, y + 160, 480, y + 250, C.pink, 8, 26);
        box(ctx, 480, y + 560, 780, MSG, 1, 1, t); ctx.restore();
        text(ctx, "yang terlihat dari luar", 480, y + 680, 36, { align: "center", weight: 700, color: C.ink2 }); }
      if (A.bot - (y + 720) > 150) bip(ctx, 480, A.bot - 80, 130, { mood: scr > 0 ? "wow" : "happy", t });
    },
    // server meneruskan kotak terkunci; pengintip hanya melihat huruf acak
    t11_server(ctx, b, l, t, TL, A) {
      const P = L(A);
      phone(ctx, P.ax, P.py, P.pw, P.phh, "Rani", C.tosca);
      phone(ctx, P.bx, P.py, P.pw, P.phh, "Bayu", C.pink);
      server(ctx, P.sx, P.sy, P.sw, P.sh, t);
      const k = clamp(l / Math.max(2, (b.audio || 4) + 0.3), 0, 1);
      const pts = [[P.ax + P.pw / 2, P.py + 120], [480, P.sy + P.sh / 2], [P.bx + P.pw / 2, P.py + 120]];
      const s = k < 0.5 ? k * 2 : (k - 0.5) * 2, a = pts[k < 0.5 ? 0 : 1], c = pts[k < 0.5 ? 1 : 2];
      ctx.save(); ctx.strokeStyle = "rgba(184,192,238,0.35)"; ctx.lineWidth = 5; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.stroke(); ctx.restore();
      const x = lerp(a[0], c[0], ease(s)), y = lerp(a[1], c[1], ease(s));
      ctx.save(); ctx.translate(x, y); ctx.scale(0.55, 0.55); box(ctx, 0, 0, 440, "Xq9#fL2@w!7", 1, 0, t); ctx.restore();
      // pengintip di jalan
      const um = pop(b, l, "mengintip");
      if (um > 0) {
        const ex = 480, ey = P.py + P.phh + 120;
        ctx.save(); ctx.translate(ex, ey); ctx.scale(um, um);
        ctx.fillStyle = C.panel2; ctx.beginPath(); ctx.arc(-170, 0, 60, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.ellipse(-170, -5, 40, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(-160 + Math.sin(t * 2) * 8, -5, 12, 0, Math.PI * 2); ctx.fill();
        card(ctx, -80, -50, 380, 100, { fill: C.panel, stroke: C.line, lw: 3, r: 24 });
        text(ctx, "“Xq9#fL2@w!7” ??", 110, 14, 36, { align: "center", weight: 800, color: C.pink, fit: 350 });
        ctx.restore();
      }
      const us = pop(b, l, "server hanya");
      if (us > 0) { ctx.save(); ctx.translate(480, P.sy + P.sh + 50); ctx.scale(us, us); pill(ctx, "tidak bisa membuka", 0, 0, 32, { fill: C.bad, color: C.ink }); ctx.restore(); }
    },
    // kunci rahasia membuka gembok di HP penerima; pesan kembali terbaca
    t11_buka(ctx, b, l, t, TL, A) {
      const y = A.y + 120, kin = ease(cue(b, l, "kunci") / 0.7), open = ease(cue(b, l, "membuka") / 0.4), clear = ease(cue(b, l, "terbaca") / 0.8);
      text(ctx, "Di HP Bayu", A.x, A.y + 50, 44, { weight: 900, color: C.pink });
      if (clear < 1) { ctx.save(); ctx.globalAlpha = 1 - clear; box(ctx, 480, y + 120, 780, MSG, 1 - open, 1 - clear * 0, t); ctx.restore(); }
      lock(ctx, 480, y + 300, 170, open, C.kuning);
      key(ctx, lerp(820, 560, kin), y + 360, 140, C.kuning, lerp(0, Math.PI, kin) + (open > 0 ? 0.6 * open : 0));
      if (clear > 0) {
        ctx.save(); ctx.globalAlpha = clear;
        card(ctx, A.x + 60, y + 520, 700, 140, { fill: C.pink, r: 40 });
        text(ctx, scramble(MSG, 1 - clear, t), A.x + 410, y + 610, 56, { align: "center", weight: 900, color: C.ink, fit: 640 }); ctx.restore();
        if (clear >= 1) check(ctx, A.x + 780, y + 590, 70, C.good);
      }
      if (A.bot - (y + 700) > 160) bip(ctx, 480, A.bot - 90, 140, { mood: clear >= 1 ? "happy" : "think", t });
    }
  });
})();
