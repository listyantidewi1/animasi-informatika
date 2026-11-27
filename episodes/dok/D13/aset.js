/* D13 — pemuat bahan asli (tangkapan layar postingan dan potongan video yang beredar), disiapkan oleh siapkan_aset.sh
   ke folder aset/ (tidak di-commit). window.__ready baru bernilai true setelah semua gambar termuat, sehingga render,
   preview, dan cek_dok tidak menggambar frame dengan gambar kosong. Penggunaan disetujui Bu Dewi 27 Nov 2026. */
(function (g) {
  const K = g.Kiko, A = K.aset = { img: {}, n: 0, ok: 0, KLIP: 300 };
  if (typeof Image === "undefined" || !g.document) return;
  const base = (g.location && g.location.pathname.indexOf("/short/") >= 0 ? "../" : "") + "aset/";
  function ld(k, f) { A.n++; const im = new Image(); im.onload = () => { A.ok++; }; im.onerror = () => { A.ok++; const m = g.__missing = g.__missing || []; m.push("ASET:" + f); }; im.src = base + f; A.img[k] = im; }
  for (let i = 1; i <= A.KLIP; i++) ld("f" + i, "klip/f" + String(i).padStart(3, "0") + ".jpg");
  ["0.2", "1", "3", "5", "6.4", "8", "11", "14", "17", "20", "23.5"].forEach(s => ld("log" + s, "log/t" + s + ".jpg"));
  ["1", "5", "12"].forEach(s => ld("utuh" + s, "utuh_t" + s + ".jpg"));
  ["tweet_klaim_repost", "tweet_klaim_asli", "tweet_pubity"].forEach(s => ld(s, s + ".jpg"));
  let r = false;
  Object.defineProperty(g, "__ready", { configurable: true, get() { return r && A.ok >= A.n; }, set(v) { r = v; } });
})(typeof window !== "undefined" ? window : globalThis);
