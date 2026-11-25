/* B14 Pembahasan Soal Bebras 2020-IE-08 "Kebun Binatang" (Irlandia), kategori SiKecil (kelas 1–3 SD).
   Papan tulis: lingkaran ungu (pemakan ikan, 5 hewan) dan hijau (pemakan daun, 4 hewan) di kiri; kandang A–D di kanan.
   Kandang tanpa pemakan daun dihitung ulang di kode; K._warn bila bukan A dan C.
   Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Kebun Binatang", tahun: "2020", negara: "Irlandia", kode: "2020-IE-08", flag: "IE", sumber: "Buku Tantangan Bebras Indonesia 2020", bukaFrasa: "Bebras",
    tingkat: "kelas 1, 2, dan 3 SD (SiKecil)",
    langkah: ["Beri tanda setiap hewan: ikan atau daun.", "Periksa setiap kandang, satu per satu.", "Pilih kandang tanpa tanda daun."],
    cta: "Di kandang mana penjaga lupa?", gambarUlang: "Hewan-hewan lucu digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const IKAN = ["biru", "gurita", "tanduk", "hijau", "jeli"], DAUN = ["hantu", "pink", "burung", "ungu"];
  const KANDANG = { A: ["jeli", "tanduk", "hijau"], B: ["pink", "hantu", "tanduk"], C: ["gurita", "biru", "jeli"], D: ["ungu", "gurita", "biru"] };
  const daun = k => DAUN.includes(k);
  const LUPA = Object.keys(KANDANG).filter(L => !KANDANG[L].some(daun)).join("");
  if (LUPA !== "AC") (K._warn = K._warn || []).push("data salah: lupa=" + LUPA);

  // ---------- gambar hewan (tinggi ±s, pusat x,y) ----------
  function eye(ctx, x, y, r, look = 0) { ctx.fillStyle = "#fff"; ctx.strokeStyle = "#222"; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(x + look * r * 0.3, y + r * 0.1, r * 0.5, 0, Math.PI * 2); ctx.fill(); }
  function mouth(ctx, x, y, w, h, teeth) { ctx.fillStyle = "#3A1E1E"; rr(ctx, x - w / 2, y - h / 2, w, h, h * 0.45); ctx.fill(); if (teeth) { ctx.fillStyle = "#fff"; for (let k = 0; k < teeth; k++) { const tx = x - w / 2 + w * (k + 0.5) / teeth; ctx.beginPath(); ctx.moveTo(tx - w / teeth * 0.3, y - h / 2); ctx.lineTo(tx + w / teeth * 0.3, y - h / 2); ctx.lineTo(tx, y - h / 2 + h * 0.4); ctx.fill(); } } }
  function monster(ctx, kind, x, y, s) {
    ctx.save(); ctx.translate(x, y); const u = s / 100; ctx.scale(u, u); ctx.lineJoin = "round";
    const OL = "rgba(0,0,0,0.35)";
    if (kind === "biru") {
      ctx.fillStyle = "#2F6FB5"; ctx.strokeStyle = OL; ctx.lineWidth = 2; rr(ctx, -38, -32, 76, 58, 26); ctx.fill(); ctx.stroke();
      ctx.fillRect(-30, 20, 14, 16); ctx.fillRect(16, 20, 14, 16); rr(ctx, -50, -4, 14, 26, 7); ctx.fill(); rr(ctx, 36, -4, 14, 26, 7); ctx.fill();
      eye(ctx, -12, -16, 7); eye(ctx, 12, -16, 7); mouth(ctx, 0, 6, 46, 16, 5);
    } else if (kind === "gurita") {
      ctx.strokeStyle = "#E4672A"; ctx.lineWidth = 9; ctx.lineCap = "round";
      for (let k = 0; k < 6; k++) { const a = Math.PI * (0.1 + k * 0.16); ctx.beginPath(); ctx.moveTo(Math.cos(a) * 18, 4 + Math.sin(a) * 12); ctx.quadraticCurveTo(Math.cos(a) * 40, 22 + Math.sin(a) * 20, Math.cos(a) * 46 + (k % 2 ? 8 : -8), 38 + Math.sin(a) * 6); ctx.stroke(); }
      ctx.fillStyle = "#F07A35"; ctx.beginPath(); ctx.ellipse(0, -10, 32, 30, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#F7A26E"; [[-16, -28], [14, -30], [20, -6]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 4, 0, Math.PI * 2); ctx.fill(); });
      eye(ctx, -11, -10, 8); eye(ctx, 11, -10, 8); mouth(ctx, 0, 10, 14, 8, 2);
    } else if (kind === "tanduk") {
      ctx.fillStyle = "#EC8A6F"; ctx.strokeStyle = OL; ctx.lineWidth = 2;
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 20, -30); ctx.lineTo(k * 34, -48); ctx.lineTo(k * 32, -26); ctx.fill(); }
      rr(ctx, -34, -34, 68, 56, 14); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#6B3A26"; ctx.fillRect(-34, -18, 68, 12);
      ctx.fillRect(-26, 22, 12, 16); ctx.fillRect(14, 22, 12, 16); ctx.fillStyle = "#EC8A6F"; rr(ctx, -48, -6, 14, 22, 7); ctx.fill(); rr(ctx, 34, -6, 14, 22, 7); ctx.fill();
      eye(ctx, -12, -12, 5); eye(ctx, 12, -12, 5); mouth(ctx, 0, 8, 30, 12, 4);
    } else if (kind === "hijau") {
      ctx.fillStyle = "#A8CF2E"; ctx.strokeStyle = OL; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -42); ctx.quadraticCurveTo(10, -40, 38, 22); ctx.quadraticCurveTo(40, 30, 30, 30); ctx.lineTo(-30, 30); ctx.quadraticCurveTo(-40, 30, -38, 22); ctx.quadraticCurveTo(-10, -40, 0, -42); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#4A3A2A"; ctx.fillRect(-20, 30, 10, 10); ctx.fillRect(10, 30, 10, 10);
      eye(ctx, 0, -8, 12); mouth(ctx, 0, 16, 22, 9, 3);
    } else if (kind === "jeli") {
      ctx.fillStyle = "#F7C3D3"; ctx.strokeStyle = "#E39BB3"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-42, 24); ctx.bezierCurveTo(-46, -36, 46, -36, 42, 24); ctx.quadraticCurveTo(0, 32, -42, 24); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#7A4A5A"; ctx.lineWidth = 3; ctx.lineCap = "round"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 14, -2, 6, 0.2, Math.PI - 0.2); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0, 10, 5, 0.3, Math.PI - 0.3); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(22, -22, 4, 0, Math.PI * 2); ctx.fill();
    } else if (kind === "hantu") {
      ctx.fillStyle = "#3D3D45";
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 18, -10); ctx.lineTo(k * 56, -26); ctx.lineTo(k * 50, -8); ctx.lineTo(k * 42, -2); ctx.lineTo(k * 34, 4); ctx.lineTo(k * 22, 6); ctx.fill(); }
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#555"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-24, 30); ctx.lineTo(-24, -8); ctx.arc(0, -8, 24, Math.PI, 0); ctx.lineTo(24, 30); for (let k = 0; k < 4; k++) { ctx.lineTo(24 - 12 * k - 6, 22); ctx.lineTo(24 - 12 * (k + 1), 30); } ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#222"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 9, -8, 4, 6, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath(); ctx.ellipse(0, 8, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
    } else if (kind === "pink") {
      ctx.fillStyle = "#EC4F9E"; ctx.strokeStyle = OL; ctx.lineWidth = 2;
      rr(ctx, -46, -4, 14, 22, 7); ctx.fill(); rr(ctx, 32, -4, 14, 22, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, -2, 36, 38, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillRect(-20, 30, 12, 10); ctx.fillRect(8, 30, 12, 10);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, -12, 15, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#1FA3A0"; ctx.beginPath(); ctx.arc(0, -11, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(0, -11, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#7A1F4D"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 12, 9, 0.2, Math.PI - 0.2); ctx.stroke();
    } else if (kind === "burung") {
      ctx.fillStyle = "#B8D98A"; ctx.strokeStyle = OL; ctx.lineWidth = 2;
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 14, -34); ctx.lineTo(k * 26, -46); ctx.lineTo(k * 28, -28); ctx.fill(); }
      ctx.beginPath(); ctx.ellipse(0, -2, 34, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#F4F1E4"; ctx.beginPath(); ctx.ellipse(0, 14, 22, 22, 0, 0, Math.PI * 2); ctx.fill();
      eye(ctx, -13, -14, 10); eye(ctx, 13, -14, 10);
      ctx.fillStyle = "#F0A030"; ctx.beginPath(); ctx.moveTo(-6, -4); ctx.lineTo(6, -4); ctx.lineTo(0, 6); ctx.fill();
      ctx.fillStyle = "#E39A2A"; ctx.fillRect(-16, 36, 10, 6); ctx.fillRect(6, 36, 10, 6);
    } else if (kind === "ungu") {
      ctx.fillStyle = "#8C6BC2"; ctx.strokeStyle = "#5E4290"; ctx.lineWidth = 2;
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 26, -2); ctx.lineTo(k * 48, -26); ctx.lineTo(k * 52, -18); ctx.lineTo(k * 30, 8); ctx.fill(); }
      ctx.beginPath(); for (let k = 0; k <= 28; k++) { const a = k / 28 * Math.PI * 2, r = (k % 2 ? 30 : 36); ctx.lineTo(Math.cos(a) * r * 0.92, Math.sin(a) * r * 1.12); } ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#5E4290"; ctx.fillRect(-16, 34, 10, 10); ctx.fillRect(6, 34, 10, 10);
      eye(ctx, -10, -12, 8); eye(ctx, 10, -12, 8); mouth(ctx, 0, 10, 18, 8, 2);
    }
    ctx.restore();
  }
  function fishIcon(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s / 40, s / 40); ctx.fillStyle = "#3D7FC4"; ctx.beginPath(); ctx.ellipse(-3, 0, 14, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(18, -8); ctx.lineTo(18, 8); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-10, -2, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  function leafIcon(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s / 40, s / 40); ctx.rotate(-0.6); ctx.fillStyle = "#2E9B4F"; ctx.beginPath(); ctx.moveTo(0, -16); ctx.quadraticCurveTo(14, 0, 0, 16); ctx.quadraticCurveTo(-14, 0, 0, -16); ctx.fill(); ctx.strokeStyle = "#BFE8C8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, 14); ctx.stroke(); ctx.restore(); }
  function badge(ctx, kind, x, y, r, a = 1) {
    alpha(ctx, a, () => { ctx.fillStyle = "#fff"; ctx.strokeStyle = daun(kind) ? GREEN : "#3D7FC4"; ctx.lineWidth = r * 0.16; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); (daun(kind) ? leafIcon : fishIcon)(ctx, x, y, r * 1.5); });
  }
  // posisi hewan di dalam lingkaran
  const POS5 = [[-0.42, -0.36], [0.4, -0.36], [-0.46, 0.34], [0.44, 0.34], [0, 0.02]], POS4 = [[-0.4, -0.36], [0.4, -0.36], [-0.4, 0.36], [0.4, 0.36]], POS3 = [[-0.42, -0.3], [0.42, -0.3], [0, 0.42]];
  function pen(ctx, x, y, r, list, col, o = {}) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    const pos = list.length === 5 ? POS5 : list.length === 4 ? POS4 : POS3, sz = r * (list.length === 3 ? 0.68 : list.length === 4 ? 0.6 : 0.55);
    list.forEach((k, i) => { const mx = x + pos[i][0] * r, my = y + pos[i][1] * r; alpha(ctx, o.show ? o.show(i) : 1, () => monster(ctx, k, mx, my, sz)); if (o.badge) badge(ctx, k, mx + sz * 0.42, my - sz * 0.4, sz * 0.25, o.badge(i)); });
  }

  // ---------- adegan utama ----------
  const RF = { x: 235, y: 315, r: 160 }, RL = { x: 235, y: 655, r: 160 };
  const CX = [700, 1000, 1300, 1600], CY = 490, CR = 135, LS = "ABCD";
  const BG_F = "#B9B1EA", BG_L = "#9CC79A", BG_K = "#9CC79A";
  function kebun(ctx, b, l) {
    board(ctx);
    const id = b.id, order = ["soal1", "soal2", "soal3", "soal4", "t1", "t2", "k1", "k2", "j1", "j2", "j3", "j4", "c2"], n = order.indexOf(id);
    const after = k => n > order.indexOf(k), from = k => n >= order.indexOf(k);
    // lingkaran referensi
    const showF = id === "soal1" ? i => P(l, at(b, "makan ikan") + i * 0.15, 0.4) : () => 1, showL = id === "soal1" ? i => P(l, at(b, "makan daun") + i * 0.15, 0.4) : () => 1;
    const bF = id === "t1" ? i => P(l, at(b, "tanda ikan") + i * 0.2, 0.4) : (after("t1") ? () => 1 : null);
    const bL = id === "t1" ? i => P(l, at(b, "tanda daun") + i * 0.2, 0.4) : (after("t1") ? () => 1 : null);
    pen(ctx, RF.x, RF.y, RF.r, IKAN, BG_F, { show: showF, badge: bF });
    pen(ctx, RL.x, RL.y, RL.r, DAUN, BG_L, { show: showL, badge: bL });
    alpha(ctx, id === "soal1" ? P(l, at(b, "makan ikan"), 0.4) : 1, () => { fishIcon(ctx, RF.x + RF.r - 4, RF.y - RF.r + 20, 64); text(ctx, "makan ikan", RF.x + RF.r + 24, RF.y + 8, 30, { weight: 900, color: "#3D7FC4" }); });
    alpha(ctx, id === "soal1" ? P(l, at(b, "makan daun"), 0.4) : 1, () => { leafIcon(ctx, RL.x + RL.r - 4, RL.y - RL.r + 20, 64); text(ctx, "makan daun", RL.x + RL.r + 24, RL.y + 8, 30, { weight: 900, color: GREEN }); });
    if (id === "soal2") { ring(ctx, RF.x, RF.y, RF.r + 10, RF.r + 10, P(l, at(b, "lingkaran ungu"), 0.6), ORANGE, 6); ring(ctx, RL.x, RL.y, RL.r + 10, RL.r + 10, P(l, at(b, "lingkaran hijau"), 0.6), ORANGE, 6);
      hand(ctx, "5 pemakan ikan", 1150, 380, 60, { color: "#3D7FC4", alpha: P(l, at(b, "Lima hewan"), 0.5) }); hand(ctx, "4 pemakan daun", 1150, 520, 60, { color: GREEN, alpha: P(l, at(b, "Empat hewan"), 0.5) }); }
    // kandang
    if (from("soal3")) {
      const tA = id === "soal3" ? at(b, "beberapa kandang") : -9;
      const verdict = { A: from("k1") ? (id === "k1" ? at(b, "penjaga lupa") : -9) : 1e9, B: from("j1") ? (id === "j1" ? at(b, "sudah benar") : -9) : 1e9, C: from("j2") ? (id === "j2" ? at(b, "juga lupa") : -9) : 1e9, D: from("j3") ? (id === "j3" ? at(b, "sudah benar") : -9) : 1e9 };
      const bstart = { A: id === "k1" ? at(b, "monster jeli") : (after("k1") ? -9 : 1e9), B: id === "j1" ? at(b, "monster merah muda") : (after("j1") ? -9 : 1e9), C: id === "j2" ? at(b, "gurita") : (after("j2") ? -9 : 1e9), D: id === "j3" ? at(b, "monster ungu") : (after("j3") ? -9 : 1e9) };
      LS.split("").forEach((L, i) => alpha(ctx, P(l, tA + i * 0.35, 0.5), () => {
        pen(ctx, CX[i], CY, CR, KANDANG[L], BG_K, { badge: j => P(l, bstart[L] + j * 0.6, 0.4) });
        letter(ctx, L, CX[i], CY - CR - 34, 28, false);
        const ok = KANDANG[L].some(daun), u = P(l, verdict[L], 0.6);
        if (u > 0) { if (ok) tick(ctx, CX[i], CY + CR + 70, 70, u, GREEN); else { cross(ctx, CX[i], CY + CR + 64, 60, u, RED, 9); } alpha(ctx, u, () => text(ctx, ok ? "benar" : "lupa", CX[i], CY + CR + 140, 34, { align: "center", weight: 900, color: ok ? GREEN : RED })); }
      }));
      if (id === "soal3") alpha(ctx, P(l, at(b, "paling sedikit"), 0.5), () => { leafIcon(ctx, 830, 215, 48); hand(ctx, "setiap kandang: paling sedikit 1 pemakan daun", 1170, 228, 40, { color: GREEN, fit: 640 }); });
      if (id === "soal4") { hand(ctx, "Di kandang mana penjaga lupa?", 1150, 228, 46, { color: INK });
        LS.split("").forEach((L, i) => ring(ctx, CX[i], CY - CR - 34, 40, 40, P(l, at(b, "kandang A, B") + i * 0.3, 0.4), C.accent, 5));
        hand(ctx, "boleh lebih dari satu", 1150, 790, 44, { color: ORANGE, alpha: P(l, at(b, "boleh lebih"), 0.5) }); }
      if (id === "t2") { const u = P(l, at(b, "mencocokkan"), 1.2); alpha(ctx, u, () => { ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4;
        [[RF, 4, 0, 0], [RL, 1, 1, 0]].forEach(([R, pi, ci, j]) => { const p = (R === RF ? POS5 : POS4)[pi], pos = POS3[j]; ctx.beginPath(); ctx.moveTo(R.x + p[0] * R.r + 30, R.y + p[1] * R.r); ctx.lineTo(CX[ci] + pos[0] * CR - 30, CY + pos[1] * CR); ctx.stroke(); }); ctx.restore(); });
        hand(ctx, "hewan sama → tanda sama", 1150, 228, 46, { color: ORANGE, alpha: P(l, 0.3, 0.5) }); }
      if (id === "k1") { ring(ctx, CX[0], CY, CR + 12, CR + 12, P(l, at(b, "kandang A"), 0.6), ORANGE, 6); hand(ctx, "tidak ada tanda daun", 1150, 228, 46, { color: RED, alpha: P(l, at(b, "Tidak ada tanda"), 0.5) }); }
      if (id === "k2") thinkBadge(ctx, 700, 160, 1050, 110, l, b.hold + 2, "Kandang mana lagi yang tidak punya pemakan daun?");
      if (id === "j1" || id === "j3") hand(ctx, "ada tanda daun", 1150, 228, 46, { color: GREEN, alpha: P(l, at(b, "pemakan daun"), 0.5) });
      if (id === "j2") hand(ctx, "tidak ada tanda daun", 1150, 228, 46, { color: RED, alpha: P(l, at(b, "pemakan ikan"), 0.5) });
      if (id === "j4" || id === "c2") alpha(ctx, id === "j4" ? P(l, at(b, "jawabannya"), 0.5) : 1, () => { card(ctx, 900, 160, 500, 100, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: A dan C", 1150, 228, 50, { align: "center", weight: 900, color: GREEN }); [0, 2].forEach(i => ring(ctx, CX[i], CY, CR + 12, CR + 12, 1, GREEN, 6)); });
      if (id === "c2") alpha(ctx, P(l, at(b, "galeri"), 0.5), () => {
        const x = 1460, y = 200, w = 330, h = 600; ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.fillRect(600, 140, 1260, 680);
        card(ctx, x, y, w, h, { fill: "#222831", stroke: "#111", lw: 3, r: 36 }); ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 14, y + 40, w - 28, h - 80, 14); ctx.fill();
        text(ctx, "Galeri", x + 34, y + 84, 30, { weight: 900, color: INK });
        const cat = [1, 0, 1, 0, 0, 1, 1, 0, 0];
        cat.forEach((c, k) => { const gx = x + 34 + (k % 3) * 90, gy = y + 110 + Math.floor(k / 3) * 100; ctx.fillStyle = c ? "#F2C48D" : "#BFD9EE"; rr(ctx, gx, gy, 80, 88, 8); ctx.fill();
          if (c) { ctx.fillStyle = "#C47F2A"; ctx.beginPath(); ctx.arc(gx + 40, gy + 50, 18, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(gx + 24, gy + 40); ctx.lineTo(gx + 28, gy + 22); ctx.lineTo(gx + 36, gy + 36); ctx.moveTo(gx + 56, gy + 40); ctx.lineTo(gx + 52, gy + 22); ctx.lineTo(gx + 44, gy + 36); ctx.fill();
            alpha(ctx, P(l, at(b, "memberi tanda pada foto") + k * 0.12, 0.4), () => { ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(gx + 68, gy + 12, 11, 0, Math.PI * 2); ctx.fill(); }); } });
        text(ctx, "kucing: 4 foto", x + w / 2, y + 470, 30, { align: "center", weight: 900, color: ORANGE });
        hand(ctx, "beri tanda, lalu cari", 1000, 480, 56, { color: ORANGE });
      });
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function kebun_v(ctx, b, l) {
    board(ctx);
    const id = b.id, F = { x: 700, y: 300, r: 150 }, Lr = { x: 1220, y: 300, r: 150 }, XV = [585, 835, 1085, 1335], YV = 600, RV = 120;
    const tb = id === "h2" ? at(b, "tanda daun") : (id === "h3" ? -9 : 1e9);
    pen(ctx, F.x, F.y, F.r, IKAN, BG_F, { badge: tb < 1e9 ? i => P(l, tb, 0.4) : null }); pen(ctx, Lr.x, Lr.y, Lr.r, DAUN, BG_L, { badge: tb < 1e9 ? i => P(l, tb, 0.4) : null });
    fishIcon(ctx, F.x + F.r - 8, F.y - F.r + 12, 52); leafIcon(ctx, Lr.x + Lr.r - 8, Lr.y - Lr.r + 12, 52);
    if (id === "h0") hand(ctx, "1 pemakan daun di setiap kandang", 960, 790, 40, { color: GREEN, alpha: P(l, at(b, "Setiap kandang"), 0.5) });
    LS.split("").forEach((L, i) => {
      pen(ctx, XV[i], YV, RV, KANDANG[L], BG_K, { badge: tb < 1e9 ? j => P(l, tb + 0.8 + i * 0.3, 0.4) : null });
      letter(ctx, L, XV[i] - RV + 10, YV - RV + 10, 22, false);
      const ok = KANDANG[L].some(daun);
      if (id === "h2" && ok) tick(ctx, XV[i], YV + RV + 36, 44, P(l, at(b, "Kandang B dan D"), 0.5), GREEN);
      if (id === "h3") { if (ok) tick(ctx, XV[i], YV + RV + 36, 44, 1, GREEN); else cross(ctx, XV[i], YV + RV + 36, 40, P(l, at(b, "Kandang A dan C"), 0.5), RED, 8); }
    });
    if (id === "h1") thinkBadge(ctx, 610, 735, 700, 90, l, b.hold + 2, "");
    if (id === "h3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { text(ctx, "Jawaban: A dan C", 960, 815, 46, { align: "center", weight: 900, color: GREEN }); });
  }

  Object.assign(K.SCENES, B.umum(META), { kebun, kebun_v });
})(typeof window !== "undefined" ? window : globalThis);
