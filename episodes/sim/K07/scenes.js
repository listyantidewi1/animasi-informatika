/* K07 Simulasi konsep: token berjalan di flowchart penentu predikat (dua belah ketupat bertingkat).
   Memakai pembantu gambar D8.3 (alur.js: node, arrow, token, along, pseudo). Flowchart di kiri (x 110–1190),
   papan variabel / kondisi / output di kanan (x 1220–1820). Semua gambar di atas y 800 (kartu narasi mulai y≈841). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Q = K.alur, L = K.layar;
  const { rr, text, wrap, para, card, kiko, ease, clamp, lerp } = H;
  const GOLD = "#E0B04B", PURPLE = "#8E6BBF";

  // ---------- data variasi ----------
  const VARS = [{ n: 78 }, { n: 92 }, { n: 70 }, { n: 85 }, { n: 70, ge: true }];
  const PRED = { p1: "SANGAT BAIK", p2: "LULUS", p3: "REMEDI" };
  const PCOL = { p1: C.good, p2: C.kiko, p3: C.bad };
  function route(v) {   // daftar simpul yang dilewati
    const c1 = v.n > 85, c2 = v.ge ? v.n >= 70 : v.n > 70;
    const r = ["mulai", "baca", "dec1"];
    if (c1) r.push("p1"); else { r.push("dec2"); r.push(c2 ? "p2" : "p3"); }
    r.push("tulis", "selesai");
    return { r, c1, c2, pred: c1 ? "p1" : c2 ? "p2" : "p3", decs: c1 ? 1 : 2 };
  }

  // ---------- geometri flowchart ----------
  const X1 = 330, X2 = 700, X3 = 1020;
  const P = { mulai: [X1, 175], baca: [X1, 262], dec1: [X1, 385], dec2: [X2, 385], p1: [X1, 530], p2: [X2, 530], p3: [X3, 530], tulis: [X2, 660], selesai: [X2, 768] };
  // titik belok antara dua simpul berurutan (selain garis lurus)
  const VIA = { "dec2>p3": [[X3, 385]], "p1>tulis": [[X1, 660]], "p3>tulis": [[X3, 660]] };
  const legPts = (a, b) => [P[a], ...(VIA[a + ">" + b] || []), P[b]];
  // panah: kunci "a>b"
  const ARROWS = ["mulai>baca", "baca>dec1", "dec1>p1", "dec1>dec2", "dec2>p2", "dec2>p3", "p1>tulis", "p2>tulis", "p3>tulis", "tulis>selesai"];

  function flow(ctx, st = {}) {
    // st: hl (simpul aktif), lit (Set panah yang sudah dilewati), seen (Set simpul yang sudah dilewati), ge (kondisi ≥), dim (Set simpul redup), cond2 (label khusus)
    const lit = st.lit || new Set(), dim = st.dim || new Set(), on = k => st.hl === k;
    const o = k => ({ hl: on(k), dim: dim.has(k) });
    const n = {};
    const lab2 = st.cond2 || (st.ge ? "nilai ≥ 70?" : "nilai > 70?");
    // panah dulu (di bawah simpul)
    const A = (pts, key, opt = {}) => Q.arrow(ctx, pts, { on: lit.has(key), ...opt });
    A([[X1, 200], [X1, 233]], "mulai>baca");
    A([[X1, 289], [X1, 330]], "baca>dec1");
    A([[X1, 440], [X1, 497]], "dec1>p1", { label: "ya", dx: -30, dy: 12 });
    A([[X1 + 135, 385], [X2 - 137, 385]], "dec1>dec2", { label: "tidak", dy: -14 });
    A([[X2, 440], [X2, 497]], "dec2>p2", { label: "ya", dx: -30, dy: 12 });
    A([[X2 + 135, 385], [X3, 385], [X3, 497]], "dec2>p3", { label: "tidak", dy: -14 });
    A([[X1, 563], [X1, 660], [X2 - 134, 660]], "p1>tulis");
    A([[X2, 563], [X2, 630]], "p2>tulis");
    A([[X3, 563], [X3, 660], [X2 + 134, 660]], "p3>tulis");
    A([[X2, 690], [X2, 741]], "tulis>selesai");
    n.mulai = Q.node(ctx, "term", X1, 175, 200, 50, "MULAI", o("mulai"));
    n.baca = Q.node(ctx, "io", X1, 262, 260, 54, "baca nilai", o("baca"));
    n.dec1 = Q.node(ctx, "dec", X1, 385, 270, 110, "nilai > 85?", { ...o("dec1"), size: 25 });
    n.dec2 = Q.node(ctx, "dec", X2, 385, 270, 110, lab2, { ...o("dec2"), size: 25 });
    n.p1 = Q.node(ctx, "proc", X1, 530, 350, 64, "predikat ← SANGAT BAIK", { ...o("p1"), size: 22 });
    n.p2 = Q.node(ctx, "proc", X2, 530, 260, 64, "predikat ← LULUS", { ...o("p2"), size: 22 });
    n.p3 = Q.node(ctx, "proc", X3, 530, 260, 64, "predikat ← REMEDI", { ...o("p3"), size: 22 });
    n.tulis = Q.node(ctx, "io", X2, 660, 290, 58, "tulis predikat", o("tulis"));
    n.selesai = Q.node(ctx, "term", X2, 768, 200, 50, "SELESAI", o("selesai"));
    return n;
  }
  // label simpul digambar ulang di atas token (bertepi putih) supaya tetap terbaca saat token berhenti di simpul itu
  const LABEL = { mulai: ["MULAI", 24], baca: ["baca nilai", 24], dec1: ["nilai > 85?", 25], tulis: ["tulis predikat", 24], selesai: ["SELESAI", 24],
    p1: ["predikat ← SANGAT BAIK", 22], p2: ["predikat ← LULUS", 22], p3: ["predikat ← REMEDI", 22] };
  function labelOver(ctx, pos, ge) {
    Object.keys(P).forEach(k => {
      if (Math.hypot(P[k][0] - pos[0], P[k][1] - pos[1]) > 60) return;
      const [s, size] = k === "dec2" ? [ge ? "nilai ≥ 70?" : "nilai > 70?", 25] : LABEL[k];
      ctx.save(); ctx.font = `800 ${size}px Inter`; ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = "rgba(255,255,255,0.92)"; ctx.lineWidth = 7;
      ctx.strokeText(s, P[k][0], P[k][1] + size * 0.36); ctx.restore();
      text(ctx, s, P[k][0], P[k][1] + size * 0.36, size, { align: "center", weight: 800 });
    });
  }
  const bg = ctx => card(ctx, 110, 125, 1080, 690, { fill: "#FFFFFF", r: 24 });

  // ---------- panel kanan ----------
  function panel(ctx, title, x, y, w, h) { card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 }); text(ctx, title, x + 26, y + 44, 24, { weight: 900, color: C.accentDark }); }
  function varBox(ctx, x, y, name, val, flash, color) {
    // label + kotak isi; flash 0..1 = kilau sesudah diisi
    text(ctx, name, x, y + 50, 32, { weight: 900, color: C.ink2 });
    const bx = x + 190, bw = 330, bh = 74;
    if (flash > 0) { ctx.save(); ctx.globalAlpha = flash; ctx.fillStyle = "rgba(242,177,52,0.45)"; rr(ctx, bx - 10, y - 10, bw + 20, bh + 20, 18); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = val == null ? "#F4F6F5" : "#FFF9E0"; rr(ctx, bx, y, bw, bh, 14); ctx.fill();
    ctx.strokeStyle = val == null ? "#C9D4DB" : GOLD; ctx.lineWidth = 4; rr(ctx, bx, y, bw, bh, 14); ctx.stroke();
    text(ctx, val == null ? "?" : String(val), bx + bw / 2, y + 52, val != null && String(val).length > 8 ? 32 : 40, { align: "center", weight: 900, color: val == null ? C.muted : (color || C.ink) });
  }
  function board(ctx, s, l) {
    // s: nilai, pred, tN (waktu diisi), tP, conds [{txt, ok, t}], out, tO
    const fl = t0 => t0 == null ? 0 : clamp(1 - (l - t0) / 1.0, 0, 1) * (l >= t0 ? 1 : 0);
    panel(ctx, "PAPAN VARIABEL", 1220, 125, 600, 250);
    varBox(ctx, 1250, 180, "nilai", s.nilai, fl(s.tN));
    varBox(ctx, 1250, 278, "predikat", s.pred ? PRED[s.pred] : null, fl(s.tP), s.pred ? PCOL[s.pred] : null);
    panel(ctx, "KONDISI YANG DIBACA", 1220, 393, 600, 230);
    (s.conds || []).forEach((c, i) => {
      const y = 455 + i * 78, u = ease((l - c.t) / 0.35);
      ctx.save(); ctx.globalAlpha = u;
      ctx.fillStyle = c.ok ? C.goodBg : C.badBg; rr(ctx, 1244, y, 552, 64, 12); ctx.fill();
      text(ctx, c.txt, 1266, y + 44, 30, { weight: 900 });
      text(ctx, c.ok ? "ya" : "tidak", 1774, y + 44, 30, { align: "right", weight: 900, color: c.ok ? C.good : C.bad });
      ctx.restore();
    });
    if (!(s.conds || []).length) text(ctx, "belum ada", 1520, 530, 26, { align: "center", weight: 700, color: C.muted });
    // output: layar kecil gelap
    panel(ctx, "OUTPUT", 1220, 641, 600, 160);
    ctx.fillStyle = "#1F2A33"; rr(ctx, 1244, 700, 552, 80, 12); ctx.fill();
    if (s.out) { const u = ease((l - s.tO) / 0.35); ctx.save(); ctx.globalAlpha = u; text(ctx, s.out, 1520, 754, 38, { align: "center", weight: 900, color: "#BFF2CF" }); ctx.restore(); }
    else text(ctx, "_", 1270, 752, 34, { weight: 800, color: "#7E9AA8" });
  }

  // ---------- teks kondisi ----------
  const condTxt = (v, which) => which === 1 ? `${v.n} > 85?` : (v.ge ? `${v.n} ≥ 70?` : `${v.n} > 70?`);

  // ---------- satu fase perjalanan token ----------
  // fase 1: mulai, baca, dec1 · fase 2: sisa simpul sampai selesai. b.at = waktu tiba (pecahan b.audio) tiap simpul fase ini, b.dec = waktu keputusan belah ketupat.
  function runState(v, b, l) {
    const R = route(v), a = b.audio || b.dur;
    const ph1 = R.r.slice(0, 3), ph2 = R.r.slice(2);   // fase 2 dimulai dari dec1 (sudah diputuskan)
    const stops = b.fase === 1 ? ph1 : ph2.slice(1);
    const ats = (b.tt || b.at || stops.map((_, i) => i / stops.length)).map(f => f * a);
    const st = { lit: new Set(), seen: new Set(), conds: [], nilai: null, pred: null, out: null };
    const ev = (k, t) => {   // simpul k tercapai pada waktu t (waktu lokal; -99 = sebelum beat)
      st.seen.add(k);
      if (k === "baca") { st.nilai = v.n; st.tN = t; }
      if (k === "p1" || k === "p2" || k === "p3") { st.pred = k; st.tP = t; }
      if (k === "tulis") { st.out = PRED[R.pred]; st.tO = t; }
    };
    const decide = (k, t) => {   // keputusan di belah ketupat k pada waktu t
      if (k === "dec1") { st.conds.push({ txt: condTxt(v, 1), ok: R.c1, t }); st.lit.add(R.c1 ? "dec1>p1" : "dec1>dec2"); }
      if (k === "dec2") { st.conds.push({ txt: condTxt(v, 2), ok: R.c2, t }); st.lit.add(R.c2 ? "dec2>p2" : "dec2>p3"); }
    };
    // sejarah sebelum beat ini
    if (b.fase === 2) { ph1.forEach((k, i) => { ev(k, -99); if (i) st.lit.add(ph1[i - 1] + ">" + k); }); decide("dec1", -99); }
    // fase ini
    let pos = P[stops[0]], prev = b.fase === 2 ? "dec1" : null, hl = stops[0];
    stops.forEach((k, i) => {
      const t = ats[i], from = i ? stops[i - 1] : prev;
      if (from) {
        const md = Math.min(1.1, Math.max(0.5, (t - (i ? ats[i - 1] : 0)) * 0.8)), u = clamp((l - (t - md)) / md, 0, 1);
        if (l >= t - md) { pos = Q.along(legPts(from, k), ease(u)); hl = u >= 1 ? k : from; if (u >= 1) st.lit.add(from + ">" + k); }
      }
      if (l >= t) ev(k, t);
      if ((k === "dec1" || k === "dec2")) { const td = (b.dec != null ? b.dec : 0.9) * a; if (l >= td) decide(k, td); }
    });
    if (b.fase === 2 && l < ats[0] - 1.1) hl = "dec1";
    st.hl = hl; st.pos = pos;
    return st;
  }

  function runScene(ctx, b, l, opt = {}) {
    const v = VARS[b.v]; bg(ctx);
    const st = runState(v, b, l);
    const dim = new Set();
    if (b.skip && l > (b.audio || b.dur) * 0.4) { ["dec2", "p2", "p3"].forEach(k => dim.add(k)); }
    flow(ctx, { hl: st.hl, lit: st.lit, ge: v.ge, dim });
    if (b.skip && l > (b.audio || b.dur) * 0.4) {
      const u = ease((l - (b.audio || b.dur) * 0.4) / 0.5); ctx.save(); ctx.globalAlpha = u;
      L.callout(ctx, 800, 210, "tidak dibaca", X2, 330, { color: C.bad, fill: C.badBg }); ctx.restore();
    }
    Q.token(ctx, st.pos[0], st.pos[1], { r: 22, color: opt.color || C.accent });
    labelOver(ctx, st.pos, v.ge);
    tag(ctx, v);
    board(ctx, st, l);
  }
  // label variasi di pojok flowchart
  function tag(ctx, v, label) {
    card(ctx, 870, 145, 300, 64, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 });
    text(ctx, label || `input: nilai = ${v.n}`, 1020, 188, 28, { align: "center", weight: 900 });
  }
  // hasil akhir sebuah variasi (seluruh jalan menyala)
  function finalState(v) {
    const R = route(v), lit = new Set();
    R.r.forEach((k, i) => { if (i) lit.add(R.r[i - 1] + ">" + k); });
    return { R, lit };
  }

  // ---------- tabel percobaan ----------
  function table(ctx, x, y, w, upto, l, opt = {}) {
    const cols = [0, 0.26, 0.6], rh = opt.rh || 66;
    panel(ctx, opt.title || "CATATAN PERCOBAAN", x, y, w, 90 + rh * (opt.rows || 5) + 10);
    const hy = y + 70;
    ["nilai", "ketupat dibaca", "predikat"].forEach((s, i) => text(ctx, s, x + 26 + cols[i] * w, hy + 22, 22, { weight: 800, color: C.ink2 }));
    for (let i = 0; i <= upto; i++) {
      const v = VARS[i], R = route(v), yy = hy + 38 + i * rh, fresh = i === upto && opt.fresh !== false;
      const u = fresh ? ease((l - 0.4) / 0.5) : 1; ctx.save(); ctx.globalAlpha = u;
      ctx.fillStyle = fresh ? "#FFF3D6" : (i % 2 ? "#F7FAF8" : "#FFFFFF"); rr(ctx, x + 12, yy, w - 24, rh - 8, 10); ctx.fill();
      text(ctx, String(v.n) + (v.ge ? " (≥)" : ""), x + 26, yy + 40, 28, { weight: 900 });
      text(ctx, String(R.decs), x + 26 + cols[1] * w + 60, yy + 40, 28, { weight: 900, align: "center" });
      text(ctx, PRED[R.pred], x + 26 + cols[2] * w, yy + 40, 26, { weight: 900, color: PCOL[R.pred] });
      ctx.restore();
    }
  }

  // ---------- garis bilangan ----------
  function numberLine(ctx, x, y, w, ge, marks, title) {
    const lo = 60, hi = 100, X = n => x + (n - lo) / (hi - lo) * w;
    text(ctx, title, x, y - 34, 26, { weight: 900, color: C.ink2 });
    const cut2 = ge ? 69.5 : 70.5;
    [[lo, cut2, C.bad, "REMEDI"], [cut2, 85.5, C.kiko, "LULUS"], [85.5, hi, C.good, "SANGAT BAIK"]].forEach(([a, b2, c, s]) => {
      ctx.fillStyle = c; ctx.globalAlpha = 0.18; ctx.fillRect(X(a), y, X(b2) - X(a), 56); ctx.globalAlpha = 1;
      ctx.fillStyle = c; ctx.fillRect(X(a), y + 52, X(b2) - X(a), 6);
      text(ctx, s, (X(a) + X(b2)) / 2, y + 36, 24, { align: "center", weight: 900, color: c });
    });
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 2;
    for (let n = lo; n <= hi; n += 5) { ctx.beginPath(); ctx.moveTo(X(n), y + 58); ctx.lineTo(X(n), y + 70); ctx.stroke(); text(ctx, String(n), X(n), y + 96, 20, { align: "center", weight: 700, color: C.ink2 }); }
    marks.forEach(([n, hl]) => { ctx.fillStyle = hl ? C.accent : C.ink; ctx.beginPath(); ctx.arc(X(n), y + 58, hl ? 13 : 10, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke(); });
  }

  Object.assign(K.SCENES, {
    k7_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 650);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menelusuri flowchart dengan token", "mencatat isi variabel di papan", "menebak cabang yang dipilih", "menguji nilai batas"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      // flowchart mini dengan token
      const mx = 1390;
      Q.node(ctx, "term", mx, 300, 160, 44, "MULAI", { size: 20 });
      Q.node(ctx, "dec", mx, 420, 220, 100, "nilai > 70?", { size: 22 });
      Q.node(ctx, "proc", mx - 150, 570, 170, 54, "LULUS", { size: 20 }); Q.node(ctx, "proc", mx + 150, 570, 170, 54, "REMEDI", { size: 20 });
      Q.arrow(ctx, [[mx, 322], [mx, 370]], {}); Q.arrow(ctx, [[mx - 110, 420], [mx - 150, 420], [mx - 150, 543]], { on: true, label: "ya", dy: -12 }); Q.arrow(ctx, [[mx + 110, 420], [mx + 150, 420], [mx + 150, 543]], { label: "tidak", dy: -12 });
      const u = (l * 0.35) % 1, pos = Q.along([[mx, 300], [mx, 420], [mx - 150, 420], [mx - 150, 570]], u); Q.token(ctx, pos[0], pos[1], { r: 18 });
    },
    k7_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 650);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 560, 290, 800, 330, { fill: C.bg2, r: 22 });
      text(ctx, "D8.3", 960, 370, 60, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Flowchart dan Pseudocode Dasar", 960, 440, 40, { align: "center", weight: 800 });
      // empat bentuk kecil
      const sh = [["term", "oval"], ["proc", "kotak"], ["io", "jajar genjang"], ["dec", "belah ketupat"]];
      sh.forEach(([k, s], i) => { const x = 680 + i * 190; Q.node(ctx, k, x, 520, k === "dec" ? 110 : 130, k === "dec" ? 70 : 44, "", {}); text(ctx, s, x, 588, 20, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1600, 690, 110, 0, { wave: l });
    },
    k7_kenal(ctx, b, l) {
      bg(ctx); const a = b.audio || b.dur;
      const hl = l > a * 0.68 ? "dec2" : l > a * 0.36 ? "dec1" : null;
      flow(ctx, { hl });
      Q.pseudo(ctx, 1220, 125, 600, [
        { t: "baca nilai" }, { t: "JIKA nilai > 85 MAKA", hl: hl === "dec1" }, { t: "predikat ← SANGAT BAIK", ind: 1 },
        { t: "LAINNYA JIKA nilai > 70 MAKA", hl: hl === "dec2" }, { t: "predikat ← LULUS", ind: 1 }, { t: "LAINNYA" }, { t: "predikat ← REMEDI", ind: 1 }, { t: "tulis predikat" }], { rh: 64, size: 26, title: "PSEUDOCODE YANG SAMA" });
    },
    k7_kenal2(ctx, b, l) {
      bg(ctx); const a = b.audio || b.dur;
      const ph = l > a * 0.72 ? 2 : l > a * 0.08 ? 1 : 0;
      const n = flow(ctx, { hl: ph === 2 ? "tulis" : undefined });
      if (ph === 1) ["p1", "p2", "p3"].forEach(k => { const q = n[k]; ctx.strokeStyle = C.accent; ctx.lineWidth = 6; rr(ctx, q.cx - q.w / 2 - 8, q.cy - q.h / 2 - 8, q.w + 16, q.h + 16, 12); ctx.stroke(); });
      Q.pseudo(ctx, 1220, 125, 600, [
        { t: "baca nilai" }, { t: "JIKA nilai > 85 MAKA" }, { t: "predikat ← SANGAT BAIK", ind: 1, hl: ph === 1 },
        { t: "LAINNYA JIKA nilai > 70 MAKA" }, { t: "predikat ← LULUS", ind: 1, hl: ph === 1 }, { t: "LAINNYA" }, { t: "predikat ← REMEDI", ind: 1, hl: ph === 1 }, { t: "tulis predikat", hl: ph === 2 }], { rh: 64, size: 26, title: "PSEUDOCODE YANG SAMA" });
      if (l > a * 0.45) { const u = ease((l - a * 0.45) / 0.4); ctx.save(); ctx.globalAlpha = u; card(ctx, 1290, 700, 460, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "←  dibaca  \"diberi\"", 1520, 752, 32, { align: "center", weight: 900 }); ctx.restore(); }
    },
    k7_papan(ctx, b, l) {
      bg(ctx); const a = b.audio || b.dur;
      const n = flow(ctx, { hl: l > a * 0.76 ? "p2" : l > a * 0.55 ? "baca" : undefined });
      board(ctx, { conds: [] }, l);
      const u1 = l > a * 0.55, u2 = l > a * 0.76;
      ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = C.accentDark; ctx.lineWidth = 4;
      if (u1) { ctx.beginPath(); ctx.moveTo(n.baca.cx + 130, n.baca.cy); ctx.bezierCurveTo(900, 262, 1050, 217, 1238, 217); ctx.stroke(); }
      if (u2) { ctx.beginPath(); ctx.moveTo(n.p2.cx + 130, n.p2.cy); ctx.bezierCurveTo(1000, 470, 1080, 315, 1238, 315); ctx.stroke(); }
      ctx.restore();
      if (l > a * 0.25) { const u = ease((l - a * 0.25) / 0.4); ctx.save(); ctx.globalAlpha = u; L.callout(ctx, 780, 145, "variabel = kotak berlabel yang menyimpan nilai", null, null, { maxW: 380, size: 24 }); ctx.restore(); }
    },
    k7_aturan(ctx, b, l) {
      bg(ctx); const a = b.audio || b.dur;
      // token berkeliling sebagai contoh
      const path = [P.mulai, P.baca, P.dec1, P.dec2, P.p2, P.tulis, P.selesai];
      const u = clamp(l / (a * 0.95), 0, 1), lit = new Set();
      const legs = ["mulai>baca", "baca>dec1", "dec1>dec2", "dec2>p2", "p2>tulis", "tulis>selesai"]; legs.forEach((k, i) => { if (u > (i + 1) / legs.length) lit.add(k); });
      flow(ctx, { lit });
      const pos = Q.along(path, u); Q.token(ctx, pos[0], pos[1], { r: 22 }); labelOver(ctx, pos, false);
      panel(ctx, "ATURAN TOKEN", 1220, 125, 600, 640);
      [["1", "Selalu mengikuti panah."], ["2", "Di belah ketupat: bandingkan isi papan, pilih panah ya atau tidak."], ["3", "Berhenti di SELESAI."]].forEach(([k, s], i) => {
        const t0 = a * [0.2, 0.38, 0.8][i]; if (l < t0) return; const e = ease((l - t0) / 0.4); ctx.save(); ctx.globalAlpha = e;
        const y = 200 + i * 180; card(ctx, 1244, y, 552, 160, { fill: C.bg2, r: 16 });
        Q.token(ctx, 1290, y + 50, { r: 22 }); text(ctx, k, 1290, y + 59, 24, { align: "center", weight: 900, color: "#fff" });
        para(ctx, s, 1330, y + 58, 30, 440, { weight: 800, lh: 1.25 }); ctx.restore();
      });
    },
    k7_tanya(ctx, b, l) { tanya(ctx, b, l, false); },
    k7_tebak(ctx, b, l) { tanya(ctx, b, l, true); },
    k7_jalan(ctx, b, l) { runScene(ctx, b, l); },
    k7_hasil(ctx, b, l) {
      const v = VARS[b.v], F = finalState(v); bg(ctx);
      flow(ctx, { hl: "selesai", lit: F.lit, ge: v.ge });
      Q.token(ctx, P.selesai[0], P.selesai[1], { r: 22 }); labelOver(ctx, P.selesai, v.ge);
      tag(ctx, v, `nilai ${v.n} → ${PRED[F.R.pred]}`);
      table(ctx, 1220, 125, 600, b.v, l);
    },
    k7_ubah(ctx, b, l) {
      bg(ctx); const a = b.audio || b.dur, u = ease((l - a * 0.45) / 0.6);
      flow(ctx, { hl: "dec2", cond2: u < 0.5 ? "nilai > 70?" : "nilai ≥ 70?" });
      if (u > 0 && u < 1) { ctx.save(); ctx.globalAlpha = Math.sin(u * Math.PI); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(X2, 385, 70, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      panel(ctx, "KONDISI KEDUA", 1220, 125, 600, 640);
      card(ctx, 1250, 200, 540, 120, { fill: C.bg2, r: 16 }); text(ctx, "tadi", 1280, 240, 22, { weight: 800, color: C.ink2 });
      text(ctx, "nilai > 70?", 1520, 296, 44, { align: "center", weight: 900 });
      text(ctx, "lebih dari", 1520, 350, 24, { align: "center", weight: 700, color: C.ink2 });
      if (u > 0) {
        ctx.save(); ctx.globalAlpha = u;
        card(ctx, 1250, 400, 540, 140, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 16 }); text(ctx, "sekarang", 1280, 440, 22, { weight: 800, color: C.accentDark });
        text(ctx, "nilai ≥ 70?", 1520, 500, 48, { align: "center", weight: 900 });
        text(ctx, "lebih dari atau sama dengan", 1520, 580, 26, { align: "center", weight: 800, color: C.accentDark });
        ctx.restore();
      }
      if (l > a * 0.8) { const e = ease((l - a * 0.8) / 0.4); ctx.save(); ctx.globalAlpha = e; card(ctx, 1250, 620, 540, 110, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "≥", 1320, 696, 64, { align: "center", weight: 900, color: C.kiko }); text(ctx, "garis di bawah = boleh sama", 1380, 688, 26, { weight: 800 }); ctx.restore(); }
    },
    k7_banding(ctx, b, l) {
      card(ctx, 110, 125, 1080, 690, { fill: "#FFFFFF", r: 24 });
      const a = b.audio || b.dur;
      text(ctx, "Predikat untuk setiap nilai", 150, 190, 30, { weight: 900, color: C.accentDark });
      numberLine(ctx, 170, 290, 960, false, [[78], [92], [70, true], [85, true]], "Flowchart awal: nilai > 70?");
      if (l > a * 0.12) { const u = ease((l - a * 0.12) / 0.5); ctx.save(); ctx.globalAlpha = u; numberLine(ctx, 170, 520, 960, true, [[70, true]], "Flowchart baru: nilai ≥ 70?"); ctx.restore(); }
      if (l > a * 0.45) { const u = ease((l - a * 0.45) / 0.4); ctx.save(); ctx.globalAlpha = u; card(ctx, 170, 690, 960, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, "uji di bawah batas · tepat di batas · di atas batas", 650, 748, 30, { align: "center", weight: 900 }); ctx.restore(); }
      table(ctx, 1220, 125, 600, 4, l, { fresh: false });
    },
    k7_latihan(ctx, b, l) {
      const a = b.audio || b.dur;
      // ponsel berisi halaman latihan D8.3
      const px = 230, py = 122, pw = 440, ph = 700;
      ctx.fillStyle = "#2B3A44"; rr(ctx, px, py, pw, ph, 44); ctx.fill();
      ctx.fillStyle = "#F4F7F5"; rr(ctx, px + 16, py + 20, pw - 32, ph - 40, 30); ctx.fill();
      ctx.save(); rr(ctx, px + 16, py + 20, pw - 32, ph - 40, 30); ctx.clip();
      const x0 = px + 34, w0 = pw - 68;
      text(ctx, "Latihan: bentuk, token,", x0, py + 72, 22, { weight: 900 }); text(ctx, "dan pseudocode", x0, py + 100, 22, { weight: 900 });
      const step = l > a * 0.18 ? (l > a * 0.36 ? (l > a * 0.52 ? 3 : 2) : 1) : 0;
      ["1 Pasangkan bentuk", "2 Jalankan token", "3 Susun pseudocode"].forEach((s, i) => {
        const y = py + 122 + i * 46, on = i === 1 && step >= 1;
        ctx.fillStyle = on ? "#DCEBF2" : "#FFFFFF"; rr(ctx, x0, y, w0, 38, 10); ctx.fill(); ctx.strokeStyle = on ? C.kiko : "#C9D4DB"; ctx.lineWidth = 2.5; rr(ctx, x0, y, w0, 38, 10); ctx.stroke();
        text(ctx, s, x0 + 14, y + 26, 19, { weight: 800, color: on ? C.kikoDark : C.ink });
      });
      if (step >= 1) {
        const y = py + 270;
        text(ctx, "nilai =", x0, y + 30, 22, { weight: 900 });
        ctx.fillStyle = "#FFFFFF"; rr(ctx, x0 + 90, y, 110, 44, 8); ctx.fill(); ctx.strokeStyle = step === 2 ? C.accent : "#9AA8B1"; ctx.lineWidth = 3; rr(ctx, x0 + 90, y, 110, 44, 8); ctx.stroke();
        text(ctx, step >= 2 ? "85" : "78", x0 + 145, y + 31, 24, { align: "center", weight: 800 });
        // flowchart mini halaman
        const nd = (s, x, yy, w, k, hi) => { ctx.fillStyle = hi === "right" ? C.goodBg : k === "dec" ? "#FFF9E0" : k === "term" ? "#DCEBF2" : "#EDE6F7"; rr(ctx, x - w / 2, yy, w, 30, k === "term" ? 15 : 6); ctx.fill(); ctx.strokeStyle = hi === "right" ? C.good : "#9AA8B1"; ctx.lineWidth = hi ? 3 : 1.5; rr(ctx, x - w / 2, yy, w, 30, k === "term" ? 15 : 6); ctx.stroke(); text(ctx, s, x, yy + 21, 14, { align: "center", weight: 800 }); };
        const cx = px + pw / 2, fy = py + 326;
        nd("MULAI", cx, fy, 100, "term"); nd("baca nilai", cx, fy + 36, 120, "io"); nd("nilai > 85?", cx, fy + 72, 130, "dec");
        text(ctx, "ya", cx - 95, fy + 120, 13, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "tidak", cx + 75, fy + 120, 13, { align: "center", weight: 800, color: C.ink2 });
        nd("tulis SANGAT BAIK", cx - 95, fy + 126, 160, "io"); nd("nilai > 70?", cx + 75, fy + 126, 140, "dec");
        text(ctx, "ya", cx + 10, fy + 174, 13, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "tidak", cx + 140, fy + 174, 13, { align: "center", weight: 800, color: C.ink2 });
        nd("tulis LULUS", cx + 10, fy + 180, 120, "io", step >= 3 ? "right" : null); nd("tulis REMEDI", cx + 140, fy + 180, 120, "io");
        nd("SELESAI", cx, fy + 228, 100, "term");
        if (step >= 3) { ctx.fillStyle = C.goodBg; rr(ctx, x0, fy + 272, w0, 72, 10); ctx.fill(); para(ctx, "Tepat: 85 tidak lebih dari 85, tetapi lebih dari 70 → LULUS.", x0 + 12, fy + 299, 17, w0 - 24, { weight: 700, color: "#1F6B3D", lh: 1.3 }); }
      }
      ctx.restore();
      // pointer
      const tgt = step === 0 ? [px + pw / 2, py + 400] : step === 1 ? [px + 200, py + 190] : step === 2 ? [px + 228, py + 304] : [px + pw / 2 + 50, py + 526];
      const tPrev = step === 0 ? 0 : [0, a * 0.18, a * 0.36, a * 0.52][step], c = clamp((l - tPrev) / 0.6, 0, 1);
      L.cursor(ctx, tgt[0], tgt[1], { click: step > 0 ? c : 0 });
      // kanan: alamat + tugas
      card(ctx, 760, 150, 1000, 300, { fill: "#FFFFFF", r: 22 });
      text(ctx, "HALAMAN LATIHAN D8.3", 1260, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 860, 250, 800, 76, { fill: C.bg2, r: 14 }); text(ctx, "belajar-informatika.vercel.app/d83", 1260, 300, 34, { align: "center", weight: 900, color: C.kikoDark });
      text(ctx, "pilih 2 Jalankan token → ketik nilai → ketuk kotak output", 1260, 395, 26, { align: "center", weight: 700, color: C.ink2, fit: 920 });
      card(ctx, 760, 480, 1000, 300, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Tugas nyata", 1260, 540, 32, { align: "center", weight: 900 });
      para(ctx, "Uji nilai 70, 71, 85, dan 86. Tebak dulu, lalu catat jalannya di tabel seperti tabel percobaan tadi.", 1260, 600, 30, 860, { align: "center", weight: 700, lh: 1.3 });
    }
  });

  // pertanyaan "Menurutmu …?" + jeda menebak
  function tanya(ctx, b, l, timer) {
    const v = VARS[b.v]; bg(ctx);
    flow(ctx, { hl: "mulai", ge: v.ge });
    Q.token(ctx, P.mulai[0], P.mulai[1], { r: 22 }); labelOver(ctx, P.mulai, v.ge);
    tag(ctx, v);
    panel(ctx, "VARIASI " + (b.v + 1), 1220, 125, 600, 676);
    text(ctx, "input", 1520, 220, 26, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, `nilai = ${v.n}`, 1520, 300, 66, { align: "center", weight: 900 });
    if (v.ge) text(ctx, "kondisi kedua: nilai ≥ 70?", 1520, 350, 26, { align: "center", weight: 800, color: C.accentDark });
    para(ctx, "Menurutmu? " + (b.ask || "Predikat apa yang ditulis?"), 1520, 410, 30, 520, { align: "center", weight: 800, lh: 1.25 });
    ["SANGAT BAIK", "LULUS", "REMEDI"].forEach((s, i) => {
      const y = 500 + i * 92; card(ctx, 1290, y, 460, 74, { fill: C.bg2, stroke: "#CFDCD5", lw: 3, r: 14 });
      text(ctx, s, 1520, y + 48, 30, { align: "center", weight: 900, color: [C.good, C.kiko, C.bad][i] });
    });
    if (timer) { // lingkaran waktu menebak
      const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(1750, 190, 34, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1750, 190, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
      text(ctx, "?", 1750, 202, 34, { align: "center", weight: 900, color: C.accentDark });
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
