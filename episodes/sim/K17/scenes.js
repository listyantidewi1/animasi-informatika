/* K17 Simulasi konsep: melacak pseudocode dengan array dan fungsi (gaya E.7, array mulai dari indeks 0).
   Kode kiri dengan panah baris, kanan: papan memori (program utama + frame fungsi), tabel jejak.
   Nilai jejak dicek dengan python3: v1 [70,85,90,65,78] n=5 → 90 (berubah 2×); v2 [60,75,50,98,80] n=3 → 75;
   v3 bug "sampai n − 2" dengan [70,85,90,65,98] → 90 (indeks 4 terlewat); v3f perbaikan "n − 1" → 98. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Kd = K.kode;
  const { rr, text, para, card, kiko, ease, clamp, lerp, arrowIcon } = H;
  const heading = (ctx, s, y = 168) => text(ctx, s, 960, y, 34, { align: "center", weight: 900, color: C.accentDark });
  const PURP = "#8E6BBF";
  const VAR = {
    v1: { title: "VARIASI 1 · LIMA NILAI", a: [70, 85, 90, 65, 78], n: 5, hi: 4 },
    v2: { title: "VARIASI 2 · ARGUMEN n = 3", a: [60, 75, 50, 98, 80], n: 3, hi: 2, hlLine: 13 },
    v3: { title: "VARIASI 3 · ADA BUG DI BARIS 8", a: [70, 85, 90, 65, 98], n: 5, hi: 3, bug: true },
    v3f: { title: "VARIASI 3 · BARIS 8 DIPERBAIKI", a: [70, 85, 90, 65, 98], n: 5, hi: 4, fixed: true }
  };
  function codeLines(V) {
    return [
      { t: "PROGRAM cari_terbesar" }, { t: "DEKLARASI" }, { t: "nilai : array[0..4] dari integer", ind: 1 }, { t: "hasil : integer", ind: 1 },
      { t: "FUNGSI terbesar(a : array dari integer, n : integer) → integer" }, { t: "DEKLARASI maks, i : integer", ind: 1 },
      { t: "maks ← a[0]", ind: 1 }, { t: V.bug ? "UNTUK i dari 1 sampai n − 2:" : "UNTUK i dari 1 sampai n − 1:", ind: 1, bad: V.bug },
      { t: "JIKA a[i] > maks MAKA maks ← a[i]", ind: 2 }, { t: "KEMBALIKAN maks", ind: 1 }, { t: "ALGORITMA" },
      { t: "nilai ← [" + V.a.join(", ") + "]", ind: 1 }, { t: "hasil ← terbesar(nilai, " + V.n + ")", ind: 1 }, { t: "TULIS hasil", ind: 1 }];
  }
  // langkah eksekusi (dicocokkan dengan python3)
  function build(V) {
    const S = [], a = V.a; let maks = a[0];
    S.push({ line: 12, nilai: true }); S.push({ line: 13, call: true });
    S.push({ line: 7, maks, row: ["7", "–", "–", "–", maks], idx: 0 });
    for (let i = 1; i <= V.hi; i++) {
      S.push({ line: 8, i }); const g = a[i] > maks; if (g) maks = a[i];
      S.push({ line: 9, i, maks, changed: g, row: ["9", i, a[i], g ? "ya" : "tidak", maks], idx: i });
    }
    S.push({ line: 10, ret: maks }); S.push({ line: 13, hasil: maks, gone: true }); S.push({ line: 14, out: maks });
    return S;
  }
  Object.values(VAR).forEach(V => V.steps = build(V));
  // keadaan setelah langkah ke-k (k = −1: belum mulai)
  function state(V, k) {
    const st = { nilai: false, frame: false, maks: null, i: null, rows: [], ret: null, hasil: null, out: null, line: null, changed: false, idx: null, gone: false };
    for (let j = 0; j <= k && j < V.steps.length; j++) {
      const s = V.steps[j], last = j === k; st.line = s.line;
      if (s.nilai) st.nilai = true; if (s.call) st.frame = true;
      if (s.maks != null) st.maks = s.maks; if (s.i != null) st.i = s.i; if (s.row) st.rows.push(s.row);
      if (s.ret != null) st.ret = s.ret; if (s.hasil != null) { st.hasil = s.hasil; st.gone = true; } if (s.out != null) st.out = s.out;
      st.changed = last && (s.changed || s.line === 7); st.idx = last ? (s.idx != null ? s.idx : s.line === 8 ? s.i : null) : null;
    }
    return st;
  }
  // ---------- gambar ----------
  function code(ctx, V, st, opt = {}) {
    const lines = codeLines(V).map((ln, i) => ({ ...ln, hl: st.line === i + 1 || (opt.hlLine === i + 1) }));
    const x = 120, y = 196, rh = 40;
    Kd.code(ctx, x, y, 760, lines, { rh, size: 23, title: "PSEUDOCODE" });
    if (st.line) { const ly = y + 50 + (st.line - 1) * rh + rh / 2; ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(84, ly - 16); ctx.lineTo(112, ly); ctx.lineTo(84, ly + 16); ctx.closePath(); ctx.fill(); }
    if (V.fixed) { const ly = y + 50 + 7 * rh; ctx.strokeStyle = C.good; ctx.lineWidth = 4; rr(ctx, x + 8, ly + 2, 744, rh - 4, 8); ctx.stroke(); text(ctx, "✓ diperbaiki", x + 740, ly + 28, 18, { align: "right", weight: 900, color: C.good }); }
    if (V.bug) { const ly = y + 50 + 7 * rh; text(ctx, "✕ bug", x + 740, ly + 28, 18, { align: "right", weight: 900, color: C.bad }); }
  }
  function box(ctx, x, y, w, h, name, val, opt = {}) {
    ctx.fillStyle = opt.changed ? "#FFF3D6" : "#FFFFFF"; rr(ctx, x, y, w, h, 10); ctx.fill();
    ctx.strokeStyle = opt.changed ? C.accent : opt.col || "#7B8B95"; ctx.lineWidth = opt.changed ? 5 : 3; rr(ctx, x, y, w, h, 10); ctx.stroke();
    if (name) text(ctx, name, x + w / 2, y - 10, 20, { align: "center", weight: 900, color: opt.col || C.kikoDark });
    text(ctx, val == null ? "–" : String(val), x + w / 2, y + h / 2 + 11, opt.size || 30, { align: "center", weight: 900, color: val == null ? C.muted : C.ink });
  }
  function memory(ctx, V, st) {
    const X = 920, W = 880;
    // program utama
    card(ctx, X, 196, W, 150, { fill: "#F7FAF8", stroke: C.kiko, lw: 3, r: 16 });
    text(ctx, "PAPAN MEMORI · PROGRAM UTAMA", X + 20, 226, 20, { weight: 900, color: C.kiko });
    const aw = 88, ax = X + 20;
    text(ctx, "nilai", ax, 254, 20, { weight: 900, color: C.kikoDark });
    V.a.forEach((v, i) => {
      const x = ax + i * (aw + 6), on = st.idx === i && st.frame && !st.gone, out = st.frame && !st.gone && i >= V.n;
      ctx.fillStyle = on ? "#FFF3D6" : out ? "#EEF1F3" : "#FFFFFF"; rr(ctx, x, 262, aw, 52, 8); ctx.fill();
      ctx.strokeStyle = on ? C.accent : "#7B8B95"; ctx.lineWidth = on ? 5 : 2; rr(ctx, x, 262, aw, 52, 8); ctx.stroke();
      text(ctx, st.nilai ? String(v) : "–", x + aw / 2, 297, 26, { align: "center", weight: 900, color: st.nilai ? (out ? C.muted : C.ink) : C.muted });
      text(ctx, String(i), x + aw / 2, 336, 17, { align: "center", weight: 800, color: on ? C.accentDark : C.ink2 });
    });
    box(ctx, X + 520, 262, 130, 52, "hasil", st.hasil, { changed: st.line === 13 && st.hasil != null, size: 28 });
    // layar
    ctx.fillStyle = "#1F2A33"; rr(ctx, X + 680, 230, 180, 100, 12); ctx.fill(); text(ctx, "LAYAR", X + 696, 254, 16, { weight: 900, color: C.kikoLight });
    if (st.out != null) text(ctx, String(st.out), X + 770, 312, 40, { align: "center", weight: 900, color: "#fff" });
    // frame fungsi
    const fy = 362;
    if (st.frame && !st.gone) {
      card(ctx, X, fy, W, 130, { fill: "#F4F0FA", stroke: PURP, lw: 4, r: 16 });
      text(ctx, "FRAME: terbesar (variabel lokal)", X + 20, fy + 30, 20, { weight: 900, color: PURP });
      box(ctx, X + 20, fy + 62, 170, 52, "a", "→ nilai", { col: PURP, size: 24 });
      box(ctx, X + 210, fy + 62, 130, 52, "n", V.n, { col: PURP });
      box(ctx, X + 360, fy + 62, 150, 52, "maks", st.maks, { col: PURP, changed: st.changed });
      box(ctx, X + 530, fy + 62, 130, 52, "i", st.i, { col: PURP, changed: st.line === 8 });
      if (st.ret != null) { ctx.fillStyle = C.goodBg; rr(ctx, X + 680, fy + 56, 180, 64, 10); ctx.fill(); text(ctx, "KEMBALIKAN", X + 770, fy + 82, 16, { align: "center", weight: 900, color: C.good }); text(ctx, String(st.ret), X + 770, fy + 110, 26, { align: "center", weight: 900, color: C.good }); }
    } else {
      ctx.setLineDash([10, 8]); ctx.strokeStyle = "#C9B8E3"; ctx.lineWidth = 3; rr(ctx, X, fy, W, 130, 16); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, st.gone ? "frame hilang: maks dan i lokal sudah tidak ada" : "frame fungsi muncul saat terbesar dipanggil", X + W / 2, fy + 74, 22, { align: "center", weight: 800, color: "#A08CC4" });
    }
  }
  function table(ctx, st, opt = {}) {
    const X = 920, Y = 508, W = 880, cols = [["baris", 100], ["i", 90], ["a[i]", 130], ["a[i] > maks?", 300], ["maks", 140]];
    card(ctx, X, Y, W, 318, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
    text(ctx, "TABEL JEJAK", X + 20, Y + 32, 20, { weight: 900, color: C.accentDark });
    let cx = X + 40; const cxs = cols.map(([h, w]) => { const c = cx + w / 2; cx += w; return c; });
    cols.forEach(([h], j) => text(ctx, h, cxs[j], Y + 66, 21, { align: "center", weight: 900, color: C.ink2 }));
    ctx.fillStyle = "#D7E2DC"; ctx.fillRect(X + 20, Y + 78, W - 40, 3);
    st.rows.forEach((r, i) => {
      const y = Y + 84 + i * 46, last = i === st.rows.length - 1 && opt.live;
      if (last) { ctx.fillStyle = "#FFF3D6"; rr(ctx, X + 20, y + 2, W - 40, 42, 8); ctx.fill(); }
      r.forEach((v, j) => text(ctx, String(v), cxs[j], y + 32, 24, { align: "center", weight: j === 4 ? 900 : 800, color: v === "ya" ? C.good : v === "tidak" ? C.bad : C.ink }));
    });
  }
  function askCard(ctx, s) {
    card(ctx, 920, 508, 880, 318, { fill: "#FFF9E0", stroke: C.accent, lw: 4, r: 16 });
    text(ctx, "?", 1360, 630, 110, { align: "center", weight: 900, color: C.accent });
    para(ctx, s, 1360, 700, 32, 800, { align: "center", weight: 900, lh: 1.25 });
  }

  Object.assign(K.SCENES, {
    k17_tujuan(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 230, 30, { weight: 900, color: C.accentDark });
      ["mengikuti panah baris", "mengisi papan memori", "mengisi tabel jejak", "menemukan bug batas perulangan"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 270 + i * 104, 760, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 326 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 324 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      Kd.code(ctx, 1100, 270, 560, [{ t: "maks ← a[0]" }, { t: "UNTUK i dari 1 sampai n − 1:", hl: true }, { t: "JIKA a[i] > maks MAKA …", ind: 1 }, { t: "KEMBALIKAN maks" }], { rh: 46, size: 22 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(1066, 393); ctx.lineTo(1094, 409); ctx.lineTo(1066, 425); ctx.closePath(); ctx.fill();
      text(ctx, "satu baris, satu langkah", 1380, 600, 26, { align: "center", weight: 800, color: C.ink2 });
    },
    k17_prasyarat(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 330, 290, 860, 360, { fill: C.bg2, r: 22 });
      text(ctx, "E.7", 760, 380, 64, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Pseudocode Dekat Bahasa Komputer", 760, 450, 36, { align: "center", weight: 800 });
      ["array berindeks nol", "fungsi, parameter, nilai balik", "variabel lokal"].forEach((s, i) => text(ctx, "• " + s, 520, 520 + i * 40, 28, { weight: 700, color: C.ink2 }));
      card(ctx, 1240, 290, 360, 360, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Ingat", 1420, 350, 30, { align: "center", weight: 900 });
      ["0", "1", "2", "3", "4"].forEach((s, i) => { ctx.fillStyle = "#FFFFFF"; rr(ctx, 1280 + i * 58, 400, 52, 52, 8); ctx.fill(); ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 2; rr(ctx, 1280 + i * 58, 400, 52, 52, 8); ctx.stroke(); text(ctx, s, 1306 + i * 58, 436, 24, { align: "center", weight: 900, color: C.kikoDark }); });
      para(ctx, "panjang 5, indeks 0 sampai 4", 1420, 510, 26, 320, { align: "center", weight: 800, lh: 1.25 });
      kiko(ctx, 1680, 740, 100, 0, { wave: l });
    },
    k17_program(ctx, b, l) {
      const V = VAR.v1, a = b.audio || b.dur;
      const hl = l < a * 0.15 ? null : l < a * 0.55 ? [5, 10] : [11, 14];
      code(ctx, V, { line: null });
      if (hl) { ctx.strokeStyle = hl[0] === 5 ? PURP : C.kiko; ctx.lineWidth = 6; rr(ctx, 116, 196 + 50 + (hl[0] - 1) * 40 - 2, 768, (hl[1] - hl[0] + 1) * 40 + 4, 12); ctx.stroke(); }
      card(ctx, 960, 230, 820, 210, { fill: "#F4F0FA", stroke: PURP, lw: l > a * 0.15 ? 4 : 2, r: 16 });
      text(ctx, "FUNGSI terbesar (baris 5–10)", 990, 275, 26, { weight: 900, color: PURP });
      para(ctx, "menerima array a dan banyaknya n, lalu mengembalikan nilai yang paling besar", 990, 320, 26, 760, { weight: 700, lh: 1.3 });
      ctx.globalAlpha = l > a * 0.5 ? 1 : 0.3;
      card(ctx, 960, 470, 820, 210, { fill: "#F7FAF8", stroke: C.kiko, lw: 4, r: 16 });
      text(ctx, "PROGRAM UTAMA (baris 11–14)", 990, 515, 26, { weight: 900, color: C.kiko });
      para(ctx, "mengisi array nilai, memanggil terbesar(nilai, 5), lalu menulis hasilnya", 990, 560, 26, 760, { weight: 700, lh: 1.3 });
      ctx.globalAlpha = 1;
      text(ctx, "komputer mulai dari ALGORITMA (baris 11)", 1370, 740, 24, { align: "center", weight: 800, color: C.ink2 });
    },
    k17_alat(ctx, b, l) {
      const V = VAR.v1, a = b.audio || b.dur, st = state(V, 3);
      code(ctx, V, st); memory(ctx, V, st); table(ctx, st, { live: true });
      const tag = (x, y, s, n) => { if (l < a * (0.15 + n * 0.22)) return; card(ctx, x, y, 280, 50, { fill: C.accent, r: 14 }); text(ctx, s, x + 140, y + 35, 25, { align: "center", weight: 900, color: "#fff" }); };
      tag(500, 122, "① panah baris", 0); tag(1520, 122, "② papan memori", 1); tag(1180, 506, "③ tabel jejak", 2);
    },
    k17_lacak(ctx, b, l) {
      const V = VAR[b.v], a = b.audio || b.dur;
      let k = -1;
      if (b.s) { const [s0, s1] = b.s, p = clamp((l - a * 0.05) / (a * 0.85), 0, 1); k = Math.min(s1, s0 + Math.floor(p * (s1 - s0 + 1))); }
      const st = b.ask ? state(V, 0) : state(V, k);
      if (b.ask) st.line = null;
      heading(ctx, V.title, 166);
      code(ctx, V, st, { hlLine: b.ask ? V.hlLine || (V.bug ? 8 : null) : null });
      memory(ctx, V, st);
      if (b.ask) askCard(ctx, b.ask); else table(ctx, st, { live: !!b.s });
      if (b.bugnote && l > a * 0.35) {
        card(ctx, 920, 362, 880, 130, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 });
        text(ctx, "indeks 4 (98) tidak pernah diperiksa", 1360, 415, 28, { align: "center", weight: 900, color: C.bad });
        text(ctx, "batas n − 2 kurang satu; yang benar n − 1", 1360, 460, 24, { align: "center", weight: 800, color: C.ink2 });
        ctx.strokeStyle = C.bad; ctx.lineWidth = 5; rr(ctx, 940 + 4 * 94 - 3, 259, 94, 58, 10); ctx.stroke();
      }
    },
    k17_tebak(ctx, b, l) {
      const V = VAR[b.v];
      heading(ctx, "TEBAK DULU");
      card(ctx, 260, 205, 1400, 120, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
      text(ctx, "nilai = [" + V.a.join(", ") + "]   ·   terbesar(nilai, " + V.n + ")", 960, 252, 30, { align: "center", weight: 900, color: C.kikoDark });
      text(ctx, V.bug ? "baris 8: UNTUK i dari 1 sampai n − 2" : "baris 8: UNTUK i dari 1 sampai n − 1", 960, 300, 26, { align: "center", weight: 800, color: V.bug ? C.bad : C.ink2 });
      b.opts.forEach((o, i) => {
        const y = 370 + i * 120; card(ctx, 360, y, 1140, 100, { fill: C.bg2, stroke: "#CFDCD5", lw: 3 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(420, y + 50, 30, 0, Math.PI * 2); ctx.fill();
        text(ctx, "ABC"[i], 420, y + 63, 34, { align: "center", color: "#fff", weight: 900 }); text(ctx, o, 480, y + 64, 38, { weight: 800 });
      });
      const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(1640, 550, 46, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1640, 550, 46, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
      text(ctx, "?", 1640, 566, 44, { align: "center", weight: 900, color: C.accentDark });
    },
    k17_latihan(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "COBA SENDIRI", 960, 220, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 220, 260, 760, 500, { fill: C.bg2, r: 22 });
      text(ctx, "Halaman latihan E.7", 600, 320, 34, { align: "center", weight: 900 });
      card(ctx, 290, 345, 620, 64, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/e7", 600, 387, 26, { align: "center", weight: 800, color: C.kikoDark });
      const a = b.audio || b.dur, on1 = l > a * 0.12;
      card(ctx, 290, 440, 200, 60, { fill: on1 ? "#FFF3D6" : "#FFFFFF", stroke: on1 ? C.accent : "#C9D4DB", lw: on1 ? 5 : 2, r: 12 }); text(ctx, "1 Pelacak", 390, 479, 24, { align: "center", weight: 900 });
      card(ctx, 505, 440, 200, 60, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 12 }); text(ctx, "2 Perbaiki tipe", 605, 479, 22, { align: "center", weight: 800, color: C.ink2 });
      card(ctx, 720, 440, 190, 60, { fill: "#FFFFFF", stroke: "#C9D4DB", lw: 2, r: 12 }); text(ctx, "3 Susun program", 815, 479, 22, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "tebak isi maks di tiap langkah", 600, 570, 26, { align: "center", weight: 800 });
      text(ctx, "[70, 85, 90, 65, 78]", 600, 620, 26, { align: "center", weight: 800, color: C.ink2 });
      if (l > a * 0.5) {
        card(ctx, 1030, 260, 670, 500, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1365, 320, 34, { align: "center", weight: 900 });
        para(ctx, "Lacak program ini di kertas dengan lima nilai ulanganmu sendiri.", 1365, 380, 28, 580, { align: "center", weight: 700, lh: 1.3 });
        const cols = ["baris", "i", "a[i]", "> maks?", "maks"]; cols.forEach((c, i) => { text(ctx, c, 1110 + i * 115, 520, 22, { align: "center", weight: 900, color: C.ink2 }); });
        ctx.fillStyle = "#D7E2DC"; ctx.fillRect(1060, 535, 580, 3); for (let r = 0; r < 3; r++) { ctx.fillStyle = "#E9E2C8"; ctx.fillRect(1060, 585 + r * 46, 580, 2); }
      }
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
