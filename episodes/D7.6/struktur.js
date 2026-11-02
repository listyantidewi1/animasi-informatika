/* Pembantu gambar D7.6: kartu daftar, tabel, antrean murid di warung, tumpukan piring, deretan kotak (token), pohon hierarki,
   jalur folder, printer. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, card, kid, clamp, lerp } = H;
  const Q = {};
  // kartu daftar bernomor; opt.struck = indeks dicoret, opt.hl = indeks disorot, opt.added = indeks baru (hijau), opt.rowH
  Q.listCard = function (ctx, x, y, w, title, items, opt = {}) {
    const rh = opt.rowH || 56, h = 70 + rh * items.length + 16;
    card(ctx, x, y, w, h, { fill: opt.fill || "#FFF9E0", stroke: opt.stroke || "#E0B04B", lw: 3, r: 14 });
    text(ctx, title, x + 20, y + 44, 30, { weight: 900, color: C.accentDark });
    items.forEach((it, i) => {
      const ry = y + 70 + i * rh; const struck = (opt.struck || []).includes(i), hl = (opt.hl || []).includes(i), added = (opt.added || []).includes(i);
      if (hl || added) { ctx.fillStyle = C.goodBg; rr(ctx, x + 12, ry + 4, w - 24, rh - 8, 8); ctx.fill(); }
      if (opt.numbered !== false) { ctx.fillStyle = struck ? C.muted : C.ink2; ctx.beginPath(); ctx.arc(x + 40, ry + rh / 2, 16, 0, Math.PI * 2); ctx.fill(); text(ctx, String((opt.numbers || [])[i] != null ? opt.numbers[i] : i + 1), x + 40, ry + rh / 2 + 7, (opt.numbers || [])[i] != null && String(opt.numbers[i]).length > 1 ? 16 : 20, { align: "center", color: "#fff", weight: 900 }); }
      text(ctx, it, x + (opt.numbered !== false ? 72 : 24), ry + rh / 2 + 10, 28, { weight: struck ? 600 : 800, color: struck ? C.muted : added ? C.good : C.ink });
      if (struck) { ctx.strokeStyle = C.bad; ctx.lineWidth = 4; ctx.font = `800 28px Inter, sans-serif`; const tw = ctx.measureText(it).width; ctx.beginPath(); ctx.moveTo(x + 68, ry + rh / 2); ctx.lineTo(x + 76 + tw, ry + rh / 2); ctx.stroke(); }
    });
    return h;
  };
  // tabel: header[], rows[][]; opt.cw = lebar kolom (angka atau array), rh, hlRow, hlCol, hlCell [r,c], fade = [baris dipudarkan], size
  Q.table = function (ctx, x, y, header, rows, opt = {}) {
    const n = header.length, cw = Array.isArray(opt.cw) ? opt.cw : header.map(() => opt.cw || 200), rh = opt.rh || 56, size = opt.size || 26;
    const W = cw.reduce((a, b) => a + b, 0), Hh = rh * (rows.length + 1);
    card(ctx, x, y, W, Hh, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 12 });
    let cx = x;
    const colX = cw.map(w => { const v = cx; cx += w; return v; });
    ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 12); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    if (opt.hlCol != null) { ctx.fillStyle = "rgba(242,177,52,0.28)"; ctx.fillRect(colX[opt.hlCol], y, cw[opt.hlCol], Hh); }
    if (opt.hlRow != null) { ctx.fillStyle = "rgba(242,177,52,0.28)"; ctx.fillRect(x, y + rh * (opt.hlRow + 1), W, rh); }
    if (opt.hlCell) { const [r, c] = opt.hlCell; ctx.fillStyle = C.goodBg; ctx.fillRect(colX[c], y + rh * (r + 1), cw[c], rh); ctx.strokeStyle = C.good; ctx.lineWidth = 6; ctx.strokeRect(colX[c] + 3, y + rh * (r + 1) + 3, cw[c] - 6, rh - 6); }
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 2;
    for (let r = 1; r <= rows.length; r++) { ctx.beginPath(); ctx.moveTo(x, y + rh * r); ctx.lineTo(x + W, y + rh * r); ctx.stroke(); }
    for (let c = 1; c < n; c++) { ctx.beginPath(); ctx.moveTo(colX[c], y); ctx.lineTo(colX[c], y + Hh); ctx.stroke(); }
    header.forEach((h, c) => text(ctx, h, colX[c] + cw[c] / 2, y + rh / 2 + size * 0.36, size, { align: "center", weight: 900, color: C.ink2 }));
    rows.forEach((row, r) => row.forEach((v, c) => {
      const fade = (opt.fade || []).includes(r); const strong = opt.hlCell && opt.hlCell[0] === r && opt.hlCell[1] === c;
      text(ctx, String(v), colX[c] + cw[c] / 2, y + rh * (r + 1) + rh / 2 + size * 0.36, size, { align: "center", weight: c === 0 || strong ? 900 : 700, color: fade ? C.muted : strong ? C.good : C.ink });
    }));
    return { W, H: Hh, colX, rh };
  };
  // meja warung dengan papan nama
  Q.counter = function (ctx, x, y, w, label = "Bu Warung") {
    ctx.fillStyle = C.table; rr(ctx, x, y, w, 120, 12); ctx.fill(); ctx.fillStyle = C.tableTop; rr(ctx, x - 10, y - 14, w + 20, 28, 8); ctx.fill();
    ctx.fillStyle = "#fff"; rr(ctx, x + w / 2 - 110, y - 90, 220, 56, 10); ctx.fill(); ctx.strokeStyle = C.tableTop; ctx.lineWidth = 4; rr(ctx, x + w / 2 - 110, y - 90, 220, 56, 10); ctx.stroke();
    text(ctx, label, x + w / 2, y - 52, 28, { align: "center", weight: 900, color: C.accentDark });
    // mangkuk bakso di meja
    for (let i = 0; i < 3; i++) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(x + 50 + i * 60, y + 10, 24, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#8B5A2B"; ctx.beginPath(); ctx.arc(x + 50 + i * 60, y + 6, 9, 0, Math.PI * 2); ctx.fill(); }
  };
  // barisan murid menghadap kanan (depan = kanan); names[], opt.hlFront/hlBack, opt.s ukuran, opt.gap, opt.labels = tulis "ke-n"
  Q.queueKids = function (ctx, xFront, y, names, opt = {}) {
    const s = opt.s || 110, gap = opt.gap || 130;
    names.forEach((nm, i) => {
      const x = xFront - i * gap; const front = i === 0, back = i === names.length - 1;
      if ((opt.hlFront && front) || (opt.hlBack && back)) { ctx.fillStyle = front ? C.goodBg : "#FFF3D6"; ctx.beginPath(); ctx.ellipse(x, y + s * 0.3, s * 0.6, s * 0.95, 0, 0, Math.PI * 2); ctx.fill(); }
      kid(ctx, x, y, s, { hair: i % 2 ? "long" : undefined, hairColor: ["#2B2118", "#4A2E1A", "#1B1B1B"][i % 3] });
      if (nm) text(ctx, nm, x, y + s * 1.3, 24, { align: "center", weight: 800, color: C.ink2 });
      if (opt.labels) text(ctx, "ke-" + (i + 1), x, y - s * 0.95, 24, { align: "center", weight: 900, color: C.accentDark });
    });
  };
  // tumpukan piring: n piring, cx tengah, baseY alas; opt.hlTop menyorot piring teratas, opt.lift = piring teratas terangkat (0..1), opt.colors
  Q.plates = function (ctx, cx, baseY, n, opt = {}) {
    const pw = opt.w || 220, ph = Math.round(pw * 0.085);
    ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.beginPath(); ctx.ellipse(cx, baseY + 6, pw * 0.6, 14, 0, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < n; i++) {
      const top = i === n - 1; const y = baseY - i * ph - (top ? (opt.lift || 0) * ph * 5 : 0);
      ctx.fillStyle = top && opt.hlTop ? C.accent : ["#F7FAF8", "#EAF2EE"][i % 2]; ctx.strokeStyle = top && opt.hlTop ? C.accentDark : "#B7C4CC"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(cx, y, pw / 2, ph * 0.75, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = top && opt.hlTop ? "#F9D98A" : "#DCE9E2"; ctx.beginPath(); ctx.ellipse(cx, y - 2, pw * 0.28, ph * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    }
    if (opt.labelsN) for (let i = 0; i < n; i++) text(ctx, String(i + 1), cx + pw / 2 + 30, baseY - i * ph + 8, 22, { weight: 900, color: C.ink2 });
  };
  // deretan kotak berlabel: items[], opt.dir "h" (ke kanan) / "v" (ke atas), opt.w/h, opt.hl indeks, opt.fade indeks, opt.gap
  Q.tokens = function (ctx, x, y, items, opt = {}) {
    const w = opt.w || 200, h = opt.h || 60, gap = opt.gap || 12;
    items.forEach((it, i) => {
      const tx = opt.dir === "v" ? x : x + i * (w + gap), ty = opt.dir === "v" ? y - i * (h + gap) : y;
      const hl = opt.hl === i, fade = (opt.fade || []).includes(i);
      card(ctx, tx, ty, w, h, { fill: hl ? C.goodBg : fade ? "#F4F6F5" : opt.fill || C.panel, stroke: hl ? C.good : fade ? "#E1E8E4" : opt.stroke || "#B7C4CC", lw: hl ? 5 : 3, r: 12 });
      text(ctx, it, tx + w / 2, ty + h / 2 + 10, opt.size || 26, { align: "center", weight: 800, color: fade ? C.muted : hl ? C.good : C.ink });
    });
  };
  // pohon hierarki: node {label, kids:[]}; digambar dari (x,y) ke bawah selebar w; opt.levelH, opt.depth (batas kedalaman tampil), opt.path = daftar label disorot
  Q.tree = function (ctx, node, x, y, w, opt = {}) {
    const lh = opt.levelH || 130, bw = opt.bw || 170, bh = opt.bh || 56, maxD = opt.depth == null ? 99 : opt.depth, path = opt.path || [];
    const leaves = n => (n.kids && n.kids.length) ? n.kids.reduce((a, k) => a + leaves(k), 0) : 1;
    const draw = (n, cx, cy, span, d) => {
      const on = path.includes(n.label);
      if (n.kids && d < maxD) {
        let acc = cx - span / 2; n.kids.forEach(k => { const ks = span * leaves(k) / leaves(n); const kx = acc + ks / 2, ky = cy + lh; ctx.strokeStyle = on && path.includes(k.label) ? C.good : "#B7C4CC"; ctx.lineWidth = on && path.includes(k.label) ? 6 : 4; ctx.beginPath(); ctx.moveTo(cx, cy + bh / 2); ctx.lineTo(cx, cy + lh / 2); ctx.lineTo(kx, cy + lh / 2); ctx.lineTo(kx, ky - bh / 2); ctx.stroke(); draw(k, kx, ky, ks, d + 1); acc += ks; });
      }
      card(ctx, cx - bw / 2, cy - bh / 2, bw, bh, { fill: on ? C.goodBg : d === 0 ? "#FFF3D6" : C.panel, stroke: on ? C.good : d === 0 ? C.accent : "#B7C4CC", lw: on ? 5 : 3, r: 12 });
      text(ctx, n.label, cx, cy + 9, opt.size || 26, { align: "center", weight: 900, color: on ? C.good : C.ink });
    };
    draw(node, x + w / 2, y, w, 0);
  };
  // jalur folder bertingkat: items [{name, kind:"folder"|"doc"}], tiap tingkat menjorok
  Q.folderPath = function (ctx, x, y, items, opt = {}) {
    items.forEach((it, i) => {
      const ix = x + i * 70, iy = y + i * 90; const on = opt.hl == null || opt.hl >= i;
      if (i) { ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ix - 40, iy - 60); ctx.lineTo(ix - 40, iy + 4); ctx.lineTo(ix - 4, iy + 4); ctx.stroke(); }
      ctx.globalAlpha = on ? 1 : 0.3; D.fileIcon(ctx, ix + 30, iy, 56, it.kind || "folder", {}); text(ctx, it.name, ix + 80, iy + 12, 30, { weight: i === items.length - 1 ? 900 : 800 }); ctx.globalAlpha = 1;
    });
  };
  // printer sederhana
  Q.printer = function (ctx, cx, cy, s, opt = {}) {
    ctx.fillStyle = "#7B8B95"; rr(ctx, cx - s * 0.6, cy - s * 0.25, s * 1.2, s * 0.5, s * 0.1); ctx.fill();
    ctx.fillStyle = "#4A5A66"; rr(ctx, cx - s * 0.4, cy - s * 0.45, s * 0.8, s * 0.25, s * 0.05); ctx.fill();
    ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(cx + s * 0.45, cy - s * 0.1, s * 0.05, 0, Math.PI * 2); ctx.fill();
    if (opt.sheet) { ctx.fillStyle = "#fff"; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; rr(ctx, cx - s * 0.3, cy + s * 0.2, s * 0.6, s * 0.5 * opt.sheet, 4); ctx.fill(); ctx.stroke(); if (opt.sheetLabel && opt.sheet > 0.6) text(ctx, opt.sheetLabel, cx, cy + s * 0.2 + s * 0.5 * opt.sheet - 10, 20, { align: "center", weight: 800, color: C.ink2 }); }
  };
  K.struktur = Q;
})(typeof window !== "undefined" ? window : globalThis);
