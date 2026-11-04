/* K10 Simulasi konsep: perjalanan paket dari HP ke server (episode induk D9.2).
   Muat setelah kiko-core.js, kiko-devices.js, D9.2/jaringan.js, D9.2/scenes.js. Semua adegan berawalan k10_.
   Peta jaringan di kiri (kartu x 120–1420), panel "DI SERVER" di kanan (x 1440–1820). Semua gambar di atas y 830.
   Waktu animasi dihitung sebagai pecahan dari lama narasi beat (b.audio || b.dur), jadi selalu sinkron dengan suara.
   Semua alamat IP dan nama rekaan (192.168.x.x, 203.0.113.x). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan, D = K.devices;
  const { rr, text, para, card, kiko, kid, bubble, ease, clamp, lerp, arrowIcon, wrap } = H;

  // ---------- peta jaringan ----------
  const N = { hp: [210, 440], r0: [420, 440], A: [620, 440], B: [870, 262], C: [800, 628], D: [1040, 628], E: [1170, 440], S: [1312, 440] };
  const TOP = ["hp", "r0", "A", "B", "E", "S"], BOT = ["hp", "r0", "A", "C", "D", "E", "S"];
  const pts = r => r.map(k => N[k]);
  const MSG = ["Kerja", "kelompok", "jam tiga", "di kantin"];
  const IP_HP = "192.168.1.20", IP_SV = "203.0.113.10";
  const RED = C.bad, GREEN = C.good, BLUE = C.kiko;

  const mk = (n, route, t0, d, extra = {}) => ({ n, route, t0, t1: t0 + d, ...extra });
  const VAR = {
    v1: { no: 1, name: "SEMUA LANCAR", count: 4, packets: [1, 2, 3, 4].map((n, i) => mk(n, TOP, 0.05 + i * 0.12, 0.42)), done: "Pesan utuh: Kerja kelompok jam tiga di kantin" },
    v2: { no: 2, name: "TIBA TIDAK URUT", count: 4, packets: [mk(1, BOT, 0.04, 0.6), mk(2, TOP, 0.1, 0.34), mk(3, BOT, 0.16, 0.6), mk(4, TOP, 0.22, 0.34)] },
    v3: { no: 3, name: "SATU PAKET HILANG", count: 4, busyC: true, packets: [mk(1, TOP, 0.04, 0.36), mk(2, TOP, 0.11, 0.36), mk(3, BOT, 0.18, 0.56, { lost: 0.5 }), mk(4, TOP, 0.25, 0.36)], missing: 3, missAt: 0.68 },
    v3b: { no: 3, name: "SATU PAKET HILANG", count: 4, busyC: true, pre: [1, 2, 4], req: { n: 3, t0: 0.04, t1: 0.36 }, packets: [mk(3, TOP, 0.42, 0.36, { color: BLUE })], done: "Pesan lengkap setelah paket 3 dikirim ulang" },
    v4: { no: 4, name: "JALAN MACET", count: 4, jamB: true, packets: [1, 2, 3, 4].map((n, i) => mk(n, BOT, 0.08 + i * 0.09, 0.5)), done: "Jalan memutar, pesan tetap utuh" },
    v5: { no: 5, name: "PESAN LEBIH BESAR", count: 12, photo: true, packets: Array.from({ length: 12 }, (_, i) => i % 2 ? mk(i + 1, BOT, 0.03 + i * 0.036, 0.4) : mk(i + 1, TOP, 0.03 + i * 0.036, 0.28)), done: "12 paket tersusun menjadi satu foto" }
  };
  const spanOf = b => Math.max(3, b.audio || b.dur);
  const arrivals = (v, f) => {
    const a = (v.pre || []).map(n => ({ n, at: -1 }));
    v.packets.forEach(p => { if (p.lost == null && f >= p.t1) a.push({ n: p.n, at: p.t1 }); });
    return a.sort((x, y) => x.at - y.at);
  };
  const doneAt = v => Math.max(...v.packets.filter(p => p.lost == null).map(p => p.t1));

  function badge(ctx, v, opt = {}) {
    const s = "VARIASI " + v.no + " · " + v.name; ctx.font = "900 24px Inter"; const w = ctx.measureText(s).width + 40;
    ctx.fillStyle = opt.fill || C.kiko; rr(ctx, 150, 172, w, 46, 23); ctx.fill();
    text(ctx, s, 170, 204, 24, { weight: 900, color: "#fff" });
  }
  // peta lengkap; opt.show = jumlah bagian yang tampak (untuk adegan pengenalan), opt.jamB, opt.busyC, opt.hl = rute disorot
  function map(ctx, l, opt = {}) {
    const show = opt.show == null ? 9 : opt.show;
    const vis = (k, f) => { ctx.save(); ctx.globalAlpha = k < show ? 1 : 0.1; f(); ctx.restore(); };
    // kabel
    const lines = [["A", "B", 3, "top"], ["B", "E", 3, "top"], ["A", "C", 4, "bot"], ["C", "D", 4, "bot"], ["D", "E", 4, "bot"], ["r0", "A", 2], ["E", "S", 5]];
    lines.forEach(([a, b2, k, r]) => vis(k, () => {
      const hl = opt.hl && opt.hl === r;
      J.cable(ctx, [N[a], N[b2]], { color: hl ? (r === "top" ? "#E8A93A" : "#5FA8D3") : "#B7C4CC", lw: hl ? 10 : 7 });
    }));
    vis(1, () => { J.cable(ctx, [N.hp, N.r0], { color: "#B7C4CC", dash: true }); J.waves(ctx, 315, 430, 14, 3); text(ctx, "Wi-Fi", 315, 378, 20, { align: "center", weight: 800, color: C.ink2 }); });
    vis(0, () => { J.phoneSmall(ctx, N.hp[0], N.hp[1], 120, { label: "HP Sinta" }); J.ipTag(ctx, N.hp[0], N.hp[1] + 120, IP_HP, { w: 176 }); });
    if (opt.jamB && show >= 4) jam(ctx, l);
    const rt = (k, lab, o = {}) => { J.router(ctx, N[k][0], N[k][1], 90, { label: false, ...o }); tag(ctx, lab, N[k][0], N[k][1] + 50); };
    vis(1, () => rt("r0", "router rumah"));
    vis(2, () => rt("A", "router A (ISP)"));
    vis(3, () => rt("B", "router B", { alert: opt.jamB }));
    vis(4, () => { rt("C", "router C", { alert: opt.busyC }); rt("D", "router D"); });
    vis(3, () => rt("E", "router E"));
    vis(5, () => { J.server(ctx, N.S[0], N.S[1], 100, 170, { label: false, tick: Math.floor(l * 2) }); tag(ctx, "server grup kelas", N.S[0], N.S[1] + 100); J.ipTag(ctx, N.S[0], N.S[1] + 156, IP_SV, { w: 176 }); });
    if (show >= 6) {
      vis(3, () => text(ctx, opt.topLab || "jalan atas", 790, 300, 24, { align: "right", weight: 900, color: "#B57A12" }));
      vis(4, () => text(ctx, opt.botLab || "jalan bawah", 735, 604, 24, { align: "right", weight: 900, color: "#2E7E9A" }));
    }
    if (opt.busyC) { text(ctx, "sibuk!", N.C[0] + 10, N.C[1] - 66, 24, { align: "center", weight: 900, color: RED }); }
  }
  // label berlatar putih supaya tidak tertimpa kabel
  function tag(ctx, s, x, y) { ctx.font = "800 21px Inter"; const w = ctx.measureText(s).width + 16; ctx.fillStyle = "rgba(255,255,255,0.92)"; rr(ctx, x - w / 2, y - 4, w, 30, 8); ctx.fill(); text(ctx, s, x, y + 18, 21, { align: "center", weight: 800, color: C.ink2 }); }
  // antrean paket lain (abu-abu) yang berputar di sekitar router B
  function jam(ctx, l) {
    ctx.fillStyle = "rgba(217,68,59,0.16)"; ctx.beginPath(); ctx.arc(N.B[0], N.B[1] - 4, 74, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(N.B[0], N.B[1] - 4, 74, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    for (let i = 0; i < 6; i++) { const u = 0.3 + i * 0.09 + 0.01 * Math.sin(l * 3 + i), p = J.along([N.A, N.B], u); J.packet(ctx, p[0], p[1], null, { color: "#9AAFA6" }); }
    for (let i = 0; i < 3; i++) { const u = 0.12 + i * 0.12, p = J.along([N.B, N.E], u); J.packet(ctx, p[0], p[1], null, { color: "#9AAFA6" }); }
    text(ctx, "macet!", N.B[0] + 92, N.B[1] - 40, 30, { weight: 900, color: RED });
  }

  // paket yang menunggu di HP, yang sedang berjalan, dan yang hilang
  function packets(ctx, v, f, span) {
    const wait = v.packets.filter(p => f < p.t0);
    wait.forEach((p, i) => J.packet(ctx, 150 + (i % 6) * 47, 330 - Math.floor(i / 6) * 40, p.n, { color: p.color }));
    v.packets.forEach(p => {
      if (f < p.t0 || f >= p.t1) return;
      const u = (f - p.t0) / (p.t1 - p.t0), path = pts(p.route);
      if (p.lost != null && u >= p.lost) {
        const age = (u - p.lost) * (p.t1 - p.t0) * span; if (age > 2.2) return;
        const [x, y] = J.along(path, p.lost); ctx.save(); ctx.globalAlpha = clamp(1 - age / 2.2, 0, 1);
        J.packet(ctx, x, y - age * 14, p.n, { color: RED }); text(ctx, "✕", x + 34, y - age * 14 + 12, 34, { weight: 900, color: RED }); ctx.restore();
        return;
      }
      const [x, y] = J.along(path, u); J.packet(ctx, x, y, p.n, { color: p.color });
    });
    if (v.req && f >= v.req.t0 && f < v.req.t1) { // permintaan kirim ulang: server → HP lewat jalan atas
      const u = (f - v.req.t0) / (v.req.t1 - v.req.t0), [x, y] = J.along(pts(TOP).slice().reverse(), u);
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 8; ctx.fillStyle = GREEN; rr(ctx, x - 62, y - 18, 124, 36, 8); ctx.fill(); ctx.restore();
      text(ctx, "ulang 3?", x, y + 8, 20, { align: "center", weight: 900, color: "#fff" });
    }
  }
  // panel kanan: tempat paket di server, disusun menurut nomor
  function serverPanel(ctx, v, f, span) {
    card(ctx, 1440, 150, 380, 670, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 20 });
    text(ctx, "DI SERVER", 1630, 196, 26, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, "disusun menurut nomor", 1630, 228, 20, { align: "center", weight: 700, color: C.ink2 });
    const arr = arrivals(v, f), got = new Set(arr.map(a => a.n));
    const fresh = n => { const a = arr.find(x => x.n === n); return a && a.at >= 0 ? clamp((f - a.at) * span / 0.7, 0, 1) : 1; };
    const missing = v.missing && f >= v.missAt ? v.missing : null;
    if (!v.photo) {
      for (let i = 0; i < v.count; i++) {
        const n = i + 1, y = 252 + i * 84, on = got.has(n), u = fresh(n), miss = missing === n;
        if (on) { const pop = 1 + 0.08 * Math.sin(Math.PI * u) ; ctx.save(); ctx.translate(1630, y + 36); ctx.scale(pop, pop); ctx.translate(-1630, -(y + 36)); card(ctx, 1462, y, 336, 72, { fill: u < 1 ? "#FFF3D6" : C.goodBg, stroke: u < 1 ? C.accent : GREEN, lw: 3, r: 12 }); ctx.restore(); }
        else { ctx.strokeStyle = miss ? RED : "#C9D4DB"; ctx.lineWidth = miss ? 4 : 3; ctx.setLineDash([10, 8]); rr(ctx, 1462, y, 336, 72, 12); ctx.stroke(); ctx.setLineDash([]); }
        ctx.fillStyle = on ? (v.pre && v.pre.indexOf(n) < 0 && v.req ? BLUE : C.accent) : miss ? RED : "#C9D4DB"; ctx.beginPath(); ctx.arc(1500, y + 36, 22, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(n), 1500, y + 44, 22, { align: "center", weight: 900, color: "#fff" });
        if (on) text(ctx, MSG[i], 1540, y + 46, 30, { weight: 800 });
        else if (miss) text(ctx, "belum datang", 1540, y + 45, 26, { weight: 900, color: RED });
      }
      const order = arr.map(a => a.n);
      text(ctx, "urutan datang:", 1630, 622, 22, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, order.length ? order.join(" · ") : "–", 1630, 664, 34, { align: "center", weight: 900, color: order.some((n, i) => n !== i + 1) ? RED : C.ink });
    } else {
      for (let i = 0; i < 12; i++) {
        const n = i + 1, c = i % 3, r = Math.floor(i / 3), x = 1466 + c * 112, y = 250 + r * 86, on = got.has(n), u = fresh(n);
        if (on) { ctx.save(); rr(ctx, x, y, 106, 80, 6); ctx.clip(); photo(ctx, 1466, 250, 330, 340); ctx.restore(); if (u < 1) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, x, y, 106, 80, 6); ctx.stroke(); } }
        else { ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); rr(ctx, x, y, 106, 80, 6); ctx.stroke(); ctx.setLineDash([]); }
        ctx.fillStyle = on ? "rgba(31,42,51,0.55)" : "#C9D4DB"; rr(ctx, x + 4, y + 4, 34, 24, 6); ctx.fill(); text(ctx, String(n), x + 21, y + 22, 17, { align: "center", weight: 900, color: "#fff" });
      }
      text(ctx, "paket tiba:", 1630, 622, 22, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, got.size + " dari 12", 1630, 664, 34, { align: "center", weight: 900 });
    }
    if (got.size === v.count) { card(ctx, 1470, 700, 320, 90, { fill: C.goodBg, stroke: GREEN, lw: 4, r: 14 }); text(ctx, v.photo ? "✓ foto utuh" : "✓ pesan utuh", 1630, 758, 32, { align: "center", weight: 900, color: GREEN }); }
    else if (missing) { card(ctx, 1470, 700, 320, 90, { fill: C.badBg, stroke: RED, lw: 4, r: 14 }); text(ctx, "nomor 3 kosong!", 1630, 758, 30, { align: "center", weight: 900, color: RED }); }
  }
  // foto rekaan: semangkuk bakso di meja kantin
  function photo(ctx, x, y, w, h) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, "#FFE7B8"); g.addColorStop(1, "#FBD38D"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#F7F1E3"; rr(ctx, x + w * 0.62, y + h * 0.08, w * 0.3, h * 0.22, 8); ctx.fill(); ctx.fillStyle = "#E0B04B"; ctx.fillRect(x + w * 0.66, y + h * 0.14, w * 0.22, h * 0.03); ctx.fillRect(x + w * 0.66, y + h * 0.2, w * 0.16, h * 0.03);
    ctx.fillStyle = C.tableTop; ctx.fillRect(x, y + h * 0.62, w, h * 0.38); ctx.fillStyle = C.table; ctx.fillRect(x, y + h * 0.62, w, h * 0.04);
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(x + w * 0.45, y + h * 0.72, w * 0.36, h * 0.09, 0, 0, Math.PI * 2); ctx.fill();
    H.bakso(ctx, x + w * 0.45, y + h * 0.56, Math.min(w, h) * 0.62);
    ctx.fillStyle = "#D9443B"; rr(ctx, x + w * 0.84, y + h * 0.5, w * 0.1, h * 0.22, 6); ctx.fill(); ctx.fillStyle = "#2E9E5B"; ctx.fillRect(x + w * 0.86, y + h * 0.46, w * 0.06, h * 0.05);
    ctx.restore();
  }
  function bannerMap(ctx, s, opt = {}) {
    const w = opt.w || 1120; card(ctx, 770 - w / 2, 722, w, 82, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 18 });
    text(ctx, s, 770, 775, opt.size || 32, { align: "center", weight: 900, color: opt.color || C.ink, fit: w - 40 });
  }
  function think(ctx, l, b, x, y) { // cincin waktu menebak
    const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
  }

  Object.assign(K.SCENES, {
    k10_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["memecah pesan menjadi paket bernomor", "mengikuti paket dari router ke router", "menyusun ulang paket di server", "menjelaskan paket hilang dan jalan macet"].forEach((s, i) => {
        const u = ease((l - 0.8 - i * 0.9) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 860, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      J.phoneSmall(ctx, 1260, 470, 150); J.server(ctx, 1600, 470, 110, 190, { label: false, tick: Math.floor(l * 2) });
      J.cable(ctx, [[1310, 470], [1540, 470]], { color: "#B7C4CC", lw: 6 });
      const u = (l * 0.35) % 1; [0, 1, 2].forEach(k => { const uu = (u + k * 0.25) % 1; J.packet(ctx, lerp(1320, 1530, uu), 470, k + 1, {}); });
      text(ctx, "HP → server", 1430, 640, 28, { align: "center", weight: 900, color: C.ink2 });
    },
    k10_prasyarat(ctx, b, l) {
      card(ctx, 260, 180, 1400, 620);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 270, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 420, 320, 1080, 300, { fill: C.bg2, r: 22 });
      text(ctx, "D9.2", 960, 410, 64, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Jaringan Lokal dan Internet", 960, 480, 42, { align: "center", weight: 800 });
      text(ctx, "router · alamat IP · ISP · server · paket", 960, 560, 28, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1580, 730, 120, 0, { wave: l });
    },
    k10_peta(ctx, b, l) {
      const span = spanOf(b), f = l / span;
      card(ctx, 120, 150, 1700, 670);
      text(ctx, "JALUR PESAN: DARI HP SINTA KE SERVER GRUP KELAS", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      const show = f < 0.12 ? 1 : f < 0.3 ? 2 : f < 0.5 ? 3 : f < 0.62 ? 5 : f < 0.8 ? 6 : 7;
      ctx.save(); ctx.translate(190, 20); map(ctx, l, { show: Math.min(show, 6) }); ctx.restore();
      if (f > 0.3 && f < 0.62) text(ctx, "router lain di internet", 1030, 820 - 60, 24, { align: "center", weight: 800, color: C.ink2 });
      if (show >= 7) { card(ctx, 360, 730, 1200, 72, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, "router = persimpangan yang meneruskan paket ke arah tujuannya", 960, 776, 28, { align: "center", weight: 900 }); }
    },
    k10_pecah(ctx, b, l) {
      const span = spanOf(b), f = l / span;
      card(ctx, 120, 150, 1680, 670);
      kid(ctx, 290, 560, 120, { hair: "long", point: true }); text(ctx, "Sinta", 290, 700, 26, { align: "center", weight: 900, color: C.ink2 });
      bubble(ctx, 170, 410, 400, "Kerja kelompok jam tiga di kantin", 30, { tailX: 300 });
      const n = clamp(Math.floor((f - 0.22) / 0.07) + 1, 0, 4);
      if (n > 0) arrowIcon(ctx, "east", 605, 470, 44, C.ink2);
      const field = f < 0.62 ? -1 : f < 0.72 ? 0 : f < 0.8 ? 1 : f < 0.88 ? 2 : 3;
      for (let i = 0; i < n; i++) {
        const x = 660 + i * 278, y = 250, w = 252, h = 440;
        card(ctx, x, y, w, h, { fill: "#FFFDF4", stroke: C.accent, lw: 4, r: 16 });
        ctx.fillStyle = C.accent; rr(ctx, x, y, w, 74, 16); ctx.fill(); ctx.fillRect(x, y + 50, w, 24);
        text(ctx, "PAKET " + (i + 1), x + w / 2, y + 36, 28, { align: "center", weight: 900, color: "#fff" }); text(ctx, "dari 4", x + w / 2, y + 64, 20, { align: "center", weight: 800, color: "#fff" });
        const rows = [["nomor urut", (i + 1) + " / 4"], ["ke (tujuan)", IP_SV], ["dari (pengirim)", IP_HP], ["isi", "“" + MSG[i] + "”"]];
        rows.forEach(([k, v], j) => {
          const yy = y + 100 + j * 82, on = field === j || field === 3 && j === 3;
          if (on) { ctx.fillStyle = "#FFE9B0"; rr(ctx, x + 8, yy - 6, w - 16, 74, 10); ctx.fill(); }
          text(ctx, k, x + 18, yy + 20, 19, { weight: 800, color: C.ink2 });
          text(ctx, v, x + 18, yy + 54, j === 3 ? 28 : 23, { weight: 900, color: j === 3 ? C.kikoDark : C.ink, fit: w - 30 });
        });
      }
      if (n >= 4 && f > 0.55) text(ctx, "satu pesan → empat paket kecil", 1210, 760, 28, { align: "center", weight: 900, color: C.accentDark });
    },
    k10_router(ctx, b, l) {
      const span = spanOf(b), f = l / span;
      card(ctx, 120, 150, 1680, 670);
      text(ctx, "YANG DIBACA ROUTER: ALAMAT TUJUAN", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      J.router(ctx, 960, 500, 200, { label: false }); tag(ctx, "router A", 960, 570);
      // paket besar datang dari kiri
      const u = ease(f / 0.22), px = lerp(240, 470, u);
      card(ctx, px - 160, 330, 320, 260, { fill: "#FFFDF4", stroke: C.accent, lw: 4, r: 14 });
      ctx.fillStyle = C.accent; rr(ctx, px - 160, 330, 320, 56, 14); ctx.fill(); ctx.fillRect(px - 160, 366, 320, 20); text(ctx, "PAKET 2", px, 368, 26, { align: "center", weight: 900, color: "#fff" });
      const look = f > 0.2;
      if (look) { ctx.fillStyle = "#FFE9B0"; rr(ctx, px - 148, 400, 296, 70, 10); ctx.fill(); ctx.strokeStyle = C.kiko; ctx.lineWidth = 4; rr(ctx, px - 148, 400, 296, 70, 10); ctx.stroke(); }
      text(ctx, "ke: " + IP_SV, px, 444, 26, { align: "center", weight: 900 });
      ctx.save(); if (look) ctx.globalAlpha = 0.3; text(ctx, "isi: “kelompok”", px, 540, 26, { align: "center", weight: 800, color: C.kikoDark }); ctx.restore();
      if (look) { // panah dari router ke baris alamat: "dibaca"
        ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(850, 480); ctx.lineTo(px + 160, 435); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "✓ dibaca", (850 + px + 160) / 2, 430, 24, { align: "center", weight: 900, color: C.kiko });
      }
      if (f > 0.3) { text(ctx, "✕ isi pesan tidak dibaca", px, 640, 24, { align: "center", weight: 900, color: C.ink2 }); }
      // dua jalan keluar menuju server
      if (f > 0.5) {
        J.cable(ctx, [[1070, 470], [1290, 330]], { color: "#E8A93A", lw: 10 }); J.cable(ctx, [[1070, 530], [1290, 660]], { color: "#5FA8D3", lw: 10 });
        J.router(ctx, 1360, 330, 90, { label: false }); tag(ctx, "router B · jalan atas", 1360, 380);
        J.router(ctx, 1360, 660, 90, { label: false }); tag(ctx, "router C · jalan bawah", 1360, 710);
        J.cable(ctx, [[1440, 330], [1560, 330], [1560, 660], [1440, 660]], { color: "#B7C4CC", lw: 6, dash: true });
        J.server(ctx, 1660, 495, 90, 150, { label: false, tick: Math.floor(l * 2) }); tag(ctx, "server", 1660, 590);
      }
      if (f > 0.68) { const uu = ((l - 0.68 * span) / 1.6) % 1; const p = J.along([[960, 500], [1070, 470], [1290, 330]], uu); J.packet(ctx, p[0], p[1], 2, {}); }
    },
    // pertanyaan "Menurutmu, apa yang terjadi kalau …?" dan jeda menebak
    k10_tanya(ctx, b, l) {
      const v = VAR[b.var];
      card(ctx, 120, 150, 1300, 670); serverPanel(ctx, v, 0, 1);
      badge(ctx, v);
      ctx.save(); ctx.translate(0, -10); map(ctx, l, { jamB: v.jamB, busyC: v.busyC, show: 9, hl: v.no === 1 ? "top" : null, topLab: v.no === 2 ? "jalan atas: 2 dan 4" : null, botLab: v.no === 2 ? "jalan bawah: 1 dan 3" : null }); packets(ctx, v, 0, 1); ctx.restore();
      card(ctx, 150, 712, 1240, 96, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 });
      text(ctx, "MENURUTMU, APA YANG TERJADI KALAU", 180, 748, 20, { weight: 900, color: C.accentDark });
      text(ctx, b.q, 180, 790, 30, { weight: 900, fit: b.think ? 1080 : 1180 });
      if (b.think) { think(ctx, l, b, 1340, 760); text(ctx, "?", 1630, 560, 120, { align: "center", weight: 900, color: "rgba(46,126,154,0.25)" }); }
    },
    k10_jalan(ctx, b, l) {
      const v = VAR[b.var], span = spanOf(b), f = b.final ? 1.5 : l / span;
      card(ctx, 120, 150, 1300, 670); badge(ctx, v);
      ctx.save(); ctx.translate(0, -10); map(ctx, l, { jamB: v.jamB, busyC: v.busyC }); packets(ctx, v, f, span); ctx.restore();
      serverPanel(ctx, v, f, span);
      if (v.jamB && f > 0.06 && f < 0.6) { card(ctx, 150, 636, 320, 60, { fill: "#fff", stroke: "#2E7E9A", lw: 3, r: 12 }); text(ctx, "B macet → lewat C", 310, 676, 24, { align: "center", weight: 900, color: "#2E7E9A" }); }
      if (v.req && f > 0.36 && f < 0.5) { card(ctx, 150, 636, 320, 60, { fill: "#fff", stroke: BLUE, lw: 3, r: 12 }); text(ctx, "kirim ulang paket 3", 310, 676, 24, { align: "center", weight: 900, color: BLUE }); }
      const fin = v.done && f >= doneAt(v) + 0.03;
      if (fin && (b.final || f > 0.86)) bannerMap(ctx, v.done, { fill: C.goodBg, stroke: GREEN, color: C.ink });
      if (b.final && v.no === 4) { /* sorot jalan bawah yang dipakai */ }
    },
    k10_urutan(ctx, b, l) {
      const span = spanOf(b), f = l / span;
      card(ctx, 120, 150, 1680, 670);
      text(ctx, "DUA CARA MENYUSUN PAKET YANG TIBA: 2, 4, 1, 3", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      const row = (y, label, order, good, u) => {
        ctx.save(); ctx.globalAlpha = u;
        text(ctx, label, 200, y, 28, { weight: 900, color: good ? GREEN : RED });
        order.forEach((n, i) => { const x = 200 + i * 330; card(ctx, x, y + 24, 300, 110, { fill: good ? C.goodBg : C.badBg, stroke: good ? GREEN : RED, lw: 3, r: 14 }); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x + 42, y + 79, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x + 42, y + 88, 24, { align: "center", weight: 900, color: "#fff" }); text(ctx, MSG[n - 1], x + 80, y + 92, 34, { weight: 900 }); });
        text(ctx, good ? "✓" : "✕", 1580, y + 100, 64, { weight: 900, color: good ? GREEN : RED });
        ctx.restore();
      };
      row(290, "Menurut urutan datang: 2, 4, 1, 3", [2, 4, 1, 3], false, ease(f / 0.12));
      if (f > 0.25) text(ctx, "“kelompok di kantin Kerja jam tiga” → kacau", 960, 478, 26, { align: "center", weight: 800, color: RED });
      row(540, "Menurut nomor paket: 1, 2, 3, 4", [1, 2, 3, 4], true, ease((f - 0.42) / 0.12));
      if (f > 0.62) text(ctx, "“Kerja kelompok jam tiga di kantin” → sama dengan aslinya", 960, 728, 26, { align: "center", weight: 800, color: GREEN });
    },
    k10_besar(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670);
      text(ctx, "VARIASI 5 · PESAN LEBIH BESAR", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 270, 620, 400, { fill: C.bg2, r: 20 }); text(ctx, "pesan teks", 530, 320, 28, { align: "center", weight: 900, color: C.ink2 });
      card(ctx, 290, 360, 480, 80, { fill: "#fff", r: 14 }); text(ctx, "Kerja kelompok jam tiga di kantin", 530, 410, 24, { align: "center", weight: 800 });
      [1, 2, 3, 4].forEach((n, i) => J.packet(ctx, 425 + i * 70, 520, n, {})); text(ctx, "4 paket", 530, 600, 30, { align: "center", weight: 900 });
      card(ctx, 1000, 270, 700, 400, { fill: C.bg2, r: 20 }); text(ctx, "foto bakso dari kantin", 1350, 320, 28, { align: "center", weight: 900, color: C.ink2 });
      photo(ctx, 1170, 345, 360, 230); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; rr(ctx, 1170, 345, 360, 230, 8); ctx.stroke();
      text(ctx, "? paket", 1350, 630, 34, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 360, 712, 1200, 96, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 });
      text(ctx, "MENURUTMU, APA YANG TERJADI KALAU", 390, 748, 20, { weight: 900, color: C.accentDark });
      text(ctx, "data yang dikirim jauh lebih besar?", 390, 790, 30, { weight: 900 });
      if (b.think) think(ctx, l, b, 1500, 760);
    },
    k10_foto(ctx, b, l) {
      const span = spanOf(b), f = l / span;
      card(ctx, 120, 150, 1680, 670);
      text(ctx, "DI SERVER: POTONGAN DIPASANG MENURUT NOMOR", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      const X = 220, Y = 260, W = 660, Hh = 480, order = [1, 3, 2, 5, 4, 7, 6, 9, 8, 11, 10, 12];
      const k = clamp(Math.floor(f / 0.04) + 1, 0, 12);
      ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); rr(ctx, X, Y, W, Hh, 10); ctx.stroke(); ctx.setLineDash([]);
      order.slice(0, k).forEach(n => { const i = n - 1, c = i % 3, r = Math.floor(i / 3), w = W / 3, h = Hh / 4; ctx.save(); ctx.beginPath(); ctx.rect(X + c * w, Y + r * h, w, h); ctx.clip(); photo(ctx, X, Y, W, Hh); ctx.restore(); });
      const lines = clamp(1 - (f - 0.55) / 0.15, 0, 1);
      if (lines > 0) for (let i = 0; i < 12; i++) { const c = i % 3, r = Math.floor(i / 3), w = W / 3, h = Hh / 4; ctx.save(); ctx.globalAlpha = lines; ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.strokeRect(X + c * w, Y + r * h, w, h); ctx.fillStyle = "rgba(31,42,51,0.55)"; rr(ctx, X + c * w + 8, Y + r * h + 8, 44, 30, 6); ctx.fill(); text(ctx, String(i + 1), X + c * w + 30, Y + r * h + 31, 20, { align: "center", weight: 900, color: "#fff" }); ctx.restore(); }
      if (f > 0.6) { text(ctx, "✓ foto utuh", X + W / 2, Y + Hh + 50, 32, { align: "center", weight: 900, color: GREEN }); }
      // kanan: foto sungguhan = ribuan paket
      if (f > 0.55) {
        card(ctx, 1000, 260, 700, 480, { fill: C.bg2, r: 20 });
        text(ctx, "foto dari kamera HP", 1350, 312, 28, { align: "center", weight: 900, color: C.ink2 });
        const m = Math.floor(clamp((f - 0.55) / 0.3, 0, 1) * 96);
        for (let i = 0; i < m; i++) { const c = i % 16, r = Math.floor(i / 16); ctx.fillStyle = C.accent; rr(ctx, 1052 + c * 37, 350 + r * 40, 30, 30, 5); ctx.fill(); }
        text(ctx, "… ribuan paket kecil", 1350, 640, 34, { align: "center", weight: 900, color: C.accentDark });
        text(ctx, "semuanya bernomor dan beralamat", 1350, 690, 26, { align: "center", weight: 700, color: C.ink2 });
      }
    },
    k10_banding(ctx, b, l) {
      const span = spanOf(b), f = l / span;
      card(ctx, 120, 140, 1680, 690);
      text(ctx, "LIMA VARIASI, SATU HASIL: PESAN UTUH", 960, 200, 30, { align: "center", weight: 900, color: C.accentDark });
      const rows = [["1", "Semua lancar", "tiba urut: 1, 2, 3, 4", "langsung disusun"], ["2", "Jalan berbeda", "tiba tidak urut: 2, 4, 1, 3", "disusun menurut nomor"], ["3", "Paket hilang", "nomor 3 kosong", "server minta kirim ulang"], ["4", "Jalan macet", "router B penuh antrean", "router A memilih jalan lain"], ["5", "Pesan besar", "foto menjadi 12 paket", "dipasang seperti puzzle"]];
      text(ctx, "VARIASI", 230, 252, 20, { weight: 900, color: C.ink2 }); text(ctx, "YANG TERJADI", 700, 252, 20, { weight: 900, color: C.ink2 }); text(ctx, "YANG DILAKUKAN", 1200, 252, 20, { weight: 900, color: C.ink2 });
      const n = clamp(Math.floor((f - 0.08) / 0.1) + 1, 0, 5);
      rows.forEach(([k, a, bb, c], i) => {
        ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.15; const y = 272 + i * 104;
        card(ctx, 180, y, 1560, 90, { fill: i % 2 ? "#F7FAF8" : C.bg2, r: 14 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(230, y + 45, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, k, 230, y + 55, 26, { align: "center", weight: 900, color: "#fff" });
        text(ctx, a, 280, y + 56, 30, { weight: 900 }); text(ctx, bb, 700, y + 56, 28, { weight: 700, color: C.ink2 }); text(ctx, "✓ " + c, 1200, y + 56, 28, { weight: 800, color: GREEN, fit: 520 });
        ctx.restore();
      });
    },
    k10_latihan(ctx, b, l) {
      const span = spanOf(b), f = l / span;
      card(ctx, 160, 150, 1600, 670);
      text(ctx, "COBA SENDIRI DI HALAMAN LATIHAN", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      // jendela browser generik dengan halaman latihan D9.2
      card(ctx, 230, 250, 900, 540, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 16 });
      ctx.fillStyle = "#EEF2F4"; rr(ctx, 232, 252, 896, 56, 14); ctx.fill(); ctx.fillRect(232, 290, 896, 18);
      [0, 1, 2].forEach(i => { ctx.fillStyle = ["#E5867E", "#EBC56A", "#7FC79A"][i]; ctx.beginPath(); ctx.arc(262 + i * 26, 280, 8, 0, Math.PI * 2); ctx.fill(); });
      card(ctx, 360, 262, 560, 36, { fill: "#fff", r: 18 }); text(ctx, "belajar-informatika.vercel.app/d92", 640, 288, 20, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "Latihan: perjalanan pesan", 270, 356, 30, { weight: 900 });
      const btns = ["1 Susun perjalanan pesan", "2 Simulasi paket", "3 Cari yang putus"]; let bx = 270;
      const pressed = f > 0.3;
      btns.forEach((s, i) => { ctx.font = "800 20px Inter"; const w = ctx.measureText(s).width + 32; const on = i === 1; card(ctx, bx, 380, w, 48, { fill: on && pressed ? C.kiko : on ? "#FFF3D6" : "#F2F5F7", stroke: on ? (pressed ? C.kikoDark : C.accent) : "#D7E2DC", lw: on ? 4 : 2, r: 12 }); text(ctx, s, bx + 16, 411, 20, { weight: 800, color: on && pressed ? "#fff" : C.ink }); if (on) btns.x = bx + w / 2; bx += w + 14; });
      if (pressed) {
        text(ctx, "Paket yang tiba (urutan datang):", 270, 474, 20, { weight: 800, color: C.ink2 });
        const arr = [4, 1, 6, 2, 5, 3], k = clamp(Math.floor((f - 0.5) / 0.06) + 1, 0, 6);
        ctx.fillStyle = "#F2F5F7"; rr(ctx, 270, 488, 820, 76, 12); ctx.fill(); ctx.fillStyle = "#F2F5F7"; rr(ctx, 270, 620, 820, 76, 12); ctx.fill();
        arr.forEach((n, i) => { const used = n <= k; ctx.save(); if (used) ctx.globalAlpha = 0.25; ctx.fillStyle = C.accent; rr(ctx, 290 + i * 74, 502, 60, 48, 8); ctx.fill(); text(ctx, String(n), 320 + i * 74, 535, 24, { align: "center", weight: 900, color: "#fff" }); ctx.restore(); });
        text(ctx, "Pesan tersusun:", 270, 606, 20, { weight: 800, color: C.ink2 });
        for (let n = 1; n <= k; n++) { ctx.fillStyle = GREEN; rr(ctx, 290 + (n - 1) * 74, 634, 60, 48, 8); ctx.fill(); text(ctx, String(n), 320 + (n - 1) * 74, 667, 24, { align: "center", weight: 900, color: "#fff" }); }
        if (k >= 6) text(ctx, "Pesan utuh: 1 2 3 4 5 6.", 270, 740, 24, { weight: 900, color: GREEN });
        // pointer mengetuk paket berikutnya
        const nx = Math.min(k + 1, 6), idx = arr.indexOf(nx); if (k < 6 && f > 0.5) D.pointer(ctx, 320 + idx * 74, 530, 40);
      } else { D.pointer(ctx, lerp(700, btns.x, ease(f / 0.28)), lerp(600, 410, ease(f / 0.28)), 40); }
      card(ctx, 1190, 250, 500, 540, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Tugasmu", 1440, 320, 34, { align: "center", weight: 900 });
      para(ctx, "Tekan tombol Simulasi paket. Ketuk paket dari nomor 1 sampai 6.", 1440, 390, 28, 420, { align: "center", weight: 700, lh: 1.3 });
      para(ctx, "Lalu coba Cari yang putus: tebak bagian jaringan yang bermasalah.", 1440, 560, 26, 420, { align: "center", weight: 700, lh: 1.3, color: C.ink2 });
      kiko(ctx, 1640, 740, 90, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
