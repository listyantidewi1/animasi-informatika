/* D13 — isyarat efek suara (dibaca sfx_dok.py). Kartu bab: desir + levelup; sisanya mengikuti kata kunci. */
(function (g) {
  const K = g.Kiko; K.sfxParts = K.sfxParts || {};
  K.sfx = TL => Object.keys(K.sfxParts).flatMap(k => K.sfxParts[k](TL) || []).filter(Boolean).sort((a, b) => a[0] - b[0]);
  K.sfxAt = (TL, id, phrase, off, kind, amp = 1) => { const b = TL.beats.find(x => x.id === id); if (!b) return null; return [+(b.start + (phrase ? K.dok.at(b, phrase) : 0) + off).toFixed(3), kind, amp]; };
  K.sfxParts.d13 = TL => {
    const D = K.dok, out = [], bs = TL.beats;
    bs.forEach((b, i) => { const nx = bs[i + 1]; if (!nx || nx.seg === b.seg) return; const se = b.start + D.speechEnd(b);
      const c0 = se + (b.cardDelay != null ? b.cardDelay : 0.3); out.push([+c0.toFixed(3), "whoosh", 0.5]); out.push([+(c0 + 0.3).toFixed(3), "levelup", 0.6]); });
    const A = (id, ph, kind, amp, off = 0) => out.push(K.sfxAt(TL, id, ph, off, kind, amp));
    A("b1_3", "satu alat", "pop", 0.4); A("b2_5", "16,7", "clack", 0.4); A("b3_3", "hanyalah tulisan", "pop", 0.4); A("b3_1", "24 detik", "clack", 0.4); A("b3_2", "hasilnya 60", "pop", 0.4); A("b4_2", "Co-Authored-By", "shimmer", 0.4); A("b4_3", "dari Git", "pop", 0.4); A("b4_3", "siapa yang", "clack", 0.4); A("b4_3a", "proyek port", "whoosh", 0.4); A("b4_3a", "ada benarnya", "pop", 0.4); A("b5_2", "lagi dan lagi", "clack", 0.4); A("b5_2", "angka kecil", "pop", 0.4); A("b6_1", "warna dan cahaya", "shimmer", 0.4); A("b6_2", "18.402 dari", "pop", 0.4); A("b6_3", "baru 17.867", "clack", 0.4); A("b6_4", "tidak cocok", "riser", 0.4); A("b7_1", "di kalender", "whoosh", 0.4); A("b7_2", "3 sampai 5", "pop", 0.4); A("b7_2", "25 sampai 30", "pop", 0.4); A("b7_2a", "30 FPS stabil", "clack", 0.4); A("b7_2a", "dirender", "pop", 0.4); A("b7_3", "menjadi 120", "riser", 0.4); A("b7_3", "ajakan", "pop", 0.4); A("b8_2", "tidak bisa dipercaya", "clack", 0.4); A("b8_3", "buktinya tidak cukup", "shimmer", 0.4); A("b9_1", "3 sampai 5", "pop", 0.4); A("b9_2", "memang benar", "shimmer", 0.4); A("b9_3", "rekompilasi statis", "pop", 0.4); A("b9_4", "tayangan slide", "clack", 0.4); A("b9_5", "menurunkan proyek", "riser", 0.4); A("b9_5", "3.007", "pop", 0.4); A("b10_1", "lima pertanyaan", "shimmer", 0.4); A("b10_3", "Sampai jumpa", "pop", 0.4);
    return out; };
})(typeof window !== "undefined" ? window : globalThis);
