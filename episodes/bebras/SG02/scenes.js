/* SG02 Pembahasan Soal Bebras 2025-HR-01 "Perlombaan Lari Berang-berang" (Kroasia), kategori Siaga (kelas 4–6 SD).
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01–B02) + simulasi lintasan lari:
   garis finis di KIRI (depan), nomor posisi 1–5 tetap di tempatnya, berang-berang yang maju melompati teman di depannya
   satu per satu, teman yang disalip bergeser satu posisi ke kanan (belakang). Urutan dicatat setelah setiap perubahan.
   Topi (warna topi ≠ warna simbol, sama dengan soal):
     M topi merah + segitiga ungu, B topi biru + lingkaran kuning, H topi hijau + hati merah,
     K topi kuning + persegi panjang hijau, U topi ungu + persegi biru.
   Urutan: awal M B H K U → (persegi biru = U maju 2) M B U H K → (persegi panjang hijau = K maju 1) M B U K H
           → (hati merah = H maju 2) M B H U K = pilihan C.  A = setelah perubahan 1, B = setelah perubahan 2, D = urutan awal.
   Papan: x 52–1868, y 130–830 (kartu narasi mulai y≈841). Waktu kejadian diambil dari posisi kata di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp, wrap } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", GRAYT = "#8A96A0",
        FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Perlombaan Lari Berang-berang", asli: "", tahun: "2025", negara: "Kroasia", kode: "2025-HR-01" };

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => {
    const T = TXT(b), i = T.indexOf(s);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); }
    return lead(b) + Math.max(0, i) / T.length * (b.audio || b.dur);
  };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));
  const pulse = (l, t0, d = 1.2) => clamp(1 - Math.abs(l - t0 - d / 2) / (d / 2), 0, 1);

  // ---------- papan dan spidol (sama dengan B01) ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.03)"; rr(ctx, 52, 130, 1816, 18, 8); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
  function mline(ctx, pts, u, color, w, head) {
    if (u <= 0) return;
    const L = plen(pts) * clamp(u, 0, 1); let s = 0;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let end = pts[0], prev = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + d >= L) { const k = d ? (L - s) / d : 0; end = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; prev = pts[i - 1]; ctx.lineTo(end[0], end[1]); break; }
      ctx.lineTo(pts[i][0], pts[i][1]); s += d; end = pts[i]; prev = pts[i - 1];
    }
    ctx.stroke();
    if (head && u >= 0.98) {
      const a = Math.atan2(end[1] - prev[1], end[0] - prev[0]), hs = w * 3.2;
      ctx.beginPath(); ctx.moveTo(end[0] - hs * Math.cos(a - 0.5), end[1] - hs * Math.sin(a - 0.5)); ctx.lineTo(end[0], end[1]);
      ctx.lineTo(end[0] - hs * Math.cos(a + 0.5), end[1] - hs * Math.sin(a + 0.5)); ctx.stroke();
    }
    ctx.restore();
  }
  function tick(ctx, x, y, s, u = 1, color = GREEN, w) {
    mline(ctx, [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.33], [x + s * 0.48, y - s * 0.38]], u, color, w || Math.max(4, s * 0.16));
  }
  function cross(ctx, x, y, s, u = 1, color = RED, w) {
    const lw = w || Math.max(4, s * 0.16);
    mline(ctx, [[x - s * 0.36, y - s * 0.36], [x + s * 0.36, y + s * 0.36]], u * 2, color, lw);
    mline(ctx, [[x + s * 0.36, y - s * 0.36], [x - s * 0.36, y + s * 0.36]], u * 2 - 1, color, lw);
  }
  function ring(ctx, x, y, rx, ry, u, color = ORANGE, w = 6) {
    if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.08, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.15 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
  }
  function hand(ctx, s, x, y, size, opt = {}) {
    ctx.save(); ctx.font = `italic 800 ${size}px ${K.FONT}`; ctx.fillStyle = opt.color || ORANGE; ctx.textAlign = opt.align || "center";
    ctx.textBaseline = "alphabetic"; if (opt.alpha != null) ctx.globalAlpha *= opt.alpha; ctx.fillText(s, x, y); ctx.restore();
  }

  // ---------- topi dan simbol ----------
  // warna topi dan warna simbol sengaja berbeda (sama dengan soal); nama dipakai di narasi dan di layar
  const HAT = {
    M: { c: "#E2392F", d: "#A3231C", nama: "merah", sym: "tri", sc: "#7B3FC8", snama: "segitiga ungu" },
    B: { c: "#2E7FD6", d: "#1D5A9E", nama: "biru", sym: "circle", sc: "#FFE03A", snama: "lingkaran kuning" },
    H: { c: "#3DAA5C", d: "#277A3F", nama: "hijau", sym: "heart", sc: "#E2392F", snama: "hati merah" },
    K: { c: "#F7C81E", d: "#C49A08", nama: "kuning", sym: "rect", sc: "#23913F", snama: "persegi panjang hijau" },
    U: { c: "#B455DB", d: "#7E2EA3", nama: "ungu", sym: "square", sc: "#5CCBF5", snama: "persegi biru" },
  };
  const START = ["M", "B", "H", "K", "U"];
  const ORD = [START, ["M", "B", "U", "H", "K"], ["M", "B", "U", "K", "H"], ["M", "B", "H", "U", "K"]];
  const OPTS = { A: ORD[1], B: ORD[2], C: ORD[3], D: START };
  const STEPS = [{ who: "U", n: 2 }, { who: "K", n: 1 }, { who: "H", n: 2 }];

  // simbol saja, berpusat di (x, y), ukuran s (sisi terpanjang); garis tepi gelap + halo putih supaya jelas di atas topi
  function symbol(ctx, sym, x, y, s, fill, opt = {}) {
    ctx.save(); ctx.translate(x, y);
    const path = () => {
      ctx.beginPath();
      if (sym === "tri") { ctx.moveTo(0, -s * 0.5); ctx.lineTo(s * 0.52, s * 0.42); ctx.lineTo(-s * 0.52, s * 0.42); ctx.closePath(); }
      else if (sym === "circle") ctx.arc(0, 0, s * 0.46, 0, Math.PI * 2);
      else if (sym === "square") ctx.rect(-s * 0.4, -s * 0.4, s * 0.8, s * 0.8);
      else if (sym === "rect") ctx.rect(-s * 0.5, -s * 0.27, s, s * 0.54);
      else if (sym === "heart") {
        const k = s / 100; ctx.moveTo(0, 40 * k);
        ctx.bezierCurveTo(-60 * k, -2 * k, -48 * k, -50 * k, 0, -24 * k); ctx.bezierCurveTo(48 * k, -50 * k, 60 * k, -2 * k, 0, 40 * k); ctx.closePath();
      }
    };
    const lw = Math.max(2, s * 0.07);
    if (opt.halo !== false) { path(); ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = lw * 3; ctx.lineJoin = "round"; ctx.stroke(); }
    path(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = "#1B2733"; ctx.lineWidth = lw; ctx.lineJoin = "round"; ctx.stroke();
    ctx.restore();
  }
  // topi pet (dilihat dari depan, pet menghadap ke kiri = arah lari); x,y = tengah bawah kubah; w = lebar kubah
  function cap(ctx, id, x, y, w, opt = {}) {
    const h = HAT[id], k = w / 100;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    ctx.lineJoin = "round"; ctx.strokeStyle = "#1B2733"; ctx.lineWidth = 3.2;
    // pet
    ctx.fillStyle = h.d; ctx.beginPath(); ctx.ellipse(-46, 2, 34, 10, -0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // kubah
    ctx.fillStyle = h.c; ctx.beginPath(); ctx.moveTo(-50, 4); ctx.bezierCurveTo(-50, -66, 50, -66, 50, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = h.d; rr(ctx, -51, -4, 102, 10, 5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -49, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    symbol(ctx, h.sym, x + 2 * k, y - 25 * k, (h.sym === "rect" ? 46 : 38) * k, h.sc);
  }

  // berang-berang (sama dengan B01) dengan topi; x,y = pusat, s = tinggi
  function beaver(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(32, 36, 12, 22, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();      // ekor
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = FUR2; ctx.beginPath(); ctx.ellipse(0, 30, 19, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -21, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -22.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    if (o.hat) cap(ctx, o.hat, x, y - s * 0.33, s * 0.86, { alpha: o.alpha });
  }

  // ---------- lintasan lari ----------
  // geo: {x: [5 pusat slot], y: pusat berang-berang, s: tinggi, finish: x garis finis, numY: y nomor posisi}
  const G_MAIN = { x: [300, 500, 700, 900, 1100], y: 350, s: 150, finish: 150, ground: 445, numY: 492, top: 150, right: 1250, lblLow: true };
  // posisi pecahan tiap berang-berang + lompatan, dari daftar peristiwa tukar
  // swaps: [{t, i}] = tukar slot i-1 dan i (yang di slot i maju), mulai detik t, lama D
  const SW_D = 1.0;
  function layout(order, swaps, l) {
    const pos = {}, hop = {}; order.forEach((w, i) => { pos[w] = i; hop[w] = 0; });
    let cur = order.slice();
    for (const sw of swaps) {
      const p = clamp((l - sw.t) / SW_D, 0, 1), e = ease(p);
      const a = cur[sw.i], bk = cur[sw.i - 1];   // a maju (ke kiri), bk disalip (ke kanan)
      if (p <= 0) break;
      pos[a] = sw.i - e; pos[bk] = sw.i - 1 + e; hop[a] = Math.sin(Math.PI * p);
      if (p >= 1) { cur[sw.i] = bk; cur[sw.i - 1] = a; pos[a] = sw.i - 1; pos[bk] = sw.i; hop[a] = 0; }
      else break;
    }
    return { pos, hop, cur };
  }
  function slotX(g, f) { const i = Math.floor(clamp(f, 0, 3.999)), k = f - i; return lerp(g.x[i], g.x[Math.min(4, i + 1)], k); }
  function finishFlag(ctx, x, top, bottom) {
    ctx.save();
    for (let yy = top; yy < bottom; yy += 18) for (let c = 0; c < 2; c++) {
      ctx.fillStyle = ((yy - top) / 18 + c) % 2 ? "#1B2733" : "#FFFFFF"; ctx.fillRect(x - 18 + c * 18, yy, 18, Math.min(18, bottom - yy));
    }
    ctx.strokeStyle = "#1B2733"; ctx.lineWidth = 2; ctx.strokeRect(x - 18, top, 36, bottom - top);
    ctx.restore();
  }
  // opt: order, swaps, l, hats (true = bertopi), nums (0..1), labels (0..1 DEPAN/BELAKANG), arrow (0..1),
  //      glow {id: u}, dim {id: u}, numPulse, plainHi (id tanpa topi yang disorot)
  function track(ctx, g, opt) {
    const l = opt.l || 0;
    // tanah dan garis finis
    ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(g.finish - 30, g.ground); ctx.lineTo(g.right + 30, g.ground); ctx.stroke();
    finishFlag(ctx, g.finish, g.top + 60, g.ground);
    const lu = opt.labels ?? 1;
    if (lu > 0) {
      ctx.save(); ctx.globalAlpha *= lu;
      if (g.lblLow) { hand(ctx, "DEPAN", g.finish, g.numY + 12, 30, { color: GREEN }); hand(ctx, "BELAKANG", g.x[4] + 50, g.numY + 12, 30, { color: GRAYT, align: "left" }); }
      else { hand(ctx, "DEPAN", g.finish + 34, g.top + 42, 34, { color: GREEN, align: "left" }); hand(ctx, "BELAKANG", g.right, g.top + 42, 34, { color: GRAYT, align: "right" }); }
      ctx.restore();
    }
    const au = opt.arrow ?? 0;
    if (au > 0) { mline(ctx, [[g.x[3] + 20, g.top + 30], [g.x[1] - 20, g.top + 30]], au, ORANGE, 7, true); hand(ctx, "arah lari", (g.x[1] + g.x[3]) / 2, g.top + 20, 28, { alpha: au }); }
    // nomor posisi (tetap di tempatnya)
    const nu = opt.nums ?? 1;
    if (nu > 0) g.x.forEach((x, i) => {
      const ps = opt.numPulse ? 1 + 0.15 * opt.numPulse * Math.max(0, Math.sin(l * 7)) : 1, hi = opt.numHi && opt.numHi[i + 1] || 0;
      ctx.save(); ctx.globalAlpha *= nu;
      ctx.fillStyle = hi > 0 ? "#FFF1DF" : "#F3F6F8"; ctx.strokeStyle = hi > 0 ? ORANGE : "#9AA6AE"; ctx.lineWidth = hi > 0 ? 5 : 3;
      ctx.beginPath(); ctx.arc(x, g.numY, 25 * ps, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      text(ctx, String(i + 1), x, g.numY + 11 * ps, 32 * ps, { align: "center", weight: 900, color: INK });
      ctx.restore();
    });
    // berang-berang: yang melompat digambar terakhir
    const { pos, hop } = layout(opt.order, opt.swaps || [], l);
    const ids = opt.order.slice().sort((a, b) => hop[a] - hop[b]);
    for (const w of ids) {
      const x = slotX(g, pos[w]), y = g.y - hop[w] * g.s * 0.55, gl = opt.glow && opt.glow[w] || 0, dm = opt.dim && opt.dim[w] || 0;
      ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(x, g.ground - 6, g.s * 0.34, g.s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
      if (gl > 0) { ctx.fillStyle = `rgba(238,122,18,${0.22 * gl})`; ctx.beginPath(); ctx.ellipse(x, y - g.s * 0.12, g.s * 0.52, g.s * 0.66, 0, 0, Math.PI * 2); ctx.fill(); }
      beaver(ctx, x, y, g.s, { hat: opt.hats === false ? null : w, alpha: 1 - 0.6 * dm });
    }
    return { pos, hop };
  }
  const capPos = (g, f, hopv = 0) => [slotX(g, f), g.y - hopv * g.s * 0.55 - g.s * 0.33 - g.s * 0.86 * 0.25];

  // deretan topi kecil (catatan urutan, pilihan jawaban)
  function capRow(ctx, order, x, y, w, gap, opt = {}) {
    order.forEach((id, i) => {
      const cx = x + i * gap, hi = opt.hi && opt.hi[id] || 0;
      if (hi > 0) { ctx.fillStyle = `rgba(238,122,18,${0.25 * hi})`; rr(ctx, cx - w * 0.62, y - w * 0.62, w * 1.24, w * 0.86, 10); ctx.fill(); }
      cap(ctx, id, cx, y, w, { alpha: opt.alpha });
      if (opt.nums) text(ctx, String(i + 1), cx, y + w * 0.42, Math.max(16, w * 0.26), { align: "center", weight: 800, color: GRAYT });
    });
  }

  // ---------- kartu kanan: perubahan + tabel simbol ----------
  function stepsCard(ctx, x, y, w, st) {   // st: {cur (0..2 | -1), done: n, u, map: {i: u}, think}
    card(ctx, x, y, w, 250, { fill: "#FFFFFF", stroke: "#B8C3CA", lw: 3, r: 18 });
    text(ctx, "TIGA PERUBAHAN", x + w / 2, y + 38, 24, { align: "center", weight: 900, color: C.accentDark });
    STEPS.forEach((s, i) => {
      const ry = y + 62 + i * 62, cur = st.cur === i, done = i < (st.done || 0);
      if (cur) { ctx.fillStyle = "#FFF1DF"; rr(ctx, x + 10, ry, w - 20, 56, 12); ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; rr(ctx, x + 10, ry, w - 20, 56, 12); ctx.stroke(); }
      ctx.save(); if (!cur && !done && st.cur != null && st.cur >= 0) ctx.globalAlpha *= 0.55;
      ctx.fillStyle = done ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(x + 42, ry + 28, 19, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), x + 42, ry + 37, 24, { align: "center", color: "#fff", weight: 900 });
      const h = HAT[s.who];
      symbol(ctx, h.sym, x + 98, ry + 28, h.sym === "rect" ? 48 : 40, h.sc);
      text(ctx, `maju ${s.n}`, x + 140, ry + 39, 30, { weight: 900, color: INK });
      const mu = st.map && st.map[i] != null ? st.map[i] : (done ? 1 : 0);
      if (mu > 0) { ctx.save(); ctx.globalAlpha *= mu; text(ctx, "=", x + 278, ry + 39, 30, { weight: 900, color: GRAYT }); cap(ctx, s.who, x + 345, ry + 44, 66); text(ctx, "topi " + h.nama, x + 395, ry + 39, 22, { weight: 800, color: INK }); ctx.restore(); }
      ctx.restore();
    });
  }
  function symTable(ctx, x, y, w, st) {   // st: {hi: id}; lima kolom: simbol di atas, topinya di bawah
    card(ctx, x, y, w, 150, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "TABEL SIMBOL", x + w / 2, y + 28, 20, { align: "center", weight: 900, color: C.ink2 });
    START.forEach((id, i) => {
      const cx = x + 56 + i * ((w - 112) / 4), h = HAT[id], hi = st.hi === id;
      if (hi) { ctx.fillStyle = "rgba(238,122,18,0.22)"; rr(ctx, cx - 46, y + 38, 92, 106, 12); ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; rr(ctx, cx - 46, y + 38, 92, 106, 12); ctx.stroke(); }
      symbol(ctx, h.sym, cx, y + 64, h.sym === "rect" ? 42 : 34, h.sc);
      mline(ctx, [[cx, y + 84], [cx, y + 98]], 1, GRAYT, 3, true);
      cap(ctx, id, cx, y + 138, 64);
    });
  }
  function thinkBadge(ctx, x, y, w, hgt, l, d) {
    card(ctx, x, y, w, hgt, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    const small = hgt < 200;
    text(ctx, "PIKIRKAN DULU", small ? x + 40 : x + w / 2, small ? y + hgt / 2 + 11 : y + 44, 30, { align: small ? "left" : "center", weight: 900, color: C.accentDark });
    const frac = clamp(l / d, 0, 1), cx = small ? x + w - 90 : x + w / 2, cy = small ? y + hgt / 2 : y + hgt / 2 + 24, r = small ? 52 : Math.min(62, hgt * 0.3);
    ctx.strokeStyle = "#E9DDBF"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.scale(r / 70, r / 70); ctx.fillStyle = "#F4D58D"; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-26, -38); ctx.lineTo(26, -38); ctx.lineTo(4, 0); ctx.lineTo(26, 38); ctx.lineTo(-26, 38); ctx.lineTo(-4, 0); ctx.closePath(); ctx.stroke();
    const top = 1 - frac; ctx.beginPath(); ctx.moveTo(-22 * top, -34 + 30 * (1 - top)); ctx.lineTo(22 * top, -34 + 30 * (1 - top)); ctx.lineTo(0, -2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-22 * frac - 2, 36); ctx.lineTo(22 * frac + 2, 36); ctx.lineTo(0, 36 - 30 * frac); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // ---------- catatan urutan (bawah papan) ----------
  const NOTE_T = ["Setelah 1 menit", "Setelah perubahan 1", "Setelah perubahan 2", "Setelah perubahan 3"];
  function notes(ctx, st) {   // st: {u: [4 nilai 0..1], hi: {col: {id: u}}, fresh: col}
    const y0 = 560, w = 437, gap = 9;
    NOTE_T.forEach((t, i) => {
      const x = 66 + i * (w + gap), u = st.u[i] || 0, fresh = st.fresh === i;
      card(ctx, x, y0, w, 258, { fill: fresh && u > 0 ? "#FFF8EE" : "#F7F9FA", stroke: fresh && u > 0 ? ORANGE : "#C9D2D8", lw: fresh && u > 0 ? 4 : 2.5, r: 16 });
      text(ctx, t, x + w / 2, y0 + 40, 25, { align: "center", weight: 900, color: u > 0 ? INK : "#B0BAC1" });
      if (u <= 0) { text(ctx, "?", x + w / 2, y0 + 160, 54, { align: "center", weight: 900, color: "#D3DAE0" }); return; }
      // ditulis dari kiri ke kanan
      ORD[i].forEach((id, k) => {
        const a = clamp(u * 5 - k, 0, 1); if (a <= 0) return;
        const cx = x + 50 + k * 84, hi = st.hi && st.hi[i] && st.hi[i][id] || 0;
        if (hi > 0) { ctx.fillStyle = `rgba(238,122,18,${0.28 * hi})`; rr(ctx, cx - 40, y0 + 78, 80, 132, 12); ctx.fill(); ctx.strokeStyle = `rgba(238,122,18,${hi})`; ctx.lineWidth = 4; rr(ctx, cx - 40, y0 + 78, 80, 132, 12); ctx.stroke(); }
        cap(ctx, id, cx, y0 + 150, 70, { alpha: a });
        text(ctx, String(k + 1), cx, y0 + 196, 24, { align: "center", weight: 800, color: GRAYT });
      });
      text(ctx, "posisi", x + w / 2, y0 + 238, 18, { align: "center", weight: 700, color: GRAYT });
    });
  }

  // ---------- adegan: soal utuh ----------
  function optionsCard(ctx, x, y, w, st = {}) {   // pilihan jawaban A–D
    text(ctx, "PILIHAN JAWABAN", x + w / 2, y + 30, 24, { align: "center", weight: 900, color: C.ink2 });
    ["A", "B", "C", "D"].forEach((L, i) => {
      const ry = y + 50 + i * 136;
      ctx.save(); if (st.alpha) ctx.globalAlpha *= st.alpha;
      card(ctx, x, ry, w, 124, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2, r: 14 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 44, ry + 62, 28, 0, Math.PI * 2); ctx.fill();
      text(ctx, L, x + 44, ry + 74, 34, { align: "center", color: "#fff", weight: 900 });
      capRow(ctx, OPTS[L], x + 150, ry + 96, 112, (w - 190) / 5 + 6);
      ctx.restore();
    });
  }
  const G_SOAL = { x: [360, 660, 960, 1260, 1560], y: 480, s: 220, finish: 170, ground: 618, numY: 225, top: 150, right: 1740 };
  function soal(ctx, b, l, t, TL) {
    board(ctx);
    const id = b.id, n = +id.slice(4);
    if (n <= 3) {   // lintasan besar
      const appear = n === 1 ? P(l, at(b, "Ada lima"), 1.0) : 1;
      const hats = n >= 2 ? (n === 2 ? P(l, at(b, "memakai topi"), 0.6) : 1) : 0;
      ctx.save(); ctx.globalAlpha = appear;
      const g = G_SOAL;
      ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(g.finish - 30, g.ground); ctx.lineTo(g.right + 30, g.ground); ctx.stroke();
      finishFlag(ctx, g.finish, 330, g.ground);
      START.forEach((w, i) => {
        const x = g.x[i];
        ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(x, g.ground - 6, 76, 13, 0, 0, Math.PI * 2); ctx.fill();
        beaver(ctx, x, g.y, g.s, {});
        if (hats > 0) cap(ctx, w, x, g.y - g.s * 0.33, g.s * 0.86, { alpha: hats });
        // nomor seperti di soal: 1. 2. 3. di atas
        if (n >= 3) { const nu = P(l, at(b, "Setelah satu") + i * 0.25, 0.4); hand(ctx, (i + 1) + ".", x, 250, 46, { color: INK, alpha: nu }); }
      });
      if (n === 2) {   // simbol disebut satu per satu
        const W = ["segitiga", "lingkaran", "hati", "persegi panjang", "dan persegi"];
        START.forEach((w, i) => { const u = pulse(l, at(b, W[i]) - 0.1, 1.2); if (u > 0) ring(ctx, g.x[i] + 3, g.y - g.s * 0.55, 52, 44, u); });
      }
      if (n === 3) {
        const du = P(l, at(b, "paling kiri"), 0.6), bu = P(l, at(b, "paling kanan"), 0.6);
        hand(ctx, "paling depan", g.x[0], 690, 42, { color: GREEN, alpha: du });
        if (du > 0) mline(ctx, [[g.x[0] - 40, 730], [g.x[0] - 210, 730]], du, GREEN, 7, true);
        hand(ctx, "paling belakang", g.x[4], 690, 42, { color: GRAYT, alpha: bu });
      }
      ctx.restore();
      return;
    }
    // ringkas: urutan awal kecil + tiga perubahan (kiri), pertanyaan + pilihan (kanan)
    const qu = n >= 6 ? P(l, n === 6 ? at(b, "Pertanyaannya") : 0, 0.6) : 0;
    card(ctx, 70, 150, 840, 255, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "Urutan setelah 1 menit", 490, 186, 26, { align: "center", weight: 900, color: INK });
    hand(ctx, "depan", 100, 186, 24, { color: GREEN, align: "left" }); hand(ctx, "belakang", 880, 186, 24, { color: GRAYT, align: "right" });
    START.forEach((w, i) => { const x = 170 + i * 160; beaver(ctx, x, 300, 104, { hat: w }); text(ctx, String(i + 1), x, 390, 24, { align: "center", weight: 800, color: GRAYT }); });
    // tiga perubahan
    card(ctx, 70, 420, 840, 400, { fill: "#FFFFFF", stroke: "#B8C3CA", lw: 3, r: 18 });
    text(ctx, "Selama lomba:", 100, 466, 28, { weight: 900, color: C.accentDark });
    const LINES = [["Pertama", "Topi bergambar", "persegi biru", "maju 2 posisi."], ["Kedua", "Topi bergambar", "persegi panjang hijau", "maju 1 posisi."], ["Ketiga", "Topi bergambar", "hati merah", "maju 2 posisi."]];
    LINES.forEach(([ph, a1, a2, a3], i) => {
      const u = n === 4 ? (i === 0 ? P(l, at(b, "Pertama"), 0.6) : 0) : n === 5 ? (i === 0 ? 1 : P(l, at(b, ph), 0.6)) : 1;
      if (u <= 0) return;
      const ry = 520 + i * 100, s = STEPS[i], h = HAT[s.who];
      ctx.save(); ctx.globalAlpha = u;
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(120, ry, 26, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), 120, ry + 11, 30, { align: "center", color: "#fff", weight: 900 });
      symbol(ctx, h.sym, 196, ry, h.sym === "rect" ? 66 : 54, h.sc);
      text(ctx, a2, 248, ry - 6, 30, { weight: 900, color: INK });
      text(ctx, a3, 248, ry + 32, 28, { weight: 800, color: ORANGE });
      ctx.restore();
    });
    if (n <= 5) { kiko(ctx, 1380, 560, 230, 0, { mood: "happy" }); hand(ctx, "maju = ke arah depan", 1380, 300, 44, { color: ORANGE }); mline(ctx, [[1560, 360], [1200, 360]], 1, ORANGE, 8, true); return; }
    ctx.save(); ctx.globalAlpha = qu;
    card(ctx, 940, 150, 910, 670, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 18 });
    text(ctx, "Bagaimana urutan di akhir lomba?", 1395, 198, 34, { align: "center", weight: 900, color: INK });
    optionsCard(ctx, 965, 214, 860);
    ctx.restore();
  }

  // Short: soal vertikal di daerah x 460–1460 (lintasan + tiga perubahan + pilihan)
  function soal_v(ctx, b, l, t, TL) {
    board(ctx);
    const g = { x: [610, 790, 970, 1150, 1330], y: 260, s: 135, finish: 500, ground: 335, numY: 372, top: 140, right: 1430 };
    track(ctx, g, { order: START, l, labels: 0, nums: 1 });
    hand(ctx, "DEPAN", 472, 428, 28, { color: GREEN, align: "left" }); hand(ctx, "BELAKANG", 1330, 428, 28, { color: GRAYT });
    const full = b.id !== "h0";
    if (!full) return;
    card(ctx, 470, 445, 980, 175, { fill: "#FFFFFF", stroke: "#B8C3CA", lw: 3, r: 16 });
    STEPS.forEach((s, i) => {
      const ry = 487 + i * 50, h = HAT[s.who];
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(510, ry, 20, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), 510, ry + 9, 24, { align: "center", color: "#fff", weight: 900 });
      symbol(ctx, h.sym, 570, ry, h.sym === "rect" ? 50 : 40, h.sc);
      text(ctx, h.snama + "  maju " + s.n + " posisi", 612, ry + 11, 30, { weight: 900, color: INK });
    });
    ["A", "B", "C", "D"].forEach((L, i) => {
      const x = 470 + (i % 2) * 495, y = 630 + Math.floor(i / 2) * 102;
      card(ctx, x, y, 485, 96, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2, r: 14 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 34, y + 48, 22, 0, Math.PI * 2); ctx.fill();
      text(ctx, L, x + 34, y + 58, 28, { align: "center", color: "#fff", weight: 900 });
      capRow(ctx, OPTS[L], x + 100, y + 72, 66, 82);
    });
  }

  // ---------- adegan: depan, belakang, maju (berang-berang polos) ----------
  const G_ARAH = { x: [430, 650, 870, 1090, 1310], y: 420, s: 170, finish: 260, ground: 525, numY: 580, top: 160, right: 1500 };
  function arah(ctx, b, l, t, TL) {
    board(ctx);
    const id = b.id, n = +id.slice(1), g = G_ARAH, P5 = ["p1", "p2", "p3", "p4", "p5"];
    let order = P5.slice(), swaps = [], glow = {};
    const labels = n >= 2 ? (n === 2 ? P(l, at(b, "Dialah"), 0.6) : 1) : 0;
    const arrow = n >= 2 ? (n === 2 ? P(l, at(b, "berlari ke arah kiri"), 1.0) : 1) : 0;
    const nums = n >= 3 ? (n === 3 ? P(l, at(b, "Kita beri"), 0.6) : 1) : 0;
    const numHi = {};
    if (n === 3) { numHi[1] = pulse(l, at(b, "Posisi satu"), 1.6); numHi[5] = pulse(l, at(b, "posisi lima"), 1.6); }
    if (n === 4) {   // dua berang-berang bertukar, nomornya tetap
      const t0 = at(b, "Nomornya tidak"); swaps = [{ t: t0, i: 3 }]; glow = { p4: 1, p3: 1 };
      Object.assign(numHi, { 3: 1, 4: 1 });
    }
    if (n === 6) {
      const t1 = at(b, "Maju satu"), t2 = at(b, "Maju dua");
      if (l < t2 - 0.3) { swaps = [{ t: t1 + 0.6, i: 4 }]; glow = { p5: 1 }; }
      else { swaps = [{ t: t2 + 0.4, i: 4 }, { t: t2 + 1.6, i: 3 }]; glow = { p5: 1 }; }
    }
    track(ctx, g, { order, swaps, l, hats: false, labels, arrow, nums, numHi, glow });
    // catatan kanan
    if (n === 2) { const u = P(l, at(b, "garis finis"), 0.6); hand(ctx, "garis finis", g.finish, 215, 34, { color: INK, alpha: u }); }
    if (n === 4) { hand(ctx, "nomor tetap di tempatnya", 870, 680, 44, { alpha: P(l, at(b, "Ingat"), 0.6) }); }
    if (n === 5) {
      const u = P(l, at(b, "Maju artinya"), 0.6);
      ctx.save(); ctx.globalAlpha = u; card(ctx, 1560, 220, 290, 300, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "MAJU", 1705, 285, 48, { align: "center", weight: 900, color: ORANGE });
      text(ctx, "= ke depan", 1705, 345, 32, { align: "center", weight: 800, color: INK });
      text(ctx, "= ke kiri", 1705, 395, 32, { align: "center", weight: 800, color: INK });
      mline(ctx, [[1790, 460], [1620, 460]], 1, ORANGE, 8, true);
      ctx.restore();
    }
    if (n === 6) {
      const t1 = at(b, "Maju satu"), t2 = at(b, "Maju dua");
      const lbl = l < t2 - 0.3 ? "maju 1 posisi = menyalip 1" : "maju 2 posisi = menyalip 2";
      hand(ctx, lbl, 870, 690, 46, { alpha: l < t2 - 0.3 ? P(l, t1, 0.5) : P(l, t2, 0.5) });
      const passed = l < t2 - 0.3 ? (l > t1 + 1.1 ? 1 : 0) : (l > t2 + 0.9 ? 1 : 0) + (l > t2 + 2.1 ? 1 : 0);
      for (let k = 0; k < passed; k++) { const x = g.x[4 - k]; hand(ctx, String(k + 1), x + 60, g.y - 90, 40, { color: ORANGE }); }
    }
    if (n === 1) { kiko(ctx, 1640, 560, 220, 0, { mood: "happy" }); }
  }

  // ---------- adegan: topi dan simbol ----------
  function topi(ctx, b, l, t, TL) {
    board(ctx);
    const id = b.id, n = +id.slice(1);
    const X0 = 110, W = 1240, Y0 = 160, RH = 104;
    card(ctx, X0, Y0, W, 70 + RH * 5, { fill: "#FFFFFF", stroke: INK, lw: 3.5, r: 16 });
    text(ctx, "TOPI", X0 + 230, Y0 + 46, 28, { align: "center", weight: 900, color: C.ink2 });
    text(ctx, "SIMBOL DI TOPINYA", X0 + 870, Y0 + 46, 28, { align: "center", weight: 900, color: C.ink2 });
    ctx.strokeStyle = "#AEB8BF"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0 + 560, Y0 + 14); ctx.lineTo(X0 + 560, Y0 + 70 + RH * 5 - 14); ctx.stroke();
    const PH = { M: "Topi merah", B: "Topi biru", H: "Topi hijau", K: "Topi kuning", U: "Topi ungu" };
    START.forEach((w, i) => {
      const ry = Y0 + 70 + i * RH, h = HAT[w];
      let u = 1;
      if (n === 1) u = 0;
      if (n === 2) u = i < 3 ? P(l, at(b, PH[w]), 0.5) : 0;
      if (n === 3) u = i < 3 ? 1 : P(l, at(b, PH[w]), 0.5);
      if (u <= 0) return;
      ctx.save(); ctx.globalAlpha = u;
      const hiU = n === 4 && w === "U" ? P(l, at(b, "Contohnya"), 0.5) : 0, hiB = n === 4 && w === "B" ? P(l, at(b, "bukan di topi biru"), 0.5) : 0;
      if (hiU > 0) { ctx.fillStyle = `rgba(238,122,18,${0.2 * hiU})`; rr(ctx, X0 + 8, ry + 4, W - 16, RH - 8, 12); ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; rr(ctx, X0 + 8, ry + 4, W - 16, RH - 8, 12); ctx.stroke(); }
      if (i) { ctx.strokeStyle = "#D5DCE1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0 + 14, ry); ctx.lineTo(X0 + W - 14, ry); ctx.stroke(); }
      cap(ctx, w, X0 + 110, ry + 82, 120);
      text(ctx, "topi " + h.nama, X0 + 210, ry + 66, 40, { weight: 900, color: INK });
      symbol(ctx, h.sym, X0 + 660, ry + RH / 2, h.sym === "rect" ? 92 : 70, h.sc);
      text(ctx, h.snama, X0 + 740, ry + 66, 40, { weight: 900, color: INK });
      if (hiB > 0) { cross(ctx, X0 + 1170, ry + RH / 2, 56, hiB, RED, 8); }
      if (hiU > 0) { tick(ctx, X0 + 1170, ry + RH / 2, 62, hiU, GREEN, 8); }
      ctx.restore();
    });
    // kanan: Kiko / peringatan / persegi vs persegi panjang
    if (n <= 3) kiko(ctx, 1610, 520, 220, 0, { mood: "happy" });
    if (n === 1) { const u = P(l, at(b, "warna simbolnya"), 0.6); ctx.save(); ctx.globalAlpha = u; cap(ctx, "U", 730, 520, 360); hand(ctx, "warna topi", 420, 380, 40, { color: INK }); mline(ctx, [[450, 395], [590, 450]], 1, INK, 5, true); hand(ctx, "warna simbol", 1100, 330, 40, { color: INK }); mline(ctx, [[1040, 345], [800, 410]], 1, INK, 5, true); ctx.restore(); }
    if (n === 4) {
      const u = P(l, at(b, "Hati-hati"), 0.5);
      ctx.save(); ctx.globalAlpha = u; card(ctx, 1390, 180, 450, 330, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "HATI-HATI!", 1615, 240, 40, { align: "center", weight: 900, color: ORANGE });
      para(ctx, "Yang disebut di soal adalah simbolnya, bukan warna topinya.", 1615, 300, 32, 400, { align: "center", weight: 800, color: INK, lh: 1.25 });
      ctx.restore();
    }
    if (n >= 5) {
      const u = n === 5 ? P(l, at(b, "Persegi dan"), 0.6) : 1;
      ctx.save(); ctx.globalAlpha = u; card(ctx, 1390, 180, 450, 560, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
      symbol(ctx, "square", 1615, 330, 170, HAT.U.sc, { halo: false });
      text(ctx, "persegi", 1615, 460, 38, { align: "center", weight: 900, color: INK });
      text(ctx, "4 sisi sama panjang", 1615, 500, 26, { align: "center", weight: 700, color: C.ink2 });
      symbol(ctx, "rect", 1615, 600, 200, HAT.K.sc, { halo: false });
      text(ctx, "persegi panjang", 1615, 700, 38, { align: "center", weight: 900, color: INK });
      ctx.restore();
    }
  }

  // ---------- adegan: pemanasan balap karung ----------
  function sack(ctx, x, y, s) {
    ctx.fillStyle = "#C9A26B"; ctx.strokeStyle = "#7A5A2E"; ctx.lineWidth = 4;
    rr(ctx, x - s * 0.5, y + s * 0.18, s, s * 0.88, s * 0.12); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(122,90,46,0.45)"; ctx.lineWidth = 3;
    for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - s * 0.46, y + s * (0.18 + k * 0.22)); ctx.lineTo(x + s * 0.46, y + s * (0.18 + k * 0.22)); ctx.stroke(); }
    ctx.strokeStyle = "#7A5A2E"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - s * 0.5, y + s * 0.26); ctx.lineTo(x + s * 0.5, y + s * 0.26); ctx.stroke();
  }
  const NAMA = { S: "Sinta", K: "Kiko", D: "Dito" };
  function person(ctx, w, x, y, s, hopv) {
    const yy = y - hopv * s * 0.5;
    if (w === "K") { kiko(ctx, x, yy, s * 1.15, 0, { mood: "happy" }); sack(ctx, x, yy + s * 0.05, s * 0.95); }
    else { kid(ctx, x, yy, s * 0.8, w === "S" ? { hair: "long" } : {}); sack(ctx, x, yy + s * 0.02, s * 0.85); }
    text(ctx, NAMA[w], x, yy - s * 0.82, 38, { align: "center", weight: 900, color: INK });
  }
  function karung(ctx, b, l, t, TL) {
    board(ctx);
    const id = b.id, n = +id.slice(1);
    const g = { x: [430, 760, 1090], y: 450, s: 190, finish: 250, ground: 650, numY: 700, top: 160 };
    let order = ["S", "K", "D"], swaps = [];
    if (n === 2) swaps = [{ t: at(b, "Dito menyalip"), i: 2 }];
    if (n >= 3) order = ["S", "D", "K"];
    if (n === 5) swaps = [{ t: at(b, "yaitu Dito"), i: 2 }, { t: at(b, "dan Sinta") + 0.2, i: 1 }];
    if (n >= 6) order = ["K", "S", "D"];
    // lintasan
    ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(g.finish - 30, g.ground); ctx.lineTo(1260, g.ground); ctx.stroke();
    finishFlag(ctx, g.finish, 260, g.ground);
    hand(ctx, "DEPAN", g.finish + 34, 220, 34, { color: GREEN, align: "left" }); hand(ctx, "BELAKANG", 1240, 220, 34, { color: GRAYT, align: "right" });
    g.x.forEach((x, i) => { ctx.fillStyle = "#F3F6F8"; ctx.strokeStyle = "#9AA6AE"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, g.numY + 40, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); text(ctx, String(i + 1), x, g.numY + 51, 32, { align: "center", weight: 900, color: INK }); });
    const appear = n === 1 ? P(l, at(b, "Pesertanya"), 0.8) : 1;
    const { pos, hop } = layout(order, swaps, l);
    ctx.save(); ctx.globalAlpha = appear;
    order.slice().sort((a, c) => hop[a] - hop[c]).forEach(w => {
      const f = clamp(pos[w], 0, 2), i = Math.floor(Math.min(f, 1.999)), x = lerp(g.x[i], g.x[i + 1], f - i);
      person(ctx, w, x, g.y, g.s, hop[w]);
    });
    ctx.restore();
    if (n === 3) {   // Kiko bergeser karena disalip
      const u = P(l, at(b, "karena disalip"), 0.6);
      ring(ctx, g.x[2], g.y + 20, 120, 210, P(l, at(b, "Lihat Kiko"), 0.7));
      if (u > 0) { hand(ctx, "disalip, jadi", g.x[2], 225, 32, { alpha: u }); hand(ctx, "bergeser 1 ke belakang", g.x[2], 262, 32, { alpha: u }); }
    }
    // panel kanan
    const px = 1320, pw = 530;
    if (n === 4) { const t0 = at(b, "Hentikan"); thinkBadge(ctx, px, 160, pw, 330, l - t0, Math.max(4, b.dur - t0 - 0.4)); }
    else {
      const ord = layout(order, swaps, l + 0).cur, done = swaps.length ? l > swaps[swaps.length - 1].t + SW_D : true;
      card(ctx, px, 160, pw, 330, { fill: "#FFFFFF", stroke: "#B8C3CA", lw: 3, r: 18 });
      text(ctx, "URUTAN SEKARANG", px + pw / 2, 205, 26, { align: "center", weight: 900, color: C.accentDark });
      const show = n === 4 ? ["S", "D", "K"] : done ? ord : order;
      show.forEach((w, i) => { text(ctx, (i + 1) + ".", px + 60, 270 + i * 70, 40, { weight: 900, color: GRAYT }); text(ctx, NAMA[w], px + 120, 270 + i * 70, 44, { weight: 900, color: INK }); });
    }
    if (n === 4) { hand(ctx, "Kiko maju 2 posisi?", px + pw / 2, 560, 40, {}); }
    if (n >= 6) {
      card(ctx, px, 510, pw, 300, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 18 });
      const R = n === 6 ? [["Yang maju menyalip", "teman di depannya.", "Yang maju"], ["Yang disalip bergeser", "1 posisi ke belakang.", "Teman yang disalip"]] : [["Jumlah peserta", "tetap 3.", "Jumlah"], ["Tidak ada yang hilang", "atau bertambah.", "Tidak ada"]];
      R.forEach(([a1, a2, ph], i) => {
        const u = P(l, at(b, ph), 0.5); if (u <= 0) return;
        ctx.save(); ctx.globalAlpha = u; const y = 570 + i * 120;
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(px + 40, y + 10, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), px + 40, y + 20, 26, { align: "center", color: "#fff", weight: 900 });
        text(ctx, a1, px + 76, y + 6, 30, { weight: 900, color: INK }); text(ctx, a2, px + 76, y + 46, 30, { weight: 900, color: INK });
        ctx.restore();
      });
    }
  }

  // ---------- adegan: lomba (tiga perubahan, dicatat) ----------
  // konfigurasi per beat: k = nomor perubahan yang sedang dikerjakan (0..2), order = urutan di awal beat
  const LCFG = {
    s1a: { order: 0, cur: -1, done: 0, note: [1, 0, 0, 0], writeAt: ["Kita catat", 0] },
    s1b: { order: 0, cur: 0, done: 0, note: [1, 0, 0, 0], symPulse: "persegi biru maju" },
    s1c: { order: 0, cur: 0, done: 0, note: [1, 0, 0, 0], table: "U", tableAt: "Persegi biru ada", mapAt: "Jadi, yang maju", glow: "U", glowAt: "Jadi, yang maju", posHi: [5, "Sekarang, dia"] },
    s1d: { order: 0, cur: 0, done: 0, note: [1, 0, 0, 0], map: 1, wrongB: true },
    s1e: { order: 0, cur: 0, done: 0, note: [1, 0, 0, 0], map: 1, glow: "U", swaps: [["menyalip topi kuning", 4], ["lalu menyalip", 3]], posHi: [3, "Sekarang, dia"] },
    s1f: { order: 1, cur: 0, done: 0, note: [1, 0, 0, 0], map: 1, back: ["H", "K"], writeAt: ["Urutannya sekarang", 1] },
    s2a: { order: 1, cur: 1, done: 1, note: [1, 1, 0, 0], symPulse: "persegi panjang hijau maju" },
    s2t: { order: 1, cur: 1, done: 1, note: [1, 1, 0, 0], think: "Hentikan" },
    s2b: { order: 1, cur: 1, done: 1, note: [1, 1, 0, 0], table: "K", tableAt: "Persegi panjang hijau ada", mapAt: "Persegi panjang hijau ada", glow: "K", glowAt: "Topi kuning sekarang", notH: "bukan di topi hijau", posHi: [5, "posisi lima"] },
    s2c: { order: 1, cur: 1, done: 1, note: [1, 1, 0, 0], map: 1, glow: "K", swaps: [["menyalip topi hijau", 4]], posHi: [4, "pindah ke posisi"] },
    s2d: { order: 2, cur: 1, done: 1, note: [1, 1, 0, 0], map: 1, writeAt: ["Urutannya sekarang", 2] },
    s3a: { order: 2, cur: 2, done: 2, note: [1, 1, 1, 0], table: "H", tableAt: "Hati merah ada", mapAt: "Hati merah ada", numPulse: "di posisi berapa", thinkShort: "di posisi berapa" },
    s3b: { order: 2, cur: 2, done: 2, note: [1, 1, 1, 0], map: 1, glow: "H", glowAt: "Topi hijau ada", posHi: [5, "posisi lima"], history: "Padahal" },
    s3c: { order: 2, cur: 2, done: 2, note: [1, 1, 1, 0], map: 1, glow: "H", swaps: [["menyalip topi kuning", 4], ["lalu menyalip", 3]], posHi: [3, "Sekarang, topi"] },
    s3d: { order: 3, cur: 2, done: 2, note: [1, 1, 1, 0], map: 1, back: ["U", "K"], writeAt: ["Urutan akhirnya", 3], finalDone: "Urutan akhirnya" },
  };
  function lomba(ctx, b, l, t, TL) {
    board(ctx);
    const cf = LCFG[b.id] || LCFG.s1a, g = G_MAIN, order = ORD[cf.order];
    const swaps = (cf.swaps || []).map(([ph, i]) => ({ t: at(b, ph), i }));
    const glow = {}; if (cf.glow) glow[cf.glow] = cf.glowAt ? P(l, at(b, cf.glowAt), 0.5) : 1;
    const numHi = {}; if (cf.posHi) numHi[cf.posHi[0]] = P(l, at(b, cf.posHi[1]), 0.4);
    const numPulse = cf.numPulse && l > at(b, cf.numPulse) ? 1 : 0;
    const { pos, hop } = track(ctx, g, { order, swaps, l, labels: 1, nums: 1, numHi, glow, numPulse });
    // tanda pada berang-berang
    if (cf.glow && cf.glowAt) { const [x, y] = capPos(g, pos[cf.glow], hop[cf.glow]); ring(ctx, x, y, 72, 52, P(l, at(b, cf.glowAt), 0.7)); }
    if (cf.wrongB) {
      const [x, y] = capPos(g, pos.B), u = P(l, at(b, "topi biru?"), 0.6);
      ring(ctx, x, y, 72, 52, u, RED);
      const bu = P(l, at(b, "Di depannya"), 0.6);
      if (bu > 0) { mline(ctx, [[g.x[1] - 20, 210], [g.x[0], 210]], bu, RED, 6, true); hand(ctx, "hanya 1 di depannya", g.x[1] + 30, 200, 30, { color: RED, align: "left", alpha: bu }); }
      const cu = P(l, at(b, "tidak mungkin"), 0.6); if (cu > 0) cross(ctx, x + 80, y - 20, 56, cu, RED, 8);
    }
    if (cf.notH) { const u = P(l, at(b, cf.notH), 0.6); const [x, y] = capPos(g, pos.H); if (u > 0) { cross(ctx, x + 78, y - 26, 44, u, RED, 7); } }
    if (cf.back) {   // yang disalip bergeser ke belakang
      cf.back.forEach((w, i) => { const u = P(l, 0.3 + i * 0.4, 0.6); const x = slotX(g, pos[w]); if (u > 0) { mline(ctx, [[x - 40, 205], [x + 40, 205]], u, GRAYT, 5, true); hand(ctx, "+1 ke belakang", x, 192, 22, { color: GRAYT, alpha: u }); } });
    }
    // hitungan menyalip
    swaps.forEach((sw, k) => { if (l > sw.t + SW_D * 0.6) { const x = g.x[sw.i]; hand(ctx, "salip " + (k + 1), x, 205, 28, { alpha: P(l, sw.t + SW_D * 0.6, 0.4) }); } });
    // kartu kanan
    const map = {}; if (cf.cur >= 0) map[cf.cur] = cf.map ? 1 : cf.mapAt ? P(l, at(b, cf.mapAt), 0.5) : 0;
    const fin = cf.finalDone && l > at(b, cf.finalDone) ? 3 : cf.done;
    stepsCard(ctx, 1330, 145, 520, { cur: fin >= 3 ? -1 : cf.cur, done: fin, map });
    if (cf.symPulse) { const u = pulse(l, at(b, cf.symPulse), 1.6); if (u > 0) ring(ctx, 1330 + 98, 145 + 62 + cf.cur * 62 + 28, 44, 36, u); }
    if (cf.think) { const t0 = at(b, cf.think); thinkBadge(ctx, 1330, 400, 520, 150, l - t0, Math.max(4, b.dur - t0 - 0.4)); }
    else if (cf.thinkShort && l > at(b, cf.thinkShort) + 0.8) { const t0 = at(b, cf.thinkShort) + 0.8; thinkBadge(ctx, 1330, 400, 520, 150, l - t0, Math.max(2, b.dur - t0 - 0.2)); }
    else symTable(ctx, 1330, 400, 520, { hi: cf.table && l > at(b, cf.tableAt) ? cf.table : null });
    // catatan
    const nu = cf.note.slice(), hi = {};
    if (cf.writeAt) { const [ph, col] = cf.writeAt; nu[col] = clamp((l - at(b, ph)) / 1.6, 0, 1); }
    if (cf.history) {   // topi hijau di tiap catatan
      const t0 = at(b, cf.history);
      [0, 1, 2].forEach(c => { hi[c] = { H: P(l, t0 + c * 0.8, 0.4) }; });
    }
    notes(ctx, { u: nu, hi, fresh: cf.writeAt ? cf.writeAt[1] : -1 });
  }

  // ---------- adegan: memeriksa pilihan ----------
  function pilihan(ctx, b, l, t, TL) {
    board(ctx);
    const n = +b.id.slice(1);
    card(ctx, 70, 150, 1780, 150, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 18 });
    text(ctx, "URUTAN AKHIR KITA", 110, 210, 28, { weight: 900, color: C.accentDark });
    text(ctx, "depan", 110, 258, 24, { weight: 800, color: GREEN });
    const fhi = {};
    if (n === 5) START.forEach((id, i) => fhi[id] = pulse(l, at(b, "setiap topi") + i * 0.35, 0.9));
    capRow(ctx, ORD[3], 560, 268, 96, 150, { hi: fhi });
    text(ctx, "belakang", 1290, 258, 24, { weight: 800, color: GRAYT });
    if (n === 5) { const u = P(l, at(b, "tepat satu kali"), 0.6); hand(ctx, "5 topi, masing-masing 1 kali", 1830, 214, 30, { alpha: u, color: GREEN, align: "right" }); }
    const NOTE = { A: "setelah perubahan 1 saja", B: "setelah perubahan 2", C: "sama dengan urutan akhir", D: "urutan awal" };
    const showAt = { A: "Pilihan A", B: "Pilihan B", D: "Pilihan D", C: "Pilihan C" };
    ["A", "B", "C", "D"].forEach((L, i) => {
      const ry = 318 + i * 126;
      const judged = (L === "A" || L === "B") ? n >= 3 || (n === 2 && l > at(b, showAt[L])) : L === "D" ? n >= 4 || (n === 3 && l > at(b, "Pilihan D")) : n >= 5 || (n === 4 && l > at(b, "Jadi, jawabannya"));
      const isC = L === "C", focus = (n === 2 && (L === "A" || L === "B")) || (n === 3 && L === "D") || (n === 4 && L === "C");
      const ok = isC && judged;
      card(ctx, 70, ry, 1780, 112, { fill: ok ? C.goodBg : "#F7F9FA", stroke: ok ? GREEN : focus ? ORANGE : "#C9D2D8", lw: ok || focus ? 4 : 2, r: 16 });
      ctx.save(); if (judged && !isC) ctx.globalAlpha *= 0.55;
      ctx.fillStyle = ok ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(130, ry + 56, 32, 0, Math.PI * 2); ctx.fill();
      text(ctx, L, 130, ry + 70, 40, { align: "center", color: "#fff", weight: 900 });
      capRow(ctx, OPTS[L], 560, ry + 82, 84, 150);
      ctx.restore();
      const nu = n > 1 ? (l > at(b, showAt[L]) || judged ? 1 : 0) * (judged ? 1 : P(l, at(b, showAt[L]), 0.5)) : 0;
      const showNote = (L !== "C" && (n >= 2 && (L === "A" || L === "B" ? true : n >= 3))) || (L === "C" && n >= 4);
      if (showNote && nu > 0) hand(ctx, NOTE[L], 1290, ry + 70, 32, { color: isC ? GREEN : C.ink2, alpha: nu, align: "left" });
      if (judged) { if (isC) tick(ctx, 1800, ry + 56, 60, P(l, n === 4 ? at(b, "Jadi, jawabannya") : 0, 0.6), GREEN, 9); else cross(ctx, 1800, ry + 56, 48, n === 2 || n === 3 ? P(l, n === 2 ? at(b, "Keduanya") : at(b, "Jadi, pilihan D"), 0.6) : 1, RED, 8); }
      // perbandingan topi demi topi untuk C
      if (n === 4 && isC && l > at(b, "Urutan ini") && l < at(b, "Jadi, jawabannya") + 0.5) {
        const u = clamp((l - at(b, "Urutan ini")) / 2, 0, 1);
        ORD[3].forEach((id, k) => { const v = clamp(u * 5 - k, 0, 1); if (v > 0) tick(ctx, 560 + k * 150 + 52, ry + 26, 34, v, GREEN, 6); });
      }
    });
    if (n === 6) { ring(ctx, 130, 318 + 2 * 126 + 56, 52, 52, P(l, 0.3, 0.8), ORANGE, 7); }
  }

  // ---------- penutup ----------
  const SONGS = ["Pelangi", "Balonku", "Naik Delman", "Cicak di Dinding", "Bintang Kecil"];
  function lagu(ctx, b, l, t, TL) {
    board(ctx);
    kiko(ctx, 330, 520, 230, 0, { mood: "happy" });
    // layar daftar putar generik
    ctx.fillStyle = "#2B3440"; rr(ctx, 700, 150, 760, 670, 40); ctx.fill();
    ctx.fillStyle = "#F4F8FB"; rr(ctx, 722, 172, 716, 626, 26); ctx.fill();
    text(ctx, "Daftar Putar", 1080, 228, 36, { align: "center", weight: 900, color: INK });
    const first = b.id === "e1";
    const t0 = first ? at(b, "naik dua posisi") : -99;
    let order = [0, 1, 2, 3, 4];
    const swaps = first ? [{ t: t0 + 0.4, i: 4 }, { t: t0 + 1.5, i: 3 }] : [];
    if (!first) order = [0, 1, 4, 2, 3];
    const { pos, hop } = layout(order, swaps, l);
    order.forEach(s => {
      const y = 270 + pos[s] * 104, mv = s === 4 && first;
      const x = 750 + (hop[s] || 0) * 30;
      card(ctx, x, y, 660, 90, { fill: mv ? "#FFF1DF" : "#FFFFFF", stroke: mv ? ORANGE : "#C9D2D8", lw: mv ? 4 : 2, r: 14 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 46, y + 45, 24, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(x + 40, y + 54, 7, 5.5, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x + 45, y + 30, 3.5, 25);
      text(ctx, SONGS[s], x + 90, y + 57, 34, { weight: 800, color: INK });
    });
    [0, 1, 2, 3, 4].forEach(i => text(ctx, String(i + 1), 1490, 327 + i * 104, 32, { weight: 900, color: GRAYT }));
    if (first) {
      const u = P(l, t0, 0.5); hand(ctx, "naik 2 posisi", 1700, 420, 40, { alpha: u }); if (u > 0) mline(ctx, [[1545, 700], [1545, 470]], u, ORANGE, 7, true);
      const v = P(l, at(b, "menggeser lagu-lagu"), 0.5); hand(ctx, "yang dilewati", 1710, 600, 30, { alpha: v, color: C.ink2 }); hand(ctx, "turun 1", 1710, 640, 30, { alpha: v, color: C.ink2 });
    } else {
      const R = [["satu per satu", "satu per satu"], ["sesuai urutan", "sesuai urutan"], ["ingat urutan terbaru", "mengingat"]];
      R.forEach(([s, ph], i) => { const u = P(l, at(b, ph), 0.5); hand(ctx, s, 1680, 330 + i * 120, 34, { alpha: u, color: i === 2 ? GREEN : ORANGE }); });
    }
  }
  function langkah(ctx, b, l, t, TL) {
    board(ctx);
    text(ctx, "TIGA LANGKAH", 960, 210, 40, { align: "center", weight: 900, color: C.accentDark });
    const R = [["Cari bendanya dari simbolnya dengan teliti.", "Pertama"], ["Kerjakan perubahan satu per satu, sesuai urutan.", "Kedua"], ["Catat urutannya setelah setiap langkah.", "Ketiga"]];
    R.forEach(([s, ph], i) => {
      const u = P(l, at(b, ph), 0.6); if (u <= 0) return;
      const y = 260 + i * 175;
      ctx.save(); ctx.globalAlpha = u; card(ctx, 150, y, 1620, 140, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 3, r: 70 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(225, y + 70, 48, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), 225, y + 90, 56, { align: "center", color: "#fff", weight: 900 });
      text(ctx, s, 300, y + 88, 46, { weight: 900, color: INK, fit: 1180 });
      if (i === 0) { symbol(ctx, "square", 1590, y + 70, 64, HAT.U.sc); text(ctx, "→", 1650, y + 84, 40, { weight: 900, color: GRAYT }); cap(ctx, "U", 1715, y + 94, 80); }
      if (i === 1) { [0, 1, 2].forEach(k => { ctx.fillStyle = k < 2 ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(1590 + k * 60, y + 70, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, String(k + 1), 1590 + k * 60, y + 80, 26, { align: "center", color: "#fff", weight: 900 }); }); }
      if (i === 2) { card(ctx, 1560, y + 28, 200, 84, { fill: "#FFFFFF", stroke: "#C9D2D8", lw: 2, r: 10 }); capRow(ctx, ["M", "B", "H"], 1600, y + 90, 46, 60); }
      ctx.restore();
    });
  }
  function flagHR(ctx, x, y, w) {   // bendera Kroasia: merah, putih, biru + perisai kotak-kotak merah putih
    const h = w * 0.5;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    [["#E2231A", 0], ["#FFFFFF", 1], ["#171796", 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(x, y + i * h / 3, w, h / 3 + 0.5); });
    const sw = w * 0.2, sx = x + w / 2 - sw / 2, sy = y + h * 0.18, cs = sw / 5;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { ctx.fillStyle = (r + c) % 2 ? "#FFFFFF" : "#E2231A"; ctx.fillRect(sx + c * cs, sy + r * cs, cs + 0.3, cs + 0.3); }
    ctx.strokeStyle = "#171796"; ctx.lineWidth = 2; ctx.strokeRect(sx, sy, sw, sw);
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  Object.assign(K.SCENES, {
    soal, soal_v, arah, topi, karung, lomba, pilihan, lagu, langkah,
    buka(ctx, b, l, t, TL) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
      START.forEach((w, i) => { const v = clamp(bu * 5 - i, 0, 1); if (v > 0) beaver(ctx, 820 + i * 200, 580 + (1 - v) * 30, 180, { alpha: v, hat: w }); });
      if (!first) hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 790, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
      kiko(ctx, 360, 540, 230, 0, { wave: l, mood: "happy" });
    },
    kredit(ctx, b, l, t, TL) {
      board(ctx);
      const u = P(l, 0.2, 0.6);
      ctx.save(); ctx.globalAlpha = u;
      const gx = 380, gy = 500, gr = 160;
      ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
      ctx.restore();
      const fu = P(l, at(b, "Kroasia"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagHR(ctx, 470, 230, 190); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"], ["Kategori", "Siaga (kelas 4–6 SD)", "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (i >= 3 ? 0.8 + (i - 3) * 0.4 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 840 });
        ctx.restore();
      });
      const au = P(l, at(b, "Kroasia"), 0.8); if (au > 0) ring(ctx, 1190, 300 + 2 * 92 - 14, 220, 44, au);
    },
    akhir(ctx, b, l, t, TL) {
      board(ctx);
      kiko(ctx, 300, 500, 210, 0, { wave: l, mood: "happy" });
      START.forEach((w, i) => beaver(ctx, 520 + (i % 3) * 190 + (i >= 3 ? 95 : 0), 330 + (i >= 3 ? 230 : 0) + Math.sin(l * 3 + i) * 6, 150, { hat: w }));
      card(ctx, 1120, 170, 710, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1475, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode], ["Kategori:", "Siaga (kelas 4–6)"]];
      L.forEach(([k, v], i) => { const y = 310 + i * 66; text(ctx, k, 1160, y, 28, { weight: 700, color: C.ink2 }); text(ctx, v, 1380, y, 30, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 430 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1475, 680, 26, 620, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 760, 780, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l, t, TL) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 70, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Kenapa A, B, dan D salah?", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      START.forEach((w, i) => beaver(ctx, 660 + i * 150, 660, 140, { hat: w }));
    },
  });
  K.bebrasSG02 = { beaver, cap, symbol, HAT, ORD };
})(typeof window !== "undefined" ? window : globalThis);
