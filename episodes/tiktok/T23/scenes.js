/* T23 Alamat IP: alamat rumah perangkatmu — adegan khusus. Alamat IP rekaan (jaringan rumah 192.168.1.x, IPv6 dari blok dokumentasi 2001:db8::). */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, bip, rnd, fmt, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;

  function phoneIcon(ctx, cx, cy, s, col) {
    card(ctx, cx - s * 0.3, cy - s * 0.5, s * 0.6, s, { fill: "#05061A", r: s * 0.1, stroke: col || C.ink2, lw: 5 });
    card(ctx, cx - s * 0.24, cy - s * 0.42, s * 0.48, s * 0.8, { fill: col || C.biru, r: s * 0.06 });
  }
  function laptopIcon(ctx, cx, cy, s, col) {
    card(ctx, cx - s * 0.5, cy - s * 0.4, s, s * 0.62, { fill: "#05061A", r: 10, stroke: C.ink2, lw: 5 });
    card(ctx, cx - s * 0.43, cy - s * 0.33, s * 0.86, s * 0.48, { fill: col || C.tosca, r: 6 });
    card(ctx, cx - s * 0.62, cy + s * 0.24, s * 1.24, s * 0.12, { fill: C.ink2, r: 6 });
  }
  function tvIcon(ctx, cx, cy, s, col) {
    card(ctx, cx - s * 0.55, cy - s * 0.38, s * 1.1, s * 0.68, { fill: "#05061A", r: 10, stroke: C.ink2, lw: 5 });
    card(ctx, cx - s * 0.48, cy - s * 0.31, s * 0.96, s * 0.54, { fill: col || C.pink, r: 6 });
    ctx.fillStyle = C.ink2; ctx.fillRect(cx - 6, cy + s * 0.3, 12, s * 0.12); ctx.fillRect(cx - s * 0.25, cy + s * 0.4, s * 0.5, 8);
  }
  function house(ctx, cx, cy, s) {
    ctx.save(); ctx.fillStyle = C.pink; ctx.beginPath(); ctx.moveTo(cx - s * 0.62, cy - s * 0.1); ctx.lineTo(cx, cy - s * 0.6); ctx.lineTo(cx + s * 0.62, cy - s * 0.1); ctx.closePath(); ctx.fill();
    card(ctx, cx - s * 0.48, cy - s * 0.12, s * 0.96, s * 0.62, { fill: C.panel2, r: 8 });
    card(ctx, cx - s * 0.12, cy + s * 0.15, s * 0.24, s * 0.35, { fill: C.kuning, r: 6 }); ctx.restore();
  }
  function router(ctx, cx, cy, s, t) {
    ctx.save(); ctx.strokeStyle = C.ink2; ctx.lineWidth = 8; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx - s * 0.3, cy - s * 0.15); ctx.lineTo(cx - s * 0.38, cy - s * 0.55); ctx.moveTo(cx + s * 0.3, cy - s * 0.15); ctx.lineTo(cx + s * 0.38, cy - s * 0.55); ctx.stroke();
    card(ctx, cx - s * 0.5, cy - s * 0.18, s, s * 0.36, { fill: C.panel2, r: 14, stroke: C.tosca, lw: 5 });
    for (let i = 0; i < 4; i++) { ctx.fillStyle = (Math.floor(t * 4) + i) % 3 ? C.tosca : C.kuning; ctx.beginPath(); ctx.arc(cx - s * 0.3 + i * s * 0.2, cy, 8, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function plate(ctx, s, cx, cy, size, col) {
    font(ctx, size, 900); const w = ctx.measureText(s).width + size;
    card(ctx, cx - w / 2, cy - size * 0.85, w, size * 1.6, { fill: C.bg, stroke: col || C.kuning, lw: 4, r: 14 });
    text(ctx, s, cx, cy + size * 0.32, size, { align: "center", weight: 900, color: col || C.kuning });
  }
  function envelope(ctx, cx, cy, w, col) {
    const h = w * 0.66; card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: col || C.kuning, r: 8 });
    ctx.strokeStyle = C.bg; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - w / 2 + 4, cy - h / 2 + 4); ctx.lineTo(cx, cy + 4); ctx.lineTo(cx + w / 2 - 4, cy - h / 2 + 4); ctx.stroke();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: rumah dengan papan alamat, HP dengan alamat IP
    t23_kait(ctx, b, l, t, TL, A) {
      const cy = A.y + 200;
      const u1 = pop(b, l, 0.05), u2 = pop(b, l, "seperti rumah"), u3 = pop(b, l, "alamat IP");
      ctx.save(); ctx.translate(250, cy); ctx.scale(u1, u1); house(ctx, 0, 0, 330); ctx.restore();
      if (u2 > 0) { ctx.save(); ctx.translate(250, cy + 250); ctx.scale(u2, u2); plate(ctx, "Jl. Melati 7", 0, 0, 46, C.ink); ctx.restore(); }
      ctx.save(); ctx.translate(690, cy); ctx.scale(u1, u1); phoneIcon(ctx, 0, 0, 340); ctx.restore();
      if (u3 > 0) { ctx.save(); ctx.translate(690, cy + 250); ctx.scale(u3, u3); plate(ctx, "192.168.1.7", 0, 0, 46); ctx.restore(); }
      if (A.bot - (cy + 330) > 140) bip(ctx, 480, (cy + 330 + A.bot) / 2, Math.min(220, A.bot - cy - 340), { mood: u3 > 0 ? "happy" : "wow", t });
      text(ctx, "=", 470, cy + 30, 90, { align: "center", weight: 900, color: C.ink2 });
    },

    // paket data membawa alamat tujuan, diantar ke perangkat yang cocok
    t23_antar(ctx, b, l, t, TL, A) {
      const y = A.y + 30, devs = [[200, "192.168.1.4", laptopIcon, C.tosca], [480, "192.168.1.7", phoneIcon, C.biru], [760, "192.168.1.9", tvIcon, C.pink]];
      // sumber data (server) di atas
      card(ctx, 380, y, 200, 150, { fill: C.panel2, r: 18, stroke: C.line, lw: 4 });
      for (let i = 0; i < 3; i++) { ctx.fillStyle = C.ink2; rr(ctx, 400, y + 22 + i * 42, 160, 26, 8); ctx.fill(); ctx.fillStyle = C.tosca; ctx.beginPath(); ctx.arc(535, y + 35 + i * 42, 6, 0, Math.PI * 2); ctx.fill(); }
      text(ctx, "pengirim", 480, y + 190, 34, { align: "center", weight: 800, color: C.ink2 });
      const dy = Math.min(A.bot - 170, y + 800);
      devs.forEach(([x, ip, fn, col]) => { fn(ctx, x, dy, 200, col); text(ctx, ip, x, dy + 150, 36, { align: "center", weight: 900, color: C.ink, fit: 260 }); });
      // jalan
      ctx.save(); ctx.strokeStyle = "rgba(184,192,238,0.3)"; ctx.lineWidth = 10; ctx.setLineDash([18, 16]);
      ctx.beginPath(); ctx.moveTo(480, y + 210); ctx.lineTo(480, y + 330); devs.forEach(([x]) => { ctx.moveTo(480, y + 330); ctx.lineTo(x, y + 430); ctx.lineTo(x, dy - 110); }); ctx.stroke(); ctx.restore();
      // amplop berjalan
      const k = ph(b, l, "memakai", 1.2), arrive = cue(b, l, "diantar");
      if (cue(b, l, 0.02) > 0) {
        const px = 480, py = k < 0.5 ? lerp(y + 200, y + 330, k * 2) : lerp(y + 330, dy - 140, (k - 0.5) * 2);
        envelope(ctx, px, py, 120); plate(ctx, "ke: 192.168.1.7", px + (px > 600 ? -200 : 0), py - 80, 30);
      }
      if (arrive > 0) { const u = back(clamp(arrive / 0.4, 0, 1)); ctx.save(); ctx.translate(600, dy - 80); ctx.scale(u, u); ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(0, 0, 44, 0, Math.PI * 2); ctx.fill(); check(ctx, 0, 0, 52, C.bg); ctx.restore(); }
    },

    // empat angka dipisah titik, tiap angka 0..255
    t23_format(ctx, b, l, t, TL, A) {
      const parts = ["192", "168", "1", "7"], cols = [C.kuning, C.pink, C.tosca, C.biru], y = A.y + 90, bw = 180, gap = 34, x0 = 480 - (4 * bw + 3 * gap) / 2;
      parts.forEach((p, i) => {
        const u = pop(b, l, "empat angka", 0.4 + i * 0.1); if (u <= 0) return;
        const x = x0 + i * (bw + gap);
        ctx.save(); ctx.translate(x + bw / 2, y + 90); ctx.scale(u, u); card(ctx, -bw / 2, -90, bw, 180, { fill: C.panel, stroke: cols[i], lw: 6, r: 24 });
        text(ctx, p, 0, 30, 84, { align: "center", weight: 900, color: cols[i], fit: bw - 20 }); ctx.restore();
        if (i < 3 && ph(b, l, "titik", 0.3) > 0) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x + bw + gap / 2, y + 160, 12, 0, Math.PI * 2); ctx.fill(); }
      });
      // penggaris 0..255
      const ry = y + 400, ur = ph(b, l, "0 sampai", 0.5);
      if (ur > 0) {
        ctx.save(); ctx.globalAlpha = ur;
        card(ctx, 100, ry, 760, 40, { fill: C.panel2, r: 20 });
        const g = ctx.createLinearGradient(100, 0, 860, 0); g.addColorStop(0, C.biru); g.addColorStop(1, C.pink);
        ctx.fillStyle = g; rr(ctx, 100, ry, 760 * ur, 40, 20); ctx.fill();
        text(ctx, "0", 100, ry + 110, 60, { weight: 900, color: C.ink }); text(ctx, "255", 860, ry + 110, 60, { align: "right", weight: 900, color: C.ink });
        const v = Math.round(127.5 + 127.5 * Math.sin(l * 2)), mx = 100 + 760 * v / 255;
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(mx, ry + 20, 30, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(v), mx, ry - 30, 46, { align: "center", weight: 900, color: C.kuning });
        ctx.restore();
      }
      const by = ry + 170; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: "happy", t });
    },

    // IP versi 4 vs IP versi 6
    t23_v6(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y1 = A.y + 20;
      card(ctx, x, y1, w, 200, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "IP versi 4", x + 36, y1 + 60, 38, { weight: 800, color: C.ink2 });
      text(ctx, "192.168.1.7", x + 36, y1 + 150, 70, { weight: 900, color: C.kuning });
      const u = pop(b, l, "versi baru"), y2 = y1 + 250;
      if (u > 0) {
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate(0, (1 - u) * 50);
        card(ctx, x, y2, w, 330, { fill: C.goodBg, stroke: C.good, lw: 5 });
        text(ctx, "IP versi 6", x + 36, y2 + 60, 38, { weight: 800, color: C.ink2 });
        const full = "2001:db8:3c4d:15:0:d234:3eee:12", k = clamp(cue(b, l, "versi baru") / 1.5, 0, 1), n = Math.round(full.length * k), s = full.slice(0, n);
        text(ctx, s.slice(0, 17), x + 36, y2 + 150, 62, { weight: 900, color: C.tosca, fit: w - 72 });
        text(ctx, s.slice(17), x + 36, y2 + 240, 62, { weight: 900, color: C.tosca, fit: w - 72 });
        ctx.restore();
      }
      const uj = pop(b, l, "jauh lebih panjang"), jy = y2 + 420;
      if (uj > 0 && jy + 60 < A.bot) { ctx.save(); ctx.translate(480, jy); ctx.scale(uj, uj); pill(ctx, "Jumlahnya: angka 39 digit!", 0, 0, 46, { fill: C.kuning }); ctx.restore(); }
      const by = jy + 60; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(190, A.bot - by - 10), { mood: uj > 0 ? "wow" : "happy", t });
    },

    // router di rumah membagikan alamat ke tiap perangkat
    t23_router(ctx, b, l, t, TL, A) {
      const cx = 480, cy = A.y + 200;
      // garis rumah
      ctx.save(); ctx.strokeStyle = "rgba(255,79,154,0.6)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(90, A.y + 160); ctx.lineTo(480, A.y + 10); ctx.lineTo(870, A.y + 160); ctx.lineTo(870, A.y + 900); ctx.lineTo(90, A.y + 900); ctx.closePath(); ctx.stroke(); ctx.restore();
      router(ctx, cx, cy, 220, t); text(ctx, "router", cx, cy + 90, 40, { align: "center", weight: 800, color: C.tosca });
      // gelombang
      for (let i = 0; i < 3; i++) { const r = ((l * 80 + i * 60) % 180) + 40; ctx.save(); ctx.globalAlpha = 1 - r / 220; ctx.strokeStyle = C.tosca; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy - 40, r, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.restore(); }
      const devs = [[220, "192.168.1.4", laptopIcon, C.tosca], [480, "192.168.1.7", phoneIcon, C.biru], [740, "192.168.1.9", tvIcon, C.pink]], dy = A.y + 540;
      devs.forEach(([x, ip, fn, col], i) => {
        fn(ctx, x, dy, 190, col);
        const k = ph(b, l, i === 2 ? "laptop" : i === 1 ? "setiap" : "memberi", 0.7);
        if (k > 0) { const px = lerp(cx, x, k), py = lerp(cy + 40, dy + 170 + (i % 2) * 70, k); plate(ctx, ip, px, py, 34); }
      });
    }
  });
})();
