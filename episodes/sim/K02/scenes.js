/* K02 Simulasi konsep: berapa lama sandimu bisa ditebak? Mesin penebak mencoba sejuta tebakan per detik.
   Memakai pembantu gambar D7.3 (Kiko.sandi: gembok, kotak sandi, pengukur). Semua sandi hanya contoh.
   Angka dihitung dengan python3 (lihat laporan): kemungkinan = jenis karakter pangkat panjang; waktu = kemungkinan / 1.000.000 detik. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, S = K.sandi;
  const { rr, text, para, wrap, card, kiko, bubble, ease, clamp, lerp } = H;
  const AMBER = "#B57A12", DEEP = "#1F5A6E", DARK = "#1F2A33";
  const SPEED = 1e6;
  const fmt = n => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const LOW = "abcdefghijklmnopqrstuvwxyz", UP = LOW.toUpperCase(), DIG = "0123456789", SYM = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

  // ---------- lima variasi (angka dihitung dengan python3) ----------
  const V = {
    v1: { no: 1, pw: "4821", label: "4 angka, seperti PIN", sets: [["0–9", 10]], cs: DIG, n: 10, len: 4,
          kali: "10 × 10 × 10 × 10", pang: "10⁴", komb: "10.000", waktu: "10.000 ÷ 1.000.000", detik: "0,01 detik", big: "0,01 detik", col: C.bad },
    v2: { no: 2, pw: "kwtbramp", label: "8 huruf kecil acak", sets: [["a–z", 26]], cs: LOW, n: 26, len: 8,
          kali: "26 × 26 × … × 26 (8 kali)", pang: "26⁸", komb: "208.827.064.576", waktu: "208.827.064.576 ÷ 1.000.000", detik: "208.827 detik ≈ 58 jam", big: "± 58 jam ≈ 2,4 hari", col: AMBER },
    v3: { no: 3, pw: "K4n!t#9b", label: "8 karakter campuran", sets: [["a–z", 26], ["A–Z", 26], ["0–9", 10], ["simbol ! # ? @ …", 32]], cs: LOW + UP + DIG + SYM, n: 94, len: 8,
          kali: "94 × 94 × … × 94 (8 kali)", pang: "94⁸", komb: "6.095.689.385.410.816", waktu: "6.095.689.385.410.816 ÷ 1.000.000", detik: "6.095.689.385 detik ≈ 193 tahun", big: "± 193 tahun", col: C.good },
    v4: { no: 4, pw: "kucing-angkot-hujan-bakso", label: "frasa sandi: 4 kata acak", sets: [["a–z", 26], ["tanda hubung -", 1]], cs: LOW + "-", n: 27, len: 25,
          kali: "27 × 27 × … × 27 (25 kali)", pang: "27²⁵", komb: "608.266.787.713.357.709.119.683.992.618.861.307", waktu: "kemungkinan ÷ 1.000.000",
          detik: "± 19.000.000.000.000.000.000.000 tahun", big: "19.000.000.000.000.000.000.000 tahun", col: DEEP },
    v5: { no: 5, pw: "qwertyuiop", label: "10 huruf, tetapi sandi umum", sets: [["a–z", 26]], cs: LOW, n: 26, len: 10,
          kali: "26 × 26 × … × 26 (10 kali)", pang: "26¹⁰", komb: "141.167.095.653.376", waktu: "141.167.095.653.376 ÷ 1.000.000", detik: "141.167.096 detik ≈ 4,5 tahun", big: "kurang dari 1 detik", col: C.bad }
  };
  const vOf = b => V[b.v] || V.v1;
  const totalOf = v => Math.pow(v.n, v.len);
  // tebakan ke-i dalam urutan mesin (seperti odometer: karakter paling kanan berganti paling cepat)
  function guessAt(v, i) {
    let s = "", x = Math.floor(i);
    for (let k = 0; k < v.len; k++) { s = v.cs[x % v.n] + s; x = Math.floor(x / v.n); }
    return s;
  }
  function smallPct(p) {
    if (p >= 100) return "100%";
    if (p <= 0) return "0%";
    const d = Math.min(40, Math.max(2, -Math.floor(Math.log10(p)) + 1));
    return p.toFixed(d).replace(".", ",") + "%";
  }

  // ---------- pembantu gambar ----------
  function pwLine(ctx, x, y, w, pw, opt = {}) {
    card(ctx, x, y, w, opt.h || 96, { fill: "#FFFFFF", stroke: opt.stroke || "#B7C4CC", lw: 4, r: 16 });
    text(ctx, pw, x + 26, y + (opt.h || 96) / 2 + 16, opt.size || 46, { weight: 900, color: opt.color || C.ink, fit: w - 220 });
    text(ctx, pw.length + " karakter", x + w - 22, y + (opt.h || 96) / 2 + 11, 26, { align: "right", weight: 800, color: C.ink2 });
  }
  function chips(ctx, x, y, sets, opt = {}) {
    let cx = x; const size = opt.size || 26;
    sets.forEach(([s, n]) => {
      const lab = s + "  (" + n + ")"; ctx.font = `800 ${size}px Inter`; const w = ctx.measureText(lab).width + 36;
      card(ctx, cx, y, w, 58, { fill: "#E7F1FB", stroke: "#9CC2E6", lw: 2, r: 14 }); text(ctx, lab, cx + 18, y + 39, size, { weight: 800, color: DEEP });
      cx += w + 12;
    });
    return cx;
  }
  // mesin penebak: layar gelap, tebakan yang sedang dicoba, penghitung, kecepatan, persen, gembok
  function machine(ctx, x, y, w, h, st = {}) {
    card(ctx, x, y, w, h, { fill: "#2B3A44", r: 26 });
    text(ctx, "MESIN PENEBAK", x + 30, y + 52, 28, { weight: 900, color: "#FFFFFF" });
    ctx.fillStyle = st.found ? C.good : C.accent; ctx.beginPath(); ctx.arc(x + w - 40, y + 42, 12, 0, Math.PI * 2); ctx.fill();
    if (st.mode) text(ctx, st.mode, x + w - 64, y + 52, 22, { align: "right", weight: 800, color: "#F2D58A" });
    card(ctx, x + 24, y + 80, w - 48, 120, { fill: DARK, r: 16 });
    text(ctx, st.guess || "", x + w / 2, y + 160, st.gsize || 50, { align: "center", weight: 900, color: st.found ? "#8FE3A8" : "#8FD0E6", fit: w - 90 });
    text(ctx, st.line1 || "", x + 30, y + 250, 26, { weight: 800, color: "#DCE6EC", fit: w - 60 });
    text(ctx, "kecepatan: 1.000.000 tebakan per detik", x + 30, y + 292, 24, { weight: 700, color: "#AFC2CC", fit: w - 60 });
    if (st.pct !== undefined) {
      text(ctx, "sudah dicoba dari semua kemungkinan:", x + 30, y + 346, 22, { weight: 700, color: "#AFC2CC" });
      ctx.fillStyle = "#3D4E59"; rr(ctx, x + 30, y + 362, w - 60, 26, 10); ctx.fill();
      const fw = (w - 60) * clamp(st.pct / 100, 0, 1); if (fw > 0) { ctx.fillStyle = C.accent; rr(ctx, x + 30, y + 362, Math.max(10, fw), 26, 10); ctx.fill(); }
      text(ctx, smallPct(st.pct), x + 30, y + 428, 30, { weight: 900, color: "#FFFFFF", fit: w - 60 });
    }
    if (h > 470) {
      S.lock(ctx, x + w / 2, y + h - 95, 80, { open: !!st.found });
      if (st.status) text(ctx, st.status, x + w / 2, y + h - 22, 26, { align: "center", weight: 900, color: st.found ? "#8FE3A8" : "#F2D58A", fit: w - 40 });
    }
  }
  // keadaan mesin untuk variasi v setelah berjalan "run" detik (slow: diperlambat)
  function machineState(v, run, opt = {}) {
    const tot = totalOf(v);
    if (v.no === 1) {   // empat angka: ditampilkan diperlambat 1.000 kali supaya terlihat
      const target = 4821, i = Math.max(0, Math.min(target, Math.floor(run * 1000)));
      const found = i >= target;
      return { guess: guessAt(v, i), line1: "tebakan ke-" + fmt(i + 1), pct: (i + 1) / tot * 100, found,
               mode: "diperlambat 1.000×", status: found ? "COCOK! setelah 0,0048 detik" : "mencoba…" };
    }
    const tried = Math.max(0, run) * SPEED;
    return { guess: guessAt(v, tried), line1: "tebakan ke-" + fmt(tried + 1), pct: tried / tot * 100, found: false, gsize: v.len > 12 ? 34 : 50,
             status: opt.status || "masih mencoba…" };
  }
  function header(ctx, s, x, y, opt = {}) { text(ctx, s, x, y, opt.size || 26, { weight: 900, color: opt.color || C.accentDark, align: opt.align || "left" }); }
  function ring(ctx, x, y, frac) {
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 40, -Math.PI / 2, -Math.PI / 2 + clamp(frac, 0, 1) * Math.PI * 2); ctx.stroke();
  }
  // papan hasil di kanan: variasi yang sudah dijalankan
  function board(ctx, x, y, w, upto) {
    const rows = [["v1", "4821", "0,01 detik"], ["v2", "kwtbramp", "± 2,4 hari"], ["v3", "K4n!t#9b", "± 193 tahun"],
                  ["v4", "frasa 4 kata", upto >= 5 ? "± 5.000 tahun*" : "> umur alam semesta"], ["v5", "qwertyuiop", "< 1 detik"]];
    const n = Math.min(upto, 5); const h = 90 + n * 106 + (upto >= 5 ? 40 : 0);
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
    header(ctx, "PAPAN HASIL", x + w / 2, y + 52, { align: "center" });
    rows.slice(0, n).forEach(([k, pw, t], i) => {
      const yy = y + 78 + i * 106, v = V[k], now = i === n - 1;
      ctx.fillStyle = now ? "#FFF3D6" : "#F4F7F5"; rr(ctx, x + 16, yy, w - 32, 94, 14); ctx.fill();
      text(ctx, "Variasi " + v.no, x + 34, yy + 34, 20, { weight: 800, color: C.ink2 });
      text(ctx, pw, x + 34, yy + 72, 28, { weight: 900, fit: w - 300 });
      text(ctx, t, x + w - 32, yy + 60, 28, { align: "right", weight: 900, color: v.col, fit: 250 });
    });
    if (upto >= 5) text(ctx, "* bila ditebak per kata", x + w - 30, y + h - 22, 20, { align: "right", weight: 700, color: C.ink2 });
  }
  const at = (b, f) => (b.audio || b.dur) * f;

  Object.assign(K.SCENES, {
    k2_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      header(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, { size: 30 });
      ["menghitung jumlah kemungkinan sandi", "mengubahnya menjadi waktu menebak", "membandingkan lima macam sandi", "memilih sandi yang paling sulit ditebak"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 820, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800, fit: 710 }); ctx.globalAlpha = 1;
      });
      machine(ctx, 1170, 260, 500, 330, { guess: guessAt(V.v2, Math.max(0, l) * SPEED), line1: "tebakan ke-" + fmt(Math.max(0, l) * SPEED + 1) });
      S.lock(ctx, 1420, 700, 80, {});
    },
    k2_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      header(ctx, "EPISODE YANG DILENGKAPI", 960, 240, { align: "center", size: 32 });
      card(ctx, 330, 290, 600, 300, { fill: C.bg2, r: 22 });
      text(ctx, "D7.3", 630, 370, 56, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Kata Sandi Aman dan Rekam Jejak Digital", 630, 430, 34, 520, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "panjang, unik, rahasia", 630, 560, 26, { align: "center", weight: 600, color: C.ink2 });
      card(ctx, 990, 290, 600, 300, { fill: C.badBg, stroke: C.bad, lw: 4, r: 22 });
      text(ctx, "Semua sandi di sini", 1290, 380, 36, { align: "center", weight: 900 });
      text(ctx, "hanya CONTOH.", 1290, 430, 36, { align: "center", weight: 900, color: C.bad });
      para(ctx, "Jangan pernah memakai atau mengetik sandimu yang asli.", 1290, 495, 28, 520, { align: "center", weight: 700, color: C.ink2, lh: 1.25 });
      kiko(ctx, 1640, 720, 110, 0, { wave: l });
    },
    k2_mesin(ctx, b, l) {
      card(ctx, 120, 140, 1680, 690);
      const run = Math.max(0, l - 0.5);
      machine(ctx, 190, 190, 720, 600, { guess: guessAt(V.v2, run * SPEED), line1: "tebakan ke-" + fmt(run * SPEED + 1), pct: run * SPEED / totalOf(V.v2) * 100, status: "terus mencoba…" });
      const pts = [["Mesin tidak tahu sandimu.", "Ia hanya bisa mencoba."], ["Ia mencoba satu per satu:", "aaaaaaaa, aaaaaaab, aaaaaaac, …"], ["Sejuta tebakan setiap detik.", "Sama seperti di episode D7.3."]];
      pts.forEach(([a, c], i) => {
        if (l < at(b, 0.12 + i * 0.27)) return;
        card(ctx, 990, 200 + i * 190, 740, 160, { fill: i === 2 ? "#FFF3D6" : C.bg2, stroke: i === 2 ? C.accent : null, lw: 4, r: 20 });
        text(ctx, a, 1020, 262 + i * 190, 34, { weight: 900, fit: 680 }); text(ctx, c, 1020, 314 + i * 190, 28, { weight: 700, color: C.ink2, fit: 680 });
      });
    },
    k2_rumus_jumlah(ctx, b, l) {
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "MENGHITUNG JUMLAH KEMUNGKINAN", 960, 200, { align: "center", size: 30 });
      // dua kotak angka, masing-masing 10 pilihan
      const rows = Math.floor(l * 6);
      [0, 1].forEach(k => {
        const x = 220 + k * 300; card(ctx, x, 240, 200, 420, { fill: C.bg2, r: 18 });
        for (let d = 0; d < 10; d++) { const on = d === (k ? rows % 10 : Math.floor(rows / 10) % 10); ctx.fillStyle = on ? C.accent : "#FFFFFF"; rr(ctx, x + 30, 256 + d * 38, 140, 32, 8); ctx.fill(); text(ctx, String(d), x + 100, 281 + d * 38, 24, { align: "center", weight: 900, color: on ? "#FFFFFF" : C.ink }); }
        text(ctx, "10 pilihan", x + 100, 700, 28, { align: "center", weight: 800, color: C.ink2 });
      });
      text(ctx, "×", 470, 470, 60, { align: "center", weight: 900, color: C.ink2 });
      const cur = String(Math.floor(rows / 10) % 10) + String(rows % 10);
      text(ctx, "sandi: " + cur, 470, 770, 34, { align: "center", weight: 900, color: DEEP });
      const lines = [["1 angka", "10", "= 10"], ["2 angka", "10 × 10", "= 100"], ["3 angka", "10 × 10 × 10", "= 1.000"]];
      lines.forEach(([a, m, r], i) => {
        if (l < at(b, 0.35 + i * 0.12)) return;
        const y = 260 + i * 92; card(ctx, 860, y, 860, 76, { fill: i === 1 ? "#FFF3D6" : "#F4F7F5", r: 14 });
        text(ctx, a, 890, y + 50, 30, { weight: 900 }); text(ctx, m, 1110, y + 50, 30, { weight: 800, color: C.ink2 }); text(ctx, r, 1690, y + 50, 32, { align: "right", weight: 900, color: DEEP });
      });
      if (l > at(b, 0.18)) {
        card(ctx, 860, 560, 860, 200, { fill: "#E7F1FB", stroke: "#9CC2E6", lw: 3, r: 20 });
        text(ctx, "kemungkinan =", 890, 615, 30, { weight: 800, color: C.ink2 });
        text(ctx, "jenis karakter pangkat panjang sandi", 890, 670, 36, { weight: 900, color: DEEP, fit: 800 });
        text(ctx, "(jenis karakter dikali sebanyak panjangnya)", 890, 724, 26, { weight: 700, color: C.ink2 });
      }
    },
    k2_rumus_waktu(ctx, b, l) {
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "DARI KEMUNGKINAN KE WAKTU", 960, 200, { align: "center", size: 30 });
      card(ctx, 200, 240, 760, 220, { fill: "#E7F1FB", stroke: "#9CC2E6", lw: 3, r: 20 });
      text(ctx, "waktu (detik) =", 230, 300, 32, { weight: 800, color: C.ink2 });
      text(ctx, "kemungkinan ÷ 1.000.000", 230, 365, 46, { weight: 900, color: DEEP, fit: 700 });
      text(ctx, "karena mesin mencoba sejuta tiap detik", 230, 425, 26, { weight: 700, color: C.ink2 });
      if (l > at(b, 0.25)) {
        card(ctx, 200, 500, 760, 260, { fill: "#F4F7F5", r: 20 });
        text(ctx, "Contoh: sandi 2 angka", 230, 560, 30, { weight: 900 });
        text(ctx, "100 ÷ 1.000.000", 230, 630, 40, { weight: 900, color: C.ink2 });
        text(ctx, "= 0,0001 detik", 230, 700, 40, { weight: 900, color: C.bad });
      }
      if (l > at(b, 0.55)) {
        card(ctx, 1020, 240, 700, 520, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 });
        header(ctx, "MENGUBAH SATUAN", 1370, 295, { align: "center" });
        [["60 detik", "1 menit"], ["3.600 detik", "1 jam"], ["86.400 detik", "1 hari"], ["± 31.600.000 detik", "1 tahun"]].forEach(([a, c], i) => {
          if (l < at(b, 0.6 + i * 0.08)) return;
          const y = 330 + i * 102; ctx.fillStyle = "#F4F7F5"; rr(ctx, 1050, y, 640, 84, 14); ctx.fill();
          text(ctx, a, 1075, y + 54, 32, { weight: 900, fit: 380 }); text(ctx, "= " + c, 1665, y + 54, 32, { align: "right", weight: 900, color: DEEP });
        });
      }
    },
    k2_tanya(ctx, b, l) {
      const v = vOf(b);
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "VARIASI " + v.no + " DARI 5", 200, 210, { size: 30 });
      text(ctx, "Menurutmu, apa yang terjadi kalau sandinya…", 200, 290, 44, { weight: 900, fit: 1200 });
      pwLine(ctx, 200, 340, 1180, v.pw, { h: 120, size: 64, stroke: C.accent });
      text(ctx, v.label, 200, 530, 36, { weight: 800, color: C.ink2 });
      text(ctx, "jenis karakter:", 200, 610, 28, { weight: 800, color: C.ink2 }); chips(ctx, 420, 570, v.sets);
      text(ctx, "Mesin: 1.000.000 tebakan per detik. Berapa lama?", 200, 730, 32, { weight: 800, color: DEEP });
      kiko(ctx, 1600, 640, 190, 0, { mood: "confused" });
      if (l > 0.6) bubble(ctx, 1460, 430, 260, "Berapa lama, ya?", 32, { tailX: 1580, tailDir: 10 });
    },
    k2_tebak(ctx, b, l) {
      const v = vOf(b);
      card(ctx, 120, 140, 1680, 690, { stroke: C.accent, lw: 6 });
      header(ctx, "VARIASI " + v.no + " · TEBAK DULU", 200, 210, { size: 30 });
      pwLine(ctx, 200, 240, 1100, v.pw, { h: 100, size: 50 });
      text(ctx, v.label, 1340, 305, 30, { weight: 800, color: C.ink2, fit: 400 });
      (b.pilih || []).forEach((o, i) => {
        const x = 200 + i * 520; card(ctx, x, 420, 480, 220, { fill: C.bg2, stroke: "#CFDCD5", lw: 3, r: 22 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 240, 480, 32, 0, Math.PI * 2); ctx.fill();
        text(ctx, "ABC"[i], x + 240, 493, 34, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, o, x + 240, 590, 42, { align: "center", weight: 900, fit: 430 });
      });
      ring(ctx, 1700, 210, l / b.dur);
      text(ctx, "Pilih satu dalam hati, lalu lihat hasilnya.", 960, 720, 32, { align: "center", weight: 700, color: C.ink2 });
    },
    k2_jalan(ctx, b, l) {
      const v = vOf(b);
      card(ctx, 120, 140, 950, 690);
      header(ctx, "SANDI CONTOH", 160, 192);
      pwLine(ctx, 160, 210, 870, v.pw, { h: 92, size: v.len > 20 ? 40 : 50 });
      header(ctx, "JENIS KARAKTER: " + v.n, 160, 352);
      chips(ctx, 160, 372, v.sets, { size: v.sets.length > 2 ? 22 : 26 });
      const steps = [["kemungkinan = " + v.kali, 30, C.ink], ["= " + v.pang + " = " + v.komb, 34, DEEP], ["waktu = " + v.waktu, 30, C.ink], ["= " + v.detik, 36, v.col]];
      const marks = v.no === 5 ? [0.04, 0.12, 0.2, 0.28] : v.no === 3 ? [0.04, 0.55, 0.75, 0.88] : [0.04, 0.4, 0.62, 0.8];
      steps.forEach(([s, size, col], i) => {
        if (l < at(b, marks[i])) return;
        const y = 470 + i * 88; ctx.fillStyle = i % 2 ? "#F4F7F5" : "#FFFFFF"; rr(ctx, 150, y, 890, 78, 12); ctx.fill();
        text(ctx, s, 170, y + 52, size, { weight: 900, color: col, fit: 850 });
      });
      // mesin di kanan
      const run = l - at(b, 0.04);
      if (v.no === 5) {
        const list = l > at(b, 0.72);
        const st = list ? { guess: "123456", line1: "mode baru: daftar sandi bocoran", status: "pindah ke daftar…", mode: "daftar bocoran" } : machineState(v, run, { status: "rumus: ± 4,5 tahun" });
        machine(ctx, 1110, 140, 690, 690, st);
        if (l > at(b, 0.45) && !list) L_note(ctx, "Mesin cerdik tidak langsung mencoba semua.", 1130, 760);
      } else {
        machine(ctx, 1110, 140, 690, 690, machineState(v, run));
      }
    },
    k2_hasil(ctx, b, l) {
      const v = vOf(b);
      card(ctx, 120, 140, 1100, 690);
      header(ctx, "HASIL VARIASI " + v.no, 170, 200);
      text(ctx, v.pw, 170, 262, 40, { weight: 900, fit: 640 }); text(ctx, v.label, 1180, 262, 26, { align: "right", weight: 800, color: C.ink2, fit: 400 });
      ctx.fillStyle = "#E3EAE6"; ctx.fillRect(170, 290, 1000, 3);
      text(ctx, v.no === 5 ? "Tertebak dalam:" : "Waktu untuk mencoba semua kemungkinan:", 170, 350, 30, { weight: 800, color: C.ink2 });
      text(ctx, v.big, 170, 440, v.no === 4 ? 52 : 76, { weight: 900, color: v.col, fit: 1000 });
      const a = b.audio || b.dur;
      if (v.no === 1) {
        // kedipan mata vs mesin; HP mengunci diri
        const blink = (Math.sin(l * 3) + 1) / 2;
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(300, 600, 100, 60 * (0.15 + 0.85 * blink), 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(300, 600, 26 * (0.3 + 0.7 * blink), 0, Math.PI * 2); ctx.fill();
        text(ctx, "satu kedipan mata", 300, 720, 26, { align: "center", weight: 800 }); text(ctx, "± 0,1 – 0,4 detik", 300, 760, 26, { align: "center", weight: 700, color: C.ink2 });
        text(ctx, "Mesin lebih cepat daripada kedipan.", 480, 560, 30, { weight: 900, color: C.bad, fit: 640 });
        if (l > a * 0.5) {
          card(ctx, 480, 600, 690, 190, { fill: C.goodBg, stroke: C.good, lw: 3, r: 18 });
          text(ctx, "PIN di HP tetap aman karena", 505, 650, 28, { weight: 800 });
          text(ctx, "HP mengunci diri setelah", 505, 695, 28, { weight: 800 });
          text(ctx, "beberapa kali salah.", 505, 740, 28, { weight: 800, color: C.good });
        }
      } else if (v.no === 2) {
        const days = ["Hari 1", "Hari 2", "Hari 3"], fill = Math.min(58, Math.floor(58 * clamp((l - 0.4) / (a * 0.5), 0, 1)));
        days.forEach((d, i) => {
          const x = 180 + i * 330; text(ctx, d, x + 150, 520, 28, { align: "center", weight: 900 });
          for (let hh = 0; hh < 24; hh++) { const k = i * 24 + hh, on = k < fill; ctx.fillStyle = on ? AMBER : "#EEF2EF"; rr(ctx, x + (hh % 8) * 38, 540 + Math.floor(hh / 8) * 50, 32, 42, 6); ctx.fill(); }
        });
        text(ctx, fill + " jam", 180, 760, 32, { weight: 900, color: AMBER });
        text(ctx, "satu kotak = satu jam", 1170, 760, 24, { align: "right", weight: 700, color: C.ink2 });
      } else if (v.no === 3) {
        const u = ease(clamp((l - 0.4) / (a * 0.55), 0, 1)), x0 = 220, x1 = 1120;
        ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, 620); ctx.lineTo(x1, 620); ctx.stroke();
        ctx.strokeStyle = C.good; ctx.beginPath(); ctx.moveTo(x0, 620); ctx.lineTo(lerp(x0, x1, u), 620); ctx.stroke();
        [2026, 2076, 2126, 2176, 2219].forEach((yr, i) => { const x = lerp(x0, x1, (yr - 2026) / 193); ctx.fillStyle = "#8A9BA6"; ctx.fillRect(x - 2, 600, 4, 40); text(ctx, String(yr), x, 680, 26, { align: "center", weight: 800, color: i === 4 ? C.good : C.ink2 }); });
        text(ctx, "mulai hari ini", x0, 570, 24, { weight: 800, color: C.ink2 });
        if (u >= 1) text(ctx, "baru selesai ± tahun 2219", x1, 570, 26, { align: "right", weight: 900, color: C.good });
        text(ctx, "Kuat, tetapi sulit diingat: K4n!t#9b", 170, 770, 30, { weight: 800, color: C.ink2 });
      } else if (v.no === 4) {
        text(ctx, "(kalau ditebak huruf demi huruf)", 170, 500, 28, { weight: 700, color: C.ink2 });
        if (l > a * 0.35) {
          card(ctx, 170, 540, 1000, 230, { fill: "#F4F7F5", r: 18 });
          text(ctx, "umur alam semesta:", 200, 600, 28, { weight: 800, color: C.ink2 });
          text(ctx, "± 14.000.000.000 tahun", 200, 655, 40, { weight: 900 });
          text(ctx, "tahun menebak frasa: 23 angka · umur alam semesta: 11 angka", 200, 730, 24, { weight: 700, color: DEEP, fit: 940 });
        }
      } else {
        S.lock(ctx, 300, 640, 120, { open: true });
        text(ctx, "ditemukan di daftar bocoran", 450, 590, 34, { weight: 900, color: C.bad, fit: 700 });
        text(ctx, "rumus: ± 4,5 tahun", 450, 660, 32, { weight: 800, color: C.ink2 });
        ctx.strokeStyle = C.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(445, 650); ctx.lineTo(735, 650); ctx.stroke();
        text(ctx, "Rumus hanya berlaku untuk sandi acak.", 450, 740, 30, { weight: 900, color: DEEP, fit: 700 });
      }
      board(ctx, 1250, 140, 550, v.no);
    },
    k2_kamus(ctx, b, l) {
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "PENEBAK YANG CERDIK MENEBAK KATA, BUKAN HURUF", 960, 200, { align: "center", size: 30 });
      const words = ["kucing", "angkot", "hujan", "bakso"], cols = ["#FFF3B0", "#DCEBFF", "#D6F5E3", "#FFD6E0"];
      words.forEach((w, i) => {
        const x = 200 + i * 390; card(ctx, x, 240, 350, 150, { fill: cols[i], r: 18 });
        text(ctx, w, x + 175, 310, 46, { align: "center", weight: 900 }); text(ctx, "20.000 pilihan", x + 175, 365, 26, { align: "center", weight: 800, color: C.ink2 });
        if (i) text(ctx, "×", x - 20, 330, 40, { align: "center", weight: 900, color: C.ink2 });
      });
      const a = b.audio || b.dur;
      const st = [["kemungkinan = 20.000⁴ = 160.000.000.000.000.000", 34, DEEP], ["waktu = 160.000.000.000 detik ≈ 5.070 tahun", 36, C.good]];
      st.forEach(([s, size, col], i) => { if (l < a * (0.25 + i * 0.22)) return; const y = 430 + i * 92; ctx.fillStyle = "#F4F7F5"; rr(ctx, 200, y, 1520, 78, 12); ctx.fill(); text(ctx, s, 230, y + 52, size, { weight: 900, color: col, fit: 1460 }); });
      if (l > a * 0.7) {
        card(ctx, 200, 640, 1520, 150, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 });
        text(ctx, "Syarat: kata-katanya benar-benar acak.", 240, 705, 36, { weight: 900 });
        text(ctx, "Bukan lirik lagu, nama idola, atau kalimat terkenal.", 240, 760, 30, { weight: 700, color: C.ink2 });
      }
    },
    k2_daftar(ctx, b, l) {
      const a = b.audio || b.dur;
      card(ctx, 120, 140, 1000, 690);
      header(ctx, "CONTOH ISI DAFTAR SANDI BOCORAN", 170, 200);
      text(ctx, "berisi jutaan sandi yang pernah dipakai orang", 170, 245, 26, { weight: 700, color: C.ink2 });
      const list = ["123456", "password", "123456789", "qwerty", "12345678", "111111", "iloveyou", "abc123", "qwertyuiop", "…"];
      const hit = 8, cur = Math.min(hit, Math.floor(clamp((l - 0.4) / (a * 0.75), 0, 1) * (hit + 1)));
      list.forEach((s, i) => {
        const col = i % 2, row = Math.floor(i / 2), x = 170 + col * 470, y = 272 + row * 88;
        const tried = i < cur, now = i === cur, found = now && i === hit;
        card(ctx, x, y, 440, 76, { fill: found ? C.badBg : now ? "#FFF3D6" : tried ? "#EEF1F0" : "#F7FAF8", stroke: found ? C.bad : now ? C.accent : "#D7E2DC", lw: found || now ? 4 : 2, r: 14 });
        text(ctx, s, x + 26, y + 50, 32, { weight: 900, color: tried ? C.muted : C.ink });
        if (tried) text(ctx, "✗", x + 410, y + 50, 30, { align: "right", weight: 900, color: C.muted });
        if (found) text(ctx, "COCOK!", x + 414, y + 50, 28, { align: "right", weight: 900, color: C.bad });
      });
      machine(ctx, 1160, 140, 640, 690, { guess: list[Math.min(cur, hit)], line1: "tebakan ke-" + (Math.min(cur, hit) + 1) + " dari daftar", mode: "daftar bocoran", found: cur >= hit, status: cur >= hit ? "COCOK! kurang dari 1 detik" : "mencoba daftar…" });
      if (l > a * 0.55) {
        // baris atas keyboard
        const keys = "qwertyuiop".split(""); keys.forEach((k, i) => { const x = 175 + i * 92; card(ctx, x, 735, 80, 62, { fill: "#FFFFFF", stroke: "#9AA8B1", lw: 2, r: 10 }); text(ctx, k, x + 40, 777, 30, { align: "center", weight: 900 }); });
      }
    },
    k2_banding(ctx, b, l) {
      const a = b.audio || b.dur, full = !!b.full;
      card(ctx, 120, 140, 1680, 690);
      header(ctx, "MEMBANDINGKAN KELIMA SANDI", 960, 195, { align: "center", size: 30 });
      const L0 = -2.5, L1 = 12.2, X0 = 640, X1 = 1740, xs = lg => X0 + (lg - L0) / (L1 - L0) * (X1 - X0);
      const ticks = [["1 detik", 0], ["1 menit", Math.log10(60)], ["1 jam", Math.log10(3600)], ["1 hari", Math.log10(86400)], ["1 tahun", Math.log10(31557600)], ["100 tahun", Math.log10(3155760000)], ["10.000 tahun", Math.log10(315576000000)]];
      ticks.forEach(([s, lg], i) => { const x = xs(lg); ctx.fillStyle = "#E3EAE6"; ctx.fillRect(x - 1, 222, 2, 530); text(ctx, s, x, 785, 21, { align: "center", weight: 800, color: C.ink2 }); });
      const rows = [["qwertyuiop", "sandi umum", -0.3, "< 1 detik", C.bad], ["4821", "4 angka", -2, "0,01 detik", C.bad], ["kwtbramp", "8 huruf kecil", Math.log10(208827), "± 2,4 hari", AMBER],
                    ["K4n!t#9b", "8 campuran", Math.log10(6.0957e9), "± 193 tahun", C.good], ["kucing-angkot-hujan-bakso", "frasa 4 kata", Math.log10(1.6e11), "± 5.070 tahun", DEEP]];
      rows.forEach(([pw, lab, lg, t, col], i) => {
        const show = full ? (i < 4 || l > 0.3) : l > at(b, 0.18 + i * 0.16) && i < 4; if (!show) return;
        const y = 228 + i * 90, grow = full && i < 4 ? 1 : ease(clamp((l - (full ? 0.3 : at(b, 0.18 + i * 0.16))) / 0.8, 0, 1));
        const hl = full && i === 4;
        if (hl) { ctx.fillStyle = "#E7F1FB"; rr(ctx, 140, y - 4, 1640, 86, 14); ctx.fill(); }
        text(ctx, pw, 160, y + 40, 28, { weight: 900, fit: 460 }); text(ctx, lab, 160, y + 72, 22, { weight: 700, color: C.ink2 });
        const w = Math.max(14, (xs(lg) - X0) * grow); ctx.fillStyle = col; rr(ctx, X0, y + 18, w, 48, 10); ctx.fill();
        if (grow > 0.9) { const tx = X0 + w + 14, right = tx > 1560; text(ctx, t, right ? X0 + w - 14 : tx, y + 52, 26, { weight: 900, color: right ? "#FFFFFF" : col, align: right ? "right" : "left" }); }
      });
      if (full && l > at(b, 0.55)) {
        card(ctx, 600, 668, 1180, 88, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 });
        text(ctx, "Sandi kuat: panjang, acak, tidak ada di daftar bocoran.", 1190, 724, 32, { align: "center", weight: 900, color: C.good, fit: 1060 });
      }
    },
    k2_latihan(ctx, b, l) {
      const a = b.audio || b.dur;
      // jendela browser generik berisi halaman latihan D7.3
      const X = 130, Y = 130, Wd = 1120, Hd = 700;
      ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.18)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, X, Y, Wd, Hd, 16); ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, X, Y, Wd, Hd, 16); ctx.clip();
      ctx.fillStyle = "#EEF2F5"; ctx.fillRect(X, Y, Wd, 64);
      ["#E5675F", "#F2B134", "#4CB46A"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X + 28 + i * 26, Y + 32, 8, 0, Math.PI * 2); ctx.fill(); });
      card(ctx, X + 120, Y + 12, Wd - 150, 40, { fill: "#FFFFFF", r: 20 }); text(ctx, "belajar-informatika.vercel.app/d73", X + 145, Y + 40, 22, { weight: 700, color: C.ink2 });
      ctx.fillStyle = C.bg; ctx.fillRect(X, Y + 64, Wd, Hd - 64);
      card(ctx, X + 30, Y + 84, Wd - 60, Hd - 104, { fill: "#FFFFFF", r: 18 });
      const cx = X + 60;
      text(ctx, "Latihan: sandi dan jejak", cx, Y + 140, 32, { weight: 900 });
      const lv = ["1 Pengukur sandi", "2 Pilah jejak", "3 Unggah atau tidak?"], click1 = at(b, 0.12), click2 = at(b, 0.36);
      let bx = cx; const btn = {};
      lv.forEach((s, i) => { ctx.font = "800 22px Inter"; const w = ctx.measureText(s).width + 34; const on = i === 0 && l > click1;
        card(ctx, bx, Y + 165, w, 50, { fill: on ? "#FFF3D6" : "#F1F5F3", stroke: on ? C.accent : "#D7E2DC", lw: on ? 3 : 2, r: 12 }); text(ctx, s, bx + 17, Y + 198, 22, { weight: 800 }); btn[i] = { x: bx + w / 2, y: Y + 190 }; bx += w + 12; });
      ctx.fillStyle = C.badBg; rr(ctx, cx, Y + 235, Wd - 120, 50, 10); ctx.fill(); text(ctx, "Hanya contoh karangan. Jangan ketik kata sandi aslimu.", cx + 16, Y + 268, 21, { weight: 800, color: C.bad });
      const typed = l > click2 ? "sepeda-kantin-biru-pagi" : "";
      card(ctx, cx, Y + 300, Wd - 120, 64, { fill: "#FFFFFF", stroke: typed ? C.kiko : "#C9D4DB", lw: 3, r: 12 });
      text(ctx, typed || "contoh: kucing-angkot-hujan-bakso", cx + 18, Y + 342, 26, { weight: typed ? 800 : 600, color: typed ? C.ink : C.muted });
      // pengukur
      const lvl = typed ? 3 : -1;
      for (let i = 0; i < 4; i++) { ctx.fillStyle = lvl >= 0 ? DEEP : "#E3EAE6"; rr(ctx, cx + i * ((Wd - 120) / 4), Y + 384, (Wd - 120) / 4 - 8, 16, 8); ctx.fill(); }
      if (typed) text(ctx, "Kekuatan: sangat kuat", cx, Y + 438, 24, { weight: 900, color: DEEP });
      const samples = ["123456", "dito2013", "S!n7a", "sepeda-kantin-biru-pagi"]; let sx = cx; const sb = {};
      samples.forEach((s, i) => { ctx.font = "700 21px Inter"; const w = ctx.measureText(s).width + 28; const on = i === 3 && l > click2;
        card(ctx, sx, Y + 460, w, 46, { fill: on ? "#E7F1FB" : "#FFFFFF", stroke: on ? C.kiko : "#C9D4DB", lw: 2, r: 10 }); text(ctx, s, sx + 14, Y + 490, 21, { weight: 700 }); sb[i] = { x: sx + w - 18, y: Y + 498 }; sx += w + 10; });
      if (typed) ["✓ Panjang 23 huruf", "✓ Bukan sandi yang umum", "✓ Tidak berpola nama + tahun", "✓ Frasa 4 kata"].forEach((s, i) => {
        const x = cx + (i % 2) * 500, y = Y + 530 + Math.floor(i / 2) * 54; ctx.fillStyle = C.goodBg; rr(ctx, x, y, 480, 44, 10); ctx.fill(); text(ctx, s, x + 14, y + 30, 21, { weight: 800, color: C.good }); });
      ctx.restore();
      // pointer
      const p0 = { x: 900, y: 760 }, p1 = btn[0], p2 = sb[3];
      let p = p0, clk = 0;
      if (l < click1) { const u = ease(l / click1); p = { x: lerp(p0.x, p1.x, u), y: lerp(p0.y, p1.y, u) }; }
      else if (l < click2) { const u = ease((l - click1 - 0.4) / (click2 - click1 - 0.4)); p = { x: lerp(p1.x, p2.x, u), y: lerp(p1.y, p2.y, u) }; clk = (l - click1) / 0.5; }
      else { p = p2; clk = (l - click2) / 0.5; }
      if (clk > 0 && clk < 1) { ctx.strokeStyle = `rgba(242,177,52,${1 - clk})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(p.x, p.y, 12 + clk * 34, 0, Math.PI * 2); ctx.stroke(); }
      ctx.save(); ctx.translate(p.x, p.y); ctx.scale(1.3, 1.3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.lineTo(8, 23); ctx.lineTo(13, 35); ctx.lineTo(18, 33); ctx.lineTo(13, 21); ctx.lineTo(23, 21); ctx.closePath();
      ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.stroke(); ctx.restore();
      // tugas nyata
      card(ctx, 1290, 130, 510, 700, { fill: "#FFF9E0", r: 22 });
      header(ctx, "TUGAS NYATA", 1545, 195, { align: "center", size: 30 });
      ["Buat tiga frasa sandi karangan.", "Hitung waktunya dengan rumus tadi.", "Uji di pengukur sandi."].forEach((s, i) => {
        const y = 240 + i * 150; ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(1345, y + 40, 26, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 1345, y + 51, 30, { align: "center", weight: 900, color: "#FFFFFF" });
        para(ctx, s, 1390, y + 32, 30, 380, { weight: 800, lh: 1.25 });
      });
      text(ctx, "Jangan pakai contoh ini sebagai", 1545, 715, 22, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, "sandimu yang sungguhan.", 1545, 745, 22, { align: "center", weight: 700, color: C.ink2 });
    }
  });
  function L_note(ctx, s, x, y) { text(ctx, s, x, y, 24, { weight: 800, color: "#F2D58A" }); }
})(typeof window !== "undefined" ? window : globalThis);
