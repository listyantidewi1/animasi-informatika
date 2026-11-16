NAMA = "T10_Website_Daftar_Tugas"
JUDUL_YT = "Bikin Website Daftar Tugas yang Tetap Tersimpan (HTML, CSS, JavaScript, localStorage)"
BEATS = {
 1: [dict(k="klip", a="b08_klik", b="b08_akhir", speed=1.0, maks=1.5), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin Website Daftar Tugas\nyang Tetap Tersimpan", "hook": "Setelah menonton, kamu bisa membuat website daftar tugas yang isinya tetap tersimpan, walaupun browser ditutup dan dibuka lagi."})],
 2: [dict(k="adegan", nama="rumah")],
 3: [dict(k="rek", a="b03", b="b03_akhir", maks=1.8)],
 4: [dict(k="adegan", nama="datatampil")],
 5: [dict(k="rek", a="b05", b="b05_akhir", maks=1.8)],
 6: [dict(k="rek", a="b06", b="b06_akhir", speed=1.0, maks=1.0), dict(k="adegan", nama="laci")],
 7: [dict(k="rek", a="b07", b="b07_akhir", maks=1.9)],
 8: [dict(k="rek", a="b08", b="b08_akhir", maks=1.6)],
 9: [dict(k="adegan", nama="tebak", bg=("rek", "b10_tebak"))],
 10: [dict(k="rek", a="b10_tebak", b="b10_akhir")],
 11: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Rumah", "warna": "#60a5fa", "judul": "HTML, CSS, JS", "sub": "kerangka, tampilan, perilaku", "kode": "<button>"}, {"ikon": "Kotak", "warna": "#a78bfa", "judul": "Data dan tampilan", "sub": "array berisi object", "kode": "forEach"}, {"ikon": "Laci", "warna": "#2dd4bf", "judul": "localStorage", "sub": "simpan sebagai teks JSON", "kode": "setItem()"}, {"ikon": "Centang", "warna": "#a3e635", "judul": "Cegah bug", "sub": "periksa isian dulu", "kode": "return"}]})],
 12: [dict(k="adegan", nama="penutup", a={"tantangan": "Tambahkan tombol hapus di setiap tugas. Petunjuk: gunakan splice untuk membuang satu isi array, lalu panggil simpan().", "berikut": "Bikin AI Penyaring Pesan Spam"})],
}
SHORT = {"judul": "Daftar tugas yang tidak hilang?", "beats": [
 {"teks": "Website daftar tugas ini kamu buat sendiri, dan isinya tidak hilang walaupun browser ditutup.", "dari": (8, 11.5, "kanan")},
 {"teks": "HTML adalah kerangkanya, CSS hiasannya, dan JavaScript membuat tombolnya bekerja.", "dari": (2, 15, "tengah")},
 {"teks": "Tanpa penyimpanan, semua tugas hilang saat halaman di-refresh.", "dari": (6, 0.5, "kanan")},
 {"teks": "Solusinya localStorage, laci kecil milik browser. Data diubah menjadi teks dengan JSON, lalu disimpan.", "dari": (6, 16, "tengah")},
 {"teks": "Mau membuat daftar tugasmu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (7, 14, "kanan")},
]}
THUMB = {"png": "thumb_tugas.png", "dari": (8, 16), "pita": "HTML + JS", "baris": ["DAFTAR", "TUGAS", "ANTI LUPA"], "sorot": 1, "ukuran": 112}
META = {
 "ringkas": "Buat website daftar tugas sendiri dengan HTML, CSS, dan JavaScript, yang isinya tetap tersimpan walaupun browser ditutup. Kamu belajar peran HTML, CSS, dan JavaScript, memisahkan data dan tampilan, menyimpan tugas dalam array berisi object, menampilkan daftar dengan forEach, menyimpan data di localStorage dengan JSON.stringify dan JSON.parse, menandai tugas selesai, dan mencegah bug tugas kosong. Setiap konsep dijelaskan dengan animasi.",
 "bab": [(1, "Pembuka"), (2, "HTML, CSS, dan JavaScript"), (3, "Kerangka halaman"), (4, "Data dan tampilan"), (5, "Menambah tugas"), (6, "Masalah: data hilang"), (7, "Menyimpan ke localStorage"), (8, "Menandai selesai"), (9, "Tebak dulu"), (10, "Ubah dan uji"), (11, "Rangkuman dan tantangan")],
 "kode": open(__file__.rsplit("/", 1)[0] + "/e.html").read().strip(),
 "prasyarat": "Sebelumnya: Bikin Kipas Otomatis Pengukur Suhu (IoT). Lebih mudah bila sudah menonton Bikin Website Profil Diri dan Bikin Game Ular Sendiri di Browser. Berikutnya: Bikin AI Penyaring Pesan Spam.",
 "komentar": "Tantangan: tambahkan tombol hapus di setiap tugas. Sudah berhasil? Tulis cara kamu memakai splice di komentar!",
 "tag": ["website daftar tugas", "to do list javascript", "localStorage javascript", "html css javascript pemula", "belajar web", "proyek javascript sederhana", "json javascript", "belajar coding", "tutorial javascript bahasa indonesia", "membuat website sendiri"],
 "hashtag": ["javascript", "html", "webdev", "belajarcoding"],
 "short_desk": "Website daftar tugas yang tidak hilang saat browser ditutup: HTML, CSS, JavaScript, dan localStorage.",
}
