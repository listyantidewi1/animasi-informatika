/* B10 Pembahasan Soal Bebras 2020-IN-12 "Kue Dadar" (India), kategori SiKecil (kelas 1–3 SD).
   Papan tulis: tumpukan kue dadar di piring (kuning = apel, putih = biasa) yang diambil dan ditambah dari atas,
   riwayat tumpukan kecil di kanan, lalu menghitung kue dadar di atas kue dadar apel teratas.
   Urutan tumpukan dihitung ulang di kode; K._warn bila jawabannya bukan 5. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, ring, hand, alpha, thinkBadge, letter, noteCard } = B;
  const META = { judul: "Kue Dadar", tahun: "2020", negara: "India", kode: "2020-IN-12", flag: "IN", sumber: "Buku Tantangan Bebras Indonesia 2020", bukaFrasa: "Bebras",
    tingkat: "kelas 1, 2, dan 3 SD (SiKecil)",
    langkah: ["Gambar tumpukannya.", "Ikuti setiap langkah: ambil dan taruh dari atas.", "Hitung benda di atas benda yang kamu cari."],
    cta: "Berapa kue dadar yang harus diambil?", gambarUlang: "Kue dadar dan piring digambar ulang untuk video ini." };

  // ---------- data soal: tumpukan dari ATAS ke bawah, "a" = apel, "b" = biasa ----------
  const S0 = ["b", "b", "a"];
  const take = (s, n) => s.slice(n);
  const put = (s, bottomFirst) => bottomFirst.slice().reverse().concat(s);
  const S1 = take(S0, 1), S2 = put(S1, ["a", "b", "b", "b"]), S3 = take(S2, 2), S4 = put(S3, ["b", "b", "b", "b"]);
  const ANS = S4.indexOf("a");
  if (ANS !== 5 || S4.length !== 8 || S4.lastIndexOf("a") !== 7 || S3.join("") !== "baba") (K._warn = K._warn || []).push("data salah: " + S4.join("") + " jawab=" + ANS);
  const STATES = [S0, S1, S2, S3, S4];

  // ---------- gambar ----------
  const YEL = "#F6C945", YEL2 = "#E2A92A", WHITE = "#FFF8EC", WHITE2 = "#E3D6BF";
  function plate(ctx, x, y, w) {
    ctx.fillStyle = "#DDE3E8"; ctx.beginPath(); ctx.ellipse(x, y + w * 0.05, w * 0.62, w * 0.13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#AEB8C0"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, w * 0.62, w * 0.12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#D5DCE2"; ctx.beginPath(); ctx.ellipse(x, y - 2, w * 0.44, w * 0.075, 0, 0, Math.PI * 2); ctx.stroke();
  }
  function cake(ctx, x, y, w, kind, a = 1) {
    alpha(ctx, a, () => {
      const h = w * 0.15, apel = kind === "a";
      ctx.fillStyle = apel ? YEL2 : WHITE2; ctx.beginPath(); ctx.ellipse(x, y + h * 0.18, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = apel ? YEL : WHITE; ctx.strokeStyle = "#6B5A44"; ctx.lineWidth = Math.max(1.5, w * 0.01);
      ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (apel) { ctx.fillStyle = "#FCE48A"; for (const [dx, dy] of [[-0.25, -0.05], [0.05, 0.1], [0.28, -0.08]]) { ctx.beginPath(); ctx.ellipse(x + dx * w, y + dy * h, w * 0.07, h * 0.18, 0.3, 0, Math.PI * 2); ctx.fill(); } }
      else { ctx.strokeStyle = "rgba(170,140,100,0.45)"; ctx.lineWidth = Math.max(1, w * 0.006); ctx.beginPath(); ctx.ellipse(x, y, w * 0.3, h * 0.22, 0, 0, Math.PI * 2); ctx.stroke(); }
    });
  }
  function apple(ctx, x, y, r) {
    ctx.fillStyle = "#E24A3B"; ctx.beginPath(); ctx.arc(x - r * 0.35, y, r * 0.7, 0, Math.PI * 2); ctx.arc(x + r * 0.35, y, r * 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#6B4A2B"; ctx.lineWidth = r * 0.12; ctx.beginPath(); ctx.moveTo(x, y - r * 0.5); ctx.lineTo(x + r * 0.1, y - r * 0.95); ctx.stroke();
    ctx.fillStyle = "#3FA34D"; ctx.beginPath(); ctx.ellipse(x + r * 0.35, y - r * 0.85, r * 0.3, r * 0.14, -0.5, 0, Math.PI * 2); ctx.fill();
  }
  // tumpukan statis: list dari atas ke bawah; mengembalikan fungsi posisi y kue ke-i (dari atas)
  let ST = { x: 540, y: 730, w: 360, gap: 44 };
  const cakeY = (n, i) => ST.y - 22 - (n - 1 - i) * ST.gap;   // i = indeks dari atas, n = banyak kue
  function drawStack(ctx, list, opt = {}) {
    plate(ctx, ST.x, ST.y, ST.w);
    const n = list.length;
    for (let i = n - 1; i >= 0; i--) {
      const lift = opt.lift ? opt.lift(i) : 0, drop = opt.drop ? opt.drop(i) : 0;
      if (lift >= 1 || drop <= -1) continue;
      const y = cakeY(n, i) - lift * 260 - (drop < 0 ? 0 : 0), x = ST.x + lift * 240;
      const yd = drop > 0 ? y - (1 - drop) * 300 : y;
      cake(ctx, x, yd, ST.w, list[i], lift > 0 ? 1 - lift : (opt.drop ? clamp(drop * 2, 0, 1) : 1));
    }
  }
  // animasi satu langkah: from -> to dengan u 0..1 per kue
  function stepAnim(ctx, from, ev, l, t0, gap = 0.55) {
    if (ev.k === "take") {
      drawStack(ctx, from, { lift: i => i < ev.n ? P(l, t0 + i * gap, 0.6) : 0 });
    } else {
      const to = put(from, ev.items), m = ev.items.length;
      // kue baru berada di indeks 0..m-1 (dari atas); urutan jatuh: dari bawah (m-1) ke atas (0)
      drawStack(ctx, to, { drop: i => i < m ? P(l, t0 + (m - 1 - i) * gap, 0.6) : 1 });
    }
  }
  function countMarks(ctx, list, upto, l, t0, col, side = 1, gap = 0.55) {
    const n = list.length;
    for (let i = 0; i < upto; i++) alpha(ctx, P(l, t0 + i * gap, 0.4), () => {
      const x = ST.x + side * (ST.w / 2 + 50), y = cakeY(n, i);
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), x, y + 9, 26, { align: "center", weight: 900, color: "#fff" });
    });
  }
  function mini(ctx, list, x, y, label, a = 1, hl) {
    alpha(ctx, a, () => {
      const sv = ST; ST = { x, y, w: 110, gap: 15 };
      drawStack(ctx, list);
      text(ctx, label, x, y + 46, 24, { align: "center", weight: 900, color: hl ? ORANGE : C.ink2 });
      ST = sv;
    });
  }
  function legend(ctx, x, y, a = 1) {
    alpha(ctx, a, () => {
      cake(ctx, x + 50, y, 90, "a"); text(ctx, "kue dadar apel", x + 115, y + 12, 32, { weight: 900, color: INK });
      cake(ctx, x + 50, y + 62, 90, "b"); text(ctx, "kue dadar biasa", x + 115, y + 74, 32, { weight: 900, color: INK });
    });
  }
  const EVENTS = [
    { k: "take", n: 1, who: "Ali mengambil 1" },
    { k: "put", items: ["a", "b", "b", "b"], who: "Bunda menaruh 4" },
    { k: "take", n: 2, who: "Susi mengambil 2" },
    { k: "put", items: ["b", "b", "b", "b"], who: "Bunda menaruh 4" },
  ];
  const STEPB = ["k2", "k3", "k4", "k5"];
  const STEP_PH = { k2: "mengambil satu", k3: "menaruh satu", k4: "mengambil dua", k5: "menaruh empat" };

  // ---------- adegan utama ----------
  function kue(ctx, b, l) {
    board(ctx);
    ST = { x: 540, y: 730, w: 360, gap: 44 };
    const id = b.id, RX = 1000, RW = 840;
    const si = STEPB.indexOf(id);
    // tumpukan utama
    if (si >= 0) {
      const t0 = at(b, STEP_PH[id]);
      stepAnim(ctx, STATES[si], EVENTS[si], l, t0 + 0.4);
      hand(ctx, EVENTS[si].who, ST.x, 250, 48, { color: ORANGE, alpha: P(l, t0, 0.5) });
      const n = STATES[si + 1].length;
      alpha(ctx, P(l, at(b, "Sekarang"), 0.5), () => { card(ctx, ST.x - 330, 300, 140, 100, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 18 }); text(ctx, String(n), ST.x - 260, 372, 60, { align: "center", weight: 900, color: ORANGE }); });
    } else if (id === "j2") {
      const t0 = at(b, "mengambil lima");
      drawStack(ctx, S4, { lift: i => i < 5 ? P(l, t0 + 0.3 + i * 0.45, 0.6) : 0 });
      alpha(ctx, P(l, at(b, "Setelah itu"), 0.5), () => { const y = cakeY(8, 5); ring(ctx, ST.x, y, ST.w * 0.62, 38, 1, GREEN, 6); hand(ctx, "Sinta dapat!", ST.x, y - 70, 52, { color: GREEN }); });
    } else {
      const list = ["k6", "j1", "j3", "j4", "c2"].includes(id) ? S4 : (id === "k1" || id.startsWith("soal") ? S0 : S4);
      drawStack(ctx, list, id === "soal1" ? { drop: i => P(l, at(b, "tiga kue dadar") + (2 - i) * 0.5, 0.6) } : {});
      if (id === "soal1") { const y = cakeY(3, 2); ring(ctx, ST.x, y, ST.w * 0.62, 36, P(l, at(b, "paling bawah"), 0.6), ORANGE, 6); alpha(ctx, P(l, at(b, "kue dadar apel"), 0.5), () => { apple(ctx, ST.x + 260, y - 10, 34); hand(ctx, "apel", ST.x + 330, y + 4, 40, { color: RED, align: "left" }); }); }
      if (id === "k1") { const y = cakeY(3, 2); ring(ctx, ST.x, y, ST.w * 0.62, 36, P(l, at(b, "Di awal"), 0.6), ORANGE, 6); }
      if (id === "j1") { countMarks(ctx, S4, 5, l, at(b, "Satu,"), GREEN); ring(ctx, ST.x, cakeY(8, 5), ST.w * 0.62, 34, P(l, at(b, "Ada lima"), 0.6), GREEN, 6); }
      if (id === "j4") {
        countMarks(ctx, S4, 7, l, at(b, "Tujuh adalah"), RED, -1, 0.3);
        ring(ctx, ST.x, cakeY(8, 7), ST.w * 0.62, 34, P(l, at(b, "paling bawah"), 0.6), RED, 6);
        countMarks(ctx, S4, 5, l, at(b, "Padahal") - 0.5, GREEN, 1, 0.2);
        ring(ctx, ST.x, cakeY(8, 5), ST.w * 0.62, 34, P(l, at(b, "paling dekat"), 0.6), GREEN, 6);
      }
    }
    // ---------- panel kanan ----------
    if (id === "soal2") {
      hand(ctx, "Sinta ingin kue dadar apel", RX + RW / 2, 230, 46, { color: ORANGE, alpha: P(l, 0.3, 0.5) });
      alpha(ctx, P(l, at(b, "hanya boleh"), 0.5), () => {
        card(ctx, RX + 120, 300, RW - 240, 130, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 20 });
        text(ctx, "ambil dari paling atas", RX + RW / 2, 380, 46, { align: "center", weight: 900, color: INK });
        mline(ctx, [[ST.x + 200, cakeY(3, 0)], [ST.x + 200, cakeY(3, 0) - 160]], 1, GREEN, 8, true);
      });
    }
    if (id === "soal3" || id === "soal4") {
      const L = [["1. Ali mengambil 1 kue dadar.", "Ali mengambil"], ["2. Bunda menaruh 1 apel, lalu 3 biasa.", "Kedua"], ["3. Susi mengambil 2 kue dadar.", "Ketiga"], ["4. Bunda menaruh 4 kue dadar biasa.", "Keempat"]];
      L.forEach(([s, ph], i) => { const a = id === "soal4" && i < 2 ? 1 : (id === "soal3" && i >= 2 ? 0 : P(l, at(b, ph), 0.5)); alpha(ctx, a, () => text(ctx, s, RX + 20, 230 + i * 90, 38, { weight: 800, color: INK, fit: RW - 30 })); });
    }
    if (id === "soal5") {
      card(ctx, RX, 170, RW, 170, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Paling sedikit, berapa kue dadar", RX + RW / 2, 238, 40, { align: "center", weight: 900, color: INK, fit: RW - 40 });
      text(ctx, "diambil dulu supaya Sinta dapat apel?", RX + RW / 2, 296, 40, { align: "center", weight: 900, color: INK, fit: RW - 40 });
      ["5", "6", "7", "8"].forEach((o, i) => alpha(ctx, P(l, at(b, "ABCD"[i] + " " + ["lima", "enam", "tujuh", "delapan"][i]), 0.4), () => { const x = RX + 80 + i * 190, y = 470; letter(ctx, "ABCD"[i], x + 30, y - 20, 32, false); text(ctx, o, x + 80, y, 64, { weight: 900, color: INK }); }));
    }
    if (id === "k1") { legend(ctx, RX + 60, 230, P(l, at(b, "warna kuning"), 0.5)); }
    if (si >= 0 || id === "k1" || id === "k6") {
      // riwayat tumpukan
      const upto = si >= 0 ? si + 1 : (id === "k1" ? 0 : 4), labels = ["awal", "1", "2", "3", "4"];
      for (let i = 0; i <= upto; i++) mini(ctx, STATES[i], RX + 90 + i * 170, 700, labels[i], i === upto && si >= 0 ? P(l, at(b, "Sekarang"), 0.5) : 1, i === upto);
      if (si >= 0 || id === "k6") text(ctx, "riwayat tumpukan", RX + RW / 2, 440, 32, { align: "center", weight: 800, color: C.ink2 });
    }
    if (id === "k6") thinkBadge(ctx, RX + 20, 200, RW - 40, 170, l, b.hold + 2, "Berapa kue di atas apel teratas?");
    if (id === "j3") alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => {
      ["5", "6", "7", "8"].forEach((o, i) => { const x = RX + 80 + i * 190, y = 290; letter(ctx, "ABCD"[i], x + 30, y - 20, 32, i === 0); text(ctx, o, x + 80, y, 64, { weight: 900, color: INK }); });
      ring(ctx, RX + 145, 270, 95, 55, P(l, at(b, "jawabannya"), 0.6), GREEN, 6);
      card(ctx, RX + 170, 420, RW - 340, 150, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 });
      text(ctx, "Jawaban: A. 5", RX + RW / 2, 515, 60, { align: "center", weight: 900, color: GREEN });
    });
    if (id === "j4") {
      alpha(ctx, P(l, at(b, "Tujuh adalah"), 0.5), () => text(ctx, "7 = ke apel paling bawah", RX + RW / 2, 280, 44, { align: "center", weight: 900, color: RED }));
      alpha(ctx, P(l, at(b, "Padahal"), 0.5), () => text(ctx, "5 = ke apel paling atas", RX + RW / 2, 380, 44, { align: "center", weight: 900, color: GREEN }));
      alpha(ctx, P(l, at(b, "cukup mendapat"), 0.5), () => hand(ctx, "cukup satu apel!", RX + RW / 2, 490, 48, { color: ORANGE }));
    }
    if (id === "c2") {
      hand(ctx, "stack", RX + RW / 2, 260, 110, { color: ORANGE, alpha: P(l, at(b, "disebut stack"), 0.5) });
      alpha(ctx, P(l, at(b, "tombol undo"), 0.5), () => {
        const x = RX + RW / 2, y = 440; card(ctx, x - 110, y - 80, 220, 160, { fill: "#F7F9FA", stroke: INK, lw: 4, r: 24 });
        ctx.strokeStyle = "#2F6FD0"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(x + 10, y + 10, 45, Math.PI * 1.05, Math.PI * 0.35, false); ctx.stroke();
        ctx.fillStyle = "#2F6FD0"; ctx.beginPath(); ctx.moveTo(x - 62, y - 20); ctx.lineTo(x - 22, y - 2); ctx.lineTo(x - 54, y + 30); ctx.closePath(); ctx.fill();
        text(ctx, "undo", x, y + 130, 38, { align: "center", weight: 900, color: INK });
      });
    }
  }

  // ---------- pemanasan: tumpukan buku ----------
  const BOOKS = ["#E07AA0", "#4F8FD8", "#6BB36B", "#F2B134"];
  function book(ctx, x, y, col, label, a = 1) {
    alpha(ctx, a, () => {
      ctx.fillStyle = col; rr(ctx, x - 170, y - 28, 340, 56, 8); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + 120, y - 20, 34, 40);
      if (label) text(ctx, label, x - 20, y + 11, 28, { align: "center", weight: 900, color: "#fff" });
    });
  }
  function buku(ctx, b, l) {
    board(ctx);
    const id = b.id, X = 560, Y0 = 690;
    ctx.fillStyle = "#B98458"; ctx.fillRect(X - 300, Y0 + 32, 600, 22);
    if (id === "w1") {
      const t0 = at(b, "mengangkat");
      BOOKS.forEach((c, i) => { const k = 3 - i, u = k > 0 ? P(l, t0 + (3 - k) * 0.8, 0.7) : 0; book(ctx, X + u * 560, Y0 - i * 60 - u * 200, c, i === 0 ? "yang dicari" : "", u > 0 ? 1 - u * 0.7 : 1); });
      ring(ctx, X, Y0, 200, 46, P(l, at(b, "paling bawah"), 0.6), ORANGE, 6);
      hand(ctx, "angkat dari atas, satu per satu", 1380, 330, 46, { color: ORANGE, alpha: P(l, t0, 0.5) });
    } else {
      const tPut = at(b, "terakhir ditaruh"), tTake = at(b, "pertama diambil");
      BOOKS.slice(0, 3).forEach((c, i) => book(ctx, X, Y0 - i * 60, c));
      const down = P(l, tPut - 0.2, 0.8), up = P(l, tTake, 0.8);
      book(ctx, X + up * 500, Y0 - 3 * 60 - (1 - down) * 260 - up * 200, BOOKS[3], "baru", down);
      alpha(ctx, P(l, tPut, 0.5), () => { card(ctx, 1080, 260, 720, 220, { fill: "#FFF8E8", stroke: ORANGE, lw: 4, r: 22 }); text(ctx, "terakhir ditaruh,", 1440, 350, 50, { align: "center", weight: 900, color: INK }); text(ctx, "pertama diambil", 1440, 420, 50, { align: "center", weight: 900, color: ORANGE }); });
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function kue_v(ctx, b, l) {
    board(ctx);
    ST = { x: 960, y: 610, w: 280, gap: 36 };
    const id = b.id, TX = 960;
    if (id === "h0") {
      const t1 = at(b, "Ali mengambil"), t2 = at(b, "Bunda menaruh");
      if (l < t2) { if (l < t1) drawStack(ctx, S0); else stepAnim(ctx, S0, EVENTS[0], l, t1 + 0.3); }
      else stepAnim(ctx, S1, EVENTS[1], l, t2 + 0.3, 0.4);
      const lab = l < t1 ? "ambil dari atas" : l < t2 ? "Ali mengambil 1" : "Bunda menaruh 4";
      hand(ctx, lab, TX, 720, 46, { color: ORANGE });
    }
    if (id === "h1") {
      const t1 = at(b, "Susi mengambil"), t2 = at(b, "Bunda menaruh"), tq = at(b, "Paling sedikit");
      if (l < t2) stepAnim(ctx, S2, EVENTS[2], l, t1 + 0.3, 0.4); else stepAnim(ctx, S3, EVENTS[3], l, t2 + 0.3, 0.35);
      if (l < tq) hand(ctx, l < t2 ? "Susi mengambil 2" : "Bunda menaruh 4", TX, 720, 46, { color: ORANGE });
      else thinkBadge(ctx, 610, 690, 700, 110, l - tq, b.hold + 4, "");
    }
    if (id === "h2") { drawStack(ctx, S4); countMarks(ctx, S4, 5, l, at(b, "Satu,"), GREEN); alpha(ctx, P(l, 0.3, 0.5), () => text(ctx, "8 kue dadar", TX, 730, 48, { align: "center", weight: 900, color: INK })); }
    if (id === "h3") {
      drawStack(ctx, S4, { lift: i => i < 5 ? P(l, 0.2 + i * 0.3, 0.5) : 0 });
      ring(ctx, ST.x, cakeY(8, 5), ST.w * 0.62, 32, P(l, 1.8, 0.5), GREEN, 6);
      alpha(ctx, P(l, at(b, "jawabannya"), 0.5), () => text(ctx, "Jawaban: 5 kue dadar", TX, 740, 56, { align: "center", weight: 900, color: GREEN }));
    }
  }

  Object.assign(K.SCENES, B.umum(META), { kue, buku, kue_v });
})(typeof window !== "undefined" ? window : globalThis);
