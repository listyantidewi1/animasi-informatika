/* T27 Rekursi: boneka di dalam boneka — adegan khusus. Boneka, folder, dan pseudocode digambar sendiri (rekaan). */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, cross, bip, rnd, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const COL = [C.pink, C.biru, C.tosca, C.kuning, "#A77BFF", C.pink, C.biru];

  function dollPath(ctx, cx, cy, h) {
    ctx.beginPath(); ctx.arc(cx, cy - h * 0.28, h * 0.2, 0, Math.PI * 2);
    ctx.ellipse(cx, cy + h * 0.13, h * 0.29, h * 0.35, 0, 0, Math.PI * 2);
  }
  function dollBody(ctx, cx, cy, h, col) {
    ctx.fillStyle = col; dollPath(ctx, cx, cy, h); ctx.fill();
    ctx.fillStyle = "#FCE3C8"; ctx.beginPath(); ctx.ellipse(cx, cy - h * 0.27, h * 0.13, h * 0.12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(cx - h * 0.05, cy - h * 0.28, h * 0.018 + 1, 0, Math.PI * 2); ctx.arc(cx + h * 0.05, cy - h * 0.28, h * 0.018 + 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,79,154,0.6)"; ctx.beginPath(); ctx.arc(cx - h * 0.08, cy - h * 0.23, h * 0.025, 0, Math.PI * 2); ctx.arc(cx + h * 0.08, cy - h * 0.23, h * 0.025, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.ellipse(cx, cy + h * 0.18, h * 0.17, h * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = col; for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * h * 0.06, cy + h * 0.18 + Math.sin(a) * h * 0.06, h * 0.045, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(cx, cy + h * 0.18, h * 0.035, 0, Math.PI * 2); ctx.fill();
  }
  // boneka; open 0..1 = bagian atas terangkat
  function doll(ctx, cx, cy, h, col, open = 0) {
    const wy = cy - h * 0.02;
    ctx.save(); ctx.beginPath(); ctx.rect(cx - h, wy, h * 2, h); ctx.clip(); dollBody(ctx, cx, cy, h, col); ctx.restore();
    ctx.save(); ctx.translate(cx + open * h * 0.35, wy - open * h * 0.45); ctx.rotate(open * 0.5); ctx.translate(-cx, -wy);
    ctx.beginPath(); ctx.rect(cx - h, wy - h, h * 2, h); ctx.clip(); dollBody(ctx, cx, cy, h, col); ctx.restore();
    if (open < 0.05) { ctx.strokeStyle = "rgba(11,14,42,0.35)"; ctx.lineWidth = Math.max(2, h * 0.012); ctx.beginPath(); ctx.moveTo(cx - h * 0.29, wy); ctx.lineTo(cx + h * 0.29, wy); ctx.stroke(); }
  }
  function code(ctx, lines, x, y, w, opt = {}) {
    const lh = opt.lh || 70, h = lines.length * lh + 50;
    card(ctx, x, y, w, h, { fill: "#0E1233", stroke: C.line, lw: 4, r: 24 });
    lines.forEach((ln, i) => {
      const hl = (opt.hl || [])[i] || 0;
      if (hl > 0) { ctx.save(); ctx.globalAlpha = hl; card(ctx, x + 14, y + 22 + i * lh, w - 28, lh - 6, { fill: opt.hlCol || "rgba(255,210,63,0.22)", r: 12 }); ctx.restore(); }
      const kw = ln.match(/^(\s*)(FUNGSI|JIKA)(.*)$/);
      if (kw) { const ind = kw[1].length * 18; font(ctx, 44, 800); const kwW = ctx.measureText(kw[2]).width;
        text(ctx, kw[2], x + 30 + ind, y + 22 + i * lh + lh * 0.66, 44, { weight: 900, color: C.pink });
        text(ctx, kw[3], x + 30 + ind + kwW, y + 22 + i * lh + lh * 0.66, 44, { weight: 800, color: C.ink, fit: w - 60 - ind - kwW }); }
      else text(ctx, ln.trim(), x + 30 + (ln.length - ln.trimStart().length) * 18, y + 22 + i * lh + lh * 0.66, 44, { weight: 800, color: C.ink, fit: w - 100 });
    });
    return h;
  }
  function folder(ctx, x, y, s, col, open) {
    ctx.save(); ctx.fillStyle = col; rr(ctx, x, y, s * 0.45, s * 0.2, s * 0.06); ctx.fill();
    rr(ctx, x, y + s * 0.1, s, s * 0.7, s * 0.08); ctx.fill();
    if (open) { ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.moveTo(x + s * 0.08, y + s * 0.8); ctx.lineTo(x + s * 0.2, y + s * 0.32); ctx.lineTo(x + s * 1.08, y + s * 0.32); ctx.lineTo(x + s * 0.96, y + s * 0.8); ctx.fill(); }
    ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: boneka keluar dari boneka, makin kecil
    t27_kait(ctx, b, l, t, TL, A) {
      const sizes = [330, 250, 190, 140, 100, 70], cy = A.y + Math.min(A.h, 520) * 0.55;
      let x = 140; const xs = sizes.map((s, i) => { const v = x; x += s * 0.58 + 22; return v; });
      sizes.forEach((s, i) => {
        const at = 0.25 + i * 0.55, k = clamp((l - at) / 0.45, 0, 1); if (i > 0 && k <= 0) return;
        const px = i === 0 ? xs[0] : lerp(xs[i - 1], xs[i], ease(k)), py = i === 0 ? cy : lerp(cy - 20, cy + (sizes[0] - s) * 0.42, ease(k));
        doll(ctx, px, py, s, COL[i]);
      });
      if (A.bot - (cy + 230) > 130) bip(ctx, 480, (cy + 230 + A.bot) / 2, Math.min(180, A.bot - cy - 240), { mood: "wow", t });
    },

    // masalah besar -> masalah sama yang lebih kecil
    t27_kecil(ctx, b, l, t, TL, A) {
      const sizes = [380, 280, 200, 140], y0 = A.y + 40;
      sizes.forEach((s, i) => {
        const u = pop(b, l, i === 0 ? 0.02 : 0.25 + i * 0.15); if (u <= 0) return;
        const cx = 180 + i * 200, cy = y0 + 210 + i * 140;
        ctx.save(); ctx.translate(cx, cy); ctx.scale(u, u); doll(ctx, 0, 0, s, COL[i]); ctx.restore();
        if (i > 0) arrow(ctx, cx - 200 + 90, cy - 140 + 30, cx - 70, cy - 30, C.ink2, 8, 26);
      });
      const ua = pop(b, l, "cara yang sama"), ub = pop(b, l, "lebih kecil"), ly = y0 + 760;
      if (ua > 0) { ctx.save(); ctx.translate(300, ly); ctx.scale(ua, ua); pill(ctx, "cara sama", 0, 0, 46, { fill: C.kuning }); ctx.restore(); }
      if (ub > 0) { ctx.save(); ctx.translate(660, ly); ctx.scale(ub, ub); pill(ctx, "makin kecil", 0, 0, 46, { fill: C.tosca }); ctx.restore(); }
    },

    // satu perintah yang memanggil dirinya sendiri
    t27_perintah(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y = A.y + 10, hl3 = ph(b, l, "hal yang sama", 0.4), hl2 = ph(b, l, "buka boneka", 0.4);
      const h = code(ctx, ["FUNGSI buka(boneka)", "  angkat tutupnya", "  buka(isinya)"], x, y, w, { hl: [0, hl2 * (1 - hl3), hl3] });
      // panah melingkar dari baris 3 ke baris 1
      if (hl3 > 0) { ctx.save(); ctx.globalAlpha = hl3; ctx.strokeStyle = C.kuning; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + w - 40, y + 22 + 2 * 70 + 35); ctx.bezierCurveTo(x + w + 30, y + 200, x + w + 30, y + 60, x + w - 40, y + 57); ctx.stroke();
        ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.moveTo(x + w - 46, y + 57); ctx.lineTo(x + w - 14, y + 40); ctx.lineTo(x + w - 14, y + 74); ctx.fill(); ctx.restore(); }
      // boneka dibuka berulang
      const sizes = [420, 320, 240, 170, 110], cy = y + h + 320, per = 1.2, st = Math.max(0, cue(b, l, "buka boneka"));
      const k = Math.min(sizes.length - 1, Math.floor(st / per)), f = (st % per) / per;
      const cur = st <= 0 ? 0 : k, open = st <= 0 || k >= sizes.length - 1 ? 0 : ease(clamp(f * 1.6, 0, 1));
      const s = sizes[cur], inner = sizes[cur + 1];
      if (inner && open > 0.3) doll(ctx, 480, cy + (s - inner) * 0.4, inner, COL[cur + 1], 0);
      doll(ctx, 480, cy, s, COL[cur], open);
      text(ctx, "buka ke-" + (cur + 1), 480, cy + s * 0.62 + 30, 40, { align: "center", weight: 800, color: C.ink2 });
    },

    // base case: boneka terkecil tidak bisa dibuka -> berhenti
    t27_berhenti(ctx, b, l, t, TL, A) {
      const x = 80, w = 800, y = A.y + 10, hb = ph(b, l, "boneka terkecil", 0.5);
      const h = code(ctx, ["FUNGSI buka(boneka)", "  JIKA tidak bisa dibuka", "      berhenti", "  angkat tutupnya", "  buka(isinya)"], x, y, w, { lh: 62, hl: [0, hb, hb], hlCol: "rgba(34,227,196,0.25)" });
      const sizes = [250, 190, 145, 105, 75], cy = y + h + 200; let px = 140;
      sizes.forEach((s, i) => { const u = pop(b, l, 0.05 + i * 0.07); if (u <= 0) return; ctx.save(); ctx.translate(px, cy + (sizes[0] - s) * 0.4); ctx.scale(u, u);
        if (i === sizes.length - 1 && hb > 0) { ctx.save(); ctx.shadowColor = C.tosca; ctx.shadowBlur = 40 * hb; doll(ctx, 0, 0, s, COL[i]); ctx.restore(); } else doll(ctx, 0, 0, s, COL[i]);
        ctx.restore(); px += s * 0.6 + 40; });
      const ub = pop(b, l, "base case"), by = cy + 200;
      if (ub > 0) { const tx = px - 60 - 20; arrow(ctx, tx - 120, by - 10, tx - 10, by - 90, C.tosca, 8, 26);
        ctx.save(); ctx.translate(420, by + 50); ctx.scale(ub, ub); pill(ctx, "base case: berhenti di sini", 0, 0, 44, { fill: C.tosca }); ctx.restore(); }
    },

    // tanpa base case: berulang terus sampai error
    t27_tanpa(ctx, b, l, t, TL, A) {
      const cx = 480, cy = A.y + 300, err = cue(b, l, "error") > 0;
      // lorong boneka yang terus mengecil
      ctx.save(); ctx.beginPath(); rr(ctx, 80, A.y + 10, 800, 560, 30); ctx.fillStyle = "#0E1233"; ctx.fill(); ctx.clip();
      const z = err ? 0 : (l * 0.9) % 1;
      for (let i = 7; i >= 0; i--) { const s = 560 * Math.pow(0.68, i - z); if (s < 6) continue; ctx.globalAlpha = clamp(s / 80, 0, 1); doll(ctx, cx + (i % 2 ? 6 : -6), cy + s * 0.02, s * 0.9, COL[(i + Math.floor(l * 0.9)) % 5]); }
      ctx.restore();
      const n = err ? 999 : Math.floor(Math.pow(Math.max(0, l), 2.2) * 6) + 1;
      text(ctx, "buka ke-" + n.toLocaleString("id-ID") + (err ? "…" : ""), cx, A.y + 640, 60, { align: "center", weight: 900, color: err ? C.bad : C.kuning });
      const ue = pop(b, l, "error");
      if (ue > 0) { ctx.save(); ctx.translate(cx, A.y + 300); ctx.rotate(-0.04); ctx.scale(ue, ue); card(ctx, -360, -100, 720, 200, { fill: C.badBg, stroke: C.bad, lw: 6, glow: "rgba(255,90,95,0.5)" });
        text(ctx, "RecursionError", 0, -10, 70, { align: "center", weight: 900, color: C.bad, fit: 660 });
        text(ctx, "contoh pesan error di Python", 0, 58, 34, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); }
      const by = A.y + 690; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: err ? "sad" : "wow", t });
    },

    // folder di dalam folder dibuka dengan cara yang sama
    t27_folder(ctx, b, l, t, TL, A) {
      const names = ["Tugas", "Foto", "Lomba", "Juara"], files = [["catatan.txt"], ["kelas.jpg"], ["poster.png"], ["piala.jpg", "sertifikat.pdf"]];
      const y0 = A.y + 30, st = Math.max(0, cue(b, l, "membuka")), per = 0.75; let row = 0, found = 0;
      names.forEach((nm, i) => {
        const vis = i === 0 || st > i * per; if (!vis) return;
        const open = st > i * per + 0.35, x = 90 + i * 70, y = y0 + row * 92; row++;
        folder(ctx, x, y, 70, [C.kuning, C.biru, C.pink, C.tosca][i], open);
        text(ctx, nm, x + 90, y + 50, 44, { weight: 900, color: C.ink });
        if (open) { files[i].forEach((f, j) => { const fy = y0 + row * 92; row++; found++;
          card(ctx, x + 80, fy + 6, 44, 56, { fill: C.ink2, r: 6 }); text(ctx, f, x + 140, fy + 48, 38, { weight: 700, color: C.ink2, fit: 760 - x - 140 }); }); }
      });
      const uc = ph(b, l, 0.2, 0.3), cyy = y0 + 92 * 9 + 20;
      if (uc > 0 && cyy + 40 < A.bot) { ctx.save(); ctx.globalAlpha = uc; pill(ctx, "file ditemukan: " + found, 480, cyy, 46, { fill: C.kuning }); ctx.restore(); }
    }
  });
})();
