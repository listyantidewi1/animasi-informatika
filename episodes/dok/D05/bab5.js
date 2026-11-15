/* D05 bab 5 — Tahap dua: memeras pengguna (b5_1 … b5_5).
   b5_1 papan "es teh gratis" dicopot, kamera bergeser ke pintu mitra di samping pasar: mobil boks pengiklan, pedagang, media berita antre;
   b5_2 beranda media sosial generik: kabar teman makin jarang (8 dari 10 → 2 dari 10, ilustrasi), media berita senang lalu bergantung;
   b5_3 kamera menyusuri lorong yang makin sempit oleh spanduk, lapak "Bersponsor" di depan, lapak Bu Sari di ujung dengan antrean kecil;
   b5_4 jam pasir perhatian mengalir ke corong "dijual ke pengiklan"; b5_5 para mitra masuk lewat pintu mitra, palang menutup pelan di belakang. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KY = KIT.layar;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};
  const DOOR = { x: 2500, w: 320, top: 470 };   // pintu mitra di dinding samping pasar (koordinat dunia)

  function pintuMitra(ctx, t, o = {}) {
    const { x, w, top } = DOOR, F = U.FLOOR;
    ctx.fillStyle = "#4B3A6A"; ctx.fillRect(x - w / 2, top + 60, w, F - top - 60);
    U.addLight(ctx, x, F - 120, 260, "#FFC66E", 0.35);
    ctx.fillStyle = "#2E7F8A"; ctx.fillRect(x - w / 2 - 30, top + 40, 30, F - top - 40); ctx.fillRect(x + w / 2, top + 40, 30, F - top - 40); ctx.fillRect(x - w / 2 - 30, top + 30, w + 60, 36);
    ctx.fillStyle = "#FFF6E6"; RR(ctx, x - 200, top - 60, 400, 80, 14); ctx.fill(); ctx.strokeStyle = "#2E7F8A"; ctx.lineWidth = 5; ctx.stroke();
    txt(ctx, "PINTU MITRA", x, top - 4, 48, { align: "center", weight: 900, color: "#2E7F8A" });
    if (o.palang != null && o.palang > 0) { const u = eout(clamp(o.palang)); ctx.save(); ctx.translate(x - w / 2 - 10, F - 260); ctx.rotate(lerp(-Math.PI / 2 + 0.15, 0, u));
      ctx.fillStyle = "#9A6A44"; RR(ctx, 0, -22, w + 30, 44, 10); ctx.fill(); ctx.fillStyle = "#3A2F6E"; for (let k = 50; k < w; k += 120) ctx.fillRect(k, -22, 18, 44); ctx.restore(); }
  }
  function truk(ctx, x, y, s, col, t, jalan) {   // mobil boks generik menghadap kiri; (x,y) = tanah di tengah
    ctx.save(); ctx.translate(x, y + (jalan ? Math.sin(t * 14) * 1.5 : 0));
    ctx.fillStyle = "rgba(10,8,30,0.25)"; ctx.beginPath(); ctx.ellipse(0, 4, s * 0.55, s * 0.05, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = col; RR(ctx, -s * 0.18, -s * 0.62, s * 0.7, s * 0.52, 10); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(-s * 0.18, -s * 0.62, s * 0.7, s * 0.06);
    ctx.fillStyle = "#E6EAF8"; RR(ctx, -s * 0.5, -s * 0.42, s * 0.34, s * 0.32, 10); ctx.fill(); ctx.fillStyle = "#7FB8F0"; RR(ctx, -s * 0.45, -s * 0.38, s * 0.16, s * 0.13, 6); ctx.fill();
    [-0.34, 0.32].forEach(k => { ctx.fillStyle = "#2A2350"; ctx.beginPath(); ctx.arc(k * s, -s * 0.09, s * 0.09, 0, TAU); ctx.fill(); ctx.fillStyle = "#8C93B8"; ctx.beginPath(); ctx.arc(k * s, -s * 0.09, s * 0.035, 0, TAU); ctx.fill(); });
    ctx.restore();
  }
  const TRUKS = [["pengiklan", "#FFB547"], ["pedagang", P.green], ["media berita", P.blue]];

  // ---------- b5_1 ----------
  S.b5_1 = function (ctx, b, l, t) {
    const tSedikit = D.at(b, "sedikit demi sedikit"), tMitra = D.at(b, "mitra bisnis"), tIklan = D.at(b, "pengiklan");
    const c = D.path([[0, 960, 560, 0.95], [tMitra - 0.8, 960, 560, 0.95], [tMitra + 1.0, 2420, 600, 0.95], [b.dur, 2440, 600, 0.98]], l);
    ctx.save(); U.camT(ctx, c);
    U.pasar(ctx, t, { esTeh: true, esTehOpt: { copot: clamp((l - tSedikit + 0.4) / 1.6) }, suram: 0.2 });
    U.palang(ctx, t, 1, 1);
    pintuMitra(ctx, t);
    TRUKS.forEach(([lab, col], i) => { const arr = eout(clamp((l - tIklan + 0.8 - i * 0.6) / 1.6)); truk(ctx, lerp(3700, 2780 + i * 380, arr), U.FLOOR + 110, 330, col, t, arr < 1); });
    U.pengunjung(ctx, t, 6, { y: 1010, h: 230, seed: 6, v: 40, x0: -200, x1: 1900 });
    ctx.restore();
    D.post(c2 => {
      tag(c2, "es teh gratis dicopot", 1310 - (c.x - 960), 460, pop(l, tSedikit).a * (1 - ramp(l, tMitra - 0.8, 0.3)), { sp: pop(l, tSedikit).sp, col: P.pink, size: 48 });
      TRUKS.forEach(([lab, col], i) => { const [x, y] = U.toS(c, 2780 + i * 380, U.FLOOR - 340); tag(c2, lab, x, y, pop(l, tIklan + i * 0.6).a, { sp: pop(l, tIklan + i * 0.6).sp, col, size: 44 }); });
      U.judul(c2, "mitra bisnis", 960, 150, 64, pop(l, tMitra).a, { sp: pop(l, tMitra).sp, col: P.amber });
    });
  };

  // ---------- b5_2: beranda ----------
  const KOMP = [["teman", "teman", "teman", "teman", "teman", "teman", "teman", "teman", "iklan", "berita"],
    ["iklan", "teman", "saran", "berita", "iklan", "teman", "saran", "iklan", "berita", "iklan"]];
  function koran(ctx, x, y, s, senyum, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.5) * 0.04);
    ctx.fillStyle = "#FFF6E6"; RR(ctx, -s * 0.5, -s * 0.62, s, s * 1.24, 12); ctx.fill(); ctx.fillStyle = "#2A4A8A"; ctx.fillRect(-s * 0.42, -s * 0.54, s * 0.84, s * 0.14);
    U.bars(ctx, -s * 0.42, -s * 0.28, s * 0.84, s * 0.05, 5, "rgba(40,50,100,0.35)", 3);
    ctx.strokeStyle = "#2A2350"; ctx.lineWidth = s * 0.05; ctx.lineCap = "round"; ctx.fillStyle = "#2A2350"; ctx.beginPath(); ctx.arc(-s * 0.16, s * 0.28, s * 0.05, 0, TAU); ctx.arc(s * 0.16, s * 0.28, s * 0.05, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.18, s * 0.42); ctx.quadraticCurveTo(0, s * (0.42 + 0.14 * senyum), s * 0.18, s * 0.42); ctx.stroke(); ctx.restore();
  }
  S.b5_2 = function (ctx, b, l, t) {
    const tFb = D.at(b, "Facebook"), tDulu = D.at(b, "dulu berisi"), tLambat = D.at(b, "lambat laun"), tArt = D.at(b, "artikel media"), tSenang = D.at(b, "Media-media itu"), tGantung = D.at(b, "semakin bergantung");
    D.bg(ctx, t, { top: "#1E2A66", bot: "#3A4F98", stars: 0.3 });
    const u = eio(clamp((l - tLambat) / 3.0)), sw = u > 0.5 ? 1 : 0;
    const komp = KOMP[0].map((k, i) => (u * 10 > i ? KOMP[1][i] : k));
    KY.hp(ctx, 620, 540, 860, { t, glow: 0.4, screen: (c, w, h, tt) => U.layarFeed(c, w, h, tt, { kartu: komp.concat(komp), scroll: (l * 26) % (h * 0.235 * 10), tagSize: 0 }) });
    // panel komposisi beranda: 10 kotak
    const px = 1150, py = 260; D.panel(ctx, px - 30, py - 90, 700, 420, { r: 22 });
    komp.forEach((k, i) => { const col = { teman: P.green, iklan: "#FFB547", saran: P.violet, berita: P.blue }[k]; const x = px + (i % 5) * 128, y = py + Math.floor(i / 5) * 128;
      ctx.fillStyle = col; RR(ctx, x, y, 108, 108, 18); ctx.fill(); if (k === "teman") { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + 54, y + 44, 18, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + 54, y + 92, 30, 22, 0, Math.PI, 0); ctx.fill(); } });
    const nT = komp.filter(k => k === "teman").length;
    // media berita: senang, lalu terikat
    const ka = ramp(l, tSenang - 0.3, 0.5); if (ka > 0) { ctx.save(); ctx.globalAlpha *= ka; koran(ctx, 1480, 820, 170, 1, t);
      const ga = ramp(l, tGantung, 0.8); if (ga > 0) { ctx.strokeStyle = D.hexA(P.pink, 0.9); ctx.lineWidth = 7; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); ctx.moveTo(1390, 800); ctx.quadraticCurveTo(1100, 940 - 140 * ga, 860, 760); ctx.stroke(); ctx.setLineDash([]); }
      ctx.restore(); }
    D.post(c2 => {
      tag(c2, "contoh Doctorow: Facebook", 620, 110 + 20, pop(l, tFb).a, { col: P.blue, size: 44 });
      txt(c2, `kabar teman: ${nT} dari 10`, px + 320, py - 30, 52, { align: "center", weight: 900, color: nT > 5 ? P.green : P.pink });
      tag(c2, "ilustrasi", px + 320, py + 290, 0.9, { col: P.ink2, size: 40 });
      tag(c2, "pembaca bertambah :)", 1480, 640 - 20, pop(l, tSenang).a * (1 - ramp(l, tGantung - 0.2, 0.3)), { sp: pop(l, tSenang).sp, col: P.green, size: 44 });
      tag(c2, "makin bergantung", 1480, 620, pop(l, tGantung).a, { sp: pop(l, tGantung).sp, col: P.pink, size: 48 });
    });
  };

  // ---------- b5_3: lorong ----------
  function lorongLapak(ctx, x, yF, s, flip, o, t) {   // lapak samping dalam perspektif sederhana (sisi menghadap tengah)
    ctx.save(); ctx.translate(x, yF); ctx.scale(flip ? -s : s, s);
    ctx.fillStyle = o.col; ctx.beginPath(); ctx.moveTo(0, -330); ctx.lineTo(260, -300); ctx.lineTo(260, -250); ctx.lineTo(0, -270); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFF3DE"; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(k * 65 + 32, -327 + k * 8); ctx.lineTo(k * 65 + 64, -323 + k * 8); ctx.lineTo(k * 65 + 64, -264 + k * 6); ctx.lineTo(k * 65 + 32, -266 + k * 6); ctx.fill(); }
    ctx.fillStyle = "#9A6A44"; ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(260, -100); ctx.lineTo(260, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(40,30,60,0.35)"; ctx.beginPath(); ctx.moveTo(0, -270); ctx.lineTo(260, -250); ctx.lineTo(260, -100); ctx.lineTo(0, -110); ctx.closePath(); ctx.fill();
    for (let k = 0; k < 4; k++) { ctx.fillStyle = U.AWN[(k + o.seed) % 7]; RR(ctx, 30 + k * 55, -150 + k * 3, 40, 34, 8); ctx.fill(); }
    ctx.restore();
  }
  S.b5_3 = function (ctx, b, l, t) {
    const tSpan = D.at(b, "spanduk"), tBayar = D.at(b, "pedagang yang membayar"), tTerbaik = D.at(b, "bukan yang terbaik");
    const VX = 960, VY = 470, camZ = l * 0.16, sempit = eio(clamp((l - tSpan + 0.5) / 4));
    // langit-langit, dinding, lantai lorong
    const gc = ctx.createLinearGradient(0, 0, 0, VY); gc.addColorStop(0, "#3A2F5E"); gc.addColorStop(1, "#6E4E6A"); ctx.fillStyle = gc; ctx.fillRect(0, 0, W, VY);
    const gf = ctx.createLinearGradient(0, VY, 0, HH); gf.addColorStop(0, "#8A6A58"); gf.addColorStop(1, "#C9A57E"); ctx.fillStyle = gf; ctx.fillRect(0, VY, W, HH - VY);
    ctx.strokeStyle = "rgba(60,40,30,0.25)"; ctx.lineWidth = 2; for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(VX + i * 20, VY); ctx.lineTo(VX + i * 400, HH); ctx.stroke(); }
    U.addLight(ctx, VX, VY, 300, "#FFC66E", 0.4);
    // ujung lorong: lapak Bu Sari dengan antrean kecil
    const zEnd = 7.2 - camZ, se = 1 / zEnd; ctx.save(); ctx.translate(VX, VY + 520 * se); ctx.scale(se * 2.4, se * 2.4);
    U.lapak(ctx, 0, 0, 260, { col: U.AWN[0], barang: "kue", t, seed: 4 });
    U.orang(ctx, -20, 70, 210, U.SARI, { pose: "berdiri", face: "senang", t });
    [[-180, 1], [-260, 0], [190, 1]].forEach(([x, f], i) => U.orang(ctx, x, 110, 200, { age: "dewasa", hair: ["pendek", "hijab", "kuncir"][i], skin: i + 1, top: U.AWN[i + 2], bottom: "#3B4785", outfit: "kaos", hijab: "#3FAE9E" }, { pose: "berdiri", t, flip: x > 0, face: "senang" }));
    ctx.restore();
    // lapak & spanduk dari jauh ke dekat
    for (let k = 6; k >= 0; k--) { const z = 1 + k * 0.95 - (camZ % 0.95) - Math.floor(camZ / 0.95) * 0 ; const zz = 0.75 + k * 0.95 - camZ; if (zz < 0.38 || zz > 7) continue; const s = 1 / zz;
      const off = lerp(560, 420, sempit) * s * 1.6, yF = VY + 520 * s;
      const sp = k <= 2; [-1, 1].forEach(side => lorongLapak(ctx, VX + side * off, yF, s * 1.25, side > 0, { col: U.AWN[(k * 2 + (side > 0)) % 7], seed: k }, t));
      // spanduk melintang (makin banyak saat lorong menyempit)
      if (sempit > k / 7) { const by = VY - 300 * s, bw = 760 * s * 1.4, bh = 120 * s; ctx.save(); ctx.globalAlpha *= clamp((sempit - k / 7) * 5);
        ctx.fillStyle = ["#FF5A5F", "#FFB547", "#9584FF", "#5AA9FF", "#FF6F91", "#5BD68A", "#3FD8C8"][k]; ctx.fillRect(VX - bw / 2, by - bh / 2, bw, bh);
        if (bh > 50) txt(ctx, ["PROMO!", "IKLAN", "DISKON?!", "BELI!", "IKLAN", "SALE", "PROMO!"][k], VX, by + bh * 0.22, Math.min(110, bh * 0.62), { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore(); }
      if (sp && s > 0.3) { const a = clamp((l - tBayar - k * 0.3) / 0.4); if (a > 0) D.post(c2 => { [-1, 1].forEach(side => U.sponsorTag(c2, VX + side * (off + 160 * s * 1.25), yF - 330 * s * 1.25 - 20, a, 300)); }); }
    }
    D.post(c2 => {
      tag(c2, "lapak Bu Sari, pembeli setia", VX, VY - 120, pop(l, tTerbaik).a, { sp: pop(l, tTerbaik).sp, col: P.green, size: 44 });
      tag(c2, "makin sempit oleh spanduk", VX, 150, pop(l, tSpan).a * (1 - ramp(l, tTerbaik - 0.3, 0.3)), { sp: pop(l, tSpan).sp, col: P.pink, size: 48 });
    });
  };

  // ---------- b5_4: jam pasir ----------
  function jamPasir(ctx, x, y, s, u, t) {   // u 0..1 = pasir yang sudah turun
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#8A5A3C"; RR(ctx, -s * 0.42, -s * 0.62, s * 0.84, s * 0.08, 6); ctx.fill(); RR(ctx, -s * 0.42, s * 0.54, s * 0.84, s * 0.08, 6); ctx.fill();
    ctx.fillStyle = "rgba(200,225,255,0.25)"; ctx.beginPath(); ctx.moveTo(-s * 0.32, -s * 0.54); ctx.lineTo(s * 0.32, -s * 0.54); ctx.quadraticCurveTo(s * 0.3, -s * 0.1, s * 0.04, 0); ctx.quadraticCurveTo(s * 0.3, s * 0.1, s * 0.32, s * 0.54); ctx.lineTo(-s * 0.32, s * 0.54); ctx.quadraticCurveTo(-s * 0.3, s * 0.1, -s * 0.04, 0); ctx.quadraticCurveTo(-s * 0.3, -s * 0.1, -s * 0.32, -s * 0.54); ctx.fill();
    ctx.fillStyle = "#FFD38A"; const top = 1 - u; ctx.beginPath(); ctx.moveTo(-s * 0.25 * top, -s * 0.02 - s * 0.4 * top); ctx.lineTo(s * 0.25 * top, -s * 0.02 - s * 0.4 * top); ctx.lineTo(0, -s * 0.02); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.3, s * 0.54); ctx.lineTo(s * 0.3, s * 0.54); ctx.lineTo(0, s * 0.54 - s * 0.45 * Math.sqrt(u)); ctx.fill();
    ctx.restore();
  }
  S.b5_4 = function (ctx, b, l, t) {
    const tUang = D.at(b, "tidak dimintai uang"), tWaktu = D.at(b, "waktu dan perhatianmu"), tDetik = D.at(b, "Setiap detik"), tJual = D.at(b, "dijual");
    U.studio(ctx, t, { top: "#1F2A62", bot: "#3A3F86" });
    U.orang(ctx, 420, 980, 520, U.RAKA, { pose: "pegangHP", t, face: "netral" });
    const u = clamp(l / b.dur * 0.8);
    jamPasir(ctx, 420, 300, 260, u, t);
    // aliran butir pasir ke corong
    const fa = ramp(l, tWaktu - 0.4, 0.6);
    if (fa > 0) for (let i = 0; i < 40; i++) { const k = ((l * 0.35 + i / 40) % 1); const x = lerp(470, 1260, k), y = 300 - Math.sin(k * Math.PI) * 160 + (i % 3) * 6; ctx.fillStyle = D.hexA("#FFD38A", 0.9 * fa); ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); }
    // corong
    ctx.fillStyle = "#8C93B8"; ctx.beginPath(); ctx.moveTo(1180, 240); ctx.lineTo(1420, 240); ctx.lineTo(1330, 420); ctx.lineTo(1270, 420); ctx.closePath(); ctx.fill(); ctx.fillRect(1270, 420, 60, 120);
    // koin keluar ke pengiklan
    const ja = ramp(l, tJual - 0.3, 0.6); if (ja > 0) { for (let i = 0; i < 4; i++) { const k = ((l * 0.6 + i / 4) % 1); ctx.fillStyle = "#FFC94D"; ctx.beginPath(); ctx.arc(1300 + k * 260, 560 + Math.sin(k * Math.PI) * -80 + k * 200, 16, 0, TAU); ctx.fill(); }
      ctx.save(); ctx.globalAlpha *= ja; U.juragan(ctx, 1680, 960, 300, { pose: "bagi", k: 0.7, t, dir: -1 }); ctx.restore(); }
    D.post(c2 => {
      const ua = pop(l, tUang); if (ua.a > 0) { tag(c2, "Rp", 760, 640, ua.a, { sp: ua.sp, col: P.green, size: 56 }); c2.save(); c2.globalAlpha = ua.a; c2.strokeStyle = P.red; c2.lineWidth = 10; c2.beginPath(); c2.moveTo(700, 680); c2.lineTo(820, 600); c2.stroke(); c2.restore();
        tag(c2, "tidak dimintai uang", 760, 750, ua.a, { col: P.green, size: 44 }); }
      tag(c2, "waktu + perhatian", 420, 100, pop(l, tWaktu).a, { sp: pop(l, tWaktu).sp, col: P.amber, size: 48 });
      tag(c2, "dijual ke pengiklan", 1300, 170, pop(l, tJual).a, { sp: pop(l, tJual).sp, col: P.pink, size: 52 });
      tag(c2, "setiap detik", 860, 470, pop(l, tDetik).a, { sp: pop(l, tDetik).sp, col: P.amber, size: 44 });
    });
  };

  // ---------- b5_5: mitra masuk, palang menutup ----------
  S.b5_5 = function (ctx, b, l, t) {
    const tTanpa = D.at(b, "tanpa sadar"), tPintu = D.at(b, "pintu yang sama");
    const c = { x: 2440, y: 600, z: lerp(1, 1.08, eio(l / b.dur)) };
    ctx.save(); U.camT(ctx, c);
    U.pasar(ctx, t, { esTeh: false, suram: 0.25 });
    pintuMitra(ctx, t, { palang: clamp((l - tPintu + 0.6) / 2.0) });
    // pedagang berjalan masuk sambil tersenyum (menjauh ke pintu)
    for (let i = 0; i < 4; i++) { const u = clamp((l * 0.09) + i * 0.12); const x = lerp(3000, DOOR.x, eio(u)), a = 1 - ramp(u, 0.92, 0.08);
      if (a <= 0) continue; ctx.save(); ctx.globalAlpha *= a; U.orang(ctx, x, U.FLOOR + 110 - i * 6, 300, { age: "dewasa", hair: ["hijab", "pendek", "botak", "kuncir"][i], skin: (i * 2 + 1) % 6, top: [P.amber, P.green, P.blue, P.pink][i], bottom: "#3B4785", outfit: "kemeja", hijab: "#8E6CE0" }, { pose: u < 1 ? "jalan" : "berdiri", flip: true, face: "senang", t: t + i, produkCol: "#FFB547" }); ctx.restore(); }
    truk(ctx, 3150, U.FLOOR + 110, 330, "#FFB547", t, false);
    ctx.restore();
    D.post(c2 => { tag(c2, "mitra bisnis senang", 960, 160, pop(l, 0.3).a * (1 - ramp(l, tTanpa, 0.3)), { col: P.green, size: 52 });
      tag(c2, "…masuk ke balik pintu yang sama", 960, 160, pop(l, tPintu - 0.3).a, { sp: pop(l, tPintu - 0.3).sp, col: P.pink, size: 52 }); });
  };

  K.SCENES.d05_b5 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d05_b5.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b5 = TL => [
    K.sfxAt(TL, "b5_1", "sedikit demi sedikit", 0.3, "clack", 0.5), K.sfxAt(TL, "b5_1", "mitra bisnis", 0, "whoosh", 0.5),
    K.sfxAt(TL, "b5_2", "lambat laun", 0, "riser", 0.4), K.sfxAt(TL, "b5_2", "semakin bergantung", 0, "pop", 0.5),
    K.sfxAt(TL, "b5_3", "spanduk", 0, "whoosh", 0.4), K.sfxAt(TL, "b5_3", "pedagang yang membayar", 0, "pop", 0.5),
    K.sfxAt(TL, "b5_4", "dijual", 0, "shimmer", 0.5), K.sfxAt(TL, "b5_5", "pintu yang sama", 1.0, "clack", 0.7),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
