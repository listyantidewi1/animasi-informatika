/* dokkit/peta.js — peta Indonesia dari titik-titik (dot-matrix ala Kurzgesagt) untuk dokumenter D03, plus rute panggilan dan "peta media sosial".
   Poligon lon/lat disederhanakan (cukup akurat untuk dikenali sekilas). Wilayah Indonesia = warna penuh; Malaysia (Semenanjung,
   Sarawak, Sabah, Brunei), Timor-Leste, dan Papua Nugini = titik redup (alfa 0,45, jari-jari x0,8, tanpa bayangan).
   API (ringkas; rincian di showcase dan di ringkasan untuk penulis adegan):
     K.kit.peta.indonesia(ctx, cx, cy, w, opt) -> project(lon, lat) => [x, y]
         project.k (px per derajat), .x0 .y0 .w .h (kotak peta), .step (jarak titik yang dipakai), .r (jari-jari titik),
         .snap(lon, lat) => [x, y] di titik daratan terdekat, .markers = [[x, y], ...] posisi penanda highlight (sudah di-snap)
       opt: t, step (derajat; bawaan otomatis dari zoom: jarak titik ±11 px, maks 0.3), dot (jari-jari px), color, dimColor, alpha, reveal (0..1 barat→timur),
            base (alfa siluet; bawaan 0.1, naik ke 0.18 saat zoom), sea, neighbours, shimmer, shadow, bounds, view [x0,y0,x1,y1] (culling; bawaan kanvas),
            highlight: [{at:"mempawah" | lon, lat, label, color, dx, dy, size, t0, area (radius derajat), region ("kalbar" | [lon,lat,...]),
                         spread (derajat/detik, bila t0), scale, style:"ring"|"pin", snap (bawaan true)}]
     K.kit.peta.proj(cx, cy, w, opt) -> project tanpa menggambar.
     K.kit.peta.marker(ctx, x, y, s, opt) -> penanda (ring/pin + label terang) di titik layar.
     K.kit.peta.tag(ctx, text, x, y, opt) -> pil label terang (krem, teks navy, titik warna).
     K.kit.peta.route(ctx, from, to, opt) -> busur putus-putus dari luar layar + gelembung panggilan video yang berjalan.
     K.kit.peta.sosial(ctx, cx, cy, s, opt) -> peta lingkungan tampak atas dengan ikon video/live/voice berkelip dan gembok.
     K.kit.peta.ANCHORS: { mempawah: [109.0, 0.36], jakarta: [106.85, -6.21], arabSaudi: [46.7, 24.7], ... }  */
