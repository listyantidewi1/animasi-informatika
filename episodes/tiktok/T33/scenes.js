/* T33 Deepfake: wajah dan suara yang bisa dipalsukan — adegan khusus. Semua nama, wajah, dan pesan rekaan. */
(function () {
  const T = TikTok, C = T.C, { rr, text, card, pill, arrow, check, cross, bip, bubble, ease, clamp, lerp, back, rnd, cue, ph, pop } = T.helpers;

  // wajah orang sederhana (digambar kode); opt.talk 0..1 = mulut terbuka, opt.mesh = jaring titik "AI" di atas wajah
  function face(ctx, cx, cy, s, opt = {}) {
    const skin = opt.skin || "#C98B62", hair = opt.hair || "#2B1B14";
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = opt.shirt || C.biru; ctx.beginPath(); ctx.ellipse(0, s * 0.62, s * 0.5, s * 0.3, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = skin; ctx.fillRect(-s * 0.09, s * 0.18, s * 0.18, s * 0.18);
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.3, s * 0.36, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-s * 0.3, s * 0.02, s * 0.05, s * 0.08, 0, 0, Math.PI * 2); ctx.ellipse(s * 0.3, s * 0.02, s * 0.05, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(0, -s * 0.2, s * 0.33, s * 0.2, 0, Math.PI, 0); ctx.lineTo(s * 0.33, -s * 0.1); ctx.quadraticCurveTo(0, -s * 0.24, -s * 0.33, -s * 0.1); ctx.fill();
    const blink = ((opt.t || 0) % 2.9) > 2.8;
    ctx.fillStyle = "#1A1020";
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * s * 0.11, -s * 0.02, s * 0.035, blink ? s * 0.006 : s * 0.045, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = "#1A1020"; ctx.lineWidth = s * 0.02; ctx.lineCap = "round";
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * s * 0.06, -s * 0.11); ctx.lineTo(k * s * 0.16, -s * 0.12); ctx.stroke(); }
    const mo = clamp(opt.talk || 0, 0, 1);
    ctx.fillStyle = "#6B1E2E"; ctx.beginPath(); ctx.ellipse(0, s * 0.17, s * 0.09, s * (0.015 + 0.05 * mo), 0, 0, Math.PI * 2); ctx.fill();
    if (opt.mesh > 0) {
      ctx.globalAlpha = opt.mesh; ctx.strokeStyle = C.tosca; ctx.fillStyle = C.tosca; ctx.lineWidth = 2;
      const P = []; for (let i = 0; i < 26; i++) { const a = rnd(i + 3) * Math.PI * 2, r = Math.sqrt(rnd(i + 40)) * 0.95; P.push([Math.cos(a) * r * s * 0.29, Math.sin(a) * r * s * 0.34]); }
      ctx.beginPath(); P.forEach((p, i) => { const q = P[(i * 7 + 3) % P.length], q2 = P[(i + 1) % P.length]; ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q2[0], q2[1]); }); ctx.stroke();
      P.forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, Math.PI * 2); ctx.fill(); });
    }
    ctx.restore();
  }
  function wave(ctx, x, y, w, h, n, t, col, prog) {     // gelombang suara: batang naik-turun; prog = bagian yang sudah diputar
    const bw = w / n;
    for (let i = 0; i < n; i++) {
      const a = 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + t * 6) * rnd(i + 9));
      ctx.fillStyle = prog === undefined || i / n < prog ? col : "rgba(184,192,238,0.35)";
      rr(ctx, x + i * bw + bw * 0.2, y - h * a / 2, bw * 0.6, h * a, bw * 0.3); ctx.fill();
    }
  }
  function phone(ctx, x, y, w, h) {
    card(ctx, x, y, w, h, { fill: "#05071A", stroke: C.line, lw: 6, r: w * 0.12 });
    const s = { x: x + w * 0.05, y: y + w * 0.1, w: w * 0.9, h: h - w * 0.17 };
    card(ctx, s.x, s.y, s.w, s.h, { fill: C.bg2, r: w * 0.07 }); return s;
  }
  function stamp(ctx, s, x, y, u, col, size = 64) {
    if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(-0.1); ctx.scale(u, u);
    T.helpers.font(ctx, size, 900); const w = ctx.measureText(s).width + 70;
    card(ctx, -w / 2, -size * 0.85, w, size * 1.6, { fill: col, r: 20 });
    text(ctx, s, 0, size * 0.33, size, { align: "center", weight: 900, color: C.ink }); ctx.restore();
  }

  Object.assign(T.SCENES, {
    // kait: panggilan video "Raka" yang sedang bicara; garis pindai lewat dan menampakkan jaring AI
    t33_wajah(ctx, b, l, t, TL, A) {
      const h = Math.min(620, A.h - 20), w = Math.min(720, h * 1.1), x = 480 - w / 2, y = A.y + (A.h - h) / 2;
      card(ctx, x, y, w, h, { fill: "#2A2F6E", stroke: C.line, lw: 5, r: 34 });
      const g = Math.sin(l * 37) > 0.85 && l > 1.4 ? 8 : 0;   // sesekali bergetar seperti video palsu
      face(ctx, 480 + g, y + h * 0.48, h * 0.62, { t, talk: Math.abs(Math.sin(l * 9)), mesh: ph(b, l, "padahal", 0.6), shirt: C.pink });
      pill(ctx, "Raka", x + 100, y + 50, 32, { fill: "rgba(11,14,42,0.8)", color: C.ink });
      ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(x + w - 50, y + 50, 12 + Math.sin(l * 6) * 3, 0, Math.PI * 2); ctx.fill();
      wave(ctx, x + w * 0.25, y + h - 55, w * 0.5, 50, 18, t, C.tosca);
      const sc = cue(b, l, "padahal") / 0.8;
      if (sc > 0 && sc < 1) { ctx.fillStyle = "rgba(34,227,196,0.8)"; ctx.fillRect(x + 6, y + h * sc, w - 12, 8); }
      stamp(ctx, "BUATAN AI", 480, y + h - 140, pop(b, l, "dibuat oleh"), C.bad, 60);
    },
    // AI belajar dari banyak foto dan rekaman, lalu membuat wajah tiruan
    t33_belajar(ctx, b, l, t, TL, A) {
      const cols = ["#C98B62", "#B57B55", "#D29A70"], sh = [C.pink, C.biru, C.tosca];
      for (let i = 0; i < 6; i++) {
        const u = pop(b, l, (i * 0.03) + 0.32); if (u <= 0) continue;
        const px = A.x + 10 + (i % 3) * 140, py = A.y + 10 + Math.floor(i / 3) * 150;
        ctx.save(); ctx.translate(px + 60, py + 65); ctx.scale(u, u);
        card(ctx, -60, -65, 120, 130, { fill: C.panel2, r: 14 });
        ctx.beginPath(); rr(ctx, -60, -65, 120, 130, 14); ctx.clip();
        face(ctx, (i % 2 ? 8 : -8), 0, 120, { skin: cols[i % 3], shirt: sh[i % 3], t: i });
        ctx.restore();
      }
      const ur = pop(b, l, "rekaman");
      if (ur > 0) { ctx.save(); ctx.globalAlpha = clamp(ur, 0, 1);
        card(ctx, A.x + 450, A.y + 40, 370, 230, { fill: C.panel, stroke: C.line, lw: 4, r: 24 });
        text(ctx, "Rekaman suara", A.x + 635, A.y + 95, 34, { align: "center", weight: 800, color: C.ink2 });
        wave(ctx, A.x + 480, A.y + 180, 310, 100, 16, t, C.kuning); ctx.restore(); }
      // kotak AI di tengah
      const ay = A.y + 360, ua = pop(b, l, "mempelajari");
      if (ua > 0) {
        for (let i = 0; i < 6; i++) {    // titik data mengalir masuk
          const k = ((l * 0.9 + i / 6) % 1); ctx.fillStyle = [C.pink, C.kuning, C.tosca][i % 3];
          ctx.beginPath(); ctx.arc(lerp(A.x + 80 + (i % 3) * 300, 480, k), lerp(A.y + 300, ay + 80, k), 10, 0, Math.PI * 2); ctx.fill();
        }
        ctx.save(); ctx.translate(480, ay + 90); ctx.scale(ua, ua);
        card(ctx, -170, -80, 340, 160, { fill: C.panel2, stroke: C.tosca, lw: 6, r: 30, glow: "rgba(34,227,196,0.4)" });
        ctx.save(); ctx.translate(-95, 0); ctx.rotate(l * 2); ctx.fillStyle = C.tosca;
        for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); ctx.fillRect(-8, -40, 16, 16); }
        ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        text(ctx, "AI", 45, 30, 90, { align: "center", weight: 900, color: C.ink }); ctx.restore();
      }
      // hasil tiruan
      const um = pop(b, l, "meniru"), oy = ay + 200;
      if (um > 0) {
        arrow(ctx, 480, ay + 175, 480, oy + 20, C.ink2, 8, 26);
        ctx.save(); ctx.translate(480, oy + 150); ctx.scale(um, um);
        card(ctx, -160, -130, 320, 260, { fill: "#2A2F6E", stroke: C.pink, lw: 6, r: 24 });
        ctx.beginPath(); rr(ctx, -160, -130, 320, 260, 24); ctx.clip();
        face(ctx, 0, 10, 220, { skin: cols[0], shirt: C.pink, talk: Math.abs(Math.sin(l * 9)), mesh: 0.5, t });
        ctx.restore();
        pill(ctx, "TIRUAN", 480 + 200, oy + 60, 34, { fill: C.pink, color: C.ink });
      }
    },
    // pesan suara palsu yang terdengar panik, minta uang
    t33_pesan(ctx, b, l, t, TL, A) {
      const h = Math.min(860, A.h - 10), w = 540, x = A.x + 20, y = A.y + (A.h - h) / 2, s = phone(ctx, x, y, w, h);
      card(ctx, s.x, s.y, s.w, 100, { fill: C.panel2, r: 30 });
      ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(s.x + 60, s.y + 50, 30, 0, Math.PI * 2); ctx.fill();
      text(ctx, "Kak Nadia", s.x + 110, s.y + 62, 38, { weight: 900, color: C.ink });
      const uv = pop(b, l, 0.02);
      if (uv > 0) {   // gelembung pesan suara
        const by = s.y + 140; ctx.save(); ctx.globalAlpha = clamp(uv, 0, 1);
        card(ctx, s.x + 20, by, s.w - 80, 120, { fill: C.panel, r: 30 });
        ctx.fillStyle = C.tosca; ctx.beginPath(); ctx.arc(s.x + 80, by + 60, 34, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.bg; ctx.beginPath(); ctx.moveTo(s.x + 70, by + 42); ctx.lineTo(s.x + 96, by + 60); ctx.lineTo(s.x + 70, by + 78); ctx.closePath(); ctx.fill();
        wave(ctx, s.x + 130, by + 60, s.w - 220, 60, 14, t, C.tosca, clamp(cue(b, l, 0.1) / 3, 0, 1)); ctx.restore();
      }
      const um = pop(b, l, "meminta uang");
      if (um > 0) { const by = s.y + 300; ctx.save(); ctx.globalAlpha = clamp(um, 0, 1); ctx.translate(0, (1 - um) * 30);
        card(ctx, s.x + 20, by, s.w - 60, 190, { fill: C.panel, r: 30 });
        T.helpers.para(ctx, "Tolong transfer uang sekarang, ya! Aku lagi darurat!", s.x + 45, by + 60, 36, s.w - 110, { weight: 700, color: C.ink, em: ["transfer", "uang", "sekarang,", "darurat!"] });
        ctx.restore(); }
      // peringatan di kanan
      const up = pop(b, l, "panik");
      if (up > 0) {
        ctx.save(); ctx.translate(745, A.y + A.h * 0.32); ctx.scale(up, up);
        ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.moveTo(0, -95); ctx.lineTo(95, 75); ctx.lineTo(-95, 75); ctx.closePath(); ctx.fill();
        text(ctx, "!", 0, 55, 120, { align: "center", weight: 900, color: C.bg }); ctx.restore();
        text(ctx, "Suara", 745, A.y + A.h * 0.32 + 150, 40, { align: "center", weight: 900, color: C.kuning });
        text(ctx, "tiruan", 745, A.y + A.h * 0.32 + 195, 40, { align: "center", weight: 900, color: C.kuning });
      }
      bip(ctx, 745, A.y + A.h * 0.78, 190, { mood: up > 0 ? "wow" : "think", t, look: [-0.8, 0] });
    },
    // cek dulu: telepon nomor yang tersimpan sendiri
    t33_cek(ctx, b, l, t, TL, A) {
      const u0 = pop(b, l, 0);
      if (u0 > 0) { ctx.save(); ctx.translate(480, A.y + 80); ctx.scale(u0, u0);
        pill(ctx, "Jangan langsung percaya!", 0, 0, 52, { fill: C.kuning }); ctx.restore(); }
      const uc = pop(b, l, "hubungi"), h = Math.min(700, A.h - 200), w = 420, x = A.x + 30, y = A.y + 170;
      if (uc > 0) {
        ctx.save(); ctx.globalAlpha = clamp(uc, 0, 1);
        const s = phone(ctx, x, y, w, h);
        text(ctx, "Memanggil…", s.x + s.w / 2, s.y + 70, 34, { align: "center", weight: 700, color: C.ink2 });
        for (let k = 0; k < 3; k++) {   // gelombang panggilan
          const r = 80 + ((l * 60 + k * 40) % 120); ctx.strokeStyle = `rgba(34,227,196,${1 - (r - 80) / 120})`; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.arc(s.x + s.w / 2, s.y + 230, r, 0, Math.PI * 2); ctx.stroke(); }
        ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(s.x + s.w / 2, s.y + 230, 80, 0, Math.PI * 2); ctx.fill();
        text(ctx, "N", s.x + s.w / 2, s.y + 260, 80, { align: "center", weight: 900, color: C.ink });
        text(ctx, "Kak Nadia", s.x + s.w / 2, s.y + 400, 44, { align: "center", weight: 900, color: C.ink });
        const ut = ph(b, l, "simpan");
        if (ut > 0) { ctx.globalAlpha = clamp(uc, 0, 1) * ut; pill(ctx, "Nomor tersimpan", s.x + s.w / 2, s.y + 465, 30, { fill: C.tosca }); }
        ctx.globalAlpha = clamp(uc, 0, 1);
        ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(s.x + s.w / 2, s.y + s.h - 80, 46, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      const ur = pop(b, l, "sendiri");
      if (ur > 0) { ctx.save(); ctx.globalAlpha = clamp(ur, 0, 1);
        bubble(ctx, "Hah? Aku tidak pernah kirim pesan itu!", 500, A.y + 520, 360, 38, { tailX: 560, em: ["tidak"] }); ctx.restore(); }
      bip(ctx, 690, A.y + 680, 200, { mood: ur > 0 ? "happy" : "think", t, look: [-0.7, 0] });
    }
  });
})();
