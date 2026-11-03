/* Adegan episode D7.2: Mengenal Komputer — perjalanan satu ketukan. Muat setelah kiko-core.js, kiko-devices.js, komputer.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, M = K.komp, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const label = (ctx, s, x, y, col) => text(ctx, s, x, y, 28, { align: "center", weight: 800, color: col || C.ink2 });

  Object.assign(SCENES, {
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.0", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Cara Memakai Komputer dan HP", 960, 500, 52, { align: "center", weight: 700, color: C.ink2 });
      ["Mouse", "Keyboard", "File & folder"].forEach((s, i) => { card(ctx, 480 + i * 340, 580, 300, 120, { fill: C.bg2 }); text(ctx, s, 630 + i * 340, 652, 34, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      kid(ctx, 420, 560, 200, { point: true }); kid(ctx, 960, 560, 200, { hair: "long" }); kid(ctx, 1500, 560, 200, { hairColor: "#4A3A2A" });
      const ph = Math.floor((l / 2.2) % 3);
      if (ph === 0) bubble(ctx, 300, 360, 300, "psst… bakso", 32, { tailX: 420, tailDir: 0 });
      if (ph === 1) { ctx.fillStyle = "#FFF3B0"; rr(ctx, 1060, 300, 200, 140, 8); ctx.fill(); text(ctx, "bakso", 1160, 385, 36, { align: "center", weight: 900 }); }
      if (ph === 2) bubble(ctx, 1340, 360, 340, "BAKSO!", 44, { tailX: 1500, tailDir: 0, fill: C.goodBg, stroke: C.good, color: C.good });
      ["membisikkan", "menulis", "membacakan"].forEach((s, i) => label(ctx, s, 420 + i * 540, 820));
    },
    unplugged_roles(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 420, 450, 170, { point: true }); kid(ctx, 960, 450, 170, { hair: "long" }); kid(ctx, 1500, 450, 170, { hairColor: "#4A3A2A" });
      const n = reveal(l, 0.8, 1.1, 3); const names = ["INPUT", "PROSES", "OUTPUT"];
      names.forEach((s, i) => { if (i >= n) return; card(ctx, 260 + i * 540, 650, 320, 90, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, s, 420 + i * 540, 708, 36, { align: "center", weight: 900 }); if (i) M.arrow(ctx, 600 + (i - 1) * 540, 695, 740 + (i - 1) * 540, 695, { color: C.accentDark }); });
      if (n >= 3) text(ctx, "komputer bekerja seperti barisan ini", 960, 800, 32, { align: "center", color: C.ink2, weight: 800 });
    },

    input_intro(ctx, b, l) {
      M.board(ctx, { show: 1, stage: 0, key: l > 1.5 });
      const items = [["keyboard", "huruf & angka"], ["mouse", "gerakan & klik"]]; const n = reveal(l, 2.0, 1.2, 2);
      items.forEach(([t1, t2], i) => { if (i >= n) return; card(ctx, 760 + i * 440, 300, 400, 200, { fill: C.bg2 }); text(ctx, t1, 960 + i * 440, 380, 40, { align: "center", weight: 900 }); text(ctx, "memasukkan " + t2, 960 + i * 440, 440, 28, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "alat untuk memasukkan sesuatu ke komputer", 960, 680, 34, { align: "center", color: C.accentDark, weight: 800 });
    },
    input_more(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "ALAT INPUT (masukan)", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const items = [["layar sentuh", (x, y) => { D.phone(ctx, x, y, 90, 160); D.finger(ctx, x + 10, y + 10, { s: 20, press: true }); }], ["mikrofon", (x, y) => M.mic(ctx, x, y, 110)], ["kamera", (x, y) => M.camera(ctx, x, y, 110)], ["scanner", (x, y) => M.scanner(ctx, x, y, 120)]];
      const n = reveal(l, 0.6, 1.0, 4);
      items.forEach(([t, draw], i) => { if (i >= n) return; const x = 330 + i * 420; card(ctx, x - 160, 290, 320, 420, { fill: C.bg2 }); draw(x, 450); text(ctx, t, x, 650, 34, { align: "center", weight: 900 }); });
      if (n >= 4) text(ctx, "cuma memasukkan, tidak berpikir", 960, 800, 34, { align: "center", color: C.ink2, weight: 800 });
    },
    input_signal(ctx, b, l) {
      const u = clamp((l - 1.5) / 2.5, 0, 1);
      D.keyboard(ctx, 160, 300, 700, { pressed: l > 0.8 ? ["H"] : [] });
      ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(880, 480); ctx.lineTo(1150, 480); ctx.lineTo(1150, 560); ctx.lineTo(1420, 560); ctx.stroke();
      card(ctx, 1420, 380, 380, 360, { fill: "#2B3A46" }); text(ctx, "komputer", 1610, 440, 30, { align: "center", color: "#fff", weight: 800 }); M.chip(ctx, 1610, 580, 110, { hot: u >= 1 });
      if (l > 0.8) { const path = [[880, 480], [1150, 480], [1150, 560], [1420, 560]]; M.pulse(ctx, path, u * 3, "H"); }
      card(ctx, 160, 190, 700, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, l > 0.8 ? "kode: tombol nomor 35 ditekan" : "H ditekan…", 510, 242, 32, { align: "center", weight: 900 });
      text(ctx, "bukan huruf, melainkan kode listrik", 1610, 800, 28, { align: "center", color: C.ink2, weight: 800 });
    },

    cpu_intro(ctx, b, l) {
      const u = clamp((l - 0.5) / 1.5, 0, 1); M.board(ctx, { show: 2, stage: 1, u: 1 + u, key: true });
      if (u >= 1) { bubble(ctx, 760, 700, 520, "Oh, ini huruf H. Tampilkan di layar!", 32, { tailX: 850, tailDir: 0, fill: "#FFF3D6", stroke: C.accent }); }
      text(ctx, "prosesor (CPU): otak komputer", 960, 820, 34, { align: "center", color: C.accentDark, weight: 800 });
    },
    cpu_speed(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      M.chip(ctx, 500, 520, 260, { hot: true });
      const n = Math.floor(Math.max(0, l - 0.5) * 1e9).toLocaleString("id-ID");
      card(ctx, 900, 300, 760, 200, { fill: C.bg2 }); text(ctx, "langkah kecil tiap detik:", 1280, 360, 30, { align: "center", color: C.ink2, weight: 700 }); text(ctx, "miliaran", 1280, 450, 64, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 900, 540, 760, 200, { fill: C.bg2 }); text(ctx, "tetapi hanya menjalankan perintah,", 1280, 610, 30, { align: "center", color: C.ink2, weight: 700 }); text(ctx, "seperti Kiko di episode robot", 1280, 670, 32, { align: "center", weight: 900 });
      kiko(ctx, 1700, 760, 100, 0);
    },
    ram_intro(ctx, b, l) {
      const typed = "HALO".slice(0, reveal(l, 1.0, 0.8, 4));
      M.board(ctx, { show: 2, stage: 1, ramCells: typed.split("") });
      D.textBox(ctx, 760, 660, 800, 100, [typed], l, { size: 48 });
      text(ctx, "RAM: meja kerja prosesor, memori sementara", 960, 830, 34, { align: "center", color: C.accentDark, weight: 800 });
    },
    ram_volatile(ctx, b, l) {
      const off = l > 3.0;
      card(ctx, 120, 150, 1680, 740);
      // papan tulis
      ctx.fillStyle = "#2E6B4F"; rr(ctx, 200, 240, 760, 480, 14); ctx.fill(); ctx.strokeStyle = "#C98A57"; ctx.lineWidth = 16; rr(ctx, 200, 240, 760, 480, 14); ctx.stroke();
      if (!off) text(ctx, "HALO", 580, 500, 110, { align: "center", color: "#fff", weight: 900 });
      else { ctx.fillStyle = "rgba(255,255,255,0.08)"; for (let i = 0; i < 6; i++) { rr(ctx, 260 + i * 110, 400, 90, 60, 20); ctx.fill(); } text(ctx, "(terhapus)", 580, 500, 44, { align: "center", color: "#9AAFA6", weight: 700 }); }
      text(ctx, "RAM = papan tulis", 580, 780, 34, { align: "center", weight: 900 });
      // tombol daya
      ctx.fillStyle = off ? C.bad : C.good; ctx.beginPath(); ctx.arc(1400, 440, 90, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(1400, 445, 45, -1.1, 4.25); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1400, 380); ctx.lineTo(1400, 440); ctx.stroke();
      text(ctx, off ? "komputer dimatikan" : "komputer menyala", 1400, 600, 36, { align: "center", weight: 900, color: off ? C.bad : C.good });
      if (off) text(ctx, "tulisan yang belum disimpan hilang", 1400, 680, 30, { align: "center", color: C.ink2, weight: 800 });
    },
    output_intro(ctx, b, l) {
      const u = clamp((l - 0.5) / 1.5, 0, 1); M.board(ctx, { show: 3, stage: 2, u: 2 + u * 2, screen: u >= 1 ? "H" : "", sound: u >= 1 });
      const n = reveal(l, 2.5, 1.0, 3); const items = [["layar", "menampilkan"], ["speaker", "membunyikan"], ["printer", "mencetak"]];
      items.forEach(([t1, t2], i) => { if (i >= n) return; card(ctx, 300 + i * 460, 640, 420, 110, { fill: C.bg2 }); text(ctx, t1 + ": " + t2, 510 + i * 460, 706, 32, { align: "center", weight: 900 }); if (i === 2) M.printer(ctx, 1720, 690, 56, { text: "H" }); });
      text(ctx, "alat output (keluaran)", 960, 830, 34, { align: "center", color: C.accentDark, weight: 800 });
    },
    ipo_flow(ctx, b, l) {
      const u = ((l * 1.2) % 5); M.board(ctx, { show: 3, u: u > 4 ? undefined : u, screen: u > 3.5 ? "H" : "", key: u < 1 });
      card(ctx, 360, 640, 1200, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "input → proses → output", 960, 690, 40, { align: "center", weight: 900 }); text(ctx, "keyboard → prosesor → layar", 960, 730, 28, { align: "center", color: C.ink2, weight: 700 });
      text(ctx, "lebih cepat dari kedipan mata", 960, 830, 32, { align: "center", color: C.ink2, weight: 800 });
    },

    storage_intro(ctx, b, l) {
      const u = clamp((l - 1.0) / 1.5, 0, 1); M.board(ctx, { show: 4, stage: 3, ramCells: u < 1 ? ["H", "A", "L", "O"] : [] });
      if (u > 0 && u < 1) { const y = lerp(380, 740, ease(u)); card(ctx, 880, y - 30, 160, 60, { fill: "#FFF3D6", stroke: C.accent, lw: 3 }); text(ctx, "HALO", 960, y + 10, 30, { align: "center", weight: 900 }); }
      if (u >= 1) text(ctx, "tersimpan ✓", 960, 870, 30, { align: "center", color: C.good, weight: 900 });
      text(ctx, "tempat penyimpanan (storage): hard disk, SSD, memori HP", 960, 230, 32, { align: "center", color: C.accentDark, weight: 800 });
    },
    storage_vs_ram(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      card(ctx, 180, 220, 760, 580, { fill: C.bg2 }); card(ctx, 980, 220, 760, 580, { fill: C.bg2 });
      M.ram(ctx, 300, 320, 520, 110, { cells: l > 4 ? [] : ["H", "A", "L", "O"], label: false }); text(ctx, "RAM", 560, 290, 36, { align: "center", weight: 900 });
      text(ctx, "papan tulis", 560, 520, 34, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "cepat, tetapi lupa", 560, 600, 40, { align: "center", weight: 900, color: C.bad });
      text(ctx, "saat dimatikan: kosong", 560, 680, 28, { align: "center", color: C.ink2, weight: 700 });
      M.disk(ctx, 1360, 380, 110, { full: 0.6 }); text(ctx, "PENYIMPANAN", 1360, 290, 36, { align: "center", weight: 900 });
      text(ctx, "buku catatan", 1360, 520, 34, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "lambat, tetapi ingat", 1360, 600, 40, { align: "center", weight: 900, color: C.good });
      text(ctx, "saat dimatikan: tetap ada", 1360, 680, 28, { align: "center", color: C.ink2, weight: 700 });
    },
    storage_kinds(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MACAM-MACAM PENYIMPANAN", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const items = [["hard disk", (x, y) => M.disk(ctx, x, y, 90)], ["SSD", (x, y) => M.ssd(ctx, x, y, 110)], ["flashdisk", (x, y) => M.flashdisk(ctx, x, y, 130)], ["kartu memori", (x, y) => M.sdcard(ctx, x, y, 110)], ["cloud (internet)", (x, y) => M.cloud(ctx, x, y, 80)]];
      const n = reveal(l, 0.6, 0.9, 5);
      items.forEach(([t, draw], i) => { if (i >= n) return; const x = 300 + i * 330; card(ctx, x - 140, 290, 280, 380, { fill: C.bg2 }); draw(x, 440); text(ctx, t, x, 620, 28, { align: "center", weight: 900 }); });
      if (n >= 5) { D.fileIcon(ctx, 760, 740, 56, "tulisan", {}); D.fileIcon(ctx, 860, 740, 56, "foto", {}); D.fileIcon(ctx, 960, 740, 64, "folder", {}); text(ctx, "semuanya menyimpan file dan folder", 1300, 752, 30, { align: "center", color: C.ink2, weight: 800 }); }
    },
    full_flow(ctx, b, l) {
      const u = ((l * 1.1) % 6); M.board(ctx, { show: 4, u: u > 4 ? undefined : u, screen: u > 3.5 ? "H" : "", key: u < 1, stage: u > 4.5 ? 3 : undefined });
      text(ctx, "empat bagian di setiap komputer, besar maupun kecil", 960, 870, 32, { align: "center", color: C.accentDark, weight: 800 });
    },

    hardware(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "HARDWARE (perangkat keras)", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const items = [["keyboard", (x, y) => D.keyboard(ctx, x - 130, y - 50, 260, {})], ["prosesor", (x, y) => M.chip(ctx, x, y, 110)], ["layar", (x, y) => D.monitor(ctx, x - 110, y - 80, 220, 130)], ["hard disk", (x, y) => M.disk(ctx, x, y, 90)]];
      const n = reveal(l, 0.6, 0.9, 4);
      items.forEach(([t, draw], i) => { if (i >= n) return; const x = 330 + i * 420; card(ctx, x - 170, 290, 340, 420, { fill: C.bg2 }); draw(x, 450); text(ctx, t, x, 660, 32, { align: "center", weight: 900 }); });
      if (n >= 4) text(ctx, "bisa dipegang", 960, 810, 40, { align: "center", weight: 900 });
    },
    software(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const sc = D.monitor(ctx, 240, 260, 700, 420);
      const on = l > 1.8;
      if (!on) { ctx.fillStyle = "#2B3A46"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 10); ctx.fill(); text(ctx, "…", sc.x + sc.w / 2, sc.y + sc.h / 2 + 20, 80, { align: "center", color: "#6B7B88" }); }
      else { const win = D.windowFrame(ctx, sc.x + 30, sc.y + 30, sc.w - 60, sc.h - 60, "Pengolah kata"); text(ctx, "Halo, Ibu.", win.x + 20, win.y + 60, 40, { weight: 700 }); }
      text(ctx, on ? "hardware + software: bekerja" : "hardware saja: kotak diam", 590, 820, 34, { align: "center", weight: 900, color: on ? C.good : C.ink2 });
      card(ctx, 1080, 300, 640, 380, { fill: on ? "#FFF3D6" : C.bg2, stroke: on ? C.accent : "#D7E2DC", lw: 4 });
      text(ctx, "SOFTWARE", 1400, 380, 34, { align: "center", color: C.accentDark, weight: 800 }); text(ctx, "(perangkat lunak)", 1400, 430, 30, { align: "center", color: C.ink2, weight: 700 });
      text(ctx, "program yang memberi perintah", 1400, 530, 32, { align: "center", weight: 900 }); text(ctx, "tidak bisa dipegang", 1400, 600, 32, { align: "center", color: C.ink2, weight: 800 });
      if (on) M.arrow(ctx, 1080, 490, 960, 490, { color: C.accentDark });
    },
    os_apps(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.6, 1.4, 2);
      if (n >= 1) { card(ctx, 180, 240, 760, 560, { fill: C.bg2 }); text(ctx, "SISTEM OPERASI", 560, 320, 36, { align: "center", weight: 900 }); text(ctx, "(operating system)", 560, 365, 28, { align: "center", color: C.ink2, weight: 700 }); text(ctx, "mengatur seluruh komputer", 560, 440, 30, { align: "center", weight: 800, color: C.accentDark }); ["Windows", "Android", "iOS"].forEach((s, i) => { card(ctx, 250 + i * 210, 520, 180, 90, { fill: C.panel }); text(ctx, s, 340 + i * 210, 578, 30, { align: "center", weight: 900 }); }); text(ctx, "di laptop, di HP", 560, 700, 28, { align: "center", color: C.ink2, weight: 700 }); }
      if (n >= 2) { card(ctx, 980, 240, 760, 560, { fill: C.bg2 }); text(ctx, "APLIKASI", 1360, 320, 36, { align: "center", weight: 900 }); text(ctx, "(app)", 1360, 365, 28, { align: "center", color: C.ink2, weight: 700 }); text(ctx, "untuk satu tugas tertentu", 1360, 440, 30, { align: "center", weight: 800, color: C.accentDark }); [["kamera", "#2E7E9A"], ["game", "#D9443B"], ["pengolah kata", "#2E9E5B"]].forEach(([s, col], i) => { ctx.fillStyle = col; rr(ctx, 1060 + i * 210, 500, 150, 150, 30); ctx.fill(); text(ctx, s, 1135 + i * 210, 700, 26, { align: "center", weight: 800 }); }); }
    },
    hw_sw_pair(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      // angkot dan sopir
      ctx.fillStyle = "#4C9BE0"; rr(ctx, 300, 420, 520, 200, 30); ctx.fill(); ctx.fillStyle = "#DCEBFF"; rr(ctx, 340, 450, 160, 90, 12); ctx.fill(); rr(ctx, 540, 450, 240, 90, 12); ctx.fill();
      ctx.fillStyle = "#1F2A33"; [400, 720].forEach(x => { ctx.beginPath(); ctx.arc(x, 630, 46, 0, Math.PI * 2); ctx.fill(); });
      text(ctx, "ANGKOT", 560, 700, 30, { align: "center", color: "#fff", weight: 900 });
      if (l > 1.5) kid(ctx, 420, 470, 90, {});
      text(ctx, "angkot = hardware", 560, 740, 32, { align: "center", weight: 900 }); text(ctx, l > 1.5 ? "sopir = software" : "tanpa sopir: diam", 560, 785, 32, { align: "center", weight: 900, color: l > 1.5 ? C.good : C.bad });
      card(ctx, 1000, 260, 720, 520, { fill: C.bg2 });
      text(ctx, "saling butuh", 1360, 340, 40, { align: "center", weight: 900 });
      text(ctx, "hardware tanpa software:", 1360, 440, 30, { align: "center", color: C.ink2, weight: 700 }); text(ctx, "kotak diam", 1360, 490, 36, { align: "center", weight: 900, color: C.bad });
      text(ctx, "software tanpa hardware:", 1360, 600, 30, { align: "center", color: C.ink2, weight: 700 }); text(ctx, "tidak punya tempat berjalan", 1360, 650, 36, { align: "center", weight: 900, color: C.bad });
    },

    phone_is_computer(ctx, b, l) {
      const sc = D.phone(ctx, 560, 520, 360, 680); D.appGrid(ctx, sc);
      const tags = [["INPUT: layar sentuh, mikrofon", 1000, 300, 560, 330], ["PROSES: prosesor + RAM di dalam", 1000, 420, 560, 520], ["OUTPUT: layar, speaker", 1000, 540, 560, 620], ["PENYIMPANAN: memori HP", 1000, 660, 560, 760]];
      const n = reveal(l, 0.8, 1.1, 4);
      tags.forEach(([s, x, y, tx, ty], i) => { if (i >= n) return; card(ctx, x, y - 50, 760, 80, { fill: i === 1 ? "#FFF3D6" : C.bg2, stroke: i === 1 ? C.accent : "#D7E2DC", lw: 3 }); text(ctx, s, x + 24, y + 2, 30, { weight: 800 }); ctx.strokeStyle = "#9AAFA6"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(tx + 180, ty); ctx.stroke(); });
      if (n >= 4) text(ctx, "HP juga komputer", 1380, 800, 40, { align: "center", weight: 900, color: C.accentDark });
    },
    everywhere(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const items = [["mesin kasir", (x, y) => { D.monitor(ctx, x - 90, y - 90, 180, 110); text(ctx, "Rp13.000", x, y - 30, 26, { align: "center", weight: 900 }); }], ["ATM", (x, y) => { ctx.fillStyle = "#6B7B88"; rr(ctx, x - 100, y - 130, 200, 260, 16); ctx.fill(); ctx.fillStyle = "#8FD0E6"; rr(ctx, x - 70, y - 100, 140, 90, 8); ctx.fill(); D.keyboard(ctx, x - 60, y + 10, 120, {}); }], ["smart TV", (x, y) => { ctx.fillStyle = "#2B3A46"; rr(ctx, x - 150, y - 90, 300, 180, 10); ctx.fill(); ctx.fillStyle = "#8FD0E6"; rr(ctx, x - 138, y - 78, 276, 156, 6); ctx.fill(); }]];
      const n = reveal(l, 0.6, 1.0, 3);
      items.forEach(([t, draw], i) => { if (i >= n) return; const x = 400 + i * 560; card(ctx, x - 220, 250, 440, 440, { fill: C.bg2 }); draw(x, 440); text(ctx, t, x, 650, 32, { align: "center", weight: 900 }); });
      if (n >= 3) { card(ctx, 360, 740, 1200, 100, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "bentuk beda, empat bagian sama: input, proses, output, penyimpanan", 960, 800, 30, { align: "center", weight: 900 }); }
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Kelompokkan alat", "input, proses, output, atau penyimpanan?", (x, y) => { M.mic(ctx, x - 60, y, 50); M.chip(ctx, x + 50, y, 60); }], ["Urutkan perjalanan", "satu ketukan dari keyboard ke layar", (x, y) => { D.keyboard(ctx, x - 110, y - 30, 100, {}); M.arrow(ctx, x - 5, y, x + 25, y, { lw: 6 }); M.chip(ctx, x + 60, y, 50); }], ["Hardware atau software?", "pilah yang bisa dipegang", (x, y) => { D.mouse(ctx, x - 50, y, 50, {}); ctx.fillStyle = "#2E9E5B"; rr(ctx, x + 20, y - 35, 70, 70, 14); ctx.fill(); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 240, 290, 480, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 190, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 190, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 600, 32, { align: "center", weight: 900 }); text(ctx, t2, x, 650, 24, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu coba sebutkan empat bagian pada HP di rumahmu", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