(function (g) {
  const K = g.Kiko, D = K.dok, P = D.P, TAU = Math.PI * 2;
  K.kit = K.kit || {};
  const WW = D.W || 1920, HH = D.HH || 1080, NAVY = "#1B2560", CREAM = "#FFF6E6";

  // ---------- warna ----------
  const _hc = {};
  function hx(c) { let v = _hc[c]; if (!v) { const n = parseInt(c.slice(1), 16); v = _hc[c] = [n >> 16 & 255, n >> 8 & 255, n & 255]; } return v; }
  const _mc = {};
  function mix(a, b, u) {
    u = D.clamp(u); const key = a + b + (u * 1000 | 0); let r = _mc[key]; if (r) return r;
    const A = hx(a), B = hx(b); r = "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join(""); _mc[key] = r; return r;
  }
  const backOut = u => { const c = 1.9, v = u - 1; return 1 + (c + 1) * v * v * v + c * v * v; };

  // ---------- titik penting ----------
  // mempawah sedikit ke darat dari pantai (108.96) supaya penanda tidak jatuh di laut; penanda tetap di-snap ke titik daratan terdekat
  const ANCHORS = {
    mempawah: [109.0, 0.36], pontianak: [109.33, -0.03], jakarta: [106.85, -6.21], bandung: [107.61, -6.91], semarang: [110.42, -6.97],
    yogyakarta: [110.37, -7.80], surabaya: [112.75, -7.25], medan: [98.67, 3.59], padang: [100.35, -0.95], palembang: [104.75, -2.98],
    denpasar: [115.22, -8.65], mataram: [116.12, -8.58], kupang: [123.60, -10.17], makassar: [119.48, -5.14], manado: [124.84, 1.47],
    balikpapan: [116.85, -1.24], banjarmasin: [114.59, -3.32], ambon: [128.18, -3.70], ternate: [127.37, 0.79], jayapura: [140.70, -2.53],
    bandaAceh: [95.32, 5.55], merauke: [140.40, -8.49],
    arabSaudi: [46.7, 24.7]   // Riyadh; di luar BOUNDS, dipakai sebagai titik asal route() (project() memberi titik di luar layar kiri atas)
  };
  const BOUNDS = [94.6, 151.0, -11.1, 7.3];
  // wilayah (provinsi) kasar untuk highlight.region: titik di dalamnya diwarnai
  const REGIONS = {
    kalbar: [108.7,2.2, 109.65,2.08, 109.65,1.6, 110.3,1.05, 111.0,1.0, 111.8,1.2, 112.5,1.45, 113.5,1.3, 114.2,1.5, 114.2,0.9, 113.8,0.2, 113.0,-0.4, 112.1,-0.9, 111.2,-1.6, 110.95,-3.2, 109.5,-3.3, 108.5,-1.0]
  };

  // ---------- garis batas negara ----------
  const BORNEO_BORDER = [[109.6, 2.08], [109.65, 1.6], [110.3, 1.05], [111.0, 1.0], [111.8, 1.2], [112.5, 1.45], [113.5, 1.3], [114.2, 1.5], [114.6, 2.0], [115.1, 2.6], [115.5, 3.4], [115.6, 4.0], [116.1, 4.35], [117.6, 4.17], [119.6, 4.17]];
  function borderLat(lon) {
    const b = BORNEO_BORDER; if (lon <= b[0][0]) return b[0][1];
    for (let i = 1; i < b.length; i++) if (lon <= b[i][0]) { const u = (lon - b[i - 1][0]) / (b[i][0] - b[i - 1][0]); return b[i - 1][1] + (b[i][1] - b[i - 1][1]) * u; }
    return b[b.length - 1][1];
  }
  const TONE = {
    id: () => 0, nb: () => 1,
    borneo: (lon, lat) => (lat > borderLat(lon) ? 1 : 0),
    timor: (lon, lat) => ((lon > 124.95 + (-8.97 - lat) / 0.51 * 0.18) || (lon > 124.05 && lon < 124.45 && lat > -9.42) ? 1 : 0),   // Timor-Leste + Oecusse
    guinea: lon => (lon > 141.0 ? 1 : 0)
  };
  // poligon "bagian Indonesia" untuk memotong siluet pulau campuran (sama dengan fungsi TONE di atas); beberapa cincin = evenodd
  const ID_CLIP = {
    borneo: [[107.5, 2.08].concat(...BORNEO_BORDER, [119.6, -5, 107.5, -5])],
    timor: [[122, -8.3, 124.71, -8.3, 125.53, -10.6, 122, -10.6], [124.05, -8.9, 124.45, -8.9, 124.45, -9.42, 124.05, -9.42]],
    guinea: [[128, 1, 141, 1, 141, -11, 128, -11]]
  };

  // ---------- poligon [nama, tone, [lon,lat, lon,lat, ...]] ----------
  const POLY = [
    ["Sumatra", "id", [95.2,5.55, 95.6,5.6, 96.1,5.3, 96.9,5.25, 97.5,5.2, 97.95,4.6, 98.3,4.1, 98.75,3.75, 99.4,3.3, 99.9,2.95, 100.3,2.5, 100.7,2.1, 101.3,1.75, 101.8,1.65, 102.2,1.4,
      102.6,1.0, 103.0,0.6, 103.5,0.15, 103.8,-0.6, 104.4,-1.05, 104.5,-1.6, 104.9,-2.2, 105.4,-2.5, 105.8,-3.2, 105.9,-4.0, 105.85,-4.8, 105.85,-5.8, 105.6,-5.85, 105.3,-5.5,
      105.1,-5.75, 104.75,-5.55, 104.6,-5.9, 104.3,-5.6, 103.9,-5.2, 103.4,-4.75, 102.9,-4.2, 102.3,-3.8, 101.8,-3.3, 101.3,-2.8, 100.85,-2.1, 100.55,-1.4, 100.35,-0.95,
      100.0,-0.4, 99.5,0.1, 99.15,0.5, 98.95,1.2, 98.75,1.75, 98.3,2.05, 97.75,2.3, 97.3,3.1, 96.85,3.65, 96.3,4.05, 95.8,4.5, 95.4,5.0, 95.2,5.4]],
    ["Simeulue", "id", [95.8,2.75, 96.2,2.7, 96.45,2.4, 96.0,2.5]],
    ["Nias", "id", [97.1,1.45, 97.4,1.3, 97.85,0.95, 97.75,0.6, 97.4,0.85, 97.05,1.2]],
    ["Siberut", "id", [98.6,-1.05, 99.0,-1.2, 99.3,-1.65, 98.9,-1.7, 98.55,-1.35]],
    ["Pagai", "id", [99.5,-2.0, 99.8,-2.3, 100.4,-2.8, 100.45,-3.25, 100.15,-3.2, 99.55,-2.35]],
    ["Enggano", "id", [102.1,-5.3, 102.45,-5.33, 102.4,-5.5, 102.1,-5.5]],
    ["Bangka", "id", [105.15,-2.0, 105.6,-1.6, 105.85,-1.5, 106.1,-1.85, 106.15,-2.15, 106.75,-2.5, 106.8,-2.95, 106.5,-3.05, 106.0,-2.75, 105.7,-2.4, 105.35,-2.3]],
    ["Belitung", "id", [107.55,-2.6, 107.95,-2.5, 108.3,-2.75, 108.25,-3.15, 107.8,-3.2, 107.6,-3.0]],
    ["Batam", "id", [103.9,1.2, 104.15,1.15, 104.1,0.95, 103.92,1.0]],
    ["Bintan", "id", [104.3,1.15, 104.65,1.15, 104.65,0.9, 104.35,0.85]],
    ["Karimun", "id", [103.35,1.1, 103.5,1.1, 103.48,0.95, 103.35,0.97]],
    ["Lingga", "id", [104.4,0.0, 104.8,-0.1, 104.75,-0.3, 104.45,-0.25]],
    ["Singkep", "id", [104.35,-0.4, 104.6,-0.42, 104.55,-0.6, 104.35,-0.55]],
    ["Natuna", "id", [107.9,4.0, 108.3,4.3, 108.4,3.85, 108.1,3.65]],
    ["Anambas", "id", [106.15,3.3, 106.3,3.3, 106.3,3.1, 106.15,3.1]],
    ["Jawa", "id", [105.2,-6.75, 105.5,-6.6, 105.8,-6.4, 105.85,-6.05, 106.05,-5.9, 106.4,-6.0, 106.8,-6.08, 107.0,-6.0, 107.4,-5.95, 107.8,-6.15, 108.15,-6.25, 108.35,-6.22,
      108.55,-6.7, 109.1,-6.83, 109.7,-6.85, 110.2,-6.9, 110.45,-6.95, 110.65,-6.6, 110.9,-6.4, 111.15,-6.6, 111.45,-6.7, 112.05,-6.85, 112.55,-6.95, 112.7,-7.2, 112.85,-7.55,
      113.3,-7.72, 113.9,-7.7, 114.4,-7.8, 114.4,-8.2, 114.6,-8.7, 114.2,-8.6, 113.6,-8.4, 113.2,-8.3, 112.7,-8.4, 112.1,-8.35, 111.5,-8.3, 111.05,-8.22, 110.5,-8.1,
      110.0,-7.9, 109.4,-7.75, 109.0,-7.72, 108.6,-7.7, 108.0,-7.75, 107.4,-7.5, 106.9,-7.4, 106.4,-7.35, 106.4,-7.0, 106.2,-6.93, 105.85,-6.85, 105.45,-6.85]],
    ["Madura", "id", [112.7,-6.9, 113.2,-6.88, 113.9,-6.9, 114.1,-7.0, 113.8,-7.15, 113.2,-7.22, 112.75,-7.2]],
    ["Bawean", "id", [112.55,-5.72, 112.75,-5.72, 112.75,-5.88, 112.55,-5.88]],
    ["Karimunjawa", "id", [110.35,-5.78, 110.5,-5.78, 110.5,-5.9, 110.35,-5.9]],
    ["Kangean", "id", [115.2,-6.9, 115.55,-6.85, 115.5,-7.0, 115.2,-7.0]],
    ["Bali", "id", [114.43,-8.1, 114.8,-8.15, 115.1,-8.07, 115.4,-8.15, 115.7,-8.35, 115.5,-8.6, 115.25,-8.73, 115.2,-8.85, 115.08,-8.75, 114.85,-8.5, 114.55,-8.4]],
    ["Lombok", "id", [115.85,-8.75, 116.05,-8.35, 116.4,-8.2, 116.7,-8.35, 116.6,-8.9, 116.2,-8.9, 115.85,-8.85]],
    ["Sumbawa", "id", [116.78,-8.8, 116.9,-8.5, 117.2,-8.38, 117.55,-8.42, 117.7,-8.65, 117.95,-8.72, 118.05,-8.55, 117.85,-8.35, 118.0,-8.1, 118.3,-8.15, 118.4,-8.45, 118.65,-8.4,
      118.75,-8.25, 119.05,-8.25, 119.15,-8.65, 118.9,-8.75, 118.5,-8.9, 118.0,-8.9, 117.6,-9.05, 117.1,-9.05, 116.8,-9.0]],
    ["Komodo", "id", [119.4,-8.5, 119.55,-8.5, 119.55,-8.75, 119.4,-8.75]],
    ["Flores", "id", [119.8,-8.5, 120.1,-8.35, 120.6,-8.3, 121.2,-8.45, 121.7,-8.5, 122.3,-8.6, 122.9,-8.25, 123.0,-8.4, 122.8,-8.6, 122.5,-8.75, 121.8,-8.9, 121.0,-8.95, 120.5,-8.85, 120.0,-8.8]],
    ["Adonara", "id", [123.05,-8.25, 123.45,-8.25, 123.45,-8.42, 123.05,-8.42]],
    ["Lembata", "id", [123.25,-8.2, 123.9,-8.25, 123.75,-8.55, 123.35,-8.5]],
    ["Pantar", "id", [124.0,-8.2, 124.25,-8.3, 124.15,-8.55, 124.0,-8.45]],
    ["Alor", "id", [124.3,-8.15, 125.1,-8.15, 125.0,-8.4, 124.4,-8.4]],
    ["Wetar", "id", [125.8,-7.65, 126.8,-7.55, 126.7,-7.9, 125.95,-7.9]],
    ["Sumba", "id", [118.95,-9.55, 119.3,-9.3, 119.9,-9.3, 120.3,-9.5, 120.85,-9.95, 120.65,-10.3, 120.1,-10.25, 119.6,-9.85, 119.1,-9.75]],
    ["Sawu", "id", [121.75,-10.45, 122.0,-10.45, 122.0,-10.6, 121.75,-10.6]],
    ["Rote", "id", [122.85,-10.75, 123.4,-10.6, 123.3,-10.85, 122.9,-10.9]],
    ["Timor", "timor", [123.45,-10.35, 123.75,-10.05, 124.3,-9.6, 124.85,-9.0, 125.57,-8.55, 126.5,-8.45, 127.3,-8.4, 127.0,-8.65, 126.2,-8.95, 125.2,-9.45, 124.6,-9.95, 124.0,-10.35, 123.6,-10.42]],
    ["Kalimantan", "borneo", [109.65,2.05, 109.3,1.75, 109.05,1.2, 108.95,0.75, 108.9,0.35, 109.05,0.0, 109.25,-0.4, 109.6,-1.0, 109.95,-1.4, 110.0,-1.9, 110.1,-2.4, 110.25,-2.95,
      110.7,-3.0, 111.2,-2.95, 111.75,-2.85, 111.8,-3.5, 112.3,-3.4, 112.7,-3.35, 113.1,-3.2, 113.6,-3.45, 114.2,-3.4, 114.55,-3.5, 114.6,-4.15, 115.1,-4.0, 115.95,-3.65,
      116.05,-3.3, 116.1,-2.6, 116.4,-2.2, 116.5,-1.6, 116.85,-1.3, 117.1,-1.15, 117.45,-0.85, 117.65,-0.45, 117.5,0.15, 117.6,0.6, 118.1,0.85, 118.95,1.0, 118.7,1.3,
      118.1,1.7, 117.9,2.1, 117.75,2.7, 117.55,3.3, 117.65,3.9, 117.75,4.2, 118.3,4.35, 118.55,4.5, 118.2,4.9, 118.7,5.0, 119.25,5.15, 118.85,5.5, 118.2,5.8, 117.65,6.3,
      117.3,6.6, 116.85,6.95, 116.5,6.5, 116.1,6.0, 115.6,5.5, 115.3,5.0, 114.9,4.95, 114.5,4.65, 114.0,4.45, 113.5,3.9, 113.05,3.2, 112.4,3.0, 111.6,2.6, 111.2,2.1,
      110.6,1.75, 110.2,1.75, 109.85,1.75]],
    ["Laut", "id", [116.0,-3.05, 116.3,-3.0, 116.3,-3.6, 116.1,-4.0, 115.95,-3.7]],
    ["Sulawesi", "id", [125.2,1.65, 124.85,1.55, 124.55,1.25, 124.2,1.0, 123.6,0.9, 123.0,0.92, 122.5,0.98, 122.0,1.0, 121.5,1.15, 121.0,1.2, 120.7,1.1, 120.4,1.0,
      120.1,0.75, 119.85,0.3, 119.75,-0.3, 119.85,-0.75, 119.6,-1.0, 119.4,-1.3, 119.3,-1.9, 119.1,-2.4, 118.85,-2.7, 118.85,-3.2, 118.95,-3.5, 119.35,-3.45, 119.55,-3.7,
      119.6,-4.2, 119.55,-4.6, 119.45,-5.1, 119.4,-5.55, 119.8,-5.7, 120.3,-5.6, 120.45,-5.5, 120.3,-5.1, 120.35,-4.6, 120.4,-4.0, 120.35,-3.4, 120.25,-2.95, 120.6,-2.75,
      121.05,-2.65, 121.3,-3.3, 121.55,-3.9, 121.6,-4.4, 121.75,-4.8, 122.1,-4.85, 122.35,-4.6, 122.55,-4.3, 122.75,-4.0, 122.6,-3.6, 122.4,-3.45, 122.3,-3.1, 122.05,-2.7,
      121.75,-2.3, 121.4,-1.95, 121.8,-1.7, 122.2,-1.6, 122.7,-1.35, 123.05,-1.15, 123.45,-0.95, 123.3,-0.75, 122.9,-0.8, 122.4,-0.8, 121.9,-0.9, 121.4,-0.95, 120.9,-1.3,
      120.6,-1.35, 120.3,-1.0, 120.15,-0.6, 120.15,-0.1, 120.3,0.3, 120.6,0.48, 121.1,0.45, 121.7,0.45, 122.3,0.5, 123.0,0.45, 123.5,0.35, 124.0,0.38, 124.5,0.5, 124.85,0.9,
      125.1,1.2, 125.25,1.45]],
    ["Selayar", "id", [120.42,-5.8, 120.55,-5.85, 120.55,-6.45, 120.42,-6.4]],
    ["Muna", "id", [122.35,-4.6, 122.75,-4.75, 122.7,-5.3, 122.35,-5.2]],
    ["Buton", "id", [122.85,-4.45, 123.2,-4.75, 123.1,-5.4, 122.8,-5.7, 122.75,-5.2]],
    ["Kabaena", "id", [121.8,-5.15, 122.05,-5.15, 122.05,-5.35, 121.8,-5.35]],
    ["Peleng", "id", [122.75,-1.3, 123.4,-1.15, 123.5,-1.45, 122.9,-1.55]],
    ["Togean", "id", [121.6,-0.35, 122.3,-0.3, 122.3,-0.45, 121.6,-0.48]],
    ["Sangihe", "id", [125.4,3.65, 125.62,3.6, 125.55,3.3, 125.42,3.35]],
    ["Talaud", "id", [126.65,4.3, 126.9,4.1, 126.8,3.85, 126.65,4.0]],
    ["Halmahera", "id", [127.95,2.25, 128.15,2.0, 128.15,1.65, 128.08,1.4, 128.3,1.32, 128.55,1.55, 128.8,1.68, 128.85,1.42, 128.6,1.18, 128.3,1.02, 128.2,0.88,
      128.45,0.9, 128.75,0.98, 128.98,0.82, 128.85,0.55, 128.5,0.45, 128.15,0.38, 128.05,0.2, 128.2,-0.1, 128.3,-0.5, 128.1,-0.88, 127.85,-0.62, 127.72,-0.2,
      127.68,0.2, 127.52,0.55, 127.42,0.95, 127.5,1.25, 127.68,1.45, 127.75,1.8, 127.8,2.1]],
    ["Morotai", "id", [128.2,2.25, 128.45,2.6, 128.7,2.4, 128.55,2.05, 128.3,2.0]],
    ["Bacan", "id", [127.4,-0.4, 127.7,-0.55, 127.6,-0.85, 127.35,-0.7]],
    ["Obi", "id", [127.3,-1.4, 127.8,-1.35, 127.7,-1.7, 127.35,-1.65]],
    ["Taliabu", "id", [124.3,-1.75, 125.3,-1.8, 125.25,-1.97, 124.35,-1.95]],
    ["Mangole", "id", [125.4,-1.82, 126.3,-1.8, 126.2,-1.97, 125.4,-2.0]],
    ["Sanana", "id", [125.9,-2.05, 126.15,-2.1, 126.0,-2.3]],
    ["Buru", "id", [126.0,-3.2, 126.3,-3.05, 126.9,-3.05, 127.25,-3.4, 127.0,-3.7, 126.6,-3.85, 126.1,-3.6]],
    ["Seram", "id", [127.9,-3.2, 128.3,-2.85, 128.9,-2.85, 129.5,-2.8, 130.2,-3.0, 130.85,-3.3, 130.8,-3.55, 130.2,-3.55, 129.6,-3.45, 129.0,-3.35, 128.6,-3.45, 128.2,-3.55, 127.9,-3.4]],
    ["Ambon", "id", [127.98,-3.58, 128.35,-3.6, 128.3,-3.8, 128.0,-3.78]],
    ["Kei", "id", [132.95,-5.3, 133.2,-5.5, 133.15,-6.0, 133.0,-5.8]],
    ["KeiKecil", "id", [132.6,-5.55, 132.82,-5.6, 132.75,-5.9, 132.6,-5.8]],
    ["Aru", "id", [134.15,-5.5, 134.6,-5.4, 134.8,-6.2, 134.6,-6.9, 134.2,-6.6, 134.1,-6.0]],
    ["Yamdena", "id", [131.6,-7.1, 131.75,-7.35, 131.3,-8.0, 131.05,-8.2, 130.95,-8.0, 131.35,-7.4]],
    ["Babar", "id", [129.65,-7.85, 129.9,-7.85, 129.9,-8.05, 129.65,-8.05]],
    ["Waigeo", "id", [130.4,-0.2, 130.9,0.0, 131.3,-0.1, 131.0,-0.4, 130.5,-0.45]],
    ["Salawati", "id", [130.7,-0.9, 131.2,-0.9, 131.1,-1.3, 130.7,-1.2]],
    ["Misool", "id", [129.7,-1.85, 130.1,-1.75, 130.4,-1.95, 130.0,-2.15]],
    ["Biak", "id", [135.8,-0.9, 136.2,-0.95, 136.15,-1.2, 135.85,-1.15]],
    ["Yapen", "id", [135.4,-1.65, 136.2,-1.65, 136.9,-1.75, 136.3,-1.95, 135.5,-1.85]],
    ["Papua", "guinea", [130.95,-1.05, 131.25,-0.8, 131.7,-0.6, 132.25,-0.35, 132.8,-0.4, 133.4,-0.7, 134.0,-0.85, 134.1,-1.3, 134.2,-1.8, 134.35,-2.4, 134.5,-2.9,
      134.8,-3.3, 135.3,-3.4, 135.6,-3.3, 136.0,-2.75, 136.4,-2.3, 137.0,-1.75, 137.6,-1.45, 138.2,-1.6, 138.8,-1.9, 139.5,-2.25, 140.2,-2.4, 140.75,-2.55, 141.0,-2.6,
      141.9,-2.95, 142.8,-3.3, 143.6,-3.55, 144.5,-3.85, 145.0,-4.4, 145.8,-5.0, 145.8,-5.5, 146.5,-5.9, 147.4,-6.0, 147.8,-6.3, 147.85,-6.7, 147.1,-6.75, 147.1,-7.1,
      147.6,-7.75, 148.3,-8.5, 149.2,-9.0, 149.4,-9.6, 150.0,-9.7, 150.85,-10.2, 150.3,-10.65, 149.7,-10.35, 148.7,-10.15, 147.9,-10.1, 147.15,-9.5, 146.7,-8.95,
      146.2,-8.4, 145.8,-7.95, 145.0,-7.75, 144.4,-7.6, 143.9,-7.95, 143.6,-8.5, 143.2,-9.05, 142.6,-9.3, 141.9,-9.2, 141.0,-9.1, 140.5,-8.65, 140.0,-8.1, 139.2,-8.1,
      138.85,-8.35, 138.0,-8.4, 137.9,-7.6, 138.3,-7.0, 138.0,-6.2, 137.6,-5.4, 137.0,-4.95, 136.3,-4.6, 135.5,-4.4, 134.8,-4.1, 134.2,-3.95, 133.75,-3.65, 133.3,-4.05,
      132.9,-4.0, 132.75,-3.6, 132.3,-3.15, 131.95,-2.9, 132.3,-2.7, 132.8,-2.75, 133.3,-2.5, 133.65,-2.3, 133.3,-2.15, 132.6,-2.25, 132.2,-2.15, 131.9,-1.65, 131.5,-1.5,
      131.25,-1.35]],
    ["Malaya", "nb", [100.1,6.55, 100.35,5.6, 100.35,5.0, 100.6,4.2, 100.85,3.85, 101.3,3.0, 101.8,2.5, 102.5,2.0, 103.2,1.6, 103.5,1.35, 104.25,1.4, 104.2,1.9, 103.8,2.6,
      103.45,3.6, 103.4,4.3, 103.1,5.1, 102.55,5.9, 102.1,6.25, 101.5,6.6, 100.9,6.5]]
  ];
  POLY.forEach(p => { const a = p[2]; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (let i = 0; i < a.length; i += 2) { x0 = Math.min(x0, a[i]); x1 = Math.max(x1, a[i]); y0 = Math.min(y0, a[i + 1]); y1 = Math.max(y1, a[i + 1]); } p.push([x0, x1, y0, y1]); });

  function inside(a, x, y) {
    let c = false; for (let i = 0, j = a.length - 2; i < a.length; j = i, i += 2) {
      const xi = a[i], yi = a[i + 1], xj = a[j], yj = a[j + 1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    } return c;
  }

  // ---------- grid titik (cache per step) ----------
  const STEPS = [0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.42];
  function autoStep(k) {   // jarak titik ±11 px di layar, maks 0.3° (peta penuh); peta sangat kecil memakai 0.42°
    if (k * 0.3 < 4) return 0.42;
    const want = D.clamp(11 / k, 0.08, 0.3); let best = STEPS[0];
    for (const s of STEPS) if (Math.abs(Math.log(s / want)) < Math.abs(Math.log(best / want))) best = s;
    return best;
  }
  const CACHE = {};
  function grid(step) {
    const key = step.toFixed(4); if (CACHE[key]) return CACHE[key];
    const r = D.rng(2026), dots = [], dy = step * 0.866, [W0, E0, S0, N0] = BOUNDS;
    const counts = POLY.map(() => 0);
    for (let j = 0; N0 - j * dy >= S0; j++) {
      const lat = N0 - j * dy, off = (j % 2) * 0.5;
      for (let i = 0; W0 + (i + off) * step <= E0; i++) {
        const lon = W0 + (i + off) * step;
        for (let q = 0; q < POLY.length; q++) {
          const p = POLY[q], b = p[3]; if (lon < b[0] || lon > b[1] || lat < b[2] || lat > b[3]) continue;
          if (inside(p[2], lon, lat)) { dots.push({ lon, lat, tone: TONE[p[1]](lon, lat), j: r(), poly: q }); counts[q]++; break; }
        }
      }
    }
    // pulau kecil yang tidak kena grid: satu titik di tengahnya
    POLY.forEach((p, q) => { if (counts[q]) return; const a = p[2]; let x = 0, y = 0; for (let i = 0; i < a.length; i += 2) { x += a[i]; y += a[i + 1]; } x /= a.length / 2; y /= a.length / 2;
      dots.push({ lon: x, lat: y, tone: TONE[p[1]](x, y), j: r(), poly: q, small: 1 }); });
    const sea = [];
    for (let j = 0; N0 - j * dy >= S0; j += 2) for (let i = 0; W0 + i * step <= E0; i += 2) sea.push([W0 + (i + (j % 4 ? 1 : 0)) * step, N0 - j * dy]);
    return (CACHE[key] = { key, step, dots, sea, reg: {}, regW: new WeakMap(), snap: {} });
  }
  // keanggotaan wilayah per titik: dihitung sekali per (grid, wilayah)
  function regFlags(G, reg, name) {
    let f = name ? G.reg[name] : G.regW.get(reg); if (f) return f;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (let i = 0; i < reg.length; i += 2) { x0 = Math.min(x0, reg[i]); x1 = Math.max(x1, reg[i]); y0 = Math.min(y0, reg[i + 1]); y1 = Math.max(y1, reg[i + 1]); }
    f = new Uint8Array(G.dots.length);
    G.dots.forEach((d, i) => { if (!d.tone && d.lon >= x0 && d.lon <= x1 && d.lat >= y0 && d.lat <= y1 && inside(reg, d.lon, d.lat)) f[i] = 1; });
    if (name) G.reg[name] = f; else G.regW.set(reg, f); return f;
  }
  // titik daratan Indonesia terdekat (supaya penanda tidak melayang di laut)
  function snapLL(G, lon, lat) {
    const key = lon + "," + lat; let s = G.snap[key]; if (s) return s;
    let best = null, bd = 1e9; for (const d of G.dots) { if (d.tone) continue; const dd = (d.lon - lon) ** 2 + (d.lat - lat) ** 2; if (dd < bd) { bd = dd; best = d; } }
    s = G.snap[key] = best && Math.sqrt(bd) < 1.5 ? [best.lon, best.lat] : [lon, lat]; return s;
  }

  function proj(cx, cy, w, opt = {}) {
    const B = opt.bounds || BOUNDS, k = w / (B[1] - B[0]), h = k * (B[3] - B[2]), lc = (B[0] + B[1]) / 2, la = (B[2] + B[3]) / 2;
    const project = (lon, lat) => [cx + (lon - lc) * k, cy - (lat - la) * k];
    project.k = k; project.w = w; project.h = h; project.x0 = cx - w / 2; project.y0 = cy - h / 2; project.bounds = B;
    project.unproject = (x, y) => [lc + (x - cx) / k, la - (y - cy) / k];
    return project;
  }

  // ---------- pil label terang ----------
  function tag(ctx, s, x, y, opt = {}) {
    const size = Math.max(40, opt.size || 44), col = opt.color || P.amber;
    ctx.save(); ctx.font = `800 ${size}px ${K.FONT}`; const tw = ctx.measureText(s).width, pw = tw + size * 1.55, ph = size * 1.6;
    if (opt.scale != null) { ctx.translate(x, y); ctx.scale(opt.scale, opt.scale); ctx.translate(-x, -y); }
    ctx.fillStyle = "rgba(12,20,60,0.26)"; K.helpers.rr(ctx, x - pw / 2, y - ph / 2 + 7, pw, ph, ph / 2); ctx.fill();
    ctx.fillStyle = opt.fill || CREAM; K.helpers.rr(ctx, x - pw / 2, y - ph / 2, pw, ph, ph / 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)"; K.helpers.rr(ctx, x - pw / 2 + ph * 0.3, y - ph / 2 + 3, pw - ph * 0.6, 3, 1.5); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x - pw / 2 + size * 0.62, y, size * 0.19, 0, TAU); ctx.fill();
    D.txt(ctx, s, x - pw / 2 + size * 1.05, y + size * 0.36, size, { color: opt.textColor || NAVY, weight: 800 });
    ctx.restore(); return { w: pw, h: ph };
  }
  function tagSize(ctx, s, size) { ctx.save(); ctx.font = `800 ${size}px ${K.FONT}`; const w = ctx.measureText(s).width + size * 1.55; ctx.restore(); return [w, size * 1.6]; }
  // letak label: geser horizontal ke dalam layar; bila keluar atas/bawah, balik arah dy, lalu jepit
  function placeLabel(x, y, dx, dy, pw, ph) {
    const M = 24; let lx = D.clamp(x + dx, pw / 2 + M, WW - pw / 2 - M), ly = y + dy;
    if (ly - ph / 2 < M || ly + ph / 2 > HH - M) { const l2 = y - dy; if (l2 - ph / 2 >= M && l2 + ph / 2 <= HH - M) ly = l2; }
    ly = D.clamp(ly, ph / 2 + M, HH - ph / 2 - M); return [lx, ly];
  }

  // ---------- penanda: cincin berdenyut / pin, dengan label dan garis penunjuk ----------
  function marker(ctx, x, y, s, opt = {}) {
    const t = opt.t || 0, col = opt.color || P.amber, a = opt.t0 == null ? 1 : D.clamp((t - opt.t0) / 0.35), sp = opt.t0 == null ? 1 : D.spring(t - opt.t0, 10, 0.5);
    if (a <= 0) return; s = s || 1;
    ctx.save(); ctx.globalAlpha *= a;
    D.glow(ctx, x, y, 70 * s, col, 0.45 + 0.15 * Math.sin(t * 3));
    if (opt.style === "pin") {
      const bob = Math.sin(t * 2.4) * 3 * s, R = 22 * s * sp, cy = y - 44 * s * sp + bob;
      ctx.fillStyle = "rgba(10,16,50,0.30)"; ctx.beginPath(); ctx.ellipse(x, y + 2, 14 * s * sp, 5 * s * sp, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = mix(col, NAVY, 0.25); ctx.beginPath(); ctx.arc(x, cy, R, Math.PI * 0.82, Math.PI * 0.18); ctx.lineTo(x, y + bob * 0.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x - R * 0.06, cy - R * 0.06, R * 0.94, Math.PI * 0.82, Math.PI * 0.18); ctx.lineTo(x - R * 0.05, y + bob * 0.3 - R * 0.12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.globalAlpha *= 0.95; ctx.beginPath(); ctx.arc(x, cy, R * 0.42, 0, TAU); ctx.fill();
      ctx.fillStyle = mix(col, "#FFFFFF", 0.55); ctx.beginPath(); ctx.arc(x - R * 0.42, cy - R * 0.45, R * 0.16, 0, TAU); ctx.fill();
    } else {
      for (let n = 0; n < 2; n++) {
        const u = ((t * 0.62 + n * 0.5) % 1), rr = (10 + 62 * D.eout(u)) * s;
        ctx.strokeStyle = D.hexA(col, (1 - u) * 0.9); ctx.lineWidth = (5 - 3 * u) * s; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.stroke();
      }
      ctx.fillStyle = mix(col, NAVY, 0.2); ctx.beginPath(); ctx.arc(x, y + 1.5 * s, 13 * s * sp, 0, TAU); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 12 * s * sp, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, 5 * s * sp, 0, TAU); ctx.fill();
    }
    if (opt.label) {
      const size = Math.max(40, opt.size || 44), [pw, ph] = tagSize(ctx, opt.label, size);
      const [lx, ly] = placeLabel(x, y, opt.dx == null ? 0 : opt.dx, opt.dy == null ? -130 : opt.dy, pw, ph);
      const la = D.clamp((t - (opt.t0 == null ? -9 : opt.t0) - 0.15) / 0.3), ls = opt.t0 == null ? 1 : D.spring(t - opt.t0 - 0.15, 10, 0.55);
      if (la > 0) {
        ctx.save(); ctx.globalAlpha *= la;
        // garis penunjuk: dari tepi penanda ke tepi label terdekat, berakhir dengan titik kecil
        const ex = D.clamp(x, lx - pw / 2 + ph / 2, lx + pw / 2 - ph / 2), ey = ly + (y > ly ? ph / 2 : -ph / 2);
        const pin = opt.style === "pin", oy = pin ? y - 44 * s : y, ang = Math.atan2(ey - oy, ex - x), r0 = (pin ? 26 : 20) * s, sx = x + Math.cos(ang) * r0, sy = oy + Math.sin(ang) * r0;
        const L = D.eout(la), qx = D.lerp(sx, ex, L), qy = D.lerp(sy, ey, L);
        ctx.strokeStyle = "rgba(12,20,60,0.25)"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx + 2, sy + 4); ctx.lineTo(qx + 2, qy + 4); ctx.stroke();
        ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(qx, qy); ctx.stroke();
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(qx, qy, 6.5, 0, TAU); ctx.fill();
        tag(ctx, opt.label, lx, ly, { size, color: col, fill: opt.fill, textColor: opt.textColor, scale: ls });
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // ---------- peta ----------
  function polyPath(project, a, path) { const p = path || new Path2D(); for (let i = 0; i < a.length; i += 2) { const [x, y] = project(a[i], a[i + 1]); i ? p.lineTo(x, y) : p.moveTo(x, y); } p.closePath(); return p; }
  function viewLL(ctx, project, opt, m) {   // kotak lon/lat yang terlihat (+ margin px), untuk culling
    let v = opt.view;
    if (!v) {
      v = [0, 0, WW, HH];
      try { const cv = ctx.canvas, T = ctx.getTransform().inverse(); const W_ = cv ? cv.width : WW, H_ = cv ? cv.height : HH; let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
        [[0, 0], [W_, 0], [0, H_], [W_, H_]].forEach(([x, y]) => { const X = T.a * x + T.c * y + T.e, Y = T.b * x + T.d * y + T.f; a = Math.min(a, X); b = Math.min(b, Y); c = Math.max(c, X); d = Math.max(d, Y); });
        if (isFinite(a) && isFinite(d)) v = [a, b, c, d]; } catch (e) { /* tanpa getTransform: pakai kanvas penuh */ }
    }
    const [l0, t0] = project.unproject(v[0] - m, v[1] - m), [l1, t1] = project.unproject(v[2] + m, v[3] + m);
    return [l0, l1, t1, t0];   // lonW, lonE, latS, latN
  }
  function indonesia(ctx, cx, cy, w, opt = {}) {
    const t = opt.t || 0, project = proj(cx, cy, w, opt), k = project.k;
    const step = opt.step || autoStep(k), G = grid(step);
    const col = opt.color || "#D3E2FF", dimCol = opt.dimColor || "#7486C2", alpha = opt.alpha == null ? 1 : opt.alpha;
    const rDot = opt.dot || Math.min(step * k * 0.37, 6), reveal = opt.reveal == null ? 1 : D.clamp(opt.reveal), band = 0.12;
    const shimmer = opt.shimmer !== false, nbOn = opt.neighbours !== false;
    const hl = (opt.highlight || []).map(h => {
      const at = h.at && ANCHORS[h.at], o = Object.assign({}, h, at ? { lon: at[0], lat: at[1] } : {});
      o.reg = typeof h.region === "string" ? REGIONS[h.region] : h.region; o.regKey = typeof h.region === "string" ? h.region : null;
      o.p = h.snap === false ? [o.lon, o.lat] : snapLL(G, o.lon, o.lat); return o;
    });
    project.step = step; project.r = rDot; project.snap = (lon, lat) => project(...snapLL(G, lon, lat)); project.markers = hl.map(h => project(h.p[0], h.p[1]));
    if (alpha <= 0) return project;
    ctx.save(); ctx.globalAlpha *= alpha;
    const [vW, vE, vS, vN] = viewLL(ctx, project, opt, rDot * 2.5 + 8);
    // titik laut samar
    if (opt.sea) { ctx.fillStyle = D.hexA(col, opt.sea); ctx.beginPath(); for (const [lo, la] of G.sea) { if (lo < vW || lo > vE || la < vS || la > vN) continue; const [x, y] = project(lo, la); ctx.moveTo(x + rDot * 0.35, y); ctx.arc(x, y, rDot * 0.35, 0, TAU); } ctx.fill(); }
    // siluet daratan samar (membantu pulau kecil dan garis pantai terbaca; lebih tebal saat zoom)
    const baseA = (opt.base == null ? D.lerp(0.1, 0.18, D.clamp((k - 30) / 30)) : opt.base) * D.clamp(reveal * 1.5 - 0.3);
    if (baseA > 0) POLY.forEach(p => {
      const b = p[3]; if (b[1] < vW || b[0] > vE || b[3] < vS || b[2] > vN) return;
      const tone = p[1]; if (tone === "nb" && !nbOn) return;
      const path = polyPath(project, p[2]);
      if (tone === "id" || tone === "nb") { ctx.fillStyle = D.hexA(tone === "nb" ? dimCol : col, baseA * (tone === "nb" ? 0.5 : 1)); ctx.fill(path); return; }
      const clip = new Path2D(); ID_CLIP[tone].forEach(r => polyPath(project, r, clip));
      ctx.save(); ctx.clip(clip, "evenodd"); ctx.fillStyle = D.hexA(col, baseA); ctx.fill(path); ctx.restore();
      if (nbOn) { const inv = new Path2D(); inv.rect(project.x0 - 9999, project.y0 - 9999, 99999, 99999); ID_CLIP[tone].forEach(r => polyPath(project, r, inv));
        ctx.save(); ctx.clip(inv, "evenodd"); ctx.fillStyle = D.hexA(dimCol, baseA * 0.5); ctx.fill(path); ctx.restore(); }
    });
    // kumpulkan titik per tingkat terang
    const NL = 5, lv = [mix(col, NAVY, 0.30), mix(col, NAVY, 0.15), col, mix(col, "#FFFFFF", 0.25), mix(col, "#FFFFFF", 0.55)];
    const paths = []; for (let i = 0; i < NL; i++) paths.push(new Path2D());
    const nbPath = [new Path2D(), new Path2D()], shadow = new Path2D();
    // wilayah disorot: [tingkat jarak 0..2][tingkat denyut 0..3]
    const NB = 4, hPaths = hl.map(() => [0, 1, 2].map(() => Array.from({ length: NB }, () => new Path2D())));
    const hFlags = hl.map(h => (h.reg ? regFlags(G, h.reg, h.regKey) : null));
    const sweepC = ((t * 0.12 + 0.35) % 1.6) - 0.3, x0 = project.x0, wv = project.w, y0 = project.y0, hv = project.h, so = rDot * 0.45;
    const W0 = BOUNDS[0], SPAN = BOUNDS[1] - BOUNDS[0], dots = G.dots;
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      if (d.lon < vW || d.lon > vE || d.lat < vS || d.lat > vN) continue;
      if (d.tone && !nbOn) continue;
      const thr = (d.lon - W0) / SPAN * 0.9 + d.j * 0.1, u = D.clamp((reveal * (1 + band) - thr) / band);
      if (u <= 0) continue;
      const s = u < 1 ? Math.max(0, backOut(u)) : 1, r = rDot * s * (d.small ? 1.15 : 1);
      if (r < 0.3) continue;
      const [x, y] = project(d.lon, d.lat);
      if (d.tone) {   // tetangga: redup, lebih kecil, rata (tanpa bayangan/kilau)
        const pth = nbPath[d.j > 0.5 ? 1 : 0], rr = r * 0.8; pth.moveTo(x + rr, y); pth.arc(x, y, rr, 0, TAU); continue;
      }
      shadow.moveTo(x + r, y + so); shadow.arc(x, y + so, r, 0, TAU);
      let L = 1.35 + d.j * 0.9;
      if (shimmer) { const ph = (x - x0) / wv * 0.85 + (y - y0) / hv * 0.15 - sweepC; L += 2.2 * Math.exp(-(ph * ph) / 0.012) + 0.35 * Math.sin(t * 1.3 + d.j * 40); }
      if (u < 1) L += 1.5 * (1 - u);
      const li = Math.max(0, Math.min(NL - 1, Math.floor(L)));
      const pth = paths[li]; pth.moveTo(x + r, y); pth.arc(x, y, r, 0, TAU);
      for (let q = 0; q < hl.length; q++) {
        const h = hl[q]; if (!h.area && !hFlags[q]) continue;
        const dd = Math.hypot(d.lon - h.p[0], d.lat - h.p[1]);
        let lvl = -1; if (h.area) { const a = dd / h.area; if (a < 1) lvl = Math.min(2, Math.floor(a * 3)); }
        if (lvl < 0 && hFlags[q] && hFlags[q][i]) lvl = 0;
        if (lvl < 0) continue;
        // sebaran dari penanda (bila t0) lalu riak keluar: fase dari jarak ke penanda
        let sc = 1; if (h.t0 != null) { const sp = (t - h.t0) * (h.spread || 6) - dd; if (sp <= 0) continue; sc = Math.min(1, backOut(D.clamp(sp / 0.8))); }
        let wave = 0.5 + 0.5 * Math.sin(t * 3.4 - dd * 2.6); wave = wave * wave * wave;
        const bn = Math.min(NB - 1, Math.floor(wave * NB)), hr = r * sc * (1 + 0.25 * wave), hp = hPaths[q][lvl][bn];
        hp.moveTo(x + hr, y); hp.arc(x, y, hr, 0, TAU);
      }
    }
    // tetangga dulu (di bawah), lalu bayangan + titik Indonesia
    if (nbOn) { ctx.save(); ctx.globalAlpha *= 0.45; ctx.fillStyle = mix(dimCol, NAVY, 0.1); ctx.fill(nbPath[0]); ctx.fillStyle = mix(dimCol, "#FFFFFF", 0.12); ctx.fill(nbPath[1]); ctx.restore(); }
    if (opt.shadow !== false) { ctx.fillStyle = "rgba(10,16,52,0.30)"; ctx.fill(shadow); }
    for (let i = 0; i < NL; i++) { ctx.fillStyle = lv[i]; ctx.fill(paths[i]); }
    // wilayah yang disorot: titik diwarnai, riak terang menjalar dari penanda
    const BW = [0, 0.18, 0.36, 0.6];
    hl.forEach((h, q) => {
      if (!h.area && !h.reg) return; const c = h.color || P.amber, ap = h.t0 == null ? 1 : D.clamp((t - h.t0) / 0.3);
      [0.95, 0.72, 0.45].forEach((a, lvl) => { for (let b = 0; b < NB; b++) { ctx.fillStyle = D.hexA(mix(c, "#FFFFFF", BW[b]), a * ap * (0.8 + 0.2 * b / (NB - 1))); ctx.fill(hPaths[q][lvl][b]); } });
    });
    ctx.restore();
    // penanda di atas semua titik
    hl.forEach((h, q) => { const [x, y] = project.markers[q]; if (alpha < 1) { ctx.save(); ctx.globalAlpha *= alpha; } marker(ctx, x, y, h.scale || 1, Object.assign({ t }, h)); if (alpha < 1) ctx.restore(); });
    return project;
  }

  // ---------- rute: busur putus-putus dari luar layar + gelembung panggilan video ----------
  const SKIN = ["#C68A5E", "#A86E46", "#8D5A3B", "#D9A27A"];
  function bubble(ctx, x, y, s, opt = {}) {   // (x,y) = ujung ekor gelembung; tinggi total ±190*s
    const t = opt.t || 0, col = opt.color || P.pink, w = 124 * s, h = 150 * s, bx = x - w / 2, by = y - h - 26 * s;
    ctx.save();
    ctx.fillStyle = "rgba(12,20,60,0.28)"; K.helpers.rr(ctx, bx + 4 * s, by + 9 * s, w, h, 22 * s); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; K.helpers.rr(ctx, bx - 6 * s, by - 6 * s, w + 12 * s, h + 12 * s, 27 * s); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 16 * s, by + h + 4 * s); ctx.lineTo(x, y); ctx.lineTo(x + 16 * s, by + h + 4 * s); ctx.closePath(); ctx.fill();
    // layar panggilan
    ctx.save(); K.helpers.rr(ctx, bx, by, w, h, 21 * s); ctx.clip();
    const gr = ctx.createLinearGradient(0, by, 0, by + h); gr.addColorStop(0, "#5C78D6"); gr.addColorStop(1, "#8A7BEA"); ctx.fillStyle = gr; ctx.fillRect(bx, by, w, h);
    D.glow(ctx, bx + w * 0.5, by + h * 0.45, w * 0.7, P.warm, 0.35);
    // wajah tiruan berkedip: geser horizontal sesaat setiap ±1,6 dtk
    const ph = (t * 0.62) % 1, gl = ph > 0.86 && ph < 0.93 ? Math.sin((ph - 0.86) / 0.07 * Math.PI) : 0, jx = gl * 9 * s;
    const fx = x + jx, fy = by + h * 0.5;
    const person = (dx, tint, a) => {
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(dx, 0);
      ctx.fillStyle = tint || "#E8607F"; K.helpers.rr(ctx, fx - 46 * s, fy + 26 * s, 92 * s, 80 * s, 40 * s); ctx.fill();   // bahu
      ctx.fillStyle = tint || "#F2789A"; ctx.beginPath(); ctx.ellipse(fx, fy - 2 * s, 33 * s, 38 * s, 0, 0, TAU); ctx.fill();   // kerudung
      ctx.beginPath(); ctx.moveTo(fx - 33 * s, fy); ctx.quadraticCurveTo(fx - 40 * s, fy + 40 * s, fx, fy + 46 * s); ctx.quadraticCurveTo(fx + 40 * s, fy + 40 * s, fx + 33 * s, fy); ctx.fill();
      ctx.fillStyle = tint || SKIN[0]; ctx.beginPath(); ctx.ellipse(fx, fy + 2 * s, 21 * s, 24 * s, 0, 0, TAU); ctx.fill();   // wajah
      if (!tint) { ctx.fillStyle = "#2A1C2E"; const bl = (t % 3.3) < 0.12 ? 0.2 : 1;
        ctx.beginPath(); ctx.ellipse(fx - 8 * s, fy + 1 * s, 2.8 * s, 3.6 * s * bl, 0, 0, TAU); ctx.ellipse(fx + 8 * s, fy + 1 * s, 2.8 * s, 3.6 * s * bl, 0, 0, TAU); ctx.fill(); }
      ctx.restore();
    };
    if (gl > 0) { person(-7 * s * gl, P.teal, 0.55 * gl); person(7 * s * gl, P.pink, 0.55 * gl); }
    person(0, null, 1);
    if (gl > 0) { ctx.fillStyle = D.hexA("#FFFFFF", 0.35 * gl); ctx.fillRect(bx, fy - 6 * s, w, 5 * s); ctx.fillRect(bx, fy + 18 * s, w, 3 * s); }
    // ikon kamera + tutup telepon
    ctx.fillStyle = "rgba(255,255,255,0.9)"; K.helpers.rr(ctx, bx + 10 * s, by + 10 * s, 18 * s, 13 * s, 3 * s); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx + 28 * s, by + 16.5 * s); ctx.lineTo(bx + 35 * s, by + 11 * s); ctx.lineTo(bx + 35 * s, by + 22 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(x, by + h - 16 * s, 10 * s, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = D.hexA(col, 0.9); ctx.lineWidth = 3 * s; K.helpers.rr(ctx, bx - 6 * s, by - 6 * s, w + 12 * s, h + 12 * s, 27 * s); ctx.stroke();
    ctx.restore();
  }
  function route(ctx, from, to, opt = {}) {
    const t = opt.t || 0, p = opt.progress == null ? 1 : D.clamp(opt.progress), col = opt.color || P.pink;
    if (p <= 0) return null;
    if (!from || from === "left") from = [-260, to[1] - (opt.rise == null ? 260 : opt.rise)];
    const [x0, y0] = from, [x1, y1] = to, dx = x1 - x0, dy = y1 - y0, Ln = Math.hypot(dx, dy) || 1, bend = opt.bend == null ? 0.22 : opt.bend;
    let nx = -dy / Ln, ny = dx / Ln; if (ny > 0) { nx = -nx; ny = -ny; }   // menggembung ke atas
    const qx = (x0 + x1) / 2 + nx * Ln * bend, qy = (y0 + y1) / 2 + ny * Ln * bend;
    const N = 160, pts = [], cum = [0];
    for (let i = 0; i <= N; i++) { const u = i / N, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u; pts.push([a * x0 + b * qx + c * x1, a * y0 + b * qy + c * y1]); if (i) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); }
    // progress dihitung dari titik masuk layar (bagian di luar layar tidak memakan waktu)
    let e = 0; while (e < N && (pts[e][0] < 0 || pts[e][0] > WW || pts[e][1] < 0 || pts[e][1] > HH)) e++;
    const Ltot = cum[N], Lin = cum[e], Lh = Lin + (Ltot - Lin) * p;
    let hi = e; while (hi < N && cum[hi] < Lh) hi++;
    const f = hi > 0 ? (Lh - cum[hi - 1]) / Math.max(1e-6, cum[hi] - cum[hi - 1]) : 0, head = hi > 0 ? [D.lerp(pts[hi - 1][0], pts[hi][0], f), D.lerp(pts[hi - 1][1], pts[hi][1], f)] : pts[0];
    const line = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < hi; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineTo(head[0], head[1]); };
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    line(); ctx.strokeStyle = D.hexA(col, 0.22); ctx.lineWidth = 18; ctx.stroke();
    ctx.setLineDash([24, 18]); ctx.lineDashOffset = -t * 60; line(); ctx.strokeStyle = "rgba(12,20,60,0.25)"; ctx.lineWidth = 7; ctx.save(); ctx.translate(2, 5); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = col; ctx.stroke(); ctx.setLineDash([]);
    // gelembung panggilan video berjalan di ujung busur; tiba di tujuan saat progress = 1
    if (opt.bubble !== false) {
      const s = opt.bubbleScale || 1, arr = D.clamp((p - 0.97) / 0.03);
      if (arr > 0) { const u = ((t * 0.9) % 1); ctx.strokeStyle = D.hexA(col, (1 - u) * 0.8 * arr); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x1, y1, 16 + 50 * D.eout(u), 0, TAU); ctx.stroke(); }
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(head[0], head[1], 9, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(head[0], head[1], 4, 0, TAU); ctx.fill();
      const bob = Math.sin(t * 3) * 4 * (1 - arr * 0.6);
      bubble(ctx, head[0], head[1] - 10 + bob, s * (0.92 + 0.08 * Math.sin(t * 5.2) * (1 - arr)), { t, color: col });
    }
    // label dekat titik masuk
    if (opt.label) {
      const size = Math.max(40, opt.size || 44), la = D.clamp((p - 0.04) / 0.18);
      if (la > 0) {
        const [pw, ph] = tagSize(ctx, opt.label, size), k = Math.min(N, e + Math.round((N - e) * (opt.labelAt == null ? 0.18 : opt.labelAt)));
        const [ax, ay] = pts[k], tx = pts[Math.min(N, k + 1)][0] - pts[Math.max(0, k - 1)][0], ty = pts[Math.min(N, k + 1)][1] - pts[Math.max(0, k - 1)][1], tl = Math.hypot(tx, ty) || 1;
        let px = -ty / tl, py = tx / tl; if ((py > 0) !== (opt.labelSide === "below")) { px = -px; py = -py; }   // bawaan: sisi atas busur
        const [lx, ly] = placeLabel(ax, ay, px * (ph * 0.95) + (opt.labelDx || 0), py * (ph * 0.95) + (opt.labelDy || 0), pw, ph);
        ctx.save(); ctx.globalAlpha *= la; tag(ctx, opt.label, lx, ly, { size, color: col, scale: D.lerp(0.85, 1, D.eout(la)) }); ctx.restore();
      }
    }
    ctx.restore();
    return { head, entry: pts[e], control: [qx, qy] };
  }

  // ---------- peta media sosial: lingkungan tampak atas, ikon suara berkelip, gembok ----------
  const ICON_COL = { video: P.pink, live: P.red, voice: P.teal, foto: P.violet, pesan: P.blue };
  function glyph(ctx, name, r, col) {
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#FFFFFF"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (name === "video") {
      K.helpers.rr(ctx, -0.56 * r, -0.4 * r, 1.12 * r, 0.8 * r, 0.16 * r); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-0.14 * r, -0.22 * r); ctx.lineTo(0.24 * r, 0); ctx.lineTo(-0.14 * r, 0.22 * r); ctx.closePath(); ctx.fill();
    } else if (name === "live") {
      ctx.beginPath(); ctx.arc(0, 0, 0.17 * r, 0, TAU); ctx.fill(); ctx.lineWidth = 0.11 * r;
      [0.38, 0.62].forEach(rr => { ctx.beginPath(); ctx.arc(0, 0, rr * r, -0.65, 0.65); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, rr * r, Math.PI - 0.65, Math.PI + 0.65); ctx.stroke(); });
    } else if (name === "voice") {
      K.helpers.rr(ctx, -0.16 * r, -0.56 * r, 0.32 * r, 0.6 * r, 0.16 * r); ctx.fill(); ctx.lineWidth = 0.1 * r;
      ctx.beginPath(); ctx.arc(0, -0.08 * r, 0.32 * r, 0.15, Math.PI - 0.15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 0.25 * r); ctx.lineTo(0, 0.48 * r); ctx.moveTo(-0.2 * r, 0.5 * r); ctx.lineTo(0.2 * r, 0.5 * r); ctx.stroke();
    } else if (name === "foto") {
      K.helpers.rr(ctx, -0.58 * r, -0.3 * r, 1.16 * r, 0.76 * r, 0.14 * r); ctx.fill(); K.helpers.rr(ctx, -0.22 * r, -0.44 * r, 0.44 * r, 0.2 * r, 0.06 * r); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0.08 * r, 0.25 * r, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(0, 0.08 * r, 0.11 * r, 0, TAU); ctx.fill();
    } else {   // pesan (pesan suara diteruskan ke grup)
      K.helpers.rr(ctx, -0.58 * r, -0.42 * r, 1.16 * r, 0.72 * r, 0.24 * r); ctx.fill(); ctx.beginPath(); ctx.moveTo(-0.3 * r, 0.25 * r); ctx.lineTo(-0.42 * r, 0.52 * r); ctx.lineTo(-0.05 * r, 0.28 * r); ctx.fill();
      ctx.fillStyle = col; [-0.27, 0, 0.27].forEach(x => { ctx.beginPath(); ctx.arc(x * r, -0.06 * r, 0.08 * r, 0, TAU); ctx.fill(); });
    }
  }
  function padlock(ctx, x, y, h, l, col) {   // gembok kecil: l 0..1 (gagang turun dan mengunci)
    const bw = h * 0.78, bh = h * 0.58, lift = (1 - D.eio(l)) * h * 0.22, sr = bw * 0.3;
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(12,20,60,0.3)"; K.helpers.rr(ctx, -bw / 2 + 3, -bh / 2 + 7, bw, bh, bh * 0.24); ctx.fill();
    ctx.strokeStyle = "#E4EAFA"; ctx.lineWidth = h * 0.12; ctx.lineCap = "butt";
    ctx.beginPath(); ctx.moveTo(-sr, -bh / 2 + h * 0.06 - lift * 0.4); ctx.lineTo(-sr, -bh / 2 - h * 0.12 - lift); ctx.arc(0, -bh / 2 - h * 0.12 - lift, sr, Math.PI, 0); ctx.lineTo(sr, -bh / 2 + h * 0.06 - lift); ctx.stroke();
    ctx.fillStyle = mix(col, NAVY, 0.25); K.helpers.rr(ctx, -bw / 2, -bh / 2 + 3, bw, bh, bh * 0.24); ctx.fill();
    ctx.fillStyle = col; K.helpers.rr(ctx, -bw / 2, -bh / 2, bw, bh - 3, bh * 0.24); ctx.fill();
    ctx.fillStyle = mix(col, "#FFFFFF", 0.4); K.helpers.rr(ctx, -bw / 2 + bh * 0.16, -bh / 2 + bh * 0.1, bw - bh * 0.32, bh * 0.1, bh * 0.05); ctx.fill();
    ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(0, -bh * 0.02, bh * 0.12, 0, TAU); ctx.fill(); ctx.fillRect(-bh * 0.045, 0, bh * 0.09, bh * 0.2);
    ctx.restore();
  }
  let HOOD = null;
  function hood() {   // tata letak lingkungan (ruang desain 1200x800, pusat 0,0), dibuat sekali
    if (HOOD) return HOOD;
    const r = D.rng(54), houses = [], trees = [], RO = ["#8E86E0", "#6F9BE8", "#62C2B8", "#E48CA6", "#9AA6E6", "#B58BE0", "#E6A27A"];
    const roads = { h: 150, v: -260, lane: -175 };
    const onRoad = (x, y, m) => Math.abs(y - roads.h) < m + 33 || Math.abs(x - roads.v) < m + 33 || (x > roads.v && Math.abs(y - roads.lane) < m + 33);
    const yard = (x, y, m) => Math.abs(x - 60) < 150 + m && Math.abs(y + 2) < 107 + m;
    const pond = { x: -470, y: 300, rx: 80, ry: 50 }, inPond = (x, y, m) => ((x - pond.x) / (pond.rx + m)) ** 2 + ((y - pond.y) / (pond.ry + m)) ** 2 < 1;
    const hitHouse = (x, y, w, h) => houses.some(o => Math.abs(o.x - x) < (o.w + w) / 2 + 16 && Math.abs(o.y - y) < (o.h + h) / 2 + 16);
    for (let i = 0; i < 600 && houses.length < 26; i++) {
      const w = 80 + r() * 34, h = 58 + r() * 20, x = (r() - 0.5) * 1080, y = (r() - 0.5) * 700;
      if (onRoad(x, y, Math.max(w, h) / 2 + 14) || yard(x, y, Math.max(w, h) / 2 + 20) || inPond(x, y, 70) || hitHouse(x, y, w, h)) continue;
      houses.push({ x, y, w: w + 10, h: h - 4, c: RO[(r() * RO.length) | 0], rot: (r() - 0.5) * 0.08, gable: r() < 0.45, ic: r() < 0.3 ? ["video", "voice", "foto", "live"][(r() * 4) | 0] : null, ph: r() * 6 });
    }
    for (let i = 0; i < 900 && trees.length < 34; i++) {
      const x = (r() - 0.5) * 1160, y = (r() - 0.5) * 760, s = 16 + r() * 18;
      if (onRoad(x, y, s + 4) || yard(x, y, s + 8) || inPond(x, y, s) || houses.some(h => Math.abs(h.x - x) < h.w / 2 + s + 4 && Math.abs(h.y - y) < h.h / 2 + s + 4) || trees.some(o => Math.hypot(o.x - x, o.y - y) < (o.s + s) * 0.8)) continue;
      trees.push({ x, y, s, ph: r() * 6 });
    }
    trees.sort((a, b) => a.y - b.y);
    return (HOOD = { houses, trees, roads, pond });
  }
  // atap perisai tampak atas: empat bidang dengan terang berbeda (cahaya dari kiri atas)
  function roof(ctx, x, y, w, h, c, rot, gable) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
    const a = w / 2, b = h / 2, rg = gable ? a : Math.max(0, a - b * 0.62);
    ctx.fillStyle = "rgba(14,22,66,0.26)"; ctx.fillRect(-a + 7, -b + 10, w, h);
    ctx.fillStyle = mix(c, NAVY, 0.45); ctx.fillRect(-a - 3, -b - 3, w + 6, h + 6);   // lisplang
    const face = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); ctx.fill(); };
    face([[-a, -b], [a, -b], [rg, 0], [-rg, 0]], mix(c, "#FFFFFF", 0.2));
    face([[-a, b], [a, b], [rg, 0], [-rg, 0]], mix(c, NAVY, 0.28));
    face([[-a, -b], [-rg, 0], [-a, b]], mix(c, "#FFFFFF", 0.06));
    face([[a, -b], [rg, 0], [a, b]], mix(c, NAVY, 0.14));
    ctx.strokeStyle = mix(c, "#FFFFFF", 0.45); ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-rg, 0); ctx.lineTo(rg, 0); ctx.stroke();
    ctx.restore();
  }
  function tree(ctx, x, y, s, sw) {
    ctx.fillStyle = "rgba(14,22,66,0.25)"; ctx.beginPath(); ctx.arc(x + 6, y + 9, s, 0, TAU); ctx.fill();
    ctx.fillStyle = "#33A08A"; ctx.beginPath(); ctx.arc(x, y, s * sw, 0, TAU); ctx.fill();
    ctx.fillStyle = "#4FC2A2"; ctx.beginPath(); ctx.arc(x - s * 0.2, y - s * 0.22, s * 0.66 * sw, 0, TAU); ctx.fill();
    ctx.fillStyle = "#7ADDBE"; ctx.beginPath(); ctx.arc(x - s * 0.38, y - s * 0.4, s * 0.22, 0, TAU); ctx.fill();
  }
  function sosial(ctx, cx, cy, s, opt = {}) {
    s = s || 1; const t = opt.t || 0, icons = opt.icons || ["video", "live", "voice"], lock = D.clamp(opt.lock || 0), show = opt.show == null ? 1 : D.clamp(opt.show);
    const Hd = hood(), n = icons.length, hx0 = 60, hy0 = -2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    // kartu peta
    if (opt.card !== false) {
      ctx.fillStyle = "rgba(12,20,60,0.28)"; K.helpers.rr(ctx, -600 + 10, -400 + 18, 1200, 800, 56); ctx.fill();
      const gr = ctx.createLinearGradient(0, -400, 0, 400); gr.addColorStop(0, "#5873C6"); gr.addColorStop(1, "#4A61B0"); ctx.fillStyle = gr; K.helpers.rr(ctx, -600, -400, 1200, 800, 56); ctx.fill();
    }
    ctx.save(); K.helpers.rr(ctx, -600, -400, 1200, 800, 56); ctx.clip();
    D.glow(ctx, hx0, hy0, 520, P.warm, 0.16);
    // grid titik (bahasa visual peta)
    ctx.fillStyle = "rgba(220,232,255,0.13)"; ctx.beginPath(); for (let y = -390; y < 400; y += 26) for (let x = -590 + ((y / 26) & 1) * 13; x < 600; x += 26) { ctx.moveTo(x + 2.4, y); ctx.arc(x, y, 2.4, 0, TAU); } ctx.fill();
    // jalan
    const R = Hd.roads, road = (f) => { ctx.beginPath(); ctx.moveTo(-620, R.h); ctx.lineTo(620, R.h); ctx.moveTo(R.v, -420); ctx.lineTo(R.v, 420); ctx.moveTo(R.v, R.lane); ctx.lineTo(620, R.lane); f(); };
    ctx.lineCap = "round"; road(() => { ctx.strokeStyle = "rgba(14,22,66,0.22)"; ctx.lineWidth = 74; ctx.save(); ctx.translate(0, 6); ctx.stroke(); ctx.restore(); });
    road(() => { ctx.strokeStyle = "#8A9EE0"; ctx.lineWidth = 66; ctx.stroke(); });
    ctx.setLineDash([22, 20]); ctx.lineDashOffset = -t * 8; road(() => { ctx.strokeStyle = "rgba(240,246,255,0.55)"; ctx.lineWidth = 5; ctx.stroke(); }); ctx.setLineDash([]);
    // kolam, rumah tetangga, pohon
    const pd = Hd.pond; ctx.fillStyle = "#6FB7E8"; ctx.beginPath(); ctx.ellipse(pd.x, pd.y, pd.rx, pd.ry, -0.15, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8FD0F4"; ctx.beginPath(); ctx.ellipse(pd.x - 14, pd.y - 10, pd.rx * 0.62, pd.ry * 0.5, -0.15, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(pd.x + 10, pd.y + 6, 18 + 8 * ((t * 0.5) % 1), 6 + 3 * ((t * 0.5) % 1), -0.15, 0, TAU); ctx.stroke();
    Hd.houses.forEach(h => roof(ctx, h.x, h.y, h.w, h.h, h.c, h.rot, h.gable));
    Hd.trees.forEach(tr => tree(ctx, tr.x, tr.y, tr.s, 1 + 0.035 * Math.sin(t * 1.4 + tr.ph)));
    // rumah tetangga juga mengunggah: titik ikon kecil berdenyut (ikut terkunci)
    if (opt.others !== false) Hd.houses.forEach(h => { if (!h.ic) return; const c = mix(ICON_COL[h.ic], "#8494CC", 0.62 * lock), b = Math.pow(0.5 + 0.5 * Math.sin(t * 2.2 + h.ph), 2) * (1 - lock);
      const x = h.x + h.w * 0.34, y = h.y - h.h * 0.5; if (b > 0.05) { ctx.strokeStyle = D.hexA(c, b * 0.8); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 19 + 12 * b, 0, TAU); ctx.stroke(); }
      ctx.fillStyle = mix(c, NAVY, 0.25); ctx.beginPath(); ctx.arc(x, y + 2, 16, 0, TAU); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fill();
      ctx.save(); ctx.translate(x, y); glyph(ctx, h.ic, 16, c); ctx.restore(); });
    // rumah utama: halaman + atap hangat + cahaya lampu
    ctx.fillStyle = "rgba(14,22,66,0.2)"; K.helpers.rr(ctx, hx0 - 144, hy0 - 96, 300, 214, 30); ctx.fill();
    ctx.fillStyle = "#5CB893"; K.helpers.rr(ctx, hx0 - 150, hy0 - 104, 300, 214, 30); ctx.fill();
    ctx.fillStyle = "#6DC8A2"; K.helpers.rr(ctx, hx0 - 140, hy0 - 94, 280, 194, 24); ctx.fill();
    ctx.fillStyle = "#D8E1F8"; ctx.fillRect(hx0 - 15, hy0 + 60, 30, 56);   // jalan setapak ke jalan raya
    D.glow(ctx, hx0, hy0, 280, P.amber, 0.3 + 0.05 * Math.sin(t * 7.3) * Math.sin(t * 3.1));
    roof(ctx, hx0 - 52, hy0 + 30, 92, 92, "#F59A5B", 0);   // sayap rumah
    roof(ctx, hx0 + 14, hy0 - 24, 216, 112, P.amber, 0);
    ctx.fillStyle = mix(P.amber, NAVY, 0.35); ctx.fillRect(hx0 + 62, hy0 - 70, 24, 26); ctx.fillStyle = mix(P.amber, "#FFFFFF", 0.3); ctx.fillRect(hx0 + 62, hy0 - 70, 24, 6);   // cerobong
    tree(ctx, hx0 + 116, hy0 + 72, 22, 1 + 0.035 * Math.sin(t * 1.4)); tree(ctx, hx0 - 122, hy0 - 76, 18, 1 + 0.035 * Math.sin(t * 1.4 + 2));
    ctx.restore();
    if (opt.card !== false) { ctx.strokeStyle = "rgba(240,246,255,0.20)"; ctx.lineWidth = 3; K.helpers.rr(ctx, -600, -400, 1200, 800, 56); ctx.stroke(); }
    // ikon di sekeliling rumah
    const out = [], Rb = 62;
    for (let i = 0; i < n; i++) {
      const name = icons[i], c0 = ICON_COL[name] || P.blue, ang = -Math.PI / 2 + (i - (n - 1) / 2) * (n > 3 ? 0.78 : 1.0) + (n > 3 ? 0 : 0);
      const ap = D.clamp((show * (n * 0.5 + 0.5) - i * 0.5) / 1), sp = ap > 0 ? Math.max(0, backOut(ap)) : 0; if (sp <= 0) { out.push(null); continue; }
      const dd = D.lerp(0.6, 1, D.eout(ap)), bob = Math.sin(t * 1.8 + i * 1.7) * 7;
      const x = hx0 + Math.cos(ang) * 330 * dd + Math.sin(t * 0.7 + i) * 6, y = hy0 + Math.sin(ang) * 250 * dd + bob;
      const dl = 0.55 / Math.max(1, n), li = D.clamp((lock - i * dl) / Math.max(0.2, 1 - (n - 1) * dl)), lk = D.eio(li);
      const c = mix(c0, "#8494CC", 0.62 * lk), blink = (1 - lk) * Math.pow(0.5 + 0.5 * Math.sin(t * 2.6 - i * 2.1), 3);
      // garis titik dari rumah ke ikon + paket yang mengalir keluar
      ctx.save(); ctx.globalAlpha *= ap * (1 - 0.7 * lk); ctx.strokeStyle = D.hexA(c, 0.85); ctx.lineWidth = 5; ctx.setLineDash([2, 14]); ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(hx0, hy0 - 10); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
      if (lk < 1) for (let m = 0; m < 2; m++) { const u = (t * 0.55 + m * 0.5 + i * 0.23) % 1, px = D.lerp(hx0, x, u), py = D.lerp(hy0 - 10, y, u); ctx.fillStyle = D.hexA(c0, (1 - lk) * Math.sin(u * Math.PI)); ctx.beginPath(); ctx.arc(px, py, 7, 0, TAU); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.scale(sp * (1 + 0.12 * blink), sp * (1 + 0.12 * blink));
      if (blink > 0.02) D.glow(ctx, 0, 0, Rb * 2.3, c0, 0.6 * blink);
      ctx.fillStyle = "rgba(12,20,60,0.28)"; ctx.beginPath(); ctx.ellipse(4, Rb + 16, Rb * 0.8, Rb * 0.2, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = mix(c, NAVY, 0.25); ctx.beginPath(); ctx.arc(0, 4, Rb, 0, TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, 0, Rb, 0, TAU); ctx.fill();
      ctx.fillStyle = mix(c, "#FFFFFF", 0.25); ctx.beginPath(); ctx.arc(0, 0, Rb, Math.PI * 1.08, Math.PI * 1.62); ctx.arc(0, 0, Rb * 0.82, Math.PI * 1.62, Math.PI * 1.08, true); ctx.fill();
      ctx.save(); ctx.globalAlpha *= 1 - 0.3 * lk; glyph(ctx, name, Rb, c); ctx.restore();
      if (li > 0) {
        const ps = Math.max(0, backOut(D.clamp(li * 2.2))), fl = D.clamp((li - 0.75) / 0.25);
        if (fl > 0 && fl < 1) { ctx.strokeStyle = D.hexA(P.teal, 1 - fl); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(Rb * 0.62, Rb * 0.5, 30 + 50 * fl, 0, TAU); ctx.stroke(); }
        ctx.save(); ctx.translate(Rb * 0.62, Rb * 0.55); ctx.scale(ps, ps); padlock(ctx, 0, 0, 74, D.clamp((li - 0.35) / 0.5), P.teal); ctx.restore();
      }
      ctx.restore();
      out.push({ name, x: cx + x * s, y: cy + y * s, r: Rb * s, locked: lk });
    }
    ctx.restore();
    return { house: [cx + hx0 * s, cy + hy0 * s], icons: out, w: 1200 * s, h: 800 * s };
  }

  // ---------- showcase ----------
  function showcase(ctx, t) {
    const W = 1920, H_ = 1080;
    const gr = ctx.createLinearGradient(0, 0, 0, H_); gr.addColorStop(0, "#2E4489"); gr.addColorStop(1, "#4E66B8"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H_);
    D.glow(ctx, 520, 360, 760, P.violet, 0.22); D.glow(ctx, 1500, 900, 600, P.teal, 0.10);
    const cap = (s, x, y, size = 22, col = P.ink2) => { ctx.font = `700 ${size}px ${K.FONT}`; const tw = ctx.measureText(s).width;
      ctx.fillStyle = "rgba(14,22,62,0.7)"; K.helpers.rr(ctx, x - 10, y - size * 1.05, tw + 20, size * 1.5, 10); ctx.fill(); D.txt(ctx, s, x, y, size, { weight: 700, color: col }); };
    const box = (x, y, w, h) => { ctx.fillStyle = "rgba(14,22,62,0.30)"; K.helpers.rr(ctx, x, y, w, h, 26); ctx.fill(); };
    D.txt(ctx, "K.kit.peta", 30, 46, 34, { weight: 900 }); cap("indonesia · marker/tag · route · sosial", 230, 46, 24);
    // utama: peta + Mempawah (region, riak) + Jakarta (pin) + rute dari Arab Saudi
    const pj = indonesia(ctx, 640, 380, 1240, { t, highlight: [
      { at: "mempawah", label: "Mempawah, Kalimantan Barat", color: P.amber, region: "kalbar", dx: 330, dy: 150 },
      { at: "jakarta", label: "Jakarta", color: P.pink, style: "pin", dx: -150, dy: 75, t0: 0.4 }] });
    route(ctx, "left", pj.markers[0], { t, progress: D.clamp(0.35 + t / 3.4 * 0.65), label: "dari Arab Saudi", color: P.pink, rise: 290, bend: 0.12, labelSide: "below", labelAt: 0 });
    cap("utama w=1240: region \"kalbar\" (riak) · pin t0 · route(\"left\" → markers[0], progress " + D.clamp(0.35 + t / 3.4 * 0.65).toFixed(2) + ")", 40, 615);
    // kanan atas: sosial
    box(1300, 80, 600, 540);
    const lock = D.clamp((t - 0.8) / 2.4);
    sosial(ctx, 1600, 330, 0.44, { t, icons: ["video", "live", "voice", "foto", "pesan"], lock });
    cap(`sosial(…, 0.44, {icons ×5, lock ${lock.toFixed(2)}})`, 1320, 600);
    // bawah kiri: varian warna + reveal
    box(20, 650, 600, 410); ctx.save(); K.helpers.rr(ctx, 20, 650, 600, 410, 26); ctx.clip();
    indonesia(ctx, 320, 760, 560, { t, color: P.teal, sea: 0.12, neighbours: false, view: [20, 650, 620, 1060], highlight: [{ at: "makassar", color: P.pink }, { at: "jayapura", color: P.amber, style: "pin" }] });
    const rv = D.clamp(((t + 1.0) % 3.4) / 3.0);
    indonesia(ctx, 320, 955, 560, { t, reveal: rv, view: [20, 650, 620, 1060] });
    ctx.restore(); cap("teal · sea 0.12 · neighbours:false", 40, 690); cap(`reveal ${rv.toFixed(2)}`, 40, 880);
    // bawah tengah: tag + marker varian
    box(640, 650, 600, 410);
    tag(ctx, "tag(): pil terang", 940, 730, { color: P.teal });
    marker(ctx, 760, 920, 1, { t, color: P.amber }); marker(ctx, 940, 960, 1, { t, color: P.pink, style: "pin" });
    bubble(ctx, 1120, 990, 0.8, { t, color: P.pink });
    cap("marker ring · pin · gelembung route", 660, 1040);
    // bawah kanan: zoom Kalimantan Barat
    const zx = 1260, zy = 650, zw = 640, zh = 372;
    box(zx, zy, zw, zh); ctx.save(); K.helpers.rr(ctx, zx, zy, zw, zh, 26); ctx.clip();
    const z = 1 + 0.05 * Math.sin(t * 0.5), wz = 5600 * z, pz = proj(0, 0, wz); const [mx, my] = pz(110.2, -0.15);
    indonesia(ctx, zx + zw / 2 - mx, zy + zh / 2 - my, wz, { t, view: [zx, zy, zx + zw, zy + zh], highlight: [
      { at: "pontianak", label: "Pontianak", color: P.teal, style: "pin", scale: 0.8, size: 40, dx: 150, dy: 70 },
      { at: "mempawah", label: "Mempawah", color: P.amber, region: "kalbar", dx: 200, dy: -78 }] });
    ctx.restore(); cap("zoom w=5600 · step otomatis " + autoStep(wz / (BOUNDS[1] - BOUNDS[0])) + "° · kalbar + Pontianak (pin)", zx + 14, zy + zh + 30, 20);
  }

  K.kit.peta = { indonesia, proj, marker, tag, route, bubble, sosial, ANCHORS, REGIONS, BOUNDS, POLY, autoStep, showcase };
})(typeof window !== "undefined" ? window : globalThis);
