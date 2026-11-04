/* K21 Simulasi konsep: paket berlapis di internet (enkapsulasi TCP/IP, lompatan antar-router, TTL, kirim ulang TCP).
   Memakai pembantu F11.7 (K.lapisan: warna dan tumpukan empat lapisan) dan D9.2 (K.jaringan: router, server, HP, kabel).
   Adegan baru berawalan k21_ (video) dan k21s_ (Short, area 40–1040 × 20–810). Gaya diagram Fase F. Semua alamat rekaan.
   Kunci beat: kind (web/chat), route (dekat/jauh), ttl (TTL awal), v (nomor variasi), pilih (pilihan tebakan), step,
   cues (potongan narasi tempat tiap langkah dimulai), fr (pecahan durasi narasi, dipakai bila cues tidak ada, mis. di Short).
   Semua gambar penting di atas y≈830 (kartu narasi tiga baris mulai y≈841). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan, Lp = K.lapisan;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const COL = { app: Lp.LAYERS[0][2], tcp: Lp.LAYERS[1][2], ip: Lp.LAYERS[2][2], link: Lp.LAYERS[3][2] };
  const IP = { dekat: "203.0.113.10", jauh: "203.0.113.80" };
  const DATA = { web: "minta: menu kantin", chat: "“Nanti ke kantin?”" };
  const PORT = { web: "443", chat: "5222" };

  // ---------- waktu ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * A(b); };
  function cues(b, n, def) {
    if (b.cues && b.cues.length >= n && b.cues.every(c => b.text.indexOf(c) >= 0)) return b.cues.slice(0, n).map(c => at(b, c));
    const fr = b.fr || def; return Array.from({ length: n }, (_, i) => lead(b) + (fr[i] != null ? fr[i] : 0.2 + 0.6 * i / n) * A(b));
  }

  // ---------- pembantu gambar ----------
  const heading = (ctx, s, y = 205) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 900, fit: 1600 });
  const banner = (ctx, s, y, opt = {}) => { const w = opt.w || 1300; card(ctx, 960 - w / 2, y, w, 72, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 3, r: 16 }); text(ctx, s, 960, y + 47, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  const chip = (ctx, s, cx, cy, opt = {}) => { ctx.font = `900 ${opt.size || 20}px Inter`; const w = opt.w || ctx.measureText(s).width + 28, h = opt.h || (opt.size || 20) + 16; card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: opt.fill || C.goodBg, stroke: opt.stroke, lw: 2, r: h / 2 }); text(ctx, s, cx, cy + (opt.size || 20) * 0.36, opt.size || 20, { align: "center", weight: 900, color: opt.color || C.good }); return w; };
  function arrow(ctx, x1, y1, x2, y2, col, lw = 5) {
    const a = Math.atan2(y2 - y1, x2 - x1), hs = lw * 3.2;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * hs * 0.8, y2 - Math.sin(a) * hs * 0.8); ctx.stroke(); ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - Math.cos(a - 0.45) * hs, y2 - Math.sin(a - 0.45) * hs); ctx.lineTo(x2 - Math.cos(a + 0.45) * hs, y2 - Math.sin(a + 0.45) * hs); ctx.closePath(); ctx.fill();
  }
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  function table(ctx, x, y, cw, head, rows, o = {}) {
    const rh = o.rh || 70, W = cw.reduce((s, v) => s + v, 0), n = o.n == null ? rows.length : o.n;
    card(ctx, x, y, W, rh * (rows.length + 1), { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 });
    ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 14); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    let cx = x; head.forEach((h, i) => { text(ctx, h, cx + cw[i] / 2, y + rh / 2 + 9, 24, { align: "center", weight: 900, color: C.ink2, fit: cw[i] - 16 }); cx += cw[i]; });
    rows.forEach((r, ri) => {
      if (ri >= n) return; const ry = y + rh * (ri + 1);
      if (o.hl === ri) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 3, ry, W - 6, rh); }
      ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 10, ry); ctx.lineTo(x + W - 10, ry); ctx.stroke();
      cx = x; r.forEach((v, i) => { const col = (o.colors && o.colors[ri] && o.colors[ri][i]) || (i === 0 ? C.ink2 : C.ink); text(ctx, String(v), cx + cw[i] / 2, ry + rh / 2 + 10, i === 0 ? 24 : 28, { align: "center", weight: 900, color: col, fit: cw[i] - 20 }); cx += cw[i]; });
    });
  }

  // paket berheader: urutan kiri→kanan [bingkai][IP][TCP][data]; k = banyak header yang tampil (0..3, dari dalam)
  function blocks(o = {}) {
    const kind = o.kind || "web";
    return [
      { t: "bingkai", v: o.frame || "ke R1", v2: o.from || "dari HP Sinta", c: COL.link },
      { t: "IP", v: "ke " + (o.ip || IP.dekat), v2: "TTL " + (o.ttl == null ? 64 : o.ttl), c: COL.ip },
      { t: "TCP", v: "port " + PORT[kind], v2: "no. urut " + (o.seq || 1), c: COL.tcp },
      { t: "data", v: o.data || DATA[kind], c: COL.app }];
  }
  function drawPacket(ctx, x, y, bl, o = {}) {
    const hw = o.hw || 245, dw = o.dw || 330, h = o.h || 90, k = o.k == null ? 3 : o.k, fs = o.fs || 22;
    bl.forEach((B, i) => {
      if (i < 3 - k) return;
      const w = i === 3 ? dw : hw - 6; let bx = x + i * hw, by = y, al = o.alpha == null ? 1 : o.alpha;
      if (o.slide != null && i === 3 - k) { const u = ease(o.slide); bx -= (1 - u) * 90; al *= u; }
      if (o.swap && i === 0) { // bingkai lama turun dan memudar, bingkai baru turun dari atas
        const u = ease(o.swap.u);
        if (u < 1) { ctx.save(); ctx.globalAlpha = al * (1 - u); card(ctx, bx, by + u * 60, w, h, { fill: B.c, r: 10 }); text(ctx, o.swap.old, bx + w / 2, by + u * 60 + h / 2 + 8, fs, { align: "center", weight: 900, color: "#fff", fit: w - 16 }); ctx.restore(); }
        by -= (1 - u) * 60; al *= u;
      }
      ctx.save(); ctx.globalAlpha = al;
      card(ctx, bx, by, w, h, { fill: o.grey ? "#9AA7AE" : B.c, r: 10 });
      if (o.flash != null && o.flash.i === i) { const f = clamp(1 - o.flash.u, 0, 1); ctx.strokeStyle = C.accent; ctx.lineWidth = 4 + 6 * f; rr(ctx, bx - 4, by - 4, w + 8, h + 8, 13); ctx.stroke(); }
      text(ctx, B.t, bx + 12, by + fs * 0.95, fs * 0.72, { weight: 800, color: "rgba(255,255,255,0.85)" });
      if (B.v2) { text(ctx, B.v, bx + w / 2, by + h * 0.58, fs, { align: "center", weight: 900, color: "#fff", fit: w - 16 }); text(ctx, B.v2, bx + w / 2, by + h * 0.58 + fs * 1.15, fs * 0.86, { align: "center", weight: 800, color: "#fff", fit: w - 16 }); }
      else text(ctx, B.v, bx + w / 2, by + h * 0.62, fs, { align: "center", weight: 900, color: "#fff", fit: w - 16 });
      if (o.marks && o.marks[i]) { const [s, col, bg] = o.marks[i]; chip(ctx, s, bx + w / 2, by - 26, { color: col, fill: bg, size: 19 }); }
      ctx.restore();
    });
    if (o.cross) { ctx.strokeStyle = "rgba(217,68,59,0.75)"; ctx.lineWidth = 7; ctx.lineCap = "round"; const x0 = x + (3 - k) * hw, x1 = x + 3 * hw + dw; ctx.beginPath(); ctx.moveTo(x0, y - 10); ctx.lineTo(x1, y + h + 10); ctx.moveTo(x0, y + h + 10); ctx.lineTo(x1, y - 10); ctx.stroke(); ctx.lineCap = "butt"; }
  }

  // jalur: node [label, jenis hp/r/s, keterangan]
  const ROUTE = {
    dekat: [["HP Sinta", "hp"], ["R1", "r", "sekolah"], ["R2", "r", "penyedia"], ["R3", "r", "kota"], ["server", "s", "sekolah"]],
    jauh: [["HP Sinta", "hp"], ["R1", "r", "sekolah"], ["R2", "r", "penyedia"], ["R3", "r", "antarkota"], ["R4", "r", "antarkota"], ["R5", "r", "antarkota"], ["R6", "r", "kota tujuan"], ["server", "s", "kota lain"]]
  };
  function drawPath(ctx, x0, x1, y, nodes, o = {}) {
    const n = nodes.length, step = (x1 - x0) / (n - 1), P = nodes.map((_, i) => [x0 + i * step, y]), s = o.s || 80, fs = o.fs || 24;
    J.cable(ctx, P, { color: "#B7C4CC", lw: 6 });
    nodes.forEach(([lab, kd, sub], i) => {
      const [px, py] = P[i], dead = o.dead === i;
      if (o.hot === i || dead) { ctx.fillStyle = dead ? C.badBg : "#FFF3D6"; ctx.beginPath(); ctx.arc(px, py - 4, s * 0.68, 0, Math.PI * 2); ctx.fill(); }
      if (kd === "hp") J.phoneSmall(ctx, px, py, s * 0.95);
      else if (kd === "s") J.server(ctx, px, py, s * 0.78, s * 1.02, { label: false });
      else J.router(ctx, px, py + s * 0.12, s, { label: false, alert: dead });
      text(ctx, lab, px, py + s * 0.5 + fs + 6, fs, { align: "center", weight: 900, color: dead ? C.bad : C.ink });
      if (sub && o.sub !== false) text(ctx, sub, px, py + s * 0.5 + fs * 1.95 + 6, Math.round(fs * 0.76), { align: "center", weight: 700, color: C.ink2 });
    });
    return P;
  }
  // jadwal lompatan: T[k] = detik tiba di node k (T[0] = berangkat)
  function hopTimes(b, nLinks, ttl0) {
    const drop = ttl0 < nLinks ? ttl0 : null;
    if (drop) { const c = cues(b, drop + 1, [0.0, 0.24, 0.45, 0.66]); const T = [0.15]; for (let k = 1; k <= drop; k++) T.push(k === 1 ? Math.max(1.1, c[0] + 0.7) : c[k - 1] + 0.4); return { T, drop, back: c[drop] }; }
    const t0 = lead(b) + 0.4, t1 = lead(b) + A(b) * 0.88; return { T: Array.from({ length: nLinks + 1 }, (_, i) => t0 + (t1 - t0) * i / nLinks), drop: null };
  }
  function hopState(nodes, ttl0, plan, l) {
    const nL = nodes.length - 1, T = plan.T, last = plan.drop || nL;
    let arrived = 0; for (let k = 1; k <= last; k++) if (l >= T[k]) arrived = k;
    let pos = arrived;
    if (arrived < last && l >= T[arrived]) { const dw = arrived ? Math.min(0.45, (T[arrived + 1] - T[arrived]) * 0.3) : 0; pos = arrived + ease((l - T[arrived] - dw) / Math.max(0.1, T[arrived + 1] - T[arrived] - dw)); }
    const routers = Math.min(arrived, nL - 1), ttl = ttl0 - routers, atServer = arrived === nL, dropped = plan.drop && arrived === plan.drop;
    const cur = nodes[arrived][0], next = arrived < nL ? nodes[arrived + 1][0] : null;
    return { arrived, pos, ttl, atServer, dropped, routers, frames: Math.min(arrived + 1, nL), cur, next, since: l - (T[arrived] || 0) };
  }
  // potongan foto (pemandangan sederhana) untuk segmen 1–3
  function photo(ctx, x, y, w, h, piece) {
    ctx.save(); rr(ctx, x, y, w, h, 8); ctx.clip();
    const W = piece == null ? w : w * 3, ox = piece == null ? x : x - piece * w;
    ctx.fillStyle = "#BFE3F2"; ctx.fillRect(ox, y, W, h);
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(ox + W * 0.78, y + h * 0.3, h * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5DB27A"; ctx.beginPath(); ctx.moveTo(ox, y + h); ctx.lineTo(ox + W * 0.3, y + h * 0.42); ctx.lineTo(ox + W * 0.55, y + h * 0.75); ctx.lineTo(ox + W * 0.72, y + h * 0.55); ctx.lineTo(ox + W, y + h * 0.9); ctx.lineTo(ox + W, y + h); ctx.fill();
    ctx.fillStyle = "#3E8E5E"; ctx.fillRect(ox, y + h * 0.88, W, h * 0.12);
    ctx.restore(); ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 8); ctx.stroke();
  }
  function segPacket(ctx, x, y, n, opt = {}) {
    const w = opt.w || 64, h = opt.h || 46; ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.22)"; ctx.shadowBlur = 8; card(ctx, x - w / 2, y - h / 2, w, h, { fill: opt.col || COL.tcp, r: 9 }); ctx.restore();
    text(ctx, String(n), x, y + h * 0.22, h * 0.6, { align: "center", weight: 900, color: "#fff" });
  }
  function ack(ctx, x, y, n, opt = {}) { chip(ctx, "✓ " + n, x, y, { size: opt.size || 20, fill: C.goodBg, stroke: C.good, color: C.good, w: opt.w || 74 }); }

  // ---------- adegan bungkus / buka ----------
  const ST = { x: 170, y: 245, w: 430, rh: 125 }, PK = { x: 705, hw: 245, dw: 330, h: 88 };
  const rowY = i => ST.y + i * ST.rh + (ST.rh - 10 - PK.h) / 2;
  function stackRows(ctx, active) { Lp.stack(ctx, ST.x, ST.y, ST.w, 4, { h: ST.rh, active }); }

  // ---------- jalannya paket berhop ----------
  function lompat(ctx, b, l, G) {
    const nodes = ROUTE[b.route || "dekat"], ttl0 = b.ttl || 64, ip = IP[b.route || "dekat"], nL = nodes.length - 1;
    const plan = hopTimes(b, nL, ttl0), S = hopState(nodes, ttl0, plan, l);
    const P = drawPath(ctx, G.x0, G.x1, G.y, nodes, { s: G.s, fs: G.fs, hot: S.arrived > 0 && S.arrived < nL && S.since < 1.0 && !S.dropped ? S.arrived : null, dead: S.dropped ? S.arrived : null, sub: G.sub });
    const step = (G.x1 - G.x0) / nL, px = G.x0 + S.pos * step, py = G.py;
    // paket kecil + label TTL
    if (!S.dropped || S.since < 0.8) {
      const fall = S.dropped ? ease(S.since / 0.8) : 0;
      ctx.save(); ctx.globalAlpha = 1 - fall; J.packet(ctx, px, py + fall * 50, null, { color: S.dropped ? C.bad : C.accent });
      const fl = S.arrived > 0 && S.since < 0.9 && !S.atServer;
      chip(ctx, "TTL " + S.ttl, px, py - G.tag, { size: G.tagSize || 20, fill: fl ? C.badBg : "#fff", stroke: fl ? C.bad : "#B7C4CC", color: fl ? C.bad : C.ip || C.ink, w: G.tagW || 100 });
      ctx.restore();
    }
    if (S.dropped) {
      const [dx] = P[S.arrived]; text(ctx, "✕", dx, py + 12, 54, { align: "center", weight: 900, color: C.bad });
      const u = clamp((l - plan.back) / 2.2, 0, 1);
      if (l >= plan.back) { const mx = lerp(dx, P[0][0], ease(u)); chip(ctx, "waktu habis", mx, py - G.tag, { size: G.tagSize || 20, fill: C.badBg, stroke: C.bad, color: C.bad }); if (u < 1) arrow(ctx, mx - 70, py - G.tag, mx - 110, py - G.tag, C.bad, 4); }
    }
    return { S, ip, nodes, nL, plan };
  }
  function hopLog(S, ip, nodes, ttl0) {
    if (S.dropped) return [`${S.cur}: TTL 1 → 0, paket dibuang`, C.bad];
    if (S.atServer) return [`tiba di server: TTL ${S.ttl}, alamat tujuan tetap ${ip}`, C.good];
    if (S.arrived === 0) return ["HP Sinta mengirim paket ke R1", C.ink];
    return [`${S.cur}: TTL ${S.ttl + 1} → ${S.ttl}, bingkai baru ke ${S.next}`, C.ink];
  }

  Object.assign(K.SCENES, {
    k21_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 240, 235, 30, { weight: 900, color: C.accentDark });
      ["menebak isi setiap header paket", "menghitung TTL setelah beberapa router", "menjelaskan kiriman ulang oleh TCP"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 240, 280 + i * 110, 820, 88, { fill: C.bg2, r: 16 }); text(ctx, "✓", 280, 338 + i * 110, 36, { weight: 900, color: C.good }); text(ctx, s, 330, 336 + i * 110, 30, { weight: 800, fit: 710 }); ctx.globalAlpha = 1;
      });
      const k = clamp(Math.floor((l - 0.4) / 0.9), 0, 3);
      Lp.LAYERS.forEach(([nm, , col], i) => { const y = 290 + i * 104, on = i <= k; ctx.save(); ctx.globalAlpha = on ? 1 : 0.2; card(ctx, 1150 + i * 30, y, 470 - i * 60, 84, { fill: col, r: 12 }); text(ctx, nm, 1385, y + 52, 28, { align: "center", weight: 900, color: "#fff" }); ctx.restore(); });
      text(ctx, "satu paket, empat lapisan", 1385, 740, 24, { align: "center", weight: 800, color: C.ink2 });
    },
    k21_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 620, 400, { fill: C.bg2, r: 22 });
      text(ctx, "F11.7", 570, 390, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Model Jaringan dan Pengiriman Data", 570, 460, 36, 540, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas XI", 570, 640, 26, { align: "center", weight: 700, color: C.ink2 });
      const n = clamp(Math.floor((l - 0.8) / 0.6) + 1, 0, 4);
      Lp.stack(ctx, 1000, 280, 620, n, { h: 104 });
      kiko(ctx, 1680, 760, 90, 0, { wave: l });
    },
    k21_bungkus(ctx, b, l) {
      const kind = b.kind || "web", c = cues(b, 3, [0.35, 0.55, 0.75]);
      card(ctx, 120, 150, 1680, 670); heading(ctx, kind === "chat" ? "PESAN CHAT DI HP SINTA: DIBUNGKUS DARI ATAS KE BAWAH" : "HP SINTA: DIBUNGKUS DARI ATAS KE BAWAH");
      let k = 0; c.forEach(t => { if (l >= t) k++; });
      const u = k ? clamp((l - c[k - 1]) / 0.7, 0, 1) : 1;
      stackRows(ctx, k);
      const y = lerp(rowY(Math.max(0, k - 1)), rowY(k), ease(u));
      const marks = {};
      if (kind === "chat") {
        const bad = ["berubah", C.accentDark, "#FFF3D6"], same = ["sama", C.good, C.goodBg];
        if (l >= lead(b) + 0.3) marks[3] = bad; if (k >= 1 && u >= 1) marks[2] = bad; if (k >= 2 && u >= 1) marks[1] = same; if (k >= 3 && u >= 1) marks[0] = same;
        if (k >= 2) marks[2] = bad; if (k >= 3) marks[1] = same;
      }
      drawPacket(ctx, PK.x, y, blocks({ kind }), { k, slide: k ? u : null, hw: PK.hw, dw: PK.dw, h: PK.h, marks });
      if (k === 0) text(ctx, kind === "chat" ? "isi: pesan chat untuk aplikasi chat" : "isi: permintaan halaman web", PK.x + 3 * PK.hw + PK.dw, rowY(0) + PK.h + 30, 22, { align: "right", weight: 800, color: C.ink2 });
      if (k >= 3 && u >= 1) { arrow(ctx, 1240, 760, 1560, 760, C.kiko, 5); text(ctx, "siap dikirim ke R1", 1220, 768, 24, { align: "right", weight: 900, color: C.kiko }); }
    },
    k21_buka(ctx, b, l) {
      const c = cues(b, 4, [0.15, 0.3, 0.5, 0.8]);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "SERVER SEKOLAH: DIBUKA DARI BAWAH KE ATAS");
      // s: 0 bingkai utuh; 1 bingkai dilepas; 2 IP dicocokkan lalu dilepas; 3 port memilih aplikasi
      const T = [c[0], c[1] + 1.1, c[2] + 0.9], s = T.filter(t => l >= t).length, u = s ? clamp((l - T[s - 1]) / 0.7, 0, 1) : 1;
      const row = 3 - s, y = lerp(rowY(Math.min(3, row + 1)), rowY(row), ease(u)), k = 3 - s;
      stackRows(ctx, row);
      const marks = {}; if (l >= c[1] && s <= 1) marks[1] = ["203.0.113.10 = alamatku ✓", C.good, C.goodBg];
      const bl = blocks({ kind: "web", frame: "ke server", from: "dari R3", ttl: 61 });
      if (l >= c[3] + 0.4) bl[3] = { t: "data", v: "balasan: menu kantin", c: C.good };
      drawPacket(ctx, PK.x, y, bl, { k, hw: PK.hw, dw: PK.dw, h: PK.h, marks, alpha: 1 });
      if (l >= c[2]) {
        const on = l >= c[2] + 0.4;
        [["aplikasi web · port 443", true], ["aplikasi chat · port 5222", false]].forEach(([t, w], i) => { const yy = rowY(0) + 2 + i * 48; card(ctx, PK.x, yy, 600, 42, { fill: on && w ? "#FFF3D6" : "#fff", stroke: on && w ? C.accent : "#CFDCD5", lw: on && w ? 4 : 2, r: 10 }); text(ctx, t + (on && w ? "  ✓" : ""), PK.x + 20, yy + 29, 22, { weight: 900, color: on && w ? C.accentDark : C.ink2 }); });
      }
      if (l >= c[3] + 0.4) { text(ctx, "↩ balasan dibungkus lagi, lalu dikirim ke HP Sinta", 1770, rowY(1) + 56, 26, { align: "right", weight: 900, color: C.good }); }
    },
    k21_lompat(ctx, b, l) {
      const ttl0 = b.ttl || 64;
      card(ctx, 120, 150, 1680, 670);
      heading(ctx, ttl0 < 10 ? "BERANGKAT DENGAN TTL " + ttl0 + " KE KOTA LAIN" : b.route === "jauh" ? "TUJUAN JAUH: ENAM ROUTER" : "LOMPAT DARI ROUTER KE ROUTER: TUJUAN DEKAT", 200);
      const R = lompat(ctx, b, l, { x0: 230, x1: 1690, y: 350, py: 272, s: b.route === "jauh" ? 70 : 84, fs: 24, tag: 40 }), S = R.S;
      // pemeriksa paket
      text(ctx, "PAKET YANG SEDANG LEWAT", 255, 498, 20, { weight: 900, color: C.ink2 });
      const prevFrom = S.arrived ? R.nodes[S.arrived - 1][0] : "HP Sinta";
      const bl = S.dropped ? blocks({ kind: "web", ip: R.ip, ttl: 0, frame: "ke " + S.cur, from: "dari " + prevFrom }) : blocks({ kind: "web", ip: R.ip, ttl: S.ttl, frame: S.next ? "ke " + S.next : "ke server", from: "dari " + (S.next ? S.cur : R.nodes[R.nL - 1][0]) });
      const sw = S.arrived > 0 && !S.dropped && S.since < 0.7 ? { u: S.since / 0.7, old: "ke " + S.cur } : null;
      drawPacket(ctx, 255, 520, bl, { hw: 330, dw: 420, h: 100, fs: 26, swap: sw, flash: S.arrived > 0 && S.arrived <= R.nL && S.since < 0.9 && !(S.atServer) ? { i: 1, u: S.since / 0.9 } : null, grey: S.dropped, cross: S.dropped });
      if (S.arrived > 0 && S.since < 1.2 && !S.atServer) chip(ctx, "TTL −1", 255 + 330 + 160, 486, { size: 20, fill: C.badBg, stroke: C.bad, color: C.bad });
      const [msg, col] = hopLog(S, R.ip, R.nodes, ttl0);
      card(ctx, 330, 650, 1260, 66, { fill: S.dropped ? C.badBg : S.atServer ? C.goodBg : C.bg2, r: 14 }); text(ctx, msg, 960, 693, 28, { align: "center", weight: 900, color: col, fit: 1220 });
      text(ctx, `router dilewati: ${S.routers}   ·   bingkai dipakai: ${S.frames}`, 960, 772, 26, { align: "center", weight: 800, color: C.ink2 });
    },
    k21_tanya(ctx, b, l) {
      const v = b.v; card(ctx, 120, 150, 1680, 670);
      const H2 = { 1: "VARIASI 1 · HALAMAN WEB LAWAN PESAN CHAT", 2: "VARIASI 2 · TUJUAN LEBIH JAUH", 3: "VARIASI 3 · BERANGKAT DENGAN TTL 3", 4: "VARIASI 4 · SATU SEGMEN HILANG" };
      heading(ctx, H2[v]);
      if (v === 1) {
        J.phoneSmall(ctx, 300, 400, 150); card(ctx, 400, 290, 380, 76, { fill: "#fff", stroke: COL.app, lw: 4, r: 18 }); text(ctx, "“Nanti ke kantin?”", 590, 338, 28, { align: "center", weight: 900, color: COL.app });
        text(ctx, "HP Sinta", 300, 512, 24, { align: "center", weight: 900 });
        arrow(ctx, 420, 420, 960, 420, "#B7C4CC", 6);
        J.server(ctx, 1080, 410, 110, 160, { label: false }); text(ctx, "server sekolah", 1080, 525, 24, { align: "center", weight: 900 });
        [["aplikasi web · port 443", COL.tcp], ["aplikasi chat · port 5222", COL.app]].forEach(([t, col], i) => { card(ctx, 1190, 330 + i * 80, 520, 62, { fill: "#fff", stroke: col, lw: 3, r: 12 }); text(ctx, t, 1450, 372 + i * 80, 26, { align: "center", weight: 900, color: col }); });
        text(ctx, "paket halaman web tadi:", 450, 590, 22, { weight: 800, color: C.ink2 });
        drawPacket(ctx, 450, 605, blocks({ kind: "web" }), { hw: 230, dw: 330, h: 76, fs: 21 });
      } else if (v === 2) {
        [["tujuan dekat", 3, "TTL tiba: 61", false], ["tujuan jauh", 6, "TTL tiba: ?", true]].forEach(([lab, n, res, q], r) => {
          const y = 340 + r * 190; text(ctx, lab, 200, y + 10, 30, { weight: 900, color: q ? C.accentDark : C.ink });
          const nodes = [["HP", "hp"]].concat(Array.from({ length: n }, (_, i) => ["R" + (i + 1), "r"]), [["server", "s"]]);
          drawPath(ctx, 470, 1300, y, nodes, { s: 56, fs: 20, sub: false });
          chip(ctx, res, 1520, y, { size: 30, w: 300, h: 64, fill: q ? "#FFF3D6" : C.goodBg, stroke: q ? C.accent : C.good, color: q ? C.accentDark : C.good });
        });
        text(ctx, "Kedua paket berangkat dengan TTL 64.", 960, 680, 26, { align: "center", weight: 800, color: C.ink2 });
      } else if (v === 3) {
        const P = drawPath(ctx, 230, 1690, 420, ROUTE.jauh, { s: 70, fs: 22 });
        J.packet(ctx, P[0][0] + 60, 330, null, {}); chip(ctx, "TTL 3", P[0][0] + 60, 285, { size: 26, fill: "#FFF3D6", stroke: C.accent, color: C.accentDark, w: 120 });
        text(ctx, "?", 960, 330, 90, { align: "center", weight: 900, color: C.accentDark });
        text(ctx, "Biasanya paket berangkat dengan TTL 64. Kali ini hanya 3.", 960, 640, 28, { align: "center", weight: 800, color: C.ink2 });
      } else {
        photo(ctx, 190, 270, 270, 170); [1, 2].forEach(i => { ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(190 + i * 90, 270); ctx.lineTo(190 + i * 90, 440); ctx.stroke(); ctx.setLineDash([]); });
        [1, 2, 3].forEach(i => text(ctx, String(i), 235 + (i - 1) * 90, 475, 28, { align: "center", weight: 900, color: COL.tcp }));
        text(ctx, "foto dari Sinta", 325, 515, 24, { align: "center", weight: 800, color: C.ink2 });
        const P = drawPath(ctx, 640, 1680, 440, ROUTE.dekat, { s: 76, fs: 22, sub: false, dead: 2 });
        chip(ctx, "penuh!", P[2][0], 330, { size: 24, fill: C.badBg, stroke: C.bad, color: C.bad });
        [1, 2, 3].forEach(i => segPacket(ctx, P[0][0] + 20 + i * 70, 350, i));
        text(ctx, "Setiap segmen membawa nomor urut di header TCP.", 960, 660, 28, { align: "center", weight: 800, color: C.ink2 });
      }
      if (!b.pilih) { const Q = { 1: "Header mana yang berubah kalau isinya pesan chat?", 2: "Berapa TTL paket saat tiba di server yang jauh?", 3: "Apakah paket tetap sampai di server?", 4: "Apa yang terjadi pada foto Sinta?" }; text(ctx, Q[v], 960, 785, 30, { align: "center", weight: 900, color: C.accentDark }); }
    },
    k21_tebak(ctx, b, l) {
      K.SCENES.k21_tanya(ctx, b, 5);
      const n = b.pilih.length, w = 420, g = 30, x0 = 960 - (n * w + (n - 1) * g) / 2;
      b.pilih.forEach((s, i) => { card(ctx, x0 + i * (w + g), 735, w, 70, { fill: "#fff", stroke: C.kiko, lw: 3, r: 35 }); text(ctx, "ABC"[i] + ". " + s, x0 + i * (w + g) + w / 2, 780, 28, { align: "center", weight: 900, color: C.kikoDark, fit: w - 30 }); });
      thinking(ctx, 1730, 215, l, b.dur);
    },
    k21_banding(ctx, b, l) {
      const v = b.v, n = clamp(Math.floor((l - 0.3) / 0.6) + 1, 0, 5);
      card(ctx, 120, 150, 1680, 670);
      if (v === 1) {
        heading(ctx, "HALAMAN WEB LAWAN PESAN CHAT");
        const B = ["berubah", C.accentDark], S = ["sama", C.good];
        const rows = [["data", "minta: menu kantin", "“Nanti ke kantin?”", B], ["port tujuan", "443", "5222", B], ["alamat IP tujuan", IP.dekat, IP.dekat, S], ["bingkai pertama", "ke R1", "ke R1", S]];
        table(ctx, 250, 250, [330, 420, 420, 250], ["bagian", "halaman web", "pesan chat", ""], rows.map(r => [r[0], r[1], r[2], r[3][0]]), { rh: 72, n, colors: rows.map(r => [null, null, null, r[3][1]]) });
        if (l > A(b) * 0.4) banner(ctx, "alamat IP → komputer yang benar · port → aplikasi yang benar", 650, { w: 1300 });
      } else if (v === 2) {
        heading(ctx, "TUJUAN DEKAT LAWAN TUJUAN JAUH");
        const rows = [["router dilewati", "3", "6"], ["TTL berangkat", "64", "64"], ["TTL tiba", "61", "58"], ["bingkai dipakai", "4", "7"], ["alamat IP tujuan", "tetap", "tetap"]];
        table(ctx, 360, 240, [420, 380, 380], ["", "tujuan dekat", "tujuan jauh"], rows, { rh: 66, n, hl: n >= 3 ? 2 : null, colors: [null, null, [null, C.good, C.good], null, [null, C.good, C.good]] });
        if (l > A(b) * 0.5) banner(ctx, "TTL tiba = TTL berangkat − banyak router · satu bingkai per sambungan", 655, { w: 1400 });
      } else {
        heading(ctx, "TTL: PENCEGAH PAKET TERSESAT");
        // putaran router
        const cx = 560, cy = 445, R = 150, pts = [0, 1, 2, 3].map(i => [cx + R * Math.cos(-Math.PI / 2 + i * Math.PI / 2), cy + R * Math.sin(-Math.PI / 2 + i * Math.PI / 2)]);
        ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
        pts.forEach(([x, y], i) => { J.router(ctx, x, y + 8, 64, { label: false }); });
        const t = clamp((l - 0.5) / 4.0, 0, 1), ang = -Math.PI / 2 + Math.min(t, 0.75) * Math.PI * 2 + Math.PI / 4, ttl = 3 - Math.min(3, Math.floor(t * 4 + 1e-6));
        const px = cx + R * Math.cos(ang), py = cy + R * Math.sin(ang);
        if (t < 1) { J.packet(ctx, px, py, null, {}); chip(ctx, "TTL " + Math.max(0, ttl), px, py - 44, { size: 20, fill: "#fff", stroke: C.accent, color: C.accentDark, w: 96 }); }
        else { text(ctx, "✕", px, py + 16, 54, { align: "center", weight: 900, color: C.bad }); chip(ctx, "TTL 0: dibuang", px, py - 50, { size: 22, fill: C.badBg, stroke: C.bad, color: C.bad }); }
        text(ctx, "jalur salah membentuk putaran", cx, cy + R + 62, 24, { align: "center", weight: 800, color: C.ink2 });
        // traceroute
        card(ctx, 960, 250, 760, 420, { fill: "#1F2A33", r: 18 }); text(ctx, "Terminal", 990, 290, 22, { weight: 800, color: "#9FB3BF" });
        text(ctx, "> traceroute server-kota.example", 990, 340, 26, { weight: 700, color: "#E8F0F4" });
        const lines = [["TTL 1 → kabar dari R1", "sekolah"], ["TTL 2 → kabar dari R2", "penyedia"], ["TTL 3 → kabar dari R3", "antarkota"], ["… dan seterusnya sampai server", ""]];
        const t0 = at(b, "Perintah traceroute"), m = clamp(Math.floor((l - t0) / 0.9) + 1, 0, 4);
        lines.slice(0, m).forEach(([s, sub], i) => { text(ctx, s, 990, 400 + i * 62, 28, { weight: 800, color: i < 3 ? "#8FE0A8" : "#E8F0F4" }); if (sub) text(ctx, sub, 1690, 400 + i * 62, 22, { align: "right", weight: 700, color: "#9FB3BF" }); });
        if (l > A(b) * 0.85) banner(ctx, "TTL habis → paket dibuang, pengirim diberi kabar", 712, { w: 1100 });
      }
    },
    k21_hilang(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, b.step === "susun" ? "SERVER MENYUSUN SEGMEN MENURUT NOMOR URUT" : "SEGMEN 2 HILANG DI TENGAH JALAN", 200);
      hilang(ctx, b, l, { x0: 240, x1: 1680, y: 360, s: 76, fs: 22, py: 290, ay: 245, panelY: 488 });
    },
    k21_latihan(ctx, b, l) {
      const a = A(b), t = [a * 0.08, a * 0.24, a * 0.32, a * 0.4, a * 0.56];
      const nH = [t[1], t[2], t[3]].filter(q => l >= q).length;
      const pkRow = { custom: (ctx, x, y, w) => {
        const rows = [["MAC 5A:2F:…", COL.link], ["IP tujuan 10.0.3.12", COL.ip], ["port 8080, segmen no. 3", COL.tcp]].slice(3 - nH).concat([["isi pesan: foto.jpg bagian 3", COL.app]]);
        rows.forEach(([s, col], i) => { const ind = (rows.length - 1 - i) * 0; ctx.fillStyle = col; rr(ctx, x + ind, y + i * 30, w - ind * 2, 26, 6); ctx.fill(); text(ctx, s, x + w / 2, y + i * 30 + 18, 12, { align: "center", weight: 800, color: "#fff" }); });
        return y + rows.length * 30 + 8; } };
      const lvl = l >= t[4] ? 2 : 0;
      K.halaman(ctx, 250, 190, 1.15, { url: "belajar-informatika.vercel.app/f117", judul: "Pembungkus paket, penghubung topologi, pelacak lompatan",
        rows: [{ tabs: ["1 Pembungkus paket", "2 Penghubung topologi", "3 Pelacak lompatan"], on: -1 },
          lvl === 2 ? { task: "Susun urutan lompatan paket dari HP Sinta sampai server, lalu jawab tiga pertanyaan." } : { task: "Langkah 1: pengirim. Ketuk lapisan berikutnya yang membungkus (dari atas ke bawah)." },
          pkRow, { buttons: ["transport", "internet", "link"], cols: 3, on: -1 }],
        taps: [[0, 0, t[0]], [3, 0, t[1]], [3, 1, t[2]], [3, 2, t[3]], [0, 2, t[4]]] }, l, { h: 535 });
      const n = l < t[0] ? 0 : l < t[4] ? 1 : l < a * 0.72 ? 2 : 3;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN F11.7", ["Klik 1 Pembungkus paket.", "Ketuk transport, internet, lalu link.", "Coba 3 Pelacak lompatan."], n);
      card(ctx, 840, 520, 880, 250, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 565, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Di kertas, gambar paket berlapis untuk satu pesan chat-mu: isi data, port, alamat IP, TTL, dan bingkai.", 870, 610, 28, 820, { weight: 700, lh: 1.3 });
    }
  });

  // ---------- segmen hilang dan kirim ulang (dipakai video dan Short) ----------
  function hilang(ctx, b, l, G) {
    const nodes = ROUTE.dekat.map(n => [n[0], n[1]]), P = drawPath(ctx, G.x0, G.x1, G.y, nodes, { s: G.s, fs: G.fs, sub: false, dead: null });
    const span = G.x1 - G.x0, X = f => G.x0 + span * clamp(f, 0, 1), susun = b.step === "susun";
    let st;
    if (!susun) {
      const c = cues(b, 4, [0.12, 0.3, 0.56, 0.78]);
      const dep = [0.25, 0.75, 1.25], D = clamp((c[0] + 0.3 - dep[1]) / 0.5, 2.4, 6), arr = dep.map(d => d + D);
      const ackDur = Math.max(1.6, D * 0.55), ackS = [Math.max(arr[0], c[1]), null, Math.max(arr[2], c[1] + 0.5)];
      const tOut = c[2] + 1.0, tRe = c[3] + 0.4, Dre = clamp(b.dur - tRe - 0.5, 1.2, D);
      // segmen di jalan
      [0, 1, 2].forEach(i => {
        if (l < dep[i]) return; const f = (l - dep[i]) / D;
        if (i === 1) { if (f < 0.5) segPacket(ctx, X(f), G.py, 2); else if (l < dep[1] + D * 0.5 + 1.4) { const u = (l - dep[1] - D * 0.5) / 1.4; ctx.save(); ctx.globalAlpha = 1 - u; segPacket(ctx, X(0.5), G.py + u * 40, 2, { col: C.bad }); ctx.restore(); text(ctx, "✕", X(0.5), G.py - 34, 44, { align: "center", weight: 900, color: C.bad }); } }
        else if (f < 1) segPacket(ctx, X(f), G.py, i + 1);
      });
      if (l >= dep[1] + D * 0.5) chip(ctx, "R2 penuh: segmen 2 hilang", P[2][0], G.chipY || G.y + G.s * 0.5 + G.fs * 2 + 18, { size: 20, fill: C.badBg, stroke: C.bad, color: C.bad });
      if (l >= tRe) { const f = (l - tRe) / Dre; if (f < 1) segPacket(ctx, X(f), G.py, 2, { col: C.accentDark }); }
      // tanda terima kembali
      [0, 2].forEach(i => { if (l < ackS[i]) return; const f = (l - ackS[i]) / ackDur; if (f < 1) ack(ctx, X(1 - f), G.ay, i + 1); });
      const gotAck = i => (i === 1 ? false : l >= ackS[i] + ackDur);
      const recv = []; [[0, arr[0]], [2, arr[2]], [1, tRe + Dre]].sort((p, q) => p[1] - q[1]).forEach(([i, t]) => { if (l >= t) recv.push(i + 1); });
      st = { got: gotAck, timer: l >= dep[1] ? clamp((l - dep[1]) / (tOut - dep[1]), 0, 1) : 0, out: l >= tOut, re: l >= tRe, recv, sent: dep.map(d => l >= d) };
    } else st = { got: () => true, timer: 1, out: true, re: true, recv: [1, 3, 2], sent: [true, true, true], done: true };
    // panel pengirim
    const py0 = G.panelY, ph = G.panelH || 310;
    card(ctx, G.lx || 170, py0, G.lw || 760, ph, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
    const lx = (G.lx || 170) + 28; text(ctx, "HP Sinta · TCP pengirim", lx, py0 + 44, G.ps || 26, { weight: 900, color: COL.tcp });
    [1, 2, 3].forEach(n => {
      const y = py0 + 70 + (n - 1) * ((ph - 90) / 3), rh = (ph - 90) / 3 - 10; segPacket(ctx, lx + 32, y + rh / 2, n, { w: 52, h: 40 });
      let s, col = C.ink2;
      if (!st.sent[n - 1]) s = "belum dikirim";
      else if (n !== 2) { s = st.got(n - 1) ? "✓ tanda terima datang" : "terkirim, menunggu tanda terima"; if (st.got(n - 1)) col = C.good; }
      else if (st.done) { s = "✓ dikirim ulang, sudah diterima"; col = C.good; }
      else if (st.re) { s = "dikirim ulang!"; col = C.accentDark; }
      else if (st.out) { s = "waktu tunggu habis"; col = C.bad; }
      else s = "menunggu tanda terima…";
      text(ctx, s, lx + 78, y + rh / 2 + 9, G.rs || 26, { weight: 800, color: col, fit: (G.lw || 760) - 200 });
      if (n === 2 && !st.done && st.sent[1]) { const x = lx + (G.lw || 760) - 90, yy = y + rh / 2; ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x, yy, 22, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = st.out ? C.bad : C.accent; ctx.beginPath(); ctx.arc(x, yy, 22, -Math.PI / 2, -Math.PI / 2 + st.timer * Math.PI * 2); ctx.stroke(); }
    });
    // panel penerima
    const rx = G.rx || 990, rw = G.rw || 760, ry = G.ry != null ? G.ry : py0, rph = G.rph || ph;
    card(ctx, rx, ry, rw, rph, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, "server · TCP penerima", rx + 28, ry + 44, G.ps || 26, { weight: 900, color: COL.tcp });
    const sw = G.slotW || 150, sh = sw * 0.62, sy = ry + 70, sx = rx + 40;
    if (!susun) {
      text(ctx, "urutan tiba", rx + rw - 28, ry + 44, G.rs ? G.rs - 4 : 22, { align: "right", weight: 800, color: C.ink2 });
      [0, 1, 2].forEach(j => { const x = sx + j * (sw + 24); if (j < st.recv.length) { photo(ctx, x, sy, sw, sh, st.recv[j] - 1); segPacket(ctx, x + 26, sy + 22, st.recv[j], { w: 40, h: 32 }); } else { ctx.strokeStyle = "#CFDCD5"; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); rr(ctx, x, sy, sw, sh, 8); ctx.stroke(); ctx.setLineDash([]); } });
    } else {
      const u = ease((l - 0.6) / 1.4), merge = ease((l - at(b, "lalu menyerahkan")) / 1.0);
      const order = [1, 3, 2], target = n => n - 1;
      order.forEach((n, j) => { const x0 = sx + j * (sw + 24), x1 = sx + target(n) * (sw + 24), xm = sx + target(n) * sw; const x = lerp(lerp(x0, x1, u), xm, merge), y = sy - Math.sin(Math.PI * u) * (n === 2 || n === 3 ? 26 : 0) * (j === 1 || j === 2 ? 1 : 0);
        photo(ctx, x, y, sw, sh, n - 1); if (merge < 0.5) segPacket(ctx, x + 26, y + 22, n, { w: 40, h: 32 }); });
      text(ctx, u < 1 ? "menyusun: 1, 3, 2 → 1, 2, 3" : "tersusun: 1, 2, 3", rx + rw - 28, ry + 44, G.rs ? G.rs - 4 : 22, { align: "right", weight: 800, color: u < 1 ? C.ink2 : C.good });
      if (merge > 0) { ctx.globalAlpha = merge; chip(ctx, "aplikasi menerima foto utuh ✓", sx + 1.5 * sw + 24, sy + sh + 40, { size: G.rs || 24, fill: C.goodBg, stroke: C.good, color: C.good }); ctx.globalAlpha = 1; }
    }
  }

  // ---------- adegan Short (area 40–1040 × 20–810; crop [40, 20, 1000, 790]) ----------
  Object.assign(K.SCENES, {
    k21s_bungkus(ctx, b, l) {
      const fr = b.fr || [0.32, 0.55, 0.78], T = fr.map(f => lead(b) + f * A(b));
      const labs = [["aplikasi: isi permintaan", COL.app], ["+ TCP: port dan nomor urut", COL.tcp], ["+ IP: alamat tujuan dan TTL", COL.ip], ["+ link: bingkai lompatan pertama", COL.link]];
      labs.forEach(([s, col], i) => {
        const show = i === 0 ? 1 : clamp((l - T[i - 1]) / 0.6, 0, 1); if (show <= 0) return; const y = 40 + i * 192;
        ctx.save(); ctx.globalAlpha = show; text(ctx, s, 60, y + 34, 32, { weight: 900, color: col });
        drawPacket(ctx, 60, y + 56, blocks({ kind: "web" }), { k: i, hw: 222, dw: 294, h: 112, fs: 27, slide: i ? show : null }); ctx.restore();
      });
    },
    k21s_lompat(ctx, b, l) {
      const ttl0 = b.ttl || 64;
      const R = lompat(ctx, b, l, { x0: 110, x1: 970, y: 210, py: 120, s: b.route === "jauh" ? 58 : 72, fs: b.route === "jauh" ? 24 : 28, tag: 44, tagSize: 26, tagW: 124, sub: false }), S = R.S;
      card(ctx, 60, 340, 440, 300, { fill: S.dropped ? C.badBg : "#fff", stroke: S.dropped ? C.bad : COL.ip, lw: 5, r: 22 });
      text(ctx, "TTL", 280, 400, 36, { align: "center", weight: 900, color: COL.ip });
      const fl = S.arrived > 0 && S.since < 0.9 && !S.atServer;
      text(ctx, String(S.ttl), 280, 560, 150, { align: "center", weight: 900, color: S.dropped || fl ? C.bad : C.ink });
      card(ctx, 540, 340, 480, 300, { fill: "#fff", stroke: COL.link, lw: 5, r: 22 });
      text(ctx, "bingkai sekarang", 780, 400, 32, { align: "center", weight: 900, color: COL.link });
      const sw = S.arrived > 0 && S.since < 0.6 && !S.dropped ? ease(S.since / 0.6) : 1;
      ctx.save(); ctx.globalAlpha = sw; text(ctx, S.dropped ? "—" : "ke " + (S.next || "server"), 780, 505 - (1 - sw) * 30, 72, { align: "center", weight: 900 }); if (!S.dropped) text(ctx, "dari " + (S.next ? S.cur : R.nodes[R.nL - 1][0]), 780, 575, 34, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
      const [msg, col] = hopLog(S, R.ip, R.nodes, ttl0);
      card(ctx, 60, 670, 960, 110, { fill: S.dropped ? C.badBg : S.atServer ? C.goodBg : C.bg2, r: 18 }); para(ctx, msg, 540, 712, 32, 900, { align: "center", weight: 900, color: col, lh: 1.2 });
    },
    k21s_hilang(ctx, b, l) {
      hilang(ctx, b, l, { x0: 110, x1: 970, y: 200, s: 64, fs: 26, py: 118, ay: 62, panelY: 322, panelH: 234, chipY: 294, lx: 60, lw: 960, rx: 60, rw: 960, ry: 570, rph: 236, ps: 30, rs: 30, slotW: 160 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
