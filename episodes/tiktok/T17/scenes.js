/* T17 Kenapa video sering buffering? — adegan khusus. Pemutar video dan menu generik. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;

  function spinner(ctx, x, y, r, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 5); ctx.lineCap = "round"; ctx.lineWidth = r * 0.22;
    ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 1.3); ctx.stroke(); ctx.restore();
  }
  // pemutar video: vt = waktu video (bola memantul), play = progres 0..1, buf = stok 0..1, wait = tampilkan lingkaran
  function player(ctx, x, y, w, h, vt, play, buf, wait, t) {
    card(ctx, x, y, w, h, { fill: "#0A0D24", stroke: "#4A55A8", lw: 6, r: 22 });
    ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 62, 18); ctx.clip();
    const sky = ctx.createLinearGradient(0, y, 0, y + h); sky.addColorStop(0, "#3E7BFA"); sky.addColorStop(1, "#9FD0FF"); ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#2FAE6B"; ctx.fillRect(x, y + h * 0.66, w, h);
    const bx = x + w * (0.15 + 0.7 * ((vt * 0.25) % 1)), by = y + h * 0.62 - Math.abs(Math.sin(vt * 3)) * h * 0.35;
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(bx, by, h * 0.08, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(bx, by, h * 0.03, 0, Math.PI * 2); ctx.fill();
    if (wait) { ctx.fillStyle = "rgba(11,14,42,0.55)"; ctx.fillRect(x, y, w, h); }
    ctx.restore();
    if (wait) spinner(ctx, x + w / 2, y + (h - 56) / 2, Math.min(w, h) * 0.12, t);
    const py = y + h - 32, pw = w - 60;
    card(ctx, x + 30, py - 6, pw, 12, { fill: "rgba(255,255,255,0.2)", r: 6 });
    card(ctx, x + 30, py - 6, pw * clamp(play + buf, 0, 1), 12, { fill: "rgba(255,255,255,0.55)", r: 6 });
    card(ctx, x + 30, py - 6, Math.max(12, pw * play), 12, { fill: C.bad, r: 6 });
    ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(x + 30 + pw * play, py, 13, 0, Math.PI * 2); ctx.fill();
  }
  function chunk(ctx, x, y, s, i) { card(ctx, x - s / 2, y - s / 2, s, s, { fill: [C.tosca, C.biru, C.kuning, C.pink][i % 4], r: s * 0.2 }); text(ctx, String(i + 1), x, y + s * 0.18, s * 0.45, { align: "center", weight: 900, color: C.bg }); }
  function server(ctx, x, y, w, h, t) {
    for (let i = 0; i < 3; i++) { const yy = y + i * h / 3; card(ctx, x, yy + 3, w, h / 3 - 6, { fill: C.panel2, stroke: C.line, lw: 3, r: 10 });
      for (let k = 0; k < 2; k++) { ctx.fillStyle = (Math.floor(t * 3 + i + k) % 3) ? C.good : C.mute; ctx.beginPath(); ctx.arc(x + 24 + k * 22, yy + h / 6, 6, 0, Math.PI * 2); ctx.fill(); } }
    text(ctx, "Server", x + w / 2, y - 14, 32, { align: "center", weight: 800, color: C.ink2 });
  }

  Object.assign(T.SCENES, {
    // di bawah kait: video berhenti, lingkaran berputar
    t17_spin(ctx, b, l, t, TL, A) {
      const w = 640, h = Math.min(400, A.h - 40), x = 480 - w / 2, y = A.y + (A.h - h) / 2, stop = l > 0.9;
      player(ctx, x, y, w, h, stop ? 0.9 : l, 0.42, stop ? 0 : 0.1, stop, t);
      if (stop) { const u = pop(b, l, "berputar"); if (u > 0) bip(ctx, 820, y + h - 40, 120, { mood: "sad", t }); }
    },
    // potongan video dari server masuk ke buffer
    t17_potong(ctx, b, l, t, TL, A) {
      server(ctx, A.x + 10, A.y + 60, 200, 220, t);
      const px = A.x + 330, pw = 490, phh = 300;
      player(ctx, px, A.y + 20, pw, phh, l, 0.3, 0.25, false, t);
      // potongan berjalan dari server ke wadah buffer
      const by = A.y + 470, bx = A.x + 330, bw = 490, go = cue(b, l, "sepotong");
      text(ctx, "Buffer (stok)", bx, by - 24, 40, { weight: 900, color: C.kuning });
      card(ctx, bx, by, bw, 150, { fill: C.bg2, stroke: C.kuning, lw: 4, r: 22 });
      const n = go > 0 ? Math.min(5, Math.floor(go / 0.55) + 1) : 0;
      for (let i = 0; i < n; i++) {
        const k = ease(clamp((go - i * 0.55) / 0.5, 0, 1)), sx = A.x + 110, sy = A.y + 170;
        const tx = bx + 60 + i * 92, ty = by + 75;
        chunk(ctx, lerp(sx, tx, k), lerp(sy, ty, k) - Math.sin(k * Math.PI) * 80, 76, i);
      }
      const ub = pop(b, l, "buffer");
      if (ub > 0) { ctx.save(); ctx.translate(bx + bw / 2, by + 230); ctx.scale(ub, ub); pill(ctx, "potongan berikutnya sudah siap", 0, 0, 34, { fill: C.panel2, color: C.ink }); ctx.restore(); }
      text(ctx, "potongan video", A.x + 110, A.y + 340, 30, { align: "center", weight: 800, color: C.ink2 });
    },
    // tangki stok: masuk vs ditonton. b.mode "lancar" (penuh) atau "habis" (sinyal melambat, stok turun ke nol)
    t17_tangki(ctx, b, l, t, TL, A) {
      const habis = b.mode === "habis", slow = habis ? ease(cue(b, l, "melambat") / 0.4) : 0;
      const drain = habis ? clamp((cue(b, l, "melambat")) / 1.6, 0, 1) : 0, level = habis ? lerp(0.8, 0, drain) : clamp(0.45 + l * 0.12, 0, 0.8);
      const wait = habis && level <= 0.02;
      const px = A.x + 10, pw = 470, ph2 = 300, py = A.y + 30;
      player(ctx, px, py, pw, ph2, wait ? 3 + drain : l + (habis ? 3 : 0), 0.3 + (wait ? drain * 0 : 0.003 * l), level * 0.3, wait, t);
      // tangki
      const tx = A.x + 560, ty = A.y + 120, tw = 240, th = 460;
      text(ctx, "Stok", tx + tw / 2, ty - 70, 44, { align: "center", weight: 900, color: C.kuning });
      // pipa masuk dari atas
      ctx.fillStyle = C.panel2; ctx.fillRect(tx + tw / 2 - 22, ty - 50, 44, 60);
      const rate = habis ? lerp(1, 0.18, slow) : 1;
      for (let i = 0; i < 4; i++) { const s = ((l * 1.6 * rate + i / 4) % 1); if (habis && slow > 0.5 && i > 0) continue; chunk(ctx, tx + tw / 2, lerp(ty - 20, ty + th * (1 - level) - 30, s), 44, i); }
      card(ctx, tx, ty, tw, th, { fill: "rgba(27,34,87,0.6)", stroke: C.ink2, lw: 5, r: 20 });
      if (level > 0) { const lh = th * level; ctx.save(); rr(ctx, tx + 6, ty + th - lh, tw - 12, lh - 6, 14); ctx.clip();
        ctx.fillStyle = C.tosca; ctx.fillRect(tx, ty + th - lh, tw, lh);
        for (let i = 0; i < 12; i++) { ctx.fillStyle = "rgba(11,14,42,0.18)"; ctx.fillRect(tx + 6, ty + th - 6 - i * 46, tw - 12, 3); }
        ctx.restore(); }
      // keluaran ke pemutar
      ctx.save(); ctx.strokeStyle = level > 0.02 ? C.tosca : C.mute; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(tx, ty + th - 30); ctx.lineTo(px + pw / 2, ty + th - 30); ctx.lineTo(px + pw / 2, py + ph2 + 10); ctx.stroke(); ctx.restore();
      text(ctx, "ditonton", px + pw / 2 + 120, ty + th + 30, 34, { align: "center", weight: 800, color: C.ink2 });
      // label status
      const yl = ty + th + 110;
      if (!habis) { const u = pop(b, l, "lancar"); if (u > 0) { ctx.save(); ctx.translate(480, yl); ctx.scale(u, u); pill(ctx, "masuk > ditonton = lancar ✓", 0, 0, 40, { fill: C.good }); ctx.restore(); } }
      else {
        const um = pop(b, l, "melambat"); if (um > 0 && !wait) { ctx.save(); ctx.translate(480, yl); ctx.scale(um, um); pill(ctx, "sinyal lambat: masuk < ditonton", 0, 0, 36, { fill: C.kuning }); ctx.restore(); }
        const ub = pop(b, l, "buffering");
        if (wait) { ctx.save(); ctx.translate(480, yl); ctx.scale(Math.max(0.6, ub || 0.6), Math.max(0.6, ub || 0.6)); ctx.rotate(-0.04); card(ctx, -280, -55, 560, 110, { fill: C.bad, r: 24 }); text(ctx, "BUFFERING…", 0, 22, 60, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
      }
    },
    // tips: turunkan kualitas atau download saat Wi-Fi lancar
    t17_tips(ctx, b, l, t, TL, A) {
      const x = A.x + 40, y = A.y + 10, w = 740;
      card(ctx, x, y, w, 470, { fill: C.panel, stroke: C.line, lw: 4, r: 28 });
      text(ctx, "Kualitas video", x + 40, y + 70, 46, { weight: 900, color: C.ink });
      const sel = cue(b, l, "turunkan") > 0.4;
      ["1080p", "720p", "480p", "360p"].forEach((q, i) => {
        const yy = y + 110 + i * 86, on = sel ? q === "480p" : q === "1080p";
        card(ctx, x + 30, yy, w - 60, 72, { fill: on ? C.panel2 : C.bg2, r: 18, stroke: on ? C.tosca : null, lw: 4 });
        ctx.strokeStyle = on ? C.tosca : C.mute; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x + 80, yy + 36, 18, 0, Math.PI * 2); ctx.stroke();
        if (on) { ctx.fillStyle = C.tosca; ctx.beginPath(); ctx.arc(x + 80, yy + 36, 9, 0, Math.PI * 2); ctx.fill(); }
        text(ctx, q, x + 120, yy + 50, 40, { weight: 800, color: on ? C.ink : C.ink2 });
        if (q === "480p" && sel) text(ctx, "lebih hemat", x + w - 60, yy + 50, 32, { weight: 800, color: C.tosca, align: "right" });
      });
      // jari mengetuk 480p
      const tp = cue(b, l, "turunkan");
      if (tp > -0.4 && tp < 1) { const d = Math.max(0, -tp); ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(x + 300 + d * 100, y + 110 + 2 * 86 + 50 + d * 100, 26, 0, Math.PI * 2); ctx.fill(); }
      // kartu download saat Wi-Fi
      const ud = pop(b, l, "download"), dy = y + 530;
      if (ud > 0 && A.bot - dy > 160) {
        ctx.save(); ctx.globalAlpha = clamp(ud, 0, 1); ctx.translate(0, (1 - clamp(ud, 0, 1)) * 40);
        card(ctx, x, dy, w, 160, { fill: C.goodBg, stroke: C.good, lw: 5, r: 28 });
        // ikon unduh
        ctx.fillStyle = C.good; ctx.fillRect(x + 72, dy + 36, 16, 50); ctx.beginPath(); ctx.moveTo(x + 50, dy + 80); ctx.lineTo(x + 110, dy + 80); ctx.lineTo(x + 80, dy + 112); ctx.fill(); ctx.fillRect(x + 46, dy + 120, 68, 10);
        // ikon Wi-Fi
        ctx.strokeStyle = C.kuning; ctx.lineWidth = 9; ctx.lineCap = "round"; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(x + w - 90, dy + 115, i * 22, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke(); }
        ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(x + w - 90, dy + 112, 7, 0, Math.PI * 2); ctx.fill();
        text(ctx, "Download dulu", x + 150, dy + 70, 44, { weight: 900, color: C.ink });
        text(ctx, "saat Wi-Fi lancar", x + 150, dy + 120, 38, { weight: 700, color: C.ink2 });
        ctx.restore();
      }
    }
  });
})();
