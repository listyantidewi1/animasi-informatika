/* D09 — isyarat efek suara (dibaca sfx_dok.py). Kartu bab: desir + ketukan keyboard; sisanya mengikuti kata kunci narasi, hemat. */
(function (g) {
  const K = g.Kiko; K.sfxParts = K.sfxParts || {};
  K.sfx = TL => Object.keys(K.sfxParts).flatMap(k => K.sfxParts[k](TL) || []).filter(Boolean).sort((a, b) => a[0] - b[0]);
  K.sfxAt = (TL, id, phrase, off, kind, amp = 1) => { const b = TL.beats.find(x => x.id === id); if (!b) return null;
    return [+(b.start + (phrase ? K.dok.at(b, phrase) : 0) + off).toFixed(3), kind, amp]; };
  K.sfxParts.d09 = TL => {
    const D = K.dok, out = [], bs = TL.beats;
    bs.forEach((b, i) => { const nx = bs[i + 1]; if (!nx || nx.seg === b.seg) return; const c0 = b.start + D.speechEnd(b) + (b.cardDelay != null ? b.cardDelay : 0.3);
      out.push([+c0.toFixed(3), "whoosh", 0.45]); for (let k = 0; k < 4; k++) out.push([+(c0 + 0.35 + k * 0.28).toFixed(3), "clack", 0.25]); });
    const A = (id, ph, kind, amp, off = 0) => out.push(K.sfxAt(TL, id, ph, off, kind, amp));
    A("b0_1", "bocor lagi", "boom", 0.35); A("b0_1", "Untuk kedua", "whoosh", 0.4); A("b0_1", "kritis", "clack", 0.6);
    A("b0_2", "setelah sebuah", "riser", 0.35, -0.3); A("b0_3", "sekitar satu jam", "pop", 0.45); A("b0_4", "lalu menyerang", "whoosh", 0.45); A("b0_4", "tanpa bantuan", "boom", 0.3);
    A("b1_2", "mod_php", "pop", 0.4); A("b1_3", "delapan celah", "pop", 0.35); A("b1_4", "segera menambal", "clack", 0.55); A("b1_5", "exploit_agent", "shimmer", 0.35);
    A("b1_6", "lebih dari seribu", "riser", 0.35, -0.5);
    A("b2_1", "membuka pintu", "whoosh", 0.4); A("b2_3", "kunci lama", "pop", 0.4); A("b2_3", "tetap membuka", "boom", 0.3); A("b2_5", "meluber", "riser", 0.3, -0.3);
    A("b2_6", "data aslinya", "pop", 0.4); A("b2_8", "menjalankan perintahnya", "boom", 0.3); A("b2_9", "remote code execution", "whoosh", 0.4); A("b2_10", "Skor sembilan koma dua", "riser", 0.3, -0.6);
    A("b3_1", "tujuh belas November", "clack", 0.55); A("b3_2", "sekitar satu jam", "pop", 0.45); A("b3_3", "dua ratus dolar", "pop", 0.45); A("b3_4", "lebih dari lima tahun", "shimmer", 0.35);
    A("b3_6", "mulai rusak", "boom", 0.3); A("b3_8", "terbit bersamaan", "shimmer", 0.4);
    A("b4_1", "di mana lubangnya", "pop", 0.4); A("b4_2", "peta harta karun", "boom", 0.3); A("b4_4", "terbuka untuk umum", "whoosh", 0.4); A("b4_5", "tanpa manusia", "boom", 0.3);
    A("b4_9", "dalam satu hari", "pop", 0.4); A("b4_10", "ratusan organisasi", "riser", 0.35, -0.8); A("b4_12", "hitungan hari", "clack", 0.5); A("b4_13", "Tapi tunggu", "boom", 0.35);
    A("b5_1", "Celah kritis kali ini", "shimmer", 0.3); A("b5_6", "tetapi PHP tetap", "pop", 0.4); A("b5_7", "berhenti bekerja", "boom", 0.3); A("b5_8", "Namun menurut", "clack", 0.5, 0.6);
    A("b6_3", "Perintah ini", "pop", 0.35); A("b6_6", "semua tes lolos", "shimmer", 0.4, 0.8); A("b6_8", "menyusut", "whoosh", 0.4); A("b6_9", "Jalankan sendiri", "shimmer", 0.35, 1.5);
    A("b7_1", "Yang berubah", "riser", 0.3); A("b7_3", "Pemenangnya", "whoosh", 0.4, 2.2);
    return out;
  };
})(typeof window !== "undefined" ? window : globalThis);
