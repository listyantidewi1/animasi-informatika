/* S10 pembantu gambar khusus: foto banjir rekaan (digambar dengan kode), unggahan media sosial generik ("Linimasa"),
   menu klik kanan, halaman hasil pencarian gambar terbalik, dialog unggah gambar, pemilih file, HP sederhana, dan obrolan grup.
   Semua akun, situs, dan kabar rekaan (.example). Dimuat setelah layar_web.js; API: Kiko.s10 (const G = K.s10). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, W = K.web, UI = K.web.UI;
  const { rr, text, ease, clamp, lerp } = H;
  const G = {};
  const F = (w, s) => `${w} ${s}px ${K.FONT}`;
  const meas = (ctx, s, size, weight = 600) => { ctx.font = F(weight, size); return ctx.measureText(s).width; };
  G.meas = meas;

  // ---------- foto banjir rekaan (ruang gambar 400×250, diskalakan ke w×h) ----------
  G.photo = function (ctx, x, y, w, h, opt = {}) {
    ctx.save(); rr(ctx, x, y, w, h, opt.r == null ? 10 : opt.r); ctx.clip();
    ctx.translate(x, y); ctx.scale(w / 400, h / 250);
    let g = ctx.createLinearGradient(0, 0, 0, 150); g.addColorStop(0, "#A9B7C1"); g.addColorStop(1, "#DDE4E7"); ctx.fillStyle = g; ctx.fillRect(0, 0, 400, 250);
    // awan mendung
    ctx.fillStyle = "rgba(255,255,255,0.35)"; [[60, 28, 40], [100, 22, 30], [300, 30, 44], [345, 24, 30]].forEach(([cx, cy, r]) => { ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.45, 0, 0, Math.PI * 2); ctx.fill(); });
    // gedung jauh
    ctx.fillStyle = "#9AA8B2"; [[150, 72, 40, 80], [190, 88, 30, 64], [222, 62, 36, 90], [262, 92, 26, 60]].forEach(r => ctx.fillRect(...r));
    ctx.fillStyle = "#B9C5CC"; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) ctx.fillRect(228 + j * 9, 70 + i * 16, 5, 8);
    // rumah kiri
    ctx.fillStyle = "#E6D3AA"; ctx.fillRect(10, 82, 122, 90);
    ctx.fillStyle = "#B0533C"; ctx.beginPath(); ctx.moveTo(0, 86); ctx.lineTo(71, 42); ctx.lineTo(142, 86); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#5E7480"; ctx.fillRect(28, 104, 26, 22); ctx.fillRect(88, 104, 26, 22);
    ctx.strokeStyle = "#F4ECDB"; ctx.lineWidth = 2; [[28, 104], [88, 104]].forEach(([wx, wy]) => { ctx.strokeRect(wx, wy, 26, 22); ctx.beginPath(); ctx.moveTo(wx + 13, wy); ctx.lineTo(wx + 13, wy + 22); ctx.stroke(); });
    ctx.fillStyle = "#7A5638"; ctx.fillRect(60, 122, 22, 50);
    // rumah kanan
    ctx.fillStyle = "#CFE0D6"; ctx.fillRect(286, 98, 112, 74);
    ctx.fillStyle = "#8E5A3C"; ctx.beginPath(); ctx.moveTo(276, 100); ctx.lineTo(342, 60); ctx.lineTo(408, 100); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#5E7480"; ctx.fillRect(302, 116, 30, 24); ctx.fillRect(352, 116, 30, 24);
    // tiang listrik dan kabel
    ctx.fillStyle = "#5B5148"; ctx.fillRect(254, 26, 5, 146); ctx.fillRect(244, 34, 26, 4);
    ctx.strokeStyle = "#4A433C"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(246, 36); ctx.quadraticCurveTo(120, 58, 0, 44); ctx.moveTo(268, 36); ctx.quadraticCurveTo(340, 52, 400, 40); ctx.stroke();
    // pohon
    ctx.fillStyle = "#6B4F36"; ctx.fillRect(160, 104, 8, 68);
    ctx.fillStyle = "#5E8F5A"; [[164, 92, 24], [146, 104, 17], [182, 104, 17], [164, 76, 15]].forEach(([cx, cy, r]) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); });
    // air banjir
    g = ctx.createLinearGradient(0, 150, 0, 250); g.addColorStop(0, "#A8977A"); g.addColorStop(1, "#7A6A52"); ctx.fillStyle = g; ctx.fillRect(0, 150, 400, 100);
    // bayangan di air
    const ga = ctx.globalAlpha; ctx.globalAlpha = ga * 0.22; ctx.fillStyle = "#E6D3AA"; ctx.fillRect(10, 152, 122, 28); ctx.fillStyle = "#CFE0D6"; ctx.fillRect(286, 152, 112, 22); ctx.fillStyle = "#5B5148"; ctx.fillRect(254, 152, 5, 40); ctx.globalAlpha = ga;
    // mobil merah terendam
    ctx.fillStyle = "#B8433A"; rr(ctx, 186, 134, 84, 22, 8); ctx.fill(); ctx.fillStyle = "#C9D6DE"; rr(ctx, 198, 137, 26, 11, 3); ctx.fill(); rr(ctx, 230, 137, 26, 11, 3); ctx.fill();
    ctx.fillStyle = g; ctx.fillRect(180, 150, 100, 12);
    // riak air
    ctx.strokeStyle = "rgba(255,255,255,0.38)"; ctx.lineWidth = 1.6;
    [[30, 170, 40], [120, 186, 50], [220, 168, 36], [300, 196, 54], [60, 214, 46], [190, 228, 60], [330, 232, 40], [250, 206, 30]].forEach(([rx, ry, rw]) => { ctx.beginPath(); ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx + rw / 2, ry - 4, rx + rw, ry); ctx.stroke(); });
    ctx.restore();
    if (opt.stroke) { ctx.strokeStyle = opt.stroke; ctx.lineWidth = opt.lw || 5; rr(ctx, x, y, w, h, opt.r == null ? 10 : opt.r); ctx.stroke(); }
  };

  // ---------- ikon kecil tambahan ----------
  G.bolt = function (ctx, cx, cy, s, color) {
    ctx.fillStyle = color || "#FFFFFF"; ctx.beginPath();
    [[0.1, -0.5], [-0.3, 0.08], [-0.02, 0.08], [-0.12, 0.5], [0.3, -0.12], [0.02, -0.12]].forEach(([px, py], i) => i ? ctx.lineTo(cx + px * s, cy + py * s) : ctx.moveTo(cx + px * s, cy + py * s));
    ctx.closePath(); ctx.fill();
  };
  G.camera = function (ctx, cx, cy, s, color) {
    const c = color || UI.focus; ctx.strokeStyle = c; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineJoin = "round";
    rr(ctx, cx - s * 0.45, cy - s * 0.25, s * 0.9, s * 0.6, s * 0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - s * 0.18, cy - s * 0.25); ctx.lineTo(cx - s * 0.1, cy - s * 0.38); ctx.lineTo(cx + s * 0.1, cy - s * 0.38); ctx.lineTo(cx + s * 0.18, cy - s * 0.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy + s * 0.05, s * 0.16, 0, Math.PI * 2); ctx.stroke();
  };
  G.avatar = function (ctx, cx, cy, r, kind) {
    const col = { kilat: "#E0703A", dito: C.kiko, raka: "#7B5EA7", sinta: "#2E9E5B", nia: "#C0453A" }[kind] || "#8A99A3";
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    if (kind === "kilat") G.bolt(ctx, cx, cy, r * 1.3, "#FFFFFF");
    else text(ctx, (kind || "?")[0].toUpperCase(), cx, cy + r * 0.36, r, { align: "center", weight: 900, color: "#FFFFFF" });
  };

  // ---------- unggahan media sosial ----------
  G.POST = ["VIRAL!!! Pagi ini Jalan Melati, Kota Contoh, terendam", "banjir setinggi pinggang. Semua sekolah diliburkan!", "BAGIKAN SEBELUM DIHAPUS!!!"];
  // o.hl: [[baris, awal, akhir, warna]] sorot bagian teks · o.shareHot · o.linkHot · o.ph tinggi foto · o.photoHot
  G.post = function (ctx, x, y, w, o = {}) {
    const ph = o.ph || 230, size = 22;
    const hgt = 176 + ph + 58 + 66;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.10)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, hgt, 16); ctx.fill(); ctx.restore();
    ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; rr(ctx, x, y, w, hgt, 16); ctx.stroke();
    G.avatar(ctx, x + 44, y + 44, 26, "kilat");
    text(ctx, "Kabar Kilat", x + 84, y + 38, 23, { weight: 800, color: UI.ink });
    text(ctx, "@kabarkilat · 2 jam", x + 84, y + 64, 18, { weight: 600, color: UI.ink3 });
    text(ctx, "Ikuti", x + w - 30, y + 46, 20, { align: "right", weight: 800, color: UI.focus });
    G.POST.forEach((ln, i) => {
      const ty = y + 108 + i * 32;
      (o.hl || []).filter(h => h[0] === i).forEach(([, a, b, col]) => { const xa = meas(ctx, ln.slice(0, a), size, 600), xb = meas(ctx, ln.slice(0, b), size, 600);
        ctx.fillStyle = col || UI.mark; rr(ctx, x + 24 + xa - 3, ty - 22, xb - xa + 6, 30, 5); ctx.fill(); });
      text(ctx, ln, x + 24, ty, size, { weight: 600, color: UI.ink });
    });
    const px = x + 20, py = y + 176, pw = w - 40;
    G.photo(ctx, px, py, pw, ph, { r: 0, stroke: o.photoHot ? C.accent : null, lw: 6 });
    ctx.fillStyle = o.linkHot ? "#E7F1FB" : "#F1F4F6"; ctx.fillRect(px, py + ph, pw, 58);
    if (o.linkHot) { ctx.strokeStyle = UI.focus; ctx.lineWidth = 3; ctx.strokeRect(px, py + ph, pw, 58); }
    text(ctx, "kabarkilat.example", px + 16, py + ph + 23, 16, { weight: 600, color: UI.ink3 });
    text(ctx, "Banjir Setinggi Pinggang di Jalan Melati, Sekolah Diliburkan!", px + 16, py + ph + 47, 19, { weight: 800, color: UI.ink, fit: pw - 30 });
    const ay = py + ph + 58 + 18; const acts = [["Suka", "8,1 rb"], ["Komentar", "940"], ["Bagikan", "12 rb"]]; const geo = { h: hgt };
    acts.forEach(([k, v], i) => { const bx = x + 24 + i * ((w - 48) / 3), bw = (w - 48) / 3 - 14; const hot = i === 2 && o.shareHot;
      ctx.fillStyle = hot ? "#FBE1DF" : "#F4F6F8"; rr(ctx, bx, ay, bw, 40, 20); ctx.fill(); if (hot) { ctx.strokeStyle = UI.bad; ctx.lineWidth = 3; rr(ctx, bx, ay, bw, 40, 20); ctx.stroke(); }
      text(ctx, k + " " + v, bx + bw / 2, ay + 27, 19, { align: "center", weight: 700, color: hot ? UI.bad : UI.ink2 });
      if (i === 2) geo.share = { x: bx, y: ay, w: bw, h: 40, cx: bx + bw / 2, cy: ay + 20 }; });
    geo.photo = { x: px, y: py, w: pw, h: ph, cx: px + pw / 2, cy: py + ph / 2 };
    geo.link = { x: px, y: py + ph, w: pw, h: 58, cx: px + pw / 2, cy: py + ph + 29 };
    geo.line = i => ({ x: x + 24, y: y + 108 + i * 32 - 22, w: meas(ctx, G.POST[i], size, 600), h: 30 });
    geo.span = (i, a, b) => { const ln = G.POST[i], xa = meas(ctx, ln.slice(0, a), size, 600), xb = meas(ctx, ln.slice(0, b), size, 600); return { x: x + 24 + xa, y: y + 108 + i * 32 - 22, w: xb - xa, h: 30, cx: x + 24 + (xa + xb) / 2, cy: y + 108 + i * 32 - 8 }; };
    return geo;
  };
  // halaman linimasa: kolom menu kiri, unggahan di tengah, "Sedang ramai" di kanan
  G.feed = function (ctx, a, o = {}) {
    return W.clip(ctx, a, () => {
      ctx.fillStyle = "#F4F6F8"; ctx.fillRect(a.x, a.y, a.w, a.h);
      text(ctx, "Linimasa", a.x + 34, a.y + 52, 30, { weight: 900, color: UI.ink });
      [["home", "Beranda"], ["search", "Jelajah"], ["user", "Profil"], ["gear", "Pengaturan"]].forEach(([ic, s], i) => { const yy = a.y + 110 + i * 56;
        if (!i) { ctx.fillStyle = "#E7F1FB"; rr(ctx, a.x + 22, yy - 30, 220, 46, 23); ctx.fill(); }
        W.icon(ctx, ic, a.x + 50, yy - 7, 24, i ? UI.ink2 : UI.focus); text(ctx, s, a.x + 78, yy, 21, { weight: i ? 600 : 800, color: i ? UI.ink2 : UI.focus }); });
      const pw = 700, px = a.x + 290;
      const geo = G.post(ctx, px, a.y + 16 - (o.scroll || 0), pw, o);
      const rx = a.x + 1020, rw = 250; ctx.fillStyle = "#FFFFFF"; rr(ctx, rx, a.y + 16, rw, 250, 14); ctx.fill();
      text(ctx, "Sedang ramai", rx + 18, a.y + 52, 21, { weight: 800, color: UI.ink });
      [["#JalanMelati", "12 rb unggahan"], ["#LiburSekolah", "8 rb unggahan"], ["#Hujan", "3 rb unggahan"]].forEach(([t, s], i) => { const yy = a.y + 96 + i * 58;
        text(ctx, t, rx + 18, yy, 20, { weight: 800, color: UI.ink }); text(ctx, s, rx + 18, yy + 24, 16, { weight: 600, color: UI.ink3 }); });
      return geo;
    });
  };

  // ---------- menu klik kanan ----------
  G.MENU = ["Buka gambar di tab baru", "Simpan gambar sebagai…", "Salin gambar", "Salin alamat gambar", "-", "Cari gambar dengan Cari"];
  G.ctxMenu = function (ctx, x, y, o = {}) {
    const items = o.items || G.MENU, mw = o.w || 340, ih = 46; let hh = 12; items.forEach(s => hh += s === "-" ? 14 : ih);
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, mw, hh, 10); ctx.fill(); ctx.restore();
    ctx.strokeStyle = UI.frame; ctx.lineWidth = 1.5; rr(ctx, x, y, mw, hh, 10); ctx.stroke();
    let yy = y + 6; const rects = [];
    items.forEach((s, i) => {
      if (s === "-") { ctx.fillStyle = UI.line; ctx.fillRect(x + 12, yy + 6, mw - 24, 2); rects.push(null); yy += 14; return; }
      const hi = o.hi === i; if (hi) { ctx.fillStyle = "#DCE9F7"; ctx.fillRect(x + 4, yy, mw - 8, ih); }
      if (i === items.length - 1 && o.searchIcon !== false) W.icon(ctx, "search", x + 26, yy + ih / 2, 20, hi ? UI.focus : UI.ink2);
      text(ctx, s, x + 48, yy + ih / 2 + 7, 20, { weight: hi ? 800 : 600, color: hi ? UI.focus : UI.ink });
      rects.push({ x, y: yy, w: mw, h: ih, cx: x + 160, cy: yy + ih / 2 }); yy += ih;
    });
    return { item: i => rects[i], h: hh };
  };

  // ---------- halaman hasil pencarian gambar terbalik ----------
  G.PAGES = [
    { title: "Banjir Setinggi Pinggang di Jalan Melati", url: "kabarkilat.example", date: "4 Nov 2026", note: "hari ini" },
    { title: "Banjir Lagi? Sekolah Libur Semua!", url: "infoheboh.example", date: "4 Nov 2026", note: "hari ini" },
    { title: "Musim Hujan Datang Lagi", url: "blogcuaca.example", date: "8 Jan 2024" },
    { title: "Banjir di Kota Damai, Maret 2019", url: "arsipfoto.example", date: "14 Mar 2019" }
  ];
  // o.items (urutan halaman), o.dateMark [i], o.good i, o.bad i, o.badge {i, s}, o.alpha (muncul), o.query (teks di kotak)
  G.imagePage = function (ctx, a, o = {}) {
    return W.clip(ctx, a, () => {
      const x = a.x, y = a.y, geo = {};
      text(ctx, "Cari", x + 36, y + 57, 36, { weight: 900, color: UI.ink });
      const bx = x + 150, bw = 720, by = y + 18;
      ctx.fillStyle = "#FFFFFF"; rr(ctx, bx, by, bw, 54, 27); ctx.fill(); ctx.strokeStyle = UI.frame; ctx.lineWidth = 2; rr(ctx, bx, by, bw, 54, 27); ctx.stroke();
      ctx.fillStyle = "#EEF2F5"; rr(ctx, bx + 12, by + 8, 270, 38, 19); ctx.fill(); G.photo(ctx, bx + 18, by + 12, 46, 30, { r: 6 });
      text(ctx, o.query || "foto-banjir.jpg", bx + 74, by + 34, 19, { weight: 700, color: UI.ink, fit: 200 }); W.icon(ctx, "cross", bx + 262, by + 27, 14, UI.ink2);
      G.camera(ctx, bx + bw - 90, by + 27, 30, UI.focus); W.icon(ctx, "search", bx + bw - 34, by + 27, 26, UI.focus);
      const ty = y + 106; let tx = bx + 6;
      ["Semua", "Gambar", "Berita", "Video"].forEach((t, i) => { const on = i === 1; text(ctx, t, tx, ty, 20, { weight: on ? 800 : 600, color: on ? UI.focus : UI.ink2 });
        const tw = meas(ctx, t, 20, on ? 800 : 600); if (on) { ctx.fillStyle = UI.focus; ctx.fillRect(tx, ty + 10, tw, 3); } tx += tw + 34; });
      ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, ty + 14); ctx.lineTo(x + a.w, ty + 14); ctx.stroke();
      // gambar yang dicari
      text(ctx, "Gambar yang kamu cari", x + 36, y + 166, 20, { weight: 800, color: UI.ink2 });
      G.photo(ctx, x + 36, y + 182, 330, 206, { r: 10 }); geo.query = { x: x + 36, y: y + 182, w: 330, h: 206 };
      text(ctx, "Ditemukan di 4 halaman.", x + 36, y + 426, 20, { weight: 700, color: UI.ink });
      // daftar halaman
      const lx = x + 410, lw = a.w - 450;
      text(ctx, "Halaman yang memuat gambar ini", lx, y + 166, 22, { weight: 800, color: UI.ink });
      const order = o.items || [0, 1, 2, 3], rects = [];
      order.forEach((k, i) => {
        const pg = G.PAGES[k], iy = y + 186 + i * 98;
        ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : clamp(o.alpha * 4 - i, 0, 1);
        const good = o.good === k, bad = o.bad === k;
        if (good || bad) { ctx.fillStyle = good ? UI.goodBg : UI.badBg; rr(ctx, lx - 12, iy - 8, lw + 10, 92, 10); ctx.fill(); ctx.fillStyle = good ? UI.good : UI.bad; ctx.fillRect(lx - 12, iy - 8, 6, 92); }
        G.photo(ctx, lx, iy, 120, 76, { r: 8 });
        text(ctx, pg.title, lx + 140, iy + 26, 24, { weight: 700, color: UI.link, fit: lw - 160 });
        text(ctx, pg.url, lx + 140, iy + 52, 19, { weight: 600, color: UI.url });
        const dw = meas(ctx, pg.date, 19, 800);
        if ((o.dateMark || []).includes(k)) { ctx.fillStyle = UI.mark; rr(ctx, lx + 134, iy + 58, dw + 12, 28, 6); ctx.fill(); }
        text(ctx, pg.date, lx + 140, iy + 79, 19, { weight: 800, color: UI.ink2 });
        if (o.badge && o.badge.i === k) { const bw2 = meas(ctx, o.badge.s, 18, 900) + 24; ctx.fillStyle = o.badge.color || UI.good; rr(ctx, lx + 160 + dw, iy + 59, bw2, 28, 14); ctx.fill();
          text(ctx, o.badge.s, lx + 172 + dw, iy + 79, 18, { weight: 900, color: "#FFFFFF" }); }
        ctx.restore();
        rects[k] = { x: lx, y: iy, w: lw, h: 80, cx: lx + 300, cy: iy + 26, date: { x: lx + 140, y: iy + 58, w: dw, h: 28, cx: lx + 140 + dw / 2, cy: iy + 72 } };
      });
      geo.page = k => rects[k];
      return geo;
    });
  };

  // ---------- beranda mesin pencari (dengan tautan Gambar dan ikon kamera) ----------
  G.home = function (ctx, a, o = {}) {
    return W.clip(ctx, a, () => {
      const geo = {}; const img = !!o.img;
      let tx = a.x + a.w - 40; [["Gambar", 1], ["Semua", 0]].forEach(([s, i]) => { const on = img ? i === 1 : i === 0; const tw = meas(ctx, s, 21, on ? 800 : 600); tx -= tw;
        text(ctx, s, tx, a.y + 46, 21, { weight: on ? 800 : 600, color: on ? UI.focus : UI.ink2 }); if (on) { ctx.fillStyle = UI.focus; ctx.fillRect(tx, a.y + 56, tw, 3); }
        if (i === 1) geo.gambar = { x: tx, y: a.y + 22, w: tw, h: 32, cx: tx + tw / 2, cy: a.y + 40 }; tx -= 36; });
      const cy = a.y + a.h * 0.42;
      text(ctx, "Cari", a.x + a.w / 2, cy - 70, 64, { align: "center", weight: 900, color: UI.ink });
      if (img) text(ctx, "Gambar", a.x + a.w / 2 + 92, cy - 70, 26, { weight: 800, color: UI.focus });
      const bw = 720, bx = a.x + (a.w - bw) / 2, by = cy - 20;
      ctx.fillStyle = "#FFFFFF"; rr(ctx, bx, by, bw, 60, 30); ctx.fill(); ctx.strokeStyle = UI.frame; ctx.lineWidth = 2; rr(ctx, bx, by, bw, 60, 30); ctx.stroke();
      text(ctx, img ? "Cari gambar" : "Ketik kata kunci", bx + 28, by + 39, 23, { weight: 500, color: UI.ink3 });
      W.icon(ctx, "search", bx + bw - 34, by + 30, 26, UI.focus);
      if (img) { if (o.camHot) { ctx.fillStyle = "#DCE9F7"; ctx.beginPath(); ctx.arc(bx + bw - 96, by + 30, 24, 0, Math.PI * 2); ctx.fill(); }
        G.camera(ctx, bx + bw - 96, by + 30, 32, UI.focus); geo.camera = { cx: bx + bw - 96, cy: by + 30 }; }
      geo.box = { x: bx, y: by, w: bw, h: 60 };
      return geo;
    });
  };
  // dialog "Cari dengan gambar"
  G.uploadDialog = function (ctx, cx, y, o = {}) {
    const w = 640, h = 330, x = cx - w / 2;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.28)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 8; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.restore();
    text(ctx, "Cari dengan gambar", x + 30, y + 48, 26, { weight: 800, color: UI.ink }); W.icon(ctx, "cross", x + w - 36, y + 38, 18, UI.ink2);
    ctx.setLineDash([10, 8]); ctx.strokeStyle = "#9CB3C4"; ctx.lineWidth = 2.5; rr(ctx, x + 30, y + 74, w - 60, 226, 14); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#F4F8FB"; rr(ctx, x + 32, y + 76, w - 64, 222, 13); ctx.fill();
    G.photo(ctx, cx - 40, y + 98, 80, 52, { r: 6 }); ctx.fillStyle = "rgba(244,248,251,0.75)"; ctx.fillRect(cx - 40, y + 98, 80, 52);
    text(ctx, "Seret gambar ke sini", cx, y + 186, 22, { align: "center", weight: 700, color: UI.ink2 });
    text(ctx, "atau", cx, y + 218, 18, { align: "center", weight: 600, color: UI.ink3 });
    const btn = W.button(ctx, cx - 120, y + 236, 240, 50, "Unggah file", { press: o.press || 0, size: 22 });
    return { btn: btn || { cx, cy: y + 261, x: cx - 120, y: y + 236, w: 240, h: 50 } };
  };
  // pemilih file
  G.FILES = [["foto-banjir.jpg", "photo"], ["jadwal-kelas.png", "img"], ["tugas-ipa.pdf", "pdf"]];
  G.filePicker = function (ctx, x, y, o = {}) {
    const w = 660, h = 380;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.28)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 8; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 14); ctx.clip(); ctx.fillStyle = "#EEF2F5"; ctx.fillRect(x, y, w, 46); ctx.fillRect(x, y + 46, 170, h - 46); ctx.restore();
    text(ctx, "Pilih file", x + w / 2, y + 31, 21, { align: "center", weight: 800, color: UI.ink });
    ["Unduhan", "Dokumen", "Gambar"].forEach((s, i) => { if (!i) { ctx.fillStyle = "#DCE9F7"; rr(ctx, x + 10, y + 62, 150, 40, 8); ctx.fill(); }
      text(ctx, s, x + 26, y + 90 + i * 48, 20, { weight: i ? 600 : 800, color: i ? UI.ink2 : UI.focus }); });
    const rects = [];
    G.FILES.forEach(([n, k], i) => { const fx = x + 196 + i * 150, fy = y + 70; const sel = o.sel === i;
      if (sel) { ctx.fillStyle = "#DCE9F7"; rr(ctx, fx - 8, fy - 8, 140, 176, 10); ctx.fill(); }
      if (k === "photo") G.photo(ctx, fx + 4, fy + 14, 116, 80, { r: 6 });
      else if (k === "img") { ctx.fillStyle = "#E3EBF0"; rr(ctx, fx + 4, fy + 14, 116, 80, 6); ctx.fill(); for (let r = 0; r < 4; r++) { ctx.fillStyle = "#C9D6DE"; ctx.fillRect(fx + 14, fy + 26 + r * 16, 96, 8); } }
      else W.icon(ctx, "pdf", fx + 62, fy + 54, 70, UI.bad);
      text(ctx, n, fx + 62, fy + 126, 16, { align: "center", weight: sel ? 800 : 600, color: UI.ink, fit: 132 });
      rects.push({ x: fx, y: fy, w: 124, h: 150, cx: fx + 62, cy: fy + 60 }); });
    const open = W.button(ctx, x + w - 170, y + h - 70, 140, 48, "Buka", { press: o.press || 0, disabled: o.sel == null, size: 21 });
    W.button(ctx, x + w - 330, y + h - 70, 140, 48, "Batal", { kind: "secondary", size: 21 });
    return { item: i => rects[i], open: open || { cx: x + w - 100, cy: y + h - 46 } };
  };

  // ---------- HP sederhana ----------
  G.phone = function (ctx, x, y, w, h) {
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.22)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = "#26323B"; rr(ctx, x, y, w, h, 40); ctx.fill(); ctx.restore();
    const s = { x: x + 14, y: y + 14, w: w - 28, h: h - 28 };
    ctx.fillStyle = "#FFFFFF"; rr(ctx, s.x, s.y, s.w, s.h, 30); ctx.fill();
    ctx.fillStyle = "#26323B"; rr(ctx, x + w / 2 - 50, y + 22, 100, 22, 11); ctx.fill();
    return s;
  };
  // gelembung obrolan; mengembalikan tinggi
  G.bubble = function (ctx, x, y, w, msg, o = {}) {
    const me = !!o.me, size = o.size || 21, pad = 16;
    const lines = H.wrap(ctx, msg, size, 600, w - pad * 2);
    const tw = Math.max(...lines.map(l => meas(ctx, l, size, 600))) + pad * 2, bh = lines.length * size * 1.35 + pad * 2 + (o.name ? 26 : 0);
    const bw = Math.max(tw, o.name ? meas(ctx, o.name, 17, 800) + pad * 2 : 0), bx = me ? x + w - bw : x;
    ctx.fillStyle = me ? "#D7F2DF" : "#FFFFFF"; rr(ctx, bx, y, bw, bh, 16); ctx.fill();
    if (!me) { ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; rr(ctx, bx, y, bw, bh, 16); ctx.stroke(); }
    let ty = y + pad + size * 0.9;
    if (o.name) { text(ctx, o.name, bx + pad, y + pad + 12, 17, { weight: 800, color: o.nameColor || "#7B5EA7" }); ty += 26; }
    lines.forEach((ln, i) => text(ctx, ln, bx + pad, ty + i * size * 1.35, size, { weight: 600, color: UI.ink }));
    if (o.caret) { const lw = meas(ctx, lines[lines.length - 1] || "", size, 600); ctx.fillStyle = UI.ink; ctx.fillRect(bx + pad + lw + 2, ty + (lines.length - 1) * size * 1.35 - size * 0.85, 2.5, size); }
    return bh;
  };

  K.s10 = G;
})(typeof window !== "undefined" ? window : globalThis);
