/* D05 bab 9 — Membuka pintu kembali (b9_1 … b9_5).
   b9_1 gapura terkunci, cahaya pagi dari celah palang; b9_2 stiker QR generik (tanpa logo asli) di meja warung, tiga HP aplikasi berbeda memindai kode yang sama → centang;
   b9_3 tiga kotak surat berbeda bentuk, amplop terbang bebas, satu kotak diganti dan amplop tetap sampai; b9_4 palu sidang, berkas perkara KPPU, denda menghitung naik, stempel kasasi ditolak;
   b9_5 dua gelembung chat aplikasi berbeda dihubungkan jembatan (Digital Markets Act), lalu gerobak bab 7 melambat dan rem menyala lagi. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KY = KIT.layar;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};

  // ---------- b9_1 ----------
  S.b9_1 = function (ctx, b, l, t) {
    const tBuka = D.at(b, "bisa dibuka"), tSetiap = D.at(b, "hampir setiap hari");
    const c = D.path([[0, 960, 560, 1.15], [b.dur, 960, 580, 1.0]], l);
    ctx.save(); U.camT(ctx, c);
    U.pasar(ctx, t, { suram: lerp(0.4, 0.15, ramp(l, tBuka - 0.5, 2)), pagi: ramp(l, tBuka - 0.5, 2) });
    U.palang(ctx, t, 1, 1);
    // berkas cahaya dari celah
    const ra = ramp(l, tBuka - 0.3, 1.5); if (ra > 0) { ctx.save(); ctx.globalCompositeOperation = "screen"; for (let i = 0; i < 6; i++) { const x = 760 + i * 80 + Math.sin(t * 0.7 + i) * 8;
      const gr = ctx.createLinearGradient(x, 560, x + 260, 1100); gr.addColorStop(0, D.hexA("#FFE7B0", 0.4 * ra)); gr.addColorStop(1, D.hexA("#FFE7B0", 0)); ctx.fillStyle = gr;
      ctx.beginPath(); ctx.moveTo(x, 560); ctx.lineTo(x + 30, 560); ctx.lineTo(x + 320, 1100); ctx.lineTo(x + 160, 1100); ctx.closePath(); ctx.fill(); } ctx.restore(); }
    ctx.restore();
    KB.draw(ctx, 1500, 900, 170, { pose: l > tBuka ? "tunjuk" : "diam", target: [960, 560], mood: l > tBuka ? "happy" : "sad", t });
    D.post(c2 => { U.judul(c2, "Kabar baik: pintu bisa dibuka lagi", 960, 100, 60, pop(l, tBuka - 0.3).a, { sp: pop(l, tBuka - 0.3).sp, col: P.green });
      tag(c2, "contohnya kamu pakai hampir setiap hari", 960, 195, pop(l, tSetiap - 0.4).a, { sp: pop(l, tSetiap - 0.4).sp, col: P.amber, size: 44 }); });
  };

  // ---------- b9_2: QR ----------
  const QR = (() => { const r = D.rng(77), n = 25, m = []; for (let y = 0; y < n; y++) { m.push([]); for (let x = 0; x < n; x++) m[y].push(r() < 0.5 ? 1 : 0); }
    const fin = (ox, oy) => { for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) m[oy + y][ox + x] = (x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) ? 1 : 0;
      for (let k = 0; k < 8; k++) { if (oy + 7 < n) m[oy + 7][Math.min(n - 1, ox + k)] = 0; if (ox + 7 < n) m[Math.min(n - 1, oy + k)][ox + 7] = 0; } };
    fin(0, 0); fin(18, 0); fin(0, 18); return m; })();
  function kodeQR(ctx, x, y, s) { const n = QR.length, c = s / n; ctx.fillStyle = "#FFFFFF"; RR(ctx, x - s / 2 - c * 2, y - s / 2 - c * 2, s + c * 4, s + c * 4, 10); ctx.fill(); ctx.fillStyle = "#1A1E44";
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (QR[i][j]) ctx.fillRect(x - s / 2 + j * c, y - s / 2 + i * c, c + 0.5, c + 0.5); }
  function layarApp(col, cek, scan) { return (ctx, w, h, t) => { ctx.fillStyle = "#101433"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = col; ctx.fillRect(0, 0, w, h * 0.14);
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(w * 0.16, h * 0.07, h * 0.035, 0, TAU); ctx.fill(); U.bars(ctx, w * 0.28, h * 0.055, w * 0.4, h * 0.025, 1, "rgba(255,255,255,0.8)", 2);
    // bingkai pemindai
    const bx = w * 0.15, by = h * 0.3, bw = w * 0.7; ctx.strokeStyle = cek > 0 ? "#5BD68A" : "#FFFFFF"; ctx.lineWidth = 6; const L = bw * 0.2;
    [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bw, 1, -1], [bx + bw, by + bw, -1, -1]].forEach(([x, y, dx, dy]) => { ctx.beginPath(); ctx.moveTo(x + dx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * L); ctx.stroke(); });
    if (cek <= 0) { kodeQR(ctx, w / 2, by + bw / 2, bw * 0.7); const sy = by + bw * ((t * 0.8 + scan) % 1); ctx.fillStyle = D.hexA(col, 0.8); ctx.fillRect(bx, sy, bw, 6); }
    else { ctx.fillStyle = D.hexA("#5BD68A", cek); ctx.beginPath(); ctx.arc(w / 2, by + bw / 2, bw * 0.32 * lerp(0.6, 1, clamp(spring(cek, 10, 0.5))), 0, TAU); ctx.fill();
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(w / 2 - bw * 0.14, by + bw / 2); ctx.lineTo(w / 2 - bw * 0.03, by + bw / 2 + bw * 0.11); ctx.lineTo(w / 2 + bw * 0.16, by + bw / 2 - bw * 0.12); ctx.stroke(); } }; }
  S.b9_2 = function (ctx, b, l, t) {
    const tQris = D.at(b, "QRIS"), tBI = D.at(b, "Bank Indonesia"), tApa = D.at(b, "apa pun"), tSama = D.at(b, "kode yang sama"), tKunci = D.at(b, "tidak ada satu");
    // meja warung
    const sky = ctx.createLinearGradient(0, 0, 0, 600); sky.addColorStop(0, "#5A86D8"); sky.addColorStop(1, "#FFE0B8"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HH);
    ctx.fillStyle = "#E9D2B0"; ctx.fillRect(0, 260, W, 380); ctx.fillStyle = "#FF6F61"; ctx.fillRect(0, 220, W, 50); ctx.fillStyle = "#FFF3DE"; for (let x = 0; x < W; x += 120) ctx.fillRect(x, 220, 60, 50);
    ctx.fillStyle = "#9A6A44"; ctx.fillRect(0, 640, W, 440); ctx.fillStyle = "#B88456"; ctx.fillRect(0, 640, W, 16);
    // stiker QR berdiri di meja
    const qa = ramp(l, tQris - 0.4, 0.5); ctx.save(); ctx.globalAlpha *= qa; ctx.fillStyle = "#3A2F6E"; ctx.beginPath(); ctx.moveTo(840, 700); ctx.lineTo(1080, 700); ctx.lineTo(1060, 300); ctx.lineTo(860, 300); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFF6E6"; RR(ctx, 870, 320, 180, 360, 14); ctx.fill(); kodeQR(ctx, 960, 470, 150); ctx.restore();
    // tiga HP aplikasi berbeda
    const cols = ["#5AA9FF", "#FF6F91", "#5BD68A"], xs = [380, 960, 1540];
    xs.forEach((x, i) => { const a = ramp(l, tApa - 0.3 + i * 0.4, 0.4); if (a <= 0) return; const cek = clamp((l - tSama - 0.2 - i * 0.5) / 0.4);
      const hx = i === 1 ? 960 : x, hy = i === 1 ? 850 + (1 - eout(a)) * 200 : 800 - (1 - eout(a)) * 200;
      ctx.save(); ctx.globalAlpha *= a; KY.hp(ctx, hx, hy, i === 1 ? 400 : 480, { t, screen: layarApp(cols[i], cek, i * 0.3), tilt: i === 0 ? 0.4 : i === 2 ? -0.4 : 0 }); ctx.restore(); });
    D.post(c2 => {
      tag(c2, "QRIS", 960, 160 + 100, pop(l, tQris).a, { sp: pop(l, tQris).sp, col: P.amber, size: 56 });
      tag(c2, "Bank Indonesia: satu standar QR untuk semua", 960, 120, pop(l, tBI).a, { sp: pop(l, tBI).sp, col: P.blue, size: 48 });
      ["aplikasi bank", "dompet digital", "aplikasi lain"].forEach((s, i) => { if (i === 1) return; tag(c2, s, xs[i], 480, pop(l, tApa + i * 0.4).a, { col: cols[i], size: 44 }); });
      tag(c2, "tidak ada yang bisa mengunci", 960, 920 - 20, pop(l, tKunci).a, { sp: pop(l, tKunci).sp, col: P.green, size: 48 });
    });
  };

  // ---------- b9_3: kotak surat ----------
  function kotakSurat(ctx, x, y, s, jenis, col, t) { ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#6E4630"; ctx.fillRect(-s * 0.05, -s * 0.5, s * 0.1, s * 0.5);
    ctx.fillStyle = col;
    if (jenis === 0) { RR(ctx, -s * 0.3, -s * 0.95, s * 0.6, s * 0.45, 12); ctx.fill(); ctx.beginPath(); ctx.arc(0, -s * 0.95, s * 0.3, Math.PI, 0); ctx.fill(); }
    if (jenis === 1) { RR(ctx, -s * 0.32, -s * 1.0, s * 0.64, s * 0.5, 16); ctx.fill(); }
    if (jenis === 2) { ctx.beginPath(); ctx.moveTo(-s * 0.32, -s * 0.5); ctx.lineTo(s * 0.32, -s * 0.5); ctx.lineTo(s * 0.32, -s * 0.95); ctx.lineTo(0, -s * 1.15); ctx.lineTo(-s * 0.32, -s * 0.95); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = "#1A1E44"; RR(ctx, -s * 0.18, -s * 0.84, s * 0.36, s * 0.06, 4); ctx.fill();
    ctx.fillStyle = "#FF5A5F"; ctx.fillRect(s * 0.3, -s * 1.0, s * 0.04, s * 0.22); ctx.fillRect(s * 0.3, -s * 1.0, s * 0.14, s * 0.07); ctx.restore(); }
  function amplop(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "#FFF6E6"; RR(ctx, -s / 2, -s * 0.32, s, s * 0.64, 6); ctx.fill(); ctx.strokeStyle = "#C9A27A"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-s / 2, -s * 0.32); ctx.lineTo(0, s * 0.05); ctx.lineTo(s / 2, -s * 0.32); ctx.stroke(); ctx.restore(); }
  S.b9_3 = function (ctx, b, l, t) {
    const tEmail = D.at(b, "Email"), tMana = D.at(b, "mana pun"), tInter = D.at(b, "Inilah interoperabilitas"), tMurah = D.at(b, "biaya pindah");
    U.studio(ctx, t, { top: "#1F3A6E", bot: "#3A5A98" });
    ctx.fillStyle = "#4A6A9A"; ctx.fillRect(0, 820, W, 260);
    const ganti = eio(clamp((l - tMana - 0.6) / 1.0));
    const boxes = [[400, 0, P.blue], [960, 1, P.pink], [1520, 2, P.green]];
    boxes.forEach(([x, j, col], i) => { if (i === 2 && ganti > 0) { ctx.save(); ctx.globalAlpha *= 1 - ganti; kotakSurat(ctx, x, 820 + ganti * 60, 420, j, col, t); ctx.restore(); ctx.save(); ctx.globalAlpha *= ganti; kotakSurat(ctx, x, 820 + (1 - ganti) * -80, 420, 0, P.amber, t); ctx.restore(); }
      else kotakSurat(ctx, x, 820, 420, j, col, t); });
    // amplop terbang di antara kotak
    const fa = ramp(l, tEmail, 0.5);
    if (fa > 0) for (let i = 0; i < 6; i++) { const T = 2.4, u = ((l + i * T / 6) % T) / T, a = i % 3, bb = (i + 1 + (i % 2)) % 3; const [x0] = boxes[a], [x1] = boxes[bb];
      const x = lerp(x0, x1, eio(u)), y = 430 - Math.sin(u * Math.PI) * 200; ctx.save(); ctx.globalAlpha *= fa * Math.min(1, u * 8, (1 - u) * 8); amplop(ctx, x, y, 90, (x1 - x0) * 0.0002 + Math.sin(u * 6) * 0.15); ctx.restore(); }
    D.post(c2 => {
      tag(c2, "penyedia email mana pun", 960, 140, pop(l, tMana).a, { sp: pop(l, tMana).sp, col: P.ink2, size: 48 });
      tag(c2, "ganti penyedia → surat tetap sampai", 1400, 240, pop(l, tMana + 1.6).a * (1 - ramp(l, tInter - 0.2, 0.3)), { col: P.amber, size: 44 });
      U.judul(c2, "interoperabilitas", 960, 260, 72, pop(l, tInter).a, { sp: pop(l, tInter).sp, col: P.teal });
      tag(c2, "biaya pindah jadi murah", 960, 920 - 20, pop(l, tMurah).a, { sp: pop(l, tMurah).sp, col: P.green, size: 52 });
    });
  };

  // ---------- b9_4: KPPU ----------
  S.b9_4 = function (ctx, b, l, t) {
    const tKppu = D.at(b, "KPPU"), tWajib = D.at(b, "mewajibkan"), tBiaya = D.at(b, "biaya layanan"), tDenda = D.at(b, "didenda"), tMA = D.at(b, "Mahkamah Agung"), tTolak = D.at(b, "menolak kasasinya");
    U.studio(ctx, t, { top: "#2A2350", bot: "#4A3A70" });
    // meja sidang
    ctx.fillStyle = "#6E4630"; ctx.fillRect(0, 760, W, 320); ctx.fillStyle = "#8A5A3C"; ctx.fillRect(0, 740, W, 30);
    // berkas perkara
    const ba = ramp(l, tKppu - 0.3, 0.5); ctx.save(); ctx.globalAlpha *= ba; ctx.translate(560, 470); ctx.rotate(-0.04);
    ctx.fillStyle = "#E9C46A"; RR(ctx, -380, -250, 760, 500, 16); ctx.fill(); ctx.fillStyle = "#F5DC8A"; RR(ctx, -360, -230, 720, 460, 12); ctx.fill(); ctx.restore();
    // palu (memukul saat "menolak kasasinya"): gagang mendatar dipegang di kanan, kepala palu turun ke landasan
    const hit = l > tTolak ? Math.max(0, 1 - (l - tTolak) * 4) : 0, ang = 0.6 * (1 - (l > tTolak ? Math.min(1, (l - tTolak) * 6) : 0)) + 0.04 * Math.sin(t * 2) * (l < tTolak ? 1 : 0);
    ctx.fillStyle = "#5A3A28"; RR(ctx, 1450, 712, 180, 34, 10); ctx.fill(); ctx.fillStyle = "#4A2E20"; ctx.fillRect(1450, 740, 180, 8);
    ctx.save(); ctx.translate(1800, 640); ctx.rotate(ang);
    ctx.fillStyle = "#8A5A3C"; RR(ctx, -250, -14, 260, 28, 12); ctx.fill(); ctx.fillStyle = "#A8714C"; RR(ctx, -300, -72, 96, 144, 22); ctx.fill(); ctx.fillStyle = "#6E4630"; ctx.fillRect(-300, -30, 96, 12); ctx.fillRect(-300, 18, 96, 12); ctx.restore();
    if (hit > 0) { ctx.strokeStyle = D.hexA("#FFFFFF", hit); ctx.lineWidth = 6; for (let i = 0; i < 6; i++) { const a = -Math.PI + i * Math.PI / 5; ctx.beginPath(); ctx.moveTo(1540 + Math.cos(a) * 130, 712 + Math.sin(a) * 50); ctx.lineTo(1540 + Math.cos(a) * 190, 712 + Math.sin(a) * 80); ctx.stroke(); } }
    const fine = lerp(0, 202.5, eout(clamp((l - tDenda) / 1.6)));
    D.post(c2 => { c2.save(); c2.globalAlpha = ba; c2.translate(560, 470); c2.rotate(-0.04);
      txt(c2, "PERKARA", 0, -160, 52, { align: "center", weight: 900, color: "#5A3A28" }); txt(c2, "03/KPPU-I/2024", 0, -90, 56, { align: "center", weight: 900, color: "#2A2350" });
      c2.fillStyle = "rgba(90,58,40,0.3)"; c2.fillRect(-320, -50, 640, 4);
      const rows = [["wajib bayar lewat Google Play", tWajib], ["biaya layanan 15–30%", tBiaya]];
      rows.forEach(([s, t0], i) => { const a = ramp(l, t0, 0.4); c2.globalAlpha = ba * a; txt(c2, "• " + s, -320, 20 + i * 80, 44, { weight: 800, color: "#5A3A28", fit: 660 }); }); c2.restore();
      tag(c2, "2025: Google dinyatakan melanggar", 560, 130, pop(l, tKppu + 1.0).a, { sp: pop(l, tKppu + 1.0).sp, col: P.amber, size: 48 });
      if (l > tDenda - 0.2) U.judul(c2, "denda Rp" + fine.toFixed(1).replace(".", ",") + " miliar", 1440, 260, 64, ramp(l, tDenda - 0.2, 0.3), { col: P.pink });
      const sa = pop(l, tTolak); if (sa.a > 0) { c2.save(); c2.globalAlpha = sa.a; c2.translate(640, 690); c2.rotate(-0.07); const k = lerp(2, 1, clamp(sa.sp)); c2.scale(k, k);
        c2.fillStyle = "rgba(255,246,230,0.92)"; RR(c2, -280, -90, 560, 180, 18); c2.fill(); c2.strokeStyle = P.red; c2.lineWidth = 10; RR(c2, -280, -90, 560, 180, 18); c2.stroke(); txt(c2, "KASASI DITOLAK", 0, -6, 58, { align: "center", weight: 900, color: P.red }); txt(c2, "Maret 2026", 0, 62, 48, { align: "center", weight: 900, color: P.red }); c2.restore(); }
      tag(c2, "Mahkamah Agung", 1440, 400, pop(l, tMA).a, { sp: pop(l, tMA).sp, col: P.blue, size: 44 });
    });
  };

  // ---------- b9_5: Eropa + rem menyala lagi ----------
  const ANG = 0.17, ROAD = x => 470 + Math.tan(ANG) * x;
  S.b9_5 = function (ctx, b, l, t) {
    const tEropa = D.at(b, "Di Eropa"), tMengobrol = D.at(b, "mengobrol"), tRem = D.at(b, "Rem-rem itu");
    const sw = eio(clamp((l - tRem + 0.8) / 0.8));
    if (sw < 1) { ctx.save(); ctx.globalAlpha *= 1 - sw; U.studio(ctx, t);
      const ja = eio(clamp((l - tMengobrol + 0.6) / 1.2));
      // dua aplikasi chat generik
      [[520, P.green, "Aplikasi A"], [1400, P.violet, "Aplikasi B"]].forEach(([x, col], i) => { ctx.fillStyle = col; RR(ctx, x - 170, 380, 340, 220, 50); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + (i ? 80 : -80), 590); ctx.lineTo(x + (i ? 120 : -120), 660); ctx.lineTo(x + (i ? 10 : -10), 590); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; [-60, 0, 60].forEach((dx, k) => { ctx.beginPath(); ctx.arc(x + dx, 490 + Math.sin(t * 5 + k + i) * 6, 18, 0, TAU); ctx.fill(); }); });
      // jembatan
      if (ja > 0) { ctx.fillStyle = "#A8714C"; ctx.fillRect(700, 480, 520 * ja, 26); ctx.strokeStyle = "#8A5A3C"; ctx.lineWidth = 6; ctx.beginPath(); for (let k = 0; k <= 10 * ja; k++) { const x = 700 + k * 52; ctx.moveTo(x, 480); ctx.lineTo(x, 440); } ctx.moveTo(700, 440); ctx.quadraticCurveTo(960, 400, 700 + 520 * ja, 440); ctx.stroke();
        for (let i = 0; i < 3; i++) { const u = ((t * 0.4 + i / 3) % 1) * ja; ctx.fillStyle = "#FFF6E6"; RR(ctx, 700 + u * 480, 450, 44, 26, 8); ctx.fill(); } }
      ctx.restore();
      D.post(c2 => { c2.globalAlpha = 1 - sw; tag(c2, "Uni Eropa · Digital Markets Act", 960, 160, pop(l, tEropa).a, { sp: pop(l, tEropa).sp, col: P.blue, size: 52 });
        tag(c2, "WhatsApp wajib membuka pintu", 960, 270, pop(l, tEropa + 1.6).a, { sp: pop(l, tEropa + 1.6).sp, col: P.green, size: 48 });
        tag(c2, "bisa mengobrol lintas aplikasi", 960, 800, pop(l, tMengobrol).a, { sp: pop(l, tMengobrol).sp, col: P.amber, size: 48 }); }); }
    if (sw > 0) { ctx.save(); ctx.globalAlpha *= sw; const c = { x: 1100, y: 620, z: 1 }; ctx.save(); U.camT(ctx, c);
      const sky = ctx.createLinearGradient(0, 0, 0, 700); sky.addColorStop(0, "#3E62C4"); sky.addColorStop(1, "#FFD3A0"); ctx.fillStyle = sky; ctx.fillRect(-2000, -500, 8000, 2200);
      ctx.fillStyle = "#7FA36E"; ctx.beginPath(); ctx.moveTo(-2000, ROAD(-2000) - 30); ctx.lineTo(6000, ROAD(6000) - 30); ctx.lineTo(6000, 3000); ctx.lineTo(-2000, 3000); ctx.fill();
      ctx.fillStyle = "#5C6390"; ctx.beginPath(); ctx.moveTo(-2000, ROAD(-2000)); ctx.lineTo(6000, ROAD(6000)); ctx.lineTo(6000, ROAD(6000) + 170); ctx.lineTo(-2000, ROAD(-2000) + 170); ctx.fill();
      const rem = [0, 1, 2, 3].map(i => clamp((l - tRem - 0.2 - i * 0.45) / 0.3)), slow = eout(clamp((l - tRem + 0.8) / 2.4)), gx = 1250 + 200 * slow;
      U.gerobak(ctx, gx, ROAD(gx) + 60, 640, { rem, ang: ANG, t, putar: slow * 3 });
      KB.draw(ctx, gx - 520, ROAD(gx - 520) + 10, 150, { pose: slow > 0.9 ? "diam" : "jalan", mood: "happy", t, dir: 1, wave: 1 });
      ctx.restore(); ctx.restore();
      D.post(c2 => { c2.globalAlpha = sw; const rem = [0, 1, 2, 3].map(i => clamp((l - tRem - 0.2 - i * 0.45) / 0.3));
        D.panel(c2, 100, 110, 640, 4 * 92 + 40, { r: 24, fill: "rgba(10,18,52,0.88)" });
        U.REM.forEach((s, i) => { const on = rem[i], y = 174 + i * 92; c2.fillStyle = on > 0.05 ? U.mix("#5C6390", "#5BD68A", on) : "#5C6390"; c2.beginPath(); c2.arc(150, y - 14, 22, 0, TAU); c2.fill(); txt(c2, (i + 1) + ". " + s, 192, y, 44, { weight: 900, color: on > 0.05 ? P.ink : P.dim }); });
        tag(c2, "rem bisa dipasang kembali", 1400, 140, pop(l, tRem + 0.4).a, { sp: pop(l, tRem + 0.4).sp, col: P.green, size: 52 }); }); }
  };

  K.SCENES.d05_b9 = function (ctx, b, l, t, TL) { const f = S[b.id]; ctx.save(); U.napas(ctx, t); if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); ctx.restore(); };
  K.SCENES.d05_b9.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b9 = TL => [
    K.sfxAt(TL, "b9_1", "bisa dibuka", -0.3, "shimmer", 0.6), K.sfxAt(TL, "b9_2", "QRIS", 0, "pop", 0.5),
    K.sfxAt(TL, "b9_2", "kode yang sama", 0.2, "pop", 0.4), K.sfxAt(TL, "b9_2", "kode yang sama", 0.7, "pop", 0.4), K.sfxAt(TL, "b9_2", "kode yang sama", 1.2, "pop", 0.4),
    K.sfxAt(TL, "b9_3", "mana pun", 0.6, "whoosh", 0.4), K.sfxAt(TL, "b9_3", "Inilah interoperabilitas", 0, "shimmer", 0.5),
    K.sfxAt(TL, "b9_4", "didenda", 0, "riser", 0.4), K.sfxAt(TL, "b9_4", "menolak kasasinya", 0.15, "boom", 0.7),
    K.sfxAt(TL, "b9_5", "mengobrol", -0.6, "whoosh", 0.4), ...[0, 1, 2, 3].map(i => K.sfxAt(TL, "b9_5", "Rem-rem itu", 0.2 + i * 0.45, "clack", 0.5)),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
