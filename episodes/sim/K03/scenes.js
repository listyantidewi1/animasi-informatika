/* K03 Simulasi konsep: mesin pencari mini untuk sepuluh halaman rekaan (.example).
   Merayapi (laba-laba mengikuti link, antrean), mengindeks (tabel kata -> halaman), memeringkat (isi +1, judul +2, link masuk +1).
   Memakai pembantu gambar D7.4 (Kiko.pencari: laba-laba, kotak pencarian). Nilai dihitung dengan python3 (lihat laporan). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Q = K.pencari;
  const { rr, text, para, wrap, card, kiko, bubble, ease, clamp, lerp } = H;
  const DEEP = "#1F5A6E", BLUE_BG = "#E7F1FB", BLUE_LN = "#9CC2E6";

  // ---------- web mini: 10 halaman rekaan ----------
  const P = {
    1: { t: "Beranda Sekolah", u: "sekolah.example", isi: "Selamat datang di sekolah kami. Lihat menu kantin, jadwal futsal, dan buku baru di perpustakaan.", out: [2, 6, 9, 7] },
    2: { t: "Menu Kantin", u: "sekolah.example/kantin", isi: "Menu kantin sekolah hari ini: bakso dan es teh, harganya murah.", out: [3, 4] },
    3: { t: "Resep Bakso Kuah", u: "resepdapur.example", isi: "Resep bakso kuah yang gurih untuk makan bersama keluarga.", out: [10] },
    4: { t: "Warung Bu Rina", u: "warungrina.example", isi: "Bakso urat dan mi ayam, enak dan murah.", out: [] },
    5: { t: "Merawat Kucing", u: "kucingsehat.example", isi: "Cara merawat kucing di rumah dan kapan dibawa ke dokter.", out: [8] },
    6: { t: "Perpustakaan Sekolah", u: "sekolah.example/perpus", isi: "Pinjam buku di perpustakaan sekolah, termasuk buku tentang kucing.", out: [5] },
    7: { t: "Berita Kota", u: "beritakota.example", isi: "Hujan deras pagi ini, angkot di jalan raya berjalan pelan.", out: [4, 8, 10] },
    8: { t: "Klinik Hewan Kucing", u: "klinikhewan.example", isi: "Dokter hewan siap memeriksa kucing dan anjing setiap hari.", out: [5] },
    9: { t: "Jadwal Futsal Sekolah", u: "sekolah.example/futsal", isi: "Latihan futsal sekolah setiap Jumat sore di lapangan.", out: [10] },
    10: { t: "Cerita Sekolah Dito", u: "blogdito.example", isi: "Pulang sekolah aku main futsal, lalu mencoba resep bakso di rumah dan memberi makan kucing.", out: [3, 5, 9] }
  };
  const WORDS = ["angkot", "bakso", "buku", "dokter", "futsal", "hujan", "kantin", "kucing", "murah", "resep", "sekolah"];
  const tokens = s => s.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  const IDX = {}; WORDS.forEach(w => IDX[w] = []);
  for (let i = 1; i <= 10; i++) { const ws = new Set(tokens(P[i].isi)); WORDS.forEach(w => { if (ws.has(w)) IDX[w].push(i); }); }
  const ORDER = [1, 2, 6, 9, 7, 3, 4, 5, 10, 8], PARENT = { 2: 1, 6: 1, 9: 1, 7: 1, 3: 2, 4: 2, 5: 6, 10: 9, 8: 7 };
  const NEW = [[3, 4], [9, 4], [10, 4]];   // link baru ke Warung Bu Rina (variasi 4)
  // hasil peringkat (sama dengan hitungan python3): [halaman, isi, judul, link]
  const RANK = {
    v1: { q: "kucing", rows: [[5, 1, 2, 3], [8, 1, 2, 2], [10, 1, 0, 3], [6, 1, 0, 1]] },
    v2: { q: "resep bakso", rows: [[3, 2, 4, 2], [10, 2, 0, 3]] },
    v3: { q: "sekolah", rows: [[10, 1, 2, 3], [9, 1, 2, 2], [6, 1, 2, 1], [1, 1, 2, 0], [2, 1, 0, 1]] },
    v3b: { q: "sekolah buku", rows: [[6, 2, 2, 1], [1, 2, 2, 0]] },
    v4: { q: "bakso", rows: [[3, 1, 2, 2], [10, 1, 0, 3], [4, 1, 0, 2], [2, 1, 0, 1]] },
    v4b: { q: "bakso", rows: [[4, 1, 0, 5], [3, 1, 2, 2], [10, 1, 0, 3], [2, 1, 0, 1]], from: "v4" }
  };

  // ---------- peta web ----------
  const CW = 290, CH = 96;
  const POS = { 1: [130, 392], 2: [560, 165], 6: [560, 335], 9: [560, 505], 7: [560, 675], 4: [1010, 140], 3: [1010, 280], 10: [1010, 420], 5: [1010, 560], 8: [1010, 700] };
  const mid = (i, side) => { const [x, y] = POS[i]; return side === "r" ? [x + CW, y + CH / 2] : side === "l" ? [x, y + CH / 2] : side === "t" ? [x + CW / 2, y] : [x + CW / 2, y + CH]; };
  function edgePts(a, b) {
    const [xa] = POS[a], [xb] = POS[b];
    if (xa === xb) {   // satu kolom
      const ya = POS[a][1], yb = POS[b][1], adj = Math.abs(ya - yb) < 150, dx = a < b ? -40 : 40;
      if (adj) { const down = yb > ya; const p1 = mid(a, down ? "b" : "t"), p2 = mid(b, down ? "t" : "b"); return { p1: [p1[0] + dx, p1[1]], p2: [p2[0] + dx, p2[1]] }; }
      const p1 = mid(a, "r"), p2 = mid(b, "r"); return { p1, p2, c: [p1[0] + 110, (p1[1] + p2[1]) / 2] };
    }
    return xa < xb ? { p1: mid(a, "r"), p2: mid(b, "l") } : { p1: mid(a, "l"), p2: mid(b, "r") };
  }
  function arrow(ctx, e, opt = {}) {
    const col = opt.color || "#B7C4CC", lw = opt.lw || 3, u = opt.u === undefined ? 1 : opt.u; if (u <= 0) return;
    const [x1, y1] = e.p1, [x2, y2] = e.p2;
    const pt = t => e.c ? [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * e.c[0] + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * e.c[1] + t * t * y2] : [lerp(x1, x2, t), lerp(y1, y2, t)];
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1);
    for (let i = 1; i <= 24; i++) { const [x, y] = pt(i / 24 * u); ctx.lineTo(x, y); } ctx.stroke();
    if (u >= 1) { const [ax, ay] = pt(0.94), ang = Math.atan2(y2 - ay, x2 - ax), s = 8 + lw * 2;
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - s * Math.cos(ang - 0.45), y2 - s * Math.sin(ang - 0.45)); ctx.lineTo(x2 - s * Math.cos(ang + 0.45), y2 - s * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill(); }
    return pt;
  }
  function pageCard(ctx, i, st = {}) {
    const [x, y] = POS[i], w = st.w || CW;
    const fill = st.visited ? "#F2FAF4" : st.queued ? "#FFF9E0" : st.dim ? "#F4F6F5" : "#FFFFFF";
    card(ctx, x, y, w, CH, { fill, stroke: st.hl ? C.accent : st.visited ? C.good : st.queued ? "#E0B04B" : "#C9D4DB", lw: st.hl ? 6 : st.visited || st.queued ? 4 : 2.5, r: 14 });
    ctx.fillStyle = st.dim ? "#B7C4CC" : st.visited ? C.good : C.kiko; ctx.beginPath(); ctx.arc(x + 32, y + CH / 2, 21, 0, Math.PI * 2); ctx.fill();
    text(ctx, String(i), x + 32, y + CH / 2 + 8, 22, { align: "center", weight: 900, color: "#FFFFFF" });
    text(ctx, P[i].t, x + 62, y + 42, 22, { weight: 900, color: st.dim ? C.muted : C.ink, fit: w - 74 });
    text(ctx, P[i].u, x + 62, y + 72, 18, { weight: 700, color: st.dim ? C.muted : C.ink2, fit: w - 74 });
    if (st.badge) { card(ctx, x + w - 92, y - 18, 100, 36, { fill: st.badgeCol || C.accent, r: 18 }); text(ctx, st.badge, x + w - 42, y + 7, 20, { align: "center", weight: 900, color: "#FFFFFF" }); }
  }
  function map(ctx, st = {}) {
    const extra = st.extra || [];
    for (let a = 1; a <= 10; a++) P[a].out.forEach(b => { const on = st.edgeOn && st.edgeOn(a, b); arrow(ctx, edgePts(a, b), { color: on ? C.accent : "#C2CDD4", lw: on ? 5 : 3 }); });
    extra.forEach(([a, b, u]) => arrow(ctx, edgePts(a, b), { color: C.bad, lw: 6, u }));
    for (let i = 1; i <= 10; i++) pageCard(ctx, i, st.page ? st.page(i) : {});
  }
  // panel kanan (x 1380–1790)
  function side(ctx, title, y, h) { card(ctx, 1380, y, 410, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 }); text(ctx, title, 1585, y + 46, 24, { align: "center", weight: 900, color: C.accentDark, fit: 370 }); }
  // kotak pencarian dengan ikon kaca pembesar yang digambar
  function search(ctx, x, y, w, q, opt = {}) {
    card(ctx, x, y, w, opt.h || 80, { fill: "#FFFFFF", stroke: opt.stroke || "#B7C4CC", lw: 4, r: (opt.h || 80) / 2 });
    const cy = y + (opt.h || 80) / 2; ctx.strokeStyle = C.ink2; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + 42, cy - 4, 13, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 51, cy + 5); ctx.lineTo(x + 62, cy + 16); ctx.stroke();
    text(ctx, q, x + 84, cy + 14, opt.size || 36, { weight: 800 });
  }
  const at = (b, f) => (b.audio || b.dur) * f;
  function header(ctx, s, x, y, opt = {}) { text(ctx, s, x, y, opt.size || 26, { weight: 900, color: opt.color || C.accentDark, align: opt.align || "left" }); }
  function ring(ctx, x, y, frac) {
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 40, -Math.PI / 2, -Math.PI / 2 + clamp(frac, 0, 1) * Math.PI * 2); ctx.stroke();
  }
  // halaman besar yang sedang dibaca, kata indeks disorot
  function bigPage(ctx, i, x, y, w, h, hlU = 1) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 3, r: 18 });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 44, 18); ctx.fill(); ctx.fillRect(x, y + 24, w, 20);
    text(ctx, P[i].u, x + 24, y + 31, 20, { weight: 700, color: C.ink2 });
    ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 44, y + 92, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i), x + 44, y + 101, 24, { align: "center", weight: 900, color: "#FFFFFF" });
    text(ctx, P[i].t, x + 82, y + 102, 34, { weight: 900, fit: w - 110 });
    const size = 30, lh = 46; ctx.font = `700 ${size}px Inter`;
    const lines = wrap(ctx, P[i].isi, size, 700, w - 48); let yy = y + 170;
    lines.forEach(ln => {
      let xx = x + 24;
      ln.split(" ").forEach(wd => { ctx.font = `700 ${size}px Inter`; const ww = ctx.measureText(wd).width, sw = ctx.measureText(" ").width;
        const key = wd.toLowerCase().replace(/[^a-z]/g, "");
        if (WORDS.includes(key) && hlU > 0) { ctx.fillStyle = `rgba(242,177,52,${0.45 * hlU})`; rr(ctx, xx - 4, yy - size + 2, ctx.measureText(wd.replace(/[^A-Za-z]/g, "")).width + 8, size + 10, 6); ctx.fill(); }
        text(ctx, wd, xx, yy, size, { weight: 700, color: C.ink }); xx += ww + sw; });
      yy += lh;
    });
  }
  function indexTable(ctx, x, y, w, upto, opt = {}) {
    // upto: berapa halaman (menurut urutan rayap) yang sudah dicatat; opt.hl: kata yang disorot; opt.pages: angka disorot
    const seen = new Set(ORDER.slice(0, upto)); const rh = opt.rh || 58;
    card(ctx, x, y, w, 70 + WORDS.length * rh, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 18 });
    text(ctx, "TABEL INDEKS", x + 24, y + 44, 24, { weight: 900, color: C.accentDark }); text(ctx, "kata  →  halaman", x + w - 24, y + 44, 22, { align: "right", weight: 800, color: C.ink2 });
    WORDS.forEach((wd, r) => {
      const yy = y + 62 + r * rh, hl = (opt.hl || []).includes(wd);
      if (hl) { ctx.fillStyle = "#FFE7A8"; rr(ctx, x + 10, yy, w - 20, rh - 6, 10); ctx.fill(); }
      card(ctx, x + 20, yy + 6, 150, rh - 18, { fill: "#FFFFFF", r: 10 }); text(ctx, wd, x + 95, yy + rh / 2 + 7, 22, { align: "center", weight: 900, color: C.accentDark });
      let bx = x + 190;
      IDX[wd].filter(p => seen.has(p)).forEach(p => {
        const on = (opt.pages || []).includes(p) && hl, fresh = opt.fresh === p;
        ctx.fillStyle = on ? C.good : fresh ? C.accent : "#FFFFFF"; rr(ctx, bx, yy + 6, 48, rh - 18, 10); ctx.fill(); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 2; rr(ctx, bx, yy + 6, 48, rh - 18, 10); ctx.stroke();
        text(ctx, String(p), bx + 24, yy + rh / 2 + 7, 22, { align: "center", weight: 900, color: on || fresh ? "#FFFFFF" : C.ink }); bx += 58;
      });
    });
  }
  const QV = { v1: "kucing", v2: "resep bakso", v3: "sekolah", v4: "bakso" };
  const QLAB = { v1: "satu kata", v2: "dua kata", v3: "kata yang ada di banyak halaman", v4: "tiga link baru ke Warung Bu Rina" };
  const VNO = { v1: 1, v2: 2, v3: 3, v4: 4 };

  Object.assign(K.SCENES, {
    k3_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      header(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, { size: 30 });
      ["menjelaskan cara laba-laba merayapi", "membaca tabel indeks", "menghitung nilai peringkat", "memilih kata kunci yang jitu"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800, fit: 670 }); ctx.globalAlpha = 1;
      });
      search(ctx, 1110, 300, 560, "kucing");
      [0, 1, 2].forEach(i => { card(ctx, 1110, 410 + i * 100, 560, 84, { fill: i === 0 ? C.goodBg : "#FFFFFF", stroke: "#D7E2DC", lw: 2, r: 14 }); text(ctx, (i + 1) + ".", 1135, 462 + i * 100, 28, { weight: 900, color: C.ink2 }); ctx.fillStyle = "#D7E2DC"; rr(ctx, 1180, 440 + i * 100, 300 - i * 50, 14, 6); ctx.fill(); rr(ctx, 1180, 466 + i * 100, 400 - i * 60, 10, 5); ctx.fill(); });
      Q.spider(ctx, 1600, 250, 50);
    },
    k3_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      header(ctx, "EPISODE YANG DILENGKAPI", 960, 240, { align: "center", size: 32 });
      card(ctx, 330, 290, 600, 300, { fill: C.bg2, r: 22 });
      text(ctx, "D7.4", 630, 370, 56, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Mesin Pencari: Cara Kerja dan Strategi", 630, 430, 34, 520, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "merayapi · mengindeks · memeringkat", 630, 560, 26, { align: "center", weight: 600, color: C.ink2 });
      card(ctx, 990, 290, 600, 300, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 4, r: 22 });
      text(ctx, "Semua halaman di sini", 1290, 380, 34, { align: "center", weight: 900 });
      text(ctx, "hanya REKAAN.", 1290, 430, 34, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "Alamatnya berakhiran .example,", 1290, 500, 28, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "jadi tidak bisa dibuka sungguhan.", 1290, 540, 28, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1640, 720, 110, 0, { wave: l });
    },
    k3_web(ctx, b, l) {
      const n = clamp(Math.floor((l - 0.3) / 0.25) + 1, 0, 10);
      const shown = new Set([1, 2, 6, 9, 7, 4, 3, 10, 5, 8].slice(0, n));
      for (let a = 1; a <= 10; a++) P[a].out.forEach(c => { if (shown.has(a) && shown.has(c) && l > at(b, 0.45)) arrow(ctx, edgePts(a, c), { color: l > at(b, 0.6) ? "#8FA3AF" : "#C2CDD4", lw: 3 }); });
      for (let i = 1; i <= 10; i++) if (shown.has(i)) pageCard(ctx, i, {});
      side(ctx, "WEB MINI", 140, 400);
      text(ctx, "10 halaman rekaan", 1585, 250, 30, { align: "center", weight: 900 });
      card(ctx, 1420, 290, 120, 60, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2.5, r: 10 }); text(ctx, "= halaman", 1560, 330, 24, { weight: 800, color: C.ink2 });
      arrow(ctx, { p1: [1420, 410], p2: [1540, 410] }, { color: "#8FA3AF", lw: 3 }); text(ctx, "= link", 1560, 418, 24, { weight: 800, color: C.ink2 });
      text(ctx, "panah: dari halaman yang", 1585, 480, 22, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "menautkan ke halaman tujuan", 1585, 510, 22, { align: "center", weight: 700, color: C.ink2 });
      Q.spider(ctx, 1585, 650, 70); text(ctx, "laba-laba perayap", 1585, 760, 26, { align: "center", weight: 800, color: C.ink2 });
    },
    k3_rayap(ctx, b, l) {
      const a = b.audio || b.dur, k0 = b.part === 2 ? 5 : 0, k1 = b.part === 2 ? 10 : 5;
      const t0 = b.part === 2 ? 0.2 : at(b, 0.12), span = a * 0.85 - t0, per = span / (k1 - k0);
      const f = (l - t0) / per, k = clamp(Math.floor(f), -1, k1 - k0 - 1) + k0, u = clamp(f - Math.floor(f), 0, 1);
      const arrived = l < t0 ? k0 - 1 : (k < k1 - 1 || f < k1 - k0) ? (u > 0.5 ? k : k - 1) : k1 - 1;
      const cur = l < t0 ? (k0 ? ORDER[k0 - 1] : null) : ORDER[Math.max(k, k0)];
      const visited = new Set(ORDER.slice(0, arrived + 1));
      const disc = []; if (k0 === 0 || visited.size) disc.push(1); ORDER.slice(0, arrived + 1).forEach(p => P[p].out.forEach(c => { if (!disc.includes(c)) disc.push(c); }));
      if (k0 === 0 && arrived < 0) disc.length = 0;
      const queue = disc.filter(p => !visited.has(p));
      map(ctx, { edgeOn: (x, y) => visited.has(x) && disc.includes(y), page: i => ({ visited: visited.has(i), queued: queue.includes(i) && !visited.has(i), hl: i === cur && !visited.has(i), dim: !visited.has(i) && !queue.includes(i) && i !== cur }) });
      // laba-laba bergerak dari halaman induk ke halaman yang dikunjungi
      let sp;
      if (cur && l >= t0) {
        const par = PARENT[cur];
        if (par && u < 0.5 && arrived < k) { const e = edgePts(par, cur), uu = ease(u / 0.5); sp = [lerp(e.p1[0], e.p2[0], uu), lerp(e.p1[1], e.p2[1], uu)]; }
        else { const [x, y] = POS[cur]; sp = [x + CW - 30, y + 10]; }
      } else if (k0 === 0) { sp = [POS[1][0] + 60, POS[1][1] - 40]; }
      else { const [x, y] = POS[ORDER[k0 - 1]]; sp = [x + CW - 30, y + 10]; }
      if (sp) Q.spider(ctx, sp[0], sp[1], 46);
      side(ctx, "ANTREAN", 140, 520);
      queue.slice(0, 6).forEach((p, i) => { card(ctx, 1400, 206 + i * 62, 370, 52, { fill: "#FFF9E0", r: 10 }); text(ctx, p + ". " + P[p].t, 1416, 240 + i * 62, 22, { weight: 800, fit: 340 }); });
      if (!queue.length) text(ctx, visited.size >= 10 ? "kosong: semua sudah dikunjungi" : "kosong", 1585, 240, 22, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1380, 680, 410, 140, { fill: visited.size >= 10 ? C.goodBg : "#FFFFFF", stroke: visited.size >= 10 ? C.good : "#D7E2DC", lw: 3, r: 20 });
      text(ctx, "sudah dikunjungi", 1585, 726, 24, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, visited.size + " dari 10", 1585, 790, 44, { align: "center", weight: 900, color: visited.size >= 10 ? C.good : C.ink });
    },
    k3_indeks(ctx, b, l) {
      const a = b.audio || b.dur;
      let page = 1, upto = 0, hlU = 1, fresh = null;
      if (b.full) { upto = 10; page = 5; }
      else {
        const p1 = at(b, 0.12), p2 = at(b, 0.8), p3 = Math.max(p2 + 1.5, b.dur - 0.4);
        if (l < p1) { upto = 0; hlU = ease(l / p1); }
        else if (l < p2) { upto = 1; fresh = 1; }
        else { const g = clamp((l - p2) / (p3 - p2), 0, 1); upto = 1 + Math.floor(g * 9.999); page = ORDER[Math.min(9, upto - 1)]; fresh = page; }
      }
      bigPage(ctx, page, 130, 150, 620, 470, hlU);
      if (!b.full) {
        text(ctx, "halaman dicatat: " + upto + " dari 10", 440, 680, 30, { align: "center", weight: 900, color: C.ink2 });
        Q.spider(ctx, 440, 760, 56);
      } else {
        card(ctx, 130, 650, 620, 160, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 });
        text(ctx, "kucing → 5, 6, 8, 10", 440, 715, 38, { align: "center", weight: 900, color: C.good });
        text(ctx, "selesai sebelum ada yang mencari", 440, 770, 26, { align: "center", weight: 800, color: C.ink2 });
      }
      indexTable(ctx, 790, 140, 1000, upto, { hl: b.full && l > at(b, 0.1) ? ["kucing"] : [], pages: [5, 6, 8, 10], fresh, rh: 54 });
    },
    k3_aturan(ctx, b, l) {
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "ATURAN NILAI MESIN PENCARI MINI", 960, 205, { align: "center", size: 30 });
      const rules = [["kata kunci ada di isi halaman", "+1", "untuk setiap kata kunci"], ["kata kunci ada di judul", "+2", "untuk setiap kata kunci"], ["ditautkan halaman lain", "+1", "untuk setiap link masuk"]];
      rules.forEach(([s, v, n], i) => {
        if (l < at(b, 0.3 + i * 0.18)) return;
        const x = 180 + i * 530; card(ctx, x, 250, 500, 300, { fill: [BLUE_BG, "#FFF3D6", C.goodBg][i], r: 22 });
        text(ctx, v, x + 250, 360, 90, { align: "center", weight: 900, color: [DEEP, C.accentDark, C.good][i] });
        para(ctx, s, x + 250, 440, 32, 440, { align: "center", weight: 900, lh: 1.2 });
        text(ctx, n, x + 250, 525, 24, { align: "center", weight: 700, color: C.ink2 });
      });
      text(ctx, "Nilai tertinggi tampil paling atas.", 960, 630, 34, { align: "center", weight: 900 });
      text(ctx, "Mesin pencari sungguhan memakai ratusan aturan; mesin mini kita memakai tiga saja.", 960, 700, 26, { align: "center", weight: 700, color: C.ink2 });
    },
    k3_tanya(ctx, b, l) {
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "VARIASI " + VNO[b.v] + " DARI 4 · " + QLAB[b.v].toUpperCase(), 200, 210, { size: 28 });
      text(ctx, "Menurutmu, apa yang terjadi kalau kita mencari…", 200, 290, 44, { weight: 900, fit: 1200 });
      search(ctx, 200, 340, 1100, QV[b.v], { h: 110, size: 56, stroke: C.accent });
      if (b.v === "v4") {
        text(ctx, "…setelah tiga halaman lain menautkan Warung Bu Rina?", 200, 540, 34, { weight: 800, color: C.ink2 });
        card(ctx, 200, 580, 600, 120, { fill: "#F4F7F5", r: 16 }); text(ctx, "urutan sekarang:", 230, 625, 24, { weight: 800, color: C.ink2 });
        text(ctx, "Warung Bu Rina di urutan 3", 230, 672, 32, { weight: 900 });
      } else {
        text(ctx, b.v === "v1" ? "Halaman mana yang paling atas?" : b.v === "v2" ? "Hasilnya bertambah atau berkurang?" : "Berapa hasil yang muncul?", 200, 540, 36, { weight: 800, color: C.ink2 });
      }
      kiko(ctx, 1600, 640, 190, 0, { mood: "confused" });
      if (l > 0.6) bubble(ctx, 1460, 430, 260, "Hmm, coba tebak…", 32, { tailX: 1580, tailDir: 10 });
    },
    k3_tebak(ctx, b, l) {
      card(ctx, 120, 140, 1680, 690, { stroke: C.accent, lw: 6 });
      header(ctx, "VARIASI " + VNO[b.v] + " · TEBAK DULU", 200, 210, { size: 30 });
      search(ctx, 200, 240, 1000, QV[b.v], { h: 96, size: 46 });
      (b.pilih || []).forEach((o, i) => {
        const x = 200 + i * 520; card(ctx, x, 420, 480, 220, { fill: C.bg2, stroke: "#CFDCD5", lw: 3, r: 22 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 240, 480, 32, 0, Math.PI * 2); ctx.fill();
        text(ctx, "ABC"[i], x + 240, 493, 34, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, o, x + 240, 590, 38, { align: "center", weight: 900, fit: 440 });
      });
      ring(ctx, 1700, 210, l / b.dur);
      text(ctx, "Pilih satu dalam hati, lalu lihat hasilnya.", 960, 720, 32, { align: "center", weight: 700, color: C.ink2 });
    },
    k3_cari(ctx, b, l) {
      const q = QV[b.v], ws = q.split(" "), a = b.audio || b.dur;
      search(ctx, 130, 140, 900, q, { h: 80, size: 40 });
      // baris indeks untuk tiap kata kunci
      const match = [...Array(10)].map((_, i) => i + 1).filter(p => ws.every(w => IDX[w].includes(p)));
      ws.forEach((w, r) => {
        if (l < at(b, 0.05 + r * 0.3)) return;
        const y = 260 + r * 120; card(ctx, 130, y, 900, 100, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 16 });
        card(ctx, 150, y + 20, 170, 60, { fill: "#FFFFFF", r: 10 }); text(ctx, w, 235, y + 60, 28, { align: "center", weight: 900, color: C.accentDark });
        IDX[w].forEach((p, j) => { const on = match.includes(p) && l > at(b, ws.length > 1 ? 0.72 : 0.35);
          ctx.fillStyle = on ? C.good : "#FFFFFF"; rr(ctx, 350 + j * 76, y + 20, 62, 60, 12); ctx.fill(); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 2; rr(ctx, 350 + j * 76, y + 20, 62, 60, 12); ctx.stroke();
          text(ctx, String(p), 381 + j * 76, y + 61, 28, { align: "center", weight: 900, color: on ? "#FFFFFF" : C.ink }); });
      });
      if (ws.length > 1 && l > at(b, 0.72)) { const y = 260 + ws.length * 120 + 10; text(ctx, "ada di kedua baris: halaman " + match.join(" dan "), 150, y + 30, 32, { weight: 900, color: C.good }); }
      // sepuluh halaman: yang cocok menyala, sisanya dilewati
      const showRes = l > at(b, ws.length > 1 ? 0.72 : 0.35);
      card(ctx, 1080, 140, 710, 690, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 });
      header(ctx, showRes ? "HALAMAN YANG DINILAI: " + match.length : "SEPULUH HALAMAN", 1435, 192, { align: "center" });
      for (let i = 1; i <= 10; i++) {
        const c = (i - 1) % 2, r = Math.floor((i - 1) / 2), x = 1105 + c * 345, y = 215 + r * 116, on = showRes && match.includes(i), off = showRes && !on;
        card(ctx, x, y, 330, 100, { fill: on ? C.goodBg : off ? "#F4F6F5" : "#FFFFFF", stroke: on ? C.good : "#D7E2DC", lw: on ? 4 : 2, r: 14 });
        ctx.fillStyle = off ? "#C9D4DB" : on ? C.good : C.kiko; ctx.beginPath(); ctx.arc(x + 32, y + 50, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i), x + 32, y + 58, 22, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, P[i].t, x + 62, y + 46, 21, { weight: 900, color: off ? C.muted : C.ink, fit: 255 });
        text(ctx, off ? "dilewati" : on ? "dinilai" : P[i].u, x + 62, y + 76, 19, { weight: 800, color: off ? C.muted : on ? C.good : C.ink2, fit: 255 });
      }
      if (showRes && match.length >= 5) text(ctx, "separuh dari web mini!", 150, 450, 34, { weight: 900, color: C.bad });
      if (showRes && ws.length === 1 && match.length < 5) text(ctx, "Hanya " + match.length + " halaman yang dinilai.", 150, 450, 32, { weight: 900, color: DEEP });
      // lemari indeks (seperti episode D7.4): laci kata kunci terbuka
      const labs = [...new Set([...ws, ...["bakso", "futsal", "kucing", "sekolah"]])].slice(0, 4).sort();
      const openW = ws.length > 1 && l > at(b, 0.35) ? ws[1] : ws[0];
      Q.cabinet(ctx, 150, 560, 330, 250, labs, { open: labs.indexOf(openW) });
      text(ctx, "Mesin hanya membuka laci", 520, 650, 30, { weight: 800, color: C.ink2 }); text(ctx, "kata kunci di lemari indeks,", 520, 692, 30, { weight: 800, color: C.ink2 }); text(ctx, "bukan membaca semua halaman.", 520, 734, 30, { weight: 800, color: C.ink2 });
    },
    k3_peringkat(ctx, b, l) {
      const R = RANK[b.v], a = b.audio || b.dur, n = R.rows.length;
      search(ctx, 130, 140, 900, R.q, { h: 80, size: 40 });
      text(ctx, n + " hasil", 1070, 192, 30, { weight: 900, color: C.ink2 });
      if (b.v === "v4b") { card(ctx, 1300, 140, 490, 80, { fill: "#FDECEA", stroke: C.bad, lw: 3, r: 16 }); text(ctx, "+3 link baru ke Warung Bu Rina", 1545, 190, 24, { align: "center", weight: 900, color: C.bad }); }
      // posisi baris: v4b bergerak dari urutan lama ke urutan baru
      const from = R.from ? RANK[R.from].rows.map(r => r[0]) : null, mv = from ? ease(clamp((l - at(b, 0.15)) / (a * 0.35), 0, 1)) : 1;
      const top = 250, gap = n > 4 ? 114 : 124, rh = n > 4 ? 100 : 108;
      R.rows.forEach(([p, isi, jud, lk], i) => {
        const oldI = from ? from.indexOf(p) : i, pos = lerp(oldI, i, mv), y = top + pos * gap;
        const rev = from ? 1 : clamp((l - at(b, 0.08 + i * (0.6 / n))) / 0.6, 0, 1); if (rev <= 0) return;
        const first = from ? (mv > 0.5 ? i === 0 : oldI === 0) : i === 0;
        ctx.globalAlpha = rev;
        card(ctx, 130, y, 1660, rh, { fill: first ? C.goodBg : "#FFFFFF", stroke: first ? C.good : p === 4 && from ? C.bad : "#D7E2DC", lw: first || (p === 4 && from) ? 4 : 2, r: 16 });
        const rank = from ? (mv > 0.5 ? i : oldI) + 1 : i + 1;
        ctx.fillStyle = first ? C.good : C.kiko; ctx.beginPath(); ctx.arc(185, y + rh / 2, 30, 0, Math.PI * 2); ctx.fill(); text(ctx, String(rank), 185, y + rh / 2 + 12, 32, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, P[p].t, 240, y + rh / 2 - 4, 32, { weight: 900, fit: 560 }); text(ctx, "halaman " + p + " · " + P[p].u, 240, y + rh / 2 + 32, 22, { weight: 700, color: C.ink2, fit: 560 });
        const lkShow = b.v === "v4b" && p === 4 ? Math.round(lerp(2, 5, mv)) : lk;
        const chips = [["isi", isi, BLUE_BG, DEEP], ["judul", jud, "#FFF3D6", C.accentDark], ["link", lkShow, C.goodBg, C.good]];
        chips.forEach(([nm, v, bg, col], j) => { const x = 840 + j * 250; ctx.fillStyle = bg; rr(ctx, x, y + rh / 2 - 30, 220, 60, 14); ctx.fill(); text(ctx, nm + " +" + v, x + 110, y + rh / 2 + 11, 30, { align: "center", weight: 900, color: col }); });
        text(ctx, "= " + (isi + jud + lkShow), 1760, y + rh / 2 + 16, 46, { align: "right", weight: 900, color: first ? C.good : C.ink });
        ctx.globalAlpha = 1;
      });
    },
    k3_link(ctx, b, l) {
      const a = b.audio || b.dur;
      const us = NEW.map((_, i) => clamp((l - at(b, 0.08 + i * 0.2)) / (a * 0.15), 0, 1));
      const added = us.filter(u => u >= 1).length;
      map(ctx, { extra: NEW.map(([x, y], i) => [x, y, us[i]]), page: i => ({ hl: i === 4, badge: i === 4 ? "link: " + (2 + added) : null, badgeCol: added ? C.bad : C.kiko, dim: i !== 4 && !NEW.some(([x]) => x === i) && i !== 2 && i !== 7 }) });
      side(ctx, "LINK MASUK KE WARUNG BU RINA", 140, 400);
      text(ctx, String(2 + added), 1585, 330, 120, { align: "center", weight: 900, color: added ? C.bad : C.ink });
      text(ctx, "sebelumnya 2: dari Menu Kantin", 1585, 400, 22, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "dan Berita Kota", 1585, 430, 22, { align: "center", weight: 700, color: C.ink2 });
      if (added) text(ctx, "+" + added + " link baru", 1585, 490, 30, { align: "center", weight: 900, color: C.bad });
      if (l > at(b, 0.7)) { Q.spider(ctx, 1585, 650, 60, {}); text(ctx, "laba-laba merayap lagi", 1585, 760, 24, { align: "center", weight: 800, color: C.ink2 }); }
    },
    k3_palsu(ctx, b, l) {
      const a = b.audio || b.dur;
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "LINK PALSU TIDAK DIHITUNG", 960, 205, { align: "center", size: 30 });
      // halaman tujuan di tengah, banyak halaman palsu di kiri
      card(ctx, 1080, 380, 360, 120, { fill: "#FFFFFF", stroke: C.accent, lw: 5, r: 16 }); text(ctx, "halaman yang", 1260, 430, 26, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "ingin naik", 1260, 470, 30, { align: "center", weight: 900 });
      const check = l > at(b, 0.5);
      for (let i = 0; i < 6; i++) {
        const y = 250 + i * 90, x = 260;
        card(ctx, x, y, 300, 70, { fill: check ? "#F4F6F5" : "#FFFFFF", stroke: check ? "#D7E2DC" : "#C9D4DB", lw: 2, r: 12 });
        text(ctx, "halaman palsu " + (i + 1), x + 24, y + 44, 24, { weight: 800, color: check ? C.muted : C.ink2 });
        arrow(ctx, { p1: [x + 300, y + 35], p2: [1080, 440] }, { color: check ? "#E5B5B0" : "#B7C4CC", lw: 3, u: clamp((l - 0.3 - i * 0.2) / 0.5, 0, 1) });
        if (check && l > at(b, 0.5) + i * 0.15) text(ctx, "✗", x + 280, y + 46, 34, { align: "right", weight: 900, color: C.bad });
      }
      if (check) {
        card(ctx, 1080, 560, 640, 170, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 });
        text(ctx, "Mesin pencari sungguhan", 1400, 620, 30, { align: "center", weight: 900, color: C.good });
        text(ctx, "memeriksa asal setiap link.", 1400, 670, 30, { align: "center", weight: 900, color: C.good });
        // kaca pembesar
        ctx.strokeStyle = DEEP; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(700, 520, 60, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(742, 562); ctx.lineTo(800, 620); ctx.stroke();
      }
    },
    k3_latihan(ctx, b, l) {
      const a = b.audio || b.dur;
      const X = 130, Y = 130, Wd = 1120, Hd = 700;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.18)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, X, Y, Wd, Hd, 16); ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, X, Y, Wd, Hd, 16); ctx.clip();
      ctx.fillStyle = "#EEF2F5"; ctx.fillRect(X, Y, Wd, 64);
      ["#E5675F", "#F2B134", "#4CB46A"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X + 28 + i * 26, Y + 32, 8, 0, Math.PI * 2); ctx.fill(); });
      card(ctx, X + 120, Y + 12, Wd - 150, 40, { fill: "#FFFFFF", r: 20 }); text(ctx, "belajar-informatika.vercel.app/d74", X + 145, Y + 40, 22, { weight: 700, color: C.ink2 });
      ctx.fillStyle = C.bg; ctx.fillRect(X, Y + 64, Wd, Hd - 64);
      card(ctx, X + 30, Y + 84, Wd - 60, Hd - 104, { fill: "#FFFFFF", r: 18 });
      const cx = X + 60;
      text(ctx, "Latihan: mencari yang jitu", cx, Y + 136, 30, { weight: 900 });
      const tL = at(b, 0.1), tUp = at(b, 0.28), tSort = at(b, 0.42), tCheck = at(b, 0.52);
      const lv = ["1 Urutkan pekerjaannya", "2 Susun kata kunci", "3 Pilih hasil tepercaya"]; let bx = cx; const btn = {};
      lv.forEach((s, i) => { ctx.font = "800 21px Inter"; const w = ctx.measureText(s).width + 32; const on = i === 0 && l > tL;
        card(ctx, bx, Y + 156, w, 46, { fill: on ? "#FFF3D6" : "#F1F5F3", stroke: on ? C.accent : "#D7E2DC", lw: on ? 3 : 2, r: 12 }); text(ctx, s, bx + 16, Y + 186, 21, { weight: 800 }); btn[i] = { x: bx + w / 2, y: Y + 180 }; bx += w + 10; });
      const correct = ["Laba-laba perayap mengunjungi halaman dan mengikuti link", "Setiap kata dicatat di indeks beserta halamannya", "Kamu mengetik kata kunci dan menekan Enter", "Mesin membuka kartu indeks kata-kata itu", "Halaman yang cocok diberi nilai dan diurutkan", "Hasil tampil di layarmu"];
      let order = [2, 0, 4, 1, 5, 3]; if (l > tUp) order = [0, 2, 4, 1, 5, 3]; if (l > tSort) order = [0, 1, 2, 3, 4, 5];
      const ok = l > tCheck;
      order.forEach((ci, pos) => {
        const y = Y + 222 + pos * 62; const good = ok;
        card(ctx, cx, y, Wd - 120, 54, { fill: good ? C.goodBg : "#F7FAF8", stroke: good ? C.good : "#D7E2DC", lw: 2, r: 10 });
        ctx.fillStyle = good ? C.good : C.kiko; ctx.beginPath(); ctx.arc(cx + 26, y + 27, 16, 0, Math.PI * 2); ctx.fill(); text(ctx, String(pos + 1), cx + 26, y + 34, 18, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, correct[ci], cx + 54, y + 35, 21, { weight: 700, fit: 820 });
        ["▲", "▼"].forEach((s, j) => { card(ctx, cx + Wd - 230 + j * 52, y + 7, 44, 40, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 8 }); text(ctx, s, cx + Wd - 208 + j * 52, y + 35, 20, { align: "center", weight: 900, color: C.ink2 }); });
      });
      card(ctx, cx, Y + 600, 150, 50, { fill: "#F2B134", r: 12 }); text(ctx, "Periksa", cx + 75, Y + 633, 24, { align: "center", weight: 900 });
      if (ok) { ctx.fillStyle = C.goodBg; rr(ctx, cx + 170, Y + 600, 820, 50, 12); ctx.fill(); text(ctx, "Latihan 1 Urutkan pekerjaannya selesai!", cx + 190, Y + 633, 22, { weight: 900, color: C.good }); }
      ctx.restore();
      // pointer: tombol latihan 1 -> ▲ baris ke-2 -> Periksa
      const upBtn = { x: cx + Wd - 208, y: Y + 222 + 62 + 30 }, chk = { x: cx + 110, y: Y + 640 };
      const pts = [[0, { x: 900, y: 780 }], [tL, btn[0]], [tUp, upBtn], [tCheck, chk]];
      let p = pts[0][1], clk = 0;
      for (let i = 1; i < pts.length; i++) { const [t1, q1] = pts[i], [t0, q0] = pts[i - 1]; if (l >= t1) { p = q1; clk = (l - t1) / 0.5; } else { const u = ease((l - t0 - (i > 1 ? 0.5 : 0)) / Math.max(0.3, t1 - t0 - (i > 1 ? 0.5 : 0))); p = { x: lerp(q0.x, q1.x, u), y: lerp(q0.y, q1.y, u) }; break; } }
      if (clk > 0 && clk < 1) { ctx.strokeStyle = `rgba(242,177,52,${1 - clk})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(p.x, p.y, 12 + clk * 34, 0, Math.PI * 2); ctx.stroke(); }
      ctx.save(); ctx.translate(p.x, p.y); ctx.scale(1.3, 1.3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.lineTo(8, 23); ctx.lineTo(13, 35); ctx.lineTo(18, 33); ctx.lineTo(13, 21); ctx.lineTo(23, 21); ctx.closePath();
      ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.stroke(); ctx.restore();
      card(ctx, 1290, 130, 510, 700, { fill: "#FFF9E0", r: 22 });
      header(ctx, "TUGAS NYATA", 1545, 195, { align: "center", size: 30 });
      ["Pilih satu bahan tugas sekolahmu.", "Cari dengan dua kata kunci yang spesifik.", "Bandingkan tiga hasil teratas."].forEach((s, i) => {
        const y = 240 + i * 150; ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1345, y + 40, 26, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 1345, y + 51, 30, { align: "center", weight: 900, color: "#FFFFFF" });
        para(ctx, s, 1390, y + 32, 30, 380, { weight: 800, lh: 1.25 });
      });
      Q.spider(ctx, 1545, 720, 60);
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
