/* D03 bab 9 — Penutup (b9_1, b9_2, b9_3).
   Metafora bab: "berhenti, lalu pastikan" (tombol jeda -> centang) di kamar Bu Rina yang kini hangat.
   b9_1 dan b9_2 adalah SATU adegan kamar yang dihitung dari waktu absolut (kamera sendiri, noCam), sehingga silang-pudar
   antarbeat tidak terlihat: Bu Rina menutup telepon penipu, menelepon anaknya, anak muncul mengantuk dari pintu, keduanya tertawa;
   lalu kata sandi keluarga (kertas terlipat + gembok) dibagikan ke orang tua/kakek/nenek/anak, video dibagikan ke grup keluarga,
   bidikan "sasaran" berubah menjadi hati. b9_3: keluar lewat jendela ke kampung malam, Bip menekan Subscribe, layar akhir 20 detik
   (tempat elemen layar akhir YouTube: lingkaran Subscribe kiri, satu video kanan).
   Profil suara tetap: anak seed 23. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KO = KIT.orang, KY = KIT.layar, KB = KIT.bipkit, P = D.P, H = K.helpers;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, sm, eio, eout, spring } = D;
  const FONT = K.FONT;
  const PROF_ANAK = Object.assign({}, KY.SUARA.anak, { seed: 23 });
  const PROF_TIRU = Object.assign({}, PROF_ANAK, { artefak: 1 });
  const ramp = (x, t0, d = 0.5) => clamp((x - t0) / d);
  const beat = (TL, id) => TL.beats.find(x => x.id === id);
  const txt = (ctx, s, x, y, size, opt = {}) => D.txt(ctx, s, x, y, size, opt);

  // ---------- waktu peristiwa (absolut, dari waktu kata) ----------
  let EVtl = null, EVc = null;
  function EV(TL) {
    if (EVtl === TL && EVc) return EVc;
    const b1 = beat(TL, "b9_1"), b2 = beat(TL, "b9_2"), b3 = beat(TL, "b9_3");
    const A = (b, s, o = 0) => b.start + D.at(b, s, o), E = (b, s, o = 0) => b.start + D.atEnd(b, s, o);
    EVc = {
      s1: b1.start, s2: b2.start, s3: b3.start, e2: b2.start + b2.dur, e3: b3.start + b3.dur,
      terus: A(b1, "terus"), lebih: A(b1, "lebih"), baik: A(b1, "lebih baik"), baikE: E(b1, "lebih baik."), tetapi: A(b1, "Tetapi"), pertahanan: A(b1, "pertahanan"),
      sederhana: A(b1, "sederhana"), kebiasaan: A(b1, "kebiasaan"), berhenti: A(b1, "berhenti"), memastikan: A(b1, "memastikan"),
      bicarakan: A(b2, "bicarakan"), sandi: A(b2, "kata sandi"), ortu: A(b2, "orang tua"), kakek: A(b2, "kakek"), nenek: A(b2, "nenek"),
      anakmu: A(b2, "anakmu"), anakmuE: E(b2, "anakmu."), bagikan: A(b2, "Bagikan"), grup: A(b2, "grup keluarga"), karena: A(b2, "karena"),
      sasaran: A(b2, "sasaran"), justru: A(b2, "justru"), tersayang: A(b2, "orang yang paling kita sayangi"), sayangi: A(b2, "sayangi"),
      kalau: A(b3, "Kalau"), teknologi: A(b3, "teknologi"), subscribe: A(b3, "subscribe"), channel: A(b3, "channel"), engineering: A(b3, "Engineering"),
      sampai: A(b3, "Sampai jumpa"), berikutnya: A(b3, "berikutnya"), end3: b3.start + D.speechEnd(b3),
    };
    EVc.pintu = EVc.memastikan - 0.02;       // pintu mulai terbuka (selesai ±0,45 s kemudian)
    EVc.masuk = EVc.memastikan + 0.22;       // anak mulai tampak di lorong (pintu sudah >70% terbuka)
    EVc.ambang = EVc.memastikan + 0.95;      // anak sampai di ambang pintu (ukuran penuh)
    EVc.datang = EVc.memastikan + 1.65;      // anak sampai di depan ibunya
    EVtl = TL; return EVc;
  }

  // ---------- pose bertahap: [[t, pose, lama?], ...] ----------
  function seq(t, list) {
    let cur = list[0][1];
    for (let i = 1; i < list.length; i++) { const [t0, p, d = 0.5] = list[i]; if (t < t0) break; const k = eio((t - t0) / d); if (k < 1) return { pose: cur, blend: { to: p, k } }; cur = p; }
    return { pose: cur };
  }
  const pick = (t, list) => { let v = list[0][1]; for (const [t0, x] of list) if (t >= t0) v = x; return v; };

  // ---------- kamera kamar ----------
  function camKamar(t, E) {
    const keys = [[E.s1, 1106, 470, 1.18], [E.tetapi, 1106, 476, 1.17], [E.pertahanan + 0.9, 1080, 500, 1.12], [E.berhenti, 1060, 506, 1.1],
      [E.memastikan + 0.8, 1006, 520, 1.05], [E.s2 + 1.2, 1006, 520, 1.05], [E.sandi - 0.1, 960, 540, 1.0], [E.karena, 960, 540, 1.0], [E.sayangi + 0.6, 1000, 526, 1.06], [E.e2 + 1, 1006, 524, 1.075]];
    const c = D.path(keys, t);
    c.x += Math.sin(t * 0.31) * 5; c.y += Math.sin(t * 0.23 + 1) * 3;
    const hw = 960 / c.z, hh = 540 / c.z; c.x = clamp(c.x, hw, W - hw); c.y = clamp(c.y, hh, HH - hh);
    return c;
  }
  const toS = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + HH / 2];

  // ---------- layar HP kecil di tangan (tanpa huruf) ----------
  function layarKecil(mode) {
    return (c, w, h, t) => {
      const cols = { bicara: ["#5B6BE0", "#8A5FD6"], kontak: ["#3FA7C9", "#4D6FD8"], memanggil: ["#2FB5A6", "#3E86C9"], grup: ["#2E9C7E", "#3E86C9"] }[mode];
      const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, cols[0]); gr.addColorStop(1, cols[1]); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      if (mode === "kontak" || mode === "grup") { for (let i = 0; i < 4; i++) { c.fillStyle = "rgba(255,255,255,0.85)"; H.rr(c, w * 0.12, h * (0.2 + i * 0.17), w * 0.76, h * 0.11, w * 0.05); c.fill(); } return; }
      const ph = (t * 0.8) % 1; c.strokeStyle = D.hexA("#FFFFFF", 0.4 * (1 - ph)); c.lineWidth = w * 0.03; c.beginPath(); c.arc(w / 2, h * 0.3, w * (0.2 + 0.15 * ph), 0, TAU); c.stroke();
      KY.avatar(c, w / 2, h * 0.3, w * 0.2, mode === "memanggil" ? P.teal : "#7C8BEA", {});
      c.fillStyle = mode === "memanggil" ? "#FFFFFF" : "#FF5A5F"; c.beginPath(); c.arc(w / 2, h * 0.84, w * 0.13, 0, TAU); c.fill();
    };
  }
  const LK = { bicara: layarKecil("bicara"), kontak: layarKecil("kontak"), memanggil: layarKecil("memanggil"), grup: layarKecil("grup") };

  // ---------- tokoh di kamar ----------
  const IBU = { x: 1240, y: 806, h: 420 }, ANAK = { x0: 728, x1: 962, y: 806, h: 392 };
  function ibu(ctx, t, E) {
    const ps = seq(t, [[0, "telepon"], [E.pertahanan - 0.1, "pegangHP", 0.7], [E.datang - 0.35, "lega", 0.5], [E.bicarakan, "bisik", 0.55], [E.sandi - 0.15, "tunjukBarang", 0.5],
      [E.bagikan - 0.1, "pegangHP", 0.55], [E.karena + 0.3, "berdiri", 0.5], [E.sayangi - 0.35, "lega", 0.6]]);
    const face = pick(t, [[0, "bingung"], [E.pertahanan + 0.3, "netral"], [E.memastikan + 0.2, "senang"], [E.datang - 0.3, "tertawa"], [E.bicarakan + 0.3, "senang"], [E.karena + 0.4, "netral"], [E.sayangi - 0.3, "tertawa"]]);
    const layar = t < E.berhenti + 0.2 ? LK.bicara : t < E.memastikan + 0.2 ? LK.kontak : t < E.datang ? LK.memanggil : LK.grup;
    const look = (t > E.datang - 0.4 && t < E.bagikan - 0.1) || (t > E.karena + 0.4 && t < E.sayangi) ? [0.7, -0.05] : undefined;
    const kertas = t > E.sandi - 0.4 && t < E.bagikan + 0.2;
    const holding = kertas ? (c2) => { c2.save(); c2.rotate(-0.15); KB.kertasLipat(c2, 0, -5, 15, { fold: 1, t }); c2.restore(); } : undefined;
    const IA = KO.draw(ctx, IBU.x, IBU.y, IBU.h, Object.assign(KO.preset("buRina"), ps, { flip: true, t, face, layar, glow: true, look, garisBisik: true, holding }));
    if (IA) IA.kertas = kertas;
    return IA;
  }
  // anak: dari ujung lorong (kecil, jauh) ke ambang pintu (ukuran penuh), lalu ke depan ibunya
  const DOOR = { x: 620, y: 280, w: 190, h: 520, dx: 0 };   // dx = geseran paralaks pintu (dari anchors set)
  function anakPos(t, E) {
    if (t < E.ambang) { const u = sm((t - E.masuk) / (E.ambang - E.masuk)); return { x: lerp(752, 748, u) + DOOR.dx * (1 - u * 0), y: lerp(704, ANAK.y, u), h: lerp(250, ANAK.h, u), clip: true }; }
    const u = sm((t - E.ambang) / (E.datang - E.ambang)); return { x: lerp(748 + DOOR.dx, ANAK.x1, u), y: ANAK.y, h: ANAK.h, clip: false };
  }
  function anak(ctx, t, E) {
    if (t < E.masuk) return null;
    const pos = anakPos(t, E), walking = t < E.datang;
    const ps = seq(t, [[0, "kucek"], [E.datang - 0.2, "lega", 0.5], [E.bicarakan + 0.1, "berdiri", 0.5], [E.sayangi - 0.35, "lega", 0.6]]);
    const face = pick(t, [[0, "ngantuk"], [E.datang - 0.25, "tertawa"], [E.bicarakan + 0.2, "senang"], [E.bagikan, "senang"], [E.karena + 0.4, "netral"], [E.sayangi - 0.3, "tertawa"]]);
    const look = t > E.bicarakan && t < E.sayangi ? [0.9, -0.1] : undefined;
    ctx.save();
    if (pos.clip) {   // masih di lorong: hanya terlihat di lubang pintu, di belakang daun pintu yang terbuka
      const o = eio(ramp(t, E.pintu, 0.45)), lw = DOOR.w * Math.cos(o * 1.35);
      ctx.beginPath(); ctx.rect(DOOR.x + DOOR.dx + Math.max(0, lw), DOOR.y, DOOR.w - Math.max(0, lw), DOOR.h + 40); ctx.clip();
    }
    const an = KO.draw(ctx, pos.x, pos.y, pos.h, Object.assign(KO.preset("anakRina"), ps, { t, face, look, jalan: walking, speed: 1.15 }));
    // HP anak berdering di tangan: layar menyala, bergetar, gelombang dering — sampai ia tiba di depan ibunya
    const ph = 1 - ramp(t, E.datang - 0.3, 0.35);
    if (ph > 0 && an && an.handB) {
      const k = pos.h / ANAK.h, px = an.handB[0] + 8 * k, py = an.handB[1] - 18 * k, sh = Math.sin(t * 46) * 0.14;
      ctx.save(); ctx.globalAlpha *= ph;
      for (let i = 0; i < 3; i++) { const q = (t * 1.6 + i / 3) % 1; ctx.strokeStyle = D.hexA(P.teal, 0.85 * (1 - q)); ctx.lineWidth = 6 * k; ctx.lineCap = "round";
        [-1, 1].forEach(sd => { ctx.beginPath(); ctx.arc(px, py, (46 + 70 * q) * k, sd < 0 ? Math.PI - 0.6 : -0.6, sd < 0 ? Math.PI + 0.6 : 0.6); ctx.stroke(); }); }
      D.glow(ctx, px, py, 120 * k, P.teal, 0.55);
      KY.hp(ctx, px, py, 84 * k, { t, ring: 1, lit: 1, glow: 1, glowCol: P.teal, rot: 0.12 + sh, shadow: false, screen: LK.memanggil });
      ctx.restore();
    }
    ctx.restore();
    return an;
  }

  // ---------- bidikan "sasaran" -> hati (koordinat dunia) ----------
  function heartPath(ctx, cx, cy, r) {
    ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.95);
    ctx.bezierCurveTo(cx - r * 1.35, cy + r * 0.05, cx - r * 1.05, cy - r * 1.05, cx, cy - r * 0.45);
    ctx.bezierCurveTo(cx + r * 1.05, cy - r * 1.05, cx + r * 1.35, cy + r * 0.05, cx, cy + r * 0.95); ctx.closePath();
  }
  function sasaran(ctx, t, E) {
    const a0 = ramp(t, E.karena + 0.3, 0.5); if (a0 <= 0) return;
    const cx = 1100, cy = 560, lock = eio(ramp(t, E.karena + 0.3, E.sasaran - E.karena - 0.25)), hk = eio(ramp(t, E.justru, E.sayangi - E.justru + 0.15));
    const r = lerp(560, 330, lock) * (1 + 0.012 * Math.sin(t * 6) * (1 - hk));
    ctx.save(); ctx.globalAlpha *= a0;
    // cincin bidik
    if (hk < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - hk; ctx.translate(cx, cy); ctx.rotate((1 - lock) * 0.9 + t * 0.05);
      const col = "#FF5A5F"; D.glow(ctx, 0, 0, r * 1.15, col, 0.12 + 0.18 * spring(ramp(t, E.sasaran, 1)) * (1 - ramp(t, E.sasaran + 0.4, 0.8)));
      ctx.strokeStyle = D.hexA(col, 0.95); ctx.lineWidth = 12; ctx.setLineDash([r * 0.5, r * 0.1]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      ctx.lineWidth = 6; ctx.strokeStyle = D.hexA(col, 0.6); ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, TAU); ctx.stroke();
      ctx.lineCap = "round"; ctx.lineWidth = 14; ctx.strokeStyle = col;
      for (let i = 0; i < 4; i++) { const an = i * Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(an) * r * 0.86, Math.sin(an) * r * 0.86); ctx.lineTo(Math.cos(an) * r * 1.14, Math.sin(an) * r * 1.14); ctx.stroke(); }
      ctx.restore();
    }
    // hati
    if (hk > 0) {
      const hs = r * 1.05 * (0.8 + 0.2 * spring(hk, 8, 0.4)) * (1 + 0.025 * Math.sin(t * 3.4)), hy = cy - 30;
      ctx.save(); ctx.globalAlpha *= hk; D.glow(ctx, cx, hy, hs * 1.6, "#FF8FB1", 0.28);
      heartPath(ctx, cx, hy, hs); ctx.fillStyle = "rgba(255,143,177,0.10)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,170,195,0.5)"; ctx.lineWidth = 26; ctx.stroke(); ctx.strokeStyle = "#FF8FB1"; ctx.lineWidth = 11; ctx.stroke();
      ctx.restore();
      // hati kecil melayang naik
      const r2 = D.rng(41);
      for (let i = 0; i < 14; i++) { const ph = r2(), sp = 0.22 + r2() * 0.2, x0 = cx + (r2() - 0.5) * 760, u = ((t - E.justru) * sp + ph) % 1; if (t < E.sayangi - 0.4 + ph * 0.8) continue;
        const x = x0 + Math.sin(u * 7 + i) * 26, y = 760 - u * 560, s = 14 + r2() * 14;
        ctx.save(); ctx.globalAlpha *= Math.sin(u * Math.PI) * 0.85 * hk; heartPath(ctx, x, y, s); ctx.fillStyle = i % 3 ? "#FF8FB1" : "#FFD38A"; ctx.fill(); ctx.restore(); }
    }
    ctx.restore();
  }

  // ---------- partikel debu hangat di cahaya lampu ----------
  function debu(ctx, t) {
    const r = D.rng(93); ctx.save(); ctx.fillStyle = "#FFE7B8";
    for (let i = 0; i < 46; i++) { const bx = 300 + r() * 1500, by = 200 + r() * 560, sp = 5 + r() * 9, ph = r() * TAU, rad = 1.6 + r() * 2.6;
      const x = bx + Math.sin(t * 0.3 + ph) * 26, y = by - ((t * sp + ph * 40) % 120) + 60;
      ctx.globalAlpha = 0.16 + 0.2 * (0.5 + 0.5 * Math.sin(t * 1.3 + ph)); ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ---------- adegan kamar (b9_1 + b9_2) ----------
  function kamarScene(ctx, t, E) {
    const c = camKamar(t, E), px = 0.25 * Math.sin((t - E.s1) * 0.12);
    const lamp = lerp(0.85, 1, ramp(t, E.memastikan, 2)), pintu = eio(ramp(t, E.pintu, 0.45));
    const opt = { lamp, phone: false, pintu, pintuCahaya: 1, px, near: false, jam: 23 };
    let IA = null, AA = null;
    ctx.save(); ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
    const KA = KL.kamar(ctx, t, opt); DOOR.dx = KA && KA.anchors && KA.anchors.door ? KA.anchors.door.x0 - DOOR.x : 0;
    sasaranBelakang(ctx, t, E);
    AA = anak(ctx, t, E);
    IA = ibu(ctx, t, E);
    sasaran(ctx, t, E);
    KL.depan(ctx, "kamar", t, opt);
    debu(ctx, t);
    ctx.restore();
    return { c, IA, AA };
  }
  // cahaya hangat di belakang keluarga saat "sayangi"
  function sasaranBelakang(ctx, t, E) { const a = ramp(t, E.sayangi - 0.3, 0.8); if (a > 0) KL.parts.warmPool ? KL.parts.warmPool(ctx, 1100, 600, 520, 0.35 * a, 0.7) : D.glow(ctx, 1100, 600, 520, P.warm, 0.3 * a); }

  // ---------- b9_1: dua spektrogram (asli vs tiruan) ----------
  function panelSpek(ctx, t, E, c, IA) {
    const out = eio(ramp(t, E.tetapi - 0.05, 0.7)); if (out >= 1) return;
    const mo = eio(ramp(t, E.terus, E.baikE - E.terus + 0.1));
    const ph = IA && IA.phone ? toS(c, IA.phone[0], IA.phone[1]) : [1100, 470];
    const X = [150, 640], Y = 180, w = 430, h = 230;
    ctx.save();
    // garis titik dari HP Bu Rina ke panel tiruan (suara yang ia dengar)
    ctx.save(); ctx.globalAlpha *= 1 - out; ctx.strokeStyle = D.hexA(P.pink, 0.75); ctx.lineWidth = 5; ctx.setLineDash([4, 14]); ctx.lineCap = "round"; ctx.lineDashOffset = -t * 40;
    ctx.beginPath(); ctx.moveTo(ph[0] - 30, ph[1]); ctx.quadraticCurveTo(X[1] + w * 0.9, Y + h + 140, X[1] + w * 0.75, Y + h + 8); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    [0, 1].forEach(i => {
      const x = X[i], s = lerp(1, 0.94, out), cx = x + w / 2 + (i ? 1 : -1) * 40 * out, cy = Y + h / 2 - 70 * out;
      ctx.save(); ctx.globalAlpha *= Math.pow(1 - out, 1.6); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-w / 2, -h / 2);
      const pr = i === 0 ? { profil: PROF_ANAK } : { profil: PROF_TIRU, morph: mo, ke: PROF_ANAK };
      const sp = KY.spektrogram(ctx, 0, 0, w, h, Object.assign({ dur: 3.2, scroll: t * 0.55, fmax: 5500, aksen: i === 0 ? P.teal : P.pink, label: i === 0 ? "Suara asli" : "Suara tiruan", labelSize: 46 }, pr));
      // jejak suara buatan (garis datar di pita atas) disorot merah sampai tiruan menjadi sama
      if (i === 1 && mo < 1) {
        const ya = sp.yOf(5250), yb = sp.yOf(4050), ha = (1 - mo) * (0.85 + 0.15 * Math.sin(t * 5));
        ctx.save(); ctx.globalAlpha *= ha; ctx.beginPath(); ctx.rect(0, ya, w, yb - ya); ctx.clip();
        ctx.fillStyle = "rgba(255,90,95,0.34)"; ctx.fillRect(0, ya, w, yb - ya);
        [4350, 4900].forEach(f => { const yy = sp.yOf(f); ctx.fillStyle = "rgba(255,236,170,0.9)"; ctx.fillRect(0, yy - 3, w, 6); });
        ctx.restore();
        ctx.save(); ctx.globalAlpha *= ha; ctx.strokeStyle = "#FF5A5F"; ctx.lineWidth = 5; ctx.setLineDash([16, 9]); ctx.lineDashOffset = -t * 24; H.rr(ctx, 4, ya, w - 8, yb - ya, 8); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      }
      ctx.restore();
    });
    // tanda ≠ -> =
    const eq = eio(ramp(t, E.baik - 0.1, 0.5)), mx = (X[0] + w + X[1]) / 2, my = Y + h / 2;
    ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(mx, my); const sc = 1 + 0.25 * Math.sin(Math.PI * eq);
    ctx.scale(sc, sc); ctx.fillStyle = eq > 0.5 ? P.green : "#FF5A5F"; ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-15, -8); ctx.lineTo(15, -8); ctx.moveTo(-15, 8); ctx.lineTo(15, 8);
    const sl = 1 - eq; if (sl > 0) { ctx.moveTo(8 * sl, -20 * sl); ctx.lineTo(-8 * sl, 20 * sl); } ctx.stroke(); ctx.restore();
    // "makin mirip": kurung tipis di bawah kedua panel + label tepat di bawah lencana ≠/=, muncul pada "lebih"
    const mm = spring(ramp(t, E.lebih - 0.05, 1.1)), kb = eout(ramp(t, E.lebih - 0.1, 0.45)); if (kb > 0.01) {
      const yb = Y + h + 26, x0 = X[0] + w / 2, x1 = X[1] + w / 2, xm = (x0 + x1) / 2;
      ctx.save(); ctx.globalAlpha *= (1 - out); ctx.strokeStyle = D.hexA(P.pink, 0.9); ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(lerp(xm, x0, kb), yb - 16); ctx.lineTo(lerp(xm, x0, kb), yb); ctx.lineTo(lerp(xm, x1, kb), yb); ctx.lineTo(lerp(xm, x1, kb), yb - 16); ctx.moveTo(xm, yb); ctx.lineTo(xm, yb + 14); ctx.stroke(); ctx.restore();
    }
    if (mm > 0.01) {
      ctx.save(); ctx.globalAlpha *= clamp(mm) * (1 - out); const bx = (X[0] + w + X[1]) / 2, by = Y + h + 82; ctx.translate(bx, by); ctx.scale(lerp(0.85, 1, mm), lerp(0.85, 1, mm));
      ctx.font = `800 50px ${FONT}`; const tw = ctx.measureText("makin mirip").width, pw = tw + 120;
      ctx.fillStyle = "rgba(10,18,52,0.92)"; H.rr(ctx, -pw / 2, -40, pw, 80, 40); ctx.fill(); ctx.strokeStyle = D.hexA(P.pink, 0.9); ctx.lineWidth = 3; ctx.stroke();
      ctx.strokeStyle = P.pink; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.lineJoin = "round"; const ax = -pw / 2 + 48, bob = Math.sin(t * 4) * 3;
      ctx.beginPath(); ctx.moveTo(ax - 14, 16 + bob); ctx.lineTo(ax + 2, -2 + bob); ctx.lineTo(ax + 10, 8 + bob); ctx.lineTo(ax + 24, -14 + bob); ctx.moveTo(ax + 12, -14 + bob); ctx.lineTo(ax + 24, -14 + bob); ctx.lineTo(ax + 24, -2 + bob); ctx.stroke();
      txt(ctx, "makin mirip", -pw / 2 + 84, 18, 50, { align: "left" });
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- b9_1: lencana kebiasaan (jeda -> centang) ----------
  function lencana(ctx, t, E) {
    const a = ramp(t, E.sederhana - 0.05, 0.3) * (1 - ramp(t, E.datang - 0.3, 0.5)); if (a <= 0) return;
    const items = [{ x: 280, ic: "jeda", lab: "Berhenti", col: P.amber, on: E.berhenti, pop: E.sederhana }, { x: 590, ic: "cek", lab: "Pastikan", col: P.green, on: E.memastikan, pop: E.sederhana + 0.25 }];
    const y = 196, r = 74;
    // kartu gelap di belakang baris lencana: memisahkan dari jendela, bulan, dan pintu kayu
    const ca = a * clamp(spring(ramp(t, E.sederhana - 0.05, 0.9), 10, 0.5));
    if (ca > 0.01) { ctx.save(); ctx.globalAlpha *= ca * 0.82; ctx.fillStyle = "rgba(12,18,54,0.78)"; H.rr(ctx, 140, y - r - 34, 590, 2 * r + 34 + 118, 40); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
    // panah di antara
    ctx.save(); ctx.globalAlpha *= a * ramp(t, E.sederhana + 0.3, 0.3); ctx.strokeStyle = D.hexA("#FFFFFF", 0.8); ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(380, y); ctx.lineTo(486, y); ctx.moveTo(468, y - 16); ctx.lineTo(488, y); ctx.lineTo(468, y + 16); ctx.stroke(); ctx.restore();
    items.forEach(it => {
      const p = spring(ramp(t, it.pop, 1.2), 10, 0.5); if (p <= 0.01) return;
      const on = ramp(t, it.on - 0.05, 0.3), pulse = on * (1 - ramp(t, it.on + 0.25, 0.9));
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(it.x, y); ctx.scale(p * (1 + 0.18 * pulse), p * (1 + 0.18 * pulse));
      D.glow(ctx, 0, 0, r * 2.2, it.col, 0.15 + 0.5 * on);
      if (pulse > 0) { ctx.strokeStyle = D.hexA(it.col, 0.8 * pulse); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, r * (1.1 + 0.6 * (1 - pulse)), 0, TAU); ctx.stroke(); }
      ctx.fillStyle = on > 0.5 ? it.col : "#46508F"; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = D.hexA("#FFFFFF", 0.85); ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#FFFFFF";
      if (it.ic === "jeda") { H.rr(ctx, -26, -32, 18, 64, 6); ctx.fill(); H.rr(ctx, 8, -32, 18, 64, 6); ctx.fill(); }
      else { ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-28, 2); ctx.lineTo(-8, 24); ctx.lineTo(30, -22); ctx.stroke(); }
      ctx.restore();
      ctx.save(); ctx.globalAlpha *= a * clamp(p); D.label(ctx, it.lab, it.x, y + r + 50, { size: 46, col: on > 0.5 ? it.col : "#9AA6D8", color: "#FFFFFF", fill: on > 0.5 ? D.hexA(it.col === P.green ? "#0F5C3A" : "#6A3E06", 0.95) : "rgba(10,18,52,0.95)" }); ctx.restore();
    });
  }

  // daftar kontak ringkas dengan huruf besar (≥ 40 px): Ayah, Anakku (disorot, tombol hijau), Nenek
  function kontakBesar(c2, w, h, t) {
    const u = w / 100; c2.fillStyle = "#F1F3FC"; c2.fillRect(0, 0, w, h);
    const hh = u * 30, gr = c2.createLinearGradient(0, 0, w, hh); gr.addColorStop(0, "#3FA7C9"); gr.addColorStop(1, "#4D6FD8"); c2.fillStyle = gr; c2.fillRect(0, 0, w, hh);
    txt(c2, "Kontak", u * 8, hh * 0.68, 48, { align: "left", color: "#FFFFFF", weight: 900 });
    const rows = [["Ayah", "#5AA9FF"], ["Anakku", P.teal], ["Nenek", "#A58BFF"], ["Kakak", "#FF8FB1"]], rh = u * 44, out = {};
    rows.forEach(([nm, col], i) => {
      const y = hh + u * 6 + i * rh, cy = y + rh / 2, on = nm === "Anakku", pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
      if (on) { c2.fillStyle = D.hexA(P.teal, 0.18 + 0.1 * pulse); H.rr(c2, u * 2.5, y + u * 2, w - u * 5, rh - u * 4, u * 7); c2.fill(); c2.fillStyle = "#FFFFFF"; H.rr(c2, u * 4, y + u * 3.5, w - u * 8, rh - u * 7, u * 6); c2.fill(); }
      else if (i > 0) { c2.fillStyle = "#E1E5F4"; c2.fillRect(u * 8, y, w - u * 16, u * 0.5); }
      c2.fillStyle = col; c2.beginPath(); c2.arc(u * 15, cy, u * 11, 0, TAU); c2.fill();
      txt(c2, nm[0], u * 15, cy + 15, 42, { align: "center", color: "#FFFFFF", weight: 900 });
      txt(c2, nm, u * 29, cy + 15, 42, { align: "left", color: "#1B2150", weight: 800 });
      if (on) { const bx = w - u * 10.5, br = u * 7.8; c2.fillStyle = D.hexA("#3FCB7E", 0.3 * pulse); c2.beginPath(); c2.arc(bx, cy, br * (1.12 + 0.12 * pulse), 0, TAU); c2.fill();
        c2.fillStyle = "#3FCB7E"; c2.beginPath(); c2.arc(bx, cy, br, 0, TAU); c2.fill(); KY.ikon(c2, "telepon", bx, cy, br * 1.1, "#FFFFFF"); out.telepon = { cx: bx, cy, x: bx - br, y: cy - br, w: br * 2, h: br * 2 }; }
    });
    return out;
  }
  // ---------- b9_1: HP besar (layar Bu Rina) ----------
  function hpBesar1(ctx, t, E) {
    const inn = eout(ramp(t, E.pertahanan - 0.15, 0.6)), out = eio(ramp(t, E.datang - 0.55, 0.55)); if (inn <= 0 || out >= 1) return;
    const cx = 1630, cy = 480 + (1 - inn) * 640 + out * 700, hgt = 800;
    const tekan1 = eio(ramp(t, E.berhenti - 0.12, 0.22)) * (1 - ramp(t, E.berhenti + 0.35, 0.25));
    const tekan2 = eio(ramp(t, E.memastikan - 0.12, 0.22)) * (1 - ramp(t, E.memastikan + 0.35, 0.25));
    let mode = t < E.berhenti + 0.12 ? "bicara" : t < E.memastikan + 0.12 ? "kontak" : "memanggil";
    const screen = (c2, w, h, tt) => {
      if (mode === "bicara") return KY.panggilan(c2, w, h, { t: tt, nama: "Nomor tidak dikenal", durasi: "0812-0000-1234", tanya: false, jam: false, ringkas: true, teks: 1.08 });
      if (mode === "kontak") return kontakBesar(c2, w, h, tt);
      return KY.panggilan(c2, w, h, { t: tt, nama: "Anakku", status: "Memanggil…", huruf: "A", warna: P.teal, jam: false, ringkas: true, teks: 1.15 });
    };
    ctx.save(); ctx.globalAlpha *= clamp(inn * 1.6) * (1 - clamp(out * 1.8));
    D.glow(ctx, cx, cy, 520, mode === "memanggil" ? P.teal : "#A9D4FF", 0.25);
    const a = KY.hp(ctx, cx, cy, hgt, { t, screen, ringkas: true, glow: 0.5, glowCol: "#A9D4FF", tilt: -0.08 + 0.03 * Math.sin(t * 0.7) });
    // jari Bu Rina: melayang di atas tombol merah, menekan pada "berhenti"; lalu tombol hijau Anakku pada "memastikan"
    const o = a.out || {};
    let tgt = null, tk = 0;
    if (mode === "bicara" && o.akhiri) { tgt = a.map(o.akhiri.cx + o.akhiri.w * 0.2, o.akhiri.cy + o.akhiri.h * 0.1); tk = tekan1; }
    else if (mode === "kontak" && o.telepon) { tgt = a.map(o.telepon.cx || o.telepon.x + o.telepon.w / 2, o.telepon.cy || o.telepon.y + o.telepon.h / 2); tk = tekan2; }
    else if (mode === "kontak" && o.baris && o.baris.length) { const rw = o.baris.find(x => x) ; if (rw) tgt = a.map(rw.x + rw.w * 0.85, rw.y + rw.h / 2); tk = tekan2; }
    const fin = ramp(t, E.kebiasaan - 0.4, 0.6) * (1 - ramp(t, E.memastikan + 0.5, 0.4));
    if (tgt && fin > 0) { ctx.save(); ctx.globalAlpha *= fin; const dy = (1 - eout(fin)) * 160;
      KY.jari(ctx, tgt.x, tgt.y + dy, 120, { t, tekan: tk, kulit: KO.SKIN[3], lengan: "#F2A65A" }); ctx.restore(); }
    ctx.restore();
  }

  // ---------- b9_2: kertas kata sandi + lingkaran keluarga + grup ----------
  // koordinat layar (kamera kamar = 1,0 selama bagian ini). Kertas besar tepat di atas kepala ibu dan anak.
  const MED = [{ k: "ortu", p: ["ayah", "ibuLain"], lab: "Orang tua", x: 300, y: 270 }, { k: "kakek", p: ["kakek"], lab: "Kakek", x: 590, y: 178 },
    { k: "nenek", p: ["nenek"], lab: "Nenek", x: 1520, y: 178 }, { k: "anakmu", p: ["adik"], lab: "Anak", x: 1738, y: 270 }];
  const MED_R = 84, KS = { x: 1058, y: 250, w: 700 };   // w = lebar kertas terbuka; terlipat empat ±370 × 250
  const presetKepala = n => n === "ibuLain" ? Object.assign(KO.preset("buRina"), { hijab: "#5BB6C9", ciput: "#2E7E8C", skin: 2 }) : KO.preset(n);
  function medali(ctx, x, y, r, m, t, face) {
    ctx.save(); D.glow(ctx, x, y, r * 1.7, P.warm, 0.3);
    ctx.fillStyle = "rgba(12,18,54,0.9)"; ctx.beginPath(); ctx.arc(x, y, r + Math.max(4, r * 0.12), 0, TAU); ctx.fill();
    ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * 0.94, 0, TAU); ctx.clip();
    const gr = ctx.createLinearGradient(0, y - r, 0, y + r); gr.addColorStop(0, "#C9DAFF"); gr.addColorStop(1, "#8EA6EE"); ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    if (m.p.length === 2) {   // orang tua: dua kepala dewasa berdampingan
      m.p.forEach((n, j) => KO.kepala(ctx, x + (j ? 0.34 : -0.34) * r, y + r * 0.1, r * 0.36, Object.assign(presetKepala(n), { t, face: face || "senang", bahu: 1.3, seed: 5 + j })));
    } else KO.kepala(ctx, x, y + r * 0.02, r * 0.5, Object.assign(presetKepala(m.p[0]), { t, face: face || "senang", bahu: 1.3, seed: 3 + Math.round(x) % 7 }));
    ctx.restore();
    ctx.strokeStyle = P.amber; ctx.lineWidth = Math.max(3, r * 0.08); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  // posisi & skala kertas: besar di atas kepala, lalu (saat "Bagikan") mengecil ke pojok kiri atas dan tetap terlihat
  function kertasPos(t, E) {
    const mv = eio(ramp(t, E.bagikan - 0.05, 0.8));
    return { x: lerp(KS.x, 250, mv), y: lerp(KS.y, 214, mv) + Math.sin(t * 1.6) * 5 * (1 - mv), s: lerp(1, 0.48, mv), mv };
  }
  function kataSandi(ctx, t, E, c, IA) {
    const a = ramp(t, E.sandi - 0.3, 0.3); if (a <= 0) return null;
    const pp = lerp(0.82, 1, spring(ramp(t, E.sandi - 0.3, 1.1), 9, 0.45)) * clamp(ramp(t, E.sandi - 0.3, 0.12) * 4), K2 = kertasPos(t, E), px = K2.x, py = K2.y;
    // redupkan dinding bagian atas (jendela, jam, foto) selama kata sandi & potret tampil
    const dim = a * (1 - ramp(t, E.karena + 0.2, 0.6)); if (dim > 0) { const g2 = ctx.createLinearGradient(0, 0, 0, 470); g2.addColorStop(0, `rgba(12,18,56,${0.55 * dim})`); g2.addColorStop(0.7, `rgba(12,18,56,${0.32 * dim})`); g2.addColorStop(1, "rgba(12,18,56,0)"); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, 470); }
    // berkas cahaya hangat dari kertas kecil di tangan Bu Rina ke kertas besar
    if (IA && IA.kertas && IA.hand) { const hs = toS(c, IA.hand[0], IA.hand[1]), ba = a * (1 - K2.mv) * 0.5;
      if (ba > 0.01) { const g3 = ctx.createLinearGradient(0, hs[1], 0, py); g3.addColorStop(0, D.hexA(P.warm, 0.55 * ba)); g3.addColorStop(1, D.hexA(P.warm, 0.12 * ba));
        ctx.fillStyle = g3; ctx.beginPath(); ctx.moveTo(hs[0] - 14, hs[1]); ctx.lineTo(px - 110 * pp, py + 100 * pp); ctx.lineTo(px + 110 * pp, py + 100 * pp); ctx.lineTo(hs[0] + 14, hs[1]); ctx.closePath(); ctx.fill(); } }
    // garis berbagi dari kertas ke tiap potret
    MED.forEach(m => {
      const u = eout(ramp(t, E[m.k] - 0.05, 0.45)); if (u <= 0) return;
      ctx.save(); ctx.globalAlpha *= a * (1 - ramp(t, E.bagikan, 0.3)); ctx.strokeStyle = D.hexA(P.warm, 0.85); ctx.lineWidth = 4.5; ctx.setLineDash([14, 10]); ctx.lineCap = "round"; ctx.lineDashOffset = -t * 40;
      const ex = lerp(px, m.x, u), ey = lerp(py, m.y, u); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
      if (u < 1) D.glow(ctx, ex, ey, 44, P.warm, 0.9);
      ctx.restore();
    });
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(px, py); ctx.scale(pp * K2.s, pp * K2.s); ctx.rotate(-0.025 + 0.018 * Math.sin(t * 1.3));
    D.glow(ctx, 0, 0, 250, P.warm, 0.4);
    KB.kertasLipat(ctx, 0, 0, KS.w, { fold: 1, word: "rahasia", t });
    const lk = ramp(t, E.sandi + 0.05, 0.45);
    KB.gembok(ctx, 100, 30, 120, { locked: lk, color: P.amber, t, flash: lk >= 1 ? 0.8 * (1 - ramp(t, E.sandi + 0.5, 0.6)) : 0 });
    ctx.restore();
    // label tepat di atas kertas
    const la = a * clamp(pp) * (1 - ramp(t, E.bagikan - 0.1, 0.3));
    if (la > 0.01) { ctx.save(); ctx.globalAlpha *= la; D.label(ctx, "Kata sandi keluarga", px, 108, { size: 48, col: P.amber }); ctx.restore(); }
    return { px, py };
  }
  function medaliSemua(ctx, t, E, phoneSlots) {
    const fly = eio(ramp(t, E.bagikan + 0.05, 0.75));
    MED.forEach((m, i) => {
      const p = spring(ramp(t, E[m.k] - 0.05, 1.1), 10, 0.45); if (p <= 0.01) return;
      const gone = ramp(t, E.karena + 0.3, 0.4); if (gone >= 1) return;
      const sl = phoneSlots && phoneSlots[i], f = sl ? fly : 0;
      const x = lerp(m.x, sl ? sl[0] : m.x, f), y = lerp(m.y + Math.sin(t * 1.5 + i) * 5, sl ? sl[1] : m.y, f), r = lerp(MED_R, sl ? sl[2] : MED_R, f) * p;
      ctx.save(); ctx.globalAlpha *= 1 - gone; medali(ctx, x, y, r, m, t); ctx.restore();
      const la = clamp(p) * (1 - ramp(t, E.bagikan - 0.55, 0.3)); if (la > 0.01) { ctx.save(); ctx.globalAlpha *= la; D.label(ctx, m.lab, m.x, m.y + MED_R + 48, { size: 44, col: P.warm }); ctx.restore(); }
    });
  }
  // layar grup keluarga (koordinat layar HP, w≈335): kartu video selebar layar, centang biru, hati ≥48 px, dua balasan
  function layarGrup(c2, w, h, t, st) {
    const u = w / 100;
    c2.fillStyle = "#EEF2FB"; c2.fillRect(0, 0, w, h);
    const hh = u * 46, gr = c2.createLinearGradient(0, 0, w, hh); gr.addColorStop(0, "#2E9C7E"); gr.addColorStop(1, "#3E86C9"); c2.fillStyle = gr; c2.fillRect(0, 0, w, hh);
    KY.ikon(c2, "grup", u * 13, u * 13, u * 9, "#FFFFFF");
    txt(c2, "Keluarga", u * 24, u * 17, 44, { align: "left", color: "#FFFFFF", weight: 900 });
    const slots = [0, 1, 2, 3].map(i => [u * (16 + i * 22.5), u * 33, u * 8.5]);
    slots.forEach(([x, y, r]) => { c2.fillStyle = "rgba(255,255,255,0.28)"; c2.beginPath(); c2.arc(x, y, r, 0, TAU); c2.fill(); });
    // kartu video dibagikan, selebar layar
    const k = eout(clamp(st.kirim)); let yEnd = hh + u * 6;
    if (k > 0) {
      const bx = u * 4, bw = u * 92, by = hh + u * 5 + (1 - k) * u * 60, tw = bw - u * 6, th = tw * 9 / 16, bh = th + u * 30;
      c2.save(); c2.globalAlpha *= k;
      c2.fillStyle = "#D7F5E6"; H.rr(c2, bx, by, bw, bh, u * 5); c2.fill();
      const tx0 = bx + u * 3, ty0 = by + u * 3;
      c2.save(); H.rr(c2, tx0, ty0, tw, th, u * 3.5); c2.clip();
      KY.spektrogram(c2, tx0, ty0, tw, th, { profil: PROF_ANAK, dur: 3, scroll: t * 0.4, frame: false, r: 0 });
      c2.fillStyle = "rgba(10,18,52,0.25)"; c2.fillRect(tx0, ty0, tw, th); c2.restore();
      c2.fillStyle = "rgba(255,255,255,0.95)"; c2.beginPath(); c2.arc(tx0 + tw / 2, ty0 + th / 2, u * 10, 0, TAU); c2.fill();
      c2.fillStyle = "#E5484D"; c2.beginPath(); c2.moveTo(tx0 + tw / 2 - u * 3.4, ty0 + th / 2 - u * 5); c2.lineTo(tx0 + tw / 2 + u * 5.6, ty0 + th / 2); c2.lineTo(tx0 + tw / 2 - u * 3.4, ty0 + th / 2 + u * 5); c2.closePath(); c2.fill();
      txt(c2, "Tonton, ya!", bx + u * 4, ty0 + th + u * 13.5, 44, { align: "left", color: "#1B2150", weight: 800 });
      // centang dua (abu-abu -> biru) — besar
      const ck = clamp(st.baca); c2.strokeStyle = ck > 0.5 ? "#2F7FE0" : "#8A93B8"; c2.lineWidth = u * 1.9; c2.lineCap = "round"; c2.lineJoin = "round";
      const pk = 1 + 0.35 * Math.sin(Math.PI * clamp((st.baca - 0.5) * 2));
      [0, 1].forEach(j => { const ox = bx + bw - u * (15 - j * 6), oy = by + bh - u * 4.5; c2.save(); c2.translate(ox, oy); c2.scale(pk, pk); c2.beginPath(); c2.moveTo(-u * 4, -u * 0.5); c2.lineTo(-u * 1.3, u * 2.5); c2.lineTo(u * 4, -u * 4); c2.stroke(); c2.restore(); });
      // reaksi hati dari anggota (≥48 px)
      for (let i = 0; i < 4; i++) { const rp = spring(clamp(st.reaksi * 4 - i), 10, 0.45); if (rp <= 0.01) continue;
        const hx = bx + u * (10 + i * 15.5), hy = by + bh + u * 1; c2.save(); c2.globalAlpha *= clamp(rp); c2.fillStyle = "#FFFFFF"; c2.beginPath(); c2.arc(hx, hy, u * 8 * rp, 0, TAU); c2.fill();
        c2.strokeStyle = "#E1E5F4"; c2.lineWidth = u * 0.6; c2.stroke(); heartPath(c2, hx, hy + u * 0.8, u * 5 * rp); c2.fillStyle = "#FF5A7A"; c2.fill(); c2.restore(); }
      c2.restore();
      yEnd = by + bh + u * 12;
    }
    // balasan dari Kakek dan Nenek (avatar + gelembung, teks ≥40 px)
    [["kakek", "Siap!", st.balas1], ["nenek", "Sudah!", st.balas2]].forEach(([nm, msg, v], j) => {
      const q = spring(clamp(v), 10, 0.5); if (q <= 0.01) return;
      const y = yEnd + j * u * 21, ax = u * 10.5, ay = y + u * 8;
      c2.save(); c2.globalAlpha *= clamp(q * 1.5); c2.translate(0, (1 - clamp(q)) * u * 8);
      c2.save(); c2.beginPath(); c2.arc(ax, ay, u * 8.5, 0, TAU); c2.fillStyle = "#BFD3FF"; c2.fill(); c2.clip(); KO.kepala(c2, ax, ay + u * 0.8, u * 5, Object.assign(KO.preset(nm), { t, face: "senang", bahu: 1.3, seed: 7 + j })); c2.restore();
      c2.font = `800 42px ${FONT}`; const bw2 = c2.measureText(msg).width + u * 9;
      c2.fillStyle = "#FFFFFF"; H.rr(c2, u * 21, y, bw2, u * 16, u * 5); c2.fill(); c2.strokeStyle = "#DDE3F4"; c2.lineWidth = u * 0.5; c2.stroke();
      txt(c2, msg, u * 25.5, y + u * 11.3, 42, { align: "left", color: "#1B2150", weight: 800 });
      c2.restore();
    });
    return { slots };
  }
  function hpBesar2(ctx, t, E) {
    const inn = eout(ramp(t, E.bagikan - 0.35, 0.6)), out = eio(ramp(t, E.karena + 0.15, 0.6)); if (inn <= 0 || out >= 1) return null;
    const cx = 1600, cy = 500 + (1 - inn) * 660 + out * 720, hgt = 760;
    let slotsS = null;
    const st = { kirim: ramp(t, E.bagikan + 0.15, 0.45), baca: ramp(t, E.bagikan + 1.0, 0.3), reaksi: ramp(t, E.bagikan + 1.15, 0.8), balas1: ramp(t, E.grup - 0.05, 0.5), balas2: ramp(t, E.grup + 0.45, 0.5) };
    ctx.save(); ctx.globalAlpha *= clamp(inn * 1.6) * (1 - clamp(out * 1.8));
    D.glow(ctx, cx, cy, 520, P.green, 0.2);
    const a = KY.hp(ctx, cx, cy, hgt, { t, ringkas: true, glow: 0.5, glowCol: "#A9D4FF", tilt: -0.06 + 0.03 * Math.sin(t * 0.7), screen: (c2, w, h, tt) => layarGrup(c2, w, h, tt, st) });
    ctx.restore();
    if (a.out && a.out.slots) slotsS = a.out.slots.map(([x, y, r]) => { const p = a.map(x, y); return [p.x, p.y, r]; });
    return slotsS;
  }

  // ---------- adegan kamar lengkap + lapisan atas ----------
  function sceneKamar(ctx, b, l, t, TL) {
    const E = EV(TL);
    const S = kamarScene(ctx, t, E);
    D.post(c2 => {
      // lapisan atas ikut memudar masuk bersama silang-pudar dari bab 8, dan keluar sebelum b9_3
      c2.globalAlpha *= clamp((t - E.s1) / 0.45) * (1 - ramp(t, E.e2 - 0.5, 0.45));
      panelSpek(c2, t, E, S.c, S.IA);
      lencana(c2, t, E);
      hpBesar1(c2, t, E);
      kataSandi(c2, t, E, S.c, S.IA);
      const slots = hpBesar2(c2, t, E);
      medaliSemua(c2, t, E, slots);
      // label sasaran -> tersayang: di dinding polos di atas cincin/hati; berganti tepat pada "orang yang paling kita sayangi"
      const la = ramp(t, E.sasaran - 0.1, 0.3); if (la > 0) {
        const lx = toS(S.c, 1100, 0)[0], ly = 112, so = ramp(t, E.tersayang - 0.16, 0.15), sw = ramp(t, E.tersayang, 0.2);
        if (so < 1) { c2.save(); c2.globalAlpha *= la * (1 - so); D.label(c2, "Sasaran", lx, ly, { size: 48, col: "#FF5A5F", color: "#FFFFFF" }); c2.restore(); }
        if (sw > 0) { const s2 = spring(ramp(t, E.tersayang, 0.9), 9, 0.45); c2.save(); c2.globalAlpha *= clamp(sw); c2.translate(lx, ly); c2.scale(lerp(0.86, 1, s2), lerp(0.86, 1, s2)); D.label(c2, "Orang tersayang", 0, 0, { size: 48, col: "#FF8FB1" }); c2.restore(); }
      }
    });
  }

  // ---------- b9_3: kampung malam + layar akhir ----------
  // Pembuka: kamera mulai di dalam jendela rumah ungu (jendela kiri yang menyala) dan isi jendela itu ADALAH kamar Bu Rina,
  // persis seperti bingkai terakhir b9_2 — silang-pudar memadukan isi yang sama di tempat yang sama. Lalu kamera mundur ke jalan.
  const SLOT = { x: 1060, y: 236, w: 760, h: 428 };      // tempat elemen video YouTube
  const SUB = { x: 400, y: 280, r: 118 };                 // tempat elemen Subscribe (lingkaran)
  const LIFT = 80;                                        // set kampung dinaikkan 80 px: jalan & Bip tidak terlalu rendah
  const WIN0 = { x: 1340 + 440 * 0.22 - 60, y: 600 - LIFT, w: 120, h: 130 }, Z0 = Math.max(W / WIN0.w, HH / WIN0.h), ZEND = 1.03, CEND = [960, 548];
  let DEPM = null;
  function depMid() {   // besar geseran paralaks lapisan tengah kampung untuk px = 1 (sekali, dari anchors set)
    if (DEPM != null) return DEPM;
    try { const c = document.createElement("canvas"); c.width = c.height = 4; const r = KL.kampung(c.getContext("2d"), 0, { px: 1, near: false }); DEPM = (1340 + 220) - r.anchors.doors[2].x; } catch (e) { DEPM = 0; }
    return DEPM;
  }
  const pxKampung = (t, E) => -0.35 + 0.5 * eio(ramp(t, E.s3, 6));
  function winRect(t, E) { const dx = -pxKampung(t, E) * depMid(); return { x: WIN0.x + dx, y: WIN0.y, w: WIN0.w, h: WIN0.h, dx }; }
  const mundur = (t, E) => eio(ramp(t, E.s3 + 0.3, 2.7));
  function camKampung(t, E, win) {
    const wc = [win.x + win.w / 2, win.y + win.h / 2], u = mundur(t, E);
    const z = Math.exp(lerp(Math.log(Z0), Math.log(ZEND), u));
    const sEnd = [(wc[0] - CEND[0]) * ZEND + W / 2, (wc[1] - CEND[1]) * ZEND + HH / 2];
    const sx = lerp(W / 2, sEnd[0], u), sy = lerp(HH / 2, sEnd[1], u);
    const c = { x: wc[0] - (sx - W / 2) / z, y: wc[1] - (sy - HH / 2) / z, z };
    c.x += Math.sin(t * 0.29) * 5 * u; c.y += Math.sin(t * 0.21 + 2) * 4 * u;
    const hw = 960 / c.z, hh = 540 / c.z; c.x = clamp(c.x, hw, W - hw); c.y = clamp(c.y, hh, HH - hh); return c;
  }
  // kamar di dalam jendela: mula-mula identik dengan layar penuh (skala 1/z), lalu menempel di jendela (cover) saat jendela mengecil
  function kamarDiJendela(ctx, t, E, c, win) {
    const wc = [win.x + win.w / 2, win.y + win.h / 2], kc = Math.max(win.w / W, win.h / HH), k = Math.min(kc, 1 / c.z);
    ctx.save(); ctx.beginPath(); ctx.rect(win.x, win.y, win.w, win.h); ctx.clip();
    ctx.fillStyle = "#3F4E9C"; ctx.fillRect(win.x, win.y, win.w, win.h);
    ctx.save(); ctx.translate(wc[0], wc[1]); ctx.scale(k, k); ctx.translate(-W / 2, -HH / 2); kamarScene(ctx, t, E); ctx.restore();
    // dari jauh: kaca hangat, kusen silang, dan tirai amber milik rumah ini muncul kembali
    const fa = clamp((7 - c.z) / 3);
    if (fa > 0) {
      ctx.globalAlpha = fa;
      ctx.fillStyle = "rgba(255,196,120,0.22)"; ctx.fillRect(win.x, win.y, win.w, win.h);
      ctx.fillStyle = "#FFC56E"; const { x, y } = win;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 30, y); ctx.lineTo(x + 12, y + 130); ctx.lineTo(x, y + 130); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 120, y); ctx.lineTo(x + 90, y); ctx.lineTo(x + 108, y + 130); ctx.lineTo(x + 120, y + 130); ctx.fill();
      ctx.fillStyle = "#D3C6F4"; ctx.fillRect(x + 57, y, 6, 130); ctx.fillRect(x, y + 52, 120, 6);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  // lampu jendela & lampu jalan lebih terang (dalam koordinat set yang sudah dinaikkan)
  function cahayaKampung(ctx, t, dx) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    [[-60, 420, [0.25, 0.78]], [520, 470, [0.2, 0.8]], [1340, 440, [0.22, 0.8], [1, 0.3]], [1850, 400, [0.25]]].forEach(([x, w, ws, lit]) => ws.forEach((u, k) => {
      const l = lit ? lit[k] : 1, f = 0.9 + 0.1 * Math.sin(t * 0.7 + k + x);
      D.glow(ctx, x + w * u + dx, 665, 190, "#FFB060", 0.22 * l * f);
    }));
    ctx.restore();
    // genangan cahaya lampu jalan di trotoar dan jalan (berkedip halus)
    [[1380 + dx, 450], [270 + dx, 450]].forEach(([hx, hy], i) => {
      const f = 0.92 + 0.08 * Math.sin(t * 9 + i * 2) * Math.sin(t * 5.3 + i);
      ctx.save(); ctx.globalCompositeOperation = "screen";
      const g = ctx.createLinearGradient(0, hy, 0, 900); g.addColorStop(0, `rgba(255,214,140,${0.32 * f})`); g.addColorStop(1, "rgba(255,214,140,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx - 30, hy + 10); ctx.lineTo(hx + 30, hy + 10); ctx.lineTo(hx + 210, 900); ctx.lineTo(hx - 210, 900); ctx.closePath(); ctx.fill();
      ctx.restore();
      if (KL.parts.warmPool) KL.parts.warmPool(ctx, hx, 872, 360, 0.75 * f, 0.22); else D.glow(ctx, hx, 872, 360, P.warm, 0.4 * f);
      D.glow(ctx, hx, hy + 8, 90, "#FFF0C8", 0.7 * f);
    });
  }
  // lapisan depan: pagar rendah + pagar tanaman, paralaks pelan; naik dari bawah saat kamera tiba
  function pagarDepan(ctx, t, E, c) {
    const a = clamp((2.6 - c.z) / 1.2); if (a <= 0) return;
    const yo = (c.z - ZEND) * 240, dr = (t - E.s3) * 9;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(0, yo);
    // pagar besi rendah di belakang tanaman
    const off = -((dr * 0.6) % 120);
    ctx.fillStyle = "#2B336E"; ctx.fillRect(0, 930, W, 12); ctx.fillRect(0, 975, W, 10);
    for (let x = off - 120; x < W + 120; x += 120) { H.rr(ctx, x, 905, 16, 140, 6); ctx.fill(); ctx.beginPath(); ctx.arc(x + 8, 902, 11, 0, TAU); ctx.fill(); }
    // pagar tanaman: dua baris gumpalan daun yang saling menumpuk, tepi atas disinari lampu jalan
    const off2 = -(dr % 1600);
    const lampNear = bx => Math.max(Math.exp(-((bx - 1380) ** 2) / (2 * 280 * 280)), Math.exp(-((bx - 270) ** 2) / (2 * 280 * 280)));
    for (let row = 0; row < 2; row++) {
      const r = D.rng(77 + row);
      for (let i = 0; i < 26; i++) {
        const bx0 = i * 72 + r() * 30, bx = ((bx0 + off2 + row * 36) % 1872 + 1872) % 1872 - 20, br = (row ? 62 : 54) + r() * 26, by = (row ? 1028 : 985) + r() * 22, sw = Math.sin(t * 0.8 + i * 0.7 + row) * 2.5;
        ctx.fillStyle = row ? (i % 2 ? "#1B4256" : "#1E4A5F") : (i % 2 ? "#163A4E" : "#183F53"); ctx.beginPath(); ctx.arc(bx + sw, by, br, 0, TAU); ctx.fill();
        const ln = lampNear(bx);
        ctx.fillStyle = `rgba(${row ? "110,200,160" : "90,170,140"},${(row ? 0.2 : 0.12) + 0.38 * ln})`; ctx.beginPath(); ctx.arc(bx + sw - br * 0.2, by - br * 0.3, br * 0.62, Math.PI * 1.05, Math.PI * 1.85); ctx.lineTo(bx + sw - br * 0.2, by - br * 0.3); ctx.fill();
        if (ln > 0.3) { ctx.fillStyle = `rgba(255,214,140,${0.25 * ln})`; ctx.beginPath(); ctx.arc(bx + sw, by - br * 0.72, br * 0.3, 0, TAU); ctx.fill(); }
      }
    }
    ctx.fillStyle = "#183E52"; ctx.fillRect(0, 1040, W, 60);
    ctx.restore();
  }
  // kunang-kunang & debu cahaya: gerak sekunder di seluruh layar akhir
  function kunang(ctx, t, a) {
    if (a <= 0) return; const r = D.rng(31); ctx.save();
    for (let i = 0; i < 18; i++) { const bx = r() * W, by = 560 + r() * 340, ph = r() * TAU, sp = 0.3 + r() * 0.4;
      const x = bx + Math.sin(t * sp + ph) * 60, y = by + Math.sin(t * sp * 1.3 + ph * 2) * 26, f = 0.5 + 0.5 * Math.sin(t * 2.2 + ph * 3);
      D.glow(ctx, x, y, 16, "#E8FF9A", a * (0.25 + 0.55 * f)); ctx.fillStyle = `rgba(250,255,210,${a * (0.4 + 0.5 * f)})`; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  const TEK = ["video", "telepon", "kamera", "cari", "mik", "grup", "bank", "unggah"];
  function ikonTeknologi(ctx, t, E, a) {
    if (a <= 0) return; const r = D.rng(57);
    TEK.forEach((nm, i) => {
      const x0 = 160 + i * 230 + (r() - 0.5) * 80, sp = 0.05 + r() * 0.035, ph = r(), u = ((t - E.s3) * sp + ph) % 1;
      const pop = spring(ramp(t, E.teknologi - 0.2 + i * 0.09, 1), 9, 0.45); if (pop <= 0.01) return;
      const x = x0 + Math.sin(t * 0.8 + i) * 18, y = 600 - u * 500, s = 33 + r() * 3, col = i % 2 ? P.teal : P.violet;
      ctx.save(); ctx.globalAlpha *= a * Math.min(1, Math.sin(u * Math.PI) * 1.8); ctx.translate(x, y); ctx.scale(pop, pop);
      D.glow(ctx, 0, 0, s * 2.6, col, 0.55);
      ctx.fillStyle = i % 2 ? "#1FA79E" : "#5B4BD6"; ctx.beginPath(); ctx.arc(0, 0, s, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 3; ctx.stroke();
      KY.ikon(ctx, nm, 0, 0, s * 1.1, "#FFFFFF"); ctx.restore();
    });
  }
  function sceneKampung(ctx, b, l, t, TL) {
    const E = EV(TL), win = winRect(t, E), c = camKampung(t, E, win), px = pxKampung(t, E);
    const opt = { senja: 0.3, lampu: 1, px, near: false };
    ctx.save(); ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
    ctx.fillStyle = "#454C8C"; ctx.fillRect(-600, 980, W + 1200, 400);   // jalan di bawah set yang dinaikkan
    ctx.save(); ctx.translate(0, -LIFT);
    KL.kampung(ctx, t, opt);
    ctx.save(); ctx.translate(win.dx, 0); KL.parts.streetLamp(ctx, 180, 820, t, "#363E86", 1, 1, 370); ctx.restore();
    cahayaKampung(ctx, t, win.dx);
    KL.depan(ctx, "kampung", t, opt);
    ctx.restore();
    kamarDiJendela(ctx, t, E, c, win);
    ctx.restore();
    pagarDepan(ctx, t, E, c);
    // kerudung tipis di langit atas supaya layar akhir terbaca; rumah & jalan tetap terang
    const sc = eio(ramp(t, E.kalau + 0.6, 1.6));
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, `rgba(12,18,58,${0.4 * sc})`); gr.addColorStop(0.5, `rgba(12,18,58,${0.12 * sc})`); gr.addColorStop(0.75, "rgba(12,18,58,0)");
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    const ea = clamp((3 - c.z) / 1.5);
    kunang(ctx, t, ea);
    ikonTeknologi(ctx, t, E, eio(ramp(t, E.teknologi - 0.3, 0.6)) * (1 - 0.4 * ramp(t, E.sampai, 1.5)));
    // Bip (berdiri di trotoar yang sudah dinaikkan)
    const bs = 230, floorY = 756, by = floorY - bs * 0.5, bx = lerp(-200, 800, eio(ramp(t, E.s3 + 1.2, 2.2)));
    const walking = t < E.s3 + 3.4;
    let bo;
    if (walking) bo = { pose: "jalan", dir: 1, speed: 1.2 };
    else if (t < E.subscribe - 0.25) bo = { pose: "diam", mood: "happy", look: [-0.4, -0.2] };
    else if (t < E.sampai) bo = { pose: "tunjuk", target: [SUB.x + SUB.r * 0.8, SUB.y + SUB.r * 0.6], dir: -1, mood: t < E.subscribe + 0.2 ? "wow" : "happy" };
    else if (t < E.berikutnya + 0.1) bo = { pose: "diam", wave: 1, mood: "happy" };
    else { const cyc = (t - E.berikutnya) % 6; bo = cyc < 3 ? { pose: "tunjuk", target: [SLOT.x + 40, SLOT.y + SLOT.h * 0.45], dir: 1, mood: "happy" } : { pose: "diam", wave: cyc < 4.6 ? 1 : 0, mood: "happy" }; }
    D.post(c2 => {
      endScreen(c2, t, E);
      if (bx > -160) KB.draw(c2, bx, by + Math.sin(t * 2) * 2, bs, Object.assign({ t, seed: 4 }, bo));
    });
  }
  function endScreen(ctx, t, E) {
    // lingkaran kanal (tempat elemen Subscribe)
    const pa = spring(ramp(t, E.subscribe - 0.35, 1.2), 9, 0.45);
    if (pa > 0.01) {
      ctx.save(); ctx.translate(SUB.x, SUB.y); ctx.scale(pa, pa);
      D.glow(ctx, 0, 0, SUB.r * 2, P.teal, 0.3 + 0.1 * Math.sin(t * 2));
      for (let i = 0; i < 2; i++) { const ph = (t * 0.4 + i / 2) % 1; ctx.strokeStyle = D.hexA(P.teal, 0.5 * (1 - ph)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, SUB.r * (1.08 + 0.35 * ph), 0, TAU); ctx.stroke(); }
      ctx.fillStyle = "#1B2457"; ctx.beginPath(); ctx.arc(0, 0, SUB.r, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(0, 0, SUB.r * 0.9, 0, TAU); ctx.clip();
      KY.gelombang(ctx, -SUB.r * 0.8, -SUB.r * 0.5, SUB.r * 1.6, SUB.r, { t, mode: "batang", seed: 23, col: P.teal, col2: P.pink, n: 11 });
      ctx.restore();
      ctx.strokeStyle = P.teal; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, SUB.r, 0, TAU); ctx.stroke();
      ctx.restore();
    }
    // nama kanal: kata muncul saat diucapkan
    const nm = [["I Teach", E.channel + 0.4], ["Software Engineering", E.channel + 0.9]];
    { const ba = eout(ramp(t, E.channel + 0.4, 0.4)); if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba * 0.78; ctx.fillStyle = "rgba(12,18,56,0.85)"; H.rr(ctx, SUB.x - 300, SUB.y + SUB.r + 20, 600, 152, 34); ctx.fill(); ctx.restore(); } }
    nm.forEach(([s, t0], i) => { const u = eout(ramp(t, t0, 0.4)); if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; txt(ctx, s, SUB.x, SUB.y + SUB.r + 74 + i * 66 + (1 - u) * 14, i ? 52 : 56, { align: "center", weight: 900, color: i ? "#FFFFFF" : P.warm }); ctx.restore(); });
    // lonceng kecil di lingkaran: bergoyang saat "subscribe" (elemen Subscribe YouTube menutupi lingkaran ini)
    if (pa > 0.01) {
      const ring = ramp(t, E.subscribe - 0.05, 0.1) * (1 - ramp(t, E.subscribe + 1.4, 0.4)), sw = Math.sin(t * 16) * 0.4 * ring;
      const burst = ramp(t, E.subscribe, 0.9); if (burst > 0 && burst < 1) { ctx.strokeStyle = D.hexA(P.teal, 0.9 * (1 - burst)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r * (1.05 + 0.7 * eout(burst)), 0, TAU); ctx.stroke(); }
      const bx = SUB.x + SUB.r * 0.74, byy = SUB.y + SUB.r * 0.74, br = 38 * clamp(pa);
      ctx.save(); ctx.translate(bx, byy); ctx.fillStyle = "#E5484D"; ctx.beginPath(); ctx.arc(0, 0, br, 0, TAU); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke();
      ctx.rotate(sw); ctx.scale(br / 38, br / 38); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-15, 10); ctx.quadraticCurveTo(-13, -17, 0, -17); ctx.quadraticCurveTo(13, -17, 15, 10); ctx.closePath(); ctx.fill();
      ctx.fillRect(-19, 8, 38, 6); ctx.beginPath(); ctx.arc(0, 18, 5, 0, TAU); ctx.fill(); ctx.restore();
    }
    // tempat video berikutnya
    const va = eout(ramp(t, E.sampai - 0.2, 0.7));
    if (va > 0) {
      const { x, y, w, h } = SLOT, dy = (1 - va) * 40;
      ctx.save(); ctx.globalAlpha *= va; ctx.translate(0, dy);
      D.label(ctx, "Cerita berikutnya", x + w / 2, y - 62, { size: 48, col: P.amber });
      D.glow(ctx, x + w / 2, y + h / 2, w * 0.7, P.violet, 0.3);
      ctx.save(); H.rr(ctx, x, y, w, h, 26); ctx.clip();
      KY.spektrogram(ctx, x, y, w, h, { profil: PROF_ANAK, dur: 5, scroll: t * 0.35, frame: false, r: 0, alpha: 0.55 });
      ctx.fillStyle = "rgba(16,22,66,0.45)"; ctx.fillRect(x, y, w, h);
      const sx = ((t * 0.25) % 1.6 - 0.3) * w; const sg = ctx.createLinearGradient(x + sx - 120, 0, x + sx + 120, 0); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,0.12)"); sg.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
      ctx.restore();
      ctx.strokeStyle = D.hexA("#FFFFFF", 0.75); ctx.lineWidth = 5; ctx.setLineDash([22, 14]); ctx.lineDashOffset = -t * 20; H.rr(ctx, x, y, w, h, 26); ctx.stroke(); ctx.setLineDash([]);
      const pr = 1 + 0.06 * Math.sin(t * 3); ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(pr, pr);
      ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fill(); ctx.fillStyle = "#E5484D"; ctx.beginPath(); ctx.moveTo(-18, -28); ctx.lineTo(30, 0); ctx.lineTo(-18, 28); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.restore();
    }
  }

  // ---------- pemilih adegan ----------
  K.SCENES = K.SCENES || {};
  K.SCENES.d03_b9 = function (ctx, b, l, t, TL) {
    if (b.id === "b9_3") return sceneKampung(ctx, b, l, t, TL);
    return sceneKamar(ctx, b, l, t, TL);
  };
  K.SCENES.d03_b9.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b9 = TL => {
    const E = EV(TL), r = (x, kind, amp) => [+x.toFixed(3), kind, amp];
    return [
      r(E.baik + 0.1, "shimmer", 0.45),            // tiruan menjadi sama persis (≠ -> =)
      r(E.tetapi - 0.45, "whoosh", 0.5),           // panel tersedot kembali ke HP
      r(E.sederhana + 0.05, "pop", 0.55),          // lencana Berhenti/Pastikan muncul
      r(E.berhenti + 0.05, "clack", 0.75),         // telepon penipu ditutup
      r(E.memastikan + 0.05, "pop", 0.6),          // menelepon Anakku
      r(E.sandi + 0.42, "clack", 0.6),             // gembok kertas kata sandi mengunci
      r(E.bagikan - 0.6, "whoosh", 0.55),          // HP grup naik
      r(E.bagikan + 0.3, "pop", 0.55),             // kartu video terkirim
      r(E.sasaran, "clack", 0.7),                  // bidikan mengunci
      r(E.sayangi + 0.05, "shimmer", 0.6),         // bidikan menjadi hati
      r(E.s3 + 0.55, "whoosh", 0.55),              // kamera mundur keluar lewat jendela
      r(E.subscribe + 0.02, "pop", 0.7),           // lingkaran Subscribe + lonceng
      r(E.sampai, "whoosh", 0.4),                  // tempat video berikutnya masuk
    ];
  };
})(typeof window !== "undefined" ? window : globalThis);
