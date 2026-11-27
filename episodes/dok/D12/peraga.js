/* D12 — peraga khusus video celah Chrome: browser generik (tanpa logo), ruang kaca (sandbox), denah perangkat, HP, sakelar, ikon, loket.
   Semua digambar dengan kode. Nama menu sama dengan yang dipakai Chrome supaya penonton bisa mengikuti. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d12, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, TAU = Math.PI * 2;
  const garis = (ctx, col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.lineJoin = "round"; };

  // jendela browser generik. o.tabs = [judul], o.aktif, o.url, o.menu (0..1 sorot tombol tiga titik). Mengembalikan area isi + posisi tombol menu.
  U.browser = function (ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18; ctx.fillStyle = C.win; U.rr(ctx, x, y, w, h, 18); ctx.fill(); ctx.restore();
    ctx.save(); U.rr(ctx, x, y, w, h, 18); ctx.clip();
    ctx.fillStyle = C.bar; ctx.fillRect(x, y, w, 58);
    ["#FF5F57", "#FEBC2E", "#28C840"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 32 + i * 30, y + 29, 9, 0, TAU); ctx.fill(); });
    const tabs = o.tabs || ["Tab baru"], akt = o.aktif || 0, tw = Math.min(o.tw || 300, (w - 200) / tabs.length);
    tabs.forEach((s, i) => { const tx = x + 130 + i * tw; ctx.fillStyle = i === akt ? C.row1 : "rgba(255,255,255,0.04)"; U.rr(ctx, tx, y + 10, tw - 6, 60, 10); ctx.fill();
      if (tw > 120) { ctx.fillStyle = i === akt ? C.php : C.dim; ctx.beginPath(); ctx.arc(tx + 24, y + 36, 7, 0, TAU); ctx.fill(); T(ctx, s, tx + 42, y + 45, 24, { weight: 600, color: i === akt ? C.text : C.text2 }); } });
    ctx.fillStyle = C.row1; ctx.fillRect(x, y + 58, w, 66);
    ctx.fillStyle = C.termBg; U.rr(ctx, x + 110, y + 68, w - 230, 46, 23); ctx.fill();
    garis(ctx, C.dim, 3); [[x + 40, 1], [x + 78, -1]].forEach(([ax, d]) => { ctx.beginPath(); ctx.moveTo(ax + 7 * d, y + 82); ctx.lineTo(ax - 5 * d, y + 91); ctx.lineTo(ax + 7 * d, y + 100); ctx.stroke(); });
    if (o.url != null) T(ctx, o.url, x + 136, y + 101, 28, { mono: true, weight: 500, color: C.text });
    const mx = x + w - 52, my = y + 91; ctx.fillStyle = C.text2; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(mx, my + i * 11, 4, 0, TAU); ctx.fill(); }
    ctx.restore();
    if (o.menu > 0) { ctx.save(); ctx.globalAlpha *= o.menu; X.glow(ctx, mx, my, 70, C.amber, 0.7); garis(ctx, C.amber, 5); ctx.beginPath(); ctx.arc(mx, my, 30, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; U.rr(ctx, x, y, w, h, 18); ctx.stroke();
    return { x: x + 40, y: y + 124, w: w - 80, h: h - 124, mx, my, ux: x + 136, uy: y + 101 };
  };
  // isi halaman web tiruan (garis teks + kotak gambar)
  U.isiHalaman = function (ctx, f, a = 1) {
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "rgba(238,237,242,0.16)"; U.rr(ctx, f.x + 20, f.y + 40, f.w * 0.42, f.h - 90, 14); ctx.fill();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i ? "rgba(238,237,242,0.14)" : "rgba(238,237,242,0.34)"; U.rr(ctx, f.x + f.w * 0.5, f.y + 50 + i * 54, f.w * (i ? [0.44, 0.38, 0.46, 0.3, 0.4][i - 1] : 0.34), i ? 20 : 34, 8); ctx.fill(); }
    ctx.restore();
  };
  // penunjuk mouse
  U.kursor = function (ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = C.white; ctx.strokeStyle = "#000"; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 46); ctx.lineTo(12, 35); ctx.lineTo(21, 54); ctx.lineTo(29, 50); ctx.lineTo(20, 32); ctx.lineTo(35, 31); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); };
  U.jalan = (l, t0, d, x0, y0, x1, y1) => { const u = eio(ramp(l, t0, d)); return [lerp(x0, x1, u), lerp(y0, y1, u)]; };
  // ruang kaca. o.merah 0..1 (dinding menyala merah), o.retak 0..1, o.label
  U.kaca = function (ctx, x, y, w, h, o = {}) {
    const col = o.col || "#BFE9F2", m = o.merah || 0; ctx.save();
    if (m > 0) X.glow(ctx, x + w / 2, y + h / 2, Math.max(w, h) * 0.75, C.red, 0.5 * m);
    const gr = ctx.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, U.rgba(col, 0.16)); gr.addColorStop(0.5, U.rgba(col, 0.04)); gr.addColorStop(1, U.rgba(col, 0.12));
    ctx.fillStyle = gr; U.rr(ctx, x, y, w, h, 16); ctx.fill();
    garis(ctx, m > 0.5 ? C.red : U.rgba(col, 0.85), o.lw || 5); U.rr(ctx, x, y, w, h, 16); ctx.stroke();
    garis(ctx, U.rgba(C.white, 0.35), 4); ctx.beginPath(); ctx.moveTo(x + 26, y + 70); ctx.lineTo(x + 70, y + 26); ctx.moveTo(x + 26, y + 110); ctx.lineTo(x + 110, y + 26); ctx.stroke();
    if (o.retak > 0) { const u = o.retak, cx = x + w, cy = y + h; garis(ctx, C.red, 4); [[-0.5, -0.2, -0.75, -0.42], [-0.22, -0.5, -0.3, -0.85], [-0.4, -0.45, -0.62, -0.7]].forEach(([a, b, c, d2]) => { ctx.beginPath(); ctx.moveTo(cx - 10, cy - 10); ctx.lineTo(cx + a * 220 * u, cy + b * 220 * u); ctx.lineTo(cx + c * 220 * u, cy + d2 * 220 * u); ctx.stroke(); }); }
    if (o.label) T(ctx, o.label, x + w / 2, y - 18, o.size || 34, { align: "center", weight: 800, color: m > 0.5 ? C.red : col, spacing: 4 });
    ctx.restore();
  };
  // ikon garis sederhana
  U.ikon = function (ctx, jenis, cx, cy, s, col = C.text2) { ctx.save(); garis(ctx, col, s * 0.08);
    if (jenis === "file") { ctx.beginPath(); ctx.moveTo(cx - s * 0.3, cy - s * 0.42); ctx.lineTo(cx + s * 0.12, cy - s * 0.42); ctx.lineTo(cx + s * 0.32, cy - s * 0.2); ctx.lineTo(cx + s * 0.32, cy + s * 0.42); ctx.lineTo(cx - s * 0.3, cy + s * 0.42); ctx.closePath(); ctx.stroke(); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(cx - s * 0.16, cy - s * 0.06 + i * s * 0.16); ctx.lineTo(cx + s * 0.18, cy - s * 0.06 + i * s * 0.16); ctx.stroke(); } }
    else if (jenis === "kamera") { U.rr(ctx, cx - s * 0.42, cy - s * 0.26, s * 0.84, s * 0.58, s * 0.08); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy + s * 0.03, s * 0.16, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - s * 0.14, cy - s * 0.26); ctx.lineTo(cx - s * 0.08, cy - s * 0.38); ctx.lineTo(cx + s * 0.08, cy - s * 0.38); ctx.lineTo(cx + s * 0.14, cy - s * 0.26); ctx.stroke(); }
    else if (jenis === "unduh" || jenis === "pasang") { ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.4); ctx.lineTo(cx, cy + s * 0.12); ctx.moveTo(cx - s * 0.2, cy - s * 0.08); ctx.lineTo(cx, cy + s * 0.14); ctx.lineTo(cx + s * 0.2, cy - s * 0.08); ctx.stroke();
      if (jenis === "unduh") { ctx.beginPath(); ctx.moveTo(cx - s * 0.36, cy + s * 0.2); ctx.lineTo(cx - s * 0.36, cy + s * 0.4); ctx.lineTo(cx + s * 0.36, cy + s * 0.4); ctx.lineTo(cx + s * 0.36, cy + s * 0.2); ctx.stroke(); } else { U.rr(ctx, cx - s * 0.38, cy + s * 0.2, s * 0.76, s * 0.24, s * 0.05); ctx.stroke(); } }
    else if (jenis === "sandi") { U.rr(ctx, cx - s * 0.44, cy - s * 0.18, s * 0.88, s * 0.36, s * 0.1); ctx.stroke(); ctx.fillStyle = col; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(cx + i * s * 0.22, cy, s * 0.055, 0, TAU); ctx.fill(); } }
    else if (jenis === "segitiga") { ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.42); ctx.lineTo(cx + s * 0.46, cy + s * 0.36); ctx.lineTo(cx - s * 0.46, cy + s * 0.36); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.14); ctx.lineTo(cx, cy + s * 0.1); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy + s * 0.23, s * 0.045, 0, TAU); ctx.fill(); }
    else if (jenis === "larang") { ctx.beginPath(); ctx.arc(cx, cy, s * 0.44, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - s * 0.31, cy - s * 0.31); ctx.lineTo(cx + s * 0.31, cy + s * 0.31); ctx.stroke(); }
    ctx.restore(); };
  // sakelar fitur
  U.sakelar = function (ctx, x, y, u, s = 1) { const w = 96 * s, h = 48 * s; ctx.save(); ctx.fillStyle = u > 0.5 ? C.termDim : C.lokBebas; U.rr(ctx, x, y, w, h, h / 2); ctx.fill(); garis(ctx, u > 0.5 ? C.term : C.dim, 3); U.rr(ctx, x, y, w, h, h / 2); ctx.stroke();
    ctx.fillStyle = u > 0.5 ? C.term : C.text2; ctx.beginPath(); ctx.arc(x + h / 2 + (w - h) * eio(u), y + h / 2, h * 0.36, 0, TAU); ctx.fill(); ctx.restore(); };
  // tombol isi
  U.tombol = function (ctx, s, cx, cy, o = {}) { const size = o.size || 38; ctx.save(); ctx.font = `800 ${size}px ${X.SANS}`; const w = ctx.measureText(s).width + size * 1.6, h = size * 1.9; ctx.restore();
    const col = o.col || C.php; ctx.save(); if (o.glow) X.glow(ctx, cx, cy, w * 0.8, col, o.glow); const k = o.tekan ? 0.95 : 1; ctx.translate(cx, cy); ctx.scale(k, k); ctx.fillStyle = col; U.rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.restore();
    T(ctx, s, cx, cy + size * 0.35, size, { align: "center", weight: 800, color: o.color || "#0B0B0D" }); return w; };
  // bingkai HP
  U.hp = function (ctx, cx, cy, w, h) { const x = cx - w / 2, y = cy - h / 2; ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 40; ctx.fillStyle = "#050506"; U.rr(ctx, x, y, w, h, 44); ctx.fill(); ctx.restore();
    garis(ctx, C.text2, 4); U.rr(ctx, x, y, w, h, 44); ctx.stroke(); ctx.fillStyle = C.win; U.rr(ctx, x + 14, y + 14, w - 28, h - 28, 32); ctx.fill(); ctx.fillStyle = "#050506"; ctx.beginPath(); ctx.arc(cx, y + 36, 9, 0, TAU); ctx.fill();
    return { x: x + 30, y: y + 64, w: w - 60, h: h - 100 }; };
  // nomor versi besar; bagian terakhir diberi warna
  U.versi = function (ctx, s, cx, cy, size, col, a = 1) { const i = s.lastIndexOf(".") + 1, awal = s.slice(0, i), akhir = s.slice(i); ctx.save(); ctx.font = `700 ${size}px ${X.MONO}`; const w1 = ctx.measureText(awal).width, w2 = ctx.measureText(akhir).width; ctx.restore();
    const x0 = cx - (w1 + w2) / 2; T(ctx, awal, x0, cy, size, { mono: true, weight: 700, color: C.text }); if (a > 0.5 && col) { ctx.save(); ctx.fillStyle = U.rgba(col, 0.16); U.rr(ctx, x0 + w1 - 8, cy - size * 0.95, w2 + 16, size * 1.25, 12); ctx.fill(); ctx.restore(); }
    T(ctx, akhir, x0 + w1, cy, size, { mono: true, weight: 700, color: a > 0.5 && col ? col : C.text }); };
  // denah perangkat: tiga tab (ruang kaca bila o.kaca), ruang kendali browser, dan tiga ruang berharga.
  // o: kaca 0..1, larang 0..1, kendali 0..1 (sorot), isiKendali (teks), bocor 0..1 (merah merambat ke ruang berharga), dinding 0..1 (dinding kaca merah), tab 0..1
  U.denah = function (ctx, o = {}) {
    const x = 150, y = 190, w = 1620, h = 690; ctx.save();
    ctx.fillStyle = "rgba(18,17,21,0.9)"; U.rr(ctx, x, y, w, h, 26); ctx.fill(); garis(ctx, C.text2, 4); U.rr(ctx, x, y, w, h, 26); ctx.stroke();
    T(ctx, "PERANGKATMU", x + 36, y - 20, 34, { weight: 800, color: C.text2, spacing: 6 });
    const tabA = o.tab == null ? 1 : o.tab;
    // ruang kendali browser
    const kx = x + 40, ky = y + 470, kw = 900, kh = 180, ks = o.kendali || 0;
    U.kotak(ctx, kx, ky, kw, kh, "", { col: ks > 0.5 ? C.amber : C.php, glow: ks * 0.5, fill: "rgba(24,23,28,0.96)" });
    T(ctx, "BROWSER (kuasa penuh)", kx + 30, ky + 54, 34, { weight: 800, color: ks > 0.5 ? C.amber : C.php, spacing: 2 });
    if (!o.isiKendali) T(ctx, "mengatur semua tab dan fitur", kx + 30, ky + 122, 36, { weight: 600, color: C.text2 });
    if (o.isiKendali) U.pill(ctx, o.isiKendali, kx + kw / 2, ky + 118, { size: 40, col: o.bocor > 0 ? C.red : C.amber });
    // tiga tab
    for (let i = 0; i < 3; i++) { const tx = x + 60 + i * 300, ty = y + 70, tw = 250, th = 330; ctx.save(); ctx.globalAlpha *= tabA;
      ctx.fillStyle = C.row1; U.rr(ctx, tx + 24, ty + 40, tw - 48, th - 80, 12); ctx.fill(); ctx.fillStyle = C.bar; U.rr(ctx, tx + 24, ty + 40, tw - 48, 40, 12); ctx.fill();
      T(ctx, "tab " + (i + 1), tx + tw / 2, ty + 70, 26, { align: "center", weight: 700, color: C.text2 });
      for (let k = 0; k < 4; k++) { ctx.fillStyle = "rgba(238,237,242,0.14)"; U.rr(ctx, tx + 44, ty + 110 + k * 40, (tw - 88) * [1, 0.7, 0.9, 0.5][k], 16, 6); ctx.fill(); }
      ctx.restore();
      if (o.kaca > 0) { ctx.save(); ctx.globalAlpha *= o.kaca; U.kaca(ctx, tx, ty, tw, th, { merah: o.dinding || 0 }); ctx.restore(); } }
    if (o.kaca > 0.5 && o.labelKaca !== false) T(ctx, "SANDBOX", x + 60 + 425, y + 444, 36, { align: "center", weight: 900, color: o.dinding > 0.5 ? C.red : "#BFE9F2", spacing: 8 });
    // ruang berharga
    [["file", "File kamu"], ["kamera", "Kamera"], ["pasang", "Program"]].forEach(([ik, nm], i) => { const rx = x + 1080, ry = y + 50 + i * 205, rw = 480, rh = 175, b = clamp((o.bocor || 0) * 3 - i);
      U.kotak(ctx, rx, ry, rw, rh, "", { col: b > 0.5 ? C.red : C.term, glow: b * 0.5 }); U.ikon(ctx, ik, rx + 90, ry + rh / 2, 96, b > 0.5 ? C.red : C.term); T(ctx, nm, rx + 180, ry + rh / 2 + 16, 46, { weight: 800, color: b > 0.5 ? C.red : C.text });
      if (o.larang > 0 && b < 0.5) { ctx.save(); ctx.globalAlpha *= o.larang; U.ikon(ctx, "larang", rx - 60, ry + rh / 2, 70, C.red); ctx.restore(); } });
    ctx.restore();
    return { kx, ky, kw, kh, x, y, w, h };
  };
  // daftar periksa: rows = [{s, u (0..1 centang), samar (0..1)}]
  U.daftar = function (ctx, x, y, w, rows, o = {}) { const rh = o.rh || 112; U.kotak(ctx, x, y, w, rows.length * rh + 60, "", { col: o.col || C.php, fill: "rgba(18,17,21,0.96)" });
    rows.forEach((r, i) => { if (r.a != null && r.a <= 0) return; const ry = y + 30 + i * rh; ctx.save(); ctx.globalAlpha *= r.a == null ? 1 : r.a; garis(ctx, r.col || C.text2, 4); U.rr(ctx, x + 40, ry + 26, 60, 60, 12); ctx.stroke(); if (r.u > 0) U.centang(ctx, x + 70, ry + 56, 40, r.u, C.term);
      if (r.samar > 0.5) { ctx.fillStyle = U.rgba(C.amber, 0.35); let bx = x + 130; [200, 150, 240].forEach(bw => { U.rr(ctx, bx, ry + 34, bw, 44, 10); ctx.fill(); bx += bw + 18; }); T(ctx, "?", bx + 14, ry + 76, 54, { weight: 900, color: C.amber }); }
      else T(ctx, r.s, x + 130, ry + 74, o.size || 46, { weight: 800, color: r.col || C.text }); ctx.restore(); }); };
  // loket + formulir. o.cap = teks cap, o.capCol, o.capU 0..1, o.masuk 0..1 (formulir bergeser ke loket), o.sorot 0..1
  U.loket = function (ctx, o = {}) {
    const lx = 1080, ly = 250, lw = 620, lh = 560; U.kotak(ctx, lx, ly, lw, lh, "", { col: C.php, fill: "rgba(24,23,28,0.96)" }); ctx.fillStyle = C.bar; U.rr(ctx, lx, ly, lw, 90, 18); ctx.fill(); T(ctx, "LOKET PROGRAM", lx + lw / 2, ly + 60, 40, { align: "center", weight: 900, color: C.php, spacing: 6 });
    U.orang(ctx, lx + lw / 2, ly + 300, 230, C.text2); ctx.fillStyle = C.bar; ctx.fillRect(lx + 20, ly + lh - 110, lw - 40, 26);
    const fx = lerp(180, 420, eio(o.masuk || 0)), fy = 280, fw = 560, fh = 500; ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 30; ctx.fillStyle = "#EEEDF2"; U.rr(ctx, fx, fy, fw, fh, 14); ctx.fill(); ctx.restore();
    T(ctx, "FORMULIR", fx + 40, fy + 70, 40, { weight: 900, color: "#1C1B20", spacing: 6 });
    [["Nama", "Budi", 0], ["Umur", "-5 tahun", 1], ["Jumlah", "999999999999", 1]].forEach(([k, v, aneh], i) => { const ry = fy + 130 + i * 110; if (aneh && o.sorot > 0) { ctx.fillStyle = U.rgba(C.red, 0.22 * o.sorot); U.rr(ctx, fx + 24, ry - 12, fw - 48, 92, 10); ctx.fill(); }
      T(ctx, k, fx + 40, ry + 24, 30, { weight: 700, color: "#6E6A78" }); T(ctx, v, fx + 40, ry + 68, 42, { mono: true, weight: 700, color: aneh && o.sorot > 0.5 ? "#C4162A" : "#1C1B20" }); });
    if (o.capU > 0) { ctx.save(); const p = U.pop(o.capL, o.capT); ctx.globalAlpha *= p.a; const k = lerp(1.7, 1, p.sp); ctx.translate(fx + fw / 2, fy + fh - 80); ctx.scale(k, k); X.cap(ctx, o.cap, 0, 0, -0.1, o.capCol || C.term, 64); ctx.restore(); }
  };
})(typeof window !== "undefined" ? window : globalThis);
