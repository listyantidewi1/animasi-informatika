/* D05 bab 8 — Bukankah perusahaan memang harus untung? (b8_1 … b8_5).
   b8_1 kantor Juragan dari dalam: tagihan listrik server, slip gaji, sewa gedung menumpuk, Juragan menggaruk kepala;
   b8_2 "wajar": harga naik karena biaya, iklan bisa adil; peta Indonesia titik-titik, paket dari desa di Sulawesi terbang ke Jawa, Sumatra, Papua;
   b8_3 dua warung nasi goreng: telur mengecil, antrean pindah, pemilik menepuk dahi; b8_4 warung sebelah distempel "DIBELI", papan diganti; teman-teman di warung yang sama;
   b8_5 kartu pertanyaan tanda sederhana, Bip menempelkannya di gapura Pasar Juragan. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KP = KIT.peta;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};

  // ---------- b8_1 ----------
  function kertas(ctx, x, y, w, h, rot, col, judul) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(-w / 2 + 6, -h / 2 + 8, w, h);
    ctx.fillStyle = "#FFFDF6"; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, w, h * 0.16); U.bars(ctx, -w * 0.4, -h * 0.2, w * 0.8, h * 0.05, 4, "rgba(40,50,100,0.3)", Math.round(x)); ctx.restore(); }
  S.b8_1 = function (ctx, b, l, t) {
    const tTunggu = D.at(b, "Tunggu dulu"), tWajar = D.at(b, "Bukankah wajar"), tServer = D.at(b, "Server"), tListrik = D.at(b, "listrik"), tGaji = D.at(b, "gaji");
    const z = lerp(1.0, 1.05, eio(l / b.dur)); ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960, -600);
    U.kantor(ctx, t);
    const piles = [[tServer, 760, P.blue, "server"], [tListrik, 960, "#FFB547", "listrik"], [tGaji, 1160, P.green, "gaji"]];
    piles.forEach(([t0, x, col], i) => { const n = Math.floor(clamp((l - t0 + 0.2) / 1.0) * 6); for (let k = 0; k < n; k++) kertas(ctx, x + Math.sin(k * 2.1 + i) * 14, 600 - k * 22, 170, 120, Math.sin(k * 1.7 + i) * 0.12, col); });
    U.juragan(ctx, 1500, 960, 400, { pose: l > tWajar + 0.5 ? "garuk" : "diam", k: 1, t, dir: -1 });
    ctx.restore();
    // Bip: "Tunggu dulu!" (tangan mengangkat)
    KB.draw(ctx, 300, 860, 200, { pose: l < tWajar + 1 ? "tunjuk" : "diam", target: [300, 500], mood: "think", t });
    D.post(c2 => {
      tag(c2, "Tunggu dulu!", 300, 640, pop(l, tTunggu).a * (1 - ramp(l, tServer, 0.3)), { sp: pop(l, tTunggu).sp, col: P.amber, size: 52 });
      U.judul(c2, "Bukankah wajar mencari untung?", 960, 150, 60, pop(l, tWajar).a, { sp: pop(l, tWajar).sp, col: P.teal });
      piles.forEach(([t0, x, col, s]) => tag(c2, s, x, 680 + 20, pop(l, t0).a, { sp: pop(l, t0).sp, col, size: 44 }));
    });
  };

  // ---------- b8_2: peta ----------
  function paket(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "#C98A4E"; RR(ctx, -s / 2, -s / 2, s, s * 0.85, 6); ctx.fill(); ctx.fillStyle = "#E9B07A"; ctx.fillRect(-s / 2, -s / 2, s, s * 0.2); ctx.fillStyle = "#8A5A3C"; ctx.fillRect(-s * 0.08, -s / 2, s * 0.16, s * 0.85); ctx.restore(); }
  S.b8_2 = function (ctx, b, l, t) {
    const tBenar = D.at(b, "Itu benar"), tHarga = D.at(b, "Harga bisa naik"), tIklan = D.at(b, "iklan bisa"), tPlat = D.at(b, "Platform besar"), tDesa = D.at(b, "pedagang kecil"), tSeluruh = D.at(b, "seluruh Indonesia");
    U.studio(ctx, t);
    const ma = ramp(l, tPlat - 0.6, 0.8);
    if (ma < 1) D.post(c2 => { c2.globalAlpha = 1 - ma;
      U.judul(c2, "Itu benar.", 960, 220, 72, pop(l, tBenar).a, { sp: pop(l, tBenar).sp, col: P.green });
      tag(c2, "tidak semua yang menyebalkan = pembusukan", 960, 380, pop(l, tBenar + 1.2).a, { col: P.ink2, size: 48 });
      tag(c2, "✓ harga naik karena biaya naik", 960, 540, pop(l, tHarga).a, { sp: pop(l, tHarga).sp, col: P.green, size: 52 });
      tag(c2, "✓ iklan bisa membiayai layanan gratis", 960, 660, pop(l, tIklan).a, { sp: pop(l, tIklan).sp, col: P.green, size: 52 }); });
    if (ma > 0) { ctx.save(); ctx.globalAlpha *= ma;
      const pj = KP.indonesia(ctx, 960, 560, 1700, { t, reveal: clamp((l - tPlat + 0.6) / 1.2) });
      const A = KP.ANCHORS, src = pj(119.9, -3.4), dst = [pj(...A.jakarta), pj(...A.medan), pj(...A.jayapura), pj(...A.surabaya)];
      // desa asal
      const da = ramp(l, tDesa - 0.2, 0.4); if (da > 0) { D.glow(ctx, src[0], src[1], 90, P.amber, 0.6 * da); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(src[0], src[1], 16, 0, TAU); ctx.fill(); }
      dst.forEach((d, i) => { const u = clamp((l - tDesa - 0.6 - i * 0.5) / 1.6); if (u <= 0) return; const mx = (src[0] + d[0]) / 2, my = Math.min(src[1], d[1]) - 200;
        ctx.strokeStyle = D.hexA(P.amber, 0.7); ctx.lineWidth = 5; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(...src);
        for (let k = 1; k <= 20; k++) { const v = k / 20 * u; ctx.lineTo((1 - v) * (1 - v) * src[0] + 2 * v * (1 - v) * mx + v * v * d[0], (1 - v) * (1 - v) * src[1] + 2 * v * (1 - v) * my + v * v * d[1]); } ctx.stroke(); ctx.setLineDash([]);
        const v = eio(u); paket(ctx, (1 - v) * (1 - v) * src[0] + 2 * v * (1 - v) * mx + v * v * d[0], (1 - v) * (1 - v) * src[1] + 2 * v * (1 - v) * my + v * v * d[1], 46, Math.sin(u * 6) * 0.2);
        if (u >= 1) { D.glow(ctx, d[0], d[1], 60, P.green, 0.6); ctx.fillStyle = P.green; ctx.beginPath(); ctx.arc(d[0], d[1], 12, 0, TAU); ctx.fill(); } });
      ctx.restore();
      D.post(c2 => { c2.globalAlpha = ma; tag(c2, "manfaat nyata", 960, 140, pop(l, tPlat).a, { sp: pop(l, tPlat).sp, col: P.green, size: 56 });
        tag(c2, "pedagang kecil di desa, Sulawesi", 1180, 860, pop(l, tDesa).a, { sp: pop(l, tDesa).sp, col: P.amber, size: 44 });
        tag(c2, "→ seluruh Indonesia", 600, 860, pop(l, tSeluruh).a, { sp: pop(l, tSeluruh).sp, col: P.green, size: 44 }); }); }
  };

  // ---------- warung nasi goreng ----------
  function warung(ctx, x, y, s, o, t) {   // (x,y) = tengah bawah; s lebar
    const col = o.col || "#FF6F61"; ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#8A5A3C"; ctx.fillRect(-s / 2 + 10, -s * 0.9, 14, s * 0.9); ctx.fillRect(s / 2 - 24, -s * 0.9, 14, s * 0.9);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-s * 0.56, -s * 0.78); ctx.lineTo(s * 0.56, -s * 0.78); ctx.lineTo(s * 0.5, -s * 0.94); ctx.lineTo(-s * 0.5, -s * 0.94); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFF3DE"; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(-s * 0.56 + (k + 0.5) * s * 1.12 / 6, -s * 0.78, s * 1.12 / 12, 0, Math.PI); ctx.fill(); }
    ctx.fillStyle = "#9A6A44"; ctx.fillRect(-s / 2, -s * 0.36, s, s * 0.36); ctx.fillStyle = "#B88456"; ctx.fillRect(-s / 2, -s * 0.36, s, 12);
    // wajan
    ctx.fillStyle = "#2A2350"; ctx.beginPath(); ctx.ellipse(-s * 0.25, -s * 0.38, s * 0.15, s * 0.04, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; for (let k = 0; k < 3; k++) { const ph = (t * 0.6 + k / 3) % 1; ctx.beginPath(); ctx.arc(-s * 0.25 + Math.sin(ph * 6 + k) * 10, -s * 0.45 - ph * 90, 10 + ph * 10, 0, TAU); ctx.globalAlpha = 1 - ph; ctx.fill(); ctx.globalAlpha = 1; }
    // piring nasi goreng + telur
    const px = s * 0.2, py = -s * 0.4; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(px, py, s * 0.16, s * 0.05, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#D9893A"; ctx.beginPath(); ctx.ellipse(px, py - s * 0.03, s * 0.11, s * 0.05, 0, Math.PI, 0); ctx.fill();
    const e = o.telur == null ? 1 : o.telur; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(px + s * 0.02, py - s * 0.07, s * 0.08 * e, s * 0.03 * e, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFC94D"; ctx.beginPath(); ctx.arc(px + s * 0.02, py - s * 0.075, s * 0.025 * e, 0, TAU); ctx.fill();
    ctx.restore();
    // papan nama
    if (o.nama) { ctx.save(); const ny = y - s * 1.06; ctx.font = `900 48px ${FONT}`; const lw = ctx.measureText(o.nama).width + 50; ctx.fillStyle = o.papanCol || "#FFF6E6"; RR(ctx, x - lw / 2, ny - 46, lw, 76, 14); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
      txt(ctx, o.nama, x, ny + 8, 48, { align: "center", weight: 900, color: "#2A2350" }); ctx.restore(); }
  }
  function latarSekolah(ctx, t) {
    const sky = ctx.createLinearGradient(0, 0, 0, 760); sky.addColorStop(0, "#5A86D8"); sky.addColorStop(1, "#FFE0B8"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HH);
    ctx.fillStyle = "#E9D2B0"; ctx.fillRect(0, 300, W, 460); ctx.fillStyle = "#C7413B"; ctx.fillRect(0, 270, W, 40);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = "#7FB8F0"; ctx.fillRect(80 + i * 210, 370, 120, 140); ctx.fillStyle = "#FFF6E6"; ctx.fillRect(138 + i * 210, 370, 4, 140); }
    ctx.fillStyle = "#B9B9C8"; ctx.fillRect(0, 760, W, 320); ctx.fillStyle = "#A2A2B4"; for (let x = 0; x < W; x += 160) ctx.fillRect(x, 760, 4, 320);
  }
  const PEMBELI = i => ({ age: i % 3 === 0 ? "remaja" : "dewasa", hair: ["pendek", "hijab", "kuncir", "pendek", "hijab", "botak"][i % 6], skin: (i * 2 + 1) % 6, top: ["#FFFFFF", P.blue, P.pink, P.green, P.amber, P.violet][i % 6], bottom: i % 3 === 0 ? "#3B4785" : "#5A5A6E", outfit: i % 3 === 0 ? "kemeja" : "kaos", hijab: ["#3FAE9E", "#E0607E", "#8E6CE0"][i % 3] });
  S.b8_3 = function (ctx, b, l, t) {
    const tBeda = D.at(b, "bagaimana membedakan"), tWarung = D.at(b, "warung nasi goreng"), tTelur = D.at(b, "mengurangi telur"), tPindah = D.at(b, "pindah ke warung"), tSehat = D.at(b, "pasar yang sehat");
    const wa = ramp(l, tWarung - 0.4, 0.6);
    if (wa < 1) { U.studio(ctx, t); }
    if (wa > 0) { ctx.save(); ctx.globalAlpha *= wa; latarSekolah(ctx, t);
      const telur = lerp(1, 0.45, eio(clamp((l - tTelur) / 1.0))), mv = eio(clamp((l - tPindah + 0.3) / 2.0));
      U.orang(ctx, 600, 800, 400, { age: "dewasa", hair: "pendek", skin: 3, top: "#FFFFFF", outfit: "kaos", bottom: "#3B4785" }, { pose: l > tSehat - 0.5 ? "garuk" : "berdiri", face: l > tSehat - 0.5 ? "panik" : "netral", t });
      U.orang(ctx, 1400, 800, 380, { age: "dewasa", hair: "hijab", hijab: "#3FAE9E", skin: 2, top: "#FFD38A", outfit: "kaos", bottom: "#3B4785" }, { pose: "berdiri", face: l > tPindah ? "senang" : "netral", t, flip: true });
      warung(ctx, 560, 820, 520, { nama: "Nasgor Pak Ali", col: "#FF6F61", telur }, t);
      warung(ctx, 1360, 820, 520, { nama: "Nasgor Bu Ina", col: P.teal, telur: 1 }, t);
      for (let i = 0; i < 5; i++) { const x0 = 400 + i * 90, x1 = 1220 + i * 90, k = clamp(mv * 1.6 - i * 0.15); const x = lerp(x0, x1, eio(k));
        U.orang(ctx, x, 990 + (i % 2) * 20, 250, PEMBELI(i), { pose: k > 0 && k < 1 ? "jalan" : "berdiri", t: t + i, seed: i, flip: k > 0 && k < 1 ? false : i % 2 === 0, face: k >= 1 ? "senang" : "netral" }); }
      ctx.restore(); }
    D.post(c2 => {
      U.judul(c2, "Wajar atau membusuk?", 960, 400, 72, pop(l, tBeda).a * (1 - wa), { sp: pop(l, tBeda).sp, col: P.amber });
      tag(c2, "telur dikurangi, harga tetap", 560, 150, pop(l, tTelur).a * (1 - ramp(l, tSehat - 0.3, 0.3)), { sp: pop(l, tTelur).sp, col: P.pink, size: 44 });
      tag(c2, "pembeli pindah", 1360, 150, pop(l, tPindah).a * (1 - ramp(l, tSehat - 0.3, 0.3)), { sp: pop(l, tPindah).sp, col: P.green, size: 44 });
      U.judul(c2, "pasar sehat: memperburuk = merugikan diri", 960, 150, 52, pop(l, tSehat).a, { sp: pop(l, tSehat).sp, col: P.teal });
    });
  };
  S.b8_4 = function (ctx, b, l, t) {
    const tTidak = D.at(b, "tidak bisa pindah"), tDibeli = D.at(b, "sudah dibeli"), tTeman = D.at(b, "semua temanmu");
    latarSekolah(ctx, t);
    const ganti = clamp((l - tDibeli - 0.6) / 0.6);
    U.orang(ctx, 600, 800, 400, { age: "dewasa", hair: "pendek", skin: 3, top: "#FFFFFF", outfit: "kaos", bottom: "#3B4785" }, { pose: "berdiri", face: "senang", t });
    warung(ctx, 560, 820, 520, { nama: "Nasgor Pak Ali", col: "#FF6F61", telur: 0.45 }, t);
    warung(ctx, 1360, 820, 520, { nama: ganti > 0.5 ? "Nasgor Pak Ali" : "Nasgor Bu Ina", col: ganti > 0.5 ? "#FF6F61" : P.teal, telur: ganti > 0.5 ? 0.45 : 1 }, t);
    // teman-teman berkumpul di warung yang sama
    const ta = ramp(l, tTeman - 0.2, 0.8);
    for (let i = 0; i < 6; i++) { const k = clamp(ta * 1.5 - i * 0.12); if (k <= 0) continue; ctx.save(); ctx.globalAlpha *= clamp(k * 2); U.orang(ctx, 300 + i * 100 + (1 - eout(k)) * -200, 990 + (i % 2) * 20, 250, PEMBELI(i + 2), { pose: "berdiri", face: "senang", t: t + i, seed: i + 4, flip: i > 2 }); ctx.restore(); }
    U.orang(ctx, 1560, 1000, 270, U.RAKA, { pose: "garuk", face: "sedih", t, flip: true });
    D.post(c2 => {
      const sa = pop(l, tDibeli); if (sa.a > 0) { c2.save(); c2.globalAlpha = sa.a * (ganti > 0.5 ? 0.85 : 1); c2.translate(1360, 520); c2.rotate(-0.18); const k = lerp(2.2, 1, clamp(sa.sp)); c2.scale(k, k);
        c2.strokeStyle = P.red; c2.lineWidth = 10; RR(c2, -170, -60, 340, 120, 14); c2.stroke(); txt(c2, "DIBELI", 0, 26, 76, { align: "center", weight: 900, color: P.red }); c2.restore(); }
      tag(c2, "tidak bisa pindah", 960, 150, pop(l, tTidak).a, { sp: pop(l, tTidak).sp, col: P.pink, size: 56 });
      tag(c2, "semua teman di sini", 420, 690, pop(l, tTeman).a, { sp: pop(l, tTeman).sp, col: P.amber, size: 44 });
    });
  };

  // ---------- b8_5: kartu tanda ----------
  S.b8_5 = function (ctx, b, l, t) {
    const tTanda = D.at(b, "tanda sederhananya"), tApa = D.at(b, "apakah aplikasi"), tYa = D.at(b, "Kalau jawabannya");
    const tempel = eio(clamp((l - tYa + 0.4) / 1.0));
    const c = D.path([[0, 960, 560, 1.0], [tYa - 0.4, 960, 560, 1.0], [tYa + 0.8, 960, 520, 0.9]], l);
    ctx.save(); U.camT(ctx, c); U.pasar(ctx, t, { esTeh: false, suram: 0.35 }); U.palang(ctx, t, 1, 1); ctx.restore();
    ctx.fillStyle = `rgba(14,20,58,${0.6 * (1 - tempel)})`; ctx.fillRect(0, 0, W, HH);
    // kartu besar: dari tengah layar menempel ke gapura
    const ca = pop(l, tApa - 0.4); const [gx, gy] = U.toS(c, 960, 520);
    const cx = lerp(960, gx, tempel), cy = lerp(480, gy, tempel), sc = lerp(1, 0.45, tempel);
    D.post(c2 => {
      U.judul(c2, "Inilah tanda sederhananya", 960, 160, 60, pop(l, tTanda).a * (1 - ramp(l, tApa - 0.6, 0.3)), { sp: pop(l, tTanda).sp, col: P.amber });
      if (ca.a > 0) { c2.save(); c2.globalAlpha = ca.a; c2.translate(cx, cy); c2.rotate(tempel * -0.04); const k = sc * lerp(0.85, 1, ca.sp); c2.scale(k, k);
        c2.fillStyle = "rgba(10,10,30,0.35)"; RR(c2, -760 + 10, -230 + 14, 1520, 460, 36); c2.fill();
        c2.fillStyle = "#FFF6E6"; RR(c2, -760, -230, 1520, 460, 36); c2.fill(); c2.strokeStyle = P.amber; c2.lineWidth = 10; c2.stroke();
        txt(c2, "Apakah aplikasi ini makin buruk,", 0, -70, 80, { align: "center", weight: 900, color: "#2A2350" });
        txt(c2, "tetapi aku tetap merasa", 0, 40, 80, { align: "center", weight: 900, color: "#2A2350" });
        txt(c2, "tidak bisa pergi?", 0, 150, 88, { align: "center", weight: 900, color: "#C7413B" });
        if (tempel > 0.9) { c2.fillStyle = "#C9CFEA"; [[-720, -200], [720, -200]].forEach(([x, y]) => { c2.beginPath(); c2.arc(x, y, 22, 0, TAU); c2.fill(); }); }
        c2.restore(); }
      tag(c2, "ya → pembusukan platform", 960, 880, pop(l, tYa + 0.6).a, { sp: pop(l, tYa + 0.6).sp, col: P.pink, size: 56 });
    });
    if (tempel > 0) KB.draw(ctx, lerp(1500, gx + 420, tempel), lerp(860, gy + 200, tempel), 180, { pose: "pegang", t, mood: "happy", look: [-0.5, 0] });
    else if (ca.a > 0) KB.draw(ctx, 1640, 880, 180, { pose: "diam", t, mood: "think", look: [-0.6, -0.3] });
  };

  K.SCENES.d05_b8 = function (ctx, b, l, t, TL) { const f = S[b.id]; ctx.save(); U.napas(ctx, t); if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); ctx.restore(); };
  K.SCENES.d05_b8.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b8 = TL => [
    K.sfxAt(TL, "b8_1", "Tunggu dulu", 0, "clack", 0.5), K.sfxAt(TL, "b8_1", "Server", 0, "pop", 0.3), K.sfxAt(TL, "b8_1", "gaji", 0, "pop", 0.3),
    K.sfxAt(TL, "b8_2", "Platform besar", -0.6, "whoosh", 0.4), K.sfxAt(TL, "b8_2", "seluruh Indonesia", 0, "shimmer", 0.5),
    K.sfxAt(TL, "b8_3", "warung nasi goreng", -0.4, "whoosh", 0.4), K.sfxAt(TL, "b8_3", "mengurangi telur", 0.3, "pop", 0.4),
    K.sfxAt(TL, "b8_4", "sudah dibeli", 0, "boom", 0.6), K.sfxAt(TL, "b8_5", "apakah aplikasi", -0.4, "shimmer", 0.6), K.sfxAt(TL, "b8_5", "Kalau jawabannya", 0.6, "clack", 0.6),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
