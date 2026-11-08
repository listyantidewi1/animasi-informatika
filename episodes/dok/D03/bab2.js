/* D03 bab 2: "Mesin yang belajar meniru" (b2_1–b2_5a).
   Metafora utama bab: jaringan neuron bercahaya (semu-3D, berputar pelan) yang "mendengarkan" lalu "berbicara".
   Satu panggung yang bersambung di studio ungu; semua benda digambar sebagai fungsi waktu ABSOLUT (bukan waktu beat),
   sehingga silang-pudar bawaan antarbeat menyatu tanpa sambungan:
     b2_1  Bip membaca buku → huruf terbang ke jaringan ("belajar menulis"); kerumunan muncul, ribuan gelombang suara mengalir masuk
     b2_2  kerumunan surut; kartu tulisan↔bunyi ("Ha·lo"); panel "ciri suara" (tinggi, serak, cepat) bergeser per orang
     b2_3  Bu Rina masuk, contoh suara singkat terbang ke jaringan → jaringan berwarna merah muda, panel terkunci "pola suara Ibu";
           kalimat diketik, Bip menekan "Ucapkan", keluar spektrogram baru berwarna sama
     b2_4  jaringan menyusut menjadi meteran 85% (McAfee 2023, satu temuan); Bip menekan stopwatch: 3 detik rekaman
     b2_5  spektrogram 3 detik berubah menjadi gelembung "satu kalimat pendek"; Bu Rina mengangkat telepon
     b2_5a "Halo, iya, siapa ini?" muncul per kata; stopwatch berjalan; titik rekam merah (kait ke bab 3)
   Profil suara tetap: ibu seed 11, anak seed 23. Kamera sendiri (noCam), juga fungsi waktu absolut. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, L = KIT.layar, O = KIT.orang, LT = KIT.latar, B = KIT.bipkit;
  const { clamp, lerp, eio, eout, spring } = D;
  const TAU = Math.PI * 2, PI = Math.PI;
  const IBU = Object.assign({}, L.SUARA.ibu, { seed: 11 }), ANAK = Object.assign({}, L.SUARA.anak, { seed: 23 }), AYAH = Object.assign({}, L.SUARA.ayah);
  const TIRU = Object.assign({}, L.SUARA.tiruan, { timing: { seed: 11, tempo: IBU.tempo, jeda: IBU.jeda } });
  const PINK = IBU.aksen;
  const fd = (t, t0, d = 0.4) => clamp((t - t0) / d);
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const mixHex = (a, b, u) => { const A = rgb(a), C = rgb(b); u = clamp(u); return "#" + A.map((v, i) => Math.round(v + (C[i] - v) * u).toString(16).padStart(2, "0")).join(""); };
  const mkCam = (fx, fy, z) => ({ fx, fy, z, X: x => (x - fx) * z + 960, Y: y => (y - fy) * z + 540, S: (x, y) => [(x - fx) * z + 960, (y - fy) * z + 540],
    apply(c) { c.translate(960, 540); c.scale(z, z); c.translate(-fx, -fy); } });
  const bez = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  const rd = (k, px) => (px * k >= 40.5 ? 1 : 0.34);   // teks baru tampil penuh setelah cukup besar (≥ 40 px)
  // layar HP kecil tanpa teks (panggilan / merekam): latar gradasi, avatar, batang suara
  function miniScr(c, w, h, t) {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#5B6BE0"); g.addColorStop(1, "#8A5FD6"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#B7C1F2"; c.beginPath(); c.arc(w / 2, h * 0.3, w * 0.24, 0, TAU); c.fill();
    c.fillStyle = "rgba(255,255,255,0.85)"; for (let i = 0; i < 5; i++) { const hh = h * (0.03 + 0.07 * Math.abs(Math.sin(t * 7 + i * 1.3))); c.fillRect(w * 0.27 + i * w * 0.1, h * 0.6 - hh / 2, w * 0.06, hh); }
    c.fillStyle = "#FF5A5F"; c.beginPath(); c.arc(w / 2, h * 0.84, w * 0.13, 0, TAU); c.fill();
  }
  const fmt1 = s => (Math.round(s * 10) / 10).toFixed(1).replace(".", ",");

  // ---------- tata letak dunia (px) ----------
  const NETC = { x: 960, y: 430, s: 300 };
  const BIP = { x: 1010, y: 800, s: 180 };
  const RINA = { x: 330, y: 885, h: 380 };
  const PANEL = { x: 1330, y: 170, w: 480, h: 540 };
  const CARD = { x: 150, y: 200, w: 480, h: 390 };
  const ASLI = { x: 120, y: 305, w: 440, h: 170 };
  const TIRUR = { x: 1340, y: 330, w: 460, h: 170 };
  const BUB = { x: 400, y: 300, w: 720, h: 195 };
  const SW = { x: 745, y: 655, R: 80 };
  const BTN = { x: 1250, y: 835, w: 280 };
  const VALS = { ayah: [0.16, 0.86, 0.28], anakRina: [0.9, 0.1, 0.9], buRina: [0.64, 0.24, 0.5] };
  const PROF = [{ k: "ayah", col: AYAH.aksen }, { k: "anakRina", col: ANAK.aksen }, { k: "buRina", col: PINK }];
  const COLS = [P.teal, P.amber, P.pink, P.violet, P.blue, P.green, P.warm];

  // ---------- waktu kata (absolut), disimpan per timeline ----------
  let TC = null, TCL = null;
  function times(TL) {
    if (TCL === TL && TC) return TC;
    const bt = id => TL.beats.find(x => x.id === id);
    const A = (id, s) => { const b = bt(id); return b.start + D.at(b, s); };
    const T = {
      s1: bt("b2_1").start, s2: bt("b2_2").start, s3: bt("b2_3").start, s4: bt("b2_4").start, s5: bt("b2_5").start, s6: bt("b2_5a").start,
      tiru: A("b2_1", "meniru suara"), aisaat: A("b2_1", "AI saat"), menulis: A("b2_1", "menulis"), model: A("b2_1", "Model AI"), ratus: A("b2_1", "ratusan ribu jam"), banyak: A("b2_1", "banyak sekali orang"),
      dari2: A("b2_2", "Dari rekaman"), belajar2: A("b2_2", "model AI belajar"), hub: A("b2_2", "hubungan"), tulisan: A("b2_2", "tulisan"), bunyi: A("b2_2", "bunyi"), juga: A("b2_2", "juga belajar"),
      ciri: A("b2_2", "ciri-ciri"), seseorang: A("b2_2", "seseorang"), beda: A("b2_2", "berbeda"), lain: A("b2_2", "orang lain"),
      butuh: A("b2_3", "hanya butuh"), contoh: A("b2_3", "contoh singkat"), satu: A("b2_3", "satu orang"), tebak: A("b2_3", "menebak pola"), lalu: A("b2_3", "Lalu, model"),
      buat: A("b2_3", "membuat suara"), ucap: A("b2_3", "mengucapkan"), apa: A("b2_3", "apa saja"),
      akurat: A("b2_4", "Seberapa akurat"), mcafee: A("b2_4", "McAfee"), tahun: A("b2_4", "dua ribu dua puluh tiga"), alat: A("b2_4", "sebuah alat"), mirip: A("b2_4", "kemiripan"),
      lapan: A("b2_4", "delapan puluh lima"), persen: A("b2_4", "persen"), rekaman: A("b2_4", "dari rekaman"), tigadet: A("b2_4", "tiga detik"),
      tiga5: A("b2_5", "Tiga detik"), kalimat: A("b2_5", "satu kalimat pendek"), misal: A("b2_5", "misalnya"),
      halo: A("b2_5a", "Halo,"), iya: A("b2_5a", "iya,"), siapa: A("b2_5a", "siapa ini?"),
    };
    const b6 = bt("b2_5a"); T.end6 = b6.start + D.speechEnd(b6); T.endAll = b6.start + b6.dur;
    T.sw = T.rekaman + 0.42;   // stopwatch ditekan Bip
    // pergantian sorotan profil di panel (Ayah → Anak → Ibu → …) sampai terkunci pada Ibu saat "menebak pola"
    const sw = [[T.seseorang - 0.1, 0], [T.beda - 0.1, 1], [T.lain - 0.1, 2]]; let k = 0;
    for (let x = T.lain + 0.85; x < T.tebak - 0.2; x += (x < T.s3 ? 0.85 : 0.6)) sw.push([x, k++ % 3]);
    sw.push([T.tebak - 0.05, 2]); T.sorot = sw;
    T.cam = [[T.s1, 960, 540, 1.0], [T.s2, 960, 520, 1.035], [T.s3 + 1.2, 960, 525, 1.0], [T.s4 + 0.5, 960, 525, 1.0], [T.rekaman, 960, 530, 1.025],
      [T.s5 + 0.15, 955, 530, 1.03], [T.s5 + 2.3, 760, 540, 1.12], [T.endAll, 745, 540, 1.15]];
    TC = T; TCL = TL; return T;
  }

  // =====================================================================================
  // jaringan neuron semu-3D
  // =====================================================================================
  const NET = (() => {
    const r = D.rng(4242), LAY = [8, 13, 16, 13, 8], nodes = [], edges = [];
    LAY.forEach((n, li) => {
      const u = li / (LAY.length - 1), x = u * 2 - 1, R = 0.42 + 0.5 * Math.sin(PI * (0.15 + 0.7 * u));
      for (let i = 0; i < n; i++) { const a = i * 2.39996 + li * 0.7, rr = R * Math.sqrt((i + 0.6) / n); nodes.push({ li, x: x + (r() - 0.5) * 0.1, y: Math.sin(a) * rr, z: Math.cos(a) * rr, ph: r() * TAU }); }
    });
    nodes.forEach((a, i) => { if (a.li === LAY.length - 1) return;
      nodes.map((b, j) => [j, b]).filter(([, b]) => b.li === a.li + 1).map(([j, b]) => [j, (b.y - a.y) ** 2 + (b.z - a.z) ** 2 + r() * 0.3]).sort((p, q) => p[1] - q[1]).slice(0, 3)
        .forEach(([j]) => edges.push({ a: i, b: j, k: r(), k2: r() })); });
    return { LAY, nodes, edges };
  })();
  function projector(st) {
    const cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch), F = 3.4;
    return (x, y, z) => { const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, k = F / (F + z2);
      return [st.cx + x1 * st.s * k, st.cy + y2 * st.s * 0.88 * k, z2, k]; };
  }
  function netState(t, T) {
    const coll = eio((t - T.mirip + 0.2) / 0.7);
    const flashAt = [T.tiru - 0.2, T.belajar2, T.tebak - 0.15, T.buat + 0.05, T.apa, T.alat - 0.1];
    let flash = -9; flashAt.forEach(te => { if (t >= te && t < te + 1.6) flash = (t - te) * 3.6 - 0.6; });
    const act = clamp(0.3 + 0.25 * fd(t, T.aisaat, 0.6) + 0.45 * fd(t, T.model, 0.8) - 0.2 * fd(t, T.ciri, 1) + 0.35 * fd(t, T.tebak - 0.2, 0.5) * (1 - fd(t, T.lalu + 1.5, 1.5) * 0.5));
    return { cx: lerp(NETC.x, 960, coll), cy: lerp(NETC.y, 350, coll), s: NETC.s * lerp(1, 0.12, coll), alpha: 1 - eio((t - T.mirip - 0.1) / 0.55),
      yaw: 0.2 + 0.42 * Math.sin((t - T.s1) * 0.17), pitch: 0.2 + 0.06 * Math.sin(t * 0.23), act, flash, tint: eio((t - T.tebak + 0.1) / 0.7), glow: 0.55 + 0.45 * act + 0.3 * fd(t, T.model, 1) * (1 - fd(t, T.ciri, 1.5)) };
  }
  const LAYCOL = ["#3FD8C8", "#56C7E8", "#7FB2FF", "#A99BFF", "#C996FF"];
  function drawNet(ctx, t, st) {
    if (st.alpha <= 0.01) return null;
    const pj = projector(st), N = NET.nodes.map(n => pj(n.x, n.y, n.z)), sc = st.s / 300;
    const colOf = li => mixHex(LAYCOL[li], PINK, st.tint), edgeCol = mixHex("#9C8BFF", "#FF9DB8", st.tint);
    ctx.save(); ctx.globalAlpha *= st.alpha;
    D.glow(ctx, st.cx, st.cy, st.s * 1.6, mixHex(P.violet, P.pink, st.tint * 0.7), 0.45 * st.glow);
    D.glow(ctx, st.cx, st.cy, st.s * 0.85, mixHex("#7FE3FF", PINK, st.tint), 0.16 * st.glow);
    // cakram tiap lapisan (memperlihatkan bentuk 3D yang berputar)
    ctx.lineWidth = 2.5 * sc;
    NET.LAY.forEach((n, li) => { const u = li / (NET.LAY.length - 1), x = u * 2 - 1, R = 0.42 + 0.5 * Math.sin(PI * (0.15 + 0.7 * u)) + 0.08;
      ctx.beginPath(); for (let k = 0; k <= 40; k++) { const a = k / 40 * TAU, p = pj(x, Math.sin(a) * R, Math.cos(a) * R); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      ctx.fillStyle = D.hexA(colOf(li), 0.05); ctx.fill(); ctx.strokeStyle = D.hexA(colOf(li), 0.22); ctx.stroke(); });
    // garis penghubung
    ctx.lineCap = "round";
    NET.edges.forEach(e => { const a = N[e.a], b = N[e.b], dk = clamp(0.5 - (a[2] + b[2]) * 0.3), lf = Math.exp(-((st.flash - NET.nodes[e.a].li - 0.5) ** 2) / 0.4);
      ctx.strokeStyle = D.hexA(lf > 0.2 ? "#FFF4C8" : edgeCol, Math.min(0.95, (0.12 + 0.34 * dk) * (1 + 2 * lf))); ctx.lineWidth = (1.2 + 2.2 * dk) * sc + 2 * lf; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
    // denyut yang berjalan dari lapisan masukan ke keluaran
    NET.edges.forEach(e => { if (e.k2 > st.act) return; const u = (t * (0.7 + 0.5 * e.k) + e.k * 7) % 1, a = N[e.a], b = N[e.b], x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u), k = lerp(a[3], b[3], u);
      const al = Math.sin(PI * u); D.glow(ctx, x, y, 16 * k * sc, P.warm, 0.55 * al); ctx.fillStyle = D.hexA("#FFF4C8", al); ctx.beginPath(); ctx.arc(x, y, 3.4 * k * sc + 0.6, 0, TAU); ctx.fill(); });
    // simpul, dari belakang ke depan (yang jauh lebih kecil dan redup)
    N.map((p, i) => [p, i]).sort((p, q) => q[0][2] - p[0][2]).forEach(([p, i]) => { const n = NET.nodes[i], k = p[3], br = 0.75 + 0.25 * Math.sin(t * 2.2 + n.ph), lf = Math.exp(-((st.flash - n.li) ** 2) / 0.35);
      const dk = clamp((k - 0.72) / 0.75), r = (7.5 + 10 * dk) * sc * (1 + 0.4 * lf), col = colOf(n.li);
      D.glow(ctx, p[0], p[1], r * (3.4 + 2 * lf), col, (0.4 + 0.3 * dk + 0.5 * lf) * br);
      ctx.fillStyle = D.hexA(col, 0.7 + 0.3 * dk); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
      ctx.fillStyle = D.hexA("#FFFFFF", (0.55 + 0.45 * dk) * (lf > 0.3 ? 1 : 0.85 * br)); ctx.beginPath(); ctx.arc(p[0] - r * 0.18, p[1] - r * 0.18, r * 0.42, 0, TAU); ctx.fill(); });
    ctx.restore();
    const L0 = N.filter((p, i) => NET.nodes[i].li <= 1), Ln = N.filter((p, i) => NET.nodes[i].li >= NET.LAY.length - 1);
    return { inp: pj(-1.05, 0, 0), out: pj(1.05, 0, 0), top: pj(0, -0.9, 0), bot: pj(0, 0.85, 0), L0, Ln, all: N };
  }
  // busur suara yang keluar dari sisi keluaran jaringan
  function arcs(ctx, x, y, t, amp, col) {
    if (amp <= 0.01) return; ctx.save(); ctx.lineCap = "round";
    for (let k = 0; k < 5; k++) { const ph = (t * 0.9 + k / 5) % 1, r = 30 + ph * 300, a = Math.sin(PI * Math.min(1, ph * 1.4)) * (1 - ph) * amp;
      ctx.strokeStyle = D.hexA(col, 0.25 * a); ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(x, y, r, -0.5, 0.5); ctx.stroke();
      ctx.strokeStyle = D.hexA(col, 0.95 * a); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x, y, r, -0.5, 0.5); ctx.stroke(); }
    ctx.restore();
  }

  // =====================================================================================
  // partikel: gelombang suara kecil & ubin huruf
  // =====================================================================================
  function waveGlyph(ctx, x, y, ang, len, amp, col, a, ph) {
    if (a <= 0.01) return; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha *= a; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const path = () => { ctx.beginPath(); for (let j = 0; j <= 14; j++) { const u = j / 14, xx = (u - 0.5) * len, yy = Math.sin(u * TAU * 1.6 + ph) * amp * Math.sin(PI * u); j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } };
    path(); ctx.strokeStyle = D.hexA(col, 0.28); ctx.lineWidth = amp * 1.3; ctx.stroke(); path(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(2.5, amp * 0.45); ctx.stroke();
    ctx.restore();
  }
  // aliran partikel dari sumber ke sasaran; hanya partikel yang "lahir" di antara t0 dan t1 yang terlihat
  function flow(ctx, t, srcs, tgts, o) {
    if (!srcs.length || !tgts.length) return;
    for (let i = 0; i < o.n; i++) {
      const r = D.rng(i * 7919 + (o.seed || 1)), k = r(), k2 = r(), k3 = r(), life = o.life * (0.8 + 0.4 * r());
      const ph = ((t / life + k) % 1 + 1) % 1, birth = t - ph * life; if (birth < o.t0 || birth > o.t1) continue;
      const s = srcs[(i * 3 + Math.floor(k3 * 7)) % srcs.length], d = tgts[(i * 5) % tgts.length];
      const c = [lerp(s[0], d[0], 0.5) + (k2 - 0.5) * (o.spread || 300), Math.min(s[1], d[1]) - (o.lift || 80) - k3 * 140];
      const u = ph * ph * (1.6 - 0.6 * ph), p = bez(s, c, d, u), q = bez(s, c, d, Math.min(1, u + 0.03));
      const a = Math.pow(Math.sin(PI * ph), 0.5) * (o.a == null ? 1 : o.a), sc = lerp(1, 0.4, u);
      if (o.draw) o.draw(ctx, p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0]), sc, a, i, s);
      else waveGlyph(ctx, p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0]), 52 * sc * (o.size || 1), 9 * sc * (o.size || 1), s[2] || COLS[i % COLS.length], a, t * 9 + k * 10);
    }
  }
  const SPR = {};
  function tileSprite(tok) {   // ubin huruf (dekorasi partikel) di kanvas kecil sekali buat
    if (SPR[tok]) return SPR[tok]; const fs = 48, c = document.createElement("canvas"), x = c.getContext("2d"); x.font = `800 ${fs}px ${K.FONT}`;
    const w = Math.ceil(x.measureText(tok).width + 40), h = 76; c.width = w + 8; c.height = h + 10;
    x.fillStyle = "rgba(10,14,50,0.28)"; H.rr(x, 6, 8, w, h, 20); x.fill(); x.fillStyle = "#FFF6E6"; H.rr(x, 2, 2, w, h, 20); x.fill();
    x.font = `800 ${fs}px ${K.FONT}`; x.textAlign = "center"; x.fillStyle = "#2A2F6A"; x.fillText(tok, 2 + w / 2, 2 + h / 2 + fs * 0.36);
    return (SPR[tok] = c);
  }
  const TOK = ["a", "Halo", "k", "apa", "u", "kabar", "b", "kamu", "i", "ini", "s", "kata"];

  // =====================================================================================
  // benda kecil
  // =====================================================================================
  function book(ctx, x, y, w, glowA, t) {   // buku terbuka di tangan Bip
    const h = w * 0.48; ctx.save(); ctx.translate(x, y);
    if (glowA > 0) D.glow(ctx, 0, -h * 0.4, w * 0.9, P.warm, 0.5 * glowA);
    ctx.fillStyle = "#C2456E"; H.rr(ctx, -w / 2 - 6, -h / 2 + 4, w + 12, h + 8, 8); ctx.fill();
    [-1, 1].forEach(sd => { ctx.fillStyle = sd < 0 ? "#FFF6E6" : "#F3E9D6"; ctx.beginPath(); ctx.moveTo(0, -h / 2 + 6); ctx.quadraticCurveTo(sd * w * 0.25, -h / 2 - 4, sd * w / 2, -h / 2 + 2);
      ctx.lineTo(sd * w / 2, h / 2); ctx.quadraticCurveTo(sd * w * 0.25, h / 2 - 8, 0, h / 2 + 2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(42,47,106,0.35)"; ctx.lineWidth = 3; for (let k = 0; k < 4; k++) { const yy = -h / 2 + 12 + k * h * 0.2; ctx.beginPath(); ctx.moveTo(sd * w * 0.08, yy + 2); ctx.lineTo(sd * w * (0.42 - (k === 3 ? 0.12 : 0)), yy); ctx.stroke(); } });
    ctx.strokeStyle = "rgba(42,47,106,0.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -h / 2 + 6); ctx.lineTo(0, h / 2 + 2); ctx.stroke();
    ctx.restore();
  }
  function stopwatch(ctx, x, y, R, sec, o) {   // stopwatch tanpa angka kecil; bacaan digital di lapisan label
    ctx.save(); ctx.translate(x, y); const sc = o.scale == null ? 1 : o.scale; ctx.scale(sc, sc); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.fillStyle = "rgba(10,14,50,0.24)"; ctx.beginPath(); ctx.ellipse(0, R * 1.2, R * 0.85, R * 0.1, 0, 0, TAU); ctx.fill();
    const pd = (o.press || 0) * R * 0.1;
    ctx.fillStyle = "#23897E"; H.rr(ctx, -R * 0.1, -R * 1.2 + pd, R * 0.2, R * 0.24, R * 0.04); ctx.fill();
    ctx.fillStyle = P.teal; H.rr(ctx, -R * 0.27, -R * 1.37 + pd, R * 0.54, R * 0.18, R * 0.09); ctx.fill();
    ctx.save(); ctx.rotate(PI / 4); ctx.fillStyle = "#23897E"; H.rr(ctx, -R * 0.08, -R * 1.19, R * 0.16, R * 0.2, R * 0.05); ctx.fill(); ctx.restore();
    if (o.run) D.glow(ctx, 0, 0, R * 1.6, P.teal, 0.35);
    ctx.fillStyle = P.teal; ctx.beginPath(); ctx.arc(0, 0, R * 1.04, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.beginPath(); ctx.arc(-R * 0.1, -R * 0.12, R * 1.0, PI * 1.05, PI * 1.6); ctx.lineTo(0, 0); ctx.fill();
    ctx.fillStyle = "#F7F3EA"; ctx.beginPath(); ctx.arc(0, 0, R * 0.86, 0, TAU); ctx.fill();
    const A = s => -PI / 2 + s / 5 * TAU;
    if ((o.sector || 0) > 0) { ctx.fillStyle = D.hexA(PINK, 0.45 * o.sector); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R * 0.8, A(0), A(3)); ctx.closePath(); ctx.fill(); }
    if (sec > 0.01) { ctx.fillStyle = D.hexA(P.teal, 0.28); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R * 0.62, A(0), A(Math.min(5, sec))); ctx.closePath(); ctx.fill(); }
    for (let i = 0; i < 25; i++) { const a = A(i / 5), mj = i % 5 === 0; ctx.strokeStyle = mj ? "#2A2F6A" : "#9AA2C8"; ctx.lineWidth = mj ? R * 0.06 : R * 0.03; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * (mj ? 0.62 : 0.7), Math.sin(a) * R * (mj ? 0.62 : 0.7)); ctx.lineTo(Math.cos(a) * R * 0.78, Math.sin(a) * R * 0.78); ctx.stroke(); }
    ctx.save(); ctx.rotate(A(sec) + PI / 2); ctx.fillStyle = "#FF5A5F"; ctx.beginPath(); ctx.moveTo(-R * 0.04, R * 0.16); ctx.lineTo(-R * 0.015, -R * 0.76); ctx.lineTo(R * 0.015, -R * 0.76); ctx.lineTo(R * 0.04, R * 0.16); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#2A2F6A"; ctx.beginPath(); ctx.arc(0, 0, R * 0.1, 0, TAU); ctx.fill(); ctx.fillStyle = "#FF5A5F"; ctx.beginPath(); ctx.arc(0, 0, R * 0.045, 0, TAU); ctx.fill();
    if (o.run) { ctx.fillStyle = D.hexA("#FF5A5F", 0.5 + 0.5 * Math.sin(o.t * 9)); ctx.beginPath(); ctx.arc(R * 0.78, -R * 0.78, R * 0.09, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  function readout(c, s, x, y, k, a, hot) {   // pil bacaan digital (≥ 46 px)
    if (a <= 0.01) return; c.save(); c.globalAlpha *= a * rd(k, 50); c.translate(x, y); c.scale(k, k); const fs = 50; c.font = `900 ${fs}px ${K.FONT}`; const w = Math.max(250, c.measureText(s).width + fs * 1.1), h = fs * 1.5;
    if (hot > 0) D.glow(c, 0, 0, w * 0.7, P.amber, 0.45 * hot);
    c.fillStyle = "rgba(16,20,64,0.25)"; H.rr(c, -w / 2 + 3, -h / 2 + 5, w, h, h / 2); c.fill(); c.fillStyle = "#FFF6E6"; H.rr(c, -w / 2, -h / 2, w, h, h / 2); c.fill();
    if (hot > 0) { c.strokeStyle = D.hexA(P.amber, hot); c.lineWidth = 5; c.stroke(); }
    D.txt(c, s, 0, fs * 0.36, fs, { align: "center", color: "#1E2A6B", weight: 900 }); c.restore();
  }
  function pillAt(c, s, x, y, a, k, o = {}) { if (a <= 0.01) return; c.save(); c.globalAlpha *= a * rd(k, o.size || 48); c.translate(x, y); c.scale(k, k); D.label(c, s, 0, 0, o); c.restore(); }
  function clockIcon(c, x, y, r, t, spin) {
    c.fillStyle = "#FFF6E6"; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.strokeStyle = P.amber; c.lineWidth = r * 0.16; c.stroke();
    c.strokeStyle = "#2A2F6A"; c.lineCap = "round"; c.lineWidth = r * 0.14; const a1 = t * spin, a2 = t * spin / 12;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a1) * r * 0.7, y + Math.sin(a1) * r * 0.7); c.stroke();
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a2) * r * 0.45, y + Math.sin(a2) * r * 0.45); c.stroke();
  }

  // panel "ciri suara": tiga penggeser + wajah tiga orang; mengecil menjadi lencana "pola suara Ibu"
  function sorotIdx(t, T) { let cur = -1, prev = -1, t0 = 0; for (const [ts, i] of T.sorot) { if (t >= ts) { prev = cur; cur = i; t0 = ts; } } return { cur, prev, t0 }; }
  function sliderVals(t, T) {
    const s = sorotIdx(t, T), base = [0.5, 0.5, 0.5].map((v, i) => v + 0.18 * Math.sin(t * 2.1 + i * 2));
    if (s.cur < 0) return { v: base, col: P.amber, cur: -1 };
    const A = s.prev < 0 ? base : VALS[PROF[s.prev].k], Bv = VALS[PROF[s.cur].k], u = eio((t - s.t0) / 0.35);
    return { v: A.map((a, i) => lerp(a, Bv[i], u)), col: PROF[s.cur].col, cur: s.cur, u };
  }
  function panel(c, t, T, cm) {
    const a = fd(t, T.ciri - 0.15, 0.35) * (1 - fd(t, T.s4 + 0.1, 0.6)); if (a <= 0.01) return;
    const sp = Math.min(1.04, spring(t - T.ciri + 0.15, 10, 0.55)), coll = eio((t - T.lalu - 0.1) / 0.7);
    const h = lerp(PANEL.h, 98, coll), x = PANEL.x, y = PANEL.y, w = PANEL.w;
    c.save(); c.globalAlpha *= a; cm.apply(c); c.translate(x + w / 2, y + h / 2); c.scale(lerp(0.6, 1, sp), lerp(0.6, 1, sp)); c.translate(-(x + w / 2), -(y + h / 2));
    c.globalAlpha *= rd(lerp(0.6, 1, sp), 46);
    const sv = sliderVals(t, T), locked = fd(t, T.tebak - 0.05, 0.3), acc = sv.cur >= 0 ? sv.col : P.amber;
    if (locked > 0) D.glow(c, x + w / 2, y + h / 2, w * 0.75, PINK, 0.35 * locked * (0.7 + 0.3 * Math.sin(t * 4)));
    D.panel(c, x, y, w, h, { fill: "rgba(16,24,70,0.92)", stroke: D.hexA(acc, 0.85), lw: 4, r: 28 });
    // judul
    const hd = locked > 0.5 ? "pola suara Ibu" : "ciri suara";
    c.save(); if (locked > 0 && locked < 1) c.globalAlpha *= Math.abs(locked - 0.5) * 2;
    D.txt(c, hd, x + 34, y + 70, 50, { weight: 900, color: locked > 0.5 ? "#FFD6E2" : P.ink }); c.restore();
    // ikon gelombang kecil di kanan judul
    if (locked < 0.5) { c.save(); c.globalAlpha *= 1 - locked * 2; L.gelombang(c, x + w - 150, y + 30, 116, 52, { t, mode: "batang", n: 9, amp: 0.85, seed: 4, col: acc, col2: "#FFFFFF", speed: 1.6 }); c.restore(); }
    const ra = 1 - clamp(coll * 2.2); if (ra > 0.01) {
      c.save(); c.globalAlpha *= ra;
      ["tinggi", "serak", "cepat"].forEach((lb, i) => { const yy = y + 150 + i * 100, tx0 = x + 34, tx1 = x + w - 40, v = clamp(sv.v[i]);
        D.txt(c, lb, tx0, yy, 46, { weight: 800, color: P.ink2 });
        c.lineCap = "round"; c.strokeStyle = "rgba(255,255,255,0.16)"; c.lineWidth = 16; c.beginPath(); c.moveTo(tx0, yy + 38); c.lineTo(tx1, yy + 38); c.stroke();
        c.strokeStyle = acc; c.beginPath(); c.moveTo(tx0, yy + 38); c.lineTo(lerp(tx0, tx1, v), yy + 38); c.stroke();
        const kx = lerp(tx0, tx1, v); D.glow(c, kx, yy + 38, 40, acc, 0.5); c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(kx, yy + 38, 18, 0, TAU); c.fill(); c.fillStyle = acc; c.beginPath(); c.arc(kx, yy + 38, 9, 0, TAU); c.fill(); });
      // wajah tiga orang (yang disorot diberi cincin warna suaranya)
      c.save(); H.rr(c, x + 3, y + 3, w - 6, h - 6, 26); c.clip();
      PROF.forEach((p, i) => { const fx = x + 100 + i * 140, fy = y + 466, on = sv.cur === i ? 1 : 0;
        if (on) { D.glow(c, fx, fy, 80, p.col, 0.7); c.strokeStyle = p.col; c.lineWidth = 7; c.beginPath(); c.arc(fx, fy - 2, 46, 0, TAU); c.stroke(); }
        c.save(); c.globalAlpha *= on ? 1 : 0.55; O.kepala(c, fx, fy + (on ? -4 : 0), 36, Object.assign(O.preset(p.k), { t, seed: 31 + i * 5, face: on ? "senang" : "netral", bahu: 1.1 })); c.restore(); });
      c.restore();
      c.restore();
    }
    c.restore();
    // garis dari keluaran jaringan ke panel (data mengalir)
    return { a: a * (1 - coll) };
  }

  // kartu tulisan ↔ bunyi
  const PAIRS = [["Ha", "lo"], ["a", "pa"], ["ma", "kan"], ["ka", "bar"]];
  function card(c, t, T, cm, net) {
    const a = fd(t, T.hub - 0.1, 0.3); if (a <= 0.01) return; const fly = eio((t - T.lain - 0.75) / 1.1); if (fly >= 1) return;
    const sp = Math.min(1.05, spring(t - T.hub + 0.1, 10, 0.55));
    c.save(); c.globalAlpha *= a * (1 - clamp((fly - 0.7) / 0.3)); cm.apply(c);
    const kT = lerp(0.6, 1, sp) * lerp(1, 0.12, fly), tA = Math.min(rd(kT, 44), fly > 0.08 ? 0.3 : 1);
    const cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2, tx = net ? net.inp[0] : 660, ty = net ? net.inp[1] : 430;
    c.translate(lerp(cx, tx, fly), lerp(cy, ty, fly) - Math.sin(PI * fly) * 80); const k = lerp(0.6, 1, sp) * lerp(1, 0.12, fly); c.scale(k, k); c.translate(-cx, -cy);
    D.panel(c, CARD.x, CARD.y, CARD.w, CARD.h, { fill: "rgba(16,24,70,0.92)", stroke: D.hexA(P.amber, 0.8), lw: 4, r: 28 });
    const pi = Math.max(0, Math.floor((t - T.juga - 0.2) / 1.5) + 1) % PAIRS.length, pt = pi === 0 ? T.tulisan : T.juga + 0.2 + (Math.floor((t - T.juga - 0.2) / 1.5)) * 1.5;
    const pair = PAIRS[pi], lu = fd(t, pi === 0 ? T.tulisan - 0.1 : pt, 0.25), wu = fd(t, pi === 0 ? T.bunyi - 0.15 : pt + 0.35, 0.45), cu = fd(t, pi === 0 ? T.bunyi + 0.2 : pt + 0.6, 0.45);
    c.save(); c.globalAlpha *= tA;
    D.txt(c, "tulisan", CARD.x + 30, CARD.y + 58, 44, { weight: 800, color: P.ink2 });
    D.txt(c, "bunyi", CARD.x + 30, CARD.y + 366, 44, { weight: 800, color: P.ink2 }); c.restore();
    const cols = [P.teal, P.amber];
    pair.forEach((s, i) => { const tx0 = CARD.x + 40 + i * 215, sp2 = Math.min(1.08, spring((t - (pi === 0 ? T.tulisan - 0.1 : pt)) - i * 0.12, 12, 0.5)), kk = lerp(0.3, 1, sp2);
      if (sp2 <= 0) return; c.save(); c.translate(tx0 + 95, CARD.y + 120); c.scale(kk, kk);
      c.fillStyle = "#FFF6E6"; H.rr(c, -95, -44, 190, 88, 22); c.fill(); c.strokeStyle = cols[i]; c.lineWidth = 6; c.stroke();
      c.globalAlpha *= Math.min(tA, rd(kk * kT, 64)); D.txt(c, s, 0, 24, 64, { align: "center", weight: 900, color: "#2A2F6A" }); c.restore();
      // potongan bunyi
      if (wu > 0) { c.save(); c.globalAlpha *= wu; L.gelombang(c, tx0 + 5, CARD.y + 236, 180 * wu, 80, { t, mode: "batang", n: 13, amp: 1, seed: 3 + i * 4 + pi * 9, col: cols[i], col2: "#FFFFFF", speed: 1.4 }); c.restore(); }
      // benang penghubung
      if (cu > 0) { const x0 = tx0 + 95, y0 = CARD.y + 166, y1 = CARD.y + 236; c.strokeStyle = D.hexA(cols[i], 1); c.lineWidth = 7; c.setLineDash([10, 8]); c.lineDashOffset = -t * 40;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, lerp(y0, y1, cu)); c.stroke(); c.setLineDash([]); D.glow(c, x0, lerp(y0, y1, cu), 22, cols[i], 0.8); } });
    c.restore();
    void lu;
  }

  // =====================================================================================
  // adegan bab 2 (satu fungsi untuk semua beat)
  // =====================================================================================
  function scene(ctx, b, l, t, TL) {
    const T = times(TL), ck = D.path(T.cam, t), cm = mkCam(ck.x, ck.y, ck.z);
    // ---- latar: di ruang layar dengan paralaks (tidak pernah memperlihatkan tepi) ----
    ctx.save(); const zb = 1 + (cm.z - 1) * 0.45; ctx.translate(960, 540); ctx.scale(zb, zb); ctx.translate(-960, -540);
    LT.studio(ctx, t, { warna: "ungu", floorY: 830, px: clamp((cm.fx - 960) / 260 + 0.12 * Math.sin((t - T.s1) * 0.09), -1, 1) });
    ctx.restore();

    ctx.save(); cm.apply(ctx);
    // ---- kerumunan (b2_1–b2_2) ----
    const heads = [];
    const rise = t - T.model + 0.35, sink = eio((t - T.dari2 - 0.6) / 1.5);
    if (rise > 0 && sink < 1) {
      const grp = (cx, y, w, n, h, seed, tStart, dimA) => { const tt = t - tStart; if (tt <= 0) return;
        const dy = 36 * (1 - eout(tt / 0.9)) + 60 * sink;
        ctx.save(); ctx.translate(0, dy);
        const an = O.crowd(ctx, cx, y, w, n, { h, t, seed, gesture: i => { const g = ["berdiri", "telepon", "pegangHP", "berdiri", "pegangHP", "telepon"][(i + seed) % 6]; return g === "berdiri" ? g : { pose: g, layar: miniScr }; },
          each: (i, o) => Object.assign(o, { alpha: dimA * clamp((tt - i * 0.07) / 0.45) * (1 - sink) }) });
        ctx.restore();
        an.forEach((q, i) => { if (q && clamp((tt - i * 0.07) / 0.45) > 0.3) heads.push([q.head[0] + 4, q.head[1] + dy - 30, COLS[(i + seed) % COLS.length]]); }); };
      grp(470, 842, 700, 9, 128, 13, T.banyak - 0.1, 0.8); grp(1500, 842, 640, 8, 128, 17, T.banyak + 0.1, 0.8);
      grp(430, 905, 640, 7, 168, 5, T.model - 0.35, 1); grp(1500, 905, 560, 6, 168, 9, T.model - 0.2, 1);
    }
    // ---- jaringan ----
    const st = netState(t, T), net = drawNet(ctx, t, st);
    const tgtIn = net ? net.L0.map(p => [p[0], p[1]]) : [];
    // busur "meniru suara" di sisi keluaran
    if (net) arcs(ctx, net.out[0] + 20, net.out[1], t, fd(t, T.tiru - 0.1, 0.4) * (1 - fd(t, T.tiru + 1.6, 0.8)), P.teal);
    // aliran gelombang suara dari kerumunan + dari luar layar
    if (net) {
      const edge = []; for (let i = 0; i < 6; i++) { edge.push([-80, 220 + i * 90, COLS[i % COLS.length]]); edge.push([2000, 250 + i * 85, COLS[(i + 3) % COLS.length]]); }
      flow(ctx, t, heads, tgtIn, { n: 70, life: 1.7, t0: T.model + 0.2, t1: T.dari2 + 1.4, seed: 3, lift: 120, a: st.alpha });
      flow(ctx, t, edge, net.all.map(p => [p[0], p[1]]), { n: 40, life: 1.6, t0: T.banyak, t1: T.dari2 + 1.0, seed: 9, lift: 40, spread: 200, a: st.alpha, size: 1.1 });
    }
    // ---- huruf dari buku Bip (belajar menulis) ----
    const bk = [BIP.x, BIP.y + BIP.s * 0.3 - 14];
    if (net) flow(ctx, t, [bk], net.all.filter(p => p[1] > NETC.y - 40).map(p => [p[0], p[1]]), { n: 16, life: 1.35, t0: T.aisaat - 0.45, t1: T.model + 0.15, seed: 21, lift: 60, spread: 520,
      draw: (c, x, y, ang, sc, a, i) => { const sp = tileSprite(TOK[i % TOK.length]), k = 0.95 * sc; c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(Math.sin(i * 1.7 + t * 2) * 0.25); c.scale(k, k); c.drawImage(sp, -sp.width / 2, -sp.height / 2); c.restore(); } });
    // ---- keluaran: gelombang merah muda menuju spektrogram tiruan ----
    if (net) flow(ctx, t, [[net.out[0], net.out[1], PINK]], [[TIRUR.x + 10, TIRUR.y + 60], [TIRUR.x + 10, TIRUR.y + 110], [TIRUR.x + 10, TIRUR.y + 150]], { n: 14, life: 0.9, t0: T.ucap - 0.35, t1: T.s4 - 0.3, seed: 33, lift: 10, spread: 60, size: 0.9 });
    // aliran ke panel (b2_2–b2_3)
    const bm = fd(t, T.ciri, 0.4) * (1 - fd(t, T.lalu, 0.5));
    if (net && bm > 0.01) { const x0 = net.out[0] + 6, y0 = net.out[1], x1 = PANEL.x - 6, y1 = PANEL.y + 290, col = mixHex(P.amber, PINK, st.tint);
      ctx.save(); ctx.globalAlpha *= bm; ctx.lineCap = "round"; ctx.strokeStyle = D.hexA(col, 0.3); ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      for (let k = 0; k < 4; k++) { const u = (t * 1.3 + k / 4) % 1; D.glow(ctx, lerp(x0, x1, u), lerp(y0, y1, u), 26, "#FFF4C8", 0.9); }
      ctx.restore(); }

    // ---- Bu Rina ----
    if (t > T.s3 - 0.35) {
      const wk = clamp((t - T.s3 + 0.35) / 2.1), x = lerp(-110, RINA.x, 1 - (1 - wk) * (1 - wk) * 0.25 - 0.75 * (1 - wk)), walking = t < T.s3 + 1.75;
      const talk3 = t > T.butuh - 0.15 && t < T.satu + 0.35, w6 = (TL.beats.find(q => q.id === "b2_5a").words || []).map(w => [T.s6 + w[1], T.s6 + w[2]]);
      const talk6 = w6.some(([a0, a1]) => t >= a0 - 0.03 && t <= a1 + 0.02);
      const talk = (talk3 || talk6) && Math.sin(t * 22) > -0.1;
      const ph = eio((t - T.misal + 0.3) / 0.65);
      const o = Object.assign(O.preset("buRina"), { t, seed: 11, look: [0.6, -0.15], face: talk ? "tertawa" : (t > T.s6 ? "bingung" : "senang") });
      o.layar = miniScr;
      if (walking) Object.assign(o, { pose: "jalan" });
      else if (ph >= 1) Object.assign(o, { pose: "telepon" });
      else if (ph > 0) Object.assign(o, { pose: "berdiri", blend: { to: "telepon", k: ph } });
      else Object.assign(o, { pose: "berdiri" });
      if (t > T.s6 && !talk) o.face = "bingung";
      var rina = O.draw(ctx, x, RINA.y, RINA.h, o);
    }
    // ---- tombol "Ucapkan" (b2_3) ----
    const ba = fd(t, T.lalu - 0.1, 0.3) * (1 - fd(t, T.s4 + 0.3, 0.5)); let btnTop = [BTN.x - 112, BTN.y - 38];
    let pressU = 0; if (t > T.buat - 0.2) pressU = t < T.buat + 0.05 ? eio((t - T.buat + 0.2) / 0.25) : 1 - eio((t - T.buat - 0.3) / 0.35);
    if (ba > 0.01) { ctx.save(); ctx.globalAlpha *= ba; const k = Math.min(1.06, spring(t - T.lalu + 0.1, 11, 0.5)); ctx.translate(BTN.x, BTN.y); ctx.scale(k, k); ctx.translate(-BTN.x, -BTN.y);
      const bt = B.tombol(ctx, BTN.x, BTN.y, BTN.w, { label: "Ucapkan", color: P.pink, press: pressU, blink: t < T.buat ? 0.8 : 0, t, textSize: 46 }); ctx.restore(); btnTop = [BTN.x - 112, BTN.y + (bt.top[1] - BTN.y) * k + 4]; }
    // ---- stopwatch (b2_4–b2_5a) ----
    let sec = 0, run = false;
    if (t >= T.sw) { sec = Math.min(3, t - T.sw); run = t < T.sw + 3; }
    if (t >= T.misal) sec = 3 * (1 - eio((t - T.misal) / 0.45));
    if (t >= T.halo - 0.05) { sec = Math.max(0, Math.min(T.end6, t) - T.halo + 0.05); run = t < T.end6; }
    const swA = fd(t, T.rekaman - 0.25, 0.3);
    let pressW = 0; if (t > T.sw - 0.2 && t < T.sw + 0.6) pressW = t < T.sw ? eio((t - T.sw + 0.2) / 0.2) : 1 - eio((t - T.sw - 0.15) / 0.3);
    if (swA > 0.01) stopwatch(ctx, SW.x, SW.y, SW.R, sec, { t, run, press: pressW, sector: fd(t, T.tigadet - 0.05, 0.4) * (1 - fd(t, T.misal, 0.4)), alpha: swA, scale: lerp(0.4, 1, Math.min(1.05, spring(t - T.rekaman + 0.25, 11, 0.5))) });

    // ---- Bip ----
    const bo = { t, seed: 2 };
    const strips = { asli: [ASLI.x + ASLI.w / 2, ASLI.y + ASLI.h / 2], tiru: [TIRUR.x + TIRUR.w / 2, TIRUR.y + TIRUR.h / 2] };
    if (t < T.model - 0.15) Object.assign(bo, { pose: "pegang", look: [-0.15, 0.7], mood: t > T.aisaat ? "wow" : "happy", prop: (c, px, py, s) => book(c, px, py, s * 0.62, fd(t, T.aisaat - 0.4, 0.4), t) });
    else if (t < T.ratus - 0.1) Object.assign(bo, { pose: "diam", look: [-0.4, -0.85], mood: "wow" });
    else if (t < T.ratus + 1.3) Object.assign(bo, { pose: "kaget", k: t - T.ratus + 0.1 });
    else if (t < T.banyak - 0.2) Object.assign(bo, { pose: "diam", look: [0, -0.9], mood: "wow" });
    else if (t < T.banyak + 0.9) Object.assign(bo, { pose: "tunjuk", target: [420, 740] });
    else if (t < T.s2 + 1.6) Object.assign(bo, { pose: "tunjuk", target: [1500, 740] });
    else if (t < T.hub - 0.2) Object.assign(bo, { pose: "diam", look: [0, -0.9], mood: "think" });
    else if (t < T.ciri - 0.2) Object.assign(bo, { pose: "tunjuk", target: [CARD.x + CARD.w * 0.7, CARD.y + CARD.h * 0.6] });
    else if (t < T.s3 + 0.4) Object.assign(bo, { pose: "tunjuk", target: [PANEL.x + 20, PANEL.y + 300] });
    else if (t < T.butuh - 0.1) Object.assign(bo, { pose: "diam", wave: t, look: [-0.9, -0.2], mood: "happy" });
    else if (t < T.tebak - 0.1) Object.assign(bo, { pose: "tunjuk", target: [RINA.x + 40, 400] });
    else if (t < T.lalu - 0.1) Object.assign(bo, { pose: "diam", look: [0.8, -0.6], mood: "wow" });
    else if (t < T.buat + 0.75) Object.assign(bo, { pose: "tekan", target: btnTop, press: pressU });
    else if (t < T.s4) Object.assign(bo, { pose: "diam", look: [0.9, -0.5], mood: t > T.apa + 0.3 ? "think" : "wow" });
    else if (t < T.akurat + 2.1) Object.assign(bo, { pose: "kacaPembesar", target: t < T.akurat + 0.9 ? strips.asli : strips.tiru,
      content: (c, cx, cy, r) => L.spektrogram(c, cx - r, cy - r * 0.7, 2 * r, 1.4 * r, { profil: t < T.akurat + 0.9 ? IBU : TIRU, dur: 1.3, scroll: 1 + t * 0.2, frame: false, r: 0 }) });
    else if (t < T.mcafee - 0.2) Object.assign(bo, { pose: "diam", look: [-0.2, -0.9], mood: "think" });
    else if (t < T.alat) Object.assign(bo, { pose: "tunjuk", target: [960, 150] });
    else if (t < T.rekaman - 0.25) Object.assign(bo, { pose: "diam", look: [-0.3, -0.9], mood: t > T.persen - 0.3 ? "wow" : "think" });
    else if (t < T.sw + 0.7) Object.assign(bo, { pose: "tekan", target: [SW.x, SW.y - SW.R * 1.37], press: pressW });
    else if (t < T.s5) Object.assign(bo, { pose: "diam", look: [-0.9, -0.2], mood: t > T.tigadet ? "wow" : "happy" });
    else Object.assign(bo, { pose: "diam", look: t > T.siapa ? [-0.6, -0.8] : [-0.9, -0.45], mood: t > T.siapa - 0.1 ? "wow" : "happy" });
    B.draw(ctx, BIP.x, BIP.y, BIP.s, bo);
    ctx.restore();

    // =================== lapisan label (sesudah vignette) ===================
    D.post(c => panel(c, t, T, cm));
    D.post(c => card(c, t, T, cm, net && { inp: net.inp }));
    // label "ratusan ribu jam rekaman" dengan jam berputar cepat
    const ha = fd(t, T.ratus - 0.05, 0.25) * (1 - fd(t, T.hub - 0.6, 0.5));
    if (ha > 0.01) D.post(c => { c.save(); const k = lerp(0.6, 1, Math.min(1.05, spring(t - T.ratus + 0.05, 10, 0.5))); c.globalAlpha *= ha * rd(k, 52); c.translate(960, 116); c.scale(k, k);
      const fs = 52, s = "ratusan ribu jam rekaman"; c.font = `800 ${fs}px ${K.FONT}`; const tw = c.measureText(s).width, w = tw + 150, h = 88;
      c.fillStyle = "rgba(10,18,52,0.9)"; H.rr(c, -w / 2, -h / 2, w, h, h / 2); c.fill(); c.strokeStyle = D.hexA(P.amber, 0.9); c.lineWidth = 3; c.stroke();
      clockIcon(c, -w / 2 + 52, 0, 28, t, 9); D.txt(c, s, -w / 2 + 98, fs * 0.36, fs, { weight: 800 }); c.restore(); });
    // contoh suara singkat dari Bu Rina → terbang ke jaringan
    const ca = fd(t, T.contoh - 0.55, 0.3);
    if (ca > 0.01 && net) { const fly = eio((t - T.satu + 0.05) / 1.15); if (fly < 1) D.post(c => {
      c.save(); cm.apply(c); const w0 = 250, h0 = 120, x0 = RINA.x - w0 / 2 + 10, y0 = 345, tx = net.inp[0], ty = net.inp[1];
      const sp = Math.min(1.05, spring(t - T.contoh + 0.55, 10, 0.55)), k = lerp(0.5, 1, sp) * lerp(1, 0.15, fly), cx = lerp(x0 + w0 / 2, tx, fly), cy = lerp(y0 + h0 / 2, ty, fly) - Math.sin(PI * fly) * 120;
      c.globalAlpha *= ca * (1 - clamp((fly - 0.8) / 0.2)); c.translate(cx, cy); c.scale(k, k);
      D.glow(c, 0, 0, 200, PINK, 0.45); L.spektrogram(c, -w0 / 2, -h0 / 2, w0, h0, { profil: IBU, dur: 1.4, scroll: 0.4, reveal: clamp((t - T.contoh + 0.55) / 0.9), aksen: PINK, r: 16 });
      c.restore(); }); }
    const cla = fd(t, T.contoh - 0.05, 0.25) * (1 - fd(t, T.satu - 0.1, 0.3));
    if (cla > 0.01) D.post(c => { const [x, y] = cm.S(RINA.x + 10, 285); pillAt(c, "contoh singkat", x, y, cla, lerp(0.6, 1, Math.min(1.05, spring(t - T.contoh + 0.05, 11, 0.5))), { col: PINK, size: 46 }); });
    // kalimat yang diketik (b2_3) dengan benang ke jaringan
    const ka = fd(t, T.lalu - 0.15, 0.3) * (1 - fd(t, T.akurat - 0.2, 0.4));
    if (ka > 0.01) D.post(c => {
      const s1 = "Selamat pagi, semua!", s2 = "Nak, tolong kirim uang.", second = t >= T.apa - 0.1, s = second ? s2 : s1, t0 = second ? T.apa - 0.1 : T.lalu + 0.1, n = Math.floor(s.length * clamp((t - t0) / (second ? 0.75 : 1.4)));
      c.save(); c.globalAlpha *= ka; cm.apply(c); const fs = 54; c.font = `800 ${fs}px ${K.FONT}`; const w = Math.max(c.measureText(s1).width, c.measureText(s2).width) + 140, h = 96, x = 960 - w / 2, y = 78;
      const k = lerp(0.6, 1, Math.min(1.05, spring(t - T.lalu + 0.15, 10, 0.55))); c.globalAlpha *= rd(k, 54); c.translate(960, y + h / 2); c.scale(k, k); c.translate(-960, -(y + h / 2));
      // benang ke jaringan
      if (net) { c.strokeStyle = D.hexA(PINK, 0.85); c.lineWidth = 5; c.setLineDash([12, 10]); c.lineDashOffset = -t * 50; c.beginPath(); c.moveTo(960, y + h); c.lineTo(net.top[0], net.top[1] + 20); c.stroke(); c.setLineDash([]); }
      c.fillStyle = "rgba(16,20,64,0.25)"; H.rr(c, x + 4, y + 6, w, h, 26); c.fill(); c.fillStyle = "#FFF6E6"; H.rr(c, x, y, w, h, 26); c.fill(); c.strokeStyle = PINK; c.lineWidth = 5; c.stroke();
      L.ikon(c, "mik", x + 52, y + h / 2, 44, PINK);
      const shown = s.slice(0, n); D.txt(c, shown, x + 96, y + h / 2 + fs * 0.36, fs, { weight: 800, color: "#1E2A6B" });
      if (Math.floor(t * 2.4) % 2 === 0 || n < s.length) { const cw = c.measureText(shown).width; c.fillStyle = PINK; c.fillRect(x + 100 + cw, y + 24, 5, h - 48); }
      c.restore(); });
    // spektrogram tiruan (keluar dari jaringan)
    const ta = fd(t, T.ucap - 0.2, 0.3) * (1 - fd(t, T.s5 + 0.25, 0.7));
    if (ta > 0.01) D.post(c => { c.save(); c.globalAlpha *= ta; cm.apply(c); const dx = 260 * eio((t - T.s5 - 0.25) / 0.8); c.translate(dx, 0);
      const second = t >= T.apa - 0.05, rv = second ? clamp((t - T.apa + 0.05) / 1.0) : clamp((t - T.ucap + 0.2) / 1.2);
      if (fd(t, T.mirip, 0.4) > 0) D.glow(c, TIRUR.x + TIRUR.w / 2, TIRUR.y + TIRUR.h / 2, 300, PINK, 0.25 * fd(t, T.mirip, 0.4));
      L.spektrogram(c, TIRUR.x, TIRUR.y, TIRUR.w, TIRUR.h, { profil: TIRU, dur: 3.6, scroll: second ? 8.6 : 4.4, reveal: rv, aksen: PINK, label: "suara tiruan", labelSize: 44, r: 18 });
      c.restore(); });
    // spektrogram asli (b2_4) → gelembung kalimat (b2_5, b2_5a)
    const aa = fd(t, T.akurat - 0.35, 0.35);
    if (aa > 0.01 && rina) D.post(c => {
      c.save(); c.globalAlpha *= aa; cm.apply(c);
      const m = eio((t - T.kalimat + 0.55) / 0.85), sp = Math.min(1.04, spring(t - T.akurat + 0.35, 10, 0.55)), k0 = lerp(0.3, 1, sp);
      const R = { x: lerp(ASLI.x, BUB.x, m), y: lerp(ASLI.y, BUB.y, m), w: lerp(ASLI.w, BUB.w, m), h: lerp(ASLI.h, BUB.h, m) };
      c.globalAlpha *= rd(k0, 44); c.translate(R.x + R.w / 2, R.y + R.h); c.scale(k0, k0); c.translate(-(R.x + R.w / 2), -(R.y + R.h));
      if (m > 0.01) {   // gelembung krem dengan ekor ke mulut Bu Rina
        c.save(); c.globalAlpha *= m; const mx = rina.head[0] + 40, my = rina.head[1] + 12;
        c.fillStyle = "rgba(16,20,64,0.25)"; H.rr(c, R.x + 5, R.y + 7, R.w, R.h, 36); c.fill();
        c.fillStyle = "#FFF6E6"; H.rr(c, R.x, R.y, R.w, R.h, 36); c.fill(); c.beginPath(); c.moveTo(R.x + 70, R.y + R.h - 4); c.lineTo(mx, my); c.lineTo(R.x + 150, R.y + R.h - 4); c.closePath(); c.fill();
        c.restore(); }
      // isi spektrogram: penuh di kotak asli, lalu menjadi pita di bawah gelembung
      const band = { x: lerp(R.x, R.x + 26, m), y: lerp(R.y, R.y + R.h - 88, m), w: lerp(R.w, R.w - 52, m), h: lerp(R.h, 66, m) };
      const live = t >= T.halo - 0.1, rvB = live ? clamp((t - T.halo + 0.1) / (T.end6 - T.halo + 0.1)) : 1;
      L.spektrogram(c, band.x, band.y, band.w, band.h, { profil: IBU, dur: live ? 2.3 : 4, scroll: live ? 6.2 : 0.6, reveal: m > 0.5 && t > T.misal + 0.2 ? (live ? rvB : 0) : 1,
        aksen: m < 0.5 ? PINK : undefined, label: m < 0.3 ? "suara asli" : undefined, labelSize: 44, r: lerp(18, 12, m), alpha: 1 });
      // jendela 3 detik pada stopwatch
      const run3 = clamp((t - T.sw) / 3), wa = (t > T.sw ? 1 : 0) * (1 - fd(t, T.kalimat - 0.6, 0.4));
      if (wa > 0.01) { c.save(); c.globalAlpha *= wa; const ww = ASLI.w * 0.75 * run3; c.fillStyle = "rgba(255,255,255,0.14)"; c.fillRect(ASLI.x, ASLI.y, ww, ASLI.h);
        c.strokeStyle = "#FFFFFF"; c.lineWidth = 5; c.strokeRect(ASLI.x + 2, ASLI.y + 2, Math.max(0, ww - 4), ASLI.h - 4); c.restore(); }
      // kata-kata ("…" lalu "Halo, iya, siapa ini?")
      if (m > 0.6) { const wy = R.y + 70, fs = 58, cx = R.x + R.w / 2;
        if (t < T.halo - 0.05) { for (let i = 0; i < 3; i++) { const bb = 0.5 + 0.5 * Math.sin(t * 7 - i * 0.9); c.fillStyle = D.hexA("#7A84C2", 0.5 + 0.5 * bb); c.beginPath(); c.arc(cx - 40 + i * 40, wy - 16 - bb * 6, 12, 0, TAU); c.fill(); } }
        else { const parts = [["Halo, ", T.halo], ["iya, ", T.iya], ["siapa ini?", T.siapa]]; c.font = `900 ${fs}px ${K.FONT}`; const full = parts.map(p => p[0]).join(""), tw = c.measureText(full).width; let x = cx - tw / 2;
          parts.forEach(([s, ts]) => { const u = fd(t, ts - 0.05, 0.18), w = c.measureText(s).width; if (u > 0) { c.save(); c.globalAlpha *= u; c.translate(x + w / 2, wy); const kk = lerp(0.7, 1, Math.min(1.05, spring(t - ts + 0.05, 14, 0.5))); c.scale(kk, kk);
            D.txt(c, s.trim(), -w / 2, 0, fs, { weight: 900, color: "#1E2A6B" }); c.restore(); } x += w; }); } }
      // titik rekam merah (kait ke bab 3)
      const rec = fd(t, T.siapa - 0.2, 0.3);
      if (rec > 0.01 && m > 0.9) { const px = R.x + R.w - 34, py = R.y + 30, pul = 0.5 + 0.5 * Math.sin(t * 7);
        c.save(); c.globalAlpha *= rec; D.glow(c, px, py, 46, "#FF5A5F", 0.6 * pul); c.strokeStyle = D.hexA("#FF5A5F", 0.6 * (1 - pul)); c.lineWidth = 4; c.beginPath(); c.arc(px, py, 16 + 14 * (1 - pul), 0, TAU); c.stroke();
        c.fillStyle = "#FF3B4A"; c.beginPath(); c.arc(px, py, 15, 0, TAU); c.fill(); c.restore(); }
      c.restore(); });
    // meteran kemiripan (jaringan menyusut menjadi meteran)
    const ma = fd(t, T.mirip - 0.05, 0.3) * (1 - fd(t, T.s5 + 0.3, 0.6));
    if (ma > 0.01) D.post(c => { c.save(); c.globalAlpha *= ma; cm.apply(c); const dx = 340 * eio((t - T.s5 - 0.3) / 0.8); c.translate(dx, 0);
      const v = 85 * eout((t - T.lapan + 0.1) / (T.persen - T.lapan + 0.05)), done = fd(t, T.persen, 0.3);
      // garis pembanding dari kedua spektrogram
      c.strokeStyle = D.hexA("#FFFFFF", 0.7); c.lineWidth = 4; c.setLineDash([10, 10]); c.lineDashOffset = -t * 40;
      c.beginPath(); c.moveTo(ASLI.x + ASLI.w + 10, ASLI.y + ASLI.h / 2); c.quadraticCurveTo(700, 290, 770, 320); c.moveTo(TIRUR.x - 10 - dx, TIRUR.y + TIRUR.h / 2); c.quadraticCurveTo(1220, 290, 1150, 320); c.stroke(); c.setLineDash([]);
      if (done > 0) D.glow(c, 960, 360, 330, P.pink, 0.35 * done * (0.7 + 0.3 * Math.sin(t * 4)));
      const k = lerp(0.3, 1, Math.min(1.04, spring(t - T.mirip + 0.05, 10, 0.55))); c.globalAlpha *= (40 * k * cm.z >= 39.6 || t > T.mirip + 0.5) ? 1 : 0.34; c.translate(960, 345); c.scale(k, k); c.translate(-960, -345);
      B.meteran(c, 960, 345, 400, { value: Math.round(v), t, label: "kemiripan" }); c.restore(); });
    // sumber: satu temuan McAfee 2023
    const sa = fd(t, T.mcafee - 0.05, 0.25) * (1 - fd(t, T.s5 + 0.2, 0.5));
    if (sa > 0.01) D.post(c => { const s = t >= T.tahun - 0.05 ? "Satu temuan McAfee, 2023" : "Satu temuan McAfee";
      pillAt(c, s, 960, 118, sa, lerp(0.6, 1, Math.min(1.05, spring(t - T.mcafee + 0.05, 11, 0.5))), { col: P.amber, size: 48 }); });
    // bacaan stopwatch
    if (swA > 0.01) D.post(c => { const [x, y] = cm.S(SW.x, SW.y + SW.R * 1.2 + 42); const hot = fd(t, T.tigadet - 0.1, 0.3) * (1 - fd(t, T.misal, 0.4)) + fd(t, T.tiga5 - 0.1, 0.2) * (1 - fd(t, T.tiga5 + 0.9, 0.4));
      readout(c, `${fmt1(sec)} detik`, x, y, cm.z * lerp(0.5, 1, Math.min(1.05, spring(t - T.rekaman + 0.25, 11, 0.5))), swA, clamp(hot)); });
  }

  K.SCENES.d03_b2 = function (ctx, b, l, t, TL) { return scene(ctx, b, l, t, TL); };
  K.SCENES.d03_b2.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b2 = TL => [
    K.sfxAt(TL, "b2_1", "meniru suara", 0.0, "shimmer", 0.45),
    K.sfxAt(TL, "b2_1", "AI saat", -0.6, "whoosh", 0.5),
    K.sfxAt(TL, "b2_1", "Model AI", -0.3, "riser", 0.5),
    K.sfxAt(TL, "b2_1", "ratusan ribu jam", 0.0, "pop", 0.7),
    K.sfxAt(TL, "b2_1", "banyak sekali orang", -0.1, "shimmer", 0.55),
    K.sfxAt(TL, "b2_2", "model AI belajar", 0.0, "shimmer", 0.45),
    K.sfxAt(TL, "b2_2", "tulisan", -0.1, "pop", 0.55),
    K.sfxAt(TL, "b2_2", "bunyi", 0.0, "pop", 0.5),
    K.sfxAt(TL, "b2_2", "ciri-ciri", -0.75, "whoosh", 0.55),
    K.sfxAt(TL, "b2_2", "berbeda", 0.0, "clack", 0.4),
    K.sfxAt(TL, "b2_3", "contoh singkat", -0.5, "pop", 0.6),
    K.sfxAt(TL, "b2_3", "satu orang", -0.6, "whoosh", 0.6),
    K.sfxAt(TL, "b2_3", "menebak pola", -0.1, "shimmer", 0.7),
    K.sfxAt(TL, "b2_3", "membuat suara", 0.0, "clack", 0.7),
    K.sfxAt(TL, "b2_3", "mengucapkan", -0.75, "whoosh", 0.5),
    K.sfxAt(TL, "b2_4", "Seberapa akurat", -0.9, "whoosh", 0.45),
    K.sfxAt(TL, "b2_4", "McAfee", 0.0, "pop", 0.55),
    K.sfxAt(TL, "b2_4", "persen", 0.0, "riser", 0.7),
    K.sfxAt(TL, "b2_4", "persen", 0.05, "boom", 0.55),
    K.sfxAt(TL, "b2_4", "dari rekaman", 0.42, "clack", 0.65),
    K.sfxAt(TL, "b2_4", "tiga detik", 0.3, "pop", 0.7),
    K.sfxAt(TL, "b2_5", "satu kalimat pendek", -1.15, "whoosh", 0.5),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
