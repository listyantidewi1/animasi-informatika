/* K09 Simulasi konsep: melacak perulangan SELAMA di papan memori. Kode di kiri atas (panah baris), papan memori (memori.js D9.1)
   di kiri bawah, tabel jejak (trace table) di kanan. Program:
     hitung ← a · total ← 0 · SELAMA hitung ≤ b: · total ← total + hitung · hitung ← hitung + 1 · TULIS total
   Variasi bug menghapus baris penambah hitung; dihentikan setelah 4 putaran. Nilai dicek dengan simulasi python. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, M = K.memori, L = K.layar;
  const { rr, text, wrap, para, card, kiko, ease, clamp, lerp } = H;

  const VARS = [
    { a: 1, b: 3, inc: true, name: "program awal" },
    { a: 2, b: 3, inc: true, name: "nilai awal 2" },
    { a: 1, b: 5, inc: true, name: "batas 5" },
    { a: 5, b: 3, inc: true, name: "hitung mulai 5" },
    { a: 1, b: 3, inc: false, name: "bug: tanpa penambah" }
  ];
  const MAXPUT = 4;
  function lines(v) {
    const L0 = [{ t: `hitung ← ${v.a}` }, { t: "total ← 0" }, { t: `SELAMA hitung ≤ ${v.b}:` }, { t: "total ← total + hitung", ind: 1 }];
    if (v.inc) L0.push({ t: "hitung ← hitung + 1", ind: 1 });
    L0.push({ t: "TULIS total" });
    return L0;
  }
  // jejak langkah: {ln, h, t, cond, row(aksi tabel), out, stop}
  function trace(v) {
    const S = [], lnW = v.inc ? 5 : 4; let h = v.a, t = 0, put = 0;
    S.push({ ln: 0, h, t: null, row: null, ch: "h" });
    S.push({ ln: 1, h, t, row: { add: { p: "awal", c: "", t: 0, h } }, ch: "t" });
    while (true) {
      const ok = h <= v.b;
      S.push({ ln: 2, h, t, cond: { txt: `${h} ≤ ${v.b}?`, ok }, row: { add: ok ? { p: String(put + 1), c: `${h} ≤ ${v.b} ya`, t: "", h: "" } : { p: "cek", c: `${h} ≤ ${v.b} tidak → berhenti`, t: "", h: "", end: true } } });
      if (!ok) break;
      put++; t += h; S.push({ ln: 3, h, t, row: { set: { t } }, ch: "t" });
      if (v.inc) { h += 1; S.push({ ln: 4, h, t, row: { set: { h } }, ch: "h" }); }
      else S[S.length - 1].row.set.h = h;
      if (!v.inc && put >= MAXPUT) { S.push({ ln: 2, h, t, stop: true, row: { add: { p: "…", c: "berputar terus", t: "", h: "", bug: true } } }); return S; }
    }
    S.push({ ln: lnW, h, t, out: t });
    return S;
  }
  const TR = VARS.map(trace);
  // keadaan sesudah langkah k (k = -1: belum ada langkah)
  function stateAt(v, k) {
    const S = TR[VARS.indexOf(v)], rows = []; let cur = { h: null, t: null, ln: -1 };
    for (let i = 0; i <= k && i < S.length; i++) {
      const s = S[i]; cur = { ...s };
      if (s.row && s.row.add) rows.push({ ...s.row.add });
      if (s.row && s.row.set) Object.assign(rows[rows.length - 1], s.row.set);
    }
    return { cur, rows, step: S[k] };
  }
  const PUTARAN = v => TR[VARS.indexOf(v)].filter(s => s.ln === 3).length;
  const CEK = v => TR[VARS.indexOf(v)].filter(s => s.cond).length;

  // ---------- gambar ----------
  const CX = 110, CY = 125, CW = 660, RH = 62;
  function code(ctx, v, ln, opt = {}) {
    const Ls = lines(v), h = 64 + RH * Ls.length + (opt.ghost ? RH : 0);
    card(ctx, CX, CY, CW, h, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 16 });
    text(ctx, "PSEUDOCODE", CX + 22, CY + 40, 22, { weight: 900, color: C.ink2 });
    let k = 0;
    const row = (i, ln0, ghost) => {
      const y = CY + 60 + k * RH; k++;
      if (ghost && opt.fix) {   // perbaikan: baris penambah ditulis lagi
        ctx.fillStyle = C.goodBg; rr(ctx, CX + 10, y + 4, CW - 20, RH - 8, 10); ctx.fill();
        text(ctx, "+", CX + 64, y + RH / 2 + 11, 30, { align: "center", weight: 900, color: C.good });
        text(ctx, "hitung ← hitung + 1", CX + 92 + 44, y + RH / 2 + 11, 30, { weight: 800, color: C.good });
        text(ctx, "perbaikan", CX + CW - 26, y + RH / 2 + 9, 22, { align: "right", weight: 900, color: C.good });
        return;
      }
      if (ghost) {
        ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = C.bad; ctx.lineWidth = 3; rr(ctx, CX + 70, y + 6, CW - 90, RH - 12, 10); ctx.stroke(); ctx.restore();
        text(ctx, "(baris penambah hitung hilang)", CX + 70 + (CW - 90) / 2, y + RH / 2 + 9, 24, { align: "center", weight: 800, color: C.bad });
        return;
      }
      const on = i === ln;
      if (on) { ctx.fillStyle = opt.stop ? C.badBg : "#FFF3D6"; rr(ctx, CX + 10, y + 4, CW - 20, RH - 8, 10); ctx.fill(); }
      text(ctx, String(i + 1), CX + 64, y + RH / 2 + 10, 24, { align: "center", weight: 900, color: C.ink2 });
      let x = CX + 92 + (ln0.ind || 0) * 44;
      ln0.t.split(/(SELAMA|TULIS)/).forEach(p => { if (!p) return; const kw = p === "SELAMA" || p === "TULIS"; text(ctx, p, x, y + RH / 2 + 11, 30, { weight: kw ? 900 : 700, color: kw ? C.kiko : C.ink }); ctx.font = `${kw ? 900 : 700} 30px Inter`; x += ctx.measureText(p).width; });
      if (on) arrow(ctx, CX + 26, y + RH / 2, opt.stop ? C.bad : C.accent);
    };
    Ls.forEach((ln0, i) => { if (opt.ghost && i === 4) row(-1, null, true); row(i, ln0, false); });
    return CY + h;
  }
  function arrow(ctx, x, y, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 14, y - 16); ctx.lineTo(x + 14, y); ctx.lineTo(x - 14, y + 16); ctx.closePath(); ctx.fill(); }
  function memory(ctx, st, prev, out, opt = {}) {
    const y = opt.y || 577;
    M.board(ctx, CX, y, CW, [
      { name: "hitung", value: st.h, changed: prev && st.h !== prev.h && st.h != null, old: prev && prev.h != null && st.h !== prev.h ? prev.h : undefined },
      { name: "total", value: st.t, changed: prev && st.t !== prev.t && st.t != null, old: prev && prev.t != null && st.t !== prev.t ? prev.t : undefined }], { bw: 190, bh: 112, h: 190 });
    // layar output
    const ox = CX + 20 + 2 * 214, oy = y + 56;
    ctx.fillStyle = "#0E161C"; rr(ctx, ox, oy, 190, 112, 12); ctx.fill(); ctx.strokeStyle = "#4A5A66"; ctx.lineWidth = 2; rr(ctx, ox, oy, 190, 112, 12); ctx.stroke();
    text(ctx, "OUTPUT", ox + 95, oy + 26, 18, { align: "center", weight: 900, color: "#8FD0E6" });
    text(ctx, out != null ? String(out) : "_", ox + 95, oy + 86, out != null ? 44 : 32, { align: "center", weight: 900, color: out != null ? "#BFF2CF" : "#7E9AA8" });
  }
  const TX = 800, TY = 125, TWD = 1020, COLS = [0, 150, 560, 790], RW = 60;
  function table(ctx, rows, opt = {}) {
    const n = Math.max(rows.length, opt.minRows || 5), h = opt.h || 675;
    card(ctx, TX, TY, TWD, h, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 });
    text(ctx, "TABEL JEJAK", TX + 28, TY + 44, 24, { weight: 900, color: C.accentDark }); text(ctx, "(trace table)", TX + 200, TY + 44, 22, { weight: 700, color: C.ink2 });
    const hy = TY + 70;
    ctx.fillStyle = C.bg2; rr(ctx, TX + 16, hy, TWD - 32, 50, 10); ctx.fill();
    ["putaran", "cek kondisi", "total", "hitung"].forEach((s, i) => text(ctx, s, TX + 36 + COLS[i], hy + 34, 24, { weight: 900, color: C.ink2 }));
    rows.forEach((r, i) => {
      const y = hy + 58 + i * RW, last = i === rows.length - 1 && opt.hlLast;
      ctx.fillStyle = r.bug ? C.badBg : last ? "#FFF3D6" : (i % 2 ? "#F7FAF8" : "#FFFFFF"); rr(ctx, TX + 16, y, TWD - 32, RW - 6, 10); ctx.fill();
      text(ctx, r.p, TX + 36 + COLS[0], y + 38, 28, { weight: 900, color: r.bug ? C.bad : C.ink });
      const cc = /tidak|terus/.test(r.c) ? C.bad : C.good;
      text(ctx, r.c, TX + 36 + COLS[1], y + 38, 28, { weight: 800, color: cc });
      if (r.t !== "") text(ctx, String(r.t), TX + 36 + COLS[2] + 40, y + 38, 30, { align: "center", weight: 900 });
      if (r.h !== "") text(ctx, String(r.h), TX + 36 + COLS[3] + 44, y + 38, 30, { align: "center", weight: 900 });
    });
    return hy + 58 + rows.length * RW;
  }
  function condChip(ctx, cond, u) {   // hasil cek kondisi, di ujung kanan baris SELAMA
    if (!cond) return; ctx.save(); ctx.globalAlpha = u; const y = CY + 60 + 2 * RH + 5;
    card(ctx, CX + 418, y, 228, RH - 10, { fill: cond.ok ? C.goodBg : C.badBg, stroke: cond.ok ? C.good : C.bad, lw: 3, r: 12 });
    text(ctx, `${cond.txt} ${cond.ok ? "ya" : "tidak"}`, CX + 532, y + 36, 25, { align: "center", weight: 900, color: cond.ok ? C.good : C.bad });
    ctx.restore();
  }
  function tagVar(ctx, v, label) { // label variasi di bawah tabel
    card(ctx, TX + 20, 720, TWD - 40, 64, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 });
    text(ctx, label || `hitung mulai ${v.a} · batas ${v.b}${v.inc ? "" : " · tanpa penambah"}`, TX + TWD / 2, 762, 28, { align: "center", weight: 900 });
  }
  // langkah aktif pada waktu l: b.steps [dari, sampai), b.span [t0, t1] pecahan b.audio
  function stepAt(b, l) {
    const a = b.audio || b.dur, [s0, s1] = b.steps, [f0, f1] = b.span || [0.05, 0.9];
    const n = s1 - s0, t0 = f0 * a, dt = (f1 - f0) * a / n;
    if (b.ts) {   // waktu mulai tiap langkah (pecahan b.audio), disesuaikan dengan narasi
      const T = b.ts.map(f => f * a); let k = s0 - 1; T.forEach((t, i) => { if (l >= t) k = s0 + i; });
      return { k, since: k < s0 ? 99 : l - T[k - s0] };
    }
    const k = l < t0 ? s0 - 1 : Math.min(s1 - 1, s0 + Math.floor((l - t0) / dt));
    const since = l < t0 ? 99 : (l - t0) - (k - s0) * dt;
    return { k, since };
  }

  Object.assign(K.SCENES, {
    k9_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 650);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["melacak perulangan baris demi baris", "mengisi tabel jejak", "menebak hasil akhir", "menemukan perulangan yang berputar terus"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 880, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      M.board(ctx, 1220, 300, 460, [{ name: "hitung", value: 1 + Math.floor((l * 0.8) % 3) }, { name: "total", value: [1, 3, 6][Math.floor((l * 0.8) % 3)] }], { bw: 200, bh: 120, h: 200 });
      text(ctx, "SELAMA … diulang", 1450, 580, 30, { align: "center", weight: 900, color: C.kiko });
    },
    k9_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 650);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 420, 290, 1080, 330, { fill: C.bg2, r: 22 });
      text(ctx, "D9.1", 960, 370, 60, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Pseudocode Lengkap: Perulangan dan Data", 960, 440, 40, { align: "center", weight: 800 });
      [["x ← 5", "diberi"], ["SELAMA kondisi:", "diulang selama ya"]].forEach(([s, t], i) => { const x = 600 + i * 420; card(ctx, x - 180, 490, 360, 90, { fill: "#FFFFFF", r: 14 }); text(ctx, s, x, 532, 30, { align: "center", weight: 900, color: i ? C.kiko : C.ink }); text(ctx, t, x, 566, 20, { align: "center", weight: 700, color: C.ink2 }); });
      kiko(ctx, 1640, 690, 110, 0, { wave: l });
    },
    k9_kenal(ctx, b, l) {
      const v = VARS[0], a = b.audio || b.dur;
      const ln = l < a * 0.3 ? 0 : l < a * 0.42 ? 1 : l < a * 0.58 ? 2 : l < a * 0.85 ? 3 : 5;
      code(ctx, v, ln === 3 ? -1 : ln);
      if (ln === 3) { // kurung badan perulangan
        ctx.fillStyle = "rgba(242,177,52,0.22)"; rr(ctx, CX + 10, CY + 60 + 3 * RH + 4, CW - 20, 2 * RH - 8, 10); ctx.fill();
        ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(CX + 112, CY + 60 + 3 * RH + 8); ctx.lineTo(CX + 112, CY + 60 + 5 * RH - 8); ctx.stroke();
      }
      memory(ctx, { h: null, t: null }, null, null);
      card(ctx, TX, TY, TWD, 675, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 });
      const notes = [["hitung", "penghitung putaran, mulai 1", 0.12], ["total", "tempat menjumlah, mulai 0", 0.3], ["SELAMA hitung ≤ 3", "diulang selama jawabannya ya", 0.45], ["badan perulangan", "dua baris yang menjorok", 0.6], ["TULIS total", "hasil akhir ke layar", 0.85]];
      notes.forEach(([k, s, f], i) => { if (l < a * f) return; const e = ease((l - a * f) / 0.4); ctx.save(); ctx.globalAlpha = e; const y = 160 + i * 124; card(ctx, TX + 30, y, TWD - 60, 104, { fill: C.bg2, r: 16 }); text(ctx, k, TX + 60, y + 44, 30, { weight: 900, color: k.startsWith("SELAMA") || k.startsWith("TULIS") ? C.kiko : C.ink }); text(ctx, s, TX + 60, y + 84, 26, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    k9_alat(ctx, b, l) {
      const v = VARS[0], a = b.audio || b.dur;
      const S = stateAt(v, 3);   // contoh: sesudah baris 4 putaran pertama
      code(ctx, v, 3);
      memory(ctx, S.cur, stateAt(v, 2).cur, null);
      table(ctx, S.rows, {});
      const marks = [[0.12, CX + 30, CY + 60 + 4 * RH - 2, "panah = baris yang sedang dijalankan", 880, 405], [0.4, CX + 250, 590, "papan memori = isi setiap variabel", 880, 600], [0.62, TX + 420, 312, "tabel jejak: catatan tiap putaran", 1330, 470]];
      marks.forEach(([f, tx, ty, s, x, y]) => { if (l < a * f) return; const e = ease((l - a * f) / 0.4); ctx.save(); ctx.globalAlpha = e; L.callout(ctx, x, y, s, tx, ty, { maxW: 520, size: 24 }); ctx.restore(); });
    },
    k9_tanya(ctx, b, l) { tanya(ctx, b, l, false); },
    k9_tebak(ctx, b, l) { tanya(ctx, b, l, true); },
    k9_jalan(ctx, b, l) {
      const v = VARS[b.v], { k, since } = stepAt(b, l);
      const S = stateAt(v, k), P = stateAt(v, k - 1), fresh = since < 0.9;
      const step = S.step || {};
      code(ctx, v, step.stop ? 2 : (k >= 0 ? step.ln : -1), { stop: step.stop, ghost: !v.inc });
      memory(ctx, S.cur, fresh ? P.cur : S.cur, S.cur.out);
      const yEnd = table(ctx, S.rows, { hlLast: true });
      if (step.cond) condChip(ctx, step.cond, ease(since / 0.3));
      if (step.stop) { const e = ease(since / 0.4); ctx.save(); ctx.globalAlpha = e; card(ctx, TX + 20, 700, TWD - 40, 90, { fill: C.bad, r: 16 }); text(ctx, "■ STOP: kondisi selalu ya, berputar terus", TX + TWD / 2, 758, 32, { align: "center", weight: 900, color: "#fff" }); ctx.restore(); }
      else if (yEnd < 700) tagVar(ctx, v);
    },
    k9_hasil(ctx, b, l) {
      const v = VARS[b.v], S0 = TR[b.v], S = stateAt(v, S0.length - 1);
      code(ctx, v, -1, { ghost: !v.inc, fix: !v.inc && l > (b.audio || b.dur) * 0.66 });
      memory(ctx, S.cur, S.cur, S.cur.out);
      table(ctx, S.rows, {});
      const msg = v.inc ? `total ${S.cur.out} · ${PUTARAN(v)} putaran · ${CEK(v)} kali cek` : "bug: hitung tidak berubah, kondisi selalu ya";
      const e = ease((l - 0.4) / 0.5); ctx.save(); ctx.globalAlpha = e;
      card(ctx, TX + 20, 700, TWD - 40, 90, { fill: v.inc ? C.goodBg : C.badBg, stroke: v.inc ? C.good : C.bad, lw: 4, r: 16 });
      text(ctx, msg, TX + TWD / 2, 758, 32, { align: "center", weight: 900, color: v.inc ? C.good : C.bad });
      ctx.restore();

    },
    k9_bug(ctx, b, l) {
      const a = b.audio || b.dur, u = ease((l - a * 0.2) / 0.8);
      // baris 5 memudar lalu hilang
      if (u < 1) {
        code(ctx, VARS[0], 4);
        ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = C.bad; ctx.lineWidth = 6; const y = CY + 60 + 4 * RH + RH / 2; ctx.beginPath(); ctx.moveTo(CX + 130, y); ctx.lineTo(CX + 130 + (CW - 160) * u, y); ctx.stroke(); ctx.restore();
      } else code(ctx, VARS[4], -1, { ghost: true });
      memory(ctx, { h: null, t: null }, null, null);
      card(ctx, TX, TY, TWD, 675, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 });
      text(ctx, "VARIASI 5: ADA BUG", TX + 40, TY + 60, 32, { weight: 900, color: C.bad });
      para(ctx, "Baris penambah hitung lupa ditulis.", TX + 40, TY + 130, 34, TWD - 80, { weight: 800, lh: 1.3 });
      if (l > a * 0.62) { const e = ease((l - a * 0.62) / 0.4); ctx.save(); ctx.globalAlpha = e; card(ctx, TX + 40, TY + 210, TWD - 80, 150, { fill: C.bg2, r: 16 }); para(ctx, "Kodenya tetap rapi, dan tidak ada pesan error. Bug seperti ini hanya terlihat saat dilacak.", TX + 70, TY + 260, 30, TWD - 140, { weight: 700, lh: 1.3, color: C.ink2 }); ctx.restore(); }
      kiko(ctx, TX + TWD - 140, 640, 130, 0, { mood: "confused" });
    },
    k9_latihan(ctx, b, l) {
      const a = b.audio || b.dur;
      const px = 230, py = 122, pw = 440, ph = 700;
      ctx.fillStyle = "#2B3A44"; rr(ctx, px, py, pw, ph, 44); ctx.fill();
      ctx.fillStyle = "#F4F7F5"; rr(ctx, px + 16, py + 20, pw - 32, ph - 40, 30); ctx.fill();
      ctx.save(); rr(ctx, px + 16, py + 20, pw - 32, ph - 40, 30); ctx.clip();
      const x0 = px + 34, w0 = pw - 68;
      text(ctx, "Latihan: pelacak pseudocode", x0, py + 74, 22, { weight: 900 });
      const presses = l < a * 0.2 ? -1 : l < a * 0.38 ? 0 : Math.min(3, 1 + Math.floor((l - a * 0.38) / (a * 0.12)));
      ["1 Pelacak pseudocode", "2 Tebak nilai akhirnya", "3 Susun tiga pola"].forEach((s, i) => {
        const y = py + 100 + i * 46, on = i === 0 && presses >= 0;
        ctx.fillStyle = on ? "#DCEBF2" : "#FFFFFF"; rr(ctx, x0, y, w0, 38, 10); ctx.fill(); ctx.strokeStyle = on ? C.kiko : "#C9D4DB"; ctx.lineWidth = 2.5; rr(ctx, x0, y, w0, 38, 10); ctx.stroke();
        text(ctx, s, x0 + 14, y + 26, 19, { weight: 800, color: on ? C.kikoDark : C.ink });
      });
      // program 1 halaman: hitung ← 0, ULANGI 3 kali, hitung ← hitung + 2
      const P = ["hitung ← 0", "ULANGI 3 kali:", "  hitung ← hitung + 2"], tr = [[0, 0], [1, 0], [2, 2], [1, 2]];
      const si = Math.max(0, presses), st = presses >= 1 ? tr[si - 1] : null;
      text(ctx, `Program 1 dari 4 · langkah ${presses >= 1 ? si : 0} dari 7`, x0, py + 262, 16, { weight: 800, color: C.ink2 });
      ctx.fillStyle = "#FFFFFF"; rr(ctx, x0, py + 276, w0, 150, 10); ctx.fill(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x0, py + 276, w0, 150, 10); ctx.stroke();
      P.forEach((s, i) => { const y = py + 290 + i * 44; if (st && st[0] === i) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x0 + 6, y, w0 - 12, 38, 8); ctx.fill(); } text(ctx, String(i + 1), x0 + 22, y + 26, 16, { align: "center", weight: 900, color: C.ink2 }); text(ctx, s, x0 + 44, y + 26, 19, { weight: 800, color: /ULANGI/.test(s) ? C.kiko : C.ink }); });
      ctx.fillStyle = "#1F2A33"; rr(ctx, x0, py + 440, w0, 110, 10); ctx.fill(); text(ctx, "PAPAN MEMORI", x0 + 14, py + 464, 14, { weight: 900, color: "#8FD0E6" });
      ctx.fillStyle = st ? "#FFF3D6" : "#FFFFFF"; rr(ctx, x0 + 14, py + 476, 150, 62, 8); ctx.fill(); text(ctx, st ? "hitung" : "kosong", x0 + 89, py + 496, 15, { align: "center", weight: 900, color: C.kiko }); text(ctx, st ? String(st[1]) : "–", x0 + 89, py + 530, 26, { align: "center", weight: 900 });
      const by = py + 568; ctx.fillStyle = C.accent; rr(ctx, x0, by, 200, 50, 10); ctx.fill(); text(ctx, "Langkah ▶", x0 + 100, by + 33, 20, { align: "center", weight: 900 });
      ctx.fillStyle = "#FFFFFF"; rr(ctx, x0 + 212, by, w0 - 212, 50, 10); ctx.fill(); ctx.strokeStyle = "#C9D4DB"; rr(ctx, x0 + 212, by, w0 - 212, 50, 10); ctx.stroke(); text(ctx, "↺ Dari awal", x0 + 212 + (w0 - 212) / 2, by + 33, 18, { align: "center", weight: 800 });
      ctx.restore();
      const tgt = presses < 0 ? [px + pw / 2, py + 420] : presses === 0 ? [x0 + 200, py + 126] : [x0 + 150, by + 34];
      const tPrev = presses <= 0 ? a * 0.2 : a * 0.38 + (presses - 1) * a * 0.12, c = presses < 0 ? 0 : clamp((l - tPrev) / 0.5, 0, 1);
      L.cursor(ctx, tgt[0], tgt[1], { click: c });
      card(ctx, 760, 150, 1000, 300, { fill: "#FFFFFF", r: 22 });
      text(ctx, "HALAMAN LATIHAN D9.1", 1260, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 860, 250, 800, 76, { fill: C.bg2, r: 14 }); text(ctx, "belajar-informatika.vercel.app/d91", 1260, 300, 34, { align: "center", weight: 900, color: C.kikoDark });
      text(ctx, "1 Pelacak pseudocode → tebak dulu → tekan Langkah ▶", 1260, 395, 26, { align: "center", weight: 700, color: C.ink2, fit: 940 });
      card(ctx, 760, 480, 1000, 300, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Tugas nyata", 1260, 540, 32, { align: "center", weight: 900 });
      para(ctx, "Tulis perulangan yang menjumlahkan uang jajanmu selama lima hari, lalu lacak dengan tabel jejak di kertas.", 1260, 600, 30, 860, { align: "center", weight: 700, lh: 1.3 });
    }
  });

  function tanya(ctx, b, l, timer) {
    const v = VARS[b.v];
    code(ctx, v, -1, { ghost: !v.inc });
    memory(ctx, { h: null, t: null }, null, null);
    card(ctx, TX, TY, TWD, 675, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 20 });
    text(ctx, "VARIASI " + (b.v + 1), TX + 40, TY + 60, 30, { weight: 900, color: C.accentDark });
    const facts = [["hitung mulai", String(v.a)], ["batas", "≤ " + v.b], ["penambah hitung", v.inc ? "ada" : "hilang"]];
    facts.forEach(([k, s], i) => { const x = TX + 40 + i * 320; card(ctx, x, TY + 90, 300, 130, { fill: (i === 2 && !v.inc) ? C.badBg : C.bg2, r: 16 }); text(ctx, k, x + 150, TY + 132, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, s, x + 150, TY + 190, 44, { align: "center", weight: 900, color: (i === 2 && !v.inc) ? C.bad : C.ink }); });
    para(ctx, "Menurutmu, berapa putaran, dan berapa total yang ditulis?", TX + TWD / 2, TY + 290, 34, TWD - 120, { align: "center", weight: 800, lh: 1.3 });
    ["putaran = ?", "total = ?"].forEach((s, i) => { const x = TX + 120 + i * 420; card(ctx, x, TY + 400, 360, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4, r: 18 }); text(ctx, s, x + 180, TY + 472, 44, { align: "center", weight: 900, color: C.accentDark }); });
    if (timer) { const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(TX + TWD / 2, TY + 600, 40, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(TX + TWD / 2, TY + 600, 40, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke(); text(ctx, "?", TX + TWD / 2, TY + 614, 36, { align: "center", weight: 900, color: C.accentDark }); }
  }
  K.k9 = { TR, VARS, stateAt };
})(typeof window !== "undefined" ? window : globalThis);
