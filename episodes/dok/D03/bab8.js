/* D03 bab 8: "Cara melindungi keluarga" (b8_1 … b8_5).
   Metafora utama bab: PERISAI LIMA LANGKAH. Pelacak "5 cara" di kiri atas (lingkaran 1–5) terisi satu per satu dan
   ikut sepanjang bab; setiap cara diperagakan oleh keluarga rekaan di ruang makan yang sama, lalu benda yang sama dibawa:
   - b8_1 ruang makan: keluarga duduk; Bip berdiri di meja dan berbisik; kertas "Kerupuk biru" ditulis lalu dilipat;
          kartu status media sosial dicap larangan; HP Bu Rina berdering → gelembung "Kata sandinya apa?".
   - b8_2 ruang diredupkan, HP Bu Rina membesar: jari Bip menolak panggilan "Nomor tidak dikenal", membuka kontak "Anakku",
          menelepon balik; jendela bulat ke kampung: anak menjawab, lalu tetangga di dekatnya ikut memastikan (centang).
   - b8_3 kembali ke meja: Bu Rina bertanya, kartu Internet mencari dan "Tidak ditemukan"; kucing Si Oyen masuk
          (awan pikiran nenek), tudung saji terangkat memperlihatkan menu kemarin.
   - b8_4 ruang makan menyusut menjadi rumah di peta media sosial bab 3; potongan suara mengalir ke toples pelaku;
          Bip menekan "Akun privat" → gembok menutup ikon-ikon; HP membesar menjadi layar unggah, jari Bip ragu di "Unggah".
   - b8_5 HP yang sama pindah ke kiri: uang terkirim mengalir ke pelaku, palang bank menahan, kartu "Hubungi bank",
          "Lapor polisi", kanal resmi Indonesia Anti-Scam Center; "semakin cepat" → uang yang tertahan kembali ke HP.
   Semua keadaan dihitung dari waktu absolut (EV), jadi silang-pudar antarbeat tidak terlihat; kamera sendiri (noCam). */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, L = KIT.layar, O = KIT.orang, LT = KIT.latar, B = KIT.bipkit, PT = KIT.peta;
  const { clamp, lerp, eio, eout, spring } = D;
  const W = 1920, HH = 1080, TAU = Math.PI * 2, FONT = K.FONT;
  const IBU = Object.assign({}, L.SUARA.ibu, { seed: 11 }), ANAK = Object.assign({}, L.SUARA.anak, { seed: 23 });
  const INK = "#1C2050", CREAM = "#FFF6E6", RED = "#FF5A5F", GREEN = "#3CC57A";

  // ---------- waktu kejadian (detik absolut, dari kata sungguhan) ----------
  let EVk = null, EVc = null;
  function EV(TL) {
    if (EVk === TL && EVc) return EVc;
    const bb = id => TL.beats.find(x => x.id === id);
    const A = (id, s, o = 0) => { const b = bb(id); return b.start + D.at(b, s) + o; };
    const E = (id, s, o = 0) => { const b = bb(id); return b.start + D.atEnd(b, s) + o; };
    const e = {};
    ["b8_1", "b8_2", "b8_3", "b8_4", "b8_5"].forEach(id => { const b = bb(id); e[id] = b.start; e[id + "e"] = b.start + b.dur; e[id + "s"] = b.start + D.speechEnd(b); });
    // b8_1
    e.pertama = A("b8_1", "Pertama"); e.buat = A("b8_1", "buat kata sandi"); e.sepakati = A("b8_1", "Sepakati"); e.kalimat = A("b8_1", "kalimat rahasia");
    e.rahasiaE = E("b8_1", "rahasia"); e.hanya = A("b8_1", "hanya diketahui"); e.klgE = E("b8_1", "keluargamu,"); e.jangan = A("b8_1", "jangan pernah");
    e.menulis = A("b8_1", "menuliskannya"); e.medsos = A("b8_1", "media sosial."); e.medsosE = E("b8_1", "sosial."); e.saat = A("b8_1", "Saat ada");
    e.darurat = A("b8_1", "telepon darurat"); e.tanyakan = A("b8_1", "tanyakan"); e.sandi2 = A("b8_1", "sandi itu.");
    // b8_2
    e.kedua = A("b8_2", "Kedua"); e.tutup = A("b8_2", "tutup teleponnya"); e.lalu = A("b8_2", "lalu hubungi"); e.hubungi = A("b8_2", "hubungi balik");
    e.nomor = A("b8_2", "nomor lama"); e.simpan = A("b8_2", "simpan."); e.kalau = A("b8_2", "Kalau keluargamu"); e.masalah = A("b8_2", "masalah,");
    e.mereka = A("b8_2", "mereka tetap"); e.dihub = A("b8_2", "dihubungi"); e.atau = A("b8_2", "atau orang"); e.dekat = A("b8_2", "dekat mereka");
    e.pastikan = A("b8_2", "memastikannya.");
    // b8_3
    e.ketiga = A("b8_3", "Ketiga"); e.ajukan = A("b8_3", "ajukan"); e.jawab = A("b8_3", "jawabannya"); e.tidakAda = A("b8_3", "tidak ada di internet");
    e.internet = A("b8_3", "internet,"); e.nama = A("b8_3", "nama hewan"); e.pelihara = A("b8_3", "peliharaan"); e.menu = A("b8_3", "menu makan"); e.kemarin = A("b8_3", "kemarin.");
    e.pertanyaan = A("b8_3", "pertanyaan"); e.kemarinE = E("b8_3", "kemarin.");
    // anak berdiri dan pergi saat telepon darurat datang (tidak pernah di dua tempat sekaligus)
    e.anakBangun = e.saat - 0.3; e.anakJalan = e.saat + 0.15; e.anakPergi = e.saat + 2.5;
    // b8_4
    e.keempat = A("b8_4", "Keempat"); e.kurangi = A("b8_4", "kurangi"); e.rekaman = A("b8_4", "rekaman suara"); e.informasi = A("b8_4", "informasi keluarga");
    e.terbuka = A("b8_4", "terbuka untuk umum"); e.atur = A("b8_4", "Atur akun"); e.privat = A("b8_4", "privat,"); e.pikirkan = A("b8_4", "pikirkan dulu");
    e.unggah = A("b8_4", "mengunggah"); e.namaL = A("b8_4", "nama lengkap"); e.sekolah = A("b8_4", "sekolah.");
    // b8_5
    e.kelima = A("b8_5", "Kelima"); e.terlanjur = A("b8_5", "terlanjur"); e.transfer = A("b8_5", "mentransfer uang"); e.segera = A("b8_5", "segera hubungi");
    e.bank = A("b8_5", "bank untuk"); e.blokir = A("b8_5", "pemblokiran,"); e.laporkan = A("b8_5", "laporkan ke polisi"); e.polisi = A("b8_5", "polisi");
    e.iasc = A("b8_5", "Indonesia Anti-Scam"); e.center = E("b8_5", "Center."); e.semakin = A("b8_5", "Semakin cepat"); e.cepat = A("b8_5", "cepat dilaporkan");
    e.besar = A("b8_5", "semakin besar"); e.peluang = A("b8_5", "peluang"); e.selamat = A("b8_5", "diselamatkan."); e.selamatE = E("b8_5", "diselamatkan.");
    // pelacak lima cara: saat lingkaran aktif (kata "Pertama", "Kedua", …) dan selesai (awal cara berikutnya)
    e.step = [e.pertama, e.kedua, e.ketiga, e.keempat, e.kelima]; e.allDone = e.selamatE + 0.3;
    // peralihan fase
    e.toMap = e.b8_4 - 0.15;   // ruang makan menyusut menjadi rumah di peta
    e.toRoute = e.b8_5 - 0.1;  // peta bergeser keluar, HP pindah ke kiri
    e.keluar = e.b8_4 + 5.3; e.phIn = e.b8_4 + 6.0;   // b8_4: pelaku + toples keluar dulu, lalu HP naik
    EVk = TL; EVc = e; return e;
  }

  const win = (t, a, b, fi = 0.3, fo = 0.3) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));
  const pop = (t, t0, k = 11, z = 0.5) => (t <= t0 ? 0 : Math.min(1.08, spring(t - t0, k, z)));
  const ramp = (t, t0, d = 0.5) => clamp((t - t0) / d);
  const ease = (t, t0, d = 0.6) => eio((t - t0) / d);

  // ---------- teks & bentuk ----------
  function font(c, size, w = 800) { c.font = `${w} ${size}px ${FONT}`; }
  function tw(c, s, size, w = 800) { font(c, size, w); return c.measureText(s).width; }
  function say(c, s, x, y, size, col, o = {}) { font(c, size, o.w || 800); c.fillStyle = col; c.textAlign = o.align || "center"; c.textBaseline = "middle"; c.fillText(s, x, y); c.textBaseline = "alphabetic"; c.textAlign = "left"; }
  function rr(c, x, y, w, h, r, col) { c.fillStyle = col; H.rr(c, x, y, w, h, r); c.fill(); }
  function shadowBox(c, x, y, w, h, r, a = 0.28) { c.fillStyle = `rgba(12,16,56,${a})`; H.rr(c, x + 6, y + 12, w, h, r); c.fill(); }
  function scaleAt(c, x, y, s) { c.translate(x, y); c.scale(s, s); c.translate(-x, -y); }
  function check(c, x, y, r, col = GREEN, a = 1) {
    if (a <= 0) return; c.save(); c.globalAlpha *= clamp(a); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.24; c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath(); c.moveTo(x - r * 0.42, y + r * 0.02); c.lineTo(x - r * 0.1, y + r * 0.34); c.lineTo(x + r * 0.46, y - r * 0.32); c.stroke(); c.restore();
  }
  function cross(c, x, y, r, col = RED, a = 1) {
    if (a <= 0) return; c.save(); c.globalAlpha *= clamp(a); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.24; c.lineCap = "round"; const k = r * 0.36;
    c.beginPath(); c.moveTo(x - k, y - k); c.lineTo(x + k, y + k); c.moveTo(x + k, y - k); c.lineTo(x - k, y + k); c.stroke(); c.restore();
  }
  // gelembung ucapan: (cx, cy) = pusat; tail = ujung ekor; a 0..1 muncul memegas dari ekor
  function bubble(c, cx, cy, text, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= 0.001) return;
    const fs = o.fs || 48, pad = 30; let w = o.icon ? 150 : tw(c, text, fs, 800) + pad * 2, h = o.icon ? 130 : fs * 1.75;
    const tail = o.tail || [cx, cy + h / 2 + 50], s = Math.min(1.06, spring(Math.max(0, a) * 0.9, 12, 0.5));
    c.save(); c.globalAlpha *= clamp(a * 2.5); c.translate(tail[0], tail[1]); c.scale(s, s); c.translate(-tail[0], -tail[1]);
    const x = cx - w / 2, y = cy - h / 2, r = Math.min(40, h / 2);
    c.fillStyle = "rgba(12,16,56,0.28)"; H.rr(c, x + 5, y + 10, w, h, r); c.fill();
    c.fillStyle = o.fill || "#FFFFFF"; H.rr(c, x, y, w, h, r); c.fill();
    const bx = clamp(tail[0], x + r, x + w - r), by = tail[1] < y ? y : y + h, dir = tail[1] < y ? -1 : 1;
    c.beginPath(); c.moveTo(bx - 24, by - dir * 2); c.quadraticCurveTo(bx - 6, by + dir * 18, tail[0], tail[1]); c.quadraticCurveTo(bx + 4, by + dir * 14, bx + 26, by - dir * 2); c.closePath(); c.fill();
    if (o.icon) { const p = 1 + 0.06 * Math.sin((o.t || 0) * 5); c.save(); scaleAt(c, cx, cy, p); c.fillStyle = P.amber; c.beginPath(); c.arc(cx, cy, 44, 0, TAU); c.fill(); tanyaPath(c, cx, cy - 2, 46, "#FFFFFF"); c.restore(); }
    else say(c, text, cx, cy + 2, fs, o.color || INK, { w: 800 });
    c.restore();
  }
  // awan pikiran dengan isi (fn) dan gelembung kecil ke kepala (hx, hy)
  function cloud(c, cx, cy, w, h, hx, hy, a, fn) {
    if (a <= 0.001) return; const s = Math.min(1.06, spring(a * 0.9, 11, 0.5));
    c.save(); c.globalAlpha *= clamp(a * 2.5); scaleAt(c, cx, cy + h / 2, s);
    const puffs = []; for (let i = 0; i < 9; i++) { const u = i / 9 * TAU; puffs.push([cx + Math.cos(u) * (w / 2 - 34), cy + Math.sin(u) * (h / 2 - 30), 48 + (i % 3) * 8]); }
    c.fillStyle = "rgba(12,16,56,0.25)"; puffs.forEach(([x, y, r]) => { c.beginPath(); c.arc(x + 5, y + 9, r, 0, TAU); c.fill(); });
    c.fillStyle = "#F7F4FF"; puffs.forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }); c.beginPath(); c.ellipse(cx, cy, w / 2 - 26, h / 2 - 24, 0, 0, TAU); c.fill();
    [[0.35, 20], [0.65, 14], [0.88, 9]].forEach(([u, r]) => { c.beginPath(); c.arc(lerp(cx, hx, u), lerp(cy + h / 2 - 10, hy, u), r, 0, TAU); c.fill(); });
    fn(c); c.restore();
  }

  // ---------- benda kecil ----------
  function kucingKepala(c, x, y, r, t) {   // kepala Si Oyen (sama dengan bab 7)
    c.save(); c.translate(x, y); const ear = sx => { c.beginPath(); c.moveTo(sx * r * 0.85, -r * 0.35); c.lineTo(sx * r * 0.7, -r * 1.15); c.lineTo(sx * r * 0.2, -r * 0.8); c.closePath(); c.fill(); };
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
  // kucing utuh tampak samping; (x, y) = lantai di bawah badan; s = tinggi badan; walk 0..1 (langkah), dir -1 menghadap kiri
  function kucing(c, x, y, s, t, walk, dir = -1) {
    c.save(); c.translate(x, y); c.scale(dir < 0 ? 1 : -1, 1);
    c.fillStyle = "rgba(14,18,60,0.25)"; c.beginPath(); c.ellipse(0, 0, s * 0.75, s * 0.08, 0, 0, TAU); c.fill();
    const cyc = t * 7, lg = (i) => walk * Math.sin(cyc + i * Math.PI) * s * 0.12;
    c.strokeStyle = "#E08A33"; c.lineCap = "round"; c.lineWidth = s * 0.13;
    [[-0.4, 0], [-0.25, 1], [0.32, 1], [0.47, 0]].forEach(([fx, ph]) => { c.beginPath(); c.moveTo(s * fx, -s * 0.38); c.lineTo(s * fx + lg(ph), -s * 0.05); c.stroke(); });
    // ekor melambai
    const sw = Math.sin(t * 2.2) * 0.35; c.strokeStyle = "#F29A3E"; c.lineWidth = s * 0.12;
    c.beginPath(); c.moveTo(s * 0.55, -s * 0.5); c.quadraticCurveTo(s * 0.95, -s * 0.6, s * (0.9 + sw * 0.2), -s * (1.0 + sw * 0.2)); c.stroke();
    c.fillStyle = "#F29A3E"; c.beginPath(); c.ellipse(0, -s * 0.5, s * 0.62, s * 0.28, 0, 0, TAU); c.fill();
    c.fillStyle = "#D67A28"; [-0.1, 0.1, 0.3].forEach(fx => { c.beginPath(); c.ellipse(s * fx, -s * 0.7, s * 0.05, s * 0.09, 0, 0, TAU); c.fill(); });
    c.fillStyle = "#FFE7C4"; c.beginPath(); c.ellipse(-s * 0.1, -s * 0.36, s * 0.38, s * 0.12, 0, 0, TAU); c.fill();
    c.restore();
    kucingKepala(c, x + (dir < 0 ? -1 : 1) * s * 0.6, y - s * 0.78 + Math.sin(t * 7) * walk * s * 0.02, s * 0.36, t);
  }
  function uangKertas(c, x, y, s, rot, a, col = "#5BD68A") {
    if (a <= 0) return; c.save(); c.globalAlpha *= clamp(a); c.translate(x, y); c.rotate(rot);
    c.fillStyle = "rgba(14,18,60,0.25)"; H.rr(c, -s / 2 + 4, -s * 0.27 + 6, s, s * 0.54, s * 0.08); c.fill();
    c.fillStyle = col; H.rr(c, -s / 2, -s * 0.27, s, s * 0.54, s * 0.08); c.fill();
    c.strokeStyle = "rgba(20,90,60,0.7)"; c.lineWidth = s * 0.04; H.rr(c, -s / 2 + s * 0.07, -s * 0.2, s - s * 0.14, s * 0.4, s * 0.05); c.stroke();
    c.fillStyle = "rgba(20,90,60,0.7)"; c.beginPath(); c.arc(0, 0, s * 0.14, 0, TAU); c.fill(); c.fillStyle = "rgba(255,255,255,0.55)"; c.beginPath(); c.arc(0, 0, s * 0.07, 0, TAU); c.fill(); c.restore();
  }
  function lencana(c, x, y, r, col = "#4E7BE8") {   // lencana polisi generik (perisai + bintang), bukan logo
    c.save(); c.translate(x, y);
    const sh = () => { c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(r * 0.55, -r * 0.7, r * 0.9, -r * 0.78); c.quadraticCurveTo(r * 0.95, r * 0.35, 0, r); c.quadraticCurveTo(-r * 0.95, r * 0.35, -r * 0.9, -r * 0.78); c.quadraticCurveTo(-r * 0.55, -r * 0.7, 0, -r); c.closePath(); };
    c.fillStyle = "rgba(12,16,56,0.25)"; c.save(); c.translate(3, 6); sh(); c.fill(); c.restore();
    c.fillStyle = col; sh(); c.fill(); c.strokeStyle = "#FFD38A"; c.lineWidth = r * 0.1; sh(); c.stroke();
    c.fillStyle = "#FFD38A"; c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.2 : r * 0.46; c.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2 + r * 0.02); } c.closePath(); c.fill();
    c.restore();
  }
  function perisai(c, x, y, r, col = P.teal) {   // perisai dengan centang (anti-penipuan, generik)
    c.save(); c.translate(x, y);
    const sh = () => { c.beginPath(); c.moveTo(0, -r); c.lineTo(r * 0.85, -r * 0.62); c.quadraticCurveTo(r * 0.85, r * 0.45, 0, r); c.quadraticCurveTo(-r * 0.85, r * 0.45, -r * 0.85, -r * 0.62); c.closePath(); };
    c.fillStyle = "rgba(12,16,56,0.25)"; c.save(); c.translate(3, 6); sh(); c.fill(); c.restore();
    c.fillStyle = col; sh(); c.fill(); c.fillStyle = "rgba(255,255,255,0.22)"; c.beginPath(); c.moveTo(0, -r); c.lineTo(0, r); c.quadraticCurveTo(-r * 0.85, r * 0.45, -r * 0.85, -r * 0.62); c.closePath(); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.16; c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath(); c.moveTo(-r * 0.36, 0); c.lineTo(-r * 0.06, r * 0.3); c.lineTo(r * 0.42, -r * 0.28); c.stroke(); c.restore();
  }
  function globe(c, x, y, r, col = "#5AA9FF", sad = 0) {
    c.save(); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = r * 0.09;
    c.beginPath(); c.arc(x, y, r * 0.96, 0, TAU); c.moveTo(x - r, y); c.lineTo(x + r, y); c.stroke();
    c.beginPath(); c.ellipse(x, y, r * 0.45, r * 0.96, 0, 0, TAU); c.stroke();
    c.beginPath(); c.moveTo(x - r * 0.86, y - r * 0.48); c.lineTo(x + r * 0.86, y - r * 0.48); c.moveTo(x - r * 0.86, y + r * 0.48); c.lineTo(x + r * 0.86, y + r * 0.48); c.stroke();
    c.restore();
  }
  function stopwatchSaya(c, x, y, r, frac, t, col = P.amber) {   // stopwatch tanpa angka (supaya tidak ada teks kecil)
    c.save(); c.translate(x, y);
    c.fillStyle = col; H.rr(c, -r * 0.22, -r * 1.36, r * 0.44, r * 0.2, r * 0.08); c.fill(); c.fillRect(-r * 0.08, -r * 1.2, r * 0.16, r * 0.24);
    c.fillStyle = "rgba(12,16,56,0.25)"; c.beginPath(); c.arc(4, 8, r * 1.04, 0, TAU); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(0, 0, r * 1.04, 0, TAU); c.fill();
    c.fillStyle = "#FFF8EC"; c.beginPath(); c.arc(0, 0, r * 0.86, 0, TAU); c.fill();
    if (frac > 0) { c.fillStyle = D.hexA(P.pink, 0.35); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r * 0.78, -Math.PI / 2, -Math.PI / 2 + frac * TAU); c.closePath(); c.fill(); }
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; c.strokeStyle = i % 3 ? "#9AA2C8" : "#2A2F6A"; c.lineWidth = i % 3 ? r * 0.03 : r * 0.06; c.lineCap = "round";
      c.beginPath(); c.moveTo(Math.cos(a) * r * 0.66, Math.sin(a) * r * 0.66); c.lineTo(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78); c.stroke(); }
    const a = -Math.PI / 2 + frac * TAU; c.strokeStyle = "#2A2F6A"; c.lineWidth = r * 0.07; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * r * 0.66, Math.sin(a) * r * 0.66); c.stroke();
    c.fillStyle = "#2A2F6A"; c.beginPath(); c.arc(0, 0, r * 0.09, 0, TAU); c.fill(); c.restore();
  }


  // ---------- layar HP buatan sendiri (tanpa huruf kecil: cek_dok menuntut ≥ 40 px) ----------
  function tanyaPath(c, x, y, r, col) {   // tanda tanya dari garis, bukan huruf
    c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = r * 0.28; c.lineCap = "round";
    c.beginPath(); c.arc(x, y - r * 0.32, r * 0.36, Math.PI * 1.1, Math.PI * 2.35); c.lineTo(x, y + r * 0.22); c.stroke();
    c.beginPath(); c.arc(x, y + r * 0.62, r * 0.16, 0, TAU); c.fill(); c.restore();
  }
  function avatarPolos(c, x, y, r, col) { c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = col; c.fill(); c.clip();
    c.fillStyle = "rgba(255,255,255,0.55)"; c.beginPath(); c.arc(x, y - r * 0.18, r * 0.36, 0, TAU); c.fill(); c.beginPath(); c.ellipse(x, y + r * 0.78, r * 0.68, r * 0.5, 0, 0, TAU); c.fill(); c.restore(); }
  function bulat(c, x, y, r, col, ic) { c.fillStyle = "rgba(12,16,56,0.2)"; c.beginPath(); c.arc(x + r * 0.06, y + r * 0.12, r, 0, TAU); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); L.ikon(c, ic, x, y, r * 1.0, "#FFFFFF"); }
  // layar mini untuk HP di tangan tokoh (orang.draw layar: fn(ctx, w=100, h, t))
  function mini(kind) {
    return (c, w, h, tt) => { const u = w / 100; c.save();
      const g2 = c.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, kind === "chat" ? "#3FB8A8" : "#5B6BE0"); g2.addColorStop(1, kind === "chat" ? "#2F86C9" : "#8A5FD6"); c.fillStyle = g2; c.fillRect(0, 0, w, h);
      if (kind === "chat") { [[10, 20, 60], [30, 42, 60], [10, 64, 50]].forEach(([x, y, ww], i) => { c.fillStyle = i % 2 ? "#E8FFF7" : "#FFFFFF"; H.rr(c, x * u, y * h / 100, ww * u, 14 * h / 100, 6 * u); c.fill(); }); }
      else { avatarPolos(c, w / 2, h * 0.32, w * 0.2, kind === "bicara" ? "#3FB8A8" : "#7C8BEA");
        if (kind === "bicara") { c.fillStyle = "#8BF0E0"; for (let i = 0; i < 7; i++) { const a = 0.3 + 0.7 * Math.abs(Math.sin(tt * 6 + i * 1.3)); c.fillRect(w * (0.2 + i * 0.09), h * 0.6 - a * h * 0.06, w * 0.05, a * h * 0.12); } c.fillStyle = RED; c.beginPath(); c.arc(w / 2, h * 0.84, w * 0.12, 0, TAU); c.fill(); }
        else { c.fillStyle = RED; c.beginPath(); c.arc(w * 0.28, h * 0.82, w * 0.12, 0, TAU); c.fill(); c.fillStyle = GREEN; c.beginPath(); c.arc(w * 0.72, h * 0.82 - Math.abs(Math.sin(tt * 5)) * h * 0.02, w * 0.12, 0, TAU); c.fill(); } }
      c.restore(); };
  }
  // daftar kontak besar (nama ≥ 44 px, avatar tanpa huruf)
  function layarKontak(c, w, h, t, sorot) {
    const u = w / 100; c.fillStyle = "#F1F3FC"; c.fillRect(0, 0, w, h);
    const hh = u * 26, hg = c.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#3FA7C9"); hg.addColorStop(1, "#4D6FD8"); c.fillStyle = hg; c.fillRect(0, 0, w, hh);
    say(c, "Kontak", u * 7, hh * 0.6, 46, "#FFFFFF", { align: "left", w: 900 });
    const names = ["Adik", "Anakku", "Ayah", "Bu RT", "Kakak"], cols = ["#7C8BEA", "#3FB8A8", "#F07A9A", "#F2A33A", "#9A7BE8"], rh = u * 36, out = { baris: [] };
    names.forEach((n, i) => { const y = hh + u * 3 + i * rh; if (y > h) return; const on = i === sorot, ay = y + rh / 2, pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
      if (on) { c.fillStyle = D.hexA(P.teal, 0.18 + 0.1 * pulse); H.rr(c, u * 2.5, y + u * 1.5, w - u * 5, rh - u * 3, u * 6); c.fill(); c.fillStyle = "#FFFFFF"; H.rr(c, u * 3.5, y + u * 2.5, w - u * 7, rh - u * 5, u * 5); c.fill(); }
      else if (i > 0) { c.fillStyle = "#E1E5F4"; c.fillRect(u * 26, y, w - u * 30, u * 0.5); }
      avatarPolos(c, u * 12, ay, u * 8, cols[i]);
      say(c, n, u * 23, ay + 2, 46, "#1C2050", { align: "left", w: 800 });
      out.baris.push({ x: 0, y, w, h: rh });
      if (on) { const bx = w - u * 10; c.fillStyle = D.hexA(GREEN, 0.3 * pulse); c.beginPath(); c.arc(bx, ay, u * 8 * (1 + 0.12 * pulse), 0, TAU); c.fill(); bulat(c, bx, ay, u * 7, GREEN, "telepon"); out.telepon = { x: bx - u * 7, y: ay - u * 7, w: u * 14, h: u * 14, cx: bx, cy: ay }; } });
    return out;
  }
  // beranda media sosial dengan lembar pengaturan "Akun privat" di bawah (sakelar terjangkau lengan Bip)
  function layarPrivat(c, w, h, t, pv, labA = 1) {
    const u = w / 100; c.fillStyle = "#EEF0FA"; c.fillRect(0, 0, w, h);
    const hh = u * 16, hg = c.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#FF7A9C"); hg.addColorStop(1, "#9A6BFF"); c.fillStyle = hg; c.fillRect(0, 0, w, hh);
    L.ikon(c, "unggah", w - u * 24, hh * 0.55, u * 8, "#FFFFFF"); L.ikon(c, "bagikan", w - u * 10, hh * 0.55, u * 8, "#FFFFFF");
    const ks = D.sm(pv / 0.35);
    const kinds = ["video", "live", "voice"], cols = ["#FF8FA3", "#FF5A5F", "#3FD8C8"];
    kinds.forEach((k, i) => { const y = hh + u * 3 + i * u * 38, lk = D.eio(clamp((pv - 0.3 - i * 0.18) / 0.3));
      c.fillStyle = "#FFFFFF"; H.rr(c, u * 4, y, w - u * 8, u * 34, u * 5); c.fill();
      c.save(); H.rr(c, u * 7, y + u * 3, w - u * 14, u * 28, u * 4); c.clip();
      const gg = c.createLinearGradient(0, y, w, y + u * 30); gg.addColorStop(0, D.hexA(cols[i], 0.9 - 0.5 * lk)); gg.addColorStop(1, D.hexA("#6B78D8", 0.9 - 0.5 * lk)); c.fillStyle = gg; c.fillRect(0, y, w, u * 34);
      if (k === "voice") { c.fillStyle = "rgba(255,255,255,0.85)"; for (let j = 0; j < 14; j++) { const a = 0.3 + 0.7 * Math.abs(Math.sin(j * 1.7 + t * 2 * (1 - lk))); c.fillRect(u * (14 + j * 5.2), y + u * 17 - a * u * 9, u * 2.6, a * u * 18); } }
      c.restore();
      if (k !== "voice") { c.save(); c.globalAlpha *= 1 - 0.6 * lk; L.ikon(c, k, w / 2, y + u * 17, u * 13, "#FFFFFF"); c.restore(); }
      if (lk > 0.01) { c.save(); const sc = Math.min(1.1, spring(lk * 0.8, 12, 0.5)); scaleAt(c, w / 2, y + u * 17, sc); c.fillStyle = P.amber; c.beginPath(); c.arc(w / 2, y + u * 17, u * 10, 0, TAU); c.fill(); L.ikon(c, "kunci", w / 2, y + u * 17, u * 10, "#3A2A10"); c.restore(); } });
    // lembar pengaturan
    const sy = hh + u * 3 + 3 * u * 38 + u * 2;
    c.fillStyle = "rgba(12,16,56,0.12)"; H.rr(c, 0, sy - u * 1.5, w, h - sy + u * 10, u * 7); c.fill();
    c.fillStyle = "#FFFFFF"; H.rr(c, 0, sy, w, h - sy + u * 10, u * 7); c.fill();
    c.fillStyle = "#D5DAF0"; H.rr(c, w / 2 - u * 8, sy + u * 2.5, u * 16, u * 1.6, u * 0.8); c.fill();
    L.ikon(c, "kunci", u * 9, sy + u * 13, u * 7, ks > 0.5 ? "#E59B1E" : "#9AA3C8");
    c.save(); c.globalAlpha *= labA; say(c, "Akun privat", u * 16, sy + u * 13.5, 44, "#1C2050", { align: "left", w: 800 }); c.restore();
    const tw2 = u * 32, th = u * 16, tx0 = w - u * 7 - tw2, ty = sy + u * 40;
    if (ks < 0.5) globe(c, u * 14, ty + th / 2, u * 6, "#9AA3C8"); else { c.save(); c.globalAlpha *= clamp((ks - 0.5) * 3); check(c, u * 14, ty + th / 2, u * 6.5, GREEN); c.restore(); }
    c.fillStyle = ks > 0.5 ? "#24BFA8" : "#C3C9E4"; H.rr(c, tx0, ty, tw2, th, th / 2); c.fill();
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(tx0 + th / 2 + (tw2 - th) * ks, ty + th / 2, th * 0.42, 0, TAU); c.fill();
    return { sakelar: { x: tx0, y: ty, w: tw2, h: th } };
  }
  // layar transfer bank (b8_5): penerima, nominal, tombol; sesudah terkirim panel status (Terkirim → Diblokir → Diamankan) dan bilah saldo
  function layarTransfer(c, w, h, t, e) {
    const u = w / 100; c.fillStyle = "#EEF0FA"; c.fillRect(0, 0, w, h);
    const hh = u * 24, hg = c.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#5B6BE0"); hg.addColorStop(1, "#8A5FD6"); c.fillStyle = hg; c.fillRect(0, 0, w, hh);
    L.ikon(c, "bank", u * 12, hh * 0.64, u * 10, "#FFFFFF"); say(c, "Transfer", u * 23, hh * 0.66, 44, "#FFFFFF", { align: "left", w: 800 });
    // penerima (mencurigakan: bendera merah) + nominal
    c.fillStyle = "#FFFFFF"; H.rr(c, u * 5, hh + u * 5, w - u * 10, u * 70, u * 6); c.fill();
    avatarPolos(c, u * 13.5, hh + u * 20, u * 7, "#9AA3C8");
    c.fillStyle = RED; c.beginPath(); c.arc(u * 19, hh + u * 14, u * 4, 0, TAU); c.fill(); L.ikon(c, "bendera", u * 19, hh + u * 14, u * 4.4, "#FFFFFF");
    say(c, "Penerima", u * 25, hh + u * 20.5, 44, "#4A527E", { align: "left", w: 700 });
    c.fillStyle = "#E1E5F4"; c.fillRect(u * 9, hh + u * 35, w - u * 18, u * 0.6);
    font(c, 44, 900); const nw = c.measureText("Rp3.000.000").width, fs = Math.max(40, Math.min(46, 44 * (w - u * 14) / nw));
    say(c, "Rp3.000.000", w / 2, hh + u * 55, fs, "#1C2050", { w: 900 });
    // tombol
    const pr = clamp((t - e.terlanjur) / 0.5), sent = ramp(t, e.terlanjur + 0.5, 0.4), y1 = hh + u * 84;
    const btn = (y, lab, col, press) => { c.save(); const k = 1 - 0.06 * Math.sin(Math.min(1, press) * Math.PI); scaleAt(c, w / 2, y + u * 9, k);
      c.fillStyle = "rgba(12,16,56,0.18)"; H.rr(c, u * 8, y + u * 1.5, w - u * 16, u * 18, u * 9); c.fill(); c.fillStyle = col; H.rr(c, u * 8, y, w - u * 16, u * 18, u * 9); c.fill();
      say(c, lab, w / 2, y + u * 9.5, 44, "#FFFFFF", { w: 900 }); c.restore(); };
    c.save(); c.globalAlpha *= 1 - sent; btn(y1, "Transfer", "#FF6F91", pr); btn(y1 + u * 23, "Tunggu", "#24BFA8", 0); c.restore();
    if (pr > 0 && pr < 1) { c.strokeStyle = D.hexA("#FFFFFF", 0.8 * (1 - pr)); c.lineWidth = u * 1.5; c.beginPath(); c.arc(w / 2, y1 + u * 9, u * (5 + 30 * pr), 0, TAU); c.stroke(); }
    // panel status
    if (sent > 0) {
      const bl = ramp(t, e.blokir, 0.35), bk = ramp(t, e.selamat - 0.1, 0.4), py = y1 - u * 2, ph = u * 46;
      const st = bk > 0.5 ? 2 : bl > 0.5 ? 1 : 0, cols = [["#FFE3EA", "#FF6F91", "#C23B5E"], ["#E3F0FF", "#5AA9FF", "#2D63B8"], ["#DDF7E8", "#2FA56E", "#1E7A50"]][st];
      const lab = ["Terkirim", "Diblokir", "Diamankan"][st], pk = pop(t, [e.terlanjur + 0.5, e.blokir, e.selamat - 0.1][st], 12, 0.5);
      c.save(); c.globalAlpha *= sent; scaleAt(c, w / 2, py + ph / 2, 0.9 + 0.1 * Math.min(1, pk));
      c.fillStyle = cols[0]; H.rr(c, u * 5, py, w - u * 10, ph, u * 6); c.fill(); c.strokeStyle = cols[1]; c.lineWidth = u * 1; H.rr(c, u * 5, py, w - u * 10, ph, u * 6); c.stroke();
      const ix = w / 2, iy = py + u * 15;
      if (st === 0) { c.save(); c.translate(ix, iy); c.rotate(-0.4); c.fillStyle = cols[1]; c.beginPath(); c.moveTo(u * 9, 0); c.lineTo(-u * 7, -u * 6); c.lineTo(-u * 3, 0); c.lineTo(-u * 7, u * 6); c.closePath(); c.fill(); c.restore(); }
      else if (st === 1) { c.save(); H.rr(c, ix - u * 14, iy - u * 4, u * 28, u * 8, u * 2); c.clip(); c.fillStyle = "#FFFFFF"; c.fillRect(ix - u * 14, iy - u * 4, u * 28, u * 8); c.fillStyle = RED; for (let k = -3; k < 4; k++) { c.beginPath(); c.moveTo(ix + k * u * 7, iy - u * 4); c.lineTo(ix + k * u * 7 + u * 4, iy - u * 4); c.lineTo(ix + k * u * 7 - u * 2, iy + u * 4); c.lineTo(ix + k * u * 7 - u * 6, iy + u * 4); c.closePath(); c.fill(); } c.restore(); }
      else { c.save(); c.strokeStyle = cols[1]; c.lineWidth = u * 2.6; c.lineCap = "round"; c.beginPath(); c.arc(ix, iy + u * 2, u * 8, -0.15 * Math.PI, 1.05 * Math.PI, true); c.stroke();   // panah melengkung kembali
        const ax = ix - u * 8 * Math.cos(0.05 * Math.PI), ay = iy + u * 2 + u * 8 * Math.sin(0.05 * Math.PI); c.fillStyle = cols[1]; c.beginPath(); c.moveTo(ax - u * 4.5, ay - u * 1); c.lineTo(ax + u * 4.5, ay - u * 1); c.lineTo(ax, ay + u * 5.5); c.closePath(); c.fill(); c.restore(); }
      say(c, lab, w / 2, py + u * 34, 44, cols[2], { w: 900 }); c.restore();
    }
    // bilah saldo: turun saat terkirim, sebagian kembali sesudah diselamatkan (tiga lembar pertama tetap hilang)
    const sy = hh + u * 141, drop = ramp(t, e.terlanjur + 0.5, 1.2), rec = ease(t, e.selamat - 0.1, 1.4);
    const lvl = lerp(lerp(0.92, 0.18, drop), 0.72, rec);
    say(c, "Saldo", u * 8, sy + u * 6, 44, "#4A527E", { align: "left", w: 800 });
    c.fillStyle = "#DCE0F2"; H.rr(c, u * 8, sy + u * 16, w - u * 16, u * 12, u * 6); c.fill();
    c.fillStyle = rec > 0.05 ? "#2FA56E" : drop > 0.5 ? "#FF6F91" : "#5B6BE0"; H.rr(c, u * 8, sy + u * 16, Math.max(u * 12, (w - u * 16) * lvl), u * 12, u * 6); c.fill();
    if (rec > 0.02 && rec < 1) { c.fillStyle = D.hexA("#FFFFFF", 0.6 * Math.sin(rec * Math.PI)); H.rr(c, u * 8 + (w - u * 16) * 0.18, sy + u * 16, (w - u * 16) * (lvl - 0.18), u * 12, u * 6); c.fill(); }
    return {};
  }

  const MINI = { masuk: mini("masuk"), bicara: mini("bicara"), chat: mini("chat") };

  // ---------- pelacak "5 cara" (lapisan atas, kiri atas) ----------
  const STEPS = ["Kata sandi keluarga", "Telepon balik", "Pertanyaan rahasia", "Akun privat", "Lapor secepatnya"];
  function tracker(c, t, e) {
    const a0 = ramp(t, e.pertama - 0.25, 0.35); if (a0 <= 0) return;
    let cur = -1; e.step.forEach((s, i) => { if (t >= s) cur = i; });
    const done = i => (i < cur || t >= e.allDone);
    const x0 = D.SAFE.x, y0 = 112, R = 27, gap = 66;
    const lab = cur >= 0 ? STEPS[cur] : "", lw = lab ? tw(c, lab, 46, 800) : 0, pw = gap * 5 + 22 + lw + 34;
    c.save(); c.globalAlpha *= a0;
    c.fillStyle = "rgba(12,16,56,0.3)"; H.rr(c, x0 - 18 + 4, y0 - 44 + 8, pw, 88, 44); c.fill();
    c.fillStyle = "rgba(14,22,66,0.9)"; H.rr(c, x0 - 18, y0 - 44, pw, 88, 44); c.fill();
    c.strokeStyle = "rgba(255,255,255,0.14)"; c.lineWidth = 2; H.rr(c, x0 - 18, y0 - 44, pw, 88, 44); c.stroke();
    for (let i = 0; i < 5; i++) {
      const x = x0 + R + i * gap, on = i === cur && !done(i), dn = done(i), pp = on ? pop(t, e.step[i], 12, 0.45) : 1;
      if (i < 4) { c.strokeStyle = dn ? D.hexA(GREEN, 0.9) : "rgba(255,255,255,0.18)"; c.lineWidth = 5; c.beginPath(); c.moveTo(x + R, y0); c.lineTo(x + gap - R, y0); c.stroke(); }
      c.save(); scaleAt(c, x, y0, on ? 0.85 + 0.25 * pp + 0.04 * Math.sin(t * 5) : 1);
      if (on) D.glow(c, x, y0, R * 2.4, P.amber, 0.45);
      if (dn) { const k = pop(t, i < cur ? e.step[i + 1] : e.allDone, 12, 0.5); check(c, x, y0, R * (0.6 + 0.4 * Math.min(1, k)), GREEN); }
      else { c.fillStyle = on ? P.amber : "rgba(255,255,255,0.08)"; c.beginPath(); c.arc(x, y0, R, 0, TAU); c.fill();
        if (!on) { c.strokeStyle = "rgba(255,255,255,0.35)"; c.lineWidth = 3; c.stroke(); }
        say(c, String(i + 1), x, y0 + 2, 40, on ? INK : "rgba(242,246,255,0.75)", { w: 900 }); }
      c.restore();
    }
    if (lab) { const k = ramp(t, e.step[cur], 0.35); c.save(); c.globalAlpha *= k; say(c, lab, x0 + gap * 5 + 12, y0 + 2, 46, "#FFFFFF", { align: "left", w: 800 }); c.restore(); }
    c.restore();
  }

  // ---------- kamera ruang makan ----------
  function roomCam(t, e) {
    return D.path([
      [e.b8_1, 960, 590, 1.2], [e.sepakati - 0.2, 960, 598, 1.25], [e.kalimat - 0.35, 950, 612, 1.55], [e.klgE + 0.5, 950, 612, 1.57],
      [e.jangan + 0.1, 1000, 596, 1.3], [e.saat, 1015, 592, 1.29],
      [e.b8_2 + 0.6, 1090, 565, 1.38], [e.b8_2e - 0.3, 1110, 558, 1.42],
      [e.b8_3 + 0.4, 990, 572, 1.2], [e.b8_3e, 970, 572, 1.24],
    ], t);
  }

  // ---------- keluarga di meja makan ----------
  const FY = 806, MEJA = 664;
  function family(e, t) {
    const lookBip = win(t, e.sepakati - 0.2, e.klgE + 0.2, 0.5, 0.6), ring = win(t, e.saat, e.tanyakan + 0.6, 0.2, 0.4);
    const happy = t > e.hanya + 0.3 && t < e.jangan - 0.2;
    const toPhone = ease(t, e.saat - 0.15, 0.5);   // Bu Rina mengangkat HP
    const lower = win(t, e.tutup, e.simpan, 0.4, 0.4);   // HP diturunkan untuk memilih kontak (b8_2)
    const tudungLift = ease(t, e.menu, 0.8);
    const pikir = win(t, e.nama - 0.1, e.b8_3e + 2, 0.4, 0.4);
    const L0 = [];
    // nenek
    L0.push({ name: "nenek", x: 612, h: 340, o: { pose: "dudukMeja", look: lookBip > 0.5 ? [0.8, -0.3] : ring > 0.3 ? [1, 0] : [0.3, 0.1],
      face: pikir > 0.3 ? "senang" : happy ? "senang" : "netral" } });
    // ayah
    L0.push({ name: "ayah", x: 792, h: 372, o: { pose: "dudukMeja", look: lookBip > 0.5 ? [0.9, -0.1] : ring > 0.3 ? [1, 0] : t > e.menu ? [0.5, 0.5] : [0.2, 0.1],
      face: happy || tudungLift > 0.5 ? "senang" : "netral" } });
    // Bu Rina
    const ph = t >= e.saat - 0.15;
    const ro = { pose: "dudukMeja", look: lookBip > 0.5 ? [-0.6, -0.1] : [0, 0.1], face: happy ? "senang" : "netral" };
    if (ph) {
      if (lower > 0.001) { ro.pose = "telepon"; ro.blend = { to: "pegangHP", k: eio(lower) }; }
      else ro.blend = { to: "telepon", k: toPhone };
      ro.layar = ring > 0.2 && t < e.b8_2 ? MINI.masuk : MINI.bicara; ro.dering = ring > 0.2 && t < e.tanyakan;
      ro.face = t < e.tanyakan ? "bingung" : "netral"; ro.look = [-0.2, 0]; }
    L0.push({ name: "buRina", x: 1130, h: 368, o: ro });
    // anak: duduk, lalu berdiri dan berjalan keluar ke kanan saat telepon darurat datang; kursinya tetap kosong sesudahnya
    if (t < e.anakPergi) {
      const up = ease(t, e.anakBangun, 0.45), wu = clamp((t - e.anakJalan) / (e.anakPergi - e.anakJalan));
      const ax = 1314 + 660 * (wu < 0.2 ? wu * wu / 0.4 : wu - 0.1) / 0.9;
      L0.push({ name: "anakRina", x: ax, h: 348, up, walk: t > e.anakJalan, o: { pose: "dudukMeja", look: lookBip > 0.5 ? [-0.9, -0.2] : ring > 0.3 ? [-1, 0] : [-0.3, 0.1],
        face: happy || tudungLift > 0.5 ? "senang" : "netral" } });
    }
    return L0;
  }
  const HEAD = {};   // anchors terakhir tiap tokoh (koordinat ruang), untuk ekor gelembung
  const ANAK_DY = 63;   // selisih tinggi kepala duduk vs berdiri (h 348)
  function drawFamily(ctx, t, e, dx, layer) {
    family(e, t).forEach((f, i) => {
      const o = Object.assign(O.preset(f.name), f.o, { t, mejaY: MEJA, kursi: false, lapis: layer, seed: i * 3 + 1 });
      if (o.blend || o.pose !== "dudukMeja") o.duduk = true;
      const up = f.up || 0;
      if (up < 1) {   // duduk (memudar saat berdiri)
        if (up > 0) o.alpha = 1 - up;
        if (layer === "badan") { ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 4000 + 652); ctx.clip(); HEAD[f.name] = O.draw(ctx, f.x + dx, FY, f.h, o); ctx.restore(); }
        else O.draw(ctx, f.x + dx, FY, f.h, o);
      }
      if (up > 0 && layer === "badan") {   // berdiri/berjalan di belakang meja: meja menutupi kaki (klip tanpa daerah meja)
        const so = Object.assign(O.preset(f.name), { t, seed: i * 3 + 1, pose: "berdiri", jalan: !!f.walk, speed: 1.9, look: f.walk ? [1, 0] : [0.6, 0], face: "netral", alpha: up });
        ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 9000); ctx.rect(548 + dx, 650, 824, 900); ctx.clip("evenodd");
        HEAD[f.name] = O.draw(ctx, f.x + dx, FY + ANAK_DY * (1 - up), f.h, so); ctx.restore();
      }
    });
  }
  function headOf(e, t, name) {   // posisi kepala tokoh di koordinat ruang (perkiraan dari anchors)
    const f = family(e, t).find(x => x.name === name); return f;
  }
  function makanan(c, dx, t, tudung, reveal, tengah = true, lift = false) {
    const tt = 650, x = v => v + dx;
    const ell = (px, py, rx, ry, col) => { c.fillStyle = col; c.beginPath(); c.ellipse(px, py, rx, ry, 0, 0, TAU); c.fill(); };
    // piring dan gelas di sisi
    [780, 1140].forEach(px => { ell(x(px), tt + 32, 62, 12, "#FFFFFF"); ell(x(px), tt + 30, 44, 8, "#E6E8F8"); });
    [640, 1280].forEach(px => ell(x(px), tt + 44, 48, 10, "#FFFFFF"));
    [870, 1050].forEach((px, i) => { rr(c, x(px) - 14, tt - 18, 28, 50, 6, "rgba(191,227,255,0.7)"); c.fillStyle = i ? "rgba(255,181,71,0.7)" : "rgba(201,96,63,0.7)"; c.fillRect(x(px) - 12, tt + 6, 24, 24); });
    // hidangan tengah (menu kemarin): mangkuk sayur asem + piring tempe goreng; uap tipis (baru ada sesudah tudung saji turun)
    if (!tengah) { if (tudung > 0.01) LT.parts.tudungSaji(c, x(960), tt + 26 - (1 - tudung) * 200, 200, t, Math.min(1, tudung * 2.5)); return; }
    ell(x(905), tt + 30, 66, 13, "#FFFFFF"); c.fillStyle = "#FFFFFF"; c.beginPath(); c.ellipse(x(905), tt + 20, 60, 34, 0, 0, Math.PI); c.fill();
    ell(x(905), tt + 18, 56, 11, "#E9A23B"); [[-26, 0, "#5BD68A"], [8, -3, "#C9603F"], [28, 2, "#7FD36B"], [-6, 3, "#FFD38A"]].forEach(([ox, oy, col]) => ell(x(905) + ox, tt + 18 + oy, 11, 5, col));
    ell(x(1025), tt + 30, 70, 13, "#FFFFFF"); ell(x(1025), tt + 28, 52, 9, "#E6E8F8");
    [[-28, 0], [0, -4], [26, 1], [-12, 6], [14, 6]].forEach(([ox, oy]) => { rr(c, x(1025) + ox - 15, tt + 16 + oy, 30, 14, 3, "#B9783A"); c.fillStyle = "#D99A52"; c.fillRect(x(1025) + ox - 12, tt + 18 + oy, 24, 4); });
    if (reveal > 0.05) for (let i = 0; i < 3; i++) { const u = (t * 0.45 + i / 3) % 1; c.strokeStyle = `rgba(255,255,255,${0.45 * reveal * Math.sin(u * Math.PI)})`; c.lineWidth = 5; c.lineCap = "round";
      c.beginPath(); const sx = x(895) + i * 12; c.moveTo(sx, tt - 6 - u * 70); c.bezierCurveTo(sx + 12, tt - 26 - u * 70, sx - 12, tt - 40 - u * 70, sx + 4, tt - 56 - u * 70); c.stroke(); }
    if (tudung > 0.01) { if (lift) LT.parts.tudungSaji(c, x(960), tt + 26 - (1 - tudung) * 70, 200, t, clamp(tudung * 1.3 - 0.15));   // diangkat sedikit sambil memudar (tidak menutupi wajah)
      else LT.parts.tudungSaji(c, x(960), tt + 26 - (1 - tudung) * 200, 200, t, Math.min(1, tudung * 2.5)); }
  }

  // ---------- ruang makan (koordinat ruang; kamera di luar) ----------
  let ROOMDX = 0;
  const NOTE = { x: 905, y: 690, s: 110 };            // kertas terlipat di meja (ruang)
  const PAPER = { x: 905, y: 708, w: 205, k: 0.56 };   // kertas terbuka berbaring di meja: tengah tepi bawah, lebar (ruang), pemendekan
  const BIPR = { x: 1010, y: 597, s: 150 };            // Bip berdiri di meja (ruang)
  function room(ctx, t, e, cm) {
    ctx.save(); ctx.translate(W / 2, HH / 2); ctx.scale(cm.z, cm.z); ctx.translate(-cm.x, -cm.y);
    const px = clamp((cm.x - 960) / 300, -1, 1) * 0.5, opt = { makanan: false, near: false, px, jam: 19.5 };
    const R = LT.ruangMakan(ctx, t, opt), dx = R.anchors.tableTop.x0 - 596; ROOMDX = dx;
    drawFamily(ctx, t, e, dx, "badan");
    const tud = t < e.b8_2 + 0.3 ? 0 : 1 - ease(t, e.menu, 0.9);
    makanan(ctx, dx, t, t < e.b8_2 + 0.3 ? 0 : (t < e.menu ? Math.min(1, ramp(t, e.b8_2 + 0.3, 0.4)) : tud), t < e.b8_2 ? 1 : ease(t, e.menu + 0.3, 0.8), t > e.b8_2 + 0.75, t > e.menu);
    drawFamily(ctx, t, e, dx, "lengan");
    // kertas terlipat kecil di meja (sesudah dilipat di tempat; sama dengan akhir lipatan di lapisan atas)
    if (t >= e.klgE + 0.6) { const glowA = win(t, e.tanyakan, e.b8_2 + 0.4, 0.3, 0.5); if (glowA > 0) D.glow(ctx, NOTE.x + dx, NOTE.y, 120, P.amber, 0.6 * glowA * (0.8 + 0.2 * Math.sin(t * 6)));
      B.kertasLipat(ctx, NOTE.x + dx, NOTE.y, NOTE.s, { word: "", fold: 1, t }); }
    // kucing Si Oyen (b8_3): masuk dari kanan di lantai depan, lalu duduk
    if (t > e.b8_3 && t < e.b8_4 + 1.5) { const u = ease(t, e.nama - 1.0, 1.6), x = lerp(2150, 1420, u);
      kucing(ctx, x + dx * 1.3, 905, 96, t, u < 1 ? 1 : 0, -1); }
    LT.depan(ctx, "ruangMakan", t, opt);
    ctx.restore();
    return { dx };
  }
  // titik ruang → layar
  function toScr(cm, x, y) { return [W / 2 + (x - cm.x) * cm.z, HH / 2 + (y - cm.y) * cm.z]; }

  // ---------- kartu peramban "Internet" (b8_3) ----------
  function browser(c, x, y, w, h, t, e, a) {
    if (a <= 0.001) return; const s = Math.min(1.05, spring(a * 0.9, 11, 0.55));
    c.save(); c.globalAlpha *= clamp(a * 2.5); scaleAt(c, x + w / 2, y, s);
    shadowBox(c, x, y, w, h, 30); rr(c, x, y, w, h, 30, "#F4F6FF");
    c.save(); H.rr(c, x, y, w, h, 30); c.clip(); rr(c, x, y, w, 70, 0, "#5B6BE0");
    [0, 1, 2].forEach(i => { c.fillStyle = ["#FF8FA3", "#FFD38A", "#8BE3B0"][i]; c.beginPath(); c.arc(x + 34 + i * 30, y + 35, 10, 0, TAU); c.fill(); });
    globe(c, x + w - 46, y + 35, 22, "#8FB8FF"); c.restore();
    say(c, "Internet", x + 140, y + 37, 42, "#FFFFFF", { align: "left", w: 800 });
    // kolom cari: kueri sungguhan diketik, lalu "Tidak ditemukan" (dua kali: kucing pertama, menu kemarin)
    const qs = [{ s: "kucing pertama Rina", t0: e.pertanyaan - 0.05, done: e.internet }, { s: "menu kemarin Rina", t0: e.menu + 0.1, done: e.kemarin + 0.4 }];
    let q = null; qs.forEach(z => { if (t >= z.t0) q = z; });
    const fy = y + 86; rr(c, x + 30, fy, w - 60, 78, 39, "#FFFFFF"); c.strokeStyle = "#C9D0EE"; c.lineWidth = 3; H.rr(c, x + 30, fy, w - 60, 78, 39); c.stroke();
    L.ikon(c, "cari", x + 76, fy + 39, 34, "#5B6BE0");
    const n = q ? Math.floor(clamp((t - q.t0) / 0.85) * q.s.length) : 0, shown = q ? q.s.slice(0, n) : "";
    if (shown) say(c, shown, x + 112, fy + 41, 44, INK, { align: "left", w: 700 });
    if (Math.floor(t * 2) % 2 === 0 || (q && t < q.t0 + 0.85)) { const cx0 = x + 112 + (shown ? tw(c, shown, 44, 700) : 0) + 6; c.fillStyle = "#5B6BE0"; c.fillRect(cx0, fy + 17, 4, 44); }
    // hasil: putaran memuat, lalu "Tidak ditemukan"
    const ry = fy + 92;
    if (q) { const load = win(t, q.t0 + 0.9, q.done, 0.12, 0.12);
      if (load > 0) { c.save(); c.globalAlpha *= load; c.strokeStyle = "#5B6BE0"; c.lineWidth = 9; c.lineCap = "round"; c.beginPath(); c.arc(x + w / 2, ry + 40, 30, t * 7, t * 7 + 4.2); c.stroke(); c.restore(); }
      const nf = ramp(t, q.done, 0.25), done = q.done;
      if (nf > 0) { const sh = Math.sin((t - done) * 40) * 10 * Math.exp(-(t - done) * 5); c.save(); c.globalAlpha *= nf; c.translate(sh, 0);
        cross(c, x + 74, ry + 40, 32, RED); say(c, "Tidak ditemukan", x + 124, ry + 42, 46, "#C23B4E", { align: "left", w: 800 }); c.restore(); } }
    c.restore();
  }

  // ---------- kartu status media sosial yang dicap larangan (b8_1) ----------
  function statusCard(c, x, y, w, t, e, a) {
    if (a <= 0.001) return; const s = Math.min(1.05, spring(a * 0.9, 11, 0.55)), h = 270;
    c.save(); c.globalAlpha *= clamp(a * 2.5); scaleAt(c, x + w / 2, y + h / 2, s);
    shadowBox(c, x, y, w, h, 30); rr(c, x, y, w, h, 30, "#FFFFFF");
    c.save(); H.rr(c, x, y, w, h, 30); c.clip(); const gr = c.createLinearGradient(x, y, x + w, y); gr.addColorStop(0, "#FF7A9C"); gr.addColorStop(1, "#9A6BFF"); c.fillStyle = gr; c.fillRect(x, y, w, 80); c.restore();
    avatarPolos(c, x + 50, y + 40, 26, "#FFB547");
    say(c, "Status baru", x + 92, y + 42, 44, "#FFFFFF", { align: "left", w: 800 });
    L.ikon(c, "bagikan", x + w - 44, y + 40, 34, "#FFFFFF");
    say(c, "Kata sandi kami:", x + 36, y + 128, 44, INK, { align: "left", w: 700 });
    say(c, "Kerupuk biru", x + 36, y + 200, 54, "#2D57C8", { align: "left", w: 900 });
    // cap larangan
    const st = pop(t, e.medsos + 0.05, 13, 0.5);
    if (st > 0) { c.save(); const cx = x + w * 0.64, cy = y + h * 0.58, r = 104; scaleAt(c, cx, cy, 1.5 - 0.5 * Math.min(1, st)); c.globalAlpha *= Math.min(1, st * 1.4);
      c.strokeStyle = RED; c.lineWidth = 22; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(cx - r * 0.7, cy - r * 0.7); c.lineTo(cx + r * 0.7, cy + r * 0.7); c.stroke(); c.restore(); }
    c.restore();
  }

  // ---------- jendela bulat ke kampung (b8_2) ----------
  function portal(c, cx, cy, r, t, e, a) {
    if (a <= 0.001) return; const s = Math.min(1.05, spring(a * 0.9, 10, 0.55));
    c.save(); c.globalAlpha *= clamp(a * 2.5); scaleAt(c, cx, cy, s);
    c.fillStyle = "rgba(12,16,56,0.35)"; c.beginPath(); c.arc(cx + 6, cy + 14, r + 10, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.clip();
    const k = 1.9, ax = 760, ay = 700; c.translate(cx, cy); c.scale(k, k); c.translate(-ax, -(ay));
    LT.kampung(c, t, { senja: 0.85, lampu: 0.7, near: false });
    // anak menjawab telepon; tetangga muncul di dekatnya
    const ans = ramp(t, e.dihub - 0.2, 0.4), ng = ease(t, e.atau, 0.8);
    O.draw(c, 760 - 26 * ng, 842, 168, Object.assign(O.preset("anakRina"), { pose: ans > 0.5 ? "telepon" : "pegangHP", dering: t < e.dihub - 0.2, layar: ans > 0.5 ? MINI.bicara : MINI.masuk,
      face: ans > 0.5 ? "senang" : "netral", t, seed: 5, look: ng > 0.5 ? [0.6, 0] : [0, 0.2] }));
    if (ng > 0.01) { c.save(); c.globalAlpha *= ng; O.draw(c, lerp(980, 870, ng), 842, 176, { age: "dewasa", hair: "pendek", kacamata: true, skin: O.SKIN[4], top: "#7BC67E", outfit: "kemeja",
      bottom: "#3A3F6E", pose: t > e.dekat + 0.4 ? "pegangHP" : "berdiri", face: "senang", t, seed: 21, flip: true, look: [-0.6, 0], jalan: ng < 1, layar: MINI.chat }); c.restore(); }
    c.restore();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = 12; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke();
    c.strokeStyle = D.hexA(P.teal, 0.8); c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, r + 14, 0, TAU); c.stroke();
    // centang
    const ok1 = pop(t, e.dihub + 0.25, 12, 0.5), ok2 = pop(t, e.pastikan, 12, 0.5);
    if (ok1 > 0) { c.save(); scaleAt(c, cx + r * 0.72, cy - r * 0.72, Math.min(1, ok1)); check(c, cx + r * 0.72, cy - r * 0.72, 46, GREEN); c.restore(); }
    if (ok2 > 0) { c.save(); scaleAt(c, cx + r * 0.95, cy - r * 0.2, Math.min(1, ok2)); check(c, cx + r * 0.95, cy - r * 0.2, 40, GREEN); c.restore(); }
    c.restore();
  }

  // ---------- layar unggah video (b8_4), layar lokal (w × h px) ----------
  function layarUnggah(c, w, h, t, e) {
    const u = w / 100; c.save();
    c.fillStyle = "#EEF0FA"; c.fillRect(0, 0, w, h);
    const hg = c.createLinearGradient(0, 0, w, 0); hg.addColorStop(0, "#FF7A9C"); hg.addColorStop(1, "#9A6BFF"); c.fillStyle = hg; c.fillRect(0, 0, w, u * 18);
    L.ikon(c, "unggah", u * 12, u * 9, u * 9, "#FFFFFF"); L.ikon(c, "video", w - u * 12, u * 9, u * 9, "#FFFFFF");
    // pratinjau video: anak di depan gerbang sekolah
    const vy = u * 22, vh = u * 62; c.save(); H.rr(c, u * 5, vy, w - u * 10, vh, u * 4); c.clip();
    const sg = c.createLinearGradient(0, vy, 0, vy + vh); sg.addColorStop(0, "#9FD4FF"); sg.addColorStop(1, "#DDEFFF"); c.fillStyle = sg; c.fillRect(0, vy, w, vh);
    rr(c, u * 8, vy + vh * 0.3, u * 50, vh * 0.7, u * 2, "#F2E3C8"); rr(c, u * 8, vy + vh * 0.24, u * 50, vh * 0.1, u * 1, "#D96B5B");
    for (let i = 0; i < 3; i++) rr(c, u * (13 + i * 15), vy + vh * 0.45, u * 9, vh * 0.16, u * 1, "#7FB2E6");
    c.strokeStyle = "#9A8F84"; c.lineWidth = u * 1.1; c.beginPath(); c.moveTo(u * 70, vy + vh); c.lineTo(u * 70, vy + vh * 0.12); c.stroke();
    const fw = Math.sin(t * 3) * u * 1.2; c.fillStyle = RED; c.fillRect(u * 70, vy + vh * 0.12, u * 14, u * 4.5 + fw * 0.2); c.fillStyle = "#FFFFFF"; c.fillRect(u * 70, vy + vh * 0.12 + u * 4.5, u * 14, u * 4.5);
    O.kepala(c, u * 50, vy + vh * 0.58, u * 15, Object.assign(O.preset("anakRina"), { face: "senang", t, bahu: 1.4, seed: 5 }));
    c.restore();
    { const qx = u * 16, qy = vy + vh - u * 11; c.fillStyle = "rgba(255,255,255,0.88)"; c.beginPath(); c.arc(qx, qy, u * 7, 0, TAU); c.fill(); c.fillStyle = "#5B6BE0"; c.beginPath(); c.moveTo(qx - u * 2.2, qy - u * 3.4); c.lineTo(qx + u * 3.8, qy); c.lineTo(qx - u * 2.2, qy + u * 3.4); c.closePath(); c.fill(); }
    // label yang perlu dipikirkan
    const tag = (yy, label, ic, t0) => { const hi = win(t, t0, e.b8_5 + 1, 0.2, 0.3), p = hi * (0.6 + 0.4 * Math.sin(t * 7));
      rr(c, u * 3, yy, w - u * 6, u * 22, u * 6, hi > 0.05 ? "#FFF1D6" : "#FFFFFF");
      if (hi > 0.05) { c.strokeStyle = D.hexA("#F08A24", 0.5 + 0.5 * p); c.lineWidth = u * 1.4; H.rr(c, u * 3, yy, w - u * 6, u * 22, u * 6); c.stroke(); }
      c.fillStyle = "rgba(91,107,224,0.14)"; c.beginPath(); c.arc(u * 9.5, yy + u * 11, u * 5, 0, TAU); c.fill();
      ic(u * 9.5, yy + u * 11); say(c, label, u * 16.5, yy + u * 11.5, 44, INK, { align: "left", w: 700 }); };
    tag(u * 90, "Nama lengkap", (x, y) => L.ikon(c, "orang", x, y, u * 5.5, "#5B6BE0"), e.namaL);
    tag(u * 116, "Sekolah", (x, y) => { c.fillStyle = "#5B6BE0"; c.beginPath(); c.moveTo(x - u * 3.4, y - u * 0.4); c.lineTo(x, y - u * 3.6); c.lineTo(x + u * 3.4, y - u * 0.4); c.closePath(); c.fill(); c.fillRect(x - u * 2.8, y - u * 0.4, u * 5.6, u * 3.4); }, e.sekolah);
    // tombol Unggah
    const by = u * 145; rr(c, u * 10, by, w - u * 20, u * 22, u * 11, "#FF6F91");
    say(c, "Unggah", w / 2, by + u * 11.5, Math.min(48, u * 13.5), "#FFFFFF", { w: 900 });
    c.restore(); return { unggah: { cx: w / 2, cy: by + u * 11, x: u * 10, y: by, w: w - u * 20, h: u * 22 } };
  }

  // ---------- adegan peta (b8_4) dan jalur uang (b8_5), di layar ----------
  const MAP = { cx: 630, cy: 486, s: 0.8 };
  function mapIconPos(i, t) {   // rumus posisi ikon sosial() (n = 4, show penuh) — sama dengan bab 3
    const ang = -Math.PI / 2 + (i - 1.5) * 0.78, bob = Math.sin(t * 1.8 + i * 1.7) * 7;
    return [MAP.cx + (60 + Math.cos(ang) * 330 + Math.sin(t * 0.7 + i) * 6) * MAP.s, MAP.cy + (-2 + Math.sin(ang) * 250 + bob) * MAP.s];
  }
  const HOUSE = () => [MAP.cx + 60 * MAP.s, MAP.cy - 2 * MAP.s];
  function clip(c, x, y, prof, a) {   // potongan rekaman suara kecil (spektrogram)
    if (a <= 0.01) return; c.save(); c.globalAlpha *= a; rr(c, x - 64, y - 32, 128, 64, 12, "rgba(14,22,66,0.9)");
    L.spektrogram(c, x - 58, y - 26, 116, 52, { profil: prof, dur: 2, r: 8 }); c.strokeStyle = D.hexA(prof.aksen || P.pink, 0.95); c.lineWidth = 3; H.rr(c, x - 64, y - 32, 128, 64, 12); c.stroke(); c.restore();
  }

  function sceneMap(ctx, t, e, k) {   // k: 0..1 masuk (dari ruang makan)
    LT.studio(ctx, t, { warna: "ungu", px: -0.2 });
    const lock = ease(t, e.privat - 0.1, 1.6), show = 0.35 + 0.65 * ease(t, e.b8_4 + 0.1, 1.0);
    const sz = lerp(2.4, 1, eio(k)), mp = HOUSE();
    ctx.save(); scaleAt(ctx, mp[0], mp[1], sz); ctx.globalAlpha *= clamp(k * 1.5);
    const dimA = win(t, e.pikirkan - 0.2, 99, 0.6, 0.3) * 0.35;
    PT.sosial(ctx, MAP.cx, MAP.cy, MAP.s, { t, icons: ["video", "live", "video", "voice"], show, lock });
    if (dimA > 0) { ctx.fillStyle = `rgba(30,24,80,${dimA})`; H.rr(ctx, MAP.cx - 600 * MAP.s, MAP.cy - 400 * MAP.s, 1200 * MAP.s, 800 * MAP.s, 56 * MAP.s); ctx.fill(); }
    ctx.restore();
    return { lock };
  }

  // HP yang dibawa dari b8_4 ke b8_5: posisi & ukuran
  function phoneState(t, e) {
    const inA = ease(t, e.phIn, 0.6);   // naik dari bawah dengan opasitas penuh, sesudah pelaku keluar
    const grow = ease(t, e.pikirkan - 0.25, 0.6);
    const mv = ease(t, e.toRoute, 0.9);
    const x0 = lerp(1290, 1300, grow), y0 = lerp(lerp(1480, 520, inA), 500, grow), h0 = lerp(720, 930, grow);
    return { x: lerp(x0, 352, mv), y: lerp(y0, 500, mv), h: lerp(h0, 690, mv), inA, grow, mv };
  }

  K.SCENES = K.SCENES || {};
  const SCN = K.SCENES.d03_b8 = function (ctx, b, l, t, TL) {
    const e = EV(TL);
    const kMap = clamp((t - e.toMap) / 1.0), kRoute = clamp((t - e.toRoute) / 0.9);
    const inRoom = t < e.toMap + 1.0;
    let cm = roomCam(t, e);
    if (kMap > 0 && kMap < 1) { const mp = HOUSE(); cm = { x: cm.x, y: cm.y, z: cm.z }; }

    // ===== fase ruang makan (b8_1–b8_3) =====
    if (t < e.toMap) {
      room(ctx, t, e, cm);
      roomOverlays(ctx, t, e, cm);
    } else if (t < e.toRoute + 0.9) {
      // ===== fase peta (b8_4) =====
      const ms = sceneMap(ctx, t, e, kMap);
      if (kMap < 1) {   // ruang makan menyusut menuju rumah di peta
        const mp = HOUSE(), u = eio(kMap), w = lerp(W, 240, u), h = lerp(HH, 150, u), x = lerp(0, mp[0] - 120, u), y = lerp(0, mp[1] - 75, u);
        ctx.save(); ctx.globalAlpha *= 1 - clamp((kMap - 0.55) / 0.45); H.rr(ctx, x, y, w, h, lerp(0, 30, u)); ctx.clip();
        ctx.translate(x, y); ctx.scale(w / W, h / HH); room(ctx, t, e, cm); ctx.restore();
        if (u > 0.05) { ctx.save(); ctx.globalAlpha *= (1 - clamp((kMap - 0.55) / 0.45)) * clamp(u * 3); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; H.rr(ctx, x, y, w, h, lerp(0, 30, u)); ctx.stroke(); ctx.restore(); }
      }
      mapOverlays(ctx, t, e, ms);
      if (kRoute > 0) { ctx.save(); ctx.globalAlpha *= kRoute; routeScene(ctx, t, e, true); ctx.restore(); }
    } else {
      routeScene(ctx, t, e, false);
    }
    D.post(c => bip45(c, t, e));
    D.post(c => tracker(c, t, e));
  };
  SCN.noCam = true;

  // ---------- lapisan ruang makan (b8_1–b8_3) ----------
  function roomOverlays(ctx, t, e, cm) {
    // b8_1: lingkaran putus-putus mengelilingi keluarga ("hanya diketahui keluargamu")
    if (t > e.hanya && t < e.klgE + 0.6) D.post(c => { const a = win(t, e.hanya, e.klgE + 0.3, 0.3, 0.3); c.save(); c.globalAlpha *= a;
      const [hx, hy] = toScr(cm, 960, 520); c.strokeStyle = D.hexA(P.warm, 0.9); c.lineWidth = 8; c.setLineDash([4, 18]); c.lineCap = "round"; c.lineDashOffset = -t * 30;
      c.beginPath(); c.ellipse(hx, hy + 30, 560 * cm.z, 230 * cm.z, 0, 0, TAU); c.stroke(); c.restore(); });
    // b8_1: status media sosial dicap larangan (di dinding kanan atas, tidak menutupi wajah)
    const sa = win(t, e.jangan + 0.15, e.saat - 0.1, 0.01, 0.35);
    if (sa > 0) D.post(c => statusCard(c, 1240, 118, 580, t, e, ramp(t, e.jangan + 0.15, 0.6) * (1 - ramp(t, e.saat - 0.1, 0.35))));
    // b8_1: Bu Rina bertanya kata sandi (ekor ke kepalanya)
    const qa = win(t, e.tanyakan - 0.1, e.b8_2 - 0.25, 0.01, 0.3);
    if (qa > 0 && HEAD.buRina) { const [hx, hy] = toScr(cm, HEAD.buRina.top[0], HEAD.buRina.top[1]);
      D.post(c => bubble(c, hx + 220, hy - 160, "Kata sandinya apa?", { a: ramp(t, e.tanyakan - 0.1, 0.6) * (1 - ramp(t, e.b8_2 - 0.25, 0.3)), tail: [hx + 8, hy - 8], fs: 50 })); }

    // ===== b8_2: HP membesar, telepon balik =====
    const ov = win(t, e.b8_2 - 0.2, e.b8_3 - 0.1, 0.5, 0.5);
    if (ov > 0) {
      ctx.save(); ctx.fillStyle = `rgba(16,20,60,${0.5 * ov})`; ctx.fillRect(0, 0, W, HH); ctx.restore();
      D.post(c => phoneCall(c, t, e, ov));
    }

    // ===== b8_3: pertanyaan rahasia =====
    const q3 = t > e.b8_3 - 0.2 && t < e.toMap + 0.1;
    if (q3) {
      const rt = HEAD.buRina ? toScr(cm, HEAD.buRina.top[0], HEAD.buRina.top[1]) : toScr(cm, 1130, 470);
      // gelembung Bu Rina: "?" lalu contoh pertanyaan
      const qb = [{ s: null, a: e.ajukan - 0.1, b: e.nama - 0.15 }, { s: "Nama kucing pertama kita?", a: e.nama - 0.1, b: e.menu - 0.15 }, { s: "Kemarin kita makan apa?", a: e.menu - 0.1, b: e.toMap + 0.3 }];
      qb.forEach(q => { const a = win(t, q.a, q.b, 0.01, 0.2); if (a <= 0) return;
        D.post(c => bubble(c, q.s ? 840 : 960, 300, q.s || "", { a: ramp(t, q.a, 0.6) * (1 - ramp(t, q.b, 0.2)), icon: !q.s, t, tail: [rt[0] - 10, rt[1] - 12], fs: 46 })); });
      // kartu Internet: pencarian sungguhan, dua kali "Tidak ditemukan"
      D.post(c => browser(c, 1190, 160, 630, 262, t, e, ramp(t, e.ajukan - 0.15, 0.5) * (1 - ramp(t, e.toMap - 0.1, 0.3))));
      // awan pikiran nenek: Si Oyen
      const ca = win(t, e.pelihara, e.toMap + 0.2, 0.01, 0.3);
      if (ca > 0) { const nt = HEAD.nenek ? toScr(cm, HEAD.nenek.top[0], HEAD.nenek.top[1]) : toScr(cm, 612, 470); D.post(c => cloud(c, 310, 330, 420, 190, nt[0], nt[1] - 14, ramp(t, e.pelihara, 0.6) * (1 - ramp(t, e.toMap, 0.3)),
        cc => { kucingKepala(cc, 200, 336, 54, t); say(cc, "Si Oyen", 362, 338, 50, INK, { w: 900 }); })); }
      // label menu kemarin di meja
      const ma = win(t, e.kemarin - 0.2, e.toMap + 0.2, 0.01, 0.3);
      if (ma > 0) { const [fx, fy] = toScr(cm, 960, 640); D.post(c => { const k = Math.min(1.05, spring(ramp(t, e.kemarin - 0.2, 0.6) * 0.9, 11, 0.5)); c.save(); c.globalAlpha *= clamp(ma * 2) * (1 - ramp(t, e.toMap, 0.3)); scaleAt(c, fx, fy + 150, k);
        PT.tag(c, "Sayur asem & tempe", fx, fy + 150, { size: 46, color: P.green }); c.restore(); }); }
    }
    // Bip (seluruh badan, di atas meja) dan kertas rahasia: lapisan paling atas supaya lengannya bisa meraih HP
    D.post(c => bipRoom(c, t, e, cm));
  }

  // ---------- Bip di ruang makan (b8_1–b8_3), koordinat layar dari posisi ruang ----------
  let PHB = null;   // titik tombol HP besar b8_2 (diisi phoneCall)
  function bipRoomPos(t, e) {
    let x = BIPR.x, walk = 0, dir = 1;
    if (t > e.b8_2 - 0.3) { const u = ease(t, e.b8_2 - 0.3, 0.8); x = lerp(BIPR.x, 1034, u); if (u > 0 && u < 1) walk = 1; }
    if (t > e.b8_3 - 0.15) { const u = clamp((t - e.b8_3 + 0.15) / 1.35); x = lerp(1034, 1290, D.sm ? D.sm(u) : u); if (u > 0 && u < 1) walk = 1; }
    return { x: x + ROOMDX, y: BIPR.y, walk, dir };
  }
  function bipRoom(c, t, e, cm) {
    const a = 1 - ramp(t, e.toMap - 0.45, 0.3); if (a <= 0) return;
    const p = bipRoomPos(t, e), [bx, by] = toScr(cm, p.x, p.y), s = BIPR.s * cm.z;
    c.save(); c.globalAlpha *= a;
    // --- b8_1 ---
    const ps = paperState(t, e);
    if (t < e.b8_2 - 0.3) {
      if (ps.vis && ps.wr > 0 && t < e.hanya - 0.1) {   // menulis "Kerupuk biru": pensil miring ke kiri atas, tangan Bip memegangnya
        const g = paperGeom(c, t, e, cm, ps), tip = [g.px2, g.py2 + Math.sin(t * 38) * 1.5], ang = -2.25, PL = s * 0.46;
        const hd = [tip[0] + Math.cos(ang) * PL * 0.34, tip[1] + Math.sin(ang) * PL * 0.34];
        B.draw(c, bx, by, s, { pose: "tekan", target: [hd[0], hd[1] + 0.169 * s], press: 1, dir: -1, t, seed: 2, mood: "happy" });
        drawPaper(c, t, e, cm, ps, g);
        const sh = [bx - 0.34 * s, by + 0.12 * s];
        if (hd[1] > g.top && sh[1] < g.top) { const u = clamp((g.top - sh[1]) / Math.max(1, hd[1] - sh[1])), cx0 = lerp(sh[0], hd[0], u), cy0 = lerp(sh[1], hd[1], u);
          c.strokeStyle = "#1AC8AD"; c.lineWidth = s * 0.085; c.lineCap = "round"; c.beginPath(); c.moveTo(cx0, cy0); c.lineTo(hd[0], hd[1]); c.stroke(); }
        pensil(c, tip[0], tip[1], ang, PL, t);
        const r = s * 0.07; c.fillStyle = "#22E3C4"; c.beginPath(); c.arc(hd[0], hd[1], r, 0, TAU); c.fill(); c.fillStyle = "rgba(14,156,136,0.35)"; c.beginPath(); c.arc(hd[0], hd[1] + r * 0.2, r * 0.85, 0.1 * Math.PI, 0.9 * Math.PI); c.fill();
        c.fillStyle = "rgba(143,245,227,0.75)"; c.beginPath(); c.arc(hd[0] - r * 0.3, hd[1] - r * 0.35, r * 0.32, 0, TAU); c.fill();
      } else {
        if (t < e.sepakati - 0.2) B.draw(c, bx, by, s, { pose: "diam", wave: t, t, seed: 2, look: [0, 0.2] });
        else if (t < e.kalimat - 0.15) B.draw(c, bx, by, s, { pose: "bisik", dir: t < e.sepakati + 0.75 ? -1 : 1, t, seed: 2 });
        else if (t < e.jangan) B.draw(c, bx, by, s, { pose: "diam", t, seed: 2, mood: "happy", look: t < e.klgE ? [-0.5, 0.5] : [0, 0.2] });
        else if (t < e.saat) B.draw(c, bx, by, s, { pose: "tunjuk", target: [1530, 250], t, seed: 2, mood: t > e.medsos ? "sad" : "think" });
        else B.draw(c, bx, by, s, { pose: "kaget", k: t - e.saat, t, seed: 2, seru: true });
        if (ps.vis) drawPaper(c, t, e, cm, ps, paperGeom(c, t, e, cm, ps));
      }
    }
    // --- b8_2: berjalan sedikit ke kanan HP besar, lalu menekan Tolak dan tombol panggil dengan lengannya sendiri ---
    else if (t < e.b8_3 - 0.15) {
      if (p.walk || t < e.b8_2 + 0.35 || !PHB) B.draw(c, bx, by, s, { pose: p.walk ? "jalan" : "diam", dir: 1, t, seed: 2, mood: "think", look: [-1, 0.2] });
      else if (t > e.tutup + 0.5 && t < e.lalu - 0.15) B.draw(c, bx, by, s, { pose: "diam", t, seed: 2, mood: "happy", look: [-1, 0.1] });   // lengan turun sebentar sesudah menolak
      else if (t < e.simpan + 0.45) {
        const k = ease(t, e.lalu, 0.6), tg = [lerp(PHB.tolak[0], PHB.call[0], k), lerp(PHB.tolak[1], PHB.call[1], k)];
        const b1 = clamp((t - e.tutup + 0.2) / 0.35), b2 = clamp((t - e.simpan + 0.15) / 0.35);
        const pr = Math.max(b1 > 0 && b1 < 1 ? Math.sin(b1 * Math.PI) : 0, b2 > 0 && b2 < 1 ? Math.sin(b2 * Math.PI) : 0);
        B.draw(c, bx, by, s, { pose: "tekan", target: tg, press: pr, dir: -1, t, seed: 2, mood: t > e.tutup && t < e.lalu ? "happy" : "think" });
      } else {
        const wv = win(t, e.dihub + 0.25, e.pastikan + 0.9, 0.2, 0.3);
        B.draw(c, bx, by, s, wv > 0.5 ? { pose: "diam", wave: t, t, seed: 2, mood: "happy", look: [1, -0.2] } : { pose: "diam", t, seed: 2, mood: t > e.dihub ? "happy" : "think", look: [1, -0.25] });
      }
    }
    // --- b8_3: berjalan ke ujung kanan meja (kursi anak kosong), memeriksa kartu Internet, menunjuk kucing, lalu makanan ---
    else {
      if (p.walk) B.draw(c, bx, by, s, { pose: "jalan", dir: 1, t, seed: 2, mood: "think" });
      else if (t < e.nama) B.draw(c, bx, by, s, { pose: "kacaPembesar", target: [1520, 300], t, seed: 2, mood: t > e.internet + 0.3 ? "sad" : "think",
        content: (cc, cx, cy, r) => { cc.fillStyle = "rgba(255,255,255,0.55)"; cc.fillRect(cx - r, cy - r, 2 * r, 2 * r); cross(cc, cx, cy, r * 0.5, RED, ramp(t, e.internet + 0.1, 0.3)); } });
      else if (t < e.menu) { const kt = toScr(cm, catX(t, e) + ROOMDX * 1.3, 860); B.draw(c, bx, by, s, { pose: "tunjuk", target: kt, t, seed: 2, mood: "happy" }); }
      else { const ft = toScr(cm, 990 + ROOMDX, 640); B.draw(c, bx, by, s, { pose: "tunjuk", target: ft, t, seed: 2, mood: "wow" }); }
    }
    c.restore();
  }
  function catX(t, e) { return lerp(2150, 1420, ease(t, e.nama - 1.0, 1.6)); }
  function pensil(c, x, y, ang, len, t) {   // ujung di (x, y), badan ke arah ang, panjang len
    const wd = len * 0.15, L2 = len - wd * 2.1; c.save(); c.translate(x, y); c.rotate(ang);
    c.fillStyle = "rgba(12,16,56,0.18)"; c.fillRect(wd * 0.9, -wd / 2 + 6, L2, wd);
    c.fillStyle = "#F2D0A4"; c.beginPath(); c.moveTo(0, 0); c.lineTo(wd * 1.3, -wd / 2); c.lineTo(wd * 1.3, wd / 2); c.closePath(); c.fill();
    c.fillStyle = "#2B3A9A"; c.beginPath(); c.moveTo(0, 0); c.lineTo(wd * 0.45, -wd * 0.18); c.lineTo(wd * 0.45, wd * 0.18); c.closePath(); c.fill();
    c.fillStyle = "#FFB547"; c.fillRect(wd * 1.3, -wd / 2, L2, wd); c.fillStyle = "#E89A2C"; c.fillRect(wd * 1.3, wd * 0.12, L2, wd * 0.38);
    c.fillStyle = "#C9CBD8"; c.fillRect(wd * 1.3 + L2, -wd / 2, wd * 0.5, wd); c.fillStyle = "#FF8FA3"; H.rr(c, wd * 1.8 + L2, -wd / 2, wd * 0.8, wd, wd * 0.3); c.fill(); c.restore();
  }

  // ---------- kertas rahasia di atas meja (b8_1): berbaring di meja, ditulis, dilipat di tempat ----------
  function paperState(t, e) {
    return { vis: t >= e.kalimat - 0.35 && t < e.klgE + 0.6, s0: Math.min(1.05, spring(Math.max(0, t - e.kalimat + 0.35) * 0.9, 10, 0.55)),
      wr: clamp((t - e.kalimat + 0.05) / 1.25), fold: ease(t, e.hanya - 0.1, 0.9), end: ease(t, e.klgE + 0.05, 0.5) };
  }
  function paperGeom(c, t, e, cm, ps) {
    const [Bx, By] = toScr(cm, PAPER.x + ROOMDX, PAPER.y), sw = PAPER.w * cm.z, [Nx, Ny] = toScr(cm, NOTE.x + ROOMDX, NOTE.y);
    const kk = lerp(PAPER.k, 1, ps.end), size = lerp(sw, NOTE.s * cm.z, ps.end) * ps.s0, ts = lerp(0.84, 1, ps.end);
    const cx = lerp(Bx, Nx, ps.end), cy = lerp(By - 0.34 * sw * PAPER.k * ps.s0, Ny, ps.end);
    const hl = 0.68 * size, wyl = -0.17 * hl, sxT = lerp(ts, 1, (wyl + hl / 2) / hl);   // baris tulisan: skala datar perspektif
    const fs = 50; c.font = `italic 700 ${fs}px ${FONT}`; const ws = c.measureText("Kerupuk biru").width * sxT;
    const ty = cy + wyl * kk, px2 = cx - ws / 2 + ws * ps.wr, py2 = ty + fs * 0.16;
    return { cx, cy, size, kk, ts, fs, ws, sxT, ty, px2, py2, top: cy - hl / 2 * kk, bottom: cy + hl / 2 * kk };
  }
  function drawPaper(c, t, e, cm, ps, g) {
    c.save(); c.globalAlpha *= clamp((t - e.kalimat + 0.35) / 0.2);
    c.fillStyle = "rgba(14,18,60,0.22)"; c.beginPath(); c.ellipse(g.cx, g.bottom + 3, g.size * 0.52, 8, 0, 0, TAU); c.fill();
    // kertas berbaring di meja: tepi atas lebih sempit (perspektif semu, digambar per jalur)
    const N = 32, hl = 0.68 * g.size;
    for (let i = 0; i < N; i++) { const y0 = g.top + i / N * hl * g.kk, y1 = g.top + (i + 1) / N * hl * g.kk, sx = lerp(g.ts, 1, (i + 0.5) / N);
      c.save(); c.beginPath(); c.rect(g.cx - g.size, y0 - 0.6, g.size * 2, y1 - y0 + 1.2); c.clip();
      c.translate(g.cx, g.cy); c.scale(sx, g.kk); B.kertasLipat(c, 0, 0, g.size, { word: "", fold: ps.fold, pencil: false, t }); c.restore(); }
    const wa = 1 - clamp(ps.fold / 0.22);
    if (wa > 0 && ps.wr > 0) {
      c.save(); c.globalAlpha *= wa; c.beginPath(); c.rect(g.cx - g.ws / 2 - 10, g.ty - g.fs, (g.ws + 20) * ps.wr, g.fs * 2.2); c.clip();
      c.font = `italic 700 ${g.fs}px ${FONT}`; c.fillStyle = "#2B3A9A"; c.textAlign = "center"; c.textBaseline = "middle"; c.translate(g.cx, g.ty); c.scale(g.sxT, 0.8); c.rotate(-0.025); c.fillText("Kerupuk biru", 0, 0); c.restore();
      if (ps.wr >= 1) { c.save(); c.globalAlpha *= wa; c.strokeStyle = "rgba(43,58,154,0.75)"; c.lineWidth = g.fs * 0.06; c.lineCap = "round"; c.beginPath(); c.moveTo(g.cx - g.ws / 2, g.ty + g.fs * 0.42); c.quadraticCurveTo(g.cx, g.ty + g.fs * 0.34, g.cx + g.ws / 2 + g.fs * 0.1, g.ty + g.fs * 0.46); c.stroke(); c.restore(); }
    }
    c.restore();
  }

  // ---------- b8_2: HP besar + jari Bip + jendela kampung ----------
  // layar panggilan masuk sendiri: tombol besar tanpa label (warna + ikon), teks ≥ 44 px dengan jarak tepi
  function layarMasuk(c, w, h, t) {
    const u = w / 100, g2 = c.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, "#5B6BE0"); g2.addColorStop(1, "#8A5FD6"); c.fillStyle = g2; c.fillRect(0, 0, w, h);
    const ay = h * 0.24; for (let i = 0; i < 3; i++) { const ph = (t * 0.9 + i / 3) % 1; c.strokeStyle = `rgba(255,255,255,${0.35 * (1 - ph)})`; c.lineWidth = u * 1.2; c.beginPath(); c.arc(w / 2, ay, u * (17 + ph * 18), 0, TAU); c.stroke(); }
    c.fillStyle = "rgba(255,255,255,0.22)"; c.beginPath(); c.arc(w / 2, ay, u * 17, 0, TAU); c.fill(); tanyaPath(c, w / 2, ay - u * 1, u * 16, "#FFFFFF");
    say(c, "Nomor tidak", w / 2, h * 0.43, 46, "#FFFFFF", { w: 800 }); say(c, "dikenal", w / 2, h * 0.43 + 56, 46, "#FFFFFF", { w: 800 });
    const by = h * 0.8, r = u * 13, tx = w * 0.27, gx = w * 0.73, jig = Math.sin(t * 9) * u * 0.8;
    c.fillStyle = D.hexA(GREEN, 0.3 * (0.5 + 0.5 * Math.sin(t * 5))); c.beginPath(); c.arc(gx, by, r * 1.35, 0, TAU); c.fill();
    bulat(c, tx, by, r, RED, "tutup"); bulat(c, gx + jig, by, r, GREEN, "telepon");
    return { tolak: { cx: tx, cy: by, r }, terima: { cx: gx, cy: by, r } };
  }
  function phoneCall(c, t, e, ov) {
    const s0 = Math.min(1.04, spring(clamp((t - e.b8_2 + 0.2) / 0.9) * 0.9, 9, 0.6));
    const px = 590, py = 548, ph = 750, sc = lerp(0.4, 1, s0), pyb = py + ph / 2;
    let mode = "masuk"; if (t > e.tutup + 0.25) mode = "akhir"; if (t > e.lalu) mode = "kontak"; if (t > e.simpan + 0.3) mode = "memanggil"; if (t > e.dihub - 0.2) mode = "bicara";
    c.save(); c.globalAlpha *= clamp(ov * 1.6); scaleAt(c, px, pyb, sc);
    const screen = (cx2, w, h, tt) => {
      if (mode === "masuk") return layarMasuk(cx2, w, h, tt);
      if (mode === "akhir") { cx2.fillStyle = "#2C3170"; cx2.fillRect(0, 0, w, h); const k = clamp((t - e.tutup - 0.25) / 0.3);
        cx2.save(); cx2.globalAlpha *= k; cx2.fillStyle = RED; cx2.beginPath(); cx2.arc(w / 2, h * 0.42, w * 0.2, 0, TAU); cx2.fill(); L.ikon(cx2, "tutup", w / 2, h * 0.42, w * 0.2, "#FFFFFF");
        say(cx2, "Ditutup", w / 2, h * 0.62, Math.min(50, w * 0.15), "#FFFFFF", { w: 800 }); cx2.restore(); return {}; }
      if (mode === "kontak") return layarKontak(cx2, w, h, t, t > e.nomor - 0.1 ? 1 : -1);
      if (mode === "memanggil") return L.panggilan(cx2, w, h, { t: tt, ringkas: true, teks: 1.25, jam: false, nama: "Anakku", huruf: "A", status: "Memanggil…", warna: "#3FB8A8" });
      return L.panggilan(cx2, w, h, { t: tt, ringkas: true, teks: 1.25, jam: false, nama: "Anakku", huruf: "A", durasi: "00:0" + Math.min(9, Math.max(1, Math.floor(t - e.dihub + 1))), warna: "#3FB8A8" });
    };
    const a = L.hp(c, px, py, ph, { t, screen, ring: mode === "masuk" ? 0.6 : 0, glow: 0.5 });
    // titik tombol di layar (termasuk skala tumbuh) untuk lengan Bip
    const scr = (q) => [px + (q.x - px) * sc, pyb + (q.y - pyb) * sc], u = a.w / 100;
    PHB = { tolak: scr(a.map(a.w * 0.27, a.h * 0.8 - u * 13)), call: scr(a.map(a.w - u * 7, u * 26 + u * 3 + u * 36 * 1.5 - u * 4)) };
    // nomor penelepon sebagai label besar di samping HP (tidak muat 40 px di layar)
    const na = win(t, e.b8_2 + 0.1, e.tutup + 0.45, 0.35, 0.3);
    if (na > 0) { const p0 = a.map(a.w, a.h * 0.43), k = Math.min(1.05, spring(ramp(t, e.b8_2 + 0.1, 0.6) * 0.9, 11, 0.5));
      c.save(); c.globalAlpha *= na; c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = 5; c.beginPath(); c.moveTo(p0.x + 14, p0.y); c.quadraticCurveTo(p0.x + 120, p0.y - 40, 930, 300); c.stroke();
      scaleAt(c, 1130, 300, k); PT.tag(c, "0812-0000-1234", 1130, 300, { size: 46, color: RED }); c.restore(); }
    // garis sinyal ke jendela kampung
    const PCX = 1385, PCY = 470, PR = 300;
    if (ramp(t, e.simpan + 0.3, 0.6) > 0) { const x0 = px + 190, y0 = py - 120, x1 = PCX - PR - 10, y1 = PCY, gw = ramp(t, e.simpan + 0.3, 0.9);
      c.save(); c.strokeStyle = D.hexA(P.teal, 0.9); c.lineWidth = 8; c.lineCap = "round"; c.setLineDash([2, 20]); c.lineDashOffset = -t * 60;
      c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2, y0 - 160, lerp(x0, x1, gw), lerp(y0, y1, gw)); c.stroke(); c.setLineDash([]);
      for (let i = 0; i < 3; i++) { const uu = ((t * 0.7 + i / 3) % 1) * gw, q = 1 - uu; const bx = q * q * x0 + 2 * q * uu * (x0 + x1) / 2 + uu * uu * x1, by = q * q * y0 + 2 * q * uu * (y0 - 160) + uu * uu * y1;
        D.glow(c, bx, by, 26, P.teal, 0.9); }
      c.restore(); }
    // label "nomor lama tersimpan": garis dari baris kontak yang disorot ke label di kanan atas (di atas kepala Bip)
    const ta = win(t, e.nomor - 0.05, e.kalau - 0.35, 0.3, 0.3);
    if (ta > 0 && mode === "kontak") { const p = a.map(a.w, u * 26 + u * 3 + u * 36 * 1.5), k = Math.min(1.05, spring(ramp(t, e.nomor - 0.05, 0.6) * 0.9, 11, 0.5));
      c.save(); c.globalAlpha *= ta; c.strokeStyle = D.hexA(P.teal, 0.9); c.lineWidth = 5; c.beginPath(); c.moveTo(p.x + 14, p.y - 30); c.quadraticCurveTo(p.x + 60, 300, 880, 290); c.stroke();
      scaleAt(c, 1130, 290, k); PT.tag(c, "nomor lama tersimpan", 1130, 290, { size: 46, color: P.teal }); c.restore(); }
    c.restore();
    // jendela kampung: anak + tetangga
    portal(c, PCX, PCY, PR, t, e, ramp(t, e.kalau - 0.2, 0.6) * (1 - ramp(t, e.b8_3 - 0.3, 0.3)));
  }

  // ---------- lapisan peta (b8_4) ----------
  function mapOverlays(ctx, t, e, ms) {
    // potongan suara mengalir dari ikon ke toples pelaku; pelaku + toples keluar ke kanan (5,3–6,0 s) sebelum HP naik
    const ex = ease(t, e.keluar, 0.7), pel = ramp(t, e.b8_4 + 0.3, 0.5) * (1 - clamp((ex - 0.6) / 0.4));
    if (pel > 0.01) {
      const sx = 760 * ex, px = 1660 + sx, cj = D.sm(ex * 2.5), jx = lerp(1400, px - 60, cj), jy = lerp(860, 700, cj);   // pelaku mengambil toplesnya lalu pergi
      ctx.save(); ctx.globalAlpha *= pel;
      O.draw(ctx, px, 846, 470, Object.assign(O.preset("pelaku"), { pose: ex > 0.02 && ex < 0.98 ? "berdiri" : "pegangHP", jalan: ex > 0.02 && ex < 0.98, t, seed: 17, flip: !(ex > 0.02 && ex < 0.98), layar: false }));
      B.toples(ctx, jx, jy, lerp(230, 170, cj), { fill: 0.25 + 0.4 * clamp((t - e.b8_4) / 5), t, seed: 3, tilt: 0.1 * Math.sin(Math.PI * ex) });
      ctx.restore();
      for (let i = 0; i < 8; i++) { const per = 1.6, ph0 = e.b8_4 + 0.3 + i * 0.55; if (t < ph0) continue; const u = ((t - ph0) % (per * 2.2)) / per; if (u > 1) continue;
        if (t - u * per > e.keluar - 0.4) continue;   // tidak ada potongan baru sesudah pelaku pergi
        const ic = mapIconPos([0, 1, 2, 3][i % 4], t), x = lerp(ic[0], jx, eio(u)), y = lerp(ic[1], jy - 120, eio(u)) - Math.sin(u * Math.PI) * 140;
        clip(ctx, x, y, i % 2 ? ANAK : IBU, pel * Math.sin(Math.min(1, u * 1.2) * Math.PI) * 1.2); }
    }
    // label kata kunci: rekaman suara → informasi keluarga → terbuka untuk umum (pudar sebelum HP naik)
    [["rekaman suara", e.rekaman - 0.1, e.informasi - 0.15, P.pink], ["informasi keluarga", e.informasi - 0.1, e.terbuka - 0.15, P.amber], ["terbuka untuk umum", e.terbuka - 0.1, e.phIn - 0.2, RED]].forEach(([s2, a0, a1, col]) => {
      const ta = win(t, a0, a1, 0.25, 0.2); if (ta <= 0) return;
      D.post(c => { const k = Math.min(1.05, spring(ramp(t, a0, 0.6) * 0.9, 11, 0.5)); c.save(); c.globalAlpha *= ta; scaleAt(c, 1430, 250, k); PT.tag(c, s2, 1430, 250, { size: 46, color: col }); c.restore(); }); });
    // HP: beranda (Akun privat) lalu layar unggah; di b8_5 layar transfer
    const st = phoneState(t, e);
    if (st.inA > 0.001) {
      const pv = ease(t, e.privat - 0.35, 0.5), unggahMode = t > e.pikirkan - 0.05;
      D.post(c => {
        const screen = (cx2, w, h, tt) => {
          if (st.mv > 0.5) return layarTransfer(cx2, w, h, t, e);
          if (!unggahMode) return layarPrivat(cx2, w, h, tt, pv, clamp((640 - st.y) / 80));   // label muncul saat HP sudah di layar
          return layarUnggah(cx2, w, h, tt, e);
        };
        const a = L.hp(c, st.x, st.y, st.h, { t, screen, glow: 0.45 });
        if (a.out && st.mv < 0.5) {
          if (!unggahMode && a.out.sakelar) { const sk = a.out.sakelar, p = a.map(sk.x + sk.w * (pv > 0.5 ? 0.78 : 0.25), sk.y); PH4 = [p.x, p.y]; }
          else if (unggahMode && a.out.unggah) { const ug = a.out.unggah, p = a.map(ug.x + ug.w * 0.78, ug.y); PH4 = [p.x, p.y]; }
        }
      });
    }
  }
  let PH4 = null;   // titik tekan di HP b8_4 untuk lengan Bip

  // ---------- Bip di b8_4–b8_5 (lapisan atas): masuk dari kanan, menekan sakelar, ragu di "Unggah", ikut HP ke kiri, lalu bereaksi ----------
  function bip45(c, t, e) {
    const mv = ease(t, e.toRoute, 0.9), enter = clamp((t - e.phIn) / 0.9);
    if (t < e.phIn) return;
    let bx = lerp(lerp(2060, 1600, D.sm(enter)), 640, mv), by = lerp(770, 800, mv), s = lerp(180, 165, mv);
    const o = { t, seed: 6 };
    if (enter < 1) Object.assign(o, { pose: "jalan", dir: -1, mood: "happy" });
    else if (mv > 0.02 && mv < 0.98) Object.assign(o, { pose: "jalan", dir: -1, mood: "think" });
    else if (t < e.toRoute) {
      if (!PH4) Object.assign(o, { pose: "diam", mood: "think", look: [-1, 0] });
      else if (t < e.pikirkan - 0.1) { const b1 = clamp((t - e.privat + 0.45) / 0.4); Object.assign(o, { pose: "tekan", target: PH4, press: b1 > 0 && b1 < 1 ? Math.sin(b1 * Math.PI) : 0, mood: t > e.privat ? "happy" : "think" }); }
      else Object.assign(o, { pose: "tekan", target: PH4, press: 0, mood: "think" });   // ragu: jari melayang di atas "Unggah"
    } else {
      if (t < e.transfer) Object.assign(o, { pose: "diam", mood: "think", look: [-1, -0.2] });
      else if (t < e.segera - 0.1) Object.assign(o, { pose: "kaget", k: t - e.transfer, seru: true });
      else if (t < e.laporkan) Object.assign(o, { pose: "tunjuk", target: [990, 558], mood: "think" });
      else if (t < e.iasc) Object.assign(o, { pose: "tunjuk", target: [990, 762], mood: "think" });
      else if (t < e.semakin - 0.1) Object.assign(o, { pose: "tunjuk", target: [1300, 640], mood: "happy" });
      else if (t < e.selamatE + 0.4) { const fr = clamp((t - e.semakin) / 1.2) * 0.12 + 0.03 * Math.sin(t * 9) * win(t, e.semakin, e.selamat, 0.2, 0.2);
        Object.assign(o, { pose: "pegang", mood: "wow", prop: (cc, px, py, ss) => stopwatchSaya(cc, px, py, ss * 0.2, fr + 0.02, t) }); }
      else Object.assign(o, { pose: "diam", wave: t, mood: "happy" });
    }
    B.draw(c, bx, by, s, o);
    // b8_4: "?" di atas Bip saat ragu mengunggah
    if (t > e.pikirkan && mv < 0.5) { const qa = ramp(t, e.pikirkan, 0.4) * (1 - ramp(t, e.toRoute - 0.3, 0.3)); c.save(); c.globalAlpha *= qa; bubble(c, bx + 40, by - 250, "", { a: qa, icon: true, t, tail: [bx + 10, by - 140] }); c.restore(); }
  }

  // ---------- b8_5: jalur uang + kartu lapor ----------
  const ROUTE = { x0: 565, y0: 330, x1: 1700, y1: 300, cy: 205 };
  function routePt(u) { const q = 1 - u, mx = (ROUTE.x0 + ROUTE.x1) / 2; return [q * q * ROUTE.x0 + 2 * q * u * mx + u * u * ROUTE.x1, q * q * ROUTE.y0 + 2 * q * u * ROUTE.cy + u * u * ROUTE.y1]; }
  function routeScene(ctx, t, e, partial) {
    const zc = 1 + 0.045 * eio((t - e.b8_5) / Math.max(1, e.b8_5e - e.b8_5));   // dorong-masuk pelan latar
    ctx.save(); scaleAt(ctx, 960, 470, zc);
    LT.studio(ctx, t, { warna: "biru", px: clamp((t - e.b8_5) / 19, 0, 1) * 0.6 - 0.2 });
    const k = ramp(t, e.toRoute + 0.3, 0.6);
    // portal pelaku (kanan atas)
    const pa = ramp(t, e.toRoute + 0.2, 0.6);   // tetap sampai akhir bab
    const PX = 1700, PY = 300, PR = 128;
    if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; const s = Math.min(1.04, spring(pa * 0.9, 10, 0.55)); scaleAt(ctx, PX, PY, s);
      ctx.fillStyle = "rgba(12,16,56,0.35)"; ctx.beginPath(); ctx.arc(PX + 5, PY + 12, PR + 8, 0, TAU); ctx.fill();
      const gr = ctx.createRadialGradient(PX, PY - 20, 10, PX, PY, PR); gr.addColorStop(0, "#5A4E9A"); gr.addColorStop(1, "#2A2558"); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(PX, PY, PR, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(PX, PY, PR, 0, TAU); ctx.clip();
      const gk = ease(t, e.selamat, 0.45);   // menggaruk kepala tepat pada "diselamatkan"
      O.draw(ctx, PX, PY + 250, 330, Object.assign(O.preset("pelaku"), gk > 0.5 ? { pose: "garuk", tanya: true } : { pose: "pegangHP", blend: { to: "garuk", k: gk * 2 } , tanya: false }, { t, seed: 17, flip: true, layar: false }));
      // tiga lembar yang sempat lewat tetap di tangan pelaku (tidak semua uang kembali)
      for (let i = 0; i < 3; i++) { const t0 = e.transfer - 0.3 + i * 0.42 + 2.2 * 0.92; if (t < t0) continue;
        uangKertas(ctx, PX - 46 + i * 34, PY + 96 - i * 10 + Math.sin(t * 1.4 + i) * 2, 70, -0.25 + i * 0.22, ramp(t, t0, 0.2)); }
      ctx.restore();
      ctx.strokeStyle = D.hexA(RED, 0.85); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(PX, PY, PR, 0, TAU); ctx.stroke(); ctx.restore(); }
    // jalur putus-putus
    const ra = ramp(t, e.toRoute + 0.3, 0.7);
    if (ra > 0) { ctx.save(); ctx.globalAlpha *= ra; ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 7; ctx.setLineDash([3, 18]); ctx.lineCap = "round"; ctx.lineDashOffset = -t * 40;
      ctx.beginPath(); const mx = (ROUTE.x0 + ROUTE.x1) / 2; ctx.moveTo(ROUTE.x0, ROUTE.y0); ctx.quadraticCurveTo(mx, ROUTE.cy, ROUTE.x1 - PR, ROUTE.y1); ctx.stroke(); ctx.restore(); }
    // uang: mengalir dari HP ke pelaku; palang bank menahan; sesudah "diselamatkan" kembali ke HP
    const gate = ease(t, e.blokir - 0.2, 0.45), GU = 0.5, back = ease(t, e.selamat - 0.3, 1.4);
    const flow0 = e.transfer - 0.3;
    for (let i = 0; i < 12; i++) {
      const t0 = flow0 + i * 0.42; if (t < t0) continue;
      let u = (t - t0) / 2.2;
      const passed = t0 + GU * 2.2 < e.blokir - 0.1 && i < 3;   // tiga lembar pertama sempat lewat
      if (passed) { if (u > 0.92) continue; }
      else { const stop = GU - 0.04 - (i % 4) * 0.035; if (u > stop) u = stop; }
      if (!passed && back > 0) u = lerp(u, -0.05, back);
      const [x, y] = routePt(clamp(u, 0, 1)), fr = !passed && t > e.blokir;
      const a = (passed ? 1 - clamp((u - 0.8) / 0.12) : 1) * clamp((t - t0) / 0.2) * (u < 0 ? clamp(1 + u * 20) : 1);
      const jig = fr ? Math.sin(t * 5 + i * 1.7) * 5 * win(t, e.semakin - 0.3, e.selamat, 0.4, 0.3) : 0;
      uangKertas(ctx, x + (i % 3 - 1) * 10, y + ((i * 7) % 5 - 2) * 8 + jig, 78, Math.sin(t * 2 + i) * 0.3, a, fr ? (back > 0.3 || t > e.besar ? "#5BD68A" : "#9FD4E8") : "#5BD68A");
    }
    // "semakin besar peluang": cahaya hijau di tumpukan uang membesar, lalu uang kembali
    const pg = win(t, e.besar - 0.2, e.selamat + 0.6, 0.8, 0.5);
    if (pg > 0) { const [px0, py0] = routePt(GU - 0.1); D.glow(ctx, px0, py0, 90 + 110 * ramp(t, e.besar - 0.2, 1.4), "#5BD68A", 0.55 * pg);
      for (let k = 0; k < 6; k++) { const ph = (t * 0.8 + k / 6) % 1, ang = k * 1.05 + t * 0.6; ctx.fillStyle = D.hexA("#C8FFD9", pg * (1 - ph)); ctx.beginPath(); ctx.arc(px0 + Math.cos(ang) * 80 * ph, py0 - 30 - 60 * ph + Math.sin(ang) * 30, 6, 0, TAU); ctx.fill(); } }
    // palang bank (blokir): rana bergaris turun dari ikon bank dan memotong jalur
    const [gx, gy] = routePt(GU), ga = ramp(t, e.bank - 0.2, 0.5);
    if (ga > 0) { ctx.save(); ctx.globalAlpha *= ga; const s = Math.min(1.05, spring(ga * 0.9, 11, 0.5)), top = gy - 118, bot = lerp(top + 10, gy + 96, gate);
      if (gate > 0.02) { ctx.save(); ctx.beginPath(); ctx.rect(gx - 30, top, 60, bot - top); ctx.clip();
        ctx.fillStyle = "rgba(12,16,56,0.3)"; H.rr(ctx, gx - 18 + 5, top + 8, 36, gy + 110 - top, 12); ctx.fill();
        ctx.fillStyle = "#FFFFFF"; H.rr(ctx, gx - 18, top, 36, gy + 110 - top, 12); ctx.fill();
        ctx.fillStyle = RED; for (let yy = top + 6; yy < gy + 100; yy += 44) ctx.fillRect(gx - 18, yy, 36, 22); ctx.restore();
        const land = ramp(t, e.blokir + 0.2, 0.3) * (1 - ramp(t, e.blokir + 0.7, 0.5)); if (land > 0) { ctx.strokeStyle = D.hexA("#FFFFFF", 0.7 * land); ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(gx, gy + 100, 40 + 50 * (1 - land), 10 + 8 * (1 - land), 0, 0, TAU); ctx.stroke(); } }
      ctx.save(); scaleAt(ctx, gx, top - 40, s); B.ikon(ctx, "rekening", gx, top - 40, 50, {}); ctx.restore();
      if (gate > 0.9) { const f = ramp(t, e.blokir + 0.2, 0.4); ctx.globalAlpha *= f; D.glow(ctx, gx - 60, gy, 150, "#9FD4E8", 0.4 * (1 - back)); }
      ctx.restore(); }
    const gl = win(t, e.blokir, e.selamatE + 1.2, 0.3, 0.4);
    if (gl > 0) D.post(c => { const s = Math.min(1.05, spring(ramp(t, e.blokir, 0.6) * 0.9, 11, 0.5)); c.save(); c.globalAlpha *= gl; scaleAt(c, gx + 150, gy + 70, s); PT.tag(c, "Diblokir", gx + 150, gy + 70, { size: 46, color: "#5AA9FF" }); c.restore(); });
    // kartu lapor
    reportCards(ctx, t, e);
    ctx.restore();
    // HP (dibawa dari b8_4) di kiri — digambar di lapisan atas bila tidak sedang peralihan
    if (!partial) D.post(c => { const st = phoneState(t, e); L.hp(c, st.x, st.y, st.h, { t, screen: (cx2, w, h, tt) => layarTransfer(cx2, w, h, t, e), glow: 0.45 + 0.3 * ramp(t, e.selamat, 0.5) * (1 - ramp(t, e.selamatE + 1, 0.8)), glowCol: t > e.selamat ? "#8BE3B0" : undefined }); });
  }

  function reportCards(ctx, t, e) {
    const cards = [
      { x: 740, y: 470, w: 500, h: 176, t0: e.segera - 0.1, title: "Hubungi bank", sub: "minta blokir", ic: (c, x, y) => B.ikon(c, "rekening", x, y, 46, {}) },
      { x: 740, y: 674, w: 500, h: 176, t0: e.laporkan - 0.1, title: "Lapor polisi", sub: "bawa bukti", ic: (c, x, y) => lencana(c, x, y, 46) },
    ];
    cards.forEach((cd, i) => { const a = ramp(t, cd.t0, 0.5); if (a <= 0) return;
      D.post(c => { const s = Math.min(1.05, spring(a * 0.9, 11, 0.55)); c.save(); c.globalAlpha *= clamp(a * 2.5); scaleAt(c, cd.x + cd.w / 2, cd.y + cd.h / 2, s);
        shadowBox(c, cd.x, cd.y, cd.w, cd.h, 28); rr(c, cd.x, cd.y, cd.w, cd.h, 28, CREAM);
        rr(c, cd.x, cd.y, 14, cd.h, 7, i ? "#4E7BE8" : P.teal);
        c.fillStyle = i ? "rgba(78,123,232,0.15)" : "rgba(63,216,200,0.18)"; c.beginPath(); c.arc(cd.x + 84, cd.y + cd.h / 2, 58, 0, TAU); c.fill();
        cd.ic(c, cd.x + 84, cd.y + cd.h / 2);
        say(c, cd.title, cd.x + 158, cd.y + 66, 46, INK, { align: "left", w: 900 }); say(c, cd.sub, cd.x + 158, cd.y + 122, 44, "#4A527E", { align: "left", w: 700 });
        const ck = pop(t, i ? e.iasc - 0.2 : e.laporkan - 0.2, 12, 0.5); if (ck > 0) { const qx = cd.x + 126, qy = cd.y + cd.h / 2 + 42; c.save(); scaleAt(c, qx, qy, Math.min(1, ck)); check(c, qx, qy, 26, GREEN); c.restore(); }
        c.restore(); }); });
    // kartu Indonesia Anti-Scam Center (kanal resmi)
    const a = ramp(t, e.iasc - 0.15, 0.6); if (a <= 0) return;
    D.post(c => { const x = 1270, y = 470, w = 554, h = 380, s = Math.min(1.05, spring(a * 0.9, 11, 0.55)), hl = 0.5 + 0.5 * Math.sin(t * 3);
      c.save(); c.globalAlpha *= clamp(a * 2.5); scaleAt(c, x + w / 2, y + h / 2, s);
      D.glow(c, x + w / 2, y + h / 2, 380, P.amber, 0.18 + 0.08 * hl);
      shadowBox(c, x, y, w, h, 30); rr(c, x, y, w, h, 30, CREAM); rr(c, x, y, w, 120, 30, "#F6B23C"); c.fillStyle = "#F6B23C"; c.fillRect(x, y + 60, w, 60);
      perisai(c, x + 62, y + 60, 40, "#2E8F7E");
      say(c, "Indonesia", x + 118, y + 38, 44, INK, { align: "left", w: 900 }); say(c, "Anti-Scam Center", x + 118, y + 88, 44, INK, { align: "left", w: 900 });
      const rows = [["globe", "iasc.ojk.go.id"], ["telepon", "Kontak OJK 157"], ["chat", "WA 081-157-157-157"]];
      rows.forEach(([ic, s2], j) => { const ry = y + 168 + j * 72, k = ramp(t, e.iasc + 0.25 + j * 0.35, 0.4); if (k <= 0) return; c.save(); c.globalAlpha *= k; c.translate((1 - eout(k)) * 30, 0);
        c.fillStyle = "rgba(46,143,126,0.16)"; c.beginPath(); c.arc(x + 54, ry, 27, 0, TAU); c.fill();
        if (ic === "globe") globe(c, x + 54, ry, 20, "#2E8F7E"); else if (ic === "telepon") L.ikon(c, "telepon", x + 54, ry, 32, "#2E8F7E");
        else { c.fillStyle = "#2E8F7E"; H.rr(c, x + 36, ry - 16, 36, 28, 10); c.fill(); c.beginPath(); c.moveTo(x + 42, ry + 10); c.lineTo(x + 38, ry + 22); c.lineTo(x + 52, ry + 12); c.fill(); }
        say(c, s2, x + 92, ry + 2, 44, INK, { align: "left", w: 800 }); c.restore(); });
      c.restore(); });
  }

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b8 = TL => {
    const e = EV(TL), r = (x, kind, amp) => [+x.toFixed(3), kind, amp];
    return [
      r(e.pertama, "pop", 0.55),             // pelacak: cara 1
      r(e.kalimat - 0.3, "pop", 0.6),        // kertas muncul di meja
      r(e.hanya + 0.2, "clack", 0.5),        // kertas dilipat
      r(e.jangan + 0.15, "pop", 0.55),       // kartu status
      r(e.medsos + 0.1, "boom", 0.6),        // cap larangan
      r(e.saat + 0.1, "pop", 0.5),           // HP berdering, anak pergi
      r(e.b8_2 - 0.5, "whoosh", 0.55),       // HP membesar
      r(e.tutup, "clack", 0.7),              // Bip menolak panggilan
      r(e.simpan, "clack", 0.6),             // Bip menelepon balik
      r(e.kalau - 0.5, "whoosh", 0.5),       // jendela kampung terbuka
      r(e.dihub + 0.25, "shimmer", 0.55),    // tersambung
      r(e.pastikan, "pop", 0.55),            // tetangga memastikan
      r(e.ajukan - 0.6, "whoosh", 0.45),     // kartu Internet
      r(e.internet, "clack", 0.55),          // tidak ditemukan (kucing pertama)
      r(e.pelihara, "pop", 0.55),            // awan Si Oyen
      r(e.menu + 0.1, "whoosh", 0.4),        // tudung saji terangkat
      r(e.kemarin + 0.4, "clack", 0.45),     // tidak ditemukan (menu kemarin)
      r(e.toMap - 0.2, "whoosh", 0.7),       // ruang makan menyusut ke peta
      r(e.keluar - 0.3, "whoosh", 0.45),     // pelaku + toples keluar
      r(e.privat - 0.1, "clack", 0.65),      // sakelar Akun privat
      r(e.privat + 0.5, "shimmer", 0.6),     // gembok menutup
      r(e.namaL, "pop", 0.5),                // label nama lengkap
      r(e.toRoute - 0.3, "whoosh", 0.6),     // HP pindah, jalur uang
      r(e.transfer, "pop", 0.5),             // Bip kaget
      r(e.blokir - 0.1, "boom", 0.7),        // palang bank turun
      r(e.laporkan, "pop", 0.55),            // kartu polisi
      r(e.iasc, "pop", 0.6),                 // kartu IASC
      r(e.selamat - 0.3, "shimmer", 0.7),    // uang kembali
    ];
  };
})(typeof window !== "undefined" ? window : globalThis);
