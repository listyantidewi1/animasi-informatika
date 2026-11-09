/* D03 bab 7: "Tanda-tanda yang perlu dicurigai" (b7_1, b7_2, b7_3, b7_4).
   Metafora utama bab: BENDERA MERAH. Satu panggung bersambung di kamar Bu Rina (malam, lampu menyala):
   Bu Rina duduk di tepi ranjang menerima telepon; setiap kalimat penelepon muncul sebagai gelembung besar,
   dan setiap tanda bahaya menjadi satu baris di papan "Tanda bahaya" di kiri, lalu Bip mengibarkan bendera merah
   dan bendera kecil menempel di baris itu.
   b7_1 suara di telepon terdengar mirip anak (spektrogram anak, seed 23, centang "mirip") → papan masuk, Bip mengangkat bendera.
   b7_2 tanda 1–3: nomor baru + "HP-ku rusak", rekening teman (bukan rekening keluarga), "jangan bilang Ayah".
   b7_3 tanda 4–5: Bu Rina minta menelepon balik → ditolak; Bu Rina bertanya nama kucing → panggilan diputus ("tut… tut…"),
        Bu Rina menurunkan HP; awan pikiran: "Si Oyen" (hanya keluarga yang tahu).
   b7_4 papan menyusut menjadi lima ikon berbendera, bendera Bip ditancapkan; HP Bu Rina membesar ke tengah (layar transfer
        Rp3.000.000), jari Bip ragu di atas "Transfer", BERHENTI pada "berhentilah sejenak"; awan pikiran: uang terbang ke pelaku
        dan panah kembali patah ("sulit kembali"); pada "bertanya" Bip menekan "Tunggu" → centang hijau, Bu Rina lega.
   Semua keadaan dihitung dari waktu absolut (EV) sehingga silang-pudar antarbeat tidak terlihat; kamera sendiri (noCam). */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, L = KIT.layar, O = KIT.orang, LT = KIT.latar, B = KIT.bipkit;
  const { clamp, lerp, eio, eout, spring } = D;
  const W = 1920, HH = 1080, TAU = Math.PI * 2, FONT = K.FONT;
  const IBU = Object.assign({}, L.SUARA.ibu, { seed: 11 }), ANAK = Object.assign({}, L.SUARA.anak, { seed: 23 });
  const INK = "#1C2050", CREAM = "#FFF6E6", RED = "#FF5A5F";

  // ---------- waktu kejadian (detik absolut, dari kata sungguhan) ----------
  let EVk = null, EVc = null;
  function EV(TL) {
    if (EVk === TL && EVc) return EVc;
    const bb = id => TL.beats.find(x => x.id === id);
    const A = (id, s, o = 0) => { const b = bb(id); return b.start + D.at(b, s) + o; };
    const E = (id, s, o = 0) => { const b = bb(id); return b.start + D.atEnd(b, s) + o; };
    const e = {};
    ["b7_1", "b7_2", "b7_3", "b7_4"].forEach(id => { const b = bb(id); e[id] = b.start; e[id + "e"] = b.start + b.dur; e[id + "s"] = b.start + D.speechEnd(b); });
    // b7_1
    e.walau = A("b7_1", "Walaupun"); e.suara = A("b7_1", "suaranya"); e.yakin = A("b7_1", "meyakinkan"); e.cerita = A("b7_1", "ceritanya");
    e.tanda = A("b7_1", "tanda yang sama"); e.sama = A("b7_1", "sama.");
    // b7_2
    e.tel = A("b7_2", "Telepon datang"); e.nomor = A("b7_2", "nomor baru"); e.alasan = A("b7_2", "alasan"); e.rusak = A("b7_2", "rusak");
    e.pen1 = A("b7_2", "Penelepon meminta"); e.minta = A("b7_2", "meminta uang"); e.rekLain = A("b7_2", "rekening orang lain"); e.bukan = A("b7_2", "bukan rekening");
    e.rekKel = A("b7_2", "rekening keluarga"); e.pen2 = A("b7_2", "Penelepon melarangmu"); e.larang = A("b7_2", "melarangmu"); e.anggota = A("b7_2", "anggota keluarga");
    // b7_3
    e.pen3 = A("b7_3", "Penelepon juga"); e.tolak = A("b7_3", "menolak"); e.balik = A("b7_3", "menelepon balik"); e.balikE = E("b7_3", "balik,");
    e.atau = A("b7_3", "atau tiba-tiba"); e.putus = A("b7_3", "memutus panggilan"); e.tanya = A("b7_3", "bertanya"); e.hanya = A("b7_3", "hanya diketahui");
    // b7_4
    e.kalau = A("b7_4", "Kalau satu"); e.satu = A("b7_4", "satu saja"); e.muncul = A("b7_4", "muncul,"); e.henti = A("b7_4", "berhentilah"); e.jenak = A("b7_4", "sejenak.");
    e.uang = A("b7_4", "Uang yang"); e.kirim = A("b7_4", "terkirim"); e.sulit = A("b7_4", "sangat sulit"); e.kembali = A("b7_4", "kembali,");
    e.tetapi = A("b7_4", "tetapi"); e.btanya = A("b7_4", "bertanya,"); e.tidak = A("b7_4", "tidak pernah"); e.rugi = A("b7_4", "merugikan.");
    // lima tanda: baris muncul (rowIn) dan bendera menempel (flag)
    e.sign = [
      { rowIn: e.nomor, flag: e.rusak },
      { rowIn: e.rekLain - 0.1, flag: e.bukan },
      { rowIn: e.larang, flag: e.anggota },
      { rowIn: e.tolak, flag: e.balik },
      { rowIn: e.putus, flag: e.tanya },
    ];
    e.press = e.btanya + 0.1;   // Bip menekan "Tunggu"
    EVk = TL; EVc = e; return e;
  }

  const win = (t, a, b, fi = 0.3, fo = 0.3) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));
  const pop = (t, t0, k = 11, z = 0.5) => (t <= t0 ? 0 : Math.min(1.08, spring(t - t0, k, z)));
  const ramp = (t, t0, d = 0.5) => clamp((t - t0) / d);

  const mixHex = (a, b, u) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), Bq = p(b);
    return "rgb(" + A.map((v, i) => Math.round(lerp(v, Bq[i], u))).join(",") + ")"; };
  // ---------- teks ----------
  function font(c, size, w = 800) { c.font = `${w} ${size}px ${FONT}`; }
  function wrap(c, s, maxW) { const words = s.split(/\s+/), out = []; let cur = "";
    for (const w of words) { const n = cur ? cur + " " + w : w; if (c.measureText(n).width > maxW && cur) { out.push(cur); cur = w; } else cur = n; } if (cur) out.push(cur); return out; }
  function say(c, s, x, y, size, col, o = {}) { font(c, size, o.w || 800); c.fillStyle = col; c.textAlign = o.align || "center"; c.textBaseline = "middle"; c.fillText(s, x, y); c.textBaseline = "alphabetic"; c.textAlign = "left"; }

  // gelembung ucapan. o.x0 kiri (atau o.right kanan), o.y0 atas; ekor dari sisi o.side ('bawah'|'kiri') menuju o.to, panjang ≤ 90 px.
  function bubble(c, text, o) {
    const a = o.a == null ? 1 : o.a; if (a <= 0.001) return null;
    const fs = o.fs || 46, pad = o.pad || 28;
    font(c, fs, 800); const lines = wrap(c, text, o.maxW - pad * 2);
    const tw = Math.max(...lines.map(s => c.measureText(s).width));
    const bw = tw + pad * 2, bh = lines.length * fs * 1.18 + pad * 1.25;
    const bx = o.right != null ? o.right - bw : o.x0, by = o.y0, r = Math.min(34, bh / 2);
    // pangkal & ujung ekor
    let base, tip;
    if ((o.side || "bawah") === "bawah") { const tx = clamp(o.to[0], bx + r + 30, bx + bw - r - 30); base = [tx, by + bh - 2]; }
    else { const ty = clamp(o.to[1], by + r + 26, by + bh - r - 26); base = [bx + 2, ty]; }
    const dx = o.to[0] - base[0], dy = o.to[1] - base[1], d = Math.hypot(dx, dy) || 1, L = Math.min(90, d - (o.gap || 14));
    tip = [base[0] + dx / d * L, base[1] + dy / d * L];
    const s = o.s == null ? 1 : o.s;
    c.save(); c.globalAlpha *= clamp(a * 1.6);
    c.translate(tip[0], tip[1]); c.scale(s, s); c.translate(-tip[0], -tip[1]);
    const fill = o.fill || "#FFFFFF";
    c.fillStyle = "rgba(14,18,60,0.28)"; H.rr(c, bx + 6, by + 10, bw, bh, r); c.fill();
    const nx = -dy / d, ny = dx / d, hw = 24;   // lebar pangkal ekor, tegak lurus arah ekor
    c.fillStyle = fill; c.beginPath(); c.moveTo(base[0] + nx * hw, base[1] + ny * hw);
    c.quadraticCurveTo(lerp(base[0], tip[0], 0.6) + nx * 6, lerp(base[1], tip[1], 0.6) + ny * 6, tip[0], tip[1]);
    c.quadraticCurveTo(lerp(base[0], tip[0], 0.5) - nx * 10, lerp(base[1], tip[1], 0.5) - ny * 10, base[0] - nx * hw, base[1] - ny * hw); c.closePath(); c.fill();
    H.rr(c, bx, by, bw, bh, r); c.fill();
    if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = 5; H.rr(c, bx, by, bw, bh, r); c.stroke(); }
    font(c, fs, 800); c.fillStyle = o.color || INK; c.textBaseline = "middle"; c.textAlign = "left";
    lines.forEach((ln, i) => c.fillText(ln, bx + pad, by + bh / 2 + (i - (lines.length - 1) / 2) * fs * 1.18 + fs * 0.03));
    c.textBaseline = "alphabetic";
    if (o.badge) o.badge(c, bx + 6, by + 6);
    c.restore();
    return { x: bx, y: by, w: bw, h: bh };
  }
  // awan pikiran: (cx, cy) tengah, w × h, ekor bulatan kecil menuju (hx, hy)
  function awan(c, cx, cy, w, h, hx, hy, a, t) {
    if (a <= 0.001) return; c.save(); c.globalAlpha *= clamp(a * 1.5);
    const s = 0.6 + 0.4 * Math.min(1.05, a); c.translate(cx, cy); c.scale(s, s); c.translate(-cx, -cy);
    const puffs = []; const n = 11;
    for (let i = 0; i < n; i++) { const ang = i / n * TAU, r = Math.min(w, h) * (0.2 + 0.03 * Math.sin(i * 2.3)); puffs.push([cx + Math.cos(ang) * (w / 2 - r * 0.7), cy + Math.sin(ang) * (h / 2 - r * 0.7), r * (1 + 0.025 * Math.sin(t * 1.6 + i))]); }
    c.fillStyle = "rgba(14,18,60,0.25)"; puffs.forEach(([x, y, r]) => { c.beginPath(); c.arc(x + 6, y + 10, r, 0, TAU); c.fill(); }); c.beginPath(); c.ellipse(cx + 6, cy + 10, w / 2 - 30, h / 2 - 30, 0, 0, TAU); c.fill();
    c.fillStyle = "#F4F1FF"; puffs.forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }); c.beginPath(); c.ellipse(cx, cy, w / 2 - 30, h / 2 - 30, 0, 0, TAU); c.fill();
    // bulatan kecil ke kepala
    const sx = cx + (hx - cx) * 0.45, sy = cy + h / 2 - 10;
    [[0.0, 22], [0.45, 15], [0.8, 10]].forEach(([u, r]) => { c.beginPath(); c.arc(lerp(sx, hx, u), lerp(sy, hy, u), r, 0, TAU); c.fill(); });
    c.restore();
  }
  function kucing(c, x, y, r, t) {   // kepala kucing oranye sederhana ("Si Oyen")
    c.save(); c.translate(x, y); const ear = (sx) => { c.beginPath(); c.moveTo(sx * r * 0.85, -r * 0.35); c.lineTo(sx * r * 0.7, -r * 1.15); c.lineTo(sx * r * 0.2, -r * 0.8); c.closePath(); c.fill(); };
    c.fillStyle = "#F29A3E"; ear(-1); ear(1); c.beginPath(); c.ellipse(0, 0, r, r * 0.86, 0, 0, TAU); c.fill();
    c.fillStyle = "#FFB867"; [-1, 1].forEach(sx => { c.beginPath(); c.moveTo(sx * r * 0.7, -r * 0.48); c.lineTo(sx * r * 0.62, -r * 0.95); c.lineTo(sx * r * 0.34, -r * 0.72); c.closePath(); c.fill(); });
    c.fillStyle = "#D67A28"; for (let i = -1; i <= 1; i++) { H.rr(c, i * r * 0.22 - r * 0.05, -r * 0.84, r * 0.1, r * 0.34, r * 0.05); c.fill(); }
    c.fillStyle = "#FFE7C4"; c.beginPath(); c.ellipse(0, r * 0.38, r * 0.48, r * 0.34, 0, 0, TAU); c.fill();
    const bl = (Math.sin(t * 1.3) > 0.97) ? 0.15 : 1;
    c.fillStyle = "#2A2033"; [-1, 1].forEach(sx => { c.beginPath(); c.ellipse(sx * r * 0.38, -r * 0.08, r * 0.1, r * 0.15 * bl, 0, 0, TAU); c.fill(); });
    c.fillStyle = "#FF8FA3"; c.beginPath(); c.moveTo(-r * 0.09, r * 0.2); c.lineTo(r * 0.09, r * 0.2); c.lineTo(0, r * 0.31); c.closePath(); c.fill();
    c.strokeStyle = "rgba(60,40,40,0.6)"; c.lineWidth = Math.max(2, r * 0.035); c.lineCap = "round";
    [-1, 1].forEach(sx => { for (let j = -1; j <= 1; j += 2) { c.beginPath(); c.moveTo(sx * r * 0.45, r * 0.32); c.lineTo(sx * r * 1.15, r * (0.26 + j * 0.12)); c.stroke(); } });
    c.restore();
  }
  function uangKertas(c, x, y, s, rot, a) {   // selembar uang kertas hijau "Rp"
    if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
    c.fillStyle = "rgba(14,18,60,0.25)"; H.rr(c, -s / 2 + 4, -s * 0.27 + 6, s, s * 0.54, s * 0.08); c.fill();
    c.fillStyle = "#5BD68A"; H.rr(c, -s / 2, -s * 0.27, s, s * 0.54, s * 0.08); c.fill();
    c.strokeStyle = "#2E9E5E"; c.lineWidth = s * 0.04; H.rr(c, -s / 2 + s * 0.07, -s * 0.2, s - s * 0.14, s * 0.4, s * 0.05); c.stroke();
    c.fillStyle = "#2E9E5E"; c.beginPath(); c.arc(0, 0, s * 0.14, 0, TAU); c.fill(); c.fillStyle = "#9BEBB9"; c.beginPath(); c.arc(0, 0, s * 0.07, 0, TAU); c.fill(); c.restore();
  }


  // ---------- layar HP (digambar sendiri: tanpa huruf kecil) ----------
  function tanyaPath(c, x, y, r, col) {   // tanda tanya dari garis, bukan huruf
    c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = r * 0.28; c.lineCap = "round";
    c.beginPath(); c.arc(x, y - r * 0.32, r * 0.36, Math.PI * 1.1, Math.PI * 2.35); c.lineTo(x, y + r * 0.22); c.stroke();
    c.beginPath(); c.arc(x, y + r * 0.62, r * 0.16, 0, TAU); c.fill(); c.restore();
  }
  function avatarQ(c, cx, cy, r, col = "#9AA6D8") {
    L.avatar(c, cx, cy, r, col);
    c.fillStyle = P.amber; c.beginPath(); c.arc(cx + r * 0.72, cy - r * 0.72, r * 0.38, 0, TAU); c.fill(); tanyaPath(c, cx + r * 0.72, cy - r * 0.72, r * 0.42, "#3A2A10");
  }
  function layarKecil(c, w, h, t, mode) {   // layar HP Bu Rina (ukuran kecil, hanya bentuk)
    const g = c.createLinearGradient(0, 0, 0, h);
    if (mode === "putus") { g.addColorStop(0, "#5B6390"); g.addColorStop(1, "#3B416A"); c.fillStyle = g; c.fillRect(0, 0, w, h); B.ikon(c, "putus", w / 2, h * 0.45, w * 0.26, { t }); return; }
    if (mode === "transfer") { c.fillStyle = "#EEF1FB"; c.fillRect(0, 0, w, h); c.fillStyle = "#5A62D8"; c.fillRect(0, 0, w, h * 0.16);
      c.fillStyle = "#FFFFFF"; H.rr(c, w * 0.08, h * 0.22, w * 0.84, h * 0.26, w * 0.06); c.fill();
      c.fillStyle = "#FF5F78"; H.rr(c, w * 0.1, h * 0.58, w * 0.8, h * 0.12, w * 0.06); c.fill(); c.fillStyle = "#24BFA8"; H.rr(c, w * 0.1, h * 0.75, w * 0.8, h * 0.12, w * 0.06); c.fill(); return; }
    g.addColorStop(0, "#5560D8"); g.addColorStop(1, "#7A54C8"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    avatarQ(c, w / 2, h * 0.3, w * 0.2);
    for (let i = 0; i < 7; i++) { const a = 0.3 + 0.7 * Math.abs(Math.sin(t * 7 + i * 1.3)); c.fillStyle = "rgba(255,255,255,0.8)"; H.rr(c, w * (0.2 + i * 0.09), h * 0.55 - a * h * 0.05, w * 0.05, a * h * 0.1, w * 0.025); c.fill(); }
    c.fillStyle = "#FF5A5F"; c.beginPath(); c.arc(w / 2, h * 0.82, w * 0.13, 0, TAU); c.fill();
  }
  // layar transfer besar: huruf ≥ 44 px pada HP setinggi ±760 px; mengembalikan kotak tombol (koordinat layar)
  function layarTransfer(c, w, h, t, o = {}) {
    c.fillStyle = "#EEF1FB"; c.fillRect(0, 0, w, h);
    const hh = h * 0.13, hg = c.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#4766DE"); hg.addColorStop(1, "#6A57D8"); c.fillStyle = hg; c.fillRect(0, 0, w, hh);
    c.fillStyle = "rgba(255,255,255,0.22)"; c.beginPath(); c.arc(w * 0.16, hh * 0.58, hh * 0.3, 0, TAU); c.fill(); L.ikon(c, "bank", w * 0.16, hh * 0.58, hh * 0.32, "#FFFFFF");
    say(c, "Bank", w * 0.3, hh * 0.6, 46, "#FFFFFF", { align: "left", w: 900 });
    // kartu penerima
    const cy0 = hh + h * 0.04, chh = h * 0.36;
    c.fillStyle = "rgba(60,70,150,0.12)"; H.rr(c, w * 0.05, cy0 + 5, w * 0.9, chh, 22); c.fill(); c.fillStyle = "#FFFFFF"; H.rr(c, w * 0.05, cy0, w * 0.9, chh, 22); c.fill();
    L.avatar(c, w * 0.2, cy0 + chh * 0.25, w * 0.09, "#B3BCEB");
    say(c, "Rekening", w * 0.33, cy0 + chh * 0.18, 44, INK, { align: "left", w: 800 }); say(c, "teman", w * 0.33, cy0 + chh * 0.36, 44, INK, { align: "left", w: 800 });
    c.fillStyle = "#E6E9F6"; c.fillRect(w * 0.1, cy0 + chh * 0.52, w * 0.8, 3);
    font(c, 54, 900); let fs = 54; const nw = c.measureText("Rp3.000.000").width; if (nw > w * 0.84) fs = Math.max(44, Math.floor(54 * w * 0.84 / nw));
    say(c, "Rp3.000.000", w / 2, cy0 + chh * 0.76, fs, INK, { w: 900 });
    // tombol; o.off 0..1: "Transfer" dimatikan (abu-abu, mengecil, gembok)
    const out = {}, bw = w * 0.84, bh = h * 0.115, off = clamp(o.off || 0);
    [["transfer", "Transfer", "#FF5F78", h * 0.66], ["tunggu", "Tunggu", "#24BFA8", h * 0.82]].forEach(([k, lab, col0, by]) => {
      const x = (w - bw) / 2, pr = k === "tunggu" ? clamp(o.press || 0) : 0, on = o.highlight === k, bl = on ? 0.5 + 0.5 * Math.sin(t * 7) : 0, dn = pr * 8;
      const dis = k === "transfer" ? off : 0, col = dis > 0 ? mixHex(col0, "#9AA0BE", dis) : col0;
      c.save();
      if (dis > 0) { const sc = 1 - 0.05 * dis; c.translate(w / 2, by + bh / 2); c.scale(sc, sc); c.translate(-w / 2, -(by + bh / 2)); c.globalAlpha *= 1 - 0.4 * dis; }
      if (on) D.glow(c, w / 2, by + bh / 2, bw * 0.75, col, (k === "transfer" ? 0.45 * bl : 0.55));
      c.fillStyle = dis > 0.5 ? "#6E7493" : (col0 === "#FF5F78" ? "#B83A52" : "#178A79"); H.rr(c, x, by + 8, bw, bh, bh / 2); c.fill();
      c.fillStyle = col; H.rr(c, x, by + dn, bw, bh, bh / 2); c.fill();
      if (k === "transfer" && on) { c.fillStyle = D.hexA("#FFFFFF", 0.25 * bl); H.rr(c, x, by + dn, bw, bh, bh / 2); c.fill(); }
      c.fillStyle = "rgba(255,255,255,0.22)"; H.rr(c, x + bh * 0.3, by + dn + bh * 0.12, bw - bh * 0.6, bh * 0.2, bh * 0.1); c.fill();
      say(c, lab, w / 2 + (dis > 0 ? 30 * dis : 0), by + dn + bh / 2 + 2, 50, "#FFFFFF", { w: 900 });
      if (dis > 0) B.gembok(c, x + bh * 0.62, by + bh / 2, bh * 0.62 * Math.min(1, spring(dis * 0.8, 12, 0.5)), { locked: 1, color: "#59608C" });
      if (pr > 0 && pr < 1) { c.strokeStyle = D.hexA("#FFFFFF", 0.8 * (1 - pr)); c.lineWidth = 6; c.beginPath(); c.arc(x + bw * 0.12, by + bh / 2, 20 + 120 * eout(pr), 0, TAU); c.stroke(); }
      c.restore();
      out[k] = { x, y: by, w: bw, h: bh, cx: w / 2, cy: by + bh / 2 };
    });
    return out;
  }


  // ---------- tata letak papan (koordinat LAYAR: tidak ikut kamera) ----------
  const BOARD = { x: 96, y: 104, w: 836 };
  const ROWX = BOARD.x + 18, ROWW = BOARD.w - 36, ROW_FS = 46, ROW_GAP = 14, ROW_Y0 = BOARD.y + 118;
  const SIGNS = [
    { text: "Nomor baru, HP rusak", icon: "hpBaru" },
    { text: "Rekening orang lain", icon: "rekening" },
    { text: "Keluarga tak boleh tahu", icon: "larangan" },
    { text: "Menolak ditelepon balik", icon: "teleponBalik" },
    { text: "Diputus saat ditanya", icon: "putus" },
  ];
  let ROWS = null;
  function rowLayout(c) {
    if (ROWS) return ROWS; let y = ROW_Y0; const baseH = ROW_FS * 2.3, ir = baseH * 0.36, sr = baseH * 0.3;
    ROWS = SIGNS.map(s => { const h = B.daftarPeriksa(c, ROWX, y, ROWW, { text: s.text, icon: s.icon, u: 0, textSize: ROW_FS });
      const r = { y, h, cy: y + h / 2, ix: ROWX + baseH * 0.2 + ir, ir, sx: ROWX + ROWW - sr - ROW_FS * 0.35, sr }; y += h + ROW_GAP; return r; });
    ROWS.bottom = y - ROW_GAP; return ROWS;
  }

  // ---------- tokoh & kamera ----------
  const RINA = { x: 1400, y: 806, h: 500 };
  const HEADW = [RINA.x, 466], PHONEW = [1010, 470];
  const BIPS = 210, FLOOR = 905, BX0 = 1150, HOP = 50;
  // kamera: dorongan pelan seluruh bab + dua "ketukan" kamera (zoom di sekitar satu titik dunia yang tetap di tempatnya di layar)
  function camAt(t, e) {
    const u = clamp((t - e.b7_1) / (e.b7_4e - e.b7_1)), z0 = 1 + 0.025 * eio(u);
    let a = z0, ex = 960 - z0 * 960 + Math.sin(t * 0.21) * 8, ey = 540 - z0 * 540 + Math.sin(t * 0.17 + 1) * 5;
    const zoom = (k, wx, wy) => { if (k <= 0) return; const sx = a * wx + ex, sy = a * wy + ey; ex = (1 + k) * (ex - sx) + sx; ey = (1 + k) * (ey - sy) + sy; a *= 1 + k; };
    zoom(0.095 * eio(ramp(t, e.putus, 1.1)) * (1 - eio(ramp(t, e.b7_4, 0.9))), HEADW[0], HEADW[1]);   // dekat pada Bu Rina: diputus → "Si Oyen"
    zoom(0.06 * eio(ramp(t, e.henti, e.uang - e.henti)), PHONEW[0], PHONEW[1]);                       // "berhentilah sejenak": dorong ke HP
    return { a, ex, ey };
  }
  const camT = (c, cm) => { c.translate(cm.ex, cm.ey); c.scale(cm.a, cm.a); };
  const toS = (cm, p) => [cm.a * p[0] + cm.ex, cm.a * p[1] + cm.ey];

  // ---------- kalender & jam dinding disembunyikan (dinding digambar ulang di petak itu, termasuk cahaya lampu) ----------
  let PATC = null;
  function pola(c) {
    if (PATC !== null) return PATC; if (typeof document === "undefined") return (PATC = false);
    const o = document.createElement("canvas"); o.width = o.height = 72; const g = o.getContext("2d"); g.fillStyle = "#9FB0F0";
    [[36, 6], [0, 42], [72, 42]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 7, y + 10); g.lineTo(x, y + 20); g.lineTo(x - 7, y + 10); g.closePath(); g.fill(); });
    return (PATC = c.createPattern(o, "repeat"));
  }
  const flick = (t, s = 1) => 1 + 0.025 * Math.sin(t * 13.1 + s) * Math.sin(t * 7.7 + s * 2) + 0.012 * Math.sin(t * 31 + s);
  function tutupHiasan(c, set, t, px, a) {
    if (a <= 0.001) return; const dm = -px * 60, lp = set.anchors.lamp, lx = lp.x - dm, ly = lp.y, R = [972, 138, 362, 208];
    c.save(); c.translate(dm, 0); c.globalAlpha *= a; c.beginPath(); c.rect(...R); c.clip();
    const g = c.createLinearGradient(0, 0, 0, 800); g.addColorStop(0, "#3F4E9C"); g.addColorStop(1, "#5767B4"); c.fillStyle = g; c.fillRect(...R);
    const pt = pola(c); if (pt) { c.save(); c.globalAlpha *= 0.06; c.fillStyle = pt; c.fillRect(...R); c.restore(); }
    const lf = flick(t); LT.parts.warmPool(c, lx + 20, ly + 10, 660, 0.85 * lf);
    c.save(); c.globalCompositeOperation = "screen"; D.glow(c, lx, ly, 260, "#FFD38A", 0.35 * lf); c.restore();
    c.restore();
  }

  // ---------- Bip pada b7_1–b7_3: melompat ke arah papan, melempar bendera, kembali ----------
  function bipPos(t, e) {
    // saat kamera mendekat pada Bu Rina (diputus), Bip mundur selangkah karena kaget, tidak maju ke papan
    const zk = eio(ramp(t, e.putus, 0.5)) * (1 - eio(ramp(t, e.b7_4 - 0.6, 0.6)));
    let x = BX0 + 60 * zk, y = FLOOR - BIPS * 0.5, lean = 0;
    e.sign.forEach(sg => {
      const f = sg.flag, go = eio(ramp(t, f - 1.0, 0.45)), back = eio(ramp(t, f + 0.35, 0.5));
      x -= HOP * (1 - zk) * go * (1 - back);
      const h1 = t > f - 1.0 && t < f - 0.55 ? Math.sin((t - f + 1.0) / 0.45 * Math.PI) : 0, h2 = t > f + 0.35 && t < f + 0.85 ? Math.sin((t - f - 0.35) / 0.5 * Math.PI) : 0;
      y -= 34 * Math.max(h1, h2);
      const th = t - (f - 0.4); if (th > -0.2 && th < 0.3) lean -= 0.2 * Math.sin(clamp((th + 0.2) / 0.5) * Math.PI);   // lemparan: condong ke depan
    });
    return { x, y, lean };
  }
  function heldFlag(t, e) {   // bendera di tangan: hilang saat dilempar, lalu muncul lagi (pegas)
    let k = 1; e.sign.forEach(sg => { const t0 = sg.flag - 0.4; if (t >= t0 && t < t0 + 0.3) k = 0; else if (t >= t0 + 0.3 && t < t0 + 1.2) k = Math.min(k, Math.min(1.08, spring(t - t0 - 0.3, 12, 0.5))); }); return k;
  }
  const FLAGC = [54, -80];   // pusat kain bendera relatif pusat pegangan (bendera tinggi BIPS, miring -0,12)
  function flagAt(c, x, y, sc, rot, t, a = 1) {   // bendera tiang dengan pusat kain di (x, y)
    if (a <= 0 || sc <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(sc, sc); c.rotate(rot); c.translate(-FLAGC[0], -FLAGC[1]); c.rotate(-0.12);
    B.benderaMerah(c, 0, BIPS * 0.42, BIPS, { raise: 1, t }); c.restore();
  }

  // ---------- geometri akhir HP besar (sekali, deterministik) ----------
  let BIGF = null;
  function bigFinal() {
    if (BIGF) return BIGF; if (typeof document === "undefined") return null;
    const o = document.createElement("canvas"); o.width = 8; o.height = 8; const g = o.getContext("2d");
    const big = L.hp(g, PHONEW[0], PHONEW[1], 760, { t: 0, screen: (cc, w, h, tt) => layarTransfer(cc, w, h, tt, {}) });
    const tr = big.out.transfer, tg = big.out.tunggu;
    BIGF = { pT: big.map(tr.x + tr.w * 0.1, tr.y + tr.h * 0.3), pG: big.map(tg.x + tg.w * 0.1, tg.y + tg.h * 0.3) }; return BIGF;
  }
  const hoverOf = (p) => [p.x - BIPS * 0.34 - 64, p.y - BIPS * 0.444];

  // ---------- adegan ----------
  K.SCENES.d03_b7 = function (ctx, b, l, t, TL) {
    const e = EV(TL), cm = camAt(t, e);
    ctx.save(); camT(ctx, cm);
    // --- set: kamar Bu Rina, lampu menyala, paralaks pelan; kalender & jam disembunyikan ---
    const px = Math.sin(t * 0.11) * 0.35;
    const set = LT.kamar(ctx, t, { lamp: 1, phone: false, jam: 23, px, near: false });
    tutupHiasan(ctx, set, t, px, eio(ramp(t, e.b7_1 - 0.4, 0.6)));
    // --- Bu Rina di tepi ranjang ---
    const k4 = eio(ramp(t, e.b7_4, 0.6));
    const cut = ramp(t, e.putus + 0.1, 0.6);
    let face = t < e.sign[0].flag ? "panik" : "bingung";
    if (t > e.press + 0.4) face = "senang";
    const rinaScreen = (c, w, h, tt) => layarKecil(c, w, h, tt, t >= e.b7_4 ? "transfer" : (t > e.putus + 0.1 ? "putus" : "bicara"));
    const ro = Object.assign(O.preset("buRina"), {
      pose: "telepon", duduk: true, kursi: false, t, seed: 11, face, flip: true,
      blend: { to: "pegangHP", k: Math.max(eio(cut), k4) },
      look: t > e.hanya - 0.1 && t < e.b7_4 ? [-0.2, -0.6] : (t > e.putus + 0.1 ? [-0.3, 0.55] : [-0.55, -0.1]),
      keringat: t < e.sign[2].flag + 1.5 && t > e.b7_1, layar: rinaScreen, glow: true,
    });
    const rina = O.draw(ctx, RINA.x, RINA.y, RINA.h, ro);
    LT.depan(ctx, "kamar", t, { px });
    ctx.restore();

    // ================== lapisan depan (sesudah vignette) ==================
    D.post(c => {
      const rows = rowLayout(c);
      const headW = rina.head || HEADW, phW = rina.phone || [RINA.x - 60, 466];
      const headS = toS(cm, headW), phS = toS(cm, phW);
      const flagsUp = e.sign.filter(s => t >= s.flag).length;

      // ---- papan "Tanda bahaya": lima slot kosong sejak "ceritanya", baris mengisi slot ----
      const bIn = eout(ramp(t, e.cerita - 0.1, 0.7)), txtA = 1 - eio(ramp(t, e.b7_4, 0.3)), flyIc = eio(ramp(t, e.b7_4, 0.9));
      if (bIn > 0 && txtA > 0) {
        const ox = -(1 - bIn) * 70, bh = rows.bottom + 22 - BOARD.y;
        c.save(); c.globalAlpha *= clamp(bIn * 1.4) * txtA; c.translate(ox, 0);
        c.fillStyle = "rgba(10,16,52,0.30)"; H.rr(c, BOARD.x + 8, BOARD.y + 12, BOARD.w, bh, 30); c.fill();
        c.fillStyle = "rgba(30,40,104,0.93)"; H.rr(c, BOARD.x, BOARD.y, BOARD.w, bh, 30); c.fill();
        c.strokeStyle = "rgba(255,255,255,0.16)"; c.lineWidth = 3; H.rr(c, BOARD.x, BOARD.y, BOARD.w, bh, 30); c.stroke();
        B.benderaMerah(c, BOARD.x + 66, BOARD.y + 58, 74, { icon: true, t });
        say(c, "Tanda bahaya", BOARD.x + 122, BOARD.y + 60, 60, "#FFFFFF", { align: "left", w: 900 });
        // penghitung bendera (0 sebelum tanda pertama)
        { const cx = BOARD.x + BOARD.w - 70, cy = BOARD.y + 60, pp = flagsUp > 0 ? Math.max(0.6, pop(t, e.sign[flagsUp - 1].flag)) : 1;
          c.fillStyle = flagsUp > 0 ? RED : "rgba(255,255,255,0.16)"; c.beginPath(); c.arc(cx, cy, 40 * pp, 0, TAU); c.fill();
          if (!flagsUp) { c.strokeStyle = "rgba(255,255,255,0.35)"; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 40, 0, TAU); c.stroke(); }
          say(c, String(flagsUp), cx, cy + 2, 48, flagsUp ? "#FFFFFF" : "rgba(235,240,255,0.85)", { w: 900 }); }
        SIGNS.forEach((s, i) => {
          const sg = e.sign[i], rw = rows[i], u = ramp(t, sg.rowIn, 0.45), su = ramp(t, sg.flag, 0.6);
          // slot kosong bergaris putus-putus dengan "?" (berdenyut berurutan pada "tanda yang sama")
          const ph = 1 - eout(u);
          if (ph > 0.001) {
            const pu = t - (e.tanda + i * 0.12), pl = pu > 0 && pu < 0.5 ? Math.sin(pu / 0.5 * Math.PI) : 0;
            c.save(); c.globalAlpha *= ph; const cxr = ROWX + ROWW / 2; c.translate(cxr, rw.cy); c.scale(1 + 0.035 * pl, 1 + 0.035 * pl); c.translate(-cxr, -rw.cy);
            c.fillStyle = `rgba(255,255,255,${0.05 + 0.12 * pl})`; H.rr(c, ROWX, rw.y, ROWW, rw.h, rw.h * 0.22); c.fill();
            c.setLineDash([16, 12]); c.strokeStyle = `rgba(200,210,255,${0.38 + 0.45 * pl})`; c.lineWidth = 3.5; H.rr(c, ROWX, rw.y, ROWW, rw.h, rw.h * 0.22); c.stroke();
            c.beginPath(); c.arc(rw.sx, rw.cy, rw.sr, 0, TAU); c.stroke(); c.setLineDash([]);
            c.fillStyle = `rgba(255,255,255,${0.13 + 0.2 * pl})`; c.beginPath(); c.arc(rw.ix, rw.cy, rw.ir, 0, TAU); c.fill();
            tanyaPath(c, rw.ix, rw.cy, rw.ir * 0.95, `rgba(225,230,255,${0.75 + 0.25 * pl})`);
            c.restore();
          }
          if (u > 0) B.daftarPeriksa(c, ROWX, rw.y, ROWW, { t, text: s.text, icon: t < e.b7_4 ? s.icon : null, u, su, state: su > 0 ? "flag" : "none", textSize: ROW_FS });
        });
        c.restore();
      }
      // ---- b7_4: ikon berbendera terbang ke kolom kiri ----
      if (flyIc > 0) {
        SIGNS.forEach((s, i) => {
          const rw = rows[i], x1 = 170, y1 = 250 + i * 138;
          const x = lerp(rw.ix, x1, flyIc), y = lerp(rw.cy, y1, flyIc), r = lerp(rw.ir, 50, flyIc);
          const hi = win(t, e.satu, e.henti + 0.6, 0.3, 0.5), isOne = i === 0;
          c.save(); c.globalAlpha *= hi > 0 && !isOne ? 1 - 0.55 * hi : 1;
          const sc = isOne ? 1 + 0.28 * hi * (0.85 + 0.15 * Math.sin(t * 8)) : 1;
          c.translate(x, y); c.scale(sc, sc);
          if (isOne && hi > 0) D.glow(c, 0, 0, 120, RED, 0.6 * hi);
          B.ikon(c, s.icon, 0, 0, r, { t });
          B.benderaMerah(c, r * 0.78, -r * 0.72, r * 0.8, { icon: true, t });
          c.restore();
        });
      }

      // ================= dunia (ikut kamera): HP besar, Bip =================
      let big = null, bipTip = null, pauseAt = null;
      c.save(); camT(c, cm);
      if (t < e.b7_4) {
        const bp = bipPos(t, e), held = heldFlag(t, e);
        const lastFlag = e.sign.reduce((m, s) => (t > s.flag ? s.flag : m), -1e9);
        const wave = Math.max(t - lastFlag < 1.2 ? 1 - (t - lastFlag) / 1.2 : 0, t > e.tanda && t < e.tanda + 1.4 ? 1 - (t - e.tanda) / 1.4 : 0);
        const raise = eio(ramp(t, e.tanda, 0.6));
        const hopT = t > e.tanda && t < e.tanda + 1.4 ? 26 * Math.abs(Math.sin((t - e.tanda) * 6)) * (1 - (t - e.tanda) / 1.4) : 0;
        const kaget = t > e.putus && t < e.putus + 1.6, jump = kaget ? 30 * Math.max(0, Math.sin(clamp((t - e.putus) / 0.5) * Math.PI)) : 0;
        const throwing = e.sign.some(sg => t > sg.flag - 1.0 && t < sg.flag + 0.1);
        const mood = kaget || wave > 0.2 ? "wow" : (throwing ? "happy" : "think");
        const lk = kaget ? [0.9, -0.5] : (throwing || wave > 0.2 ? [-0.8, -0.3] : [0.8, -0.4]);
        c.save(); c.translate(bp.x, FLOOR); c.rotate(bp.lean); c.translate(-bp.x, -FLOOR);
        B.draw(c, bp.x, bp.y - hopT - jump, BIPS, { pose: "pegang", hold: "samping", dir: -1, propSize: 0.45, t, seed: 7, mood, look: lk, sweat: kaget,
          prop: (cc, px, py) => { if (held <= 0.01) return; cc.save(); cc.translate(px, py); cc.scale(held, held); cc.rotate(-0.12 + Math.sin(t * 9) * 0.22 * wave); B.benderaMerah(cc, 0, BIPS * 0.42, BIPS, { raise: 0.25 + 0.75 * raise, t }); cc.restore(); } });
        c.restore();
      } else {
        // HP besar keluar dari HP Bu Rina (mulai 0,3 s, sesudah papan hilang)
        const kp = eio(ramp(t, e.b7_4 + 0.3, 0.7));
        const pressU = clamp((t - e.press) / 0.45), off = eio(ramp(t, e.press + 0.15, 0.4));
        const hl = t < e.satu ? null : (t < e.press ? "transfer" : "tunggu");
        if (kp > 0) {
          const hx = lerp(phW[0], PHONEW[0], kp), hy = lerp(phW[1], PHONEW[1], kp), sc = lerp(0.1, 1, kp);
          const ba = win(t, e.b7_4 + 0.25, e.b7_4 + 1.0, 0.2, 0.5);
          if (ba > 0) { c.save(); c.globalAlpha *= 0.35 * ba; const gg = c.createLinearGradient(phW[0], phW[1], hx, hy); gg.addColorStop(0, "rgba(169,212,255,0.9)"); gg.addColorStop(1, "rgba(169,212,255,0)");
            c.fillStyle = gg; c.beginPath(); c.moveTo(phW[0], phW[1] - 10); c.lineTo(hx + 190 * sc, hy - 380 * sc); c.lineTo(hx + 190 * sc, hy + 380 * sc); c.lineTo(phW[0], phW[1] + 10); c.closePath(); c.fill(); c.restore(); }
          c.save(); c.globalAlpha *= clamp(kp * 3); c.translate(hx, hy); c.scale(sc, sc); c.translate(-hx, -hy);
          D.glow(c, hx, hy, 760 * 0.7, "#A9D4FF", 0.25 * kp);
          big = L.hp(c, hx, hy, 760, { t, glowCol: "#A9D4FF",
            screen: (cc, w, h, tt) => { if (sc < 0.9) { cc.fillStyle = "#EEF1FB"; cc.fillRect(0, 0, w, h); cc.fillStyle = "#5A62D8"; cc.fillRect(0, 0, w, h * 0.13); return; }
              layarTransfer(cc, w, h, tt, { highlight: hl, press: pressU, off }); } });
          c.restore();
        }
        // bendera Bip terbang ke ikon pertama di kolom kiri (koordinat layar; digambar nanti)
        // Bip terbang dari lantai ke samping kiri HP, melayang setinggi tombol
        const F = bigFinal(), fly = eio(ramp(t, e.b7_4, 0.9));
        let tgt = F ? [F.pT.x, F.pT.y] : [900, 560];
        if (F) { const mv = eio(ramp(t, e.tetapi, e.press - e.tetapi)); tgt = [lerp(F.pT.x, F.pG.x, mv), lerp(F.pT.y, F.pG.y, mv)]; }
        const hes = t > e.satu - 0.2 && t < e.henti ? clamp((t - e.satu + 0.2) / 0.3) * (1 - clamp((t - e.henti + 0.08) / 0.08)) : 0;   // ragu: jari maju-mundur
        const tg2 = [tgt[0] + hes * (14 * Math.sin(t * 6.5) + 6 * Math.sin(t * 11.3)), tgt[1] - hes * (22 * Math.max(0, Math.sin(t * 4.2)) - 8)];
        const hov = hoverOf({ x: tgt[0], y: tgt[1] }), bob = Math.sin(t * 2.2) * 5 * (t < e.henti || t > e.press + 0.5 ? 1 : 0.3);
        const p0 = [BX0, FLOOR - BIPS * 0.5], bx = lerp(p0[0], hov[0], fly), by = lerp(p0[1], hov[1] + bob, fly) - Math.sin(fly * Math.PI) * 80;
        // bayangan di lantai + nyala pendorong
        { const lift = clamp((FLOOR - BIPS * 0.5 - by) / 200); c.save(); c.fillStyle = `rgba(14,18,60,${0.24 - 0.08 * lift})`; c.beginPath(); c.ellipse(bx, FLOOR, BIPS * 0.42 * (1 - 0.35 * lift), 16, 0, 0, TAU); c.fill();
          if (lift > 0.05) D.glow(c, bx, by + BIPS * 0.6, 60 + 8 * Math.sin(t * 13), P.teal, 0.55 * lift); c.restore(); }
        if (fly < 1 || !big) B.draw(c, bx, by, BIPS, { pose: "jalan", dir: -1, t, seed: 7, mood: "think", shadow: false });
        else {
          const stop = t >= e.henti && t < e.tetapi, press = t >= e.press ? lerp(0.4, 1, clamp((t - e.press) / 0.3)) : 0.4;   // 0,4: jari tepat di atas tombol
          const mood = t > e.press + 0.3 ? "happy" : (stop ? "wow" : "think");
          const out = B.draw(c, bx, by, BIPS, { pose: "tekan", target: stop || t >= e.tetapi ? tgt : tg2, press, t, seed: 7, mood, shadow: false });
          bipTip = out && out.tip;
          if (stop) pauseAt = toS(cm, [bx - 10, by - BIPS * 0.68 - 72]);
        }
        // centang hijau: tepat di luar sudut kanan-atas HP, tidak terpotong
        if (big && t > e.press) { const cp = pop(t, e.tidak, 10, 0.5); if (cp > 0) { const p = [big.x + big.w + 18, big.y + 150]; c.save(); c.translate(p[0], p[1]); c.scale(cp, cp); D.glow(c, 0, 0, 140, P.green, 0.5);
          c.fillStyle = "rgba(14,18,60,0.25)"; c.beginPath(); c.arc(5, 9, 66, 0, TAU); c.fill();
          c.fillStyle = P.green; c.beginPath(); c.arc(0, 0, 66, 0, TAU); c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 15; c.lineCap = "round"; c.lineJoin = "round";
          c.beginPath(); c.moveTo(-28, 2); c.lineTo(-8, 23); c.lineTo(29, -19); c.stroke(); c.restore(); } }
      }
      c.restore();

      // ================= lapisan layar: gelembung, awan, bendera terbang =================
      // ---- b7_1: suara di telepon (spektrogram anak, seed 23) ----
      const vA = win(t, e.b7_1 - 1, e.cerita + 0.2, 0.3, 0.45);
      if (vA > 0) {
        const bx = 958, by = 78, bw = 460, bhh = 300, sx = bx + 22, sy = by + 98, sw = bw - 44, sh = bhh - 120;
        c.save(); c.globalAlpha *= vA;
        const s = 0.9 + 0.1 * eout(vA), tip0 = [phS[0], phS[1] - 26]; c.translate(tip0[0], tip0[1]); c.scale(s, s); c.translate(-tip0[0], -tip0[1]);
        c.fillStyle = "rgba(14,18,60,0.28)"; H.rr(c, bx + 6, by + 10, bw, bhh, 34); c.fill();
        // ekor pendek ke HP di telinga Bu Rina
        const base = [clamp(phS[0], bx + 70, bx + bw - 70), by + bhh - 2], dx = tip0[0] - base[0], dy = tip0[1] - base[1], d = Math.hypot(dx, dy) || 1, Lt = Math.min(88, d), tp = [base[0] + dx / d * Lt, base[1] + dy / d * Lt];
        c.fillStyle = "#FFFFFF"; c.beginPath(); c.moveTo(base[0] - 24, base[1]); c.quadraticCurveTo(lerp(base[0], tp[0], 0.6), lerp(base[1], tp[1], 0.6), tp[0], tp[1]); c.quadraticCurveTo(lerp(base[0], tp[0], 0.5) + 10, lerp(base[1], tp[1], 0.5), base[0] + 24, base[1]); c.closePath(); c.fill();
        H.rr(c, bx, by, bw, bhh, 34); c.fill();
        avatarQ(c, bx + 50, by + 52, 30);
        say(c, "Suara anaknya?", bx + 94, by + 54, 46, INK, { align: "left", w: 800 });
        const rv = clamp((t - e.walau) / (e.yakin + 0.08 - e.walau));
        L.spektrogram(c, sx, sy, sw, sh, { profil: ANAK, scroll: t * 0.9, dur: 3.2, r: 16, reveal: rv, aksen: true });
        const ck0 = pop(t, e.yakin + 0.1), ck = ck0 > 0 ? 0.92 + 0.08 * ck0 : 0;
        if (ck > 0) { const cx = sx + sw - 84, cy = sy + sh + 2; c.save(); c.globalAlpha *= clamp(ck0 * 3); c.translate(cx, cy); c.scale(ck, ck);
          c.fillStyle = "rgba(14,18,60,0.25)"; H.rr(c, -96, -30, 200, 72, 36); c.fill();
          c.fillStyle = "#DDF7E6"; H.rr(c, -100, -36, 200, 72, 36); c.fill(); c.strokeStyle = P.green; c.lineWidth = 4; H.rr(c, -100, -36, 200, 72, 36); c.stroke();
          c.fillStyle = P.green; c.beginPath(); c.arc(-62, 0, 28, 0, TAU); c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 8; c.lineCap = "round"; c.lineJoin = "round";
          c.beginPath(); c.moveTo(-74, 1); c.lineTo(-65, 10); c.lineTo(-49, -9); c.stroke();
          say(c, "mirip", 22, 2, 46, "#1F8A50", { w: 900 }); c.restore(); }
        c.restore();
      }

      // ---- b7_2: label nomor penelepon (di atas gelembung penelepon) ----
      const nA = win(t, e.nomor, e.pen1 - 0.15, 0.25, 0.3);
      if (nA > 0) {
        const w = 456, h = 132, x = 1418 - w, y = 74, s = 0.85 + 0.15 * Math.min(1, pop(t, e.nomor, 12, 0.6));
        c.save(); c.globalAlpha *= nA; c.translate(x + w / 2, y + h / 2); c.scale(s, s); c.translate(-(x + w / 2), -(y + h / 2));
        c.fillStyle = "rgba(14,18,60,0.3)"; H.rr(c, x + 5, y + 8, w, h, 30); c.fill();
        c.fillStyle = "rgba(16,22,64,0.94)"; H.rr(c, x, y, w, h, 30); c.fill(); c.strokeStyle = RED; c.lineWidth = 4; H.rr(c, x, y, w, h, 30); c.stroke();
        say(c, "0812-0000-1234", x + w / 2, y + 42, 46, "#FFFFFF", { w: 900 });
        say(c, "nomor baru", x + w / 2, y + 96, 44, "#FF8A8F", { w: 800 });
        c.restore();
      }

      // ---- gelembung percakapan: penelepon di atas (ekor ke HP), Bu Rina di kanan kepalanya ----
      const badgeQ = (cc, x, y) => avatarQ(cc, x, y, 30);
      const badgeCut = (cc, x, y) => B.ikon(cc, "putus", x, y, 32, { t });
      const lines = [
        { s: "Bu, HP-ku rusak. Ini nomor baruku.", a: e.alasan - 0.6, b: e.pen1 - 0.15, who: "pel" },
        { s: "Kirim ke rekening temanku, ya!", a: e.minta, b: e.pen2 - 0.15, who: "pel" },
        { s: "Jangan bilang Ayah dulu!", a: e.larang, b: e.pen3 - 0.15, who: "pel" },
        { s: "Ibu telepon balik, ya?", a: e.pen3 - 0.05, b: e.atau - 0.15, who: "ibu" },
        { s: "Jangan, Bu! Tidak usah!", a: e.tolak + 0.15, b: e.atau - 0.15, who: "pel" },
        { s: "Nama kucing kita siapa?", a: e.atau - 0.05, b: e.hanya - 0.1, who: "ibu" },
        { s: "Tut… tut… tut…", a: e.putus, b: e.b7_4, who: "tut" },
      ];
      lines.forEach(ln => {
        const a = win(t, ln.a, ln.b, 0.25, ln.who === "tut" ? 0.3 : 0.25); if (a <= 0) return; const s = 0.7 + 0.3 * pop(t, ln.a, 12, 0.55);
        if (ln.who === "ibu") bubble(c, ln.s, { a, s, x0: 1500, y0: 428, maxW: 324, side: "kiri", to: headS, gap: 74, fill: "#C9F5EC" });
        else bubble(c, ln.s, { a, s, right: 1418, y0: 222, maxW: 462, side: "bawah", to: phS, gap: 18,
          fill: ln.who === "tut" ? "#FFE1E4" : "#FFFFFF", color: ln.who === "tut" ? "#C2364A" : INK, badge: ln.who === "tut" ? badgeCut : badgeQ });
      });
      // ---- awan pikiran "Si Oyen" (hanya keluarga yang tahu), di kanan kepala ----
      const oy = win(t, e.hanya - 0.1, e.b7_4, 0.35, 0.3);
      if (oy > 0) { const cx = 1664, cy = 572; awan(c, cx, cy, 330, 320, headS[0] + 70, headS[1] - 40, oy, t); c.save(); c.globalAlpha *= clamp(oy * 1.5);
        kucing(c, cx, cy - 42, 58, t); say(c, "Si Oyen", cx, cy + 70, 50, INK, { w: 900 }); c.restore(); }

      // ---- bendera dilempar Bip ke slot baris (tiba tepat pada kata) ----
      e.sign.forEach((sg, i) => {
        const t0 = sg.flag - 0.4, u = (t - t0) / 0.4; if (u < 0 || u > 1.05) return;
        const bp = bipPos(t0, e), st = toS(cm, [bp.x - BIPS * 0.725 + FLAGC[0], bp.y - BIPS * 0.06 + FLAGC[1]]), rw = rows[i];
        const k = eio(clamp(u)), x = lerp(st[0], rw.sx, k), y = lerp(st[1], rw.cy, k) - Math.sin(clamp(u) * Math.PI) * 130;
        flagAt(c, x, y, lerp(cm.a, 0.32, k), -0.5 * k + Math.sin(u * Math.PI) * 0.3, t, 1 - clamp((u - 0.85) / 0.2));
      });
      // ---- b7_4: bendera Bip terbang ke ikon pertama ----
      if (t >= e.b7_4) { const u = eio(ramp(t, e.b7_4 - 0.05, 0.75)); if (u < 1) { const bp = bipPos(e.b7_4, e), st = toS(cm, [bp.x - BIPS * 0.725 + FLAGC[0], bp.y - BIPS * 0.06 + FLAGC[1]]);
        flagAt(c, lerp(st[0], 205, u), lerp(st[1], 215, u) - Math.sin(u * Math.PI) * 140, lerp(cm.a, 0.3, u), -0.5 * u, t, 1 - clamp((u - 0.8) / 0.2)); } }

      // ---- b7_4: lencana jeda saat jari berhenti ----
      if (pauseAt) { const a = win(t, e.henti, e.tetapi - 0.2, 0.2, 0.3), pp = pop(t, e.henti); c.save(); c.globalAlpha *= a; c.translate(pauseAt[0], pauseAt[1]); c.scale(pp, pp);
        c.fillStyle = "rgba(14,18,60,0.25)"; c.beginPath(); c.arc(4, 8, 54, 0, TAU); c.fill();
        c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, 54, 0, TAU); c.fill(); c.strokeStyle = RED; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 54, 0, TAU); c.stroke();
        c.fillStyle = RED; H.rr(c, -22, -26, 15, 52, 6); c.fill(); H.rr(c, 7, -26, 15, 52, 6); c.fill(); c.restore(); }

      // ---- b7_4: awan pikiran "uang sulit kembali" ----
      const tA = win(t, e.uang - 0.15, e.tetapi + 0.1, 0.35, 0.35);
      if (tA > 0) {
        const cx = 1618, cy = 234, cw = 540, ch = 340;
        awan(c, cx, cy, cw, ch, headS[0] + 30, headS[1] - 90, tA, t);
        c.save(); c.globalAlpha *= clamp(tA * 1.5);
        L.hp(c, cx - 175, cy - 30, 170, { t, lit: 1, shadow: false, screen: (cc, w, h) => { cc.fillStyle = "#EEF1FB"; cc.fillRect(0, 0, w, h); cc.fillStyle = "#5A62D8"; cc.fillRect(0, 0, w, h * 0.22); B.ikon(cc, "uang", w / 2, h * 0.55, w * 0.3, { t }); } });
        O.kepala(c, cx + 165, cy - 40, 60, Object.assign(O.preset("pelaku"), { t, bahu: 1.1, look: [-0.7, 0], seed: 4 }));
        for (let i = 0; i < 3; i++) { const u = clamp((t - e.kirim - i * 0.22) / 0.8); const x = lerp(cx - 115, cx + 40, eio(u)), y = cy - 66 + Math.sin(u * Math.PI) * -60 + (i - 1) * 14;
          uangKertas(c, x - i * 14 * clamp(u * 3 - 2), y, 100, -0.2 + 0.4 * u + i * 0.1 * u, u > 0 ? 1 : 0); }
        // jalan kembali: panah merayap pelan, berhenti di tengah, lalu tinggal titik-titik
        const ra = ramp(t, e.sulit - 0.1, 1.3), yb = cy + 52, x0 = cx + 105, x1 = cx - 135;
        if (ra > 0) { const reach = 0.45 * eout(ra), xe = lerp(x0, x1, reach);
          c.save(); c.strokeStyle = "#7F8AC2"; c.lineWidth = 10; c.lineCap = "round"; c.setLineDash([22, 16]); c.lineDashOffset = -t * 20;
          c.beginPath(); c.moveTo(x0, yb); c.lineTo(xe, yb); c.stroke(); c.setLineDash([]);
          for (let j = 1; j <= 4; j++) { const xx = lerp(xe, x1, j / 5); c.globalAlpha = clamp(tA * 1.5) * ra * (0.5 - j * 0.1); c.fillStyle = "#7F8AC2"; c.beginPath(); c.arc(xx, yb, 7 - j, 0, TAU); c.fill(); }
          c.globalAlpha = clamp(tA * 1.5) * ra; const wob = Math.sin(t * 5) * 3; c.fillStyle = "#7F8AC2"; c.beginPath(); c.moveTo(xe - 20 + wob, yb); c.lineTo(xe + 8 + wob, yb - 18); c.lineTo(xe + 8 + wob, yb + 18); c.closePath(); c.fill(); c.restore();
          const la = pop(t, e.sulit, 12, 0.6); if (la > 0) { c.save(); c.translate(cx - 20, cy + 112); c.scale(la, la); say(c, "sulit kembali", 0, 0, 46, "#C2364A", { w: 900 }); c.restore(); } }
        c.restore();
      }
    });
  };
  K.SCENES.d03_b7.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b7 = TL => {
    const e = EV(TL), r = (x, kind, amp) => [+x.toFixed(3), kind, amp];
    return [
      r(e.yakin + 0.1, "shimmer", 0.45),        // centang "mirip"
      r(e.cerita - 0.5, "whoosh", 0.55),        // papan dengan lima slot masuk
      r(e.tanda, "pop", 0.6),                   // Bip mengangkat bendera, slot berdenyut
      r(e.sign[0].flag, "pop", 0.7),            // bendera 1 tiba di slot
      r(e.sign[1].flag, "pop", 0.7),            // bendera 2
      r(e.sign[2].flag, "pop", 0.7),            // bendera 3
      r(e.sign[3].flag, "pop", 0.7),            // bendera 4
      r(e.putus, "clack", 0.7),                 // panggilan diputus
      r(e.sign[4].flag, "pop", 0.7),            // bendera 5
      r(e.b7_4 - 0.3, "whoosh", 0.6),           // HP keluar dari HP Bu Rina
      r(e.henti, "clack", 0.6),                 // jari berhenti
      r(e.kirim - 0.4, "whoosh", 0.45),         // uang terbang
      r(e.sulit, "pop", 0.45),                  // "sulit kembali"
      r(e.press, "pop", 0.8),                   // tekan "Tunggu"
      r(e.tidak, "shimmer", 0.6),               // centang hijau
    ];
  };
})(typeof window !== "undefined" ? window : globalThis);
