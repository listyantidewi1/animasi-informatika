/* Pembantu gambar E.1: komputer mini Von Neumann (unit kendali, ALU, register PC/IR/AKU, memori 16 sel, masukan, keluaran, bus),
   simulasi program lima instruksi, diagram siklus, gelombang detak. Gaya diagram Fase E. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp, lerp, ease } = H;
  const V = {};
  V.PROG = ["MUAT 10", "TAMBAH 11", "SIMPAN 12", "KELUAR 12", "BERHENTI"];
  V.initMem = function (a = 7, b = 5) { const m = new Array(16).fill(""); V.PROG.forEach((p, i) => m[i] = p); m[10] = a; m[11] = b; return m; };
  // jalankan n siklus penuh (dan fase parsial) dari awal; mengembalikan keadaan
  V.run = function (mem0, cycles, phase = 0) {
    const st = { pc: 0, ir: "", aku: "", mem: mem0.slice(), out: "", halted: false, hl: {}, phase: 0, cycle: cycles };
    const exec = (s, full, ph) => {
      const ins = s.mem[s.pc]; if (typeof ins !== "string") return;
      const [op, argS] = ins.split(" "); const a = +argS;
      s.hl = {}; s.phase = ph;
      if (ph >= 1) { s.ir = ins; s.hl.pc = true; s.hl.mem = s.pc; s.hl.ir = true; }
      if (ph >= 2) { s.hl.ctrl = true; }
      if (ph >= 3 || full) {
        s.hl = { ir: true };
        if (op === "MUAT") { s.aku = s.mem[a]; s.hl.mem = a; s.hl.aku = true; }
        else if (op === "TAMBAH") { s.aku = s.aku + s.mem[a]; s.hl.mem = a; s.hl.alu = true; s.hl.aku = true; }
        else if (op === "KURANG") { s.aku = s.aku - s.mem[a]; s.hl.mem = a; s.hl.alu = true; s.hl.aku = true; }
        else if (op === "SIMPAN") { s.mem[a] = s.aku; s.hl.mem = a; s.hl.aku = true; }
        else if (op === "KELUAR") { s.out = s.mem[a]; s.hl.mem = a; s.hl.out = true; }
        else if (op === "BERHENTI") { s.halted = true; s.hl.ctrl = true; }
      }
      if (full) { if (!s.halted) s.pc += 1; s.hl.pc = true; s.phase = 0; }
    };
    for (let i = 0; i < cycles; i++) { if (st.halted) break; exec(st, true, 3); }
    if (phase > 0 && !st.halted) exec(st, false, phase);
    return st;
  };
  // gambar mesin lengkap. st = keadaan dari V.run. opt.labels = tampilkan nama bagian; opt.show = {ctrl,alu,mem,io,bus} bagian yang tampak
  V.machine = function (ctx, st, opt = {}) {
    const show = opt.show || { ctrl: 1, alu: 1, reg: 1, mem: 1, io: 1, bus: 1 };
    const dimIf = (k, f) => { if (show[k] === 0) return; ctx.save(); if (!show[k]) ctx.globalAlpha = 0.12; f(); ctx.restore(); };
    const HL = "#FFF3D6", HLS = C.accent;
    // bus
    dimIf("bus", () => { ctx.strokeStyle = "#9AAFA6"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(560, 700); ctx.lineTo(1560, 700); ctx.stroke(); ctx.beginPath(); ctx.moveTo(560, 640); ctx.lineTo(560, 700); ctx.moveTo(1140, 640); ctx.lineTo(1140, 700); ctx.moveTo(1560, 640); ctx.lineTo(1560, 700); ctx.stroke(); if (opt.labels) text(ctx, "BUS (jalur bersama)", 1060, 745, 22, { align: "center", weight: 900, color: C.ink2 }); });
    // CPU
    dimIf("ctrl", () => { card(ctx, 200, 240, 720, 400, { fill: "#F7FAF8", stroke: C.kiko, lw: 4, r: 18 }); text(ctx, "UNIT PEMROSES (CPU)", 560, 275, 22, { align: "center", weight: 900, color: C.kiko }); });
    dimIf("ctrl", () => { card(ctx, 230, 300, 300, 150, { fill: st.hl.ctrl ? HL : "#fff", stroke: st.hl.ctrl ? HLS : "#B7C4CC", lw: st.hl.ctrl ? 6 : 3, r: 12 }); text(ctx, "Unit kendali", 380, 340, 24, { align: "center", weight: 900 }); text(ctx, ["", "AMBIL", "TERJEMAHKAN", "JALANKAN"][st.phase] || (st.halted ? "BERHENTI" : "siap"), 380, 390, 24, { align: "center", weight: 900, color: st.phase ? C.accentDark : C.ink2 }); if (st.phase === 2) text(ctx, st.ir.split(" ")[0] + " = " + ({ MUAT: "salin memori → AKU", TAMBAH: "AKU + memori → AKU", KURANG: "AKU − memori → AKU", SIMPAN: "AKU → memori", KELUAR: "memori → layar", BERHENTI: "selesai" }[st.ir.split(" ")[0]] || ""), 380, 428, 17, { align: "center", weight: 700, color: C.ink2 }); });
    dimIf("alu", () => { ctx.save(); ctx.beginPath(); ctx.moveTo(590, 300); ctx.lineTo(890, 300); ctx.lineTo(830, 450); ctx.lineTo(650, 450); ctx.closePath(); ctx.fillStyle = st.hl.alu ? HL : "#fff"; ctx.fill(); ctx.strokeStyle = st.hl.alu ? HLS : "#B7C4CC"; ctx.lineWidth = st.hl.alu ? 6 : 3; ctx.stroke(); ctx.restore(); text(ctx, "ALU", 740, 350, 26, { align: "center", weight: 900 }); text(ctx, st.hl.alu ? (st.ir.startsWith("TAMBAH") ? "+" : "−") : "+ − ><", 740, 410, st.hl.alu ? 44 : 22, { align: "center", weight: 900, color: st.hl.alu ? C.accentDark : C.ink2 }); });
    dimIf("reg", () => { [["PC", st.pc, st.hl.pc], ["IR", st.ir || "–", st.hl.ir], ["AKU", st.aku === "" ? "–" : st.aku, st.hl.aku]].forEach(([n, v, on], i) => { const x = 230 + i * 225; card(ctx, x, 480, 205, 130, { fill: on ? HL : "#fff", stroke: on ? HLS : "#B7C4CC", lw: on ? 6 : 3, r: 12 }); text(ctx, n, x + 102, 515, 20, { align: "center", weight: 900, color: C.ink2 }); text(ctx, String(v), x + 102, 575, n === "IR" ? 26 : 40, { align: "center", weight: 900 }); }); if (opt.labels) text(ctx, "register: kotak kecil, sangat cepat", 560, 630, 18, { align: "center", weight: 700, color: C.ink2 }); });
    // memori
    dimIf("mem", () => { card(ctx, 980, 240, 320, 400, { fill: "#F7FAF8", stroke: "#8E6BBF", lw: 4, r: 18 }); text(ctx, "MEMORI", 1140, 275, 22, { align: "center", weight: 900, color: "#8E6BBF" });
      const rh = 21; for (let a = 0; a < 16; a++) { const y = 292 + a * rh; const on = st.hl.mem === a; if (on) { ctx.fillStyle = HL; rr(ctx, 998, y - 2, 284, rh, 4); ctx.fill(); } ctx.fillStyle = a < 5 ? "#EDE6F7" : a === 10 || a === 11 || a === 12 ? "#DDF3E4" : "#fff"; ctx.fillRect(998, y - 1, 40, rh - 2); text(ctx, String(a), 1018, y + 14, 15, { align: "center", weight: 900, color: C.ink2 }); text(ctx, String(st.mem[a]), 1050, y + 14, 16, { weight: on ? 900 : 700, color: on ? C.accentDark : C.ink }); if (opt.pcArrow && a === st.pc && !st.halted) text(ctx, "◀ PC", 1282, y + 14, 13, { align: "right", weight: 900, color: C.kiko }); }
    });
    // I/O
    dimIf("io", () => { card(ctx, 1360, 240, 400, 400, { fill: "#F7FAF8", stroke: "#2E9E5B", lw: 4, r: 18 }); text(ctx, "INPUT · OUTPUT", 1560, 275, 20, { align: "center", weight: 900, color: C.good });
      ctx.fillStyle = "#4A5A66"; rr(ctx, 1400, 300, 320, 60, 8); ctx.fill(); for (let i = 0; i < 10; i++) { ctx.fillStyle = "#E6EDF2"; rr(ctx, 1410 + i * 31, 312, 24, 16, 3); ctx.fill(); if (i < 9) { rr(ctx, 1424 + i * 31, 334, 24, 16, 3); ctx.fill(); } } text(ctx, "keyboard (input)", 1560, 385, 16, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1400, 405, 320, 190, { fill: st.hl.out ? "#DDF3E4" : "#1F2A33", stroke: st.hl.out ? C.good : "#4A5A66", lw: st.hl.out ? 6 : 3, r: 10 }); text(ctx, st.out === "" ? (opt.guess ? "?" : "") : String(st.out), 1560, 520, 64, { align: "center", weight: 900, color: st.hl.out ? C.good : "#fff" }); text(ctx, "layar (output)", 1560, 625, 16, { align: "center", weight: 700, color: C.ink2 }); });
    // token di bus
    (opt.tokens || []).forEach(t => { const p = t.path; const u = clamp(t.u, 0, 1); const seg = Math.min(p.length - 2, Math.floor(u * (p.length - 1))); const f = u * (p.length - 1) - seg; const x = lerp(p[seg][0], p[seg + 1][0], f), y = lerp(p[seg][1], p[seg + 1][1], f); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill(); text(ctx, String(t.label), x, y + 7, 18, { align: "center", weight: 900, color: "#fff" }); });
  };
  // jalur token: dari memori ke CPU, dari CPU ke memori, dari memori ke layar
  V.PATH = { memToCpu: [[1140, 640], [1140, 700], [560, 700], [560, 640]], cpuToMem: [[560, 640], [560, 700], [1140, 700], [1140, 640]], memToOut: [[1140, 640], [1140, 700], [1560, 700], [1560, 640]] };
  // diagram siklus tiga langkah (lingkaran)
  V.cycle = function (ctx, cx, cy, r, active, opt = {}) {
    const steps = [["1. AMBIL", "PC → alamat → IR"], ["2. TERJEMAHKAN", "kode di IR dibaca"], ["3. JALANKAN", "ALU / memori / output"]];
    ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    steps.forEach(([t, s], i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 3; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; const on = active === i; card(ctx, x - 170, y - 50, 340, 100, { fill: on ? "#FFF3D6" : "#fff", stroke: on ? C.accent : "#B7C4CC", lw: on ? 6 : 3, r: 14 }); text(ctx, t, x, y - 8, 26, { align: "center", weight: 900 }); text(ctx, s, x, y + 28, 20, { align: "center", weight: 700, color: C.ink2 }); });
    for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i + 0.5) * Math.PI * 2 / 3; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = C.ink2; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(14, 10); ctx.lineTo(-14, 10); ctx.closePath(); ctx.fill(); ctx.restore(); }
    text(ctx, opt.center || "PC + 1", cx, cy + 10, 30, { align: "center", weight: 900, color: C.kiko });
  };
  // gelombang detak
  V.clockWave = function (ctx, x, y, w, n, t = 0) { ctx.strokeStyle = C.kiko; ctx.lineWidth = 5; ctx.beginPath(); const sw = w / n; for (let i = 0; i < n; i++) { const x0 = x + i * sw; ctx.moveTo(x0, y + 30); ctx.lineTo(x0, y - 30); ctx.lineTo(x0 + sw / 2, y - 30); ctx.lineTo(x0 + sw / 2, y + 30); ctx.lineTo(x0 + sw, y + 30); } ctx.stroke(); const k = Math.floor(t) % n; ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x + k * sw + sw / 4, y - 30, 12, 0, Math.PI * 2); ctx.fill(); };
  K.vn = V;
})(typeof window !== "undefined" ? window : globalThis);
