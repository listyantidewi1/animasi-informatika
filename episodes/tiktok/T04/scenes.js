/* T04 Mesin pencari tidak mencari saat kamu menekan Enter — adegan khusus. Judul halaman dan data rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, bip, ease, clamp, lerp, back, rnd, fmt, cue, ph, pop } = T.helpers;

  // kolom pencarian generik dengan ikon kaca pembesar; s = teks yang sudah diketik
  function searchBox(ctx, x, y, w, s, caret, glow) {
    card(ctx, x, y, w, 120, { fill: "#FFFFFF", r: 60, glow: glow ? "rgba(77,163,255,0.7)" : null });
    ctx.save(); ctx.strokeStyle = C.mute; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x + 70, y + 54, 22, 0, Math.PI * 2); ctx.stroke();
    ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 86, y + 70); ctx.lineTo(x + 104, y + 88); ctx.stroke(); ctx.restore();
    text(ctx, s, x + 130, y + 78, 52, { weight: 700, color: C.bg });
    if (caret) { const tw = (ctx.font = "700 52px Inter", ctx.measureText(s).width); ctx.fillStyle = C.biru; ctx.fillRect(x + 136 + tw, y + 30, 5, 62); }
  }
  // halaman web kecil (kartu dengan garis-garis teks)
  function page(ctx, x, y, w, h, col, seen) {
    card(ctx, x, y, w, h, { fill: seen ? C.goodBg : C.panel2, stroke: seen ? C.good : C.line, lw: 4, r: 14 });
    ctx.fillStyle = col; rr(ctx, x + 12, y + 12, w - 24, h * 0.18, 6); ctx.fill();
    ctx.fillStyle = "rgba(184,192,238,0.45)";
    for (let i = 0; i < 3; i++) { rr(ctx, x + 12, y + h * 0.42 + i * h * 0.16, (w - 24) * (i === 2 ? 0.6 : 1), h * 0.08, 4); ctx.fill(); }
  }
  // robot crawler kecil berkaki delapan
  function crawler(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = C.kuning; ctx.lineWidth = s * 0.07; ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) for (const d of [-1, 1]) {
      const a = (i - 1.5) * 0.45, w = Math.sin(t * 14 + i * 1.7 + (d > 0 ? 0 : 1.5)) * 0.15;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(d * s * 0.55, (a + w) * s * 0.6 - s * 0.1); ctx.lineTo(d * s * 0.8, (a + w) * s * 0.9 + s * 0.2); ctx.stroke();
    }
    ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.36, s * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.05, s * 0.07, 0, Math.PI * 2); ctx.arc(s * 0.12, -s * 0.05, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: "nasi goreng" diketik, tombol Enter ditekan, hasil langsung muncul
    t04_enter(ctx, b, l, t, TL, A) {
      const q = "nasi goreng", n = Math.min(q.length, Math.floor(Math.max(0, l - 0.3) / 0.07));
      const y = A.y + 10, pressAt = 0.3 + q.length * 0.07 + 0.3, pr = l - pressAt;
      searchBox(ctx, 90, y, 780, q.slice(0, n), n < q.length || Math.floor(l * 3) % 2 === 0, pr > 0 && pr < 0.6);
      // tombol Enter
      const ky = y + 170, down = pr > 0 && pr < 0.18 ? 10 : 0;
      ctx.save(); ctx.translate(0, down);
      card(ctx, 610, ky + 14, 260, 120, { fill: "#11163D", r: 22 });
      card(ctx, 610, ky, 260, 120, { fill: pr > 0 && pr < 0.4 ? C.kuning : C.panel2, stroke: C.line, lw: 4, r: 22 });
      text(ctx, "Enter ↵", 740, ky + 78, 50, { align: "center", weight: 900, color: pr > 0 && pr < 0.4 ? C.bg : C.ink });
      ctx.restore();
      if (pr > 0 && pr < 0.8) { ctx.save(); ctx.globalAlpha = 1 - pr / 0.8; ctx.strokeStyle = C.kuning; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(740, ky + 60, 60 + pr * 200, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      // hasil muncul cepat
      for (let i = 0; i < 3; i++) {
        const u = pop(b, l, (pressAt + 0.25 + i * 0.12 - ((b.speech ?? b.start) - b.start)) / (b.audio || 2));
        if (u <= 0 || pr < 0) continue;
        const yy = ky + 160 + i * 92; if (yy + 76 > A.bot) break;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * -60, 0);
        card(ctx, 90, yy, 480, 76, { fill: C.panel, stroke: C.line, lw: 3, r: 16 });
        ctx.fillStyle = [C.biru, C.pink, C.tosca][i]; rr(ctx, 110, yy + 20, 240, 16, 8); ctx.fill();
        ctx.fillStyle = "rgba(184,192,238,0.4)"; rr(ctx, 110, yy + 46, 400, 12, 6); ctx.fill();
        ctx.restore();
      }
      const uq = pop(b, l, "dari mana");
      if (uq > 0) { ctx.save(); ctx.translate(740, ky + 270); ctx.scale(uq, uq); text(ctx, "?", 0, 60, 200, { align: "center", weight: 900, color: C.pink, shadow: true }); ctx.restore(); }
    },

    // crawler berjalan dari halaman ke halaman lewat link; penghitung halaman dibaca naik
    t04_crawler(ctx, b, l, t, TL, A) {
      const cols = 4, rows = 3, pw = 160, phh = 130, gx = (820 - cols * pw) / (cols - 1), top = A.y + 140;
      const gy = Math.min(90, (A.bot - top - 120 - rows * phh) / (rows - 1));
      const P = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) P.push([A.x + c * (pw + gx) + pw / 2, top + r * (phh + gy) + phh / 2]);
      const path = [0, 1, 5, 4, 8, 9, 10, 6, 2, 3, 7, 11];
      const go = Math.max(0, cue(b, l, "crawler")) * 2.6, k = Math.min(path.length - 1, Math.floor(go)), f = ease(go - k);
      // garis link
      ctx.save(); ctx.strokeStyle = "rgba(77,163,255,0.45)"; ctx.lineWidth = 5; ctx.setLineDash([12, 10]);
      for (let i = 0; i < path.length - 1; i++) { const a = P[path[i]], c = P[path[i + 1]]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); }
      ctx.restore();
      P.forEach((p, i) => {
        const u = pop(b, l, i * 0.025); if (u <= 0) return;
        const seen = path.indexOf(i) <= k && go > 0;
        ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(u, u);
        page(ctx, -pw / 2, -phh / 2, pw, phh, [C.biru, C.pink, C.tosca, C.kuning][i % 4], seen);
        if (seen) check(ctx, pw / 2 - 26, -phh / 2 + 22, 34, C.good);
        ctx.restore();
      });
      if (go > 0) {
        const a = P[path[k]], c = P[path[Math.min(path.length - 1, k + 1)]];
        crawler(ctx, lerp(a[0], c[0], f), lerp(a[1], c[1], f), 90, t);
      }
      // judul dan penghitung
      text(ctx, "Crawler membaca halaman web", A.x, A.y + 60, 46, { weight: 900, color: C.kuning, fit: 820 });
      const n = Math.floor(Math.pow(Math.max(0, go) / 3.2, 3) * 4.2e8);
      card(ctx, A.x, A.bot - 110, 820, 100, { fill: C.bg2, stroke: C.line, lw: 3, r: 24 });
      text(ctx, "Halaman dibaca:", A.x + 30, A.bot - 44, 40, { weight: 800, color: C.ink2 });
      text(ctx, fmt(Math.min(n, 9.87e9)), A.x + 790, A.bot - 40, 54, { weight: 900, color: C.tosca, align: "right" });
    },

    // halaman-halaman masuk ke indeks: kata -> nomor halaman, seperti indeks buku
    t04_indeks(ctx, b, l, t, TL, A) {
      const rows = [["bakso", "3, 17, 40"], ["goreng", "2, 9, 11, 14"], ["kucing", "6, 21"], ["nasi", "2, 5, 9, 14"], ["sekolah", "1, 8, 30"]];
      const bx = A.x + 40, bw = 740, top = A.y + 40;
      // buku terbuka
      card(ctx, bx, top, bw, 130 + rows.length * 100, { fill: "#F4EFE1", r: 24 });
      ctx.fillStyle = "rgba(11,14,42,0.12)"; ctx.fillRect(bx, top + 110, bw, 4);
      text(ctx, "INDEKS", bx + bw / 2, top + 82, 58, { align: "center", weight: 900, color: C.bg });
      const ui = ph(b, l, "indeks", 0.5);
      rows.forEach((r, i) => {
        const u = ph(b, l, 0.12 + i * 0.12, 0.35); if (u <= 0) return;
        const y = top + 130 + i * 100 + 62;
        ctx.save(); ctx.globalAlpha = u; ctx.translate((1 - u) * 80, 0);
        text(ctx, r[0], bx + 50, y, 52, { weight: 800, color: C.bg });
        ctx.strokeStyle = "rgba(11,14,42,0.25)"; ctx.lineWidth = 3; ctx.setLineDash([4, 10]); ctx.beginPath(); ctx.moveTo(bx + 290, y - 12); ctx.lineTo(bx + 400, y - 12); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "hlm " + r[1], bx + bw - 40, y, 44, { weight: 700, color: "#5B4BB0", align: "right" });
        ctx.restore();
      });
      // kartu kata yang "terbang" dari halaman web ke buku
      for (let i = 0; i < 5; i++) {
        const s = ((l * 0.9 + i * 0.2) % 1); if (l < 0.3) break;
        const bb = top + 130 + rows.length * 100, x = lerp(A.x + 80 + i * 170, bx + bw / 2, ease(s)), y = lerp(A.bot - 40, bb + 30, ease(s));
        if (A.bot - bb < 140) break;
        ctx.save(); ctx.globalAlpha = (1 - s) * 0.9; pill(ctx, rows[i][0], x, y, 32, { fill: [C.kuning, C.pink, C.tosca, C.biru, C.kuning][i] }); ctx.restore();
      }

    },

    // pencarian "nasi goreng": dua baris indeks dibandingkan, halaman yang memuat keduanya menyala
    t04_cari(ctx, b, l, t, TL, A) {
      searchBox(ctx, A.x + 20, A.y + 10, 780, "nasi goreng", false, false);
      const R = [["nasi", [2, 5, 9, 14]], ["goreng", [2, 9, 11, 14]]], both = [2, 9, 14];
      const ui = ph(b, l, "membuka", 0.4), hit = cue(b, l, "indeks itu") + 0.6;
      R.forEach((r, i) => {
        const u = ph(b, l, 0.2 + i * 0.12, 0.35); if (u <= 0) return;
        const y = A.y + 190 + i * 170;
        ctx.save(); ctx.globalAlpha = u;
        card(ctx, A.x, y, 820, 140, { fill: C.panel, stroke: C.line, lw: 3, r: 24 });
        text(ctx, r[0], A.x + 30, y + 88, 50, { weight: 900, color: C.kuning });
        r[1].forEach((p, k) => {
          const on = hit > 0 && both.includes(p), x = A.x + 330 + k * 120, pulse = on ? 1 + 0.06 * Math.sin(l * 8) : 1;
          ctx.save(); ctx.translate(x, y + 70); ctx.scale(pulse, pulse);
          card(ctx, -50, -46, 100, 92, { fill: on ? C.tosca : C.bg2, r: 18, stroke: on ? null : C.line, lw: 3 });
          text(ctx, String(p), 0, 18, 46, { align: "center", weight: 900, color: on ? C.bg : C.ink2 }); ctx.restore();
        });
        ctx.restore();
      });
      // hasil: halaman yang memuat kedua kata
      const ur = pop(b, l, "indeks itu", 0.5), y2 = A.y + 560;
      if (ur > 0 && hit > 0) {
        ctx.save(); ctx.globalAlpha = clamp(ur, 0, 1);
        arrow(ctx, A.x + 410, A.y + 520, A.x + 410, y2 + 20, C.tosca, 10, 34);
        text(ctx, "memuat kedua kata:", A.x + 410, y2 + 90, 44, { align: "center", weight: 800, color: C.ink });
        both.forEach((p, k) => { const u = pop(b, l, "indeks itu", 0.5 + k * 0.15); ctx.save(); ctx.translate(A.x + 210 + k * 200, y2 + 190); ctx.scale(u, u); pill(ctx, "hlm " + p, 0, 0, 44, { fill: C.tosca }); ctx.restore(); });
        ctx.restore();
      }
      if (ui > 0 && A.bot - y2 > 360) bip(ctx, 480, A.bot - 100, 150, { mood: hit > 0 ? "wow" : "think", t });
    },

    // hasil diurutkan: kartu berpindah tempat, yang paling cocok naik ke atas
    t04_urut(ctx, b, l, t, TL, A) {
      const R = [
        { t: "Sejarah Nasi Goreng", s: 0.55, c: C.biru },
        { t: "Resep Nasi Goreng Kampung", s: 0.95, c: C.tosca },
        { t: "Nasi Goreng Pedas 10 Menit", s: 0.8, c: C.pink }
      ];
      const order0 = [0, 1, 2], order1 = [1, 2, 0], k = ease(cue(b, l, "diurutkan") / 0.9), ch = 190, gap = 34, top = A.y + 110;
      text(ctx, "Hasil pencarian", A.x, A.y + 60, 50, { weight: 900, color: C.kuning });
      R.forEach((r, i) => {
        const u = pop(b, l, i * 0.05); if (u <= 0) return;
        const y = lerp(top + order0.indexOf(i) * (ch + gap), top + order1.indexOf(i) * (ch + gap), k), first = k > 0.95 && order1[0] === i;
        const dx = Math.sin(k * Math.PI) * (i === 0 ? 70 : i === 1 ? -40 : 30);
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate(dx, 0);
        card(ctx, A.x, y, 820, ch, { fill: first ? C.goodBg : C.panel, stroke: first ? C.good : C.line, lw: first ? 6 : 3, r: 24, glow: first ? "rgba(34,227,196,0.4)" : null });
        text(ctx, r.t, A.x + 30, y + 66, 44, { weight: 800, color: C.ink, fit: 640 });
        text(ctx, "cocok", A.x + 30, y + 140, 32, { weight: 700, color: C.ink2 });
        card(ctx, A.x + 140, y + 116, 480, 32, { fill: C.bg2, r: 16 });
        card(ctx, A.x + 140, y + 116, 480 * r.s * ph(b, l, "cocok", 0.6), 32, { fill: r.c, r: 16 });
        text(ctx, String(Math.round(r.s * 100)), A.x + 680, y + 146, 54, { weight: 900, color: r.c });
        ctx.restore();
      });
      const uw = pop(b, l, "tampil di atas");
      if (uw > 0) { ctx.save(); ctx.translate(A.x + 770, top + 20); ctx.scale(uw, uw); ctx.rotate(0.12); pill(ctx, "No. 1", 0, 0, 38, { fill: C.kuning }); ctx.restore(); }
      const by = top + 3 * (ch + gap);
      if (A.bot - by > 180) bip(ctx, 480, by + (A.bot - by) / 2, Math.min(180, A.bot - by - 20), { mood: "happy", t });
    }
  });
})();
