/* D05 bab 4 — Pintu yang diam-diam terkunci (b4_1 … b4_5).
   b4_1 Raka (rekaan) di gerbang keluar: di dalam gelembung chat "Grup Kelas", "Keluarga", "Futsal"; di luar aplikasi lain yang sepi;
   b4_2 Bu Sari (rekaan, penjual kue) mencoba mengangkat lapak, papan ulasan/pengikut/riwayat menempel di dinding pasar;
   b4_3 timbangan "rasa kesal" vs "biaya pindah"; b4_4 jaring garis bab 2 mengikat kaki pengunjung seperti benang; b4_5 palang + gembok, "Tahap 2". */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KY = KIT.layar;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};

  // ---------- b4_1 ----------
  function gelembung(ctx, x, y, s, col, a, label, t, seed) {
    if (a <= 0.01) return; const bob = Math.sin(t * 1.4 + seed) * 8; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + bob); const k = lerp(0.6, 1, clamp(spring(a * 1.3, 10, 0.5))); ctx.scale(k, k);
    let w = s * 1.6; if (label) { ctx.font = `900 46px ${FONT}`; w = Math.max(w, ctx.measureText(label).width + 60); }
    ctx.fillStyle = col; RR(ctx, -w / 2, -s * 0.5, w, s, s * 0.35); ctx.fill(); ctx.beginPath(); ctx.moveTo(-w * 0.2, s * 0.45); ctx.lineTo(-w * 0.32, s * 0.8); ctx.lineTo(-w * 0.05, s * 0.45); ctx.fill();
    if (label) txt(ctx, label, 0, 16, 46, { align: "center", weight: 900, color: "#FFFFFF" });
    else { ctx.fillStyle = "rgba(255,255,255,0.85)"; [-1, 0, 1].forEach(i => { ctx.beginPath(); ctx.arc(i * s * 0.32, 0, s * 0.1, 0, TAU); ctx.fill(); }); }
    ctx.restore();
  }
  const BUB = [[260, 230, "Grup Kelas", P.blue], [640, 170, "Keluarga", P.pink], [430, 420, "Futsal", P.green], [150, 560, null, P.violet], [800, 380, null, P.teal], [700, 600, null, P.amber], [300, 760, null, P.blue], [880, 200, null, P.green]];
  S.b4_1 = function (ctx, b, l, t) {
    const tIklan = D.at(b, "iklannya makin banyak"), tGrup = D.at(b, "grup kelas"), tKel = D.at(b, "grup keluarga"), tTeman = D.at(b, "semua temanmu"), tSendiri = D.at(b, "pindah sendirian"), tSiapa = D.at(b, "siapa pun");
    // kiri: di dalam aplikasi chat (hangat, ramai)
    const gi = ctx.createLinearGradient(0, 0, 0, HH); gi.addColorStop(0, "#4B3A8A"); gi.addColorStop(1, "#7A5A9A"); ctx.fillStyle = gi; ctx.fillRect(0, 0, 1100, HH);
    // kanan: di luar, aplikasi lain sepi
    const go = ctx.createLinearGradient(0, 0, 0, HH); go.addColorStop(0, "#1E2650"); go.addColorStop(1, "#38406A"); ctx.fillStyle = go; ctx.fillRect(1100, 0, 820, HH);
    ctx.fillStyle = "#4A4670"; ctx.fillRect(1100, 860, 820, 220); ctx.fillStyle = "#6E5A7A"; ctx.fillRect(0, 860, 1100, 220);
    U.pasarMini(ctx, 1600, 860, 380, { nama: "Aplikasi lain", col: "#7A86B8", ramai: 0, t, suram: 0.5, fs: 44 });
    // daun kering berguling
    const tw = ((t * 60) % 900); ctx.strokeStyle = "rgba(200,190,160,0.6)"; ctx.lineWidth = 3; ctx.save(); ctx.translate(1180 + tw * 0.8, 900); ctx.rotate(t * 3); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.moveTo(0, -22); ctx.lineTo(0, 22); ctx.stroke(); ctx.restore();
    // dinding + gerbang
    ctx.fillStyle = "#2E7F8A"; [[1000, 1050], [1250, 1300]].forEach(([a, b2]) => { ctx.fillRect(a, 330, b2 - a, 530); ctx.fillStyle = "#235F68"; ctx.fillRect(b2 - 14, 330, 14, 530); ctx.fillStyle = "#2E7F8A"; });
    ctx.fillStyle = "#C7413B"; RR(ctx, 960, 270, 380, 80, 12); ctx.fill(); ctx.fillStyle = "#FFB547"; ctx.fillRect(960, 346, 380, 10);
    txt(ctx, "KELUAR", 1150, 328, 48, { align: "center", weight: 900, color: "#FFF6E6" });
    // spanduk iklan di dalam
    const ia = clamp((l - tIklan + 0.2) / 1.0); if (ia > 0) U.spanduk(ctx, t, ia * 0.45, { list: [{ x: 520, y: 80, w: 300, h: 80, s: "IKLAN", c: "#FF5A5F" }, { x: 900, y: 520, w: 260, h: 76, s: "PROMO!", c: "#FFB547" }, { x: 160, y: 380, w: 240, h: 76, s: "IKLAN", c: "#9584FF" }, { x: 700, y: 760, w: 240, h: 76, s: "IKLAN", c: "#5AA9FF" }] });
    // gelembung chat
    const fadeOut = ramp(l, tSiapa - 0.2, 0.8);
    BUB.forEach(([x, y, lab, col], i) => { const t0 = i === 0 ? tGrup : i === 1 ? tKel : i === 2 ? tKel + 0.5 : tTeman + (i - 3) * 0.15; gelembung(ctx, x, y, 110, col, ramp(l, t0 - 0.2, 0.3) * lerp(1, 0.4, fadeOut), lab, t, i); });
    // Raka berjalan ke luar sendirian
    const go2 = eio(clamp((l - tSendiri) / 1.8)), rx = lerp(900, 1420, go2);
    U.orang(ctx, rx, 900, 380, U.RAKA, { pose: go2 > 0 && go2 < 1 ? "jalan" : (l > tSiapa ? "garuk" : "pegangHP"), t, face: l > tSiapa ? "sedih" : l > tIklan ? "bingung" : "netral", flip: l > tSiapa });
    D.post(c2 => {
      tag(c2, "Raka (tokoh rekaan)", 1160, 120, pop(l, 0.5).a * (1 - ramp(l, tSendiri, 0.4)), { col: P.blue, size: 44 });
      tag(c2, "sendirian = tidak ada teman", 1500, 160, pop(l, tSiapa).a, { sp: pop(l, tSiapa).sp, col: P.pink, size: 48 });
    });
  };

  // ---------- b4_2: Bu Sari ----------
  S.b4_2 = function (ctx, b, l, t) {
    const tUlas = D.at(b, "Ulasan bintang"), tIkut = D.at(b, "ribuan pengikut"), tRiw = D.at(b, "riwayat penjualan"), tTidak = D.at(b, "tidak bisa dibawa");
    const c = { x: 960, y: 560, z: 1.0 };
    U.pasar(ctx, t, { stalls: false, gate: false, label: false });
    // dinding papan pencapaian
    D.panel(ctx, 980, 230, 780, 500, { r: 22, fill: "#FFF6E6", stroke: "#8A5A3C", lw: 8 });
    const items = [["★★★★★", "1.240 ulasan", tUlas, "#E9A23B"], ["3.500", "pengikut", tIkut, "#5AA9FF"], ["8 tahun", "riwayat jualan", tRiw, "#5BD68A"]];
    // lapak Bu Sari: berusaha diangkat, papan tetap
    const tries = l > tUlas - 1 ? Math.max(0, Math.sin((l - tUlas + 1) * 3.2)) : 0, lift = tries * 26;
    ctx.save(); ctx.translate(0, -lift); ctx.rotate(Math.sin(l * 6) * 0.01 * tries);
    U.lapak(ctx, 520, U.FLOOR + 10, 360, { col: U.AWN[0], barang: "kue", label: "KUE BU SARI", t, seed: 4 }); ctx.restore();
    U.orang(ctx, 760, U.FLOOR + 120, 400, U.SARI, { pose: tries > 0.3 ? "panik" : "berdiri", face: l > tTidak ? "sedih" : tries > 0.3 ? "panik" : "senang", t, flip: true, keringat: tries > 0.5 });
    // tali putus-putus dari papan ke lapak yang menegang
    items.forEach(([big, small, t0, col], i) => { const a = pop(l, t0); if (a.a <= 0) return; const y = 320 + i * 140;
      ctx.save(); ctx.globalAlpha *= a.a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(1050, y + 10, 16, 0, TAU); ctx.fill();
      // paku
      ctx.fillStyle = "#8C93B8"; ctx.beginPath(); ctx.arc(1050, y + 10, 6, 0, TAU); ctx.fill(); ctx.restore(); });
    D.post(c2 => {
      items.forEach(([big, small, t0, col], i) => { const a = pop(l, t0); if (a.a <= 0) return; const y = 320 + i * 140; c2.save(); c2.globalAlpha = a.a; const k = lerp(0.85, 1, a.sp);
        c2.translate(1090, y); c2.scale(k, k); txt(c2, big, 0, 30, 60, { weight: 900, color: col === "#E9A23B" ? "#E9A23B" : "#2A2350" }); txt(c2, small, i === 0 ? 350 : 290, 28, 48, { weight: 800, color: "#5C6390" }); c2.restore(); });
      tag(c2, "Bu Sari (tokoh rekaan)", 520, 150, pop(l, 0.4).a * (1 - ramp(l, tTidak - 0.5, 0.3)), { col: P.pink, size: 44 });
      U.judul(c2, "Tidak bisa dibawa ke pasar lain", 960, 150, 56, pop(l, tTidak).a, { sp: pop(l, tTidak).sp, col: P.pink });
    });
  };

  // ---------- b4_3: timbangan ----------
  function timbangan(ctx, x, y, s, tilt, t, kiri, kanan) {
    const px = x, py = y - s * 0.05, ends = [-1, 1].map(d => [px + Math.cos(tilt) * d * s * 0.58, py + Math.sin(tilt) * d * s * 0.58]);
    ctx.fillStyle = "#6E4630"; RR(ctx, x - s * 0.22, y + s * 0.62, s * 0.44, s * 0.08, 10); ctx.fill(); ctx.fillStyle = "#8A5A3C"; ctx.fillRect(x - s * 0.03, py, s * 0.06, s * 0.68);
    ctx.save(); ctx.translate(px, py); ctx.rotate(tilt); ctx.fillStyle = "#A8714C"; RR(ctx, -s * 0.62, -s * 0.025, s * 1.24, s * 0.05, 8); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#FFC94D"; ctx.beginPath(); ctx.arc(px, py, s * 0.05, 0, TAU); ctx.fill();
    const pan = (ex, ey, fn) => { ctx.strokeStyle = "#8C93B8"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - s * 0.2, ey + s * 0.3); ctx.moveTo(ex, ey); ctx.lineTo(ex + s * 0.2, ey + s * 0.3); ctx.stroke();
      ctx.fillStyle = "#C9CFEA"; ctx.beginPath(); ctx.ellipse(ex, ey + s * 0.31, s * 0.25, s * 0.05, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = "#E6EAF8"; ctx.beginPath(); ctx.ellipse(ex, ey + s * 0.3, s * 0.25, s * 0.035, 0, 0, TAU); ctx.fill(); fn(ex, ey + s * 0.29); };
    pan(ends[0][0], ends[0][1], kiri); pan(ends[1][0], ends[1][1], kanan);
    return { kiri: [ends[0][0], ends[0][1] + s * 0.3], kanan: [ends[1][0], ends[1][1] + s * 0.3] };
  }
  function awanKesal(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y - s * 0.4 + Math.sin(t * 3) * 3); ctx.fillStyle = "#FF6F61"; ctx.beginPath(); ctx.arc(-s * 0.25, 0, s * 0.26, 0, TAU); ctx.arc(s * 0.2, -s * 0.05, s * 0.3, 0, TAU); ctx.arc(0, -s * 0.22, s * 0.25, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#2A2350"; ctx.lineWidth = s * 0.05; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.18); ctx.lineTo(-s * 0.06, -s * 0.1); ctx.moveTo(s * 0.2, -s * 0.18); ctx.lineTo(s * 0.06, -s * 0.1); ctx.moveTo(-s * 0.12, s * 0.08); ctx.quadraticCurveTo(0, -s * 0.02, s * 0.12, s * 0.08); ctx.stroke(); ctx.restore(); }
  function tumpukan(ctx, x, y, s, n, t) {   // isi biaya pindah: teman, ulasan, foto, riwayat
    const ic = [["teman", P.blue], ["ulasan", "#E9A23B"], ["foto", P.pink], ["riwayat", P.green]];
    for (let i = 0; i < Math.min(4, n); i++) { const k = clamp(n - i); const bx = x + (i % 2 ? 1 : -1) * s * 0.11, by = y - (Math.floor(i / 2) * s * 0.2) - s * 0.1;
      ctx.save(); ctx.translate(bx, by - (1 - eout(k)) * 200); ctx.globalAlpha *= clamp(k * 2); ctx.fillStyle = ic[i][1]; RR(ctx, -s * 0.1, -s * 0.09, s * 0.2, s * 0.18, 12); ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      if (i === 0) { ctx.beginPath(); ctx.arc(-s * 0.03, -s * 0.03, s * 0.03, 0, TAU); ctx.arc(s * 0.035, -s * 0.03, s * 0.03, 0, TAU); ctx.fill(); ctx.fillRect(-s * 0.07, s * 0.01, s * 0.14, s * 0.04); }
      if (i === 1) txt(ctx, "★", 0, s * 0.045, s * 0.13, { align: "center", weight: 900, color: "#FFFFFF" });
      if (i === 2) { ctx.fillRect(-s * 0.06, -s * 0.045, s * 0.12, s * 0.09); ctx.fillStyle = ic[i][1]; ctx.beginPath(); ctx.arc(0, 0, s * 0.025, 0, TAU); ctx.fill(); }
      if (i === 3) { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, s * 0.05, 0, TAU); ctx.moveTo(0, 0); ctx.lineTo(0, -s * 0.035); ctx.moveTo(0, 0); ctx.lineTo(s * 0.025, 0); ctx.stroke(); }
      ctx.restore(); }
  }
  S.b4_3 = function (ctx, b, l, t) {
    const tBiaya = D.at(b, "biaya pindah"), tSem = D.at(b, "Semakin mahal"), tBebas = D.at(b, "semakin bebas");
    U.studio(ctx, t);
    const n = clamp((l - tBiaya + 0.4) / 2.0) * 4;
    const tilt = lerp(-0.1, 0.22, eio(clamp(n / 4))) + Math.sin(t * 2) * 0.01;
    const A = timbangan(ctx, 900, 420, 680, tilt, t, (x, y) => awanKesal(ctx, x, y, 150, t), (x, y) => tumpukan(ctx, x, y, 680, n, t));
    if (l > tBebas) KB.draw(ctx, 1700, 560, 160, { pose: "diam", mood: "sad", t });
    D.post(c2 => {
      tag(c2, "rasa kesal", A.kiri[0], A.kiri[1] + 90, pop(l, 0.4).a, { col: "#FF6F61", size: 48 });
      tag(c2, "biaya pindah", A.kanan[0], A.kanan[1] + 90, pop(l, tBiaya).a, { sp: pop(l, tBiaya).sp, col: P.amber, size: 48 });
      U.judul(c2, "biaya pindah (switching cost)", 960, 150, 64, pop(l, tBiaya + 0.4).a, { sp: pop(l, tBiaya + 0.4).sp, col: P.amber });
      tag(c2, "makin mahal → makin bebas memperburuk", 960, 260, pop(l, tBebas).a, { sp: pop(l, tBebas).sp, col: P.pink, size: 44 });
    });
  };

  // ---------- b4_4: jaring mengikat kaki ----------
  S.b4_4 = function (ctx, b, l, t) {
    const tHadiah = D.at(b, "hadiah"), tSisi = D.at(b, "sisi lain"), tDatang = D.at(b, "membuatmu datang"), tPergi = D.at(b, "sulit pergi");
    const c = D.path([[0, 960, 560, 0.95], [b.dur, 960, 700, 1.15]], l);
    ctx.save(); U.camT(ctx, c);
    U.pasar(ctx, t, { esTeh: true, suram: 0.2 * ramp(l, tSisi, 2) });
    // pengunjung berdiri (tidak berjalan)
    const feet = [];
    const xs = [130, 360, 560, 780, 1000, 1220, 1430, 1650, 1850], ys = [1000, 960, 1010, 970, 1000, 965, 1010, 975, 1000];
    xs.forEach((x, i) => { const A = U.orang(ctx, x, ys[i], 230, { age: i % 4 === 1 ? "remaja" : "dewasa", hair: ["pendek", "hijab", "panjang", "botak", "kuncir", "hijab", "pendek", "uban", "hijab"][i], skin: (i * 2) % 6, top: U.AWN[i % 7], bottom: "#3B4785", outfit: i % 3 ? "kaos" : "kemeja", hijab: ["#3FAE9E", "#E0607E", "#8E6CE0"][i % 3] },
      { pose: l > tPergi ? "garuk" : "berdiri", face: l > tSisi ? "bingung" : "senang", t, seed: i, flip: i % 2 === 1 }); feet.push([x, ys[i] - 8]); });
    // garis jaringan: mula-mula hadiah (berkilau di atas kepala), lalu turun mengikat kaki
    const down = eio(clamp((l - tSisi + 0.2) / 1.6)), tight = ramp(l, tPergi - 0.3, 0.8);
    const pts = xs.map((x, i) => [x, lerp(ys[i] - 300, ys[i] - 14, down)]);
    ctx.save(); ctx.lineCap = "round";
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const [x0, y0] = pts[i], [x1, y1] = pts[j]; const sag = lerp(60, 8, tight) * (1 - Math.abs(i - j) / 10) * down;
      ctx.strokeStyle = D.hexA(down > 0.5 ? P.teal : P.warm, 0.7 + 0.2 * Math.sin(t * 3 + i + j)); ctx.lineWidth = lerp(3.5, 6, tight);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + sag, x1, y1); ctx.stroke(); }
    pts.forEach(([x, y]) => { ctx.fillStyle = down > 0.5 ? P.teal : P.warm; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); });
    ctx.restore();
    ctx.restore();
    D.post(c2 => {
      tag(c2, "efek jaringan = hadiah?", 960, 140, pop(l, tHadiah - 0.6).a * (1 - ramp(l, tSisi, 0.3)), { sp: pop(l, tHadiah - 0.6).sp, col: P.warm, size: 52 });
      tag(c2, "keramaian yang sama…", 520, 420, pop(l, tDatang - 0.8).a, { sp: pop(l, tDatang - 0.8).sp, col: P.teal, size: 48 });
      tag(c2, "membuatmu sulit pergi", 1400, 420, pop(l, tPergi).a, { sp: pop(l, tPergi).sp, col: P.pink, size: 48 });
    });
  };

  // ---------- b4_5: palang dan gembok ----------
  S.b4_5 = function (ctx, b, l, t) {
    const tSetia = D.at(b, "pelanggan yang setia"), tKunci = D.at(b, "pelanggan yang terkunci"), tTahap = D.at(b, "tahap kedua");
    const c = D.path([[0, 960, 560, 0.92], [tKunci, 960, 560, 0.92], [tKunci + 1.4, 960, 600, 1.12], [b.dur, 960, 600, 1.16]], l);
    ctx.save(); U.camT(ctx, c);
    U.pasar(ctx, t, { esTeh: true, suram: 0.25 * ramp(l, tKunci, 2) });
    U.pengunjung(ctx, t, 7, { y: 1010, h: 230, seed: 4, v: 40 });
    const pu = eio(clamp((l - tKunci + 1.2) / 1.2)), kunci = clamp((l - tKunci - 0.3) / 0.5);
    U.palang(ctx, t, pu, kunci);
    U.juragan(ctx, 1330, U.FLOOR + 80, 320, { pose: pu > 0 && pu < 1 ? "angkat" : "diam", k: 1 - pu, t, dir: -1 });
    ctx.restore();
    D.post(c2 => {
      tag(c2, "pelanggan setia?", 600, 140, pop(l, tSetia).a * (1 - ramp(l, tKunci - 0.3, 0.3)), { sp: pop(l, tSetia).sp, col: P.green, size: 52 });
      tag(c2, "pelanggan terkunci", 600, 140, pop(l, tKunci).a, { sp: pop(l, tKunci).sp, col: P.pink, size: 52 });
      U.judul(c2, "Tahap 2 dimulai", 1360, 140, 60, pop(l, tTahap).a, { sp: pop(l, tTahap).sp, col: P.amber });
    });
  };

  K.SCENES.d05_b4 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d05_b4.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b4 = TL => [
    K.sfxAt(TL, "b4_1", "grup kelas", 0, "pop", 0.4), K.sfxAt(TL, "b4_1", "grup keluarga", 0, "pop", 0.4), K.sfxAt(TL, "b4_1", "siapa pun", 0, "whoosh", 0.4),
    K.sfxAt(TL, "b4_2", "Ulasan bintang", 0, "pop", 0.4), K.sfxAt(TL, "b4_2", "ribuan pengikut", 0, "pop", 0.4), K.sfxAt(TL, "b4_2", "riwayat penjualan", 0, "pop", 0.4),
    K.sfxAt(TL, "b4_3", "biaya pindah", 0.5, "clack", 0.5), K.sfxAt(TL, "b4_4", "sisi lain", 0, "riser", 0.5),
    K.sfxAt(TL, "b4_5", "pelanggan yang terkunci", -0.2, "boom", 0.6), K.sfxAt(TL, "b4_5", "pelanggan yang terkunci", 0.3, "clack", 0.8),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
