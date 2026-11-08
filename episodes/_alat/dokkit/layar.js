/* dokkit/layar.js — HP generik, layar aplikasi generik, dan visual suara (D03 dan seterusnya).
   Gaya vektor datar: tanpa garis hitam, pemisahan lewat isi lebih gelap/terang, pinggir terang, bayangan lembut.
   Tanpa merek: aplikasi "Telepon", "Pesan", "Bank", "Perekam Suara"; nomor rekaan (0812-0000-1234).
   API (deterministik; t dalam detik):
     K.kit.layar.hp(ctx, cx, cy, h, opt) -> anchors     HP tampak depan, (cx, cy) = pusat, h = tinggi (lebar = 0,485 h)
       opt: screen(ctx, w, h, t) penggambar layar (koordinat layar, (0,0) = pojok kiri atas), t, tilt -1..1 (miring 3D tipis),
            rot (radian), ring 0..1 (getar + gelombang cincin), lit 0..1 (kecerahan layar; 0 = mati), glow (kuat cahaya pancaran; bawaan 0,55*lit),
            glowCol, body (warna bodi), shadow (bawaan true), jam ("23:07" untuk bilah status; false = tanpa bilah status)
       anchors: x, y, w, h (bodi, koordinat pemanggil), screen {x, y, w, h}, map(lx, ly) -> {x, y} (titik layar -> koordinat pemanggil),
                out (nilai kembali opt.screen, mis. tombol transfer), top/bottom (titik tengah atas/bawah bodi)
     Layar (dipakai sebagai opt.screen atau langsung; teks utama ±10% lebar layar, jadi >= 40 px bila lebar layar >= 400 px, yaitu HP h >= ±900):
       panggilanMasuk(ctx, w, h, {nama, nomor, t, jam})            tombol Tolak/Terima berdenyut -> {tolak, terima}
       panggilan(ctx, w, h, {nama, durasi, t, nomor, suara 0..1})   panggilan aktif + gelombang -> {akhiri}
       videoCall(ctx, w, h, {wajah(ctx, w, h, t) -> {x,y,w,h}?, orang (opt kit.orang.kepala), diri (opt kepala pratinjau; false = polos), nama, durasi, glitch 0..1, t})
                                                                    wajah sesekali berkedip/terpotong (petunjuk deepfake) -> {wajah, akhiri}
       obrolan(ctx, w, h, {pesan:[{dari:'aku'|'dia', teks, suara:true, durasi, jam}], nama, muncul (jumlah pesan tampil, pecahan = animasi),
                           mengetik, size, t})                      -> {gelembung:[{x,y,w,h}]}
       transfer(ctx, w, h, {nominal, ke, rek, highlight:'transfer'|'tunggu', tekan:{tombol, u}, peringatan, t})
                                                                    -> {transfer, tunggu} (kotak tombol, koordinat layar)
       rekam(ctx, w, h, {t, durasi, tersimpan 0..1, label})         layar perekam suara -> {tombol}
       mati(ctx, w, h, {t})                                          layar mati (kaca gelap)
     Visual suara:
       spektrogram(ctx, x, y, w, h, opt) -> {yOf(hz), xOf(detik)}   opt: profil {seed, f0, formants:[F1,F2,F3], tempo, serak} atau nama di SUARA,
            scroll (detik), dur (detik terlihat, bawaan 4), fmax (Hz di tepi atas, bawaan 5500), band [lo, hi] Hz (batas telepon, mis. [300, 3400]), bandAmt 0..1,
            reveal 0..1 (dengan garis putar), morph 0..1 + ke (profil tujuan; kata/ritme tetap milik profil asal, warna suara berpindah),
            r (sudut), frame (bawaan true), grid, alpha
       gelombang(ctx, x, y, w, h, opt)                               opt: t, mode 'garis'|'batang'|'cermin', amp 0..1 atau fn(u, t), seed, col, col2,
            speed, n (jumlah batang), lw, glow, rapat (kerapatan getaran garis, bawaan 4), angka 0..1 (batang berubah menjadi deretan angka sampel), angkaSize
       sidikJari(ctx, cx, cy, r, opt)                                opt: fromSpec 0..1 (0 = sidik jari, 1 = garis harmonik spektrogram), seed, profil,
            col, t, scan 0..1 (garis pindai), lw, alpha
     K.kit.layar.SUARA: profil siap pakai ibu, anak, ayah, nenek, narator, pelaku
     K.kit.layar.ikon(ctx, nama, cx, cy, s, col): telepon, tutup, mik, mikMati, speaker, keypad, kamera, bank, cek, bendera, putar, kunci, kembali */
