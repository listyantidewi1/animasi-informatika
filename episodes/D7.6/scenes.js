/* Adegan episode D7.6: Data Terstruktur di Sekitar Kita. Muat setelah kiko-core.js, kiko-devices.js, struktur.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Q = K.struktur, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, bubble, rr, ease, clamp, lerp, arrowIcon } = H;
  const reveal = (l, t0, step, n) => clamp(Math.floor((l - t0) / step) + 1, 0, n);
  const banner = (ctx, s, y = 745, w = 1000, opt = {}) => { card(ctx, 960 - w / 2, y, w, 80, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4 }); text(ctx, s, 960, y + 52, opt.size || 34, { align: "center", weight: 900, color: opt.color || C.ink }); };
  const label = (ctx, s, x, y, opt = {}) => text(ctx, s, x, y, opt.size || 28, { align: "center", weight: 900, color: opt.color || C.accentDark });
  const NAMES = ["Dito", "Sinta", "Rani", "Bayu", "Tari", "Agus", "Lina"];
  const JADWAL = { header: ["Hari", "Jam 1", "Jam 2", "Jam 3", "Jam 4"], rows: [["Senin", "Upacara", "Matematika", "Informatika", "IPA"], ["Selasa", "B. Indonesia", "IPS", "Seni", "PJOK"], ["Rabu", "IPA", "B. Inggris", "Matematika", "Prakarya"], ["Kamis", "Agama", "PKn", "B. Indonesia", "Informatika"], ["Jumat", "Senam", "Matematika", "IPS", "Pramuka"]] };
  const MENU = [["Bakso", 12000], ["Es teh", 4000], ["Mie ayam", 10000], ["Gorengan", 2000], ["Nasi goreng", 13000]];
  const rp = n => "Rp" + n.toLocaleString("id-ID");
  const SEKOLAH = { label: "Sekolah", kids: [{ label: "Kelas 7", kids: [{ label: "7A" }, { label: "7B", kids: [{ label: "Dito" }, { label: "Sinta" }] }, { label: "7C" }] }, { label: "Kelas 8", kids: [{ label: "8A" }, { label: "8B" }] }, { label: "Kelas 9", kids: [{ label: "9A" }, { label: "9B" }] }] };
  const FOLDERS = { label: "Sekolah", kids: [{ label: "Kelas 7", kids: [{ label: "Tugas", kids: [{ label: "laporan" }] }, { label: "Foto" }] }, { label: "Ekskul" }] };

  // antrean & tumpukan yang bergerak (dipakai beberapa adegan)
  function queueAnim(ctx, l, x0, y, opt = {}) {
    const step = opt.step || 1.6, k = Math.floor(l / step), f = (l % step) / step; // k = jumlah yang sudah dilayani
    const names = NAMES.map((n, i) => NAMES[(i + k) % NAMES.length]).slice(0, 5);
    Q.counter(ctx, x0 + 120, y + 10, 260);
    // yang sedang dilayani berjalan keluar ke kanan lalu hilang
    const leave = ease(clamp((f - 0.5) / 0.5, 0, 1));
    ctx.save(); ctx.globalAlpha = 1 - leave; kid(ctx, x0 - 30 + leave * 120, y + 40 - leave * 20, 100, { hair: k % 2 ? "long" : undefined }); ctx.restore();
    // antrean bergeser maju saat yang depan pergi
    const shift = leave * 130;
    for (let i = 1; i < 5; i++) { const x = x0 - 30 - i * 130 + shift; kid(ctx, x, y + 40, 100, { hair: (i + k) % 2 ? "long" : undefined, hairColor: ["#2B2118", "#4A2E1A", "#1B1B1B"][(i + k) % 3] }); if (opt.names) text(ctx, names[i], x, y + 180, 22, { align: "center", weight: 800, color: C.ink2 }); }
    // pendatang baru muncul di belakang
    ctx.save(); ctx.globalAlpha = leave; kid(ctx, x0 - 30 - 5 * 130 + shift, y + 40, 100, { hair: (5 + k) % 2 ? "long" : undefined }); ctx.restore();
    if (opt.arrows) { label(ctx, "masuk →", x0 - 30 - 5 * 130, y - 90, { color: C.kiko }); label(ctx, "← keluar", x0 + 110, y - 90, { color: C.good }); }
  }
  function stackAnim(ctx, l, cx, baseY, opt = {}) {
    // siklus: 0–1.4 taruh piring (turun dari atas), 1.4–2.8 jeda, 2.8–4.2 ambil piring teratas (naik), 4.2–5 jeda
    const T = 5, u = l % T, base = opt.n || 4;
    let n = base, lift = 0, hl = false;
    if (u < 1.4) { n = base + 1; lift = 1 - ease(u / 1.4); hl = true; } else if (u < 2.8) { n = base + 1; hl = true; } else if (u < 4.2) { n = base + 1; lift = ease((u - 2.8) / 1.4); hl = true; } else { n = base; }
    Q.plates(ctx, cx, baseY, n, { hlTop: hl, lift, labelsN: opt.labelsN, w: opt.w });
    if (opt.arrows) { const phase = u < 2.8 ? "taruh di atas" : u < 4.2 ? "ambil dari atas" : ""; if (phase) label(ctx, phase, cx, baseY - 300, { color: u < 2.8 ? C.kiko : C.good }); }
  }

  Object.assign(SCENES, {
    title_q(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kiko(ctx, 330, 560, 200, 0, { mood: "happy" });
      const items = [["Daftar", (x, y) => Q.listCard(ctx, x - 90, y - 70, 180, "belanja", ["telur", "minyak"], { rowH: 40 })], ["Tabel", (x, y) => Q.table(ctx, x - 105, y - 60, ["Hari", "Jam 1"], [["Sen", "Mat"], ["Sel", "IPA"]], { cw: 105, rh: 40, size: 20 })], ["Antrean", (x, y) => Q.queueKids(ctx, x + 60, y - 30, ["", "", ""], { s: 60, gap: 60 })], ["Tumpukan", (x, y) => Q.plates(ctx, x, y + 40, 5, { w: 150 })], ["Hierarki", (x, y) => Q.tree(ctx, { label: "induk", kids: [{ label: "anak" }, { label: "anak" }] }, x - 120, y - 40, 240, { levelH: 80, bw: 100, bh: 40, size: 20 })]];
      const n = reveal(l, 0.6, 1.1, 5);
      items.forEach(([t, draw], i) => { const x = 640 + (i % 3) * 380, y = i < 3 ? 330 : 620; const on = i < n; ctx.save(); ctx.globalAlpha = on ? 1 : 0.15; card(ctx, x - 160, y - 110, 320, 250, { fill: C.bg2 }); draw(x, y); text(ctx, t, x, y + 120, 30, { align: "center", weight: 900, color: on ? C.accentDark : C.muted }); ctx.restore(); });
      if (l > 6) bubble(ctx, 180, 330, 340, "Komputer memakai susunan yang sama!", 28, { tailX: 330, tailDir: 0 });
    },
    prereq(ctx, b, l) {
      card(ctx, 260, 200, 1400, 600);
      text(ctx, "TONTON DULU", 960, 300, 34, { align: "center", color: C.accentDark, weight: 800 });
      text(ctx, "Episode D7.1", 960, 420, 60, { align: "center", weight: 900 });
      text(ctx, "Berpikir Komputasional di Sekitar Kita", 960, 500, 48, { align: "center", weight: 700, color: C.ink2 });
      ["Pecah masalah", "Cari pola", "Urutan langkah"].forEach((s, i) => { card(ctx, 480 + i * 340, 580, 300, 120, { fill: C.bg2 }); text(ctx, s, 630 + i * 340, 652, 32, { align: "center", weight: 800 }); });
      kiko(ctx, 1600, 760, 150, 0);
    },
    unplugged_queue(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "MAIN DULU TANPA KOMPUTER", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      Q.counter(ctx, 1420, 520, 280);
      Q.queueKids(ctx, 1180, 540, NAMES.slice(0, 5), { s: 110, gap: 150, labels: true, hlFront: l > 1.5, hlBack: l > 4 });
      if (l > 1.5) bubble(ctx, 1040, 340, 300, "dilayani pertama", 26, { tailX: 1180, tailDir: 0, fill: C.goodBg, stroke: C.good, color: C.good });
      if (l > 4) bubble(ctx, 420, 340, 320, "menunggu paling lama", 26, { tailX: 580, tailDir: 0, fill: "#FFF3D6", stroke: C.accent, color: C.accentDark });
      if (l > 7) banner(ctx, "ANTREAN (queue): pertama masuk, pertama keluar", 760, 900);
    },
    unplugged_stack(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      stackAnim(ctx, l, 520, 690, { n: 4, labelsN: true, arrows: true, w: 320 });
      text(ctx, "tumpukan piring", 520, 790, 28, { align: "center", weight: 900, color: C.ink2 });
      card(ctx, 940, 260, 760, 420, { fill: C.bg2 });
      const rows = [["ditaruh terakhir", "ada di paling atas"], ["diambil pertama", "ya yang paling atas"]];
      rows.forEach(([a, c], i) => { if (l > 1.5 + i * 2.5) { text(ctx, a, 980, 340 + i * 110, 32, { weight: 900, color: C.kiko }); arrowIcon(ctx, "right", 1310, 328 + i * 110, 40, C.ink2); text(ctx, c, 1360, 340 + i * 110, 32, { weight: 800 }); } });
      if (l > 7) { card(ctx, 980, 560, 680, 90, { fill: C.badBg, stroke: C.bad, lw: 4 }); text(ctx, "TUMPUKAN (stack): terakhir masuk, pertama keluar", 1320, 616, 30, { align: "center", weight: 900, color: C.bad }); }
      if (l > 9) banner(ctx, "terbalik dari antrean", 760, 600, { fill: C.goodBg, stroke: C.good, color: C.good });
    },

    list_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n1 = reveal(l, 0.8, 0.5, 4);
      Q.listCard(ctx, 220, 240, 520, "Daftar belanja Ibu", ["telur", "minyak", "gula", "sabun"].slice(0, n1), {});
      if (l > 4) { const n2 = reveal(l, 4.5, 0.3, 6); Q.listCard(ctx, 900, 240, 560, "Daftar hadir kelas 7B", ["Adi", "Bima", "Citra", "Dito", "…", "Zahra"].slice(0, n2), { rowH: 50, numbers: [1, 2, 3, 4, "…", 32] }); }
      if (l > 7) banner(ctx, "DAFTAR: barisan berurutan, tiap barang punya nomor", 760, 1000);
    },
    list_ops(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const items = ["telur", "minyak", "gula", "sabun"]; const struck = l > 1.5 ? [2] : [];
      if (l > 4) items.push("kecap");
      Q.listCard(ctx, 220, 240, 520, "Daftar belanja Ibu", items, { struck, added: l > 4 ? [4] : [] });
      if (l > 1.5) label(ctx, "dicoret di tengah", 480, 640, { color: C.bad });
      if (l > 4) label(ctx, "ditambah di belakang", 480, 690, { color: C.good });
      // HP: daftar lagu
      const ph = D.phone(ctx, 1300, 530, 360, 560);
      text(ctx, "Daftar lagu", ph.x + 24, ph.y + 70, 28, { weight: 900 });
      ["Lagu pagi", "Semangat", "Hujan rintik", "Kantin kita", "Pulang"].forEach((s, i) => { const y = ph.y + 100 + i * 70; card(ctx, ph.x + 16, y, ph.w - 32, 58, { fill: i === 1 && l > 6 ? C.goodBg : "#F7FAF8", r: 10 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(ph.x + 46, y + 29, 14, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), ph.x + 46, y + 36, 18, { align: "center", color: "#fff", weight: 900 }); text(ctx, s, ph.x + 72, y + 37, 24, { weight: 800 }); });
      if (l > 6) label(ctx, "daftar lagu, daftar kontak: sama saja", 1300, 215, { size: 26, color: C.ink2 });
    },
    table_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const t = Q.table(ctx, 360, 300, JADWAL.header, JADWAL.rows, { cw: [160, 240, 240, 240, 240], rh: 62, size: 26 });
      text(ctx, "Jadwal pelajaran 7B", 960, 260, 32, { align: "center", weight: 900, color: C.accentDark });
      if (l > 2.5) { ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.strokeRect(360, 362, 160, 62 * 5); label(ctx, "baris = hari", 250, 560, { color: C.kiko, size: 26 }); }
      if (l > 4.5) { ctx.strokeStyle = C.good; ctx.lineWidth = 6; ctx.strokeRect(520, 300, 960, 62); label(ctx, "kolom = jam ke berapa", 1000, 730, { color: C.good, size: 26 }); }
      if (l > 6.5) banner(ctx, "TABEL: baris dan kolom, satu kotak satu jawaban", 770, 1000);
    },
    table_lookup(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const o = { cw: [160, 240, 240, 240, 240], rh: 62, size: 26 };
      if (l > 1.2) o.hlRow = 0; if (l > 2.6) o.hlCol = 3; if (l > 4) o.hlCell = [0, 3];
      Q.table(ctx, 360, 280, JADWAL.header, JADWAL.rows, o);
      text(ctx, "Senin, jam ketiga, pelajaran apa?", 960, 245, 32, { align: "center", weight: 900, color: C.accentDark });
      if (l > 1.2) text(ctx, "① turun ke baris Senin", 360, 690, 24, { weight: 900, color: C.kiko });
      if (l > 2.6) text(ctx, "② geser ke kolom Jam 3", 1560, 690, 24, { weight: 900, color: C.kiko, align: "right" });
      if (l > 7.5) banner(ctx, "daftar nilai, daftar harga warung: juga tabel", 730, 900, { size: 30 });
      else if (l > 4) banner(ctx, "Informatika — dua petunjuk, satu jawaban", 730, 900, { fill: C.goodBg, stroke: C.good, color: C.good });
    },
    table_sort(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const sorted = [...MENU].sort((a, c) => a[1] - c[1]);
      const rows1 = MENU.map(([m, h]) => [m, rp(h)]);
      Q.table(ctx, 220, 300, ["Menu warung", "Harga"], rows1, { cw: [280, 220], rh: 60, size: 26 });
      text(ctx, "asli", 470, 260, 28, { align: "center", weight: 900, color: C.ink2 });
      if (l > 1.5) { arrowIcon(ctx, "right", 800, 480, 50, C.accentDark); label(ctx, "urutkan termurah", 800, 420, { size: 24 }); Q.table(ctx, 900, 300, ["Menu warung", "Harga"], sorted.map(([m, h]) => [m, rp(h)]), { cw: [280, 220], rh: 60, size: 26, fade: l > 4 ? sorted.map((r, i) => r[1] >= 10000 ? i : -1).filter(i => i >= 0) : [] }); text(ctx, "diurutkan", 1150, 260, 28, { align: "center", weight: 900, color: C.ink2 }); }
      if (l > 4) { card(ctx, 1460, 300, 300, 120, { fill: C.goodBg, stroke: C.good, lw: 4 }); text(ctx, "saring:", 1610, 345, 26, { align: "center", weight: 800, color: C.good }); text(ctx, "di bawah Rp10.000", 1610, 390, 28, { align: "center", weight: 900, color: C.good }); }
      if (l > 7) banner(ctx, "di komputer namanya lembar kerja (spreadsheet)", 745, 1000, { size: 30 });
    },

    queue_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      queueAnim(ctx, l, 1400, 480, { arrows: true, step: 1.8 });
      banner(ctx, "ANTREAN (queue): pertama masuk, pertama keluar", 745, 900);
    },
    queue_computer(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      // kiri: tiga anak mengirim tugas ke printer
      const jobs = ["Tugas Dito", "Tugas Sinta", "Tugas Rani"]; const k = Math.floor(clamp((l - 1.5) / 2.2, 0, 3)), f = clamp(((l - 1.5) % 2.2) / 2.2, 0, 1);
      NAMES.slice(0, 3).forEach((n, i) => { kid(ctx, 260, 330 + i * 190, 80, { hair: i % 2 ? "long" : undefined }); text(ctx, n, 260, 430 + i * 190, 22, { align: "center", weight: 800, color: C.ink2 }); });
      Q.tokens(ctx, 360, 290, jobs.slice(k), { dir: "h", w: 170, h: 54, gap: 8, size: 22, hl: 0 });
      text(ctx, "antrean cetak", 640, 380, 24, { align: "center", weight: 800, color: C.ink2 });
      Q.printer(ctx, 1000, 420, 220, { sheet: k < 3 ? f : 1, sheetLabel: jobs[Math.min(k, 2)] });
      if (k > 0) { Q.tokens(ctx, 820, 620, jobs.slice(0, k), { dir: "h", w: 160, h: 54, gap: 8, size: 22, fill: C.goodBg, stroke: C.good }); text(ctx, "sudah dicetak, urut yang mengirim dulu", 1070, 720, 24, { align: "center", weight: 800, color: C.good }); }
      // kanan: HP grup kelas
      const ph = D.phone(ctx, 1580, 520, 320, 560); text(ctx, "Grup 7B", ph.x + 20, ph.y + 64, 26, { weight: 900 });
      [["Dito", "Besok PR?"], ["Sinta", "Hal 12 ya"], ["Rani", "Makasih!"], ["Bayu", "Siap"]].forEach(([n, m], i) => { if (l > 1 + i * 1.5) { card(ctx, ph.x + 16, ph.y + 90 + i * 110, ph.w - 32, 92, { fill: "#F7FAF8", r: 12 }); text(ctx, n, ph.x + 30, ph.y + 120 + i * 110, 20, { weight: 900, color: C.kiko }); text(ctx, m, ph.x + 30, ph.y + 152 + i * 110, 24, { weight: 700 }); text(ctx, "07:0" + (i + 1), ph.x + ph.w - 30, ph.y + 120 + i * 110, 18, { align: "right", color: C.ink2 }); } });
      text(ctx, "pesan tampil urut datang", 1580, 212, 24, { align: "center", weight: 800, color: C.ink2 });
    },
    stack_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      stackAnim(ctx, l, 520, 690, { n: 4, arrows: true, w: 320 });
      card(ctx, 940, 280, 760, 300, { fill: C.bg2 });
      text(ctx, "piring baru dicuci", 980, 350, 30, { weight: 900, color: C.kiko }); arrowIcon(ctx, "right", 1330, 338, 40, C.ink2); text(ctx, "ditaruh di atas", 1380, 350, 30, { weight: 800 });
      if (l > 3) { text(ctx, "yang diambil berikutnya", 980, 450, 30, { weight: 900, color: C.good }); arrowIcon(ctx, "right", 1400, 438, 40, C.ink2); text(ctx, "yang di atas", 1450, 450, 30, { weight: 800 }); }
      if (l > 5) text(ctx, "yang paling bawah menunggu paling lama", 1320, 540, 26, { align: "center", weight: 800, color: C.ink2 });
      banner(ctx, "TUMPUKAN (stack): terakhir masuk, pertama keluar", 745, 900, { fill: C.badBg, stroke: C.bad, color: C.bad });
    },
    stack_computer(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      // kiri: HP dengan tumpukan halaman & tombol kembali
      const ph = D.phone(ctx, 420, 500, 340, 560);
      const pages = ["Halaman A", "Halaman B", "Halaman C"]; const back = l > 3.5; const cur = back ? 1 : 2;
      ctx.fillStyle = "#F7FAF8"; rr(ctx, ph.x + 12, ph.y + 40, ph.w - 24, ph.h - 60, 14); ctx.fill();
      text(ctx, pages[cur], ph.x + ph.w / 2, ph.y + 300, 34, { align: "center", weight: 900, color: C.kiko });
      card(ctx, ph.x + 24, ph.y + 48, 90, 44, { fill: back && l < 4.5 ? C.accent : C.bg2, r: 10 }); text(ctx, "◀ back", ph.x + 69, ph.y + 77, 20, { align: "center", weight: 900 });
      if (back) D.finger(ctx, ph.x + 80, ph.y + 100, {});
      Q.tokens(ctx, 700, 560, back ? pages.slice(0, 2) : pages, { dir: "v", w: 200, h: 58, gap: 10, size: 24, hl: back ? 1 : 2 });
      if (back) { ctx.save(); ctx.globalAlpha = 0.35; Q.tokens(ctx, 700, 560 - 2 * 68, ["Halaman C"], { dir: "v", w: 200, h: 58, size: 24, fade: [0] }); ctx.restore(); text(ctx, "C keluar dulu", 800, 410, 24, { align: "center", weight: 900, color: C.bad }); }
      text(ctx, "tumpukan halaman", 800, 640, 24, { align: "center", weight: 800, color: C.ink2 });
      label(ctx, back ? "tekan back → muncul B, bukan A" : "dibuka: A, lalu B, lalu C", 880, 730, { size: 26, color: back ? C.good : C.ink2 });
      // kanan: undo
      card(ctx, 1080, 300, 620, 400, { fill: C.bg2 });
      text(ctx, "Catatan", 1110, 350, 28, { weight: 900, color: C.ink2 });
      const typed = ["Halo", "teman", "semua"]; const nT = l < 6 ? 3 : l < 7.5 ? 2 : 1;
      D.textBox(ctx, 1110, 380, 560, 110, [typed.slice(0, nT).join(" ")], l, { size: 34 });
      if (l > 6) { card(ctx, 1110, 530, 160, 56, { fill: C.accent, r: 10 }); text(ctx, "↶ undo", 1190, 566, 24, { align: "center", weight: 900 }); text(ctx, l < 7.5 ? "yang terakhir diketik hilang dulu: semua" : "undo lagi: teman", 1300, 650, 24, { weight: 800, color: C.bad }); }
      else text(ctx, "ketik: Halo teman semua", 1110, 570, 24, { weight: 800, color: C.ink2 });
    },
    queue_vs_stack(ctx, b, l) {
      card(ctx, 120, 150, 820, 740); card(ctx, 980, 150, 820, 740);
      text(ctx, "ANTREAN (queue)", 530, 230, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, "TUMPUKAN (stack)", 1390, 230, 34, { align: "center", weight: 900, color: C.bad });
      Q.counter(ctx, 700, 470, 180, "Bu Warung"); Q.queueKids(ctx, 560, 480, ["", "", "", ""], { s: 80, gap: 100 });
      Q.plates(ctx, 1390, 560, 5, { hlTop: true });
      text(ctx, "pertama masuk, pertama keluar", 530, 660, 28, { align: "center", weight: 900 }); text(ctx, "terakhir masuk, pertama keluar", 1390, 660, 28, { align: "center", weight: 900 });
      if (l > 2) para(ctx, "adil: yang lama menunggu dilayani dulu. Antrean kantin, printer, pesan grup.", 200, 720, 26, 660, { weight: 700, color: C.ink2 });
      if (l > 5) para(ctx, "cepat mundur selangkah: yang terbaru keluar dulu. Tombol back, undo, piring.", 1060, 720, 26, 660, { weight: 700, color: C.ink2 });
      if (l > 8) label(ctx, "pilih sesuai keperluan", 960, 860, { size: 28 });
    },

    tree_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const d = reveal(l, 0.5, 1.6, 4) - 1;
      Q.tree(ctx, SEKOLAH, 200, 230, 1520, { levelH: 150, bw: 150, bh: 54, size: 24, depth: Math.max(0, d) });
      if (l > 8) banner(ctx, "HIERARKI: bertingkat, induk dan anak", 740, 900, { size: 30 });
      else if (l > 6.5) label(ctx, "induk di atas, anak di bawah: seperti pohon terbalik", 960, 790, { size: 28, color: C.ink2 });
    },
    tree_folder(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "Folder di komputer", 500, 230, 30, { align: "center", weight: 900, color: C.accentDark });
      const n = reveal(l, 0.6, 0.9, 4);
      Q.folderPath(ctx, 260, 310, [{ name: "Sekolah" }, { name: "Kelas 7" }, { name: "Tugas" }, { name: "laporan.docx", kind: "doc" }].slice(0, n), {});
      if (n >= 4) label(ctx, "file-mu ada di dalam folder dalam folder", 500, 740, { size: 26, color: C.ink2 });
      // kanan: menu HP bertingkat
      text(ctx, "Menu HP", 1360, 230, 30, { align: "center", weight: 900, color: C.accentDark });
      const m = l > 5 ? reveal(l, 5, 1.0, 3) : 0;
      ["Pengaturan", "Suara", "Nada dering"].forEach((s, i) => { if (i < m) { D.menu(ctx, 1000 + i * 240, 300 + i * 110, i === 0 ? ["Jaringan", "Suara", "Layar"] : i === 1 ? ["Volume", "Nada dering", "Getar"] : ["Nada 1", "Nada 2", "Nada 3"], { w: 230, active: i === 2 ? 0 : 1 }); text(ctx, s, 1115 + i * 240, 290 + i * 110, 24, { align: "center", weight: 900, color: C.kiko }); if (i) { arrowIcon(ctx, "right", 980 + i * 240 - 20, 300 + i * 110 + 90, 30, C.ink2); } } });
      if (m >= 3) label(ctx, "Pengaturan → Suara → Nada dering", 1360, 740, { size: 26, color: C.ink2 });
    },
    tree_path(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      const n = reveal(l, 0.8, 1.3, 4); const path = ["Sekolah", "Kelas 7", "Tugas", "laporan"].slice(0, n);
      Q.tree(ctx, FOLDERS, 300, 240, 1320, { levelH: 150, bw: 190, bh: 58, size: 26, path });
      if (n >= 1) label(ctx, "mulai dari atas", 300, 250, { size: 24, color: C.good });
      if (n >= 2) label(ctx, "satu cabang tiap langkah", 300, 400, { size: 24, color: C.good });
      if (n >= 4) banner(ctx, "file yang rapi di folder mudah ditemukan lagi", 745, 1000, { fill: C.goodBg, stroke: C.good, color: C.good, size: 30 });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = [["Simulasi antrean & tumpukan", "tebak siapa keluar berikutnya", (x, y) => { Q.queueKids(ctx, x - 40, y - 40, ["", "", ""], { s: 56, gap: 56 }); Q.plates(ctx, x + 130, y + 40, 4, { w: 110 }); }],
        ["Baca tabel jadwal", "baris hari, kolom jam", (x, y) => Q.table(ctx, x - 180, y - 70, ["Hari", "Jam 1", "Jam 2"], [["Sen", "Mat", "IPA"], ["Sel", "IPS", "Seni"]], { cw: 120, rh: 44, size: 20, hlCell: [1, 2] })],
        ["Cocokkan contoh", "daftar, tabel, antrean, tumpukan, hierarki", (x, y) => { Q.tokens(ctx, x - 200, y - 60, ["daftar", "tabel"], { w: 130, h: 48, gap: 10, size: 22 }); Q.tokens(ctx, x - 200, y, ["antrean", "tumpukan"], { w: 130, h: 48, gap: 10, size: 22 }); Q.tokens(ctx, x + 90, y - 30, ["hierarki"], { w: 130, h: 48, size: 22, hl: 0 }); }]];
      items.forEach(([t1, t2, draw], i) => { const x = 400 + i * 560; card(ctx, x - 250, 290, 500, 440, { fill: C.bg2 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 200, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 200, 352, 30, { align: "center", color: "#fff", weight: 900 }); draw(x, 470); text(ctx, t1, x, 610, 28, { align: "center", weight: 900 }); text(ctx, t2, x, 650, 22, { align: "center", weight: 700, color: C.ink2 }); });
      text(ctx, "di halaman latihan episode ini — lalu amati sehari: temukan lima susunan di sekitarmu", 960, 820, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
