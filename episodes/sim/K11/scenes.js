/* K11 Simulasi konsep: melindungi HP dari aplikasi berbahaya (versi pertahanan, menyambung D9.3).
   Empat variasi: senter minta kontak (tolak), file APK dari nomor tak dikenal (batal), peta dari toko resmi minta lokasi
   (izinkan saat dipakai), pembaruan sistem yang tertunda (pasang). Penutup: mencabut izin di Pengaturan.
   Hanya sisi pertahanan: tidak memperagakan cara kerja program jahat. Semua aplikasi, nomor, dan pesan rekaan.
   Kunci beat: v (variasi 1–4), step (1|2), pilih (pilihan tebakan), cues (awal tiap langkah, potongan teks narasi). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, HP = K.hp;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const GREEN = "#2E9E5B", RED = "#D9443B", BLUE = "#1A73C8";

  // ---------- waktu ----------
  const A = b => b.audio || b.dur;
  const lead = b => (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const at = (b, s) => { const i = b.text.indexOf(s); return lead(b) + Math.max(0, i) / b.text.length * A(b); };
  function cues(b, n, def) {
    if (b.cues && b.cues.length >= n && b.cues.every(c => b.text.indexOf(c) >= 0)) return b.cues.slice(0, n).map(c => at(b, c));
    const fr = def || []; return Array.from({ length: n }, (_, i) => lead(b) + (fr[i] != null ? fr[i] : 0.15 + 0.7 * i / n) * A(b));
  }
  const stepN = (l, c) => c.filter(t => l >= t).length;

  // ---------- pembantu gambar ----------
  const heading = (ctx, s, y = 205) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 900, fit: 1600 });
  const headR = (ctx, s, y = 205) => text(ctx, s, 1210, y, 32, { align: "center", color: C.accentDark, weight: 900, fit: 1060 });
  const chip = (ctx, s, cx, cy, opt = {}) => { const sz = opt.size || 22; ctx.font = `900 ${sz}px Inter`; const w = opt.w || ctx.measureText(s).width + 32, h = opt.h || sz + 18; card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: opt.fill || C.goodBg, stroke: opt.stroke, lw: 3, r: h / 2 }); text(ctx, s, cx, cy + sz * 0.36, sz, { align: "center", weight: 900, color: opt.color || GREEN }); return w; };
  function thinking(ctx, x, y, l, dur) {
    const frac = clamp(l / Math.max(1, dur), 0, 1); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    text(ctx, "?", x, y + 14, 40, { align: "center", weight: 900, color: C.accentDark });
  }
  function mark(ctx, x, y, ok, r = 22) { ctx.fillStyle = ok ? GREEN : RED; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ok ? "check" : "close", x, y, r * 0.95, "#FFFFFF"); }
  // kartu pelajaran: ikon garis + teks besar
  function lesson(ctx, x, y, w, h, icon, s, tone, u = 1) {
    const col = tone === "good" ? GREEN : tone === "bad" ? RED : C.accentDark, bg = tone === "good" ? C.goodBg : tone === "bad" ? C.badBg : "#FFF3D6";
    ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); ctx.translate(0, (1 - ease(clamp(u, 0, 1))) * 24);
    card(ctx, x, y, w, h, { fill: bg, stroke: col, lw: 4, r: 18 });
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + 62, y + h / 2, 36, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, icon, x + 62, y + h / 2, 40, col);
    para(ctx, s, x + 122, y + h / 2 + 11 - (H.wrap(ctx, s, 31, 900, w - 150).length - 1) * 19, 31, w - 150, { weight: 900, color: col, lh: 1.2 });
    ctx.restore();
  }
  const fade = (l, t, d = 0.45) => clamp((l - t) / d, 0, 1);
  let MC = null;
  function measure(fn) { if (!MC) MC = document.createElement("canvas"); MC.width = 400; MC.height = 800; const m = MC.getContext("2d"); m.save(); const r = fn(m); m.restore(); return r; }

  // ---------- aplikasi dan layar rekaan (satuan lokal HP: 360 × 740) ----------
  const SENTER = { name: "Senter Terang", color: "#E0A23B", icon: "flashlight" }, PETA = { name: "Peta Angkot", color: GREEN, icon: "map" };
  function senterScreen(c, on) {
    c.fillStyle = "#1B232B"; c.fillRect(0, 36, HP.W, 680);
    text(c, SENTER.name, 180, 100, 22, { align: "center", weight: 800, color: "#FFFFFF" });
    if (on > 0) { const g = c.createRadialGradient(180, 380, 20, 180, 380, 230); g.addColorStop(0, `rgba(255,226,140,${0.75 * on})`); g.addColorStop(1, "rgba(255,226,140,0)"); c.fillStyle = g; c.fillRect(0, 120, HP.W, 520); }
    c.fillStyle = on > 0.5 ? "#FFD95A" : "#3A4954"; c.beginPath(); c.arc(180, 380, 86, 0, Math.PI * 2); c.fill();
    HP.icon(c, "flashlight", 180, 380, 70, on > 0.5 ? "#7A4E00" : "#C9D4DB");
    text(c, on > 0.5 ? "Menyala" : "Ketuk untuk menyalakan", 180, 520, 20, { align: "center", weight: 700, color: on > 0.5 ? "#FFD95A" : "#B7C4CC" });
  }
  const CHAT = { name: "+62 812-0000-0917", sub: "bukan kontak", color: "#7B8B95",
    messages: [{ from: "them", text: "Halo! Kamu diundang ke acara kami. Buka undangannya, ya.", time: "19.02" }, { from: "them", text: "📎 undangan.apk (6 MB)", time: "19.02" }] };
  const chatScreen = (c, warn) => HP.chat(c, { ...CHAT, warn: warn ? 1 : undefined, size: 19, maxW: 270 });
  function mapScreen(c, route, closed) {
    c.fillStyle = "#EAF2EA"; c.fillRect(0, 36, HP.W, 680);
    c.strokeStyle = "#FFFFFF"; c.lineWidth = 14; [[0, 210, 360, 250], [0, 430, 360, 400], [0, 600, 360, 640], [90, 36, 120, 716], [250, 36, 230, 716]].forEach(([a, b2, d, e]) => { c.beginPath(); c.moveTo(a, b2); c.lineTo(d, e); c.stroke(); });
    c.fillStyle = "#CFE3CF"; rr(c, 140, 270, 70, 110, 10); c.fill(); rr(c, 260, 450, 80, 120, 10); c.fill();
    c.fillStyle = "#FFFFFF"; c.fillRect(0, 36, HP.W, 60); text(c, PETA.name, 24, 74, 22, { weight: 800, color: C.ink });
    if (route > 0) {
      const pts = [[110, 600], [100, 420], [240, 404], [234, 250]], n = route * (pts.length - 1);
      c.strokeStyle = BLUE; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(...pts[0]);
      for (let i = 1; i <= Math.ceil(n); i++) { const f = Math.min(1, n - (i - 1)); c.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); }
      c.stroke(); c.lineCap = "butt";
      [[100, 420, "Halte"], [234, 250, "Sekolah"]].forEach(([x, y, s], i) => { if (route < (i ? 0.95 : 0.4)) return; c.fillStyle = i ? "#E07B2E" : BLUE; rr(c, x - 38, y - 44, 76, 28, 8); c.fill(); text(c, s, x, y - 24, 14, { align: "center", weight: 800, color: "#FFFFFF" }); });
      c.fillStyle = BLUE; c.beginPath(); c.arc(110, 600, 13, 0, Math.PI * 2); c.fill(); c.strokeStyle = "#FFFFFF"; c.lineWidth = 4; c.stroke();
    }
    if (closed) { c.fillStyle = "rgba(15,22,28,0.55)"; c.fillRect(0, 36, HP.W, 680); HP.icon(c, "location", 180, 330, 70, "#FFFFFF"); text(c, "Aplikasi ditutup:", 180, 420, 21, { align: "center", weight: 800, color: "#FFFFFF" }); text(c, "lokasi tidak dipakai", 180, 450, 21, { align: "center", weight: 800, color: "#FFFFFF" }); }
  }
  // pembaruan sistem: st.u "ada" | "unduh" (p) | "restart" | "baru"
  function updateScreen(c, st = {}) {
    if (st.u === "restart") { c.fillStyle = "#11181D"; c.fillRect(0, 36, HP.W, 680); HP.spinner(c, 180, 360, 30, st.t || 0); text(c, "Memulai ulang…", 180, 430, 22, { align: "center", weight: 700, color: "#FFFFFF" }); return {}; }
    HP.header(c, "Pembaruan sistem", { back: true });
    const ok = st.u === "baru";
    c.fillStyle = ok ? C.goodBg : "#E3EEFA"; c.beginPath(); c.arc(180, 200, 52, 0, Math.PI * 2); c.fill(); HP.icon(c, ok ? "check" : "update", 180, 200, 56, ok ? GREEN : BLUE);
    text(c, ok ? "Sistem sudah terbaru" : "Pembaruan tersedia", 180, 296, 24, { align: "center", weight: 800, color: C.ink });
    text(c, ok ? "Pembaruan keamanan: November" : "Ditunda sejak 3 bulan lalu", 180, 328, 17, { align: "center", weight: 600, color: ok ? C.ink2 : RED });
    if (!ok) { [["battery", st.charged ? "Baterai 100%" : "Baterai 35%"], ["wifi", st.wifi ? "Wi-Fi rumah tersambung" : "Belum tersambung Wi-Fi"]].forEach(([ic, s], i) => { const on = i ? st.wifi : st.charged; HP.icon(c, ic, 60, 392 + i * 44, 22, on ? GREEN : "#8A99A3"); text(c, s, 86, 399 + i * 44, 18, { weight: 700, color: on ? GREEN : C.ink2 }); }); }
    let btn = null;
    if (st.u === "unduh") { HP.progress(c, 40, 500, 280, st.p || 0, { color: BLUE }); text(c, "Memasang… " + Math.round((st.p || 0) * 100) + "%", 180, 545, 18, { align: "center", weight: 700, color: C.ink2 }); }
    else if (!ok) btn = HP.button(c, 40, 560, 280, 56, "Download dan pasang", { fill: BLUE, ink: "#FFFFFF", hl: st.hl, size: 19 });
    if (ok) { text(c, "Foto dan file tetap ada", 180, 400, 18, { align: "center", weight: 700, color: GREEN }); HP.icon(c, "photo", 180, 450, 40, GREEN); }
    return { btn };
  }
  const PC = { cx: 400, cy: 468, h: 540 };
  const phone = (ctx, draw, opt = {}) => HP.phone(ctx, opt.cx || PC.cx, opt.cy || PC.cy, { h: opt.h || PC.h, ...opt }, draw);

  // keadaan layar tiap variasi. k = langkah tercapai (0..4), l dan c untuk animasi tap
  function screen(v, k, l, c) {
    const tapU = (i, pre = 0.6) => (c && l >= c[i] - pre && l < c[i] + 0.3) ? clamp((l - c[i] + pre) / (pre + 0.3), 0, 1) : -1;
    return cx => {
      if (v === 1) {
        senterScreen(cx, k >= 4 ? clamp((l - c[3]) / 0.4, 0, 1) : 0);
        if (k < 3) { const r = HP.permission(cx, { app: SENTER.name, perm: "kontak", color: SENTER.color, hl: k >= 2 ? 2 : null }); const u = tapU(2); if (u >= 0 && r.buttons[2]) HP.tap(cx, r.buttons[2].cx, r.buttons[2].cy, u); }
      } else if (v === 2) {
        const bubbles = chatScreen(cx, true);
        const u0 = c ? tapU(0) : -1; if (u0 >= 0 && bubbles && bubbles[1]) HP.tap(cx, bubbles[1].x + bubbles[1].w / 2, bubbles[1].y + bubbles[1].h / 2, u0);
        if (k >= 1 && k < 3) { const r = HP.dialog(cx, { icon: "warning", iconColor: RED, title: "File ini memasang aplikasi", body: "Sumber tidak dikenal. Pemasangan diblokir untuk melindungi HP-mu.", buttons: ["Batal"], stack: true, hl: k >= 2 ? 0 : null, u: fade(l, c[0], 0.35) }); const u = tapU(2); if (u >= 0 && r.buttons[0]) HP.tap(cx, r.buttons[0].cx, r.buttons[0].cy, u); }
        if (k >= 4) HP.toast(cx, "Tidak ada aplikasi yang dipasang", 0.5);
      } else if (v === 3) {
        mapScreen(cx, k >= 2 ? (k >= 3 ? 1 : clamp((l - c[1]) / 1.6, 0, 0.55)) : 0, k >= 4);
        if (k < 1 || (k === 1 && l < c[0] + 0.3)) { const r = HP.permission(cx, { app: PETA.name, perm: "lokasi", color: PETA.color, hl: k >= 1 ? 0 : null }); const u = tapU(0); if (u >= 0 && r.buttons[0]) HP.tap(cx, r.buttons[0].cx, r.buttons[0].cy, u); }
      } else {
        if (k >= 3 && k < 4) { updateScreen(cx, { u: "restart", t: l }); return; }
        if (k >= 4) { updateScreen(cx, { u: "baru" }); return; }
        const st = { u: k >= 2 ? "unduh" : "ada", p: k >= 2 ? clamp((l - c[1]) / Math.max(1, c[2] - c[1] - 0.2), 0, 1) : 0, charged: k >= 1, wifi: k >= 1 && l > c[0] + 0.8, hl: k >= 2 };
        const r = updateScreen(cx, st); const u = tapU(1); if (u >= 0 && r.btn) HP.tap(cx, r.btn.cx, r.btn.cy, u);
      }
    };
  }
  const PHONE_OPT = v => (v === 1 ? { bg: "#1B232B", dark: true } : {});
  const HEAD = { 1: "VARIASI 1 · SENTER MINTA AKSES KONTAK", 2: "VARIASI 2 · FILE APK DARI NOMOR TIDAK DIKENAL", 3: "VARIASI 3 · PETA DARI TOKO RESMI MINTA LOKASI", 4: "VARIASI 4 · PEMBARUAN SISTEM YANG TERTUNDA" };
  // dua fakta yang dicocokkan di setiap variasi
  const FAKTA = {
    1: [["flashlight", "Tugas aplikasi", "menyalakan lampu kilat"], ["contacts", "Yang diminta", "akses daftar kontak"]],
    2: [["user", "Pengirim", "nomor tidak dikenal"], ["download", "File", "undangan.apk"]],
    3: [["store", "Sumber", "toko aplikasi resmi"], ["location", "Yang diminta", "lokasi"]],
    4: [["update", "Pembaruan", "sistem dan keamanan"], ["clock", "Ditunda", "tiga bulan"]]
  };
  function facts(ctx, v, x, y, w) {
    FAKTA[v].forEach(([ic, k, s], i) => { const yy = y + i * 128; card(ctx, x, yy, w, 108, { fill: "#FFFFFF", stroke: "#CFDCD5", lw: 3, r: 18 });
      ctx.fillStyle = "#E3EEFA"; ctx.beginPath(); ctx.arc(x + 56, yy + 54, 34, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, x + 56, yy + 54, 36, BLUE);
      text(ctx, k, x + 110, yy + 44, 22, { weight: 800, color: C.ink2 }); text(ctx, s, x + 110, yy + 82, 32, { weight: 900, color: C.ink, fit: w - 130 }); });
  }

  Object.assign(K.SCENES, {
    k11_tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 240, 235, 30, { weight: 900, color: C.accentDark });
      ["menilai izin yang diminta aplikasi", "menolak file aplikasi kiriman", "menjaga HP tetap diperbarui"].forEach((s, i) => {
        const u = ease((l - 0.5 - i * 0.9) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 240, 280 + i * 110, 900, 88, { fill: C.bg2, r: 16 }); text(ctx, "✓", 280, 338 + i * 110, 36, { weight: 900, color: C.good }); text(ctx, s, 330, 336 + i * 110, 30, { weight: 800, fit: 790 }); ctx.globalAlpha = 1;
      });
      phone(ctx, c => { c.fillStyle = "#F4F8FB"; c.fillRect(0, 36, 360, 680); HP.icon(c, "shield", 180, 330, 120, GREEN); text(c, "HP terlindungi", 180, 450, 24, { align: "center", weight: 800, color: GREEN }); }, { cx: 1460, cy: 480, h: 560 });
    },
    k11_prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 620, 400, { fill: C.bg2, r: 22 });
      text(ctx, "D9.3", 570, 390, 64, { align: "center", weight: 900, color: C.kiko });
      para(ctx, "Melindungi Perangkat dari Malware", 570, 460, 36, 540, { align: "center", weight: 800, lh: 1.2 });
      text(ctx, "kelas IX", 570, 650, 26, { align: "center", weight: 700, color: C.ink2 });
      const n = clamp(Math.floor((l - 0.8) / 0.7) + 1, 0, 3);
      [["key", "izin aplikasi", "cocokkan dengan tugasnya"], ["store", "sumber resmi", "pasang dari toko aplikasi"], ["update", "pembaruan", "menambal celah keamanan"]].forEach(([ic, t, e], i) => {
        if (i >= n) return; const y = 300 + i * 130; card(ctx, 960, y, 640, 112, { fill: "#fff", stroke: "#CFDCD5", lw: 3, r: 16 });
        HP.icon(ctx, ic, 1015, y + 56, 40, C.kiko); text(ctx, t, 1065, y + 48, 28, { weight: 900, color: C.kiko, fit: 520 }); text(ctx, e, 1065, y + 86, 24, { weight: 700, color: C.ink2 });
      });
      kiko(ctx, 1680, 760, 90, 0, { wave: l });
    },
    k11_kunci(ctx, b, l) {
      card(ctx, 120, 150, 1680, 670);
      if (b.step !== 2) {
        heading(ctx, "SETIAP IZIN ADALAH KUNCI");
        const c = cues(b, 4);
        HP.appIcon(ctx, 330, 470, 150, "#7B8B95", "apps"); text(ctx, "aplikasi", 330, 590, 28, { align: "center", weight: 900, color: C.ink2 });
        const ku = fade(l, c[0]); if (ku > 0) { ctx.save(); ctx.globalAlpha = ku; ctx.fillStyle = "#FFF3D6"; ctx.beginPath(); ctx.arc(500, 470, 56, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "key", 500, 470, 60, C.accentDark); text(ctx, "izin = kunci", 500, 570, 24, { align: "center", weight: 900, color: C.accentDark }); ctx.restore(); }
        [["camera", "kamera"], ["location", "lokasi"], ["contacts", "daftar kontak"]].forEach(([ic, s], i) => {
          const u = fade(l, c[i + 1]); const x = 760 + i * 330, y = 290;
          ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * u;
          card(ctx, x, y, 270, 360, { fill: u > 0 ? "#FFFFFF" : "#F4F8FB", stroke: u > 0 ? C.kiko : "#C9D4DB", lw: 5, r: 22 });
          ctx.fillStyle = "#E3EEFA"; ctx.beginPath(); ctx.arc(x + 135, y + 120, 66, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, x + 135, y + 120, 72, BLUE);
          text(ctx, "pintu", x + 135, y + 240, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, s, x + 135, y + 285, 32, { align: "center", weight: 900, color: C.ink, fit: 240 });
          ctx.restore();
        });
        if (l > A(b) * 0.85) chip(ctx, "Pintu hanya terbuka kalau kuncinya kamu berikan.", 960, 740, { size: 26, fill: "#FFF3D6", stroke: C.accent, color: C.accentDark });
      } else {
        heading(ctx, "SATU PERTANYAAN SEBELUM MENEKAN IZINKAN");
        const c = cues(b, 3);
        const uq = fade(l, c[0]); ctx.save(); ctx.globalAlpha = Math.max(0.2, uq);
        card(ctx, 460, 250, 1000, 130, { fill: "#FFF3D6", stroke: C.accent, lw: 5, r: 22 });
        text(ctx, "Apakah izin ini cocok dengan", 960, 305, 36, { align: "center", weight: 900, color: C.accentDark }); text(ctx, "tugas aplikasinya?", 960, 352, 36, { align: "center", weight: 900, color: C.accentDark });
        ctx.restore();
        [[1, "COCOK", "izinkan seperlunya", "peta → lokasi", true], [2, "TIDAK COCOK", "tolak", "senter → kontak", false]].forEach(([i, h, s, e, ok]) => {
          const u = fade(l, c[i]); if (u <= 0) return; const x = i === 1 ? 300 : 1000;
          ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = ok ? GREEN : RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(960, 385); ctx.lineTo(x + 310, 455); ctx.stroke();
          card(ctx, x, 460, 620, 280, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? GREEN : RED, lw: 5, r: 22 });
          mark(ctx, x + 70, 530, ok, 30); text(ctx, h, x + 120, 542, 34, { weight: 900, color: ok ? GREEN : RED });
          text(ctx, s, x + 310, 625, 42, { align: "center", weight: 900, color: C.ink }); text(ctx, "contoh: " + e, x + 310, 695, 28, { align: "center", weight: 700, color: C.ink2 });
          ctx.restore();
        });
      }
    },
    k11_tanya(ctx, b, l) {
      const v = b.v; card(ctx, 120, 150, 1680, 670); headR(ctx, HEAD[v]);
      phone(ctx, screen(v, 0, l, null), PHONE_OPT(v));
      text(ctx, v === 2 ? "HP Sinta" : v === 4 ? "HP Sinta" : "HP Dito", PC.cx, 790, 22, { align: "center", weight: 900, color: C.ink2 });
      facts(ctx, v, 680, 250, 700);
      if (!b.pilih) { const Q = { 1: "Apa yang terjadi kalau Dito menekan Jangan izinkan?", 2: "Apa yang terjadi kalau Sinta mengetuk file itu?", 3: "Apa yang terjadi kalau Dito mengizinkannya?", 4: "Apa yang terjadi kalau Sinta memasangnya?" }; text(ctx, Q[v], 1130, 560, 32, { align: "center", weight: 900, color: C.accentDark, fit: 1000 }); kiko(ctx, 1600, 330, 80, 0, {}); }
    },
    k11_tebak(ctx, b, l) {
      K.SCENES.k11_tanya(ctx, b, 0);
      b.pilih.forEach((s, i) => { card(ctx, 680, 520 + i * 92, 1000, 76, { fill: "#fff", stroke: C.kiko, lw: 3, r: 38 }); text(ctx, "ABC"[i] + ". " + s, 1180, 570 + i * 92, 32, { align: "center", weight: 900, color: C.kikoDark, fit: 940 }); });
      thinking(ctx, 1640, 300, l, b.dur);
    },
    k11_jalan(ctx, b, l) {
      const v = b.v, c = cues(b, 4), k = stepN(l, c);
      card(ctx, 120, 150, 1680, 670); headR(ctx, HEAD[v]);
      phone(ctx, screen(v, k, l, c), PHONE_OPT(v));
      text(ctx, v === 2 || v === 4 ? "HP Sinta" : "HP Dito", PC.cx, 790, 22, { align: "center", weight: 900, color: C.ink2 });
      const S = {
        1: [["flashlight", "Tugas senter: lampu kilat saja.", "mid"], ["close", "Izin kontak tidak cocok.", "bad"], ["contacts", "Dito menekan Jangan izinkan.", "mid"], ["check", "Senternya tetap menyala.", "good"]],
        2: [["warning", "HP memberi peringatan.", "bad"], ["download", "File APK = memasang aplikasi.", "mid"], ["close", "Sinta menekan Batal.", "mid"], ["check", "Tidak ada yang terpasang.", "good"]],
        3: [["clock", "Pilih: Saat aplikasi digunakan.", "mid"], ["location", "Peta menunjukkan halte terdekat.", "mid"], ["map", "Rute angkot ke sekolah.", "good"], ["lock", "Ditutup: lokasi tidak dipakai.", "good"]],
        4: [["battery", "Isi baterai, sambung Wi-Fi rumah.", "mid"], ["download", "Pasang pembaruan.", "mid"], ["update", "HP memulai ulang.", "mid"], ["check", "Sistem terbaru, foto tetap ada.", "good"]]
      }[v];
      S.forEach(([ic, s, tone], i) => lesson(ctx, 680, 245 + i * 140, 1060, 118, ic, s, i < k - 1 ? (tone === "mid" ? "done" : tone) : tone, fade(l, c[i])));
    },
    k11_hasil(ctx, b, l) {
      const v = b.v, c = cues(b, 3);
      card(ctx, 120, 150, 1680, 670);
      headR(ctx, { 1: "MENOLAK IZIN YANG TIDAK COCOK", 2: "FILE APK BUKAN UNDANGAN", 3: "IZIN YANG WAJAR", 4: "PEMBARUAN MENAMBAL CELAH" }[v]);
      phone(ctx, screen(v, v === 3 ? 3 : 4, 99, [0, 0, 0, 0]), PHONE_OPT(v));
      const L = {
        1: [["check", "Aplikasinya tidak rusak.", "good"], ["contacts", "Daftar kontak temanmu tetap terjaga.", "good"], ["trash", "Terus memaksa? Hapus aplikasinya.", "bad"]],
        2: [["download", "File APK adalah aplikasi, bukan gambar.", "bad"], ["photo", "Undangan asli: gambar atau PDF.", "good"], ["phone", "Hapus pesannya, tanya pengirim lewat telepon.", "mid"]],
        3: [["map", "Peta memang butuh lokasi: wajar.", "good"], ["shield", "Izin tidak selalu buruk.", "good"], ["clock", "Batasi: hanya saat aplikasi digunakan.", "mid"]],
        4: [["update", "Pembaruan menambal celah yang sudah diketahui.", "good"], ["clock", "Makin lama ditunda, makin lama celah terbuka.", "bad"], ["gear", "Nyalakan pembaruan otomatis.", "mid"]]
      }[v];
      L.forEach(([ic, s, tone], i) => lesson(ctx, 680, 250 + i * 180, 1060, 150, ic, s, tone, fade(l, c[i])));
    },
    k11_banding(ctx, b, l) {
      const c = cues(b, 4);
      card(ctx, 120, 150, 1680, 670); heading(ctx, "EMPAT PERMINTAAN, EMPAT KEPUTUSAN");
      [[0, "KITA TERIMA", true], [1, "KITA TOLAK", false]].forEach(([i, h, ok]) => { const x = 200 + i * 780; card(ctx, x, 250, 740, 530, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? GREEN : RED, lw: 4, r: 22 }); mark(ctx, x + 60, 305, ok, 26); text(ctx, h, x + 104, 318, 34, { weight: 900, color: ok ? GREEN : RED }); });
      const R = [[0, 0, PETA, "Peta minta lokasi", "izinkan saat digunakan"], [0, 1, { color: BLUE, icon: "update" }, "Pembaruan sistem", "pasang, lalu otomatis"],
        [1, 0, SENTER, "Senter minta kontak", "Jangan izinkan"], [1, 1, { color: "#7B8B95", icon: "download" }, "File APK kiriman", "Batal, hapus pesan"]];
      R.forEach(([col, row, app, s, d], i) => { const u = fade(l, c[i]); if (u <= 0) return; const x = 230 + col * 780, y = 360 + row * 200;
        ctx.save(); ctx.globalAlpha = u; card(ctx, x, y, 680, 170, { fill: "#FFFFFF", r: 18 }); HP.appIcon(ctx, x + 80, y + 85, 92, app.color, app.icon);
        text(ctx, s, x + 150, y + 72, 34, { weight: 900, color: C.ink, fit: 510 }); text(ctx, "→ " + d, x + 150, y + 122, 28, { weight: 800, color: col ? RED : GREEN, fit: 510 }); ctx.restore(); });
    },
    k11_cabut(ctx, b, l) {
      const c = cues(b, b.step === 2 ? 3 : 4), k = stepN(l, c), st2 = b.step === 2;
      card(ctx, 120, 150, 1680, 670); headR(ctx, "MENCABUT IZIN DI PENGATURAN");
      // layar: 0 Pengaturan, 1 Aplikasi, 2 info Senter Terang, 3 daftar izin, 4 pilihan izin kontak, 5 daftar izin sesudah dicabut
      const scr = st2 ? (l < c[0] ? 3 : l < c[1] + 0.8 ? 4 : 5) : Math.min(3, Math.max(0, k - 1));
      const ROOT = [{ label: "Wi-Fi dan jaringan", icon: "wifi" }, { label: "Baterai", icon: "battery" }, { label: "Aplikasi", icon: "apps" }, { label: "Privasi", icon: "eye" }, { label: "Keamanan", icon: "shield" }, { label: "Pembaruan sistem", icon: "update" }];
      const APPS = [{ label: "Kamera", app: { color: "#2E7E9A", icon: "camera" } }, { label: "Obrolan", app: { color: "#4C9BE0", icon: "chat" } }, { label: PETA.name, app: PETA }, { label: SENTER.name, app: SENTER }, { label: "Kalkulator", app: { color: "#7B8B95", icon: "calc" } }];
      const INFO = [{ label: "Izin", sub: "Kontak", icon: "key" }, { label: "Notifikasi", icon: "bell" }, { label: "Penyimpanan", icon: "folder" }, { label: "Hapus aplikasi", icon: "trash", danger: true }];
      const perms = done => [{ section: "DIIZINKAN" }, done ? { label: "tidak ada", dim: true } : { label: "Kontak", icon: "contacts", hl: !done && st2 }, { section: "TIDAK DIIZINKAN" }, ...(done ? [{ label: "Kontak", icon: "contacts", hl: true }] : []), { label: "Lokasi", icon: "location" }, { label: "Mikrofon", icon: "mic" }];
      const LISTS = [[ROOT, "Pengaturan", 120, 2], [APPS, "Aplikasi", 120, 3], [INFO, SENTER.name, 120, 0], [perms(false), "Izin", 120, 1]];
      const tapPre = 0.6, tapU = t => (l >= t - tapPre && l < t + 0.25) ? clamp((l - t + tapPre) / (tapPre + 0.25), 0, 1) : -1;
      const draw = cx => {
        if (scr <= 3) {
          const [items, title, y, ti] = LISTS[scr]; HP.header(cx, title, { back: scr > 0 }); const rows = HP.list(cx, items.map((it, i) => ({ ...it, arrow: !it.danger && !it.section })), { y });
          const next = st2 ? c[0] : c[scr + 1]; const u = next != null ? tapU(next) : -1; const r = rows[ti]; if (u >= 0 && r) HP.tap(cx, r.cx, r.cy, u);
        } else if (scr === 4) {
          HP.header(cx, "Akses kontak", { back: true }); text(cx, SENTER.name, 24, 150, 18, { weight: 700, color: C.ink2 });
          const sel = l >= c[1] ? 1 : 0; const rows = HP.list(cx, [{ label: "Izinkan", radio: sel === 0 }, { label: "Jangan izinkan", radio: sel === 1, hl: l >= c[1] - 0.6 }], { y: 170 });
          const u = tapU(c[1]); if (u >= 0 && rows[1]) HP.tap(cx, rows[1].cx, rows[1].cy, u);
        } else { HP.header(cx, "Izin", { back: true }); HP.list(cx, perms(true), { y: 120 }); HP.toast(cx, "Izin kontak dicabut", 0.5); }
      };
      phone(ctx, draw, { cx: 470, cy: 492, h: 600 });
      const items = st2 ? ["Ketuk izin yang tidak masuk akal.", "Pilih Jangan izinkan.", "Di HP lain: Privasi › Pengelola izin."] : ["Buka Pengaturan.", "Pilih Aplikasi.", "Pilih aplikasinya.", "Pilih Izin."];
      const n = st2 ? k : k;
      items.forEach((s, i) => { const done = i < n - 1 || (i === n - 1 && i < items.length - 1 && false), now = i === n - 1; const y = 250 + i * 135;
        ctx.save(); ctx.globalAlpha = i < n ? 1 : 0.3; card(ctx, 780, y, 960, 112, { fill: now ? "#FFF3D6" : i < n ? C.goodBg : "#F4F8FB", stroke: now ? C.accent : i < n ? GREEN : "#C9D4DB", lw: 4, r: 18 });
        ctx.fillStyle = now ? C.accent : i < n ? GREEN : "#B7C4CC"; ctx.beginPath(); ctx.arc(840, y + 56, 30, 0, Math.PI * 2); ctx.fill(); text(ctx, i < n && !now ? "✓" : String(i + 1), 840, y + 68, 32, { align: "center", weight: 900, color: "#FFFFFF" });
        text(ctx, s, 900, y + 68, 36, { weight: 900, color: C.ink, fit: 810 }); ctx.restore(); });
    },
    k11_latihan(ctx, b, l) {
      const a = A(b), t = [a * 0.12, a * 0.3, a * 0.42, a * 0.55];
      const perm = { custom: (ctx, x, y, w) => {
        text(ctx, "Aplikasi senter meminta izin:", x, y + 14, 14, { weight: 900 }); y += 26;
        [["Menyalakan lampu kilat", 0, t[1]], ["Membaca pesan SMS", 1, t[2]], ["Mengakses daftar kontak", 1, t[2] + 0.7]].forEach(([s, ans, tt]) => {
          ctx.strokeStyle = "#D7E2DC"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke(); ctx.setLineDash([]);
          text(ctx, s, x, y + 26, 12.5, { weight: 700, fit: w - 150 });
          ["masuk akal", "tidak"].forEach((lab, j) => { const bx = x + w - 140 + j * 84, bw = j ? 56 : 78, on = l >= tt && j === ans;
            ctx.fillStyle = on ? C.kiko : "#FFFFFF"; rr(ctx, bx, y + 8, bw, 26, 7); ctx.fill(); ctx.strokeStyle = on ? C.kiko : "#C9D4DB"; ctx.lineWidth = 1.5; ctx.stroke();
            text(ctx, lab, bx + bw / 2, y + 26, 11, { align: "center", weight: 800, color: on ? "#FFFFFF" : C.ink }); });
          y += 42; });
        return y + 6; } };
      K.halaman(ctx, 250, 190, 1.15, { url: "belajar-informatika.vercel.app/d93", judul: "Malware: pasangkan, pilah, periksa izin",
        rows: [{ tabs: ["1 Pasangkan", "2 Aman atau bahaya", "3 Periksa izin"], on: 0 },
          { task: "Untuk tiap izin yang diminta aplikasi, tandai masuk akal atau tidak masuk akal, lalu Periksa." },
          perm, { buttons: ["Periksa"], cols: 1, on: -1 }],
        taps: [[0, 2, t[0]], [3, 0, t[3]]] }, l, { h: 535 });
      const n = l < t[0] ? 0 : l < t[1] ? 1 : l < t[3] ? 2 : 3;
      K.halaman.steps(ctx, 840, 170, 880, "DI HALAMAN LATIHAN D9.3", ["Pilih 3 Periksa izin.", "Tandai masuk akal atau tidak.", "Tekan Periksa."], n);
      card(ctx, 840, 540, 880, 230, { fill: "#FFF9E0", r: 18 }); text(ctx, "Tugas nyata", 870, 585, 26, { weight: 900, color: C.accentDark });
      para(ctx, "Bersama orang tuamu, periksa izin aplikasi di HP, lalu cabut izin yang tidak masuk akal.", 870, 630, 28, 820, { weight: 700, lh: 1.3 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
