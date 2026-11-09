/* D04 bab 5 — "Buku yang tak kunjung selesai" (b5_1, b5_2).
   Dunia meja kerja malam yang sama dengan bab 0 (dinding biru bergaris, jendela malam, lampu meja berlengan, meja kayu,
   tumpukan naskah, kacamata, rak berisi jilid 1, 2, 3 dan tempat kosong bergaris putus-putus). Knuth tidak digambar.
   b5_1 rak: jilid 3 menyala → selembar cetakan baru meluncur ke meja lalu berdiri; rumus (metode kongruensial linear,
        bagian 3.2.1 jilid 2) tercetak jelek: huruf berpiksel, miring, naik-turun, beda jenis huruf; Bip memeriksa dengan
        kaca pembesar lalu meringis → tumpukan naskah diberi tanda "jeda" → terminal tua muncul, Bip mengetik, huruf A
        dirancang dari titik-titik kendali, lalu "TeX" → kalender sobek: "1 tahun" (rencana) lalu disobek terus sampai
        "10 tahun" (kenyataan); setiap sobekan merapikan huruf di halaman; nomor versi 3.14 → 3.141592653 bergulir di
        pojok layar terminal tanpa dibacakan.
   b5_2 rak dinding yang sama memanjang menjadi lini waktu 1962–2026: jilid 1–3 (1968, 1969, 1973), bendera "target: 2003"
        dengan bayangan jilid 4; penanda waktu berjalan dan mengisi celah (TeX, edisi baru jilid 1–3 1997–1998,
        fasikel 2005–2009), bendera dicoret saat 2003 lewat tanpa buku; 4A jatuh di 2011, 4B di 2022, fasikel 7 (awal 4C)
        di 2025, garis "kini"; tempat kosong 4C, 4D, 5, 6, 7 "masih dikerjakan".
   Kamera sendiri (noCam). Teks benda di dunia memudar bila keluar dari zona aman; label dibuat lewat D.post. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KB = KIT.bipkit, P = D.P, LP = KL.parts;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const SERIF = `"Liberation Serif", "DejaVu Serif", "FreeSerif", serif`;
  const S = {};

  // ---------- pembantu ----------
  const ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  const camT = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); };
  const toS = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + HH / 2];
  const drift = (c, t) => ({ x: c.x + Math.sin(t * 0.29) * 5 / c.z, y: c.y + Math.sin(t * 0.21 + 1) * 4 / c.z, z: c.z * (1 + 0.003 * Math.sin(t * 0.17)) });
  const mk = (w, h) => Object.assign(document.createElement("canvas"), { width: w, height: h });
  function grade(ctx, a, col = "#3B4690") { if (a <= 0.01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, HH); ctx.restore(); }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  // faktor tampak teks dunia: 1 di dalam zona aman layar, memudar ke 0 di tepinya (supaya teks benda tidak tercatat di luar layar)
  function safeA(ctx, x, y, w, size) {
    const m = ctx.getTransform(), X0 = m.a * x + m.e, X1 = m.a * (x + w) + m.e, Y = m.d * y + m.f, Yt = m.d * (y - size * 0.8) + m.f;
    return clamp((Yt - 66) / 30) * clamp((925 - Y) / 30) * clamp((X0 - 100) / 40) * clamp((1820 - X1) / 40);
  }
  // teks dunia dengan perataan tengah + pemudaran tepi
  function wtxt(ctx, s, x, y, size, opt = {}) {
    ctx.save(); ctx.font = `${opt.weight || 800} ${size}px ${opt.font || FONT}`; const w = ctx.measureText(s).width;
    const al = opt.align || "center", x0 = al === "center" ? x - w / 2 : al === "right" ? x - w : x;
    const a = safeA(ctx, x0, y, w, size); if (a > 0.01) { ctx.globalAlpha *= a; D.txt(ctx, s, x, y, size, { align: al, weight: opt.weight || 800, color: opt.color }); }
    ctx.restore();
  }
  // label pil (layar) dengan muncul pegas
  function tag(ctx, s, x, y, a, opt = {}) {
    if (a <= 0.01) return; const sp = opt.sp == null ? 1 : opt.sp; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.translate(x, y); const k = lerp(0.9, 1, sp); ctx.scale(k, k); const w = D.label(ctx, s, 0, 0, { size: opt.size || 48, col: opt.col || P.amber, color: opt.color });
    if (opt.strike > 0) { const u = eio(opt.strike); ctx.strokeStyle = P.red; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-w / 2 + 14, 6); ctx.lineTo(-w / 2 + 14 + (w - 28) * u, -2); ctx.stroke(); }
    ctx.restore(); return w;
  }
  const pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  function shadowE(ctx, x, y, rx, ry, a = 0.3) { ctx.save(); ctx.fillStyle = `rgba(30,12,8,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  function sparkle(ctx, x, y, r, a, col = "#FFF3C4") {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath();
    for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.28 : r, an = i * Math.PI / 4 - Math.PI / 2; ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); }
    ctx.closePath(); ctx.fill(); D.glow(ctx, x, y, r * 1.6, col, 0.5); ctx.restore();
  }

  // ---------- dunia meja (sama rupa dengan bab 0) ----------
  const DESK_Y = 600, DESK_F = 930;
  const WIN = { x: 470, y: 78, w: 230, h: 200 };
  const LAMP = { bx: 600, by: 660, jx: 548, jy: 470, hx: 668, hy: 352 };
  const SHELF = { x0: 1250, x1: 1850, y: 215, slot: 78, bx: 1280, bw: 64, bh: 150 };
  const BOOKC = ["#E8665F", "#36B3A3", "#6A7BE0", "#E9A23B", "#9A6FD6"];   // 1, 2, 3, 4A, 4B (sama dengan bab 0)
  const PG = { x: 740, y: 300, w: 540, h: 560 };                         // cetakan baru (berdiri)
  const CAL = { x: 300, top: 110, w: 250, h: 280 };
  const STK = { x: 300, y: 800 };
  const TM = { x: 1330, y: 340, w: 380, h: 260 };                         // terminal
  const SCR = { x: TM.x + 18, y: TM.y + 18, w: TM.w - 36, h: TM.h - 40 };
  const KEY = { x: 1580, y: 770 };
  const GLS = { x: 700, y: 838 };

  function wall(ctx, t, bot = DESK_Y) {
    const gr = ctx.createLinearGradient(0, 0, 0, bot); gr.addColorStop(0, "#2A3A7C"); gr.addColorStop(1, "#3D509A");
    ctx.fillStyle = gr; ctx.fillRect(-600, -400, 3200, bot + 400);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = -576; x < 2600; x += 64) ctx.fillRect(x, -400, 3, bot + 400);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = -544; x < 2600; x += 64) for (let y = -360; y < bot - 20; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    LP.windowFrame(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, "#8A6E9E", () => LP.nightView(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, 0));
    addLight(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 260, "#9DB8FF", 0.14);
  }
  function desk(ctx, top = DESK_Y, front = DESK_F) {
    const gr = ctx.createLinearGradient(0, top, 0, front); gr.addColorStop(0, "#6E4834"); gr.addColorStop(1, "#9A6848");
    ctx.fillStyle = gr; ctx.fillRect(-600, top, 3200, front - top);
    ctx.strokeStyle = "rgba(60,30,20,0.18)"; ctx.lineWidth = 3;
    for (let i = 0; i < 9; i++) { const y = top + 26 + i * 40; if (y > front - 6) break; ctx.beginPath(); ctx.moveTo(-600, y); for (let x = -600; x <= 2600; x += 120) ctx.lineTo(x, y + Math.sin(x * 0.004 + i * 1.7) * 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,220,180,0.18)"; ctx.fillRect(-600, top, 3200, 4);
    ctx.fillStyle = "#B57D57"; ctx.fillRect(-600, front, 3200, 10);
    const g2 = ctx.createLinearGradient(0, front + 10, 0, 1300); g2.addColorStop(0, "#5A3726"); g2.addColorStop(1, "#3A2218");
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
    ctx.translate(hx, hy); ctx.rotate(-0.42);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, "#38428A"); sg.addColorStop(0.5, "#5562B4"); sg.addColorStop(1, "#38428A");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(34, -14); ctx.lineTo(70, 92); ctx.lineTo(-70, 92); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E3778"; ctx.beginPath(); ctx.ellipse(0, -14, 34, 9, 0, 0, TAU); ctx.fill();
    const lit = clamp(on);
    ctx.fillStyle = `rgb(${Math.round(lerp(40, 255, lit))},${Math.round(lerp(48, 236, lit))},${Math.round(lerp(110, 190, lit))})`;
    ctx.beginPath(); ctx.ellipse(0, 92, 70, 15, 0, 0, TAU); ctx.fill();
    ctx.restore();
    if (lit > 0.01) { addLight(ctx, hx + 40, hy + 90, 110, "#FFF2C8", 0.85 * lit); addLight(ctx, hx + 70, hy + 140, 280, "#FFC66E", 0.4 * lit); }
  }
  // satu punggung buku berdiri; bottom = alas; lit 0..1 = pendar; label di lingkaran
  function spine(ctx, x, bottom, w, h, col, label, t, o = {}) {
    const top = bottom - h;
    ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(x + 6, top + 6, w, h);
    const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, col); gr.addColorStop(0.55, col); gr.addColorStop(1, "rgba(20,20,40,0.35)");
    ctx.fillStyle = col; RR(ctx, x, top, w, h, 6); ctx.fill(); ctx.fillStyle = gr; RR(ctx, x, top, w, h, 6); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(x + 8, top + 16, w - 16, 5); ctx.fillRect(x + 8, top + h - 22, w - 16, 5);
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(x + 8, top + 28, w - 16, 3);
    if (o.lit > 0.01) addLight(ctx, x + w / 2, top + h / 2, 140, col, 0.5 * o.lit);
    if (label) {
      const cy = top + h * 0.5; ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(x + w / 2, cy, Math.min(30, w / 2 - 2), 0, TAU); ctx.fill();
      wtxt(ctx, label, x + w / 2, cy + 15, label.length > 1 ? 42 : 46, { weight: 900, color: "#FFFFFF" });
    }
  }
  // tempat kosong bergaris putus-putus
  function ghostSlot(ctx, x, bottom, w, h, t, a, label, col = P.warm, i = 0) {
    if (a <= 0.01) return; const top = bottom - h, pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + i);
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = D.hexA(col, 0.1 + 0.08 * pulse); RR(ctx, x, top, w, h, 8); ctx.fill();
    ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 14; ctx.strokeStyle = D.hexA(col, 0.75 + 0.25 * pulse); ctx.lineWidth = 4; RR(ctx, x + 2, top + 2, w - 4, h - 4, 8); ctx.stroke(); ctx.setLineDash([]);
    addLight(ctx, x + w / 2, top + h / 2, 90, col, 0.16 * pulse);
    if (label) wtxt(ctx, label, x + w / 2, top + h * 0.5 + 15, label.length > 1 ? 42 : 46, { weight: 900, color: col });
    ctx.restore();
  }
  function shelfBoard(ctx, x0, x1, y, brackets) {
    ctx.fillStyle = "#6B4632"; brackets.forEach(x => { ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x + 18, y + 20); ctx.lineTo(x + 18, y + 90); ctx.closePath(); ctx.fill(); });
    ctx.fillStyle = "#8A5A3C"; RR(ctx, x0, y, x1 - x0, 24, 5); ctx.fill();
    ctx.fillStyle = "#A8714C"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 5);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(x0 + 6, y + 24, x1 - x0 - 12, 8);
  }
  function shelf1(ctx, t, o) {
    const { x0, x1, y, slot, bx, bw, bh } = SHELF;
    for (let i = 0; i < 3; i++) spine(ctx, bx + i * slot, y, bw, bh, BOOKC[i], String(i + 1), t, { lit: i === 2 ? o.lit3 : 0 });
    for (let i = 3; i < 7; i++) ghostSlot(ctx, bx + i * slot, y, bw, bh, t, 0.75, null, P.warm, i);
    shelfBoard(ctx, x0, x1, y, [x0 + 60, x1 - 120]);
    if (o.spark > 0) { const cx = bx + 2 * slot + bw / 2; [[-30, -120, 22], [34, -70, 16], [-22, -20, 14]].forEach(([dx, dy, r], k) => sparkle(ctx, cx + dx, y + dy, r * (0.7 + 0.3 * Math.sin(t * 6 + k)), o.spark * (1 - ramp(o.sparkU, 0.6 + k * 0.1, 0.6)))); }
  }
  // tumpukan naskah jilid 4 (kiri depan)
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
  function pauseBadge(ctx, x, y, a, sp) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); const k = lerp(0.6, 1, sp); ctx.scale(k, k);
    D.glow(ctx, 0, 0, 90, P.amber, 0.35);
    ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#FFF1D0"; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "#1B2150"; RR(ctx, -16, -20, 11, 40, 3); ctx.fill(); RR(ctx, 5, -20, 11, 40, 3); ctx.fill();
    ctx.restore();
  }
  function glasses(ctx, glow) {
    const { x, y } = GLS;
    if (glow > 0.01) addLight(ctx, x, y - 4, 130, P.warm, 0.55 * glow);
    shadowE(ctx, x + 8, y + 20, 84, 14, 0.3);
    ctx.save(); ctx.translate(x, y); ctx.scale(0.76, 0.55);
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
  function dust(ctx, t, a) {
    ctx.save(); const r = D.rng(31);
    for (let i = 0; i < 26; i++) { const x0 = 560 + r() * 760, y0 = 330 + r() * 480, sp = 6 + r() * 10, ph = r() * 6.28;
      const x = x0 + Math.sin(t * 0.3 + ph) * 26, y = y0 - ((t * sp + ph * 30) % 120) + 60, al = a * (0.18 + 0.25 * Math.sin(t * 1.3 + ph) ** 2);
      ctx.fillStyle = `rgba(255,236,190,${al})`; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 2, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ---------- halaman cetakan (kanvas lepas layar; huruf jelek ↔ rapi) ----------
  const PGS = 2, LRS = 0.24;
  const FT = { it: `italic 400 50px ${SERIF}`, rm: `400 50px ${SERIF}`, sub: `italic 400 31px ${SERIF}`, op: `400 46px ${SERIF}` };
  const UG = [`700 48px "DejaVu Sans", sans-serif`, `italic 700 44px "DejaVu Sans Mono", monospace`, `400 54px ${SERIF}`];
  const TOK = [
    { s: "X", f: "it" }, { s: "n+1", f: "sub", dy: 12, gap: 1 }, { s: "=", f: "op", gap: 14 }, { s: "(", f: "rm", gap: 16 }, { s: "a", f: "it" }, { s: "X", f: "it", gap: 3 },
    { s: "n", f: "sub", dy: 12, gap: 1 }, { s: "+", f: "op", gap: 13 }, { s: "c", f: "it", gap: 13 }, { s: ")", f: "rm", gap: 3 }, { s: "mod", f: "rm", gap: 16 }, { s: "m", f: "it", gap: 12 }];
  const UGLY = (() => { const r = D.rng(551); return TOK.map((tk, i) => ({ rot: (r() - 0.5) * 0.55, dy: (r() - 0.5) * 38, dx: (r() - 0.5) * 16, sc: 0.74 + r() * 0.5, ink: 0.45 + r() * 0.5, font: UG[i % 3] })); })();
  const BASE = 330;
  let PGC = null, LRC = null, LAY = null;
  function layout(c) {
    if (LAY) return LAY; let x = 0; const xs = [];
    TOK.forEach(tk => { x += tk.gap || 0; c.font = FT[tk.f]; xs.push(x); x += c.measureText(tk.s).width; });
    const x0 = (PGW - x) / 2; LAY = xs.map((v, i) => { c.font = FT[TOK[i].f]; return { x: x0 + v, w: c.measureText(TOK[i].s).width }; }); return LAY;
  }
  const PGW = PG.w, PGH = PG.h;
  function drawTok(c, i, q, ugly) {
    const tk = TOK[i], L = LAY[i], U = UGLY[i], k = 1 - eio(q);
    const cx = L.x + L.w / 2 + U.dx * k, by = BASE + (tk.dy || 0) + U.dy * k;
    c.save(); c.translate(cx, by - 28); c.rotate(U.rot * k); const sc = lerp(1, U.sc, k); c.scale(sc, sc); c.translate(0, 28);
    c.textAlign = "center"; c.textBaseline = "alphabetic";
    if (ugly) {
      c.font = tk.f === "sub" ? U.font.replace(/\d+px/, "32px") : U.font;
      c.fillStyle = `rgba(40,36,48,${0.35 * U.ink})`; c.fillText(tk.s, 3.5, 2.5); c.fillText(tk.s, -2.5, -1.5);
      c.fillStyle = `rgba(28,26,36,${U.ink})`; c.fillText(tk.s, 0, 0);
    } else { c.font = FT[tk.f]; c.fillStyle = "#1B1A26"; c.fillText(tk.s, 0, 0); }
    c.restore();
  }
  function pageCanvas(q) {
    if (!PGC) { PGC = mk(PGW * PGS, PGH * PGS); LRC = mk(Math.round(PGW * LRS), Math.round(PGH * LRS)); }
    const c = PGC.getContext("2d"); c.setTransform(PGS, 0, 0, PGS, 0, 0); c.clearRect(0, 0, PGW, PGH); layout(c);
    // kertas
    c.fillStyle = "#FBF6EA"; c.fillRect(0, 0, PGW, PGH);
    const eg = c.createLinearGradient(0, 0, PGW, 0); eg.addColorStop(0, "rgba(150,120,80,0.10)"); eg.addColorStop(0.08, "rgba(150,120,80,0)"); eg.addColorStop(0.92, "rgba(150,120,80,0)"); eg.addColorStop(1, "rgba(150,120,80,0.12)");
    c.fillStyle = eg; c.fillRect(0, 0, PGW, PGH);
    // kepala halaman: nomor bagian + garis
    c.fillStyle = "#2B2A3A"; c.font = `700 34px ${SERIF}`; c.textAlign = "left"; c.fillText("3.2.1", 40, 70);
    c.fillStyle = "rgba(43,42,58,0.55)"; c.fillRect(140, 52, 300, 8); c.fillRect(40, 92, PGW - 80, 2);
    // paragraf (garis abu-abu); di keadaan jelek garisnya bergelombang & tidak rata
    const avgQ = q.reduce((s, v) => s + v, 0) / q.length, kk = 1 - eio(avgQ), rr = D.rng(77);
    const bars = (y0, n) => { for (let r = 0; r < n; r++) { const y = y0 + r * 26, len = r === n - 1 ? 0.55 : 1, jit = rr();
      c.fillStyle = `rgba(60,58,80,${lerp(0.42, 0.28 + jit * 0.3, kk)})`; c.save(); c.translate(40, y); c.rotate((jit - 0.5) * 0.03 * kk); c.fillRect(0, (jit - 0.5) * 6 * kk, (PGW - 80) * len * lerp(1, 0.86 + jit * 0.14, kk), 9); c.restore(); } };
    bars(130, 5); bars(410, 5);
    // rumus: lapisan jelek (berpiksel) lalu lapisan rapi
    const lc = LRC.getContext("2d"); lc.setTransform(LRS, 0, 0, LRS, 0, 0); lc.clearRect(0, 0, PGW, PGH);
    TOK.forEach((tk, i) => { const a = 1 - q[i]; if (a > 0.01) { lc.globalAlpha = a; drawTok(lc, i, q[i], true); } }); lc.globalAlpha = 1;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = false; c.drawImage(LRC, 0, 0, PGW * PGS, PGH * PGS); c.restore();
    TOK.forEach((tk, i) => { const a = q[i]; if (a > 0.01) { c.globalAlpha = a; drawTok(c, i, q[i], false); } }); c.globalAlpha = 1;
    // nomor persamaan
    c.fillStyle = "rgba(43,42,58,0.7)"; c.font = `400 30px ${SERIF}`; c.textAlign = "right"; c.fillText("(1)", PGW - 34, BASE + 70);
    return PGC;
  }
  // tempat halaman di dunia: slide 0..1 (meluncur di meja), rise 0..1 (berdiri)
  function pageXf(slide, rise) {
    const cx = PG.x + PG.w / 2 + lerp(760, 0, eio(slide)), bottom = lerp(898, PG.y + PG.h, eio(rise)), sy = lerp(0.16, 1, eio(rise));
    return { cx, bottom, sy, rot: lerp(0.0, -0.012, eio(rise)) };
  }
  function placePage(ctx, img, xf, a = 1) {
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(xf.cx, xf.bottom); ctx.rotate(xf.rot); ctx.scale(1, xf.sy);
    ctx.drawImage(img, -PG.w / 2, -PG.h, PG.w, PG.h); ctx.restore();
  }
  const tokWorld = (i, xf) => { const L = LAY[i]; return [xf.cx - PG.w / 2 + L.x + L.w / 2, xf.bottom - (PG.h - BASE + 28) * xf.sy]; };

  // ---------- terminal tua ----------
  let TXC = null;
  function texMark() {   // "TeX" dengan E diturunkan (huruf serif), digambar sekali
    if (TXC) return TXC; TXC = mk(440, 220); const c = TXC.getContext("2d"); c.font = `700 150px ${SERIF}`; c.fillStyle = "#B6FFD8"; c.textBaseline = "alphabetic";
    const wT = c.measureText("T").width, wE = c.measureText("E").width; c.fillText("T", 20, 160); c.fillText("E", 20 + wT - 22, 192); c.fillText("X", 20 + wT - 22 + wE - 24, 160);
    return TXC;
  }
  const AOUT = [[-0.5, 0.5], [-0.11, -0.5], [0.11, -0.5], [0.5, 0.5], [0.29, 0.5], [0.19, 0.22], [-0.19, 0.22], [-0.29, 0.5]], AIN = [[-0.12, 0.04], [0, -0.27], [0.12, 0.04]];
  function polyLen(p) { let s = 0; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += Math.hypot(b[0] - a[0], b[1] - a[1]); } return s; }
  function partialPoly(ctx, p, u, cx, cy, sz) {   // garis tepi sampai fraksi u; mengembalikan titik yang sudah tercapai
    const L = polyLen(p) * u; let s = 0, n = 0; ctx.beginPath(); ctx.moveTo(cx + p[0][0] * sz, cy + p[0][1] * sz);
    for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (s + d <= L) { ctx.lineTo(cx + b[0] * sz, cy + b[1] * sz); s += d; n++; } else { const f = (L - s) / d; ctx.lineTo(cx + lerp(a[0], b[0], f) * sz, cy + lerp(a[1], b[1], f) * sz); break; } }
    ctx.stroke(); return n;
  }
  function glyphA(ctx, cx, cy, sz, u, t) {
    const ph = "#7CF2B0";
    // kisi desain
    ctx.strokeStyle = "rgba(124,242,176,0.16)"; ctx.lineWidth = 1.5;
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(cx + i * sz / 6, cy - sz * 0.62); ctx.lineTo(cx + i * sz / 6, cy + sz * 0.62); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - sz * 0.62, cy + i * sz / 6); ctx.lineTo(cx + sz * 0.62, cy + i * sz / 6); ctx.stroke(); }
    const fill = ramp(u, 0.82, 0.18);
    if (fill > 0) { ctx.save(); ctx.globalAlpha *= fill * 0.85; ctx.fillStyle = ph; ctx.beginPath(); AOUT.forEach(([x, y], i) => i ? ctx.lineTo(cx + x * sz, cy + y * sz) : ctx.moveTo(cx + x * sz, cy + y * sz)); ctx.closePath();
      AIN.forEach(([x, y], i) => i ? ctx.lineTo(cx + x * sz, cy + y * sz) : ctx.moveTo(cx + x * sz, cy + y * sz)); ctx.closePath(); ctx.fill("evenodd"); ctx.restore(); }
    ctx.strokeStyle = ph; ctx.lineWidth = 3.5; ctx.lineJoin = "round";
    const n1 = partialPoly(ctx, AOUT, clamp(u / 0.62), cx, cy, sz), n2 = u > 0.62 ? partialPoly(ctx, AIN, clamp((u - 0.62) / 0.2), cx, cy, sz) : 0;
    // titik kendali + pegangan
    const dots = [...AOUT.slice(0, n1 + 1), ...(u > 0.62 ? AIN.slice(0, n2 + 1) : [])];
    dots.forEach(([x, y], i) => { const px = cx + x * sz, py = cy + y * sz; ctx.strokeStyle = "rgba(255,213,138,0.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - 12, py - 6); ctx.lineTo(px + 12, py + 6); ctx.stroke();
      ctx.fillStyle = "#FFD38A"; ctx.beginPath(); ctx.arc(px, py, 5.5 + Math.sin(t * 4 + i) * 0.8, 0, TAU); ctx.fill(); });
  }
  // o: a (muncul), on (layar), code, glyph, tex, odo {pre, dig, u}
  function terminal(ctx, t, o) {
    if (o.a <= 0.01) return; const sp = clamp(spring(o.a * 0.9, 9, 0.5));
    ctx.save(); ctx.globalAlpha *= clamp(o.a * 2); ctx.translate(0, (1 - sp) * 40);
    // bayangan + papan ketik
    shadowE(ctx, TM.x + TM.w / 2 + 10, 668, 150, 18, 0.35);
    ctx.fillStyle = "#B9AF98"; ctx.beginPath(); ctx.moveTo(1480, TM.y + TM.h - 4); ctx.lineTo(1560, TM.y + TM.h - 4); ctx.lineTo(1592, 660); ctx.lineTo(1448, 660); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#A39981"; ctx.beginPath(); ctx.ellipse(1520, 662, 96, 13, 0, 0, TAU); ctx.fill();
    shadowE(ctx, KEY.x + 8, KEY.y + 26, 170, 14, 0.3);
    ctx.fillStyle = "#CFC6B0"; ctx.beginPath(); ctx.moveTo(KEY.x - 140, KEY.y - 18); ctx.lineTo(KEY.x + 140, KEY.y - 18); ctx.lineTo(KEY.x + 158, KEY.y + 22); ctx.lineTo(KEY.x - 158, KEY.y + 22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#A69C85"; ctx.fillRect(KEY.x - 158, KEY.y + 22, 316, 8);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 11; k++) { const w = 22, x = KEY.x - 132 + r * 4 + k * 24.5 + (r === 2 ? 8 : 0), y = KEY.y - 13 + r * 11;
      const down = o.press && ((k * 7 + r * 3 + Math.floor(t * 9)) % 13 === 0) ? 2 : 0; ctx.fillStyle = "#EDE6D3"; RR(ctx, x, y + down, w - 3, 8, 2); ctx.fill(); }
    // badan monitor
    ctx.fillStyle = "rgba(10,10,30,0.3)"; RR(ctx, TM.x + 8, TM.y + 10, TM.w, TM.h, 26); ctx.fill();
    const bg = ctx.createLinearGradient(0, TM.y, 0, TM.y + TM.h); bg.addColorStop(0, "#E6DECB"); bg.addColorStop(1, "#C7BDA5");
    ctx.fillStyle = bg; RR(ctx, TM.x, TM.y, TM.w, TM.h, 26); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; RR(ctx, TM.x + 8, TM.y + 6, TM.w - 16, 8, 4); ctx.fill();
    ctx.fillStyle = "#8F866F"; ctx.beginPath(); ctx.arc(TM.x + TM.w - 30, TM.y + TM.h - 11, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = o.on > 0.5 ? "#7CF2B0" : "#6C6450"; ctx.beginPath(); ctx.arc(TM.x + TM.w - 48, TM.y + TM.h - 11, 4, 0, TAU); ctx.fill();
    // layar
    const { x, y, w, h } = SCR;
    ctx.fillStyle = "#0D241D"; RR(ctx, x, y, w, h, 18); ctx.fill();
    ctx.save(); RR(ctx, x, y, w, h, 18); ctx.clip();
    const on = clamp(o.on);
    if (on > 0) {
      const vy = on < 1 ? lerp(2, h, eout(on)) : h; ctx.fillStyle = `rgba(30,70,52,${0.7 * on})`; ctx.fillRect(x, y + h / 2 - vy / 2, w, vy);
      D.glow(ctx, x + w / 2, y + h / 2, w * 0.7, "#5CE0A0", 0.18 * on);
      // baris kode
      const ca = 1 - ramp(o.glyph, 0, 0.25); if (o.code > 0 && ca > 0.01) { const r = D.rng(12); ctx.save(); ctx.globalAlpha *= ca;
        for (let i = 0; i < 6; i++) { const u = clamp(o.code * 6 - i), ind = [0, 1, 1, 2, 1, 0][i] * 22, len = 90 + r() * 170;
          if (u <= 0) break; ctx.fillStyle = i % 3 === 0 ? "#FFD38A" : "#7CF2B0"; RR(ctx, x + 22 + ind, y + 22 + i * 30, len * u, 12, 4); ctx.fill(); } ctx.restore(); }
      // huruf A dirancang
      if (o.glyph > 0) { const mv = eio(o.texMove || 0); if (mv < 1) { ctx.save(); ctx.globalAlpha *= 1 - mv; glyphA(ctx, x + w / 2, lerp(y + h / 2 + 4, y + 70, mv), lerp(150, 90, mv), o.glyph, t); ctx.restore(); } }
      // TeX
      if (o.tex > 0.01) { const s = clamp(spring(o.tex, 10, 0.5)), img = texMark(); ctx.save(); ctx.globalAlpha *= clamp(o.tex * 3); ctx.translate(x + w / 2 + 6, y + 88); ctx.scale(0.66 * s, 0.66 * s);
        D.glow(ctx, 0, 0, 160, "#5CE0A0", 0.3); ctx.drawImage(img, -220, -125, 440, 220); ctx.restore(); }
      // odometer versi (tidak dibacakan)
      if (o.odo) { const { pre, dig, u } = o.odo; ctx.save(); ctx.font = `800 44px ${FONT}`; const wp = ctx.measureText(pre).width, wd = dig ? ctx.measureText(dig).width : 0;
        const x0 = x + w / 2 - (wp + wd) / 2, by = y + h - 22; ctx.globalAlpha *= clamp(o.odoA);
        D.txt(ctx, pre, x0, by, 44, { color: "#B6FFD8", weight: 800 });
        if (dig) { ctx.save(); ctx.beginPath(); ctx.rect(x0 + wp - 2, by - 44, wd + 6, 56); ctx.clip(); ctx.globalAlpha *= clamp(u * 3);
          D.txt(ctx, dig, x0 + wp + 3, by + (1 - eout(u)) * 46, 44, { color: "#FFE3A8", weight: 800 }); ctx.restore(); }
        ctx.restore(); }
      // garis pindai
      ctx.fillStyle = "rgba(0,0,0,0.16)"; for (let yy = y; yy < y + h; yy += 5) ctx.fillRect(x, yy, w, 2);
    }
    ctx.restore();
    ctx.strokeStyle = "#9B917A"; ctx.lineWidth = 4; RR(ctx, x, y, w, h, 18); ctx.stroke();
    ctx.restore();
    if (on > 0) addLight(ctx, x + w / 2, y + h / 2, 380, "#5CE0A0", 0.12 * on * o.a);
  }

  // ---------- kalender sobek ----------
  function calSheet(ctx, n, showN, numPop, t) {
    const { x, top, w, h } = CAL;
    ctx.fillStyle = "#FBF6EA"; RR(ctx, x - w / 2 + 10, top + 10, w - 20, h - 18, 8); ctx.fill();
    ctx.fillStyle = "#E8584F"; RR(ctx, x - w / 2 + 10, top + 10, w - 20, 54, 8); ctx.fill(); ctx.fillRect(x - w / 2 + 10, top + 46, w - 20, 18);
    if (showN > 0.01 && n > 0) {
      ctx.save(); ctx.globalAlpha *= showN; ctx.translate(x, top + 200); const k = 1 + 0.12 * numPop; ctx.scale(k, k);
      wtxt(ctx, String(n), 0, 0, 132, { weight: 900, color: n >= 10 ? "#C2384A" : "#27306A" }); ctx.restore();
      ctx.save(); ctx.globalAlpha *= showN; wtxt(ctx, "tahun", x, top + 250, 44, { weight: 800, color: "#3A4378" }); ctx.restore();
    } else { ctx.fillStyle = "rgba(40,50,110,0.22)"; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { ctx.beginPath(); ctx.arc(x - 70 + c * 28, top + 110 + r * 34, 6, 0, TAU); ctx.fill(); } }
  }
  function calendar(ctx, t, o) {
    const { x, top, w, h } = CAL;
    // tali + paku
    ctx.strokeStyle = "#2A2F5E"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 70, top + 8); ctx.lineTo(x, top - 22); ctx.lineTo(x + 70, top + 8); ctx.stroke();
    ctx.fillStyle = "#C9A27A"; ctx.beginPath(); ctx.arc(x, top - 22, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(10,10,30,0.3)"; RR(ctx, x - w / 2 + 8, top + 8, w, h, 12); ctx.fill();
    ctx.fillStyle = "#3A447E"; RR(ctx, x - w / 2, top, w, h, 12); ctx.fill();
    // lembar-lembar di bawah (tebal tumpukan berkurang)
    const left = Math.max(0, 9 - (o.n - 1));
    for (let i = Math.min(left, 4); i > 0; i--) { ctx.fillStyle = i % 2 ? "#E9E1CF" : "#F2EBDB"; RR(ctx, x - w / 2 + 10 + i * 1.5, top + 10 + i * 3, w - 20, h - 18, 8); ctx.fill(); }
    calSheet(ctx, o.n, o.showN, o.numPop, t);
    ctx.fillStyle = "#9AA2C8"; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(x - 72 + i * 24, top + 10, 5, 0, TAU); ctx.fill(); }
    // lembar yang tersobek terbang
    (o.fly || []).forEach(({ n, u, k }) => {
      const dir = k % 2 ? 1 : -1, dx = dir * (150 * u + 220 * u * u), dy = 110 * u + 560 * u * u, rot = dir * (0.6 * u + 0.9 * u * u);
      ctx.save(); ctx.globalAlpha *= Math.pow(clamp(1 - u), 1.6); ctx.translate(x + dx, top + 10 + dy); ctx.rotate(rot); ctx.translate(-x, -(top + 10));
      ctx.fillStyle = "#FBF6EA"; RR(ctx, x - w / 2 + 10, top + 10, w - 20, h - 18, 8); ctx.fill();
      ctx.fillStyle = "#E8584F"; ctx.fillRect(x - w / 2 + 10, top + 10, w - 20, 54);
      // sobekan bergerigi di atas
      ctx.fillStyle = "#FBF6EA"; ctx.beginPath(); for (let i = 0; i <= 12; i++) ctx.lineTo(x - w / 2 + 10 + i * (w - 20) / 12, top + 10 + (i % 2 ? -6 : 2)); ctx.lineTo(x + w / 2 - 10, top + 16); ctx.lineTo(x - w / 2 + 10, top + 16); ctx.fill();
      ctx.globalAlpha *= 0.32 * clamp(1 - u * 3);   // nomor lama hanya membayang (nomor baru di bawahnya tetap terbaca)
      if (ctx.globalAlpha > 0.02) D.txt(ctx, String(n), x, top + 200, 132, { align: "center", weight: 900, color: "#27306A" });
      ctx.restore();
    });
  }

  // =====================================================================
  // b5_1
  function T1(b) {
    return { k3: D.at(b, "ketiga"), terb: D.at(b, "terbit,"), kn: D.at(b, "Knuth"), lih: D.at(b, "melihat"), cet: D.at(b, "cetakan"), bkn: D.atEnd(b, "bukunya"),
      huruf: D.at(b, "hurufnya"), jelek: D.at(b, "jelek"), sek: D.atEnd(b, "sekali."), henti: D.at(b, "berhenti"), seb: D.atEnd(b, "sebentar"),
      buat: D.at(b, "membuat"), peny: D.at(b, "penyusun"), send: D.atEnd(b, "sendiri,"), tex: D.at(b, "TeX."), renc: D.at(b, "Rencananya"),
      seth: D.atEnd(b, "setahun,"), tetapi: D.at(b, "tetapi"), sep: D.at(b, "sepuluh"), sepE: D.atEnd(b, "tahun."), end: D.speechEnd(b) };
  }
  // berkas hijau dari layar TeX ke tiap huruf yang dirapikan (tiba saat q[i] melewati 0,4)
  const QT0 = T => T.tetapi + 0.15, QSPAN = T => T.sep + 0.45 - T.tetapi - 0.15;
  function texBeams(ctx, l, T, xf) {
    const sx = SCR.x + SCR.w / 2, sy = SCR.y + SCR.h * 0.42, col = "#7CF2B0", TR = 0.34;
    ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.lineCap = "round";
    TOK.forEach((_, i) => {
      const li = QT0(T) + QSPAN(T) * (0.4 + 0.55 * i / (TOK.length - 1)) / 1.55, u = (l - (li - TR)) / TR;
      if (u <= 0 || u > 1.9) return;
      const [ex, ey] = tokWorld(i, xf), mx = (sx + ex) / 2, my = Math.min(sy, ey) - 150;
      const P2 = v => [(1 - v) * (1 - v) * sx + 2 * v * (1 - v) * mx + v * v * ex, (1 - v) * (1 - v) * sy + 2 * v * (1 - v) * my + v * v * ey];
      const head = clamp(u), tail = clamp(u - 0.45), fade = 1 - clamp((u - 1) / 0.9);
      if (head - tail > 0.01) { ctx.beginPath(); for (let k = 0; k <= 16; k++) { const [x, y] = P2(lerp(tail, head, k / 16)); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.strokeStyle = D.hexA(col, 0.28 * fade); ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = D.hexA(col, 0.9 * fade); ctx.lineWidth = 5; ctx.stroke(); }
      if (u < 1) { const [hx, hy] = P2(head); addLight(ctx, hx, hy, 46, col, 0.8); ctx.fillStyle = "#E8FFF2"; ctx.beginPath(); ctx.arc(hx, hy, 7, 0, TAU); ctx.fill(); }
      else addLight(ctx, ex, ey - 16, 70, col, 0.7 * fade);
    });
    ctx.restore();
  }
  // waktu sobekan ke-k (1..9) membuka lembar k+1; lembar 10 terbuka tepat saat "sepuluh"
  const tearT = (T, k) => T.tetapi + 0.2 + (T.sep - 0.02 - T.tetapi - 0.2) * Math.pow((k - 1) / 8, 0.82);
  function b1Cam(b, l, T) {
    return D.path([[0, 1300, 470, 1.22], [T.terb + 0.2, 1290, 474, 1.25], [T.cet + 0.35, 1010, 572, 1.25], [T.sek + 0.15, 1035, 575, 1.29],
      [T.henti + 0.55, 960, 532, 1.0], [T.send, 990, 520, 1.02], [T.tex + 0.3, 1060, 515, 1.06], [T.renc + 0.1, 960, 532, 1.0], [T.sepE + 0.1, 960, 532, 1.0], [b.dur - 0.6, 985, 515, 1.03], [b.dur + 0.12, 1360, 250, 1.36]], l);
  }
  function bip1(ctx, b, l, t, T, xf) {
    const A = [1520, 742], Bp = [1376, 690], Cp = [1766, 742], s = 228;
    const w1 = ramp(l, T.bkn - 0.35, 0.85), w2 = ramp(l, T.henti + 0.05, 1.15);
    let x, y, o;
    if (w1 < 1) { x = lerp(A[0], Bp[0], eio(w1)); y = lerp(A[1], Bp[1], eio(w1)); }
    else if (w2 <= 0) { x = Bp[0]; y = Bp[1]; }
    else { x = lerp(Bp[0], Cp[0], eio(w2)); y = lerp(Bp[1], Cp[1], eio(w2)); }
    if (w1 > 0 && w1 < 1) o = { pose: "jalan", t, dir: -1 };
    else if (w2 > 0 && w2 < 1) o = { pose: "jalan", t, dir: 1, mood: "think" };
    else if (w1 <= 0) o = { pose: "diam", t, mood: l > T.k3 - 0.2 ? "happy" : "think", look: l < T.kn ? [-0.25, -1] : [-1, 0.1] };
    else if (w2 <= 0) {
      const lens = xf ? tokWorld(8, xf) : [1100, 600];
      o = { pose: "kacaPembesar", t, target: [lens[0], lens[1] - 6], glass: 0.82, mood: l > T.jelek - 0.05 ? "sad" : "think", sweat: l > T.jelek + 0.1,
        content: (c, cx, cy, r) => { if (!xf) return; c.save(); c.translate(cx, cy); c.scale(1.85, 1.85); c.translate(-cx, -cy); placePage(c, PGC, xf); c.restore(); } };
    } else if (l < T.tex - 0.05) o = { pose: "tekan", t, target: [KEY.x + 30 + 26 * Math.sin(l * 4.3), KEY.y + 2], press: l > T.buat + 0.15 ? 0.62 + 0.38 * Math.sin(l * 13) : 0.2, mood: "think" };
    else if (l < T.tetapi + 0.1) o = { pose: "diam", t, mood: "happy", look: l < T.renc ? [-1, -0.45] : [-1, -0.6] };
    else if (l < T.sep + 0.1) o = { pose: "diam", t, mood: "wow", look: [-1, -0.55] };
    else if (l < T.sep + 1.05) o = { pose: "kaget", t, k: l - T.sep - 0.1, mood: "wow", seru: false };
    else o = { pose: "diam", t, mood: "happy", look: [-1, -0.3], wave: l };
    KB.draw(ctx, x, y, s, o);
  }
  S.b5_1 = function (ctx, b, l, t, TL) {
    const T = T1(b), c = drift(b1Cam(b, l, T), t);
    const slide = ramp(l, T.kn + 0.15, 0.7), rise = ramp(l, T.cet, 0.85), pA = ramp(l, T.kn + 0.1, 0.25);
    // kemajuan perapian huruf: ikut sobekan kalender
    const tp = clamp((l - QT0(T)) / QSPAN(T));
    const q = TOK.map((_, i) => clamp(tp * 1.55 - (i / (TOK.length - 1)) * 0.55));
    const img = pA > 0 ? pageCanvas(q) : null, xf = pageXf(slide, rise);
    // kalender: jumlah sobekan
    let n = 1, fly = [], lastTear = -9; for (let k = 1; k <= 9; k++) { const tk = tearT(T, k); if (l >= tk) { n = k + 1; lastTear = tk; if (l < tk + 0.6) fly.push({ n: k, u: (l - tk) / 0.6, k }); } }
    const numPop = Math.max(0, 1 - (l - lastTear) / 0.25) * (lastTear > 0 ? 1 : 0) + (l > T.sep - 0.02 ? 0.6 * Math.exp(-(l - T.sep) * 3) : 0);
    ctx.save(); camT(ctx, c);
    wall(ctx, t);
    calendar(ctx, t, { n, showN: ramp(l, T.renc, 0.3), numPop: Math.max(numPop, l >= T.renc && l < T.renc + 0.4 ? 1 - (l - T.renc) / 0.4 : 0), fly });
    lamp(ctx, t, 1);
    shelf1(ctx, t, { lit3: ramp(l, T.k3 - 0.1, 0.4) * (1 - ramp(l, T.cet, 0.8)), spark: ramp(l, T.terb, 0.2), sparkU: l - T.terb });
    desk(ctx);
    stack(ctx);
    pauseBadge(ctx, STK.x - 70, 640, ramp(l, T.henti + 0.05, 0.25), clamp(spring(l - T.henti - 0.05, 10, 0.5)));
    // terminal
    terminal(ctx, t, { a: ramp(l, T.buat - 0.25, 0.6), on: ramp(l, T.buat + 0.15, 0.3), code: ramp(l, T.buat + 0.35, 0.6), glyph: ramp(l, T.peny, 1.7),
      texMove: ramp(l, T.tex - 0.15, 0.6), tex: ramp(l, T.tex, 0.45), press: l > T.buat + 0.15 && l < T.tex,
      odo: odoState(l, T), odoA: ramp(l, T.renc + 0.2, 0.4) * (1 - ramp(l, b.dur - 0.6, 0.35)) });
    // halaman cetakan
    // halaman: selama masih tergeletak (meluncur) ia lebih dekat ke kamera daripada Bip, jadi digambar sesudah Bip
    const drawPage = () => { if (!img) return;
      shadowE(ctx, xf.cx + 14, xf.bottom + 6, PG.w * 0.55, 22, 0.32 * pA);
      placePage(ctx, img, xf, pA);
      // kilau saat huruf selesai rapi
      const done = ramp(l, T.sep + 0.45, 0.3) * (1 - ramp(l, T.sepE + 0.6, 0.6));
      if (done > 0) [[PG.x + 40, PG.y + 250, 26], [PG.x + PG.w - 30, PG.y + 300, 20], [PG.x + PG.w * 0.5, PG.y + 210, 16]].forEach(([sx, sy, r], k) => sparkle(ctx, sx, sy, r * (0.8 + 0.2 * Math.sin(t * 7 + k)), done));
      texBeams(ctx, l, T, xf);
    };
    const pageFront = rise < 0.3;
    if (!pageFront) drawPage();
    glasses(ctx, ramp(l, T.lih - 0.1, 0.3) * (1 - ramp(l, T.bkn, 0.6)));
    bip1(ctx, b, l, t, T, img ? xf : null);
    if (pageFront) drawPage();
    // cahaya
    KL.parts.warmPool(ctx, 980, 700, 760, 0.55, 0.5);
    KL.parts.warmPool(ctx, LAMP.hx + 40, LAMP.hy + 30, 420, 0.36, 1);
    addLight(ctx, LAMP.hx + 45, LAMP.hy + 95, 150, "#FFE7B0", 0.45);
    dust(ctx, t, 0.8);
    ctx.restore();
    D.post(cx => {
      cx.globalAlpha = 1 - ramp(l, b.dur - 0.75, 0.3);   // label memudar sebelum silang-pudar ke b5_2
      const p3 = pop(l, T.k3); tag(cx, "jilid 3", ...toS(c, SHELF.bx + 2 * SHELF.slot + SHELF.bw / 2, 292), p3.a * (1 - ramp(l, T.kn - 0.1, 0.3)), { sp: p3.sp, col: BOOKC[2], size: 48 });
      const pc = pop(l, T.cet); tag(cx, "cetakan baru jilid 2", ...toS(c, PG.x + PG.w / 2, 252), pc.a * (1 - ramp(l, T.jelek - 0.25, 0.25)), { sp: pc.sp, col: P.amber, size: 48 });
      const pj = pop(l, T.jelek); tag(cx, "hurufnya jelek", ...toS(c, PG.x + PG.w / 2, 252), pj.a * (1 - ramp(l, T.henti - 0.1, 0.4)), { sp: pj.sp, col: P.pink, size: 48 });
      const ph = pop(l, T.henti + 0.15); tag(cx, "jeda", ...toS(c, STK.x + 52, 640), ph.a, { sp: ph.sp, col: P.amber, size: 46 });
      const pp = pop(l, T.peny); tag(cx, "program penyusun huruf", ...toS(c, TM.x + TM.w / 2, 290), pp.a, { sp: pp.sp, col: P.teal, size: 46 });
      const pr = pop(l, T.renc + 0.05); tag(cx, "rencana", ...toS(c, CAL.x, 452), pr.a, { sp: pr.sp, col: P.amber, size: 46, strike: ramp(l, T.tetapi + 0.05, 0.45) });
      const pk = pop(l, T.sep); tag(cx, "kenyataan", ...toS(c, CAL.x, 532), pk.a, { sp: pk.sp, col: P.pink, size: 46 });
    });
  };
  // odometer versi TeX: 3.14 → 3.141592653 (digit baru bergulir dari bawah)
  const PI_S = "3.141592653";
  function odoState(l, T) {
    const t0 = T.renc + 0.9, step = (T.sepE + 0.4 - t0) / 7; let k = Math.floor((l - t0) / step); k = clamp(k, -1, 6);
    if (l < t0) return { pre: "v3.14", dig: "", u: 1 };
    const len = 4 + k + 1, u = clamp((l - t0 - k * step) / 0.35), s = "v" + PI_S.slice(0, len);
    return { pre: s.slice(0, -1), dig: s.slice(-1), u };
  }

  // =====================================================================
  // b5_2: rak menjadi lini waktu 1962–2026
  const PLK = { x0: 96, x1: 1852, y: 640 };
  const YX = y => 130 + (y - 1962) * 20.625;
  const TLB = [{ k: "1", y: 1968, x: 236 }, { k: "2", y: 1969, x: 300 }, { k: "3", y: 1973, x: 364 }];
  const BW = 58, BH = 172, BIG = 190;
  const FUT = ["4C", "4D", "5", "6", "7"], FX = i => 1480 + i * 74, FW = 66;
  const BIP2 = { x: 728, y: 560, s: 160 };
  function T2(b) {
    return { mem: D.at(b, "memperkirakan"), j4: D.at(b, "jilid keempat"), d03: D.at(b, "dua ribu tiga."), ken: D.at(b, "Kenyataannya,"),
      e4A: D.at(b, "empat A"), terb: D.at(b, "terbit tahun"), d11: D.at(b, "dua ribu sebelas,"), e4B: D.at(b, "empat B"), d22: D.at(b, "dua ribu dua puluh dua,"),
      beb: D.at(b, "beberapa jilid"), masih: D.at(b, "masih"), end: D.speechEnd(b) };
  }
  // tahun penanda waktu sebagai fungsi waktu lokal
  function curYear(l, T) {
    const seg = [[T.ken - 0.15, 1973], [T.ken + 1.8, 2003], [T.ken + 2.35, 2003], [T.d11 - 0.2, 2011], [T.e4B - 0.75, 2011], [T.d22 - 0.25, 2022], [T.beb - 0.75, 2022], [T.beb + 0.35, 2026]];
    if (l < seg[0][0]) return null;
    for (let i = 1; i < seg.length; i++) if (l <= seg[i][0]) { const [t0, y0] = seg[i - 1], [t1, y1] = seg[i]; return lerp(y0, y1, D.sm((l - t0) / (t1 - t0))); }
    return 2026;
  }
  // waktu (lokal) saat penanda melewati tahun Y (pencarian biner pada curYear)
  function passT(T, Y) { let a = T.ken - 0.15, z = T.beb + 0.4; for (let i = 0; i < 30; i++) { const m = (a + z) / 2, y = curYear(m, T); if (y == null || y < Y) a = m; else z = m; } return z; }
  function paperIcon(ctx, x, y) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.12);
    ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(-20, -72, 46, 70);
    ctx.fillStyle = "#F4ECDA"; ctx.fillRect(-24, -76, 46, 70);
    ctx.fillStyle = "rgba(70,80,120,0.5)"; for (let i = 0; i < 6; i++) ctx.fillRect(-18, -66 + i * 10, i === 5 ? 18 : 32, 3);
    ctx.restore();
  }
  function miniStack(ctx, cx, bottom, a) {   // edisi baru jilid 1–3: tiga buku tipis berbaring
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; const dy = (1 - eout(a)) * -40;
    for (let i = 0; i < 3; i++) { const y = bottom - 13 - i * 13 + dy; ctx.fillStyle = BOOKC[i]; RR(ctx, cx - 34 + i * 3, y, 66, 12, 3); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(cx - 26 + i * 3, y + 4, 50, 3); }
    ctx.restore();
  }
  function fascicles(ctx, x0, x1, bottom, a, t) {   // fasikel 2005–2009: buku tipis berdiri
    if (a <= 0.01) return; const n = 5; ctx.save();
    for (let i = 0; i < n; i++) { const u = clamp(a * n - i), x = lerp(x0, x1 - 13, i / (n - 1)), h = 66 + (i % 2) * 8; if (u <= 0) break;
      ctx.globalAlpha = u; const yy = bottom - h * eout(u); ctx.fillStyle = ["#F2C46B", "#7FD3C4", "#F29C8F", "#A7B4F5", "#C9A5F0"][i]; RR(ctx, x, yy, 13, bottom - yy, 3); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.fillRect(x + 3, yy + 8, 7, 3); }
    ctx.restore();
  }
  function twoLine(ctx, l1, l2, x, y, a, sp, col, sec) {   // pil dua baris (layar); sec = pil sekunder (redup, tanpa pegas, tepi tipis)
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a * (sec ? 0.8 : 1); ctx.translate(x, y); const k = sec ? 1 : lerp(0.93, 1, sp); ctx.scale(k, k);
    ctx.font = `800 46px ${FONT}`; const w1 = ctx.measureText(l1).width; ctx.font = `700 44px ${FONT}`; const w2 = l2 ? ctx.measureText(l2).width : 0;
    const w = Math.max(w1, w2) + 52, h = l2 ? 116 : 72;
    ctx.fillStyle = "rgba(10,18,52,0.9)"; RR(ctx, -w / 2, -h / 2, w, h, 24); ctx.fill(); ctx.strokeStyle = D.hexA(col, sec ? 0.6 : 0.85); ctx.lineWidth = sec ? 2 : 3; ctx.stroke();
    D.txt(ctx, l1, 0, l2 ? -6 : 16, 46, { align: "center", weight: 800, color: "#FFFFFF" });
    if (l2) D.txt(ctx, l2, 0, 42, 44, { align: "center", weight: 700, color: col });
    ctx.restore(); return w;
  }
  // garis siku (turun lalu mendatar), untuk label yang harus menghindari label lain
  function elbow(ctx, x0, y0, x1, y1, x2, a, col) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = D.hexA(col, 0.8); ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y1); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0, y0, 6, 0, TAU); ctx.fill(); ctx.restore(); }
  function leader(ctx, x0, y0, x1, y1, a, col) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = D.hexA(col, 0.8); ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0, y0, 6, 0, TAU); ctx.fill(); ctx.restore(); }
  S.b5_2 = function (ctx, b, l, t, TL) {
    const T = T2(b);
    const c = drift(D.path([[0, 266, 680, 1.186], [0.42, 268, 678, 1.186], [1.7, 720, 540, 1.16], [T.ken - 0.2, 760, 545, 1.13], [T.d11, 900, 545, 1.05], [T.beb - 0.4, 980, 545, 0.97], [b.dur, 980, 545, 0.97]], l), t);
    const yr = curYear(l, T), pTeX = passT(T, 1977), pEd = passT(T, 1997), pTg = passT(T, 2002.97), pFa = passT(T, 2005), pNow = T.beb + 0.35;
    const land4A = T.d11 - 0.2, land4B = T.d22 - 0.25;
    ctx.save(); camT(ctx, c);
    wall(ctx, t, 905);
    desk(ctx, 905, 1010);
    KL.parts.warmPool(ctx, 760, 520, 980, 0.45, 0.6);
    // papan lini waktu
    ctx.fillStyle = "#6B4632"; [300, 900, 1500].forEach(x => { ctx.beginPath(); ctx.moveTo(x, PLK.y + 20); ctx.lineTo(x + 18, PLK.y + 20); ctx.lineTo(x + 18, PLK.y + 86); ctx.closePath(); ctx.fill(); });
    shelfBoard(ctx, PLK.x0, PLK.x1, PLK.y, []);
    // pita TeX di muka papan
    const aTeX = ramp(l, pTeX, 0.5);
    if (aTeX > 0) { const x0 = YX(1977), x1 = lerp(x0, YX(1986), eio(ramp(l, pTeX, 0.9))); ctx.save(); ctx.globalAlpha *= aTeX; ctx.fillStyle = D.hexA(P.teal, 0.85); RR(ctx, x0, PLK.y + 4, x1 - x0, 16, 6); ctx.fill(); ctx.restore(); }
    // takik dekade + titik tahun buku
    ctx.fillStyle = "rgba(255,230,200,0.5)"; for (let y = 1970; y <= 2020; y += 10) ctx.fillRect(YX(y) - 1.5, PLK.y + 6, 3, 14);
    // kertas 1962
    paperIcon(ctx, 146, PLK.y);
    // jilid 1–3
    TLB.forEach((B, i) => spine(ctx, B.x - BW / 2, PLK.y, BW, BH, BOOKC[i], B.k, t, {}));
    // edisi baru, fasikel
    miniStack(ctx, YX(1997.5), PLK.y, ramp(l, pEd, 0.45));
    fascicles(ctx, YX(2005), YX(2009), PLK.y, ramp(l, pFa, 0.7), t);
    // bayangan jilid 4 + bendera target 2003
    const xT = YX(2003), aG = ramp(l, T.j4, 0.35) * (1 - ramp(l, pTg, 0.7)), strike = ramp(l, pTg, 0.4);
    ghostSlot(ctx, xT + 6, PLK.y, 64, BIG, t, aG, "4", P.warm, 3);
    // tali tipis dari pil tahun ke berkas cahaya penanda (di dunia, supaya tertutup bendera)
    const mvA = yr == null ? 0 : Math.max(ramp(l, T.ken - 0.15, 0.3) * (1 - ramp(l, T.d11 - 0.5, 0.3)), ramp(l, T.e4B - 0.75, 0.3) * (1 - ramp(l, T.d22 - 0.55, 0.3)));
    if (mvA > 0.01) { const x = YX(yr), red = ramp(l, pTg - 0.08, 0.1) * (1 - ramp(l, pTg + 0.5, 0.15)); ctx.save(); ctx.globalAlpha *= mvA; ctx.strokeStyle = red > 0.5 ? D.hexA(P.red, 0.9) : "rgba(255,226,150,0.75)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, PLK.y - 250); ctx.stroke(); ctx.restore(); }
    const pole = eio(ramp(l, T.mem, 0.6));
    if (pole > 0) {
      const top = lerp(PLK.y, 320, pole), droop = 0.16 * eio(strike);
      ctx.strokeStyle = "#C9A27A"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(xT, PLK.y - 2); ctx.lineTo(xT, top); ctx.stroke();
      ctx.fillStyle = "#E9C08B"; ctx.beginPath(); ctx.arc(xT, top - 4, 9, 0, TAU); ctx.fill();
      const fl = ramp(l, T.mem + 0.55, 0.4);
      if (fl > 0) { ctx.save(); ctx.translate(xT, top + 6); ctx.rotate(droop); ctx.globalAlpha *= fl; const wv = Math.sin(t * 3) * 4;
        const fw = 356, fh = 78; ctx.fillStyle = "rgba(10,18,52,0.92)"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-fw, wv); ctx.lineTo(-fw + 18, fh / 2 + wv * 0.5); ctx.lineTo(-fw, fh + wv); ctx.lineTo(0, fh); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = D.hexA(P.amber, 0.9); ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
    }
    // 4A & 4B: melayang saat disebut, mendarat saat penanda tiba
    const bookFall = (x, col, label, tShow, tLand, k) => {
      const a = ramp(l, tShow, 0.3); if (a <= 0.01) return;
      const land = eout(ramp(l, tLand - 0.25, 0.3)), bob = Math.sin(t * 2.4 + k) * 6 * (1 - land), sq = l > tLand ? Math.exp(-(l - tLand) * 8) * Math.sin((l - tLand) * 30) * 0.05 : 0;
      const off = lerp(-110, 0, land) + bob;
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, PLK.y + off); ctx.scale(1 + sq, 1 - sq); ctx.translate(-x, -PLK.y);
      if (land < 1) shadowE(ctx, x, PLK.y + 2, 40 * (0.5 + 0.5 * land), 6, 0.25);
      spine(ctx, x - 32, PLK.y, 64, BIG, col, label, t, { lit: 0.6 * (1 - ramp(l, tLand + 0.4, 1.2)) + 0.25 });
      ctx.restore();
    };
    // busur putus-putus: dari target 2003 ke 4A (meleset)
    const arc = ramp(l, land4A + 0.1, 0.8);
    if (arc > 0) { ctx.save(); ctx.strokeStyle = D.hexA(P.pink, 0.85); ctx.lineWidth = 5; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 20; ctx.beginPath();
      const x0 = xT + 6, x1 = YX(2011) - 6, ym = PLK.y - BIG - 70; for (let i = 0; i <= 30 * arc; i++) { const u = i / 30, x = lerp(x0, x1, u), y = PLK.y - BIG - 16 - Math.sin(u * Math.PI) * 60; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
      if (arc >= 1) { ctx.fillStyle = P.pink; ctx.beginPath(); ctx.moveTo(x1 + 4, PLK.y - BIG - 12); ctx.lineTo(x1 - 16, PLK.y - BIG - 30); ctx.lineTo(x1 - 18, PLK.y - BIG - 4); ctx.closePath(); ctx.fill(); } ctx.restore(); }
    bookFall(YX(2011), BOOKC[3], "4A", T.e4A, land4A, 1);
    bookFall(YX(2022), BOOKC[4], "4B", T.e4B, land4B, 2);
    // fasikel 7 (2025) — bukan buku utuh
    const aF7 = ramp(l, T.beb, 0.4);
    if (aF7 > 0) { const x = YX(2025), h = 118 * eout(aF7); ctx.save(); ctx.fillStyle = "#F3E3BC"; RR(ctx, x - 10, PLK.y - h, 20, h, 3); ctx.fill(); ctx.fillStyle = BOOKC[3]; ctx.fillRect(x - 10, PLK.y - h + 10, 20, 6); addLight(ctx, x, PLK.y - h / 2, 70, P.warm, 0.3 * aF7); ctx.restore(); }
    // jilid yang masih dikerjakan
    FUT.forEach((k, i) => ghostSlot(ctx, FX(i), PLK.y, FW, i < 2 ? BIG : BH, t, ramp(l, T.beb + 0.25 + i * 0.22, 0.35), k, P.warm, i));
    // garis "kini" (2026)
    const aNow = ramp(l, pNow - 0.1, 0.4);
    if (aNow > 0) { ctx.save(); ctx.globalAlpha *= aNow; ctx.strokeStyle = D.hexA(P.teal, 0.9); ctx.lineWidth = 4; ctx.setLineDash([10, 8]); const ly = lerp(PLK.y + 30, PLK.y - 200, eio(aNow)); ctx.beginPath(); ctx.moveTo(YX(2026), PLK.y + 196); ctx.lineTo(YX(2026), ly); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    // penanda waktu berjalan
    if (yr != null) { const x = YX(yr), a = 0.85; ctx.save(); ctx.globalCompositeOperation = "screen";
      const gr = ctx.createLinearGradient(0, PLK.y - 250, 0, PLK.y + 10); gr.addColorStop(0, "rgba(255,226,150,0)"); gr.addColorStop(1, `rgba(255,226,150,${0.55 * a})`);
      ctx.fillStyle = gr; ctx.fillRect(x - 5, PLK.y - 250, 10, 260); ctx.restore(); D.glow(ctx, x, PLK.y + 6, 46, P.warm, 0.9 * a);
      ctx.fillStyle = "#FFF3D2"; ctx.beginPath(); ctx.arc(x, PLK.y + 8, 9, 0, TAU); ctx.fill(); }
    // Bip di atas papan
    bip2(ctx, l, t, T, pTg);
    dust(ctx, t, 0.5);
    ctx.restore();
    D.post(cx => {
      const S_ = (x, y) => toS(c, x, y);
      // tahun di bawah papan (baris 1 dan 2), masing-masing dengan garis penghubung ke bukunya sendiri
      const yrs = [["1962", 150, 2], ["1968", 236, 1], ["1969", 300, 2], ["1973", 364, 1]];
      yrs.forEach(([s, x, row], i) => { const a = ramp(l, 0.15 + i * 0.12, 0.4); if (a <= 0) return; const yy = row === 1 ? 716 : 782;
        cx.save(); cx.globalAlpha = a; const [bx, by] = S_(x, PLK.y + 28), [lx, ly] = S_(x, yy - 38);
        cx.strokeStyle = D.hexA(P.ink, 0.6); cx.lineWidth = 3; cx.beginPath(); cx.moveTo(bx, by); cx.lineTo(lx, ly); cx.stroke();
        cx.fillStyle = P.ink; cx.beginPath(); cx.arc(bx, by, 5, 0, TAU); cx.fill();
        const [sx, sy] = S_(x, yy); D.txt(cx, s, sx, sy, 44, { align: "center", weight: 800, color: P.ink }); cx.restore(); });
      // teks bendera target
      const fl = ramp(l, T.mem + 0.55, 0.4);
      if (fl > 0.01) { const xT = YX(2003), droop = 0.16 * eio(ramp(l, pTg, 0.4)); cx.save(); const [fx, fy] = S_(xT, 326); cx.translate(fx, fy); cx.scale(c.z, c.z); cx.rotate(droop); cx.globalAlpha = fl;
        const tx = -172, ty = 52; cx.font = `800 46px ${FONT}`; const w1 = cx.measureText("target:").width; const d3 = ramp(l, T.d03 - 0.05, 0.3);
        cx.font = `800 46px ${FONT}`; const w2 = cx.measureText(" 2003").width, x0 = tx - (w1 + w2 * d3) / 2;
        D.txt(cx, "target:", x0, ty, 46, { weight: 800, color: P.ink });
        if (d3 > 0) { cx.save(); cx.globalAlpha *= d3; D.txt(cx, " 2003", x0 + w1 + 8, ty + (1 - eout(d3)) * 12, 46, { weight: 900, color: P.amber }); cx.restore(); }
        const st = ramp(l, pTg, 0.4); if (st > 0) { cx.strokeStyle = P.red; cx.lineWidth = 8; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(x0 - 10, ty - 14); cx.lineTo(x0 - 10 + (w1 + w2 + 28) * eio(st), ty - 20); cx.stroke(); }
        cx.restore(); }
      // celah: TeX, edisi baru, fasikel (pil sekunder: tidak dibacakan, jadi tampil tenang)
      const gp = (t0) => ramp(l, t0 + 0.15, 0.35);
      const g1 = gp(pTeX), g2 = gp(pEd), g3 = gp(pFa);
      leader(cx, ...S_((YX(1977) + YX(1986)) / 2, PLK.y - 2), ...S_(468, 430), g1, P.teal); twoLine(cx, "TeX", "1977–1986", ...S_(452, 372), g1, 1, P.teal, true);
      leader(cx, ...S_(YX(1997.5), PLK.y + 24), ...S_(800, 754), g2, P.ink2); twoLine(cx, "edisi baru jilid 1–3", "1997–1998", ...S_(760, 812), g2, 1, P.ink2, true);
      elbow(cx, ...S_(1030, PLK.y + 24), ...S_(1030, 830), S_(1268, 830)[0], g3, P.ink2); twoLine(cx, "fasikel", "2005–2009", ...S_(1268, 830), g3, 1, P.ink2, true);
      // tahun 4A, 4B
      const p11 = pop(l, T.d11), p22 = pop(l, T.d22);
      tag(cx, "2011", ...S_(YX(2011), 704), p11.a, { sp: p11.sp, col: BOOKC[3], size: 46 });
      tag(cx, "2022", ...S_(YX(2022) - 12, 704), p22.a, { sp: p22.sp, col: BOOKC[4], size: 46 });
      // tahun pada penanda waktu yang berjalan (memudar saat berhenti di 2011/2022; merah saat 2003 lewat tanpa buku)
      if (yr != null) {
        const mv = Math.max(ramp(l, T.ken - 0.15, 0.3) * (1 - ramp(l, T.d11 - 0.5, 0.3)), ramp(l, T.e4B - 0.75, 0.3) * (1 - ramp(l, T.d22 - 0.55, 0.3)));
        if (mv > 0.01) {
          const red = ramp(l, pTg - 0.08, 0.1) * (1 - ramp(l, pTg + 0.5, 0.15)), [px, py] = S_(YX(yr), 262);
          cx.save(); cx.globalAlpha = mv;
          cx.translate(px, py); const k = 1 + 0.12 * red; cx.scale(k, k);
          D.label(cx, String(Math.round(yr)), 0, 0, { size: 48, col: red > 0.5 ? P.red : P.warm, fill: red > 0.5 ? "rgba(120,22,44,0.95)" : "rgba(10,18,52,0.9)" });
          cx.restore();
        }
      }
      // fasikel 7 + kini + masih dikerjakan
      const pf = pop(l, T.beb + 0.1); leader(cx, ...S_(YX(2025), PLK.y - 124), ...S_(1352, 392), pf.a, P.warm); twoLine(cx, "Fasikel 7", "(awal 4C)", ...S_(1352, 330), pf.a, pf.sp, P.warm);
      const pn = pop(l, pNow); tag(cx, "kini (2026)", ...S_(1612, 836), pn.a, { sp: pn.sp, col: P.teal, size: 46 });
      const pm = pop(l, T.masih); twoLine(cx, "masih", "dikerjakan", ...S_(1690, 330), pm.a, pm.sp, P.warm);
    });
  };
  function bip2(ctx, l, t, T, pTg) {
    const { x, y, s } = BIP2; let o;
    if (l < T.mem) o = { pose: "diam", t, mood: "happy", look: [-0.9, 0.1] };
    else if (l < T.ken - 0.1) o = { pose: "tunjuk", t, target: [YX(2003) - 120, 350], mood: "think" };
    else if (l < pTg) o = { pose: "diam", t, mood: "think", look: [-0.6 + 0.8 * clamp((l - T.ken) / 1.6), 0.4] };
    else if (l < pTg + 1.0) o = { pose: "kaget", t, k: l - pTg, mood: "wow" };
    else if (l < T.beb) o = { pose: "diam", t, mood: "happy", look: [1, -0.2] };
    else o = { pose: "tunjuk", t, target: [FX(2) + FW / 2, PLK.y - 120], mood: "think" };
    KB.draw(ctx, x, y, s, o);
  }

  K.SCENES.d04_b5 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d04_b5.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b5 = TL => {
    const b1 = TL.beats.find(x => x.id === "b5_1"), b2 = TL.beats.find(x => x.id === "b5_2"); const out = [];
    if (b1) {
      const T = T1(b1);
      out.push(K.sfxAt(TL, "b5_1", "ketiga", 0.0, "shimmer", 0.4), K.sfxAt(TL, "b5_1", "Knuth", 0.15, "whoosh", 0.45), K.sfxAt(TL, "b5_1", "jelek", 0.0, "pop", 0.5),
        K.sfxAt(TL, "b5_1", "berhenti", 0.05, "clack", 0.55), K.sfxAt(TL, "b5_1", "membuat", -0.2, "pop", 0.5), K.sfxAt(TL, "b5_1", "TeX.", 0.0, "shimmer", 0.55),
        [+(b1.start + tearT(T, 1)).toFixed(3), "clack", 0.5], K.sfxAt(TL, "b5_1", "sepuluh", 0.0, "pop", 0.6));
    }
    if (b2) {
      const T = T2(b2);
      out.push(K.sfxAt(TL, "b5_2", "memperkirakan", 0.0, "whoosh", 0.4), K.sfxAt(TL, "b5_2", "dua ribu tiga.", 0.0, "pop", 0.5), K.sfxAt(TL, "b5_2", "Kenyataannya,", -0.1, "riser", 0.4),
        [+(b2.start + passT(T, 2002.97)).toFixed(3), "clack", 0.6], [+(b2.start + T.d11 - 0.2).toFixed(3), "clack", 0.4], [+(b2.start + T.d22 - 0.25).toFixed(3), "clack", 0.5],
        K.sfxAt(TL, "b5_2", "masih", 0.0, "shimmer", 0.5));
    }
    return out.filter(Boolean);
  };
})(typeof window !== "undefined" ? window : globalThis);
