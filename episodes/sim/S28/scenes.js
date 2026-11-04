/* S28 Simulasi praktik: merekam dan menyunting video pendek di HP (memakai layar_hp.js + bantu.js).
   Kamera: HP mendatar digambar besar (lphone). Penyunting: aplikasi rekaan "Penyunting Video" di HP tegak + lup garis waktu.
   Cerita menyambung D9.5: video satu menit "Pilah Sampah Jadi Tiga" di kantin. Musik dari pustaka bebas lisensi rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp, B = K.bantu;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const { BLUE, RED, GREEN, ORANGE } = B;
  const PURPLE = "#7A5BC7", MUSIC = "#2E9E5B";

  // ---------- adegan video (kantin) ----------
  function person(c, x, y, s, o = {}) {   // (x, y) = kaki
    const dark = o.dark ? "#2A333A" : null;
    c.fillStyle = dark || (o.shirt || "#FFFFFF"); rr(c, x - s * 0.32, y - s * 1.15, s * 0.64, s * 0.62, s * 0.12); c.fill();
    if (!dark) { c.strokeStyle = "#D5DDE2"; c.lineWidth = Math.max(1, s * 0.02); c.stroke(); }
    c.fillStyle = dark || (o.pants || "#2F4E7D"); c.fillRect(x - s * 0.26, y - s * 0.55, s * 0.52, s * 0.55);
    c.fillStyle = dark || C.skin; c.beginPath(); c.arc(x, y - s * 1.42, s * 0.27, 0, Math.PI * 2); c.fill();
    c.fillStyle = dark || C.hair; c.beginPath(); c.arc(x, y - s * 1.5, s * 0.28, Math.PI, 0); c.fill();
    if (o.long) { c.fillRect(x - s * 0.28, y - s * 1.5, s * 0.1, s * 0.4); c.fillRect(x + s * 0.18, y - s * 1.5, s * 0.1, s * 0.4); }
    if (o.apron && !dark) { c.fillStyle = "#E8A9A0"; rr(c, x - s * 0.22, y - s * 1.0, s * 0.44, s * 0.5, s * 0.06); c.fill(); }
    if (!dark) { c.fillStyle = C.ink; c.beginPath(); c.arc(x - s * 0.09, y - s * 1.42, s * 0.03, 0, Math.PI * 2); c.arc(x + s * 0.09, y - s * 1.42, s * 0.03, 0, Math.PI * 2); c.fill();
      c.strokeStyle = C.ink; c.lineWidth = Math.max(1, s * 0.025); c.beginPath(); if (o.laugh) c.arc(x, y - s * 1.34, s * 0.09, 0, Math.PI); else c.arc(x, y - s * 1.36, s * 0.07, Math.PI * 0.15, Math.PI * 0.85); c.stroke(); }
    c.strokeStyle = dark || C.skin; c.lineWidth = s * 0.1; c.lineCap = "round"; c.beginPath();
    if (o.point) { c.moveTo(x + s * 0.3, y - s * 1.05); c.lineTo(x + s * 0.72, y - s * 0.9); } else { c.moveTo(x + s * 0.32, y - s * 1.05); c.lineTo(x + s * 0.38, y - s * 0.62); }
    c.moveTo(x - s * 0.32, y - s * 1.05); c.lineTo(x - s * 0.38, y - s * 0.62); c.stroke(); c.lineCap = "butt";
  }
  function bin(c, x, y, w, h, col, lab) { c.fillStyle = col; rr(c, x, y, w, h, w * 0.1); c.fill(); c.fillStyle = "rgba(0,0,0,0.15)"; c.fillRect(x - w * 0.05, y, w * 1.1, h * 0.12);
    text(c, lab, x + w / 2, y + h * 0.6, Math.max(8, w * 0.2), { align: "center", weight: 900, color: "#FFFFFF" }); }
  // o: backlit, kind ("baik"|"tangan"|"salah"), title (teks judul), focus, credit
  function scene(c, x, y, w, h, o = {}) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    const s = h / 360;
    c.fillStyle = "#F3E6CF"; c.fillRect(x, y, w, h); c.fillStyle = "#C98A57"; c.fillRect(x, y + h * 0.78, w, h * 0.22);
    if (o.backlit) { c.fillStyle = "#FFFFFF"; c.fillRect(x + w * 0.22, y + h * 0.06, w * 0.3, h * 0.55); const g = c.createRadialGradient(x + w * 0.37, y + h * 0.33, 10, x + w * 0.37, y + h * 0.33, w * 0.4); g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = g; c.fillRect(x, y, w, h); }
    else { c.fillStyle = "#BFDCE8"; c.fillRect(x + w * 0.62, y + h * 0.08, w * 0.22, h * 0.3); }
    bin(c, x + w * 0.55, y + h * 0.5, w * 0.1, h * 0.3, GREEN, "ORG"); bin(c, x + w * 0.68, y + h * 0.5, w * 0.1, h * 0.3, "#E0A23B", "ANO"); bin(c, x + w * 0.81, y + h * 0.5, w * 0.1, h * 0.3, RED, "B3");
    person(c, x + w * 0.37, y + h * 0.92, 150 * s, { long: true, point: !o.backlit, dark: o.backlit });
    if (o.kind === "salah") { person(c, x + w * 0.16, y + h * 0.95, 130 * s, { laugh: true, shirt: "#CFE3F2" }); c.fillStyle = "rgba(242,177,52,0.18)"; c.fillRect(x, y, w, h); }
    if (o.kind === "tangan") { c.fillStyle = "rgba(60,70,78,0.55)"; c.fillRect(x, y, w, h); c.fillStyle = C.skin; c.beginPath(); c.ellipse(x + w * 0.55, y + h * 0.75, w * 0.22, h * 0.32, -0.4, 0, Math.PI * 2); c.fill(); }
    if (o.title) { const fs = h * 0.12; c.font = `900 ${fs}px Inter`; const tw = c.measureText(o.title).width; c.fillStyle = "rgba(31,42,51,0.85)"; rr(c, x + w / 2 - tw / 2 - fs * 0.5, y + h * 0.08, tw + fs, fs * 1.6, fs * 0.3); c.fill();
      text(c, o.title, x + w / 2, y + h * 0.08 + fs * 1.15, fs, { align: "center", weight: 900, color: "#FFFFFF" }); }
    if (o.credit) { c.fillStyle = "rgba(31,42,51,0.85)"; c.fillRect(x, y + h * 0.78, w, h * 0.22); text(c, "Musik: Pagi Ceria, pustaka Penyunting Video", x + w / 2, y + h * 0.9, h * 0.055, { align: "center", weight: 800, color: "#FFFFFF" }); }
    c.restore();
  }
  // ---------- HP mendatar ----------
  // lebar layar di kanvas = w; drawL(c) dalam satuan lanskap 740 × 360
  function lphone(ctx, cx, cy, w, drawL, opt = {}) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Math.PI / 2);
    HP.phone(ctx, 0, 0, { h: w, status: false, nav: false, bg: "#11181D", shadow: opt.shadow }, c => { c.save(); c.transform(0, 1, -1, 0, 360, 0); drawL(c); c.restore(); });
    ctx.restore();
  }
  // UI kamera: o.rec (detik), focus {x, y, u}, shutterHl, meter (0..1 suara), noise
  function cam(c, o = {}) {
    scene(c, 0, 0, 740, 360, o);
    c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(640, 0, 100, 360);
    const r = o.rec != null; c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(690, 180, 32, 0, Math.PI * 2); c.fill(); c.fillStyle = RED;
    if (r) rr(c, 676, 166, 28, 28, 6), c.fill(); else { c.beginPath(); c.arc(690, 180, 25, 0, Math.PI * 2); c.fill(); }
    if (o.shutterHl) { c.strokeStyle = C.accent; c.lineWidth = 4; c.beginPath(); c.arc(690, 180, 40, 0, Math.PI * 2); c.stroke(); }
    c.fillStyle = "rgba(0,0,0,0.45)"; rr(c, 676, 70, 28, 22, 11); c.fill(); text(c, "1x", 690, 86, 13, { align: "center", weight: 800, color: "#FFFFFF" });
    if (r) { c.fillStyle = "rgba(0,0,0,0.5)"; rr(c, 280, 12, 120, 30, 15); c.fill(); c.fillStyle = RED; c.beginPath(); c.arc(300, 27, 7, 0, Math.PI * 2); c.fill();
      const t = Math.floor(o.rec); text(c, "00:" + String(t).padStart(2, "0"), 350, 34, 18, { align: "center", weight: 800, color: "#FFFFFF" }); }
    else { c.fillStyle = "rgba(0,0,0,0.45)"; rr(c, 290, 12, 100, 30, 15); c.fill(); text(c, "VIDEO", 340, 33, 15, { align: "center", weight: 900, color: "#F2B134" }); }
    if (o.focus) { const f = o.focus, sc = 1 + 0.4 * (1 - ease(clamp(f.u, 0, 1))); c.strokeStyle = "#F2B134"; c.lineWidth = 3; c.strokeRect(f.x - 40 * sc, f.y - 40 * sc, 80 * sc, 80 * sc); }
    if (o.meter != null) { c.fillStyle = "rgba(0,0,0,0.5)"; rr(c, 20, 300, 160, 40, 10); c.fill(); HP.icon(c, "mic", 40, 320, 18, "#FFFFFF");
      for (let i = 0; i < 12; i++) { const on = i < o.meter * 12; c.fillStyle = on ? (i > 9 ? RED : i > 6 ? "#F2B134" : "#4CB46A") : "rgba(255,255,255,0.25)"; c.fillRect(60 + i * 9, 312, 6, 16); } }
  }

  // ---------- Penyunting Video (HP tegak) ----------
  const SEC = t => t < 4 || t >= 38 ? "tangan" : t >= 20 && t < 26 ? "salah" : "baik";
  const TL = { x0: 16, x1: 344, strip: 388, sh: 56, text: 454, music: 484 };
  // o: clips [[a,b]], total (detik skala), sel (indeks klip), ph (detik timeline), trimL/trimR (detik sumber, untuk potong), text, music (vol), titleOn
  function layout(o) { const tot = o.total || 42, sc = (TL.x1 - TL.x0) / tot; let t = 0; const out = (o.clips || [[0, 42]]).map(([a, b], i) => { const r = { a, b, t0: t, x: TL.x0 + t * sc + (o.gapAt === i ? (o.gapX || 0) : 0), w: (b - a) * sc }; t += b - a; return r; }); return { sc, clips: out, tot }; }
  function thumb(c, x, y, w, h, k) { c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    if (k === "tangan") { c.fillStyle = "#4A555D"; c.fillRect(x, y, w, h); c.fillStyle = C.skin; c.beginPath(); c.ellipse(x + w * 0.6, y + h * 0.7, w * 0.4, h * 0.4, -0.4, 0, Math.PI * 2); c.fill(); }
    else { scene(c, x - w * 0.3, y, w * 1.6, h, { kind: k }); if (k === "salah") { c.fillStyle = "rgba(230,110,40,0.45)"; c.fillRect(x, y, w, h); c.fillStyle = RED; c.fillRect(x, y, w, 5); } } c.restore(); }
  function editor(c, o = {}) {
    c.fillStyle = "#1E262C"; c.fillRect(0, 0, HP.W, HP.H);
    HP.icon(c, "back", 28, 66, 24, "#FFFFFF"); text(c, "Pilah Sampah", 54, 74, 21, { weight: 800, color: "#FFFFFF" });
    HP.button(c, 262, 50, 84, 34, "Ekspor", { fill: BLUE, r: 10, size: 16, hl: o.expHl });
    const lay = layout(o), ph = o.ph || 0;
    // pratinjau: bingkai pada posisi garis putih
    let src = 0, acc = 0; (o.clips || [[0, 42]]).forEach(([a, b]) => { if (ph >= acc && ph < acc + (b - a)) src = a + ph - acc; acc += b - a; });
    c.fillStyle = "#000"; c.fillRect(0, 100, 360, 203);
    scene(c, 0, 100, 360, 203, { kind: SEC(src), title: o.text && ph < 3 ? "Pilah Sampah Jadi Tiga" : (o.titleTyping || null), credit: o.credit });
    const mm = s => "00:" + String(Math.floor(s)).padStart(2, "0");
    text(c, mm(ph) + " / " + mm(lay.tot), 16, 334, 15, { weight: 700, color: "#C9D4DB" });
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.moveTo(172, 318); c.lineTo(190, 328); c.lineTo(172, 338); c.closePath(); c.fill();
    // garis waktu
    c.fillStyle = "#2A343B"; c.fillRect(0, 352, HP.W, 250);
    for (let s = 0; s <= lay.tot; s += 2) { const x = TL.x0 + s * lay.sc; c.fillStyle = "#6B7A84"; c.fillRect(x, 362, 1, s % 10 === 0 ? 10 : 5); if (s % 10 === 0) text(c, mm(s).slice(3) + "s", x + 3, 376, 10, { weight: 700, color: "#8A99A3" }); }
    lay.clips.forEach((k, i) => {
      const n = Math.max(1, Math.round(k.w / 22)), tw = k.w / n;
      for (let j = 0; j < n; j++) { const st = k.a + (j + 0.5) * (k.b - k.a) / n; thumb(c, k.x + j * tw, TL.strip, tw - 1, TL.sh, SEC(st)); }
      if (o.dimFrom != null) { } // tidak dipakai
      c.strokeStyle = "#1E262C"; c.lineWidth = 2; c.strokeRect(k.x, TL.strip, k.w, TL.sh);
      if (o.sel === i) { c.strokeStyle = "#F2B134"; c.lineWidth = 3; c.strokeRect(k.x + 1.5, TL.strip - 2, k.w - 3, TL.sh + 4);
        c.fillStyle = "#F2B134"; rr(c, k.x - 6, TL.strip - 2, 9, TL.sh + 4, 3); c.fill(); rr(c, k.x + k.w - 3, TL.strip - 2, 9, TL.sh + 4, 3); c.fill(); }
    });
    // area yang dipotong (adegan potong)
    if (o.cutL) { c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(TL.x0, TL.strip, o.cutL * lay.sc, TL.sh); }
    if (o.cutR) { c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(TL.x1 - o.cutR * lay.sc, TL.strip, o.cutR * lay.sc, TL.sh); }
    if (o.handles) { const xl = TL.x0 + (o.cutL || 0) * lay.sc, xr = TL.x1 - (o.cutR || 0) * lay.sc; c.strokeStyle = "#F2B134"; c.lineWidth = 3; c.strokeRect(xl, TL.strip - 2, xr - xl, TL.sh + 4);
      c.fillStyle = "#F2B134"; rr(c, xl - 8, TL.strip - 2, 12, TL.sh + 4, 3); c.fill(); rr(c, xr - 4, TL.strip - 2, 12, TL.sh + 4, 3); c.fill(); }
    if (o.text) { const w = 3 * lay.sc * (o.textU == null ? 1 : o.textU); c.fillStyle = PURPLE; rr(c, TL.x0, TL.text, Math.max(10, w), 22, 6); c.fill(); text(c, "T  Pilah Sampah…", TL.x0 + 6, TL.text + 16, 11, { weight: 800, color: "#FFFFFF", fit: Math.max(10, w - 10) }); }
    if (o.music != null) { const w = lay.tot * lay.sc; c.fillStyle = MUSIC; rr(c, TL.x0, TL.music, w, 22, 6); c.fill(); if (o.musicHl) { c.strokeStyle = "#F2B134"; c.lineWidth = 3; rr(c, TL.x0, TL.music, w, 22, 6); c.stroke(); }
      c.fillStyle = "rgba(255,255,255,0.55)"; for (let x = TL.x0 + 70; x < TL.x0 + w - 4; x += 4) { const a = (Math.sin(x * 0.7) * 0.5 + 0.5) * 8 * (0.3 + o.music * 0.7); c.fillRect(x, TL.music + 11 - a, 2, a * 2); }
      text(c, "♪ Pagi Ceria", TL.x0 + 6, TL.music + 16, 11, { weight: 800, color: "#FFFFFF" }); }
    // garis putih (playhead)
    const px = TL.x0 + ph * lay.sc; c.fillStyle = "#FFFFFF"; c.fillRect(px - 1.5, 358, 3, 156); c.beginPath(); c.arc(px, 358, 7, 0, Math.PI * 2); c.fill();
    // bilah alat
    if (o.panel) o.panel(c); else {
      c.fillStyle = "#151B20"; c.fillRect(0, 610, HP.W, 102);
      TOOLS.forEach((s, i) => { const x = 45 + i * 90, hl = o.toolHl === i; if (hl) { c.fillStyle = "rgba(242,177,52,0.35)"; rr(c, x - 38, 618, 76, 82, 12); c.fill(); }
        toolIcon(c, s, x, 646); text(c, s, x, 686, 14, { align: "center", weight: 700, color: "#FFFFFF" }); });
    }
    return lay;
  }
  const TOOLS = ["Bagi", "Hapus", "Teks", "Audio"];
  const toolAt = i => [45 + i * 90, 656];
  function toolIcon(c, s, x, y) {
    c.strokeStyle = "#FFFFFF"; c.fillStyle = "#FFFFFF"; c.lineWidth = 2.5;
    if (s === "Bagi") { c.beginPath(); c.moveTo(x, y - 16); c.lineTo(x, y + 16); c.stroke(); c.beginPath(); c.moveTo(x - 4, y); c.lineTo(x - 14, y - 7); c.lineTo(x - 14, y + 7); c.closePath(); c.fill(); c.beginPath(); c.moveTo(x + 4, y); c.lineTo(x + 14, y - 7); c.lineTo(x + 14, y + 7); c.closePath(); c.fill(); }
    else if (s === "Hapus") HP.icon(c, "trash", x, y, 26, "#FFFFFF");
    else if (s === "Teks") text(c, "T", x, y + 11, 30, { align: "center", weight: 900, color: "#FFFFFF" });
    else HP.icon(c, "music", x, y, 26, "#FFFFFF");
  }
  // panel teks: input + pilihan
  function textPanel(typed, big, bg) { return c => {
    c.fillStyle = "#FFFFFF"; c.fillRect(0, 520, HP.W, 192); text(c, "Teks", 20, 548, 17, { weight: 900 });
    c.fillStyle = "#F4F7F9"; rr(c, 16, 560, 328, 42, 10); c.fill(); c.strokeStyle = BLUE; c.lineWidth = 2; rr(c, 16, 560, 328, 42, 10); c.stroke();
    text(c, typed || "Ketik teks…", 28, 588, 17, { weight: 700, color: typed ? C.ink : "#8A99A3" });
    [["Huruf besar", big], ["Latar gelap", bg], ["3 detik", big && bg]].forEach(([s, on], i) => { const x = 16 + i * 112; c.fillStyle = on ? BLUE : "#EEF1F4"; rr(c, x, 616, 104, 36, 18); c.fill(); text(c, s, x + 52, 639, 14, { align: "center", weight: 800, color: on ? "#FFFFFF" : C.ink }); });
    HP.button(c, 230, 664, 114, 40, "Selesai", { r: 10, size: 16 });
  }; }
  // pustaka musik
  const SONGS = [["Pagi Ceria", "1:20 · ceria"], ["Langkah Kecil", "2:05 · tenang"], ["Semangat Kantin", "1:45 · riang"], ["Hujan Sore", "1:58 · lembut"]];
  function library(c, o = {}) {
    HP.header(c, "Pustaka musik", { back: true });
    [["Bebas lisensi", true], ["Efek suara", false], ["Musikku", false]].forEach(([s, on], i) => { const x = 16 + i * 116; c.fillStyle = on ? MUSIC : "#FFFFFF"; rr(c, x, 116, 108, 36, 18); c.fill(); if (on && o.chipHl) { c.strokeStyle = C.accent; c.lineWidth = 3; rr(c, x, 116, 108, 36, 18); c.stroke(); }
      text(c, s, x + 54, 139, 14, { align: "center", weight: 800, color: on ? "#FFFFFF" : C.ink }); });
    c.fillStyle = C.goodBg; rr(c, 16, 164, 328, 50, 12); c.fill(); HP.icon(c, "check", 36, 189, 18, GREEN); HP.para(c, "Boleh dipakai di videomu. Sebutkan sumbernya.", 56, 184, 14, 280, { color: "#1F6E40", weight: 700 });
    const rows = HP.list(c, SONGS.map(([n, s], i) => ({ label: n, sub: s, app: { color: MUSIC, icon: "music" }, hl: o.pick === i })), { y: 226 });
    if (o.pick != null) { c.fillStyle = "#FFFFFF"; c.fillRect(0, 630, HP.W, 82); HP.button(c, 30, 646, 300, 50, "Tambah ke video", { fill: MUSIC, hl: o.addHl }); }
    return rows;
  }
  const LIB_ROWS = () => B.measure(m => library(m, {}));
  function volPanel(voice, music) { return c => {
    c.fillStyle = "#FFFFFF"; c.fillRect(0, 520, HP.W, 192); text(c, "Volume", 20, 548, 17, { weight: 900 });
    [["Suara klip", voice, BLUE], ["Musik", music, MUSIC]].forEach(([s, v, col], i) => { const y = 584 + i * 56; text(c, s, 20, y, 15, { weight: 800 }); text(c, Math.round(v * 100) + "%", 340, y, 15, { align: "right", weight: 900, color: col });
      c.fillStyle = "#DDE5EA"; rr(c, 20, y + 12, 320, 8, 4); c.fill(); c.fillStyle = col; rr(c, 20, y + 12, 320 * v, 8, 4); c.fill(); c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(20 + 320 * v, y + 16, 11, 0, Math.PI * 2); c.fill(); c.strokeStyle = col; c.lineWidth = 3; c.stroke(); });
  }; }
  // lembar ekspor. o: res (indeks), fps, prog (0..1), done, btnHl
  function exportSheet(c, o = {}) {
    c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(0, 0, HP.W, HP.H); c.fillStyle = "#FFFFFF"; rr(c, 0, 360, HP.W, 400, 24); c.fill();
    text(c, "Ekspor video", 20, 400, 21, { weight: 900 });
    text(c, "Resolusi", 20, 438, 15, { weight: 800, color: "#5B6B76" });
    ["720p", "1080p", "4K"].forEach((s, i) => { const x = 20 + i * 108, on = (o.res == null ? 0 : o.res) === i; c.fillStyle = on ? BLUE : "#EEF1F4"; rr(c, x, 448, 100, 40, 20); c.fill(); text(c, s, x + 50, 474, 16, { align: "center", weight: 800, color: on ? "#FFFFFF" : C.ink }); });
    text(c, "Frame per detik", 20, 520, 15, { weight: 800, color: "#5B6B76" });
    ["24", "30", "60"].forEach((s, i) => { const x = 20 + i * 108, on = (o.fps == null ? 0 : o.fps) === i; c.fillStyle = on ? BLUE : "#EEF1F4"; rr(c, x, 530, 100, 40, 20); c.fill(); text(c, s, x + 50, 556, 16, { align: "center", weight: 800, color: on ? "#FFFFFF" : C.ink }); });
    text(c, "Perkiraan ukuran: " + (o.res === 1 ? "60 MB" : "25 MB"), 20, 600, 15, { weight: 700, color: "#5B6B76" });
    if (o.prog != null) { HP.progress(c, 20, 630, 320, o.prog, { h: 12 }); text(c, o.prog >= 1 ? "Tersimpan di galeri" : "Mengekspor… " + Math.round(o.prog * 100) + "%", 180, 676, 17, { align: "center", weight: 800, color: o.prog >= 1 ? GREEN : C.ink }); }
    else HP.button(c, 20, 624, 320, 52, "Ekspor", { hl: o.btnHl });
  }
  const resAt = i => [70 + i * 108, 468], fpsAt = i => [70 + i * 108, 550];
  const EDIT_SRC = { u: 0, v: 350, w: 360, h: 180 };

  // ---------- adegan umum ----------
  B.art.tujuan = (ctx, l) => lphone(ctx, 1450, 470, 560, c => cam(c, { rec: 12 }));
  B.art.coba = (ctx, l) => lphone(ctx, 1470, 520, 520, c => cam(c, {}));
  B.art.periksa = (ctx, l) => { B.phone(ctx, c => editor(c, { clips: [[4, 20], [26, 38]], total: 28, text: true, music: 0.2, ph: 1 }), { cx: 520, cy: 480, h: 650 }); };

  Object.assign(K.SCENES, {
    izin(ctx, b, l) {
      const a = b.audio || b.dur;
      card(ctx, 110, 122, 1300, 700, { fill: "#F3E6CF", r: 22 }); ctx.fillStyle = "#C98A57"; ctx.fillRect(110, 680, 1300, 142);
      ctx.fillStyle = "#A4653A"; rr(ctx, 700, 520, 560, 40, 8); ctx.fill(); ctx.fillRect(720, 560, 30, 120); ctx.fillRect(1210, 560, 30, 120);
      person(ctx, 1000, 700, 150, { apron: true, shirt: "#F6F0E6" }); person(ctx, 440, 720, 130, { long: true }); person(ctx, 270, 730, 120, { shirt: "#CFE3F2" });
      HP.phone(ctx, 520, 560, { h: 70, status: false, nav: false, shadow: false }, c => scene(c, 0, 0, 360, 740, {}));
      const bub = (x, y, w, s, tx, ty, on) => { if (!on) return; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(tx - 16, y + 60); ctx.lineTo(tx, ty); ctx.lineTo(tx + 16, y + 60); ctx.fill(); const lines = wrap(ctx, s, 26, 700, w - 40); card(ctx, x, y, w, lines.length * 34 + 36, { fill: "#FFFFFF", r: 18 }); lines.forEach((ln, i) => text(ctx, ln, x + 20, y + 44 + i * 34, 26, { weight: 700 })); };
      bub(170, 170, 520, "Bu, boleh kami merekam video tentang memilah sampah di sini?", 440, 440, l > a * 0.12);
      bub(780, 230, 470, "Boleh. Kalau mau merekam wajah Ibu, bilang dulu, ya.", 990, 470, l > a * 0.4);
      const items = [["Bu Kantin", "boleh", true, 0.4], ["Dito", "boleh", true, 0.55], ["Rani", "tidak mau: jangan rekam wajahnya", false, 0.75]];
      card(ctx, 1450, 122, 370, 90 + items.length * 92, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, "IZIN DIREKAM", 1474, 166, 24, { weight: 900, color: C.accentDark });
      items.forEach(([n, s, ok, f], i) => { if (l < a * f) return; const y = 190 + i * 92; ctx.fillStyle = ok ? GREEN : RED; ctx.beginPath(); ctx.arc(1490, y + 22, 16, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ok ? "check" : "close", 1490, y + 22, 16, "#FFFFFF");
        text(ctx, n, 1520, y + 30, 24, { weight: 900 }); para(ctx, s, 1520, y + 58, 20, 280, { weight: 700, color: ok ? GREEN : RED, lh: 1.15 }); });
    },
    mendatar(ctx, b, l) {
      const a = b.audio || b.dur, u = ease(clamp((l - a * 0.12) / (a * 0.25), 0, 1));
      ctx.save(); ctx.translate(520, 470); ctx.rotate(-u * Math.PI / 2);
      HP.phone(ctx, 0, 0, { h: 560, status: false, nav: false, bg: "#11181D" }, c => { if (u < 0.5) scene(c, -190, 190, 740, 360, {}); else { c.save(); c.transform(0, 1, -1, 0, 360, 0); cam(c, {}); c.restore(); } });
      ctx.restore();
      if (l > a * 0.45) { const cmp = (x, y, land, ok, s) => { ctx.fillStyle = "#1F2A33"; rr(ctx, x, y, 340, 200, 10); ctx.fill();
          if (land) scene(ctx, x + 10, y + 10, 320, 156, {}); else scene(ctx, x + 125, y + 10, 90, 156, { kind: "baik" });
          B.badge(ctx, x, y + 210, ok, s, { w: 340, h: 60, size: 20 }); };
        text(ctx, "Di layar proyektor kelas:", 1450, 160, 24, { weight: 900 });
        cmp(1450, 190, false, false, "Direkam tegak: sempit."); cmp(1450, 480, true, true, "Direkam mendatar: pas."); }
      if (l > a * 0.75) B.tag(ctx, 520, 780, "Jangan berganti arah di tengah rekaman", { align: "center", fill: C.ink });
    },
    cahaya(ctx, b, l) {
      const a = b.audio || b.dur;
      lphone(ctx, 520, 300, 620, c => cam(c, { backlit: true }));
      B.badge(ctx, 870, 200, false, "Jendela terang di belakang: wajah gelap.", { w: 520, h: 90, size: 24 });
      if (l > a * 0.55) { lphone(ctx, 520, 640, 620, c => cam(c, {})); B.badge(ctx, 870, 590, true, "Cahaya dari depan: wajah terlihat jelas.", { w: 520, h: 90, size: 24 });
        ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1120, 300); ctx.lineTo(1120, 560); ctx.stroke(); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(1120, 575); ctx.lineTo(1104, 550); ctx.lineTo(1136, 550); ctx.fill(); B.tag(ctx, 1140, 410, "pindah posisi", { fill: C.ink }); }
      B.steps(ctx, "CAHAYA", ["Jendela di belakang: gelap.", "Cahaya dari depan wajah."], l > a * 0.55 ? 2 : 1);
    },
    suara(ctx, b, l) {
      const a = b.audio || b.dur, near = l > a * 0.4, t = l * 8;
      const meter = near ? 0.55 + 0.25 * Math.abs(Math.sin(t * 0.7)) : 0.85 + 0.1 * Math.sin(t * 3);
      lphone(ctx, 520, 430, 760, c => cam(c, { rec: 3 + l, meter }));
      const wave = (x, y, noisy, s, ok) => { card(ctx, x, y, 370, 170, { fill: "#FFFFFF", stroke: ok ? "#BFE3CB" : "#F3C7C3", lw: 3, r: 16 }); text(ctx, s, x + 20, y + 40, 22, { weight: 900, color: ok ? GREEN : RED });
        ctx.strokeStyle = ok ? GREEN : RED; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 320; i += 3) { const env = noisy ? 0.8 : Math.max(0, Math.sin(i * 0.035)) ; const v = noisy ? (Math.sin(i * 1.7 + t) * 0.5 + Math.sin(i * 0.9 - t) * 0.5) * 34 : Math.sin(i * 0.9 + t) * 40 * env; ctx.moveTo(x + 25 + i, y + 110 - v); ctx.lineTo(x + 25 + i, y + 110 + v); } ctx.stroke(); };
      wave(1450, 130, true, "Jauh dan bising", false);
      if (near) wave(1450, 320, false, "Dekat dan tenang", true);
      if (l > a * 0.7) B.notes(ctx, 500, [B.warn("Jangan tutupi lubang mikrofon dengan jari.")]);
    },
    rekam(ctx, b, l) {
      const span = B.spanOf(b), a = b.audio || b.dur;
      const ST = [{ wait: 1, d: 0.8 }, { tap: [260, 140], set: { focus: true }, d: 1 }, { wait: 1, d: 0.4 }, { tap: [690, 180], set: { rec: true }, d: 1 }, { wait: 1, d: 3 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      ctx.fillStyle = "#7D5A3C"; [0, 1, 2].forEach(i => { ctx.fillStyle = ["#2F6FC0", "#D9443B", "#2E9E5B"][i]; rr(ctx, 230 + i * 8, 700 - i * 34, 600 - i * 16, 34, 6); ctx.fill(); });
      const t0 = span * (4.2 / 7.2);
      lphone(ctx, 530, 420, 760, c => { cam(c, { rec: st.rec ? Math.max(0, l - t0) : null, focus: st.focus ? { x: 260, y: 140, u: (l - span * 0.12) * 2 } : null, shutterHl: R.i === 3 }); if (R.tap) HP.tap(c, R.tap.x, R.tap.y, R.tap.u, { r: 30 }); });
      B.tag(ctx, 530, 760, "Bersandar pada tumpukan buku: stabil", { align: "center", fill: C.ink });
      const y = B.steps(ctx, "LANGKAH", ["Sandarkan HP.", "Tap wajah untuk fokus.", "Tap tombol merah.", "Jeda dua detik di awal dan akhir."], B.stepAt(l, span, [0.1, 0.25, 0.5, 0.65]));
      if (st.rec && l - t0 < 2.2) B.notes(ctx, y, [{ s: "Jeda dulu: " + Math.max(0, Math.ceil(2 - (l - t0))) + " detik" }]);
    },
    editor_buka(ctx, b, l) {
      const span = B.spanOf(b);
      const ST = [{ wait: 1, d: 0.4 }, { tap: [180, 300], set: { scr: "pick" }, d: 1 }, { tap: [70, 200], set: { picked: true }, d: 1 }, { tap: [180, 667], set: { scr: "ed" }, d: 1 }, { wait: 1, d: 2 }];
      const R = HP.run({ scr: "home" }, ST, l, span), st = R.st;
      const draw = c => {
        if (st.scr === "home") { c.fillStyle = "#1E262C"; c.fillRect(0, 0, HP.W, HP.H); text(c, "Penyunting Video", 180, 150, 26, { align: "center", weight: 900, color: "#FFFFFF" }); text(c, "aplikasi rekaan", 180, 180, 15, { align: "center", weight: 700, color: "#8A99A3" });
          HP.button(c, 60, 270, 240, 60, "+  Proyek baru", { hl: R.i >= 1 }); }
        else if (st.scr === "pick") { HP.header(c, "Pilih dari galeri", { back: true }); for (let i = 0; i < 9; i++) { const x = 14 + (i % 3) * 112, y = 120 + Math.floor(i / 3) * 112; if (i === 0) scene(c, x, y, 104, 104, {}); else { c.fillStyle = ["#9CC9E0", "#F2C98A", "#A8D5B5", "#E8A9A0", "#C3B5E0", "#F0D58C", "#9FD0C8", "#D8B79A"][i - 1]; rr(c, x, y, 104, 104, 8); c.fill(); }
            if (i === 0) { text(c, "0:42", x + 96, y + 96, 13, { align: "right", weight: 800, color: "#FFFFFF" }); if (st.picked) { c.strokeStyle = BLUE; c.lineWidth = 4; rr(c, x, y, 104, 104, 8); c.stroke(); c.fillStyle = BLUE; c.beginPath(); c.arc(x + 88, y + 16, 12, 0, Math.PI * 2); c.fill(); HP.icon(c, "check", x + 88, y + 16, 14, "#FFFFFF"); } } }
          HP.button(c, 30, 640, 300, 54, st.picked ? "Tambah (1)" : "Tambah", { fill: st.picked ? BLUE : "#9FB6CC", hl: R.i === 3 }); }
        else editor(c, { ph: 0 });
        B.tapDraw(c, R); };
      B.show(ctx, draw, st.scr === "ed" ? EDIT_SRC : st.scr === "pick" ? { u: 0, v: 104, w: 360, h: 240 } : { u: 0, v: 120, w: 360, h: 240 });
      const y = B.steps(ctx, "LANGKAH", ["Tap Proyek baru.", "Pilih klip dari galeri.", "Tap Tambah."], B.stepAt(l, span, [0.15, 0.4, 0.55]));
      if (st.scr === "ed") B.notes(ctx, y, [{ s: "Garis waktu: klip dari kiri (awal) ke kanan (akhir)." }]);
    },
    potong(ctx, b, l) {
      const span = B.spanOf(b), sc = 328 / 42;
      const ST = [{ wait: 1, d: 0.6 }, { tap: [180, 416], set: { sel: true }, d: 0.8 }, { anim: "cl", d: 1.6 }, { anim: "cr", d: 1.6 }, { wait: 1, d: 1.4 }];
      const R = HP.run({}, ST, l, span), st = R.st, cl = 4 * ease(st.cl || 0), cr = 4 * ease(st.cr || 0);
      const hand = R.i === 2 ? [TL.x0 + cl * sc, 416] : R.i === 3 ? [TL.x1 - cr * sc, 416] : null;
      const draw = c => { editor(c, { ph: R.i >= 3 ? 38 - cr : cl, handles: st.sel, cutL: cl, cutR: cr }); if (hand) { c.fillStyle = "rgba(242,177,52,0.5)"; c.beginPath(); c.arc(hand[0], hand[1], 18, 0, Math.PI * 2); c.fill(); c.strokeStyle = "#B57A12"; c.lineWidth = 3; c.stroke(); } B.tapDraw(c, R); };
      B.show(ctx, draw, { u: 0, v: 96, w: 360, h: 420 }, { mw: 560, my: 130 });
      const y = B.steps(ctx, "LANGKAH", ["Tap klipnya.", "Geser tepi kiri ke kanan.", "Geser tepi kanan ke kiri."], B.stepAt(l, span, [0.15, 0.4, 0.7]));
      B.notes(ctx, y, [B.after(b, l, 0.3) && { s: "Pratinjau menunjukkan bingkai di tepi yang digeser." }]);
    },
    bagi(ctx, b, l) {
      const span = B.spanOf(b), sc = 328 / 34;
      const ST = [{ anim: "m1", d: 1 }, { tap: toolAt(0), set: { c: 2 }, d: 0.8 }, { anim: "m2", d: 0.8 }, { tap: toolAt(0), set: { c: 3 }, d: 0.8 }, { wait: 1, d: 0.3 }, { tap: [TL.x0 + 19 * sc, 416], set: { sel: 1 }, d: 0.8 }, { tap: toolAt(1), set: { del: true }, d: 0.8 }, { anim: "g", d: 0.8 }, { wait: 1, d: 0.8 }];
      const R = HP.run({ c: 1 }, ST, l, span), st = R.st;
      const ph = st.m2 != null ? 16 + 6 * ease(st.m2) : 16 * ease(st.m1 || 0);
      const clips = st.del ? [[4, 20], [26, 38]] : st.c === 1 ? [[4, 38]] : st.c === 2 ? [[4, 20], [20, 38]] : [[4, 20], [20, 26], [26, 38]];
      const draw = c => { editor(c, { clips, total: 34, ph: st.del ? 16 : ph, sel: st.del ? null : st.sel, gapAt: st.del ? 1 : null, gapX: st.del ? 6 * sc * (1 - ease(st.g || 0)) : 0, toolHl: R.i === 1 || R.i === 3 ? 0 : R.i === 6 ? 1 : null }); B.tapDraw(c, R); };
      B.show(ctx, draw, R.i === 1 || R.i === 3 || R.i === 6 ? { u: 0, v: 350, w: 360, h: 362 } : { u: 0, v: 96, w: 360, h: 420 }, { mw: R.i === 1 || R.i === 3 || R.i === 6 ? 470 : 560, my: 130 });
      const y = B.steps(ctx, "LANGKAH", ["Garis putih ke awal bagian salah, tap Bagi.", "Garis putih ke akhirnya, tap Bagi.", "Tap bagian itu, tap Hapus."], B.stepAt(l, span, [0.25, 0.48, 0.8]));
      if (st.del) B.notes(ctx, y, [B.ok("Bagian yang baik tersambung.")]);
    },
    teks(ctx, b, l) {
      const span = B.spanOf(b), base = { clips: [[4, 20], [26, 38]], total: 28 };
      const ST = [{ tap: toolAt(2), set: { panel: true }, d: 0.9 }, { type: "Pilah Sampah Jadi Tiga", field: "tx", d: 1.8 }, { tap: [68, 634], set: { big: true }, d: 0.6 }, { tap: [180, 634], set: { bg: true }, d: 0.6 }, { tap: [287, 684], set: { done: true }, d: 0.7 }, { anim: "tu", d: 0.6 }, { wait: 1, d: 1 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      const draw = c => { editor(c, { ...base, ph: 0.5, toolHl: R.i === 0 ? 2 : null, text: st.done, textU: st.tu, titleTyping: st.panel && !st.done && st.big && st.bg ? st.tx : null, panel: st.panel && !st.done ? textPanel(st.tx, st.big, st.bg) : null });
        if (st.panel && !st.done && !(st.big && st.bg) && st.tx) { c.fillStyle = "rgba(0,0,0,0)"; text(c, st.tx, 180, 200, 14, { align: "center", weight: 700, color: "#FFFFFF" }); } B.tapDraw(c, R); };
      B.show(ctx, draw, st.done ? { u: 0, v: 96, w: 360, h: 420 } : { u: 0, v: 96, w: 360, h: 616 }, { mw: st.done ? 560 : 400, my: 130 });
      const y = B.steps(ctx, "LANGKAH", ["Tap Teks.", "Ketik judulnya.", "Huruf besar, latar gelap.", "Tampil sekitar tiga detik."], B.stepAt(l, span, [0.12, 0.42, 0.62, 0.8]));
      B.notes(ctx, y, [B.after(b, l, 0.6) && { s: "Cukup waktu untuk dibaca dua kali." }]);
    },
    musik(ctx, b, l) {
      const span = B.spanOf(b), rows = LIB_ROWS(), base = { clips: [[4, 20], [26, 38]], total: 28, text: true };
      const ST = [{ tap: toolAt(3), set: { scr: "lib" }, d: 1 }, { wait: 1, d: 0.6, set: { chip: true } }, { wait: 1, d: 0.6 }, { tap: B.tapRow(rows, 0), set: { pick: 0 }, d: 1 }, { tap: [180, 671], set: { scr: "ed2" }, d: 1 }, { anim: "mu", d: 0.6 }, { wait: 1, d: 1 }];
      const R = HP.run({ scr: "ed" }, ST, l, span), st = R.st;
      const draw = c => { if (st.scr === "ed") editor(c, { ...base, ph: 2, toolHl: 3 }); else if (st.scr === "lib") library(c, { pick: st.pick, chipHl: st.chip, addHl: R.i === 4 }); else editor(c, { ...base, ph: 2, music: 1, musicHl: true }); B.tapDraw(c, R); };
      B.show(ctx, draw, st.scr === "ed" ? { u: 0, v: 600, w: 360, h: 112 } : st.scr === "lib" ? (st.pick != null ? { u: 0, v: 160, w: 360, h: 300 } : { u: 0, v: 104, w: 360, h: 200 }) : EDIT_SRC);
      const y = B.steps(ctx, "LANGKAH", ["Tap Audio, lalu Pustaka musik.", "Pilih Bebas lisensi.", "Pilih Pagi Ceria, tap Tambah."], B.stepAt(l, span, [0.15, 0.3, 0.55]));
      B.notes(ctx, y, [B.after(b, l, 0.3) && B.ok("Bebas lisensi: boleh dipakai, sebutkan sumbernya.")]);
    },
    volume(ctx, b, l) {
      const span = B.spanOf(b), base = { clips: [[4, 20], [26, 38]], total: 28, text: true };
      const ST = [{ tap: [180, 495], set: { panel: true }, d: 0.9 }, { anim: "v", d: 1.6 }, { wait: 1, d: 0.6 }, { set: { credit: true, panel: false }, d: 0.1 }, { wait: 1, d: 2 }];
      const R = HP.run({}, ST, l, span), st = R.st, mv = 1 - 0.8 * ease(st.v || 0);
      const draw = c => { editor(c, { ...base, ph: st.credit ? 27 : 2, music: mv, musicHl: st.panel, credit: st.credit, panel: st.panel ? volPanel(1, mv) : null });
        if (R.i === 1) { const x = 20 + 320 * mv; c.fillStyle = "rgba(242,177,52,0.5)"; c.beginPath(); c.arc(x, 656, 18, 0, Math.PI * 2); c.fill(); } B.tapDraw(c, R); };
      B.show(ctx, draw, st.credit ? { u: 0, v: 100, w: 360, h: 205 } : st.panel ? { u: 0, v: 470, w: 360, h: 242 } : EDIT_SRC);
      const y = B.steps(ctx, "LANGKAH", ["Tap bilah musik.", "Turunkan musik ke 20%.", "Tulis sumber musik di akhir."], B.stepAt(l, span, [0.15, 0.45, 0.65]));
      B.notes(ctx, y, [B.after(b, l, 0.3) && { s: "Suara Sinta: 100%. Musik: pelan saja." }]);
    },
    ekspor(ctx, b, l) {
      const span = B.spanOf(b), base = { clips: [[4, 20], [26, 38]], total: 28, text: true, music: 0.2 };
      const ST = [{ tap: [304, 67], set: { sheet: true }, d: 0.9 }, { tap: resAt(1), set: { res: 1 }, d: 0.8 }, { tap: fpsAt(1), set: { fps: 1 }, d: 0.8 }, { tap: [180, 650], set: { go: true }, d: 0.8 }, { anim: "p", d: 2 }, { wait: 1, d: 1 }];
      const R = HP.run({}, ST, l, span), st = R.st;
      const draw = c => { editor(c, { ...base, ph: 1, expHl: R.i === 0 }); if (st.sheet) exportSheet(c, { res: st.res, fps: st.fps, prog: st.go ? (st.p || 0) : null, btnHl: R.i === 3 }); B.tapDraw(c, R); };
      B.show(ctx, draw, st.sheet ? { u: 0, v: 370, w: 360, h: 330 } : { u: 160, v: 40, w: 200, h: 70 });
      const y = B.steps(ctx, "LANGKAH", ["Tap Ekspor.", "Pilih 1080p.", "Pilih 30 frame per detik.", "Tap Ekspor, tunggu selesai."], B.stepAt(l, span, [0.15, 0.3, 0.45, 0.6]));
      if (st.p >= 1) B.notes(ctx, y, [B.ok("Video tersimpan di galeri.")]);
    },
    salah_musik(ctx, b, l) {
      const a = b.audio || b.dur, fix = l > a * 0.55, mv = fix ? 1 - 0.8 * ease((l - a * 0.55) / (a * 0.2)) : 1;
      card(ctx, 900, 140, 880, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 1: MUSIK TERLALU KERAS", 1340, 200, 28, { align: "center", weight: 900, color: RED });
      B.phone(ctx, c => editor(c, { clips: [[4, 20], [26, 38]], total: 28, text: true, ph: 6, music: mv, musicHl: true, panel: volPanel(1, mv) }));
      const bar = (y, s, v, col) => { text(ctx, s, 960, y, 24, { weight: 800 }); ctx.fillStyle = "#EEF2F5"; rr(ctx, 960, y + 14, 760, 30, 15); ctx.fill(); ctx.fillStyle = col; rr(ctx, 960, y + 14, 760 * v, 30, 15); ctx.fill(); };
      text(ctx, "Yang terdengar penonton:", 960, 270, 24, { weight: 900, color: C.ink2 });
      bar(320, "Musik", 0.9 * mv + 0.05, MUSIC); bar(400, "Suara Sinta", fix ? 0.75 : 0.3, BLUE);
      B.badge(ctx, 930, 480, fix, fix ? "Musik 20%: suara Sinta terdengar jelas." : "Musik 100%: suara Sinta tenggelam.", { w: 820, h: 90, size: 26 });
    },
    salah_lagu(ctx, b, l) {
      const a = b.audio || b.dur;
      card(ctx, 900, 140, 880, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 2: MEMAKAI LAGU POPULER", 1340, 200, 28, { align: "center", weight: 900, color: RED });
      B.phone(ctx, c => { c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, HP.W, HP.H); scene(c, 0, 110, 360, 203, {}); c.fillStyle = "rgba(0,0,0,0.55)"; c.beginPath(); c.arc(180, 211, 34, 0, Math.PI * 2); c.fill();
        HP.icon(c, "music", 172, 211, 26, "#FFFFFF"); c.strokeStyle = "#FFFFFF"; c.lineWidth = 4; c.beginPath(); c.moveTo(152, 236); c.lineTo(208, 186); c.stroke();
        text(c, "Pilah Sampah Jadi Tiga", 20, 350, 19, { weight: 800 }); text(c, "Dibisukan", 20, 376, 15, { weight: 800, color: RED });
        HP.notif(c, { app: "Kanal Video", icon: "warning", color: RED, title: "Videomu dibisukan", body: "Video memuat lagu berhak cipta milik orang lain.", time: "sekarang" }, clamp(l / 0.8, 0, 1)); });
      B.badge(ctx, 930, 250, false, "Lagu populer milik penciptanya: video bisa dibisukan atau dihapus.", { w: 820, h: 100, size: 26 });
      if (l > a * 0.6) B.badge(ctx, 930, 370, true, "Pakai musik dari pustaka bebas lisensi, sebutkan sumbernya.", { w: 820, h: 100, size: 26 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
