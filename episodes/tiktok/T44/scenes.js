/* T44 Kenapa layar sentuh tahu jarimu, tapi tidak tahu pulpen? — adegan khusus (layar kapasitif, disederhanakan). */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const SKIN = "#D9A27A";

  function jari(ctx, x, y, s, a) {           // jari telunjuk dari bawah; (x, y) = ujung jari
    ctx.save(); ctx.translate(x, y); ctx.rotate(a || 0);
    ctx.fillStyle = SKIN; rr(ctx, -s * 0.14, 0, s * 0.28, s * 1.2, s * 0.14); ctx.fill();
    ctx.fillStyle = "#F3D3BE"; rr(ctx, -s * 0.09, s * 0.04, s * 0.18, s * 0.2, s * 0.07); ctx.fill();
    ctx.strokeStyle = "#B57B55"; ctx.lineWidth = s * 0.015; ctx.beginPath(); ctx.moveTo(-s * 0.08, s * 0.5); ctx.lineTo(s * 0.08, s * 0.5); ctx.moveTo(-s * 0.08, s * 0.8); ctx.lineTo(s * 0.08, s * 0.8); ctx.stroke();
    ctx.restore();
  }
  function pulpen(ctx, x, y, s, a, stylus) {  // (x, y) = ujung
    ctx.save(); ctx.translate(x, y); ctx.rotate(a || 0);
    if (stylus) { ctx.fillStyle = "#2B2F45"; ctx.beginPath(); ctx.arc(0, s * 0.06, s * 0.07, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.fillStyle = "#DDE2FF"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s * 0.06, s * 0.14); ctx.lineTo(-s * 0.06, s * 0.14); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = stylus ? "#8A93C9" : C.biru; rr(ctx, -s * 0.07, s * 0.12, s * 0.14, s * 1.1, s * 0.05); ctx.fill();
    ctx.fillStyle = stylus ? "#5A6399" : "#2F6FC4"; ctx.fillRect(-s * 0.07, s * 0.12, s * 0.14, s * 0.1);
    ctx.restore();
  }
  // jaring garis: nb x nb, kotak (x, y, w); hot = [i, j] titik yang berubah; pulse = waktu untuk denyut listrik
  function jaring(ctx, x, y, w, n, pulse, hot, scan) {
    card(ctx, x, y, w, w, { fill: "#0E1440", stroke: C.line, lw: 4, r: 24 });
    const g = w / (n + 1);
    for (let i = 1; i <= n; i++) {
      ctx.strokeStyle = scan && scan[0] === "r" && scan[1] === i ? C.kuning : "rgba(77,163,255,0.7)"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(x + 16, y + i * g); ctx.lineTo(x + w - 16, y + i * g); ctx.stroke();
      ctx.strokeStyle = scan && scan[0] === "c" && scan[1] === i ? C.kuning : "rgba(255,79,154,0.7)";
      ctx.beginPath(); ctx.moveTo(x + i * g, y + 16); ctx.lineTo(x + i * g, y + w - 16); ctx.stroke();
    }
    if (pulse !== undefined) for (let i = 1; i <= n; i++) {
      const k = ((pulse * 0.6 + i * 0.37) % 1);
      ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(x + 16 + k * (w - 32), y + i * g, 7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + i * g, y + 16 + ((k + 0.5) % 1) * (w - 32), 7, 0, Math.PI * 2); ctx.fill();
    }
    if (hot) { const hx = x + hot[0] * g, hy = y + hot[1] * g; ctx.save(); ctx.shadowColor = C.kuning; ctx.shadowBlur = 30; ctx.fillStyle = C.kuning;
      ctx.beginPath(); ctx.arc(hx, hy, 18 + 4 * Math.sin(pulse * 8 || 0), 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    return g;
  }
  function muatan(ctx, x1, y1, x2, y2, l, n) {    // titik-titik muatan mengalir dari (x1,y1) ke (x2,y2)
    for (let i = 0; i < n; i++) { const k = ((l * 1.4 + i / n) % 1); ctx.fillStyle = C.kuning; ctx.globalAlpha = 1 - k * 0.5;
      ctx.beginPath(); ctx.arc(lerp(x1, x2, k) + Math.sin(i * 3 + l * 5) * 8, lerp(y1, y2, k), 9, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  Object.assign(T.SCENES, {
    // kait: jari mengetuk ikon (bereaksi), pulpen mengetuk (diam)
    t44_layar(ctx, b, l, t, TL, A) {
      const h = Math.min(640, A.h - 10), w = h * 0.56, x = 480 - w / 2, y = A.y + (A.h - h) / 2;
      card(ctx, x, y, w, h, { fill: "#05071A", stroke: C.line, lw: 6, r: w * 0.13 });
      const s = { x: x + w * 0.05, y: y + w * 0.12, w: w * 0.9, h: h - w * 0.2 };
      card(ctx, s.x, s.y, s.w, s.h, { fill: C.bg2, r: w * 0.08 });
      const cols = [C.pink, C.kuning, C.tosca, C.biru, "#B98CFF", C.bad], gw = s.w / 3;
      const tapF = l > 0.7 && l < 1.6, tapP = cue(b, l, "pulpen") > 0;
      for (let i = 0; i < 9; i++) { const cx = s.x + gw * (i % 3) + gw / 2, cy = s.y + 70 + Math.floor(i / 3) * gw;
        const on = i === 4 && tapF; card(ctx, cx - gw * 0.32, cy - gw * 0.32, gw * 0.64, gw * 0.64, { fill: cols[i % 6], r: gw * 0.16, glow: on ? cols[i % 6] : null });
        if (on) { ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.globalAlpha = 1 - (l - 0.7) / 0.9; ctx.beginPath(); ctx.arc(cx, cy, 30 + (l - 0.7) * 150, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; } }
      const icx = s.x + gw * 1.5, icy = s.y + 70 + gw;
      if (!tapP) { const k = l < 0.7 ? ease(l / 0.7) : l < 1.6 ? 1 : 1 - ease((l - 1.6) / 0.5); jari(ctx, lerp(icx + 260, icx, k), lerp(icy + 300, icy, k), 260, -0.35); }
      else {
        const k = ease(cue(b, l, "pulpen") / 0.5), px = lerp(icx + 300, icx, k), py = lerp(icy + 250, icy, k);
        pulpen(ctx, px, py, 300, -0.5);
        if (k >= 1) { const u = pop(b, l, "diam"); ctx.save(); ctx.translate(icx + 200, icy - 110); ctx.scale(u, u); text(ctx, "?", 0, 0, 120, { align: "center", weight: 900, color: C.kuning, shadow: true }); ctx.restore(); }
      }
    },
    // di balik kaca: jaring garis tipis berlistrik kecil
    t44_jaring(ctx, b, l, t, TL, A) {
      const w = Math.min(700, A.h - 200), x = 480 - w / 2, y = A.y + 150;
      // lapisan kaca bergeser ke atas memperlihatkan jaring
      const open = ease(cue(b, l, "jaring") / 0.8);
      jaring(ctx, x, y, w, 6, cue(b, l, "listrik") > 0 ? l : undefined);
      ctx.save(); ctx.globalAlpha = 0.85 * (1 - 0.75 * open); ctx.translate(open * 70, -open * 110);
      card(ctx, x - 10, y - 10, w + 20, w + 20, { fill: "rgba(143,245,227,0.25)", stroke: "rgba(255,255,255,0.6)", lw: 4, r: 30 });
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x + 40, y + 60); ctx.lineTo(x + 140, y + 10); ctx.stroke();
      text(ctx, "kaca layar", x + w / 2, y + 80, 44, { align: "center", weight: 900, color: C.ink });
      ctx.restore();
      if (open > 0.6) { const u = pop(b, l, "jaring"); ctx.save(); ctx.translate(480, y + w + 60); ctx.scale(u, u); pill(ctx, "jaring garis tipis", 0, 0, 42, { fill: C.biru, color: C.ink }); ctx.restore(); }
      const ul = pop(b, l, "listrik");
      if (ul > 0) { ctx.save(); ctx.translate(480, A.y + 50); ctx.scale(ul, ul); pill(ctx, "dialiri listrik kecil", 0, 0, 40, { fill: C.kuning }); ctx.restore(); }
    },
    // jari menyentuh: muatan listrik berpindah ke jari
    t44_jari(ctx, b, l, t, TL, A) {
      const w = Math.min(640, A.h - 280), x = 480 - w / 2, y = A.y + 260;
      const g = jaring(ctx, x, y, w, 6, l);
      const hx = x + 3 * g, hy = y + 4 * g, k = ease(cue(b, l, "saat jari") / 0.6), touch = k >= 1;
      // tubuh menghantarkan listrik: ikon orang kecil di atas kiri dengan petir
      const ub = pop(b, l, 0);
      if (ub > 0) { ctx.save(); ctx.translate(480, A.y + 70); ctx.scale(ub, ub); pill(ctx, "tubuh = penghantar listrik", 0, 0, 40, { fill: C.kuning }); ctx.restore(); }
      if (touch) { ctx.save(); ctx.shadowColor = C.kuning; ctx.shadowBlur = 40; ctx.fillStyle = "rgba(255,210,63,0.35)"; ctx.beginPath(); ctx.arc(hx, hy, 70, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        muatan(ctx, hx, hy, hx + 120, hy + 260, l, 7); }
      jari(ctx, lerp(hx + 80, hx, k), lerp(hy - 240, hy, k), 330, -0.45 + 0 * k);
      const um = pop(b, l, "muatan");
      if (um > 0) { ctx.save(); ctx.translate(250, y + w + 60); ctx.scale(um, um); pill(ctx, "muatan pindah ke jari", 0, 0, 36, { fill: C.tosca }); ctx.restore(); }
    },
    // HP memindai baris dan kolom, lalu menemukan titik yang berubah
    t44_titik(ctx, b, l, t, TL, A) {
      const w = Math.min(680, A.h - 230), x = 480 - w / 2, y = A.y + 130;
      const f = clamp(cue(b, l, 0.02) / 2.2, 0, 1), found = f >= 1;
      const scan = found ? null : f < 0.5 ? ["r", 1 + Math.floor(f * 2 * 6)] : ["c", 1 + Math.floor((f - 0.5) * 2 * 6)];
      const g = jaring(ctx, x, y, w, 6, l, found ? [3, 4] : null, scan);
      text(ctx, scan ? (scan[0] === "r" ? "Memeriksa baris " + scan[1] : "Memeriksa kolom " + scan[1]) : "Ketemu!", 480, A.y + 70, 48, { align: "center", weight: 900, color: found ? C.good : C.ink2 });
      if (found) { const u = pop(b, l, "letak"); ctx.save(); ctx.translate(480, y + w + 70); ctx.scale(u, u); pill(ctx, "Jarimu di kolom 3, baris 4", 0, 0, 40, { fill: C.kuning }); ctx.restore(); }
    },
    // pulpen plastik: tidak ada aliran; stylus: ujung penghantar, layar bereaksi
    t44_pulpen(ctx, b, l, t, TL, A) {
      const half = (A.h - 40) / 2, pw = Math.min(330, half - 40);
      const panel = (y, stylus, u) => {
        if (u <= 0) return; ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        card(ctx, 70, y, 820, half - 10, { fill: stylus ? C.goodBg : C.badBg, stroke: stylus ? C.good : C.bad, lw: 5, r: 30 });
        const gx = 110, gy = y + (half - 10 - pw) / 2, g = jaring(ctx, gx, gy, pw, 4, l, stylus ? [2, 2] : null);
        pulpen(ctx, gx + 2 * g, gy + 2 * g, pw * 0.68, -0.6, stylus);
        if (stylus) muatan(ctx, gx + 2 * g, gy + 2 * g, gx + 2 * g + 120, gy + 2 * g + 160, l, 5);
        text(ctx, stylus ? "Stylus" : "Pulpen plastik", 520, y + 90, 50, { weight: 900, color: C.ink, fit: 340 });
        text(ctx, stylus ? "ujung penghantar" : "tidak menghantarkan", 520, y + 145, 32, { weight: 700, color: C.ink2, fit: 340 });
        ctx.fillStyle = stylus ? C.good : C.bad; ctx.beginPath(); ctx.arc(690, y + half - 110, 56, 0, Math.PI * 2); ctx.fill();
        if (stylus) check(ctx, 690, y + half - 110, 62, C.bg); else cross(ctx, 690, y + half - 110, 62, C.bg);
        ctx.restore();
      };
      panel(A.y + 10, false, pop(b, l, 0));
      panel(A.y + 20 + half, true, pop(b, l, "stylus"));
    }
  });
})();
