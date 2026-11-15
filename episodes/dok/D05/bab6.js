/* D05 bab 6 — Tahap tiga: memeras mitra bisnis (b6_1 … b6_6).
   b6_1 100 ikon pengikut di depan halaman generik: 16 menyala (2012) → 6–7 (2014), tombol "Promosikan unggahan" berkedip;
   b6_2 grafik batang potongan penjual Amazon 2014 19%, 2017 27%, 2020 35%, 2023 45% (ILSR) + uang Rp100.000 terpotong; gugatan + bantahan;
   b6_3 struk penjualan Bu Sari, baris potongan muncul satu per satu, "hingga ±30%" (perhitungan sebagian penjual);
   b6_4 deretan helm & jaket generik (tanpa warna perusahaan), spanduk "Potongan 10%", kartu pernyataan aplikator netral;
   b6_5 harga kue Rp10.000 → Rp13.000 (ilustrasi), semua cemberut, karung uang ke kantor Juragan; b6_6 Juragan dan pemegang saham di kantor. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KY = KIT.layar;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};
  function karung(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "#E9C46A"; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.45, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#C9A24A"; ctx.fillRect(-s * 0.2, -s * 0.55, s * 0.4, s * 0.16);
    txt(ctx, "Rp", 0, s * 0.18, s * 0.42, { align: "center", weight: 900, color: "#7A5A1E" }); ctx.restore(); }
  U.karung = karung;

  // ---------- b6_1: jangkauan unggahan ----------
  function ikonOrang(ctx, x, y, s, on) { ctx.fillStyle = on ? P.amber : "rgba(185,199,234,0.22)"; ctx.beginPath(); ctx.arc(x, y - s * 0.22, s * 0.2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + s * 0.3, s * 0.32, s * 0.26, 0, Math.PI, 0); ctx.fill();
    if (on) U.addLight(ctx, x, y, s * 0.9, P.amber, 0.25); }
  S.b6_1 = function (ctx, b, l, t) {
    const tHal = D.at(b, "unggahan halaman"), t12 = D.at(b, "dua ribu dua belas"), tDua = D.at(b, "dua tahun kemudian"), tEnam = D.at(b, "enam koma lima"), tBayar = D.at(b, "harus membayar");
    U.studio(ctx, t);
    // halaman generik (toko/media) di kiri
    const ha = ramp(l, 0.3, 0.5); ctx.save(); ctx.globalAlpha *= ha;
    D.panel(ctx, 150, 200, 520, 640, { r: 26, fill: "#F4F6FF", stroke: "#8C93B8" });
    ctx.fillStyle = P.blue; RR(ctx, 150, 200, 520, 150, 26); ctx.fill(); ctx.fillStyle = "#F4F6FF"; ctx.fillRect(150, 320, 520, 30);
    ctx.fillStyle = "#FFB547"; ctx.beginPath(); ctx.arc(250, 350, 62, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); ctx.arc(250, 350, 48, 0, TAU); ctx.fill(); U.lapak(ctx, 250, 384, 70, { col: U.AWN[0], barang: "kue", t, seed: 2 });
    txt(ctx, "Halaman", 340, 400, 48, { weight: 900, color: "#2A2350" });
    ctx.fillStyle = "#FFFFFF"; RR(ctx, 180, 450, 460, 250, 18); ctx.fill(); ctx.fillStyle = "#FFD38A"; RR(ctx, 200, 520, 420, 160, 14); ctx.fill(); U.bars(ctx, 200, 472, 300, 14, 2, "rgba(40,50,100,0.35)", 2);
    ctx.restore();
    // grid 100 pengikut
    const reach = l < tDua ? lerp(0, 16, clamp((l - t12 + 0.6) / 1.4)) : lerp(16, 6.5, eio(clamp((l - tDua) / 1.6)));
    const order = (() => { const r = D.rng(31), idx = Array.from({ length: 100 }, (_, i) => i); for (let i = 99; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return idx; })();
    const lit = new Set(order.slice(0, Math.round(reach)));
    const ga = ramp(l, tHal - 0.3, 0.5);
    ctx.save(); ctx.globalAlpha *= ga; for (let i = 0; i < 100; i++) { const x = 840 + (i % 10) * 64, y = 260 + Math.floor(i / 10) * 60; ikonOrang(ctx, x, y, 50, lit.has(i)); } ctx.restore();
    // tombol promosikan
    const pa = ramp(l, tBayar - 0.4, 0.4);
    D.post(c2 => {
      tag(c2, l < tDua ? "2012" : "2014", 1130, 180 - 30, ramp(l, t12, 0.3), { col: l < tDua ? P.green : P.pink, size: 56 });
      const pct = l < tDua ? Math.round(reach) + "%" : (reach < 7 ? "6,5%" : Math.round(reach) + "%");
      tag(c2, "menjangkau " + pct + " pengikut", 1130, 900, ramp(l, t12, 0.3), { col: P.amber, size: 52 });
      tag(c2, "100 pengikut", 1640, 520, ga, { col: P.ink2, size: 44 });
      if (pa > 0) { const blink = 0.75 + 0.25 * Math.sin(t * 8); c2.save(); c2.globalAlpha = pa; c2.translate(410, 760); c2.scale(lerp(0.8, 1, pa) * (0.97 + 0.03 * blink), lerp(0.8, 1, pa) * (0.97 + 0.03 * blink));
        c2.fillStyle = D.hexA("#FF6F61", blink); RR(c2, -230, -44, 460, 88, 44); c2.fill(); txt(c2, "Promosikan unggahan", 0, 16, 44, { align: "center", weight: 900, color: "#FFFFFF", fit: 420 }); c2.restore(); }
      tag(c2, "data: perusahaan analisis media sosial", 620, 140, pop(l, t12 - 1.5).a, { col: P.ink2, size: 40 });
    });
  };

  // ---------- b6_2: grafik batang Amazon ----------
  const BARS = [["2014", 19], ["2017", 27], ["2020", 35], ["2023", 45]];
  function uangKertas(ctx, x, y, w, cut, t) {   // Rp100.000 bergaya, bagian kanan (cut%) terpotong lepas
    const h = w * 0.46, cw = w * cut / 100;
    const body = (x0, w0, drop, rot) => { ctx.save(); ctx.translate(x0 + w0 / 2, y + drop); ctx.rotate(rot); ctx.fillStyle = "#FF8FA0"; RR(ctx, -w0 / 2, -h / 2, w0, h, 10); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 4; RR(ctx, -w0 / 2 + 10, -h / 2 + 10, w0 - 20, h - 20, 8); ctx.stroke(); ctx.restore(); };
    ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - h, w - cw, h * 2); ctx.clip(); body(x - w / 2, w, 0, 0); txt(ctx, "Rp100.000", x - w / 2 + 22, y + 16, 44, { weight: 900, color: "#FFFFFF" }); ctx.restore();
    if (cw > 0) { ctx.save(); const dx = 40 * clamp(cut / 20); ctx.translate(dx, 30 * clamp(cut / 20)); ctx.beginPath(); ctx.rect(x + w / 2 - cw, y - h, cw, h * 2); ctx.clip(); body(x - w / 2, w, 0, 0); ctx.restore();
      ctx.strokeStyle = "#FFFFFF"; ctx.setLineDash([10, 8]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + w / 2 - cw, y - h / 2 - 20); ctx.lineTo(x + w / 2 - cw, y + h / 2 + 20); ctx.stroke(); ctx.setLineDash([]); }
  }
  S.b6_2 = function (ctx, b, l, t) {
    const tRiset = D.at(b, "lembaga riset"), t14 = D.at(b, "sembilan belas"), t23 = D.at(b, "empat puluh lima"), tGugat = D.at(b, "menggugat"), tBantah = D.at(b, "membantah");
    U.studio(ctx, t);
    const X0 = 220, Y0 = 820, BW = 150, GAP = 90, k = 11;
    ctx.strokeStyle = D.hexA(P.ink, 0.5); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X0 - 30, Y0); ctx.lineTo(X0 + 4 * (BW + GAP), Y0); ctx.stroke();
    let cur = 0;
    BARS.forEach(([yr, v], i) => { const t0 = lerp(t14, t23, i / 3), g2 = eout(clamp((l - t0 + 0.2) / 0.9)); if (g2 <= 0) return; cur = Math.max(cur, v * g2);
      const x = X0 + i * (BW + GAP), h = v * k * g2; const gr = ctx.createLinearGradient(0, Y0 - h, 0, Y0); gr.addColorStop(0, i === 3 ? P.pink : P.amber); gr.addColorStop(1, i === 3 ? "#B8456A" : "#C98A2A");
      ctx.fillStyle = gr; RR(ctx, x, Y0 - h, BW, h, 12); ctx.fill(); });
    const cut = cur, ua = ramp(l, t14 - 0.3, 0.5);
    if (ua > 0) { ctx.save(); ctx.globalAlpha *= ua; uangKertas(ctx, 1440, 420, 520, cut, t); ctx.restore(); }
    const ga = ramp(l, tGugat - 0.2, 0.5); if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; ctx.translate(1760, 760); ctx.rotate(-0.5 + 0.5 * eout(clamp((l - tGugat) / 0.4)));
      ctx.fillStyle = "#8A5A3C"; RR(ctx, -16, -10, 32, 150, 10); ctx.fill(); ctx.fillStyle = "#A8714C"; RR(ctx, -80, -60, 160, 70, 18); ctx.fill(); ctx.restore(); }
    D.post(c2 => {
      tag(c2, "potongan Amazon dari penjualan pedagang", 960, 120, pop(l, 0.4).a, { col: P.amber, size: 44 });
      tag(c2, "termasuk iklan & pengiriman · data ILSR (AS)", 680, 210, pop(l, tRiset).a, { col: P.ink2, size: 40 });
      BARS.forEach(([yr, v], i) => { const t0 = lerp(t14, t23, i / 3), a = ramp(l, t0, 0.4); if (a <= 0) return; const x = X0 + i * (BW + GAP) + BW / 2;
        txt(c2, yr, x, Y0 + 56, 44, { align: "center", weight: 800, color: P.ink2 }); c2.save(); c2.globalAlpha = a; txt(c2, v + "%", x, Y0 - v * k - 22, 56, { align: "center", weight: 900, color: i === 3 ? P.pink : P.amber }); c2.restore(); });
      tag(c2, "dari tiap Rp100.000, dipotong " + Math.round(cut) + "%", 1440, 620 - 0, ua, { col: P.pink, size: 44 });
      tag(c2, "digugat pemerintah AS", 1440, 870 - 60, pop(l, tGugat).a, { sp: pop(l, tGugat).sp, col: P.blue, size: 44 });
      tag(c2, "Amazon membantah", 1440, 900, pop(l, tBantah).a, { sp: pop(l, tBantah).sp, col: P.ink2, size: 44 });
    });
  };

  // ---------- b6_3: struk Bu Sari ----------
  const ROWS = [["biaya admin", ""], ["biaya proses", "Rp1.250"], ["biaya logistik", ""], ["iklan", ""]];
  S.b6_3 = function (ctx, b, l, t) {
    const tInd = D.at(b, "Di Indonesia"), tBaru = D.at(b, "biaya baru"), tHitung = D.at(b, "menghitung"), tTiga = D.at(b, "tiga puluh persen");
    U.studio(ctx, t, { top: "#22285E", bot: "#3E3A80" });
    U.orang(ctx, 420, 1000, 560, U.SARI, { pose: l > tTiga ? "garuk" : "pegangHP", face: l > tHitung ? "sedih" : "netral", t });
    // struk
    const sa = ramp(l, 0.3, 0.6), x = 820, y = 110, w = 760, rh = 96;
    ctx.save(); ctx.globalAlpha *= sa; ctx.fillStyle = "rgba(10,10,30,0.35)"; ctx.fillRect(x + 12, y + 14, w, 760);
    ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + 760); for (let k2 = 0; k2 <= 19; k2++) ctx.lineTo(x + w - k2 * w / 19, y + 760 + (k2 % 2 ? 0 : 18)); ctx.closePath(); ctx.fill();
    ctx.restore();
    D.post(c2 => { c2.globalAlpha = sa;
      txt(c2, "PENJUALAN KUE BU SARI", x + w / 2, y + 70, 44, { align: "center", weight: 900, color: "#2A2350" });
      txt(c2, "Harga jual", x + 40, y + 160, 44, { weight: 800, color: "#2A2350" }); txt(c2, "Rp100.000", x + w - 40, y + 160, 44, { align: "right", weight: 900, color: "#2A2350" });
      c2.fillStyle = "rgba(40,50,100,0.3)"; c2.fillRect(x + 30, y + 190, w - 60, 3);
      ROWS.forEach(([s, v], i) => { const a = ramp(l, tBaru + i * 0.9, 0.35); if (a <= 0) return; const yy = y + 260 + i * rh; c2.save(); c2.globalAlpha = a * sa; c2.translate((1 - eout(a)) * 40, 0);
        txt(c2, "− " + s, x + 40, yy, 44, { weight: 800, color: "#C7413B" }); txt(c2, v, x + w - 40, yy, 44, { align: "right", weight: 900, color: "#C7413B" }); c2.restore(); });
      const ta = pop(l, tTiga); if (ta.a > 0) { c2.save(); c2.globalAlpha = ta.a; c2.fillStyle = "rgba(40,50,100,0.3)"; c2.fillRect(x + 30, y + 640, w - 60, 3);
        txt(c2, "Total potongan", x + 40, y + 715, 48, { weight: 900, color: "#2A2350" }); txt(c2, "hingga ±30%", x + w - 40, y + 715, 52, { align: "right", weight: 900, color: "#C7413B" }); c2.restore(); }
      c2.globalAlpha = 1;
      tag(c2, "marketplace besar, sejak 2025", 420, 150, pop(l, tInd).a, { sp: pop(l, tInd).sp, col: P.amber, size: 44 });
      tag(c2, "perhitungan sebagian penjual", 1200, 940 - 20, pop(l, tHitung).a, { col: P.ink2, size: 40 });
    });
  };

  // ---------- b6_4: demo pengemudi ----------
  function helm(ctx, x, y, r, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r * 1.15, Math.PI, 0); ctx.lineTo(x + r * 1.2, y + r * 0.25); ctx.lineTo(x - r * 1.2, y + r * 0.25); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.5, r * 0.3, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(20,26,70,0.55)"; ctx.fillRect(x - r * 1.1, y + r * 0.05, r * 2.2, r * 0.2); }
  S.b6_4 = function (ctx, b, l, t) {
    const tDemo = D.at(b, "berdemo"), tTuntut = D.at(b, "menuntut"), tJawab = D.at(b, "Perusahaan aplikasi menjawab"), tAsur = D.at(b, "asuransi");
    const sky = ctx.createLinearGradient(0, 0, 0, 800); sky.addColorStop(0, "#4A6CC4"); sky.addColorStop(1, "#E8C8A8"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HH);
    // gedung generik
    ctx.fillStyle = "#3A4A8A"; ctx.fillRect(220, 160, 1000, 640); for (let f = 0; f < 9; f++) for (let c = 0; c < 12; c++) { ctx.fillStyle = (f + c) % 5 ? "rgba(180,210,255,0.35)" : "rgba(255,226,154,0.6)"; ctx.fillRect(250 + c * 80, 190 + f * 64, 56, 40); }
    ctx.fillStyle = "#9A9AA8"; ctx.fillRect(0, 800, W, 280);
    // pengemudi: jaket abu-biru, helm warna-warni netral
    const n = 11, xs = Array.from({ length: n }, (_, i) => 120 + i * 105);
    const anchors = xs.map((x, i) => U.orang(ctx, x, 980 - (i % 2) * 30, 280, { age: "dewasa", hair: "pendek", skin: (i * 2) % 6, top: "#55607E", outfit: "hoodie", lengan: "panjang", bottom: "#2F3462" }, { pose: i % 3 === 0 ? "lega" : "berdiri", face: "netral", t: t + i, seed: i, alis: true, flip: i % 2 === 0 }));
    anchors.forEach((A, i) => helm(ctx, A.head[0], A.head[1] - 4, A.scale * 9.5, ["#E6EAF8", "#8C93B8", "#FFD38A", "#C9CFEA", "#2A2E58"][i % 5]));
    // spanduk dibentangkan
    const sa = eout(clamp((l - tTuntut + 0.4) / 0.8)); if (sa > 0) { ctx.save(); ctx.translate(680, 640); ctx.scale(sa, 1); ctx.fillStyle = "#FFF6E6"; ctx.fillRect(-380, -60, 760, 120); ctx.strokeStyle = "#C7413B"; ctx.lineWidth = 8; ctx.strokeRect(-380, -60, 760, 120);
      ctx.restore(); }
    // kartu pernyataan aplikator (netral)
    const ka = ramp(l, tJawab - 0.3, 0.5); if (ka > 0) { ctx.save(); ctx.globalAlpha *= ka; D.panel(ctx, 1290, 220, 540, 520, { r: 22, fill: "#F4F6FF", stroke: "#8C93B8", lw: 4 }); ctx.restore(); }
    D.post(c2 => {
      if (sa > 0.6) { c2.save(); c2.globalAlpha = clamp((sa - 0.6) * 3); txt(c2, "POTONGAN 10%", 680, 664, 64, { align: "center", weight: 900, color: "#C7413B" }); c2.restore(); }
      tag(c2, "pengemudi ojek online · 2025", 720, 120, pop(l, tDemo).a, { sp: pop(l, tDemo).sp, col: P.amber, size: 48 });
      tag(c2, "potongan 20% → 10%", 680, 500, pop(l, tTuntut + 1.0).a, { sp: pop(l, tTuntut + 1.0).sp, col: P.pink, size: 48 });
      if (ka > 0) { c2.save(); c2.globalAlpha = ka; txt(c2, "Kata aplikator:", 1560, 300, 48, { align: "center", weight: 900, color: "#2A2350" });
        ["asuransi", "promo", "pengembangan"].forEach((s, i) => { const a = ramp(l, tAsur + i * 0.6, 0.3); c2.globalAlpha = ka * a; txt(c2, "• " + s, 1360, 410 + i * 100, 48, { weight: 800, color: "#3A4A8A" }); }); c2.restore(); }
    });
  };

  // ---------- b6_5: harga naik ----------
  S.b6_5 = function (ctx, b, l, t) {
    const tHarga = D.at(b, "harga yang lebih mahal"), tSewa = D.at(b, "sewa lapak naik"), tDag = D.at(b, "harga dagangan"), tRugi = D.at(b, "merasa dirugikan");
    const c = { x: 960, y: 560, z: 1 };
    U.pasar(ctx, t, { stalls: false, gate: true, suram: 0.45, label: false });
    U.palang(ctx, t, 1, 1);
    U.lapak(ctx, 420, U.FLOOR + 10, 400, { col: U.AWN[0], barang: "kue", label: "KUE BU SARI", t, seed: 4 });
    U.orang(ctx, 640, U.FLOOR + 120, 380, U.SARI, { pose: "berdiri", face: l > tRugi - 0.5 ? "sedih" : "netral", t, flip: true });
    // pembeli
    [[880, 0], [1100, 1], [1300, 2]].forEach(([x, i]) => U.orang(ctx, x, U.FLOOR + 140, 360, { age: i === 1 ? "remaja" : "dewasa", hair: ["hijab", "pendek", "kuncir"][i], skin: i * 2 + 1, top: U.AWN[i + 3], bottom: "#3B4785", outfit: "kaos", hijab: "#3FAE9E" }, { pose: l > tDag + 0.5 ? "garuk" : "berdiri", face: l > tRugi - 0.5 ? "sedih" : "netral", t: t + i, seed: i, flip: true }));
    // karung ke kantor Juragan (kanan)
    ctx.fillStyle = "#3A2F6E"; RR(ctx, 1600, 520, 260, 340, 12); ctx.fill(); ctx.fillStyle = "#FFF6E6"; RR(ctx, 1620, 450, 220, 70, 12); ctx.fill(); txt(ctx, "KANTOR", 1730, 500, 44, { align: "center", weight: 900, color: "#3A2F6E" });
    const ru = ramp(l, tRugi - 0.6, 2.0); for (let i = 0; i < 3; i++) { const u = clamp(ru * 1.5 - i * 0.25); if (u <= 0 || u >= 1) continue; karung(ctx, lerp(560, 1700, u), U.FLOOR + 50 - Math.abs(Math.sin(u * 9)) * 40, 80, u * 18); }
    // label harga
    const pu = clamp((l - tDag) / 0.8); const harga = pu < 0.5 ? "Rp10.000" : "Rp13.000";
    D.post(c2 => {
      c2.save(); c2.translate(420, 540); c2.rotate(-0.05 + Math.sin(pu * Math.PI) * 0.15); c2.fillStyle = pu < 0.5 ? "#FFF6E6" : "#FFE0E0"; RR(c2, -150, -46, 300, 96, 16); c2.fill(); c2.strokeStyle = pu < 0.5 ? P.green : P.red; c2.lineWidth = 6; c2.stroke();
      txt(c2, harga, 0, 20, 56, { align: "center", weight: 900, color: pu < 0.5 ? "#2A6A3A" : "#C7413B" }); c2.restore();
      tag(c2, "ilustrasi", 420, 640, 0.9, { col: P.ink2, size: 40 });
      tag(c2, "biaya kembali kepadamu", 960, 140, pop(l, tHarga).a, { sp: pop(l, tHarga).sp, col: P.pink, size: 52 });
      tag(c2, "sewa lapak naik ↑", 1100, 240, pop(l, tSewa).a, { sp: pop(l, tSewa).sp, col: P.amber, size: 48 });
    });
  };

  // ---------- b6_6: pemilik dan pemegang saham ----------
  S.b6_6 = function (ctx, b, l, t) {
    const tPem = D.at(b, "pemilik platform"), tSaham = D.at(b, "pemegang sahamnya");
    const z = lerp(1.0, 1.08, eio(l / b.dur)); ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960, -600);
    U.kantor(ctx, t);
    U.addLight(ctx, 960, 560, 700, "#FFC94D", 0.35);
    for (let i = 0; i < 9; i++) karung(ctx, 640 + (i % 5) * 150 + (Math.floor(i / 5) * 70), 600 - Math.floor(i / 5) * 90, 130, Math.sin(i) * 0.1);
    U.juragan(ctx, 960, 960, 400, { pose: "angkat", k: 0.6, t, dir: 1 });
    const sa = ramp(l, tSaham - 0.3, 0.5); if (sa > 0) { ctx.save(); ctx.globalAlpha *= sa; [[520, 1], [1400, -1]].forEach(([x, d], i) => U.juragan(ctx, x, 960, 360, { col: "#2C3E6E", rim: P.teal, kunci: false, pose: "bagi", k: 0.5 + 0.5 * Math.sin(t * 2 + i), t, dir: d })); ctx.restore(); }
    ctx.restore();
    D.post(c2 => { tag(c2, "pemilik platform", 960, 150, pop(l, tPem).a, { sp: pop(l, tPem).sp, col: P.amber, size: 52 });
      tag(c2, "+ pemegang saham", 960, 250, pop(l, tSaham).a, { sp: pop(l, tSaham).sp, col: P.teal, size: 48 }); });
  };

  K.SCENES.d05_b6 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d05_b6.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b6 = TL => [
    K.sfxAt(TL, "b6_1", "dua ribu dua belas", 0, "shimmer", 0.4), K.sfxAt(TL, "b6_1", "dua tahun kemudian", 0.3, "whoosh", 0.5), K.sfxAt(TL, "b6_1", "harus membayar", 0, "pop", 0.5),
    K.sfxAt(TL, "b6_2", "sembilan belas", 0, "pop", 0.4), K.sfxAt(TL, "b6_2", "empat puluh lima", 0, "boom", 0.6), K.sfxAt(TL, "b6_2", "menggugat", 0, "clack", 0.7),
    K.sfxAt(TL, "b6_3", "biaya baru", 0, "clack", 0.4), K.sfxAt(TL, "b6_3", "tiga puluh persen", 0, "boom", 0.5),
    K.sfxAt(TL, "b6_4", "menuntut", 0.6, "whoosh", 0.4), K.sfxAt(TL, "b6_5", "harga dagangan", 0.3, "pop", 0.5), K.sfxAt(TL, "b6_6", "pemegang sahamnya", -0.3, "shimmer", 0.5),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
