/* D03 bab 6: "Kenapa telinga kita mudah tertipu?" (b6_1, b6_2, b6_3, b6_4).
   Metafora utama bab: "mesin telepon" yang memotong suara. Satu panggung bersambung di studio biru, semua keadaan dihitung dari
   waktu absolut (silang-pudar antarbeat tidak terlihat), kamera sendiri (noCam) yang menggeser ke kanan di b6_3.
   b6_1 sepuluh orang dewasa (dua lansia) berjajar; "tujuh" → tujuh orang menggaruk kepala di atas cakram oranye, tiga lainnya meredup;
        "7 dari 10" muncul saat diucapkan; Bip memegang papan survei; dua kartu spektrogram besar "suara asli" (anak, seed 23) dan
        "suara tiruan" (cacat terlihat: pita atas abu-abu kosong + garis datar "robot" berkedip) muncul tepat pada kata itu.
   b6_2 kerumunan turun, kartu memanjang menjadi lajur; "mesin telepon" turun dari atas tergantung kabel sejak "alasannya", jatuh pada
        "Suara di telepon"; "dipotong" → pita atas/bawah lepas dan jatuh (warna tetap, pudar sebelum y 900), label "nada tinggi dibuang" /
        "nada rendah dibuang"; "dikompres" → mesin memampat + tag "dikompres"; cacat tiruan ditandai setinggi pita yang dipotong, garis
        putus-putus menyambung ke bilah mesin, lalu tanda itu masuk mesin; "tersamarkan" → dua kaca pembesar besar (satu dipegang Bip)
        menunjukkan pita arsir yang sama di kedua keluaran; tab "asli"/"tiruan" pada lajur keluaran mulai di sini dan tetap ada.
   b6_3 kamera menggeser ke Bu Rina (lajur masuk memudar); keluaran tiruan berlubang; otak dalam gelembung mengirim kepingan puzzle
        yang menambal lubang; wajah anak berlubang puzzle (potongan terang bergaris putus) dilengkapi kepingan teal; "anak kita." → hati
        besar, tab menjadi "Anakku", Bip mengangkat papan "tiruan" sambil menggeleng.
   b6_4 panik: wajah panik, denyut jantung, layar memerah, gelembung jadi tanda seru; kaca pembesar Bip bergetar dan berembun;
        kartu "Telinga saja tidak cukup" dengan ikon telinga di atas Bu Rina, cincin di HP; kedua lajur bertukar tempat seperti tebak
        gelas (lengkung, garis kecepatan, aliran ke HP tetap menempel), "asli?" "tiruan?".
   Label alasan bertambah di kiri atas: 1 Suara telepon, 2 Otak mengisi, 3 Panik. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, L = KIT.layar, O = KIT.orang, LT = KIT.latar, B = KIT.bipkit;
  const { clamp, lerp, eio, spring } = D;
  const TAU = Math.PI * 2;
  const CREAM = "#FFF6E6", NAVY = "#1E2A6B";
  const IBU = Object.assign({}, L.SUARA.ibu, { seed: 11 }), ANAK = Object.assign({}, L.SUARA.anak, { seed: 23 });   // profil tetap seri
  // suara tiruan dari anak: irama sama (timing seed 23), warna sedikit lain, jejak buatan (pita atas hilang + garis datar)
  const TIRU = Object.assign({}, L.SUARA.tiruan, { f0: 282, formants: [670, 2010, 3290], serak: 0.04, timing: { seed: ANAK.seed, tempo: ANAK.tempo, jeda: ANAK.jeda } });
  void IBU;

  // ---------- panggung (koordinat dunia; kamera X = 0 di b6_1–b6_2) ----------
  const PXS = 150;                    // piksel per detik suara: semua lajur mengalir dengan kecepatan sama
  const XREF = 110;
  const FMAX = 5500, HI = 3400, LO = 300, CUTF = 1 - HI / FMAX;   // CUTF = tinggi pita atas yang dibuang (bagian dari lajur)
  const LH = 180, YA = 232, YB = 520;
  const IN = { x: 110, w: 650 }, OUT = { x: 1126, w: 590 };
  const BOX = { x: 735, y: 186, w: 390, h: 584 };
  const CARD_A = { x: 860, y: 316, w: 470, h: 220 }, CARD_B = { x: 1400, y: 316, w: 470, h: 220 };
  const RINA = { x: 2330, y: 880, h: 560 };
  const BUB = { x: 2040, y: 255, r: 135 };
  const PAN = 640;
  const BIP_S = 196, BIP_Y = 800;
  const HOLES = [0.2, 0.49, 0.77], HOLE_W = 0.09;
  const GARUK = [0, 1, 3, 4, 6, 8, 9], LANSIA = [2, 8];

  // ---------- waktu kejadian (detik absolut, dari kata sungguhan) ----------
  let EVk = null, EVc = null;
  function EV(TL) {
    if (EVk === TL && EVc) return EVc;
    const bb = id => TL.beats.find(x => x.id === id);
    const A = (id, s, o = 0) => { const b = bb(id); return b.start + D.at(b, s) + o; };
    const E = (id, s, o = 0) => { const b = bb(id); return b.start + D.atEnd(b, s) + o; };
    const e = {};
    ["b6_1", "b6_2", "b6_3", "b6_4"].forEach(id => { const b = bb(id); e[id] = b.start; e[id + "e"] = b.start + b.dur; e[id + "s"] = b.start + D.speechEnd(b); });
    // b6_1
    e.survei = A("b6_1", "survei"); e.tujuh = A("b6_1", "tujuh"); e.sepuluh = A("b6_1", "sepuluh"); e.dewasa = A("b6_1", "dewasa");
    e.yakin = A("b6_1", "tidak yakin"); e.asli1 = A("b6_1", "suara asli"); e.tiru1 = A("b6_1", "suara tiruan"); e.tiru1E = E("b6_1", "suara tiruan");
    // b6_2
    e.ada = A("b6_2", "Ada beberapa"); e.alasan = A("b6_2", "alasannya"); e.tel = A("b6_2", "Suara di telepon"); e.potong = A("b6_2", "dipotong"); e.kompres = A("b6_2", "dikompres");
    e.kurang = A("b6_2", "kurang jelas"); e.cacat = A("b6_2", "Ketidaksempurnaan"); e.tiru2 = A("b6_2", "suara tiruan jadi"); e.samar = A("b6_2", "tersamarkan");
    // b6_3
    e.selain = A("b6_3", "Selain itu"); e.otak = A("b6_3", "otak kita"); e.isi = A("b6_3", "mengisi"); e.kosong = A("b6_3", "kekosongan");
    e.dengar = A("b6_3", "mendengar"); e.mirip = A("b6_3", "mirip"); e.anak = A("b6_3", "anak kita,"); e.otak2 = A("b6_3", "otak langsung");
    e.lengkap = A("b6_3", "melengkapinya"); e.jadi3 = A("b6_3", "menjadi suara"); e.anak2 = A("b6_3", "anak kita.");
    // b6_4
    e.panik = A("b6_4", "panik"); e.dengar4 = A("b6_4", "mendengarkan"); e.teliti = A("b6_4", "teliti"); e.jadi = A("b6_4", "Jadi,");
    e.jangan = A("b6_4", "jangan"); e.telinga = A("b6_4", "telinga"); e.saja = A("b6_4", "saja"); e.untuk = A("b6_4", "untuk membedakan");
    e.bedakan = A("b6_4", "membedakan"); e.asli4 = A("b6_4", "asli dan"); e.tiru4 = A("b6_4", "suara tiruan.");
    EVk = TL; EVc = e; return e;
  }

  const win = (t, a, b, fi = 0.3, fo = 0.3) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));
  const pop = (t, t0, k = 11, z = 0.5) => (t <= t0 ? 0 : Math.min(1.08, spring(t - t0, k, z)));
  const fd = (t, t0, d = 0.35) => clamp((t - t0) / d);
  const qpt = (p0, p1, p2, u) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });

  // ---------- kamera ----------
  function camAt(e, t) {
    const X = PAN * eio((t - e.b6_3 + 0.05) / 1.6);
    const z = 1 + 0.018 * Math.sin((t - e.b6_1) * 0.32) + 0.035 * eio((t - e.b6_4) / 9);
    const Y = -8 * eio((t - e.b6_4) / 9);
    return { X, Y, z };
  }
  const toS = (c, x, y) => [(x - 960 - c.X) * c.z + 960, (y - 540 - c.Y) * c.z + 540];
  const applyCam = (ctx, c) => { ctx.translate(960, 540); ctx.scale(c.z, c.z); ctx.translate(-960 - c.X, -540 - c.Y); };

  // ---------- aliran suara: posisi pola sama di semua lajur ----------
  function flowS(e, t) {
    const v = 0.55, a = Math.min(t, e.b6_3) - e.b6_1, r = clamp(t - e.b6_3, 0, 1.2) / 1.2;
    return 30 - v * a - v * 1.2 * (r - r * r / 2);
  }
  const scrollAt = (S, x0) => S + (x0 - XREF) / PXS;

  // ---------- pembantu gambar ----------
  function font(c, size, w = 800) { c.font = `${w} ${size}px ${K.FONT}`; }
  function pillL(c, s, x, cy, opt = {}) {   // pil rata kiri; kembali lebar
    const size = opt.size || 44; font(c, size, opt.weight || 800); const w = c.measureText(s).width + size * 1.1 + (opt.lead || 0), h = size * 1.62;
    c.save(); c.globalAlpha *= opt.a == null ? 1 : opt.a;
    c.fillStyle = "rgba(10,16,48,0.35)"; H.rr(c, x + 4, cy - h / 2 + 7, w, h, h / 2); c.fill();
    c.fillStyle = opt.fill || CREAM; H.rr(c, x, cy - h / 2, w, h, h / 2); c.fill();
    if (opt.stroke) { c.strokeStyle = opt.stroke; c.lineWidth = 4; c.stroke(); }
    D.txt(c, s, x + size * 0.55 + (opt.lead || 0), cy + size * 0.36, size, { color: opt.color || NAVY, weight: opt.weight || 800 });
    c.restore(); return w;
  }
  const pillW = (c, s, size = 44, lead = 0) => { font(c, size, 800); return c.measureText(s).width + size * 1.1 + lead; };
  function pillC(c, s, cx, cy, opt = {}) { return pillL(c, s, cx - pillW(c, s, opt.size || 44, opt.lead || 0) / 2, cy, opt); }
  function qmark(c, x, y, size, a = 1, col = P.amber) {   // tanda tanya besar dengan lingkaran
    if (a <= 0) return; c.save(); c.globalAlpha *= clamp(a * 1.6); c.translate(x, y); const s = a < 1 ? lerp(0.82, 1, a) : Math.min(1.1, a);
    c.scale(s, s); D.glow(c, 0, 0, size * 0.9, col, 0.35);
    c.fillStyle = CREAM; c.beginPath(); c.arc(0, 0, size * 0.62, 0, TAU); c.fill(); c.strokeStyle = col; c.lineWidth = 5; c.stroke();
    D.txt(c, "?", 0, size * 0.33, size, { align: "center", color: "#E0892A", weight: 900 }); c.restore();
  }
  function heart(c, x, y, s, col = P.pink, a = 1) {   // s = lebar hati (px)
    if (a <= 0 || s <= 0) return; c.save(); c.globalAlpha *= clamp(a); c.translate(x, y); c.scale(s / 60, s / 60);
    D.glow(c, 0, 0, 70, col, 0.45); c.fillStyle = "rgba(255,255,255,0.95)"; c.beginPath(); c.moveTo(0, 25);
    c.bezierCurveTo(-46, -6, -30, -46, 0, -22); c.bezierCurveTo(30, -46, 46, -6, 0, 25); c.fill();
    c.fillStyle = col; c.beginPath(); c.moveTo(0, 19);
    c.bezierCurveTo(-38, -6, -25, -38, 0, -17); c.bezierCurveTo(25, -38, 38, -6, 0, 19); c.fill();
    c.fillStyle = "rgba(255,255,255,0.55)"; c.beginPath(); c.ellipse(-14, -18, 6, 9, -0.5, 0, TAU); c.fill(); c.restore();
  }
  // kepingan puzzle (persegi dengan tonjolan di atas dan kanan)
  function puzzlePath(c, x, y, w, h) {
    const k = Math.min(w, h) * 0.2;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * 0.38, y); c.arc(x + w * 0.5, y, k, Math.PI, 0, false); c.lineTo(x + w, y);
    c.lineTo(x + w, y + h * 0.38); c.arc(x + w, y + h * 0.5, k, -Math.PI / 2, Math.PI / 2, false); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath();
  }
  function brain(c, x, y, r, t, a = 1) {
    if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y);
    const lobes = [[-0.42, -0.1, 0.5], [0.0, -0.32, 0.52], [0.42, -0.12, 0.5], [-0.2, 0.25, 0.45], [0.25, 0.24, 0.45]];
    c.fillStyle = "#F58FB0"; lobes.forEach(([lx, ly, lr]) => { c.beginPath(); c.arc(lx * r, ly * r, lr * r, 0, TAU); c.fill(); });
    c.fillStyle = "#FFB3C9"; lobes.forEach(([lx, ly, lr]) => { c.beginPath(); c.arc(lx * r - lr * r * 0.18, ly * r - lr * r * 0.2, lr * r * 0.6, 0, TAU); c.fill(); });
    c.strokeStyle = "#C2577E"; c.lineWidth = Math.max(3, r * 0.06); c.lineCap = "round";
    c.beginPath(); c.moveTo(0, -0.75 * r); c.quadraticCurveTo(-0.08 * r, 0, 0.02 * r, 0.55 * r); c.stroke();
    [[-0.55, -0.2, -0.2, 0.05], [-0.4, 0.3, -0.12, 0.15], [0.25, -0.45, 0.5, -0.15], [0.3, 0.35, 0.6, 0.15], [-0.3, -0.5, -0.1, -0.35]].forEach(([x0, y0, x1, y1]) => {
      c.beginPath(); c.moveTo(x0 * r, y0 * r); c.quadraticCurveTo((x0 + x1) / 2 * r, (y0 + y1) / 2 * r - r * 0.12, x1 * r, y1 * r); c.stroke(); });
    for (let i = 0; i < 3; i++) { const ang = t * 1.4 + i * 2.1, rr = r * 0.95; const sx = Math.cos(ang) * rr, sy = Math.sin(ang) * rr * 0.8;
      c.fillStyle = "rgba(255,246,230,0.9)"; c.beginPath(); c.arc(sx, sy, r * 0.05 * (0.6 + 0.4 * Math.sin(t * 5 + i)), 0, TAU); c.fill(); }
    c.restore();
  }
  // papan survei yang dipegang Bip: sepuluh kepala kecil, tujuh berubah oranye
  function clipboard(c, x, y, w, nOn) {
    const h = w * 1.25;
    c.save(); c.translate(x, y); c.rotate(-0.06);
    c.fillStyle = "rgba(14,18,60,0.3)"; H.rr(c, -w / 2 + 5, -h / 2 + 7, w, h, w * 0.08); c.fill();
    c.fillStyle = "#B5793E"; H.rr(c, -w / 2, -h / 2, w, h, w * 0.08); c.fill();
    c.fillStyle = "#FFFDF6"; H.rr(c, -w * 0.42, -h * 0.4, w * 0.84, h * 0.82, w * 0.04); c.fill();
    c.fillStyle = "#8B95B8"; H.rr(c, -w * 0.2, -h * 0.53, w * 0.4, h * 0.13, w * 0.04); c.fill();
    for (let i = 0; i < 10; i++) { const col = i % 5, row = Math.floor(i / 5), px = -w * 0.3 + col * w * 0.15, py = -h * 0.18 + row * h * 0.3, on = GARUK.indexOf(i) >= 0 && GARUK.indexOf(i) < nOn;
      c.fillStyle = on ? "#FFB547" : "#7E8BC9"; c.beginPath(); c.arc(px, py, w * 0.05, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(px, py + w * 0.1, w * 0.06, w * 0.045, 0, Math.PI, 0); c.fill(); }
    c.restore();
  }
  // papan kecil "tiruan" yang diangkat Bip
  function signTiruan(c, x, y, s, a = 1) {
    if (a <= 0) return; const w = 200, h = 82;
    c.save(); c.globalAlpha *= clamp(a); c.translate(x, y); c.rotate(0.05 * Math.sin(c.__t * 3)); c.scale(Math.min(1, a), Math.min(1, a));
    c.fillStyle = "#8A6A4E"; H.rr(c, -6, 10, 12, 70, 5); c.fill();
    c.fillStyle = "rgba(14,18,60,0.3)"; H.rr(c, -w / 2 + 5, -h / 2 + 7, w, h, 16); c.fill();
    c.fillStyle = P.pink; H.rr(c, -w / 2, -h / 2, w, h, 16); c.fill(); c.strokeStyle = "#FFFFFF"; c.lineWidth = 4; c.stroke();
    D.txt(c, "tiruan", 0, 16, 44, { align: "center", weight: 900, color: "#141A4A" });
    c.restore();
  }
  // ikon telinga sederhana
  function ear(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s / 100, s / 100);
    c.fillStyle = "#F2B58C"; c.strokeStyle = "#9C5B3B"; c.lineWidth = 7; c.lineJoin = "round";
    c.beginPath(); c.moveTo(-8, 44); c.bezierCurveTo(-34, 30, -40, -10, -30, -28); c.bezierCurveTo(-18, -52, 24, -54, 34, -24);
    c.bezierCurveTo(42, 0, 22, 12, 14, 26); c.bezierCurveTo(8, 40, 6, 52, -8, 44); c.closePath(); c.fill(); c.stroke();
    c.lineWidth = 6; c.beginPath(); c.moveTo(-14, -16); c.bezierCurveTo(-6, -32, 18, -30, 18, -12); c.bezierCurveTo(18, 2, 4, 6, 2, 16); c.stroke();
    c.restore();
  }

  // layar HP Bu Rina (tanpa teks kecil): panggilan berlangsung dengan avatar dan bar suara
  function callScreen(c, w, h, t) {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#5B6AE0"); g.addColorStop(1, "#3A43A8"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#3FD8C8"; c.beginPath(); c.arc(w / 2, h * 0.3, w * 0.2, 0, TAU); c.fill();
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(w / 2, h * 0.27, w * 0.07, 0, TAU); c.fill(); c.beginPath(); c.ellipse(w / 2, h * 0.37, w * 0.12, w * 0.06, 0, Math.PI, 0); c.fill();
    for (let i = 0; i < 5; i++) { const v = 0.3 + 0.7 * Math.abs(Math.sin(t * 6 + i)); c.fillStyle = "rgba(255,255,255,0.85)"; c.fillRect(w * (0.26 + i * 0.11), h * 0.56 - h * 0.06 * v, w * 0.06, h * 0.12 * v); }
    c.fillStyle = "#FF5A5F"; c.beginPath(); c.arc(w / 2, h * 0.82, w * 0.12, 0, TAU); c.fill();
  }
  // tab label di atas lajur
  function tabW(c, s, x, y, col, a = 1) {
    if (a <= 0) return; const size = 44; font(c, size, 800); const tw = c.measureText(s).width + size * 0.9, th = size * 1.35;
    c.save(); c.globalAlpha *= clamp(a); c.translate(x, y); c.scale(1, Math.min(1, a)); c.fillStyle = col; H.rr(c, 0, -th, tw, th + size * 0.5, size * 0.3); c.fill();
    D.txt(c, s, size * 0.45, -th / 2 + size * 0.36, size, { color: "#141A4A", weight: 800 }); c.restore();
  }
  // satu lajur spektrogram yang ikut aliran
  function lane(c, r, prof, S, opt = {}) {
    return L.spektrogram(c, r.x, r.y, r.w, r.h, Object.assign({ profil: prof, dur: r.w / PXS, scroll: scrollAt(S, r.x), fmax: FMAX, r: 14 }, opt));
  }
  // cacat suara tiruan yang terlihat: pita atas abu-abu kosong + tiga garis datar "robot" yang berkedip, ikut aliran
  function flaws(c, r, S, t, a = 1, rv = 1) {
    if (a <= 0 || rv <= 0) return; const yb = r.y + r.h * CUTF;
    c.save(); c.globalAlpha *= clamp(a); H.rr(c, r.x, r.y, r.w, r.h, 14); c.clip(); c.beginPath(); c.rect(r.x, r.y, r.w * rv, yb - r.y); c.clip();
    c.globalCompositeOperation = "saturation"; c.fillStyle = "#808080"; c.fillRect(r.x, r.y, r.w, yb - r.y);
    c.globalCompositeOperation = "source-over"; c.fillStyle = "rgba(122,128,160,0.5)"; c.fillRect(r.x, r.y, r.w, yb - r.y);
    const off = scrollAt(S, r.x) * PXS;
    [3900, 4500, 5100].forEach((hz, i) => {
      const y = r.y + r.h * (1 - hz / FMAX), fl = 0.7 + 0.3 * Math.sin(t * 19 + i * 2.1) * Math.sin(t * 7.3 + i * 1.3), per = [190, 160, 220][i];
      c.setLineDash([per * 0.78, per * 0.22]); c.lineDashOffset = off + i * 57; c.lineCap = "butt";
      c.strokeStyle = D.hexA(P.pink, 0.45 * fl); c.lineWidth = Math.max(9, r.h * 0.055); c.beginPath(); c.moveTo(r.x - 20, y); c.lineTo(r.x + r.w + 20, y); c.stroke();
      c.strokeStyle = D.hexA("#F6F8FF", 0.95 * fl); c.lineWidth = Math.max(3.5, r.h * 0.022); c.beginPath(); c.moveTo(r.x - 20, y); c.lineTo(r.x + r.w + 20, y); c.stroke();
    });
    c.setLineDash([]); c.restore();
  }
  // potongan pita (atas/bawah) yang lepas lalu jatuh; warna tetap, pudar sebelum y 900
  function fallingBands(c, r, prof, S, tc, col, isTiru) {
    const tau0 = c.__t - tc; if (tau0 <= 0 || tau0 > 1.3) return;
    const yOf = hz => r.y + r.h * (1 - hz / FMAX), x0 = r.x, w = r.w, n = 4;
    [[r.y, yOf(HI)], [yOf(LO), r.y + r.h]].forEach(([y0, y1], band) => {
      for (let k = 0; k < n; k++) {
        const tau = tau0 - k * 0.05 - band * 0.08; if (tau <= 0 || tau > 1.1) continue;
        const cx = x0 + (k + 0.5) * w / n, cy = (y0 + y1) / 2, dy = 0.5 * 1500 * tau * tau - (band ? 40 * tau : 220 * tau), dx = (k - 1.5) * 40 * tau, rot = (k % 2 ? 1 : -1) * 0.6 * tau;
        const a = clamp(1 - tau / 1.05) * clamp((860 - (cy + dy)) / 140); if (a <= 0) continue;
        c.save(); c.globalAlpha *= a; c.translate(cx + dx, cy + dy); c.rotate(rot); c.translate(-cx, -cy);
        const sx = x0 + k * w / n + 3, sw = w / n - 6;
        c.save(); c.beginPath(); c.rect(sx, y0, sw, y1 - y0); c.clip();
        lane(c, r, prof, S, { frame: false, r: 0 });
        if (isTiru && !band) flaws(c, r, S, c.__t, 1);
        c.fillStyle = "rgba(255,255,255,0.12)"; c.fillRect(sx, y0, sw, y1 - y0);
        c.restore();
        c.strokeStyle = col; c.lineWidth = 4; c.strokeRect(sx, y0, sw, y1 - y0);
        c.restore();
      }
    });
  }

  // ---------- mesin telepon ----------
  function machine(c, t, e) {
    const tb = e.tel - 0.25, ta = e.alasan - 0.1;
    if (t < ta) return null;
    const { x, y, w, h } = BOX; const cx = x + w / 2;
    // turun tergantung kabel sejak "alasannya", lalu jatuh dan mendarat pada "Suara di telepon"
    const hang = lerp(-640, -300, eio((t - ta) / (tb - ta))) + 8 * Math.sin((t - ta) * 2.6);
    const yOff = t < tb ? hang : lerp(-300, 0, 1) + (1 - spring(t - tb, 8, 0.5)) * -300;
    const sway = t < tb ? 0.02 * Math.sin((t - ta) * 2.1) : 0;
    const sq = t > e.kompres ? 0.07 * Math.exp(-(t - e.kompres) * 4) * Math.sin((t - e.kompres) * 18) : 0;
    // bayangan lantai membesar
    const near = clamp(1 + yOff / 860);
    c.save(); c.fillStyle = D.hexA("#0A0E32", 0.35 * near); c.beginPath(); c.ellipse(cx, y + h + 6, w * 0.55 * (0.4 + 0.6 * near), 18 * (0.4 + 0.6 * near), 0, 0, TAU); c.fill(); c.restore();
    // kabel (sebelum jatuh) lalu tersentak ke atas
    const cab = t < tb ? 1 : 1 - fd(t, tb, 0.25);
    if (cab > 0) { const ty = y + yOff, top = t < tb ? -60 : lerp(ty, -60, fd(t, tb, 0.25));
      c.save(); c.strokeStyle = "#1A2058"; c.lineWidth = 8; c.beginPath(); c.moveTo(cx, top); c.lineTo(cx, ty + 4); c.stroke();
      c.strokeStyle = "rgba(200,212,255,0.5)"; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 2, top); c.lineTo(cx - 2, ty + 4); c.stroke();
      c.fillStyle = "#1A2058"; c.beginPath(); c.arc(cx, ty + 2, 14, Math.PI, 0); c.fill(); c.restore(); }
    c.save(); c.translate(0, yOff); c.translate(cx, y); c.rotate(sway); c.translate(-cx, -y);
    c.translate(cx, y + h); c.scale(1 + sq * 0.6, 1 - sq); c.translate(-cx, -(y + h));
    const gr = c.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, "#4152A8"); gr.addColorStop(1, "#28337A");
    c.fillStyle = gr; H.rr(c, x, y, w, h, 34); c.fill();
    c.strokeStyle = "rgba(170,190,255,0.55)"; c.lineWidth = 4; c.stroke();
    // kepala mesin: ikon telepon (tulisan "telepon" di lapisan label)
    c.fillStyle = "#1D2566"; H.rr(c, x + 18, y + 16, w - 36, 92, 24); c.fill();
    const ring = 0.5 + 0.5 * Math.sin(t * 6);
    D.glow(c, x + 70, y + 62, 48, P.green, 0.35 + 0.25 * ring);
    c.fillStyle = P.green; c.beginPath(); c.arc(x + 70, y + 62, 30, 0, TAU); c.fill();
    L.ikon(c, "telepon", x + 70, y + 62, 26, "#FFFFFF");
    const cutHi = t > e.cacat ? win(t, e.cacat, e.tiru2 + 0.9, 0.3, 0.3) : 0;   // bilah atas menyala merah muda saat cacat ditandai
    [YA, YB].forEach((ly, li) => { c.fillStyle = "#151B52"; H.rr(c, x - 6, ly - 10, 26, LH + 20, 10); c.fill(); H.rr(c, x + w - 20, ly - 10, 26, LH + 20, 10); c.fill();
      // sisir penyaring: dua bilah di batas 3400 Hz dan 300 Hz
      const yh = ly + LH * CUTF, yl = ly + LH * (1 - LO / FMAX), snap = t > e.potong ? Math.exp(-(t - e.potong) * 5) : 0;
      [yh, yl].forEach((yy, i) => { const hot = li === 1 && i === 0 ? cutHi * (0.6 + 0.4 * Math.sin(t * 10)) : 0;
        if (hot > 0) D.glow(c, x + w / 2, yy, 120, P.pink, 0.6 * hot);
        c.fillStyle = hot > 0.3 ? "#FFB3C9" : "#C7D2FF"; const bx = x + 40 + snap * 18 * (i ? 1 : -1);
        c.beginPath(); c.moveTo(bx, yy - 7); c.lineTo(x + w - 40, yy - 3); c.lineTo(x + w - 40, yy + 3); c.lineTo(bx, yy + 7); c.closePath(); c.fill();
        if (snap > 0.02) { c.strokeStyle = D.hexA("#FFFFFF", snap); c.lineWidth = 6; c.beginPath(); c.moveTo(x + 40, yy); c.lineTo(x + w - 40, yy); c.stroke(); } });
      for (let i = 0; i < 6; i++) { const u = ((t * 0.9 + i / 6) % 1), px = x + 56 + u * (w - 112), py = ly + LH * 0.5 + Math.sin(u * 9 + i) * 10;
        c.fillStyle = D.hexA(P.teal, 0.9 * Math.sin(u * Math.PI)); c.beginPath(); c.arc(px, py, 7, 0, TAU); c.fill(); } });
    // panel tengah: pengeras suara, berubah menjadi tag "dikompres" dengan ikon penjepit
    const gy = (YA + LH + YB) / 2 + 4, kp = fd(t, e.kompres, 0.3);
    c.fillStyle = kp > 0 ? "#141A4A" : "#1D2566"; H.rr(c, x + 20, gy - 46, w - 40, 92, 46); c.fill();
    if (kp > 0) { c.strokeStyle = D.hexA(P.amber, kp); c.lineWidth = 4; c.stroke(); }
    for (let i = 0; i < 9; i++) { const lvl = 0.35 + 0.65 * Math.abs(Math.sin(t * 7 + i * 0.9)); c.fillStyle = D.hexA(P.amber, 0.85 * (1 - kp));
      H.rr(c, x + 92 + i * 25, gy - 30 * lvl, 12, 60 * lvl, 6); c.fill(); }
    if (kp > 0) {   // ikon penjepit: dua pelat menekan bar
      const px = x + 66, pz = 6 * Math.exp(-(t - e.kompres) * 3) * Math.sin((t - e.kompres) * 16);
      c.save(); c.globalAlpha *= kp; c.fillStyle = P.amber;
      H.rr(c, px - 26, gy - 34 + pz, 52, 10, 4); c.fill(); H.rr(c, px - 26, gy + 24 - pz, 52, 10, 4); c.fill();
      c.fillStyle = "#FF8FB1"; H.rr(c, px - 22, gy - 18 + pz, 44, 36 - 2 * pz, 6); c.fill();
      c.fillStyle = P.amber; [[-1, gy - 46], [1, gy + 46]].forEach(([sg, yy]) => { c.beginPath(); c.moveTo(px - 9, yy); c.lineTo(px + 9, yy); c.lineTo(px, yy + sg * 12); c.closePath(); c.fill(); });
      c.restore();
    }
    c.fillStyle = "#1D2566"; H.rr(c, x + 40, y + h - 30, 70, 30, 8); c.fill(); H.rr(c, x + w - 110, y + h - 30, 70, 30, 8); c.fill();
    c.fillStyle = t % 1.2 < 0.6 ? P.red : "#7A2A4A"; c.beginPath(); c.arc(x + w - 46, y + h - 62, 9, 0, TAU); c.fill();
    c.restore();
    return { yOff, label: [x + 118, y + 62 + yOff], kom: [x + 104, gy + yOff], kp };
  }

  // ---------- adegan ----------
  function scene(ctx, b, l, t, TL) {
    const e = EV(TL), cam = camAt(e, t), S = flowS(e, t);
    ctx.__t = t;
    LT.studio(ctx, t, { warna: "biru", floorY: 830, px: cam.X / 1000 });
    const posts = [];
    ctx.save(); applyCam(ctx, cam);

    // ---------- kerumunan (b6_1): 10 orang dewasa (2 lansia); 7 menggaruk kepala di atas cakram oranye, 3 lainnya meredup ----------
    const sink = eio((t - e.b6_2) / 1.0);
    if (sink < 1) {
      const dim = fd(t, e.tujuh + 0.4, 0.5);
      const gest = i => {
        const k = GARUK.indexOf(i);
        if (k < 0) return { pose: "berdiri", face: t > e.tujuh + 0.9 ? "senang" : "netral", look: [0.3, -0.2] };
        const u = eio((t - e.tujuh - k * 0.1) / 0.35);
        return u <= 0 ? { pose: "berdiri", look: [0.3, -0.2] } : { pose: "berdiri", blend: { to: "garuk", k: u }, face: u > 0.5 ? "bingung" : "netral", tanya: false };
      };
      const each = only => (i, o) => { o.age = "dewasa"; if (LANSIA.indexOf(i) >= 0) { o.age = "lansia"; o.hair = "uban"; if (i === 8) o.kacamata = true; }
        const isG = GARUK.indexOf(i) >= 0; if (only === "g" ? !isG : isG) o.alpha = 0; return o; };
      const copt = only => ({ h: 255, t, seed: 6, gesture: gest, each: each(only) });
      ctx.save(); ctx.globalAlpha *= 1 - sink * 0.6; ctx.translate(0, sink * 520);
      // lapis 1: tiga orang yang yakin (meredup), sekaligus mengambil posisi semua orang
      if (dim > 0) ctx.filter = `brightness(${1 - 0.32 * dim}) saturate(${1 - 0.45 * dim})`;
      const anc = O.crowd(ctx, 860, 900, 1380, 10, copt("n"));
      ctx.filter = "none";
      // cakram oranye di lantai untuk tujuh orang yang tidak yakin
      GARUK.forEach((i, k) => { const a = pop(t, e.tujuh + k * 0.1, 12, 0.6); if (a <= 0) return; const [fx, fy] = anc[i].feet;
        ctx.save(); ctx.globalAlpha *= clamp(a); D.glow(ctx, fx, fy - 30, 110, P.amber, 0.3); ctx.fillStyle = D.hexA(P.amber, 0.75);
        ctx.beginPath(); ctx.ellipse(fx, fy + 2, 62 * Math.min(1, a), 17 * Math.min(1, a), 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#FFE1A8"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); });
      O.crowd(ctx, 860, 900, 1380, 10, copt("g"));
      ctx.restore();
      GARUK.forEach((i, k) => { const a = anc[i], tq = e.tujuh + k * 0.1 + 0.15;
        const al = pop(t, tq) * (1 - fd(t, e.b6_2, 0.25)); if (al > 0) posts.push(c => { const [sx, sy] = toS(cam, a.top[0], a.top[1] - 50 + sink * 520 + Math.sin(t * 2.4 + i) * 5); qmark(c, sx, sy, 64, al); }); });
    }

    // ---------- lajur masuk (kartu → lajur), memudar setelah kamera menggeser ----------
    const mv = eio((t - e.b6_2 - 0.1) / 1.3);
    const rA = lerpR(CARD_A, { x: IN.x, y: YA, w: IN.w, h: LH }, mv), rB = lerpR(CARD_B, { x: IN.x, y: YB, w: IN.w, h: LH }, mv);
    const pA = pop(t, e.asli1), pB = pop(t, e.tiru1), inA = 1 - fd(t, e.b6_3 + 0.2, 0.9);
    const drawCard = (r, prof, p, lab, col, tiru) => {
      if (p <= 0 || inA <= 0) return; const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      ctx.save(); ctx.globalAlpha *= clamp(p * 1.5) * inA; ctx.translate(cx, cy); ctx.scale(p, p); ctx.translate(-cx, -cy);
      tabW(ctx, lab, r.x + 9, r.y + 3, col, 1 - fd(t, e.b6_3 + 0.02, 0.3)); lane(ctx, r, prof, S, { aksen: col });
      if (tiru) flaws(ctx, r, S, t, 1);
      ctx.restore();
    };
    drawCard(rA, ANAK, pA, "suara asli", P.teal, false);
    drawCard(rB, TIRU, pB, "suara tiruan", P.pink, true);
    const qa = pop(t, e.tiru1E - 0.05) * (1 - fd(t, e.b6_2, 0.3));
    if (qa > 0) posts.push(c => { const [sx, sy] = toS(cam, (CARD_A.x + CARD_A.w + CARD_B.x) / 2, CARD_A.y + CARD_A.h / 2); qmark(c, sx, sy, 60, qa); });

    // ---------- mesin ----------
    const M = machine(ctx, t, e);
    if (M) posts.push(c => { const [sx, sy] = toS(cam, M.label[0], M.label[1]); if (sy > 175) { c.save(); c.globalAlpha *= clamp((sy - 175) / 50); D.txt(c, "telepon", sx, sy + 17, 48, { weight: 900, color: "#FFFFFF" }); c.restore(); }
      if (M.kp > 0) { const [kx, ky] = toS(cam, M.kom[0], M.kom[1]); const s = lerp(0.92, 1, clamp(pop(t, e.kompres))); c.save(); c.globalAlpha *= M.kp; c.translate(kx, ky); c.scale(s, s);
        D.txt(c, "dikompres", 0, 16, 44, { weight: 900, color: "#FFE1A8" }); c.restore(); } });

    // tanda cacat pada suara tiruan (b6_2): setinggi pita yang nanti dipotong, garis putus-putus menyambung ke bilah mesin
    const ca = pop(t, e.cacat) * (1 - fd(t, e.tiru2 + 0.95, 0.25));
    if (ca > 0 && mv >= 1) {
      const y0 = YB, y1 = YB + LH * CUTF, fly = eio((t - e.tiru2) / 0.95);
      const x0 = lerp(IN.x, BOX.x - 10, fly), w = lerp(IN.w, 40, fly), yy0 = lerp(y0, y1 - 20, fly), hh = lerp(y1 - y0, 40, fly);
      ctx.save(); ctx.globalAlpha *= clamp(ca);
      D.glow(ctx, x0 + w / 2, (yy0 + yy0 + hh) / 2, 220, P.pink, 0.3 + 0.15 * Math.sin(t * 8));
      ctx.fillStyle = D.hexA(P.pink, 0.16 + 0.1 * Math.sin(t * 8)); H.rr(ctx, x0 - 4, yy0 - 4, w + 8, hh + 8, 12); ctx.fill();
      ctx.strokeStyle = P.pink; ctx.lineWidth = 8; ctx.setLineDash([16, 10]); ctx.lineDashOffset = -t * 40; H.rr(ctx, x0 - 4, yy0 - 4, w + 8, hh + 8, 12); ctx.stroke();
      if (fly < 0.05) { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(IN.x + IN.w + 6, y1); ctx.lineTo(BOX.x + BOX.w - 40, y1); ctx.stroke(); }
      ctx.setLineDash([]); ctx.restore();
      const la = clamp(ca) * (1 - fd(t, e.tiru2 + 0.2, 0.3));
      if (la > 0) posts.push(c => { const [sx, sy] = toS(cam, 600, YB - 46); pillC(c, "cacat", sx, sy, { size: 44, stroke: P.pink, a: la, color: "#C2335E" }); });
    }

    // ---------- lajur keluar ----------
    // b6_4: dua kali bertukar tempat (tebak gelas): asli turun-kanan, tiruan naik-kiri, lalu kembali
    const s1 = eio((t - e.untuk) / 0.55), s2 = eio((t - e.untuk - 0.62) / 0.55), swp = s1 - s2;   // 0 → 1 → 0
    const arc = Math.sin(Math.PI * s1) * (1 - s2) + Math.sin(Math.PI * s2);
    const vel = clamp(arc * 1.4);
    const outA = { x: OUT.x + 170 * arc, y: lerp(YA, YB, swp), w: OUT.w, h: LH };
    const outB = { x: OUT.x - 40 * arc, y: lerp(YB, YA, swp), w: OUT.w, h: LH };
    const rev = t < e.tel ? 0 : lerp(0.02, 1, eio((t - e.tel - 0.15) / 1.5));
    const bandAmt = fd(t, e.potong + 0.05, 0.3), tel = fd(t, e.kompres, 0.6);
    const dimA = 1 - 0.45 * fd(t, e.b6_3 + 0.6, 0.6) * (1 - fd(t, e.untuk - 0.3, 0.4));
    const laneOpt = { reveal: rev, telepon: tel, band: [LO, HI], bandAmt };
    if (rev > 0) {
      // label tab: asli/tiruan sejak "tersamarkan"; tiruan → "Anakku" pada "anak kita."; saat tukar → "?", lalu "asli?" / "tiruan?"
      const tabOn = t > e.samar + 0.1, moving = clamp(arc * 3);
      const swapped = t > e.untuk - 0.1;
      const labTop = t > e.asli4 ? "asli?" : "?", labBot = t > e.tiru4 ? "tiruan?" : "?";
      const labA = swapped ? labTop : "asli", labB = swapped ? labBot : (t > e.anak2 ? "Anakku" : "tiruan");
      const colA = swapped ? P.amber : P.teal, colB = swapped ? P.amber : (t > e.anak2 ? P.teal : P.pink);
      const tabA = tabOn ? (swapped ? pop(t, labA === "asli?" ? e.asli4 : e.untuk + 1.2) : pop(t, e.samar + 0.1)) * (1 - moving) : 0;
      const tabB = tabOn ? (swapped ? pop(t, labB === "tiruan?" ? e.tiru4 : e.untuk + 1.2) : pop(t, labB === "Anakku" ? e.anak2 : e.samar + 0.2)) * (1 - moving) : 0;
      // garis kecepatan + bayangan gerak saat bertukar
      const ghost = (r, prof, dir) => { if (vel <= 0.05) return; for (let k = 1; k <= 2; k++) { ctx.save(); ctx.globalAlpha *= 0.18 * vel / k; lane(ctx, { x: r.x - dir[0] * 30 * k, y: r.y - dir[1] * 34 * k, w: r.w, h: r.h }, prof, S, laneOpt); ctx.restore(); }
        ctx.save(); ctx.strokeStyle = D.hexA("#E6ECFF", 0.55 * vel); ctx.lineWidth = 5; ctx.lineCap = "round";
        for (let k = 0; k < 4; k++) { const xx = r.x + r.w * (0.15 + k * 0.23), y0 = dir[1] > 0 ? r.y - 20 : r.y + r.h + 20; ctx.beginPath(); ctx.moveTo(xx, y0); ctx.lineTo(xx - dir[0] * 20, y0 - dir[1] * (50 + 20 * (k % 2))); ctx.stroke(); }
        ctx.restore(); };
      const dirA = [s2 > 0 ? -1 : 1, s2 > 0 ? -1 : 1], dirB = [s2 > 0 ? 1 : -1, s2 > 0 ? 1 : -1];
      // kedalaman saat bersilang: lajur tiruan lewat di belakang (mengecil, redup), lajur asli lewat di depan (membesar)
      const depth = (r, sc, fn) => { const cx = r.x + r.w / 2, cy = r.y + r.h / 2; ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.translate(-cx, -cy); fn(); ctx.restore(); };
      ghost(outB, TIRU, dirB); ghost(outA, ANAK, dirA);
      depth(outB, 1 - 0.2 * arc, () => { ctx.globalAlpha *= 1 - 0.3 * arc; tabW(ctx, labB, outB.x + 10, outB.y, colB, tabB); lane(ctx, outB, TIRU, S, laneOpt); flaws(ctx, outB, S, t, 1 - bandAmt, rev); });
      depth(outA, 1 + 0.08 * arc, () => { ctx.globalAlpha *= dimA; tabW(ctx, labA, outA.x + 10, outA.y, colA, tabA); lane(ctx, outA, ANAK, S, laneOpt); });
      const qs = win(t, e.untuk, e.untuk + 1.25, 0.2, 0.3);
      if (qs > 0) posts.push(c => { const [sx, sy] = toS(cam, OUT.x + OUT.w * 0.5, (YA + LH + YB) / 2 + 2); qmark(c, sx, sy, 84, qs); });
      fallingBands(ctx, outA, ANAK, S, e.potong, P.teal, false);
      fallingBands(ctx, outB, TIRU, S, e.potong, P.pink, true);
      // label pita yang dibuang (dipotong → sebelum "tersamarkan")
      const nb = pop(t, e.potong + 0.15) * (1 - fd(t, e.samar - 0.35, 0.3));
      if (nb > 0) posts.push(c => {
        const items = [["nada tinggi dibuang", YA, -1], ["nada rendah dibuang", YB + LH, 1]];
        items.forEach(([s, yEdge, sg], i) => { const a = i ? pop(t, e.potong + 0.3) * (1 - fd(t, e.samar - 0.35, 0.3)) : nb; if (a <= 0) return;
          const wv = pillW(c, s, 44), xr = 1662, cyW = yEdge + sg * 44, [sx, sy] = toS(cam, xr - wv / 2, cyW), [tx, ty] = toS(cam, xr - wv * 0.3, yEdge + sg * 4);
          c.save(); c.globalAlpha *= clamp(a); c.fillStyle = "#9AA6E8"; c.beginPath(); c.moveTo(tx - 14, sy - sg * 30); c.lineTo(tx + 14, sy - sg * 30); c.lineTo(tx, ty); c.closePath(); c.fill(); c.restore();
          pillC(c, s, sx, sy + sg * 14 * (1 - clamp(a)), { size: 44, a: clamp(a), fill: "#E9EDFF", stroke: "#9AA6E8" }); });
      });
      // lubang (b6_3): bagian suara yang hilang di saluran telepon, lalu ditambal otak
      HOLES.forEach((f, i) => {
        const ap = pop(t, e.selain + 0.3 + i * 0.25) * (1 - fd(t, e.untuk - 0.4, 0.3)); if (ap <= 0) return;
        const hw = OUT.w * HOLE_W, hx = outB.x + OUT.w * f, hy = outB.y + 4, hh = LH - 8, land = e.isi + i * 0.22 + 0.8, fill = fd(t, land, 0.25);
        ctx.save(); ctx.translate(hx + hw / 2, hy + hh / 2); ctx.scale(Math.min(1, ap), 1); ctx.translate(-hx - hw / 2, -hy - hh / 2);
        ctx.fillStyle = "#11163F"; ctx.fillRect(hx, hy, hw, hh);
        if (fill > 0) { ctx.save(); ctx.beginPath(); ctx.rect(hx, hy, hw, hh); ctx.clip(); ctx.globalAlpha *= fill;
          lane(ctx, outB, ANAK, S, { telepon: 1, frame: false, r: 0 }); ctx.fillStyle = D.hexA(P.teal, 0.28 - 0.14 * fd(t, land + 0.6, 1)); ctx.fillRect(hx, hy, hw, hh); ctx.restore(); }
        ctx.strokeStyle = fill > 0 ? D.hexA(P.teal, 0.9 - 0.5 * fd(t, land + 0.6, 1)) : P.amber; ctx.lineWidth = 4; ctx.setLineDash(fill > 0 ? [] : [12, 8]);
        ctx.strokeRect(hx, hy, hw, hh); ctx.setLineDash([]);
        if (fill > 0 && fill < 1) D.glow(ctx, hx + hw / 2, hy + hh / 2, 120, P.teal, 0.6 * (1 - fill));
        ctx.restore();
      });
      // "≈ terdengar sama" di antara lajur keluar
      const sp = pop(t, e.samar), sa = clamp(sp) * (1 - fd(t, e.b6_3 + 0.4, 0.3));
      if (sa > 0) posts.push(c => { const [sx, sy] = toS(cam, 1572, (YA + LH + YB) / 2 + 2); c.save(); c.translate(sx, sy); const k = lerp(0.92, 1, clamp(sp)); c.scale(k, k); pillC(c, "≈  terdengar sama", 0, 0, { size: 44, stroke: P.amber, a: sa }); c.restore(); });
    }

    // ---------- Bu Rina (di kanan, terlihat saat kamera menggeser) ----------
    let rinaA = null;
    if (cam.X > 120) {
      const panik = fd(t, e.panik, 0.3), sad = fd(t, e.lengkap + 0.3, 0.4);
      const face = panik > 0.5 ? "panik" : sad > 0.5 ? "sedih" : "bingung";
      const o = Object.assign(O.preset("buRina"), { pose: "telepon", flip: true, t, face, layar: callScreen, keringat: panik > 0.5, airmata: false, look: [-0.6, -0.1] });
      rinaA = O.draw(ctx, RINA.x, RINA.y, RINA.h, o);
      if (panik > 0) for (let i = 0; i < 3; i++) { const u = ((t - e.panik) * 1.35 + i / 3) % 1, ch = rinaA.chest;
        ctx.strokeStyle = D.hexA(P.red, 0.6 * (1 - u) * panik * (1 - 0.5 * fd(t, e.jadi, 0.6))); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(ch[0], ch[1], 40 + u * 170, 0, TAU); ctx.stroke(); }
    }
    // aliran suara dari lajur keluar tiruan ke HP Bu Rina (melengkung di atas Bip, tetap menempel saat lajur bertukar)
    const sw = fd(t, e.b6_3 + 0.9, 0.6);
    if (rinaA && sw > 0 && rev > 0) {
      const ph = rinaA.phone || rinaA.head, p0 = [outB.x + OUT.w / 2 + (OUT.w / 2 + 4) * (1 - 0.2 * arc), outB.y + LH / 2], p2 = [ph[0] - 18, ph[1] + 6], p1 = [lerp(p0[0], p2[0], 0.45), Math.min(p0[1], p2[1]) - 70];
      const teal = fd(t, e.anak2, 0.6), col = teal > 0.5 ? P.teal : P.pink;
      ctx.save(); ctx.globalAlpha *= sw; ctx.lineCap = "round";
      for (let pass = 0; pass < 2; pass++) { ctx.strokeStyle = pass ? D.hexA("#FFFFFF", 0.85) : D.hexA(col, 0.6); ctx.lineWidth = pass ? 4 : 15; ctx.beginPath();
        for (let i = 0; i <= 60; i++) { const u = i / 60, [x, y] = qpt(p0, p1, p2, u), [x2, y2] = qpt(p0, p1, p2, Math.min(1, u + 0.01)), nx = -(y2 - y), ny = x2 - x, nl = Math.hypot(nx, ny) || 1;
          const amp = 16 * Math.sin(u * Math.PI) * (0.6 + 0.4 * Math.sin(t * 3)), off = amp * Math.sin(u * 28 - t * 9);
          const X = x + nx / nl * off, Y = y + ny / nl * off; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
      for (let i = 0; i < 4; i++) { const u = ((t * 0.6 + i / 4) % 1), [x, y] = qpt(p0, p1, p2, u); D.glow(ctx, x, y, 26, col, 0.8 * Math.sin(u * Math.PI)); }
      ctx.restore();
    }

    // ---------- gelembung pikiran: otak → wajah anak berlubang puzzle → tanda seru ----------
    const ba = pop(t, e.otak - 0.1, 9, 0.55) * (1 - fd(t, e.jangan, 0.4));
    if (rinaA && ba > 0) {
      const hd = rinaA.top, R = BUB.r * Math.min(1.05, ba);
      const panikB = fd(t, e.panik, 0.3), rimCol = panikB > 0.5 ? P.red : "#C9D3FF", BG = "#F4F6FF";
      ctx.save(); ctx.globalAlpha *= clamp(ba * 1.4);
      [[0.25, 16], [0.5, 24]].forEach(([u, rr]) => { ctx.fillStyle = BG; ctx.beginPath(); ctx.arc(lerp(hd[0] - 30, BUB.x + 70, u), lerp(hd[1] - 10, BUB.y + BUB.r * 0.8, u), rr * ba, 0, TAU); ctx.fill(); });
      const bump = 12;
      ctx.fillStyle = "rgba(10,14,50,0.25)"; ctx.beginPath(); ctx.arc(BUB.x + 8, BUB.y + 12, R + 14, 0, TAU); ctx.fill();
      ctx.fillStyle = BG; for (let i = 0; i < bump; i++) { const a = i / bump * TAU + t * 0.15; ctx.beginPath(); ctx.arc(BUB.x + Math.cos(a) * R * 0.92, BUB.y + Math.sin(a) * R * 0.92, R * 0.24, 0, TAU); ctx.fill(); }
      ctx.beginPath(); ctx.arc(BUB.x, BUB.y, R * 0.97, 0, TAU); ctx.fill();
      ctx.strokeStyle = rimCol; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(BUB.x, BUB.y, R * 0.97, 0, TAU); ctx.stroke();
      if (panikB > 0) { ctx.fillStyle = D.hexA("#FFD9DE", panikB * 0.9); ctx.beginPath(); ctx.arc(BUB.x, BUB.y, R * 0.95, 0, TAU); ctx.fill(); }
      ctx.save(); ctx.beginPath(); ctx.arc(BUB.x, BUB.y, R * 0.9, 0, TAU); ctx.clip();
      const toFace = fd(t, e.mirip - 0.1, 0.5) * (1 - panikB);
      brain(ctx, BUB.x, BUB.y + 4, R * 0.62, t, (1 - toFace) * (1 - panikB));
      if (toFace > 0) {
        ctx.save(); ctx.globalAlpha *= toFace;
        O.kepala(ctx, BUB.x, BUB.y - 4, R * 0.46, Object.assign(O.preset("anakRina"), { t, face: fd(t, e.lengkap + 0.85, 0.2) > 0.5 ? "senang" : "netral", bahu: 1.3 }));
        ctx.restore();
        // lubang puzzle: potongan terang (latar gelembung) bergaris putus; kepingan teal masuk satu per satu lalu menyatu dengan wajah
        [[-0.34, -0.3], [0.18, -0.06], [-0.14, 0.4]].forEach(([fx, fy], i) => {
          const pw = R * 0.32, px = BUB.x + fx * R - pw / 2, py = BUB.y + fy * R - pw / 2, t0 = e.lengkap + i * 0.22, ins = pop(t, t0, 12, 0.55), melt = fd(t, t0 + 0.45, 0.45), holeA = 1 - fd(t, t0 + 0.12, 0.1);
          ctx.save(); ctx.globalAlpha *= toFace;
          if (holeA > 0) { ctx.save(); ctx.globalAlpha *= holeA; puzzlePath(ctx, px, py, pw, pw); ctx.fillStyle = BG; ctx.fill();
            ctx.save(); ctx.clip(); ctx.strokeStyle = "rgba(30,42,107,0.18)"; ctx.lineWidth = 8; puzzlePath(ctx, px + 3, py + 4, pw, pw); ctx.stroke(); ctx.restore();
            puzzlePath(ctx, px, py, pw, pw); ctx.strokeStyle = "#5866B0"; ctx.lineWidth = 3.5; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 20; ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
          if (ins > 0 && melt < 1) { const k = lerp(1.6, 1, Math.min(1, ins)), cx0 = px + pw / 2, cy0 = py + pw / 2;
            ctx.save(); ctx.globalAlpha *= clamp(ins * 2) * (1 - melt); ctx.translate(cx0, cy0); ctx.scale(k, k); ctx.translate(-cx0, -cy0);
            puzzlePath(ctx, px, py, pw, pw); ctx.fillStyle = "#3FD8C8"; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
            D.glow(ctx, cx0, cy0, pw * 1.3, P.teal, 0.7 * (1 - melt)); }
          ctx.restore();
        });
      }
      if (panikB > 0) B.seru(ctx, BUB.x, BUB.y, R * 1.15 * Math.min(1, pop(t, e.panik)), { color: P.red });
      ctx.restore();
      ctx.restore();
      // kepingan puzzle terbang dari otak ke lubang suara
      HOLES.forEach((f, i) => {
        const t0 = e.isi + i * 0.22, u = (t - t0) / 0.8; if (u <= 0 || u >= 1) return;
        const hw = OUT.w * HOLE_W, to = [outB.x + OUT.w * f + hw / 2, outB.y + LH / 2], from = [BUB.x - 20, BUB.y + 10], mid = [lerp(from[0], to[0], 0.5), Math.min(from[1], to[1]) - 140];
        const [x, y] = qpt(from, mid, to, eio(u)), sz = lerp(46, hw, eio(u)), hh = lerp(46, LH - 8, eio(u));
        ctx.save(); ctx.translate(x, y); ctx.rotate((1 - eio(u)) * 1.2 * (i % 2 ? 1 : -1));
        D.glow(ctx, 0, 0, 90, P.teal, 0.6); puzzlePath(ctx, -sz / 2, -hh / 2, sz, hh); ctx.fillStyle = "#3FD8C8"; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.stroke();
        ctx.restore();
      });
    }
    // hati besar saat otak "yakin" itu suara anak: di antara gelembung dan kepala
    if (rinaA) { const ha = pop(t, e.anak2 - 0.05, 10, 0.45) * (1 - fd(t, e.panik, 0.3)); if (ha > 0) { const hd = rinaA.top;
      const hx = lerp(hd[0], BUB.x, 0.5) + 40, hy = lerp(hd[1], BUB.y + BUB.r, 0.75) - 34 - 6 * Math.sin(t * 3); heart(ctx, hx, hy, 92 * Math.min(1.08, ha) * (1 + 0.06 * Math.sin(t * 7)), P.pink, ha); } }

    // ---------- Bip ----------
    const bx = t < e.b6_2 ? 1760 : t < e.b6_3 ? lerp(1760, 1820, eio((t - e.b6_2) / 0.8)) : lerp(1820, 1880, eio((t - e.b6_3 - 0.2) / 1.1));
    const by = BIP_Y, bs = BIP_S;
    let bo = { t, seed: 6, look: [-0.8, -0.1] };
    const outBT = [outB.x + OUT.w * 0.75, outB.y + LH * 0.5];
    let zoomTop = 0;
    if (t < e.b6_2) {
      if (t < e.asli1 - 0.2) bo = Object.assign(bo, { pose: "pegang", hold: "samping", dir: -1, propSize: 0.55, mood: t > e.tujuh ? "think" : "happy",
        prop: (c, px, py, s) => clipboard(c, px, py - 6 * pop(t, e.survei), s * 0.55 * 0.8, Math.round(clamp((t - e.tujuh) / 0.75) * 7)) });
      else bo = Object.assign(bo, { pose: "tunjuk", target: [t < e.tiru1 ? CARD_A.x + CARD_A.w * 0.7 : CARD_B.x + CARD_B.w * 0.4, CARD_A.y + CARD_A.h], mood: "think" });
    } else if (t < e.tel - 0.2) bo = Object.assign(bo, { pose: "diam", look: [-0.9, -0.3 - 0.6 * fd(t, e.alasan, 0.5)], mood: t > e.alasan ? "wow" : "happy" });
    else if (t < e.potong) bo = Object.assign(bo, { pose: "tunjuk", target: [BOX.x + BOX.w * 0.7, BOX.y + 120] });
    else if (t < e.potong + 1.2) bo = Object.assign(bo, { pose: "kaget", k: t - e.potong - 0.1 });
    else if (t < e.kurang) bo = Object.assign(bo, { pose: "tunjuk", target: [BOX.x + BOX.w * 0.5, (YA + LH + YB) / 2], mood: "think" });
    else if (t < e.cacat) bo = Object.assign(bo, { pose: "tunjuk", target: [1450, 330], mood: "sad" });
    else if (t < e.samar - 0.1) bo = Object.assign(bo, { pose: "tunjuk", target: [IN.x + IN.w * 0.6, YB + 30], mood: "think" });
    else if (t < e.b6_3 + 0.25) {
      // dua kaca pembesar besar: Bip memegang yang bawah, yang atas melayang; keduanya menunjukkan pita arsir yang sama
      zoomTop = pop(t, e.samar - 0.05, 10, 0.55) * (1 - fd(t, e.b6_3, 0.3));
      const gz = lerp(0.5, 1.2, clamp(pop(t, e.samar - 0.1, 10, 0.55)));
      bo = Object.assign(bo, { pose: "kacaPembesar", target: [1600, 600], glass: gz, mood: "think",
        content: (c, cx, cy, r) => { c.save(); c.translate(cx, cy); c.scale(2.1, 2.1); c.translate(-1600, -(outB.y + LH * CUTF * 0.6)); lane(c, outB, TIRU, S, Object.assign({}, laneOpt, { frame: false })); c.restore(); } });
    } else if (t < e.b6_3 + 1.3) bo = Object.assign(bo, { pose: "jalan", dir: 1, mood: "think" });
    else if (t < e.otak2) bo = Object.assign(bo, { pose: "tunjuk", target: [outB.x + OUT.w * 0.5, outB.y + LH * 0.5], mood: t > e.isi + 0.8 ? "wow" : "think" });
    else if (t < e.anak2 - 0.1) bo = Object.assign(bo, { pose: "diam", look: [0.9, -0.6], mood: "wow" });
    else if (t < e.panik) {
      // Bip tetap ragu: mengangkat papan "tiruan" sambil menggeleng
      const sg = pop(t, e.anak2 - 0.1, 10, 0.5);
      bo = Object.assign(bo, { pose: "pegang", hold: "samping", dir: -1, propSize: 0.9, mood: "think", look: [0.75 * Math.sin((t - e.anak2) * 11), -0.15],
        prop: (c, px, py) => signTiruan(c, px, py - 20, 1, sg) });
    }
    else if (t < e.dengar4) bo = Object.assign(bo, { pose: "diam", look: [0.9, -0.5], mood: "sad", sweat: true });
    else if (t < e.jangan) bo = Object.assign(bo, { pose: "kacaPembesar", target: outBT, glass: 0.95, mood: "sad", sweat: true });
    else if (t < e.untuk - 0.2) bo = Object.assign(bo, { pose: "tunjuk", target: [2250, 470], mood: "think" });
    else bo = Object.assign(bo, { pose: "diam", look: [-0.6, -0.6], mood: "think", sweat: true });
    if (bo.pose === "kacaPembesar" && t > e.b6_3) {
      const shake = fd(t, e.dengar4, 0.4) * (1 - fd(t, e.jangan, 0.3)), fog = fd(t, e.teliti - 0.3, 0.6) * (1 - fd(t, e.jangan, 0.3));
      bo.content = (c, cx, cy, r) => {
        const jx = shake * 12 * Math.sin(t * 41), jy = shake * 9 * Math.sin(t * 33 + 1);
        c.save(); c.translate(cx + jx, cy + jy); c.scale(1.9, 1.9); c.translate(-outBT[0], -outBT[1]);
        lane(c, outB, TIRU, S, Object.assign({}, laneOpt, { frame: false }));
        c.restore();
        if (fog > 0) { c.fillStyle = D.hexA("#FFC9CF", 0.75 * fog); c.fillRect(cx - r, cy - r, 2 * r, 2 * r);
          for (let i = 0; i < 5; i++) { c.fillStyle = D.hexA("#FFFFFF", 0.35 * fog); c.beginPath(); c.arc(cx + Math.cos(i * 2.3 + t) * r * 0.5, cy + Math.sin(i * 1.7 + t * 0.8) * r * 0.45, r * 0.25, 0, TAU); c.fill(); } }
      };
    }
    // kaca pembesar atas (melayang) untuk lajur asli
    if (zoomTop > 0) {
      const zx = 1600, zy = 300, k = Math.min(1, zoomTop);
      ctx.save(); ctx.globalAlpha *= clamp(zoomTop * 1.5);
      B.kacaPembesar(ctx, zx, zy + 6 * Math.sin(t * 2), 236 * k, { t, angle: -0.55,
        content: (c, cx, cy) => { c.save(); c.translate(cx, cy); c.scale(2.1, 2.1); c.translate(-1600, -(outA.y + LH * CUTF * 0.6)); lane(c, outA, ANAK, S, Object.assign({}, laneOpt, { frame: false })); c.restore(); } });
      ctx.restore();
    }
    const bShake = fd(t, e.panik, 0.3) * (1 - fd(t, e.jadi, 0.5)) * 5 * Math.sin(t * 37);
    B.draw(ctx, bx + bShake, by, bs, bo);

    // cincin di HP / tangan (b6_4 "telinga")
    let earRing = null;
    if (rinaA) { const ea = pop(t, e.telinga - 0.05) * (1 - fd(t, e.b6_4s + 0.3, 0.3)); if (ea > 0) { const ph = rinaA.phone || rinaA.head, hn = rinaA.hand || ph;
      const rx = lerp(ph[0], hn[0], 0.5) - 50, ry = lerp(ph[1], hn[1], 0.5) + 44; earRing = [rx, ry, ea];
      ctx.save(); ctx.globalAlpha *= clamp(ea); D.glow(ctx, rx, ry, 110, P.amber, 0.4); ctx.strokeStyle = P.amber; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(rx, ry, 58 + 5 * Math.sin(t * 5), 0, TAU); ctx.stroke(); ctx.restore(); } }

    ctx.restore();   // kamera

    // layar memerah saat panik
    const red = fd(t, e.panik, 0.35) * (1 - 0.65 * fd(t, e.jadi, 0.8));
    if (red > 0) { const pulse = 0.6 + 0.4 * Math.pow(Math.abs(Math.sin((t - e.panik) * Math.PI * 1.35)), 3);
      const gr = ctx.createRadialGradient(960, 540, 300, 960, 540, 1150); gr.addColorStop(0, "rgba(255,70,90,0)"); gr.addColorStop(1, D.hexA("#FF3D57", 0.42 * red * pulse));
      ctx.fillStyle = gr; ctx.fillRect(0, 0, 1920, 1080); }

    // ---------- lapisan label (sesudah vignette) ----------
    D.post(c => {
      // b6_1: sumber + angka
      const fo = 1 - fd(t, e.b6_2, 0.45);
      if (fo > 0) {
        const sa = pop(t, e.survei - 0.05) * fo; if (sa > 0) pillL(c, "Survei McAfee, 2023", 110, 150, { size: 44, a: clamp(sa), fill: CREAM, lead: 0 });
        const n = pop(t, e.tujuh, 12, 0.45);
        if (n > 0) { c.save(); c.globalAlpha *= fo * clamp(n * 1.5); c.translate(150, 385); c.scale(n, n);
          D.glow(c, 0, -70, 170, P.amber, 0.35); D.txt(c, "7", -40, 0, 230, { weight: 900, color: P.amber }); c.restore(); }
        const d = pop(t, e.sepuluh, 12, 0.5);
        if (d > 0) { c.save(); c.globalAlpha *= fo * clamp(d * 1.5); D.txt(c, "dari 10", 265 + (1 - Math.min(1, d)) * 40, 362, 92, { weight: 900 }); c.restore(); }
        const y = fd(t, e.yakin, 0.35);
        if (y > 0) { c.save(); c.globalAlpha *= fo * y; D.txt(c, "tidak yakin bisa", 116, 452 + (1 - y) * 16, 52, { weight: 800, color: CREAM }); D.txt(c, "membedakan", 116, 514 + (1 - y) * 16, 52, { weight: 800, color: CREAM }); c.restore(); }
      }
      posts.forEach(fn => { c.save(); fn(c); c.restore(); });
      // kartu kesimpulan di atas Bu Rina: ikon telinga + "Telinga saja / tidak cukup", ekor ke cincin di HP
      if (earRing) {
        const a = earRing[2], k = lerp(0.9, 1, clamp(a)), cx = 1562, cy = 214, w = 506, h = 168, [rx, ry] = toS(cam, earRing[0], earRing[1]);
        c.save(); c.globalAlpha *= clamp(a);
        c.fillStyle = CREAM; c.beginPath(); c.moveTo(cx + 60, cy + h / 2 - 4); c.lineTo(cx + 140, cy + h / 2 - 4); c.lineTo(rx - 10, ry - 62); c.closePath(); c.fill();
        c.translate(cx, cy); c.scale(k, k);
        c.fillStyle = "rgba(10,16,48,0.35)"; H.rr(c, -w / 2 + 6, -h / 2 + 9, w, h, 30); c.fill();
        c.fillStyle = CREAM; H.rr(c, -w / 2, -h / 2, w, h, 30); c.fill(); c.strokeStyle = P.amber; c.lineWidth = 6; c.stroke();
        c.fillStyle = "#FFE3B8"; c.beginPath(); c.arc(-w / 2 + 78, 0, 54, 0, TAU); c.fill();
        ear(c, -w / 2 + 80, 2, 88);
        c.strokeStyle = P.red; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.arc(-w / 2 + 78, 0, 54, 0, TAU); c.stroke();
        D.txt(c, "Telinga saja", -w / 2 + 150, -12, 58, { weight: 900, color: NAVY });
        D.txt(c, "tidak cukup", -w / 2 + 150, 50, 58, { weight: 900, color: "#D9483B" });
        c.restore();
      }
      // label alasan di kiri atas
      const chips = [["Suara telepon", e.tel], ["Otak mengisi", e.otak], ["Panik", e.panik]];
      let x = 110; chips.forEach(([s, t0], i) => {
        font(c, 44, 800); const wReal = c.measureText(s).width + 44 * 1.1 + 58, ga = fd(t, e.ada + 0.25 + i * 0.15, 0.3) * (1 - fd(t, t0 - 0.05, 0.15)) * (1 - fd(t, e.b6_4s + 0.25, 0.2));
        if (ga > 0) { c.save(); c.globalAlpha *= ga; const cy = 112, h = 44 * 1.62; c.strokeStyle = "rgba(220,228,255,0.7)"; c.lineWidth = 3; c.setLineDash([10, 8]);
          H.rr(c, x, cy - h / 2, wReal, h, h / 2); c.stroke(); c.setLineDash([]); c.fillStyle = "rgba(220,228,255,0.25)"; c.beginPath(); c.arc(x + 42, cy, 25, 0, TAU); c.fill();
          D.txt(c, String(i + 1), x + 42, cy + 15, 42, { align: "center", weight: 900, color: "#E6ECFF" }); c.restore(); }
        const a = pop(t, t0, 10, 0.55) * (1 - fd(t, e.b6_4s + 0.25, 0.2)); if (a <= 0) { x += wReal + 22; return; }
        const active = (i === 2 || t < chips[i + 1][1]);
        c.save(); c.globalAlpha *= clamp(a * 1.3); const cy = 112;
        const w = pillL(c, s, x, cy, { size: 44, lead: 58, fill: active ? CREAM : "rgba(20,30,80,0.85)", color: active ? NAVY : "#D6DEFF", stroke: active ? P.amber : "rgba(200,212,255,0.4)" });
        c.fillStyle = active ? P.amber : "#5866B0"; c.beginPath(); c.arc(x + 42, cy, 25, 0, TAU); c.fill();
        D.txt(c, String(i + 1), x + 42, cy + 15, 42, { align: "center", weight: 900, color: active ? NAVY : "#FFFFFF" });
        c.restore(); x += w + 22;
      });
    });
  }
  scene.noCam = true;
  K.SCENES.d03_b6 = scene;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b6 = TL => {
    const e = EV(TL), r = (x, kind, amp) => [+x.toFixed(3), kind, amp];
    return [
      r(e.tujuh, "pop", 0.8),                 // angka 7 + gelombang garuk + cakram
      r(e.asli1, "pop", 0.55),                // kartu suara asli
      r(e.tiru1, "pop", 0.55),                // kartu suara tiruan
      r(e.b6_2 - 0.35, "whoosh", 0.5),        // kerumunan turun, kartu jadi lajur
      r(e.tel + 0.05, "clack", 0.75),         // mesin telepon mendarat (riser turun di kabel berakhir di sini)
      r(e.potong, "clack", 0.8),              // pita dipotong
      r(e.kompres, "boom", 0.45),             // mesin memampat + tag dikompres
      r(e.cacat, "pop", 0.5),                 // tanda cacat
      r(e.samar, "shimmer", 0.5),             // dua kaca pembesar: terdengar sama
      r(e.b6_3 - 0.3, "whoosh", 0.55),        // kamera menggeser ke Bu Rina
      r(e.isi + 0.8, "pop", 0.5),             // kepingan puzzle menambal lubang
      r(e.lengkap, "shimmer", 0.55),          // wajah anak lengkap
      r(e.anak2, "pop", 0.5),                 // hati + tab Anakku + papan "tiruan"
      r(e.panik, "boom", 0.7),                // panik: layar memerah
      r(e.teliti, "riser", 0.4),              // kaca pembesar berembun (riser berakhir di "teliti")
      r(e.telinga, "pop", 0.6),               // kartu telinga + cincin
      r(e.untuk - 0.6, "whoosh", 0.5),        // lajur bertukar tempat
    ];
  };
})(typeof window !== "undefined" ? window : globalThis);
