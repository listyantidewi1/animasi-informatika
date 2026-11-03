/* Adegan episode E.3: Keamanan Akun dan Jaringan Dasar. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, sandi.js, jaringan.js, empati.js, akun.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Sd = K.sandi, J = K.jaringan, Em = K.empati, A = K.akun, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.accentDark }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const heading = (ctx, s, y = 230) => text(ctx, s, 960, y, 34, { align: "center", color: C.accentDark, weight: 800 });
  const ACC = [["✉️", "Email"], ["🎮", "Game"], ["📱", "Media sosial"], ["🏦", "Bank"], ["🏫", "Kelas daring"]];
  const TOOLS = [["🔐", "Brankas sandi", "satu sandi induk"], ["🔢", "Kode dua langkah", "sandi + kode"], ["⚙️", "Pengaturan akun", "privasi, sesi"], ["📶", "Router rumah", "dua sandi, WPA"]];
  const code = l => String(100000 + Math.floor(l / 30) * 73177 % 900000).padStart(6, "0");

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 300, 560, 180, 0, { mood: "happy" });
      card(ctx, 520, 260, 1200, 100, { fill: C.bg2, r: 16 }); text(ctx, "kelas VII: panjang · unik · rahasia", 1120, 320, 30, { align: "center", weight: 900, color: C.ink2 });
      arrowIcon(ctx, "down", 1120, 395, 26, C.ink2);
      const n = reveal(l, 3.0, 1.2, 4);
      TOOLS.forEach(([ic, t, s], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 540 + i * 300; card(ctx, x, 430, 270, 230, { fill: "#FFF3D6", stroke: C.accent, lw: 3, r: 16 }); text(ctx, ic, x + 135, 510, 56, { align: "center" }); text(ctx, t, x + 135, 570, 24, { align: "center", weight: 900 }); text(ctx, s, x + 135, 610, 20, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 4) label(ctx, "kelas X: alatnya", 1120, 720);
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 290, 34, { align: "center", color: C.accentDark, weight: 800 });
      [["D7.3", "Kata Sandi Aman dan Rekam Jejak Digital"], ["D9.2", "Jaringan Lokal dan Internet"]].forEach(([c, t], i) => { const x = 360 + i * 640; card(ctx, x, 340, 580, 300, { fill: C.bg2 }); text(ctx, "Episode " + c, x + 290, 430, 50, { align: "center", weight: 900 }); para(ctx, t, x + 290, 500, 30, 520, { align: "center", weight: 700, color: C.ink2 }); });
      if (l > 6) label(ctx, "semua akun, nama, dan kode di sini hanya contoh", 960, 710, { size: 24, color: C.ink2 });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_kunci(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "MAIN DULU TANPA KOMPUTER: SATU KUNCI UNTUK SEMUA PINTU");
      const stolen = l > 4, diff = l > 8;
      ACC.forEach(([ic, n], i) => A.account(ctx, 220 + i * 300, 300, 280, ic, n, diff ? ["k9#Lp2", "mawar-7-bus", "Qz!41ab", "hujan-roda-3", "T7ry#p"][i] : "sinta2011", stolen ? (diff ? (i === 1 ? "open" : "safe") : "open") : null));
      if (stolen) { text(ctx, "🕵️ kartu Game dicuri", 520, 460, 26, { align: "center", weight: 900, color: C.bad }); }
      if (stolen && !diff) label(ctx, "satu sandi: lima pintu terbuka", 960, 560, { color: C.bad });
      if (diff) label(ctx, "lima sandi berbeda: satu pintu terbuka, empat aman", 960, 560, { color: C.good });
      kid(ctx, 1700, 720, 100, { point: true });
    },
    unplugged_dua_kunci(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "BABAK DUA: DUA KARTU UNTUK SATU PINTU");
      card(ctx, 300, 300, 300, 200, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 12 }); text(ctx, "KARTU SANDI", 450, 345, 20, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "mawar-7-bus", 450, 420, 28, { align: "center", weight: 900 });
      text(ctx, "+", 680, 420, 60, { align: "center", weight: 900, color: C.ink2 });
      card(ctx, 760, 300, 300, 200, { fill: "#DCEBF2", stroke: C.kiko, lw: 3, r: 12 }); text(ctx, "KARTU KODE (tiap menit)", 910, 345, 18, { align: "center", weight: 900, color: C.ink2 }); text(ctx, code(l * 2), 910, 420, 36, { align: "center", weight: 900, color: C.kiko }); text(ctx, "menit ke-" + (Math.floor(l / 15) + 1), 910, 470, 16, { align: "center", weight: 700, color: C.muted });
      arrowIcon(ctx, "right", 1120, 400, 40, C.good); Sd.lock(ctx, 1260, 400, 90, { open: l > 7 && l < 11 ? false : false }); text(ctx, "pintu akun", 1260, 500, 20, { align: "center", weight: 800, color: C.ink2 });
      if (l > 6) { card(ctx, 1380, 300, 360, 200, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "🕵️ pencuri", 1560, 345, 22, { align: "center", weight: 900, color: C.bad }); text(ctx, "punya kartu sandi", 1560, 395, 20, { align: "center", weight: 800 }); text(ctx, "tidak punya kartu kode", 1560, 430, 20, { align: "center", weight: 800 }); text(ctx, "✕ tidak bisa masuk", 1560, 475, 22, { align: "center", weight: 900, color: C.bad }); }
      if (l > 9) label(ctx, "itulah verifikasi dua langkah", 960, 620);
    },

    bocor_massal(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SATU SITUS BOCOR, SEMUA PINTU DICOBA", 215);
      J.server(ctx, 330, 420, 140, 200, {}); text(ctx, "situs game" + (l > 1 ? ": BOCOR" : ""), 330, 290, 24, { align: "center", weight: 900, color: l > 1 ? C.bad : C.ink });
      if (l > 2) { card(ctx, 480, 320, 360, 160, { fill: "#fff", stroke: C.bad, lw: 3, r: 10 }); text(ctx, "daftar yang beredar", 660, 350, 16, { weight: 800, color: C.ink2, align: "center" }); ["dito@…  · dito2010", "sinta@… · sinta2011", "bayu@…  · bayu123"].forEach((s, i) => text(ctx, s, 500, 390 + i * 30, 20, { weight: 800, color: i === 0 ? C.bad : C.ink })); }
      if (l > 4) { text(ctx, "🤖 mesin penipu", 1000, 330, 22, { align: "center", weight: 900, color: C.bad }); text(ctx, "mencoba pasangan yang sama", 1000, 360, 18, { align: "center", weight: 700, color: C.ink2 }); text(ctx, "ribuan kali per menit", 1000, 385, 18, { align: "center", weight: 700, color: C.ink2 }); }
      const n = reveal(l, 6, 1.2, 4);
      [["✉️", "Email"], ["📱", "Media sosial"], ["🏦", "Bank"], ["🏫", "Kelas daring"]].forEach(([ic, nm], i) => { if (i < n) { A.account(ctx, 1200, 280 + i * 105, 480, ic, nm, "dito2010", "open"); ctx.strokeStyle = C.bad; ctx.lineWidth = 4; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(1130, 400); ctx.lineTo(1200, 325 + i * 105); ctx.stroke(); ctx.setLineDash([]); } });
      if (n >= 4) label(ctx, "isian kredensial: pasangan yang sama masuk di mana-mana", 960, 740, { size: 24, color: C.bad });
    },
    manajer_sandi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PASSWORD MANAGER: BRANKAS DENGAN SATU SANDI INDUK", 215);
      const n = reveal(l, 1.5, 1.0, 5);
      A.vault(ctx, 260, 270, 620, 430, [["Email", "Vq7!kd92Lm#pa"], ["Game", "r3Zt-8Hn@wQ1"], ["Media sosial", "Xp2$mv61Kz!e"], ["Bank", "Lw9#qa44Rt@u"], ["Kelas daring", "Hd5!zn27Pq#s"]], { n, master: l > 8 ? "kucing oren makan roti tujuh kali" : null });
      const m = reveal(l, 8, 2.2, 3);
      [["🧠", "kamu ingat satu sandi induk: frasa panjang"], ["🎲", "brankas membuat sandi acak berbeda tiap akun"], ["🔢", "dua langkah untuk brankasnya; bawaan HP juga boleh"]].forEach(([ic, t], i) => { ctx.save(); if (i >= m) ctx.globalAlpha = 0.2; card(ctx, 960, 290 + i * 130, 740, 110, { fill: C.bg2, r: 14 }); text(ctx, ic, 1010, 358 + i * 130, 40, { align: "center" }); para(ctx, t, 1060, 338 + i * 130, 24, 600, { weight: 900 }); ctx.restore(); });
    },
    dua_faktor(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DUA BUKTI YANG BERBEDA JENIS", 215);
      const n = reveal(l, 1.5, 3.0, 3);
      [["🧠", "Sesuatu yang kamu TAHU", "kata sandi", C.kiko], ["📱", "Sesuatu yang kamu PUNYA", "HP: autentikator, SMS, kunci fisik", C.accentDark], ["🫆", "Sesuatu yang MELEKAT", "sidik jari, wajah", "#8E6BBF"]].forEach(([ic, t, s, col], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 500; card(ctx, x, 280, 460, 330, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 5, r: 18 }); text(ctx, ic, x + 230, 380, 72, { align: "center" }); text(ctx, t, x + 230, 450, 24, { align: "center", weight: 900, color: col }); para(ctx, s, x + 230, 500, 22, 400, { align: "center", weight: 700, color: C.ink2 }); ctx.restore(); });
      if (n >= 2) { text(ctx, "+", 700, 460, 60, { align: "center", weight: 900, color: C.ink2 }); }
      if (n >= 3) label(ctx, "dua langkah = dua jenis bukti; pencuri sandi tidak punya HP-mu", 960, 690, { size: 26 });
    },
    alur_2fa(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ALUR VERIFIKASI DUA LANGKAH", 215);
      const n = reveal(l, 1.0, 2.6, 4);
      A.login(ctx, 220, 270, 480, n >= 2 ? 1 : 0, { pw: n >= 1 ? "••••••••••••" : "", code: n >= 3 ? code(l) : "", ok: n >= 4 });
      const secs = 30 - (l * 1.0) % 30; A.authApp(ctx, 1000, 460, code(l), secs);
      J.server(ctx, 1500, 420, 130, 200, {});
      const steps = ["1 sandi dikirim, server mencocokkan", "2 server meminta kode", "3 kode dari HP diketik", "4 cocok → masuk"];
      steps.forEach((s, i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 220, 540 + i * 46, 480, 40, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, r: 8 }); text(ctx, s, 236, 567 + i * 46, 18, { weight: 900 }); ctx.restore(); });
      if (l > 11) { card(ctx, 1240, 660, 520, 70, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "🕵️ punya sandi, tanpa HP: berhenti di langkah 2", 1500, 704, 18, { align: "center", weight: 900, color: C.bad }); }
    },
    otp_penipuan(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "KODE OTP: HANYA UNTUK DIKETIK, BUKAN DIBAGIKAN", 215);
      const msgs = [{ who: "Agus", text: "Selamat! Anda menang hadiah. Kirim kode 6 angka yang baru masuk untuk verifikasi.", tone: "bad" }, { who: "Aku", text: "Tidak. Kode ini tidak untuk siapa pun.", tone: "good" }];
      Em.chat(ctx, 220, 270, 720, 420, "Nomor tak dikenal", msgs, { n: reveal(l, 1.5, 4, 2) });
      const n = reveal(l, 6, 1.8, 3);
      [["🎁", "hadiah"], ["⛔", "akun akan diblokir"], ["✅", "verifikasi data"]].forEach(([ic, t], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 1020, 290 + i * 100, 680, 84, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, ic, 1070, 345 + i * 100, 36, { align: "center" }); text(ctx, "alasan apa pun: \"" + t + "\" = penipuan", 1110, 343 + i * 100, 24, { weight: 900 }); ctx.restore(); });
      if (n >= 3) { card(ctx, 1020, 600, 680, 90, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); para(ctx, "bank dan aplikasi tidak pernah meminta kodemu", 1360, 650, 24, 640, { align: "center", weight: 900, color: C.good }); }
    },

    privasi_akun(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "PENGATURAN AKUN: TIGA HAL YANG DIPERIKSA", 215);
      const n = reveal(l, 1.5, 3.0, 3);
      const items = [["👁️", "Privasi", [["profil", "teman saja ✓"], ["unggahan", "teman saja ✓"], ["nomor HP", "disembunyikan ✓"]]], ["🛟", "Pemulihan", [["email cadangan", "masih dipegang ✓"], ["nomor HP", "nomor lama ✕ → perbarui"]]], ["❓", "Pertanyaan keamanan", [["\"nama sekolah?\"", "bisa dicari ✕"], ["jawaban acak dari brankas", "✓"]]]];
      items.forEach(([ic, t, rows], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 230 + i * 500; card(ctx, x, 270, 460, 400, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 16 }); text(ctx, ic + " " + t, x + 230, 320, 26, { align: "center", weight: 900 }); rows.forEach(([k, v], r) => { card(ctx, x + 24, 350 + r * 90, 412, 74, { fill: "#fff", stroke: "#C9D4DB", lw: 2, r: 10 }); text(ctx, k, x + 40, 380 + r * 90, 18, { weight: 800, color: C.ink2 }); text(ctx, v, x + 40, 410 + r * 90, 19, { weight: 900, color: v.includes("✕") ? C.bad : C.good }); }); ctx.restore(); });
    },
    sesi_aktif(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "SESI AKTIF: SIAPA SAJA YANG SEDANG MASUK?", 215);
      const n = reveal(l, 1.0, 1.4, 4);
      A.sessions(ctx, 240, 260, 760, [["📱 HP Android (ini)", "Bandung", "sekarang", false], ["💻 Laptop keluarga", "Bandung", "2 jam lalu", false], ["🖥️ Windows · browser", "warnet, Bandung", "7 hari lalu", n >= 4], ["🖥️ Windows · browser", "kota lain", "kemarin 23.10", n >= 4]].slice(0, n), { kick: l > 8 });
      if (l > 8) { card(ctx, 1080, 300, 620, 160, { fill: C.badBg, stroke: C.bad, lw: 3, r: 14 }); text(ctx, "tidak dikenal → Keluarkan", 1390, 350, 26, { align: "center", weight: 900, color: C.bad }); text(ctx, "lalu ganti sandi, cek dua langkah", 1390, 400, 22, { align: "center", weight: 800, color: C.ink2 }); }
      if (l > 12) { card(ctx, 1080, 500, 620, 160, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); text(ctx, "🔔 pemberitahuan perangkat baru: NYALA", 1390, 560, 24, { align: "center", weight: 900, color: C.good }); text(ctx, "kamu tahu lebih dulu daripada pencurinya", 1390, 605, 20, { align: "center", weight: 800, color: C.ink2 }); }
    },
    router_dua_sandi(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "ROUTER RUMAH PUNYA DUA SANDI", 215);
      J.router(ctx, 460, 480, 180, {}); J.waves(ctx, 460, 440, 60, 3, { color: C.kiko }); ctx.globalAlpha = 1;
      A.sticker(ctx, 300, 560, 320);
      const n = reveal(l, 1.5, 2.8, 3);
      [["📶 Sandi Wi-Fi", "untuk tersambung ke jaringan", "ganti dari bawaan, panjang"], ["🔧 Sandi admin", "untuk mengubah pengaturan router", "admin/admin → GANTI sekarang"], ["🏷️ Nama Wi-Fi", "terlihat semua tetangga", "jangan nama keluarga atau alamat"]].forEach(([t, s, a], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, 780, 280 + i * 140, 920, 120, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, t, 810, 322 + i * 140, 26, { weight: 900 }); text(ctx, s, 810, 356 + i * 140, 20, { weight: 700, color: C.ink2 }); text(ctx, a, 1670, 345 + i * 140, 22, { align: "right", weight: 900, color: i === 1 ? C.bad : C.good }); ctx.restore(); });
      if (n >= 2) { ctx.strokeStyle = C.bad; ctx.lineWidth = 5; rr(ctx, 306, 628, 300, 36, 6); ctx.stroke(); text(ctx, "sama untuk ribuan router", 460, 700, 20, { align: "center", weight: 900, color: C.bad }); }
    },
    wpa_tamu(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "WPA2/WPA3, JARINGAN TAMU, FIRMWARE", 215);
      const n = reveal(l, 1.5, 2.6, 3);
      A.routerPanel(ctx, 240, 260, 640, [["Keamanan Wi-Fi", n >= 1 ? "WPA3 / WPA2" : "Terbuka", n >= 1], ["Jaringan tamu", n >= 2 ? "Nyala · terpisah" : "Mati", n >= 2], ["Firmware", n >= 3 ? "Terbaru" : "2021", n >= 3], ["Sandi admin", "sudah diganti", true]]);
      const house = (x, lab, col, items) => { card(ctx, x, 290, 360, 300, { fill: "#fff", stroke: col, lw: 4, r: 16 }); text(ctx, lab, x + 180, 330, 22, { align: "center", weight: 900, color: col }); items.forEach((s, i) => text(ctx, s, x + 180, 390 + i * 44, 22, { align: "center", weight: 800 })); };
      if (n >= 2) { house(960, "JARINGAN UTAMA", C.kiko, ["💻 laptop keluarga", "📱 HP keluarga"]); house(1340, "JARINGAN TAMU", C.accentDark, ["🧑‍🤝‍🧑 tamu", "💡 lampu pintar", "📺 TV pintar"]); }
      if (n >= 1) { text(ctx, "🔒 lalu lintas Wi-Fi terenkripsi: tidak bisa disadap dari luar", 1140, 660, 22, { align: "center", weight: 900, color: C.good }); }
    },
    wifi_publik(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "WI-FI PUBLIK: HATI-HATI", 215);
      const n = reveal(l, 1.0, 2.6, 4);
      ctx.save(); if (n < 1) ctx.globalAlpha = 0.2; card(ctx, 240, 280, 440, 380, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 16 }); text(ctx, "Jaringan tersedia", 460, 320, 20, { align: "center", weight: 900, color: C.ink2 }); [["Kafe-Kopi", true], ["Kafe-Kopi-Gratis", false], ["WiFi-Gratis-Cepat", false]].forEach(([nm, ok], i) => { card(ctx, 264, 350 + i * 80, 392, 64, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 2, r: 10 }); text(ctx, "📶 " + nm, 280, 390 + i * 80, 20, { weight: 900 }); text(ctx, ok ? "resmi (tanya kasir)" : "palsu?", 640, 390 + i * 80, 16, { align: "right", weight: 800, color: ok ? C.good : C.bad }); }); text(ctx, "nama bisa ditiru siapa saja", 460, 640, 18, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
      [["🔒", "HTTPS dengan gembok", "alamat https:// dan ikon gembok"], ["🚫", "hindari transaksi", "bank, belanja, akun penting: nanti saja"], ["📴", "matikan sambung otomatis", "ke Wi-Fi terbuka"]].forEach(([ic, t, s], i) => { ctx.save(); if (i + 2 > n) ctx.globalAlpha = 0.2; card(ctx, 740, 290 + i * 125, 960, 105, { fill: C.bg2, r: 14 }); text(ctx, ic, 790, 355 + i * 125, 40, { align: "center" }); text(ctx, t, 840, 335 + i * 125, 26, { weight: 900 }); text(ctx, s, 840, 372 + i * 125, 20, { weight: 700, color: C.ink2 }); ctx.restore(); });
    },
    checklist(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      heading(ctx, "DAFTAR PERIKSA ENAM LANGKAH", 215);
      const items = ["Password manager + sandi induk", "Dua langkah di email dan akun penting", "Periksa sesi aktif", "Ganti sandi admin router", "WPA2/WPA3 + jaringan tamu", "Hati-hati di Wi-Fi publik"];
      const n = reveal(l, 1.2, 1.5, 6);
      items.forEach((t, i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const x = 240 + (i % 2) * 740, y = 270 + Math.floor(i / 2) * 130; card(ctx, x, y, 700, 110, { fill: C.goodBg, stroke: C.good, lw: 3, r: 14 }); ctx.strokeStyle = C.good; ctx.lineWidth = 4; rr(ctx, x + 20, y + 33, 44, 44, 8); ctx.stroke(); text(ctx, "✓", x + 42, y + 68, 34, { align: "center", weight: 900, color: C.good }); text(ctx, (i + 1) + ". " + t, x + 84, y + 66, 24, { weight: 900 }); ctx.restore(); });
      if (n >= 6) label(ctx, "enam langkah, satu sore bersama orang tua", 960, 700);
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Simulasi dua langkah", "termasuk saat penipu mencoba", (x, y) => { ctx.save(); ctx.translate(x - 190, y - 100); ctx.scale(0.75, 0.75); A.login(ctx, 0, 0, 500, 1, { pw: "••••••••", code: "4 8 2 _ _ _" }); ctx.restore(); }],
        ["Audit akun fiktif", "temukan lima masalah", (x, y) => [["sandi = nama+tahun", false], ["dua langkah: mati", false], ["email cadangan: lama", false], ["profil: teman saja", true]].forEach(([t, ok], i) => { card(ctx, x - 190, y - 100 + i * 52, 380, 44, { fill: ok ? C.goodBg : C.badBg, stroke: ok ? C.good : C.bad, lw: 2, r: 10 }); text(ctx, (ok ? "✓ " : "✕ ") + t, x - 175, y - 72 + i * 52, 19, { weight: 900, color: ok ? C.good : C.bad }); })],
        ["Atur router fiktif", "sampai semua lampu hijau", (x, y) => { ctx.save(); ctx.translate(x - 200, y - 110); ctx.scale(0.7, 0.7); A.routerPanel(ctx, 0, 0, 560, [["Sandi admin", "admin ✕", false], ["Keamanan", "WPA2 ✓", true], ["Jaringan tamu", "mati ✕", false]]); ctx.restore(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 440 + i * 520; card(ctx, x - 240, 290, 480, 410, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); text(ctx, t1, x - 160, 352, 28, { weight: 900 }); text(ctx, t2, x - 160, 386, 20, { weight: 700, color: C.ink2 }); draw(x, 560); });
      text(ctx, "di halaman latihan episode ini — lalu rapikan akun dan router bersama orang tua", 960, 745, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
