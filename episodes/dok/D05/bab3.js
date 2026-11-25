/* D05 bab 3 — Siapa yang membayar es teh gratis? (b3_1 … b3_5).
   b3_1 penampang: pipa koin dari gedung investor ke dapur es teh Pasar Juragan; b3_2 grafik suku bunga bank sentral AS 2005–2024 (perkiraan data FRED, rata-rata efektif),
   dua masa dekat nol diwarnai, lalu koin pindah dari bank ke perusahaan teknologi; b3_3 bakar uang: HP penuh voucher, uang kertas jadi kembang api;
   b3_4 suku bunga naik, pipa menyempit lalu menetes, investor (siluet) mengetuk pintu kantor Juragan; b3_5 Juragan memegang kunci besar di gapura. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KY = KIT.layar;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};

  // ---------- penampang pipa investor ----------
  const PIPE = [[420, 560], [420, 760], [1180, 760], [1180, 640], [1300, 640]];
  function ptOn(u) { let L = 0; const seg = []; for (let i = 1; i < PIPE.length; i++) { const d = Math.hypot(PIPE[i][0] - PIPE[i - 1][0], PIPE[i][1] - PIPE[i - 1][1]); seg.push(d); L += d; }
    let s = u * L; for (let i = 0; i < seg.length; i++) { if (s <= seg[i]) { const f = s / seg[i]; return [lerp(PIPE[i][0], PIPE[i + 1][0], f), lerp(PIPE[i][1], PIPE[i + 1][1], f)]; } s -= seg[i]; } return PIPE[PIPE.length - 1]; }
  function koin(ctx, x, y, r) { ctx.fillStyle = "#C9962E"; ctx.beginPath(); ctx.arc(x, y + 2, r, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFC94D"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFE29A"; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, TAU); ctx.fill(); }
  function menara(ctx, x, y, w, h, t, seed, a = 1) {
    const r = D.rng(seed); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#2F3B7E"; ctx.fillRect(x, y - h, w, h);
    const gl = ctx.createLinearGradient(x, y - h, x + w, y); gl.addColorStop(0, "rgba(160,200,255,0.35)"); gl.addColorStop(1, "rgba(160,200,255,0.05)"); ctx.fillStyle = gl; ctx.fillRect(x, y - h, w, h);
    for (let f = 0; f < Math.floor(h / 40); f++) for (let c = 0; c < Math.floor(w / 40); c++) { ctx.fillStyle = r() < 0.6 ? "rgba(255,226,154,0.75)" : "rgba(20,26,70,0.6)"; ctx.fillRect(x + 8 + c * 40, y - h + 10 + f * 40, 26, 24); }
    ctx.restore();
  }
  function penampang(ctx, t, o = {}) {
    const sky = ctx.createLinearGradient(0, 0, 0, 640); sky.addColorStop(0, "#3E62C4"); sky.addColorStop(1, "#FFD3A0"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 640);
    // tanah (penampang)
    ctx.fillStyle = "#8A6448"; ctx.fillRect(0, 640, W, 440); ctx.fillStyle = "#A57A58"; ctx.fillRect(0, 640, W, 16);
    ctx.fillStyle = "rgba(60,40,30,0.25)"; const r = D.rng(3); for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(r() * W, 680 + r() * 380, 4 + r() * 8, 0, TAU); ctx.fill(); }
    // gedung investor
    [[140, 150, 420, 1], [300, 170, 520, 2], [480, 140, 360, 3]].forEach(([x, w, h, s]) => menara(ctx, x, 640, w, h, t, s));
    // pasar dan dapur es teh
    U.pasarMini(ctx, 1500, 640, 600, { nama: "Pasar Juragan", t, suram: o.suram || 0 });
    U.gerobakEsTeh(ctx, 1300, 640, 180, { t, papan: 0 });
    // pipa
    const pw = 54 * (o.lebar == null ? 1 : o.lebar);
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.strokeStyle = "#5C6390"; ctx.lineWidth = pw + 14; ctx.beginPath(); PIPE.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    ctx.strokeStyle = "#8C93B8"; ctx.lineWidth = pw; ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = pw * 0.25; ctx.stroke();
    // koin mengalir
    const flow = o.flow == null ? 1 : o.flow, n = Math.round(22 * flow);
    for (let i = 0; i < n; i++) { const u = ((t * 0.12 * (0.6 + flow * 0.4) + i / Math.max(1, n)) % 1); const [x, y] = ptOn(u); koin(ctx, x, y, Math.max(8, pw * 0.36)); }
    if (o.tetes) { const u = (t * 0.8) % 1; const [x, y] = PIPE[PIPE.length - 1]; ctx.fillStyle = "#FFC94D"; ctx.beginPath(); ctx.arc(x + 10, y + 20 + u * 60, 10 * (1 - u * 0.4), 0, TAU); ctx.fill(); }
  }
  S.b3_1 = function (ctx, b, l, t) {
    const tInv = D.at(b, "investor");
    penampang(ctx, t, { flow: clamp(l / 1.2) });
    D.post(c2 => { tag(c2, "investor", 390, 130, pop(l, tInv - 0.3).a, { sp: pop(l, tInv - 0.3).sp, col: P.amber, size: 56 });
      tag(c2, "dapur es teh", 1300, 400, pop(l, 0.6).a, { col: P.teal, size: 44 }); });
  };

  // ---------- b3_2: grafik suku bunga ----------
  // titik [tahun, persen] (perkiraan rata-rata efektif bulanan, FRED FEDFUNDS)
  const RATE = [[2005, 2.3], [2005.5, 3.0], [2006, 4.3], [2006.5, 5.2], [2007.6, 5.25], [2007.9, 4.5], [2008.2, 2.6], [2008.6, 2.0], [2008.83, 1.0], [2008.97, 0.16],
    [2010, 0.15], [2012, 0.14], [2014, 0.09], [2015.9, 0.12], [2016.1, 0.36], [2016.95, 0.54], [2017.3, 0.9], [2017.9, 1.3], [2018.5, 1.9], [2018.95, 2.4], [2019.5, 2.4],
    [2019.8, 1.85], [2020.1, 1.58], [2020.25, 0.05], [2021, 0.09], [2022.15, 0.08], [2022.25, 0.33], [2022.45, 1.2], [2022.6, 2.3], [2022.85, 3.8], [2023, 4.3], [2023.35, 5.0], [2023.6, 5.33], [2024.6, 5.33], [2024.75, 4.9], [2024.99, 4.5]];
  const CH = { x0: 260, x1: 1680, y0: 600, y1: 170, ya: 6 };
  const cx = yr => lerp(CH.x0, CH.x1, (yr - 2005) / 20), cy = v => lerp(CH.y0, CH.y1, v / CH.ya);
  function grafik(ctx, prog, t, o = {}) {
    D.panel(ctx, 140, 90, 1640, 620, { r: 24 });
    // pita dekat nol
    [[2008.97, 2015.9], [2020.25, 2022.2]].forEach(([a, b2], i) => { const k = clamp((prog - (a - 2005) / 20) * 8); if (k <= 0) return;
      ctx.fillStyle = D.hexA(P.teal, 0.22 * k); ctx.fillRect(cx(a), CH.y1, (cx(Math.min(b2, 2005 + prog * 20)) - cx(a)), CH.y0 - CH.y1); });
    // sumbu
    ctx.strokeStyle = D.hexA(P.ink, 0.25); ctx.lineWidth = 2; [0, 2, 4, 6].forEach(v => { ctx.beginPath(); ctx.moveTo(CH.x0, cy(v)); ctx.lineTo(CH.x1, cy(v)); ctx.stroke(); });
    ctx.strokeStyle = D.hexA(P.ink, 0.6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(CH.x0, CH.y1 - 10); ctx.lineTo(CH.x0, CH.y0); ctx.lineTo(CH.x1, CH.y0); ctx.stroke();
    // garis data
    const ymax = 2005 + 20 * prog; ctx.strokeStyle = P.amber; ctx.lineWidth = 9; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.beginPath(); let last = null;
    for (let i = 0; i < RATE.length; i++) { const [yr, v] = RATE[i]; if (yr > ymax) { if (i > 0) { const [y0, v0] = RATE[i - 1], f = (ymax - y0) / (yr - y0); last = [cx(ymax), cy(lerp(v0, v, f))]; ctx.lineTo(...last); } break; }
      last = [cx(yr), cy(v)]; if (i === 0) ctx.moveTo(...last); else ctx.lineTo(...last); }
    ctx.stroke(); if (last) { D.glow(ctx, last[0], last[1], 40, P.amber, 0.8); ctx.fillStyle = "#FFF1C8"; ctx.beginPath(); ctx.arc(last[0], last[1], 10, 0, TAU); ctx.fill(); }
  }
  function bank(ctx, x, y, s) { ctx.fillStyle = "#8C93B8"; ctx.beginPath(); ctx.moveTo(x - s * 0.6, y - s * 0.62); ctx.lineTo(x, y - s); ctx.lineTo(x + s * 0.6, y - s * 0.62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#C9CFEA"; for (let i = 0; i < 4; i++) ctx.fillRect(x - s * 0.5 + i * s * 0.3, y - s * 0.6, s * 0.12, s * 0.5); ctx.fillStyle = "#8C93B8"; ctx.fillRect(x - s * 0.62, y - s * 0.12, s * 1.24, s * 0.14); }
  function startup(ctx, x, y, s, t) { menara(ctx, x - s * 0.4, y, s * 0.8, s, t, 7); ctx.strokeStyle = P.green; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - s * 0.3, y - s * 1.05); ctx.lineTo(x, y - s * 1.3); ctx.lineTo(x + s * 0.12, y - s * 1.18); ctx.lineTo(x + s * 0.4, y - s * 1.5); ctx.stroke();
    ctx.fillStyle = P.green; ctx.beginPath(); ctx.moveTo(x + s * 0.48, y - s * 1.6); ctx.lineTo(x + s * 0.24, y - s * 1.55); ctx.lineTo(x + s * 0.45, y - s * 1.36); ctx.fill(); }
  S.b3_2 = function (ctx, b, l, t) {
    const tSepuluh = D.at(b, "Selama lebih"), tNol = D.at(b, "dekat nol"), tBunga = D.at(b, "Ketika bunga"), tTanam = D.at(b, "menanam uangnya");
    U.studio(ctx, t);
    const prog = eio(clamp((l - 0.5) / Math.max(2, tBunga - 1.0)));
    grafik(ctx, prog, t);
    // baris bawah: bank → perusahaan teknologi
    const ba = ramp(l, tBunga - 0.3, 0.5); if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba; bank(ctx, 520, 960, 170);
      const sa = ramp(l, tTanam - 0.4, 0.5); ctx.globalAlpha *= 1; if (sa > 0) { ctx.save(); ctx.globalAlpha *= sa; startup(ctx, 1400, 960, 150, t); ctx.restore();
        for (let i = 0; i < 6; i++) { const u = ((l - tTanam) * 0.5 + i / 6) % 1; if (l < tTanam) break; const x = lerp(640, 1290, u), y = 840 - Math.sin(u * Math.PI) * 90; koin(ctx, x, y, 18); } }
      ctx.restore(); }
    D.post(c2 => {
      tag(c2, "Suku bunga bank sentral AS", 960, 150, pop(l, 0.4).a, { col: P.amber, size: 44 });
      ["2005", "2010", "2015", "2020", "2024"].forEach((s, i) => { const yr = [2005, 2010, 2015, 2020, 2024][i]; const a = clamp((prog - (yr - 2005) / 20) * 10 + 0.5); if (a > 0) { c2.save(); c2.globalAlpha = a; txt(c2, s, cx(yr), 668, 40, { align: "center", weight: 800, color: P.ink2 }); c2.restore(); } });
      txt(c2, "5%", CH.x0 - 20, cy(5) + 14, 40, { align: "right", weight: 800, color: P.ink2 }); txt(c2, "0%", CH.x0 - 20, cy(0) + 14, 40, { align: "right", weight: 800, color: P.ink2 });
      tag(c2, "hampir 0%", cx(2012.4), cy(0) - 90, pop(l, tNol).a, { sp: pop(l, tNol).sp, col: P.teal, size: 48 });
      tag(c2, "lagi", cx(2021.2), cy(0) - 90, prog > 0.86 ? pop(l, tNol + 0.5).a : 0, { col: P.teal, size: 44 });
      tag(c2, "bunga ≈ 0", 520, 820 - 200 + 140, ba, { col: P.ink2, size: 44 });
      tag(c2, "perusahaan teknologi", 1400, 900, pop(l, tTanam).a, { sp: pop(l, tTanam).sp, col: P.green, size: 44 });
    });
  };

  // ---------- b3_3: bakar uang ----------
  function layarVoucher(ctx, w, h, t) {
    ctx.fillStyle = "#FFF4E8"; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 5; i++) { const y = h * 0.06 + i * h * 0.185, c = ["#FF6F61", "#5BD68A", "#FFB547", "#5AA9FF", "#FF8FB1"][i];
      ctx.fillStyle = c; RR(ctx, w * 0.06, y, w * 0.88, h * 0.16, 14); ctx.fill();
      ctx.fillStyle = "#FFF4E8"; ctx.beginPath(); ctx.arc(w * 0.06, y + h * 0.08, h * 0.025, 0, TAU); ctx.arc(w * 0.94, y + h * 0.08, h * 0.025, 0, TAU); ctx.fill();
      ctx.setLineDash([8, 8]); ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w * 0.32, y + 10); ctx.lineTo(w * 0.32, y + h * 0.16 - 10); ctx.stroke(); ctx.setLineDash([]);
      txt(ctx, "%", w * 0.19, y + h * 0.11, h * 0.08, { align: "center", weight: 900, color: "#FFFFFF" }); U.bars(ctx, w * 0.38, y + h * 0.05, w * 0.48, h * 0.02, 2, "rgba(255,255,255,0.75)", i); }
  }
  function kembangApi(ctx, x, y, k, col) { if (k <= 0 || k >= 1) return; ctx.save(); ctx.globalAlpha *= 1 - k; for (let i = 0; i < 14; i++) { const a = i * TAU / 14, r = 30 + k * 160;
    ctx.strokeStyle = col; ctx.lineWidth = 6 * (1 - k) + 1; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6 + k * k * 40); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r + k * k * 40); ctx.stroke(); } ctx.restore(); }
  S.b3_3 = function (ctx, b, l, t) {
    const tBakar = D.at(b, "bakar uang"), tOjek = D.at(b, "ojek online"), tPromo = D.at(b, "penuh promo");
    D.bg(ctx, t, { top: "#14184A", bot: "#3A2F6E", stars: 0.7 });
    KY.hp(ctx, 1320, 540, 800, { t, screen: (c, w, h, tt) => layarVoucher(c, w, h, tt), glow: 0.5 });
    // uang terbakar naik lalu jadi kembang api
    const ba = ramp(l, tBakar - 0.5, 0.4);
    if (ba > 0) for (let i = 0; i < 6; i++) { const T = 2.2, ph = ((l - tBakar + i * T / 6) % T + T) % T, u = ph / T; if (l < tBakar - 0.5 + i * 0.2) continue;
      const x = 260 + i * 110, y0 = 940; if (u < 0.6) { ctx.save(); ctx.globalAlpha *= ba; U.uangTerbakar(ctx, x, lerp(y0, 330, eout(u / 0.6)), 1.5, t + i); ctx.restore(); }
      else kembangApi(ctx, x, 300, (u - 0.6) / 0.4, ["#FFD23F", "#FF6F91", "#3FD8C8", "#9584FF"][i % 4]); }
    D.post(c2 => {
      U.judul(c2, "bakar uang", 560, 170, 84, pop(l, tBakar).a, { sp: pop(l, tBakar).sp, col: P.pink });
      tag(c2, "Diskon 90%", 1320 + 250, 330, pop(l, tOjek).a, { sp: pop(l, tOjek).sp, col: "#FF6F61", size: 52 });
      tag(c2, "Gratis ongkir", 1320 - 250, 640, pop(l, tOjek + 0.8).a, { sp: pop(l, tOjek + 0.8).sp, col: P.green, size: 52 });
      tag(c2, "penuh promo", 1320, 900, pop(l, tPromo).a, { sp: pop(l, tPromo).sp, col: P.amber, size: 48 });
    });
  };

  // ---------- b3_4: bunga naik, pipa menetes, investor mengetuk ----------
  S.b3_4 = function (ctx, b, l, t) {
    const tNaik = D.at(b, "suku bunga naik"), tBerhenti = D.at(b, "Uang murah"), tTanya = D.at(b, "mulai bertanya"), tKapan = D.at(b, "Kapan kalian");
    const sw = eio(clamp((l - tTanya + 0.4) / 0.8));
    if (sw < 1) { ctx.save(); ctx.globalAlpha *= 1 - sw;
      const lebar = lerp(1, 0.3, eio(clamp((l - tNaik) / 2.5))), flow = lerp(1, 0, eio(clamp((l - tBerhenti) / 1.5)));
      penampang(ctx, t, { lebar, flow, tetes: flow < 0.2 });
      ctx.restore(); }
    if (sw > 0) { ctx.save(); ctx.globalAlpha *= sw;
      // depan kantor Juragan: dinding, pintu, papan
      ctx.fillStyle = "#5A4A8A"; ctx.fillRect(0, 0, W, 860); ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = 0; x < W; x += 90) ctx.fillRect(x, 0, 40, 860);
      ctx.fillStyle = "#6B4E3D"; ctx.fillRect(0, 860, W, 220);
      ctx.fillStyle = "#3A2F6E"; RR(ctx, 1240, 300, 340, 560, 14); ctx.fill(); ctx.fillStyle = "#8A5A3C"; RR(ctx, 1262, 322, 296, 538, 8); ctx.fill(); ctx.fillStyle = "#FFC94D"; ctx.beginPath(); ctx.arc(1520, 600, 14, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFF6E6"; RR(ctx, 1270, 200, 280, 80, 12); ctx.fill(); txt(ctx, "KANTOR", 1410, 255, 48, { align: "center", weight: 900, color: "#3A2F6E" });
      // pintu bergetar saat diketuk
      const knock = Math.abs(Math.sin(l * 7)) > 0.92 ? 1 : 0; if (knock) { ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 5; [0, 1].forEach(i => { ctx.beginPath(); ctx.arc(1230, 560, 40 + i * 24, Math.PI * 0.75, Math.PI * 1.25); ctx.stroke(); }); }
      // tiga investor (siluet tanpa wajah, tanpa kunci)
      [[700, 0.92], [930, 1], [1130, 1]].forEach(([x, k], i) => U.juragan(ctx, x, 940, 330 * k, { col: ["#2C3E6E", "#34487E", "#2A3A68"][i], rim: P.teal, kunci: false, pose: i === 2 ? "ketuk" : "diam", t: t + i, seed: i, dir: 1 }));
      ctx.restore(); }
    D.post(c2 => {
      if (sw < 0.5) { tag(c2, "2022: suku bunga naik ↑", 960, 140, pop(l, tNaik).a, { sp: pop(l, tNaik).sp, col: P.pink, size: 52 });
        tag(c2, "uang murah berhenti", 800, 900, pop(l, tBerhenti).a, { sp: pop(l, tBerhenti).sp, col: P.amber, size: 44 }); }
      const ka = pop(l, tKapan); if (ka.a > 0 && sw > 0.5) { c2.save(); c2.globalAlpha = ka.a; c2.translate(760, 300); const k = lerp(0.8, 1, ka.sp); c2.scale(k, k);
        c2.fillStyle = "#FFF6E6"; RR(c2, -330, -90, 660, 150, 40); c2.fill(); c2.beginPath(); c2.moveTo(80, 58); c2.lineTo(150, 150); c2.lineTo(160, 58); c2.fill();
        txt(c2, "“Kapan kalian akan untung?”", 0, 12, 48, { align: "center", weight: 900, color: "#2A2350", fit: 620 }); c2.restore(); }
      tag(c2, "investor", 930, 1000 - 90, sw * pop(l, tTanya).a, { col: P.teal, size: 44 });
    });
  };

  // ---------- b3_5: kunci besar ----------
  function kunciBesar(ctx, x, y, s, rot, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); U.addLight(ctx, 0, 0, s * 1.4, "#FFC94D", 0.4);
    ctx.strokeStyle = "#FFC94D"; ctx.lineWidth = s * 0.16; ctx.beginPath(); ctx.arc(0, -s * 0.45, s * 0.3, 0, TAU); ctx.stroke();
    ctx.fillStyle = "#FFC94D"; ctx.fillRect(-s * 0.08, -s * 0.18, s * 0.16, s * 1.1); ctx.fillRect(0, s * 0.6, s * 0.3, s * 0.12); ctx.fillRect(0, s * 0.8, s * 0.22, s * 0.12); ctx.restore(); }
  S.b3_5 = function (ctx, b, l, t) {
    const tSatu = D.at(b, "satu hal"), tPergi = D.at(b, "tidak ada pelanggan");
    const c = D.path([[0, 960, 560, 0.9], [b.dur, 1000, 600, 1.12]], l);
    ctx.save(); U.camT(ctx, c);
    U.pasar(ctx, t, { esTeh: true, suram: 0.15 * ramp(l, tPergi, 2) });
    U.pengunjung(ctx, t, 9, { y: 1010, h: 230, seed: 3, v: 50 });
    U.juragan(ctx, 960, U.FLOOR + 90, 330, { pose: "angkat", k: ramp(l, tSatu - 0.3, 0.8) * 0.55, t, dir: -1, bawa: (c2, u) => kunciBesar(c2, 0, -14 * u, 26 * u, 0.3 + Math.sin(t * 2) * 0.08, t) });
    // gapura disorot
    const ha = ramp(l, tPergi, 0.6); if (ha > 0) { ctx.strokeStyle = D.hexA(P.pink, 0.8 * ha * (0.7 + 0.3 * Math.sin(t * 4))); ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.lineDashOffset = -t * 30; ctx.strokeRect(700, 390, 520, 470); ctx.setLineDash([]); }
    ctx.restore();
    D.post(c2 => U.judul(c2, "Tidak ada yang mudah pergi", 960, 160, 64, pop(l, tPergi).a, { sp: pop(l, tPergi).sp, col: P.pink }));
  };

  K.SCENES.d05_b3 = function (ctx, b, l, t, TL) { const f = S[b.id]; ctx.save(); U.napas(ctx, t); if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); ctx.restore(); };
  K.SCENES.d05_b3.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b3 = TL => [
    K.sfxAt(TL, "b3_1", "investor", 0, "shimmer", 0.5), K.sfxAt(TL, "b3_2", "dekat nol", 0, "pop", 0.4), K.sfxAt(TL, "b3_2", "menanam uangnya", 0, "whoosh", 0.4),
    K.sfxAt(TL, "b3_3", "bakar uang", 0, "boom", 0.5), K.sfxAt(TL, "b3_3", "ojek online", 0, "pop", 0.4),
    K.sfxAt(TL, "b3_4", "suku bunga naik", 0, "riser", 0.5), K.sfxAt(TL, "b3_4", "mulai bertanya", 0, "clack", 0.6), K.sfxAt(TL, "b3_4", "Kapan kalian", 0, "pop", 0.4),
    K.sfxAt(TL, "b3_5", "tidak ada pelanggan", 0, "boom", 0.5),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
