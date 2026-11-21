/* D08 — isyarat efek suara (dibaca sfx_dok.py). Kartu bab: desir + arpeggio "levelup"; BOSS KALAH: arpeggio "kalah" + dentum.
   Sisanya mengikuti kata kunci narasi, hemat (paling banyak 2–3 per beat). */
(function (g) {
  const K = g.Kiko; K.sfxParts = K.sfxParts || {};
  K.sfx = TL => Object.keys(K.sfxParts).flatMap(k => K.sfxParts[k](TL) || []).filter(Boolean).sort((a, b) => a[0] - b[0]);
  K.sfxAt = (TL, id, phrase, off, kind, amp = 1) => { const b = TL.beats.find(x => x.id === id); if (!b) return null;
    return [+(b.start + (phrase ? K.dok.at(b, phrase) : 0) + off).toFixed(3), kind, amp]; };
  const BOSS = { 3: 1, 4: 1, 5: 1 };
  K.sfxParts.d08 = TL => {
    const D = K.dok, out = [], bs = TL.beats;
    // kartu bab dan BOSS KALAH
    bs.forEach((b, i) => { const nx = bs[i + 1]; if (!nx || nx.seg === b.seg) return; const se = b.start + D.speechEnd(b);
      if (BOSS[b.seg]) { out.push([+(se + 0.15).toFixed(3), "boom", 0.4]); out.push([+(se + 0.65).toFixed(3), "kalah", 0.7]); }
      if (nx.seg >= 1) { const c0 = se + (b.cardDelay != null ? b.cardDelay : 0.3); out.push([+c0.toFixed(3), "whoosh", 0.5]); out.push([+(c0 + 0.3).toFixed(3), "levelup", 0.6]); } });
    const A = (id, ph, kind, amp, off = 0) => out.push(K.sfxAt(TL, id, ph, off, kind, amp));
    A("b0_1", "Tapi di hari", "whoosh", 0.5); A("b0_1", "lewat torrent", "boom", 0.35);
    A("b0_2", "Ternyata tidak", "clack", 0.5);
    A("b0_3", "kini beredar", "pop", 0.5); A("b0_3", "empat megabyte", "riser", 0.4, -0.4);
    A("b0_4", "apa yang sebenarnya bocor", "pop", 0.4); A("b0_4", "apa isi berkas", "pop", 0.4); A("b0_4", "cara memeriksa", "pop", 0.4);
    A("b0_5", "tidak bisa melihat", "shimmer", 0.4);
    A("b1_1", "sembilan belas November", "pop", 0.4); A("b1_2", "versi untuk HP", "clack", 0.4); A("b1_3", "beberapa megabyte", "pop", 0.4); A("b1_3", "sebenarnya apa", "whoosh", 0.4);
    A("b2_1", "Tapi ada yang janggal", "boom", 0.35); A("b2_2", "belum ada pihak", "clack", 0.5); A("b2_3", "disebut porting", "pop", 0.4);
    A("b2_4", "Penipu tinggal", "pop", 0.4); A("b2_5", "titik terlemah", "boom", 0.35);
    A("b3_1", "tombol DOWNLOAD", "pop", 0.4); A("b3_2", "dua ratus dolar", "pop", 0.5); A("b3_3", "keygen palsu", "pop", 0.35); A("b3_3", "crypto miner", "pop", 0.35); A("b3_3", "penguras dompet", "pop", 0.35); A("b3_3", "bot untuk", "pop", 0.35);
    A("b3_4", "mencuri token", "whoosh", 0.45, 0.5); A("b3_5", "bekerja diam-diam", "riser", 0.4); A("b3_6", "tiga puluh empat", "riser", 0.4);
    A("b4_1", "tidak pernah ada", "clack", 0.5); A("b4_3", "membaca SMS", "pop", 0.4); A("b4_3", "izin Aksesibilitas", "pop", 0.4); A("b4_4", "kode OTP dari bank", "whoosh", 0.4, 0.8);
    A("b4_5", "layar login palsu", "whoosh", 0.45); A("b4_6", "batalkan", "clack", 0.5);
    A("b5_1", "Ingat bot", "whoosh", 0.4); A("b5_3", "Password", "pop", 0.4); A("b5_3", "baru keluar", "boom", 0.35); A("b5_4", "gamer muda", "whoosh", 0.4, -1.4); A("b5_5", "cloud gaming", "shimmer", 0.4);
    ["b6_2", "b6_3", "b6_4", "b6_5", "b6_6"].forEach((id, i) => A(id, ["toko resmi", "masuk akal", "akhiran nama", "izin yang diminta", "dikunci dengan password"][i], "shimmer", 0.45, 1.2));
    A("b6_7", "Separuh", "riser", 0.4, -0.6);
    A("b7_2", "putuskan internet", "clack", 0.5, 0.3); A("b7_4", "keluar dari semua perangkat", "pop", 0.5, 0.6); A("b7_4", "tidak berlaku lagi", "boom", 0.3, -0.3);
    A("b7_5", "verifikasi dua langkah", "pop", 0.4); A("b7_7", "repositori palsu", "clack", 0.5); A("b7_7", "datang dari mana", "shimmer", 0.5);
    return out;
  };
})(typeof window !== "undefined" ? window : globalThis);