(function (g) {
  const K = g.Kiko, D = K.dok, H = K.helpers; K.kit = K.kit || {};
  const P = D.P, TAU = Math.PI * 2, PI = Math.PI, FONT = K.FONT;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, u) => a + (b - a) * u;
  const sm = u => { u = clamp(u); return u * u * (3 - 2 * u); };

  // ---------- warna ----------
  const CC = {};
  const rgb = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  function mix(a, b, f) { f = Math.round(clamp(f) * 100) / 100; const k = a + b + f; if (CC[k]) return CC[k]; const A = rgb(a), B = rgb(b); const r = A.map((v, i) => Math.round(v + (B[i] - v) * f)); return (CC[k] = "#" + ((1 << 24) + (r[0] << 16) + (r[1] << 8) + r[2]).toString(16).slice(1)); }
  const dark = (c, f = 0.25) => mix(c, "#141A4A", f), lite = (c, f = 0.25) => mix(c, "#FFF6E8", f);
  const INK = "#262F63", INK2 = "#5D6796", RED = "#FF5A6A", GREEN = "#2FD08A";

  // hash & derau deterministik
  function hn(i, j, s) { let h = Math.imul(i | 0, 374761393) ^ Math.imul(j | 0, 668265263) ^ Math.imul(s | 0, 2246822519); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; }
  const gs = d => Math.exp(-d * d);
  function vn(x, s) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hn(i, 0, s), hn(i + 1, 0, s), u); }

  // ---------- teks ----------
  function tx(ctx, s, x, y, size, col, opt = {}) { H.text(ctx, s, x, y, size, { color: col, weight: opt.weight || 700, align: opt.align || "center", base: opt.base || "middle", fit: opt.fit }); }

  // ---------- ikon vektor ----------
  function ikon(ctx, nama, cx, cy, s, col) {
    ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const L = (pts, lw) => { ctx.lineWidth = lw * s; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x * s, y * s) : ctx.moveTo(x * s, y * s)); ctx.stroke(); };
    if (nama === "telepon" || nama === "tutup") {
      if (nama === "tutup") ctx.rotate(PI * 0.75); else ctx.rotate(-0.2);
      // gagang klasik: busur tebal + dua bantalan
      ctx.lineWidth = s * 0.2; ctx.beginPath(); ctx.arc(0, s * 0.42, s * 0.5, PI * 1.22, PI * 1.78); ctx.stroke();
      for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * s * 0.36, s * 0.08); ctx.rotate(k * 0.45); H.rr(ctx, -s * 0.17, -s * 0.09, s * 0.34, s * 0.24, s * 0.08); ctx.fill(); ctx.restore(); }
    } else if (nama === "mik" || nama === "mikMati") {
      H.rr(ctx, -s * 0.16, -s * 0.48, s * 0.32, s * 0.6, s * 0.16); ctx.fill();
      ctx.lineWidth = s * 0.09; ctx.beginPath(); ctx.arc(0, -s * 0.06, s * 0.3, 0.1, PI - 0.1); ctx.stroke(); L([[0, 0.24], [0, 0.42]], 0.09); L([[-0.18, 0.44], [0.18, 0.44]], 0.09);
      if (nama === "mikMati") L([[-0.42, -0.42], [0.42, 0.42]], 0.1);
    } else if (nama === "speaker") {
      ctx.beginPath(); ctx.moveTo(-s * 0.42, -s * 0.14); ctx.lineTo(-s * 0.2, -s * 0.14); ctx.lineTo(s * 0.06, -s * 0.38); ctx.lineTo(s * 0.06, s * 0.38); ctx.lineTo(-s * 0.2, s * 0.14); ctx.lineTo(-s * 0.42, s * 0.14); ctx.closePath(); ctx.fill();
      ctx.lineWidth = s * 0.08; for (const r of [0.2, 0.36]) { ctx.beginPath(); ctx.arc(s * 0.08, 0, s * r, -0.8, 0.8); ctx.stroke(); }
    } else if (nama === "keypad") {
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc((i - 1) * s * 0.32, (j - 1) * s * 0.32, s * 0.1, 0, TAU); ctx.fill(); }
    } else if (nama === "kamera") {
      H.rr(ctx, -s * 0.46, -s * 0.26, s * 0.62, s * 0.52, s * 0.12); ctx.fill();
      ctx.beginPath(); ctx.moveTo(s * 0.2, -s * 0.06); ctx.lineTo(s * 0.48, -s * 0.24); ctx.lineTo(s * 0.48, s * 0.24); ctx.lineTo(s * 0.2, s * 0.06); ctx.closePath(); ctx.fill();
    } else if (nama === "bank") {
      ctx.beginPath(); ctx.moveTo(-s * 0.48, -s * 0.14); ctx.lineTo(0, -s * 0.46); ctx.lineTo(s * 0.48, -s * 0.14); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 4; i++) ctx.fillRect(-s * 0.36 + i * s * 0.22, -s * 0.06, s * 0.1, s * 0.38);
      ctx.fillRect(-s * 0.48, s * 0.36, s * 0.96, s * 0.1);
    } else if (nama === "cek") { L([[-0.36, 0.02], [-0.1, 0.28], [0.4, -0.28]], 0.16);
    } else if (nama === "bendera") {
      L([[-0.3, 0.48], [-0.3, -0.44]], 0.1);
      ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.44); ctx.quadraticCurveTo(0, -s * 0.54, s * 0.12, -s * 0.38); ctx.quadraticCurveTo(s * 0.28, -s * 0.24, s * 0.42, -s * 0.34); ctx.lineTo(s * 0.42, s * 0.04); ctx.quadraticCurveTo(s * 0.26, s * 0.12, s * 0.1, -s * 0.02); ctx.quadraticCurveTo(-s * 0.04, -s * 0.14, -s * 0.3, -s * 0.06); ctx.closePath(); ctx.fill();
    } else if (nama === "putar") { ctx.beginPath(); ctx.moveTo(-s * 0.26, -s * 0.38); ctx.lineTo(s * 0.4, 0); ctx.lineTo(-s * 0.26, s * 0.38); ctx.closePath(); ctx.fill();
    } else if (nama === "kunci") {
      ctx.lineWidth = s * 0.12; ctx.beginPath(); ctx.arc(0, -s * 0.12, s * 0.24, PI, 0); ctx.lineTo(s * 0.24, 0); ctx.moveTo(-s * 0.24, 0); ctx.lineTo(-s * 0.24, -s * 0.12); ctx.stroke();
      H.rr(ctx, -s * 0.38, -s * 0.04, s * 0.76, s * 0.52, s * 0.1); ctx.fill();
    } else if (nama === "kembali") { L([[0.14, -0.36], [-0.2, 0], [0.14, 0.36]], 0.13);
    } else if (nama === "orang") {
      ctx.beginPath(); ctx.arc(0, -s * 0.18, s * 0.24, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, s * 0.42, s * 0.42, s * 0.3, 0, PI, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // ---------- potongan layar bersama ----------
  function statusBar(ctx, w, u, col, jam) {
    if (jam === false) return;
    tx(ctx, jam || "23:07", u * 9, u * 5.2, u * 3.8, col, { align: "left", weight: 700 });
    ctx.fillStyle = col;
    for (let i = 0; i < 4; i++) { const bh = u * (1.2 + i * 0.75); H.rr(ctx, w - u * 23 + i * u * 1.6, u * 6.6 - bh, u * 1.05, bh, u * 0.3); ctx.fill(); }
    ctx.globalAlpha *= 0.45; H.rr(ctx, w - u * 15, u * 3.6, u * 7, u * 3.2, u * 0.9); ctx.fill(); ctx.globalAlpha /= 0.45;
    H.rr(ctx, w - u * 15, u * 3.6, u * 5, u * 3.2, u * 0.9); ctx.fill(); H.rr(ctx, w - u * 7.6, u * 4.5, u * 0.8, u * 1.4, u * 0.3); ctx.fill();
  }
  function bgGrad(ctx, w, h, c0, c1) { const gr = ctx.createLinearGradient(0, 0, w * 0.3, h); gr.addColorStop(0, c0); gr.addColorStop(1, c1); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h); }
  function bokeh(ctx, w, h, seed, col, a = 0.1) { const r = D.rng(seed); for (let i = 0; i < 7; i++) { ctx.fillStyle = D.hexA(col, a * (0.5 + r())); ctx.beginPath(); ctx.arc(r() * w, r() * h, w * (0.08 + r() * 0.22), 0, TAU); ctx.fill(); } }
  // tombol bulat dengan bayangan dan pinggir terang
  function bulat(ctx, cx, cy, r, col, ikonNama, icol = "#FFFFFF") {
    ctx.save(); ctx.fillStyle = "rgba(15,20,60,0.22)"; ctx.beginPath(); ctx.arc(cx, cy + r * 0.12, r, 0, TAU); ctx.fill();
    const gr = ctx.createLinearGradient(cx, cy - r, cx, cy + r); gr.addColorStop(0, lite(col, 0.18)); gr.addColorStop(1, dark(col, 0.08));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(cx, cy, r * 0.94, PI * 1.1, PI * 1.6); ctx.stroke();
    if (ikonNama) ikon(ctx, ikonNama, cx, cy, r * 0.95, icol); ctx.restore();
  }
  // avatar generik (lingkaran + siluet orang); opt.tanya = tanda tanya
  function avatar(ctx, cx, cy, r, col, opt = {}) {
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.clip();
    ctx.fillStyle = lite(col, 0.45); ctx.beginPath(); ctx.arc(cx, cy - r * 0.18, r * 0.36, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.78, r * 0.68, r * 0.5, 0, 0, TAU); ctx.fill();
    ctx.restore();
    if (opt.tanya) { ctx.save(); ctx.beginPath(); ctx.arc(cx + r * 0.7, cy - r * 0.7, r * 0.32, 0, TAU); ctx.fillStyle = P.amber; ctx.fill(); tx(ctx, "?", cx + r * 0.7, cy - r * 0.68, r * 0.44, "#3A2A10", { weight: 900 }); ctx.restore(); }
  }

  // ---------- layar: panggilan masuk ----------
  function panggilanMasuk(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0; ctx.save();
    bgGrad(ctx, w, h, "#5B6BE0", "#8A5FD6"); bokeh(ctx, w, h, 4, "#FFFFFF", 0.05);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    tx(ctx, o.label || "Panggilan masuk", w / 2, h * 0.14, u * 5.4, "rgba(255,255,255,0.8)", { weight: 600 });
    const ay = h * 0.34, ar = u * 17;
    for (let i = 0; i < 3; i++) { const ph = (t * 0.7 + i / 3) % 1; ctx.strokeStyle = D.hexA("#FFFFFF", 0.35 * (1 - ph)); ctx.lineWidth = u * 1.2; ctx.beginPath(); ctx.arc(w / 2, ay, ar * (1 + ph * 0.9), 0, TAU); ctx.stroke(); }
    avatar(ctx, w / 2, ay, ar, "#7C8BEA", { tanya: o.tanya !== false });
    tx(ctx, o.nama || "Nomor tidak dikenal", w / 2, h * 0.53, u * 9.4, "#FFFFFF", { weight: 800, fit: w * 0.92 });
    tx(ctx, o.nomor || "0812-0000-1234", w / 2, h * 0.6, u * 7.2, "rgba(255,255,255,0.85)", { weight: 600, fit: w * 0.9 });
    const by = h * 0.83, br = u * 12.5, out = {};
    [["tolak", w * 0.27, RED, "tutup", "Tolak", 0], ["terima", w * 0.73, GREEN, "telepon", "Terima", 0.5]].forEach(([k, x, col, ic, lab, ph]) => {
      const p = 0.5 + 0.5 * Math.sin((t * 1.6 + ph) * TAU), hop = k === "terima" ? -Math.abs(Math.sin(t * PI * 1.6)) * u * 2.2 : 0;
      ctx.fillStyle = D.hexA(col, 0.28 * p); ctx.beginPath(); ctx.arc(x, by, br * (1.15 + 0.3 * p), 0, TAU); ctx.fill();
      bulat(ctx, x, by + hop, br * (1 + 0.04 * p), col, ic);
      tx(ctx, lab, x, by + br + u * 7, u * 5.6, "#FFFFFF", { weight: 700 });
      out[k] = { x: x - br, y: by - br, w: br * 2, h: br * 2, cx: x, cy: by };
    });
    ctx.restore(); return out;
  }

  // ---------- layar: panggilan aktif ----------
  function panggilan(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, lv = o.suara == null ? 1 : o.suara; ctx.save();
    bgGrad(ctx, w, h, "#3E86C9", "#4B55B8"); bokeh(ctx, w, h, 9, "#FFFFFF", 0.05);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    const ay = h * 0.24, ar = u * 15;
    const amp = lv * (0.35 + 0.65 * vn(t * 6, 3)) * (0.4 + 0.6 * vn(t * 1.3, 8));
    ctx.fillStyle = D.hexA(P.teal, 0.25 + 0.2 * amp); ctx.beginPath(); ctx.arc(w / 2, ay, ar * (1.1 + 0.25 * amp), 0, TAU); ctx.fill();
    avatar(ctx, w / 2, ay, ar, "#6E9BE0", { tanya: !!o.tanya });
    tx(ctx, o.nama || "Nomor tidak dikenal", w / 2, h * 0.41, u * 9, "#FFFFFF", { weight: 800, fit: w * 0.92 });
    tx(ctx, o.durasi || "00:42", w / 2, h * 0.48, u * 7.6, "rgba(255,255,255,0.85)", { weight: 600 });
    gelombang(ctx, w * 0.1, h * 0.53, w * 0.8, h * 0.13, { t, mode: "batang", amp: (x, tt) => lv * (0.3 + 0.7 * vn(tt * 2.2 + x * 3, 21)), col: P.teal, col2: "#FFFFFF", n: 22, seed: o.seed || 5 });
    const ys = h * 0.74; [["speaker", 0.22], ["mikMati", 0.5], ["keypad", 0.78]].forEach(([ic, fx]) => bulat(ctx, w * fx, ys, u * 9, "#7A8FE0", ic));
    const out = { akhiri: { cx: w / 2, cy: h * 0.88, x: w / 2 - u * 11, y: h * 0.88 - u * 11, w: u * 22, h: u * 22 } };
    bulat(ctx, w / 2, h * 0.88, u * 11, RED, "tutup");
    ctx.restore(); return out;
  }

  // ---------- layar: panggilan video (petunjuk deepfake) ----------
  const POOL = {};
  function kanvas(key, w, h) { let c = POOL[key]; if (!c || c.width < w || c.height < h) { c = POOL[key] = document.createElement("canvas"); c.width = Math.max(w, c ? c.width : 0); c.height = Math.max(h, c ? c.height : 0); } return c; }
  function wajahBawaan(ctx, w, h, t, o) {
    // latar ruangan hangat (kamar sewaan di luar negeri: dinding krem, rak, lampu)
    bgGrad(ctx, w, h, "#E9C79E", "#B98E78");
    ctx.fillStyle = "rgba(255,255,255,0.18)"; H.rr(ctx, w * 0.62, h * 0.12, w * 0.3, h * 0.26, w * 0.03); ctx.fill();
    ctx.fillStyle = "#9A6E58"; ctx.fillRect(w * 0.05, h * 0.3, w * 0.3, h * 0.025);
    ctx.fillStyle = "#7FB7A8"; H.rr(ctx, w * 0.08, h * 0.22, w * 0.07, h * 0.08, w * 0.015); ctx.fill(); ctx.fillStyle = "#E58A6F"; H.rr(ctx, w * 0.18, h * 0.19, w * 0.06, h * 0.11, w * 0.015); ctx.fill();
    D.glow(ctx, w * 0.8, h * 0.2, w * 0.5, P.warm, 0.35);
    const r = w * 0.2, cx = w / 2 + Math.sin(t * 0.7) * w * 0.012, cy = h * 0.5 + Math.sin(t * 0.9) * h * 0.006;
    const OR = K.kit.orang;
    if (OR) OR.kepala(ctx, cx, cy, r, Object.assign({ hair: "hijab", hijab: "#4FA88E", ciput: "#2E6E5E", skin: OR.SKIN[2], top: "#F2F0E6", face: "senang", t, seed: 21, bahu: 3 }, o.orang || {}));
    else { ctx.fillStyle = "#C58C62"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); }
    return { x: cx - r * 1.05, y: cy - r * 1.1, w: r * 2.1, h: r * 2.2 };
  }
  function videoCall(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, gl = clamp(o.glitch || 0); ctx.save();
    const m = ctx.getTransform(), s = clamp(Math.hypot(m.a, m.b), 0.5, 2.5);
    const cw = Math.ceil(w * s), ch = Math.ceil(h * s), oc = kanvas("vc", cw, ch), o2 = oc.getContext("2d");
    o2.setTransform(1, 0, 0, 1, 0, 0); o2.clearRect(0, 0, oc.width, oc.height); o2.setTransform(s, 0, 0, s, 0, 0);
    let face = (o.wajah || ((c, ww, hh, tt) => wajahBawaan(c, ww, hh, tt, o)))(o2, w, h, t);
    face = face || { x: w * 0.28, y: h * 0.26, w: w * 0.44, h: h * 0.42 };
    // ledakan glitch: deterministik per 1/6 detik
    const slot = Math.floor(t * 6), burst = gl > 0 && hn(slot, 7, 31) < 0.12 + 0.4 * gl ? gl * (0.55 + 0.45 * hn(slot, 3, 9)) : 0;
    ctx.drawImage(oc, 0, 0, cw, ch, 0, 0, w, h);
    if (burst > 0) {
      const sub = Math.floor(t * 18);
      // wajah memburam kotak-kotak (kompresi gagal)
      const pc = kanvas("vcpix", 24, 24), p2 = pc.getContext("2d"), n = Math.round(lerp(18, 9, burst));
      p2.setTransform(1, 0, 0, 1, 0, 0); p2.clearRect(0, 0, 24, 24); p2.imageSmoothingEnabled = true;
      p2.drawImage(oc, face.x * s, face.y * s, face.w * s, face.h * s, 0, 0, n, n);
      ctx.save(); ctx.globalAlpha = clamp(burst * 1.2); ctx.imageSmoothingEnabled = false; ctx.drawImage(pc, 0, 0, n, n, face.x, face.y, face.w, face.h); ctx.restore();
      // irisan bergeser + pinggiran warna
      for (let i = 0; i < 6; i++) {
        const y0 = face.y + hn(sub, i, 1) * face.h * 0.95, bh = h * (0.012 + 0.04 * hn(sub, i, 2)), dx = (hn(sub, i, 3) - 0.5) * w * 0.16 * burst;
        ctx.drawImage(oc, 0, y0 * s, cw, bh * s, dx, y0, w, bh);
        ctx.fillStyle = D.hexA(i % 2 ? P.teal : P.pink, 0.35 * burst); ctx.fillRect(dx + (i % 2 ? 6 : -6) * u * 0.3, y0, w, bh * 0.5);
      }
      ctx.fillStyle = D.hexA("#FFFFFF", 0.05 * burst); for (let y = 0; y < h; y += u * 1.6) ctx.fillRect(0, y, w, u * 0.4);
    }
    // antarmuka panggilan
    const tg = ctx.createLinearGradient(0, 0, 0, h * 0.2); tg.addColorStop(0, "rgba(20,26,70,0.55)"); tg.addColorStop(1, "rgba(20,26,70,0)"); ctx.fillStyle = tg; ctx.fillRect(0, 0, w, h * 0.2);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    tx(ctx, o.nama || "Bibi", u * 7, h * 0.1, u * 8, "#FFFFFF", { align: "left", weight: 800, fit: w * 0.55 });
    tx(ctx, o.durasi || "01:15", u * 7, h * 0.1 + u * 7.5, u * 5, "rgba(255,255,255,0.85)", { align: "left", weight: 600 });
    // pratinjau kamera sendiri
    const px = w - u * 30, py = h * 0.07, pw = u * 24, ph = u * 34;
    ctx.save(); ctx.fillStyle = "rgba(10,14,50,0.25)"; H.rr(ctx, px, py + u, pw, ph, u * 4); ctx.fill(); H.rr(ctx, px, py, pw, ph, u * 4); ctx.clip();
    ctx.translate(px, py); bgGrad(ctx, pw, ph, "#8193E4", "#5466C2");
    const OR = K.kit.orang;
    if (o.diri !== false && OR) OR.kepala(ctx, pw / 2, ph * 0.52, pw * 0.22, Object.assign(OR.preset("buRina"), { t, seed: 40, face: o.wajahDiri || "bingung", bahu: 3 }, o.diri || {}));
    else { ctx.fillStyle = "#B6794C"; ctx.beginPath(); ctx.arc(pw / 2, ph * 0.5, pw * 0.22, 0, TAU); ctx.fill(); }
    ctx.restore();
    const by = h * 0.88; const bg2 = ctx.createLinearGradient(0, h * 0.74, 0, h); bg2.addColorStop(0, "rgba(20,26,70,0)"); bg2.addColorStop(1, "rgba(20,26,70,0.55)"); ctx.fillStyle = bg2; ctx.fillRect(0, h * 0.74, w, h * 0.26);
    bulat(ctx, w * 0.2, by, u * 8.5, "#7A86C8", "mik"); bulat(ctx, w * 0.8, by, u * 8.5, "#7A86C8", "kamera"); bulat(ctx, w / 2, by, u * 10.5, RED, "tutup");
    ctx.restore();
    return { wajah: face, akhiri: { cx: w / 2, cy: by, x: w / 2 - u * 10.5, y: by - u * 10.5, w: u * 21, h: u * 21 }, glitch: burst };
  }

  // ---------- layar: obrolan ----------
  function obrolan(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, size = o.size || u * 9.5, pad = u * 4.5; ctx.save();
    ctx.fillStyle = "#E4E8FA"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(90,105,200,0.07)"; for (let i = 0; i < 40; i++) { const x = hn(i, 1, 4) * w, y = hn(i, 2, 4) * h; ctx.beginPath(); ctx.arc(x, y, u * (0.8 + hn(i, 3, 4) * 1.8), 0, TAU); ctx.fill(); }
    // kepala aplikasi
    const hh = u * 25; ctx.fillStyle = "#5466D6"; ctx.fillRect(0, 0, w, hh);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    ikon(ctx, "kembali", u * 6, hh * 0.64, u * 7, "#FFFFFF");
    avatar(ctx, u * 18, hh * 0.64, u * 6.5, "#8A9AF0");
    tx(ctx, o.nama || "Nomor baru", u * 28, hh * 0.58, u * 7, "#FFFFFF", { align: "left", weight: 800, fit: w - u * 32 });
    tx(ctx, o.status || "online", u * 28, hh * 0.58 + u * 6, u * 4.4, "rgba(255,255,255,0.8)", { align: "left", weight: 600 });
    // bilah ketik
    const iy = h - u * 17; ctx.fillStyle = "#F4F6FD"; ctx.fillRect(0, iy, w, h - iy);
    ctx.fillStyle = "#FFFFFF"; H.rr(ctx, u * 4, iy + u * 3.5, w - u * 22, u * 10, u * 5); ctx.fill(); tx(ctx, "Ketik pesan", u * 10, iy + u * 8.5, u * 4.6, "#9AA3C8", { align: "left", weight: 600 });
    bulat(ctx, w - u * 9.5, iy + u * 8.5, u * 6, "#5466D6", "mik");
    // gelembung, rata bawah
    const ps = o.pesan || [], nm = o.muncul == null ? ps.length : clamp(o.muncul, 0, ps.length), full = Math.floor(nm), fr = nm - full;
    const maxW = w * 0.74, lh = size * 1.22, items = [];
    const show = fr > 0 ? full + 1 : full;
    for (let i = 0; i < show; i++) {
      const m = ps[i]; let bw, bh, lines = null;
      if (m.suara) { bw = maxW * 0.95; bh = size * 1.9; }
      else { lines = H.wrap(ctx, m.teks || "", size, 600, maxW - pad * 2); ctx.font = `600 ${size}px ${FONT}`; bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + pad * 2; bw = Math.max(bw, u * 26); bh = lines.length * lh + pad * 1.7 + u * 3.6; }
      items.push({ m, bw, bh, lines, k: i === full ? D.spring(fr * 1.2, 11, 0.5) : 1, kh: i === full ? D.eout(fr * 1.8) : 1 });
    }
    if (o.mengetik) items.push({ ketik: true, bw: u * 26, bh: size * 1.6, k: 1, kh: 1 });
    let y = iy - u * 4; const out = [];
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i], aku = it.m && it.m.dari === "aku"; y -= it.bh * it.kh;
      const bx = aku ? w - u * 4 - it.bw : u * 4, col = aku ? "#C7F3E6" : "#FFFFFF";
      out[i] = { x: bx, y, w: it.bw, h: it.bh };
      if (y + it.bh > hh) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, hh, w, iy - hh); ctx.clip();
        const ox = aku ? bx + it.bw : bx, oy = y + it.bh; ctx.translate(ox, oy); ctx.scale(it.k, it.k); ctx.translate(-ox, -oy); ctx.globalAlpha *= clamp(it.k * 1.5);
        ctx.fillStyle = "rgba(60,70,140,0.12)"; H.rr(ctx, bx, y + u * 0.8, it.bw, it.bh, u * 5); ctx.fill();
        ctx.fillStyle = col; H.rr(ctx, bx, y, it.bw, it.bh, u * 5); ctx.fill();
        ctx.beginPath(); if (aku) { ctx.moveTo(bx + it.bw - u * 5, y + it.bh); ctx.lineTo(bx + it.bw + u * 2.4, y + it.bh + u * 0.6); ctx.lineTo(bx + it.bw, y + it.bh - u * 5); } else { ctx.moveTo(bx + u * 5, y + it.bh); ctx.lineTo(bx - u * 2.4, y + it.bh + u * 0.6); ctx.lineTo(bx, y + it.bh - u * 5); } ctx.fill();
        if (it.ketik) { for (let j = 0; j < 3; j++) { const hop = Math.max(0, Math.sin((t * 2.4 - j * 0.18) * TAU)) * u * 1.6; ctx.fillStyle = "#8C95BF"; ctx.beginPath(); ctx.arc(bx + it.bw / 2 + (j - 1) * u * 5, y + it.bh / 2 - hop, u * 1.7, 0, TAU); ctx.fill(); } }
        else if (it.m.suara) {
          const cy = y + it.bh / 2; bulat(ctx, bx + pad + size * 0.55, cy, size * 0.55, aku ? "#2EB89A" : "#5466D6", "putar");
          const x0 = bx + pad + size * 1.35, x1 = bx + it.bw - pad - size * 1.6;
          for (let j = 0, nb = Math.floor((x1 - x0) / (u * 2.2)); j < nb; j++) { const v = 0.25 + 0.75 * vn(j * 0.7, i + 3) * (0.5 + 0.5 * vn(j * 0.21, i + 9)); ctx.fillStyle = aku ? "#3C9C86" : "#7A86C8"; H.rr(ctx, x0 + j * u * 2.2, cy - v * size * 0.5, u * 1.2, v * size, u * 0.6); ctx.fill(); }
          tx(ctx, it.m.durasi || "0:07", bx + it.bw - pad, cy, size * 0.6, INK2, { align: "right", weight: 600 });
        } else {
          it.lines.forEach((l, j) => tx(ctx, l, bx + pad, y + pad * 0.85 + lh * (j + 0.5), size, INK, { align: "left", weight: 600 }));
          tx(ctx, it.m.jam || "23:0" + (i % 10), bx + it.bw - pad * (aku ? 1.9 : 0.7), y + it.bh - u * 3.4, u * 3.6, INK2, { align: "right", weight: 600 });
          if (aku) { ikon(ctx, "cek", bx + it.bw - pad * 0.95, y + it.bh - u * 3.6, u * 3.4, "#3AA0E8"); ikon(ctx, "cek", bx + it.bw - pad * 0.6, y + it.bh - u * 3.6, u * 3.4, "#3AA0E8"); }
        }
        ctx.restore();
      }
      y -= u * 3.2;
    }
    ctx.restore(); return { gelembung: out };
  }

  // ---------- layar: konfirmasi transfer bank ----------
  function transfer(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, hl = o.highlight, tk = o.tekan || {}; ctx.save();
    ctx.fillStyle = "#EEF1FB"; ctx.fillRect(0, 0, w, h);
    const hh = h * 0.2, hg = ctx.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#4766DE"); hg.addColorStop(1, "#6A57D8"); ctx.fillStyle = hg; H.rr(ctx, -u * 10, -u * 10, w + u * 20, hh + u * 10, u * 10); ctx.fill();
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.arc(u * 13, hh * 0.6, u * 6.5, 0, TAU); ctx.fill(); ikon(ctx, "bank", u * 13, hh * 0.6, u * 7, "#FFFFFF");
    tx(ctx, o.app || "Bank", u * 23, hh * 0.6, u * 7.6, "#FFFFFF", { align: "left", weight: 900 });
    tx(ctx, o.judul || "Konfirmasi Transfer", w / 2, hh + u * 9, u * 7, INK, { weight: 800, fit: w * 0.92 });
    // kartu penerima + nominal
    const cy0 = hh + u * 16, chh = (o.peringatan ? u * 10 : 0) + u * 58;
    ctx.fillStyle = "rgba(60,70,150,0.1)"; H.rr(ctx, u * 5, cy0 + u, w - u * 10, chh, u * 5); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; H.rr(ctx, u * 5, cy0, w - u * 10, chh, u * 5); ctx.fill();
    tx(ctx, "Penerima", u * 10, cy0 + u * 7, u * 4.6, INK2, { align: "left", weight: 600 });
    avatar(ctx, u * 17, cy0 + u * 17, u * 6.5, "#B3BCEB");
    tx(ctx, o.ke || "Rekening baru", u * 27, cy0 + u * 15.5, u * 6.4, INK, { align: "left", weight: 800, fit: w - u * 36 });
    tx(ctx, o.rek || "No. 000-111-2222", u * 27, cy0 + u * 21.5, u * 4.4, INK2, { align: "left", weight: 600, fit: w - u * 36 });
    let ny = cy0 + u * 30;
    if (o.peringatan) {
      const pa = 0.75 + 0.25 * Math.sin(t * 5); ctx.fillStyle = D.hexA("#FFE1E4", 1); H.rr(ctx, u * 9, cy0 + u * 26, w - u * 18, u * 9, u * 4.5); ctx.fill();
      ctx.globalAlpha *= pa; ikon(ctx, "bendera", u * 15, cy0 + u * 30.5, u * 6, RED); ctx.globalAlpha /= pa;
      tx(ctx, o.peringatan === true ? "Rekening belum pernah dipakai" : o.peringatan, u * 21, cy0 + u * 30.5, u * 4.2, "#C2364A", { align: "left", weight: 700, fit: w - u * 33 });
      ny += u * 10;
    }
    ctx.fillStyle = "#E6E9F6"; ctx.fillRect(u * 10, ny - u * 2, w - u * 20, u * 0.5);
    tx(ctx, "Nominal", u * 10, ny + u * 4.5, u * 4.6, INK2, { align: "left", weight: 600 });
    tx(ctx, o.nominal || "Rp3.000.000", w / 2, ny + u * 15, u * 11.5, INK, { weight: 900, fit: w * 0.82 });
    // rincian
    const iy = cy0 + chh + u * 9;
    tx(ctx, "Biaya admin", u * 10, iy, u * 4.6, INK2, { align: "left", weight: 600 }); tx(ctx, "Rp0", w - u * 10, iy, u * 4.6, INK, { align: "right", weight: 700 });
    tx(ctx, "Sumber dana", u * 10, iy + u * 8, u * 4.6, INK2, { align: "left", weight: 600 }); tx(ctx, "Tabungan", w - u * 10, iy + u * 8, u * 4.6, INK, { align: "right", weight: 700 });
    // tombol
    const bw = w - u * 14, bh = u * 17, bx = u * 7, out = {};
    [["transfer", "Transfer", "#FF5F78", h * 0.7], ["tunggu", "Tunggu", "#24BFA8", h * 0.7 + bh + u * 5]].forEach(([k, lab, col, by]) => {
      const on = hl === k, pres = tk.tombol === k ? clamp(tk.u || 0) : 0;
      const blink = on ? (k === "transfer" ? (Math.sin(t * 7) > 0 ? 1 : 0.35) : 0.5 + 0.5 * Math.sin(t * 4)) : 0;
      const sc = 1 - 0.05 * Math.sin(PI * clamp(pres * 2)) + (on ? 0.02 * blink : 0);
      ctx.save(); ctx.translate(w / 2, by + bh / 2); ctx.scale(sc, sc); ctx.translate(-w / 2, -by - bh / 2);
      if (on) { ctx.fillStyle = D.hexA(col, 0.28 * blink); H.rr(ctx, bx - u * 3, by - u * 3, bw + u * 6, bh + u * 6, u * 11); ctx.fill(); }
      ctx.fillStyle = dark(col, 0.28); H.rr(ctx, bx, by + u * 1.4, bw, bh, u * 8.5); ctx.fill();
      const gr = ctx.createLinearGradient(0, by, 0, by + bh); gr.addColorStop(0, lite(col, on ? 0.2 + 0.15 * blink : 0.12)); gr.addColorStop(1, col); ctx.fillStyle = gr; H.rr(ctx, bx, by + u * 1.4 * pres, bw, bh, u * 8.5); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.22)"; H.rr(ctx, bx + u * 4, by + u * 1.6 + u * 1.4 * pres, bw - u * 8, u * 2.4, u * 1.2); ctx.fill();
      tx(ctx, lab, w / 2, by + bh / 2 + u * 1.4 * pres, u * 9.5, "#FFFFFF", { weight: 900 });
      if (pres > 0) { ctx.save(); H.rr(ctx, bx, by, bw, bh, u * 8.5); ctx.clip(); ctx.fillStyle = D.hexA("#FFFFFF", 0.35 * (1 - pres)); ctx.beginPath(); ctx.arc(tk.x == null ? w / 2 : tk.x, by + bh / 2, bw * 0.8 * D.eout(pres), 0, TAU); ctx.fill(); ctx.restore(); }
      ctx.restore();
      out[k] = { x: bx, y: by, w: bw, h: bh, cx: w / 2, cy: by + bh / 2 };
    });
    ctx.restore(); return out;
  }

  // ---------- layar: perekam suara ----------
  function rekam(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, sv = clamp(o.tersimpan || 0); ctx.save();
    bgGrad(ctx, w, h, "#6553D6", "#3E62C2"); bokeh(ctx, w, h, 13, "#FFFFFF", 0.05);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    tx(ctx, o.label || "Perekam Suara", w / 2, h * 0.12, u * 6.2, "rgba(255,255,255,0.85)", { weight: 700 });
    const sec = Math.floor(t), dur = o.durasi || `00:${String(sec % 60).padStart(2, "0")}`;
    ctx.save(); ctx.globalAlpha *= 1 - sv;
    tx(ctx, dur, w / 2, h * 0.25, u * 17, "#FFFFFF", { weight: 800 });
    // riwayat gelombang menggulir ke kiri; garis tengah = sekarang
    const gy = h * 0.46, gh = h * 0.2, step = u * 3, n = Math.ceil(w / step) + 2, off = (t * 10) % 1;
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(0, gy - u * 0.25, w, u * 0.5);
    for (let i = 0; i < n; i++) {
      const k = Math.floor(t * 10) - (n - 1 - i), x = w / 2 - (n / 2 - i - off) * step * 0.5 * 2; if (x > w / 2 + step * 0.3) continue;
      const v = (0.15 + 0.85 * hn(k, 1, 77)) * (0.25 + 0.75 * vn(k * 0.12, 5));
      ctx.fillStyle = x > w / 2 - u * 30 ? "#FFFFFF" : "rgba(255,255,255,0.65)"; H.rr(ctx, x - u * 0.8, gy - v * gh / 2, u * 1.6, v * gh, u * 0.8); ctx.fill();
    }
    ctx.fillStyle = P.amber; ctx.fillRect(w / 2 - u * 0.4, gy - gh * 0.6, u * 0.8, gh * 1.2); ctx.beginPath(); ctx.arc(w / 2, gy - gh * 0.6, u * 1.6, 0, TAU); ctx.fill();
    const blink = Math.sin(t * PI * 2) > -0.3 ? 1 : 0.2; ctx.fillStyle = D.hexA(RED, blink); ctx.beginPath(); ctx.arc(w / 2 - u * 15, h * 0.63, u * 2.2, 0, TAU); ctx.fill();
    tx(ctx, "Merekam", w / 2 + u * 2, h * 0.63, u * 6, "#FFFFFF", { weight: 700 });
    ctx.restore();
    // kartu tersimpan
    if (sv > 0) {
      const k = D.spring(sv * 1.3, 10, 0.55), cy = lerp(h * 0.55, h * 0.36, D.eout(sv)), ch = u * 34;
      ctx.save(); ctx.globalAlpha *= clamp(sv * 2); ctx.translate(w / 2, cy); ctx.scale(k, k);
      ctx.fillStyle = "rgba(20,24,70,0.2)"; H.rr(ctx, -w * 0.42, -ch / 2 + u, w * 0.84, ch, u * 6); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; H.rr(ctx, -w * 0.42, -ch / 2, w * 0.84, ch, u * 6); ctx.fill();
      bulat(ctx, -w * 0.28, -u * 6, u * 7, GREEN, "cek");
      tx(ctx, o.namaRekaman || "Rekaman 1", -w * 0.17, -u * 8, u * 6, INK, { align: "left", weight: 800 });
      tx(ctx, o.durasiSimpan || "00:03", -w * 0.17, -u * 1.5, u * 4.8, INK2, { align: "left", weight: 600 });
      for (let j = 0; j < 22; j++) { const v = 0.2 + 0.8 * hn(j, 4, 77) * vn(j * 0.3, 2); ctx.fillStyle = "#6553D6"; H.rr(ctx, -w * 0.36 + j * u * 3.3, u * 9 - v * u * 5, u * 1.8, v * u * 10, u * 0.9); ctx.fill(); }
      ctx.restore();
    }
    // tombol rekam
    const by = h * 0.84, br = u * 13, out = { tombol: { cx: w / 2, cy: by, x: w / 2 - br, y: by - br, w: br * 2, h: br * 2 } };
    for (let i = 0; i < 2; i++) { const ph = (t * 0.9 + i / 2) % 1; ctx.strokeStyle = D.hexA(RED, 0.5 * (1 - ph) * (1 - sv)); ctx.lineWidth = u * 1.2; ctx.beginPath(); ctx.arc(w / 2, by, br * (1.05 + ph * 0.6), 0, TAU); ctx.stroke(); }
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(w / 2, by, br, 0, TAU); ctx.fill();
    ctx.fillStyle = RED; if (sv < 0.5) { ctx.beginPath(); ctx.arc(w / 2, by, br * 0.72, 0, TAU); ctx.fill(); } else { H.rr(ctx, w / 2 - br * 0.42, by - br * 0.42, br * 0.84, br * 0.84, br * 0.18); ctx.fill(); }
    ctx.restore(); return out;
  }

  function mati(ctx, w, h) { ctx.save(); const gr = ctx.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#2A3274"); gr.addColorStop(1, "#1A2058"); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h); ctx.restore(); }

  // ---------- HP ----------
  function hp(ctx, cx, cy, h, opt = {}) {
    const t = opt.t || 0, w = h * 0.485, ring = clamp(opt.ring || 0), lit = opt.lit == null ? 1 : clamp(opt.lit), tilt = clamp(opt.tilt || 0, -1, 1);
    const r = w * 0.17, b = w * 0.045, body = opt.body || "#3A4389";
    const M0 = ctx.getTransform();
    ctx.save();
    const shx = ring * (Math.sin(t * 71) * 0.6 + Math.sin(t * 43) * 0.4) * h * 0.012, shr = ring * Math.sin(t * 57) * 0.035;
    ctx.translate(cx + shx, cy); ctx.rotate((opt.rot || 0) + shr);
    // cahaya layar yang memancar
    const ga = opt.glow == null ? 0.55 * lit : opt.glow; if (ga > 0) D.glow(ctx, 0, 0, h * 1.05, opt.glowCol || "#A9D4FF", ga);
    // cincin dering
    if (ring > 0) {
      for (let i = 0; i < 3; i++) { const ph = (t * 1.1 + i / 3) % 1, k = 1 + ph * 0.35; ctx.strokeStyle = D.hexA(P.teal, ring * 0.55 * (1 - ph)); ctx.lineWidth = h * 0.012 * (1 - ph * 0.5); H.rr(ctx, -w / 2 * k - h * 0.02, -h / 2 * k - h * 0.02 * 0, w * k + h * 0.04, h * k, r * k * 1.2); ctx.stroke(); }
      ctx.lineCap = "round"; ctx.strokeStyle = D.hexA("#FFFFFF", ring * (0.55 + 0.35 * Math.sin(t * 20)));
      for (const sd of [-1, 1]) for (let j = 0; j < 2; j++) { ctx.lineWidth = h * 0.014; ctx.beginPath(); ctx.arc(sd * (w / 2 + h * 0.05 + j * h * 0.045), -h * 0.3, h * 0.07 + j * h * 0.03, sd > 0 ? -0.7 : PI - 0.7, sd > 0 ? 0.7 : PI + 0.7); ctx.stroke(); }
    }
    // miring 3D tipis: geser vertikal + sisi bodi terlihat
    const sk = tilt * 0.09, sx = 1 - Math.abs(tilt) * 0.12;
    ctx.transform(sx, sk, 0, 1, 0, 0);
    const dep = tilt * w * 0.07;
    ctx.save();
    if (opt.shadow !== false) { const mt = ctx.getTransform(), ds = Math.hypot(mt.a, mt.b); ctx.shadowColor = "rgba(14,18,60,0.42)"; ctx.shadowBlur = h * 0.06 * ds; ctx.shadowOffsetX = h * 0.012 * ds; ctx.shadowOffsetY = h * 0.03 * ds; }
    ctx.fillStyle = dark(body, 0.35); H.rr(ctx, -w / 2 - dep, -h / 2 + Math.abs(dep) * 0.15, w, h, r); ctx.fill(); ctx.restore();
    // tombol samping
    ctx.fillStyle = dark(body, 0.2);
    H.rr(ctx, w / 2 - w * 0.01, -h * 0.22, w * 0.035, h * 0.11, w * 0.015); ctx.fill();
    H.rr(ctx, -w / 2 - w * 0.025, -h * 0.28, w * 0.035, h * 0.07, w * 0.015); ctx.fill(); H.rr(ctx, -w / 2 - w * 0.025, -h * 0.18, w * 0.035, h * 0.07, w * 0.015); ctx.fill();
    // bodi
    ctx.save(); ctx.translate(dep * 0.15, 0);
    const bg = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); bg.addColorStop(0, lite(body, 0.12)); bg.addColorStop(1, dark(body, 0.12));
    ctx.fillStyle = bg; H.rr(ctx, -w / 2, -h / 2, w, h, r); ctx.fill();
    const rg = ctx.createLinearGradient(0, -h / 2, 0, h * 0.15); rg.addColorStop(0, D.hexA("#C9D2FF", 0.5)); rg.addColorStop(1, D.hexA("#C9D2FF", 0));
    ctx.strokeStyle = rg; ctx.lineWidth = w * 0.012; ctx.beginPath(); ctx.arc(-w / 2 + r, -h / 2 + r, r - w * 0.01, PI * 1.05, PI * 1.5); ctx.lineTo(w / 2 - r, -h / 2 + w * 0.01); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w / 2 + w * 0.01, -h / 2 + r); ctx.lineTo(-w / 2 + w * 0.01, h * 0.1); ctx.stroke();
    // layar
    const sw = w - b * 2, sh = h - b * 2, sxx = -w / 2 + b, syy = -h / 2 + b;
    ctx.save(); H.rr(ctx, sxx, syy, sw, sh, r - b * 0.8); ctx.clip(); ctx.translate(sxx, syy);
    let out;
    if (lit > 0 && opt.screen) { ctx.save(); out = opt.screen(ctx, sw, sh, t); ctx.restore(); } else mati(ctx, sw, sh);
    var M1 = ctx.getTransform();
    if (lit < 1) { ctx.fillStyle = D.hexA("#161C4C", (1 - lit) * (opt.screen ? 0.88 : 0)); ctx.fillRect(0, 0, sw, sh); }
    // pantulan kaca
    ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.beginPath(); ctx.moveTo(sw * 0.55, 0); ctx.lineTo(sw, 0); ctx.lineTo(sw, sh * 0.06); ctx.lineTo(sw * 0.1, sh * 0.62); ctx.lineTo(0, sh * 0.62); ctx.lineTo(0, sh * 0.42); ctx.closePath(); ctx.fill();
    ctx.restore();
    // kamera depan
    ctx.fillStyle = "#151A42"; ctx.beginPath(); ctx.arc(0, -h / 2 + b + sh * 0.025, w * 0.032, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(140,170,255,0.6)"; ctx.beginPath(); ctx.arc(-w * 0.009, -h / 2 + b + sh * 0.025 - w * 0.009, w * 0.009, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.restore();
    const inv = M0.inverse(), rel = inv.multiply(M1);
    const map = (lx, ly) => { const p = rel.transformPoint(new DOMPoint(lx, ly)); return { x: p.x, y: p.y }; };
    const s0 = map(0, 0), s1 = map(sw, sh);
    return { x: cx - w / 2, y: cy - h / 2, w, h, top: { x: cx, y: cy - h / 2 }, bottom: { x: cx, y: cy + h / 2 }, screen: { x: s0.x, y: s0.y, w: s1.x - s0.x, h: s1.y - s0.y }, map, out };
  }

  // ---------- spektrogram ----------
  const FMAX = 8000, CPS = 50, DUR = 12, NC = CPS * DUR, NR = 160;
  const SUARA = {
    ibu: { seed: 3, f0: 215, formants: [540, 1620, 2850], tempo: 4.0, serak: 0.1 },
    anak: { seed: 8, f0: 165, formants: [570, 1660, 2900], tempo: 5.2, serak: 0.05 },
    ayah: { seed: 21, f0: 112, formants: [470, 1300, 2450], tempo: 3.5, serak: 0.35 },
    nenek: { seed: 34, f0: 190, formants: [500, 1450, 2650], tempo: 3.0, serak: 0.5 },
    narator: { seed: 55, f0: 125, formants: [490, 1380, 2550], tempo: 4.4, serak: 0.08 },
    pelaku: { seed: 77, f0: 135, formants: [450, 1250, 2500], tempo: 4.6, serak: 0.25 },
  };
  const VOWEL = [[800, 1200, 2600], [300, 2300, 3000], [320, 800, 2400], [500, 1900, 2600], [500, 900, 2500]], VAVG = [480, 1420, 2620];
  const LUT = (() => {
    const st = [[0, "#2A3378"], [0.22, "#433C9E"], [0.42, "#7D45B6"], [0.6, "#D9548F"], [0.75, "#FF7F66"], [0.88, "#FFBE55"], [1, "#FFF4C8"]].map(([p, c]) => [p, rgb(c)]);
    const a = new Uint8ClampedArray(256 * 3);
    for (let i = 0; i < 256; i++) { const v = i / 255; let k = 0; while (k < st.length - 2 && v > st[k + 1][0]) k++; const f = (v - st[k][0]) / (st[k + 1][0] - st[k][0]); for (let j = 0; j < 3; j++) a[i * 3 + j] = Math.round(lerp(st[k][1][j], st[k + 1][1][j], clamp(f))); }
    return a;
  })();
  const lutCol = v => { const i = Math.round(clamp(v) * 255) * 3; return `rgb(${LUT[i]},${LUT[i + 1]},${LUT[i + 2]})`; };
  const prof = p => (typeof p === "string" ? SUARA[p] : p) || SUARA.ibu;
  const PLANS = {};
  function plan(pr) {
    const key = pr.seed + "|" + (pr.tempo || 4.2); if (PLANS[key]) return PLANS[key];
    const r = D.rng(pr.seed * 7919 + 13), tempo = pr.tempo || 4.2, S = []; let t = 0.3;
    while (t < DUR - 0.9) {
      const n = 3 + Math.floor(r() * 6), base = 0.95 + 0.1 * r();
      for (let k = 0; k < n; k++) { const d = (1 / tempo) * (0.6 + 0.8 * r()); if (t + d > DUR - 0.35) break; S.push({ t0: t, t1: t + d, v: Math.floor(r() * 5), fric: r() < 0.38, dir: r() * 2 - 1, loud: 0.62 + 0.38 * r(), fk: base * (1.12 - 0.24 * k / n) * (0.93 + 0.14 * r()) }); t += d + 0.015; }
      t += 0.16 + r() * 0.5;
    }
    return (PLANS[key] = S);
  }
  const STRIPS = {};
  function strip(pr) {
    const key = [pr.seed, pr.tempo, pr.f0, pr.formants.join(","), pr.serak || 0, pr.timing || ""].join("|"); if (STRIPS[key]) return STRIPS[key];
    const S = plan(pr.timing || pr), c = document.createElement("canvas"); c.width = NC; c.height = NR;
    const x = c.getContext("2d"), im = x.createImageData(NC, NR), d = im.data, fs = pr.formants.map((f, j) => f / VAVG[j]), ser = pr.serak || 0;
    let si = 0, prevF = VOWEL[0];
    for (let col = 0; col < NC; col++) {
      const tau = col / CPS; while (si < S.length - 1 && S[si].t1 < tau) { prevF = VOWEL[S[si].v]; si++; }
      const s = S[si], inside = s && tau >= s.t0 && tau <= s.t1, xx = inside ? (tau - s.t0) / (s.t1 - s.t0) : 0;
      let va = 0, fa = 0, f0 = pr.f0, F = VOWEL[0];
      if (inside) {
        if (s.fric && xx < 0.42) fa = s.loud * Math.pow(Math.sin(PI * xx / 0.42), 0.6) * 0.22;
        const vx = clamp((xx - (s.fric ? 0.34 : 0.03)) / (s.fric ? 0.66 : 0.97)); va = s.loud * Math.pow(Math.sin(PI * vx), 0.7);
        f0 = pr.f0 * s.fk * (1 + 0.11 * (xx - 0.5) * s.dir) * (1 + 0.012 * Math.sin(tau * 33));
        const gu = sm(xx / 0.3); F = VOWEL[s.v].map((v, j) => lerp(prevF[j], v, gu) * fs[j]);
      }
      for (let row = 0; row < NR; row++) {
        const f = (NR - 1 - row) / (NR - 1) * FMAX, nz = 0.45 * hn(col, row, pr.seed) + 0.55 * hn(col >> 1, row >> 2, pr.seed + 1);
        let E = 0.012 + 0.02 * nz;
        if (va > 0) {
          const env = gs((f - F[0]) / 150) + 0.75 * gs((f - F[1]) / 200) + 0.5 * gs((f - F[2]) / 280) + 0.55 * Math.exp(-f / 650) + 0.06 * Math.exp(-f / 3000);
          const k = f / f0, dd = (k - Math.round(k)) * f0, bw = 22 + f0 * 0.09, comb = f > f0 * 0.6 ? gs(dd / bw) : 0;
          E += va * (comb * env + ser * env * nz * 0.45 + 0.04 * env);
        }
        if (fa > 0) E += fa * sm((f - 2600) / 1800) * (1 - 0.65 * sm((f - 5500) / 2500)) * (0.15 + 0.85 * hn(col >> 1, row >> 3, pr.seed + 2) * nz);
        const v = Math.pow(clamp(Math.log1p(18 * E) / Math.log1p(18)), 0.85), li = Math.round(clamp(v) * 255) * 3, p = (row * NC + col) * 4;
        d[p] = LUT[li]; d[p + 1] = LUT[li + 1]; d[p + 2] = LUT[li + 2]; d[p + 3] = 255;
      }
    }
    x.putImageData(im, 0, 0); return (STRIPS[key] = c);
  }
  function blendProf(a, b, m) { return { seed: b.seed, tempo: b.tempo, timing: { seed: a.seed, tempo: a.tempo }, f0: Math.round(lerp(a.f0, b.f0, m)), formants: a.formants.map((f, j) => Math.round(lerp(f, b.formants[j], m))), serak: Math.round(lerp(a.serak || 0, b.serak || 0, m) * 100) / 100 }; }
  function drawStrip(ctx, c, x, y, w, h, t0, dur, fmax) {
    let s0 = ((t0 * CPS) % NC + NC) % NC, sw = dur * CPS; const r0 = NR * (1 - fmax / FMAX), rh = NR - r0;
    while (sw > 0) { const part = Math.min(sw, NC - s0), dw = part / (dur * CPS) * w; ctx.drawImage(c, s0, r0, part, rh, x, y, dw + 0.5, h); x += dw; sw -= part; s0 = 0; }
  }
  function spektrogram(ctx, x, y, w, h, opt = {}) {
    const pr = prof(opt.profil), dur = opt.dur || 4, fmax = clamp(opt.fmax || 5500, 1000, FMAX), scroll = opt.scroll || 0, rv = opt.reveal == null ? 1 : clamp(opt.reveal), rad = opt.r == null ? Math.min(w, h) * 0.06 : opt.r;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    if (opt.frame !== false) { ctx.fillStyle = "rgba(14,18,60,0.3)"; H.rr(ctx, x + h * 0.02, y + h * 0.04, w, h, rad); ctx.fill(); }
    H.rr(ctx, x, y, w, h, rad); ctx.fillStyle = lutCol(0); ctx.fill(); ctx.clip();
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * rv, h); ctx.clip(); ctx.imageSmoothingEnabled = true;
    const m = clamp(opt.morph || 0);
    if (m > 0 && opt.ke) {
      const b = prof(opt.ke), q = m * 8, i0 = Math.floor(q), f = q - i0;
      drawStrip(ctx, strip(blendProf(pr, b, i0 / 8)), x, y, w, h, scroll, dur, fmax);
      if (f > 0.001) { ctx.globalAlpha *= f; drawStrip(ctx, strip(blendProf(pr, b, Math.min(8, i0 + 1) / 8)), x, y, w, h, scroll, dur, fmax); }
    } else drawStrip(ctx, strip(pr), x, y, w, h, scroll, dur, fmax);
    ctx.restore();
    const yOf = hz => y + h * (1 - hz / fmax);
    if (opt.grid) { ctx.fillStyle = "rgba(255,255,255,0.12)"; for (let k = 1000; k < fmax; k += 1000) ctx.fillRect(x, yOf(k), w, Math.max(1, h * 0.004)); }
    if (opt.band) {
      const a = opt.bandAmt == null ? 1 : clamp(opt.bandAmt), [lo, hi] = opt.band, yh = yOf(hi), yl = yOf(lo);
      ctx.fillStyle = D.hexA("#202866", 0.93 * a); ctx.fillRect(x, y, w, yh - y); ctx.fillRect(x, yl, w, y + h - yl);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, yh - y); ctx.rect(x, yl, w, y + h - yl); ctx.clip(); ctx.strokeStyle = D.hexA("#8D98E0", 0.18 * a); ctx.lineWidth = Math.max(1.5, h * 0.008);
      for (let k = -h; k < w; k += h * 0.07) { ctx.beginPath(); ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h, y); ctx.stroke(); } ctx.restore();
      ctx.strokeStyle = D.hexA("#FFFFFF", 0.75 * a); ctx.lineWidth = Math.max(2, h * 0.012); ctx.setLineDash([h * 0.04, h * 0.03]);
      for (const yy of [yh, yl]) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); } ctx.setLineDash([]);
    }
    if (rv < 1 && rv > 0) { const px = x + w * rv; D.glow(ctx, px, y + h / 2, h * 0.5, P.warm, 0.4); ctx.fillStyle = "#FFF4C8"; ctx.fillRect(px - Math.max(1.5, w * 0.003), y, Math.max(3, w * 0.006), h); }
    // kilau kaca halus
    const gl = ctx.createLinearGradient(0, y, 0, y + h); gl.addColorStop(0, "rgba(255,255,255,0.08)"); gl.addColorStop(0.35, "rgba(255,255,255,0)"); ctx.fillStyle = gl; ctx.fillRect(x, y, w, h);
    ctx.restore();
    return { x, y, w, h, yOf, xOf: s => x + (s - scroll) / dur * w };
  }

  // ---------- gelombang ----------
  function gelombang(ctx, x, y, w, h, opt = {}) {
    const t = opt.t || 0, mode = opt.mode || "garis", seed = opt.seed || 1, sp = opt.speed == null ? 1 : opt.speed, col = opt.col || P.teal, col2 = opt.col2 || P.pink;
    const ampF = typeof opt.amp === "function" ? opt.amp : (u => (opt.amp == null ? 1 : opt.amp));
    const env = u => clamp(ampF(u, t)) * (0.35 + 0.65 * vn(u * 5 - t * sp * 1.6, seed)) * Math.pow(Math.sin(PI * clamp(u)), 0.5);
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, col); gr.addColorStop(1, col2);
    const cy = y + h / 2;
    if (mode === "batang") {
      const n = opt.n || Math.max(8, Math.round(w / 18)), st = w / n, bw = st * 0.55, an = clamp(opt.angka || 0), vals = [];
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n, v = clamp(0.08 + 0.92 * env(u) * (0.5 + 0.5 * vn(i * 0.9 + t * sp * 7, seed + 5))); vals.push(v);
        if (an < 1) { ctx.fillStyle = gr; ctx.globalAlpha = (opt.alpha == null ? 1 : opt.alpha) * (1 - an); const bh = Math.max(bw, v * h * (1 - an * 0.6)); H.rr(ctx, x + i * st + (st - bw) / 2, cy - bh / 2, bw, bh, bw / 2); ctx.fill(); }
      }
      if (an > 0) {
        const fsz = opt.angkaSize || Math.max(18, h * 0.22); ctx.font = `700 ${fsz}px ${FONT}`; const tw = ctx.measureText("-0,00").width * 1.15, every = Math.max(1, Math.ceil(tw / st));
        const q = Math.floor(t * 6);
        for (let i = 0; i < n; i += every) {
          if (i * st + st * every / 2 + tw / 2 > w + st) break;
          const sgn = hn(i, q, seed) < 0.5 ? -1 : 1, v = vals[i], s = (sgn * v).toFixed(2).replace(".", ",");
          ctx.globalAlpha = (opt.alpha == null ? 1 : opt.alpha) * an; tx(ctx, s, x + i * st + st * every / 2, cy + sgn * v * h * 0.3 * (1 - an * 0.5), fsz, i % (every * 2) ? col : col2, { weight: 700 });
        }
      }
      ctx.restore(); return vals;
    }
    const N = Math.max(40, Math.round(w / 4)), pts = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, ph = u * w / Math.max(40, h) * (opt.rapat || 4);
      const s = Math.sin(ph * 2.1 - t * sp * 9 + seed) * 0.55 + Math.sin(ph * 4.7 - t * sp * 13 + seed * 2) * 0.3 + Math.sin(ph * 9.3 - t * sp * 17) * 0.15;
      pts.push([x + u * w, s, env(u)]);
    }
    if (mode === "cermin") {
      ctx.beginPath(); pts.forEach(([px, s, e], i) => { const yy = cy - e * h / 2 * (0.55 + 0.45 * Math.abs(s)); i ? ctx.lineTo(px, yy) : ctx.moveTo(px, yy); });
      for (let i = pts.length - 1; i >= 0; i--) { const [px, s, e] = pts[i]; ctx.lineTo(px, cy + e * h / 2 * (0.55 + 0.45 * Math.abs(s))); }
      ctx.closePath(); ctx.globalAlpha *= 0.85; ctx.fillStyle = gr; ctx.fill(); ctx.globalAlpha /= 0.85;
      ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.fillRect(x, cy - Math.max(1, h * 0.012), w, Math.max(2, h * 0.024));
    } else {
      const line = () => { ctx.beginPath(); pts.forEach(([px, s, e], i) => { const yy = cy - s * e * h / 2; i ? ctx.lineTo(px, yy) : ctx.moveTo(px, yy); }); };
      const lw = opt.lw || Math.max(3, h * 0.045); ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (opt.glow !== false) { ctx.strokeStyle = gr; ctx.globalAlpha *= 0.22; ctx.lineWidth = lw * 4; line(); ctx.stroke(); ctx.globalAlpha /= 0.22; }
      ctx.strokeStyle = gr; ctx.lineWidth = lw; line(); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = lw * 0.35; line(); ctx.stroke();
    }
    ctx.restore(); return null;
  }

  // ---------- sidik jari <-> spektrogram ----------
  const RIDGES = {};
  function ridges(seed) {
    if (RIDGES[seed]) return RIDGES[seed];
    const r = D.rng(seed * 131 + 7), na = 20, nb = 6, out = [];
    const segs = () => { const sg = []; let s = r() * 0.04; while (s < 1) { const len = 0.12 + r() * 0.3, e = Math.min(1, s + len); sg.push([s, e]); s = e + 0.01 + r() * 0.022; } return sg; };
    // lingkaran pusaran terbuka di bawah, lalu lengkung (arch) di bagian bawah bantalan jari
    for (let i = 0; i < na; i++) { const rho = 0.06 + 1.2 * i / (na - 1), gap = rho < 0.4 ? 0.2 : Math.acos(Math.min(1, 0.4 / rho)) + 0.1;
      out.push({ i, kind: "arc", rho, gap, ph: r() * TAU, wob: 0.02 + r() * 0.02, segs: segs() }); }
    for (let j = 0; j < nb; j++) out.push({ i: na + j, kind: "arch", y0: 0.6 + j * 0.088, bow: 0.2 - j * 0.022, ph: r() * TAU, wob: 0.015, segs: segs() });
    return (RIDGES[seed] = { n: na + nb, list: out });
  }
  function fpPoint(R, s) {   // posisi sidik jari (satuan r); s 0..1 sepanjang guratan
    if (R.kind === "arch") { const x = -1 + 2 * s; return [x, R.y0 - R.bow * (1 - x * x) + R.wob * Math.sin(x * 5 + R.ph)]; }
    const a = lerp(PI / 2 + R.gap, PI / 2 + TAU - R.gap, s), wb = 1 + R.wob * Math.sin(a * 3 + R.ph);
    return [Math.cos(a) * R.rho * 0.8 * wb, Math.sin(a) * R.rho * 0.92 * wb + 0.04];
  }
  function sidikJari(ctx, cx, cy, r, opt = {}) {
    const t = opt.t || 0, fs = clamp(opt.fromSpec || 0), G = ridges(opt.seed || 1), pr = prof(opt.profil), col = opt.col || "#A5F1E6";
    const S = plan(pr), n = G.n;
    ctx.save(); ctx.translate(cx, cy); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    // latar: bantalan jari -> panel spektrogram
    if (fs < 1) { ctx.save(); ctx.globalAlpha *= 1 - fs; ctx.fillStyle = D.hexA(col, 0.1); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.84, r * 1.06, 0, 0, TAU); ctx.fill(); D.glow(ctx, 0, 0, r * 1.3, col, 0.25); ctx.restore(); }
    if (fs > 0) { ctx.save(); ctx.globalAlpha *= D.eout(fs); ctx.fillStyle = lutCol(0); H.rr(ctx, -r * 1.15, -r * 1.0, r * 2.3, r * 2.0, r * 0.12); ctx.fill(); ctx.restore(); }
    const lw0 = opt.lw || r * 0.032, lw1 = r * 1.8 / n * 0.42;
    const inPad = (x, y) => (x / 0.82) ** 2 + (y / 1.04) ** 2 < 1;
    const draws = [];
    G.list.forEach(R => {
      const ui = D.eio(clamp(fs * 1.5 - (R.i / n) * 0.5));
      const yb = 0.9 - 1.8 * (R.i + 0.5) / n;
      R.segs.forEach(([a, b]) => {
        const steps = Math.max(4, Math.round((b - a) * 90)); let path = [], cur = null;
        const flush = () => { if (path.length > 1 && (!cur || ui > 0.01)) draws.push({ path, ui, i: R.i, out: cur }); path = []; };
        for (let k = 0; k <= steps; k++) {
          const s = lerp(a, b, k / steps), [fx, fy] = fpPoint(R, s), o = !inPad(fx, fy);
          if (o !== cur) { const last = path[path.length - 1]; flush(); cur = o; if (last) path.push(last); }
          const tau = 0.3 + s * 3.2; let amp = 0; for (const sy of S) if (tau >= sy.t0 && tau <= sy.t1) { amp = sy.loud; break; }
          const sx = -1.05 + 2.1 * s, sy2 = 0.9 - (0.9 - yb) * (1 + 0.07 * Math.sin(s * 9 + (opt.seed || 1)));
          path.push([lerp(fx, sx, ui) * r, lerp(fy, sy2, ui) * r, amp]);
        }
        flush();
      });
    });
    ctx.lineCap = "round"; ctx.lineJoin = "round"; const A0 = ctx.globalAlpha;
    const pass = (hi) => draws.forEach(d => {
      ctx.globalAlpha = A0 * (hi ? 0.45 : 1) * (d.out ? clamp(d.ui * 1.6 - 0.5) : 1); if (ctx.globalAlpha <= 0) return;
      const e = gs((d.i / n - 0.12) / 0.14) * 0.9 + gs((d.i / n - 0.38) / 0.12) * 0.75 + 0.25;
      if (d.ui > 0.02) {
        // pecah menjadi potongan bersuara/diam supaya mirip pola suku kata
        ctx.lineWidth = lerp(lw0, lw1, d.ui);
        let run = []; const go = () => { if (run.length > 1) { ctx.beginPath(); run.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); } run = []; };
        ctx.strokeStyle = hi ? "#FFFFFF" : (d.ui > 0.5 ? lutCol(0.35 + 0.6 * clamp(e)) : mix(col, "#FFB547", d.ui * 0.6));
        d.path.forEach(p => { if (p[2] > 0 || d.ui < 0.5) run.push(p); else go(); }); go();
      } else {
        ctx.lineWidth = lw0; ctx.strokeStyle = hi ? "#FFFFFF" : col; ctx.beginPath(); d.path.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
      }
    });
    pass(false); ctx.globalAlpha = A0;
    // kilau berjalan (diam pun tetap hidup) + garis pindai
    const band = ((t * 0.35) % 1.6 - 0.3) * 2.2 * r - r * 1.1;
    ctx.save(); ctx.beginPath(); ctx.rect(-r * 1.3, band - r * 0.12, r * 2.6, r * 0.24); ctx.clip(); pass(true); ctx.restore(); ctx.globalAlpha = A0;
    if (opt.scan != null) { const yy = lerp(-r * 1.05, r * 1.05, clamp(opt.scan)); D.glow(ctx, 0, yy, r * 0.9, P.teal, 0.35); ctx.fillStyle = "#E9FFFB"; H.rr(ctx, -r * 1.1, yy - r * 0.012, r * 2.2, r * 0.024, r * 0.012); ctx.fill(); }
    ctx.restore();
  }

  // ---------- etalase ----------
  function showcase(ctx, t) {
    const W = 1920, HH = 1080;
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, "#3A4F9C"); gr.addColorStop(1, "#6177C6"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    D.glow(ctx, 1600, 120, 520, P.amber, 0.16); D.glow(ctx, 260, 980, 520, P.teal, 0.12);
    const cap = (s, x, y, size = 22, col = P.ink2, al = "center") => D.txt(ctx, s, x, y, size, { align: al, weight: 700, color: col });
    D.txt(ctx, "K.kit.layar", 40, 46, 34, { weight: 900 }); D.txt(ctx, "HP generik + layar aplikasi (baris 1) · spektrogram, gelombang, sidik jari (baris 2)", 270, 46, 24, { weight: 600, color: P.ink2 });
    const ph = 470, y0 = 330, L = K.kit.layar;
    const items = [
      ["panggilanMasuk · ring", { ring: 1, screen: (c, w, h) => L.panggilanMasuk(c, w, h, { t }) }],
      ["panggilan", { screen: (c, w, h) => L.panggilan(c, w, h, { t, nama: "Anakku", durasi: "00:" + String(42 + Math.floor(t)).padStart(2, "0") }) }],
      ["videoCall · glitch 1", { screen: (c, w, h) => L.videoCall(c, w, h, { t: t + 0.34, glitch: 1 }) }],
      ["obrolan · muncul", { screen: (c, w, h) => L.obrolan(c, w, h, { t, nama: "Nomor baru", mengetik: t % 3.4 > 2.2, muncul: Math.min(3, 1.4 + t * 0.7), pesan: [{ dari: "dia", teks: "Bu, ini aku." }, { dari: "dia", suara: true, durasi: "0:07" }, { dari: "aku", teks: "Kamu di mana?" }] }) }],
      ["transfer · tilt .5", { tilt: 0.5, screen: (c, w, h) => L.transfer(c, w, h, { t, highlight: t < 1.7 ? "transfer" : "tunggu", tekan: { tombol: "tunggu", u: clamp((t - 2.6) / 0.8) }, peringatan: true }) }],
      ["rekam · tersimpan", { screen: (c, w, h) => L.rekam(c, w, h, { t: t + 2, tersimpan: clamp((t - 2.4) / 0.8) }) }],
      ["lit 0.2 · tilt -.6", { lit: 0.2, tilt: -0.6, screen: (c, w, h) => L.panggilanMasuk(c, w, h, { t }) }],
    ];
    items.forEach(([name, o], i) => { const x = 140 + i * 273; const a = L.hp(ctx, x, y0, ph, Object.assign({ t, glow: o.lit != null ? undefined : 0.25 }, o)); cap(name, x, y0 + ph / 2 + 36);
      if (i === 4 && a.out) { const p = a.map(a.out.tunggu.cx, a.out.tunggu.cy); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, TAU); ctx.fill(); } });
    // baris 2
    const r2 = 640;
    ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(0, r2 - 30, W, 3);
    ["ibu", "anak", "ayah"].forEach((k, i) => { const x = 40 + i * 300; L.spektrogram(ctx, x, r2, 280, 150, { profil: k, scroll: t * 0.8 }); cap("spektrogram " + k, x + 140, r2 + 184); });
    L.spektrogram(ctx, 40, r2 + 215, 280, 150, { profil: "anak", scroll: t * 0.8, band: [300, 3400] }); cap("band [300, 3400]", 180, r2 + 399);
    const m = 0.5 + 0.5 * Math.sin(t * 1.3);
    L.spektrogram(ctx, 340, r2 + 215, 280, 150, { profil: "ayah", ke: "anak", morph: m, scroll: 0 }); cap("morph ayah→anak " + m.toFixed(2), 480, r2 + 399);
    L.spektrogram(ctx, 640, r2 + 215, 280, 150, { profil: "nenek", reveal: (t * 0.3) % 1, grid: true }); cap("reveal + grid (nenek)", 780, r2 + 399);
    // gelombang
    const gx = 960, gw = 360;
    [["garis", {}], ["batang", {}], ["cermin", { col: P.amber, col2: P.pink }], ["angka", { mode: "batang", angka: clamp((t - 0.5) / 2), angkaSize: 26, col: "#FFFFFF", col2: P.warm }]].forEach(([nm, o], i) => {
      const yy = r2 + i * 98; ctx.fillStyle = "rgba(20,28,80,0.35)"; H.rr(ctx, gx, yy, gw, 84, 14); ctx.fill();
      L.gelombang(ctx, gx + 14, yy + 8, gw - 28, 68, Object.assign({ t, mode: nm, seed: i + 2, n: 30 }, o)); cap(nm, gx + gw + 12, yy + 50, 20, P.ink2, "left");
    });
    // sidik jari
    [[0, 1540], [0.5, 1690], [1, 1840]].forEach(([f, x], i) => { const fv = i === 1 ? 0.5 + 0.5 * Math.sin(t * 0.9 - 1.2) : f; L.sidikJari(ctx, x, r2 + 90, 58, { fromSpec: fv, t, seed: 4, profil: "ibu", scan: i === 0 ? (t * 0.4) % 1 : undefined }); cap("sidikJari " + fv.toFixed(2), x, r2 + 196, 20); });

    // ikon
    const ics = ["telepon", "tutup", "mik", "mikMati", "speaker", "keypad", "kamera", "bank", "cek", "bendera", "putar", "kunci", "kembali", "orang"];
    ics.forEach((n, i) => { const x = 1490 + (i % 7) * 66, y = r2 + 270 + Math.floor(i / 7) * 66; ctx.fillStyle = "rgba(20,28,80,0.35)"; ctx.beginPath(); ctx.arc(x, y, 26, 0, TAU); ctx.fill(); L.ikon(ctx, n, x, y, 30, "#FFFFFF"); });
    cap("ikon(ctx, nama, cx, cy, s, col)", 1688, r2 + 396, 20);
  }

  K.kit.layar = { hp, panggilanMasuk, panggilan, videoCall, obrolan, transfer, rekam, mati, spektrogram, gelombang, sidikJari, ikon, avatar, statusBar, SUARA, LUT_COL: lutCol, showcase };
})(typeof window !== "undefined" ? window : globalThis);
