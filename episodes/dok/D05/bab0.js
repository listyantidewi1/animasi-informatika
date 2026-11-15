/* D05 bab 0 — Pembuka (b0_1 … b0_6).
   b0_1 HP generik, kolom cari besar mengetik "tempat tidur kucing", hasil muncul, papan skor Bip "? %", "Tebak dulu";
   b0_2 daftar menggulir, kartu iklan diberi pita "Bersponsor", papan naik ke 50%, papan ketik + label "Cory Doctorow · Januari 2023" (tanpa wajah);
   b0_3 hasil terbelah: kiri "paling cocok" meredup, kanan "membayar" menyala; b0_4 tiga HP dulu → sekarang;
   b0_5 kamera mundur ke gedung kantor kaca, lampu tiap lantai, tanda tanya; b0_6 janji isi + judul video. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KY = KIT.layar;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};
  const IKLAN = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0];   // separuh kartu adalah iklan
  const TITLE = "Kenapa Aplikasi Favoritmu Makin Menyebalkan?";

  function latarKamar(ctx, t, a = 1) {
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, "#2B2F6E"); gr.addColorStop(1, "#4A3F86"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    U.addLight(ctx, 960, 560, 900, "#7F9CFF", 0.25); ctx.fillStyle = "rgba(255,255,255,0.04)"; for (let x = 40; x < W; x += 120) for (let y = 40; y < HH; y += 120) { ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); }
  }
  // tempat tidur kucing (gambar produk)
  function kasurKucing(ctx, x, y, s, col, t) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.beginPath(); ctx.ellipse(0, s * 0.02, s * 0.38, s * 0.19, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#F2A65A"; ctx.beginPath(); ctx.ellipse(-s * 0.04, -s * 0.02, s * 0.2, s * 0.11, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.15, -s * 0.06, s * 0.09, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.12); ctx.lineTo(s * 0.13, -s * 0.2); ctx.lineTo(s * 0.17, -s * 0.13); ctx.fill(); ctx.beginPath(); ctx.moveTo(s * 0.17, -s * 0.13); ctx.lineTo(s * 0.21, -s * 0.2); ctx.lineTo(s * 0.23, -s * 0.1); ctx.fill();
    ctx.restore();
  }
  // layar hasil pencarian (koordinat layar lokal). o.n kartu tampil, o.scroll, o.sorot 0..1 (kartu iklan disorot kuning)
  function layarHasil(ctx, w, h, t, o = {}) {
    ctx.fillStyle = "#F4F6FF"; ctx.fillRect(0, 0, w, h);
    const header = () => { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, w, h * 0.11); ctx.fillStyle = "rgba(40,50,100,0.12)"; ctx.fillRect(0, h * 0.11, w, 2);
    ctx.fillStyle = "#E6EAF8"; RR(ctx, w * 0.05, h * 0.03, w * 0.9, h * 0.06, h * 0.03); ctx.fill();
    ctx.strokeStyle = "#8C93B8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(w * 0.12, h * 0.06, h * 0.014, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(w * 0.135, h * 0.073); ctx.lineTo(w * 0.15, h * 0.083); ctx.stroke();
    U.bars(ctx, w * 0.2, h * 0.052, w * 0.55 * clamp(o.ketik == null ? 1 : o.ketik), h * 0.016, 1, "rgba(40,50,100,0.45)", 4); };
    const ch = h * 0.17, gap = h * 0.018, out = []; let y = h * 0.125 - (o.scroll || 0); const n = o.n == null ? 99 : o.n;
    for (let i = 0; i < IKLAN.length; i++) { const a = clamp(n - i); const ad = IKLAN[i];
      if (a > 0 && y < h && y + ch > 0) { ctx.save(); ctx.globalAlpha *= a;
        const so = ad ? clamp(o.sorot == null ? 0 : (o.sorot * 10 - (i * 0.6))) : 0;
        ctx.fillStyle = so > 0 ? U.mix("#FFFFFF", "#FFF2B8", so) : "#FFFFFF"; RR(ctx, w * 0.04, y, w * 0.92, ch, 14); ctx.fill();
        ctx.strokeStyle = so > 0 ? D.hexA("#FFC94D", so) : "rgba(40,50,100,0.12)"; ctx.lineWidth = so > 0 ? 5 : 2; ctx.stroke();
        ctx.fillStyle = "#E6EAF8"; RR(ctx, w * 0.07, y + ch * 0.1, ch * 0.8, ch * 0.8, 12); ctx.fill();
        kasurKucing(ctx, w * 0.07 + ch * 0.4, y + ch * 0.55, ch * 0.62, U.AWN[(i * 3) % 7], t);
        U.bars(ctx, w * 0.07 + ch * 0.95, y + ch * 0.18, w * 0.42, ch * 0.08, 2, "rgba(40,50,100,0.35)", i + 1);
        ctx.fillStyle = "#FF6F61"; RR(ctx, w * 0.07 + ch * 0.95, y + ch * 0.62, w * 0.2, ch * 0.12, 6); ctx.fill();
        ctx.fillStyle = "#FFC94D"; for (let s = 0; s < 5; s++) { ctx.beginPath(); ctx.arc(w * 0.07 + ch * 0.95 + s * w * 0.045 + 6, y + ch * 0.86, w * 0.014, 0, TAU); ctx.fill(); }
        ctx.restore(); }
      out.push({ y, h: ch, ad }); y += ch + gap; }
    header(); return out;
  }
  // kolom cari besar (di luar HP)
  function kolomCari(ctx, x, y, w, s, u, t, a = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = "rgba(10,18,52,0.35)"; RR(ctx, x - w / 2 + 6, y - 50, w, 112, 56); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; RR(ctx, x - w / 2, y - 58, w, 112, 56); ctx.fill(); ctx.strokeStyle = P.amber; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = "#5C6390"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x - w / 2 + 70, y - 4, 20, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - w / 2 + 85, y + 11); ctx.lineTo(x - w / 2 + 100, y + 26); ctx.stroke();
    const n = Math.floor(s.length * clamp(u)), shown = s.slice(0, n);
    txt(ctx, shown, x - w / 2 + 130, y + 18, 56, { weight: 800, color: "#2A2350" });
    ctx.font = `800 56px ${FONT}`; const cw = ctx.measureText(shown).width;
    if (Math.floor(t * 2.2) % 2 === 0 || u < 1) { ctx.fillStyle = "#2A2350"; ctx.fillRect(x - w / 2 + 136 + cw, y - 30, 5, 60); }
    ctx.restore();
  }
  // papan skor Bip (berdiri), nilai null = "?"
  function papanSkor(ctx, x, y, val, t, a = 1, o = {}) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = "#6E4630"; ctx.fillRect(x - 70, y + 90, 14, 150); ctx.fillRect(x + 56, y + 90, 14, 150);
    D.panel(ctx, x - 170, y - 110, 340, 220, { r: 26, fill: "#1A2458", stroke: P.amber, lw: 5 });
    txt(ctx, o.judul || "iklan", x, y - 50, 44, { align: "center", weight: 800, color: P.ink2 });
    txt(ctx, val == null ? "? %" : Math.round(val) + "%", x, y + 70, 104, { align: "center", weight: 900, color: val == null ? P.pink : P.amber });
    ctx.restore();
  }
  function hpCari(ctx, cx, cy, h, t, o) { return KY.hp(ctx, cx, cy, h, { t, screen: (c, w, hh, tt) => layarHasil(c, w, hh, tt, o), glow: 0.4 }); }

  // ---------- b0_1 ----------
  S.b0_1 = function (ctx, b, l, t) {
    const tCari = D.at(b, "cari"), tTebak = D.at(b, "tebak dulu"), tBerapa = D.at(b, "Dari semua");
    latarKamar(ctx, t);
    const ketik = clamp((l - tCari - 0.2) / 2.0), nRes = clamp((l - tCari - 2.4) / 1.6) * 8;
    const z = lerp(1, 1.04, eio(l / b.dur)); ctx.save(); ctx.translate(820, 560); ctx.scale(z, z); ctx.translate(-820, -560);
    const A = hpCari(ctx, 820, 600, 880, t, { n: nRes, ketik });
    // jari menekan kolom cari saat mengetik
    if (l > tCari - 0.5 && l < tCari + 2.6) { const p = A.map(A.screen.w * 0.55, A.screen.h * 0.06); KY.jari(ctx, p.x + 20, p.y + 10, 110, { tekan: 0.5 + 0.5 * Math.sin(l * 12), t, lengan: "#5AA9FF" }); }
    ctx.restore();
    // Bip dan papan skor kosong
    papanSkor(ctx, 1500, 480, null, t, ramp(l, 1.0, 0.5));
    KB.draw(ctx, 1700, 780, 200, { pose: l > tTebak ? "tunjuk" : "diam", target: [1500, 480], mood: "think", t });
    D.post(c2 => { kolomCari(c2, 820, 150, 900, "tempat tidur kucing", ketik, t, ramp(l, tCari - 0.6, 0.4));
      U.judul(c2, "Tebak dulu: berapa persen yang iklan?", 960, 880, 60, pop(l, tTebak).a, { sp: pop(l, tTebak).sp, col: P.pink }); });
  };

  // ---------- b0_2 ----------
  function papanKetik(ctx, x, y, s, t) {   // papan ketik laptop generik (perspektif)
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#3A3F78"; ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.25); ctx.lineTo(s * 0.5, s * 0.25); ctx.lineTo(s * 0.4, -s * 0.2); ctx.lineTo(-s * 0.4, -s * 0.2); ctx.closePath(); ctx.fill();
    for (let r = 0; r < 4; r++) { const v = r / 4, yy = lerp(-s * 0.16, s * 0.17, v), ww = lerp(s * 0.76, s * 0.92, v), kw = ww / 12;
      for (let k = 0; k < 12; k++) { const press = ((Math.floor(t * 9) + r * 5 + k * 7) % 23) === 0; ctx.fillStyle = press ? P.amber : "#E6EAF8"; RR(ctx, -ww / 2 + k * kw + 2, yy - (press ? 0 : 2), kw - 5, s * 0.07, 4); ctx.fill(); } }
    ctx.restore();
  }
  S.b0_2 = function (ctx, b, l, t) {
    const tDoc = D.at(b, "Cory Doctorow"), tAmz = D.at(b, "Amazon"), tSep = D.at(b, "separuh"), tLima = D.at(b, "lima layar");
    latarKamar(ctx, t);
    const scroll = Math.max(0, l - 1.5) * 38, sorot = clamp((l - 1.0) / Math.max(1, tSep + 1 - 1.0));
    const A = hpCari(ctx, 960, 560, 880, t, { scroll, sorot });
    // pita Bersponsor pada kartu iklan yang sudah disorot
    const cards = A.out || [];
    const counted = cards.filter((c, i) => c.ad && sorot * 10 - i * 0.6 > 0.5).length;
    const total = Math.max(1, cards.filter((c, i) => i * 0.6 < sorot * 10 + 0.01 * 0).length);
    // penghitung papan: naik menuju 50%
    const val = lerp(0, 50, eout(clamp((l - 1.2) / Math.max(1, tSep + 0.8 - 1.2))));
    papanSkor(ctx, 1520, 430, l < 1.2 ? null : val, t, 1);
    KB.draw(ctx, 1730, 760, 190, { pose: "tunjuk", target: [1520, 430], mood: l > tSep ? "wow" : "think", t });
    papanKetik(ctx, 380, 700, 520, t);
    D.post(c2 => {
      cards.forEach((c, i) => { if (!c.ad) return; const so = clamp(sorot * 10 - i * 0.6); if (so <= 0) return; const p = A.map(A.screen.w * 0.62, c.y + c.h * 0.22);
        if (c.y < A.screen.h * 0.11 || p.y < 110 || p.y > 900) return; U.sponsorTag(c2, p.x + 30, p.y, so, 300); });
      tag(c2, "Cory Doctorow · Januari 2023", 400, 520, pop(l, tDoc).a, { sp: pop(l, tDoc).sp, col: P.violet, size: 44 });
      tag(c2, "di Amazon", 400, 420, pop(l, tAmz).a, { sp: pop(l, tAmz).sp, col: P.violet, size: 44 });
      tag(c2, "5 layar pertama", 1520, 760 - 140, pop(l, tLima).a, { sp: pop(l, tLima).sp, col: P.amber, size: 44 });
    });
  };

  // ---------- b0_3: hasil terbelah ----------
  S.b0_3 = function (ctx, b, l, t) {
    const tMem = D.at(b, "membayar"), tCocok = D.at(b, "paling cocok");
    latarKamar(ctx, t);
    const split = eio(clamp((l - 0.4) / 1.2)), dimL = ramp(l, tCocok - 0.3, 1.0), glowR = ramp(l, tMem - 0.2, 0.8);
    const col = (x, ad, a, gl) => { for (let i = 0; i < 4; i++) { const y = 260 + i * 160 + (ad ? 0 : 20);
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = ad ? U.mix("#FFFFFF", "#FFF2B8", gl) : "#FFFFFF"; RR(ctx, x - 300, y, 600, 140, 20); ctx.fill();
      if (ad && gl > 0) { ctx.strokeStyle = D.hexA("#FFC94D", gl); ctx.lineWidth = 6; ctx.stroke(); }
      ctx.fillStyle = "#E6EAF8"; RR(ctx, x - 284, y + 14, 112, 112, 14); ctx.fill(); kasurKucing(ctx, x - 228, y + 76, 92, U.AWN[(i * 2 + (ad ? 1 : 4)) % 7], t);
      U.bars(ctx, x - 150, y + 32, 300, 18, 2, "rgba(40,50,100,0.35)", i + (ad ? 9 : 2)); ctx.fillStyle = "#FF6F61"; RR(ctx, x - 150, y + 96, 120, 20, 8); ctx.fill(); ctx.restore(); } };
    const xl = lerp(960, 560, split), xr = lerp(960, 1360, split);
    col(xl, 0, lerp(1, 0.35, dimL), 0); col(xr, 1, split, glowR);
    if (glowR > 0) U.addLight(ctx, xr, 560, 600, "#FFD23F", 0.25 * glowR);
    // garis belah
    ctx.strokeStyle = D.hexA(P.ink, 0.5 * split); ctx.lineWidth = 4; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(960, 230); ctx.lineTo(960, 900); ctx.stroke(); ctx.setLineDash([]);
    D.post(c2 => { tag(c2, "paling cocok", xl, 170, pop(l, tCocok).a, { sp: pop(l, tCocok).sp, col: P.teal, size: 52 });
      tag(c2, "membayar supaya muncul", xr, 170, pop(l, tMem).a, { sp: pop(l, tMem).sp, col: "#FFD23F", size: 52 });
      for (let i = 0; i < 4; i++) { const so = clamp((l - tMem - i * 0.25) / 0.4); if (so > 0) U.sponsorTag(c2, xr + 180, 300 + i * 160, so, 300); } });
  };

  // ---------- b0_4: tiga HP dulu → sekarang ----------
  function layarFilm(ctx, w, h, t, iklan, o = {}) {
    ctx.fillStyle = "#101433"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2B3A7A"; RR(ctx, w * 0.06, h * 0.12, w * 0.88, h * 0.32, 12); ctx.fill();
    const gr = ctx.createLinearGradient(0, h * 0.12, 0, h * 0.44); gr.addColorStop(0, "#FF9F6A"); gr.addColorStop(1, "#7A4AB8"); ctx.fillStyle = gr; RR(ctx, w * 0.06, h * 0.12, w * 0.88, h * 0.32, 12); ctx.fill();
    ctx.fillStyle = "#1E2558"; ctx.beginPath(); ctx.moveTo(w * 0.06, h * 0.44); ctx.lineTo(w * 0.3, h * 0.3); ctx.lineTo(w * 0.5, h * 0.38); ctx.lineTo(w * 0.72, h * 0.26); ctx.lineTo(w * 0.94, h * 0.44); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.moveTo(w * 0.44, h * 0.23); ctx.lineTo(w * 0.58, h * 0.28); ctx.lineTo(w * 0.44, h * 0.33); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.fillStyle = ["#5AA9FF", "#FF6F91", "#5BD68A", "#FFB547"][i]; RR(ctx, w * 0.06 + (i % 2) * w * 0.45, h * 0.5 + Math.floor(i / 2) * h * 0.2, w * 0.43, h * 0.17, 10); ctx.fill(); }
    if (iklan > 0) { ctx.save(); ctx.globalAlpha *= iklan; ctx.fillStyle = "rgba(10,10,30,0.7)"; RR(ctx, w * 0.06, h * 0.12, w * 0.88, h * 0.32, 12); ctx.fill();
      ctx.fillStyle = "#FFD23F"; RR(ctx, w * 0.12, h * 0.16, w * 0.3, h * 0.06, 8); ctx.fill(); ctx.fillStyle = "#FFFFFF"; RR(ctx, w * 0.56, h * 0.36, w * 0.34, h * 0.06, 8); ctx.fill(); ctx.restore(); }
  }
  S.b0_4 = function (ctx, b, l, t) {
    const tMed = D.at(b, "Media sosial"), tFilm = D.at(b, "layanan film"), tLang = D.at(b, "sudah berlangganan");
    latarKamar(ctx, t);
    const u1 = eio(clamp((l - tMed - 1.4) / 1.2)), u2 = eio(clamp((l - tFilm - 1.0) / 1.2)), u3 = eio(clamp((l - tLang + 0.6) / 1.0));
    const xs = [420, 960, 1500], hh = 640;
    // HP 1: media sosial
    KY.hp(ctx, xs[0], 540, hh, { t, glow: 0.35, screen: (c, w, h, tt) => U.layarFeed(c, w, h, tt, { kartu: u1 > 0.5 ? ["iklan", "saran", "iklan", "teman"] : ["teman", "teman", "teman", "teman"], judul: false }) });
    // HP 2: layanan film
    KY.hp(ctx, xs[1], 540, hh, { t, glow: 0.35, screen: (c, w, h, tt) => layarFilm(c, w, h, tt, u2) });
    // HP 3: belanja
    KY.hp(ctx, xs[2], 540, hh, { t, glow: 0.35, screen: (c, w, h, tt) => layarHasil(c, w, h, tt, { sorot: u3 }) });
    D.post(c2 => {
      tag(c2, "Media sosial", xs[0], 930 - 40, pop(l, tMed).a, { col: P.green, size: 44 });
      tag(c2, "Layanan film", xs[1], 930 - 40, pop(l, tFilm).a, { col: P.blue, size: 44 });
      tag(c2, "Belanja", xs[2], 930 - 40, pop(l, 0.4).a, { col: P.amber, size: 44 });
      const now = Math.max(u1, u2) > 0.5; tag(c2, now ? "sekarang" : "dulu", 960, 150, 1, { col: now ? P.pink : P.teal, size: 56 });
      if (u1 > 0.5) U.sponsorTag(c2, xs[0] + 40, 330, clamp((u1 - 0.5) * 2), 300);
      if (u2 > 0.3) { tag(c2, "Iklan · 0:30", xs[1], 330, u2, { col: "#FFD23F", size: 44 }); tag(c2, "Lewati iklan ›", xs[1] + 30, 450, u2 * ramp(l, tFilm + 2.6, 0.3), { col: P.ink2, size: 40 }); }
      if (u3 > 0) tag(c2, "✓ sudah berlangganan", xs[1], 680, pop(l, tLang).a, { sp: pop(l, tLang).sp, col: P.green, size: 44 });
    });
  };

  // ---------- b0_5: gedung kantor kaca ----------
  function gedung(ctx, x, y, w, h, t, lampu, seed) {
    const r = D.rng(seed); ctx.fillStyle = "#2F3B7E"; ctx.fillRect(x, y - h, w, h);
    const gl = ctx.createLinearGradient(x, y - h, x + w, y); gl.addColorStop(0, "rgba(140,190,255,0.25)"); gl.addColorStop(1, "rgba(140,190,255,0.05)"); ctx.fillStyle = gl; ctx.fillRect(x, y - h, w, h);
    const fl = Math.floor(h / 46); for (let f = 0; f < fl; f++) for (let c = 0; c < Math.floor(w / 46); c++) { const on = lampu * fl > f + r() * 0.3 ? (0.6 + 0.4 * Math.sin(t + f + c)) : 0;
      ctx.fillStyle = on > 0 ? D.hexA("#FFE29A", 0.55 + 0.35 * on) : "rgba(20,26,70,0.6)"; ctx.fillRect(x + 10 + c * 46, y - h + 12 + f * 46, 30, 28); }
  }
  S.b0_5 = function (ctx, b, l, t) {
    const tPin = D.at(b, "sangat pintar"), tJelek = D.at(b, "lebih jelek");
    const back = eio(clamp(l / 3.2));
    D.bg(ctx, t, { top: "#0F1745", bot: "#2B3A86", stars: 0.6 });
    // kota: kamera mundur dari HP ke gedung
    const z = lerp(3.2, 1, back); ctx.save(); ctx.translate(960, 640); ctx.scale(z, z); ctx.translate(-960, -640);
    const lampu = ramp(l, tPin - 0.4, 2.0);
    [[120, 330, 520, 1], [480, 300, 640, 2], [820, 320, 760, 3], [1180, 300, 600, 4], [1520, 330, 480, 5]].forEach(([x, w, h, s]) => gedung(ctx, x, 980, w, h, t, lampu, s));
    ctx.fillStyle = "#151C4E"; ctx.fillRect(-200, 980, 2400, 300);
    // HP di depan gedung tengah (menjauh)
    ctx.save(); ctx.globalAlpha *= 1 - back; KY.hp(ctx, 980, 640, 240, { t, screen: (c, w, h, tt) => layarHasil(c, w, h, tt, { sorot: 1 }) }); ctx.restore();
    ctx.restore();
    // tanda tanya besar
    const qa = pop(l, tJelek - 0.6); if (qa.a > 0) { ctx.save(); ctx.globalAlpha *= qa.a; ctx.translate(960, 230); const k = lerp(0.5, 1, qa.sp); ctx.scale(k, k); D.glow(ctx, 0, 0, 220, P.amber, 0.4); txt(ctx, "?", 0, 80, 260, { align: "center", weight: 900, color: P.amber }); ctx.restore(); }
    D.post(c2 => { tag(c2, "dipimpin orang-orang pintar", 960, 130, pop(l, tPin).a * (1 - ramp(l, tJelek - 0.8, 0.3)), { sp: pop(l, tPin).sp, col: P.blue, size: 52 });
      U.judul(c2, "Kenapa produknya dibuat lebih jelek?", 960, 870, 60, pop(l, tJelek).a, { sp: pop(l, tJelek).sp, col: P.amber }); });
  };

  // ---------- b0_6: janji isi + judul ----------
  function pintuKeluar(ctx, x, y, s, open, t) {
    ctx.save(); ctx.translate(x, y);
    U.addLight(ctx, 0, -s * 0.5, s * 1.1, "#FFE7B0", 0.55 * open);
    ctx.fillStyle = "#FFF1C8"; RR(ctx, -s * 0.32, -s, s * 0.64, s, 10); ctx.fill();
    ctx.fillStyle = "#6E4630"; ctx.beginPath(); ctx.moveTo(-s * 0.32, -s); ctx.lineTo(lerp(s * 0.32, -s * 0.2, open), -s + lerp(0, s * 0.06, open)); ctx.lineTo(lerp(s * 0.32, -s * 0.2, open), -lerp(0, s * 0.06, open)); ctx.lineTo(-s * 0.32, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#3A2F6E"; ctx.lineWidth = 10; RR(ctx, -s * 0.36, -s - 6, s * 0.72, s + 6, 12); ctx.stroke();
    ctx.restore();
  }
  S.b0_6 = function (ctx, b, l, t) {
    const tTanda = D.at(b, "satu tanda"), tPintu = D.at(b, "pintu keluarnya");
    D.bg(ctx, t, { top: "#16205A", bot: "#34489A", stars: 0.5 });
    const a1 = pop(l, tTanda - 0.2), a2 = pop(l, tPintu - 0.3), ta = ramp(l, 0.3, 0.7);
    if (a1.a > 0) { ctx.save(); ctx.globalAlpha *= a1.a; KB.draw(ctx, 640, 610, 220, { pose: "kacaPembesar", target: [790, 520], mood: "think", t,
      content: (c2, cx, cy, r) => { c2.fillStyle = "#FFF2B8"; c2.fillRect(cx - r, cy - r, 2 * r, 2 * r); txt(c2, "?", cx, cy + r * 0.45, r * 1.3, { align: "center", weight: 900, color: P.pink }); } }); ctx.restore(); }
    if (a2.a > 0) { ctx.save(); ctx.globalAlpha *= a2.a; pintuKeluar(ctx, 1300, 760, 300, eio(clamp((l - tPintu) / 1.2)), t); ctx.restore(); }
    D.post(c2 => {
      U.judul(c2, "Kenapa Aplikasi Favoritmu", 960, 200, 84, ta, { panel: false, color: P.ink });
      U.judul(c2, "Makin Menyebalkan?", 960, 320, 100, ta, { panel: false, color: P.amber });
      c2.save(); c2.globalAlpha = ta; c2.fillStyle = P.amber; c2.fillRect(860, 372, 200 * ta, 8); c2.restore();
      tag(c2, "1 tanda sederhana", 640, 860, a1.a, { sp: a1.sp, col: P.amber, size: 52 });
      tag(c2, "pintu keluar", 1300, 860, a2.a, { sp: a2.sp, col: P.green, size: 52 });
    });
  };

  K.SCENES.d05_b0 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d05_b0.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b0 = TL => [
    K.sfxAt(TL, "b0_1", "cari", 0.2, "clack", 0.4), K.sfxAt(TL, "b0_1", "tebak dulu", 0, "pop", 0.6),
    K.sfxAt(TL, "b0_2", "Cory Doctorow", 0, "pop", 0.5), K.sfxAt(TL, "b0_2", "separuh", 0, "boom", 0.6),
    K.sfxAt(TL, "b0_3", "membayar", 0, "shimmer", 0.5), K.sfxAt(TL, "b0_4", "Media sosial", 1.4, "whoosh", 0.4), K.sfxAt(TL, "b0_4", "layanan film", 1.0, "whoosh", 0.4),
    K.sfxAt(TL, "b0_5", null, 0.2, "whoosh", 0.5), K.sfxAt(TL, "b0_5", "lebih jelek", -0.6, "boom", 0.5),
    K.sfxAt(TL, "b0_6", "pintu keluarnya", 1.4, "riser", 0.5),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
