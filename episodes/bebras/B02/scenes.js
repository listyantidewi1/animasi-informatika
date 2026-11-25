/* B02 Pembahasan Soal Bebras 2025-LT-04 "Iklan atau Bukan Iklan" (Lituania), kategori SiKecil.
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01) + simulasi "pemindai kata":
   kalimat ditulis satu kata per kotak, kaca pembesar bergeser dari kata pertama, kata yang dicek diberi silang kecil,
   kata yang cocok dengan kartu kuning ("diskon"/"promo") dilingkari oranye, lalu amplop masuk ke papan IKLAN (merah)
   atau BUKAN IKLAN (hijau), warnanya sama dengan soal asli.
   Papan: x 52–1868, y 130–830 (kartu narasi mulai y≈841). Tata letak "periksa":
   kotak kalimat y 225–445; panel cocokkan kiri (x 90–900, y 470–670); papan tujuan kanan (x 940–1830, y 470–670);
   lajur tiga langkah y 700–800. Waktu kejadian diambil dari posisi kata di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp, wrap } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        YEL = "#FFE27A", YELS = "#D9A300", GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Iklan atau Bukan Iklan", asli: "", tahun: "2025", negara: "Lituania", kode: "2025-LT-04" };

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => {
    const T = TXT(b), i = T.indexOf(s);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); }
    return lead(b) + Math.max(0, i) / T.length * (b.audio || b.dur);
  };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));

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
  function tick(ctx, x, y, s, u = 1, color = GREEN, w) { mline(ctx, [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.33], [x + s * 0.48, y - s * 0.38]], u, color, w || Math.max(4, s * 0.16)); }
  function cross(ctx, x, y, s, u = 1, color = RED, w) {
    const lw = w || Math.max(4, s * 0.16);
    mline(ctx, [[x - s * 0.36, y - s * 0.36], [x + s * 0.36, y + s * 0.36]], u * 2, color, lw);
    mline(ctx, [[x + s * 0.36, y - s * 0.36], [x - s * 0.36, y + s * 0.36]], u * 2 - 1, color, lw);
  }
  function ring(ctx, x, y, rx, ry, u, color = ORANGE, w = 6) {
    if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.04, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.15 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
  }
  function hand(ctx, s, x, y, size, opt = {}) {
    ctx.save(); ctx.font = `italic 800 ${size}px ${K.FONT}`; ctx.fillStyle = opt.color || ORANGE; ctx.textAlign = opt.align || "center";
    ctx.textBaseline = "alphabetic"; if (opt.alpha != null) ctx.globalAlpha *= opt.alpha; ctx.fillText(s, x, y); ctx.restore();
  }
  function tw(ctx, s, size, weight = 800) { ctx.font = `${weight} ${size}px ${K.FONT}`; return ctx.measureText(s).width; }

  // ---------- benda: kartu kuning, papan IKLAN/BUKAN IKLAN, amplop, kaca pembesar ----------
  function keyCard(ctx, word, x, y, size = 40, opt = {}) {   // x,y = pusat
    const w = tw(ctx, word, size, 900) + size * 1.1, h = size * 1.7;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    if (opt.glow) { ctx.fillStyle = "rgba(238,122,18,0.25)"; rr(ctx, x - w / 2 - 10, y - h / 2 - 10, w + 20, h + 20, 16); ctx.fill(); }
    ctx.fillStyle = YEL; ctx.strokeStyle = YELS; ctx.lineWidth = 4; rr(ctx, x - w / 2, y - h / 2, w, h, 12); ctx.fill(); ctx.stroke();
    text(ctx, word, x, y + size * 0.36, size, { align: "center", weight: 900, color: INK });
    if (opt.crossed) { ctx.fillStyle = `rgba(255,255,255,${0.45 * clamp(opt.crossed, 0, 1)})`; rr(ctx, x - w / 2, y - h / 2, w, h, 12); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + w / 2, y - h / 2, 20, 0, Math.PI * 2); ctx.fill(); cross(ctx, x + w / 2, y - h / 2, 30, opt.crossed, RED, 6); }
    ctx.restore();
    return w;
  }
  function sign(ctx, kind, x, y, w, h, opt = {}) {   // kind: "ya" (IKLAN) / "tidak" (BUKAN IKLAN); x,y = pusat
    const yes = kind === "ya", col = yes ? "#E23B3B" : "#1E9E50", dark = yes ? "#A62424" : "#12703A";
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    if (opt.glow) { ctx.fillStyle = yes ? "rgba(226,59,59,0.22)" : "rgba(30,158,80,0.22)"; rr(ctx, x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32, 22); ctx.fill(); }
    ctx.fillStyle = col; ctx.strokeStyle = dark; ctx.lineWidth = 5; rr(ctx, x - w / 2, y - h / 2, w, h, 14); ctx.fill(); ctx.stroke();
    const s = opt.size || Math.min(h * 0.42, 54);
    text(ctx, yes ? "IKLAN" : "BUKAN IKLAN", x, y + s * 0.36 - ((opt.nums && opt.nums.length) || opt.shift ? h * 0.14 : 0), s, { align: "center", weight: 900, color: "#fff", fit: w - 30 });
    if (opt.nums) opt.nums.forEach((n, i) => { const k = opt.nums.length, ex = x + (i - (k - 1) / 2) * 76; envelope(ctx, ex, y + h * 0.27, 60, n, { mini: true }); });
    ctx.restore();
  }
  function envelope(ctx, x, y, w, num, opt = {}) {   // x,y pusat; num = nomor di lencana
    const h = w * 0.66;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2.5, w * 0.045); rr(ctx, x - w / 2, y - h / 2, w, h, w * 0.08); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - w / 2 + 3, y - h / 2 + 3); ctx.lineTo(x, y + h * 0.08); ctx.lineTo(x + w / 2 - 3, y - h / 2 + 3); ctx.stroke();
    if (num != null && num !== "") {
      const r = opt.mini ? w * 0.24 : w * 0.2, bx = x + w / 2 - r * 0.4, by = y + h / 2 - r * 0.4;
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
      if (opt.mini) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); }
      text(ctx, String(num), bx, by + r * 0.4, r * 1.15, { align: "center", weight: 900, color: "#fff" });
    }
    ctx.restore();
  }
  function magnifier(ctx, x, y, rx, ry) {
    ctx.save();
    ctx.fillStyle = "rgba(47,127,209,0.10)"; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 7; ctx.stroke();
    const a = Math.PI * 0.25, hx = x + rx * Math.cos(a), hy = y + ry * Math.sin(a);
    ctx.strokeStyle = "#5B4636"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(hx + 4, hy + 4); ctx.lineTo(hx + 44, hy + 40); ctx.stroke();
    ctx.restore();
  }
  function choiceBox(ctx, x, y, w, h, val, opt = {}) {   // kotak pilihan seperti di soal; val: null | "ya" | "tidak"
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    const pulse = opt.pulse ? 1 : 0;
    ctx.fillStyle = val ? (val === "ya" ? "#FDE7E7" : "#E2F5E8") : "#FFFFFF";
    ctx.strokeStyle = val ? (val === "ya" ? RED : GREEN) : pulse ? ORANGE : "#AEB8BF"; ctx.lineWidth = val || pulse ? 4 : 3;
    rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.stroke();
    const s = Math.min(34, h * 0.5);
    if (!val) {
      text(ctx, "Pilih…", x + 20, y + h / 2 + s * 0.36, s, { weight: 600, color: "#56636D" });
      ctx.strokeStyle = "#56636D"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x + w - 42, y + h / 2 - 5); ctx.lineTo(x + w - 32, y + h / 2 + 5); ctx.lineTo(x + w - 22, y + h / 2 - 5); ctx.stroke();
    } else {
      const u = opt.fresh == null ? 1 : opt.fresh;
      hand(ctx, val === "ya" ? "Iklan" : "Bukan Iklan", x + w / 2, y + h / 2 + s * 0.38, s * 1.05, { color: val === "ya" ? RED : GREEN, alpha: u });
    }
    ctx.restore();
  }

  // ---------- kalimat ----------
  const KEYS = ["diskon", "promo"];
  const SENT = {
    W1: { words: ["Kucing", "Sinta", "tidur", "di", "kursi."], keys: ["kucing"], label: "KALIMAT 1" },
    W2: { words: ["Dito", "makan", "nasi", "di", "kantin."], keys: ["kucing"], label: "KALIMAT 2" },
    X1: { words: ["Diskon", "besar-besaran", "hari", "ini"], keys: KEYS, label: "CONTOH 1 DARI SOAL", soal: "ya" },
    X2: { words: ["Besok", "ada", "pelajaran", "olahraga"], keys: KEYS, label: "CONTOH 2 DARI SOAL", soal: "tidak" },
    E1: { words: ["Promo", "khusus", "anggota", "baru."], keys: KEYS, label: "EMAIL 1", num: 1 },
    E2: { words: ["Pengingat:", "besok", "les", "piano."], keys: KEYS, label: "EMAIL 2", num: 2 },
    E3: { words: ["Dapatkan", "diskon", "dengan", "mudah,", "hanya", "untuk", "lima", "pembeli", "pertama."], keys: KEYS, label: "EMAIL 3", num: 3 },
    Q: { words: ["Pengingat:", "jangan", "mudah", "percaya", "pada", "promo", "di", "internet."], keys: KEYS, label: "EMAIL LAIN", num: "?" },
  };
  const bare = w => w.replace(/[.,:!?]+$/, "");
  const norm = w => bare(w).toLowerCase();
  const isKey = (S, i) => S.keys.includes(norm(S.words[i]));
  const firstKey = S => S.words.findIndex((w, i) => isKey(S, i));
  // tata letak kata: satu kotak per kata, dibungkus ke beberapa baris, rata tengah
  function layoutWords(ctx, words, size, maxW, cx, cy) {
    const gap = size * 0.55, ws = words.map(w => tw(ctx, w, size, 800) + size * 0.5);
    const brk = mw => { const ls = [[]]; let cur = 0; ws.forEach((w, i) => { if (cur + w > mw && ls[ls.length - 1].length) { ls.push([]); cur = 0; } ls[ls.length - 1].push(i); cur += w + gap; }); return ls; };
    let lines = brk(maxW); const n0 = lines.length;
    if (n0 > 1) { let mw = maxW; while (mw > 200 && brk(mw - 20).length === n0) mw -= 20; lines = brk(mw); }   // baris seimbang
    const lh = size * (lines.length > 1 ? 2.1 : 1.75), y0 = cy - (lines.length - 1) * lh / 2, out = [];
    lines.forEach((ln, li) => {
      const tot = ln.reduce((s, i) => s + ws[i], 0) + gap * (ln.length - 1); let x = cx - tot / 2;
      ln.forEach(i => { out[i] = { x, w: ws[i], cy: y0 + li * lh }; x += ws[i] + gap; });
    });
    return out;
  }
  function drawWords(ctx, S, st, box) {
    let size = box.size || 60; if (box.fitLong && S.words.join(" ").length > 40) size = Math.min(size, 52);
    const L = layoutWords(ctx, S.words, size, box.w - 120, box.cx, box.cy);
    S.words.forEach((w, i) => {
      const p = L[i], mk = st.mark[i] || 0, key = isKey(S, i), dim = st.dim && i !== st.found ? st.dim : 0;
      ctx.save(); ctx.globalAlpha *= (st.write == null ? 1 : clamp(st.write * S.words.length - i, 0, 1)) * (1 - 0.65 * dim);
      if (mk > 0 && key) { ctx.fillStyle = YEL; ctx.globalAlpha *= 1; rr(ctx, p.x, p.cy - size * 0.72, p.w, size * 1.38, 12); ctx.fill(); }
      text(ctx, w, p.x + p.w / 2, p.cy + size * 0.36, size, { align: "center", weight: 800, color: INK });
      if (st.under != null && st.under > 0) { const u = clamp(st.under * S.words.length - i, 0, 1); if (u > 0) mline(ctx, [[p.x + 8, p.cy + size * 0.62], [p.x + p.w - 8, p.cy + size * 0.62]], u, ORANGE, 5); }
      if (mk > 0 && !key) cross(ctx, p.x + p.w / 2, p.cy + size * 0.95, 30, mk, RED, 5);
      ctx.restore();
      if (mk > 0 && key) ring(ctx, p.x + p.w / 2, p.cy, p.w / 2 + 22, size * 0.78, st.ringU == null ? mk : Math.min(mk, st.ringU), ORANGE, 7);
    });
    if (st.cur != null && st.cur >= 0) { const p = L[st.cur]; magnifier(ctx, p.x + p.w / 2, p.cy, Math.max(p.w / 2 + 26, 64), size * 0.95); }
    return L;
  }

  // ---------- konfigurasi tiap beat "periksa" ----------
  // set: kalimat; pre: {n: jumlah kata yang sudah dicek, v: keputusan sebelumnya ("ya"/"tidak")}
  // scan: [[indeks kata, frasa narasi]], appear: frasa saat kalimat ditulis, verdict: frasa keputusan, think: jeda berpikir
  const CFG = {
    w1: { set: "W1", hide: true, intro: true },
    w2: { set: "W1", appear: "Kucing Sinta" },
    w3: { set: "W1", scan: [[0, "Kata pertama"]], ringAt: "Nah", verdict: "Jadi," },
    w4: { set: "W2", appear: "Dito makan", scan: [[0, "adalah Dito"], [1, "makan,"], [2, "nasi,"], [3, "di, dan"], [4, "dan kantin"]] },
    w5: { set: "W2", pre: { n: 5 }, end: "tidak ada", verdict: "Jadi," },
    w6: { set: "W2", pre: { n: 5, v: "tidak" }, praise: true },
    w7: { set: "W2", pre: { n: 5, v: "tidak" }, swap: "Bedanya" },
    u4: { set: "X1", appear: "Contoh pertama", scan: [[0, "Kata pertamanya"]] },
    u5: { set: "X1", pre: { n: 1 }, verdict: "Jadi,", match: "Hasilnya" },
    u6: { set: "X2", appear: "Contoh kedua", scan: [[0, "adalah besok"], [1, "ada, pel"], [2, "pelajaran, dan"], [3, "dan olahraga"]] },
    u7: { set: "X2", pre: { n: 4 }, end: "Tidak ada", verdict: "Jadi,", match: "Hasilnya" },
    e1a: { set: "E1", appear: "Email ini", steps: true },
    e1b: { set: "E1", scan: [[0, "Kata pertamanya"]], steps: true, noRing: true },
    e1c: { set: "E1", pre: { n: 1 }, caseNote: true, steps: true, noRing: true, cur: 0 },
    e1d: { set: "E1", pre: { n: 1 }, ringAt: "menemukan", verdict: "Jadi,", steps: true },
    e2a: { set: "E2", appear: "Email ini", steps: true },
    e2b: { set: "E2", think: true, steps: true },
    e2c: { set: "E2", scan: [[0, "Kata pertama"]], steps: true },
    e2d: { set: "E2", pre: { n: 1 }, scan: [[1, "Kata kedua"], [2, "Kata ketiga"], [3, "Kata keempat"]], steps: true },
    e2e: { set: "E2", pre: { n: 4 }, end: "sampai akhir", verdict: "Jadi,", steps: true },
    e2f: { set: "E2", pre: { n: 4, v: "tidak" }, note: "piano", steps: true },
    e3a: { set: "E3", appear: "Email ketiga", steps: true },
    e3b: { set: "E3", think: true, steps: true },
    e3c: { set: "E3", scan: [[0, "Kata pertama"]], steps: true },
    e3d: { set: "E3", pre: { n: 1 }, keepGoing: "tidak boleh berhenti", stepBig: 1, steps: true },
    e3e: { set: "E3", pre: { n: 1 }, scan: [[1, "Kata kedua"]], ringAt: "Nah", steps: true },
    e3f: { set: "E3", pre: { n: 2 }, verdict: "Jadi,", dimAt: "Kata-kata lainnya", steps: true },
    e3g: { set: "E3", pre: { n: 2, v: "ya" }, dim: 1, note: "antre", steps: true },
    q1: { set: "Q", appear: "Coba lihat", steps: true },
    q2: { set: "Q", note: "nasihat", steps: true },
    q3: { set: "Q", scanFast: "Namun", verdict: "aturan kita", note2: "bingung", steps: true },
  };
  const BOX = { x: 90, y: 225, w: 1740, h: 220 };

  function periksa(ctx, b, l, t, TL) {
    board(ctx);
    const cf = CFG[b.id] || {}, S = SENT[cf.set], pre = cf.pre || {};
    const kucing = S.keys[0] === "kucing";
    const mark = {}; let cur = null, curT = -9;
    for (let i = 0; i < (pre.n || 0); i++) mark[i] = 1;
    (cf.scan || []).forEach(([i, ph]) => { const t0 = at(b, ph); if (l >= t0) { cur = i; curT = t0; mark[i] = P(l, t0 + 0.5, 0.5); } });
    if (cf.scanFast) { const t0 = at(b, cf.scanFast), k = firstKey(S); for (let i = 0; i <= k; i++) { const ti = t0 + i * 0.35; if (l >= ti) { cur = i; mark[i] = P(l, ti + 0.2, 0.25); } } }
    if (cf.cur != null) cur = cf.cur;
    const fk = firstKey(S), foundNow = fk >= 0 && (mark[fk] || 0) >= 1;
    // keputusan
    const vT = cf.verdict ? at(b, cf.verdict) : Infinity, vU = P(l, vT, 1.0);
    const decided = pre.v || (l >= vT + 1.0 ? (fk >= 0 ? "ya" : "tidak") : null);
    const flying = l >= vT && l < vT + 1.0;
    if (decided || flying) cur = null;
    const ringU = cf.ringAt ? P(l, at(b, cf.ringAt), 0.6) : (cf.noRing ? 0 : 1);
    const dimU = cf.dim != null ? cf.dim : cf.dimAt ? P(l, at(b, cf.dimAt), 0.8) : 0;

    // header kotak kalimat
    const show = cf.hide ? 0 : cf.appear ? P(l, at(b, cf.appear), 0.5) : 1;
    const write = cf.appear ? clamp((l - at(b, cf.appear)) / 2.2, 0, 1) : null;
    ctx.save(); ctx.globalAlpha = cf.hide ? 0.35 : 1;
    card(ctx, BOX.x, BOX.y - 70, BOX.w, BOX.h + 70, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    ctx.restore();
    if (S.num != null) envelope(ctx, BOX.x + 60, BOX.y - 30, 64, S.num);
    else if (kucing) { /* kalimat permainan */ text(ctx, "📄", 0, 0, 1, {}); }
    text(ctx, cf.hide ? "KALIMAT" : S.label, BOX.x + (S.num != null ? 112 : 30), BOX.y - 18, 30, { weight: 900, color: C.ink2 });
    if (S.num != null && S.num !== "?") choiceBox(ctx, BOX.x + BOX.w - 300, BOX.y - 58, 280, 64, decided, { fresh: pre.v ? 1 : P(l, vT + 0.9, 0.6), pulse: cf.think });
    if (S.soal) {   // contoh dari soal: jawaban soal tertulis kecil
      const sx = BOX.x + BOX.w - 530; text(ctx, "Kata soal:", sx, BOX.y - 18, 28, { weight: 700, color: C.ink2 });
      sign(ctx, S.soal, sx + 250, BOX.y - 28, 220, 50, { size: 26 });
      if (cf.match) { const mu = P(l, at(b, cf.match), 0.6); if (mu > 0) { tick(ctx, sx + 395, BOX.y - 30, 44, mu, GREEN, 8); hand(ctx, "cocok", sx + 425, BOX.y - 18, 28, { color: GREEN, align: "left", alpha: mu }); } }
    }
    if (cf.hide) { text(ctx, "?", 960, 360, 90, { align: "center", weight: 900, color: "#C4CCD2" }); }
    let L = null;
    if (!cf.hide && show > 0) {
      ctx.save(); ctx.globalAlpha = show;
      const st = { mark, cur: flying || decided ? null : cur, write, ringU, dim: dimU, found: fk };
      L = drawWords(ctx, S, st, { cx: 960, cy: BOX.y + BOX.h / 2 + 4, w: BOX.w, size: 60, fitLong: true });
      ctx.restore();
    }

    // panel kiri: cocokkan
    const PX = 90, PY = cf.steps ? 470 : 500, PW = 810, PH = cf.steps ? 200 : 270;
    card(ctx, PX, PY, PW, PH, { fill: "#FFFFFF", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    const keysAlpha = cf.intro ? P(l, at(b, "kata \"kucing\""), 0.6) : 1;
    if (cf.keepGoing) {
      const u = P(l, at(b, cf.keepGoing), 0.6);
      hand(ctx, "Jangan berhenti di kata pertama!", PX + PW / 2, PY + 85, 40, { color: RED, alpha: u });
      hand(ctx, "Terus baca sampai akhir →", PX + PW / 2, PY + 150, 38, { color: INK, alpha: P(l, at(b, "kita baca setiap"), 0.6) });
    } else if (cf.note) noteBox(ctx, cf.note, l, b, PX, PY, PW, PH);
    else if (cf.note2 && decided) noteBox(ctx, cf.note2, l - vT - 1.0, b, PX, PY, PW, PH);
    else if (cf.caseNote) {
      text(ctx, "HURUF BESAR ATAU KECIL, KATANYA SAMA", PX + PW / 2, PY + 42, 24, { align: "center", weight: 900, color: C.ink2 });
      const u = P(l, at(b, "Huruf"), 0.6), v = P(l, at(b, "tetap sama"), 0.6);
      text(ctx, "Promo", PX + 200, PY + 140, 64, { align: "center", weight: 900, color: INK });
      ring(ctx, PX + 132, PY + 118, 34, 42, u, ORANGE, 5);
      ctx.save(); ctx.globalAlpha = v; text(ctx, "=", PX + 405, PY + 140, 70, { align: "center", weight: 900, color: GREEN }); ctx.restore();
      keyCard(ctx, "promo", PX + 600, PY + 118, 52, { alpha: Math.max(0.5, v) });
      ring(ctx, PX + 528, PY + 118, 30, 40, v, ORANGE, 5);
    } else if (cf.praise) {
      const u = P(l, at(b, "Hebat"), 0.5);
      hand(ctx, "Tidak menebak!", PX + PW / 2, PY + 90, 54, { color: GREEN, alpha: u });
      hand(ctx, "Baca semua kata, lalu cocokkan.", PX + PW / 2, PY + 160, 36, { color: INK, alpha: P(l, at(b, "Kita membaca"), 0.5) });
    } else if (cf.swap) {
      const u = P(l, at(b, cf.swap), 0.8);
      text(ctx, "KATA YANG DICARI", PX + PW / 2, PY + 44, 24, { align: "center", weight: 900, color: C.ink2 });
      keyCard(ctx, "kucing", PX + PW / 2, PY + 120, 46, { alpha: 1 - u });
      if (u > 0) { keyCard(ctx, "diskon", PX + PW / 2 - 150, PY + 120, 46, { alpha: u }); keyCard(ctx, "promo", PX + PW / 2 + 150, PY + 120, 46, { alpha: u }); }
    } else {
      const fresh = cur != null && !decided && !flying;
      const endU = cf.end ? P(l, at(b, cf.end), 0.6) : 0;
      if (endU > 0 && !decided) {
        text(ctx, "SUDAH DIBACA SAMPAI AKHIR", PX + PW / 2, PY + 44, 24, { align: "center", weight: 900, color: C.ink2 });
        ctx.save(); ctx.globalAlpha = endU;
        let x = PX + 60;
        S.keys.forEach((k, i) => { const w = keyCard(ctx, k, 0, -999, 40); keyCard(ctx, k, x + w / 2, PY + 120, 40, { crossed: endU }); x += w + 40; });
        hand(ctx, "tidak ketemu", x + 10, PY + 134, 40, { color: RED, align: "left" });
        ctx.restore();
      } else if (fresh) {
        const w = bare(S.words[cur]), key = isKey(S, cur), u = P(l, curT + 0.4, 0.4);
        text(ctx, "COCOKKAN", PX + PW / 2, PY + 40, 24, { align: "center", weight: 900, color: C.ink2 });
        const ww = tw(ctx, w, 50, 900) + 40, wx = PX + 30;
        ctx.fillStyle = "rgba(47,127,209,0.10)"; ctx.strokeStyle = BLUE; ctx.lineWidth = 4; rr(ctx, wx, PY + 82, Math.min(ww, 330), 80, 14); ctx.fill(); ctx.stroke();
        text(ctx, w, wx + Math.min(ww, 330) / 2, PY + 140, 50, { align: "center", weight: 900, color: INK, fit: 300 });
        const sx = wx + Math.min(ww, 330) + 50;
        ctx.save(); ctx.globalAlpha = u; text(ctx, key ? "=" : "≠", sx, PY + 142, 70, { align: "center", weight: 900, color: key ? GREEN : RED }); ctx.restore();
        let x = sx + 50;
        S.keys.forEach(k => { const cw = keyCard(ctx, k, 0, -999, 34); const hit = key && norm(S.words[cur]) === k; keyCard(ctx, k, x + cw / 2, PY + 122, 34, { glow: hit && u > 0.5, alpha: key && !hit ? 0.45 : 1 }); x += cw + 22; });
      } else {
        text(ctx, kucing ? "KATA YANG DICARI" : "KATA YANG DICARI", PX + PW / 2, PY + 44, 24, { align: "center", weight: 900, color: C.ink2 });
        ctx.save(); ctx.globalAlpha = keysAlpha;
        if (S.keys.length === 1) keyCard(ctx, S.keys[0], PX + PW / 2, PY + 120, 50);
        else { keyCard(ctx, "diskon", PX + PW / 2 - 170, PY + 120, 46); text(ctx, "atau", PX + PW / 2, PY + 134, 36, { align: "center", weight: 800, color: C.ink2 }); keyCard(ctx, "promo", PX + PW / 2 + 170, PY + 120, 46); }
        ctx.restore();
      }
    }

    // panel kanan: papan tujuan
    const TX = 940, TW = 890;
    if (cf.think) thinkPanel(ctx, l, b.dur, TX, PY, TW, PH);
    else if (kucing) basketPanel(ctx, l, b, cf, decided, vU, flying, TX, PY, TW, PH);
    else {
      const ya = decided === "ya" || (flying && fk >= 0), tidak = decided === "tidak" || (flying && fk < 0);
      const nums = n => (decided && ((decided === "ya") === n) ? [S.num != null ? S.num : ""] : (flying && (fk >= 0) === n ? [] : []));
      sign(ctx, "ya", TX + 205, PY + PH / 2, 400, 170, { glow: decided === "ya", nums: nums(true), shift: flying && fk >= 0 });
      sign(ctx, "tidak", TX + TW - 205, PY + PH / 2, 400, 170, { glow: decided === "tidak", nums: nums(false), shift: flying && fk < 0 });
      if (flying) {   // amplop terbang dari kotak kalimat ke papan
        const tx = fk >= 0 ? TX + 205 : TX + TW - 205, u = ease(vU), x = lerp(960, tx, u), y = lerp(BOX.y + BOX.h / 2, PY + PH / 2 + 46, u) - Math.sin(u * Math.PI) * 60;
        envelope(ctx, x, y, lerp(120, 60, u), S.num != null ? S.num : "");
      }
    }

    // lajur tiga langkah
    if (cf.steps) {
      let big = 0;
      if (cf.stepBig) big = cf.stepBig;
      else if (decided || flying) big = 3;
      else if (cur != null && foundNow) big = 2;
      else if (cur != null) big = 1;
      stepsStrip(ctx, big);
    }
  }

  function noteBox(ctx, kind, l, b, PX, PY, PW, PH) {
    if (kind === "piano") {
      // piano kecil + jam weker: hanya mengingatkan
      ctx.fillStyle = "#2B3440"; rr(ctx, PX + 40, PY + 70, 230, 100, 10); ctx.fill();
      ctx.fillStyle = "#fff"; for (let i = 0; i < 7; i++) { rr(ctx, PX + 50 + i * 30, PY + 105, 26, 58, 4); ctx.fill(); }
      ctx.fillStyle = "#2B3440"; for (const i of [0, 1, 3, 4, 5]) ctx.fillRect(PX + 69 + i * 30, PY + 105, 14, 34);
      alarm(ctx, PX + 320, PY + 115, 64);
      hand(ctx, "hanya mengingatkan", PX + 380, PY + 105, 34, { color: GREEN, align: "left", alpha: P(l, 0.4, 0.6) });
      hand(ctx, "tidak mengajak membeli", PX + 380, PY + 155, 30, { color: INK, align: "left", alpha: P(l, at(b, "Tidak ada"), 0.6) });
    } else if (kind === "antre") {
      for (let i = 0; i < 5; i++) { const x = PX + 70 + i * 70; kid(ctx, x, PY + 70, 52, { hair: i % 2 ? "long" : undefined }); }
      text(ctx, "5", PX + 210, PY + 50, 32, { align: "center", weight: 900, color: ORANGE });
      hand(ctx, "cepat-cepat beli!", PX + 440, PY + 110, 40, { color: RED, align: "left", alpha: P(l, at(b, "cepat-cepat"), 0.6) });
      hand(ctx, "cuma 5 pembeli pertama", PX + 440, PY + 160, 30, { color: INK, align: "left", alpha: P(l, at(b, "lima pembeli"), 0.6) });
    } else if (kind === "nasihat") {
      kiko(ctx, PX + 120, PY + 105, 120, 0, { mood: "happy" });
      hand(ctx, "Ini nasihat,", PX + 250, PY + 95, 44, { color: GREEN, align: "left", alpha: P(l, 0.4, 0.6) });
      hand(ctx, "bukan ajakan membeli.", PX + 250, PY + 155, 40, { color: GREEN, align: "left", alpha: P(l, at(b, "menasihati"), 0.6) });
    } else if (kind === "bingung") {
      kiko(ctx, PX + 120, PY + 105, 120, 0, { mood: "confused" });
      hand(ctx, "?", PX + 215, PY + 85, 70, { color: ORANGE, alpha: P(l, 0.1, 0.5) });
      hand(ctx, "Aturannya keliru!", PX + 270, PY + 95, 42, { color: RED, align: "left", alpha: P(l, 0.3, 0.6) });
      hand(ctx, "Ini bukan iklan.", PX + 270, PY + 155, 38, { color: INK, align: "left", alpha: P(l, 0.6, 0.6) });
    }
  }
  function alarm(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#E25B4B"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * s * 0.32, -s * 0.42, s * 0.16, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#E25B4B"; ctx.lineWidth = s * 0.1; ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = s * 0.06; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s * 0.26); ctx.moveTo(0, 0); ctx.lineTo(s * 0.18, s * 0.06); ctx.stroke();
    ctx.restore();
  }
  function thinkPanel(ctx, l, d, x, y, w, h) {
    card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    const frac = clamp(l / Math.max(1, d - 0.3), 0, 1), cx = x + 110, cy = y + h / 2;
    ctx.strokeStyle = "#E9DDBF"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(cx, cy, 68, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, 68, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = "#F4D58D"; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-24, -36); ctx.lineTo(24, -36); ctx.lineTo(4, 0); ctx.lineTo(24, 36); ctx.lineTo(-24, 36); ctx.lineTo(-4, 0); ctx.closePath(); ctx.stroke();
    const top = 1 - frac; ctx.beginPath(); ctx.moveTo(-20 * top, -32 + 28 * (1 - top)); ctx.lineTo(20 * top, -32 + 28 * (1 - top)); ctx.lineTo(0, -2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20 * frac - 2, 34); ctx.lineTo(20 * frac + 2, 34); ctx.lineTo(0, 34 - 28 * frac); ctx.closePath(); ctx.fill();
    ctx.restore();
    text(ctx, "PIKIRKAN DULU", x + 230, y + 80, 44, { weight: 900, color: C.accentDark });
    text(ctx, "Iklan, atau bukan iklan?", x + 230, y + 140, 36, { weight: 800, color: INK });
    text(ctx, "Baca setiap katanya pelan-pelan.", x + 230, y + 180, 26, { weight: 600, color: C.ink2 });
  }
  function catFace(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#F2A65A"; ctx.strokeStyle = "#7A4A1E"; ctx.lineWidth = 3;
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * s * 0.42, -s * 0.12); ctx.lineTo(k * s * 0.4, -s * 0.62); ctx.lineTo(k * s * 0.08, -s * 0.36); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.48, s * 0.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * s * 0.17, -s * 0.06, s * 0.05, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#D95F7A"; ctx.beginPath(); ctx.moveTo(-s * 0.05, s * 0.06); ctx.lineTo(s * 0.05, s * 0.06); ctx.lineTo(0, s * 0.12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2; for (const k of [-1, 1]) for (const d of [-0.04, 0.06]) { ctx.beginPath(); ctx.moveTo(k * s * 0.14, s * 0.1); ctx.lineTo(k * s * 0.5, s * (0.06 + d)); ctx.stroke(); }
    ctx.restore();
  }
  function basket(ctx, x, y, s, opt = {}) {   // keranjang bergambar kucing; x,y = pusat bibir atas
    ctx.save(); ctx.translate(x, y);
    if (opt.glow) { ctx.fillStyle = "rgba(238,122,18,0.22)"; ctx.beginPath(); ctx.ellipse(0, s * 0.35, s * 0.85, s * 0.6, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#C98A4B"; ctx.strokeStyle = "#7A4A1E"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-s * 0.7, 0); ctx.lineTo(s * 0.7, 0); ctx.lineTo(s * 0.55, s * 0.75); ctx.lineTo(-s * 0.55, s * 0.75); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(122,74,30,0.45)"; ctx.lineWidth = 3; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.7 + i * s * 0.035, i * s * 0.19); ctx.lineTo(s * 0.7 - i * s * 0.035, i * s * 0.19); ctx.stroke(); }
    ctx.fillStyle = "#A86B33"; ctx.strokeStyle = "#7A4A1E"; ctx.lineWidth = 4; rr(ctx, -s * 0.76, -s * 0.08, s * 1.52, s * 0.14, 6); ctx.fill(); ctx.stroke();
    ctx.restore();
    catFace(ctx, x, y + s * 0.42, s * 0.5);
  }
  function basketPanel(ctx, l, b, cf, decided, vU, flying, x, y, w, h) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    const bx = x + 190, by = y + 70, inside = decided === "ya";
    const bu = cf.intro ? P(l, at(b, "Aku punya"), 0.6) : 1;
    ctx.save(); ctx.globalAlpha = bu; basket(ctx, bx, by, 150, { glow: inside }); text(ctx, "keranjang kucing", bx, y + h - 16, 26, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
    if (inside) { ctx.save(); ctx.fillStyle = "#fff"; ctx.strokeStyle = INK; ctx.lineWidth = 3; rr(ctx, bx - 80, by - 44, 160, 40, 8); ctx.fill(); ctx.stroke(); text(ctx, "Kucing Sinta…", bx, by - 16, 22, { align: "center", weight: 800, color: INK }); ctx.restore(); }
    if (flying && cf.set === "W1") { const u = ease(vU), px = lerp(960, bx, u), py = lerp(335, by - 14, u) - Math.sin(u * Math.PI) * 110; ctx.save(); ctx.fillStyle = "#fff"; ctx.strokeStyle = INK; ctx.lineWidth = 3; rr(ctx, px - 90, py - 26, 180, 52, 10); ctx.fill(); ctx.stroke(); text(ctx, "Kucing Sinta…", px, py + 8, 24, { align: "center", weight: 800, color: INK }); ctx.restore(); }
    const tx = x + 360;
    if (inside) { hand(ctx, "masuk keranjang!", tx, y + 95, 42, { color: GREEN, align: "left" }); tick(ctx, tx + 170, y + 150, 50, 1, GREEN, 8); }
    if (decided === "tidak") { hand(ctx, "tidak masuk", tx, y + 95, 42, { color: RED, align: "left" }); hand(ctx, "keranjang kucing", tx, y + 145, 34, { color: RED, align: "left" }); cross(ctx, bx + 115, by + 10, 46, 1, RED, 8); }
    if (cf.intro) { hand(ctx, "ada kata kucing → masuk", tx, y + 120, 32, { color: INK, align: "left", alpha: P(l, at(b, "maka kalimat"), 0.6) }); }
  }

  const STEPS = [["Baca setiap kata"], ["Cari \"diskon\" atau \"promo\""], ["Ketemu: IKLAN. Tidak: BUKAN IKLAN"]];
  function stepsStrip(ctx, big) {
    const y = 700, h = 80, gap = 18; ctx.font = `800 28px ${K.FONT}`;
    const ws = STEPS.map(([s]) => ctx.measureText(s).width + 100), tot = ws.reduce((a, b) => a + b, 0) + gap * 2;
    let x = 960 - tot / 2;
    STEPS.forEach(([s], i) => {
      const on = big === i + 1;
      card(ctx, x, y, ws[i], h, { fill: on ? "#FFF1DF" : "#F3F6F8", stroke: on ? ORANGE : "#B8C3CA", lw: on ? 5 : 2.5, r: 40 });
      ctx.fillStyle = on ? ORANGE : C.kiko; ctx.beginPath(); ctx.arc(x + 40, y + h / 2, 26, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), x + 40, y + h / 2 + 11, 30, { align: "center", color: "#fff", weight: 900 });
      text(ctx, s, x + 78, y + h / 2 + 10, 28, { weight: 800, color: INK });
      x += ws[i] + gap;
    });
  }

  // ---------- adegan soal utuh ----------
  function pill(ctx, kind, x, y, w, h, alpha = 1) { sign(ctx, kind, x + w / 2, y + h / 2, w, h, { alpha, size: h * 0.5 }); }
  function soal(ctx, b, l, t, TL) {
    board(ctx);
    const n = { soal1: 1, soal2: 2, soal3: 3, soal4: 4, soal5: 5, soal6: 6, soal7: 7, soal8: 8 }[b.id];
    const ph = (k, s, d) => n > k ? 1 : n < k ? 0 : P(l, at(b, s), d || 0.6);
    // aturan
    const ru = n === 1 ? P(l, at(b, "sebuah aturan"), 0.6) : 1;
    ctx.save(); ctx.globalAlpha = ru;
    card(ctx, 80, 150, 860, 290, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "ATURAN", 110, 196, 28, { weight: 900, color: C.accentDark });
    ctx.restore();
    const a1 = ph(2, "Jika sebuah"), a2 = ph(2, "maka email itu adalah"), a3 = ph(2, "Jika tidak");
    ctx.save(); ctx.globalAlpha = a1;
    text(ctx, "Jika email berisi kata", 110, 250, 36, { weight: 800, color: INK });
    let x = 110; const w1 = keyCard(ctx, "diskon", 0, -999, 34); keyCard(ctx, "diskon", x + w1 / 2, 310, 34); x += w1 + 16;
    text(ctx, "atau", x, 322, 32, { weight: 800, color: C.ink2 }); x += 78;
    const w2 = keyCard(ctx, "promo", 0, -999, 34); keyCard(ctx, "promo", x + w2 / 2, 310, 34); x += w2 + 24;
    ctx.restore();
    ctx.save(); ctx.globalAlpha = a2; text(ctx, "maka", x, 322, 32, { weight: 800, color: C.ink2 }); pill(ctx, "ya", x + 100, 282, 180, 56); ctx.restore();
    ctx.save(); ctx.globalAlpha = a3; text(ctx, "Jika tidak, maka", 110, 405, 32, { weight: 800, color: C.ink2 }); pill(ctx, "tidak", 380, 368, 290, 56); ctx.restore();
    // contoh
    const cu = ph(3, "dua contoh");
    ctx.save(); ctx.globalAlpha = cu;
    card(ctx, 80, 460, 860, 240, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "CONTOH", 110, 504, 28, { weight: 900, color: C.accentDark });
    ctx.restore();
    [[3, "Diskon besar-besaran hari ini", "ya", "Contoh pertama", "Email ini adalah"], [4, "Besok ada pelajaran olahraga", "tidak", "Contoh kedua", "Email ini bukan"]].forEach(([k, s, v, p1, p2], i) => {
      const u = ph(k, p1), v2 = ph(k, p2); if (u <= 0) return;
      const y = 560 + i * 82;
      ctx.save(); ctx.globalAlpha = u; envelope(ctx, 140, y, 54, ""); text(ctx, "\"" + s + "\"", 185, y + 10, 28, { weight: 800, color: INK }); ctx.restore();
      ctx.save(); ctx.globalAlpha = v2; mline(ctx, [[688, y], [722, y]], 1, INK, 4, true); pill(ctx, v, 735, y - 25, v === "ya" ? 140 : 190, 50); ctx.restore();
    });
    // tiga email
    const eu = ph(5, "tiga email");
    ctx.save(); ctx.globalAlpha = eu;
    card(ctx, 970, 150, 870, 550, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "TIGA EMAIL YANG DIPERIKSA", 1000, 196, 28, { weight: 900, color: C.accentDark });
    ctx.restore();
    [[5, "E1", "Email pertama"], [6, "E2", "Email kedua"], [7, "E3", "Email ketiga"]].forEach(([k, id, p], i) => {
      const u = ph(k, p); if (u <= 0) return;
      const y = 225 + i * 155, S = SENT[id], s = S.words.join(" ");
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, 990, y, 830, 140, { fill: "#FFFFFF", stroke: n === k ? ORANGE : "#D3DADF", lw: n === k ? 4 : 2, r: 14 });
      envelope(ctx, 1050, y + 70, 70, S.num);
      const lines = wrap(ctx, s, 32, 800, 470), ly = y + 70 - (lines.length - 1) * 21 + 11;
      lines.forEach((ln, j) => text(ctx, ln, 1110, ly + j * 42, 32, { weight: 800, color: INK }));
      if (n === k) { const uu = clamp((l - at(b, "berbunyi")) / 3, 0, 1); lines.forEach((ln, j) => { const lw = tw(ctx, ln, 32, 800); mline(ctx, [[1110, ly + j * 42 + 12], [1110 + lw, ly + j * 42 + 12]], clamp(uu * lines.length - j, 0, 1), ORANGE, 4); }); }
      choiceBox(ctx, 1600, y + 40, 200, 60, null, { pulse: n === 8 && Math.sin(l * 5) > 0 });
      ctx.restore();
    });
    // pertanyaan
    if (n === 8) {
      const u = P(l, at(b, "Pertanyaannya"), 0.6);
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, 80, 718, 1760, 92, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "PERTANYAAN:", 110, 776, 30, { weight: 900, color: C.accentDark });
      text(ctx, "Email mana yang iklan, dan mana yang bukan iklan?", 350, 777, 36, { weight: 900, color: INK });
      ctx.restore();
    }
  }
  // soal untuk layar vertikal (Short): aturan di atas, tiga email di bawah; potong [460, 130, 1000, 700]
  function soal_v(ctx, b, l, t, TL) {
    board(ctx);
    card(ctx, 480, 150, 960, 230, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "ATURAN", 960, 196, 30, { align: "center", weight: 900, color: C.accentDark });
    let x = 520; const w1 = keyCard(ctx, "diskon", 0, -999, 40), w2 = keyCard(ctx, "promo", 0, -999, 40);
    const tot = w1 + 114 + w2 + 30 + 80 + 190; x = 960 - tot / 2;
    keyCard(ctx, "diskon", x + w1 / 2, 260, 40); x += w1 + 18; text(ctx, "atau", x, 274, 34, { weight: 800, color: C.ink2 }); x += 96;
    keyCard(ctx, "promo", x + w2 / 2, 260, 40); x += w2 + 30; mline(ctx, [[x, 260], [x + 60, 260]], 1, INK, 5, true); pill(ctx, "ya", x + 80, 230, 190, 60);
    text(ctx, "Tidak ada keduanya", 760, 350, 32, { align: "center", weight: 800, color: C.ink2 }); mline(ctx, [[930, 340], [990, 340]], 1, INK, 5, true); pill(ctx, "tidak", 1010, 312, 290, 56);
    ["E1", "E2", "E3"].forEach((id, i) => {
      const y = 400 + i * 140, S = SENT[id];
      card(ctx, 480, y, 960, 125, { fill: "#FFFFFF", stroke: "#D3DADF", lw: 2, r: 14 });
      envelope(ctx, 545, y + 62, 74, S.num);
      const lines = wrap(ctx, S.words.join(" "), 36, 800, 800), ly = y + 62 - (lines.length - 1) * 22 + 12;
      lines.forEach((ln, j) => text(ctx, ln, 605, ly + j * 44, 36, { weight: 800, color: INK }));
    });
  }

  // ---------- kata-kata penting ----------
  const KATA = [["email", "k1"], ["iklan", "k2"], ["diskon", "k3"], ["promo", "k4"], ["pengingat", "k5"]];
  function kata(ctx, b, l, t, TL) {
    board(ctx);
    const idx = KATA.findIndex(([, id]) => id === b.id);
    // kolom kiri: daftar kata
    card(ctx, 80, 150, 330, 660, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    text(ctx, "KATA PENTING", 245, 200, 26, { align: "center", weight: 900, color: C.accentDark });
    KATA.forEach(([w], i) => {
      const y = 260 + i * 108, on = i === idx, done = idx < 0 ? 0 : i < idx;
      const a = b.id === "k0" ? P(l, 0.5 + i * 0.35, 0.4) : (on || done ? 1 : 0.35);
      ctx.save(); ctx.globalAlpha = a;
      if (w === "diskon" || w === "promo") keyCard(ctx, w, 245, y + 30, 38, { glow: on });
      else { card(ctx, 135, y - 4, 220, 68, { fill: on ? "#FFF1DF" : "#FFFFFF", stroke: on ? ORANGE : "#B8C3CA", lw: on ? 4 : 2.5, r: 12 }); text(ctx, w, 245, y + 43, 38, { align: "center", weight: 900, color: INK }); }
      if (done) tick(ctx, 380, y + 30, 34, 1, GREEN, 6);
      ctx.restore();
    });
    if (idx < 0) { kiko(ctx, 1100, 520, 240, 0, { mood: "happy", wave: l }); hand(ctx, "Kenalan dulu, yuk!", 1100, 300, 56, { alpha: P(l, 0.3, 0.6) }); return; }
    const [w, id] = KATA[idx];
    text(ctx, w.charAt(0).toUpperCase() + w.slice(1), 1130, 230, 72, { align: "center", weight: 900, color: INK });
    mline(ctx, [[1130 - tw(ctx, w, 72, 900) / 2, 252], [1130 + tw(ctx, w, 72, 900) / 2, 252]], P(l, 0.2, 0.6), ORANGE, 7);
    const A = s => P(l, at(b, s), 0.6);
    if (id === "k1") {
      const u1 = A("Email adalah"), u2 = A("lewat HP");
      ctx.save(); ctx.globalAlpha = u1;
      envelope(ctx, 700, 470, 260, ""); ctx.fillStyle = "#E25B4B"; rr(ctx, 790, 400, 44, 50, 4); ctx.fill();
      text(ctx, "surat kertas", 700, 650, 36, { align: "center", weight: 800, color: INK });
      hand(ctx, "diantar pak pos", 700, 700, 32, { color: C.ink2, alpha: A("pak pos") });
      ctx.restore();
      ctx.save(); ctx.globalAlpha = u2;
      ctx.fillStyle = "#2B3440"; rr(ctx, 1420, 300, 240, 420, 34); ctx.fill(); ctx.fillStyle = "#F4F8FB"; rr(ctx, 1436, 340, 208, 340, 14); ctx.fill();
      envelope(ctx, 1540, 470, 140, "", { alpha: A("muncul di layar") > 0 ? 1 : 0.4 });
      text(ctx, "Email baru!", 1540, 600, 28, { align: "center", weight: 900, color: BLUE });
      text(ctx, "email", 1540, 770, 36, { align: "center", weight: 800, color: INK });
      ctx.restore();
      ctx.save(); ctx.globalAlpha = A("tidak memakai"); hand(ctx, "sama-sama surat", 1090, 430, 40, { color: ORANGE }); mline(ctx, [[900, 470], [1360, 470]], 1, ORANGE, 6, true); hand(ctx, "tanpa kertas", 1090, 540, 34, { color: C.ink2 }); ctx.restore();
    } else if (id === "k2") {
      const u1 = A("Iklan adalah"), u2 = A("pinggir jalan"), u3 = A("televisi");
      ctx.save(); ctx.globalAlpha = u1;
      // papan iklan pinggir jalan
      ctx.fillStyle = "#6B7780"; ctx.fillRect(620, 560, 16, 150); ctx.fillRect(880, 560, 16, 150);
      card(ctx, 520, 320, 480, 260, { fill: "#FFF6D6", stroke: INK, lw: 5, r: 10 });
      // es krim
      ctx.fillStyle = "#E9B66B"; ctx.beginPath(); ctx.moveTo(620, 450); ctx.lineTo(680, 450); ctx.lineTo(650, 560); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#F48FB1"; ctx.beginPath(); ctx.arc(650, 430, 40, 0, Math.PI * 2); ctx.fill();
      text(ctx, "Ayo beli!", 840, 440, 54, { align: "center", weight: 900, color: RED });
      text(ctx, "Es krim enak", 840, 500, 32, { align: "center", weight: 800, color: INK });
      ctx.restore();
      ctx.save(); ctx.globalAlpha = Math.max(u2 * 0, 0); ctx.restore();
      ctx.save(); ctx.globalAlpha = u3;
      ctx.fillStyle = "#2B3440"; rr(ctx, 1240, 340, 420, 290, 20); ctx.fill(); ctx.fillStyle = "#DCEEFB"; rr(ctx, 1262, 362, 376, 220, 10); ctx.fill();
      ctx.fillStyle = "#2B3440"; ctx.fillRect(1430, 630, 40, 50); rr(ctx, 1360, 676, 180, 18, 6); ctx.fill();
      text(ctx, "Beli sekarang!", 1450, 480, 46, { align: "center", weight: 900, color: RED });
      ctx.restore();
      hand(ctx, "mengajak kita membeli", 1090, 790, 40, { alpha: A("mengajak") });
    } else if (id === "k3") {
      // pensil + label harga
      ctx.save(); ctx.translate(760, 500); ctx.rotate(-0.35);
      ctx.fillStyle = "#F2C14E"; ctx.fillRect(-200, -26, 340, 52); ctx.fillStyle = "#F7D9A8"; ctx.beginPath(); ctx.moveTo(140, -26); ctx.lineTo(210, 0); ctx.lineTo(140, 26); ctx.closePath(); ctx.fill();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(190, -8); ctx.lineTo(210, 0); ctx.lineTo(190, 8); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#F48FB1"; ctx.fillRect(-240, -26, 40, 52);
      ctx.restore();
      const u1 = A("lima ribu"), u2 = A("dipotong menjadi");
      ctx.save(); ctx.globalAlpha = u1;
      card(ctx, 1110, 330, 330, 120, { fill: "#FFFFFF", stroke: INK, lw: 4, r: 14 });
      text(ctx, "Rp5.000", 1275, 412, 58, { align: "center", weight: 900, color: INK });
      if (u2 > 0) mline(ctx, [[1130, 390], [1420, 390]], u2, RED, 8);
      ctx.restore();
      ctx.save(); ctx.globalAlpha = u2;
      mline(ctx, [[1275, 470], [1275, 520]], 1, INK, 5, true);
      card(ctx, 1110, 540, 330, 120, { fill: "#E2F5E8", stroke: GREEN, lw: 5, r: 14 });
      text(ctx, "Rp3.000", 1275, 622, 58, { align: "center", weight: 900, color: GREEN });
      hand(ctx, "lebih murah!", 1560, 615, 44, { color: GREEN, align: "left" });
      ctx.restore();
      keyCard(ctx, "diskon", 1640, 390, 44, { alpha: A("Diskon artinya") });
      hand(ctx, "harga dipotong", 760, 760, 40, { alpha: A("dipotong,") });
    } else if (id === "k4") {
      const u = A("Misalnya");
      ctx.save(); ctx.globalAlpha = u;
      [0, 1, 2].forEach(i => {
        const x = 700 + i * 300, y = 470, gratis = i === 2;
        ctx.fillStyle = "#F5E1C0"; rr(ctx, x - 100, y - 30, 200, 120, 16); ctx.fill(); ctx.strokeStyle = "#B57A3A"; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = "#F48FB1"; rr(ctx, x - 100, y - 50, 200, 40, 14); ctx.fill(); ctx.fillStyle = "#D7263D"; ctx.beginPath(); ctx.arc(x, y - 66, 16, 0, Math.PI * 2); ctx.fill();
        const gu = gratis ? A("satu kue gratis") : A("membeli dua");
        ctx.save(); ctx.globalAlpha *= gu;
        if (gratis) { ctx.fillStyle = "#1E9E50"; rr(ctx, x - 90, y + 110, 180, 56, 28); ctx.fill(); text(ctx, "GRATIS", x, y + 150, 34, { align: "center", weight: 900, color: "#fff" }); }
        else { ctx.fillStyle = "#56636D"; rr(ctx, x - 80, y + 110, 160, 56, 28); ctx.fill(); text(ctx, "bayar", x, y + 150, 32, { align: "center", weight: 900, color: "#fff" }); }
        ctx.restore();
      });
      ctx.restore();
      keyCard(ctx, "promo", 1640, 330, 44, { alpha: A("Promo adalah") });
      hand(ctx, "tawaran khusus supaya orang membeli", 1000, 330, 36, { alpha: A("tawaran"), color: ORANGE });
      hand(ctx, "beli 2, gratis 1", 1000, 760, 44, { alpha: A("satu kue gratis") });
    } else if (id === "k5") {
      alarm(ctx, 760, 500, 230);
      ctx.save(); ctx.globalAlpha = A("mengingatkan"); ctx.translate(1300, 480); ctx.rotate(0.04);
      ctx.fillStyle = "#FFF3A6"; ctx.fillRect(-200, -150, 400, 300); ctx.fillStyle = "#F2D65E"; ctx.fillRect(-200, -150, 400, 30);
      text(ctx, "Jangan lupa!", 0, -40, 50, { align: "center", weight: 900, color: INK });
      text(ctx, "Besok bawa", 0, 30, 38, { align: "center", weight: 700, color: INK }); text(ctx, "buku gambar.", 0, 80, 38, { align: "center", weight: 700, color: INK });
      ctx.restore();
      hand(ctx, "supaya tidak lupa", 1090, 780, 40, { alpha: A("tidak lupa") });
    }
  }

  // ---------- memahami aturan ----------
  function aturan(ctx, b, l, t, TL) {
    board(ctx);
    const n = { u1: 1, u2: 2, u3: 3 }[b.id], A = s => P(l, at(b, s), 0.6);
    text(ctx, "ATURAN", 960, 200, 34, { align: "center", weight: 900, color: C.accentDark });
    // baris 1: [diskon] atau [promo] -> IKLAN
    const r1 = n === 1 ? A("Jika sebuah") : 1;
    ctx.save(); ctx.globalAlpha = r1;
    text(ctx, "JIKA ada", 150, 335, 46, { weight: 900, color: INK });
    const g = n === 2 ? (Math.sin(l * 3) > 0 ? 0 : 1) : -1, alt = n === 2 && l > at(b, "Cukup ada");
    keyCard(ctx, "diskon", 520, 318, 50, { glow: alt && g === 0 });
    text(ctx, "atau", 735, 336, 46, { align: "center", weight: 900, color: n === 2 ? ORANGE : C.ink2 });
    keyCard(ctx, "promo", 940, 318, 50, { glow: alt && g === 1 });
    ctx.restore();
    if (n === 2) ring(ctx, 735, 320, 72, 44, A("Kata \"atau\""), ORANGE, 6);
    const r2 = n === 1 ? A("maka email") : 1;
    ctx.save(); ctx.globalAlpha = r2; mline(ctx, [[1100, 318], [1260, 318]], 1, INK, 7, true); sign(ctx, "ya", 1500, 318, 380, 130, { glow: alt }); ctx.restore();
    if (n === 2) {
      hand(ctx, "cukup salah satu!", 735, 450, 48, { alpha: A("Cukup ada") });
      hand(ctx, "tidak perlu keduanya", 735, 510, 36, { color: INK, alpha: A("tidak perlu") });
    }
    // baris 2: tidak ada keduanya -> BUKAN IKLAN
    if (n === 3) {
      const u = A("Jika kita");
      ctx.save(); ctx.globalAlpha = u;
      text(ctx, "JIKA TIDAK ada", 150, 595, 46, { weight: 900, color: INK });
      keyCard(ctx, "diskon", 650, 578, 46, { crossed: A("tidak menemukan kata \"diskon\"") });
      text(ctx, "dan", 830, 595, 42, { align: "center", weight: 900, color: C.ink2 });
      keyCard(ctx, "promo", 1000, 578, 46, { crossed: A("tidak menemukan kata \"promo\"") });
      ctx.restore();
      ctx.save(); ctx.globalAlpha = A("maka email"); mline(ctx, [[1130, 578], [1260, 578]], 1, INK, 7, true); sign(ctx, "tidak", 1500, 578, 380, 130); ctx.restore();
    }
  }

  // ---------- tiga langkah (besar) ----------
  function langkah(ctx, b, l, t, TL) {
    board(ctx);
    const gen = b.id === "p4";
    text(ctx, "TIGA LANGKAH", 960, 200, 40, { align: "center", weight: 900, color: C.accentDark });
    const R = gen ? [["Baca setiap kata sampai akhir.", "Pertama,"], ["Cari kata yang ada di aturan.", "Kedua,"], ["Putuskan sesuai aturan.", "Ketiga,"]]
                  : [["Baca setiap kata dari awal sampai akhir.", "Langkah satu"], ["Cari kata \"diskon\" atau \"promo\".", "Langkah dua"], ["Ketemu: IKLAN. Tidak ketemu: BUKAN IKLAN.", "Langkah tiga"]];
    R.forEach(([s, ph], i) => {
      if (b.id === "u8" && i === 2) return;
      const u = b.id === "u9" && i < 2 ? 1 : P(l, at(b, ph), 0.6); if (u <= 0) return;
      const y = 250 + i * 175;
      ctx.save(); ctx.globalAlpha = u; card(ctx, 200, y, 1520, 140, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 3, r: 70 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(275, y + 70, 48, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), 275, y + 90, 56, { align: "center", color: "#fff", weight: 900 });
      if (i === 2 && !gen) {
        text(ctx, "Ketemu:", 360, y + 88, 48, { weight: 900, color: INK }); sign(ctx, "ya", 700, y + 70, 260, 90, { size: 42 });
        text(ctx, "Tidak ketemu:", 880, y + 88, 48, { weight: 900, color: INK }); sign(ctx, "tidak", 1460, y + 70, 380, 90, { size: 42 });
      } else text(ctx, s, 360, y + 88, 52, { weight: 900, color: INK, fit: 1120 });
      // ikon kecil
      if (i === 0 && !(i === 2)) magnifier(ctx, 1600, y + 64, 44, 38);
      if (i === 1) { if (gen) keyCard(ctx, "kata", 1610, y + 70, 36); }
      ctx.restore();
    });
  }

  // ---------- memeriksa jawaban ----------
  function ringkas(ctx, b, l, t, TL) {
    board(ctx);
    const n = { r1: 1, r2: 2, r3: 3 }[b.id], A = s => P(l, at(b, s), 0.6);
    [["E1", "Email pertama adalah", "ya", "kata \"promo\""], ["E2", "Email kedua bukan", "tidak", "Email kedua tidak"], ["E3", "Email ketiga adalah", "ya", "kata \"diskon\""]].forEach(([id, p, v, p2], i) => {
      const S = SENT[id], y = 160 + i * 215;
      card(ctx, 90, y, 1740, 195, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
      envelope(ctx, 170, y + 97, 96, S.num);
      const hl = n === 2 ? A(p2) : n > 2 ? 1 : 0;
      const st = { mark: {}, cur: null }; const fk = firstKey(S); if (fk >= 0 && hl > 0) st.mark[fk] = hl;
      drawWords(ctx, S, st, { cx: 820, cy: y + 97, w: 1240, size: id === "E3" ? 40 : 48 });
      if (id === "E2" && hl > 0) hand(ctx, "tidak ada diskon atau promo", 820, y + 175, 30, { color: RED, alpha: hl });
      const u = n === 1 ? A(p) : 1;
      choiceBox(ctx, 1460, y + 62, 260, 70, u > 0 ? v : null, { fresh: u });
      if (n === 3) tick(ctx, 1775, y + 97, 56, P(l, 0.6 + i * 0.6, 0.5), GREEN, 9);
    });
  }

  // ---------- penutup ----------
  function jikamaka(ctx, b, l, t, TL) {
    board(ctx);
    const A = s => P(l, at(b, s), 0.6);
    text(ctx, "Aturan \"jika, maka\"", 960, 230, 64, { align: "center", weight: 900, color: INK });
    ctx.save(); ctx.globalAlpha = A("Jika ada");
    card(ctx, 180, 330, 700, 330, { fill: "#FFF8E0", stroke: YELS, lw: 4, r: 24 });
    text(ctx, "JIKA", 530, 400, 54, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, "ada kata", 530, 470, 40, { align: "center", weight: 800, color: INK });
    keyCard(ctx, "diskon", 380, 565, 42); text(ctx, "atau", 530, 578, 32, { align: "center", weight: 800, color: C.ink2 }); keyCard(ctx, "promo", 680, 565, 42);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = A("maka kita"); mline(ctx, [[900, 495], [1020, 495]], 1, INK, 8, true);
    card(ctx, 1040, 330, 700, 330, { fill: "#FDECEC", stroke: RED, lw: 4, r: 24 });
    text(ctx, "MAKA", 1390, 400, 54, { align: "center", weight: 900, color: RED });
    sign(ctx, "ya", 1390, 540, 380, 130);
    ctx.restore();
  }
  function phone(ctx, x, y, w, h) {
    ctx.fillStyle = "#2B3440"; rr(ctx, x, y, w, h, 40); ctx.fill(); ctx.fillStyle = "#F4F8FB"; rr(ctx, x + 16, y + 50, w - 32, h - 86, 16); ctx.fill();
    ctx.fillStyle = "#56636D"; rr(ctx, x + w / 2 - 40, y + 20, 80, 10, 5); ctx.fill();
  }
  function hp(ctx, b, l, t, TL) {
    board(ctx);
    kiko(ctx, 260, 560, 200, 0, { mood: "happy" });
    const PX = 620, PY = 150, PW = 520, PH = 670;
    phone(ctx, PX, PY, PW, PH);
    text(ctx, "Kotak Masuk", PX + 40, PY + 100, 32, { weight: 900, color: INK });
    const M = [["Pengingat: besok les piano.", false], ["Promo khusus anggota baru.", true], ["Besok ada pelajaran olahraga", false], ["Dapatkan diskon dengan mudah…", true], ["Diskon besar-besaran hari ini", true]];
    // folder Promosi
    const FX = 1330, FY = 300;
    ctx.fillStyle = "#F2C14E"; rr(ctx, FX, FY + 30, 420, 300, 18); ctx.fill(); ctx.fillStyle = "#E0A800"; rr(ctx, FX, FY, 180, 60, 14); ctx.fill();
    text(ctx, "Promosi", FX + 210, FY + 120, 48, { align: "center", weight: 900, color: INK });
    const t0 = b.id === "p3" ? at(b, "dipindahkan") : Infinity;
    let row = 0, inF = 0;
    M.forEach(([s, ad], i) => {
      const appear = b.id === "p2" ? P(l, at(b, "memilah") + i * 0.4, 0.4) : 1;
      const mv = ad ? clamp((l - t0 - inF * 0.6) / 0.9, 0, 1) : 0;
      const ry = PY + 130 + row * 100, fy = FY + 150 + inF * 52;
      if (ad) inF++;
      const x = lerp(PX + 30, FX + 30, ease(mv)), y = lerp(ry, fy, ease(mv)), w = lerp(PW - 60, 360, ease(mv)), h = lerp(84, 44, ease(mv));
      if (!ad || mv < 1) row += (ad && mv > 0.5) ? 0 : 1;
      ctx.save(); ctx.globalAlpha = appear;
      card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: ad && b.id === "p3" && l > at(b, "berisi iklan") ? ORANGE : "#D3DADF", lw: 2.5, r: 10 });
      text(ctx, s, x + 14, y + h / 2 + (h > 60 ? 10 : 8), h > 60 ? 26 : 20, { weight: 800, color: INK, fit: w - 28 });
      ctx.restore();
    });
    hand(ctx, "otomatis!", 1540, 720, 48, { alpha: b.id === "p2" ? P(l, at(b, "otomatis"), 0.6) : 1 });
  }
  function keliru(ctx, b, l, t, TL) {
    board(ctx);
    const A = s => P(l, at(b, s), 0.6);
    // amplop email nasihat + kata "promo" saja yang dilihat komputer
    card(ctx, 100, 170, 980, 260, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    const S = SENT.Q, st = { mark: { 5: 1 }, cur: null };
    drawWords(ctx, S, st, { cx: 590, cy: 300, w: 980, size: 44 });
    // monitor komputer: hanya mencocokkan kata
    ctx.fillStyle = "#2B3440"; rr(ctx, 1180, 170, 600, 380, 24); ctx.fill(); ctx.fillStyle = "#F4F8FB"; rr(ctx, 1204, 194, 552, 300, 12); ctx.fill();
    ctx.fillStyle = "#2B3440"; ctx.fillRect(1460, 550, 40, 40); rr(ctx, 1390, 586, 180, 18, 6); ctx.fill();
    ctx.save(); ctx.globalAlpha = A("Komputer tidak");
    keyCard(ctx, "promo", 1340, 300, 40); text(ctx, "=", 1450, 315, 50, { align: "center", weight: 900, color: INK }); sign(ctx, "ya", 1600, 300, 230, 80, { size: 36 });
    text(ctx, "arti kalimat?", 1480, 420, 36, { align: "center", weight: 800, color: GRAYT }); hand(ctx, "tidak mengerti", 1480, 470, 32, { color: RED });
    ctx.restore();
    hand(ctx, "Komputer hanya mencocokkan kata.", 590, 510, 46, { alpha: A("hanya mencocokkan") });
    // orang yang membuat aturan
    ctx.save(); ctx.globalAlpha = A("orang yang membuat");
    kid(ctx, 300, 600, 90, {}); H.bubble(ctx, 420, 690, 520, "Aturanku harus dibuat dengan teliti.", 32, { tailX: 440 });
    ctx.restore();
  }

  // ---------- pembuka dan penutup ----------
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan B01, tanpa aksesori)
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = FUR2; ctx.beginPath(); ctx.ellipse(0, 30, 19, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  // Kiko memegang papan BUKAN IKLAN (kiri) dan IKLAN (kanan), seperti robot di soal asli
  function kikoSigns(ctx, x, y, s, l) {
    kiko(ctx, x, y, s, 0, { mood: "happy" });
    ctx.strokeStyle = C.kikoDark; ctx.lineWidth = s * 0.07; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - s * 0.36, y - s * 0.02); ctx.lineTo(x - s * 0.62, y - s * 0.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s * 0.36, y - s * 0.2); ctx.lineTo(x + s * 0.5, y - s * 0.6); ctx.stroke();
    ctx.save(); ctx.translate(x - s * 0.9, y - s * 0.12); ctx.rotate(-0.28 + Math.sin(l * 2) * 0.03);
    sign(ctx, "tidak", 0, 0, s * 1.05, s * 0.3, { size: s * 0.13 }); ctx.restore();
    ctx.save(); ctx.translate(x + s * 0.55, y - s * 0.72); ctx.rotate(0.1 + Math.sin(l * 2 + 1) * 0.03);
    sign(ctx, "ya", 0, 0, s * 0.75, s * 0.3, { size: s * 0.14 }); ctx.restore();
  }
  function flagLT(ctx, x, y, w) {   // bendera Lituania: kuning, hijau, merah
    const h = w * 0.6;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    [["#FDB913", 0], ["#006A44", 1], ["#C1272D", 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(x, y + i * h / 3, w, h / 3 + 0.5); });
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  Object.assign(K.SCENES, {
    periksa, soal, soal_v, kata, aturan, langkah, ringkas, jikamaka, hp, keliru,
    buka(ctx, b, l, t, TL) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
      if (!first) hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
      kikoSigns(ctx, 400, 600, 200, l);
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
      const fu = P(l, at(b, "Lituania"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagLT(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"]];
      if (META.asli) rows.push(["Judul asli", META.asli, "berjudul"]);
      rows.push(["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]);
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Judul asli" || k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const ri = rows.findIndex(r => r[0] === "Dibuat oleh"), au = P(l, at(b, "Lituania"), 0.8);
      if (au > 0) ring(ctx, 1190, 300 + ri * 92 - 14, 220, 44, au);
    },
    akhir(ctx, b, l, t, TL) {
      board(ctx);
      kikoSigns(ctx, 420, 520, 220, l);
      [760, 960].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
      card(ctx, 1120, 170, 710, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1475, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.asli || META.judul]];
      if (META.asli) L.push(["", "(" + META.judul + ")"]);
      L.push(["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]);
      L.forEach(([k, v], i) => { const y = 310 + i * 66; if (k) text(ctx, k, 1160, y, 28, { weight: 700, color: C.ink2 }); text(ctx, v, 1380, y, 32, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 420 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1475, 680, 26, 620, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 860, 720, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l, t, TL) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Aturan \"jika, maka\" langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kikoSigns(ctx, 960, 680, 170, l);
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
