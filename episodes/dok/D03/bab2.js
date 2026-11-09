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
  const PANEL = { x: 1330, y: 140, w: 480, h: 600 };
  const CARD = { x: 150, y: 200, w: 480, h: 390 };
  const ASLI = { x: 120, y: 305, w: 440, h: 170 };
  const TIRUR = { x: 1340, y: 330, w: 460, h: 170 };
  const BUB = { x: 400, y: 250, w: 720, h: 270 };
  const SW = { x: 1180, y: 790, R: 66 };            // stopwatch tepat di kanan Bip; tombol start di kiri atas (menghadap Bip)
  const SWB = -PI / 4;                               // rotasi tombol start (arah kiri atas)
  const SWTIP = [SW.x - 1.36 * SW.R * Math.SQRT1_2, SW.y - 1.36 * SW.R * Math.SQRT1_2];
  const BTN = { x: 1250, y: 835, w: 280 };
  const CLIP = { cx: 450, cy: 395, w: 330, h: 140 };  // contoh suara singkat Bu Rina
  const BOOKF = { x: 860, y: 878 };                  // buku tertutup di lantai
  const REC = { x: 560, y: 198 };                    // pil "REC" di atas gelembung
  const MCAF = { x: 580, y: 118 };                   // label sumber, kiri atas (Bip menunjuk serong)
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
      buatT: A("b2_4", "membuat tiruan"),
    };
    const b6 = bt("b2_5a"); T.end6 = b6.start + D.speechEnd(b6); T.endAll = b6.start + b6.dur;
    T.sw = T.rekaman + 0.42;   // stopwatch ditekan Bip
    T.st6 = T.s6;              // stopwatch berjalan lagi saat Bu Rina mengangkat telepon dan mulai bicara
    // huruf dari buku: 8 ubin, berjarak 0,28 s, terbang 0,85 s; selesai sebelum "Model"
    T.tile0 = T.aisaat - 0.6; T.bkClose = T.tile0 + 7 * 0.28 + 0.12; T.bkPut = T.bkClose + 0.34;
    // sorotan profil di panel: Ayah → Anak → Ibu (b2_2); netral selama b2_3; terkunci pada Ibu saat "menebak"
    T.sorot = [[T.seseorang - 0.1, 0], [T.beda - 0.1, 1], [T.lain - 0.1, 2], [T.s3 - 0.1, -1], [T.tebak - 0.05, 2]];
    T.cam = [[T.s1, 960, 540, 1.0], [T.s2, 960, 520, 1.035], [T.s3 + 1.2, 960, 525, 1.0], [T.s4 + 0.5, 960, 525, 1.0], [T.rekaman, 960, 530, 1.025],
      [T.s5 + 0.15, 960, 530, 1.03], [T.s5 + 2.3, 830, 540, 1.09], [T.endAll, 820, 540, 1.1]];
    TC = T; TCL = TL; return T;
  }

  // =====================================================================================
  // jaringan neuron semu-3D
  // =====================================================================================
  const NET = (() => {
    // 5 lapisan = 5 kolom simpul yang rapi: tiap lapisan sebuah cincin (lapisan tengah + satu simpul pusat)
    const r = D.rng(4242), LAY = [7, 9, 11, 9, 7], RAD = [], nodes = [], edges = [];
    LAY.forEach((n, li) => {
      const u = li / (LAY.length - 1), x = u * 2 - 1, R = 0.4 + 0.5 * Math.sin(PI * (0.15 + 0.7 * u)), ring = (li === 0 || li === LAY.length - 1) ? n : n - 1; RAD.push(R);
      if (ring < n) nodes.push({ li, x, y: 0, z: 0, ph: r() * TAU });
      for (let i = 0; i < ring; i++) { const a = i / ring * TAU + li * 0.35; nodes.push({ li, x, y: Math.sin(a) * R, z: Math.cos(a) * R, ph: r() * TAU }); }
    });
    nodes.forEach((a, i) => { if (a.li === LAY.length - 1) return;
      nodes.map((b, j) => [j, b]).filter(([, b]) => b.li === a.li + 1).map(([j, b]) => [j, (b.y - a.y) ** 2 + (b.z - a.z) ** 2 + r() * 0.3]).sort((p, q) => p[1] - q[1]).slice(0, 3)
        .forEach(([j]) => edges.push({ a: i, b: j, k: r(), k2: r() })); });
    return { LAY, RAD, nodes, edges };
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
      yaw: 0.3 + 0.1 * Math.sin((t - T.s1) * 0.17), pitch: 0.17 + 0.04 * Math.sin(t * 0.23), act, flash, tint: eio((t - T.tebak + 0.1) / 0.7), glow: 0.55 + 0.45 * act + 0.3 * fd(t, T.model, 1) * (1 - fd(t, T.ciri, 1.5)) };
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
    NET.LAY.forEach((n, li) => { const u = li / (NET.LAY.length - 1), x = u * 2 - 1, R = NET.RAD[li], lf = Math.exp(-((st.flash - li) ** 2) / 0.35);
      ctx.beginPath(); for (let k = 0; k <= 48; k++) { const a = k / 48 * TAU, p = pj(x, Math.sin(a) * R, Math.cos(a) * R); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      ctx.fillStyle = D.hexA(colOf(li), 0.09 + 0.08 * lf); ctx.fill();
      ctx.strokeStyle = D.hexA(colOf(li), 0.22 + 0.2 * lf); ctx.lineWidth = 12 * sc; ctx.stroke();
      ctx.strokeStyle = D.hexA(lf > 0.3 ? "#FFF4C8" : colOf(li), 0.62 + 0.3 * lf); ctx.lineWidth = 3.5 * sc; ctx.stroke(); });
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
  // sungai suara: pita bercahaya tebal yang masuk ke sisi masukan (kiri) jaringan
  function ribbonOf(net) {
    const ip = net.inp, a = [ip[0] - 290, ip[1] + 46], c = [ip[0] - 120, ip[1] + 58], b = [ip[0] + 6, ip[1]];
    return u => bez(a, c, b, clamp(u));
  }
  function ribbon(ctx, t, rib, a) {
    if (a <= 0.01) return; const N = 26, pts = [], nor = [];
    for (let i = 0; i <= N; i++) pts.push(rib(i / N));
    for (let i = 0; i <= N; i++) { const p = pts[Math.max(0, i - 1)], q = pts[Math.min(N, i + 1)], dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1; nor.push([-dy / d, dx / d]); }
    const band = (wf, fill) => { ctx.beginPath(); for (let i = 0; i <= N; i++) { const w = wf(i / N); ctx.lineTo(pts[i][0] + nor[i][0] * w, pts[i][1] + nor[i][1] * w); }
      for (let i = N; i >= 0; i--) { const w = wf(i / N); ctx.lineTo(pts[i][0] - nor[i][0] * w, pts[i][1] - nor[i][1] * w); } ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
    ctx.save(); ctx.globalAlpha *= a;
    const g0 = ctx.createLinearGradient(pts[0][0], 0, pts[N][0], 0); g0.addColorStop(0, D.hexA(P.teal, 0.0)); g0.addColorStop(0.25, D.hexA(P.violet, 0.3)); g0.addColorStop(1, D.hexA("#7FE3FF", 0.42));
    band(u => lerp(66, 44, u) * (0.92 + 0.08 * Math.sin(t * 3 + u * 6)), g0);
    const g1 = ctx.createLinearGradient(pts[0][0], 0, pts[N][0], 0); g1.addColorStop(0, D.hexA("#FFF4C8", 0)); g1.addColorStop(0.3, D.hexA("#BFF3FF", 0.55)); g1.addColorStop(1, D.hexA("#FFF4C8", 0.9));
    band(u => lerp(22, 15, u), g1);
    for (let k = 0; k < 9; k++) { const u = (t * 0.85 + k / 9) % 1, p = rib(u); D.glow(ctx, p[0], p[1], 34, k % 2 ? "#FFF4C8" : "#7FE3FF", 0.75 * Math.sin(PI * u)); }
    D.glow(ctx, pts[N][0], pts[N][1], 120, "#BFF3FF", 0.5); D.glow(ctx, pts[N][0], pts[N][1], 46, "#FFFFFF", 0.7);
    ctx.restore();
  }
  // gelombang yang mengalir sepanjang lengkung dari sumber ke muara pita, lalu ikut pita masuk ke jaringan
  function flowVia(ctx, t, srcs, rib, o) {
    if (!srcs.length) return; const MA = rib(0), F = 0.7;
    for (let i = 0; i < o.n; i++) {
      const r = D.rng(i * 7919 + (o.seed || 1)), k = r(), k2 = r(), k3 = r(), life = o.life * (0.8 + 0.4 * r());
      const ph = ((t / life + k) % 1 + 1) % 1, birth = t - ph * life; if (birth < o.t0 || birth > o.t1) continue;
      const s = srcs[(i * 3 + Math.floor(k3 * 7)) % srcs.length];
      const c = [lerp(s[0], MA[0], 0.5) + (k2 - 0.5) * (o.spread || 160), Math.min(s[1], MA[1]) - (o.lift || 40) - k3 * 80];
      const pt = u => u < F ? bez(s, c, MA, u / F) : rib((u - F) / (1 - F));
      const u = ph, p = pt(u), q = pt(Math.min(1, u + 0.02));
      const a = Math.pow(Math.sin(PI * Math.min(1, ph * 1.15)), 0.5) * (o.a == null ? 1 : o.a), sc = u < F ? lerp(1, 0.75, u / F) : lerp(0.75, 0.4, (u - F) / (1 - F));
      waveGlyph(ctx, p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0]), 54 * sc * (o.size || 1), 9.5 * sc * (o.size || 1), s[2] || COLS[i % COLS.length], a, t * 9 + k * 10);
    }
  }
  // lapisan kerumunan jauh: ratusan siluet kecil yang memudar ke cakrawala (paralaks pelan)
  function farCrowd(ctx, t, a, tt) {
    if (a <= 0.01) return; ctx.save();
    const BG = "#8A7FD2", SK = ["#C98F6A", "#A86F4E", "#E0B08A", "#8C5A3E"];
    for (let r = 5; r >= 0; r--) {
      const y = 850 - r * 17, k = 1 - r * 0.13, sp = 25 * k, par = Math.sin(t * 0.22) * (r + 1) * 3 + (r % 2) * sp * 0.5, fade = 0.42 + r * 0.1, rr = D.rng(500 + r);
      for (let x = -40 + par; x < 1960; x += sp) {
        const j = rr(), j2 = rr(), j3 = rr(), sweep = clamp((tt * 1900 - (x + r * 120)) / 260), al = a * sweep * (0.95 - r * 0.1); if (al <= 0.01) continue;
        const hh = 40 * k * (0.82 + 0.36 * j), bob = Math.sin(t * 2 + j * 20) * 1.3 * k, xx = x + (j2 - 0.5) * sp * 0.45;
        ctx.globalAlpha = al; ctx.fillStyle = mixHex(COLS[Math.floor(j3 * 7)], BG, fade);
        H.rr(ctx, xx - 10 * k, y - hh * 0.5 + bob, 20 * k, hh * 0.5 + 4, 8 * k); ctx.fill();
        ctx.fillStyle = mixHex(SK[Math.floor(j2 * 4)], BG, fade * 0.9); ctx.beginPath(); ctx.arc(xx, y - hh * 0.66 + bob, 7 * k, 0, TAU); ctx.fill();
        if (j < 0.16) { const u = (t * 0.7 + j * 9) % 1; ctx.globalAlpha = al * Math.sin(PI * u) * 0.9; ctx.fillStyle = COLS[Math.floor(j2 * 7)]; ctx.beginPath(); ctx.arc(xx + Math.sin(u * 6) * 3, y - hh * 0.9 - u * 46 * k, 2.6 * k + 1, 0, TAU); ctx.fill(); }
      }
    }
    ctx.restore();
  }
  // ubin huruf: kipas dari atas buku Bip menuju jaringan
  const TOK = ["a", "Halo", "apa", "ka", "kabar", "kamu", "ini", "kata"];
  function tiles(ctx, t, T) {
    for (let i = 0; i < TOK.length; i++) {
      const t0 = T.tile0 + i * 0.28, u = (t - t0) / 0.85; if (u <= 0 || u >= 1) continue;
      const side = i % 2 ? 1 : -1, lvl = Math.floor(i / 2), ang = side * (0.24 + 0.19 * lvl);
      const s0 = [BIP.x + side * 16, BIP.y + BIP.s * 0.3 - 34], c = [s0[0] + Math.sin(ang) * 430, s0[1] - Math.cos(ang) * 430];
      const e = [NETC.x + side * (50 + 62 * lvl), NETC.y + 70 - 26 * lvl], v = 1 - (1 - u) * (1 - u), p = bez(s0, c, e, v);
      const sp = tileSprite(TOK[i]), k = lerp(1, 0.42, v) * Math.min(1, 0.6 + u * 6), a = clamp(u / 0.06) * (1 - clamp((u - 0.78) / 0.22));
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(p[0], p[1]); ctx.rotate(side * 0.12 * Math.sin(PI * u)); ctx.scale(k, k); ctx.drawImage(sp, -sp.width / 2, -sp.height / 2); ctx.restore();
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

  // =====================================================================================
  // benda kecil
  // =====================================================================================
  function book(ctx, x, y, w, glowA, t, close = 0) {   // buku terbuka di tangan Bip; close 0..1 = halaman kanan menutup ke kiri
    const h = w * 0.48, cr = Math.cos(PI * clamp(close)); ctx.save(); ctx.translate(x, y);
    if (glowA > 0) D.glow(ctx, 0, -h * 0.4, w * 0.9, P.warm, 0.5 * glowA);
    ctx.fillStyle = "#C2456E"; H.rr(ctx, -w / 2 - 6, -h / 2 + 4, w / 2 + 6 + Math.max(0, cr) * (w / 2 + 6), h + 8, 8); ctx.fill();
    const page = (sd, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -h / 2 + 6); ctx.quadraticCurveTo(sd * w * 0.25, -h / 2 - 4, sd * w / 2, -h / 2 + 2);
      ctx.lineTo(sd * w / 2, h / 2); ctx.quadraticCurveTo(sd * w * 0.25, h / 2 - 8, 0, h / 2 + 2); ctx.closePath(); ctx.fill();
      if (col[1] === "F") { ctx.strokeStyle = "rgba(42,47,106,0.35)"; ctx.lineWidth = 3; for (let k = 0; k < 4; k++) { const yy = -h / 2 + 12 + k * h * 0.2; ctx.beginPath(); ctx.moveTo(sd * w * 0.08, yy + 2); ctx.lineTo(sd * w * (0.42 - (k === 3 ? 0.12 : 0)), yy); ctx.stroke(); } } };
    page(-1, "#FFF6E6");
    ctx.save(); ctx.scale(cr, 1); page(1, cr >= 0 ? "#F3E9D6" : "#D9557F"); ctx.restore();
    ctx.strokeStyle = "rgba(42,47,106,0.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -h / 2 + 6); ctx.lineTo(0, h / 2 + 2); ctx.stroke();
    ctx.restore();
  }
  function bookFlat(ctx, x, y, w, a) {   // buku tertutup tergeletak di lantai
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = "rgba(14,18,60,0.3)"; ctx.beginPath(); ctx.ellipse(x, y + 4, w * 0.62, 9, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#A8385F"; H.rr(ctx, x - w / 2, y - 22, w, 24, 6); ctx.fill();
    ctx.fillStyle = "#FFF6E6"; ctx.fillRect(x - w / 2 + 6, y - 14, w - 10, 9);
    ctx.fillStyle = "#D9557F"; H.rr(ctx, x - w / 2 - 2, y - 30, w + 2, 12, 5); ctx.fill();
    ctx.restore();
  }
  function stopwatch(ctx, x, y, R, sec, o) {   // stopwatch tanpa angka kecil; bacaan digital di lapisan label
    ctx.save(); ctx.translate(x, y); const sc = o.scale == null ? 1 : o.scale; ctx.scale(sc, sc); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.fillStyle = "rgba(10,14,50,0.24)"; ctx.beginPath(); ctx.ellipse(0, R * 1.2, R * 0.85, R * 0.1, 0, 0, TAU); ctx.fill();
    // mahkota (diam) di atas, tombol kecil kanan atas, dan tombol START besar di kiri atas yang ditekan Bip (memipih saat ditekan)
    ctx.fillStyle = "#23897E"; H.rr(ctx, -R * 0.1, -R * 1.2, R * 0.2, R * 0.24, R * 0.04); ctx.fill();
    ctx.fillStyle = P.teal; H.rr(ctx, -R * 0.27, -R * 1.37, R * 0.54, R * 0.18, R * 0.09); ctx.fill();
    ctx.save(); ctx.rotate(PI / 4); ctx.fillStyle = "#23897E"; H.rr(ctx, -R * 0.08, -R * 1.19, R * 0.16, R * 0.2, R * 0.05); ctx.fill(); ctx.restore();
    const pr = clamp(o.press || 0), pd = pr * R * 0.14, sq = 1 + 0.28 * pr;
    ctx.save(); ctx.rotate(SWB);
    ctx.fillStyle = "#1E7A70"; H.rr(ctx, -R * 0.11, -R * 1.2 + pd, R * 0.22, R * 0.26, R * 0.05); ctx.fill();
    ctx.fillStyle = "#FF8A5B"; H.rr(ctx, -R * 0.21 * sq, -R * 1.36 + pd + R * 0.04 * pr, R * 0.42 * sq, R * 0.18 * (1 - 0.3 * pr), R * 0.08); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)"; H.rr(ctx, -R * 0.15 * sq, -R * 1.33 + pd + R * 0.04 * pr, R * 0.2 * sq, R * 0.05, R * 0.025); ctx.fill();
    if ((o.ripple || 0) > 0 && o.ripple < 1) { ctx.strokeStyle = D.hexA("#FFD38A", 1 - o.ripple); ctx.lineWidth = R * 0.07; ctx.beginPath(); ctx.arc(0, -R * 1.3, R * (0.2 + 0.6 * o.ripple), 0, TAU); ctx.stroke(); }
    ctx.restore();
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
  function sorotIdx(t, T) { let cur = -2, prev = -2, t0 = 0; for (const [ts, i] of T.sorot) { if (t >= ts) { prev = cur; cur = i; t0 = ts; } } return { cur, prev, t0 }; }
  // -2 = belum ada yang disorot (penggeser "mencari"), -1 = netral (b2_3), 0..2 = Ayah/Anak/Ibu
  const vOf = (i, t) => i >= 0 ? VALS[PROF[i].k] : [0, 1, 2].map(j => 0.5 + (i === -2 ? 0.18 : 0.025) * Math.sin(t * 2.1 + j * 2));
  function sliderVals(t, T) {
    const s = sorotIdx(t, T), A = vOf(s.prev, t), Bv = vOf(s.cur, t), u = eio((t - s.t0) / 0.35);
    return { v: A.map((a, i) => lerp(a, Bv[i], u)), col: s.cur >= 0 ? PROF[s.cur].col : P.amber, cur: s.cur, u };
  }
  const NAMA = ["Ayah", "Anak", "Ibu"];
  function panel(c, t, T, cm) {
    const a0 = fd(t, T.ciri - 0.15, 0.35) * (1 - fd(t, T.s4 + 0.1, 0.6)); if (a0 <= 0.01) return;
    const dim = 1 - 0.4 * fd(t, T.s3 - 0.1, 0.4) * (1 - fd(t, T.tebak - 0.05, 0.3));
    const cu = eio((t - T.lalu + 0.1) / 0.32);   // seluruh panel (bingkai + isi) mengecil ke lencana
    const x = PANEL.x, y = PANEL.y, w = PANEL.w, h = PANEL.h, bx = x + w / 2, by = y + 46;
    if (cu < 1) {
      const sp = Math.min(1.04, spring(t - T.ciri + 0.15, 10, 0.55)), kk = lerp(0.6, 1, sp) * lerp(1, 0.2, cu);
      c.save(); c.globalAlpha *= a0 * dim * (1 - cu * cu); cm.apply(c);
      c.translate(lerp(x + w / 2, bx, cu), lerp(y + h / 2, by, cu)); c.scale(kk, kk); c.translate(-(x + w / 2), -(y + h / 2));
      c.globalAlpha *= rd(kk * cm.z, 44);
      const sv = sliderVals(t, T), locked = fd(t, T.tebak - 0.05, 0.3), acc = sv.cur >= 0 ? sv.col : P.amber;
      if (locked > 0) D.glow(c, x + w / 2, y + h / 2, w * 0.75, PINK, 0.35 * locked * (0.7 + 0.3 * Math.sin(t * 4)));
      D.panel(c, x, y, w, h, { fill: "rgba(16,24,70,0.92)", stroke: D.hexA(acc, 0.85), lw: 4, r: 28 });
      const hd = locked > 0.5 ? "pola suara Ibu" : "ciri suara";
      c.save(); if (locked > 0 && locked < 1) c.globalAlpha *= Math.abs(locked - 0.5) * 2;
      D.txt(c, hd, x + 34, y + 70, 50, { weight: 900, color: locked > 0.5 ? "#FFD6E2" : P.ink }); c.restore();
      if (locked < 0.5) { c.save(); c.globalAlpha *= 1 - locked * 2; L.gelombang(c, x + w - 150, y + 30, 116, 52, { t, mode: "batang", n: 9, amp: 0.85, seed: 4, col: acc, col2: "#FFFFFF", speed: 1.6 }); c.restore(); }
      ["tinggi", "serak", "cepat"].forEach((lb, i) => { const yy = y + 134 + i * 86, tx0 = x + 34, tx1 = x + w - 40, v = clamp(sv.v[i]);
        D.txt(c, lb, tx0, yy, 46, { weight: 800, color: P.ink2 });
        c.lineCap = "round"; c.strokeStyle = "rgba(255,255,255,0.16)"; c.lineWidth = 16; c.beginPath(); c.moveTo(tx0, yy + 30); c.lineTo(tx1, yy + 30); c.stroke();
        c.strokeStyle = acc; c.beginPath(); c.moveTo(tx0, yy + 30); c.lineTo(lerp(tx0, tx1, v), yy + 30); c.stroke();
        const kx = lerp(tx0, tx1, v); D.glow(c, kx, yy + 30, 40, acc, 0.5); c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(kx, yy + 30, 17, 0, TAU); c.fill(); c.fillStyle = acc; c.beginPath(); c.arc(kx, yy + 30, 8.5, 0, TAU); c.fill(); });
      // wajah tiga orang (r 56); yang disorot diberi cincin warna suaranya dan nama 44 px
      c.save(); H.rr(c, x + 3, y + 3, w - 6, h - 6, 26); c.clip();
      PROF.forEach((p, i) => { const fx = x + 95 + i * 145, fy = y + 440, on = sv.cur === i ? 1 : 0;
        if (on) { D.glow(c, fx, fy, 110, p.col, 0.7); c.strokeStyle = p.col; c.lineWidth = 8; c.beginPath(); c.arc(fx, fy - 4, 68, 0, TAU); c.stroke(); }
        c.save(); c.globalAlpha *= on ? 1 : 0.5; O.kepala(c, fx, fy + (on ? -6 : 0), 56, Object.assign(O.preset(p.k), { t, seed: 31 + i * 5, face: on ? "senang" : "netral", bahu: 0.9 })); c.restore(); });
      c.restore();
      if (sv.cur >= 0) { const i = sv.cur, fx = x + 95 + i * 145; c.save(); c.globalAlpha *= clamp(sv.u * 1.5); D.label(c, NAMA[i], fx, y + 556, { col: PROF[i].col, size: 44 }); c.restore(); }
      c.restore();
    }
    // lencana "pola suara Ibu" (muncul saat panel selesai mengecil)
    const ba = fd(t, T.lalu + 0.12, 0.2);
    if (ba > 0.01) { const [sx, sy] = cm.S(bx, by), kb = cm.z * lerp(0.75, 1, Math.min(1.05, spring(t - T.lalu - 0.12, 12, 0.5)));
      c.save(); c.globalAlpha *= a0 * ba * rd(kb, 46); c.translate(sx, sy); c.scale(kb, kb);
      const fs = 46, s = "pola suara Ibu"; c.font = `900 ${fs}px ${K.FONT}`; const tw = c.measureText(s).width, w2 = tw + 140, h2 = 86;
      D.glow(c, 0, 0, w2 * 0.6, PINK, 0.35 * (0.7 + 0.3 * Math.sin(t * 4)));
      c.fillStyle = "rgba(16,24,70,0.95)"; H.rr(c, -w2 / 2, -h2 / 2, w2, h2, h2 / 2); c.fill(); c.strokeStyle = PINK; c.lineWidth = 4; c.stroke();
      L.gelombang(c, -w2 / 2 + 24, -22, 74, 44, { t, mode: "batang", n: 6, amp: 0.85, seed: 11, col: PINK, col2: "#FFFFFF", speed: 1.6 });
      D.txt(c, s, -w2 / 2 + 112, fs * 0.36, fs, { weight: 900, color: "#FFD6E2" }); c.restore(); }
    return { a: a0 * (1 - cu) };
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

  // kaca pembesar Bip menyapu "suara asli" (0,5–2,1 s), berayun (2,1–2,7 s), lalu menyapu "suara tiruan" (2,7–4,5 s)
  const STRIP = [{ pr: IBU, x: ASLI.x, y: ASLI.y, w: ASLI.w, h: ASLI.h, dur: 4, sc: 0.6 }, { pr: TIRU, x: TIRUR.x, y: TIRUR.y, w: TIRUR.w, h: TIRUR.h, dur: 3.6, sc: 8.6 }];
  function scanAt(t, T) {
    const u = t - T.s4, A0 = ASLI.x + 60, A1 = ASLI.x + ASLI.w - 60, B0 = TIRUR.x + 60, B1 = TIRUR.x + TIRUR.w - 60, ya = ASLI.y + ASLI.h / 2, yb = TIRUR.y + TIRUR.h / 2;
    if (u < 2.1) return { k: 0, p: [lerp(A0, A1, eio((u - 0.5) / 1.6)), ya], on: 1 };
    if (u < 2.7) { const f = eio((u - 2.1) / 0.6); return { k: f < 0.5 ? 0 : 1, p: [lerp(A1, B0, f), lerp(ya, yb, f) - Math.sin(PI * f) * 70], on: 0 }; }
    return { k: 1, p: [lerp(B0, B1, eio((u - 2.7) / 1.8)), yb], on: 1 };
  }
  function lensContent(c, cx, cy, r, sc) {
    const S = STRIP[sc.k], ts = S.sc + (sc.p[0] - S.x) / S.w * S.dur, dl = 2 * r / S.w * S.dur / 1.8;
    L.spektrogram(c, cx - r, cy - r, 2 * r, 2 * r, { profil: S.pr, dur: dl, scroll: ts - dl / 2, frame: false, r: 0 });
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
    // ---- kerumunan (b2_1–b2_2): kelompok depan di kiri, baris belakang, lalu ratusan siluet sampai cakrawala ----
    const heads = [];
    const rise = t - T.model + 0.35, sink = eio((t - T.dari2 - 0.6) / 1.5);
    if (rise > 0 && sink < 1) {
      farCrowd(ctx, t, (1 - sink) * fd(t, T.banyak - 0.1, 0.3), t - T.banyak + 0.1);
      const grp = (cx, y, w, n, h, seed, tStart, dimA) => { const tt = t - tStart; if (tt <= 0) return;
        const dy = 36 * (1 - eout(tt / 0.9)) + 60 * sink;
        ctx.save(); ctx.translate(0, dy);
        const an = O.crowd(ctx, cx, y, w, n, { h, t, seed, gesture: i => { const g = ["berdiri", "telepon", "pegangHP", "berdiri", "pegangHP", "telepon"][(i + seed) % 6]; return g === "berdiri" ? g : { pose: g, layar: miniScr }; },
          each: (i, o) => Object.assign(o, { alpha: dimA * clamp((tt - i * 0.07) / 0.45) * (1 - sink) }) });
        ctx.restore();
        an.forEach((q, i) => { if (q && clamp((tt - i * 0.07) / 0.45) > 0.3) heads.push([q.head[0] + 4, q.head[1] + dy - 30, COLS[(i + seed) % COLS.length]]); }); };
      grp(330, 806, 520, 8, 104, 17, T.banyak + 0.15, 0.62); grp(480, 846, 700, 9, 132, 13, T.banyak - 0.1, 0.82);
      grp(360, 905, 600, 7, 168, 5, T.model - 0.35, 1);
    }
    // ---- jaringan ----
    const st = netState(t, T), net = drawNet(ctx, t, st);
    // busur "meniru suara" di sisi keluaran
    if (net) arcs(ctx, net.out[0] + 20, net.out[1], t, fd(t, T.tiru - 0.1, 0.4) * (1 - fd(t, T.tiru + 1.6, 0.8)), P.teal);
    // sungai suara: gelombang dari kepala orang (dan dari luar layar kiri) bergabung menjadi pita tebal yang masuk ke sisi masukan
    if (net) {
      const rib = ribbonOf(net), ra = fd(t, T.model + 0.3, 0.8) * (1 - sink) * st.alpha;
      ribbon(ctx, t, rib, ra * (0.75 + 0.25 * fd(t, T.banyak, 0.8)));
      const edge = []; for (let i = 0; i < 6; i++) edge.push([-80, 200 + i * 80, COLS[i % COLS.length]]);
      flowVia(ctx, t, heads, rib, { n: 90, life: 2.0, t0: T.model + 0.15, t1: T.dari2 + 1.2, seed: 3, lift: 50, spread: 180, a: st.alpha });
      flowVia(ctx, t, edge, rib, { n: 36, life: 1.9, t0: T.banyak - 0.1, t1: T.dari2 + 0.9, seed: 9, lift: 10, spread: 120, a: st.alpha, size: 1.05 });
    }
    // ---- huruf dari buku Bip (belajar menulis): kipas, berjarak, selesai sebelum "Model" ----
    tiles(ctx, t, T);
    // ---- buku: ditutup, lalu diletakkan di lantai ----
    const putU = eio((t - T.bkPut) / 0.42), bookPos = bez([BIP.x, BIP.y + BIP.s * 0.3], [BIP.x - 90, BIP.y - 10], [BOOKF.x, BOOKF.y - 18], putU);
    if (t >= T.bkPut && putU < 1) { ctx.save(); ctx.translate(bookPos[0], bookPos[1]); ctx.rotate(-0.5 * PI * putU); book(ctx, 0, 0, BIP.s * 0.62, 0, t, 1); ctx.restore(); }
    if (putU >= 1) bookFlat(ctx, BOOKF.x, BOOKF.y, 72, 1 - fd(t, T.s4 - 0.6, 0.6));
    // ---- keluaran: gelombang merah muda menuju spektrogram tiruan ----
    if (net) flow(ctx, t, [[net.out[0], net.out[1], PINK]], [[TIRUR.x + 10, TIRUR.y + 60], [TIRUR.x + 10, TIRUR.y + 110], [TIRUR.x + 10, TIRUR.y + 150]], { n: 14, life: 0.9, t0: T.ucap - 0.35, t1: T.s4 - 0.3, seed: 33, lift: 10, spread: 60, size: 0.9 });
    // aliran ke panel (b2_2–b2_3)
    const bm = fd(t, T.ciri, 0.4) * (1 - fd(t, T.lalu - 0.1, 0.3)) * (1 - 0.45 * fd(t, T.s3 - 0.1, 0.4) * (1 - fd(t, T.tebak - 0.05, 0.3)));
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
      const o = Object.assign(O.preset("buRina"), { t, seed: 11, look: t > T.s4 && t < T.mirip ? [0.25 + 0.3 * Math.sin((t - T.s4) * 0.9), -0.85] : [0.6, -0.15], face: talk ? "tertawa" : (t > T.s6 ? "bingung" : "senang") });
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
    if (t >= T.st6) { sec = Math.max(0, Math.min(T.end6, t) - T.st6); run = t < T.end6; }
    const swA = fd(t, T.rekaman - 0.62, 0.3);
    // Bip menekan tombol START dengan sentakan pendek (badan maju ±26 px), lengan tetap sepanjang biasa
    const tp0 = T.rekaman - 0.7; let lunge = 0;
    if (t >= tp0 && t < T.sw + 1.0) {
      if (t < T.sw - 0.16) lunge = -18 * eio((t - tp0) / 0.3);
      else if (t < T.sw) lunge = lerp(-18, 8, eio((t - T.sw + 0.16) / 0.16));
      else if (t < T.sw + 0.14) lunge = 8;
      else if (t < T.sw + 0.6) lunge = lerp(8, -12, eio((t - T.sw - 0.14) / 0.3));
      else lunge = lerp(-12, 0, eio((t - T.sw - 0.6) / 0.35));
    }
    const pressW = t > T.sw - 0.1 && t < T.sw + 0.5 ? clamp(lunge / 8) : 0;
    if (swA > 0.01) stopwatch(ctx, SW.x, SW.y, SW.R, sec, { t, run, press: pressW, ripple: clamp((t - T.sw) / 0.45), sector: fd(t, T.tigadet - 0.05, 0.4), alpha: swA, scale: lerp(0.4, 1, Math.min(1.05, spring(t - T.rekaman + 0.62, 11, 0.5))) });

    // ---- Bip ----
    const bo = { t, seed: 2 }; let bipDX = 0;
    if (t < T.bkPut) Object.assign(bo, { pose: "pegang", look: t > T.bkClose ? [0, 0.6] : [-0.15, 0.7], mood: t > T.aisaat - 0.3 ? "wow" : "happy",
      prop: (c, px, py, s) => book(c, px, py, s * 0.62, fd(t, T.tile0 - 0.3, 0.3) * (1 - fd(t, T.bkClose, 0.2)), t, eio((t - T.bkClose) / 0.3)) });
    else if (t < T.bkPut + 0.42) Object.assign(bo, { pose: "tekan", target: [bookPos[0] - 10, bookPos[1] - 12], press: 1, mood: "happy" });
    else if (t < T.ratus - 0.1) Object.assign(bo, { pose: "diam", look: [-0.7, -0.6], mood: "wow" });
    else if (t < T.ratus + 1.3) Object.assign(bo, { pose: "kaget", k: t - T.ratus + 0.1 });
    else if (t < T.banyak - 0.2) Object.assign(bo, { pose: "diam", look: [-0.3, -0.9], mood: "wow" });
    else if (t < T.banyak + 0.9) Object.assign(bo, { pose: "tunjuk", target: [260, 700] });
    else if (t < T.s2 + 1.6) Object.assign(bo, { pose: "tunjuk", target: [1650, 780] });
    else if (t < T.hub - 0.2) Object.assign(bo, { pose: "diam", look: [0, -0.9], mood: "think" });
    else if (t < T.ciri - 0.2) Object.assign(bo, { pose: "tunjuk", target: [CARD.x + CARD.w * 0.7, CARD.y + CARD.h * 0.6] });
    else if (t < T.s3 + 0.4) Object.assign(bo, { pose: "tunjuk", target: [PANEL.x + 20, PANEL.y + 300] });
    else if (t < T.butuh - 0.1) Object.assign(bo, { pose: "diam", wave: t, look: [-0.9, -0.2], mood: "happy" });
    else if (t < T.satu + 0.3) Object.assign(bo, { pose: "tunjuk", target: [CLIP.cx + 60, CLIP.cy] });
    else if (t < T.lalu - 0.1) Object.assign(bo, { pose: "diam", look: t < T.tebak ? [-0.5, -0.8] : [0.8, -0.6], mood: "wow" });
    else if (t < T.buat + 0.75) Object.assign(bo, { pose: "tekan", target: btnTop, press: pressU });
    else if (t < T.s4) Object.assign(bo, { pose: "diam", look: [0.9, -0.5], mood: t > T.apa + 0.3 ? "think" : "wow" });
    else if (t < T.s4 + 4.6) { const sc = scanAt(t, T); Object.assign(bo, { pose: "kacaPembesar", target: sc.p, glass: 0.72, content: (c, cx, cy, r) => lensContent(c, cx, cy, r, sc) }); }
    else if (t < T.mcafee - 0.1) Object.assign(bo, { pose: "diam", look: [-0.6, -0.8], mood: "think" });
    else if (t < T.mcafee + 2.6) Object.assign(bo, { pose: "tunjuk", target: [MCAF.x - 200, MCAF.y + 40] });
    else if (t < tp0) Object.assign(bo, { pose: "diam", look: t < T.buatT ? [-0.3, -0.9] : [0, -0.9], mood: t > T.persen - 0.3 || t < T.buatT ? "wow" : "think" });
    else if (t < T.sw + 0.6) { Object.assign(bo, { pose: "tunjuk", target: SWTIP, mood: "think" }); bipDX = lunge; }
    else if (t < T.s5) { Object.assign(bo, { pose: "diam", look: [0.85, -0.25], mood: t > T.tigadet ? "wow" : "happy" }); bipDX = lunge; }
    else if (t < T.siapa - 0.05) Object.assign(bo, { pose: "diam", look: [-0.9, -0.45], mood: "happy" });
    else Object.assign(bo, { pose: "tunjuk", target: [REC.x, REC.y], mood: "wow" });
    const bipOut = B.draw(ctx, BIP.x + bipDX, BIP.y, BIP.s, bo);
    ctx.restore();

    // =================== lapisan label (sesudah vignette) ===================
    D.post(c => panel(c, t, T, cm));
    D.post(c => card(c, t, T, cm, net && { inp: net.inp }));
    // label "ratusan ribu jam rekaman" dengan jam besar (Ø 72 px) yang berputar cepat
    const ha = fd(t, T.ratus - 0.05, 0.25) * (1 - fd(t, T.hub - 0.6, 0.5));
    if (ha > 0.01) D.post(c => { c.save(); const k = lerp(0.6, 1, Math.min(1.05, spring(t - T.ratus + 0.05, 10, 0.5))); c.globalAlpha *= ha * rd(k, 52); c.translate(960, 112); c.scale(k, k);
      const fs = 52, s = "ratusan ribu jam rekaman"; c.font = `800 ${fs}px ${K.FONT}`; const tw = c.measureText(s).width, w = tw + 176, h = 100;
      c.fillStyle = "rgba(10,18,52,0.9)"; H.rr(c, -w / 2, -h / 2, w, h, h / 2); c.fill(); c.strokeStyle = D.hexA(P.amber, 0.9); c.lineWidth = 3; c.stroke();
      D.glow(c, -w / 2 + 64, 0, 60, P.amber, 0.35); clockIcon(c, -w / 2 + 64, 0, 36, t, 9); D.txt(c, s, -w / 2 + 122, fs * 0.36, fs, { weight: 800 }); c.restore(); });
    // contoh suara singkat dari Bu Rina (330×140, garis pindai merah muda) → melengkung dengan jejak merah muda ke sisi masukan jaringan
    const ca = fd(t, T.contoh - 0.55, 0.3);
    if (ca > 0.01 && net) { const fly = eio((t - T.satu + 0.05) / 1.1); if (fly < 1) D.post(c => {
      c.save(); cm.apply(c); const w0 = CLIP.w, h0 = CLIP.h, p0 = [CLIP.cx, CLIP.cy], p1 = [net.inp[0] + 8, net.inp[1]], ctl = [lerp(p0[0], p1[0], 0.45), Math.min(p0[1], p1[1]) - 190];
      const pos = bez(p0, ctl, p1, fly);
      if (fly > 0.01) { c.lineCap = "round"; const seg = 18, u0 = Math.max(0, fly - 0.55);
        for (let i = 0; i < seg; i++) { const ua = lerp(u0, fly, i / seg), ub = lerp(u0, fly, (i + 1) / seg), pa = bez(p0, ctl, p1, ua), pb = bez(p0, ctl, p1, ub), al = (i + 1) / seg;
          c.strokeStyle = D.hexA(PINK, 0.3 * al); c.lineWidth = 34 * al; c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.stroke();
          c.strokeStyle = D.hexA("#FFD6E2", 0.9 * al); c.lineWidth = 9 * al; c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.stroke(); } }
      if (fly > 0.85) D.glow(c, p1[0], p1[1], 150, PINK, 0.8 * Math.sin(PI * clamp((fly - 0.85) / 0.15)));
      const sp = Math.min(1.05, spring(t - T.contoh + 0.55, 10, 0.55)), k = lerp(0.5, 1, sp) * lerp(1, 0.08, fly);
      c.globalAlpha *= ca * (1 - clamp((fly - 0.85) / 0.15)); c.translate(pos[0], pos[1]); c.scale(k, k);
      D.glow(c, 0, 0, 260, PINK, 0.45);
      const rv = clamp((t - T.contoh + 0.55) / 1.0);
      L.spektrogram(c, -w0 / 2, -h0 / 2, w0, h0, { profil: IBU, dur: 1.4, scroll: 0.4, reveal: rv, aksen: PINK, r: 18 });
      if (rv < 1) { const px = -w0 / 2 + w0 * rv; D.glow(c, px, 0, 70, PINK, 0.8); c.fillStyle = PINK; c.fillRect(px - 4, -h0 / 2, 8, h0); c.fillStyle = "#FFFFFF"; c.fillRect(px - 1.5, -h0 / 2, 3, h0); }
      c.restore(); }); }
    const cla = fd(t, T.contoh - 0.05, 0.25) * (1 - fd(t, T.satu + 0.05, 0.2));
    if (cla > 0.01) D.post(c => { const [x, y] = cm.S(CLIP.cx, CLIP.cy - CLIP.h / 2 - 46); pillAt(c, "contoh singkat", x, y, cla, cm.z * lerp(0.6, 1, Math.min(1.05, spring(t - T.contoh + 0.05, 11, 0.5))), { col: PINK, size: 46 }); });
    // kalimat yang diketik (b2_3) dengan benang ke jaringan
    const ka = fd(t, T.lalu - 0.15, 0.3) * (1 - fd(t, T.akurat - 0.2, 0.4));
    if (ka > 0.01) D.post(c => {
      const s1 = "Selamat pagi, semua!", s2 = "Nak, tolong kirim uang.", second = t >= T.apa - 0.1, s = second ? s2 : s1, t0 = second ? T.apa - 0.1 : T.lalu + 0.1, n = Math.floor(s.length * clamp((t - t0) / (second ? 0.75 : 1.4)));
      c.save(); c.globalAlpha *= ka; cm.apply(c); const fs = 54; c.font = `800 ${fs}px ${K.FONT}`; const w = Math.max(c.measureText(s1).width, c.measureText(s2).width) + 140, h = 96, x = 960 - w / 2, y = 78;
      const k = lerp(0.6, 1, Math.min(1.05, spring(t - T.lalu + 0.15, 10, 0.55))); c.globalAlpha *= rd(k, 54); c.translate(960, y + h / 2); c.scale(k, k); c.translate(-960, -(y + h / 2));
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
    // garis tunjuk dari ujung jari Bip ke pil REC (digambar sebelum gelembung, jadi lewat di belakangnya dan tidak memotong kata)
    const pr2 = fd(t, T.siapa + 0.1, 0.25);
    if (pr2 > 0.01 && bipOut && bipOut.tip) D.post(c => { c.save(); cm.apply(c); c.globalAlpha *= pr2; const a0 = bipOut.tip, a1 = [REC.x + 40, REC.y + 44], u = clamp((t - T.siapa - 0.1) / 0.3);
      const e = [lerp(a0[0], a1[0], u), lerp(a0[1], a1[1], u)]; c.lineCap = "round"; c.strokeStyle = D.hexA("#FF3B4A", 0.3); c.lineWidth = 12; c.beginPath(); c.moveTo(a0[0], a0[1]); c.lineTo(e[0], e[1]); c.stroke();
      c.strokeStyle = "#FF6B76"; c.lineWidth = 4; c.setLineDash([10, 12]); c.lineDashOffset = -t * 60; c.beginPath(); c.moveTo(a0[0], a0[1]); c.lineTo(e[0], e[1]); c.stroke(); c.setLineDash([]);
      D.glow(c, e[0], e[1], 28, "#FF3B4A", 0.9); c.restore(); });
    // spektrogram asli (b2_4) → gelembung kalimat setinggi 270 px dengan pita pola suara 124 px (b2_5, b2_5a)
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
      const band = { x: lerp(R.x, R.x + 26, m), y: lerp(R.y, R.y + R.h - 150, m), w: lerp(R.w, R.w - 52, m), h: lerp(R.h, 124, m) };
      const live = t >= T.st6, rvB = live ? clamp((t - T.st6) / (T.end6 - T.st6)) : 1, empty = m > 0.5 && t > T.misal + 0.2 && !live;
      L.spektrogram(c, band.x, band.y, band.w, band.h, { profil: IBU, dur: live ? 2.4 : 4, scroll: live ? 6.2 : 0.6, reveal: m > 0.5 && t > T.misal + 0.2 ? (live ? rvB : 0) : 1, grid: m > 0.5,
        aksen: m < 0.5 ? PINK : undefined, label: m < 0.3 ? "suara asli" : undefined, labelSize: 44, r: lerp(18, 14, m), alpha: 1 });
      if (m > 0.5 && (empty || (live && rvB < 1))) {   // kursor siap / garis rekam merah muda
        const px = band.x + 8 + (band.w - 16) * (live ? rvB : 0), bl = live ? 1 : (Math.floor(t * 2.6) % 2 === 0 ? 1 : 0.35);
        c.save(); c.globalAlpha *= bl; D.glow(c, px, band.y + band.h / 2, 60, PINK, 0.6); c.fillStyle = PINK; c.fillRect(px - 3.5, band.y + 8, 7, band.h - 16); c.restore(); }
      // jendela 3 detik pada "suara asli" selama stopwatch berjalan
      const run3 = clamp((t - T.sw) / 3), wa = (t > T.sw ? 1 : 0) * (1 - fd(t, T.kalimat - 0.6, 0.4));
      if (wa > 0.01) { c.save(); c.globalAlpha *= wa; const ww = ASLI.w * 0.75 * run3; c.fillStyle = "rgba(255,255,255,0.14)"; c.fillRect(ASLI.x, ASLI.y, ww, ASLI.h);
        c.strokeStyle = "#FFFFFF"; c.lineWidth = 5; c.strokeRect(ASLI.x + 2, ASLI.y + 2, Math.max(0, ww - 4), ASLI.h - 4); c.restore(); }
      // kata-kata ("…" lalu "Halo, iya, siapa ini?")
      if (m > 0.6) { const wy = R.y + 80, fs = 58, cx = R.x + R.w / 2;
        if (t < T.halo - 0.05) { for (let i = 0; i < 3; i++) { const bb = 0.5 + 0.5 * Math.sin(t * 7 - i * 0.9); c.fillStyle = D.hexA("#7A84C2", 0.5 + 0.5 * bb); c.beginPath(); c.arc(cx - 40 + i * 40, wy - 18 - bb * 6, 13, 0, TAU); c.fill(); } }
        else { const parts = [["Halo, ", T.halo], ["iya, ", T.iya], ["siapa ini?", T.siapa]]; c.font = `900 ${fs}px ${K.FONT}`; const full = parts.map(p => p[0]).join(""), tw = c.measureText(full).width; let x = cx - tw / 2;
          parts.forEach(([s, ts]) => { const u = fd(t, ts - 0.05, 0.18), w = c.measureText(s).width; if (u > 0) { c.save(); c.globalAlpha *= u; c.translate(x + w / 2, wy); const kk = lerp(0.7, 1, Math.min(1.05, spring(t - ts + 0.05, 14, 0.5))); c.scale(kk, kk);
            D.txt(c, s.trim(), -w / 2, 0, fs, { weight: 900, color: "#1E2A6B" }); c.restore(); } x += w; }); } }
      c.restore(); });
    // kotak pindai pada pita yang sedang diperiksa kaca pembesar + garis pandang dari lensa
    const sca = fd(t, T.s4 + 0.3, 0.25) * (1 - fd(t, T.s4 + 4.4, 0.25));
    if (sca > 0.01 && bipOut && bipOut.tip) { const sc = scanAt(t, T), S = STRIP[sc.k], lens = bipOut.tip; D.post(c => { c.save(); cm.apply(c); c.globalAlpha *= sca;
      const bw = 76, on = sc.on;
      c.strokeStyle = "rgba(255,255,255,0.6)"; c.lineWidth = 3; c.setLineDash([8, 9]); c.lineDashOffset = -t * 30; c.beginPath(); c.moveTo(lens[0], lens[1]); c.lineTo(sc.p[0], on ? S.y + S.h + 4 : sc.p[1]); c.stroke(); c.setLineDash([]);
      if (on) { c.save(); c.globalAlpha *= 0.9; D.glow(c, sc.p[0], S.y + S.h / 2, 110, "#FFFFFF", 0.25); c.fillStyle = "rgba(255,255,255,0.16)"; c.fillRect(sc.p[0] - bw / 2, S.y, bw, S.h);
        c.strokeStyle = "#FFFFFF"; c.lineWidth = 5; H.rr(c, sc.p[0] - bw / 2, S.y - 4, bw, S.h + 8, 10); c.stroke(); c.restore(); }
      c.restore(); }); }
    // garis pencocok merah muda antara pita-pita yang mirip (mulai "membuat tiruan"), lalu menyatu ke meteran
    const mla = fd(t, T.buatT - 0.05, 0.25) * (1 - fd(t, T.mirip + 0.45, 0.4));
    if (mla > 0.01) D.post(c => { c.save(); cm.apply(c); c.globalAlpha *= mla; const conv = eio((t - T.mirip + 0.25) / 0.6); c.lineCap = "round";
      [0.3, 0.47, 0.64, 0.82].forEach((f, i) => { const g = eio((t - T.buatT - i * 0.12) / 0.55); if (g <= 0) return;
        const p0 = [ASLI.x + ASLI.w + 4, ASLI.y + f * ASLI.h], p1 = [TIRUR.x - 4, TIRUR.y + f * TIRUR.h], cp = [960, lerp(300 + f * 200, 345, conv)];
        const N = 24, half = g * 0.5, seg = (u0, u1) => { c.beginPath(); for (let j = 0; j <= N; j++) { const p = bez(p0, cp, p1, lerp(u0, u1, j / N)); j ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke(); };
        [[0, half], [1 - half, 1]].forEach(([u0, u1]) => { c.strokeStyle = D.hexA(PINK, 0.3); c.lineWidth = 12; seg(u0, u1); c.strokeStyle = "#FFC2D4"; c.lineWidth = 3.5; seg(u0, u1); });
        c.fillStyle = PINK; [[ASLI.x + ASLI.w - 46, p0[1]], [TIRUR.x + 6, p1[1]]].forEach(([qx, qy]) => { H.rr(c, qx, qy - 4, 40, 8, 4); c.fill(); });
        if (g >= 1) { const u = (t * 0.8 + i * 0.27) % 1, p = bez(p0, cp, p1, u); D.glow(c, p[0], p[1], 20, "#FFD6E2", 0.9); } });
      c.restore(); });
    // meteran kemiripan (jaringan menyusut menjadi meteran)
    const ma = fd(t, T.mirip - 0.05, 0.3) * (1 - fd(t, T.s5 + 0.3, 0.6));
    if (ma > 0.01) D.post(c => { c.save(); c.globalAlpha *= ma; cm.apply(c); const dx = 340 * eio((t - T.s5 - 0.3) / 0.8); c.translate(dx, 0);
      const v = 85 * eout((t - T.lapan + 0.1) / (T.persen - T.lapan + 0.05)), done = fd(t, T.persen, 0.3);
      c.strokeStyle = D.hexA("#FFFFFF", 0.7); c.lineWidth = 4; c.setLineDash([10, 10]); c.lineDashOffset = -t * 40;
      c.beginPath(); c.moveTo(ASLI.x + ASLI.w + 10, ASLI.y + ASLI.h / 2); c.quadraticCurveTo(700, 290, 770, 320); c.moveTo(TIRUR.x - 10 - dx, TIRUR.y + TIRUR.h / 2); c.quadraticCurveTo(1220, 290, 1150, 320); c.stroke(); c.setLineDash([]);
      if (done > 0) D.glow(c, 960, 360, 330, P.pink, 0.35 * done * (0.7 + 0.3 * Math.sin(t * 4)));
      const k = lerp(0.3, 1, Math.min(1.04, spring(t - T.mirip + 0.05, 10, 0.55))); c.globalAlpha *= (40 * k * cm.z >= 39.6 || t > T.mirip + 0.5) ? 1 : 0.34; c.translate(960, 345); c.scale(k, k); c.translate(-960, -345);
      B.meteran(c, 960, 345, 400, { value: Math.round(v), t, label: "kemiripan" }); c.restore(); });
    // sumber: satu temuan McAfee 2023 (kiri atas, ditunjuk Bip)
    const sa = fd(t, T.mcafee - 0.05, 0.25) * (1 - fd(t, T.s5 + 0.2, 0.5));
    if (sa > 0.01) D.post(c => { const s = t >= T.tahun - 0.05 ? "Satu temuan McAfee, 2023" : "Satu temuan McAfee", [x, y] = cm.S(MCAF.x, MCAF.y);
      pillAt(c, s, x, y, sa, cm.z * lerp(0.6, 1, Math.min(1.05, spring(t - T.mcafee + 0.05, 11, 0.5))), { col: P.amber, size: 48 }); });
    // garis tunjuk putus-putus dari ujung jari Bip ke label sumber (menegaskan arah tunjuk)
    const pa = fd(t, T.mcafee + 0.05, 0.25) * (1 - fd(t, T.mcafee + 2.45, 0.2));
    if (pa > 0.01 && bipOut && bipOut.tip) D.post(c => { c.save(); cm.apply(c); c.globalAlpha *= pa; const a0 = bipOut.tip, a1 = [MCAF.x - 120, MCAF.y + 44], u = clamp((t - T.mcafee - 0.05) / 0.35);
      const e = [lerp(a0[0], a1[0], u), lerp(a0[1], a1[1], u)]; c.lineCap = "round"; c.strokeStyle = D.hexA(P.amber, 0.35); c.lineWidth = 12; c.beginPath(); c.moveTo(a0[0], a0[1]); c.lineTo(e[0], e[1]); c.stroke();
      c.strokeStyle = P.amber; c.lineWidth = 4; c.setLineDash([10, 12]); c.lineDashOffset = -t * 60; c.beginPath(); c.moveTo(a0[0], a0[1]); c.lineTo(e[0], e[1]); c.stroke(); c.setLineDash([]);
      D.glow(c, e[0], e[1], 30, P.amber, 0.9); c.restore(); });
    // bacaan stopwatch (di kanan stopwatch)
    if (swA > 0.01) D.post(c => { const [x, y] = cm.S(SW.x + SW.R + 165, SW.y); const hot = fd(t, T.tigadet - 0.1, 0.3) * (1 - fd(t, T.misal, 0.4)) + fd(t, T.tiga5 - 0.1, 0.2) * (1 - fd(t, T.tiga5 + 0.9, 0.4)) + fd(t, T.end6, 0.2);
      readout(c, `${fmt1(sec)} detik`, x, y, cm.z * lerp(0.5, 1, Math.min(1.05, spring(t - T.rekaman + 0.62, 11, 0.5))), swA, clamp(hot)); });
    // pil "● REC" (kait ke bab 3): muncul saat "siapa", berdenyut, ditunjuk Bip
    const rca = fd(t, T.siapa - 0.05, 0.2);
    if (rca > 0.01) D.post(c => { const [x, y] = cm.S(REC.x, REC.y), k = cm.z * lerp(0.6, 1, Math.min(1.06, spring(t - T.siapa + 0.05, 12, 0.5))), pul = 0.5 + 0.5 * Math.sin(t * 8);
      c.save(); c.globalAlpha *= rca * rd(k, 48); c.translate(x, y); c.scale(k, k);
      const fs = 48; c.font = `900 ${fs}px ${K.FONT}`; const w = c.measureText("REC").width + 118, h = 80;
      D.glow(c, 0, 0, w * 0.85, "#FF3B4A", 0.3 + 0.3 * pul);
      c.fillStyle = "rgba(16,20,64,0.3)"; H.rr(c, -w / 2 + 4, -h / 2 + 6, w, h, h / 2); c.fill(); c.fillStyle = "#FFF6E6"; H.rr(c, -w / 2, -h / 2, w, h, h / 2); c.fill(); c.strokeStyle = "#FF3B4A"; c.lineWidth = 5; c.stroke();
      const dx = -w / 2 + 44; c.strokeStyle = D.hexA("#FF3B4A", 0.7 * (1 - pul)); c.lineWidth = 4; c.beginPath(); c.arc(dx, 0, 17 + 12 * (1 - pul), 0, TAU); c.stroke();
      c.fillStyle = "#FF3B4A"; c.beginPath(); c.arc(dx, 0, 17, 0, TAU); c.fill();
      D.txt(c, "REC", dx + 34, fs * 0.36, fs, { weight: 900, color: "#C81E2E" }); c.restore(); });
  }

  K.SCENES.d03_b2 = function (ctx, b, l, t, TL) { return scene(ctx, b, l, t, TL); };
  K.SCENES.d03_b2.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b2 = TL => [
    K.sfxAt(TL, "b2_1", "meniru suara", 0.0, "shimmer", 0.45),
    K.sfxAt(TL, "b2_1", "AI saat", -0.95, "whoosh", 0.5),
    K.sfxAt(TL, "b2_1", "Model AI", -0.3, "riser", 0.5),
    K.sfxAt(TL, "b2_1", "ratusan ribu jam", 0.0, "pop", 0.7),
    K.sfxAt(TL, "b2_1", "banyak sekali orang", -0.1, "shimmer", 0.55),
    K.sfxAt(TL, "b2_2", "model AI belajar", 0.0, "shimmer", 0.45),
    K.sfxAt(TL, "b2_2", "tulisan", -0.1, "pop", 0.55),
    K.sfxAt(TL, "b2_2", "bunyi", 0.0, "pop", 0.5),
    K.sfxAt(TL, "b2_2", "ciri-ciri", -0.75, "whoosh", 0.55),
    K.sfxAt(TL, "b2_2", "berbeda", 0.0, "clack", 0.4),
    K.sfxAt(TL, "b2_3", "contoh singkat", -0.5, "pop", 0.6),
    K.sfxAt(TL, "b2_3", "satu orang", -0.5, "whoosh", 0.6),
    K.sfxAt(TL, "b2_3", "menebak pola", -0.1, "shimmer", 0.7),
    K.sfxAt(TL, "b2_3", "Lalu, model", 0.12, "pop", 0.45),
    K.sfxAt(TL, "b2_3", "membuat suara", 0.0, "clack", 0.7),
    K.sfxAt(TL, "b2_3", "mengucapkan", -0.75, "whoosh", 0.5),
    K.sfxAt(TL, "b2_4", "Seberapa akurat", -0.9, "whoosh", 0.45),
    K.sfxAt(TL, "b2_4", "McAfee", 0.0, "pop", 0.55),
    K.sfxAt(TL, "b2_4", "membuat tiruan", 0.0, "shimmer", 0.45),
    K.sfxAt(TL, "b2_4", "persen", 0.0, "riser", 0.7),
    K.sfxAt(TL, "b2_4", "persen", 0.05, "boom", 0.55),
    K.sfxAt(TL, "b2_4", "dari rekaman", 0.42, "clack", 0.65),
    K.sfxAt(TL, "b2_4", "tiga detik", 0.3, "pop", 0.7),
    K.sfxAt(TL, "b2_5", "satu kalimat pendek", -1.15, "whoosh", 0.5),
    K.sfxAt(TL, "b2_5a", "siapa ini?", -0.05, "pop", 0.6),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
