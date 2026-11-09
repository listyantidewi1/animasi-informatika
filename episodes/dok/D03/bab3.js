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
  const JAR = { x: 1275, y: 885, size: 320 };
  const PEL = { x: 1570, y: 885, h: 430 };   // tudung di bawah motif gelombang studio (x 1660–1810, y 340–400), tidak tampak seperti "antena"
  const BIP = { x: 228, y: 828, s: 150 };
  const RINA = { x: 420, y: 885, h: 540 };
  const STAGE = [[690, 618], [800, 618]];   // kartu di tengah: Bip (x ≤ 300) dan toples (x ≥ 1180) tetap terlihat
  const CARD = { w: 520, h: 382 };
  const SLOTS = [[-50, -52, -0.1], [52, -64, 0.12], [-42, -114, 0.08], [44, -130, -0.1], [0, -186, 0.04]];
  const CLIP = { w: 116, h: 54 };
  const R0 = { x: 1100, y: 205, w: 600, h: 150 }, R1 = { x: JAR.x - 180, y: 215, w: 360, h: 140 };
  const R1c = [R1.x + R1.w / 2, R1.y + R1.h / 2];
  // geometri tutup toples (sama dengan B.toples tanpa label)
  const JW = JAR.size * 0.74, NECKW = JW * 0.72, LIDH = JAR.size * 0.1, LIDX = -NECKW / 2 - JW * 0.04, LIDW = NECKW + JW * 0.08;
  const MOUTH = [JAR.x, JAR.y - JAR.size - 64];
  const PILLY = JAR.y - 510;   // label di atas toples, di atas jangkauan tutup yang terbuka
  // catatan pelaku: muncul di kanan atas, lalu bergeser ke kiri di atas peta yang diredupkan
  const NOTE = { w: 580, h: 320 }, NC0 = [1330, 255], NC1 = [560, 305], NS1 = 0.92, RY = [122, 198, 274];
  // cerita palsu: gelembung di kanan atas, ekornya ke HP pelaku
  const BUB = { x: 1240, y: 245, w: 720, h: 224 };
  const LIFT = [[JAR.x - 62, 482], [JAR.x + 112, 452]], LIFTED = [0, 2];   // dua klip suara anak (ulang tahun, tugas sekolah)

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
    e.ungg = A("b3_4", "unggahan"); e.pel4 = A("b3_4", "pelaku"); e.nb = A("b3_4", "mengetahui"); e.nama = A("b3_4", "nama anggota"); e.pgl = A("b3_4", "nama panggilan");
    e.bias = A("b3_4", "kebiasaan"); e.detail = A("b3_4", "Detail"); e.cerita = A("b3_4", "cerita palsunya"); e.yakin = A("b3_4", "meyakinkan");
    // kartu unggahan: muncul (a), salinan suara berangkat (lv), kembali ke ikon (r, hilang r + 0.4).
    // Kartu pulang paling lambat 0,75 s sebelum kata kartu berikutnya, salinan berangkat sebelum kartu pulang: satu kartu sekali tampil.
    e.card = e.v.map((v, i) => { let r, lv;
      if (i < 3) { r = Math.min(e.vE[i] + 0.45, e.v[i + 1] - 0.75); lv = Math.min(e.vE[i] + 0.1, r - 0.3); }
      else { lv = Math.max(e.vE[3] - 0.05, e.grup + 1.05); r = lv + 0.35; }
      return { a: v - 0.12, lv, land: lv + 0.85, r }; });
    e.clip4 = { lv: e.ambil - 0.05, land: e.ambil + 0.7 };
    e.lands = e.card.map(c => c.land).concat([e.clip4.land]);
    e.callIn = e.nomor - 0.3; e.callOut = e.b3_3b + 0.95;
    e.tags = [{ t: e.nama, src: 0, row: 0 }, { t: e.pgl, src: 3, row: 1 }, { t: e.bias, src: 2, row: 2 }].map(x => Object.assign(x, { fly: x.t + 0.3, land: x.t + 0.9 }));
    e.react = e.lands.concat([e.pel4 + 0.1, e.detail + 0.4]);   // pelaku condong ke toples / ke peta
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

  // salinan suara terbang: melengkung ke atas mulut toples (u 0..0.72), lalu turun ke tempatnya di dalam toples
  function flyPos(s0, slot, u) {
    const k = 0.72;
    if (u < k) { const v = eio(u / k); return { x: lerp(s0[0], MOUTH[0], v), y: lerp(s0[1], MOUTH[1], v) - Math.sin(Math.PI * v) * 150, s: v }; }
    const v = eio((u - k) / (1 - k)); return { x: lerp(MOUTH[0], slot[0], v), y: lerp(MOUTH[1], slot[1], v), s: 1 };
  }
  // sudut tutup toples: terbuka ±0,45 s sebelum salinan tiba, tertutup rapat saat mendarat (lalu memantul kecil);
  // pada "Detail inilah" tutup terlepas ke atas lalu menghilang (klip suara anak diangkat keluar)
  function lidAngle(t, e) {
    let a = 0;
    e.lands.forEach(L => {
      const o = eout(clamp((t - (L - 0.5)) / 0.2)) * (1 - clamp((t - (L - 0.07)) / 0.08));
      a = Math.max(a, 0.72 * o);
      if (t >= L && t < L + 0.5) a = Math.max(a, 0.09 * Math.abs(Math.sin((t - L) * 22)) * Math.exp(-(t - L) * 8));
    });
    return a;
  }
  function drawLid(c, ang, off) {   // engsel di sudut kiri bawah tutup; stiker mikrofon menempel di tutup; off 0..1 = tutup terlepas
    if (off >= 1) return;
    c.save(); c.globalAlpha *= 1 - off; c.translate(JAR.x + LIDX - 40 * off, JAR.y - JAR.size + LIDH - 110 * eout(off)); c.rotate(-ang - 0.5 * off);
    c.fillStyle = "rgba(10,14,50,0.25)"; H.rr(c, 3, -LIDH + 6, LIDW, LIDH, LIDH * 0.35); c.fill();
    c.fillStyle = "#4C5286"; H.rr(c, 0, -LIDH, LIDW, LIDH, LIDH * 0.35); c.fill();
    c.strokeStyle = "#343A6C"; c.lineWidth = 4; H.rr(c, 0, -LIDH, LIDW, LIDH, LIDH * 0.35); c.stroke();
    c.fillStyle = "#3B4174"; for (let i = 1; i < 12; i++) c.fillRect(LIDW * i / 12 - 2, -LIDH * 0.75, 4, LIDH * 0.6);
    c.fillStyle = "rgba(255,255,255,0.18)"; H.rr(c, 8, -LIDH + 4, LIDW - 16, 6, 3); c.fill();
    c.fillStyle = CREAM; c.beginPath(); c.arc(LIDW / 2, -LIDH / 2, 27, 0, TAU); c.fill(); c.strokeStyle = "#4C5286"; c.lineWidth = 3; c.stroke();
    L.ikon(c, "mik", LIDW / 2, -LIDH / 2, 30, P.violet);
    c.restore();
  }
  // reaksi pelaku: condong ke toples saat tutup terbuka, lalu "mengangguk" (turun-naik) ketika klip mendarat
  function leanAmt(t, e) {
    let v = 0;
    e.react.forEach(R => { const d = t - R;
      if (d > -0.5 && d < 0) v = Math.max(v, 0.35 * eio(clamp((d + 0.5) / 0.4)));
      else if (d >= 0) v = Math.max(v, d < 0.12 ? lerp(0.35, 1, d / 0.12) : Math.exp(-(d - 0.12) * 2.2)); });
    return v;
  }

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
      bub(140, 110, 0.9, 1);
      // grup: tiga anggota keluarga (kanan) masing-masing menerima salinan yang muncul perlahan dari alpha 0
      const GY = [42, 110, 178], HX = 440, CX = 326, MEM = ["nenek", "kakek", "ayah"], MC = ["#9584FF", "#FFB547", "#5BD68A"];
      for (let i = 0; i < 3; i++) {
        const hp = clamp((gu - i * 0.12) / 0.22); if (hp <= 0) continue;
        const u = clamp((gu - 0.15 - i * 0.22) / 0.4), got = u >= 1;
        c.save(); c.globalAlpha *= hp; c.translate(HX, GY[i]); c.scale(lerp(0.6, 1, eout(hp)), lerp(0.6, 1, eout(hp)));
        if (got) D.glow(c, 0, 0, 60, MC[i], 0.5 * Math.exp(-(gu - (0.55 + i * 0.22)) * 6));
        c.fillStyle = MC[i]; c.beginPath(); c.arc(0, 0, 34, 0, TAU); c.fill();
        c.save(); c.beginPath(); c.arc(0, 0, 34, 0, TAU); c.clip();
        O.kepala(c, 0, 6, 25, Object.assign(O.preset(MEM[i]), { face: got ? "senang" : "netral", t, seed: 4 + i, bahu: 0.5 })); c.restore();
        c.restore();
        if (u <= 0) continue; const ue = eout(u);
        bub(lerp(140, CX, ue), lerp(110, GY[i], ue), lerp(0.9, 0.55, ue), clamp(u * 2.5));
      }
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
    TH[i](c, w - 40, 220, t, i === 3 ? clamp((t - e.grup) / 1.0) : 0); c.restore();
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
  // posisi catatan: keluar dari tangan pelaku pada "mengetahui", lalu pada "Detail inilah" bergeser ke kiri (skala 0.92)
  function noteXf(t, e, hand) {
    const sp = Math.min(1.06, spring(t - e.nb + 0.1, 10, 0.55)), mv = eout(clamp((t - e.nb + 0.1) / 0.5));
    let x = lerp(hand[0], NC0[0], mv), y = lerp(hand[1], NC0[1], mv), s = lerp(0.18, 1, sp);
    const m = eio(clamp((t - e.detail + 0.05) / 0.7));
    x = lerp(x, NC1[0], m); y = lerp(y, NC1[1], m) - Math.sin(Math.PI * m) * 40; s = lerp(s, NS1, m);
    return { x, y, s, rot: lerp(-0.02, 0.025, m) + (1 - clamp(sp)) * 0.3, a: clamp((t - e.nb + 0.1) / 0.18) };
  }
  const toW = (X, lx, ly) => { const cs = Math.cos(X.rot), sn = Math.sin(X.rot), px = (lx - NOTE.w / 2) * X.s, py = (ly - NOTE.h / 2) * X.s; return [X.x + px * cs - py * sn, X.y + px * sn + py * cs]; };
  function scribble(c, x0, x1, y, col) {   // coretan tulisan tangan yang sedang ditulis
    if (x1 <= x0 + 2) return; c.strokeStyle = col; c.lineWidth = 3.5; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
    for (let s = 0; s <= x1 - x0; s += 3) { const px = x0 + s + 7 * Math.cos(s * 0.33), py = y - 10 * Math.sin(s * 0.33) - 4 * Math.sin(s * 0.07); s ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke();
  }
  function pen(c, x, y, t) {
    c.save(); c.translate(x, y + Math.sin(t * 21) * 3); c.rotate(1.2);   // pena hampir mendatar ke kanan: tidak menutupi baris di atasnya
    c.fillStyle = "rgba(10,14,50,0.25)"; H.rr(c, -3, -104, 22, 84, 8); c.fill();
    c.fillStyle = "#FFB547"; H.rr(c, -9, -108, 18, 82, 8); c.fill(); c.fillStyle = NAVY; H.rr(c, -9, -108, 18, 26, 8); c.fill();
    c.fillStyle = "#FFE3B0"; c.beginPath(); c.moveTo(-9, -28); c.lineTo(9, -28); c.lineTo(0, 0); c.closePath(); c.fill();
    c.fillStyle = NAVY; c.beginPath(); c.moveTo(-3, -9); c.lineTo(3, -9); c.lineTo(0, 0); c.closePath(); c.fill(); c.restore();
  }
  function notebook(c, t, e, X) {
    if (X.a <= 0.01) return; const w = NOTE.w, h = NOTE.h;
    c.save(); c.globalAlpha *= X.a; c.translate(X.x, X.y); c.rotate(X.rot); c.scale(X.s, X.s); c.translate(-w / 2, -h / 2);
    c.fillStyle = "rgba(10,14,50,0.35)"; H.rr(c, 8, 14, w, h, 20); c.fill();
    c.fillStyle = "#FFFBF2"; H.rr(c, 0, 0, w, h, 20); c.fill();
    c.fillStyle = "#3B3F78"; H.rr(c, 0, 0, w, 58, 20); c.fill(); c.fillRect(0, 34, w, 24);
    for (let i = 0; i < 8; i++) { const x = 44 + i * 70; c.fillStyle = "#1A1E4A"; c.beginPath(); c.arc(x, 58, 9, 0, TAU); c.fill(); c.strokeStyle = "#C8CCE8"; c.lineWidth = 5; c.beginPath(); c.arc(x, 48, 12, Math.PI * 0.15, Math.PI * 0.85, true); c.stroke(); }
    c.strokeStyle = "rgba(90,110,190,0.22)"; c.lineWidth = 2; for (let r = 0; r < 3; r++) { const y = RY[r] + 34; c.beginPath(); c.moveTo(24, y); c.lineTo(w - 24, y); c.stroke(); }
    c.fillStyle = "rgba(255,90,95,0.35)"; c.fillRect(92, 64, 3, h - 76);
    // baris yang sudah tercatat
    const lit = win(t, e.detail - 0.05, e.yakin + 1.4, 0.2, 0.4);
    e.tags.forEach((tg, r) => { if (t < tg.land) return; const row = ROWS[r];
      if (lit > 0.01) D.glow(c, 300, RY[r], 230, P.amber, 0.3 * lit * (0.5 + 0.5 * Math.sin(t * 6 + r)));
      rowIcon(c, row.ic, 52, RY[r], ICOL[tg.src]); D.txt(c, row.s, 110, RY[r] + 17, 48, { color: NAVY, weight: 800, fit: w - 130 }); });
    // pena mencoret baris berikutnya sampai label tiba
    const pa = clamp((t - e.nb - 0.25) / 0.25) * (1 - clamp((t - e.tags[2].land - 0.1) / 0.3));
    if (pa > 0.01) { const r = Math.min(2, e.tags.filter(x => t >= x.land).length), st = r ? e.tags[r - 1].land : e.nb + 0.3;
      const p = clamp((t - st) / Math.max(0.3, e.tags[r].land - st)), x1 = 112 + p * 360;
      c.save(); c.globalAlpha *= pa; if (t < e.tags[r].land) scribble(c, 112, x1, RY[r] + 14, "rgba(30,42,107,0.35)"); pen(c, Math.min(x1, 472) + 7, RY[r] + 14 - 10 * Math.sin((x1 - 112) * 0.33), t); c.restore(); }
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
    c.fillStyle = "rgba(10,14,50,0.3)"; H.rr(c, -w / 2 + 5, -42, w, 96, 18); c.fill();
    c.fillStyle = "#E8466E"; H.rr(c, -w / 2, -48, w, 96, 18); c.fill();
    c.strokeStyle = "#FFD9E3"; c.lineWidth = 4; H.rr(c, -w / 2 + 9, -39, w - 18, 78, 12); c.stroke();
    D.txt(c, s, 0, 20, 56, { align: "center", color: "#FFFFFF", weight: 900 }); c.restore();
  }

  // layar panggilan masuk: label tombol digambar ulang (44 px, di tengah bawah tombol 24%/76%) agar "Tolak" dan "Terima" tidak bertabrakan
  function ringIn(s, w, h, tt) {
    const u = w / 100, by = h * 0.8, br = u * 12.5, cut = by + br * 1.1;
    s.save(); s.beginPath(); s.rect(0, 0, w, cut); s.clip();
    const out = L.panggilanMasuk(s, w, h, { t: tt, nama: "Nomor tidak dikenal", nomor: "0812-0000-1234", teks: 1.12, ringkas: true, jam: false, tanya: false });
    s.restore();
    const g = s.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#5B6BE0"); g.addColorStop(1, "#8A5FD6"); s.fillStyle = g; s.fillRect(0, cut, w, h - cut);
    [["Tolak", w * 0.24], ["Terima", w * 0.76]].forEach(([lab, x]) => D.txt(s, lab, x, by + br + u * 10.5 + 16, 44, { align: "center", color: "#FFFFFF", weight: 800, fit: w * 0.44 }));
    return out;
  }

  // =====================================================================================
  // adegan: satu fungsi waktu absolut untuk semua beat bab 3
  // =====================================================================================
  function scene(ctx, b, l, t, TL) {
    const e = EV(TL), cp = D.path(e.cam, t), cm = mkCam(cp.x, cp.y, cp.z);
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
      const p0 = [PEL.x - 120, 690], p1 = [1210, 230], p2 = [HOUSE[0] + 70, HOUSE[1] + 40], n = 40, red = clamp((t - e.rumahE + 0.05) / 0.25);
      ctx.save(); ctx.globalAlpha *= pf; ctx.lineCap = "round";
      for (let i = 0; i < n * pa; i++) { const [x, y] = qpt(p0, p1, p2, i / n); ctx.fillStyle = red > 0.5 ? P.red : "#FFF6E6"; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); }
      const [hx, hy] = qpt(p0, p1, p2, Math.min(pa, 0.999)), [qx, qy] = qpt(p0, p1, p2, Math.max(0, pa - 0.03)), an = Math.atan2(hy - qy, hx - qx);
      ctx.translate(hx, hy); ctx.rotate(an); ctx.fillStyle = red > 0.5 ? P.red : "#FFF6E6"; ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-14, -16); ctx.lineTo(-14, 16); ctx.closePath(); ctx.fill(); ctx.restore();
      if (red > 0) { const [nx, ny] = qpt(p0, p1, p2, 0.72); ctx.save(); ctx.globalAlpha *= pf; noEntry(ctx, nx, ny, 62, pop(t, e.rumahE - 0.05, 12, 0.45)); ctx.restore(); }
    }

    // ---------- toples berisi potongan suara ----------
    const lift = eio(clamp((t - e.detail - 0.05) / 0.75));
    const landed = e.lands.map(x => t >= x), flash = e.lands.reduce((s, x) => s + (t >= x ? Math.exp(-(t - x) * 3.5) : 0), 0);
    const jarGlow = Math.max(flash, win(t, e.jelas - 0.1, e.b3_2e, 0.3, 0.4) * (0.75 + 0.25 * Math.sin(t * 6)), win(t, e.detail - 0.1, e.yakin + 1.5, 0.3, 0.5) * 0.8);
    if (jarGlow > 0) D.glow(ctx, JAR.x, JAR.y - 150, 260, P.violet, 0.6 * Math.min(1, jarGlow));
    ctx.save(); const jw = JAR.size * 0.74, jbH = JAR.size * 0.82; H.rr(ctx, JAR.x - jw / 2 + 10, JAR.y - jbH + 10, jw - 20, jbH - 20, 30); ctx.clip();
    SLOTS.forEach(([dx, dy, rot], i) => { if (!landed[i] || (lift > 0 && LIFTED.includes(i))) return; const kk = Math.min(1.05, spring(t - e.lands[i], 12, 0.5));
      clipCard(ctx, JAR.x + dx, JAR.y + dy, CLIP.w * kk, CLIP.h * kk, i === 4 ? IBU : CARDS[i].prof, { rot, scroll: 0.4 * i, telepon: i === 4 ? 1 : 0, fmax: i === 4 ? 4500 : 5500, glow: Math.min(1, jarGlow) }); });
    ctx.restore();
    B.toples(ctx, JAR.x, JAR.y, JAR.size, { t, fill: 0, lid: false, color: P.violet });
    drawLid(ctx, lidAngle(t, e), clamp((t - e.detail + 0.05) / 0.5));

    // ---------- pelaku ----------
    const toEar = Math.max(clamp((t - e.telp) / 0.55) * (1 - clamp((t - e.detik - 0.2) / 0.6)), clamp((t - e.cerita + 0.3) / 0.5));
    const recOn = t > e.rekam - 0.1;
    const pscreen = (c, w, h, tt) => { c.fillStyle = "#151A3E"; c.fillRect(0, 0, w, h); if (!recOn) return; const pu = 0.55 + 0.45 * Math.sin(tt * 6);
      c.fillStyle = D.hexA(P.red, pu); c.beginPath(); c.arc(w * 0.5, h * 0.3, w * 0.16, 0, TAU); c.fill(); wave(c, w * 0.12, h * 0.62, w * 0.8, h * 0.18, tt, P.pink, 7, 1, 3); };
    // condong ke kiri (ke toples) berporos di kaki, lalu turun sedikit seperti mengangguk
    const lv = leanAmt(t, e), lAng = -0.075 * lv, lBob = 9 * lv;
    const tr = p => { if (!p) return p; const dx = p[0] - PEL.x, dy = p[1] - PEL.y, cs = Math.cos(lAng), sn = Math.sin(lAng); return [PEL.x + dx * cs - dy * sn, PEL.y + dx * sn + dy * cs + lBob]; };
    ctx.save(); ctx.translate(PEL.x, PEL.y + lBob); ctx.rotate(lAng); ctx.translate(-PEL.x, -PEL.y);
    const pel0 = O.draw(ctx, PEL.x, PEL.y, PEL.h, Object.assign(O.preset("pelaku"), { pose: "pegangHP", blend: { to: "telepon", k: eio(toEar) }, flip: true, t, layar: pscreen, glow: true }));
    ctx.restore();
    const pel = { head: tr(pel0.head), top: tr(pel0.top), hand: tr(pel0.hand), phone: tr(pel0.phone) };
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
        const act = e.card.findIndex(c => t >= c.a - 0.05 && t < c.r + 0.15);
        if (t >= e.semua - 0.1) bo = { pose: "diam", t, mood: "wow", look: [1, 0.1], wave: t };
        else if (act >= 0) bo = { pose: "tunjuk", t, target: [STAGE[act % 2][0] - 120, STAGE[act % 2][1] - 40], mood: "happy" };
        else bo = { pose: "diam", t, mood: "happy", look: [1, 0.2] };
      } else if (t < e.b3_3a) {
        if (t >= e.angkat - 0.2) bo = { pose: "tunjuk", t, target: [720, 700], mood: "think" };
        else if (t >= e.telp + 0.45) bo = { pose: "kaget", t, k: t - e.telp - 0.45, mood: "wow" };
        else bo = { pose: "diam", t, mood: "happy", look: [0.9, -0.4] };
      } else if (t < e.b3_3b) bo = { pose: "diam", t, mood: "think", look: [1, -0.5] };
      else if (t < e.b3_4) {
        if (t >= e.cukup - 0.05) bo = { pose: "kaget", t, k: t - e.cukup + 0.05, mood: "wow" };
        else bo = { pose: "tunjuk", t, target: R1c, mood: "think" };
      } else {
        const tg = e.tags.slice().reverse().find(x => t >= x.t - 0.1);
        if (t >= e.yakin - 0.05) bo = { pose: "kaget", t, k: t - e.yakin + 0.05, mood: "wow", sweat: true };
        else if (t >= e.cerita - 0.2) bo = { pose: "tunjuk", t, target: [BUB.x - 200, BUB.y + 40], mood: "think" };
        else if (t >= e.detail - 0.1) bo = { pose: "tunjuk", t, target: [JAR.x, 470], mood: "think" };
        else if (tg && t < tg.land + 0.4) bo = { pose: "tunjuk", t, target: ip(tg.src), mood: "think" };
        else if (t >= e.nb) bo = { pose: "diam", t, mood: "think", look: [1, -0.6] };
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
        const u = clamp((t - f.lv) / (e.lands[i] - f.lv)), [dx, dy, rot] = SLOTS[i];
        const s0 = i < 4 ? [STAGE[i % 2][0], STAGE[i % 2][1] + 84] : [R1c[0], R1c[1]], w0 = i < 4 ? CARD.w - 40 : 360, h0 = i < 4 ? 62 : 140;
        const fp = flyPos(s0, [JAR.x + dx, JAR.y + dy], u);
        clipCard(c, fp.x, fp.y, lerp(w0, CLIP.w, fp.s), lerp(h0, CLIP.h, fp.s), i === 4 ? IBU : CARDS[i].prof, { rot: rot * eio(clamp((u - 0.72) / 0.28)), scroll: 0.4 * i, telepon: i === 4 ? 1 : 0, fmax: i === 4 ? 4500 : 5500, glow: 1 - u * 0.5 });
      }
      // label: suara yang jelas
      const ja = win(t, e.jelas, e.b3_2e - 0.1, 0.2, 0.4);
      if (ja > 0) { c.save(); c.globalAlpha *= ja; PT.tag(c, "suara yang jelas", JAR.x - 10, JAR.y - 462, { size: 48, color: P.teal, scale: lerp(0.88, 1, Math.min(1, pop(t, e.jelas))) }); c.restore(); }

      // ---------- panggilan (b3_3) ----------
      if (callA > 0.01 && rina) {
        const rp = rina.phone || rina.hand, k = lerp(0.1, 1, Math.min(1.04, spring(t - e.callIn, 10, 0.6))) * (t > e.callOut ? 1 - eio(clamp((t - e.callOut) / 0.45)) * 0.9 : 1);
        const cx = lerp(rp[0], CALL.x, clamp(k)), cy = lerp(rp[1], CALL.y, clamp(k));
        // garis kaca pembesar dari HP di tangan ke tampilan besar
        c.save(); c.globalAlpha *= callA * 0.35; c.fillStyle = "#DDE6FF"; c.beginPath(); c.moveTo(rp[0], rp[1]); c.lineTo(cx - 190 * k, cy - 360 * k); c.lineTo(cx - 190 * k, cy + 360 * k); c.closePath(); c.fill(); c.restore();
        c.save(); c.globalAlpha *= callA; c.translate(cx, cy); c.scale(k, k);
        const picked = t >= e.angkat + 0.15, press = clamp((t - e.angkat + 0.45) / 0.4);
        const dur = Math.max(0, Math.floor(t - e.h[0])), durS = "00:0" + Math.min(9, dur);   // waktu bicara mulai pada "Halo?" pertama → 00:03 saat dipotong
        const a = L.hp(c, 0, 0, CALL.h, { t, teks: 1.12, ringkas: true, ring: picked ? 0 : 0.6 * clamp((t - e.telp - 0.45) / 0.3), glow: 0.5,
          screen: (s, w, h, tt) => picked ? L.panggilan(s, w, h, { t: tt, nama: "Nomor tidak dikenal", durasi: durS, suara: speaking(TL, t) && t >= e.b3_3a ? 1 : 0.05, teks: 1.12, ringkas: true, jam: false, tanya: false })
            : ringIn(s, w, h, tt) });
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
      if (ca > 0) { c.save(); c.globalAlpha *= ca; PT.tag(c, "contoh suara", JAR.x, PILLY, { size: 48, color: P.violet, scale: lerp(0.88, 1, Math.min(1, pop(t, e.contoh - 0.05))) }); c.restore(); }

      // ---------- catatan pelaku (b3_4) ----------
      const NX = noteXf(t, e, pel.hand);
      notebook(c, t, e, NX);
      e.tags.forEach((tg, r) => {
        if (t < tg.t - 0.05 || t >= tg.land) return; const [sx, sy] = ip(tg.src), [rx, ry] = toW(NX, 300, RY[r]), u = eio(clamp((t - tg.fly) / (tg.land - tg.fly))), kp = pop(t, tg.t - 0.05, 12, 0.5);
        const [x, y] = qpt([sx, sy - 90], [rx - 120, ry + 150], [rx, ry], u);   // datang dari bawah: tidak melintasi baris yang sudah tertulis
        c.save(); c.globalAlpha *= clamp(kp * 2); PT.tag(c, ROWS[r].s, x, y, { size: 44, color: ICOL[tg.src], scale: lerp(0.92, 1, Math.min(1, kp)) }); c.restore();
      });
      // "Detail inilah": dua klip suara anak diangkat keluar dari toples; klip dan catatan dirangkai ke HP pelaku
      if (lift > 0) LIFTED.forEach((si, j) => {
        const [dx, dy, rot] = SLOTS[si], p0 = [JAR.x + dx, JAR.y + dy], p2 = LIFT[j], [x, y] = qpt(p0, [JAR.x + 10, JAR.y - JAR.size - 130], p2, lift), s = lerp(1, 1.4, lift);
        clipCard(c, x, y + Math.sin(t * 2.2 + j * 2) * 5 * lift, CLIP.w * s, CLIP.h * s, ANAK, { rot: rot * (1 - lift), scroll: 0.4 * si, glow: 0.65 + 0.35 * Math.sin(t * 5 + j * 1.7), col: P.teal });
      });
      const da = win(t, e.detail + 0.3, e.yakin + 2, 0.4, 0.5);
      if (da > 0) {
        const nr = toW(NX, NOTE.w - 30, NOTE.h - 8);
        const srcs = [[LIFT[0][0] + 50, LIFT[0][1] + 30, P.teal, [LIFT[0][0] + 220, LIFT[0][1] + 110]], [LIFT[1][0] + 90, LIFT[1][1], P.teal, [LIFT[1][0] + 200, LIFT[1][1] + 40]], [nr[0], nr[1], P.amber, [1080, 760]]];
        srcs.forEach(([x, y, col, cc], j) => { const gp = clamp((t - e.detail - 0.3 - j * 0.15) / 0.5); if (gp <= 0) return; const ex = lerp(x, pPhone[0], eout(gp)), ey = lerp(y, pPhone[1], eout(gp));
          c.save(); c.globalAlpha *= da; c.strokeStyle = col; c.lineWidth = 6; c.setLineDash([3, 13]); c.lineDashOffset = -t * 45; c.lineCap = "round";
          c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(cc[0], cc[1], ex, ey); c.stroke(); c.setLineDash([]);
          const u = ((t - e.detail) * 0.9 + j * 0.3) % 1, [px, py] = qpt([x, y], cc, [ex, ey], u); D.glow(c, px, py, 28, col, gp); c.restore(); });
        D.glow(c, pPhone[0], pPhone[1], 120, P.teal, 0.6 * da * (0.7 + 0.3 * Math.sin(t * 6)));
      }
      // ---------- cerita palsu yang meyakinkan: gelembung di kanan atas, ekor ke HP pelaku, pola suara anak (pita telepon) ----------
      const fa = clamp((t - e.cerita + 0.15) / 0.4);
      if (fa > 0) {
        const k = lerp(0.4, 1, pop(t, e.cerita - 0.15, 9, 0.55)), sure = clamp((t - e.yakin + 0.1) / 0.35), w = BUB.w, h = BUB.h;
        c.save(); c.globalAlpha *= fa; c.translate(BUB.x, BUB.y); c.scale(k, k);
        if (sure > 0) D.glow(c, 0, 0, 560, P.teal, 0.4 * sure * (0.85 + 0.15 * Math.sin(t * 6)));
        const tp = [(pPhone[0] - 14 - BUB.x) / k, (pPhone[1] - 26 - BUB.y) / k], tx0 = w * 0.17, tx1 = w * 0.31;
        const shape = () => { H.rr(c, -w / 2, -h / 2, w, h, 40); c.moveTo(tx0, h / 2 - 2); c.lineTo(tp[0], tp[1]); c.lineTo(tx1, h / 2 - 2); c.closePath(); };
        c.save(); c.translate(5, 8); c.fillStyle = "rgba(10,14,50,0.3)"; c.beginPath(); shape(); c.fill(); c.restore();
        c.fillStyle = sure > 0.5 ? CREAM : "#DCE3F7"; c.beginPath(); shape(); c.fill();
        c.strokeStyle = sure > 0.5 ? P.teal : "#8C93C4"; c.lineWidth = 6; if (sure <= 0.5) c.setLineDash([14, 12]); c.beginPath(); H.rr(c, -w / 2, -h / 2, w, h, 40); c.stroke(); c.setLineDash([]);
        D.txt(c, "“Bu, ini aku, Kakak…”", 0, -h / 2 + 76, 52, { align: "center", color: NAVY, weight: 800, fit: w - 60 });
        L.spektrogram(c, -w / 2 + 34, -h / 2 + 106, w - 68, 84, { profil: ANAK, dur: 3, fmax: 4500, telepon: 1, scroll: t * 0.6, reveal: 0.05 + 0.95 * clamp((t - e.cerita) / (e.yakin - e.cerita)), frame: true, aksen: sure > 0.5 ? P.teal : "#8C93C4", r: 14, alpha: lerp(0.55, 1, sure) });
        c.restore();
        stamp(c, "Meyakinkan", BUB.x - 180, BUB.y + 150, lerp(1.6, 1, eout(clamp((t - e.yakin + 0.05) / 0.22))), clamp((t - e.yakin + 0.05) / 0.12));
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
      r(e.semua, "shimmer", 0.6),
      r(e.callIn - 0.25, "whoosh", 0.55),
      r(e.angkat - 0.05, "clack", 0.6),
      r(e.cukup, "pop", 0.6),
      r(e.clip4.lv - 0.3, "whoosh", 0.5),
      r(e.clip4.land, "clack", 0.6),
      r(e.nb - 0.55, "whoosh", 0.4),
      ...e.tags.map(tg => r(tg.t, "pop", 0.5)),
      r(e.detail, "shimmer", 0.5),
      r(e.yakin, "boom", 0.8),
    ].filter(x => x && isFinite(x[0]));
  };
})(typeof window !== "undefined" ? window : globalThis);
