/* T05 Algoritma itu seperti resep masakan — adegan khusus. Resep tanpa merek. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;
  const STEPS = [["rebus", "Rebus air", "rebus"], ["mi", "Masukkan mi", "masukkan"], ["timer", "Tunggu 3 menit", "tunggu"], ["saring", "Tiriskan", "tiriskan"], ["bumbu", "Campur bumbu", "campur"]];
  const COL = [C.biru, C.kuning, C.pink, C.tosca, C.kuning];

  function noodles(ctx, x, y, w, h, t, col) {     // gumpalan mi bergelombang
    ctx.save(); ctx.strokeStyle = col || "#F6D27A"; ctx.lineWidth = Math.max(3, h * 0.09); ctx.lineCap = "round";
    for (let r = 0; r < 5; r++) {
      ctx.beginPath();
      for (let i = 0; i <= 20; i++) { const xx = x + w * i / 20, yy = y + h * (r + 0.5) / 5 + Math.sin(i * 1.4 + r + t * 3) * h * 0.06; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
    }
    ctx.restore();
  }
  function steam(ctx, x, y, s, t) {
    ctx.save(); ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = s * 0.06; ctx.lineCap = "round";
    for (let k = -1; k <= 1; k++) {
      const ph0 = (t * 0.8 + k * 0.33) % 1; ctx.globalAlpha = 0.7 * (1 - ph0);
      ctx.beginPath(); for (let i = 0; i <= 10; i++) { const yy = y - i * s * 0.05 - ph0 * s * 0.3, xx = x + k * s * 0.25 + Math.sin(i * 0.8 + t * 4) * s * 0.06; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
    }
    ctx.restore();
  }
  // ikon langkah (s = ukuran kotak)
  function icon(ctx, kind, x, y, s, t, on) {
    ctx.save(); ctx.translate(x, y);
    if (kind === "rebus") {
      if (on) steam(ctx, 0, -s * 0.2, s, t);
      ctx.fillStyle = "#9AA6D8"; rr(ctx, -s * 0.38, -s * 0.15, s * 0.76, s * 0.5, s * 0.08); ctx.fill();
      ctx.fillRect(-s * 0.48, -s * 0.12, s * 0.12, s * 0.06); ctx.fillRect(s * 0.36, -s * 0.12, s * 0.12, s * 0.06);
      ctx.fillStyle = C.biru; rr(ctx, -s * 0.34, -s * 0.1, s * 0.68, s * 0.12, s * 0.04); ctx.fill();
      ctx.fillStyle = C.bad; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.2 - s * 0.07, s * 0.45); ctx.quadraticCurveTo(i * s * 0.2, s * (0.3 + 0.04 * Math.sin(t * 9 + i)), i * s * 0.2 + s * 0.07, s * 0.45); ctx.fill(); }
    } else if (kind === "mi") {
      ctx.fillStyle = "#F6D27A"; rr(ctx, -s * 0.36, -s * 0.26, s * 0.72, s * 0.52, s * 0.1); ctx.fill();
      noodles(ctx, -s * 0.32, -s * 0.22, s * 0.64, s * 0.44, on ? t : 0, "#C9952F");
    } else if (kind === "timer") {
      ctx.strokeStyle = C.ink; ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.arc(0, s * 0.04, s * 0.34, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = C.ink; ctx.fillRect(-s * 0.07, -s * 0.42, s * 0.14, s * 0.1);
      const a = on ? t * 2 : 0; ctx.strokeStyle = C.pink; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, s * 0.04); ctx.lineTo(Math.sin(a) * s * 0.24, s * 0.04 - Math.cos(a) * s * 0.24); ctx.stroke();
    } else if (kind === "saring") {
      ctx.fillStyle = "#C7CEEF"; ctx.beginPath(); ctx.arc(0, -s * 0.08, s * 0.34, 0, Math.PI); ctx.fill(); ctx.fillRect(s * 0.3, -s * 0.12, s * 0.22, s * 0.07);
      ctx.fillStyle = C.bg; for (let i = -2; i <= 2; i++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.arc(i * s * 0.1, s * (0.02 + j * 0.1), s * 0.025, 0, Math.PI * 2); ctx.fill(); }
      if (on) { ctx.fillStyle = C.biru; for (let i = 0; i < 3; i++) { const ph0 = (t * 2 + i / 3) % 1; ctx.beginPath(); ctx.arc((i - 1) * s * 0.12, s * (0.3 + ph0 * 0.2), s * 0.035, 0, Math.PI * 2); ctx.fill(); } }
    } else if (kind === "bumbu") {
      ctx.rotate(on ? -0.4 + 0.1 * Math.sin(t * 8) : 0);
      ctx.fillStyle = C.bad; rr(ctx, -s * 0.24, -s * 0.34, s * 0.48, s * 0.62, s * 0.06); ctx.fill();
      ctx.fillStyle = C.kuning; rr(ctx, -s * 0.16, -s * 0.12, s * 0.32, s * 0.2, s * 0.04); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = s * 0.03; ctx.setLineDash([s * 0.04, s * 0.03]); ctx.beginPath(); ctx.moveTo(-s * 0.24, -s * 0.26); ctx.lineTo(s * 0.24, -s * 0.26); ctx.stroke();
      if (on) { ctx.setLineDash([]); ctx.fillStyle = "#E89A3C"; for (let i = 0; i < 6; i++) { const ph0 = (t * 2.2 + i / 6) % 1; ctx.beginPath(); ctx.arc(-s * 0.3 - ph0 * s * 0.1 + rnd(i) * s * 0.1, -s * 0.34 - ph0 * s * 0.1 + ph0 * ph0 * s * 0.8, s * 0.025, 0, Math.PI * 2); ctx.fill(); } }
    }
    ctx.restore();
  }
  function bowl(ctx, x, y, s, t) {
    steam(ctx, x, y - s * 0.32, s, t);
    noodles(ctx, x - s * 0.42, y - s * 0.3, s * 0.84, s * 0.3, t, "#F6D27A");
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.moveTo(x - s * 0.55, y - s * 0.08); ctx.lineTo(x + s * 0.55, y - s * 0.08);
    ctx.quadraticCurveTo(x + s * 0.5, y + s * 0.42, x, y + s * 0.42); ctx.quadraticCurveTo(x - s * 0.5, y + s * 0.42, x - s * 0.55, y - s * 0.08); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(x - s * 0.55, y - s * 0.08, s * 1.1, s * 0.05);
    ctx.fillStyle = "#C2397A"; rr(ctx, x - s * 0.2, y + s * 0.38, s * 0.4, s * 0.08, s * 0.03); ctx.fill();
  }
  // daftar langkah: order = urutan indeks STEPS; active(i) -> 0..1; done(i) -> bool
  function stepList(ctx, A, top, order, ys, opt) {
    const rh = Math.min(160, (A.bot - top - 20) / 5 - 14);
    order.forEach((si, k) => {
      const s = STEPS[si], y = ys ? ys(si, k, rh) : top + k * (rh + 14), on = opt.on ? opt.on(si) : 0, done = opt.done ? opt.done(si) : false;
      const u = opt.show ? opt.show(si, k) : 1; if (u <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - clamp(u, 0, 1)) * -80 + (opt.dx ? opt.dx(si) : 0), 0);
      card(ctx, A.x, y, 820, rh, { fill: on > 0 ? C.panel2 : C.panel, stroke: opt.stroke ? opt.stroke(si) : on > 0 ? COL[si] : C.line, lw: on > 0 ? 6 : 3, r: 22, glow: on > 0 ? "rgba(255,210,63,0.25)" : null });
      ctx.fillStyle = COL[si]; ctx.beginPath(); ctx.arc(A.x + 60, y + rh / 2, 34, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(opt.num ? opt.num(si, k) : k + 1), A.x + 60, y + rh / 2 + 15, 40, { align: "center", weight: 900, color: C.bg });
      icon(ctx, s[0], A.x + 170, y + rh / 2, rh * 0.85, opt.t, on > 0);
      text(ctx, s[1], A.x + 250, y + rh / 2 + 18, 50, { weight: 800, color: C.ink });
      if (done) check(ctx, A.x + 760, y + rh / 2, 50, C.good);
      ctx.restore();
    });
    return rh;
  }

  Object.assign(T.SCENES, {
    // di bawah kait: semangkuk mi yang mengepul = hasil sebuah algoritma
    t05_mi(ctx, b, l, t, TL, A) {
      const s = Math.min(340, A.h * 0.62), u = pop(b, l, 0.05);
      ctx.save(); ctx.translate(380, A.y + A.h * 0.5); ctx.scale(u, u); bowl(ctx, 0, 0, s, t); ctx.restore();
      const ua = pop(b, l, "algoritma");
      if (ua > 0) { ctx.save(); ctx.translate(720, A.y + A.h * 0.3); ctx.rotate(0.1); ctx.scale(ua, ua); pill(ctx, "= algoritma", 0, 0, 44, { fill: C.kuning }); ctx.restore(); }
      bip(ctx, 760, A.y + A.h * 0.68, Math.min(170, A.h * 0.36), { mood: "wow", t, bounce: 1.4 });
    },
    // kartu resep: langkah bernomor muncul berurutan, label "jelas" dan "berurutan"
    t05_resep(ctx, b, l, t, TL, A) {
      const top = A.y + 20, h = Math.min(700, A.h - 170);
      card(ctx, A.x, top, 820, h, { fill: "#F4EFE1", r: 30 });
      text(ctx, "RESEP MI REBUS", A.x + 410, top + 90, 58, { align: "center", weight: 900, color: C.bg });
      ctx.fillStyle = C.pink; ctx.fillRect(A.x + 230, top + 116, 360, 8);
      const rh = (h - 170) / 5;
      STEPS.forEach((s, i) => {
        const u = ph(b, l, 0.05 + i * 0.1, 0.3); if (u <= 0) return;
        const y = top + 160 + i * rh;
        ctx.save(); ctx.globalAlpha = u; ctx.translate((1 - u) * 60, 0);
        text(ctx, (i + 1) + ".", A.x + 60, y + rh * 0.6, 50, { weight: 900, color: COL[i] === C.kuning ? "#C98A00" : COL[i] });
        text(ctx, s[1], A.x + 140, y + rh * 0.6, 50, { weight: 800, color: C.bg });
        icon(ctx, s[0], A.x + 700, y + rh * 0.45, rh * 0.8, t, false);
        ctx.restore();
      });
      const uj = pop(b, l, "jelas"), uo = pop(b, l, "berurutan");
      if (uj > 0) { ctx.save(); ctx.translate(A.x + 200, top + h + 80); ctx.rotate(-0.05); ctx.scale(uj, uj); pill(ctx, "jelas ✓", 0, 0, 50, { fill: C.tosca }); ctx.restore(); }
      if (uo > 0) {
        ctx.save(); ctx.globalAlpha = clamp(uo, 0, 1); arrow(ctx, A.x + 20, top + 180, A.x + 20, top + h - 40, C.pink, 10, 34); ctx.restore();
        ctx.save(); ctx.translate(A.x + 560, top + h + 80); ctx.rotate(0.05); ctx.scale(uo, uo); pill(ctx, "berurutan ↓", 0, 0, 50, { fill: C.pink, color: C.ink }); ctx.restore();
      }
    },
    // langkah dijalankan satu per satu tepat saat disebut
    t05_langkah(ctx, b, l, t, TL, A) {
      const cur = i => cue(b, l, STEPS[i][2]);
      let act = -1; STEPS.forEach((s, i) => { if (cur(i) > 0) act = i; });
      text(ctx, "Menjalankan algoritma", A.x, A.y + 56, 50, { weight: 900, color: C.kuning });
      stepList(ctx, A, A.y + 90, [0, 1, 2, 3, 4], null, { t, on: i => i === act ? 1 : 0, done: i => i < act, show: i => pop(b, l, Math.max(0, cueFrac(b, STEPS[i][2]) - 0.06)) });
      if (act === 4 && cur(4) > 1) { const u = pop(b, l, 0.97); if (u > 0) { ctx.save(); ctx.translate(780, A.y + 50); ctx.scale(u, u); pill(ctx, "Siap makan!", 0, 0, 38, { fill: C.tosca }); ctx.restore(); } }
    },
    // urutan ditukar: "Tiriskan" naik ke atas sebelum "Rebus air" -> kacau
    t05_salah(ctx, b, l, t, TL, A) {
      const k = ease(cue(b, l, "ditukar") / 0.7), bad = cue(b, l, "kacau") > 0;
      text(ctx, "Urutan ditukar", A.x, A.y + 56, 50, { weight: 900, color: C.bad });
      const top = A.y + 90, rh0 = Math.min(160, (A.bot - top - 20) / 5 - 14);
      const pos = { 0: lerp(0, 1, k), 1: 2, 2: 3, 3: lerp(3, 0, k), 4: 4 };
      // urutan saat ditukar: 3 (tiriskan) ke atas, 0 (rebus) turun ke posisi 1; sisanya tetap
      const P = si => si === 3 ? lerp(3, 0, k) : si === 0 ? lerp(0, 1, k) : si === 1 ? lerp(1, 2, k) : si === 2 ? lerp(2, 3, k) : 4;
      stepList(ctx, A, top, [0, 1, 2, 3, 4], (si, kk, rh) => top + P(si) * (rh + 14), {
        t, on: si => si === 3 && k > 0 ? 1 : 0, num: si => Math.round(P(si)) + 1,
        stroke: si => bad && (si === 3 || si === 0) ? C.bad : si === 3 && k > 0 ? C.kuning : C.line,
        dx: si => si === 3 ? Math.sin(k * Math.PI) * 120 : 0
      });
      if (bad) {
        const u = pop(b, l, "kacau");
        ctx.save(); ctx.translate(480, top + 2.5 * (rh0 + 14)); ctx.rotate(-0.12); ctx.scale(u, u);
        card(ctx, -230, -70, 460, 140, { fill: C.bad, r: 24, glow: "rgba(255,90,95,0.6)" });
        text(ctx, "KACAU!", 0, 32, 90, { align: "center", weight: 900, color: C.ink }); ctx.restore();
      }
      const um = ph(b, l, "misalnya", 0.4);
      if (um > 0 && !bad) { ctx.save(); ctx.globalAlpha = um; bip(ctx, 820, top + 30, 110, { mood: "think", t }); ctx.restore(); }
    },
    // perintah samar vs perintah jelas
    t05_jelas(ctx, b, l, t, TL, A) {
      const half = (A.h - 60) / 2, ua = pop(b, l, "masak sebentar"), ub = pop(b, l, "tunggu tiga menit");
      if (ub <= 0) bip(ctx, 480, A.cy, Math.min(320, A.h * 0.4), { mood: "think", t, bounce: 1 });
      // perintah jelas (atas)
      if (ub > 0) {
        ctx.save(); ctx.globalAlpha = clamp(ub, 0, 1); ctx.translate(0, (1 - ub) * 50);
        card(ctx, A.x, A.y, 820, half, { fill: C.goodBg, stroke: C.good, lw: 6 });
        text(ctx, "“Tunggu 3 menit”", A.x + 40, A.y + 90, 60, { weight: 900, color: C.ink, fit: 600 });
        const left = Math.max(0, 180 - Math.max(0, cue(b, l, "tunggu tiga menit")) * 20), mm = Math.floor(left / 60), ss = Math.floor(left % 60);
        text(ctx, mm + ":" + String(ss).padStart(2, "0"), A.x + 300, A.y + half * 0.5 + 100, 150, { align: "center", weight: 900, color: C.good, shadow: true });
        icon(ctx, "timer", A.x + 660, A.y + half * 0.55 + 20, 200, t, true);
        check(ctx, A.x + 760, A.y + 70, 60, C.good);
        ctx.restore();
      }
      // perintah samar (bawah)
      if (ua > 0) {
        const y = A.y + half + 60;
        ctx.save(); ctx.globalAlpha = clamp(ua, 0, 1); ctx.translate(0, (1 - ua) * 50);
        card(ctx, A.x, y, 820, half, { fill: C.badBg, stroke: C.bad, lw: 6 });
        text(ctx, "“Masak sebentar”", A.x + 40, y + 90, 60, { weight: 900, color: C.ink, fit: 600 });
        cross(ctx, A.x + 760, y + 70, 60, C.bad);
        ["1 menit?", "10 menit?", "30 detik?"].forEach((s, i) => {
          const u = pop(b, l, "sebentar", 0.45 + i * 0.25); if (u <= 0) return;
          ctx.save(); ctx.translate(A.x + 150 + i * 200, y + half * 0.62 + Math.sin(t * 3 + i) * 12); ctx.rotate((i - 1) * 0.1); ctx.scale(u, u); pill(ctx, s, 0, 0, 36, { fill: C.panel2, color: C.ink }); ctx.restore();
        });
        ctx.restore();
        bip(ctx, A.x + 700, y + half - 70, 110, { mood: "think", t });
      }
    },
    // resep berubah menjadi kode di jendela editor generik
    t05_kode(ctx, b, l, t, TL, A) {
      const code = ['rebus("air")', 'masukkan("mi")', "tunggu(3)", "tiriskan()", 'campur("bumbu")'];
      const top = A.y + 20, h = Math.min(720, A.h - 40), k = ph(b, l, "ditulis", 0.6);
      card(ctx, A.x, top, 820, h, { fill: "#0F1433", stroke: C.line, lw: 4, r: 26 });
      card(ctx, A.x, top, 820, 80, { fill: C.panel2, r: 26 }); ctx.fillStyle = C.panel2; ctx.fillRect(A.x, top + 50, 820, 30);
      [C.bad, C.kuning, C.good].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(A.x + 40 + i * 40, top + 40, 12, 0, Math.PI * 2); ctx.fill(); });
      text(ctx, k > 0.5 ? "program.py" : "resep.txt", A.x + 410, top + 52, 36, { align: "center", weight: 800, color: C.ink2 });
      const rh = (h - 120) / 5;
      STEPS.forEach((s, i) => {
        const u = ph(b, l, 0.03 + i * 0.06, 0.3); if (u <= 0) return;
        const y = top + 110 + i * rh + rh * 0.55, ki = clamp((k * 1.6 - i * 0.15), 0, 1);
        text(ctx, String(i + 1), A.x + 40, y, 40, { weight: 700, color: C.mute });
        ctx.save(); ctx.globalAlpha = u * (1 - ki); text(ctx, s[1], A.x + 100, y, 52, { weight: 800, color: C.ink }); ctx.restore();
        if (ki > 0) { ctx.save(); ctx.globalAlpha = ki; ctx.translate((1 - ki) * 40, 0);
          const c = code[i], p = c.indexOf("(");
          text(ctx, c.slice(0, p), A.x + 100, y, 52, { weight: 800, color: C.tosca });
          ctx.font = "800 52px Inter"; const w1 = ctx.measureText(c.slice(0, p)).width;
          text(ctx, c.slice(p), A.x + 100 + w1, y, 52, { weight: 800, color: C.kuning }); ctx.restore(); }
      });
      const ub = pop(b, l, "dimengerti");
      if (ub > 0 && A.bot - (top + h) > 120) { ctx.save(); ctx.translate(480, top + h + (A.bot - top - h) / 2); ctx.scale(ub, ub); pill(ctx, "Komputer menjalankannya ✓", 0, 0, 40, { fill: C.tosca }); ctx.restore(); }
      else if (ub > 0) { ctx.save(); ctx.translate(A.x + 640, top + h - 60); ctx.scale(ub, ub); bip(ctx, 0, 0, 120, { mood: "happy", t }); ctx.restore(); }
    }
  });
  // pecahan letak kata dalam teks beat (untuk isyarat sedikit lebih awal)
  function cueFrac(b, w) { const i = b.text.toLowerCase().indexOf(w); return i < 0 ? 0 : i / b.text.length; }
})();
