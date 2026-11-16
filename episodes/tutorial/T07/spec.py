NAMA = "T07_Game_Ular_JavaScript"
JUDUL_YT = "Bikin Game Ular Sendiri di Browser (JavaScript untuk Pemula)"
BEATS = {
 1: [dict(k="klip", a="b11_main", b="b11_akhir", speed=1.4, maks=2.0), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin Game Ular Sendiri\ndi Browser", "hook": "Setelah menonton, kamu bisa membuat game yang dimainkan dengan tombol panah, lengkap dengan skornya."})],
 2: [dict(k="adegan", nama="koordinat")],
 3: [dict(k="rek", a="b03", b="b03_akhir", maks=2.4)],
 4: [dict(k="adegan", nama="array")],
 5: [dict(k="rek", a="b05", b="b05_akhir", maks=2.0)],
 6: [dict(k="adegan", nama="loop")],
 7: [dict(k="rek", a="b07", b="b07_akhir", maks=1.6)],
 8: [dict(k="adegan", nama="event")],
 9: [dict(k="rek", a="b09", b="b09_main", maks=2.4), dict(k="rek", a="b09_main", b="b09_akhir", speed=0.6)],
 10: [dict(k="adegan", nama="makan")],
 11: [dict(k="rek", a="b11", b="b11_main", maks=2.2), dict(k="rek", a="b11_main", b="b11_akhir", speed=0.6)],
 12: [dict(k="adegan", nama="tebak", bg=("rek", "b13"))],
 13: [dict(k="rek", a="b13", b="b13_akhir", maks=1.6)],
 14: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Papan", "warna": "#60a5fa", "judul": "Canvas", "sub": "papan koordinat", "kode": "fillRect()"}, {"ikon": "Gerbong", "warna": "#4ade80", "judul": "Array", "sub": "badan ular", "kode": "ular[0]"}, {"ikon": "Loop", "warna": "#a78bfa", "judul": "Game loop", "sub": "gerak tiap 150 ms", "kode": "setInterval"}, {"ikon": "Panah", "warna": "#ffb020", "judul": "Event", "sub": "tombol panah", "kode": "keydown"}]})],
 15: [dict(k="adegan", nama="penutup", a={"tantangan": "Buat ular kalah kalau kepalanya menabrak badannya sendiri. Petunjuk: bandingkan alamat kepala baru dengan setiap bagian di array ular.", "berikut": "Bikin Sandi Rahasia dengan Python"})],
}
SHORT = {"judul": "Game ular dari nol?", "beats": [
 {"teks": "Game ular ini dibuat dari nol, hanya dengan satu file dan sebuah browser.", "dari": (1, 3, "kanan")},
 {"teks": "Layarnya adalah papan koordinat. Ingat, y bertambah ke bawah, bukan ke atas.", "dari": (2, 15, "kiri")},
 {"teks": "Badan ular disimpan dalam array, dan isi nomor nol adalah kepalanya.", "dari": (4, 12, "tengah")},
 {"teks": "Setiap seratus lima puluh milidetik, kepala baru ditambah dan ekor dibuang. Itulah gerakannya.", "dari": (6, 15, "kanan")},
 {"teks": "Kalau kepala sampai di makanan, ekornya tidak dibuang, jadi ularnya tumbuh.", "dari": (10, 18, "kiri")},
 {"teks": "Mau membuat game-mu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (11, 14, "kanan")},
]}
THUMB = {"png": "thumb_game.png", "dari": (11, 14), "pita": "JAVASCRIPT", "baris": ["GAME", "ULAR", "SENDIRI"], "sorot": 1, "ukuran": 112}
META = {
 "ringkas": "Buat game ular klasik dari nol dengan HTML dan JavaScript, cukup satu file dan sebuah browser. Kamu belajar canvas dan papan koordinat (kenapa y bertambah ke bawah), array untuk menyimpan badan ular, perulangan for, game loop dengan setInterval, event keyboard untuk tombol panah, sampai cara ular makan dan tumbuh. Setiap konsep dijelaskan dengan animasi, lalu langsung dipraktikkan dan dimainkan.",
 "bab": [(1, "Pembuka"), (2, "Papan koordinat"), (3, "Papan dan kotak pertama"), (4, "Ular adalah array"), (5, "Badan ular"), (6, "Game loop"), (7, "Membuat ular bergerak"), (8, "Event keyboard"), (9, "Tombol panah dan dinding"), (10, "Makan dan tumbuh"), (11, "Makanan dan skor"), (12, "Tebak dulu"), (13, "Ubah dan uji"), (14, "Rangkuman dan tantangan")],
 "kode": open("/home/user/tut/T07/f.html").read().strip() if __import__("os").path.exists("/home/user/tut/T07/f.html") else "",
 "prasyarat": "Sebelumnya: Bikin AI Penebak Kelulusan dari Data Nilai. Lebih mudah bila sudah menonton Bikin Website Profil Diri dalam 10 Menit. Berikutnya: Bikin Sandi Rahasia dengan Python.",
 "komentar": "Tantangan: buat ular kalah kalau menabrak badannya sendiri. Berapa skor tertinggimu? Tulis di komentar.",
 "tag": ["game ular javascript", "bikin game di browser", "javascript untuk pemula", "html canvas", "game loop", "belajar coding", "tutorial javascript bahasa indonesia", "proyek coding sederhana", "snake game", "membuat game sendiri"],
 "hashtag": ["javascript", "bikingame", "belajarcoding", "coding"],
 "short_desk": "Game ular dari nol dengan JavaScript: papan koordinat, array, game loop, dan cara ular tumbuh.",
}
