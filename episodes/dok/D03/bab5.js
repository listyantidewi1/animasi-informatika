/* D03 bab 5: "Sudah terjadi di sekitar kita" (b5_1, b5_2, b5_3, b5_4).
   Metafora utama bab: peta titik Indonesia sebagai "papan kasus nyata". Satu panggung bersambung di studio biru untuk b5_1–b5_3:
   b5_1 bingkai film (sepia, pita seluloid) + Bip memegang papan klip → "bukan cerita film": papan dikatupkan dan dilempar, peta jadi berwarna;
        kamera menukik ke Mempawah (Kalbar), warga (avatar) melapor polisi (lencana), panggilan video "dari Arab Saudi" tiba sebagai gelembung
        lalu tumbuh menjadi HP besar: wajah bibi berkedip, suaranya tiruan.
   b5_2 HP yang sama: panggilan berakhir → daftar kontak, tombol Bibi ditekan → "Memanggil…" → busur hijau ke Bibi asli di Arab Saudi (bingung);
        kartu "Nomor asli Bibi" lalu "Nomor pelaku" keluar dari HP, digit yang beda menyala merah saat "berbeda";
        gelembung palsu di Mempawah berbalik memperlihatkan pelaku berkerudung; Bip kaget.
   b5_3 kamera mundur ke seluruh Indonesia; laporan berkelip di banyak kota dan terbang sebagai map kecil ke tumpukan di depan gedung
        Indonesia Anti-Scam Center (OJK); angka 1.300+ dihitung tepat saat diucapkan, ±1,5 tahun, lalu map abu-abu "tidak dilaporkan" + korban yang malu.
   b5_4 kantor: telepon "Pak Direktur" berdering, pegawai mengangkat; kartu penelepon berbalik → pelaku dengan suara tiruan (spektrogram);
        uang terbang dari layar transfer ke pelaku.
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
  const PEGAWAI = { age: "dewasa", hair: "kuncir", skin: O.SKIN[3], top: "#8C7BF0", outfit: "kemeja", bawah: "celana", bottom: "#33396E", lengan: "panjang", seed: 27 };

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
    // laporan yang terbang ke tumpukan (b5_3): kota asal, waktu berangkat
    const cities = ["medan", "jakarta", "surabaya", "makassar", "bandung", "palembang", "semarang", "denpasar", "pontianak", "balikpapan", "manado", "yogyakarta", "padang", "banjarmasin", "mataram", "kupang", "ambon", "jayapura", "bandaAceh", "ternate"];
    const r = D.rng(505), t0 = e.pusat + 0.2, t1 = e.setengah + 0.4, N = 24;
    e.fly = Array.from({ length: N }, (_, i) => { const u = i / (N - 1), dense = u * u * 0.35 + u * 0.65; const ts = lerp(t0, t1, dense) + (r() - 0.5) * 0.25;
      return { city: cities[(i * 7 + Math.floor(r() * 3)) % cities.length], t: ts, dur: 1.05 + r() * 0.3, bend: 0.6 + r() * 0.5 }; });
    e.fly.forEach(f => (f.land = f.t + f.dur));
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
    const gr = c.createLinearGradient(0, by, 0, by + h); gr.addColorStop(0, "#2B2F5A"); gr.addColorStop(1, "#4A3B78"); c.fillStyle = gr; c.fillRect(bx, by, w, h);
    O.kepala(c, 0, by + h * 0.52, 34 * s, Object.assign(O.preset("pelaku"), { t, face: "netral", bahu: 1.3 }));
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
    D.txt(c, "Kontak", 26, 78, 52, { color: "#FFFFFF", weight: 900 });
    const rows = [["Adik", "#7C8BEA"], ["Bibi", "#2EB89A"], ["Ibu", "#E8739A"], ["Paman", "#F0A04B"], ["Pak RT", "#8E7CF0"]], rh = 112;
    rows.forEach(([nm, col], i) => {
      const y = hh + 14 + i * rh, cy = y + rh / 2, on = nm === "Bibi", pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
      if (on) { c.fillStyle = D.hexA(P.teal, 0.18 + 0.1 * pulse); H.rr(c, 8, y + 6, w - 16, rh - 12, 22); c.fill(); c.fillStyle = "#FFFFFF"; H.rr(c, 13, y + 11, w - 26, rh - 22, 18); c.fill(); }
      else if (i > 0) { c.fillStyle = "#E1E5F4"; c.fillRect(96, y, w - 110, 2); }
      c.save(); c.beginPath(); c.arc(54, cy, 30, 0, TAU); c.fillStyle = col; c.fill(); c.clip(); c.fillStyle = "rgba(255,255,255,0.55)";
      c.beginPath(); c.arc(54, cy - 6, 11, 0, TAU); c.fill(); c.beginPath(); c.ellipse(54, cy + 24, 21, 15, 0, 0, TAU); c.fill(); c.restore();
      D.txt(c, nm, 100, cy + 18, 50, { color: NAVY, weight: 800 });
      if (on) {
        const bx = w - 52, press = dp > 0 ? 1 - 0.18 * Math.sin(Math.PI * clamp(dp / 0.3)) : 1;
        if (dp > 0) { const u = clamp(dp / 0.6); c.strokeStyle = D.hexA("#22B07D", 0.8 * (1 - u)); c.lineWidth = 5; c.beginPath(); c.arc(bx, cy, 30 + 50 * eout(u), 0, TAU); c.stroke(); }
        c.fillStyle = D.hexA("#22B07D", 0.3 * pulse); c.beginPath(); c.arc(bx, cy, 30 * (1.2 + 0.25 * pulse), 0, TAU); c.fill();
        c.fillStyle = "#22B07D"; c.beginPath(); c.arc(bx, cy, 30 * press, 0, TAU); c.fill(); L.ikon(c, "telepon", bx, cy, 26 * press, "#FFFFFF");
      }
    });
    c.restore();
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

  // ---------- peta: tampilan kamera per waktu ----------
  const W0 = 1650, W1 = 4300, W2 = 1060;
  const P0 = (() => { const pz = PT.proj(960, 590, W0); return pz(MEMP[0], MEMP[1]); })();
  const P1 = [700, 600];
  const P2 = (() => { const pz = PT.proj(590, 610, W2); return pz(MEMP[0], MEMP[1]); })();
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

  // ---------- adegan peta (b5_1–b5_3) ----------
  function mapScene(ctx, b, t, TL, e) {
    const v = mapView(t, e), inS3 = t >= e.b5_3 - 0.01;
    const fadeOut3 = 1 - clamp((t - (e.b5_3e - 0.45)) / 0.4);   // label b5_3 memudar sebelum pindah ke kantor
    LT.studio(ctx, t, { warna: "biru", px: clamp((v.mx - 700) / 900, -1, 1) * 0.6 });
    // partikel cahaya melayang
    for (let i = 0; i < 26; i++) { const r = D.rng(900 + i), x0 = r() * 1920, sp = 8 + r() * 14, y = 1080 - ((t * sp + r() * 1080) % 1180), x = x0 + Math.sin(t * 0.5 + i) * 18;
      D.glow(ctx, x, y, 10 + r() * 10, i % 3 ? P.teal : P.amber, 0.25 + 0.15 * Math.sin(t * 2 + i)); }

    const proj = drawMap(ctx, t, e, v);
    const M = [v.mx, v.my];

    // ---------- b5_3: laporan berkelip di kota-kota dan terbang ke tumpukan ----------
    const STK = { x: 1600, y: 880, fw: 260 }, NC = 8, NG = 4;
    const bA = clamp((t - e.iasc + 0.15) / 0.5) * (inS3 ? 1 : 0);
    const nCol = e.fly.filter(f => t >= f.land).length, nStack = Math.min(NC, Math.round(nCol * NC / e.fly.length));
    const gu = clamp((t - e.besar + 0.1) / 1.6) * NG, greyN = Math.ceil(gu - 1e-6), greyDrop = greyN > 0 ? clamp(gu - (greyN - 1)) : 1;
    const stackTopY = STK.y - (nStack + greyN) * STK.fw * 0.13 * 0.94;
    if (bA > 0) {
      ctx.save(); ctx.globalAlpha *= bA; const bs = lerp(0.7, 1, Math.min(1, pop(t, e.iasc - 0.15, 9, 0.6)));
      ctx.translate(1600, 640); ctx.scale(bs, bs); ctx.translate(-1600, -640); building(ctx, 1600, 640, 420, t, true); ctx.restore();
      // laporan
      e.fly.forEach((f, i) => {
        const [cx, cy] = proj(...PT.ANCHORS[f.city]); const col = [P.pink, P.amber, P.teal, P.violet, P.blue][i % 5];
        const blink = win(t, f.t - 0.45, f.t + 0.1, 0.15, 0.3);
        if (blink > 0) { const u = clamp((t - f.t + 0.45) / 0.55); ctx.strokeStyle = D.hexA(col, (1 - u) * 0.95 * blink); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, 8 + 34 * eout(u), 0, TAU); ctx.stroke(); D.glow(ctx, cx, cy, 30, col, 0.8 * blink); }
        if (t > f.t && t < f.land) { const u = eio((t - f.t) / f.dur), top = [STK.x, STK.y - nStack * STK.fw * 0.12 - 20], ctl = [(cx + top[0]) / 2, Math.min(cy, top[1]) - 260 * f.bend];
          const [x, y] = qpt([cx, cy], ctl, top, u); miniFolder(ctx, x, y, lerp(34, 70, u), col, (1 - u) * 0.8 * (i % 2 ? 1 : -1), clamp(u * 5)); }
      });
      // tumpukan map
      ctx.save(); ctx.globalAlpha *= bA;
      B.mapBerkas(ctx, STK.x, STK.y, STK.fw, { n: nStack + greyN, grey: greyN, greyLabel: false, drop: greyN > 0 ? greyDrop : 1, t, seed: 2 });
      ctx.restore();
    }
    // korban yang malu (b5_3 akhir)
    const vA = clamp((t - e.korban + 0.2) / 0.5);
    if (vA > 0 && inS3) {
      ctx.save(); ctx.globalAlpha *= vA; const sx = lerp(40, 0, eout(vA));
      O.draw(ctx, 1820 + sx, 885, 300, Object.assign({}, WARGA, { top: "#B39CF7", hair: "panjang", seed: 41, pose: "kucek", face: "sedih", flip: true, t }));
      ctx.restore();
    }

    // ---------- b5_1: avatar warga + lencana polisi ----------
    const out3 = 1 - clamp((t - e.b5_3) / 0.55);
    const wA = clamp((t - e.memp - 0.1) / 0.35) * out3;
    const AV = [M[0] - 210, M[1] + 10];
    if (wA > 0) {
      const k = Math.min(1.06, pop(t, e.memp - 0.1, 10, 0.5));
      ctx.save(); ctx.globalAlpha *= wA; ctx.strokeStyle = D.hexA(P.amber, 0.9); ctx.lineWidth = 5; ctx.setLineDash([4, 12]); ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(AV[0] + 80, AV[1]); ctx.lineTo(M[0] - 22, M[1]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      const face = t > e.sadar ? (t > e.beda ? "panik" : "bingung") : (t > e.wajah ? "netral" : "netral");
      ctx.save(); ctx.translate(AV[0], AV[1]); ctx.scale(k, k); avatar(ctx, 0, 0, 70, Object.assign({}, WARGA, { face }), wA, P.amber, t); ctx.restore();
      const sA = clamp((t - e.polisi) / 0.3) * out3; if (sA > 0) { const ks = Math.min(1.1, pop(t, e.polisi, 12, 0.45)); shield(ctx, AV[0] + 58, AV[1] - 58, 34 * ks, sA, t); }
    }

    // ---------- rute panggilan video palsu ("dari Arab Saudi") ----------
    const rP = eio((t - e.pgl + 0.1) / 0.85), rA = out3;
    let bubbleOn = false;
    if (rP > 0 && rA > 0) {
      const from = proj(SAUDI[0], SAUDI[1]);
      const fade2 = 1 - 0.5 * clamp((t - e.kel) / 0.6);
      ctx.save(); ctx.globalAlpha *= rA * fade2;
      PT.route(ctx, from, M, { t, progress: rP, bubble: rP < 1, color: P.pink, bend: 0.18 });
      ctx.restore(); bubbleOn = rP >= 1;
    }
    // gelembung palsu menetap di Mempawah, lalu berbalik → pelaku (b5_2)
    if (bubbleOn && rA > 0) {
      const fl = clamp((t - e.pelaku + 0.1) / 0.5), sx = Math.cos(fl * Math.PI), bob = Math.sin(t * 3) * 3;
      ctx.save(); ctx.globalAlpha *= rA;
      if (sx >= 0) { ctx.translate(M[0], M[1] - 10 + bob); ctx.scale(Math.max(0.03, sx), 1); PT.bubble(ctx, 0, 0, 1, { t, color: P.pink }); }
      else { pelakuBubble(ctx, M[0], M[1] - 10 + bob, 1, t, Math.max(0.03, -sx)); if (fl >= 1) D.glow(ctx, M[0], M[1] - 110, 160, P.red, 0.25 + 0.1 * Math.sin(t * 5)); }
      ctx.restore();
    }

    // ---------- b5_2: panggilan keluar ke Bibi asli (busur hijau) ----------
    const gP = eio((t - e.asli + 0.05) / 0.8) * out3;
    const BA = [330, 300];
    if (gP > 0) {
      const cpt = [(M[0] + BA[0]) / 2 - 40, Math.min(M[1], BA[1]) - 150];
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = D.hexA(P.green, 0.25); ctx.lineWidth = 16; const N = 40, n = Math.round(N * gP);
      const path = () => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const [x, y] = qpt(M, cpt, BA, i / N); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } };
      path(); ctx.stroke(); ctx.setLineDash([22, 16]); ctx.lineDashOffset = t * 50; ctx.strokeStyle = P.green; ctx.lineWidth = 7; path(); ctx.stroke(); ctx.restore();
      const kb = Math.min(1.06, pop(t, e.kel - 0.1, 10, 0.5));
      if (kb > 0) { ctx.save(); ctx.translate(BA[0], BA[1]); ctx.scale(kb, kb); avatar(ctx, 0, 0, 74, Object.assign({}, BIBI, { face: "bingung" }), out3, P.green, t); ctx.restore(); }
    }

    // ---------- HP besar: panggilan video → kontak → menelepon Bibi asli (b5_1–b5_2) ----------
    const grow = eio((t - e.pgl - 0.75) / 0.6), leave = eio((t - e.b5_3 + 0.05) / 0.6);
    let phoneInfo = null;
    if (grow > 0 && leave < 1) {
      const H0 = 760, x = lerp(M[0], 1480, grow) + 90 * leave, y = lerp(M[1] - 110, 478, grow), hh = lerp(150, H0, grow) * (1 - 0.25 * leave);
      const scr = t < e.sadar + 0.45 ? "vc" : t < e.hub + 0.45 ? "kontak" : "call";
      const glitch = t < e.sadar ? 0.3 + 0.25 * win(t, e.tiru - 0.05, e.tiru + 0.6, 0.1, 0.3) : 0.3 + 0.5 * clamp((t - e.sadar) / 0.4);
      const kedip = Math.abs(t - e.wajah - 0.08) < 0.12 || Math.abs(t - e.tiru - 0.1) < 0.1;
      const sw = 1 - (1 - clamp(Math.abs(t - (e.sadar + 0.45)) / 0.18)) * 0.85 - (1 - clamp(Math.abs(t - (e.hub + 0.45)) / 0.18)) * 0.6;
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
      // suara keluar dari HP + spektrogram tiruan
      const sa = win(t, e.suara - 0.05, e.sadar, 0.25, 0.4) * grow * (1 - leave);
      if (sa > 0) {
        arcs(ctx, x - hh * 0.27, y - hh * 0.18, 70, t, P.pink, sa, -1);
        const SX = x - hh * 0.25 - 470, SY = 690;
        ctx.save(); ctx.globalAlpha *= sa; ctx.fillStyle = "rgba(10,14,50,0.55)"; H.rr(ctx, SX - 12, SY - 12, 444, 144, 18); ctx.fill();
        L.spektrogram(ctx, SX, SY, 420, 120, { profil: L.SUARA.tiruan, dur: 3, scroll: t * 0.7, reveal: clamp((t - e.suara) / 0.8), frame: true, aksen: P.pink, r: 12 });
        ctx.restore();
      }
      if (phoneInfo) phoneInfo.cx = x, phoneInfo.cy = y, phoneInfo.hh = hh;
    }

    // ---------- b5_1 awal: tampilan film (sepia + pita seluloid) ----------
    const filmA = 1 - eio((t - e.bukan - 0.05) / 0.9);
    if (filmA > 0) {
      ctx.save(); ctx.globalAlpha = 0.85 * filmA; ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, 1920, 1080);
      ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.55 * filmA; ctx.fillStyle = "#E8C79A"; ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
      // goresan film berkedip
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
    const bw = eio((t - walk0) / (walk1 - walk0)), bx = lerp(900, 215, bw), by = lerp(800, 815, bw), bs = lerp(190, 160, bw);
    let bo;
    if (t < toss) {
      const op = t < e.bukan - 0.25 ? 0.55 + 0.3 * Math.sin(t * 2.2) : t < e.bukan ? lerp(0.85, 1, (t - e.bukan + 0.25) / 0.25) : Math.max(0, 1 - (t - e.bukan) / 0.07);
      bo = { pose: "pegang", hold: "samping", dir: 1, propSize: 0.95, mood: "happy", prop: (c, px, py, s) => clapper(c, px, py, s * 0.95, op, -0.12) };
    } else if (t < walk0) bo = { pose: "diam", mood: "happy", wave: 1 };
    else if (t < walk1) bo = { pose: "jalan", dir: -1, mood: "happy" };
    else if (!inS3) {
      if (t >= e.beda - 0.05 && t < e.b5_3) bo = { pose: "kaget", k: t - e.beda + 0.05, mood: "wow" };
      else if (t >= e.memp && t < e.pgl + 0.5) bo = { pose: "tunjuk", target: [M[0], M[1]], mood: "wow" };
      else if (t >= e.ternyata && t < e.beda) bo = { pose: "tunjuk", target: [760, 300], mood: "think" };
      else if (t >= e.asli && t < e.ternyata) bo = { pose: "tunjuk", target: [BA[0] + 60, BA[1] + 40], mood: "think" };
      else bo = { pose: "diam", mood: "think", look: [1, -0.3] };
    } else {
      if (t >= e.seribu - 0.1 && t < e.besar) bo = { pose: "tunjuk", target: [760, 200], mood: "wow" };
      else if (t >= e.besar && t < e.korban) bo = { pose: "kaget", k: t - e.besar, mood: "wow", seru: false };
      else if (t >= e.korban) bo = { pose: "diam", mood: "sad", look: [1, 0.2] };
      else bo = { pose: "diam", mood: "think", look: [1, -0.4] };
    }
    B.draw(ctx, bx, by, bs, Object.assign({ t, seed: 2 }, bo));
    // papan klip terlempar
    if (t >= toss && t < toss + 1.2) { const u = (t - toss) / 1.2, x0 = bx + bs * 0.95, y0 = by - bs * 0.06;
      clapper(ctx, x0 + u * 900, y0 - 520 * u + 900 * u * u, 180, 0, -0.12 + u * 5.5); }

    // ---------- label (sesudah vignette) ----------
    D.post(c => {
      // b5_1 kicker
      const kA = 1 - clamp((t - e.pgl + 0.4) / 0.5);
      if (kA > 0 && t < e.b5_2) D.kicker(c, t, e.mei - 0.05, "Kasus nyata", "Berita Suara Kalbar, Mei 2026", kA);
      // nama tempat
      const mA = clamp((t - e.kalbar + 0.05) / 0.3) * (1 - clamp((t - e.pgl - 0.2) / 0.4));
      if (mA > 0) { c.save(); c.globalAlpha *= mA; PT.tag(c, "Mempawah, Kalimantan Barat", M[0] + 90, M[1] + 140, { size: 48, color: P.amber, scale: lerp(0.9, 1, Math.min(1, pop(t, e.kalbar - 0.05))) }); c.restore(); }
      // "dari Arab Saudi"
      const sA = clamp((t - e.saudi + 0.05) / 0.3) * (1 - clamp((t - e.asli + 0.3) / 0.4));
      if (sA > 0) { c.save(); c.globalAlpha *= sA; PT.tag(c, "“dari Arab Saudi”", 500, 300, { size: 48, color: P.pink, scale: lerp(0.9, 1, Math.min(1, pop(t, e.saudi - 0.05))) }); c.restore(); }
      // tiruan AI di HP
      if (phoneInfo) {
        const tA = win(t, e.tiru - 0.05, e.sadar + 0.3, 0.25, 0.3);
        if (tA > 0) { c.save(); c.globalAlpha *= tA; PT.tag(c, "wajah & suara tiruan", 940, 190, { size: 46, color: P.pink, scale: lerp(0.9, 1, Math.min(1, pop(t, e.tiru - 0.05))) }); c.restore(); }
      }
      // Bibi asli
      const bA2 = clamp((t - e.kel + 0.1) / 0.3) * out3;
      if (bA2 > 0) { c.save(); c.globalAlpha *= bA2; PT.tag(c, "Bibi asli", BA[0], BA[1] + 132, { size: 46, color: P.green }); c.restore(); }
      const pA = clamp((t - e.pelaku - 0.3) / 0.3) * out3;
      if (pA > 0) { c.save(); c.globalAlpha *= pA; PT.tag(c, "pelaku", M[0] + 170, M[1] - 120, { size: 46, color: P.red, scale: lerp(0.9, 1, Math.min(1, pop(t, e.pelaku + 0.3))) }); c.restore(); }
      // kartu nomor keluar dari HP: nomor asli (saat "nomor asli"), nomor pelaku (saat "nomor yang dipakai"), digit beda menyala saat "berbeda"
      if (phoneInfo) {
        const lv = 1 - eio((t - e.b5_3 + 0.05) / 0.5), hk = clamp((t - e.beda + 0.15) / 0.8);
        const fly = (t0, X, Y) => { const u = eio((t - t0) / 0.5); return { u, x: lerp(X + 140, X, u), y: lerp(Y + 30, Y, u), k: lerp(0.9, 0.96, eout(u)) }; };
        const c1 = fly(e.asli - 0.1, 1012, 170), c2 = fly(e.nomor2 - 0.15, 1012, 340);
        numCard(c, c1.x, c1.y, c1.k, clamp(c1.u * 2.5) * lv, "Nomor asli Bibi", NUM_A, "#2EB89A", false, hk, t);
        numCard(c, c2.x, c2.y, c2.k, clamp(c2.u * 2.5) * lv, "Nomor pelaku", NUM_B, P.red, true, hk, t);
        const ne = clamp((t - e.beda + 0.1) / 0.3) * lv;
        if (ne > 0) { const r = 30 * Math.min(1.1, pop(t, e.beda - 0.1, 12, 0.5)), nx = 1012 - CARD_W * 0.48 + 6, ny = 255;
          c.save(); c.globalAlpha *= ne; c.fillStyle = P.red; c.beginPath(); c.arc(nx, ny, r, 0, TAU); c.fill(); c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.17; c.lineCap = "round";
          c.beginPath(); c.moveTo(nx - r * 0.45, ny - r * 0.2); c.lineTo(nx + r * 0.45, ny - r * 0.2); c.moveTo(nx - r * 0.45, ny + r * 0.2); c.lineTo(nx + r * 0.45, ny + r * 0.2); c.moveTo(nx + r * 0.25, ny - r * 0.55); c.lineTo(nx - r * 0.25, ny + r * 0.55); c.stroke(); c.restore(); }
      }

      // ---------- b5_3 ----------
      if (inS3 && fadeOut3 > 0) {
        c.save(); c.globalAlpha *= fadeOut3;
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
          // panah "lebih besar"
          const uA = clamp((t - e.besar + 0.05) / 0.3);
          if (uA > 0) { c.save(); c.globalAlpha *= uA; const bob = Math.sin(t * 5) * 6, x = 775, y = 128 + bob; c.fillStyle = P.amber;
            c.beginPath(); c.moveTo(x, y - 40); c.lineTo(x + 34, y + 4); c.lineTo(x + 13, y + 4); c.lineTo(x + 13, y + 46); c.lineTo(x - 13, y + 46); c.lineTo(x - 13, y + 4); c.lineTo(x - 34, y + 4); c.closePath(); c.fill(); c.restore(); }
        }
        // ±1,5 tahun
        const yA = clamp((t - e.setengah + 0.05) / 0.3);
        if (yA > 0) {
          c.save(); c.globalAlpha *= yA; const k = lerp(0.9, 1, Math.min(1, pop(t, e.setengah - 0.05))); c.translate(965, 340); c.scale(k, k);
          // ikon kalender
          c.fillStyle = "rgba(10,14,50,0.3)"; H.rr(c, -170 + 4, -40 + 8, 340, 84, 42); c.fill();
          c.fillStyle = CREAM; H.rr(c, -170, -40, 340, 84, 42); c.fill();
          c.fillStyle = P.pink; H.rr(c, -146, -24, 50, 50, 9); c.fill(); c.fillStyle = "#FFFFFF"; c.fillRect(-140, -8, 38, 28);
          c.fillStyle = P.pink; for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) c.fillRect(-136 + i * 12, -3 + j * 12, 8, 8);
          D.txt(c, "±1,5 tahun", -80, 16, 44, { color: NAVY, weight: 900 });
          c.restore();
        }
        // "tidak dilaporkan"
        const gA = clamp((t - e.karena + 0.05) / 0.3);
        if (gA > 0 && greyN > 0) {
          const y1 = STK.y - nStack * STK.fw * 0.13 * 0.94, y0 = stackTopY - 6, bx2 = STK.x - STK.fw * 0.62;
          c.save(); c.globalAlpha *= gA; c.strokeStyle = "#DDE3FF"; c.lineWidth = 5; c.lineCap = "round";
          c.beginPath(); c.moveTo(bx2 + 14, y0); c.lineTo(bx2, y0); c.lineTo(bx2, y1); c.lineTo(bx2 + 14, y1); c.moveTo(bx2, (y0 + y1) / 2); c.lineTo(bx2 - 16, (y0 + y1) / 2); c.stroke();
          const s = "tidak dilaporkan", fs = 46; c.font = `800 ${fs}px ${K.FONT}`; const lw = c.measureText(s).width + fs, lh = fs * 1.6, lx = bx2 - 26 - lw, ly = (y0 + y1) / 2 - lh / 2;
          c.fillStyle = "#7A7E96"; H.rr(c, lx, ly, lw, lh, lh / 2); c.fill(); c.setLineDash([12, 8]); c.strokeStyle = "#E3E5EE"; c.lineWidth = 3; H.rr(c, lx + 5, ly + 5, lw - 10, lh - 10, lh / 2 - 5); c.stroke(); c.setLineDash([]);
          D.txt(c, s, lx + lw / 2, ly + lh / 2 + fs * 0.36, fs, { align: "center", color: "#FFFFFF" });
          c.restore();
        }
        // sumber kecil (tetap ≥40 px)
        const srcA = clamp((t - e.seribu) / 0.4);
        if (srcA > 0) { c.save(); c.globalAlpha *= srcA * 0.85; D.txt(c, "Sumber: IASC (OJK), Nov 2024–Jun 2026", 330, 866, 40, { weight: 700, color: P.ink2 }); c.restore(); }
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
  function officeScene(ctx, b, l, t, TL, e) {
    const ring = t < e.misal ? 1 : 0, ans = clamp((t - e.misal + 0.1) / 0.45);
    // kamera: dorong pelan + sedikit geser ke kartu saat pengungkapan
    const z = 1 + 0.05 * eio(l / 10), fx = 960, fy = 540;
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-fx, -fy);
    const set = LT.kantor(ctx, t, { ring: ring * (0.6 + 0.4 * Math.sin(t * 9) ** 2), phoneGlow: t < e.misal ? 1 : 0, phone: t < e.misal, px: Math.sin(t * 0.2) * 0.25, near: false });
    const A = set.anchors;
    // layar monitor: tampilan transfer setelah "meminta"
    const mon = A.monitor, mA = clamp((t - e.minta) / 0.35);
    if (mon) {
      const x0 = mon.x - mon.w / 2, y0 = mon.y - mon.h / 2;
      ctx.save(); ctx.beginPath(); H.rr(ctx, x0, y0, mon.w, mon.h, 6); ctx.clip();
      if (mA > 0) {
        ctx.globalAlpha *= mA; ctx.fillStyle = "#F4F6FF"; ctx.fillRect(x0, y0, mon.w, mon.h);
        ctx.fillStyle = "#5068C8"; ctx.fillRect(x0, y0, mon.w, 30); L.ikon(ctx, "bank", x0 + 22, y0 + 15, 20, "#FFFFFF");
        const blink = t > e.trf ? 0.65 + 0.35 * Math.sin(t * 10) : 1;
        ctx.fillStyle = D.hexA(P.red, blink); H.rr(ctx, mon.x - 95, y0 + mon.h - 56, 190, 44, 22); ctx.fill();
      }
      ctx.restore();
    }
    // pegawai duduk di kursi kantor, menghadap kiri (ke meja)
    const sit = A.sit || { x: 1468, y: 646 };
    const emp = O.draw(ctx, sit.x + 8, 820, 440, Object.assign({}, PEGAWAI, { pose: ans > 0 ? "telepon" : "duduk", blend: ans > 0 && ans < 1 ? { to: "telepon", k: eio(ans) } : undefined, duduk: true, kursi: false, flip: true, t,
      face: t > e.trf ? "netral" : ans > 0 ? "netral" : "bingung", look: ans > 0 ? [-0.6, 0] : [-1, 0.1], layar: tinyCall }));
    if (ring) { const s = A.phoneScreen || A.phone; arcs(ctx, s.x, s.y - 10, 50, t, P.teal, 1, 1); arcs(ctx, s.x, s.y - 10, 50, t, P.teal, 1, -1); }
    LT.depan(ctx, "kantor", t, { px: Math.sin(t * 0.2) * 0.25 });
    ctx.restore();

    // ---------- kartu penelepon + spektrogram (ruang layar) ----------
    const CC = { x: 470, y: 250, w: 600, h: 230 }, inA = clamp(l / 0.4);
    const flip = eio((t - e.atasan + 0.1) / 0.6), glit = win(t, e.tiru4 - 0.05, e.atasan + 0.2, 0.1, 0.2) * (0.6 + 0.4 * Math.sin(t * 40));
    const shake = ring ? Math.sin(t * 40) * 3 : 0;
    const card = callCard(ctx, CC.x + shake, CC.y, CC.w, CC.h, t, true, flip, glit);
    // garis sinyal dari kartu ke telinga pegawai
    const hd = emp && emp.head ? emp.head : [1440, 452], ear = [960 + (hd[0] - fx) * z, 540 + (hd[1] - fy) * z], sigA = Math.max(ring * 0.5, ans);
    ctx.save(); ctx.globalAlpha *= sigA * inA; ctx.strokeStyle = card.back ? P.red : P.teal; ctx.lineWidth = 6; ctx.setLineDash([3, 16]); ctx.lineDashOffset = -t * 60; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(CC.x + CC.w / 2 + 10, CC.y); ctx.quadraticCurveTo(1150, 160, ear[0] - 40, ear[1] - 50); ctx.stroke(); ctx.restore();
    // spektrogram suara (motif sidik jari suara): "suara atasan" yang ternyata tiruan
    const spA = clamp((t - e.tiru4 + 0.1) / 0.4);
    if (spA > 0) {
      const SX = CC.x - CC.w / 2, SY = CC.y + CC.h / 2 + 70;
      ctx.save(); ctx.globalAlpha *= spA; ctx.fillStyle = "rgba(10,14,50,0.6)"; H.rr(ctx, SX - 12, SY - 12, CC.w + 24, 164, 18); ctx.fill();
      L.spektrogram(ctx, SX, SY, CC.w, 140, { profil: ATASAN, dur: 3.2, scroll: t * 0.8, reveal: clamp((t - e.tiru4) / 0.9), frame: true, aksen: P.pink, r: 12, telepon: 0.6 });
      ctx.restore();
    }
    // uang terbang dari layar transfer ke kartu pelaku
    const mny = clamp((t - e.trf + 0.05) / 0.3);
    if (mny > 0) for (let i = 0; i < 7; i++) {
      const ph = (t - e.trf - i * 0.22); if (ph < 0) continue; const u = (ph % 1.1) / 1.1, sx0 = 960 + (860 - fx) * z, sy0 = 540 + (433 - fy) * z;
      const [x, y] = qpt([sx0, sy0], [860, 90], [CC.x + CC.w / 2 - 70, CC.y + 10], eio(u));
      ctx.save(); ctx.globalAlpha *= Math.sin(Math.PI * u) * mny; B.ikon(ctx, "uang", x, y, lerp(38, 22, u) + 8 * Math.sin(Math.PI * u), { color: P.green }); ctx.restore();
    }
    // Bip: menunjuk pelaku, kaget saat transfer
    const bpose = t >= e.trf - 0.05 ? { pose: "kaget", k: t - e.trf + 0.05, mood: "wow" } : t >= e.atasan + 0.2 ? { pose: "tunjuk", target: [card.ax, card.ay], mood: "wow" } : { pose: "diam", mood: "think", look: [1, -0.5] };
    B.draw(ctx, 215, 815, 160, Object.assign({ t, seed: 2 }, bpose));

    const endA = 1 - clamp((l - D.speechEnd(b) - 0.3) / 0.3);   // label hilang di bawah kartu bab berikutnya
    D.post(c => {
      if (endA <= 0) return;
      c.save(); c.globalAlpha *= inA * endA;
      const k = card.k, nm = card.back ? "Pelaku" : "Pak Direktur", sub = card.back ? "meniru atasan" : (t < e.misal ? "memanggil…" : "tersambung");
      c.save(); c.translate(CC.x, CC.y); c.scale(Math.max(0.02, k), 1);
      D.txt(c, nm, -CC.w / 2 + CC.h * 0.86, -8, 54, { color: "#FFFFFF", weight: 900 });
      D.txt(c, sub, -CC.w / 2 + CC.h * 0.86, 50, 42, { color: card.back ? "#FFB3B8" : P.ink2, weight: 700 });
      c.restore();
      const tA = clamp((t - e.atasan + 0.05) / 0.3) * (1 - clamp((t - e.atasan - 0.25) / 0.3));
      const lbl = flip < 0.5 ? "suara atasan?" : "suara tiruan";
      if (spA > 0) { c.save(); c.globalAlpha *= spA; PT.tag(c, lbl, CC.x, CC.y + CC.h / 2 + 262, { size: 46, color: P.pink }); c.restore(); }
      const rA = clamp((t - e.trf + 0.05) / 0.3);
      if (rA > 0) { c.save(); c.globalAlpha *= rA; PT.tag(c, "transfer uang", 1060, 640, { size: 48, color: P.red, scale: lerp(0.9, 1, Math.min(1, pop(t, e.trf - 0.05))) }); c.restore(); }
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
      r(e.warga - 0.3, "whoosh", 0.45),         // kamera menukik ke Kalbar
      r(e.memp, "pop", 0.7),                    // penanda + avatar warga
      r(e.polisi, "pop", 0.5),                  // lencana polisi
      r(e.pgl - 0.5, "whoosh", 0.6),            // gelembung panggilan video terbang
      r(e.pgl + 0.8, "shimmer", 0.55),          // HP besar tumbuh
      r(e.tiru, "clack", 0.45),                 // kedip glitch "meniru"
      r(e.hub, "pop", 0.45),                    // tombol telepon Bibi ditekan
      r(e.asli - 0.05, "shimmer", 0.5),         // kartu nomor asli + Bibi asli muncul
      r(e.nomor2 - 0.1, "pop", 0.5),            // kartu nomor pelaku keluar dari HP
      r(e.beda, "boom", 0.8),                   // pelaku terungkap + Bip kaget
      r(e.b5_3 - 0.5, "whoosh", 0.6),           // kamera mundur ke seluruh Indonesia
      r(e.iasc, "pop", 0.6),                    // gedung IASC
      r(e.ratusE, "riser", 0.55),               // hitungan 1.300 selesai
      r(e.ratusE, "pop", 0.7),
      r(e.setengah, "pop", 0.5),                // ±1,5 tahun
      r(e.besar + 0.2, "clack", 0.6),           // map abu-abu jatuh
      r(e.b5_4 + 0.1, "pop", 0.5),              // telepon kantor berdering
      r(e.atasan, "whoosh", 0.55),              // kartu penelepon berbalik
      r(e.trf, "boom", 0.7),                    // uang terkirim
    ].filter(x => x && isFinite(x[0]));
  };
})(typeof window !== "undefined" ? window : globalThis);
