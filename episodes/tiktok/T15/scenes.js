/* T15 Satu salah ketik, programnya kacau — adegan khusus. Editor generik; nama dan harga rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, font, card, pill, arrow, check, cross, bip, bubble, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const K = { kw: "#FF79C6", fn: C.tosca, str: C.kuning, num: "#BD93F9", txt: C.ink, op: C.pink };

  // baris kode: daftar [teks, warna]; mengembalikan lebar
  function codeLine(ctx, segs, x, y, size) {
    let cx = x; font(ctx, size, 800);
    for (const [s, col] of segs) { text(ctx, s, cx, y, size, { weight: 800, color: col }); font(ctx, size, 800); cx += ctx.measureText(s).width; }
    return cx - x;
  }
  function editor(ctx, x, y, w, h, title) {
    card(ctx, x, y, w, h, { fill: "#0F1433", stroke: C.line, lw: 4, r: 24 });
    card(ctx, x, y, w, 70, { fill: C.panel2, r: 24 }); ctx.fillStyle = C.panel2; ctx.fillRect(x, y + 40, w, 30);
    [C.bad, C.kuning, C.good].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 36 + i * 36, y + 35, 11, 0, Math.PI * 2); ctx.fill(); });
    text(ctx, title, x + w / 2, y + 46, 32, { align: "center", weight: 800, color: C.ink2 });
  }
  function consoleBox(ctx, x, y, w, h, lines, bad) {
    card(ctx, x, y, w, h, { fill: bad ? "#2A0F1E" : "#071A1A", stroke: bad ? C.bad : C.good, lw: 4, r: 20 });
    text(ctx, "Output", x + 24, y + 42, 28, { weight: 800, color: C.mute });
    lines.forEach((s, i) => text(ctx, s, x + 24, y + 92 + i * 50, 38, { weight: 800, color: bad ? "#FF8A8E" : C.good, fit: w - 48 }));
  }
  function bugIcon(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 4) * 0.1); ctx.strokeStyle = C.ink; ctx.lineWidth = s * 0.05; ctx.lineCap = "round";
    for (let i = -1; i <= 1; i++) for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * s * 0.2, i * s * 0.15); ctx.lineTo(d * s * 0.42, i * s * 0.2 + Math.sin(t * 12 + i) * s * 0.04); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.3); ctx.lineTo(-s * 0.18, -s * 0.46); ctx.moveTo(s * 0.08, -s * 0.3); ctx.lineTo(s * 0.18, -s * 0.46); ctx.stroke();
    ctx.fillStyle = C.bad; ctx.beginPath(); ctx.ellipse(0, s * 0.05, s * 0.24, s * 0.32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(0, -s * 0.26, s * 0.13, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-s * 0.015, -s * 0.15, s * 0.03, s * 0.5);
    ctx.beginPath(); ctx.arc(-s * 0.1, 0, s * 0.05, 0, Math.PI * 2); ctx.arc(s * 0.1, s * 0.16, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // monitor bermata (komputer yang membaca persis)
  function monitor(ctx, x, y, s, t, mood) {
    card(ctx, x - s * 0.5, y - s * 0.4, s, s * 0.7, { fill: C.panel2, stroke: C.ink2, lw: 6, r: 18 });
    ctx.fillStyle = C.ink2; ctx.fillRect(x - s * 0.06, y + s * 0.3, s * 0.12, s * 0.12); ctx.fillRect(x - s * 0.22, y + s * 0.4, s * 0.44, s * 0.05);
    const bl = (Math.floor(t * 1.3) % 4 === 0 && (t % 0.77) < 0.12) ? 0.15 : 1;
    ctx.fillStyle = C.tosca; ctx.beginPath(); ctx.ellipse(x - s * 0.17, y - s * 0.1, s * 0.07, s * 0.09 * bl, 0, 0, Math.PI * 2); ctx.ellipse(x + s * 0.17, y - s * 0.1, s * 0.07, s * 0.09 * bl, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.tosca; ctx.lineWidth = s * 0.03; ctx.beginPath(); ctx.moveTo(x - s * 0.15, y + s * 0.12); ctx.lineTo(x + s * 0.15, y + s * 0.12); ctx.stroke();
  }

  Object.assign(T.SCENES, {
    // di bawah kait: kode tanpa kutip penutup, kursor merah berkedip, program menolak berjalan
    t15_kutip(ctx, b, l, t, TL, A) {
      const h = Math.min(330, A.h - 20), y = A.y + 10, x = A.x + 20, w = 780;
      editor(ctx, x, y, w, h, "halo.py");
      const wl = codeLine(ctx, [["print", K.fn], ["(", K.txt], ["\"Halo, Rani!", K.str], [")", K.txt]], x + 40, y + 160, 58);
      // tempat kutip yang hilang
      font(ctx, 58, 800); const pos = x + 40 + ctx.measureText("print(\"Halo, Rani!").width;
      if (Math.floor(l * 3) % 2 === 0) { ctx.fillStyle = C.bad; ctx.fillRect(pos + 2, y + 108, 6, 66); }
      const um = pop(b, l, "hilang");
      if (um > 0) { ctx.save(); ctx.translate(pos + 4, y + 230); ctx.scale(um, um); arrow(ctx, 0, 40, 0, -40, C.bad, 8, 24); ctx.restore(); text(ctx, "kutip penutup hilang!", pos - 120, y + h - 30, 34, { align: "center", weight: 800, color: C.bad }); }
      const ur = pop(b, l, "menolak");
      if (ur > 0) { ctx.save(); ctx.translate(x + w - 70, y + 140); ctx.scale(ur, ur); ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill(); cross(ctx, 0, 0, 56, C.ink); ctx.restore(); }
    },
    // komputer membaca persis: "prin" bukan "print"
    t15_persis(ctx, b, l, t, TL, A) {
      editor(ctx, A.x + 20, A.y + 20, 780, 220, "kode.py");
      codeLine(ctx, [["prin", K.fn], ["(", K.txt], ["\"Halo\"", K.str], [")", K.txt]], A.x + 60, A.y + 175, 58);
      font(ctx, 58, 800); const px = A.x + 60 + ctx.measureText("prin").width;
      const uh = pop(b, l, "persis");
      if (uh > 0) { ctx.save(); ctx.globalAlpha = clamp(uh, 0, 1); ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); for (let i = 0; i <= 12; i++) { const xx = A.x + 60 + i * (px - A.x - 60) / 12; ctx.lineTo(xx, A.y + 195 + (i % 2) * 10); } ctx.stroke(); ctx.restore(); }
      // manusia vs komputer
      const y = A.y + 330, uc = pop(b, l, "seperti yang ditulis"), um = pop(b, l, "maksudmu");
      bip(ctx, A.x + 120, y + 330, 170, { mood: um > 0 ? "sad" : "happy", t });
      monitor(ctx, A.x + 680, y + 330, 240, t);
      if (um > 0 || cue(b, l, "tanpa") > 0) { const u = Math.max(um, pop(b, l, "tanpa")); ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); bubble(ctx, "Maksudku print!", A.x + 10, y + 200, 360, 40, { tailX: A.x + 120 }); ctx.restore(); }
      if (uc > 0) { ctx.save(); ctx.globalAlpha = clamp(uc, 0, 1); bubble(ctx, "Yang tertulis: prin. Aku tidak kenal!", A.x + 420, y + 150, 400, 40, { fill: C.tosca, tailX: A.x + 680 }); ctx.restore(); }
    },
    // SyntaxError di konsol, program berhenti
    t15_error(ctx, b, l, t, TL, A) {
      const x = A.x + 20, w = 780;
      editor(ctx, x, A.y + 20, w, 260, "halo.py");
      codeLine(ctx, [["print", K.fn], ["(", K.txt], ["\"Halo, Rani!", K.str], [")", K.txt]], x + 40, A.y + 180, 54);
      // tombol jalankan
      const run = cue(b, l, "python"), ur = ph(b, l, "python", 0.2);
      card(ctx, x + w - 190, A.y + 200, 160, 60, { fill: ur > 0 && run < 0.3 ? C.kuning : C.good, r: 30 });
      ctx.fillStyle = C.bg; ctx.beginPath(); ctx.moveTo(x + w - 150, A.y + 212); ctx.lineTo(x + w - 150, A.y + 248); ctx.lineTo(x + w - 120, A.y + 230); ctx.fill();
      text(ctx, "Jalankan", x + w - 70, A.y + 240, 24, { align: "center", weight: 900, color: C.bg });
      const ue = pop(b, l, "berhenti");
      if (ue > 0) {
        ctx.save(); ctx.globalAlpha = clamp(ue, 0, 1); ctx.translate(0, (1 - clamp(ue, 0, 1)) * 30);
        consoleBox(ctx, x, A.y + 320, w, 300, ["  File \"halo.py\", line 1", "    print(\"Halo, Rani!)", "SyntaxError: unterminated", "string literal"], true);
        ctx.restore();
      }
      const us = pop(b, l, "syntaxerror");
      if (us > 0) { ctx.save(); ctx.translate(480, A.y + 700); ctx.scale(us, us); pill(ctx, "Program tidak dijalankan sama sekali", 0, 0, 36, { fill: C.bad, color: C.ink }); ctx.restore(); }
      if (A.bot - (A.y + 760) > 150) bip(ctx, 480, A.bot - 80, 130, { mood: "sad", t });
    },
    // salah ketik licik: program berjalan tanpa error, tapi hasilnya salah
    t15_licik(ctx, b, l, t, TL, A) {
      const x = A.x + 20, w = 780;
      editor(ctx, x, A.y + 20, w, 380, "bakso.py");
      const L = [[["harga", K.txt], [" = ", K.op], ["5000", K.num]], [["jumlah", K.txt], [" = ", K.op], ["3", K.num]], [["total", K.txt], [" = ", K.op], ["harga ", K.txt], ["+", C.bad], [" jumlah", K.txt]], [["print", K.fn], ["(total)", K.txt]]];
      L.forEach((s, i) => { text(ctx, String(i + 1), x + 30, A.y + 140 + i * 66, 34, { weight: 700, color: C.mute }); codeLine(ctx, s, x + 80, A.y + 140 + i * 66, 46); });
      const ur = pop(b, l, "berjalan");
      if (ur > 0) { ctx.save(); ctx.globalAlpha = clamp(ur, 0, 1); consoleBox(ctx, x, A.y + 440, w, 160, ["5003"], false); ctx.restore();
        ctx.save(); ctx.translate(x + w - 150, A.y + 520); ctx.scale(ur, ur); pill(ctx, "tanpa error", 0, 0, 32, { fill: C.good }); ctx.restore(); }
      const us = pop(b, l, "hasilnya salah");
      if (us > 0) { ctx.save(); ctx.translate(480, A.y + 680); ctx.scale(us, us); ctx.rotate(-0.05); card(ctx, -260, -60, 520, 120, { fill: C.bad, r: 26 }); text(ctx, "Tapi salah!", 0, 26, 70, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
      if (A.bot - (A.y + 760) > 150) bip(ctx, 480, A.bot - 80, 130, { mood: us > 0 ? "wow" : "think", t });
    },
    // struk bakso: + tertukar *, total salah vs total benar
    t15_bakso(ctx, b, l, t, TL, A) {
      const x = A.x + 20, w = 780, uk = ph(b, l, "tanda kali", 0.4), ut = ph(b, l, "tanda tambah", 0.4);
      card(ctx, x, A.y + 20, w, 170, { fill: "#0F1433", stroke: C.line, lw: 4, r: 24 });
      codeLine(ctx, [["total = harga ", K.txt], ["+", C.bad], [" jumlah", K.txt]], x + 40, A.y + 90, 46);
      if (uk > 0) { ctx.save(); ctx.globalAlpha = uk; codeLine(ctx, [["seharusnya: harga ", C.ink2], ["*", C.good], [" jumlah", C.ink2]], x + 40, A.y + 155, 40); ctx.restore(); }
      if (ut > 0) { font(ctx, 46, 800); const px = x + 40 + ctx.measureText("total = harga ").width + 26; ctx.save(); ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.globalAlpha = ut; ctx.beginPath(); ctx.arc(px, A.y + 74, 34, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      // struk
      const sy = A.y + 240, sh = Math.min(520, A.bot - sy - 20);
      card(ctx, x + 90, sy, 600, sh, { fill: "#F4EFE1", r: 12 });
      ctx.fillStyle = "#F4EFE1"; for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.moveTo(x + 90 + i * 30, sy + sh); ctx.lineTo(x + 105 + i * 30, sy + sh + 16); ctx.lineTo(x + 120 + i * 30, sy + sh); ctx.fill(); }
      text(ctx, "WARUNG BAKSO", x + 390, sy + 70, 44, { align: "center", weight: 900, color: C.bg });
      ctx.strokeStyle = "rgba(11,14,42,0.3)"; ctx.setLineDash([8, 8]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 120, sy + 100); ctx.lineTo(x + 660, sy + 100); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "3 × Bakso", x + 130, sy + 170, 40, { weight: 800, color: C.bg }); text(ctx, "@ Rp5.000", x + 650, sy + 170, 40, { weight: 800, color: C.bg, align: "right" });
      const ub = pop(b, l, "lima ribu tiga");
      text(ctx, "Total", x + 130, sy + 270, 48, { weight: 900, color: C.bg });
      if (ub > 0) { ctx.save(); ctx.translate(x + 650, sy + 270); ctx.scale(ub, ub); text(ctx, "Rp5.003", 0, 0, 60, { weight: 900, color: C.bad, align: "right" }); ctx.restore(); }
      if (ub > 0 && sh > 380) { const u2 = pop(b, l, "lima ribu tiga", 0.6); ctx.save(); ctx.globalAlpha = clamp(u2, 0, 1); text(ctx, "seharusnya Rp15.000", x + 390, sy + 360, 40, { align: "center", weight: 800, color: "#1E8A5A" }); ctx.restore(); }
    },
    // bug + uji dengan beberapa contoh
    t15_uji(ctx, b, l, t, TL, A) {
      const ub = pop(b, l, "bug"), ui = pop(b, l, 0.02);
      if (ui > 0) { ctx.save(); ctx.translate(A.x + 120 + (1 - clamp(ui, 0, 1)) * 300, A.y + 110); ctx.scale(ui, ui); bugIcon(ctx, 0, 0, 170, t); ctx.restore(); }
      if (ub > 0) { ctx.save(); ctx.translate(A.x + 250, A.y + 140); ctx.scale(ub, ub); text(ctx, "bug", 0, 0, 90, { weight: 900, color: C.bad }); ctx.restore(); }
      const rows = [["1 bakso", "5.000"], ["2 bakso", "10.000"], ["3 bakso", "15.000"]], top = A.y + 260;
      const uh = ph(b, l, "uji", 0.4);
      if (uh > 0) {
        ctx.save(); ctx.globalAlpha = uh;
        card(ctx, A.x, top, 820, 80, { fill: C.panel2, r: 18 });
        text(ctx, "Contoh", A.x + 30, top + 54, 38, { weight: 900, color: C.kuning }); text(ctx, "Harusnya", A.x + 330, top + 54, 38, { weight: 900, color: C.kuning }); text(ctx, "Hasil", A.x + 610, top + 54, 38, { weight: 900, color: C.kuning });
        ctx.restore();
      }
      rows.forEach(([a, e], i) => {
        const u = pop(b, l, "contoh", 0.2 + i * 0.35); if (u <= 0) return;
        const y = top + 100 + i * 110;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1);
        card(ctx, A.x, y, 820, 96, { fill: C.panel, stroke: C.line, lw: 3, r: 18 });
        text(ctx, a, A.x + 30, y + 62, 40, { weight: 800, color: C.ink }); text(ctx, e, A.x + 330, y + 62, 40, { weight: 800, color: C.ink });
        check(ctx, A.x + 680, y + 48, 54, C.good); ctx.restore();
      });
      if (A.bot - (top + 450) > 150) bip(ctx, 480, A.bot - 80, 130, { mood: "happy", t });
    }
  });
})();
