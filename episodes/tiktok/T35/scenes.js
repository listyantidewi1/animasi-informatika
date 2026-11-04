/* T35 Rumus lembar kerja yang menghitung sendiri — adegan khusus. Lembar kerja generik digambar kode; data belanja rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, bip, ease, clamp, lerp, back, cue, ph, pop, fmt } = T.helpers;
  const X0 = 75, CW = [50, 230, 180, 150, 200], LH = 56, RH = 110, COLS = ["", "A", "B", "C", "D"];
  const colX = c => X0 + CW.slice(0, c).reduce((a, b) => a + b, 0);
  const rowY = (y, r) => y + LH + (r - 1) * RH;         // r = 1..5
  const cellRect = (y, ref) => { const c = COLS.indexOf(ref[0]), r = +ref.slice(1); return [colX(c), rowY(y, r), CW[c], RH]; };

  // isi lembar: buku = jumlah buku (3 atau 5), dsb. o.hi = {sel: warna}, o.sel = sel terpilih, o.glow = {sel: 0..1}
  function sheet(ctx, y, o = {}) {
    const buku = o.buku ?? 3, tot = 6000 + 5000 * buku + 4000;
    const V = { A1: "Barang", B1: "Harga", C1: "Jumlah", D1: "Total", A2: "Pulpen", B2: "3.000", C2: "2", D2: "6.000",
      A3: "Buku", B3: "5.000", C3: String(buku), D3: fmt(5000 * buku), A4: "Penggaris", B4: "4.000", C4: "1", D4: "4.000",
      A5: "Jumlah semua", D5: o.noTot ? "" : fmt(tot), ...(o.vals || {}) };
    const W = colX(5) - X0, H = LH + 5 * RH;
    card(ctx, X0, y, W, H, { fill: "#F7F8FF", r: 14 });
    ctx.fillStyle = "#E3E7FA"; ctx.fillRect(X0, y, W, LH); ctx.fillRect(X0, y, CW[0], H);
    ctx.fillStyle = "#EEF1FF"; ctx.fillRect(X0 + CW[0], rowY(y, 1), W - CW[0], RH);
    for (const [ref, col] of Object.entries(o.hi || {})) { const [x, yy, w, h] = cellRect(y, ref); ctx.fillStyle = col; ctx.globalAlpha = 0.35; ctx.fillRect(x, yy, w, h); ctx.globalAlpha = 1; }
    for (const [ref, g] of Object.entries(o.glow || {})) { if (g <= 0) continue; const [x, yy, w, h] = cellRect(y, ref); ctx.fillStyle = `rgba(34,227,196,${0.6 * g})`; ctx.fillRect(x, yy, w, h); }
    ctx.strokeStyle = "#C5CBEA"; ctx.lineWidth = 2; ctx.beginPath();
    for (let c = 1; c <= 4; c++) { ctx.moveTo(colX(c), y); ctx.lineTo(colX(c), y + H); }
    for (let r = 1; r <= 5; r++) { ctx.moveTo(X0, rowY(y, r)); ctx.lineTo(X0 + W, rowY(y, r)); }
    ctx.stroke();
    for (let c = 1; c <= 4; c++) text(ctx, COLS[c], colX(c) + CW[c] / 2, y + 40, 30, { align: "center", weight: 800, color: "#59618F" });
    for (let r = 1; r <= 5; r++) text(ctx, String(r), X0 + 25, rowY(y, r) + 66, 30, { align: "center", weight: 800, color: "#59618F" });
    for (const [ref, v] of Object.entries(V)) {
      const c = COLS.indexOf(ref[0]), r = +ref.slice(1), [x, yy, w] = cellRect(y, ref), num = c >= 2;
      text(ctx, v, num ? x + w - 18 : x + 16, yy + 70, 38, { align: num ? "right" : "left", weight: r === 1 || r === 5 ? 900 : 700, color: "#141A45", fit: (r === 5 && c === 1) ? 380 : w - 24 });
    }
    if (o.sel) { const [x, yy, w, h] = cellRect(y, o.sel); ctx.strokeStyle = "#2F7BFF"; ctx.lineWidth = 6; ctx.strokeRect(x + 2, yy + 2, w - 4, h - 4); }
    return { W, H };
  }
  function bar(ctx, y, s, ref) {     // baris rumus: nama sel + isi
    card(ctx, X0, y, colX(5) - X0, 86, { fill: C.panel, stroke: C.line, lw: 3, r: 18 });
    text(ctx, ref || "", X0 + 60, y + 56, 34, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "fx", X0 + 140, y + 56, 34, { align: "center", weight: 800, color: C.mute });
    text(ctx, s, X0 + 190, y + 58, 44, { weight: 800, color: C.kuning });
  }
  const typed = (s, k) => s.slice(0, Math.round(clamp(k, 0, 1) * s.length));

  Object.assign(T.SCENES, {
    // kait: jumlah buku diubah 3 -> 5, total ikut berubah
    t35_lembar(ctx, b, l, t, TL, A) {
      const y = A.y + 20, ch = l > 1.0 ? 1 : 0;
      ctx.save(); const sc = Math.min(1, (A.h - 110) / 606); ctx.translate(480, y); ctx.scale(sc, sc); ctx.translate(-480, 0);
      sheet(ctx, 0, { buku: ch ? 5 : 3, sel: "C3", glow: { C3: ch ? 1 - (l - 1.0) / 0.8 : 0, D3: ease((l - 1.3) / 0.2) * (1 - ease((l - 2.3) / 0.8)), D5: ease((l - 1.6) / 0.2) * (1 - ease((l - 2.6) / 0.8)) } });
      ctx.restore();
      const u = pop(b, l, "berubah");
      if (u > 0) { ctx.save(); ctx.translate(480, y + 606 * sc + 50); ctx.rotate(-0.04); ctx.scale(u, u); pill(ctx, "Otomatis!", 0, 0, 40, { fill: C.kuning }); ctx.restore(); }
    },
    // rumus diawali "=", diketik di sel D2
    t35_rumus(ctx, b, l, t, TL, A) {
      const f = "=B2*C2", k = cue(b, l, "misalnya") / 1.0;
      bar(ctx, A.y + 10, typed(f, k), "D2");
      sheet(ctx, A.y + 120, { sel: "D2", vals: { D2: k >= 1 ? "6.000" : typed(f, k) } });
      const u = pop(b, l, "diawali");
      if (u > 0) { ctx.save(); ctx.translate(480, A.y + 860); ctx.scale(u, u);
        card(ctx, -300, -100, 600, 200, { fill: C.panel, stroke: C.kuning, lw: 6, r: 30, glow: "rgba(255,210,63,0.35)" });
        text(ctx, "=", -170, 55, 170, { align: "center", weight: 900, color: C.kuning });
        text(ctx, "tanda awal", 80, -10, 46, { align: "center", weight: 900, color: C.ink });
        text(ctx, "setiap rumus", 80, 48, 40, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
    },
    // alamat sel: B2 dan C2 mengalir ke D2, 3.000 × 2 = 6.000
    t35_alamat(ctx, b, l, t, TL, A) {
      const y = A.y + 120;
      bar(ctx, A.y + 10, "=B2*C2", "D2");
      const ub = ph(b, l, "harga"), uc = ph(b, l, "kalikan");
      sheet(ctx, y, { sel: "D2", hi: { ...(ub > 0 ? { B2: C.kuning } : {}), ...(uc > 0 ? { C2: C.pink } : {}) }, glow: { D2: ph(b, l, "jumlah di") * 0.7 } });
      const [bx, by, bw] = cellRect(y, "B2"), [cx, cy, cw] = cellRect(y, "C2"), [dx, dy, dw] = cellRect(y, "D2");
      if (ub > 0) { ctx.strokeStyle = C.kuning; ctx.lineWidth = 6; ctx.strokeRect(bx + 3, by + 3, bw - 6, RH - 6); }
      if (uc > 0) { ctx.strokeStyle = C.pink; ctx.lineWidth = 6; ctx.strokeRect(cx + 3, cy + 3, cw - 6, RH - 6); }
      const ey = A.y + 880;
      const part = (s, x, u, col) => { if (u <= 0) return; ctx.save(); ctx.translate(x, ey); ctx.scale(u, u); text(ctx, s, 0, 0, 80, { align: "center", weight: 900, color: col, shadow: true }); ctx.restore(); };
      part("3.000", 190, pop(b, l, "harga"), C.kuning);
      part("×", 360, pop(b, l, "lalu"), C.ink);
      part("2", 450, pop(b, l, "kalikan"), C.pink);
      part("=", 545, pop(b, l, "jumlah di"), C.ink);
      part("6.000", 720, pop(b, l, "di sel c2"), C.tosca);
      if (ub > 0) { ctx.save(); ctx.globalAlpha = ub; arrow(ctx, bx + bw / 2, by + RH, 190, ey - 90, C.kuning, 7, 24); ctx.restore(); }
      if (uc > 0) { ctx.save(); ctx.globalAlpha = uc; arrow(ctx, cx + cw / 2, cy + RH, 450, ey - 90, C.pink, 7, 24); ctx.restore(); }
    },
    // isi sel berubah -> hasil dihitung ulang
    t35_ubah(ctx, b, l, t, TL, A) {
      const y = A.y + 120, ch = cue(b, l, "saat isi") > 0;
      bar(ctx, A.y + 10, ch ? "5" : "=B3*C3", ch ? "C3" : "D3");
      const g1 = ph(b, l, "hasilnya", 0.2), g2 = ph(b, l, "dihitung", 0.2);
      sheet(ctx, y, { buku: ch ? 5 : 3, sel: ch ? "C3" : "D3", glow: { C3: ch ? 1 - ph(b, l, "hasilnya", 0.6) : 0, D3: g1 * (1 - ph(b, l, "ulang", 1.2)), D5: g2 * 1 } });
      const u = pop(b, l, "alamat sel");
      if (u > 0 && !ch) { const [dx, dy, dw] = cellRect(y, "D3"); ctx.save(); ctx.translate(dx + dw / 2, dy - 30); ctx.scale(u, u);
        pill(ctx, "isi D3: =B3*C3", -120, 0, 34, { fill: C.kuning }); ctx.restore(); }
      const uk = pop(b, l, "bukan angkanya");
      if (uk > 0) { ctx.save(); ctx.translate(480, A.y + 860); ctx.scale(uk, uk);
        card(ctx, -380, -80, 760, 160, { fill: C.panel, stroke: C.line, lw: 4, r: 28 });
        text(ctx, "Rumus menyimpan alamat sel,", 0, -8, 42, { align: "center", weight: 900, color: C.ink, fit: 720 });
        text(ctx, "bukan angkanya", 0, 46, 42, { align: "center", weight: 900, color: C.kuning }); ctx.restore(); }
    },
    // SUM menjumlahkan D2 sampai D4 sekaligus
    t35_sum(ctx, b, l, t, TL, A) {
      const y = A.y + 120, f = "=SUM(D2:D4)", k = cue(b, l, 0.05) / 1.0, done = cue(b, l, "sampai") > 0;
      bar(ctx, A.y + 10, typed(f, k), "D5");
      sheet(ctx, y, { buku: 5, sel: "D5", noTot: true, vals: { D5: done ? "35.000" : typed(f, k).slice(0, 8) }, glow: { D5: done ? 1 - ph(b, l, "sampai", 1.5) * 0.6 : 0 } });
      const ur = ph(b, l, "satu kolom");
      if (ur > 0) { const [dx, dy, dw] = cellRect(y, "D2"); ctx.save(); ctx.globalAlpha = ur; ctx.strokeStyle = C.pink; ctx.lineWidth = 7; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -l * 40;
        ctx.strokeRect(dx + 4, dy + 4, dw - 8, RH * 3 - 8); ctx.restore(); }
      const us = pop(b, l, "sum");
      if (us > 0) { ctx.save(); ctx.translate(480, A.y + 860); ctx.scale(us, us);
        card(ctx, -380, -90, 760, 180, { fill: C.panel, stroke: C.pink, lw: 5, r: 28 });
        text(ctx, "SUM = jumlahkan", 0, -14, 52, { align: "center", weight: 900, color: C.pink });
        text(ctx, "6.000 + 25.000 + 4.000 = 35.000", 0, 48, 38, { align: "center", weight: 800, color: C.ink, fit: 720 }); ctx.restore(); }
    }
  });
})();
