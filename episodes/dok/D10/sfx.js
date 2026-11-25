/* D10 — isyarat efek suara (dibaca sfx_dok.py). Kartu bab: desir + arpeggio "levelup".
   Sisanya mengikuti kata kunci narasi, hemat (paling banyak 2–3 per beat). */
(function (g) {
  const K = g.Kiko; K.sfxParts = K.sfxParts || {};
  K.sfx = TL => Object.keys(K.sfxParts).flatMap(k => K.sfxParts[k](TL) || []).filter(Boolean).sort((a, b) => a[0] - b[0]);
  K.sfxAt = (TL, id, phrase, off, kind, amp = 1) => { const b = TL.beats.find(x => x.id === id); if (!b) return null;
    return [+(b.start + (phrase ? K.dok.at(b, phrase) : 0) + off).toFixed(3), kind, amp]; };
  K.sfxParts.d10 = TL => {
    const D = K.dok, out = [], bs = TL.beats;
    // kartu bab: desir + arpeggio "levelup"
    bs.forEach((b, i) => { const nx = bs[i + 1]; if (!nx || nx.seg === b.seg) return; const se = b.start + D.speechEnd(b);
      const c0 = se + (b.cardDelay != null ? b.cardDelay : 0.3); out.push([+c0.toFixed(3), "whoosh", 0.5]); out.push([+(c0 + 0.3).toFixed(3), "levelup", 0.6]); });
    const A = (id, ph, kind, amp, off = 0) => out.push(K.sfxAt(TL, id, ph, off, kind, amp));
    A("b0_1", "belum mengumumkan", "pop", 0.4); A("b0_1", "hampir menyala", "clack", 0.4); A("b0_2", "tidak punya kode", "whoosh", 0.4); A("b0_2", "bagaimana mungkin", "shimmer", 0.4);
    A("b0_3", "rekompilasi statis", "pop", 0.4); A("b0_3", "tiba-tiba menghilang", "riser", 0.4); A("b0_4", "tiga hal", "pop", 0.4); A("b0_4", "Dua hal sisanya", "clack", 0.4);
    A("b1_1", "sembilan belas November", "whoosh", 0.4); A("b1_1", "Xbox Series", "shimmer", 0.4); A("b1_2", "Cyberleek", "pop", 0.4); A("b1_2", "executable utamanya", "riser", 0.4);
    A("b1_3", "program inti", "pop", 0.4); A("b1_3", "tidak bisa dijalankan", "clack", 0.4); A("b1_4", "Empat hari kemudian", "whoosh", 0.4); A("b1_4", "di Windows", "shimmer", 0.4);
    A("b1_5", "versi Xbox", "pop", 0.4); A("b1_5", "Microsoft", "riser", 0.4); A("b2_1", "sebuah kue", "pop", 0.4); A("b2_1", "dibaca oleh manusia", "clack", 0.4);
    A("b2_2", "compiler", "whoosh", 0.4); A("b2_2", "itulah kuenya", "shimmer", 0.4); A("b2_3", "dijual", "pop", 0.4); A("b2_3", "tidak bisa mendapatkan", "riser", 0.4);
    A("b2_4", "meja makan", "pop", 0.4); A("b2_5", "keluarga prosesor", "clack", 0.4); A("b2_5", "Artinya", "whoosh", 0.4); A("b2_6", "Ribuan kali", "shimmer", 0.4);
    A("b2_6", "tidak ada di Windows", "pop", 0.4); A("b2_7", "shader", "riser", 0.4); A("b2_7", "tidak bisa langsung", "pop", 0.4); A("b2_8", "hanya satu yang cocok", "clack", 0.4);
    A("b2_8", "dengan cara apa", "whoosh", 0.4); A("b3_1", "tiga jalan", "shimmer", 0.4); A("b3_2", "penerjemah langsung", "pop", 0.4); A("b3_2", "bekerja dua kali", "riser", 0.4);
    A("b3_3", "dibiarkan apa adanya", "pop", 0.4); A("b3_3", "program buatan modder", "clack", 0.4); A("b3_4", "menerjemahkan seluruh buku", "whoosh", 0.4); A("b3_4", "tanpa penerjemah", "shimmer", 0.4);
    A("b3_5", "Kata statis", "pop", 0.4); A("b3_5", "jauh lebih cepat", "riser", 0.4); A("b3_6", "Nintendo 64", "pop", 0.4); A("b3_6", "beberapa hari setelah rilis", "clack", 0.4);
    A("ba_1", "Bagaimana sebenarnya", "whoosh", 0.4); A("ba_2", "deretan angka", "shimmer", 0.4); A("ba_2", "Sebuah alat", "pop", 0.4); A("ba_3", "Jutaan instruksi", "riser", 0.4);
    A("ba_3", "awal dan akhir", "pop", 0.4); A("ba_4", "secara harfiah", "clack", 0.4); A("ba_4", "maknanya sama persis", "whoosh", 0.4); A("ba_5", "compiler biasa", "shimmer", 0.4);
    A("ba_5", "alat penerjemahnya", "pop", 0.4); A("ba_6", "Dekompilasi berusaha", "riser", 0.4); A("ba_6", "bisa dijalankan", "pop", 0.4); A("ba_7", "lompat ke alamat seratus", "clack", 0.4);
    A("ba_7", "baru diketahui", "whoosh", 0.4); A("ba_8", "sebelum program berjalan", "shimmer", 0.4); A("ba_8", "lalu berhenti", "pop", 0.4); A("ba_9", "berdampingan", "riser", 0.4);
    A("ba_9", "menjadi kacau", "pop", 0.4); A("ba_10", "satu keuntungan", "clack", 0.4); A("ba_10", "dibelokkan", "whoosh", 0.4); A("b4_1", "Leonida", "shimmer", 0.4);
    A("b4_1", "empat pekerjaan", "pop", 0.4); A("b4_2", "hampir tanpa", "riser", 0.4); A("b4_3", "paling melelahkan", "pop", 0.4); A("b4_4", "dua puluh enam ribu", "clack", 0.4);
    A("b4_4", "belum diperiksa", "whoosh", 0.4); A("b4_5", "tidak dibuat ulang", "shimmer", 0.4); A("b4_6", "Lalu, sejauh mana", "pop", 0.4); A("b4_6", "hitungan hari", "riser", 0.4);
    A("b5_1", "muncul kabar", "pop", 0.4); A("b5_1", "Layarnya masih hitam", "clack", 0.4); A("b5_2", "judul yang jauh", "whoosh", 0.4); A("b5_2", "sangat jauh", "shimmer", 0.4);
    A("b5_4", "anak tangga pertama", "pop", 0.4); A("b5_5", "halaman proyek", "riser", 0.4); A("b5_6", "ia berhenti", "pop", 0.4); A("b5_6", "lima belas tahun", "clack", 0.4);
    A("b5_7", "Jadi, penyebab", "whoosh", 0.4); A("b5_7", "bukan pemberitahuan", "shimmer", 0.4); A("b5_8", "Rekompilasi", "pop", 0.4); A("b5_8", "adalah pembajakan", "riser", 0.4);
    A("bb_1", "mengubah sebuah game", "pop", 0.4); A("bb_1", "rasa penasaran", "clack", 0.4); A("bb_2", "reverse engineering", "whoosh", 0.4); A("bb_2", "tingkat ketiga", "shimmer", 0.4);
    A("bb_3", "dua ribu dua puluh satu", "pop", 0.4); A("bb_3", "dua ribu dua puluh tiga", "riser", 0.4); A("bb_4", "dua ribu lima belas", "pop", 0.4); A("bb_4", "sebuah mod", "clack", 0.4);
    A("bb_5", "begitu lama", "whoosh", 0.4); A("bb_5", "sepuluh ribu dolar", "shimmer", 0.4); A("bb_6", "Modder yang memperbaiki", "pop", 0.4); A("bb_6", "Proyek port", "riser", 0.4);
    A("b6_1", "belum ada yang tahu", "pop", 0.4); A("b6_1", "bahkan belum", "clack", 0.4); A("b6_2", "laporan media", "whoosh", 0.4); A("b6_2", "sembilan belas bulan", "shimmer", 0.4);
    A("b6_3", "segelintir model", "pop", 0.4); A("b6_3", "Membuatnya berjalan lancar", "riser", 0.4); A("b6_3a", "memegang resepnya", "pop", 0.4); A("b6_3a", "mengompilasi ulang", "clack", 0.4);
    A("b6_3b", "Itulah arti porting", "whoosh", 0.4); A("b6_3b", "pengujian", "shimmer", 0.4); A("b6_4", "Setiap kali", "pop", 0.4); A("b6_4", "mengaku sebagai", "riser", 0.4);
    A("b6_5", "Jadi, setiap installer", "pop", 0.4); A("b6_5", "maupun yang tidak resmi", "clack", 0.4); A("b6_6", "video sebelumnya", "whoosh", 0.4); A("b6_6", "layar akhir", "shimmer", 0.4);
    A("b7_1", "satu pelajaran besar", "pop", 0.4); A("b7_2", "antarmuka", "riser", 0.4); A("b7_3", "boleh diganti", "pop", 0.4); A("b7_3", "kamu lakukan", "clack", 0.4);
    A("b7_4", "seratus tempat yang berbeda", "whoosh", 0.4); A("b7_4", "kamu cukup", "shimmer", 0.4); A("b7_5", "konsep yang dipelajari", "pop", 0.4); A("b7_5", "tekniknya memang ada", "riser", 0.4);
    A("b7_6", "Tulis pendapatmu", "pop", 0.4); A("b7_99", "bantuan AI", "clack", 0.4); A("b7_99", "Semua sumber", "whoosh", 0.4);
    A("b5_8", "adalah pembajakan", "boom", 0.35); A("b4_4", "Angka itu", "clack", 0.5); A("b5_5", "menghilang", "boom", 0.3);
    return out;
  };
})(typeof window !== "undefined" ? window : globalThis);
