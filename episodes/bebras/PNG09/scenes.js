/* PNG09 Pembahasan Soal Bebras 2018-CY-03 "Antrian Mobil" (Siprus), kategori Penggalang (SMP).
   Papan tulis: jalan masuk sempit dan buntu (tampak atas), mobil masuk maju dan keluar mundur ke jalan raya,
   tabel jadwal, dan catatan isi jalan pada akhir setiap hari. Isi akhir dihitung ulang di kode (harus Ari, Kati, Vino)
   dan dilaporkan lewat K._warn bila berbeda. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, B = K.BEBRAS;
  const { text, card, clamp, lerp, rr } = H;
  const { INK, ORANGE, GREEN, RED, at, P, board, mline, tick, cross, ring, hand, alpha, thinkBadge, letter, tw } = B;
  const META = { judul: "Antrian Mobil", tahun: "2018", negara: "Siprus", kode: "2018-CY-03", flag: "CY", sumber: "Buku Tantangan Bebras Indonesia 2018", bukaFrasa: "Bebras",
    tingkat: "kelas 7, 8, dan 9 SMP (Penggalang)",
    langkah: ["Pahami di mana pintu masuk dan pintu keluarnya.", "Gambar isinya hari demi hari; catat siapa yang paling dekat pintu.", "Cocokkan hasil akhirnya dengan pilihan jawaban."],
    cta: "Mobil siapa yang tersisa pada hari Jumat?", gambarUlang: "Jalan, mobil, dan tabel digambar ulang untuk video ini." };

  // ---------- data soal ----------
  const DAYS = [["Senin", 0, ["Ari", "Bob"]], ["Selasa", 1, ["Kati", "Ben", "Roi"]], ["Rabu", 2, ["Desi"]], ["Kamis", 0, ["Fina", "Rosa"]], ["Jumat", 3, ["Vino"]]];
  const COLS = { Ari: "#E0473B", Bob: "#3B78D8", Kati: "#F2C230", Ben: "#3FA34D", Roi: "#8E5BD6", Desi: "#EE7A12", Fina: "#E06B8B", Rosa: "#1BA39C", Vino: "#5C6670", "1": "#AEB8C1", "2": "#AEB8C1", "3": "#AEB8C1" };
  const OPTS = [["Bob", "Vino", "Desi"], ["Vino", "Ari", "Rosa"], ["Ari", "Kati", "Vino"], ["Ari", "Vino", "Bob"]];
  const END = []; // isi jalan pada akhir setiap hari (dari dalam ke pintu)
  (function () {
    const st = [];
    DAYS.forEach(([d, out, ins]) => { for (let i = 0; i < out; i++) st.pop(); ins.forEach(n => st.push(n)); END.push(st.slice()); });
    if (END[4].join() !== "Ari,Kati,Vino") (K._warn = K._warn || []).push("simulasi salah: " + END[4].join());
  })();
  const OUTS = [[], ["Bob"], ["Roi", "Ben"], [], ["Rosa", "Fina", "Desi"]];   // dipakai untuk narasi; diperiksa di bawah
  (function () { const st = []; DAYS.forEach(([d, out, ins], i) => { const o = []; for (let k = 0; k < out; k++) o.push(st.pop()); if (o.join() !== OUTS[i].join()) (K._warn = K._warn || []).push("keluar salah " + d); ins.forEach(n => st.push(n)); }); })();

  // ---------- gambar jalan (koordinat lokal: aspal x 0–1340, y −60–60; jalan raya x 1340–1480) ----------
  const CW = 240, SX = i => 20 + i * 262, STREET = 1420;
  function car(ctx, x, y, name, a = 1, w = CW) {
    if (a <= 0) return;
    alpha(ctx, a, () => {
      const c = COLS[name] || "#AEB8C1", h = 92;
      ctx.fillStyle = "rgba(0,0,0,0.15)"; rr(ctx, x + 4, y - h / 2 + 6, w, h, 22); ctx.fill();
      ctx.fillStyle = c; rr(ctx, x, y - h / 2, w, h, 22); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "rgba(30,40,50,0.75)"; rr(ctx, x + 22, y - h / 2 + 12, 34, h - 24, 8); ctx.fill();   // kaca depan (menghadap ke dalam)
      rr(ctx, x + w - 44, y - h / 2 + 14, 24, h - 28, 6); ctx.fill();
      const dark = name === "Kati";
      text(ctx, name, x + w / 2 + 10, y + 13, name.length > 1 ? 38 : 40, { align: "center", weight: 900, color: dark ? INK : "#fff" });
    });
  }
  function drive(ctx, ox, oy, s, cars, opt = {}) {
    ctx.save(); ctx.translate(ox, oy); ctx.scale(s, s);
    ctx.fillStyle = "#B98458"; rr(ctx, -120, -90, 110, 180, 10); ctx.fill();   // rumah Ari (ujung buntu)
    ctx.fillStyle = "#8F5E35"; ctx.beginPath(); ctx.moveTo(-130, -90); ctx.lineTo(-65, -132); ctx.lineTo(0, -90); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#7B8790"; ctx.fillRect(0, -66, 1340, 132);
    ctx.strokeStyle = "#5C6670"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -66); ctx.lineTo(1340, -66); ctx.moveTo(0, 66); ctx.lineTo(1340, 66); ctx.stroke();
    ctx.fillStyle = "#6A757E"; ctx.fillRect(1340, -150, 150, 300);   // jalan raya
    ctx.strokeStyle = "#F4F1E8"; ctx.lineWidth = 5; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(1415, -150); ctx.lineTo(1415, 150); ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.beginPath(); ctx.rect(0, -150, 1490, 300); ctx.clip();
    cars.forEach(c => car(ctx, c.x, 0, c.name, c.a));
    ctx.restore();
    if (opt.labels) alpha(ctx, opt.labels, () => {
      text(ctx, "rumah Ari", -65, 130, 30, { align: "center", weight: 800, color: INK });
      ctx.save(); ctx.translate(1530, 0); ctx.rotate(-Math.PI / 2); text(ctx, "jalan raya", 0, 10, 30, { align: "center", weight: 800, color: INK }); ctx.restore();
    });
    ctx.restore();
  }
  // isi jalan dari daftar kejadian. done: kejadian yang sudah selesai; now: [{k:"in"|"out", n, t}] di beat ini
  function sim(start, now, l) {
    const st = start.slice(), cars = [];
    let anim = null;
    for (const e of now) {
      const u = clamp((l - e.t) / 1.0, 0, 1);
      if (u >= 1) { if (e.k === "in") st.push(e.n); else st.pop(); continue; }
      if (u > 0) anim = { e, u };
      break;
    }
    st.forEach((n, i) => cars.push({ name: n, x: SX(i), a: 1 }));
    if (anim) {
      const { e, u } = anim, v = H.ease ? H.ease(u) : u;
      if (e.k === "in") cars.push({ name: e.n, x: lerp(STREET + 40, SX(st.length), v), a: clamp(u * 3, 0, 1) });
      else { const c = cars.pop(); cars.push({ name: c.name, x: lerp(c.x, STREET + 40, v), a: 1 - clamp((u - 0.7) / 0.3, 0, 1) }); }
    }
    return { st, cars };
  }

  // tabel jadwal
  const TX = 100, TY = 450, TW = [190, 170, 170, 400], TH = 54;
  function table(ctx, rowA, hl = () => 0, opt = {}) {
    const W = TW.reduce((a, v) => a + v, 0);
    ctx.fillStyle = "#EEF2F5"; rr(ctx, TX, TY, W, 46, 10); ctx.fill();
    ["Hari", "Keluar", "Masuk", "Urutan masuk"].forEach((h, i) => text(ctx, h, TX + TW.slice(0, i).reduce((a, v) => a + v, 0) + 18, TY + 33, 30, { weight: 900, color: INK }));
    if (opt.ringOut) ring(ctx, TX + TW[0] + 66, TY + 23, 84, 30, opt.ringOut, ORANGE, 5);
    DAYS.forEach(([d, out, ins], r) => {
      const a = rowA(r); if (a <= 0) return;
      alpha(ctx, a, () => {
        const y = TY + 46 + r * TH, h = hl(r);
        if (h > 0) { ctx.fillStyle = `rgba(242,177,52,${0.3 * h})`; ctx.fillRect(TX, y + 2, W, TH - 4); }
        let x = TX;
        text(ctx, d, x + 18, y + 38, 34, { weight: 800, color: INK }); x += TW[0];
        text(ctx, String(out), x + 70, y + 38, 36, { weight: 900, color: out ? RED : INK }); x += TW[1];
        text(ctx, String(ins.length), x + 70, y + 38, 36, { weight: 900, color: GREEN }); x += TW[2];
        text(ctx, ins.join(", "), x + 18, y + 38, 34, { weight: 800, color: INK });
        ctx.strokeStyle = "#D5DCE1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(TX, y + TH); ctx.lineTo(TX + W, y + TH); ctx.stroke();
      });
    });
  }
  // catatan isi jalan pada akhir hari
  const LX = 1110;
  function logList(ctx, aDay) {
    text(ctx, "Isi jalan (dari dalam → pintu)", LX, 482, 30, { weight: 900, color: C.accentDark });
    END.forEach((st, r) => {
      const a = aDay(r); if (a <= 0) return;
      alpha(ctx, a, () => {
        const y = 534 + r * 52;
        text(ctx, DAYS[r][0] + ":", LX, y, 30, { weight: 900, color: INK });
        let x = LX + 130;
        st.forEach((n, i) => { ctx.fillStyle = COLS[n]; rr(ctx, x, y - 30, tw(ctx, n, 28, 900) + 24, 40, 10); ctx.fill(); text(ctx, n, x + 12, y - 1, 28, { weight: 900, color: n === "Kati" ? INK : "#fff" }); x += tw(ctx, n, 28, 900) + 34; });
      });
    });
  }
  function options(ctx, x, y, marks = {}) {
    OPTS.forEach((o, i) => {
      const yy = y + i * 64;
      letter(ctx, "ABCD"[i], x + 24, yy - 12, 24, false);
      text(ctx, o.join(", "), x + 62, yy, 36, { weight: 800, color: INK });
      const m = marks[i]; if (!m) return;
      const w = tw(ctx, o.join(", "), 36, 800) + 70;
      if (m.k === "x") mline(ctx, [[x - 6, yy - 12], [x + w, yy - 12]], m.u, RED, 5);
      if (m.k === "ok") ring(ctx, x + w / 2, yy - 12, w / 2 + 16, 34, m.u, GREEN, 5);
    });
  }

  // kejadian per beat
  function events(b) {
    const id = b.id, A = (s, f) => at(b, s, f);
    if (id === "soal4") return [{ k: "in", n: "Ari", t: A("Ari masuk") }, { k: "in", n: "Bob", t: A("disusul Bob") }];
    if (id === "d1") return [{ k: "in", n: "Ari", t: A("Ari masuk") }, { k: "in", n: "Bob", t: A("Lalu Bob masuk") }];
    if (id === "d2") return [{ k: "out", n: "Bob", t: A("jadi Bob yang keluar") }, { k: "in", n: "Kati", t: A("Kati,") }, { k: "in", n: "Ben", t: A("Ben,", "Kati,") }, { k: "in", n: "Roi", t: A("Roi masuk") }];
    if (id === "d3") return [{ k: "out", n: "Roi", t: A("Roi, lalu") }, { k: "out", n: "Ben", t: A("lalu Ben") }, { k: "in", n: "Desi", t: A("Desi masuk") }];
    if (id === "d5") return [{ k: "in", n: "Fina", t: A("Fina masuk") }, { k: "in", n: "Rosa", t: A("lalu Rosa") }];
    if (id === "d6") return [{ k: "out", n: "Rosa", t: A("Rosa, lalu") }, { k: "out", n: "Fina", t: A("lalu Fina") }, { k: "out", n: "Desi", t: A("lalu Desi") }, { k: "in", n: "Vino", t: A("Vino masuk") }];
    return [];
  }
  const START = { soal5: END[0], soal6: END[0], k1: END[0], k3: END[0], d2: END[0], d3: END[1], d4: END[2], d5: END[2], d6: END[3], j1: END[4], j2: END[4], c2: END[4], c3: END[4] };
  const SEQ = ["d1", "d2", "d3", "d4", "d5", "d6", "j1", "j2", "c2", "c3"];
  const DAYOF = { d1: 0, d2: 1, d3: 2, d5: 3, d6: 4 };

  // ---------- adegan utama ----------
  function jalan(ctx, b, l) {
    board(ctx);
    const id = b.id;
    let cars = [];
    if (id === "soal2" || id === "k2") {
      const t0 = id === "soal2" ? at(b, "Para tetangga") : -9;
      cars = sim([], ["1", "2", "3"].map((n, i) => ({ k: "in", n, t: t0 + i * 1.1 })), l).cars;
    } else cars = sim(START[id] || [], events(b), l).cars;
    if (id !== "c2") drive(ctx, 260, 290, 1, cars, { labels: id === "soal1" ? P(l, at(b, "halaman rumahnya"), 0.5) : 1 });
    // label soal1
    if (id === "soal1") {
      hand(ctx, "ujung buntu", 470, 430, 44, { color: RED, alpha: P(l, at(b, "ujungnya buntu"), 0.5) });
      alpha(ctx, P(l, at(b, "Pintunya"), 0.5), () => { hand(ctx, "pintu", 1440, 560, 48, { color: GREEN }); mline(ctx, [[1490, 520], [1585, 370]], 1, GREEN, 6, true); });
      hand(ctx, "jalan sempit dan panjang", 1010, 430, 44, { color: INK, alpha: P(l, at(b, "sempit"), 0.5) });
    }
    if (id === "soal2") {
      alpha(ctx, P(l, at(b, "keluar dengan cara mundur"), 0.5), () => { mline(ctx, [[SX(2) + 260, 400], [STREET + 200, 400]], 1, ORANGE, 7, true); hand(ctx, "keluar = mundur", 1100, 470, 40, { color: ORANGE }); });
      ring(ctx, 260 + SX(2) + CW / 2, 290, 160, 72, P(l, at(b, "masuk terakhir"), 0.6), GREEN, 6);
      hand(ctx, "masuk terakhir = paling dekat pintu", 960, 600, 46, { color: GREEN, alpha: P(l, at(b, "paling dekat"), 0.5) });
    }
    if (id === "k2") {
      tick(ctx, 260 + SX(2) + CW / 2, 400, 70, P(l, at(b, "yang bisa keluar"), 0.5), GREEN);
      hand(ctx, "bisa keluar", 260 + SX(2) + CW / 2, 480, 40, { color: GREEN, alpha: P(l, at(b, "yang bisa keluar"), 0.5) });
      const tb = at(b, "terhalang");
      [0, 1].forEach(i => cross(ctx, 260 + SX(i) + CW / 2, 290, 90, P(l, tb + i * 0.3, 0.5), RED, 9));
      hand(ctx, "terhalang", 260 + SX(0) + CW + 10, 480, 40, { color: RED, alpha: P(l, tb, 0.5) });
      hand(ctx, "masuk terakhir, keluar pertama", 960, 640, 54, { color: ORANGE, alpha: P(l, at(b, "sampai mobil"), 0.5) });
    }
    if (id === "soal3") alpha(ctx, P(l, at(b, "Setiap pagi"), 0.5), () => {
      card(ctx, 360, 470, 1200, 200, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 22 });
      text(ctx, "Setiap pagi:", 960, 540, 44, { align: "center", weight: 900, color: INK });
      text(ctx, "1) yang pergi keluar dulu,   2) baru yang lain masuk", 960, 620, 42, { align: "center", weight: 800, color: INK, fit: 1140 });
    });
    // tabel
    const tabRows = { soal4: r => r < 3 ? P(l, at(b, ["hari Senin", "hari Selasa", "hari Rabu"][r]), 0.4) : 0, soal5: r => r < 3 ? 1 : P(l, at(b, ["hari Kamis", "hari Jumat"][r - 3] || "x"), 0.4) };
    if (["soal4", "soal5", "soal6", "k1", "k3", "d1", "d2", "d3", "d4", "d5", "d6"].includes(id)) {
      const hl = r => (id === "k3" && r === 1) || (id === "d4" && r >= 3) || (DAYOF[id] === r) ? 1 : 0;
      table(ctx, tabRows[id] || (() => 1), hl, { ringOut: id === "k1" ? P(l, at(b, "tidak menyebut"), 0.6) : 0 });
    }
    if (id === "k1") {
      hand(ctx, "siapa yang keluar?", 1300, 560, 54, { color: ORANGE, alpha: P(l, at(b, "mencari tahu"), 0.5) });
      hand(ctx, "hanya jumlahnya", 1300, 660, 44, { color: INK, alpha: P(l, at(b, "jumlahnya"), 0.5) });
    }
    // kanan bawah
    if (id === "soal6" || id === "j1" || id === "j2") {
      if (id === "soal6") { text(ctx, "Siapa yang masih parkir pada akhir Jumat?", LX, 482, 32, { weight: 900, color: INK, fit: 880 }); }
      const ox = id === "soal6" ? LX : 260;
      if (id !== "soal6") text(ctx, "Siapa yang masih parkir pada akhir Jumat?", 260, 482, 32, { weight: 900, color: INK });
      const marks = {};
      if (id === "j1") marks[2] = { k: "ok", u: P(l, at(b, "Jawabannya"), 0.5) };
      if (id === "j2") { marks[2] = { k: "ok", u: 1 }; [0, 1, 3].forEach((i, j) => marks[i] = { k: "x", u: P(l, at(b, "Pilihan lain") + 0.4 + j * 0.3, 0.5) }); }
      options(ctx, ox, 545, id === "soal6" ? {} : marks);
      if (id === "soal6") OPTS.forEach((o, i) => { const a = 1 - P(l, at(b, "Pilihan " + "ABCD"[i]), 0.4); if (a > 0) { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(LX - 10, 545 + i * 64 - 44, 740, 60); } });
      if (id === "j1") alpha(ctx, P(l, at(b, "Jawabannya"), 0.5), () => { card(ctx, 1080, 520, 700, 140, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 }); text(ctx, "Jawaban: C. Ari, Kati, Vino", 1430, 608, 46, { align: "center", weight: 900, color: GREEN, fit: 660 }); });
      if (id === "j2") {
        const rows = [["Bob keluar hari Selasa", "Bob sudah keluar"], ["Desi keluar hari Jumat", "Desi dan Rosa"], ["Rosa keluar hari Jumat", "Desi dan Rosa"], ["Ari selalu paling dalam", "Ari tidak pernah"]];
        rows.forEach(([s, ph], i) => alpha(ctx, P(l, at(b, ph) + (i === 2 ? 0.4 : 0), 0.5), () => text(ctx, s, 1100, 520 + i * 64, 34, { weight: 800, color: i === 3 ? GREEN : RED })));
      }
    }
    if (["k3", "d1", "d2", "d3", "d4", "d5", "d6"].includes(id)) {
      if (id === "k3" || id === "d4") thinkBadge(ctx, LX, 520, 720, 160, l, b.hold + 2, id === "k3" ? "Selasa: mobil siapa yang keluar?" : "Siapa yang tersisa pada akhir Jumat?");
      else {
        const k = DAYOF[id];
        logList(ctx, r => r < k ? 1 : r === k ? P(l, at(b, "Akhir " + DAYS[k][0]), 0.5) : 0);
      }
    }
    if (id === "c3") { logList(ctx, () => 1); }
    if (id === "c2") {
      // tumpukan tegak
      const bx = 560, by = 720;
      END[4].forEach((n, i) => { ctx.fillStyle = COLS[n]; rr(ctx, bx, by - (i + 1) * 74, 260, 66, 12); ctx.fill(); text(ctx, n, bx + 130, by - (i + 1) * 74 + 45, 34, { align: "center", weight: 900, color: n === "Kati" ? INK : "#fff" }); });
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx - 14, by - 300); ctx.lineTo(bx - 14, by + 8); ctx.lineTo(bx + 274, by + 8); ctx.lineTo(bx + 274, by - 300); ctx.stroke();
      hand(ctx, "stack", bx + 130, by - 320, 48, { color: ORANGE, alpha: P(l, at(b, "stack"), 0.5) });
      alpha(ctx, P(l, at(b, "push"), 0.5), () => { mline(ctx, [[bx + 360, by - 400], [bx + 300, by - 250]], 1, GREEN, 7, true); hand(ctx, "push (masuk)", bx + 470, by - 410, 40, { color: GREEN }); });
      alpha(ctx, P(l, at(b, "pop"), 0.5), () => { mline(ctx, [[bx - 40, by - 250], [bx - 100, by - 400]], 1, RED, 7, true); hand(ctx, "pop (keluar)", bx - 60, by - 420, 40, { color: RED }); });
      alpha(ctx, P(l, at(b, "undo"), 0.5), () => {
        card(ctx, 1400, 470, 220, 120, { fill: "#F7F9FA", stroke: INK, lw: 4, r: 20 });
        ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(1510, 540, 30, Math.PI * 1.1, Math.PI * 0.2, false); ctx.stroke();
        ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(1462, 510); ctx.lineTo(1492, 518); ctx.lineTo(1470, 540); ctx.closePath(); ctx.fill();
        text(ctx, "undo", 1510, 640, 40, { align: "center", weight: 900, color: INK });
        hand(ctx, "batalkan langkah terakhir", 1510, 710, 38, { color: ORANGE });
      });
    }
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–830) ----------
  function jalan_v(ctx, b, l) {
    board(ctx);
    const id = b.id, A = (s, f) => at(b, s, f);
    let start = [], ev = [];
    if (id === "h0") { ev = [{ k: "in", n: "1", t: 0.6 }, { k: "in", n: "2", t: 1.7 }, { k: "in", n: "3", t: 2.8 }]; }
    if (id === "h1") { start = []; }
    if (id === "h2") { start = END[0]; const t = A("yang keluar adalah Bob"); const tr = A("yang keluar adalah Roi"); ev = [{ k: "out", n: "Bob", t }, { k: "in", n: "Kati", t: t + 1.2 }, { k: "in", n: "Ben", t: t + 2.2 }, { k: "in", n: "Roi", t: t + 3.2 }, { k: "out", n: "Roi", t: Math.max(tr, t + 4.3) }, { k: "out", n: "Ben", t: Math.max(A("lalu Ben"), t + 5.4) }, { k: "in", n: "Desi", t: Math.max(A("lalu Ben"), t + 5.4) + 1.2 }]; }
    if (id === "h3") { start = END[2]; ev = [{ k: "in", n: "Fina", t: 0.1 }, { k: "in", n: "Rosa", t: 1.0 }, { k: "out", n: "Rosa", t: Math.max(2.1, A("Rosa")) }, { k: "out", n: "Fina", t: Math.max(3.2, A("Fina")) }, { k: "out", n: "Desi", t: Math.max(4.3, A("lalu Desi")) }, { k: "in", n: "Vino", t: Math.max(5.4, A("Vino masuk")) }]; }
    if (id === "h4") start = END[4];
    const { cars } = sim(start, ev, l);
    drive(ctx, 575, 290, 0.6, cars, { labels: 1 });
    if (id === "h0") {
      hand(ctx, "ujung buntu", 700, 400, 40, { color: RED });
      alpha(ctx, P(l, A("keluar dengan mundur"), 0.5), () => { text(ctx, "keluar hanya dengan mundur", 960, 490, 40, { align: "center", weight: 900, color: ORANGE }); });
      alpha(ctx, P(l, A("masuk terakhir"), 0.5), () => { text(ctx, "masuk terakhir = keluar pertama", 960, 560, 42, { align: "center", weight: 900, color: GREEN }); });
    }
    if (id === "h1" || id === "h2" || id === "h3") {
      const show = id === "h1" ? (r => P(l, A(["Senin", "Selasa", "Rabu", "Kamis", "Jumat"][r]), 0.4)) : (() => 1);
      DAYS.forEach(([d, out, ins], r) => alpha(ctx, show(r), () => {
        const y = 440 + r * 56, hl = (id === "h2" && (r === 1 || r === 2)) || (id === "h3" && r >= 3);
        if (hl) { ctx.fillStyle = "rgba(242,177,52,0.3)"; ctx.fillRect(500, y - 38, 920, 52); }
        text(ctx, d, 520, y, 32, { weight: 900, color: INK });
        text(ctx, out ? out + " keluar" : "—", 700, y, 30, { weight: 800, color: out ? RED : "#8A949C" });
        text(ctx, "masuk " + ins.join(", "), 880, y, 30, { weight: 800, color: GREEN, fit: 520 });
      }));
      if (id === "h1") alpha(ctx, P(l, A("Siapa yang tersisa"), 0.5), () => OPTS.forEach((o, i) => { const x = 520 + (i % 2) * 470, y = 740 + Math.floor(i / 2) * 56; letter(ctx, "ABCD"[i], x + 20, y - 10, 20, false); text(ctx, o.join(", "), x + 50, y, 30, { weight: 800, color: INK }); }));
    }
    if (id === "h4") {
      text(ctx, "Akhir Jumat: Ari, Kati, Vino", 960, 500, 48, { align: "center", weight: 900, color: GREEN });
      alpha(ctx, P(l, A("Jawabannya"), 0.5), () => text(ctx, "Jawaban: C", 960, 590, 56, { align: "center", weight: 900, color: GREEN }));
      alpha(ctx, P(l, A("stack"), 0.5), () => { text(ctx, "stack:", 960, 690, 42, { align: "center", weight: 900, color: ORANGE }); text(ctx, "masuk terakhir, keluar pertama", 960, 750, 40, { align: "center", weight: 800, color: INK }); });
    }
  }

  Object.assign(K.SCENES, B.umum(META), { jalan, jalan_v });
})(typeof window !== "undefined" ? window : globalThis);
