/* Inti gambar seri "Bedah Soal OSN-K Informatika" (tema kertas grafik, disetujui Bu Dewi 20 Nov 2026).
   Antarmuka sama dengan kiko-core.js (global Kiko: draw, beatAt, SCENES, helpers) supaya render.py dipakai apa adanya.
   Warna: latar krem #F5EFE0 bergaris 40 px, kartu #FFFCF4, hijau tua = penanda, merah = angka penting, ungu = palsu/salah.
   Huruf: Inter Display (judul), Inter (teks), JetBrains Mono (angka, label, kode). Tanpa maskot. */
(function (global) {
  const W = 1920, H = 1080;
  const SANS = "Inter, sans-serif", DISP = "'Inter Display', Inter, sans-serif", MONO = "'JetBrains Mono', monospace";
  const C = {
    bg: "#F5EFE0", grid: "#E6DCC4", panel: "#FFFCF4", line: "#D8CDB4", ink: "#22201B", mut: "#7C735F",
    green: "#1F7A55", greenBg: "#DCEBDF", red: "#D2382B", redBg: "#F7DCD6", purple: "#8A3FA8", purpleBg: "#EBDDF0",
    gold: "#E8C55A", goldRim: "#B48A1E", goldInk: "#5E4710", gold2: "#F4DE94", white: "#FFFFFF"
  };
  const ease = u => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const ap = (l, t0, d = 0.45) => ease((l - t0) / d);          // muncul mulai t0 selama d detik

  // ---------- waktu kata ----------
  const norm = s => s.toLowerCase().replace(/[^0-9a-z]/g, "");
  /* at(b, "kata", n): detik (relatif awal beat) saat kata ke-n (mulai 1) yang diawali "kata" diucapkan.
     Kata diambil dari b.words (waktu whisper per token naskah); cadangan: posisi token dibagi rata sepanjang audio. */
  function at(b, key, n = 1, end = false) {
    const k = norm(key); const toks = b.words ? b.words.map(w => w[0]) : b.text.split(/\s+/);
    let c = 0;
    for (let i = 0; i < toks.length; i++) {
      if ((k.length <= 1 ? norm(toks[i]) === k : norm(toks[i]).startsWith(k)) && ++c === n) {   // satu huruf (label A–E): harus sama persis
        if (b.words) return b.words[i][end ? 2 : 1];
        const lead = (b.speech || b.start) - b.start; return lead + b.audio * (i + (end ? 1 : 0)) / toks.length;
      }
    }
    return 0;
  }
  const speechEnd = b => ((b.speech || b.start) - b.start) + b.audio;

  // ---------- pembantu gambar ----------
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function font(size, weight = 600, fam = SANS) { return `${weight} ${size}px ${fam}`; }
  function text(ctx, s, x, y, size, o = {}) {
    const fam = o.mono ? MONO : o.disp ? DISP : SANS; let sz = size;
    ctx.font = font(sz, o.weight || 600, fam);
    while (o.fit && sz > 16 && ctx.measureText(s).width > o.fit) { sz -= 2; ctx.font = font(sz, o.weight || 600, fam); }
    ctx.fillStyle = o.color || C.ink; ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "alphabetic";
    if (o.ls) { try { ctx.letterSpacing = o.ls + "px"; } catch (e) {} }
    ctx.fillText(s, x, y);
    if (o.ls) { try { ctx.letterSpacing = "0px"; } catch (e) {} }
    return ctx.measureText(s).width;
  }
  function wrap(ctx, s, size, weight, maxW, fam = SANS) {
    ctx.font = font(size, weight, fam); const out = []; let cur = "";
    for (const w of s.split(" ")) { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur); return out;
  }
  function para(ctx, s, x, y, size, maxW, o = {}) {
    const lines = wrap(ctx, s, size, o.weight || 600, maxW, o.mono ? MONO : o.disp ? DISP : SANS); const lh = size * (o.lh || 1.3);
    lines.forEach((ln, i) => text(ctx, ln, x, y + i * lh, size, o)); return lines.length * lh;
  }
  function panel(ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    rr(ctx, x, y, w, h, o.r || 16); ctx.fillStyle = o.fill || C.panel; ctx.fill();
    ctx.lineWidth = o.lw || 2; ctx.strokeStyle = o.stroke || C.line; ctx.stroke(); ctx.restore();
  }
  function label(ctx, s, x, y, o = {}) {   // "// YANG DIKETAHUI"
    text(ctx, s, x, y, o.size || 24, { mono: true, weight: 700, color: o.color || C.green, ls: 2, align: o.align });
  }
  function chip(ctx, s, x, y, o = {}) {   // kotak bergaris dengan teks mono; x,y = kiri atas; mengembalikan lebar
    const size = o.size || 26; ctx.font = font(size, o.weight || 700, MONO); const w = ctx.measureText(s).width + 2 * (o.px || 20), h = size + 2 * (o.py || 12);
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    const xx = o.center ? x - w / 2 : x;
    rr(ctx, xx, y, w, h, o.r || 8); ctx.fillStyle = o.fill || "rgba(255,252,244,0.9)"; ctx.fill(); ctx.lineWidth = o.lw || 2; ctx.strokeStyle = o.stroke || C.line; ctx.stroke();
    text(ctx, s, xx + w / 2, y + h / 2 + size * 0.36, size, { mono: true, weight: o.weight || 700, color: o.color || C.mut, align: "center" });
    ctx.restore(); return w;
  }
  /* koin: x,y = pusat, r = jari-jari. o.fake: koin palsu (ungu); o.ghost: garis putus (kosong); o.mark: teks kecil di bawah */
  function coin(ctx, x, y, r, s, o = {}) {
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    if (o.glow) { ctx.beginPath(); ctx.arc(x, y, r * (1.35 + 0.08 * Math.sin(o.glow * 9)), 0, Math.PI * 2); ctx.fillStyle = o.fake ? "rgba(138,63,168,0.22)" : "rgba(31,122,85,0.2)"; ctx.fill(); }
    if (o.ghost) {
      ctx.setLineDash([8, 7]); ctx.lineWidth = 4; ctx.strokeStyle = C.line; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    } else {
      ctx.beginPath(); ctx.arc(x + 3, y + 5, r, 0, Math.PI * 2); ctx.fillStyle = "rgba(60,45,10,0.14)"; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = o.fake ? C.purpleBg : C.gold; ctx.fill();
      ctx.lineWidth = Math.max(3, r * 0.11); ctx.strokeStyle = o.fake ? C.purple : C.goldRim; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r * 0.74, 0, Math.PI * 2); ctx.lineWidth = Math.max(1.5, r * 0.05); ctx.strokeStyle = o.fake ? "rgba(138,63,168,0.5)" : "rgba(180,138,30,0.55)"; ctx.stroke();
      if (!o.fake) { ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.32, r * 0.22, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fill(); }
    }
    if (s) text(ctx, s, x, y + r * 0.36, r * 0.98, { mono: true, weight: 800, color: o.ghost ? C.mut : o.fake ? C.purple : C.goldInk, align: "center" });
    ctx.restore();
  }
  /* timbangan digital: x = tengah, y = permukaan piringan; w = lebar; disp = teks layar */
  function scale(ctx, x, y, w, disp, o = {}) {
    ctx.save(); ctx.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
    const h = w * 0.42;
    ctx.fillStyle = "rgba(60,45,10,0.12)"; rr(ctx, x - w / 2 + 8, y + 26, w, h, 26); ctx.fill();
    rr(ctx, x - w / 2, y + 18, w, h, 26); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = o.color || C.green; ctx.stroke();
    rr(ctx, x - w * 0.47, y, w * 0.94, 20, 10); ctx.fillStyle = "#E9E1CC"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
    const dw = w * 0.58, dh = h * 0.46, dx = x - dw / 2, dy = y + 18 + h * 0.27;
    rr(ctx, dx, dy, dw, dh, 12); ctx.fillStyle = o.dispBg || "#EEF3E6"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.line; ctx.stroke();
    text(ctx, disp == null ? "" : disp, x, dy + dh * 0.72, dh * 0.62, { mono: true, weight: 800, color: o.dispColor || C.green, align: "center", fit: dw - 24 });
    ctx.restore();
  }
  function check(ctx, x, y, s, color = C.green, u = 1) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = s * 0.18; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); const p = [[-0.4, 0], [-0.1, 0.3], [0.45, -0.35]];
    ctx.moveTo(x + p[0][0] * s, y + p[0][1] * s);
    const a = clamp(u * 2, 0, 1), b2 = clamp(u * 2 - 1, 0, 1);
    ctx.lineTo(x + lerp(p[0][0], p[1][0], a) * s, y + lerp(p[0][1], p[1][1], a) * s);
    if (b2 > 0) ctx.lineTo(x + lerp(p[1][0], p[2][0], b2) * s, y + lerp(p[1][1], p[2][1], b2) * s);
    ctx.stroke(); ctx.restore();
  }
  function cross(ctx, x, y, s, color = C.purple, u = 1) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = s * 0.16; ctx.lineCap = "round";
    const a = clamp(u * 2, 0, 1), b2 = clamp(u * 2 - 1, 0, 1);
    ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x + lerp(-0.5, 0.5, a) * s, y + lerp(-0.5, 0.5, a) * s); ctx.stroke();
    if (b2 > 0) { ctx.beginPath(); ctx.moveTo(x + s / 2, y - s / 2); ctx.lineTo(x + lerp(0.5, -0.5, b2) * s, y + lerp(-0.5, 0.5, b2) * s); ctx.stroke(); }
    ctx.restore();
  }
  function arrow(ctx, x1, y1, x2, y2, o = {}) {
    const u = o.u === undefined ? 1 : o.u; if (u <= 0) return;
    const xe = lerp(x1, x2, u), ye = lerp(y1, y2, u); const a = Math.atan2(ye - y1, xe - x1), hs = o.head || 18;
    ctx.save(); ctx.strokeStyle = ctx.fillStyle = o.color || C.green; ctx.lineWidth = o.lw || 5; ctx.lineCap = "round";
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(xe - Math.cos(a) * hs * 0.6, ye - Math.sin(a) * hs * 0.6); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(xe, ye); ctx.lineTo(xe - Math.cos(a - 0.45) * hs, ye - Math.sin(a - 0.45) * hs); ctx.lineTo(xe - Math.cos(a + 0.45) * hs, ye - Math.sin(a + 0.45) * hs); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function strike(ctx, x1, y1, x2, y2, u, color = C.red, lw = 10) {
    if (u <= 0) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, u), lerp(y1, y2, u)); ctx.stroke(); ctx.restore();
  }
  function hilite(ctx, x, y, w, h, color = C.green, u = 1, fill = "rgba(31,122,85,0.12)") {
    if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; rr(ctx, x, y, w, h, 12); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
  }

  // ---------- adegan umum ----------
  const SCENES = {
    title(ctx, b, l, t, TL) {
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 420, 34, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, b.text || TL.title, 960, 560, 96, { disp: true, weight: 800, align: "center", fit: 1600 });
    },
    bab(ctx, b, l, t, TL) {   // kartu jeda antarbagian
      const u = ap(l, 0.1, 0.5); ctx.save(); ctx.globalAlpha = u;
      text(ctx, "BAGIAN " + b.seg, 960, 430, 34, { mono: true, weight: 700, color: C.green, align: "center", ls: 6 });
      text(ctx, TL.segments[b.seg], 960, 560, 100, { disp: true, weight: 800, align: "center", fit: 1600 });
      ctx.fillStyle = C.red; const w = 260 * ap(l, 0.4, 0.8); ctx.fillRect(960 - w / 2, 610, w, 8);
      ctx.restore();
    }
  };

  function beatAt(TL, t) { let b = TL.beats[0]; for (const x of TL.beats) { if (t >= x.start) b = x; else break; } return b; }

  function background(ctx) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.grid; for (let x = 0; x < W; x += 40) ctx.fillRect(x, 0, 1, H); for (let y = 0; y < H; y += 40) ctx.fillRect(0, y, W, 1);
  }
  function capLayout(ctx, s) { const lines = wrap(ctx, s, 38, 600, W - 240 - 80); return { lines, h: 26 + 30 + lines.length * 38 * 1.35 }; }

  function draw(ctx, t, TL, opt = {}) {
    const b = beatAt(TL, t); const l = t - b.start;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    background(ctx);
    const fn = SCENES[b.scene]; if (fn) { ctx.save(); fn(ctx, b, l, t, TL); ctx.restore(); }
    // baris atas bergaya terminal (tidak tampil di kait dan kartu bagian)
    if (opt.top !== false && b.seg > 0 && b.scene !== "bab" && !b.noTop) {
      ctx.fillStyle = "rgba(245,239,224,0.94)"; ctx.fillRect(0, 0, W, 84); ctx.fillStyle = C.line; ctx.fillRect(0, 84, W, 2);
      const tag = b.tag || (TL.tags || [])[b.seg] || ""; ctx.font = font(24, 800, MONO); const tw = ctx.measureText(tag).width + 28;
      rr(ctx, 56, 23, tw, 38, 6); ctx.fillStyle = b.tagColor || (tag === "COBA DULU" ? C.red : tag === "BAGAIMANA KALAU" ? C.purple : C.green); ctx.fill();
      text(ctx, tag, 56 + tw / 2, 51, 24, { mono: true, weight: 800, color: C.white, align: "center", ls: 1 });
      const o = TL.osn || {}; text(ctx, `OSN-K ${o.tahun} · ${o.jenjang} · No. ${o.nomor} · ${o.judul}`, 56 + tw + 24, 51, 24, { mono: true, weight: 600, color: C.mut });
      text(ctx, b.step || TL.segments[b.seg], W - 56, 51, 24, { mono: true, weight: 700, color: C.red, align: "right" });
      ctx.fillStyle = C.green; ctx.fillRect(0, 84, W * clamp(t / TL.total, 0, 1), 3);
    }
    // kartu narasi
    const hideAfter = b.countdown ? speechEnd(b) + 0.6 : 1e9;
    if (opt.subtitles !== false && b.text && l < hideAfter) {
      const { lines, h } = capLayout(ctx, b.text); const y0 = H - 56 - h;
      ctx.save(); ctx.globalAlpha = b.countdown ? clamp((hideAfter - l) / 0.4, 0, 1) : 1;
      ctx.shadowColor = "rgba(60,45,10,0.12)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4;
      rr(ctx, 120, y0, W - 240, h, 10); ctx.fillStyle = "rgba(255,252,244,0.97)"; ctx.fill(); ctx.shadowColor = "transparent";
      ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke();
      ctx.fillStyle = C.green; ctx.fillRect(120, y0, 8, h);
      const lead = (b.speech || b.start) - b.start; const frac = clamp((l - lead) / b.audio, 0, 1);
      ctx.fillRect(120, y0 + h - 5, (W - 240) * frac, 5);
      lines.forEach((ln, i) => text(ctx, ln, 164, y0 + 26 + 38 + i * 38 * 1.35 - 4, 38, { weight: 600 }));
      ctx.restore();
    }
    ctx.restore();
    return b;
  }
  // batas bawah area gambar untuk beat ini (di atas kartu narasi)
  function bottomOf(ctx, b) { return b.text ? H - 56 - capLayout(ctx, b.text).h - 24 : H - 60; }

  global.Kiko = { draw, beatAt, W, H, C, SCENES, FONTS: { SANS, DISP, MONO },
    helpers: { rr, text, wrap, para, panel, label, chip, coin, scale, check, cross, arrow, strike, hilite, ease, clamp, lerp, ap, at, speechEnd, bottomOf, norm } };
})(typeof window !== "undefined" ? window : globalThis);
