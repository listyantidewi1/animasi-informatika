/* Pembantu gambar untuk simulasi S01, S14, S16, S28 (salinan identik di folder masing-masing; tidak dipakai simulasi lain).
   Memakai Kiko.layar (layar.js) dan Kiko.hp (layar_hp.js). Tata letak HP: HP besar di kiri (cx 560), lup di tengah (x 790–1410),
   panel langkah di kanan (x 1450–1820). Adegan umum berbasis data beat: tujuan, prasyarat, coba, periksa, latihan.
   Gambar khusus per simulasi lewat Kiko.bantu.art = { tujuan(ctx, l), coba(ctx, l), periksa(ctx, l) }. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const B = { art: {} };
  B.BLUE = "#1A73C8"; B.RED = "#D9443B"; B.GREEN = "#2E9E5B"; B.ORANGE = "#E07B2E"; B.GRAY = "#5B6B76";
  B.PC = { cx: 560, cy: 474, h: 680 };

  let MC = null;
  B.measure = fn => { if (!MC) MC = document.createElement("canvas"); MC.width = 2000; MC.height = 1200; const m = MC.getContext("2d"); m.save(); const r = fn(m); m.restore(); return r; };
  B.rowsOf = (items, opt) => B.measure(m => HP.list(m, items, opt));
  B.tapRow = (rows, i, dx = 0) => [rows[i].x + rows[i].w * 0.5 + dx, rows[i].cy];
  B.phone = (ctx, draw, opt = {}) => HP.phone(ctx, opt.cx || B.PC.cx, opt.cy || B.PC.cy, { h: opt.h || B.PC.h, ...opt }, draw);
  B.stepAt = (l, span, marks) => { let n = 0; marks.forEach((m, i) => { if (l >= m * span) n = i + 1; }); return n; };
  B.spanOf = (b, k = 0.9) => Math.max(3, (b.audio || b.dur) * k);
  B.after = (b, l, f) => l > (b.audio || b.dur) * f;
  B.tapDraw = (c, R) => { if (R.tap) HP.tap(c, R.tap.x, R.tap.y, R.tap.u); };
  B.fade = (l, t0, d = 0.4) => ease((l - t0) / d);

  // panel langkah: judul + daftar langkah; langkah ke-n sedang dikerjakan (sebelumnya dicentang)
  B.steps = function (ctx, title, items, n, opt = {}) {
    const x = opt.x || 1450, y = opt.y || 122, w = opt.w || 370; let hh = 70;
    const rows = items.map(s => wrap(ctx, s, 23, 700, w - 86)); rows.forEach(lines => hh += lines.length * 30 + 22);
    card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 44, 24, { weight: 900, color: C.accentDark });
    let yy = y + 74;
    rows.forEach((lines, i) => {
      const done = i < n, now = i === n;
      if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, yy - 8, w - 20, lines.length * 30 + 16, 10); ctx.fill(); }
      ctx.fillStyle = done ? B.GREEN : now ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(x + 36, yy + 13, 14, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 36, yy + 21, 18, { align: "center", weight: 900, color: "#FFFFFF" });
      lines.forEach((ln, j) => text(ctx, ln, x + 62, yy + 22 + j * 30, 23, { weight: 700, color: done ? C.ink2 : C.ink }));
      yy += lines.length * 30 + 22;
    });
    return y + hh;
  };
  // keterangan bertumpuk (bawaan di bawah panel langkah). n: {s, fill, color, size}
  B.notes = function (ctx, y, list, opt = {}) {
    let yy = y + 24; const x = opt.x || 1450;
    list.forEach(n => { if (!n) return; const r = L.callout(ctx, x, yy, n.s, null, null, { size: n.size || 22, maxW: opt.maxW || 330, fill: n.fill, color: n.color }); yy += r.h + 16; });
    return yy;
  };
  B.tip = s => ({ s, fill: "#E7F1FB", color: B.BLUE });       // catatan "di aplikasi lain …"
  B.ok = s => ({ s, fill: C.goodBg, color: B.GREEN });
  B.warn = s => ({ s, fill: C.badBg, color: B.RED });
  B.badge = function (ctx, x, y, ok, s, opt = {}) {
    const h = opt.h || 76, w = opt.w || 500; ctx.fillStyle = ok ? C.goodBg : C.badBg; rr(ctx, x, y, w, h, 14); ctx.fill();
    ctx.fillStyle = ok ? B.GREEN : B.RED; ctx.beginPath(); ctx.arc(x + 34, y + h / 2, 19, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ok ? "check" : "close", x + 34, y + h / 2, 18, "#FFFFFF");
    const sz = opt.size || 24, lines = wrap(ctx, s, sz, 800, w - 80);
    lines.forEach((ln, i) => text(ctx, ln, x + 66, y + h / 2 + sz * 0.36 - (lines.length - 1) * sz * 0.6 + i * sz * 1.2, sz, { weight: 800, color: C.ink }));
  };
  B.MAG = { x: 790, y: 150, w: 620 };
  // HP + lup bagian pentingnya (src dalam satuan lokal HP)
  B.show = function (ctx, draw, src, opt = {}) {
    const ph = B.phone(ctx, draw, opt);
    const m = src ? HP.magnify(ctx, ph, draw, src, { x: opt.mx || B.MAG.x, y: opt.my || B.MAG.y, w: opt.mw || B.MAG.w }, { bg: opt.dark ? "#11181D" : undefined }) : null;
    return { ph, m };
  };
  // label kecil di atas bagian kanvas
  B.tag = function (ctx, x, y, s, opt = {}) {
    ctx.font = `800 ${opt.size || 22}px Inter`; const w = ctx.measureText(s).width + 28, h = (opt.size || 22) + 18;
    ctx.fillStyle = opt.fill || C.accent; rr(ctx, opt.align === "center" ? x - w / 2 : x, y, w, h, h / 2); ctx.fill();
    text(ctx, s, (opt.align === "center" ? x - w / 2 : x) + w / 2, y + h / 2 + (opt.size || 22) * 0.36, opt.size || 22, { align: "center", weight: 800, color: opt.ink || "#FFFFFF" });
    return w;
  };

  // ---------- adegan umum berbasis data beat ----------
  Object.assign(K.SCENES, {
    // b.tujuan: [[ikon, teks], ...]
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      (b.tujuan || []).forEach(([ic, s], i) => {
        const u = ease((l - 0.6 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        const y = 280 + i * (b.tujuan.length > 4 ? 88 : 104), hh = b.tujuan.length > 4 ? 74 : 84;
        card(ctx, 260, y, 860, hh, { fill: C.bg2, r: 16 }); HP.icon(ctx, ic, 308, y + hh / 2, 36, B.GREEN); text(ctx, s, 350, y + hh / 2 + 11, 31, { weight: 800, fit: 750 }); ctx.globalAlpha = 1;
      });
      if (B.art.tujuan) B.art.tujuan(ctx, l, b);
    },
    // b.pras: {codes: [[kode, judul]], list: [[ikon, teks]], listTitle, note}
    prasyarat(ctx, b, l) {
      const P = b.pras || {}; card(ctx, 160, 150, 1600, 660);
      text(ctx, P.heading || "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      const codes = P.codes || [];
      codes.forEach(([k, t], i) => {
        const h = codes.length > 1 ? 190 : 340, y = 280 + i * (h + 24);
        card(ctx, 240, y, 680, h, { fill: C.bg2, r: 22 });
        text(ctx, k, 580, y + (codes.length > 1 ? 72 : 100), codes.length > 1 ? 48 : 60, { align: "center", weight: 900, color: C.kiko });
        para(ctx, t, 580, y + (codes.length > 1 ? 122 : 170), codes.length > 1 ? 28 : 34, 620, { align: "center", weight: 800, lh: 1.2 });
      });
      text(ctx, P.listTitle || "", 1000, 320, 28, { weight: 900 });
      (P.list || []).forEach(([ic, s], i) => {
        const u = ease((l - 0.5 - i * 0.5) / 0.4); if (u <= 0) return; ctx.globalAlpha = u; const y = 350 + i * 62;
        ctx.fillStyle = "#E3EEFA"; ctx.beginPath(); ctx.arc(1030, y + 24, 22, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, 1030, y + 24, 24, B.BLUE);
        text(ctx, s, 1066, y + 33, 26, { weight: 800, fit: 640 }); ctx.globalAlpha = 1;
      });
      if (P.note) { card(ctx, 460, 700, 1000, 64, { fill: "#FFF3D6", r: 14 }); text(ctx, P.note, 960, 742, 26, { align: "center", weight: 800, color: C.accentDark, fit: 960 }); }
    },
    // b.coba: daftar langkah; b.cobaSub: kalimat kecil di bawah judul
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 270, 64, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 292, 238, 18, 64, 6); ctx.fill(); rr(ctx, 330, 238, 18, 64, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 258, 44, { weight: 900, color: C.accentDark });
      text(ctx, b.cobaSub || "Hentikan video, kerjakan langkahnya, lalu putar lagi.", 430, 304, 28, { weight: 700, color: C.ink2, fit: 760 });
      const n = (b.coba || []).length, gap = n > 5 ? 74 : 88;
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 350 + i * gap, 960, gap - 14, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 350 + i * gap + (gap - 14) / 2 + 11, 30, { align: "center", weight: 900, color: C.kiko });
        text(ctx, s, 320, 350 + i * gap + (gap - 14) / 2 + 10, 27, { weight: 700, fit: 850 }); });
      if (B.art.coba) B.art.coba(ctx, l, b);
    },
    // b.periksa: [[hal, hasil benar], ...]
    periksa(ctx, b, l) {
      const items = b.periksa || [], a = b.audio || b.dur, x0 = B.art.periksa ? 900 : 360, w = B.art.periksa ? 920 : 1200;
      if (B.art.periksa) B.art.periksa(ctx, l, b);
      const rh = items.length > 5 ? 86 : 100;
      card(ctx, x0, 122, w, 100 + items.length * rh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", x0 + w / 2, 172, 26, { align: "center", weight: 900, color: C.accentDark });
      items.forEach(([k, v], i) => {
        const on = l > a * (0.12 + i * (0.8 / items.length)); const y = 196 + i * rh;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, x0 + 25, y, w - 50, rh - 14, 12); ctx.fill();
        text(ctx, k, x0 + 50, y + (rh - 14) / 2 + 10, 27, { weight: 800, fit: w * 0.5 });
        text(ctx, v + (on ? " ✓" : ""), x0 + w - 50, y + (rh - 14) / 2 + 10, 27, { align: "right", weight: 900, color: on ? B.GREEN : C.ink2, fit: w * 0.42 });
      });
    },
    // b.lat: {code, sub, hint, task}
    latihan(ctx, b, l) {
      const P = b.lat || {}, slug = (P.code || "").replace(/\./g, "").toLowerCase();
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan " + P.code, 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, P.sub || "", 620, 410, 28, { align: "center", weight: 700, color: C.ink2, fit: 580 });
      card(ctx, 340, 450, 560, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/" + slug, 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark, fit: 530 });
      if (P.hint) text(ctx, P.hint, 620, 600, 26, { align: "center", weight: 700, color: C.ink2, fit: 580 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, P.task || "", 1310, 420, 30, 520, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });

  K.bantu = B;
})(typeof window !== "undefined" ? window : globalThis);
