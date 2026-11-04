/* TikTok core: mesin gambar video TikTok vertikal 1080x1920 (konsep inti informatika, terpisah dari seri belajar).
   TikTok.draw(ctx, t, TL) menggambar frame pada detik t secara deterministik (render_tiktok.py, cek_tiktok.py).
   Adegan per video ditambahkan di tiktok/<kode>/scenes.js: Object.assign(TikTok.SCENES, { nama(ctx, b, l, t, TL, A) {...} }).
     b  = beat (id, scene, text, start, speech, audio, dur, dan kunci bebas lain dari script.json)
     l  = detik sejak awal beat;  t = detik sejak awal video;  A = area gambar {x, y, w, h, cx, cy, bot}
   Tata letak (lihat PANDUAN.md): kait besar di beat pertama; chip topik di atas (y 196–260); area gambar di tengah;
   kotak narasi di bawah (dasarnya y 1590, lebar x 50–880) dengan garis kemajuan.
   Ruang aman TikTok: tombol kanan x > 900 pada y 900–1500 dan keterangan bawah y > 1600 dibiarkan bebas dari teks penting.
   Tokoh: Bip, makhluk kecil bulat berantena dengan mata besar. Palet gelap pekat dengan aksen kuning, pink, tosca, biru. */
(function (global) {
  const SW = 1080, SH = 1920;
  const FONT = "Inter, 'Segoe UI', Roboto, Arial, sans-serif";
  const C = {
    bg: "#0B0E2A", bg2: "#141A45", panel: "#1B2257", panel2: "#252E6E", line: "#3A4590",
    ink: "#FFFFFF", ink2: "#B8C0EE", mute: "#7480BE",
    kuning: "#FFD23F", pink: "#FF4F9A", tosca: "#22E3C4", biru: "#4DA3FF",
    good: "#22E3C4", bad: "#FF5A5F", goodBg: "#0F3B45", badBg: "#4A1A33",
    bip: "#22E3C4", bipDark: "#0E9C88", bipLight: "#8FF5E3", eye: "#FFFFFF", pupil: "#0B0E2A", cheek: "#FF4F9A"
  };
  const SAFE = { right: 900, rightTop: 900, rightBot: 1500, bottom: 1600 };
  const NARR = { x: 50, w: 830, bot: 1590, sizes: [54, 48, 42], maxLines: 4, lh: 1.28, padTop: 28, padBot: 40 };

  // ---------- pembantu dasar ----------
  const ease = u => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const back = u => { u = clamp(u, 0, 1); const c = 1.70158; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };  // muncul dengan sedikit memantul
  const rnd = i => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };       // acak tetap (deterministik)
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");                                // 1000000 -> 1.000.000

  function rr(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function font(ctx, size, weight) { ctx.font = `${weight || 700} ${size}px ${FONT}`; }
  // opt: weight, color, align, base, fit (lebar maksimum: huruf diperkecil bila perlu), shadow, alpha
  function text(ctx, s, x, y, size, opt = {}) {
    s = String(s); font(ctx, size, opt.weight);
    while (opt.fit && size > 18 && ctx.measureText(s).width > opt.fit) { size -= 2; font(ctx, size, opt.weight); }
    ctx.fillStyle = opt.color || C.ink; ctx.textAlign = opt.align || "left"; ctx.textBaseline = opt.base || "alphabetic";
    if (opt.shadow) { ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; }
    ctx.fillText(s, x, y);
    if (opt.shadow) ctx.restore();
    return size;
  }
  function wrap(ctx, s, size, weight, maxW) {
    font(ctx, size, weight);
    const words = String(s).split(" "), lines = []; let cur = "";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }
  function para(ctx, s, x, y, size, maxW, opt = {}) {
    const lines = wrap(ctx, s, size, opt.weight || 600, maxW), lh = size * (opt.lh || 1.3);
    richLines(ctx, lines, x, y, size, lh, { ...opt, weight: opt.weight || 600 });
    return lines.length * lh;
  }
  // penanda warna: opt.em = daftar kata/frasa; frasa ("satu juta") hanya diwarnai bila kata-katanya berurutan.
  // emFlags(teks, em) -> array benar/salah per kata (pisah spasi); richLine menerima opt.flags (potongan untuk baris itu)
  const norm = w => w.toLowerCase().replace(/^[^0-9a-zà-ž@]+|[^0-9a-zà-ž]+$/gi, "");
  function emFlags(s, em) {
    const words = String(s).split(" ").map(norm), f = words.map(() => false);
    for (const p of em || []) {
      const ws = String(p).split(" ").map(norm);
      for (let i = 0; i + ws.length <= words.length; i++) if (ws.every((w, k) => words[i + k] === w)) ws.forEach((_, k) => f[i + k] = true);
    }
    return f;
  }
  // satu baris teks; kata bertanda (opt.flags, atau opt.em untuk baris ini saja) berwarna opt.emColor (bawaan kuning)
  function richLine(ctx, line, x, y, size, opt = {}) {
    const flags = opt.flags || (opt.em && opt.em.length ? emFlags(line, opt.em) : null);
    font(ctx, size, opt.weight || 700);
    if (!flags || !flags.some(Boolean)) return text(ctx, line, x, y, size, { ...opt, fit: opt.fit || 0 });
    const words = line.split(" "), sp = ctx.measureText(" ").width, wid = words.map(w => ctx.measureText(w).width);
    const total = wid.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    let cx = opt.align === "center" ? x - total / 2 : opt.align === "right" ? x - total : x;
    words.forEach((w, i) => { text(ctx, w, cx, y, size, { ...opt, align: "left", fit: 0, color: flags[i] ? (opt.emColor || C.kuning) : (opt.color || C.ink) }); cx += wid[i] + sp; });
    return size;
  }
  // beberapa baris hasil wrap() dengan penanda dari seluruh teks
  function richLines(ctx, lines, x, y, size, lh, opt = {}) {
    const all = emFlags(lines.join(" "), opt.em); let k = 0;
    lines.forEach((ln, i) => { const n = ln.split(" ").length; richLine(ctx, ln, x, y + i * lh, size, { ...opt, flags: all.slice(k, k + n) }); k += n; });
  }
  function card(ctx, x, y, w, h, opt = {}) {
    ctx.save();
    if (opt.glow) { ctx.shadowColor = opt.glow; ctx.shadowBlur = 40; }
    ctx.fillStyle = opt.fill || C.panel; rr(ctx, x, y, w, h, opt.r ?? 30); ctx.fill(); ctx.restore();
    if (opt.stroke) { ctx.strokeStyle = opt.stroke; ctx.lineWidth = opt.lw || 5; rr(ctx, x, y, w, h, opt.r ?? 30); ctx.stroke(); }
  }
  function pill(ctx, s, cx, cy, size, opt = {}) {           // label berbentuk kapsul, mengembalikan lebarnya
    font(ctx, size, opt.weight || 800); const w = ctx.measureText(s).width + size * 1.3, h = size * 1.7;
    card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: opt.fill || C.kuning, r: h / 2, stroke: opt.stroke, lw: opt.lw });
    text(ctx, s, cx, cy + size * 0.36, size, { align: "center", weight: opt.weight || 800, color: opt.color || C.bg });
    return w;
  }
  function arrow(ctx, x1, y1, x2, y2, color, lw = 10, head = 30) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * head * 0.6, y2 - Math.sin(a) * head * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - Math.cos(a - 0.45) * head, y2 - Math.sin(a - 0.45) * head);
    ctx.lineTo(x2 - Math.cos(a + 0.45) * head, y2 - Math.sin(a + 0.45) * head); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function check(ctx, cx, cy, s, color) {
    ctx.save(); ctx.strokeStyle = color || C.good; ctx.lineWidth = s * 0.18; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(cx - s * 0.38, cy); ctx.lineTo(cx - s * 0.1, cy + s * 0.3); ctx.lineTo(cx + s * 0.42, cy - s * 0.32); ctx.stroke(); ctx.restore();
  }
  function cross(ctx, cx, cy, s, color) {
    ctx.save(); ctx.strokeStyle = color || C.bad; ctx.lineWidth = s * 0.18; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx - s * 0.32, cy - s * 0.32); ctx.lineTo(cx + s * 0.32, cy + s * 0.32);
    ctx.moveTo(cx + s * 0.32, cy - s * 0.32); ctx.lineTo(cx - s * 0.32, cy + s * 0.32); ctx.stroke(); ctx.restore();
  }
  function lock(ctx, cx, cy, s, open, color) {             // gembok: open 0 (tertutup) .. 1 (terbuka)
    ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = color || C.kuning; ctx.fillStyle = color || C.kuning;
    ctx.lineWidth = s * 0.13; ctx.lineCap = "round";
    ctx.save(); ctx.translate(s * 0.22 * (open || 0), -s * 0.28 * (open || 0));
    ctx.beginPath(); ctx.arc(0, -s * 0.12, s * 0.26, Math.PI, 0); ctx.lineTo(s * 0.26, s * 0.02); ctx.moveTo(-s * 0.26, -s * 0.12); ctx.lineTo(-s * 0.26, s * 0.02); ctx.stroke(); ctx.restore();
    rr(ctx, -s * 0.4, 0, s * 0.8, s * 0.6, s * 0.12); ctx.fill();
    ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(0, s * 0.26, s * 0.08, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-s * 0.03, s * 0.28, s * 0.06, s * 0.16);
    ctx.restore();
  }

  // ---------- tokoh: Bip ----------
  // opt: mood (happy | wow | think | sad), t (detik, untuk kedip dan antena bergoyang), wave (lambaikan tangan), look [dx, dy] (-1..1),
  //      bounce (lompatan per detik), color (warna badan lain)
  function bip(ctx, cx, cy, s, opt = {}) {
    const t = opt.t || 0, mood = opt.mood || "happy";
    const hop = opt.bounce ? Math.abs(Math.sin(t * Math.PI * opt.bounce)) * s * 0.08 : 0;
    const body = opt.color || C.bip;
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(0, s * 0.5, s * 0.36 * (1 - hop / s), s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.translate(0, -hop);
    // kaki
    ctx.fillStyle = C.bipDark; ctx.beginPath(); ctx.ellipse(-s * 0.17, s * 0.43, s * 0.11, s * 0.07, 0, 0, Math.PI * 2); ctx.ellipse(s * 0.17, s * 0.43, s * 0.11, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    // antena
    const sway = Math.sin(t * 3.2) * 0.12;
    const ax = Math.sin(sway) * s * 0.3, ay = -s * 0.42 - Math.cos(sway) * s * 0.26;
    ctx.strokeStyle = C.bipDark; ctx.lineWidth = s * 0.035; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, -s * 0.4); ctx.quadraticCurveTo(ax * 0.3, (ay - s * 0.4) / 2, ax, ay); ctx.stroke();
    ctx.save(); ctx.shadowColor = C.kuning; ctx.shadowBlur = s * 0.25; ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(ax, ay, s * 0.065, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // tangan
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(-s * 0.44, s * 0.1, s * 0.08, s * 0.12, 0.5, 0, Math.PI * 2); ctx.fill();
    if (opt.wave !== undefined) {
      ctx.save(); ctx.translate(s * 0.38, -s * 0.02); ctx.rotate(-1.1 + Math.sin(opt.wave * 7) * 0.35);
      ctx.beginPath(); ctx.ellipse(0, -s * 0.16, s * 0.08, s * 0.16, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    } else { ctx.beginPath(); ctx.ellipse(s * 0.44, s * 0.1, s * 0.08, s * 0.12, -0.5, 0, Math.PI * 2); ctx.fill(); }
    // badan
    const g = ctx.createRadialGradient(-s * 0.15, -s * 0.2, s * 0.05, 0, 0, s * 0.48);
    g.addColorStop(0, C.bipLight); g.addColorStop(0.35, body); g.addColorStop(1, C.bipDark);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.42, 0, 0, Math.PI * 2); ctx.fill();
    // pipi
    ctx.fillStyle = "rgba(255,79,154,0.55)"; ctx.beginPath(); ctx.ellipse(-s * 0.27, s * 0.1, s * 0.07, s * 0.045, 0, 0, Math.PI * 2); ctx.ellipse(s * 0.27, s * 0.1, s * 0.07, s * 0.045, 0, 0, Math.PI * 2); ctx.fill();
    // mata
    const blink = (t % 3.3) > 3.18, big = mood === "wow" ? 1.15 : 1;
    const [lx, ly] = opt.look || (mood === "think" ? [0.6, -0.7] : [0, 0]);
    for (const k of [-1, 1]) {
      const ex = k * s * 0.15, ey = -s * 0.06;
      ctx.fillStyle = C.eye; ctx.beginPath(); ctx.ellipse(ex, ey, s * 0.11 * big, blink ? s * 0.015 : s * 0.13 * big, 0, 0, Math.PI * 2); ctx.fill();
      if (!blink) {
        ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(ex + lx * s * 0.04, ey + ly * s * 0.05, s * 0.065, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex + lx * s * 0.04 - s * 0.025, ey + ly * s * 0.05 - s * 0.03, s * 0.022, 0, Math.PI * 2); ctx.fill();
      }
      if (mood === "sad" || mood === "think") {
        ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.025; ctx.beginPath();
        if (mood === "sad") { ctx.moveTo(ex - k * s * 0.09, ey - s * 0.17); ctx.lineTo(ex + k * s * 0.05, ey - s * 0.2); }
        else { ctx.moveTo(ex - s * 0.08, ey - s * 0.19 - (k > 0 ? s * 0.03 : 0)); ctx.lineTo(ex + s * 0.08, ey - s * 0.19); }
        ctx.stroke();
      }
    }
    // mulut
    ctx.strokeStyle = C.pupil; ctx.fillStyle = C.pupil; ctx.lineWidth = s * 0.03; ctx.lineCap = "round";
    if (mood === "wow") { ctx.beginPath(); ctx.ellipse(0, s * 0.17, s * 0.05, s * 0.065, 0, 0, Math.PI * 2); ctx.fill(); }
    else if (mood === "sad") { ctx.beginPath(); ctx.arc(0, s * 0.22, s * 0.07, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (mood === "think") { ctx.beginPath(); ctx.moveTo(-s * 0.05, s * 0.16); ctx.lineTo(s * 0.06, s * 0.14); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(0, s * 0.1, s * 0.08, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    ctx.restore();
  }
  function bubble(ctx, s, x, y, w, size, opt = {}) {       // balon kata; (x, y) = pojok kiri bawah balon; ekor di opt.tailX
    const lines = wrap(ctx, s, size, 700, w - 56), h = lines.length * size * 1.25 + 44;
    card(ctx, x, y - h, w, h, { fill: opt.fill || "#FFFFFF", r: 28 });
    const tx = opt.tailX ?? x + 70; ctx.fillStyle = opt.fill || "#FFFFFF";
    ctx.beginPath(); ctx.moveTo(tx - 18, y - 2); ctx.lineTo(tx + 18, y - 2); ctx.lineTo(tx + (opt.tailDir || 0), y + 30); ctx.closePath(); ctx.fill();
    richLines(ctx, lines, x + w / 2, y - h + 22 + size, size, size * 1.25, { align: "center", weight: 700, color: opt.color || C.bg, em: opt.em, emColor: opt.emColor || C.pink });
    return h;
  }

  // ---------- waktu: isyarat narasi ----------
  // cue(b, l, f): detik sejak isyarat f; f = pecahan narasi (0..1) atau kata/frasa dari b.text (diperkirakan dari letak hurufnya)
  function cueAt(b, f) {
    const sp = (b.speech ?? b.start) - b.start, au = b.audio || 2;
    let fr = f;
    if (typeof f === "string") { const i = b.text.toLowerCase().indexOf(f.toLowerCase()); fr = i < 0 ? 0 : i / Math.max(1, b.text.length); }
    return sp + clamp(fr || 0, 0, 1) * au;
  }
  const cue = (b, l, f) => l - cueAt(b, f);
  const ph = (b, l, f, d = 0.4) => ease(cue(b, l, f) / d);           // 0 -> 1 mulai dari isyarat f selama d detik
  const pop = (b, l, f, d = 0.45) => cue(b, l, f) <= 0 ? 0 : back(cue(b, l, f) / d);  // seperti ph, tetapi memantul

  // ---------- latar, chip topik, kotak narasi ----------
  function background(ctx, t) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, SW, SH);
    const g = ctx.createRadialGradient(540, 640, 60, 540, 640, 1150);
    g.addColorStop(0, "rgba(77,163,255,0.20)"); g.addColorStop(0.55, "rgba(255,79,154,0.05)"); g.addColorStop(1, "rgba(11,14,42,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH);
    ctx.fillStyle = "rgba(184,192,238,0.08)"; ctx.beginPath();
    const off = (t * 12) % 72;
    for (let y = -72; y < SH + 72; y += 72) for (let x = 36; x < SW; x += 72) { ctx.moveTo(x + 3, y + off); ctx.arc(x, y + off, 3, 0, Math.PI * 2); }
    ctx.fill();
  }
  function topicChip(ctx, s) {
    font(ctx, 34, 800); const w = Math.min(960, ctx.measureText(s).width + 96);
    card(ctx, 60, 196, w, 64, { fill: "rgba(27,34,87,0.92)", r: 32, stroke: C.line, lw: 3 });
    ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.arc(96, 228, 10, 0, Math.PI * 2); ctx.fill();
    text(ctx, s, 122, 240, 34, { weight: 800, color: C.ink, fit: w - 90 });
  }
  function narrLayout(ctx, b) {
    const tw = NARR.w - 56; let size = NARR.sizes[NARR.sizes.length - 1], lines = null;
    for (const sz of NARR.sizes) { const ln = wrap(ctx, b.text, sz, 700, tw); if (ln.length <= 3) { size = sz; lines = ln; break; } }
    if (!lines) for (const sz of NARR.sizes) { const ln = wrap(ctx, b.text, sz, 700, tw); if (ln.length <= NARR.maxLines || sz === size) { size = sz; lines = ln; break; } }
    const h = lines.length * size * NARR.lh + NARR.padTop + NARR.padBot;
    return { size, lines, h, y0: NARR.bot - h };
  }
  function narration(ctx, b, l, nb) {
    const { size, lines, h, y0 } = nb, x = NARR.x, w = NARR.w;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8;
    ctx.fillStyle = "rgba(20,26,69,0.96)"; rr(ctx, x, y0, w, h, 28); ctx.fill(); ctx.restore();
    ctx.strokeStyle = C.line; ctx.lineWidth = 3; rr(ctx, x, y0, w, h, 28); ctx.stroke();
    const sp = (b.speech ?? b.start) - b.start, frac = clamp((l - sp) / (b.audio || 1), 0, 1);
    ctx.fillStyle = "rgba(184,192,238,0.18)"; rr(ctx, x + 28, y0 + h - 22, w - 56, 10, 5); ctx.fill();
    if (frac > 0) { ctx.fillStyle = C.kuning; rr(ctx, x + 28, y0 + h - 22, Math.max(10, (w - 56) * frac), 10, 5); ctx.fill(); }
    richLines(ctx, lines, x + w / 2, y0 + NARR.padTop + size * 0.98, size, size * NARR.lh, { align: "center", weight: 700, color: C.ink, em: b.em });
  }

  // ---------- adegan bawaan ----------
  // Semua adegan: fn(ctx, b, l, t, TL, A). Kunci beat yang dipakai ditulis di atas tiap adegan.
  const SCENES = {
    // kait (beat pertama): b.big (bawaan TL.hook) sangat besar, kata di b.em berwarna; b.art = nama adegan gambar di bawahnya
    // (dipanggil dengan area sisa), tanpa b.art: Bip terkejut. Teks tampil penuh dalam 0,5 detik.
    kait(ctx, b, l, t, TL, A) {
      const s = b.big || TL.hook || TL.title;
      let size = 104, lines;
      for (; size >= 64; size -= 4) { lines = wrap(ctx, s, size, 900, A.w - 40); if (lines.length <= (b.maxLines || 4)) break; }
      const lh = size * 1.12, fl = emFlags(lines.join(" "), b.em); let k = 0;
      lines.forEach((ln, i) => {
        const n = ln.split(" ").length, flags = fl.slice(k, k + n); k += n;
        const u = back((l - 0.05 - i * 0.09) / 0.35); if (u <= 0) return;
        ctx.save(); ctx.translate(SW / 2, A.y + 20 + size * 0.9 + i * lh); ctx.scale(0.7 + 0.3 * u, 0.7 + 0.3 * u); ctx.globalAlpha = clamp(u, 0, 1);
        richLine(ctx, ln, 0, 0, size, { align: "center", weight: 900, color: C.ink, flags, shadow: true }); ctx.restore();
      });
      const top = A.y + 20 + lines.length * lh + 40, sub = { ...A, y: top, h: A.bot - top, cy: (top + A.bot) / 2 };
      if (b.art && SCENES[b.art]) SCENES[b.art](ctx, b, l, t, TL, sub);
      else bip(ctx, sub.cx, sub.cy, Math.min(360, sub.h * 0.8), { mood: "wow", t, bounce: 1.5 });
    },
    // poin: b.head (judul kecil), b.items [teks...] muncul berurutan pada isyarat b.cues [kata/pecahan...] (bawaan merata),
    // b.icons ["check"|"x"|"1"...] (bawaan nomor), b.mood untuk Bip kecil di pojok kanan atas
    poin(ctx, b, l, t, TL, A) {
      const items = b.items || [], n = items.length;
      let y = A.y + 10;
      if (b.head) { text(ctx, b.head, A.x + 10, y + 60, 62, { weight: 900, color: C.kuning, fit: A.w - 200 }); y += 110; }
      bip(ctx, A.x + A.w - 70, A.y + 60, 130, { mood: b.mood || "happy", t });
      const gap = 30, ch = Math.min(220, (A.bot - y - gap * (n - 1)) / Math.max(1, n));
      items.forEach((it, i) => {
        const cueI = b.cues ? b.cues[i] : (i + 0.15) / n * 0.85, u = pop(b, l, cueI);
        if (u <= 0) return;
        const yy = y + i * (ch + gap);
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate((1 - u) * -80, 0);
        card(ctx, A.x, yy, 820, ch, { fill: C.panel, stroke: C.line, lw: 3 });
        const ic = (b.icons || [])[i] || String(i + 1), cx = A.x + 80, cy = yy + ch / 2;
        ctx.fillStyle = ic === "x" ? C.bad : ic === "check" ? C.good : [C.kuning, C.pink, C.tosca, C.biru][i % 4];
        ctx.beginPath(); ctx.arc(cx, cy, 46, 0, Math.PI * 2); ctx.fill();
        if (ic === "check") check(ctx, cx, cy, 52, C.bg); else if (ic === "x") cross(ctx, cx, cy, 52, C.bg);
        else text(ctx, ic, cx, cy + 18, 50, { align: "center", weight: 900, color: C.bg });
        const ls = wrap(ctx, it, 50, 800, 640), sz = ls.length > 2 ? 42 : 50, ls2 = wrap(ctx, it, sz, 800, 640);
        ls2.forEach((ln, k) => text(ctx, ln, A.x + 150, cy + sz * 0.36 + (k - (ls2.length - 1) / 2) * sz * 1.2, sz, { weight: 800, color: C.ink }));
        ctx.restore();
      });
    },
    // banding: dua kartu bertumpuk. b.a, b.b = {label, value, note, tone: "bad"|"good"|"kuning"}; b.b muncul pada isyarat b.cueB (bawaan 0,45)
    banding(ctx, b, l, t, TL, A) {
      const half = (A.h - 70) / 2;
      const one = (o, y, u) => {
        if (!o || u <= 0) return;
        const col = o.tone === "bad" ? C.bad : o.tone === "good" ? C.good : C.kuning;
        ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate(0, (1 - u) * 60);
        card(ctx, A.x, y, 820, half, { fill: o.tone === "bad" ? C.badBg : o.tone === "good" ? C.goodBg : C.panel, stroke: col, lw: 6 });
        const cx = A.x + 410;
        text(ctx, o.label || "", cx, y + 74, 44, { align: "center", weight: 800, color: C.ink, fit: 740 });
        const vs = text(ctx, o.value || "", cx, y + half * 0.5 + 62, 116, { align: "center", weight: 900, color: col, fit: 760, shadow: true });
        if (o.note) text(ctx, o.note, cx, y + half - 40, 36, { align: "center", weight: 700, color: C.ink2, fit: 740 });
        ctx.restore(); return vs;
      };
      one(b.a, A.y, pop(b, l, b.cueA ?? 0));
      const ub = pop(b, l, b.cueB ?? 0.45);
      if (ub > 0) { ctx.save(); ctx.globalAlpha = clamp(ub, 0, 1); ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(A.x + 410, A.y + half + 35, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, "VS", A.x + 410, A.y + half + 50, 40, { align: "center", weight: 900, color: C.ink }); ctx.restore(); }
      one(b.b, A.y + half + 70, ub);
    },
    // angka: b.label (atas), b.num (angka besar; bila b.count, dihitung naik dari 0 ke angkanya), b.sub (bawah), b.tone,
    // b.cueNum (isyarat angka mulai, bawaan 0), b.mood (Bip di bawah; null = tanpa Bip)
    angka(ctx, b, l, t, TL, A) {
      const col = b.tone === "bad" ? C.bad : b.tone === "good" ? C.good : b.tone === "pink" ? C.pink : b.tone === "biru" ? C.biru : C.kuning;
      const y0 = A.y + A.h * 0.12;
      if (b.label) text(ctx, b.label, SW / 2, y0 + 50, 54, { align: "center", weight: 800, color: C.ink, fit: 940 });
      const u = pop(b, l, b.cueNum ?? 0);
      let s = String(b.num ?? "");
      if (b.count && u > 0) {
        const m = s.match(/^(\D*)([\d.]+)(.*)$/);
        if (m) { const v = Number(m[2].replace(/\./g, "")), k = ease(cue(b, l, b.cueNum ?? 0) / (b.countDur || 1.3)); s = m[1] + fmt(v * k) + m[3]; }
      }
      if (u > 0) {
        ctx.save(); ctx.translate(SW / 2, y0 + 250); ctx.scale(0.6 + 0.4 * u, 0.6 + 0.4 * u); ctx.globalAlpha = clamp(u, 0, 1);
        text(ctx, s, 0, 0, b.numSize || 190, { align: "center", weight: 900, color: col, fit: 960, shadow: true }); ctx.restore();
      }
      let sh = 0;
      if (b.sub) { sh = wrap(ctx, b.sub, 46, 700, 900).length * 46 * 1.3; const us = ph(b, l, b.cueSub ?? 0.3); if (us > 0) { ctx.save(); ctx.globalAlpha = us; para(ctx, b.sub, SW / 2, y0 + 370, 46, 900, { align: "center", weight: 700, color: C.ink2, em: b.subEm }); ctx.restore(); } }
      const btop = y0 + 370 + sh + 10, bs = Math.min(260, (A.bot - btop) * 0.85);   // Bip di sisa ruang di bawah keterangan
      if (b.mood !== null && bs > 80) bip(ctx, 480, btop + (A.bot - btop) / 2, bs, { mood: b.mood || "wow", t, bounce: 1.2 });
    },
    // bip: Bip besar dengan balon kata b.say (kata di b.sayEm berwarna pink), b.mood
    bip(ctx, b, l, t, TL, A) {
      const u = pop(b, l, 0);
      if (b.say && u > 0) { ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); bubble(ctx, b.say, A.x + 40, A.y + 330, 760, 52, { em: b.sayEm, tailX: A.x + 400 }); ctx.restore(); }
      bip(ctx, 480, A.y + 330 + (A.bot - A.y - 330) / 2, Math.min(420, (A.bot - A.y - 330) * 0.85), { mood: b.mood || "happy", t, bounce: 1 });
    },
    // akhir: kartu ajakan subscribe. TL.channel (bawaan "youtube.com/@iteachswe"), b.head (bawaan "Mau belajar lebih banyak?")
    akhir(ctx, b, l, t, TL, A) {
      const url = TL.channel || "youtube.com/@iteachswe";
      text(ctx, b.head || "Mau belajar lebih banyak?", SW / 2, A.y + 80, 64, { align: "center", weight: 900, color: C.ink, fit: 960 });
      bip(ctx, SW / 2, A.y + 330, 300, { mood: "happy", t, wave: l });
      const u = pop(b, l, 0.05);
      ctx.save(); ctx.translate(SW / 2, A.y + 600); ctx.scale(0.7 + 0.3 * u, 0.7 + 0.3 * u); ctx.globalAlpha = clamp(u, 0, 1);
      card(ctx, -480, -85, 960, 170, { fill: C.panel, stroke: C.kuning, lw: 6, glow: "rgba(255,210,63,0.45)" });
      text(ctx, url, 0, 26, 78, { align: "center", weight: 900, color: C.kuning, fit: 900 }); ctx.restore();
      // tombol subscribe (digambar sendiri, bukan logo): berdenyut, lalu "diketuk"
      const ub = pop(b, l, "subscribe"), tap = cue(b, l, "subscribe") - 0.6, by = A.y + 800;
      if (ub > 0) {
        const pulse = 1 + 0.04 * Math.sin(l * 6), pressed = tap > 0 && tap < 0.25 ? 0.93 : 1;
        ctx.save(); ctx.translate(480, by); ctx.scale(ub * pulse * pressed, ub * pulse * pressed);
        card(ctx, -300, -70, 600, 140, { fill: tap > 0.12 ? C.panel2 : C.pink, r: 70, glow: "rgba(255,79,154,0.55)" });
        text(ctx, tap > 0.12 ? "SUBSCRIBED" : "SUBSCRIBE", 30, 20, 56, { align: "center", weight: 900, color: C.ink, fit: 440 });
        // ikon lonceng
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(-235, 22); ctx.quadraticCurveTo(-232, -32, -205, -32); ctx.quadraticCurveTo(-178, -32, -175, 22); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(-205, 30, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-243, 18, 76, 8);
        ctx.restore();
        if (tap > 0 && tap < 0.9) { ctx.save(); ctx.strokeStyle = C.ink; ctx.globalAlpha = 1 - tap / 0.9; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(620, by + 20, 30 + tap * 120, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        if (tap > -0.6 && tap < 1.2) { ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(620 + Math.max(0, -tap) * 120, by + 20 + Math.max(0, -tap) * 160, 26, 0, Math.PI * 2); ctx.fill(); }
      }
      if (b.note !== null) { const un = ph(b, l, "youtube", 0.5); if (un > 0) { ctx.save(); ctx.globalAlpha = un; text(ctx, b.note || "Channel iteachswe di YouTube", 480, by + 130, 40, { align: "center", weight: 700, color: C.ink2, fit: 780 }); ctx.restore(); } }
    }
  };

  function beatAt(TL, t) {
    let b = TL.beats[0];
    for (const x of TL.beats) { if (t >= x.start) b = x; else break; }
    return b;
  }
  // area gambar untuk beat b: di bawah chip topik (atau dari y 220 pada kait/akhir) sampai 36 px di atas kotak narasi
  function areaFor(ctx, b, TL, nb) {
    const chip = TL.topik && !["kait", "akhir"].includes(b.scene) && !b.noChip;
    const y = chip ? 296 : 220, bot = nb.y0 - 36;
    return { x: 60, y, w: 960, h: bot - y, cx: 480, cy: (y + bot) / 2, bot, chip };
  }
  function draw(ctx, t, TL) {
    const b = beatAt(TL, t), l = t - b.start;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    background(ctx, t);
    const nb = narrLayout(ctx, b), A = areaFor(ctx, b, TL, nb);
    if (A.chip) topicChip(ctx, TL.topik);
    const fn = SCENES[b.scene];
    if (fn) {
      // peralihan antarbeat: area gambar masuk cepat (0,25 detik); b.cont = true untuk adegan yang menyambung tanpa peralihan
      const u = b.cont || b === TL.beats[0] ? 1 : ease(l / 0.25);
      ctx.save(); ctx.globalAlpha = u; ctx.translate(0, (1 - u) * 40);
      fn(ctx, b, l, t, TL, A); ctx.restore();
    }
    narration(ctx, b, l, nb);
    ctx.restore();
    return b;
  }

  global.TikTok = { draw, beatAt, areaFor, narrLayout, SW, SH, C, FONT, SAFE, NARR, SCENES,
    helpers: { rr, font, text, wrap, para, richLine, richLines, emFlags, card, pill, arrow, check, cross, lock, bip, bubble, ease, clamp, lerp, back, rnd, fmt, cue, cueAt, ph, pop } };
})(typeof window !== "undefined" ? window : globalThis);
