/* S12 Simulasi praktik: memakai password manager rekaan "Brankas Sandi" di HP (layar_hp.js + layar_brankas.js).
   Tata letak sama dengan S13: HP besar di kiri (cx 560), lup di tengah (x 790–1410), panel langkah di kanan (x 1450–1820).
   Cerita menyambung E.3: Dito dulu memakai satu kata sandi untuk delapan akun. Semua akun, situs, dan sandi rekaan. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, HP = K.hp, B = K.brankas;
  const { rr, text, para, card, kiko, ease, clamp, lerp, wrap } = H;
  const PC = { cx: 560, cy: 474, h: 680 };
  const BLUE = "#1A73C8", RED = "#D9443B", GREEN = "#2E9E5B", ORANGE = "#D9822B", V = B.V;

  // ---------- pembantu (pola S13) ----------
  let MC = null;
  function measure(fn) { if (!MC) MC = document.createElement("canvas"); MC.width = 400; MC.height = 800; const m = MC.getContext("2d"); m.save(); const r = fn(m); m.restore(); return r; }
  const rowsOf = (items, opt) => measure(m => HP.list(m, items, opt));
  const tapRow = (rows, i, dx = 0) => [rows[i].x + rows[i].w * 0.5 + dx, rows[i].cy];
  function phone(ctx, draw, opt = {}) { return HP.phone(ctx, opt.cx || PC.cx, opt.cy || PC.cy, { h: opt.h || PC.h, ...opt }, draw); }
  function steps(ctx, title, items, n, opt = {}) {
    const x = opt.x || 1450, y = opt.y || 122, w = opt.w || 370; let hh = 70;
    const rows = items.map(s => wrap(ctx, s, 23, 700, w - 86)); rows.forEach(lines => hh += lines.length * 30 + 22);
    card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 44, 24, { weight: 900, color: C.accentDark });
    let yy = y + 74;
    rows.forEach((lines, i) => {
      const done = i < n, now = i === n;
      if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, yy - 8, w - 20, lines.length * 30 + 16, 10); ctx.fill(); }
      ctx.fillStyle = done ? GREEN : now ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(x + 36, yy + 13, 14, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 36, yy + 21, 18, { align: "center", weight: 900, color: "#FFFFFF" });
      lines.forEach((ln, j) => text(ctx, ln, x + 62, yy + 22 + j * 30, 23, { weight: 700, color: done ? C.ink2 : C.ink }));
      yy += lines.length * 30 + 22;
    });
    return y + hh;
  }
  const stepAt = (l, span, marks) => { let n = 0; marks.forEach((m, i) => { if (l >= m * span) n = i + 1; }); return n; };
  const spanOf = (b, k = 0.9) => Math.max(3, (b.audio || b.dur) * k);
  const after = (b, l, f) => l > (b.audio || b.dur) * f;
  function badge(ctx, x, y, ok, s, opt = {}) {
    const h = opt.h || 76, w = opt.w || 500; ctx.fillStyle = ok ? C.goodBg : C.badBg; rr(ctx, x, y, w, h, 14); ctx.fill();
    ctx.fillStyle = ok ? GREEN : RED; ctx.beginPath(); ctx.arc(x + 34, y + h / 2, 19, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ok ? "check" : "close", x + 34, y + h / 2, 18, "#FFFFFF");
    const sz = opt.size || 24, lines = wrap(ctx, s, sz, 800, w - 80); lines.forEach((ln, i) => text(ctx, ln, x + 66, y + h / 2 + sz * 0.36 - (lines.length - 1) * sz * 0.6 + i * sz * 1.2, sz, { weight: 800, color: C.ink }));
  }
  const MAG = { x: 790, y: 150, w: 620 };
  function show(ctx, draw, src, opt = {}) { const ph = phone(ctx, draw, opt); const m = src ? HP.magnify(ctx, ph, draw, src, { x: opt.mx || MAG.x, y: opt.my || MAG.y, w: opt.mw || MAG.w }, { bg: opt.dark ? "#2B3F7A" : undefined }) : null; return { ph, m }; }
  function notes(ctx, y, list) { let yy = y + 24; list.forEach(n => { if (!n) return; const r = L.callout(ctx, 1450, yy, n.s, null, null, { size: n.size || 22, maxW: 330, fill: n.fill, color: n.color }); yy += r.h + 16; }); return yy; }
  function tapDraw(c, R) { if (R.tap) HP.tap(c, R.tap.x, R.tap.y, R.tap.u); }
  // ketukan keyboard saat langkah "type" berjalan: {ch, u}
  function typing(R, stepsArr) { const s = stepsArr[R.i]; if (!s || s.type == null || R.u >= 1) return null; const x = clamp(R.u / 0.9, 0, 0.999) * s.type.length; const k = Math.floor(x); return { ch: s.type[k], u: x - k }; }
  function keyTap(c, tp) { if (!tp || tp.ch === undefined) return null; const p = B.keyPos(tp.ch); HP.tap(c, p.x, p.y, Math.min(0.95, tp.u), { r: 16 }); return tp.u < 0.6 ? tp.ch : null; }
  // sandi acak semu untuk tiap panjang (panjang 20 = sandi contoh utama)
  function genPass(len) {
    if (len === 20) return B.PASS[0];
    const sets = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%&*"]; let s = len * 7919 + 13, out = "";
    for (let i = 0; i < len; i++) { s = (s * 9301 + 49297) % 233280; const set = sets[i % 4 === 3 ? 3 : (s % 3)]; out += set[s % set.length]; }
    return out;
  }
  const ALL = ["perpus", "email", "game", "toko", "teman", "sekolah"];
  const HOME = [{ name: "Brankas Sandi", color: V, icon: "lock" }, { name: "Browser", color: "#5B6B76", icon: "globe" }, { name: "Autentikator", color: BLUE, icon: "shield" }, { name: "Catatan", color: "#E0A23B", icon: "folder" },
    { name: "Kamera", color: "#2E7E9A", icon: "camera" }, { name: "Galeri", color: "#5FA8D3", icon: "photo" }, { name: "Obrolan", color: "#4C9BE0", icon: "chat" }, { name: "Pengaturan", color: "#5B6B76", icon: "gear" }];
  const FP_DLG = { icon: "fingerprint", iconColor: V, title: "Isi dengan Brankas Sandi?", body: "Sentuh sensor sidik jari untuk mengisi akun dito.pratama.", buttons: ["Batal"] };

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      [["lock", "membuat sandi induk yang kuat"], ["key", "membuat sandi acak tiap akun"], ["fingerprint", "memakai isi otomatis saat login"], ["shield", "memeriksa sandi lemah"]].forEach(([ic, s], i) => {
        const u = ease((l - 0.6 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 820, 84, { fill: C.bg2, r: 16 }); HP.icon(ctx, ic, 308, 322 + i * 104, 36, GREEN); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      phone(ctx, c => B.welcome(c, {}), { cx: 1400, cy: 480, h: 560 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 280, 640, 340, { fill: C.bg2, r: 22 });
      text(ctx, "E.3", 580, 370, 60, { align: "center", weight: 900, color: C.kiko }); para(ctx, "Keamanan Akun dan Jaringan Dasar", 580, 440, 34, 560, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "satu sandi, delapan pintu", 580, 580, 26, { align: "center", weight: 600, color: C.ink2 });
      text(ctx, "Yang kita kerjakan hari ini:", 1000, 320, 28, { weight: 900 });
      [["lock", "Sandi induk"], ["key", "Generator sandi acak"], ["fingerprint", "Isi otomatis"], ["warning", "Laporan sandi lemah"], ["shield", "Verifikasi dua langkah"]].forEach(([ic, s], i) => {
        const u = ease((l - 0.5 - i * 0.5) / 0.4); if (u <= 0) return; ctx.globalAlpha = u; const y = 350 + i * 62;
        ctx.fillStyle = "#E3EEFA"; ctx.beginPath(); ctx.arc(1030, y + 24, 22, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, 1030, y + 24, 24, BLUE); text(ctx, s, 1066, y + 33, 26, { weight: 800 }); ctx.globalAlpha = 1; });
      card(ctx, 360, 680, 1200, 64, { fill: "#FFF3D6", r: 14 }); text(ctx, "Password manager bawaan HP atau browser bekerja dengan cara yang mirip.", 960, 722, 26, { align: "center", weight: 800, color: C.accentDark, fit: 1160 });
    },
    konsep(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680);
      const a = b.audio || b.dur;
      // brankas
      ctx.fillStyle = "#2B3F7A"; rr(ctx, 250, 230, 500, 500, 34); ctx.fill(); ctx.fillStyle = V; rr(ctx, 280, 260, 440, 440, 24); ctx.fill();
      ctx.fillStyle = "#2B3F7A"; rr(ctx, 290, 740, 70, 26, 8); ctx.fill(); rr(ctx, 640, 740, 70, 26, 8); ctx.fill();
      const open = clamp((l - a * 0.25) / 0.6, 0, 1);
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(500, 480, 90, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) { const ang = i * Math.PI / 6 + open * Math.PI; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(500 + Math.cos(ang) * 66, 480 + Math.sin(ang) * 66, 6, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = open >= 1 ? GREEN : "#FFFFFF"; ctx.beginPath(); ctx.arc(500, 480, 36, 0, Math.PI * 2); ctx.fill();
      text(ctx, "BRANKAS SANDI", 500, 310, 30, { align: "center", weight: 900, color: "#FFFFFF" });
      // kunci = sandi induk
      const ku = ease(clamp((l - 0.4) / Math.max(1, a * 0.22), 0, 1)), kx = lerp(180, 420, ku), ky = 480;
      ctx.save(); ctx.translate(kx, ky); ctx.fillStyle = "#F2B134"; ctx.strokeStyle = "#B57A12"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(-50, 0, 34, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(-50, 0, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#F2B134"; rr(ctx, -18, -10, 96, 20, 6); ctx.fill(); ctx.stroke(); rr(ctx, 46, 8, 14, 22, 4); ctx.fill(); ctx.stroke(); rr(ctx, 64, 8, 12, 16, 4); ctx.fill(); ctx.stroke(); ctx.restore();
      if (ku > 0.2) L.callout(ctx, 200, 600, "Sandi induk: hanya di ingatanmu", null, null, { size: 26, maxW: 300 });
      // isi brankas
      text(ctx, "ISI BRANKAS", 900, 250, 28, { weight: 900, color: C.accentDark });
      [["email", "tR8#qL2!vX9m@Kp4"], ["game", "Zq3!mW7#cY2eHs6$"], ["toko", "h6$Lp9Vx!3Rt@Nb8"], ["perpus", "Ue5@k2Nw8#Qs4!Jm"]].forEach(([k, pw], i) => {
        const u = ease(clamp((l - a * (0.3 + i * 0.09)) / 0.5, 0, 1)); if (u <= 0) return; const y = 280 + i * 112, acc = B.ACC[k];
        ctx.globalAlpha = u; card(ctx, 880, y, 820, 96, { fill: C.bg2, r: 18 }); HP.appIcon(ctx, 930, y + 48, 54, acc.app.color, acc.app.letter);
        text(ctx, acc.label, 980, y + 42, 26, { weight: 800 }); text(ctx, acc.sub, 980, y + 74, 20, { weight: 600, color: C.ink2 });
        B.passText(ctx, pw, 1500, y + 60, 28); ctx.globalAlpha = 1; });
      if (after(b, l, 0.72)) { ctx.strokeStyle = GREEN; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(760, 480); ctx.lineTo(870, 480); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "Tiap akun: sandi acak yang berbeda", 1290, 760, 28, { align: "center", weight: 900, color: GREEN }); }
    },
    buka_app(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ scr: "home" }, [{ wait: 1, d: 0.5 }, { tap: [54, 250], set: { scr: "wel" }, d: 1 }, { wait: 1, d: 0.8 }, { tap: [180, 567], set: { scr: "master" }, d: 1 }, { wait: 1, d: 1.6 }], l, span);
      const draw = c => {
        if (R.st.scr === "home") HP.home(c, HOME, { hl: R.i >= 1 ? "Brankas Sandi" : null });
        else if (R.st.scr === "wel") B.welcome(c, { hl: R.i >= 3 }); else B.master(c, {});
        tapDraw(c, R);
      };
      show(ctx, draw, R.st.scr === "home" ? { u: 0, v: 190, w: 360, h: 230 } : R.st.scr === "wel" ? { u: 0, v: 130, w: 360, h: 300 } : { u: 0, v: 100, w: 360, h: 260 });
      const y = steps(ctx, "LANGKAH", ["Tap ikon Brankas Sandi.", "Tap Buat brankas baru."], stepAt(l, span, [0.3, 0.7]));
      if (R.st.scr !== "home") notes(ctx, y, [{ s: "Di HP lain: password manager bawaan HP atau browser.", fill: "#E7F1FB", color: BLUE }]);
    },
    induk_ketik(ctx, b, l) {
      const span = spanOf(b), ST = [{ tap: [180, 211], set: { kb: true }, d: 0.8 }, { type: B.PHRASE, field: "v", d: 5 }, { wait: 1, d: 0.8 }, { set: { kb: false }, d: 0.1 }, { wait: 1, d: 1.2 }];
      const R = HP.run({ v: "" }, ST, l, span), tp = typing(R, ST);
      show(ctx, c => { const pr = R.st.kb ? (tp ? (tp.u < 0.6 ? tp.ch : null) : null) : null; B.master(c, { value: R.st.v, kb: R.st.kb, press: pr }); if (R.st.kb) keyTap(c, tp); tapDraw(c, R); }, { u: 0, v: 150, w: 360, h: 200 });
      const y = steps(ctx, "LANGKAH", ["Tap kolom Sandi induk.", "Ketik frasa dari beberapa kata acak."], stepAt(l, span, [0.13, 0.8]));
      if (after(b, l, 0.82)) notes(ctx, y, [{ s: "29 karakter: sangat kuat", fill: C.goodBg, color: GREEN }]);
      card(ctx, 790, 520, 620, 290, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "FRASA YANG BAIK", 1100, 560, 24, { align: "center", weight: 900, color: C.accentDark });
      if (after(b, l, 0.35)) badge(ctx, 810, 580, true, "beberapa kata acak yang tidak berhubungan", { w: 580, h: 66, size: 22 });
      if (after(b, l, 0.55)) badge(ctx, 810, 654, true, "ada ceritanya, jadi mudah diingat", { w: 580, h: 66, size: 22 });
      if (after(b, l, 0.72)) badge(ctx, 810, 728, false, "nama, tanggal lahir, atau lirik lagu", { w: 580, h: 66, size: 22 });
    },
    induk_ulang(ctx, b, l) {
      const span = spanOf(b), tot = B.PHRASE.length;
      const R = HP.run({ n: 0, kb: false }, [{ tap: [180, 171], set: { kb: true }, d: 0.7 }, { anim: "n", d: 3 }, { set: { kb: false }, d: 0.1 }, { wait: 1, d: 0.5 }, { tap: [180, 405], set: { done: true }, d: 1 }, { wait: 1, d: 2.2 }], l, span);
      const n = R.st.n * tot, k = Math.min(tot - 1, Math.floor(n)), typingNow = R.st.kb && R.i === 1 && R.u < 1;
      show(ctx, c => { B.confirm(c, { n: R.i >= 1 ? n : 0, kb: R.st.kb, press: typingNow && n - k < 0.6 ? B.PHRASE[k] : null, hl: R.i >= 4 });
        if (typingNow) { const p = B.keyPos(B.PHRASE[k]); HP.tap(c, p.x, p.y, Math.min(0.95, n - k), { r: 16 }); }
        if (R.st.done) HP.toast(c, "Brankas sudah dibuat.", clamp((l - span * 0.62) / (span * 0.4), 0, 0.9), { y: 540 });
        tapDraw(c, R); }, { u: 0, v: 130, w: 360, h: 310 });
      const y = steps(ctx, "LANGKAH", ["Ketik ulang frasa yang sama.", "Tap Buat brankas."], stepAt(l, span, [0.55, 0.72]));
      if (after(b, l, 0.5)) notes(ctx, y, [{ s: "Lupa sandi induk: brankas tidak bisa dibuka lagi.", fill: C.badBg, color: RED }]);
    },
    induk_sidik(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ scr: "bio", fp: 0 }, [{ wait: 1, d: 0.6 }, { tap: [180, 456], set: { scr: "lock" }, d: 1 }, { wait: 1, d: 0.5 }, { anim: "fp", d: 1.6 }, { set: { scr: "vault" }, d: 0.1 }, { wait: 1, d: 1.8 }], l, span);
      const dark = R.st.scr === "lock";
      show(ctx, c => { if (R.st.scr === "bio") B.bioOffer(c, { hl: R.i >= 1 }); else if (dark) { B.locked(c, { u: R.i >= 3 ? R.st.fp : 0 }); if (R.i === 3 && R.st.fp < 1) HP.tap(c, 180, 420, 0.3, { r: 40 }); } else B.vault(c, {}); tapDraw(c, R); },
        R.st.scr === "bio" ? { u: 0, v: 130, w: 360, h: 300 } : dark ? { u: 0, v: 130, w: 360, h: 300 } : { u: 0, v: 104, w: 360, h: 300 }, { dark });
      const y = steps(ctx, "LANGKAH", ["Tap Nyalakan.", "Buka brankas dengan sidik jari."], stepAt(l, span, [0.3, 0.68]));
      if (after(b, l, 0.6)) notes(ctx, y, [{ s: "Sesekali brankas tetap meminta sandi induk.", fill: "#E7F1FB", color: BLUE }]);
    },
    tambah_akun(ctx, b, l) {
      const span = spanOf(b);
      const ST = [{ wait: 1, d: 0.4 }, { tap: B.FAB, set: { scr: "form" }, d: 1 }, { tap: [180, 163], set: { focus: "name", kb: true }, d: 0.6 }, { type: "Perpustakaan Sekolah", field: "name", d: 1.6 },
        { tap: [180, 237], set: { focus: "site" }, d: 0.6 }, { type: "perpus.sekolah.example", field: "site", d: 1.8 }, { tap: [180, 311], set: { focus: "user" }, d: 0.6 }, { type: "dito.pratama", field: "user", d: 1.2 },
        { set: { kb: false, focus: null }, d: 0.1 }, { wait: 1, d: 0.8 }];
      const R = HP.run({ scr: "vault" }, ST, l, span), tp = typing(R, ST);
      show(ctx, c => {
        if (R.st.scr === "vault") B.vault(c, { fabHl: R.i >= 1 });
        else { B.addForm(c, { name: R.st.name, site: R.st.site, user: R.st.user, focus: R.st.focus, kb: R.st.kb, press: tp && tp.u < 0.6 ? tp.ch : null }); if (R.st.kb) keyTap(c, tp); }
        tapDraw(c, R);
      }, R.st.scr === "vault" ? { u: 0, v: 470, w: 360, h: 220 } : { u: 0, v: 110, w: 360, h: 300 });
      const y = steps(ctx, "LANGKAH", ["Tap tanda tambah.", "Isi nama akun dan alamat situs.", "Isi nama pengguna."], stepAt(l, span, [0.17, 0.62, 0.9]));
      if (R.st.scr === "form") notes(ctx, y, [after(b, l, 0.45) && { s: "Alamat situs harus tepat: dipakai untuk isi otomatis.", fill: "#E7F1FB", color: BLUE }]);
    },
    generator(ctx, b, l) {
      const span = spanOf(b), base = { scr: "form", name: "Perpustakaan Sekolah", site: "perpus.sekolah.example", user: "dito.pratama" };
      const R = HP.run(base, [{ wait: 1, d: 0.3 }, { tap: [180, 454], set: { genHl: true }, d: 0.9 }, { anim: "gu", d: 0.6 }, { wait: 1, d: 0.5 }, { tap: [B.slideX(12), 455], d: 0.5 }, { anim: "sl", d: 1.4 }, { wait: 1, d: 3 }], l, span);
      const len = R.i >= 5 ? Math.round(12 + 8 * R.st.sl) : 12, gu = R.i >= 2 ? R.st.gu : 0;
      show(ctx, c => { B.addForm(c, { ...base, genHl: R.st.genHl });
        if (gu > 0) { B.gen(c, { u: gu, len, pass: genPass(len), slideHl: R.i === 4 || (R.i === 5 && R.st.sl < 1) }); if (R.i === 5 && R.st.sl < 1) HP.tap(c, B.slideX(len), 455, 0.3, { r: 18 }); }
        tapDraw(c, R); }, gu > 0.5 ? { u: 0, v: 250, w: 360, h: 225 } : { u: 0, v: 340, w: 360, h: 160 });
      const y = steps(ctx, "LANGKAH", ["Tap Buat sandi acak.", "Geser panjang ke 20 karakter.", "Biarkan angka dan simbol menyala."], stepAt(l, span, [0.2, 0.55, 0.75]));
      if (after(b, l, 0.6)) { card(ctx, 790, 560, 620, 240, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
        [["Aa", "huruf besar dan kecil", C.ink], ["0–9", "angka", "#1A56B8"], ["!@#", "simbol", RED]].forEach(([k, s, col], i) => { const yy = 618 + i * 64;
          if (!after(b, l, 0.6 + i * 0.07)) return; text(ctx, k, 880, yy, 34, { align: "center", weight: 900, color: col }); text(ctx, s, 960, yy - 2, 28, { weight: 800 }); }); }
      if (after(b, l, 0.82)) notes(ctx, y, [{ s: "Tidak perlu dihafal: brankas yang mengingatnya.", fill: C.goodBg, color: GREEN }]);
    },
    simpan_akun(ctx, b, l) {
      const span = spanOf(b), base = { name: "Perpustakaan Sekolah", site: "perpus.sekolah.example", user: "dito.pratama" };
      const R = HP.run({ scr: "gen" }, [{ wait: 1, d: 0.4 }, { tap: [255, 698], set: { useHl: true }, d: 0.9 }, { set: { scr: "form" }, d: 0.1 }, { wait: 1, d: 0.5 }, { tap: B.SAVE, set: { saveHl: true }, d: 0.9 },
        { set: { scr: "vault" }, d: 0.1 }, { anim: "toast", d: 1.5 }, { set: { scr: "signup" }, d: 0.1 }, { wait: 1, d: 3 }], l, span);
      const scr = R.st.scr;
      show(ctx, c => {
        if (scr === "gen") { B.addForm(c, base); B.gen(c, { len: 20, useHl: R.i >= 1 }); }
        else if (scr === "form") B.addForm(c, { ...base, pass: B.PASS[0], saveHl: R.i >= 4 });
        else if (scr === "vault") { B.vault(c, { items: ["perpus"], hl: "perpus" }); HP.toast(c, "Akun disimpan di brankas.", R.st.toast || 0, { y: 540 }); }
        else B.login(c, { url: "perpus.sekolah.example/daftar", title: "Daftar akun", user: "dito.pratama", pass: B.PASS[0], filled: true, btnLabel: "Daftar" });
        tapDraw(c, R);
      }, scr === "gen" ? { u: 0, v: 560, w: 360, h: 180 } : scr === "form" ? { u: 0, v: 40, w: 360, h: 380 } : scr === "vault" ? { u: 0, v: 104, w: 360, h: 200 } : { u: 0, v: 180, w: 360, h: 260 }, { mw: scr === "form" ? 440 : MAG.w });
      const y = steps(ctx, "LANGKAH", ["Tap Pakai sandi ini.", "Tap Simpan.", "Saat mendaftar, isi sandi dari brankas."], stepAt(l, span, [0.17, 0.4, 0.62]));
      if (scr === "signup") notes(ctx, y, [{ s: "Sandi tidak diketik sendiri: diisi dari brankas.", fill: C.goodBg, color: GREEN }]);
    },
    isi_otomatis(ctx, b, l) {
      const span = spanOf(b), dl = measure(m => HP.dialog(m, FP_DLG)).box;
      const R = HP.run({ focus: null }, [{ wait: 1, d: 0.5 }, { tap: [180, 257], set: { focus: "user", kb: true }, d: 1 }, { wait: 1, d: 0.6 }, { tap: [180, 426], set: { sugHl: true }, d: 0.9 }, { set: { dlg: true, kb: false }, d: 0.1 },
        { anim: "fp", d: 1.6 }, { set: { dlg: false, filled: true, focus: null }, d: 0.1 }, { wait: 1, d: 0.9 }, { tap: [180, 404], set: { hlBtn: true }, d: 0.8 }, { set: { welcome: true }, d: 0.1 }, { wait: 1, d: 1 }], l, span);
      const st = R.st;
      const draw = c => {
        B.login(c, { focus: st.focus, kb: st.kb, suggest: { text: "dito.pratama", sub: "Brankas Sandi · perpus.sekolah.example" }, sugHl: st.sugHl && st.kb, user: st.filled ? "dito.pratama" : "", pass: st.filled ? B.PASS[0] : "", filled: st.filled, hlBtn: st.hlBtn, welcome: st.welcome });
        if (st.dlg) { HP.dialog(c, FP_DLG); const cy = dl.y + 30 + 18; if (st.fp < 1) HP.tap(c, 180, cy, 0.3, { r: 28 }); }
        tapDraw(c, R);
      };
      show(ctx, draw, st.dlg ? { u: 0, v: dl.y - 10, w: 360, h: dl.h + 20 } : st.welcome ? { u: 0, v: 98, w: 360, h: 300 } : { u: 0, v: 200, w: 360, h: 260 });
      const y = steps(ctx, "LANGKAH", ["Tap kolom Nama pengguna.", "Tap saran Brankas Sandi.", "Sentuh sensor sidik jari."], stepAt(l, span, [0.2, 0.37, 0.6]));
      if (st.filled) notes(ctx, y, [{ s: "Nama pengguna dan sandi terisi sendiri.", fill: C.goodBg, color: GREEN }]);
    },
    situs_palsu(ctx, b, l) {
      const mk = after(b, l, 0.25);
      const draw = c => { B.login(c, { url: "perpus-sekolah.example/login", focus: "user", kb: true, bad: mk, mark: mk ? [6, 7] : null,
        suggest: { text: "Tidak ada sandi untuk situs ini", sub: "perpus-sekolah.example", warn: true, icon: "warning" } }); };
      const ph = phone(ctx, draw);
      HP.magnify(ctx, ph, draw, { u: 0, v: 40, w: 360, h: 56 }, { x: 790, y: 150, w: 620 });
      HP.magnify(ctx, ph, draw, { u: 0, v: 398, w: 360, h: 56 }, { x: 790, y: 280, w: 620 });
      if (after(b, l, 0.35)) { card(ctx, 790, 420, 1030, 390, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
        text(ctx, "TERSIMPAN DI BRANKAS", 830, 474, 24, { weight: 900, color: C.ink2 });
        ctx.fillStyle = C.goodBg; rr(ctx, 820, 492, 970, 80, 14); ctx.fill(); HP.icon(ctx, "check", 864, 532, 30, GREEN); text(ctx, "perpus.sekolah.example", 904, 546, 38, { weight: 900 });
        if (after(b, l, 0.5)) { text(ctx, "HALAMAN INI", 830, 628, 24, { weight: 900, color: C.ink2 });
          ctx.fillStyle = C.badBg; rr(ctx, 820, 646, 970, 80, 14); ctx.fill(); HP.icon(ctx, "close", 864, 686, 28, RED);
          ctx.font = "900 38px Inter"; const a = ctx.measureText("perpus").width, w1 = ctx.measureText("-").width; ctx.fillStyle = "rgba(242,177,52,0.6)"; rr(ctx, 904 + a - 3, 662, w1 + 6, 48, 6); ctx.fill();
          text(ctx, "perpus-sekolah.example", 904, 700, 38, { weight: 900, color: RED }); }
        if (after(b, l, 0.68)) text(ctx, "Alamat berbeda, jadi brankas tidak mengisi sandi.", 1305, 778, 28, { align: "center", weight: 900, color: C.kikoDark, fit: 960 }); }
      else L.callout(ctx, 1450, 180, "Situs dari link di pesan", null, null, { size: 24, maxW: 330 });
    },
    laporan(ctx, b, l) {
      const span = spanOf(b);
      const R = HP.run({ scr: "vault", sc: 0 }, [{ wait: 1, d: 1.2 }, { tap: B.TAB.Periksa, set: { scr: "rep" }, d: 1 }, { anim: "sc", d: 1.4 }, { wait: 1, d: 3 }], l, span);
      const hl = after(b, l, 0.78) ? "weak" : after(b, l, 0.6) ? "reuse" : null;
      show(ctx, c => { if (R.st.scr === "vault") B.vault(c, { items: ALL, tabHl: R.i >= 1 ? "Periksa" : null }); else B.report(c, { score: 45 * ease(R.st.sc), hl }); tapDraw(c, R); },
        R.st.scr === "vault" ? { u: 0, v: 104, w: 360, h: 300 } : { u: 0, v: 120, w: 360, h: 430 }, { mw: R.st.scr === "vault" ? MAG.w : 480, mx: R.st.scr === "vault" ? MAG.x : 860 });
      const y = steps(ctx, "LANGKAH", ["Tap Periksa di bawah.", "Baca skor dan daftarnya."], stepAt(l, span, [0.4, 1]));
      if (R.st.scr === "rep") notes(ctx, y, [after(b, l, 0.6) && { s: "Dipakai ulang: 4 akun", fill: C.badBg, color: RED }, after(b, l, 0.78) && { s: "Lemah: 2 sandi", fill: "#FFF3D6", color: ORANGE }]);
    },
    laporan_ganti(ctx, b, l) {
      const span = spanOf(b), rr0 = measure(m => B.report(m, {})).rows, ru = measure(m => B.reused(m, {})), dlg = measure(m => B.change(m, { dialog: 1 })).dlg;
      const R = HP.run({ scr: "rep" }, [{ wait: 1, d: 0.3 }, { tap: tapRow(rr0, 0), set: { scr: "reused" }, d: 1 }, { wait: 1, d: 0.3 }, { tap: [ru.btns.game.x, ru.btns.game.y], set: { scr: "change" }, d: 1 }, { wait: 1, d: 0.3 },
        { tap: [180, 377], set: { np: true }, d: 1 }, { tap: [180, 444], set: { dialog: 1 }, d: 0.9 }, { wait: 1, d: 0.3 }, { tap: [dlg.buttons[1].cx, dlg.buttons[1].cy], set: { scr: "reused2" }, d: 0.9 }, { anim: "toast", d: 1.8 }], l, span);
      const st = R.st;
      show(ctx, c => {
        if (st.scr === "rep") B.report(c, { hl: R.i >= 1 ? "reuse" : null });
        else if (st.scr === "reused") B.reused(c, { hl: R.i >= 3 ? "game" : null, btnHl: R.i >= 3 ? "game" : null });
        else if (st.scr === "change") B.change(c, { newPass: st.np, chipHl: R.i === 5, saveHl: R.i >= 6, dialog: st.dialog, updHl: R.i >= 8 });
        else { B.reused(c, { items: ["email", "toko", "teman"], hl: "email" }); HP.toast(c, "Sandi Game Seru diperbarui.", st.toast || 0, { y: 560 }); }
        tapDraw(c, R);
      }, st.scr === "rep" ? { u: 0, v: 280, w: 360, h: 270 } : st.scr === "change" ? (st.dialog ? { u: 0, v: measure(m => B.change(m, { dialog: 1 })).dlg.box.y - 10, w: 360, h: dlg.box.h + 20 } : { u: 0, v: 180, w: 360, h: 300 }) : { u: 0, v: 120, w: 360, h: 340 });
      const y = steps(ctx, "LANGKAH", ["Tap Dipakai ulang.", "Tap Ganti di Game Seru.", "Pakai sandi kuat, lalu Simpan.", "Tap Perbarui di brankas."], stepAt(l, span, [0.15, 0.33, 0.58, 0.75]));
      if (st.scr === "reused2") notes(ctx, y, [{ s: "Ulangi untuk akun lain. Mulai dari email.", fill: C.goodBg, color: GREEN }]);
    },
    dua_langkah(ctx, b, l) {
      const span = spanOf(b), sr = rowsOf(B.SET_ITEMS(), { y: 112 });
      const R = HP.run({ scr: "vault" }, [{ wait: 1, d: 0.3 }, { tap: B.TAB.Pengaturan, set: { scr: "set" }, d: 1 }, { wait: 1, d: 0.4 }, { tap: tapRow(sr, 3), set: { scr: "intro" }, d: 1 }, { wait: 1, d: 0.4 }, { tap: [180, 446], set: { scr: "qr" }, d: 1 }, { wait: 1, d: 2.4 }], l, span);
      const st = R.st;
      const draw = c => {
        if (st.scr === "vault") B.vault(c, { items: ALL, tabHl: R.i >= 1 ? "Pengaturan" : null });
        else if (st.scr === "set") B.settings(c, { hl: R.i >= 3 ? 3 : null });
        else if (st.scr === "intro") B.tfaIntro(c, { hl: R.i >= 5 }); else B.tfaQR(c, {});
        tapDraw(c, R);
      };
      if (st.scr === "qr") {
        phone(ctx, draw);
        // HP kedua: aplikasi autentikator memindai kode QR
        const sc = clamp((l - span * 0.78) / (span * 0.2), 0, 1);
        HP.phone(ctx, 1110, 470, { h: 600, dark: true }, c => { HP.scanner(c, { found: sc >= 1, hint: sc >= 1 ? "Akun ditambahkan" : "Arahkan ke kode QR", inner: (cc, box) => HP.qr(cc, box.x + 20, box.y + 20, box.w - 40, 12) }); });
        text(ctx, "HP dengan aplikasi autentikator", 1110, 112, 22, { align: "center", weight: 800, color: C.ink2 });
      } else show(ctx, draw, st.scr === "vault" ? { u: 0, v: 560, w: 360, h: 160 } : st.scr === "set" ? { u: 0, v: 104, w: 360, h: 330 } : { u: 0, v: 130, w: 360, h: 360 }, { mw: st.scr === "vault" ? MAG.w : 520, mx: st.scr === "vault" ? MAG.x : 840 });
      const y = steps(ctx, "LANGKAH", ["Tap Pengaturan.", "Tap Verifikasi dua langkah.", "Tap Mulai, lalu pindai kode QR."], stepAt(l, span, [0.2, 0.45, 0.75]));
      if (st.scr === "qr") notes(ctx, y, [{ s: "Cara memindai kode QR ada di simulasi S11.", fill: "#E7F1FB", color: BLUE }]);
    },
    dua_langkah_kode(ctx, b, l) {
      const span = spanOf(b), ok = HP.numpadKey("✓"), bk = measure(m => B.backup(m, { tick: true }));
      const R = HP.run({ scr: "code", code: "" }, [{ wait: 1, d: 0.3 }, { numpad: "482913", field: "code", d: 3 }, { tap: [ok.x, ok.y], set: { scr: "backup" }, d: 0.9 }, { wait: 1, d: 1.6 }, { tap: [bk.tick.x, bk.tick.y], set: { tick: true }, d: 0.8 },
        { tap: [bk.btn.cx, bk.btn.cy], set: { scr: "set" }, d: 0.9 }, { wait: 1, d: 1.6 }], l, span);
      const st = R.st;
      const draw = c => {
        if (st.scr === "code") B.tfaCode(c, { code: st.code, press: st.press, pressU: st.pressU });
        else if (st.scr === "backup") B.backup(c, { tick: st.tick, hl: R.i >= 5 }); else B.settings(c, { tfa: true, hl: 3 });
        tapDraw(c, R);
      };
      if (st.scr === "code") {
        phone(ctx, draw);
        HP.phone(ctx, 1110, 470, { h: 600 }, c => HP.auth(c, { accounts: [{ issuer: "Brankas Sandi", user: "dito.pratama", code: "482913", secs: HP.totp(l + 9).secs, hl: true }] }));
        text(ctx, "Aplikasi autentikator", 1110, 112, 22, { align: "center", weight: 800, color: C.ink2 });
      } else show(ctx, draw, st.scr === "backup" ? { u: 0, v: 120, w: 360, h: 380 } : { u: 0, v: 104, w: 360, h: 330 }, { mw: 500, mx: 860 });
      const y = steps(ctx, "LANGKAH", ["Ketik kode dari autentikator.", "Tulis kode cadangan di kertas.", "Centang, lalu tap Selesai."], stepAt(l, span, [0.4, 0.62, 0.8]));
      if (st.scr === "set") notes(ctx, y, [{ s: "Verifikasi dua langkah: Aktif", fill: C.goodBg, color: GREEN }]);
      else if (st.scr === "backup") notes(ctx, y, [{ s: "Simpan kertasnya di tempat aman di rumah.", fill: "#E7F1FB", color: BLUE }]);
    },
    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(320, 270, 64, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 292, 238, 18, 64, 6); ctx.fill(); rr(ctx, 330, 238, 18, 64, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 430, 258, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan bersama orang tua, lalu putar lagi.", 430, 304, 28, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 360 + i * 88, 930, 74, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 409 + i * 88, 32, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 408 + i * 88, 27, { weight: 700, fit: 820 }); });
      phone(ctx, c => B.vault(c, { items: ALL }), { cx: 1460, cy: 500, h: 560 });
    },
    periksa(ctx, b, l) {
      phone(ctx, c => B.report(c, { score: 92, reuse: 0, weak: 0, strong: 6 }));
      const items = [["Sandi induk", "frasa panjang"], ["Sandi tiap akun", "acak dan berbeda"], ["Dipakai ulang", "0 akun"], ["Dua langkah brankas", "aktif"]];
      card(ctx, 900, 122, 920, 120 + items.length * 108, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
      text(ctx, "PERIKSA HASILMU", 1360, 172, 26, { align: "center", weight: 900, color: C.accentDark });
      const a = b.audio || b.dur;
      items.forEach(([k, v], i) => { const on = l > a * (0.2 + i * 0.18); const y = 196 + i * 100;
        ctx.fillStyle = on ? C.goodBg : "#F4F6F5"; rr(ctx, 925, y, 870, 86, 12); ctx.fill();
        text(ctx, k, 950, y + 54, 28, { weight: 800 }); text(ctx, v + (on ? " ✓" : ""), 1770, y + 54, 28, { align: "right", weight: 900, color: on ? GREEN : C.ink2 }); });
    },
    salah_induk(ctx, b, l) {
      card(ctx, 900, 140, 880, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 1: SANDI INDUK PENDEK ATAU DICATAT", 1340, 200, 26, { align: "center", weight: 900, color: RED, fit: 840 });
      const draw = c => B.notesApp(c, { hl: after(b, l, 0.2) });
      const ph = phone(ctx, draw);
      if (after(b, l, 0.12)) badge(ctx, 930, 240, false, "dito123: hanya tujuh karakter, mudah ditebak.", { w: 820, h: 90, size: 26 });
      if (after(b, l, 0.42)) badge(ctx, 930, 344, false, "Tercatat di HP: orang yang memegang HP-mu bisa membacanya.", { w: 820, h: 90, size: 26 });
      if (after(b, l, 0.72)) badge(ctx, 930, 448, true, "Frasa panjang yang hanya ada di ingatanmu.", { w: 820, h: 90, size: 26 });
      if (after(b, l, 0.2)) HP.magnify(ctx, ph, draw, { u: 0, v: 192, w: 360, h: 52 }, { x: 1010, y: 580, w: 660 });
    },
    salah_ulang(ctx, b, l) {
      card(ctx, 140, 140, 1640, 680, { fill: "#FFFFFF", r: 22 });
      text(ctx, "KESALAHAN 2: SATU SANDI UNTUK BANYAK AKUN", 960, 204, 30, { align: "center", weight: 900, color: RED });
      const a = b.audio || b.dur, keys = ["game", "email", "toko", "teman"];
      ctx.fillStyle = "#FFF3D6"; rr(ctx, 220, 430, 300, 100, 20); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, 220, 430, 300, 100, 20); ctx.stroke();
      HP.icon(ctx, "key", 270, 480, 40, "#B57A12"); text(ctx, "dito123", 400, 494, 40, { align: "center", weight: 900 });
      keys.forEach((k, i) => {
        const y = 250 + i * 135, acc = B.ACC[k], open = i === 0 ? after(b, l, 0.15) : after(b, l, 0.25 + i * 0.1);
        ctx.strokeStyle = open ? RED : "#C9D4DB"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(520, 480); ctx.lineTo(700, y + 55); ctx.stroke();
        ctx.fillStyle = open ? C.badBg : "#F4F6F5"; rr(ctx, 700, y, 520, 110, 18); ctx.fill();
        HP.appIcon(ctx, 755, y + 55, 60, acc.app.color, acc.app.letter); text(ctx, acc.label, 805, y + 52, 30, { weight: 800 }); text(ctx, acc.sub, 805, y + 86, 22, { weight: 600, color: C.ink2 });
        if (open) { HP.icon(ctx, i === 0 ? "warning" : "lock", 1170, y + 55, 34, RED); text(ctx, i === 0 ? "BOCOR" : "terbuka", 1120, y + 66, 24, { align: "right", weight: 900, color: RED }); }
      });
      if (after(b, l, 0.72)) { card(ctx, 1280, 300, 460, 380, { fill: C.goodBg, r: 20 });
        text(ctx, "YANG BENAR", 1510, 352, 28, { align: "center", weight: 900, color: GREEN });
        para(ctx, "Tiap akun punya sandi acak sendiri dari generator.", 1510, 410, 30, 400, { align: "center", weight: 800, lh: 1.25 });
        B.passText(ctx, "Zq3!mW7#cY2e", 1510, 600, 30); text(ctx, "≠", 1510, 646, 30, { align: "center", weight: 900, color: C.ink2 }); }
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 300, 290, 640, 400, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan E.3", 620, 360, 34, { align: "center", weight: 900 });
      text(ctx, "Latihan 2: Audit akun fiktif", 620, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 360, 450, 520, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/e3", 620, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      text(ctx, "temukan lima masalahnya", 620, 600, 26, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 1000, 290, 620, 400, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1310, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Bersama orang tua, buka laporan sandi di password manager HP keluarga, lalu ganti satu sandi yang dipakai ulang.", 1310, 420, 28, 540, { align: "center", weight: 700, lh: 1.3 });
      kiko(ctx, 1650, 720, 100, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
