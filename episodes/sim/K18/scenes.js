/* K18 Simulasi konsep: melacak program Python (kas kelas) baris demi baris.
   Data jejak (baris, memori, keluaran, catatan) berasal dari jejak.js yang dibuat lacak.py dengan python3 sungguhan.
   Panel kode, memori, dan keluaran digambar di sini (font kode monospace JetBrains Mono). Gaya diagram Fase F.
   Semua gambar di atas y≈830 (kartu narasi tiga baris mulai y≈841). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, Py = K.py, J = K.k18jejak;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const MONO = "'JetBrains Mono', 'DejaVu Sans Mono', monospace";
  const DARK = "#1F2A33", DARK2 = "#2A3742", KWC = "#F2B134", STRC = "#A5D6A7", NUMC = "#8FD0E6";
  const KW = /^(if|else|elif|for|in|while|def|return|print|input|int|str|range|True|False)$/;

  function mono(ctx, s, x, y, size, opt = {}) {
    ctx.font = `${opt.weight || 600} ${size}px ${MONO}`; ctx.fillStyle = opt.color || "#FFFFFF"; ctx.textAlign = opt.align || "left"; ctx.textBaseline = "alphabetic"; ctx.fillText(s, x, y);
    return ctx.measureText(s).width;
  }
  // satu baris kode dengan pewarnaan sintaks
  function codeLine(ctx, t, x, y, size) {
    let cx = x;
    t.split(/("[^"]*"|\s+|\(|\)|:|,|\+|>|=)/).forEach(tok => {
      if (!tok) return;
      const col = KW.test(tok) ? KWC : /^".*"$/.test(tok) ? STRC : /^-?\d+$/.test(tok) ? NUMC : "#FFFFFF";
      cx += mono(ctx, tok, cx, y, size, { color: col, weight: KW.test(tok) ? 800 : 600 });
    });
  }

  // ---------- panel kode ----------
  // st: {ln (baris aktif 1-based), prev (baris sebelumnya), u (0..1 perpindahan), mark: {baris: "bad"|"good"}, dim}
  function codePanel(ctx, x, y, w, lines, st = {}, opt = {}) {
    const rh = opt.rh || 64, size = opt.size || 29, head = opt.head || 56, h = head + rh * lines.length + 18;
    card(ctx, x, y, w, h, { fill: DARK, r: 18 });
    ctx.fillStyle = DARK2; rr(ctx, x, y, w, head, 18); ctx.fill(); ctx.fillRect(x, y + head - 18, w, 18);
    [C.bad, C.accent, C.good].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 28 + i * 26, y + head / 2, 8, 0, Math.PI * 2); ctx.fill(); });
    text(ctx, opt.title || "Editor Python · kas_kelas.py", x + 112, y + head / 2 + 8, 22, { weight: 800, color: "#C9D6DE" });
    const ly = i => y + head + 8 + i * rh, gx = x + 92;
    // sorotan baris aktif (bergerak halus dari baris sebelumnya)
    if (st.ln) {
      const from = st.prev || st.ln, u = st.u == null ? 1 : st.u, yy = lerp(ly(from - 1), ly(st.ln - 1), u);
      ctx.fillStyle = "rgba(242,177,52,0.22)"; rr(ctx, x + 8, yy + 2, w - 16, rh - 4, 10); ctx.fill();
      // panah lompat (bila tidak berurutan)
      if (st.prev && st.prev !== st.ln && st.prev !== st.ln - 1 && u < 1) {
        const a = ease(clamp(u * 1.6, 0, 1)), y1 = ly(st.prev - 1) + rh / 2, y2 = ly(st.ln - 1) + rh / 2;
        ctx.save(); ctx.globalAlpha = 1 - ease(clamp((u - 0.6) / 0.4, 0, 1)); ctx.strokeStyle = KWC; ctx.lineWidth = 5; ctx.beginPath();
        const bend = x + 20 - 0 * a; ctx.moveTo(x + 52, y1); ctx.bezierCurveTo(bend, y1, bend, lerp(y1, y2, a), x + 52, lerp(y1, y2, a)); ctx.stroke(); ctx.restore();
      }
      // panah kuning
      const ay = yy + rh / 2; ctx.fillStyle = KWC; ctx.beginPath(); ctx.moveTo(x + 50, ay - 15); ctx.lineTo(x + 74, ay); ctx.lineTo(x + 50, ay + 15); ctx.closePath(); ctx.fill();
    }
    lines.forEach((t, i) => {
      const yy = ly(i), m = (st.mark || {})[i + 1];
      if (m) { ctx.fillStyle = m === "bad" ? "rgba(217,68,59,0.38)" : "rgba(46,158,91,0.40)"; rr(ctx, x + 84, yy + 4, w - 96, rh - 8, 8); ctx.fill(); }
      mono(ctx, String(i + 1), x + 34, yy + rh / 2 + 9, 20, { align: "center", color: st.ln === i + 1 ? KWC : "#6E808C", weight: 700 });
      ctx.save(); if (st.dim && st.dim.includes(i + 1)) ctx.globalAlpha = 0.35; codeLine(ctx, t, gx + 8, yy + rh / 2 + 10, size); ctx.restore();
    });
    return { h, ly: i => ly(i - 1), rh, gx };
  }

  // ---------- panel memori ----------
  const TCOL = { int: "#2E7E9A", str: "#2E9E5B", float: "#7E57C2", bool: "#D9822B", list: "#B57A12" };
  function memPanel(ctx, x, y, w, vars, prev, opt = {}) {
    const rh = 64, h = opt.h || 112 + rh * 4;
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#CFDCD5", lw: 3, r: 18 });
    text(ctx, "MEMORI", x + 24, y + 42, 24, { weight: 900, color: C.kikoDark });
    const cn = x + 24, cv = x + 230, ct = x + w - 150;
    [["nama", cn], ["nilai", cv], ["tipe", ct]].forEach(([s, cx]) => text(ctx, s, cx, y + 84, 19, { weight: 800, color: C.ink2 }));
    ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 16, y + 96); ctx.lineTo(x + w - 16, y + 96); ctx.stroke();
    const pm = {}; (prev || []).forEach(([k, v]) => pm[k] = v);
    if (!vars.length && opt.empty) text(ctx, opt.empty, x + w / 2, y + 170, 24, { align: "center", weight: 700, color: C.muted });
    vars.forEach(([k, v, t], i) => {
      const ry = y + 104 + i * rh, isNew = prev && !(k in pm), chg = prev && k in pm && pm[k] !== v, flash = opt.flash == null ? 1 : opt.flash;
      if ((isNew || chg) && flash > 0) { ctx.save(); ctx.globalAlpha = flash; ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, ry, w - 20, rh - 6, 10); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, x + 10, ry, w - 20, rh - 6, 10); ctx.stroke(); ctx.restore(); }
      if (opt.badRow === k) { ctx.strokeStyle = C.bad; ctx.lineWidth = 5; rr(ctx, x + 10, ry, w - 20, rh - 6, 10); ctx.stroke(); }
      mono(ctx, k, cn, ry + 40, 28, { color: C.ink, weight: 800 });
      mono(ctx, v === "?" ? "?" : v, cv, ry + 40, 30, { color: v === "?" ? C.muted : t === "str" ? C.good : C.ink, weight: 800 });
      if (t) { const c = TCOL[t] || C.ink2; card(ctx, ct, ry + 10, 110, 40, { fill: c, r: 20 }); mono(ctx, t, ct + 55, ry + 38, 22, { align: "center", color: "#FFFFFF", weight: 800 }); }
      if (isNew && flash > 0) text(ctx, "baru", ct - 18, ry + 38, 18, { align: "right", weight: 900, color: C.accentDark });
    });
    return h;
  }

  // ---------- layar keluaran ----------
  function outPanel(ctx, x, y, w, h, lines, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#0E1418", stroke: "#4A5A66", lw: 3, r: 16 });
    text(ctx, "KELUARAN", x + 20, y + 32, 18, { weight: 900, color: NUMC });
    const max = opt.max || Math.floor((h - 46) / 36), show = lines.slice(-max);
    show.forEach((segs, i) => {
      let cx = x + 22; const yy = y + 70 + i * 36;
      segs.forEach(([t, kind]) => { cx += mono(ctx, t, cx, yy, 25, { color: kind === "in" ? KWC : kind === "err" ? "#FF8A80" : "#FFFFFF", weight: kind === "in" ? 800 : 600 }); });
      if (opt.newLast && i === show.length - 1 && opt.newLast > 0) { ctx.save(); ctx.globalAlpha = opt.newLast * 0.25; ctx.fillStyle = KWC; ctx.fillRect(x + 10, yy - 28, w - 20, 36); ctx.restore(); }
    });
    if (lines.length > max) text(ctx, "▲ baris lebih atas", x + w - 20, y + 32, 16, { align: "right", weight: 700, color: "#6E808C" });
  }

  // ---------- tata letak pelacak ----------
  const CODE = { x: 110, y: 124, w: 890 }, MEM = { x: 1030, y: 124, w: 780 }, NOTE = { x: 1030, y: 504, w: 780, h: 106 }, OUT = { x: 1030, y: 624, w: 780, h: 202 };
  const progOf = run => J.programs[J.runs[run].prog];
  function tracer(ctx, run, k, u, opt = {}) {
    const R = J.runs[run], steps = R.steps, st = k >= 0 ? steps[k] : null, pv = k > 0 ? steps[k - 1] : null;
    const mark = R.prog === "bug" ? { 3: "bad" } : {};
    codePanel(ctx, CODE.x, CODE.y, CODE.w, progOf(run), st ? { ln: st.ln, prev: pv ? pv.ln : null, u, mark } : { mark });
    if (!opt.noStep) text(ctx, st ? `langkah ${k + 1} dari ${steps.length}` : `${steps.length} langkah`, CODE.x + CODE.w / 2, 812, 24, { align: "center", weight: 800, color: C.ink2 });
    memPanel(ctx, MEM.x, MEM.y, MEM.w, st ? st.vars : [], st ? (pv ? pv.vars : []) : null, { empty: "belum ada variabel", badRow: opt.badRow });
    card(ctx, NOTE.x, NOTE.y, NOTE.w, NOTE.h, { fill: C.bg2, r: 16 });
    if (st) { text(ctx, "baris " + st.ln, NOTE.x + 22, NOTE.y + 32, 20, { weight: 900, color: C.kikoDark }); para(ctx, st.note, NOTE.x + 22, NOTE.y + 64, 24, NOTE.w - 44, { weight: 800, lh: 1.2, color: C.ink }); }
    else { text(ctx, "masukan: " + R.inputs.join(", "), NOTE.x + 22, NOTE.y + 70, 28, { weight: 800, color: C.ink, fit: NOTE.w - 44 }); }
    const newOut = st && pv && st.out.length > pv.out.length ? 1 - clamp(u, 0, 1) * 0.6 : 0;
    outPanel(ctx, OUT.x, OUT.y, OUT.w, OUT.h, st ? st.out : [], { newLast: newOut });
  }
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  const at = (b, f) => (b.audio || b.dur) * f;
  const VARNO = { v1: 1, v2: 2, v3: 3, v4: 4 };
  function callout(ctx, s, x, y, tx, ty, opt = {}) { L.callout(ctx, x, y, s, tx, ty, opt); }

  // halaman latihan F11.2 (ponsel), program 1 pelacak dari page.html
  const PAGE_PROG = ["total = 0", "for t in [20000, 15000, 10000]:", "    total = total + t", "print(total)"];
  const PAGE_STEPS = [{ ln: 0, v: { total: 0 } }, { ln: 1, v: { t: 20000, total: 0 } }, { ln: 2, v: { t: 20000, total: 20000 } }, { ln: 1, v: { t: 15000, total: 20000 } }, { ln: 2, v: { t: 15000, total: 35000 } }, { ln: 1, v: { t: 10000, total: 35000 } }, { ln: 2, v: { t: 10000, total: 45000 } }, { ln: 3, v: { t: 10000, total: 45000 }, out: "45000" }];
  function pill(ctx, x, y, w, h, s, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.on ? C.accent : opt.fill || "#FFFFFF", stroke: opt.on ? C.accent : "#CFDCD5", lw: 2, r: 10 });
    text(ctx, s, x + w / 2, y + h / 2 + 7, opt.size || 19, { align: "center", weight: 900, color: opt.on ? "#FFFFFF" : C.ink, fit: w - 16 });
  }

  Object.assign(K.SCENES, {
    // versi ringkas untuk Short: kode besar, memori sebagai kartu mendatar, baris keluaran terakhir (wilayah 100–1100 × 120–1000)
    k18s_jalan(ctx, b, l) {
      const R = J.runs[b.run], steps = R.steps, [a, z] = b.steps || [-1, -1], m = z - a + 1, t0 = 0.3, per = Math.max(0.5, (at(b, 0.92) - t0) / Math.max(1, m));
      const j = Math.floor((l - t0) / per), k = a < 0 ? -1 : l < t0 ? a - 1 : a + clamp(j, 0, m - 1), u = l < t0 ? 1 : ease(clamp(((l - t0) - clamp(j, 0, m - 1) * per) / 0.4, 0, 1));
      const st = k >= 0 ? steps[k] : null, pv = k > 0 ? steps[k - 1] : null, mark = b.mark ? { [b.mark[0]]: b.mark[1] } : R.prog === "bug" ? { 3: "bad" } : {};
      codePanel(ctx, 100, 120, 1000, progOf(b.run), st ? { ln: st.ln, prev: pv ? pv.ln : null, u, mark } : { mark }, { rh: 56, size: 31, head: 52 });
      const vars = st ? st.vars : [], pm = {}; (pv ? pv.vars : []).forEach(([k2, v]) => pm[k2] = v);
      ["n", "i", "total", "jumlah"].forEach((name, i) => {
        const x = 100 + i * 254, y = 730, v = vars.find(q => q[0] === name), chg = v && pv && pm[name] !== v[1];
        card(ctx, x, y, 238, 150, { fill: chg ? "#FFF3D6" : "#FFFFFF", stroke: chg ? C.accent : name === b.focus ? C.bad : "#CFDCD5", lw: chg || name === b.focus ? 5 : 3, r: 16 });
        mono(ctx, name, x + 20, y + 44, 30, { color: C.kikoDark, weight: 800 });
        mono(ctx, v ? v[1] : "–", x + 20, y + 100, 38, { color: C.ink, weight: 800 });
        if (v) { card(ctx, x + 20, y + 112, 76, 30, { fill: TCOL[v[2]] || C.ink2, r: 15 }); mono(ctx, v[2], x + 58, y + 134, 20, { align: "center", weight: 800 }); }
      });
      const last = st && st.out.length ? st.out[st.out.length - 1] : null;
      card(ctx, 100, 900, 1000, 84, { fill: "#0E1418", r: 16 });
      let cx = 126; (last || [["keluaran: …", "out"]]).forEach(([t, kind]) => { cx += mono(ctx, t, cx, 954, 32, { color: kind === "in" ? KWC : last ? "#FFFFFF" : "#6E808C", weight: 700 }); });
    },
    k18_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["melacak program baris demi baris", "membaca isi memori dan tipe datanya", "menebak cabang if yang dijalankan", "menemukan bug dari jejak memori"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 800, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800, fit: 690 }); ctx.globalAlpha = 1;
      });
      const v = J.runs.v1.steps[5];
      ctx.save(); ctx.translate(1120, 290); ctx.scale(0.58, 0.58);
      codePanel(ctx, 0, 0, 890, J.programs.benar, { ln: v.ln }); ctx.restore();
      ctx.save(); ctx.translate(1120, 680); ctx.scale(0.58, 0.58); card(ctx, 0, 0, 890, 150, { fill: "#fff", stroke: "#CFDCD5", lw: 3, r: 18 });
      mono(ctx, "total", 30, 90, 40, { color: C.ink, weight: 800 }); mono(ctx, "20000", 300, 90, 42, { color: C.ink, weight: 800 }); card(ctx, 680, 52, 150, 54, { fill: TCOL.int, r: 27 }); mono(ctx, "int", 755, 90, 30, { align: "center", weight: 800 }); ctx.restore();
    },
    k18_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 330, 290, 620, 360, { fill: C.bg2, r: 22 });
      text(ctx, "F11.2", 640, 380, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Dari Pseudocode ke Kode", 640, 450, 38, 540, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas XI", 640, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      [["input() dan int()", "membaca masukan"], ["if … else", "percabangan"], ["for … in range()", "perulangan"]].forEach(([s, sub], i) => {
        const u = ease((l - 1 - i * 0.6) / 0.4); ctx.globalAlpha = Math.max(0.15, u);
        card(ctx, 1030, 290 + i * 120, 560, 100, { fill: DARK, r: 16 }); mono(ctx, s, 1060, 334 + i * 120, 30, { color: KWC, weight: 800 });
        text(ctx, sub, 1060, 372 + i * 120, 22, { weight: 700, color: "#C9D6DE" }); ctx.globalAlpha = 1;
      });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    },
    k18_kenal(ctx, b, l) {
      const prog = J.programs.benar;
      if (b.step === 1) {
        const parts = [[[1], "membaca banyaknya transaksi", 0.12], [[2, 3, 4], "menyiapkan total, lalu mengulang n kali", 0.32], [[5, 6, 7, 8], "positif ditambah, selain itu ditolak", 0.52], [[9], "mencetak total kas", 0.72]];
        let on = -1; parts.forEach((p, i) => { if (l > at(b, p[2])) on = i; });
        const mark = {}; if (on >= 0) parts[on][0].forEach(n => mark[n] = "good");
        codePanel(ctx, CODE.x, CODE.y, CODE.w, prog, { mark });
        parts.forEach(([ls, s], i) => {
          const y = 150 + i * 150; ctx.save(); ctx.globalAlpha = i <= on ? 1 : 0.18;
          card(ctx, 1060, y, 740, 120, { fill: i === on ? "#FFF3D6" : "#FFFFFF", stroke: i === on ? C.accent : "#CFDCD5", lw: 3, r: 16 });
          text(ctx, "baris " + (ls.length > 1 ? ls[0] + "–" + ls[ls.length - 1] : ls[0]), 1090, y + 46, 22, { weight: 900, color: C.kikoDark });
          text(ctx, s, 1090, y + 90, 30, { weight: 800, fit: 680 }); ctx.restore();
        });
        text(ctx, "Ketik di Colab. Bisa juga di IDLE.", 1430, 790, 24, { align: "center", weight: 800, color: C.ink2 });
        return;
      }
      const k = 3; tracer(ctx, "v1", k, 1, { noStep: true });
      const a = b.audio || b.dur;
      if (l > a * 0.08) callout(ctx, "panah = baris yang sedang dijalankan", 330, 768, CODE.x + 70, CODE.y + 56 + 8 + 3 * 64 + 32, { fill: "#FFF3D6", maxW: 800, size: 24 });
      if (l > a * 0.32) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; rr(ctx, MEM.x - 6, MEM.y - 6, MEM.w + 12, 112 + 64 * 4 + 12, 20); ctx.stroke(); }
      if (l > a * 0.75) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; rr(ctx, OUT.x - 6, OUT.y - 6, OUT.w + 12, OUT.h + 12, 20); ctx.stroke(); }
    },
    k18_tanya(ctx, b, l) {
      const R = J.runs[b.run], bug = R.prog === "bug";
      codePanel(ctx, CODE.x, CODE.y, CODE.w, progOf(b.run), { mark: bug ? { 3: "bad" } : {} });
      if (bug) text(ctx, "baris 3 ikut menjorok ke dalam for", CODE.x + CODE.w / 2, 812, 24, { align: "center", weight: 900, color: C.bad });
      card(ctx, MEM.x, MEM.y, MEM.w, 702, { fill: "#FFFFFF", r: 18 });
      text(ctx, "VARIASI " + VARNO[b.run], MEM.x + MEM.w / 2, MEM.y + 60, 30, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "masukan yang diketik:", MEM.x + 40, MEM.y + 130, 24, { weight: 800, color: C.ink2 });
      const labels = ["banyak transaksi", "jumlah 1", "jumlah 2", "jumlah 3"];
      R.inputs.forEach((v, i) => {
        const u = ease((l - 0.6 - i * 0.5) / 0.4), y = MEM.y + 160 + i * 86; ctx.globalAlpha = Math.max(0, u);
        card(ctx, MEM.x + 40, y, MEM.w - 80, 70, { fill: i === 0 ? C.bg2 : "#F4F7F5", r: 12 });
        text(ctx, labels[i], MEM.x + 64, y + 45, 24, { weight: 700, color: C.ink2 }); mono(ctx, v, MEM.x + MEM.w - 64, y + 47, 32, { align: "right", color: C.accentDark, weight: 800 });
        ctx.globalAlpha = 1;
      });
      const q = b.run === "v3" ? "Muncul di memori: i dan jumlah?" : b.run === "v2" ? "Bagaimana nasib -5000?" : "Total kas = ?";
      card(ctx, MEM.x + 40, MEM.y + 560, MEM.w - 80, 100, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 });
      text(ctx, q, MEM.x + MEM.w / 2, MEM.y + 624, 32, { align: "center", weight: 900, color: C.accentDark, fit: MEM.w - 120 });
    },
    k18_tebak(ctx, b, l) {
      const R = J.runs[b.run];
      codePanel(ctx, CODE.x, CODE.y, CODE.w, progOf(b.run), { mark: R.prog === "bug" ? { 3: "bad" } : {} });
      text(ctx, "masukan: " + R.inputs.join(", "), CODE.x + CODE.w / 2, 812, 26, { align: "center", weight: 900, color: C.accentDark });
      const names = b.run === "v3" ? [["n", "?", ""], ["total", "?", ""], ["i", "?", ""], ["jumlah", "?", ""]] : [["n", "?", ""], ["total", "?", ""], ["i", "?", ""], ["jumlah", "?", ""]];
      memPanel(ctx, MEM.x, MEM.y, MEM.w, names, null, {});
      card(ctx, NOTE.x, NOTE.y, NOTE.w, NOTE.h, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 });
      text(ctx, "Tebak isi memori dan keluarannya!", NOTE.x + NOTE.w / 2, NOTE.y + 72, 30, { align: "center", weight: 900, color: C.accentDark });
      outPanel(ctx, OUT.x, OUT.y, OUT.w, OUT.h, [[["Total kas: ", "out"], ["?", "in"]]]);
      thinking(ctx, MEM.x + MEM.w - 60, MEM.y + 50, l, b.dur);
    },
    k18_jalan(ctx, b, l) {
      const [a, z] = b.steps, m = z - a + 1, t0 = 0.4, per = Math.max(0.7, (at(b, 0.92) - t0) / m);
      const j = Math.floor((l - t0) / per), k = l < t0 ? a - 1 : a + clamp(j, 0, m - 1), u = l < t0 ? 1 : clamp(((l - t0) - clamp(j, 0, m - 1) * per) / 0.45, 0, 1);
      tracer(ctx, b.run, k, ease(u), { badRow: b.run === "v4" && k >= 0 && J.runs.v4.steps[k].ln === 3 && J.runs.v4.steps[k].before.some(v => v[0] === "total") ? "total" : null });
    },
    k18_str(ctx, b, l) {
      const lines = J.programs.benar.slice(); lines[3] = '    jumlah = input("Jumlah: ")';
      codePanel(ctx, CODE.x, CODE.y, CODE.w, lines, { ln: 5, mark: { 4: "bad" } });
      memPanel(ctx, MEM.x, MEM.y, MEM.w, [["n", "1", "int"], ["total", "0", "int"], ["i", "0", "int"], ["jumlah", "'20000'", "str"]], null, { badRow: "jumlah" });
      card(ctx, NOTE.x, NOTE.y, NOTE.w, NOTE.h, { fill: C.goodBg, stroke: C.good, lw: 3, r: 16 });
      text(ctx, "Jawaban: str (teks), bukan int", NOTE.x + NOTE.w / 2, NOTE.y + 72, 32, { align: "center", weight: 900, color: C.good });
      if (l > at(b, 0.35)) {
        card(ctx, OUT.x, OUT.y, OUT.w, OUT.h, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 });
        text(ctx, "⚠ error di baris 5", OUT.x + 24, OUT.y + 44, 26, { weight: 900, color: C.bad });
        mono(ctx, "TypeError: '>' not supported", OUT.x + 24, OUT.y + 100, 26, { color: C.ink, weight: 700 });
        mono(ctx, "between instances of 'str'", OUT.x + 24, OUT.y + 140, 26, { color: C.ink, weight: 700 });
        mono(ctx, "and 'int'", OUT.x + 24, OUT.y + 180, 26, { color: C.ink, weight: 700 });
      }
    },
    k18_fix(ctx, b, l) {
      card(ctx, 110, 124, 1700, 702, { fill: "#FFFFFF", r: 20 });
      const bug = J.programs.bug, ok = J.programs.benar;
      text(ctx, "SALAH: total = 0 di dalam for", 480, 178, 26, { align: "center", weight: 900, color: C.bad });
      text(ctx, "BENAR: total = 0 sebelum for", 1440, 178, 26, { align: "center", weight: 900, color: C.good });
      codePanel(ctx, 140, 200, 690, bug, { mark: { 3: "bad" } }, { rh: 40, size: 21, head: 44, title: "versi Dito" });
      const u = ease((l - at(b, 0.5)) / 0.6);
      codePanel(ctx, 1090, 200, 690, ok, { mark: u > 0 ? { 2: "good" } : {} }, { rh: 40, size: 21, head: 44, title: "versi diperbaiki" });
      H.arrowIcon(ctx, "east", 960, 380, 70, C.accent);
      // jejak nilai total dari kedua jalannya program (masukan variasi 1)
      const seq = run => { const out = []; let last = null; J.runs[run].steps.forEach(s => { const t = s.vars.find(v => v[0] === "total"); if (t && t[1] !== last) { out.push(t[1]); last = t[1]; } }); return out; };
      const row = (vals, x, y, col) => vals.forEach((v, i) => { const w = 120, xx = x + i * (w + 44); card(ctx, xx, y, w, 60, { fill: v === "0" && i > 0 ? C.badBg : "#F4F7F5", stroke: v === "0" && i > 0 ? C.bad : "#CFDCD5", lw: 3, r: 12 }); mono(ctx, v, xx + w / 2, y + 41, 26, { align: "center", color: C.ink, weight: 800 }); if (i) H.arrowIcon(ctx, "east", xx - 22, y + 30, 24, C.ink2); });
      text(ctx, "jejak total:", 160, 690, 24, { weight: 900, color: C.ink2 }); row(seq("v4"), 160, 712, C.bad);
      if (u > 0) { ctx.globalAlpha = u; text(ctx, "jejak total:", 1110, 690, 24, { weight: 900, color: C.ink2 }); row(seq("v1"), 1110, 712, C.good); ctx.globalAlpha = 1; }
    },
    k18_latihan(ctx, b, l) {
      const PX = 210, PY = 128, PW = 600, PH = 694;
      ctx.fillStyle = "#2B3A44"; rr(ctx, PX, PY, PW, PH, 36); ctx.fill(); ctx.fillStyle = "#F4F7F5"; rr(ctx, PX + 14, PY + 14, PW - 28, PH - 28, 26); ctx.fill();
      ctx.save(); rr(ctx, PX + 14, PY + 14, PW - 28, PH - 28, 26); ctx.clip();
      const x = PX + 36, w = PW - 72;
      card(ctx, PX + 14, PY + 14, PW - 28, 46, { fill: "#FFFFFF", r: 0 }); text(ctx, "belajar-informatika.vercel.app/f112", PX + PW / 2, PY + 45, 19, { align: "center", weight: 800, color: C.kikoDark });
      let y = PY + 100; text(ctx, "Penerjemah, pelacak, pemburu bug", x, y, 25, { weight: 900, fit: w });
      const a = b.audio || b.dur, c1 = a * 0.15, lvl = l > c1 + 0.2 ? 1 : 0;
      const B2 = { x: x + 180, y: y + 22, w: 190, h: 46 };
      pill(ctx, x, y + 22, 170, 46, "1 Penerjemah", { on: lvl === 0 }); pill(ctx, B2.x, B2.y, B2.w, B2.h, "2 Pelacak Python", { on: lvl === 1 }); pill(ctx, x + 380, y + 22, w - 380, 46, "3 Pemburu bug", {});
      y += 100;
      let BL = null;
      if (lvl === 0) {
        para(ctx, "Sepuluh baris pseudocode. Pilih baris Python yang tepat untuk tiap baris.", x, y, 19, w, { weight: 700, color: C.ink2, lh: 1.3 }); y += 70;
        card(ctx, x, y, w, 60, { fill: "#E6EEEA", r: 10 }); mono(ctx, "BACA jumlah", x + 16, y + 39, 22, { color: C.ink, weight: 700 }); y += 76;
        ['jumlah = input()', 'jumlah = int(input())', 'print(jumlah)'].forEach((t, i) => { card(ctx, x, y + i * 58, w, 48, { fill: "#fff", stroke: "#CFDCD5", lw: 2, r: 10 }); mono(ctx, t, x + 14, y + i * 58 + 32, 20, { color: C.ink, weight: 700 }); });
      } else {
        const presses = clamp(Math.floor((l - c1 - 1.2) / (a * 0.1)) + 1, 0, 5), si = presses, st = PAGE_STEPS[si], pv = si > 0 ? PAGE_STEPS[si - 1] : null;
        text(ctx, `Program 1 dari 4 · langkah ${si + 1} dari ${PAGE_STEPS.length}`, x, y, 17, { weight: 800, color: C.ink2 }); y += 16;
        card(ctx, x, y, w, 30 + PAGE_PROG.length * 40, { fill: DARK, r: 12 });
        PAGE_PROG.forEach((t, i) => { const yy = y + 16 + i * 40; if (st.ln === i) { ctx.fillStyle = "rgba(242,177,52,0.3)"; rr(ctx, x + 6, yy, w - 12, 36, 6); ctx.fill(); } mono(ctx, String(i + 1), x + 22, yy + 26, 16, { align: "center", color: "#6E808C" }); codeLine(ctx, t, x + 44, yy + 26, 19); });
        y += 30 + PAGE_PROG.length * 40 + 14;
        ["t", "total"].forEach((k, i) => { const chg = pv && pv.v[k] !== st.v[k]; card(ctx, x + i * (w / 2 + 4), y, w / 2 - 4, 70, { fill: chg ? "#FFF3D6" : "#FFFFFF", stroke: chg ? C.accent : "#CFDCD5", lw: chg ? 3 : 2, r: 10 }); text(ctx, k, x + i * (w / 2 + 4) + 16, y + 28, 18, { weight: 900, color: C.kikoDark }); mono(ctx, st.v[k] !== undefined ? String(st.v[k]) : "–", x + i * (w / 2 + 4) + 16, y + 58, 24, { color: C.ink, weight: 800 }); });
        y += 86;
        BL = { x: x + 85, y: y + 23 };
        pill(ctx, x, y, 170, 46, "▶ Langkah", { fill: "#FFE7B0", size: 18 }); pill(ctx, x + 180, y, 180, 46, "↺ Dari awal", { size: 18 });
      }
      ctx.restore();
      const P0 = { x: 760, y: 760 }, P2 = { x: B2.x + B2.w / 2, y: B2.y + B2.h / 2 }, PL = BL || { x: PX + 36 + 85, y: 0 };
      let p = P0, click = 0;
      if (l < c1) { const u = ease(l / c1); p = { x: lerp(P0.x, P2.x, u), y: lerp(P0.y, P2.y, u) }; }
      else if (l < c1 + 1.2) { const u = ease((l - c1 - 0.4) / 0.8); p = { x: lerp(P2.x, PL.x, u), y: lerp(P2.y, PL.y || P2.y, u) }; click = (l - c1) / 0.6; }
      else { p = PL; const ph = ((l - c1 - 1.2) % (a * 0.1)) / 0.6; click = l < c1 + 1.2 + a * 0.5 ? ph : 0; }
      L.cursor(ctx, p.x, p.y, { click });
      card(ctx, 880, 150, 900, 400, { fill: "#FFFFFF", r: 22 });
      text(ctx, "COBA SENDIRI DI HALAMAN LATIHAN F11.2", 920, 205, 26, { weight: 900, color: C.accentDark });
      ["Tekan 2 Pelacak Python.", "Tebak isi memori, lalu tekan Langkah.", "Jawab pertanyaan di akhir program.", "Ketik program kas kelas di Colab."].forEach((t, i) => {
        const yy = 260 + i * 70, now = (i === 0 && l < c1 + 0.6) || (i === 1 && l >= c1 + 0.6 && l < a * 0.45) || (i === 2 && l >= a * 0.45 && l < a * 0.6) || (i === 3 && l >= a * 0.6);
        if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, 905, yy - 10, 850, 58, 12); ctx.fill(); }
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(940, yy + 19, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), 940, yy + 28, 24, { align: "center", weight: 900, color: "#fff" });
        text(ctx, t, 978, yy + 29, 27, { weight: 800, fit: 770 });
      });
      card(ctx, 880, 580, 900, 230, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Tugas nyata", 920, 632, 28, { weight: 900 });
      para(ctx, "Jalankan program kas kelas di Colab dengan masukanmu sendiri. Sebelum menekan Enter, tulis tebakan isi memori di tabel pelacakan.", 920, 680, 26, 820, { weight: 700, lh: 1.3 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
