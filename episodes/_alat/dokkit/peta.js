/* dokkit/peta.js — peta Indonesia dari titik-titik (dot-matrix ala Kurzgesagt) untuk dokumenter D03.
   Poligon lon/lat disederhanakan (cukup akurat untuk dikenali sekilas). Wilayah Indonesia = warna penuh; Malaysia (Semenanjung,
   Sarawak, Sabah, Brunei), Timor-Leste, dan Papua Nugini = warna redup.
   API:
     K.kit.peta.indonesia(ctx, cx, cy, w, opt) -> project(lon, lat) => [x, y]   (project.k = px per derajat, .x0 .y0 .w .h = kotak peta)
       opt: t, step (jarak titik dalam derajat, bawaan 0.3), dot (jari-jari px), color, dimColor, alpha (0..1), reveal (0..1, barat→timur),
            highlight: [{lon, lat | at:"mempawah", label, color, dx, dy, size, t0, area (radius derajat), region ("kalbar" | [lon,lat,...]), scale, style:"ring"|"pin"}], base (alfa siluet, bawaan 0.1),
            sea (alfa titik laut, bawaan 0), neighbours (bawaan true), shimmer (bawaan true), shadow (bawaan true), bounds [lonW, lonE, latS, latN]
     K.kit.peta.proj(cx, cy, w, opt) -> project tanpa menggambar.
     K.kit.peta.marker(ctx, x, y, h, opt) -> gambar penanda (ring/pin + label) di titik layar.
     K.kit.peta.ANCHORS: { mempawah: [108.96, 0.36], jakarta: [106.85, -6.21], ... }  */
