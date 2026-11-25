/* SG08 Pembahasan Soal Bebras 2017-SK-10 "Robot Pengecat Pagar" (Slowakia), kategori Siaga (kelas 4–6 SD).
   Papan tulis + simulasi: pagar 17 papan, empat kaleng cat dengan angka sisa, robot pengecat yang bergerak
   papan demi papan. Urutan pengecatan dihitung ulang di kode (harus 15 papan, M-H-K-B-M-H-K-B-M-H-K-M-K-M-K)
   dan dilaporkan lewat K._warn bila berbeda. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, para, card, kiko, clamp, lerp, rr } = H;
  const { INK, ORANGE, GREEN, RED, BLUE, GREY, at, P, board, mline, tick, cross, ring, hand, tw, alpha, thinkBadge, noteCard, letter, beaver } = B;
  const META = { judul: "Robot Pengecat Pagar", tahun: "2017", negara: "Slowakia", kode: "2017-SK-10", flag: "SK", sumber: "Buku Tantangan Bebras Indonesia 2017", bukaFrasa: "lomba",
    tingkat: "kelas 4, 5, dan 6 SD (Siaga)",
    langkah: ["Pahami setiap aturan, termasuk kapan harus berhenti.", "Jalankan aturannya langkah demi langkah, catat perubahannya.", "Periksa jawabanmu dengan pilihan yang ada."],
    cta: "Kapan robot harus berhenti?", gambarUlang: "Pagar, kaleng, dan robot digambar ulang untuk video ini." };

  // ---------- data soal dan simulasi ----------
  const NAMA = ["merah", "hijau", "kuning", "biru"], COL = ["#E0473B", "#3FA34D", "#F2C230", "#3B78D8"], DARK = ["#A62E25", "#2A7536", "#B98F12", "#28559E"];
  const CAP = [5, 3, 7, 2], NPLANK = 17;
  const STEPS = (() => {   // aturan soal: urutan M-H-K-B berputar, kaleng kosong dibuang, papan bersebelahan tidak boleh sama
    const left = CAP.slice(), out = []; let i = 0, last = -1;
    for (;;) {
      let f = -1;
      for (let k = 0; k < 4; k++) { const c = (i + k) % 4; if (left[c] > 0 && c !== last) { f = c; i = (c + 1) % 4; break; } }
      if (f < 0) break;
      left[f]--; last = f; out.push({ c: f, left: left.slice() });
    }
    return out;
  })();
  if (STEPS.length !== 15 || STEPS.map(s => "MHKB"[s.c]).join("") !== "MHKBMHKBMHKMKMK") (K._warn = K._warn || []).push("simulasi salah: " + STEPS.map(s => "MHKB"[s.c]).join(""));

  // langkah pengecatan per beat: [nomor papan (1..), frasa di narasi]
  const PAINT = {
    s1: [[1, "Papan pertama"], [2, "Papan kedua"], [3, "Papan ketiga"], [4, "Papan keempat"]],
    s3: [[5, "Papan kelima"], [6, "Papan keenam"], [7, "Papan ketujuh"], [8, "Papan kedelapan"]],
    s5: [[9, "Papan kesembilan"], [10, "Papan kesepuluh"]],
    s6: [[11, "Papan kesebelas"], [12, "Papan kedua belas"]],
    s7: [[13, "Papan ketiga belas"], [14, "Papan keempat belas"]],
    s9: [[15, "papan kelima belas"]],
  };
  // kaleng dibuang: [kaleng, beat, frasa silang, frasa buang]
  const THROW = [[3, "s3", "Kaleng biru habis", null], [1, "s5", "Kaleng hijau juga habis", "kaleng hijau dibuang"], [0, "s7", "Kaleng merah habis", "lalu dibuang"]];
  const ORDER = ["soal1", "soal2", "soal3", "soal4", "soal5", "soal6", "soal7", "w1", "w4", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "j1", "j2", "c3"];
  const ix = id => ORDER.indexOf(id);
  // banyak papan yang sudah dicat (pecahan = sedang dicat) pada beat b, detik l
  function painted(b, l) {
    let n = 0; const k = ix(b.id);
    Object.entries(PAINT).forEach(([id, arr]) => {
      if (ix(id) < k) n = Math.max(n, arr[arr.length - 1][0]);
      else if (id === b.id) arr.forEach(([p, ph]) => { const u = clamp((l - at(b, ph)) / 0.9, 0, 1); if (u > 0) n = Math.max(n, p - 1 + u); });
    });
    return n;
  }
  // keadaan kaleng: silang (0..1), buang (0..1)
  function canState(b, l, c) {
    const T = THROW.find(t => t[0] === c); if (!T) return { x: 0, gone: 0 };
    const [, id, ph1, ph2] = T, k = ix(b.id), kt = ix(id);
    if (k < kt) return { x: 0, gone: 0 };
    if (k > kt) return { x: 1, gone: 1 };
    const x = P(l, at(b, ph1) + 0.3, 0.5), gone = ph2 ? P(l, at(b, ph2) + 0.4, 0.6) : 0;
    return { x, gone };
  }
  function leftAt(n) { const s = Math.floor(n); return s <= 0 ? CAP.slice() : STEPS[s - 1].left; }

  // ---------- gambar ----------
  const PX = i => 100 + i * 100, PW = 88, PT = 430, PB = 664;   // papan ke-i (0..16)
  function plank(ctx, x, top, bot, w, fill, frac, colIdx) {
    const shape = () => { ctx.beginPath(); ctx.moveTo(x, top + 26); ctx.lineTo(x + w / 2, top); ctx.lineTo(x + w, top + 26); ctx.lineTo(x + w, bot); ctx.lineTo(x, bot); ctx.closePath(); };
    shape(); ctx.fillStyle = "#E3B98A"; ctx.fill();
    ctx.save(); shape(); ctx.clip();
    ctx.strokeStyle = "rgba(156,107,63,0.35)"; ctx.lineWidth = 2;
    for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x + w * k / 3, top + 20); ctx.lineTo(x + w * k / 3 + 4, bot); ctx.stroke(); }
    if (frac > 0 && colIdx >= 0) { ctx.fillStyle = COL[colIdx]; ctx.fillRect(x - 2, top - 2, w + 4, (bot - top + 4) * clamp(frac, 0, 1)); }
    ctx.restore();
    shape(); ctx.strokeStyle = "#8F5E35"; ctx.lineWidth = 3; ctx.stroke();
  }
  function fence(ctx, n, opt = {}) {
    const vis = opt.vis || (() => 1);
    ctx.fillStyle = "#B98458"; ctx.fillRect(PX(0) - 20, 500, PX(NPLANK - 1) + PW - PX(0) + 40, 18); ctx.fillRect(PX(0) - 20, 596, PX(NPLANK - 1) + PW - PX(0) + 40, 18);
    for (let i = 0; i < NPLANK; i++) alpha(ctx, vis(i), () => {
      const frac = clamp(n - i, 0, 1), c = i < STEPS.length ? STEPS[i].c : -1;
      plank(ctx, PX(i), PT, PB, PW, 0, frac, c);
      const hl = opt.hl && opt.hl(i);
      ctx.fillStyle = hl ? ORANGE : "#FFFFFF"; ctx.beginPath(); ctx.arc(PX(i) + PW / 2, 632, 20, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#8F5E35"; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, String(i + 1), PX(i) + PW / 2, 641, 22, { align: "center", weight: 900, color: hl ? "#fff" : INK });
      if (opt.q && opt.q(i)) text(ctx, "?", PX(i) + PW / 2, 570, 60, { align: "center", weight: 900, color: ORANGE });
    });
  }
  function bot(ctx, x, y, s, c, paint) {   // robot pengecat kecil: badan kotak abu, roda, lengan berkuas
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
    ctx.fillStyle = "#5C6670"; ctx.beginPath(); ctx.arc(-26, 40, 13, 0, Math.PI * 2); ctx.arc(26, 40, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#AEB8C1"; rr(ctx, -42, -8, 84, 50, 10); ctx.fill(); ctx.strokeStyle = "#4A545D"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#CDD5DB"; rr(ctx, -30, -50, 60, 40, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1F2A33"; ctx.beginPath(); ctx.arc(-12, -30, 6, 0, Math.PI * 2); ctx.arc(12, -30, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#4A545D"; ctx.lineWidth = 6; ctx.lineCap = "round"; const sw = paint ? Math.sin(paint * 14) * 10 : 0;
    ctx.beginPath(); ctx.moveTo(40, 6); ctx.lineTo(62, -30 + sw); ctx.stroke();
    ctx.fillStyle = c >= 0 ? COL[c] : "#8F5E35"; rr(ctx, 54, -52 + sw, 18, 26, 4); ctx.fill();
    ctx.restore();
  }
  const CANX = i => 110 + i * 170, CANY = 180;
  function can(ctx, x, y, i, left, st = {}) {
    const w = 120, h = 130, g = st.gone || 0;
    ctx.save(); ctx.globalAlpha *= 1 - 0.65 * g; ctx.translate(0, g * 30);
    ctx.fillStyle = "#C7CED4"; rr(ctx, x, y + 14, w, h - 14, 12); ctx.fill(); ctx.strokeStyle = "#6B7780"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = COL[i]; rr(ctx, x + 8, y + 40, w - 16, h - 52, 8); ctx.fill();
    ctx.fillStyle = "#9AA4AC"; ctx.beginPath(); ctx.ellipse(x + w / 2, y + 14, w / 2, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    text(ctx, String(left), x + w / 2, y + 112, 58, { align: "center", weight: 900, color: i === 2 ? INK : "#fff" });
    text(ctx, NAMA[i], x + w / 2, y + h + 34, 28, { align: "center", weight: 800, color: DARK[i] });
    for (let k = 0; k < CAP[i]; k++) { const qx = x + 4 + k * 16.5, qy = y + h + 48; ctx.fillStyle = k < left ? COL[i] : "#fff"; ctx.strokeStyle = DARK[i]; ctx.lineWidth = 2; rr(ctx, qx, qy, 13, 13, 3); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    if (st.x > 0) cross(ctx, x + w / 2, y + 70 + g * 30, 110, st.x, RED, 9);
    if (st.ring > 0) ring(ctx, x + w / 2, y + 90, 92, 120, st.ring, ORANGE, 6);
  }
  function cans(ctx, n, b, l, opt = {}) {
    const left = leftAt(n);
    for (let i = 0; i < 4; i++) {
      const a = opt.appear ? opt.appear(i) : 1; if (a <= 0) continue;
      alpha(ctx, a, () => can(ctx, CANX(i), CANY, i, left[i], Object.assign(canState(b, l, i), { ring: opt.ring ? opt.ring(i) : 0 })));
    }
  }
  // urutan warna (lingkaran kecil) di panel kanan; warna yang dibuang dicoret
  function orderRow(ctx, x, y, b, l, opt = {}) {
    text(ctx, "Urutan warna", x, y, 30, { weight: 900, color: C.accentDark });
    for (let i = 0; i < 4; i++) {
      const cx = x + 40 + i * 150, cy = y + 60, st = canState(b, l, i);
      alpha(ctx, opt.a ? opt.a(i) : 1, () => {
        ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fill();
        if (i < 3) mline(ctx, [[cx + 40, cy], [cx + 108, cy]], 1, INK, 5, true);
        if (st.x > 0) cross(ctx, cx, cy, 70, st.x, RED, 7);
      });
    }
    alpha(ctx, opt.loop == null ? 1 : opt.loop, () => {
      mline(ctx, [[x + 490, y + 95], [x + 490, y + 120], [x + 40, y + 120], [x + 40, y + 98]], 1, INK, 5, true);
      text(ctx, "kembali ke merah", x + 265, y + 155, 26, { align: "center", weight: 800, color: C.ink2 });
    });
  }
  const OPTS = ["8", "17", "15", "5"];
  function optionsRow(ctx, x, y, marks = {}) {
    OPTS.forEach((o, i) => {
      const cx = x + i * 250;
      letter(ctx, "ABCD"[i], cx + 26, y - 14, 24, false);
      text(ctx, o + " papan", cx + 60, y, 34, { weight: 800, color: INK });
      const m = marks[i]; if (!m) return;
      if (m.k === "x") { mline(ctx, [[cx, y - 12], [cx + 215, y - 12]], m.u, RED, 5); }
      if (m.k === "ok") ring(ctx, cx + 100, y - 12, 125, 34, m.u, GREEN, 5);
    });
  }

  // ---------- adegan utama ----------
  function pagar(ctx, b, l) {
    board(ctx);
    const id = b.id, k = ix(id), n = painted(b, l);
    // pagar
    const fopt = {};
    if (id === "soal1") fopt.vis = i => P(l, 0.6 + i * 0.12, 0.3);
    if (id === "s2") fopt.q = i => i >= 4 && i < 8;
    if (id === "s8") fopt.q = i => i === 14;
    if (id === "j1") { const t0 = at(b, "Ada lima belas"); fopt.hl = i => i < 15 && l > t0 - 1.2 + i * 0.09 && l < at(b, "Jadi") + 99; }
    fence(ctx, n, fopt);
    if (id === "s9") { const t = at(b, "papan berikutnya"); alpha(ctx, P(l, t, 0.4), () => text(ctx, "?", PX(15) + PW / 2, 570, 60, { align: "center", weight: 900, color: ORANGE })); cross(ctx, PX(15) + PW / 2, 550, 80, P(l, at(b, "Robot pun berhenti"), 0.5), RED, 8); }
    if (k >= ix("j1")) cross(ctx, PX(15) + PW / 2, 550, 80, 1, RED, 8);
    // robot
    if (k >= ix("soal2") && id !== "soal1") {
      const cur = Math.min(15, Math.max(0, Math.ceil(n) - 1)), painting = n % 1 > 0 ? n % 1 : 0;
      const ra = id === "soal2" ? P(l, at(b, "Sebuah robot"), 0.5) : 1;
      const stop = (id === "s9" && l > at(b, "Robot pun berhenti")) || k >= ix("j1");
      alpha(ctx, ra, () => bot(ctx, PX(cur) + PW / 2 - 20, 714, 90, n > 0 ? STEPS[Math.max(0, Math.ceil(n) - 1)].c : -1, painting));
      if (stop && id !== "c3") hand(ctx, "STOP", PX(14) + PW / 2 + 140, 735, 40, { color: RED });
    }
    if (id === "soal2") { const t = at(b, "mulai dari papan paling kiri"); mline(ctx, [[PX(1), 405], [PX(6), 405]], P(l, t, 0.8), ORANGE, 7, true); hand(ctx, "mulai dari kiri", PX(3) + 40, 393, 36, { alpha: P(l, t, 0.5) }); }
    // kaleng
    if (k >= ix("soal3")) cans(ctx, n, b, l, {
      appear: id === "soal3" ? (i => P(l, at(b, ["Cat merah", "Cat hijau", "Cat kuning", "Cat biru"][i]), 0.5)) : null,
      ring: i => (id === "w4" ? P(l, at(b, "sisa cat") + i * 0.2, 0.5) : 0) + (id === "s8" && i === 2 ? P(l, at(b, "tiga papan"), 0.5) : 0) + (id === "j2" && i === 2 ? P(l, 0.4, 0.5) : 0),
    });
    else if (id === "soal1") hand(ctx, "pagar si Bebras", 1300, 300, 72, { color: INK, alpha: P(l, at(b, "pagar kayu"), 0.5) });
    else if (id === "soal2") { hand(ctx, "1 papan = 1 warna", 1100, 300, 64, { color: INK, alpha: P(l, at(b, "satu warna"), 0.5) }); }
    // panel kanan (x 800–1850, y 160–440)
    const x = 820;
    if (id === "soal3") alpha(ctx, P(l, at(b, "Cat merah"), 0.5), () => noteCard(ctx, x, 190, 1000, ["Angka di kaleng = sisa cat,", "yaitu banyak papan yang masih bisa dicat."], 1, { size: 36 }));
    if (id === "soal4") orderRow(ctx, x + 120, 200, b, l, { a: i => P(l, at(b, NAMA[i], "yaitu"), 0.4), loop: P(l, at(b, "kembali lagi"), 0.5) });
    if (id === "soal5") {
      orderRow(ctx, x + 120, 200, b, l);
      alpha(ctx, P(l, at(b, "membuang"), 0.5), () => { hand(ctx, "kaleng habis → dibuang", x + 560, 400, 38, { color: RED }); });
    }
    if (id === "soal6" || id === "w1") {
      const a1 = id === "soal6" ? P(l, at(b, "tidak boleh"), 0.5) : 1;
      alpha(ctx, a1, () => {
        plank(ctx, x + 10, 190, 330, 60, 0, 1, 0); plank(ctx, x + 80, 190, 330, 60, 0, 1, 0);
        cross(ctx, x + 75, 260, 120, id === "soal6" ? P(l, at(b, "tidak boleh") + 0.4, 0.5) : 1, RED, 9);
        text(ctx, "bersebelahan", x + 75, 362, 24, { align: "center", weight: 800, color: RED }); text(ctx, "tidak boleh sama", x + 75, 390, 24, { align: "center", weight: 800, color: RED });
      });
      const a2 = id === "soal6" ? P(l, at(b, "robot berhenti"), 0.5) : 1;
      noteCard(ctx, x + 250, 175, 760, ["Robot berhenti kalau:", "• semua kaleng kosong, atau", "• cat tinggal di 1 kaleng saja."], a2, { size: 38, stroke: RED, head: RED });
      if (id === "w1") ring(ctx, x + 630, 330, 400, 60, P(l, at(b, "satu kaleng"), 0.6), ORANGE, 6);
    }
    if (id === "soal7") {
      card(ctx, x, 175, 1020, 110, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Berapa papan yang dapat dicat robot?", x + 510, 245, 42, { align: "center", weight: 900, color: INK, fit: 980 });
      OPTS.forEach((o, i) => alpha(ctx, P(l, at(b, "Pilihan " + "ABCD"[i]), 0.4), () => { const cx = x + 30 + i * 250; letter(ctx, "ABCD"[i], cx + 26, 370, 26, false); text(ctx, o, cx + 64, 386, 46, { weight: 900, color: INK }); }));
    }
    if (id === "w4") { hand(ctx, "jalankan langkah demi langkah", x + 510, 260, 56, { color: ORANGE, alpha: P(l, 0.3, 0.5) }); hand(ctx, "catat warna dan sisa cat", x + 510, 360, 44, { color: INK, alpha: P(l, at(b, "mencatat"), 0.5) }); }
    if (k >= ix("s1") && k <= ix("s9")) {
      if (id === "s2" || id === "s8") {
        orderRow(ctx, x + 40, 180, b, l, { loop: 1 });
        thinkBadge(ctx, x + 610, 175, 420, 150, l, b.hold + 2, id === "s2" ? "Papan 5 sampai 8?" : "Apa yang terjadi?");
      } else {
        orderRow(ctx, x + 40, 180, b, l);
        const s = Math.ceil(n);
        if (s > 0) { const c = STEPS[s - 1].c; alpha(ctx, 1, () => { card(ctx, x + 680, 180, 340, 150, { fill: "#F7F9FA", stroke: COL[c], lw: 5, r: 18 }); text(ctx, "Papan " + s, x + 850, 240, 40, { align: "center", weight: 900, color: INK }); text(ctx, NAMA[c], x + 850, 300, 44, { align: "center", weight: 900, color: DARK[c] }); }); }
        if (id === "s4") alpha(ctx, P(l, at(b, "bukan delapan"), 0.5), () => { optionsRow(ctx, x + 10, 368, { 0: { k: "x", u: P(l, at(b, "bukan delapan") + 0.3, 0.5) } }); });
        if (id === "s9") hand(ctx, "robot berhenti", x + 850, 385, 40, { color: RED, alpha: P(l, at(b, "Robot pun berhenti"), 0.5) });
      }
    }
    if (id === "j1") {
      optionsRow(ctx, x + 10, 210, { 0: { k: "x", u: 1 }, 2: { k: "ok", u: P(l, at(b, "jawabannya"), 0.5) } });
      alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, x + 200, 260, 620, 140, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: C. 15 papan", x + 510, 352, 54, { align: "center", weight: 900, color: GREEN }); });
    }
    if (id === "j2") {
      optionsRow(ctx, x + 10, 210, { 0: { k: "x", u: 1 }, 1: { k: "x", u: P(l, at(b, "bukan tujuh belas"), 0.5) }, 2: { k: "ok", u: 1 } });
      alpha(ctx, P(l, at(b, "bukan tujuh belas"), 0.5), () => text(ctx, "17 = semua cat, padahal kuning sisa 2", x + 20, 300, 34, { weight: 800, color: RED }));
      alpha(ctx, P(l, at(b, "Jawaban delapan"), 0.5), () => text(ctx, "8 = berhenti terlalu cepat", x + 20, 370, 34, { weight: 800, color: RED }));
    }
    if (id === "c3") hand(ctx, "15 papan", x + 500, 330, 90, { color: GREEN, alpha: P(l, at(b, "lima belas"), 0.5) });
  }

  // contoh: hanya kaleng kuning (w2), jumlah semua cat (w3)
  function contoh(ctx, b, l) {
    board(ctx);
    if (b.id === "w2") {
      text(ctx, "Contoh: hanya kaleng kuning yang berisi cat", 960, 220, 44, { align: "center", weight: 900, color: INK });
      can(ctx, 200, 300, 2, 3, {});
      [0, 1, 2].forEach(i => plank(ctx, 620 + i * 140, 320, 640, 110, 0, i === 0 ? 1 : 0, -1));
      // papan pertama kuning
      const t1 = at(b, "Robot mengecat satu papan"); const u1 = clamp((l - t1) / 0.9, 0, 1);
      if (u1 > 0) { ctx.save(); ctx.globalAlpha = 1; plank(ctx, 620, 320, 640, 110, 0, u1, 2); ctx.restore(); }
      const t2 = at(b, "Kalau robot memakai kuning lagi"), u2 = clamp((l - t2) / 0.9, 0, 1);
      if (u2 > 0) plank(ctx, 760, 320, 640, 110, 0, u2, 2);
      alpha(ctx, P(l, at(b, "harus berwarna lain"), 0.5), () => text(ctx, "?", 815, 515, 90, { align: "center", weight: 900, color: ORANGE }));
      cross(ctx, 815, 480, 160, P(l, at(b, "dilarang"), 0.5), RED, 10);
      alpha(ctx, P(l, at(b, "tidak ada warna lain"), 0.5), () => hand(ctx, "tidak ada warna lain", 1430, 470, 48, { color: INK }));
      alpha(ctx, P(l, at(b, "harus berhenti"), 0.5), () => hand(ctx, "robot berhenti", 1430, 580, 64, { color: RED }));
      bot(ctx, 680, 705, 90, 2, 0);
    }
    if (b.id === "w3") {
      const T = ["lima", "tiga", "tujuh", "dua"].map(s => at(b, s, "menjumlahkan"));
      for (let i = 0; i < 4; i++) {
        alpha(ctx, P(l, T[i] - 0.2, 0.4), () => can(ctx, 230 + i * 300, 230, i, CAP[i], {}));
        if (i < 3) alpha(ctx, P(l, T[i + 1] - 0.3, 0.4), () => text(ctx, "+", 395 + i * 300, 330, 80, { align: "center", weight: 900, color: INK }));
      }
      alpha(ctx, P(l, at(b, "tujuh belas"), 0.5), () => text(ctx, "= 17", 1480, 330, 96, { weight: 900, color: INK }));
      alpha(ctx, P(l, at(b, "Tetapi"), 0.5), () => { hand(ctx, "belum tentu semua cat terpakai!", 960, 640, 64, { color: RED }); });
    }
  }

  // penutup: komputer menjalankan perintah satu per satu
  function komputer(ctx, b, l) {
    board(ctx);
    const X = 260, Y = 200, W = 900, Hh = 520;
    ctx.fillStyle = "#2B3440"; rr(ctx, X, Y, W, Hh, 24); ctx.fill();
    ctx.fillStyle = "#1E2A33"; rr(ctx, X + 24, Y + 24, W - 48, Hh - 80, 12); ctx.fill();
    ctx.fillStyle = "#2B3440"; ctx.fillRect(X + W / 2 - 40, Y + Hh, 80, 50); rr(ctx, X + W / 2 - 160, Y + Hh + 44, 320, 24, 10); ctx.fill();
    const lines = ["1  ambil warna berikutnya", "2  cat satu papan", "3  kurangi sisa cat", "4  kalau kaleng kosong, buang", "5  kalau cat tinggal 1 kaleng, berhenti", "6  kembali ke baris 1"];
    const cur = Math.floor(Math.max(0, l - at(b, "satu per satu")) / 0.8) % 6, on = l > at(b, "satu per satu");
    lines.forEach((s, i) => {
      const y = Y + 90 + i * 64;
      if (on && i === cur) { ctx.fillStyle = "rgba(242,177,52,0.35)"; ctx.fillRect(X + 40, y - 42, W - 80, 58); text(ctx, "▶", X + 52, y, 30, { weight: 900, color: C.accent }); }
      text(ctx, s, X + 96, y, 34, { weight: 700, color: "#E8F1F5", fit: W - 150 });
    });
    alpha(ctx, P(l, at(b, "seperti robot pengecat"), 0.5), () => { bot(ctx, 1450, 520, 200, 2, l); for (let i = 0; i < 3; i++) plank(ctx, 1300 + i * 110, 600, 800, 90, 0, i < 2 ? 1 : 0, [0, 1][i]); });
    hand(ctx, "menelusuri langkah demi langkah", 1540, 300, 36, { color: ORANGE, alpha: P(l, at(b, "menelusurinya"), 0.5) });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  const VX = i => 470 + i * 58;
  function pagar_v(ctx, b, l) {
    board(ctx);
    const id = b.id;
    let n = 0;
    if (id === "h2") { const t8 = at(b, "Setelah delapan"), t10 = at(b, "Setelah sepuluh"); n = l < t8 ? clamp((l - 0.3) / Math.max(0.5, t8 - 0.3) * 8, 0, 8) : Math.min(10, 8 + clamp((l - t8) / Math.max(0.5, t10 - t8) * 2, 0, 2)); }
    if (id === "h3") { const t15 = at(b, "Papan kelima belas"); n = l < t15 ? 10 + clamp((l - 0.3) / Math.max(0.5, t15 - 0.3) * 4, 0, 4) : 14 + clamp((l - t15) / 0.9, 0, 1); }
    if (id === "h4") n = 15;
    const left = leftAt(n);
    for (let i = 0; i < 4; i++) {
      const gone = left[i] === 0 ? 1 : 0;
      alpha(ctx, id === "h0" ? P(l, at(b, ["lima", "tiga", "tujuh", "dua"][i], "Isi catnya"), 0.4) : 1, () => can(ctx, 520 + i * 235, 170, i, left[i], { x: gone, gone: gone * 0.5 }));
    }
    // pagar kecil
    ctx.fillStyle = "#B98458"; ctx.fillRect(460, 510, 1000, 14); ctx.fillRect(460, 590, 1000, 14);
    for (let i = 0; i < NPLANK; i++) {
      plank(ctx, VX(i), 440, 640, 50, 0, clamp(n - i, 0, 1), i < 15 ? STEPS[i].c : -1);
      text(ctx, String(i + 1), VX(i) + 25, 675, 22, { align: "center", weight: 800, color: INK });
    }
    if (id === "h4") cross(ctx, VX(15) + 25, 560, 70, P(l, at(b, "robot berhenti"), 0.5), RED, 7);
    let note = "", nc = INK;
    if (id === "h0") { note = "merah → hijau → kuning → biru → merah …"; nc = INK; }
    if (id === "h1") {
      alpha(ctx, P(l, at(b, "Berapa papan"), 0.5), () => OPTS.forEach((o, i) => { const x = 520 + i * 235; letter(ctx, "ABCD"[i], x + 22, 735, 22, false); text(ctx, o, x + 56, 747, 40, { weight: 900, color: INK }); }));
      note = "papan bersebelahan tidak boleh sama"; nc = RED;
    }
    if (id === "h2") { note = n >= 10 ? "biru habis (papan 8), hijau habis (papan 10)" : n >= 8 ? "papan 8: biru habis" : "papan " + Math.max(1, Math.ceil(n)); nc = BLUE; }
    if (id === "h3") { note = n > 14 ? "papan 15: kuning" : n >= 14 ? "papan 14: merah habis" : "kuning, merah, kuning, merah"; nc = ORANGE; }
    if (id === "h4") { note = "Jawaban: 15 papan"; nc = GREEN; }
    if (note) text(ctx, note, 960, id === "h1" ? 805 : 780, 40, { align: "center", weight: 900, color: nc, fit: 980 });
  }

  Object.assign(K.SCENES, B.umum(META), { pagar, contoh, komputer, pagar_v });
})(typeof window !== "undefined" ? window : globalThis);
