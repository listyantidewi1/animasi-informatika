/* T09 Kode QR: kotak hitam-putih yang bisa dibaca — adegan khusus. Kode QR hiasan (pola acak, bukan kode sungguhan), alamat rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const N = 25;
  const inFinder = (i, j) => [[0, 0], [N - 7, 0], [0, N - 7]].find(([x, y]) => i >= x - 1 && i <= x + 7 && j >= y - 1 && j <= y + 7);
  function mod(i, j) {               // 1 = hitam, 0 = putih
    const f = inFinder(i, j);
    if (f) { const x = i - f[0], y = j - f[1]; if (x < 0 || y < 0 || x > 6 || y > 6) return 0; return (x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) ? 1 : 0; }
    if (i === 6) return j % 2 === 0 ? 1 : 0;
    if (j === 6) return i % 2 === 0 ? 1 : 0;
    return rnd(i * 31 + j * 7 + 3) > 0.5 ? 1 : 0;
  }
  // gambar kode QR hiasan; size = lebar total termasuk tepi putih; opt.hide(i,j) -> true untuk modul yang tertutup noda
  function qr(ctx, x, y, size, opt = {}) {
    const q = size / (N + 4);
    card(ctx, x, y, size, size, { fill: "#FFFFFF", r: q * 1.2 });
    ctx.fillStyle = "#0B0E2A";
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (mod(i, j)) {
      if (opt.hilite && inFinder(i, j)) continue;
      ctx.fillRect(x + (i + 2) * q, y + (j + 2) * q, q + 0.6, q + 0.6);
    }
    if (opt.hilite) {
      ctx.fillStyle = opt.hilite;
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (mod(i, j) && inFinder(i, j)) ctx.fillRect(x + (i + 2) * q, y + (j + 2) * q, q + 0.6, q + 0.6);
    }
    return q;
  }
  function scanLine(ctx, x, y, size, k) {
    const yy = y + size * k;
    const g = ctx.createLinearGradient(0, yy - 60, 0, yy);
    g.addColorStop(0, "rgba(34,227,196,0)"); g.addColorStop(1, "rgba(34,227,196,0.45)");
    ctx.fillStyle = g; ctx.fillRect(x, yy - 60, size, 60);
    ctx.fillStyle = C.tosca; ctx.fillRect(x - 10, yy - 3, size + 20, 6);
  }
  function brackets(ctx, x, y, s, col, lw) {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw || 10; ctx.lineCap = "round"; const k = s * 0.18;
    [[x, y, 1, 1], [x + s, y, -1, 1], [x, y + s, 1, -1], [x + s, y + s, -1, -1]].forEach(([a, b2, dx, dy]) => { ctx.beginPath(); ctx.moveTo(a + dx * k, b2); ctx.lineTo(a, b2); ctx.lineTo(a, b2 + dy * k); ctx.stroke(); });
    ctx.restore();
  }
  // noda yang menutupi pojok kanan bawah
  function stain(ctx, cx, cy, r, t) {
    ctx.save(); ctx.fillStyle = "#8A5A3C"; ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, rr2 = r * (0.85 + 0.2 * rnd(i + 5)); i ? ctx.lineTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2) : ctx.moveTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2); }
    ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.25, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: kode QR dipindai, lalu noda menutup sebagian dan tetap terbaca
    t09_scan(ctx, b, l, t, TL, A) {
      const s = Math.min(500, A.h - 40), x = 400 - s / 2, y = A.y + (A.h - s) / 2, u = pop(b, l, 0.02);
      ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.scale(u, u); ctx.translate(-x - s / 2, -y - s / 2);
      qr(ctx, x, y, s);
      const us = ph(b, l, "rusak", 0.4);
      if (us > 0) { ctx.save(); ctx.globalAlpha = us; stain(ctx, x + s * 0.72, y + s * 0.7, s * 0.2 * us, t); ctx.restore(); }
      scanLine(ctx, x, y, s, (l * 0.8) % 1); brackets(ctx, x - 20, y - 20, s + 40, C.tosca, 10);
      ctx.restore();
      const ok = pop(b, l, 0.97);
      if (ok > 0) { ctx.save(); ctx.translate(800, y + s * 0.5); ctx.scale(ok, ok); ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.fill(); check(ctx, 0, 0, 90, C.bg); ctx.restore(); text(ctx, "terbaca", 800, y + s * 0.5 + 130, 40, { align: "center", weight: 800, color: C.good }); }
      else bip(ctx, 800, y + s * 0.5, 140, { mood: "wow", t });
    },
    // perbesaran: tiap kotak kecil = 1 bit (hitam 1, putih 0)
    t09_bit(ctx, b, l, t, TL, A) {
      const s = 300, x = A.x + 10, y = A.y + 30, q = qr(ctx, x, y, s);
      // bagian yang diperbesar: 6x6 modul mulai (9,9)
      const i0 = 9, j0 = 9, n = 6, zx = A.x + 330, zy = A.y + 20, zs = 490, c = zs / n, uz = ph(b, l, 0.05, 0.5);
      ctx.strokeStyle = C.kuning; ctx.lineWidth = 5; ctx.strokeRect(x + (i0 + 2) * q, y + (j0 + 2) * q, n * q, n * q);
      if (uz > 0) {
        ctx.save(); ctx.globalAlpha = uz;
        ctx.strokeStyle = "rgba(255,210,63,0.5)"; ctx.lineWidth = 3; ctx.beginPath();
        ctx.moveTo(x + (i0 + 2 + n) * q, y + (j0 + 2) * q); ctx.lineTo(zx, zy); ctx.moveTo(x + (i0 + 2 + n) * q, y + (j0 + 2 + n) * q); ctx.lineTo(zx, zy + zs); ctx.stroke();
        card(ctx, zx - 8, zy - 8, zs + 16, zs + 16, { fill: C.kuning, r: 16 });
        const u1 = ph(b, l, "hitam", 0.4), u0 = ph(b, l, "putih", 0.4);
        for (let a = 0; a < n; a++) for (let d = 0; d < n; d++) {
          const v = mod(i0 + a, j0 + d), cx = zx + a * c, cy = zy + d * c;
          ctx.fillStyle = v ? "#0B0E2A" : "#FFFFFF"; ctx.fillRect(cx, cy, c + 0.5, c + 0.5);
          const uu = v ? u1 : u0;
          if (uu > 0) { ctx.save(); ctx.globalAlpha = uz * uu; text(ctx, String(v), cx + c / 2, cy + c * 0.68, c * 0.5, { align: "center", weight: 900, color: v ? C.kuning : C.pink }); ctx.restore(); }
        }
        ctx.restore();
      }
      // legenda
      const ly = zy + zs + 70, ub = pop(b, l, "satu bit");
      if (ub > 0) { ctx.save(); ctx.translate(A.x + 170, A.y + 430); ctx.scale(ub, ub); pill(ctx, "1 kotak = 1 bit", 0, 0, 38, { fill: C.kuning }); ctx.restore(); }
      [["hitam", "#0B0E2A", "1", C.kuning], ["putih", "#FFFFFF", "0", C.pink]].forEach(([w, f, v, col], k) => {
        const u = pop(b, l, w); if (u <= 0 || ly + 120 > A.bot) return;
        ctx.save(); ctx.translate(A.x + 200 + k * 420, ly + 40); ctx.scale(u, u);
        card(ctx, -170, -60, 340, 120, { fill: C.panel, stroke: C.line, lw: 3, r: 24 });
        card(ctx, -140, -36, 72, 72, { fill: f, r: 8, stroke: C.ink2, lw: 2 });
        text(ctx, "= " + v, 30, 26, 76, { align: "center", weight: 900, color: col }); ctx.restore();
      });
    },
    // tiga kotak penanda di pojok: kode miring diluruskan oleh kamera
    t09_pojok(ctx, b, l, t, TL, A) {
      const s = Math.min(560, A.h - 260), cx = 480, cy = A.y + 40 + s / 2 + 40, uh = ph(b, l, "tiga kotak", 0.4), k = ease(cue(b, l, "posisi") / 1.0);
      const ang = lerp(-0.45, 0, k);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.translate(-s / 2, -s / 2);
      const q = qr(ctx, 0, 0, s, { hilite: uh > 0 ? C.pink : null });
      if (uh > 0) {
        [[0, 0], [N - 7, 0], [0, N - 7]].forEach(([i, j], n) => {
          const p = 1 + 0.08 * Math.sin(l * 8 + n);
          ctx.save(); ctx.translate((i + 2 + 3.5) * q, (j + 2 + 3.5) * q); ctx.scale(p, p); ctx.strokeStyle = C.pink; ctx.lineWidth = 8; ctx.globalAlpha = uh;
          ctx.strokeRect(-4.6 * q, -4.6 * q, 9.2 * q, 9.2 * q); ctx.restore();
        });
      }
      ctx.restore();
      brackets(ctx, cx - s / 2 - 40, cy - s / 2 - 40, s + 80, k >= 1 ? C.good : "rgba(255,255,255,0.6)", 10);
      // label arah
      const ul = pop(b, l, "arah");
      if (ul > 0) { ctx.save(); ctx.translate(480, cy + s / 2 + 110); ctx.scale(ul, ul); pill(ctx, k >= 1 ? "Posisi dan arah ditemukan ✓" : "Meluruskan…", 0, 0, 40, { fill: k >= 1 ? C.good : C.kuning }); ctx.restore(); }
      text(ctx, "Kamera", A.x, A.y + 30, 36, { weight: 800, color: C.ink2 });
    },
    // kode yang kena noda tetap terbaca berkat data cadangan
    t09_rusak(ctx, b, l, t, TL, A) {
      const s = Math.min(540, A.h - 300), x = A.x + 20, y = A.y + 40, us = ph(b, l, "rusak", 0.5);
      qr(ctx, x, y, s);
      if (us > 0) stain(ctx, x + s * 0.68, y + s * 0.62, s * 0.3 * us, t);
      const go = cue(b, l, "rusak"), scan = go > 0 ? clamp(go / 1.4, 0, 1) : 0;
      if (scan > 0 && scan < 1) scanLine(ctx, x, y, s, scan);
      // data cadangan: kotak salinan kecil di kanan
      const uc = ph(b, l, "cadangan", 0.5);
      if (uc > 0) {
        ctx.save(); ctx.globalAlpha = uc;
        const bx = x + s + 40;
        text(ctx, "data", bx, y + 50, 38, { weight: 800, color: C.ink });
        text(ctx, "cadangan", bx, y + 92, 38, { weight: 800, color: C.tosca });
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { ctx.fillStyle = rnd(i * 9 + j + 40) > 0.5 ? C.tosca : C.panel2; ctx.fillRect(bx + i * 46, y + 120 + j * 46, 40, 40); }
        ctx.restore();
      }
      // persen rusak
      const up = pop(b, l, "30 persen"), py = y + s + 50;
      if (up > 0) {
        text(ctx, "Rusak", A.x, py + 40, 40, { weight: 800, color: C.ink2 });
        card(ctx, A.x + 140, py, 680, 54, { fill: C.bg2, r: 27, stroke: C.line, lw: 3 });
        card(ctx, A.x + 140, py, 680 * 0.3 * clamp(up, 0, 1), 54, { fill: "#8A5A3C", r: 27 });
        text(ctx, "±30%", A.x + 140 + 680 * 0.3 + 20, py + 42, 44, { weight: 900, color: C.kuning });
      }
      const ok = pop(b, l, "masih terbaca");
      if (ok > 0) { ctx.save(); ctx.translate(480, py + 160); ctx.scale(ok, ok); pill(ctx, "Masih terbaca ✓", 0, 0, 52, { fill: C.good }); ctx.restore(); }
    },
    // memindai kode QR: munculkan alamat link dan periksa sebelum dibuka
    t09_link(ctx, b, l, t, TL, A) {
      const pw = 420, phh = Math.min(820, A.h - 40), px = A.x + 10, py = A.y + 20;
      card(ctx, px, py, pw, phh, { fill: "#0A0D24", stroke: "#4A55A8", lw: 8, r: 50 });
      const s = 260; qr(ctx, px + (pw - s) / 2, py + 90, s);
      brackets(ctx, px + (pw - s) / 2 - 20, py + 70, s + 40, C.tosca, 8);
      // kartu link yang muncul
      const ul = pop(b, l, "link"), y2 = py + 420;
      if (ul > 0) {
        ctx.save(); ctx.globalAlpha = clamp(ul, 0, 1); ctx.translate(0, (1 - ul) * 40);
        card(ctx, px + 20, y2, pw - 40, 300, { fill: C.panel, stroke: C.line, lw: 3, r: 26 });
        text(ctx, "Buka link ini?", px + pw / 2, y2 + 60, 36, { align: "center", weight: 800, color: C.ink });
        text(ctx, "hadiah-pulsa-", px + pw / 2, y2 + 125, 34, { align: "center", weight: 800, color: C.kuning });
        text(ctx, "gratiss.contoh", px + pw / 2, y2 + 168, 34, { align: "center", weight: 800, color: C.kuning });
        card(ctx, px + 40, y2 + 210, 160, 66, { fill: C.panel2, r: 33 }); text(ctx, "Batal", px + 120, y2 + 254, 32, { align: "center", weight: 800, color: C.ink });
        card(ctx, px + pw - 200, y2 + 210, 160, 66, { fill: C.biru, r: 33 }); text(ctx, "Buka", px + pw - 120, y2 + 254, 32, { align: "center", weight: 800, color: C.bg });
        ctx.restore();
      }
      // kaca pembesar memeriksa alamat + daftar periksa
      const um = ph(b, l, "periksa", 0.4);
      if (um > 0) {
        const mx = lerp(px + 120, px + 300, (Math.sin(l * 2) + 1) / 2), my = y2 + 140;
        ctx.save(); ctx.globalAlpha = um; ctx.strokeStyle = C.ink; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(mx, my, 54, 0, Math.PI * 2); ctx.stroke();
        ctx.lineCap = "round"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(mx + 40, my + 40); ctx.lineTo(mx + 90, my + 90); ctx.stroke(); ctx.restore();
        const tips = ["Nama situsnya benar?", "Ejaannya aneh?", "Minta data pribadi?"];
        tips.forEach((s2, i) => {
          const u = pop(b, l, "periksa", 0.4 + i * 0.35); if (u <= 0) return;
          ctx.save(); ctx.translate(px + pw + 30, py + 120 + i * 150); ctx.scale(u, u);
          card(ctx, 0, 0, 340, 120, { fill: C.panel, stroke: C.kuning, lw: 4, r: 22 });
          text(ctx, "?", 46, 82, 64, { align: "center", weight: 900, color: C.kuning });
          T.helpers.para(ctx, s2, 210, 50, 34, 230, { align: "center", weight: 800, color: C.ink }); ctx.restore();
        });
      }
      const ub = pop(b, l, "sebelum dibuka");
      if (ub > 0) bip(ctx, px + pw + 200, py + 640, 150, { mood: "think", t });
    }
  });
})();
