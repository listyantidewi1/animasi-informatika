/* T07 Kenapa HP lemot kalau banyak aplikasi terbuka? — adegan khusus. Aplikasi generik tanpa merek. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const APPS = [["Chat", C.tosca], ["Kamera", C.pink], ["Musik", C.biru], ["Peta", C.kuning], ["Game", "#B06CFF"], ["Video", C.bad]];

  // ikon aplikasi generik: kotak membulat + simbol sederhana
  function appIcon(ctx, i, x, y, s) {
    const [name, col] = APPS[i];
    card(ctx, x - s / 2, y - s / 2, s, s, { fill: col, r: s * 0.24 });
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.bg; ctx.strokeStyle = C.bg; ctx.lineWidth = s * 0.08; ctx.lineCap = "round";
    if (name === "Chat") { rr(ctx, -s * 0.28, -s * 0.22, s * 0.56, s * 0.36, s * 0.1); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * 0.12, s * 0.12); ctx.lineTo(-s * 0.2, s * 0.26); ctx.lineTo(s * 0.02, s * 0.12); ctx.fill(); }
    else if (name === "Kamera") { rr(ctx, -s * 0.3, -s * 0.16, s * 0.6, s * 0.4, s * 0.08); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, s * 0.04, s * 0.12, 0, Math.PI * 2); ctx.fill(); }
    else if (name === "Musik") { ctx.beginPath(); ctx.arc(-s * 0.1, s * 0.16, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * 0.01, s * 0.16); ctx.lineTo(-s * 0.01, -s * 0.24); ctx.lineTo(s * 0.2, -s * 0.16); ctx.stroke(); }
    else if (name === "Peta") { ctx.beginPath(); ctx.arc(0, -s * 0.06, s * 0.17, Math.PI, 0); ctx.lineTo(0, s * 0.28); ctx.closePath(); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * 0.06, s * 0.07, 0, Math.PI * 2); ctx.fill(); }
    else if (name === "Game") { rr(ctx, -s * 0.32, -s * 0.14, s * 0.64, s * 0.3, s * 0.14); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(-s * 0.22, -s * 0.02, s * 0.14, s * 0.05); ctx.fillRect(-s * 0.175, -s * 0.07, s * 0.05, s * 0.14); ctx.beginPath(); ctx.arc(s * 0.16, 0, s * 0.04, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-s * 0.12, -s * 0.2); ctx.lineTo(s * 0.22, 0); ctx.lineTo(-s * 0.12, s * 0.2); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  // jendela aplikasi kecil di atas meja
  function appCard(ctx, i, x, y, w, h, alpha) {
    ctx.save(); ctx.globalAlpha = alpha ?? 1;
    card(ctx, x, y, w, h, { fill: C.panel, stroke: APPS[i][1], lw: 5, r: 18 });
    appIcon(ctx, i, x + w / 2, y + h * 0.42, h * 0.46);
    text(ctx, APPS[i][0], x + w / 2, y + h - 18, Math.min(34, h * 0.2), { align: "center", weight: 800, color: C.ink });
    ctx.restore();
  }
  // meja (RAM): papan + kaki; mengembalikan y permukaan
  function desk(ctx, x, y, w, label) {
    ctx.fillStyle = "#8A5A3C"; rr(ctx, x, y, w, 36, 10); ctx.fill();
    ctx.fillStyle = "#6B442C"; ctx.fillRect(x + 30, y + 36, 26, 150); ctx.fillRect(x + w - 56, y + 36, 26, 150);
    if (label) pill(ctx, label, x + w / 2, y + 110, 40, { fill: C.kuning });
  }
  // lemari (penyimpanan): banyak laci berisi file
  function wardrobe(ctx, x, y, w, h, t, glow) {
    card(ctx, x, y, w, h, { fill: "#5A3B28", stroke: glow ? C.kuning : "#3E2819", lw: 6, r: 16 });
    const rows = 4, cols = 2, gw = (w - 36) / cols, gh = (h - 36) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const xx = x + 12 + c * (gw + 12), yy = y + 12 + r * (gh + 4);
      card(ctx, xx, yy, gw - 12, gh - 8, { fill: "#7A5238", r: 8 });
      ctx.fillStyle = "#D9B38C"; rr(ctx, xx + gw / 2 - 34, yy + gh / 2 - 10, 44, 10, 5); ctx.fill();
    }
  }
  // meteran RAM terpakai
  function meter(ctx, x, y, w, frac, label) {
    const col = frac > 0.9 ? C.bad : frac > 0.7 ? C.kuning : C.good;
    text(ctx, label || "RAM terpakai", x, y - 14, 36, { weight: 800, color: C.ink2 });
    card(ctx, x, y, w, 48, { fill: C.bg2, r: 24, stroke: C.line, lw: 3 });
    card(ctx, x, y, Math.max(48, w * frac), 48, { fill: col, r: 24 });
    text(ctx, Math.round(frac * 100) + "%", x + w - 14, y - 14, 40, { weight: 900, color: col, align: "right" });
  }
  function phone(ctx, x, y, w, h) {
    card(ctx, x, y, w, h, { fill: "#0A0D24", stroke: "#4A55A8", lw: 8, r: w * 0.14 });
    ctx.fillStyle = "#4A55A8"; rr(ctx, x + w / 2 - 40, y + 18, 80, 12, 6); ctx.fill();
  }
  function spinner(ctx, x, y, r, t, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 6); ctx.lineCap = "round"; ctx.lineWidth = r * 0.25;
    for (let i = 0; i < 8; i++) { ctx.strokeStyle = col || C.ink; ctx.globalAlpha = (i + 1) / 8; ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(0, -r * 0.55); ctx.lineTo(0, -r); ctx.stroke(); }
    ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: HP dengan banyak aplikasi terbuka bertumpuk dan lingkaran memuat
    t07_hp(ctx, b, l, t, TL, A) {
      const h = Math.min(520, A.h - 20), w = h * 0.55, x = 300 - w / 2, y = A.y + (A.h - h) / 2;
      phone(ctx, x, y, w, h);
      for (let i = 0; i < 6; i++) {
        const u = pop(b, l, 0.02 + i * 0.07); if (u <= 0) continue;
        const cw = w * 0.7, ch = h * 0.3;
        appCard(ctx, i, x + w / 2 - cw / 2 + (i % 2 ? 14 : -14), y + 60 + i * (h - ch - 100) / 5, cw, ch, clamp(u, 0, 1));
      }
      const us = ph(b, l, "lemot", 0.3);
      if (us > 0) { ctx.save(); ctx.globalAlpha = us; ctx.fillStyle = "rgba(11,14,42,0.6)"; rr(ctx, x + 8, y + 8, w - 16, h - 16, w * 0.12); ctx.fill(); spinner(ctx, x + w / 2, y + h / 2, 60, t); ctx.restore(); }
      bip(ctx, 720, y + h * 0.35, Math.min(170, h * 0.36), { mood: us > 0 ? "sad" : "think", t });
      const um = pop(b, l, "penuh");
      if (um > 0) { ctx.save(); ctx.translate(720, y + h * 0.8); ctx.scale(um, um); ctx.rotate(-0.06); pill(ctx, "Meja penuh!", 0, 0, 44, { fill: C.bad, color: C.ink }); ctx.restore(); }
    },
    // RAM = meja belajar: aplikasi yang sedang dipakai ditaruh di meja, cepat diambil
    t07_meja(ctx, b, l, t, TL, A) {
      const dy = A.y + 470, ur = pop(b, l, "RAM"), um = ph(b, l, "meja belajar", 0.5);
      desk(ctx, A.x + 40, dy, 740, um > 0 ? "RAM = meja belajar" : null);
      [0, 1, 2].forEach((i, k) => {
        const u = pop(b, l, 0.05 + k * 0.12); if (u <= 0) return;
        const x = A.x + 70 + k * 240, y = lerp(A.y + 60, dy - 210, clamp(u, 0, 1));
        appCard(ctx, i, x, y, 200, 200, clamp(u, 0, 1));
      });
      if (ur > 0) { ctx.save(); ctx.translate(A.x + 410, A.y + 70); ctx.scale(ur, ur); pill(ctx, "RAM: memori kerja", 0, 0, 46, { fill: C.tosca }); ctx.restore(); }
      // garis kecepatan: Bip mengambil aplikasi dengan cepat
      const uc = ph(b, l, "cepat", 0.3);
      if (uc > 0) {
        const bx = A.x + 110 + ((l * 1.6) % 1) * 600;
        ctx.save(); ctx.globalAlpha = uc; ctx.strokeStyle = C.kuning; ctx.lineWidth = 6; ctx.lineCap = "round";
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(bx - 140, dy + 260 + i * 30); ctx.lineTo(bx - 60 - i * 20, dy + 260 + i * 30); ctx.stroke(); }
        ctx.restore(); bip(ctx, bx, dy + 290, 120, { mood: "happy", t });
        text(ctx, "cepat!", A.x + 410, dy + 420, 50, { align: "center", weight: 900, color: C.kuning });
      }
    },
    // penyimpanan = lemari besar tetapi lambat
    t07_lemari(ctx, b, l, t, TL, A) {
      const wh = Math.min(560, A.h - 300), ww = 360, wx = A.x + 20, wy = A.y + 110, ul = pop(b, l, "lemari");
      text(ctx, "Penyimpanan", A.x, A.y + 60, 54, { weight: 900, color: C.kuning });
      if (ul > 0) { ctx.save(); ctx.translate(wx + ww / 2, wy + wh); ctx.scale(clamp(ul, 0, 1.1), clamp(ul, 0, 1.1)); wardrobe(ctx, -ww / 2, -wh, ww, wh, t, false); ctx.restore(); }
      // keterangan kanan: besar, lambat
      const ub = pop(b, l, "besar"), us = pop(b, l, "lebih lambat");
      if (ub > 0) { ctx.save(); ctx.translate(A.x + 620, wy + 120); ctx.scale(ub, ub); pill(ctx, "Besar: 128 GB", 0, 0, 44, { fill: C.tosca }); ctx.restore(); }
      if (us > 0) {
        ctx.save(); ctx.translate(A.x + 620, wy + 240); ctx.scale(us, us); pill(ctx, "Lebih lambat", 0, 0, 44, { fill: C.pink, color: C.ink }); ctx.restore();
        // file berjalan pelan dari lemari ke meja kecil
        const k = ((cue(b, l, "lebih lambat")) * 0.25) % 1, fx = lerp(wx + ww, A.x + 760, k);
        ctx.save(); ctx.globalAlpha = 0.9; appCard(ctx, 4, fx - 60, wy + wh - 150, 120, 120, 1); ctx.restore();
        text(ctx, "pelan…", fx, wy + wh - 170, 36, { align: "center", weight: 800, color: C.ink2 });
      }
      const ys = wy + wh + 40;
      if (A.bot - ys > 70) { card(ctx, A.x, ys, 820, 70, { fill: C.bg2, r: 20, stroke: C.line, lw: 3 }); text(ctx, "Contoh: RAM 4 GB, penyimpanan 128 GB", A.x + 410, ys + 48, 36, { align: "center", weight: 800, color: C.ink2, fit: 780 }); }
    },
    // meja penuh: aplikasi baru datang, aplikasi lama tersingkir
    t07_penuh(ctx, b, l, t, TL, A) {
      const dy = A.y + 520, kick = ease(cue(b, l, "menyingkirkan") / 0.8), un = ph(b, l, "penuh", 0.5);
      const frac = clamp(0.62 + 0.36 * ease(l / 1.4), 0, 0.98) - 0.22 * kick + 0.2 * ease((kick - 0.5) / 0.5);
      meter(ctx, A.x, A.y + 70, 820, frac);
      desk(ctx, A.x + 40, dy, 740, null);
      // empat aplikasi berdesakan di meja; Chat (paling lama) jatuh tersingkir, sisanya bergeser, Game mengisi tempat kosong
      [0, 1, 2, 3].forEach((i, k) => {
        const x = A.x + 50 + k * 190, y = dy - 175;
        if (i === 0) {
          const fx = x - kick * 160, fy = y + kick * kick * 420;
          ctx.save(); ctx.translate(fx + 85, fy + 85); ctx.rotate(-kick * 0.9); appCard(ctx, 0, -85, -85, 170, 170, 1 - 0.6 * kick); ctx.restore();
        } else appCard(ctx, i, x - 190 * ease((kick - 0.2) / 0.5) + (un > 0 && kick <= 0 ? Math.sin(t * 30 + k) * 3 : 0), y, 170, 170, 1);
      });
      const ug = ph(b, l, "penuh", 0.6), gx = A.x + 50 + 3 * 190, land = ease((kick - 0.5) / 0.5);
      if (ug > 0) {
        const yy = lerp(A.y + 150, dy - 175, land);
        appCard(ctx, 4, gx, yy, 170, 170, ug);
        if (land <= 0) { text(ctx, "Aplikasi baru", gx + 85, yy - 16, 32, { align: "center", weight: 800, color: C.kuning }); }
      }
      if (kick > 0.3) { ctx.save(); ctx.translate(A.x + 200, dy + 250); ctx.scale(clamp(kick * 1.3, 0, 1), clamp(kick * 1.3, 0, 1)); pill(ctx, "Chat disingkirkan", 0, 0, 40, { fill: C.bad, color: C.ink }); ctx.restore(); }
    },
    // membuka Chat lagi: harus dimuat ulang dari lemari, batang muat pelan
    t07_ulang(ctx, b, l, t, TL, A) {
      const wx = A.x + 20, wy = A.y + 120, wh = 380;
      wardrobe(ctx, wx, wy, 260, wh, t, true);
      text(ctx, "Penyimpanan", wx + 130, wy - 20, 34, { align: "center", weight: 800, color: C.ink2 });
      const ph1 = A.x + 520, py = A.y + 40, ph2 = 300, phh = 560;
      phone(ctx, ph1, py, ph2, phh);
      const go = Math.max(0, cue(b, l, "dimuat ulang")), k = clamp(go / 2.6, 0, 1);
      // tap ikon Chat
      const tapU = ph(b, l, 0.02, 0.3);
      appIcon(ctx, 0, ph1 + ph2 / 2, py + 150, 110);
      if (tapU > 0 && go <= 0) { ctx.save(); ctx.globalAlpha = 0.8 * (1 - tapU); ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(ph1 + ph2 / 2, py + 150, 30 + 50 * tapU, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      if (go > 0) {
        spinner(ctx, ph1 + ph2 / 2, py + 300, 46, t, C.tosca);
        text(ctx, "Memuat…", ph1 + ph2 / 2, py + 390, 40, { align: "center", weight: 800, color: C.ink });
        card(ctx, ph1 + 40, py + 430, ph2 - 80, 30, { fill: C.bg2, r: 15 });
        card(ctx, ph1 + 40, py + 430, Math.max(30, (ph2 - 80) * k), 30, { fill: C.tosca, r: 15 });
        // potongan data berjalan dari lemari ke HP
        for (let i = 0; i < 4; i++) { const s = ((go * 0.5 + i / 4) % 1); ctx.fillStyle = C.tosca; ctx.globalAlpha = 0.8; rr(ctx, lerp(wx + 270, ph1 - 30, s), wy + 160 + Math.sin(s * Math.PI) * -60, 34, 34, 8); ctx.fill(); ctx.globalAlpha = 1; }
      }
      const ul = pop(b, l, "lemot");
      bip(ctx, A.x + 240, A.bot - 120, 170, { mood: ul > 0 ? "sad" : "think", t });
      if (ul > 0) { ctx.save(); ctx.translate(A.x + 620, A.bot - 120); ctx.scale(ul, ul); ctx.rotate(-0.06); pill(ctx, "Lemot…", 0, 0, 54, { fill: C.bad, color: C.ink }); ctx.restore(); }
    },
    // tampilan aplikasi terbuka: kartu Game dan Video digeser ke atas untuk ditutup, meteran turun
    t07_tutup(ctx, b, l, t, TL, A) {
      const c1 = ease(cue(b, l, "game") / 0.6), c2 = ease(cue(b, l, "berat") / 0.6);
      meter(ctx, A.x, A.y + 70, 820, 0.95 - 0.22 * c1 - 0.2 * c2);
      const top = A.y + 160, cw = 240, ch = Math.min(420, A.h - 300);
      [[4, c1], [5, c2], [0, 0]].forEach(([i, c], k) => {
        const x = A.x + 20 + k * 270, y = top + 20 - c * 500;
        if (c >= 1) return;
        ctx.save(); ctx.globalAlpha = 1 - c;
        card(ctx, x, y, cw, ch, { fill: C.panel, stroke: APPS[i][1], lw: 5, r: 26 });
        appIcon(ctx, i, x + cw / 2, y + ch * 0.4, 110);
        text(ctx, APPS[i][0], x + cw / 2, y + ch * 0.4 + 120, 44, { align: "center", weight: 800, color: C.ink });
        if (c > 0) { arrow(ctx, x + cw / 2, y + ch + 60, x + cw / 2, y + ch - 20, C.kuning, 10, 30); }
        ctx.restore();
      });
      if (c2 >= 1) { const u = pop(b, l, "tidak dipakai"); ctx.save(); ctx.translate(A.x + 280, top + ch / 2); ctx.scale(u, u); check(ctx, -170, 0, 90, C.good); text(ctx, "Lega!", 0, 26, 80, { align: "center", weight: 900, color: C.good }); ctx.restore(); }
      const by = top + ch + 40;
      if (A.bot - by > 150) bip(ctx, 480, by + (A.bot - by) / 2, Math.min(180, A.bot - by - 20), { mood: c2 >= 1 ? "happy" : "think", t, bounce: c2 >= 1 ? 1.5 : 0 });
    }
  });
})();
