/* D03 bab 0 — Pembuka (b0_1, b0_1a, b0_2, b0_3, b0_4, b0_5).
   Satu dunia yang terus dibawa: rumah Bu Rina (kamar Bu Rina | dinding | kamar anak) dengan kamera sendiri,
   lalu kamera mundur: rumah itu ternyata tampil di monitor di studio Bip (layar monitor -> suara narator -> angka -> judul),
   monitor menyusut menjadi "mesin peniru", keluarga dilindungi kubah, lalu kaca pembesar Bip membuka spektrogram (bab 1). */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KO = KIT.orang, KY = KIT.layar, KB = KIT.bipkit, P = D.P;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, sm, eio, eout, spring } = D;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const AX = 1920 + (KL.WALL_W || 130);            // x dunia kamar anak
  const WALLX = 1920 + (KL.WALL_W || 130) / 2;      // pusat dinding
  const PROF_IBU = Object.assign({}, KY.SUARA.ibu, { seed: 11 }), PROF_ANAK = Object.assign({}, KY.SUARA.anak, { seed: 23 });
  const TITLE = "Suara Ibumu Bisa Dipalsukan dalam 3 Detik", TITLE2 = ["Suara Ibumu Bisa Dipalsukan", "dalam 3 Detik"];
  const CYAN = "#58D8FF";

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
  // cahaya: gelapkan (multiply) dan tambahkan (screen)
  function grade(ctx, a, col = "#4A55A8") { if (a <= 0.01) return; ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  function moonShaft(ctx, win, t, a = 1) {   // berkas cahaya bulan dari jendela ke lantai
    if (a <= 0.01) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const fl = 0.9 + 0.1 * Math.sin(t * 0.7), x0 = win.x + win.w * 0.12, x1 = win.x + win.w * 0.88, y0 = win.y + win.h * 0.12, dx = 420, yf = 800;
    const gr = ctx.createLinearGradient(0, y0, 0, yf); gr.addColorStop(0, `rgba(150,182,255,${0.24 * a * fl})`); gr.addColorStop(1, `rgba(150,182,255,${0.05 * a})`);
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1 + dx, yf); ctx.lineTo(x0 + dx + 70, yf); ctx.closePath(); ctx.fill();
    ctx.fillStyle = `rgba(170,196,255,${0.14 * a * fl})`; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2 + dx + 35, yf + 36, (x1 - x0) * 0.62, 40, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // lampu meja menyala dengan kedip singkat
  function lampOn(l, t0) { const u = l - t0; if (u <= 0) return 0; const seq = [0.5, 0.08, 0.75, 0.25, 0.9, 0.6, 0.8]; return u >= 0.49 ? 0.8 : seq[Math.floor(u / 0.07)]; }
  const LAMP = 0.8;

  // ---------- rumah: kamar Bu Rina | dinding | kamar anak (koordinat dunia) ----------
  // o: lamp, pg, ring, phone, key (cahaya HP di nakas), handKey (cahaya HP di tangan), ibu(ctx, A) -> [x,y] HP, anak(ctx, B)
  function rumah(ctx, t, c, o = {}) {
    const vx0 = c.x - W / 2 / c.z, vx1 = c.x + W / 2 / c.z; let A = null, B = null, hp = null;
    const lamp = o.lamp || 0;
    if (vx0 < 1920) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1920, 1080); ctx.clip();
      A = KL.kamar(ctx, t, { lamp, phoneGlow: o.pg || 0, ring: o.ring || 0, phone: o.phone, jam: 23, near: false }).anchors;
      if (o.ibu) hp = o.ibu(ctx, A); KL.depan(ctx, "kamar", t, {});
      grade(ctx, 0.4 * (1 - 0.5 * lamp)); moonShaft(ctx, A.window, t, 1 - 0.45 * lamp);
      const k = o.key || 0;
      if (k > 0.01) { const px = A.phone.x, py = A.phone.y - 22;
        addLight(ctx, px, py, 560, CYAN, 0.42 * k); addLight(ctx, px, py, 150, "#C8F6FF", 0.6 * k); addLight(ctx, A.pillow.x + 10, A.pillow.y - 40, 230, CYAN, 0.38 * k); }
      if (hp && o.handKey) addLight(ctx, hp[0] - 10, hp[1] - 20, 300, CYAN, o.handKey);
      ctx.restore(); }
    if (vx1 > 1920 && vx0 < AX) KL.dinding(ctx, WALLX, t, { floorY: 800 });
    if (vx1 > AX) { ctx.save(); ctx.translate(AX, 0); ctx.beginPath(); ctx.rect(0, 0, 1920, 1080); ctx.clip();
      B = KL.kamarAnak(ctx, t, { guling: false, near: false, lamp: 0, phone: false }).anchors;
      nakasAnak(ctx, t);
      if (o.anak) o.anak(ctx, B); KL.depan(ctx, "kamarAnak", t, {});
      grade(ctx, 0.36); moonShaft(ctx, B.window, t, 0.9);
      ctx.restore(); }
    // debu melayang di cahaya bulan (gerak sekunder)
    const r = D.rng(91); ctx.save(); ctx.fillStyle = "#DCE6FF";
    for (let i = 0; i < 70; i++) { const bx = r() * 3970, by = 150 + r() * 650, sp = 6 + r() * 10, ph = r() * TAU, rad = 1.6 + r() * 2.4;
      const x = bx + Math.sin(t * 0.3 + ph) * 30, y = by - ((t * sp + ph * 40) % 120) + 60; if (x < vx0 - 10 || x > vx1 + 10) continue;
      ctx.globalAlpha = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 1.3 + ph)); ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill(); }
    ctx.restore();
    return { A, B };
  }
  // nakas kecil di samping kepala anak, HP-nya mati di atasnya (koordinat lokal kamar anak)
  const NAKAS = { x0: 22, x1: 150, top: 612, phone: [86, 600] };
  function nakasAnak(ctx, t) {
    const { x0, x1, top } = NAKAS, bot = 800;
    ctx.save(); ctx.fillStyle = "rgba(10,14,40,0.25)"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, bot + 4, (x1 - x0) * 0.62, 12, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#A8744A"; RR(ctx, x0, top, x1 - x0, bot - top, 8); ctx.fill();
    ctx.fillStyle = "#C48A57"; RR(ctx, x0 - 8, top - 14, x1 - x0 + 16, 20, 7); ctx.fill();
    ctx.strokeStyle = "rgba(60,30,20,0.35)"; ctx.lineWidth = 3; [top + 62, top + 124].forEach(y => { ctx.beginPath(); ctx.moveTo(x0 + 8, y); ctx.lineTo(x1 - 8, y); ctx.stroke(); });
    ctx.fillStyle = "#F2C27A"; [top + 34, top + 96, top + 156].forEach(y => { ctx.beginPath(); ctx.arc((x0 + x1) / 2, y, 6, 0, TAU); ctx.fill(); });
    KY.hp(ctx, NAKAS.phone[0], NAKAS.phone[1], 150, { t, flat: 1, lit: 0, glow: 0, screen: (c, w, h) => KY.mati(c, w, h) });
    ctx.restore();
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
  // huruf Z digambar sebagai garis (bukan teks)
  function zz(ctx, x, y, s, a) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = "round"; ctx.lineCap = "round";
    const path = () => { ctx.beginPath(); ctx.moveTo(x - s / 2, y - s / 2); ctx.lineTo(x + s / 2, y - s / 2); ctx.lineTo(x - s / 2, y + s / 2); ctx.lineTo(x + s / 2, y + s / 2); };
    ctx.shadowColor = "rgba(196,180,255,0.95)"; ctx.shadowBlur = s * 0.5; ctx.strokeStyle = "#D9CCFF"; ctx.lineWidth = s * 0.26; path(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = s * 0.13; path(); ctx.stroke(); ctx.restore();
  }
  // anak tidur memeluk guling di kamar anak (koordinat lokal kamar anak)
  function anakTidur(ctx, B, t, zA = 1) {
    const px = B.pillow.x, py = B.pillow.y, br = Math.sin(t * 1.25 + 2) * 2;
    ctx.fillStyle = "#2FB5A6"; ctx.beginPath(); ctx.ellipse(px + 180, py + 16 + br * 0.3, 160, 32, 0, 0, TAU); ctx.fill();
    KO.kepala(ctx, px + 16, py - 28 + br * 0.4, 38, Object.assign(KO.preset("anakRina"), { face: "tidur", bahu: false, tilt: -0.72, t }));
    KL.selimut(ctx, "kamarAnak", t, { sampai: 0.82, guling: true });
    ctx.fillStyle = KO.SKIN[2]; ctx.beginPath(); ctx.arc(B.guling.x - 30, B.guling.y - 14 + br * 0.3, 15, 0, TAU); ctx.fill();
    // Z naik pelan di dinding polos kiri atas kepala (antara nakas dan poster)
    for (let i = 0; i < 3; i++) { const u = (t * 0.3 + i / 3) % 1, s = 30 + u * 20;
      zz(ctx, px - 95 - u * 45 + Math.sin(u * 5 + i) * 6, py - 120 - u * 190, s, zA * Math.sin(u * Math.PI)); }
  }
  // layar HP di tangan (tanpa huruf: ikon saja)
  function layarHP(c, w, h, t, masuk) {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, masuk ? "#5B6BE0" : "#3E86C9"); gr.addColorStop(1, masuk ? "#8A5FD6" : "#4B55B8"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    const ph = (t * 0.8) % 1; c.strokeStyle = D.hexA("#FFFFFF", 0.4 * (1 - ph)); c.lineWidth = w * 0.03; c.beginPath(); c.arc(w / 2, h * 0.3, w * (0.2 + 0.15 * ph), 0, TAU); c.stroke();
    KY.avatar(c, w / 2, h * 0.3, w * 0.2, "#7C8BEA", {});
    if (masuk) { [[0.28, "#FF5A5F"], [0.72, "#3FCB7E"]].forEach(([fx, col]) => { c.fillStyle = col; c.beginPath(); c.arc(w * fx, h * 0.8, w * 0.13, 0, TAU); c.fill(); }); }
    else { for (let i = 0; i < 7; i++) { const v = 0.3 + 0.7 * Math.abs(Math.sin(t * 6 + i * 1.3)); c.fillStyle = P.teal; c.fillRect(w * (0.18 + i * 0.1), h * 0.58 - v * h * 0.05, w * 0.05, v * h * 0.1); }
      c.fillStyle = "#FF5A5F"; c.beginPath(); c.arc(w / 2, h * 0.84, w * 0.13, 0, TAU); c.fill(); }
  }
  const LAYAR_BICARA = (c, w, h, t) => layarHP(c, w, h, t, false), LAYAR_MASUK = (c, w, h, t) => layarHP(c, w, h, t, true);
  // layar panggilan masuk besar (insert): tombol berjauhan, label di bawah tiap tombol
  function layarMasukBesar(c, w, h, t) {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5B6BE0"); gr.addColorStop(1, "#8A5FD6"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    const ay = h * 0.2, ar = w * 0.15;
    for (let i = 0; i < 3; i++) { const ph = (t * 0.7 + i / 3) % 1; c.strokeStyle = D.hexA("#FFFFFF", 0.35 * (1 - ph)); c.lineWidth = w * 0.012; c.beginPath(); c.arc(w / 2, ay, ar * (1 + ph * 0.9), 0, TAU); c.stroke(); }
    KY.avatar(c, w / 2, ay, ar, "#7C8BEA", {});
    txt(c, "Nomor tidak", w / 2, h * 0.42, 54, { align: "center", weight: 800, color: "#FFFFFF", fit: w * 0.92 });
    txt(c, "dikenal", w / 2, h * 0.42 + 64, 54, { align: "center", weight: 800, color: "#FFFFFF", fit: w * 0.92 });
    txt(c, "0812-0000-1234", w / 2, h * 0.6, 44, { align: "center", weight: 700, color: "rgba(255,255,255,0.92)", fit: w * 0.92 });
    const by = h * 0.77, br = w * 0.13, out = {};
    [["tolak", w * 0.22, "#FF5A6A", "tutup", "Tolak", 0], ["terima", w * 0.78, "#2FD08A", "telepon", "Terima", 0.5]].forEach(([k, x, col, ic, lab, ph]) => {
      const p = 0.5 + 0.5 * Math.sin((t * 1.6 + ph) * TAU), hop = k === "terima" ? -Math.abs(Math.sin(t * Math.PI * 1.6)) * w * 0.02 : 0;
      c.fillStyle = D.hexA(col, 0.28 * p); c.beginPath(); c.arc(x, by, br * (1.15 + 0.3 * p), 0, TAU); c.fill();
      c.fillStyle = col; c.beginPath(); c.arc(x, by + hop, br, 0, TAU); c.fill(); KY.ikon(c, ic, x, by + hop, br * 1.1, "#FFFFFF");
      txt(c, lab, x, by + br + 62, 42, { align: "center", weight: 800, color: "#FFFFFF" });
      out[k] = { x: x - br, y: by - br, w: br * 2, h: br * 2, cx: x, cy: by };
    });
    return out;
  }
  const IBU_X = 1280;
  function ibuDuduk(ctx, A, t, o = {}) {   // berdiri di depan ranjang sambil menelepon
    const op = Object.assign(KO.preset("buRina"), { pose: "telepon", t, layar: LAYAR_BICARA, glow: true }, o);
    return KO.draw(ctx, IBU_X, 806, 420, op);
  }
  const IBU_HEAD = [IBU_X + 5, 443];
  const FOTO_ANAK = [1620, 300];                    // wajah anak di foto berbingkai (dunia kamar)

  // ---------- gelembung dialog (kata muncul saat diucapkan, gelembung tumbuh bersama teks) ----------
  const BUB = [[0, 3], [3, 7], [7, 10], [10, 14]], HOT = /kecelakaan|transfer|sekarang|jangan|bilang/i;
  function bubbleLayout(ctx, b, size, maxW) {
    const toks = b.text.split(/\s+/); ctx.font = `800 ${size}px ${FONT}`; const sp = ctx.measureText(" ").width;
    return BUB.map(([i0, i1]) => { const lines = [[]]; let x = 0;
      for (let i = i0; i < i1; i++) { const w = ctx.measureText(toks[i]).width; if (x > 0 && x + w > maxW) { lines.push([]); x = 0; } lines[lines.length - 1].push({ i, s: toks[i], x, w }); x += w + sp; }
      return { i0, i1, lines, t0: wordT(b, i0) - 0.12 }; });
  }
  const wAppear = (b, i, l) => clamp((l - b.words[i][1] + 0.08) / 0.16);
  function bubbleSize(B, b, l, lh, pad) {   // ukuran gelembung saat ini (hanya kata yang sudah terucap)
    let w = 0, nl = 0; B.lines.forEach(Ln => { let lv = 0; Ln.forEach(wd => { const a = eout(wAppear(b, wd.i, l)); if (a > 0) { w = Math.max(w, wd.x + wd.w * a); lv = Math.max(lv, a); } }); nl += lv; });
    return { w: Math.max(w, 40), h: Math.max(nl, 0.6) * lh + pad * 1.4 };
  }
  function bubbles(ctx, b, l, a = 1) {
    if (a <= 0.01) return; const size = 58, lh = 72, pad = 30, gap = 22, maxW = 700, X0 = 1050, YB = 860;
    const L = bubbleLayout(ctx, b, size, maxW), Z = L.map(B => bubbleSize(B, b, l, lh, pad));
    L.forEach((B, k) => {
      const e = eout(ramp(l, B.t0, 0.3)); if (e <= 0) return;
      let yb = YB; for (let j = k + 1; j < L.length; j++) yb -= (Z[j].h + gap) * eout(ramp(l, L[j].t0, 0.4));
      const h = Z[k].h, y = yb - h, fadeTop = clamp((y - 150) / 70);
      const s = lerp(0.85, 1, spring(ramp(l, B.t0, 1) * 1.0, 10, 0.5)), al = a * e * fadeTop; if (al <= 0.01) return;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(X0, yb); ctx.scale(s, s); ctx.translate(-X0, -yb);
      const bw = Z[k].w + pad * 2 + 6;
      ctx.shadowColor = "rgba(8,12,40,0.45)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#F7F9FF"; RR(ctx, X0, y, bw, h, Math.min(30, h / 2)); ctx.fill(); ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.beginPath(); ctx.moveTo(X0 + 4, yb - 46); ctx.lineTo(X0 - 26, yb - 18); ctx.lineTo(X0 + 34, yb - 22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.teal; RR(ctx, X0 + 10, y + 16, 9, Math.max(10, h - 32), 4.5); ctx.fill();
      B.lines.forEach((Ln, r) => Ln.forEach(wd => {
        const wa = wAppear(b, wd.i, l); if (wa <= 0) return;
        ctx.save(); ctx.globalAlpha = al * wa; ctx.font = `800 ${size}px ${FONT}`; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = HOT.test(wd.s) ? "#D8344F" : "#1B2150"; ctx.fillText(wd.s, X0 + pad + 6 + wd.x, y + pad * 0.7 + lh * (r + 0.78) + (1 - wa) * 10); ctx.restore(); }));
      ctx.restore();
    });
  }

  // ---------- kartu perbandingan (b0_2): "di telepon" vs "anaknya" ----------
  function banding(ctx, b, l, t, a = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a;
    const X0 = 1010, X1 = 1820, Y0 = 170, Y1 = 880, cA = 1225, cB = 1610, cM = 1418;
    ctx.fillStyle = "rgba(14,22,62,0.86)"; RR(ctx, X0, Y0, X1 - X0, Y1 - Y0, 36); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.lineWidth = 2; ctx.stroke();
    // ekor gelembung pikiran ke arah kepala Bu Rina
    [[975, 420, 20], [918, 466, 13], [872, 500, 8]].forEach(([x, y, r]) => { ctx.fillStyle = "rgba(14,22,62,0.86)"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
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
      const m = eio(ramp(l, R.t1 - 0.35, 0.5)), dx = (1 - m) * 40;
      ctx.save(); ctx.globalAlpha *= e;
      [[cA - 10 - dx, -1], [cB + 10 + dx, 1]].forEach(([cx, sd], j) => {
        if (i === 0) KY.gelombang(ctx, cx - 160, R.y - 55, 320, 110, { t, mode: "garis", seed: 23, col: P.teal, col2: "#9FF0E6", lw: 6, speed: 1.2 });
        else if (i === 1) { ctx.fillStyle = "#F7F9FF"; RR(ctx, cx - 120, R.y - 50, 240, 96, 30); ctx.fill(); txt(ctx, "“Bu…”", cx, R.y + 20, 58, { align: "center", weight: 900, color: "#1B2150" }); }
        else {
          KY.gelombang(ctx, cx - 165, R.y - 60, 260, 120, { t, mode: "garis", seed: 31, col: "#9FD8FF", col2: P.teal, lw: 6, speed: 1.6, amp: (u, tt) => 0.25 + 0.75 * Math.pow(Math.abs(Math.sin(u * TAU * 1.2 - tt * 4)), 2) });
          const dy = ((t * 0.7 + j * 0.4) % 1) * 36, dx2 = cx + 128, dyy = R.y - 22 + dy; ctx.save(); ctx.globalAlpha *= Math.sin(((t * 0.7 + j * 0.4) % 1) * Math.PI) * 0.6 + 0.4;
          tetes(ctx, dx2, dyy, 1); ctx.restore(); }
      });
      const ck = spring(ramp(l, R.t1 - 0.05, 1), 11, 0.5), r0 = 34;
      if (ck <= 0.01) { txt(ctx, "=", cM, R.y + 18, 60, { align: "center", weight: 900, color: P.ink2 }); }
      else { ctx.save(); ctx.translate(cM, R.y); ctx.scale(ck, ck); ctx.fillStyle = P.green; ctx.beginPath(); ctx.arc(0, 0, r0, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 1); ctx.lineTo(-4, 12); ctx.lineTo(16, -12); ctx.stroke(); ctx.restore();
        D.glow(ctx, cM, R.y, 90, P.green, 0.35 * (1 - ramp(l, R.t1 + 0.2, 0.8))); }
      ctx.restore();
    });
    ctx.restore();
  }
  function tetes(ctx, x, y, s) {   // tetes air mata
    ctx.fillStyle = "#9FE6FF"; ctx.beginPath(); ctx.moveTo(x, y - 34 * s); ctx.quadraticCurveTo(x + 28 * s, y + 6 * s, x, y + 16 * s); ctx.quadraticCurveTo(x - 28 * s, y + 6 * s, x, y - 34 * s); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x - 7 * s, y + 2 * s, 5 * s, 0, TAU); ctx.fill();
  }

  // ---------- rumah boneka: langit, bukit jauh + rumah pelaku, atap, halaman ----------
  const DH = { x: 1890, y: 294, z: 0.42 };                 // kamera rumah boneka (lantai dasar rumah di y layar ±870)
  const PEL = { x: 214, y: 372, win: [232, 326] };          // rumah jauh tempat komputer pelaku (koordinat layar rumah boneka)
  const CALL = { x: 430, y: 190, r: 108 };                  // lingkaran perbesaran jendela itu
  function langit(ctx, t) {
    D.bg(ctx, t, { top: "#26388A", bot: "#5468B8", stars: 0.8 });
    D.glow(ctx, 1640, 150, 260, "#CFE0FF", 0.25); ctx.fillStyle = "#F4F1FF"; ctx.beginPath(); ctx.arc(1640, 150, 44, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2F4596"; ctx.beginPath(); ctx.arc(1662, 138, 40, 0, TAU); ctx.fill();
    // awan tipis bergerak
    ctx.save(); ctx.fillStyle = "rgba(200,214,255,0.10)"; [[0, 120, 1], [1, 230, 0.7]].forEach(([i, y, s]) => { const x = ((t * 14 * s + i * 900) % 2400) - 240;
      ctx.beginPath(); ctx.ellipse(x, y, 180 * s, 26 * s, 0, 0, TAU); ctx.ellipse(x + 90 * s, y - 14, 110 * s, 22 * s, 0, 0, TAU); ctx.fill(); }); ctx.restore();
    // bukit jauh dengan rumah-rumah kecil
    ctx.fillStyle = "#33468F"; ctx.beginPath(); ctx.moveTo(0, 420); ctx.quadraticCurveTo(260, 300, 560, 360); ctx.quadraticCurveTo(900, 420, 1300, 340); ctx.quadraticCurveTo(1650, 280, 1920, 360); ctx.lineTo(1920, 600); ctx.lineTo(0, 600); ctx.closePath(); ctx.fill();
    [[520, 352, 70], [1460, 318, 80], [1760, 330, 64]].forEach(([x, y, w], i) => { ctx.fillStyle = "#283A7E"; ctx.fillRect(x - w / 2, y - w * 0.5, w, w * 0.5); ctx.beginPath(); ctx.moveTo(x - w * 0.62, y - w * 0.5); ctx.lineTo(x, y - w * 0.92); ctx.lineTo(x + w * 0.62, y - w * 0.5); ctx.fill();
      ctx.fillStyle = D.hexA("#FFD38A", 0.55 + 0.2 * Math.sin(t * 1.1 + i)); ctx.fillRect(x - w * 0.15, y - w * 0.36, w * 0.18, w * 0.16); });
  }
  function rumahPelaku(ctx, t, a) {   // rumah gelap jauh, satu jendela menyala biru (monitor)
    const { x, y } = PEL, w = 150, h = 82;
    ctx.fillStyle = "#1E2B66"; ctx.fillRect(x - w / 2, y - h, w, h); ctx.beginPath(); ctx.moveTo(x - w * 0.62, y - h); ctx.lineTo(x, y - h - 62); ctx.lineTo(x + w * 0.62, y - h); ctx.fill();
    const [wx, wy] = PEL.win, fl = 0.75 + 0.25 * Math.sin(t * 7) * Math.sin(t * 2.3);
    D.glow(ctx, wx, wy, 70, P.teal, (0.25 + 0.5 * a) * fl);
    ctx.fillStyle = D.hexA("#7FF0E2", 0.35 + 0.55 * a * fl); ctx.fillRect(wx - 20, wy - 16, 40, 32);
    ctx.fillStyle = "#1E2B66"; ctx.fillRect(wx - 2, wy - 16, 4, 32); ctx.fillRect(wx - 20, wy - 2, 40, 4);
  }
  // monitor generik: rect layar R; bingkai, leher dan kaki sebanding dengan lebar layar
  function monitorFrame(ctx, R, t, a = 1, footY = null) {
    const bz = R.w * 0.05, cx = R.x + R.w / 2; ctx.save(); ctx.globalAlpha *= a;
    const fy = footY == null ? R.y + R.h + bz + R.w * 0.12 : footY;
    ctx.fillStyle = "#3A4290"; ctx.fillRect(cx - R.w * 0.05, R.y + R.h, R.w * 0.1, fy - (R.y + R.h)); RR(ctx, cx - R.w * 0.2, fy - R.w * 0.03, R.w * 0.4, R.w * 0.035, R.w * 0.015); ctx.fill();
    ctx.shadowColor = "rgba(6,10,40,0.45)"; ctx.shadowBlur = R.w * 0.05; ctx.shadowOffsetY = R.w * 0.015;
    ctx.fillStyle = "#2B3170"; RR(ctx, R.x - bz, R.y - bz, R.w + 2 * bz, R.h + 2 * bz, bz * 0.8); ctx.fill(); ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillStyle = "#4A54A8"; ctx.fillRect(R.x - bz * 0.5, R.y + R.h + bz * 0.35, R.w + bz, bz * 0.2);
    ctx.fillStyle = "#7FF0E2"; ctx.beginPath(); ctx.arc(R.x + R.w + bz * 0.5, R.y + R.h + bz * 0.55, bz * 0.12, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function layarKomputer(ctx, R, t) {   // gelombang anak yang sedang "dibuat"
    ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    const gr = ctx.createLinearGradient(R.x, R.y, R.x, R.y + R.h); gr.addColorStop(0, "#14204F"); gr.addColorStop(1, "#22306A"); ctx.fillStyle = gr; ctx.fillRect(R.x, R.y, R.w, R.h);
    KY.gelombang(ctx, R.x + R.w * 0.08, R.y + R.h * 0.2, R.w * 0.84, R.h * 0.6, { t, mode: "batang", seed: 23, col: P.teal, col2: P.pink, n: 18 });
    ctx.restore();
  }
  function callout(ctx, t, a) {   // perbesaran: meja dengan monitor yang membuat suara, sosok berkerudung dari belakang
    if (a <= 0.01) return; const { x, y, r } = CALL, s = eout(a);
    ctx.save(); ctx.globalAlpha *= a;
    // garis penghubung ke jendela
    const [wx, wy] = PEL.win; ctx.strokeStyle = D.hexA("#9FF0E6", 0.55); ctx.lineWidth = 3; ctx.setLineDash([6, 8]);
    [-0.9, 0.9].forEach(sd => { const an = Math.atan2(wy - y, wx - x) + Math.PI / 2 * sd; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(x + Math.cos(an) * r * s, y + Math.sin(an) * r * s); ctx.stroke(); }); ctx.setLineDash([]);
    ctx.translate(x, y); ctx.scale(s, s);
    D.glow(ctx, 0, 0, r * 1.7, P.teal, 0.3);
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
    ctx.fillStyle = "#141A42"; ctx.fillRect(-r, -r, 2 * r, 2 * r);
    const R = { x: -r * 0.38, y: -r * 0.62, w: r * 1.02, h: r * 1.02 * 9 / 16 };
    addLight(ctx, R.x + R.w / 2, R.y + R.h / 2, r * 1.2, P.teal, 0.35);
    ctx.fillStyle = "#3B2F5E"; ctx.fillRect(-r, r * 0.3, 2 * r, r);                 // meja
    ctx.fillStyle = "#4C3E78"; ctx.fillRect(-r, r * 0.3, 2 * r, r * 0.06);
    monitorFrame(ctx, R, t, 1, r * 0.32); layarKomputer(ctx, R, t);
    // sosok berkerudung (dari belakang, wajah tak terlihat)
    const hx = -r * 0.5, hy = r * 0.12 + Math.sin(t * 1.2) * 2;
    ctx.fillStyle = "#0B0F2A"; ctx.beginPath(); ctx.ellipse(hx, r * 0.78, r * 0.5, r * 0.4, 0, Math.PI, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.25, r * 0.3, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = D.hexA(P.teal, 0.7); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.25, r * 0.3, 0, -1.2, 0.3); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = "#9FF0E6"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  function halaman(ctx, t, c) {   // tanah, pagar, semak, lampu jalan, pohon (koordinat dunia rumah)
    ctx.save(); camT(ctx, c);
    // pohon siluet di belakang (kiri), bergoyang
    [[-520, 1.15], [-980, 1.3], [4500, 1.1]].forEach(([x, s], i) => { const sw = Math.sin(t * 0.8 + i) * 10;
      ctx.fillStyle = "#24356F"; ctx.fillRect(x - 20 * s, 1080 - 430 * s, 40 * s, 430 * s); ctx.beginPath(); ctx.arc(x + sw, 1080 - 480 * s, 200 * s, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(x - 130 * s + sw, 1080 - 380 * s, 140 * s, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x + 140 * s + sw, 1080 - 370 * s, 130 * s, 0, TAU); ctx.fill(); });
    // rumput
    const gg = ctx.createLinearGradient(0, 1080, 0, 1800); gg.addColorStop(0, "#2F6A63"); gg.addColorStop(1, "#1D3F4C"); ctx.fillStyle = gg; ctx.fillRect(-2600, 1080, 9000, 900);
    ctx.fillStyle = "#3E7F72"; ctx.fillRect(-2600, 1080, 9000, 26);
    // jalan setapak ke rumah
    ctx.fillStyle = "#5B5F92"; ctx.beginPath(); ctx.moveTo(1880, 1106); ctx.lineTo(2090, 1106); ctx.lineTo(2300, 1800); ctx.lineTo(1670, 1800); ctx.closePath(); ctx.fill();
    // semak
    [[-160, 1110, 120], [420, 1120, 150], [3600, 1112, 140], [4180, 1116, 120]].forEach(([x, y, r], i) => { const b = Math.sin(t * 1.1 + i) * 4;
      ctx.fillStyle = "#24584F"; ctx.beginPath(); ctx.arc(x, y + b, r, Math.PI, TAU); ctx.arc(x + r * 0.8, y + 10 + b, r * 0.7, Math.PI, TAU); ctx.fill(); });
    // pagar kayu di depan
    ctx.fillStyle = "#8C6A9E"; for (let x = -1400; x < 5400; x += 110) { if (x > 1700 && x < 2260) continue; RR(ctx, x, 1150, 30, 150, 8); ctx.fill(); }
    ctx.fillRect(-1400, 1180, 3110, 18); ctx.fillRect(2260, 1180, 3140, 18); ctx.fillRect(-1400, 1250, 3110, 18); ctx.fillRect(2260, 1250, 3140, 18);
    // lampu jalan (kiri) dengan cahaya berkedip lembut
    const lx = -330, fl = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 2.7);
    ctx.fillStyle = "#2A2F5E"; ctx.fillRect(lx - 12, 160, 24, 1180); ctx.fillRect(lx, 160, 150, 18);
    ctx.fillStyle = "#FFE1A0"; RR(ctx, lx + 110, 170, 70, 30, 10); ctx.fill();
    ctx.restore();
    const [sx, sy] = toS(c, lx + 145, 200), [gx, gy] = toS(c, lx + 145, 1150);
    addLight(ctx, sx, sy, 140 * c.z / 0.42, "#FFD38A", 0.55 * fl);
    ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = `rgba(255,211,138,${0.16 * fl})`; ctx.beginPath(); ctx.ellipse(gx, gy, 260 * c.z / 0.42, 40 * c.z / 0.42, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  function atap(ctx, t, c) {
    ctx.save(); camT(ctx, c);
    ctx.fillStyle = "#C9C3E6"; ctx.fillRect(-70, -30, 70, 1110); ctx.fillRect(3970, -30, 70, 1110);
    const x0 = -200, x1 = 4170, yb = -30, yp = -560;
    ctx.fillStyle = "#B8573F"; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo((x0 + x1) / 2, yp); ctx.lineTo(x1, yb); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = "rgba(90,30,30,0.45)"; ctx.lineWidth = 10; for (let y = yp + 40; y < yb; y += 44) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); } ctx.restore();
    ctx.fillStyle = "#8E3F33"; ctx.fillRect(x0 - 10, yb - 4, x1 - x0 + 20, 34);
    ctx.fillStyle = "#3A2F5E"; ctx.beginPath(); ctx.moveTo(-10, yb + 30); ctx.lineTo((x0 + x1) / 2, yp + 130); ctx.lineTo(3980, yb + 30); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // seluruh pemandangan rumah boneka dalam layar 1920x1080 (dipakai langsung dan di dalam monitor studio)
  function rumahBoneka(ctx, b, l, t, c, tKom) {
    langit(ctx, t);
    const ma = ramp(l, tKom - 0.25, 0.4);
    rumahPelaku(ctx, t, ma);
    halaman(ctx, t, c); atap(ctx, t, c);
    let hand = null;
    ctx.save(); camT(ctx, c);
    rumah(ctx, t, c, { lamp: LAMP, phone: false, handKey: 0.3, ibu: (cx, A) => { const an = ibuDuduk(cx, A, t, { pose: "telepon", face: "panik", keringat: true, layar: LAYAR_BICARA }); hand = an.phone || an.hand; return hand; },
      anak: (cx, B) => anakTidur(cx, B, t) });
    ctx.restore();
    // sinyal dari rumah pelaku ke HP Bu Rina
    if (ma > 0 && hand) {
      const [px, py] = toS(c, hand[0], hand[1]), [sx, sy] = PEL.win, cxp = (sx + px) / 2 + 40, cyp = Math.min(sy, py) - 70, pa = ramp(l, tKom - 0.05, 0.7);
      const Q = u => [(1 - u) * (1 - u) * sx + 2 * u * (1 - u) * cxp + u * u * px, (1 - u) * (1 - u) * sy + 2 * u * (1 - u) * cyp + u * u * py];
      ctx.save(); ctx.globalAlpha *= ma; ctx.strokeStyle = D.hexA("#9FF0E6", 0.9); ctx.lineWidth = 6; ctx.setLineDash([4, 18]); ctx.lineCap = "round"; ctx.lineDashOffset = -t * 60;
      ctx.beginPath(); ctx.moveTo(sx, sy); const N = 30; for (let i = 1; i <= N * pa; i++) { const p = Q(i / N); ctx.lineTo(p[0], p[1]); } ctx.stroke(); ctx.setLineDash([]);
      for (let k = 0; k < 3; k++) { const p = Q(((t * 0.6 + k / 3) % 1) * pa); D.glow(ctx, p[0], p[1], 40, P.teal, 0.85); }
      if (pa >= 1) D.glow(ctx, px, py, 90, P.teal, 0.35 + 0.25 * Math.sin(t * 8));
      ctx.restore();
    }
    callout(ctx, t, ramp(l, tKom - 0.1, 0.45));
  }

  // ---------- studio Bip ----------
  const MS = { x: 470, y: 170, w: 860, h: 484 };            // layar monitor studio
  const FLOOR = 760, SPK = { x: 1440, y: 470, w: 160, h: 290 };
  function speaker(ctx, t, v, a = 1, dx = 0) {   // kotak speaker; kerucut berdenyut dan busur suara mengikuti narator
    if (a <= 0.01) return; const { x, y, w, h } = SPK; ctx.save(); ctx.globalAlpha *= a; ctx.translate(dx, 0);
    ctx.fillStyle = "rgba(10,14,40,0.25)"; ctx.beginPath(); ctx.ellipse(x + w / 2, FLOOR + 4, w * 0.62, 12, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2B3170"; RR(ctx, x, y, w, h, 18); ctx.fill(); ctx.fillStyle = "#3A4290"; RR(ctx, x + 8, y + 8, w - 16, h - 16, 14); ctx.fill();
    const cx = x + w / 2, s = 1 + 0.08 * v;
    [[y + 70, 30], [y + 190, 58]].forEach(([cy, r]) => { ctx.fillStyle = "#1B2150"; ctx.beginPath(); ctx.arc(cx, cy, r * 1.12, 0, TAU); ctx.fill();
      ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(cx, cy, r * s, 0, TAU); ctx.fill(); ctx.fillStyle = "#B97A1C"; ctx.beginPath(); ctx.arc(cx, cy, r * 0.42 * s, 0, TAU); ctx.fill(); });
    D.glow(ctx, cx, y + 190, 200, P.amber, 0.18 + 0.35 * v);
    for (let k = 0; k < 3; k++) { const ph = (t * 0.9 + k / 3) % 1; ctx.strokeStyle = D.hexA(P.amber, (1 - ph) * (0.15 + 0.7 * v)); ctx.lineWidth = 8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(cx + 30, y + 190, 90 + ph * 140, -0.7, 0.7); ctx.stroke(); }
    ctx.restore();
  }
  // isi layar monitor studio: panel suara narator -> angka (R = rect layar)
  function narratorScreen(ctx, R, t, v, an, a = 1, numA = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    const gr = ctx.createLinearGradient(R.x, R.y, R.x, R.y + R.h); gr.addColorStop(0, "#151E52"); gr.addColorStop(1, "#24306E"); ctx.fillStyle = gr; ctx.fillRect(R.x, R.y, R.w, R.h);
    const ba = 1 - sm(an / 0.55), k = R.w / MS.w, top = R.y + 104 * k, Rb = { x: R.x, y: top, w: R.w, h: R.h - 110 * k };
    if (ba > 0.01) KY.gelombang(ctx, Rb.x + 40 * k, Rb.y + 20 * k, Rb.w - 80 * k, Rb.h - 40 * k, { t, mode: "batang", seed: 55, col: P.amber, col2: P.pink, n: 36, amp: () => (0.18 + 0.82 * v) * lerp(0.15, 1, ba), alpha: ba, speed: 0.9 });
    if (k > 0.85) { ctx.save(); ctx.globalAlpha *= numA; angkaGrid(ctx, Rb, t, an, 55); ctx.restore(); }
    ctx.restore();
  }
  const hn = (a, b, s) => { const x = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453; return x - Math.floor(x); };
  function angkaGrid(ctx, R, t, an, seed) {   // deretan angka sampel suara (sel lebar tetap, bergulir pelan)
    if (an <= 0.02) return; const fs = 48, rows = 3, cell = 206, lh = (R.h - 30) / rows, x0 = R.x + 20, x1 = R.x + R.w - 20;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, R.y, x1 - x0, R.h); ctx.clip();
    ctx.font = `700 ${fs}px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const sc = t * 0.35, k0 = Math.floor(sc), fr = sc - k0, cols = Math.ceil((x1 - x0) / cell) + 2, A0 = ctx.globalAlpha;
    for (let r = 0; r < rows; r++) { const ry = R.y + 15 + lh * (r + 0.5);
      for (let c = 0; c < cols; c++) { const k = k0 + c, px = x0 + (c - fr) * cell;
        const uu = clamp((px - x0) / (x1 - x0)), edge = clamp(Math.min(px - x0 - 75, x1 - px - 75) / 50), stag = sm((an - 0.05 - 0.5 * uu) / 0.4), a = edge * stag; if (a <= 0.01) continue;
        const m = Math.round((0.03 + 0.9 * hn(k, r, seed)) * 100), neg = hn(k, r, seed + 3) < 0.5, str = (neg ? "−" : "") + "0," + String(m).padStart(2, "0");
        ctx.globalAlpha = A0 * a; ctx.fillStyle = (r + k) % 3 === 0 ? P.pink : P.amber; ctx.fillText(str, px, ry + (1 - stag) * 16); } }
    ctx.restore();
  }
  function studioTab(ctx, s, x, y, col, a = 1) {   // label "Suara narator" di baris judul layar
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `800 46px ${FONT}`; const w = ctx.measureText(s).width + 120;
    ctx.fillStyle = col; RR(ctx, x, y - 40, w, 74, 22); ctx.fill();
    KY.ikon(ctx, "speaker", x + 44, y - 3, 46, "#1B2150"); txt(ctx, s, x + 84, y + 14, 46, { weight: 800, color: "#1B2150" }); ctx.restore(); return w;
  }
  // judul: momen pahlawan (dua baris, tengah) lalu menetap di pita atas (satu baris)
  function judul(ctx, hero, top, t) {
    if (hero > 0.01) { const s = lerp(0.88, 1, spring(hero * 0.9, 9, 0.55)), y0 = lerp(112, 450, hero);
      ctx.save(); ctx.globalAlpha *= clamp(hero * 1.6 - 0.6); ctx.translate(W / 2, y0); ctx.scale(s * lerp(0.6, 1, hero), s * lerp(0.6, 1, hero));
      ctx.shadowColor = "rgba(6,10,40,0.6)"; ctx.shadowBlur = 30;
      txt(ctx, TITLE2[0], 0, 0, 108, { align: "center", weight: 900, fit: 1700 }); txt(ctx, TITLE2[1], 0, 132, 108, { align: "center", weight: 900, fit: 1700 });
      ctx.shadowBlur = 0; const ul = clamp(hero * 1.5 - 0.3); ctx.fillStyle = P.amber; RR(ctx, -200 * ul, 178, 400 * ul, 12, 6); ctx.fill(); ctx.restore(); }
    if (top > 0.01) { ctx.save(); ctx.globalAlpha *= clamp(top * 1.6 - 0.6); ctx.translate(W / 2, lerp(250, 112, top));
      txt(ctx, TITLE, 0, 0, 66, { align: "center", weight: 900, fit: 1640 }); ctx.fillStyle = P.amber; RR(ctx, -120, 24, 240, 8, 4); ctx.fill(); ctx.restore(); }
  }
  // mesin peniru (kotak chip bercahaya dengan roda gigi)
  function mesin(ctx, x, y, s, t, a = 1, glow = 0) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
    D.glow(ctx, 0, 0, s * 1.3, P.violet, 0.35 + 0.4 * glow);
    ctx.fillStyle = "#5A4FC8"; for (let i = -2; i <= 2; i++) { ctx.fillRect(i * s * 0.18 - 5, -s * 0.62, 10, s * 0.14); ctx.fillRect(i * s * 0.18 - 5, s * 0.48, 10, s * 0.14); ctx.fillRect(-s * 0.62, i * s * 0.18 - 5, s * 0.14, 10); ctx.fillRect(s * 0.48, i * s * 0.18 - 5, s * 0.14, 10); }
    ctx.fillStyle = "#6E62E8"; RR(ctx, -s * 0.5, -s * 0.5, s, s, s * 0.16); ctx.fill();
    ctx.fillStyle = "#8C82FF"; RR(ctx, -s * 0.38, -s * 0.38, s * 0.76, s * 0.76, s * 0.1); ctx.fill();
    [[-0.1, -0.06, 0.2, 1], [0.15, 0.14, 0.13, -1.5]].forEach(([gx, gy, r, sp]) => { ctx.save(); ctx.translate(gx * s, gy * s); ctx.rotate(t * sp); ctx.fillStyle = "#F2F6FF";
      for (let k = 0; k < 8; k++) { ctx.rotate(TAU / 8); ctx.fillRect(-r * s * 0.18, -r * s * 1.25, r * s * 0.36, r * s * 0.4); }
      ctx.beginPath(); ctx.arc(0, 0, r * s, 0, TAU); ctx.fill(); ctx.fillStyle = "#8C82FF"; ctx.beginPath(); ctx.arc(0, 0, r * s * 0.42, 0, TAU); ctx.fill(); ctx.restore(); });
    ctx.restore();
  }
  function panah(ctx, x0, x1, y, t, a = 1, col = P.ink2) {   // panah putus-putus bergerak
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.setLineDash([2, 20]); ctx.lineDashOffset = -t * 40;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 - 24, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - 28, y - 18); ctx.lineTo(x1 - 28, y + 18); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function kubah(ctx, x, y, r, u, t, hit = 0) {   // kubah pelindung keluarga
    if (u <= 0.01) return; ctx.save(); const rr = r * eout(u);
    ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.82, 0, Math.PI, TAU); ctx.closePath();
    const gr = ctx.createRadialGradient(x, y - rr * 0.3, rr * 0.2, x, y, rr); gr.addColorStop(0, D.hexA(P.teal, 0.05 + 0.12 * hit)); gr.addColorStop(1, D.hexA(P.teal, 0.32 + 0.35 * hit));
    ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = D.hexA(hit > 0.2 ? "#FFFFFF" : "#9FF0E6", 0.85); ctx.lineWidth = 6 + 4 * hit; ctx.stroke();
    ctx.globalAlpha *= 0.5; ctx.lineWidth = 3; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.ellipse(x, y, rr * k / 4, rr * 0.82, 0, Math.PI, TAU); ctx.stroke(); }
    ctx.restore();
  }
  function perisai(ctx, x, y, s) {   // perisai kecil yang dipegang Bip
    const h = s * 0.5, w = h * 0.82; ctx.save(); ctx.translate(x, y);
    D.glow(ctx, 0, 0, h * 1.1, P.teal, 0.4);
    ctx.fillStyle = "#2FB5A6"; ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.quadraticCurveTo(w * 0.5, -h * 0.42, w / 2, -h * 0.3); ctx.quadraticCurveTo(w * 0.5, h * 0.2, 0, h / 2); ctx.quadraticCurveTo(-w * 0.5, h * 0.2, -w / 2, -h * 0.3); ctx.quadraticCurveTo(-w * 0.5, -h * 0.42, 0, -h / 2); ctx.fill();
    ctx.strokeStyle = "#9FF0E6"; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-w * 0.2, 0); ctx.lineTo(-w * 0.04, h * 0.14); ctx.lineTo(w * 0.22, -h * 0.14); ctx.stroke();
    ctx.restore();
  }

  // ---------- kamera rumah ----------
  const ZC = 2.1;
  const camClose = (T = 0) => { const z = ZC * (1 + 0.006 * T); return { x: IBU_HEAD[0] + (W / 2 - 600) / z, y: IBU_HEAD[1] + (HH / 2 - 510) / z, z }; };
  const CAM_ANAK = [[AX + 250, 560, 1.78], [AX + 256, 566, 1.84]];   // b0_3 akhir: anak + nakas

  // =============================== ADEGAN ===============================
  const S = {};

  // b0_1: kamar gelap, HP berdering (cahaya kunci), insert layar panggilan masuk, Bu Rina mengangkat
  S.b0_1 = function (ctx, b, l, t, TL) {
    const tRing = D.at(b, "berdering"), tNomor = D.at(b, "nomor yang"), tAngkat = D.at(b, "diangkat"), tSuara = D.at(b, "terdengar suara"), tAnak = D.at(b, "anaknya"), tNangis = D.at(b, "menangis");
    const cc = camClose(0);
    const c = drift(D.path([[0, 1060, 520, 1.13], [tRing - 0.2, 1060, 530, 1.2], [tNomor, 1110, 560, 1.5], [tAngkat - 0.1, 1170, 560, 1.55], [tAngkat + 1.1, cc.x, cc.y, cc.z]], l), t, 0.5);
    const ring = ramp(l, tRing - 0.05, 0.15) * (1 - ramp(l, tAngkat, 0.2));
    const insA = ramp(l, tNomor - 0.35, 0.35) * (1 - ramp(l, tAngkat + 0.35, 0.3));   // insert HP besar: ruangan diredam + blur
    const wake = ramp(l, 4.35, 0.3);                                                  // tidur -> berdiri, tersembunyi di balik insert
    const key = ramp(l, tRing - 0.05, 0.25) * (0.86 + 0.14 * Math.sin(t * 14)) * (1 - wake);
    const lamp = lampOn(l, 4.62);
    const blendK = eio(ramp(l, tAngkat + 0.25, 0.8));
    let hand = null;
    ctx.save(); camT(ctx, c);
    rumah(ctx, t, c, { lamp, pg: ramp(l, tRing - 0.05, 0.25), ring, phone: wake < 0.5, key, handKey: 0.32 * wake, ibu: (cx, A) => {
      ibuTidur(cx, A, t, 1 - wake, ring);
      if (wake > 0.01) { cx.save(); cx.globalAlpha *= wake;
        const an = ibuDuduk(cx, A, t, { pose: "pegangHP", blend: { to: "telepon", k: blendK }, layar: blendK < 0.5 ? LAYAR_MASUK : LAYAR_BICARA, face: l > tSuara ? "bingung" : "ngantuk", dering: l < tAngkat });
        hand = an.phone || an.hand; cx.restore(); }
      return hand;
    } });
    ctx.restore();
    // "Pukul 23.00" di bawah jam saat diucapkan
    const tj = D.at(b, "Pukul sebelas"), ja = ramp(l, tj, 0.3) * (1 - ramp(l, tRing + 0.6, 0.4));
    D.post(cx => { if (ja <= 0.01) return; const [x, y] = toS(c, 1240, 250); cx.save(); cx.globalAlpha = ja; const s = lerp(0.8, 1, spring(l - tj)); cx.translate(x, y + 120); cx.scale(s, s); D.label(cx, "Pukul 23.00", 0, 0, { size: 50, col: P.amber }); cx.restore(); });
    // wajah anak di foto berbingkai bercahaya saat "anaknya"
    const fa = ramp(l, tAnak - 0.1, 0.3) * (1 - ramp(l, b.dur - 0.7, 0.5));
    // gelombang suara dari HP di telinga (isak: bergetar + tetes air mata)
    const wa = ramp(l, tSuara - 0.1, 0.4), sob = ramp(l, tNangis - 0.1, 0.3);
    D.post(cx => {
      // insert: ruangan diredam dan dikaburkan, HP besar di depan
      if (insA > 0.01) { cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.filter = `blur(${(9 * insA).toFixed(1)}px)`; cx.drawImage(cx.canvas, 0, 0); cx.filter = "none";
        cx.fillStyle = `rgba(6,9,30,${0.38 * insA})`; cx.fillRect(0, 0, W, HH); cx.restore(); }
      const up = ramp(l, tNomor - 0.35, 0.55), gone = ramp(l, tAngkat + 0.35, 0.3);
      if (up > 0 && gone < 1) {
        const [sx, sy] = toS(c, 1022, 600), k = eout(up), x = lerp(lerp(sx, 1180, 0.6), 1180, k), y = lerp(lerp(sy, 500, 0.6) + 120, 500, k);
        cx.save(); cx.globalAlpha = clamp((up - 0.15) * 1.4) * (1 - gone); cx.translate(x, y + gone * 60);
        D.glow(cx, 0, 0, 560, CYAN, 0.3);
        const press = ramp(l, tAngkat - 0.1, 0.2), terima = l > tAngkat + 0.1;
        const a = KY.hp(cx, 0, 0, 830, { t, ringkas: true, teks: 1, ring: terima ? 0 : 0.8, screen: (c2, w, h, tt) => terima ? KY.panggilan(c2, w, h, { t: tt, ringkas: true, teks: 1.25, jam: false, durasi: "00:01", tanya: false }) : layarMasukBesar(c2, w, h, tt) });
        if (!terima || press < 1) { const tb = a.out && a.out.terima; if (tb) { const p = a.map(tb.cx + tb.w * 0.32, tb.cy - tb.h * 0.05), fa2 = ramp(l, tAngkat - 0.9, 0.3);
          if (fa2 > 0) { cx.save(); cx.globalAlpha *= fa2; KY.jari(cx, p.x + (1 - fa2) * 80, p.y + (1 - fa2) * 40, 150, { tekan: press, t, kulit: KO.SKIN[3], lengan: "#F2A65A", rot: -0.95 }); cx.restore(); } } }
        cx.restore();
      }
      if (fa > 0.01) { const [px, py] = toS(c, FOTO_ANAK[0], FOTO_ANAK[1]), pu = 0.5 + 0.5 * Math.sin((l - tAnak) * 7);
        cx.save(); cx.globalAlpha = fa; D.glow(cx, px, py, 150, P.teal, 0.45 + 0.3 * pu);
        cx.strokeStyle = D.hexA("#BFF6EF", 0.9); cx.lineWidth = 6; cx.beginPath(); cx.arc(px, py, 70 + 12 * pu, 0, TAU); cx.stroke(); cx.restore(); }
      if (wa > 0 && hand) { const [hx, hy] = toS(c, hand[0], hand[1]), ww = 560 * eout(wa), jx = sob * Math.sin(t * 31) * 3, jy = sob * Math.sin(t * 27 + 1) * 4;
        cx.save(); cx.globalAlpha = wa;
        KY.gelombang(cx, hx + 40 + jx, hy - 70 + jy, ww, 140, { t, mode: "garis", seed: 23, col: P.teal, col2: "#BFF6EF", lw: 7, amp: u => (0.25 + 0.75 * act(b, l)) * (1 - sob * 0.45 * (0.5 + 0.5 * Math.sin(u * 40 + t * 30))) });
        if (fa > 0.01) { const [px, py] = toS(c, FOTO_ANAK[0], FOTO_ANAK[1]); cx.globalAlpha = wa * fa * 0.8; cx.strokeStyle = "#9FF0E6"; cx.lineWidth = 4; cx.setLineDash([3, 14]); cx.lineCap = "round"; cx.lineDashOffset = -t * 40;
          cx.beginPath(); cx.moveTo(hx + 40 + ww, hy); cx.quadraticCurveTo(hx + 40 + ww + 60, (hy + py) / 2, px, py + 80); cx.stroke(); cx.setLineDash([]); }
        if (sob > 0) for (let k = 0; k < 3; k++) { const u = ((l - tNangis) * 0.9 + k / 3) % 1; if (l < tNangis + k * 0.25) continue;
          cx.globalAlpha = wa * sob * Math.sin(u * Math.PI); tetes(cx, hx + 40 + ww * (0.3 + 0.22 * k), hy + 10 + u * 120, 0.8); }
        cx.restore(); }
    });
  };

  // b0_1a: suara anak di telepon (dialog), gelembung kata besar
  S.b0_1a = function (ctx, b, l, t, TL) {
    const c = drift(camClose(l), t, 0.5);
    const panik = l > D.at(b, "kecelakaan") - 0.1; let hand = null;
    ctx.save(); camT(ctx, c);
    rumah(ctx, t, c, { lamp: LAMP, phone: false, handKey: 0.32, ibu: (cx, A) => { const an = ibuDuduk(cx, A, t, { pose: "telepon", face: panik ? "panik" : "bingung", keringat: panik, layar: LAYAR_BICARA }); hand = an.phone || an.hand; return hand; } });
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
    rumah(ctx, t, c, { lamp: LAMP, phone: false, handKey: 0.32, ibu: (cx, A) => { const an = ibuDuduk(cx, A, t, { pose: "telepon", face: isak ? "sedih" : "panik", keringat: true, airmata: isak, layar: LAYAR_BICARA }); return an.phone || an.hand; } });
    ctx.restore();
    D.post(cx => { bubbles(cx, pv, pv.dur + l, 1 - ramp(l, 0, 0.25)); banding(cx, b, l, t, ramp(l, 0.15, 0.3)); });
  };

  // b0_3: kamera menembus dinding ke kamar anak yang tidur; berhenti dekat pada anak + HP di nakas
  S.b0_3 = function (ctx, b, l, t, TL) {
    const p2 = beat(TL, "b0_2"), pv1 = beat(TL, "b0_1a"), base = pv1.dur + p2.dur, c0 = camClose(base);
    const tT = D.at(b, "tidur lelap"), tS = D.at(b, "sebelah");
    const [e0, e1] = CAM_ANAK;
    const c = drift(D.path([[0.12, c0.x, c0.y, c0.z], [0.85, 1720, 520, 1.12], [tT, e0[0], e0[1], e0[2]], [b.dur, e1[0], e1[1], e1[2]]], l), t);
    ctx.save(); camT(ctx, c);
    rumah(ctx, t, c, { lamp: LAMP, phone: false, handKey: 0.32, ibu: (cx, A) => { const an = ibuDuduk(cx, A, t, { pose: "telepon", face: "panik", keringat: true, layar: LAYAR_BICARA }); return an.phone || an.hand; },
      anak: (cx, B) => anakTidur(cx, B, t, 0.4 + 0.6 * ramp(l, tT - 0.5, 0.6)) });
    ctx.restore();
    D.post(cx => {
      banding(cx, p2, p2.dur + l, t, 1 - ramp(l, 0, 0.35));
      const la = ramp(l, tS - 0.3, 0.4);
      if (la > 0) { const [px, py] = toS(c, AX + NAKAS.phone[0], NAKAS.phone[1] - 6), lx = px - 270, ly = py - 250, s = lerp(0.8, 1, spring(l - tS + 0.3));
        cx.save(); cx.globalAlpha = la;
        cx.strokeStyle = "#9FF0E6"; cx.lineWidth = 6; cx.lineCap = "round"; const ex = lerp(lx + 120, px - 6, eout(la)), ey = lerp(ly + 40, py - 26, eout(la));
        cx.beginPath(); cx.moveTo(lx + 120, ly + 40); cx.lineTo(ex, ey); cx.stroke();
        cx.fillStyle = "#9FF0E6"; cx.beginPath(); cx.arc(ex, ey, 10, 0, TAU); cx.fill();
        D.glow(cx, px, py, 120, P.teal, 0.25 * la);
        cx.translate(lx, ly); cx.scale(s, s); D.label(cx, "HP-nya diam", 0, 0, { size: 48, col: P.teal }); cx.restore(); }
    });
  };

  // b0_4: rumah boneka (komputer di rumah jauh) -> kamera mundur: semua itu di monitor studio Bip -> suara narator -> angka -> judul
  S.b0_4 = function (ctx, b, l, t, TL) {
    const tKom = D.at(b, "dibuat oleh"), tDan = D.at(b, "Dan ada"), tPerlu = D.at(b, "perlu kamu"), tNar = D.at(b, "Suara narator");
    const tKom2b = D.at(b, "pun dibuat") + (b.words[25][1] - b.words[24][1]), tEnd = D.speechEnd(b);
    const e1 = CAM_ANAK[1], c = drift(D.path([[0, e1[0], e1[1], e1[2]], [1.7, DH.x, DH.y, DH.z]], l), t);
    const pu = eio(ramp(l, tDan - 0.25, 1.2));          // kamera mundur keluar dari monitor
    const s1 = MS.w / W, kz = Math.exp(Math.log(s1) * pu), F = [MS.x / (1 - s1), MS.y / (1 - s1)];
    const R = { x: F[0] + kz * (0 - F[0]), y: F[1] + kz * (0 - F[1]), w: W * kz, h: HH * kz };
    const v = act(b, l), hero = eout(ramp(l, tEnd + 0.05, 0.45)), an = eio(ramp(l, tKom2b - 0.05, 1.1)), scr = ramp(l, tNar - 0.25, 0.35);
    // studio di belakang
    if (pu > 0) { KL.studio(ctx, t, { warna: "biru", px: Math.sin(t * 0.2) * 0.3 }); speaker(ctx, t, l > tDan ? v : 0, ramp(l, tDan - 0.2, 0.4)); monitorFrame(ctx, R, t, 1, R.y + R.h + (FLOOR - MS.y - MS.h) * kz); }
    // isi layar: rumah boneka, lalu panel narator
    ctx.save(); if (pu > 0) { ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); ctx.translate(F[0], F[1]); ctx.scale(kz, kz); ctx.translate(-F[0], -F[1]); }
    if (scr < 1) rumahBoneka(ctx, b, l, t, c, tKom);
    ctx.restore();
    const numA = 1 - 0.8 * clamp(hero * 2);
    if (scr > 0) narratorScreen(ctx, MS, t, v, an, scr, numA);
    // Bip di samping monitor (di depan studio, tidak di depan layar saat kamera masih mundur)
    if (pu > 0.3) {
      const kag = l - (tKom2b + 0.35);
      let o = { pose: "diam", t, mood: "think", look: [0.9, -0.1] };
      if (l > tPerlu - 0.4 && l < tNar - 0.1) o = { pose: "diam", t, mood: "happy", wave: 1, look: [0, 0.1] };
      else if (l >= tNar - 0.1 && kag < 0) o = { pose: "tunjuk", t, target: [MS.x + 160, MS.y + 260], mood: "think" };
      else if (kag >= 0) o = kag < 1.4 ? { pose: "kaget", t, k: kag, mood: "wow" } : { pose: "tunjuk", t, target: [MS.x + 160, MS.y + 260], mood: "wow" };
      ctx.save(); if (pu < 1) { ctx.beginPath(); ctx.rect(0, 0, W, HH); ctx.rect(R.x - R.w * 0.05, R.y - R.w * 0.05, R.w * 1.1, R.h + R.w * 0.1); ctx.clip("evenodd"); }
      KB.draw(ctx, 280, 640, 250, o); ctx.restore();
    }
    D.post(cx => {
      // label rumah boneka (sebelum kamera mundur)
      const la = ramp(l, 1.0, 0.4) * (1 - ramp(l, tDan - 0.6, 0.3));
      if (la > 0.01) { cx.save(); cx.globalAlpha = la;
        const [x1, y1] = toS(c, 960, -100), [x2, y2] = toS(c, AX + 960, -100); D.label(cx, "Kamar Bu Rina", x1, y1, { size: 44, col: P.pink }); D.label(cx, "Kamar anak", x2, y2, { size: 44, col: P.teal });
        const kk = ramp(l, tKom + 0.35, 0.3); if (kk > 0) { cx.globalAlpha = la * kk; D.label(cx, "dibuat komputer", 790, 122, { size: 46, col: P.teal }); }
        cx.restore(); }
      // judul layar "Suara narator"
      if (scr > 0) { const sp = spring(l - tNar + 0.15, 9, 0.55); cx.save(); cx.globalAlpha = scr * numA; cx.translate(MS.x + 40, MS.y + 62); cx.scale(lerp(0.85, 1, sp), lerp(0.85, 1, sp)); studioTab(cx, "Suara narator", 0, 0, P.amber, 1); cx.restore(); }
      const ka = ramp(l, tKom2b + 0.5, 0.35) * (1 - hero); if (ka > 0.01) { cx.save(); cx.globalAlpha = ka; D.label(cx, "dibuat komputer", MS.x + MS.w / 2, 830, { size: 48, col: P.amber }); cx.restore(); }
      if (hero > 0) { cx.fillStyle = `rgba(8,12,40,${0.36 * hero})`; cx.fillRect(0, 0, W, HH); judul(cx, hero, 0, t); }
    });
  };

  // b0_5: monitor menyusut jadi mesin peniru -> keluarga di bawah kubah -> kaca pembesar -> spektrogram
  S.b0_5 = function (ctx, b, l, t, TL) {
    const p4 = beat(TL, "b0_4"), tM = D.at(b, "mesin"), tMen = D.at(b, "meniru"), tLin = D.at(b, "melindungi"), tKel = D.at(b, "keluarga"), tMari = D.at(b, "Mari kita"), tSu = D.at(b, "suara itu sendiri");
    const MX = 1130, MY = 400, famX = 1180, famY = 870, DOME = { x: 1225, y: 880, rx: 360, ry: 295 };
    const out1 = eio(ramp(l, tMari - 0.3, 0.8));        // fase A & B keluar
    const shrink = eio(ramp(l, 0.3, 0.8));            // monitor menyusut ke mesin
    const morph = eio(ramp(l, 0.5, 0.7));             // judul pindah ke pita atas
    const bloom = eio(ramp(l, tSu - 0.1, 0.9));
    // gelombang tiruan menghantam kubah
    const HITS = [62, 38, 86].map((deg, k) => { const th = deg * Math.PI / 180, t0 = tKel - 0.4 + k * 0.42;
      return { t0, ti: t0 + 0.45, sx: 1470 + k * 70, sy: 430, hx: DOME.x + DOME.rx * Math.cos(th), hy: DOME.y - DOME.ry * Math.sin(th), nx: Math.cos(th), ny: -Math.sin(th) }; });
    const hitAmt = HITS.reduce((m, H) => Math.max(m, clamp(1 - (l - H.ti) / 0.35) * (l >= H.ti ? 1 : 0)), 0);
    // Bip
    const sweepU = eio(ramp(l, 7.3, 2.4)), lensX = lerp(640, 1420, sweepU);
    let bipX = 280, bipY = 640;
    const hop = HITS.reduce((m, H) => Math.max(m, l > H.ti && l < H.ti + 0.3 ? Math.sin((l - H.ti) / 0.3 * Math.PI) : 0), 0);
    const bipO = (() => {
      if (l < tLin - 0.4) return { pose: "tunjuk", t, target: [MX, MY], mood: "think" };
      if (l < tMari - 0.2) { bipY -= hop * 26; return { pose: "pegang", hold: "samping", dir: 1, propSize: 0.5, t, mood: hop > 0.2 ? "wow" : "happy", prop: (c2, px, py, s) => perisai(c2, px, py, s) }; }
      if (l < 7.3) { const u = eio(ramp(l, tMari - 0.2, 1.0)); bipX = lerp(280, lensX - 330, u); bipY = lerp(640, 660, u); return { pose: "jalan", t, dir: 1 }; }
      bipX = lensX - 330; bipY = 660 - Math.abs(Math.sin(t * 5)) * 4;
      return { pose: "kacaPembesar", t, target: [lensX, 520], glass: 1.45, mood: "think", content: (c2, x, y, r) => { c2.fillStyle = "#151B48"; c2.fillRect(x - r, y - r, 2 * r, 2 * r); spek(c2, LENSR, t); } };
    })();
    KL.studio(ctx, t, { warna: "biru", px: Math.sin(t * 0.2) * 0.3 });
    speaker(ctx, t, 0.3 * act(b, l), 1 - ramp(l, 0.3, 0.5), ramp(l, 0.3, 0.6) * 300);
    // keluarga + kubah (fase B)
    const fa = eout(ramp(l, tLin - 0.9, 0.6)) * (1 - out1);
    if (fa > 0.01) { ctx.save(); ctx.globalAlpha *= fa; const dy = out1 * 120;
      const fam = [["ayah", -210, 280], ["buRina", -75, 268], ["nenek", 60, 250], ["anakRina", 185, 262], ["adik", 300, 190]];
      fam.forEach(([n, dx, h]) => KO.draw(ctx, famX + dx, famY + dy, h, Object.assign(KO.preset(n), { pose: "berdiri", face: hitAmt > 0.3 ? "netral" : "senang", t, look: [0.3, -0.5] })));
      kubah(ctx, DOME.x, DOME.y + dy, DOME.rx, ramp(l, tLin - 0.1, 0.7), t, hitAmt);
      HITS.forEach(H => { const u = (l - H.t0) / 0.45; if (u < 0) return;
        if (u < 1) { const x = lerp(H.sx, H.hx, eio(u)), y = lerp(H.sy, H.hy, u * u), ang = Math.atan2(H.hy - H.sy, H.hx - H.sx); wave(ctx, x, y + dy, ang, 1, t); }
        else { const v2 = (l - H.ti) / 0.55; if (v2 < 1) { const x = H.hx + H.nx * 260 * v2 + 120 * v2, y = H.hy + H.ny * 200 * v2 - 60 * v2; wave(ctx, x, y + dy, Math.atan2(H.ny - 0.3, H.nx + 0.6), 1 - v2, t); }
          const fr = clamp((l - H.ti) / 0.5); if (fr < 1) { ctx.save(); ctx.globalAlpha *= 1 - fr; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10 * (1 - fr) + 2; ctx.beginPath(); ctx.arc(H.hx, H.hy + dy, 20 + 120 * eout(fr), 0, TAU); ctx.stroke();
            D.glow(ctx, H.hx, H.hy + dy, 150, "#FFFFFF", 0.6 * (1 - fr)); ctx.restore(); } } });
      ctx.restore(); }
    // fase C: gelombang besar "suara itu"
    const ca = ramp(l, tMari + 0.1, 0.7);
    if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; D.glow(ctx, 1030, 520, 760, P.teal, 0.22);
      KY.gelombang(ctx, WAVE.x, WAVE.y, WAVE.w * eout(ca), WAVE.h, { t, mode: "batang", seed: 23, col: P.teal, col2: P.pink, n: 56, amp: () => 0.75 });
      ctx.restore(); }
    const bipS = l < tMari - 0.2 ? 250 : lerp(250, 240, ramp(l, tMari - 0.2, 1)), bo = KB.draw(ctx, bipX, bipY, bipS, bipO);
    // mekar: isi lensa membesar memenuhi layar (spektrogram anak, seed 23)
    if (bloom > 0) { const lx = bo && bo.tip ? bo.tip[0] : lensX, ly = bo && bo.tip ? bo.tip[1] : 520, rad = lerp(175, 1500, bloom), PR = { x: lerp(LENSR.x, 140, bloom), y: lerp(LENSR.y, 150, bloom), w: lerp(LENSR.w, 1640, bloom), h: lerp(LENSR.h, 720, bloom) };
      ctx.save(); ctx.beginPath(); RR(ctx, 140, 150, 1640, 720, 40); ctx.clip(); ctx.beginPath(); ctx.arc(lx, ly, rad, 0, TAU); ctx.clip();
      ctx.fillStyle = "#151B48"; ctx.fillRect(0, 0, W, HH); spek(ctx, PR, t); ctx.restore();
      ctx.save(); ctx.globalAlpha = clamp(bloom * 4) * (1 - bloom); ctx.strokeStyle = "#FFD68A"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(lx, ly, rad, 0, TAU); ctx.stroke(); ctx.restore(); }
    D.post(cx => {
      // sisa b0_4: redaman di belakang judul
      const dimA = 1 - morph; if (dimA > 0.01) { cx.fillStyle = `rgba(8,12,40,${0.36 * dimA})`; cx.fillRect(0, 0, W, HH); }
      // monitor (angka redup) menyusut menjadi mesin
      if (shrink < 1) { const Rm = { x: lerp(MS.x, MX - 95, shrink), y: lerp(MS.y, MY - 95, shrink), w: lerp(MS.w, 190, shrink), h: lerp(MS.h, 190, shrink) };
        cx.save(); cx.globalAlpha = 1 - shrink; cx.save(); cx.fillStyle = "#000"; cx.restore();
        monitorFrame(cx, Rm, t, 1, Rm.y + Rm.h + (FLOOR - MS.y - MS.h) * (1 - shrink) + 30 * shrink);
        narratorScreen(cx, Rm, t, 0.3, 1, 1, 0.22); cx.restore(); }
      // fase A: suara asli -> mesin -> tiruan?
      const aA = 1 - out1;
      if (aA > 0.01) { cx.save(); cx.globalAlpha = aA; const yA = MY - out1 * 80;
        mesin(cx, MX, yA, 190, t, ramp(l, 0.75, 0.4), act(b, l) * ramp(l, tMen, 0.3) + 0.6 * hitAmt);
        const la = ramp(l, tM - 0.2, 0.5);
        if (la > 0) { cx.save(); cx.globalAlpha *= la; KO.kepala(cx, 620, yA, 54, Object.assign(KO.preset("anakRina"), { face: "netral", t }));
          KY.gelombang(cx, 700, yA - 50, 220, 100, { t, mode: "garis", seed: 23, col: P.teal, col2: "#9FF0E6", lw: 7 });
          panah(cx, 940, 1010, yA, t, 1, P.ink2); cx.restore(); }
        const ra = ramp(l, tMen, 0.5);
        if (ra > 0) { cx.save(); cx.globalAlpha *= ra; panah(cx, 1250, 1320, yA, t, 1, P.pink);
          cx.save(); cx.beginPath(); cx.rect(1335, yA - 70, 230 * eout(ra), 140); cx.clip();
          KY.gelombang(cx, 1335, yA - 50, 220, 100, { t, mode: "garis", seed: 23, col: P.pink, col2: P.amber, lw: 7 }); cx.restore();
          const q = spring(l - tMen - 0.3, 10, 0.5); cx.save(); cx.translate(1615, yA); cx.scale(q, q); cx.fillStyle = P.amber; cx.beginPath(); cx.arc(0, 0, 44, 0, TAU); cx.fill(); txt(cx, "?", 0, 22, 64, { align: "center", weight: 900, color: "#3A2A10" }); cx.restore();
          cx.restore(); }
        cx.restore(); }
      // judul: dari tengah ke pita atas, hilang saat spektrogram mekar
      judul(cx, 1 - morph, morph * (1 - ramp(l, tSu - 0.4, 0.4)), t);
    });
  };
  const WAVE = { x: 380, y: 370, w: 1300, h: 300 }, LENSR = { x: 300, y: 280, w: 1460, h: 560 };
  function spek(ctx, R, t) { KY.spektrogram(ctx, R.x, R.y, R.w, R.h, { profil: PROF_ANAK, scroll: t * 0.45, dur: 2.2, frame: false, r: 0 }); }
  function wave(ctx, x, y, ang, a, t) {   // gelombang suara tiruan (merah muda) sepanjang ±260 px, berpusat di (x, y)
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
    D.glow(ctx, 0, 0, 150, P.pink, 0.35); KY.gelombang(ctx, -130, -40, 260, 80, { t, mode: "garis", seed: 23, col: P.pink, col2: P.red, lw: 8, speed: 2 }); ctx.restore();
  }

  K.SCENES.d03_b0 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d03_b0.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b0 = TL => {
    const b4 = beat(TL, "b0_4"), b5 = beat(TL, "b0_5");
    const heroOff = b4 ? D.speechEnd(b4) + 0.05 - D.at(b4, "pun dibuat") : 1.7;
    return [
      K.sfxAt(TL, "b0_1", "berdering", 0, "pop", 0.6),
      K.sfxAt(TL, "b0_1", "nomor yang", -0.9, "whoosh", 0.6),
      K.sfxAt(TL, "b0_1", "diangkat", 0.05, "clack", 0.7),
      K.sfxAt(TL, "b0_1a", "kecelakaan", 0, "boom", 0.45),
      K.sfxAt(TL, "b0_2", "Suaranya persis.", 0.5, "pop", 0.5),
      K.sfxAt(TL, "b0_2", "memanggilnya persis.", 0.6, "pop", 0.5),
      K.sfxAt(TL, "b0_2", "terdengar sama.", 0.4, "pop", 0.55),
      K.sfxAt(TL, "b0_3", null, 0.7, "whoosh", 0.7),
      K.sfxAt(TL, "b0_3", "tidur lelap", 0, "shimmer", 0.4),
      K.sfxAt(TL, "b0_4", "dibuat oleh", -0.1, "pop", 0.5),
      K.sfxAt(TL, "b0_4", "Dan ada", -0.25, "whoosh", 0.8),
      K.sfxAt(TL, "b0_4", "pun dibuat", 0.46, "riser", 0.6),
      K.sfxAt(TL, "b0_4", "pun dibuat", heroOff, "boom", 0.5),
      K.sfxAt(TL, "b0_5", "meniru", 0, "shimmer", 0.45),
      K.sfxAt(TL, "b0_5", "keluarga", 0.05, "shimmer", 0.5),
      K.sfxAt(TL, "b0_5", "Mari kita", -0.4, "whoosh", 0.6),
      K.sfxAt(TL, "b0_5", "suara itu sendiri", 0.3, "riser", 0.5),
    ].filter(Boolean);
  };
})(typeof window !== "undefined" ? window : globalThis);
