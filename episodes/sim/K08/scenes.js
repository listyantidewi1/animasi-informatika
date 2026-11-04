/* K08 Simulasi konsep: penyebaran hoaks di grup kelas. Pohon penyebaran: tiap orang yang percaya meneruskan ke 3 teman,
   putaran 0–4 (1, 3, 9, 27, 81 tempat). Aturan variasi deterministik:
   - checkers: indeks anak (0, 1, 2) di setiap kelompok tiga teman yang memeriksa dulu (tidak meneruskan);
   - koreksi c: sesudah putaran c semua sudah membaca koreksi, jadi tidak ada lagi yang meneruskan.
   Angka sudah dicek dengan simulasi python (121, 46, 13, 40, 4). Pohon di kiri (x 110–1190), panel di kanan (x 1220–1820). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, HX = K.hoaks, L = K.layar;
  const { rr, text, wrap, para, card, kiko, kid, ease, clamp, lerp } = H;
  const BLUE = "#3A7BD5", GREY = "#D3DDD8";
  const HOAX = "UJIAN BESOK DIBATALKAN!!! Sebarkan ke semua sekarang juga!";
  const KOREKSI = "Aku sudah tanya Bu Wali Kelas: ujian tetap besok, ya. Pesan tadi hoaks. 🙏";

  const VARS = [
    { checkers: [], name: "Semua langsung membagikan", short: "semua membagikan" },
    { checkers: [2], name: "1 dari 3 penerima memeriksa dulu", short: "1 dari 3 periksa" },
    { checkers: [1, 2], name: "2 dari 3 penerima memeriksa dulu", short: "2 dari 3 periksa" },
    { checkers: [], koreksi: 3, name: "Koreksi sesudah putaran 3", short: "koreksi terlambat" },
    { checkers: [], koreksi: 1, name: "Koreksi sesudah putaran 1", short: "koreksi cepat" }
  ];
  const R = 4, ROWS = [1, 3, 9, 27, 81];
  // status tiap tempat: "share" (merah, meneruskan), "check" (hijau, memeriksa dulu), null (tidak menerima)
  function simulate(v) {
    const lv = [["share"]];
    for (let r = 1; r <= R; r++) {
      const stop = v.koreksi != null && r > v.koreksi, row = [];
      lv[r - 1].forEach(s => { for (let k = 0; k < 3; k++) row.push(s === "share" && !stop ? (v.checkers.includes(k) ? "check" : "share") : null); });
      lv.push(row);
    }
    const nw = lv.map(row => row.filter(Boolean).length), chk = lv.map(row => row.filter(s => s === "check").length);
    const cum = nw.map((_, i) => nw.slice(0, i + 1).reduce((a, b) => a + b, 0));
    return { lv, nw, chk, cum, total: cum[R], checked: chk.reduce((a, b) => a + b, 0) };
  }
  const SIM = VARS.map(simulate);

  // ---------- pohon ----------
  const TX = 250, TW = 920, TY = 205, DY = 128, RAD = [22, 16, 11, 7, 4.6];
  const pos = (r, i) => [TX + (i + 0.5) * TW / ROWS[r], TY + r * DY];
  // st: shown (putaran yang sudah tampil, pecahan boleh: 2.4 = putaran 3 sedang tumbuh 40%), koreksi (0..1 tampil), corrected (lingkar biru)
  function tree(ctx, v, S, shown, opt = {}) {
    ctx.save();
    text(ctx, "putaran", 150, 168, 20, { align: "center", weight: 800, color: C.ink2 });
    for (let r = 0; r <= R; r++) text(ctx, String(r), 150, TY + r * DY + 10, 28, { align: "center", weight: 900, color: r <= shown ? C.ink : C.muted });
    // tempat kosong
    for (let r = 0; r <= R; r++) for (let i = 0; i < ROWS[r]; i++) { const p = pos(r, i); ctx.fillStyle = GREY; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(p[0], p[1], RAD[r], 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
    for (let r = 1; r <= R; r++) {
      const g = clamp(shown - (r - 1), 0, 1); if (g <= 0) break;
      const ge = ease(Math.min(1, g / 0.7)), gn = ease((g - 0.6) / 0.4);
      S.lv[r].forEach((s, i) => {
        if (!s) return; const p = pos(r, i), q = pos(r - 1, Math.floor(i / 3));
        ctx.strokeStyle = C.bad; ctx.lineWidth = r < 3 ? 3 : r < 4 ? 1.8 : 1.2; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(lerp(q[0], p[0], ge), lerp(q[1], p[1], ge)); ctx.stroke();
      });
      if (gn > 0) S.lv[r].forEach((s, i) => { if (!s) return; node(ctx, pos(r, i), RAD[r] * (0.6 + 0.4 * gn), s, r, gn); });
    }
    node(ctx, pos(0, 0), RAD[0], "share", 0, 1);
    text(ctx, "Dito", pos(0, 0)[0] + 34, pos(0, 0)[1] + 9, 26, { weight: 900 });
    // koreksi: garis putus biru di bawah putaran c + lingkar biru di semua penerima
    if (v.koreksi != null && opt.koreksi > 0) {
      const u = ease(opt.koreksi), y = TY + v.koreksi * DY + DY * 0.5;
      ctx.save(); ctx.globalAlpha = u;
      for (let r = 0; r <= v.koreksi; r++) S.lv[r].forEach((s, i) => { if (!s) return; const p = pos(r, i); ctx.strokeStyle = BLUE; ctx.lineWidth = r < 3 ? 4 : 2.5; ctx.beginPath(); ctx.arc(p[0], p[1], RAD[r] + (r < 3 ? 6 : 3), 0, Math.PI * 2); ctx.stroke(); });
      ctx.setLineDash([14, 10]); ctx.strokeStyle = BLUE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(200, y); ctx.lineTo(1170, y); ctx.stroke(); ctx.setLineDash([]);
      card(ctx, 870, y - 26, 300, 52, { fill: "#E3EEFB", stroke: BLUE, lw: 3, r: 26 }); text(ctx, "koreksi tiba ✓", 1020, y + 9, 24, { align: "center", weight: 900, color: BLUE });
      ctx.restore();
    }
    ctx.restore();
  }
  function node(ctx, p, r, s, lvl, a) {
    ctx.save(); ctx.globalAlpha = clamp(a, 0, 1);
    ctx.fillStyle = s === "check" ? C.good : C.bad; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
    if (lvl <= 2) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p[0], p[1], r - 3, 0, Math.PI * 2); ctx.stroke(); }
    if (s === "check" && lvl <= 2) text(ctx, "✓", p[0], p[1] + r * 0.4, r * 1.2, { align: "center", weight: 900, color: "#fff" });
    ctx.restore();
  }
  const bg = ctx => card(ctx, 110, 125, 1080, 690, { fill: "#FFFFFF", r: 24 });
  function panel(ctx, title, x, y, w, h, opt = {}) { card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: opt.stroke || "#D7E2DC", lw: 3, r: 20 }); text(ctx, title, x + 26, y + 44, 24, { weight: 900, color: opt.color || C.accentDark }); }
  function legend(ctx, x, y, withBlue) {
    [[C.bad, "meneruskan"], [C.good, "memeriksa dulu"], [GREY, "tidak menerima"]].concat(withBlue ? [[BLUE, "sudah baca koreksi"]] : []).forEach(([c, s], i) => {
      const yy = y + i * 40; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 12, yy, 11, 0, Math.PI * 2); if (c === BLUE) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke(); } else ctx.fill();
      text(ctx, s, x + 34, yy + 8, 22, { weight: 800, color: C.ink2 });
    });
  }

  // ---------- panel hitungan ----------
  function countPanel(ctx, v, S, shown, l, opt = {}) {
    const x = 1220, y = 125, w = 600;
    panel(ctx, "HITUNGAN", x, y, w, 690);
    text(ctx, v.name, x + 26, y + 82, 24, { weight: 800, color: C.ink, fit: w - 52 });
    const hy = y + 124; ["putaran", "penerima baru", "total"].forEach((s, i) => text(ctx, s, x + [26, 190, 470][i], hy, 21, { weight: 800, color: C.ink2 }));
    let last = 0;
    for (let r = 0; r <= R; r++) {
      let g = r === 0 ? 1 : ease((shown - (r - 1) - 0.6) / 0.4);
      if (v.koreksi != null && r > v.koreksi) g = opt.final ? 1 : ease(((opt.kor || 0) - 0.3) / 0.7);
      if (g <= 0) continue; last = r;
      const yy = hy + 16 + r * 62; ctx.save(); ctx.globalAlpha = g;
      const none = S.nw[r] === 0;
      ctx.fillStyle = r === Math.floor(shown + 0.4) && shown < R + 0.01 && !opt.final ? "#FFF3D6" : (r % 2 ? "#F7FAF8" : "#FFFFFF"); rr(ctx, x + 12, yy, w - 24, 54, 10); ctx.fill();
      text(ctx, String(r), x + 60, yy + 38, 28, { align: "center", weight: 900 });
      text(ctx, none ? "0" : String(S.nw[r]), x + 250, yy + 38, 28, { align: "center", weight: 900, color: none ? C.muted : C.bad });
      if (S.chk[r]) text(ctx, `(${S.chk[r]} periksa)`, x + 300, yy + 37, 20, { weight: 800, color: C.good });
      if (none && v.koreksi != null) text(ctx, "berhenti", x + 300, yy + 37, 20, { weight: 800, color: BLUE });
      text(ctx, String(S.cum[r]), x + 520, yy + 38, 28, { align: "center", weight: 900 });
      ctx.restore();
    }
    // total besar
    const cur = S.cum[Math.min(R, Math.max(0, Math.floor(shown + 0.4)))];
    card(ctx, x + 24, y + 470, w - 48, 120, { fill: C.badBg, stroke: C.bad, lw: 4, r: 16 });
    text(ctx, String(opt.final ? S.total : cur), x + 150, y + 552, 64, { align: "center", weight: 900, color: C.bad });
    text(ctx, "orang sudah", x + 270, y + 520, 26, { weight: 800 }); text(ctx, "menerima hoaks", x + 270, y + 556, 26, { weight: 800 });
    const chkNow = S.chk.slice(0, Math.floor(shown + 0.4) + 1).reduce((a, b) => a + b, 0);
    if (v.checkers.length) { card(ctx, x + 24, y + 606, w - 48, 66, { fill: C.goodBg, r: 14 }); text(ctx, `${opt.final ? S.checked : chkNow} orang memeriksa dulu`, x + w / 2, y + 650, 28, { align: "center", weight: 900, color: C.good }); }
    else if (v.koreksi != null) { card(ctx, x + 24, y + 606, w - 48, 66, { fill: "#E3EEFB", r: 14 }); text(ctx, `koreksi dikirim sesudah putaran ${v.koreksi}`, x + w / 2, y + 650, 24, { align: "center", weight: 900, color: BLUE }); }
  }
  // berapa putaran tampil, dari waktu tiba tiap putaran (b.at, pecahan b.audio)
  function shownAt(v, b, l) {
    const a = b.audio || b.dur, at = (b.at || [0.2, 0.4, 0.6, 0.8]).map(f => f * a);
    const rounds = v.koreksi != null ? v.koreksi : R;
    let s = 0;
    for (let r = 1; r <= rounds; r++) { const t = at[r - 1], g = clamp((l - (t - 1.0)) / 1.0, 0, 1); if (g > 0) s = r - 1 + g; }
    const kor = v.koreksi != null ? clamp((l - at[v.koreksi]) / 0.6, 0, 1) : 0;
    return { s, kor };
  }

  // ---------- diagram perbandingan ----------
  function bars(ctx, x, y, w, upto, l, opt = {}) {
    const max = 121, bw = w - 260, rh = opt.rh || 92;
    for (let i = 0; i <= upto; i++) {
      const S = SIM[i], v = VARS[i], yy = y + i * rh, fresh = i === upto && opt.fresh !== false;
      const g = fresh ? ease((l - 0.5) / 0.9) : 1;
      text(ctx, v.short, x, yy + 26, 24, { weight: 800, color: C.ink2 });
      ctx.fillStyle = "#EEF2F0"; rr(ctx, x, yy + 38, bw, 34, 8); ctx.fill();
      const col = v.koreksi != null ? BLUE : v.checkers.length ? C.good : C.bad;
      ctx.fillStyle = col; rr(ctx, x, yy + 38, Math.max(8, bw * S.total / max * g), 34, 8); ctx.fill();
      text(ctx, String(Math.round(S.total * g)), x + Math.max(8, bw * S.total / max * g) + 14, yy + 66, 30, { weight: 900, color: col });
    }
  }

  Object.assign(K.SCENES, {
    k8_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 650);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      ["menghitung penerima tiap putaran", "melihat efek memeriksa dulu", "membandingkan koreksi cepat dan terlambat"].forEach((s, i) => {
        const u = ease((l - 0.6 - i * 0.9) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 860, 84, { fill: C.bg2, r: 16 }); text(ctx, "✓", 300, 336 + i * 104, 36, { weight: 900, color: C.good }); text(ctx, s, 350, 334 + i * 104, 32, { weight: 800 }); ctx.globalAlpha = 1;
      });
      // pohon mini
      const cx = 1450, rows = [1, 3, 9], ys = [300, 430, 560];
      rows.forEach((n, r) => { for (let i = 0; i < n; i++) { const x = cx - 220 + (i + 0.5) * 440 / n; if (r) { const px = cx - 220 + (Math.floor(i / 3) + 0.5) * 440 / rows[r - 1]; ctx.strokeStyle = C.bad; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, ys[r - 1]); ctx.lineTo(x, ys[r]); ctx.stroke(); } } });
      rows.forEach((n, r) => { for (let i = 0; i < n; i++) { const x = cx - 220 + (i + 0.5) * 440 / n; const chk = r === 2 && i % 3 === 2; ctx.fillStyle = chk ? C.good : C.bad; ctx.beginPath(); ctx.arc(x, ys[r], [22, 16, 12][r], 0, Math.PI * 2); ctx.fill(); } });
      text(ctx, "1 → 3 → 9 → …", cx, 660, 32, { align: "center", weight: 900, color: C.bad });
    },
    k8_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 650);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 240, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 520, 290, 880, 330, { fill: C.bg2, r: 22 });
      text(ctx, "D8.5", 960, 370, 60, { align: "center", weight: 900, color: C.kiko });
      text(ctx, "Fakta, Opini, dan Hoaks", 960, 440, 40, { align: "center", weight: 800 });
      [["FAKTA", C.good, C.goodBg], ["OPINI", C.kiko, "#DCEBF2"], ["HOAKS", C.bad, C.badBg]].forEach(([s, c, f], i) => { const x = 640 + i * 220; card(ctx, x, 500, 190, 64, { fill: f, stroke: c, lw: 4, r: 14 }); text(ctx, s, x + 95, 543, 26, { align: "center", weight: 900, color: c }); });
      kiko(ctx, 1600, 690, 110, 0, { wave: l });
    },
    k8_pesan(ctx, b, l) {
      const a = b.audio || b.dur;
      const ph = D.phone(ctx, 520, 470, 420, 640);
      ctx.fillStyle = "#EAF2EE"; ctx.fillRect(ph.x, ph.y + 30, ph.w, 60);
      text(ctx, "Grup 8B", ph.x + 24, ph.y + 70, 26, { weight: 900 }); text(ctx, "32 anggota", ph.x + ph.w - 24, ph.y + 70, 20, { align: "right", weight: 700, color: C.ink2 });
      HX.msg(ctx, ph.x + 18, ph.y + 120, ph.w - 60, "Nanti sore jadi latihan pramuka?", { who: "Bayu", size: 22 });
      const u = ease((l - 0.5) / 0.5); ctx.save(); ctx.globalAlpha = u;
      text(ctx, "↪ Diteruskan", ph.x + 40, ph.y + 262, 18, { weight: 800, color: C.ink2 });
      HX.msg(ctx, ph.x + 40, ph.y + 272, ph.w - 58, HOAX, { who: "Dito", fill: C.badBg, stroke: C.bad, color: C.bad, size: 24 });
      ctx.restore();

      card(ctx, 900, 150, 900, 620, { fill: "#FFFFFF", r: 22 });
      text(ctx, "Ciri hoaks di pesan ini", 950, 215, 30, { weight: 900, color: C.accentDark });
      [["Mendesak: sekarang juga!", 0.78], ["Tanpa sumber yang jelas", 0.85], ["Minta disebarkan", 0.92]].forEach(([s, f], i) => {
        if (l < a * f) return; const e = ease((l - a * f) / 0.4); ctx.save(); ctx.globalAlpha = e;
        card(ctx, 950, 260 + i * 110, 800, 86, { fill: C.badBg, r: 16 }); ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(1000, 303 + i * 110, 22, 0, Math.PI * 2); ctx.fill();
        text(ctx, "!", 1000, 313 + i * 110, 28, { align: "center", weight: 900, color: "#fff" }); text(ctx, s, 1045, 314 + i * 110, 32, { weight: 800 }); ctx.restore();
      });
      if (l > a * 0.05) { const e = ease((l - a * 0.05) / 0.4); ctx.save(); ctx.globalAlpha = e; text(ctx, "Dito menerimanya dari grup lain.", 950, 640, 28, { weight: 700, color: C.ink2 }); ctx.restore(); }
      card(ctx, 950, 680, 420, 56, { fill: "#F4F6F5", stroke: "#C9D4DB", lw: 2, r: 12 }); text(ctx, "Pesan ini rekaan.", 1160, 717, 24, { align: "center", weight: 900, color: C.ink2 });
    },
    k8_aturan(ctx, b, l) {
      const a = b.audio || b.dur;
      card(ctx, 110, 125, 1710, 690, { fill: "#FFFFFF", r: 24 });
      // satu orang percaya → tiga teman
      const cx = 520, top = 260, bot = 560;
      const g = ease((l - a * 0.18) / 0.8);
      [-260, 0, 260].forEach(dx => { ctx.strokeStyle = C.bad; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, top + 30); ctx.lineTo(lerp(cx, cx + dx, g), lerp(top + 30, bot - 70, g)); ctx.stroke(); });
      kid(ctx, cx, top - 40, 70, {}); text(ctx, "percaya", cx - 70, top - 50, 26, { align: "right", weight: 900, color: C.bad });
      if (g > 0.9) [-260, 0, 260].forEach((dx, i) => { kid(ctx, cx + dx, bot - 30, 60, { hair: i === 1 ? "long" : undefined }); });
      if (l > a * 0.4) { const e = ease((l - a * 0.4) / 0.4); ctx.save(); ctx.globalAlpha = e; card(ctx, 250, 680, 540, 70, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 14 }); text(ctx, "1 kali meneruskan = 1 putaran", 520, 726, 28, { align: "center", weight: 900 }); ctx.restore(); }
      // yang memeriksa dulu
      if (l > a * 0.7) {
        const e = ease((l - a * 0.7) / 0.5); ctx.save(); ctx.globalAlpha = e;
        const x2 = 1350; kid(ctx, x2, top - 40, 70, { hair: "long" }); text(ctx, "memeriksa dulu ✓", x2 - 70, top - 50, 26, { align: "right", weight: 900, color: C.good });
        [-200, 0, 200].forEach(dx => { ctx.strokeStyle = "#C9D4DB"; ctx.setLineDash([10, 10]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x2, top + 90); ctx.lineTo(x2 + dx, bot - 70); ctx.stroke(); ctx.setLineDash([]); });
        ctx.strokeStyle = C.good; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x2 - 50, 380); ctx.lineTo(x2 + 50, 440); ctx.moveTo(x2 + 50, 380); ctx.lineTo(x2 - 50, 440); ctx.stroke();
        text(ctx, "tidak meneruskan", x2, 560, 28, { align: "center", weight: 900, color: C.ink2 });
        ctx.restore();
      }
    },
    k8_pohon(ctx, b, l) {
      const a = b.audio || b.dur; bg(ctx);
      const S = { lv: [["share"], ["share", "share", "check"], [], [], []] };
      for (let r = 2; r <= R; r++) S.lv[r] = Array(ROWS[r]).fill(null);
      tree(ctx, VARS[0], S, l > a * 0.12 ? 1 : 0);
      panel(ctx, "KETERANGAN", 1220, 125, 600, 690);
      legend(ctx, 1260, 220, false);
      text(ctx, "satu titik = satu orang", 1260, 400, 26, { weight: 800 });
      if (l > a * 0.82) { const e = ease((l - a * 0.82) / 0.4); ctx.save(); ctx.globalAlpha = e; card(ctx, 1250, 460, 540, 120, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, "4 putaran", 1520, 512, 36, { align: "center", weight: 900 }); text(ctx, "paling banyak 1 + 3 + 9 + 27 + 81", 1520, 556, 24, { align: "center", weight: 800, color: C.ink2 }); ctx.restore(); }
    },
    k8_tanya(ctx, b, l) { tanya(ctx, b, l, false); },
    k8_tebak(ctx, b, l) { tanya(ctx, b, l, true); },
    k8_jalan(ctx, b, l) {
      const v = VARS[b.v], S = SIM[b.v]; bg(ctx);
      const { s, kor } = shownAt(v, b, l);
      tree(ctx, v, S, s, { koreksi: kor });
      countPanel(ctx, v, S, s, l, { kor });
    },
    k8_hasil(ctx, b, l) {
      const v = VARS[b.v], S = SIM[b.v]; bg(ctx);
      tree(ctx, v, S, v.koreksi != null ? v.koreksi : R, { koreksi: v.koreksi != null ? 1 : 0 });
      panel(ctx, "PERBANDINGAN", 1220, 125, 600, 690);
      text(ctx, "orang yang menerima hoaks", 1246, 200, 24, { weight: 800, color: C.ink2 });
      bars(ctx, 1246, 240, 560, b.v, l);
    },
    k8_koreksi(ctx, b, l) {
      const a = b.audio || b.dur;
      const ph = D.phone(ctx, 520, 470, 420, 640);
      ctx.fillStyle = "#EAF2EE"; ctx.fillRect(ph.x, ph.y + 30, ph.w, 60);
      text(ctx, "Grup 8B", ph.x + 24, ph.y + 70, 26, { weight: 900 });
      text(ctx, "↪ Diteruskan", ph.x + 40, ph.y + 122, 18, { weight: 800, color: C.ink2 });
      const h1 = HX.msg(ctx, ph.x + 40, ph.y + 132, ph.w - 58, HOAX, { who: "Dito", fill: C.badBg, stroke: C.bad, color: C.bad, size: 22 });
      if (l > a * 0.38) { const e = ease((l - a * 0.38) / 0.5); ctx.save(); ctx.globalAlpha = e; HX.msg(ctx, ph.x + 18, ph.y + 160 + h1, ph.w - 50, KOREKSI, { who: "Sinta", fill: "#E3EEFB", stroke: BLUE, size: 22 }); ctx.restore(); }
      card(ctx, 900, 150, 900, 620, { fill: "#FFFFFF", r: 22 });
      text(ctx, "Koreksi", 950, 215, 32, { weight: 900, color: BLUE });
      [["Sinta bertanya kepada wali kelas.", 0.16], ["Koreksi dikirim ke semua grup.", 0.38], ["Yang sudah membaca koreksi tidak meneruskan hoaks.", 0.72]].forEach(([s, f], i) => {
        if (l < a * f) return; const e = ease((l - a * f) / 0.4); ctx.save(); ctx.globalAlpha = e;
        card(ctx, 950, 260 + i * 150, 800, 124, { fill: "#E3EEFB", r: 16 }); ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(1000, 322 + i * 150, 24, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 1000, 332 + i * 150, 26, { align: "center", weight: 900, color: "#fff" }); para(ctx, s, 1045, 312 + i * 150, 30, 680, { weight: 800, lh: 1.25 }); ctx.restore();
      });
    },
    k8_banding(ctx, b, l) {
      card(ctx, 110, 125, 1710, 690, { fill: "#FFFFFF", r: 24 });
      text(ctx, "ORANG YANG MENERIMA HOAKS SETELAH 4 PUTARAN", 960, 195, 30, { align: "center", weight: 900, color: C.accentDark });
      bars(ctx, 300, 240, 1360, 4, l, { fresh: false, rh: 100 });
      const a = b.audio || b.dur;
      if (l > a * 0.6) { const e = ease((l - a * 0.6) / 0.4); ctx.save(); ctx.globalAlpha = e; card(ctx, 360, 740, 1200, 60, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "memeriksa dulu + koreksi cepat = jauh lebih sedikit yang tertipu", 960, 780, 26, { align: "center", weight: 900, color: C.good }); ctx.restore(); }
    },
    k8_latihan(ctx, b, l) {
      const a = b.audio || b.dur;
      const px = 230, py = 122, pw = 440, ph = 700;
      ctx.fillStyle = "#2B3A44"; rr(ctx, px, py, pw, ph, 44); ctx.fill();
      ctx.fillStyle = "#F4F7F5"; rr(ctx, px + 16, py + 20, pw - 32, ph - 40, 30); ctx.fill();
      ctx.save(); rr(ctx, px + 16, py + 20, pw - 32, ph - 40, 30); ctx.clip();
      const x0 = px + 34, w0 = pw - 68;
      text(ctx, "Latihan: periksa dulu", x0, py + 74, 24, { weight: 900 });
      const step = l > a * 0.2 ? (l > a * 0.4 ? (l > a * 0.58 ? 3 : 2) : 1) : 0;
      ["1 Pilah kalimat", "2 Centang ciri hoaks", "3 Simulasi penyebaran"].forEach((s, i) => {
        const y = py + 100 + i * 46, on = i === 2 && step >= 1;
        ctx.fillStyle = on ? "#DCEBF2" : "#FFFFFF"; rr(ctx, x0, y, w0, 38, 10); ctx.fill(); ctx.strokeStyle = on ? C.kiko : "#C9D4DB"; ctx.lineWidth = 2.5; rr(ctx, x0, y, w0, 38, 10); ctx.stroke();
        text(ctx, s, x0 + 14, y + 26, 19, { weight: 800, color: on ? C.kikoDark : C.ink });
      });
      let round = 0, stop = null;
      if (step >= 2) round = 4; if (step >= 3) stop = [1, 1];
      if (step >= 1) {
        // pohon kecil seperti halaman (SVG 360×250)
        const W = w0, Hh = 220, oy = py + 250, rows = ROWS, dy = Hh / 4, dead = new Set();
        if (stop) for (let lvl = stop[0] + 1; lvl < 5; lvl++) { const span = Math.pow(3, lvl - stop[0]); for (let k = 0; k < span; k++) dead.add(lvl + ":" + (stop[1] * span + k)); }
        const p2 = (lvl, i) => [x0 + (i + 0.5) * (W / rows[lvl]), oy + 10 + lvl * dy];
        let rec = 0, saved = 0;
        for (let lvl = 0; lvl <= round; lvl++) for (let i = 0; i < rows[lvl]; i++) { const p = p2(lvl, i), d = dead.has(lvl + ":" + i); if (d) saved++; else rec++; if (lvl) { const q = p2(lvl - 1, Math.floor(i / 3)); ctx.strokeStyle = d ? "#D7E2DC" : C.bad; ctx.lineWidth = lvl < 3 ? 1.6 : 0.8; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); } }
        for (let lvl = 0; lvl <= round; lvl++) for (let i = 0; i < rows[lvl]; i++) { const p = p2(lvl, i), d = dead.has(lvl + ":" + i), isStop = stop && stop[0] === lvl && stop[1] === i; ctx.fillStyle = d ? "#D7E2DC" : isStop ? C.good : C.bad; ctx.beginPath(); ctx.arc(p[0], p[1], ([7, 6, 4.5, 3, 1.8][lvl]) * (isStop ? 1.6 : 1.2), 0, Math.PI * 2); ctx.fill(); }
        const by = oy + Hh + 36;
        ctx.fillStyle = round >= 4 ? "#E8D9B0" : C.accent; rr(ctx, x0, by, 250, 46, 10); ctx.fill(); text(ctx, `Putaran berikutnya (${round}/4)`, x0 + 125, by + 30, 17, { align: "center", weight: 900, color: C.ink });
        ctx.fillStyle = "#FFFFFF"; rr(ctx, x0 + 262, by, 110, 46, 10); ctx.fill(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x0 + 262, by, 110, 46, 10); ctx.stroke(); text(ctx, "Ulang", x0 + 317, by + 30, 17, { align: "center", weight: 800 });
        const cy = by + 64;
        card(ctx, x0, cy, w0 / 2 - 6, 84, { fill: C.badBg, r: 12 }); text(ctx, String(rec), x0 + w0 / 4 - 3, cy + 42, 30, { align: "center", weight: 900, color: C.bad }); text(ctx, "menerima pesan", x0 + w0 / 4 - 3, cy + 70, 15, { align: "center", weight: 800, color: C.ink2 });
        card(ctx, x0 + w0 / 2 + 6, cy, w0 / 2 - 6, 84, { fill: C.goodBg, r: 12 }); text(ctx, String(saved), x0 + w0 * 0.75 + 3, cy + 42, 30, { align: "center", weight: 900, color: C.good }); text(ctx, "selamat", x0 + w0 * 0.75 + 3, cy + 70, 15, { align: "center", weight: 800, color: C.ink2 });
        ctx.restore();
        const tgt = step === 1 ? [x0 + 200, py + 210] : step === 2 ? [x0 + 140, by + 30] : p2(1, 1);
        const tPrev = [0, a * 0.2, a * 0.4, a * 0.58][step], c = clamp((l - tPrev) / 0.6, 0, 1);
        L.cursor(ctx, tgt[0] + (step === 3 ? 6 : 0), tgt[1] + (step === 3 ? 6 : 0), { click: c });
      } else { ctx.restore(); L.cursor(ctx, px + pw / 2, py + 400, {}); }
      card(ctx, 760, 150, 1000, 300, { fill: "#FFFFFF", r: 22 });
      text(ctx, "HALAMAN LATIHAN D8.5", 1260, 215, 30, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 860, 250, 800, 76, { fill: C.bg2, r: 14 }); text(ctx, "belajar-informatika.vercel.app/d85", 1260, 300, 34, { align: "center", weight: 900, color: C.kikoDark });
      text(ctx, "3 Simulasi penyebaran → Putaran berikutnya → ketuk titik merah", 1260, 395, 26, { align: "center", weight: 700, color: C.ink2, fit: 940 });
      card(ctx, 760, 480, 1000, 300, { fill: "#FFF9E0", r: 22 });
      text(ctx, "Tugas nyata", 1260, 540, 32, { align: "center", weight: 900 });
      para(ctx, "Buat kesepakatan grup kelasmu: sebelum meneruskan pesan, periksa dulu. Tulis satu kalimatnya dan sematkan di grup.", 1260, 600, 30, 860, { align: "center", weight: 700, lh: 1.3 });
    }
  });

  function tanya(ctx, b, l, timer) {
    const v = VARS[b.v], S = SIM[b.v]; bg(ctx);
    tree(ctx, v, S, 0);
    panel(ctx, "VARIASI " + (b.v + 1), 1220, 125, 600, 690);
    card(ctx, 1250, 190, 540, 200, { fill: v.koreksi != null ? "#E3EEFB" : v.checkers.length ? C.goodBg : C.badBg, r: 16 });
    para(ctx, v.name, 1520, 262, 36, 500, { align: "center", weight: 900, lh: 1.2, color: v.koreksi != null ? BLUE : v.checkers.length ? C.good : C.bad });
    para(ctx, "Menurutmu, berapa orang yang menerima hoaks setelah 4 putaran?", 1520, 450, 30, 520, { align: "center", weight: 800, lh: 1.3 });
    ctx.fillStyle = "#FFF3D6"; ctx.beginPath(); ctx.arc(1520, 660, 78, 0, Math.PI * 2); ctx.fill(); text(ctx, "?", 1520, 696, 100, { align: "center", weight: 900, color: C.accentDark });
    if (timer) { const frac = clamp(l / b.dur, 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(1520, 660, 92, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(1520, 660, 92, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke(); }
  }
  K.k8 = { SIM, VARS };
})(typeof window !== "undefined" ? window : globalThis);
