/* K05 Simulasi konsep: antrean (queue) dan tumpukan (stack) dijalankan dengan perintah MASUK dan KELUAR.
   Kiri: panel program (x 120–600). Kanan: panel susunan (x 640–1800): antrean murid di depan Bu Warung atau tumpukan buku tugas
   di meja guru, lalu baki "sudah keluar". Semua gambar di atas y 830 (kartu narasi tiga baris mulai y≈841).
   Kunci beat: kind ("q" antrean / "s" tumpukan), ops (["+Dito", "-", …]), ask (baris yang ditanyakan), options, cues (potongan
   teks narasi tempat tiap perintah mulai dijalankan), banner, nextName. Muat setelah D7.6/struktur.js dan D7.6/scenes.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, Q = K.struktur, D = K.devices;
  const { rr, text, para, card, kiko, kid, bubble, ease, clamp, lerp } = H;
  const COL = { Dito: "#2E7E9A", Sinta: "#D9443B", Rani: "#2E9E5B", Bayu: "#8E6BBF", Tari: "#D48A1E", Agus: "#3F8FC4", Lina: "#C0587E" };
  const GIRL = { Sinta: 1, Rani: 1, Tari: 1, Lina: 1 };
  const HAIR = { Dito: "#2B2118", Sinta: "#4A2E1A", Rani: "#1B1B1B", Bayu: "#4A2E1A", Tari: "#2B2118", Agus: "#1B1B1B", Lina: "#4A2E1A" };
  const KIND = { q: { name: "ANTREAN", en: "queue", color: C.kiko, item: "" }, s: { name: "TUMPUKAN", en: "stack", color: C.bad, item: "Buku " } };

  // ---------- mesin: jalankan perintah ----------
  function simulate(kind, ops, init = []) {
    const items = init.slice(), out = [], st = [{ items: items.slice(), out: [] }];
    ops.forEach(op => {
      let last;
      if (op[0] === "+") { items.push(op.slice(1)); last = { type: "in", name: op.slice(1) }; }
      else if (!items.length) last = { type: "out", err: true };
      else { const name = kind === "q" ? items.shift() : items.pop(); out.push(name); last = { type: "out", name }; }
      st.push({ items: items.slice(), out: out.slice(), last });
    });
    return st;
  }
  // detik lokal saat tiap perintah mulai: dari posisi potongan teks (cues) di narasi, kalau tidak ada: dibagi rata
  function cueTimes(b, n) {
    const lead = b.speech != null && b.start != null ? b.speech - b.start : 0.4, a = b.audio || b.dur;
    const idx = (b.cues || []).map(c => b.text.indexOf(c));
    if (b.cues && b.cues.length === n && idx.every(i => i >= 0)) return idx.map(i => lead + i / b.text.length * a);
    return Array.from({ length: n }, (_, i) => lead + 0.6 + i * (a * 0.85 - 0.6) / n);
  }
  const at = (b, s) => { const lead = b.speech != null && b.start != null ? b.speech - b.start : 0.4, i = b.text.indexOf(s); return lead + Math.max(0, i) / b.text.length * (b.audio || b.dur); };
  function opAt(T, l) {
    let done = 0, cur = -1, f = 0;
    for (let k = 0; k < T.length; k++) {
      const d = Math.max(0.3, Math.min(1.0, (k + 1 < T.length ? T[k + 1] - T[k] : 9) - 0.05));
      if (l >= T[k] + d) done = k + 1; else { if (l >= T[k]) { cur = k; f = (l - T[k]) / d; } break; }
    }
    return { done, cur, f };
  }

  // ---------- gambar kecil ----------
  function chip(ctx, cx, cy, name, opt = {}) {
    const w = opt.w || 130, h = opt.h || 46, size = opt.size || 26;
    ctx.fillStyle = COL[name] || C.ink2; rr(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill();
    if (opt.ring) { ctx.strokeStyle = opt.ring; ctx.lineWidth = 5; rr(ctx, cx - w / 2 - 5, cy - h / 2 - 5, w + 10, h + 10, h / 2 + 5); ctx.stroke(); }
    text(ctx, (opt.prefix || "") + name, cx, cy + size * 0.36, size, { align: "center", weight: 900, color: "#fff", fit: w - 14 });
  }
  const QF = 700, QG = 150, QY = 250, QS = 100;          // antrean (koordinat lokal kotak 1100×520): depan di kanan
  function kidN(ctx, x, name, alpha, opt = {}) {
    ctx.save(); ctx.globalAlpha *= clamp(alpha, 0, 1); const dy = opt.dy || 0;
    if (opt.hl) { ctx.fillStyle = opt.hl; ctx.beginPath(); ctx.ellipse(x, QY + 40 + dy, 72, 128, 0, 0, Math.PI * 2); ctx.fill(); }
    kid(ctx, x, QY + dy, QS, { hair: GIRL[name] ? "long" : undefined, hairColor: HAIR[name] });
    chip(ctx, x, QY + 160 + dy, name, { w: 118 });
    ctx.restore();
  }
  function queueView(ctx, ox, oy, sc, items, anim, opt = {}) {
    ctx.save(); ctx.translate(ox, oy); ctx.scale(sc, sc);
    Q.counter(ctx, 870, 300, 200, "Bu Warung");
    const leaving = anim && anim.type === "out" && !anim.err ? items[0] : null;
    const shift = leaving ? ease(clamp((anim.f - 0.35) / 0.65, 0, 1)) : 0;
    items.forEach((nm, i) => { if (leaving && i === 0) return; kidN(ctx, QF - i * QG + shift * QG, nm, 1, { hl: opt.hlFront && i === 0 && !anim ? C.goodBg : null }); });
    if (leaving) { const u = ease(anim.f); kidN(ctx, QF + u * 140, leaving, 1 - ease(clamp((anim.f - 0.5) / 0.5, 0, 1)), { hl: C.goodBg, dy: -u * 24 }); }
    if (anim && anim.type === "in") { const n = items.length; kidN(ctx, lerp(-40, QF - n * QG, ease(anim.f)), anim.name, anim.f * 3); }
    let n = items.length; if (anim && anim.type === "in" && anim.f > 0.6) n++; if (leaving && anim.f > 0.6) n--;
    if (n > 0) text(ctx, "DEPAN", QF, 482, 24, { align: "center", weight: 900, color: C.good });
    if (n > 1) text(ctx, "BELAKANG", QF - (n - 1) * QG, 482, 24, { align: "center", weight: 900, color: C.accentDark });
    if (n === 0 && !(anim && (anim.type === "in" || anim.err))) text(ctx, "(antrean kosong)", 430, 330, 34, { align: "center", weight: 800, color: C.muted });
    if (anim && anim.err) errBox(ctx, 380, 250, "Antrean kosong!", anim.f);
    ctx.restore();
  }
  const SX = 440, SY = 440, BW = 380, BH = 58, BP = 62;   // tumpukan (koordinat lokal): meja guru di bawah
  function book(ctx, cx, y, name, alpha, opt = {}) {
    ctx.save(); ctx.globalAlpha *= clamp(alpha, 0, 1);
    ctx.fillStyle = "rgba(0,0,0,0.12)"; rr(ctx, cx - BW / 2 + 6, y + 6, BW, BH, 8); ctx.fill();
    ctx.fillStyle = COL[name] || C.ink2; rr(ctx, cx - BW / 2, y, BW, BH, 8); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)"; rr(ctx, cx + BW / 2 - 30, y + 7, 18, BH - 14, 3); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(cx - BW / 2 + 18, y, 12, BH);
    text(ctx, "Buku " + name, cx - 4, y + BH / 2 + 10, 28, { align: "center", weight: 900, color: "#fff" });
    if (opt.hl) { ctx.strokeStyle = opt.hl; ctx.lineWidth = 6; rr(ctx, cx - BW / 2 - 6, y - 6, BW + 12, BH + 12, 12); ctx.stroke(); }
    ctx.restore();
  }
  function stackView(ctx, ox, oy, sc, items, anim, opt = {}) {
    ctx.save(); ctx.translate(ox, oy); ctx.scale(sc, sc);
    ctx.fillStyle = C.table; ctx.fillRect(SX - 230, SY + 20, 26, 62); ctx.fillRect(SX + 204, SY + 20, 26, 62);
    ctx.fillStyle = C.tableTop; rr(ctx, SX - 270, SY, 540, 28, 8); ctx.fill();
    text(ctx, "meja guru", SX + 290, SY + 24, 26, { weight: 800, color: C.ink2 });
    const yOf = i => SY - (i + 1) * BP;
    const leaving = anim && anim.type === "out" && !anim.err ? items[items.length - 1] : null;
    items.forEach((nm, i) => { if (leaving && i === items.length - 1) return; book(ctx, SX, yOf(i), nm, 1, { hl: opt.hlTop && i === items.length - 1 && !anim ? C.good : null }); });
    if (leaving) { const u = ease(anim.f), i = items.length - 1; book(ctx, SX + u * 300, yOf(i) - u * 90, leaving, 1 - ease(clamp((anim.f - 0.5) / 0.5, 0, 1)), { hl: C.good }); }
    if (anim && anim.type === "in") { const i = items.length; book(ctx, SX, yOf(i) - (1 - ease(anim.f)) * 170, anim.name, anim.f * 3); }
    let n = items.length; if (anim && anim.type === "in" && anim.f > 0.6) n++; if (leaving && anim.f > 0.6) n--;
    if (n > 0) text(ctx, "◀ ATAS", SX + BW / 2 + 24, yOf(n - 1) + BH / 2 + 10, 26, { weight: 900, color: C.good });
    if (n > 1) text(ctx, "◀ bawah", SX + BW / 2 + 24, yOf(0) + BH / 2 + 10, 24, { weight: 800, color: C.accentDark });
    if (n === 0 && !(anim && (anim.type === "in" || anim.err))) text(ctx, "(tumpukan kosong)", SX, SY - 60, 34, { align: "center", weight: 800, color: C.muted });
    if (anim && anim.err) errBox(ctx, SX, 250, "Tumpukan kosong!", anim.f);
    ctx.restore();
  }
  function errBox(ctx, cx, cy, s, f) {
    const sh = f < 0.5 ? Math.sin(f * 60) * 10 * (1 - f * 2) : 0;
    ctx.save(); ctx.globalAlpha = clamp(f * 4, 0, 1);
    card(ctx, cx - 280 + sh, cy - 70, 560, 140, { fill: C.badBg, stroke: C.bad, lw: 5, r: 20 });
    text(ctx, "✕ " + s, cx + sh, cy - 8, 40, { align: "center", weight: 900, color: C.bad });
    text(ctx, "tidak ada yang bisa keluar", cx + sh, cy + 40, 28, { align: "center", weight: 800, color: C.bad });
    ctx.restore();
  }
  function view(ctx, kind, ox, oy, sc, items, anim, opt) { (kind === "s" ? stackView : queueView)(ctx, ox, oy, sc, items, anim, opt || {}); }
  // baki "sudah keluar"
  function tray(ctx, x, y, w, out, kind, opt = {}) {
    card(ctx, x, y, w, 100, { fill: "#F7FAF8", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, "SUDAH KELUAR:", x + 24, y + 61, 26, { weight: 900, color: C.ink2 });
    if (!out.length) text(ctx, "belum ada", x + 260, y + 61, 26, { weight: 700, color: C.muted });
    out.forEach((nm, i) => { ctx.save(); if (opt.fadeLast && i === out.length - 1) ctx.globalAlpha = opt.fadeLast; chip(ctx, x + 330 + i * 190, y + 50, nm, { w: 170, h: 54, size: 26, prefix: (i + 1) + ". " + (kind === "s" ? "" : ""), ring: opt.ring === i ? C.good : null }); ctx.restore(); });
  }

  // ---------- panel program ----------
  function opLabel(op) { return op[0] === "+" ? ["MASUK", op.slice(1)] : ["KELUAR", ""]; }
  function program(ctx, ops, st, opt = {}) {
    const x = 120, y = 130, w = 480;
    card(ctx, x, y, w, 700, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
    text(ctx, "PROGRAM", x + 28, y + 54, 28, { weight: 900, color: C.accentDark });
    const rh = ops.length > 5 ? 68 : 76;
    ops.forEach((op, i) => {
      const ry = y + 84 + i * rh, active = opt.cur === i, done = opt.done != null && i < opt.done, ask = opt.ask === i;
      ctx.fillStyle = active ? "#FFF3D6" : ask ? "#FFF3D6" : "#F7FAF8"; rr(ctx, x + 18, ry, w - 36, rh - 12, 14); ctx.fill();
      ctx.strokeStyle = active || ask ? C.accent : "#E1E8E4"; ctx.lineWidth = active || ask ? 5 : 2; ctx.stroke();
      const cy = ry + (rh - 12) / 2;
      ctx.fillStyle = done ? C.good : C.ink2; ctx.beginPath(); ctx.arc(x + 52, cy, 20, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 52, cy + 9, 24, { align: "center", weight: 900, color: "#fff" });
      const [w1, nm] = opLabel(op);
      text(ctx, w1, x + 88, cy + 11, 30, { weight: 900, color: op[0] === "+" ? C.kikoDark : C.bad });
      if (nm) text(ctx, nm, x + 228, cy + 11, 30, { weight: 900, color: COL[nm] || C.ink });
      if (op[0] === "-") {
        const r = st && done ? st[i + 1].last : null;
        if (ask && !done) { const p = 1 + 0.12 * Math.sin((opt.l || 0) * 6); text(ctx, "?", x + w - 60, cy + 14 * p, 44 * p, { align: "center", weight: 900, color: C.accentDark }); }
        else if (r && r.err) text(ctx, "✕ kosong", x + w - 36, cy + 10, 28, { align: "right", weight: 900, color: C.bad });
        else if (r) text(ctx, "→ " + r.name, x + w - 36, cy + 10, 28, { align: "right", weight: 900, color: C.good });
      }
    });
    if (opt.kind) {
      const k = KIND[opt.kind]; card(ctx, x + 18, y + 600, w - 36, 82, { fill: opt.kind === "q" ? "#E3F1F6" : C.badBg, r: 16 });
      text(ctx, "dijalankan pada:", x + w / 2, y + 632, 22, { align: "center", weight: 700, color: C.ink2 });
      text(ctx, k.name + " (" + k.en + ")", x + w / 2, y + 666, 28, { align: "center", weight: 900, color: k.color });
    }
  }
  function structCard(ctx, kind, title) {
    card(ctx, 640, 130, 1160, 700, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
    const k = KIND[kind]; text(ctx, title || (kind === "q" ? "ANTREAN KANTIN (queue)" : "TUMPUKAN BUKU TUGAS (stack)"), 1220, 184, 32, { align: "center", weight: 900, color: k.color });
  }
  // keadaan papan pada detik l untuk beat yang menjalankan ops
  function runState(b, l, ops, kind) {
    const st = simulate(kind, ops), T = cueTimes(b, ops.length), o = opAt(T, l);
    let anim = null, cur = o.cur;
    if (cur >= 0) { const op = ops[cur]; anim = op[0] === "+" ? { type: "in", name: op.slice(1), f: o.f } : { type: "out", f: o.f, err: st[cur + 1].last.err }; }
    const base = cur >= 0 ? st[cur] : st[o.done];
    if (cur < 0 && o.done > 0 && st[o.done].last.err) anim = { type: "out", err: true, f: 1 };   // peringatan kosong tetap tampil
    return { st, o, anim, base };
  }

  Object.assign(K.SCENES, {
    k5_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menjalankan perintah masuk dan keluar", "menebak siapa yang keluar berikutnya", "membedakan antrean dan tumpukan", "mencatat isi susunan setiap langkah"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.7) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 800, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 30, { weight: 800 }); ctx.globalAlpha = 1;
      });
      queueView(ctx, 1020, 170, 0.62, ["Dito", "Sinta", "Rani"], null, { hlFront: true });
      stackView(ctx, 1150, 450, 0.62, ["Dito", "Sinta", "Rani"], null, { hlTop: true });
    },
    k5_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SIMULASI INI MELENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 460, 290, 1000, 330, { fill: C.bg2, r: 22 });
      text(ctx, "Episode D7.6", 960, 380, 60, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Data Terstruktur di Sekitar Kita", 960, 450, 40, { align: "center", weight: 800 });
      text(ctx, "Bagian 2: antrean, tumpukan, dan hierarki", 960, 530, 30, { align: "center", weight: 700, color: C.ink2 });
      kiko(ctx, 1640, 700, 110, 0, { wave: l });
    },
    k5_aturan_antre(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "ANTREAN KANTIN", 640, 190, 34, { align: "center", weight: 900, color: C.kiko });
      const ops = ["+Bayu", "-", "+Tari", "-"], st = simulate("q", ops, ["Dito", "Sinta", "Rani"]), T = cueTimes(b, 4), o = opAt(T, l);
      const anim = o.cur >= 0 ? (ops[o.cur][0] === "+" ? { type: "in", name: ops[o.cur].slice(1), f: o.f } : { type: "out", f: o.f }) : null;
      queueView(ctx, 120, 200, 0.95, (o.cur >= 0 ? st[o.cur] : st[o.done]).items, anim);
      const rows = [["MASUK", "berdiri di belakang", C.kikoDark, T[0]], ["KELUAR", "yang paling depan", C.bad, T[1]]];
      rows.forEach(([a, s, col, t0], i) => { if (l < t0) return; card(ctx, 1290, 250 + i * 140, 470, 112, { fill: C.bg2, r: 18 }); text(ctx, a, 1320, 300 + i * 140, 30, { weight: 900, color: col }); text(ctx, s, 1320, 342 + i * 140, 28, { weight: 800 }); });
      if (l > T[2]) { card(ctx, 1290, 560, 470, 130, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "pertama masuk,", 1525, 612, 34, { align: "center", weight: 900 }); text(ctx, "pertama keluar", 1525, 660, 34, { align: "center", weight: 900 }); }
    },
    k5_aturan_tumpuk(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "TUMPUKAN BUKU TUGAS", 640, 190, 34, { align: "center", weight: 900, color: C.bad });
      const ops = ["+Rani", "-", "+Bayu", "-"], st = simulate("s", ops, ["Dito", "Sinta"]), T = cueTimes(b, 4), o = opAt(T, l);
      const anim = o.cur >= 0 ? (ops[o.cur][0] === "+" ? { type: "in", name: ops[o.cur].slice(1), f: o.f } : { type: "out", f: o.f }) : null;
      stackView(ctx, 230, 280, 1, (o.cur >= 0 ? st[o.cur] : st[o.done]).items, anim);
      const rows = [["MASUK", "ditaruh di atas", C.kikoDark, T[0]], ["KELUAR", "yang paling atas", C.bad, T[1]]];
      rows.forEach(([a, s, col, t0], i) => { if (l < t0) return; card(ctx, 1290, 250 + i * 140, 470, 112, { fill: C.bg2, r: 18 }); text(ctx, a, 1320, 300 + i * 140, 30, { weight: 900, color: col }); text(ctx, s, 1320, 342 + i * 140, 28, { weight: 800 }); });
      if (l > T[2]) { card(ctx, 1290, 560, 470, 130, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "terakhir masuk,", 1525, 612, 34, { align: "center", weight: 900 }); text(ctx, "pertama keluar", 1525, 660, 34, { align: "center", weight: 900 }); }
    },
    k5_perintah(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "DUA PERINTAH", 960, 200, 34, { align: "center", weight: 900, color: C.accentDark });
      const t1 = Math.min(0.6, at(b, "Masuk menambah")), t2 = Math.min(1.4, at(b, "keluar mengeluarkan")), t3 = at(b, "Di komputer");
      const cmd = (x, w1, col, s, t0, draw) => { if (l < t0) return; const u = ease((l - t0) / 0.5); ctx.save(); ctx.globalAlpha = u; card(ctx, x, 250, 760, 320, { fill: C.bg2, r: 22 }); card(ctx, x + 30, 280, 300, 80, { fill: "#fff", stroke: col, lw: 4, r: 16 }); text(ctx, w1, x + 180, 334, 36, { align: "center", weight: 900, color: col }); text(ctx, s, x + 360, 334, 28, { weight: 800 }); draw(x); ctx.restore(); };
      cmd(160, "MASUK", C.kikoDark, "menambah satu nama", t1, x => { chip(ctx, x + 190, 450, "Dito"); chip(ctx, x + 330, 450, "Sinta"); ctx.save(); ctx.globalAlpha *= 0.5 + 0.5 * Math.sin(l * 4); chip(ctx, x + 520, 450, "Rani", { ring: C.kiko }); ctx.restore(); text(ctx, "+", x + 430, 462, 44, { align: "center", weight: 900, color: C.kiko }); });
      cmd(1000, "KELUAR", C.bad, "mengeluarkan satu nama", t2, x => { chip(ctx, x + 200, 450, "Dito", { ring: C.good }); chip(ctx, x + 340, 450, "Sinta"); chip(ctx, x + 480, 450, "Rani", { ring: C.good }); text(ctx, "yang mana? sesuai aturannya", x + 380, 530, 26, { align: "center", weight: 800, color: C.ink2 }); });
      if (l > t3) { const u = ease((l - t3) / 0.5); ctx.save(); ctx.globalAlpha = u;
        card(ctx, 300, 610, 600, 110, { fill: "#E3F1F6", stroke: C.kiko, lw: 4, r: 18 }); text(ctx, "antrean = queue", 600, 680, 40, { align: "center", weight: 900, color: C.kikoDark });
        card(ctx, 1020, 610, 600, 110, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "tumpukan = stack", 1320, 680, 40, { align: "center", weight: 900, color: C.bad }); ctx.restore(); }
    },
    k5_tanya(ctx, b, l) {
      program(ctx, b.ops, null, { ask: b.ask, done: 0, kind: b.kind, l });
      structCard(ctx, b.kind);
      view(ctx, b.kind, 670, 150, 1, [], null);
      tray(ctx, 670, 712, 1100, [], b.kind);
      kiko(ctx, 760, 610, 110, 0, { mood: "confused" });
      const p = 1 + 0.1 * Math.sin(l * 5); text(ctx, "?", 840, 560, 64 * p, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "?", 880, 600, 44 * p, { align: "center", weight: 900, color: C.accent });
    },
    k5_tebak(ctx, b, l) {
      program(ctx, b.ops, null, { ask: b.ask, done: 0, kind: b.kind, l });
      card(ctx, 640, 130, 1160, 700, { fill: "#FFFFFF", stroke: C.accent, lw: 5, r: 22 });
      text(ctx, "TEBAK DULU", 1220, 200, 36, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, b.kind === "q" ? "Siapa yang keluar?" : "Buku siapa yang keluar?", 1220, 280, 44, { align: "center", weight: 900 });
      const n = b.options.length;
      b.options.forEach((o, i) => {
        const y = 330 + i * 120; card(ctx, 760, y, 920, 96, { fill: C.bg2, stroke: "#CFDCD5", lw: 3, r: 20 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(820, y + 48, 30, 0, Math.PI * 2); ctx.fill(); text(ctx, "ABC"[i], 820, y + 61, 34, { align: "center", weight: 900, color: "#fff" });
        text(ctx, o, 880, y + 62, 40, { weight: 800 });
      });
      const frac = clamp(l / b.dur, 0, 1); ctx.lineWidth = 14; ctx.strokeStyle = "#D7E2DC"; ctx.beginPath(); ctx.arc(1700, 210, 40, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1700, 210, 40, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
      if (n < 4) text(ctx, "Tunjuk jawabanmu sebelum dijalankan.", 1220, 740, 28, { align: "center", weight: 700, color: C.ink2 });
    },
    k5_jalan(ctx, b, l) {
      const R = runState(b, l, b.ops, b.kind);
      program(ctx, b.ops, R.st, { done: R.o.done, cur: R.o.cur, kind: b.kind });
      structCard(ctx, b.kind);
      view(ctx, b.kind, 670, 150, 1, R.base.items, R.anim);
      const out = R.base.out.slice(); let fade = null;
      if (R.anim && R.anim.type === "out" && !R.anim.err && R.anim.f > 0.55) { out.push(R.st[R.o.cur + 1].last.name); fade = clamp((R.anim.f - 0.55) / 0.3, 0, 1); }
      tray(ctx, 670, 712, 1100, out, b.kind, { fadeLast: fade });
    },
    k5_hasil(ctx, b, l) {
      const st = simulate(b.kind, b.ops), fin = st[st.length - 1];
      program(ctx, b.ops, st, { done: b.ops.length, kind: b.kind });
      structCard(ctx, b.kind, " ");
      card(ctx, 700, 146, 1040, 66, { fill: C.goodBg, stroke: C.good, lw: 4, r: 16 }); text(ctx, b.banner || "", 1220, 192, 32, { align: "center", weight: 900, color: C.good, fit: 1000 });
      view(ctx, b.kind, 670, 150, 1, fin.items, null, { hlFront: l > at(b, "Sekarang"), hlTop: l > at(b, "Sekarang") });
      if (b.nextName && l > at(b, "Sekarang")) { const x = b.kind === "q" ? 670 + QF : 670 + SX; bubble(ctx, x - 300 + (b.kind === "q" ? 0 : 0), b.kind === "q" ? 300 : 320, 330, "keluar berikutnya", 28, { tailX: x - 40, tailDir: 20, fill: C.goodBg, stroke: C.good, color: C.good }); }
      tray(ctx, 670, 712, 1100, fin.out, b.kind, { ring: 0 });
    },
    k5_banding(ctx, b, l) {
      // atas: baris perintah; bawah: antrean (kiri) lawan tumpukan (kanan), keadaan akhir
      card(ctx, 120, 126, 1680, 96, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "Perintah yang sama:", 150, 186, 28, { weight: 900, color: C.ink2 });
      let x = 450; b.ops.forEach(op => { const [w1, nm] = opLabel(op); const s = w1 + (nm ? " " + nm : ""); ctx.font = "900 26px " + K.FONT; const w = ctx.measureText(s).width + 36; card(ctx, x, 146, w, 56, { fill: op[0] === "+" ? "#E3F1F6" : C.badBg, r: 14 }); text(ctx, s, x + w / 2, 183, 26, { align: "center", weight: 900, color: op[0] === "+" ? C.kikoDark : C.bad }); x += w + 14; });
      const side = (kind, x0) => {
        const st = simulate(kind, b.ops), fin = st[st.length - 1];
        card(ctx, x0, 240, 820, 590, { fill: "#FFFFFF", stroke: kind === "q" ? C.kiko : C.bad, lw: 4, r: 22 });
        text(ctx, kind === "q" ? "ANTREAN (queue)" : "TUMPUKAN (stack)", x0 + 410, 292, 32, { align: "center", weight: 900, color: kind === "q" ? C.kiko : C.bad });
        view(ctx, kind, x0 + (kind === "q" ? -10 : 70), kind === "q" ? 290 : 290, 0.8, fin.items, null);
        const ts = kind === "q" ? at(b, "Antrean") : at(b, kind === "s" ? "tumpukan" : "");
        if (l > ts) { text(ctx, "keluar:", x0 + 40, 742, 28, { weight: 900, color: C.ink2 }); fin.out.forEach((nm, i) => chip(ctx, x0 + 240 + i * 190, 732, nm, { w: 170, h: 56, prefix: (i + 1) + ". ", ring: C.good })); }
      };
      side("q", 120); side("s", 980);
    },
    // khusus Short: dua lajur mendatar (antrean di atas, tumpukan di bawah) supaya bisa dipotong besar-besar
    k5_banding_s(ctx, b, l) {
      [["q", 140], ["s", 490]].forEach(([kind, y]) => {
        const st = simulate(kind, b.ops), fin = st[st.length - 1], k = KIND[kind];
        card(ctx, 140, y, 1000, 330, { fill: "#FFFFFF", stroke: k.color, lw: 4, r: 20 });
        text(ctx, k.name + " (" + k.en + ")", 170, y + 46, 30, { weight: 900, color: k.color });
        view(ctx, kind, kind === "q" ? 110 : 160, kind === "q" ? y + 10 : y - 30, 0.6, fin.items, null);
        text(ctx, "keluar duluan:", 990, y + 140, 30, { align: "center", weight: 900, color: C.ink2 });
        chip(ctx, 990, y + 200, fin.out[0], { w: 230, h: 70, size: 34, prefix: kind === "s" ? "Buku " : "", ring: C.good });
      });
    },
    k5_catat(ctx, b, l) {
      const st = simulate(b.kind, b.ops);
      program(ctx, b.ops, st, { done: b.ops.length, kind: b.kind });
      card(ctx, 640, 130, 1160, 700, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 22 });
      text(ctx, "CATAT ISI ANTREAN SETIAP LANGKAH", 1220, 186, 30, { align: "center", weight: 900, color: C.accentDark });
      const X = [670, 1000, 1560], Wd = [330, 560, 210];
      card(ctx, 670, 214, 1100, 64, { fill: C.bg2, r: 12 });
      ["perintah", "isi antrean (depan → belakang)", "keluar"].forEach((h, i) => text(ctx, h, X[i] + Wd[i] / 2, 256, 26, { align: "center", weight: 900, color: C.ink2 }));
      const t0 = 0.6, step = Math.max(0.6, ((b.audio || b.dur) * 0.7 - t0) / b.ops.length);
      b.ops.forEach((op, i) => {
        if (l < t0 + i * step) return; const y = 290 + i * 84, s = st[i + 1]; const [w1, nm] = opLabel(op);
        ctx.fillStyle = i % 2 ? "#F7FAF8" : "#FFFFFF"; rr(ctx, 670, y, 1100, 76, 10); ctx.fill();
        text(ctx, w1 + (nm ? " " + nm : ""), X[0] + 24, y + 48, 28, { weight: 900, color: op[0] === "+" ? C.kikoDark : C.bad });
        s.items.forEach((n2, j) => chip(ctx, X[1] + 70 + j * 130, y + 38, n2, { w: 118, h: 46, size: 24 }));
        if (!s.items.length) text(ctx, "(kosong)", X[1] + 30, y + 48, 26, { weight: 700, color: C.muted });
        if (s.last.type === "out") chip(ctx, X[2] + Wd[2] / 2, y + 38, s.last.name, { w: 140, h: 48, ring: i === b.ops.length - 1 ? C.good : null });
      });
    },
    k5_kosong(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "PERIKSA DULU SEBELUM KELUAR", 960, 196, 34, { align: "center", weight: 900, color: C.accentDark });
      // kiri: antrean kosong + error
      queueView(ctx, 140, 230, 0.78, [], null);
      ctx.save(); ctx.translate(140, 230); ctx.scale(0.78, 0.78); errBox(ctx, 420, 260, "Antrean kosong!", clamp(l / 0.8, 0, 1)); ctx.restore();
      const tE = at(b, "Di komputer"), tP = at(b, "jadi program");
      if (l > tE) { card(ctx, 260, 640, 500, 90, { fill: "#2B3A46", r: 14 }); text(ctx, "Error: antrean kosong", 510, 696, 30, { align: "center", weight: 800, color: "#FFB4AE" }); }
      // kanan: alur pemeriksaan
      if (l > tP) {
        const u = ease((l - tP) / 0.6); ctx.save(); ctx.globalAlpha = u;
        card(ctx, 1080, 250, 560, 100, { fill: C.bg2, stroke: C.kiko, lw: 4, r: 18 }); text(ctx, "KELUAR diminta", 1360, 312, 32, { align: "center", weight: 900 });
        card(ctx, 1110, 410, 500, 100, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 50 }); text(ctx, "Masih ada isinya?", 1360, 472, 32, { align: "center", weight: 900 });
        const arr = (x1, y1, x2, y2, col) => { ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); const a = Math.atan2(y2 - y1, x2 - x1); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 18 * Math.cos(a - 0.5), y2 - 18 * Math.sin(a - 0.5)); ctx.lineTo(x2 - 18 * Math.cos(a + 0.5), y2 - 18 * Math.sin(a + 0.5)); ctx.closePath(); ctx.fill(); };
        arr(1360, 352, 1360, 404, C.ink2); arr(1230, 512, 1130, 590, C.good); arr(1490, 512, 1590, 590, C.bad);
        text(ctx, "ya", 1150, 560, 26, { weight: 900, color: C.good }); text(ctx, "tidak", 1560, 560, 26, { align: "right", weight: 900, color: C.bad });
        card(ctx, 920, 596, 400, 100, { fill: C.goodBg, stroke: C.good, lw: 4, r: 18 }); text(ctx, "keluarkan satu", 1120, 658, 30, { align: "center", weight: 900, color: C.good });
        card(ctx, 1400, 596, 380, 100, { fill: C.badBg, stroke: C.bad, lw: 4, r: 18 }); text(ctx, "beri tahu: kosong", 1590, 658, 30, { align: "center", weight: 900, color: C.bad });
        ctx.restore();
      }
    },
    k5_komputer(ctx, b, l) {
      card(ctx, 120, 130, 820, 700, { fill: "#FFFFFF" }); card(ctx, 980, 130, 820, 700, { fill: "#FFFFFF" });
      text(ctx, "ANTREAN (queue)", 530, 196, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, "TUMPUKAN (stack)", 1390, 196, 34, { align: "center", weight: 900, color: C.bad });
      // kiri: antrean cetak
      const jobs = ["Tugas Dito", "Tugas Sinta", "Tugas Rani"], k = clamp(Math.floor((l - 1) / 2.2), 0, 3), f = clamp(((l - 1) % 2.2) / 2.2, 0, 1);
      Q.tokens(ctx, 170, 300, jobs.slice(k).reverse(), { dir: "h", w: 160, h: 56, gap: 10, size: 22, hl: jobs.slice(k).length - 1 });
      text(ctx, "antrean cetak → printer", 430, 400, 24, { align: "center", weight: 800, color: C.ink2 });
      Q.printer(ctx, 760, 330, 180, { sheet: k < 3 ? f : 1, sheetLabel: jobs[Math.min(k, 2)] });
      if (k > 0) { Q.tokens(ctx, 170, 560, jobs.slice(0, k), { dir: "h", w: 160, h: 56, gap: 10, size: 22, fill: C.goodBg, stroke: C.good }); text(ctx, "dicetak urut yang mengirim dulu", 530, 670, 26, { align: "center", weight: 800, color: C.good }); }
      // kanan: tombol back dan undo
      const ph = D.phone(ctx, 1200, 500, 260, 440); const back = l > at(b, "tombol back") + 1.2;
      ctx.fillStyle = "#F7FAF8"; rr(ctx, ph.x + 10, ph.y + 40, ph.w - 20, ph.h - 56, 14); ctx.fill();
      text(ctx, back ? "Halaman B" : "Halaman C", ph.x + ph.w / 2, ph.y + 240, 30, { align: "center", weight: 900, color: C.kiko });
      card(ctx, ph.x + 20, ph.y + 50, 96, 42, { fill: back ? C.accent : C.bg2, r: 10 }); text(ctx, "◀ back", ph.x + 68, ph.y + 78, 20, { align: "center", weight: 900 });
      Q.tokens(ctx, 1420, 600, back ? ["Halaman A", "Halaman B"] : ["Halaman A", "Halaman B", "Halaman C"], { dir: "v", w: 220, h: 58, gap: 10, size: 24, hl: back ? 1 : 2 });
      text(ctx, "tumpukan halaman", 1530, 700, 24, { align: "center", weight: 800, color: C.ink2 });
      if (back) text(ctx, "C keluar dulu", 1530, 400, 26, { align: "center", weight: 900, color: C.bad });
      if (l > at(b, "undo")) { card(ctx, 1080, 740, 640, 70, { fill: C.bg2, r: 14 }); text(ctx, "↶ undo: yang terakhir diketik dibatalkan dulu", 1400, 785, 24, { align: "center", weight: 800 }); }
    },
    k5_latihan(ctx, b, l) {
      card(ctx, 120, 130, 1680, 700, { fill: "#FFFFFF" });
      text(ctx, "COBA SENDIRI DI HALAMAN LATIHAN", 960, 192, 32, { align: "center", weight: 900, color: C.accentDark });
      // tiruan halaman latihan (generik) di HP
      const ph = D.phone(ctx, 560, 500, 420, 560); const x = ph.x + 16, w = ph.w - 32;
      card(ctx, x, ph.y + 30, w, 50, { fill: "#fff", r: 10 }); text(ctx, "belajar-informatika.vercel.app/d76", x + w / 2, ph.y + 63, 18, { align: "center", weight: 800, color: C.kikoDark });
      card(ctx, x, ph.y + 96, w, 52, { fill: C.bg2, stroke: C.accent, lw: 3, r: 10 }); text(ctx, "1 Simulasi antrean & tumpukan", x + w / 2, ph.y + 130, 20, { align: "center", weight: 900 });
      const tA = at(b, "Tekan Masuk"), tK = at(b, "lalu ketuk"), n = l < tA ? 0 : clamp(Math.floor((l - tA) / 0.9) + 1, 0, 3);
      card(ctx, x + 10, ph.y + 166, w / 2 - 15, 48, { fill: C.kiko, r: 10 }); text(ctx, "Antrean", x + w / 4, ph.y + 198, 22, { align: "center", weight: 900, color: "#fff" });
      card(ctx, x + w / 2 + 5, ph.y + 166, w / 2 - 15, 48, { fill: C.bg2, r: 10 }); text(ctx, "Tumpukan", x + w * 3 / 4, ph.y + 198, 22, { align: "center", weight: 900 });
      ["Dito", "Sinta", "Rani"].slice(0, n).forEach((nm, i) => chip(ctx, x + 70 + i * 120, ph.y + 270, nm, { w: 108, h: 44, size: 22, ring: l > tK + 0.8 && i === 0 ? C.good : null }));
      text(ctx, "depan →", x + 10, ph.y + 320, 18, { weight: 800, color: C.ink2 });
      card(ctx, x + 10, ph.y + 350, w / 2 - 15, 56, { fill: C.accent, r: 12 }); text(ctx, "+ Masuk", x + w / 4, ph.y + 386, 24, { align: "center", weight: 900 });
      card(ctx, x + w / 2 + 5, ph.y + 350, w / 2 - 15, 56, { fill: "#fff", stroke: "#B7C4CC", lw: 2, r: 12 }); text(ctx, "Siapa keluar?", x + w * 3 / 4, ph.y + 386, 21, { align: "center", weight: 800 });
      text(ctx, "Tebakan benar: antrean 0/3", x + w / 2, ph.y + 450, 20, { align: "center", weight: 700, color: C.ink2 });
      if (l > tA && l < tK) D.finger(ctx, x + w / 4 + 30, ph.y + 392, { s: 34, press: (l - tA) % 0.9 < 0.3 });
      if (l > tK) D.finger(ctx, x + 84, ph.y + 284, { s: 34, press: l - tK < 0.6 || (l - tK > 0.8 && l - tK < 1.2) });
      card(ctx, 900, 260, 860, 330, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1330, 330, 34, { align: "center", weight: 900 });
      para(ctx, "Tulis lima nama di kartu. Satu teman memberi perintah masuk dan keluar, yang lain menebak siapa yang keluar. Coba sebagai antrean, lalu sebagai tumpukan.", 1330, 390, 30, 760, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1680, 740, 90, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
