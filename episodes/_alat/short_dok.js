/* Short vertikal (1080x1920) untuk video dokumenter, tampilan malam yang sama dengan videonya (memakai K.dok dari sinema.js).
   Dimuat sebagai bagian mesin induk (script.json "engine", setelah sinema.js); short.js lalu memakai K.drawShortDok.
   Tata letak sama dengan Short seri: kait di atas, potongan adegan di tengah, narasi besar di bawah, zona aman Shorts dibiarkan kosong. */
(function (global) {
  const K = global.Kiko, D = K.dok; if (!D) return;
  const { P, txt, bg, glow, hexA, panel, bip, clamp, sm } = D, H = K.helpers;
  const SW = 1080, SH = 1920, IMG_TOP = 420, IMG_BOT = 1230, IMG_W = 1000;

  function hookBand(ctx, TL, t) {
    txt(ctx, (TL.label || "Dokumenter Animasi") + " · iTeachSWE", 60, 96, 30, { color: P.ink2, weight: 700 });
    ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(0, 120, SW, 8); ctx.fillStyle = P.amber; ctx.fillRect(0, 120, SW * clamp(t / TL.total), 8);
    let size = 76, lines = H.wrap(ctx, TL.hook, size, 900, 940);
    if (lines.length > 2) { size = 62; lines = H.wrap(ctx, TL.hook, size, 900, 960); }
    const y0 = 170 + (lines.length < 3 ? 40 : 0);
    lines.slice(0, 3).forEach((ln, i) => txt(ctx, ln, SW / 2, y0 + size + i * size * 1.18, size, { align: "center", weight: 900, color: i === lines.length - 1 ? P.amber : P.ink }));
    return y0 + size + (lines.length - 1) * size * 1.18 + 20;
  }
  function crops(ctx, off, list, top, bot) {
    const gap = 48, ws = list.map(([, , w]) => Math.min(IMG_W, w * 1.6)), hs = list.map(([, , w, h], i) => h * ws[i] / w);
    const sum = hs.reduce((a, b) => a + b, 0), gaps = gap * (list.length - 1), s = Math.min(1, (bot - top - gaps) / sum);
    let y = top + ((bot - top) - (sum * s + gaps)) / 2;
    list.forEach(([x, cy, w, h], i) => {
      const dw = ws[i] * s, dh = hs[i] * s, dx = (SW - dw) / 2;
      ctx.save(); H.rr(ctx, dx, y, dw, dh, 24); ctx.clip(); ctx.drawImage(off, x, cy, w, h, dx, y, dw, dh); ctx.restore();
      ctx.strokeStyle = "rgba(169,184,220,0.25)"; ctx.lineWidth = 3; H.rr(ctx, dx, y, dw, dh, 24); ctx.stroke();
      y += dh + gap;
    });
  }
  function narrationBox(ctx, b) {
    let size = 50, lines = H.wrap(ctx, b.text, size, 700, 860);
    if (lines.length > 4) { size = 44; lines = H.wrap(ctx, b.text, size, 700, 860); }
    const h = lines.length * size * 1.3 + 48; return { size, lines, h, y0: Math.min(1268, 1590 - h) };
  }
  function narration(ctx, b, l, nb) {
    const { size, lines, h, y0 } = nb;
    ctx.fillStyle = "rgba(6,10,30,0.88)"; H.rr(ctx, 50, y0, 900, h, 24); ctx.fill(); ctx.strokeStyle = "rgba(169,184,220,0.25)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = P.amber; H.rr(ctx, 50, y0 + h - 9, 900 * clamp(l / b.audio), 9, 4); ctx.fill();
    lines.forEach((ln, i) => txt(ctx, ln, 500, y0 + 24 + size + i * size * 1.3, size, { align: "center", color: P.ink, weight: 700 }));
  }
  function cta(ctx, b, l, TL, t) {
    const u = sm(l / 0.6); ctx.save(); ctx.globalAlpha = u;
    glow(ctx, SW / 2, IMG_TOP + 380, 520, P.violet, 0.35);
    txt(ctx, TL.cta_heading || "TONTON VIDEO LENGKAPNYA", SW / 2, IMG_TOP + 70, 36, { align: "center", weight: 900, color: P.amber });
    H.para(ctx, TL.full_title, SW / 2, IMG_TOP + 150, 58, 860, { align: "center", weight: 900, lh: 1.15, color: P.ink });
    bip(ctx, SW / 2, IMG_TOP + 430, 190, { mood: "happy", t, wave: l });
    panel(ctx, 110, IMG_TOP + 600, 860, 120, { stroke: hexA(P.amber, 0.8), lw: 5 });
    txt(ctx, TL.link, SW / 2, IMG_TOP + 680, 52, { align: "center", color: P.amber, weight: 900, fit: 820 });
    ctx.restore();
  }

  K.drawShortDok = function (ctx, off, t, TL) {
    const b = K.beatAt(TL, t), l = t - b.start, octx = off.getContext("2d");
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // latar: langit malam yang sama, digambar ulang untuk kanvas tegak
    const g = ctx.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, P.bg0); g.addColorStop(1, P.bg1); ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH);
    const r = D.rng(9); ctx.fillStyle = "#fff"; for (let i = 0; i < 160; i++) { const x = r() * SW, y = r() * SH, rad = r() * 1.6 + 0.3, ph = r() * 6.28; ctx.globalAlpha = 0.2 + 0.4 * (0.5 + 0.5 * Math.sin(t + ph)); ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.283); ctx.fill(); } ctx.globalAlpha = 1;
    const top = Math.max(IMG_TOP, hookBand(ctx, TL, t) + 40), nb = narrationBox(ctx, b), bot = Math.min(IMG_BOT, nb.y0 - 38);
    if (b.scene === "short_cta") cta(ctx, b, l, TL, t);
    else {
      octx.save(); octx.setTransform(1, 0, 0, 1, 0, 0);
      const sl = l * (b.src_dur ? b.src_dur / b.dur : 1) + (b.at || 0);
      const fn = K.SCENES[b.scene]; if (fn) fn(octx, { ...b, id: b.src || b.id, text: b.src_text || b.text, audio: b.src_audio || b.audio, dur: b.src_dur || b.dur, start: 0, speech: b.src_lead != null ? b.src_lead : 0.4 }, sl, t, TL); else D.bg(octx, t);
      octx.restore();
      crops(ctx, off, b.crops || [[0, 0, 1920, 1080]], top, bot);
    }
    narration(ctx, b, l, nb);
    ctx.restore(); return b;
  };
})(typeof window !== "undefined" ? window : globalThis);
