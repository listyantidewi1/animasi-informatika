NAMA = "T04_Website_Profil_Diri_HTML_CSS"
JUDUL_YT = "Bikin Website Profil Diri dalam 10 Menit (HTML dan CSS untuk Pemula)"
BEATS = {
 1: [dict(k="klip", a="b11", b="b11_akhir", speed=2.2, maks=2.6), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin Website Profil Diri\ndalam 10 Menit", "hook": "Setelah menonton, kamu bisa membuat halaman web dengan judul, foto, daftar hobi, dan warnamu sendiri."})],
 2: [dict(k="adegan", nama="tag")],
 3: [dict(k="adegan", nama="sarang")],
 4: [dict(k="rek", a="b04", b="b04_akhir")],
 5: [dict(k="adegan", nama="tebak", bg=("rek", "b04_akhir"))],
 6: [dict(k="rek", a="b06", b="b06_akhir")],
 7: [dict(k="rek", a="b07", b="b07_akhir"), dict(k="adegan", nama="catatan", bg=True, min=8, a={"judul": "Dua bagian yang berisi alamat", "kode": ['<img src="raka.png" width="150">', '<a href="https://id.wikipedia.org">Tempat aku belajar</a>'], "ukuran": 28, "sorot": [0, 1], "gambar": "g_srcHref"})],
 8: [dict(k="adegan", nama="css")],
 9: [dict(k="rek", a="b09", b="b09_akhir")],
 10: [dict(k="adegan", nama="kotak")],
 11: [dict(k="rek", a="b11", b="b11_akhir"), dict(k="adegan", nama="catatan", bg=True, min=9, a={"judul": "Titik berarti memilih class", "kode": ['.kartu {', '    padding: 24px;', '    border-radius: 16px;', '    max-width: 400px;', '}'], "ukuran": 26, "sorot": [0], "gambar": "g_kartu"})],
 12: [dict(k="rek", a="b12", b="b12_akhir")],
 13: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Tag", "warna": "#60a5fa", "judul": "HTML", "sub": "menyusun isi", "kode": "<h1>...</h1>"}, {"ikon": "Kuas", "warna": "#f472b6", "judul": "CSS", "sub": "mengatur tampilan", "kode": "h1 { color: teal; }"}, {"ikon": "Sarang", "warna": "#2dd4bf", "judul": "Kotak", "sub": "padding, border, margin", "kode": ".kartu { }"}, {"ikon": "Browser", "warna": "#ffb020", "judul": "Browser", "sub": "membaca keduanya", "kode": "index.html"}]})],
 14: [dict(k="adegan", nama="penutup", a={"tantangan": "Tambahkan bagian cita-cita, dan buat warna link berubah ketika mouse diarahkan ke sana. Petunjuknya: cari tentang hover di CSS.", "berikut": "Ajari Komputer Membedakan Kucing dan Anjing"})],
}
SHORT = {"judul": "Website sendiri, 10 menit?", "beats": [
 {"teks": "Semua website dibangun dari dua bahan yang sama. Ini website profil yang dibuat dari nol.", "dari": (12, 20, "kanan")},
 {"teks": "Bahan pertama adalah HTML. Tag memberi label pada isi, misalnya h1 untuk judul.", "dari": (2, 18, "tengah")},
 {"teks": "Lupa satu tag penutup, dan paragrafnya ikut menjadi judul raksasa.", "dari": (6, 6, "kanan")},
 {"teks": "Bahan kedua adalah CSS, yang mengatur warna, jarak, dan bentuk.", "dari": (8, 22, "kanan")},
 {"teks": "Dengan beberapa baris CSS, halaman polos berubah menjadi kartu profil yang rapi.", "dari": (11, 22, "tengah")},
 {"teks": "Mau membuat punyamu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (12, 4, "kanan")},
]}
THUMB = {"dari": (12, 20), "crop": (1106, 60, 814, 700), "pita": "HTML + CSS", "baris": ["WEBSITE", "PROFIL", "SENDIRI"], "sorot": 1, "ukuran": 112}
META = {
 "ringkas": "Bikin website profil dirimu sendiri dari nol dengan HTML dan CSS. Kamu belajar tag pembuka dan penutup, elemen bersarang, judul, paragraf, daftar, gambar, dan link, lalu memberi warna, jarak, dan bentuk kartu dengan CSS. Setiap konsep dijelaskan dengan animasi: tag sebagai label, kotak di dalam kotak, rumah kerangka yang dicat, dan lapisan padding, border, serta margin. Cukup memakai editor teks dan browser.",
 "bab": [(1, "Pembuka"), (2, "HTML dan tag"), (3, "Kotak di dalam kotak"), (4, "File HTML pertama"), (5, "Tebak dulu"), (6, "Kenapa tag penutup penting"), (7, "Daftar, gambar, dan link"), (8, "CSS: selector, properti, nilai"), (9, "Memberi warna"), (10, "Padding, border, margin"), (11, "Kartu profil"), (12, "Layar HP dan titik koma"), (13, "Rangkuman dan tantangan")],
 "kode": open("/home/user/tut/T04/f.html").read().rstrip(),
 "prasyarat": "Tidak perlu menonton episode sebelumnya. Berikutnya: Ajari Komputer Membedakan Kucing dan Anjing.",
 "komentar": "Tantangan: tambahkan bagian cita-cita dan buat link berubah warna saat mouse diarahkan ke sana (petunjuk: hover). Warna apa yang kamu pilih untuk website-mu?",
 "tag": ["html untuk pemula", "css untuk pemula", "membuat website sendiri", "website profil", "belajar html", "tutorial html css bahasa indonesia", "web sederhana", "coding untuk pelajar", "proyek coding sederhana", "padding margin css"],
 "hashtag": ["html", "css", "belajarcoding", "webdesign"],
 "short_desk": "Website profil sendiri dari nol: HTML untuk menyusun isi, CSS untuk warna, jarak, dan bentuk kartu.",
}
