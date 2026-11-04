/* S25 Simulasi praktik: deque (antrean kantin), dictionary (menghitung kata), dan linked list buatan sendiri di notebook generik.
   Tata letak: jendela notebook (x 110–1110, y 122–822) + diagram di kanan (x 1140–1820): antrean, laci dictionary, rantai node.
   Semua kode sudah diuji dengan python3; output persis sama. Data dan tokoh rekaan. Muat setelah kiko-core.js, layar.js, layar_kode.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, LK = K.layarKode;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1000, h: 700 };
  const PX = 1140, PW = 680;
  const BLUE = "#1A73C8", GREEN = C.good, RED = LK.T.errInk, PURPLE = "#7A4FA8", AMBER = C.accentDark;
  const SZ = 21;
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const ph = LK.phase;
  const blinkAt = l => Math.floor(l * 2.2) % 2 === 0;
  const stepAt = (f, marks) => { let n = 0; marks.forEach((m, i) => { if (f >= m) n = i + 1; }); return n; };

  // ---------- program (diuji dengan python3) ----------
  const A1 = ['from collections import deque', '', 'antrean = deque()', 'antrean.append("Dito")', 'antrean.append("Sinta")', 'antrean.append("Rina")',
    'print(antrean)', 'print("Dilayani:", antrean.popleft())', 'print("Sisa:", antrean)'];
  const A1O = ["deque(['Dito', 'Sinta', 'Rina'])", "Dilayani: Dito", "Sisa: deque(['Sinta', 'Rina'])"];
  const A2 = ['while antrean:', '    print("Dilayani:", antrean.popleft())', 'print("Antrean kosong:", antrean)'];
  const A2O = ["Dilayani: Sinta", "Dilayani: Rina", "Antrean kosong: deque([])"];
  const A3 = ['antrean.popleft()'];
  const ERR_IDX = { name: "IndexError", msg: "pop from an empty deque", kind: "runtime", line: 1, ctx: [[1, A3[0]]] };
  const TEKS = ["bakso", "soto", "bakso", "mie", "bakso", "soto", "siomay", "mie", "bakso"];
  const D1 = ['teks = "bakso soto bakso mie bakso soto siomay mie bakso"', 'hitung = {}', 'for kata in teks.split():', '    hitung[kata] = hitung.get(kata, 0) + 1', 'print(hitung)'];
  const D1O = ["{'bakso': 4, 'soto': 2, 'mie': 2, 'siomay': 1}"];
  const D1BAD = D1.slice(); D1BAD[3] = '    hitung[kata] = hitung[kata] + 1';
  const ERR_KEY = { name: "KeyError", msg: "'bakso'", kind: "runtime", line: 4, ctx: [[3, D1BAD[2]], [4, D1BAD[3]]] };
  const D2 = ['urut = sorted(hitung.items(), key=lambda p: p[1], reverse=True)', 'for kata, jumlah in urut:', '    print(kata, jumlah)'];
  const D2O = ["bakso 4", "soto 2", "mie 2", "siomay 1"];
  const E1 = ['class Node:', '    def __init__(self, data):', '        self.data = data', '        self.next = None', '', 'head = None',
    'for pesan in ["Halo", "Besok libur?", "Iya, libur"]:', '    baru = Node(pesan)', '    baru.next = head', '    head = baru'];
  const E2 = ['node = head', 'while node is not None:', '    print(node.data, end=" -> ")', '    node = node.next', 'print("None")'];
  const E2O = ["Iya, libur -> Besok libur? -> Halo -> None"];
  const E2BAD = E2.slice(0, 3).concat(E2.slice(4));
  const LOOPLINE = "Iya, libur -> Iya, libur -> Iya, libur -> Iya, libur -> ";
  const MSG = ["Halo", "Besok libur?", "Iya, libur"];

  // ---------- notebook dan sel bertumpuk ----------
  const nb = (ctx, opt = {}) => LK.notebook(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { name: "Struktur_Data.ipynb", status: "tersambung", compact: true, ...opt });
  // cells: [opt LK.cell]; digambar berurutan dan digulir supaya sel terakhir (beserta output-nya) terlihat
  function stack(ctx, a, cells) {
    const x = a.x + 20, w = a.w - 40, gap = 18; const hs = cells.map(c => LK.cellHeight(ctx, w, { size: SZ, ...c }));
    const total = hs.reduce((s, h) => s + h, 0) + gap * (cells.length - 1), avail = a.h - 32, off = Math.max(0, total - avail);
    const gs = []; LK.clip(ctx, { x: a.x, y: a.y, w: a.w, h: a.h - 6 }, () => { let y = a.y + 16 - off; cells.forEach((c, i) => { gs.push(LK.cell(ctx, x, y, w, { size: SZ, ...c })); y += hs[i] + gap; }); });
    return gs;
  }
  const doneCell = (lines, out, count) => ({ lines, out, run: "done", count, active: false });
  function keys(ctx, k, u, x = 960, y = 760) { if (u > 0 && u < 1) L.keys(ctx, x, y, k, { press: u, align: "center", size: 30 }); }
  function call(ctx, x, y, s, tx, ty, opt = {}) { return L.callout(ctx, x, y, s, tx, ty, { size: 23, maxW: 600, ...opt }); }
  function panel(ctx, title, h = 700, y = 122) { card(ctx, PX, y, PW, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, title, PX + 26, y + 44, 24, { weight: 900, color: AMBER }); }
  const play = (c, at) => ({ at, x: c.play.x + 3, y: c.play.y + 3, click: true });

  // ---------- diagram antrean ----------
  // st: {names: [...], leave: {name, u}, join: {name, u}, note}
  function antre(ctx, st, y0 = 122) {
    panel(ctx, "ANTREAN KANTIN", 420, y0);
    const by = y0 + 230;
    ctx.fillStyle = "#C98A57"; rr(ctx, PX + 30, by - 70, 110, 140, 12); ctx.fill(); text(ctx, "KASIR", PX + 85, by + 8, 22, { align: "center", weight: 900, color: "#FFFFFF" });
    text(ctx, "◀ depan", PX + 170, by + 140, 22, { weight: 800, color: GREEN }); text(ctx, "belakang ▶", PX + PW - 30, by + 140, 22, { align: "right", weight: 800, color: BLUE });
    ctx.fillStyle = "#E4EAEE"; ctx.fillRect(PX + 170, by + 62, PW - 200, 4);
    const col = { Dito: C.kiko, Sinta: PURPLE, Rina: "#C0632F" };
    const person = (n, x, y, a = 1) => { ctx.globalAlpha = a; ctx.fillStyle = col[n] || C.ink2; ctx.beginPath(); ctx.arc(x, y - 36, 26, 0, 7); ctx.fill(); rr(ctx, x - 34, y - 6, 68, 64, 18); ctx.fill();
      text(ctx, n, x, y + 96, 22, { align: "center", weight: 800, color: col[n] }); ctx.globalAlpha = 1; };
    const slot = i => PX + 230 + i * 130;
    (st.names || []).forEach((n, i) => { let x = slot(i); if (st.shift) x = lerp(slot(i + 1), slot(i), ease(st.shift)); person(n, x, by); });
    if (st.join) person(st.join.name, lerp(PX + PW + 40, slot(st.join.i), ease(st.join.u)), by, clamp(st.join.u * 3, 0, 1));
    if (st.leave) { const u = ease(st.leave.u); person(st.leave.name, lerp(slot(0), PX + 85, u), by - u * 120, 1 - clamp((st.leave.u - 0.7) / 0.3, 0, 1)); }
    if (st.note) text(ctx, st.note, PX + PW / 2, y0 + 402, 24, { align: "center", weight: 800, color: st.noteColor || C.ink2 });
  }
  // ---------- diagram dictionary ----------
  function laci(ctx, counts, opt = {}) {
    const y0 = opt.y || 122; panel(ctx, opt.title || "DICTIONARY hitung", opt.h || 700, y0);
    if (opt.words) { // deretan kata dari teks.split()
      let x = PX + 26, y = y0 + 90; opt.words.forEach((w, i) => { ctx.font = `800 21px ${K.FONT}`; const ww = ctx.measureText(w).width + 22; if (x + ww > PX + PW - 20) { x = PX + 26; y += 46; }
        const on = i === opt.cur, done = i < opt.cur; ctx.fillStyle = on ? "#FFF3D6" : done ? "#EEF2F5" : "#F7F9FA"; rr(ctx, x, y - 26, ww, 36, 10); ctx.fill();
        if (on) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, x, y - 26, ww, 36, 10); ctx.stroke(); }
        text(ctx, w, x + 11, y, 21, { weight: 800, color: done ? "#9AA8B1" : C.ink }); x += ww + 8; });
    }
    const ty = y0 + (opt.words ? 210 : 90);
    if (opt.noTable) return;
    text(ctx, "kunci", PX + 60, ty, 21, { weight: 800, color: C.ink2 }); text(ctx, "nilai", PX + 420, ty, 21, { weight: 800, color: C.ink2 });
    Object.keys(counts).forEach((k, i) => { const y = ty + 20 + i * 86; const hl = opt.hl === k;
      ctx.fillStyle = hl ? "#FFF3D6" : C.bg2; rr(ctx, PX + 40, y, 330, 70, 14); ctx.fill(); ctx.fillStyle = hl ? "#FFF3D6" : "#E7F1FB"; rr(ctx, PX + 400, y, 120, 70, 14); ctx.fill();
      if (hl) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, PX + 40, y, 480, 70, 14); ctx.stroke(); }
      LK.mono(ctx, 26, 700); ctx.fillStyle = LK.T.str; LK.monoText(ctx, `'${k}'`, PX + 64, y + 45);
      text(ctx, "→", PX + 385, y + 45, 26, { align: "center", weight: 900, color: C.ink2 });
      LK.mono(ctx, 30, 800); ctx.fillStyle = LK.T.num; ctx.textAlign = "center"; ctx.fillText(String(counts[k]), PX + 460, y + 47); ctx.textAlign = "left";
      if (opt.bars) { ctx.fillStyle = GREEN; rr(ctx, PX + 540, y + 18, counts[k] * 28, 34, 8); ctx.fill(); } });
  }
  const countUpTo = n => { const c = {}; TEKS.slice(0, n).forEach(w => c[w] = (c[w] || 0) + 1); return c; };
  // ---------- diagram linked list (vertikal) ----------
  // st: {nodes: [data...] dari head, newNode: {data, u, linked, head}, cur: indeks node yang ditunjuk "node", headAt: 0, none: true}
  function chain(ctx, st) {
    panel(ctx, st.title || "LINKED LIST");
    const x = PX + 230, bw = 300, bh = 74, gap = 52, y0 = 210;
    const boxAt = (d, x, y, a = 1, hl, lab = true) => { ctx.globalAlpha = a; ctx.fillStyle = hl ? "#FFF3D6" : C.bg2; rr(ctx, x, y, bw, bh, 12); ctx.fill(); ctx.strokeStyle = hl ? C.accent : "#9AB5C2"; ctx.lineWidth = 3; rr(ctx, x, y, bw, bh, 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + bw - 80, y); ctx.lineTo(x + bw - 80, y + bh); ctx.stroke();
      text(ctx, d, x + 18, y + 47, 25, { weight: 800, fit: bw - 110 }); ctx.fillStyle = C.ink2; ctx.beginPath(); ctx.arc(x + bw - 40, y + bh / 2, 8, 0, 7); ctx.fill();
      if (lab) { text(ctx, "data", x + 18, y - 8, 17, { weight: 700, color: C.ink2 }); text(ctx, "next", x + bw - 62, y - 8, 17, { weight: 700, color: C.ink2 }); } ctx.globalAlpha = 1; };
    const arrowDown = (x1, y1, y2, col = C.ink2) => { ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1, y2 - 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1 - 10, y2 - 14); ctx.lineTo(x1 + 10, y2 - 14); ctx.lineTo(x1, y2); ctx.closePath(); ctx.fill(); };
    const nodes = st.nodes || []; const sh = st.newNode ? (st.newNode.shift || 0) : 0;
    const yAt = i => y0 + (i + sh) * (bh + gap);
    nodes.forEach((d, i) => { boxAt(d, x, yAt(i), 1, st.cur === i, i === 0 && !st.newNode); const ax = x + bw - 40; arrowDown(ax, yAt(i) + bh / 2 + 8, yAt(i + 1) + (i === nodes.length - 1 ? 0 : 0)); });
    const ny = yAt(nodes.length); LK.mono(ctx, 26, 800); ctx.fillStyle = st.cur === nodes.length ? RED : "#8A99A3"; LK.monoText(ctx, "None", nodes.length ? x + bw - 70 : x + 10, nodes.length ? ny + 26 : ny + 38);
    // node baru (sisip di depan)
    if (st.newNode) { const nn = st.newNode; const nx = lerp(x + 140, x, ease(clamp(nn.u, 0, 1))), yy = y0 - 0 + (sh - 1) * (bh + gap);
      boxAt(nn.data, nx, yy, clamp(nn.u * 2, 0, 1), true); text(ctx, "baru", nx + bw + 14, yy + 46, 21, { weight: 800, color: AMBER });
      if (nn.linked > 0) { ctx.globalAlpha = clamp(nn.linked, 0, 1); arrowDown(nx + bw - 40, yy + bh / 2 + 8, yAt(0), C.accent); ctx.globalAlpha = 1; } }
    // penunjuk head
    const hy = st.headAt != null ? st.headAt : (nodes.length ? yAt(0) : ny - 10);
    ctx.fillStyle = BLUE; rr(ctx, PX + 30, hy + 18, 110, 40, 12); ctx.fill(); text(ctx, "head", PX + 85, hy + 46, 23, { align: "center", weight: 900, color: "#FFFFFF" });
    ctx.strokeStyle = BLUE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(PX + 140, hy + 38); ctx.lineTo(x - 8, hy + 38); ctx.stroke();
    ctx.fillStyle = BLUE; ctx.beginPath(); ctx.moveTo(x - 4, hy + 38); ctx.lineTo(x - 18, hy + 28); ctx.lineTo(x - 18, hy + 48); ctx.closePath(); ctx.fill();
    if (st.cur != null) { const cy = st.cur < nodes.length ? yAt(st.cur) : ny - 20; ctx.fillStyle = AMBER; rr(ctx, x + bw + 30, cy + 18, 100, 40, 12); ctx.fill(); text(ctx, "node", x + bw + 80, cy + 46, 23, { align: "center", weight: 900, color: "#FFFFFF" }); }
    if (st.note) para(ctx, st.note, PX + PW / 2, 760, 23, PW - 60, { align: "center", weight: 800, color: st.noteColor || C.ink2, lh: 1.25 });
    return { yAt, x, bw, bh };
  }
  function nodeAnatomy(ctx, l) {
    panel(ctx, "SATU NODE");
    const x = PX + 120, y = 300, w = 440, h = 120;
    ctx.fillStyle = C.bg2; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.strokeStyle = "#9AB5C2"; ctx.lineWidth = 4; rr(ctx, x, y, w, h, 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 290, y); ctx.lineTo(x + 290, y + h); ctx.stroke();
    text(ctx, '"Halo"', x + 30, y + 74, 34, { weight: 800 }); ctx.fillStyle = C.ink2; ctx.beginPath(); ctx.arc(x + 365, y + h / 2, 12, 0, 7); ctx.fill();
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 365, y + h / 2); ctx.lineTo(x + 365, y + h + 90); ctx.stroke();
    LK.mono(ctx, 28, 800); ctx.fillStyle = "#8A99A3"; LK.monoText(ctx, "None", x + 325, y + h + 128);
    text(ctx, "self.data", x + 30, y - 24, 24, { weight: 800, color: LK.T.bi }); text(ctx, "self.next", x + 300, y - 24, 24, { weight: 800, color: LK.T.bi });
    para(ctx, "data: isi node. next: penunjuk ke node berikutnya.", PX + PW / 2, 680, 24, PW - 80, { align: "center", weight: 700, lh: 1.3 });
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: AMBER });
      ["memakai deque untuk antrean", "menghitung kata dengan dictionary", "membuat linked list sendiri", "menelusuri dari head sampai None"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 760, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: GREEN }); text(ctx, s, 350, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      [["deque", "antrean", C.kiko], ["dict", "laci kunci → nilai", PURPLE], ["node", "rantai penunjuk", "#C0632F"]].forEach(([t, s, c], i) => { const y = 280 + i * 140;
        card(ctx, 1100, y, 540, 120, { fill: "#F7FAF8", stroke: c, lw: 3, r: 18 }); LK.mono(ctx, 40, 800); ctx.fillStyle = c; LK.monoText(ctx, t, 1130, y + 74); text(ctx, s, 1610, y + 72, 28, { align: "right", weight: 800, color: C.ink2 }); });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: AMBER });
      [["F12.1", "Struktur Data Kompleks dan Abstrak", "queue, hash map, linked list"], ["S20", "Program Python Pertama di Colab", "menjalankan sel"], ["E.5", "Struktur Data Standar", "stack dan queue"]].forEach(([c, t, s], i) => {
        const x = 240 + i * 490; card(ctx, x, 300, 460, 320, { fill: i === 0 ? C.bg2 : "#F4F6F5", r: 22 });
        text(ctx, c, x + 230, 380, 54, { align: "center", weight: 900, color: i === 0 ? C.kiko : C.ink2 }); para(ctx, t, x + 230, 445, 30, 400, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 230, 585, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      kiko(ctx, 1660, 730, 100, 0, { wave: l });
    },

    // ----- deque -----
    dq_impor(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(A1.slice(0, 1), ph(l, sp, 0.1, 0.5));
      const [c] = stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.5 || blinkAt(l), active: true, run: "ready", minLines: 3 }]);
      if (f > 0.55) { const p = c.code.at(0, 5); LK.focus(ctx, { x: p.x - 4, y: c.code.top(0) + 2, w: c.code.cw * 11 + 8, h: c.code.lh - 4 }, { t: l, pad: 2 });
        call(ctx, 300, 420, "collections: modul bawaan Python, tidak perlu dipasang.", p.x + c.code.cw * 5, c.code.top(0) + c.code.lh, { maxW: 520 }); }
      antre(ctx, { names: [], note: "deque = antrean dua ujung" });
      LK.steps(ctx, "LANGKAH", ["File → Notebook baru.", "Ketik baris import."], stepAt(f, [0.1, 0.5]), { x: PX, y: 580, w: PW });
    },
    dq_append(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.insert(A1.slice(0, 1), 1, A1.slice(1, 6), ph(l, sp, 0.04, 0.7));
      const [c] = stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.7 || blinkAt(l), active: true, run: "ready", minLines: 3 }]);
      const n = clamp(T.lines.length - 3 - (T.done ? 0 : 1), 0, 3); const names = ["Dito", "Sinta", "Rina"];
      const ju = T.done ? 1 : clamp((f - [0.3, 0.45, 0.6][Math.min(2, n)]) / 0.1 + 0.4, 0, 1);
      antre(ctx, { names: names.slice(0, n), join: !T.done && T.lines.length > 3 ? { name: names[n], i: n, u: ju } : null, note: f > 0.75 ? "append: masuk dari belakang" : "", noteColor: BLUE });
    },
    dq_popleft(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.insert(A1.slice(0, 6), 6, A1.slice(6), ph(l, sp, 0.03, 0.3));
      const ran = f > 0.42;
      const [c] = stack(ctx, a, [{ lines: T.lines, caret: ran ? null : T.caret, blink: blinkAt(l), active: true, run: ran ? "done" : f > 0.36 ? "running" : "ready", spin: l, count: 1, out: ran ? A1O : null, hl: ran && f < 0.85 ? [7] : [] }]);
      const lu = clamp((f - 0.48) / 0.25, 0, 1);
      antre(ctx, ran ? { names: ["Sinta", "Rina"], shift: 1 - clamp((f - 0.62) / 0.12, 0, 1), leave: lu < 1 ? { name: "Dito", u: lu } : null, note: f > 0.75 ? "Yang datang pertama, keluar pertama." : "", noteColor: GREEN } : { names: ["Dito", "Sinta", "Rina"] });
      if (ran && c.out) call(ctx, 660, c.out.lines[1] - 34, "popleft(): ambil dari depan", c.x + 290, c.out.lines[1] - 8, { fill: C.goodBg, color: GREEN });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 780 }, play(c, 0.36), { at: 0.6, x: 800, y: 790 }]);
    },
    dq_while(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(A2, ph(l, sp, 0.04, 0.42)); const ran = f > 0.5;
      const k = ran ? clamp(Math.floor((f - 0.5) / 0.12) + 1, 1, 3) : 0;
      const gs = stack(ctx, a, [doneCell(A1, A1O, 1), { lines: T.lines, caret: ran ? null : T.caret, blink: blinkAt(l), active: true, run: ran ? (k < 3 ? "running" : "done") : "ready", spin: l, count: 2, out: ran ? A2O.slice(0, k) : null, hl: ran && k < 3 ? [1] : [] }]);
      const c = gs[1];
      const names = ["Sinta", "Rina"].slice(Math.min(2, k));
      const lu = ran && k <= 2 ? clamp(((f - 0.5) % 0.12) / 0.1, 0, 1) : 1;
      antre(ctx, { names: k === 0 ? ["Sinta", "Rina"] : names, leave: ran && k <= 2 && lu < 1 ? { name: ["Sinta", "Rina"][k - 1], u: lu } : null, note: k >= 3 ? "Antrean kosong: perulangan berhenti." : 'while antrean: "selama masih berisi"', noteColor: k >= 3 ? GREEN : C.ink2 });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.48), { at: 0.7, x: 800, y: 790 }]);
    },
    dq_error(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(A3, ph(l, sp, 0.03, 0.15)); const ran = f > 0.22;
      const gs = stack(ctx, a, [doneCell(A2, A2O, 2), { lines: T.lines, caret: ran ? null : T.caret, active: true, run: ran ? "done" : "ready", count: 3, out: ran ? [{ err: ERR_IDX }] : null }]);
      const c = gs[1]; if (ran && c.out && c.out.err && f > 0.3) LK.focus(ctx, c.out.err.lastBox, { t: l, color: RED });
      antre(ctx, { names: [], note: ran ? "Kosong, tidak ada yang bisa diambil!" : "", noteColor: RED });
      card(ctx, PX, 580, PW, 220, { fill: C.goodBg, r: 18 }); text(ctx, "CEGAH", PX + 26, 624, 24, { weight: 900, color: GREEN });
      LK.code(ctx, PX + 20, 650, ['if antrean:', '    print(antrean.popleft())'], { size: 24, nums: false, w: PW - 40 });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.2), { at: 0.5, x: 800, y: 790 }]);
    },

    // ----- dictionary -----
    dc_teks(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(D1.slice(0, 3), ph(l, sp, 0.04, 0.75));
      stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.75 || blinkAt(l), active: true, run: "ready", minLines: 5 }]);
      laci(ctx, {}, { words: f > 0.45 ? TEKS : null, cur: -1, title: "teks.split()", noTable: true });
      if (f > 0.45) text(ctx, "9 kata, dipisah di setiap spasi", PX + 26, 340, 23, { weight: 700, color: C.ink2 });
      if (f > 0.7) { text(ctx, "hitung = {}", PX + 26, 420, 26, { weight: 800, color: PURPLE }); text(ctx, "laci masih kosong", PX + 26, 460, 23, { weight: 700, color: C.ink2 }); }
    },
    dc_get(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.insert(D1.slice(0, 3), 3, D1.slice(3), ph(l, sp, 0.03, 0.35));
      const [c] = stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.35 || blinkAt(l), active: true, run: "ready", hl: f > 0.38 ? [3] : [] }]);
      const n = f < 0.4 ? 0 : clamp(Math.floor((f - 0.4) / 0.065) + 1, 1, 9); const cur = n - 1;
      laci(ctx, countUpTo(n), { words: TEKS, cur: n < 9 || f < 0.98 ? cur : 9, hl: n ? TEKS[cur] : null, h: 700 });
      if (f > 0.4) { const w = TEKS[Math.max(0, cur)], prev = countUpTo(Math.max(0, cur))[w] || 0;
        LK.mono(ctx, 22, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, `get('${w}', 0) → ${prev}, lalu + 1 = ${prev + 1}`, PX + 26, 790); }
    },
    dc_jalan(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.12;
      const [c] = stack(ctx, a, [{ lines: D1, active: true, run: ran ? "done" : "running", spin: l, count: 4, out: ran ? D1O : null }]);
      laci(ctx, countUpTo(9), { title: "DICTIONARY hitung", bars: true });
      if (ran && c.out) { LK.focus(ctx, { x: c.x + 86, y: c.out.lines[0] - 22, w: 560, h: 30 }, { t: l, color: GREEN }); }
      if (f > 0.7) { text(ctx, "kunci = kata", PX + 60, 600, 25, { weight: 800, color: LK.T.str }); text(ctx, "nilai = jumlah", PX + 60, 640, 25, { weight: 800, color: LK.T.num }); }
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.06), { at: 0.4, x: 800, y: 790 }]);
    },
    dc_keyerror(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.3;
      const [c] = stack(ctx, a, [{ lines: D1BAD, active: true, run: ran ? "done" : "ready", count: 5, out: ran ? [{ err: ERR_KEY }] : null, boxes: [{ line: 3, from: 19, to: 31, color: RED }] }]);
      if (ran && c.out && c.out.err) LK.focus(ctx, c.out.err.lastBox, { t: l, color: RED });
      laci(ctx, {}, { words: TEKS, cur: 0, noTable: true });
      if (ran) { card(ctx, PX + 30, 380, PW - 60, 150, { fill: "#FDECEA", r: 16 }); para(ctx, "hitung['bakso'] dibaca, padahal kunci 'bakso' belum ada.", PX + PW / 2, 440, 25, PW - 120, { align: "center", weight: 800, color: RED, lh: 1.3 }); }
      if (f > 0.6) { card(ctx, PX + 30, 560, PW - 60, 150, { fill: C.goodBg, r: 16 }); text(ctx, "Pakai get dengan nilai cadangan:", PX + 56, 606, 23, { weight: 800, color: GREEN });
        LK.code(ctx, PX + 46, 626, ["hitung.get(kata, 0)"], { size: 26, nums: false, w: PW - 120 }); }
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.28), { at: 0.5, x: 800, y: 790 }]);
    },
    dc_sorted(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(D2, ph(l, sp, 0.04, 0.6));
      const [, c] = stack(ctx, a, [doneCell(D1, D1O, 4), { lines: T.lines, caret: T.caret, blink: f < 0.6 || blinkAt(l), active: true, run: "ready", size: 20 }]);
      panel(ctx, "hitung.items()");
      const P = [["bakso", 4], ["soto", 2], ["mie", 2], ["siomay", 1]];
      P.forEach(([k, v], i) => { const y = 200 + i * 80; LK.mono(ctx, 28, 700); ctx.fillStyle = C.ink; LK.monoText(ctx, "(", PX + 60, y); ctx.fillStyle = LK.T.str; LK.monoText(ctx, `'${k}'`, PX + 80, y);
        const cw = LK.mono(ctx, 28, 700); const nx = PX + 80 + (k.length + 2) * cw; ctx.fillStyle = C.ink; LK.monoText(ctx, ", ", nx, y); const vx = nx + 2 * cw;
        if (f > 0.35) { ctx.fillStyle = "#FFF3D6"; rr(ctx, vx - 6, y - 30, cw + 12, 40, 8); ctx.fill(); }
        ctx.fillStyle = LK.T.num; LK.monoText(ctx, String(v), vx, y); ctx.fillStyle = C.ink; LK.monoText(ctx, ")", vx + cw, y);
        });
      if (f > 0.35) { text(ctx, "p[1] = jumlahnya", PX + 420, 280, 26, { weight: 800, color: AMBER }); }
      if (f > 0.55) { card(ctx, PX + 30, 560, PW - 60, 200, { fill: "#F7FAF8", r: 16 });
        [["key=lambda p: p[1]", "urutkan menurut jumlah"], ["reverse=True", "dari yang terbesar"]].forEach(([k, d], i) => { LK.mono(ctx, 23, 700); ctx.fillStyle = PURPLE; LK.monoText(ctx, k, PX + 56, 612 + i * 80); text(ctx, d, PX + 56, 644 + i * 80, 21, { weight: 700, color: C.ink2 }); }); }
    },
    dc_urut(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.12;
      const [, c] = stack(ctx, a, [doneCell(D1, D1O, 4), { lines: D2, active: true, run: ran ? "done" : "running", spin: l, count: 6, out: ran ? D2O : null, size: 20 }]);
      panel(ctx, "MENU PALING BANYAK DIPESAN");
      D2O.forEach((s, i) => { const [k, v] = s.split(" "); const u = ran ? ease(clamp((f - 0.15 - i * 0.08) / 0.15, 0, 1)) : 0; const y = 210 + i * 110;
        text(ctx, `${i + 1}.`, PX + 40, y + 44, 28, { weight: 900, color: C.ink2 }); text(ctx, k, PX + 90, y + 44, 30, { weight: 800 });
        ctx.fillStyle = i === 0 ? C.accent : GREEN; rr(ctx, PX + 250, y + 12, 90 * v * u, 48, 10); ctx.fill(); if (u > 0.9) text(ctx, String(v), PX + 262 + 90 * v, y + 46, 28, { weight: 900 }); });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.06), { at: 0.4, x: 800, y: 790 }]);
    },

    // ----- linked list -----
    ll_class(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(E1.slice(0, 4), ph(l, sp, 0.1, 0.8));
      const [c] = stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.8 || blinkAt(l), active: true, run: "ready", minLines: 4 }]);
      nodeAnatomy(ctx, l);
    },
    ll_head(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.insert(E1.slice(0, 4), 4, E1.slice(4, 6), ph(l, sp, 0.45, 0.62));
      stack(ctx, a, [{ lines: T.lines, caret: T.caret, blink: f < 0.62 || blinkAt(l), active: true, run: "ready", hl: f < 0.45 ? [3] : [5] }]);
      if (f < 0.45) nodeAnatomy(ctx, l);
      else chain(ctx, { nodes: [], title: "LINKED LIST KOSONG", note: "head = None: belum ada node sama sekali." });
    },
    ll_sisip(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.insert(E1.slice(0, 6), 6, E1.slice(6), ph(l, sp, 0.02, 0.25));
      const hl = f < 0.3 ? [] : f < 0.5 ? [7] : f < 0.7 ? [8] : [9];
      stack(ctx, a, [{ lines: T.lines, caret: T.done ? null : T.caret, blink: blinkAt(l), active: true, run: "ready", hl, size: 20 }]);
      const u = clamp((f - 0.3) / 0.15, 0, 1), lk = clamp((f - 0.5) / 0.12, 0, 1), hm = clamp((f - 0.7) / 0.12, 0, 1);
      const g = chain(ctx, { nodes: ["Besok libur?", "Halo"], newNode: { data: "Iya, libur", u: f > 0.3 ? u : 0, linked: lk, shift: 1 }, headAt: f > 0.7 ? lerp(210 + 126, 210, ease(hm)) : 210 + 126,
        title: "SISIP DI DEPAN", note: f > 0.5 ? (f > 0.7 ? "3. head = baru" : "2. baru.next = head (head lama)") : f > 0.3 ? "1. baru = Node(...)" : "" , noteColor: AMBER });
    },
    ll_jalan(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.08;
      const [c] = stack(ctx, a, [{ lines: E1, active: true, run: ran ? (f > 0.8 ? "done" : "running") : "ready", spin: l, count: 7, size: 20, hl: ran && f < 0.8 ? [6 + Math.floor(((f - 0.08) / 0.24) % 1 * 4)] : [] }]);
      const k = ran ? clamp(Math.floor((f - 0.08) / 0.24), 0, 2) : -1; const u = ran ? clamp(((f - 0.08) - k * 0.24) / 0.2, 0, 1) : 0;
      const done = MSG.slice(0, Math.max(0, k)).reverse();
      if (k < 0) chain(ctx, { nodes: [], title: "LINKED LIST" });
      else if (k <= 2 && f < 0.8) chain(ctx, { nodes: done, newNode: { data: MSG[k], u: u * 2, linked: u * 2 - 0.8, shift: done.length ? 1 : 1 }, headAt: u > 0.8 ? 210 : 336, title: `SISIP: "${MSG[k]}"` });
      else chain(ctx, { nodes: MSG.slice().reverse(), title: "LINKED LIST", note: "Pesan terbaru paling depan.", noteColor: GREEN });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.06), { at: 0.3, x: 800, y: 790 }]);
    },
    ll_telusur(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const T = LK.typed(E2, ph(l, sp, 0.04, 0.85));
      stack(ctx, a, [doneCell(E1, null, 7), { lines: T.lines, caret: T.caret, blink: f < 0.85 || blinkAt(l), active: true, run: "ready", size: 20, minLines: 5 }]);
      const cur = T.lines.length >= 4 && f > 0.6 ? clamp(Math.floor((f - 0.6) / 0.1), 0, 3) : 0;
      chain(ctx, { nodes: MSG.slice().reverse(), cur, title: "MENELUSURI", note: f > 0.6 ? "node = node.next: pindah ke node berikutnya." : "Mulai dari head.", noteColor: AMBER });
    },
    ll_output(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.1;
      const [, c] = stack(ctx, a, [doneCell(E1, null, 7), { lines: E2, active: true, run: ran ? "done" : "running", spin: l, count: 8, size: 20, out: ran ? E2O : null }]);
      const cur = ran ? clamp(Math.floor((f - 0.1) / 0.13), 0, 3) : 0;
      chain(ctx, { nodes: MSG.slice().reverse(), cur, title: "MENELUSURI", note: cur >= 3 ? "None: perulangan berhenti." : "", noteColor: GREEN });
      if (ran && c.out) LK.focus(ctx, { x: c.x + 86, y: c.out.lines[0] - 22, w: 570, h: 30 }, { t: l, color: GREEN });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.06), { at: 0.4, x: 800, y: 790 }]);
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 300, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 262, 22, 76, 6); ctx.fill(); rr(ctx, 340, 262, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 280, 44, { weight: 900, color: AMBER }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 330, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 250, 420 + i * 110, 840, 90, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 296, 476 + i * 110, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 340, 476 + i * 110, 28, { weight: 700, fit: 730 }); });
      card(ctx, 1130, 400, 560, 360, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Kata kunci", 1154, 440, 22, { weight: 900, color: C.ink2 });
      LK.code(ctx, 1150, 460, ["from collections import deque", "antrean.append(x)", "antrean.popleft()", "hitung.get(kata, 0) + 1", "baru.next = head", "node = node.next"], { size: 21, nums: false, w: 520 });
    },
    periksa(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "PERIKSA HASILMU", 960, 210, 32, { align: "center", weight: 900, color: AMBER });
      [["Antrean", A1O.slice(1, 3)], ["Dictionary", D2O.slice(0, 3)], ["Linked list", ["Iya, libur -> Besok libur?", "  -> Halo -> None"]]].forEach(([t, o], i) => {
        const on = l > A * (0.12 + i * 0.25); ctx.globalAlpha = on ? 1 : 0.25; const x = 220 + i * 510;
        card(ctx, x, 260, 480, 420, { fill: C.bg2, r: 20 }); text(ctx, t, x + 240, 320, 30, { align: "center", weight: 900 });
        card(ctx, x + 24, 350, 432, 230, { fill: "#FFFFFF", r: 12 }); LK.mono(ctx, 21, 600); ctx.fillStyle = C.ink; o.forEach((s, k) => LK.monoText(ctx, s, x + 44, 400 + k * 44));
        if (on) text(ctx, "✓", x + 240, 650, 48, { align: "center", weight: 900, color: GREEN }); ctx.globalAlpha = 1; });
    },
    ll_loop(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx); const ran = f > 0.25;
      const nOut = ran ? clamp(Math.floor((f - 0.25) * 22) + 1, 1, 12) : 0;
      const [, c] = stack(ctx, a, [doneCell(E1, null, 7), { lines: E2BAD, active: true, run: ran ? "running" : "ready", spin: l, count: 9, size: 20, out: ran ? Array(nOut).fill(LOOPLINE) : null }]);
      if (!ran || f < 0.4) { const y = c.code.top(2) + c.code.lh; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(c.code.x0, y); ctx.lineTo(c.code.x0 + 420, y); ctx.stroke(); ctx.setLineDash([]);
        call(ctx, 560, 300, "node = node.next terlupa", c.code.x0 + 420, y, { fill: "#FDECEA", color: RED }); }
      chain(ctx, { nodes: MSG.slice().reverse(), cur: 0, title: "MENELUSURI", note: ran ? "node tidak pernah pindah, jadi perulangan tidak berhenti." : "", noteColor: RED });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, play(c, 0.22), { at: 0.5, x: 800, y: 790 }]);
    },
    ll_stop(ctx, b, l) {
      const sp = spanOf(b), f = l / sp; const a = nb(ctx);
      const stopped = f > 0.14, fixedU = ph(l, sp, 0.3, 0.55), ran = f > 0.66;
      let lines = E2BAD, caret = null;
      if (f > 0.3) { const r = LK.insert(E2BAD, 3, [E2[3]], fixedU); lines = r.lines; caret = r.caret; }
      const out = ran ? E2O : stopped && f < 0.3 ? Array(12).fill(LOOPLINE).concat([{ k: "bad", t: "KeyboardInterrupt" }]) : !stopped ? Array(12).fill(LOOPLINE) : null;
      const [, c] = stack(ctx, a, [doneCell(E1, null, 7), { lines, caret: f > 0.3 && f < 0.6 ? caret : null, blink: blinkAt(l), active: true, run: !stopped ? "running" : ran ? "done" : "ready", spin: l, count: ran ? 10 : 9, size: 20, out, hl: f > 0.3 ? [3] : [] }]);
      chain(ctx, { nodes: MSG.slice().reverse(), cur: ran ? 3 : 0, title: "MENELUSURI", note: ran ? "Setiap putaran bergerak menuju None." : "", noteColor: GREEN });
      LK.pointer(ctx, l, sp, [{ at: 0, x: 700, y: 790 }, { at: 0.1, x: c.play.x + 3, y: c.play.y + 3, click: true }, { at: 0.28, x: c.code.x0 + 300, y: c.code.top(3) + 16, click: true, kind: "text" }, { at: 0.62, x: c.play.x + 3, y: c.play.y + 3, click: true }, { at: 0.85, x: 800, y: 790 }]);
      if (f < 0.3) call(ctx, 300, 640, "Tombol berhenti: kotak di tengah lingkaran", c.play.x, c.play.y + 24, { maxW: 480 });
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: AMBER });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F12.1", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "pelacak stack dan queue", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f121", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "tebak isi stack dan queue setiap langkah", 620, 600, 23, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tantangan", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Buat fungsi yang menyisipkan node baru di ujung belakang.", 1310, 420, 29, 540, { align: "center", weight: 700, lh: 1.3 });
      LK.code(ctx, 1060, 560, ["def tambah_belakang(head, data):", "    ..."], { size: 21, nums: false, w: 520 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
