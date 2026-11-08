/* D03 bab 0 — Pembuka (b0_1, b0_1a, b0_2, b0_3, b0_4, b0_5).
   Satu dunia yang terus dibawa: rumah Bu Rina (kamar Bu Rina | dinding | kamar anak) dengan kamera sendiri,
   lalu "portal" lewat layar komputer ke studio Bip (gelombang suara narator -> angka -> judul -> pertanyaan bab). */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KO = KIT.orang, KY = KIT.layar, KB = KIT.bipkit, P = D.P;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, sm, eio, eout, spring } = D;
  const FONT = K.FONT;
  const AX = 1920 + (KL.WALL_W || 130);            // x dunia kamar anak
  const WALLX = 1920 + (KL.WALL_W || 130) / 2;      // pusat dinding
  const PROF_IBU = Object.assign({}, KY.SUARA.ibu, { seed: 11 }), PROF_ANAK = Object.assign({}, KY.SUARA.anak, { seed: 23 });
  const TITLE = "Suara Ibumu Bisa Dipalsukan dalam 3 Detik";

  // ---------- pembantu ----------
  const ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  const camT = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); };
  const toS = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + HH / 2];
  function drift(c, t, a = 1) { return { x: c.x + Math.sin(t * 0.31) * 6 * a / c.z, y: c.y + Math.sin(t * 0.23 + 1) * 4 * a / c.z, z: c.z * (1 + 0.004 * Math.sin(t * 0.2) * a) }; }
  // aktivitas bicara 0..1 pada waktu beat l (dari waktu kata)
  function act(b, l) { let v = 0; (b.words || []).forEach(([, s, e]) => { v = Math.max(v, clamp(Math.min((l - s + 0.06) / 0.08, (e + 0.06 - l) / 0.1))); }); return v; }
  const beat = (TL, id) => TL.beats.find(x => x.id === id);
  function wordT(b, i) { return b.words && b.words[i] ? b.words[i][1] : D.lead(b); }
  function txt(ctx, s, x, y, size, opt = {}) { D.txt(ctx, s, x, y, size, opt); }

  // ---------- rumah: kamar Bu Rina | dinding | kamar anak (koordinat dunia) ----------
  // o: lamp, pg (cahaya HP Bu Rina), ring, phone (HP di nakas), ibu(ctx, anchors), anak(ctx, anchors), anakPg
  function rumah(ctx, t, c, o = {}) {
    const vx0 = c.x - W / 2 / c.z, vx1 = c.x + W / 2 / c.z; let A = null, B = null;
    if (vx0 < 1920) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1920, 1080); ctx.clip();
      A = KL.kamar(ctx, t, { lamp: o.lamp == null ? 0 : o.lamp, phoneGlow: o.pg || 0, ring: o.ring || 0, phone: o.phone, jam: 23, near: false }).anchors;
      if (o.ibu) o.ibu(ctx, A); KL.depan(ctx, "kamar", t, {}); ctx.restore(); }
    if (vx1 > 1920 && vx0 < AX) KL.dinding(ctx, WALLX, t, { floorY: 800 });
    if (vx1 > AX) { ctx.save(); ctx.translate(AX, 0); ctx.beginPath(); ctx.rect(0, 0, 1920, 1080); ctx.clip();
      B = KL.kamarAnak(ctx, t, { guling: false, near: false, lamp: 0, phoneGlow: o.anakPg || 0 }).anchors;
      if (o.anak) o.anak(ctx, B); KL.depan(ctx, "kamarAnak", t, {}); ctx.restore(); }
    // debu melayang di cahaya bulan (gerak sekunder)
    const r = D.rng(91); ctx.save(); ctx.fillStyle = "#DCE6FF";
    for (let i = 0; i < 70; i++) { const bx = r() * 3970, by = 150 + r() * 650, sp = 6 + r() * 10, ph = r() * TAU, rad = 1.6 + r() * 2.4;
      const x = bx + Math.sin(t * 0.3 + ph) * 30, y = by - ((t * sp + ph * 40) % 120) + 60; if (x < vx0 - 10 || x > vx1 + 10) continue;
      ctx.globalAlpha = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 1.3 + ph)); ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill(); }
    ctx.restore();
    return { A, B };
  }
  // Bu Rina tidur di ranjang kamar (kepala di bantal, tubuh di bawah selimut)
  function ibuTidur(ctx, A, t, a = 1, gerak = 0) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    const px = A.pillow.x, py = A.pillow.y, br = Math.sin(t * 1.4) * 2;
    ctx.fillStyle = "#E39A55"; ctx.beginPath(); ctx.ellipse(px + 190, py + 14 + br * 0.3, 170, 34, 0, 0, TAU); ctx.fill();
    KO.kepala(ctx, px + 18, py - 30 + gerak * 3 * Math.sin(t * 9), 38, Object.assign(KO.preset("buRina"), { face: gerak > 0.3 ? "ngantuk" : "tidur", bahu: false, tilt: -0.75, t }));
    KL.selimut(ctx, "kamar", t, { sampai: 0.95 });
    ctx.restore();
  }
  // anak tidur memeluk guling di kamar anak (koordinat lokal kamar anak)
  function anakTidur(ctx, B, t) {
    const px = B.pillow.x, py = B.pillow.y, br = Math.sin(t * 1.25 + 2) * 2;
    ctx.fillStyle = "#2FB5A6"; ctx.beginPath(); ctx.ellipse(px + 180, py + 16 + br * 0.3, 160, 32, 0, 0, TAU); ctx.fill();
    KO.kepala(ctx, px + 16, py - 28 + br * 0.4, 36, Object.assign(KO.preset("anakRina"), { face: "tidur", bahu: false, tilt: -0.72, t }));
    KL.selimut(ctx, "kamarAnak", t, { sampai: 0.82, guling: true });
    // tangan di atas guling
    ctx.fillStyle = KO.SKIN[2]; ctx.beginPath(); ctx.arc(B.guling.x - 30, B.guling.y - 14 + br * 0.3, 15, 0, TAU); ctx.fill();
    // zzz digambar sebagai garis (bukan huruf)
    for (let i = 0; i < 3; i++) { const u = (t * 0.35 + i / 3) % 1, s = 16 + u * 18, x = px + 40 + u * 70, y = py - 90 - u * 110;
      ctx.save(); ctx.globalAlpha *= Math.sin(u * Math.PI) * 0.9; ctx.lineJoin = "round"; ctx.lineCap = "round";
      const zz = () => { ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x + s / 2, y - s / 2); ctx.lineTo(x - s / 2, y + s / 2); ctx.lineTo(x + s / 2, y + s / 2); ctx.stroke(); };
      ctx.strokeStyle = "#1B2457"; ctx.lineWidth = 12; zz(); ctx.strokeStyle = "#E8EEFF"; ctx.lineWidth = 6; zz(); ctx.restore(); }
  }
  // Bu Rina duduk di tepi ranjang (o: pose, blend, face, layar, keringat, airmata)
  // layar HP di tangan (tanpa huruf: ikon saja)
  function layarHP(c, w, h, t, masuk) {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, masuk ? "#5B6BE0" : "#3E86C9"); g.addColorStop(1, masuk ? "#8A5FD6" : "#4B55B8"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    const ph = (t * 0.8) % 1; c.strokeStyle = D.hexA("#FFFFFF", 0.4 * (1 - ph)); c.lineWidth = w * 0.03; c.beginPath(); c.arc(w / 2, h * 0.3, w * (0.2 + 0.15 * ph), 0, TAU); c.stroke();
    KY.avatar(c, w / 2, h * 0.3, w * 0.2, "#7C8BEA", {});
    if (masuk) { [[0.28, "#FF5A5F"], [0.72, "#3FCB7E"]].forEach(([fx, col]) => { c.fillStyle = col; c.beginPath(); c.arc(w * fx, h * 0.8, w * 0.13, 0, TAU); c.fill(); }); }
    else { for (let i = 0; i < 7; i++) { const v = 0.3 + 0.7 * Math.abs(Math.sin(t * 6 + i * 1.3)); c.fillStyle = P.teal; c.fillRect(w * (0.18 + i * 0.1), h * 0.58 - v * h * 0.05, w * 0.05, v * h * 0.1); }
      c.fillStyle = "#FF5A5F"; c.beginPath(); c.arc(w / 2, h * 0.84, w * 0.13, 0, TAU); c.fill(); }
  }
  const LAYAR_BICARA = (c, w, h, t) => layarHP(c, w, h, t, false), LAYAR_MASUK = (c, w, h, t) => layarHP(c, w, h, t, true);
  const IBU_X = 1280;
  function ibuDuduk(ctx, A, t, o = {}) {   // berdiri di depan ranjang sambil menelepon
    const op = Object.assign(KO.preset("buRina"), { pose: "telepon", t, layar: LAYAR_BICARA, glow: true }, o);
    return KO.draw(ctx, IBU_X, 806, 420, op);
  }
  // kepala Bu Rina berdiri (dari anchors orang.draw, tetap supaya kamera deterministik)
  const IBU_HEAD = [IBU_X + 5, 443];

  // ---------- gelembung dialog (kata muncul saat diucapkan) ----------
  const BUB = [[0, 3], [3, 7], [7, 10], [10, 14]], HOT = /kecelakaan|transfer|sekarang|jangan|bilang/i;
  function bubbleLayout(ctx, b, size, maxW) {
    const toks = b.text.split(/\s+/); ctx.font = `800 ${size}px ${FONT}`; const sp = ctx.measureText(" ").width;
    return BUB.map(([i0, i1]) => { const lines = [[]]; let x = 0;
      for (let i = i0; i < i1; i++) { const w = ctx.measureText(toks[i]).width; if (x > 0 && x + w > maxW) { lines.push([]); x = 0; } lines[lines.length - 1].push({ i, s: toks[i], x, w }); x += w + sp; }
      const wmax = Math.max(...lines.map(L => { const e = L[L.length - 1]; return e.x + e.w; }));
      return { i0, i1, lines, w: wmax, t0: wordT(b, i0) - 0.12 }; });
  }
  function bubbles(ctx, b, l, a = 1) {
    if (a <= 0.01) return; const size = 58, lh = 72, pad = 30, gap = 22, maxW = 700, X0 = 1050, YB = 860;
    const L = bubbleLayout(ctx, b, size, maxW); const hs = L.map(B => B.lines.length * lh + pad * 1.4);
    L.forEach((B, k) => {
      const e = eout(ramp(l, B.t0, 0.35)); if (e <= 0) return;
      let yb = YB; for (let j = k + 1; j < L.length; j++) yb -= (hs[j] + gap) * eout(ramp(l, L[j].t0, 0.4));
      const h = hs[k], y = yb - h, fadeTop = clamp((y - 150) / 70);
      const s = lerp(0.85, 1, spring(ramp(l, B.t0, 1) * 1.0, 10, 0.5)), al = a * e * fadeTop; if (al <= 0.01) return;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(X0, yb); ctx.scale(s, s); ctx.translate(-X0, -yb);
      const bw = B.w + pad * 2;
      ctx.shadowColor = "rgba(8,12,40,0.45)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#F7F9FF"; K.helpers.rr(ctx, X0, y, bw, h, 30); ctx.fill(); ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.beginPath(); ctx.moveTo(X0 + 4, yb - 46); ctx.lineTo(X0 - 26, yb - 18); ctx.lineTo(X0 + 34, yb - 22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.teal; K.helpers.rr(ctx, X0 + 10, y + 16, 9, h - 32, 4.5); ctx.fill();
      B.lines.forEach((Ln, r) => Ln.forEach(wd => {
        const ws = b.words[wd.i][1], wa = clamp((l - ws + 0.08) / 0.16); if (wa <= 0) return;
        ctx.save(); ctx.globalAlpha = al * wa; ctx.font = `800 ${size}px ${FONT}`; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = HOT.test(wd.s) ? "#D8344F" : "#1B2150"; ctx.fillText(wd.s, X0 + pad + 6 + wd.x, y + pad * 0.7 + lh * (r + 0.78) + (1 - wa) * 10); ctx.restore(); }));
      ctx.restore();
    });
  }

  // ---------- kartu perbandingan (b0_2): "di telepon" vs "anaknya" ----------
  function banding(ctx, b, l, t, a = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a;
    const X0 = 1010, X1 = 1820, Y0 = 170, Y1 = 880, cA = 1225, cB = 1610, cM = 1418;
    ctx.fillStyle = "rgba(14,22,62,0.86)"; K.helpers.rr(ctx, X0, Y0, X1 - X0, Y1 - Y0, 36); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.lineWidth = 2; ctx.stroke();
    // ekor gelembung pikiran ke arah kepala Bu Rina
    [[980, 300, 18], [945, 338, 11]].forEach(([x, y, r]) => { ctx.fillStyle = "rgba(14,22,62,0.86)"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
    // kepala kolom
    ctx.fillStyle = P.teal; ctx.beginPath(); ctx.arc(cA - 120, 252, 34, 0, TAU); ctx.fill(); KY.ikon(ctx, "telepon", cA - 120, 252, 44, "#1B2150");
    txt(ctx, "Di telepon", cA + 30, 268, 44, { align: "center", weight: 800 });
    KO.kepala(ctx, cB - 110, 250, 40, Object.assign(KO.preset("anakRina"), { face: "senang", t }));
    txt(ctx, "Anaknya", cB + 30, 268, 44, { align: "center", weight: 800 });
    ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(X0 + 40, 316, X1 - X0 - 80, 3);
    const rows = [
      { y: 420, t0: D.at(b, "Suaranya"), t1: D.atEnd(b, "Suaranya persis.") },
      { y: 590, t0: D.at(b, "Cara memanggilnya"), t1: D.atEnd(b, "Cara memanggilnya persis.") },
      { y: 770, t0: D.at(b, "isak tangisnya"), t1: D.atEnd(b, "terdengar sama.") },
    ];
    rows.forEach((R, i) => {
      const e = eout(ramp(l, R.t0 - 0.1, 0.45)); if (e <= 0) return;
      const m = eio(ramp(l, R.t1 - 0.35, 0.5));       // kedua sisi bergeser mendekat dan cocok
      const dx = (1 - m) * 40;
      ctx.save(); ctx.globalAlpha *= e;
      [[cA - 10 - dx, -1], [cB + 10 + dx, 1]].forEach(([cx, sd], j) => {
        if (i === 0) KY.gelombang(ctx, cx - 160, R.y - 55, 320, 110, { t, mode: "garis", seed: 23, col: P.teal, col2: "#9FF0E6", lw: 6, speed: 1.2 });
        else if (i === 1) { ctx.fillStyle = "#F7F9FF"; K.helpers.rr(ctx, cx - 120, R.y - 50, 240, 96, 30); ctx.fill(); txt(ctx, "“Bu…”", cx, R.y + 20, 58, { align: "center", weight: 900, color: "#1B2150" }); }
        else { // isak: gelombang bergetar pendek + tetes air mata
          KY.gelombang(ctx, cx - 165, R.y - 60, 260, 120, { t, mode: "garis", seed: 31, col: "#9FD8FF", col2: P.teal, lw: 6, speed: 1.6, amp: (u, tt) => 0.25 + 0.75 * Math.pow(Math.abs(Math.sin(u * TAU * 1.2 - tt * 4)), 2) });
          const dy = ((t * 0.7 + j * 0.4) % 1) * 36, dx = cx + 128, dyy = R.y - 22 + dy; ctx.save(); ctx.globalAlpha *= Math.sin(((t * 0.7 + j * 0.4) % 1) * Math.PI) * 0.6 + 0.4;
          ctx.fillStyle = "#9FE6FF"; ctx.beginPath(); ctx.moveTo(dx, dyy - 34); ctx.quadraticCurveTo(dx + 28, dyy + 6, dx, dyy + 16); ctx.quadraticCurveTo(dx - 28, dyy + 6, dx, dyy - 34); ctx.fill();
          ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(dx - 7, dyy + 2, 5, 0, TAU); ctx.fill(); ctx.restore(); }
      });
      // tanda sama -> centang hijau
      const ck = spring(ramp(l, R.t1 - 0.05, 1), 11, 0.5), r0 = 34;
      if (ck <= 0.01) { txt(ctx, "=", cM, R.y + 18, 60, { align: "center", weight: 900, color: P.ink2 }); }
      else { ctx.save(); ctx.translate(cM, R.y); ctx.scale(ck, ck); ctx.fillStyle = P.green; ctx.beginPath(); ctx.arc(0, 0, r0, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 1); ctx.lineTo(-4, 12); ctx.lineTo(16, -12); ctx.stroke(); ctx.restore();
        D.glow(ctx, cM, R.y, 90, P.green, 0.35 * (1 - ramp(l, R.t1 + 0.2, 0.8))); }
      ctx.restore();
    });
    ctx.restore();
  }

  // ---------- luar rumah (penampang): langit, atap, tanah ----------
  function luar(ctx, t, c) {
    D.bg(ctx, t, { top: "#2C3F8E", bot: "#5A72C2", stars: 0.7 });
    D.glow(ctx, 1640, 150, 260, "#CFE0FF", 0.25); ctx.fillStyle = "#F4F1FF"; ctx.beginPath(); ctx.arc(1640, 150, 44, 0, TAU); ctx.fill();
    ctx.fillStyle = "#33489A"; ctx.beginPath(); ctx.arc(1662, 138, 40, 0, TAU); ctx.fill();
    ctx.save(); camT(ctx, c);
    // tanah & pohon siluet
    ctx.fillStyle = "#3A4C8C"; ctx.fillRect(-1600, 1080, 7200, 900); ctx.fillStyle = "#4E62A8"; ctx.fillRect(-1600, 1080, 7200, 40);
    [[-500, 0.9], [-1100, 1.2], [4500, 1.0], [5100, 1.3]].forEach(([x, s], i) => { const sw = Math.sin(t * 0.8 + i) * 8;
      ctx.fillStyle = "#2E3F7E"; ctx.fillRect(x - 18 * s, 1080 - 420 * s, 36 * s, 420 * s); ctx.beginPath(); ctx.arc(x + sw, 1080 - 470 * s, 190 * s, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x - 120 * s + sw, 1080 - 380 * s, 130 * s, 0, TAU); ctx.fill(); });
    // dinding luar + atap genteng
    ctx.fillStyle = "#C9C3E6"; ctx.fillRect(-70, -30, 70, 1110); ctx.fillRect(3970, -30, 70, 1110);
    const x0 = -200, x1 = 4170, yb = -30, yp = -560;
    ctx.fillStyle = "#B8573F"; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo((x0 + x1) / 2, yp); ctx.lineTo(x1, yb); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = "rgba(90,30,30,0.45)"; ctx.lineWidth = 10; for (let y = yp + 40; y < yb; y += 44) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); } ctx.restore();
    ctx.fillStyle = "#8E3F33"; ctx.fillRect(x0 - 10, yb - 4, x1 - x0 + 20, 34);
    ctx.fillStyle = "#3A2F5E"; ctx.beginPath(); ctx.moveTo(-10, yb + 30); ctx.lineTo((x0 + x1) / 2, yp + 130); ctx.lineTo(3980, yb + 30); ctx.closePath(); ctx.fill();   // loteng gelap
    ctx.restore();
  }
  // monitor komputer generik (koordinat layar); kembalikan rect layar
  function monitor(ctx, cx, cy, w, t, a = 1) {
    const h = w * 9 / 16, x = cx - w / 2, y = cy - h / 2, bz = w * 0.05; ctx.save(); ctx.globalAlpha *= a;
    D.glow(ctx, cx, cy, w * 0.9, P.teal, 0.25);
    ctx.fillStyle = "#2B3170"; K.helpers.rr(ctx, x - bz, y - bz, w + 2 * bz, h + 2 * bz, bz * 0.8); ctx.fill();
    ctx.fillStyle = "#3A4290"; ctx.fillRect(cx - w * 0.06, y + h + bz, w * 0.12, w * 0.12); K.helpers.rr(ctx, cx - w * 0.22, y + h + bz + w * 0.11, w * 0.44, w * 0.04, w * 0.02); ctx.fill();
    ctx.restore(); return { x, y, w, h };
  }
  function layarKomputer(ctx, R, t, l) {   // isi layar monitor sebelum portal: gelombang anak yang sedang "dibuat"
    ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    const g = ctx.createLinearGradient(R.x, R.y, R.x, R.y + R.h); g.addColorStop(0, "#14204F"); g.addColorStop(1, "#22306A"); ctx.fillStyle = g; ctx.fillRect(R.x, R.y, R.w, R.h);
    KY.gelombang(ctx, R.x + R.w * 0.08, R.y + R.h * 0.2, R.w * 0.84, R.h * 0.6, { t, mode: "batang", seed: 23, col: P.teal, col2: P.pink, n: 18 });
    ctx.restore();
  }

  // ---------- studio Bip (koordinat 1920x1080) ----------
  const PAN = { x: 690, y: 300, w: 1110, h: 330 };
  function narratorPanel(ctx, b, l, t, o = {}) {   // panel gelombang suara narator -> angka
    const a = o.a == null ? 1 : o.a; if (a <= 0.01) return;
    const R = o.R || PAN; ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = "rgba(14,22,62,0.82)"; K.helpers.rr(ctx, R.x, R.y, R.w, R.h, 30); ctx.fill(); ctx.strokeStyle = D.hexA(P.amber, 0.7); ctx.lineWidth = 3; ctx.stroke();
    const v = o.amp == null ? 0.6 : o.amp, an = clamp(o.angka || 0), ba = 1 - sm(an / 0.55);
    if (ba > 0.01) KY.gelombang(ctx, R.x + 40, R.y + 40, R.w - 80, R.h - 80, { t, mode: "batang", seed: 55, col: P.amber, col2: P.pink, n: 40, amp: u => (0.18 + 0.82 * v) * lerp(0.15, 1, ba), alpha: ba, speed: 0.9 });
    angkaGrid(ctx, R, t, an, 55);
    ctx.restore();
  }
  // deretan angka sampel suara (satu teks per angka, sel lebar tetap, bergulir pelan ke kiri)
  const hn = (a, b, s) => { const x = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453; return x - Math.floor(x); };
  function angkaGrid(ctx, R, t, an, seed) {
    if (an <= 0.02) return; const fs = 48, rows = 3, cell = 206, lh = (R.h - 50) / rows, x0 = R.x + 30, x1 = R.x + R.w - 30;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, R.y + 8, x1 - x0, R.h - 16); ctx.clip();
    ctx.font = `700 ${fs}px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const sc = t * 0.35, k0 = Math.floor(sc), fr = sc - k0, cols = Math.ceil((x1 - x0) / cell) + 2;
    for (let r = 0; r < rows; r++) { const ry = R.y + 25 + lh * (r + 0.5);
      for (let c = 0; c < cols; c++) { const k = k0 + c, px = x0 + (c - fr) * cell + cell * 0.5 - cell * 0.5;
        const uu = clamp((px - x0) / (x1 - x0)), edge = clamp(Math.min(px - x0 - 75, x1 - px - 75) / 50), stag = sm((an - 0.05 - 0.5 * uu) / 0.4), a = edge * stag; if (a <= 0.01) continue;
        const m = Math.round((0.03 + 0.9 * hn(k, r, seed)) * 100), neg = hn(k, r, seed + 3) < 0.5, str = (neg ? "−" : "") + "0," + String(m).padStart(2, "0");
        ctx.globalAlpha = a; ctx.fillStyle = (r + k) % 3 === 0 ? P.pink : P.amber; ctx.fillText(str, px, ry + (1 - stag) * 16); } }
    ctx.restore();
  }
  function studioTab(ctx, s, x, y, col, a = 1) {   // tab label di atas panel
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `800 46px ${FONT}`; const w = ctx.measureText(s).width + 120;
    ctx.fillStyle = col; K.helpers.rr(ctx, x, y - 40, w, 74, 22); ctx.fill();
    KY.ikon(ctx, "speaker", x + 44, y - 3, 46, "#1B2150"); txt(ctx, s, x + 84, y + 14, 46, { weight: 800, color: "#1B2150" }); ctx.restore(); return w;
  }
  function judul(ctx, l, t0, a = 1) {   // judul video, muncul membesar lalu menetap di atas
    const u = l - t0; if (u <= 0 || a <= 0.01) return; const s = spring(u, 9, 0.55);
    ctx.save(); ctx.globalAlpha *= a * clamp(u / 0.25); ctx.translate(W / 2, 150); ctx.scale(lerp(0.7, 1, s), lerp(0.7, 1, s));
    txt(ctx, TITLE, 0, 0, 72, { align: "center", weight: 900, fit: 1640 });
    ctx.fillStyle = P.amber; ctx.fillRect(-120 * clamp(u / 0.6), 26, 240 * clamp(u / 0.6), 8); ctx.restore();
  }
  // mesin peniru (kotak chip bercahaya dengan roda gigi)
  function mesin(ctx, x, y, s, t, a = 1, glow = 0) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
    D.glow(ctx, 0, 0, s * 1.3, P.violet, 0.35 + 0.4 * glow);
    ctx.fillStyle = "#5A4FC8"; for (let i = -2; i <= 2; i++) { ctx.fillRect(i * s * 0.18 - 5, -s * 0.62, 10, s * 0.14); ctx.fillRect(i * s * 0.18 - 5, s * 0.48, 10, s * 0.14); ctx.fillRect(-s * 0.62, i * s * 0.18 - 5, s * 0.14, 10); ctx.fillRect(s * 0.48, i * s * 0.18 - 5, s * 0.14, 10); }
    ctx.fillStyle = "#6E62E8"; K.helpers.rr(ctx, -s * 0.5, -s * 0.5, s, s, s * 0.16); ctx.fill();
    ctx.fillStyle = "#8C82FF"; K.helpers.rr(ctx, -s * 0.38, -s * 0.38, s * 0.76, s * 0.76, s * 0.1); ctx.fill();
    // roda gigi berputar
    [[-0.1, -0.06, 0.2, 1], [0.15, 0.14, 0.13, -1.5]].forEach(([gx, gy, r, sp]) => { ctx.save(); ctx.translate(gx * s, gy * s); ctx.rotate(t * sp); ctx.fillStyle = "#F2F6FF";
      for (let k = 0; k < 8; k++) { ctx.rotate(TAU / 8); ctx.fillRect(-r * s * 0.18, -r * s * 1.25, r * s * 0.36, r * s * 0.4); }
      ctx.beginPath(); ctx.arc(0, 0, r * s, 0, TAU); ctx.fill(); ctx.fillStyle = "#8C82FF"; ctx.beginPath(); ctx.arc(0, 0, r * s * 0.42, 0, TAU); ctx.fill(); ctx.restore(); });
    ctx.restore();
  }
  function panah(ctx, x0, x1, y, t, a = 1, col = P.ink2) {   // panah putus-putus bergerak
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.setLineDash([2, 20]); ctx.lineDashOffset = -t * 40;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 - 24, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - 28, y - 18); ctx.lineTo(x1 - 28, y + 18); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  // kubah pelindung keluarga
  function kubah(ctx, x, y, r, u, t, hit = 0) {
    if (u <= 0.01) return; ctx.save(); const rr = r * eout(u);
    ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.82, 0, Math.PI, TAU); ctx.closePath();
    const g = ctx.createRadialGradient(x, y - rr * 0.3, rr * 0.2, x, y, rr); g.addColorStop(0, D.hexA(P.teal, 0.05)); g.addColorStop(1, D.hexA(P.teal, 0.32 + 0.25 * hit));
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = D.hexA("#9FF0E6", 0.85); ctx.lineWidth = 6; ctx.stroke();
    ctx.globalAlpha *= 0.5; ctx.lineWidth = 3; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.ellipse(x, y, rr * k / 4, rr * 0.82, 0, Math.PI, TAU); ctx.stroke(); }
    ctx.restore();
  }

  // ---------- kamera rumah ----------
  // kepala Bu Rina duduk pada layar = (620, 400) di zoom 2.05
  const ZC = 2.1;
  const camClose = (T = 0) => { const z = ZC * (1 + 0.006 * T); return { x: IBU_HEAD[0] + (W / 2 - 600) / z, y: IBU_HEAD[1] + (HH / 2 - 400) / z, z }; };

  // =============================== ADEGAN ===============================
  const S = {};

  // b0_1: kamar gelap, HP berdering, layar panggilan masuk, Bu Rina mengangkat
  S.b0_1 = function (ctx, b, l, t, TL) {
    const tRing = D.at(b, "berdering"), tNomor = D.at(b, "nomor yang"), tAngkat = D.at(b, "diangkat"), tSuara = D.at(b, "terdengar suara");
    const cc = camClose(0);
    const c = drift(D.path([[0, 1060, 520, 1.13], [tRing - 0.2, 1060, 530, 1.2], [tNomor, 1110, 560, 1.5], [tAngkat - 0.1, 1170, 560, 1.55], [tAngkat + 1.1, cc.x, cc.y, cc.z]], l), t, 0.5);
    const ring = ramp(l, tRing - 0.05, 0.15) * (1 - ramp(l, tAngkat, 0.2)), pg = ramp(l, tRing - 0.05, 0.25);
    const wake = ramp(l, tNomor + 0.5, 0.9);       // tidur -> duduk (tertutup HP besar)
    const blendK = eio(ramp(l, tAngkat + 0.25, 0.8));
    let hand = null;
    ctx.save(); camT(ctx, c);
    rumah(ctx, t, c, { lamp: 0, pg, ring, phone: wake < 0.5, ibu: (cx, A) => {
      ibuTidur(cx, A, t, 1 - wake, ring);
      if (wake > 0.01) { cx.save(); cx.globalAlpha *= wake;
        const an = ibuDuduk(cx, A, t, { pose: "pegangHP", blend: { to: "telepon", k: blendK }, layar: blendK < 0.5 ? LAYAR_MASUK : LAYAR_BICARA, face: l > tSuara ? "bingung" : "ngantuk", dering: l < tAngkat });
        hand = an.phone || an.hand; cx.restore(); }
    } });
    ctx.restore();
    // jam "23.00" saat diucapkan
    const tj = D.at(b, "Pukul sebelas"), ja = ramp(l, tj, 0.3) * (1 - ramp(l, tRing + 0.6, 0.4));
    D.post(cx => { if (ja <= 0.01) return; const [x, y] = toS(c, 1240, 250); cx.save(); cx.globalAlpha = ja; const s = lerp(0.8, 1, spring(l - tj)); cx.translate(x, y + 120); cx.scale(s, s); D.label(cx, "Pukul 23.00", 0, 0, { size: 50, col: P.amber }); cx.restore(); });
    // HP besar: layar panggilan masuk naik dari HP di nakas
    const up = ramp(l, tNomor - 0.35, 0.55), gone = ramp(l, tAngkat + 0.35, 0.3);
    if (up > 0 && gone < 1) D.post(cx => {
      const [sx, sy] = toS(c, 1022, 600), k = eout(up), x = lerp(lerp(sx, 1440, 0.6), 1440, k), y = lerp(lerp(sy, 492, 0.6) + 120, 492, k), s = 1;
      cx.save(); cx.globalAlpha = clamp((up - 0.15) * 1.4) * (1 - gone); cx.translate(x, y + gone * 60); cx.scale(s, s);
      const press = ramp(l, tAngkat - 0.1, 0.2), terima = l > tAngkat + 0.1;
      const a = KY.hp(cx, 0, 0, 830, { t, ringkas: true, teks: 1.25, ring: terima ? 0 : 0.8, screen: (c2, w, h, tt) => terima ? KY.panggilan(c2, w, h, { t: tt, ringkas: true, teks: 1.25, jam: false, durasi: "00:01", tanya: false }) : KY.panggilanMasuk(c2, w, h, { t: tt, ringkas: true, teks: 1.25, jam: false, tanya: false }) });
      if (!terima || press < 1) { const tb = a.out && a.out.terima; if (tb) { const p = a.map(tb.cx + tb.w * 0.32, tb.cy - tb.h * 0.05); const fa = ramp(l, tAngkat - 0.9, 0.3);
        if (fa > 0) { cx.save(); cx.globalAlpha *= fa; KY.jari(cx, p.x + (1 - fa) * 80, p.y + (1 - fa) * 40, 150, { tekan: press, t, kulit: KO.SKIN[3], lengan: "#F2A65A", rot: -0.95 }); cx.restore(); } } }
      cx.restore();
    });
    // gelombang suara dari HP di telinga
    const wa = ramp(l, tSuara - 0.1, 0.4);
    if (wa > 0 && hand) D.post(cx => { const [hx, hy] = toS(c, hand[0], hand[1]); cx.save(); cx.globalAlpha = wa;
      KY.gelombang(cx, hx + 40, hy - 70, 560 * eout(wa), 140, { t, mode: "garis", seed: 23, col: P.teal, col2: "#BFF6EF", lw: 7, amp: () => 0.25 + 0.75 * act(b, l) });
      cx.restore(); });
  };

  // b0_1a: suara anak di telepon (dialog), gelembung kata besar
  S.b0_1a = function (ctx, b, l, t, TL) {
    const c = drift(camClose(l), t, 0.5);
    const panik = l > D.at(b, "kecelakaan") - 0.1; let hand = null;
    ctx.save(); camT(ctx, c);
    rumah(ctx, t, c, { lamp: 0, phone: false, ibu: (cx, A) => { const an = ibuDuduk(cx, A, t, { pose: "telepon", face: panik ? "panik" : "bingung", keringat: panik, layar: LAYAR_BICARA }); hand = an.phone || an.hand; } });
    ctx.restore();
    D.post(cx => {
      if (hand) { const [hx, hy] = toS(c, hand[0], hand[1]); KY.gelombang(cx, hx + 40, hy - 60, 300, 120, { t, mode: "garis", seed: 23, col: P.teal, col2: "#BFF6EF", lw: 7, amp: () => 0.2 + 0.8 * act(b, l) }); }
      bubbles(cx, b, l, 1);
    });
  };

  // b0_2: "persis" — perbandingan suara, panggilan, isak
  S.b0_2 = function (ctx, b, l, t, TL) {
    const pv = beat(TL, "b0_1a"), c = drift(camClose(pv.dur + l), t, 0.5);
    const isak = l > D.at(b, "isak") - 0.2;
    ctx.save(); camT(ctx, c);
    rumah(ctx, t, c, { lamp: 0, phone: false, ibu: (cx, A) => { const an = ibuDuduk(cx, A, t, { pose: "telepon", face: isak ? "sedih" : "panik", keringat: true, airmata: isak, layar: LAYAR_BICARA }); } });
    ctx.restore();
    D.post(cx => { bubbles(cx, pv, pv.dur + l, 1 - ramp(l, 0, 0.25)); banding(cx, b, l, t, ramp(l, 0.15, 0.3)); });
  };

  // b0_3: kamera menembus dinding ke kamar anak yang tidur
  S.b0_3 = function (ctx, b, l, t, TL) {
    const p2 = beat(TL, "b0_2"), pv1 = beat(TL, "b0_1a"), base = pv1.dur + p2.dur, c0 = camClose(base);
    const tA = D.at(b, "anaknya"), tS = D.at(b, "sebelah");
    const c = drift(D.path([[0.15, c0.x, c0.y, c0.z], [0.9, 1700, 560, 1.15], [tA + 0.9, AX + 930, 560, 1.0], [b.dur, AX + 960, 570, 1.07]], l), t);
    ctx.save(); camT(ctx, c);
    rumah(ctx, t, c, { lamp: 0, phone: false, ibu: (cx, A) => { ibuDuduk(cx, A, t, { pose: "telepon", face: "panik", keringat: true, layar: LAYAR_BICARA }); }, anak: (cx, B) => anakTidur(cx, B, t) });
    ctx.restore();
    D.post(cx => {
      banding(cx, p2, p2.dur + l, t, 1 - ramp(l, 0, 0.35));
      const la = ramp(l, tS - 0.3, 0.4); if (la > 0) { const [x, y] = toS(c, AX + 1572, 470); cx.save(); cx.globalAlpha = la; const s = lerp(0.8, 1, spring(l - tS + 0.3)); cx.translate(x, y); cx.scale(s, s); D.label(cx, "HP-nya diam", 0, 0, { size: 46, col: P.teal }); cx.restore(); }
    });
  };

  // b0_4: rumah penampang -> sinyal dari komputer -> portal ke studio -> gelombang narator -> angka -> judul
  const DH = { x: 1985, y: 420, z: 0.42 };            // kamera rumah boneka
  const MON = { cx: 380, cy: 190, w: 330 };
  function studioScene(ctx, b, l, t, o) {   // studio di koordinat layar penuh (dipakai juga di dalam portal)
    KL.studio(ctx, t, { warna: "biru", px: Math.sin(t * 0.2) * 0.3 });
    if (o.bip) o.bip(ctx);
  }
  S.b0_4 = function (ctx, b, l, t, TL) {
    const p3 = beat(TL, "b0_3"), tKom = D.at(b, "dibuat oleh"), tDan = D.at(b, "Dan ada"), tPerlu = D.at(b, "perlu kamu"), tNar = D.at(b, "Suara narator");
    const tKom2b = D.at(b, "pun dibuat") + (b.words[25][1] - b.words[24][1]);
    const c = drift(D.path([[0, AX + 960, 570, 1.07], [1.7, DH.x, DH.y, DH.z]], l), t);
    const zoomU = eio(ramp(l, tDan - 0.35, 1.25));       // portal ke layar komputer
    const inStudio = zoomU >= 0.999;
    const R0 = { x: MON.cx - MON.w / 2, y: MON.cy - MON.w * 9 / 32, w: MON.w, h: MON.w * 9 / 16 }, S1 = W / R0.w;
    const Sz = Math.exp(Math.log(S1) * zoomU), F = [R0.x * S1 / (S1 - 1), R0.y * S1 / (S1 - 1)];
    const bipDraw = cx => {
      const kag = l - (tKom2b + 0.35);
      const wIn = ramp(l, tDan - 0.3, 1.5), bx = lerp(-160, 400, eio(wIn));
      let o = { pose: "diam", t, mood: "happy", wave: l > tPerlu - 0.4 ? 1 : 0, look: [0.2, 0.3] };
      if (wIn < 1) o = { pose: "jalan", t, dir: 1, mood: "happy" };
      else if (l >= tNar - 0.1 && kag < 0) o = { pose: "tunjuk", t, target: [PAN.x + 200, PAN.y + PAN.h / 2], mood: "think" };
      else if (kag >= 0) o = kag < 1.4 ? { pose: "kaget", t, k: kag, mood: "wow" } : { pose: "tunjuk", t, target: [PAN.x + 200, PAN.y + PAN.h / 2], mood: "wow" };
      KB.draw(cx, bx, 640, 250, o);
      // ikon speaker narator berdenyut mengikuti suara (sebelum panel muncul)
      const sa = ramp(l, tDan + 0.2, 0.5) * (1 - ramp(l, tNar - 0.15, 0.3));
      if (sa > 0.01) { const v = act(b, l), X = PAN.x + PAN.w / 2, Y = PAN.y + PAN.h / 2; cx.save(); cx.globalAlpha *= sa;
        for (let k = 0; k < 3; k++) { const ph = (t * 0.9 + k / 3) % 1; cx.strokeStyle = D.hexA(P.amber, (1 - ph) * (0.3 + 0.6 * v)); cx.lineWidth = 8; cx.beginPath(); cx.arc(X, Y, 100 + ph * 160, -0.9, 0.9); cx.stroke(); cx.beginPath(); cx.arc(X, Y, 100 + ph * 160, Math.PI - 0.9, Math.PI + 0.9); cx.stroke(); }
        D.glow(cx, X, Y, 220, P.amber, 0.3 + 0.4 * v); const sc = 1 + 0.06 * v; cx.translate(X, Y); cx.scale(sc, sc);
        cx.fillStyle = P.amber; cx.beginPath(); cx.arc(0, 0, 92, 0, TAU); cx.fill(); KY.ikon(cx, "speaker", 0, 0, 120, "#1B2150"); cx.restore(); }
    };
    if (!inStudio) {
      ctx.save(); ctx.translate(F[0], F[1]); ctx.scale(Sz, Sz); ctx.translate(-F[0], -F[1]);
      luar(ctx, t, c);
      ctx.save(); camT(ctx, c);
      const dimA = ramp(l, 0.1, 1.2);
      rumah(ctx, t, c, { lamp: 0, phone: false, ibu: (cx, A) => { ibuDuduk(cx, A, t, { pose: "telepon", face: "panik", keringat: true, layar: LAYAR_BICARA }); }, anak: (cx, B) => anakTidur(cx, B, t) });
      ctx.restore();
      // komputer di langit dan sinyal ke HP Bu Rina
      const ma = ramp(l, tKom - 0.25, 0.4);
      if (ma > 0) {
        const R = monitor(ctx, MON.cx, MON.cy + (1 - eout(ma)) * 40, MON.w, t, ma); layarKomputer(ctx, R, t, l);
        const [px, py] = toS(c, IBU_X + 60, 520), sx = MON.cx + MON.w * 0.45, sy = MON.cy + 40, cxp = (sx + px) / 2 + 60, cyp = Math.min(sy, py) - 40;
        const pa = ramp(l, tKom - 0.05, 0.6);
        ctx.save(); ctx.globalAlpha *= ma; ctx.strokeStyle = D.hexA(P.teal, 0.9); ctx.lineWidth = 6; ctx.setLineDash([4, 18]); ctx.lineCap = "round"; ctx.lineDashOffset = -t * 60;
        ctx.beginPath(); ctx.moveTo(sx, sy); const N = 30; for (let i = 1; i <= N * pa; i++) { const u = i / N; ctx.lineTo((1 - u) * (1 - u) * sx + 2 * u * (1 - u) * cxp + u * u * px, (1 - u) * (1 - u) * sy + 2 * u * (1 - u) * cyp + u * u * py); } ctx.stroke(); ctx.setLineDash([]);
        for (let k = 0; k < 3; k++) { const u = ((t * 0.6 + k / 3) % 1) * pa; const x = (1 - u) * (1 - u) * sx + 2 * u * (1 - u) * cxp + u * u * px, y = (1 - u) * (1 - u) * sy + 2 * u * (1 - u) * cyp + u * u * py; D.glow(ctx, x, y, 40, P.teal, 0.8); }
        ctx.restore();
      }
      // isi layar monitor saat portal: studio
      if (zoomU > 0) { ctx.save(); ctx.beginPath(); ctx.rect(R0.x, R0.y, R0.w, R0.h); ctx.clip(); ctx.globalAlpha *= clamp(zoomU * 4); ctx.translate(R0.x, R0.y); ctx.scale(R0.w / W, R0.w / W); studioScene(ctx, b, l, t, { bip: bipDraw }); ctx.restore(); }
      ctx.restore();
      // label rumah
      const la = ramp(l, 1.0, 0.4) * (1 - ramp(l, tDan - 0.5, 0.3));
      D.post(cx => { if (la <= 0.01) return; cx.save(); cx.globalAlpha = la;
        const [x1, y1] = toS(c, 960, 140), [x2, y2] = toS(c, AX + 960, 140); D.label(cx, "Kamar Bu Rina", x1, y1, { size: 44, col: P.pink }); D.label(cx, "Kamar anak", x2, y2, { size: 44, col: P.teal });
        const kk = ramp(l, tKom + 0.4, 0.3); if (kk > 0) { cx.globalAlpha = la * kk; D.label(cx, "dibuat komputer", MON.cx + 30, MON.cy + MON.w * 0.42, { size: 46, col: P.teal }); }
        cx.restore(); });
    } else {
      studioScene(ctx, b, l, t, { bip: bipDraw });
    }
    // panel narator (sesudah portal)
    const na = ramp(l, tNar - 0.15, 0.4);
    D.post(cx => {
      if (na > 0) { const sp = spring(l - tNar + 0.15, 9, 0.55); cx.save(); cx.globalAlpha = na; cx.translate(PAN.x + PAN.w / 2, PAN.y + PAN.h / 2); cx.scale(lerp(0.85, 1, sp), lerp(0.85, 1, sp)); cx.translate(-PAN.x - PAN.w / 2, -PAN.y - PAN.h / 2);
        narratorPanel(cx, b, l, t, { amp: act(b, l), angka: eio(ramp(l, tKom2b - 0.05, 1.1)) });
        studioTab(cx, "Suara narator", PAN.x, PAN.y - 30, P.amber, 1); cx.restore();
        const ka = ramp(l, tKom2b + 0.5, 0.35); if (ka > 0) { cx.save(); cx.globalAlpha = ka; D.label(cx, "dibuat komputer", PAN.x + PAN.w - 220, PAN.y + PAN.h + 70, { size: 48, col: P.amber }); cx.restore(); } }
      judul(cx, l, speechEndL(b) + 0.15);
    });
  };
  const speechEndL = b => D.speechEnd(b);

  // b0_5: pertanyaan bab -> mesin meniru, keluarga dilindungi, suara itu sendiri
  S.b0_5 = function (ctx, b, l, t, TL) {
    const p4 = beat(TL, "b0_4"), tM = D.at(b, "mesin"), tMen = D.at(b, "meniru"), tLin = D.at(b, "melindungi"), tKel = D.at(b, "keluarga"), tMari = D.at(b, "Mari kita"), tDas = D.at(b, "paling dasar"), tSu = D.at(b, "suara itu sendiri");
    const out1 = eio(ramp(l, tMari - 0.3, 0.8));        // fase A & B keluar
    const shrink = eio(ramp(l, 0.2, 0.9));            // panel angka masuk ke mesin
    const MX = 1250, MY = 450;
    // Bip
    const famX = 1240, famY = 860;
    const bipX = lerp(400, 500, eio(ramp(l, tMari - 0.2, 1.1))), bipO = (() => {
      if (l < tLin - 0.4) return { pose: "tunjuk", t, target: [MX, MY], mood: "think" };
      if (l < tMari - 0.2) return { pose: "tunjuk", t, target: [famX, famY - 300], mood: "happy" };
      if (l < tMari + 0.9) return { pose: "jalan", t, dir: 1 };
      return { pose: "kacaPembesar", t, target: [980 + Math.sin(t * 0.8) * 50, 465], glass: 0.95, content: (c2, x, y, r) => { c2.save(); c2.fillStyle = "#1B2457"; c2.fillRect(x - r, y - r, 2 * r, 2 * r); KY.spektrogram(c2, x - r * 1.2, y - r * 0.8, r * 2.4, r * 1.6, { profil: PROF_ANAK, scroll: t * 0.5, dur: 1.6 }); c2.restore(); } };
    })();
    KL.studio(ctx, t, { warna: "biru", px: Math.sin(t * 0.2) * 0.3 });
    // keluarga + kubah (fase B)
    const fa = eout(ramp(l, tLin - 0.9, 0.6)) * (1 - out1);
    if (fa > 0.01) { ctx.save(); ctx.globalAlpha *= fa; const dy = out1 * 120;
      const fam = [["ayah", -210, 280, "senang"], ["buRina", -75, 268, "senang"], ["nenek", 60, 250, "senang"], ["anakRina", 185, 262, "senang"], ["adik", 300, 190, "senang"]];
      fam.forEach(([n, dx, h, f], i) => KO.draw(ctx, famX + dx, famY + dy, h, Object.assign(KO.preset(n), { pose: "berdiri", face: f, t, look: [0, -0.4] })));
      const ku = ramp(l, tLin - 0.1, 0.7), hit = Math.max(0, Math.sin((l - tKel) * 6)) * ramp(l, tKel, 0.2) * (1 - ramp(l, tKel + 1.2, 0.3));
      kubah(ctx, famX + 45, famY + 10 + dy, 360, ku, t, hit);
      // panah suara tiruan memantul dari kubah
      for (let k = 0; k < 2; k++) { const u = ramp(l, tKel - 0.4 + k * 0.45, 0.9); if (u <= 0 || u >= 1) continue; const x = lerp(1820, famX + 400, Math.min(1, u * 1.6)) + Math.max(0, u * 1.6 - 1) * 400, y = 520 + k * 90 - Math.max(0, u * 1.6 - 1) * 260;
        ctx.save(); ctx.globalAlpha *= Math.sin(u * Math.PI); KY.gelombang(ctx, x - 70, y - 26, 140, 52, { t, mode: "garis", seed: 41 + k, col: P.pink, col2: P.red, lw: 6 }); ctx.restore(); }
      ctx.restore(); }
    KB.draw(ctx, bipX, 640, 250, bipO);
    // fase C: gelombang besar "suara itu sendiri"
    const ca = ramp(l, tMari + 0.1, 0.7), glowS = ramp(l, tSu, 0.4) * (1 - ramp(l, tSu + 1.2, 0.8));
    if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; D.glow(ctx, 1150, 470, 700, P.teal, 0.2 + 0.35 * glowS);
      KY.gelombang(ctx, 600, 300, 1200 * eout(ca), 330, { t, mode: "batang", seed: 23, col: P.teal, col2: P.pink, n: 56, amp: () => 0.6 + 0.4 * glowS });
      ctx.restore(); }
    D.post(cx => {
      judul(cx, l + 5, 0);
      // fase A: suara asli -> mesin -> tiruan?
      const aA = 1 - out1; if (aA <= 0.01) return; cx.save(); cx.globalAlpha = aA; const yA = MY - out1 * 80;
      // panel angka dari b0_4 menyusut ke mesin
      if (shrink < 1) { const R = { x: lerp(PAN.x, MX - 90, shrink), y: lerp(PAN.y, MY - 60, shrink), w: lerp(PAN.w, 180, shrink), h: lerp(PAN.h, 120, shrink) };
        cx.save(); cx.globalAlpha *= 1 - shrink; narratorPanel(cx, p4, p4.dur, t, { R, amp: 0.4, angka: 1 }); cx.restore(); }
      const mg = ramp(l, 0.6, 0.4); mesin(cx, MX, yA, 190, t, mg, act(b, l) * ramp(l, tMen, 0.3));
      const la = ramp(l, tM - 0.2, 0.5);
      if (la > 0) { cx.save(); cx.globalAlpha *= la;
        KO.kepala(cx, 760, yA, 58, Object.assign(KO.preset("anakRina"), { face: "netral", t }));
        KY.gelombang(cx, 830, yA - 50, 220, 100, { t, mode: "garis", seed: 23, col: P.teal, col2: "#9FF0E6", lw: 7 });
        panah(cx, 1060, 1130, yA, t, 1, P.ink2); cx.restore(); }
      const ra = ramp(l, tMen, 0.5);
      if (ra > 0) { cx.save(); cx.globalAlpha *= ra; panah(cx, 1370, 1440, yA, t, 1, P.pink);
        KY.gelombang(cx, 1460, yA - 50, 220 * eout(ra), 100, { t, mode: "garis", seed: 23, col: P.pink, col2: P.amber, lw: 7 });
        const q = spring(l - tMen - 0.3, 10, 0.5); cx.save(); cx.translate(1730, yA); cx.scale(q, q); cx.fillStyle = P.amber; cx.beginPath(); cx.arc(0, 0, 44, 0, TAU); cx.fill(); txt(cx, "?", 0, 22, 64, { align: "center", weight: 900, color: "#3A2A10" }); cx.restore();
        cx.restore(); }
      cx.restore();
    });
  };

  K.SCENES.d03_b0 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d03_b0.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b0 = TL => [
    K.sfxAt(TL, "b0_1", "berdering", 0, "pop", 0.6),
    K.sfxAt(TL, "b0_1", "nomor yang", -0.9, "whoosh", 0.6),
    K.sfxAt(TL, "b0_1", "diangkat", 0.05, "clack", 0.7),
    K.sfxAt(TL, "b0_1a", "kecelakaan", 0, "boom", 0.45),
    K.sfxAt(TL, "b0_2", "Suaranya persis.", 0.5, "pop", 0.5),
    K.sfxAt(TL, "b0_2", "memanggilnya persis.", 0.6, "pop", 0.5),
    K.sfxAt(TL, "b0_2", "terdengar sama.", 0.4, "pop", 0.55),
    K.sfxAt(TL, "b0_3", null, 0.2, "whoosh", 0.7),
    K.sfxAt(TL, "b0_3", "tidur lelap", 0, "shimmer", 0.4),
    K.sfxAt(TL, "b0_4", "dibuat oleh", -0.1, "pop", 0.5),
    K.sfxAt(TL, "b0_4", "Dan ada", -0.3, "whoosh", 0.8),
    K.sfxAt(TL, "b0_4", "pun dibuat", 0.46, "riser", 0.6),
    K.sfxAt(TL, "b0_5", "meniru", 0, "shimmer", 0.45),
    K.sfxAt(TL, "b0_5", "melindungi", 0, "shimmer", 0.5),
    K.sfxAt(TL, "b0_5", "Mari kita", -0.4, "whoosh", 0.6),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
