/* dokkit/layar.js — HP generik, layar aplikasi generik, dan visual suara (D03 dan seterusnya).
   Gaya vektor datar: tanpa garis hitam, pemisahan lewat isi lebih gelap/terang, pinggir terang, bayangan lembut.
   Tanpa merek: "Telepon", "Pesan", "Bank", "Kontak", "Beranda", "Perekam Suara"; nomor rekaan (0812-0000-1234). Deterministik; t dalam detik.
   HP
     hp(ctx, cx, cy, h, opt) -> {x,y,w,h, top, bottom, screen{x,y,w,h}, map(lx,ly)->{x,y}, out, flat?}   lebar bodi = 0,485 h
       opt: screen(ctx,w,h,t), t, teks (pengali huruf semua layar, bawaan 1), ringkas (2–3 elemen besar saja), tilt -1..1, rot, ring 0..1,
            lit 0..1, glow, glowCol, body, shadow, flat 0..1 (rebah di meja: tinggi x0,35, atas menyempit, sisi bodi, cahaya elips di meja;
            ring menggeser HP di meja; rot = putaran di bidang meja)
   Layar (opt.screen atau langsung; semua menerima teks, ringkas, t, jam):
     panggilanMasuk {nama, nomor, label, tanya} -> {tolak, terima}
     panggilan {nama, durasi | status:'Memanggil…', huruf, warna, suara 0..1, tanya} -> {akhiri}
     videoCall {wajah fn, orang, diri, wajahDiri, nama, durasi, glitch 0..1 (0,3 = naskah), kedip} -> {wajah, akhiri, glitch}
     obrolan {pesan:[{dari:'aku'|'dia', teks | suara:true, durasi, jam}], nama, status, muncul, mengetik, size} -> {gelembung[]}
     transfer {nominal, ke, rek, judul, app, peringatan true|teks, highlight:'transfer'|'tunggu', tekan:{tombol,u,x}} -> {transfer, tunggu}
     rekam {durasi, tersimpan 0..1, namaRekaman, durasiSimpan, label} -> {tombol}
     kontak {daftar:[{nama,nomor,warna}], sorot (indeks|nama), judul, banding:{lama, baru, namaLama, namaBaru, labelLama, labelBaru, u}}
            -> {baris[], telepon} | {lama, baru, beda[]}
     feed {post:[{jenis:'video'|'live'|'suara', judul}], privat 0..1, judul, labelPrivat} -> {sakelar, kartu[]}
     mati
   Suara: spektrogram(ctx,x,y,w,h,opt), gelombang(ctx,x,y,w,h,opt), sidikJari(ctx,cx,cy,r,opt), SUARA (ibu anak ayah nenek narator pelaku tiruan)
   Lain: jari(ctx,x,y,s,{tekan,bip,kulit,lengan,rot,riak,t}), ikon(ctx,nama,cx,cy,s,col) dengan nama di IKON, avatar, statusBar. */
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
  const INK = "#262F63", INK2 = "#5D6796", RED = "#FF5A6A", GREEN = "#2FD08A", BODY = "#2C3272";

  // hash & derau deterministik
  function hn(i, j, s) { let h = Math.imul(i | 0, 374761393) ^ Math.imul(j | 0, 668265263) ^ Math.imul(s | 0, 2246822519); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; }
  const gs = d => Math.exp(-d * d);
  function vn(x, s) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hn(i, 0, s), hn(i + 1, 0, s), u); }

  // ---------- skala teks bersama: hp() meneruskan opt.teks/opt.ringkas ke layar ----------
  let CUR = { teks: 1, ringkas: false };
  const Z = o => (o.teks != null ? o.teks : CUR.teks) || 1;
  const RK = o => (o.ringkas != null ? !!o.ringkas : !!CUR.ringkas);

  // ---------- teks ----------
  function tx(ctx, s, x, y, size, col, opt = {}) {
    const wt = opt.weight || 700; ctx.font = `${wt} ${size}px ${FONT}`;
    if (opt.fit) { const mw = ctx.measureText(s).width; if (mw > opt.fit) { size *= opt.fit / mw; ctx.font = `${wt} ${size}px ${FONT}`; } }
    ctx.fillStyle = col; ctx.textAlign = opt.align || "center"; ctx.textBaseline = opt.base || "middle"; ctx.fillText(s, x, y); return size;
  }
  // teks dibungkus maksimal o.maxLines baris (huruf diperkecil bila perlu), tengah vertikal di y
  function blok(ctx, s, x, y, size, col, o = {}) {
    const wt = o.weight || 800, mw = o.maxW, ml = o.maxLines || 2; let lines = H.wrap(ctx, s, size, wt, mw);
    while (lines.length > ml && size > 8) { size *= 0.92; lines = H.wrap(ctx, s, size, wt, mw); }
    ctx.font = `${wt} ${size}px ${FONT}`; const widest = Math.max(...lines.map(l => ctx.measureText(l).width)); if (widest > mw) size *= mw / widest;
    const lh = size * (o.lh || 1.12), y0 = y - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => tx(ctx, l, x, y0 + i * lh, size, col, { weight: wt, align: o.align || "center" }));
    return { size, n: lines.length, h: lines.length * lh };
  }

  // ---------- ikon vektor ----------
  function ikon(ctx, nama, cx, cy, s, col) {
    ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const L = (pts, lw) => { ctx.lineWidth = lw * s; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x * s, y * s) : ctx.moveTo(x * s, y * s)); ctx.stroke(); };
    const C = (x, y, r) => { ctx.beginPath(); ctx.arc(x * s, y * s, r * s, 0, TAU); ctx.fill(); };
    if (nama === "telepon" || nama === "tutup") {
      if (nama === "tutup") ctx.rotate(PI * 0.75); else ctx.rotate(-0.2);
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
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C((i - 1) * 0.32, (j - 1) * 0.32, 0.1);
    } else if (nama === "kamera") {
      H.rr(ctx, -s * 0.46, -s * 0.26, s * 0.62, s * 0.52, s * 0.12); ctx.fill();
      ctx.beginPath(); ctx.moveTo(s * 0.2, -s * 0.06); ctx.lineTo(s * 0.48, -s * 0.24); ctx.lineTo(s * 0.48, s * 0.24); ctx.lineTo(s * 0.2, s * 0.06); ctx.closePath(); ctx.fill();
    } else if (nama === "video") {   // berkas video: bingkai membulat + segitiga putar
      ctx.lineWidth = s * 0.1; H.rr(ctx, -s * 0.44, -s * 0.33, s * 0.88, s * 0.66, s * 0.14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.11, -s * 0.17); ctx.lineTo(s * 0.2, 0); ctx.lineTo(-s * 0.11, s * 0.17); ctx.closePath(); ctx.fill();
    } else if (nama === "live") {    // siaran langsung: titik + gelombang pancar
      C(0, 0, 0.13); ctx.lineWidth = s * 0.09;
      for (const r of [0.28, 0.44]) for (const sd of [0, PI]) { ctx.beginPath(); ctx.arc(0, 0, s * r, sd - 0.75, sd + 0.75); ctx.stroke(); }
    } else if (nama === "grup") {    // tiga orang
      ctx.save(); ctx.globalAlpha *= 0.62;
      for (const k of [-1, 1]) { C(k * 0.3, -0.16, 0.13); ctx.beginPath(); ctx.ellipse(k * s * 0.32, s * 0.3, s * 0.24, s * 0.2, 0, PI, TAU); ctx.fill(); }
      ctx.restore(); C(0, -0.14, 0.17); ctx.beginPath(); ctx.ellipse(0, s * 0.42, s * 0.32, s * 0.28, 0, PI, TAU); ctx.fill();
    } else if (nama === "unggah") {
      L([[0, 0.12], [0, -0.42]], 0.11); L([[-0.22, -0.2], [0, -0.42], [0.22, -0.2]], 0.11); L([[-0.4, 0.06], [-0.4, 0.4], [0.4, 0.4], [0.4, 0.06]], 0.11);
    } else if (nama === "bagikan") {
      L([[0.28, -0.3], [-0.26, 0], [0.28, 0.3]], 0.08); C(0.28, -0.3, 0.15); C(-0.26, 0, 0.15); C(0.28, 0.3, 0.15);
    } else if (nama === "cari") {
      ctx.lineWidth = s * 0.11; ctx.beginPath(); ctx.arc(-s * 0.08, -s * 0.08, s * 0.26, 0, TAU); ctx.stroke(); L([[0.12, 0.12], [0.38, 0.38]], 0.13);
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
      C(0, -0.18, 0.24); ctx.beginPath(); ctx.ellipse(0, s * 0.42, s * 0.42, s * 0.3, 0, PI, TAU); ctx.fill();
    }
    ctx.restore();
  }
  const IKON = ["telepon", "tutup", "mik", "mikMati", "speaker", "keypad", "kamera", "video", "live", "grup", "unggah", "bagikan", "cari", "bank", "cek", "bendera", "putar", "kunci", "kembali", "orang"];

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
  function bulat(ctx, cx, cy, r, col, ikonNama, icol = "#FFFFFF") {
    ctx.save(); ctx.fillStyle = "rgba(15,20,60,0.22)"; ctx.beginPath(); ctx.arc(cx, cy + r * 0.12, r, 0, TAU); ctx.fill();
    const gr = ctx.createLinearGradient(cx, cy - r, cx, cy + r); gr.addColorStop(0, lite(col, 0.18)); gr.addColorStop(1, dark(col, 0.08));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(cx, cy, r * 0.94, PI * 1.1, PI * 1.6); ctx.stroke();
    if (ikonNama) ikon(ctx, ikonNama, cx, cy, r * 0.95, icol); ctx.restore();
  }
  // avatar generik; opt.tanya = tanda tanya, opt.huruf = inisial
  function avatar(ctx, cx, cy, r, col, opt = {}) {
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = col; ctx.fill();
    if (opt.huruf) tx(ctx, opt.huruf, cx, cy + r * 0.04, r * 1.05, "#FFFFFF", { weight: 800 });
    else { ctx.clip(); ctx.fillStyle = lite(col, 0.45); ctx.beginPath(); ctx.arc(cx, cy - r * 0.18, r * 0.36, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.78, r * 0.68, r * 0.5, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    if (opt.tanya) { ctx.save(); ctx.beginPath(); ctx.arc(cx + r * 0.7, cy - r * 0.7, r * 0.32, 0, TAU); ctx.fillStyle = P.amber; ctx.fill(); tx(ctx, "?", cx + r * 0.7, cy - r * 0.68, r * 0.44, "#3A2A10", { weight: 900 }); ctx.restore(); }
  }
  // teks dengan titik-titik berdenyut bila diakhiri "…" atau "..."
  function statusTeks(ctx, s, x, y, size, col, t) {
    const m = /(…|\.\.\.)$/.exec(s); if (!m) return tx(ctx, s, x, y, size, col, { weight: 700 });
    const base = s.slice(0, m.index); ctx.font = `700 ${size}px ${FONT}`; const bw = ctx.measureText(base).width, dw = size * 1.1, x0 = x - (bw + dw) / 2;
    tx(ctx, base, x0, y, size, col, { weight: 700, align: "left" });
    for (let i = 0; i < 3; i++) { const a = 0.25 + 0.75 * sm(Math.sin((t * 1.6 - i * 0.22) * TAU) * 0.5 + 0.5); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0 + bw + size * 0.14 + i * size * 0.3, y + size * 0.26, size * 0.09, 0, TAU); ctx.fill(); ctx.restore(); }
  }

  // ---------- layar: panggilan masuk ----------
  function panggilanMasuk(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, z = Z(o), rk = RK(o); ctx.save();
    bgGrad(ctx, w, h, "#5B6BE0", "#8A5FD6"); bokeh(ctx, w, h, 4, "#FFFFFF", 0.05);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    if (!rk) tx(ctx, o.label || "Panggilan masuk", w / 2, h * 0.14, u * 5.4 * z, "rgba(255,255,255,0.8)", { weight: 600, fit: w * 0.9 });
    const ay = h * (rk ? 0.24 : 0.34), ar = u * (rk ? 15 : 17);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.7 + i / 3) % 1; ctx.strokeStyle = D.hexA("#FFFFFF", 0.35 * (1 - ph)); ctx.lineWidth = u * 1.2; ctx.beginPath(); ctx.arc(w / 2, ay, ar * (1 + ph * 0.9), 0, TAU); ctx.stroke(); }
    avatar(ctx, w / 2, ay, ar, "#7C8BEA", { tanya: o.tanya !== false });
    const nama = o.nama || "Nomor tidak dikenal", nomor = o.nomor == null ? "0812-0000-1234" : o.nomor;
    if (rk) { blok(ctx, nama, w / 2, h * 0.465, u * 14 * z, "#FFFFFF", { maxW: w * 0.92, weight: 800 }); if (nomor) tx(ctx, nomor, w / 2, h * 0.6, u * 12 * z, "rgba(255,255,255,0.9)", { weight: 700, fit: w * 0.94 }); }
    else { tx(ctx, nama, w / 2, h * 0.53, u * 9.4 * z, "#FFFFFF", { weight: 800, fit: w * 0.92 }); if (nomor) tx(ctx, nomor, w / 2, h * 0.6, u * 7.2 * z, "rgba(255,255,255,0.85)", { weight: 600, fit: w * 0.9 }); }
    const by = h * (rk ? 0.8 : 0.83), br = u * 12.5, out = {};
    [["tolak", w * (rk ? 0.24 : 0.27), RED, "tutup", "Tolak", 0], ["terima", w * (rk ? 0.76 : 0.73), GREEN, "telepon", "Terima", 0.5]].forEach(([k, x, col, ic, lab, ph]) => {
      const p = 0.5 + 0.5 * Math.sin((t * 1.6 + ph) * TAU), hop = k === "terima" ? -Math.abs(Math.sin(t * PI * 1.6)) * u * 2.2 : 0;
      ctx.fillStyle = D.hexA(col, 0.28 * p); ctx.beginPath(); ctx.arc(x, by, br * (1.15 + 0.3 * p), 0, TAU); ctx.fill();
      bulat(ctx, x, by + hop, br * (1 + 0.04 * p), col, ic);
      if (rk) tx(ctx, lab, x, by + br + u * 10.5, u * 14 * z, "#FFFFFF", { weight: 800, fit: w * 0.5 });
      else tx(ctx, lab, x, by + br + u * 7, u * 5.6 * z, "#FFFFFF", { weight: 700, fit: w * 0.44 });
      out[k] = { x: x - br, y: by - br, w: br * 2, h: br * 2, cx: x, cy: by };
    });
    ctx.restore(); return out;
  }

  // ---------- layar: panggilan aktif / keluar ----------
  function panggilan(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, z = Z(o), rk = RK(o), keluar = !!o.status, lv = keluar ? 0 : (o.suara == null ? 1 : o.suara); ctx.save();
    bgGrad(ctx, w, h, "#3E86C9", "#4B55B8"); bokeh(ctx, w, h, 9, "#FFFFFF", 0.05);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    const ay = h * 0.24, ar = u * 15;
    if (keluar) { for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; ctx.fillStyle = D.hexA("#FFFFFF", 0.16 * (1 - ph)); ctx.beginPath(); ctx.arc(w / 2, ay, ar * (1 + ph * 1.0), 0, TAU); ctx.fill(); } }
    else { const amp = lv * (0.35 + 0.65 * vn(t * 6, 3)) * (0.4 + 0.6 * vn(t * 1.3, 8)); ctx.fillStyle = D.hexA(P.teal, 0.25 + 0.2 * amp); ctx.beginPath(); ctx.arc(w / 2, ay, ar * (1.1 + 0.25 * amp), 0, TAU); ctx.fill(); }
    avatar(ctx, w / 2, ay, ar, o.warna || "#6E9BE0", { tanya: !!o.tanya, huruf: o.huruf });
    const nama = o.nama || "Nomor tidak dikenal";
    let ny = h * 0.41;
    if (rk) { const b = blok(ctx, nama, w / 2, h * 0.42, u * 14 * z, "#FFFFFF", { maxW: w * 0.92, weight: 800 }); ny = h * 0.42 + b.h / 2 - u * 2; }
    else tx(ctx, nama, w / 2, ny, u * 9 * z, "#FFFFFF", { weight: 800, fit: w * 0.92 });
    const sy = rk ? ny + u * 10 : h * 0.48, ss = u * (rk ? 11 : 7.6) * z;
    if (keluar) statusTeks(ctx, o.status, w / 2, sy, ss, "rgba(255,255,255,0.92)", t);
    else tx(ctx, o.durasi || "00:42", w / 2, sy, ss, "rgba(255,255,255,0.88)", { weight: 700 });
    if (!keluar) gelombang(ctx, w * 0.1, h * (rk ? 0.58 : 0.53), w * 0.8, h * (rk ? 0.1 : 0.13), { t, mode: "batang", amp: (x, tt) => lv * (0.3 + 0.7 * vn(tt * 2.2 + x * 3, 21)), col: P.teal, col2: "#FFFFFF", n: 22, seed: o.seed || 5 });
    const ys = h * 0.74; [["speaker", 0.22], ["mikMati", 0.5], ["keypad", 0.78]].forEach(([ic, fx]) => bulat(ctx, w * fx, ys, u * 9, "#7A8FE0", ic));
    const out = { akhiri: { cx: w / 2, cy: h * 0.88, x: w / 2 - u * 11, y: h * 0.88 - u * 11, w: u * 22, h: u * 22 } };
    bulat(ctx, w / 2, h * 0.88, u * 11, RED, "tutup");
    ctx.restore(); return out;
  }

  // ---------- layar: panggilan video (petunjuk deepfake) ----------
  const POOL = {};
  function kanvas(key, w, h) { let c = POOL[key]; if (!c || c.width < w || c.height < h) { const nc = document.createElement("canvas"); nc.width = Math.max(w, c ? c.width : 0); nc.height = Math.max(h, c ? c.height : 0); c = POOL[key] = nc; } return c; }
  function wajahBawaan(ctx, w, h, t, o) {
    // kamar sewaan hangat: dinding krem, rak, jendela
    bgGrad(ctx, w, h, "#E9C79E", "#B98E78");
    ctx.fillStyle = "rgba(255,255,255,0.2)"; H.rr(ctx, w * 0.62, h * 0.12, w * 0.3, h * 0.26, w * 0.03); ctx.fill();
    ctx.fillStyle = "#9A6E58"; ctx.fillRect(w * 0.05, h * 0.3, w * 0.3, h * 0.025);
    ctx.fillStyle = "#7FB7A8"; H.rr(ctx, w * 0.08, h * 0.22, w * 0.07, h * 0.08, w * 0.015); ctx.fill(); ctx.fillStyle = "#E58A6F"; H.rr(ctx, w * 0.18, h * 0.19, w * 0.06, h * 0.11, w * 0.015); ctx.fill();
    D.glow(ctx, w * 0.8, h * 0.2, w * 0.5, P.warm, 0.35);
    const r = w * 0.19, cx = w / 2 + Math.sin(t * 0.7) * w * 0.012, cy = h * 0.47 + Math.sin(t * 0.9) * h * 0.006;
    const OR = K.kit.orang, oo = Object.assign({ hair: "hijab", hijab: "#4FA88E", ciput: "#2E6E5E", skin: OR ? OR.SKIN[2] : "#CD9165", top: "#6C7FD6", face: "sedih", t, seed: 21, bahu: 3 }, o.orang || {});
    // bahu lebar + lengan di bawah kepala (supaya tidak terbaca sebagai botol)
    const top = oo.top, br = 0.5 + 0.5 * Math.sin(t * 1.9);
    ctx.fillStyle = dark(top, 0.1); H.rr(ctx, cx - r * 2.05, cy + r * 1.25 - br * r * 0.02, r * 4.1, h, r * 1.05); ctx.fill();
    ctx.fillStyle = top; H.rr(ctx, cx - r * 1.55, cy + r * 1.05 - br * r * 0.02, r * 3.1, h, r * 0.95); ctx.fill();
    ctx.fillStyle = D.hexA("#FFFFFF", 0.14); H.rr(ctx, cx - r * 1.4, cy + r * 1.15, r * 0.9, r * 0.22, r * 0.11); ctx.fill();
    if (OR) OR.kepala(ctx, cx, cy, r, oo);
    else { ctx.fillStyle = oo.skin; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); }
    return { x: cx - r * 1.05, y: cy - r * 1.1, w: r * 2.1, h: r * 2.2 };
  }
  function videoCall(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, gl = clamp(o.glitch || 0), z = Z(o), rk = RK(o); ctx.save();
    const m = ctx.getTransform(), s = clamp(Math.hypot(m.a, m.b), 0.5, 2.5);
    const cw = Math.ceil(w * s), ch = Math.ceil(h * s), oc = kanvas("vc", cw, ch), o2 = oc.getContext("2d");
    o2.setTransform(1, 0, 0, 1, 0, 0); o2.clearRect(0, 0, oc.width, oc.height); o2.setTransform(s, 0, 0, s, 0, 0);
    let face = (o.wajah || ((c, ww, hh, tt) => wajahBawaan(c, ww, hh, tt, o)))(o2, w, h, t);
    face = face || { x: w * 0.28, y: h * 0.26, w: w * 0.44, h: h * 0.42 };
    // ledakan glitch deterministik per 1/6 detik; o.kedip = paksa ledakan di bingkai ini (untuk menepatkan dengan kata)
    const slot = Math.floor(t * 6), hit = gl > 0 && (o.kedip || hn(slot, 7, 31) < 0.08 + 0.36 * gl), burst = hit ? gl * (0.6 + 0.4 * hn(slot, 3, 9)) : 0;
    ctx.drawImage(oc, 0, 0, cw, ch, 0, 0, w, h);
    if (burst > 0) {
      const sub = Math.floor(t * 18), heavy = clamp((gl - 0.5) * 2);
      if (heavy > 0) {   // hanya glitch berat: wajah memburam kotak-kotak
        const pc = kanvas("vcpix", 24, 24), p2 = pc.getContext("2d"), n = Math.round(lerp(18, 9, burst));
        p2.setTransform(1, 0, 0, 1, 0, 0); p2.clearRect(0, 0, 24, 24); p2.imageSmoothingEnabled = true;
        p2.drawImage(oc, face.x * s, face.y * s, face.w * s, face.h * s, 0, 0, n, n);
        ctx.save(); ctx.globalAlpha = clamp(burst * 1.2 * heavy); ctx.imageSmoothingEnabled = false; ctx.drawImage(pc, 0, 0, n, n, face.x, face.y, face.w, face.h); ctx.restore();
      }
      // irisan bergeser: glitch rendah = 1–2 irisan tipis di wajah (dibatasi daerah wajah)
      const gx0 = heavy > 0 ? 0 : Math.max(0, face.x - face.w * 0.2), gw = heavy > 0 ? w : Math.min(w - gx0, face.w * 1.4);
      const ns = heavy > 0 ? Math.round(lerp(2, 6, heavy)) : (hn(slot, 5, 3) < 0.5 ? 1 : 2);
      for (let i = 0; i < ns; i++) {
        const y0 = face.y + (0.15 + 0.7 * hn(sub, i, 1)) * face.h, bh = h * (0.012 + (heavy > 0 ? 0.04 : 0.018) * hn(sub, i, 2));
        const dx = (hn(sub, i, 3) < 0.5 ? -1 : 1) * (0.025 + 0.06 * hn(sub, i, 4)) * w * (0.5 + burst);
        ctx.save(); ctx.beginPath(); ctx.rect(gx0, 0, gw, h); ctx.clip();
        ctx.drawImage(oc, 0, y0 * s, cw, bh * s, dx, y0, w, bh);
        ctx.fillStyle = D.hexA(i % 2 ? P.teal : P.pink, 0.3 + 0.15 * heavy); ctx.fillRect(gx0 + dx + (i % 2 ? 1.8 : -1.8) * u, y0, gw, bh * 0.45); ctx.restore();
      }
      if (heavy > 0) { ctx.fillStyle = D.hexA("#FFFFFF", 0.05 * burst); for (let y = 0; y < h; y += u * 1.6) ctx.fillRect(0, y, w, u * 0.4); }
    }
    // antarmuka panggilan
    const tg = ctx.createLinearGradient(0, 0, 0, h * 0.22); tg.addColorStop(0, "rgba(20,26,70,0.6)"); tg.addColorStop(1, "rgba(20,26,70,0)"); ctx.fillStyle = tg; ctx.fillRect(0, 0, w, h * 0.22);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    const pw = u * 24, ph = u * 34, px = w - u * 30, py = h * 0.07;
    if (rk) tx(ctx, o.nama || "Bibi", u * 6, h * 0.1, u * 12 * z, "#FFFFFF", { align: "left", weight: 900, fit: px - u * 9 });
    else { tx(ctx, o.nama || "Bibi", u * 7, h * 0.1, u * 8 * z, "#FFFFFF", { align: "left", weight: 800, fit: px - u * 10 }); tx(ctx, o.durasi || "01:15", u * 7, h * 0.1 + u * 7.5 * z, u * 5 * z, "rgba(255,255,255,0.85)", { align: "left", weight: 600 }); }
    // pratinjau kamera sendiri
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
    const u = w / 100, t = o.t || 0, z = Z(o), rk = RK(o), size = o.size || u * (rk ? 14 : 9.5) * z, pad = u * 4.5; ctx.save();
    ctx.fillStyle = "#E4E8FA"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(90,105,200,0.07)"; for (let i = 0; i < 40; i++) { const x = hn(i, 1, 4) * w, y = hn(i, 2, 4) * h; ctx.beginPath(); ctx.arc(x, y, u * (0.8 + hn(i, 3, 4) * 1.8), 0, TAU); ctx.fill(); }
    const hh = u * 25; ctx.fillStyle = "#5466D6"; ctx.fillRect(0, 0, w, hh);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    ikon(ctx, "kembali", u * 6, hh * 0.64, u * 7, "#FFFFFF");
    avatar(ctx, u * 18, hh * 0.64, u * 6.5, "#8A9AF0");
    if (rk) tx(ctx, o.nama || "Nomor baru", u * 28, hh * 0.64, u * 10 * z, "#FFFFFF", { align: "left", weight: 800, fit: w - u * 32 });
    else { tx(ctx, o.nama || "Nomor baru", u * 28, hh * 0.58, u * 7 * z, "#FFFFFF", { align: "left", weight: 800, fit: w - u * 32 }); tx(ctx, o.status || "online", u * 28, hh * 0.58 + u * 6 * z, u * 4.4 * z, "rgba(255,255,255,0.8)", { align: "left", weight: 600 }); }
    const iy = h - u * 17; ctx.fillStyle = "#F4F6FD"; ctx.fillRect(0, iy, w, h - iy);
    ctx.fillStyle = "#FFFFFF"; H.rr(ctx, u * 4, iy + u * 3.5, w - u * 22, u * 10, u * 5); ctx.fill();
    if (!rk) tx(ctx, "Ketik pesan", u * 10, iy + u * 8.5, u * 4.6 * z, "#9AA3C8", { align: "left", weight: 600 });
    bulat(ctx, w - u * 9.5, iy + u * 8.5, u * 6, "#5466D6", "mik");
    const ps = o.pesan || [], nm = o.muncul == null ? ps.length : clamp(o.muncul, 0, ps.length), full = Math.floor(nm), fr = nm - full;
    const maxW = w * (rk ? 0.84 : 0.74), lh = size * 1.18, items = [], foot = rk ? 0 : u * 3.6;
    const show = fr > 0 ? full + 1 : full;
    for (let i = 0; i < show; i++) {
      const m = ps[i]; let bw, bh, lines = null;
      if (m.suara) { bw = maxW * 0.95; bh = size * 1.9; }
      else { lines = H.wrap(ctx, m.teks || "", size, 600, maxW - pad * 2); ctx.font = `600 ${size}px ${FONT}`; bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + pad * 2; bw = Math.max(bw, u * 26); bh = lines.length * lh + pad * 1.5 + foot; }
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
          const x0 = bx + pad + size * 1.35, x1 = bx + it.bw - pad - (rk ? 0 : size * 1.6);
          for (let j = 0, nb = Math.floor((x1 - x0) / (u * 2.2)); j < nb; j++) { const v = 0.25 + 0.75 * vn(j * 0.7, i + 3) * (0.5 + 0.5 * vn(j * 0.21, i + 9)); ctx.fillStyle = aku ? "#3C9C86" : "#7A86C8"; H.rr(ctx, x0 + j * u * 2.2, cy - v * size * 0.5, u * 1.2, v * size, u * 0.6); ctx.fill(); }
          if (!rk) tx(ctx, it.m.durasi || "0:07", bx + it.bw - pad, cy, size * 0.6, INK2, { align: "right", weight: 600 });
        } else {
          it.lines.forEach((l, j) => tx(ctx, l, bx + pad, y + pad * 0.75 + lh * (j + 0.5), size, INK, { align: "left", weight: 600 }));
          if (!rk) {
            tx(ctx, it.m.jam || "23:0" + (i % 10), bx + it.bw - pad * (aku ? 1.9 : 0.7), y + it.bh - u * 3.4, u * 3.6, INK2, { align: "right", weight: 600 });
            if (aku) { ikon(ctx, "cek", bx + it.bw - pad * 0.95, y + it.bh - u * 3.6, u * 3.4, "#3AA0E8"); ikon(ctx, "cek", bx + it.bw - pad * 0.6, y + it.bh - u * 3.6, u * 3.4, "#3AA0E8"); }
          }
        }
        ctx.restore();
      }
      y -= u * 3.2;
    }
    ctx.restore(); return { gelembung: out };
  }

  // nominal: awalan "Rp" lebih kecil supaya angka bisa ≥40 px di HP h≈650
  function nominalTeks(ctx, s, cx, y, size, col, fit) {
    const m = /^(Rp)\s?(.*)$/.exec(s); if (!m) return tx(ctx, s, cx, y, size, col, { weight: 900, fit });
    const ps = size * 0.58; ctx.font = `800 ${ps}px ${FONT}`; const pw = ctx.measureText(m[1]).width + size * 0.08; ctx.font = `900 ${size}px ${FONT}`; let nw = ctx.measureText(m[2]).width, k = 1;
    if (pw + nw > fit) k = fit / (pw + nw);
    const x0 = cx - (pw + nw) * k / 2; tx(ctx, m[1], x0, y + size * k * 0.36, ps * k, col, { weight: 800, align: "left", base: "alphabetic" }); tx(ctx, m[2], x0 + pw * k, y + size * k * 0.36, size * k, col, { weight: 900, align: "left", base: "alphabetic" });
  }

  // ---------- layar: konfirmasi transfer bank ----------
  function tombolBesar(ctx, w, u, k, lab, col, by, bh, on, pres, t, size, tkx) {
    const bw = w - u * 14, bx = u * 7;
    const blink = on ? (k === "transfer" ? (Math.sin(t * 7) > 0 ? 1 : 0.35) : 0.5 + 0.5 * Math.sin(t * 4)) : 0;
    const sc = 1 - 0.05 * Math.sin(PI * clamp(pres * 2)) + (on ? 0.02 * blink : 0);
    ctx.save(); ctx.translate(w / 2, by + bh / 2); ctx.scale(sc, sc); ctx.translate(-w / 2, -by - bh / 2);
    if (on) { ctx.fillStyle = D.hexA(col, 0.28 * blink); H.rr(ctx, bx - u * 3, by - u * 3, bw + u * 6, bh + u * 6, Math.min(bh / 2 + u * 3, u * 11)); ctx.fill(); }
    const rr = Math.min(bh / 2, u * 8.5);
    ctx.fillStyle = dark(col, 0.28); H.rr(ctx, bx, by + u * 1.4, bw, bh, rr); ctx.fill();
    const gr = ctx.createLinearGradient(0, by, 0, by + bh); gr.addColorStop(0, lite(col, on ? 0.2 + 0.15 * blink : 0.12)); gr.addColorStop(1, col); ctx.fillStyle = gr; H.rr(ctx, bx, by + u * 1.4 * pres, bw, bh, rr); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.22)"; H.rr(ctx, bx + u * 4, by + u * 1.6 + u * 1.4 * pres, bw - u * 8, u * 2.4, u * 1.2); ctx.fill();
    tx(ctx, lab, w / 2, by + bh / 2 + u * 1.4 * pres, size, "#FFFFFF", { weight: 900, fit: bw * 0.86 });
    if (pres > 0) { ctx.save(); H.rr(ctx, bx, by, bw, bh, rr); ctx.clip(); ctx.fillStyle = D.hexA("#FFFFFF", 0.35 * (1 - pres)); ctx.beginPath(); ctx.arc(tkx == null ? w / 2 : tkx, by + bh / 2, bw * 0.8 * D.eout(pres), 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.restore();
    return { x: bx, y: by, w: bw, h: bh, cx: w / 2, cy: by + bh / 2 };
  }
  function transfer(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, hl = o.highlight, tk = o.tekan || {}, z = Z(o), rk = RK(o); ctx.save();
    ctx.fillStyle = "#EEF1FB"; ctx.fillRect(0, 0, w, h);
    const hh = h * (rk ? 0.15 : 0.2), hg = ctx.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#4766DE"); hg.addColorStop(1, "#6A57D8"); ctx.fillStyle = hg; H.rr(ctx, -u * 10, -u * 10, w + u * 20, hh + u * 10, u * 10); ctx.fill();
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    const hy = rk ? hh * 0.66 : hh * 0.6;
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.arc(u * 13, hy, u * 6.5, 0, TAU); ctx.fill(); ikon(ctx, "bank", u * 13, hy, u * 7, "#FFFFFF");
    tx(ctx, o.app || "Bank", u * 23, hy, u * (rk ? 9 : 7.6) * z, "#FFFFFF", { align: "left", weight: 900, fit: w - u * 28 });
    const out = {};
    if (rk) {
      // ringkas: penerima, (peringatan), nominal, dua tombol besar
      const cy0 = hh + u * 6, warn = !!o.peringatan, chh = u * (warn ? 76 : 58);
      ctx.fillStyle = "rgba(60,70,150,0.1)"; H.rr(ctx, u * 5, cy0 + u, w - u * 10, chh, u * 6); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; H.rr(ctx, u * 5, cy0, w - u * 10, chh, u * 6); ctx.fill();
      avatar(ctx, u * 17, cy0 + u * 13, u * 7, "#B3BCEB");
      tx(ctx, o.ke || "Rekening baru", u * 28, cy0 + u * 13, u * 11 * z, INK, { align: "left", weight: 800, fit: w - u * 36 });
      let ny = cy0 + u * 27;
      if (warn) {
        const pa = 0.75 + 0.25 * Math.sin(t * 5); ctx.fillStyle = "#FFE1E4"; H.rr(ctx, u * 9, ny, w - u * 18, u * 17, u * 6); ctx.fill();
        ctx.save(); ctx.globalAlpha *= pa; ikon(ctx, "bendera", u * 16.5, ny + u * 8.5, u * 9, RED); ctx.restore();
        blok(ctx, o.peringatan === true ? "Rekening belum pernah dipakai" : o.peringatan, u * 25, ny + u * 8.5, u * 7 * z, "#C2364A", { maxW: w - u * 38, weight: 800, align: "left", lh: 1.08 });
        ny += u * 19;
      }
      nominalTeks(ctx, o.nominal || "Rp3.000.000", w / 2, ny + u * 13, u * 14.5 * z, INK, w * 0.88);
      const bh = u * 21, gap = u * 6, b0 = Math.max(cy0 + chh + u * 8, ((cy0 + chh + u * 8) + (h - u * 12 - 2 * bh - gap)) / 2);
      [["transfer", "Transfer", "#FF5F78", b0], ["tunggu", "Tunggu", "#24BFA8", b0 + bh + gap]].forEach(([k, lab, col, by]) => {
        out[k] = tombolBesar(ctx, w, u, k, lab, col, by, bh, hl === k, tk.tombol === k ? clamp(tk.u || 0) : 0, t, u * 14.5 * z, tk.x); });
      ctx.restore(); return out;
    }
    tx(ctx, o.judul || "Konfirmasi Transfer", w / 2, hh + u * 9, u * 7 * z, INK, { weight: 800, fit: w * 0.92 });
    const cy0 = hh + u * 16, chh = (o.peringatan ? u * 10 : 0) + u * 58;
    ctx.fillStyle = "rgba(60,70,150,0.1)"; H.rr(ctx, u * 5, cy0 + u, w - u * 10, chh, u * 5); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; H.rr(ctx, u * 5, cy0, w - u * 10, chh, u * 5); ctx.fill();
    tx(ctx, "Penerima", u * 10, cy0 + u * 7, u * 4.6 * z, INK2, { align: "left", weight: 600 });
    avatar(ctx, u * 17, cy0 + u * 17, u * 6.5, "#B3BCEB");
    tx(ctx, o.ke || "Rekening baru", u * 27, cy0 + u * 15.5, u * 6.4 * z, INK, { align: "left", weight: 800, fit: w - u * 36 });
    tx(ctx, o.rek || "No. 000-111-2222", u * 27, cy0 + u * 21.5, u * 4.4 * z, INK2, { align: "left", weight: 600, fit: w - u * 36 });
    let ny = cy0 + u * 30;
    if (o.peringatan) {
      const pa = 0.75 + 0.25 * Math.sin(t * 5); ctx.fillStyle = "#FFE1E4"; H.rr(ctx, u * 9, cy0 + u * 26, w - u * 18, u * 9, u * 4.5); ctx.fill();
      ctx.save(); ctx.globalAlpha *= pa; ikon(ctx, "bendera", u * 15, cy0 + u * 30.5, u * 6, RED); ctx.restore();
      tx(ctx, o.peringatan === true ? "Rekening belum pernah dipakai" : o.peringatan, u * 21, cy0 + u * 30.5, u * 4.2 * z, "#C2364A", { align: "left", weight: 700, fit: w - u * 33 });
      ny += u * 10;
    }
    ctx.fillStyle = "#E6E9F6"; ctx.fillRect(u * 10, ny - u * 2, w - u * 20, u * 0.5);
    tx(ctx, "Nominal", u * 10, ny + u * 4.5, u * 4.6 * z, INK2, { align: "left", weight: 600 });
    tx(ctx, o.nominal || "Rp3.000.000", w / 2, ny + u * 15, u * 11.5 * z, INK, { weight: 900, fit: w * 0.82 });
    const iy = cy0 + chh + u * 9;
    tx(ctx, "Biaya admin", u * 10, iy, u * 4.6 * z, INK2, { align: "left", weight: 600 }); tx(ctx, "Rp0", w - u * 10, iy, u * 4.6 * z, INK, { align: "right", weight: 700 });
    tx(ctx, "Sumber dana", u * 10, iy + u * 8, u * 4.6 * z, INK2, { align: "left", weight: 600 }); tx(ctx, "Tabungan", w - u * 10, iy + u * 8, u * 4.6 * z, INK, { align: "right", weight: 700 });
    const bh = u * 17;
    [["transfer", "Transfer", "#FF5F78", h * 0.7], ["tunggu", "Tunggu", "#24BFA8", h * 0.7 + bh + u * 5]].forEach(([k, lab, col, by]) => {
      out[k] = tombolBesar(ctx, w, u, k, lab, col, by, bh, hl === k, tk.tombol === k ? clamp(tk.u || 0) : 0, t, u * 9.5 * z, tk.x); });
    ctx.restore(); return out;
  }

  // ---------- layar: perekam suara ----------
  function rekam(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, sv = clamp(o.tersimpan || 0), z = Z(o), rk = RK(o); ctx.save();
    bgGrad(ctx, w, h, "#6553D6", "#3E62C2"); bokeh(ctx, w, h, 13, "#FFFFFF", 0.05);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    if (!rk) tx(ctx, o.label || "Perekam Suara", w / 2, h * 0.12, u * 6.2 * z, "rgba(255,255,255,0.85)", { weight: 700, fit: w * 0.9 });
    const sec = Math.floor(t), dur = o.durasi || `00:${String(sec % 60).padStart(2, "0")}`;
    ctx.save(); ctx.globalAlpha *= 1 - sv;
    tx(ctx, dur, w / 2, h * 0.25, u * 17 * z, "#FFFFFF", { weight: 800, fit: w * 0.9 });
    const gy = h * 0.46, gh = h * 0.2, step = u * 3, n = Math.ceil(w / step) + 2, off = (t * 10) % 1;
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(0, gy - u * 0.25, w, u * 0.5);
    for (let i = 0; i < n; i++) {
      const k = Math.floor(t * 10) - (n - 1 - i), x = w / 2 - (n / 2 - i - off) * step; if (x > w / 2 + step * 0.3) continue;
      const v = (0.15 + 0.85 * hn(k, 1, 77)) * (0.25 + 0.75 * vn(k * 0.12, 5));
      ctx.fillStyle = x > w / 2 - u * 30 ? "#FFFFFF" : "rgba(255,255,255,0.65)"; H.rr(ctx, x - u * 0.8, gy - v * gh / 2, u * 1.6, v * gh, u * 0.8); ctx.fill();
    }
    ctx.fillStyle = P.amber; ctx.fillRect(w / 2 - u * 0.4, gy - gh * 0.6, u * 0.8, gh * 1.2); ctx.beginPath(); ctx.arc(w / 2, gy - gh * 0.6, u * 1.6, 0, TAU); ctx.fill();
    const blink = Math.sin(t * PI * 2) > -0.3 ? 1 : 0.2, ms = u * (rk ? 10 : 6) * z; ctx.font = `700 ${ms}px ${FONT}`; const mw = ctx.measureText("Merekam").width;
    ctx.fillStyle = D.hexA(RED, blink); ctx.beginPath(); ctx.arc(w / 2 - mw / 2 - ms * 0.55, h * 0.63, ms * 0.36, 0, TAU); ctx.fill();
    tx(ctx, "Merekam", w / 2 + ms * 0.2, h * 0.63, ms, "#FFFFFF", { weight: 700 });
    ctx.restore();
    if (sv > 0) {
      const k = D.spring(sv * 1.3, 10, 0.55), cy = lerp(h * 0.55, h * 0.36, D.eout(sv)), ch = u * 34;
      ctx.save(); ctx.globalAlpha *= clamp(sv * 2); ctx.translate(w / 2, cy); ctx.scale(k, k);
      ctx.fillStyle = "rgba(20,24,70,0.2)"; H.rr(ctx, -w * 0.42, -ch / 2 + u, w * 0.84, ch, u * 6); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; H.rr(ctx, -w * 0.42, -ch / 2, w * 0.84, ch, u * 6); ctx.fill();
      bulat(ctx, -w * 0.28, -u * 6, u * 7, GREEN, "cek");
      tx(ctx, o.namaRekaman || "Rekaman 1", -w * 0.17, -u * (rk ? 6 : 8), u * (rk ? 8 : 6) * z, INK, { align: "left", weight: 800, fit: w * 0.55 });
      if (!rk) tx(ctx, o.durasiSimpan || "00:03", -w * 0.17, -u * 1.5, u * 4.8 * z, INK2, { align: "left", weight: 600 });
      for (let j = 0; j < 22; j++) { const v = 0.2 + 0.8 * hn(j, 4, 77) * vn(j * 0.3, 2); ctx.fillStyle = "#6553D6"; H.rr(ctx, -w * 0.36 + j * u * 3.3, u * 9 - v * u * 5, u * 1.8, v * u * 10, u * 0.9); ctx.fill(); }
      ctx.restore();
    }
    // tombol: saat merekam = stop persegi + cincin berdenyut; sesudah tersimpan = tombol rekam bulat (diam)
    const by = h * 0.84, br = u * 13, out = { tombol: { cx: w / 2, cy: by, x: w / 2 - br, y: by - br, w: br * 2, h: br * 2 } };
    for (let i = 0; i < 2; i++) { const ph = (t * 0.9 + i / 2) % 1; ctx.strokeStyle = D.hexA(RED, 0.5 * (1 - ph) * (1 - sv)); ctx.lineWidth = u * 1.2; ctx.beginPath(); ctx.arc(w / 2, by, br * (1.05 + ph * 0.6), 0, TAU); ctx.stroke(); }
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(w / 2, by, br, 0, TAU); ctx.fill();
    const q = sm((sv - 0.2) / 0.5), sz = lerp(br * 0.84, br * 1.44, q), rad = lerp(br * 0.18, br * 0.72, q);
    ctx.fillStyle = RED; H.rr(ctx, w / 2 - sz / 2, by - sz / 2, sz, sz, rad); ctx.fill();
    ctx.restore(); return out;
  }

  // ---------- layar: kontak (daftar + banding nomor) ----------
  const KONTAK = [{ nama: "Adik", nomor: "0812-0000-2468" }, { nama: "Anakku", nomor: "0813-0000-5678" }, { nama: "Ayah", nomor: "0811-0000-9012" }, { nama: "Bu RT", nomor: "0815-0000-3344" }, { nama: "Kakak", nomor: "0817-0000-7788" }, { nama: "Nenek", nomor: "0819-0000-1122" }];
  const AVC = ["#7C8BEA", "#2EB89A", "#E8739A", "#F0A04B", "#8E7CF0", "#4FA3E0"];
  // nomor dalam sel lebar tetap (digit tabular) supaya dua nomor sejajar per digit; beda = indeks yang disorot
  function nomorSel(ctx, s, x, y, cw, size, col, beda, u, hiCol, k) {
    for (let i = 0; i < s.length; i++) {
      const cx = x + (i + 0.5) * cw, on = beda && beda[i] ? clamp(k == null ? 1 : k[i] || 0) : 0;
      if (on > 0) { const sc = D.spring(on * 1.1, 12, 0.5); ctx.save(); ctx.translate(cx, y); ctx.scale(sc, sc); ctx.fillStyle = D.hexA(hiCol, 0.95); H.rr(ctx, -cw * 0.48, -size * 0.72, cw * 0.96, size * 1.44, cw * 0.22); ctx.fill(); ctx.restore(); }
      tx(ctx, s[i], cx, y, size, on > 0.5 ? "#FFFFFF" : col, { weight: 800 });
    }
  }
  function kontak(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, z = Z(o), rk = RK(o); ctx.save();
    ctx.fillStyle = "#F1F3FC"; ctx.fillRect(0, 0, w, h);
    const hh = u * 26, hg = ctx.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#3FA7C9"); hg.addColorStop(1, "#4D6FD8"); ctx.fillStyle = hg; ctx.fillRect(0, 0, w, hh);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    const bd = o.banding;
    tx(ctx, o.judul || (bd ? "Cek nomor" : "Kontak"), u * 7, hh * 0.62, u * (rk ? 11 : 9) * z, "#FFFFFF", { align: "left", weight: 900, fit: w * (rk ? 0.86 : 0.7) });
    if (!rk && !bd) { ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.arc(w - u * 11, hh * 0.62, u * 6, 0, TAU); ctx.fill(); ikon(ctx, "cari", w - u * 11, hh * 0.62, u * 6.5, "#FFFFFF"); }
    const out = {};
    if (bd) {
      const A = typeof bd.lama === "string" || !bd.lama ? { nama: bd.namaLama || "Anakku", nomor: bd.lama || "0813-0000-5678" } : bd.lama;
      const B = typeof bd.baru === "string" || !bd.baru ? { nama: bd.namaBaru || "Nomor tidak dikenal", nomor: bd.baru || "0812-0000-1234" } : bd.baru;
      const n = Math.max(A.nomor.length, B.nomor.length), beda = [], bu = bd.u == null ? 1 : clamp(bd.u); for (let i = 0; i < n; i++) beda[i] = A.nomor[i] !== B.nomor[i];
      const idx = beda.map((b, i) => (b ? i : -1)).filter(i => i >= 0), kk = []; idx.forEach((i, j) => { kk[i] = sm((bu * 1.6 - j / Math.max(1, idx.length) * 0.6)); });
      const cw = (w - u * 18) / n, fsz = Math.min(cw * 1.62, u * 12) * z, x0 = u * 9, ch = u * 62;
      const card = (y, lab, who, num, col, ic, icCol, hi) => {
        ctx.fillStyle = "rgba(60,70,150,0.1)"; H.rr(ctx, u * 4, y + u, w - u * 8, ch, u * 6); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; H.rr(ctx, u * 4, y, w - u * 8, ch, u * 6); ctx.fill();
        ctx.fillStyle = col; H.rr(ctx, u * 4, y, u * 2.2, ch, u * 1.1); ctx.fill();
        tx(ctx, lab, u * 9, y + u * 8, u * (rk ? 7.5 : 5.6) * z, INK2, { align: "left", weight: 700, fit: w - u * 30 });
        bulat(ctx, w - u * 13, y + u * 9, u * 6, icCol, ic);
        avatar(ctx, u * 16, y + u * 25, u * 7, col, { tanya: hi, huruf: hi ? null : (who[0] || "").toUpperCase() });
        tx(ctx, who, u * 27, y + u * 25, u * (rk ? 11 : 9) * z, INK, { align: "left", weight: 800, fit: w - u * 33 });
        ctx.fillStyle = "#EEF1FB"; H.rr(ctx, u * 7, y + u * 37, w - u * 14, u * 20, u * 5); ctx.fill();
        nomorSel(ctx, num, x0, y + u * 47, cw, fsz, INK, beda, u, hi ? RED : P.amber, hi ? kk : kk.map(v => v * 0.0));
        if (!hi) { idx.forEach(i => { const a = kk[i] || 0; if (a <= 0) return; ctx.fillStyle = D.hexA(P.amber, a); H.rr(ctx, x0 + i * cw + cw * 0.12, y + u * 47 + fsz * 0.62, cw * 0.76, u * 1.3, u * 0.6); ctx.fill(); }); }
        return { x: u * 4, y, w: w - u * 8, h: ch };
      };
      const y1 = hh + u * 7, y2 = y1 + ch + u * 22;
      out.lama = card(y1, bd.labelLama || "Nomor tersimpan", A.nama, A.nomor, "#2EB89A", "cek", GREEN, false);
      out.baru = card(y2, bd.labelBaru || "Yang menelepon", B.nama, B.nomor, RED, "bendera", RED, true);
      // tanda tidak sama
      const my = y1 + ch + u * 11.5, pk = sm(bu * 2), r = u * 8 * (0.6 + 0.4 * D.spring(pk, 10, 0.5));
      ctx.save(); ctx.globalAlpha *= pk; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(w / 2, my, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#FFFFFF"; ctx.lineCap = "round"; ctx.lineWidth = r * 0.18;
      ctx.beginPath(); ctx.moveTo(w / 2 - r * 0.45, my - r * 0.2); ctx.lineTo(w / 2 + r * 0.45, my - r * 0.2); ctx.moveTo(w / 2 - r * 0.45, my + r * 0.2); ctx.lineTo(w / 2 + r * 0.45, my + r * 0.2); ctx.moveTo(w / 2 + r * 0.25, my - r * 0.55); ctx.lineTo(w / 2 - r * 0.25, my + r * 0.55); ctx.stroke(); ctx.restore();
      out.beda = idx; ctx.restore(); return out;
    }
    const ds = o.daftar || KONTAK, rh = u * (rk ? 34 : 25), y0 = hh + u * 3;
    const so = typeof o.sorot === "string" ? ds.findIndex(d => d.nama === o.sorot) : (o.sorot == null ? -1 : o.sorot);
    out.baris = [];
    ds.forEach((d, i) => {
      const y = y0 + i * rh; if (y > h) return; const on = i === so, pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
      if (on) { ctx.fillStyle = D.hexA(P.teal, 0.16 + 0.08 * pulse); H.rr(ctx, u * 2.5, y + u * 1.5, w - u * 5, rh - u * 3, u * 6); ctx.fill(); ctx.fillStyle = "#FFFFFF"; H.rr(ctx, u * 3.5, y + u * 2.5, w - u * 7, rh - u * 5, u * 5); ctx.fill(); }
      else if (i > 0) { ctx.fillStyle = "#E1E5F4"; ctx.fillRect(u * 24, y, w - u * 28, u * 0.4); }
      const ar = u * (rk ? 9 : 7.5), ay = y + rh / 2;
      avatar(ctx, u * 13, ay, ar, d.warna || AVC[i % AVC.length], { huruf: (d.nama[0] || "").toUpperCase() });
      const tw = w - u * (on ? 51 : 30);
      if (rk) { tx(ctx, d.nama, u * 25, ay - (d.nomor && on ? u * 4.5 : 0), u * 14 * z, INK, { align: "left", weight: 800, fit: tw }); if (on && d.nomor) tx(ctx, d.nomor, u * 25, ay + u * 7.5, u * 7.5 * z, INK2, { align: "left", weight: 700, fit: tw }); }
      else { tx(ctx, d.nama, u * 25, ay - u * 3.6, u * 8 * z, INK, { align: "left", weight: 800, fit: tw }); tx(ctx, d.nomor || "", u * 25, ay + u * 5, u * 5.4 * z, INK2, { align: "left", weight: 600, fit: tw }); }
      const row = { x: 0, y, w, h: rh, cx: w / 2, cy: ay };
      if (on) { const bx = w - u * 13, br = u * (rk ? 9 : 7.5); ctx.fillStyle = D.hexA(GREEN, 0.3 * pulse); ctx.beginPath(); ctx.arc(bx, ay, br * (1.2 + 0.25 * pulse), 0, TAU); ctx.fill(); bulat(ctx, bx, ay, br, GREEN, "telepon"); out.telepon = { cx: bx, cy: ay, x: bx - br, y: ay - br, w: br * 2, h: br * 2 }; }
      out.baris.push(row);
    });
    ctx.restore(); return out;
  }

  // ---------- layar: beranda media sosial (feed) ----------
  function thumbVideo(ctx, x, y, w, h, t, u) {
    const gr = ctx.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, "#FF9DB5"); gr.addColorStop(1, "#FFC58A"); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
    for (let i = 0; i < 16; i++) { ctx.fillStyle = [P.teal, "#FFFFFF", "#8E7CF0", P.amber][i % 4]; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(x + hn(i, 1, 6) * w, y + ((hn(i, 2, 6) + t * 0.08 * (0.5 + hn(i, 3, 6))) % 1) * h * 0.6, u * (0.7 + hn(i, 4, 6)), 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
    const cx = x + w * 0.5, by = y + h * 0.92, cw = Math.min(w * 0.5, h * 0.95), lh = h * 0.2;
    ctx.fillStyle = "#C9785A"; ctx.fillRect(x, by - u * 0.5, w, h * 0.1);
    [["#FFF1E2", 1, 0], ["#FF7FA0", 0.76, 1]].forEach(([c, f, i]) => { const ww = cw * f, yy = by - lh * (i + 1); ctx.fillStyle = dark(c, 0.06); H.rr(ctx, cx - ww / 2, yy, ww, lh, u * 1.5); ctx.fill(); ctx.fillStyle = c; H.rr(ctx, cx - ww / 2, yy, ww, lh * 0.55, u * 1.5); ctx.fill(); });
    for (let k = -1; k <= 1; k++) { const px = cx + k * cw * 0.2, py = by - lh * 2; ctx.fillStyle = ["#5BD6C8", "#FFD38A", "#A58BFF"][k + 1]; ctx.fillRect(px - u * 0.7, py - h * 0.16, u * 1.4, h * 0.16);
      const fl = 1 + 0.15 * Math.sin(t * 13 + k * 2); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.ellipse(px, py - h * 0.2, u * 1.1, u * 2 * fl, 0, 0, TAU); ctx.fill(); D.glow(ctx, px, py - h * 0.2, u * 5, P.warm, 0.5); }
    ctx.fillStyle = "rgba(20,24,70,0.35)"; ctx.beginPath(); ctx.arc(x + w * 0.5, y + h * 0.4, Math.min(w, h) * 0.17, 0, TAU); ctx.fill(); ikon(ctx, "putar", x + w * 0.5 + u * 0.6, y + h * 0.4, Math.min(w, h) * 0.18, "#FFFFFF");
  }
  function thumbLive(ctx, x, y, w, h, t, u, rk, z) {
    const gr = ctx.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, "#5EC9C0"); gr.addColorStop(1, "#4C82D6"); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.18)"; for (let i = 0; i < 4; i++) { ctx.fillRect(x + w * (0.08 + i * 0.24), y + h * 0.12, w * 0.12, h * 0.05); }
    const OR = K.kit.orang, px = x + w * 0.5, py = y + h * 0.5;
    if (OR) OR.kepala(ctx, px, py, h * 0.17, Object.assign(OR.preset("buRina"), { face: "senang", t, seed: 50, bahu: 3, hijab: "#FF8FA8", top: "#FFD38A" }));
    ctx.fillStyle = "#9A6E58"; ctx.fillRect(x, y + h * 0.78, w, h * 0.22); ctx.fillStyle = "#B8876B"; ctx.fillRect(x, y + h * 0.78, w, h * 0.05);
    [[0.2, "#FFD38A"], [0.34, "#FF8FA8"], [0.68, "#FFF1E2"], [0.82, "#A58BFF"]].forEach(([fx, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x + w * fx, y + h * 0.77, w * 0.06, h * 0.06, 0, PI, TAU); ctx.fill(); });
    const ls = u * (rk ? 7 : 5) * z; ctx.font = `900 ${ls}px ${FONT}`; const lw = ctx.measureText("LIVE").width + ls * 1.6, lp = 0.6 + 0.4 * (Math.sin(t * 5) > 0 ? 1 : 0);
    ctx.fillStyle = "#FF3B5C"; H.rr(ctx, x + u * 2.5, y + u * 2.5, lw, ls * 1.5, ls * 0.4); ctx.fill();
    ctx.fillStyle = D.hexA("#FFFFFF", lp); ctx.beginPath(); ctx.arc(x + u * 2.5 + ls * 0.55, y + u * 2.5 + ls * 0.75, ls * 0.2, 0, TAU); ctx.fill();
    tx(ctx, "LIVE", x + u * 2.5 + ls * 0.9, y + u * 2.5 + ls * 0.78, ls, "#FFFFFF", { align: "left", weight: 900 });
  }
  function thumbSuara(ctx, x, y, w, h, t, u, rk, z) {
    ctx.fillStyle = "#E7E3FB"; ctx.fillRect(x, y, w, h);
    const cy = y + h * 0.56, bh = Math.min(h * 0.44, u * 14), bx = x + u * 3, bw = w - u * 6;
    ctx.fillStyle = "#FFFFFF"; H.rr(ctx, bx, cy - bh / 2, bw, bh, bh * 0.4); ctx.fill();
    bulat(ctx, bx + bh * 0.55, cy, bh * 0.36, "#8E7CF0", "putar");
    const x0 = bx + bh * 1.05, x1 = bx + bw - u * 3, n = Math.max(6, Math.floor((x1 - x0) / (u * 2.4)));
    for (let j = 0; j < n; j++) { const v = 0.25 + 0.75 * vn(j * 0.6 + t * 1.5, 31) * (0.5 + 0.5 * vn(j * 0.2, 7)); ctx.fillStyle = j / n < (t * 0.3) % 1 ? "#8E7CF0" : "#C3BAF0"; H.rr(ctx, x0 + j * (x1 - x0) / n, cy - v * bh * 0.32, u * 1.3, v * bh * 0.64, u * 0.65); ctx.fill(); }
    ikon(ctx, "grup", x + u * 6, y + u * 5.5, u * 7, "#8E7CF0");
    if (!rk) tx(ctx, "Grup Keluarga", x + u * 11.5, y + u * 5.5, u * 4.6 * z, "#6A5BC8", { align: "left", weight: 800, fit: w - u * 14 });
  }
  function feed(ctx, w, h, o = {}) {
    const u = w / 100, t = o.t || 0, z = Z(o), rk = RK(o), pv = clamp(o.privat || 0); ctx.save();
    ctx.fillStyle = "#EEF0FA"; ctx.fillRect(0, 0, w, h);
    const hh = u * 24, hg = ctx.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#FF7A9C"); hg.addColorStop(1, "#9A6BFF"); ctx.fillStyle = hg; ctx.fillRect(0, 0, w, hh);
    statusBar(ctx, w, u, "#FFFFFF", o.jam);
    tx(ctx, o.judul || "Beranda", u * 6, hh * 0.62, u * (rk ? 10 : 8.5) * z, "#FFFFFF", { align: "left", weight: 900, fit: w * 0.6 });
    if (!rk) { ikon(ctx, "unggah", w - u * 21, hh * 0.62, u * 7, "#FFFFFF"); ikon(ctx, "bagikan", w - u * 9, hh * 0.62, u * 7, "#FFFFFF"); }
    // baris sakelar "Akun privat"
    const ry = hh, rh = u * (rk ? 19 : 15), ks = sm(pv / 0.35);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, ry, w, rh); ctx.fillStyle = "#E1E5F4"; ctx.fillRect(0, ry + rh - u * 0.5, w, u * 0.5);
    ikon(ctx, "kunci", u * 8.5, ry + rh / 2, u * (rk ? 8 : 6.5), mix("#9AA3C8", "#E59B1E", ks));
    tx(ctx, o.labelPrivat || "Akun privat", u * 15, ry + rh / 2, u * (rk ? 9.5 : 6.5) * z, INK, { align: "left", weight: 800, fit: w - u * 40 });
    const tw = u * 18, th = u * 9.5, tx0 = w - u * 6 - tw, ty = ry + rh / 2 - th / 2;
    ctx.fillStyle = mix("#C3C9E4", "#24BFA8", ks); H.rr(ctx, tx0, ty, tw, th, th / 2); ctx.fill();
    const kx = lerp(tx0 + th / 2, tx0 + tw - th / 2, D.eio(ks)); ctx.fillStyle = "rgba(20,30,80,0.18)"; ctx.beginPath(); ctx.arc(kx, ty + th / 2 + u * 0.5, th * 0.4, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(kx, ty + th / 2, th * 0.4, 0, TAU); ctx.fill();
    const out = { sakelar: { x: tx0, y: ty, w: tw, h: th, cx: tx0 + tw / 2, cy: ty + th / 2 }, kartu: [] };
    // kartu
    const ps = o.post || [{ jenis: "video", judul: "Ulang tahun Adik" }, { jenis: "live", judul: "Jualan kue" }, { jenis: "suara", judul: "Pesan suara Ibu" }];
    const top = ry + rh + u * 3, n = ps.length, gap = u * 3, ch = (h - top - u * 3) / n - gap, js = u * (rk ? 9.5 : 6.5) * z;
    ps.forEach((p, i) => {
      const y = top + i * (ch + gap), x = u * 4, cw = w - u * 8, thH = ch - js * 1.9 - u * 2;
      ctx.fillStyle = "rgba(60,70,150,0.1)"; H.rr(ctx, x, y + u, cw, ch, u * 5); ctx.fill(); ctx.fillStyle = "#FFFFFF"; H.rr(ctx, x, y, cw, ch, u * 5); ctx.fill();
      const ix = x + u * 2.5, iy = y + u * 2.5, iw = cw - u * 5;
      ctx.save(); H.rr(ctx, ix, iy, iw, thH, u * 3.5); ctx.clip();
      if (p.jenis === "live") thumbLive(ctx, ix, iy, iw, thH, t, u, rk, z); else if (p.jenis === "suara") thumbSuara(ctx, ix, iy, iw, thH, t, u, rk, z); else thumbVideo(ctx, ix, iy, iw, thH, t, u);
      const kp = sm((pv * 1.5 - 0.25 - i * 0.18) / 0.45);
      if (kp > 0) { ctx.fillStyle = D.hexA("#1C2260", 0.42 * kp); ctx.fillRect(ix, iy, iw, thH); }
      ctx.restore();
      const jy = iy + thH + js * 0.95 + u * 0.5, icn = p.jenis === "live" ? "live" : p.jenis === "suara" ? "grup" : "video";
      ikon(ctx, icn, x + u * 7, jy, js * 0.95, p.jenis === "live" ? "#FF3B5C" : "#7A86C8");
      tx(ctx, p.judul || "", x + u * 7 + js * 0.95, jy, js, INK, { align: "left", weight: 800, fit: cw - u * 9 - js * 0.95 });
      if (kp > 0) { const sc = D.spring(kp * 1.1, 11, 0.45), r = Math.min(u * 10, thH * 0.3), bx = ix + iw / 2, by = iy + thH / 2;
        ctx.save(); ctx.translate(bx, by); ctx.scale(sc, sc); ctx.fillStyle = "rgba(20,24,70,0.25)"; ctx.beginPath(); ctx.arc(0, r * 0.12, r, 0, TAU); ctx.fill();
        ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.arc(0, 0, r * 0.9, PI * 1.1, PI * 1.6); ctx.stroke();
        ikon(ctx, "kunci", 0, r * 0.04, r * 1.05, "#3A2A10"); ctx.restore(); }
      out.kartu.push({ x, y, w: cw, h: ch, thumb: { x: ix, y: iy, w: iw, h: thH }, kunci: kp });
    });
    ctx.restore(); return out;
  }

  function mati(ctx, w, h) { ctx.save(); const gr = ctx.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#2A3274"); gr.addColorStop(1, "#1A2058"); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h); ctx.restore(); }

  // ---------- HP ----------
  // muka bodi (tombol samping, bodi, pinggir terang, layar, kamera) berpusat di (0,0); dipakai tampak depan dan mode rebah
  function hpFace(ctx, w, h, opt, t, lit) {
    const r = w * 0.17, b = w * 0.045, body = opt.body || BODY;
    ctx.fillStyle = dark(body, 0.2);
    H.rr(ctx, w / 2 - w * 0.01, -h * 0.22, w * 0.035, h * 0.11, w * 0.015); ctx.fill();
    H.rr(ctx, -w / 2 - w * 0.025, -h * 0.28, w * 0.035, h * 0.07, w * 0.015); ctx.fill(); H.rr(ctx, -w / 2 - w * 0.025, -h * 0.18, w * 0.035, h * 0.07, w * 0.015); ctx.fill();
    const bg = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); bg.addColorStop(0, lite(body, 0.12)); bg.addColorStop(1, dark(body, 0.18));
    ctx.fillStyle = bg; H.rr(ctx, -w / 2, -h / 2, w, h, r); ctx.fill();
    // pinggir terang: kiri-atas kuat, kanan tipis (siluet tegas di latar apa pun)
    const rg = ctx.createLinearGradient(0, -h / 2, 0, h * 0.25); rg.addColorStop(0, "rgba(226,232,255,0.9)"); rg.addColorStop(1, "rgba(226,232,255,0)");
    ctx.strokeStyle = rg; ctx.lineWidth = w * 0.018; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-w / 2 + w * 0.012, h * 0.2); ctx.lineTo(-w / 2 + w * 0.012, -h / 2 + r); ctx.arc(-w / 2 + r, -h / 2 + r, r - w * 0.012, PI, PI * 1.5); ctx.lineTo(w / 2 - r, -h / 2 + w * 0.012); ctx.stroke();
    const rg2 = ctx.createLinearGradient(0, -h * 0.3, 0, h / 2); rg2.addColorStop(0, "rgba(226,232,255,0)"); rg2.addColorStop(1, "rgba(226,232,255,0.3)");
    ctx.strokeStyle = rg2; ctx.lineWidth = w * 0.01; ctx.beginPath(); ctx.moveTo(w / 2 - w * 0.008, -h * 0.3); ctx.lineTo(w / 2 - w * 0.008, h / 2 - r); ctx.arc(w / 2 - r, h / 2 - r, r - w * 0.008, 0, PI * 0.5); ctx.stroke();
    const sw = w - b * 2, sh = h - b * 2, sxx = -w / 2 + b, syy = -h / 2 + b;
    ctx.save(); H.rr(ctx, sxx, syy, sw, sh, r - b * 0.8); ctx.clip(); ctx.translate(sxx, syy);
    let out;
    if (lit > 0 && opt.screen) { ctx.save(); out = opt.screen(ctx, sw, sh, t); ctx.restore(); } else mati(ctx, sw, sh);
    const M1 = ctx.getTransform();
    if (lit < 1 && opt.screen) { ctx.fillStyle = D.hexA("#161C4C", (1 - lit) * 0.88); ctx.fillRect(0, 0, sw, sh); }
    ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.beginPath(); ctx.moveTo(sw * 0.55, 0); ctx.lineTo(sw, 0); ctx.lineTo(sw, sh * 0.06); ctx.lineTo(sw * 0.1, sh * 0.62); ctx.lineTo(0, sh * 0.62); ctx.lineTo(0, sh * 0.42); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#151A42"; ctx.beginPath(); ctx.arc(0, -h / 2 + b + sh * 0.025, w * 0.032, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(140,170,255,0.6)"; ctx.beginPath(); ctx.arc(-w * 0.009, -h / 2 + b + sh * 0.025 - w * 0.009, w * 0.009, 0, TAU); ctx.fill();
    return { out, M1, sw, sh, sxx, syy };
  }
  // busur getar tebal di kiri-kanan bagian atas HP, berdenyut keluar dan memudar
  function ringArcs(ctx, xl, xr, y, hh, ring, t) {
    if (ring <= 0) return;
    ctx.save(); ctx.lineCap = "round";
    D.glow(ctx, (xl + xr) / 2, y, hh * 0.5, P.teal, 0.22 * ring * (0.75 + 0.25 * Math.sin(t * 14)));
    for (let i = 0; i < 3; i++) {
      const ph = (t * 1.5 + i / 3) % 1, a = ring * Math.pow(1 - ph, 1.2) * sm(ph * 7); if (a <= 0.01) continue;
      const rad = hh * (0.05 + ph * 0.15), lw = hh * 0.02 * (1 - ph * 0.3), span = 0.62 - ph * 0.14;
      for (const sd of [-1, 1]) {
        const ax = sd < 0 ? xl + hh * 0.01 : xr - hh * 0.01, a0 = sd > 0 ? -span : PI - span, a1 = sd > 0 ? span : PI + span;
        ctx.beginPath(); ctx.arc(ax, y, rad, a0, a1); ctx.strokeStyle = D.hexA(P.teal, a * 0.4); ctx.lineWidth = lw * 2.4; ctx.stroke();
        ctx.strokeStyle = D.hexA("#FFFFFF", a * 0.95); ctx.lineWidth = lw; ctx.stroke();
      }
    }
    ctx.restore();
  }
  // titik keliling bodi (untuk bayangan & sisi bodi mode rebah)
  function rrPoints(w, h, r) { const pts = [], cs = [[w / 2 - r, -h / 2 + r, -PI / 2], [w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, PI / 2], [-w / 2 + r, -h / 2 + r, PI]]; cs.forEach(([x, y, a0]) => { for (let k = 0; k <= 6; k++) { const a = a0 + k / 6 * PI / 2; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } }); return pts; }
  function hpFront(ctx, cx, cy, h, opt, t, lit, ring) {
    const w = h * 0.485, r = w * 0.17, tilt = clamp(opt.tilt || 0, -1, 1), body = opt.body || BODY, M0 = ctx.getTransform();
    ctx.save();
    const shx = ring * (Math.sin(t * 71) * 0.6 + Math.sin(t * 43) * 0.4) * h * 0.012, shr = ring * Math.sin(t * 57) * 0.035;
    ctx.translate(cx + shx, cy); ctx.rotate((opt.rot || 0) + shr);
    const ga = opt.glow == null ? 0.55 * lit : opt.glow; if (ga > 0) D.glow(ctx, 0, 0, h * 1.05, opt.glowCol || "#A9D4FF", ga);
    ctx.save();
    const sk = tilt * 0.09, sx = 1 - Math.abs(tilt) * 0.12; ctx.transform(sx, sk, 0, 1, 0, 0);
    const dep = tilt * w * 0.07;
    ctx.save();
    if (opt.shadow !== false) { const mt = ctx.getTransform(), ds = Math.hypot(mt.a, mt.b); ctx.shadowColor = "rgba(14,18,60,0.42)"; ctx.shadowBlur = h * 0.06 * ds; ctx.shadowOffsetX = h * 0.012 * ds; ctx.shadowOffsetY = h * 0.03 * ds; }
    ctx.fillStyle = dark(body, 0.4); H.rr(ctx, -w / 2 - dep, -h / 2 + Math.abs(dep) * 0.15, w, h, r); ctx.fill(); ctx.restore();
    ctx.translate(dep * 0.15, 0);
    const F = hpFace(ctx, w, h, opt, t, lit);
    ctx.restore();
    ringArcs(ctx, -w / 2 * sx, w / 2 * sx, -h * 0.3, h, ring, t);
    ctx.restore();
    const rel = M0.inverse().multiply(F.M1);
    const map = (lx, ly) => { const p = rel.transformPoint(new DOMPoint(lx, ly)); return { x: p.x, y: p.y }; };
    const s0 = map(0, 0), s1 = map(F.sw, F.sh);
    return { x: cx - w / 2, y: cy - h / 2, w, h, top: { x: cx, y: cy - h / 2 }, bottom: { x: cx, y: cy + h / 2 }, screen: { x: s0.x, y: s0.y, w: s1.x - s0.x, h: s1.y - s0.y }, map, out: F.out };
  }
  // HP rebah di meja: muka digambar ke kanvas cadangan lalu diproyeksikan per irisan (atas menyempit, tinggi dikompres)
  function hpFlat(ctx, cx, cy, h, opt, t, lit, fl, ring) {
    const w = h * 0.485, r = w * 0.17, body = opt.body || BODY, ky = lerp(1, 0.35, fl), tp = lerp(1, 0.8, fl), th = h * 0.05 * fl;
    const slx = ring * (Math.sin(t * 47) * 0.6 + Math.sin(t * 29) * 0.4) * h * 0.022, sly = ring * Math.sin(t * 37) * h * 0.007;
    const rot = (opt.rot || 0) + ring * Math.sin(t * 31) * 0.05, cs = Math.cos(rot), sn = Math.sin(rot);
    const X0 = cx + slx, Y0 = cy + sly, Dg = Math.ceil(Math.hypot(w, h)) + 6;
    const proj = (X, Y) => { const v = (Y + Dg / 2) / Dg, f = lerp(tp, 1, v); return [X0 + X * f, Y0 + Y * ky]; };
    const pl = (x, y) => proj(x * cs - y * sn, x * sn + y * cs);
    ctx.save();
    // cahaya layar jatuh di permukaan meja
    const ga = opt.glow == null ? 0.6 * lit : opt.glow;
    if (ga > 0) { ctx.save(); ctx.translate(X0, Y0 + th * 0.5); ctx.scale(1, ky * 0.95); D.glow(ctx, 0, 0, h * 0.95, opt.glowCol || "#A9D4FF", ga); D.glow(ctx, 0, 0, h * 0.62, opt.glowCol || "#A9D4FF", ga * 0.7); ctx.restore(); }
    // sisi bodi + bayangan kontak
    const fp = rrPoints(w, h, r).map(([x, y]) => pl(x, y));
    const poly = dy => { ctx.beginPath(); fp.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy))); ctx.closePath(); };
    const M = ctx.getTransform(), ds = Math.hypot(M.a, M.b);
    ctx.save(); if (opt.shadow !== false) { ctx.shadowColor = "rgba(14,18,60,0.5)"; ctx.shadowBlur = h * 0.05 * ds; ctx.shadowOffsetX = h * 0.015 * ds; ctx.shadowOffsetY = h * 0.02 * ds; }
    ctx.fillStyle = dark(body, 0.45); poly(th); ctx.fill(); ctx.restore();
    ctx.fillStyle = dark(body, 0.3); for (let k = 5; k >= 1; k--) { poly(th * k / 6); ctx.fill(); }
    // muka
    const s = clamp(ds, 0.5, 2.5), Dp = Math.ceil(Dg * s), oc = kanvas("hpflat", Dp, Dp), o2 = oc.getContext("2d");
    o2.setTransform(1, 0, 0, 1, 0, 0); o2.clearRect(0, 0, Dp, Dp); o2.setTransform(s, 0, 0, s, Dp / 2, Dp / 2); o2.rotate(rot);
    const F = hpFace(o2, w, h, opt, t, lit);
    const N = Math.max(24, Math.ceil(Dg * ky * s / 2));
    for (let i = 0; i < N; i++) { const v0 = i / N, f = lerp(tp, 1, (i + 0.5) / N); ctx.drawImage(oc, 0, v0 * Dp, Dp, Dp / N, X0 - Dg / 2 * f, Y0 + (v0 - 0.5) * Dg * ky, Dg * f, Dg * ky / N + 0.8); }
    // getar: busur di kiri-kanan ujung atas HP
    if (ring > 0) { let xl = 1e9, xr = -1e9, yt = 1e9; fp.forEach(([x, y]) => { xl = Math.min(xl, x); xr = Math.max(xr, x); yt = Math.min(yt, y); }); ringArcs(ctx, xl, xr, yt + h * ky * 0.25, h * 0.8, ring, t); }
    ctx.restore();
    const map = (lx, ly) => { const [x, y] = pl(F.sxx + lx, F.syy + ly); return { x, y }; };
    const c0 = map(0, 0), c1 = map(F.sw, F.sh), c2 = map(F.sw, 0), c3 = map(0, F.sh);
    const xs = [c0.x, c1.x, c2.x, c3.x], ys = [c0.y, c1.y, c2.y, c3.y];
    let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9; fp.forEach(([x, y]) => { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); });
    return { x: bx0, y: by0, w: bx1 - bx0, h: by1 - by0 + th, top: { x: (bx0 + bx1) / 2, y: by0 }, bottom: { x: (bx0 + bx1) / 2, y: by1 + th },
      screen: { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }, map, out: F.out, flat: true };
  }
  function hp(ctx, cx, cy, h, opt = {}) {
    const t = opt.t || 0, ring = clamp(opt.ring || 0), lit = opt.lit == null ? 1 : clamp(opt.lit), fl = clamp(opt.flat || 0);
    const prev = CUR; CUR = { teks: opt.teks || 1, ringkas: !!opt.ringkas };
    try { return fl > 0 ? hpFlat(ctx, cx, cy, h, opt, t, lit, fl, ring) : hpFront(ctx, cx, cy, h, opt, t, lit, ring); }
    finally { CUR = prev; }
  }

  // ---------- jari penekan ----------
  function jari(ctx, x, y, s, o = {}) {
    const tk = clamp(o.tekan || 0), t = o.t || 0, bip = !!o.bip, lift = 1 - tk;
    const base = o.kulit || (bip ? "#22E3C4" : (K.kit.orang ? K.kit.orang.SKIN[3] : "#B6794C")), shd = dark(base, 0.22), hl = lite(base, 0.3);
    ctx.save(); ctx.translate(x, y);
    // bayangan di permukaan: menjauh saat jari terangkat
    ctx.fillStyle = `rgba(14,18,60,${0.16 + 0.14 * tk})`; ctx.beginPath(); ctx.ellipse(s * 0.06 * lift + s * 0.01, s * 0.07 * lift + s * 0.015, s * 0.08 * (1 + lift * 0.5), s * 0.045 * (1 + lift * 0.5), -0.4, 0, TAU); ctx.fill();
    if (o.riak !== false && tk > 0.05 && tk < 1) { ctx.strokeStyle = D.hexA("#FFFFFF", 0.75 * (1 - tk)); ctx.lineWidth = s * 0.025; ctx.beginPath(); ctx.arc(0, 0, s * (0.06 + 0.26 * D.eout(tk)), 0, TAU); ctx.stroke(); }
    const hov = lift * (s * 0.05 + Math.sin(t * 2.4) * s * 0.012);
    ctx.rotate(o.rot == null ? -0.42 : o.rot); ctx.translate(0, -hov * 0.3); ctx.translate(hov * 0.4, hov * 0.6); const sc = 1 + 0.04 * lift; ctx.scale(sc, sc);
    if (!bip && o.lengan !== false) { const lc = o.lengan || "#5E9BE8"; ctx.fillStyle = dark(lc, 0.12); H.rr(ctx, -s * 0.15, s * 0.95, s * 0.6, s * 1.0, s * 0.18); ctx.fill(); ctx.fillStyle = lite(lc, 0.1); H.rr(ctx, -s * 0.17, s * 0.92, s * 0.64, s * 0.17, s * 0.085); ctx.fill(); }
    const fg = ctx.createLinearGradient(-s * 0.2, s * 0.4, s * 0.45, s * 1.0); fg.addColorStop(0, hl); fg.addColorStop(0.45, base); fg.addColorStop(1, shd);
    // bayangan lembut di bawah tangan: siluet tetap tegas di atas tombol/layar berwarna sama
    const md = ctx.getTransform(), dsc = Math.hypot(md.a, md.b); ctx.shadowColor = "rgba(14,18,60,0.38)"; ctx.shadowBlur = s * 0.12 * dsc; ctx.shadowOffsetX = s * 0.03 * dsc; ctx.shadowOffsetY = s * 0.05 * dsc;
    if (bip) {
      ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(s * 0.08, s * 0.66, s * 0.3, s * 0.3, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = base; H.rr(ctx, -s * 0.11, -s * 0.02, s * 0.22, s * 0.6, s * 0.11); ctx.fill(); ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.fillStyle = dark(base, 0.25); ctx.beginPath(); ctx.ellipse(s * 0.24, s * 0.7, s * 0.05, s * 0.1, -0.3, 0, TAU); ctx.fill();
      ctx.fillStyle = D.hexA("#FFFFFF", 0.35); H.rr(ctx, -s * 0.065, s * 0.04, s * 0.05, s * 0.32, s * 0.025); ctx.fill();
    } else {
      ctx.fillStyle = fg; H.rr(ctx, -s * 0.14, s * 0.42, s * 0.52, s * 0.6, s * 0.22); ctx.fill(); ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.fillStyle = D.hexA(shd, 0.55); for (let j = 0; j < 2; j++) { H.rr(ctx, s * 0.2, s * 0.6 + j * s * 0.15, s * 0.15, s * 0.025, s * 0.012); ctx.fill(); }
      ctx.fillStyle = dark(base, 0.12); H.rr(ctx, -s * 0.1, s * 0.02, s * 0.21, s * 0.66, s * 0.1); ctx.fill();
      ctx.fillStyle = base; H.rr(ctx, -s * 0.105, -s * 0.02, s * 0.2, s * 0.66, s * 0.1); ctx.fill();
      ctx.fillStyle = D.hexA("#FFFFFF", 0.22); H.rr(ctx, -s * 0.07, s * 0.06, s * 0.045, s * 0.42, s * 0.022); ctx.fill();
      ctx.fillStyle = lite(base, 0.5); H.rr(ctx, -s * 0.06, s * 0.014, s * 0.12, s * 0.11, s * 0.05); ctx.fill();
      ctx.fillStyle = mix(base, shd, 0.35); ctx.beginPath(); ctx.ellipse(-s * 0.15, s * 0.62, s * 0.07, s * 0.17, 0.5, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // ---------- spektrogram ----------
  const FMAX = 8000, CPS = 50, DUR = 12, NC = CPS * DUR, NR = 160;
  // f0 (Hz) = jarak harmonik; formants = tinggi pita terang; tempo = suku kata/detik; jeda = pengali panjang jeda; serak = derau di antara harmonik;
  // artefak = jejak suara buatan (pita atas hilang + garis datar); aksen/nama = warna & label bawaan
  const SUARA = {
    ibu: { seed: 3, f0: 215, formants: [560, 1700, 2900], tempo: 4.2, jeda: 1, serak: 0.08, aksen: "#FF7FA0", nama: "Ibu" },
    anak: { seed: 8, f0: 290, formants: [690, 2050, 3350], tempo: 5.8, jeda: 0.5, serak: 0, aksen: "#3FD8C8", nama: "Anak" },
    ayah: { seed: 21, f0: 104, formants: [420, 1120, 2250], tempo: 2.9, jeda: 1.8, serak: 0.75, aksen: "#5AA9FF", nama: "Ayah" },
    nenek: { seed: 34, f0: 190, formants: [500, 1450, 2650], tempo: 2.8, jeda: 1.4, serak: 0.55, aksen: "#A58BFF", nama: "Nenek" },
    narator: { seed: 55, f0: 125, formants: [490, 1380, 2550], tempo: 4.4, jeda: 1, serak: 0.08, aksen: "#FFB547", nama: "Narator" },
    pelaku: { seed: 77, f0: 135, formants: [450, 1250, 2500], tempo: 4.6, jeda: 1, serak: 0.25, aksen: "#9AA3C8", nama: "Pelaku" },
    tiruan: { seed: 91, timing: { seed: 3, tempo: 4.2, jeda: 1 }, f0: 208, formants: [540, 1650, 2820], tempo: 4.2, serak: 0.12, artefak: 1, aksen: "#FF6F91", nama: "Tiruan" },
  };
  const VOWEL = [[800, 1200, 2600], [300, 2300, 3000], [320, 800, 2400], [500, 1900, 2600], [500, 900, 2500]], VAVG = [480, 1420, 2620];
  const LUT = (() => {
    const st = [[0, "#2A3378"], [0.22, "#433C9E"], [0.42, "#7D45B6"], [0.6, "#D9548F"], [0.75, "#FF7F66"], [0.88, "#FFBE55"], [1, "#FFF4C8"]].map(([p, c]) => [p, rgb(c)]);
    const a = new Uint8ClampedArray(256 * 3);
    for (let i = 0; i < 256; i++) { const v = i / 255; let k = 0; while (k < st.length - 2 && v > st[k + 1][0]) k++; const f = (v - st[k][0]) / (st[k + 1][0] - st[k][0]); for (let j = 0; j < 3; j++) a[i * 3 + j] = Math.round(lerp(st[k][1][j], st[k + 1][1][j], clamp(f))); }
    return a;
  })();
  const lutCol = v => { const i = Math.round(clamp(v) * 255) * 3; return `rgb(${LUT[i]},${LUT[i + 1]},${LUT[i + 2]})`; };
  const LH = []; const lutHex = v => { const i = Math.round(clamp(v) * 255); return LH[i] || (LH[i] = "#" + ((1 << 24) + (LUT[i * 3] << 16) + (LUT[i * 3 + 1] << 8) + LUT[i * 3 + 2]).toString(16).slice(1)); };
  const prof = p => (typeof p === "string" ? SUARA[p] : p) || SUARA.ibu;
  const PLANS = {};
  function plan(pr) {
    const key = pr.seed + "|" + (pr.tempo || 4.2) + "|" + (pr.jeda || 1); if (PLANS[key]) return PLANS[key];
    const r = D.rng(pr.seed * 7919 + 13), tempo = pr.tempo || 4.2, jd = pr.jeda || 1, S = []; let t = 0.3;
    while (t < DUR - 0.9) {
      const n = 3 + Math.floor(r() * 6), base = 0.95 + 0.1 * r();
      for (let k = 0; k < n; k++) { const d = (1 / tempo) * (0.6 + 0.8 * r()); if (t + d > DUR - 0.35) break; S.push({ t0: t, t1: t + d, v: Math.floor(r() * 5), fric: r() < 0.38, dir: r() * 2 - 1, loud: 0.62 + 0.38 * r(), fk: base * (1.12 - 0.24 * k / n) * (0.93 + 0.14 * r()) }); t += d + 0.015; }
      t += (0.16 + r() * 0.5) * jd;
    }
    return (PLANS[key] = S);
  }
  function sylIdx(S, tau) { let lo = 0, hi = S.length - 1; while (lo <= hi) { const m = (lo + hi) >> 1; if (S[m].t1 < tau) lo = m + 1; else if (S[m].t0 > tau) hi = m - 1; else return m; } return -1; }
  // keadaan suara pada detik tau: kekuatan bersuara va, desis fa, f0 (kontur), formant F
  function voiceAt(pr, S, tau) {
    const fsc = pr.formants.map((f, j) => f / VAVG[j]), i = sylIdx(S, tau); if (i < 0) return { i: -1, va: 0, fa: 0, f0: pr.f0, F: VOWEL[0] };
    const s = S[i], xx = (tau - s.t0) / (s.t1 - s.t0); let fa = 0;
    if (s.fric && xx < 0.42) fa = s.loud * Math.pow(Math.sin(PI * xx / 0.42), 0.6) * 0.22;
    const vx = clamp((xx - (s.fric ? 0.34 : 0.03)) / (s.fric ? 0.66 : 0.97)), va = s.loud * Math.pow(Math.sin(PI * vx), 0.7);
    const f0 = pr.f0 * s.fk * (1 + 0.11 * (xx - 0.5) * s.dir) * (1 + 0.012 * Math.sin(tau * 33));
    const prevF = i > 0 ? VOWEL[S[i - 1].v] : VOWEL[0], gu = sm(xx / 0.3), F = VOWEL[s.v].map((v, j) => lerp(prevF[j], v, gu) * fsc[j]);
    return { i, va, fa, f0, F };
  }
  const envF = (F, f) => gs((f - F[0]) / 150) + 0.75 * gs((f - F[1]) / 200) + 0.5 * gs((f - F[2]) / 280) + 0.55 * Math.exp(-f / 650) + 0.06 * Math.exp(-f / 3000);
  const toV = E => Math.pow(clamp(Math.log1p(18 * E) / Math.log1p(18)), 0.85);
  const skey = pr => [pr.seed, pr.tempo, pr.jeda || 1, pr.f0, pr.formants.join(","), pr.serak || 0, pr.artefak || 0, pr.timing ? [pr.timing.seed, pr.timing.tempo, pr.timing.jeda || 1].join("/") : ""].join("|");
  const STRIPS = {};
  function paint(V) { const c = document.createElement("canvas"); c.width = NC; c.height = NR; const x = c.getContext("2d"), im = x.createImageData(NC, NR), d = im.data;
    for (let k = 0; k < NC * NR; k++) { const li = Math.round(clamp(V[k]) * 255) * 3, p = k * 4; d[p] = LUT[li]; d[p + 1] = LUT[li + 1]; d[p + 2] = LUT[li + 2]; d[p + 3] = 255; }
    x.putImageData(im, 0, 0); return c; }
  function stripData(pr) {
    const key = skey(pr); if (STRIPS[key]) return STRIPS[key];
    const S = plan(pr.timing || pr), V = new Float32Array(NC * NR), ser = pr.serak || 0, art = pr.artefak || 0;
    for (let col = 0; col < NC; col++) {
      const vo = voiceAt(pr, S, col / CPS), { va, fa, f0, F } = vo;
      for (let row = 0; row < NR; row++) {
        const f = (NR - 1 - row) / (NR - 1) * FMAX, nz = 0.45 * hn(col, row, pr.seed) + 0.55 * hn(col >> 1, row >> 2, pr.seed + 1);
        let E = 0.012 + 0.02 * nz;
        if (va > 0) {
          const env = envF(F, f), k = f / f0, dd = (k - Math.round(k)) * f0, bw = 22 + f0 * 0.09, comb = f > f0 * 0.6 ? gs(dd / bw) : 0;
          let e = comb * env + ser * env * (0.25 + 0.75 * nz) * 0.75 + 0.04 * env;
          if (art > 0) e = e * (1 - 0.75 * art * sm((f - 3600) / 500)) + art * 0.22 * gs((f - 4350) / 70) + art * 0.16 * gs((f - 4900) / 60);
          E += va * e;
        }
        if (fa > 0) E += fa * sm((f - 2600) / 1800) * (1 - 0.65 * sm((f - 5500) / 2500)) * (0.15 + 0.85 * hn(col >> 1, row >> 3, pr.seed + 2) * nz);
        V[row * NC + col] = toV(E);
      }
    }
    return (STRIPS[key] = { V, c: paint(V) });
  }
  const strip = pr => stripData(pr).c;
  // versi "lewat telepon": pita 300–3400 Hz, buram waktu+frekuensi, lantai derau, warna dikuantisasi
  function telStrip(pr) {
    const key = skey(pr) + "|tel"; if (STRIPS[key]) return STRIPS[key].c;
    const V = stripData(pr).V, A = new Float32Array(NC * NR), B = new Float32Array(NC * NR);
    for (let row = 0; row < NR; row++) { const f = (NR - 1 - row) / (NR - 1) * FMAX, inb = sm((f - 250) / 100) * (1 - sm((f - 3350) / 150)); for (let col = 0; col < NC; col++) A[row * NC + col] = V[row * NC + col] * inb; }
    const box = (src, dst, rx, ry) => { for (let row = 0; row < NR; row++) for (let col = 0; col < NC; col++) { let s = 0, n = 0; for (let dy = -ry; dy <= ry; dy++) { const rr = row + dy; if (rr < 0 || rr >= NR) continue; for (let dx = -rx; dx <= rx; dx++) { const cc = col + dx; if (cc < 0 || cc >= NC) continue; s += src[rr * NC + cc]; n++; } } dst[row * NC + col] = s / n; } };
    box(A, B, 2, 3); box(B, A, 1, 2);
    for (let row = 0; row < NR; row++) { const f = (NR - 1 - row) / (NR - 1) * FMAX, inb = f >= 300 && f <= 3400;
      for (let col = 0; col < NC; col++) { const k = row * NC + col, nz = hn(col >> 2, row >> 2, 99); let v = inb ? Math.max(A[k] * 1.25, 0.2 + 0.1 * nz) : 0.04 + 0.04 * nz; v = Math.round(clamp(v) * 5) / 5; B[k] = v; } }
    STRIPS[key] = { V: B, c: paint(B) }; return STRIPS[key].c;
  }
  function blendProf(a, b, m) { const ta = a.timing || { seed: a.seed, tempo: a.tempo, jeda: a.jeda }; return { seed: b.seed, tempo: b.tempo, jeda: b.jeda, timing: ta, f0: Math.round(lerp(a.f0, b.f0, m)), formants: a.formants.map((f, j) => Math.round(lerp(f, b.formants[j], m))), serak: Math.round(lerp(a.serak || 0, b.serak || 0, m) * 100) / 100, artefak: Math.round(lerp(a.artefak || 0, b.artefak || 0, m) * 100) / 100 }; }
  function drawStrip(ctx, c, x, y, w, h, t0, dur, fmax) {
    let s0 = ((t0 * CPS) % NC + NC) % NC, sw = dur * CPS; const r0 = NR * (1 - fmax / FMAX), rh = NR - r0;
    while (sw > 0) { const part = Math.min(sw, NC - s0), dw = part / (dur * CPS) * w; ctx.drawImage(c, s0, r0, part, rh, x, y, dw + 0.5, h); x += dw; sw -= part; s0 = 0; }
  }
  function tab(ctx, s, x, y, size, col) {   // label tab di atas tepi panel (digambar sebelum panel)
    ctx.font = `800 ${size}px ${FONT}`; const tw = ctx.measureText(s).width + size * 0.9, th = size * 1.35;
    ctx.fillStyle = col; H.rr(ctx, x, y - th, tw, th + size * 0.5, size * 0.3); ctx.fill();
    tx(ctx, s, x + size * 0.45, y - th / 2 + size * 0.02, size, "#141A4A", { align: "left", weight: 800 }); return tw;
  }
  function spektrogram(ctx, x, y, w, h, opt = {}) {
    const pr = prof(opt.profil), dur = opt.dur || 4, fmax = clamp(opt.fmax || 5500, 1000, FMAX), scroll = opt.scroll || 0, rv = opt.reveal == null ? 1 : clamp(opt.reveal), rad = opt.r == null ? Math.min(w, h) * 0.06 : opt.r;
    const tel = clamp(opt.telepon || 0), band = opt.band || (tel > 0 ? [300, 3400] : null), bandAmt = opt.bandAmt == null ? (opt.band ? 1 : tel) : clamp(opt.bandAmt);
    const ak = opt.aksen === true ? pr.aksen : opt.aksen, lab = opt.label === true ? pr.nama : opt.label;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    if (lab) tab(ctx, lab, x + rad * 0.6, y + rad * 0.2, opt.labelSize || 40, ak || P.amber);
    if (opt.frame !== false) { ctx.fillStyle = "rgba(14,18,60,0.3)"; H.rr(ctx, x + h * 0.02, y + h * 0.04, w, h, rad); ctx.fill(); }
    ctx.save(); H.rr(ctx, x, y, w, h, rad); ctx.fillStyle = lutCol(0); ctx.fill(); ctx.clip();
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * rv, h); ctx.clip(); ctx.imageSmoothingEnabled = true;
    const layer = (p, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; drawStrip(ctx, strip(p), x, y, w, h, scroll, dur, fmax); if (tel > 0) { ctx.globalAlpha *= tel; drawStrip(ctx, telStrip(p), x, y, w, h, scroll, dur, fmax); } ctx.restore(); };
    const m = clamp(opt.morph || 0);
    if (m > 0 && opt.ke) { const b = prof(opt.ke), q = m * 8, i0 = Math.floor(q), f = q - i0; layer(blendProf(pr, b, i0 / 8), 1); if (f > 0.001) layer(blendProf(pr, b, Math.min(8, i0 + 1) / 8), f); }
    else layer(pr, 1);
    ctx.restore();
    const yOf = hz => y + h * (1 - hz / fmax);
    if (opt.grid) { ctx.fillStyle = "rgba(255,255,255,0.12)"; for (let k = 1000; k < fmax; k += 1000) ctx.fillRect(x, yOf(k), w, Math.max(1, h * 0.004)); }
    if (band && bandAmt > 0) {
      const a = bandAmt, [lo, hi] = band, yh = yOf(hi), yl = yOf(lo), lw = Math.max(2.5, h * 0.016);
      ctx.fillStyle = D.hexA("#1A2160", 0.9 * a); ctx.fillRect(x, y, w, yh - y); ctx.fillRect(x, yl, w, y + h - yl);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, yh - y); ctx.rect(x, yl, w, y + h - yl); ctx.clip(); ctx.strokeStyle = D.hexA("#8D98E0", 0.28 * a); ctx.lineWidth = Math.max(2, h * 0.012);
      for (let k = -h; k < w; k += Math.max(10, h * 0.06)) { ctx.beginPath(); ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h, y); ctx.stroke(); } ctx.restore();
      for (const yy of [yh, yl]) { ctx.strokeStyle = D.hexA(P.teal, 0.45 * a); ctx.lineWidth = lw * 3; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
        ctx.strokeStyle = D.hexA("#FFFFFF", 0.95 * a); ctx.lineWidth = lw; ctx.setLineDash([lw * 3.5, lw * 2.2]); ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); ctx.setLineDash([]); }
    }
    if (rv < 1 && rv > 0) { const px = x + w * rv; D.glow(ctx, px, y + h / 2, h * 0.5, P.warm, 0.4); ctx.fillStyle = "#FFF4C8"; ctx.fillRect(px - Math.max(1.5, w * 0.003), y, Math.max(3, w * 0.006), h); }
    const gl = ctx.createLinearGradient(0, y, 0, y + h); gl.addColorStop(0, "rgba(255,255,255,0.08)"); gl.addColorStop(0.35, "rgba(255,255,255,0)"); ctx.fillStyle = gl; ctx.fillRect(x, y, w, h);
    ctx.restore();
    if (ak) { ctx.strokeStyle = ak; ctx.lineWidth = Math.max(3, Math.min(w, h) * 0.028); H.rr(ctx, x, y, w, h, rad); ctx.stroke(); }
    if (band && bandAmt > 0 && opt.bandLabel) {   // label batas telepon (≥40 px) di atas garis 300 Hz, rata kanan
      const s = opt.bandLabel === true ? "batas telepon" : opt.bandLabel, ls = opt.labelSize || 40, yl = yOf(band[0]);
      ctx.save(); ctx.globalAlpha *= bandAmt; ctx.font = `800 ${ls}px ${FONT}`; const tw = ctx.measureText(s).width + ls * 0.8, bx = x + w - tw - ls * 0.3, by = yl - ls * 0.35 - ls * 1.3;
      ctx.fillStyle = "rgba(14,20,64,0.88)"; H.rr(ctx, bx, by, tw, ls * 1.3, ls * 0.65); ctx.fill(); ctx.strokeStyle = P.teal; ctx.lineWidth = 3; ctx.stroke();
      tx(ctx, s, bx + tw / 2, by + ls * 0.67, ls, "#FFFFFF", { weight: 800 });
      ctx.fillStyle = P.teal; ctx.beginPath(); ctx.moveTo(bx + tw * 0.75 - ls * 0.25, by + ls * 1.3); ctx.lineTo(bx + tw * 0.75 + ls * 0.25, by + ls * 1.3); ctx.lineTo(bx + tw * 0.75, yl - 2); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    return { x, y, w, h, yOf, xOf: s => x + (s - scroll) / dur * w };
  }

  // ---------- gelombang ----------
  function gelombang(ctx, x, y, w, h, opt = {}) {
    const t = opt.t || 0, mode = opt.mode || "garis", seed = opt.seed || 1, sp = opt.speed == null ? 1 : opt.speed, col = opt.col || P.teal, col2 = opt.col2 || P.pink;
    const ampF = typeof opt.amp === "function" ? opt.amp : (u => (opt.amp == null ? 1 : opt.amp));
    const env = u => clamp(ampF(u, t)) * (0.35 + 0.65 * vn(u * 5 - t * sp * 1.6, seed)) * Math.pow(Math.sin(PI * clamp(u)), 0.5);
    ctx.save(); const A0 = ctx.globalAlpha * (opt.alpha == null ? 1 : opt.alpha); ctx.globalAlpha = A0;
    const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, col); gr.addColorStop(1, col2);
    const cy = y + h / 2;
    if (mode === "batang") {
      const n = opt.n || Math.max(8, Math.round(w / 18)), st = w / n, bw = st * 0.55, an = clamp(opt.angka || 0), vals = [];
      const shrink = sm(an / 0.6), ba = 1 - sm((an - 0.3) / 0.5);
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n, v = clamp(0.08 + 0.92 * env(u) * (0.5 + 0.5 * vn(i * 0.9 + t * sp * 7, seed + 5))); vals.push(v);
        if (ba > 0) { ctx.fillStyle = gr; ctx.globalAlpha = A0 * ba; const ww = lerp(bw, bw * 0.45, shrink), bh = lerp(Math.max(bw, v * h), ww, shrink); H.rr(ctx, x + i * st + (st - ww) / 2, cy - bh / 2, ww, bh, ww / 2); ctx.fill(); }
      }
      if (an > 0.12) {   // deretan angka sampel: grid 1–3 baris, digit tabular (sel lebar tetap), bergulir pelan ke kiri
        const fsz = opt.angkaSize || Math.max(12, Math.min(h * 0.24, w / 18)), rows = opt.angkaBaris || clamp(Math.floor(h / (fsz * 1.2)), 1, 3);
        const cwid = fsz * 0.62, cell = cwid * 4.5 + fsz * 0.8, lh = h / rows, sc = t * sp * 0.45, k0 = Math.floor(sc), fr = sc - k0;
        const cols = Math.ceil(w / cell) + 2;
        ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.font = `700 ${fsz}px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        for (let r = 0; r < rows; r++) {
          const ry = y + lh * (r + 0.5);
          for (let c = 0; c < cols; c++) {
            const k = k0 + c, px = x + (c - fr) * cell + cell * 0.5, uu = clamp((px - x) / w);
            const hw = cwid * 2.2, edge = clamp(Math.min(px - hw - x, x + w - px - hw) / (cell * 0.35)), stag = sm((an - 0.15 - 0.4 * uu) / 0.45), a = edge * stag; if (a <= 0.01) continue;
            const mag = clamp(0.06 + 0.94 * hn(k, r, seed + 11) * (0.4 + 0.6 * env(uu))), neg = hn(k, r, seed + 12) < 0.5, d = Math.min(99, Math.round(mag * 100));
            const chars = [neg ? "−" : "", "0", ",", String(Math.floor(d / 10)), String(d % 10)], wd = [cwid * 0.8, cwid, cwid * 0.5, cwid, cwid];
            ctx.globalAlpha = A0 * a; ctx.fillStyle = (r + c) % 3 === 0 ? col2 : col;
            let cx0 = px - wd.reduce((s, v) => s + v, 0) / 2; const yy = ry + (1 - stag) * fsz * 0.4;
            chars.forEach((ch, j) => { if (ch) ctx.fillText(ch, cx0 + wd[j] / 2, yy); cx0 += wd[j]; });
          }
        }
        ctx.restore();
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
      ctx.closePath(); ctx.globalAlpha = A0 * 0.85; ctx.fillStyle = gr; ctx.fill(); ctx.globalAlpha = A0;
      ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.fillRect(x, cy - Math.max(1, h * 0.012), w, Math.max(2, h * 0.024));
    } else {
      const line = () => { ctx.beginPath(); pts.forEach(([px, s, e], i) => { const yy = cy - s * e * h / 2; i ? ctx.lineTo(px, yy) : ctx.moveTo(px, yy); }); };
      const lw = opt.lw || Math.max(3, h * 0.045); ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (opt.glow !== false) { ctx.strokeStyle = gr; ctx.globalAlpha = A0 * 0.22; ctx.lineWidth = lw * 4; line(); ctx.stroke(); ctx.globalAlpha = A0; }
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
    for (let i = 0; i < na; i++) { const rho = 0.06 + 1.2 * i / (na - 1), gap = rho < 0.4 ? 0.2 : Math.acos(Math.min(1, 0.4 / rho)) + 0.1;
      out.push({ i, kind: "arc", rho, gap, ph: r() * TAU, wob: 0.02 + r() * 0.02, segs: segs() }); }
    for (let j = 0; j < nb; j++) out.push({ i: na + j, kind: "arch", y0: 0.6 + j * 0.088, bow: 0.2 - j * 0.022, ph: r() * TAU, wob: 0.015, segs: segs() });
    return (RIDGES[seed] = { n: na + nb, list: out });
  }
  function fpPoint(R, s) {
    if (R.kind === "arch") { const x = -1 + 2 * s; return [x, R.y0 - R.bow * (1 - x * x) + R.wob * Math.sin(x * 5 + R.ph)]; }
    const a = lerp(PI / 2 + R.gap, PI / 2 + TAU - R.gap, s), wb = 1 + R.wob * Math.sin(a * 3 + R.ph);
    return [Math.cos(a) * R.rho * 0.8 * wb, Math.sin(a) * R.rho * 0.92 * wb + 0.04];
  }
  function sidikJari(ctx, cx, cy, r, opt = {}) {
    const t = opt.t || 0, fs = clamp(opt.fromSpec || 0), G = ridges(opt.seed || 1), pr = prof(opt.profil), col = opt.col || "#A5F1E6", n = G.n;
    const dur = opt.dur || 3.5, fmax = opt.fmax || 5500, scroll = opt.scroll || 0, S = plan(pr.timing || pr);
    const PX = -1.15, PY = -1.0, PW = 2.3, PH = 2.0;   // panel spektrogram (satuan r)
    const pa = D.eio(clamp((fs - 0.3) / 0.7)), sa = D.eio(clamp((fs - 0.72) / 0.28)), la = lerp(1, opt.garis == null ? 0.35 : opt.garis, D.eio(clamp((fs - 0.82) / 0.18)));
    ctx.save(); ctx.translate(cx, cy); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha; const A0 = ctx.globalAlpha;
    if (fs < 1) { ctx.save(); ctx.globalAlpha = A0 * (1 - fs); ctx.fillStyle = D.hexA(col, 0.1); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.84, r * 1.06, 0, 0, TAU); ctx.fill(); D.glow(ctx, 0, 0, r * 1.3, col, 0.25); ctx.restore(); }
    if (pa > 0) { ctx.save(); ctx.globalAlpha = A0 * pa; const rad = r * PH * 0.06;
      ctx.fillStyle = "rgba(14,18,60,0.3)"; H.rr(ctx, PX * r + PH * r * 0.02, PY * r + PH * r * 0.04, PW * r, PH * r, rad); ctx.fill();
      ctx.fillStyle = lutCol(0); H.rr(ctx, PX * r, PY * r, PW * r, PH * r, rad); ctx.fill(); ctx.restore(); }
    if (sa > 0) spektrogram(ctx, PX * r, PY * r, PW * r, PH * r, { profil: pr, dur, fmax, scroll, frame: false, alpha: A0 * sa });
    // guratan: bentuk sidik jari -> garis harmonik k = i+1 yang mengikuti kontur f0 suku kata
    const lw0 = opt.lw || r * 0.032, inPad = (x, y) => (x / 0.82) ** 2 + (y / 1.04) ** 2 < 1, runs = [];
    G.list.forEach(R => {
      const ui = D.eio(clamp((fs - (R.i / n) * 0.6) / 0.4)), k = R.i + 1;
      R.segs.forEach(([a, b]) => {
        const steps = Math.max(4, Math.round((b - a) * 90)); let run = null;
        for (let j = 0; j <= steps; j++) {
          const s = lerp(a, b, j / steps), [fx, fy] = fpPoint(R, s), tau = scroll + s * dur, vo = voiceAt(pr, S, tau);
          const hz = k * vo.f0, ty = PY + PH * (1 - hz / fmax), tx2 = PX + PW * s, voiced = vo.va > 0.06, above = hz > fmax * 0.985;
          const key = (inPad(fx, fy) ? 0 : 1) + (voiced ? 2 : 0) + (above ? 4 : 0) + "|" + vo.i;
          const E = 0.022 + vo.va * envF(vo.F, hz) * 1.04, v = toV(E), p = [lerp(fx, tx2, ui) * r, lerp(fy, ty, ui) * r];
          if (!run || run.key !== key) { const last = run && run.pts[run.pts.length - 1]; run = { key, pts: last ? [last] : [], ui, out: !inPad(fx, fy), voiced, above, v: 0, nv: 0 }; runs.push(run); }
          run.pts.push(p); run.v += v; run.nv++;
        }
      });
    });
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const spacing = PH * r * pr.f0 / fmax, lw1 = Math.max(lw0 * 0.6, spacing * 0.55);
    const pass = hi => runs.forEach(d => {
      if (d.pts.length < 2) return; const ui = d.ui;
      let a = (d.out ? clamp(ui * 1.6 - 0.3) : 1) * (d.voiced ? 1 : 1 - sm((ui - 0.15) / 0.35)) * (d.above ? 1 - sm((ui - 0.4) / 0.4) : 1) * la * (hi ? 0.45 * (1 - fs) : 1);
      if (a <= 0.01) return; ctx.globalAlpha = A0 * a;
      ctx.lineWidth = lerp(lw0, lw1, ui); ctx.strokeStyle = hi ? "#FFFFFF" : (ui > 0.01 ? mix(col, lutHex(0.15 + 0.85 * (d.v / d.nv)), sm(ui * 1.3)) : col);
      ctx.beginPath(); d.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    });
    pass(false); ctx.globalAlpha = A0;
    if (fs < 1) { const band = ((t * 0.35) % 1.6 - 0.3) * 2.2 * r - r * 1.1; ctx.save(); ctx.beginPath(); ctx.rect(-r * 1.3, band - r * 0.12, r * 2.6, r * 0.24); ctx.clip(); pass(true); ctx.restore(); ctx.globalAlpha = A0; }
    // garis pindai: di dalam elips bantalan, pita cahaya teal
    if (opt.scan != null && fs < 1) {
      const yy = lerp(-r * 1.06, r * 1.06, clamp(opt.scan)); ctx.save(); ctx.globalAlpha = A0 * (1 - fs); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.86, r * 1.08, 0, 0, TAU); ctx.clip();
      const gb = ctx.createLinearGradient(0, yy - r * 0.35, 0, yy + r * 0.06); gb.addColorStop(0, D.hexA(P.teal, 0)); gb.addColorStop(0.85, D.hexA(P.teal, 0.45)); gb.addColorStop(1, D.hexA(P.teal, 0));
      ctx.fillStyle = gb; ctx.fillRect(-r, yy - r * 0.35, r * 2, r * 0.41); ctx.fillStyle = D.hexA("#E9FFFB", 0.9); ctx.fillRect(-r, yy - r * 0.012, r * 2, r * 0.024); ctx.restore();
    }
    ctx.restore();
    return { panel: { x: cx + PX * r, y: cy + PY * r, w: PW * r, h: PH * r }, dur, fmax, scroll, profil: pr };
  }

  // ---------- etalase ----------
  function showcase(ctx, t) {
    const W = 1920, HH = 1080, L = K.kit.layar;
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, "#3A4F9C"); gr.addColorStop(1, "#6177C6"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    D.glow(ctx, 1600, 120, 520, P.amber, 0.16); D.glow(ctx, 260, 980, 520, P.teal, 0.12);
    const cap = (s, x, y, size = 20, col = P.ink2, al = "center") => D.txt(ctx, s, x, y, size, { align: al, weight: 700, color: col });
    D.txt(ctx, "K.kit.layar", 30, 40, 30, { weight: 900 }); D.txt(ctx, "baris 1: hp() + layar (ringkas:true kecuali tanda *) · baris 2: HP rebah, spektrogram, gelombang, sidik jari, ikon, jari", 230, 40, 21, { weight: 600, color: P.ink2 });
    const ph = 420, y0 = 285;
    const items = [
      ["kontak · sorot", { screen: (c, w, h) => L.kontak(c, w, h, { t, sorot: "Anakku" }) }],
      ["panggilan · status", { screen: (c, w, h) => L.panggilan(c, w, h, { t, nama: "Anakku", status: "Memanggil…", huruf: "A", warna: "#2EB89A" }) }],
      ["videoCall · glitch .3", { screen: (c, w, h) => L.videoCall(c, w, h, { t, glitch: 0.3, kedip: (t % 1.7) < 0.3 }) }],
      ["obrolan", { screen: (c, w, h) => L.obrolan(c, w, h, { t, nama: "Nomor baru", mengetik: t % 3.4 > 2.2, muncul: Math.min(3, 1.4 + t * 0.7), pesan: [{ dari: "dia", teks: "Bu, ini aku." }, { dari: "dia", suara: true }, { dari: "aku", teks: "Kamu di mana?" }] }) }],
      ["transfer + jari Bip", { screen: (c, w, h) => L.transfer(c, w, h, { t, ke: "Rekening orang lain", highlight: t < 1.7 ? "transfer" : "tunggu", tekan: { tombol: "tunggu", u: clamp((t - 2.6) / 0.8) }, peringatan: true }) }],
      ["kontak · banding", { screen: (c, w, h) => L.kontak(c, w, h, { t, banding: { u: clamp(t / 2.2) } }) }],
      ["feed · privat", { screen: (c, w, h) => L.feed(c, w, h, { t, privat: clamp((t - 0.6) / 2.2) }) }],
      ["rekam · tersimpan", { screen: (c, w, h) => L.rekam(c, w, h, { t: t + 2, tersimpan: clamp((t - 2.2) / 0.8) }) }],
    ];
    items.forEach(([name, o], i) => {
      const x = 128 + i * 238; const a = L.hp(ctx, x, y0, ph, Object.assign({ t, glow: 0.22, ringkas: true }, o)); cap(name, x, y0 + ph / 2 + 30);
      if (name.startsWith("transfer") && a.out) { const tg = a.out.tunggu, tu = clamp((t - 2.6) / 0.8), hov = clamp((t - 1.7) / 0.9);
        const p = a.map(tg.x + tg.w * 0.8, tg.cy), q = a.map(a.out.transfer.x + a.out.transfer.w * 0.8, a.out.transfer.cy);
        L.jari(ctx, lerp(q.x, p.x, D.eio(hov)), lerp(q.y, p.y, D.eio(hov)), 70, { t, tekan: tu, bip: true }); }
    });
    ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(0, 548, W, 3);
    // baris 2 kiri: HP rebah di meja + panggilan masuk berdering (tampak depan, tilt, lit)
    const ty = 600; ctx.fillStyle = "#7E5B54"; H.rr(ctx, 20, ty + 40, 330, 250, 22); ctx.fill(); ctx.fillStyle = "#9A7066"; H.rr(ctx, 20, ty + 40, 330, 18, 9); ctx.fill();
    L.hp(ctx, 185, ty + 165, 300, { t, flat: 1, ring: (t % 3.4) < 2.2 ? 1 : 0, rot: 0.25, glowCol: P.warm, glow: 0.55, screen: (c, w, h) => L.panggilanMasuk(c, w, h, { t }) });
    cap("hp flat:1 · ring · rot", 185, ty + 318);
    L.hp(ctx, 465, ty + 175, 300, { t, ring: 1, tilt: -0.3, lit: 0.9, ringkas: true, screen: (c, w, h) => L.panggilanMasuk(c, w, h, { t }) });
    cap("ring · tilt -.3 · lit .9", 465, ty + 350);
    // spektrogram
    const sx = 625, sw = 200, shh = 100;
    ["ibu", "anak", "ayah"].forEach((k, i) => L.spektrogram(ctx, sx + i * 220, 628, sw, shh, { profil: k, scroll: t * 0.8, aksen: true, label: true, labelSize: 30 }));
    cap("spektrogram aksen+label (ibu · anak · ayah): jarak harmonik, formant, tempo, jeda, serak", sx + 330, 754, 17);
    const tel = 0.5 + 0.5 * Math.sin(t * 1.4 - 1.5);
    L.spektrogram(ctx, sx, 802, sw, shh, { profil: "ibu", telepon: tel, fmax: 4500, aksen: P.teal, label: "asli", labelSize: 28 });
    L.spektrogram(ctx, sx + 220, 802, sw, shh, { profil: "tiruan", telepon: tel, fmax: 4500, aksen: P.pink, label: "tiruan", labelSize: 28, bandLabel: true, labelSize: 26 });
    L.spektrogram(ctx, sx + 440, 802, sw, shh, { profil: "ayah", ke: "anak", morph: 0.5 + 0.5 * Math.sin(t * 1.3), reveal: 0.3 + (t * 0.25) % 0.7, grid: true });
    cap("telepon " + tel.toFixed(2) + " (asli/tiruan, fmax 4500) · morph+reveal+grid", sx + 330, 928, 17);
    // gelombang
    const gx = 1290, gw = 300;
    [["garis", {}], ["batang", {}], ["cermin", { col: P.amber, col2: P.pink }], ["angka", { mode: "batang", angka: clamp((t - 0.3) / 2.2), col: "#FFFFFF", col2: P.warm }]].forEach(([nm, o], i) => {
      const yy = 585 + i * 84; ctx.fillStyle = "rgba(20,28,80,0.35)"; H.rr(ctx, gx, yy, gw, 74, 14); ctx.fill();
      L.gelombang(ctx, gx + 12, yy + 5, gw - 24, 64, Object.assign({ t, mode: nm, seed: i + 2, n: 30 }, o)); cap(nm, gx + gw + 8, yy + 44, 17, P.ink2, "left");
    });
    // sidik jari
    [[0, 1340], [0.5, 1480], [1, 1620]].forEach(([f, x], i) => { const fv = i === 1 ? clamp(0.5 + 0.6 * Math.sin(t * 0.9 - 1.2)) : f; L.sidikJari(ctx, x, 990, 46, { fromSpec: fv, t, seed: 4, profil: "ibu", scan: i === 0 ? (t * 0.4) % 1 : undefined }); cap("sidikJari " + fv.toFixed(2), x, 1068, 17); });
    // jari
    L.jari(ctx, 1745, 960, 64, { t, tekan: 0 }); L.jari(ctx, 1850, 960, 64, { t, tekan: 1, lengan: "#FF8FA8", kulit: K.kit.orang ? K.kit.orang.SKIN[1] : undefined }); cap("jari · tekan 0 / 1", 1800, 1068, 17);
    // ikon
    IKON.forEach((n, i) => { const x = 1700 + (i % 4) * 52, y = 590 + Math.floor(i / 4) * 52; ctx.fillStyle = "rgba(20,28,80,0.35)"; ctx.beginPath(); ctx.arc(x, y, 22, 0, TAU); ctx.fill(); L.ikon(ctx, n, x, y, 26, "#FFFFFF"); });
    cap("ikon(ctx, nama, cx, cy, s, col)", 1778, 838, 17);
  }

  K.kit.layar = { hp, panggilanMasuk, panggilan, videoCall, obrolan, transfer, rekam, kontak, feed, mati, spektrogram, gelombang, sidikJari, jari, ikon, avatar, statusBar, SUARA, IKON, LUT_COL: lutCol, showcase };
})(typeof window !== "undefined" ? window : globalThis);
