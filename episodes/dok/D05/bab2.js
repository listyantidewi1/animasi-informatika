/* D05 bab 2 — Tahap satu: pasar yang ramah (b2_1 … b2_6).
   b2_1 Pasar Juragan naik dari tanah, papan nama menyala, tanda gratis, gerobak es teh, Juragan membagi es teh, Bip melonjak, lapak terisi;
   b2_2 lingkaran efek jaringan pembeli ⇄ pedagang (tiap putaran menambah orang); b2_3 graf jalur chat 2 → 1, 5 → 10, 100 → ? (tebak dulu);
   b2_4 100 titik, garis menyambung sampai 4.950, tabel; b2_5 dua pasar, orang pindah, pasar kecil menutup rolling door; b2_6 es teh berlipat, "Siapa yang membayar?" */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};

  // ---------- b2_1 ----------
  S.b2_1 = function (ctx, b, l, t) {
    const tNama = D.at(b, "Pasar Juragan"), tMasuk = D.at(b, "Masuknya"), tParkir = D.at(b, "parkirnya"), tTeh = D.at(b, "es teh"), tPed = D.at(b, "Para pedagang"), tSewa = D.at(b, "sewa");
    const naik = eio(clamp((l - 0.3) / 2.6));
    const c = D.path([[0, 960, 560, 0.86], [tTeh - 0.4, 960, 560, 0.86], [tTeh + 1.2, 1080, 600, 1.0], [tPed + 0.2, 1080, 600, 1.0], [b.dur, 960, 560, 0.9]], l);
    const cartIn = eout(clamp((l - (tTeh - 0.6)) / 1.0));
    ctx.save(); U.camT(ctx, c);
    U.pasar(ctx, t, { naik, esTeh: cartIn > 0, esTehX: lerp(2300, 1310, cartIn), papanA: ramp(l, tNama - 0.2, 0.4),
      stallOpt: (i) => ({ kosong: l < tPed + i * 0.35, labelA: ramp(l, tPed + i * 0.35, 0.3) }) });
    // pengunjung datang
    const nP = Math.round(lerp(0, 9, clamp((l - tMasuk + 0.5) / 4)));
    if (nP > 0) U.pengunjung(ctx, t, nP, { y: 1010, h: 230, seed: 3, x0: -200, x1: 2100, v: 60, each: (i, o) => (i >= nP ? Object.assign(o, { hidden: true }) : o) });
    // Juragan di samping gerobak, membagi es teh
    if (cartIn > 0.6) { const ga = ramp(l, tTeh + 0.2, 0.4); const k = 0.5 + 0.5 * Math.sin((l - tTeh) * 2.2);
      ctx.save(); ctx.globalAlpha *= ga; U.juragan(ctx, 1590, FLOOR() + 120, 300, { pose: "bagi", k, t, dir: -1, bawa: (c2, u) => U.esTeh(c2, 0, 4 * u, 14 * u) }); ctx.restore(); }
    // Bip menerima es teh lalu melonjak
    const tGet = tTeh + 1.0;
    if (l > tTeh - 0.3) { const has = l > tGet; const pose = l > tGet && l < tGet + 1.6 ? "kaget" : "pegang";
      KB.draw(ctx, 1150, FLOOR() + 60, 170, { pose, k: l - tGet, t, mood: "happy", seru: false, prop: has ? (c2, px, py, s) => U.esTeh(c2, px, py + s * 0.12, s * 0.28) : null, hold: "depan" }); }
    ctx.restore();
    D.post(c2 => {
      const [nx, ny] = U.toS(c, 960, 160); tag(c2, "Pasar Juragan", nx, ny - 60 > 110 ? ny - 60 : 110, pop(l, tNama).a * (1 - ramp(l, tMasuk, 0.3)), { sp: pop(l, tNama).sp, size: 52 });
      const [gx, gy] = U.toS(c, 960, 700);
      tag(c2, "Masuk gratis", 300, 200, pop(l, tMasuk).a, { sp: pop(l, tMasuk).sp, col: P.green });
      tag(c2, "Parkir gratis", 300, 300, pop(l, tParkir).a, { sp: pop(l, tParkir).sp, col: P.green });
      tag(c2, "Es teh gratis", 300, 400, pop(l, tTeh).a, { sp: pop(l, tTeh).sp, col: P.green });
      tag(c2, "Sewa lapak hampir Rp0", 1500, 200, pop(l, tSewa).a, { sp: pop(l, tSewa).sp, col: P.teal });
    });
  };
  const FLOOR = () => U.FLOOR;

  // ---------- b2_2: lingkaran efek jaringan ----------
  function sisiIkon(ctx, x, y, n, jenis, t, a = 1) {   // gerombol ikon orang (pembeli) atau lapak (pedagang)
    const r = D.rng(jenis === "beli" ? 5 : 9);
    for (let i = 0; i < n; i++) { const ang = i * 2.399, rr = 26 * Math.sqrt(i) ; const px = x + Math.cos(ang) * rr * 1.6, py = y + Math.sin(ang) * rr * 1.2;
      const k = clamp(spring(clamp(a * n - i), 10, 0.5)); if (k <= 0) continue;
      ctx.save(); ctx.translate(px, py); ctx.scale(k, k);
      if (jenis === "beli") { ctx.fillStyle = ["#FF8A65", "#5AA9FF", "#FFD38A", "#5BD68A", "#B39DFF"][i % 5]; ctx.beginPath(); ctx.arc(0, -16, 14, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 14, 20, 16, 0, Math.PI, 0); ctx.fill(); }
      else { ctx.fillStyle = U.AWN[i % U.AWN.length]; ctx.fillRect(-24, -26, 48, 14); ctx.fillStyle = "#FFF3DE"; for (let j = 0; j < 3; j++) ctx.fillRect(-24 + j * 16 + 8, -26, 8, 14); ctx.fillStyle = "#9A6A44"; ctx.fillRect(-20, -10, 40, 28); }
      ctx.restore(); }
  }
  S.b2_2 = function (ctx, b, l, t) {
    const tPlat = D.at(b, "platform hidup"), tBeli = D.at(b, "Pembeli datang"), tPed = D.at(b, "pedagang datang"), tEfek = D.at(b, "efek jaringan");
    // latar: pasar diredupkan
    ctx.save(); const z = lerp(1, 1.06, eio(l / b.dur)); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    U.pasar(ctx, t, { esTeh: true }); U.pengunjung(ctx, t, 8, { y: 1010, h: 230, seed: 3, v: 60 });
    U.juragan(ctx, 1500, U.FLOOR + 120, 300, { pose: l < tPlat ? "garuk" : "diam", t, dir: -1 });
    ctx.restore();
    const dim = ramp(l, tPlat - 0.6, 0.8);
    ctx.fillStyle = `rgba(14,20,58,${0.86 * dim})`; ctx.fillRect(0, 0, W, HH);
    if (dim <= 0.01) { D.post(c2 => U.judul(c2, "Kenapa begitu murah hati?", 960, 170, 64, pop(l, 0.4).a * (1 - dim), { sp: pop(l, 0.4).sp })); return; }
    ctx.save(); ctx.globalAlpha *= dim;
    const L = [560, 520], R = [1360, 520];
    // jumlah putaran: tiap putaran 2,2 dtk sesudah "Pembeli datang"
    const cyc = Math.max(0, (l - tBeli) / 2.2), nB = Math.min(19, 3 + Math.floor(cyc * 2 + (cyc > 0 ? 1 : 0)) * 2), nS = Math.min(19, 3 + Math.floor(cyc * 2 + 0.5) * 2);
    // panah melingkar atas (pedagang → pembeli) dan bawah (pembeli → pedagang)
    const arc = (dir, a, col) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineCap = "round";
      ctx.beginPath(); const cy = 520, rx = 400, ry = 230; const s0 = dir > 0 ? Math.PI + 0.35 : 0.35, s1 = dir > 0 ? TAU - 0.35 : Math.PI - 0.35;
      ctx.ellipse(960, cy, rx, ry, 0, s0, s1); ctx.stroke();
      const ex = 960 + rx * Math.cos(s1), ey = cy + ry * Math.sin(s1), ang = s1 + Math.PI / 2;
      ctx.fillStyle = col; ctx.translate(ex, ey); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-22, -22); ctx.lineTo(-22, 22); ctx.closePath(); ctx.fill(); ctx.restore();
      // titik bergerak
      for (let i = 0; i < 4; i++) { const u = ((t * 0.35 + i / 4) % 1), aa = lerp(s0, s1, u); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(960 + rx * Math.cos(aa), cy + ry * Math.sin(aa), 8, 0, TAU); ctx.fill(); ctx.restore(); } };
    arc(-1, ramp(l, tBeli, 0.6), P.amber);   // bawah: pembeli → pedagang (kanan ke kiri searah jam), dipakai sebagai "pembeli datang karena pedagang"
    arc(1, ramp(l, tPed, 0.6), P.teal);
    D.glow(ctx, L[0], L[1], 230, P.amber, 0.25); D.glow(ctx, R[0], R[1], 230, P.teal, 0.25);
    sisiIkon(ctx, L[0], L[1] + 10, nB, "beli", t, ramp(l, tPlat, 1.0));
    sisiIkon(ctx, R[0], R[1] + 10, nS, "jual", t, ramp(l, tPlat + 0.3, 1.0));
    ctx.restore();
    D.post(c2 => { c2.globalAlpha = dim;
      tag(c2, "Pembeli", L[0], 300, pop(l, tPlat + 0.2).a, { sp: pop(l, tPlat + 0.2).sp, col: P.amber });
      tag(c2, "Pedagang", R[0], 300, pop(l, tPlat + 0.5).a, { sp: pop(l, tPlat + 0.5).sp, col: P.teal });
      tag(c2, "banyak pedagang → pembeli datang", 960, 820, pop(l, tBeli).a * (1 - ramp(l, tEfek - 0.3, 0.3)), { sp: pop(l, tBeli).sp, col: P.teal, size: 44 });
      tag(c2, "banyak pembeli → pedagang datang", 960, 200, pop(l, tPed).a * (1 - ramp(l, tEfek - 0.3, 0.3)), { sp: pop(l, tPed).sp, col: P.amber, size: 44 });
      U.judul(c2, "efek jaringan (network effect)", 960, 830, 60, pop(l, tEfek).a, { sp: pop(l, tEfek).sp, col: P.violet });
    });
  };

  // ---------- b2_3 & b2_4: graf jalur chat ----------
  const GX = 700, GY = 500, GR = 330;
  function tabel(ctx, rows, x, y, l) {   // rows: [{a, b, t0, hl}]
    const rh = 92; D.panel(ctx, x - 20, y - 70, 560, 70 + rows.length * rh + 20, { r: 24 });
    txt(ctx, "orang", x + 20, y - 14, 44, { weight: 800, color: P.ink2 }); txt(ctx, "jalur", x + 330, y - 14, 44, { weight: 800, color: P.ink2 });
    rows.forEach((r, i) => { const a = ramp(l, r.t0, 0.35); if (a <= 0) return; const yy = y + 20 + i * rh + (1 - eout(a)) * 20;
      ctx.save(); ctx.globalAlpha *= a; if (r.hl) { ctx.fillStyle = D.hexA(P.amber, 0.18); RR(ctx, x - 6, yy - 6, 532, rh - 8, 16); ctx.fill(); }
      txt(ctx, r.a, x + 20, yy + 58, 56, { weight: 900 }); txt(ctx, "→", x + 210, yy + 56, 52, { weight: 900, color: P.amber }); txt(ctx, r.b, x + 330, yy + 58, 56, { weight: 900, color: r.q ? P.pink : P.teal }); ctx.restore(); });
  }
  S.b2_3 = function (ctx, b, l, t) {
    const tChat = D.at(b, "aplikasi chat"), tDua = D.at(b, "Dua orang"), tLima = D.at(b, "Lima orang"), tTebak = D.at(b, "tebak dulu"), tSeratus = D.at(b, "seratus orang");
    U.studio(ctx, t);
    // fase: 0 ikon chat, 1 dua titik, 2 lima titik, 3 seratus titik
    const ph = l < tDua - 0.2 ? 0 : l < tLima - 0.2 ? 1 : l < tSeratus - 0.3 ? 2 : 3;
    const swap = t0 => eout(clamp((l - t0) / 0.5));
    ctx.save();
    if (ph === 0) { const a = pop(l, tChat - 0.3); ctx.globalAlpha *= a.a; ctx.translate(GX, GY); ctx.scale(lerp(0.6, 1, a.sp), lerp(0.6, 1, a.sp));
      ctx.fillStyle = P.teal; RR(ctx, -170, -120, 340, 220, 50); ctx.fill(); ctx.beginPath(); ctx.moveTo(-90, 96); ctx.lineTo(-130, 160); ctx.lineTo(-30, 96); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; [-70, 0, 70].forEach((x, i) => { ctx.beginPath(); ctx.arc(x, -10 + Math.sin(t * 5 + i) * 6, 20, 0, TAU); ctx.fill(); }); }
    if (ph === 1) { const u = swap(tDua - 0.2), pts = U.ringPts(GX, GY, GR, 2, Math.PI); ctx.globalAlpha *= u; U.jaring(ctx, GX, GY, GR, 2, clamp((l - tDua - 0.4) / 0.6), { pts }); }
    if (ph === 2) { const u = swap(tLima - 0.2); ctx.globalAlpha *= u; const e = clamp((l - tLima - 0.5) / 2.4) * 10; U.jaring(ctx, GX, GY, GR, 5, e);
      D.post(c2 => tag(c2, U.rb(Math.floor(e)) + " jalur", GX, GY + GR + 70, 1, { col: P.teal, size: 52 })); }
    if (ph === 3) { const u = swap(tSeratus - 0.3); ctx.globalAlpha *= u; U.jaring(ctx, GX, GY, GR, 100, 0, { nodeR: 9 }); }
    ctx.restore();
    if (ph === 1) D.post(c2 => tag(c2, "1 jalur", GX, GY + 120, ramp(l, tDua + 0.9, 0.3), { col: P.teal, size: 52 }));
    D.post(c2 => {
      tabel(c2, [{ a: "2", b: "1", t0: tDua + 1.0 }, { a: "5", b: "10", t0: tLima + 2.9 }, { a: "100", b: "?", q: 1, t0: tSeratus, hl: 1 }], 1240, 400, l);
      U.judul(c2, "Tebak dulu!", 1500, 190, 72, pop(l, tTebak).a, { sp: pop(l, tTebak).sp, col: P.pink });
    });
    // Bip berpikir di kanan bawah
    KB.draw(ctx, 1700, 860, 160, { pose: l > tTebak ? "diam" : "kacaPembesar", mood: l > tTebak ? "think" : "wow", t, target: [GX, GY] });
  };
  S.b2_4 = function (ctx, b, l, t) {
    const tJaw = D.at(b, "empat ribu"), tOrang = D.at(b, "Jumlah orang"), tJalur = D.at(b, "jumlah jalur");
    U.studio(ctx, t);
    const e = 4950 * Math.pow(eio(clamp((l - 0.2) / Math.max(1, tJaw + 1.2))), 1.6);
    U.jaring(ctx, GX, GY, GR, 100, e, { nodeR: 9, lineA: 0.16, lw: 0.9 });
    D.glow(ctx, GX, GY, GR * (0.5 + 0.5 * e / 4950), P.teal, 0.25 * e / 4950);
    D.post(c2 => {
      tag(c2, U.rb(Math.floor(e)) + " jalur", GX, GY + GR + 70, 1, { col: P.teal, size: 56 });
      tabel(c2, [{ a: "2", b: "1", t0: -1 }, { a: "5", b: "10", t0: -1 }, { a: "10", b: "45", t0: 0.6 }, { a: "100", b: e >= 4949 ? "4.950" : "?", q: e < 4949, t0: -1, hl: 1 }], 1240, 260, l);
      tag(c2, "orang × 50", 1520, 790, pop(l, tOrang).a, { sp: pop(l, tOrang).sp, col: P.amber, size: 52 });
      tag(c2, "jalur × hampir 5.000", 1520, 880, pop(l, tJalur).a, { sp: pop(l, tJalur).sp, col: P.pink, size: 52 });
    });
  };

  // ---------- b2_5: dua pasar, orang pindah ----------
  S.b2_5 = function (ctx, b, l, t) {
    const tRugi = D.at(b, "rugi besar"), tSepi = D.at(b, "pasar yang sepi"), tTinggal = D.at(b, "ditinggalkan");
    // langit + tanah
    const sky = ctx.createLinearGradient(0, 0, 0, 800); sky.addColorStop(0, "#3E62C4"); sky.addColorStop(1, "#FFD3A0"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HH);
    U.addLight(ctx, 1600, 150, 340, "#FFE2A0", 0.5);
    ctx.fillStyle = "#D9B58C"; ctx.fillRect(0, 800, W, 280); ctx.fillStyle = "rgba(90,58,40,0.15)"; for (let x = 0; x < W; x += 120) ctx.fillRect(x, 800, 3, 280);
    const tutup = clamp((l - tTinggal) / 1.6);
    const sepi = clamp((l - 0.5) / Math.max(1, tTinggal - 0.5));
    U.pasarMini(ctx, 420, 800, 520, { nama: "Pasar Sebelah", col: "#5AA9FF", tutup, ramai: 1 - sepi, t, seed: 2, suram: sepi * 0.5 });
    U.pasarMini(ctx, 1420, 800, 760, { nama: "Pasar Juragan", col: "#D2694B", t, seed: 0 });
    // orang mengalir dari kiri ke kanan
    const n = 9; for (let i = 0; i < n; i++) { const u = ((l * 0.12 + i / n) % 1); const k = clamp(l / 0.8);
      const x = lerp(520, 1250, u), y = 900 + (i % 3) * 30; const a = Math.min(1, u * 6, (1 - u) * 6) * k;
      ctx.save(); ctx.globalAlpha *= a; U.orang(ctx, x, y, 150, { age: i % 4 === 1 ? "remaja" : "dewasa", hair: ["pendek", "hijab", "panjang", "botak"][i % 4], skin: (i * 3) % 5, top: U.AWN[i % 7], bottom: "#3B4785", outfit: "kaos", hijab: "#3FAE9E" }, { pose: "jalan", t: t + i, seed: i }); ctx.restore(); }
    // Juragan di depan pasarnya, dengan uang terbakar (rela rugi)
    U.juragan(ctx, 1780, 900, 260, { pose: "bagi", k: 0.5 + 0.5 * Math.sin(t * 2), t, dir: -1 });
    const fa = ramp(l, tRugi - 0.2, 0.4);
    if (fa > 0) { ctx.save(); ctx.globalAlpha *= fa; for (let i = 0; i < 4; i++) { const x = 1700 + i * 34, y = 980 - ((t * 60 + i * 30) % 110); uangTerbakar(ctx, x, y, 0.8, t + i); } ctx.restore(); }
    D.post(c2 => { tag(c2, "Rela rugi demi ramai", 1480, 560, pop(l, tRugi).a, { sp: pop(l, tRugi).sp, col: P.pink });
      tag(c2, "makin sepi", 420, 140, pop(l, tSepi).a, { sp: pop(l, tSepi).sp, col: P.blue }); });
  };
  function uangTerbakar(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * 0.3); ctx.scale(s, s);
    ctx.fillStyle = "#7FCF8E"; RR(ctx, -30, -16, 60, 32, 4); ctx.fill(); ctx.fillStyle = "#4FA866"; ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FF8A3D"; ctx.beginPath(); ctx.moveTo(-30, -16); ctx.quadraticCurveTo(-20, -50 - Math.sin(t * 9) * 8, -6, -16); ctx.quadraticCurveTo(6, -40, 14, -16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFD23F"; ctx.beginPath(); ctx.moveTo(-24, -16); ctx.quadraticCurveTo(-18, -34, -10, -16); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  U.uangTerbakar = uangTerbakar;

  // ---------- b2_6: es teh berlipat ----------
  S.b2_6 = function (ctx, b, l, t) {
    const tMahal = D.at(b, "mahal"), tSiapa = D.at(b, "Siapa");
    ctx.save(); U.pasar(ctx, t, { esTeh: true }); ctx.restore();
    ctx.fillStyle = "rgba(14,20,58,0.55)"; ctx.fillRect(0, 0, W, HH);
    // gelas es teh berbaris, terus bertambah
    const N = Math.floor(lerp(1, 120, eio(clamp((l - 0.2) / Math.max(1, tMahal + 0.5)))));
    for (let i = 0; i < N; i++) { const c = i % 20, r = Math.floor(i / 20); const x = 210 + c * 79 + (r % 2) * 20, y = 950 - r * 92; const k = clamp(spring(clamp((N - i) / 3), 10, 0.5));
      ctx.save(); ctx.translate(x, y); ctx.scale(k, k); U.esTeh(ctx, 0, 0, 62, { isi: 0.8 }); ctx.restore(); }
    KB.draw(ctx, 1700, 300, 150, { pose: "diam", mood: "wow", t, look: [-0.6, 0.4] });
    D.post(c2 => { tag(c2, "× ribuan orang", 960, 170, pop(l, 0.8).a * (1 - ramp(l, tSiapa - 0.3, 0.3)), { sp: pop(l, 0.8).sp, col: P.amber, size: 56 });
      tag(c2, "Biayanya mahal", 960, 270, pop(l, tMahal).a * (1 - ramp(l, tSiapa - 0.3, 0.3)), { sp: pop(l, tMahal).sp, col: P.pink, size: 52 });
      U.judul(c2, "Siapa yang membayar?", 960, 200, 84, pop(l, tSiapa).a, { sp: pop(l, tSiapa).sp, col: P.amber }); });
  };

  K.SCENES.d05_b2 = function (ctx, b, l, t, TL) { const f = S[b.id]; ctx.save(); U.napas(ctx, t); if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); ctx.restore(); };
  K.SCENES.d05_b2.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b2 = TL => [
    K.sfxAt(TL, "b2_1", null, 0.3, "riser", 0.5), K.sfxAt(TL, "b2_1", "Pasar Juragan", 0, "shimmer", 0.6), K.sfxAt(TL, "b2_1", "Masuknya", 0, "pop", 0.5),
    K.sfxAt(TL, "b2_1", "parkirnya", 0, "pop", 0.5), K.sfxAt(TL, "b2_1", "es teh", 0, "pop", 0.5), K.sfxAt(TL, "b2_1", "sewa", 0, "pop", 0.5),
    K.sfxAt(TL, "b2_2", "efek jaringan", 0, "shimmer", 0.6), K.sfxAt(TL, "b2_3", "tebak dulu", 0, "pop", 0.6),
    K.sfxAt(TL, "b2_4", "empat ribu", 0, "boom", 0.6), K.sfxAt(TL, "b2_5", "ditinggalkan", 0.2, "clack", 0.5), K.sfxAt(TL, "b2_6", "Siapa", 0, "whoosh", 0.5),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
