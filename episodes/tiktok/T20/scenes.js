/* T20 Kenapa file ZIP bisa lebih kecil? — adegan khusus. Nama file, ukuran, dan kalimat contoh rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, bip, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const WHITE = "#F4F6FF";
  const W1 = ["aku", "suka", "kucing", "dan"], W2 = [["kucing", 2], ["suka", 1], ["aku", 0]];

  // ikon file: lembar dengan sudut terlipat; opt.zip = ritsleting di tengah
  function doc(ctx, cx, cy, w, h, opt = {}) {
    const x = cx - w / 2, y = cy - h / 2, f = Math.min(w, h) * 0.22;
    ctx.save(); ctx.fillStyle = opt.fill || C.panel2; ctx.strokeStyle = opt.stroke || C.biru; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(x + 18, y); ctx.lineTo(x + w - f, y); ctx.lineTo(x + w, y + f); ctx.lineTo(x + w, y + h - 18); ctx.arcTo(x + w, y + h, x + w - 18, y + h, 18);
    ctx.lineTo(x + 18, y + h); ctx.arcTo(x, y + h, x, y + h - 18, 18); ctx.lineTo(x, y + 18); ctx.arcTo(x, y, x + 18, y, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w - f, y); ctx.lineTo(x + w - f, y + f); ctx.lineTo(x + w, y + f); ctx.stroke();
    if (opt.zip) {
      ctx.fillStyle = C.kuning; for (let yy = y + 16; yy < y + h - 70; yy += 22) { ctx.fillRect(cx - 14 + ((yy / 22) % 2 < 1 ? 0 : 10), yy, 18, 12); }
      rr(ctx, cx - 18, y + h - 74, 36, 52, 10); ctx.fill();
    } else {
      ctx.fillStyle = "rgba(184,192,238,0.55)"; for (let i = 0; i < 5; i++) { rr(ctx, x + 30, y + 40 + f + i * (h - f - 80) / 5, (w - 60) * (i === 4 ? 0.6 : 1), 12, 6); ctx.fill(); }
    }
    ctx.restore();
  }
  function tile(ctx, x, y, s, blue) { card(ctx, x, y, s, s, { fill: blue ? C.biru : WHITE, r: s * 0.18 }); }
  function chip(ctx, s, x, y, size, opt = {}) {
    font(ctx, size, 800); const w = ctx.measureText(s).width + size * 0.9, h = size * 1.6;
    card(ctx, x, y, w, h, { fill: opt.fill || C.panel, stroke: opt.stroke || C.line, lw: 4, r: 20 });
    text(ctx, s, x + w / 2, y + h / 2 + size * 0.36, size, { align: "center", weight: 800, color: opt.color || C.ink });
    return w;
  }

  Object.assign(T.SCENES, {
    // di bawah kait: file teks ditekan menjadi file ZIP yang lebih kecil
    t20_zip(ctx, b, l, t, TL, A) {
      const cy = A.y + Math.min(A.h, 640) / 2, p = ph(b, l, 0.15, 0.9);
      const w = lerp(300, 230, p), h = lerp(380, 250, p);
      // penekan atas-bawah
      if (p > 0 && p < 1) { arrow(ctx, 480, cy - h / 2 - 110, 480, cy - h / 2 - 20, C.pink, 14, 40); arrow(ctx, 480, cy + h / 2 + 110, 480, cy + h / 2 + 20, C.pink, 14, 40); }
      doc(ctx, 480, cy, w, h, { zip: p > 0.5, stroke: p > 0.5 ? C.kuning : C.biru });
      const kb = Math.round(lerp(120, 40, p));
      text(ctx, p > 0.5 ? "laporan.zip" : "laporan.txt", 180, cy - 20, 44, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, kb + " KB", 180, cy + 50, 70, { align: "center", weight: 900, color: p >= 1 ? C.kuning : C.ink });
      const u = pop(b, l, "tidak ada yang hilang");
      if (u > 0) { ctx.save(); ctx.translate(760, cy); ctx.scale(u, u); ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(0, -40, 60, 0, Math.PI * 2); ctx.fill(); check(ctx, 0, -40, 70, C.bg);
        text(ctx, "isi utuh", 0, 70, 42, { align: "center", weight: 900, color: C.good }); ctx.restore(); }
      const by = cy + 300; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(220, A.bot - by - 10), { mood: u > 0 ? "happy" : "wow", t });
    },

    // dua belas kotak biru lalu empat kotak putih, muncul satu per satu
    t20_baris(ctx, b, l, t, TL, A) {
      const s = 92, gap = 12, x0 = 480 - (8 * s + 7 * gap) / 2, y0 = A.y + 120, st = cue(b, l, "pola");
      text(ctx, "Satu baris gambar", 480, A.y + 60, 50, { align: "center", weight: 900, color: C.kuning });
      let n = 0;
      for (let i = 0; i < 16; i++) {
        const u = st > 0 ? back(clamp((st - i * 0.12) / 0.3, 0, 1)) : 0; if (u <= 0) continue; n++;
        const r = Math.floor(i / 8), c = i % 8, x = x0 + c * (s + gap), y = y0 + r * (s + gap + 30);
        ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.scale(u, u); tile(ctx, -s / 2, -s / 2, s, i < 12); ctx.restore();
        text(ctx, String(i + 1), x + s / 2, y + s + 26, 24, { align: "center", weight: 700, color: C.mute });
      }
      if (n > 0) {
        text(ctx, String(n), 480, y0 + 2 * s + 300, 170, { align: "center", weight: 900, color: C.ink, shadow: true });
        text(ctx, "kotak", 480, y0 + 2 * s + 370, 50, { align: "center", weight: 800, color: C.ink2 });
      }
      const ub = pop(b, l, "biru"), uw = pop(b, l, "putih");
      if (ub > 0) { ctx.save(); ctx.translate(300, y0 + 2 * s + 450); ctx.scale(ub, ub); pill(ctx, "12 biru", 0, 0, 44, { fill: C.biru, color: C.ink }); ctx.restore(); }
      if (uw > 0) { ctx.save(); ctx.translate(660, y0 + 2 * s + 450); ctx.scale(uw, uw); pill(ctx, "4 putih", 0, 0, 44, { fill: WHITE }); ctx.restore(); }
    },

    // satu per satu (16 catatan) vs dicatat singkat (2 catatan)
    t20_catat(ctx, b, l, t, TL, A) {
      const x = 70, w = 820, y1 = A.y + 10, s = 42, g = 8;
      card(ctx, x, y1, w, 250, { fill: C.panel, stroke: C.line, lw: 4 });
      text(ctx, "Satu per satu: 16 catatan", x + 36, y1 + 66, 42, { weight: 800, color: C.ink2, fit: w - 72 });
      for (let i = 0; i < 16; i++) tile(ctx, x + 36 + i * (s + g) - 0, y1 + 120, s, i < 12);
      ctx.strokeStyle = C.bad; ctx.lineWidth = 6; const sc = ph(b, l, "cukup", 0.5);
      if (sc > 0) { ctx.beginPath(); ctx.moveTo(x + 30, y1 + 141); ctx.lineTo(x + 30 + (16 * (s + g)) * sc, y1 + 141); ctx.stroke(); }
      const y2 = y1 + 300, u2 = ph(b, l, "cukup", 0.4);
      if (u2 > 0) {
        ctx.save(); ctx.globalAlpha = u2;
        card(ctx, x, y2, w, 330, { fill: C.goodBg, stroke: C.good, lw: 5 });
        text(ctx, "Dicatat singkat: 2 catatan", x + 36, y2 + 66, 42, { weight: 800, color: C.ink, fit: w - 72 }); ctx.restore();
        const ua = pop(b, l, "dua belas biru"), ub = pop(b, l, "empat putih");
        if (ua > 0) { ctx.save(); ctx.translate(x + 210, y2 + 200); ctx.scale(ua, ua); card(ctx, -170, -80, 340, 160, { fill: C.panel, r: 28 });
          text(ctx, "12 ×", -40, 30, 76, { align: "center", weight: 900, color: C.ink }); tile(ctx, 50, -40, 80, true); ctx.restore(); }
        if (ub > 0) { ctx.save(); ctx.translate(x + 610, y2 + 200); ctx.scale(ub, ub); card(ctx, -170, -80, 340, 160, { fill: C.panel, r: 28 });
          text(ctx, "4 ×", -40, 30, 76, { align: "center", weight: 900, color: C.ink }); tile(ctx, 50, -40, 80, false); ctx.restore(); }
      }
      const up = pop(b, l, "empat putih", 0.5), py = y2 + 410;
      if (cue(b, l, "empat putih") > 0.6 && py + 50 < A.bot) { ctx.save(); ctx.translate(480, py); ctx.scale(up, up); pill(ctx, "Jauh lebih pendek!", 0, 0, 48, { fill: C.kuning }); ctx.restore(); }
      if (A.bot - (py + 50) > 150) bip(ctx, 480, (py + 50 + A.bot) / 2, Math.min(200, A.bot - py - 70), { mood: up > 0 ? "wow" : "think", t });
    },

    // kata yang muncul lagi diganti catatan pendek yang menunjuk ke kata sebelumnya
    t20_teks(ctx, b, l, t, TL, A) {
      const size = 60, y1 = A.y + 90, y2 = y1 + 330, rep = ph(b, l, "diganti", 0.5);
      text(ctx, "Kalimat contoh", 80, A.y + 50, 40, { weight: 800, color: C.ink2 });
      font(ctx, size, 800); const gap = 22;
      const ws = W1.map(w => ctx.measureText(w).width + size * 0.9), tot = ws.reduce((a, c) => a + c, 0) + gap * 3;
      const xs = []; let x = 480 - tot / 2; ws.forEach(w => { xs.push(x); x += w + gap; });
      W1.forEach((w, i) => {
        chip(ctx, w, xs[i], y1, size, { stroke: i < 3 && rep > 0 ? C.kuning : C.line });
        ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(xs[i] + 8, y1 + 4, 24, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), xs[i] + 8, y1 + 14, 28, { align: "center", weight: 900, color: C.bg });
      });
      // baris kedua: kata berulang, lalu berubah menjadi catatan pendek
      let x2 = 120; const pos2 = [];
      W2.forEach(([w, ref], i) => {
        const u = pop(b, l, 0.05 + i * 0.1); if (u <= 0) return;
        const short = rep > 0.5, label = short ? "→" + (ref + 1) : w;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        const cw = chip(ctx, label, x2, y2, size, short ? { fill: C.kuning, stroke: C.kuning, color: C.bg } : {});
        ctx.restore(); pos2.push([x2 + cw / 2, ref]); x2 += cw + 40;
      });
      if (rep > 0) {
        pos2.forEach(([px, ref], i) => {
          const tx = xs[ref] + ws[ref] / 2, k = clamp(rep * 1.4 - i * 0.2, 0, 1); if (k <= 0) return;
          ctx.save(); ctx.strokeStyle = C.kuning; ctx.lineWidth = 6; ctx.setLineDash([14, 12]); ctx.beginPath();
          ctx.moveTo(px, y2 - 6); ctx.quadraticCurveTo((px + tx) / 2 + (i - 1) * 60, (y1 + y2) / 2 + 40, lerp(px, tx, k), lerp(y2 - 6, y1 + size * 1.6 + 10, k)); ctx.stroke(); ctx.restore();
        });
      }
      const up = pop(b, l, "catatan pendek", 0.5), py = y2 + 190;
      if (up > 0 && py + 50 < A.bot) { ctx.save(); ctx.translate(480, py); ctx.scale(up, up); pill(ctx, "→3 artinya: salin kata nomor 3", 0, 0, 40, { fill: C.panel2, color: C.ink }); ctx.restore(); }
      if (A.bot - (py + 50) > 150) bip(ctx, 480, (py + 50 + A.bot) / 2, Math.min(200, A.bot - py - 70), { mood: "happy", t });
    },

    // file dibuka: catatan dikembalikan, kalimat persis sama
    t20_buka(ctx, b, l, t, TL, A) {
      const size = 50; let x = 110; const y1 = A.y + 30;
      text(ctx, "Isi file ZIP", 80, y1, 40, { weight: 800, color: C.ink2 });
      const items = [...W1.map(w => [w, false]), ["→3", true], ["→2", true], ["→1", true]], back2 = ph(b, l, "dikembalikan", 0.6);
      // baris catatan (dua baris kecil)
      let cx = 80, cy = y1 + 30;
      items.forEach(([w, s]) => { font(ctx, size, 800); const cw = ctx.measureText(w).width + size * 0.9; if (cx + cw > 880) { cx = 80; cy += size * 1.6 + 16; }
        chip(ctx, w, cx, cy, size, s ? { fill: C.kuning, stroke: C.kuning, color: C.bg } : {}); cx += cw + 16; });
      const ay = cy + size * 1.6 + 30;
      if (back2 > 0) { arrow(ctx, 480, ay, 480, ay + 110 * back2, C.tosca, 12, 36); text(ctx, "dibuka", 520, ay + 70, 40, { weight: 800, color: C.tosca }); }
      const y2 = ay + 150, u = ph(b, l, "dikembalikan", 0.5);
      if (u > 0) {
        ctx.save(); ctx.globalAlpha = u;
        card(ctx, 70, y2, 820, 260, { fill: C.goodBg, stroke: C.good, lw: 5 });
        const full = ["aku", "suka", "kucing", "dan", "kucing", "suka", "aku"];
        let fx = 110, fy = y2 + 100; font(ctx, 56, 800);
        full.forEach((w, i) => { const ww = ctx.measureText(w).width; if (fx + ww > 860) { fx = 110; fy += 90; }
          const on = i >= 4 && clamp(back2 * 3 - (i - 4) * 0.5, 0, 1) > 0; text(ctx, w, fx, fy, 56, { weight: 800, color: i >= 4 ? (on ? C.kuning : "rgba(0,0,0,0)") : C.ink }); fx += ww + 22; });
        ctx.restore();
      }
      const us = pop(b, l, "persis sama"), sy = y2 + 340;
      if (us > 0 && sy + 60 < A.bot) { ctx.save(); ctx.translate(480, sy); ctx.scale(us, us); card(ctx, -260, -55, 520, 110, { fill: C.good, r: 55 });
        check(ctx, -180, 0, 54, C.bg); text(ctx, "Sama persis!", 40, 18, 52, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      if (A.bot - (sy + 60) > 150) bip(ctx, 480, (sy + 60 + A.bot) / 2, Math.min(200, A.bot - sy - 80), { mood: us > 0 ? "happy" : "think", t });
    }
  });
})();
