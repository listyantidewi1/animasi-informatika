/* D05 bab 10 — Penutup (b10_1 … b10_5).
   b10_1 Raka memindahkan foto dari HP ke laptop dan flashdisk; Bip memegang kunci kecil "milikmu"; tiga kebiasaan menyala satu per satu;
   b10_2 ruang rapat: papan tulis "pindah ke aplikasi lain lebih sulit", programmer muda bertanya, rencana dicoret jadi "ekspor data dengan mudah";
   b10_3 Pasar Juragan: spanduk naik, palang terangkat, kamera mundur menjadi jaringan pasar yang saling tersambung jembatan;
   b10_4 kartu catatan naskah (bantuan AI, diperiksa fakta, disunting manusia); b10_5 layar akhir kanal. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KY = KIT.layar, O = () => KIT.orang;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const RR = (...a) => K.helpers.rr(...a);
  const S = {};

  function kunciKecil(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); U.addLight(ctx, 0, 0, s * 1.3, "#FFC94D", 0.35);
    ctx.strokeStyle = "#FFC94D"; ctx.lineWidth = s * 0.16; ctx.beginPath(); ctx.arc(0, -s * 0.45, s * 0.28, 0, TAU); ctx.stroke();
    ctx.fillStyle = "#FFC94D"; ctx.fillRect(-s * 0.08, -s * 0.2, s * 0.16, s * 1.0); ctx.fillRect(0, s * 0.5, s * 0.3, s * 0.12); ctx.fillRect(0, s * 0.68, s * 0.22, s * 0.12); ctx.restore(); }
  function foto(ctx, x, y, w, i) { const cols = ["#5AA9FF", "#FF6F91", "#5BD68A", "#FFB547", "#9584FF", "#3FD8C8"]; ctx.fillStyle = "#FFFFFF"; RR(ctx, x - w / 2, y - w * 0.4, w, w * 0.8, 6); ctx.fill();
    ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(x - w / 2 + 5, y - w * 0.4 + 5, w - 10, w * 0.8 - 10);
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.moveTo(x - w * 0.4, y + w * 0.32); ctx.lineTo(x - w * 0.1, y - w * 0.05); ctx.lineTo(x + w * 0.1, y + w * 0.15); ctx.lineTo(x + w * 0.25, y); ctx.lineTo(x + w * 0.42, y + w * 0.32); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w * 0.22, y - w * 0.18, w * 0.08, 0, TAU); ctx.fill(); }
  function laptop(ctx, cx, y, w, t, fill) {   // (cx,y) = tepi depan alas; fill(ctx, x, y, w, h) isi layar
    const h = w * 0.62, sx = cx - w / 2, sy = y - 40 - h;
    ctx.fillStyle = "rgba(10,8,30,0.25)"; ctx.beginPath(); ctx.ellipse(cx, y + 6, w * 0.62, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2A2F5A"; RR(ctx, sx - 16, sy - 16, w + 32, h + 32, 18); ctx.fill();
    ctx.save(); RR(ctx, sx, sy, w, h, 6); ctx.clip(); const gr = ctx.createLinearGradient(0, sy, 0, sy + h); gr.addColorStop(0, "#1D2A62"); gr.addColorStop(1, "#2E3F86"); ctx.fillStyle = gr; ctx.fillRect(sx, sy, w, h);
    if (fill) fill(ctx, sx, sy, w, h); ctx.restore();
    ctx.fillStyle = "#8C93B8"; ctx.beginPath(); ctx.moveTo(sx - 40, y - 24); ctx.lineTo(sx + w + 40, y - 24); ctx.lineTo(sx + w + 80, y); ctx.lineTo(sx - 80, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#B5BBD8"; ctx.fillRect(sx - 40, y - 30, w + 80, 8); return { sx, sy, w, h }; }
  function flashdisk(ctx, x, y, s, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.15); ctx.fillStyle = "#C9CEE6"; RR(ctx, -s * 0.75, -s * 0.18, s * 0.3, s * 0.36, 4); ctx.fill();
    ctx.fillStyle = "#FF6F61"; RR(ctx, -s * 0.48, -s * 0.26, s * 1.1, s * 0.52, 12); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.3)"; RR(ctx, -s * 0.4, -s * 0.2, s * 0.9, s * 0.12, 6); ctx.fill();
    if (a > 0) { ctx.fillStyle = D.hexA("#5BD68A", a); ctx.beginPath(); ctx.arc(s * 0.45, 0, s * 0.07, 0, TAU); ctx.fill(); } ctx.restore(); }
  function kamar(ctx) {
    const gw = ctx.createLinearGradient(0, 0, 0, 780); gw.addColorStop(0, "#3A4A8A"); gw.addColorStop(1, "#5A6AA8"); ctx.fillStyle = gw; ctx.fillRect(0, 0, W, 780);
    ctx.fillStyle = "rgba(255,255,255,0.04)"; for (let x = 0; x < W; x += 120) ctx.fillRect(x, 0, 50, 780);
    ctx.fillStyle = "#7A5A48"; ctx.fillRect(0, 780, W, 300); ctx.fillStyle = "rgba(0,0,0,0.1)"; for (let x = 0; x < W; x += 180) ctx.fillRect(x, 780, 4, 300);
    // meja belajar
    ctx.fillStyle = "#A8714C"; RR(ctx, 640, 740, 900, 34, 8); ctx.fill(); ctx.fillStyle = "#8A5A3C"; ctx.fillRect(680, 774, 30, 220); ctx.fillRect(1470, 774, 30, 220);
  }

  // ---------- b10_1: menjaga kunci sendiri ----------
  const TIPS = ["simpan cadangan di luar satu aplikasi", "pilih layanan berstandar terbuka", "waspada bila makin berat ditinggalkan"];
  S.b10_1 = function (ctx, b, l, t) {
    const tKunci = D.at(b, "kunci pintumu"), tSimpan = D.at(b, "Simpan cadangan"), tStd = D.at(b, "standar terbuka"), tPerh = D.at(b, "perhatikan");
    kamar(ctx);
    // laptop dan flashdisk di meja
    const nF = 6, fly = i => clamp((l - tSimpan - 0.3 - i * 0.35) / 0.8);
    laptop(ctx, 1020, 740, 380, t, (c, x, y, w, h) => { c.fillStyle = "#FFC94D"; RR(c, x + 24, y + 22, 90, 62, 8); c.fill(); c.fillRect(x + 24, y + 14, 40, 14);
      for (let i = 0; i < nF; i++) if (fly(i) >= 1) foto(c, x + 70 + (i % 3) * 110, y + 130 + Math.floor(i / 3) * 80, 90, i); });
    flashdisk(ctx, 1360, 720, 120, ramp(l, tSimpan + 1.2, 0.4) * (0.6 + 0.4 * Math.sin(t * 6)));
    // Raka dengan HP
    const A = U.orang(ctx, 430, 940, 560, U.RAKA, { pose: "pegangHP", t, face: "senang", look: [1, 0] });
    const ph = A.phone || A.hand;
    for (let i = 0; i < nF; i++) { const u = fly(i); if (u <= 0 || u >= 1) continue; const e = eio(u), tx = 1020 - 110 + (i % 3) * 110, ty = 740 - 40 - 380 * 0.62 + 130 + Math.floor(i / 3) * 80;
      foto(ctx, lerp(ph[0], tx, e), lerp(ph[1], ty, e) - Math.sin(e * Math.PI) * 160, lerp(50, 90, e), i); }
    // Bip memegang kunci kecil
    const ka = pop(l, tKunci);
    KB.draw(ctx, 1640, 920, 170, { pose: l > tKunci ? "pegang" : "diam", t, mood: "happy", prop: ka.a > 0 ? (c, px, py, s) => kunciKecil(c, px, py - s * 0.05, s * 0.38 * lerp(0.4, 1, ka.sp), 0.3) : null });
    D.post(c2 => {
      tag(c2, "kunci pintumu sendiri", 1560, 640, ka.a, { sp: ka.sp, col: P.amber, size: 48 });
      tag(c2, "milikmu", 1640, 555, pop(l, tKunci + 0.6).a, { sp: pop(l, tKunci + 0.6).sp, col: P.green, size: 44 });
      const ts = [tSimpan, tStd, tPerh], pa = ramp(l, tSimpan - 0.4, 0.4);
      if (pa > 0) { c2.save(); c2.globalAlpha = pa; D.panel(c2, 640, 90, 1180, 3 * 84 + 44, { r: 24, fill: "rgba(10,18,52,0.88)" });
        TIPS.forEach((s, i) => { const on = ramp(l, ts[i], 0.4), y = 160 + i * 84; c2.globalAlpha = pa * (0.35 + 0.65 * on);
          c2.fillStyle = on > 0.5 ? "#5BD68A" : "#5C6390"; c2.beginPath(); c2.arc(690, y - 14, 22, 0, TAU); c2.fill();
          if (on > 0.5) { c2.strokeStyle = "#FFFFFF"; c2.lineWidth = 5; c2.lineCap = "round"; c2.beginPath(); c2.moveTo(680, y - 14); c2.lineTo(688, y - 5); c2.lineTo(702, y - 24); c2.stroke(); }
          txt(c2, s, 730, y, 44, { weight: 900, color: P.ink }); }); c2.restore(); }
    });
  };

  // ---------- b10_2: ruang rapat ----------
  S.b10_2 = function (ctx, b, l, t) {
    const tProg = D.at(b, "programmer"), tRuang = D.at(b, "ruangan"), tTanya = D.at(b, "bertanya"), tBantu = D.at(b, "membantu pengguna"), tRugi = D.at(b, "merugikan");
    const c = D.path([[0, 960, 560, 1.0], [b.dur, 960, 540, 1.06]], l); ctx.save(); U.camT(ctx, c);
    const gw = ctx.createLinearGradient(0, -200, 0, 800); gw.addColorStop(0, "#E6E0F0"); gw.addColorStop(1, "#C9C2DE"); ctx.fillStyle = gw; ctx.fillRect(-400, -400, 2720, 1200);
    ctx.fillStyle = "#6B5E8A"; ctx.fillRect(-400, 800, 2720, 600);
    // jendela kanan
    ctx.fillStyle = "#4A4070"; RR(ctx, 1500, 150, 360, 380, 12); ctx.fill(); const sk = ctx.createLinearGradient(0, 165, 0, 515); sk.addColorStop(0, "#7FA6E8"); sk.addColorStop(1, "#FFD3A0"); ctx.fillStyle = sk; ctx.fillRect(1514, 164, 332, 352);
    ctx.fillStyle = "#8FA3D8"; for (let i = 0; i < 5; i++) ctx.fillRect(1520 + i * 66, 400 - (i % 3) * 60, 50, 120 + (i % 3) * 60); ctx.fillStyle = "#4A4070"; ctx.fillRect(1674, 150, 12, 380);
    // papan tulis
    ctx.fillStyle = "#9AA0BC"; RR(ctx, 260, 110, 1100, 470, 16); ctx.fill(); ctx.fillStyle = "#FBFBFF"; RR(ctx, 276, 126, 1068, 438, 10); ctx.fill();
    // orang-orang duduk di meja rapat
    const M = O(), ppl = [[460, { age: "dewasa", hair: "pendek", skin: 1, top: "#5AA9FF", outfit: "kemeja" }], [800, { age: "dewasa", hair: "hijab", hijab: "#36B3A3", skin: 3, top: "#FFB547", outfit: "kemeja", lengan: "panjang" }],
      [1140, { age: "dewasa", hair: "pendek", skin: 4, top: "#9584FF", outfit: "kaos" }], [1480, { age: "dewasa", hair: "panjang", skin: 2, top: "#FF6F91", outfit: "kemeja" }]];
    const my = M.mejaY(980, 400, "dewasa"), tanya = 2;
    const opt = (o, i) => Object.assign({ pose: "dudukMeja", t, mejaY: my, seed: 40 + i, face: i === tanya && l > tTanya ? "senang" : "netral", look: [i === tanya ? -0.3 : 0, -0.6] }, o, typeof o.skin === "number" ? { skin: M.SKIN[o.skin] } : {});
    ppl.forEach(([x, o], i) => M.draw(ctx, x, 980, 400, Object.assign(opt(o, i), { lapis: "badan" })));
    M.meja(ctx, 960, my, 1500, 1080, { col: "#8A6A9A" });
    ppl.forEach(([x, o], i) => M.draw(ctx, x, 980, 400, Object.assign(opt(o, i), { lapis: "lengan" })));
    ctx.restore();
    D.post(c2 => {
      const [bx, by] = U.toS(c, 810, 126);
      const s1 = ramp(l, tRuang - 0.6, 0.5); c2.save(); c2.globalAlpha = s1;
      txt(c2, "Rencana fitur baru:", bx, by + 90, 52, { align: "center", weight: 900, color: "#3A2F6E" });
      txt(c2, "pindah ke aplikasi lain lebih sulit", bx, by + 190, 52, { align: "center", weight: 800, color: "#C7413B", fit: 980 });
      const cr = eio(clamp((l - tBantu) / 0.6)); if (cr > 0) { c2.strokeStyle = "#3A2F6E"; c2.lineWidth = 8; c2.lineCap = "round"; c2.beginPath(); c2.moveTo(bx - 440, by + 172); c2.lineTo(bx - 440 + 880 * cr, by + 178); c2.stroke(); }
      const nw = ramp(l, tBantu + 0.7, 0.6); if (nw > 0) { c2.globalAlpha = s1 * nw; txt(c2, "ekspor data dengan mudah ✓", bx, by + 300, 56, { align: "center", weight: 900, color: "#2E9E5E", fit: 980 }); }
      c2.restore();
      // tangan teracung + gelembung pertanyaan
      const [qx, qy] = U.toS(c, 1140, 560); const qa = pop(l, tTanya);
      if (qa.a > 0) { c2.save(); c2.globalAlpha = qa.a; c2.fillStyle = "#FFFFFF"; c2.strokeStyle = "#3A2F6E"; c2.lineWidth = 5; const k = lerp(0.6, 1, qa.sp);
        const bh = lerp(140, 230, ramp(l, tRugi - 0.2, 0.3)); c2.translate(1540, 600 - bh / 2); c2.scale(k, k); RR(c2, -290, -70, 580, bh, 30); c2.fill(); c2.stroke(); c2.beginPath(); c2.moveTo(-230, bh - 74); c2.lineTo(-380, bh + 40); c2.lineTo(-150, bh - 70); c2.closePath(); c2.fill();
        txt(c2, "membantu pengguna?", 0, 16, 46, { align: "center", weight: 900, color: "#2E9E5E" });
        const ru = ramp(l, tRugi, 0.3); if (ru > 0) { c2.globalAlpha = qa.a * ru; txt(c2, "atau merugikan?", 0, 100, 46, { align: "center", weight: 900, color: "#C7413B" }); } c2.restore(); }
      
      tag(c2, "kamu, suatu hari nanti", 960, 60 + 0, pop(l, tProg).a * (1 - ramp(l, tRuang + 1.2, 0.4)), { sp: pop(l, tProg).sp, col: P.amber, size: 44 });
    });
  };

  // ---------- b10_3: pintu dibuka, pasar tersambung ----------
  const NODES = [[960, 820, 300, "#D2694B"], [380, 520, 220, "#5AA9FF"], [1540, 520, 220, "#5BD68A"], [620, 300, 190, "#9584FF"], [1300, 300, 190, "#FF6F91"], [200, 860, 200, "#FFB547"], [1720, 860, 200, "#3FD8C8"]];
  S.b10_3 = function (ctx, b, l, t) {
    const tInt = D.at(b, "Internet tidak harus"), tPintu = D.at(b, "pintu terkunci"), tBangun = D.at(b, "dibangun oleh"), tSiapa = D.at(b, "siapa pun bisa"),
      tBusuk = D.at(b, "Pembusukan bukanlah"), tPilih = D.at(b, "hasil dari sebuah pilihan"), tUbah = D.at(b, "bisa diubah");
    const sw = eio(clamp((l - tBangun + 0.3) / 1.4));
    if (sw < 1) { const z = lerp(1, 0.55, sw); ctx.save(); ctx.globalAlpha *= 1 - sw; U.camT(ctx, { x: 960, y: 560, z });
      const ban = 1 - eio(clamp((l - tInt - 0.6) / 2.2)), gate = 1 - eio(clamp((l - tPintu) / 1.0));
      U.pasar(ctx, t, { suram: 0.35 * ban, pagi: 1 - ban });
      U.pengunjung(ctx, t, 8, { y: 960, h: 200, seed: 5, v: 40 * (1 - gate), x0: 300, x1: 1650 });
      U.palang(ctx, t, gate, gate);
      U.spanduk(ctx, t, ban);
      ctx.restore(); }
    if (sw > 0) { ctx.save(); ctx.globalAlpha *= sw; U.studio(ctx, t, { top: "#26347A", bot: "#3E56A0" });
      const z = lerp(1.6, 0.88, eout(sw)); ctx.save(); ctx.translate(960, 600 + 40 * sw); ctx.scale(z, z); ctx.translate(-960, -600);
      const e = clamp((l - tSiapa + 0.2) / 2.5);
      const pts = NODES.map(n => [n[0], n[1] - n[2] * 0.3]);
      // jembatan antarpasar
      const pairs = []; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) pairs.push([i, j]);
      pairs.forEach(([i, j], k) => { const u = clamp(e * pairs.length * 0.6 - k * 0.6); if (u <= 0) return; const [x0, y0] = pts[i], [x1, y1] = pts[j];
        ctx.strokeStyle = D.hexA("#FFE7B0", 0.45); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, u), lerp(y0, y1, u)); ctx.stroke();
        if (u >= 1) { const v = (t * 0.25 + k * 0.17) % 1; ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); ctx.arc(lerp(x0, x1, v), lerp(y0, y1, v), 7, 0, TAU); ctx.fill(); } });
      NODES.forEach(([x, y, s, col], i) => { const a = i === 0 ? 1 : clamp((l - tBangun - 0.2 - i * 0.18) / 0.4); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
        U.pasarMini(ctx, x, y, s * lerp(0.6, 1, spring(a, 9, 0.5)), { col, t, seed: i, ramai: 1 }); ctx.restore(); });
      // gapura terbuka di pasar tengah
      ctx.fillStyle = "#FFC94D"; ctx.font = "900 46px " + K.FONT; ctx.restore();
      const fin = ramp(l, tUbah - 0.2, 1.2); if (fin > 0) U.addLight(ctx, 960, 560, 900 * fin, "#FFE7B0", 0.25 * fin);
      ctx.restore(); }
    D.post(c2 => {
      tag(c2, "tidak harus penuh spanduk", 960, 120, pop(l, tInt + 0.3).a * (1 - sw), { sp: pop(l, tInt + 0.3).sp, col: P.amber, size: 48 });
      c2.save(); c2.globalAlpha = sw;
      tag(c2, "siapa pun bisa tersambung dengan siapa pun", 960, 110, pop(l, tSiapa).a * (1 - ramp(l, tBusuk - 0.3, 0.3)), { sp: pop(l, tSiapa).sp, col: P.teal, size: 48 });
      if (l > tBusuk - 0.3) U.judul(c2, "Pembusukan bukan hukum alam", 960, 120, 60, ramp(l, tBusuk - 0.3, 0.4), { col: P.pink });
      const pp = pop(l, tPilih); tag(c2, "ia hasil pilihan", 760, 1000 - 70, pp.a, { sp: pp.sp, col: P.amber, size: 52 });
      const pu = pop(l, tUbah); tag(c2, "pilihan bisa diubah", 1240, 930, pu.a, { sp: pu.sp, col: P.green, size: 52 });
      c2.restore();
    });
  };

  // ---------- b10_4: catatan naskah ----------
  function ikonAI(c, x, y, s, t) { c.strokeStyle = "#9584FF"; c.lineWidth = 5; RR(c, x - s / 2, y - s / 2, s, s, s * 0.22); c.stroke();
    for (let i = 0; i < 3; i++) { const yy = y - s * 0.22 + i * s * 0.22; c.beginPath(); c.moveTo(x - s * 0.5, yy); c.lineTo(x - s * 0.7, yy); c.moveTo(x + s * 0.5, yy); c.lineTo(x + s * 0.7, yy); c.stroke(); }
    c.fillStyle = "#9584FF"; c.beginPath(); c.arc(x, y, s * 0.18 * (1 + 0.1 * Math.sin(t * 4)), 0, TAU); c.fill(); }
  function ikonCek(c, x, y, s, u) { c.fillStyle = "#5BD68A"; c.beginPath(); c.arc(x, y, s * 0.5, 0, TAU); c.fill(); if (u <= 0) return; c.strokeStyle = "#FFFFFF"; c.lineWidth = s * 0.12; c.lineCap = "round"; c.beginPath();
    const p = [[x - s * 0.22, y], [x - s * 0.05, y + s * 0.18], [x + s * 0.25, y - s * 0.18]]; c.moveTo(...p[0]); const k = u * 2; if (k < 1) c.lineTo(lerp(p[0][0], p[1][0], k), lerp(p[0][1], p[1][1], k)); else { c.lineTo(...p[1]); c.lineTo(lerp(p[1][0], p[2][0], k - 1), lerp(p[1][1], p[2][1], k - 1)); } c.stroke(); }
  function ikonPensil(c, x, y, s, t) { c.save(); c.translate(x, y); c.rotate(-0.7 + Math.sin(t * 6) * 0.06); c.fillStyle = "#FFB547"; c.fillRect(-s * 0.1, -s * 0.5, s * 0.2, s * 0.8);
    c.fillStyle = "#FF6F91"; c.fillRect(-s * 0.1, -s * 0.6, s * 0.2, s * 0.12); c.fillStyle = "#F3D9B1"; c.beginPath(); c.moveTo(-s * 0.1, s * 0.3); c.lineTo(s * 0.1, s * 0.3); c.lineTo(0, s * 0.5); c.closePath(); c.fill(); c.restore(); }
  S.b10_4 = function (ctx, b, l, t) {
    const tCat = D.at(b, "Sebagai catatan"), tAI = D.at(b, "bantuan AI"), tCl = D.at(b, "Claude"), tFak = D.at(b, "diperiksa fakta"), tSun = D.at(b, "disunting");
    U.studio(ctx, t, { top: "#1F2D68", bot: "#2E3F86" });
    KB.draw(ctx, 300, 900, 190, { pose: "tunjuk", target: [900, 500], t, mood: "happy" });
    const ca = eout(ramp(l, tCat - 0.4, 0.6));
    D.post(c2 => { if (ca <= 0) return; c2.save(); c2.globalAlpha = ca; c2.translate(0, (1 - ca) * 40);
      c2.fillStyle = "#FFF6E6"; RR(c2, 560, 150, 1200, 760, 34); c2.fill(); c2.fillStyle = "#FFB547"; RR(c2, 560, 150, 1200, 110, 34); c2.fill(); c2.fillRect(560, 220, 1200, 40);
      txt(c2, "Catatan tentang naskah video ini", 1160, 225, 52, { align: "center", weight: 900, color: "#2A2350" });
      const rows = [[tAI, "disusun dengan bantuan AI", (x, y) => ikonAI(c2, x, y, 70, t)], [tFak, "diperiksa faktanya", (x, y) => ikonCek(c2, x, y, 84, ramp(l, tFak, 0.5))], [tSun, "disunting oleh manusia", (x, y) => ikonPensil(c2, x, y, 90, t)]];
      rows.forEach(([t0, s, ic], i) => { const a = ramp(l, t0 - 0.2, 0.4), y = 370 + i * 170; c2.globalAlpha = ca * (0.25 + 0.75 * a); ic(700, y - 16);
        txt(c2, s, 790, y, 52, { weight: 900, color: "#2A2350" });
        if (i === 0) { const ca2 = ramp(l, tCl - 0.1, 0.4); c2.globalAlpha = ca * ca2; txt(c2, "termasuk Claude buatan Anthropic", 790, y + 62, 44, { weight: 700, color: "#5A5280" }); } });
      c2.restore(); });
  };

  // ---------- b10_5: layar akhir ----------
  const SUB = { x: 440, y: 300, r: 118 }, SLOT = { x: 1060, y: 236, w: 760, h: 428 };
  S.b10_5 = function (ctx, b, l, t) {
    const tSub = D.at(b, "subscribe"), tIt = D.at(b, "I Teach"), tSw = D.at(b, "Software Engineering"), tSam = D.at(b, "Sampai jumpa");
    U.studio(ctx, t, { top: "#1F2D68", bot: "#33498F" });
    const pa = clamp(spring(ramp(l, tSub - 0.4, 1.2), 9, 0.45));
    if (pa > 0.01) { ctx.save(); ctx.translate(SUB.x, SUB.y); ctx.scale(pa, pa); D.glow(ctx, 0, 0, SUB.r * 2, P.teal, 0.3 + 0.1 * Math.sin(t * 2));
      for (let i = 0; i < 2; i++) { const ph = (t * 0.4 + i / 2) % 1; ctx.strokeStyle = D.hexA(P.teal, 0.5 * (1 - ph)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, SUB.r * (1.08 + 0.35 * ph), 0, TAU); ctx.stroke(); }
      ctx.fillStyle = "#1B2457"; ctx.beginPath(); ctx.arc(0, 0, SUB.r, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(0, 0, SUB.r * 0.92, 0, TAU); ctx.clip(); U.pasarMini(ctx, 0, 60, 150, { col: "#D2694B", t, ramai: 1 }); ctx.restore();
      ctx.strokeStyle = P.teal; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, SUB.r, 0, TAU); ctx.stroke(); ctx.restore();
      const burst = ramp(l, tSub, 0.9); if (burst > 0 && burst < 1) { ctx.strokeStyle = D.hexA(P.teal, 0.9 * (1 - burst)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r * (1.05 + 0.7 * eout(burst)), 0, TAU); ctx.stroke(); }
      const ring = ramp(l, tSub - 0.05, 0.1) * (1 - ramp(l, tSub + 1.4, 0.4)), swg = Math.sin(t * 16) * 0.4 * ring, bx = SUB.x + SUB.r * 0.74, byy = SUB.y + SUB.r * 0.74, br = 38 * pa;
      ctx.save(); ctx.translate(bx, byy); ctx.fillStyle = "#E5484D"; ctx.beginPath(); ctx.arc(0, 0, br, 0, TAU); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke();
      ctx.rotate(swg); ctx.scale(br / 38, br / 38); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-15, 10); ctx.quadraticCurveTo(-13, -17, 0, -17); ctx.quadraticCurveTo(13, -17, 15, 10); ctx.closePath(); ctx.fill();
      ctx.fillRect(-19, 8, 38, 6); ctx.beginPath(); ctx.arc(0, 18, 5, 0, TAU); ctx.fill(); ctx.restore(); }
    const ba = eout(ramp(l, tIt - 0.1, 0.4));
    if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba; ctx.fillStyle = "rgba(12,18,56,0.94)"; RR(ctx, SUB.x - 320, SUB.y + SUB.r + 22, 640, 154, 34); ctx.fill(); ctx.restore(); }
    [["I Teach", tIt, 56, P.warm], ["Software Engineering", tSw, 52, "#FFFFFF"]].forEach(([s, t0, sz, col], i) => { const u = eout(ramp(l, t0 - 0.05, 0.4)); if (u <= 0) return;
      ctx.save(); ctx.globalAlpha *= u; txt(ctx, s, SUB.x, SUB.y + SUB.r + 76 + i * 66 + (1 - u) * 14, sz, { align: "center", weight: 900, color: col }); ctx.restore(); });
    const pu = pop(l, tSw + 0.6); tag(ctx, "youtube.com/@iTeachSWE", SUB.x, SUB.y + SUB.r + 250, pu.a, { sp: pu.sp, col: P.teal, size: 46 });
    const va = eout(ramp(l, tSam - 0.4, 0.7));
    if (va > 0) { const { x, y, w, h } = SLOT; ctx.save(); ctx.globalAlpha *= va; ctx.translate(0, (1 - va) * 40);
      D.label(ctx, "Cerita berikutnya", x + w / 2, y - 62, { size: 48, col: P.amber }); D.glow(ctx, x + w / 2, y + h / 2, w * 0.7, P.violet, 0.3);
      ctx.save(); RR(ctx, x, y, w, h, 26); ctx.clip(); const gr = ctx.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, "#26336E"); gr.addColorStop(1, "#3B2E78"); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
      ctx.globalAlpha *= 0.35; [[x + 180, 0.9, "#5AA9FF"], [x + 380, 1.2, "#D2694B"], [x + 580, 0.9, "#5BD68A"]].forEach(([px, s, col], i) => U.pasarMini(ctx, px, y + h - 60, 180 * s, { col, t, seed: i }));
      ctx.restore(); ctx.strokeStyle = D.hexA("#FFFFFF", 0.4); ctx.lineWidth = 4; RR(ctx, x, y, w, h, 26); ctx.stroke(); ctx.restore(); }
    KB.draw(ctx, 1440, 900, 170, { pose: l > tSam ? "diam" : "tunjuk", target: [SUB.x, SUB.y], t, mood: "happy", wave: l > tSam ? 1 : 0 });
  };

  K.SCENES.d05_b10 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d05_b10.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b10 = TL => [
    K.sfxAt(TL, "b10_1", "kunci pintumu", 0, "shimmer", 0.5), K.sfxAt(TL, "b10_1", "Simpan cadangan", 0.4, "whoosh", 0.4),
    K.sfxAt(TL, "b10_1", "standar terbuka", 0, "pop", 0.4), K.sfxAt(TL, "b10_1", "perhatikan", 0, "pop", 0.4),
    K.sfxAt(TL, "b10_2", "bertanya", 0, "pop", 0.5), K.sfxAt(TL, "b10_2", "membantu pengguna", 0.1, "clack", 0.5),
    K.sfxAt(TL, "b10_3", "Internet tidak harus", 0.6, "whoosh", 0.4), K.sfxAt(TL, "b10_3", "pintu terkunci", 0, "clack", 0.5),
    K.sfxAt(TL, "b10_3", "dibangun oleh", 0, "riser", 0.4), K.sfxAt(TL, "b10_3", "bisa diubah", 0, "shimmer", 0.6),
    K.sfxAt(TL, "b10_4", "Sebagai catatan", -0.3, "whoosh", 0.3), K.sfxAt(TL, "b10_4", "diperiksa fakta", 0, "pop", 0.4),
    K.sfxAt(TL, "b10_5", "subscribe", 0, "pop", 0.5),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
