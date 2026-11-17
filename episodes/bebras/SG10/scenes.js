/* SG10 Pembahasan Soal Bebras 2017-MY-01 "Kursi Musik" (Malaysia), kategori Siaga (kelas 4–6 SD).
   Papan tulis: empat kursi melingkar (1 atas, 2 kanan, 3 bawah, 4 kiri; searah jarum jam), empat berang-berang
   berpindah tiap putaran (A 3, B 1, C 2, D 1), tabel posisi, lalu jalan pintas (maju 4 = kembali).
   Posisi dihitung di kode; K._warn bila hasil putaran 3 bukan A2 B1 C1 D3. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter } = B;
  const META = { judul: "Kursi Musik", tahun: "2017", negara: "Malaysia", kode: "2017-MY-01", flag: "MY", sumber: "Buku Tantangan Bebras Indonesia 2017", bukaFrasa: "lomba",
    tingkat: "kelas 4, 5, dan 6 SD (Siaga)",
    langkah: ["Beri nomor pada kursi dan pahami arah gerakannya.", "Jalankan setiap putaran dan catat posisinya di tabel.", "Cari pola: maju empat kursi berarti kembali ke tempat semula."],
    cta: "Kursi mana yang kosong?", gambarUlang: "Kursi dan berang-berang digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const BV = ["A", "B", "C", "D"], STEP = { A: 3, B: 1, C: 2, D: 1 };
  const R = [{ A: 1, B: 2, C: 3, D: 4 }];
  for (let r = 0; r < 3; r++) { const n = {}; BV.forEach(v => n[v] = (R[r][v] - 1 + STEP[v]) % 4 + 1); R.push(n); }
  const kosong = [1, 2, 3, 4].filter(k => !BV.some(v => R[3][v] === k));
  if (JSON.stringify(R[1]) !== '{"A":4,"B":3,"C":1,"D":1}' || JSON.stringify(R[2]) !== '{"A":3,"B":4,"C":3,"D":2}' || JSON.stringify(R[3]) !== '{"A":2,"B":1,"C":1,"D":3}' || kosong.join() !== "4")
    (K._warn = K._warn || []).push("data salah: " + JSON.stringify(R) + " kosong=" + kosong);

  // ---------- gambar ----------
  const ang = k => -Math.PI / 2 + (k - 1) * Math.PI / 2;
  function chair(ctx, cx, cy, k, a, sz) {
    const x = cx + Math.cos(a) * sz.rc, y = cy + Math.sin(a) * sz.rc, s = sz.chair;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);
    ctx.fillStyle = "#7A4A24"; rr(ctx, -s * 0.5, -s * 0.72, s, s * 0.2, s * 0.06); ctx.fill();   // sandaran di sisi luar
    ctx.fillStyle = "#B9773F"; ctx.strokeStyle = "#7A4A24"; ctx.lineWidth = 3; rr(ctx, -s * 0.5, -s * 0.5, s, s, s * 0.14); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  function num(ctx, cx, cy, k, sz) { const a = ang(k), x = cx + Math.cos(a) * sz.rn, y = cy + Math.sin(a) * sz.rn;
    ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x, y, sz.nr, 0, Math.PI * 2); ctx.fill(); text(ctx, String(k), x, y + sz.nr * 0.42, sz.nr * 1.25, { align: "center", weight: 900, color: "#FFFFFF" }); }
  function scene0(ctx, cx, cy, sz, o = {}) {
    if (o.arrow > 0) alpha(ctx, o.arrow, () => { for (let k = 1; k <= 4; k++) { const a0 = ang(k) + 0.5, a1 = ang(k) + Math.PI / 2 - 0.5; ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, sz.rn, a0, a1); ctx.stroke();
      const hx = cx + Math.cos(a1) * sz.rn, hy = cy + Math.sin(a1) * sz.rn, d = a1 + Math.PI / 2; ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(hx + Math.cos(d) * 14, hy + Math.sin(d) * 14); ctx.lineTo(hx + Math.cos(d + 2.4) * 14, hy + Math.sin(d + 2.4) * 14); ctx.lineTo(hx + Math.cos(d - 2.4) * 14, hy + Math.sin(d - 2.4) * 14); ctx.fill(); } });
    for (let k = 1; k <= 4; k++) alpha(ctx, o.chairs != null ? o.chairs : 1, () => { chair(ctx, cx, cy, k, ang(k), sz); num(ctx, cx, cy, k, sz); });
    if (o.empty > 0) ring(ctx, cx + Math.cos(ang(4)) * sz.rc, cy + Math.sin(ang(4)) * sz.rc, sz.chair * 0.85, sz.chair * 0.85, o.empty, RED, 6);
  }
  // berang-berang: pos = {A: [kursi, langkah, t0]} ; bergerak searah jarum jam
  function beavers(ctx, cx, cy, sz, l, pos, only) {
    const list = BV.filter(v => !only || only.includes(v));
    const moving = v => { const [c, n, t0] = pos[v]; return n > 0 && l > t0 && l < t0 + 0.55 * n; };
    const seat = v => { const [c, n, t0] = pos[v]; return n > 0 && l >= t0 + 0.55 * n ? (c - 1 + n) % 4 + 1 : c; };
    list.forEach(v => { let a;
      let off = 0;
      if (moving(v)) { const [c, n, t0] = pos[v]; a = ang(c) + clamp((l - t0) / (0.55 * n), 0, 1) * n * Math.PI / 2; }
      else { const k = seat(v), grp = list.filter(w => !moving(w) && seat(w) === k), i = grp.indexOf(v), m = grp.length; a = ang(k); off = (i - (m - 1) / 2) * sz.off; }
      const x = cx + Math.cos(a) * sz.rb - Math.sin(a) * off, y = cy + Math.sin(a) * sz.rb + Math.cos(a) * off;
      B.beaver(ctx, x, y - sz.bs * 0.12, sz.bs, {}); letter(ctx, v, x, y + sz.bs * 0.2, sz.bs * 0.2, false); });
  }
  const SZ = { rc: 210, rb: 210, chair: 104, bs: 118, off: 66, rn: 92, nr: 30 }, CX0 = 600, CY0 = 450;
  const still = r => { const p = {}; BV.forEach(v => p[v] = [R[r][v], 0, 0]); return p; };
  // tabel
  const TX = 1080, TW = [250, 125, 125, 125, 125], tx = k => TX + TW.slice(0, k).reduce((a, c) => a + c, 0), TY = 165, TH = 76;
  function table(ctx, rowA) {
    card(ctx, TX, TY, 750, 62 + 4 * TH, { fill: "#FFFFFF", stroke: INK, lw: 3, r: 14 });
    ctx.fillStyle = "#F3EBDD"; ctx.fillRect(TX + 2, TY + 2, 746, 58);
    BV.forEach((v, i) => { text(ctx, v, tx(i + 1) + 46, TY + 42, 38, { align: "center", weight: 900, color: INK }); text(ctx, "+" + STEP[v], tx(i + 1) + 88, TY + 42, 28, { align: "center", weight: 900, color: ORANGE }); });
    text(ctx, "kursi", tx(0) + 20, TY + 42, 30, { weight: 900, color: C.ink2 });
    ["awal", "putaran 1", "putaran 2", "putaran 3"].forEach((s, r) => alpha(ctx, rowA(r), () => { const y = TY + 62 + r * TH;
      ctx.strokeStyle = "#DDE2E6"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(TX, y); ctx.lineTo(TX + 750, y); ctx.stroke();
      text(ctx, s, tx(0) + 20, y + 50, 36, { weight: 900, color: r === 3 ? ORANGE : INK });
      BV.forEach((v, i) => text(ctx, String(R[r][v]), tx(i + 1) + 62, y + 54, 48, { align: "center", weight: 900, color: INK })); }));
  }
  const MV = { p1: ["A berpindah", "B berpindah", "C berpindah", "D berpindah"], p3: ["A berpindah", "B pindah", "C pindah", "Dan D pindah"], p4: ["A pindah", "B pindah", "C pindah", "Dan D pindah"] };
  const RND = { p1: 0, p3: 1, p4: 2 };

  function kursi(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "soal1" || id === "soal2" || id === "soal3" || id === "soal4") {
      scene0(ctx, CX0, CY0, SZ, { chairs: id === "soal1" ? P(l, at(b, "Ada empat kursi"), 0.6) : 1, arrow: id === "soal2" ? P(l, at(b, "searah jarum jam"), 0.6) : id === "soal1" ? 0 : 1 });
      beavers(ctx, CX0, CY0, SZ, l, still(0));
      if (id === "soal2") { ["dari satu ke dua", "ke tiga", "ke empat", "kembali ke satu"].forEach((ph, k) => { const u = P(l, at(b, ph), 0.3) * (1 - P(l, at(b, ph) + 0.9, 0.3)); if (u > 0) ring(ctx, CX0 + Math.cos(ang([2, 3, 4, 1][k])) * SZ.rc, CY0 + Math.sin(ang([2, 3, 4, 1][k])) * SZ.rc, 58, 58, u, ORANGE, 6); });
        alpha(ctx, P(l, at(b, "searah jarum jam"), 0.5), () => hand(ctx, "searah jarum jam", 1420, 300, 56, { color: ORANGE })); }
      if (id === "soal3") { [["A", "A berpindah"], ["C", "C berpindah"], ["B", "B dan D"], ["D", "B dan D"]].forEach(([v, ph], k) => alpha(ctx, P(l, at(b, ph), 0.4), () => {
          card(ctx, 1150, 175 + k * 112, 650, 96, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 18 }); letter(ctx, v, 1205, 223 + k * 112, 28, false);
          text(ctx, "maju " + STEP[v] + " kursi setiap putaran", 1255, 236 + k * 112, 38, { weight: 900, color: INK }); }));
        alpha(ctx, P(l, at(b, "Satu kursi boleh"), 0.5), () => text(ctx, "satu kursi boleh diduduki lebih dari satu", 1475, 680, 32, { align: "center", weight: 800, color: C.ink2 })); }
      if (id === "soal4") { card(ctx, 1150, 200, 660, 230, { fill: "#FFF4DE", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "Setelah 3 putaran,", 1480, 290, 48, { align: "center", weight: 900, color: INK }); text(ctx, "kursi mana yang kosong?", 1480, 360, 48, { align: "center", weight: 900, color: INK });
        [1, 2, 3, 4].forEach((k, i) => alpha(ctx, P(l, at(b, "Pilihannya"), 0.5), () => { card(ctx, 1165 + i * 165, 465, 140, 90, { fill: "#FFFFFF", stroke: "#9AA5AE", lw: 3, r: 14 }); text(ctx, "kursi " + k, 1235 + i * 165, 522, 32, { align: "center", weight: 900, color: INK }); }));
        thinkBadge(ctx, 1150, 600, 660, 84, l, b.hold + 2, ""); }
      return;
    }
    if (id in RND || id === "p2" || id === "p5") {
      const r0 = id === "p1" || id === "p2" ? (id === "p1" ? 0 : 1) : id === "p3" ? 1 : id === "p4" ? 2 : 3;
      let pos = still(r0);
      if (id in RND) { pos = {}; BV.forEach((v, i) => pos[v] = [R[r0][v], STEP[v], at(b, MV[id][i]) + 0.6]); }
      scene0(ctx, CX0, CY0, SZ, { arrow: 0.35, empty: id === "p5" ? P(l, at(b, "Kursi empat tidak"), 0.6) : 0 });
      beavers(ctx, CX0, CY0, SZ, l, pos);
      const done = id in RND ? at(b, MV[id][3]) + 0.6 + 0.55 * STEP.D + 0.6 : 0;
      table(ctx, r => r === 0 ? 1 : r < r0 ? 1 : r === r0 ? (id === "p2" ? P(l, at(b, "Kita catat"), 0.5) : 1) : r === r0 + 1 && id in RND ? P(l, done, 0.5) : 0);
      if (id in RND) hand(ctx, "putaran " + (r0 + 1), 100, 215, 50, { align: "left", color: ORANGE });
      if (id === "p5") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => { card(ctx, 1120, 600, 680, 110, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "Jawaban: kursi 4 kosong", 1460, 672, 46, { align: "center", weight: 900, color: GREEN }); });
      if (id === "p5") alpha(ctx, P(l, at(b, "Kursi empat tidak"), 0.5), () => { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.strokeRect(TX + 4, TY + 62 + 3 * TH + 2, 742, TH - 4); });
      return;
    }
    if (id === "k1" || id === "k2" || id === "k3" || id === "k4") {
      scene0(ctx, CX0, CY0, SZ, { arrow: 0.25, empty: id === "k4" ? P(l, at(b, "kursi empat kosong"), 0.6) : 0 });
      const arc = (k0, steps, rad, u, col) => { if (u <= 0) return; const a0 = ang(k0), a1 = a0 + steps * Math.PI / 2 * clamp(u, 0, 1);
        ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(CX0, CY0, rad, Math.min(a0, a1), Math.max(a0, a1)); ctx.stroke();
        const d = a1 + (steps > 0 ? Math.PI / 2 : -Math.PI / 2), hx = CX0 + Math.cos(a1) * rad, hy = CY0 + Math.sin(a1) * rad; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(hx + Math.cos(d) * 18, hy + Math.sin(d) * 18); ctx.lineTo(hx + Math.cos(d + 2.4) * 18, hy + Math.sin(d + 2.4) * 18); ctx.lineTo(hx + Math.cos(d - 2.4) * 18, hy + Math.sin(d - 2.4) * 18); ctx.fill(); };
      if (id === "k1") {
        beavers(ctx, CX0, CY0, SZ, l, { A: [1, 0, 0] }, ["A"]);
        arc(1, 3, 142, P(l, at(b, "maju tiga kursi sampai"), 1.6), ORANGE); arc(1, -1, 300, P(l, at(b, "Mundur satu kursi juga"), 0.8), GREEN);
        alpha(ctx, P(l, at(b, "Maju tiga kursi"), 0.5), () => { card(ctx, 1150, 260, 660, 200, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "maju 3 kursi", 1480, 340, 54, { align: "center", weight: 900, color: ORANGE }); text(ctx, "= mundur 1 kursi", 1480, 410, 54, { align: "center", weight: 900, color: GREEN }); });
        return;
      }
      if (id === "k2") {
        const tC = at(b, "Jadi, C pindah");
        beavers(ctx, CX0, CY0, SZ, l, { C: [3, 2, tC + 0.4] }, ["C"]);
        arc(3, 4, 142, P(l, at(b, "satu lingkaran penuh"), 1.6) * (1 - P(l, at(b, "C maju dua"), 0.4)), ORANGE);
        alpha(ctx, P(l, at(b, "maju empat kursi"), 0.5), () => { card(ctx, 1150, 200, 660, 150, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "maju 4 kursi", 1480, 262, 46, { align: "center", weight: 900, color: ORANGE }); text(ctx, "= kembali ke tempat semula", 1480, 322, 40, { align: "center", weight: 900, color: INK }); });
        alpha(ctx, P(l, at(b, "C maju enam"), 0.5), () => { card(ctx, 1150, 390, 660, 150, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 }); letter(ctx, "C", 1205, 465, 28, false); text(ctx, "maju 6 = maju 2", 1500, 452, 44, { align: "center", weight: 900, color: INK }); text(ctx, "kursi 3 → kursi 1", 1500, 512, 40, { align: "center", weight: 900, color: GREEN }); });
        return;
      }
      if (id === "k3") {
        const tB = at(b, "B pindah dari dua"), tD = at(b, "D pindah dari empat"), tA = at(b, "A pindah dari satu");
        beavers(ctx, CX0, CY0, SZ, l, { A: [1, 1, tA + 0.4], B: [2, 3, tB + 0.4], C: [1, 0, 0], D: [4, 3, tD + 0.4] });
        [["B", "maju 3 = mundur 1", "kursi 2 → kursi 1", "B dan D maju"], ["D", "maju 3 = mundur 1", "kursi 4 → kursi 3", "D pindah dari empat"], ["A", "maju 9 = maju 1", "kursi 1 → kursi 2", "A maju sembilan"]].forEach(([v, s1, s2, ph], k) => alpha(ctx, P(l, at(b, ph), 0.5), () => {
          card(ctx, 1150, 180 + k * 180, 660, 160, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 }); letter(ctx, v, 1205, 260 + k * 180, 28, false);
          text(ctx, s1, 1510, 248 + k * 180, 42, { align: "center", weight: 900, color: INK }); text(ctx, s2, 1510, 306 + k * 180, 38, { align: "center", weight: 900, color: GREEN }); }));
        return;
      }
      beavers(ctx, CX0, CY0, SZ, l, still(3));
      alpha(ctx, P(l, at(b, "kursi empat kosong"), 0.5), () => { card(ctx, 1150, 300, 660, 160, { fill: "#E9F6EE", stroke: GREEN, lw: 4, r: 20 }); text(ctx, "kursi 1, 2, 3 terisi", 1480, 365, 44, { align: "center", weight: 900, color: INK }); text(ctx, "kursi 4 kosong", 1480, 425, 48, { align: "center", weight: 900, color: GREEN }); });
      return;
    }
    if (id === "c2") {
      const cx = 560, cy = 450;
      [1, 2, 3, 4].forEach(k => { const a = ang(k), x = cx + Math.cos(a) * 190, y = cy + Math.sin(a) * 190; ctx.fillStyle = "#FFF4DE"; ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 60, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); text(ctx, String(k), x, y + 22, 64, { align: "center", weight: 900, color: INK }); });
      const u = (l * 0.8) % 4, a = ang(1) + u * Math.PI / 2; ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * 100, cy + Math.sin(a) * 100, 18, 0, Math.PI * 2); ctx.fill();
      alpha(ctx, P(l, at(b, "giliran bermain"), 0.5), () => { card(ctx, 1000, 200, 820, 150, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "giliran bermain:", 1410, 260, 40, { align: "center", weight: 900, color: INK }); text(ctx, "Dito → Sinta → Kiko → Dito → …", 1410, 315, 38, { align: "center", weight: 800, color: C.ink2 }); });
      alpha(ctx, P(l, at(b, "jam digital"), 0.5), () => { card(ctx, 1000, 380, 820, 150, { fill: "#FFFDF7", stroke: ORANGE, lw: 4, r: 20 }); text(ctx, "jam digital:", 1410, 440, 40, { align: "center", weight: 900, color: INK }); text(ctx, "23:59 → 00:00", 1410, 497, 44, { align: "center", weight: 900, color: C.ink2 }); });
      alpha(ctx, P(l, at(b, "kembali ke angka pertama"), 0.5), () => hand(ctx, "setelah angka terakhir, kembali ke angka pertama", 1410, 620, 36, { color: ORANGE, fit: 820 }));
      return;
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  const SZV = { rc: 195, rb: 195, chair: 96, bs: 108, off: 58, rn: 84, nr: 28 };
  function kursi_v(ctx, b, l) {
    board(ctx);
    const id = b.id, cx = 960, cy = 420;
    scene0(ctx, cx, cy, SZV, { arrow: id === "h0" ? P(l, at(b, "searah jarum jam"), 0.5) : 1, empty: id === "h3" ? P(l, at(b, "kursi empat"), 0.6) : 0 });
    let pos = still(0);
    if (id === "h2") { pos = {}; const ph = { A: "A berakhir", B: "B di kursi", C: "C di kursi", D: "D di kursi" }; BV.forEach(v => pos[v] = [1 + "ABCD".indexOf(v), (R[3][v] - R[0][v] + 4) % 4, at(b, ph[v]) + 0.3]); }
    if (id === "h3") pos = still(3);
    beavers(ctx, cx, cy, SZV, l, pos);
    if (id !== "h3") alpha(ctx, id === "h0" ? P(l, at(b, "A berpindah"), 0.5) : 1, () => text(ctx, "A +3   ·   B +1   ·   C +2   ·   D +1", 960, 726, 40, { align: "center", weight: 900, color: ORANGE }));
    if (id === "h1") thinkBadge(ctx, 610, 764, 700, 60, l, b.hold + 2, "");
    if (id === "h2") alpha(ctx, P(l, at(b, "maju empat"), 0.5), () => text(ctx, "maju 4 = kembali ke tempat semula", 960, 795, 34, { align: "center", weight: 900, color: INK }));
    if (id === "h3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: kursi 4", 960, 760, 56, { align: "center", weight: 900, color: GREEN }));
  }

  Object.assign(K.SCENES, B.umum(META), { kursi, kursi_v });
})(typeof window !== "undefined" ? window : globalThis);
