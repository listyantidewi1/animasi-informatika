/* T37 Angka yang berputar balik ke nol (overflow) — adegan khusus. Batas 32 bit bertanda: 2.147.483.647; 64 bit: 9.223.372.036.854.775.807. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, fmt, cue, ph, pop } = T.helpers;

  // satu drum angka; v = nilai pecahan (mis. 8,4 = sedang bergulir dari 8 ke 9)
  function drum(ctx, x, y, w, h, v, col) {
    card(ctx, x, y, w, h, { fill: "#F2F4FF", r: 18 });
    ctx.save(); rr(ctx, x, y, w, h, 18); ctx.clip();
    const d = Math.floor(v), f = v - d;
    for (const [n, off] of [[d % 10, -f], [(d + 1) % 10, 1 - f]]) text(ctx, String(n), x + w / 2, y + h * 0.75 + off * h, h * 0.72, { align: "center", weight: 900, color: col || C.bg });
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, "rgba(11,14,42,0.45)"); g.addColorStop(0.25, "rgba(11,14,42,0)"); g.addColorStop(0.75, "rgba(11,14,42,0)"); g.addColorStop(1, "rgba(11,14,42,0.45)");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h); ctx.restore();
  }
  // penghitung tiga digit dari nilai n (pecahan untuk gulir)
  function counter(ctx, cx, y, n, w, h, col) {
    const ones = n % 10, tens = Math.floor(n / 10) % 10 + (ones > 9 ? 0 : 0);
    const f = n - Math.floor(n), base = Math.floor(n);
    const roll = k => { const p = Math.pow(10, k), q = Math.floor(base / p) % 10, carry = (base % p) === p - 1 || k === 0; return q + (carry ? f : 0); };
    card(ctx, cx - w * 1.5 - 40, y - 30, w * 3 + 80, h + 60, { fill: C.panel2, stroke: C.line, lw: 5, r: 26 });
    for (let k = 0; k < 3; k++) drum(ctx, cx + (1 - k) * (w + 10) - w / 2, y, w, h, roll(k), col);
  }

  Object.assign(T.SCENES, {
    // kait: 997, 998, 999 ... tambah satu -> 000
    t37_odo(ctx, b, l, t, TL, A) {
      const c = cue(b, l, "tambah satu");
      let n = 997 + clamp(ease((l - 0.3) / 0.3), 0, 1) + clamp(ease((l - 0.9) / 0.3), 0, 1);
      if (c > 0) n = 999 + ease(c / 0.6);
      const h = Math.min(250, A.h * 0.5), w = h * 0.72, y = A.y + (A.h - h) / 2 - 20;
      const zero = c > 0.6;
      counter(ctx, 480, y, n >= 1000 ? 1000 : n, w, h, zero ? C.bad : C.bg);
      const u = pop(b, l, "tambah satu");
      if (u > 0) { ctx.save(); ctx.translate(480, y + h + 90); ctx.scale(u, u); pill(ctx, "+1", 0, 0, 56, { fill: C.kuning }); ctx.restore(); }
      if (zero) { ctx.save(); ctx.globalAlpha = clamp(1 - (c - 0.6) / 0.5, 0, 1); ctx.strokeStyle = C.bad; ctx.lineWidth = 12; rr(ctx, 480 - w * 1.5 - 60, y - 50, w * 3 + 120, h + 100, 34); ctx.stroke(); ctx.restore(); }
    },
    // 999 + 1 = 1000, tetapi hanya ada tiga kotak: angka 1 terbuang
    t37_digit(ctx, b, l, t, TL, A) {
      text(ctx, "999 + 1 = 1000", 480, A.y + 110, 96, { align: "center", weight: 900, color: C.ink, shadow: true });
      const ut = pop(b, l, "tiga digit");
      if (ut > 0) { ctx.save(); ctx.translate(480, A.y + 220); ctx.scale(ut, ut); pill(ctx, "tempat: 3 digit", 0, 0, 40, { fill: C.biru, color: C.ink }); ctx.restore(); }
      const bw = 170, bh = 230, y = A.y + 320, x0 = 480 - bw * 1.5 + 60;
      for (let i = 0; i < 3; i++) { card(ctx, x0 + i * (bw + 10), y, bw, bh, { fill: "#F2F4FF", stroke: C.biru, lw: 6, r: 20 });
        if (cue(b, l, "angka 1000") > 0.3 + i * 0.1) text(ctx, "0", x0 + i * (bw + 10) + bw / 2, y + bh * 0.75, 170, { align: "center", weight: 900, color: C.bg }); }
      // angka 1 di luar kotak, jatuh saat "terbuang"
      const u1 = pop(b, l, "empat digit"), fall = clamp(cue(b, l, "terbuang") / 0.9, 0, 1);
      if (u1 > 0) { ctx.save(); ctx.translate(x0 - 120, y + bh * 0.5 + fall * fall * 600); ctx.rotate(fall * 1.6); ctx.globalAlpha = 1 - fall * 0.7; ctx.scale(u1, u1);
        card(ctx, -80, -115, 160, 230, { fill: C.badBg, stroke: C.bad, lw: 6, r: 20 });
        text(ctx, "1", 0, 60, 170, { align: "center", weight: 900, color: C.bad }); ctx.restore(); }
      const ub = pop(b, l, "terbuang");
      if (ub > 0) { ctx.save(); ctx.translate(560, y + bh + 120); ctx.scale(ub, ub); pill(ctx, "yang tersisa: 000", 0, 0, 46, { fill: C.bad, color: C.ink }); ctx.restore(); }
    },
    // satu byte = delapan bit; 11111111 = 255
    t37_byte(ctx, b, l, t, TL, A) {
      const ub = pop(b, l, "satu byte");
      if (ub > 0) { ctx.save(); ctx.translate(480, A.y + 80); ctx.scale(ub, ub); pill(ctx, "1 byte = 8 bit", 0, 0, 58, { fill: C.kuning }); ctx.restore(); }
      const w = 92, gap = 10, x0 = 480 - (8 * w + 7 * gap) / 2, y = A.y + 260, PV = [128, 64, 32, 16, 8, 4, 2, 1];
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        const on = cue(b, l, "delapan bit") > (7 - i) * 0.12 ? 1 : 0; if (on) sum += PV[i];
        const x = x0 + i * (w + gap);
        card(ctx, x, y, w, 140, { fill: on ? C.tosca : C.panel, stroke: on ? null : C.line, lw: 4, r: 16, glow: on ? "rgba(34,227,196,0.5)" : null });
        text(ctx, on ? "1" : "0", x + w / 2, y + 100, 80, { align: "center", weight: 900, color: on ? C.bg : C.ink2 });
        text(ctx, String(PV[i]), x + w / 2, y + 190, 30, { align: "center", weight: 800, color: C.ink2 });
      }
      const u0 = pop(b, l, "0 sampai");
      if (u0 > 0) {
        ctx.save(); ctx.translate(480, A.y + 620); ctx.scale(u0, u0);
        text(ctx, "0", -250, 40, 120, { align: "center", weight: 900, color: C.ink });
        text(ctx, "sampai", 0, 20, 48, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, "255", 250, 40, 120, { align: "center", weight: 900, color: C.kuning, shadow: true }); ctx.restore();
        text(ctx, "angka terbesar dalam 1 byte", 480, A.y + 760, 38, { align: "center", weight: 700, color: C.ink2 });
      } else if (sum > 0) text(ctx, "= " + sum, 480, A.y + 660, 100, { align: "center", weight: 900, color: C.ink });
      bip(ctx, 480, A.bot - 110, Math.min(190, A.bot - A.y - 820), { mood: u0 > 0 ? "wow" : "think", t });
    },
    // 255 + 1: bit berbalik satu per satu ke 0, sisa 1 jatuh keluar -> 0
    t37_balik(ctx, b, l, t, TL, A) {
      const w = 92, gap = 10, x0 = 480 - (8 * w + 7 * gap) / 2, y = A.y + 230;
      const c = cue(b, l, "berputar") + 0.3;
      text(ctx, "255 + 1", 480, A.y + 110, 90, { align: "center", weight: 900, color: C.ink, shadow: true });
      let flipped = 0;
      for (let i = 7; i >= 0; i--) {
        const k = 7 - i, off = c > k * 0.12;
        if (off) flipped++;
        const x = x0 + i * (w + gap);
        card(ctx, x, y, w, 140, { fill: off ? C.panel : C.tosca, stroke: off ? C.bad : null, lw: 4, r: 16 });
        text(ctx, off ? "0" : "1", x + w / 2, y + 100, 80, { align: "center", weight: 900, color: off ? C.bad : C.bg });
      }
      // bit "carry" yang terlempar keluar di kiri
      const fall = clamp((c - 1.0) / 0.9, 0, 1);
      if (c > 0.96) { ctx.save(); ctx.translate(x0 - 30, y + 70 + fall * fall * 500); ctx.rotate(-fall * 1.2); ctx.globalAlpha = 1 - fall;
        card(ctx, -40, -60, 80, 120, { fill: C.badBg, stroke: C.bad, lw: 4, r: 14 }); text(ctx, "1", 0, 30, 70, { align: "center", weight: 900, color: C.bad }); ctx.restore(); }
      const zero = flipped === 8;
      text(ctx, zero ? "= 0" : "= 255", 480, A.y + 560, 150, { align: "center", weight: 900, color: zero ? C.bad : C.kuning, shadow: true });
      const uo = pop(b, l, "overflow");
      if (uo > 0) { ctx.save(); ctx.translate(480, A.y + 740); ctx.rotate(-0.06); ctx.scale(uo, uo);
        card(ctx, -260, -64, 520, 128, { fill: C.bad, r: 24 }); text(ctx, "OVERFLOW!", 0, 26, 76, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
    },
    // penghitung tayangan video mendekati batas 2.147.483.647, lalu batasnya diperbesar
    t37_tayang(ctx, b, l, t, TL, A) {
      const vx = 130, vy = A.y + 20, vw = 700, vh = 330;
      card(ctx, vx, vy, vw, vh, { fill: "#2A2F6E", r: 26 });
      for (let i = 0; i < 5; i++) { ctx.fillStyle = [C.pink, C.biru, C.tosca, C.kuning, C.pink][i]; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(vx + 100 + i * 130, vy + vh / 2 + Math.sin(l * 3 + i) * 50, 50, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
      ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.beginPath(); ctx.arc(480, vy + vh / 2, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.bg; ctx.beginPath(); ctx.moveTo(460, vy + vh / 2 - 36); ctx.lineTo(505, vy + vh / 2); ctx.lineTo(460, vy + vh / 2 + 36); ctx.closePath(); ctx.fill();
      text(ctx, "Video musik", vx + 30, vy + 60, 36, { weight: 800, color: C.ink });
      const big = cue(b, l, "sehingga") > 0.4, cnt = 2147483647 * (0.86 + 0.14 * ease(cue(b, l, 0.05) / 2.6));
      const v = big ? 2147483647 + (cue(b, l, "sehingga") - 0.4) * 9000000 : cnt;
      text(ctx, "Ditonton", 480, vy + vh + 80, 40, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, fmt(v) + " kali", 480, vy + vh + 175, 80, { align: "center", weight: 900, color: C.ink, fit: 820 });
      const by = vy + vh + 240, bw = 800, bx = 80, lim = big ? 0.12 : 1, fill = big ? 0.12 * (v / 2147483647) * 0.98 : v / 2147483647;
      card(ctx, bx, by, bw, 60, { fill: C.panel, r: 30 });
      card(ctx, bx, by, Math.min(bw, bw * fill), 60, { fill: fill > 0.97 && !big ? C.bad : C.biru, r: 30 });
      ctx.strokeStyle = C.kuning; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx + bw * lim, by - 20); ctx.lineTo(bx + bw * lim, by + 80); ctx.stroke();
      if (!big) { text(ctx, "batas lama", bx + bw - 10, by + 130, 34, { align: "right", weight: 800, color: C.kuning }); text(ctx, "2.147.483.647", bx + bw - 10, by + 175, 40, { align: "right", weight: 900, color: C.ink }); }
      else {
        const ub = pop(b, l, "diperbesar");
        text(ctx, "batas lama", bx + bw * lim, by + 130, 30, { align: "center", weight: 800, color: C.kuning });
        if (ub > 0) { ctx.save(); ctx.translate(480, by + 250); ctx.scale(ub, ub);
          card(ctx, -400, -80, 800, 160, { fill: C.goodBg, stroke: C.good, lw: 5, r: 26 });
          text(ctx, "batas baru", 0, -18, 34, { align: "center", weight: 800, color: C.good });
          text(ctx, "9.223.372.036.854.775.807", 0, 44, 52, { align: "center", weight: 900, color: C.ink, fit: 760 }); ctx.restore(); }
      }
    }
  });
})();
