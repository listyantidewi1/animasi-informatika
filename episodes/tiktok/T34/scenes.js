/* T34 Bagaimana HP tahu kamu sedang di mana? — adegan khusus. Peta dan angka contoh; jarak satelit GPS sekitar 20.200 km. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;

  function satelit(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
    ctx.fillStyle = C.biru; for (const k of [-1, 1]) { ctx.fillRect(k > 0 ? s * 0.28 : -s * 0.98, -s * 0.2, s * 0.7, s * 0.4); }
    ctx.strokeStyle = C.bg; ctx.lineWidth = s * 0.04;
    for (const k of [-1, 1]) for (let i = 1; i < 4; i++) { const xx = k > 0 ? s * 0.28 + i * s * 0.175 : -s * 0.98 + i * s * 0.175; ctx.beginPath(); ctx.moveTo(xx, -s * 0.2); ctx.lineTo(xx, s * 0.2); ctx.stroke(); }
    ctx.fillStyle = C.ink2; ctx.fillRect(-s * 0.3, -s * 0.04, s * 0.6, s * 0.08);
    card(ctx, -s * 0.24, -s * 0.3, s * 0.48, s * 0.6, { fill: C.kuning, r: s * 0.08 });
    ctx.restore();
  }
  function hp(ctx, x, y, s, col) {      // HP kecil (ikon)
    card(ctx, x - s * 0.3, y - s * 0.5, s * 0.6, s, { fill: "#05071A", stroke: col || C.ink, lw: s * 0.05, r: s * 0.1 });
    card(ctx, x - s * 0.24, y - s * 0.4, s * 0.48, s * 0.78, { fill: C.biru, r: s * 0.05 });
  }
  function pin(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = col || C.pink;
    ctx.beginPath(); ctx.arc(0, -s * 0.62, s * 0.36, Math.PI * 0.82, Math.PI * 0.18); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, -s * 0.62, s * 0.14, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function wifi(ctx, x, y, s, col, u = 1) {
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * 0.1; ctx.lineCap = "round";
    for (let i = 1; i <= 3; i++) { if (u * 3 < i - 0.5) continue; ctx.beginPath(); ctx.arc(x, y, s * 0.22 * i, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y, s * 0.08, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // kait: peta kota, titik biru berdenyut, pin jatuh tepat di titik itu
    t34_peta(ctx, b, l, t, TL, A) {
      const h = Math.min(640, A.h - 20), w = 820, x = 70, y = A.y + (A.h - h) / 2;
      ctx.save(); card(ctx, x, y, w, h, { fill: "#16365A", r: 34 }); rr(ctx, x, y, w, h, 34); ctx.clip();
      ctx.fillStyle = "#1E4A73"; for (let i = 0; i < 18; i++) ctx.fillRect(x + (i % 6) * 145 + 20, y + Math.floor(i / 6) * 230 + 25, 110, 190);
      ctx.fillStyle = "#1C5E4A"; ctx.beginPath(); ctx.ellipse(x + 640, y + 140, 120, 80, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#E6EBFF"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x, y + h * 0.62); ctx.lineTo(x + w, y + h * 0.42); ctx.moveTo(x + w * 0.38, y); ctx.lineTo(x + w * 0.46, y + h); ctx.stroke();
      ctx.restore();
      const px = x + w * 0.42, py = y + h * 0.52;
      for (let k = 0; k < 2; k++) { const r = 20 + ((l * 50 + k * 40) % 80); ctx.fillStyle = `rgba(77,163,255,${0.5 * (1 - r / 100)})`; ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.biru; ctx.beginPath(); ctx.arc(px, py, 15, 0, Math.PI * 2); ctx.fill();
      const dp = ease((l - 0.4) / 0.5); if (dp > 0) pin(ctx, px, py - (1 - dp) * 300, 110, C.pink);
      const ut = pop(b, l, "tanpa internet");
      if (ut > 0) { ctx.save(); ctx.translate(x + w - 200, y + 70); ctx.scale(ut, ut);
        card(ctx, -170, -45, 340, 90, { fill: C.bg, stroke: C.kuning, lw: 4, r: 45 });
        wifi(ctx, -115, 22, 80, C.ink2); ctx.strokeStyle = C.bad; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-145, -25); ctx.lineTo(-85, 30); ctx.stroke();
        text(ctx, "tanpa internet", 35, 12, 32, { align: "center", weight: 800, color: C.kuning }); ctx.restore(); }
    },
    // satelit GPS di atas bumi memancarkan sinyal waktu
    t34_satelit(ctx, b, l, t, TL, A) {
      const ex = 480, ey = A.bot + 620, er = 820;
      ctx.save(); ctx.beginPath(); ctx.rect(0, A.y, 1080, A.bot - A.y + 20); ctx.clip();
      const g = ctx.createRadialGradient(ex, ey - er * 0.6, 100, ex, ey, er);
      g.addColorStop(0, "#3FA3FF"); g.addColorStop(1, "#1A4F9C"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2E9E6E"; ctx.beginPath(); ctx.ellipse(ex - 220, ey - er + 70, 150, 45, 0.25, 0, Math.PI * 2); ctx.ellipse(ex + 240, ey - er + 80, 120, 50, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      const SP = [[150, A.y + 420], [330, A.y + 330], [560, A.y + 310], [770, A.y + 380], [450, A.y + 500]], us = pop(b, l, "satelit");
      SP.forEach(([sx0, sy0], i) => {
        if (us <= 0) return;
        const sx = sx0 + Math.sin(l * 0.8 + i) * 14, sy = sy0 + Math.cos(l * 0.7 + i * 2) * 10;
        if (cue(b, l, "memancarkan") > 0) for (let k = 0; k < 2; k++) {
          const r = ((l * 140 + k * 110 + i * 37) % 220); ctx.strokeStyle = `rgba(255,210,63,${0.8 * (1 - r / 220)})`; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.arc(sx, sy, r + 30, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.save(); ctx.globalAlpha = clamp(us, 0, 1); satelit(ctx, sx, sy, 80 * clamp(us, 0, 1.1), (i - 2) * 0.15); ctx.restore();
      });
      const uk = pop(b, l, "jauh");
      if (uk > 0) { ctx.save(); ctx.translate(480, A.y + 70); ctx.scale(uk, uk); pill(ctx, "±20.000 km di atas bumi", 0, 0, 44, { fill: C.kuning }); ctx.restore(); }
      const uw = pop(b, l, "waktu");
      if (uw > 0) { ctx.save(); ctx.translate(480, A.y + 190); ctx.scale(uw, uw);
        card(ctx, -260, -50, 520, 100, { fill: C.panel, stroke: C.kuning, lw: 4, r: 24 });
        const ms = Math.floor((t * 1000) % 1000), ss = Math.floor(t % 60);
        text(ctx, `07.30.${String(15 + ss % 40).padStart(2, "0")},${String(ms).padStart(3, "0")}`, 0, 22, 56, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
      hp(ctx, 480, A.bot - 140, 110, C.kuning);
    },
    // lama perjalanan sinyal -> jarak
    t34_jarak(ctx, b, l, t, TL, A) {
      const sx = 300, sy = A.y + 90, px = 300, py = A.bot - 130;
      satelit(ctx, sx, sy, 80, 0); hp(ctx, px, py, 150, C.kuning);
      ctx.strokeStyle = "rgba(184,192,238,0.3)"; ctx.lineWidth = 4; ctx.setLineDash([12, 14]); ctx.beginPath(); ctx.moveTo(sx, sy + 70); ctx.lineTo(px, py - 90); ctx.stroke(); ctx.setLineDash([]);
      const k = clamp(cue(b, l, 0.02) / 1.4, 0, 1);    // gelombang berjalan turun
      const wy = lerp(sy + 70, py - 90, ease(k));
      ctx.strokeStyle = C.kuning; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(px, wy, 40, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
      ctx.beginPath(); ctx.arc(px, wy - 26, 60, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
      const rx = 520, ut = pop(b, l, "berapa lama");
      if (ut > 0) { ctx.save(); ctx.translate(rx + 170, A.y + 200); ctx.scale(ut, ut);
        card(ctx, -190, -90, 380, 180, { fill: C.panel, stroke: C.line, lw: 4, r: 26 });
        text(ctx, "waktu tiba", 0, -38, 32, { align: "center", weight: 700, color: C.ink2 });
        const v = 0.067 * ease(cue(b, l, "berapa lama") / 1.2);
        text(ctx, v.toFixed(3).replace(".", ","), 0, 40, 76, { align: "center", weight: 900, color: C.kuning });
        text(ctx, "detik", 0, 80, 28, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
      const uc = pop(b, l, "lalu");
      if (uc > 0) { ctx.save(); ctx.globalAlpha = clamp(uc, 0, 1);
        text(ctx, "× kecepatan cahaya", rx + 170, A.y + 370, 36, { align: "center", weight: 800, color: C.ink });
        text(ctx, "±300.000 km per detik", rx + 170, A.y + 415, 30, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
      const uj = pop(b, l, "jaraknya");
      if (uj > 0) { ctx.save(); ctx.translate(rx + 170, A.y + 560); ctx.scale(uj, uj);
        card(ctx, -190, -90, 380, 180, { fill: C.goodBg, stroke: C.good, lw: 5, r: 26 });
        text(ctx, "jarak", 0, -38, 32, { align: "center", weight: 700, color: C.ink2 });
        text(ctx, "±20.000", 0, 34, 72, { align: "center", weight: 900, color: C.good });
        text(ctx, "km", 0, 76, 30, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); }
      if (uj > 0) bip(ctx, rx + 170, A.bot - 110, Math.min(180, A.bot - A.y - 760), { mood: "wow", t });
    },
    // empat lingkaran jarak bertemu di satu titik
    t34_titik(ctx, b, l, t, TL, A) {
      const P = [470, A.y + A.h * 0.56];
      const S = [[150, A.y + 110], [820, A.y + 150], [140, A.bot - 60], [800, A.bot - 40]];
      ctx.save(); rr(ctx, 60, A.y, 830, A.h, 30); ctx.clip();
      S.forEach(([sx, sy], i) => {
        const u = ease(cue(b, l, "empat") / 0.4 - i * 0.6); if (u <= 0) return;
        const r = Math.hypot(P[0] - sx, P[1] - sy);
        ctx.strokeStyle = [C.kuning, C.pink, C.tosca, C.biru][i]; ctx.lineWidth = 6; ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.arc(sx, sy, r * u, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      });
      ctx.restore();
      S.forEach(([sx, sy], i) => satelit(ctx, sx, sy, 50, 0.3 * (i - 1.5)));
      const ut = pop(b, l, "satu titik");
      if (ut > 0) {
        ctx.save(); ctx.fillStyle = "rgba(255,79,154,0.3)"; ctx.beginPath(); ctx.arc(P[0], P[1], 40 + 20 * Math.sin(l * 6), 0, Math.PI * 2); ctx.fill(); ctx.restore();
        pin(ctx, P[0], P[1] - (1 - clamp(ut, 0, 1)) * 200, 120, C.pink);
        ctx.save(); ctx.translate(P[0], P[1] + 80); ctx.scale(ut, ut); pill(ctx, "Kamu di sini!", 0, 0, 40, { fill: C.kuning }); ctx.restore();
      }
    },
    // di dalam gedung: sinyal satelit melemah, HP dibantu WiFi dan menara seluler
    t34_gedung(ctx, b, l, t, TL, A) {
      satelit(ctx, 250, A.y + 70, 60, 0.2);
      const gx = 120, gy = A.y + 300, gw = 470, gh = A.bot - gy - 20;
      // sinyal satelit turun lalu memudar di atap
      for (let k = 0; k < 3; k++) { const yy = A.y + 130 + ((l * 120 + k * 60) % 170); ctx.strokeStyle = `rgba(255,210,63,${clamp((gy - yy) / 170, 0, 1) * 0.9})`;
        ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(330, yy, 50, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
      const um = pop(b, l, "melemah");
      if (um > 0) { ctx.save(); ctx.translate(560, A.y + 150); ctx.scale(um, um); pill(ctx, "sinyal lemah", 0, 0, 34, { fill: C.bad, color: C.ink }); ctx.restore(); }
      card(ctx, gx, gy, gw, gh, { fill: C.panel, stroke: C.line, lw: 6, r: 12 });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { if (r === 2 && c < 2) continue; ctx.fillStyle = "rgba(77,163,255,0.25)"; ctx.fillRect(gx + 30 + c * 110, gy + 30 + r * (gh - 60) / 4, 70, (gh - 60) / 4 - 40); }
      const px = gx + 130, py = gy + 30 + 2 * (gh - 60) / 4 + 40;
      hp(ctx, px, py, 110, C.kuning);
      const uw = pop(b, l, "wifi");
      if (uw > 0) { const rx = gx + 330, ry = py + 20;
        card(ctx, rx - 60, ry, 120, 50, { fill: C.panel2, stroke: C.tosca, lw: 4, r: 12 }); wifi(ctx, rx, ry - 10, 120 * clamp(uw, 0, 1), C.tosca, (l * 1.5) % 1.2);
        text(ctx, "WiFi", rx, ry + 100, 36, { align: "center", weight: 900, color: C.tosca });
        ctx.strokeStyle = C.tosca; ctx.lineWidth = 4; ctx.setLineDash([8, 10]); ctx.beginPath(); ctx.moveTo(rx - 70, ry + 20); ctx.lineTo(px + 50, py); ctx.stroke(); ctx.setLineDash([]); }
      const ut = pop(b, l, "menara");
      if (ut > 0) { const tx = 760, ty = A.bot - 20, th = Math.min(420, gh);
        ctx.save(); ctx.globalAlpha = clamp(ut, 0, 1); ctx.strokeStyle = C.pink; ctx.lineWidth = 8; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(tx - 70, ty); ctx.lineTo(tx, ty - th); ctx.lineTo(tx + 70, ty); ctx.moveTo(tx - 45, ty - th * 0.35); ctx.lineTo(tx + 45, ty - th * 0.35); ctx.moveTo(tx - 25, ty - th * 0.65); ctx.lineTo(tx + 25, ty - th * 0.65); ctx.stroke();
        for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(tx, ty - th, 26 * i + (l * 20) % 26, Math.PI * 0.75, Math.PI * 1.25); ctx.stroke(); ctx.beginPath(); ctx.arc(tx, ty - th, 26 * i + (l * 20) % 26, -Math.PI * 0.25, Math.PI * 0.25); ctx.stroke(); }
        text(ctx, "Menara", tx, ty - th - 120, 34, { align: "center", weight: 900, color: C.pink });
        text(ctx, "seluler", tx, ty - th - 82, 34, { align: "center", weight: 900, color: C.pink });
        ctx.setLineDash([8, 10]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tx - 50, ty - th + 30); ctx.lineTo(px + 50, py - 20); ctx.stroke(); ctx.restore(); }
    }
  });
})();
