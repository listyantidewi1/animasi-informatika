/* S11 pembantu: jendela browser generik dan halaman akun sekolah rekaan (akun.example).
   Tanpa logo atau tampilan browser merek tertentu. Semua nama, akun, kode, dan lokasi adalah contoh.
   Halaman digambar oleh W.page(ctx, area, name, st) dan mengembalikan titik-titik penting (koordinat kanvas) untuk pointer. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, HP = K.hp;
  const { rr,  wrap, para, card, ease, clamp, lerp } = H;
  // text dengan opt.fit yang juga mengecilkan huruf kecil (H.text hanya mengecilkan sampai 20 px)
  const text = (ctx, s, x, y, size, opt = {}) => {
    if (opt.fit) { const f = `${opt.weight || 600} `; ctx.font = f + size + "px Inter"; while (size > 11 && ctx.measureText(s).width > opt.fit) { size -= 1; ctx.font = f + size + "px Inter"; } }
    H.text(ctx, s, x, y, size, { ...opt, fit: undefined });
  };
  const Wb = {};
  const BLUE = "#1A73C8", INK2 = "#5B6B76", LINE = "#E1E7EB", GREEN = "#2E9E5B", RED = "#D9443B", SOFT = "#F4F7F9";
  Wb.BLUE = BLUE; Wb.GREEN = GREEN; Wb.RED = RED;

  // ---------- jendela browser ----------
  Wb.browser = function (ctx, x, y, w, h, opt = {}) {
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.18)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip();
    ctx.fillStyle = "#DDE5EA"; ctx.fillRect(x, y, w, 46);
    // tab
    const tw = Math.min(330, w * 0.4); ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 14, y + 8, tw, 44, 12); ctx.fill();
    ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(x + 38, y + 29, 9, 0, Math.PI * 2); ctx.fill();
    text(ctx, opt.tab || "Akun Sekolah", x + 56, y + 36, 19, { weight: 700, color: C.ink, fit: tw - 80 });
    HP.icon(ctx, "close", x + tw - 6, y + 29, 14, INK2);
    HP.icon(ctx, "plus", x + tw + 40, y + 27, 16, INK2);
    // bilah alamat
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y + 46, w, 54);
    HP.icon(ctx, "back", x + 32, y + 73, 22, INK2);
    ctx.save(); ctx.translate(x + 72, y + 73); ctx.scale(-1, 1); HP.icon(ctx, "back", 0, 0, 22, "#B9C4CC"); ctx.restore();
    HP.icon(ctx, "update", x + 112, y + 73, 22, INK2);
    const ax = x + 142, aw = w - 170; ctx.fillStyle = "#EEF2F5"; rr(ctx, ax, y + 54, aw, 38, 19); ctx.fill();
    HP.icon(ctx, "lock", ax + 24, y + 73, 16, INK2);
    const url = opt.url || "akun.example"; const n = opt.typed != null ? opt.typed : url.length;
    text(ctx, url.slice(0, n), ax + 44, y + 80, 20, { weight: 600, color: C.ink });
    if (opt.urlFocus) { ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5; rr(ctx, ax, y + 54, aw, 38, 19); ctx.stroke(); }
    ctx.fillStyle = LINE; ctx.fillRect(x, y + 99, w, 1.5);
    ctx.restore();
    ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 16); ctx.stroke();
    return { x, y: y + 101, w, h: h - 101, url: { x: ax + 140, y: y + 73 } };
  };

  // ---------- kerangka situs ----------
  const NAV = [["Beranda", "user"], ["Info pribadi", "contacts"], ["Keamanan", "shield"], ["Perangkat", "phone"]];
  function site(ctx, A, st) {
    ctx.save(); ctx.beginPath(); ctx.rect(A.x, A.y, A.w, A.h); ctx.clip();
    ctx.fillStyle = SOFT; ctx.fillRect(A.x, A.y, A.w, A.h);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(A.x, A.y, A.w, 62); ctx.fillStyle = LINE; ctx.fillRect(A.x, A.y + 61, A.w, 1.5);
    ctx.fillStyle = "#E3EEFA"; ctx.beginPath(); ctx.arc(A.x + 40, A.y + 31, 19, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "school", A.x + 40, A.y + 31, 22, BLUE);
    text(ctx, "Akun Sekolah", A.x + 70, A.y + 39, 23, { weight: 800, color: C.ink });
    if (st.logged !== false) { ctx.fillStyle = "#2E7E9A"; ctx.beginPath(); ctx.arc(A.x + A.w - 40, A.y + 31, 19, 0, Math.PI * 2); ctx.fill(); text(ctx, "D", A.x + A.w - 40, A.y + 39, 20, { align: "center", weight: 900, color: "#FFFFFF" });
      text(ctx, "dito@sekolah.example", A.x + A.w - 70, A.y + 38, 18, { align: "right", weight: 600, color: INK2 }); }
    const navW = st.logged === false ? 0 : (A.w > 1000 ? 240 : 200), geo = { nav: {} };
    if (navW) {
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(A.x, A.y + 62, navW, A.h - 62); ctx.fillStyle = LINE; ctx.fillRect(A.x + navW - 1, A.y + 62, 1.5, A.h - 62);
      NAV.forEach(([s, ic], i) => { const y = A.y + 84 + i * 56, on = st.nav === s;
        if (on) { ctx.fillStyle = "#E3EEFA"; rr(ctx, A.x + 10, y, navW - 20, 46, 23); ctx.fill(); }
        if (st.navHl === s) { ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, A.x + 10, y, navW - 20, 46, 23); ctx.stroke(); }
        HP.icon(ctx, ic, A.x + 38, y + 23, 20, on ? BLUE : INK2); text(ctx, s, A.x + 62, y + 30, 19, { weight: on ? 800 : 600, color: on ? BLUE : C.ink });
        geo.nav[s] = { x: A.x + 90, y: y + 23 }; });
    }
    geo.c = { x: A.x + navW + 34, y: A.y + 62 + 26, w: A.w - navW - 68 };
    return geo;
  }
  Wb.btn = function (ctx, x, y, w, h, label, opt = {}) {
    if (opt.hl) { ctx.fillStyle = "rgba(242,177,52,0.45)"; rr(ctx, x - 5, y - 5, w + 10, h + 10, 14); ctx.fill(); }
    ctx.fillStyle = opt.outline ? "#FFFFFF" : (opt.fill || BLUE); rr(ctx, x, y, w, h, 10); ctx.fill();
    if (opt.outline) { ctx.strokeStyle = opt.ink || BLUE; ctx.lineWidth = 2; rr(ctx, x, y, w, h, 10); ctx.stroke(); }
    text(ctx, label, x + w / 2, y + h / 2 + 7, opt.size || 20, { align: "center", weight: 800, color: opt.outline ? (opt.ink || BLUE) : "#FFFFFF", fit: w - 16 });
    return { x: x + w / 2, y: y + h / 2 };
  };
  function field(ctx, x, y, w, label, value, opt = {}) {
    if (label) text(ctx, label, x, y - 10, 17, { weight: 700, color: INK2 });
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, w, 48, 10); ctx.fill(); ctx.strokeStyle = opt.focus ? BLUE : "#C9D4DB"; ctx.lineWidth = opt.focus ? 2.5 : 1.8; rr(ctx, x, y, w, 48, 10); ctx.stroke();
    const shown = opt.secret ? "•".repeat(value.length) : value; text(ctx, shown, x + 16, y + 32, opt.secret ? 24 : 20, { weight: 700, color: C.ink, fit: w - 30 });
    if (opt.focus && opt.caret) { ctx.font = `700 ${opt.secret ? 24 : 20}px Inter`; const cw = ctx.measureText(shown).width; ctx.fillStyle = C.ink; ctx.fillRect(x + 18 + cw, y + 12, 2, 24); }
    return { x: x + w / 2, y: y + 24 };
  }
  function box(ctx, x, y, w, h, opt = {}) { ctx.fillStyle = opt.fill || "#FFFFFF"; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.strokeStyle = opt.stroke || LINE; ctx.lineWidth = opt.lw || 1.5; rr(ctx, x, y, w, h, 16); ctx.stroke(); }
  function row(ctx, x, y, w, icon, label, sub, value, opt = {}) {
    if (opt.hl) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 4, y + 4, w - 8, 72, 12); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, x + 4, y + 4, w - 8, 72, 12); ctx.stroke(); }
    ctx.fillStyle = opt.iconBg || "#E3EEFA"; ctx.beginPath(); ctx.arc(x + 40, y + 40, 21, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, icon, x + 40, y + 40, 22, opt.iconColor || BLUE);
    text(ctx, label, x + 76, y + 36, 21, { weight: 800, color: C.ink, fit: w - 300 }); if (sub) text(ctx, sub, x + 76, y + 61, 16, { weight: 600, color: INK2, fit: w - 300 });
    if (value) { ctx.font = "800 19px Inter"; const vw = ctx.measureText(value).width + 28; ctx.fillStyle = opt.valueBg || "#EEF2F5"; rr(ctx, x + w - 58 - vw, y + 24, vw, 34, 17); ctx.fill(); text(ctx, value, x + w - 58 - vw / 2, y + 47, 19, { align: "center", weight: 800, color: opt.valueColor || INK2 }); }
    HP.icon(ctx, "chevron", x + w - 30, y + 40, 16, "#8A99A3");
    return { x: x + w * 0.5, y: y + 40 };
  }

  // ---------- halaman ----------
  // st: halaman tertentu memakai st.* (lihat masing-masing). Hasil: titik untuk pointer + geo situs.
  // zoom: perbesaran isi halaman (seperti zoom browser), supaya huruf tetap terbaca di layar kecil. Titik hasil sudah dalam koordinat kanvas.
  Wb.page = function (ctx, A, name, st = {}, zoom = Wb.ZOOM) {
    const z = zoom || 1, V = { x: 0, y: 0, w: A.w / z, h: A.h / z };
    ctx.save(); ctx.translate(A.x, A.y); ctx.scale(z, z);
    const P = PAGES[name]; const geo = site(ctx, V, { ...st, logged: name !== "login", nav: st.nav || (name === "beranda" ? "Beranda" : name === "login" ? null : "Keamanan") });
    const out = P ? P(ctx, geo.c, st, V) || {} : {};
    out.nav = geo.nav; ctx.restore(); ctx.restore();
    const map = o => { if (Array.isArray(o)) return o.map(map); if (o && typeof o === "object") { const r = {}; for (const k in o) r[k] = map(o[k]);
      if (typeof o.x === "number" && typeof o.y === "number") { r.x = A.x + o.x * z; r.y = A.y + o.y * z; if (typeof o.s === "number") r.s = o.s * z; } return r; } return o; };
    return map(out);
  };
  Wb.ZOOM = 1.15;
  const PAGES = {
    login(ctx, c, st, A) {
      const w = 470, x = A.x + A.w / 2 - w / 2, y = A.y + 110;
      box(ctx, x, y, w, 430);
      text(ctx, "Login ke Akun Sekolah", x + w / 2, y + 62, 27, { align: "center", weight: 900 });
      const e = field(ctx, x + 40, y + 130, w - 80, "Email", st.email || "", { focus: st.focus === "email", caret: true });
      const p = field(ctx, x + 40, y + 230, w - 80, "Kata sandi", st.pw || "", { secret: true, focus: st.focus === "pw", caret: true });
      const b = Wb.btn(ctx, x + 40, y + 320, w - 80, 54, "Login", { hl: st.hl === "login" });
      return { email: e, pw: p, login: b };
    },
    beranda(ctx, c, st) {
      text(ctx, "Halo, Dito!", c.x, c.y + 26, 30, { weight: 900 });
      para(ctx, "Kelola info, privasi, dan keamanan akun sekolahmu.", c.x, c.y + 66, 19, c.w, { weight: 600, color: INK2 });
      [["contacts", "Info pribadi", "Nama, foto, dan kelas"], ["shield", "Keamanan", "Kata sandi dan cara login"]].forEach(([ic, a, s], i) => {
        const x = c.x + i * (c.w / 2 + 6), w = c.w / 2 - 6, y = c.y + 100; box(ctx, x, y, w, 150);
        ctx.fillStyle = "#E3EEFA"; ctx.beginPath(); ctx.arc(x + 46, y + 50, 24, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, ic, x + 46, y + 50, 26, BLUE);
        text(ctx, a, x + 24, y + 110, 21, { weight: 800 }); text(ctx, s, x + 24, y + 136, 16, { weight: 600, color: INK2, fit: w - 40 }); });
      return {};
    },
    keamanan(ctx, c, st) {
      text(ctx, "Keamanan", c.x, c.y + 26, 30, { weight: 900 });
      let y = c.y + 46;
      if (!st.on) { ctx.fillStyle = "#FFF6E0"; rr(ctx, c.x, y, c.w, 58, 12); ctx.fill(); HP.icon(ctx, "warning", c.x + 30, y + 29, 22, "#B57A12"); text(ctx, "Saran: nyalakan verifikasi dua langkah supaya akunmu lebih aman.", c.x + 56, y + 36, 17, { weight: 700, color: "#7A5208", fit: c.w - 70 }); y += 66; }
      else y += 8;
      box(ctx, c.x, y, c.w, 194); text(ctx, "Cara kamu login", c.x + 24, y + 38, 20, { weight: 900, color: INK2 });
      const r1 = row(ctx, c.x, y + 44, c.w, "key", "Kata sandi", st.pwNew ? "Diubah baru saja" : "Diubah 3 bulan lalu", null, {});
      ctx.fillStyle = LINE; ctx.fillRect(c.x + 76, y + 120, c.w - 96, 1.5);
      const r2 = row(ctx, c.x, y + 114, c.w, "phone", "Verifikasi dua langkah", st.on ? "Kode dari aplikasi autentikator" : "Hanya kata sandi", st.on ? "Aktif" : "Mati",
        { hl: st.hl === "2fa", valueBg: st.on ? "#DDF3E4" : "#FBE1DF", valueColor: st.on ? GREEN : RED });
      y += 206;
      box(ctx, c.x, y, c.w, 120); text(ctx, "Perangkatmu", c.x + 24, y + 34, 20, { weight: 900, color: INK2 });
      const r3 = row(ctx, c.x, y + 38, c.w, "apps", "Kelola perangkat", (st.devices || 3) + " perangkat sedang login", null, { hl: st.hl === "devices" });
      return { pw: r1, twofa: r2, devices: r3 };
    },
    v2_intro(ctx, c, st) {
      text(ctx, "Verifikasi dua langkah", c.x, c.y + 26, 30, { weight: 900 });
      box(ctx, c.x, c.y + 52, c.w, 400);
      para(ctx, "Selain kata sandi, kamu memasukkan kode dari HP setiap login di perangkat baru. Orang yang tahu kata sandimu tetap tidak bisa masuk.", c.x + 30, c.y + 100, 20, c.w - 60, { weight: 600, color: C.ink, lh: 1.35 });
      // ilustrasi: kata sandi + HP
      const iy = c.y + 230; ctx.fillStyle = "#EEF2F5"; rr(ctx, c.x + 30, iy, 230, 80, 14); ctx.fill(); text(ctx, "••••••••", c.x + 145, iy + 52, 30, { align: "center", weight: 900, color: INK2 });
      text(ctx, "+", c.x + 300, iy + 52, 40, { align: "center", weight: 900, color: INK2 });
      ctx.fillStyle = "#EEF2F5"; rr(ctx, c.x + 340, iy, 230, 80, 14); ctx.fill(); HP.icon(ctx, "phone", c.x + 380, iy + 40, 36, BLUE); text(ctx, "482 913", c.x + 485, iy + 50, 26, { align: "center", weight: 900, color: BLUE });
      const b = Wb.btn(ctx, c.x + 30, c.y + 360, 170, 54, "Mulai", { hl: st.hl === "mulai" });
      return { mulai: b };
    },
    v2_sandi(ctx, c, st) {
      text(ctx, "Pastikan ini kamu", c.x, c.y + 26, 30, { weight: 900 });
      box(ctx, c.x, c.y + 52, c.w, 330);
      para(ctx, "Untuk melanjutkan, ketik ulang kata sandimu.", c.x + 30, c.y + 100, 20, c.w - 60, { weight: 600, color: C.ink });
      const f = field(ctx, c.x + 30, c.y + 170, Math.min(460, c.w - 60), "Kata sandi", st.pw || "", { secret: true, focus: true, caret: true });
      const b = Wb.btn(ctx, c.x + 30, c.y + 280, 170, 54, "Lanjut", { hl: st.hl === "lanjut" });
      return { pw: f, lanjut: b };
    },
    v2_cara(ctx, c, st) {
      text(ctx, "Pilih cara menerima kode", c.x, c.y + 26, 30, { weight: 900, fit: c.w });
      const opts = [["phone", "Aplikasi autentikator", "Kode dibuat di HP-mu. Disarankan."], ["chat", "SMS ke nomor HP", "Kode dikirim lewat SMS."]];
      const out = {};
      opts.forEach(([ic, a, s], i) => { const y = c.y + 56 + i * 112, on = st.pick === i;
        box(ctx, c.x, y, c.w, 96, { stroke: on ? BLUE : LINE, lw: on ? 3 : 1.5, fill: on ? "#F2F7FD" : "#FFFFFF" });
        HP.radio(ctx, c.x + 34, y + 48, on); HP.icon(ctx, ic, c.x + 80, y + 48, 28, on ? BLUE : INK2);
        text(ctx, a, c.x + 112, y + 42, 22, { weight: 800 }); text(ctx, s, c.x + 112, y + 70, 17, { weight: 600, color: INK2, fit: c.w - 130 });
        out["opt" + i] = { x: c.x + 34, y: y + 48 }; });
      out.lanjut = Wb.btn(ctx, c.x, c.y + 300, 170, 54, "Lanjut", { hl: st.hl === "lanjut" });
      return out;
    },
    v2_qr(ctx, c, st) {
      text(ctx, "Pindai kode QR", c.x, c.y + 26, 30, { weight: 900 });
      box(ctx, c.x, c.y + 52, c.w, 470);
      const qs = 230, qx = c.x + 34, qy = c.y + 92;
      HP.qr(ctx, qx, qy, qs, 11);
      if (st.qrHl) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, qx - 18, qy - 18, qs + 36, qs + 36, 12); ctx.stroke(); }
      const tx = qx + qs + 40, tw = c.w - (tx - c.x) - 24;
      ["Buka aplikasi autentikator di HP.", "Tap tanda tambah.", "Pilih Pindai kode QR."].forEach((s, i) => {
        ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(tx + 14, qy + 20 + i * 70, 14, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), tx + 14, qy + 26 + i * 70, 16, { align: "center", weight: 900, color: "#FFFFFF" });
        para(ctx, s, tx + 40, qy + 27 + i * 70, 19, tw - 40, { weight: 700, color: C.ink, lh: 1.25 }); });
      text(ctx, "Tidak bisa memindai? Ketik kunci ini:", c.x + 34, qy + qs + 56, 16, { weight: 600, color: INK2 });
      text(ctx, "KIKO 7DSA 2QXM 4PLT", c.x + 34, qy + qs + 84, 19, { weight: 800, color: C.ink });
      const b = Wb.btn(ctx, c.x + c.w - 200, c.y + 452, 170, 52, "Lanjut", { hl: st.hl === "lanjut" });
      return { qr: { x: qx + qs / 2, y: qy + qs / 2, s: qs }, lanjut: b };
    },
    v2_kode(ctx, c, st) {
      text(ctx, "Masukkan kode", c.x, c.y + 26, 30, { weight: 900 });
      box(ctx, c.x, c.y + 52, c.w, 360);
      para(ctx, "Ketik kode enam angka yang tampil di aplikasi autentikator.", c.x + 30, c.y + 100, 20, c.w - 60, { weight: 600, color: C.ink });
      const v = st.code || "", n = 6, bw = 56, gap = 12; let x = c.x + 30; const y = c.y + 150; const out = {};
      for (let i = 0; i < n; i++) { if (i === 3) x += 18; const act = i === v.length && !st.err;
        ctx.fillStyle = "#FFFFFF"; rr(ctx, x, y, bw, 70, 10); ctx.fill(); ctx.strokeStyle = st.err ? RED : act ? BLUE : "#B9C4CC"; ctx.lineWidth = act || st.err ? 3 : 2; rr(ctx, x, y, bw, 70, 10); ctx.stroke();
        if (v[i]) text(ctx, v[i], x + bw / 2, y + 48, 36, { align: "center", weight: 800, color: st.err ? RED : C.ink }); x += bw + gap; }
      out.boxes = { x: c.x + 30 + 200, y: y + 35 };
      if (st.err) { HP.icon(ctx, "warning", c.x + 42, y + 104, 20, RED); text(ctx, "Kode salah atau sudah kedaluwarsa. Coba kode yang baru.", c.x + 64, y + 111, 18, { weight: 700, color: RED, fit: c.w - 90 }); }
      if (st.checking) { HP.spinner(ctx, c.x + 240, c.y + 357, 14, st.checking); text(ctx, "Memeriksa kode…", c.x + 266, c.y + 364, 18, { weight: 700, color: INK2 }); }
      out.verif = Wb.btn(ctx, c.x + 30, c.y + 330, 190, 54, "Verifikasi", { hl: st.hl === "verif", fill: v.length === 6 ? BLUE : "#9FB6CC" });
      return out;
    },
    v2_aktif(ctx, c, st) {
      box(ctx, c.x, c.y, c.w, 420, { fill: "#F2FAF4", stroke: GREEN, lw: 3 });
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(c.x + c.w / 2, c.y + 90, 46, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, "check", c.x + c.w / 2, c.y + 90, 50, "#FFFFFF");
      text(ctx, "Verifikasi dua langkah aktif", c.x + c.w / 2, c.y + 180, 30, { align: "center", weight: 900, color: GREEN, fit: c.w - 40 });
      para(ctx, "Saat login di perangkat baru, kamu memasukkan kata sandi, lalu kode dari aplikasi autentikator.", c.x + c.w / 2, c.y + 230, 20, c.w - 120, { align: "center", weight: 600, color: C.ink, lh: 1.35 });
      const b = Wb.btn(ctx, c.x + c.w / 2 - 140, c.y + 330, 280, 54, "Lanjut: kode cadangan", { hl: st.hl === "lanjut" });
      return { lanjut: b };
    },
    cadangan(ctx, c, st) {
      text(ctx, "Kode cadangan", c.x, c.y + 26, 30, { weight: 900 });
      box(ctx, c.x, c.y + 44, c.w, 380);
      text(ctx, "Pakai kode ini kalau HP-mu hilang. Setiap kode hanya berlaku satu kali.", c.x + 26, c.y + 82, 18, { weight: 600, color: C.ink, fit: c.w - 52 });
      const codes = Wb.BACKUP, gx = c.x + 26, gy = c.y + 104, cw = Math.min(210, (c.w - 240) / 2);
      ctx.fillStyle = "#F4F7F9"; rr(ctx, gx, gy, cw * 2, 5 * 40 + 18, 12); ctx.fill(); if (st.codesHl) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, gx, gy, cw * 2, 5 * 40 + 18, 12); ctx.stroke(); }
      codes.forEach((s, i) => { const col = i % 2, r = Math.floor(i / 2); text(ctx, s, gx + 24 + col * cw, gy + 38 + r * 40, 22, { weight: 800, color: C.ink }); });
      const bx = gx + cw * 2 + 24;
      const pr = Wb.btn(ctx, bx, gy + 10, 150, 46, "Cetak", { outline: true, size: 18 }); const dl = Wb.btn(ctx, bx, gy + 68, 150, 46, "Download", { outline: true, size: 18 });
      const cy = gy + 5 * 40 + 60; ctx.fillStyle = st.check ? BLUE : "#FFFFFF"; rr(ctx, gx, cy - 15, 30, 30, 6); ctx.fill(); ctx.strokeStyle = st.check ? BLUE : "#8A99A3"; ctx.lineWidth = 2; rr(ctx, gx, cy - 15, 30, 30, 6); ctx.stroke();
      if (st.check) HP.icon(ctx, "check", gx + 15, cy, 22, "#FFFFFF");
      text(ctx, "Saya sudah menyimpan kode ini di tempat aman.", gx + 44, cy + 7, 18, { weight: 700, color: C.ink, fit: c.w - 250 });
      const done = Wb.btn(ctx, c.x + c.w - 156, cy - 26, 132, 50, "Selesai", { hl: st.hl === "selesai", fill: st.check ? BLUE : "#9FB6CC" });
      return { check: { x: gx + 15, y: cy }, selesai: done, print: pr, download: dl, codes: { x: gx + cw * 2, y: gy + 100 } };
    },
    perangkat(ctx, c, st) {
      text(ctx, "Perangkat yang login", c.x, c.y + 26, 30, { weight: 900 });
      const rows = Wb.DEVICES.filter((d, i) => !(st.removed && i === 2));
      box(ctx, c.x, c.y + 52, c.w, 96 * rows.length + 20);
      const out = { rows: [] };
      rows.forEach((d, i) => { const y = c.y + 62 + i * 96, bad = d.bad, hl = st.hlRow === i;
        if (hl) { ctx.fillStyle = bad ? "#FDF1F0" : "#FFF3D6"; rr(ctx, c.x + 6, y, c.w - 12, 88, 12); ctx.fill(); ctx.strokeStyle = bad ? RED : C.accent; ctx.lineWidth = 3; rr(ctx, c.x + 6, y, c.w - 12, 88, 12); ctx.stroke(); }
        ctx.fillStyle = bad ? "#FBE1DF" : "#E3EEFA"; ctx.beginPath(); ctx.arc(c.x + 46, y + 44, 24, 0, Math.PI * 2); ctx.fill(); HP.icon(ctx, d.icon, c.x + 46, y + 44, 26, bad ? RED : BLUE);
        text(ctx, d.name, c.x + 86, y + 38, 21, { weight: 800, color: C.ink, fit: c.w - 320 });
        text(ctx, d.where, c.x + 86, y + 66, 16, { weight: 600, color: bad ? RED : INK2, fit: c.w - 320 });
        if (d.self) { ctx.fillStyle = "#DDF3E4"; rr(ctx, c.x + c.w - 196, y + 28, 170, 34, 17); ctx.fill(); text(ctx, "Perangkat ini", c.x + c.w - 111, y + 51, 17, { align: "center", weight: 800, color: GREEN }); out.rows.push(null); }
        else { const b = Wb.btn(ctx, c.x + c.w - 170, y + 22, 144, 44, "Keluarkan", { outline: true, ink: RED, size: 18, hl: st.hl === "keluar" && bad }); out.rows.push(b); }
        if (i < rows.length - 1) { ctx.fillStyle = LINE; ctx.fillRect(c.x + 86, y + 92, c.w - 110, 1.5); }
      });
      if (st.dialog) { const u = ease(clamp(st.dialog, 0, 1)); ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = "rgba(15,22,28,0.35)"; ctx.fillRect(c.x - 400, c.y - 200, c.w + 800, 1200);
        const dw = Math.min(520, c.w - 20), dx = c.x + (c.w - dw) / 2, dy = c.y + 120; box(ctx, dx, dy, dw, 250);
        text(ctx, "Keluarkan perangkat ini?", dx + 30, dy + 52, 25, { weight: 900 });
        para(ctx, "Komputer itu harus login lagi dengan kata sandi dan kode dari HP-mu.", dx + 30, dy + 96, 18, dw - 60, { weight: 600, color: INK2 });
        Wb.btn(ctx, dx + dw - 330, dy + 172, 140, 50, "Batal", { outline: true, size: 18 });
        out.ok = Wb.btn(ctx, dx + dw - 176, dy + 172, 150, 50, "Keluarkan", { fill: RED, size: 18, hl: st.hl === "ok" }); ctx.restore(); }
      if (st.toast) { const w = 340, x = c.x + (c.w - w) / 2, y = c.y + 310; ctx.save(); ctx.globalAlpha = clamp(st.toast, 0, 1); ctx.fillStyle = "rgba(31,42,51,0.92)"; rr(ctx, x, y, w, 50, 25); ctx.fill(); text(ctx, "Perangkat dikeluarkan.", x + w / 2, y + 32, 19, { align: "center", weight: 700, color: "#FFFFFF" }); ctx.restore(); }
      return out;
    },
    ganti_sandi(ctx, c, st) {
      text(ctx, "Ganti kata sandi", c.x, c.y + 26, 30, { weight: 900 });
      box(ctx, c.x, c.y + 52, c.w, 400);
      const fw = Math.min(480, c.w - 60);
      const a = field(ctx, c.x + 30, c.y + 120, fw, "Kata sandi lama", st.old || "", { secret: true, focus: st.focus === "old", caret: true });
      const b = field(ctx, c.x + 30, c.y + 220, fw, "Kata sandi baru (frasa panjang)", st.neu || "", { secret: true, focus: st.focus === "neu", caret: true });
      const s = Wb.btn(ctx, c.x + 30, c.y + 320, 170, 54, "Simpan", { hl: st.hl === "simpan" });
      if (st.saved) { ctx.fillStyle = "#DDF3E4"; rr(ctx, c.x + 220, c.y + 322, Math.min(330, c.w - 250), 50, 12); ctx.fill(); HP.icon(ctx, "check", c.x + 246, c.y + 347, 22, GREEN); text(ctx, "Kata sandi diganti.", c.x + 268, c.y + 354, 19, { weight: 800, color: GREEN }); }
      return { old: a, neu: b, simpan: s };
    }
  };
  Wb.BACKUP = ["4821 7730", "9064 1258", "3317 8842", "7740 2196", "5583 6021", "1209 4475", "6638 9150", "2975 3304", "8412 6687", "0356 7719"];
  Wb.DEVICES = [
    { icon: "globe", name: "Laptop · Browser", where: "Semarang · aktif sekarang", self: true },
    { icon: "phone", name: "HP Dito", where: "Semarang · 2 jam lalu" },
    { icon: "apps", name: "Komputer tidak dikenal", where: "Kota lain, ±900 km · kemarin, 23.10", bad: true }
  ];

  K.web11 = Wb;
})(typeof window !== "undefined" ? window : globalThis);
