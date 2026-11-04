/* T12 Kenapa foto jadi buram setelah dikirim? — adegan khusus. Foto pemandangan digambar dengan kode; aplikasi chat generik. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const BUF = {};

  // foto pemandangan rekaan pada ukuran w x h (koordinat lokal 0..w)
  function scene(g, w, h) {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.7); sky.addColorStop(0, "#3E7BFA"); sky.addColorStop(1, "#FFC48A");
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    g.fillStyle = "#FFE45C"; g.beginPath(); g.arc(w * 0.75, h * 0.28, h * 0.12, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#5B4BB0"; g.beginPath(); g.moveTo(0, h * 0.72); g.lineTo(w * 0.28, h * 0.32); g.lineTo(w * 0.55, h * 0.72); g.fill();
    g.fillStyle = "#7A5CC9"; g.beginPath(); g.moveTo(w * 0.3, h * 0.72); g.lineTo(w * 0.62, h * 0.4); g.lineTo(w, h * 0.72); g.fill();
    g.fillStyle = "#2FAE6B"; g.fillRect(0, h * 0.7, w, h * 0.3);
    // rumput dan daun: detail halus
    for (let i = 0; i < 160; i++) { g.fillStyle = rnd(i) > 0.5 ? "#1F8A52" : "#56D08A"; g.fillRect(rnd(i + 1) * w, h * 0.72 + rnd(i + 2) * h * 0.27, w * 0.006, h * 0.03); }
    g.fillStyle = "#6B442C"; g.fillRect(w * 0.16, h * 0.5, w * 0.04, h * 0.25);
    for (let i = 0; i < 70; i++) { g.fillStyle = ["#1F8A52", "#2FAE6B", "#7BE0A0"][i % 3]; g.beginPath(); g.arc(w * 0.18 + (rnd(i + 9) - 0.5) * w * 0.17, h * 0.43 + (rnd(i + 19) - 0.5) * h * 0.2, w * 0.018, 0, Math.PI * 2); g.fill(); }
    // rumah kecil
    g.fillStyle = "#FFFFFF"; g.fillRect(w * 0.58, h * 0.6, w * 0.16, h * 0.14); g.fillStyle = "#FF5A5F"; g.beginPath(); g.moveTo(w * 0.56, h * 0.61); g.lineTo(w * 0.66, h * 0.5); g.lineTo(w * 0.76, h * 0.61); g.fill();
    g.fillStyle = "#4DA3FF"; g.fillRect(w * 0.61, h * 0.64, w * 0.035, h * 0.04); g.fillRect(w * 0.68, h * 0.64, w * 0.035, h * 0.04);
  }
  // foto pada (x, y, w, h); px = ukuran piksel (1 = tajam), blur = px blur
  function photo(ctx, x, y, w, h, px, blur) {
    px = Math.max(1, Math.round(px || 1));
    const key = w + "x" + h + "@" + px + "b" + (blur || 0);
    if (!BUF[key]) {
      const sw = Math.max(2, Math.round(w / px)), sh = Math.max(2, Math.round(h / px));
      const c = document.createElement("canvas"); c.width = sw; c.height = sh; const g = c.getContext("2d");
      if (blur) g.filter = "blur(" + (blur / px) + "px)";
      scene(g, sw, sh); BUF[key] = c;
    }
    ctx.save(); ctx.imageSmoothingEnabled = false; rr(ctx, x, y, w, h, 18); ctx.clip(); ctx.drawImage(BUF[key], x, y, w, h); ctx.restore();
    ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; rr(ctx, x, y, w, h, 18); ctx.stroke(); ctx.restore();
  }
  function plane(ctx, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = col || C.ink; ctx.beginPath(); ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, -s * 0.35); ctx.lineTo(s * 0.1, s * 0.4); ctx.lineTo(0, s * 0.05); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: foto tajam vs foto buram
    t12_dua(ctx, b, l, t, TL, A) {
      const w = 340, h = Math.min(255, A.h - 120), y = A.y + 20;
      photo(ctx, A.x + 20, y, w, h, 1);
      text(ctx, "Di HP", A.x + 20 + w / 2, y + h + 56, 40, { align: "center", weight: 800, color: C.good });
      const u = ph(b, l, "buram", 0.5);
      arrow(ctx, A.x + 380, y + h / 2, A.x + 450, y + h / 2, C.kuning, 10, 30);
      if (u > 0) { ctx.save(); ctx.globalAlpha = u; photo(ctx, A.x + 470, y, w, h, 12, 14); ctx.restore(); text(ctx, "Setelah dikirim", A.x + 470 + w / 2, y + h + 56, 40, { align: "center", weight: 800, color: C.bad }); }
      else photo(ctx, A.x + 470, y, w, h, 1);
      const uq = pop(b, l, "siapa");
      if (uq > 0) { ctx.save(); ctx.translate(480, y + h / 2); ctx.scale(uq, uq); ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill(); text(ctx, "?", 0, 24, 70, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
    },
    // foto besar mengecil masuk ke gelembung chat dan terbang
    t12_kecil(ctx, b, l, t, TL, A) {
      const k = ease(cue(b, l, "mengecilkan") / 1.0), w = lerp(760, 300, k), h = w * 0.75, x = 480 - w / 2, y = A.y + 30;
      if (k > 0.6) { ctx.save(); ctx.globalAlpha = (k - 0.6) / 0.4; card(ctx, 480 - 180, y - 20, 360, 310, { fill: C.tosca, r: 36 }); ctx.restore(); }
      photo(ctx, x, y, w, h, lerp(1, 3, k));
      const fly = cue(b, l, "terkirim");
      if (fly > 0) { const f = (fly * 0.6) % 1; ctx.save(); ctx.globalAlpha = 1 - f; plane(ctx, lerp(560, 860, f), lerp(y + 360, y + 140, f), 90, C.kuning); ctx.restore(); }
      const items = [["cepat", "Cepat terkirim", C.tosca], ["kuota", "Hemat kuota", C.kuning]];
      items.forEach(([w2, s, col], i) => {
        const u = pop(b, l, w2); if (u <= 0) return;
        ctx.save(); ctx.translate(A.x + 20, y + 620 + i * 130); ctx.scale(u, u);
        card(ctx, 0, -50, 520, 100, { fill: C.panel, stroke: col, lw: 4, r: 24 }); check(ctx, 60, 0, 50, col);
        text(ctx, s, 110, 16, 44, { weight: 800, color: C.ink }); ctx.restore();
      });
      if (A.bot - (y + 620) > 300) bip(ctx, 760, y + 690, 150, { mood: "happy", t });
    },
    // piksel dikurangi: foto makin kotak-kotak, angka piksel turun
    t12_piksel(ctx, b, l, t, TL, A) {
      const w = 760, h = 570, x = A.x + 30, y = A.y + 20, k = ease(cue(b, l, "dikurangi") / 1.6), px = lerp(1, 14, k);
      photo(ctx, x, y, w, h, px);
      // kaca pembesar menunjukkan kotak piksel
      const ub = ph(b, l, "dua juta", 0.4);
      const yb = y + h + 40;
      card(ctx, A.x, yb, 820, 170, { fill: C.bg2, stroke: C.line, lw: 3, r: 26 });
      const ua = pop(b, l, "dua belas juta");
      if (ua > 0) { text(ctx, "4.000 × 3.000", A.x + 40, yb + 70, 44, { weight: 800, color: C.ink2 }); text(ctx, "12 juta piksel", A.x + 40, yb + 130, 50, { weight: 900, color: C.good }); }
      if (ub > 0) { ctx.save(); ctx.globalAlpha = ub; arrow(ctx, A.x + 400, yb + 90, A.x + 470, yb + 90, C.kuning, 8, 26);
        text(ctx, "1.600 × 1.200", A.x + 500, yb + 70, 44, { weight: 800, color: C.ink2 }); text(ctx, "±2 juta piksel", A.x + 500, yb + 130, 50, { weight: 900, color: C.bad, fit: 300 }); ctx.restore(); }
    },
    // kompresi: perbesaran bagian pohon, detail halus diratakan jadi blok
    t12_kompres(ctx, b, l, t, TL, A) {
      const k = ease(cue(b, l, "dibuang") / 0.8), uz = ph(b, l, "detail", 0.4);
      const w = 380, h = 285, y = A.y + 30;
      photo(ctx, A.x + 20, y, w, h, 1);
      photo(ctx, A.x + 440, y, w, h, 1, 0);
      text(ctx, "sebelum", A.x + 20 + w / 2, y + h + 50, 38, { align: "center", weight: 800, color: C.good });
      text(ctx, "sesudah", A.x + 440 + w / 2, y + h + 50, 38, { align: "center", weight: 800, color: k > 0 ? C.bad : C.ink2 });
      if (k > 0) { ctx.save(); ctx.globalAlpha = k; photo(ctx, A.x + 440, y, w, h, 8, 10); ctx.restore(); }
      // perbesaran daun pohon: kiri titik-titik halus, kanan blok rata
      const zy = y + h + 90, zs = Math.min(360, A.bot - zy - 20);
      if (uz > 0 && zs > 120) {
        ctx.save(); ctx.globalAlpha = uz;
        ctx.save(); rr(ctx, A.x + 20, zy, w, zs, 20); ctx.clip(); ctx.fillStyle = "#2FAE6B"; ctx.fillRect(A.x + 20, zy, w, zs);
        for (let i = 0; i < 240; i++) { ctx.fillStyle = ["#1F8A52", "#56D08A", "#7BE0A0", "#14663C"][i % 4]; ctx.beginPath(); ctx.arc(A.x + 20 + rnd(i) * w, zy + rnd(i + 300) * zs, 8 + rnd(i + 600) * 10, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
        ctx.save(); rr(ctx, A.x + 440, zy, w, zs, 20); ctx.clip();
        const bs = w / 4;
        for (let i = 0; i < 4; i++) for (let j = 0; j < Math.ceil(zs / bs); j++) { const v = rnd(i * 5 + j + 900); ctx.fillStyle = v > 0.66 ? "#1F8A52" : v > 0.33 ? "#2FAE6B" : "#3DBE78";
          ctx.fillRect(A.x + 440 + i * bs, zy + j * bs, bs + 1, bs + 1); if (k <= 0) { ctx.fillStyle = "#56D08A"; ctx.beginPath(); ctx.arc(A.x + 440 + i * bs + bs / 2, zy + j * bs + bs / 2, 12, 0, Math.PI * 2); ctx.fill(); } }
        ctx.restore();
        ctx.strokeStyle = C.kuning; ctx.lineWidth = 5; rr(ctx, A.x + 20, zy, w, zs, 20); ctx.stroke(); rr(ctx, A.x + 440, zy, w, zs, 20); ctx.stroke();
        text(ctx, "daun diperbesar", A.x + 20 + w / 2, zy + zs - 20, 30, { align: "center", weight: 800, color: "#FFFFFF" });
        if (k > 0) text(ctx, "detail hilang", A.x + 440 + w / 2, zy + zs - 20, 30, { align: "center", weight: 800, color: "#FFFFFF" });
        ctx.restore();
      }
    },
    // kirim sebagai dokumen: menu lampiran generik, file asli terkirim
    t12_dokumen(ctx, b, l, t, TL, A) {
      const px = A.x + 60, py = A.y + 10, pw = 700, phh = Math.min(840, A.h - 20);
      card(ctx, px, py, pw, phh, { fill: "#0A0D24", stroke: "#4A55A8", lw: 8, r: 70 });
      text(ctx, "Lampirkan", px + 60, py + 100, 44, { weight: 900, color: C.ink });
      const opts = [["Galeri", C.pink], ["Kamera", C.biru], ["Dokumen", C.kuning]], tap = cue(b, l, "dokumen");
      opts.forEach(([s, col], i) => {
        const x = px + 70 + i * 200, y = py + 160, sel = i === 2 && tap > 0;
        ctx.save(); if (sel) { ctx.translate(x + 70, y + 70); ctx.scale(1.1, 1.1); ctx.translate(-x - 70, -y - 70); }
        card(ctx, x, y, 140, 140, { fill: col, r: 70, glow: sel ? "rgba(255,210,63,0.7)" : null });
        ctx.fillStyle = C.bg;
        if (i === 2) { rr(ctx, x + 45, y + 35, 50, 70, 6); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(x + 55, y + 60, 30, 5); ctx.fillRect(x + 55, y + 74, 30, 5); }
        else if (i === 0) { rr(ctx, x + 38, y + 42, 64, 56, 8); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + 45, y + 90); ctx.lineTo(x + 65, y + 62); ctx.lineTo(x + 95, y + 90); ctx.fill(); }
        else { rr(ctx, x + 36, y + 48, 68, 48, 8); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 70, y + 72, 14, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
        text(ctx, s, x + 70, y + 190, 34, { align: "center", weight: 800, color: sel ? C.kuning : C.ink2 });
      });
      if (tap > -0.6 && tap < 0.6) { const d = Math.max(0, -tap); ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(px + 540 + 20 + d * 100, py + 230 + 20 + d * 120, 26, 0, Math.PI * 2); ctx.fill(); }
      // file terkirim
      const us = pop(b, l, "bukan sebagai");
      if (us > 0) {
        const y = py + 440;
        ctx.save(); ctx.globalAlpha = clamp(us, 0, 1); ctx.translate(0, (1 - us) * 40);
        card(ctx, px + 150, y, 500, 160, { fill: C.tosca, r: 30 });
        ctx.fillStyle = C.bg; rr(ctx, px + 180, y + 35, 70, 90, 8); ctx.fill();
        text(ctx, "pemandangan.jpg", px + 275, y + 70, 36, { weight: 900, color: C.bg, fit: 360 });
        text(ctx, "4 MB · kualitas asli", px + 275, y + 120, 32, { weight: 700, color: C.bg, fit: 360 });
        ctx.restore();
        if (us >= 1) check(ctx, px + 610, y + 200, 50, C.good);
      }
      const ub = pop(b, l, "foto asli");
      if (ub > 0 && us <= 0) { ctx.save(); ctx.translate(480, py + 560); ctx.scale(ub, ub); photo(ctx, -200, -150, 400, 300, 1); ctx.restore(); }
    }
  });
})();
