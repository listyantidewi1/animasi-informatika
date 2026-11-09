/* D04 bab 9 — Penutup (b9_1, b9_2, b9_3, b9_4). Tanpa kartu bab (judul "Penutup").
   Dunia meja kerja malam (dinding biru bergaris, jendela malam, lampu meja berlengan, meja kayu, tumpukan naskah dengan catatan terlipat
   dari bab 8, kacamata, rak berisi jilid 1, 2, 3, 4A, 4B dan tempat kosong bergaris putus-putus 4C, 4D, 5, 6, 7 — semua terlihat).
   Knuth tidak digambar. AI digambar sebagai kartu catatan dengan dua gaya garis yang setara (utuh teal, titik-titik biru), tanpa wajah/logo.
   b9_1 0–0,5 s: gambar akhir bab 8 apa adanya (silang-pudar memadukan dua gambar yang sama); 0,5–1,55 s: benda-benda BERPINDAH dari susunan
        bab 8 ke susunan bab 9 (rak turun, meja naik, kalender berbalik "TAHUN" → "FEB", kartu kutipan dilipat dan terbang ke tumpukan naskah,
        Bip melompat). Lalu kubus tiga warna melayang di atas jilid 1; "usang?" (debu, sarang laba-laba); kartu AI "AI?"; "Tidak."; kubus
        menjadi SATU HALAMAN buku (kubus ± 280 px, kartu AI kiri, "?" manusia kanan, ✗ ✗ ✓, 3 baris bukti + 2 kosong, "ukuran 3 ✓ 5 ✓ 7 ✓");
        kolom kiri "AI membantu" / kanan "Manusia" muncul tepat saat diucapkan; tangan tanpa ciri (lengan panjang dari kanan bawah) + pensil;
        centang besar di atas kubus + "benar".
   b9_2 halaman menjadi lembar rencana "1962 · 12 bab" (12 baris bernomor), turun ke meja; batang tumbuh; jilid 1–4B terbang dari rak menjadi
        ujung cabang kiri (utuh, "jilid sudah terbit"), 4C–7 cabang kanan putus-putus ("belum ditulis"); daun = ikon aplikasi (60 px) yang
        satu per satu terbang ke HP; sertifikat hadiah generik; kotak perbesaran salah ketik "algoritna" → "algoritma" (✗ → ✓); kacamata
        menyala + "usia 88 tahun"; kartu pendapat 2023 "AI suka mengarang" → 2026 "Hats off to Claude!"; siput besar merayap; Bip berjalan
        ke batang dan menunjuk 4C (cincin berdenyut); pensil terus menulis di 4C (terisi ± sepertiga, baris tulisan terlihat).
   b9_3 dunia yang sama meredup (4C dan pensilnya tetap terlihat); kartu "Catatan: naskah video ini" di kanan dengan tiga slot baris
        berikon besar yang menyala saat disebut: disusun dengan bantuan AI (+ "termasuk Claude (Anthropic)") · diperiksa fakta (tangan
        mencentang) · disunting oleh manusia (tangan menggaris bawahi "manusia"); cap centang.
   b9_4 kartu masuk ke tumpukan naskah; ikon aplikasi naik dari pohon ("teknologi"); layar akhir: lingkaran kanal (tempat elemen
        Subscribe) + nama kanal + youtube.com/@iTeachSWE, tempat video "Cerita berikutnya"; Bip menunjuk dan melambai; pensil terus menulis.
   Kamera sendiri (noCam), dihitung dari waktu absolut supaya silang-pudar antarbeat memadukan gambar yang sama. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KY = KIT.layar, KB = KIT.bipkit, P = D.P, LP = KL.parts;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const COL3 = ["#FF5A5F", "#4FD67F", "#55A8FF"];
  const AIC = ["#3FD8C8", "#7FA8FF"];           // dua gaya kartu AI yang setara: garis utuh teal, garis titik-titik biru
  const INK = "#26306E";

  // ---------- pembantu ----------
  const ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  const camT = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); };
  const toS = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + HH / 2];
  const drift = (c, t) => ({ x: c.x + Math.sin(t * 0.29) * 5 / c.z, y: c.y + Math.sin(t * 0.21 + 1) * 4 / c.z, z: c.z * (1 + 0.003 * Math.sin(t * 0.17)) });
  const beatOf = (TL, id) => TL.beats.find(x => x.id === id);
  const txt = (ctx, s, x, y, size, opt = {}) => D.txt(ctx, s, x, y, size, opt);
  function grade(ctx, a, col = "#3B4690") { if (a <= 0.01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, HH); ctx.restore(); }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  function tag(ctx, s, x, y, a, opt = {}) {
    if (a <= 0.01) return; const sp = opt.sp == null ? 1 : opt.sp; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.translate(x, y); const k = lerp(0.82, 1, sp); ctx.scale(k, k); const w = D.label(ctx, s, 0, 0, { size: opt.size || 48, col: opt.col || P.amber, color: opt.color }); ctx.restore(); return w;
  }
  const pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  function onCanvas(ctx, x, y, w, h) { const m = ctx.getTransform(); const xs = [x, x + w].map(a => m.a * a + m.e), ys = [y, y + h].map(b => m.d * b + m.f);
    return Math.max(...xs) > 0 && Math.min(...xs) < W && Math.max(...ys) > 0 && Math.min(...ys) < HH; }
  const scaleOf = ctx => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b); };
  // teks benda di dunia: ikut meredup bersama tirai (TXTA) dan memudar di dekat tepi zona aman
  let TXTA = 1, NOTXT = null;   // NOTXT [x0,y0,x1,y1]: teks benda di dalam kotak layar ini tidak digambar (di balik kartu)
  function wtxt(ctx, s, x, y, size, opt) {
    const m = ctx.getTransform(), sc = Math.hypot(m.a, m.b); if (sc * size < 41) return;
    ctx.font = `900 ${size}px ${FONT}`; const w = ctx.measureText(s).width, x0 = opt.align === "center" ? x - w / 2 : x;
    const X0 = m.a * x0 + m.c * y + m.e, X1 = X0 + w * sc, Y = m.b * x0 + m.d * y + m.f;
    const ea = clamp((X0 - 100) / 50) * clamp((1820 - X1) / 50) * clamp((925 - Y) / 40) * TXTA; if (ea <= 0.01) return;
    if (NOTXT && X1 > NOTXT[0] && X0 < NOTXT[2] && Y > NOTXT[1] && Y - size * sc < NOTXT[3]) return;
    ctx.save(); ctx.globalAlpha *= ea; txt(ctx, s, x, y, size, opt); ctx.restore();
  }
  function shadowE(ctx, x, y, rx, ry, a = 0.3) { ctx.save(); ctx.fillStyle = `rgba(30,12,8,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.restore(); }

  // ---------- tata letak dunia ----------
  // L9 = meja bab 9 (rupa bab 0: meja y 560, rak y 410; rak dipersempit supaya 4C, 4D, 5, 6, 7 semua terlihat, tepi kanan x ≤ 1800 di layar).
  // L8 = susunan akhir bab 8 (meja y 640, rak y 300, kalender "TAHUN 2026"): di awal b9_1 benda-benda BERGERAK dari L8 ke L9.
  const L8 = { deskY: 640, deskF: 1010, win: [120, 70, 280, 230], lamp: [330, 690, 262, 500, 430, 372, -0.5], shelf: [1110, 1850, 300, 1130, 69, 62, 170, 180],
    cal: [1640, 702, 230, 214], gls: [500, 772, 0.76, 0.55], stk: [170, 880], pen: [1215, 930, -0.32], mug: 0, note: [295, 808, 315, 135, 0.05] };
  const L9 = { deskY: 560, deskF: 930, win: [110, 96, 320, 280], lamp: [330, 612, 262, 430, 448, 296, -0.42], shelf: [1050, 1800, 410, 1080, 70, 62, 196, 206],
    cal: [610, 598, 190, 168], gls: [1080, 690, 1, 0.72], stk: [210, 830], pen: [1150, 872, -0.18], mug: 1, note: [224, 756, 190, 100, -0.06] };
  let DESK_Y, DESK_F, WIN, LAMP, SHELF, CAL, GLS, STK, PENR, MUGA, NOTE, LMIX = null;
  function setLayout(m) {
    if (m === LMIX) return; LMIX = m;
    const f = k => Array.isArray(L9[k]) ? L9[k].map((v, i) => lerp(L8[k][i], v, m)) : lerp(L8[k], L9[k], m);
    DESK_Y = f("deskY"); DESK_F = f("deskF");
    { const a = f("win"); WIN = { x: a[0], y: a[1], w: a[2], h: a[3] }; }
    { const a = f("lamp"); LAMP = { bx: a[0], by: a[1], jx: a[2], jy: a[3], hx: a[4], hy: a[5], rot: a[6] }; }
    { const a = f("shelf"); SHELF = { x0: a[0], x1: a[1], y: a[2], bx: a[3], slot: a[4], bw: a[5], h1: a[6], h2: a[7] }; }
    { const a = f("cal"); CAL = { x: a[0], y: a[1], w: a[2], h: a[3], m }; }
    { const a = f("gls"); GLS = { x: a[0], y: a[1], sx: a[2], sy: a[3] }; }
    { const a = f("stk"); STK = { x: a[0], y: a[1] }; }
    { const a = f("pen"); PENR = { x: a[0], y: a[1], ang: a[2] }; }
    MUGA = f("mug"); { const a = f("note"); NOTE = { x: a[0], y: a[1], w: a[2], h: a[3], rot: a[4] }; }
  }
  setLayout(1);
  const MUG = { x: 1835, y: 652 };
  const BOOKS = [
    { k: "1", c: "#E8665F" }, { k: "2", c: "#36B3A3" }, { k: "3", c: "#6A7BE0" }, { k: "4A", c: "#E9A23B" }, { k: "4B", c: "#9A6FD6" },
    { k: "4C", d: 1 }, { k: "4D", d: 1 }, { k: "5", d: 1 }, { k: "6", d: 1 }, { k: "7", d: 1 }];
  const bookH = B => B.k.length > 1 ? SHELF.h2 : SHELF.h1;
  const bookX = i => SHELF.bx + i * SHELF.slot;
  const BIP8 = { x: 1385, y: 765, s: 125 }, BIP_DESK = { x: 1655, y: 792, s: 210 };

  // ---------- benda-benda dunia ----------
  function wall(ctx, t) {
    const gr = ctx.createLinearGradient(0, 0, 0, DESK_Y); gr.addColorStop(0, "#2A3A7C"); gr.addColorStop(1, "#3D509A");
    ctx.fillStyle = gr; ctx.fillRect(-500, -400, 3000, DESK_Y + 400);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = -480; x < 2500; x += 64) ctx.fillRect(x, -400, 3, DESK_Y + 400);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = -448; x < 2500; x += 64) for (let y = -360; y < DESK_Y - 20; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    LP.windowFrame(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, "#8A6E9E", () => LP.nightView(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, 0));
    addLight(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 330, "#9DB8FF", 0.16);
  }
  function lamp(ctx, t) {
    const { bx, by, jx, jy, hx, hy } = LAMP;
    ctx.save();
    ctx.fillStyle = "rgba(20,10,10,0.35)"; ctx.beginPath(); ctx.ellipse(bx + 8, by + 8, 74, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2C3570"; ctx.beginPath(); ctx.ellipse(bx, by, 66, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3C478E"; ctx.beginPath(); ctx.ellipse(bx, by - 8, 60, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#46529E"; ctx.lineCap = "round"; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(bx, by - 12); ctx.lineTo(jx, jy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 4, by - 14); ctx.lineTo(jx - 4, jy); ctx.lineTo(hx - 2, hy - 5); ctx.stroke();
    ctx.fillStyle = "#FFB547"; [[bx, by - 12], [jx, jy], [hx, hy]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); });
    ctx.translate(hx, hy); ctx.rotate(LAMP.rot);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, "#38428A"); sg.addColorStop(0.5, "#5562B4"); sg.addColorStop(1, "#38428A");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(34, -14); ctx.lineTo(70, 92); ctx.lineTo(-70, 92); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E3778"; ctx.beginPath(); ctx.ellipse(0, -14, 34, 9, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgb(255,236,190)"; ctx.beginPath(); ctx.ellipse(0, 92, 70, 15, 0, 0, TAU); ctx.fill();
    ctx.restore();
    addLight(ctx, hx + 40, hy + 90, 110, "#FFF2C8", 0.85); addLight(ctx, hx + 70, hy + 140, 280, "#FFC66E", 0.4);
  }
  // satu buku tegak berpusat di (x, y); B dari BOOKS; o.lit 0..1 label; o.fill 0..1 (untuk tempat kosong: bagian yang sudah terisi dari bawah)
  function bookUp(ctx, x, y, B, t, o = {}) {
    const w = o.w || SHELF.bw, h = o.h || bookH(B), x0 = x - w / 2, top = y - h / 2, i = BOOKS.indexOf(B), ls = o.ls || 44, lr = o.lr || 30;
    if (B.d) {
      const pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + i);
      ctx.fillStyle = D.hexA(P.warm, 0.1 + 0.08 * pulse); RR(ctx, x0, top, w, h, 8); ctx.fill();
      const f = clamp(o.fill || 0); if (f > 0) { ctx.save(); RR(ctx, x0, top, w, h, 8); ctx.clip(); const fh = h * f;
        const gr = ctx.createLinearGradient(0, top + h - fh, 0, top + h); gr.addColorStop(0, "#F2B36A"); gr.addColorStop(1, "#D9823E"); ctx.fillStyle = gr; ctx.fillRect(x0, top + h - fh, w, fh);
        ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, top + h - fh); ctx.lineTo(x0 + w, top + h - fh); ctx.stroke(); ctx.restore(); }
      ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 14; ctx.strokeStyle = D.hexA(P.warm, 0.75 + 0.25 * pulse); ctx.lineWidth = 4; RR(ctx, x0 + 2, top + 2, w - 4, h - 4, 8); ctx.stroke(); ctx.setLineDash([]);
      addLight(ctx, x, y, 80, P.warm, 0.16 * pulse);
      if (o.label !== false && onCanvas(ctx, x - 30, y - 30, 60, 60)) { const ly = o.ly == null ? y : o.ly; wtxt(ctx, B.k, x, ly + ls * 0.36, ls, { align: "center", weight: 900, color: P.warm }); }
      return;
    }
    ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(x0 + 6, top + 6, w, h);
    const gr = ctx.createLinearGradient(x0, 0, x0 + w, 0); gr.addColorStop(0, B.c); gr.addColorStop(0.55, B.c); gr.addColorStop(1, "rgba(20,20,40,0.35)");
    ctx.fillStyle = B.c; RR(ctx, x0, top, w, h, 6); ctx.fill(); ctx.fillStyle = gr; RR(ctx, x0, top, w, h, 6); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(x0 + 8, top + 14, w - 16, 5); ctx.fillRect(x0 + 8, top + h - 20, w - 16, 5);
    if (o.label !== false) {
      addLight(ctx, x, y, 110, B.c, 0.35);
      ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(x, y, lr, 0, TAU); ctx.fill();
      if (onCanvas(ctx, x - 30, y - 30, 60, 60)) wtxt(ctx, B.k, x, y + ls * 0.36, ls, { align: "center", weight: 900, color: "#FFFFFF" });
    }
  }
  // rak dinding; away[i] 0..1: buku i sudah pergi dari rak (dibawa ke pohon)
  function shelf(ctx, t, away = []) {
    const { x0, x1, y } = SHELF;
    ctx.fillStyle = "#6B4632"; [x0 + 60, x1 - 120].forEach(x => { ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x + 18, y + 20); ctx.lineTo(x + 18, y + 90); ctx.closePath(); ctx.fill(); });
    BOOKS.forEach((B, i) => {
      const a = 1 - clamp((away[i] || 0) * 8); if (a <= 0.01) return;
      ctx.save(); ctx.globalAlpha *= a; bookUp(ctx, bookX(i) + SHELF.bw / 2, y - bookH(B) / 2, B, t, { h: bookH(B) }); ctx.restore();
    });
    // bekas tempat buku yang sudah pergi: bayangan samar
    BOOKS.forEach((B, i) => { const a = clamp((away[i] || 0) * 3) * (B.d ? 0 : 1); if (a <= 0.01) return; ctx.fillStyle = `rgba(14,20,60,${0.18 * a})`; RR(ctx, bookX(i), y - bookH(B), SHELF.bw, bookH(B), 6); ctx.fill(); });
    ctx.fillStyle = "#8A5A3C"; RR(ctx, x0, y, x1 - x0, 24, 5); ctx.fill();
    ctx.fillStyle = "#A8714C"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 5);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(x0 + 6, y + 24, x1 - x0 - 12, 8);
  }
  function desk(ctx) {
    const gr = ctx.createLinearGradient(0, DESK_Y, 0, DESK_F); gr.addColorStop(0, "#6E4834"); gr.addColorStop(1, "#9A6848");
    ctx.fillStyle = gr; ctx.fillRect(-500, DESK_Y, 3000, DESK_F - DESK_Y);
    ctx.strokeStyle = "rgba(60,30,20,0.18)"; ctx.lineWidth = 3;
    for (let i = 0; i < 9; i++) { const y = DESK_Y + 26 + i * 40; ctx.beginPath(); ctx.moveTo(-500, y); for (let x = -500; x <= 2500; x += 120) ctx.lineTo(x, y + Math.sin(x * 0.004 + i * 1.7) * 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,220,180,0.18)"; ctx.fillRect(-500, DESK_Y, 3000, 4);
    ctx.fillStyle = "#B57D57"; ctx.fillRect(-500, DESK_F, 3000, 10);
    const g2 = ctx.createLinearGradient(0, DESK_F + 10, 0, 1200); g2.addColorStop(0, "#5A3726"); g2.addColorStop(1, "#3A2218");
    ctx.fillStyle = g2; ctx.fillRect(-500, DESK_F + 10, 3000, 400);
  }
  // tumpukan naskah + catatan terlipat dari bab 8 di atasnya
  function stack(ctx, t) {
    const { x, y } = STK, w = 300, h = 150;
    shadowE(ctx, x + 10, y + 10, w * 0.6, h * 0.42, 0.28);
    for (let i = 0; i < 9; i++) { const dy = -i * 7, dx = Math.sin(i * 2.1) * 8, rot = Math.sin(i * 1.3) * 0.03;
      ctx.save(); ctx.translate(x + dx, y + dy); ctx.rotate(rot);
      ctx.fillStyle = i % 2 ? "#EDE3CF" : "#F6EEDC"; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(120,90,60,0.25)"; ctx.fillRect(-w / 2, h / 2 - 3, w, 3); ctx.restore(); }
    // catatan terlipat dari bab 8 (di akhir bab 8 lebih besar; label "catatan" milik gambar bab 8 ikut larut; mengecil saat meja ditata ulang)
    const kx = NOTE.w / 190, ky = NOTE.h / 100;
    ctx.save(); ctx.translate(NOTE.x, NOTE.y); ctx.rotate(NOTE.rot); ctx.scale(kx, ky);
    ctx.fillStyle = "rgba(60,40,30,0.25)"; ctx.fillRect(-92, -46, 190, 104);
    ctx.fillStyle = "#FBF7EC"; ctx.fillRect(-96, -52, 190, 100);
    ctx.fillStyle = "#E8E0CC"; ctx.beginPath(); ctx.moveTo(-96, -52); ctx.lineTo(94, -52); ctx.lineTo(94, -10); ctx.lineTo(-96, -2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(90,140,220,0.4)"; ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-80, 12 + k * 13); ctx.lineTo(78, 12 + k * 13); ctx.stroke(); }
    // judul catatan seperti di akhir bab 8, memudar segera setelah meja mulai ditata ulang
    const la = 1 - clamp(CAL.m * 3); if (la > 0.01) { ctx.save(); ctx.globalAlpha *= la; ctx.scale(1 / kx, 1 / ky); ctx.fillStyle = "#F4EBD6"; ctx.fillRect(-NOTE.w / 2, -NOTE.h / 2, NOTE.w, NOTE.h);
      wtxt(ctx, "Claude’s", 0, -7, 48.6, { align: "center", weight: "italic 800", color: "#2B2F5E" }); wtxt(ctx, "Cycles", 0, 47, 48.6, { align: "center", weight: "italic 800", color: "#2B2F5E" }); ctx.restore(); }
    ctx.restore();
  }
  function calendar(ctx) {
    const { x, y, w, h, m } = CAL, top = y - h;
    shadowE(ctx, x + 8, y + 4, w * 0.6, 14, 0.3);
    ctx.fillStyle = "#3A447E"; ctx.beginPath(); ctx.moveTo(x - w / 2 - 6, y); ctx.lineTo(x - w / 2 + 14, top - 6); ctx.lineTo(x + w / 2 - 14, top - 6); ctx.lineTo(x + w / 2 + 6, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FBF6EA"; RR(ctx, x - w / 2 + 10, top + 10, w - 20, h - 18, 8); ctx.fill();
    // lembar kepala berbalik dari "TAHUN" (bab 8) ke "FEB" (bab 0): skala tegak |cos|
    const fl = Math.abs(Math.cos(m * Math.PI)), hb = h * 0.34;
    ctx.save(); ctx.translate(0, top + 10); ctx.scale(1, Math.max(0.02, fl));
    ctx.fillStyle = "#E8584F"; RR(ctx, x - w / 2 + 10, 0, w - 20, hb, 8); ctx.fill(); ctx.fillRect(x - w / 2 + 10, hb - 18, w - 20, 18);
    if (fl > 0.6 && onCanvas(ctx, x - w / 2, 0, w, hb)) wtxt(ctx, m < 0.5 ? "TAHUN" : "FEB", x, m < 0.5 ? h * 0.3 - 28 : hb * 0.5 + 16, m < 0.5 ? 40 : 46, { align: "center", weight: 900, color: "#FFFFFF" });
    ctx.restore();
    if (onCanvas(ctx, x - w / 2, top, w, h)) wtxt(ctx, "2026", x, top + h * lerp(0.78, 0.81, m), lerp(76, 54, m), { align: "center", weight: 900, color: "#27306A" });
    ctx.fillStyle = "#9AA2C8"; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(x - w * 0.38 + i * w * 0.126, top + 8, 5, 0, TAU); ctx.fill(); }
  }
  function glasses(ctx, t, glow) {
    const { x, y, sx, sy } = GLS;
    if (glow > 0.01) addLight(ctx, x, y - 4, 160 * sx, P.warm, 0.6 * glow);
    shadowE(ctx, x + 10 * sx, y + 26 * sy / 0.72, 110 * sx, 18 * sx, 0.3);
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-86, -10); ctx.lineTo(70, -34); ctx.moveTo(86, -10); ctx.lineTo(-40, -36); ctx.stroke();
    [-46, 46].forEach(cx => {
      ctx.fillStyle = `rgba(190,220,255,${0.28 + 0.4 * glow})`; ctx.beginPath(); ctx.arc(cx, 0, 38, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, 0, 26, -2.4, -1.6); ctx.stroke();
    });
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-10, -6); ctx.quadraticCurveTo(0, -18, 10, -6); ctx.stroke();
    ctx.restore();
  }
  function mug(ctx, t) {
    if (MUGA <= 0.01) return; const y = MUG.y, x = MUG.x + (1 - MUGA) * 220;
    shadowE(ctx, x + 6, y + 4, 62, 14, 0.3);
    ctx.fillStyle = "#E06A5C"; RR(ctx, x - 48, y - 104, 96, 104, 14); ctx.fill();
    ctx.strokeStyle = "#E06A5C"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x + 52, y - 54, 24, -1.3, 1.3); ctx.stroke();
    ctx.fillStyle = "#5A2E22"; ctx.beginPath(); ctx.ellipse(x, y - 104, 44, 10, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(x - 36, y - 92, 10, 76);
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) { const u = (t * 0.32 + i / 3) % 1; ctx.strokeStyle = `rgba(235,240,255,${0.35 * Math.sin(u * Math.PI)})`; ctx.lineWidth = 7;
      ctx.beginPath(); for (let k = 0; k <= 10; k++) { const v = k / 10, yy = y - 118 - u * 120 - v * 70, xx = x - 14 + i * 14 + Math.sin(v * 5 + t * 1.8 + i) * 12; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  }
  // pensil: ujung di (x, y), badan ke arah sudut ang; L panjang
  function pencil(ctx, x, y, ang, lift = 0, L = 250) {
    ctx.save();
    ctx.save(); ctx.translate(x + 10 + lift * 18, y + 6 + lift * 22); ctx.rotate(ang); ctx.fillStyle = `rgba(30,12,8,${0.26 - lift * 0.16})`; RR(ctx, 0, -9 * L / 250, L * (1 - lift * 0.35), 18 * L / 250, 9); ctx.fill(); ctx.restore();
    ctx.translate(x, y); ctx.rotate(ang); const k = L / 250; ctx.scale(k, k);
    ctx.fillStyle = "#E9C08B"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40, -11); ctx.lineTo(40, 11); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3A3F55"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(13, -3.6); ctx.lineTo(13, 3.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F4C542"; ctx.fillRect(40, -11, 170, 22);
    ctx.fillStyle = "#D9A72C"; ctx.fillRect(40, 3, 170, 8); ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(40, -9, 170, 4);
    ctx.fillStyle = "#B9C0D4"; ctx.fillRect(210, -12, 18, 24); ctx.fillStyle = "#8E95AE"; ctx.fillRect(216, -12, 3, 24); ctx.fillRect(223, -12, 3, 24);
    ctx.fillStyle = "#F08FA0"; RR(ctx, 228, -11, 24, 22, 6); ctx.fill();
    ctx.restore();
  }
  function dust(ctx, t, a) {
    if (a <= 0.01) return; const r = D.rng(41); ctx.save(); ctx.fillStyle = "#FFE9C2";
    for (let i = 0; i < 46; i++) { const bx = 520 + r() * 760, by = 300 + r() * 420, ph = r() * TAU, sp = 5 + r() * 9, rad = 1.6 + r() * 2.4;
      const x = bx + Math.sin(t * 0.33 + ph) * 34, y = by - ((t * sp + ph * 30) % 140) + 70;
      ctx.globalAlpha = a * (0.16 + 0.24 * (0.5 + 0.5 * Math.sin(t * 1.2 + ph))); ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ---------- jilid 1 tergeletak di meja (b9_1) ----------
  const BOOK9 = { x: 820, y: 778, w: 430, h: 112, th: 40 };
  function lyingBook(ctx, t, old, la = 1) {
    const { x, y, w, h, th } = BOOK9, sk = 46;
    shadowE(ctx, x + 18, y + th + 6, w * 0.6, 26, 0.32);
    const col = "#E8665F", oc = clamp(old);
    // halaman (sisi depan)
    ctx.fillStyle = "#F3EAD6"; ctx.beginPath(); ctx.moveTo(x - w / 2, y + h / 2); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x + w / 2, y + h / 2 + th); ctx.lineTo(x - w / 2, y + h / 2 + th); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(150,120,80,0.35)"; ctx.lineWidth = 2; for (let k = 1; k < 7; k++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + 6, y + h / 2 + k * 5.5); ctx.lineTo(x + w / 2 - 6, y + h / 2 + k * 5.5); ctx.stroke(); }
    // sampul (atas, jajaran genjang)
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w / 2 + sk, y - h / 2); ctx.lineTo(x + w / 2 + sk * 0.2, y - h / 2); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x - w / 2, y + h / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#B9473F"; ctx.beginPath(); ctx.moveTo(x - w / 2, y + h / 2); ctx.lineTo(x - w / 2 + sk, y - h / 2); ctx.lineTo(x - w / 2 + sk + 26, y - h / 2); ctx.lineTo(x - w / 2 + 26, y + h / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,240,200,0.8)"; for (const v of [0.3, 0.62]) { ctx.beginPath(); const yy = y - h / 2 + h * v, xo = sk * (1 - v); ctx.moveTo(x - w / 2 + xo + 60, yy); ctx.lineTo(x + w / 2 + xo * 0.2 - 40, yy); ctx.lineTo(x + w / 2 + xo * 0.2 - 42, yy + 7); ctx.lineTo(x - w / 2 + xo + 58, yy + 7); ctx.closePath(); ctx.fill(); }
    // nomor jilid di sampul
    ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.ellipse(x + 120, y - 2, 34, 26, 0, 0, TAU); ctx.fill();
    if (la > 0.5 && scaleOf(ctx) * 44 >= 40 && onCanvas(ctx, x + 80, y - 30, 80, 60)) wtxt(ctx, "1", x + 120, y + 14, 44, { align: "center", weight: 900, color: "#FFFFFF" });
    // debu + sarang laba-laba saat "usang"
    if (oc > 0.01) {
      ctx.save(); ctx.globalAlpha *= oc;
      ctx.fillStyle = "rgba(170,170,165,0.55)"; ctx.beginPath(); ctx.moveTo(x - w / 2 + sk, y - h / 2); ctx.lineTo(x + w / 2 + sk * 0.2, y - h / 2); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x - w / 2, y + h / 2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(235,235,240,0.85)"; ctx.lineWidth = 2.2;
      const cx0 = x + w / 2 + sk * 0.2 - 4, cy0 = y - h / 2 + 2;
      for (let k = 0; k < 5; k++) { const a = Math.PI * 0.5 + k * 0.32; ctx.beginPath(); ctx.moveTo(cx0, cy0); ctx.lineTo(cx0 + Math.cos(a) * 110, cy0 + Math.sin(a) * 110); ctx.stroke(); }
      for (let r = 26; r <= 100; r += 24) { ctx.beginPath(); for (let k = 0; k < 5; k++) { const a = Math.PI * 0.5 + k * 0.32, px = cx0 + Math.cos(a) * r, py = cy0 + Math.sin(a) * r; k ? ctx.quadraticCurveTo(cx0 + Math.cos(a - 0.16) * r * 0.86, cy0 + Math.sin(a - 0.16) * r * 0.86, px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
      ctx.restore();
    }
  }
  // butir debu: menempel (old) lalu tertiup ke kanan atas (blow 0..1)
  function bookDust(ctx, t, old, blow) {
    if (old <= 0.01 || blow >= 1) return; const r = D.rng(91);
    ctx.save();
    for (let i = 0; i < 60; i++) { const bx = BOOK9.x - 190 + r() * 400, by = BOOK9.y - 50 + r() * 96, sz = 2 + r() * 3.5, dx = 80 + r() * 380, dy = -60 - r() * 260, sp = r();
      const e = eout(clamp(blow * (0.8 + sp * 0.5))); const x = bx + dx * e + Math.sin(t * 3 + i) * 6 * e, y = by + dy * e;
      ctx.globalAlpha = old * (1 - e) * 0.85; ctx.fillStyle = i % 3 ? "#C9C6BE" : "#E5E2DA"; ctx.beginPath(); ctx.arc(x, y, sz, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ---------- kubus 3×3×3 (data asli K.KUBUS['3']) ----------
  function proj(cx, cy, Sz, yaw, pitch) {
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    return (i, j, k) => { const x = i - 1, y = k - 1, z = j - 1, xr = x * cyw + z * syw, zr = -x * syw + z * cyw;
      return { x: cx + xr * Sz, y: cy - (y * cp + zr * sp) * Sz, d: zr * cp - y * sp }; };
  }
  const R3 = K.KUBUS ? K.KUBUS["3"] : null;
  const rid = s => [+s[0], +s[1], +s[2]];
  const ROOMS = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) ROOMS.push([i, j, k]);
  const mixC = (a, b, u) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = s => Math.round(lerp(pa >> s & 255, pb >> s & 255, u)); return `rgb(${c(16)},${c(8)},${c(0)})`; };
  // o.print 0..1 (0 = bercahaya di malam, 1 = cetakan di kertas), o.alpha, o.lens {x,y,r} menyorot ruangan di bawah lensa
  function cube(ctx, t, cx, cy, Sz, yaw, o = {}) {
    const pr = proj(cx, cy, Sz, yaw, 0.5), a = o.alpha == null ? 1 : o.alpha, pp = clamp(o.print || 0); if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha *= a;
    if (pp < 1) D.glow(ctx, cx, cy, Sz * 3.2, "#5A6BD8", 0.25 * (1 - pp));
    ctx.strokeStyle = pp < 0.5 ? `rgba(205,218,255,${0.32 * (1 - pp * 2)})` : `rgba(40,50,110,${0.3 * (pp * 2 - 1)})`; ctx.lineWidth = Math.max(2, 3 * Sz / 120);
    ROOMS.forEach(([i, j, k]) => { const p = pr(i, j, k); [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(([di, dj, dk]) => { if (i + di > 2 || j + dj > 2 || k + dk > 2) return; const q = pr(i + di, j + dj, k + dk); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }); });
    if (R3) [0, 1, 2].forEach(c => {
      const seq = R3[c], col = COL3[c], segs = [];
      for (let s = 0; s < 27; s++) { const A = rid(seq[s]), B = rid(seq[(s + 1) % 27]); let ax = -1; for (let q = 0; q < 3; q++) if (A[q] !== B[q]) ax = q;
        const wrap = A[ax] === 2 && B[ax] === 0, e = [0, 0, 0]; e[ax] = 1;
        if (!wrap) { const p = pr(...A), q2 = pr(...B); segs.push([p.x, p.y, q2.x, q2.y, 0]); }
        else { const p = pr(...A), q1 = pr(A[0] + e[0] * 0.42, A[1] + e[1] * 0.42, A[2] + e[2] * 0.42); segs.push([p.x, p.y, q1.x, q1.y, 1]);
          const r0 = pr(B[0] - e[0] * 0.42, B[1] - e[1] * 0.42, B[2] - e[2] * 0.42), r1 = pr(...B); segs.push([r0.x, r0.y, r1.x, r1.y, 2]); } }
      ctx.save(); ctx.lineCap = "round";
      const passes = pp < 0.5 ? [[18, 0.25 * (1 - pp * 2), "lighter"], [7, 1, "source-over"]] : [[7, 1, "source-over"]];
      passes.forEach(([lw, al, mode]) => { ctx.globalCompositeOperation = mode; segs.forEach(([x0, y0, x1, y1, kind]) => {
        if (kind) { const gr = ctx.createLinearGradient(x0, y0, x1, y1); const aa = kind === 1 ? [al, al * 0.1] : [al * 0.1, al]; gr.addColorStop(0, D.hexA(col, aa[0])); gr.addColorStop(1, D.hexA(col, aa[1])); ctx.strokeStyle = gr; ctx.setLineDash([10 * Sz / 120 + 3, 8 * Sz / 120 + 3]); }
        else { ctx.strokeStyle = D.hexA(col, al); ctx.setLineDash([]); }
        ctx.lineWidth = Math.max(2.5, lw * Sz / 120); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }); });
      ctx.setLineDash([]); ctx.restore(); });
    const order = ROOMS.map(r => ({ r, p: pr(...r) })).sort((A, B) => B.p.d - A.p.d);
    const dotC = mixC("#F2F6FF", "#2B3270", pp);
    order.forEach(({ r, p }) => {
      const rad = Math.max(3, (11 - p.d * 2.4) * Sz / 120);
      let hi = 0; if (o.lens) hi = clamp(1 - Math.hypot(p.x - o.lens.x, p.y - o.lens.y) / o.lens.r) * (o.lens.a == null ? 1 : o.lens.a);
      if (pp < 1) D.glow(ctx, p.x, p.y, rad * 3, "#CFE0FF", 0.4 * (1 - pp));
      if (hi > 0.02) D.glow(ctx, p.x, p.y, rad * 4.5, P.amber, 0.9 * hi);
      ctx.fillStyle = hi > 0.3 ? "#FFB547" : (r.join("") === "000" ? P.warm : dotC); ctx.beginPath(); ctx.arc(p.x, p.y, rad * (1 + 0.5 * hi), 0, TAU); ctx.fill();
    });
    ctx.restore();
  }

  // ---------- kartu catatan AI: dua gaya garis yang setara ----------
  function aiCard(ctx, x, y, w, h, style, a, opt = {}) {
    if (a <= 0.01) return; const col = AIC[style], sp = opt.sp == null ? 1 : opt.sp;
    ctx.save(); ctx.globalAlpha *= clamp(a); ctx.translate(x, y); ctx.rotate(opt.rot || 0); const k = lerp(0.7, 1, sp); ctx.scale(k, k);
    if (opt.glow) addLight(ctx, 0, 0, w * 1.1, opt.glowCol || col, 0.35 * opt.glow);
    ctx.fillStyle = "rgba(10,14,40,0.3)"; RR(ctx, -w / 2 + 5, -h / 2 + 7, w, h, 12); ctx.fill();
    ctx.fillStyle = "#EEF3FF"; RR(ctx, -w / 2, -h / 2, w, h, 12); ctx.fill();
    ctx.strokeStyle = opt.ring ? D.hexA(P.amber, 0.6 + 0.4 * opt.ring) : col; ctx.lineWidth = opt.ring ? 5 : 4; RR(ctx, -w / 2, -h / 2, w, h, 12); ctx.stroke();
    ctx.fillStyle = col; RR(ctx, -w / 2, -h / 2, w, h * 0.17, 12); ctx.fill(); ctx.fillRect(-w / 2, -h / 2 + h * 0.08, w, h * 0.09);
    const rows = [0.0, 0.17, 0.34], lw = [0.7, 0.56, 0.64];
    rows.forEach((v, i) => { const yy = -h * 0.12 + h * v, x0 = -w * 0.34, x1 = x0 + w * lw[i];
      ctx.strokeStyle = style ? "#4F6FD6" : "#1FA79E"; ctx.lineCap = "round";
      if (style === 0) { ctx.lineWidth = Math.max(4, h * 0.05); ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); ctx.stroke(); }
      else { ctx.fillStyle = "#4F6FD6"; const n = Math.round((x1 - x0) / (h * 0.085)); for (let q = 0; q <= n; q++) { ctx.beginPath(); ctx.arc(lerp(x0, x1, q / n), yy, Math.max(2.4, h * 0.028), 0, TAU); ctx.fill(); } }
    });
    ctx.restore();
  }
  // garis cahaya bergaya kartu (utuh atau titik-titik) dari (x0,y0) ke (x1,y1) melengkung
  function aiBeam(ctx, x0, y0, x1, y1, style, a, t) {
    if (a <= 0.01) return; const col = AIC[style], mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 60;
    ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = "screen"; ctx.strokeStyle = D.hexA(col, 0.8); ctx.lineWidth = 5; ctx.lineCap = "round";
    if (style) { ctx.setLineDash([2, 12]); ctx.lineWidth = 7; } else ctx.setLineDash([]);
    ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke(); ctx.setLineDash([]);
    const u = (t * 0.6) % 1, bx = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * mx + u * u * x1, by = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * my + u * u * y1;
    D.glow(ctx, bx, by, 22, col, 0.9); ctx.restore();
  }

  // ---------- ikon garis sederhana untuk baris kolom ----------
  function ico(ctx, name, cx, cy, r, col = "#FFFFFF") {
    ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = r * 0.16; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (name === "cari") { ctx.beginPath(); ctx.arc(-r * 0.12, -r * 0.12, r * 0.42, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(r * 0.18, r * 0.18); ctx.lineTo(r * 0.55, r * 0.55); ctx.stroke(); }
    else if (name === "coba") { ctx.lineWidth = r * 0.13; [[-0.5, 0, 1], [0, 0, 1], [0.5, 0, 0]].forEach(([dx, , bad]) => { const x = dx * r; if (bad) { ctx.beginPath(); ctx.moveTo(x - r * 0.15, -r * 0.15); ctx.lineTo(x + r * 0.15, r * 0.15); ctx.moveTo(x + r * 0.15, -r * 0.15); ctx.lineTo(x - r * 0.15, r * 0.15); ctx.stroke(); } else { ctx.beginPath(); ctx.moveTo(x - r * 0.2, 0); ctx.lineTo(x - r * 0.05, r * 0.16); ctx.lineTo(x + r * 0.22, -r * 0.2); ctx.stroke(); } }); }
    else if (name === "tulis") { ctx.rotate(-0.75); ctx.beginPath(); ctx.moveTo(-r * 0.55, 0); ctx.lineTo(-r * 0.32, -r * 0.13); ctx.lineTo(r * 0.55, -r * 0.13); ctx.lineTo(r * 0.55, r * 0.13); ctx.lineTo(-r * 0.32, r * 0.13); ctx.closePath(); ctx.stroke(); }
    else if (name === "tanya") { ctx.lineWidth = r * 0.17; ctx.beginPath(); ctx.arc(0, -r * 0.2, r * 0.3, Math.PI * 1.05, Math.PI * 0.45 + TAU * 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(r * 0.12, -r * 0.0); ctx.quadraticCurveTo(0, r * 0.08, 0, r * 0.22); ctx.stroke(); ctx.beginPath(); ctx.arc(0, r * 0.48, r * 0.09, 0, TAU); ctx.fill(); }
    else if (name === "damping") { ctx.lineWidth = r * 0.13; ctx.beginPath(); ctx.arc(-r * 0.28, -r * 0.25, r * 0.18, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(r * 0.28, -r * 0.25, r * 0.18, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(-r * 0.28, r * 0.42, r * 0.32, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.beginPath(); ctx.arc(r * 0.28, r * 0.42, r * 0.32, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
    else if (name === "uji") { ctx.lineWidth = r * 0.13; ctx.beginPath(); ctx.moveTo(-r * 0.2, -r * 0.55); ctx.lineTo(-r * 0.2, -r * 0.05); ctx.lineTo(-r * 0.5, r * 0.5); ctx.lineTo(r * 0.5, r * 0.5); ctx.lineTo(r * 0.2, -r * 0.05); ctx.lineTo(r * 0.2, -r * 0.55); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-r * 0.32, -r * 0.55); ctx.lineTo(r * 0.32, -r * 0.55); ctx.stroke(); ctx.globalAlpha *= 0.6; ctx.beginPath(); ctx.moveTo(-r * 0.36, r * 0.24); ctx.lineTo(r * 0.36, r * 0.24); ctx.lineTo(r * 0.5, r * 0.5); ctx.lineTo(-r * 0.5, r * 0.5); ctx.closePath(); ctx.fill(); }
    else if (name === "cek") { ctx.lineWidth = r * 0.2; ctx.beginPath(); ctx.moveTo(-r * 0.42, 0); ctx.lineTo(-r * 0.1, r * 0.32); ctx.lineTo(r * 0.45, -r * 0.35); ctx.stroke(); }
    else if (name === "ai") { aiCard(ctx, -r * 0.2, -r * 0.05, r * 0.7, r * 0.9, 0, 1, { rot: -0.15 }); aiCard(ctx, r * 0.22, r * 0.05, r * 0.7, r * 0.9, 1, 1, { rot: 0.12 }); }
    ctx.restore();
  }
  // tanda centang / silang yang digambar (u 0..1 = seberapa jauh garisnya)
  function check(ctx, x, y, s, u, col = "#2FB86A", lw) {
    if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw || s * 0.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const P3 = [[-0.45, 0.02], [-0.1, 0.36], [0.5, -0.38]], L1 = Math.hypot(0.35, 0.34), L2 = Math.hypot(0.6, 0.74), d = u * (L1 + L2);
    ctx.beginPath(); ctx.moveTo(x + P3[0][0] * s, y + P3[0][1] * s);
    if (d <= L1) ctx.lineTo(x + lerp(P3[0][0], P3[1][0], d / L1) * s, y + lerp(P3[0][1], P3[1][1], d / L1) * s);
    else { ctx.lineTo(x + P3[1][0] * s, y + P3[1][1] * s); const f = (d - L1) / L2; ctx.lineTo(x + lerp(P3[1][0], P3[2][0], f) * s, y + lerp(P3[1][1], P3[2][1], f) * s); }
    ctx.stroke(); ctx.restore();
  }
  function cross(ctx, x, y, s, u, col = "#E5484D") {
    if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.2; ctx.lineCap = "round";
    const a = clamp(u * 2), b = clamp(u * 2 - 1);
    ctx.beginPath(); ctx.moveTo(x - s * 0.36, y - s * 0.36); ctx.lineTo(x + lerp(-0.36, 0.36, a) * s, y + lerp(-0.36, 0.36, a) * s); ctx.stroke();
    if (b > 0) { ctx.beginPath(); ctx.moveTo(x + s * 0.36, y - s * 0.36); ctx.lineTo(x + lerp(0.36, -0.36, b) * s, y + lerp(-0.36, 0.36, b) * s); ctx.stroke(); }
    ctx.restore();
  }

  // ---------- tangan tanpa ciri memegang pensil (ujung pensil di (x, y)); rot memutar lengan ke bawah ----------
  function hand(ctx, x, y, t, sc = 1, rot = 0.6) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.save(); ctx.rotate(0.62); ctx.fillStyle = "#5B6CC7"; RR(ctx, 120, -46, 1400, 100, 40); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(170, -38, 1340, 14); ctx.fillStyle = "rgba(20,24,70,0.22)"; ctx.fillRect(170, 32, 1340, 14); ctx.fillStyle = "#4757AE"; RR(ctx, 112, -50, 46, 108, 18); ctx.fill(); ctx.restore();
    ctx.save(); ctx.rotate(-0.92);
    ctx.fillStyle = "#FFC94A"; ctx.fillRect(18, -7, 140, 14); ctx.fillStyle = "#E8A93A"; ctx.fillRect(18, 2, 140, 5);
    ctx.fillStyle = "#C9CED8"; ctx.fillRect(158, -7, 16, 14); ctx.fillStyle = "#FF8FB1"; RR(ctx, 172, -7, 20, 14, 5); ctx.fill();
    ctx.fillStyle = "#F6D9B5"; ctx.beginPath(); ctx.moveTo(18, -7); ctx.lineTo(18, 7); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2B2440"; ctx.beginPath(); ctx.moveTo(6, -2.4); ctx.lineTo(6, 2.4); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
    const sk = "#E9B894", sd = "#C98F6C";
    ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(92, 6, 66, 50, -0.45, 0, TAU); ctx.fill();
    ctx.fillStyle = sd; ctx.beginPath(); ctx.ellipse(110, 30, 50, 26, -0.45, 0, Math.PI); ctx.fill();
    ctx.lineCap = "round"; ctx.strokeStyle = sk; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(70, -6); ctx.quadraticCurveTo(40, -30, 26, -30); ctx.stroke();
    ctx.lineWidth = 21; ctx.beginPath(); ctx.moveTo(62, 22); ctx.quadraticCurveTo(36, 8, 24, -14); ctx.stroke();
    ctx.strokeStyle = sd; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(34, -18); ctx.quadraticCurveTo(46, -12, 58, -2); ctx.stroke();
    ctx.strokeStyle = sk; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(60, -40); ctx.quadraticCurveTo(44, -52, 34, -44); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.ellipse(78, -12, 22, 9, -0.5, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // =====================================================================
  // dunia meja bab 9 (satu fungsi untuk semua beat)
  // o: away[] (buku pergi dari rak), book9 {old, blow} | paper (kertas 12 bab), tree (fungsi), glassGlow, extraDesk(ctx), front(ctx)
  function world(ctx, t, o = {}) {
    wall(ctx, t);
    lamp(ctx, t);
    shelf(ctx, t, o.away || []);
    desk(ctx);
    if ((o.cal == null ? 1 : o.cal) > 0.01) { ctx.save(); ctx.globalAlpha *= o.cal == null ? 1 : o.cal; calendar(ctx); ctx.restore(); }
    stack(ctx, t);
    glasses(ctx, t, o.glassGlow || 0);
    mug(ctx, t);
    if (o.book9 && (o.book9.a == null || o.book9.a > 0.01)) { ctx.save(); ctx.globalAlpha *= o.book9.a == null ? 1 : o.book9.a; lyingBook(ctx, t, o.book9.old * (1 - o.book9.blow), o.book9.la == null ? 1 : o.book9.la); ctx.restore(); }
    if (o.paper) paper12(ctx, t, o.paper);
    if (o.extraDesk) o.extraDesk(ctx);
    if (!o.paper) pencil(ctx, PENR.x, PENR.y, PENR.ang, 0);
    grade(ctx, 0.0);
    KL.parts.warmPool(ctx, 880, 730, 720, 0.62, 0.5);
    KL.parts.warmPool(ctx, LAMP.hx + 40, LAMP.hy + 30, 420, 0.42, 1);
    addLight(ctx, LAMP.hx + 45, LAMP.hy + 95, 150, "#FFE7B0", 0.5);
    if (o.book9) bookDust(ctx, t, o.book9.old, o.book9.blow);
    if (o.tree) o.tree(ctx);
    dust(ctx, t, 1);
    if (o.front) o.front(ctx);
  }

  // =====================================================================
  // HALAMAN (b9_1): koordinat lokal 0..720 × 0..640, dipetakan ke layar lewat persegi panjang r
  // atas: kartu AI (kiri) · kubus tercetak besar (tengah) · "?" manusia (kanan); bawah kubus: percobaan ✗ ✗ ✓;
  // bawah kiri: 5 baris bukti (3 ditulis AI, 2 kosong) + kolom centang; bawah kanan: "ukuran 3 ✓ 5 ✓ 7 ✓" (ukuran kubus yang diuji).
  const PG = { x: 600, y: 250, w: 720, h: 640 };
  const PCUBE = { x: 350, y: 178, s: 96 };
  const PCARD = [[96, 112], [96, 268]];
  const PLINES = [432, 476, 520, 564, 608];
  const PTX = 466;                        // kolom centang baris bukti
  const PQ = [614, 118];                  // "?" ditulis pensil
  const PATT = [[250, 352], [350, 352], [450, 352]];
  const PTEST = [[560, 500], [560, 556], [560, 612]];  // angka ukuran yang diuji; centang di x + 72
  const pyaw = t => -0.8 + 0.05 * Math.sin(t * 0.25);
  // titik-titik jalur tanda tanya (koordinat lokal, ukuran 1 = 100 px)
  const QPATH = (() => { const pts = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * 1.1 - i / 24 * Math.PI * 1.45; pts.push([Math.cos(a) * 0.32, -0.32 + Math.sin(a) * -0.3]); }
    pts.push([0.0, 0.05], [0, 0.22]); return pts; })();
  function pathPart(ctx, pts, u, x, y, s) { const n = pts.length - 1, m = u * n; ctx.beginPath(); ctx.moveTo(x + pts[0][0] * s, y + pts[0][1] * s); for (let i = 1; i <= Math.floor(m); i++) ctx.lineTo(x + pts[i][0] * s, y + pts[i][1] * s); const f = m - Math.floor(m), i = Math.floor(m); if (i < n && f > 0) ctx.lineTo(x + lerp(pts[i][0], pts[i + 1][0], f) * s, y + lerp(pts[i][1], pts[i + 1][1], f) * s); ctx.stroke(); }
  const pathPt = (pts, u, x, y, s) => { const n = pts.length - 1, m = clamp(u) * n, i = Math.min(n - 1, Math.floor(m)), f = m - i; return [x + lerp(pts[i][0], pts[i + 1][0], f) * s, y + lerp(pts[i][1], pts[i + 1][1], f) * s]; };
  // baris bukti tulisan tangan/cahaya: u 0..1 panjang tergambar
  function scribble(ctx, x0, y, w, u, seed, col, lw = 4, dotted = false) {
    if (u <= 0) return; const n = 46; ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const pts = []; for (let q = 0; q <= n; q++) { const uu = q / n; pts.push([x0 + w * uu, y + Math.sin(uu * 40 + seed) * 5 + Math.sin(uu * 13 + seed * 2) * 3 - (Math.sin(uu * 23 + seed) > 0.65 ? 9 : 0)]); }
    const m = Math.floor(u * n);
    if (dotted) { for (let q = 0; q <= m; q += 1) { ctx.beginPath(); ctx.arc(pts[q][0], pts[q][1], lw * 0.62, 0, TAU); ctx.fill(); } }
    else { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let q = 1; q <= m; q++) ctx.lineTo(pts[q][0], pts[q][1]); ctx.stroke(); }
    ctx.restore(); return pts[Math.min(n, m)];
  }
  // status halaman untuk waktu l pada b9_1 (T = waktu kata)
  function pageState(T, l) {
    return {
      lensA: ramp(l, T.cari - 0.15, 0.3) * (1 - ramp(l, T.coba + 0.3, 0.4)),
      lensU: eio(ramp(l, T.cari - 0.1, T.coba - T.cari + 0.3)),
      att: [ramp(l, T.coba - 0.05, 0.35), ramp(l, T.coba + 0.35, 0.35), ramp(l, T.coba + 0.75, 0.35)],
      ln: [0, 1, 2].map(i => ramp(l, T.tulis + 0.05 + i * 0.5, 0.55)), lnSlots: ramp(l, T.tulis - 0.2, 0.4),
      q: ramp(l, T.tanya - 0.05, 0.9), damp: ramp(l, T.damping - 0.05, 0.4) * (1 - 0.6 * ramp(l, T.uji - 0.1, 0.4)),
      testHead: ramp(l, T.uji - 0.1, 0.3), test: [0, 1, 2].map(i => ramp(l, T.uji + 0.05 + i * 0.32, 0.3)),
      tick: [0, 1, 2].map(i => ramp(l, T.periksa + 0.1 + i * 0.42, 0.3)), big: ramp(l, T.benar - 0.05, 0.5),
    };
  }
  function pageDraw(ctx, t, st, a = 1) {
    const { w, h } = PG;
    // sampul + tumpukan halaman di bawah (supaya terbaca sebagai halaman buku)
    ctx.fillStyle = "rgba(6,8,30,0.4)"; RR(ctx, 18, 26, w + 10, h + 8, 14); ctx.fill();
    ctx.fillStyle = "#B9473F"; RR(ctx, -6, -8, w + 24, h + 26, 14); ctx.fill();
    for (let k = 4; k >= 1; k--) { ctx.fillStyle = k % 2 ? "#E9DFC8" : "#F2EAD6"; ctx.fillRect(k * 3, k * 3.2, w, h); }
    const gr = ctx.createLinearGradient(0, 0, 70, 0); gr.addColorStop(0, "#E2D6BC"); gr.addColorStop(1, "#FBF7EC");
    ctx.fillStyle = "#FBF7EC"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = gr; ctx.fillRect(0, 0, 70, h);
    if (a <= 0.01 || !st) return;
    ctx.save(); ctx.globalAlpha *= a;
    // garis halaman tipis + pemisah bagian
    ctx.strokeStyle = "rgba(90,140,220,0.18)"; ctx.lineWidth = 2; PLINES.forEach(y => { ctx.beginPath(); ctx.moveTo(44, y + 10); ctx.lineTo(500, y + 10); ctx.stroke(); });
    ctx.strokeStyle = "rgba(60,70,130,0.16)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, 398); ctx.lineTo(w - 24, 398); ctx.moveTo(512, 414); ctx.lineTo(512, h - 18); ctx.stroke();
    // kubus tercetak (± 280 px)
    const lens = st.lensA > 0.01 ? (() => { const u = st.lensU, ang = u * TAU * 1.1 - 1.2; return { x: PCUBE.x + Math.cos(ang) * 92, y: PCUBE.y + Math.sin(ang) * 84, r: 96, a: st.lensA }; })() : null;
    if (!st.noCube) cube(ctx, t, PCUBE.x, PCUBE.y, PCUBE.s, pyaw(t), { print: 1, lens });
    if (lens) { ctx.save(); ctx.globalAlpha *= lens.a; ctx.strokeStyle = AIC[0]; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(lens.x, lens.y, 56, 0, TAU); ctx.stroke(); ctx.fillStyle = "rgba(63,216,200,0.12)"; ctx.fill();
      ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(lens.x + 40, lens.y + 40); ctx.lineTo(lens.x + 80, lens.y + 80); ctx.stroke(); ctx.restore(); }
    // percobaan ✗ ✗ ✓ (± 64 px)
    st.att.forEach((u, i) => { if (u <= 0) return; const [x, y] = PATT[i], sp = clamp(spring(u * 0.7, 10, 0.5));
      ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y); ctx.scale(lerp(0.6, 1, sp), lerp(0.6, 1, sp));
      ctx.fillStyle = i < 2 ? "rgba(229,72,77,0.14)" : "rgba(47,184,106,0.16)"; ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fill();
      if (i < 2) cross(ctx, 0, 0, 60, u); else check(ctx, 0, 0, 64, u); ctx.restore(); });
    // baris bukti: 3 ditulis AI (gaya utuh, utuh, titik-titik), 2 tetap kosong (putus-putus)
    if (st.lnSlots > 0) { ctx.save(); ctx.globalAlpha *= st.lnSlots; ctx.strokeStyle = "rgba(60,70,130,0.32)"; ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
      PLINES.forEach(y => { ctx.beginPath(); ctx.moveTo(60, y + 6); ctx.lineTo(430, y + 6); ctx.stroke(); }); ctx.setLineDash([]); ctx.restore(); }
    st.ln.forEach((u, i) => { const y = PLINES[i], style = i === 2 ? 1 : 0; const tip = scribble(ctx, 64, y - 4, [362, 318, 340][i], u, 11 + i * 7, style ? "#4F6FD6" : "#1FA79E", 5.5, !!style);
      if (u > 0 && u < 1 && tip) D.glow(ctx, tip[0], tip[1], 30, AIC[style], 0.9); });
    // kurung "sebagian"
    const br = clamp(st.ln[2] * 1.4 - 0.4); if (br > 0) { ctx.save(); ctx.globalAlpha *= br; ctx.strokeStyle = AIC[0]; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(50, PLINES[0] - 22); ctx.lineTo(40, PLINES[0] - 22); ctx.lineTo(40, PLINES[2] + 12); ctx.lineTo(50, PLINES[2] + 12); ctx.stroke(); ctx.restore(); }
    // "?" oleh pensil
    if (st.q > 0) { ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.lineJoin = "round"; pathPart(ctx, QPATH, clamp(st.q / 0.85), PQ[0], PQ[1], 150);
      if (st.q > 0.88) { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(PQ[0], PQ[1] + 0.47 * 150, 9 * clamp((st.q - 0.88) / 0.12), 0, TAU); ctx.fill(); } ctx.restore(); }
    // garis bimbingan pensil → kartu AI
    if (st.damp > 0.01) { ctx.save(); ctx.globalAlpha *= st.damp; ctx.strokeStyle = P.amber; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 30;
      ctx.beginPath(); ctx.moveTo(PQ[0] - 62, PQ[1] + 112); ctx.quadraticCurveTo(360, -6, PCARD[0][0] + 58, PCARD[0][1] - 30); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    // uji: "ukuran" lalu 3 ✓ 5 ✓ 7 ✓ (ukuran kubus yang diuji)
    if (st.testHead > 0) { ctx.save(); ctx.globalAlpha *= st.testHead; txt(ctx, "ukuran", 612, 452, 48, { align: "center", weight: 900, color: INK }); ctx.restore(); }
    st.test.forEach((u, i) => { if (u <= 0) return; const [x, y] = PTEST[i]; ctx.save(); ctx.globalAlpha *= clamp(u * 3);
      txt(ctx, ["3", "5", "7"][i], x, y + 19, 54, { align: "center", weight: 900, color: INK }); check(ctx, x + 72, y, 58, clamp(u * 1.5 - 0.3)); ctx.restore(); });
    // centang tiap baris bukti
    st.tick.forEach((u, i) => check(ctx, PTX, PLINES[i] - 6, 48, u));
    // centang besar "benar" di atas kubus (jawaban kubus benar)
    if (st.big > 0) { const k = clamp(spring(st.big * 0.9, 9, 0.5)); ctx.save(); ctx.translate(PCUBE.x, PCUBE.y + 8); ctx.scale(lerp(0.6, 1, k), lerp(0.6, 1, k)); ctx.globalAlpha *= clamp(st.big * 3);
      ctx.fillStyle = "rgba(47,184,106,0.16)"; ctx.beginPath(); ctx.arc(0, 0, 112, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(47,184,106,0.9)"; ctx.lineWidth = 8; ctx.stroke(); check(ctx, 0, 6, 150, clamp(st.big * 1.6)); ctx.restore(); }
    ctx.restore();
  }
  // kartu AI di halaman (lokal), di atas isi halaman
  function pageCards(ctx, t, a, glow, ring) {
    PCARD.forEach(([x, y], i) => aiCard(ctx, x, y + Math.sin(t * 1.3 + i) * 4, 112, 140, i, a, { rot: i ? 0.05 : -0.05, glow, ring }));
  }

  // ---------- kolom kata kerja (layar) ----------
  const COLL = { cx: 336, w: 470 }, COLR = { cx: 1592, w: 456 };
  function vrow(ctx, cx, top, w, h, lines, icon, col, u, act) {
    if (u <= 0.01) return; const sp = clamp(spring(u * 0.9, 10, 0.55));
    ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(cx, top + h / 2); ctx.scale(lerp(0.85, 1, sp), lerp(0.85, 1, sp)); ctx.translate(-cx, -(top + h / 2));
    if (act > 0.01) D.glow(ctx, cx, top + h / 2, w * 0.62, col, 0.32 * act);
    ctx.fillStyle = "rgba(10,18,52,0.9)"; RR(ctx, cx - w / 2, top, w, h, 24); ctx.fill();
    ctx.strokeStyle = D.hexA(col, 0.45 + 0.55 * act); ctx.lineWidth = 3 + 2 * act; ctx.stroke();
    const ix = cx - w / 2 + 54, iy = top + h / 2;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(ix, iy, 36, 0, TAU); ctx.fill();
    ico(ctx, icon, ix, iy, 40, "#10183F");
    const fs = lines.length > 1 ? 44 : 48, x0 = cx - w / 2 + 106;
    lines.forEach((s, i) => txt(ctx, s, x0, iy + (lines.length > 1 ? (i - 0.5) * 52 : 0) + fs * 0.36, fs, { weight: 800, color: "#FFFFFF", fit: w - 124 }));
    ctx.restore();
  }

  // =====================================================================
  // b9_1
  function T91(b) {
    return { buku: D.at(b, "buku ini"), usang: D.at(b, "usang"), ai: D.at(b, "AI?"), jaw: D.at(b, "Jawabannya"), tidak: D.at(b, "tidak."), aiM: D.at(b, "AI membantu"),
      cari: D.at(b, "mencari,"), coba: D.at(b, "mencoba,"), tulis: D.at(b, "menulis"), bukti: D.atEnd(b, "bukti."), tetapi: D.at(b, "Tetapi"), man: D.at(b, "manusialah"),
      tanya: D.at(b, "mengajukan"), damping: D.at(b, "mendampingi,"), uji: D.at(b, "menguji,"), periksa: D.at(b, "memeriksa"), benar: D.at(b, "benar."), end: D.speechEnd(b) };
  }
  // Awal b9_1: l < 0,5 = gambar akhir bab 8 apa adanya (silang-pudar mesin memadukan dua gambar yang sama); 0,5–0,72 larut halus ke
  // susunan yang sama yang digambar bab ini; 0,55–1,55 benda-benda BERGERAK ke susunan bab 9 (rak turun, meja naik, kalender berbalik,
  // kartu kutipan dilipat dan terbang ke tumpukan naskah, Bip melompat ke tempatnya). Kamera ikut dari kamera akhir bab 8.
  const MORPH = l => eio(ramp(l, 0.55, 1.0));
  const CAM1 = l => D.path([[0.55, 950, 590, 1.035], [1.55, 960, 540, 1.0], [5.6, 960, 540, 1.035], [99, 960, 540, 1.035]], l);
  // gambar akhir bab 8 dirender ke kanvas sendiri (keadaan kanvas bab 8 tidak bocor ke kanvas utama; label D.post-nya dibuang)
  let OFF8 = null, OFF8T = null, CARD8 = null;
  function prevImg(b, l, t, TL) {
    const pv = TL.beats[TL.beats.indexOf(b) - 1], fn = pv && K.SCENES[pv.scene]; if (!fn || typeof document === "undefined") return null;
    if (!OFF8) { OFF8 = document.createElement("canvas"); OFF8.width = W; OFF8.height = HH; }
    if (OFF8T !== t) { const o = OFF8.getContext("2d"); o.setTransform(1, 0, 0, 1, 0, 0); o.globalAlpha = 1; o.globalCompositeOperation = "source-over"; o.clearRect(0, 0, W, HH);
      o.save(); fn(o, pv, pv.dur + l, t, TL); o.restore(); D.flushPost(null); OFF8T = t;
      // salinan piksel kartu kutipan (isi kartu sudah diam di akhir bab 8), dipakai sesudah gambar bab 8 selesai larut
      if (!CARD8) { CARD8 = document.createElement("canvas"); CARD8.width = QCARD.w; CARD8.height = QCARD.h; }
      const q = CARD8.getContext("2d"); q.clearRect(0, 0, QCARD.w, QCARD.h); q.drawImage(OFF8, QCARD.x, QCARD.y, QCARD.w, QCARD.h, 0, 0, QCARD.w, QCARD.h); }
    return OFF8;
  }
  function drawPrev(ctx, img, a) { if (!img || a <= 0.01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(img, 0, 0); ctx.restore(); }
  // kartu kutipan akhir bab 8 (di layar, x 560 y 292, 880 × 300): pikselnya diambil dari gambar bab 8, dilipat dua, lalu terbang
  // dan mengecil tepat ke catatan terlipat di atas tumpukan naskah
  const QCARD = { x: 560, y: 292, w: 880, h: 300 };
  function quoteCard(ctx, l, c, img) {
    const f = eio(ramp(l, 0.6, 0.35)), mv = eio(ramp(l, 0.85, 0.7)); if (mv >= 0.999 || !img) return;
    const Q = QCARD, [nx, ny] = toS(c, NOTE.x, NOTE.y);
    const cx = lerp(Q.x + Q.w / 2, nx, mv), cy = lerp(Q.y + Q.h / 2 + Q.h / 4 * f, ny, mv) - Math.sin(mv * Math.PI) * 120;
    const w = lerp(Q.w, NOTE.w * c.z, mv), h = lerp(Q.h * lerp(1, 0.5, f), NOTE.h * c.z, mv), r = lerp(22, 6, mv);
    ctx.save(); ctx.globalAlpha *= 1 - ramp(mv, 0.8, 0.2); ctx.translate(cx, cy); ctx.rotate(lerp(0, NOTE.rot, mv));
    ctx.fillStyle = "rgba(10,14,40,0.35)"; RR(ctx, -w / 2 + 10, -h / 2 + 14, w, h, r); ctx.fill();
    ctx.save(); RR(ctx, -w / 2, -h / 2, w, h, r); ctx.clip();
    if (f < 0.5) { ctx.drawImage(img, 0, 0, Q.w, Q.h, -w / 2, -h / 2, w, h); ctx.fillStyle = `rgba(120,90,60,${0.5 * f})`; ctx.fillRect(-w / 2, -h / 2, w, h); }
    else { ctx.fillStyle = "#F1E7CF"; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.fillStyle = `rgba(120,90,60,${0.25 * (1 - f)})`; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = "rgba(150,120,80,0.55)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 3); ctx.lineTo(w / 2, -h / 2 + 3); ctx.stroke(); }
    ctx.restore(); ctx.restore();
  }
  const CUBE0 = { x: 900, y: 318, s: 104 };
  const CARD0 = [[600, 300], [672, 392]];
  // perpindahan 0..1: kubus menjadi halaman di depan layar
  const morphU = (T, l) => eio(ramp(l, T.tidak + 0.3, 1.05));
  function pageRect(T, l) {
    const u = morphU(T, l), cw = 400, ch = 420;
    return { x: lerp(CUBE0.x - cw / 2, PG.x, u), y: lerp(CUBE0.y - ch / 2, PG.y, u), w: lerp(cw, PG.w, u), h: lerp(ch, PG.h, u), u };
  }
  // posisi pensil (ujung) di layar untuk b9_1
  function pen91(T, l) {
    const loc = (x, y) => [PG.x + x, PG.y + y];
    const rest = loc(690, 300), off = [1500, 1080];
    const enter = eio(ramp(l, T.tetapi, 0.9));
    let p = [lerp(off[0], rest[0], enter), lerp(off[1], rest[1], enter)];
    const qs = T.tanya - 0.05, qe = qs + 0.9 * 0.85;
    if (l > qs - 0.5 && l < qs) { const u = eio(ramp(l, qs - 0.5, 0.5)), q0 = pathPt(QPATH, 0, PQ[0], PQ[1], 150); p = [lerp(p[0], PG.x + q0[0], u), lerp(p[1], PG.y + q0[1], u)]; }
    else if (l >= qs && l < qe + 0.12) { const q = pathPt(QPATH, clamp((l - qs) / (qe - qs)), PQ[0], PQ[1], 150); p = [PG.x + q[0], PG.y + q[1]]; }
    else if (l >= qe + 0.12) {
      const qEnd = loc(PQ[0], PQ[1] + 0.47 * 150);
      // bimbing (ujung pensil di awal garis bimbingan ke kartu AI), lalu uji, lalu periksa baris demi baris, lalu centang besar di kubus
      const ws = [[qe + 0.12, qEnd], [T.damping - 0.1, loc(PQ[0] - 62, PQ[1] + 112)], [T.uji - 0.25, loc(PTEST[0][0] + 50, PTEST[0][1] + 10)]];
      PTEST.forEach((pt, i) => ws.push([T.uji + 0.05 + i * 0.32, loc(pt[0] + 72 + 28, pt[1] - 20)]));
      ws.push([T.periksa - 0.2, loc(PTX, PLINES[0] - 6)]);
      [0, 1, 2].forEach(i => ws.push([T.periksa + 0.1 + i * 0.42, loc(PTX + 22, PLINES[i] - 22)]));
      ws.push([T.benar - 0.2, loc(PCUBE.x - 66, PCUBE.y + 12)], [T.benar + 0.25, loc(PCUBE.x + 76, PCUBE.y - 50)], [T.benar + 1.0, loc(830, 780)]);
      let q = ws[0][1]; for (let i = 1; i < ws.length; i++) { if (l < ws[i][0]) { const [t0, a0] = ws[i - 1], [t1, a1] = ws[i]; const u = eio(clamp((l - t0) / Math.min(0.45, t1 - t0))); q = [lerp(a0[0], a1[0], u), lerp(a0[1], a1[1], u) - Math.sin(u * Math.PI) * 18]; break; } q = ws[i][1]; }
      p = q;
      // gerak menulis kecil saat mencentang
      const wig = Math.sin(l * 26) * 3 * (ramp(l, T.uji, 0.2) * (1 - ramp(l, T.benar - 0.3, 0.3))); p = [p[0] + wig, p[1]];
    }
    return { p, a: enter };
  }
  function scene91(ctx, b, l, t, TL) {
    NOTXT = null;
    const img8 = l < 0.72 || (!CARD8 && l < 1.6) ? prevImg(b, l, t, TL) : null;
    if (l < 0.5 && img8) { setLayout(0); drawPrev(ctx, img8, 1); return; }
    const T = T91(b), m = MORPH(l); setLayout(m);
    const c = drift(CAM1(l), t), mu = morphU(T, l), pr = pageRect(T, l), st = pageState(T, l);
    const old = ramp(l, T.usang - 0.05, 0.6), blow = eout(ramp(l, T.tidak - 0.05, 1.1));
    TXTA = 1 - ramp(l, T.tidak + 0.15, 0.35);   // label benda memudar sebelum pil "usang?"/"Tidak." naik dan halaman maju
    ctx.save(); camT(ctx, c);
    world(ctx, t, { book9: { old, blow, a: ramp(l, 0.75, 0.4), la: ramp(l, 1.25, 0.2) } });
    ctx.restore();
    quoteCard(ctx, l, c, CARD8);
    // cahaya buku saat "buku ini"
    { const [bx, by] = toS(c, BOOK9.x, BOOK9.y); const ga = ramp(l, T.buku - 0.1, 0.4) * (1 - ramp(l, T.usang, 0.5)); if (ga > 0) addLight(ctx, bx, by, 300, P.warm, 0.45 * ga); }
    // tirai gelap saat halaman maju
    const scrim = 0.36 * mu; if (scrim > 0.01) { ctx.fillStyle = `rgba(8,12,40,${scrim})`; ctx.fillRect(0, 0, W, HH); }
    // kubus melayang (fase meja) → halaman
    const yaw0 = -0.82 + 0.03 * l, cubeIn = ramp(l, 1.15, 0.6);
    if (mu < 0.999) {
      const [cx0, cy0] = toS(c, CUBE0.x, CUBE0.y);
      const cx = lerp(cx0, PG.x + PCUBE.x, mu), cy = lerp(cy0 + Math.sin(t * 1.1) * 6, PG.y + PCUBE.y, mu), s = lerp(CUBE0.s * c.z, PCUBE.s, mu);
      if (mu > 0.01) { ctx.save(); ctx.translate(pr.x, pr.y); ctx.scale(pr.w / PG.w, pr.h / PG.h); ctx.globalAlpha *= clamp(mu * 2.5); pageDraw(ctx, t, Object.assign({ noCube: true }, st), clamp((mu - 0.6) / 0.4)); ctx.restore(); }
      // gelap lembut di belakang kubus supaya garis warna terbaca (fase meja)
      if (mu < 0.5) { ctx.save(); ctx.globalAlpha *= (1 - mu * 2) * cubeIn; const gr = ctx.createRadialGradient(cx0, cy0, 40, cx0, cy0, 380); gr.addColorStop(0, "rgba(12,16,52,0.6)"); gr.addColorStop(1, "rgba(12,16,52,0)"); ctx.fillStyle = gr; ctx.fillRect(cx0 - 380, cy0 - 380, 760, 760); ctx.restore(); }
      cube(ctx, t, cx, cy + (1 - eout(cubeIn)) * 30, s, lerp(yaw0, pyaw(t), mu), { print: mu, alpha: clamp(cubeIn + mu) });
    } else {
      ctx.save(); ctx.translate(PG.x, PG.y); pageDraw(ctx, t, st, 1); ctx.restore();
    }
    // kartu AI: melayang di samping kubus → menempel di halaman
    {
      const aA = ramp(l, T.ai - 0.15, 0.35), sp = clamp(spring(l - T.ai + 0.15, 10, 0.5));
      const ring = st.damp > 0.05 ? st.damp * (0.6 + 0.4 * Math.sin(t * 6)) : 0, glow = 0.4 + 0.6 * (ramp(l, T.aiM - 0.1, 0.3) * (1 - ramp(l, T.tetapi, 0.5)));
      CARD0.forEach(([wx, wy], i) => {
        const [sx, sy] = toS(c, wx, wy), x = lerp(sx, PG.x + PCARD[i][0], mu), y = lerp(sy + Math.sin(t * 1.4 + i) * 6, PG.y + PCARD[i][1] + Math.sin(t * 1.3 + i) * 4, mu);
        const w = lerp(120, 112, mu), h = lerp(150, 140, mu);
        aiCard(ctx, x, y, w, h, i, aA, { sp, rot: (i ? 0.08 : -0.08) * (1 - mu) + (i ? 0.05 : -0.05) * mu, glow, ring });
      });
      // garis cahaya dari kartu ke kubus (fase meja) / ke halaman saat bekerja
      if (mu < 0.5) { const [cx0, cy0] = toS(c, CUBE0.x, CUBE0.y); CARD0.forEach(([wx, wy], i) => { const [sx, sy] = toS(c, wx, wy); aiBeam(ctx, sx + 40, sy - 30, cx0 - 120, cy0 + 40 + i * 50, i, aA * (1 - mu * 2) * 0.8, t); }); }
      const work = ramp(l, T.cari - 0.2, 0.3) * (1 - ramp(l, T.bukti + 0.3, 0.5));
      if (mu >= 0.999 && work > 0.01) {
        const tgt = l < T.coba + 0.2 ? [PG.x + PCUBE.x - 90, PG.y + PCUBE.y] : l < T.tulis ? [PG.x + PATT[1][0], PG.y + PATT[1][1] - 40] : [PG.x + 240, PG.y + PLINES[1]];
        CARD0.forEach((_, i) => aiBeam(ctx, PG.x + PCARD[i][0] + 50, PG.y + PCARD[i][1] - 20, tgt[0], tgt[1] + i * 24, i, work * 0.85, t + i * 0.5));
      }
    }
    // tangan + pensil (manusia), di halaman yang sama
    const pn = pen91(T, l);
    if (pn.a > 0.01) { ctx.save(); ctx.globalAlpha *= clamp(pn.a * 2); hand(ctx, pn.p[0], pn.p[1], t, 0.85, 0.62); ctx.restore(); }
    // Bip: dari tempatnya di bab 8 melompat ke tempatnya di meja ini; lalu (fase meja) → melompat ke kiri bawah dan menunjuk
    {
      const jump = ramp(l, T.tidak + 0.45, 0.9);
      const hx = lerp(BIP8.x, BIP_DESK.x, m), hy = lerp(BIP8.y, BIP_DESK.y, m) - Math.sin(m * Math.PI) * 110, hs = lerp(BIP8.s, BIP_DESK.s, m);
      const [dx, dy] = toS(c, hx, hy), ds = hs * c.z;
      const BX = 330, BY = 798, BS = 170;
      let o;
      if (jump <= 0) {
        if (m < 0.999) o = m < 0.05 ? { pose: "diam", t, mood: "happy", look: [-0.9, -0.8], wave: 0.6 } : { pose: "kaget", t, k: 0.35 + m * 0.4, mood: "happy", seru: false };
        else if (l < T.buku - 0.1) o = { pose: "diam", t, mood: "think", look: [-0.9, 0.2] };
        else if (l < T.usang + 0.2) o = { pose: "tunjuk", t, target: [BOOK9.x + 220, BOOK9.y - 20], mood: "think" };
        else if (l < T.tidak - 0.1) o = { pose: "diam", t, mood: "sad", look: [-0.9, 0.3] };
        else o = { pose: "diam", t, mood: "happy", wave: t * 1.2 };
        if (o.pose === "tunjuk") { ctx.save(); camT(ctx, c); KB.draw(ctx, hx, hy, hs, o); ctx.restore(); } else KB.draw(ctx, dx, dy, ds, o);
      } else if (jump < 1) {
        const e = eio(jump); KB.draw(ctx, lerp(dx, BX, e), lerp(dy, BY, e) - Math.sin(jump * Math.PI) * 220, lerp(ds, BS, e), { pose: "kaget", t, k: 0.35 + jump * 0.4, mood: "happy", seru: false });
      } else {
        let tg = null, mood = "happy";
        if (l > T.cari - 0.2 && l < T.tetapi) tg = [COLL.cx + 60, l < T.coba ? 312 : l < T.tulis ? 434 : 570];
        else if (l >= T.tetapi && l < T.end + 0.2) { tg = l < T.uji ? [PG.x + 250, PG.y + 420] : [PG.x + 300, PG.y + 520]; mood = l > T.benar ? "wow" : "happy"; }
        o = tg ? { pose: "tunjuk", t, target: tg, mood } : { pose: "diam", t, mood: "happy", look: [0.6, -0.5] };
        KB.draw(ctx, BX, BY, BS, o);
      }
    }
    // gambar akhir bab 8 larut keluar (gaya gambarnya sedikit berbeda dengan gambar bab ini)
    if (l < 0.72) drawPrev(ctx, img8, 1 - eio(ramp(l, 0.5, 0.22)));
    // label (sesudah vignette)
    D.post(cx => {
      const [bx, by] = toS(c, BOOK9.x, BOOK9.y - 150);
      // "usang?" (dicoret saat "tidak") + "Tidak." → naik ke atas tengah
      const mv = eio(ramp(l, T.tidak + 0.35, 0.9));
      const pU = pop(l, T.usang), pT = pop(l, T.tidak);
      const ux = lerp(bx - 60, 760, mv), uy = lerp(by + 36, 120, mv), tx = lerp(bx + 230, 1080, mv);
      const wU = tag(cx, "usang?", ux, uy, pU.a, { sp: pU.sp, col: "#A9A9B8", size: 52 });
      const sk = ramp(l, T.tidak - 0.1, 0.35);
      if (sk > 0 && wU) { cx.save(); cx.strokeStyle = "#FF5A5F"; cx.lineWidth = 8; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(ux - wU * 0.36, uy + 4); cx.lineTo(ux - wU * 0.36 + wU * 0.72 * sk, uy - 6); cx.stroke(); cx.restore(); }
      tag(cx, "Tidak.", tx, uy, pT.a, { sp: pT.sp, col: P.green, size: 56 });
      // "AI?" di dekat kartu (fase meja)
      const [ax, ay] = toS(c, 640, 176), pA = pop(l, T.ai);
      tag(cx, "AI?", ax, ay, pA.a * (1 - ramp(l, T.tidak + 0.2, 0.4)), { sp: pA.sp, col: P.teal, size: 52 });
      // kepala kolom
      const hA = pop(l, T.aiM - 0.05), hM = pop(l, T.man - 0.1);
      cx.save(); cx.globalAlpha *= hA.a; cx.translate(COLL.cx, 206); cx.scale(lerp(0.85, 1, hA.sp), lerp(0.85, 1, hA.sp)); D.label(cx, "AI membantu", 0, 0, { size: 50, col: P.teal }); cx.restore();
      cx.save(); cx.globalAlpha *= hM.a; cx.translate(COLR.cx, 206); cx.scale(lerp(0.85, 1, hM.sp), lerp(0.85, 1, hM.sp)); D.label(cx, "Manusia", 0, 0, { size: 50, col: P.amber }); cx.restore();
      // baris AI (teal) dan manusia (amber), muncul tepat saat diucapkan; yang sedang dibicarakan menyala
      const actA = (s0, s1) => ramp(l, s0 - 0.1, 0.2) * (1 - ramp(l, s1, 0.3));
      vrow(cx, COLL.cx, 262, COLL.w, 104, ["mencari"], "cari", P.teal, ramp(l, T.cari - 0.08, 0.4), actA(T.cari, T.coba));
      vrow(cx, COLL.cx, 384, COLL.w, 104, ["mencoba"], "coba", P.teal, ramp(l, T.coba - 0.08, 0.4), actA(T.coba, T.tulis));
      vrow(cx, COLL.cx, 506, COLL.w, 134, ["menulis", "sebagian bukti"], "tulis", P.teal, ramp(l, T.tulis - 0.08, 0.4), actA(T.tulis, T.tetapi));
      vrow(cx, COLR.cx, 262, COLR.w, 134, ["mengajukan", "pertanyaan"], "tanya", P.amber, ramp(l, T.tanya - 0.08, 0.4), actA(T.tanya, T.damping));
      vrow(cx, COLR.cx, 414, COLR.w, 104, ["mendampingi"], "damping", P.amber, ramp(l, T.damping - 0.08, 0.4), actA(T.damping, T.uji));
      vrow(cx, COLR.cx, 536, COLR.w, 104, ["menguji"], "uji", P.amber, ramp(l, T.uji - 0.08, 0.4), actA(T.uji, T.periksa));
      vrow(cx, COLR.cx, 658, COLR.w, 104, ["memeriksa"], "cek", P.amber, ramp(l, T.periksa - 0.08, 0.4), ramp(l, T.periksa - 0.1, 0.2));
      // "benar" tepat di atas halaman, di atas centang besar pada kubus
      const pB = pop(l, T.benar);
      tag(cx, "benar", PG.x + PCUBE.x, PG.y - 26, pB.a, { sp: pB.sp, col: P.green, size: 52 });
    });
  }

  // =====================================================================
  // POHON (b9_2 …): tumbuh dari kertas 12 bab; cabang kiri (utuh) = jilid yang sudah terbit, cabang kanan (putus-putus) = jilid yang
  // belum ditulis; daunnya ikon aplikasi. Batang di x 880, tajuk x 520–1320, y 80–560 (kamera b9_2 ≈ identitas, pusat x 960).
  const PAPER = { x: 880, y: 806, w: 430, h: 132 };
  function paper12(ctx, t, o) {
    const { x, y, w, h } = PAPER, a = o.a == null ? 1 : o.a; if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha *= a;
    shadowE(ctx, x + 14, y + 12, w * 0.56, h * 0.5, 0.3);
    ctx.fillStyle = "#F1E6CC"; ctx.beginPath(); ctx.moveTo(x - w / 2 + 30, y - h / 2); ctx.lineTo(x + w / 2 - 10, y - h / 2); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x - w / 2, y + h / 2); ctx.closePath(); ctx.fill();
    // dua kolom × 6 baris (12 bab, sama dengan lembar besar)
    for (let i = 0; i < 12; i++) { const col = i < 6 ? 0 : 1, r = i % 6, v = (r + 0.8) / 6.4, yy = y - h / 2 + v * h, xl = lerp(x - w / 2 + 30, x - w / 2, v) + 26 + col * (w / 2 - 6);
      ctx.fillStyle = "rgba(40,48,110,0.75)"; ctx.beginPath(); ctx.arc(xl, yy, 3, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(40,48,110,0.6)"; ctx.lineWidth = 2.4; ctx.beginPath(); const ww = (w / 2 - 60) * (0.55 + 0.4 * Math.abs(Math.sin(i * 2.3))); ctx.moveTo(xl + 12, yy); for (let q = 0; q <= 10; q++) ctx.lineTo(xl + 12 + ww * q / 10, yy + Math.sin(q * 1.9 + i) * 1.5); ctx.stroke(); }
    ctx.restore();
  }
  // lembar 1962 besar (koordinat halaman 720 × 640): "1962 · 12 bab", 12 baris bernomor dalam dua kolom
  function sheet1962(ctx, a) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    txt(ctx, "1962 · 12 bab", 360, 78, 56, { align: "center", weight: 900, color: INK });
    ctx.fillStyle = "rgba(229,72,77,0.55)"; ctx.fillRect(120, 104, 480, 5);
    for (let i = 0; i < 12; i++) { const col = i < 6 ? 0 : 1, r = i % 6, x = 66 + col * 330, y = 170 + r * 80;
      txt(ctx, String(i + 1), x + 22, y + 16, 44, { align: "center", weight: 900, color: "#B4621C" });
      ctx.strokeStyle = "rgba(40,48,110,0.55)"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); const ww = 170 + 70 * Math.abs(Math.sin(i * 2.3)); ctx.moveTo(x + 62, y); for (let q = 0; q <= 16; q++) ctx.lineTo(x + 62 + ww * q / 16, y + Math.sin(q * 1.7 + i) * 3); ctx.stroke(); }
    ctx.restore();
  }
  const TRUNK = { x: 880, y: 796, fy: 600 };
  const LIMBS = [{ f: [880, 650], c: [770, 630], e: [700, 500] }, { f: [880, 610], c: [880, 470], e: [880, 330] }, { f: [880, 640], c: [1000, 625], e: [1090, 480] }];
  const TIPS = [[560, 480], [605, 352], [665, 240], [760, 165], [870, 140], [992, 158], [1105, 195], [1190, 282], [1250, 386], [1275, 500]];
  const TIP_LIMB = [0, 0, 0, 1, 1, 1, 2, 2, 2, 2];
  const BH = 112, BW = 82, C4 = { w: 112, h: 152 };
  const tipSize = i => i === 5 ? C4 : { w: BW, h: BH };
  const q2 = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  function branchCurve(i) { const e = LIMBS[TIP_LIMB[i]].e, T = TIPS[i], end = [T[0], T[1] + tipSize(i).h / 2 - 8]; return { a: e, c: [lerp(e[0], end[0], 0.8), lerp(e[1], end[1], 0.2)], b: end }; }
  function strokeQ(ctx, a, c, b, u) { const n = 24; ctx.beginPath(); ctx.moveTo(a[0], a[1]); for (let q = 1; q <= n * u; q++) { const p = q2(a, c, b, q / n); ctx.lineTo(p[0], p[1]); } const p = q2(a, c, b, u); ctx.lineTo(p[0], p[1]); ctx.stroke(); }
  const LEAF_IC = ["telepon", "kamera", "cari", "video", "grup", "bank", "unggah", "bagikan", "kunci", "mik", "putar", "bendera"];
  const LEAF_COL = ["#4FD67F", "#FF8A65", "#5AA9FF", "#FF5A7A", "#9584FF", "#3FB8C8", "#F5B83D", "#5BD68A", "#7C8CF0", "#FF7FB0", "#36B3A3", "#E8665F"];
  // daun = ikon aplikasi di sela cabang (tidak menutupi buku); tangkainya ke titik cabang/dahan terdekat
  const LEAF_XY = [[628, 562], [690, 452], [712, 352], [775, 272], [760, 548], [770, 395], [836, 300], [930, 300], [960, 430], [1010, 352], [830, 470], [1000, 522]];
  const LEAVES = LEAF_XY.map((p, k) => ({ p, ic: LEAF_IC[k], col: LEAF_COL[k] }));
  let BASES = null;
  function leafPos(L) {
    if (!BASES) { const pts = []; LIMBS.forEach(m => { for (let q = 0; q <= 20; q++) pts.push(q2(m.f, m.c, m.e, q / 20)); }); for (let i = 0; i < 10; i++) { const c = branchCurve(i); for (let q = 0; q <= 20; q++) pts.push(q2(c.a, c.c, c.b, q / 20 * 0.8)); }
      BASES = LEAVES.map(L2 => { let best = null, bd = 1e9; pts.forEach(pt => { const d = Math.hypot(pt[0] - L2.p[0], pt[1] - L2.p[1]); if (d < bd) { bd = d; best = pt; } }); return best; }); }
    return [L.p[0], L.p[1], BASES[LEAVES.indexOf(L)]];
  }
  // ikon aplikasi (kotak 60 px)
  function leaf(ctx, x, y, L, s, t, a = 1, base) {
    if (s <= 0.01 || a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    if (base) { ctx.strokeStyle = "#5E8C4A"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.lineTo(x, y); ctx.stroke(); }
    ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.3 + x * 0.01) * 0.1); ctx.scale(s, s);
    ctx.fillStyle = "rgba(10,14,40,0.3)"; RR(ctx, -27, -24, 60, 60, 15); ctx.fill();
    ctx.fillStyle = L.col; RR(ctx, -30, -30, 60, 60, 15); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)"; RR(ctx, -30, -30, 60, 24, 14); ctx.fill();
    KY.ikon(ctx, L.ic, 0, 0, 38, "#FFFFFF"); ctx.restore();
  }
  // HP di meja: layar beranda yang terisi daun (ikon) satu per satu
  const PHONE = { x: 1690, y: 612, h: 360 };
  function homeScreen(c2, w, h, t, n) {
    const g2 = c2.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, "#3A4FB0"); g2.addColorStop(1, "#6C4FB8"); c2.fillStyle = g2; c2.fillRect(0, 0, w, h);
    const cols = 3, rows = 4, cw = w / cols, rh = (h * 0.8) / rows, s = Math.min(cw, rh) * 0.66;
    for (let i = 0; i < 12; i++) { const r = Math.floor(i / cols), cc = i % cols, x = cw * (cc + 0.5), y = h * 0.1 + rh * (r + 0.5);
      const f = clamp(n - i); if (f <= 0) { c2.strokeStyle = "rgba(255,255,255,0.25)"; c2.lineWidth = 2; c2.setLineDash([5, 5]); RR(c2, x - s / 2, y - s / 2, s, s, s * 0.26); c2.stroke(); c2.setLineDash([]); continue; }
      const k = clamp(spring(f * 0.8, 10, 0.5)); c2.save(); c2.translate(x, y); c2.scale(k, k); c2.fillStyle = LEAVES[i].col; RR(c2, -s / 2, -s / 2, s, s, s * 0.26); c2.fill(); KY.ikon(c2, LEAVES[i].ic, 0, 0, s * 0.62, "#FFFFFF"); c2.restore(); }
  }
  // siput (pelan tetapi terus berjalan); s = skala (2 = ± 210 px)
  function snail(ctx, x, y, t, a, s = 2) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
    shadowE(ctx, 4, 6, 54, 9, 0.25);
    const st = Math.sin(t * 3) * 3, str = 1 + 0.06 * Math.sin(t * 3);   // badan mengulur-mengerut
    ctx.save(); ctx.scale(str, 1);
    ctx.fillStyle = "#C9B8E8"; ctx.beginPath(); ctx.moveTo(-46, 4); ctx.quadraticCurveTo(-10, -4 + st * 0.2, 40, 2); ctx.quadraticCurveTo(58, 2, 56, -18); ctx.quadraticCurveTo(52, -30, 44, -26); ctx.lineTo(36, -6); ctx.lineTo(-46, 6); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "#C9B8E8"; ctx.lineWidth = 3; ctx.lineCap = "round"; const ea = Math.sin(t * 2) * 3; ctx.beginPath(); ctx.moveTo(48 * str, -24); ctx.lineTo(54 * str + ea, -44); ctx.moveTo(44 * str, -24); ctx.lineTo(42 * str - ea, -42); ctx.stroke();
    ctx.fillStyle = "#2B2440"; [[54 * str + ea, -44], [42 * str - ea, -42]].forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px, py, 3.5, 0, TAU); ctx.fill(); });
    ctx.fillStyle = "#E39A4A"; ctx.beginPath(); ctx.arc(-6, -22, 28, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#A8622A"; ctx.lineWidth = 4; ctx.beginPath(); for (let q = 0; q <= 40; q++) { const a2 = q / 40 * TAU * 2.2, r = 24 * (1 - q / 46); const px = -6 + Math.cos(a2) * r, py = -22 + Math.sin(a2) * r; q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
    // jejak lendir mengilap di belakang
    ctx.strokeStyle = "rgba(220,230,255,0.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-46, 7); ctx.lineTo(-120, 7); ctx.stroke();
    ctx.restore();
  }
  // posisi x siput: makin pelan tetapi tidak pernah berhenti (x = detik sejak awal b9_2)
  const snailX = (T, x) => 470 + 170 * (1 - Math.exp(-Math.max(0, x - (T.belajar - 0.3)) / 6)) + 0.6 * Math.max(0, x - T.belajar);
  // kartu pendapat (berbalik 2023 → 2026): baris kedua menjelaskan pendapatnya; sc = skala (kecil saat disimpan di tumpukan)
  function opinionCard(ctx, x, y, a, flip, t, sc = 1) {
    if (a <= 0.01) return; const cs = Math.cos(clamp(flip) * Math.PI), back = cs < 0, sp = clamp(spring(a * 0.9, 9, 0.5));
    ctx.save(); ctx.globalAlpha *= clamp(a * 3); ctx.translate(x, y + Math.sin(t * 1.2) * 4 * sc); ctx.scale(sc * (Math.abs(cs) * lerp(0.7, 1, sp) + 0.001), sc * lerp(0.7, 1, sp));
    const w = 560, h = 176;
    if (back) addLight(ctx, 0, 0, 300, P.warm, 0.4);
    ctx.fillStyle = "rgba(10,14,40,0.35)"; RR(ctx, -w / 2 + 6, -h / 2 + 8, w, h, 18); ctx.fill();
    ctx.fillStyle = back ? "#FFF6E2" : "#DADDEA"; RR(ctx, -w / 2, -h / 2, w, h, 18); ctx.fill();
    ctx.strokeStyle = back ? P.amber : "#8A90AE"; ctx.lineWidth = 5; ctx.stroke();
    if (Math.abs(cs) > 0.3) {
      wtxt(ctx, back ? "pendapat 2026" : "pendapat 2023", -w / 2 + 34, -18, 48, { weight: 900, color: back ? "#B4621C" : "#5A6080" });
      wtxt(ctx, back ? "“Hats off to Claude!”" : "AI suka mengarang", -w / 2 + 34, 52, 44, { weight: back ? "italic 800" : 800, color: back ? "#2B2F5E" : "#3A3F5E" });
      // ikon: tanda tanya (2023) atau panah putar (2026)
      ctx.strokeStyle = back ? "#E28A2E" : "#6E7596"; ctx.lineWidth = 8; ctx.lineCap = "round"; const ix = w / 2 - 52, iy = -32;
      if (back) { ctx.beginPath(); ctx.arc(ix, iy, 24, -2.6, 2.2); ctx.stroke(); ctx.fillStyle = "#E28A2E"; ctx.beginPath(); const ax = ix + Math.cos(2.2) * 24, ay = iy + Math.sin(2.2) * 24; ctx.moveTo(ax - 14, ay - 4); ctx.lineTo(ax + 6, ay - 14); ctx.lineTo(ax + 8, ay + 10); ctx.closePath(); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(ix, iy - 8, 15, Math.PI * 1.05, Math.PI * 2.4); ctx.stroke(); ctx.beginPath(); ctx.arc(ix, iy + 28, 4, 0, TAU); ctx.fillStyle = "#6E7596"; ctx.fill(); }
    }
    ctx.restore();
  }
  // buku kecil terbuka di meja (salah ketik dilingkari)
  const OPENB = { x: 1290, y: 806, w: 250, h: 92 };
  function openBook(ctx, t, circ, a = 1) {
    if (a <= 0.01) return; const { x, y, w, h } = OPENB; ctx.save(); ctx.globalAlpha *= a;
    shadowE(ctx, x + 10, y + 16, w * 0.6, 22, 0.3);
    ctx.fillStyle = "#36B3A3"; ctx.beginPath(); ctx.moveTo(x - w / 2 - 10, y + h / 2 + 8); ctx.lineTo(x + w / 2 + 10, y + h / 2 + 8); ctx.lineTo(x + w / 2 - 6, y - h / 2 - 4); ctx.lineTo(x - w / 2 + 6, y - h / 2 - 4); ctx.closePath(); ctx.fill();
    [-1, 1].forEach(sd => { ctx.fillStyle = sd < 0 ? "#F4EBD6" : "#FBF6EA"; ctx.beginPath(); ctx.moveTo(x, y + h / 2 + 2); ctx.lineTo(x + sd * w / 2, y + h / 2); ctx.lineTo(x + sd * (w / 2 - 14), y - h / 2); ctx.quadraticCurveTo(x + sd * w * 0.2, y - h / 2 - 10, x, y - h / 2 + 2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(40,48,110,0.5)"; ctx.lineWidth = 2.2; for (let k = 0; k < 5; k++) { const yy = y - h / 2 + 16 + k * 15; ctx.beginPath(); ctx.moveTo(x + sd * 14, yy); ctx.lineTo(x + sd * (w / 2 - 22 - (k === 4 ? 40 : 0)), yy); ctx.stroke(); } });
    if (circ > 0) { ctx.save(); ctx.strokeStyle = "#E5484D"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x + 70, y - h / 2 + 46, 30, 13, -0.1, -1.2, -1.2 + TAU * clamp(circ)); ctx.stroke(); ctx.restore(); }
    ctx.restore();
  }
  // kotak perbesaran salah ketik di atas buku: kata besar "algoritna" → huruf salah dilingkari → dibetulkan menjadi "m"; ✗ → ✓
  const ZOOM = { x: 1236, y: 652, w: 400, h: 200 };
  function typoZoom(ctx, T, l, t) {
    const a = ramp(l, T.menemukan - 0.1, 0.3) * (1 - ramp(l, 7.65, 0.3)); if (a <= 0.01) return;
    const { x, y, w, h } = ZOOM, sp = clamp(spring(l - T.menemukan + 0.1, 10, 0.55));
    ctx.save(); ctx.globalAlpha *= a;
    // segitiga penghubung ke titik salah ketik di buku
    ctx.fillStyle = "rgba(251,247,236,0.55)"; ctx.beginPath(); ctx.moveTo(x - 60, y + h / 2 - 4); ctx.lineTo(x + 20, y + h / 2 - 4); ctx.lineTo(OPENB.x + 70, OPENB.y - OPENB.h / 2 + 46); ctx.closePath(); ctx.fill();
    ctx.translate(x, y); ctx.scale(lerp(0.6, 1, sp), lerp(0.6, 1, sp));
    ctx.fillStyle = "rgba(6,8,30,0.4)"; RR(ctx, -w / 2 + 8, -h / 2 + 10, w, h, 22); ctx.fill();
    ctx.fillStyle = "#FBF7EC"; RR(ctx, -w / 2, -h / 2, w, h, 22); ctx.fill(); ctx.strokeStyle = "#2B3270"; ctx.lineWidth = 7; ctx.stroke();
    const fixU = ramp(l, T.salah + 0.45, 0.35), word = "algorit", tail = "a";
    ctx.font = `900 62px ${FONT}`; const w1 = ctx.measureText(word).width, wm = ctx.measureText(fixU > 0.5 ? "m" : "n").width, wa = ctx.measureText(tail).width, x0 = -(w1 + wm + wa) / 2, by = 10;
    txt(ctx, word, x0, by, 62, { weight: 900, color: "#2B2F5E" });
    txt(ctx, fixU > 0.5 ? "m" : "n", x0 + w1, by, 62, { weight: 900, color: fixU > 0.5 ? "#1E9E5A" : "#E5484D" });
    txt(ctx, tail, x0 + w1 + wm, by, 62, { weight: 900, color: "#2B2F5E" });
    const cu = ramp(l, T.salah - 0.1, 0.45); if (cu > 0) { ctx.strokeStyle = fixU > 0.5 ? "#1E9E5A" : "#E5484D"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x0 + w1 + wm / 2, by - 20, wm * 0.72, 42, -0.1, -1.2, -1.2 + TAU * cu); ctx.stroke(); }
    // ✗ → ✓
    const my = 66, ma = ramp(l, T.salah + 0.1, 0.3); if (ma > 0) { cross(ctx, -60, my, 40, ma); ctx.save(); ctx.globalAlpha *= ma; ctx.strokeStyle = "#2B2F5E"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-26, my); ctx.lineTo(22, my); ctx.moveTo(10, my - 10); ctx.lineTo(22, my); ctx.lineTo(10, my + 10); ctx.stroke(); ctx.restore(); check(ctx, 60, my, 44, fixU); }
    ctx.restore();
  }
  // sertifikat hadiah generik (tanpa nama bank sungguhan)
  function certificate(ctx, x, y, s, a, t) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= clamp(a * 3); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.5) * 0.05); ctx.scale(s, s);
    addLight(ctx, 0, 0, 160, P.amber, 0.4);
    ctx.fillStyle = "#FFF4D6"; RR(ctx, -100, -58, 200, 116, 10); ctx.fill(); ctx.strokeStyle = "#D9A23A"; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = "#E7C27A"; ctx.lineWidth = 2; RR(ctx, -90, -48, 180, 96, 6); ctx.stroke();
    ctx.fillStyle = "#E9A23B"; ctx.beginPath(); for (let k = 0; k < 16; k++) { const a2 = k / 16 * TAU, r = k % 2 ? 22 : 30; ctx.lineTo(-52 + Math.cos(a2) * r, Math.sin(a2) * r); } ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFF4D6"; ctx.beginPath(); ctx.arc(-52, 0, 13, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#B98A3A"; ctx.lineWidth = 4; ctx.lineCap = "round"; [-22, -2, 18].forEach((yy, k) => { ctx.beginPath(); ctx.moveTo(-8, yy); ctx.lineTo(70 - k * 12, yy); ctx.stroke(); });
    ctx.restore();
  }
  const CERT0 = { x: 1440, y: 470 }, CERT_FLY = 7.6;

  // waktu peristiwa b9_2 (relatif awal beat)
  function T92(b) {
    return { knuth: D.at(b, "Knuth"), menulis: D.at(b, "menulis"), bukunya: D.at(b, "bukunya"), enam: D.at(b, "enam"), tahun: D.atEnd(b, "tahun."), ia: D.at(b, "Ia memberi"),
      hadiah: D.at(b, "hadiah"), menemukan: D.at(b, "menemukan"), salah: D.at(b, "kesalahannya,"), usia: D.at(b, "usia"), dl: D.at(b, "delapan puluh delapan"), d88: D.at(b, "puluh delapan"),
      terbuka: D.at(b, "terbuka"), pikir: D.at(b, "memikirkan"), pend: D.atEnd(b, "pendapatnya."), belajar: D.at(b, "Belajar"), cepat: D.at(b, "tidak harus"), asal: D.at(b, "asalkan"),
      henti: D.at(b, "tidak berhenti."), end: D.speechEnd(b) };
  }
  // status pohon pada waktu x (detik sejak awal b9_2; boleh > dur untuk beat sesudahnya)
  function treeState(T, x) {
    const f0 = T.tahun + 1.2, rate = 0.30 / Math.max(1, T.asal - f0);
    return {
      trunk: eio(ramp(x, 1.45, 1.0)), limbs: [0, 1, 2].map(i => eio(ramp(x, 1.9 + i * 0.15, 0.9))),
      fly: [0, 1, 2, 3, 4].map(i => ramp(x, T.bukunya + 0.35 + i * 0.2, 1.0)),
      dash: [5, 6, 7, 8, 9].map((_, k) => ramp(x, T.tahun + 0.15 + k * 0.12, 0.7)),
      leaves: LEAVES.map((_, i) => ramp(x, T.tahun + 0.6 + i * 0.07, 0.45)),
      // 4C terisi pelan sampai ± sepertiga (fasikel 7 = sepertiga pertama 4C); saat Bip menunjuk, baris baru tetap bertambah
      fill4C: x < T.asal ? clamp(x - f0, 0, 99) * rate : 0.30 + 0.05 * (1 - Math.exp(-(x - T.asal) / 2)) + 0.0015 * (x - T.asal),
      sent: clamp((x - (T.tahun + 1.8)) / 0.8),
      penA: ramp(x, T.tahun + 0.9, 0.5),
      ring: ramp(x, T.asal - 0.1, 0.4),
    };
  }
  // ujung pensil yang menulis di dalam 4C (bergerak bolak-balik, naik pelan bersama isian)
  function penTip4C(fill, t) { const T4 = TIPS[5], top = T4[1] + C4.h / 2 - C4.h * clamp(fill + 0.02); return [T4[0] - 36 + (0.5 + 0.5 * Math.sin(t * 2.6)) * 64, top + Math.sin(t * 9) * 2]; }
  function draw4C(ctx, t, st, a) {
    const B = BOOKS[5], [x, y] = TIPS[5], { w, h } = C4, f = clamp(st.fill4C);
    ctx.save(); ctx.globalAlpha *= a;
    if (st.ring > 0.01) { const ph = (t * 0.8) % 1; ctx.strokeStyle = D.hexA(P.amber, st.ring * (1 - ph)); ctx.lineWidth = 6; RR(ctx, x - w / 2 - 14 - ph * 30, y - h / 2 - 14 - ph * 30, w + 28 + ph * 60, h + 28 + ph * 60, 18); ctx.stroke();
      ctx.strokeStyle = D.hexA(P.amber, 0.9 * st.ring); ctx.lineWidth = 5; RR(ctx, x - w / 2 - 12, y - h / 2 - 12, w + 24, h + 24, 16); ctx.stroke(); }
    bookUp(ctx, x, y, B, t, { w, h, fill: f, ls: 48, ly: y - h * 0.22 });
    // baris yang sudah ditulis di bagian yang terisi (garis putih tipis)
    const top = y + h / 2 - h * f; ctx.save(); RR(ctx, x - w / 2, y - h / 2, w, h, 8); ctx.clip(); ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 3; ctx.lineCap = "round";
    for (let yy = y + h / 2 - 9; yy > top + 6; yy -= 11) { const k = Math.round((y + h / 2 - yy) / 11); ctx.beginPath(); ctx.moveTo(x - w / 2 + 14, yy); ctx.lineTo(x + w / 2 - 14 - (k % 3) * 14, yy); ctx.stroke(); }
    ctx.restore();
    ctx.restore();
  }
  function drawTree(ctx, t, st, opt = {}) {
    // batang
    if (st.trunk > 0) {
      ctx.save(); ctx.lineCap = "round";
      const ty = lerp(TRUNK.y, TRUNK.fy - 40, st.trunk);
      ctx.strokeStyle = "#6E4630"; ctx.lineWidth = 44; ctx.beginPath(); ctx.moveTo(TRUNK.x, TRUNK.y); ctx.quadraticCurveTo(TRUNK.x - 14, lerp(TRUNK.y, ty, 0.5), TRUNK.x, ty); ctx.stroke();
      ctx.strokeStyle = "rgba(255,210,160,0.25)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(TRUNK.x - 10, TRUNK.y - 10); ctx.quadraticCurveTo(TRUNK.x - 22, lerp(TRUNK.y, ty, 0.5), TRUNK.x - 10, ty); ctx.stroke();
      ctx.strokeStyle = "#6E4630"; ctx.lineWidth = 10; [[-1, 60], [1, 54], [-1, 28]].forEach(([sd, dx]) => { ctx.beginPath(); ctx.moveTo(TRUNK.x, TRUNK.y - 8); ctx.quadraticCurveTo(TRUNK.x + sd * dx * 0.5, TRUNK.y - 2, TRUNK.x + sd * dx * st.trunk, TRUNK.y + 12); ctx.stroke(); });
      ctx.restore();
    }
    // dahan
    LIMBS.forEach((m, i) => { const u = st.limbs[i]; if (u <= 0) return; ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#7A4E36"; ctx.lineWidth = 24; strokeQ(ctx, m.f, m.c, m.e, u); ctx.restore(); });
    // cabang ke buku (utuh untuk 1–4B; putus-putus untuk 4C–7)
    TIPS.forEach((T, i) => {
      const q = branchCurve(i), lu = st.limbs[TIP_LIMB[i]]; if (lu < 0.98) return;
      if (i < 5) { const u = clamp(st.fly[i] * 1.6); if (u <= 0) return; ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = "#8A5A3C"; ctx.lineWidth = 12; strokeQ(ctx, q.a, q.c, q.b, u); ctx.restore(); }
      else { const u = st.dash[i - 5]; if (u <= 0) return; ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = D.hexA(P.warm, 0.85); ctx.lineWidth = 8; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 12; strokeQ(ctx, q.a, q.c, q.b, u); ctx.setLineDash([]); ctx.restore(); }
    });
    // daun = ikon aplikasi (yang sudah terbang ke HP tidak digambar lagi di pohon kecuali opt.keep)
    LEAVES.forEach((L, i) => { const u = st.leaves[i]; if (u <= 0) return; const [x, y, base] = leafPos(L); leaf(ctx, x, y, L, clamp(spring(u * 0.9, 10, 0.5)), t, clamp(u * 3), base); });
    // buku di ujung cabang (terbang dari rak)
    TIPS.forEach((T, i) => {
      const B = BOOKS[i], sz = tipSize(i);
      if (i < 5) { const u = st.fly[i]; if (u <= 0) return; const e = eio(u), h0 = bookH(B), sx = bookX(i) + SHELF.bw / 2, sy = SHELF.y - h0 / 2;
        const x = lerp(sx, T[0], e), y = lerp(sy, T[1], e) - Math.sin(e * Math.PI) * 120;
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(e * Math.PI) * 0.4 * (i % 2 ? 1 : -1)); bookUp(ctx, 0, 0, B, t, { w: lerp(SHELF.bw, sz.w, e), h: lerp(h0, sz.h, e), label: e > 0.85, ls: 48, lr: 36 }); ctx.restore(); }
      else { const u = st.dash[i - 5]; if (u <= 0.6) return; const a = clamp((u - 0.6) * 3); if (i === 5) draw4C(ctx, t, st, a); else { ctx.save(); ctx.globalAlpha *= a; bookUp(ctx, T[0], T[1], B, t, { w: sz.w, h: sz.h, ls: 48 }); ctx.restore(); } }
    });
    // pensil yang terus menulis di dalam 4C (± 150 px)
    if (st.penA > 0.01) { const [px, py] = penTip4C(st.fill4C, t); ctx.save(); ctx.globalAlpha *= st.penA; addLight(ctx, px, py, 70, P.warm, 0.5); pencil(ctx, px, py, 1.05, 0, 150); ctx.restore(); }
  }
  // kamera b9_2 dan sesudahnya (waktu sejak awal b9_2): dekat identitas supaya tata letak = koordinat layar
  function camTree(x) { return D.path([[0, 960, 540, 1.035], [1.6, 960, 532, 1.0], [19, 960, 532, 1.025], [31, 960, 532, 1.04], [33.5, 960, 536, 1.0], [80, 960, 536, 1.02]], x); }
  // Bip di meja dekat HP (b9_2); pada "asalkan" berjalan ke batang pohon lalu menunjuk 4C
  const BIP2 = { x: 1478, y: 806, s: 160 }, BIP2B = { x: 1150, y: 806 };
  function bip2Pos(T, l) { const w = eio(ramp(l, T.asal - 0.75, 0.75)); return { x: lerp(BIP2.x, BIP2B.x, w), y: BIP2.y, w }; }
  function bip92(ctx, T, l, t) {
    const ps = bip2Pos(T, l); let o;
    if (l < T.hadiah - 0.2) o = { pose: "diam", t, mood: "happy", look: [-0.9, -0.6] };
    else if (l < CERT_FLY) o = { pose: "kacaPembesar", t, target: [OPENB.x + 70, OPENB.y - 40], mood: l > T.salah ? "wow" : "think", content: (c2, cx, cy, r) => { c2.save(); c2.translate(cx, cy); c2.scale(1.9, 1.9); c2.translate(-cx, -cy); openBook(c2, t, ramp(l, T.salah - 0.1, 0.5)); c2.restore(); } };
    else if (l < CERT_FLY + 0.55) o = { pose: "diam", t, mood: "wow", look: [-0.6, -0.9] };
    else if (l < T.terbuka) o = { pose: "pegang", t, mood: "happy", prop: (c2, px, py, s) => certificate(c2, px, py - s * 0.08, 0.5, 1, t) };
    else if (l < T.belajar - 0.2) o = { pose: "diam", t, mood: "happy", look: l < T.pikir ? [-0.9, -0.2] : [-1, -0.4] };
    else if (l < T.asal - 0.75) o = { pose: "pegang", t, mood: "happy", prop: (c2, px, py, s) => miniBook(c2, px, py, s * 0.42, t) };
    else if (ps.w < 1) o = { pose: "jalan", t, dir: -1, speed: 1.4 };
    else o = { pose: "tunjuk", t, target: [TIPS[5][0] + 20, TIPS[5][1] + 30], mood: "happy" };
    KB.draw(ctx, ps.x, ps.y, BIP2.s, o);
  }
  function miniBook(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.05);
    ctx.fillStyle = "#6A7BE0"; RR(ctx, -s * 0.62, -s * 0.38, s * 1.24, s * 0.76, 6); ctx.fill();
    ctx.fillStyle = "#FBF6EA"; RR(ctx, -s * 0.56, -s * 0.32, s * 0.54, s * 0.64, 4); ctx.fill(); RR(ctx, s * 0.02, -s * 0.32, s * 0.54, s * 0.64, 4); ctx.fill();
    ctx.strokeStyle = "rgba(40,48,110,0.5)"; ctx.lineWidth = 2; for (let k = 0; k < 4; k++) { const yy = -s * 0.2 + k * s * 0.13; ctx.beginPath(); ctx.moveTo(-s * 0.48, yy); ctx.lineTo(-s * 0.1, yy); ctx.moveTo(s * 0.1, yy); ctx.lineTo(s * 0.48, yy); ctx.stroke(); }
    ctx.restore();
  }
  // daun-ikon yang sedang terbang ke HP
  function flyingLeaves(ctx, t, st) {
    const n = Math.floor(st.sent); if (st.sent <= 0) return;
    const scr = { x: PHONE.x - PHONE.h * 0.21, y: PHONE.y - PHONE.h * 0.38, w: PHONE.h * 0.42, h: PHONE.h * 0.76 };
    for (let i = Math.max(0, n - 1); i <= Math.min(11, n); i++) { const f = clamp(st.sent - i); if (f <= 0 || f >= 1) continue;
      const [lx, ly] = leafPos(LEAVES[i]); const r = Math.floor(i / 3), cc = i % 3, tx = scr.x + scr.w / 3 * (cc + 0.5), ty = scr.y + scr.h * 0.1 + scr.h * 0.8 / 4 * (r + 0.5);
      const e = eio(f), x = lerp(lx, tx, e), y = lerp(ly, ty, e) - Math.sin(e * Math.PI) * 160;
      leaf(ctx, x, y, LEAVES[i], lerp(1, 0.5, e), t, 1 - ramp(f, 0.9, 0.1)); }
  }
  // kartu pendapat: muncul di atas lampu/tumpukan, berbalik, lalu disimpan kecil di atas tumpukan naskah
  function opinionAt(T, x, ctx, t) {
    const a = ramp(x, T.terbuka - 0.3, 0.5), fl = ramp(x, T.pikir, 0.7), st = eio(ramp(x, T.belajar - 0.6, 0.8));
    opinionCard(ctx, lerp(412, 250, st), lerp(660, 742, st), a, fl, t, lerp(1, 0.36, st));
  }
  // label kelompok cabang: kiri utuh, kanan putus-putus
  function groupTag(ctx, s, x, y, a, sp, dashed) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.translate(x, y); const k = lerp(0.85, 1, sp); ctx.scale(k, k);
    ctx.font = `800 44px ${FONT}`; const w = ctx.measureText(s).width + 56, h = 74;
    ctx.fillStyle = "rgba(10,18,52,0.92)"; RR(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = dashed ? P.warm : "#E9A23B"; ctx.lineWidth = 4; if (dashed) { ctx.setLineDash([12, 9]); ctx.lineDashOffset = -0; } ctx.stroke(); ctx.setLineDash([]);
    txt(ctx, s, 0, 16, 44, { align: "center", weight: 800, color: dashed ? P.warm : "#FFFFFF" });
    ctx.restore();
  }

  function scene92(ctx, b, l, t, TL) {
    setLayout(1); NOTXT = null;
    const T = T92(b), st = treeState(T, l), c = drift(camTree(l), t);
    // halaman dari b9_1 menjadi lembar rencana 1962 (12 bab), lalu turun ke meja
    const b1 = beatOf(TL, "b9_1"), T1 = b1 ? T91(b1) : null;
    const sink = eio(ramp(l, 0.95, 0.8)), contentA = 1 - ramp(l, 0, 0.45), sheetA = ramp(l, 0.2, 0.4);
    const nSent = Math.min(12, Math.max(0, (l - (T.tahun + 1.8)) / 1.05));
    TXTA = 0.2 + 0.8 * sink;
    st.sent = nSent;
    ctx.save(); camT(ctx, c);
    world(ctx, t, {
      away: [0, 1, 2, 3, 4].map(i => st.fly[i]).concat(st.dash.map(u => clamp(u * 2))),
      paper: { a: sink >= 0.999 ? 1 : 0 }, cal: 1 - ramp(l, 0.2, 0.8), glassGlow: ramp(l, T.dl - 0.1, 0.5) * (1 - ramp(l, T.terbuka + 0.6, 0.6)),
      extraDesk: cx => {
        openBook(cx, t, ramp(l, T.salah - 0.1, 0.5));
        KY.hp(cx, PHONE.x, PHONE.y, PHONE.h, { t, lit: 1, glow: 0.45, glowCol: "#A9D4FF", screen: (c2, w, h, tt) => homeScreen(c2, w, h, tt, Math.floor(nSent + 0.001) + 0) });
      },
      tree: cx => { drawTree(cx, t, st); flyingLeaves(cx, t, st); opinionAt(T, l, cx, t);
        const fl = eio(ramp(l, CERT_FLY, 0.55)), ps = bip2Pos(T, l);
        certificate(cx, lerp(CERT0.x, ps.x, fl), lerp(CERT0.y, BIP2.y + 30, fl) - Math.sin(fl * Math.PI) * 80, lerp(1, 0.5, fl), ramp(l, T.hadiah - 0.05, 0.3) * (1 - ramp(l, CERT_FLY + 0.5, 0.1)), t); },
      front: cx => { snail(cx, snailX(T, l), 884, t, ramp(l, T.belajar - 0.2, 0.5)); bip92(cx, T, l, t); typoZoom(cx, T, l, t); },
    });
    ctx.restore();
    // halaman yang turun (layar)
    if (sink < 0.999 && T1) {
      const [px, py] = toS(c, PAPER.x - PAPER.w / 2, PAPER.y - PAPER.h / 2), pw = PAPER.w * c.z, ph = PAPER.h * c.z;
      const r = { x: lerp(PG.x, px, sink), y: lerp(PG.y, py, sink), w: lerp(PG.w, pw, sink), h: lerp(PG.h, ph, sink) };
      const scrim = 0.36 * (1 - sink); if (scrim > 0.01) { ctx.fillStyle = `rgba(8,12,40,${scrim})`; ctx.fillRect(0, 0, W, HH); }
      ctx.save(); ctx.translate(r.x, r.y); ctx.scale(r.w / PG.w, r.h / PG.h);
      pageDraw(ctx, t, pageState(T1, b1.dur + l), contentA);
      if (contentA > 0.01) { ctx.save(); ctx.globalAlpha *= contentA; pageCards(ctx, t, 1, 0.4, 0); ctx.restore(); }
      if (r.w / PG.w > 0.95) sheet1962(ctx, sheetA * (1 - contentA * 0.9));
      else { ctx.save(); ctx.globalAlpha *= sheetA; for (let i = 0; i < 12; i++) { const col = i < 6 ? 0 : 1, rr = i % 6, x = 66 + col * 330, y = 170 + rr * 80; ctx.fillStyle = "#B4621C"; ctx.beginPath(); ctx.arc(x + 22, y, 12, 0, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(40,48,110,0.55)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 62, y); ctx.lineTo(x + 62 + 170 + 70 * Math.abs(Math.sin(i * 2.3)), y); ctx.stroke(); } ctx.restore(); }
      ctx.restore();
      if (contentA > 0.01) { const pn = pen91(T1, b1.dur + l); ctx.save(); ctx.globalAlpha *= contentA; hand(ctx, pn.p[0], pn.p[1], t, 0.85, 0.62); ctx.restore();
        ctx.save(); ctx.globalAlpha *= contentA; KB.draw(ctx, 330, 798, 170, { pose: "diam", t, mood: "happy", look: [0.6, -0.5] }); ctx.restore(); }
    }
    D.post(cx => {
      // kolom b9_1 memudar
      if (contentA > 0.01 && T1) { cx.save(); cx.globalAlpha *= contentA;
        D.label(cx, "AI membantu", COLL.cx, 206, { size: 50, col: P.teal }); D.label(cx, "Manusia", COLR.cx, 206, { size: 50, col: P.amber });
        vrow(cx, COLL.cx, 262, COLL.w, 104, ["mencari"], "cari", P.teal, 1, 0); vrow(cx, COLL.cx, 384, COLL.w, 104, ["mencoba"], "coba", P.teal, 1, 0);
        vrow(cx, COLL.cx, 506, COLL.w, 134, ["menulis", "sebagian bukti"], "tulis", P.teal, 1, 0);
        vrow(cx, COLR.cx, 262, COLR.w, 134, ["mengajukan", "pertanyaan"], "tanya", P.amber, 1, 0); vrow(cx, COLR.cx, 414, COLR.w, 104, ["mendampingi"], "damping", P.amber, 1, 0);
        vrow(cx, COLR.cx, 536, COLR.w, 104, ["menguji"], "uji", P.amber, 1, 0); vrow(cx, COLR.cx, 658, COLR.w, 104, ["memeriksa"], "cek", P.amber, 1, 1);
        tag(cx, "benar", PG.x + PCUBE.x, PG.y - 26, 1, { col: P.green, size: 52 });
        cx.restore(); }
      // daftar keterangan di kanan atas (selalu sesudah diucapkan)
      const RX = 1556, clr1 = 1 - ramp(l, T.usia - 0.45, 0.35), clr2 = 1 - ramp(l, T.belajar - 0.45, 0.35);
      const cu = ramp(l, T.enam - 0.4, Math.max(0.6, T.tahun - T.enam + 0.4)), yr = Math.round(lerp(1962, 2026, eio(cu)));
      const pY = pop(l, T.knuth + 0.1);
      if (pY.a > 0 && clr1 > 0) { cx.save(); cx.globalAlpha *= pY.a * clr1; cx.translate(RX, 148); const k = lerp(0.85, 1, pY.sp); cx.scale(k, k); D.label(cx, cu > 0 ? `1962 → ${yr}` : "1962", 0, 0, { size: 52, col: P.warm }); cx.restore(); }
      const p64 = pop(l, T.enam); tag(cx, "64 tahun", RX, 250, p64.a * clr1, { sp: p64.sp, col: P.amber, size: 56 });
      const pH = pop(l, T.hadiah); tag(cx, "hadiah 2,56 dolar", RX, 352, pH.a * clr1, { sp: pH.sp, col: P.amber, size: 46 });
      // arti cabang
      const gS = pop(l, T.bukunya + 1.3), gD = pop(l, T.tahun + 0.5), gc = 1 - ramp(l, T.usia - 0.45, 0.35), gc2 = 1 - ramp(l, T.menemukan - 0.4, 0.3);
      const [gx1, gy1] = toS(c, 640, 668), [gx2, gy2] = toS(c, 1112, 668);
      groupTag(cx, "jilid sudah terbit", gx1, gy1, gS.a * gc, gS.sp, false); groupTag(cx, "belum ditulis", gx2, gy2, gD.a * gc2, gD.sp, true);
      // usia: 110 px di atas kacamata, sesudah "delapan puluh delapan" selesai disebut
      const p88 = pop(l, T.d88), g88 = toS(c, GLS.x - 20, GLS.y - 112); tag(cx, "usia 88 tahun", g88[0], g88[1], p88.a * clr2, { sp: p88.sp, col: P.warm, size: 50 });
      const pP = pop(l, T.pikir), gP = toS(c, 412, 800); tag(cx, "memikirkan ulang", gP[0], gP[1], pP.a * clr2, { sp: pP.sp, col: P.amber, size: 48 });
      const pC = pop(l, T.cepat), gC = toS(c, 560, 700); tag(cx, "tidak harus cepat", gC[0], gC[1], pC.a, { sp: pC.sp, col: P.teal, size: 48 });
      const pA = pop(l, T.henti), gA = toS(c, 1500, 150); tag(cx, "asal tidak berhenti", gA[0], gA[1], pA.a, { sp: pA.sp, col: P.amber, size: 48 });
    });
  }

  // =====================================================================
  // b9_3: kartu catatan naskah di kanan (x 1000–1820, y 250–750); pohon, 4C dan pensilnya tetap terlihat di kiri dan atas
  function T93(b) { return { catatan: D.at(b, "Sebagai"), catW: D.at(b, "catatan,"), naskah: D.at(b, "naskah"), disusun: D.at(b, "disusun"), ai: D.at(b, "AI,"), termasuk: D.at(b, "termasuk"), claude: D.at(b, "Claude"),
    lalu: D.at(b, "lalu"), periksa: D.at(b, "diperiksa"), sunting: D.at(b, "disunting"), manusia: D.at(b, "manusia."), end: D.speechEnd(b) }; }
  const CARD = { x: 1000, y: 250, w: 820, h: 500 };
  const ROWS = [150, 342, 442];          // pusat baris (lokal kartu): disusun · diperiksa · disunting
  const BIP3 = { x: 1720, y: 846, s: 140 };
  function bgTree(ctx, t, TL, x, dimA, txtMin) {
    // dunia + pohon pada keadaan akhir b9_2 (waktu x sejak awal b9_2), dengan pensil yang terus menulis di 4C
    setLayout(1);
    const b2 = beatOf(TL, "b9_2"), T = T92(b2), st = treeState(T, x); st.sent = 12; st.ring *= 1 - ramp(x - b2.dur, 0.3, 1.2);
    const c = drift(camTree(x), t);
    TXTA = txtMin == null ? 1 - clamp(dimA / 0.25) : 1;
    ctx.save(); camT(ctx, c);
    world(ctx, t, { away: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], paper: { a: 1 }, cal: 0,
      extraDesk: cx => { openBook(cx, t, 1); KY.hp(cx, PHONE.x, PHONE.y, PHONE.h, { t, lit: 1, glow: 0.45, glowCol: "#A9D4FF", screen: (c2, w, h, tt) => homeScreen(c2, w, h, tt, 12) }); },
      tree: cx => { drawTree(cx, t, st); opinionAt(T, x, cx, t); },
      front: cx => snail(cx, snailX(T, x), 884, t, 1) });
    ctx.restore();
    if (dimA > 0.01) {
      // redup, tetapi 4C dan pensilnya tetap terang (pensil terus menulis)
      ctx.fillStyle = `rgba(8,12,40,${dimA})`; ctx.fillRect(0, 0, W, HH);
      const [qx, qy] = toS(c, TIPS[5][0] + 20, TIPS[5][1] + 20); addLight(ctx, qx, qy, 170, P.warm, 0.45 * dimA / 0.4);
    }
    return c;
  }
  // slot baris: samar sejak awal (ikon besar ± 90 px), menyala saat kata kerjanya diucapkan
  function cardRow(ctx, y, icon, s, on, opt = {}) {
    const k = clamp(spring(on * 0.9, 10, 0.55)), a0 = 0.32;
    ctx.save();
    ctx.fillStyle = on > 0.01 ? D.hexA(opt.icol, 0.08 + 0.1 * on) : "rgba(40,48,110,0.06)"; RR(ctx, 24, y - 50, CARD.w - 48, 100, 22); ctx.fill();
    ctx.save(); ctx.translate(76, y); const sc = lerp(1, 1.12, Math.sin(clamp(on) * Math.PI)); ctx.scale(sc, sc);
    ctx.fillStyle = on > 0.01 ? opt.icol : "rgba(40,48,110,0.18)"; ctx.globalAlpha *= on > 0.01 ? lerp(a0, 1, k) : 1; ctx.beginPath(); ctx.arc(0, 0, 45, 0, TAU); ctx.fill();
    if (icon === "ai") ico(ctx, "ai", 0, 0, 62); else ico(ctx, icon, 0, 0, 54, "#FFFFFF");
    ctx.restore();
    if (on <= 0.01) { ctx.fillStyle = "rgba(40,48,110,0.12)"; RR(ctx, 140, y - 12, [430, 300, 470][opt.i], 24, 12); ctx.fill(); }
    else { ctx.globalAlpha *= clamp(on * 3); txt(ctx, s, 140 + (1 - k) * 16, y + 16, 46, { weight: 800, color: "#1E2766" }); }
    ctx.restore();
  }
  // rentang x (lokal kartu) kata "manusia" dan ujung kata "diperiksa fakta"
  let ULX = null;
  function textX(ctx) { if (ULX) return ULX; ctx.save(); ctx.font = `800 46px ${FONT}`; const a = ctx.measureText("disunting oleh ").width, b = ctx.measureText("disunting oleh manusia").width, f = ctx.measureText("diperiksa fakta").width; ctx.restore(); ULX = { u0: 140 + a, u1: 140 + b, fx: 140 + f + 56 }; return ULX; }
  function scriptCard(ctx, t, T, l, a, rect) {
    if (a <= 0.01) return; const { x, y, w } = rect || CARD, sc = w / CARD.w;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
    const W2 = CARD.w, H2 = CARD.h;
    ctx.fillStyle = "rgba(4,6,24,0.45)"; RR(ctx, 14, 20, W2, H2, 30); ctx.fill();
    ctx.fillStyle = "#FBF7EC"; RR(ctx, 0, 0, W2, H2, 30); ctx.fill();
    ctx.fillStyle = "#E9E0CC"; RR(ctx, 0, 0, W2, 96, 30); ctx.fill(); ctx.fillRect(0, 66, W2, 30);
    // penjepit kertas
    ctx.fillStyle = "#9AA2C8"; RR(ctx, W2 / 2 - 90, -26, 180, 52, 14); ctx.fill(); ctx.fillStyle = "#6E7596"; RR(ctx, W2 / 2 - 50, -14, 100, 18, 8); ctx.fill();
    if (sc * 44 >= 40) {
      const X = textX(ctx);
      // kepala: "Catatan:" saat "catatan", lalu "naskah video ini" diketik saat "naskah"
      const ca = ramp(l, T.catW - 0.1, 0.3); if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; txt(ctx, "Catatan:", 40, 66, 50, { weight: 900, color: "#B4621C" }); ctx.restore(); }
      ctx.font = `900 50px ${FONT}`; const hx = 40 + ctx.measureText("Catatan: ").width;
      const hu = clamp((l - T.naskah + 0.05) / 0.75), s0 = "naskah video ini"; if (hu > 0) txt(ctx, s0.slice(0, Math.ceil(s0.length * hu)), hx, 66, 50, { weight: 900, color: "#1E2766" });
      cardRow(ctx, ROWS[0], "ai", "disusun dengan bantuan AI", ramp(l, T.disusun - 0.05, 0.4), { icol: "#3A4FB0", i: 0 });
      // "termasuk Claude (Anthropic)" (pil di bawah baris pertama)
      const pc = ramp(l, T.claude - 0.1, 0.35); if (pc > 0) { ctx.save(); ctx.globalAlpha *= pc; const k = clamp(spring(pc * 0.9, 10, 0.5)); ctx.translate(140, 242); ctx.scale(lerp(0.9, 1, k), lerp(0.9, 1, k));
        ctx.font = `800 44px ${FONT}`; const pw = ctx.measureText("termasuk Claude (Anthropic)").width + 56;
        ctx.fillStyle = "rgba(63,216,200,0.18)"; RR(ctx, 0, -36, pw, 72, 36); ctx.fill(); ctx.strokeStyle = "#1FA79E"; ctx.lineWidth = 3; ctx.stroke();
        txt(ctx, "termasuk Claude (Anthropic)", 28, 16, 44, { weight: 800, color: "#14706A" }); ctx.restore(); }
      cardRow(ctx, ROWS[1], "cari", "diperiksa fakta", ramp(l, T.periksa - 0.05, 0.4), { icol: "#2FB86A", i: 1 });
      check(ctx, X.fx, ROWS[1], 60, ramp(l, T.periksa + 0.3, 0.45));
      cardRow(ctx, ROWS[2], "tulis", "disunting oleh manusia", ramp(l, T.sunting - 0.05, 0.4), { icol: "#E28A2E", i: 2 });
      // garis bawah suntingan pada "manusia"
      const ed = ramp(l, T.sunting + 0.25, 0.8); if (ed > 0) { ctx.save(); ctx.strokeStyle = "#E28A2E"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath();
        for (let q = 0; q <= 30 * ed; q++) { const xx = lerp(X.u0, X.u1, q / 30), yy = ROWS[2] + 30 + Math.sin(q * 0.9) * 3; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
      // cap centang besar (pojok kanan bawah)
      const st = ramp(l, T.manusia - 0.05, 0.45); if (st > 0) { const k = clamp(spring(st * 0.9, 9, 0.45)); ctx.save(); ctx.translate(W2 - 78, H2 - 128); ctx.rotate(-0.12); ctx.scale(lerp(1.5, 1, k), lerp(1.5, 1, k)); ctx.globalAlpha *= clamp(st * 3);
        ctx.fillStyle = "rgba(47,184,106,0.12)"; ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#2FB86A"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 51, 0, TAU); ctx.stroke(); check(ctx, 0, 4, 72, 1, "#2FB86A", 13); ctx.restore(); }
    }
    ctx.restore();
  }
  function scene93(ctx, b, l, t, TL) {
    const b2 = beatOf(TL, "b9_2"), T = T93(b), T2 = T92(b2);
    const dim = 0.4 * ramp(l, 0.1, 0.8);
    const ci = eout(ramp(l, T.catatan - 0.25, 0.8)), rect = { x: CARD.x, y: lerp(1150, CARD.y, ci), w: CARD.w, h: CARD.h };
    NOTXT = ci > 0 ? [rect.x - 20, rect.y - 40, rect.x + rect.w + 30, rect.y + rect.h + 40] : null;
    const c = bgTree(ctx, t, TL, b2.dur + l, dim, 0.15);
    // kartu naik dari bawah ke kanan
    scriptCard(ctx, t, T, l, ci > 0 ? 1 : 0, rect);
    // tangan manusia: mencentang "diperiksa fakta", lalu menggaris bawahi "manusia"
    const hu = ramp(l, T.periksa - 0.35, 0.55);
    if (hu > 0) { const X = textX(ctx), uu = ramp(l, T.sunting + 0.25, 0.8), chk = ramp(l, T.periksa + 0.3, 0.45);
      let tipX, tipY;
      if (l < T.sunting) { tipX = CARD.x + X.fx + lerp(-22, 30, chk); tipY = CARD.y + ROWS[1] + lerp(4, -24, chk) + (chk > 0.4 ? 0 : 6); }
      else { const mv = eio(ramp(l, T.sunting - 0.05, 0.3)); tipX = lerp(CARD.x + X.fx + 30, CARD.x + lerp(X.u0, X.u1, uu), mv); tipY = lerp(CARD.y + ROWS[1] - 24, CARD.y + ROWS[2] + 30 + Math.sin(l * 18) * 3, mv); }
      const away = eio(ramp(l, T.manusia + 0.4, 0.7));
      const x = lerp(1700, tipX, eio(hu)) + away * 260, y = lerp(1140, tipY, eio(hu)) + away * 380; hand(ctx, x, y, t, 0.9, 0.55); }
    // Bip: dari batang pohon berjalan ke kanan bawah kartu, menunjuk baris, melambai di akhir
    { const p0 = bip2Pos(T2, b2.dur + l), wk = eio(ramp(l, 0.3, 1.4)), bx = lerp(p0.x, BIP3.x, wk), by = lerp(BIP2.y, BIP3.y, wk), bs = lerp(BIP2.s, BIP3.s, wk); let o;
      if (l < 0.3) o = { pose: "tunjuk", t, target: [TIPS[5][0] + 20, TIPS[5][1] + 30], mood: "happy" };
      else if (wk < 1) o = { pose: "jalan", t, dir: 1, speed: 1.4 };
      else if (l < T.disusun) o = { pose: "diam", t, mood: "happy", look: [-0.6, -0.9] };
      else if (l < T.periksa - 0.3) o = { pose: "tunjuk", t, target: [CARD.x + 500, CARD.y + ROWS[0] + 60], mood: "happy" };
      else if (l < T.manusia) o = { pose: "diam", t, mood: "happy", look: [-0.7, -0.6] };
      else o = { pose: "diam", t, mood: "happy", wave: t * 1.2 };
      ctx.save(); camT(ctx, c); KB.draw(ctx, bx, by, bs, o); ctx.restore(); }
    // label akhir b9_2 memudar pelan (mesin tidak membawa label beat sebelumnya ke silang-pudar)
    const fa = 1 - ramp(l, 0, 0.5);
    if (fa > 0.01) D.post(cx => { const gC = toS(c, 560, 700), gA = toS(c, 1500, 150); tag(cx, "tidak harus cepat", gC[0], gC[1], fa, { col: P.teal, size: 48 }); tag(cx, "asal tidak berhenti", gA[0], gA[1], fa, { col: P.amber, size: 48 }); });
  }

  // =====================================================================
  // b9_4: layar akhir
  function T94(b) { return { kalau: D.at(b, "Kalau"), tek: D.at(b, "teknologi"), sub: D.at(b, "subscribe"), ch: D.at(b, "channel"), it: D.at(b, "I Teach"), sw: D.at(b, "Software"), eng: D.atEnd(b, "Engineering."),
    sampai: D.at(b, "Sampai"), ber: D.at(b, "berikutnya."), end: D.speechEnd(b) }; }
  const SUB = { x: 440, y: 286, r: 118 };
  const SLOT = { x: 1060, y: 236, w: 760, h: 428 };
  function endScreen(ctx, t, T, l) {
    const pa = clamp(spring(ramp(l, T.sub - 0.3, 1.2), 9, 0.45));
    if (pa > 0.01) {
      ctx.save(); ctx.translate(SUB.x, SUB.y); ctx.scale(pa, pa);
      D.glow(ctx, 0, 0, SUB.r * 2, P.teal, 0.3 + 0.1 * Math.sin(t * 2));
      for (let i = 0; i < 2; i++) { const ph = (t * 0.4 + i / 2) % 1; ctx.strokeStyle = D.hexA(P.teal, 0.5 * (1 - ph)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, SUB.r * (1.08 + 0.35 * ph), 0, TAU); ctx.stroke(); }
      ctx.fillStyle = "#1B2457"; ctx.beginPath(); ctx.arc(0, 0, SUB.r, 0, TAU); ctx.fill();
      // isi lingkaran: kubus kecil tiga warna (lambang film ini)
      ctx.save(); ctx.beginPath(); ctx.arc(0, 0, SUB.r * 0.92, 0, TAU); ctx.clip(); cube(ctx, t, 0, 4, 44, -0.8 + t * 0.15, { print: 0 }); ctx.restore();
      ctx.strokeStyle = P.teal; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, SUB.r, 0, TAU); ctx.stroke();
      ctx.restore();
      const burst = ramp(l, T.sub, 0.9); if (burst > 0 && burst < 1) { ctx.strokeStyle = D.hexA(P.teal, 0.9 * (1 - burst)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r * (1.05 + 0.7 * eout(burst)), 0, TAU); ctx.stroke(); }
      // lonceng
      const ring = ramp(l, T.sub - 0.05, 0.1) * (1 - ramp(l, T.sub + 1.4, 0.4)), sw = Math.sin(t * 16) * 0.4 * ring;
      const bx = SUB.x + SUB.r * 0.74, byy = SUB.y + SUB.r * 0.74, br = 38 * pa;
      ctx.save(); ctx.translate(bx, byy); ctx.fillStyle = "#E5484D"; ctx.beginPath(); ctx.arc(0, 0, br, 0, TAU); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke();
      ctx.rotate(sw); ctx.scale(br / 38, br / 38); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-15, 10); ctx.quadraticCurveTo(-13, -17, 0, -17); ctx.quadraticCurveTo(13, -17, 15, 10); ctx.closePath(); ctx.fill();
      ctx.fillRect(-19, 8, 38, 6); ctx.beginPath(); ctx.arc(0, 18, 5, 0, TAU); ctx.fill(); ctx.restore();
    }
    // nama kanal (kata muncul saat diucapkan) + alamat
    const ba = eout(ramp(l, T.it - 0.1, 0.4));
    if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba; ctx.fillStyle = "rgba(12,18,56,0.94)"; RR(ctx, SUB.x - 320, SUB.y + SUB.r + 22, 640, 154, 34); ctx.fill(); ctx.restore(); }
    [["I Teach", T.it, 56, P.warm], ["Software Engineering", T.sw, 52, "#FFFFFF"]].forEach(([s, t0, sz, col], i) => { const u = eout(ramp(l, t0 - 0.05, 0.4)); if (u <= 0) return;
      ctx.save(); ctx.globalAlpha *= u; txt(ctx, s, SUB.x, SUB.y + SUB.r + 76 + i * 66 + (1 - u) * 14, sz, { align: "center", weight: 900, color: col }); ctx.restore(); });
    const pu = pop(l, T.eng + 0.1); tag(ctx, "youtube.com/@iTeachSWE", SUB.x, SUB.y + SUB.r + 250, pu.a, { sp: pu.sp, col: P.teal, size: 46 });
    // tempat video berikutnya
    const va = eout(ramp(l, T.sampai - 0.2, 0.7));
    if (va > 0) {
      const { x, y, w, h } = SLOT, dy = (1 - va) * 40;
      ctx.save(); ctx.globalAlpha *= va; ctx.translate(0, dy);
      D.label(ctx, "Cerita berikutnya", x + w / 2, y - 62, { size: 48, col: P.amber });
      D.glow(ctx, x + w / 2, y + h / 2, w * 0.7, P.violet, 0.3);
      ctx.save(); RR(ctx, x, y, w, h, 26); ctx.clip();
      const gr = ctx.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, "#26336E"); gr.addColorStop(1, "#3B2E78"); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
      // rak buku samar di dalam tempat video
      for (let i = 0; i < 9; i++) { ctx.fillStyle = D.hexA(["#E8665F", "#36B3A3", "#6A7BE0", "#E9A23B", "#9A6FD6"][i % 5], 0.22); RR(ctx, x + 70 + i * 72, y + h - 70 - 150 - (i % 3) * 8, 56, 150 + (i % 3) * 8, 6); ctx.fill(); }
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(x + 50, y + h - 70, w - 100, 10);
      const sx = ((t * 0.25) % 1.6 - 0.3) * w; const sg = ctx.createLinearGradient(x + sx - 120, 0, x + sx + 120, 0); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,0.12)"); sg.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
      ctx.restore();
      ctx.strokeStyle = D.hexA("#FFFFFF", 0.75); ctx.lineWidth = 5; ctx.setLineDash([22, 14]); ctx.lineDashOffset = -t * 20; RR(ctx, x, y, w, h, 26); ctx.stroke(); ctx.setLineDash([]);
      const pr2 = 1 + 0.06 * Math.sin(t * 3); ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(pr2, pr2);
      ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fill(); ctx.fillStyle = "#E5484D"; ctx.beginPath(); ctx.moveTo(-18, -28); ctx.lineTo(30, 0); ctx.lineTo(-18, 28); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.restore();
    }
  }
  // ikon aplikasi naik dari daun pohon saat "teknologi"
  function risingIcons(ctx, t, T, l, c) {
    const a = eio(ramp(l, T.tek - 0.3, 0.6)) * (1 - ramp(l, T.sub - 0.6, 0.8)); if (a <= 0.01) return;
    LEAVES.forEach((L, i) => { const [wx, wy] = leafPos(L), [sx, sy] = toS(c, wx, wy), sp = 0.05 + (i % 4) * 0.012, u = ((l - T.tek) * sp + i * 0.083) % 1;
      if (l < T.tek - 0.3) return; const pp = clamp(spring(ramp(l, T.tek - 0.2 + i * 0.08, 1), 9, 0.45)); if (pp <= 0.01) return;
      const x = sx + Math.sin(t * 0.8 + i) * 22, y = sy - u * 420; if (x > 760 && x < 1020 && y > 560) return;
      ctx.save(); ctx.globalAlpha *= a * Math.min(1, Math.sin(u * Math.PI) * 2.2); leaf(ctx, x, y, L, pp * 0.9, t, 1); ctx.restore(); });
  }
  function scene94(ctx, b, l, t, TL) {
    const b2 = beatOf(TL, "b9_2"), b3 = beatOf(TL, "b9_3"), T = T94(b), T3 = T93(b3);
    const x = b2.dur + b3.dur + l; NOTXT = null;
    const dim = 0.4 * (1 - ramp(l, 0.4, 1.4)) + 0.2 * ramp(l, 0.4, 1.4);
    const c = bgTree(ctx, t, TL, x, dim);
    // kerudung atas supaya layar akhir terbaca
    const sc = eio(ramp(l, 0.6, 1.6)); const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, `rgba(12,18,58,${0.35 * sc})`); gr.addColorStop(0.62, `rgba(12,18,58,${0.15 * sc})`); gr.addColorStop(0.85, "rgba(12,18,58,0)");
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    // kartu naskah turun ke tumpukan naskah (diarsipkan)
    const out = eio(ramp(l, 0.15, 1.1));
    if (out < 1) { const [sx, sy] = toS(c, 210, 760); const sh = eout(ramp(l, 0.15, 0.55)), w2 = lerp(CARD.w, 180, sh), cx0 = lerp(CARD.x + CARD.w / 2, sx, out), cy0 = lerp(CARD.y + CARD.h / 2, sy, out) - Math.sin(out * Math.PI) * 120; const r = { x: cx0 - w2 / 2, y: cy0 - w2 * CARD.h / CARD.w / 2, w: w2 }; r.h = r.w * CARD.h / CARD.w;
      scriptCard(ctx, t, T3, b3.dur + l, 1 - ramp(out, 0.85, 0.15), r); }
    risingIcons(ctx, t, T, l, c);
    D.post(cx => {
      endScreen(cx, t, T, l);
      // Bip: masuk, menunjuk lingkaran saat "subscribe", melambai saat "sampai jumpa", lalu bergantian menunjuk video dan melambai
      const wk = ramp(l, 0.2, 2.2), bs = lerp(BIP3.s * c.z, 196, wk), bx = lerp(toS(c, BIP3.x, BIP3.y)[0], 880, wk), by = lerp(toS(c, BIP3.x, BIP3.y)[1], 800, wk) + Math.sin(t * 2) * 2 * wk;
      let o;
      if (l < 0.2) o = { pose: "diam", t, mood: "happy", look: [-0.9, 0.1] };
      else if (wk < 1) o = { pose: "jalan", t, dir: -1, speed: 1.1 };
      else if (l < T.sub - 0.25) o = { pose: "diam", t, mood: "happy", look: [-0.3, -0.4] };
      else if (l < T.sampai) o = { pose: "tunjuk", t, target: [SUB.x + SUB.r * 0.8, SUB.y + SUB.r * 0.5], mood: l < T.sub + 0.3 ? "wow" : "happy" };
      else if (l < T.ber + 0.6) o = { pose: "diam", t, wave: t * 1.2, mood: "happy" };
      else { const cyc = (l - T.ber) % 6; o = cyc < 3 ? { pose: "tunjuk", t, target: [SLOT.x + 40, SLOT.y + SLOT.h * 0.5], mood: "happy" } : { pose: "diam", t, wave: cyc < 4.6 ? t * 1.2 : undefined, mood: "happy" }; }
      KB.draw(cx, bx, by, bs, Object.assign({ seed: 4 }, o));
    });
  }

  // ---------- pemilih adegan ----------
  K.SCENES = K.SCENES || {};
  K.SCENES.d04_b9 = function (ctx, b, l, t, TL) {
    if (b.id === "b9_1") return scene91(ctx, b, l, t, TL);
    if (b.id === "b9_2") return scene92(ctx, b, l, t, TL);
    if (b.id === "b9_3") return scene93(ctx, b, l, t, TL);
    if (b.id === "b9_4") return scene94(ctx, b, l, t, TL);
    D.bg(ctx, t);
  };
  K.SCENES.d04_b9.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b9 = TL => [
    K.sfxAt(TL, "b9_1", null, 0.6, "whoosh", 0.4),               // meja ditata ulang: kartu kutipan dilipat dan terbang ke tumpukan
    K.sfxAt(TL, "b9_1", "usang", 0.0, "pop", 0.45),             // debu + "usang?"
    K.sfxAt(TL, "b9_1", "tidak.", -0.05, "clack", 0.6),          // "usang?" dicoret, "Tidak."
    K.sfxAt(TL, "b9_1", "tidak.", 0.35, "whoosh", 0.55),         // kubus menjadi halaman
    K.sfxAt(TL, "b9_1", "mencari,", -0.05, "pop", 0.4),          // lensa menyusuri kubus
    K.sfxAt(TL, "b9_1", "menulis", 0.05, "shimmer", 0.45),       // cahaya menulis baris bukti
    K.sfxAt(TL, "b9_1", "Tetapi", 0.0, "whoosh", 0.45),          // tangan + pensil masuk
    K.sfxAt(TL, "b9_1", "mengajukan", 0.0, "pop", 0.45),         // "?" ditulis
    K.sfxAt(TL, "b9_1", "menguji,", 0.05, "pop", 0.4),           // 3 ✓ 5 ✓ 7 ✓
    K.sfxAt(TL, "b9_1", "benar.", -0.05, "shimmer", 0.55),       // centang besar
    K.sfxAt(TL, "b9_2", "bukunya", 0.35, "whoosh", 0.5),         // buku terbang dari rak ke pohon
    K.sfxAt(TL, "b9_2", "enam", 0.0, "pop", 0.45),               // "64 tahun"
    K.sfxAt(TL, "b9_2", "hadiah", 0.0, "pop", 0.45),             // sertifikat hadiah
    K.sfxAt(TL, "b9_2", "kesalahannya,", -0.05, "clack", 0.5),   // salah ketik dilingkari di kotak perbesaran
    K.sfxAt(TL, "b9_2", "dan di usia", -0.16, "whoosh", 0.35),    // sertifikat terbang ke Bip (7,6 s)
    K.sfxAt(TL, "b9_2", "puluh delapan", 0.0, "pop", 0.4),        // "usia 88 tahun"
    K.sfxAt(TL, "b9_2", "memikirkan", 0.05, "whoosh", 0.45),     // kartu pendapat berbalik
    K.sfxAt(TL, "b9_2", "tidak harus", 0.0, "pop", 0.35),
    K.sfxAt(TL, "b9_2", "tidak berhenti.", 0.0, "shimmer", 0.5),
    K.sfxAt(TL, "b9_3", "Sebagai", -0.2, "whoosh", 0.45),        // kartu naskah naik
    K.sfxAt(TL, "b9_3", "disusun", 0.0, "pop", 0.35),            // baris pertama menyala
    K.sfxAt(TL, "b9_3", "Claude", -0.05, "pop", 0.4),
    K.sfxAt(TL, "b9_3", "diperiksa", 0.3, "clack", 0.45),        // centang
    K.sfxAt(TL, "b9_3", "manusia.", 0.0, "shimmer", 0.5),        // cap centang
    K.sfxAt(TL, "b9_4", null, 0.3, "whoosh", 0.4),               // kartu masuk ke tumpukan
    K.sfxAt(TL, "b9_4", "teknologi", 0.0, "shimmer", 0.4),
    K.sfxAt(TL, "b9_4", "subscribe", 0.0, "pop", 0.65),
    K.sfxAt(TL, "b9_4", "Sampai", -0.1, "whoosh", 0.4),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
