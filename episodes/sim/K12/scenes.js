/* K12 Simulasi konsep: komputer mini, siklus ambil–terjemahkan–jalankan (episode induk E.1). Gaya diagram Fase E.
   Muat setelah kiko-core.js, kiko-devices.js, D7.2/komputer.js, E.1/vn.js, E.1/scenes.js. Semua adegan berawalan k12_.
   Set instruksi sama dengan E.1 (MUAT, TAMBAH, KURANG, SIMPAN, KELUAR, BERHENTI) ditambah LOMPAT dan LOMPAT-NOL untuk variasi perulangan.
   Seperti E.1: PC bertambah satu setelah instruksi dijalankan; BERHENTI tidak menambah PC; LOMPAT mengisi PC dengan alamat tujuan.
   Tata letak: memori kiri (x 140–520), bus (x 560 dan y 625), CPU tengah (x 600–1290), jejak siklus kanan atas, layar kanan bawah.
   Semua gambar di atas y 830. Nilai register dihitung oleh simulator di bawah (sama dengan hasil uji python3). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp, arrowIcon, wrap } = H;
  const PURPLE = "#8E6BBF", HL = "#FFF3D6", HLS = C.accent, GREEN = C.good;

  // ---------- program dan simulator ----------
  const P_SUM = ["MUAT 10", "TAMBAH 11", "SIMPAN 12", "KELUAR 12", "BERHENTI"];
  const P_LOOP = ["MUAT 10", "SIMPAN 12", "KELUAR 12", "KURANG 11", "LOMPAT-NOL 6", "LOMPAT 1", "BERHENTI"];
  const P_DBL = ["MUAT 10", "TAMBAH 10", "SIMPAN 10", "KELUAR 10", "BERHENTI"];
  const PROGS = {
    P1: { prog: P_SUM, data: { 10: 7, 11: 5 } },
    P2: { prog: P_SUM, data: { 10: 25, 11: 17 } },
    P3: { prog: P_LOOP, data: { 10: 3, 11: 1 } },
    P4: { prog: P_DBL, data: { 10: 7 } },
    P4b: { prog: P_DBL, data: { 10: 14 } }
  };
  const MEAN = { MUAT: "salin isi alamat → AKU", TAMBAH: "AKU + isi alamat → AKU", KURANG: "AKU − isi alamat → AKU", SIMPAN: "AKU → alamat", KELUAR: "isi alamat → layar", LOMPAT: "PC ← alamat tujuan", "LOMPAT-NOL": "kalau AKU = 0: PC ← alamat", BERHENTI: "program selesai" };
  function init(P) { const mem = new Array(16).fill(""); P.prog.forEach((p, i) => mem[i] = p); Object.keys(P.data).forEach(a => mem[+a] = P.data[a]); return { pc: 0, ir: "", aku: "", mem, out: [], halted: false, trace: [] }; }
  const parse = ins => { const s = String(ins).split(" "); return { op: s[0], a: s.length > 1 ? +s[1] : null }; };
  function step(s) { // satu siklus penuh; mengembalikan rincian untuk animasi
    const ins = s.mem[s.pc], { op, a } = parse(ins), pc0 = s.pc, aku0 = s.aku; let npc = s.pc + 1, val = null;
    if (op === "MUAT") { val = s.mem[a]; s.aku = val; }
    else if (op === "TAMBAH") { val = s.mem[a]; s.aku = s.aku + val; }
    else if (op === "KURANG") { val = s.mem[a]; s.aku = s.aku - val; }
    else if (op === "SIMPAN") { val = s.aku; s.mem[a] = s.aku; }
    else if (op === "KELUAR") { val = s.mem[a]; s.out.push(val); }
    else if (op === "LOMPAT") npc = a;
    else if (op === "LOMPAT-NOL") npc = s.aku === 0 ? a : s.pc + 1;
    else if (op === "BERHENTI") { s.halted = true; npc = s.pc; }
    s.ir = ins; s.pc = npc;
    s.trace.push({ c: s.trace.length + 1, ins, pc: npc, aku: s.aku });
    return { ins, op, a, pc0, npc, aku0, val };
  }
  function after(P, n) { const s = init(P); for (let i = 0; i < n && !s.halted; i++) step(s); return s; }
  const clone = s => ({ ...s, mem: s.mem.slice(), out: s.out.slice(), trace: s.trace.slice() });

  // ---------- geometri ----------
  const MEM = { x: 140, y: 150, w: 380, h: 650, row0: 214, rh: 36 };
  const rowY = a => MEM.row0 + a * MEM.rh + 16;
  const REG = { PC: [625, 200], IR: [845, 220], AKU: [1085, 180] };   // x, lebar; y 410–570
  const regC = k => REG[k][0] + REG[k][1] / 2;
  const BUSX = 560, BUSY = 625;
  const pathMemToReg = (a, k) => [[MEM.x + MEM.w - 8, rowY(a)], [BUSX, rowY(a)], [BUSX, BUSY], [regC(k), BUSY], [regC(k), 575]];
  const pathRegToMem = (k, a) => pathMemToReg(a, k).slice().reverse();
  const pathMemToOut = a => [[MEM.x + MEM.w - 8, rowY(a)], [BUSX, rowY(a)], [BUSX, BUSY], [1340, BUSY], [1555, 700]];
  function along(path, u) { const seg = []; let tot = 0; for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(d); tot += d; } let t = clamp(u, 0, 1) * tot; for (let i = 1; i < path.length; i++) { if (t <= seg[i - 1] || i === path.length - 1) { const f = seg[i - 1] ? Math.min(1, t / seg[i - 1]) : 1; return [lerp(path[i - 1][0], path[i][0], f), lerp(path[i - 1][1], path[i][1], f)]; } t -= seg[i - 1]; } return path[path.length - 1]; }
  function token(ctx, path, u, label) {
    const [x, y] = along(path, u); ctx.font = "900 24px Inter"; const w = Math.max(48, ctx.measureText(String(label)).width + 28);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 10; ctx.fillStyle = C.accent; rr(ctx, x - w / 2, y - 22, w, 44, 22); ctx.fill(); ctx.restore();
    text(ctx, String(label), x, y + 9, 24, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- gambar mesin ----------
  // st: keadaan mesin; o: {hl:{pc,ir,aku,ctrl,alu,mem,out}, phase, ins, alu, show, data, title}
  function machine(ctx, st, P, o = {}) {
    const hl = o.hl || {}, show = o.show || { mem: 1, ctrl: 1, alu: 1, reg: 1, out: 1, trace: 1 };
    const vis = (k, f) => { ctx.save(); if (!show[k]) ctx.globalAlpha = 0.12; f(); ctx.restore(); };
    // bus
    vis("mem", () => { ctx.strokeStyle = "#9AAFA6"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(BUSX, 214); ctx.lineTo(BUSX, BUSY); ctx.lineTo(1330, BUSY); ctx.stroke(); text(ctx, "bus", BUSX - 12, 664, 20, { weight: 900, color: C.ink2 }); });
    // memori
    vis("mem", () => {
      card(ctx, MEM.x, MEM.y, MEM.w, MEM.h, { fill: "#F7FAF8", stroke: PURPLE, lw: 4, r: 18 });
      text(ctx, "MEMORI", MEM.x + MEM.w / 2, 192, 24, { align: "center", weight: 900, color: PURPLE });
      const nprog = P.prog.length, dataA = P.prog.map(s => parse(s).a).filter(a => a >= 10);
      for (let a = 0; a < 16; a++) {
        const y = MEM.row0 + a * MEM.rh, on = hl.mem === a;
        ctx.fillStyle = on ? HL : "#fff"; rr(ctx, MEM.x + 14, y, MEM.w - 28, MEM.rh - 4, 6); ctx.fill();
        if (on) { ctx.strokeStyle = HLS; ctx.lineWidth = 3; rr(ctx, MEM.x + 14, y, MEM.w - 28, MEM.rh - 4, 6); ctx.stroke(); }
        ctx.fillStyle = a < nprog ? "#EDE6F7" : dataA.indexOf(a) >= 0 ? "#DDF3E4" : "#EEF2F4"; rr(ctx, MEM.x + 14, y, 52, MEM.rh - 4, 6); ctx.fill();
        text(ctx, String(a), MEM.x + 40, y + 24, 19, { align: "center", weight: 900, color: C.ink2 });
        const v = st.mem[a]; if (v !== "") text(ctx, String(v), MEM.x + 82, y + 25, 23, { weight: on ? 900 : 800, color: a < nprog ? "#5B3E8C" : C.ink, fit: 220 });
        if (a === st.pc && !o.noPc) { ctx.fillStyle = C.kiko; rr(ctx, MEM.x + MEM.w - 82, y + 4, 60, MEM.rh - 12, 8); ctx.fill(); text(ctx, "◀ PC", MEM.x + MEM.w - 52, y + 23, 16, { align: "center", weight: 900, color: "#fff" }); }
      }
    });
    // CPU
    vis("ctrl", () => { card(ctx, 600, 150, 690, 450, { fill: "#F7FAF8", stroke: C.kiko, lw: 4, r: 18 }); text(ctx, "UNIT PEMROSES (CPU)", 945, 186, 22, { align: "center", weight: 900, color: C.kiko }); });
    vis("ctrl", () => {
      card(ctx, 625, 205, 320, 175, { fill: hl.ctrl ? HL : "#fff", stroke: hl.ctrl ? HLS : "#B7C4CC", lw: hl.ctrl ? 6 : 3, r: 12 });
      text(ctx, "Unit kendali", 785, 240, 24, { align: "center", weight: 900 });
      const ph = o.phase || (st.halted ? "BERHENTI" : "siap");
      text(ctx, ph, 785, 292, 30, { align: "center", weight: 900, color: o.phase ? C.accentDark : C.ink2 });
      if (o.mean) { const { op } = parse(o.mean); text(ctx, op + ":", 785, 330, 20, { align: "center", weight: 900, color: C.ink }); text(ctx, MEAN[op] || "", 785, 358, 19, { align: "center", weight: 700, color: C.ink2, fit: 300 }); }
    });
    vis("alu", () => {
      ctx.save(); ctx.beginPath(); ctx.moveTo(975, 205); ctx.lineTo(1265, 205); ctx.lineTo(1210, 380); ctx.lineTo(1030, 380); ctx.closePath(); ctx.fillStyle = hl.alu ? HL : "#fff"; ctx.fill(); ctx.strokeStyle = hl.alu ? HLS : "#B7C4CC"; ctx.lineWidth = hl.alu ? 6 : 3; ctx.stroke(); ctx.restore();
      text(ctx, "ALU", 1120, 248, 26, { align: "center", weight: 900 });
      if (o.alu) { text(ctx, o.alu[0], 1120, 304, 34, { align: "center", weight: 900, color: C.accentDark, fit: 220 }); if (o.alu[1]) text(ctx, o.alu[1], 1120, 352, 34, { align: "center", weight: 900, color: C.accentDark }); }
      else text(ctx, "+ −", 1120, 320, 28, { align: "center", weight: 900, color: C.ink2 });
    });
    vis("reg", () => {
      [["PC", st.pc, hl.pc], ["IR", o.ir != null ? o.ir : (st.ir || "–"), hl.ir], ["AKU", st.aku === "" ? "–" : st.aku, hl.aku]].forEach(([n, v, on]) => {
        const [x, w] = REG[n]; card(ctx, x, 410, w, 160, { fill: on ? HL : "#fff", stroke: on ? HLS : "#B7C4CC", lw: on ? 6 : 3, r: 12 });
        text(ctx, n, x + w / 2, 448, 22, { align: "center", weight: 900, color: C.ink2 });
        text(ctx, String(v), x + w / 2, n === "IR" ? 522 : 532, n === "IR" ? 28 : 60, { align: "center", weight: 900, fit: w - 20 });
      });
    });
    // jejak siklus
    vis("trace", () => {
      card(ctx, 1320, 150, 470, 390, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "JEJAK SIKLUS", 1555, 184, 22, { align: "center", weight: 900, color: C.accentDark });
      const cols = [1350, 1430, 1660, 1740]; ["siklus", "instruksi", "PC", "AKU"].forEach((h, i) => text(ctx, h, cols[i], 216, 18, { align: i >= 2 ? "center" : "left", weight: 900, color: C.ink2 }));
      const rows = st.trace.slice(-8);
      rows.forEach((r, i) => {
        const y = 230 + i * 37, last = i === rows.length - 1 && o.freshRow;
        ctx.fillStyle = last ? HL : i % 2 ? "#F7FAF8" : "#EEF4F1"; rr(ctx, 1336, y, 438, 33, 6); ctx.fill();
        text(ctx, String(r.c), cols[0] + 14, y + 24, 20, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, r.ins, cols[1], y + 24, 20, { weight: 800, color: "#5B3E8C" });
        text(ctx, String(r.pc), cols[2], y + 24, 21, { align: "center", weight: 900, color: C.kiko });
        text(ctx, r.aku === "" ? "–" : String(r.aku), cols[3], y + 24, 21, { align: "center", weight: 900 });
      });
      if (!rows.length) text(ctx, o.traceEmpty || "belum ada siklus", 1555, 330, 22, { align: "center", weight: 700, color: C.muted });
    });
    // layar
    vis("out", () => {
      card(ctx, 1320, 560, 470, 240, { fill: "#F7FAF8", stroke: GREEN, lw: 4, r: 18 });
      text(ctx, "LAYAR (output)", 1555, 592, 20, { align: "center", weight: 900, color: GREEN });
      card(ctx, 1345, 606, 420, 176, { fill: hl.out ? "#DDF3E4" : "#1F2A33", stroke: hl.out ? GREEN : "#4A5A66", lw: hl.out ? 6 : 3, r: 12 });
      const s = st.out.length ? st.out.join("   ") : (o.guess ? "?" : "");
      text(ctx, s, 1555, 718, st.out.length > 2 ? 64 : 76, { align: "center", weight: 900, color: hl.out ? GREEN : "#fff" });
    });
  }

  // keadaan mesin pada pecahan f dari beat: c0..c1 siklus dibagi rata di [t0, t1]; ph = batas fase [ambil, terjemahkan, jalankan]
  function frame(ctx, b, f) {
    const P = PROGS[b.prog], c0 = b.c0 || 0, c1 = b.c1 == null ? c0 : b.c1, t0 = b.t0 == null ? 0.03 : b.t0, t1 = b.t1 == null ? 0.92 : b.t1, ph = b.ph || [0.3, 0.52, 0.88];
    const n = c1 - c0;
    if (n <= 0 || f < t0 || f >= t1) {
      const st = after(P, f < t0 ? c0 : c1);
      return { st, o: { hl: f >= t1 && n > 0 ? { pc: true } : {}, phase: "", ir: null, freshRow: f >= t1 && n > 0 && f < t1 + 0.06 }, info: f < t0 ? null : null, P };
    }
    const per = (t1 - t0) / n, k = Math.floor((f - t0) / per), g = (f - t0) / per - k;
    const base = after(P, c0 + k);
    if (base.halted) return { st: base, o: {}, P };
    const nxt = clone(base), d = step(nxt), cyc = c0 + k + 1;
    const o = { hl: {}, mean: null, tokens: [], cyc };
    let st = base, info = null;
    if (g < ph[0]) { // AMBIL
      const u = g / ph[0]; o.phase = "AMBIL"; o.hl = { pc: true, mem: base.pc, ir: u > 0.85 };
      o.ir = u > 0.85 ? d.ins : (base.ir || "–"); if (u <= 0.85) o.tokens.push([pathMemToReg(base.pc, "IR"), u / 0.85, d.ins]);
      info = ["SIKLUS " + cyc + " · AMBIL", "PC = " + base.pc + ": isi alamat " + base.pc + " (" + d.ins + ") → IR"];
    } else if (g < ph[1]) { // TERJEMAHKAN
      o.phase = "TERJEMAHKAN"; o.hl = { ctrl: true, ir: true }; o.ir = d.ins; o.mean = d.ins;
      info = ["SIKLUS " + cyc + " · TERJEMAHKAN", d.op + " berarti: " + MEAN[d.op]];
    } else if (g < ph[2]) { // JALANKAN
      const u = (g - ph[1]) / (ph[2] - ph[1]); o.phase = "JALANKAN"; o.ir = d.ins; o.mean = d.ins; o.hl = { ir: true };
      const done = u > 0.86; if (done) st = { ...nxt, pc: base.pc, trace: base.trace, halted: false }; // efek terlihat saat token tiba; PC baru berganti setelah jalankan
      const tu = Math.min(1, u / 0.86);
      if (d.op === "MUAT") { o.hl.mem = d.a; o.hl.aku = done; if (!done) o.tokens.push([pathMemToReg(d.a, "AKU"), tu, d.val]); info = ["SIKLUS " + cyc + " · JALANKAN", "isi alamat " + d.a + " (" + d.val + ") → AKU"]; }
      else if (d.op === "TAMBAH" || d.op === "KURANG") { const sg = d.op === "TAMBAH" ? " + " : " − "; o.hl.mem = d.a; o.hl.alu = true; o.hl.aku = done; o.alu = [d.aku0 + sg + d.val, tu > 0.55 ? "= " + nxt.aku : null]; if (!done) o.tokens.push([pathMemToReg(d.a, "AKU"), tu, d.val]); info = ["SIKLUS " + cyc + " · JALANKAN", "ALU: " + d.aku0 + sg + d.val + " = " + nxt.aku + " → AKU"]; }
      else if (d.op === "SIMPAN") { o.hl.aku = true; o.hl.mem = d.a; if (!done) o.tokens.push([pathRegToMem("AKU", d.a), tu, d.val]); info = ["SIKLUS " + cyc + " · JALANKAN", "AKU (" + d.val + ") → alamat " + d.a]; }
      else if (d.op === "KELUAR") { o.hl.mem = d.a; o.hl.out = done; if (!done) o.tokens.push([pathMemToOut(d.a), tu, d.val]); info = ["SIKLUS " + cyc + " · JALANKAN", "isi alamat " + d.a + " (" + d.val + ") → layar"]; }
      else if (d.op === "LOMPAT") { o.hl.pc = true; info = ["SIKLUS " + cyc + " · JALANKAN", "PC diisi " + d.a + ", bukan ditambah satu"]; if (!done) o.pcTok = [tu, d.a]; }
      else if (d.op === "LOMPAT-NOL") { o.hl.aku = true; o.hl.pc = done; info = ["SIKLUS " + cyc + " · JALANKAN", d.aku0 === 0 ? "AKU = 0, jadi lompat: PC ← " + d.a : "AKU = " + d.aku0 + ", bukan nol: tidak lompat"]; if (!done && d.aku0 === 0) o.pcTok = [tu, d.a]; }
      else if (d.op === "BERHENTI") { o.hl.ctrl = true; info = ["SIKLUS " + cyc + " · JALANKAN", "BERHENTI: program selesai, PC tetap " + d.pc0]; }
      if (!done) { o.noPcMove = true; }
    } else { // PC berganti
      st = nxt; o.ir = d.ins; o.hl = { pc: true }; o.freshRow = true; o.phase = d.op === "BERHENTI" ? "BERHENTI" : "PC → " + d.npc;
      info = ["SIKLUS " + cyc + " SELESAI", d.op === "BERHENTI" ? "PC tetap " + d.npc + ", program berhenti" : d.op.startsWith("LOMPAT") && d.npc !== d.pc0 + 1 ? "PC ← " + d.npc + " (lompat)" : "PC + 1 → " + d.npc];
      if (d.op === "TAMBAH" || d.op === "KURANG") { /* tampilan ALU sudah selesai */ }
    }
    return { st, o, info, P };
  }
  function infoPanel(ctx, info, opt = {}) {
    card(ctx, 600, 645, 690, 155, { fill: opt.fill || "#FFF9E8", stroke: opt.stroke || "#E8D29A", lw: 3, r: 16 });
    if (!info) return;
    text(ctx, info[0], 630, 690, 24, { weight: 900, color: C.accentDark });
    text(ctx, info[1], 630, 748, 30, { weight: 900, fit: 630 });
    if (info[2]) text(ctx, info[2], 630, 784, 22, { weight: 700, color: C.ink2, fit: 630 });
  }
  function badge(ctx, b) {
    if (!b.vno) return; const s = "VARIASI " + b.vno + " · " + b.vname; ctx.font = "900 22px Inter"; const w = ctx.measureText(s).width + 36;
    ctx.fillStyle = C.kiko; rr(ctx, 600, 112, w, 34, 17); ctx.fill(); text(ctx, s, 618, 137, 22, { weight: 900, color: "#fff" });
  }
  function drawRun(ctx, b, f) {
    const r = frame(ctx, b, f);
    machine(ctx, r.st, r.P, r.o);
    (r.o.tokens || []).forEach(([p, u, lab]) => token(ctx, p, u, lab));
    if (r.o.pcTok) { const [u, a] = r.o.pcTok; token(ctx, [[regC("IR"), 470], [regC("PC"), 470]], u, a); }
    return r;
  }
  const spanOf = b => Math.max(3, b.audio || b.dur);
  function think(ctx, l, b, x, y) { const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 30, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke(); }
  function miniTrace(ctx, x, y, title, P, col) {
    const s = after(P, 20); card(ctx, x, y, 700, 70 + s.trace.length * 46 + 20, { fill: "#fff", stroke: col, lw: 4, r: 18 });
    text(ctx, title, x + 350, y + 44, 26, { align: "center", weight: 900, color: col });
    const cols = [x + 40, x + 130, x + 420, x + 530, x + 630];
    ["siklus", "instruksi", "PC", "AKU", "layar"].forEach((h, i) => text(ctx, h, cols[i], y + 82, 18, { align: i >= 2 ? "center" : "left", weight: 900, color: C.ink2 }));
    let out = [];
    s.trace.forEach((r, i) => { const yy = y + 96 + i * 46; ctx.fillStyle = i % 2 ? "#F7FAF8" : "#EEF4F1"; rr(ctx, x + 20, yy, 660, 40, 8); ctx.fill(); const ins = r.ins; if (ins.startsWith("KELUAR")) out = [after(P, i + 1).out.slice(-1)[0]];
      text(ctx, String(r.c), cols[0] + 16, yy + 28, 22, { align: "center", weight: 800, color: C.ink2 }); text(ctx, ins, cols[1], yy + 28, 22, { weight: 800, color: "#5B3E8C" }); text(ctx, String(r.pc), cols[2], yy + 28, 24, { align: "center", weight: 900, color: C.kiko }); text(ctx, String(r.aku), cols[3], yy + 28, 24, { align: "center", weight: 900, color: col === GREEN ? C.ink : C.ink }); text(ctx, out.length && ins.startsWith("KELUAR") ? String(out[0]) : "", cols[4], yy + 28, 24, { align: "center", weight: 900, color: GREEN }); });
    return s;
  }

  Object.assign(K.SCENES, {
    k12_tujuan(ctx, b, l) {
      card(ctx, 140, 150, 1660, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 220, 240, 30, { weight: 900, color: C.accentDark });
      ["menelusuri ambil, terjemahkan, jalankan", "menebak isi PC dan AKU tiap siklus", "membaca program yang melompat", "melihat SIMPAN menimpa memori"].forEach((s, i) => {
        const u = ease((l - 0.8 - i * 0.9) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 220, 280 + i * 104, 780, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 260, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 310, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      K.vn.cycle(ctx, 1430, 470, 200, Math.floor(l / 1.5) % 3, { center: "PC + 1" });
    },
    k12_prasyarat(ctx, b, l) {
      card(ctx, 260, 180, 1400, 620);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 270, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 420, 320, 1080, 300, { fill: C.bg2, r: 22 });
      text(ctx, "E.1", 960, 410, 64, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Komputer Von Neumann", 960, 480, 42, { align: "center", weight: 800 });
      text(ctx, "memori · register PC, IR, AKU · ALU · unit kendali", 960, 560, 28, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1580, 730, 120, 0, { wave: l });
    },
    k12_mesin(ctx, b, l) {
      const f = l / spanOf(b), P = PROGS.P1, st = after(P, 0);
      const k = f < 0.08 ? 0 : f < 0.42 ? 1 : f < 0.55 ? 2 : f < 0.65 ? 3 : 4;
      const show = { mem: k >= 1, ctrl: k >= 2, alu: k >= 3, reg: k >= 4, out: f > 0.9, trace: f > 0.9 };
      machine(ctx, st, P, { show, hl: { ctrl: k === 2, alu: k === 3, pc: k === 4 && f < 0.78, ir: k === 4 && f >= 0.78 && f < 0.86, aku: k === 4 && f >= 0.86 }, noPc: k < 4 });
      const msg = [null, ["MEMORI: 16 SEL, ALAMAT 0–15", "alamat 0–4 berisi instruksi, alamat 10–11 berisi data"], ["UNIT KENDALI", "membaca instruksi dan mengatur bagian lain"], ["ALU", "unit aritmatika dan logika: menghitung"], ["REGISTER: KOTAK KECIL YANG SANGAT CEPAT", "PC · IR · AKU"]][k];
      infoPanel(ctx, msg);
    },
    k12_siklus(ctx, b, l) {
      const f = l / spanOf(b);
      card(ctx, 120, 150, 1680, 670);
      const act = f < 0.2 ? -1 : f < 0.47 ? 0 : f < 0.66 ? 1 : 2;
      K.vn.cycle(ctx, 560, 500, 210, act, { center: f > 0.85 ? "PC + 1 ↺" : "" });
      card(ctx, 140, 190, 270, 110, { fill: f < 0.2 ? HL : C.bg2, stroke: f < 0.2 ? HLS : undefined, lw: 4, r: 14 }); text(ctx, "PC", 180, 240, 30, { weight: 900, color: C.kiko }); para(ctx, "alamat instruksi berikutnya", 240, 230, 19, 160, { weight: 700, color: C.ink2, lh: 1.25 });
      // daftar instruksi E.1
      card(ctx, 1010, 190, 760, 600, { fill: "#fff", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "INSTRUKSI KOMPUTER MINI", 1390, 235, 24, { align: "center", weight: 900, color: C.accentDark });
      const L = [["MUAT a", "salin isi alamat a → AKU"], ["TAMBAH a", "AKU + isi alamat a → AKU"], ["KURANG a", "AKU − isi alamat a → AKU"], ["SIMPAN a", "AKU → alamat a"], ["KELUAR a", "isi alamat a → layar"], ["BERHENTI", "program selesai"]];
      L.forEach(([k, v], i) => { const y = 262 + i * 84; ctx.fillStyle = i % 2 ? "#F7FAF8" : "#EEF4F1"; rr(ctx, 1030, y, 720, 72, 10); ctx.fill(); text(ctx, k, 1055, y + 47, 28, { weight: 900, color: "#5B3E8C" }); text(ctx, v, 1290, y + 46, 25, { weight: 700, color: C.ink }); });
    },
    k12_tanya(ctx, b, l) {
      const P = PROGS[b.prog], st = after(P, 0);
      machine(ctx, st, P, { guess: b.think, traceEmpty: b.think ? "tebak dulu…" : "belum ada siklus" });
      badge(ctx, b);
      card(ctx, 600, 645, 690, 155, { fill: HL, stroke: HLS, lw: 4, r: 16 });
      text(ctx, "MENURUTMU, APA YANG TERJADI KALAU", 625, 680, 19, { weight: 900, color: C.accentDark });
      para(ctx, b.q, 625, 720, 25, b.think ? 570 : 640, { weight: 900, lh: 1.25 });
      if (b.think) think(ctx, l, b, 1245, 690);
    },
    k12_jalan(ctx, b, l) {
      const span = spanOf(b), f = b.final ? 1.5 : l / span;
      const r = drawRun(ctx, b, f); badge(ctx, b);
      if (b.final) infoPanel(ctx, ["HASIL", b.final], { fill: C.goodBg, stroke: GREEN });
      else if (r.info) infoPanel(ctx, r.info);
      else if (f < (b.t0 == null ? 0.03 : b.t0)) infoPanel(ctx, b.prog === "P4b" ? ["MEMORI TIDAK DIKEMBALIKAN", "alamat 10 masih berisi 14 · PC kembali ke 0"] : ["SIAP", "PC = " + r.st.pc]);
      else infoPanel(ctx, r.st.halted ? ["PROGRAM SELESAI", "layar: " + (r.st.out.join(", ") || "–") + " · PC = " + r.st.pc] : ["SETELAH SIKLUS " + r.st.trace.length, "PC = " + r.st.pc + " · AKU = " + r.st.aku]);
    },
    k12_bandingdata(ctx, b, l) {
      const f = l / spanOf(b);
      card(ctx, 120, 140, 1680, 690);
      miniTrace(ctx, 170, 170, "alamat 10 = 7, alamat 11 = 5", PROGS.P1, C.ink2);
      ctx.save(); ctx.globalAlpha = ease((f - 0.1) / 0.15); miniTrace(ctx, 1050, 170, "alamat 10 = 25, alamat 11 = 17", PROGS.P2, C.kiko); ctx.restore();
      const box = (x, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.setLineDash([12, 8]); rr(ctx, x, 256, w, 240, 12); ctx.stroke(); ctx.setLineDash([]); };
      if (f > 0.3) { box(280, 360, C.kiko); box(1160, 360, C.kiko); text(ctx, "▢ instruksi dan PC: sama persis", 960, 560, 28, { align: "center", weight: 900, color: C.kiko }); }
      if (f > 0.55) { box(652, 210, C.accent); box(1532, 210, C.accent); text(ctx, "▢ AKU dan layar: berbeda", 960, 610, 28, { align: "center", weight: 900, color: C.accentDark }); }
      if (f > 0.7) { card(ctx, 360, 670, 1200, 80, { fill: HL, stroke: HLS, lw: 4, r: 18 }); text(ctx, "program sama, data berbeda → hasil berbeda: 12 dan 42", 960, 722, 30, { align: "center", weight: 900 }); }
    },
    k12_lompat(ctx, b, l) {
      const f = l / spanOf(b);
      card(ctx, 120, 150, 1680, 670);
      text(ctx, "DUA INSTRUKSI BARU: MENGUBAH PC", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      const box = (x, y, w, title, lines, on) => { card(ctx, x, y, w, 470, { fill: on ? HL : C.bg2, stroke: on ? HLS : undefined, lw: 4, r: 18 }); text(ctx, title, x + w / 2, y + 60, 40, { align: "center", weight: 900, color: "#5B3E8C" }); lines.forEach((s, i) => text(ctx, s, x + w / 2, y + 120 + i * 44, 26, { align: "center", weight: 800, color: i ? C.ink2 : C.ink })); };
      box(200, 260, 720, "LOMPAT a", ["PC diisi a", "(bukan PC + 1)"], f > 0.1 && f < 0.6);
      // ilustrasi PC 5 → 1
      const u = ease((l - 1.5) / 1.2);
      card(ctx, 330, 480, 160, 120, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); text(ctx, "PC", 410, 515, 20, { align: "center", weight: 900, color: C.ink2 }); text(ctx, f > 0.25 ? "1" : "5", 410, 578, 52, { align: "center", weight: 900 });
      text(ctx, "LOMPAT 1", 700, 530, 28, { align: "center", weight: 900, color: "#5B3E8C" }); arrowIcon(ctx, "west", 560, 560, 40, C.kiko); text(ctx, "5 → 1", 700, 590, 28, { align: "center", weight: 900, color: C.kiko });
      ctx.save(); ctx.globalAlpha = ease((f - 0.5) / 0.1);
      box(1000, 260, 720, "LOMPAT-NOL a", ["kalau AKU = 0: PC diisi a", "kalau AKU bukan 0: PC + 1"], f > 0.55);
      [["AKU = 0", "PC ← a", GREEN], ["AKU = 2", "PC + 1", C.ink2]].forEach(([k, v, col], i) => { card(ctx, 1080 + i * 290, 500, 270, 110, { fill: "#fff", stroke: col, lw: 3, r: 12 }); text(ctx, k, 1215 + i * 290, 545, 26, { align: "center", weight: 900 }); text(ctx, v, 1215 + i * 290, 590, 28, { align: "center", weight: 900, color: col }); });
      ctx.restore();
    },
    k12_putaran(ctx, b, l) {
      const f = l / spanOf(b);
      card(ctx, 120, 150, 1680, 670);
      text(ctx, "7 INSTRUKSI, 16 SIKLUS: PERULANGAN", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 200, 250, 560, 460, { fill: "#fff", stroke: PURPLE, lw: 4, r: 18 });
      P_LOOP.forEach((s, i) => { const y = 290 + i * 56, inLoop = i >= 1 && i <= 5; ctx.fillStyle = inLoop ? "#EDE6F7" : "#F7FAF8"; rr(ctx, 230, y, 420, 46, 8); ctx.fill(); text(ctx, i + "   " + s, 252, y + 32, 26, { weight: 900, color: "#5B3E8C" }); });
      // panah kembali dari alamat 5 ke 1
      ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(655, 313 + 5 * 56); ctx.lineTo(715, 313 + 5 * 56); ctx.lineTo(715, 313 + 56); ctx.lineTo(665, 313 + 56); ctx.stroke(); arrowIcon(ctx, "west", 668, 313 + 56, 26, C.kiko);
      text(ctx, "diulang", 774, 313 + 3 * 56, 22, { weight: 900, color: C.kiko });
      const rounds = [["putaran 1", "layar: 3", "AKU 3 → 2, tidak lompat"], ["putaran 2", "layar: 3 2", "AKU 2 → 1, tidak lompat"], ["putaran 3", "layar: 3 2 1", "AKU 1 → 0, LOMPAT-NOL ke 6"]];
      const n = clamp(Math.floor((f - 0.1) / 0.14) + 1, 0, 3);
      rounds.forEach(([a, bb, c], i) => { ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.15; const y = 260 + i * 130; card(ctx, 900, y, 820, 110, { fill: C.bg2, r: 16 }); text(ctx, a, 930, y + 46, 26, { weight: 900, color: C.kiko }); text(ctx, bb, 1140, y + 46, 28, { weight: 900, color: GREEN }); text(ctx, c, 930, y + 88, 24, { weight: 700, color: C.ink2 }); ctx.restore(); });
      if (f > 0.55) { card(ctx, 900, 660, 820, 70, { fill: HL, stroke: HLS, lw: 3, r: 14 }); text(ctx, "1 + 5 + 5 + 4 + 1 = 16 siklus", 1310, 706, 28, { align: "center", weight: 900 }); }
    },
    k12_banding(ctx, b, l) {
      const f = l / spanOf(b);
      card(ctx, 120, 140, 1680, 690);
      text(ctx, "EMPAT VARIASI, SATU SIKLUS YANG SAMA", 960, 200, 30, { align: "center", weight: 900, color: C.accentDark });
      const rows = [["1", "Menjumlah 7 + 5", "5 siklus · layar 12 · PC akhir 4", "siklus dasar"], ["2", "Data 25 dan 17", "PC sama · layar 42", "data mengubah hasil"], ["3", "Ada LOMPAT", "16 siklus · layar 3 2 1", "LOMPAT mengubah PC"], ["4", "SIMPAN ke alamat 10", "7 tertimpa 14, lalu 28", "SIMPAN mengubah memori"]];
      text(ctx, "VARIASI", 230, 256, 20, { weight: 900, color: C.ink2 }); text(ctx, "HASIL", 760, 256, 20, { weight: 900, color: C.ink2 }); text(ctx, "PELAJARANNYA", 1300, 256, 20, { weight: 900, color: C.ink2 });
      const n = clamp(Math.floor((f - 0.08) / 0.12) + 1, 0, 4);
      rows.forEach(([k, a, bb, c], i) => { ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.15; const y = 280 + i * 118; card(ctx, 180, y, 1560, 100, { fill: i % 2 ? "#F7FAF8" : C.bg2, r: 14 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(230, y + 50, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, k, 230, y + 60, 26, { align: "center", weight: 900, color: "#fff" }); text(ctx, a, 280, y + 61, 30, { weight: 900, fit: 460 }); text(ctx, bb, 760, y + 60, 27, { weight: 700, color: C.ink2, fit: 520 }); text(ctx, "✓ " + c, 1300, y + 60, 28, { weight: 800, color: GREEN, fit: 420 }); ctx.restore(); });
    },
    k12_latihan(ctx, b, l) {
      const f = l / spanOf(b);
      card(ctx, 160, 150, 1600, 670);
      text(ctx, "COBA SENDIRI DI HALAMAN LATIHAN", 960, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 230, 250, 900, 540, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 16 });
      ctx.fillStyle = "#EEF2F4"; rr(ctx, 232, 252, 896, 56, 14); ctx.fill(); ctx.fillRect(232, 290, 896, 18);
      [0, 1, 2].forEach(i => { ctx.fillStyle = ["#E5867E", "#EBC56A", "#7FC79A"][i]; ctx.beginPath(); ctx.arc(262 + i * 26, 280, 8, 0, Math.PI * 2); ctx.fill(); });
      card(ctx, 360, 262, 560, 36, { fill: "#fff", r: 18 }); text(ctx, "belajar-informatika.vercel.app/e1", 640, 288, 20, { align: "center", weight: 800, color: C.kikoDark });
      const btns = ["1 Jalankan dan amati", "2 Ubah datanya", "3 Susun program"]; let bx = 270, tx = 0; const pressed = f > 0.3;
      btns.forEach((s, i) => { ctx.font = "800 20px Inter"; const w = ctx.measureText(s).width + 32, on = i === 0; card(ctx, bx, 340, w, 48, { fill: on && pressed ? C.kiko : on ? HL : "#F2F5F7", stroke: on ? (pressed ? C.kikoDark : HLS) : "#D7E2DC", lw: on ? 4 : 2, r: 12 }); text(ctx, s, bx + 16, 371, 20, { weight: 800, color: on && pressed ? "#fff" : C.ink }); if (on) tx = bx + w / 2; bx += w + 14; });
      // simulator mini: register berubah tiap Langkah (fase demi fase, seperti halaman E.1)
      const steps = clamp(Math.floor((f - 0.45) / 0.08), 0, 6), cyc = Math.floor(steps / 3), phs = steps % 3;
      const st = after(PROGS.P1, cyc), nx = clone(st); step(nx);
      const ir = phs >= 1 ? nx.ir : st.ir || "–";
      [["PC", st.pc], ["IR", ir], ["AKU", st.aku === "" ? "–" : st.aku]].forEach(([n, v], i) => { card(ctx, 270 + i * 200, 420, 180, 110, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); text(ctx, n, 360 + i * 200, 452, 18, { align: "center", weight: 900, color: C.ink2 }); text(ctx, String(v), 360 + i * 200, 502, n === "IR" ? 22 : 40, { align: "center", weight: 900, fit: 160 }); });
      text(ctx, ["siap: tekan Langkah", "1 AMBIL: isi alamat PC → IR", "2 TERJEMAHKAN"][phs], 870, 470, 20, { weight: 800, color: C.accentDark, fit: 240 });
      card(ctx, 870, 490, 180, 50, { fill: C.accent, r: 12 }); text(ctx, "▶ Langkah", 960, 523, 22, { align: "center", weight: 900, color: "#fff" });
      text(ctx, "Tebak dulu PC dan AKU, baru tekan Langkah.", 270, 600, 24, { weight: 800, color: C.ink2 });
      const D = K.devices;
      if (!pressed) D.pointer(ctx, lerp(700, tx, ease(f / 0.28)), lerp(640, 370, ease(f / 0.28)), 40);
      else if (f > 0.4) { const click = ((f - 0.45) / 0.08) % 1; D.pointer(ctx, 960, 515 + (click < 0.15 ? 4 : 0), 40); }
      card(ctx, 1190, 250, 500, 540, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Tugasmu", 1440, 320, 34, { align: "center", weight: 900 });
      para(ctx, "Tekan Jalankan dan amati. Sebelum tiap Langkah, tebak isi PC dan AKU.", 1440, 390, 28, 420, { align: "center", weight: 700, lh: 1.3 });
      para(ctx, "Lalu coba Ubah datanya: buat layar menampilkan 20.", 1440, 580, 26, 420, { align: "center", weight: 700, lh: 1.3, color: C.ink2 });
      kiko(ctx, 1640, 740, 90, 0, { wave: l });
    }
  });
  K.k12 = { PROGS, init, step, after };   // untuk uji nilai register
})(typeof window !== "undefined" ? window : globalThis);
