/* ON06 Perjalanan ke Timur (OSN-K 2025 SMA no. 14–16): menghitung rute di graf berarah dengan pemrograman dinamis.
   Waktu gambar ditempelkan pada kata lewat at(b, "kata", n). */
(function () {
  const { C } = Kiko; const H = Kiko.helpers; const U = Kiko.U;
  const { rr, text, para, panel, label, chip, check, cross, arrow, strike, hilite, ease, clamp, lerp, ap, at, speechEnd } = H;
  const { fadeIn, bigNote, note, heading } = U;

  const N = { A: [190, 460], B: [500, 460], C: [840, 220], D: [860, 460], E: [760, 670], F: [1180, 670], G: [1380, 470], H: [1720, 470] };
  const R = 36;
  // [dari, ke, lengkung tiap lajur, bergembok]
  const E = [["A", "B", [-55, 55]], ["B", "C", [-40]], ["B", "D", [-60, 0, 60]], ["B", "E", [40]], ["C", "G", [-40]],
    ["D", "G", [-60, 60]], ["D", "G", [0], true], ["E", "D", [-30], true], ["D", "F", [-30], true], ["E", "F", [-55, 0, 55]], ["F", "G", [40]], ["G", "H", [-55, 0, 55]]];
  const P14 = { A: 1, B: 2, C: 2, D: 6, E: 2, F: 6, G: 20, H: 60 };
  const P15 = { A: 1, B: 2, C: 2, D: 8, E: 2, F: 14, G: 40, H: 120 };

  function lock(ctx, x, y, open, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = open ? C.green : C.ink; rr(ctx, -14, -6, 28, 22, 4); ctx.fill();
    ctx.strokeStyle = open ? C.green : C.ink; ctx.lineWidth = 4; ctx.beginPath();
    if (open) ctx.arc(-14, -6, 9, Math.PI, Math.PI * 2); else ctx.arc(0, -6, 9, Math.PI, Math.PI * 2);
    ctx.stroke(); ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, 4, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function curve(a, b, off) {
    const [x1, y1] = N[a], [x2, y2] = N[b]; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const px = -dy / L, py = dx / L; const cx = (x1 + x2) / 2 + px * off * 2, cy = (y1 + y2) / 2 + py * off * 2;
    const pt = t => [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2];
    // potong di tepi lingkaran titik
    let t0 = 0, t1 = 1; while (Math.hypot(pt(t0)[0] - x1, pt(t0)[1] - y1) < R + 4) t0 += 0.005; while (Math.hypot(pt(t1)[0] - x2, pt(t1)[1] - y2) < R + 6) t1 -= 0.005;
    return { pt, t0, t1 };
  }
  /* o.hl(key) -> warna atau null; key = "A>B" atau "A>B#i" atau "D>G!" (gembok); o.locks: "tutup" | "buka" | "satu"; o.vals {node: [nilai, u]}; o.alpha(node) */
  function graph(ctx, o = {}) {
    E.forEach(([a, b, offs, lk]) => offs.forEach((off, i) => {
      const k1 = a + ">" + b, k2 = k1 + (lk ? "!" : "#" + i);
      const col = o.hl ? (o.hl(k2) || o.hl(k1)) : null;
      const { pt, t0, t1 } = curve(a, b, off);
      ctx.save(); ctx.globalAlpha *= o.edgeAlpha ? o.edgeAlpha(a, b) : 1;
      ctx.strokeStyle = col || (lk ? (o.locks === "buka" ? C.green : C.mut) : C.ink); ctx.lineWidth = col ? 6 : 3.5;
      if (lk) ctx.setLineDash([10, 9]);
      ctx.beginPath(); for (let t = t0; t <= t1 + 1e-9; t += 0.02) { const [x, y] = pt(Math.min(t, t1)); t === t0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
      const [ex, ey] = pt(t1), [bx, by] = pt(t1 - 0.04); const ang = Math.atan2(ey - by, ex - bx), hs = col ? 18 : 15;
      ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - hs * Math.cos(ang - 0.4), ey - hs * Math.sin(ang - 0.4)); ctx.lineTo(ex - hs * Math.cos(ang + 0.4), ey - hs * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill();
      if (lk) { const [mx, my] = pt(0.5); ctx.fillStyle = C.bg; ctx.beginPath(); ctx.arc(mx, my, 20, 0, Math.PI * 2); ctx.fill(); lock(ctx, mx, my, o.locks === "buka" || o.locks === "satu"); }
      ctx.restore();
    }));
    Object.entries(N).forEach(([k, [x, y]]) => {
      const a = o.alpha ? o.alpha(k) : 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
      const mark = o.mark && o.mark(k);
      ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fillStyle = mark || C.ink; ctx.fill();
      text(ctx, k, x, y + 13, 36, { mono: true, weight: 800, align: "center", color: C.white });
      const v = o.vals && o.vals[k];
      if (v && v[1] > 0) { ctx.globalAlpha *= v[1]; const s = String(v[0]); ctx.font = "800 34px 'JetBrains Mono', monospace"; const w = Math.max(56, ctx.measureText(s).width + 28);
        rr(ctx, x - w / 2, y - R - 62, w, 50, 25); ctx.fillStyle = v[2] || "#FFF6DA"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = v[3] || C.red; ctx.stroke();
        text(ctx, s, x, y - R - 25, 34, { mono: true, weight: 800, align: "center", color: v[3] || C.red }); }
      ctx.restore();
    });
  }
  const T = (b, w) => at(b, w[0], w[1] || 1);
  // spesifikasi langkah DP per beat: prev (nilai lama), set [[titik, nilai, kata]], hl [[kunci-lajur, kata]], f [[teks, kata]]
  const DP = {
    a3: { prev: {}, set: [["A", 1, ["satu"]], ["B", 2, ["dua"]]], hl: [["A>B", ["B"]]], f: [["A = 1", ["satu"]], ["B = 1 × 2 = 2", ["dua"]]] },
    a4: { prev: { A: 1, B: 2 }, set: [["C", 2, ["dua", 2]], ["D", 6, ["enam"]], ["E", 2, ["dua", 4]]], hl: [["B>C", ["C"]], ["B>D", ["D"]], ["B>E", ["E"]]], f: [["C = 2 × 1 = 2", ["dua", 2]], ["D = 2 × 3 = 6", ["enam"]], ["E = 2 × 1 = 2", ["dua", 4]]] },
    a5: { prev: { A: 1, B: 2, C: 2, D: 6, E: 2 }, set: [["F", 6, ["enam"]]], hl: [["E>F", ["F"]]], f: [["F = 2 × 3 = 6", ["enam"]]] },
    a6: { prev: { A: 1, B: 2, C: 2, D: 6, E: 2, F: 6 }, set: [["G", 20, ["puluh"]]], hl: [["C>G", ["C"]], ["D>G#0", ["D"]], ["D>G#1", ["D"]], ["F>G", ["F"]]], f: [["dari C: 2 × 1 = 2", ["C"]], ["dari D: 6 × 2 = 12", ["D"]], ["dari F: 6 × 1 = 6", ["F"]], ["G = 20", ["puluh"]]] },
    a7: { prev: { A: 1, B: 2, C: 2, D: 6, E: 2, F: 6, G: 20 }, set: [["H", 60, ["enam"]]], hl: [["G>H", ["tiga"]]], f: [["H = 20 × 3 = 60", ["enam"]]], ans: true },
    b3: { locks: "buka", prev: { A: 1, B: 2, C: 2, E: 2 }, set: [["D", 8, ["delapan"]]], hl: [["B>D", ["E", 2]], ["E>D", ["E", 2]]], f: [["D = 2 × 3 + 2 × 1", ["E", 2]], ["  = 6 + 2 = 8", ["delapan"]]] },
    b4: { locks: "buka", prev: { A: 1, B: 2, C: 2, D: 8, E: 2 }, set: [["F", 14, ["belas"]]], hl: [["E>F", ["E"]], ["D>F", ["D"]]], f: [["dari E: 2 × 3 = 6", ["E"]], ["dari D: 8 × 1 = 8", ["D"]], ["F = 14", ["belas"]]] },
    b5: { locks: "buka", prev: { A: 1, B: 2, C: 2, D: 8, E: 2, F: 14 }, set: [["G", 40, ["Jumlahnya"]]], hl: [["C>G", ["C"]], ["D>G", ["D"]], ["F>G", ["F"]]], f: [["dari C: 2", ["C"]], ["dari D: 8 × 3 = 24", ["D"]], ["dari F: 14", ["F"]], ["G = 40", ["Jumlahnya"]]] },
    b6: { locks: "buka", prev: { A: 1, B: 2, C: 2, D: 8, E: 2, F: 14, G: 40 }, set: [["H", 120, ["seratus"]]], hl: [["G>H", ["tiga"]]], f: [["H = 40 × 3 = 120", ["seratus"]]], ans: true }
  };
  function fbox(ctx, lines, l, b) {   // kotak hitungan di kanan atas
    const vis = lines.filter(([s, w]) => l > T(b, w) - 0.3); if (!vis.length) return;
    const h = 30 + lines.length * 52; panel(ctx, 1440, 110, 440, h, { stroke: C.red, lw: 3 });
    lines.forEach(([s, w], i) => fadeIn(ctx, ap(l, T(b, w) - 0.3), () => text(ctx, s, 1470, 160 + i * 52, 32, { mono: true, weight: 800, color: i === lines.length - 1 ? C.red : C.ink, fit: 390 })));
  }
  const PATH1 = ["A>B", "B>E", "E>D", "D>G!", "G>H"], PATH2 = ["A>B", "B>E", "E>D", "D>F", "F>G", "G>H"];

  Object.assign(Kiko.SCENES, {
    graf(ctx, b, l) {
      const m = b.mode;
      if (m === "kait") {
        const tG = at(b, "gembok"), tB = at(b, "berapa"), tA = at(b, "A");
        graph(ctx, { locks: "tutup", alpha: k => ap(l, 0.2 + "ABCDEFGH".indexOf(k) * 0.25), hl: k => (l > tG - 0.2 && k.endsWith("!")) ? C.red : null,
          mark: k => k === "A" && l > tA - 0.2 ? C.green : k === "H" && l > tA + 1 ? C.red : null, vals: { H: ["?", ap(l, tB - 0.2)] } });
        fadeIn(ctx, ap(l, tB - 0.2), () => text(ctx, "Ada berapa rute?", 1500, 200, 48, { disp: true, weight: 800, align: "center", color: C.red }));
        return;
      }
      if (m === "intro") {
        const tA = at(b, "A"), tH = at(b, "H"), tK = at(b, "kanan");
        graph(ctx, { mark: k => k === "A" && l > tA - 0.2 ? C.green : k === "H" && l > tH - 0.2 ? C.red : null });
        fadeIn(ctx, ap(l, tA - 0.2), () => chip(ctx, "mulai", 190, 540, { size: 26, color: C.white, fill: C.green, stroke: C.green, center: true }));
        fadeIn(ctx, ap(l, tH - 0.2), () => chip(ctx, "tujuan", 1720, 550, { size: 26, color: C.white, fill: C.red, stroke: C.red, center: true }));
        fadeIn(ctx, ap(l, tK - 0.2), () => { arrow(ctx, 1450, 150, 1800, 150, { color: C.green, lw: 8, head: 24 }); text(ctx, "hanya ke kanan", 1625, 210, 34, { weight: 800, align: "center", color: C.green }); });
        return;
      }
      if (m === "lajur") {
        const tA = at(b, "A"), tD = at(b, "dua", 2), tR = at(b, "Dua", 3);
        const r1 = ["A>B#0", "B>C", "C>G", "G>H#1"], r2 = ["A>B#1", "B>C", "C>G", "G>H#1"];
        const ph = l > tR - 0.2 ? Math.floor((l - tR) / 1.6) % 2 : -1;
        graph(ctx, { hl: k => l < tR - 0.2 ? (k.startsWith("A>B") && l > tA - 0.2 ? C.red : null) : ((ph === 0 ? r1 : r2).includes(k) ? (ph === 0 ? C.green : C.red) : null) });
        fadeIn(ctx, ap(l, tD - 0.2) * (l < tR - 0.2 ? 1 : 0), () => chip(ctx, "2 lajur", 345, 350, { size: 30, color: C.white, fill: C.red, stroke: C.red, center: true }));
        fadeIn(ctx, ap(l, tR - 0.2), () => { panel(ctx, 1440, 110, 440, 150, { stroke: ph === 0 ? C.green : C.red, lw: 3 }); text(ctx, ph === 0 ? "rute 1" : "rute 2", 1660, 170, 38, { disp: true, weight: 800, align: "center", color: ph === 0 ? C.green : C.red }); text(ctx, "beda satu lajur = rute berbeda", 1660, 225, 26, { weight: 700, align: "center", fit: 400 }); });
        return;
      }
      if (m === "gembok") {
        const tE = at(b, "E"), tF = at(b, "F"), tG = at(b, "G"), tK = at(b, "kunci", 2);
        graph(ctx, { locks: "tutup", hl: k => (k === "E>D!" && l > tE - 0.2) || (k === "D>F!" && l > tF - 0.2) || (k === "D>G!" && l > tG - 0.2) ? C.red : null });
        fadeIn(ctx, ap(l, tK - 0.3), () => { panel(ctx, 1440, 110, 440, 170, { stroke: C.goldRim, lw: 3 }); text(ctx, "🔑 kunci sakti", 1660, 175, 36, { weight: 800, align: "center", color: C.goldInk }); text(ctx, "1 kunci = 1 gembok", 1660, 235, 32, { mono: true, weight: 800, align: "center" }); });
        return;
      }
      if (m === "tanya" || m === "soal") {
        ctx.save(); ctx.translate(30, 80); ctx.scale(0.72, 0.72);
        graph(ctx, { locks: m === "soal" ? (b.soal === 14 ? "tutup" : b.soal === 15 ? "buka" : "satu") : "tutup", edgeAlpha: (a, c) => 1 });
        ctx.restore();
        if (m === "tanya") {
          [["Soal 14", "tanpa kunci", ["empat"]], ["Soal 15", "3 kunci sakti", ["lima"]], ["Soal 16", "1 kunci sakti", ["enam"]]].forEach(([s, k, w], i) => fadeIn(ctx, ap(l, T(b, w) - 0.3), () => {
            panel(ctx, 1340, 130 + i * 190, 520, 160, { stroke: C.red, lw: 3 }); text(ctx, s, 1380, 195 + i * 190, 40, { disp: true, weight: 800, color: C.red }); text(ctx, k, 1380, 250 + i * 190, 34, { weight: 800 });
          }));
        } else {
          const k = { 14: "tanpa kunci", 15: "3 kunci sakti", 16: "1 kunci sakti" }[b.soal];
          bigNote(ctx, "Soal " + b.soal, 1600, 200, 64, ap(l, 0.1), { color: C.green });
          fadeIn(ctx, ap(l, 0.8), () => { panel(ctx, 1360, 260, 480, 130, { stroke: C.goldRim, lw: 3 }); text(ctx, k, 1600, 342, 44, { disp: true, weight: 800, align: "center", color: C.goldInk }); });
          fadeIn(ctx, ap(l, at(b, "Berapa") - 0.2), () => { panel(ctx, 1360, 430, 480, 150, { stroke: C.red, lw: 4 }); text(ctx, "A → H = ?", 1600, 528, 60, { mono: true, weight: 800, align: "center", color: C.red }); });
        }
        return;
      }
      if (m === "dp") {
        const S = DP[b.id]; const vals = {};
        Object.entries(S.prev).forEach(([k, v]) => vals[k] = [v, 1, C.panel, C.ink]);
        S.set.forEach(([k, v, w]) => vals[k] = [v, ap(l, T(b, w) - 0.2)]);
        const hls = S.hl.filter(([k, w]) => l > T(b, w) - 0.2).map(([k]) => k);
        graph(ctx, { locks: S.locks || "tutup", vals, hl: k => hls.some(h => k === h || k.startsWith(h + "#") || k.startsWith(h + "!") || (h.endsWith("!") && k === h)) ? C.red : null,
          mark: k => S.ans && k === "H" && l > T(b, S.set[0][2]) - 0.2 ? C.red : null });
        fbox(ctx, S.f, l, b);
        if (S.ans) fadeIn(ctx, ap(l, at(b, "Jawaban") - 0.2), () => chip(ctx, "JAWABAN: " + S.set[0][1], 1660, 300, { size: 40, color: C.white, fill: C.red, stroke: C.red, center: true }));
        return;
      }
      if (m === "buang") {
        const vals = { H: [120, 1, C.panel, C.ink] };
        let hl = () => null, f = [];
        if (b.id === "c3") {
          const tE = at(b, "E"), tK = at(b, "kedua");
          hl = k => (k === "E>D!" && l > tE - 0.2) || ((k === "D>F!" || k === "D>G!") && l > tK - 0.2) ? C.red : null;
          f = [["120 rute (soal 15)", ["Dari"]], ["− rute 2 gembok", ["buang"]]];
        } else if (b.id === "c4") {
          const tB = at(b, "B");
          hl = k => l > tB - 0.2 && PATH1.some(p => k === p || k.startsWith(p + "#") || k === p + "!") ? C.red : null;
          f = [["A→B→E→D→G→H", ["B"]], ["2 × 1 × 1 × 1 × 3", ["dua", 2]], ["= 6 rute", ["enam"]]];
        } else {
          const tE = at(b, "E");
          hl = k => l > tE - 0.2 && PATH2.some(p => k === p || k.startsWith(p + "#") || k === p + "!") ? C.purple : null;
          f = [["A→B→E→D→F→G→H", ["E"]], ["= 6 rute", ["enam"]], ["total 6 + 6 = 12", ["Totalnya"]]];
        }
        graph(ctx, { locks: "satu", vals, hl });
        fbox(ctx, f, l, b);
      }
    },
    kait_trik(ctx, b, l) {
      const tT = at(b, "tulis"), tH = at(b, "H");
      const order = ["A", "B", "C", "D", "E", "F", "G"]; const vals = {};
      order.forEach((k, i) => vals[k] = [P14[k], ap(l, tT + i * 0.45)]); vals.H = ["?", ap(l, tH - 0.2)];
      ctx.save(); ctx.translate(150, 120); ctx.scale(0.82, 0.82); graph(ctx, { vals, mark: k => k === "H" && l > tH - 0.2 ? C.red : null }); ctx.restore();
      fadeIn(ctx, ap(l, 0.2), () => { cross(ctx, 1700, 170, 50, C.purple, clamp((l - 1.5) / 0.5, 0, 1)); text(ctx, "daftar rute satu per satu", 1640, 250, 26, { weight: 800, align: "center", color: C.purple }); });
      fadeIn(ctx, ap(l, tT - 0.3), () => chip(ctx, "satu angka di setiap titik", 1500, 640, { size: 34, color: C.white, fill: C.green, stroke: C.green, center: true }));
    },
    kait_judul(ctx, b, l) {
      const tP = at(b, "pemrograman");
      text(ctx, "BEDAH SOAL OSN-K INFORMATIKA", 960, 180, 32, { mono: true, weight: 700, color: C.green, align: "center", ls: 4 });
      text(ctx, "Berapa Rute dari A ke H?", 960, 300, 84, { disp: true, weight: 800, align: "center", fit: 1700 });
      text(ctx, "Tanpa Mendaftar Satu per Satu", 960, 400, 72, { disp: true, weight: 800, align: "center", color: C.red, fit: 1700 });
      ctx.fillStyle = C.red; const w = 300 * ap(l, 0.3, 0.6); ctx.fillRect(960 - w / 2, 435, w, 8);
      text(ctx, "OSN-K 2025 · SMA · No. 14, 15, 16 · Perjalanan ke Timur", 960, 510, 30, { mono: true, weight: 600, color: C.mut, align: "center" });
      fadeIn(ctx, ap(l, tP - 0.3), () => chip(ctx, "pemrograman dinamis", 960, 580, { size: 44, color: C.white, fill: C.green, stroke: C.green, center: true, px: 28 }));
    },
    jawab16(ctx, b, l) {
      const tS = at(b, "seratus", 2);
      label(ctx, "// JAWABAN SOAL 16", 960, 170, { align: "center" });
      [["soal 15", "120"], ["2 gembok", "12"]].forEach(([s, v], i) => fadeIn(ctx, ap(l, 0.3 + i * 0.8), () => { const x = 460 + i * 560; panel(ctx, x, 230, 440, 200, {}); text(ctx, s, x + 220, 290, 30, { mono: true, weight: 800, align: "center", color: C.green }); text(ctx, v, x + 220, 385, 80, { mono: true, weight: 800, align: "center" }); }));
      fadeIn(ctx, ap(l, 1.1), () => text(ctx, "−", 960, 360, 80, { mono: true, weight: 800, align: "center", color: C.mut }));
      fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, 560, 490, 800, 200, { stroke: C.red, lw: 5 }); text(ctx, "108", 960, 635, 130, { mono: true, weight: 800, align: "center", color: C.red }); });
    },
    konsep_dp(ctx, b, l) {
      const tP = at(b, "pemrograman"), tM = at(b, "memecah"), tS = at(b, "menyimpan");
      heading(ctx, "// KONSEP", "Pemrograman dinamis", 1, 150);
      fadeIn(ctx, ap(l, tP + 1.2), () => chip(ctx, "dynamic programming", 960, 250, { size: 32, color: C.green, stroke: C.green, lw: 3, center: true }));
      fadeIn(ctx, ap(l, tM - 0.2), () => { panel(ctx, 220, 350, 620, 300, {}); text(ctx, "rute(A → H)", 530, 430, 44, { mono: true, weight: 800, align: "center" }); arrow(ctx, 530, 460, 530, 520, { color: C.red, lw: 5 });
        text(ctx, "rute(A → G), rute(A → F), …", 530, 580, 30, { mono: true, weight: 800, align: "center", color: C.red, fit: 580 }); });
      fadeIn(ctx, ap(l, tS - 0.2), () => { panel(ctx, 1000, 350, 700, 300, { stroke: C.green, lw: 3 }); label(ctx, "// TABEL JAWABAN", 1040, 400);
        ["A", "B", "C", "D", "E", "F", "G"].forEach((k, i) => { const x = 1040 + i * 90; rr(ctx, x, 440, 76, 130, 10); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.line; ctx.stroke(); text(ctx, k, x + 38, 485, 30, { mono: true, weight: 800, align: "center", color: C.mut }); text(ctx, String(P14[k]), x + 38, 545, 36, { mono: true, weight: 800, align: "center", color: C.red }); });
        text(ctx, "dihitung sekali, dipakai berkali-kali", 1350, 620, 28, { weight: 700, align: "center", color: C.green }); });
    },
    konsep_rumus(ctx, b, l) {
      const tA = at(b, "Aturannya"), tU = at(b, "Urutan");
      heading(ctx, "// KONSEP", "Aturan di setiap titik", 1, 150);
      fadeIn(ctx, ap(l, tA - 0.2), () => { panel(ctx, 160, 270, 1600, 170, { stroke: C.red, lw: 4 }); text(ctx, "rute(X) = jumlah dari  rute(asal) × banyak lajur asal → X", 960, 375, 44, { mono: true, weight: 800, align: "center", fit: 1520 }); });
      fadeIn(ctx, ap(l, tU - 0.2), () => {
        "ABCDEFGH".split("").forEach((k, i) => { const x = 330 + i * 180; ctx.beginPath(); ctx.arc(x, 560, 40, 0, Math.PI * 2); ctx.fillStyle = C.ink; ctx.fill(); text(ctx, k, x, 573, 36, { mono: true, weight: 800, align: "center", color: C.white }); if (i < 7) arrow(ctx, x + 50, 560, x + 130, 560, { color: C.green, lw: 4, head: 14 }); });
        text(ctx, "urutan hitung: dari kiri ke kanan", 960, 670, 34, { weight: 800, align: "center", color: C.green });
      });
    },
    konsep_kunci(ctx, b, l) {
      const tS = at(b, "menyimpan"), tB = at(b, "belum"), tU = at(b, "sudah");
      heading(ctx, "// KONSEP", "Syarat tambahan? Simpan lebih banyak angka", 1, 150);
      fadeIn(ctx, ap(l, tS - 0.2), () => { ctx.beginPath(); ctx.arc(560, 470, 70, 0, Math.PI * 2); ctx.fillStyle = C.ink; ctx.fill(); text(ctx, "D", 560, 495, 70, { mono: true, weight: 800, align: "center", color: C.white }); });
      fadeIn(ctx, ap(l, tB - 0.2), () => { panel(ctx, 760, 320, 900, 130, { stroke: C.green, lw: 3 }); text(ctx, "belum pakai kunci:", 800, 400, 40, { weight: 800 }); text(ctx, "6", 1560, 405, 60, { mono: true, weight: 800, color: C.green, align: "center" }); });
      fadeIn(ctx, ap(l, tU - 0.2), () => { panel(ctx, 760, 490, 900, 130, { stroke: C.goldRim, lw: 3 }); text(ctx, "sudah pakai 1 kunci:", 800, 570, 40, { weight: 800 }); text(ctx, "2", 1560, 575, 60, { mono: true, weight: 800, color: C.goldInk, align: "center" }); });
    }
  });
})();
