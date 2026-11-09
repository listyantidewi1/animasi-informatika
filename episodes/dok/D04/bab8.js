/* D04 bab 8 — "Tiga puluh satu percobaan" (b8_1 … b8_7).
   Panggung: dunia meja kerja malam yang sama dengan bab 0, 1, 5, 6, 7 (kabur di belakang untuk adegan diagram, tajam di b8_5 dan b8_7).
   Orang sungguhan tidak digambar (hanya laptop, tangan tanpa ciri, kacamata, pensil, label nama). AI digambar abstrak:
   tumpukan kartu catatan bernomor dengan garis cahaya; Anthropic = kartu toska + garis orbit, OpenAI = kartu ungu + garis lurus
   miring (ukuran, terang, dan gerak setara; tanpa wajah, maskot, atau logo).
   b8_1 laptop "Filip Stappers" (layar: kubus "?") → kartu "soal" terbang ke tumpukan kartu AI; label diketik kata demi kata
        "Claude Opus 4.6 (Anthropic)", "model AI"; pita waktu: "dirilis" → minggu 1, 2, 3 → soal diberikan ("3 minggu").
   b8_2 kartu percobaan besar (kode diketik, cap "terlalu lambat" / "tidak berhasil") + kisi kartu kecil bernomor 1…30 yang terisi;
        kebanyakan abu-abu, beberapa toska bintang ("ada kemajuan"); tangan tanpa ciri menempelkan catatan "perbarui catatan!";
        label "Filip Stappers"; jam berputar; Bip berdiri di petak terakhir kisi.
   b8_3 kartu 31 menyala emas, jam genap 1 putaran ("± 1 jam"), cap "berhasil!"; kamera bergeser: kubus 3, 5, 7 terisi tiga
        warna (data asli 3 dan 5, 7 dihitung dengan aturan yang sama dan diverifikasi); laptop Stappers menguji 3, 5, 7, … 101 ✓;
        kamera bergeser lagi: pensil menulis bukti ("Donald Knuth"), salinan bukti masuk ke mesin pemeriksa "Lean"
        ("Kim Morrison"), baris dicentang satu per satu, keluar centang besar.
   b8_4 kubus genap 4, 6, 8 dengan centang kecil, kubus "?" (rumus umum belum ada); laptop "Ho Boon Suan, Singapura", kartu soal ke
        tumpukan AI "GPT-5.3-codex (OpenAI)", kartu program kembali; uji 8, 10, … 200; kubus raksasa "200 × 200 × 200" = "8 juta
        ruangan" (pembanding: kubus 3 × 3 × 3 = 27 ruangan).
   b8_5 meja tajam: tumpukan AI "GPT-5.4 Pro (OpenAI)" menerbangkan 14 halaman satu per satu (penghitung), tangan tanpa ciri dengan
        kaca pembesar menyusuri baris; "diperiksa Knuth"; cap "tampak tanpa cacat".
   b8_6 dua kartu ketikan berdampingan "2023" dan "2026" (baris diketik mengikuti narasi), timbangan bergeser pelan dari "ragu" ke
        "terbuka" tanpa jatuh, ilustrasi tanya-jawab dengan cap "karangan", Bip memakai topi lalu mengangkatnya.
   b8_7 meja tajam: catatan dilipat dua kali dan diletakkan di atas tumpukan naskah; lampu tetap menyala; kalimat penutup diketik
        kata demi kata, lalu terjemahannya.
   Kamera sendiri (noCam). Teks benda memudar bila keluar zona aman; label lewat D.post. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KB = KIT.bipkit, P = D.P, LP = KL.parts;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};
  const COL3 = ["#FF5A5F", "#4FD67F", "#55A8FF"];          // merah, hijau, biru (sama dengan bab 0 dan 7)
  const AIA = "#3FD8C8", AIO = "#A592FF";                  // AI Anthropic (toska) dan AI OpenAI (ungu): gaya setara
  const GOLD = "#FFC65A", INK = "#2B2F5E";

  // ---------- pembantu ----------
  const ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  const win = (l, a, b, f = 0.4) => ramp(l, a, f) * (1 - ramp(l, b, f));
  const camT = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); };
  const toS = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + HH / 2];
  const drift = (c, t) => ({ x: c.x + Math.sin(t * 0.29) * 5 / c.z, y: c.y + Math.sin(t * 0.21 + 1) * 4 / c.z, z: c.z * (1 + 0.003 * Math.sin(t * 0.17)) });
  const mk = (w, h) => Object.assign(document.createElement("canvas"), { width: w, height: h });
  function grade(ctx, a, col = "#3B4690") { if (a <= 0.01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore(); }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  // faktor tampak teks dunia: 1 di dalam zona aman layar, memudar ke 0 di tepinya
  function safeA(ctx, x, y, w, size) {
    const m = ctx.getTransform(), X0 = m.a * x + m.e, X1 = m.a * (x + w) + m.e, Y = m.d * y + m.f, Yt = m.d * (y - size * 0.8) + m.f;
    return clamp((Yt - 66) / 30) * clamp((925 - Y) / 30) * clamp((X0 - 100) / 40) * clamp((1820 - X1) / 40);
  }
  // teks di dalam benda: memudar di tepi layar dan bila benda terlalu kecil (skala < minSc)
  function wtxt(ctx, s, x, y, size, opt = {}) {
    ctx.save(); const wt = opt.weight || 800; ctx.font = `${wt} ${size}px ${FONT}`; const w = ctx.measureText(s).width;
    const al = opt.align || "center", x0 = al === "center" ? x - w / 2 : al === "right" ? x - w : x;
    const m = ctx.getTransform(), sc = Math.hypot(m.a, m.b);
    const a = safeA(ctx, x0, y, w, size) * clamp((size * sc - 38) / 6);
    if (a > 0.01) { ctx.globalAlpha *= a; D.txt(ctx, s, x, y, size, { align: al, weight: wt, color: opt.color }); }
    ctx.restore();
  }
  function tag(ctx, s, x, y, a, opt = {}) {
    if (a <= 0.01) return 0; const sp = opt.sp == null ? 1 : opt.sp; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.translate(x, y); const k = lerp(0.86, 1, sp); ctx.scale(k, k); const w = D.label(ctx, s, 0, 0, { size: opt.size || 50, col: opt.col || P.amber, color: opt.color, fill: opt.fill });
    ctx.restore(); return w;
  }
  // pil berlebar tetap (lebar teks penuh) yang teksnya muncul bertahap, rata kiri
  function ptag(ctx, full, shown, x, y, a, o = {}) {
    if (a <= 0.01 || !shown) return; const size = o.size || 48; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.font = `800 ${size}px ${FONT}`; const w = ctx.measureText(full).width + size * 1.2, h = size * 1.7;
    const k = lerp(0.86, 1, o.sp == null ? 1 : o.sp); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = o.fill || "rgba(10,18,52,0.9)"; RR(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = D.hexA(o.col || P.amber, 0.9); ctx.lineWidth = 3; ctx.stroke();
    D.txt(ctx, shown, -w / 2 + size * 0.6, size * 0.36, size, { color: o.color || P.ink, weight: 800 });
    ctx.restore();
  }
  const pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  const typed = (s, l, t0, t1) => s.slice(0, Math.round(s.length * clamp((l - t0) / Math.max(0.05, t1 - t0))));
  function shadowE(ctx, x, y, rx, ry, a = 0.3) { ctx.save(); ctx.fillStyle = `rgba(30,12,8,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  function sparkle(ctx, x, y, r, a, col = "#FFF3C4") {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath();
    for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.28 : r, an = i * Math.PI / 4 - Math.PI / 2; ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); }
    ctx.closePath(); ctx.fill(); D.glow(ctx, x, y, r * 1.6, col, 0.5); ctx.restore();
  }
  function star(ctx, x, y, r, col) { ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * 0.45 : r, an = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } ctx.closePath(); ctx.fill(); }
  function checkMark(ctx, x, y, r, a, sp = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); const k = lerp(0.5, 1, sp); ctx.scale(k, k);
    D.glow(ctx, 0, 0, r * 2.2, P.green, 0.35);
    ctx.fillStyle = "#2FA862"; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = "#D8FFE6"; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * 0.24; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-r * 0.45, 0); ctx.lineTo(-r * 0.1, r * 0.36); ctx.lineTo(r * 0.5, -r * 0.36); ctx.stroke(); ctx.restore();
  }
  function crossMark(ctx, x, y, r, col) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = r * 0.32; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.stroke(); ctx.restore(); }
  function hourglass(ctx, x, y, r, col) { ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = r * 0.22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - r * 0.75, y - r); ctx.lineTo(x + r * 0.75, y - r); ctx.moveTo(x - r * 0.75, y + r); ctx.lineTo(x + r * 0.75, y + r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r); ctx.lineTo(x + r * 0.6, y - r); ctx.lineTo(x, y); ctx.closePath(); ctx.globalAlpha *= 0.55; ctx.fill(); ctx.globalAlpha /= 0.55;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + r * 0.6, y + r); ctx.lineTo(x - r * 0.6, y + r); ctx.closePath(); ctx.fill(); ctx.restore(); }

  // ---------- dunia meja (rupa sama dengan bab 0, 5, 7) ----------
  const DESK_Y = 640, DESK_F = 1010;
  const WIN = { x: 120, y: 70, w: 280, h: 230 };
  const LAMP = { bx: 330, by: 690, jx: 262, jy: 500, hx: 430, hy: 372 };
  const SHELF = { x0: 1110, x1: 1850, y: 300, slot: 69, bx: 1130, bw: 62, bh: 170 };
  const BOOKS = [["1", "#E8665F"], ["2", "#36B3A3"], ["3", "#6A7BE0"], ["4A", "#E9A23B"], ["4B", "#9A6FD6"], ["4C"], ["4D"], ["5"], ["6"], ["7"]];
  const GLS = { x: 500, y: 772 };
  const CAL = { x: 1640, y: 702, w: 230, h: 214 };
  const STK = { x: 170, y: 880 };
  const PEN_REST = { x: 1215, y: 930, ang: -0.32 };
  function wall(ctx, t) {
    const gr = ctx.createLinearGradient(0, 0, 0, DESK_Y); gr.addColorStop(0, "#2A3A7C"); gr.addColorStop(1, "#3D509A");
    ctx.fillStyle = gr; ctx.fillRect(-600, -400, 3200, DESK_Y + 400);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = -576; x < 2600; x += 64) ctx.fillRect(x, -400, 3, DESK_Y + 400);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = -544; x < 2600; x += 64) for (let y = -360; y < DESK_Y - 20; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    LP.windowFrame(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, "#8A6E9E", () => LP.nightView(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, 0));
    addLight(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 280, "#9DB8FF", 0.14);
  }
  function desk(ctx) {
    const top = DESK_Y, front = DESK_F;
    const gr = ctx.createLinearGradient(0, top, 0, front); gr.addColorStop(0, "#6E4834"); gr.addColorStop(1, "#9A6848");
    ctx.fillStyle = gr; ctx.fillRect(-600, top, 3200, front - top);
    ctx.strokeStyle = "rgba(60,30,20,0.18)"; ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) { const y = top + 26 + i * 40; if (y > front - 6) break; ctx.beginPath(); ctx.moveTo(-600, y); for (let x = -600; x <= 2600; x += 120) ctx.lineTo(x, y + Math.sin(x * 0.004 + i * 1.7) * 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,220,180,0.18)"; ctx.fillRect(-600, top, 3200, 4);
    ctx.fillStyle = "#B57D57"; ctx.fillRect(-600, front, 3200, 10);
    const g2 = ctx.createLinearGradient(0, front + 10, 0, 1400); g2.addColorStop(0, "#5A3726"); g2.addColorStop(1, "#3A2218");
    ctx.fillStyle = g2; ctx.fillRect(-600, front + 10, 3200, 500);
  }
  function lamp(ctx, t, on) {
    const { bx, by, jx, jy, hx, hy } = LAMP;
    ctx.save();
    ctx.fillStyle = "rgba(20,10,10,0.35)"; ctx.beginPath(); ctx.ellipse(bx + 8, by + 8, 74, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2C3570"; ctx.beginPath(); ctx.ellipse(bx, by, 66, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3C478E"; ctx.beginPath(); ctx.ellipse(bx, by - 8, 60, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#46529E"; ctx.lineCap = "round"; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(bx, by - 12); ctx.lineTo(jx, jy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 4, by - 14); ctx.lineTo(jx - 4, jy); ctx.lineTo(hx - 2, hy - 5); ctx.stroke();
    ctx.fillStyle = "#FFB547"; [[bx, by - 12], [jx, jy], [hx, hy]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); });
    ctx.translate(hx, hy); ctx.rotate(-0.5);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, "#38428A"); sg.addColorStop(0.5, "#5562B4"); sg.addColorStop(1, "#38428A");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(34, -14); ctx.lineTo(70, 92); ctx.lineTo(-70, 92); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E3778"; ctx.beginPath(); ctx.ellipse(0, -14, 34, 9, 0, 0, TAU); ctx.fill();
    const lit = clamp(on);
    ctx.fillStyle = `rgb(${Math.round(lerp(40, 255, lit))},${Math.round(lerp(48, 236, lit))},${Math.round(lerp(110, 190, lit))})`;
    ctx.beginPath(); ctx.ellipse(0, 92, 70, 15, 0, 0, TAU); ctx.fill();
    ctx.restore();
    if (lit > 0.01) { addLight(ctx, hx + 50, hy + 90, 110, "#FFF2C8", 0.85 * lit); addLight(ctx, hx + 90, hy + 140, 280, "#FFC66E", 0.4 * lit); }
  }
  function spine(ctx, x, bottom, w, h, col, label) {
    const top = bottom - h;
    ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(x + 6, top + 6, w, h);
    const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, col); gr.addColorStop(0.55, col); gr.addColorStop(1, "rgba(20,20,40,0.35)");
    ctx.fillStyle = col; RR(ctx, x, top, w, h, 6); ctx.fill(); ctx.fillStyle = gr; RR(ctx, x, top, w, h, 6); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(x + 8, top + 16, w - 16, 5); ctx.fillRect(x + 8, top + h - 22, w - 16, 5);
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(x + 8, top + 28, w - 16, 3);
    const cy = top + h * 0.52; ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(x + w / 2, cy, w / 2 - 1, 0, TAU); ctx.fill();
    wtxt(ctx, label, x + w / 2, cy + 15, label.length > 1 ? 40 : 44, { weight: 900, color: "#FFFFFF" });
  }
  function ghostSlot(ctx, x, bottom, w, h, t, label, i) {
    const top = bottom - h, pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + i);
    ctx.save();
    ctx.fillStyle = D.hexA(P.warm, 0.1 + 0.08 * pulse); RR(ctx, x, top, w, h, 8); ctx.fill();
    ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 14; ctx.strokeStyle = D.hexA(P.warm, 0.75 + 0.25 * pulse); ctx.lineWidth = 4; RR(ctx, x + 2, top + 2, w - 4, h - 4, 8); ctx.stroke(); ctx.setLineDash([]);
    wtxt(ctx, label, x + w / 2, top + h * 0.52 + 15, label.length > 1 ? 40 : 44, { weight: 900, color: P.warm });
    ctx.restore();
  }
  function shelf(ctx, t) {
    const { x0, x1, y, slot, bx, bw, bh } = SHELF;
    BOOKS.forEach(([k, c], i) => { const x = bx + i * slot, h = k.length > 1 ? bh + 10 : bh; if (c) spine(ctx, x, y, bw, h, c, k); else ghostSlot(ctx, x, y, bw, h, t, k, i); });
    ctx.fillStyle = "#6B4632"; [x0 + 60, x1 - 120].forEach(x => { ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x + 18, y + 20); ctx.lineTo(x + 18, y + 90); ctx.closePath(); ctx.fill(); });
    ctx.fillStyle = "#8A5A3C"; RR(ctx, x0, y, x1 - x0, 24, 5); ctx.fill();
    ctx.fillStyle = "#A8714C"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 5);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(x0 + 6, y + 24, x1 - x0 - 12, 8);
  }
  function stack(ctx) {
    const { x, y } = STK, w = 300, h = 150;
    shadowE(ctx, x + 10, y + 10, w * 0.6, h * 0.42, 0.28);
    for (let i = 0; i < 9; i++) { const dy = -i * 7, dx = Math.sin(i * 2.1) * 8, rot = Math.sin(i * 1.3) * 0.03;
      ctx.save(); ctx.translate(x + dx, y + dy); ctx.rotate(rot);
      ctx.fillStyle = i % 2 ? "#EDE3CF" : "#F6EEDC"; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(120,90,60,0.25)"; ctx.fillRect(-w / 2, h / 2 - 3, w, 3); ctx.restore(); }
    ctx.save(); ctx.translate(x + Math.sin(8 * 2.1) * 8, y - 56); ctx.strokeStyle = "rgba(70,80,120,0.45)"; ctx.lineWidth = 3;
    for (let r = 0; r < 5; r++) { ctx.beginPath(); const yy = -52 + r * 24; ctx.moveTo(-120, yy); for (let u = 0; u <= 1; u += 0.05) ctx.lineTo(-120 + u * (r === 4 ? 140 : 230), yy + Math.sin(u * 40 + r) * 2.5); ctx.stroke(); }
    ctx.restore();
  }
  function glasses(ctx, glow, x = GLS.x, y = GLS.y, sc = 1) {
    if (glow > 0.01) addLight(ctx, x, y - 4, 130 * sc, P.warm, 0.55 * glow);
    shadowE(ctx, x + 8 * sc, y + 20 * sc, 84 * sc, 14 * sc, 0.3);
    ctx.save(); ctx.translate(x, y); ctx.scale(0.76 * sc, 0.55 * sc);
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-86, -10); ctx.lineTo(70, -34); ctx.moveTo(86, -10); ctx.lineTo(-40, -36); ctx.stroke();
    [-46, 46].forEach(cx => {
      ctx.fillStyle = "rgba(190,220,255,0.28)"; ctx.beginPath(); ctx.arc(cx, 0, 38, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7; ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.6 + 0.4 * glow})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, 0, 26, -2.4, -1.6); ctx.stroke();
    });
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-10, -6); ctx.quadraticCurveTo(0, -18, 10, -6); ctx.stroke();
    ctx.restore();
  }
  function calendar(ctx) {
    const { x, y, w, h } = CAL, top = y - h;
    shadowE(ctx, x + 12, y + 6, w * 0.62, 18, 0.32);
    ctx.fillStyle = "#353B78"; ctx.beginPath(); ctx.moveTo(x - w / 2 - 10, y); ctx.lineTo(x + w / 2 + 10, y); ctx.lineTo(x + w / 2 - 6, top - 6); ctx.lineTo(x - w / 2 + 6, top - 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FBF6EA"; RR(ctx, x - w / 2, top, w, h, 10); ctx.fill();
    ctx.fillStyle = "#E25A54"; RR(ctx, x - w / 2, top, w, h * 0.3, 10); ctx.fill(); ctx.fillRect(x - w / 2, top + h * 0.2, w, h * 0.1);
    wtxt(ctx, "TAHUN", x, top + h * 0.3 - 18, 40, { weight: 900, color: "#FFF4EC" });
    wtxt(ctx, "2026", x, top + h * 0.78, 76, { weight: 900, color: INK });
    ctx.fillStyle = "#C9CDE6"; for (let r = 0; r < 6; r++) { const rx = x - w / 2 + 26 + r * (w - 52) / 5; ctx.beginPath(); ctx.arc(rx, top + 4, 7, 0, TAU); ctx.fill(); }
  }
  function pencil(ctx, x, y, ang, lift = 0, sc = 1) {
    ctx.save();
    ctx.save(); ctx.translate(x + lift * 20, y + 8 + lift * 34); ctx.rotate(ang * 0.35); ctx.fillStyle = `rgba(30,12,8,${0.2 * (1 - lift * 0.5)})`; ctx.beginPath(); ctx.ellipse(110 * sc, 0, 120 * sc, 11 * sc, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc);
    ctx.fillStyle = "#3A3550"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(14, -5); ctx.lineTo(14, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F2D2A2"; ctx.beginPath(); ctx.moveTo(14, -5); ctx.lineTo(40, -13); ctx.lineTo(40, 13); ctx.lineTo(14, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F5C24A"; ctx.fillRect(40, -13, 170, 26); ctx.fillStyle = "#E0A93A"; ctx.fillRect(40, 4, 170, 9); ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(40, -10, 170, 4);
    ctx.fillStyle = "#B9BBC9"; ctx.fillRect(210, -13, 20, 26); ctx.fillStyle = "#F08DA0"; RR(ctx, 230, -13, 26, 26, 6); ctx.fill();
    ctx.restore();
  }
  function dust(ctx, t, a, box = [560, 330, 760, 480]) {
    ctx.save(); const r = D.rng(31);
    for (let i = 0; i < 30; i++) { const x0 = box[0] + r() * box[2], y0 = box[1] + r() * box[3], sp = 6 + r() * 10, ph = r() * 6.28;
      const x = x0 + Math.sin(t * 0.3 + ph) * 26, y = y0 - ((t * sp + ph * 30) % 120) + 60, al = a * (0.18 + 0.25 * Math.sin(t * 1.3 + ph) ** 2);
      ctx.fillStyle = `rgba(255,236,190,${al})`; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 2, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  // seluruh dunia meja; o: glassGlow, pen{x,y,ang,lift}|null, onDesk(ctx), bip(ctx), front(ctx)
  function world(ctx, t, o = {}) {
    wall(ctx, t); if (o.onWall) o.onWall(ctx); lamp(ctx, t, 1); shelf(ctx, t); desk(ctx);
    stack(ctx); glasses(ctx, o.glassGlow || 0); calendar(ctx);
    if (o.onDesk) o.onDesk(ctx);
    if (o.pen !== null) { const pn = o.pen || PEN_REST; pencil(ctx, pn.x, pn.y, pn.ang, pn.lift || 0); }
    if (o.bip) o.bip(ctx);
    grade(ctx, 0.12);
    LP.warmPool(ctx, 860, 760, 700, 0.6, 0.5);
    LP.warmPool(ctx, LAMP.hx + 50, LAMP.hy + 40, 420, 0.4, 1);
    addLight(ctx, LAMP.hx + 55, LAMP.hy + 95, 150, "#FFE7B0", 0.5);
    if (o.front) o.front(ctx);
  }
  // kertas catatan polos di meja (sama dengan bab 7)
  const PAP = { x: 930, y: 815, w: 700, h: 300 };
  function plainPaper(ctx) {
    const { x, y, w, h } = PAP;
    shadowE(ctx, x + 14, y + 16, w * 0.55, h * 0.5, 0.25);
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.012);
    ctx.fillStyle = "#FBF4E2"; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = "rgba(90,130,200,0.28)"; ctx.lineWidth = 2; for (let r = 1; r < 7; r++) { const yy = -h / 2 + r * h / 7; ctx.beginPath(); ctx.moveTo(-w / 2 + 10, yy); ctx.lineTo(w / 2 - 10, yy); ctx.stroke(); }
    ctx.strokeStyle = "rgba(220,90,90,0.35)"; ctx.beginPath(); ctx.moveTo(-w / 2 + 70, -h / 2); ctx.lineTo(-w / 2 + 70, h / 2); ctx.stroke();
    ctx.restore();
  }
  // latar kabur (dunia meja statis), dibuat sekali
  let BLUR = null;
  function blurWorld() {
    if (BLUR) return BLUR;
    const pad = [120, 80], cw = W + 2 * pad[0], ch = HH + 2 * pad[1];
    const a = mk(cw, ch), x = a.getContext("2d"); x.translate(pad[0], pad[1]);
    world(x, 0, { onDesk: plainPaper });
    const b = mk(cw, ch), y = b.getContext("2d"); y.filter = "blur(7px)"; y.drawImage(a, 0, 0); y.filter = "none";
    BLUR = { img: b, pad };
    return BLUR;
  }
  function drawBlur(ctx, a = 1) { if (a <= 0.01) return; const B = blurWorld(); ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(B.img, -B.pad[0], -B.pad[1]); ctx.restore(); }
  // panggung diagram: meja kabur + bayang gelap lembut + debu (sama dengan bab 7)
  function stage(ctx, t, o = {}) {
    ctx.save(); camT(ctx, drift({ x: 960 + (o.px || 0), y: 540, z: 1 }, t)); drawBlur(ctx, 1); ctx.restore();
    const [hx, hy] = o.haloAt || [960, 500], R = o.haloR || 980, ha = o.halo == null ? 1 : o.halo;
    const gr = ctx.createRadialGradient(hx, hy, 60, hx, hy, R);
    gr.addColorStop(0, `rgba(10,14,48,${0.42 * ha})`); gr.addColorStop(0.6, `rgba(10,14,48,${0.28 * ha})`); gr.addColorStop(1, "rgba(10,14,48,0.04)"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    dust(ctx, t, 0.8, [80, 100, 1760, 760]);
  }

  // ---------- kubus ----------
  const YAW = 0.65, PITCH = 0.4;
  const swayYaw = t => YAW + 0.022 * Math.sin(t * 0.35);
  function mkProj(n, cx, cy, S, yaw = YAW, pitch = PITCH) {
    const c = (n - 1) / 2, cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const f = (i, j, k) => { const x = i - c, y = k - c, z = j - c, xr = x * cyw + z * syw, zr = -x * syw + z * cyw;
      return { x: cx + xr * S, y: cy - (y * cp + zr * sp) * S, d: zr * cp - y * sp }; };
    f.n = n; f.S = S; f.cx = cx; f.cy = cy; return f;
  }
  const rid = s => [+s[0], +s[1], +s[2]];
  function faceQuad(Pj, axis, v) {
    const lo = -0.5, hi = Pj.n - 0.5, q = [[lo, lo], [hi, lo], [hi, hi], [lo, hi]];
    return q.map(([u, w]) => { const c = [0, 0, 0]; c[axis] = v; c[(axis + 1) % 3] = u; c[(axis + 2) % 3] = w; return Pj(c[0], c[1], c[2]); });
  }
  function poly(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); }
  function faceGrid(ctx, Pj, ax, v, step, lw, col) {
    const n = Pj.n, lo = -0.5, hi = n - 0.5; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
    for (let m = step; m < n; m += step) { const u = m - 0.5;
      for (const dir of [1, 2]) { const A = [0, 0, 0], B = [0, 0, 0]; A[ax] = B[ax] = v; const o1 = (ax + dir) % 3, o2 = (ax + 3 - dir) % 3; A[o1] = B[o1] = u; A[o2] = lo; B[o2] = hi;
        const p = Pj(...A), q = Pj(...B); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); } }
    ctx.stroke();
  }
  function boxBack(ctx, Pj, a, grid = 1) {
    if (a <= 0.01) return; const n = Pj.n, lo = -0.5, hi = n - 0.5;
    ctx.save(); ctx.globalAlpha *= a;
    [[0, lo], [1, hi], [2, lo]].forEach(([ax, v]) => { poly(ctx, faceQuad(Pj, ax, v)); ctx.fillStyle = "rgba(120,150,255,0.10)"; ctx.fill(); });
    if (grid > 0.01 && n <= 16) [[0, lo], [1, hi], [2, lo]].forEach(([ax, v]) => faceGrid(ctx, Pj, ax, v, 1, n > 6 ? 1.2 : 2, `rgba(200,215,255,${0.16 * grid})`));
    const hc = [lo, hi, lo]; ctx.strokeStyle = "rgba(200,215,255,0.38)"; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    for (let ax = 0; ax < 3; ax++) { const B = hc.slice(); B[ax] = ax === 1 ? lo : hi; const p = Pj(...hc), q = Pj(...B); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    ctx.setLineDash([]); ctx.restore();
  }
  function boxFront(ctx, Pj, a, o = {}) {
    if (a <= 0.01) return; const n = Pj.n, lo = -0.5, hi = n - 0.5;
    ctx.save(); ctx.globalAlpha *= a;
    [[0, hi], [1, lo], [2, hi]].forEach(([ax, v]) => { poly(ctx, faceQuad(Pj, ax, v)); ctx.fillStyle = o.fill || "rgba(170,195,255,0.045)"; ctx.fill(); });
    if (o.dense) [[0, hi], [1, lo], [2, hi]].forEach(([ax, v]) => faceGrid(ctx, Pj, ax, v, o.dense, 1, o.denseCol || "rgba(210,224,255,0.16)"));
    else if (n > 6) [[0, hi], [1, lo], [2, hi]].forEach(([ax, v]) => faceGrid(ctx, Pj, ax, v, 1, 1.3, "rgba(210,224,255,0.2)"));
    const hid = [lo, hi, lo], E = [];
    for (let ax = 0; ax < 3; ax++) for (const u of [lo, hi]) for (const w of [lo, hi]) { const A = [0, 0, 0], B = [0, 0, 0]; A[ax] = lo; B[ax] = hi; const o1 = (ax + 1) % 3, o2 = (ax + 2) % 3; A[o1] = B[o1] = u; A[o2] = B[o2] = w;
      const touch = [A, B].some(C => C[0] === hid[0] && C[1] === hid[1] && C[2] === hid[2]); if (!touch) E.push([A, B]); }
    ctx.strokeStyle = o.edge || "rgba(220,232,255,0.78)"; ctx.lineWidth = o.edgeW || (n > 6 ? 2.5 : 3.5); ctx.lineCap = "round";
    E.forEach(([A, B]) => { const p = Pj(...A), q = Pj(...B); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); });
    ctx.restore();
  }
  // titik ruangan (jauh dulu). o: rise(idx|room)→0..1, alpha
  function dots(ctx, Pj, o = {}) {
    const n = Pj.n, S = Pj.S;
    ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    if (n > 6) {
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) { if (!(i === n - 1 || j === 0 || k === n - 1)) continue;
        const ru = o.rise ? o.rise([i, j, k]) : 1; if (ru <= 0.01) continue; const p = Pj(i, j, k), rad = Math.max(1.8, S * 0.13);
        ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * ru * 0.85; ctx.fillStyle = "#E4ECFF"; ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, TAU); ctx.fill(); }
      ctx.restore(); return;
    }
    const list = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) list.push([i, j, k]);
    list.map(r => ({ r, p: Pj(...r) })).sort((A, B) => B.p.d - A.p.d).forEach(({ r, p }) => {
      const ru = o.rise ? o.rise(r) : 1; if (ru <= 0.001) return;
      const rad = S * 0.112 * (1 - p.d * 0.07) * (n === 3 ? 1 : 1.25);
      ctx.save(); ctx.globalAlpha *= clamp(ru * 3);
      D.glow(ctx, p.x, p.y, rad * 3.2, "#CFE0FF", 0.35);
      ctx.fillStyle = "#F2F6FF"; ctx.beginPath(); ctx.arc(p.x, p.y, rad * lerp(0.4, 1, ru), 0, TAU); ctx.fill(); ctx.restore();
    });
    ctx.restore();
  }
  function pathSeg(Pj, seq, s) {
    const n = Pj.n, N = seq.length, A = rid(seq[s]), B = rid(seq[(s + 1) % N]);
    let ax = 0; for (let q = 0; q < 3; q++) if (A[q] !== B[q]) ax = q;
    return { A, B, ax, wrap: A[ax] === n - 1 && B[ax] === 0 };
  }
  function pointOn(Pj, sg, f) {
    const e = [0, 0, 0]; e[sg.ax] = 1;
    if (!sg.wrap || f < 0.5) return Pj(sg.A[0] + e[0] * f, sg.A[1] + e[1] * f, sg.A[2] + e[2] * f);
    const g2 = f - 1; return Pj(sg.B[0] + e[0] * g2, sg.B[1] + e[1] * g2, sg.B[2] + e[2] * g2);
  }
  // jalur warna c sampai progres p (0..N ruas); ruas tembus digambar putus-putus keluar dinding lalu masuk dari seberang
  function drawPath(ctx, Pj, seq, c, p, o = {}) {
    if (p <= 0.001) return; const N = seq.length, col = COL3[c], lwB = o.lw || Math.max(2.5, Pj.S * 0.05);
    const segs = [];
    for (let s = 0; s < Math.ceil(Math.min(N, p)); s++) {
      const sg = pathSeg(Pj, seq, s), f = clamp(p - s), e = [0, 0, 0]; e[sg.ax] = 1; const A = sg.A, B = sg.B;
      const at = (R, fr) => Pj(R[0] + e[0] * fr, R[1] + e[1] * fr, R[2] + e[2] * fr);
      if (!sg.wrap) segs.push([at(A, 0), at(A, f), 0]);
      else { segs.push([at(A, 0), at(A, 0.5 * clamp(f * 2)), 1]); if (f > 0.5) segs.push([at(B, -0.5), at(B, -0.5 + 0.5 * clamp(f * 2 - 1)), 2]); }
    }
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.lineCap = "round";
    [[lwB * (Pj.n > 3 ? 2 : 3.2), Pj.n > 3 ? 0.12 : 0.22, "lighter"], [lwB, 1, "source-over"]].forEach(([lw, al, mode]) => {
      ctx.globalCompositeOperation = mode; ctx.lineWidth = lw; ctx.strokeStyle = D.hexA(col, al);
      [0, 1].forEach(dash => { ctx.setLineDash(dash ? [lw * 1.3, lw * 0.9] : []); ctx.beginPath(); segs.forEach(([a, b, kind]) => { if (!!kind !== !!dash) return; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }); ctx.stroke(); });
    });
    ctx.setLineDash([]); ctx.globalCompositeOperation = "source-over";
    if (o.head && p < N) { const s = Math.floor(p), hp = pointOn(Pj, pathSeg(Pj, seq, s), p - s); ctx.globalCompositeOperation = "lighter"; D.glow(ctx, hp.x, hp.y, lwB * 9, col, 1); ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(hp.x, hp.y, lwB * 1.25, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  function qCube(ctx, Pj, a, t) {   // kubus garis putus-putus (ukuran belum diketahui)
    if (a <= 0.01) return; const n = Pj.n, lo = -0.5, hi = n - 0.5; ctx.save(); ctx.globalAlpha *= a;
    [[0, hi], [1, lo], [2, hi]].forEach(([ax, v]) => { poly(ctx, faceQuad(Pj, ax, v)); ctx.fillStyle = "rgba(255,211,138,0.08)"; ctx.fill(); });
    ctx.strokeStyle = D.hexA(P.warm, 0.85); ctx.lineWidth = Math.max(2.5, Pj.S * n * 0.018); ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 20;
    for (let ax = 0; ax < 3; ax++) for (const u of [lo, hi]) for (const w of [lo, hi]) { const A = [0, 0, 0], B = [0, 0, 0]; A[ax] = lo; B[ax] = hi; A[(ax + 1) % 3] = B[(ax + 1) % 3] = u; A[(ax + 2) % 3] = B[(ax + 2) % 3] = w;
      const p = Pj(...A), q = Pj(...B); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    ctx.setLineDash([]); ctx.restore();
  }
  // tiga jalur warna untuk kubus ganjil m: data asli K.KUBUS bila ada; selain itu aturan yang sama (s = i+j+k mod m),
  // lalu diverifikasi: setiap warna harus melewati m³ ruangan tepat satu kali dan kembali ke 000. Gagal → null (jalur tidak digambar).
  function ruleDir(m, i, j, k) { const s = (i + j + k) % m; if (s === 0) return j === m - 1 ? "012" : "210"; if (s === m - 1) return i > 0 ? "120" : "210"; return i === m - 1 ? "201" : "102"; }
  const CYC = {};
  function cycles(m) {
    if (CYC[m] !== undefined) return CYC[m];
    const KU = K.KUBUS || {}; if (KU[String(m)]) return (CYC[m] = KU[String(m)]);
    const out = [];
    for (let c = 0; c < 3; c++) { let v = [0, 0, 0]; const seq = [], seen = new Set();
      for (let n = 0; n < m * m * m; n++) { const key = v.join(""); seq.push(key); seen.add(key); const a = +ruleDir(m, v[0], v[1], v[2])[c]; v = v.slice(); v[a] = (v[a] + 1) % m; }
      if (seen.size !== m * m * m || v.join("") !== "000") return (CYC[m] = null); out.push(seq); }
    return (CYC[m] = out);
  }
  // kubus berwarna lengkap: n, posisi, sisi B (px), progres 0..1 untuk ketiga warna sekaligus
  function colorCube(ctx, n, x, y, B, prog, t, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= 0.01) return; const Pj = mkProj(n, x, y, B / n, swayYaw(t) + (o.yaw || 0)), seqs = cycles(n);
    ctx.save(); ctx.globalAlpha *= a;
    boxBack(ctx, Pj, 1, 1);
    if (seqs) seqs.forEach((seq, c) => drawPath(ctx, Pj, seq, c, prog * seq.length, { lw: o.lw || (n >= 7 ? 2.6 : n >= 5 ? 3.6 : Math.max(2.5, Math.min(7, Pj.S * 0.1))), head: prog > 0 && prog < 1 }));
    dots(ctx, Pj, { rise: o.rise });
    boxFront(ctx, Pj, 1);
    ctx.restore(); return Pj;
  }

  // ---------- AI: tumpukan kartu catatan bernomor + garis cahaya ----------
  // style "A" = Anthropic (toska, garis orbit), "O" = OpenAI (ungu, garis lurus miring); ukuran, terang, dan gerak setara
  function aiDeck(ctx, cx, cy, s, a, t, o = {}) {
    if (a <= 0.01) return; const col = o.style === "O" ? AIO : AIA, sp = clamp(spring(a * 1.1, 9, 0.55));
    const w = s * 0.56, h = s * 0.74;
    ctx.save(); ctx.globalAlpha *= clamp(a * 2.5) * (o.alpha == null ? 1 : o.alpha); ctx.translate(cx, cy); const k = lerp(0.6, 1, sp) * (o.scale || 1); ctx.scale(k, k);
    addLight(ctx, 0, 0, s * 1.15, col, 0.24 + 0.06 * Math.sin(t * 2) + 0.25 * (o.flash || 0));
    ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.lineCap = "round";
    if (o.style === "O") {
      for (let i = 0; i < 5; i++) { const y = (i - 2) * s * 0.17, x0 = -s * 0.9, x1 = s * 0.9, d = s * 0.16;
        ctx.strokeStyle = D.hexA(col, 0.42); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y + d); ctx.lineTo(x1, y - d); ctx.stroke();
        const u = (t * 0.32 + i * 0.29) % 1; D.glow(ctx, lerp(x0, x1, u), lerp(y + d, y - d, u), 22, col, 0.9); }
    } else {
      for (let i = 0; i < 3; i++) { const rx = s * (0.66 + i * 0.12), ry = s * (0.2 + i * 0.07), ph = t * (0.55 + i * 0.12) + i * 2;
        ctx.save(); ctx.rotate(-0.35 + i * 0.35); ctx.strokeStyle = D.hexA(col, 0.42); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, ph, ph + 4.2); ctx.stroke();
        D.glow(ctx, Math.cos(ph + 4.2) * rx, Math.sin(ph + 4.2) * ry, 22, col, 0.9); ctx.restore(); }
    }
    ctx.restore();
    for (let i = 2; i >= 0; i--) { const rot = [0, -0.16, 0.16][i] + Math.sin(t * 0.8 + i) * 0.015, dx = [0, -s * 0.13, s * 0.13][i], dy = [0, s * 0.03, s * 0.03][i] + Math.sin(t * 1.3 + i) * 4;
      ctx.save(); ctx.translate(dx, dy); ctx.rotate(rot);
      ctx.fillStyle = "rgba(10,14,40,0.35)"; RR(ctx, -w / 2 + 6, -h / 2 + 8, w, h, 12); ctx.fill();
      ctx.fillStyle = i ? "#D6DFF5" : "#EEF3FF"; RR(ctx, -w / 2, -h / 2, w, h, 12); ctx.fill(); ctx.strokeStyle = D.hexA(col, 0.9); ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = col; RR(ctx, -w / 2, -h / 2, w, h * 0.16, 12); ctx.fill(); ctx.fillRect(-w / 2, -h / 2 + h * 0.08, w, h * 0.08);
      if (i === 0) {
        if (o.think) { for (let d = 0; d < 3; d++) { const yy = h * 0.08 - Math.max(0, Math.sin(t * 6 - d * 0.9)) * 14; ctx.fillStyle = D.hexA(o.style === "O" ? "#6A55D8" : "#1F9C90", 0.9); ctx.beginPath(); ctx.arc((d - 1) * w * 0.22, yy, w * 0.07, 0, TAU); ctx.fill(); } }
        else { ctx.fillStyle = "rgba(40,50,110,0.28)"; [0.0, 0.12, 0.24].forEach((v, q) => ctx.fillRect(-w * 0.32, h * v, w * [0.64, 0.5, 0.58][q], 6)); }
      }
      ctx.restore(); }
    ctx.restore();
  }
  // laptop generik (sama dengan bab 7)
  function laptop(ctx, cx, cy, w, t, o = {}) {
    const sh = w * 0.62, top = cy - sh, bw = w * 1.14;
    ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    shadowE(ctx, cx + 10, cy + w * 0.2, bw * 0.55, 16, 0.3);
    ctx.fillStyle = o.body || "#3A417F"; ctx.beginPath(); ctx.moveTo(cx - w / 2, cy); ctx.lineTo(cx + w / 2, cy); ctx.lineTo(cx + bw / 2, cy + w * 0.17); ctx.lineTo(cx - bw / 2, cy + w * 0.17); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#4C559C"; ctx.fillRect(cx - bw / 2, cy + w * 0.17, bw, 8);
    const rows = 4, cols = 12;
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const v0 = r / rows, v1 = (r + 0.78) / rows, hw0 = lerp(w / 2, bw / 2, v0) * 0.9, hw1 = lerp(w / 2, bw / 2, v1) * 0.9, y0 = cy + w * 0.012 + v0 * w * 0.15, y1 = cy + w * 0.012 + v1 * w * 0.15;
      const u0 = q / cols, u1 = (q + 0.82) / cols; const hot = (o.typing || 0) > 0.01 && ((Math.floor(t * 11) * 7 + r * 5 + q * 3) % 17 === 0);
      ctx.fillStyle = hot ? D.hexA(P.teal, 0.9 * o.typing + 0.1) : "#262C62";
      ctx.beginPath(); ctx.moveTo(cx - hw0 + u0 * 2 * hw0, y0); ctx.lineTo(cx - hw0 + u1 * 2 * hw0, y0); ctx.lineTo(cx - hw1 + u1 * 2 * hw1, y1); ctx.lineTo(cx - hw1 + u0 * 2 * hw1, y1); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = o.lid || "#2C3272"; RR(ctx, cx - w / 2, top, w, sh, 14); ctx.fill();
    const sx = cx - w / 2 + 14, sy = top + 14, sw = w - 28, shh = sh - 26;
    const lit = clamp(o.lit == null ? 1 : o.lit); ctx.fillStyle = `rgb(${Math.round(lerp(20, 24, lit))},${Math.round(lerp(24, 36, lit))},${Math.round(lerp(60, 92, lit))})`; RR(ctx, sx, sy, sw, shh, 8); ctx.fill();
    if (lit > 0.01) { D.glow(ctx, cx, top + sh / 2, w * 0.7, "#A9D4FF", 0.25 * lit); if (o.screen) { ctx.save(); RR(ctx, sx, sy, sw, shh, 8); ctx.clip(); o.screen(ctx, sx, sy, sw, shh); ctx.restore(); } }
    ctx.restore();
    return { top, sx, sy, sw, sh: shh };
  }
  // kartu kertas kecil "soal" (kubus garis putus-putus + tanda tanya)
  function soalCard(ctx, x, y, sc, a, t, o = {}) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(Math.sin(t * 2.2) * 0.03 + (o.rot || 0)); ctx.scale(sc, sc);
    const w = 250, h = 190;
    ctx.fillStyle = "rgba(10,14,40,0.35)"; RR(ctx, -w / 2 + 8, -h / 2 + 10, w, h, 14); ctx.fill();
    ctx.fillStyle = o.fill || "#FBF4E2"; RR(ctx, -w / 2, -h / 2, w, h, 14); ctx.fill(); ctx.strokeStyle = D.hexA(o.col || P.amber, 0.9); ctx.lineWidth = 4; ctx.stroke();
    if (o.code) { const C = ["#6A7BE0", "#36B3A3", "#E9A23B", "#9A6FD6"]; for (let r = 0; r < 4; r++) { ctx.fillStyle = C[r]; RR(ctx, -w / 2 + 28 + (r % 2) * 26, 6 + r * 20, [140, 110, 150, 90][r], 10, 5); ctx.fill(); } }
    else { const Pq = mkProj(3, -50, 34, 19, 0.65); qCube(ctx, Pq, 1, t); wtxt(ctx, "?", 62, 62, 76, { weight: 900, color: "#D9842A" }); }
    wtxt(ctx, o.label || "soal", 0, -h / 2 + 54, 46, { weight: 900, color: INK });
    ctx.restore();
  }
  // tangan tanpa ciri: (x, y) = ujung jari/titik pegang; lengan datang dari arah ang (rad, menunjuk ke bahu)
  function hand(ctx, x, y, ang, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const s = o.s || 1; ctx.scale(s, s);
    ctx.fillStyle = "rgba(10,14,50,0.22)"; ctx.beginPath(); ctx.ellipse(220, 30, 300, 60, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = o.sleeve || "#5B6CC7"; RR(ctx, 72, -46, 640, 92, 40); ctx.fill(); ctx.fillStyle = o.cuff || "#4757AE"; RR(ctx, 64, -50, 42, 100, 16); ctx.fill();
    const sk = "#E9B894", sd = "#C98F6C";
    ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(36, 0, 52, 42, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sd; ctx.beginPath(); ctx.ellipse(44, 20, 40, 18, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = sk; ctx.lineCap = "round"; [-26, -9, 8, 24].forEach((yy, i) => { ctx.lineWidth = 17; ctx.beginPath(); ctx.moveTo(22, yy); ctx.lineTo(-10 + Math.abs(i - 1.5) * 7, yy * 1.05); ctx.stroke(); });
    ctx.strokeStyle = sd; ctx.lineWidth = 2.5; [-17, 0, 16].forEach(yy => { ctx.beginPath(); ctx.moveTo(-4, yy); ctx.lineTo(10, yy); ctx.stroke(); });
    ctx.strokeStyle = sk; ctx.lineWidth = 19; ctx.beginPath(); ctx.moveTo(46, -32); ctx.quadraticCurveTo(24, -52, 4, -44); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.ellipse(40, -14, 22, 9, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // catatan tempel kuning "perbarui catatan!"
  function sticky(ctx, x, y, rot, a, pulse = 0) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
    if (pulse > 0.01) D.glow(ctx, 0, 0, 220, "#FFE27A", 0.35 * pulse);
    const w = 270, h = 170;
    ctx.fillStyle = "rgba(10,14,40,0.3)"; ctx.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
    ctx.fillStyle = "#FFE27A"; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = "#F4CF55"; ctx.fillRect(-w / 2, h / 2 - 16, w, 16);
    ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.save(); ctx.rotate(-0.06); ctx.fillRect(-60, -h / 2 - 16, 120, 32); ctx.restore();
    wtxt(ctx, "perbarui", 0, -14, 48, { weight: 900, color: "#5A4410" });
    wtxt(ctx, "catatan!", 0, 46, 48, { weight: 900, color: "#B5452E" });
    ctx.restore();
  }
  // jam dinding sederhana tanpa angka; frac = bagian satu jam
  function clock(ctx, x, y, r, frac, t, done = 0) {
    ctx.save(); ctx.translate(x, y);
    if (done > 0.01) D.glow(ctx, 0, 0, r * 2.4, GOLD, 0.45 * done);
    ctx.fillStyle = "rgba(10,14,40,0.35)"; ctx.beginPath(); ctx.arc(5, 7, r * 1.08, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3C478E"; ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, TAU); ctx.fill();
    ctx.fillStyle = "#F7F3EA"; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    const a = -Math.PI / 2 + clamp(frac) * TAU;
    if (frac > 0.002) { ctx.fillStyle = D.hexA(done > 0.5 ? GOLD : P.pink, 0.35); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 0.9, -Math.PI / 2, a); ctx.closePath(); ctx.fill(); }
    for (let i = 0; i < 12; i++) { const aa = i / 12 * TAU, r0 = r * (i % 3 ? 0.78 : 0.68); ctx.strokeStyle = "#2A2F6A"; ctx.lineWidth = i % 3 ? 2.5 : 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(Math.cos(aa) * r0, Math.sin(aa) * r0); ctx.lineTo(Math.cos(aa) * r * 0.88, Math.sin(aa) * r * 0.88); ctx.stroke(); }
    const ha = -Math.PI / 2 + 0.9 + clamp(frac) * TAU / 12;
    ctx.strokeStyle = "#2A2F6A"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ha) * r * 0.45, Math.sin(ha) * r * 0.45); ctx.stroke();
    ctx.strokeStyle = "#E25A54"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78); ctx.stroke();
    ctx.fillStyle = "#2A2F6A"; ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function topHat(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.beginPath(); ctx.ellipse(4, 6, s * 0.5, s * 0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2B2440"; RR(ctx, -s * 0.3, -s * 0.62, s * 0.6, s * 0.62, s * 0.06); ctx.fill();
    ctx.fillStyle = "#3C3458"; ctx.beginPath(); ctx.ellipse(0, -s * 0.62, s * 0.3, s * 0.07, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FF6F91"; ctx.fillRect(-s * 0.3, -s * 0.2, s * 0.6, s * 0.1);
    ctx.fillStyle = "#2B2440"; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(-s * 0.22, -s * 0.56, s * 0.07, s * 0.32);
    ctx.restore();
  }

  // =====================================================================
  // b8_1: soal diberikan ke Claude Opus 4.6
  const LAP = { x: 470, y: 610, w: 400 }, DECK = { x: 1400, y: 470, s: 300 };
  function lapQ(c, sx, sy, sw, sh, t, a = 1) {
    const Pq = mkProj(3, sx + sw * 0.34, sy + sh * 0.56, 30, 0.65 + 0.12 * Math.sin(t * 0.5)); qCube(c, Pq, a, t);
    c.save(); c.globalAlpha *= a; wtxt(c, "?", sx + sw * 0.76, sy + sh * 0.72, 100, { weight: 900, color: P.amber }); c.restore();
  }
  function T1(b) { return { tSt: D.at(b, "Stappers"), tMem: D.at(b, "memberikan soal"), tCl: D.at(b, "Claude"), tOp: D.at(b, "Opus"), t46: D.at(b, "empat koma enam,"),
    tMod: D.at(b, "model AI"), tAnt: D.at(b, "Anthropic"), tRil: D.at(b, "baru dirilis"), tTg: D.at(b, "tiga minggu"), tMg: D.at(b, "minggu"), tSeb: D.at(b, "sebelumnya."), tEnd: D.speechEnd(b) }; }
  function weeks(cx, l, T, t) {
    const a = ramp(l, T.tRil, 0.4); if (a <= 0.01) return; const y = 850, x0 = 900, sw = 170;
    cx.save(); cx.globalAlpha *= a;
    cx.strokeStyle = "rgba(242,246,255,0.4)"; cx.lineWidth = 6; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(x0 - 30, y); cx.lineTo(x0 + 3 * sw + 30, y); cx.stroke();
    for (let i = 0; i < 3; i++) { const u = eio(ramp(l, T.tTg + i * 0.3, 0.3)), x = x0 + i * sw + 6, w = sw - 12;
      cx.save(); cx.setLineDash([10, 8]); cx.strokeStyle = "rgba(255,211,138,0.6)"; cx.lineWidth = 3; RR(cx, x, y - 30, w, 60, 14); cx.stroke(); cx.restore();
      if (u > 0.01) { cx.fillStyle = D.hexA(P.amber, 0.9); RR(cx, x, y - 30, w * u, 60, 14); cx.fill(); }
      if (u > 0.6) { cx.save(); cx.globalAlpha *= ramp(u, 0.6, 0.3); D.txt(cx, String(i + 1), x + w / 2, y + 16, 44, { align: "center", weight: 900, color: "#1B2150" }); cx.restore(); } }
    cx.restore();
    const pR = pop(l, T.tRil + 0.3); tag(cx, "dirilis", x0 - 140, y, pR.a, { sp: pR.sp, col: AIA, size: 44 });
    if (pR.a > 0.01) { cx.save(); cx.globalAlpha *= pR.a; star(cx, x0 - 24, y, 18, AIA); cx.restore(); }
    const pW = pop(l, T.tMg + 0.15); tag(cx, "3 minggu", x0 + 1.5 * sw, y - 86, pW.a, { sp: pW.sp, col: P.amber, size: 48 });
    const pE = pop(l, T.tSeb); if (pE.a > 0.01) { cx.save(); cx.globalAlpha *= pE.a; const ex = x0 + 3 * sw + 30;
      cx.fillStyle = "rgba(242,246,255,0.7)"; cx.beginPath(); cx.moveTo(ex + 22, y); cx.lineTo(ex - 4, y - 16); cx.lineTo(ex - 4, y + 16); cx.closePath(); cx.fill(); cx.restore();
      tag(cx, "soal", x0 + 3 * sw + 110, y, pE.a, { sp: pE.sp, col: P.amber, size: 44 }); }
  }
  S.b8_1 = function (ctx, b, l, t) {
    const T = T1(b); stage(ctx, t);
    laptop(ctx, LAP.x, LAP.y, LAP.w, t, { lit: 1, typing: win(l, T.tSt - 0.2, T.tMem + 0.3, 0.3), screen: (c, sx, sy, sw, sh) => lapQ(c, sx, sy, sw, sh, t) });
    const dA = ramp(l, T.tCl - 0.15, 0.9), absorb = ramp(l, T.tCl + 0.35, 0.6);
    aiDeck(ctx, DECK.x, DECK.y, DECK.s, dA, t, { style: "A", think: absorb >= 1, flash: win(l, T.tCl + 0.8, T.tCl + 1.3, 0.3) });
    const f1 = eio(ramp(l, T.tMem - 0.05, 1.25)), f2 = eio(absorb);
    if (l > T.tMem - 0.1 && absorb < 1) { const p0 = [LAP.x, 470], p1 = [1110, 380], p2 = [DECK.x, DECK.y];
      let x = lerp(p0[0], p1[0], f1), y = lerp(p0[1], p1[1], f1) - Math.sin(f1 * Math.PI) * 120; x = lerp(x, p2[0], f2); y = lerp(y, p2[1], f2);
      soalCard(ctx, x, y, lerp(lerp(0.7, 1.2, f1), 0.3, f2), ramp(l, T.tMem - 0.1, 0.2) * (1 - ramp(l, T.tCl + 0.8, 0.15)), t); }
    sparkle(ctx, DECK.x + 70, DECK.y - 100, 34, win(l, T.tCl + 0.85, T.tCl + 1.4, 0.2));
    let o; if (l < T.tCl) o = { pose: "diam", t, mood: "happy", look: [-1, 0.1] };
    else if (l < T.tRil) o = { pose: "tunjuk", t, target: [DECK.x + 80, DECK.y - 10], mood: "wow" };
    else o = { pose: "diam", t, mood: "think", look: [-0.8, 0.6] };
    KB.draw(ctx, 1790, 805, 130, o);
    D.post(cx => {
      const lab = l < T.tOp ? "Claude" : l < T.t46 ? "Claude Opus" : l < T.tAnt ? "Claude Opus 4.6" : "Claude Opus 4.6 (Anthropic)";
      const pl = pop(l, T.tCl); ptag(cx, "Claude Opus 4.6 (Anthropic)", lab, DECK.x, 190, pl.a, { sp: pl.sp, col: AIA, size: 48 });
      const pS = pop(l, T.tSt); tag(cx, "Filip Stappers", LAP.x, 795, pS.a, { sp: pS.sp, col: P.warm, size: 48 });
      const pM = pop(l, T.tMod); tag(cx, "model AI", DECK.x + 80, 690, pM.a, { sp: pM.sp, col: AIA, size: 46 });
      weeks(cx, l, T, t);
    });
  };

  // =====================================================================
  // b8_2 + awal b8_3: kartu percobaan dan kisi 31 kartu
  const ACT = { x: 140, y: 230, w: 560, h: 500 };
  const GRID = { x0: 800, y0: 250, px: 124, py: 136, w: 108, h: 120 };
  const slot = k => { const i = k - 1, r = Math.floor(i / 8), c = i % 8; return [GRID.x0 + c * GRID.px + GRID.w / 2, GRID.y0 + r * GRID.py + GRID.h / 2]; };
  const BIPS = { x: GRID.x0 + 7 * GRID.px + GRID.w / 2, y: GRID.y0 + 3 * GRID.py + 70, s: 104 };
  const NOTE = { x: 610, y: 800, rot: -0.07 };
  const CLK = { x: 1720, y: 150, r: 50 };
  const STAT = k => k === 31 ? "B" : [5, 12, 19, 26].includes(k) ? "K" : (k % 3 === 2 ? "X" : "L");
  const STAMP = { L: ["terlalu lambat", "#9AA3C7"], X: ["tidak berhasil", "#E07A7A"], K: ["ada kemajuan", AIA], B: ["berhasil!", P.green] };
  function attempts(b) { const A = [0, D.at(b, "mencoba"), D.at(b, "menulis program")]; const t3 = D.at(b, "kecil,") + 0.35; for (let k = 3; k <= 30; k++) A.push(lerp(t3, b.dur - 0.35, (k - 3) / 27)); return A; }
  function clockFrac(TL, t) {
    const b2 = TL.beats.find(x => x.id === "b8_2"), b3 = TL.beats.find(x => x.id === "b8_3"); if (!b2 || !b3) return 0;
    const t0 = b2.start + D.at(b2, "mencoba"), t1 = b3.start + D.atEnd(b3, "jam"); return clamp((t - t0) / (t1 - t0));
  }
  function codeLines(ctx, x, y, w, u, seed, n = 7) {
    const r = D.rng(seed * 97 + 13), C = ["#6A7BE0", "#36B3A3", "#E9A23B", "#9A6FD6", "#E8665F", "#5AA9FF"];
    for (let i = 0; i < n; i++) { const ind = Math.floor(r() * 3) * 34, len = (0.3 + r() * 0.55) * (w - ind), c = C[Math.floor(r() * C.length)], c2 = C[Math.floor(r() * C.length)];
      const f = clamp(u * n - i); if (f <= 0) { r(); continue; } const yy = y + i * 34;
      ctx.fillStyle = "rgba(40,50,110,0.25)"; ctx.fillRect(x - 30, yy + 2, 16, 10);
      ctx.fillStyle = c; RR(ctx, x + ind, yy, Math.min(len * 0.45, len * f), 14, 7); ctx.fill();
      if (f > 0.45) { ctx.fillStyle = c2; RR(ctx, x + ind + len * 0.5, yy, len * 0.5 * clamp((f - 0.45) / 0.55), 14, 7); ctx.fill(); }
      r(); }
  }
  // kartu percobaan besar: o.k nomor (0 = belum), code 0..1, stamp status, stampA, think, glow (emas)
  function activeCard(ctx, t, o) {
    const { x, y, w, h } = ACT, gold = o.k === 31, col = gold ? GOLD : AIA;
    ctx.save();
    if ((o.glow || 0) > 0.01) D.glow(ctx, x + w / 2, y + h / 2, 520, GOLD, 0.35 * o.glow);
    ctx.fillStyle = "rgba(10,14,40,0.4)"; RR(ctx, x + 10, y + 14, w, h, 22); ctx.fill();
    ctx.fillStyle = "#EEF3FF"; RR(ctx, x, y, w, h, 22); ctx.fill(); ctx.strokeStyle = D.hexA(col, 0.95); ctx.lineWidth = gold ? 7 : 5; ctx.stroke();
    ctx.fillStyle = col; RR(ctx, x, y, w, 96, 22); ctx.fill(); ctx.fillRect(x, y + 60, w, 36);
    wtxt(ctx, o.k ? `percobaan ${o.k}` : "percobaan", x + w / 2, y + 66, 52, { weight: 900, color: "#10142E" });
    if (o.think) { for (let d = 0; d < 3; d++) { const yy = y + 260 - Math.max(0, Math.sin(t * 6 - d * 0.9)) * 18; ctx.fillStyle = D.hexA("#1F9C90", 0.9); ctx.beginPath(); ctx.arc(x + w / 2 + (d - 1) * 50, yy, 14, 0, TAU); ctx.fill(); } }
    else codeLines(ctx, x + 70, y + 132, w - 120, o.code || 0, o.k || 1, 7);
    const sa = o.stampA || 0;
    if (o.stamp && sa > 0.01) { const [s, sc] = STAMP[o.stamp], k = lerp(1.35, 1, eout(clamp(sa * 1.4)));
      ctx.save(); ctx.globalAlpha *= clamp(sa * 2); ctx.translate(x + w / 2, y + h - 78); ctx.rotate(-0.06); ctx.scale(k, k);
      ctx.font = `900 52px ${FONT}`; const tw = ctx.measureText(s).width + 120;
      ctx.fillStyle = "rgba(255,255,255,0.92)"; RR(ctx, -tw / 2, -44, tw, 88, 16); ctx.fill(); ctx.strokeStyle = sc; ctx.lineWidth = 6; ctx.stroke();
      const ix = -tw / 2 + 46; if (o.stamp === "L") hourglass(ctx, ix, 0, 18, sc); else if (o.stamp === "X") crossMark(ctx, ix, 0, 14, sc); else if (o.stamp === "K") star(ctx, ix, 0, 22, sc); else checkMark(ctx, ix, 0, 24, 1, 1);
      wtxt(ctx, s, 24, 18, 52, { weight: 900, color: o.stamp === "L" ? "#5B6488" : o.stamp === "X" ? "#B23A36" : o.stamp === "K" ? "#167A70" : "#1F8A4C" });
      ctx.restore(); }
    ctx.restore();
  }
  function miniCard(ctx, k, a, t, o = {}) {
    if (a <= 0.01) return; const [cx, cy] = o.at || slot(k), st = STAT(k), sp = clamp(spring(a * 1.0, 10, 0.55)), sc = lerp(0.5, 1, sp) * (o.scale || 1);
    const w = GRID.w, h = GRID.h;
    ctx.save(); ctx.globalAlpha *= clamp(a * 3); ctx.translate(cx, cy); ctx.scale(sc, sc);
    const gl = (o.glow || 0); if (gl > 0.01) D.glow(ctx, 0, 0, 150, st === "B" ? GOLD : AIA, 0.5 * gl);
    const fill = st === "B" ? "#6B5418" : st === "K" ? "#1E5560" : "#454C78", bd = st === "B" ? GOLD : st === "K" ? AIA : "rgba(200,210,240,0.45)";
    ctx.fillStyle = "rgba(10,14,40,0.35)"; RR(ctx, -w / 2 + 5, -h / 2 + 7, w, h, 14); ctx.fill();
    ctx.fillStyle = fill; RR(ctx, -w / 2, -h / 2, w, h, 14); ctx.fill(); ctx.strokeStyle = bd; ctx.lineWidth = st === "B" ? 5 : 3; ctx.stroke();
    wtxt(ctx, String(k), 0, 4, 48, { weight: 900, color: st === "L" || st === "X" ? "#C9D0EA" : "#FFFFFF" });
    const iy = h / 2 - 24;
    if (st === "L") hourglass(ctx, 0, iy, 11, "#9AA3C7"); else if (st === "X") crossMark(ctx, 0, iy, 9, "#E07A7A"); else if (st === "K") star(ctx, 0, iy, 14, AIA); else checkMark(ctx, 0, iy, 15, 1, 1);
    ctx.restore();
  }
  // seluruh wilayah 1; st: {k, code, stamp, stampA, think, glow, minis(k)→a, mGlow(k), fly{k,u}, note, notePulse, hand{x,y}|null, clk, clkDone, bip, bipX, bipY}
  function region1(ctx, t, st) {
    activeCard(ctx, t, st);
    for (let k = 1; k <= 31; k++) { const a = st.minis(k); if (a <= 0.01) continue;
      if (st.fly && st.fly.k === k && st.fly.u < 1) { const u = eio(st.fly.u), [sx, sy] = [ACT.x + ACT.w / 2, ACT.y + ACT.h - 78], [tx, ty] = slot(k);
        miniCard(ctx, k, 1, t, { at: [lerp(sx, tx, u), lerp(sy, ty, u) - Math.sin(u * Math.PI) * 90], scale: lerp(1.25, 1, u) }); }
      else miniCard(ctx, k, a, t, { glow: st.mGlow ? st.mGlow(k) : 0 }); }
    clock(ctx, CLK.x, CLK.y, CLK.r, st.clk || 0, t, st.clkDone || 0);
    sticky(ctx, NOTE.x, NOTE.y + (1 - eout(clamp(st.note || 0))) * 30, NOTE.rot + Math.sin(t * 1.7) * 0.01, clamp((st.note || 0) * 3), st.notePulse || 0);
    if (st.hand) hand(ctx, st.hand.x, st.hand.y, 2.62, { s: 1.05 });
    if (st.bip) KB.draw(ctx, st.bipX == null ? BIPS.x : st.bipX, st.bipY == null ? BIPS.y : st.bipY, BIPS.s, st.bip);
  }
  function T2(b) { return { tMc: D.at(b, "mencoba"), tPr: D.at(b, "menulis program"), tSem: D.at(b, "sementara"), tSt: D.at(b, "Stappers"), tMd: D.at(b, "mendampingi"),
    tIng: D.at(b, "mengingatkannya"), tCat: D.at(b, "mencatat"), tKm: D.at(b, "kemajuan."), tEnd: D.speechEnd(b) }; }
  function handPos(l, T) {   // tangan masuk dari kiri bawah, menempelkan catatan, lalu pergi
    const tin = T.tSem + 0.05, tst = T.tMd, tout = T.tIng + 0.7;
    if (l < tin || l > tout + 1.0) return null;
    const off = [-520, 1300], tgt = [NOTE.x - 118, NOTE.y + 70];
    if (l < tst) { const u = eio(ramp(l, tin, tst - tin)); return { x: lerp(off[0], tgt[0], u), y: lerp(off[1], tgt[1], u) + Math.sin(u * Math.PI) * -40 }; }
    if (l < tout) { const pr = Math.sin(clamp((l - tst) / 0.3) * Math.PI) * 10; return { x: tgt[0] + pr, y: tgt[1] + pr * 0.6 }; }
    const u = eio(ramp(l, tout, 1.0)); return { x: lerp(tgt[0], off[0], u), y: lerp(tgt[1], off[1], u) };
  }
  S.b8_2 = function (ctx, b, l, t, TL) {
    const T = T2(b), A = attempts(b); stage(ctx, t);
    let k = 0; for (let i = 1; i <= 30; i++) if (l >= A[i]) k = i;
    const nx = k ? (k < 30 ? A[k + 1] : A[k] + 0.5) : A[1], ph = k ? clamp((l - A[k]) / (nx - A[k])) : 0, det = k > 0 && k <= 2;
    const appear = i => A[i] + (i <= 2 ? 0.5 * (A[i + 1] - A[i]) : 0.12);
    const st = {
      k, code: det ? clamp(ph / 0.5) : (k ? 0.45 + 0.55 * ph : 0), think: k === 0,
      stamp: k ? STAT(k) : null, stampA: k ? (det ? ramp(ph, 0.5, 0.12) : ramp(ph, 0.35, 0.1)) : 0,
      minis: i => i > 30 ? 0 : ramp(l, appear(i), i <= 2 ? 0.01 : 0.18),
      fly: det && ph >= 0.5 ? { k, u: clamp((ph - 0.5) / 0.4) } : null,
      mGlow: i => STAT(i) === "K" ? win(l, T.tCat, b.dur, 0.3) * (0.6 + 0.4 * Math.sin(t * 4 + i)) : 0,
      note: ramp(l, T.tMd, 0.25), notePulse: win(l, T.tCat, b.dur, 0.3) * (0.5 + 0.5 * Math.sin(t * 4)),
      hand: handPos(l, T), clk: clockFrac(TL, t),
    };
    const lastSt = k ? STAT(k) : null;
    let mood = "think", look = [-1, -0.2];
    if (det && ph > 0.5) mood = "sad"; else if (lastSt === "K") mood = "happy";
    if (l > T.tSem && l < T.tIng + 0.8) look = [-1, 0.5];
    if (l > T.tKm) mood = "happy";
    st.bip = { pose: "diam", t, mood, look };
    region1(ctx, t, st);
    D.post(cx => {
      tag(cx, "Claude Opus 4.6 (Anthropic)", 470, 150, 1, { col: AIA, size: 44 });
      const pS = pop(l, T.tSt); tag(cx, "Filip Stappers", 935, 862, pS.a, { sp: pS.sp, col: P.warm, size: 46 });
      const pK = pop(l, T.tKm); const w = tag(cx, "kemajuan dicatat", 1440, 862, pK.a, { sp: pK.sp, col: AIA, size: 46 });
      if (w) { cx.save(); cx.globalAlpha *= pK.a; star(cx, 1440 - w / 2 - 36, 862, 24, AIA); cx.restore(); }
    });
  };

  // =====================================================================
  // b8_3: percobaan 31 → kubus ganjil 3, 5, 7 → uji sampai 101 → bukti Knuth → diperiksa Lean
  function T3(b) { return { tPc: D.at(b, "percobaan"), t31: D.at(b, "puluh satu,"), tJam: D.at(b, "satu jam"), tJamE: D.atEnd(b, "jam"), tAI: D.at(b, "AI itu"), tMh: D.at(b, "menghasilkan"),
    tBh: D.at(b, "berhasil"), tKub: D.at(b, "kubus berukuran"), tGj: D.at(b, "ganjil."), tSt: D.at(b, "Stappers"), tUji: D.at(b, "mengujinya"), t101: D.at(b, "seratus satu,"), t101e: D.atEnd(b, "seratus satu,"),
    tLalu: D.at(b, "lalu Knuth"), tKn: D.at(b, "Knuth"), tTul: D.at(b, "menulis sendiri"), tBkt: D.atEnd(b, "matematikanya."), tBi: D.at(b, "Bukti itu"), tDip: D.at(b, "diperiksa ulang"),
    tKim: D.at(b, "Kim"), tPb: D.at(b, "pemeriksa bukti"), tLean: D.at(b, "Lean."), tLeanE: D.atEnd(b, "Lean."), tEnd: D.speechEnd(b) }; }
  // wilayah 2 (koordinat layar saat kamera tiba)
  const R2 = { c: [{ n: 3, x: 280, y: 450, B: 170 }, { n: 5, x: 680, y: 450, B: 250 }, { n: 7, x: 1150, y: 440, B: 320 }], lap: { x: 1585, y: 650, w: 360 } };
  const R3 = { pap: { x: 560, y: 470, w: 600, h: 520 }, mac: { x: 1390, y: 470, w: 480, h: 400 } };
  // kertas bukti (tulisan tangan ilustratif); u 0..1 progres menulis; kembalikan ujung pensil
  const PROOF = [["Bukti", 62, "italic 800", 0.16], ["s = i + j + k (mod m)", 46, "italic 700", 0.42], [null, 0, 0, 0.58], ["untuk setiap m ganjil", 46, "italic 700", 0.82], [null, 0, 0, 1]];
  function proofPaper(ctx, x, y, w, h, u, t, o = {}) {
    ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.sc) ctx.scale(o.sc, o.sc);
    ctx.fillStyle = "rgba(10,14,40,0.35)"; ctx.fillRect(-w / 2 + 10, -h / 2 + 14, w, h);
    ctx.fillStyle = "#FBF4E2"; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = "rgba(90,130,200,0.28)"; ctx.lineWidth = 2; for (let r = 1; r < 9; r++) { const yy = -h / 2 + 40 + r * (h - 60) / 9; ctx.beginPath(); ctx.moveTo(-w / 2 + 14, yy); ctx.lineTo(w / 2 - 14, yy); ctx.stroke(); }
    ctx.strokeStyle = "rgba(220,90,90,0.35)"; ctx.beginPath(); ctx.moveTo(-w / 2 + 64, -h / 2); ctx.lineTo(-w / 2 + 64, h / 2); ctx.stroke();
    let tip = null, u0 = 0; const x0 = -w / 2 + 90;
    PROOF.forEach(([s, size, wt, u1], i) => { const yy = -h / 2 + 100 + i * 92, f = clamp((u - u0) / (u1 - u0)); u0 = u1; if (f <= 0) return;
      if (s) { ctx.save(); ctx.font = `${wt} ${size}px ${FONT}`; const tw = ctx.measureText(s).width; ctx.beginPath(); ctx.rect(x0 - 10, yy - size, (tw + 20) * f, size * 1.4); ctx.clip();
        wtxt(ctx, s, x0, yy, size, { align: "left", weight: wt, color: i === 0 ? "#B23A36" : INK }); ctx.restore(); if (f < 1) tip = [x0 + tw * f, yy - size * 0.2]; }
      else { const len = (i === 4 ? 0.45 : 0.8) * (w - 180); ctx.strokeStyle = "rgba(60,70,120,0.7)"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, yy - 14);
        for (let q = 0; q <= 1.0001; q += 0.02) { if (q > f) break; ctx.lineTo(x0 + q * len, yy - 14 + Math.sin(q * 46 + i) * 7); } ctx.stroke();
        if (i === 4 && f > 0.98) { ctx.fillStyle = INK; ctx.fillRect(x0 + len + 24, yy - 30, 26, 26); }
        if (f < 1) tip = [x0 + len * f, yy - 14]; } });
    if (o.ticks) o.ticks.forEach((a, i) => { if (a > 0.01) checkMark(ctx, w / 2 - 56, -h / 2 + 100 + [0, 1, 3, 4][i] * 92 - 16, 24, a, clamp(spring(a * 0.8, 10, 0.5))); });
    ctx.restore();
    return tip ? [x + tip[0] * (o.sc || 1), y + tip[1] * (o.sc || 1)] : null;
  }
  // mesin pemeriksa bukti bergaya (tanpa merek); o: lines 0..4 baris tampil, ticks[], scan 0..1, ok 0..1, name "Lean" + nameA, busy
  function machine(ctx, x, y, t, o = {}) {
    const { w, h } = R3.mac; ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(10,14,40,0.4)"; RR(ctx, -w / 2 + 12, -h / 2 + 16, w, h, 30); ctx.fill();
    const gr = ctx.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, "#5A6AB8"); gr.addColorStop(1, "#38448C");
    ctx.fillStyle = gr; RR(ctx, -w / 2, -h / 2, w, h, 30); ctx.fill(); ctx.strokeStyle = "rgba(220,230,255,0.35)"; ctx.lineWidth = 3; ctx.stroke();
    // celah masuk di atas
    ctx.fillStyle = "#252C66"; RR(ctx, -130, -h / 2 + 18, 260, 22, 11); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillRect(-120, -h / 2 + 36, 240, 3);
    // layar
    const dx = -w / 2 + 40, dy = -h / 2 + 64, dw = w - 80, dh = 196;
    ctx.fillStyle = "#151B48"; RR(ctx, dx, dy, dw, dh, 16); ctx.fill();
    const ok = o.ok || 0;
    for (let i = 0; i < 4; i++) { const a = clamp((o.lines || 0) - i); if (a <= 0.01) continue; const yy = dy + 32 + i * 44;
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "rgba(242,246,255,0.65)"; RR(ctx, dx + 30, yy - 8, [230, 290, 250, 150][i], 16, 8); ctx.fill(); ctx.restore();
      const ta = o.ticks ? o.ticks[i] || 0 : 0; if (ta > 0.01) checkMark(ctx, dx + dw - 46, yy, 17, ta, clamp(spring(ta * 0.8, 10, 0.5))); }
    if ((o.scan || 0) > 0 && o.scan < 1 && ok < 0.5) { const sy = dy + 10 + (dh - 20) * o.scan; ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = "rgba(120,220,255,0.35)"; ctx.fillRect(dx + 8, sy - 3, dw - 16, 6); D.glow(ctx, dx + dw / 2, sy, 160, "#78DCFF", 0.25); ctx.restore(); }
    if (ok > 0.01) { ctx.save(); ctx.globalAlpha *= ok; ctx.fillStyle = "rgba(21,27,72,0.8)"; RR(ctx, dx, dy, dw, dh, 16); ctx.fill(); ctx.restore(); checkMark(ctx, 0, dy + dh / 2, 70, ok, clamp(spring(ok * 0.9, 9, 0.5))); }
    // lampu status
    const lc = ok > 0.5 ? P.green : P.amber, la = ok > 0.5 ? 1 : (o.busy ? 0.5 + 0.5 * Math.sin(t * 9) : 0.3);
    D.glow(ctx, w / 2 - 44, -h / 2 + 30, 40, lc, la); ctx.fillStyle = lc; ctx.beginPath(); ctx.arc(w / 2 - 44, -h / 2 + 30, 11, 0, TAU); ctx.fill();
    // roda gigi kecil berputar (hidup)
    [[-w / 2 + 70, h / 2 - 66, 26, 1], [-w / 2 + 112, h / 2 - 48, 18, -1.4]].forEach(([gx, gy, r, sp]) => { ctx.save(); ctx.translate(gx, gy); ctx.rotate(t * sp * (o.busy ? 2.4 : 0.4)); ctx.fillStyle = "#8A97D8";
      ctx.beginPath(); for (let q = 0; q < 16; q++) { const rr = q % 2 ? r * 0.78 : r, an = q / 16 * TAU; ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } ctx.closePath(); ctx.fill(); ctx.fillStyle = "#38448C"; ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, TAU); ctx.fill(); ctx.restore(); });
    // pelat nama
    ctx.fillStyle = "#EEF3FF"; RR(ctx, -110, h / 2 - 96, 220, 72, 14); ctx.fill(); ctx.strokeStyle = D.hexA(P.teal, 0.8); ctx.lineWidth = 3; ctx.stroke();
    const na = o.nameA || 0;
    if (na > 0.01) { ctx.save(); ctx.globalAlpha *= na; wtxt(ctx, o.name || "Lean", 0, h / 2 - 42, 52, { weight: 900, color: "#1E2766" }); ctx.restore(); }
    else for (let d = 0; d < 3; d++) { ctx.fillStyle = "rgba(40,50,110,0.35)"; ctx.beginPath(); ctx.arc((d - 1) * 28, h / 2 - 60, 7, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  function keyboard(ctx, x, y, w, t, typing) {
    ctx.save(); shadowE(ctx, x + 6, y + 22, w * 0.55, 12, 0.3);
    ctx.fillStyle = "#3A417F"; ctx.beginPath(); ctx.moveTo(x - w / 2 + 20, y - 18); ctx.lineTo(x + w / 2 - 20, y - 18); ctx.lineTo(x + w / 2, y + 18); ctx.lineTo(x - w / 2, y + 18); ctx.closePath(); ctx.fill();
    for (let r = 0; r < 3; r++) for (let q = 0; q < 12; q++) { const hot = typing > 0.01 && ((Math.floor(t * 10) * 5 + r * 7 + q * 3) % 13 === 0); ctx.fillStyle = hot ? D.hexA(P.teal, 0.9) : "#262C62";
      const yy = y - 12 + r * 10, hw = lerp(w / 2 - 26, w / 2 - 8, r / 2); ctx.fillRect(x - hw + q * (2 * hw / 12) + 2, yy, 2 * hw / 12 - 4, 7); }
    ctx.restore();
  }
  S.b8_3 = function (ctx, b, l, t, TL) {
    const T = T3(b);
    const tP1 = T.tKub - 0.1, tP2 = T.tLalu - 0.35, P1 = eio(ramp(l, tP1, 1.1)), P2 = eio(ramp(l, tP2, 1.1)), camX = 1920 * (P1 + P2);
    stage(ctx, t, { px: camX * 0.025 });
    const ox1 = -camX, ox2 = 1920 - camX, ox3 = 3840 - camX;
    // ---- wilayah 1 ----
    const cardGold = ramp(l, T.tPc, 0.4), m31 = ramp(l, T.t31 + 0.05, 0.25);
    if (ox1 > -1920) { ctx.save(); ctx.translate(ox1, 0);
      region1(ctx, t, { k: l < T.tPc ? 30 : 31, code: l < T.tPc ? 1 : ramp(l, T.tPc + 0.2, T.tMh + 0.5 - T.tPc), stamp: l < T.tPc ? null : "B", stampA: ramp(l, T.tBh, 0.15), glow: cardGold * (0.6 + 0.4 * Math.sin(t * 3)),
        minis: i => i < 31 ? 1 : m31, mGlow: i => i === 31 ? m31 * (0.6 + 0.4 * Math.sin(t * 3)) : 0, note: 1, notePulse: 0, hand: null, clk: clockFrac(TL, t), clkDone: ramp(l, T.tJamE, 0.3) });
      ctx.restore(); }
    // kartu 31: muncul di petak kisi, lalu ikut kamera ke pojok kiri atas wilayah 2
    // Bip: petak kisi → jalan ke wilayah 2 → wilayah 3
    { const b1 = [BIPS.x, BIPS.y], b2 = [1830, 830], b3 = [1790, 830], u1 = eio(ramp(l, tP1, 1.1)), u2 = eio(ramp(l, tP2, 1.1));
      const x = u2 > 0 ? lerp(b2[0], b3[0], u2) : lerp(b1[0], b2[0], u1), y = u2 > 0 ? lerp(b2[1], b3[1], u2) : lerp(b1[1], b2[1], u1);
      const moving = (u1 > 0 && u1 < 1) || (u2 > 0 && u2 < 1); let o;
      if (moving) o = { pose: "jalan", t, dir: 1, mood: "happy" };
      else if (l < T.tPc) o = { pose: "diam", t, mood: "think", look: [-1, -0.2] };
      else if (l < T.tBh) o = { pose: "diam", t, mood: "wow", look: [-1, 0] };
      else if (l < T.tBh + 1.2) o = { pose: "kaget", t, k: l - T.tBh, mood: "wow", seru: false };
      else if (l < tP2) o = { pose: "tunjuk", t, target: [1585, 520], mood: "happy" };
      else if (l < T.tLeanE + 0.25) o = { pose: "diam", t, mood: "think", look: [-1, -0.3] };
      else if (l < T.tLeanE + 1.45) o = { pose: "kaget", t, k: l - T.tLeanE - 0.25, mood: "wow", seru: false };
      else o = { pose: "diam", t, mood: "happy", look: [-1, -0.2] };
      KB.draw(ctx, x, y, u2 > 0.5 ? 115 : lerp(BIPS.s, 100, u1), o); }
    // ---- wilayah 2: kubus ganjil + uji ----
    const pc = [T.tKub + 0.5, T.tKub + 1.0, T.tKub + 1.6].map((t0, i) => eio(ramp(l, t0, [1.4, 2.0, 2.6][i])));
    const tUe = T.t101 + 0.45, nOdd = l < T.tUji ? 3 : 3 + 2 * Math.round(49 * eio(ramp(l, T.tUji, tUe - T.tUji)));
    if (ox2 < 1920 && ox2 > -1920) { ctx.save(); ctx.translate(ox2, 0);
      miniCard(ctx, 31, ramp(l, tP1 + 0.8, 0.3), t, { at: [215, 170], glow: 0.6 + 0.4 * Math.sin(t * 3) });
      R2.c.forEach((c, i) => { const a = ramp(l, T.tKub - 0.2 + i * 0.25, 0.5); colorCube(ctx, c.n, c.x, c.y, c.B * lerp(0.75, 1, eout(a)), pc[i], t, { a, yaw: i * 0.01, rise: r => a }); });
      laptop(ctx, R2.lap.x, R2.lap.y, R2.lap.w, t, { lit: 1, typing: win(l, T.tUji - 0.2, tUe, 0.3), screen: (c, sx, sy, sw, sh) => {
        const a = ramp(l, T.tSt, 0.4); if (a <= 0.01) { lapQ(c, sx, sy, sw, sh, t, 0.6); return; }
        c.save(); c.globalAlpha *= a; wtxt(c, "ukuran", sx + sw / 2 - 40, sy + 54, 44, { weight: 800, color: P.ink2 });
        wtxt(c, String(nOdd), sx + sw / 2 - 40, sy + 140, 84, { weight: 900, color: "#FFFFFF" });
        if (l >= T.tUji) checkMark(c, sx + sw / 2 + 92, sy + 112, 28, 1, 1);
        const n = (nOdd - 1) / 2; for (let q = 0; q < 50; q++) { c.fillStyle = q < n ? P.green : "rgba(242,246,255,0.18)"; c.fillRect(sx + 18 + q * (sw - 36) / 50, sy + sh - 30, (sw - 36) / 50 - 2, 14); }
        c.restore(); } });
      ctx.restore(); }
    // ---- wilayah 3: bukti Knuth + Lean ----
    const wr = ramp(l, T.tTul, T.tBi - 0.2 - T.tTul), fly = eio(ramp(l, T.tBi, 1.2)), into = eio(ramp(l, T.tBi + 1.2, 0.55));
    const lines = 4 * ramp(l, T.tDip + 0.4, 1.0), tk = [0, 1, 2, 3].map(i => ramp(l, lerp(T.tKim + 0.2, T.tLean, i / 3), 0.2)), ok = ramp(l, T.tLeanE + 0.25, 0.35);
    if (ox3 < 1920) { ctx.save(); ctx.translate(ox3, 0);
      const { pap, mac } = R3;
      // salinan bukti terbang ke celah mesin (digambar sebelum mesin supaya masuk ke belakang)
      if (fly > 0 && into < 1) { const sc = lerp(1, 0.36, fly), x = lerp(pap.x, mac.x, fly), y = lerp(pap.y, mac.y - mac.h / 2 - 60, fly) - Math.sin(fly * Math.PI) * 120 + into * 120;
        ctx.save(); ctx.globalAlpha *= 1 - into * 0.2; proofPaper(ctx, x, y, pap.w, pap.h, 1, t, { sc, rot: fly * 0.05 }); ctx.restore(); }
      machine(ctx, mac.x, mac.y, t, { lines, ticks: tk, scan: ramp(l, T.tDip + 0.4, T.tLeanE - T.tDip), busy: l > T.tDip && ok < 0.5, ok, nameA: ramp(l, T.tLean, 0.3) });
      keyboard(ctx, mac.x, mac.y + mac.h / 2 + 50, 300, t, win(l, T.tKim, T.tLeanE, 0.3));
      const tip = proofPaper(ctx, pap.x, pap.y, pap.w, pap.h, wr, t, { ticks: [0, 1, 2, 3].map(i => ok * ramp(l, T.tLeanE + 0.5 + i * 0.25, 0.2)) });
      glasses(ctx, ramp(l, T.tKn, 0.4) * 0.8, pap.x + 200, pap.y + 200, 0.8);
      const pn = tip ? { x: tip[0], y: tip[1], ang: -1.0, lift: 0 } : { x: pap.x + 210, y: pap.y + 150, ang: -0.6, lift: 0 };
      pencil(ctx, pn.x, pn.y, pn.ang, 0, 0.9);
      ctx.restore(); }
    D.post(cx => {
      // wilayah 1
      const a1 = 1 - ramp(l, tP1, 0.25);
      if (a1 > 0.01) { tag(cx, "Claude Opus 4.6 (Anthropic)", 470, 150, a1, { col: AIA, size: 44 }); tag(cx, "Filip Stappers", 935, 862, a1, { col: P.warm, size: 46 });
        const pJ = pop(l, T.tJam); tag(cx, "± 1 jam", CLK.x - 170, CLK.y, pJ.a * a1, { sp: pJ.sp, col: GOLD, size: 50 }); }
      // wilayah 2
      const a2 = ramp(l, tP1 + 0.8, 0.3) * (1 - ramp(l, tP2, 0.25));
      if (a2 > 0.01) {
        const pG = pop(l, T.tGj); tag(cx, "ukuran ganjil", 720, 160, pG.a * a2, { sp: pG.sp, col: P.green, size: 52 });
        R2.c.forEach((c, i) => { const p = pop(l, T.tKub + 0.3 + i * 0.4); const w = tag(cx, `${c.n} × ${c.n} × ${c.n}`, c.x, 770, p.a * a2, { sp: p.sp, col: COL3[i], size: 46 });
          if (w && pc[i] >= 1) checkMark(cx, c.x + w / 2 + 32, 770, 24, ramp(l, [T.tKub + 1.9, T.tKub + 3.0, T.tKub + 4.2][i], 0.2) * a2, 1); });
        const pS = pop(l, T.tSt); tag(cx, "Filip Stappers", R2.lap.x, 848, pS.a * a2, { sp: pS.sp, col: P.warm, size: 46 });
        const pD = pop(l, tUe); const w = tag(cx, "diuji sampai 101", R2.lap.x, 340, pD.a * a2, { sp: pD.sp, col: P.green, size: 46 });
        if (w) checkMark(cx, R2.lap.x + w / 2 + 30, 340, 22, pD.a * a2, pD.sp);
      }
      // wilayah 3
      const a3 = ramp(l, tP2 + 0.8, 0.3);
      if (a3 > 0.01) {
        const pK = pop(l, T.tKn); tag(cx, "Donald Knuth", R3.pap.x, 815, pK.a * a3, { sp: pK.sp, col: P.warm, size: 48 });
        const pB = pop(l, T.tBkt - 0.3); tag(cx, "bukti matematika", R3.pap.x, 160, pB.a * a3 * (1 - ramp(l, T.tBi, 0.3)), { sp: pB.sp, col: P.amber, size: 48 });
        const pDp = pop(l, T.tDip); tag(cx, "diperiksa ulang", R3.mac.x, 160, pDp.a * a3 * (1 - ramp(l, T.tPb - 0.15, 0.2)), { sp: pDp.sp, col: P.teal, size: 48 });
        const pPb = pop(l, T.tPb); tag(cx, "program pemeriksa bukti", R3.mac.x, 160, pPb.a * a3 * (1 - ramp(l, T.tLeanE + 0.15, 0.2)), { sp: pPb.sp, col: P.teal, size: 48 });
        const pOk = pop(l, T.tLeanE + 0.3); const w = tag(cx, "bukti lolos pemeriksaan", R3.mac.x - 20, 160, pOk.a * a3, { sp: pOk.sp, col: P.green, size: 48 });
        if (w) checkMark(cx, R3.mac.x - 20 + w / 2 + 34, 160, 26, pOk.a * a3, pOk.sp);
        const pKm = pop(l, T.tKim); tag(cx, "Kim Morrison", R3.mac.x, 845, pKm.a * a3, { sp: pKm.sp, col: P.teal, size: 48 });
      }
    });
  };

  // =====================================================================
  // b8_4: ukuran genap → Ho Boon Suan + GPT-5.3-codex → uji sampai 200 → 8 juta ruangan
  function T4(b) { return { tUG: D.at(b, "Untuk ukuran genap,"), tGn: D.at(b, "genap,"), tHB: D.at(b, "hanya berhasil"), tBh: D.at(b, "berhasil"), tBk: D.at(b, "beberapa ukuran kecil"), tKc: D.at(b, "kecil"),
    tTM: D.at(b, "tidak menemukan"), tRu: D.at(b, "rumus umumnya."), tRuE: D.atEnd(b, "rumus umumnya."), tBH: D.at(b, "Beberapa hari"), tHo: D.at(b, "Ho Boon"), tSg: D.at(b, "Singapura"),
    tMin: D.at(b, "meminta"), tGPT: D.at(b, "GPT"), tOAI: D.at(b, "OpenAI"), tMP: D.at(b, "menulis program"), tBG: D.at(b, "berukuran genap"), t8: D.at(b, "delapan."),
    tUji: D.at(b, "Ia mengujinya"), tBU: D.atEnd(b, "banyak ukuran,"), tTer: D.at(b, "termasuk"), tKb: D.at(b, "kubus berisi"), tJt: D.at(b, "jutaan"), tEnd: D.speechEnd(b) }; }
  const CE = [{ n: 4, x: 330, y: 450, B: 190 }, { n: 6, x: 760, y: 450, B: 250 }, { n: 8, x: 1230, y: 440, B: 300 }], QE = { x: 1650, y: 450, B: 200 };
  S.b8_4 = function (ctx, b, l, t) {
    const T = T4(b); stage(ctx, t);
    const out1 = eio(ramp(l, T.tBH - 0.1, 0.8));                 // fase 1 pergi
    const gOut = ramp(l, T.tTer, 0.9);                            // laptop dan AI meredup saat kubus raksasa
    // ---- fase 1: kubus genap ----
    if (out1 < 1) { ctx.save(); ctx.globalAlpha *= 1 - out1;
      CE.forEach((c, i) => { const a = ramp(l, T.tUG + i * 0.2, 0.6), Pj = mkProj(c.n, c.x, c.y - out1 * 60, c.B / c.n * lerp(0.7, 1, eout(a)), swayYaw(t) + i * 0.01);
        ctx.save(); ctx.globalAlpha *= a; boxBack(ctx, Pj, 1, 1); dots(ctx, Pj, { rise: r => ramp(a, 0.2 + (r[2] / c.n) * 0.5, 0.3) }); boxFront(ctx, Pj, 1); ctx.restore(); });
      const qa = ramp(l, T.tTM, 0.6); qCube(ctx, mkProj(4, QE.x, QE.y, QE.B / 4, swayYaw(t) + 0.12 * Math.sin(t * 0.4)), qa, t);
      ctx.restore(); }
    // ---- fase 2: laptop Ho Boon Suan + tumpukan GPT ----
    const lin = eio(ramp(l, T.tBH - 0.1, 0.9)), lapX = lerp(-300, LAP.x, lin) - gOut * 60;
    const qFly = eio(ramp(l, T.tBH + 0.1, 1.0));                // kubus "?" masuk ke layar laptop
    const nEven = l < T.tUji ? 8 : 8 + 2 * Math.round(96 * eio(ramp(l, T.tUji + 0.1, T.tBU + 0.3 - T.tUji)));
    const codeIn = ramp(l, T.tMP + 1.15, 0.3);
    if (lin > 0.01) laptop(ctx, lapX, LAP.y, LAP.w, t, { alpha: 1 - gOut, lid: "#33306E", body: "#3F3A82", lit: 1, typing: win(l, T.tHo, T.tMin + 0.4, 0.3) + win(l, T.tUji, T.tBU, 0.3), screen: (c, sx, sy, sw, sh) => {
      if (l < T.tMP + 1.15) { lapQ(c, sx, sy, sw, sh, t, qFly); return; }
      if (l < T.tUji) { codeLines(c, sx + 40, sy + 26, sw - 70, 1, 88, 4); const ga = ramp(l, T.tBG, 0.3); if (ga > 0.01) { c.save(); c.globalAlpha *= ga;
        ["8", "10", "12"].forEach((s, i) => { const bx = sx + 40 + i * 100; c.fillStyle = "rgba(165,146,255,0.3)"; RR(c, bx, sy + sh - 78, 86, 62, 12); c.fill(); wtxt(c, s, bx + 43, sy + sh - 32, 44, { weight: 900, color: "#FFFFFF" }); });
        wtxt(c, "…", sx + 352, sy + sh - 32, 44, { weight: 900, color: "#FFFFFF" }); c.restore(); } return; }
      wtxt(c, "ukuran", sx + sw / 2 - 40, sy + 54, 44, { weight: 800, color: P.ink2 }); wtxt(c, String(nEven), sx + sw / 2 - 40, sy + 142, 84, { weight: 900, color: "#FFFFFF" });
      checkMark(c, sx + sw / 2 + 100, sy + 112, 28, 1, 1);
      const n = (nEven - 8) / 2; for (let q = 0; q < 48; q++) { c.fillStyle = q * 2 <= n ? P.green : "rgba(242,246,255,0.18)"; c.fillRect(sx + 18 + q * (sw - 36) / 48, sy + sh - 30, (sw - 36) / 48 - 2, 14); } } });
    // kubus "?" terbang dari kanan ke layar laptop
    if (qFly > 0 && qFly < 1) { const x = lerp(QE.x, LAP.x - 40, qFly), y = lerp(QE.y, LAP.y - 120, qFly) - Math.sin(qFly * Math.PI) * 100; qCube(ctx, mkProj(4, x, y, lerp(QE.B, 60, qFly) / 4, swayYaw(t)), 1 - qFly * 0.6, t); }
    const dA = ramp(l, T.tGPT - 0.15, 0.9), soalAb = ramp(l, T.tGPT + 0.3, 0.6);
    aiDeck(ctx, DECK.x + gOut * 220, DECK.y, DECK.s, dA, t, { style: "O", think: soalAb >= 1 && l < T.tMP, alpha: 1 - gOut, flash: win(l, T.tGPT + 0.75, T.tGPT + 1.3, 0.3) });
    // kartu soal: laptop → AI;  kartu program: AI → laptop
    { const f1 = eio(ramp(l, T.tMin, 1.0)), f2 = eio(soalAb); if (l > T.tMin - 0.05 && soalAb < 1) { let x = lerp(LAP.x, 1110, f1), y = lerp(470, 380, f1) - Math.sin(f1 * Math.PI) * 110; x = lerp(x, DECK.x, f2); y = lerp(y, DECK.y, f2);
        soalCard(ctx, x, y, lerp(lerp(0.7, 1.2, f1), 0.3, f2), ramp(l, T.tMin - 0.05, 0.2) * (1 - ramp(l, T.tGPT + 0.75, 0.15)), t, { col: AIO }); }
      const g = eio(ramp(l, T.tMP, 1.15)); if (l > T.tMP && l < T.tMP + 1.3) { const x = lerp(DECK.x, LAP.x, g), y = lerp(DECK.y - 40, 470, g) - Math.sin(g * Math.PI) * 140;
        soalCard(ctx, x, y, lerp(0.6, 1, Math.sin(g * Math.PI)) * lerp(1, 0.5, ramp(g, 0.8, 0.2)), ramp(l, T.tMP, 0.15) * (1 - ramp(l, T.tMP + 1.1, 0.15)), t, { code: true, label: "program", col: AIO }); } }
    // ---- fase 3: kubus raksasa 200 × 200 × 200 ----
    const gG = eio(ramp(l, T.tTer + 0.1, 1.3));
    if (gG > 0.01) { const B = lerp(40, 470, gG), cx = lerp(LAP.x, 960, gG), cy = lerp(LAP.y - 120, 480, gG), Pj = mkProj(200, cx, cy, B / 200, swayYaw(t) + 0.05 * Math.sin(t * 0.3));
      ctx.save(); ctx.globalAlpha *= clamp(gG * 3);
      D.glow(ctx, cx, cy, B * 1.3, "#7F96FF", 0.25 + 0.06 * Math.sin(t * 2));
      boxBack(ctx, Pj, 1, 0); boxFront(ctx, Pj, 1, { dense: 2, denseCol: "rgba(210,224,255,0.10)", fill: "rgba(150,175,255,0.10)", edgeW: 4 });
      [[0, 199.5], [1, -0.5], [2, 199.5]].forEach(([ax, v]) => faceGrid(ctx, Pj, ax, v, 20, 1.5, "rgba(225,235,255,0.32)"));
      // titik ruangan di permukaan (setiap 10 ruangan satu titik) yang berkelip pelan
      ctx.fillStyle = "#E4ECFF"; [[0, 199.5], [1, -0.5], [2, 199.5]].forEach(([ax, v], fi) => { for (let a = 5; a < 200; a += 10) for (let c2 = 5; c2 < 200; c2 += 10) {
        const C = [0, 0, 0]; C[ax] = v; C[(ax + 1) % 3] = a; C[(ax + 2) % 3] = c2; const p = Pj(C[0], C[1], C[2]), tw = 0.35 + 0.35 * Math.sin(t * 2.2 + a * 0.37 + c2 * 0.21 + fi);
        ctx.globalAlpha = clamp(gG * 3) * tw; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.2, B / 200 * 1.6), 0, TAU); ctx.fill(); } }); ctx.globalAlpha = clamp(gG * 3);
      // kilau menyapu permukaan (menegaskan "banyak sekali ruangan")
      const sw = (t * 0.35) % 1.4 - 0.2; ctx.save(); poly(ctx, faceQuad(Pj, 2, 199.5)); ctx.clip(); ctx.globalCompositeOperation = "screen"; const p = Pj(lerp(-0.5, 199.5, sw), 100, 199.5); D.glow(ctx, p.x, p.y, B * 0.5, "#B9C8FF", 0.25); ctx.restore();
      ctx.restore();
      // pembanding kecil 3 × 3 × 3 (bab 7)
      const ca = ramp(l, T.tEnd + 0.25, 0.5); if (ca > 0.01) { ctx.save(); ctx.globalAlpha *= ca; colorCube(ctx, 3, 250, 520, 110, 1, t, { lw: 3.5 }); ctx.restore(); } }
    // Bip
    { let o, x = 1835, y = 812, s = 104;
      if (l < T.tHB) o = { pose: "diam", t, mood: "happy", look: [-1, -0.2] };
      else if (l < T.tTM) o = { pose: "tunjuk", t, target: [CE[2].x + 120, CE[2].y - 120], mood: "happy" };
      else if (l < T.tBH) o = { pose: "diam", t, mood: "think", look: [-0.6, -0.9] };
      else if (l < T.tJt) o = { pose: "diam", t, mood: "happy", look: [-1, -0.1] };
      else if (l < T.tJt + 1.3) o = { pose: "kaget", t, k: l - T.tJt, mood: "wow", seru: false };
      else o = { pose: "tunjuk", t, target: [1150, 420], mood: "wow" };
      KB.draw(ctx, x, y, s, o); }
    D.post(cx => {
      const a1 = 1 - out1;
      if (a1 > 0.01) {
        const pG = pop(l, T.tGn); tag(cx, "ukuran genap", 960, 160, pG.a * a1, { sp: pG.sp, col: AIO, size: 52 });
        CE.forEach((c, i) => { const p = pop(l, T.tUG + 0.3 + i * 0.2); const w = tag(cx, `ukuran ${c.n}`, c.x, 770, p.a * a1, { sp: p.sp, col: P.ink2, size: 46 });
          const tc = [T.tBh, T.tBk + 0.2, T.tKc][i], pc = pop(l, tc); if (w) checkMark(cx, c.x + w / 2 + 30, 770, 22, pc.a * a1, pc.sp); });
        const pk = pop(l, T.tKc + 0.1); tag(cx, "Claude: hanya ukuran kecil", 760, 862, pk.a * a1 * (1 - ramp(l, T.tRu - 0.1, 0.2)), { sp: pk.sp, col: AIA, size: 46 });
        const pq = pop(l, T.tRu); if (pq.a > 0.01) { cx.save(); cx.globalAlpha *= pq.a * a1; const k = lerp(0.5, 1, pq.sp); cx.translate(QE.x, 300 + Math.sin(t * 2.2) * 6); cx.scale(k, k);
          D.glow(cx, 0, -45, 110, P.amber, 0.5); D.txt(cx, "?", 0, 10, 140, { align: "center", weight: 900, color: P.amber }); cx.restore(); }
        const pT = pop(l, T.tTM + 0.3); tag(cx, "10, 12, 14, …", QE.x - 30, 770, pT.a * a1, { sp: pT.sp, col: P.warm, size: 46 });
        const pr = pop(l, T.tRuE - 0.1); tag(cx, "rumus umum: belum ada", 760, 862, pr.a * a1, { sp: pr.sp, col: P.red, size: 48 });
      }
      const a2 = ramp(l, T.tBH, 0.4) * (1 - ramp(l, T.tTer, 0.4));
      if (a2 > 0.01) {
        const pH = pop(l, T.tBH); tag(cx, "beberapa hari kemudian", 960, 140, pH.a * a2 * (1 - ramp(l, T.tGPT - 0.2, 0.3)), { sp: pH.sp, col: P.warm, size: 46 });
        const pn = pop(l, T.tHo); ptag(cx, "Ho Boon Suan, Singapura", l < T.tSg ? "Ho Boon Suan" : "Ho Boon Suan, Singapura", LAP.x, 795, pn.a * a2, { sp: pn.sp, col: P.warm, size: 48 });
        const pg = pop(l, T.tGPT); ptag(cx, "GPT-5.3-codex (OpenAI)", l < T.tOAI ? "GPT-5.3-codex" : "GPT-5.3-codex (OpenAI)", DECK.x, 190, pg.a * a2, { sp: pg.sp, col: AIO, size: 48 });
        const p8 = pop(l, T.t8); tag(cx, "ukuran genap, mulai 8", LAP.x, 290, p8.a * a2 * (1 - ramp(l, T.tUji + 0.6, 0.3)), { sp: p8.sp, col: AIO, size: 46 });
        const pU = pop(l, T.tUji + 0.95); tag(cx, "diuji pada banyak ukuran", LAP.x, 290, pU.a * a2, { sp: pU.sp, col: P.green, size: 46 });
      }
      const a3 = ramp(l, T.tTer + 0.3, 0.4);
      if (a3 > 0.01) {
        const pK = pop(l, T.tKb); tag(cx, "200 × 200 × 200", 960, 150, pK.a * a3, { sp: pK.sp, col: P.warm, size: 56 });
        const pJ = pop(l, T.tJt); tag(cx, "= 8 juta ruangan", 960, 850, pJ.a * a3, { sp: pJ.sp, col: P.amber, size: 58 });
        const pc = pop(l, T.tEnd + 0.4); tag(cx, "27 ruangan", 250, 690, pc.a * a3, { sp: pc.sp, col: P.ink2, size: 44 });
      }
    });
  };

  // =====================================================================
  // b8_5: meja Knuth — 14 halaman bukti dari GPT-5.4 Pro, diperiksa dengan kaca pembesar
  function T5(b) { return { tTL: D.at(b, "Tidak lama"), tGL: D.at(b, "model GPT lain"), tMB: D.at(b, "menulis bukti"), t14: D.at(b, "empat belas"), tHal: D.at(b, "halaman"), tUG: D.at(b, "ukuran genap,"),
    tKn: D.at(b, "Knuth"), tMy: D.at(b, "menyebutnya"), tTC: D.at(b, "tampak tanpa cacat."), tEnd: D.speechEnd(b) }; }
  const PG = { x: 960, y: 800, w: 600, h: 250 };   // tumpukan halaman di meja (koordinat dunia)
  const DK5 = { x: 790, y: 330, s: 230 };
  function pageContent(ctx, x, y, w, h, hdrA, t) {
    ctx.save(); ctx.translate(x, y);
    if (hdrA > 0.01) { ctx.save(); ctx.globalAlpha *= hdrA; wtxt(ctx, "Bukti: ukuran genap", -w / 2 + 40, -h / 2 + 62, 46, { align: "left", weight: "italic 800", color: "#4A3CB0" }); ctx.restore(); }
    ctx.strokeStyle = "rgba(60,70,120,0.7)"; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let r = 0; r < 3; r++) { const yy = -h / 2 + 118 + r * 44, len = [0.8, 0.62, 0.72][r] * (w - 80); ctx.beginPath(); ctx.moveTo(-w / 2 + 40, yy);
      for (let q = 0; q <= 1.0001; q += 0.025) ctx.lineTo(-w / 2 + 40 + q * len, yy + Math.sin(q * 50 + r * 2) * 6); ctx.stroke();
      ctx.fillStyle = "#4A3CB0"; ctx.fillRect(-w / 2 + 40 + len + 20, yy - 10, 18, 4); ctx.fillRect(-w / 2 + 40 + len + 20, yy + 2, 18, 4); }
    ctx.restore();
  }
  function page(ctx, x, y, w, h, rot, hdrA, t, content = true) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = "rgba(30,12,8,0.18)"; ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
    ctx.fillStyle = "#FBF4E2"; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = "rgba(120,90,60,0.22)"; ctx.fillRect(-w / 2, h / 2 - 3, w, 3);
    ctx.strokeStyle = "rgba(90,130,200,0.22)"; ctx.lineWidth = 2; for (let r = 1; r < 6; r++) { const yy = -h / 2 + r * h / 6; ctx.beginPath(); ctx.moveTo(-w / 2 + 10, yy); ctx.lineTo(w / 2 - 10, yy); ctx.stroke(); }
    ctx.restore();
    if (content) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); pageContent(ctx, 0, 0, w, h, hdrA, t); ctx.restore(); }
  }
  S.b8_5 = function (ctx, b, l, t) {
    const T = T5(b);
    const c = drift(D.path([[0, 960, 575, 1.0], [b.dur, 960, 585, 1.04]], l), t);
    const t0 = T.tMB - 0.25, t1 = T.tHal + 0.15, nLand = i => t0 + (t1 - t0) * (i / 13) + 0.42;   // halaman i (0..13) mendarat
    const hdrA = ramp(l, T.tUG, 0.4);
    // jalur kaca pembesar: menyusuri 3 baris halaman atas
    const sweep = l < T.tKn ? -1 : ((l - T.tKn - 0.4) / 2.2);
    const lens = (() => { const hx0 = PG.x - PG.w / 2 + 90, hx1 = PG.x + PG.w / 2 - 70, row = clamp(Math.floor(Math.max(0, sweep)), 0, 2) + (sweep > 3 ? 0 : 0), f = sweep - Math.floor(sweep);
      const rr = sweep > 3 ? 1 + Math.sin(l * 0.8) : row, ff = sweep > 3 ? 0.5 + 0.4 * Math.sin(l * 0.9) : f; const yy = PG.y - PG.h / 2 + 118 + clamp(rr, 0, 2) * 44;
      return { x: lerp(hx0, hx1, eio(ff)), y: yy }; })();
    const rest = eio(ramp(l, T.tTC + 0.5, 1.1)), handIn = eio(ramp(l, T.tKn - 0.4, 0.8));
    const lx = lerp(lerp(1900, lens.x, handIn), 2100, rest), ly = lerp(lerp(1000, lens.y, handIn), 1150, rest);
    ctx.save(); camT(ctx, c);
    world(ctx, t, { glassGlow: win(l, T.tKn - 0.1, b.dur + 1, 0.4) * 0.8, pen: PEN_REST,
      onWall: cx => aiDeck(cx, DK5.x, DK5.y, DK5.s, ramp(l, T.tGL - 0.1, 0.8), t, { style: "O", think: l > T.tGL + 0.5 && l < t0, flash: win(l, t0, t1, 0.3) }),
      onDesk: cx => {
        for (let i = 0; i < 14; i++) { const ld = nLand(i); if (l < ld) continue; const x = PG.x + i * 1.6 - 10, y = PG.y - i * 4.5, top = i === 13;
          page(cx, x, y, PG.w, PG.h, Math.sin(i * 1.7) * 0.012, top ? hdrA : 0, t, top || l < nLand(i + 1)); }
        // kaca pembesar dipegang tangan tanpa ciri
        if (handIn > 0.01) { KB.kacaPembesar(cx, lx, ly, 150, { t, angle: 0.75, content: (q, wx, wy, r) => { q.save(); q.translate(wx, wy); q.scale(1.6, 1.6); q.translate(-wx, -wy);
            const tx = PG.x + 13 * 1.6 - 10, ty = PG.y - 13 * 4.5; page(q, tx, ty, PG.w, PG.h, Math.sin(13 * 1.7) * 0.012, 0, t); q.restore(); } });
          hand(cx, lx + Math.cos(0.75) * 160, ly + Math.sin(0.75) * 160, 0.75, { s: 0.95, sleeve: "#7A5A9E", cuff: "#634884" }); }
      },
      bip: cx => { let o; if (l < T.tGL) o = { pose: "diam", t, mood: "happy", look: [-1, -0.6] }; else if (l < T.tKn) o = { pose: "tunjuk", t, target: [PG.x + 200, PG.y - 60], mood: "wow" };
        else if (l < T.tTC) o = { pose: "diam", t, mood: "think", look: [-1, 0.3] }; else o = { pose: "diam", t, mood: "happy", look: [-0.9, 0.2], wave: 1 };
        KB.draw(cx, 1590, 800, 120, o); },
    });
    // halaman yang sedang terbang dari AI ke meja
    for (let i = 0; i < 14; i++) { const ld = nLand(i), st = ld - 0.42; if (l < st || l >= ld) continue; const u = eio((l - st) / 0.42);
      const x = lerp(DK5.x, PG.x + i * 1.6 - 10, u), y = lerp(DK5.y, PG.y - i * 4.5, u) - Math.sin(u * Math.PI) * 120, sc = lerp(0.35, 1, u);
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc * lerp(1.6, 1, u)); page(ctx, 0, 0, PG.w, PG.h, (1 - u) * 0.4, 0, t, false); ctx.restore(); }
    dust(ctx, t, 0.7);
    ctx.restore();
    let nPg = 0; for (let i = 0; i < 14; i++) if (l >= nLand(i)) nPg = i + 1;
    D.post(cx => {
      const [gx, gy] = toS(c, DK5.x, DK5.y - 205); const pG = pop(l, T.tGL); ptag(cx, "GPT-5.4 Pro (OpenAI)", "GPT-5.4 Pro (OpenAI)", Math.max(gx, 380), Math.max(gy, 110), pG.a, { sp: pG.sp, col: AIO, size: 48 });
      const ca = ramp(l, t0 + 0.3, 0.3); if (ca > 0.01) { const [sx, sy] = toS(c, PG.x - PG.w / 2 - 190, PG.y - 150); tag(cx, nPg >= 14 && l >= T.tHal ? "14 halaman" : `halaman ${Math.max(1, nPg)}`, sx, sy, ca, { col: AIO, size: 50 }); }
      const pK = pop(l, T.tKn); { const [kx, ky] = toS(c, PG.x, PG.y - 225); tag(cx, "diperiksa Knuth", kx, ky, pK.a, { sp: pK.sp, col: P.warm, size: 48 }); }
      const pT = pop(l, T.tTC); if (pT.a > 0.01) { const [sx, sy] = toS(c, PG.x + 60, PG.y + 50); cx.save(); cx.globalAlpha *= pT.a; cx.translate(sx, sy); cx.rotate(-0.07); const k = lerp(1.4, 1, eout(clamp((l - T.tTC) / 0.3))); cx.scale(k, k);
        cx.font = `900 50px ${FONT}`; const w = cx.measureText("tampak tanpa cacat").width + 120; cx.fillStyle = "rgba(255,255,255,0.93)"; RR(cx, -w / 2, -44, w, 88, 16); cx.fill(); cx.strokeStyle = P.green; cx.lineWidth = 6; cx.stroke();
        checkMark(cx, -w / 2 + 46, 0, 24, 1, 1); D.txt(cx, "tampak tanpa cacat", 24, 18, 50, { align: "center", weight: 900, color: "#1F8A4C" }); cx.restore(); }
    });
  };

  // =====================================================================
  // b8_6: 2023 → 2026, timbangan pendapat, "Hats off to Claude!"
  function T6(b) { return { tTT: D.at(b, "Tiga tahun"), tSb: D.at(b, "sebelumnya,"), tKn: D.at(b, "Knuth"), tMh: D.at(b, "mahasiswanya"), tCG: D.at(b, "menguji ChatGPT."), tCGe: D.atEnd(b, "menguji ChatGPT."),
    tHr: D.at(b, "Ia heran"), tJw: D.at(b, "jawaban"), tKr: D.at(b, "karangan"), tKrE: D.atEnd(b, "karangan"), tTd: D.at(b, "terdengar"), tMy: D.at(b, "meyakinkan,"), tMyE: D.atEnd(b, "meyakinkan,"),
    tMs: D.at(b, "menyerahkan"), tPn: D.at(b, "penelitian AI"), tOL: D.atEnd(b, "orang lain."), tKini: D.at(b, "Kini"), tSp: D.at(b, "sepertinya"), tMr: D.at(b, "merevisi"), tGen: D.atEnd(b, "AI generatif."),
    tIJ: D.at(b, "Ia juga menulis"), tHat: D.at(b, "\"Hats off"), tHatE: D.atEnd(b, "Claude!\","), tAT: D.at(b, "angkat topi"), tEnd: D.speechEnd(b) }; }
  const CL = { x: 110, y: 120, w: 820, h: 480 }, CR = { x: 990, y: 120, w: 820, h: 480 }, BAL = { x: 960, y: 650 };
  function noteCard(ctx, R, a, yr, col) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; const k = lerp(0.92, 1, eout(a)); ctx.translate(R.x + R.w / 2, R.y + R.h / 2); ctx.scale(k, k); ctx.translate(-R.x - R.w / 2, -R.y - R.h / 2);
    ctx.fillStyle = "rgba(10,14,40,0.4)"; RR(ctx, R.x + 10, R.y + 14, R.w, R.h, 22); ctx.fill();
    ctx.fillStyle = "#FBF4E2"; RR(ctx, R.x, R.y, R.w, R.h, 22); ctx.fill(); ctx.strokeStyle = D.hexA(col, 0.9); ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = "rgba(90,130,200,0.2)"; ctx.lineWidth = 2; for (let r = 0; r < 6; r++) { const yy = R.y + 150 + r * 62; if (yy > R.y + R.h - 30) break; ctx.beginPath(); ctx.moveTo(R.x + 24, yy + 14); ctx.lineTo(R.x + R.w - 24, yy + 14); ctx.stroke(); }
    ctx.fillStyle = col; RR(ctx, R.x + 30, R.y + 26, 190, 76, 38); ctx.fill();
    wtxt(ctx, yr, R.x + 125, R.y + 84, 58, { weight: 900, color: "#10142E" });
    ctx.restore();
  }
  function balance(ctx, t, ang, wl, wr) {
    const { x, y } = BAL, L = 190;
    ctx.save();
    shadowE(ctx, x, y + 232, 130, 18, 0.35);
    ctx.fillStyle = "#8A5A3C"; RR(ctx, x - 110, y + 206, 220, 26, 12); ctx.fill(); ctx.fillStyle = "#A8714C"; ctx.fillRect(x - 100, y + 206, 200, 5);
    ctx.fillStyle = "#C9A15C"; RR(ctx, x - 10, y - 10, 20, 220, 8); ctx.fill();
    const ends = [-1, 1].map(s => [x + Math.cos(ang) * L * s, y + Math.sin(ang) * L * s]);
    ctx.strokeStyle = "#E3BE72"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(...ends[0]); ctx.lineTo(...ends[1]); ctx.stroke();
    ctx.fillStyle = "#FFD38A"; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fill();
    [wl, wr].forEach((wt, i) => { const [ex, ey] = ends[i], sw = Math.sin(t * 1.3 + i) * 0.02, px = ex + sw * 90, py = ey + 96;
      ctx.strokeStyle = "rgba(242,230,200,0.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(px - 70, py); ctx.moveTo(ex, ey); ctx.lineTo(px + 70, py); ctx.stroke();
      ctx.fillStyle = "#C9A15C"; ctx.beginPath(); ctx.ellipse(px, py, 86, 16, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = "#E3BE72"; ctx.beginPath(); ctx.ellipse(px, py, 86, 10, 0, 0, TAU); ctx.fill();
      if (wt && wt.a > 0.01) { const dy = -(1 - eout(wt.drop)) * 260, bw = wt.w || 170; ctx.save(); ctx.globalAlpha *= clamp(wt.a); ctx.translate(px, py - 36 + dy);
        ctx.fillStyle = "rgba(10,14,40,0.3)"; RR(ctx, -bw / 2 + 5, -30, bw, 64, 14); ctx.fill(); ctx.fillStyle = wt.col; RR(ctx, -bw / 2, -34, bw, 64, 14); ctx.fill();
        wtxt(ctx, wt.s, 0, 12, 44, { weight: 900, color: "#FFFFFF" }); ctx.restore(); } });
    ctx.restore();
  }
  function chat(ctx, l, T, t, dimA) {   // ilustrasi tanya-jawab generik (bukan tampilan aplikasi sungguhan)
    const x0 = 150, y0 = 640; ctx.save(); ctx.globalAlpha *= dimA;
    const qa = ramp(l, T.tCG, 0.4); if (qa > 0.01) { ctx.save(); ctx.globalAlpha *= qa; ctx.translate(0, (1 - eout(qa)) * 20);
      ctx.fillStyle = "#5AA9FF"; RR(ctx, x0 + 230, y0, 240, 74, 26); ctx.fill(); ctx.beginPath(); ctx.moveTo(x0 + 450, y0 + 60); ctx.lineTo(x0 + 486, y0 + 84); ctx.lineTo(x0 + 420, y0 + 72); ctx.fill();
      wtxt(ctx, "?", x0 + 290, y0 + 54, 52, { weight: 900, color: "#FFFFFF" }); ctx.fillStyle = "rgba(255,255,255,0.8)"; RR(ctx, x0 + 322, y0 + 30, 120, 14, 7); ctx.fill(); ctx.restore(); }
    const aa = ramp(l, T.tJw, 0.4); if (aa > 0.01) { ctx.save(); ctx.globalAlpha *= aa; const yy = y0 + 104 + (1 - eout(aa)) * 20;
      ctx.fillStyle = "#EEF3FF"; RR(ctx, x0, yy, 420, 150, 26); ctx.fill(); ctx.beginPath(); ctx.moveTo(x0 + 20, yy + 130); ctx.lineTo(x0 - 16, yy + 160); ctx.lineTo(x0 + 56, yy + 142); ctx.fill();
      const nl = clamp((l - T.tJw) / 1.6) * 4; for (let r = 0; r < 4; r++) { const f = clamp(nl - r); if (f <= 0) continue; ctx.fillStyle = "rgba(43,47,94,0.55)"; RR(ctx, x0 + 30, yy + 26 + r * 30, [340, 300, 360, 220][r] * f, 14, 7); ctx.fill(); }
      const ma = ramp(l, T.tMy, 0.3); if (ma > 0.01) for (let s = 0; s < 4; s++) { const an = s * 1.6 + t * 0.6, rr = 1 + 0.25 * Math.sin(t * 3 + s); sparkle(ctx, x0 + 210 + Math.cos(an) * 250, yy + 75 + Math.sin(an) * 110, 18 * rr, ma); }
      const ka = ramp(l, T.tKr, 0.2); if (ka > 0.01) { const k = lerp(1.5, 1, eout(clamp((l - T.tKr) / 0.25))); ctx.save(); ctx.globalAlpha *= ka; ctx.translate(x0 + 230, yy + 80); ctx.rotate(-0.12); ctx.scale(k, k);
        ctx.font = `900 52px ${FONT}`; const w = ctx.measureText("karangan").width + 60; ctx.strokeStyle = "#E25A54"; ctx.lineWidth = 7; RR(ctx, -w / 2, -42, w, 84, 14); ctx.stroke();
        ctx.fillStyle = "rgba(255,240,236,0.85)"; RR(ctx, -w / 2, -42, w, 84, 14); ctx.fill(); ctx.stroke(); wtxt(ctx, "karangan", 0, 18, 52, { weight: 900, color: "#D2423C" }); ctx.restore(); }
      ctx.restore(); }
    ctx.restore();
  }
  S.b8_6 = function (ctx, b, l, t) {
    const T = T6(b); stage(ctx, t, { haloAt: [960, 470] });
    const aL = ramp(l, 0.05, 0.5), aR = ramp(l, T.tKini - 0.1, 0.5);
    const yr = l < T.tTT ? "2026" : String(2026 - Math.min(3, Math.floor(ramp(l, T.tTT, T.tSb + 0.4 - T.tTT) * 3 + 1e-6)));
    noteCard(ctx, CL, aL, yr, P.warm); noteCard(ctx, CR, aR, "2026", AIA);
    // timbangan: kiri turun (ragu) → bergeser pelan ke kanan (terbuka), tidak jatuh
    const dL = ramp(l, T.tHr, 0.45), dR = ramp(l, T.tMr, 0.45);
    let ang = -0.2 * eio(ramp(l, T.tHr + 0.4, 0.9)); ang = lerp(ang, 0.1, eio(ramp(l, T.tMr + 0.4, 3.2))); ang += 0.012 * Math.sin(t * 1.1);
    balance(ctx, t, ang, { s: "ragu", a: ramp(l, T.tHr, 0.15), drop: dL, col: "#5B6488", w: 150 }, { s: "terbuka", a: ramp(l, T.tMr, 0.15), drop: dR, col: "#1E9C8F", w: 200 });
    chat(ctx, l, T, t, 1 - 0.5 * ramp(l, T.tKini, 0.6));
    // Bip bertopi; topi diangkat saat "angkat topi"
    { const bx = 1560, by = 805, s = 150; let o;
      if (l < T.tHr) o = { pose: "diam", t, mood: "think", look: [-1, -0.6] }; else if (l < T.tHr + 1.2) o = { pose: "kaget", t, k: l - T.tHr, mood: "wow", seru: false };
      else if (l < T.tKini) o = { pose: "diam", t, mood: "think", look: [-1, -0.4] }; else if (l < T.tHat) o = { pose: "diam", t, mood: "happy", look: [-0.4, -0.9] };
      else if (l < T.tAT) o = { pose: "diam", t, mood: "wow", look: [-0.3, -0.9] }; else o = { pose: "diam", t, mood: "happy", look: [0, -0.3] };
      const r = KB.draw(ctx, bx, by, s, o), lift = eout(ramp(l, T.tAT, 0.5)) * (1 - 0.15 * Math.sin(clamp((l - T.tAT - 0.5) / 1.2) * Math.PI)), hy = by - s * 0.42 - lift * 50;
      topHat(ctx, bx + lift * 30 + (o.pose === "kaget" ? 0 : 0), hy + (o.pose === "kaget" ? -Math.max(0, Math.sin(clamp((l - T.tHr) / 1.2) * Math.PI)) * 40 : 0), s * 0.62, -0.08 - lift * 0.35); void r; }
    (cx => {
      const tx = CL.x + 44, R2x = CR.x + 44;
      const rows = [["Mahasiswa menguji ChatGPT.", T.tMh, T.tCGe + 0.1], ["Jawaban yang hanya karangan", T.tJw, T.tKrE + 0.1], ["terdengar sangat meyakinkan.", T.tTd, T.tMyE + 0.1],
        ["Penelitian AI semacam itu", T.tPn, T.tPn + 1.3], ["diserahkan ke orang lain.", T.tPn + 1.4, T.tOL + 0.1]];
      cx.save(); cx.globalAlpha *= aL; rows.forEach(([s, a, z], i) => { const sh = typed(s, l, a, z); if (sh) D.txt(cx, sh, tx, CL.y + 170 + i * 62, 44, { weight: 800, color: INK }); }); cx.restore();
      if (aR > 0.01) { cx.save(); cx.globalAlpha *= aR;
        [["Sepertinya ia harus", T.tSp, T.tMr], ["merevisi pendapatnya", T.tMr, T.tMr + 1.1], ["tentang AI generatif.", T.tMr + 1.1, T.tGen + 0.1]].forEach(([s0, a0, z0], i) => {
          const r = typed(s0, l, a0, z0); if (r) D.txt(cx, r, R2x, CR.y + 170 + i * 62, 44, { weight: 800, color: INK }); });
        const q = typed("“Hats off to Claude!”", l, T.tHat, T.tHatE + 0.1); if (q) D.txt(cx, q, R2x, CR.y + 384, 58, { weight: "italic 900", color: "#B23A36" });
        const tr = typed("angkat topi untuk Claude", l, T.tAT, T.tAT + 1.0); if (tr) D.txt(cx, tr, R2x, CR.y + 452, 44, { weight: 800, color: "#167A70" });
        cx.restore(); }
    })(ctx);
  };

  // =====================================================================
  // b8_7: catatan dilipat, diletakkan di tumpukan naskah; kalimat penutup diketik
  function T7(b) { return { tKn: D.at(b, "Knuth"), tMc: D.at(b, "menutup catatannya"), tKal: D.at(b, "kalimat"), tWe: D.at(b, "\"We"), tInd: D.atEnd(b, "indeed\","), tArt: D.at(b, "artinya"),
    tKita: D.at(b, "kita sungguh"), tMen: D.atEnd(b, "menarik."), tEnd: D.speechEnd(b) }; }
  // waktu kata ke-i mulai dari potongan s (token berurutan)
  function tokTimes(b, s, n) { const i = b.text.indexOf(s); if (i < 0 || !b.words) return null; const toks = b.text.split(/\s+/); let pos = 0, k0 = 0;
    for (let k = 0; k < toks.length; k++) { const j = b.text.indexOf(toks[k], pos); if (j + toks[k].length > i) { k0 = k; break; } pos = j + toks[k].length; }
    return Array.from({ length: n }, (_, q) => (b.words[k0 + q] || b.words[b.words.length - 1])[1]); }
  function typeWords(words, times, l) { let n = 0; times.forEach((tt, i) => { if (l >= tt) n = i + 1; }); return words.slice(0, n).join(" "); }
  function cycNote(ctx, w, h, t) {   // isi catatan: judul + kubus kecil tiga warna (data asli) + coretan
    wtxt(ctx, "Claude’s Cycles", -w / 2 + 100, -h / 2 + 70, 48, { align: "left", weight: "italic 800", color: INK });
    colorCube(ctx, 3, -w / 2 + 190, 40, 120, 1, t, { lw: 3.5 });
    ctx.strokeStyle = "rgba(60,70,120,0.6)"; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let r = 0; r < 4; r++) { const yy = -h / 2 + 130 + r * 42, x0 = -w / 2 + 330, len = [300, 260, 320, 180][r]; ctx.beginPath(); ctx.moveTo(x0, yy); for (let q = 0; q <= 1.0001; q += 0.025) ctx.lineTo(x0 + q * len, yy + Math.sin(q * 48 + r * 2) * 6); ctx.stroke(); }
  }
  S.b8_7 = function (ctx, b, l, t) {
    const T = T7(b);
    const c = drift(D.path([[0, 960, 600, 1.0], [b.dur, 950, 590, 1.035]], l), t);
    const f1 = eio(ramp(l, T.tMc, 0.7)), f2 = eio(ramp(l, T.tMc + 0.75, 0.6)), mv = eio(ramp(l, T.tMc + 1.45, 1.0)), land = ramp(l, T.tMc + 2.45, 0.35);
    const nx = lerp(PAP.x, STK.x + 80, mv), ny = lerp(PAP.y, STK.y - 72, mv) - Math.sin(mv * Math.PI) * 170 + Math.sin(land * Math.PI) * -6;
    ctx.save(); camT(ctx, c);
    world(ctx, t, { glassGlow: win(l, T.tKn - 0.1, T.tKn + 1.6, 0.4) + 0.4 * ramp(l, T.tEnd, 1.0),
      onDesk: cx => {
        const { w, h } = PAP, sc = lerp(1, 0.8, mv), BK = "#EDE3CC", BK2 = "#F4EBD6";
        const front = () => { cx.fillStyle = "#FBF4E2"; cx.fillRect(-w / 2, -h / 2, w, h); cx.strokeStyle = "rgba(90,130,200,0.28)"; cx.lineWidth = 2;
          for (let r = 1; r < 7; r++) { const yy = -h / 2 + r * h / 7; cx.beginPath(); cx.moveTo(-w / 2 + 10, yy); cx.lineTo(w / 2 - 10, yy); cx.stroke(); } cycNote(cx, w, h, t); };
        cx.save(); cx.translate(nx, ny); cx.rotate(lerp(-0.012, 0.05, mv)); cx.scale(sc, sc); cx.translate(-w / 4 * f2, -h / 4 * f1);
        shadowE(cx, lerp(0, w / 4, f2) + 14, lerp(0, h / 4, f1) + 16, lerp(w, w / 2, f2) * 0.55, lerp(h, h / 2, f1) * 0.5, 0.25 + 0.1 * mv);
        if (f1 < 0.001) front();
        else {
          // separuh bawah tetap di meja; separuh atas berputar turun di garis lipat
          if (f1 < 0.999) { cx.save(); cx.beginPath(); cx.rect(-w / 2, 0, w, h / 2); cx.clip(); front(); cx.restore(); }
          else { cx.fillStyle = "#DED2B6"; cx.fillRect((f2 > 0.999 ? 0 : -w / 2) + 4, 6, f2 > 0.999 ? w / 2 : w, h / 2); }
          const k = Math.cos(f1 * Math.PI);
          if (f1 < 0.999) {
            if (k > 0) { cx.save(); cx.scale(1, k); cx.beginPath(); cx.rect(-w / 2, -h / 2, w, h / 2); cx.clip(); front(); cx.fillStyle = `rgba(120,90,60,${0.3 * (1 - k)})`; cx.fillRect(-w / 2, -h / 2, w, h / 2); cx.restore(); }
            else { cx.fillStyle = BK; cx.fillRect(-w / 2, 0, w, h / 2 * -k); cx.fillStyle = `rgba(120,90,60,${0.2 * (1 + k)})`; cx.fillRect(-w / 2, 0, w, h / 2 * -k); }
          } else {
            // punggung kertas; lalu separuh kiri dilipat ke kanan
            const k2 = Math.cos(f2 * Math.PI);
            cx.fillStyle = BK; cx.fillRect(0, 0, w / 2, h / 2);
            if (f2 < 0.001) cx.fillRect(-w / 2, 0, w / 2, h / 2);
            else if (f2 < 0.999) { if (k2 > 0) { cx.fillStyle = BK; cx.fillRect(-w / 2 * k2, 0, w / 2 * k2, h / 2); cx.fillStyle = `rgba(120,90,60,${0.25 * (1 - k2)})`; cx.fillRect(-w / 2 * k2, 0, w / 2 * k2, h / 2); }
              else { cx.fillStyle = BK2; cx.fillRect(0, 0, w / 2 * -k2, h / 2); } }
            else { cx.fillStyle = BK2; cx.fillRect(0, 0, w / 2, h / 2); }
            cx.strokeStyle = "rgba(150,120,80,0.55)"; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(f2 > 0.5 ? 0 : -w / 2, 2); cx.lineTo(w / 2, 2); cx.stroke();
            if (f2 > 0.6) { cx.save(); cx.globalAlpha *= ramp(f2, 0.6, 0.4); wtxt(cx, "catatan", w / 4, h / 4 + 20, 58, { weight: "italic 800", color: INK }); cx.restore(); }
          }
        }
        cx.restore();
      },
      bip: cx => { let o; if (l < T.tMc) o = { pose: "diam", t, mood: "happy", look: [-0.9, 0.4] }; else if (l < T.tWe) o = { pose: "diam", t, mood: "happy", look: [-1, 0.6] };
        else if (l < T.tEnd) o = { pose: "diam", t, mood: "happy", look: [-0.6, -0.4] }; else o = { pose: "diam", t, mood: "happy", look: [-0.9, -0.8], wave: 0.6 };
        KB.draw(cx, 1385, 765, 125, o); },
    });
    dust(ctx, t, 0.85);
    ctx.restore();
    (cx => {
      const pa = ramp(l, T.tWe - 0.35, 0.45); if (pa <= 0.01) return;
      const X = 440, Y = 600, Wd = 900, Hd = 300; cx.save(); cx.globalAlpha *= pa; cx.translate(0, (1 - eout(pa)) * 24);
      cx.fillStyle = "rgba(10,14,40,0.35)"; RR(cx, X + 10, Y + 14, Wd, Hd, 22); cx.fill(); cx.fillStyle = "rgba(251,244,226,0.97)"; RR(cx, X, Y, Wd, Hd, 22); cx.fill(); cx.strokeStyle = D.hexA(P.amber, 0.9); cx.lineWidth = 4; cx.stroke();
      const en = ["“We", "are", "living", "in", "very", "interesting", "times", "indeed.”"], et = tokTimes(b, "\"We", 8) || en.map((_, i) => T.tWe + i * 0.4);
      const id = ["Kita", "sungguh", "hidup", "di", "masa", "yang", "sangat", "menarik."], it = tokTimes(b, "kita sungguh", 8) || id.map((_, i) => T.tKita + i * 0.3);
      const s1 = typeWords(en.slice(0, 5), et.slice(0, 5), l), s2 = typeWords(en.slice(5), et.slice(5), l);
      if (s1) D.txt(cx, s1, X + 46, Y + 84, 58, { weight: "italic 800", color: INK }); if (s2) D.txt(cx, s2, X + 46, Y + 154, 58, { weight: "italic 800", color: INK });
      const s3 = typeWords(id, it, l); if (s3) { const ws = s3.split(" "); const a3 = ws.slice(0, 5).join(" "), b3 = ws.slice(5).join(" ");
        D.txt(cx, a3, X + 46, Y + 224, 44, { weight: 800, color: "#167A70" }); if (b3) D.txt(cx, b3, X + 46, Y + 278, 44, { weight: 800, color: "#167A70" }); }
      cx.restore();
    })(ctx);
  };

  K.SCENES.d04_b8 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d04_b8.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b8 = TL => {
    const b2 = TL.beats.find(x => x.id === "b8_2"), A = b2 ? attempts(b2) : null;
    return [
      K.sfxAt(TL, "b8_1", "memberikan soal", 0.1, "whoosh", 0.45),
      K.sfxAt(TL, "b8_1", "Claude", 0.0, "shimmer", 0.6),
      K.sfxAt(TL, "b8_1", "Anthropic", 0.0, "pop", 0.4),
      K.sfxAt(TL, "b8_1", "tiga minggu", 0.0, "clack", 0.4),
      A && K.sfxAt(TL, "b8_2", null, A[1] + 0.5 * (A[2] - A[1]), "clack", 0.45),
      A && K.sfxAt(TL, "b8_2", null, A[2] + 0.5 * (A[3] - A[2]), "clack", 0.45),
      K.sfxAt(TL, "b8_2", "sementara", 0.1, "whoosh", 0.4),
      K.sfxAt(TL, "b8_2", "mendampingi", 0.0, "pop", 0.5),
      K.sfxAt(TL, "b8_2", "kemajuan.", 0.0, "shimmer", 0.45),
      K.sfxAt(TL, "b8_3", "puluh satu,", 0.05, "pop", 0.6),
      K.sfxAt(TL, "b8_3", "jam", 0.3, "clack", 0.4),
      K.sfxAt(TL, "b8_3", "berhasil", 0.0, "shimmer", 0.7),
      K.sfxAt(TL, "b8_3", "kubus berukuran", -0.1, "whoosh", 0.45),
      K.sfxAt(TL, "b8_3", "ganjil.", 0.0, "pop", 0.5),
      K.sfxAt(TL, "b8_3", "seratus satu,", 0.45, "pop", 0.55),
      K.sfxAt(TL, "b8_3", "lalu Knuth", -0.35, "whoosh", 0.45),
      K.sfxAt(TL, "b8_3", "Bukti itu", 0.1, "whoosh", 0.4),
      K.sfxAt(TL, "b8_3", "Kim", 0.0, "clack", 0.35),
      K.sfxAt(TL, "b8_3", "Lean.", 0.6, "shimmer", 0.7),
      K.sfxAt(TL, "b8_4", "genap,", 0.0, "pop", 0.5),
      K.sfxAt(TL, "b8_4", "kecil", 0.0, "pop", 0.4),
      K.sfxAt(TL, "b8_4", "rumus umumnya.", 0.0, "boom", 0.4),
      K.sfxAt(TL, "b8_4", "Beberapa hari", 0.0, "whoosh", 0.45),
      K.sfxAt(TL, "b8_4", "meminta", 0.0, "whoosh", 0.4),
      K.sfxAt(TL, "b8_4", "GPT", 0.0, "shimmer", 0.55),
      K.sfxAt(TL, "b8_4", "menulis program", 0.0, "whoosh", 0.4),
      K.sfxAt(TL, "b8_4", "delapan.", 0.0, "pop", 0.5),
      K.sfxAt(TL, "b8_4", "Ia mengujinya", 0.1, "riser", 0.4),
      K.sfxAt(TL, "b8_4", "jutaan", 0.0, "boom", 0.6),
      K.sfxAt(TL, "b8_5", "model GPT lain", 0.0, "shimmer", 0.5),
      K.sfxAt(TL, "b8_5", "menulis bukti", 0.0, "whoosh", 0.4),
      K.sfxAt(TL, "b8_5", "halaman", 0.15, "pop", 0.5),
      K.sfxAt(TL, "b8_5", "Knuth", -0.3, "whoosh", 0.35),
      K.sfxAt(TL, "b8_5", "tampak tanpa cacat.", 0.0, "clack", 0.5),
      K.sfxAt(TL, "b8_6", "Tiga tahun", 0.0, "whoosh", 0.4),
      K.sfxAt(TL, "b8_6", "Ia heran", 0.4, "clack", 0.5),
      K.sfxAt(TL, "b8_6", "karangan", 0.0, "pop", 0.45),
      K.sfxAt(TL, "b8_6", "Kini", 0.0, "whoosh", 0.4),
      K.sfxAt(TL, "b8_6", "merevisi", 0.4, "clack", 0.45),
      K.sfxAt(TL, "b8_6", "\"Hats off", 0.0, "shimmer", 0.55),
      K.sfxAt(TL, "b8_6", "angkat topi", 0.0, "pop", 0.5),
      K.sfxAt(TL, "b8_7", "menutup catatannya", 1.45, "whoosh", 0.35),
      K.sfxAt(TL, "b8_7", "menutup catatannya", 2.45, "clack", 0.35),
      K.sfxAt(TL, "b8_7", "menarik.", 0.4, "shimmer", 0.45),
    ].filter(Boolean);
  };
})(typeof window !== "undefined" ? window : globalThis);
