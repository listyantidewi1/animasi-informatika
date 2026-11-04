/* K24 Simulasi konsep: Dijkstra langkah demi langkah pada peta rekaan enam tempat (menit naik angkot).
   Kiri: peta (graph berbobot) dengan jarak sementara di atas tiap tempat. Kanan: tabel jarak/asal/status dan antrean prioritas.
   Mesin langkah dihitung di sini (K.k24.run) dan sudah dicek dengan Python heapq. Antrean prioritas ditampilkan secara konsep:
   tempat belum pasti yang jaraknya sudah diketahui, diurutkan dari yang terkecil.
   Kunci beat: start (A–F), closed ("DE" = jalan ditutup), extra ("AD" = angkot langsung 9 menit), ev [awal, akhir] (indeks langkah),
   cues [[indeks langkah, potongan narasi]], v (variasi), pilih, to (tujuan rute). Adegan k24_ (video) dan k24s_ (Short).
   Semua gambar penting di atas y≈830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const NODES = { A: ["Sekolah", 240, 525], B: ["Pasar", 480, 365], C: ["Masjid", 480, 690], D: ["Puskesmas", 760, 365], E: ["Alun-alun", 760, 690], F: ["Stasiun", 1000, 525] };
  const IDS = Object.keys(NODES), NM = id => NODES[id][0];
  const BASE = [["A", "B", 4], ["A", "C", 2], ["B", "C", 1], ["B", "D", 5], ["C", "D", 8], ["C", "E", 10], ["D", "E", 2], ["D", "F", 6], ["E", "F", 3]];
  const EXTRA = { AD: ["A", "D", 9] };
  const PURPLE = "#8E6BBF";
  const cfgOf = b => ({ start: b.dari || "A", closed: b.closed || null, extra: b.extra || null });
  const edgesOf = cfg => BASE.filter(([a, c]) => a + c !== cfg.closed).concat(cfg.extra ? [EXTRA[cfg.extra]] : []);
  const INF = Infinity, show = v => (v === INF ? "∞" : String(v));

  // ---------- mesin Dijkstra (antrean prioritas konsep) ----------
  const CACHE = {};
  function run(cfg) {
    const key = JSON.stringify(cfg); if (CACHE[key]) return CACHE[key];
    const E = edgesOf(cfg), adj = {}; IDS.forEach(i => adj[i] = []); E.forEach(([a, c, w]) => { adj[a].push([c, w]); adj[c].push([a, w]); });
    const dist = {}, via = {}, done = [], order = {}; let tick = 0; IDS.forEach(i => dist[i] = INF); dist[cfg.start] = 0; order[cfg.start] = tick++;
    const queue = () => IDS.filter(i => !done.includes(i) && dist[i] < INF).sort((p, q) => dist[p] - dist[q] || order[p] - order[q]);
    const snap = (o = {}) => ({ dist: { ...dist }, via: { ...via }, done: done.slice(), queue: queue(), ...o });
    const states = [], init = snap({ msg: "Mulai: " + NM(cfg.start) + " jaraknya 0, tempat lain belum tahu (∞).", col: C.ink });
    while (queue().length) {
      const u = queue()[0]; done.push(u);
      states.push(snap({ cur: u, pop: u, msg: `${NM(u)} keluar dari antrean: ${dist[u]} menit, pasti ✓`, col: C.good }));
      adj[u].forEach(([v, w]) => {
        if (done.includes(v)) return;
        const lewat = dist[u] + w, old = dist[v], better = lewat < old;
        if (better) { dist[v] = lewat; via[v] = u; if (old === INF) order[v] = tick++; }
        states.push(snap({ cur: u, chk: [u, v], upd: better ? v : null,
          msg: `lewat ${NM(u)}: ${dist[u]} + ${w} = ${lewat}` + (old === INF ? ` → ${NM(v)} = ${lewat}` : better ? ` < ${old} → ${NM(v)} diperbarui` : `, tidak lebih kecil dari ${old} → tetap`),
          col: better ? C.kikoDark : C.ink2 }));
      });
    }
    const fin = { ...states[states.length - 1], cur: null, chk: null, pop: null, msg: "Semua tempat sudah pasti.", col: C.good };
    return (CACHE[key] = { init, states, fin, adjE: E });
  }
  function routeTo(R, s, t) { const r = [t]; while (r[r.length - 1] !== s) r.push(R.fin.via[r[r.length - 1]]); return r.reverse(); }
  K.k24 = { run, routeTo, BASE };   // untuk pemeriksaan angka

  // ---------- waktu ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * A(b); };
  function evTimes(b, e0, e1) {
    const n = e1 - e0 + 1, a0 = lead(b) + 0.2, a1 = lead(b) + A(b) * 0.9;
    const anc = (b.cues || []).filter(([i, s]) => i >= e0 && i <= e1 && b.text.indexOf(s) >= 0).map(([i, s]) => [i - e0, at(b, s)]);
    if (!anc.length || anc[0][0] !== 0) anc.unshift([0, Math.min(a0, anc.length ? anc[0][1] - 0.3 : a0)]);
    const last = anc[anc.length - 1]; if (last[0] !== n - 1) anc.push([n - 1, Math.max(a1, last[1] + 0.5 * (n - 1 - last[0]))]);
    const T = []; for (let k = 0; k < anc.length - 1; k++) { const [i0, t0] = anc[k], [i1, t1] = anc[k + 1]; for (let i = i0; i < i1; i++) T[i] = lerp(t0, t1, (i - i0) / (i1 - i0)); } T[n - 1] = anc[anc.length - 1][1];
    return T;
  }
  function stateAt(b, l) {
    const R = run(cfgOf(b)), N = R.states.length, ev = b.ev || [0, N - 1], e0 = ev[0], e1 = Math.min(ev[1], N - 1), T = evTimes(b, e0, e1);
    let k = -1; T.forEach((t, i) => { if (l >= t) k = i; });
    if (k < 0) return { st: e0 ? { ...R.states[e0 - 1], chk: null, upd: null, pop: null } : R.init, since: 9, R };
    const st = R.states[e0 + k]; return { st: e0 + k === N - 1 && l > T[k] + 1.2 ? R.fin : st, since: l - T[k], R };
  }

  // ---------- gambar ----------
  const heading = (ctx, s, y = 205) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 900, fit: 1600 });
  const banner = (ctx, s, x, y, w, opt = {}) => { card(ctx, x, y, w, opt.h || 62, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 3, r: 14 }); text(ctx, s, x + w / 2, y + (opt.h || 62) / 2 + 9, opt.size || 26, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 30 }); };
  const same = (e, a, c) => e && ((e[0] === a && e[1] === c) || (e[0] === c && e[1] === a));
  function drawMap(ctx, st, o = {}) {
    const cfg = o.cfg || { start: "A" }, pulse = o.since != null ? clamp(1 - o.since / 0.8, 0, 1) : 0;
    const tree = st ? IDS.filter(i => st.done.includes(i) && st.via[i]).map(i => [i, st.via[i]]) : [];
    const all = BASE.map(e => [...e, e[0] + e[1] === cfg.closed ? "closed" : ""]).concat(cfg.extra ? [[...EXTRA[cfg.extra], "extra"]] : []);
    all.forEach(([a, c, w, kind]) => {
      const [, x1, y1] = NODES[a], [, x2, y2] = NODES[c];
      const onRoute = (o.route || []).some(e => same(e, a, c)), onTree = tree.some(e => same(e, a, c)), chk = st && same(st.chk, a, c);
      ctx.save(); ctx.lineCap = "round";
      if (kind === "closed") { ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.setLineDash([14, 12]); }
      else if (onRoute) { ctx.strokeStyle = C.accent; ctx.lineWidth = 13; }
      else if (chk) { ctx.strokeStyle = C.accent; ctx.lineWidth = 9 + 5 * pulse; }
      else if (onTree) { ctx.strokeStyle = C.good; ctx.lineWidth = 9; }
      else if (kind === "extra") { ctx.strokeStyle = PURPLE; ctx.lineWidth = 6; ctx.setLineDash([16, 10]); }
      else { ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; }
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
      if (o.weights === false) return;
      const f = kind === "extra" ? 0.62 : 0.5, mx = lerp(x1, x2, f), my = lerp(y1, y2, f);
      if (kind === "closed") { card(ctx, mx - 62, my - 21, 124, 42, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "✕ ditutup", mx, my + 8, 21, { align: "center", weight: 900, color: C.bad }); return; }
      const col = onRoute || chk ? C.accentDark : kind === "extra" ? PURPLE : onTree ? C.good : C.ink2;
      card(ctx, mx - 30, my - 21, 60, 42, { fill: "#fff", stroke: col, lw: 3, r: 12 }); text(ctx, String(w), mx, my + 9, 26, { align: "center", weight: 900, color: col });
    });
    IDS.forEach(id => {
      const [nm, x, y] = NODES[id], done = st && st.done.includes(id), cur = st && st.cur === id, start = cfg.start === id;
      const w = 172, h = 58;
      card(ctx, x - w / 2, y - h / 2, w, h, { fill: cur ? "#FFF3D6" : done ? C.goodBg : "#fff", stroke: cur ? C.accent : done ? C.good : start ? C.kikoDark : C.kiko, lw: cur ? 6 : 4, r: 29 });
      text(ctx, nm, x, y + 9, 25, { align: "center", weight: 900, color: C.ink, fit: w - 20 });
      if (st && o.tags !== false) {
        const d = st.dist[id], fl = st.upd === id ? pulse : 0, tw = 78, ty = y - h / 2 - 44;
        const fill = fl > 0 ? C.accent : done ? C.good : d === INF ? "#B7C4CC" : C.kiko;
        rr(ctx, x - tw / 2 - fl * 6, ty - fl * 4, tw + fl * 12, 36 + fl * 8, 9); ctx.fillStyle = fill; ctx.fill();
        text(ctx, show(d), x, ty + 27, 26, { align: "center", weight: 900, color: "#fff" });
      }
    });
  }
  const TB = { x: 1110, y: 236, cw: [200, 120, 200, 160], rh: 54 };
  function drawTable(ctx, st, o = {}) {
    const { x, y, cw, rh } = TB, W = cw.reduce((s, v) => s + v, 0), pulse = o.since != null ? clamp(1 - o.since / 0.8, 0, 1) : 0;
    card(ctx, x, y, W, rh * 7, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 14); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    const cx = i => x + cw.slice(0, i).reduce((s, v) => s + v, 0) + cw[i] / 2;
    ["tempat", "jarak", "asal", "status"].forEach((h, i) => text(ctx, h, cx(i), y + 36, 22, { align: "center", weight: 900, color: C.ink2 }));
    IDS.forEach((id, r) => {
      const ry = y + rh * (r + 1), done = st.done.includes(id), onR = (o.routeIds || []).includes(id);
      if (st.cur === id) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 3, ry, W - 6, rh); }
      else if (onR) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 3, ry, W - 6, rh); }
      else if (st.upd === id) { ctx.fillStyle = `rgba(143,208,230,${0.25 + 0.5 * pulse})`; ctx.fillRect(x + 3, ry, W - 6, rh); }
      ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 8, ry); ctx.lineTo(x + W - 8, ry); ctx.stroke();
      [NM(id), show(st.dist[id]), st.via[id] ? NM(st.via[id]) : "–", done ? "pasti ✓" : "sementara"].forEach((v, i) =>
        text(ctx, v, cx(i), ry + 36, i === 1 ? 28 : i === 3 ? 20 : 23, { align: "center", weight: 900, color: i === 3 ? (done ? C.good : C.ink2) : C.ink, fit: cw[i] - 14 }));
    });
  }
  function drawQueue(ctx, st, x = 1110, y = 652, w = 680) {
    text(ctx, "antrean prioritas · terkecil keluar dulu", x, y + 20, 21, { weight: 900, color: C.ink2 });
    card(ctx, x, y + 34, w, 76, { fill: C.bg2, r: 14 });
    const q = st.queue || [];
    if (!q.length) { text(ctx, "kosong", x + w / 2, y + 82, 24, { align: "center", weight: 800, color: C.muted }); return; }
    const cw = Math.min(156, (w - 20 - (q.length - 1) * 8) / q.length);
    q.forEach((id, i) => { const cx = x + 10 + i * (cw + 8); card(ctx, cx, y + 44, cw, 56, { fill: "#fff", stroke: i === 0 ? C.accent : "#CFDCD5", lw: i === 0 ? 4 : 2, r: 12 });
      text(ctx, NM(id) + " " + show(st.dist[id]), cx + cw / 2, y + 81, 21, { align: "center", weight: 900, color: i === 0 ? C.accentDark : C.ink, fit: cw - 12 }); });
    if (st.pop) text(ctx, "← " + NM(st.pop) + " baru keluar", x + w, y + 20, 20, { align: "right", weight: 900, color: C.good });
  }
  const runHeading = b => b.dari === "B" ? "DIJKSTRA DARI PASAR (DIPERCEPAT)" : b.closed ? "JALAN PUSKESMAS–ALUN-ALUN DITUTUP" : b.extra ? "ADA ANGKOT LANGSUNG SEKOLAH–PUSKESMAS" : "DIJKSTRA DARI SEKOLAH";
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  function rightCard(ctx, title, y = 236, h = 520) { card(ctx, 1110, y, 680, h, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 }); if (title) text(ctx, title, 1140, y + 48, 26, { weight: 900, color: C.accentDark }); }
  const VQ = {
    1: ["VARIASI 1 · TITIK AWAL BERBEDA", "Dijkstra mulai dari Pasar. Berapa menit dari Pasar ke Sekolah?"],
    2: ["VARIASI 2 · JALAN DITUTUP", "Jalan Puskesmas–Alun-alun ditutup. Berapa menit rute tercepat Sekolah ke Stasiun?"],
    3: ["VARIASI 3 · ANGKOT LANGSUNG", "Angkot langsung Sekolah–Puskesmas 9 menit. Rute mana yang dipilih Dijkstra?"]
  };
  const VCFG = { 1: { start: "B" }, 2: { start: "A", closed: "DE" }, 3: { start: "A", extra: "AD" } };

  Object.assign(K.SCENES, {
    k24_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 240, 235, 30, { weight: 900, color: C.accentDark });
      ["menjalankan Dijkstra dengan tabel jarak", "memakai antrean prioritas", "menebak rute saat petanya berubah"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 240, 280 + i * 110, 820, 88, { fill: C.bg2, r: 16 }); text(ctx, "✓", 280, 338 + i * 110, 36, { weight: 900, color: C.good }); text(ctx, s, 330, 336 + i * 110, 30, { weight: 800, fit: 710 }); ctx.globalAlpha = 1;
      });
      ctx.save(); ctx.translate(1110, 250); ctx.scale(0.62, 0.62); ctx.translate(-150, -290);
      const R = run({ start: "A" }); drawMap(ctx, R.fin, { route: [["A", "C"], ["C", "B"], ["B", "D"], ["D", "E"], ["E", "F"]].slice(0, clamp(Math.floor((l - 1) / 0.6), 0, 5)) }); ctx.restore();
      text(ctx, "rute tercepat: 13 menit", 1415, 740, 26, { align: "center", weight: 900, color: C.accentDark });
    },
    k24_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 620, 400, { fill: C.bg2, r: 22 });
      text(ctx, "F12.2", 570, 390, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Memilih Solusi Optimal", 570, 470, 38, 540, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas XII", 570, 640, 26, { align: "center", weight: 700, color: C.ink2 });
      [["graph berbobot", C.kiko], ["Dijkstra", C.good], ["priority queue (heapq)", C.accentDark]].forEach(([s, col], i) => {
        const u = ease((l - 1 - i * 0.6) / 0.4); ctx.globalAlpha = Math.max(0.15, u);
        card(ctx, 1000, 300 + i * 110, 600, 84, { fill: "#fff", stroke: col, lw: 4, r: 42 }); text(ctx, s, 1300, 354 + i * 110, 32, { align: "center", weight: 900, color: col }); ctx.globalAlpha = 1;
      });
      kiko(ctx, 1680, 760, 90, 0, { wave: l });
    },
    k24_peta(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "PETA REKAAN DI SEKITAR SEKOLAH");
      drawMap(ctx, null, { weights: l > at(b, "Angka di") });
      rightCard(ctx, "CARA MEMBACA PETA");
      [["6 tempat, 9 jalan", C.ink], ["angka di jalan = menit naik angkot", C.ink], ["jalan bisa dilalui dua arah", C.ink], ["tujuan: rute tercepat dari Sekolah", C.accentDark]].forEach(([s, col], i) => {
        const u = ease((l - 0.6 - i * 1.2) / 0.5); ctx.globalAlpha = Math.max(0, u);
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1160, 330 + i * 100, 10, 0, Math.PI * 2); ctx.fill(); para(ctx, s, 1190, 340 + i * 100, 28, 570, { weight: 800, color: col, lh: 1.2 }); ctx.globalAlpha = 1;
      });
    },
    k24_aturan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "TIGA ATURAN DIJKSTRA");
      const R = run({ start: "A" }); drawMap(ctx, R.init, {});
      rightCard(ctx, "ATURANNYA");
      const T = [at(b, "Sekolah diberi"), at(b, "Antrean prioritas"), at(b, "Terakhir")];
      ["Sekolah = 0, tempat lain = ∞ (belum tahu).", "Keluarkan jarak terkecil dari antrean prioritas, lalu tandai pasti.", "Perbarui tetangga bila jalan lewat sini lebih kecil."].forEach((s, i) => {
        const u = ease((l - T[i] + 0.3) / 0.5), y = 310 + i * 145; ctx.globalAlpha = Math.max(0.15, u);
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1165, y + 8, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 1165, y + 18, 28, { align: "center", weight: 900, color: "#fff" });
        para(ctx, s, 1205, y + 18, 28, 560, { weight: 800, lh: 1.25 }); ctx.globalAlpha = 1;
      });
    },
    k24_run(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, runHeading(b));
      const { st, since } = stateAt(b, l);
      drawMap(ctx, st, { cfg: cfgOf(b), since });
      drawTable(ctx, st, { since }); drawQueue(ctx, st);
      banner(ctx, st.msg, 150, 748, 920, { fill: st.col === C.good ? C.goodBg : C.bg2, stroke: st.col === C.good ? C.good : "#CFDCD5", color: st.col, size: 26 });
    },
    k24_rute(ctx, b, l) {
      const cfg = cfgOf(b), R = run(cfg), to = b.to || "F", r = routeTo(R, cfg.start, to), edges = [];
      for (let i = r.length - 1; i > 0; i--) edges.push([r[i], r[i - 1]]);
      card(ctx, 120, 150, 1680, 670); heading(ctx, b.closed ? "RUTE BARU SAAT JALAN DITUTUP" : b.extra ? "ANGKOT LANGSUNG LAWAN RUTE LEWAT DUA TEMPAT" : "TELUSURI ASAL SECARA MUNDUR");
      const step = Math.max(0.6, (A(b) * 0.7) / edges.length), n = clamp(Math.floor((l - lead(b) - 0.3) / step) + 1, 0, edges.length);
      drawMap(ctx, R.fin, { cfg, route: edges.slice(0, n) });
      drawTable(ctx, R.fin, { routeIds: r.slice(r.length - 1 - n) }); drawQueue(ctx, R.fin);
      if (n >= edges.length) banner(ctx, r.map(NM).join(" → ") + ": " + R.fin.dist[to] + " menit", 150, 748, 920, { fill: C.goodBg, stroke: C.good, color: C.good, size: 25 });
      else banner(ctx, `${NM(edges[Math.max(0, n - 1)][0])} datang dari ${NM(edges[Math.max(0, n - 1)][1])}`, 150, 748, 920, {});
      if (b.extra && n >= edges.length) { card(ctx, 1110, 652, 680, 110, { fill: "#F3EEFA", stroke: PURPLE, lw: 3, r: 14 }); text(ctx, "angkot langsung: 9 menit", 1450, 697, 28, { align: "center", weight: 900, color: PURPLE }); text(ctx, "lewat Masjid dan Pasar: 2 + 1 + 5 = 8 menit", 1450, 740, 24, { align: "center", weight: 900, color: C.good }); }
    },
    k24_tanya(ctx, b, l) {
      const v = b.v, cfg = VCFG[v]; card(ctx, 120, 150, 1680, 670); heading(ctx, VQ[v][0]);
      const R = run(cfg); drawMap(ctx, R.init, { cfg });
      rightCard(ctx, null, 236, 560);
      para(ctx, VQ[v][1], 1145, 300, 32, 610, { weight: 900, lh: 1.3, color: C.ink });
      const note = { 1: "Jalan langsung Pasar–Sekolah: 4 menit.", 2: "Tadi rutenya 13 menit, lewat jalan itu.", 3: "Tadi Puskesmas pasti dengan 8 menit." }[v];
      text(ctx, note, 1145, 480, 24, { weight: 800, color: C.ink2, fit: 620 });
      if (b.pilih) {
        b.pilih.forEach((s, i) => { card(ctx, 1145, 530 + i * 76, 610, 62, { fill: "#fff", stroke: C.kiko, lw: 3, r: 31 }); text(ctx, "ABC"[i] + ". " + s, 1175, 571 + i * 76, 28, { weight: 900, color: C.kikoDark }); });
        thinking(ctx, 1730, 215, l, b.dur);
      }
    },
    k24_tebak(ctx, b, l) { K.SCENES.k24_tanya(ctx, b, l); },
    k24_banding(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "TITIK AWAL BERBEDA, TABEL BERBEDA");
      const RA = run({ start: "A" }).fin, RB = run({ start: "B" }).fin, n = clamp(Math.floor((l - 0.3) / 0.45) + 1, 0, 6);
      const x = 330, y = 240, cw = [340, 300, 300, 320], rh = 62, W = cw.reduce((s, v) => s + v, 0);
      card(ctx, x, y, W, rh * 7, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 14); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
      const cx = i => x + cw.slice(0, i).reduce((s, v) => s + v, 0) + cw[i] / 2;
      ["tempat", "dari Sekolah", "dari Pasar", "asal (dari Pasar)"].forEach((h, i) => text(ctx, h, cx(i), y + 40, 24, { align: "center", weight: 900, color: C.ink2 }));
      IDS.slice(0, n).forEach((id, r) => { const ry = y + rh * (r + 1); if (id === "A") { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 3, ry, W - 6, rh); }
        [NM(id), RA.dist[id] + " menit", RB.dist[id] + " menit", RB.via[id] ? NM(RB.via[id]) : "–"].forEach((v, i) => text(ctx, v, cx(i), ry + 41, 27, { align: "center", weight: 900, color: i === 2 ? C.kikoDark : C.ink })); });
      if (l > A(b) * 0.45) banner(ctx, "Pasar → Sekolah: 3 menit lewat Masjid, bukan 4 lewat jalan langsung", 330, 700, W, { size: 26 });
    },
    k24_latihan(ctx, b, l) {
      const a = A(b), t = [a * 0.1, a * 0.3, a * 0.45, a * 0.75];
      const POS = { A: [40, 110], B: [130, 40], C: [140, 180], D: [240, 105], E: [320, 170] }, G = [["A", "B", 2], ["A", "C", 5], ["B", "C", 2], ["B", "D", 6], ["C", "D", 2], ["C", "E", 7], ["D", "E", 3]];
      const picked = l >= t[1], upd = l >= t[2];
      const gRow = { custom: (ctx, x, y, w) => {
        const s = 0.95, ox = x + 6, oy = y + 4;
        G.forEach(([p, q, wt]) => { const [x1, y1] = POS[p], [x2, y2] = POS[q]; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox + x1 * s, oy + y1 * s); ctx.lineTo(ox + x2 * s, oy + y2 * s); ctx.stroke();
          const mx = ox + (x1 + x2) / 2 * s, my = oy + (y1 + y2) / 2 * s; ctx.fillStyle = "#fff"; rr(ctx, mx - 9, my - 9, 18, 18, 4); ctx.fill(); text(ctx, String(wt), mx, my + 5, 12, { align: "center", weight: 800, color: C.ink2 }); });
        const dist = { A: 0, B: upd ? 2 : "∞", C: upd ? 5 : "∞", D: "∞", E: "∞" };
        Object.entries(POS).forEach(([k, [px, py]]) => { const X = ox + px * s, Y = oy + py * s, fin = picked && k === "A"; ctx.beginPath(); ctx.arc(X, Y, 15, 0, Math.PI * 2); ctx.fillStyle = fin ? C.goodBg : "#fff"; ctx.fill(); ctx.strokeStyle = fin ? C.good : C.kiko; ctx.lineWidth = 2.5; ctx.stroke();
          text(ctx, k, X, Y + 5, 14, { align: "center", weight: 900 }); text(ctx, String(dist[k]), X, Y - 20, 12, { align: "center", weight: 900, color: C.kikoDark }); });
        return y + 200; } };
      K.halaman(ctx, 250, 190, 1.15, { url: "belajar-informatika.vercel.app/f122", judul: "Dijkstra langkah demi langkah, penjadwal lab, pembanding solusi",
        rows: [{ tabs: ["1 Dijkstra langkah demi langkah", "2 Penjadwal lab", "3 Pembanding solusi"], on: -1 }, gRow,
          { label: picked ? "Lewat A ke B: 0 + 2 = 2. Jarak B menjadi berapa?" : "Kota belum pasti mana yang dipastikan sekarang?" },
          picked ? { buttons: ["∞", "2", "3"], cols: 3, on: -1 } : { buttons: ["A (0)", "B (∞)", "C (∞)", "D (∞)", "E (∞)"], cols: 5, on: -1 }],
        taps: [[0, 0, t[0]], [3, 0, t[1] - 0.01]].concat(picked ? [[3, 1, t[2] - 0.01]] : []) }, l, { h: 535 });
      const n = l < t[0] ? 0 : l < t[1] ? 1 : l < t[3] ? 2 : 3;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN F12.2", ["Klik 1 Dijkstra langkah demi langkah.", "Pilih kota dengan jarak terkecil.", "Perbarui jarak tetangganya, lalu telusuri rutenya."], n);
      card(ctx, 840, 540, 880, 250, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 585, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Gambar peta lima tempat di sekitar rumahmu, beri perkiraan menit di setiap jalan, lalu jalankan Dijkstra dengan tabel di kertas.", 870, 630, 28, 820, { weight: 700, lh: 1.3 });
    }
  });

  // ---------- adegan Short (area 40–1040 × 20–810; crop [40, 20, 1000, 790]) ----------
  function shortCells(ctx, st, routeIds) {
    IDS.forEach((id, i) => {
      const x = 60 + (i % 3) * 325, y = 600 + Math.floor(i / 3) * 106, done = st.done.includes(id), on = (routeIds || []).includes(id) || st.cur === id;
      card(ctx, x, y, 310, 94, { fill: on ? "#FFF3D6" : done ? C.goodBg : "#fff", stroke: on ? C.accent : done ? C.good : "#CFDCD5", lw: 3, r: 16 });
      text(ctx, NM(id), x + 18, y + 40, 28, { weight: 900 }); text(ctx, show(st.dist[id]), x + 292, y + 62, 48, { align: "right", weight: 900, color: done ? C.good : st.dist[id] === INF ? C.muted : C.kikoDark });
      text(ctx, st.via[id] ? "dari " + NM(st.via[id]) : " ", x + 18, y + 76, 21, { weight: 800, color: C.ink2 });
    });
  }
  const mapShort = (ctx, fn) => { ctx.save(); ctx.translate(-110, -258); fn(); ctx.restore(); };
  Object.assign(K.SCENES, {
    k24s_run(ctx, b, l) {
      const { st, since } = stateAt(b, l);
      mapShort(ctx, () => drawMap(ctx, st, { cfg: cfgOf(b), since }));
      card(ctx, 60, 490, 960, 90, { fill: st.col === C.good ? C.goodBg : C.bg2, r: 18 }); text(ctx, st.msg, 540, 547, 32, { align: "center", weight: 900, color: st.col, fit: 920 });
      shortCells(ctx, st);
    },
    k24s_rute(ctx, b, l) {
      const cfg = cfgOf(b), R = run(cfg), to = b.to || "F", r = routeTo(R, cfg.start, to), edges = [];
      for (let i = r.length - 1; i > 0; i--) edges.push([r[i], r[i - 1]]);
      const n = clamp(Math.floor((l - lead(b) - 0.2) / Math.max(0.5, A(b) * 0.6 / edges.length)) + 1, 0, edges.length);
      mapShort(ctx, () => drawMap(ctx, R.fin, { cfg, route: edges.slice(0, n) }));
      card(ctx, 60, 490, 960, 90, { fill: C.goodBg, r: 18 }); text(ctx, n >= edges.length ? `rute tercepat: ${R.fin.dist[to]} menit, lewat ${r.length - 2} tempat` : "telusuri asal secara mundur…", 540, 547, 34, { align: "center", weight: 900, color: C.good, fit: 920 });
      shortCells(ctx, R.fin, r.slice(r.length - 1 - n));
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
