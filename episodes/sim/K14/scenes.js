/* K14 Simulasi konsep: verifikasi dua langkah melawan penipu. Seseorang mencoba masuk ke akun sekolah Sinta dengan sandi yang bocor;
   lapis kedua (kode OTP lewat SMS, aplikasi autentikator, notifikasi persetujuan) menahannya; kode cadangan saat HP hilang.
   Tidak memperagakan cara penipu bekerja; hanya "seseorang mencoba masuk dengan sandimu". Semua akun, kode, dan tempat rekaan.
   Memakai Kiko.hp (layar_hp.js) untuk HP Sinta dan K.jaringan (D9.2) untuk laptop dan server.
   Adegan baru berawalan k14_ (video) dan k14s_ (Short, area 40–1040 × 20–810).
   Kunci beat: mode (sandi/otp/app/notif), after (keadaan akhir), v (variasi), pilih (pilihan tebakan), cues (awal tiap langkah). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan, HP = K.hp;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;

  // ---------- waktu ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * A(b); };
  function cues(b, n, def) {
    if (b.cues && b.cues.length >= n && b.cues.every(c => b.text.indexOf(c) >= 0)) return b.cues.slice(0, n).map(c => at(b, c));
    const fr = b.fr || def; return Array.from({ length: n }, (_, i) => lead(b) + (fr[i] != null ? fr[i] : 0.2 + 0.6 * i / n) * A(b));
  }

  // ---------- pembantu gambar ----------
  const heading = (ctx, s, y = 205) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 900, fit: 1600 });
  const banner = (ctx, s, y, opt = {}) => { const w = opt.w || 1300; card(ctx, 960 - w / 2, y, w, 72, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 3, r: 16 }); text(ctx, s, 960, y + 47, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  const chip = (ctx, s, cx, cy, opt = {}) => { ctx.font = `900 ${opt.size || 20}px Inter`; const w = opt.w || ctx.measureText(s).width + 28, h = opt.h || (opt.size || 20) + 16; card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: opt.fill || C.goodBg, stroke: opt.stroke, lw: 2, r: h / 2 }); text(ctx, s, cx, cy + (opt.size || 20) * 0.36, opt.size || 20, { align: "center", weight: 900, color: opt.color || C.good }); return w; };
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  function arrow(ctx, x1, y1, x2, y2, col, lw = 5) {
    const a = Math.atan2(y2 - y1, x2 - x1), hs = lw * 3.2;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * hs * 0.8, y2 - Math.sin(a) * hs * 0.8); ctx.stroke(); ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - Math.cos(a - 0.45) * hs, y2 - Math.sin(a - 0.45) * hs); ctx.lineTo(x2 - Math.cos(a + 0.45) * hs, y2 - Math.sin(a + 0.45) * hs); ctx.closePath(); ctx.fill();
  }
  const codeAt = i => String((i * 7919 + 482913) % 900000 + 100000);
  const fmt = c => c.slice(0, 3) + " " + c.slice(3);
  const MODE = {
    sandi: { head: "HANYA DENGAN SANDI", g2: null, g2ic: "", log: ["Sandi dikirim dari perangkat tak dikenal.", "Server mencocokkan sandi: cocok.", "Tidak ada lapis kedua: akun terbuka."] },
    otp: { head: "LAPIS KEDUA: KODE OTP LEWAT SMS", g2: "kode SMS", g2ic: "💬", log: ["Sandi cocok.", "Server mengirim kode ke HP Sinta.", "Orang itu tidak punya kodenya: tertahan."] },
    app: { head: "LAPIS KEDUA: APLIKASI AUTENTIKATOR", g2: "kode aplikasi", g2ic: "🔢", log: ["Sandi cocok.", "Server meminta kode dari aplikasi di HP Sinta.", "Kode tidak pernah dikirim: tertahan."] },
    notif: { head: "LAPIS KEDUA: NOTIFIKASI PERSETUJUAN", g2: "persetujuan", g2ic: "✅", log: ["Sandi cocok.", "Server bertanya ke HP Sinta: Apakah ini kamu?", "Sinta menekan Tolak: percobaan diblokir."] }
  };
  // keadaan alur: k = langkah tercapai (0..3), u = kemajuan sejak langkah terakhir
  function alur(b, l) {
    if (b.after) return { k: 3, u: 1, since: 99, c: [0, 0, 0] };
    const c = cues(b, 3, [0.2, 0.5, 0.8]); let k = 0; c.forEach(t => { if (l >= t) k++; });
    return { k, u: k ? clamp((l - c[k - 1]) / 0.9, 0, 1) : 0, since: k ? l - c[k - 1] : 0, c };
  }
  function gate(ctx, x, y, label, ic, st, o = {}) {
    // st: null | "ok" | "stop" | "none"
    const w = 150, h = 210;
    if (st === "none") { ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 3; rr(ctx, x - w / 2, y, w, h, 18); ctx.stroke(); ctx.restore(); text(ctx, "tidak ada", x, y + h / 2 + 8, 22, { align: "center", weight: 800, color: C.muted || C.ink2 }); }
    else {
      card(ctx, x - w / 2, y, w, h, { fill: st === "ok" ? C.goodBg : st === "stop" ? C.badBg : "#F4F8FB", stroke: st === "ok" ? C.good : st === "stop" ? C.bad : "#8AA0AE", lw: 5, r: 18 });
      text(ctx, ic, x, y + 92, 58, { align: "center" });
      if (st === "ok") text(ctx, "✓", x, y + 172, 44, { align: "center", weight: 900, color: C.good });
      if (st === "stop") text(ctx, "✕", x, y + 172, 44, { align: "center", weight: 900, color: C.bad });
    }
    text(ctx, label, x, y + h + 34, o.fs || 22, { align: "center", weight: 900, color: C.ink2, fit: 220 });
  }
  function account(ctx, x, y, w, st) {
    card(ctx, x, y, w, 210, { fill: st === "open" ? C.badBg : st === "safe" ? C.goodBg : "#fff", stroke: st === "open" ? C.bad : st === "safe" ? C.good : "#B7C4CC", lw: st ? 5 : 3, r: 18 });
    text(ctx, "👤", x + w / 2, y + 70, 50, { align: "center" });
    text(ctx, "akun sekolah", x + w / 2, y + 118, 22, { align: "center", weight: 900 });
    text(ctx, "sinta@sekolah.example", x + w / 2, y + 148, 17, { align: "center", weight: 700, color: C.ink2, fit: w - 20 });
    if (st === "open") text(ctx, "TERBUKA!", x + w / 2, y + 190, 24, { align: "center", weight: 900, color: C.bad });
    if (st === "safe") text(ctx, "AMAN", x + w / 2, y + 190, 24, { align: "center", weight: 900, color: C.good });
  }
  // baris alur: penyusup → lapis 1 → lapis 2 → akun, digambar di bingkai lokal 1100×320 (x0, y0, skala s)
  function row(ctx, x0, y0, s, mode, S) {
    const M = MODE[mode];
    ctx.save(); ctx.translate(x0, y0); ctx.scale(s, s);
    J.laptop(ctx, 110, 110, 150);
    text(ctx, "seseorang", 110, 205, 22, { align: "center", weight: 900 }); text(ctx, "di kota lain", 110, 232, 20, { align: "center", weight: 800, color: C.ink2 });
    chip(ctx, "🔑 punya sandi Sinta", 110, 280, { size: 18, fill: "#FFF3D6", stroke: C.accent, color: C.accentDark });
    const sd = mode === "sandi", g1 = sd ? (S.k >= 3 || (S.k >= 2 && S.u >= 0.8) ? "ok" : null) : (S.k >= 2 || (S.k >= 1 && S.u >= 1) ? "ok" : null);
    let g2 = mode === "sandi" ? "none" : null; if (mode !== "sandi" && S.k >= 3 && S.u > 0.3) g2 = "stop";
    gate(ctx, 430, 10, "lapis 1: sandi", "🔑", g1);
    gate(ctx, 660, 10, mode === "sandi" ? "lapis 2" : "lapis 2: " + M.g2, M.g2ic, g2);
    const open = mode === "sandi" && S.k >= 3 && S.u > 0.6;
    account(ctx, 830, 10, 250, open ? "open" : mode !== "sandi" && S.k >= 3 && S.u > 0.6 ? "safe" : null);
    // token kunci bergerak
    let tx = 270, ty = 115;
    if (sd) { if (S.k === 1) tx = lerp(270, 300, ease(Math.min(1, S.u * 1.4))); if (S.k >= 2) tx = lerp(300, 545, ease(Math.min(1, S.k > 2 ? 1 : S.u * 1.4))); }
    else { if (S.k === 1) tx = lerp(270, 545, ease(Math.min(1, S.u * 1.4))); if (S.k >= 2) tx = 545; }
    if (S.k >= 3 && mode === "sandi") tx = lerp(545, 900, ease(Math.min(1, S.u * 1.4)));
    if (!(mode === "sandi" && S.k >= 3 && S.u >= 0.7)) { ctx.fillStyle = "#FFF3D6"; ctx.beginPath(); ctx.arc(tx, ty, 30, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.stroke(); text(ctx, "🔑", tx, ty + 12, 32, { align: "center" }); }
    if (mode !== "sandi" && S.k >= 3) chip(ctx, "tertahan", 545, 40, { size: 22, fill: C.badBg, stroke: C.bad, color: C.bad });
    ctx.restore();
  }
  // HP Sinta
  function lock(ctx, sub) {
    ctx.fillStyle = "#24323C"; ctx.fillRect(0, 0, HP.W, HP.H);
    text(ctx, "21.14", HP.W / 2, 190, 76, { align: "center", weight: 800, color: "#FFFFFF" });
    text(ctx, "Selasa, 4 November", HP.W / 2, 232, 20, { align: "center", weight: 700, color: "#C9D6DE" });
    if (sub) text(ctx, sub, HP.W / 2, 600, 18, { align: "center", weight: 700, color: "#9FB3BF" });
  }
  function phone(ctx, cx, cy, h, mode, S, l, o = {}) {
    const dark = mode !== "app";
    let tapAt = null;
    const ph = HP.phone(ctx, cx, cy, { h, time: "21.14", dark, bg: dark ? "#24323C" : undefined }, (ctx, ph) => {
      if (mode === "sandi") { lock(ctx, "tidak ada pemberitahuan"); }
      else if (mode === "otp") { lock(ctx); if (S.k >= 2) HP.notif(ctx, { app: "SMS", icon: "chat", color: "#2E8B57", title: "Kode masuk: " + fmt(codeAt(3)), body: "Jangan berikan kode ini kepada siapa pun.", time: "21.14" }, S.k > 2 ? 1 : S.u * 1.6); }
      else if (mode === "app") {
        ctx.fillStyle = HP.UI.bg; ctx.fillRect(0, 0, HP.W, HP.H);
        const t = l * 3 + 12, T = HP.totp(t, 30);
        HP.auth(ctx, { title: "Autentikator", accounts: [{ issuer: "Akun sekolah", user: "sinta@sekolah.example", code: codeAt(T.idx), secs: T.secs, period: 30, hl: S.k >= 2 }] });
        text(ctx, "kode baru setiap 30 detik", HP.W / 2, 330, 18, { align: "center", weight: 700, color: HP.UI.ink2 });
        text(ctx, "bisa tanpa internet", HP.W / 2, 356, 18, { align: "center", weight: 700, color: HP.UI.ink2 });
      } else {
        lock(ctx);
        const shown = S.k >= 1 ? clamp((S.k > 1 ? 1 : S.u * 1.5), 0, 1) : 0;
        const tolak = S.k >= 2 && (S.k > 2 || S.u > 0.35);
        if (S.k < 3 || S.u < 0.4) {
          const d = HP.dialog(ctx, { icon: "shield", iconColor: HP.UI.primary, title: "Apakah ini kamu?", body: "Ada yang mencoba masuk ke akun sekolahmu dari perangkat baru di Kota Lain, pukul 21.14.", buttons: ["Ya, ini saya", "Tolak"], stack: true, hl: tolak ? 1 : null, danger: 1, u: shown });
          if (S.k === 2 && d.buttons[1]) HP.tap(ctx, d.buttons[1].cx, d.buttons[1].cy, clamp(S.u * 1.3, 0, 1));
        } else {
          HP.toast(ctx, "Percobaan masuk diblokir", 0.5, { y: 420 });
        }
      }
    });
    return ph;
  }
  // panel besar di samping HP: isi layar HP yang sedang penting, dengan huruf besar
  function callout(ctx, x, y, w, mode, S, l, o = {}) {
    const box = (h, fill, stroke) => card(ctx, x, y, w, h, { fill, stroke, lw: 4, r: 18 });
    const cx = x + w / 2;
    if (mode === "sandi") { box(200, "#F1F4F2", "#B7C4CC"); text(ctx, "🔕", cx, y + 70, 48, { align: "center" }); para(ctx, "Tidak ada pemberitahuan. Sinta tidak tahu apa-apa.", cx, y + 125, 24, w - 40, { align: "center", weight: 900, color: C.ink2, lh: 1.2 }); return; }
    if (mode === "otp") { if (S.k < 2) return; const u = S.k > 2 ? 1 : clamp(S.u * 1.6, 0, 1); ctx.save(); ctx.globalAlpha = u;
      box(300, "#fff", "#2E8B57"); text(ctx, "💬 SMS · 21.14", x + 22, y + 44, 22, { weight: 900, color: "#2E8B57" }); text(ctx, "Kode masuk:", x + 22, y + 94, 24, { weight: 800 });
      text(ctx, fmt(codeAt(3)), cx, y + 162, 56, { align: "center", weight: 900, color: C.kiko }); para(ctx, "Jangan berikan kode ini kepada siapa pun.", cx, y + 214, 23, w - 40, { align: "center", weight: 900, color: C.bad, lh: 1.2 }); ctx.restore(); return; }
    if (mode === "app") { const T = HP.totp(l * 3 + 12, 30); box(300, "#fff", HP.UI.primary); text(ctx, "🔢 Autentikator", x + 22, y + 44, 22, { weight: 900, color: HP.UI.primary }); text(ctx, "Akun sekolah", x + 22, y + 88, 22, { weight: 800 });
      text(ctx, fmt(codeAt(T.idx)), x + 22, y + 160, 56, { weight: 900, color: T.secs <= 5 ? C.bad : C.kiko }); HP.ring(ctx, x + w - 46, y + 142, 24, T.secs / 30, T.secs <= 5 ? C.bad : HP.UI.primary);
      para(ctx, "Kode baru setiap 30 detik, bisa tanpa internet.", cx, y + 214, 23, w - 40, { align: "center", weight: 800, color: C.ink2, lh: 1.2 }); return; }
    if (S.k < 1 && !o.force) return;
    const u = S.k > 1 || o.force ? 1 : clamp(S.u * 1.5, 0, 1), tolak = o.tolak || (S.k >= 2 && (S.k > 2 || S.u > 0.35)), done = S.k >= 3 && S.u > 0.4;
    ctx.save(); ctx.globalAlpha = u; box(o.h || 380, "#fff", HP.UI.primary);
    text(ctx, "🛡️ Apakah ini kamu?", cx, y + 52, 30, { align: "center", weight: 900 });
    para(ctx, "Percobaan masuk dari perangkat baru di Kota Lain, pukul 21.14.", cx, y + 100, 23, w - 40, { align: "center", weight: 700, color: C.ink2, lh: 1.2 });
    [["Ya, ini saya", false], ["Tolak", true]].forEach(([t, isT], i) => { const by = y + 200 + i * 76, on = isT && tolak; card(ctx, x + 24, by, w - 48, 62, { fill: on ? C.bad : HP.UI.primaryBg, r: 16 }); text(ctx, t, cx, by + 41, 26, { align: "center", weight: 900, color: on ? "#fff" : isT ? C.bad : HP.UI.primary }); if (isT && S.k === 2 && !o.tolak) HP.tap(ctx, cx + 60, by + 31, clamp(S.u * 1.3, 0, 1), { r: 30 }); });
    ctx.restore();
    if (done) chip(ctx, "✓ percobaan diblokir", cx, y + (o.h || 380) + 34, { size: 24, fill: C.goodBg, stroke: C.good, color: C.good });
  }
  function log(ctx, x, y, w, mode, S) {
    const L = MODE[mode].log;
    L.forEach((s, i) => {
      const on = i < S.k, now = i === S.k - 1, bad = i === 2 && mode === "sandi";
      ctx.save(); if (!on) ctx.globalAlpha = 0.25;
      card(ctx, x, y + i * 62, w, 54, { fill: now ? (i === 2 ? (bad ? C.badBg : C.goodBg) : "#FFF3D6") : C.bg2, r: 12 });
      text(ctx, (i + 1) + "  " + s, x + 20, y + i * 62 + 36, 25, { weight: 900, color: i === 2 && on ? (bad ? C.bad : C.good) : C.ink, fit: w - 40 });
      ctx.restore();
    });
  }

  Object.assign(K.SCENES, {
    k14_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 240, 235, 30, { weight: 900, color: C.accentDark });
      [["menjelaskan cara lapis kedua bekerja", "✓"], ["menjaga kode hanya untukmu", "✓"], ["menolak percobaan masuk, lalu ganti sandi", "✓"]].forEach(([s], i) => {
        const u = ease((l - 0.5 - i * 0.9) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 240, 280 + i * 110, 900, 88, { fill: C.bg2, r: 16 }); text(ctx, "✓", 280, 338 + i * 110, 36, { weight: 900, color: C.good }); text(ctx, s, 330, 336 + i * 110, 30, { weight: 800, fit: 790 }); ctx.globalAlpha = 1;
      });
      gate(ctx, 1300, 300, "lapis 1", "🔑", l > 1 ? "ok" : null); gate(ctx, 1520, 300, "lapis 2", "📱", l > 2.2 ? "ok" : null);
    },
    k14_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 620, 400, { fill: C.bg2, r: 22 });
      text(ctx, "E.3", 570, 390, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Keamanan Akun dan Jaringan Dasar", 570, 460, 36, 540, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas X", 570, 650, 26, { align: "center", weight: 700, color: C.ink2 });
      const n = clamp(Math.floor((l - 0.8) / 0.7) + 1, 0, 3);
      [["🔑", "sesuatu yang kamu tahu", "kata sandi"], ["📱", "sesuatu yang kamu punya", "HP dengan kode"], ["👆", "sesuatu yang melekat padamu", "sidik jari atau wajah"]].forEach(([ic, t, e], i) => {
        if (i >= n) return; const y = 300 + i * 130; card(ctx, 960, y, 640, 112, { fill: "#fff", stroke: "#CFDCD5", lw: 3, r: 16 });
        text(ctx, ic, 1010, y + 72, 44, { align: "center" }); text(ctx, t, 1060, y + 48, 28, { weight: 900, color: C.kiko, fit: 520 }); text(ctx, e, 1060, y + 86, 24, { weight: 700, color: C.ink2 });
      });
      kiko(ctx, 1680, 760, 90, 0, { wave: l });
    },
    k14_masuk(ctx, b, l) {
      const mode = b.mode || "sandi", S = alur(b, l);
      card(ctx, 120, 150, 1680, 670); heading(ctx, MODE[mode].head, 200);
      row(ctx, 170, 245, 0.9, mode, S);
      phone(ctx, 1652, 490, 540, mode, S, l);
      text(ctx, "HP Sinta", 1652, 800, 22, { align: "center", weight: 900, color: C.ink2 });
      callout(ctx, 1180, 250, 330, mode, S, l);
      if (b.after) {
        card(ctx, 170, 600, 990, 190, { fill: C.badBg, stroke: C.bad, lw: 3, r: 16 });
        text(ctx, "Orang itu kini bisa:", 200, 645, 26, { weight: 900, color: C.bad });
        ["membaca pesan Sinta", "mengganti sandinya", "mengirim pesan atas nama Sinta"].forEach((s, i) => { if (l < 0.6 + i * 1.2) return; text(ctx, "• " + s, 220 + (i % 2) * 520, 700 + Math.floor(i / 2) * 50, 26, { weight: 800 }); });
      } else log(ctx, 170, 600, 990, mode, S);
    },
    k14_tanya(ctx, b, l) {
      const v = b.v; card(ctx, 120, 150, 1680, 670);
      const H2 = { 1: "VARIASI 1 · KODE OTP LEWAT SMS", 2: "VARIASI 2 · APLIKASI AUTENTIKATOR", 3: "VARIASI 3 · NOTIFIKASI PERSETUJUAN", 4: "VARIASI 4 · HP HILANG" };
      heading(ctx, H2[v]);
      const mode = { 1: "otp", 2: "app", 3: "notif", 4: "app" }[v];
      if (v < 4) {
        row(ctx, 170, 245, 0.9, mode, { k: 0, u: 0 });
        phone(ctx, 1652, 490, 540, mode, { k: 0, u: 0 }, 0);
        text(ctx, "HP Sinta", 1652, 800, 22, { align: "center", weight: 900, color: C.ink2 });
        const D = { 1: ["💬", "Kode dikirim lewat SMS ke HP Sinta."], 2: ["🔢", "Kode dibuat oleh aplikasi di HP Sinta."], 3: ["🛡️", "HP Sinta bertanya: Apakah ini kamu?"] }[v];
        card(ctx, 1180, 250, 330, 230, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, D[0], 1345, 320, 50, { align: "center" }); para(ctx, D[1], 1345, 380, 25, 290, { align: "center", weight: 900, color: C.accentDark, lh: 1.2 });
      } else {
        // HP hilang: HP dicoret, Sinta di laptop rumah ingin masuk
        ctx.save(); ctx.globalAlpha = 0.35; phone(ctx, 1560, 485, 560, "app", { k: 0, u: 0 }, 0); ctx.restore();
        ctx.strokeStyle = C.bad; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(1440, 260); ctx.lineTo(1680, 710); ctx.moveTo(1680, 260); ctx.lineTo(1440, 710); ctx.stroke();
        chip(ctx, "HP hilang", 1560, 485, { size: 30, fill: C.badBg, stroke: C.bad, color: C.bad });
        J.laptop(ctx, 330, 380, 170); text(ctx, "Sinta di rumah", 330, 490, 24, { align: "center", weight: 900 });
        card(ctx, 560, 260, 680, 300, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 18 }); text(ctx, "Masuk ke akun sekolah", 900, 310, 28, { align: "center", weight: 900 });
        text(ctx, "Kata sandi", 600, 360, 22, { weight: 800, color: C.ink2 }); card(ctx, 600, 372, 600, 56, { fill: C.goodBg, stroke: C.good, lw: 2, r: 10 }); text(ctx, "••••••••••  ✓", 620, 410, 26, { weight: 800, color: C.good });
        text(ctx, "Kode 6 angka dari autentikator", 600, 460, 22, { weight: 800, color: C.ink2 }); card(ctx, 600, 472, 600, 56, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 10 }); text(ctx, "? ? ?  ? ? ?", 620, 510, 26, { weight: 900, color: C.accentDark });
      }
      if (!b.pilih) { const Q = { 1: "Apakah sandi saja sekarang cukup untuk masuk?", 2: "Apa bedanya kalau kode dibuat oleh HP Sinta?", 3: "Apa yang terjadi kalau Sinta menekan Tolak?", 4: "Bagaimana Sinta masuk tanpa HP-nya?" }; text(ctx, Q[v], 720, 760, 30, { align: "center", weight: 900, color: C.accentDark, fit: 1100 }); }
    },
    k14_tebak(ctx, b, l) {
      K.SCENES.k14_tanya(ctx, b, 5);
      const n = b.pilih.length, w = 380, g = 24, x0 = 720 - (n * w + (n - 1) * g) / 2;
      b.pilih.forEach((s, i) => { card(ctx, x0 + i * (w + g), 718, w, 70, { fill: "#fff", stroke: C.kiko, lw: 3, r: 35 }); text(ctx, "ABC"[i] + ". " + s, x0 + i * (w + g) + w / 2, 763, 26, { align: "center", weight: 900, color: C.kikoDark, fit: w - 30 }); });
      thinking(ctx, 1440, 210, l, b.dur);
    },
    k14_cadangan(ctx, b, l) {
      const c = cues(b, 3, [0.15, 0.5, 0.78]);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "KODE CADANGAN: KUNCI SEREP UNTUK AKUNMU", 200);
      // kertas kode cadangan
      const show = clamp((l - c[0]) / 0.6, 0, 1);
      ctx.save(); ctx.globalAlpha = Math.max(0.15, show);
      ctx.save(); ctx.translate(560, 500); ctx.rotate(-0.025); ctx.translate(-560, -500);
      card(ctx, 220, 250, 680, 500, { fill: "#FFFDF5", stroke: "#D9CFA8", lw: 3, r: 8 });
      text(ctx, "KODE CADANGAN", 560, 300, 30, { align: "center", weight: 900 });
      text(ctx, "akun sekolah · sinta@sekolah.example", 560, 336, 20, { align: "center", weight: 700, color: C.ink2 });
      const codes = ["4821 7730", "1958 0467", "7302 1958", "6614 2093", "3087 5521", "9240 3318", "5176 8842", "2659 0731", "8403 6195", "0912 4476"];
      const pick = 2, used = l >= c[2] + 0.4;
      codes.forEach((s, i) => { const x = 280 + (i % 2) * 320, y = 400 + Math.floor(i / 2) * 58; const hl = i === pick && l >= c[1];
        if (hl) { ctx.fillStyle = used ? "#F1F4F2" : "#FFF3D6"; rr(ctx, x - 12, y - 34, 280, 46, 8); ctx.fill(); }
        text(ctx, (i + 1) + ".  " + s, x, y, 28, { weight: 800, color: hl && used ? C.ink2 : C.ink });
        if (hl && used) { const u = clamp((l - c[2] - 0.4) / 0.5, 0, 1); ctx.strokeStyle = C.bad; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 6, y - 10); ctx.lineTo(x - 6 + 250 * u, y - 10); ctx.stroke(); if (u >= 1) text(ctx, "terpakai", x + 40, y + 20, 16, { align: "left", weight: 900, color: C.bad }); }
      });
      text(ctx, "Setiap kode hanya bisa dipakai sekali.", 560, 720, 22, { align: "center", weight: 800, color: C.ink2 });
      ctx.restore(); ctx.restore();
      if (show > 0) chip(ctx, "🗄️ disimpan di laci rumah", 560, 785, { size: 22, fill: "#fff", stroke: "#B7C4CC", color: C.ink });
      // formulir masuk
      card(ctx, 1020, 280, 700, 380, { fill: "#fff", stroke: l >= c[2] ? C.good : "#B7C4CC", lw: l >= c[2] ? 5 : 3, r: 18 });
      text(ctx, "Masuk ke akun sekolah", 1370, 330, 28, { align: "center", weight: 900 });
      text(ctx, "Kata sandi", 1060, 380, 22, { weight: 800, color: C.ink2 }); card(ctx, 1060, 392, 620, 56, { fill: "#F4F8FB", stroke: "#C9D4DB", lw: 2, r: 10 }); text(ctx, "••••••••••", 1080, 430, 26, { weight: 800 });
      text(ctx, "Kode cadangan", 1060, 486, 22, { weight: 800, color: C.ink2 });
      const typ = clamp((l - c[1] - 0.6) / 1.4, 0, 1), s = "7302 1958".slice(0, Math.round(typ * 9));
      card(ctx, 1060, 498, 620, 56, { fill: l >= c[1] ? "#FFF3D6" : "#F4F8FB", stroke: l >= c[1] ? C.accent : "#C9D4DB", lw: 2, r: 10 }); text(ctx, s, 1080, 536, 28, { weight: 900 });
      text(ctx, "Tidak bisa memakai HP? Pakai kode cadangan.", 1060, 590, 19, { weight: 700, color: C.kiko });
      if (l >= c[2]) text(ctx, "✓ berhasil masuk", 1680, 640, 26, { align: "right", weight: 900, color: C.good });
    },
    k14_banding(ctx, b, l) {
      const v = b.v, n = clamp(Math.floor((l - 0.3) / 0.9) + 1, 0, 5), a = A(b);
      card(ctx, 120, 150, 1680, 670);
      if (v === 1) {
        heading(ctx, "KODE DATANG, PADAHAL SINTA TIDAK LOGIN");
        callout(ctx, 220, 300, 420, "otp", { k: 3, u: 1 }, l);
        const items = [["⚠️", "Sandi Sinta sudah diketahui orang lain.", C.bad, C.badBg, "Perhatikan"], ["🤐", "Jangan bagikan kode kepada siapa pun.", C.accentDark, "#FFF3D6", "Jangan bagikan"], ["🔁", "Segera ganti sandi akun itu.", C.good, C.goodBg, "ganti sandi"]];
        items.forEach(([ic, s, col, bg, cue], i) => { const t = i === 0 ? at(b, "Artinya") : at(b, cue); if (l < t) return; card(ctx, 720, 270 + i * 150, 1000, 124, { fill: bg, stroke: col, lw: 4, r: 18 }); text(ctx, ic, 790, 350 + i * 150, 50, { align: "center" }); text(ctx, s, 850, 345 + i * 150, 32, { weight: 900, color: col, fit: 840 }); });
      } else if (v === 2) {
        heading(ctx, "KODE SMS LAWAN KODE AUTENTIKATOR");
        const x = 300, y = 250, cw = [520, 400, 400], rh = 80, rows = [["dikirim lewat jaringan", "ya", "tidak pernah"], ["berlaku", "beberapa menit", "30 detik"], ["perlu sinyal HP", "ya", "tidak"], ["lebih aman dari sandi saja", "✓", "✓"]];
        card(ctx, x, y, 1320, 64 + rh * 4, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, 1320, 64, 14); ctx.fill(); ctx.fillRect(x, y + 32, 1320, 32);
        ["", "💬 kode SMS", "🔢 autentikator"].forEach((h, i) => text(ctx, h, x + cw.slice(0, i).reduce((p, q) => p + q, 0) + cw[i] / 2, y + 43, 28, { align: "center", weight: 900, color: C.ink2 }));
        rows.forEach((r, i) => { if (i >= n) return; const ry = y + 64 + rh * i; ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 10, ry); ctx.lineTo(x + 1310, ry); ctx.stroke(); let cx = x; r.forEach((s, j) => { text(ctx, s, cx + cw[j] / 2, ry + rh / 2 + 11, j ? 30 : 26, { align: "center", weight: 900, color: j === 0 ? C.ink2 : (i === 3 || (j === 2 && i < 3)) ? C.good : C.ink }); cx += cw[j]; }); });
        if (l > a * 0.6) banner(ctx, "keduanya jauh lebih aman daripada sandi saja", 680, { w: 1100, fill: C.goodBg, stroke: C.good, color: C.good });
      } else if (v === 3) {
        heading(ctx, "PERMINTAAN MASUK YANG BUKAN KAMU");
        callout(ctx, 220, 260, 420, "notif", { k: 2, u: 1 }, l, { force: true, tolak: true, h: 360 });
        const st = [["1", "Tekan Tolak, sesering apa pun ia muncul.", "jangan tekan Ya"], ["2", "Ganti sandimu.", "Tekan Tolak"], ["3", "Periksa daftar perangkat di akunmu.", "karena sandimu"]];
        card(ctx, 720, 260, 1000, 110, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "❌ Jangan tekan Ya untuk permintaan yang tidak kamu lakukan.", 1220, 325, 28, { align: "center", weight: 900, color: C.bad, fit: 950 });
        st.forEach(([k, s, cue], i) => { if (l < at(b, cue) + (i === 0 ? 0.5 : 0)) return; card(ctx, 720, 400 + i * 110, 1000, 90, { fill: C.goodBg, r: 16 }); text(ctx, k, 770, 458 + i * 110, 34, { align: "center", weight: 900, color: C.good }); text(ctx, s, 820, 456 + i * 110, 30, { weight: 900, fit: 870 }); });
      } else {
        heading(ctx, "SETELAH MASUK DENGAN KODE CADANGAN");
        text(ctx, "Daftar perangkat", 200, 275, 28, { weight: 900, color: C.kiko });
        const dev = [["📱", "HP Sinta (lama)", "hilang", true], ["📱", "HP Sinta (baru)", "perangkat ini", false], ["💻", "Laptop rumah", "aktif", false]];
        const out = l > at(b, "mengeluarkan") + 1.2;
        dev.forEach(([ic, s, sub, lost], i) => { const y = 300 + i * 100; ctx.save(); if (lost && out) ctx.globalAlpha = 0.4; card(ctx, 200, y, 720, 84, { fill: lost ? C.badBg : "#fff", stroke: lost ? C.bad : "#CFDCD5", lw: 3, r: 14 }); text(ctx, ic, 245, y + 56, 34, { align: "center" }); text(ctx, s, 290, y + 40, 26, { weight: 900 }); text(ctx, sub, 290, y + 68, 20, { weight: 700, color: lost ? C.bad : C.ink2 }); ctx.restore();
          if (lost) { if (out) { ctx.strokeStyle = C.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(220, y + 42); ctx.lineTo(900, y + 42); ctx.stroke(); text(ctx, "dikeluarkan", 900, y + 32, 22, { align: "right", weight: 900, color: C.bad }); } else chip(ctx, "Keluarkan", 820, y + 42, { size: 20, fill: "#fff", stroke: C.bad, color: C.bad }); }
          if (!lost && i === 1 && l > at(b, "memasang")) chip(ctx, "🔢 autentikator baru", 790, y + 42, { size: 18, fill: C.goodBg, stroke: C.good, color: C.good });
        });
        text(ctx, "Simpan kode cadangan", 1040, 275, 28, { weight: 900, color: C.kiko });
        const t0 = at(b, "Kode cadangan tidak");
        [["✓", "di kertas, di tempat aman di rumah", true], ["✕", "di HP yang sama", false], ["✕", "dibagikan kepada teman", false]].forEach(([ic, s, ok], i) => { if (l < t0 - 0.3 + i * 0.7 && i > 0) return; const y = 300 + i * 100; card(ctx, 1040, y, 680, 84, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 3, r: 14 }); text(ctx, ic, 1085, y + 56, 36, { align: "center", weight: 900, color: ok ? C.good : C.bad }); text(ctx, s, 1130, y + 54, 27, { weight: 900, fit: 570 }); });
        if (l > a * 0.85) banner(ctx, "HP hilang? Kode cadangan membuka pintu, lalu rapikan daftar perangkat", 640, { w: 1400 });
      }
    },
    k14_latihan(ctx, b, l) {
      const a = A(b), t = [a * 0.1, a * 0.24, a * 0.34];
      const form = { custom: (ctx, x, y, w) => {
        text(ctx, "Kata sandi", x, y + 12, 12, { weight: 800 }); ctx.fillStyle = "#F4F8FB"; rr(ctx, x, y + 18, w, 30, 7); ctx.fill(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, l >= t[1] ? "••••••••••" : "", x + 10, y + 38, 13, { weight: 800 }); y += 56;
        text(ctx, "Kode 6 angka (langkah 2)", x, y + 12, 12, { weight: 800 }); ctx.fillStyle = l >= t[2] ? "#FFF3D6" : "#F4F8FB"; rr(ctx, x, y + 18, w, 30, 7); ctx.fill(); ctx.stroke(); text(ctx, l >= t[2] + 0.8 ? "482913" : "", x + 10, y + 38, 13, { weight: 800 }); y += 56;
        return y + 4; } };
      K.halaman(ctx, 250, 190, 1.15, { url: "belajar-informatika.vercel.app/e3", judul: "Simulasi dua langkah, audit akun, atur router",
        rows: [{ tabs: ["1 Simulasi dua langkah", "2 Audit akun fiktif", "3 Atur router fiktif"], on: -1 },
          { task: "Empat babak: masuk dengan sandi dan kode, tolak permintaan OTP, lihat penipu gagal, lalu putuskan langkah berikutnya." },
          form, { buttons: ["Lanjut"], cols: 1, on: -1 }],
        taps: [[0, 0, t[0]], [3, 0, t[2] + 1.6]] }, l, { h: 535 });
      const n = l < t[0] ? 0 : l < t[2] ? 1 : l < a * 0.55 ? 2 : 3;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN E.3", ["Klik 1 Simulasi dua langkah.", "Masuk dengan sandi, lalu kode dari autentikator.", "Selesaikan keempat babak."], n);
      card(ctx, 840, 540, 880, 230, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 585, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Bersama orang tuamu, periksa apakah akun penting di rumah sudah memakai verifikasi dua langkah.", 870, 630, 28, 820, { weight: 700, lh: 1.3 });
    },

    // ---------- Short (area 40–1040 × 20–810) ----------
    k14s_masuk(ctx, b, l) {
      const mode = b.mode || "sandi", S = alur(b, l);
      row(ctx, 50, 40, 0.86, mode, S);
      text(ctx, "HP Sinta:", 60, 372, 28, { weight: 900, color: C.ink2 });
      callout(ctx, 60, 390, 470, mode, S, l, { h: 340 });
      const L = MODE[mode].log;
      L.forEach((s, i) => { const on = i < S.k, bad = i === 2 && mode === "sandi"; ctx.save(); if (!on) ctx.globalAlpha = 0.25;
        card(ctx, 560, 350 + i * 145, 460, 128, { fill: i === S.k - 1 ? (i === 2 ? (bad ? C.badBg : C.goodBg) : "#FFF3D6") : C.bg2, r: 16 });
        para(ctx, s, 790, 400 + i * 145, 30, 420, { align: "center", weight: 900, color: i === 2 && on ? (bad ? C.bad : C.good) : C.ink, lh: 1.15 }); ctx.restore(); });
    },
    k14s_inti(ctx, b, l) {
      const c = cues(b, 3, [0.05, 0.35, 0.7]);
      phone(ctx, 260, 400, 700, "otp", { k: 3, u: 1 }, 0);
      [["🤐", "Kode hanya untukmu.", C.accentDark, "#FFF3D6"], ["🚫", "Petugas resmi tidak pernah memintanya.", C.bad, C.badBg], ["🔁", "Ada kode atau permintaan aneh? Ganti sandi.", C.good, C.goodBg]].forEach(([ic, s, col, bg], i) => {
        if (l < c[i]) return; const y = 60 + i * 250; card(ctx, 480, y, 540, 220, { fill: bg, stroke: col, lw: 5, r: 22 }); text(ctx, ic, 750, y + 80, 56, { align: "center" }); para(ctx, s, 750, y + 140, 34, 500, { align: "center", weight: 900, color: col, lh: 1.15 }); });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
