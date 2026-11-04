/* S31 pembantu khusus: situs arsip karya rekaan "Arsip Karya" (arsipkarya.example) di dalam W.browser, gambar karya yang digambar
   dengan kode (poster dolanan, gunungan wayang, motif kawung, layar wayang), lencana lisensi teks (bukan logo resmi), dialog Buka file,
   kolom kata kunci, halaman karya, dan aplikasi Slide sederhana. Semua nama, karya, dan alamat rekaan. Memakai layar.js + layar_web.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, W = K.web, UI = W.UI;
  const { rr, text, ease, clamp, lerp } = H;
  const A = {};
  const BLUE = UI.focus, RED = UI.bad, GREEN = UI.good;
  const F = (w, s) => `${w} ${s}px ${K.FONT}`;
  const meas = (ctx, s, size, weight = 600) => { ctx.font = F(weight, size); return ctx.measureText(s).width; };
  A.SITE = "#24525E";

  // ---------- data lisensi ----------
  A.LIC = {
    "CC BY": { title: "Atribusi", desc: "Boleh dipakai, diubah, dan dijual, asalkan menyebut pembuatnya.", rules: [1, 1, 1], must: "sebut pembuat" },
    "CC BY-SA": { title: "Atribusi, Berbagi Serupa", desc: "Seperti CC BY, dan karya turunannya harus memakai lisensi yang sama.", rules: [1, 1, 1], must: "sebut pembuat + lisensi sama" },
    "CC BY-NC": { title: "Atribusi, Nonkomersial", desc: "Boleh dipakai dan diubah dengan menyebut pembuatnya, tetapi tidak untuk dijual.", rules: [1, 1, 0], must: "sebut pembuat" },
    "©": { title: "Semua hak dilindungi", desc: "Orang lain harus meminta izin pembuatnya untuk setiap pemakaian.", rules: [0, 0, 0], must: "minta izin" }
  };
  A.LIC_ORDER = ["CC BY", "CC BY-SA", "CC BY-NC", "©"];

  // lencana lisensi: lingkaran "cc" + kode, atau "©" untuk semua hak dilindungi. → lebar
  A.badge = function (ctx, x, y, code, opt = {}) {
    const s = opt.size || 22, h = s * 1.6, all = code === "©";
    const label = all ? "Semua hak dilindungi" : code.replace("CC ", "");
    const tw = meas(ctx, label, s, 900), w = h + 12 + tw + 16;
    ctx.fillStyle = all ? "#8A2F28" : "#26323B"; rr(ctx, x, y, w, h, h / 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + h / 2, y + h / 2, h / 2 - 4, 0, Math.PI * 2); ctx.fill();
    text(ctx, all ? "©" : "cc", x + h / 2, y + h / 2 + s * 0.34, all ? s * 1.05 : s * 0.82, { align: "center", weight: 900, color: all ? "#8A2F28" : "#26323B" });
    text(ctx, label, x + h + 10, y + h / 2 + s * 0.36, s, { weight: 900, color: "#FFFFFF" });
    return w;
  };

  // ---------- gambar karya ----------
  // poster Sinta (rasio 3:4). opt.jawa: versi terjemahan bahasa Jawa
  A.poster = function (ctx, x, y, w, h, opt = {}) {
    const u = w / 300; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = opt.jawa ? "#FDE7C8" : "#FFF1C2"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = opt.jawa ? "#C2562E" : "#2E7E9A"; ctx.fillRect(x, y, w, 92 * u);
    text(ctx, opt.jawa ? "AYO DOLANAN!" : "AYO BERMAIN!", x + w / 2, y + 36 * u, 22 * u, { align: "center", weight: 900, color: "#FFFFFF" });
    text(ctx, "Cublak-cublak", x + w / 2, y + 62 * u, 24 * u, { align: "center", weight: 900, color: "#FFFFFF" });
    text(ctx, "Suweng", x + w / 2, y + 86 * u, 24 * u, { align: "center", weight: 900, color: "#FFE08A" });
    // anak-anak duduk melingkar, satu telungkup di tengah
    const cx = x + w / 2, cy = y + 200 * u;
    ctx.fillStyle = "#E9D9A6"; ctx.beginPath(); ctx.ellipse(cx, cy + 10 * u, 112 * u, 54 * u, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#7A5AA6"; ctx.beginPath(); ctx.ellipse(cx, cy + 6 * u, 34 * u, 20 * u, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3B2A1E"; ctx.beginPath(); ctx.arc(cx - 30 * u, cy, 11 * u, 0, Math.PI * 2); ctx.fill();
    const kids = ["#D9443B", "#2E9E5B", "#F2B134", "#2E7E9A", "#E07A3B"];
    kids.forEach((c, i) => { const a = Math.PI * (1.05 + i * 0.225), px = cx + Math.cos(a) * 96 * u, py = cy + 8 * u + Math.sin(a) * 46 * u + (i % 2) * 4 * u;
      ctx.fillStyle = c; rr(ctx, px - 13 * u, py - 6 * u, 26 * u, 30 * u, 8 * u); ctx.fill();
      ctx.fillStyle = "#C98E62"; ctx.beginPath(); ctx.arc(px, py - 15 * u, 11 * u, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#3B2A1E"; ctx.beginPath(); ctx.arc(px, py - 19 * u, 11 * u, Math.PI, 0); ctx.fill(); });
    [[-40, 52], [8, 60], [52, 48]].forEach(([dx, dy], i) => { const px = cx + dx * u, py = cy + dy * u;
      ctx.fillStyle = ["#2E9E5B", "#D9443B", "#F2B134"][i]; rr(ctx, px - 13 * u, py - 6 * u, 26 * u, 30 * u, 8 * u); ctx.fill();
      ctx.fillStyle = "#C98E62"; ctx.beginPath(); ctx.arc(px, py - 15 * u, 11 * u, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#3B2A1E"; ctx.beginPath(); ctx.arc(px, py - 19 * u, 11 * u, Math.PI, 0); ctx.fill(); });
    // suweng (anting) berkilau
    ctx.strokeStyle = "#E0A21B"; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.arc(x + 250 * u, y + 128 * u, 12 * u, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#E0A21B"; ctx.beginPath(); ctx.arc(x + 250 * u, y + 144 * u, 6 * u, 0, Math.PI * 2); ctx.fill();
    // teks bawah
    const lines = opt.jawa ? ["Cublak-cublak suweng,", "suwenge ting gelenter…", "Dolanan bareng kanca!"] : ["Cublak-cublak suweng,", "suwenge ting gelenter…", "Lagu dolanan dari Jawa."];
    lines.forEach((s, i) => text(ctx, s, x + w / 2, y + (300 + i * 26) * u, (i === 2 ? 17 : 18) * u, { align: "center", weight: i === 2 ? 800 : 700, color: i === 2 ? "#2E7E9A" : C.ink }));
    text(ctx, opt.jawa ? "Terjemahan: Kelas 10C" : "Sinta · Tim 10A", x + w / 2, y + 384 * u, 15 * u, { align: "center", weight: 700, color: C.ink2 });
    ctx.restore();
    ctx.strokeStyle = "#D7DEE3"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  };
  // foto gunungan wayang kulit (rasio 3:4)
  A.gunungan = function (ctx, x, y, w, h, opt = {}) {
    const u = w / 300; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    const g = ctx.createRadialGradient(x + w / 2, y + h * 0.45, 20 * u, x + w / 2, y + h * 0.45, 260 * u); g.addColorStop(0, "#F7E3B0"); g.addColorStop(1, "#B9864A");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const cx = x + w / 2, top = y + 36 * u, bot = y + 330 * u;
    const leaf = () => { ctx.beginPath(); ctx.moveTo(cx, top); ctx.bezierCurveTo(cx + 70 * u, top + 70 * u, cx + 130 * u, bot - 130 * u, cx + 118 * u, bot - 30 * u);
      ctx.lineTo(cx - 118 * u, bot - 30 * u); ctx.bezierCurveTo(cx - 130 * u, bot - 130 * u, cx - 70 * u, top + 70 * u, cx, top); ctx.closePath(); };
    leaf(); ctx.fillStyle = "#5A2E17"; ctx.fill(); ctx.strokeStyle = "#E0B456"; ctx.lineWidth = 5 * u; ctx.stroke();
    ctx.save(); leaf(); ctx.clip();
    ctx.strokeStyle = "#E0B456"; ctx.lineWidth = 3 * u;
    for (let i = 0; i < 7; i++) { const yy = top + 60 * u + i * 30 * u; ctx.beginPath(); ctx.moveTo(cx, yy); ctx.quadraticCurveTo(cx + 50 * u, yy - 20 * u, cx + 110 * u, yy + 10 * u); ctx.moveTo(cx, yy); ctx.quadraticCurveTo(cx - 50 * u, yy - 20 * u, cx - 110 * u, yy + 10 * u); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx, top + 20 * u); ctx.lineTo(cx, bot - 70 * u); ctx.stroke();
    ctx.fillStyle = "#C23B2A"; rr(ctx, cx - 40 * u, bot - 92 * u, 80 * u, 52 * u, 6 * u); ctx.fill(); ctx.strokeStyle = "#E0B456"; ctx.lineWidth = 3 * u; rr(ctx, cx - 40 * u, bot - 92 * u, 80 * u, 52 * u, 6 * u); ctx.stroke();
    ctx.fillStyle = "#E0B456"; ctx.fillRect(cx - 6 * u, bot - 92 * u, 12 * u, 52 * u);
    ctx.restore();
    ctx.strokeStyle = "#3B2A1E"; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.moveTo(cx, bot - 30 * u); ctx.lineTo(cx, y + h); ctx.stroke();
    ctx.restore(); ctx.strokeStyle = "#D7DEE3"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  };
  // layar pertunjukan wayang malam: kelir putih + bayangan
  A.kelir = function (ctx, x, y, w, h) {
    const u = w / 300; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = "#1E2A33"; ctx.fillRect(x, y, w, h);
    const g = ctx.createRadialGradient(x + w / 2, y + h * 0.4, 10, x + w / 2, y + h * 0.4, 200 * u); g.addColorStop(0, "#FFF6DA"); g.addColorStop(1, "#E8D7A8");
    ctx.fillStyle = g; ctx.fillRect(x + 20 * u, y + 40 * u, w - 40 * u, 250 * u);
    ctx.fillStyle = "rgba(40,30,20,0.85)";
    [[100, 1], [200, -1]].forEach(([px, d]) => { const bx = x + px * u, by = y + 250 * u;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 18 * u * d, by - 80 * u); ctx.lineTo(bx - 4 * u * d, by - 130 * u); ctx.lineTo(bx + 16 * u * d, by - 150 * u); ctx.lineTo(bx + 26 * u * d, by - 120 * u); ctx.lineTo(bx + 18 * u * d, by - 70 * u); ctx.lineTo(bx + 26 * u * d, by); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(40,30,20,0.85)"; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(bx + 10 * u * d, by - 60 * u); ctx.lineTo(bx + 60 * u * d, by - 30 * u); ctx.stroke(); });
    ctx.fillStyle = "#F2B134"; ctx.beginPath(); ctx.arc(x + w / 2, y + 22 * u, 9 * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2F3E48"; ctx.fillRect(x, y + 300 * u, w, h - 300 * u);
    ctx.restore(); ctx.strokeStyle = "#D7DEE3"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  };
  // motif batik kawung
  A.kawung = function (ctx, x, y, w, h) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = "#3A2416"; ctx.fillRect(x, y, w, h);
    const s = w / 4;
    for (let i = -1; i <= 5; i++) for (let j = -1; j <= Math.ceil(h / s) + 1; j++) {
      const cx = x + i * s, cy = y + j * s;
      [[0.5, 0], [-0.5, 0], [0, 0.5], [0, -0.5]].forEach(([dx, dy]) => {
        ctx.fillStyle = "#D9B26A"; ctx.beginPath(); ctx.ellipse(cx + dx * s * 0.5, cy + dy * s * 0.5, s * (dx ? 0.24 : 0.13), s * (dx ? 0.13 : 0.24), 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#7A4A24"; ctx.beginPath(); ctx.arc(cx + dx * s * 0.5, cy + dy * s * 0.5, s * 0.05, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = "#F2E2B8"; ctx.beginPath(); ctx.arc(cx, cy, s * 0.06, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore(); ctx.strokeStyle = "#D7DEE3"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  };
  // wayang golek (kepala boneka kayu bermahkota)
  A.golek = function (ctx, x, y, w, h) {
    const u = w / 300; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = "#2E6E7A"; ctx.fillRect(x, y, w, h); const cx = x + w / 2;
    ctx.fillStyle = "#6B3E1F"; ctx.fillRect(cx - 8 * u, y + 250 * u, 16 * u, h); // tangkai
    ctx.fillStyle = "#B8342A"; ctx.beginPath(); ctx.moveTo(cx - 90 * u, y + h); ctx.quadraticCurveTo(cx, y + 230 * u, cx + 90 * u, y + h); ctx.fill(); // baju
    ctx.fillStyle = "#E0B456"; ctx.fillRect(cx - 70 * u, y + 300 * u, 140 * u, 14 * u);
    ctx.fillStyle = "#C9773D"; ctx.beginPath(); ctx.ellipse(cx, y + 190 * u, 58 * u, 72 * u, 0, 0, Math.PI * 2); ctx.fill(); // wajah
    ctx.fillStyle = "#E0B456"; ctx.beginPath(); ctx.moveTo(cx - 64 * u, y + 140 * u); ctx.lineTo(cx - 40 * u, y + 60 * u); ctx.lineTo(cx, y + 90 * u); ctx.lineTo(cx + 40 * u, y + 60 * u); ctx.lineTo(cx + 64 * u, y + 140 * u); ctx.closePath(); ctx.fill(); // mahkota
    ctx.fillStyle = "#B8342A"; ctx.beginPath(); ctx.arc(cx, y + 112 * u, 10 * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; [-22, 22].forEach(d => { ctx.beginPath(); ctx.ellipse(cx + d * u, y + 182 * u, 12 * u, 8 * u, 0, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = "#26323B"; [-22, 22].forEach(d => { ctx.beginPath(); ctx.arc(cx + d * u, y + 182 * u, 5 * u, 0, Math.PI * 2); ctx.fill(); });
    ctx.strokeStyle = "#7A3A1A"; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.arc(cx, y + 222 * u, 20 * u, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.restore(); ctx.strokeStyle = "#D7DEE3"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  };
  A.art = function (ctx, kind, x, y, w, h, opt) {
    if (kind === "golek") return A.golek(ctx, x, y, w, h);
    if (kind === "poster") A.poster(ctx, x, y, w, h, opt); else if (kind === "gunungan") A.gunungan(ctx, x, y, w, h, opt);
    else if (kind === "kelir") A.kelir(ctx, x, y, w, h); else if (kind === "kawung") A.kawung(ctx, x, y, w, h);
  };

  // ---------- data karya ----------
  A.WORKS = {
    sinta: { art: "poster", title: "Poster Dolanan Cublak-cublak Suweng", by: "Sinta, Tim 10A", date: "12 Okt 2026", up: "4 Nov 2026", id: 3051,
      desc: "Poster ajakan bermain dolanan Cublak-cublak Suweng. Lirik dan aturan main dari Nenek Sumi, direkam Tim 10A.",
      tags: ["dolanan", "permainan tradisional", "lagu anak", "budaya Jawa"], lic: "CC BY-SA" },
    gunungan: { art: "gunungan", title: "Gunungan Wayang Kulit", by: "Raka Pratama", date: "3 Agu 2026", up: "5 Agu 2026", id: 2187,
      desc: "Foto gunungan wayang kulit koleksi sanggar di kampung kami, diambil dengan cahaya lampu blencong.",
      tags: ["wayang", "gunungan", "kriya"], lic: "CC BY" },
    kelir: { art: "kelir", title: "Pertunjukan Wayang Semalam", by: "Tim 11B", date: "17 Agu 2026", id: 2240, tags: ["wayang", "pertunjukan"], lic: "CC BY-NC" },
    golek: { art: "golek", title: "Wayang Golek Cepot", by: "Sanggar Giri Asih", date: "9 Sep 2026", id: 2311, tags: ["wayang", "golek"], lic: "CC BY-SA" },
    poster2: { art: "poster", title: "Poster Dolanan Cublak-cublak Suweng", by: "Sinta, Tim 10A", date: "12 Okt 2026", id: 3051, tags: ["dolanan"], lic: "CC BY-SA" },
    kawung: { art: "kawung", title: "Motif Batik Kawung", by: "Galeri Wastra Rumah", date: "2 Jun 2026", up: "2 Jun 2026", id: 1904,
      desc: "Foto kain batik tulis motif kawung dari koleksi galeri kami.", tags: ["batik", "kawung", "wastra"], lic: "©" }
  };
  A.attr = k => { const w = A.WORKS[k]; return `${w.title} · ${w.by} · arsipkarya.example/karya/${w.id} · ${w.lic}`; };

  // ---------- kerangka situs ----------
  // st.user ("Sinta"), st.query, st.focus (kotak cari), st.caret, st.hot ("upload" | "search"), st.press (0..1 pada tombol Upload karya)
  A.site = function (ctx, area, st = {}) {
    const x = area.x, y = area.y, w = area.w, geo = {};
    ctx.fillStyle = A.SITE; ctx.fillRect(x, y, w, 64);
    ctx.fillStyle = "#F2B134"; rr(ctx, x + 30, y + 16, 32, 32, 8); ctx.fill(); ctx.fillStyle = A.SITE; ctx.fillRect(x + 38, y + 24, 16, 6); ctx.fillRect(x + 38, y + 34, 16, 6);
    text(ctx, "Arsip Karya", x + 74, y + 42, 26, { weight: 900, color: "#FFFFFF" });
    const sx = x + 300, sw = 480; ctx.fillStyle = "#FFFFFF"; rr(ctx, sx, y + 12, sw, 40, 20); ctx.fill();
    if (st.focus) { ctx.strokeStyle = "#8FD0E6"; ctx.lineWidth = 3; rr(ctx, sx, y + 12, sw, 40, 20); ctx.stroke(); }
    W.icon(ctx, "search", sx + 26, y + 32, 20, UI.ink2);
    const q = st.query || ""; if (q) text(ctx, q, sx + 48, y + 40, 21, { weight: 600, color: UI.ink }); else text(ctx, "Cari karya, pembuat, kata kunci…", sx + 48, y + 40, 20, { weight: 500, color: UI.ink3 });
    if (st.focus && st.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(sx + 50 + (q ? meas(ctx, q, 21) : 0), y + 20, 2.5, 24); }
    geo.search = { x: sx, y: y + 12, w: sw, h: 40, cx: sx + sw / 2, cy: y + 32, end: sx + 50 + (q ? meas(ctx, q, 21) : 0) };
    text(ctx, "Jelajahi", x + w - 380, y + 40, 20, { weight: 700, color: "#DCEBEF" });
    const bx = x + w - 250, bw = 170; const p = st.press > 0 && st.press < 1 ? Math.sin(st.press * Math.PI) : 0;
    ctx.fillStyle = st.hot === "upload" ? "#FFD36B" : "#F2B134"; rr(ctx, bx, y + 12 + p * 2, bw, 40, 10); ctx.fill();
    text(ctx, "⬆ Upload karya", bx + bw / 2, y + 39 + p * 2, 20, { align: "center", weight: 900, color: "#3A2A0A" });
    geo.upload = { x: bx, y: y + 12, w: bw, h: 40, cx: bx + bw / 2, cy: y + 32 };
    const ax = x + w - 46; ctx.fillStyle = st.user === "Dito" ? "#2E9E5B" : "#7A5AA6"; ctx.beginPath(); ctx.arc(ax, y + 32, 20, 0, Math.PI * 2); ctx.fill();
    text(ctx, (st.user || "Sinta")[0], ax, y + 40, 21, { align: "center", weight: 900, color: "#FFFFFF" });
    geo.body = { x, y: y + 64, w, h: area.h - 64 };
    return geo;
  };
  // langkah wizard upload: step 0..2 aktif; tiap langkah sebelum step dicentang
  A.wizard = function (ctx, area, step) {
    const y = area.y + 64; ctx.fillStyle = "#F4F7F9"; ctx.fillRect(area.x, y, area.w, 58);
    ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(area.x, y + 58); ctx.lineTo(area.x + area.w, y + 58); ctx.stroke();
    text(ctx, "Upload karya", area.x + 40, y + 38, 24, { weight: 900, color: UI.ink });
    ["File", "Metadata", "Lisensi"].forEach((s, i) => {
      const cx = area.x + 420 + i * 260, on = i === Math.floor(step), done = i < Math.floor(step);
      if (i) { ctx.strokeStyle = done || on ? GREEN : "#C9D4DB"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 200, y + 29); ctx.lineTo(cx - 30, y + 29); ctx.stroke(); }
      ctx.fillStyle = done ? GREEN : on ? BLUE : "#C9D4DB"; ctx.beginPath(); ctx.arc(cx, y + 29, 17, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), cx, y + 36, 19, { align: "center", weight: 900, color: "#FFFFFF" });
      text(ctx, s, cx + 28, y + 37, 22, { weight: on ? 900 : 700, color: on ? BLUE : done ? UI.ink : UI.ink3 });
    });
    return y + 58;
  };
  // tombol pada halaman situs (warna situs)
  A.btn = (ctx, x, y, w, h, label, opt = {}) => W.button(ctx, x, y, w, h, label, { size: 22, ...opt });

  // kotak upload (langkah 1). st.hot: tombol Pilih file disorot. → {pick}
  A.dropZone = function (ctx, x, y, w, h, st = {}) {
    ctx.fillStyle = st.drag ? "#E7F1FB" : "#FAFCFD"; rr(ctx, x, y, w, h, 18); ctx.fill();
    ctx.strokeStyle = "#9CB3C2"; ctx.lineWidth = 3; ctx.setLineDash([14, 10]); rr(ctx, x, y, w, h, 18); ctx.stroke(); ctx.setLineDash([]);
    const cx = x + w / 2;
    ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, y + 110); ctx.lineTo(cx, y + 50); ctx.moveTo(cx - 24, y + 72); ctx.lineTo(cx, y + 48); ctx.lineTo(cx + 24, y + 72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 50, y + 100); ctx.lineTo(cx - 50, y + 124); ctx.lineTo(cx + 50, y + 124); ctx.lineTo(cx + 50, y + 100); ctx.stroke(); ctx.lineCap = "butt";
    text(ctx, "Drag file ke sini", cx, y + 170, 28, { align: "center", weight: 800, color: UI.ink });
    text(ctx, "atau", cx, y + 206, 20, { align: "center", weight: 600, color: UI.ink3 });
    const pick = A.btn(ctx, cx - 100, y + 224, 200, 52, "Pilih file", { press: st.press });
    if (st.hot) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, cx - 106, y + 218, 212, 64, 14); ctx.stroke(); }
    text(ctx, "Gambar, PDF, audio, atau video · maks. 50 MB", cx, y + h - 22, 19, { align: "center", weight: 600, color: UI.ink3 });
    return { pick };
  };

  // dialog Buka file generik. st.folder (indeks tersorot/terbuka), st.file (indeks terpilih), st.press (tombol Buka)
  A.FOLDERS = ["Dokumen", "Gambar", "Download", "Proyek Budaya"];
  A.FILES = [["poster-cublak-cublak-suweng.png", "poster"], ["rekaman-nenek-sumi.mp3", "audio"], ["foto-latihan-01.jpg", "foto"]];
  A.fileDialog = function (ctx, x, y, st = {}) {
    const w = 820, h = 470, geo = { folder: [], file: [] };
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.3)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.restore();
    ctx.strokeStyle = UI.frame; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 14); ctx.stroke();
    ctx.save(); rr(ctx, x, y, w, h, 14); ctx.clip(); ctx.fillStyle = "#EEF2F5"; ctx.fillRect(x, y, w, 46); ctx.fillStyle = "#F6F8F9"; ctx.fillRect(x, y + 46, 210, h - 46); ctx.restore();
    text(ctx, "Buka file", x + w / 2, y + 31, 21, { align: "center", weight: 800, color: UI.ink });
    A.FOLDERS.forEach((f, i) => { const fy = y + 66 + i * 52, on = st.folder === i;
      if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, x + 10, fy - 4, 190, 44, 8); ctx.fill(); }
      ctx.fillStyle = "#F2B134"; rr(ctx, x + 24, fy + 8, 28, 22, 4); ctx.fill(); ctx.fillRect(x + 24, fy + 4, 12, 6);
      text(ctx, f, x + 62, fy + 27, 20, { weight: on ? 800 : 600, color: on ? BLUE : UI.ink, fit: 136 });
      geo.folder.push({ x: x + 10, y: fy - 4, w: 190, h: 44, cx: x + 100, cy: fy + 18 }); });
    const mx = x + 230;
    text(ctx, st.folder === 3 ? "Proyek Budaya" : "Dokumen", mx, y + 80, 20, { weight: 800, color: UI.ink2 });
    if (st.folder === 3) A.FILES.forEach(([name, kind], i) => { const fx = mx + i * 194, fy = y + 100, on = st.file === i;
      if (on) { ctx.fillStyle = "#DCE9F7"; rr(ctx, fx - 6, fy - 6, 182, 226, 10); ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5; rr(ctx, fx - 6, fy - 6, 182, 226, 10); ctx.stroke(); }
      if (kind === "poster") A.poster(ctx, fx + 30, fy, 110, 147);
      else if (kind === "audio") { ctx.fillStyle = "#E7EEF2"; rr(ctx, fx + 30, fy, 110, 147, 8); ctx.fill(); ctx.strokeStyle = "#5B6B76"; ctx.lineWidth = 4; for (let k = 0; k < 9; k++) { const hh = [20, 46, 30, 64, 38, 54, 24, 40, 16][k]; ctx.beginPath(); ctx.moveTo(fx + 45 + k * 10, fy + 74 - hh / 2); ctx.lineTo(fx + 45 + k * 10, fy + 74 + hh / 2); ctx.stroke(); } }
      else { ctx.fillStyle = "#CFE3D6"; rr(ctx, fx + 30, fy, 110, 147, 8); ctx.fill(); ctx.fillStyle = "#7FB58F"; ctx.beginPath(); ctx.moveTo(fx + 40, fy + 130); ctx.lineTo(fx + 80, fy + 60); ctx.lineTo(fx + 120, fy + 130); ctx.fill(); }
      const parts = name.length > 20 ? [name.slice(0, name.lastIndexOf("-", 19) + 1), name.slice(name.lastIndexOf("-", 19) + 1)] : [name];
      parts.forEach((s, j) => text(ctx, s, fx + 85, fy + 174 + j * 22, 17, { align: "center", weight: on ? 800 : 600, color: on ? BLUE : UI.ink, fit: 176 }));
      geo.file.push({ x: fx, y: fy, w: 170, h: 214, cx: fx + 85, cy: fy + 74 }); });
    const by = y + h - 70; ctx.strokeStyle = UI.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mx - 20, by - 14); ctx.lineTo(x + w, by - 14); ctx.stroke();
    text(ctx, "Nama file:", mx, by + 30, 19, { weight: 700, color: UI.ink2 });
    W.field(ctx, mx + 104, by, 300, { value: st.file != null && st.folder === 3 ? A.FILES[st.file][0] : "", h: 46, size: 17 });
    A.btn(ctx, x + w - 236, by, 100, 46, "Batal", { kind: "secondary", size: 19 });
    geo.open = A.btn(ctx, x + w - 122, by, 100, 46, "Buka", { press: st.press, size: 19, disabled: st.file == null });
    return geo;
  };

  // kolom kata kunci: tags (sudah jadi chip), typing (sedang diketik), focus
  A.tags = function (ctx, x, y, w, tags, opt = {}) {
    text(ctx, "Kata kunci", x, y + 20, 20, { weight: 700, color: UI.ink2 }); const fy = y + 32, h = 56;
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, fy, w, h, 10); ctx.fill(); ctx.strokeStyle = opt.focus ? BLUE : UI.frame; ctx.lineWidth = opt.focus ? 3 : 2; rr(ctx, x, fy, w, h, 10); ctx.stroke();
    let cx = x + 12;
    tags.forEach((t, i) => { const tw = meas(ctx, t, 19, 700) + 46; const a = opt.newest === i ? ease(clamp(opt.pop || 1, 0, 1)) : 1;
      ctx.globalAlpha = a; ctx.fillStyle = "#E3F1F4"; rr(ctx, cx, fy + 10, tw, 36, 18); ctx.fill(); text(ctx, t, cx + 16, fy + 35, 19, { weight: 700, color: A.SITE });
      text(ctx, "×", cx + tw - 20, fy + 35, 20, { align: "center", weight: 700, color: UI.ink3 }); ctx.globalAlpha = 1; cx += tw + 8; });
    const typing = opt.typing || "";
    if (typing) text(ctx, typing, cx + 6, fy + 36, 21, { weight: 600, color: UI.ink });
    else if (!tags.length) text(ctx, "Ketik kata kunci, lalu tekan Enter", cx + 6, fy + 36, 20, { weight: 500, color: UI.ink3 });
    if (opt.focus && opt.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(cx + 8 + (typing ? meas(ctx, typing, 21) : 0), fy + 14, 2.5, 28); }
    return { x, y: fy, w, h, cx: x + w / 2, cy: fy + h / 2 };
  };
  // kotak deskripsi dua sampai tiga baris
  A.textarea = function (ctx, x, y, w, value, opt = {}) {
    text(ctx, "Deskripsi", x, y + 20, 20, { weight: 700, color: UI.ink2 }); const fy = y + 32, h = opt.h || 84;
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, fy, w, h, 10); ctx.fill(); ctx.strokeStyle = opt.focus ? BLUE : UI.frame; ctx.lineWidth = opt.focus ? 3 : 2; rr(ctx, x, fy, w, h, 10); ctx.stroke();
    if (!value) { text(ctx, "Ceritakan isi karya dan sumber bahannya", x + 18, fy + 34, 20, { weight: 500, color: UI.ink3 }); if (opt.focus && opt.caret) { ctx.fillStyle = UI.ink; ctx.fillRect(x + 18, fy + 12, 2.5, 28); } }
    else { const lines = H.wrap(ctx, value, 20, 600, w - 36); lines.slice(0, 3).forEach((ln, i) => text(ctx, ln, x + 18, fy + 30 + i * 26, 20, { weight: 600, color: UI.ink }));
      if (opt.focus && opt.caret) { const last = lines[Math.min(2, lines.length - 1)]; ctx.fillStyle = UI.ink; ctx.fillRect(x + 20 + meas(ctx, last, 20), fy + 10 + Math.min(2, lines.length - 1) * 26, 2.5, 26); } }
    return { x, y: fy, w, h, cx: x + w / 2, cy: fy + h / 2 };
  };
  // kalender kecil Oktober 2026 (1 Okt 2026 = Kamis). hi: tanggal disorot, sel: terpilih
  A.calendar = function (ctx, x, y, opt = {}) {
    const w = 360, h = 300; ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.25)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.restore();
    ctx.strokeStyle = UI.frame; ctx.lineWidth = 1.5; rr(ctx, x, y, w, h, 12); ctx.stroke();
    text(ctx, "‹", x + 26, y + 38, 26, { align: "center", weight: 800, color: UI.ink2 }); text(ctx, "›", x + w - 26, y + 38, 26, { align: "center", weight: 800, color: UI.ink2 });
    text(ctx, "Oktober 2026", x + w / 2, y + 38, 21, { align: "center", weight: 800, color: UI.ink });
    ["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"].forEach((d, i) => text(ctx, d, x + 30 + i * 50, y + 74, 16, { align: "center", weight: 800, color: UI.ink3 }));
    const geo = {};
    for (let d = 1; d <= 31; d++) { const k = d + 2, c = k % 7, r = Math.floor(k / 7), cx = x + 30 + c * 50, cy = y + 102 + r * 38;
      if (opt.sel === d || opt.hi === d) { ctx.fillStyle = opt.sel === d ? BLUE : "#DCE9F7"; ctx.beginPath(); ctx.arc(cx, cy - 6, 17, 0, Math.PI * 2); ctx.fill(); }
      text(ctx, String(d), cx, cy, 17, { align: "center", weight: 700, color: opt.sel === d ? "#FFFFFF" : UI.ink }); geo[d] = { x: cx, y: cy - 6 }; }
    return geo;
  };

  // kartu pilihan lisensi (langkah 3). st.sel (kode terpilih), st.hi (kode disorot), → {card(code)}
  A.licList = function (ctx, x, y, w, st = {}) {
    text(ctx, "Pilih lisensi", x, y + 22, 22, { weight: 800, color: UI.ink }); const geo = {};
    A.LIC_ORDER.forEach((code, i) => { const cy = y + 38 + i * 84, on = st.sel === code, hi = st.hi === code, L0 = A.LIC[code];
      ctx.fillStyle = on ? "#E7F1FB" : hi ? "#FFF7E3" : "#FFFFFF"; rr(ctx, x, cy, w, 74, 12); ctx.fill();
      ctx.strokeStyle = on ? BLUE : hi ? C.accent : UI.frame; ctx.lineWidth = on || hi ? 3.5 : 2; rr(ctx, x, cy, w, 74, 12); ctx.stroke();
      W.radio(ctx, x + 20, cy + 25, "", on ? 1 : 0);
      const bw = A.badge(ctx, x + 62, cy + 10, code, { size: 17 });
      text(ctx, code === "©" ? "" : L0.title, x + 62 + bw + 12, cy + 33, 19, { weight: 800, color: UI.ink });
      text(ctx, L0.desc, x + 62, cy + 63, 17, { weight: 600, color: UI.ink2, fit: w - 80 });
      geo[code] = { x, y: cy, w, h: 74, cx: x + 32, cy: cy + 37 }; });
    return geo;
  };

  // halaman karya. st.mark: kunci bagian yang disorot ("title" | "by" | "date" | "tags" | "lic" | "dl"), st.press: {dl, attr}, st.copied, st.banner
  A.workPage = function (ctx, area, key, st = {}) {
    const wk = A.WORKS[key]; const g = A.site(ctx, area, { user: st.user, query: st.query });
    const b = g.body, geo = {}; let y0 = b.y + 18;
    if (st.banner) { W.banner(ctx, b.x + 40, y0, b.w - 80, st.banner, "good"); y0 += 66; }
    const ih = Math.min(b.y + b.h - 22 - y0, 470), iw = Math.round(ih * 0.75), ix = b.x + 40;
    A.art(ctx, wk.art, ix, y0, iw, ih); geo.img = { x: ix, y: y0, w: iw, h: ih };
    const rx = ix + iw + 40, rw = b.x + b.w - 40 - rx; let y = y0 + 34;
    const mk = (k, x, yy, w, h) => { if (st.mark === k || (Array.isArray(st.mark) && st.mark.includes(k))) { ctx.fillStyle = "rgba(242,177,52,0.28)"; rr(ctx, x - 8, yy, w + 16, h, 8); ctx.fill(); } };
    ctx.font = F(900, 32); const tl = H.wrap(ctx, wk.title, 32, 900, rw); mk("title", rx, y - 32, Math.min(rw, Math.max(...tl.map(s => meas(ctx, s, 32, 900)))), tl.length * 40 + 6);
    tl.forEach((s, i) => text(ctx, s, rx, y + i * 40, 32, { weight: 900, color: UI.ink })); y += tl.length * 40 + 4;
    const byS = "oleh " + wk.by; mk("by", rx, y - 22, meas(ctx, byS, 22, 700), 32); text(ctx, byS, rx, y + 2, 22, { weight: 700, color: A.SITE }); y += 36;
    const dS = "Dibuat " + wk.date + (wk.up ? " · Di-upload " + wk.up : ""); mk("date", rx, y - 20, meas(ctx, dS, 19, 600), 30); text(ctx, dS, rx, y, 19, { weight: 600, color: UI.ink3 }); y += 34;
    if (wk.desc) { y += W.rich(ctx, wk.desc, rx, y + 6, 20, rw, { lh: 1.35, color: UI.ink2, lines: 2 }) + 6; }
    let cx = rx; const ty = y; wk.tags.forEach(t => { const tw = meas(ctx, t, 18, 700) + 28; ctx.fillStyle = "#E3F1F4"; rr(ctx, cx, y, tw, 32, 16); ctx.fill(); text(ctx, t, cx + 14, y + 22, 18, { weight: 700, color: A.SITE }); cx += tw + 8; });
    mk("tags", rx, ty - 4, cx - rx, 40); y += 50;
    // kotak lisensi
    const L0 = A.LIC[wk.lic], all = wk.lic === "©";
    const lh = 118; ctx.fillStyle = all ? "#FBE9E7" : "#F1F6F8"; rr(ctx, rx, y, rw, lh, 12); ctx.fill();
    ctx.strokeStyle = st.mark === "lic" ? C.accent : all ? "#E2B4AE" : "#CFDDE3"; ctx.lineWidth = st.mark === "lic" ? 5 : 2; rr(ctx, rx, y, rw, lh, 12); ctx.stroke();
    text(ctx, "LISENSI", rx + 20, y + 32, 17, { weight: 900, color: UI.ink3 }); const bw = A.badge(ctx, rx + 100, y + 12, wk.lic, { size: 19 });
    if (!all) text(ctx, L0.title, rx + 112 + bw, y + 36, 19, { weight: 800, color: UI.ink, fit: rw - 130 - bw });
    W.rich(ctx, L0.desc, rx + 20, y + 76, 19, rw - 40, { lh: 1.3, color: UI.ink, lines: 2 });
    geo.lic = { x: rx, y, w: rw, h: lh, cx: rx + rw / 2, cy: y + lh / 2 }; y += lh + 20;
    const pr = st.press || {};
    geo.dl = A.btn(ctx, rx, y, 250, 52, st.free ? "⬇ Download gratis" : "⬇ Download", { press: pr.dl });
    if (st.mark === "dl") { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, rx - 6, y - 6, 262, 64, 14); ctx.stroke(); }
    geo.attr = A.btn(ctx, rx + 266, y, 230, 52, st.copied ? "✓ Disalin" : "Salin atribusi", { kind: st.copied ? "good" : "secondary", press: pr.attr });
    if (st.mark === "attr") { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, rx + 260, y - 6, 242, 64, 14); ctx.stroke(); }
    geo.bottom = y + 52; geo.site = g;
    return geo;
  };
  // kisi hasil pencarian
  A.results = function (ctx, area, keys, st = {}) {
    const g = A.site(ctx, area, { user: "Dito", query: st.query, focus: st.focus, caret: st.caret }); const b = g.body;
    text(ctx, `${keys.length} karya untuk "${st.query}"`, b.x + 40, b.y + 46, 22, { weight: 800, color: UI.ink2 });
    const geo = { card: [] };
    keys.forEach((k, i) => { const wk = A.WORKS[k], cx = b.x + 40 + i * 410, cy = b.y + 70, cw = 380; const a = st.alpha == null ? 1 : st.alpha;
      ctx.globalAlpha = a;
      ctx.fillStyle = "#FFFFFF"; rr(ctx, cx, cy, cw, 440, 14); ctx.fill(); ctx.strokeStyle = st.hi === i ? C.accent : UI.line; ctx.lineWidth = st.hi === i ? 4 : 2; rr(ctx, cx, cy, cw, 440, 14); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.rect(cx + 2, cy + 2, cw - 4, 300); ctx.clip(); ctx.fillStyle = "#EEF2F5"; ctx.fillRect(cx, cy, cw, 300); A.art(ctx, wk.art, cx + cw / 2 - 112, cy + 2, 225, 300); ctx.restore();
      text(ctx, wk.title, cx + 18, cy + 340, 22, { weight: 800, color: UI.ink, fit: cw - 36 });
      text(ctx, "oleh " + wk.by, cx + 18, cy + 372, 19, { weight: 600, color: UI.ink2 });
      A.badge(ctx, cx + 18, cy + 390, wk.lic, { size: 16 });
      ctx.globalAlpha = 1;
      geo.card.push({ x: cx, y: cy, w: cw, h: 440, cx: cx + cw / 2, cy: cy + 150 }); });
    geo.site = g; return geo;
  };

  // aplikasi Slide generik dengan satu slide: judul, poin, foto, keterangan. st.caption (teks atribusi), st.typed (0..1), st.capMark, st.noCaption
  A.slideApp = function (ctx, x, y, w, h, st = {}) {
    const a = L.window(ctx, x, y, w, h, { title: "Slide — Presentasi Wayang", menus: ["File", "Edit", "Tampilan", "Sisipkan", "Format"] });
    ctx.fillStyle = "#E6EBEE"; ctx.fillRect(a.x + 2, a.y, a.w - 4, a.h - 14);
    // thumbnail kiri
    for (let i = 0; i < 3; i++) { const ty = a.y + 20 + i * 104; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(a.x + 20, ty, 150, 84); ctx.strokeStyle = i === 1 ? BLUE : "#C9D4DB"; ctx.lineWidth = i === 1 ? 3 : 1.5; ctx.strokeRect(a.x + 20, ty, 150, 84);
      text(ctx, String(i + 1), a.x + 10, ty + 18, 14, { align: "center", weight: 700, color: UI.ink3 }); ctx.fillStyle = "#DCE3E8"; ctx.fillRect(a.x + 32, ty + 14, 80, 8); ctx.fillRect(a.x + 32, ty + 32, 60, 6); }
    const sx = a.x + 200, sy = a.y + 18, sw = a.w - 230, sh = Math.min(a.h - 40, sw * 9 / 16);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(sx, sy, sw, sh); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; ctx.strokeRect(sx, sy, sw, sh);
    text(ctx, "Gunungan dalam Wayang Kulit", sx + 50, sy + 70, 38, { weight: 900, color: UI.ink });
    ["Muncul di awal dan akhir pertunjukan.", "Menandai pergantian adegan.", "Melambangkan alam semesta."].forEach((s, i) => {
      ctx.fillStyle = A.SITE; ctx.beginPath(); ctx.arc(sx + 62, sy + 142 + i * 56, 7, 0, Math.PI * 2); ctx.fill(); text(ctx, s, sx + 82, sy + 150 + i * 56, 25, { weight: 600, color: UI.ink, fit: sw * 0.5 }); });
    const iw = 220, ih = 293, ix = sx + sw - iw - 140, iy = sy + 104;
    A.gunungan(ctx, ix, iy, iw, ih); const geo = { img: { x: ix, y: iy, w: iw, h: ih }, slide: { x: sx, y: sy, w: sw, h: sh } };
    if (st.caption) { const s = W.typed(st.caption, st.typed == null ? 1 : st.typed); const cw = 470, ccx = ix + iw / 2;
      ctx.font = F(600, 19); const lines = H.wrap(ctx, s, 19, 600, cw);
      if (st.capMark) { ctx.fillStyle = "rgba(46,158,91,0.16)"; rr(ctx, ccx - cw / 2 - 10, iy + ih + 8, cw + 20, 2 * 25 + 14, 8); ctx.fill(); }
      lines.forEach((ln, i) => text(ctx, ln, ccx, iy + ih + 32 + i * 25, 19, { align: "center", weight: 600, color: UI.ink2 })); }
    geo.capY = iy + ih + 20;
    return geo;
  };

  // panel langkah (seperti S09): judul + daftar langkah, langkah ke-n sedang dikerjakan
  A.steps = function (ctx, x, y, w, title, items, n) {
    let hh = 70; const rows = items.map(s => H.wrap(ctx, s, 23, 700, w - 86)); rows.forEach(lines => hh += lines.length * 30 + 22);
    H.card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 });
    text(ctx, title, x + 24, y + 44, 24, { weight: 900, color: C.accentDark });
    let yy = y + 74;
    rows.forEach((lines, i) => { const done = i < n, now = i === n;
      if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, yy - 8, w - 20, lines.length * 30 + 16, 10); ctx.fill(); }
      ctx.fillStyle = done ? GREEN : now ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(x + 36, yy + 13, 14, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 36, yy + 21, 18, { align: "center", weight: 900, color: "#FFFFFF" });
      lines.forEach((ln, j) => text(ctx, ln, x + 62, yy + 22 + j * 30, 23, { weight: 700, color: done ? C.ink2 : C.ink }));
      yy += lines.length * 30 + 22; });
    return y + hh;
  };
  // aturan lisensi ✓/✗: Dipakai, Diubah, Dijual
  A.rules = function (ctx, x, y, w, code, opt = {}) {
    const r = A.LIC[code].rules, labels = ["Dipakai", "Diubah", "Dijual"];
    labels.forEach((s, i) => { const yy = y + i * 50, ok = r[i]; ctx.fillStyle = ok ? C.goodBg : "#FBE1DF"; rr(ctx, x, yy, w, 42, 10); ctx.fill();
      text(ctx, ok ? "✓" : "✗", x + 24, yy + 31, 26, { align: "center", weight: 900, color: ok ? GREEN : RED }); text(ctx, s, x + 50, yy + 30, 22, { weight: 800, color: C.ink }); });
    return y + 150;
  };

  K.arsip = A;
})(typeof window !== "undefined" ? window : globalThis);