(function (g) {
  const K = g.Kiko, D = K.dok, P = D.P, TAU = Math.PI * 2;
  K.kit = K.kit || {};

  // ---------- warna ----------
  const _hc = {};
  function hx(c) { let v = _hc[c]; if (!v) { const n = parseInt(c.slice(1), 16); v = _hc[c] = [n >> 16 & 255, n >> 8 & 255, n & 255]; } return v; }
  const _mc = {};
  function mix(a, b, u) {
    u = D.clamp(u); const key = a + b + (u * 1000 | 0); let r = _mc[key]; if (r) return r;
    const A = hx(a), B = hx(b); r = "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join(""); _mc[key] = r; return r;
  }

  // ---------- titik penting ----------
  const ANCHORS = {
    mempawah: [108.96, 0.36], pontianak: [109.33, -0.03], jakarta: [106.85, -6.21], bandung: [107.61, -6.91], semarang: [110.42, -6.97],
    yogyakarta: [110.37, -7.80], surabaya: [112.75, -7.25], medan: [98.67, 3.59], padang: [100.35, -0.95], palembang: [104.75, -2.98],
    denpasar: [115.22, -8.65], mataram: [116.12, -8.58], kupang: [123.60, -10.17], makassar: [119.42, -5.14], manado: [124.84, 1.47],
    balikpapan: [116.85, -1.24], banjarmasin: [114.59, -3.32], ambon: [128.18, -3.70], ternate: [127.37, 0.79], jayapura: [140.70, -2.53],
    bandaAceh: [95.32, 5.55], merauke: [140.40, -8.49]
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
    ["Halmahera", "id", [127.95,2.2, 128.1,1.95, 128.0,1.6, 127.95,1.3, 128.3,1.45, 128.7,1.6, 128.75,1.3, 128.4,1.05, 128.3,0.85, 128.65,0.65, 128.9,0.45, 128.6,0.3,
      128.2,0.45, 128.0,0.3, 128.2,-0.1, 128.05,-0.6, 127.85,-0.8, 127.7,-0.3, 127.6,0.2, 127.55,0.7, 127.5,1.1, 127.6,1.5, 127.75,1.9]],
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
    return (CACHE[key] = { dots, sea });
  }

  function proj(cx, cy, w, opt = {}) {
    const B = opt.bounds || BOUNDS, k = w / (B[1] - B[0]), h = k * (B[3] - B[2]), lc = (B[0] + B[1]) / 2, la = (B[2] + B[3]) / 2;
    const project = (lon, lat) => [cx + (lon - lc) * k, cy - (lat - la) * k];
    project.k = k; project.w = w; project.h = h; project.x0 = cx - w / 2; project.y0 = cy - h / 2; project.bounds = B;
    return project;
  }
  const backOut = u => { const c = 1.9, v = u - 1; return 1 + (c + 1) * v * v * v + c * v * v; };

  // ---------- penanda: cincin berdenyut / pin, dengan label dan garis penunjuk ----------
  function marker(ctx, x, y, s, opt = {}) {
    const t = opt.t || 0, col = opt.color || P.amber, a = opt.t0 == null ? 1 : D.clamp((t - opt.t0) / 0.35), sp = opt.t0 == null ? 1 : D.spring(t - opt.t0, 10, 0.5);
    if (a <= 0) return; s = s || 1;
    ctx.save(); ctx.globalAlpha *= a;
    D.glow(ctx, x, y, 70 * s, col, 0.45 + 0.15 * Math.sin(t * 3));
    if (opt.style === "pin") {
      const bob = Math.sin(t * 2.4) * 3 * s, R = 22 * s * sp, cy = y - 44 * s * sp + bob;
      ctx.fillStyle = "rgba(10,16,50,0.35)"; ctx.beginPath(); ctx.ellipse(x, y + 2, 14 * s * sp, 5 * s * sp, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = mix(col, "#1B2560", 0.25); ctx.beginPath(); ctx.arc(x, cy, R, Math.PI * 0.82, Math.PI * 0.18); ctx.lineTo(x, y + bob * 0.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x - R * 0.06, cy - R * 0.06, R * 0.94, Math.PI * 0.82, Math.PI * 0.18); ctx.lineTo(x - R * 0.05, y + bob * 0.3 - R * 0.12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.globalAlpha *= 0.95; ctx.beginPath(); ctx.arc(x, cy, R * 0.42, 0, TAU); ctx.fill();
      ctx.fillStyle = mix(col, "#FFFFFF", 0.55); ctx.beginPath(); ctx.arc(x - R * 0.42, cy - R * 0.45, R * 0.16, 0, TAU); ctx.fill();
    } else {
      for (let n = 0; n < 2; n++) {
        const u = ((t * 0.62 + n * 0.5) % 1), rr = (10 + 62 * D.eout(u)) * s;
        ctx.strokeStyle = D.hexA(col, (1 - u) * 0.9); ctx.lineWidth = (5 - 3 * u) * s; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.stroke();
      }
      ctx.fillStyle = mix(col, "#1B2560", 0.2); ctx.beginPath(); ctx.arc(x, y + 1.5 * s, 13 * s * sp, 0, TAU); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 12 * s * sp, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, 5 * s * sp, 0, TAU); ctx.fill();
    }
    if (opt.label) {
      const size = Math.max(40, opt.size || 44), dx = opt.dx == null ? 0 : opt.dx, dy = opt.dy == null ? -130 : opt.dy;
      ctx.font = `800 ${size}px ${K.FONT}`; const tw = ctx.measureText(opt.label).width, pw = tw + size * 1.55, ph = size * 1.6;
      let lx = x + dx, ly = y + dy; lx = D.clamp(lx, pw / 2 + 24, D.W - pw / 2 - 24);
      const la = D.clamp((t - (opt.t0 == null ? -9 : opt.t0) - 0.15) / 0.3), ls = opt.t0 == null ? 1 : D.spring(t - opt.t0 - 0.15, 10, 0.55);
      if (la > 0) {
        ctx.save(); ctx.globalAlpha *= la;
        // garis penunjuk: dari tepi titik ke tepi label terdekat
        const ex = D.clamp(x, lx - pw / 2 + ph / 2, lx + pw / 2 - ph / 2), ey = ly + (y > ly ? ph / 2 : -ph / 2);
        const pin = opt.style === "pin", oy = pin ? y - 44 * s : y, ang = Math.atan2(ey - oy, ex - x), r0 = (pin ? 26 : 20) * s, sx = x + Math.cos(ang) * r0, sy = oy + Math.sin(ang) * r0;
        const L = D.eout(la); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(D.lerp(sx, ex, L), D.lerp(sy, ey, L)); ctx.stroke();
        ctx.translate(lx, ly); ctx.scale(ls, ls);
        ctx.fillStyle = "rgba(8,12,40,0.30)"; K.helpers.rr(ctx, -pw / 2, -ph / 2 + 7, pw, ph, ph / 2); ctx.fill();
        ctx.fillStyle = "rgba(18,28,72,0.94)"; K.helpers.rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 3.5; ctx.stroke();
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(-pw / 2 + size * 0.62, 0, size * 0.17, 0, TAU); ctx.fill();
        D.txt(ctx, opt.label, -pw / 2 + size * 1.05, size * 0.36, size, { color: P.ink, weight: 800 });
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // ---------- peta ----------
  function indonesia(ctx, cx, cy, w, opt = {}) {
    const t = opt.t || 0, step = opt.step || 0.3, G = grid(step), project = proj(cx, cy, w, opt), k = project.k, B = project.bounds;
    const col = opt.color || "#D3E2FF", dimCol = opt.dimColor || "#7486C2", alpha = opt.alpha == null ? 1 : opt.alpha;
    const rDot = opt.dot || step * k * 0.36, reveal = opt.reveal == null ? 1 : D.clamp(opt.reveal), band = 0.12;
    const shimmer = opt.shimmer !== false, hl = (opt.highlight || []).map(h => { const at = h.at && ANCHORS[h.at]; return Object.assign({}, h, at ? { lon: at[0], lat: at[1] } : {}, { reg: typeof h.region === "string" ? REGIONS[h.region] : h.region }); });
    if (alpha <= 0) return project;
    ctx.save(); ctx.globalAlpha *= alpha;
    // titik laut samar
    if (opt.sea) { ctx.fillStyle = D.hexA(col, opt.sea); ctx.beginPath(); for (const [lo, la] of G.sea) { const [x, y] = project(lo, la); ctx.moveTo(x + rDot * 0.35, y); ctx.arc(x, y, rDot * 0.35, 0, TAU); } ctx.fill(); }
    // siluet daratan samar (membantu pulau kecil terbaca)
    const baseA = (opt.base == null ? 0.1 : opt.base) * D.clamp(reveal * 1.5 - 0.3);
    if (baseA > 0) POLY.forEach(p => {
      if (p[1] === "nb" && opt.neighbours === false) return;
      const a = p[2]; ctx.beginPath(); for (let i = 0; i < a.length; i += 2) { const [x, y] = project(a[i], a[i + 1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath();
      ctx.fillStyle = D.hexA(p[1] === "nb" ? dimCol : col, baseA * (p[1] === "nb" ? 0.6 : 1)); ctx.fill();
    });
    // kumpulkan titik per tingkat terang
    const NL = 5, lv = [mix(col, "#1B2560", 0.30), mix(col, "#1B2560", 0.15), col, mix(col, "#FFFFFF", 0.22), mix(col, "#FFFFFF", 0.5)];
    const lvD = [mix(dimCol, "#1B2560", 0.25), mix(dimCol, "#1B2560", 0.1), dimCol, mix(dimCol, "#FFFFFF", 0.12), mix(dimCol, "#FFFFFF", 0.25)];
    const paths = [[], []]; for (let i = 0; i < NL; i++) { paths[0].push(new Path2D()); paths[1].push(new Path2D()); }
    const shadow = new Path2D(), hPaths = hl.map(() => [new Path2D(), new Path2D(), new Path2D()]);
    const sweepC = (t * 0.14) % 1.7 - 0.25, x0 = project.x0, y0 = project.y0, wv = project.w, hv = project.h, so = rDot * 0.45;
    const W0 = BOUNDS[0], SPAN = BOUNDS[1] - BOUNDS[0];
    for (const d of G.dots) {
      if (d.tone && opt.neighbours === false && POLY[d.poly][1] === "nb") continue;
      const thr = (d.lon - W0) / SPAN * 0.9 + d.j * 0.1, u = D.clamp((reveal * (1 + band) - thr) / band);
      if (u <= 0) continue;
      const s = u < 1 ? Math.max(0, backOut(u)) : 1, r = rDot * s * (d.small ? 1.15 : 1);
      if (r < 0.3) continue;
      const [x, y] = project(d.lon, d.lat);
      shadow.moveTo(x + r, y + so); shadow.arc(x, y + so, r, 0, TAU);
      let L = 1.1 + d.j * 0.9 + (1 - (x - x0) / wv) * 0.5 + (1 - (y - y0) / hv) * 0.5;
      if (shimmer) { const ph = (x - x0) / wv * 0.85 + (y - y0) / hv * 0.15 - sweepC; L += 1.4 * Math.exp(-(ph * ph) / 0.004) + 0.35 * Math.sin(t * 1.3 + d.j * 40); }
      if (u < 1) L += 1.5 * (1 - u);
      const li = Math.max(0, Math.min(NL - 1, Math.floor(L)));
      const pth = paths[d.tone][li]; pth.moveTo(x + r, y); pth.arc(x, y, r, 0, TAU);
      for (let q = 0; q < hl.length; q++) { const h = hl[q]; if (!h.area && !h.reg) continue;
        let lvl = -1; if (h.area) { const dd = Math.hypot(d.lon - h.lon, d.lat - h.lat) / h.area; if (dd < 1) lvl = Math.min(2, Math.floor(dd * 3)); }
        if (lvl < 0 && h.reg && inside(h.reg, d.lon, d.lat)) lvl = 0;
        if (lvl >= 0) { const hp = hPaths[q][lvl]; hp.moveTo(x + r, y); hp.arc(x, y, r, 0, TAU); } }
    }
    if (opt.shadow !== false) { ctx.fillStyle = "rgba(10,16,52,0.32)"; ctx.fill(shadow); }
    for (let tn = 1; tn >= 0; tn--) for (let i = 0; i < NL; i++) { ctx.fillStyle = (tn ? lvD : lv)[i]; ctx.fill(paths[tn][i]); }
    // wilayah yang disorot: titik diwarnai dan berdenyut
    hl.forEach((h, q) => {
      if (!h.area && !h.reg) return; const c = h.color || P.amber, ap = h.t0 == null ? 1 : D.clamp((t - h.t0) / 0.6), pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
      [0.95, 0.7, 0.42].forEach((a, i) => { ctx.fillStyle = D.hexA(mix(c, "#FFFFFF", 0.15 * pulse), a * ap * (0.75 + 0.25 * pulse)); ctx.fill(hPaths[q][i]); });
    });
    ctx.restore();
    // penanda di atas semua titik
    hl.forEach(h => { const [x, y] = project(h.lon, h.lat); marker(ctx, x, y, h.scale || 1, Object.assign({ t }, h)); });
    return project;
  }

  // ---------- showcase ----------
  function showcase(ctx, t) {
    const W = 1920, HH = 1080;
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, "#2B3F86"); gr.addColorStop(1, "#4C63B4"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    D.glow(ctx, 520, 360, 760, P.violet, 0.22); D.glow(ctx, 1500, 900, 600, P.teal, 0.10);
    const cap = (s, x, y, size = 24, col = P.ink2, al = "left") => { ctx.font = `700 ${size}px ${K.FONT}`; const tw = ctx.measureText(s).width;
      ctx.fillStyle = "rgba(14,22,62,0.7)"; K.helpers.rr(ctx, x - 10, y - size * 1.05, tw + 20, size * 1.5, 10); ctx.fill(); D.txt(ctx, s, x, y, size, { align: al, weight: 700, color: col }); };
    D.txt(ctx, "K.kit.peta", 40, 50, 34, { weight: 900 }); cap("indonesia(ctx, cx, cy, w, opt) · peta titik · highlight ring/pin + area · reveal barat→timur · zoom", 250, 50);
    // utama
    indonesia(ctx, 690, 410, 1300, { t, highlight: [
      { at: "mempawah", label: "Mempawah, Kalimantan Barat", color: P.amber, region: "kalbar", dx: -20, dy: -190 },
      { at: "jakarta", label: "Jakarta", color: P.pink, style: "pin", dx: -250, dy: 125, t0: 0.4 }] });
    cap("utama: w=1300 · Mempawah (ring + region \"kalbar\") · Jakarta (pin, t0=0.4)", 60, 735);
    // kolom kanan: reveal
    const rv = [0.3, 0.65, D.clamp((t % 3.4) / 2.6)];
    rv.forEach((r, i) => { const cy = 160 + i * 205; indonesia(ctx, 1640, cy, 500, { t, reveal: r, step: 0.42 });
      cap(i < 2 ? `reveal ${r}` : `reveal animasi: ${r.toFixed(2)}`, 1400, cy + 95, 22); });
    // bawah: varian warna + titik laut, dan zoom
    ctx.save(); K.helpers.rr(ctx, 40, 760, 900, 300, 26); ctx.fillStyle = "rgba(14,22,62,0.35)"; ctx.fill(); ctx.clip();
    indonesia(ctx, 490, 905, 860, { t, color: P.teal, dimColor: "#5C74B8", sea: 0.12, neighbours: false, highlight: [{ at: "makassar", color: P.pink }, { at: "jayapura", color: P.amber, style: "pin" }] });
    ctx.restore(); cap("color teal · sea 0.12 · neighbours:false · marker tanpa label", 66, 796, 22);
    ctx.save(); K.helpers.rr(ctx, 980, 760, 900, 300, 26); ctx.fillStyle = "rgba(14,22,62,0.35)"; ctx.fill(); ctx.clip();
    const z = 1 + 0.06 * Math.sin(t * 0.5);
    const pj = proj(0, 0, 4200 * z); const [mx, my] = pj(110.6, -0.2);
    indonesia(ctx, 1430 - mx, 905 - my, 4200 * z, { t, step: 0.2, highlight: [{ at: "mempawah", label: "Mempawah", color: P.amber, area: 0.8, dx: -120, dy: 120 }] });
    ctx.restore(); cap("zoom: w=4200, step 0.2, area 0.8°, clip", 1006, 796, 22);
  }

  K.kit.peta = { indonesia, proj, marker, ANCHORS, REGIONS, BOUNDS, POLY, showcase };
})(typeof window !== "undefined" ? window : globalThis);
