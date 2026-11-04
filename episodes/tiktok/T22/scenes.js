/* T22 Warna di layar cuma campuran merah, hijau, dan biru — adegan khusus. Campuran cahaya digambar dengan mode "lighter" (penjumlahan warna sungguhan). */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, bip, rnd, fmt, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const R = "#FF0000", G = "#00FF00", B = "#0000FF";

  function phone(ctx, cx, cy, w, h, fill) {
    card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: "#05061A", r: 44, stroke: C.ink2, lw: 6 });
    card(ctx, cx - w / 2 + 18, cy - h / 2 + 18, w - 36, h - 36, { fill: fill || C.bg2, r: 30 });
    ctx.fillStyle = "#05061A"; rr(ctx, cx - 40, cy - h / 2 + 26, 80, 14, 7); ctx.fill();
  }
  function star(ctx, cx, cy, r, col) {
    ctx.save(); ctx.fillStyle = col; ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.45 : r; ctx.lineTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  // satu titik layar: tiga batang lampu R, G, B dengan kecerahan masing-masing 0..1
  function pixel(ctx, x, y, s, r, g, b) {
    ctx.fillStyle = "#05061A"; ctx.fillRect(x, y, s, s);
    const w = s / 3;
    [[255, 0, 0, r], [0, 255, 0, g], [0, 0, 255, b]].forEach(([cr, cg, cb, v], i) => {
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.12 + 0.88 * v})`; rr(ctx, x + i * w + w * 0.12, y + s * 0.06, w * 0.76, s * 0.88, w * 0.2); ctx.fill();
    });
  }
  // lingkaran cahaya yang dijumlahkan
  function lights(ctx, list, box) {
    ctx.save(); rr(ctx, box.x, box.y, box.w, box.h, 30); ctx.fillStyle = "#000000"; ctx.fill(); ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    for (const [x, y, r, col, a] of list) { if (a <= 0) continue; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: layar HP menampilkan bintang kuning, tanda tanya
    t22_kait(ctx, b, l, t, TL, A) {
      const h = Math.min(560, A.h - 20), w = h * 0.56, cx = 400, cy = A.y + h / 2 + 10;
      phone(ctx, cx, cy, w, h);
      const u = pop(b, l, 0.05); star(ctx, cx, cy, w * 0.33 * u * (1 + 0.04 * Math.sin(l * 5)), "#FFFF00");
      const uq = pop(b, l, "dari mana");
      if (uq > 0) { ctx.save(); ctx.translate(720, cy - 60); ctx.scale(uq, uq); text(ctx, "?", 0, 60, 220, { align: "center", weight: 900, color: C.kuning, shadow: true }); ctx.restore(); }
      bip(ctx, 720, cy + h / 2 - 70, 150, { mood: "think", t, look: [-0.8, -0.3] });
    },

    // perbesar layar: tiap titik berisi tiga lampu merah, hijau, biru
    t22_zoom(ctx, b, l, t, TL, A) {
      const z = ph(b, l, 0.05, 1.4), box = { x: 80, y: A.y + 20, w: 800, h: 640 };
      card(ctx, box.x - 6, box.y - 6, box.w + 12, box.h + 12, { fill: C.panel, r: 34 });
      ctx.save(); rr(ctx, box.x, box.y, box.w, box.h, 30); ctx.clip();
      const s = lerp(22, 200, ease(z)), cx = box.x + box.w / 2, cy = box.y + box.h / 2;
      const nx = Math.ceil(box.w / s / 2) + 1, ny = Math.ceil(box.h / s / 2) + 1;
      const on = k => cue(b, l, ["merah", "hijau", "biru"][k]) > 0;
      const hl = on(2) ? 2 : on(1) ? 1 : on(0) ? 0 : -1;
      for (let i = -nx; i <= nx; i++) for (let j = -ny; j <= ny; j++) {
        const v = hl < 0 ? [1, 1, 0] : [hl === 0 ? 1 : 0.15, hl === 1 ? 1 : 0.15, hl === 2 ? 1 : 0.15];
        pixel(ctx, cx + i * s - s / 2, cy + j * s - s / 2, s, ...v);
      }
      if (z < 0.45) { ctx.globalAlpha = clamp(1 - z / 0.45, 0, 1); ctx.fillStyle = "#FFFF00"; ctx.fillRect(box.x, box.y, box.w, box.h); ctx.globalAlpha = 1; }
      ctx.restore();
      text(ctx, z < 0.3 ? "layar kuning" : "diperbesar ×" + Math.round(lerp(1, 60, ease(z))), box.x + 30, box.y + 60, 40, { weight: 900, color: z < 0.3 ? C.bg : C.ink, shadow: z >= 0.3 });
      // label tiga lampu
      ["Merah", "Hijau", "Biru"].forEach((s2, k) => {
        const u = pop(b, l, ["merah", "hijau", "biru"][k]); if (u <= 0) return;
        ctx.save(); ctx.translate(200 + k * 280, box.y + box.h + 90); ctx.scale(u, u);
        pill(ctx, s2, 0, 0, 50, { fill: [R, G, "#3D6BFF"][k], color: k === 1 ? C.bg : "#FFFFFF" }); ctx.restore();
      });
      const by = box.y + box.h + 160; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(190, A.bot - by - 10), { mood: "wow", t });
    },

    // merah + hijau = kuning (cahaya)
    t22_kuning(ctx, b, l, t, TL, A) {
      const box = { x: 80, y: A.y + 20, w: 800, h: 560 }, cy = box.y + box.h / 2, r = 200;
      const ur = ph(b, l, "merah", 0.5), ug = ph(b, l, "hijau", 0.5), m = ph(b, l, "bersamaan", 0.9);
      lights(ctx, [[lerp(-100, 330 + 70 * m, ur), cy, r, R, ur], [lerp(1060, 630 - 70 * m, ug), cy, r, G, ug]], box);
      const uk = pop(b, l, "kuning");
      if (uk > 0) { ctx.save(); ctx.translate(480, cy); ctx.scale(uk, uk); text(ctx, "kuning", 0, 18, 56, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      // persamaan di bawah
      const ey = box.y + box.h + 100;
      if (ug > 0) {
        pixel(ctx, 110, ey - 70, 120, 1, 0, 0); text(ctx, "+", 285, ey + 10, 80, { align: "center", weight: 900, color: C.ink });
        pixel(ctx, 340, ey - 70, 120, 0, 1, 0); text(ctx, "=", 520, ey + 10, 80, { align: "center", weight: 900, color: C.ink });
        if (uk > 0) { ctx.save(); ctx.globalAlpha = clamp(uk, 0, 1); card(ctx, 580, ey - 70, 270, 120, { fill: "#FFFF00", r: 20 }); text(ctx, "KUNING", 715, ey + 8, 48, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      }
      const by = ey + 110; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(180, A.bot - by - 10), { mood: uk > 0 ? "wow" : "think", t });
    },

    // ketiganya menyala = putih; semuanya mati = hitam
    t22_putih(ctx, b, l, t, TL, A) {
      const box = { x: 80, y: A.y + 20, w: 800, h: 640 }, cx = 480, cy = box.y + box.h / 2 + 20, r = 190, d = 115;
      const on = ph(b, l, 0.02, 0.6), off = 1 - ph(b, l, "semuanya mati", 0.7);
      const a = on * off;
      lights(ctx, [[cx, cy - d, r, R, a], [cx - d * 0.95, cy + d * 0.6, r, G, a], [cx + d * 0.95, cy + d * 0.6, r, B, a]], box);
      const uw = pop(b, l, "putih");
      if (uw > 0 && off > 0.5) { ctx.save(); ctx.translate(cx, cy + 20); ctx.scale(uw, uw); text(ctx, "putih", 0, 0, 48, { align: "center", weight: 900, color: C.bg }); ctx.restore(); }
      const uh = pop(b, l, "hitam");
      if (uh > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(uh, uh); text(ctx, "hitam", 0, 20, 80, { align: "center", weight: 900, color: C.ink2 }); ctx.restore(); }
      // tiga titik kecil penanda nyala/mati
      const py = box.y + box.h + 70;
      [[1, 1, 1, "semua nyala", 0.02], [0, 0, 0, "semua mati", "semuanya mati"]].forEach(([r1, g1, b1, s, c], i) => {
        const u = pop(b, l, c); if (u <= 0) return; ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        pixel(ctx, 120 + i * 400, py - 50, 100, r1, g1, b1); text(ctx, s, 240 + i * 400, py + 12, 40, { weight: 800, color: C.ink2 }); ctx.restore();
      });
    },

    // cat berbeda: merah + hijau = cokelat kusam
    t22_cat(ctx, b, l, t, TL, A) {
      const y = A.y + 30, blob = (x, yy, r, col, wob) => { ctx.fillStyle = col; ctx.beginPath();
        for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, rr2 = r * (1 + 0.08 * Math.sin(a * 3 + wob)); ctx.lineTo(x + Math.cos(a) * rr2, yy + Math.sin(a) * rr2); } ctx.fill(); };
      text(ctx, "Cat", 80, y + 50, 56, { weight: 900, color: C.kuning });
      const u1 = pop(b, l, "cat merah"), u2 = pop(b, l, "cat hijau"), mix = ph(b, l, "malah", 0.9);
      // ember/palet
      card(ctx, 80, y + 90, 800, 420, { fill: "#EDE6D8", r: 60 });
      if (u1 > 0) blob(lerp(260, 480, mix), y + 300, 120 * u1 * (1 - 0.15 * mix), lerp(0, 1, mix) > 0.5 ? "#6B4A2B" : "#D7263D", l * 2);
      if (u2 > 0 && mix < 0.5) blob(lerp(700, 480, mix), y + 300, 120 * u2, "#2E9E44", l * 2 + 1);
      if (mix > 0) { ctx.save(); ctx.strokeStyle = "rgba(60,40,20,0.5)"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(480, y + 300, 60, l * 6, l * 6 + 4); ctx.stroke(); ctx.restore(); }
      const uc = pop(b, l, "cokelat kusam");
      if (uc > 0) { ctx.save(); ctx.translate(480, y + 470); ctx.scale(uc, uc); pill(ctx, "cokelat kusam", 0, 0, 44, { fill: "#6B4A2B", color: C.ink }); ctx.restore(); }
      // perbandingan singkat
      const cy2 = y + 600, uv = ph(b, l, "berbeda", 0.4);
      if (uv > 0) { ctx.save(); ctx.globalAlpha = uv;
        text(ctx, "Cahaya:", 90, cy2 + 30, 44, { weight: 800, color: C.ink2 });
        pixel(ctx, 290, cy2 - 30, 80, 1, 0, 0); text(ctx, "+", 400, cy2 + 30, 60, { align: "center", weight: 900 }); pixel(ctx, 440, cy2 - 30, 80, 0, 1, 0);
        text(ctx, "=", 560, cy2 + 30, 60, { align: "center", weight: 900 }); card(ctx, 600, cy2 - 30, 260, 80, { fill: "#FFFF00", r: 16 }); text(ctx, "kuning", 730, cy2 + 24, 40, { align: "center", weight: 900, color: C.bg });
        ctx.restore(); }
      const by = cy2 + 100; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(180, A.bot - by - 10), { mood: uc > 0 ? "wow" : "think", t });
    },

    // tiga pengatur terang redup, warna berubah-ubah; 256 x 256 x 256 kombinasi
    t22_atur(ctx, b, l, t, TL, A) {
      const y = A.y + 20, v = [0.5 + 0.5 * Math.sin(l * 1.3), 0.5 + 0.5 * Math.sin(l * 1.7 + 2), 0.5 + 0.5 * Math.sin(l * 1.1 + 4)];
      const col = `rgb(${Math.round(v[0] * 255)},${Math.round(v[1] * 255)},${Math.round(v[2] * 255)})`;
      card(ctx, 280, y, 400, 300, { fill: col, r: 40, stroke: C.ink, lw: 6 });
      ["Merah", "Hijau", "Biru"].forEach((s, k) => {
        const yy = y + 380 + k * 110, c = ["#FF3B3B", "#2BE04A", "#3D6BFF"][k];
        text(ctx, s, 80, yy + 16, 44, { weight: 800, color: C.ink });
        card(ctx, 280, yy - 12, 440, 24, { fill: C.panel2, r: 12 }); card(ctx, 280, yy - 12, 440 * v[k], 24, { fill: c, r: 12 });
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(280 + 440 * v[k], yy, 26, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(Math.round(v[k] * 255)), 860, yy + 16, 40, { align: "right", weight: 900, color: C.ink2 });
      });
      const uj = pop(b, l, "jutaan warna"), jy = y + 760;
      if (uj > 0 && jy + 60 < A.bot) { ctx.save(); ctx.translate(480, jy); ctx.scale(uj, uj);
        text(ctx, "256 × 256 × 256", 0, -10, 50, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, "= 16.777.216 warna", 0, 70, 66, { align: "center", weight: 900, color: C.kuning, shadow: true, fit: 800 }); ctx.restore(); }
    }
  });
})();
