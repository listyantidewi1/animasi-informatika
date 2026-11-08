/* D03 bab 4: "Resep sebuah penipuan" (b4_1, b4_2, b4_3, b4_4, b4_4a, b4_4b, b4_5).
   Metafora utama bab: penipuan = RESEP masakan yang bahannya perasaan. Satu panggung dapur yang bersambung (latar.dapur):
   - b4_1 buku "Resep Penipuan" terbuka di meja dapur; Bip menunjuk. "bukan teknologi" = ikon cip dicoret, "perasaan" = hati yang
     terbelah jadi tiga tetes warna ke tiga slot bahan. Bu Rina berdiri di kanan, sibuk dengan HP-nya (sasaran resep).
   - b4_2 buku naik ke dinding (jadi daftar bahan); toples "panik" melompat dari slot 1 ke meja; dari toples naik tiga gelembung cerita
     darurat (kecelakaan, polisi, rumah sakit) tepat saat diucapkan.
   - b4_3 toples "terburu-buru": jam weker berdering, uang terbang pergi saat "dikirim", tombol "Tunggu" dicoret saat "menunggu".
   - b4_4 toples "rahasia" bergembok; buku menutup dan pergi; HP Bu Rina berdering.
   - b4_4a dialog "Jangan bilang siapa-siapa dulu." tampil sebagai gelembung besar dari HP Bu Rina, kata demi kata.
   - b4_4b gembok dari toples "rahasia" terbang mengunci garis tanya Bu Rina ke Ayah dan Nenek.
   - b4_5 tiga toples dituang ke panci, uap membentuk tanda seru yang terbang ke kepala Bu Rina dan menjadi lampu sirene tepat pada
     "mode darurat"; ingin segera transfer
     Rp3.000.000, kepalanya berkabut; pelaku muncul di jendela memegang buku resep, Bip menunjuknya.
   Semua keadaan dihitung dari waktu absolut, kamera sendiri (noCam), sehingga silang-pudar antarbeat tidak terlihat sebagai lompatan. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, O = KIT.orang, LT = KIT.latar, B = KIT.bipkit;
  const { clamp, lerp, eio, eout, spring } = D;
  const TAU = Math.PI * 2, PI = Math.PI;
  const RED = "#FF5A6E", AMB = "#FFB547", VIO = "#9584FF", CREAM = "#FFF6E6", INK = "#1C2050";
  const IDS = ["b4_1", "b4_2", "b4_3", "b4_4", "b4_4a", "b4_4b", "b4_5"];

  // ---------- tata letak dunia (px dunia, sebelum kamera; lapisan tengah dapur) ----------
  const CT = 610, FY = 840;
  const POT = { x: 500, y: 570, size: 250 };
  const BOOK0 = { x: 1130, y: 362, size: 760 }, BOOK1 = { x: 1385, y: 236, size: 540 };
  const JARS = [
    { x: 735, col: RED, lid: "#C9405A", label: "panik" },
    { x: 1045, col: AMB, lid: "#D98A2B", label: "terburu-buru" },
    { x: 1380, col: VIO, lid: "#5B47C9", label: "rahasia" }];
  const JAR_H = 205, JAR_TS = 46;
  const BIP = { x: 545, s: 230 };
  const RINA = { x: 1700, h: 430 };
  const WIN = { x: 470, y: 150, w: 400, h: 230 };
  const ICONS = [{ x: 330, y: 228, label: "kecelakaan" }, { x: 655, y: 190, label: "polisi" }, { x: 978, y: 228, label: "rumah sakit" }];
  const CLOCK = { x: 960, y: 222, r: 80 }, TUNGGU = { x: 715, y: 250, w: 270 };
  const AYAH = { x: 1085, y: 255 }, NENEK = { x: 1290, y: 170 }, LOCK = { x: 1555, y: 378 };
  const POUR = { x: 742, y: 318, tilt: -1.85 };
  const CHIP = { x: 420, y: 250 };

  // ---------- waktu kejadian (detik absolut, dari kata sungguhan) ----------
  let EVk = null, EVc = null;
  function EV(TL) {
    if (EVk === TL && EVc) return EVc;
    const bb = id => TL.beats.find(x => x.id === id);
    const A = (id, s, o = 0) => { const b = bb(id); return b.start + D.at(b, s) + o; };
    const E = (id, s, o = 0) => { const b = bb(id); return b.start + D.atEnd(b, s) + o; };
    const e = {};
    IDS.forEach(id => { const b = bb(id); e[id] = b.start; e[id + "e"] = b.start + b.dur; });
    e.resep = A("b4_1", "resep"); e.bahannya = A("b4_1", "Bahannya"); e.bukan = A("b4_1", "bukan"); e.tek = A("b4_1", "teknologi"); e.tekE = E("b4_1", "teknologi");
    e.perasaan = A("b4_1", "perasaan");
    e.bahan1 = A("b4_2", "Bahan pertama"); e.panik = A("b4_2", "panik"); e.cerita = A("b4_2", "Ceritanya"); e.darurat = A("b4_2", "darurat");
    e.ic = [A("b4_2", "kecelakaan"), A("b4_2", "ditangkap"), A("b4_2", "rumah sakit")];
    e.bahan2 = A("b4_3", "Bahan kedua"); e.buru = A("b4_3", "terburu-buru"); e.bahwa = A("b4_3", "Bahwa"); e.uang = A("b4_3", "uangnya");
    e.kirim = A("b4_3", "dikirim"); e.sekarang = A("b4_3", "sekarang"); e.tidak = A("b4_3", "tidak boleh"); e.tunggu = A("b4_3", "menunggu");
    e.bahan3 = A("b4_4", "Bahan ketiga"); e.ketiga = A("b4_4", "ketiga"); e.rahasia = A("b4_4", "rahasia");
    const b4a = bb("b4_4a"); e.w = (b4a.words || []).map(w => [b4a.start + w[1], b4a.start + w[2]]);
    if (e.w.length < 4) e.w = [0, 1, 2, 3].map(i => [b4a.start + D.lead(b4a) + i * 0.4, b4a.start + D.lead(b4a) + i * 0.4 + 0.35]);
    e.kalimat = A("b4_4b", "Kalimat ini"); e.membuat = A("b4_4b", "membuat"); e.korban = A("b4_4b", "korban"); e.sempat = A("b4_4b", "tidak sempat");
    e.tanya = A("b4_4b", "bertanya"); e.orang = A("b4_4b", "orang lain"); e.lain = A("b4_4b", "lain");
    e.panik5 = A("b4_5", "panik"); e.otak = A("b4_5", "otak"); e.mode = A("b4_5", "mode darurat"); e.ingin = A("b4_5", "ingin segera"); e.tolong = A("b4_5", "menolong");
    e.sulit = A("b4_5", "sulit"); e.jernih = A("b4_5", "jernih"); e.pelaku = A("b4_5", "Pelaku"); e.manfaat = A("b4_5", "memanfaatkannya");
    // toples: muncul dari slot buku
    e.pop = [e.panik, e.buru, e.rahasia];
    // penuangan: toples terbang satu per satu ke atas panci (mulai di ekor b4_4b)
    const p0 = e.b4_5 - 0.85;
    e.pour = [0, 1, 2].map(i => { const a = p0 + i * 0.55; return { lift: a, at: a + 0.45, pour: a + 0.55, end: a + 1.05, out: a + 1.4 }; });
    e.boil = e.pour[0].pour; e.form0 = e.pour[2].end - 0.1; e.form1 = Math.max(e.form0 + 0.6, e.otak + 0.4);
    // tanda seru uap terbang ke kepala Bu Rina dan menjadi lampu darurat tepat pada "mode darurat"
    e.fly0 = Math.min(e.form1 + 0.35, e.mode - 0.75); e.fly1 = e.mode - 0.02;
    // gerak buku
    e.toWall = e.bahan1 - 0.1; e.close = e.rahasia + 0.55; e.away = e.rahasia + 0.85;
    e.ring = e.rahasia + 0.55; e.ear = e.b4_4a - 0.35;
    // kamera bersambung: [t, x, y, z]
    e.cam = [[e.b4_1, 960, 540, 1.0], [e.resep, 990, 515, 1.03], [e.b4_1e - 0.4, 1050, 480, 1.07],
      [e.panik, 930, 495, 1.05], [e.ic[2] + 0.4, 905, 470, 1.08],
      [e.buru, 990, 480, 1.07], [e.tunggu + 0.2, 985, 465, 1.1],
      [e.rahasia, 1060, 480, 1.08], [e.b4_4a + 0.3, 1130, 465, 1.2], [e.b4_4ae, 1135, 462, 1.22],
      [e.korban, 1120, 448, 1.2], [e.lain + 0.25, 1105, 445, 1.19], [e.pour[0].lift, 1080, 450, 1.17], [e.pour[0].at + 0.25, 790, 430, 1.24],
      [e.fly0, 760, 430, 1.25], [e.fly1, 1150, 468, 1.2], [e.tolong, 1145, 474, 1.19], [e.pelaku - 0.1, 1150, 470, 1.22],
      [e.pelaku + 0.75, 1000, 452, 1.08], [e.b4_5e, 975, 440, 1.12]];
    EVk = TL; EVc = e; return e;
  }

  // ---------- pembantu ----------
  const win = (t, a, b, fi = 0.3, fo = 0.3) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));
  const pop = (t, t0, k = 11, z = 0.5) => (t <= t0 ? 0 : Math.min(1.12, spring(t - t0, k, z)));
  const qpt = (p0, p1, p2, u) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  function camAt(e, t) {
    const c = D.path(e.cam, t), z = c.z;
    const x = clamp(c.x, 960 / z, 1920 - 960 / z), y = clamp(c.y, 540 / z, 1080 - 540 / z);
    return { x, y, z };
  }
  function heart(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s / 100, s / 100); c.fillStyle = col; c.beginPath(); c.moveTo(0, 34);
    c.bezierCurveTo(-70, -8, -46, -66, 0, -34); c.bezierCurveTo(46, -66, 70, -8, 0, 34); c.fill();
    c.fillStyle = "rgba(255,255,255,0.35)"; c.beginPath(); c.ellipse(-24, -28, 12, 8, -0.6, 0, TAU); c.fill(); c.restore(); }
  function cross(c, x, y, r, u, col = "#FF3B4E") {   // coretan merah dua garis
    if (u <= 0) return; c.save(); c.lineCap = "round"; c.strokeStyle = "rgba(20,10,40,0.25)"; c.lineWidth = r * 0.22;
    const seg = (x0, y0, x1, y1, k) => { if (k <= 0) return; c.beginPath(); c.moveTo(x0, y0); c.lineTo(lerp(x0, x1, k), lerp(y0, y1, k)); c.stroke(); };
    for (const pass of [0, 1]) { c.strokeStyle = pass ? col : "rgba(20,10,40,0.25)"; c.save(); if (!pass) c.translate(3, 5);
      seg(x - r, y - r, x + r, y + r, clamp(u * 2)); seg(x + r, y - r, x - r, y + r, clamp(u * 2 - 1)); c.restore(); }
    c.restore();
  }
  function badge(c, x, y, r, ring) {   // lingkaran ikon krem dengan cincin warna
    c.save(); c.fillStyle = "rgba(16,20,64,0.22)"; c.beginPath(); c.arc(x + 4, y + 7, r, 0, TAU); c.fill();
    c.fillStyle = ring; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.fillStyle = CREAM; c.beginPath(); c.arc(x, y, r * 0.86, 0, TAU); c.fill();
    c.fillStyle = "rgba(255,255,255,0.5)"; c.beginPath(); c.arc(x - r * 0.3, y - r * 0.38, r * 0.16, 0, TAU); c.fill(); c.restore();
  }
  // ikon cerita darurat (digambar di dalam lencana, satuan r)
  function icCrash(c, x, y, r, t) {
    c.save(); c.translate(x, y + r * 0.12); const s = r / 60;
    // bintang benturan
    c.save(); c.translate(-18 * s, -6 * s); c.rotate(Math.sin(t * 9) * 0.06); c.fillStyle = AMB; c.beginPath();
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = (i % 2 ? 13 : 30) * s; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill();
    c.fillStyle = "#FFE7A8"; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = (i % 2 ? 7 : 16) * s; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore();
    // mobil miring
    c.rotate(-0.16 + Math.sin(t * 9) * 0.02); c.fillStyle = "#4F7FE8"; H.rr(c, -8 * s, -14 * s, 46 * s, 20 * s, 7 * s); c.fill(); H.rr(c, 0, -27 * s, 28 * s, 16 * s, 6 * s); c.fill();
    c.fillStyle = "#CFE6FF"; H.rr(c, 4 * s, -24 * s, 10 * s, 10 * s, 3 * s); c.fill(); H.rr(c, 17 * s, -24 * s, 9 * s, 10 * s, 3 * s); c.fill();
    c.fillStyle = "#2A2F6A"; c.beginPath(); c.arc(2 * s, 7 * s, 7 * s, 0, TAU); c.arc(30 * s, 7 * s, 7 * s, 0, TAU); c.fill();
    c.fillStyle = "#B9C2DE"; c.beginPath(); c.arc(2 * s, 7 * s, 3 * s, 0, TAU); c.arc(30 * s, 7 * s, 3 * s, 0, TAU); c.fill();
    c.restore();
  }
  function icPolice(c, x, y, r, t) {
    c.save(); c.translate(x, y + r * 0.2); const s = r / 60, ph = Math.floor(t * 4) % 2;
    // sinar berputar
    for (let i = 0; i < 2; i++) { const a = t * 5 + i * PI; c.fillStyle = D.hexA(i ? "#4F7FE8" : RED, 0.35); c.beginPath(); c.moveTo(0, -16 * s);
      c.arc(0, -16 * s, 52 * s, a - 0.35, a + 0.35); c.closePath(); c.fill(); }
    c.fillStyle = "#3A3F78"; H.rr(c, -30 * s, 6 * s, 60 * s, 12 * s, 4 * s); c.fill();
    c.fillStyle = ph ? RED : "#4F7FE8"; c.beginPath(); c.moveTo(-22 * s, 6 * s); c.lineTo(-20 * s, -18 * s); c.quadraticCurveTo(0, -42 * s, 20 * s, -18 * s); c.lineTo(22 * s, 6 * s); c.closePath(); c.fill();
    c.fillStyle = "rgba(255,255,255,0.55)"; c.beginPath(); c.ellipse(-8 * s, -16 * s, 4 * s, 9 * s, 0.3, 0, TAU); c.fill();
    D.glow(c, 0, -14 * s, 46 * s, ph ? RED : "#4F7FE8", 0.6);
    c.restore();
  }
  function icHospital(c, x, y, r, t) {
    c.save(); c.translate(x, y); const s = r / 60, b = 1 + 0.06 * Math.max(0, Math.sin(t * 6));
    c.fillStyle = "#FFFFFF"; H.rr(c, -32 * s, -30 * s, 64 * s, 60 * s, 12 * s); c.fill(); c.strokeStyle = "#D7DDF2"; c.lineWidth = 3 * s; c.stroke();
    c.save(); c.scale(b, b); c.fillStyle = RED; H.rr(c, -7 * s, -22 * s, 14 * s, 44 * s, 4 * s); c.fill(); H.rr(c, -22 * s, -7 * s, 44 * s, 14 * s, 4 * s); c.fill(); c.restore();
    // garis detak jantung
    c.strokeStyle = "#3FB48A"; c.lineWidth = 4 * s; c.lineJoin = "round"; c.beginPath(); const ox = ((t * 40) % 20) * s;
    c.moveTo(-34 * s, 40 * s); c.lineTo(-12 * s + ox * 0, 40 * s); c.lineTo(-6 * s, 28 * s); c.lineTo(2 * s, 50 * s); c.lineTo(8 * s, 40 * s); c.lineTo(34 * s, 40 * s); c.stroke();
    c.restore();
  }
  const ICDRAW = [icCrash, icPolice, icHospital], ICCOL = [AMB, "#4F7FE8", RED];
  function chip(c, x, y, s, t) {   // ikon "teknologi": cip
    c.save(); c.translate(x, y); c.rotate(Math.sin(t * 2) * 0.05);
    c.strokeStyle = "#B9C2DE"; c.lineWidth = s * 0.06; c.lineCap = "round";
    for (let i = -1; i <= 1; i++) { const k = i * s * 0.22; c.beginPath(); c.moveTo(k, -s * 0.5); c.lineTo(k, -s * 0.34); c.moveTo(k, s * 0.34); c.lineTo(k, s * 0.5);
      c.moveTo(-s * 0.5, k); c.lineTo(-s * 0.34, k); c.moveTo(s * 0.34, k); c.lineTo(s * 0.5, k); c.stroke(); }
    c.fillStyle = "#3A4290"; H.rr(c, -s * 0.36, -s * 0.36, s * 0.72, s * 0.72, s * 0.1); c.fill();
    c.fillStyle = P.teal; H.rr(c, -s * 0.2, -s * 0.2, s * 0.4, s * 0.4, s * 0.06); c.fill();
    c.fillStyle = "rgba(255,255,255,0.6)"; c.beginPath(); c.arc(-s * 0.24, -s * 0.24, s * 0.04, 0, TAU); c.fill();
    D.glow(c, 0, 0, s * 0.5, P.teal, 0.25 + 0.15 * Math.sin(t * 5));
    c.restore();
  }
  function weker(c, x, y, r, t, ring) {   // jam weker tanpa angka; ring 0..1 = berdering (bergetar, jarum berputar cepat)
    const sh = ring * Math.sin(t * 46) * 0.09;
    c.save(); c.translate(x, y); c.rotate(sh);
    c.fillStyle = "rgba(16,20,64,0.22)"; c.beginPath(); c.ellipse(4, r * 1.18, r * 0.8, r * 0.1, 0, 0, TAU); c.fill();
    // kaki dan lonceng
    c.strokeStyle = "#B4552E"; c.lineWidth = r * 0.12; c.lineCap = "round"; c.beginPath(); c.moveTo(-r * 0.55, r * 0.75); c.lineTo(-r * 0.75, r * 1.12); c.moveTo(r * 0.55, r * 0.75); c.lineTo(r * 0.75, r * 1.12); c.stroke();
    const bell = (k) => { c.save(); c.translate(k * r * 0.62, -r * 0.86); c.rotate(k * 0.5 + ring * Math.sin(t * 60 + k) * 0.25); c.fillStyle = AMB; c.beginPath(); c.arc(0, 0, r * 0.38, PI, 0); c.closePath(); c.fill();
      c.fillStyle = "#D98A2B"; c.fillRect(-r * 0.4, -r * 0.02, r * 0.8, r * 0.1); c.restore(); };
    bell(-1); bell(1);
    c.fillStyle = "#B4552E"; c.fillRect(-r * 0.06, -r * 1.22, r * 0.12, r * 0.22);
    c.fillStyle = "#E8604A"; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.fillStyle = CREAM; c.beginPath(); c.arc(0, 0, r * 0.8, 0, TAU); c.fill();
    c.strokeStyle = "#4A527E"; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r0 = r * (i % 3 ? 0.66 : 0.6); c.lineWidth = i % 3 ? r * 0.035 : r * 0.07; c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72); c.stroke(); }
    const sp = 0.6 + ring * 9, am = t * sp, ah = t * sp / 12;
    c.strokeStyle = INK; c.lineCap = "round"; c.lineWidth = r * 0.09; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(ah) * r * 0.36, -Math.cos(ah) * r * 0.36); c.stroke();
    c.lineWidth = r * 0.06; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(am) * r * 0.58, -Math.cos(am) * r * 0.58); c.stroke();
    c.fillStyle = RED; c.beginPath(); c.arc(0, 0, r * 0.08, 0, TAU); c.fill();
    c.restore();
    if (ring > 0.05) {   // garis getar
      c.save(); c.strokeStyle = D.hexA("#FFFFFF", 0.85 * ring); c.lineWidth = r * 0.07; c.lineCap = "round";
      for (const k of [-1, 1]) for (let i = 0; i < 2; i++) { const rr = r * (1.3 + i * 0.28) + Math.sin(t * 20 + i) * r * 0.05; c.beginPath(); c.arc(x, y, rr, k > 0 ? -0.5 : PI - 0.5 + 0.0, k > 0 ? 0.5 : PI + 0.5); c.stroke(); }
      c.restore();
    }
  }
  function uang(c, x, y, s, rot, a = 1) {   // lembar uang tanpa tulisan
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
    c.fillStyle = "rgba(16,20,64,0.2)"; H.rr(c, -s / 2 + 3, -s * 0.25 + 5, s, s * 0.5, s * 0.06); c.fill();
    c.fillStyle = "#5BD68A"; H.rr(c, -s / 2, -s * 0.25, s, s * 0.5, s * 0.06); c.fill();
    c.strokeStyle = "#2F9E63"; c.lineWidth = s * 0.03; H.rr(c, -s * 0.42, -s * 0.18, s * 0.84, s * 0.36, s * 0.05); c.stroke();
    c.fillStyle = "#2F9E63"; c.beginPath(); c.arc(0, 0, s * 0.11, 0, TAU); c.fill(); c.fillStyle = "#BFF2D2"; c.beginPath(); c.arc(0, 0, s * 0.06, 0, TAU); c.fill();
    c.restore();
  }
  function miniJar(c, x, y, s, col) {   // toples kecil di slot buku (tanda bahan sudah keluar)
    c.save(); c.translate(x, y);
    c.fillStyle = "rgba(205,228,255,0.6)"; H.rr(c, -s * 0.36, -s * 0.34, s * 0.72, s * 0.78, s * 0.16); c.fill();
    c.fillStyle = col; H.rr(c, -s * 0.31, -s * 0.06, s * 0.62, s * 0.45, s * 0.12); c.fill();
    c.fillStyle = D.hexA(col, 0.8); H.rr(c, -s * 0.3, -s * 0.5, s * 0.6, s * 0.14, s * 0.05); c.fill();
    c.restore();
  }
  function sirene(c, x, y, s, t, a) {   // lampu darurat di atas kepala
    if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y);
    for (let i = 0; i < 2; i++) { const ang = t * 6 + i * PI; c.fillStyle = D.hexA(i ? "#FF8A3D" : RED, 0.28); c.beginPath(); c.moveTo(0, -s * 0.3);
      c.arc(0, -s * 0.3, s * 2.4, ang - 0.32, ang + 0.32); c.closePath(); c.fill(); }
    D.glow(c, 0, -s * 0.3, s * 1.4, RED, 0.5 + 0.3 * Math.sin(t * 12));
    c.fillStyle = "#3A3F78"; H.rr(c, -s * 0.62, 0, s * 1.24, s * 0.26, s * 0.08); c.fill();
    c.fillStyle = Math.floor(t * 5) % 2 ? RED : "#FF8A9A"; c.beginPath(); c.moveTo(-s * 0.48, 0); c.lineTo(-s * 0.44, -s * 0.5); c.quadraticCurveTo(0, -s * 1.02, s * 0.44, -s * 0.5); c.lineTo(s * 0.48, 0); c.closePath(); c.fill();
    c.fillStyle = "rgba(255,255,255,0.6)"; c.beginPath(); c.ellipse(-s * 0.16, -s * 0.42, s * 0.08, s * 0.2, 0.3, 0, TAU); c.fill();
    c.restore();
  }
  function kabut(c, x, y, r, t, a) {   // kabut berputar mengelilingi kepala
    if (a <= 0) return; c.save();
    for (let i = 0; i < 14; i++) { const ang = t * (0.7 + (i % 3) * 0.2) + i * 0.9, rr = r * (0.55 + 0.35 * ((i * 37) % 7) / 7), cx = x + Math.cos(ang) * rr * 1.25, cy = y + Math.sin(ang) * rr * 0.75;
      c.globalAlpha = a * (0.55 + 0.25 * Math.sin(t * 2 + i)); c.fillStyle = i % 2 ? "#E9E4FF" : "#D3CCF5"; c.beginPath(); c.arc(cx, cy, r * (0.28 + 0.1 * ((i * 13) % 5) / 5), 0, TAU); c.fill(); }
    c.restore();
  }
  // tanda seru dari gumpalan uap: (x, y) = tengah bawah, h = tinggi; form 0..1 (uap berkumpul menjadi tanda seru)
  const BANG = (() => { const r = D.rng(41), pts = [];
    for (let i = 0; i < 30; i++) { const u = i / 29, k = i % 3 - 1; pts.push([k * (0.075 - u * 0.04) + (r() - 0.5) * 0.012, -1 + 0.07 + u * 0.6, 0.09 - u * 0.035 + r() * 0.01]); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; pts.push([Math.cos(a) * 0.05, -0.1 + Math.sin(a) * 0.05, 0.055]); } pts.push([0, -0.1, 0.075]);
    return pts.map(p => p.concat([r() * TAU, r()])); })();
  function bang(c, x, y, h, form, t, a = 1) {
    if (a <= 0 || form <= 0) return; const f = eio(form);
    c.save(); c.globalAlpha *= a;
    D.glow(c, x, y - h * 0.5, h * 0.75, RED, 0.45 * f);
    const P2 = BANG.map(([px, py, pr, ph, rr], i) => {
      const sx = x + Math.sin(ph + t * 1.3) * h * 0.22 * (0.4 + rr), sy = y - h * (0.15 + ((rr + t * 0.25 + i * 0.03) % 1) * 0.9);
      return [lerp(sx, x + px * h + Math.sin(t * 2 + i) * h * 0.006, f), lerp(sy, y + py * h + Math.cos(t * 1.7 + i) * h * 0.006, f), lerp(h * 0.05, pr * h, f), lerp(0.5, 1, f)]; });
    c.fillStyle = "#FFF1F4"; P2.forEach(([px, py, pr, al]) => { c.globalAlpha = a * al * 0.55 * f; c.beginPath(); c.arc(px, py, pr * 1.3, 0, TAU); c.fill(); });
    c.fillStyle = "#D9466A"; P2.forEach(([px, py, pr, al]) => { c.globalAlpha = a * al; c.beginPath(); c.arc(px, py + pr * 0.12, pr * 1.05, 0, TAU); c.fill(); });
    c.fillStyle = "#FF8DA2"; P2.forEach(([px, py, pr, al]) => { c.globalAlpha = a * al; c.beginPath(); c.arc(px, py, pr, 0, TAU); c.fill(); });
    c.fillStyle = "#FFD2DB"; P2.forEach(([px, py, pr, al], i) => { if (i % 5) return; c.globalAlpha = a * al * 0.5; c.beginPath(); c.arc(px - pr * 0.3, py - pr * 0.35, pr * 0.3, 0, TAU); c.fill(); });
    c.restore();
  }
  function bukuKecil(c, x, y, s, rot) {   // buku resep tertutup (tanpa tulisan) di tangan pelaku
    c.save(); c.translate(x, y); c.rotate(rot);
    c.fillStyle = "#4E36A8"; H.rr(c, -s * 0.38, -s * 0.5, s * 0.8, s, s * 0.06); c.fill();
    c.fillStyle = "#7A5BD6"; H.rr(c, -s * 0.4, -s * 0.52, s * 0.76, s, s * 0.06); c.fill();
    c.strokeStyle = "rgba(255,244,226,0.7)"; c.lineWidth = s * 0.04; H.rr(c, -s * 0.3, -s * 0.42, s * 0.56, s * 0.8, s * 0.04); c.stroke();
    c.fillStyle = AMB; H.rr(c, -s * 0.16, s * 0.02, s * 0.28, s * 0.14, s * 0.04); c.fill();
    c.restore();
  }

  // layar HP Bu Rina tanpa teks kecil: panggilan masuk / sedang bicara / transfer
  function layarHP(mode) {
    return (c, w, h, tt) => {
      const g = c.createLinearGradient(0, 0, 0, h);
      if (mode === "transfer") { g.addColorStop(0, "#F4F7FF"); g.addColorStop(1, "#E3E9FA"); c.fillStyle = g; c.fillRect(0, 0, w, h);
        c.fillStyle = P.teal; c.fillRect(0, 0, w, h * 0.2); c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(w * 0.5, h * 0.42, w * 0.2, 0, TAU); c.fill();
        c.fillStyle = "#5BD68A"; H.rr(c, w * 0.34, h * 0.38, w * 0.32, w * 0.16, w * 0.04); c.fill();
        c.fillStyle = "rgba(60,70,120,0.35)"; H.rr(c, w * 0.2, h * 0.6, w * 0.6, w * 0.07, w * 0.035); c.fill();
        c.fillStyle = Math.floor(tt * 3) % 2 ? P.pink : "#FF8FB0"; H.rr(c, w * 0.15, h * 0.74, w * 0.7, w * 0.2, w * 0.1); c.fill(); return; }
      g.addColorStop(0, "#5B6BE0"); g.addColorStop(1, "#8A5FD6"); c.fillStyle = g; c.fillRect(0, 0, w, h);
      const ax = w * 0.5, ay = h * 0.32, ar = w * 0.24;
      if (mode === "dering") for (let i = 0; i < 2; i++) { const u = (tt * 0.9 + i * 0.5) % 1; c.strokeStyle = `rgba(255,255,255,${0.5 * (1 - u)})`; c.lineWidth = w * 0.04; c.beginPath(); c.arc(ax, ay, ar * (1 + u * 0.7), 0, TAU); c.stroke(); }
      c.fillStyle = "#B7C1F2"; c.beginPath(); c.arc(ax, ay, ar, 0, TAU); c.fill();
      c.save(); c.beginPath(); c.arc(ax, ay, ar, 0, TAU); c.clip(); c.fillStyle = "#8C9AD8"; c.beginPath(); c.arc(ax, ay - ar * 0.2, ar * 0.38, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(ax, ay + ar * 0.8, ar * 0.65, ar * 0.5, 0, 0, TAU); c.fill(); c.restore();
      const by = h * 0.8, br = w * 0.13;
      if (mode === "dering") { const pu = 1 + 0.12 * Math.max(0, Math.sin(tt * 6)); c.fillStyle = "#3FCF7A"; c.beginPath(); c.arc(w * 0.27, by, br * pu, 0, TAU); c.fill(); c.fillStyle = "#FF4D5E"; c.beginPath(); c.arc(w * 0.73, by, br, 0, TAU); c.fill(); }
      else { for (let i = 0; i < 5; i++) { const hh = h * (0.03 + 0.07 * Math.abs(Math.sin(tt * 7 + i * 1.3))); c.fillStyle = "rgba(255,255,255,0.85)"; H.rr(c, w * (0.24 + i * 0.11), h * 0.58 - hh / 2, w * 0.06, hh, w * 0.03); c.fill(); }
        c.fillStyle = "#FF4D5E"; c.beginPath(); c.arc(w * 0.5, by, br, 0, TAU); c.fill(); }
    };
  }
  const SCR = { dering: layarHP("dering"), bicara: layarHP("bicara"), transfer: layarHP("transfer") };

  // ---------- keadaan toples ----------
  function jarState(e, i, t) {
    const J = JARS[i], p0 = e.pop[i];
    if (t < p0) return null;
    const base = { x: J.x, y: CT, tilt: 0, pour: 0, fill: 0.72, a: 1, sq: clamp((t - p0) / 0.9) < 1 ? pop(t, p0, 12, 0.42) : 1 };
    const q = e.pour[i];
    if (t < q.lift) return base;
    const target = { x: POUR.x, y: POUR.y };
    if (t < q.at) { const u = eio((t - q.lift) / (q.at - q.lift)); const p = qpt([J.x, CT], [lerp(J.x, target.x, 0.45), Math.min(CT, target.y) - 200], [target.x, target.y], u);
      return Object.assign(base, { x: p[0], y: p[1], tilt: POUR.tilt * eio(clamp((u - 0.4) / 0.6)), sq: 1 }); }
    if (t < q.end) { const u = (t - q.pour) / (q.end - q.pour);
      return Object.assign(base, { x: target.x, y: target.y, tilt: POUR.tilt, pour: clamp(u * 1.6) * (u < 1 ? 1 : 0), fill: lerp(0.72, 0.12, clamp(u)), sq: 1 }); }
    if (t < q.out) { const u = eio((t - q.end) / (q.out - q.end));
      return Object.assign(base, { x: target.x - 260 * u, y: target.y - 360 * u, tilt: POUR.tilt + 0.8 * u, fill: 0.12, a: 1 - u, sq: 1 }); }
    return null;
  }
  // gelembung cerita darurat (b4_2): posisi naik dari mulut toples panik, lalu tersedot kembali di awal b4_3
  function iconState(e, i, t) {
    const t0 = e.ic[i] - 0.12, back = e.bahan2 + 0.05 + i * 0.12;
    if (t < t0 || t > back + 0.7) return null;
    const from = [JARS[0].x, CT - JAR_H + 10], to = [ICONS[i].x, ICONS[i].y];
    if (t < back) { const u = eout(clamp((t - t0) / 0.55)); const p = qpt(from, [lerp(from[0], to[0], 0.2), to[1] - 40], to, u);
      return { x: p[0], y: p[1] + Math.sin(t * 1.6 + i * 2) * 6, s: lerp(0.35, 1, u) * (1 + 0.08 * Math.max(0, 1 - (t - t0 - 0.5) / 0.3) * (t > t0 + 0.5 ? 1 : 0)), la: clamp((t - t0 - 0.3) / 0.25) * (1 - clamp((t - back + 0.1) / 0.2)) }; }
    const u = eio((t - back) / 0.7), p = qpt(to, [lerp(from[0], to[0], 0.4), to[1] - 30], from, u);
    return { x: p[0], y: p[1], s: lerp(1, 0.2, u), la: 0, a: 1 - clamp((u - 0.75) / 0.25) };
  }

  // ---------- adegan ----------
  K.SCENES.d03_b4 = function (ctx, b, l, t, TL) {
    const e = EV(TL), cam = camAt(e, t);
    const px = clamp((cam.x - 960) / 420, -1, 1) * 0.6, dm = -px * 60;
    const S = (x, y) => [(x + dm - cam.x) * cam.z + 960, (y - cam.y) * cam.z + 540];
    const labels = [];   // [teks, x dunia, y dunia, opsi] -> digambar sesudah vignette

    ctx.save(); ctx.translate(960, 540); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
    // api kompor: kecil, membesar saat bahan dituang
    const boil = clamp((t - e.boil) / 1.2), api = 0.45 + 0.5 * boil;
    LT.dapur(ctx, t, { px, panci: false, toples: false, near: false, api, jam: 10 });
    ctx.save(); ctx.translate(dm, 0);

    // ===== pelaku di jendela (b4_5) =====
    const pIn = eout(clamp((t - e.pelaku + 0.25) / 0.6));
    if (pIn > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(WIN.x + 207, WIN.y, WIN.w - 207, WIN.h - 18); ctx.clip();
      ctx.fillStyle = D.hexA("#1A1F55", 0.25 * pIn); ctx.fillRect(WIN.x + 207, WIN.y, WIN.w - 207, WIN.h);
      const hx = WIN.x + 300, hy = WIN.y + 112 + (1 - pIn) * 190 + Math.sin(t * 1.3) * 3;
      O.kepala(ctx, hx, hy, 50, Object.assign(O.preset("pelaku"), { t, look: [-0.7, 0.2], bahu: 1.3, view: "q" }));
      const lift = eout(clamp((t - e.manfaat + 0.1) / 0.5));
      bukuKecil(ctx, hx + 46, hy + 92 - lift * 26, 74, -0.15 - lift * 0.1);
      if (lift > 0) D.glow(ctx, hx + 46, hy + 70 - lift * 26, 80, AMB, 0.4 * lift * (0.7 + 0.3 * Math.sin(t * 6)));
      ctx.restore();
      // jeruji jendela digambar ulang di atas pelaku
      ctx.fillStyle = "#E8E2F6"; ctx.fillRect(WIN.x + WIN.w / 2 - 7, WIN.y, 14, WIN.h); ctx.fillRect(WIN.x, WIN.y + WIN.h * 0.42 - 6, WIN.w, 12);
      ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.beginPath(); ctx.moveTo(WIN.x + 230, WIN.y + WIN.h); ctx.lineTo(WIN.x + 330, WIN.y); ctx.lineTo(WIN.x + 350, WIN.y); ctx.lineTo(WIN.x + 250, WIN.y + WIN.h); ctx.fill();
    }

    // ===== panci =====
    const formU = clamp((t - e.form0) / (e.form1 - e.form0)), pulse = t > e.manfaat ? 0.5 + 0.5 * Math.sin((t - e.manfaat) * 7) : 0;
    const liquid = t < e.pour[0].pour + 0.2 ? "#9FC8F0" : t < e.pour[1].pour + 0.2 ? "#FF7F92" : t < e.pour[2].pour + 0.2 ? "#FF9A6A" : "#D9669A";
    const flyU = clamp((t - e.fly0) / (e.fly1 - e.fly0));
    B.panci(ctx, POT.x, POT.y, POT.size, { t, liquid, color: "#EE5560", steam: (0.45 + 0.55 * boil) * (formU > 0 && flyU < 1 ? 0.35 : 1), steamH: 240,
      steamCol: t > e.boil ? "#FFE9EE" : "#F4F1FF", glowCol: RED });
    if (formU > 0.3 && flyU <= 0) D.glow(ctx, POT.x, POT.y - 300, 230, RED, 0.35 * formU);

    // ===== buku resep =====
    if (t < e.away + 0.8) {
      const mv = eio((t - e.toWall) / 0.9), aw = eio((t - e.away) / 0.7);
      const bx = lerp(lerp(BOOK0.x, BOOK1.x, mv), WIN.x + 300, aw), by = lerp(lerp(BOOK0.y, BOOK1.y, mv), WIN.y + 150, aw) - Math.sin(aw * PI) * 120, bs = lerp(BOOK0.size, BOOK1.size, mv) * lerp(1, 0.28, aw);
      let open = eio((t - e.resep + 0.05) / 0.8); if (t > e.close) open = 1 - eio((t - e.close) / 0.45);
      let active = -1;
      if (t > e.bahannya && t < e.perasaan) active = Math.floor((t - e.bahannya) / 0.55) % 3;
      for (let i = 0; i < 3; i++) if (t > e.pop[i] - 1.2 && t < e.pop[i] + 0.6) active = i;
      if (t > e.ketiga && t < e.rahasia) active = 2;
      ctx.save(); ctx.globalAlpha *= 1 - clamp((t - e.away - 0.45) / 0.3);
      const hideT = (open > 0.06 && open < 0.94) || aw > 0.02;
      const bk = B.bukuResep(ctx, bx, by + Math.sin(t * 1.1) * 3 * mv, bs, { open, t, active, slotColors: [RED, AMB, VIO], title: hideT ? "" : undefined });
      // slot yang bahannya sudah keluar: toples mini
      if (open > 0.9) for (let i = 0; i < 3; i++) if (t > e.pop[i] + 0.1) {
        const [sx, sy] = bk.slots[i], rowH = bk.h * 0.72 / 3, pw = bk.w / 2;
        ctx.fillStyle = "#FFF8EA"; H.rr(ctx, sx - pw * 0.32, sy - rowH * 0.38, pw * 0.64, rowH * 0.76, rowH * 0.18); ctx.fill();
        const k = Math.min(1, pop(t, e.pop[i] + 0.1));
        ctx.save(); ctx.translate(sx, sy); ctx.scale(k, k); miniJar(ctx, -pw * 0.08, 0, rowH * 0.78, JARS[i].col);
        ctx.strokeStyle = "#3FB48A"; ctx.lineWidth = rowH * 0.1; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(pw * 0.1, 0); ctx.lineTo(pw * 0.15, rowH * 0.12); ctx.lineTo(pw * 0.25, -rowH * 0.14); ctx.stroke(); ctx.restore();
      }
      ctx.restore();
      // tetes perasaan menuju slot (b4_1)
      if (t > e.perasaan + 0.5 && t < e.perasaan + 1.5) for (let i = 0; i < 3; i++) {
        const u = eio((t - e.perasaan - 0.5 - i * 0.12) / 0.7); if (u <= 0 || u >= 1) continue;
        const p = qpt([CHIP.x, CHIP.y], [lerp(CHIP.x, bk.slots[i][0], 0.5), CHIP.y - 160], bk.slots[i], u);
        heart(ctx, p[0], p[1], 34 * (1 - 0.4 * u), [RED, AMB, VIO][i]); D.glow(ctx, p[0], p[1], 50, [RED, AMB, VIO][i], 0.5);
      }
      // cahaya dari slot ke meja saat toples melompat keluar
      for (let i = 0; i < 3; i++) { const u = (t - e.pop[i] + 0.3) / 0.4; if (u > 0 && u < 1.2) { const s0 = bk.slots[i], s1 = [JARS[i].x, CT - JAR_H * 0.5], k = eout(clamp(u));
        ctx.save(); ctx.strokeStyle = D.hexA(JARS[i].col, 0.75 * (1 - clamp((u - 0.8) / 0.4))); ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath();
        const a = qpt(s0, [lerp(s0[0], s1[0], 0.5), Math.min(s0[1], s1[1]) - 140], s1, Math.max(0, k - 0.35)), c2 = qpt(s0, [lerp(s0[0], s1[0], 0.5), Math.min(s0[1], s1[1]) - 140], s1, k);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke(); D.glow(ctx, c2[0], c2[1], 60, JARS[i].col, 0.7); ctx.restore(); } }
    }

    // ===== ikon "bukan teknologi" -> hati "perasaan" (b4_1) =====
    if (t > e.bukan - 0.1 && t < e.perasaan + 0.5) {
      const a = pop(t, e.bukan - 0.1), gone = eio((t - e.tekE - 0.35) / 0.5);
      ctx.save(); ctx.globalAlpha *= 1 - gone; ctx.translate(CHIP.x - gone * 60, CHIP.y + gone * 90); ctx.rotate(gone * -0.5); ctx.scale(a, a);
      badge(ctx, 0, 0, 74, P.teal); chip(ctx, 0, 0, 86, t); ctx.restore();
      cross(ctx, CHIP.x - gone * 60, CHIP.y + gone * 90, 52, clamp((t - e.tek - 0.1) / 0.35) * (1 - gone));
    }
    if (t > e.perasaan - 0.1 && t < e.perasaan + 1.2) {
      const a = pop(t, e.perasaan - 0.1, 10, 0.4) * (1 - eio((t - e.perasaan - 0.5) / 0.5)), beat = 1 + 0.08 * Math.max(0, Math.sin(t * 9));
      if (a > 0.01) { D.glow(ctx, CHIP.x, CHIP.y, 150 * a, RED, 0.6); heart(ctx, CHIP.x, CHIP.y + 6, 150 * a * beat, "#FF5A7A"); }
    }

    // ===== toples di meja / terbang ke panci =====
    for (let i = 0; i < 3; i++) {
      const s = jarState(e, i, t); if (!s) continue; const J = JARS[i];
      ctx.save(); ctx.globalAlpha *= s.a; ctx.translate(s.x, s.y);
      if (s.sq !== 1) { const k = clamp(s.sq, 0, 1.12); ctx.scale(Math.max(0.96, 1 + 0.22 * (1 - k)), Math.max(0.05, k)); }
      const bob = s.tilt === 0 && i === 0 && t > e.panik + 0.6 && t < e.b4_3 + 0.4 ? Math.sin(t * 22) * 1.5 : 0;
      const jr = B.toples(ctx, bob, 0, JAR_H, { label: J.label, textSize: JAR_TS, color: J.col, lidColor: J.lid, fill: s.fill, tilt: s.tilt, pour: s.pour, pourTo: POT.y - POT.size * 0.46 + 8 - s.y, t: t + i, seed: i });
      ctx.restore();
      // gembok kecil di tutup toples "rahasia" (sampai terbang di b4_4b)
      if (i === 2 && s.tilt === 0) {
        const lockGo = clamp((t - (e.tanya - 0.9)) / 0.9);
        if (lockGo <= 0) { const k = Math.min(1, pop(t, e.rahasia + 0.2)); B.gembok(ctx, J.x, CT - JAR_H - 34 + (1 - k) * 30, 74 * k, { locked: 1, color: AMB, t }); }
      }
      // gelembung isi "panik" mendidih
      if (i === 0 && s.tilt === 0 && t > e.panik + 0.4) for (let k = 0; k < 5; k++) { const u = (t * 0.9 + k * 0.21) % 1; ctx.fillStyle = D.hexA("#FFC2CC", 0.8 * Math.sin(PI * u)); ctx.beginPath(); ctx.arc(J.x - 40 + k * 20 + Math.sin(u * 8 + k) * 6, CT - JAR_H - 6 - u * 70, 7 + 5 * u, 0, TAU); ctx.fill(); }
    }

    // ===== cerita darurat (b4_2) =====
    for (let i = 0; i < 3; i++) {
      const s = iconState(e, i, t); if (!s) continue;
      ctx.save(); ctx.globalAlpha *= s.a == null ? 1 : s.a; ctx.translate(s.x, s.y); ctx.scale(s.s, s.s);
      badge(ctx, 0, 0, 66, ICCOL[i]); ICDRAW[i](ctx, 0, 0, 52, t); ctx.restore();
      if (s.la > 0) labels.push([ICONS[i].label, s.x, s.y + 108, { a: s.la, col: ICCOL[i], dy: (1 - s.la) * 16 }]);
    }

    // ===== terburu-buru (b4_3): weker, uang, tombol Tunggu dicoret =====
    const cIn = clamp((t - e.bahwa + 0.15) / 0.4), cOut = eio((t - e.bahan3 + 0.2) / 0.6);
    if (t > e.bahwa - 0.15 && cOut < 1) {
      const from = [JARS[1].x, CT - JAR_H], u = eout(cIn), p = qpt(from, [from[0], CLOCK.y - 60], [CLOCK.x, CLOCK.y], u);
      const p2 = qpt([CLOCK.x, CLOCK.y], [from[0], CLOCK.y - 40], from, cOut);
      const cx = cOut > 0 ? p2[0] : p[0], cy = cOut > 0 ? p2[1] : p[1], sc = cOut > 0 ? 1 - 0.8 * cOut : lerp(0.3, 1, u);
      const ring = clamp((t - e.sekarang + 0.05) / 0.2) * (1 - cOut) + 0.25 * cIn * (1 - cOut);
      ctx.save(); ctx.globalAlpha *= 1 - clamp((cOut - 0.8) / 0.2); ctx.translate(cx, cy); ctx.scale(sc, sc); weker(ctx, 0, 0, CLOCK.r, t, clamp(ring)); ctx.restore();
    }
    if (t > e.uang - 0.1 && t < e.kirim + 1.6) {   // uang keluar dari toples lalu terbang pergi saat "dikirim"
      for (let k = 0; k < 3; k++) {
        const u0 = eout(clamp((t - e.uang + 0.1 - k * 0.08) / 0.45)), fly = eio(clamp((t - e.kirim - k * 0.12) / 1.0));
        const x0 = JARS[1].x + (k - 1) * 40, y0 = CT - JAR_H - 70 - u0 * 60 - k * 18;
        const x = x0 + fly * (900 - k * 60), y = y0 - fly * (520 + k * 40) + Math.sin(fly * 6 + k) * 30 * fly;
        if (u0 > 0) uang(ctx, x, y, 110, -0.3 + k * 0.25 + fly * 2.2 + Math.sin(t * 3 + k) * 0.08, u0 * (1 - clamp((fly - 0.85) / 0.15)));
      }
      if (t > e.kirim && t < e.kirim + 0.8) { ctx.save(); ctx.strokeStyle = D.hexA("#FFFFFF", 0.6 * (1 - (t - e.kirim) / 0.8)); ctx.lineWidth = 6; ctx.lineCap = "round";
        for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(JARS[1].x + 20 + k * 30, CT - JAR_H - 120 - k * 30); ctx.lineTo(JARS[1].x + 120 + k * 60 + (t - e.kirim) * 300, CT - JAR_H - 200 - k * 40 - (t - e.kirim) * 200); ctx.stroke(); } ctx.restore(); }
    }
    if (t > e.tidak - 0.15 && cOut < 1) {
      const k = Math.min(1, pop(t, e.tidak - 0.15)), sc = (1 - 0.8 * cOut) * k;
      const p2 = qpt([TUNGGU.x, TUNGGU.y], [lerp(TUNGGU.x, JARS[1].x, 0.5), TUNGGU.y - 60], [JARS[1].x, CT - JAR_H], cOut);
      ctx.save(); ctx.globalAlpha *= 1 - clamp((cOut - 0.6) / 0.2); ctx.translate(p2[0], p2[1]); ctx.scale(sc, sc);
      if (sc > 0.9 || cOut === 0) B.tombol(ctx, 0, 0, TUNGGU.w, { label: "Tunggu", color: P.teal, textSize: 48, t });
      else { ctx.fillStyle = P.teal; H.rr(ctx, -TUNGGU.w / 2, -45, TUNGGU.w, 90, 36); ctx.fill(); }
      cross(ctx, 0, 6, 70, clamp((t - e.tunggu + 0.05) / 0.3));
      ctx.restore();
    }

    // ===== Bip =====
    {
      const bx = BIP.x, by = FY - BIP.s * 0.5; let o = { t, pose: "diam", mood: "happy", look: [0.6, -0.4], seed: 2 };
      if (t < e.resep) o = Object.assign(o, { look: [0.8, -0.5] });
      else if (t < e.bukan) o = Object.assign(o, { pose: "tunjuk", target: [BOOK0.x - 180, BOOK0.y - 40], mood: "happy" });
      else if (t < e.perasaan) o = Object.assign(o, { pose: "tunjuk", target: [CHIP.x, CHIP.y], mood: "think" });
      else if (t < e.panik) o = Object.assign(o, { mood: "wow", look: [-0.3, -0.8] });
      else if (t < e.panik + 1.4) o = Object.assign(o, { pose: "kaget", mood: "wow", k: t - e.panik });
      else if (t < e.bahan2) o = Object.assign(o, { mood: "sad", look: [0.1, -0.9] });
      else if (t < e.rahasia) o = Object.assign(o, { mood: t > e.sekarang ? "wow" : "think", look: [0.8, -0.7], sweat: t > e.sekarang });
      else if (t < e.rahasia + 1.2) o = Object.assign(o, { pose: "tunjuk", target: [JARS[2].x, CT - JAR_H * 0.6], mood: "think" });
      else if (t < e.pour[0].lift) o = Object.assign(o, { mood: "sad", look: [1, -0.3] });
      else if (t < e.form1) o = Object.assign(o, { pose: "tunjuk", target: [POT.x - 40, POT.y - 160], mood: "think" });
      else if (t < e.form1 + 1.4) o = Object.assign(o, { pose: "kaget", mood: "wow", k: t - e.form1, seru: false });
      else if (t < e.pelaku) o = Object.assign(o, { mood: "sad", look: [1, -0.4], sweat: true });
      else o = Object.assign(o, { pose: "tunjuk", target: [WIN.x + 300, WIN.y + 120], mood: "think" });
      B.draw(ctx, bx, by, BIP.s, o);
    }

    // ===== Bu Rina =====
    let rina;
    {
      const ring = t > e.ring && t < e.ear + 0.2 ? 1 : 0;
      const toEar = eio((t - e.ear) / 0.45), toHand = eio((t - e.tolong + 0.1) / 0.5);
      let face = "netral";
      if (t > e.ring) face = "bingung";
      if (t > e.w[1][0]) face = "sedih";
      if (t > e.membuat) face = "panik";
      const opt = Object.assign(O.preset("buRina"), { t, flip: true, face, look: t < e.ring ? [-0.2, 0.6] : [-0.6, 0.1], keringat: t > e.korban,
        pose: "pegangHP", dering: ring, glow: true });
      if (t > e.ring) opt.layar = toHand > 0.3 ? SCR.transfer : (t < e.ear + 0.3 ? SCR.dering : SCR.bicara);
      if (toEar > 0 && toHand <= 0) opt.blend = { to: "telepon", k: toEar };
      else if (toHand > 0) { opt.pose = "telepon"; opt.blend = { to: "pegangHP", k: toHand }; opt.look = [-0.3, 0.6]; }
      rina = O.draw(ctx, RINA.x, FY, RINA.h, opt);
    }

    // ===== b4_4a: gelembung dialog dari HP =====
    const bubIn = clamp((t - e.b4_4a + 0.05) / 0.3), bubOut = eio((t - e.membuat) / 0.5);
    const BUB = { x: 1250, y: 282, w: 650, h: 186 };
    if (bubIn > 0 && bubOut < 1) {
      const k = Math.min(1.05, pop(t, e.b4_4a - 0.05, 12, 0.5)) * (1 - bubOut), ph = rina.phone || rina.hand;
      const cx = lerp(BUB.x, ph[0], bubOut), cy = lerp(BUB.y, ph[1], bubOut);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
      const hi = t > e.kalimat ? 0.5 + 0.5 * Math.sin((t - e.kalimat) * 9) : 0;
      if (hi > 0) D.glow(ctx, 0, 0, BUB.w * 0.6, AMB, 0.35 * hi);
      ctx.fillStyle = "rgba(16,20,64,0.25)"; H.rr(ctx, -BUB.w / 2 + 5, -BUB.h / 2 + 8, BUB.w, BUB.h, 40); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; H.rr(ctx, -BUB.w / 2, -BUB.h / 2, BUB.w, BUB.h, 40); ctx.fill();
      ctx.beginPath(); ctx.moveTo(BUB.w / 2 - 120, BUB.h / 2 - 10); ctx.lineTo(ph[0] - cx - 10, ph[1] - cy - 30); ctx.lineTo(BUB.w / 2 - 40, BUB.h / 2 - 30); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = t > e.kalimat ? AMB : P.teal; ctx.lineWidth = 7; H.rr(ctx, -BUB.w / 2, -BUB.h / 2, BUB.w, BUB.h, 40); ctx.stroke();
      // ikon telepon kecil + gelombang
      ctx.fillStyle = P.teal; ctx.beginPath(); ctx.arc(-BUB.w / 2 + 2, -BUB.h / 2 + 2, 34, 0, TAU); ctx.fill();
      KIT.layar.ikon && KIT.layar.ikon(ctx, "telepon", -BUB.w / 2 + 2, -BUB.h / 2 + 2, 40, "#FFFFFF");
      ctx.restore();
      if (k > 0.85) labels.push(["__dialog", cx, cy, { a: 1 - bubOut }]);
    }

    // ===== b4_4b: tidak sempat bertanya ke orang lain =====
    const famIn = clamp((t - e.sempat + 0.1) / 0.4), famOut = clamp((t - e.pour[0].lift) / 0.6);
    if (famIn > 0 && famOut < 1) {
      const head = rina.head, lk = clamp((t - e.lain + 0.05) / 0.3);
      [AYAH, NENEK].forEach((F, j) => {
        const k = Math.min(1, pop(t, e.sempat - 0.1 + j * 0.15)) * (1 - famOut);
        // garis tanya putus-putus
        ctx.save(); ctx.globalAlpha *= (1 - famOut); ctx.setLineDash([16, 14]); ctx.lineDashOffset = -t * 60; ctx.lineCap = "round";
        const dl = clamp((t - e.sempat - 0.15) / 0.5);
        ctx.strokeStyle = lk > 0 ? D.hexA("#A9ACBA", 0.9) : D.hexA(CREAM, 0.95); ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(head[0] - 30, head[1] - 20); ctx.lineTo(lerp(head[0] - 30, F.x, dl), lerp(head[1] - 20, F.y, dl)); ctx.stroke(); ctx.setLineDash([]);
        // tanda tanya berjalan menuju keluarga, lalu terpental di gembok
        if (t > e.tanya - 0.1) { const block = 0.3; let u = Math.min(block, block * eout(clamp((t - e.tanya + 0.1) / 0.45)));
          if (t > e.lain) u = block * (1 - eio((t - e.lain) / 0.6)); else if (u >= block) u = block - 0.02 * Math.abs(Math.sin((t - e.tanya) * 9));
          const qx = lerp(head[0] - 30, F.x, u), qy = lerp(head[1] - 20, F.y, u), qa = t > e.lain ? 1 - clamp((t - e.lain) / 0.6) : 1;
          if (qa > 0) { ctx.save(); ctx.globalAlpha *= qa; ctx.setLineDash([]); ctx.fillStyle = "rgba(16,20,64,0.25)"; ctx.beginPath(); ctx.arc(qx + 3, qy + 5, 38, 0, TAU); ctx.fill();
            ctx.fillStyle = AMB; ctx.beginPath(); ctx.arc(qx, qy, 38, 0, TAU); ctx.fill(); D.txt(ctx, "?", qx, qy + 19, 54, { align: "center", color: INK, weight: 900 }); ctx.restore(); } }
        ctx.restore();
        if (k > 0.02) {
          ctx.save(); ctx.translate(F.x, F.y); ctx.scale(k, k);
          ctx.fillStyle = "rgba(16,20,64,0.25)"; ctx.beginPath(); ctx.arc(4, 8, 78, 0, TAU); ctx.fill();
          ctx.fillStyle = lk > 0 ? "#B9BCCB" : "#FFFFFF"; ctx.beginPath(); ctx.arc(0, 0, 78, 0, TAU); ctx.fill();
          ctx.fillStyle = j ? "#E9E1FF" : "#DCEBFF"; ctx.beginPath(); ctx.arc(0, 0, 68, 0, TAU); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 68, 0, TAU); ctx.clip();
          O.kepala(ctx, 0, 10, 40, Object.assign(O.preset(j ? "nenek" : "ayah"), { t, face: "netral", bahu: 1.1, seed: 8 + j }));
          if (lk > 0) { ctx.fillStyle = D.hexA("#3A3F78", 0.45 * lk); ctx.fillRect(-80, -80, 160, 160); }
          ctx.restore(); ctx.restore();
          labels.push([j ? "Nenek" : "Ayah", F.x, F.y + 116, { a: k, col: lk > 0 ? "#A9ACBA" : P.teal }]);
        }
      });
      // gembok dari toples "rahasia" terbang dan mengunci
      const lf = clamp((t - (e.tanya - 0.9)) / 0.9);
      if (lf > 0) {
        const from = [JARS[2].x, CT - JAR_H - 34], u = eio(lf), p = qpt(from, [lerp(from[0], LOCK.x, 0.5), LOCK.y - 160], [LOCK.x, LOCK.y], u);
        ctx.save(); ctx.globalAlpha *= 1 - famOut; B.gembok(ctx, p[0], p[1], lerp(74, 120, u), { locked: t > e.lain - 0.2 ? clamp((t - e.lain + 0.2) / 0.3) : 0, color: AMB, flash: clamp(1 - Math.abs(t - e.lain - 0.15) / 0.3), t }); ctx.restore();
      }
    }

    // ===== b4_5: uap tanda seru terbang ke kepala Bu Rina =====
    if (formU > 0 && flyU < 1) {
      const u = eio(flyU), P0 = [POT.x, POT.y - POT.size * 0.5], P1 = [rina.top[0] + 6, rina.top[1] - 14];
      const q = qpt(P0, [lerp(P0[0], P1[0], 0.5), Math.min(P0[1], P1[1]) - 300], P1, u);
      bang(ctx, q[0], q[1], lerp(310, 90, u), formU, t, 1 - clamp((flyU - 0.8) / 0.2));
    }
    // ===== b4_5: mode darurat, ingin menolong, kabut =====
    if (t > e.mode - 0.1) {
      const a = clamp((t - e.mode + 0.1) / 0.3) * (1 - 0.6 * clamp((t - e.sulit) / 0.8));
      sirene(ctx, rina.top[0] + 6, rina.top[1] - 26, 58, t, a);
    }
    const trIn = clamp((t - e.tolong + 0.2) / 0.35);
    if (trIn > 0) {
      const k0 = Math.min(1.05, pop(t, e.tolong - 0.2, 11, 0.5)), k = lerp(0.72, 1, k0), CX = 1330, CY = 452, ph = rina.phone || rina.hand;
      ctx.save(); ctx.globalAlpha *= clamp(k0 * 2.5); ctx.translate(CX, CY); ctx.scale(k, k);
      ctx.fillStyle = "rgba(16,20,64,0.25)"; H.rr(ctx, -200 + 5, -128 + 8, 400, 256, 36); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; H.rr(ctx, -200, -128, 400, 256, 36); ctx.fill();
      ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(ph[0] - CX - 20, ph[1] - CY - 10); ctx.lineTo(190, 40); ctx.closePath(); ctx.fill();
      const bl = t > e.manfaat ? 1 : 0.6;
      B.tombol(ctx, 0, 52, 300, { label: "Transfer", color: P.pink, textSize: 52, blink: bl, t });
      ctx.restore();
      labels.push(["Rp3.000.000", CX, CY - 62, { a: k > 0.9 ? 1 : 0, plain: true }]);
    }
    if (t > e.sulit - 0.2) kabut(ctx, rina.head[0] + 6, rina.head[1] - 6, 96, t, clamp((t - e.sulit + 0.2) / 1.0) * 0.95);

    ctx.restore();   // dm
    LT.depan(ctx, "dapur", t, { px });
    // nada darurat: denyut merah lembut di seluruh ruangan
    if (t > e.mode - 0.1) { const a = clamp((t - e.mode + 0.1) / 0.4) * (0.07 + 0.05 * Math.sin(t * 6)); ctx.fillStyle = D.hexA(RED, a); ctx.fillRect(-200, -200, 2400, 1600); }
    ctx.restore();   // kamera

    // ===== label sesudah vignette =====
    D.post(c => {
      labels.forEach(([s, wx, wy, o]) => {
        const [x, y] = S(wx, wy);
        if (s === "__dialog") {
          const z = cam.z, fs = Math.round(50 * z), lines = [["Jangan", "bilang"], ["siapa-siapa", "dulu."]];
          let wi = 0; c.save(); c.globalAlpha = o.a; c.font = `800 ${fs}px ${K.FONT}`;
          lines.forEach((ln, r) => { const full = ln.join(" "), w = c.measureText(full).width; let xx = x - w / 2 + 18 * z; const yy = y + (r - 0.5) * fs * 1.15 + fs * 0.36;
            ln.forEach(wd => { const ws = e.w[wi] ? e.w[wi][0] : 0, al = clamp((t - ws + 0.06) / 0.14); wi++;
              c.save(); c.globalAlpha = o.a * (0.18 + 0.82 * al); D.txt(c, wd, xx, yy - (1 - al) * 8, fs, { color: INK, weight: 800 }); c.restore(); xx += c.measureText(wd + " ").width; }); });
          c.restore(); return;
        }
        c.save(); c.globalAlpha = o.a;
        if (o.plain) D.txt(c, s, x, y + 16, Math.round(46 * cam.z), { align: "center", color: INK, weight: 900 });
        else D.label(c, s, x, y + (o.dy || 0), { size: 44, col: o.col || AMB });
        c.restore();
      });
    });
  };
  K.SCENES.d03_b4.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b4 = TL => {
    const e = EV(TL), at = (tt, kind, amp) => [+tt.toFixed(3), kind, amp];
    return [
      K.sfxAt(TL, "b4_1", "resep", -0.55, "whoosh", 0.55),        // buku terbuka
      K.sfxAt(TL, "b4_1", "teknologi", 0.2, "clack", 0.5),        // cip dicoret
      K.sfxAt(TL, "b4_1", "perasaan", 0.0, "shimmer", 0.6),       // hati muncul
      K.sfxAt(TL, "b4_2", "panik", 0.05, "pop", 0.85),            // toples panik mendarat
      K.sfxAt(TL, "b4_2", "kecelakaan", 0.0, "pop", 0.5),
      K.sfxAt(TL, "b4_2", "rumah sakit", 0.0, "pop", 0.5),
      K.sfxAt(TL, "b4_3", "terburu-buru", 0.05, "pop", 0.85),     // toples terburu-buru
      K.sfxAt(TL, "b4_3", "dikirim", -0.45, "whoosh", 0.6),       // uang terbang
      K.sfxAt(TL, "b4_3", "menunggu", 0.15, "clack", 0.6),        // Tunggu dicoret
      K.sfxAt(TL, "b4_4", "rahasia", 0.05, "pop", 0.85),          // toples rahasia
      K.sfxAt(TL, "b4_4b", "lain", 0.0, "clack", 0.8),            // gembok mengunci
      at(e.pour[0].lift - 0.35, "whoosh", 0.5),                   // toples terbang ke panci
      at(e.form1, "riser", 0.6),                                  // uap jadi tanda seru
      K.sfxAt(TL, "b4_5", "mode darurat", 0.0, "boom", 0.6),      // sirene darurat
      K.sfxAt(TL, "b4_5", "menolong", -0.1, "pop", 0.55),         // tombol Transfer
      K.sfxAt(TL, "b4_5", "Pelaku", -0.1, "boom", 0.7),           // pelaku di jendela
    ].filter(Boolean);
  };
})(typeof window !== "undefined" ? window : globalThis);
