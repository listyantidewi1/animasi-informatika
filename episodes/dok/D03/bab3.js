/* D03 bab 3: "Dari mana suaramu diambil?" (b3_1, b3_2, b3_3, b3_3a, b3_3b, b3_4).
   Metafora utama bab: pelaku "memanen" suara dari internet ke dalam sebuah toples. Satu panggung yang bersambung di studio:
   peta media sosial (K.kit.peta.sosial, dipakai lagi di bab 8) di kiri, pelaku berkerudung dengan toples "contoh suara" di kanan, Bip di kiri bawah.
   b3_1 pelaku tidak perlu masuk rumah (jalur dicoret) → ikon unggahan berkelip, suara menyebar ke internet;
   b3_2 empat unggahan keluar sebagai kartu (ulang tahun, siaran langsung, tugas sekolah, pesan suara); pola suaranya disalin ke toples;
   b3_3–b3_3b telepon dari nomor tak dikenal: Bu Rina mengangkat, pelaku diam dan merekam; rekaman (pita telepon) dipotong jadi klip lalu masuk toples;
   b3_4 dari unggahan yang sama pelaku mencatat nama, panggilan, kebiasaan → cerita palsu "Bu, ini aku, Kakak…" terdengar meyakinkan.
   Semua keadaan dihitung dari waktu absolut (bukan dari beat), sehingga silang-pudar antarbeat tidak terlihat; kamera sendiri (noCam).
   Profil suara tetap: ibu seed 11, anak seed 23. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, L = KIT.layar, O = KIT.orang, LT = KIT.latar, B = KIT.bipkit, PT = KIT.peta;
  const { clamp, lerp, eio, eout, spring } = D;
  const TAU = Math.PI * 2;
  const IBU = Object.assign({}, L.SUARA.ibu, { seed: 11 }), ANAK = Object.assign({}, L.SUARA.anak, { seed: 23 });
  const NAVY = "#1E2A6B", CREAM = "#FFF6E6";
  const ICOL = [P.pink, P.red, P.pink, P.teal];

  // ---------- tata letak dunia (px, sebelum kamera) ----------
  const MAP = { cx: 650, cy: 440, s: 0.8 };
  const HOUSE = [MAP.cx + 60 * MAP.s, MAP.cy - 2 * MAP.s];
  const JAR = { x: 1390, y: 885, size: 320 };
  const PEL = { x: 1722, y: 885, h: 470 };
  const BIP = { x: 228, y: 828, s: 150 };
  const RINA = { x: 420, y: 885, h: 540 };
  const STAGE = [[440, 600], [985, 600]];
  const CARD = { w: 520, h: 382 };
  const SLOTS = [[-50, -52, -0.1], [52, -64, 0.12], [-42, -114, 0.08], [44, -130, -0.1], [0, -186, 0.04]];
  const CLIP = { w: 116, h: 54 };
  const R1c = [1250 + 180, 215 + 70];

  function iconPos(i, t) {   // rumus posisi ikon sosial() (n = 4, show penuh)
    const ang = -Math.PI / 2 + (i - 1.5) * 0.78, bob = Math.sin(t * 1.8 + i * 1.7) * 7;
    return [MAP.cx + (60 + Math.cos(ang) * 330 + Math.sin(t * 0.7 + i) * 6) * MAP.s, MAP.cy + (-2 + Math.sin(ang) * 250 + bob) * MAP.s];
  }

  // ---------- waktu kejadian (detik absolut, dari kata sungguhan) ----------
  let EVk = null, EVc = null;
  function EV(TL) {
    if (EVk === TL && EVc) return EVc;
    const bb = id => TL.beats.find(x => x.id === id);
    const A = (id, s, o = 0) => { const b = bb(id); return b.start + D.at(b, s) + o; };
    const E = (id, s, o = 0) => { const b = bb(id); return b.start + D.atEnd(b, s) + o; };
    const Wd = (id, i, end) => { const b = bb(id); return b.start + (b.words && b.words[i] ? b.words[i][end ? 2 : 1] : D.lead(b) + i * 0.6); };
    const e = {};
    ["b3_1", "b3_2", "b3_3", "b3_3a", "b3_3b", "b3_4"].forEach(id => { const b = bb(id); e[id] = b.start; e[id + "e"] = b.start + b.dur; });
    e.pel = A("b3_1", "Pelaku"); e.masuk = A("b3_1", "masuk"); e.rumah = A("b3_1", "rumahmu"); e.rumahE = E("b3_1", "rumahmu");
    e.rekam = A("b3_1", "merekam"); e.banyak = A("b3_1", "Banyak"); e.sebar = A("b3_1", "tersebar"); e.inet = A("b3_1", "internet");
    e.v = [A("b3_2", "Video ulang"), A("b3_2", "siaran langsung"), A("b3_2", "video tugas"), A("b3_2", "rekaman pesan")];
    e.vE = [E("b3_2", "media sosial"), E("b3_2", "berjualan"), E("b3_2", "sekolah"), E("b3_2", "grup")];
    e.grup = A("b3_2", "diteruskan"); e.semua = A("b3_2", "semuanya"); e.jelas = A("b3_2", "suara yang jelas");
    e.kadang = A("b3_3", "Kadang"); e.telp = A("b3_3", "menelepon"); e.nomor = A("b3_3", "nomor tak"); e.diam = A("b3_3", "lalu diam");
    e.angkat = A("b3_3", "mengangkat"); e.berkata = A("b3_3", "berkata");
    e.h = [Wd("b3_3a", 0), Wd("b3_3a", 1), Wd("b3_3a", 2)]; e.hE = Wd("b3_3a", 3, true);
    e.detik = A("b3_3b", "detik"); e.perc = A("b3_3b", "percakapan"); e.cukup = A("b3_3b", "cukup"); e.ambil = A("b3_3b", "mengambil"); e.contoh = A("b3_3b", "contoh suara");
    e.ungg = A("b3_4", "unggahan"); e.pel4 = A("b3_4", "pelaku"); e.nama = A("b3_4", "nama anggota"); e.pgl = A("b3_4", "nama panggilan");
    e.bias = A("b3_4", "kebiasaan"); e.detail = A("b3_4", "Detail"); e.cerita = A("b3_4", "cerita palsunya"); e.yakin = A("b3_4", "meyakinkan");
    // kartu unggahan: muncul (a), salinan suara berangkat (lv), kembali ke ikon (r)
    e.card = e.v.map((v, i) => { const lv = e.vE[i] + [0.1, 0.25, 0.3, 0.15][i]; return { a: v - 0.12, lv, land: lv + 0.85, r: lv + 0.35 }; });
    e.clip4 = { lv: e.ambil - 0.05, land: e.ambil + 0.7 };
    e.lands = e.card.map(c => c.land).concat([e.clip4.land]);
    e.callIn = e.nomor - 0.3; e.callOut = e.b3_3b + 0.95;
    e.tags = [{ t: e.nama, src: 0, row: 0 }, { t: e.pgl, src: 3, row: 1 }, { t: e.bias, src: 2, row: 2 }];
    // kamera bersambung sepanjang bab: [t, x, y, z]
    e.cam = [[e.b3_1, 960, 540, 1.0], [e.inet + 1.2, 940, 510, 1.045], [e.v[2], 950, 520, 1.04], [e.semua, 975, 535, 1.035],
      [e.b3_3 + 0.6, 960, 540, 1.02], [e.nomor + 0.4, 945, 525, 1.045], [e.berkata, 960, 505, 1.05], [e.hE, 985, 490, 1.06],
      [e.ambil, 1000, 520, 1.055], [e.b3_4 + 1.5, 965, 525, 1.02], [e.detail, 985, 505, 1.04], [e.b3_4e, 990, 500, 1.05]];
    EVk = TL; EVc = e; return e;
  }

  const mkCam = (fx, fy, z) => ({ fx, fy, z, S: (x, y) => [(x - fx) * z + 960, (y - fy) * z + 540], apply(c) { c.translate(960, 540); c.scale(z, z); c.translate(-fx, -fy); } });
  const win = (t, a, b, fi = 0.3, fo = 0.3) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));
  const pop = (t, t0, k = 11, z = 0.5) => (t <= t0 ? 0 : Math.min(1.08, spring(t - t0, k, z)));
  const qpt = (p0, p1, p2, u) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  const speaking = (TL, t) => { const b = TL.beats.find(x => t >= x.start && t < x.start + x.dur); if (!b || !b.words) return false; const l = t - b.start; return b.words.some(w => l >= w[1] - 0.03 && l <= w[2]); };

  // ---------- benda kecil ----------
  function clipCard(c, x, y, w, h, prof, o = {}) {   // potongan pola suara (mini spektrogram berbingkai)
    c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); if (o.a != null) c.globalAlpha *= o.a;
    const col = o.col || (prof === ANAK ? P.teal : P.pink);
    if (o.glow) D.glow(c, 0, 0, Math.max(w, h) * 1.1, col, 0.45 * o.glow);
    c.fillStyle = "rgba(10,14,50,0.35)"; H.rr(c, -w / 2 + 3, -h / 2 + 5, w, h, 10); c.fill();
    L.spektrogram(c, -w / 2, -h / 2, w, h, { profil: prof, dur: 3, fmax: o.fmax || 5500, scroll: o.scroll || 0, telepon: o.telepon || 0, frame: true, aksen: col, r: Math.min(12, h * 0.2) });
    c.restore();
  }
  function heart(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s / 100, s / 100); c.fillStyle = col; c.beginPath(); c.moveTo(0, 30);
    c.bezierCurveTo(-60, -10, -40, -60, 0, -32); c.bezierCurveTo(40, -60, 60, -10, 0, 30); c.fill(); c.restore(); }
  function playBtn(c, x, y, r, a = 1) { c.save(); c.globalAlpha *= a; c.fillStyle = "rgba(10,14,50,0.45)"; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.moveTo(x - r * 0.3, y - r * 0.45); c.lineTo(x + r * 0.5, y); c.lineTo(x - r * 0.3, y + r * 0.45); c.closePath(); c.fill(); c.restore(); }
  function wave(c, x, y, w, h, t, col, n = 18, amp = 1, seed = 0) {
    c.fillStyle = col; for (let i = 0; i < n; i++) { const v = (0.3 + 0.7 * Math.abs(Math.sin(i * 1.7 + seed) * Math.sin(t * 5 + i * 0.9 + seed))) * amp, bw = w / n * 0.55, hh = Math.max(4, h * v);
      H.rr(c, x + i * w / n, y - hh / 2, bw, hh, bw / 2); c.fill(); }
  }

  // ---------- gambar kecil di dalam kartu unggahan (lokal: 0..w, 0..h) ----------
  const TH = [
    function ultah(c, w, h, t) {   // video ulang tahun: keluarga mengelilingi kue
      const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#FFC2D3"); gr.addColorStop(1, "#FF8FB1"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      const fc = ["#FFD38A", "#3FD8C8", "#9584FF", "#FFFFFF", "#5AA9FF"]; c.strokeStyle = "rgba(255,255,255,0.8)"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 18); c.quadraticCurveTo(w / 2, 52, w, 18); c.stroke();
      for (let i = 0; i < 9; i++) { const u = (i + 0.5) / 9, x = u * w, y = 18 + 4 * 34 * u * (1 - u) + 2, sw = Math.sin(t * 2 + i) * 0.12; c.save(); c.translate(x, y); c.rotate(sw); c.fillStyle = fc[i % 5]; c.beginPath(); c.moveTo(-13, 0); c.lineTo(13, 0); c.lineTo(0, 26); c.closePath(); c.fill(); c.restore(); }
      O.kepala(c, 92, 130, 44, Object.assign(O.preset("buRina"), { face: "senang", t, seed: 3 }));
      O.kepala(c, 360, 128, 44, Object.assign(O.preset("ayah"), { face: "senang", t, seed: 8 }));
      O.kepala(c, 226, 84, 36, Object.assign(O.preset("anakRina"), { face: "tertawa", t, seed: 5 }));
      // kue
      const kx = w / 2, ky = h - 6; c.fillStyle = "#FFF6E6"; H.rr(c, kx - 82, ky - 42, 164, 42, 12); c.fill(); c.fillStyle = "#F59A5B"; H.rr(c, kx - 82, ky - 24, 164, 10, 4); c.fill();
      c.fillStyle = "#FFE3EC"; H.rr(c, kx - 60, ky - 70, 120, 32, 10); c.fill();
      for (let i = 0; i < 3; i++) { const x = kx - 32 + i * 32; c.fillStyle = ["#5AA9FF", "#3FD8C8", "#9584FF"][i]; c.fillRect(x - 4, ky - 92, 8, 24);
        const fl = 1 + 0.18 * Math.sin(t * 13 + i * 2); D.glow(c, x, ky - 100, 22, P.amber, 0.7); c.fillStyle = "#FFD38A"; c.beginPath(); c.ellipse(x, ky - 101, 5, 9 * fl, 0, 0, TAU); c.fill(); }
      for (let i = 0; i < 14; i++) { const u = ((t * 0.35 + i * 0.137) % 1), x = (i * 97) % w, y = u * h; c.fillStyle = fc[i % 5]; c.save(); c.translate(x, y); c.rotate(t * 3 + i); c.fillRect(-5, -3, 10, 6); c.restore(); }
    },
    function live(c, w, h, t) {   // siaran langsung berjualan kue
      const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#FFE2B0"); gr.addColorStop(1, "#F5A86B"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(0, 70, w, 8); c.fillRect(0, 150, w, 8);
      for (let i = 0; i < 5; i++) { c.fillStyle = ["#FF8FB1", "#9584FF", "#3FD8C8", "#FFD38A", "#5AA9FF"][i]; H.rr(c, 300 + i * 34, 38, 24, 32, 6); c.fill(); }
      O.kepala(c, 160, 128, 58, Object.assign(O.preset("buRina"), { face: "senang", t, seed: 3 }));
      // kotak kue dipegang di depan
      c.fillStyle = "#FFF6E6"; H.rr(c, 200, 150, 150, 70, 10); c.fill(); c.strokeStyle = "#F59A5B"; c.lineWidth = 4; c.stroke();
      for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? "#C8794A" : "#E8A15F"; c.beginPath(); c.arc(224 + i * 34, 185, 14, 0, TAU); c.fill(); }
      // lencana LIVE + penonton + hati melayang
      const bl = 0.75 + 0.25 * Math.sin(t * 6); c.fillStyle = D.hexA(P.red, bl); H.rr(c, 16, 14, 150, 58, 12); c.fill();
      c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(38, 43, 8, 0, TAU); c.fill();
      c.save(); c.globalAlpha *= cardTxtA; D.txt(c, "LIVE", 54, 58, 40, { color: "#FFFFFF", weight: 900 }); c.restore();
      for (let i = 0; i < 6; i++) { const u = ((t * 0.5 + i / 6) % 1); heart(c, w - 50 + Math.sin(u * 7 + i) * 16, h - 20 - u * (h - 40), 26 + 8 * (i % 2), D.hexA(i % 2 ? P.pink : "#FF5A5F", Math.sin(Math.PI * u))); }
    },
    function sekolah(c, w, h, t) {   // video tugas sekolah: anak presentasi di depan papan
      c.fillStyle = "#3E8E6E"; c.fillRect(0, 0, w, h); c.fillStyle = "#2F7A5C"; c.fillRect(0, h - 26, w, 26);
      c.strokeStyle = "#C79A63"; c.lineWidth = 10; c.strokeRect(5, 5, w - 10, h - 36);
      c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = 4; c.lineCap = "round";
      c.beginPath(); c.moveTo(250, 50); c.lineTo(420, 50); c.moveTo(250, 82); c.lineTo(380, 82); c.moveTo(250, 114); c.lineTo(405, 114); c.stroke();
      c.strokeRect(272, 136, 90, 54); c.beginPath(); c.moveTo(300, 190); c.lineTo(334, 190); c.moveTo(317, 190); c.lineTo(317, 200); c.stroke();
      O.kepala(c, 140, 150, 58, Object.assign(O.preset("anakRina"), { face: speakingFlag ? "tertawa" : "senang", t, seed: 5 }));
      playBtn(c, w - 46, h - 58, 24, 0.9);
    },
    function pesan(c, w, h, t, gu) {   // pesan suara diteruskan ke grup
      c.fillStyle = "#DDEBFF"; c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(90,120,200,0.12)"; for (let y = 10; y < h; y += 30) for (let x = (y / 30 & 1) * 15; x < w; x += 30) { c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill(); }
      const bub = (x, y, s, a) => { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = "#FFFFFF"; c.shadowColor = "rgba(30,40,110,0.2)"; c.shadowBlur = 10; c.shadowOffsetY = 4;
        H.rr(c, -130, -36, 260, 72, 30); c.fill(); c.shadowColor = "transparent"; c.fillStyle = P.teal; c.beginPath(); c.arc(-94, 0, 24, 0, TAU); c.fill();
        c.fillStyle = "#FFFFFF"; c.beginPath(); c.moveTo(-102, -12); c.lineTo(-82, 0); c.lineTo(-102, 12); c.closePath(); c.fill(); wave(c, -58, 0, 170, 40, t, "#4B5BB8", 16, 1, 2); c.restore(); };
      bub(170, 70, 1, 1);
      // grup: tiga anggota menerima salinannya
      const gx = [320, 400, 360], gy = [150, 150, 205];
      for (let i = 0; i < 3; i++) { const u = clamp(gu * 3 - i * 0.8); if (u <= 0) continue;
        const ox = lerp(170, gx[i], eout(u)), oy = lerp(70, gy[i] - 4, eout(u)); bub(ox - 4, oy - 4, lerp(1, 0.32, eout(u)), 0.95); }
      for (let i = 0; i < 3; i++) { const a = clamp(gu * 4 - i * 0.6); if (a <= 0) continue; c.save(); c.globalAlpha *= a; c.fillStyle = ["#9584FF", "#FFB547", "#5BD68A"][i]; c.beginPath(); c.arc(gx[i] - 60, gy[i] + 6, 18, 0, TAU); c.fill(); c.restore(); }
      if (gu > 0) { c.save(); c.globalAlpha *= clamp(gu * 3); c.strokeStyle = "#4B5BB8"; c.lineWidth = 6; c.lineCap = "round"; c.beginPath(); c.moveTo(150, 150); c.quadraticCurveTo(170, 120, 215, 125); c.stroke();
        c.beginPath(); c.moveTo(203, 112); c.lineTo(218, 125); c.lineTo(202, 138); c.stroke(); c.restore(); }
    },
  ];
  let speakingFlag = false, cardTxtA = 1;
  const CARDS = [
    { label: "Video ulang tahun", prof: ANAK, col: P.teal },
    { label: "Siaran langsung", prof: IBU, col: P.pink },
    { label: "Video tugas sekolah", prof: ANAK, col: P.teal },
    { label: "Pesan suara", prof: IBU, col: P.pink },
  ];
  function postCard(c, i, cx, cy, k, a, t, e) {
    if (k <= 0.01 || a <= 0.01) return; const cd = CARDS[i], w = CARD.w, h = CARD.h;
    cardTxtA = clamp((k - 0.9) / 0.1);
    c.save(); c.globalAlpha *= a; c.translate(cx, cy); c.scale(k, k); c.translate(-w / 2, -h / 2);
    c.fillStyle = "rgba(10,14,50,0.32)"; H.rr(c, 6, 12, w, h, 28); c.fill();
    c.fillStyle = CREAM; H.rr(c, 0, 0, w, h, 28); c.fill();
    c.save(); H.rr(c, 20, 16, w - 40, 220, 18); c.clip(); c.translate(20, 16);
    TH[i](c, w - 40, 220, t, i === 3 ? clamp((t - e.grup) / 1.1) : 0); c.restore();
    // pita suara di dalam unggahan ini
    const sy = 244; L.spektrogram(c, 20, sy, w - 40, 62, { profil: cd.prof, dur: 3, fmax: 5500, scroll: t * 0.6, frame: true, aksen: cd.col, r: 10 });
    c.fillStyle = cd.col; c.beginPath(); c.arc(46, 350, 11, 0, TAU); c.fill();
    c.save(); c.globalAlpha *= cardTxtA; D.txt(c, cd.label, 68, 366, 44, { color: NAVY, weight: 800, fit: w - 90 }); c.restore();
    c.restore();
  }

  // layar HP kecil di tangan Bu Rina (tanpa teks)
  const rinaScreen = mode => (c, w, h, tt) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mode === "bicara" ? "#3E86C9" : mode === "chat" ? "#2FB5A6" : "#5B6BE0"); g.addColorStop(1, mode === "bicara" ? "#4B55B8" : mode === "chat" ? "#3B6FC0" : "#8A5FD6");
    c.fillStyle = mode === "mati" ? "#151A3E" : g; c.fillRect(0, 0, w, h); if (mode === "mati") return;
    c.fillStyle = "rgba(255,255,255,0.85)"; c.beginPath(); c.arc(w / 2, h * 0.3, w * 0.18, 0, TAU); c.fill();
    if (mode === "dering") { const pu = 0.5 + 0.5 * Math.sin(tt * 8); c.fillStyle = P.red; c.beginPath(); c.arc(w * 0.3, h * 0.78, w * 0.12, 0, TAU); c.fill(); c.fillStyle = P.green; c.beginPath(); c.arc(w * 0.7, h * 0.78, w * (0.12 + 0.03 * pu), 0, TAU); c.fill(); }
    else if (mode === "bicara") wave(c, w * 0.15, h * 0.62, w * 0.7, h * 0.12, tt, "#FFFFFF", 7, 1, 1);
    else { c.fillStyle = "rgba(255,255,255,0.8)"; H.rr(c, w * 0.1, h * 0.55, w * 0.6, h * 0.08, 6); c.fill(); H.rr(c, w * 0.3, h * 0.7, w * 0.6, h * 0.08, 6); c.fill(); }
  };

  // ---------- catatan pelaku ----------
  const ROWS = [{ s: "Bu Rina, Ayah", ic: "orang" }, { s: "Panggilan: Kakak", ic: "mik" }, { s: "Les tiap Sabtu", ic: "jam" }];
  const NOTE = { x: 1098, y: 100, w: 548, h: 330 };
  const rowPos = r => [NOTE.x + 104, NOTE.y + 116 + r * 80];
  function notebook(c, t, e, u) {
    if (u <= 0.01) return; const sp = Math.min(1.06, spring(t - e.pel4 + 0.15, 10, 0.55)), k = lerp(0.5, 1, sp);
    c.save(); c.globalAlpha *= clamp(u * 3); c.translate(NOTE.x + NOTE.w / 2, NOTE.y + NOTE.h / 2); c.scale(k, k); c.rotate(-0.015); c.translate(-NOTE.w / 2, -NOTE.h / 2);
    c.fillStyle = "rgba(10,14,50,0.35)"; H.rr(c, 8, 14, NOTE.w, NOTE.h, 20); c.fill();
    c.fillStyle = "#FFFBF2"; H.rr(c, 0, 0, NOTE.w, NOTE.h, 20); c.fill();
    c.fillStyle = "#3B3F78"; H.rr(c, 0, 0, NOTE.w, 58, 20); c.fill(); c.fillRect(0, 34, NOTE.w, 24);
    for (let i = 0; i < 8; i++) { const x = 44 + i * 66; c.fillStyle = "#1A1E4A"; c.beginPath(); c.arc(x, 58, 9, 0, TAU); c.fill(); c.strokeStyle = "#C8CCE8"; c.lineWidth = 5; c.beginPath(); c.arc(x, 48, 12, Math.PI * 0.15, Math.PI * 0.85, true); c.stroke(); }
    c.strokeStyle = "rgba(90,110,190,0.22)"; c.lineWidth = 2; for (let r = 0; r < 3; r++) { const y = 116 + r * 80 + 30; c.beginPath(); c.moveTo(24, y); c.lineTo(NOTE.w - 24, y); c.stroke(); }
    c.fillStyle = "rgba(255,90,95,0.35)"; c.fillRect(66, 64, 3, NOTE.h - 76);
    c.restore();
  }
  function rowIcon(c, ic, x, y, col) {
    c.fillStyle = col; c.beginPath(); c.arc(x, y, 28, 0, TAU); c.fill();
    if (ic === "jam") { c.strokeStyle = "#FFFFFF"; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.arc(x, y, 16, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 10); c.moveTo(x, y); c.lineTo(x + 8, y + 3); c.stroke(); }
    else L.ikon(c, ic, x, y, 30, "#FFFFFF");
  }

  // ---------- gelembung ucapan ----------
  function speech(c, s, x, y, k, a, tail, o = {}) {
    if (a <= 0.01 || k <= 0.01) return; const fs = o.size || 52;
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(k, k); c.font = `800 ${fs}px ${K.FONT}`; const w = c.measureText(s).width + fs * 1.3, hh = fs * 1.85;
    c.fillStyle = "rgba(10,14,50,0.28)"; H.rr(c, -w / 2 + 4, -hh / 2 + 6, w, hh, hh / 2); c.fill();
    c.fillStyle = o.fill || CREAM; H.rr(c, -w / 2, -hh / 2, w, hh, hh / 2); c.fill();
    if (tail) { c.beginPath(); c.moveTo(tail[0] - 18, hh / 2 - 4); c.lineTo(tail[1], tail[2]); c.lineTo(tail[0] + 18, hh / 2 - 4); c.closePath(); c.fill(); }
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = 5; if (o.dash) c.setLineDash(o.dash); H.rr(c, -w / 2, -hh / 2, w, hh, hh / 2); c.stroke(); c.setLineDash([]); }
    D.txt(c, s, 0, fs * 0.36, fs, { align: "center", color: o.color || NAVY });
    c.restore(); return w;
  }
  function noEntry(c, x, y, r, k) {
    c.save(); c.translate(x, y); c.scale(k, k); D.glow(c, 0, 0, r * 2, P.red, 0.5);
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.strokeStyle = P.red; c.lineWidth = r * 0.2; c.beginPath(); c.arc(0, 0, r * 0.82, 0, TAU); c.stroke();
    c.lineCap = "round"; c.beginPath(); c.moveTo(-r * 0.55, r * 0.55); c.lineTo(r * 0.55, -r * 0.55); c.stroke(); c.restore();
  }
  function stamp(c, s, x, y, k, a) {
    if (a <= 0.01) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(-0.13); c.scale(k, k); c.font = `900 56px ${K.FONT}`; const w = c.measureText(s).width + 70;
    c.fillStyle = "rgba(255,111,145,0.16)"; H.rr(c, -w / 2, -48, w, 96, 18); c.fill();
    c.strokeStyle = P.pink; c.lineWidth = 7; H.rr(c, -w / 2, -48, w, 96, 18); c.stroke(); c.lineWidth = 3; H.rr(c, -w / 2 + 9, -39, w - 18, 78, 12); c.stroke();
    D.txt(c, s, 0, 20, 56, { align: "center", color: "#FFD9E3", weight: 900 }); c.restore();
  }

  // =====================================================================================
  // adegan: satu fungsi waktu absolut untuk semua beat bab 3
  // =====================================================================================
  function scene(ctx, b, l, t, TL) {
    const e = EV(TL), cp = D.path(e.cam, t), cm = mkCam(cp.x, cp.y, cp.z);
    const inCall = t >= e.b3_3 - 0.01 && t < e.b3_4 + 1.6;
    // ---------- latar studio (ruang layar, paralaks dari kamera) ----------
    LT.studio(ctx, t, { warna: "ungu", px: clamp((cp.x - 960) / 260, -1, 1) });
    ctx.save(); cm.apply(ctx);

    // ---------- peta media sosial ----------
    const show = clamp((t - e.banyak + 0.05) / 1.25);
    const dim = Math.max(clamp((t - e.b3_3 - 0.1) / 0.8) * (1 - clamp((t - e.b3_4 - 0.2) / 0.9)), 0.8 * clamp((t - e.detail + 0.1) / 0.8));
    const sos = PT.sosial(ctx, MAP.cx, MAP.cy, MAP.s, { t, icons: ["video", "live", "video", "voice"], show, lock: 0 });
    const ip = i => (sos.icons[i] ? [sos.icons[i].x, sos.icons[i].y] : iconPos(i, t));
    // denyut suara dari rumah (Bu Rina berbicara di dalam rumah)
    const ring = clamp((t - e.rekam) / 0.4) * (1 - dim);
    if (ring > 0) for (let i = 0; i < 3; i++) { const u = ((t - e.rekam) * 0.6 + i / 3) % 1; ctx.strokeStyle = D.hexA(P.pink, 0.55 * (1 - u) * ring); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(HOUSE[0], HOUSE[1], 60 + u * 150, 0, TAU); ctx.stroke(); }
    // sorot ikon yang sedang disebut / semua ikon pada "semuanya" dan "unggahan"
    const hiAll = win(t, e.semua - 0.1, e.b3_2e - 0.3, 0.25, 0.5) + win(t, e.ungg - 0.1, e.ungg + 1.4, 0.25, 0.5);
    for (let i = 0; i < 4; i++) {
      const cd = e.card[i], hi = Math.max(win(t, cd.a, cd.r + 0.2, 0.2, 0.4), hiAll, ...e.tags.filter(x => x.src === i).map(x => win(t, x.t - 0.1, x.t + 1.0, 0.2, 0.4)));
      if (hi <= 0.01 || show <= 0) continue; const [x, y] = ip(i), pu = 0.5 + 0.5 * Math.sin(t * 7);
      D.glow(ctx, x, y, 120, ICOL[i], 0.55 * hi); ctx.strokeStyle = D.hexA("#FFFFFF", 0.9 * hi); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 62 + 8 * pu, 0, TAU); ctx.stroke();
    }
    // suara menyebar keluar dari ikon ("tersebar di internet")
    const spread = clamp((t - e.sebar + 0.1) / 0.6) * (1 - 0.55 * clamp((t - e.v[0]) / 2)) * (1 - dim);
    if (spread > 0.01) for (let i = 0; i < 4; i++) {
      const [x0, y0] = ip(i), base = Math.atan2(y0 - HOUSE[1], x0 - HOUSE[0]);
      for (let j = 0; j < 7; j++) { const life = 2.6, ph = (t - e.sebar + j * life / 7 + i * 0.31) / life; if (ph < 0) continue; const u = ph % 1, ang = base + (j - 3) * 0.2, d = 70 + u * 620;
        const x = x0 + Math.cos(ang) * d, y = y0 + Math.sin(ang) * d * 0.85, a = spread * Math.sin(Math.PI * u) * 0.9;
        ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.fillStyle = "rgba(10,14,50,0.45)"; H.rr(ctx, -22, -15, 44, 30, 12); ctx.fill(); wave(ctx, -16, 0, 34, 20, t + j, ICOL[i], 5, 1, i + j); ctx.restore(); }
    }
    if (dim > 0) { ctx.save(); ctx.globalAlpha = 0.55 * dim; ctx.fillStyle = "#141A4A"; H.rr(ctx, MAP.cx - 600 * MAP.s, MAP.cy - 400 * MAP.s, 1200 * MAP.s, 800 * MAP.s, 56 * MAP.s); ctx.fill(); ctx.restore(); }

    // ---------- jalur "masuk ke rumah" yang dicoret (b3_1) ----------
    const pa = clamp((t - e.masuk + 0.35) / 0.9), pf = 1 - clamp((t - e.rekam - 0.9) / 0.6);
    if (pa > 0 && pf > 0) {
      const p0 = [1590, 690], p1 = [1230, 230], p2 = [HOUSE[0] + 70, HOUSE[1] + 40], n = 40, red = clamp((t - e.rumahE + 0.05) / 0.25);
      ctx.save(); ctx.globalAlpha *= pf; ctx.lineCap = "round";
      for (let i = 0; i < n * pa; i++) { const [x, y] = qpt(p0, p1, p2, i / n); ctx.fillStyle = red > 0.5 ? P.red : "#FFF6E6"; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); }
      const [hx, hy] = qpt(p0, p1, p2, Math.min(pa, 0.999)), [qx, qy] = qpt(p0, p1, p2, Math.max(0, pa - 0.03)), an = Math.atan2(hy - qy, hx - qx);
      ctx.translate(hx, hy); ctx.rotate(an); ctx.fillStyle = red > 0.5 ? P.red : "#FFF6E6"; ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-14, -16); ctx.lineTo(-14, 16); ctx.closePath(); ctx.fill(); ctx.restore();
      if (red > 0) { const [nx, ny] = qpt(p0, p1, p2, 0.72); ctx.save(); ctx.globalAlpha *= pf; noEntry(ctx, nx, ny, 62, pop(t, e.rumahE - 0.05, 12, 0.45)); ctx.restore(); }
    }

    // ---------- toples berisi potongan suara ----------
    const landed = e.lands.map(x => t >= x), flash = e.lands.reduce((s, x) => s + (t >= x ? Math.exp(-(t - x) * 3.5) : 0), 0);
    const jarGlow = Math.max(flash, win(t, e.jelas - 0.1, e.b3_2e, 0.3, 0.4) * (0.75 + 0.25 * Math.sin(t * 6)), win(t, e.detail - 0.1, e.yakin + 1.5, 0.3, 0.5) * 0.8);
    if (jarGlow > 0) D.glow(ctx, JAR.x, JAR.y - 150, 260, P.violet, 0.6 * Math.min(1, jarGlow));
    ctx.save(); const jw = JAR.size * 0.74, jbH = JAR.size * 0.82; H.rr(ctx, JAR.x - jw / 2 + 10, JAR.y - jbH + 10, jw - 20, jbH - 20, 30); ctx.clip();
    SLOTS.forEach(([dx, dy, rot], i) => { if (!landed[i]) return; const kk = Math.min(1.05, spring(t - e.lands[i], 12, 0.5));
      clipCard(ctx, JAR.x + dx, JAR.y + dy, CLIP.w * kk, CLIP.h * kk, i === 4 ? IBU : CARDS[i].prof, { rot, scroll: 0.4 * i, telepon: i === 4 ? 1 : 0, fmax: i === 4 ? 4500 : 5500, glow: Math.min(1, jarGlow) }); });
    ctx.restore();
    B.toples(ctx, JAR.x, JAR.y, JAR.size, { t, fill: 0, lidColor: "#4C5286", color: P.violet });
    // stiker mikrofon pada toples
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(JAR.x, JAR.y - JAR.size - 26, 30, 0, TAU); ctx.fill(); L.ikon(ctx, "mik", JAR.x, JAR.y - JAR.size - 26, 32, P.violet);

    // ---------- pelaku ----------
    const toEar = Math.max(clamp((t - e.telp) / 0.55) * (1 - clamp((t - e.detik - 0.2) / 0.6)), clamp((t - e.cerita + 0.3) / 0.5));
    const recOn = t > e.rekam - 0.1;
    const pscreen = (c, w, h, tt) => { c.fillStyle = "#151A3E"; c.fillRect(0, 0, w, h); if (!recOn) return; const pu = 0.55 + 0.45 * Math.sin(tt * 6);
      c.fillStyle = D.hexA(P.red, pu); c.beginPath(); c.arc(w * 0.5, h * 0.3, w * 0.16, 0, TAU); c.fill(); wave(c, w * 0.12, h * 0.62, w * 0.8, h * 0.18, tt, P.pink, 7, 1, 3); };
    const pel = O.draw(ctx, PEL.x, PEL.y, PEL.h, Object.assign(O.preset("pelaku"), { pose: "pegangHP", blend: { to: "telepon", k: eio(toEar) }, flip: true, t, layar: pscreen, glow: true }));
    const pPhone = pel.phone || pel.hand;

    // ---------- Bu Rina (b3_3–b3_4) ----------
    let rina = null;
    const rIn = clamp((t - e.b3_3 - 0.15) / 1.25), rOut = clamp((t - e.b3_4 - 0.15) / 1.4);
    if (rIn > 0 && rOut < 1) {
      const walking = (rIn > 0 && rIn < 1) || (rOut > 0 && rOut < 1), x = rOut > 0 ? lerp(RINA.x, -170, eio(rOut)) : lerp(-170, RINA.x, eout(rIn));
      const ringing = t > e.telp + 0.45 && t < e.angkat + 0.2, ear = clamp((t - e.angkat - 0.1) / 0.5) * (1 - clamp((t - e.callOut + 0.1) / 0.5));
      const face = t < e.nomor ? "netral" : (t < e.angkat ? "bingung" : (t < e.b3_3b ? "bingung" : "bingung"));
      rina = O.draw(ctx, x, RINA.y, RINA.h, Object.assign(O.preset("buRina"), { pose: "pegangHP", blend: { to: "telepon", k: eio(ear) }, jalan: walking, flip: rOut > 0, t, face,
        layar: rinaScreen(ringing ? "dering" : (ear > 0.5 ? "bicara" : (t > e.callOut ? "mati" : "chat"))), dering: ringing, glow: true }));
    }

    // ---------- Bip ----------
    {
      let bo = { pose: "diam", t, mood: "happy", look: [0.8, -0.3] };
      const at2 = (x, y) => [x, y];
      if (t < e.b3_2) {
        if (t >= e.sebar) bo = { pose: "kaget", t, k: t - e.sebar, mood: "wow" };
        else if (t >= e.rumah - 0.1) bo = { pose: "tunjuk", t, target: at2(HOUSE[0], HOUSE[1]), mood: "think" };
        else bo = { pose: "diam", t, mood: "happy", look: [0.9, -0.2] };
      } else if (t < e.b3_3) {
        const act = e.card.findIndex((c, i) => t >= c.a - 0.05 && t < (i < 3 ? e.card[i + 1].a - 0.05 : e.semua - 0.1));
        if (act >= 0) bo = { pose: "tunjuk", t, target: ip(act), mood: "happy" };
        else if (t >= e.semua - 0.1) bo = { pose: "diam", t, mood: "wow", look: [1, 0.1], wave: t };
      } else if (t < e.b3_3a) {
        if (t >= e.angkat - 0.2) bo = { pose: "tunjuk", t, target: [720, 700], mood: "think" };
        else if (t >= e.telp + 0.45) bo = { pose: "kaget", t, k: t - e.telp - 0.45, mood: "wow" };
        else bo = { pose: "diam", t, mood: "happy", look: [0.9, -0.4] };
      } else if (t < e.b3_3b) bo = { pose: "diam", t, mood: "think", look: [1, -0.5] };
      else if (t < e.b3_4) {
        if (t >= e.cukup - 0.05) bo = { pose: "kaget", t, k: t - e.cukup + 0.05, mood: "wow" };
        else bo = { pose: "tunjuk", t, target: [1300, 420], mood: "think" };
      } else {
        const tg = e.tags.slice().reverse().find(x => t >= x.t - 0.1);
        if (t >= e.yakin - 0.05) bo = { pose: "kaget", t, k: t - e.yakin + 0.05, mood: "wow", sweat: true };
        else if (t >= e.cerita - 0.2) bo = { pose: "tunjuk", t, target: [760, 220], mood: "think" };
        else if (tg) bo = { pose: "tunjuk", t, target: ip(tg.src), mood: "think" };
        else bo = { pose: "diam", t, mood: "happy", look: [0.9, -0.3] };
      }
      B.draw(ctx, BIP.x, BIP.y, BIP.s, bo);
    }

    // ---------- saluran telepon (b3_3–b3_3b) ----------
    const callA = clamp((t - e.callIn) / 0.45) * (1 - clamp((t - e.callOut) / 0.45));
    const CALL = { x: 775, y: 478, h: 790 };
    const lineP = clamp((t - e.telp) / 0.9) * (1 - clamp((t - e.callOut - 0.1) / 0.5));
    const lp0 = [CALL.x + 190, CALL.y - 140], lp2 = [pPhone[0] - 6, pPhone[1] - 8], lp1 = [(lp0[0] + lp2[0]) / 2, Math.min(lp0[1], lp2[1]) - 230];
    const lp0b = rina && callA < 0.5 ? (rina.phone || rina.hand) : lp0;
    if (lineP > 0) {
      const s0 = callA > 0.5 ? lp0 : lp0b, c1 = [(s0[0] + lp2[0]) / 2, Math.min(s0[1], lp2[1]) - 230], n = 46;
      ctx.save(); ctx.lineCap = "round";
      for (let i = 0; i <= n * lineP; i++) { const [x, y] = qpt(s0, c1, lp2, i / n); ctx.fillStyle = D.hexA("#DDE6FF", 0.75); ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill(); }
      // paket suara: pelaku diam (tidak ada paket dari kanan); suara Bu Rina mengalir ke kanan saat ia bicara
      const talk = speaking(TL, t) && t >= e.b3_3a && t < e.b3_3b;
      const flow = win(t, e.h[0] - 0.05, e.hE + 0.6, 0.15, 0.4);
      if (flow > 0) for (let j = 0; j < 6; j++) { const u = ((t - e.h[0]) * 0.75 + j / 6) % 1; if (u < 0) continue; const [x, y] = qpt(s0, c1, lp2, u);
        ctx.save(); ctx.globalAlpha *= flow * Math.sin(Math.PI * u); ctx.translate(x, y); D.glow(ctx, 0, 0, 40, P.pink, 0.6); ctx.fillStyle = "rgba(10,14,50,0.55)"; H.rr(ctx, -26, -17, 52, 34, 14); ctx.fill(); wave(ctx, -19, 0, 40, 24, t + j, P.pink, 5, talk ? 1 : 0.5, j); ctx.restore(); }
      ctx.restore();
    }
    ctx.restore();   // kamera

    // =================== lapisan atas (sesudah vignette) ===================
    D.post(c => {
      cm.apply(c);
      // kartu unggahan (b3_2) dan salinan suara yang terbang ke toples
      for (let i = 0; i < 4; i++) {
        const cd = e.card[i]; if (t < cd.a || t > cd.r + 0.45) continue;
        const u = eout(clamp((t - cd.a) / 0.5)), sp = Math.min(1.05, spring(t - cd.a, 10, 0.55)), v = eio(clamp((t - cd.r) / 0.4));
        const src = ip(i), st = STAGE[i % 2], x = lerp(lerp(src[0], st[0], u), src[0], v), y = lerp(lerp(src[1], st[1], u), src[1], v);
        speakingFlag = speaking(TL, t);
        postCard(c, i, x, y, lerp(0.12, 1, sp) * (1 - v * 0.88), 1 - clamp((v - 0.6) / 0.4), t, e);
      }
      for (let i = 0; i < 5; i++) {
        const f = i < 4 ? e.card[i] : e.clip4; if (t < f.lv || t >= e.lands[i]) continue;
        const u = eio(clamp((t - f.lv) / (e.lands[i] - f.lv))), [dx, dy, rot] = SLOTS[i];
        const s0 = i < 4 ? [STAGE[i % 2][0], STAGE[i % 2][1] + 84] : [R1c[0], R1c[1]], w0 = i < 4 ? CARD.w - 40 : 360, h0 = i < 4 ? 62 : 140;
        const x = lerp(s0[0], JAR.x + dx, u), y = lerp(s0[1], JAR.y + dy, u) - Math.sin(Math.PI * u) * 170;
        clipCard(c, x, y, lerp(w0, CLIP.w, u), lerp(h0, CLIP.h, u), i === 4 ? IBU : CARDS[i].prof, { rot: rot * u, scroll: 0.4 * i, telepon: i === 4 ? 1 : 0, fmax: i === 4 ? 4500 : 5500, glow: 1 - u * 0.5 });
      }
      // label: suara yang jelas
      const ja = win(t, e.jelas, e.b3_2e - 0.1, 0.2, 0.4);
      if (ja > 0) { c.save(); c.globalAlpha *= ja; PT.tag(c, "suara yang jelas", JAR.x - 20, JAR.y - 400, { size: 48, color: P.teal, scale: lerp(0.88, 1, Math.min(1, pop(t, e.jelas))) }); c.restore(); }

      // ---------- panggilan (b3_3) ----------
      if (callA > 0.01 && rina) {
        const rp = rina.phone || rina.hand, k = lerp(0.1, 1, Math.min(1.04, spring(t - e.callIn, 10, 0.6))) * (t > e.callOut ? 1 - eio(clamp((t - e.callOut) / 0.45)) * 0.9 : 1);
        const cx = lerp(rp[0], CALL.x, clamp(k)), cy = lerp(rp[1], CALL.y, clamp(k));
        // garis kaca pembesar dari HP di tangan ke tampilan besar
        c.save(); c.globalAlpha *= callA * 0.35; c.fillStyle = "#DDE6FF"; c.beginPath(); c.moveTo(rp[0], rp[1]); c.lineTo(cx - 190 * k, cy - 360 * k); c.lineTo(cx - 190 * k, cy + 360 * k); c.closePath(); c.fill(); c.restore();
        c.save(); c.globalAlpha *= callA; c.translate(cx, cy); c.scale(k, k);
        const picked = t >= e.angkat + 0.15, press = clamp((t - e.angkat + 0.45) / 0.4);
        const dur = Math.max(0, Math.floor(t - e.angkat)), durS = "00:0" + Math.min(9, dur);
        const a = L.hp(c, 0, 0, CALL.h, { t, teks: 1.12, ringkas: true, ring: picked ? 0 : 0.6 * clamp((t - e.telp - 0.45) / 0.3), glow: 0.5,
          screen: (s, w, h, tt) => picked ? L.panggilan(s, w, h, { t: tt, nama: "Nomor tidak dikenal", durasi: durS, suara: speaking(TL, t) && t >= e.b3_3a ? 1 : 0.05, teks: 1.12, ringkas: true, jam: false, tanya: false })
            : L.panggilanMasuk(s, w, h, { t: tt, nama: "Nomor tidak dikenal", nomor: "0812-0000-1234", teks: 1.12, ringkas: true, jam: false, tanya: false }) });
        if (!picked && a.out && a.out.terima && t > e.angkat - 0.8) { const p = a.map(a.out.terima.cx, a.out.terima.cy); L.jari(c, p.x + 16, p.y - 4, 110, { rot: -1.1, tekan: press, t, kulit: O.SKIN[3], lengan: "#F2A65A" }); }
        c.restore();
      }
      // pelaku diam: gelembung "..." dengan mik dicoret
      const qa = win(t, e.diam - 0.1, e.b3_3b, 0.25, 0.4);
      if (qa > 0) { const hx = pel.head[0] - 215, hy = pel.head[1] - 40, k = lerp(0.5, 1, pop(t, e.diam - 0.1));
        c.save(); c.globalAlpha *= qa; c.translate(hx, hy); c.scale(k, k); c.fillStyle = CREAM; c.shadowColor = "rgba(10,14,50,0.3)"; c.shadowBlur = 14; c.shadowOffsetY = 6;
        H.rr(c, -110, -48, 220, 96, 48); c.fill(); c.shadowColor = "transparent"; c.beginPath(); c.arc(126, 30, 13, 0, TAU); c.fill(); c.beginPath(); c.arc(154, 44, 8, 0, TAU); c.fill();
        for (let i = 0; i < 3; i++) { const bb = 0.5 + 0.5 * Math.sin(t * 5 - i * 0.9); c.fillStyle = D.hexA(NAVY, 0.35 + 0.55 * bb); c.beginPath(); c.arc(-62 + i * 34, 0, 10, 0, TAU); c.fill(); }
        c.fillStyle = "#8C93C4"; c.beginPath(); c.arc(70, 0, 30, 0, TAU); c.fill(); L.ikon(c, "mikMati", 70, 0, 34, "#FFFFFF"); c.restore(); }
      // ucapan Bu Rina
      if (rina) { const [hx, hy] = rina.top, says = ["Halo?", "Halo?", "Siapa ini?"], pos = [[hx - 20, hy - 72], [hx + 70, hy - 190], [hx - 20, hy - 72]];
        for (let i = 0; i < 3; i++) { const end = i === 0 ? e.h[2] - 0.3 : e.b3_3b + 0.5, a = win(t, e.h[i] - 0.05, end, 0.15, 0.2) * (i === 1 ? 1 - 0.3 * clamp((t - e.h[2]) / 0.3) : 1);
          if (a > 0) speech(c, says[i], pos[i][0], pos[i][1], lerp(0.8, 1, pop(t, e.h[i] - 0.05, 13, 0.5)), a, i !== 1 ? [-30, -60, 70] : null); } }
      // rekaman di HP pelaku: pita telepon (300–3400 Hz) tumbuh selama Bu Rina bicara, lalu jadi klip
      const R0 = { x: 1130, y: 205, w: 600, h: 150 }, R1 = { x: 1250, y: 215, w: 360, h: 140 };
      const ra = win(t, e.angkat + 0.1, e.clip4.lv + 0.02, 0.3, 0.01);
      if (ra > 0) {
        const sh = eio(clamp((t - e.detik + 0.1) / 0.5)), R = { x: lerp(R0.x, R1.x, sh), y: lerp(R0.y, R1.y, sh), w: lerp(R0.w, R1.w, sh), h: lerp(R0.h, R1.h, sh) };
        const rev = 0.04 + 0.96 * clamp((t - e.h[0] + 0.05) / (e.hE - e.h[0] + 0.1));
        c.save(); c.globalAlpha *= ra; D.glow(c, R.x + R.w / 2, R.y + R.h / 2, R.w * 0.7, P.pink, 0.35);
        c.fillStyle = "rgba(10,14,50,0.55)"; H.rr(c, R.x - 10, R.y - 10, R.w + 20, R.h + 20, 18); c.fill();
        L.spektrogram(c, R.x, R.y, R.w, R.h, { profil: IBU, dur: 3, fmax: 4500, telepon: 1, reveal: sh > 0 ? 1 : rev, frame: true, aksen: P.pink, r: 12 });
        // gunting: potong di ujung rekaman
        if (sh < 1) { const ra2 = 1 - sh, rec = 0.6 + 0.4 * Math.sin(t * 6); c.globalAlpha *= ra2;
          c.fillStyle = "rgba(10,18,52,0.92)"; H.rr(c, R0.x, R0.y - 80, 168, 64, 32); c.fill(); c.fillStyle = D.hexA(P.red, rec); c.beginPath(); c.arc(R0.x + 36, R0.y - 48, 13, 0, TAU); c.fill();
          D.txt(c, "REC", R0.x + 60, R0.y - 33, 44, { color: "#FFFFFF", weight: 900 }); }
        c.restore();
        if (sh > 0.6) { const k = pop(t, e.detik + 0.3), dx = R.x + R.w / 2;
          c.save(); c.globalAlpha *= clamp((sh - 0.6) / 0.4); PT.tag(c, "0:03", dx, R.y + R.h + 52, { size: 44, color: P.pink, scale: lerp(0.92, 1, Math.min(1, k)) }); c.restore();
          const ck = pop(t, e.cukup - 0.05, 12, 0.45); if (ck > 0) { c.save(); c.translate(R.x + R.w, R.y); c.scale(ck, ck); D.glow(c, 0, 0, 70, P.green, 0.6); c.fillStyle = P.green; c.beginPath(); c.arc(0, 0, 34, 0, TAU); c.fill(); L.ikon(c, "cek", 0, 0, 36, "#FFFFFF"); c.restore(); } }
      }
      const ca = win(t, e.contoh - 0.05, e.b3_4 + 1.2, 0.2, 0.4);
      if (ca > 0) { c.save(); c.globalAlpha *= ca; PT.tag(c, "contoh suara", JAR.x, JAR.y - 400, { size: 48, color: P.violet, scale: lerp(0.88, 1, Math.min(1, pop(t, e.contoh - 0.05))) }); c.restore(); }

      // ---------- catatan pelaku (b3_4) ----------
      const na = clamp((t - e.pel4 + 0.15) / 0.3);
      notebook(c, t, e, na);
      e.tags.forEach((tg, r) => {
        if (t < tg.t - 0.05) return; const [sx, sy] = ip(tg.src), [rx, ry] = rowPos(r), u = eio(clamp((t - tg.t - 0.55) / 0.75)), kp = pop(t, tg.t - 0.05, 12, 0.5);
        const row = ROWS[r];
        if (u < 1) { const x = lerp(sx, rx + 150, u), y = lerp(sy - 90, ry, u) - Math.sin(Math.PI * u) * (r === 0 ? 120 : -70); c.save(); c.globalAlpha *= clamp(kp * 2); PT.tag(c, row.s, x, y, { size: 44, color: ICOL[tg.src], scale: lerp(0.92, 1, Math.min(1, kp)) }); c.restore(); }
        else { const lit = 1 + 0.6 * win(t, e.detail - 0.05, e.yakin + 1.4, 0.2, 0.4) * (0.5 + 0.5 * Math.sin(t * 6 + r));
          if (lit > 1.01) D.glow(c, rx + 150, ry, 230, P.amber, 0.35 * (lit - 1));
          rowIcon(c, row.ic, rx - 50, ry, ICOL[tg.src]); D.txt(c, row.s, rx, ry + 16, 44, { color: NAVY, weight: 800 }); }
      });
      // "Detail inilah": isi catatan dan toples dirangkai menuju HP pelaku
      const da = win(t, e.detail - 0.1, e.yakin + 2, 0.4, 0.5);
      if (da > 0) {
        const srcs = [[JAR.x, JAR.y - JAR.size + 10, P.violet]].concat([0, 1, 2].map(r => { return [NOTE.x + 170 + r * 150, NOTE.y + NOTE.h - 4, ICOL[e.tags[r].src]]; }));
        srcs.forEach(([x, y, col], j) => { const gp = clamp((t - e.detail - j * 0.12) / 0.5); if (gp <= 0) return; const ex = lerp(x, pPhone[0], eout(gp)), ey = lerp(y, pPhone[1], eout(gp));
          c.save(); c.globalAlpha *= da; c.strokeStyle = col; c.lineWidth = 6; c.setLineDash([3, 13]); c.lineDashOffset = -t * 45; c.lineCap = "round";
          c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo((x + ex) / 2 + 60, Math.max(y, ey) + 40, ex, ey); c.stroke(); c.setLineDash([]);
          const u = ((t - e.detail) * 0.9 + j * 0.25) % 1, px = lerp(x, ex, u), py = lerp(y, ey, u) + Math.sin(Math.PI * u) * 30; D.glow(c, px, py, 26, col, gp); c.restore(); });
        D.glow(c, pPhone[0], pPhone[1], 120, P.teal, 0.6 * da * (0.7 + 0.3 * Math.sin(t * 6)));
      }
      // ---------- cerita palsu yang meyakinkan ----------
      const fa = clamp((t - e.cerita + 0.15) / 0.4);
      if (fa > 0) {
        const BX = 700, BY = 205, k = lerp(0.4, 1, pop(t, e.cerita - 0.15, 9, 0.55)), sure = clamp((t - e.yakin + 0.1) / 0.35);
        // dari HP pelaku ke gelembung
        c.save(); c.globalAlpha *= fa * 0.9; c.strokeStyle = P.teal; c.lineWidth = 6; c.setLineDash([3, 14]); c.lineDashOffset = -t * 40; c.lineCap = "round";
        c.beginPath(); c.moveTo(pPhone[0] - 10, pPhone[1] - 10); c.quadraticCurveTo(1250, 560, BX + 300, BY + 40); c.stroke(); c.restore();
        if (sure > 0) D.glow(c, BX, BY, 520, P.teal, 0.35 * sure);
        speech(c, "“Bu, ini aku, Kakak…”", BX, BY, k, fa * lerp(0.7, 1, sure), [260, 330, 120], { size: 52, fill: sure > 0.5 ? CREAM : "#DCE3F7", stroke: sure > 0.5 ? P.teal : "#8C93C4", dash: sure > 0.5 ? null : [14, 12], color: NAVY });
        // gelombang suara tiruan (warna anak) di bawah gelembung
        c.save(); c.globalAlpha *= fa; c.fillStyle = "rgba(10,14,50,0.5)"; H.rr(c, BX - 170, BY + 62, 340, 56, 28); c.fill(); wave(c, BX - 150, BY + 90, 300, 36, t, sure > 0.5 ? P.teal : "#8C93C4", 22, lerp(0.5, 1, sure), 4); c.restore();
        stamp(c, "Meyakinkan", BX + 20, BY + 225, lerp(1.6, 1, eout(clamp((t - e.yakin + 0.05) / 0.22))), clamp((t - e.yakin + 0.05) / 0.12));
      }
    });
  }

  K.SCENES.d03_b3 = scene;
  K.SCENES.d03_b3.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b3 = TL => {
    const e = EV(TL), r = (x, kind, amp) => [+x.toFixed(3), kind, amp];
    return [
      r(e.masuk - 0.35, "whoosh", 0.5),
      r(e.rumahE, "clack", 0.7),
      r(e.banyak, "shimmer", 0.55),
      ...e.card.map((cd, i) => r(cd.a + 0.05, "pop", 0.55 + (i === 0 ? 0.1 : 0))),
      r(e.card[0].land, "clack", 0.45),
      r(e.semua, "shimmer", 0.6),
      r(e.callIn - 0.25, "whoosh", 0.55),
      r(e.angkat - 0.05, "clack", 0.6),
      r(e.cukup, "pop", 0.6),
      r(e.clip4.lv - 0.3, "whoosh", 0.5),
      r(e.clip4.land, "clack", 0.6),
      ...e.tags.map(tg => r(tg.t, "pop", 0.5)),
      r(e.detail, "shimmer", 0.5),
      r(e.yakin, "boom", 0.8),
    ].filter(x => x && isFinite(x[0]));
  };
})(typeof window !== "undefined" ? window : globalThis);
