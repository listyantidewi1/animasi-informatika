/* K22 Simulasi konsep: firewall memeriksa paket dengan daftar aturan (dibaca dari atas, aturan pertama yang cocok berlaku,
   aturan bawaan di akhir). Memakai pembantu D9.2 (K.jaringan: awan, server, laptop, paket). Gaya diagram Fase F.
   Adegan baru berawalan k22_ (video) dan k22s_ (Short, area 40–1040 × 20–810). Semua alamat rekaan (192.168.x.x, 203.0.113.x).
   Kunci beat: pk (paket), rs (daftar aturan "A" atau "B" = urutan ditukar), after (tampilkan keadaan akhir), v (variasi),
   pilih (pilihan tebakan), cues (potongan narasi tempat tiap pemeriksaan aturan dimulai).
   Semua gambar penting di atas y≈830 (kartu narasi tiga baris mulai y≈841). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, J = K.jaringan;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;

  // ---------- data ----------
  const R_BLOK = { aksi: "tolak", port: "semua", dari: "203.0.113.66", nama: "diblokir" };
  const R443 = { aksi: "izinkan", port: "443", dari: "*" };
  const R80 = { aksi: "izinkan", port: "80", dari: "*" };
  const R22 = { aksi: "izinkan", port: "22", dari: "192.168.1.10", nama: "laptop admin" };
  const R_BAWA = { aksi: "tolak", port: "semua", dari: "*", nama: "bawaan" };
  const RS = { A: [R_BLOK, R443, R80, R22, R_BAWA], B: [R443, R80, R_BLOK, R22, R_BAWA] };
  const PK = {
    p443: { port: "443", ip: "203.0.113.25", who: "internet" },
    p80: { port: "80", ip: "203.0.113.25", who: "internet" },
    p8080: { port: "8080", ip: "203.0.113.25", who: "internet" },
    p22: { port: "22", ip: "203.0.113.25", who: "internet" },
    p22a: { port: "22", ip: "192.168.1.10", who: "laptop admin" },
    p66: { port: "443", ip: "203.0.113.66", who: "alamat yang diblokir" }
  };
  const dariTxt = r => r.dari === "*" ? (r.nama === "bawaan" ? "mana saja (bawaan)" : "mana saja") : r.dari + " (" + r.nama + ")";
  function cek(r, p) {
    const portOK = r.port === "semua" || r.port === p.port, addrOK = r.dari === "*" || r.dari === p.ip;
    if (portOK && addrOK) return { ok: true, s: "✓ cocok" };
    if (!portOK) return { ok: false, s: "✗ port beda" };
    return { ok: false, s: r.port === "semua" ? "✗ alamat beda" : "✗ port cocok, alamat beda" };
  }
  function putus(rs, p) { for (let i = 0; i < rs.length; i++) if (cek(rs[i], p).ok) return i; return rs.length - 1; }

  // ---------- waktu ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * A(b); };
  // waktu mulai pemeriksaan tiap aturan (n langkah): cues sepanjang n → langsung; lebih pendek → disebar di antara cue
  function stepTimes(b, n) {
    const cs = (b.cues || []).filter(c => b.text.indexOf(c) >= 0).map(c => at(b, c)), c = cs.length;
    if (c >= n) return cs.slice(0, n);
    if (c === 0) return Array.from({ length: n }, (_, i) => lead(b) + 0.15 * A(b) + i * Math.min(1.1, 0.6 * A(b) / n));
    if (c === 1) return Array.from({ length: n }, (_, i) => cs[0] + i * 0.8);
    // cue pertama = langkah pertama, cue terakhir = langkah terakhir, cue tengah disebar; langkah lain diinterpolasi
    const idx = cs.map((_, j) => Math.round(j * (n - 1) / (c - 1))), out = new Array(n);
    for (let j = 0; j < c - 1; j++) for (let i = idx[j]; i <= idx[j + 1]; i++) out[i] = lerp(cs[j], cs[j + 1], (i - idx[j]) / Math.max(1, idx[j + 1] - idx[j]));
    return out;
  }

  // ---------- pembantu gambar ----------
  const heading = (ctx, s, y = 205) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 900, fit: 1600 });
  const banner = (ctx, s, y, opt = {}) => { const w = opt.w || 1300; card(ctx, 960 - w / 2, y, w, 72, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 3, r: 16 }); text(ctx, s, 960, y + 47, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark, fit: w - 40 }); };
  const chip = (ctx, s, cx, cy, opt = {}) => { ctx.font = `900 ${opt.size || 20}px Inter`; const w = opt.w || ctx.measureText(s).width + 28, h = opt.h || (opt.size || 20) + 16; card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: opt.fill || C.goodBg, stroke: opt.stroke, lw: 2, r: h / 2 }); text(ctx, s, cx, cy + (opt.size || 20) * 0.36, opt.size || 20, { align: "center", weight: 900, color: opt.color || C.good }); return w; };
  function arrow(ctx, x1, y1, x2, y2, col, lw = 5) {
    const a = Math.atan2(y2 - y1, x2 - x1), hs = lw * 3.2;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * hs * 0.8, y2 - Math.sin(a) * hs * 0.8); ctx.stroke(); ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - Math.cos(a - 0.45) * hs, y2 - Math.sin(a - 0.45) * hs); ctx.lineTo(x2 - Math.cos(a + 0.45) * hs, y2 - Math.sin(a + 0.45) * hs); ctx.closePath(); ctx.fill();
  }
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  const colAksi = a => a === "izinkan" ? C.good : C.bad;
  // perisai firewall
  function shield(ctx, cx, cy, s, col = "#2F3B45") {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.55); ctx.lineTo(cx + s * 0.45, cy - s * 0.38); ctx.lineTo(cx + s * 0.42, cy + s * 0.1);
    ctx.quadraticCurveTo(cx + s * 0.3, cy + s * 0.42, cx, cy + s * 0.58); ctx.quadraticCurveTo(cx - s * 0.3, cy + s * 0.42, cx - s * 0.42, cy + s * 0.1); ctx.lineTo(cx - s * 0.45, cy - s * 0.38); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = Math.max(3, s * 0.05); ctx.beginPath(); ctx.moveTo(cx - s * 0.18, cy); ctx.lineTo(cx - s * 0.03, cy + s * 0.16); ctx.lineTo(cx + s * 0.22, cy - s * 0.15); ctx.stroke();
  }
  // tabel aturan: o = {rh, fs, cw:[#,aksi,port,dari,cek], n (baris tampil), cur (baris diperiksa), marks {i:[teks, ok]}, grey (mulai indeks), hl {i: warna}, pointer}
  function rules(ctx, x, y, rs, o = {}) {
    const rh = o.rh || 70, fs = o.fs || 26, hh = o.hh || 54, cw = o.cw || [64, 170, 140, 400, 286], W = cw.reduce((a, b) => a + b, 0);
    const cols = o.noCek ? cw.slice(0, 4) : cw, WW = cols.reduce((a, b) => a + b, 0);
    card(ctx, x, y, WW, hh + rh * rs.length, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 });
    ctx.fillStyle = C.bg2; rr(ctx, x, y, WW, hh, 14); ctx.fill(); ctx.fillRect(x, y + hh / 2, WW, hh / 2);
    const xs = []; let cx = x; cols.forEach(w => { xs.push(cx); cx += w; });
    ["#", "aksi", "port", "dari", "hasil cek"].slice(0, cols.length).forEach((h, i) => text(ctx, h, xs[i] + 16, y + hh / 2 + fs * 0.32, fs * 0.8, { weight: 900, color: C.ink2 }));
    rs.forEach((r, i) => {
      if (o.n != null && i >= o.n) return;
      const ry = y + hh + rh * i, grey = o.grey != null && i >= o.grey;
      ctx.save(); if (grey) ctx.globalAlpha = 0.35;
      const hl = (o.hl && o.hl[i]) || (o.cur === i ? "#FFF3D6" : o.marks && o.marks[i] && o.marks[i][1] ? (r.aksi === "izinkan" ? C.goodBg : C.badBg) : null);
      if (hl) { ctx.fillStyle = hl; ctx.fillRect(x + 3, ry + 1, WW - 6, rh - 2); }
      if (o.cur === i) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.strokeRect(x + 4, ry + 3, WW - 8, rh - 6); }
      ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 8, ry); ctx.lineTo(x + WW - 8, ry); ctx.stroke();
      const ty = ry + rh / 2 + fs * 0.36;
      text(ctx, String(i + 1), xs[0] + 16, ty, fs, { weight: 900, color: C.ink2 });
      text(ctx, r.aksi.toUpperCase(), xs[1] + 16, ty, fs, { weight: 900, color: colAksi(r.aksi), fit: cols[1] - 24 });
      text(ctx, r.port, xs[2] + 16, ty, fs, { weight: 800, fit: cols[2] - 24 });
      text(ctx, dariTxt(r), xs[3] + 16, ty, fs * 0.88, { weight: 700, fit: cols[3] - 24 });
      if (!o.noCek) {
        if (grey && o.greyTxt) text(ctx, o.greyTxt, xs[4] + 16, ty, fs * 0.8, { weight: 800, color: C.ink2, fit: cols[4] - 24 });
        else if (o.marks && o.marks[i]) text(ctx, o.marks[i][0], xs[4] + 16, ty, fs * 0.85, { weight: 900, color: o.marks[i][1] ? C.good : C.bad, fit: cols[4] - 24 });
      }
      ctx.restore();
    });
    if (o.pointer != null) { const py = y + hh + rh * o.pointer + rh / 2; ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(x - 14, py); ctx.lineTo(x - 42, py - 18); ctx.lineTo(x - 42, py + 18); ctx.closePath(); ctx.fill(); }
    return { W: WW, H: hh + rh * rs.length, rowY: i => y + hh + rh * i };
  }
  function packetCard(ctx, x, y, w, p, o = {}) {
    const h = o.h || 170, fs = o.fs || 1;
    card(ctx, x, y, w, h, { fill: o.fill || "#FFF9E0", stroke: o.stroke || C.accent, lw: 4, r: 18 });
    text(ctx, "📦 " + (o.title || "PAKET DATANG"), x + 22, y + 42 * fs, 22 * fs, { weight: 900, color: C.accentDark, fit: w - 40 });
    text(ctx, "ke port " + p.port, x + 22, y + 92 * fs, 38 * fs, { weight: 900, fit: w - 40 });
    text(ctx, "dari " + p.ip, x + 22, y + 132 * fs, 26 * fs, { weight: 800, color: C.ink, fit: w - 40 });
    if (!o.noWho) text(ctx, "(" + p.who + ")", x + 22, y + 162 * fs, 21 * fs, { weight: 700, color: C.ink2, fit: w - 40 });
  }
  // urutan pemeriksaan: keadaan pada waktu l
  function jalan(b, l, rs, p) {
    const m = putus(rs, p), T = stepTimes(b, m + 1);
    if (b.after) return { m, k: m + 1, done: true, since: 99, T };
    let k = 0; T.forEach(t => { if (l >= t) k++; });
    const doneAt = T[m] + 0.9, done = l >= doneAt;
    return { m, k, done, since: l - doneAt, T, cur: k > 0 && !done ? k - 1 : null, mk: k > 0 ? clamp((l - T[k - 1]) / 0.5, 0, 1) : 0 };
  }
  function marksOf(S, rs, p) {
    const mk = {}; for (let i = 0; i < S.k; i++) { if (i === S.k - 1 && !S.done && S.mk < 1) continue; const c = cek(rs[i], p); mk[i] = [c.s, c.ok]; } return mk;
  }
  // diagram kecil: internet → firewall → server, dengan paket bergerak sesuai hasil
  function mini(ctx, x, y, w, S, aksi, o = {}) {
    const cy = y + 70, xa = x + 70, xf = x + w / 2, xs = x + w - 70;
    J.cloud(ctx, xa, cy, 46, o.fromLabel || "internet", { size: 18 });
    ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(xa + 50, cy); ctx.lineTo(xs - 50, cy); ctx.stroke();
    shield(ctx, xf, cy - 4, 92); text(ctx, "firewall", xf, cy + 74, 18, { align: "center", weight: 900, color: C.ink2 });
    J.server(ctx, xs, cy, 60, 92, { label: false }); text(ctx, "server sekolah", xs, cy + 74, 18, { align: "center", weight: 900, color: C.ink2 });
    let px = lerp(xa + 30, xf - 60, ease(clamp((S.k > 0 ? 1 : 0.6), 0, 1))), py = cy - 46, gone = false;
    if (S.done) {
      const u = ease(clamp(S.since / 1.0, 0, 1));
      if (aksi === "izinkan") px = lerp(xf - 60, xs - 10, u); else { px = lerp(xf - 60, xf - 110, u); if (u >= 1) gone = true; }
    }
    if (!gone) J.packet(ctx, px, py, null, {});
    if (S.done && aksi === "tolak") text(ctx, "✕", xf - 110, py + 16, 52, { align: "center", weight: 900, color: C.bad });
    if (S.done && aksi === "izinkan" && S.since > 1) text(ctx, "✓", xs - 10, py + 16, 46, { align: "center", weight: 900, color: C.good });
  }
  function verdict(ctx, x, y, w, h, S, r, fs = 1) {
    if (!S.done) { card(ctx, x, y, w, h, { fill: C.bg2, r: 18 }); text(ctx, S.k ? "memeriksa aturan " + S.k + " …" : "menunggu …", x + w / 2, y + h / 2 + 12 * fs, 30 * fs, { align: "center", weight: 900, color: C.ink2, fit: w - 30 }); return; }
    const u = ease(clamp(S.since / 0.35, 0, 1)); ctx.save(); ctx.globalAlpha = u;
    const ok = r.aksi === "izinkan"; card(ctx, x, y, w, h, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 5, r: 18 });
    text(ctx, (ok ? "DIIZINKAN" : "DITOLAK") + " · aturan " + (S.m + 1), x + w / 2, y + h / 2 + 14 * fs, 40 * fs, { align: "center", weight: 900, color: ok ? C.good : C.bad, fit: w - 30 });
    ctx.restore();
  }
  function statusMsg(S, rs, p) {
    if (!S.k) return ["Firewall mulai membaca dari aturan 1.", C.ink2];
    if (!S.done) { const c = cek(rs[S.k - 1], p); return c.ok ? ["Aturan " + S.k + " cocok!", C.good] : ["Aturan " + S.k + ": " + c.s.slice(2) + " → lanjut ke aturan " + (S.k + 1), C.ink]; }
    const rest = rs.length - S.m - 1;
    return [rest > 0 ? "Aturan " + (S.m + 1) + " berlaku. Aturan " + (S.m + 2) + (rest > 1 ? "–" + rs.length : "") + " tidak dibaca." : "Tidak ada yang cocok: aturan bawaan berlaku.", rs[S.m].aksi === "izinkan" ? C.good : C.bad];
  }

  Object.assign(K.SCENES, {
    k22_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 240, 235, 30, { weight: 900, color: C.accentDark });
      ["membaca aturan firewall dari atas", "menebak: diizinkan atau ditolak?", "menyusun urutan aturan dengan benar"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.9) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 240, 280 + i * 110, 860, 88, { fill: C.bg2, r: 16 }); text(ctx, "✓", 280, 338 + i * 110, 36, { weight: 900, color: C.good }); text(ctx, s, 330, 336 + i * 110, 30, { weight: 800, fit: 750 }); ctx.globalAlpha = 1;
      });
      shield(ctx, 1430, 420, 260);
      const k = clamp(Math.floor((l - 0.6) / 0.7), 0, 3);
      [["IZINKAN 443", C.good], ["IZINKAN 80", C.good], ["TOLAK semua", C.bad]].forEach(([s, col], i) => { if (i >= k) return; chip(ctx, s, 1430, 610 + i * 56, { size: 24, w: 300, fill: "#fff", stroke: col, color: col }); });
    },
    k22_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 620, 400, { fill: C.bg2, r: 22 });
      text(ctx, "F11.8", 570, 390, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Troubleshooting dan Keamanan Lanjut Jaringan", 570, 460, 34, 560, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas XI", 570, 650, 26, { align: "center", weight: 700, color: C.ink2 });
      const n = clamp(Math.floor((l - 0.8) / 0.7) + 1, 0, 3);
      [["alamat IP", "memilih komputer tujuan", "203.0.113.25"], ["port", "memilih aplikasi di komputer itu", "443 = situs web"], ["firewall", "memeriksa paket dengan daftar aturan", "izinkan atau tolak"]].forEach(([t, s, e], i) => {
        if (i >= n) return; const y = 300 + i * 130; card(ctx, 960, y, 640, 112, { fill: "#fff", stroke: i === 2 ? C.accent : "#CFDCD5", lw: 3, r: 16 });
        text(ctx, t, 990, y + 44, 30, { weight: 900, color: i === 2 ? C.accentDark : C.kiko }); text(ctx, e, 1570, y + 44, 22, { align: "right", weight: 800, color: C.ink2 }); text(ctx, s, 990, y + 86, 24, { weight: 700, fit: 580 });
      });
      kiko(ctx, 1680, 760, 90, 0, { wave: l });
    },
    k22_aturan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670); heading(ctx, "FIREWALL: SATPAM DI DEPAN SERVER SEKOLAH", 200);
      const c = (b.cues || []).map(s => at(b, s)), n = c.filter(t => l >= t).length;
      mini(ctx, 460, 222, 1000, { k: 0, done: false }, null);
      const rows = n >= 4 ? 5 : n >= 1 ? 4 : 0;
      const hl = {}; if (n >= 2 && n < 4) { /* sorot kolom lewat penanda */ }
      const T = rules(ctx, 300, 410, RS.A, { rh: 62, hh: 50, fs: 25, n: rows, noCek: true, cw: [70, 190, 150, 520], hl: n >= 4 ? { 4: "#FFF3D6" } : {} });
      // penanda kolom
      if (n >= 2) { const u = n === 2 ? 1 : 0.45; ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, 300 + 70, 410, 190, T.H, 10); ctx.stroke(); ctx.restore(); }
      if (n >= 3) { const u = n === 3 ? 1 : 0.45; ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = C.kiko; ctx.lineWidth = 4; rr(ctx, 300 + 260, 410, 670, T.H, 10); ctx.stroke(); ctx.restore(); }
      if (rows) { arrow(ctx, 1340, 470, 1340, 760, C.accent, 7); text(ctx, "dibaca", 1380, 560, 30, { weight: 900, color: C.accentDark }); text(ctx, "dari atas", 1380, 600, 30, { weight: 900, color: C.accentDark }); text(ctx, "ke bawah", 1380, 640, 30, { weight: 900, color: C.accentDark }); }
      if (n >= 4) { text(ctx, "← aturan bawaan:", 1380, 712, 24, { weight: 900, color: C.bad }); text(ctx, "tolak sisanya", 1380, 744, 24, { weight: 900, color: C.bad }); }
    },
    k22_periksa(ctx, b, l) {
      const rs = RS[b.rs || "A"], p = PK[b.pk], S = jalan(b, l, rs, p), r = rs[S.m];
      card(ctx, 120, 150, 1680, 670);
      heading(ctx, b.rs === "B" ? "URUTAN BARU: ATURAN BLOKIR DIPINDAH KE BARIS 3" : "FIREWALL MEMERIKSA PAKET DARI ATAS KE BAWAH", 200);
      packetCard(ctx, 170, 240, 470, p);
      mini(ctx, 160, 432, 490, S, r.aksi, { fromLabel: p.who === "laptop admin" ? "lab" : "internet" });
      verdict(ctx, 170, 630, 470, 98, S, r);
      const marks = marksOf(S, rs, p);
      const T = rules(ctx, 720, 240, rs, { rh: 70, hh: 54, fs: 26, cw: [56, 160, 116, 420, 300], cur: S.cur, marks, grey: S.done ? S.m + 1 : null, greyTxt: "tidak dibaca", pointer: S.done ? S.m : S.cur, hl: b.rs === "B" ? { 2: S.done ? null : "#F3ECFF" } : null });
      const [msg, col] = statusMsg(S, rs, p);
      card(ctx, 720, 660, 1052, 68, { fill: S.done ? (r.aksi === "izinkan" ? C.goodBg : C.badBg) : C.bg2, r: 14 });
      text(ctx, msg, 1246, 704, 27, { align: "center", weight: 900, color: col, fit: 1010 });
      if (b.after && l > A(b) * 0.55) banner(ctx, "dibaca dari atas · aturan pertama yang cocok yang berlaku", 742, { w: 1100, size: 28 });
    },
    k22_tanya(ctx, b, l) {
      const v = b.v; card(ctx, 120, 150, 1680, 670);
      const H2 = { 1: "VARIASI 1 · PORT 80 LAWAN PORT 8080", 2: "VARIASI 2 · PORT 22 DARI INTERNET", 3: "VARIASI 3 · ALAMAT YANG DIBLOKIR", 4: "VARIASI 4 · URUTAN ATURAN DITUKAR" };
      heading(ctx, H2[v]);
      const rs = v === 4 ? RS.B : RS.A;
      if (v === 1) { packetCard(ctx, 170, 250, 470, PK.p80, { h: 150, noWho: true, title: "PAKET A" }); packetCard(ctx, 170, 425, 470, PK.p8080, { h: 150, noWho: true, title: "PAKET B" }); }
      else if (v === 2) { packetCard(ctx, 170, 250, 470, PK.p22); text(ctx, "port 22 = login jarak jauh", 405, 470, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "ke server", 405, 502, 24, { align: "center", weight: 800, color: C.ink2 }); }
      else { packetCard(ctx, 170, 250, 470, PK.p66, { stroke: C.bad, fill: C.badBg }); if (v === 3) { text(ctx, "pernah mengirim ribuan", 405, 470, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "paket aneh", 405, 502, 24, { align: "center", weight: 800, color: C.ink2 }); } else { text(ctx, "paket yang sama", 405, 470, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "seperti variasi 3", 405, 502, 24, { align: "center", weight: 800, color: C.ink2 }); } }
      const hl = {}; if (v === 2) hl[3] = "#FFF3D6"; if (v === 3) { hl[0] = "#FFF3D6"; hl[1] = "#FFF3D6"; } if (v === 4) hl[2] = "#F3ECFF";
      rules(ctx, 720, 245, rs, { rh: 70, hh: 52, fs: 25, noCek: true, cw: [64, 180, 150, 600], hl });
      if (v === 4) { const y = 245 + 52 + 70 * 2 + 35; arrow(ctx, 1640, 245 + 52 + 35, 1640, y - 6, "#7A4FC9", 5); text(ctx, "dulu baris 1", 1600, 245 + 52 + 50, 20, { align: "right", weight: 900, color: "#7A4FC9" }); }
      if (!b.pilih) { const Q = { 1: "Apakah kedua paket diizinkan?", 2: "Aturan mana yang memutuskan paket ini?", 3: "Aturan 1 atau aturan 2 yang menang?", 4: "Apakah hasilnya tetap sama?" }; text(ctx, Q[v], 960, 785, 30, { align: "center", weight: 900, color: C.accentDark }); }
    },
    k22_tebak(ctx, b, l) {
      K.SCENES.k22_tanya(ctx, b, 5);
      const n = b.pilih.length, w = 440, g = 30, x0 = 960 - (n * w + (n - 1) * g) / 2;
      b.pilih.forEach((s, i) => { card(ctx, x0 + i * (w + g), 718, w, 70, { fill: "#fff", stroke: C.kiko, lw: 3, r: 35 }); text(ctx, "ABC"[i] + ". " + s, x0 + i * (w + g) + w / 2, 763, 28, { align: "center", weight: 900, color: C.kikoDark, fit: w - 30 }); });
      thinking(ctx, 1730, 215, l, b.dur);
    },
    k22_banding(ctx, b, l) {
      const v = b.v, n = clamp(Math.floor((l - 0.3) / 0.7) + 1, 0, 5);
      card(ctx, 120, 150, 1680, 670);
      if (v === 1) {
        heading(ctx, "TIGA PAKET, TIGA NASIB");
        const rows = [["port 443", "aturan 2", "DIIZINKAN"], ["port 80", "aturan 3", "DIIZINKAN"], ["port 8080", "aturan 5 (bawaan)", "DITOLAK"]];
        const x = 360, y = 250, cw = [360, 420, 420], rh = 84;
        card(ctx, x, y, 1200, 60 + rh * 3, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, 1200, 60, 14); ctx.fill(); ctx.fillRect(x, y + 30, 1200, 30);
        ["paket", "aturan yang cocok", "hasil"].forEach((h, i) => text(ctx, h, x + cw.slice(0, i).reduce((a, c) => a + c, 0) + cw[i] / 2, y + 40, 24, { align: "center", weight: 900, color: C.ink2 }));
        rows.forEach((r, i) => { if (i >= n) return; const ry = y + 60 + rh * i; if (i === 2) { ctx.fillStyle = C.badBg; ctx.fillRect(x + 3, ry, 1194, rh - 2); } let cx = x; r.forEach((s, j) => { text(ctx, s, cx + cw[j] / 2, ry + rh / 2 + 11, 30, { align: "center", weight: 900, color: j === 2 ? (s === "DITOLAK" ? C.bad : C.good) : C.ink }); cx += cw[j]; }); });
        if (l > A(b) * 0.35) banner(ctx, "angka port harus sama persis: 8080 bukan 80", 590, { w: 1100 });
        if (l > A(b) * 0.65) banner(ctx, "port yang tidak ada di daftar → aturan bawaan → ditolak", 680, { w: 1100, fill: C.badBg, stroke: C.bad, color: C.bad });
      } else if (v === 2) {
        heading(ctx, "ATURAN 4: DUA SYARAT HARUS COCOK SEMUANYA");
        rules(ctx, 300, 245, [R22], { rh: 76, hh: 52, fs: 27, noCek: true, cw: [70, 200, 160, 890], hl: { 0: "#FFF3D6" } });
        const items = [["syarat port", "22 = 22", true], ["syarat alamat", "203.0.113.25 ≠ 192.168.1.10", false]];
        items.forEach(([t, s, ok], i) => { if (i >= n) return; const x = 300 + i * 670; card(ctx, x, 410, 640, 140, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 4, r: 16 }); text(ctx, t, x + 30, 455, 24, { weight: 900, color: C.ink2 }); text(ctx, s + (ok ? "  ✓" : "  ✗"), x + 30, 515, 32, { weight: 900, color: ok ? C.good : C.bad, fit: 590 }); });
        if (n >= 3) { text(ctx, "+", 960, 495, 50, { align: "center", weight: 900, color: C.ink2 }); }
        if (l > A(b) * 0.45) banner(ctx, "satu syarat gagal → aturan 4 tidak berlaku → lanjut ke aturan 5", 590, { w: 1320 });
        if (l > A(b) * 0.65) { J.laptop(ctx, 760, 715, 70); text(ctx, "pintu login hanya untuk laptop admin", 830, 725, 28, { weight: 900, color: C.kiko }); }
      } else if (v === 3) {
        heading(ctx, "DUA ATURAN COCOK, YANG DI ATAS MENANG");
        rules(ctx, 300, 250, RS.A.slice(0, 2), { rh: 84, hh: 54, fs: 28, cw: [70, 190, 150, 560, 350], marks: n >= 1 ? Object.assign({ 0: ["✓ cocok · dipakai", true] }, n >= 2 ? { 1: ["✓ cocok · tak dibaca", true] } : {}) : {}, hl: { 1: n >= 2 ? "#F1F4F2" : null }, pointer: 0 });
        if (n >= 3) packetCard(ctx, 300, 500, 560, PK.p66, { h: 170, title: "PAKET INI", stroke: C.bad, fill: C.badBg });
        if (n >= 3) { arrow(ctx, 880, 585, 1000, 585, C.bad, 6); card(ctx, 1020, 520, 600, 130, { fill: C.badBg, stroke: C.bad, lw: 5, r: 18 }); text(ctx, "DITOLAK · aturan 1", 1320, 600, 40, { align: "center", weight: 900, color: C.bad }); }
        if (l > A(b) * 0.6) banner(ctx, "satu paket hanya diputuskan oleh satu aturan", 700, { w: 1000 });
      } else {
        heading(ctx, "PAKET SAMA, URUTAN BEDA, HASIL BEDA");
        [["URUTAN LAMA", RS.A, 0], ["URUTAN BARU", RS.B, 1]].forEach(([t, rs, i]) => {
          if (i >= Math.max(1, n)) return; const x = 170 + i * 820, m = putus(rs, PK.p66), ok = rs[m].aksi === "izinkan";
          text(ctx, t, x + 380, 255, 28, { align: "center", weight: 900, color: i ? "#7A4FC9" : C.ink2 });
          const mk = {}; mk[m] = ["✓ cocok", true];
          rules(ctx, x, 275, rs, { rh: 56, hh: 44, fs: 21, cw: [44, 130, 100, 300, 186], marks: mk, grey: m + 1, pointer: null, hl: i ? { 2: "#F3ECFF" } : null });
          card(ctx, x + 80, 610, 600, 74, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 4, r: 16 }); text(ctx, (ok ? "DIIZINKAN" : "DITOLAK") + " · aturan " + (m + 1), x + 380, 660, 32, { align: "center", weight: 900, color: ok ? C.good : C.bad });
        });
        if (l > A(b) * 0.5) banner(ctx, "khusus di atas · umum di bawahnya · bawaan paling akhir", 715, { w: 1200 });
      }
    },
    k22_latihan(ctx, b, l) {
      const a = A(b), t = [a * 0.1, a * 0.3, a * 0.42];
      const rulesRow = { custom: (ctx, x, y, w) => {
        const R = [["1", "izinkan", "443", "mana saja"], ["2", "izinkan", "80", "mana saja"], ["3", "izinkan", "22", "10.0.1.2 (laptop admin)"], ["4", "izinkan", "3389", "10.0.1.0/24 (admin)"], ["5", "tolak", "semua", "mana saja"]];
        ctx.fillStyle = C.bg2; rr(ctx, x, y, w, 22, 6); ctx.fill(); [["#", 8], ["aksi", 30], ["port", 96], ["dari", 150]].forEach(([s, dx]) => text(ctx, s, x + dx, y + 15, 11, { weight: 800, color: C.ink2 }));
        R.forEach((r, i) => { const yy = y + 26 + i * 22; [[r[0], 8], [r[1], 30], [r[2], 96], [r[3], 150]].forEach(([s, dx], j) => text(ctx, s, x + dx, yy + 14, 11.5, { weight: j === 1 ? 900 : 700, color: j === 1 ? colAksi(r[1]) : C.ink })); });
        y += 26 + R.length * 22 + 8;
        ctx.fillStyle = "#FFF9E0"; rr(ctx, x, y, w, 30, 8); ctx.fill(); text(ctx, "📦 paket → port 443 · dari 10.0.9.7 (HP tamu)", x + 10, y + 20, 12, { weight: 800 });
        return y + 40; } };
      K.halaman(ctx, 250, 190, 1.15, { url: "belajar-informatika.vercel.app/f118", judul: "Detektif jaringan, penjaga firewall, audit router",
        rows: [{ tabs: ["1 Detektif jaringan", "2 Penjaga firewall", "3 Audit router"], on: -1 },
          { task: "Tujuh paket datang. Baca daftar aturan dari atas ke bawah dan putuskan: izinkan atau tolak." },
          rulesRow, { buttons: ["IZINKAN", "TOLAK"], cols: 2, on: -1 }],
        taps: [[0, 1, t[0]], [3, 0, t[1]]] }, l, { h: 535 });
      if (l >= t[1] + 0.5) { ctx.save(); ctx.translate(250, 190); ctx.scale(1.15, 1.15); ctx.fillStyle = C.goodBg; rr(ctx, 34, 440, 332, 34, 10); ctx.fill(); text(ctx, "Tepat: cocok dengan aturan 1.", 50, 462, 13, { weight: 800, color: C.good }); ctx.restore(); }
      const n = l < t[0] ? 0 : l < t[1] ? 1 : l < a * 0.6 ? 2 : 3;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN F11.8", ["Klik 2 Penjaga firewall.", "Baca aturan dari atas, lalu pilih IZINKAN atau TOLAK.", "Selesaikan ketujuh paket."], n);
      card(ctx, 840, 540, 880, 230, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 585, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Di kertas, susun daftar aturan firewall untuk server kantin, lalu uji dengan tiga paket buatanmu.", 870, 630, 28, 820, { weight: 700, lh: 1.3 });
    },

    // ---------- Short (area 40–1040 × 20–810) ----------
    k22s_periksa(ctx, b, l) {
      const rs = RS[b.rs || "A"], p = PK[b.pk], S = jalan(b, l, rs, p), r = rs[S.m];
      packetCard(ctx, 60, 30, 960, p, { h: 150, noWho: false, title: b.rs === "B" ? "PAKET YANG SAMA · URUTAN BARU" : "PAKET DATANG", fs: 1.15 });
      rules(ctx, 60, 205, rs, { rh: 74, hh: 50, fs: 28, cw: [50, 170, 120, 360, 260], cur: S.cur, marks: marksOf(S, rs, p), grey: S.done ? S.m + 1 : null, greyTxt: "tak dibaca", hl: b.rs === "B" ? { 2: S.done ? null : "#F3ECFF" } : null });
      verdict(ctx, 60, 650, 960, 130, S, r, 1.4);
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
