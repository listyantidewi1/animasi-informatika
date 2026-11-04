/* T30 Cloud itu komputer milik orang lain — adegan khusus. Foto, gedung, dan perangkat digambar dengan kode (rekaan). */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, cross, bip, rnd, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;

  function cloud(ctx, cx, cy, s, col) {
    ctx.save(); ctx.fillStyle = col || "#E8ECFF"; ctx.beginPath();
    ctx.arc(cx - s * 0.32, cy + s * 0.05, s * 0.24, 0, Math.PI * 2); ctx.arc(cx, cy - s * 0.12, s * 0.32, 0, Math.PI * 2); ctx.arc(cx + s * 0.33, cy + s * 0.04, s * 0.25, 0, Math.PI * 2);
    ctx.fill(); rr(ctx, cx - s * 0.56, cy + s * 0.02, s * 1.12, s * 0.27, s * 0.13); ctx.fill(); ctx.restore();
  }
  function photo(ctx, x, y, w, h) {
    ctx.save(); rr(ctx, x, y, w, h, Math.min(w, h) * 0.1); ctx.clip();
    ctx.fillStyle = "#4DA3FF"; ctx.fillRect(x, y, w, h); ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(x + w * 0.72, y + h * 0.3, h * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1E9E7E"; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w * 0.35, y + h * 0.45); ctx.lineTo(x + w * 0.62, y + h * 0.78); ctx.lineTo(x + w * 0.8, y + h * 0.6); ctx.lineTo(x + w, y + h * 0.85); ctx.lineTo(x + w, y + h); ctx.fill(); ctx.restore();
  }
  function rack(ctx, cx, cy, s, t, seed = 0) {
    card(ctx, cx - s * 0.5, cy - s * 0.6, s, s * 1.2, { fill: C.panel2, r: 12, stroke: C.line, lw: 4 });
    for (let i = 0; i < 4; i++) { ctx.fillStyle = "#3A4590"; rr(ctx, cx - s * 0.4, cy - s * 0.5 + i * s * 0.27, s * 0.8, s * 0.18, 5); ctx.fill();
      for (let j = 0; j < 2; j++) { ctx.fillStyle = rnd(seed * 13 + i * 3 + j + Math.floor(t * 3)) > 0.4 ? (j ? C.kuning : C.tosca) : "#1B2257"; ctx.beginPath(); ctx.arc(cx + s * (0.2 + j * 0.12), cy - s * 0.41 + i * s * 0.27, s * 0.035, 0, Math.PI * 2); ctx.fill(); } }
  }
  function phone(ctx, cx, cy, s, col) {
    card(ctx, cx - s * 0.3, cy - s * 0.5, s * 0.6, s, { fill: "#05061A", r: s * 0.1, stroke: C.ink2, lw: 5 });
    card(ctx, cx - s * 0.25, cy - s * 0.43, s * 0.5, s * 0.84, { fill: col || C.bg2, r: s * 0.06 });
  }
  function laptop(ctx, cx, cy, s) {
    card(ctx, cx - s * 0.5, cy - s * 0.4, s, s * 0.62, { fill: "#05061A", r: 10, stroke: C.ink2, lw: 5 });
    card(ctx, cx - s * 0.62, cy + s * 0.24, s * 1.24, s * 0.12, { fill: C.ink2, r: 6 });
  }
  function monitor(ctx, cx, cy, s) {
    card(ctx, cx - s * 0.55, cy - s * 0.4, s * 1.1, s * 0.7, { fill: "#05061A", r: 10, stroke: C.ink2, lw: 5 });
    ctx.fillStyle = C.ink2; ctx.fillRect(cx - 8, cy + s * 0.3, 16, s * 0.15); ctx.fillRect(cx - s * 0.25, cy + s * 0.43, s * 0.5, 10);
  }

  Object.assign(T.SCENES, {
    // di bawah kait: awan "dibuka", ternyata isinya server
    t30_kait(ctx, b, l, t, TL, A) {
      const cy = A.y + Math.min(A.h, 560) * 0.45, up = ease(clamp((l - 0.2) / 0.9, 0, 1)), open = ph(b, l, "komputer", 0.6);
      if (up < 1) photo(ctx, 400, lerp(cy + 220, cy - 30, up), 160, 120);
      ctx.save(); ctx.globalAlpha = 1 - open * 0.85; ctx.translate(0, -open * 140); cloud(ctx, 480, cy, 520); ctx.restore();
      if (open > 0) { ctx.save(); ctx.globalAlpha = open; rack(ctx, 380, cy + 40, 170, t, 1); rack(ctx, 580, cy + 40, 170, t, 2);
        ctx.restore(); }
      const uo = pop(b, l, "orang lain");
      if (uo > 0) { ctx.save(); ctx.translate(480, cy + 230); ctx.scale(uo, uo); pill(ctx, "komputer milik orang lain", 0, 0, 44, { fill: C.kuning }); ctx.restore(); }
    },

    // upload dari HP ke server penyedia
    t30_upload(ctx, b, l, t, TL, A) {
      const y = A.y + 20;
      phone(ctx, 200, y + 560, 380); photo(ctx, 140, y + 470, 120, 90);
      const k = ph(b, l, "menyimpan", 1.2);
      rack(ctx, 700, y + 200, 260, t, 3);
      text(ctx, "Perusahaan penyedia", 700, y + 410, 38, { align: "center", weight: 800, color: C.ink2, fit: 360 });
      const us = pop(b, l, "server");
      if (us > 0) { ctx.save(); ctx.translate(700, y + 470); ctx.scale(us, us); pill(ctx, "server", 0, 0, 46, { fill: C.tosca }); ctx.restore(); }
      if (k > 0) {
        ctx.save(); ctx.strokeStyle = "rgba(184,192,238,0.4)"; ctx.lineWidth = 8; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(260, y + 420); ctx.quadraticCurveTo(400, y + 160, 560, y + 200); ctx.stroke(); ctx.restore();
        const px = k < 1 ? lerp(200, 640, k) : 640, py = k < 1 ? lerp(y + 470, y + 180, k) - Math.sin(k * Math.PI) * 80 : y + 180;
        if (k < 1) photo(ctx, px - 50, py - 38, 100, 76); else { card(ctx, 640, y + 140, 120, 92, { fill: C.ink, r: 10 }); photo(ctx, 646, y + 146, 108, 80); }
        // bilah upload di layar HP
        card(ctx, 110, y + 600, 180, 22, { fill: C.panel2, r: 11 }); card(ctx, 110, y + 600, Math.max(22, 180 * k), 22, { fill: C.tosca, r: 11 });
        text(ctx, "upload " + Math.round(100 * k) + "%", 200, y + 660, 30, { align: "center", weight: 800, color: C.ink });
      }
      const by = y + 820; if (A.bot - by > 140) bip(ctx, 600, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: k >= 1 ? "happy" : "wow", t });
    },

    // pusat data: deretan server, siang dan malam
    t30_pusat(ctx, b, l, t, TL, A) {
      const y = A.y + 20, night = (Math.sin(l * 1.6) + 1) / 2, ub = ph(b, l, "pusat data", 0.6);
      // langit siang/malam
      card(ctx, 80, y, 800, 300, { fill: `rgb(${Math.round(lerp(77, 20, night))},${Math.round(lerp(163, 26, night))},${Math.round(lerp(255, 69, night))})`, r: 30 });
      ctx.save(); rr(ctx, 80, y, 800, 300, 30); ctx.clip();
      const a = l * 1.6; ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(480 + Math.cos(a + Math.PI) * 300, y + 260 - Math.abs(Math.sin(a + Math.PI / 2)) * 0 - Math.sin(a + Math.PI) * -0 - (1 - night) * 160, 46, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#F4F6FF"; ctx.globalAlpha = night; ctx.beginPath(); ctx.arc(700, y + 90, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgb(${Math.round(lerp(77, 20, night))},${Math.round(lerp(163, 26, night))},${Math.round(lerp(255, 69, night))})`; ctx.beginPath(); ctx.arc(716, y + 80, 30, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      // gedung
      card(ctx, 140, y + 140, 680, 230, { fill: "#2B3270", r: 16 });
      text(ctx, "PUSAT DATA", 480, y + 215, 48, { align: "center", weight: 900, color: ub > 0 ? C.kuning : C.ink2 });
      for (let i = 0; i < 8; i++) { ctx.fillStyle = rnd(i + Math.floor(t * 2)) > 0.3 ? C.kuning : "#1B2257"; rr(ctx, 180 + i * 80, y + 260, 50, 70, 6); ctx.fill(); }
      // deretan server di dalam
      const ry = y + 520;
      for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) { const u = clamp(ph(b, l, "berjajar", 0.3) * 5 - i * 0.6 - r * 0.5, 0, 1); if (u <= 0) continue; ctx.save(); ctx.globalAlpha = u; rack(ctx, 160 + i * 160, ry + r * 200, 150, t, i + 5 + r * 7); ctx.restore(); }
      const us = pop(b, l, "siang malam"), sy = ry + 330;
      if (us > 0 && sy + 40 < A.bot) { ctx.save(); ctx.translate(480, sy); ctx.scale(us, us); pill(ctx, "menyala 24 jam", 0, 0, 46, { fill: C.tosca }); ctx.restore(); }
    },

    // disalin ke beberapa server: HP hilang, file tetap ada
    t30_salin(ctx, b, l, t, TL, A) {
      const y = A.y + 20, xs = [200, 480, 760], names = ["Gedung A", "Gedung B", "Gedung C"];
      xs.forEach((x, i) => {
        const u = pop(b, l, "disalin", 0.4 + i * 0.12); rack(ctx, x, y + 180, 220, t, i + 9);
        text(ctx, names[i], x, y + 360, 38, { align: "center", weight: 800, color: C.ink2 });
        if (u > 0) { ctx.save(); ctx.translate(x, y + 180); ctx.scale(u, u); card(ctx, -62, -48, 124, 96, { fill: C.ink, r: 10 }); photo(ctx, -56, -42, 112, 84); ctx.restore(); }
      });
      const ph1 = ph(b, l, "hilang", 0.5), py = y + 640;
      ctx.save(); ctx.globalAlpha = 1 - ph1 * 0.6; phone(ctx, 280, py, 320); photo(ctx, 232, py - 80, 96, 72); ctx.restore();
      if (ph1 > 0) { cross(ctx, 280, py, 180 * ph1, C.bad); text(ctx, "HP hilang", 280, py + 210, 42, { align: "center", weight: 900, color: C.bad }); }
      const ut = pop(b, l, "tetap ada");
      if (ut > 0) { ctx.save(); ctx.translate(650, py); ctx.scale(ut, ut); card(ctx, -170, -100, 340, 200, { fill: C.goodBg, stroke: C.good, lw: 5 });
        check(ctx, 0, -30, 70, C.good); text(ctx, "File tetap ada", 0, 60, 40, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
    },

    // file yang sama dibuka dari HP, laptop, komputer lain
    t30_akses(ctx, b, l, t, TL, A) {
      const cx = 480, cy = A.y + 170;
      cloud(ctx, cx, cy, 420, "#2B3270"); rack(ctx, cx, cy + 10, 110, t, 20);
      const devs = [["HP", 180, A.y + 600, (x, y) => phone(ctx, x, y, 240), [-40, -55, 80, 60]], ["laptop", 480, A.y + 640, (x, y) => laptop(ctx, x, y, 220), [-90, -70, 180, 120]], ["komputer lain", 780, A.y + 600, (x, y) => monitor(ctx, x, y, 200), [-90, -60, 180, 120]]];
      devs.forEach(([nm, x, y, fn, ph0], i) => {
        const u = pop(b, l, nm === "komputer lain" ? "komputer" : nm); if (u <= 0) return;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        ctx.strokeStyle = C.tosca; ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -l * 40; ctx.beginPath(); ctx.moveTo(cx, cy + 90); ctx.lineTo(x, y - 140); ctx.stroke(); ctx.setLineDash([]);
        fn(x, y); photo(ctx, x + ph0[0] + 6, y + ph0[1] + 6, ph0[2] - 12, ph0[3] - 12);
        text(ctx, nm, x, y + 170, 38, { align: "center", weight: 800, color: C.ink, fit: 220 }); ctx.restore();
      });
      const us = pop(b, l, "file yang sama"), sy = A.y + 900;
      if (us > 0 && sy + 40 < A.bot) { ctx.save(); ctx.translate(480, sy); ctx.scale(us, us); pill(ctx, "foto yang sama di mana saja", 0, 0, 44, { fill: C.kuning }); ctx.restore(); }
    }
  });
})();
