/* D03: bagian bersama untuk semua bab. Setiap bab<n>.js mendaftarkan adegan K.SCENES.d03_b<n> dan isyarat efek suaranya
   di K.sfxParts.b<n> = TL => [[detik_absolut, jenis, kekuatan], ...]; sfx_dok.py membaca gabungannya lewat K.sfx(TL).
   Jenis efek: whoosh, clack, shimmer, riser, boom, pop. */
(function (g) {
  const K = g.Kiko; K.sfxParts = K.sfxParts || {};
  K.sfx = TL => Object.keys(K.sfxParts).flatMap(k => K.sfxParts[k](TL) || []).sort((a, b) => a[0] - b[0]);
  // pembantu: isyarat pada kata dalam beat id (waktu absolut)
  K.sfxAt = (TL, id, phrase, off, kind, amp = 1) => { const b = TL.beats.find(x => x.id === id); if (!b) return null;
    return [+(b.start + (phrase ? K.dok.at(b, phrase) : 0) + off).toFixed(3), kind, amp]; };
})(typeof window !== "undefined" ? window : globalThis);
