/* D03 bab 5: "Sudah terjadi di sekitar kita" (b5_1, b5_2, b5_3, b5_4).
   Metafora utama bab: peta titik Indonesia sebagai "papan kasus nyata". Satu panggung bersambung di studio biru untuk b5_1–b5_3:
   b5_1 bingkai film (sepia, pita seluloid) + Bip memegang papan klip → "bukan cerita film": papan dikatupkan dan dilempar, peta jadi berwarna;
        kamera menukik ke Mempawah (Kalbar; nama tempat di laut barat laut, lalu memendek jadi "Mempawah"), warga (avatar) melapor polisi
        (lencana membesar + lampu sirene), gelembung panggilan "dari Arab Saudi" tiba lalu langsung tumbuh menjadi HP besar; spektrogram
        tiruan menempel di sisi HP dengan label "wajah & suara tiruan" di sambungannya.
   b5_2 Bip berjalan ke HP dan sendiri menekan tombol telepon Bibi → "Memanggil…" → busur hijau ke Bibi asli (bingung, suara asli);
        kartu "Nomor asli Bibi" lalu "Nomor pelaku" keluar dari HP; gelembung palsu kembali di Mempawah lalu berbalik dan membesar
        memperlihatkan pelaku (latar diredupkan); digit yang beda menyala merah saat "berbeda"; Bip kaget.
   b5_3 kamera mundur sebagian; gedung Indonesia Anti-Scam Center (OJK) naik; 10 kota berdenyut, map laporan (≥80 px) mengalir ±3/detik
        ke tangan Bip yang menumpuknya di baki; 1.300+ dihitung tepat saat diucapkan; Bip mengangkat kalender yang lembarnya tersobek
        saat "satu setengah tahun"; map hantu tembus pandang "tidak dilaporkan" + panah "lebih besar"; korban malu masuk ke ruang terbuka;
        0,8 dtk terakhir semua kecuali peta memudar (silang-pudar bersih ke kantor).
   b5_4 kantor: telepon "Pak Direktur" berdering, pegawai (kemeja teal, berkacamata) mengangkat; kartu penelepon + spektrogram di dinding kiri
        berbalik → pelaku; layar transfer membesar dari monitor saat "meminta", jari pegawai menekan "Transfer", uang terbang ke pelaku,
        Bip berlari dan menepuk "Tunggu" — terlambat.
   Semua keadaan b5_1–b5_3 dihitung dari waktu absolut sehingga silang-pudar antarbeat tidak terlihat; kamera sendiri (noCam). */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, L = KIT.layar, O = KIT.orang, LT = KIT.latar, B = KIT.bipkit, PT = KIT.peta;
  const { clamp, lerp, eio, eout, spring } = D;
  const TAU = Math.PI * 2;
  const NAVY = "#1E2A6B", CREAM = "#FFF6E6";
  const IBU = Object.assign({}, L.SUARA.ibu, { seed: 11 }), ANAK = Object.assign({}, L.SUARA.anak, { seed: 23 });   // profil tetap seri (tidak dipakai di bab ini)
  const ATASAN = Object.assign({}, L.SUARA.tiruan, { nama: "suara atasan", aksen: P.pink });
  const MEMP = PT.ANCHORS.mempawah, SAUDI = PT.ANCHORS.arabSaudi;
  const WARGA = { age: "dewasa", hair: "pendek", skin: O.SKIN[2], top: "#6FCB8B", outfit: "kaos", seed: 21 };
  const BIBI = { age: "dewasa", hair: "hijab", hijab: "#F2789A", ciput: "#B84A6A", skin: "#C68A5E", top: "#5A86E0", outfit: "kemeja", seed: 25 };
  const BOS = { age: "dewasa", hair: "pendek", kacamata: true, skin: O.SKIN[1], top: "#EEF1FA", outfit: "kemeja", seed: 31 };
  // pegawai kantor (b5_4): kemeja teal, rambut sanggul, kulit lebih terang, berkacamata — beda jelas dari korban ungu di b5_3
  const PEGAWAI = { age: "dewasa", hair: "kuncir", sanggul: true, hairCol: "#5A3424", kacamata: true, skin: O.SKIN[1], top: "#2FB5A5", outfit: "kemeja", bawah: "celana", bottom: "#33396E", lengan: "panjang", seed: 27 };
  const KORBAN = { age: "dewasa", hair: "panjang", skin: O.SKIN[3], top: "#B39CF7", outfit: "kaos", seed: 41 };

  // ---------- waktu kejadian (detik absolut, dari kata sungguhan) ----------
  let EVk = null, EVc = null;
  function EV(TL) {
    if (EVk === TL && EVc) return EVc;
    const bb = id => TL.beats.find(x => x.id === id);
    const A = (id, s, o = 0) => { const b = bb(id); return b.start + D.at(b, s) + o; };
    const E = (id, s, o = 0) => { const b = bb(id); return b.start + D.atEnd(b, s) + o; };
    const e = {};
    ["b5_1", "b5_2", "b5_3", "b5_4"].forEach(id => { const b = bb(id); e[id] = b.start; e[id + "e"] = b.start + b.dur; e[id + "s"] = b.start + D.speechEnd(b); });
    // b5_1
    e.bukan = A("b5_1", "bukan cerita"); e.film = E("b5_1", "cerita film"); e.mei = A("b5_1", "Pada Mei"); e.warga = A("b5_1", "seorang warga");
    e.memp = A("b5_1", "Mempawah"); e.kalbar = A("b5_1", "Kalimantan Barat"); e.polisi = A("b5_1", "melapor ke polisi"); e.polisiE = E("b5_1", "ke polisi");
    e.pgl = A("b5_1", "panggilan video"); e.video = A("b5_1", "video yang"); e.wajah = A("b5_1", "wajah dan"); e.suara = A("b5_1", "suaranya");
    e.tiru = A("b5_1", "meniru"); e.bibi = A("b5_1", "bibinya"); e.saudi = A("b5_1", "Arab Saudi");
    // b5_2
    e.sadar = A("b5_2", "sadar"); e.hub = A("b5_2", "menghubungi"); e.asli = A("b5_2", "nomor asli"); e.kel = A("b5_2", "keluarganya");
    e.ternyata = A("b5_2", "ternyata"); e.nomor2 = A("b5_2", "nomor yang"); e.pelaku = A("b5_2", "pelaku"); e.beda = A("b5_2", "berbeda");
    // b5_3
    e.iasc = A("b5_3", "Indonesia Anti-Scam"); e.pusat = A("b5_3", "pusat pengaduan"); e.ojk = A("b5_3", "OJK"); e.catat = A("b5_3", "mencatat");
    e.seribu = A("b5_3", "seribu"); e.ratusE = E("b5_3", "tiga ratus"); e.lap = A("b5_3", "laporan penipuan"); e.ai = A("b5_3", "memakai AI");
    e.setengah = A("b5_3", "satu setengah"); e.tahunE = E("b5_3", "setengah tahun"); e.angka = A("b5_3", "Angkanya"); e.besar = A("b5_3", "lebih besar");
    e.karena = A("b5_3", "karena banyak"); e.korban = A("b5_3", "banyak korban"); e.malu = A("b5_3", "malu");
    // b5_4
    e.modus = A("b5_4", "Modus"); e.prsh = A("b5_4", "perusahaan"); e.misal = A("b5_4", "misalnya"); e.tiru4 = A("b5_4", "meniru suara");
    e.atasan = A("b5_4", "atasan"); e.minta = A("b5_4", "meminta"); e.trf = A("b5_4", "mentransfer"); e.uang = A("b5_4", "uang.");
    // laporan yang terbang (b5_3): aliran tetap ±3 map/detik dari kota ke tangan Bip, lalu melompat ke tumpukan
    const cities = ["medan", "jakarta", "surabaya", "makassar", "bandung", "palembang", "semarang", "denpasar", "pontianak", "balikpapan", "manado", "yogyakarta", "padang", "banjarmasin", "mataram", "kupang", "ambon", "jayapura", "bandaAceh", "ternate"];
    const r = D.rng(505), t0 = e.pusat + 0.15, t1 = e.setengah - 0.45, N = Math.max(8, Math.round((t1 - t0) * 3));
    e.fly = Array.from({ length: N }, (_, i) => { const ts = lerp(t0, t1, i / (N - 1)) + (r() - 0.5) * 0.12;
      return { city: cities[(i * 7 + Math.floor(r() * 3)) % cities.length], t: ts, dur: 0.95 + r() * 0.2, bend: 0.5 + r() * 0.5, col: [P.pink, P.amber, P.teal, P.violet, P.blue][i % 5] }; });
    e.fly.forEach(f => { f.land = f.t + f.dur; f.hop = f.land + 0.32; });
    e.burst = ["medan", "jakarta", "surabaya", "makassar", "palembang", "denpasar", "balikpapan", "manado", "kupang", "jayapura"];
    EVk = TL; EVc = e; return e;
  }

  const win = (t, a, b, fi = 0.3, fo = 0.3) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));
  const pop = (t, t0, k = 11, z = 0.5) => (t <= t0 ? 0 : Math.min(1.08, spring(t - t0, k, z)));
  const qpt = (p0, p1, p2, u) => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // ---------- benda kecil ----------
  function clapper(c, x, y, s, open, rot = 0) {   // papan klip film; (x,y) pusat, s lebar
    const w = s, h = s * 0.62, sh = s * 0.17;
    c.save(); c.translate(x, y); c.rotate(rot);
    c.fillStyle = "rgba(10,14,50,0.3)"; H.rr(c, -w / 2 + 6, -h / 2 + 12, w, h, 12); c.fill();
    c.fillStyle = "#2B3050"; H.rr(c, -w / 2, -h / 2, w, h, 12); c.fill();
    c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = Math.max(2, s * 0.012); c.lineCap = "round";
    [[0.3, 0.7], [0.48, 0.5], [0.66, 0.8]].forEach(([yy, ww]) => { c.beginPath(); c.moveTo(-w * 0.4, -h / 2 + h * yy); c.lineTo(-w * 0.4 + w * ww * 0.8, -h / 2 + h * yy); c.stroke(); });
    c.beginPath(); c.moveTo(-w / 2 + 8, -h / 2 + h * 0.2); c.lineTo(w / 2 - 8, -h / 2 + h * 0.2); c.moveTo(0, -h / 2 + h * 0.2); c.lineTo(0, h / 2 - 8); c.globalAlpha *= 0.35; c.stroke(); c.globalAlpha /= 0.35;
    const stripes = (yy) => { c.save(); c.beginPath(); H.rr(c, -w / 2, yy, w, sh, 6); c.clip(); c.fillStyle = "#F4F6FF"; c.fillRect(-w / 2, yy, w, sh);
      c.fillStyle = "#23263F"; for (let i = -1; i < 7; i++) { const x0 = -w / 2 + i * w / 6; c.beginPath(); c.moveTo(x0, yy + sh); c.lineTo(x0 + w / 12, yy + sh); c.lineTo(x0 + w / 12 + sh * 0.9, yy); c.lineTo(x0 + sh * 0.9, yy); c.closePath(); c.fill(); } c.restore(); };
    stripes(-h / 2 - sh);
    c.save(); c.translate(-w / 2, -h / 2 - sh); c.rotate(-open * 0.55); stripes(-sh); c.restore();
    c.fillStyle = "#9AA3C8"; c.beginPath(); c.arc(-w / 2 + 8, -h / 2 - sh, s * 0.03, 0, TAU); c.fill();
    c.restore();
  }
  function shield(c, x, y, r, a = 1, t = 0) {   // lencana polisi generik (perisai + bintang)
    c.save(); c.globalAlpha *= a; c.translate(x, y);
    D.glow(c, 0, 0, r * 2.2, (Math.floor(t * 4) % 2) ? P.blue : P.red, 0.45);
    c.fillStyle = "rgba(10,14,50,0.3)"; c.beginPath(); c.arc(3, 6, r, 0, TAU); c.fill();
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    const s = r * 0.72; c.fillStyle = "#3C5BD6"; c.beginPath(); c.moveTo(0, -s); c.quadraticCurveTo(s * 0.55, -s * 0.72, s * 0.9, -s * 0.78); c.lineTo(s * 0.86, s * 0.05);
    c.quadraticCurveTo(s * 0.7, s * 0.72, 0, s * 1.05); c.quadraticCurveTo(-s * 0.7, s * 0.72, -s * 0.86, s * 0.05); c.lineTo(-s * 0.9, -s * 0.78); c.quadraticCurveTo(-s * 0.55, -s * 0.72, 0, -s); c.fill();
    c.fillStyle = P.amber; c.beginPath(); for (let i = 0; i < 10; i++) { const ang = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? s * 0.2 : s * 0.46; c.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr + s * 0.04); } c.closePath(); c.fill();
    c.restore();
  }
  function avatar(c, x, y, r, o, a = 1, ring = P.amber, t = 0) {   // kepala dalam lingkaran berbingkai
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    c.fillStyle = "rgba(10,14,50,0.3)"; c.beginPath(); c.arc(x + 4, y + 8, r + 6, 0, TAU); c.fill();
    c.fillStyle = ring; c.beginPath(); c.arc(x, y, r + 6, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.arc(x, y, r, 0, TAU); c.clip();
    const gr = c.createLinearGradient(0, y - r, 0, y + r); gr.addColorStop(0, "#8FB6FF"); gr.addColorStop(1, "#5C78D6"); c.fillStyle = gr; c.fillRect(x - r, y - r, 2 * r, 2 * r);
    O.kepala(c, x, y - r * 0.02, r * 0.5, Object.assign({ t, bahu: 1.1 }, o));
    c.restore(); c.restore();
  }
  function miniFolder(c, x, y, s, col, rot = 0, a = 1) {
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
    c.fillStyle = "rgba(10,14,50,0.28)"; H.rr(c, -s / 2 + 3, -s * 0.36 + 5, s, s * 0.72, 6); c.fill();
    c.fillStyle = D.hexA(col, 1); H.rr(c, -s / 2, -s * 0.36, s * 0.42, s * 0.2, 5); c.fill();
    H.rr(c, -s / 2, -s * 0.28, s, s * 0.64, 6); c.fill();
    c.fillStyle = "#FBF7EE"; c.fillRect(-s * 0.38, -s * 0.2, s * 0.76, s * 0.1);
    c.fillStyle = "rgba(255,255,255,0.3)"; c.fillRect(-s / 2 + 4, -s * 0.06, s - 8, 3);
    c.restore();
  }
  function building(c, x, y, s, t, ojk) {   // gedung pusat pengaduan generik; (x,y) tengah dasar, s lebar
    const w = s, h = s * 0.82;
    c.save(); c.translate(x, y);
    D.glow(c, 0, -h * 0.5, w * 0.9, P.teal, 0.22 + 0.04 * Math.sin(t * 1.3));
    c.fillStyle = "rgba(10,14,50,0.25)"; c.beginPath(); c.ellipse(0, 4, w * 0.62, 18, 0, 0, TAU); c.fill();
    // tangga
    c.fillStyle = "#C9D2EE"; c.fillRect(-w * 0.52, -12, w * 1.04, 12); c.fillStyle = "#DCE3F7"; c.fillRect(-w * 0.48, -24, w * 0.96, 12);
    // badan
    const gb = c.createLinearGradient(0, -h, 0, 0); gb.addColorStop(0, "#F4F6FF"); gb.addColorStop(1, "#C9D3F1"); c.fillStyle = gb; c.fillRect(-w * 0.44, -h * 0.66, w * 0.88, h * 0.66 - 24);
    // tiang
    for (let i = 0; i < 5; i++) { const cx = -w * 0.36 + i * w * 0.18; c.fillStyle = "#E7ECFB"; c.fillRect(cx - w * 0.035, -h * 0.6, w * 0.07, h * 0.6 - 24); c.fillStyle = "rgba(60,80,150,0.18)"; c.fillRect(cx + w * 0.012, -h * 0.6, w * 0.023, h * 0.6 - 24); }
    // jendela menyala di sela tiang
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const wx = -w * 0.27 + i * w * 0.18, wy = -h * 0.52 + j * h * 0.2, fl = 0.75 + 0.25 * Math.sin(t * 0.9 + i * 1.7 + j * 2.3);
      c.fillStyle = D.hexA("#FFD38A", fl); H.rr(c, wx - w * 0.04, wy, w * 0.08, h * 0.12, 4); c.fill(); }
    // atap segitiga + lambang perisai
    c.fillStyle = "#5068C8"; c.beginPath(); c.moveTo(-w * 0.52, -h * 0.64); c.lineTo(0, -h * 0.98); c.lineTo(w * 0.52, -h * 0.64); c.closePath(); c.fill();
    c.fillStyle = "#3A4FA8"; c.fillRect(-w * 0.5, -h * 0.68, w, h * 0.05);
    c.restore();
    shield(c, x, y - h * 0.78, s * 0.07, 1, t * 0.2);
  }
  function wave(c, x, y, w, h, t, col, n = 18, amp = 1, seed = 0) {
    c.fillStyle = col; for (let i = 0; i < n; i++) { const v = (0.3 + 0.7 * Math.abs(Math.sin(i * 1.7 + seed) * Math.sin(t * 5 + i * 0.9 + seed))) * amp, bw = w / n * 0.55, hh = Math.max(4, h * v);
      H.rr(c, x + i * w / n, y - hh / 2, bw, hh, bw / 2); c.fill(); }
  }
  function arcs(c, x, y, r, t, col, a = 1, dir = -1) {   // busur suara keluar dari speaker
    for (let i = 0; i < 3; i++) { const u = ((t * 1.4 + i / 3) % 1), rr = r * (0.5 + u * 1.2);
      c.strokeStyle = D.hexA(col, (1 - u) * 0.9 * a); c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.arc(x, y, rr, dir < 0 ? Math.PI * 0.75 : -Math.PI * 0.25, dir < 0 ? Math.PI * 1.25 : Math.PI * 0.25); c.stroke(); }
  }
  // kartu kecil berbentuk gelembung (pelaku di balik panggilan palsu); (x,y) ujung ekor
  function pelakuBubble(c, x, y, s, t, sx = 1) {
    const w = 124 * s, h = 150 * s, bx = -w / 2, by = -h - 26 * s;
    c.save(); c.translate(x, y); c.scale(sx, 1);
    c.fillStyle = "rgba(12,20,60,0.28)"; H.rr(c, bx + 4 * s, by + 9 * s, w, h, 22 * s); c.fill();
    c.fillStyle = P.red; H.rr(c, bx - 6 * s, by - 6 * s, w + 12 * s, h + 12 * s, 27 * s); c.fill();
    c.beginPath(); c.moveTo(-16 * s, by + h + 4 * s); c.lineTo(0, 0); c.lineTo(16 * s, by + h + 4 * s); c.closePath(); c.fill();
    c.save(); H.rr(c, bx, by, w, h, 21 * s); c.clip();
    // cahaya belakang merah-merah muda agar siluet kerudung gelap terbaca, lalu lampu tepi terang di kerudung
    const gr = c.createRadialGradient(0, by + h * 0.42, 6 * s, 0, by + h * 0.42, h * 0.75); gr.addColorStop(0, "#FFB0BC"); gr.addColorStop(0.45, "#E2506A"); gr.addColorStop(1, "#5A2350"); c.fillStyle = gr; c.fillRect(bx, by, w, h);
    const ko = Object.assign(O.preset("pelaku"), { t, face: "netral", bahu: 1.3 });
    c.save(); c.filter = "brightness(2.6)"; O.kepala(c, -2.5 * s, by + h * 0.52 - 2.5 * s, 34 * s, ko); c.restore();
    O.kepala(c, 0, by + h * 0.52, 34 * s, ko);
    c.restore(); c.restore();
  }
  function callCard(c, x, y, w, h, t, front, flip, glit, lab) {   // kartu penelepon (b5_4): depan = Pak Direktur, belakang = pelaku
    const sx = Math.cos(flip * Math.PI), back = sx < 0;
    c.save(); c.translate(x, y); c.scale(Math.max(0.02, Math.abs(sx)), 1);
    const col = back ? P.red : P.teal;
    D.glow(c, 0, 0, w * 0.75, col, 0.35);
    c.fillStyle = "rgba(10,14,50,0.32)"; H.rr(c, -w / 2 + 6, -h / 2 + 12, w, h, 34); c.fill();
    c.fillStyle = back ? "#2A2550" : "rgba(16,26,66,0.94)"; H.rr(c, -w / 2, -h / 2, w, h, 34); c.fill();
    c.strokeStyle = col; c.lineWidth = 5; H.rr(c, -w / 2, -h / 2, w, h, 34); c.stroke();
    const ax = -w / 2 + h * 0.46, ay = 0, r = h * 0.3;
    if (!back) {
      if (glit > 0) { c.save(); c.globalAlpha *= 0.6 * glit; avatar(c, ax - 10 * glit, ay, r, Object.assign({}, BOS, { face: "netral" }), 1, P.pink, t); avatar(c, ax + 10 * glit, ay, r, Object.assign({}, BOS, { face: "netral" }), 1, P.teal, t); c.restore(); }
      avatar(c, ax, ay, r, Object.assign({}, BOS, { face: "netral" }), 1, P.teal, t);
    } else {
      c.save(); c.scale(-1, 1); avatar(c, -ax, ay, r, Object.assign(O.preset("pelaku"), { face: "netral" }), 1, P.red, t); c.restore();
    }
    c.restore();
    return { ax: x + ax * Math.abs(sx) * (back ? -1 : 1), ay: y + ay, back, k: Math.abs(sx) };
  }

  // layar daftar kontak berhuruf besar (b5_2); dp = detik sejak tombol telepon Bibi ditekan
  function listScreen(c, w, h, t, dp) {
    c.save(); c.fillStyle = "#F1F3FC"; c.fillRect(0, 0, w, h);
    const hh = 112, hg = c.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#3FA7C9"); hg.addColorStop(1, "#4D6FD8"); c.fillStyle = hg; c.fillRect(0, 0, w, hh);
    D.txt(c, "Favorit", 26, 78, 52, { color: "#FFFFFF", weight: 900 });
    const rows = [["Adik", "#7C8BEA"], ["Ibu", "#E8739A"], ["Paman", "#F0A04B"], ["Pak RT", "#8E7CF0"], ["Bibi", "#2EB89A"]], rh = 112; let btn = null;
    rows.forEach(([nm, col], i) => {
      const y = hh + 14 + i * rh, cy = y + rh / 2, on = nm === "Bibi", pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
      if (on) { c.fillStyle = D.hexA(P.teal, 0.18 + 0.1 * pulse); H.rr(c, 8, y + 6, w - 16, rh - 12, 22); c.fill(); c.fillStyle = "#FFFFFF"; H.rr(c, 13, y + 11, w - 26, rh - 22, 18); c.fill(); }
      else if (i > 0) { c.fillStyle = "#E1E5F4"; c.fillRect(96, y, w - 110, 2); }
      c.save(); c.beginPath(); c.arc(54, cy, 30, 0, TAU); c.fillStyle = col; c.fill(); c.clip(); c.fillStyle = "rgba(255,255,255,0.55)";
      c.beginPath(); c.arc(54, cy - 6, 11, 0, TAU); c.fill(); c.beginPath(); c.ellipse(54, cy + 24, 21, 15, 0, 0, TAU); c.fill(); c.restore();
      D.txt(c, nm, 100, cy + 18, 50, { color: NAVY, weight: 800 });
      if (on) {
        const bx = w - 52; btn = { x: bx, y: cy }; const press = dp > 0 ? 1 - 0.18 * Math.sin(Math.PI * clamp(dp / 0.3)) : 1;
        if (dp > 0) { const u = clamp(dp / 0.6); c.strokeStyle = D.hexA("#22B07D", 0.8 * (1 - u)); c.lineWidth = 5; c.beginPath(); c.arc(bx, cy, 30 + 50 * eout(u), 0, TAU); c.stroke(); }
        c.fillStyle = D.hexA("#22B07D", 0.3 * pulse); c.beginPath(); c.arc(bx, cy, 30 * (1.2 + 0.25 * pulse), 0, TAU); c.fill();
        c.fillStyle = "#22B07D"; c.beginPath(); c.arc(bx, cy, 30 * press, 0, TAU); c.fill(); L.ikon(c, "telepon", bx, cy, 26 * press, "#FFFFFF");
      }
    });
    c.restore(); return btn;
  }
  // kartu nomor besar (b5_2): label + 14 digit dalam sel lebar tetap; hi = indeks digit berbeda, hk 0..1 sorotan
  const NUM_A = "0857-0000-4321", NUM_B = "0812-0000-1234", DIFF = [...NUM_A].map((ch, i) => (ch !== NUM_B[i] ? i : -1)).filter(i => i >= 0);
  const CARD_W = 540, CARD_H = 150, CELL = 34;
  function numCard(c, x, y, k, a, label, num, col, red, hk, t) {
    if (a <= 0 || k <= 0.01) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(k, k);
    const w = CARD_W, h = CARD_H;
    c.fillStyle = "rgba(10,14,50,0.32)"; H.rr(c, -w / 2 + 6, -h / 2 + 10, w, h, 26); c.fill();
    c.fillStyle = CREAM; H.rr(c, -w / 2, -h / 2, w, h, 26); c.fill();
    c.fillStyle = col; H.rr(c, -w / 2, -h / 2, 14, h, 7); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(-w / 2 + 44, -h / 2 + 40, 14, 0, TAU); c.fill();
    if (red) { c.fillStyle = "#FFFFFF"; c.fillRect(-w / 2 + 39, -h / 2 + 31, 3, 18); c.beginPath(); c.moveTo(-w / 2 + 42, -h / 2 + 31); c.lineTo(-w / 2 + 53, -h / 2 + 36); c.lineTo(-w / 2 + 42, -h / 2 + 41); c.fill(); }
    else { c.strokeStyle = "#FFFFFF"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(-w / 2 + 37, -h / 2 + 40); c.lineTo(-w / 2 + 42, -h / 2 + 46); c.lineTo(-w / 2 + 52, -h / 2 + 33); c.stroke(); }
    D.txt(c, label, -w / 2 + 70, -h / 2 + 56, 44, { color: red ? "#C23A4A" : "#1F8F84", weight: 800 });
    const x0 = -CELL * num.length / 2 + 6, yb = h / 2 - 26;
    for (let i = 0; i < num.length; i++) {
      const cx = x0 + (i + 0.5) * CELL, j = DIFF.indexOf(i), on = j >= 0 ? clamp(hk * 1.8 - j / DIFF.length * 0.8) : 0;
      if (on > 0 && red) { const sc = Math.min(1.1, spring(on * 1.1, 12, 0.5)); c.save(); c.translate(cx, yb - 17); c.scale(sc, sc); c.fillStyle = P.red; H.rr(c, -CELL * 0.47, -32, CELL * 0.94, 64, 9); c.fill(); c.restore(); }
      if (on > 0 && !red) { c.fillStyle = D.hexA(P.amber, on); H.rr(c, cx - CELL * 0.4, yb + 8, CELL * 0.8, 6, 3); c.fill(); }
      D.txt(c, num[i], cx, yb, 48, { align: "center", color: on > 0.5 && red ? "#FFFFFF" : NAVY, weight: 900 });
    }
    c.restore();
  }

  // kalender meja (dipegang Bip saat "satu setengah tahun"): lembar bulan disobek satu per satu, tanpa teks
  function calendar(c, x, y, s, t, flip) {   // (x,y) tengah, s lebar; flip = jumlah lembar yang sudah tersobek (pecahan = sedang terbang)
    const w = s, h = s * 1.05;
    c.save(); c.translate(x, y);
    c.fillStyle = "rgba(10,14,50,0.3)"; H.rr(c, -w / 2 + 5, -h / 2 + 9, w, h, 14); c.fill();
    const page = (k, dx, dy, rot, a) => { c.save(); c.globalAlpha *= a; c.translate(dx, dy); c.rotate(rot);
      c.fillStyle = CREAM; H.rr(c, -w / 2, -h / 2 + h * 0.18, w, h * 0.82, 12); c.fill();
      const col = [P.pink, P.teal, P.amber, P.violet][k % 4];
      c.fillStyle = col; c.fillRect(-w * 0.42, -h / 2 + h * 0.26, w * 0.84, h * 0.13);
      c.fillStyle = D.hexA(NAVY, 0.55); for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) { const on = (i + j * 5 + k) % 9 === 0; c.fillStyle = on ? P.red : D.hexA(NAVY, 0.5); c.fillRect(-w * 0.4 + i * w * 0.17, -h / 2 + h * 0.46 + j * h * 0.12, w * 0.11, h * 0.08); }
      c.restore(); };
    const n = Math.floor(flip), fr = flip - n;
    page(n + 1, 0, 0, 0, 1);
    if (fr > 0) { const u = eout(fr); page(n, u * w * 0.9, -u * h * 0.7, u * 1.1, 1 - fr); }
    c.fillStyle = "#3A4FA8"; H.rr(c, -w / 2, -h / 2, w, h * 0.22, 12); c.fill();
    c.fillStyle = "#C9D2EE"; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-w * 0.33 + i * w * 0.22, -h / 2 + h * 0.03, w * 0.035, 0, TAU); c.fill(); }
    c.restore();
  }
  // lapisan bantu untuk menggambar tumpukan "hantu" tembus pandang (mapBerkas menimpa globalAlpha)
  let OC = null;
  function ghostLayer(ctx, a, draw) {
    if (a <= 0) return; const cv = ctx.canvas;
    if (!OC || OC.width !== cv.width || OC.height !== cv.height) { OC = document.createElement("canvas"); OC.width = cv.width; OC.height = cv.height; }
    const oc = OC.getContext("2d"); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, OC.width, OC.height); oc.setTransform(ctx.getTransform()); draw(oc);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a; ctx.drawImage(OC, 0, 0); ctx.restore();
  }

  // ---------- peta: tampilan kamera per waktu ----------
  // W0 bingkai film (seluruh Indonesia), W1 menukik ke Kalbar, W2 mundur sebagian (peta ±1050 px di kiri, ruang untuk tumpukan + gedung)
  const W0 = 1650, W1 = 4300, W2 = 1268;
  const P0 = (() => { const pz = PT.proj(960, 590, W0); return pz(MEMP[0], MEMP[1]); })();
  const P1 = [720, 600];
  const P2 = (() => { const pz = PT.proj(694, 608, W2); return pz(MEMP[0], MEMP[1]); })();
  function mapView(t, e) {
    const u1 = eio((t - e.warga + 0.1) / 1.9), u2 = eio((t - e.b5_3 - 0.05) / 1.7);
    const lw = lerp(lerp(Math.log(W0), Math.log(W1), u1), Math.log(W2), u2), w = Math.exp(lw);
    // sedikit melayang terus (tidak pernah beku)
    const dx = Math.sin(t * 0.21) * 10, dy = Math.cos(t * 0.17) * 7;
    const mx = lerp(lerp(P0[0], P1[0], u1), P2[0], u2) + dx, my = lerp(lerp(P0[1], P1[1], u1), P2[1], u2) + dy;
    const pz = PT.proj(0, 0, w), [ox, oy] = pz(MEMP[0], MEMP[1]);
    return { w, cx: mx - ox, cy: my - oy, mx, my };
  }
  function drawMap(ctx, t, e, v, alpha = 1, extra = {}) {
    // dua kerapatan titik yang dipudarkan bergantian saat zoom (titik tidak melompat)
    const k = clamp((v.w - 1900) / 900), hl = [{ at: "mempawah", region: "kalbar", t0: e.memp - 0.05, color: P.amber, scale: lerp(1, 1.5, k) }];
    let pj = null;
    const one = (step, a) => { if (a <= 0.01) return; const kk = v.w / 56.4, dot = Math.max(2.7, Math.min(step * kk * 0.38, 6)); const p = PT.indonesia(ctx, v.cx, v.cy, v.w, Object.assign({ t, step, dot, alpha: a * alpha, highlight: hl, sea: 0.1 }, extra)); if (!pj || a >= 0.5) pj = p; };
    one(0.3, 1 - k); one(0.2, k);
    return pj;
  }

  // ---------- tata letak tetap ----------
  const BIP1 = [420, 850, 160];      // b5_1: kiri bawah, menjauh dari hiasan grafik batang latar (x≈215)
  const BIP2 = [1235, 815, 190];     // b5_2: di kaki HP besar, menekan tombol Bibi
  const BIP3 = [990, 850, 170];      // b5_3: menangkap map laporan di antara peta dan tumpukan
  const HAND3 = [BIP3[0] + BIP3[2] * 0.75, BIP3[1] - BIP3[2] * 0.06];
  const STK = { x: 1250, y: 892, fw: 200 }, NC = 14, NG = 4;
  const BLD = { x: 1655, y: 655, s: 390 };
  const BA = [300, 260];             // Bibi asli (b5_2)
  const CARDX = 1040, CARD1Y = 160, CARD2Y = 320;

  // ---------- adegan peta (b5_1–b5_3) ----------
  function mapScene(ctx, b, t, TL, e) {
    const v = mapView(t, e), inS3 = t >= e.b5_3 - 0.01;
    const fe = 1 - clamp((t - (e.b5_3e - 0.8)) / 0.6);   // akhir b5_3: semua kecuali peta memudar → silang-pudar ke kantor bersih
    LT.studio(ctx, t, { warna: "biru", px: clamp((v.mx - 700) / 900, -1, 1) * 0.6 });
    // partikel cahaya melayang
    for (let i = 0; i < 26; i++) { const r = D.rng(900 + i), x0 = r() * 1920, sp = 8 + r() * 14, y = 1080 - ((t * sp + r() * 1080) % 1180), x = x0 + Math.sin(t * 0.5 + i) * 18;
      D.glow(ctx, x, y, 10 + r() * 10, i % 3 ? P.teal : P.amber, 0.25 + 0.15 * Math.sin(t * 2 + i)); }

    const proj = drawMap(ctx, t, e, v);
    const M = [v.mx, v.my];
    const out3 = 1 - clamp((t - e.b5_3) / 0.55);

    // ---------- b5_3: gedung, kota berdenyut, map terbang ke tangan Bip lalu ke tumpukan ----------
    const bA = clamp((t - e.iasc + 0.15) / 0.5) * (inS3 ? 1 : 0) * fe;
    let pileTop = STK.y, ghostTop = STK.y, greyN = 0;
    if (bA > 0) {
      // gedung naik dari lantai
      ctx.save(); ctx.globalAlpha *= bA; const rise = 1 - eout(clamp((t - e.iasc + 0.15) / 0.7));
      ctx.translate(0, rise * 90); building(ctx, BLD.x, BLD.y, BLD.s, t, true); ctx.restore();
      // denyut serentak di 10 kota saat "pusat pengaduan"
      e.burst.forEach((nm, i) => { const t0 = e.pusat + i * 0.06, u = (t - t0) / 1.1; if (u <= 0 || u >= 1) return;
        const [cx, cy] = proj(...PT.ANCHORS[nm]), col = [P.pink, P.amber, P.teal][i % 3];
        ctx.save(); ctx.globalAlpha *= bA; ctx.strokeStyle = D.hexA(col, 0.95 * (1 - u)); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 22 + 52 * eout(u), 0, TAU); ctx.stroke();
        D.glow(ctx, cx, cy, 46, col, 0.9 * (1 - u)); ctx.restore(); });
      // baki + tumpukan map berwarna
      const nHop = e.fly.filter(f => t >= f.hop).length, nStack = nHop ? Math.min(NC, Math.ceil(nHop * NC / e.fly.length)) : 0;
      ctx.save(); ctx.globalAlpha *= bA;
      ctx.fillStyle = "rgba(10,14,50,0.25)"; ctx.beginPath(); ctx.ellipse(STK.x, STK.y + 6, 150, 18, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#2E8F86"; H.rr(ctx, STK.x - 135, STK.y - 10, 270, 22, 10); ctx.fill(); ctx.fillStyle = "#3FD8C8"; H.rr(ctx, STK.x - 135, STK.y - 14, 270, 10, 5); ctx.fill();
      if (nStack > 0) { const res = B.mapBerkas(ctx, STK.x, STK.y - 10, STK.fw, { n: nStack, grey: 0, greyLabel: false, drop: 1, t, seed: 2 }); pileTop = STK.y - 10 - res.h; }
      else pileTop = STK.y - 10;
      ctx.restore();
      // map "hantu" yang tidak dilaporkan: tembus pandang, bergaris putus-putus, menumpuk di atas
      const gu = clamp((t - e.besar + 0.1) / 1.6) * NG; greyN = Math.ceil(gu - 1e-6); const greyDrop = greyN > 0 ? clamp(gu - (greyN - 1)) : 1;
      ghostTop = pileTop;
      if (greyN > 0) ghostLayer(ctx, 0.6 * bA, oc => { const res = B.mapBerkas(oc, STK.x, pileTop + 6, STK.fw, { n: greyN, grey: true, greyLabel: false, drop: greyDrop, t, seed: 5 });
        ghostTop = pileTop + 6 - res.h; });
      // map terbang: kota → tangan Bip (ukuran ≥80 px, berekor), lalu lompat ke tumpukan
      e.fly.forEach((f, i) => {
        const [cx, cy] = proj(...PT.ANCHORS[f.city]);
        const blink = win(t, f.t - 0.45, f.t + 0.1, 0.15, 0.3);
        if (blink > 0) { const u = clamp((t - f.t + 0.45) / 0.55); ctx.save(); ctx.globalAlpha *= bA; ctx.strokeStyle = D.hexA(f.col, (1 - u) * 0.95 * blink); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 20 + 40 * eout(u), 0, TAU); ctx.stroke(); D.glow(ctx, cx, cy, 40, f.col, 0.8 * blink); ctx.restore(); }
        const ctl = [(cx + HAND3[0]) / 2, Math.min(cy, HAND3[1]) - 240 * f.bend];
        if (t > f.t && t < f.land) {
          const u = eio((t - f.t) / f.dur);
          ctx.save(); ctx.globalAlpha *= bA;
          [[0.14, 0.15], [0.07, 0.32], [0, 1]].forEach(([du, a]) => { const uu = Math.max(0, u - du); if (uu <= 0) return; const [x, y] = qpt([cx, cy], ctl, HAND3, uu);
            miniFolder(ctx, x, y, lerp(84, 80, uu), f.col, (1 - uu) * 0.8 * (i % 2 ? 1 : -1), clamp(uu * 6) * a); });
          ctx.restore();
        }
        if (t >= f.land + 0.02 && t < f.hop) { const u = eio((t - f.land - 0.02) / (f.hop - f.land - 0.02)), top = [STK.x, pileTop - 14];
          const [x, y] = qpt(HAND3, [(HAND3[0] + top[0]) / 2, Math.min(HAND3[1], top[1]) - 120], top, u);
          ctx.save(); ctx.globalAlpha *= bA; miniFolder(ctx, x, y, lerp(80, 120, u), f.col, (1 - u) * -0.4, 1); ctx.restore(); }
      });
    }
    // korban yang malu (b5_3 akhir): masuk ke ruang terbuka di antara tumpukan dan gedung
    const vA = clamp((t - e.korban + 0.2) / 0.5) * fe;
    if (vA > 0 && inS3) {
      ctx.save(); ctx.globalAlpha *= vA; const x = lerp(1560, 1440, eout(clamp((t - e.korban + 0.2) / 0.7)));
      O.draw(ctx, x, 888, 300, Object.assign({}, KORBAN, { pose: "kucek", face: "sedih", flip: true, t }));
      ctx.restore();
    }

    // ---------- b5_1: avatar warga + lencana polisi (lampu sirene) ----------
    const wA = clamp((t - e.memp - 0.1) / 0.35) * out3;
    const AV = [M[0] - 220, M[1] + 10];
    if (wA > 0) {
      const k = Math.min(1.06, pop(t, e.memp - 0.1, 10, 0.5));
      ctx.save(); ctx.globalAlpha *= wA; ctx.strokeStyle = D.hexA(P.amber, 0.9); ctx.lineWidth = 5; ctx.setLineDash([4, 12]); ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(AV[0] + 80, AV[1]); ctx.lineTo(M[0] - 22, M[1]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      const face = t > e.sadar ? (t > e.beda ? "panik" : "bingung") : "netral";
      ctx.save(); ctx.translate(AV[0], AV[1]); ctx.scale(k, k); avatar(ctx, 0, 0, 70, Object.assign({}, WARGA, { face }), wA, P.amber, t); ctx.restore();
      const sA = clamp((t - e.polisi) / 0.2) * out3;
      if (sA > 0) {
        const ks = Math.min(1.12, pop(t, e.polisi, 12, 0.42)), big = 1 - eio((t - e.polisi - 1.1) / 0.6), r = lerp(34, 50, big) * ks;
        const sx = AV[0] + 64, sy = AV[1] - 64 - 14 * big * Math.abs(Math.sin((t - e.polisi) * 9)) * Math.exp(-(t - e.polisi) * 2.2);
        const sir = win(t, e.polisi, e.polisi + 1.7, 0.08, 0.4) * sA;
        if (sir > 0) { const ph = Math.floor((t - e.polisi) * 7) % 2;
          D.glow(ctx, sx - 60, sy - 10, 150, P.red, sir * (ph ? 0.95 : 0.25)); D.glow(ctx, sx + 60, sy - 10, 150, P.blue, sir * (ph ? 0.25 : 0.95));
          ctx.save(); ctx.globalAlpha *= sir; ctx.lineCap = "round"; ctx.lineWidth = 7;
          for (let i = 0; i < 6; i++) { const ang = -Math.PI / 2 + (i - 2.5) * 0.42, r0 = r + 14, r1 = r + 30 + 8 * Math.sin(t * 20 + i);
            ctx.strokeStyle = (i < 3) === !!ph ? P.red : P.blue; ctx.beginPath(); ctx.moveTo(sx + Math.cos(ang) * r0, sy + Math.sin(ang) * r0); ctx.lineTo(sx + Math.cos(ang) * r1, sy + Math.sin(ang) * r1); ctx.stroke(); }
          ctx.restore(); }
        shield(ctx, sx, sy, r, sA, t);
      }
    }

    // ---------- rute panggilan video palsu ("dari Arab Saudi") ----------
    const rP = eio((t - e.pgl + 0.1) / 0.85);
    const grow = eio((t - e.pgl - 0.75) / 0.6), leave = eio((t - e.b5_3 + 0.05) / 0.6);
    if (rP > 0 && out3 > 0) {
      const from = proj(SAUDI[0], SAUDI[1]);
      const fade2 = 1 - 0.5 * clamp((t - e.kel) / 0.6);
      ctx.save(); ctx.globalAlpha *= out3 * fade2;
      PT.route(ctx, from, M, { t, progress: rP, bubble: rP < 1, color: P.pink, bend: 0.18 });
      ctx.restore();
      // gelembung tiba lalu langsung tumbuh menjadi HP besar (tidak ada gelembung kedua yang menetap)
      const ba = (rP >= 1 ? 1 : 0) * (1 - clamp(grow * 3));
      if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba * out3; PT.bubble(ctx, M[0], M[1] - 10, 1, { t, color: P.pink }); ctx.restore(); }
    }

    // ---------- b5_2: panggilan keluar ke Bibi asli (busur hijau) ----------
    const gP = eio((t - e.asli + 0.05) / 0.8) * out3;
    if (gP > 0) {
      const cpt = [(M[0] + BA[0]) / 2 + 60, Math.min(M[1], BA[1]) - 60];
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = D.hexA(P.green, 0.25); ctx.lineWidth = 16; const N = 40, n = Math.round(N * gP);
      const path = () => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const [x, y] = qpt(M, cpt, BA, i / N); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } };
      path(); ctx.stroke(); ctx.setLineDash([22, 16]); ctx.lineDashOffset = t * 50; ctx.strokeStyle = P.green; ctx.lineWidth = 7; path(); ctx.stroke(); ctx.restore();
      const kb = Math.min(1.06, pop(t, e.kel - 0.1, 10, 0.5));
      if (kb > 0) { ctx.save(); ctx.translate(BA[0], BA[1]); ctx.scale(kb, kb); avatar(ctx, 0, 0, 74, Object.assign({}, BIBI, { face: "bingung" }), out3, P.green, t); ctx.restore();
        // suara asli Bibi: gelombang hijau tenang di bawah avatarnya
        if (t > e.kel) { ctx.save(); ctx.globalAlpha *= out3 * clamp((t - e.kel) / 0.3); ctx.fillStyle = "rgba(10,14,50,0.45)"; H.rr(ctx, BA[0] - 208, BA[1] + 92, 236, 66, 33); ctx.fill(); wave(ctx, BA[0] - 188, BA[1] + 125, 200, 46, t, P.green, 14, 0.8, 3); ctx.restore(); } }
    }

    // ---------- HP besar: panggilan video → kontak → menelepon Bibi asli (b5_1–b5_2) ----------
    let phoneInfo = null, btnW = null;
    if (grow > 0 && leave < 1) {
      const H0 = 760, x = lerp(M[0], 1480, grow) + 90 * leave, y = lerp(M[1] - 110, 478, grow), hh = lerp(150, H0, grow) * (1 - 0.25 * leave);
      const scr = t < e.sadar + 0.45 ? "vc" : t < e.hub + 0.45 ? "kontak" : "call";
      const glitch = t < e.sadar ? 0.3 + 0.25 * win(t, e.tiru - 0.05, e.tiru + 0.6, 0.1, 0.3) : 0.3 + 0.5 * clamp((t - e.sadar) / 0.4);
      const kedip = Math.abs(t - e.wajah - 0.08) < 0.12 || Math.abs(t - e.tiru - 0.1) < 0.1;
      const sw = 1 - (1 - clamp(Math.abs(t - (e.sadar + 0.45)) / 0.18)) * 0.85 - (1 - clamp(Math.abs(t - (e.hub + 0.45)) / 0.18)) * 0.6;
      // spektrogram tiruan menempel di sisi kiri-bawah HP (digambar dulu agar terselip di belakang HP)
      const sa = win(t, e.suara - 0.05, e.sadar, 0.25, 0.4) * grow * (1 - leave), pl = x - hh * 0.24;
      const SX = pl - 432, SY = 700;
      if (sa > 0) {
        ctx.save(); ctx.globalAlpha *= sa; const sl = (1 - eout(clamp((t - e.suara + 0.05) / 0.4))) * 60; ctx.translate(sl, 0);
        ctx.fillStyle = "rgba(10,14,50,0.6)"; H.rr(ctx, SX - 12, SY - 12, 470, 144, 18); ctx.fill();
        L.spektrogram(ctx, SX, SY, 430, 120, { profil: L.SUARA.tiruan, dur: 3, scroll: t * 0.7, reveal: clamp((t - e.suara) / 0.8), frame: true, aksen: P.pink, r: 12 });
        ctx.restore();
      }
      ctx.save(); ctx.globalAlpha *= 1 - leave;
      D.glow(ctx, x, y, hh * 0.75, scr === "call" ? P.green : P.pink, 0.28 * grow);
      phoneInfo = L.hp(ctx, x, y, hh, { t, tilt: -0.12, rot: (1 - grow) * -0.2, ringkas: true, teks: 1.2, lit: Math.max(0.2, sw), glowCol: "#A9D4FF",
        screen: (c, w, h, tt) => {
          if (scr === "vc") return L.videoCall(c, w, h, { t: tt, ringkas: true, teks: 1.2, jam: false, nama: "Bibi", orang: { hijab: BIBI.hijab, ciput: BIBI.ciput, skin: BIBI.skin }, glitch, kedip, durasi: "00:" + String(12 + Math.floor(Math.max(0, t - e.video))).padStart(2, "0") });
          if (scr === "kontak") return listScreen(c, w, h, tt, t - e.hub);
          const on = t >= e.kel;
          return L.panggilan(c, w, h, { t: tt, ringkas: true, teks: 1.2, jam: false, nama: "Bibi", warna: "#2EB89A", status: on ? undefined : "Memanggil…", suara: 0.8, seed: 7,
            durasi: "00:" + String(Math.floor(Math.max(0, t - e.kel))).padStart(2, "0") });
        } });
      ctx.restore();
      if (sa > 0) arcs(ctx, pl + 6, SY + 60, 46, t, P.pink, sa, -1);   // suara keluar dari HP langsung masuk ke spektrogram
      if (phoneInfo) { phoneInfo.cx = x; phoneInfo.cy = y; phoneInfo.hh = hh; phoneInfo.left = pl; phoneInfo.SX = SX; phoneInfo.SY = SY;
        if (scr === "kontak" && phoneInfo.out && phoneInfo.map) { const p = phoneInfo.map(phoneInfo.out.x, phoneInfo.out.y); btnW = [p.x, p.y]; } }
    }

    // ---------- b5_2: gelembung palsu kembali di Mempawah lalu berbalik → pelaku (latar diredupkan sesaat) ----------
    const dimA = win(t, e.pelaku - 0.15, e.pelaku + 1.15, 0.25, 0.45) * 0.42 * out3;
    if (dimA > 0) { ctx.fillStyle = `rgba(8,10,40,${dimA})`; ctx.fillRect(0, 0, 1920, 1080); }
    const tk = Math.min(1.06, pop(t, e.nomor2 - 0.15, 10, 0.55)) * out3;
    if (tk > 0) {
      const fl = clamp((t - e.pelaku + 0.1) / 0.5), sx = Math.cos(fl * Math.PI), bob = Math.sin(t * 3) * 3, sc = 0.9 * tk + 0.3 * eio(fl);
      ctx.save();
      if (sx >= 0) { ctx.translate(M[0], M[1] - 10 + bob); ctx.scale(Math.max(0.03, sx), 1); PT.bubble(ctx, 0, 0, sc, { t, color: P.pink }); }
      else { D.glow(ctx, M[0], M[1] - 120 * sc, 210 * sc, P.red, (0.45 + 0.12 * Math.sin(t * 5)) * -sx); pelakuBubble(ctx, M[0], M[1] - 10 + bob, sc, t, Math.max(0.03, -sx)); }
      ctx.restore();
    }

    // ---------- b5_1 awal: tampilan film (sepia + pita seluloid) ----------
    const filmA = 1 - eio((t - e.bukan - 0.05) / 0.9);
    if (filmA > 0) {
      ctx.save(); ctx.globalAlpha = 0.85 * filmA; ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, 1920, 1080);
      ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.55 * filmA; ctx.fillStyle = "#E8C79A"; ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
      for (let i = 0; i < 3; i++) { const sl = Math.floor(t * 8 + i * 3.7), r = D.rng(sl * 13 + i), x = r() * 1920; ctx.fillStyle = `rgba(255,248,230,${0.25 * filmA * r()})`; ctx.fillRect(x, 0, 2 + r() * 2, 1080); }
    }
    const band = eio((t - e.bukan - 0.05) / 0.75);
    if (band < 1) {
      const bh = 120;
      [[0, -1], [1080 - bh, 1]].forEach(([y0, dir]) => { const y = y0 + dir * band * (bh + 20);
        ctx.fillStyle = "#14121C"; ctx.fillRect(0, y, 1920, bh);
        ctx.fillStyle = "#EDE6D6"; const off = (t * 140) % 90; for (let x = -off; x < 1920; x += 90) { H.rr(ctx, x + 20, y + 22, 50, 30, 7); ctx.fill(); H.rr(ctx, x + 20, y + bh - 52, 50, 30, 7); ctx.fill(); } });
    }

    // ---------- Bip ----------
    const toss = e.film + 0.12, walk0 = toss + 0.45, walk1 = walk0 + 1.5;
    const w2a = e.b5_2 - 0.45, w2b = e.hub - 0.4, w3a = e.b5_3 + 0.1, w3b = e.b5_3 + 1.5;
    const mv = (A, Bq, u) => [lerp(A[0], Bq[0], u), lerp(A[1], Bq[1], u), lerp(A[2], Bq[2], u)];
    let bp;
    if (t < walk1) bp = mv([900, 800, 190], BIP1, eio((t - walk0) / (walk1 - walk0)));
    else if (t < w2b) bp = mv(BIP1, BIP2, eio((t - w2a) / (w2b - w2a)));
    else if (t < w3b) bp = mv(BIP2, BIP3, eio((t - w3a) / (w3b - w3a)));
    else bp = BIP3.slice();
    const [bx, by, bs] = bp;
    let bo;
    const nLand = e.fly.filter(f => t >= f.land).length, lastCol = nLand ? e.fly[nLand - 1].col : null;
    if (t < toss) {
      const op = t < e.bukan - 0.25 ? 0.55 + 0.3 * Math.sin(t * 2.2) : t < e.bukan ? lerp(0.85, 1, (t - e.bukan + 0.25) / 0.25) : Math.max(0, 1 - (t - e.bukan) / 0.07);
      bo = { pose: "pegang", hold: "samping", dir: 1, propSize: 0.95, mood: "happy", prop: (c, px, py, s) => clapper(c, px, py, s * 0.95, op, -0.12) };
    } else if (t < walk0) bo = { pose: "diam", mood: "happy", wave: 1 };
    else if (t < walk1) bo = { pose: "jalan", dir: -1, mood: "happy" };
    else if (t < e.b5_2 - 0.45) {   // b5_1
      if (t >= e.memp && t < e.pgl + 0.5) bo = { pose: "tunjuk", target: [M[0], M[1]], mood: "wow" };
      else if (t >= e.suara && t < e.b5_2 - 0.45) bo = { pose: "tunjuk", target: [phoneInfo ? phoneInfo.SX + 200 : 1100, 760], mood: "think" };
      else bo = { pose: "diam", mood: "think", look: [1, -0.3] };
    } else if (t < w2b) bo = { pose: "jalan", dir: 1, mood: "think", speed: 2.4 };
    else if (t < e.asli) {   // b5_2: Bip sendiri menekan tombol telepon Bibi
      const pr = t < e.hub + 0.25 ? clamp((t - e.hub + 0.18) / 0.18) : 1 - clamp((t - e.hub - 0.25) / 0.2);
      bo = { pose: "tekan", target: btnW || [1590, 700], press: pr, mood: "think" };
    }
    else if (t < e.ternyata) bo = { pose: "tunjuk", target: [BA[0] + 60, BA[1] + 40], mood: "think" };
    else if (t < e.beda - 0.05) bo = { pose: "tunjuk", target: [CARDX - 120, CARD2Y + 20], mood: "think" };
    else if (t < w3a) bo = { pose: "kaget", k: t - e.beda + 0.05, mood: "wow" };
    else if (t < w3b) bo = { pose: "jalan", dir: -1, mood: "think", speed: 2 };
    else if (t < e.fly[0].land - 0.4) bo = { pose: "diam", mood: "think", look: [-1, -0.4] };
    else if (t < e.setengah - 0.15) bo = { pose: "pegang", hold: "samping", dir: 1, propSize: 0.5, mood: "happy", look: [-0.8, -0.3],
      prop: lastCol ? (c, px, py, s) => miniFolder(c, px, py, s * 0.5, lastCol, -0.08) : (() => {}) };
    else if (t < e.besar - 0.05) { const fp = clamp((t - e.setengah) / (e.tahunE - e.setengah + 0.6)) * 17;
      bo = { pose: "pegang", hold: "samping", dir: -1, propSize: 0.85, mood: "wow", prop: (c, px, py, s) => calendar(c, px, py - s * 0.08, s * 0.85, t, fp) }; }
    else if (t < e.korban) bo = { pose: "kaget", k: t - e.besar + 0.05, mood: "wow", seru: false };
    else bo = { pose: "diam", mood: "think", look: [1, 0.45] };   // sedih tanpa alis "marah" bawaan mood sad
    const bAl = inS3 ? fe : 1;
    if (bAl > 0) { ctx.save(); ctx.globalAlpha *= bAl; B.draw(ctx, bx, by, bs, Object.assign({ t, seed: 2 }, bo)); ctx.restore(); }
    // papan klip terlempar
    if (t >= toss && t < toss + 1.2) { const u = (t - toss) / 1.2, x0 = bx + bs * 0.95, y0 = by - bs * 0.06;
      clapper(ctx, x0 + u * 900, y0 - 520 * u + 900 * u * u, 180, 0, -0.12 + u * 5.5); }

    // ---------- label (sesudah vignette) ----------
    D.post(c => {
      // b5_1 kicker
      const kA = 1 - clamp((t - e.pgl + 0.4) / 0.5);
      if (kA > 0 && t < e.b5_2) D.kicker(c, t, e.mei - 0.05, "Kasus nyata", "Berita Suara Kalbar, Mei 2026", kA);
      // nama tempat: di laut barat laut Kalbar (tidak menutupi wilayahnya); memendek jadi "Mempawah" dan bertahan sampai kamera mundur
      const LX = M[0] - 260, LY = M[1] - 180, LXs = M[0] - 238;
      const mA = clamp((t - e.kalbar + 0.05) / 0.3) * (1 - clamp((t - e.pgl - 0.1) / 0.2));
      if (mA > 0) { c.save(); c.globalAlpha *= mA; PT.tag(c, "Mempawah, Kalimantan Barat", LX, LY, { size: 44, color: P.amber, scale: lerp(0.9, 1, Math.min(1, pop(t, e.kalbar - 0.05))) }); c.restore(); }
      const mS = clamp((t - e.pgl - 0.3) / 0.25) * out3;
      if (mS > 0) { c.save(); c.globalAlpha *= mS; PT.tag(c, "Mempawah", LXs, LY, { size: 44, color: P.amber, scale: lerp(0.9, 1, Math.min(1, pop(t, e.pgl + 0.3))) }); c.restore(); }
      // "dari Arab Saudi"
      const sA = clamp((t - e.saudi + 0.05) / 0.3) * (1 - clamp((t - e.asli + 0.3) / 0.4));
      if (sA > 0) { c.save(); c.globalAlpha *= sA; PT.tag(c, "“dari Arab Saudi”", 500, 300, { size: 48, color: P.pink, scale: lerp(0.9, 1, Math.min(1, pop(t, e.saudi - 0.05))) }); c.restore(); }
      // tiruan AI: tepat di sambungan HP + spektrogram
      if (phoneInfo) {
        const tA = win(t, e.tiru - 0.05, e.sadar + 0.3, 0.25, 0.3);
        if (tA > 0) { c.save(); c.globalAlpha *= tA; PT.tag(c, "wajah & suara tiruan", phoneInfo.left - 262, phoneInfo.SY - 52, { size: 46, color: P.pink, scale: lerp(0.9, 1, Math.min(1, pop(t, e.tiru - 0.05))) }); c.restore(); }
      }
      // Bibi asli
      const bA2 = clamp((t - e.kel + 0.1) / 0.3) * out3;
      if (bA2 > 0) { c.save(); c.globalAlpha *= bA2; PT.tag(c, "Bibi asli", BA[0], BA[1] - 125, { size: 46, color: P.green }); c.restore(); }
      const pA = clamp((t - e.pelaku - 0.3) / 0.3) * out3;
      if (pA > 0) { c.save(); c.globalAlpha *= pA; PT.tag(c, "pelaku", M[0] + 190, M[1] - 110, { size: 46, color: P.red, scale: lerp(0.9, 1, Math.min(1, pop(t, e.pelaku + 0.3))) }); c.restore(); }
      // kartu nomor keluar dari HP: nomor asli (saat "nomor asli"), nomor pelaku (saat "nomor yang dipakai"), digit beda menyala saat "berbeda"
      if (phoneInfo) {
        const lv = 1 - eio((t - e.b5_3 + 0.05) / 0.5), hk = clamp((t - e.beda + 0.15) / 0.8);
        const fly = (t0, X, Y) => { const u = eio((t - t0) / 0.5); return { u, x: lerp(X + 140, X, u), y: lerp(Y + 30, Y, u), k: lerp(0.9, 0.96, eout(u)) }; };
        const c1 = fly(e.asli - 0.1, CARDX, CARD1Y), c2 = fly(e.nomor2 - 0.15, CARDX, CARD2Y);
        numCard(c, c1.x, c1.y, c1.k, clamp(c1.u * 2.5) * lv, "Nomor asli Bibi", NUM_A, "#2EB89A", false, hk, t);
        numCard(c, c2.x, c2.y, c2.k, clamp(c2.u * 2.5) * lv, "Nomor pelaku", NUM_B, P.red, true, hk, t);
        const ne = clamp((t - e.beda + 0.1) / 0.3) * lv;
        if (ne > 0) { const r = 30 * Math.min(1.1, pop(t, e.beda - 0.1, 12, 0.5)), nx = CARDX - CARD_W * 0.48 + 6, ny = (CARD1Y + CARD2Y) / 2;
          c.save(); c.globalAlpha *= ne; c.fillStyle = P.red; c.beginPath(); c.arc(nx, ny, r, 0, TAU); c.fill(); c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.17; c.lineCap = "round";
          c.beginPath(); c.moveTo(nx - r * 0.45, ny - r * 0.2); c.lineTo(nx + r * 0.45, ny - r * 0.2); c.moveTo(nx - r * 0.45, ny + r * 0.2); c.lineTo(nx + r * 0.45, ny + r * 0.2); c.moveTo(nx + r * 0.25, ny - r * 0.55); c.lineTo(nx - r * 0.25, ny + r * 0.55); c.stroke(); c.restore(); }
      }

      // ---------- b5_3 ----------
      const fl3 = Math.min(fe, 1);
      if (inS3 && fl3 > 0) {
        c.save(); c.globalAlpha *= fl3;
        // papan nama gedung
        const nA = clamp((t - e.iasc + 0.05) / 0.35);
        if (nA > 0) { c.save(); c.globalAlpha *= nA; const k = lerp(0.9, 1, Math.min(1, pop(t, e.iasc)));
          const oA = clamp((t - e.ojk + 0.05) / 0.3), ex = 58 * eout(oA);
          c.translate(1600, 180); c.scale(k, k);
          c.fillStyle = "rgba(10,14,50,0.3)"; H.rr(c, -228, -58 + 8, 456, 124 + ex, 20); c.fill();
          c.fillStyle = CREAM; H.rr(c, -228, -58, 456, 124 + ex, 20); c.fill(); c.strokeStyle = P.teal; c.lineWidth = 5; c.stroke();
          D.txt(c, "Indonesia", 0, -10, 44, { align: "center", color: NAVY, weight: 900 });
          D.txt(c, "Anti-Scam Center", 0, 42, 44, { align: "center", color: NAVY, weight: 900 });
          if (oA > 0) { c.globalAlpha *= oA; c.fillStyle = P.teal; c.fillRect(-150, 64, 300, 3); D.txt(c, "dibentuk OJK", 0, 106, 44, { align: "center", color: "#1F8F84", weight: 900 }); }
          c.restore();
        }
        // angka laporan
        const cA = clamp((t - e.seribu + 0.05) / 0.2);
        if (cA > 0) {
          const n = 1300 * eout(clamp((t - e.seribu + 0.05) / (e.ratusE - e.seribu + 0.05))), done = t >= e.ratusE;
          const kk = done ? lerp(1.12, 1, clamp((t - e.ratusE) / 0.25)) : 1;
          c.save(); c.globalAlpha *= cA; c.translate(520, 185); c.scale(kk, kk);
          D.glow(c, 0, -30, 260, P.amber, 0.25);
          D.txt(c, (done ? "1.300" : fmt(n)) + (done ? "+" : ""), 0, 0, 120, { align: "center", color: P.amber, weight: 900 });
          c.restore();
          const lA = clamp((t - e.lap + 0.05) / 0.3);
          if (lA > 0) { c.save(); c.globalAlpha *= lA * cA; D.txt(c, "laporan penipuan", 520, 262, 48, { align: "center", weight: 800 }); c.restore(); }
          const aA = clamp((t - e.ai + 0.05) / 0.3);
          if (aA > 0) { c.save(); c.globalAlpha *= aA; PT.tag(c, "diduga memakai AI", 520, 340, { size: 44, color: P.pink, scale: lerp(0.9, 1, Math.min(1, pop(t, e.ai - 0.05))) }); c.restore(); }
        }
        // ±1,5 tahun
        const yA = clamp((t - e.setengah + 0.05) / 0.3);
        if (yA > 0) {
          c.save(); c.globalAlpha *= yA; const k = lerp(0.9, 1, Math.min(1, pop(t, e.setengah - 0.05))); c.translate(965, 340); c.scale(k, k);
          c.fillStyle = "rgba(10,14,50,0.3)"; H.rr(c, -170 + 4, -40 + 8, 340, 84, 42); c.fill();
          c.fillStyle = CREAM; H.rr(c, -170, -40, 340, 84, 42); c.fill();
          c.fillStyle = P.pink; H.rr(c, -146, -24, 50, 50, 9); c.fill(); c.fillStyle = "#FFFFFF"; c.fillRect(-140, -8, 38, 28);
          c.fillStyle = P.pink; for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) c.fillRect(-136 + i * 12, -3 + j * 12, 8, 8);
          D.txt(c, "±1,5 tahun", -80, 16, 44, { color: NAVY, weight: 900 });
          c.restore();
        }
        // "lebih besar": panah di atas tumpukan hantu
        const uA = clamp((t - e.besar + 0.05) / 0.3);
        if (uA > 0 && greyN > 0) { c.save(); c.globalAlpha *= uA; const bob = Math.sin(t * 5) * 6, x = STK.x, y = ghostTop - 78 + bob;
          D.glow(c, x, y, 80, P.amber, 0.35); c.fillStyle = P.amber;
          c.beginPath(); c.moveTo(x, y - 40); c.lineTo(x + 34, y + 4); c.lineTo(x + 13, y + 4); c.lineTo(x + 13, y + 46); c.lineTo(x - 13, y + 46); c.lineTo(x - 13, y + 4); c.lineTo(x - 34, y + 4); c.closePath(); c.fill(); c.restore(); }
        // "tidak dilaporkan": kurung pada blok map hantu
        const gA = clamp((t - e.karena + 0.05) / 0.3);
        if (gA > 0 && greyN > 0) {
          const y1 = pileTop - 2, y0 = ghostTop - 4, bx2 = STK.x - STK.fw * 0.62;
          c.save(); c.globalAlpha *= gA; c.strokeStyle = "#DDE3FF"; c.lineWidth = 5; c.lineCap = "round";
          c.beginPath(); c.moveTo(bx2 + 14, y0); c.lineTo(bx2, y0); c.lineTo(bx2, y1); c.lineTo(bx2 + 14, y1); c.moveTo(bx2, (y0 + y1) / 2); c.lineTo(bx2 - 16, (y0 + y1) / 2); c.stroke();
          const s = "tidak dilaporkan", fs = 46; c.font = `800 ${fs}px ${K.FONT}`; const lw = c.measureText(s).width + fs, lh = fs * 1.6, lx = bx2 - 26 - lw, ly = (y0 + y1) / 2 - lh / 2;
          c.fillStyle = "#7A7E96"; H.rr(c, lx, ly, lw, lh, lh / 2); c.fill(); c.setLineDash([12, 8]); c.strokeStyle = "#E3E5EE"; c.lineWidth = 3; H.rr(c, lx + 5, ly + 5, lw - 10, lh - 10, lh / 2 - 5); c.stroke(); c.setLineDash([]);
          D.txt(c, s, lx + lw / 2, ly + lh / 2 + fs * 0.36, fs, { align: "center", color: "#FFFFFF" });
          c.restore();
        }
        // sumber kecil (tetap ≥40 px)
        const srcA = clamp((t - e.seribu) / 0.4);
        if (srcA > 0) { c.save(); c.globalAlpha *= srcA * 0.85; D.txt(c, "Sumber: IASC (OJK),", 100, 826, 40, { weight: 700, color: P.ink2 }); D.txt(c, "Nov 2024–Jun 2026", 100, 874, 40, { weight: 700, color: P.ink2 }); c.restore(); }
        // "pusat pengaduan": menempati tempat angka sampai angka disebut
        const qA = clamp((t - e.pusat + 0.05) / 0.3) * (1 - clamp((t - e.seribu + 0.35) / 0.3));
        if (qA > 0) { c.save(); c.globalAlpha *= qA; PT.tag(c, "pusat pengaduan penipuan", 560, 200, { size: 48, color: P.teal, scale: lerp(0.9, 1, Math.min(1, pop(t, e.pusat - 0.05))) }); c.restore(); }
        c.restore();
      }
    });
  }

  // layar mungil HP pegawai (tanpa teks, terlalu kecil untuk dibaca)
  function tinyCall(c, w, h, t) {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#3E86C9"); g.addColorStop(1, "#4B55B8"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = D.hexA("#FFFFFF", 0.2 + 0.1 * Math.sin(t * 4)); c.beginPath(); c.arc(w / 2, h * 0.3, w * 0.3, 0, TAU); c.fill();
    c.fillStyle = "#EEF1FA"; c.beginPath(); c.arc(w / 2, h * 0.3, w * 0.2, 0, TAU); c.fill();
    c.fillStyle = "#FFFFFF"; H.rr(c, w * 0.2, h * 0.5, w * 0.6, h * 0.05, h * 0.025); c.fill();
    c.fillStyle = P.red; c.beginPath(); c.arc(w / 2, h * 0.85, w * 0.12, 0, TAU); c.fill();
  }
  // ---------- adegan kantor (b5_4) ----------
  const PN = { x: 880, y: 565, w: 420, h: 610 };   // layar transfer yang "membesar" keluar dari monitor
  const BIP4 = [420, 815, 160], BIP4b = [575, 820, 180];
  function officeScene(ctx, b, l, t, TL, e) {
    const ring = t < e.misal ? 1 : 0, ans = clamp((t - e.misal + 0.1) / 0.45);
    // kamera: dorong pelan
    const z = 1 + 0.05 * eio(l / 10), fx = 960, fy = 540, W2S = (x, y) => [960 + (x - fx) * z, 540 + (y - fy) * z];
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-fx, -fy);
    const set = LT.kantor(ctx, t, { ring: ring * (0.6 + 0.4 * Math.sin(t * 9) ** 2), phoneGlow: t < e.misal ? 1 : 0, phone: t < e.misal, px: Math.sin(t * 0.2) * 0.25, near: false });
    const A = set.anchors;
    // pegawai duduk di kursi kantor, menghadap kiri (ke meja)
    const sit = A.sit || { x: 1468, y: 646 };
    const emp = O.draw(ctx, sit.x + 8, 820, 440, Object.assign({}, PEGAWAI, { pose: ans > 0 ? "telepon" : "duduk", blend: ans > 0 && ans < 1 ? { to: "telepon", k: eio(ans) } : undefined, duduk: true, kursi: false, flip: true, t,
      face: t > e.trf ? "netral" : ans > 0 ? "netral" : "bingung", look: ans > 0 ? [-0.6, 0] : [-1, 0.1], layar: tinyCall }));
    if (ring) { const s = A.phoneScreen || A.phone; arcs(ctx, s.x, s.y - 10, 50, t, P.teal, 1, 1); arcs(ctx, s.x, s.y - 10, 50, t, P.teal, 1, -1); }
    LT.depan(ctx, "kantor", t, { px: Math.sin(t * 0.2) * 0.25 });
    ctx.restore();

    // ---------- kartu penelepon + spektrogram: di dinding kiri, di atas Bip (monitor tetap bersih) ----------
    const CC = { x: 400, y: 200, w: 520, h: 200 }, inA = clamp(l / 0.4);
    const flip = eio((t - e.atasan + 0.1) / 0.6), glit = win(t, e.tiru4 - 0.05, e.atasan + 0.2, 0.1, 0.2) * (0.6 + 0.4 * Math.sin(t * 40));
    const shake = ring ? Math.sin(t * 40) * 3 : 0;
    // pulsa saat uang masuk
    const TB = e.trf + 0.55, NB = 10, bills = Array.from({ length: NB }, (_, i) => ({ t0: e.trf + 0.12 + i * 0.17, dur: 0.95 }));
    const hitP = bills.reduce((m, q) => Math.max(m, 1 - clamp(Math.abs(t - q.t0 - q.dur) / 0.15)), 0);
    if (hitP > 0) D.glow(ctx, CC.x - CC.w / 2 + CC.h * 0.46, CC.y, 150, P.red, 0.5 * hitP);
    const card = callCard(ctx, CC.x + shake, CC.y, CC.w, CC.h, t, true, flip, glit);
    // garis sinyal dari kartu ke telinga pegawai: melengkung di atas papan tulis (tidak menyilang grafik)
    const hd = emp && emp.head ? emp.head : [1440, 452], ear = W2S(hd[0], hd[1]), sigA = Math.max(ring * 0.5, ans);
    ctx.save(); ctx.globalAlpha *= sigA * inA; ctx.strokeStyle = card.back ? P.red : P.teal; ctx.lineWidth = 6; ctx.setLineDash([3, 16]); ctx.lineDashOffset = -t * 60; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(CC.x + CC.w / 2 + 10, CC.y); ctx.bezierCurveTo(900, -60, 1500, -60, ear[0] - 40, ear[1] - 50); ctx.stroke(); ctx.restore();
    // spektrogram suara (motif sidik jari suara): "suara atasan" yang ternyata tiruan
    const spA = clamp((t - e.tiru4 + 0.1) / 0.4), SX = CC.x - CC.w / 2, SY = CC.y + CC.h / 2 + 40;
    if (spA > 0) {
      ctx.save(); ctx.globalAlpha *= spA; ctx.fillStyle = "rgba(10,14,50,0.6)"; H.rr(ctx, SX - 12, SY - 12, CC.w + 24, 134, 18); ctx.fill();
      L.spektrogram(ctx, SX, SY, CC.w, 110, { profil: ATASAN, dur: 3.2, scroll: t * 0.8, reveal: clamp((t - e.tiru4) / 0.9), frame: true, aksen: P.pink, r: 12, telepon: 0.6 });
      ctx.restore();
    }

    // ---------- layar transfer membesar dari monitor saat "meminta" ----------
    const mon = A.monitor || { x: 860, y: 433, w: 316, h: 182 };
    const pg = eio((t - e.minta + 0.05) / 0.35);
    let tw = null;   // posisi tombol di dunia
    if (pg > 0) {
      // bingkai terang membesar dari monitor (tanpa isi), isi layar baru muncul saat hampir penuh (teks tak pernah kecil)
      const mc = W2S(mon.x, mon.y), m0 = W2S(mon.x - mon.w / 2, mon.y - mon.h / 2), m1 = W2S(mon.x + mon.w / 2, mon.y + mon.h / 2);
      const fr = [lerp(m0[0], PN.x - PN.w / 2, pg), lerp(m0[1], PN.y - PN.h / 2, pg), lerp(m1[0], PN.x + PN.w / 2, pg), lerp(m1[1], PN.y + PN.h / 2, pg)];
      const ca = clamp((pg - 0.8) / 0.2 + 1e-9), k = lerp(0.93, 1, ca), cx = PN.x, cy = PN.y, endP = 1 - clamp((l - D.speechEnd(b) - 0.05) / 0.25);
      if (ca < 1) { ctx.save(); ctx.globalAlpha *= (1 - ca) * clamp(pg * 4); ctx.fillStyle = "rgba(220,230,255,0.35)"; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6;
        H.rr(ctx, fr[0], fr[1], fr[2] - fr[0], fr[3] - fr[1], 18); ctx.fill(); ctx.stroke(); ctx.restore(); }
      const L0 = cx - PN.w * k / 2, T0 = cy - PN.h * k / 2;
      const fp = t < e.trf + 0.4 ? clamp((t - e.trf + 0.18) / 0.2) : 1 - clamp((t - e.trf - 0.4) / 0.25);
      const tek = t < TB - 0.05 ? { tombol: "transfer", u: clamp((t - e.trf + 0.02) / 0.6) } : { tombol: "tunggu", u: clamp((t - TB + 0.02) / 0.6) };
      const show = ca * endP > 0.01;
      ctx.save(); ctx.globalAlpha *= ca * endP;
      if (show) D.glow(ctx, cx, cy, 420 * k, t > e.trf ? P.red : "#9FB4FF", 0.35);
      let out = null;
      if (show) { ctx.fillStyle = "rgba(10,14,50,0.35)"; H.rr(ctx, L0 - 14 * k + 8, T0 - 14 * k + 14, (PN.w + 28) * k, (PN.h + 28) * k, 26 * k); ctx.fill();
      ctx.fillStyle = "#1E2547"; H.rr(ctx, L0 - 14 * k, T0 - 14 * k, (PN.w + 28) * k, (PN.h + 28) * k, 26 * k); ctx.fill();
      ctx.translate(L0, T0); ctx.scale(k, k); ctx.beginPath(); H.rr(ctx, 0, 0, PN.w, PN.h, 14); ctx.clip();
      out = L.transfer(ctx, PN.w, PN.h, { t, ringkas: true, teks: 1.25, jam: false, app: "Bank", ke: "Rekening …", nominal: "Rp•••••••",
        highlight: t < e.trf ? "transfer" : undefined, tekan: tek }); }
      ctx.restore();
      if (out && out.transfer && ca > 0.999) {
        const tr = out.transfer, tg = out.tunggu;
        tw = { tr: [L0 + tr.cx, T0 + tr.cy], trTip: [L0 + tr.x + tr.w * 0.8, T0 + tr.cy + 4], tgTop: [L0 + tg.x + tg.w * 0.3, T0 + tg.y + tg.h * 0.5] };
        // jari pegawai menekan "Transfer"
        const fa = win(t, e.minta + 0.35, e.trf + 0.75, 0.3, 0.35);
        if (fa > 0) { ctx.save(); ctx.globalAlpha *= fa * endP; L.jari(ctx, tw.trTip[0], tw.trTip[1], 130, { tekan: fp, t, kulit: PEGAWAI.skin, lengan: PEGAWAI.top, rot: -1.05 }); ctx.restore(); }
      }
    }
    // uang terbang dari tombol Transfer ke kartu pelaku (≥80 px)
    if (tw) bills.forEach((q, i) => {
      const u = (t - q.t0) / q.dur; if (u <= 0 || u >= 1) return; const ue = eio(u);
      const dst = [card.ax, card.ay], ctl = [(tw.tr[0] + dst[0]) / 2 + 40, Math.min(tw.tr[1], dst[1]) - 200 + (i % 3) * 40];
      const [x, y] = qpt(tw.tr, ctl, dst, ue);
      ctx.save(); ctx.globalAlpha *= clamp(u * 8) * (1 - clamp((u - 0.88) / 0.12));
      B.ikon(ctx, "uang", x, y, lerp(46, 40, ue) + 4 * Math.sin(Math.PI * u), { color: P.green }); ctx.restore();
    });
    // Bip: menunjuk pelaku, lalu berlari ke layar dan menepuk "Tunggu" — terlambat
    const run0 = e.minta + 0.25, run1 = TB - 0.3;
    const bp = t < run0 ? BIP4 : (() => { const u = eio((t - run0) / (run1 - run0)); return [lerp(BIP4[0], BIP4b[0], u), lerp(BIP4[1], BIP4b[1], u), lerp(BIP4[2], BIP4b[2], u)]; })();
    let bpose;
    if (t < e.atasan + 0.2) bpose = { pose: "diam", mood: "think", look: [0, -1] };
    else if (t < run0) bpose = { pose: "tunjuk", target: [card.ax, card.ay], mood: "wow" };
    else if (t < run1) bpose = { pose: "jalan", dir: 1, mood: "wow", speed: 2.8 };
    else if (t < TB + 0.75 && tw) bpose = { pose: "tekan", target: tw.tgTop, press: clamp((t - TB + 0.14) / 0.14), mood: t > TB ? "wow" : "think" };
    else if (t >= TB + 0.75) bpose = { pose: "kaget", k: t - TB - 0.75, mood: "wow" };
    else bpose = { pose: "diam", mood: "wow", look: [1, 0] };
    B.draw(ctx, bp[0], bp[1], bp[2], Object.assign({ t, seed: 2 }, bpose));

    const endA = 1 - clamp((l - D.speechEnd(b) - 0.3) / 0.3);   // label hilang di bawah kartu bab berikutnya
    D.post(c => {
      if (endA <= 0) return;
      c.save(); c.globalAlpha *= inA * endA;
      const kk = card.k, nm = card.back ? "Pelaku" : "Pak Direktur", sub = card.back ? "meniru atasan" : (t < e.misal ? "memanggil…" : "tersambung");
      c.save(); c.translate(CC.x, CC.y); c.scale(Math.max(0.02, kk), 1);
      D.txt(c, nm, -CC.w / 2 + CC.h * 0.86, -8, 54, { color: "#FFFFFF", weight: 900 });
      D.txt(c, sub, -CC.w / 2 + CC.h * 0.86, 50, 42, { color: card.back ? "#FFB3B8" : P.ink2, weight: 700 });
      c.restore();
      const lbl = flip < 0.5 ? "suara atasan?" : "suara tiruan";
      if (spA > 0) { c.save(); c.globalAlpha *= spA; PT.tag(c, lbl, CC.x, SY + 110 + 58, { size: 46, color: P.pink }); c.restore(); }
      const rA = clamp((t - e.trf + 0.05) / 0.3);
      if (rA > 0) { c.save(); c.globalAlpha *= rA; PT.tag(c, "transfer uang", PN.x, PN.y - PN.h / 2 - 56, { size: 48, color: P.red, scale: lerp(0.9, 1, Math.min(1, pop(t, e.trf - 0.05))) }); c.restore(); }
      c.restore();
    });
  }

  function scene(ctx, b, l, t, TL) {
    const e = EV(TL);
    if (b.id === "b5_4") officeScene(ctx, b, l, t, TL, e);
    else mapScene(ctx, b, t, TL, e);
  }
  K.SCENES.d03_b5 = scene;
  K.SCENES.d03_b5.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b5 = TL => {
    const e = EV(TL), r = (x, kind, amp) => [+x.toFixed(3), kind, amp];
    return [
      r(e.bukan, "clack", 0.8),                 // papan klip dikatupkan
      r(e.film + 0.12 - 0.3, "whoosh", 0.5),    // papan dilempar, pita film tersingkap
      r(e.memp, "pop", 0.7),                    // penanda + avatar warga
      r(e.polisi, "pop", 0.5),                  // lencana polisi
      r(e.pgl - 0.5, "whoosh", 0.6),            // gelembung panggilan video terbang
      r(e.pgl + 0.8, "shimmer", 0.55),          // HP besar tumbuh
      r(e.hub, "pop", 0.45),                    // tombol telepon Bibi ditekan
      r(e.asli - 0.05, "shimmer", 0.5),         // kartu nomor asli + Bibi asli muncul
      r(e.beda, "boom", 0.8),                   // pelaku terungkap + Bip kaget
      r(e.b5_3 - 0.5, "whoosh", 0.6),           // kamera mundur ke seluruh Indonesia
      r(e.iasc, "pop", 0.6),                    // gedung IASC naik
      r(e.pusat, "shimmer", 0.5),               // sepuluh kota berdenyut, map mulai terbang
      r(e.ratusE, "pop", 0.7),                  // hitungan 1.300+ mendarat
      r(e.setengah, "pop", 0.5),                // ±1,5 tahun
      r(e.besar + 0.2, "clack", 0.6),           // map hantu "tidak dilaporkan" jatuh
      r(e.atasan, "whoosh", 0.55),              // kartu penelepon berbalik
      r(e.trf, "boom", 0.7),                    // "Transfer" ditekan, uang terbang
      r(e.trf + 0.55, "clack", 0.6),            // Bip menepuk "Tunggu" — terlambat
    ].filter(x => x && isFinite(x[0]));
  };
})(typeof window !== "undefined" ? window : globalThis);
