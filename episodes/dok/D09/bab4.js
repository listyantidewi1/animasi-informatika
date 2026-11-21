/* D09 bab 4 — Patch adalah peta harta karun (b4_1 … b4_13): diff sebelum/sesudah, diff menjadi peta, laporan GTIG,
   server penyerang yang terbuka, lingkaran exploit_agent, sasaran di Prancis, jendela patch PaperCut (hari 0/1/4), log Java4Shell. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d09, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080, TAU = U.TAU;
  const S = {};
  const L = ["static void decode(buf_t *out,", "        const char *in, size_t n)", "{", "    size_t len = n / 4 * 3;"];
  function diff(ctx, l, tHl, o = {}) {
    const f1 = X.windowFrame(ctx, 110, 200, 830, 620, { tab: "sebelum.c" });
    X.code(ctx, f1.x + 40, f1.y + 70, [...L, { t: "    memcpy(out->data, in, len);", bg: U.rgba(C.red, 0.2), mark: C.red, markCh: "-" }, "    out->used += len;", "}"], { size: 28, lh: 56, w: 770, pad: 30 });
    const f2 = X.windowFrame(ctx, 980, 200, 830, 620, { tab: "sesudah.c" });
    X.code(ctx, f2.x + 40, f2.y + 70, [...L, { t: "    if (len > out->cap - out->used)", bg: U.rgba(C.term, 0.18), mark: C.term, markCh: "+" }, { t: "        return;", bg: U.rgba(C.term, 0.18), mark: C.term, markCh: "+" }, "    memcpy(out->data, in, len);", "    out->used += len;", "}"], { size: 28, lh: 56, w: 770, pad: 30 });
    const hy = f2.y + 70 + 4 * 56 - 30 - 12, a = ramp(l, tHl, 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha *= a; X.glow(ctx, 1395, hy + 56, 420, C.amber, 0.25); ctx.strokeStyle = C.amber; ctx.lineWidth = 5; U.rr(ctx, f2.x - 8, hy, 790, 118, 12); ctx.stroke();
      const mx = 1730, my = hy + 200; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(mx, my, 44, 0, TAU); ctx.stroke(); ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(mx + 32, my + 32); ctx.lineTo(mx + 78, my + 78); ctx.stroke(); ctx.restore(); }
    T(ctx, "ilustrasi, bukan kode asli", 1824, 64, 26, { align: "right", weight: 600, color: C.dim });
    return hy;
  }

  S.b4_1 = function (ctx, b, l, t) {
    diff(ctx, l, U.at(b, "baris yang berubah"));
    if (l > U.at(b, "di mana lubangnya")) U.pill(ctx, "baris yang berubah = letak lubangnya", 960, 900, { size: 44, col: C.amber });
  };

  function peta(ctx, u, t, xU) {   // kertas peta tua dengan grid dan X
    ctx.save(); ctx.globalAlpha *= u; const x = 360, y = 220, w = 1200, h = 640;
    ctx.fillStyle = "#2A241B"; U.rr(ctx, x, y, w, h, 18); ctx.fill(); ctx.strokeStyle = "#8C7A57"; ctx.lineWidth = 4; U.rr(ctx, x, y, w, h, 18); ctx.stroke();
    ctx.strokeStyle = "rgba(200,180,130,0.18)"; ctx.lineWidth = 2; for (let i = 1; i < 12; i++) { ctx.beginPath(); ctx.moveTo(x + i * 100, y); ctx.lineTo(x + i * 100, y + h); ctx.stroke(); } for (let i = 1; i < 7; i++) { ctx.beginPath(); ctx.moveTo(x, y + i * 92); ctx.lineTo(x + w, y + i * 92); ctx.stroke(); }
    ctx.strokeStyle = "rgba(220,200,150,0.6)"; ctx.lineWidth = 5; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(x + 120, y + 520); ctx.bezierCurveTo(x + 400, y + 300, x + 600, y + 600, x + 850, y + 300); ctx.stroke(); ctx.setLineDash([]);
    if (xU > 0) { const cx = x + 870, cy = y + 280, s = 70 * eout(xU); X.glow(ctx, cx, cy, 160, C.red, 0.5); U.silang(ctx, cx, cy, s * 2, 1, C.red); }
    ctx.restore();
  }
  S.b4_2 = function (ctx, b, l, t) {
    const tPem = U.at(b, "Bagi pembela"), tPen = U.at(b, "Bagi penyerang"), tPeta = U.at(b, "peta harta karun"), u = ramp(l, tPen, 0.9);
    U.judul(ctx, "patch diffing", l, 0.1, { y: 150, mono: true, size: 72, col: C.amber });
    if (u < 1) { ctx.save(); ctx.globalAlpha *= 1 - u; ctx.translate(960, 540); const k = lerp(1, 0.6, eio(u)); ctx.scale(k, k * lerp(1, 0.2, u)); ctx.translate(-960, -540); diff(ctx, l, 0);
      if (l > tPem) U.pill(ctx, "pembela: apa yang diperbaiki", 960, 900, { size: 44, col: C.term }); ctx.restore(); }
    if (u > 0) { peta(ctx, u, t, ramp(l, tPeta, 0.5)); if (l > tPeta) U.pill(ctx, "penyerang: peta harta karun", 960, 930 - 30, { size: 44, col: C.red }); }
  };

  S.b4_3 = function (ctx, b, l, t) {
    const tDi = U.at(b, "Di sinilah"), u = ramp(l, 0, 0.8);
    ctx.save(); ctx.globalAlpha *= clamp(1 - ramp(l, tDi - 0.5, 0.6)); peta(ctx, 1 - u * 0.6, t, 1);
    U.muncul(ctx, l, 0.6, 960, 540, () => { U.kotak(ctx, 560, 420, 800, 220, "", { col: C.text2 }); T(ctx, "diff → serangan", 960, 515, 56, { align: "center", weight: 800 }); T(ctx, "butuh keahlian + waktu", 960, 590, 44, { align: "center", weight: 600, color: C.text2 }); }); ctx.restore();
    U.geser(ctx, l, tDi - 0.3, 900, 0, () => X.kartuCVE(ctx, 380, 380, { w: 1160, h: 330, tag: "LAPORAN GOOGLE THREAT INTELLIGENCE", id: "16 November 2026", title: "AI Threat Tracker", col: C.red }));
  };

  S.b4_4 = function (ctx, b, l, t) {
    const tTer = U.at(b, "terbuka untuk umum"), tDal = U.at(b, "Di dalamnya");
    // rak server gelap
    const rx = 620, ry = 180, rw = 680, rh = 680; ctx.fillStyle = "#111014"; U.rr(ctx, rx, ry, rw, rh, 20); ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 3; U.rr(ctx, rx, ry, rw, rh, 20); ctx.stroke();
    for (let i = 0; i < 8; i++) { ctx.fillStyle = "#18171C"; ctx.fillRect(rx + 30, ry + 30 + i * 80, rw - 60, 64); ctx.fillStyle = i % 3 ? C.termDim : C.redDeep; ctx.beginPath(); ctx.arc(rx + rw - 60, ry + 62 + i * 80, 6, 0, TAU); ctx.fill(); }
    T(ctx, "server penyerang", 960, 150, 48, { align: "center", weight: 800, color: C.text2 });
    const o = eio(ramp(l, tTer - 0.3, 0.8));
    if (o > 0) { // pintu terbuka + senter
      ctx.save(); ctx.fillStyle = "#0B0A0D"; ctx.fillRect(rx + 120, ry + 260, 440, 300); ctx.fillStyle = "#26242C"; ctx.beginPath(); ctx.moveTo(rx + 120, ry + 260); ctx.lineTo(rx + 120 + 440 * (1 - o) + 30 * o, ry + 260 - 30 * o); ctx.lineTo(rx + 120 + 440 * (1 - o) + 30 * o, ry + 560 + 30 * o); ctx.lineTo(rx + 120, ry + 560); ctx.closePath(); ctx.fill();
      const gr = ctx.createRadialGradient(rx + 380, ry + 420, 10, rx + 380, ry + 420, 260); gr.addColorStop(0, `rgba(255,236,190,${0.35 * o})`); gr.addColorStop(1, "rgba(255,236,190,0)"); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(1800, 900); ctx.lineTo(rx + 220, ry + 280); ctx.lineTo(rx + 540, ry + 560); ctx.closePath(); ctx.fill(); ctx.restore();
      U.pill(ctx, "terbuka untuk umum", 1560, 300, { size: 40, col: C.amber }); }
    U.muncul(ctx, l, tDal, rx + 340, ry + 410, () => U.folder(ctx, rx + 250, ry + 320, 200, 150, "", C.red));
    if (l > tDal + 0.3) T(ctx, "exploit_agent/", rx + 340, ry + 760, 56, { align: "center", mono: true, weight: 700, color: C.red, glow: C.red, blur: 16 });
  };

  const LBL = ["Bandingkan patch", "Cari celah", "Tulis exploit", "Jalankan"];
  function lingkaran(ctx, l, t, ts, speed, aktif) {
    const cx = 960, cy = 560, R = 300; ctx.strokeStyle = U.rgba(C.red, 0.5); ctx.lineWidth = 4; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * speed * 60; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    const ang = -Math.PI / 2 + t * speed; ctx.fillStyle = C.red; X.glow(ctx, cx + R * Math.cos(ang), cy + R * Math.sin(ang), 50, C.red, 0.9); ctx.beginPath(); ctx.arc(cx + R * Math.cos(ang), cy + R * Math.sin(ang), 12, 0, TAU); ctx.fill();
    LBL.forEach((s, i) => { const a = ts ? ramp(l, ts[i] - 0.2, 0.3) : 1; if (a <= 0) return; const q = -Math.PI / 2 + i * Math.PI / 2, x = cx + R * Math.cos(q), y = cy + R * Math.sin(q);
      ctx.save(); ctx.globalAlpha *= a; U.kotak(ctx, x - 200, y - 55, 400, 110, s, { col: C.red, size: 40, glow: aktif === i ? 0.4 : 0 }); ctx.restore(); });
  }
  S.b4_5 = function (ctx, b, l, t) {
    const ts = [U.at(b, "terus membandingkan"), U.at(b, "mencari celahnya"), U.at(b, "menulis exploit"), U.at(b, "lalu menjalankannya")], tT = U.at(b, "tanpa manusia");
    U.judul(ctx, "exploit_agent", l, 0, { y: 140, mono: true, col: C.red, glow: C.red, blur: 20, size: 64 });
    const sp = 0.8 + 3 * ramp(l, ts[3], 3); lingkaran(ctx, l, t, ts, sp, ts.filter(x => l > x).length - 1);
    if (l > tT - 0.3) { U.orang(ctx, 960, 540, 140, C.text2); U.silang(ctx, 960, 560, 200, ramp(l, tT - 0.1, 0.4)); T(ctx, "tanpa manusia", 960, 740, 44, { align: "center", weight: 800, color: C.red }); }
  };

  S.b4_6 = function (ctx, b, l, t) {
    ctx.save(); ctx.globalAlpha *= 0.25; lingkaran(ctx, l, t, null, 2, -1); ctx.restore();
    U.muncul(ctx, l, 0.3, 960, 500, () => { U.kotak(ctx, 210, 330, 1500, 360, "", { col: C.red, fill: "rgba(18,17,21,0.95)" });
      T(ctx, "“", 270, 470, 160, { weight: 900, color: C.red });
      T(ctx, "Pertama kalinya penyerang memakai AI", 960, 460, 56, { align: "center", weight: 800 });
      T(ctx, "untuk mencari dan memanfaatkan celah", 960, 535, 56, { align: "center", weight: 800 });
      T(ctx, "secara otomatis penuh, tanpa manusia.", 960, 610, 56, { align: "center", weight: 800, color: l > U.at(b, "tanpa manusia") ? C.red : C.text }); });
    T(ctx, "Google Threat Intelligence Group, 16 Nov 2026 (diringkas)", 960, 780, 36, { align: "center", weight: 600, color: C.text2 });
  };

  // "segi enam" Prancis bergaya titik
  const HEX = [[0.05, 0.35], [0.35, 0.05], [0.7, 0.12], [0.95, 0.45], [0.85, 0.85], [0.45, 0.98], [0.1, 0.75]];
  function inPoly(x, y, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
  S.b4_7 = function (ctx, b, l, t) {
    const tPel = U.at(b, "Google tidak menyebut"), ox = 260, oy = 220, sz = 560;
    for (let i = 0; i < 28; i++) for (let j = 0; j < 28; j++) { const u = i / 27, v = j / 27; if (!inPoly(u, v, HEX)) continue; const a = ramp(l, 0.2 + (u + v) * 0.4, 0.3);
      ctx.fillStyle = U.rgba(C.php, 0.25 + 0.6 * a); ctx.beginPath(); ctx.arc(ox + u * sz, oy + v * sz, 7, 0, TAU); ctx.fill(); }
    T(ctx, "Prancis", ox + sz / 2, oy + sz + 80, 52, { align: "center", weight: 800, color: C.php });
    const ik = [["koran", "media", U.at(b, "situs media")], ["film", "hiburan", U.at(b, "hiburan")], ["toga", "pendidikan", U.at(b, "pendidikan")]];
    ik.forEach(([k, s, t0], i) => U.muncul(ctx, l, t0 - 0.1, 1080 + i * 230, 360, () => { const x = 1080 + i * 230, y = 360; ctx.save(); ctx.strokeStyle = C.amber; ctx.lineWidth = 6; ctx.lineJoin = "round";
      if (k === "koran") { ctx.strokeRect(x - 60, y - 70, 120, 140); for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.moveTo(x - 40, y - 40 + r * 30); ctx.lineTo(x + 40, y - 40 + r * 30); ctx.stroke(); } }
      if (k === "film") { ctx.strokeRect(x - 70, y - 50, 140, 100); for (let r = 0; r < 4; r++) { ctx.fillStyle = C.amber; ctx.fillRect(x - 60 + r * 36, y - 44, 18, 12); ctx.fillRect(x - 60 + r * 36, y + 32, 18, 12); } }
      if (k === "toga") { ctx.beginPath(); ctx.moveTo(x - 80, y - 20); ctx.lineTo(x, y - 60); ctx.lineTo(x + 80, y - 20); ctx.lineTo(x, y + 20); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 44, y); ctx.lineTo(x - 44, y + 50); ctx.quadraticCurveTo(x, y + 80, x + 44, y + 50); ctx.lineTo(x + 44, y); ctx.stroke(); }
      ctx.restore(); T(ctx, s, x, y + 140, 40, { align: "center", weight: 700 }); }));
    U.muncul(ctx, l, tPel, 1310, 760, () => { U.kotak(ctx, 1080, 690, 460, 150, "", { col: C.text2 }); T(ctx, "pelaku:", 1180, 785, 44, { weight: 700, color: C.text2, align: "center" }); T(ctx, "?", 1420, 800, 100, { align: "center", weight: 900, color: C.amber }); });
  };

  function jendela(ctx, l, t, gap, dots, lab) { return X.jendelaPatch(ctx, 200, 1660, 560, { gap, dots, label: lab }); }
  S.b4_8 = function (ctx, b, l, t) {
    jendela(ctx, l, t, lerp(0.3, 1, eio(ramp(l, 0.2, 1.2))), []);
    U.muncul(ctx, l, U.at(b, "Berapa lama"), 960, 180, () => X.jam(ctx, 960, 180, 1, t));
  };
  const DOTS = (() => { const r = D.rng(11); return Array.from({ length: 260 }, () => [r(), (r() - 0.5) * 1.9, r()]); })();
  function hari(ctx, j, l, ts) { const a = j.a, bx = j.b; [["Hari 0", 0, ts[0]], ["Hari 1", 0.25, ts[1]], ["Hari 4", 1, ts[2]]].forEach(([s, u, t0], i) => {
    if (t0 == null || l < t0) return; const x = lerp(a, bx, u); ctx.strokeStyle = U.rgba(C.text2, 0.6); ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(x, 410); ctx.lineTo(x, 820); ctx.stroke(); ctx.setLineDash([]);
    T(ctx, s, x, 880, 44, { align: "center", weight: 800, color: i === 2 ? C.red : i === 1 ? C.amber : C.text }); }); }
  S.b4_9 = function (ctx, b, l, t) {
    const tPC = U.at(b, "Saat celah"), tSat = U.at(b, "dalam satu hari");
    const j = jendela(ctx, l, t, 1, l > tSat ? [[0.25, 0.1]] : [], "JENDELA PATCH · PAPERCUT");
    hari(ctx, j, l, [tPC, tSat - 0.3, null]);
    U.sumber(ctx, "Sumber: Google Threat Intelligence Group");
    U.muncul(ctx, l, 0.3, 960, 170, () => U.pill(ctx, "kasus Agustus · software pencetakan", 960, 170, { size: 44, col: C.php }));
    if (l > tPC) U.pill(ctx, l > tSat ? "Hari 1: exploit sudah berfungsi" : "Hari 0: celah diumumkan", 960, 280, { size: 44, col: l > tSat ? C.amber : C.text2 });
  };
  S.b4_10 = function (ctx, b, l, t) {
    const tRat = U.at(b, "ratusan organisasi"), n = Math.floor(lerp(1, 260, eio(ramp(l, 0.5, Math.max(1, tRat)))));
    const j = jendela(ctx, l, t, 1, DOTS.slice(0, n).map(d => [d[0] * 0.98 + 0.01, d[1] * 0.5]), "JENDELA PATCH · PAPERCUT");
    hari(ctx, j, l, [0, 0, 0.3]);
    U.pill(ctx, l > tRat ? "Hari 4: ratusan organisasi diserang" : "Hari 4", 960, 280, { size: 44, col: C.red });
    U.sumber(ctx, "Sumber: Google Threat Intelligence Group");
  };

  S.b4_11 = function (ctx, b, l, t) {
    U.judul(ctx, "Java4Shell: log server", l, 0.1, { y: 150, col: C.red, mono: true });
    const f = X.windowFrame(ctx, 160, 210, 1600, 660, { title: "access.log", fill: C.termBg });
    ctx.save(); ctx.beginPath(); ctx.rect(f.x - 40, f.y, f.w + 80, f.h - 6); ctx.clip();
    const sc = l * 46, r = D.rng(5), rows = [];
    for (let i = 0; i < 40; i++) { const bad = i % 5 === 3; rows.push({ ip: `10.${Math.floor(r() * 250)}.${Math.floor(r() * 250)}.${Math.floor(r() * 250)}`, p: bad ? "POST /api/import" : ["GET /", "GET /login", "GET /assets/app.css", "GET /dashboard"][i % 4], bad }); }
    rows.forEach((w, i) => { const y = f.y + 70 + i * 54 - sc % (54 * 20); if (y < f.y + 20 || y > f.y + f.h + 40) return;
      if (w.bad) { ctx.fillStyle = U.rgba(C.red, 0.18); ctx.fillRect(f.x - 20, y - 38, f.w + 40, 52); }
      T(ctx, w.ip, f.x, y, 32, { mono: true, weight: 500, color: C.dim }); T(ctx, w.p, f.x + 360, y, 32, { mono: true, weight: 600, color: w.bad ? C.red : C.text2 });
      if (w.bad) { ctx.fillStyle = U.rgba(C.red, 0.35); U.rr(ctx, f.x + 760, y - 26, 520, 30, 8); ctx.fill(); T(ctx, "percobaan serangan", f.x + 1500, y, 30, { align: "right", weight: 800, color: C.red }); }
      else T(ctx, "200", f.x + 760, y, 32, { mono: true, weight: 600, color: C.term }); });
    ctx.restore();
    U.sumber(ctx, "Sumber: The Hacker News (watchTowr, Previdian) · log ilustrasi");
    if (l > U.at(b, "beberapa hari")) U.pill(ctx, "beberapa hari setelah diumumkan", 960, 920 - 20, { size: 44, col: C.amber });
  };

  S.b4_12 = function (ctx, b, l, t) {
    const tSem = U.at(b, "makin sempit"), gap = lerp(1, 0.45, eio(ramp(l, tSem - 1.2, 1.6)));
    jendela(ctx, l, t, gap, DOTS.slice(0, 60).map(d => [d[0] * 0.98 + 0.01, d[1] * 0.5]));
    U.muncul(ctx, l, U.at(b, "hitungan hari") - 0.2, 960, 180, () => X.jam(ctx, 960, 180, 1, t, "hitungan hari"));
  };
  S.b4_13 = function (ctx, b, l, t) {
    const tTung = U.at(b, "Apakah"), fl = l < tTung ? 0.5 + 0.5 * Math.sin(l * 12) : Math.max(0, 1 - (l - tTung) * 1.2);
    ctx.fillStyle = U.rgba(C.red, 0.22 * fl); ctx.fillRect(0, 0, W, HH);
    U.muncul(ctx, l, 0.1, 960, 380, () => X.cap(ctx, "KRITIS", 960, 380, -0.05, C.red, 110), { k0: 1.5 });
    U.muncul(ctx, l, tTung + 0.5, 960, 720, () => T(ctx, "Harus panik?", 960, 740, 96, { align: "center", weight: 900, color: C.text }));
  };

  U.reg(4, S);
})(typeof window !== "undefined" ? window : globalThis);
