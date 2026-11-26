/* D12 — isyarat efek suara (dibaca sfx_dok.py). Kartu bab: desir + ketukan keyboard; sisanya mengikuti kata kunci narasi, hemat. */
(function (g) {
  const K = g.Kiko; K.sfxParts = K.sfxParts || {};
  K.sfx = TL => Object.keys(K.sfxParts).flatMap(k => K.sfxParts[k](TL) || []).filter(Boolean).sort((a, b) => a[0] - b[0]);
  K.sfxAt = (TL, id, phrase, off, kind, amp = 1) => { const b = TL.beats.find(x => x.id === id); if (!b) return null;
    return [+(b.start + (phrase ? K.dok.at(b, phrase) : 0) + off).toFixed(3), kind, amp]; };
  K.sfxParts.d12 = TL => {
    const D = K.dok, out = [], bs = TL.beats;
    bs.forEach((b, i) => { const nx = bs[i + 1]; if (!nx || nx.seg === b.seg) return; const c0 = b.start + D.speechEnd(b) + (b.cardDelay != null ? b.cardDelay : 0.3);
      out.push([+c0.toFixed(3), "whoosh", 0.45]); for (let k = 0; k < 4; k++) out.push([+(c0 + 0.35 + k * 0.28).toFixed(3), "clack", 0.25]); });
    const A = (id, ph, kind, amp, off = 0) => out.push(K.sfxAt(TL, id, ph, off, kind, amp));
    return out;
  };
})(typeof window !== "undefined" ? window : globalThis);
