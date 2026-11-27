# Menyusun script.json D12 dari naskah yang disunting Bu Dewi (Claude Doc 7LFnGLfoJ6NDPCwbJrwhLq, rev 73).
import json
SEG = ["Pembuka", "Apa isi peringatannya", "Sandbox, ruang kaca untuk setiap tab", "Variations, bagian Chrome yang jarang dibicarakan",
       "Seberapa gawat sebenarnya", "Cara cek dan update", "Penutup"]
V88 = "seratus lima puluh delapan, titik nol, titik delapan satu dua tujuh, titik delapan delapan"
B = [
 ("b0_1", "Bayangkan kamu hanya membuka satu halaman web. Kamu tidak mengunduh apa pun, tidak memasang apa pun, dan tidak mengetik kata sandi di mana pun."),
 ("b0_2", "Menurut peringatan resmi yang sedang beredar, pada Google Chrome yang belum diperbarui, hal itu saja bisa cukup untuk membuat orang lain menjalankan perintah di perangkatmu."),
 ("b0_3", "Kampus dan kantor sampai mengirim email peringatan kepada semua orang, dan tingkat bahayanya diberi nilai sembilan koma enam dari sepuluh."),
 ("b0_4", "Bagaimana mungkin sebuah halaman web bisa keluar dari browser? Apakah Chrome di perangkatmu termasuk yang terkena?"),
 ("b0_5", "Kita akan membedahnya satu per satu, termasuk satu langkah kecil yang sering terlewat, sehingga banyak orang merasa sudah aman padahal belum."),
 ("b1_1", "Peringatan itu bersumber dari catatan rilis resmi Google. Di sana tertulis bahwa versi stabil Chrome yang baru menambal tepat satu celah keamanan, dan celah itu diberi tingkat tertinggi, yaitu Critical."),
 ("b1_2", "Celah ini punya nomor identitas CVE-2026-134401. Nomor CVE adalah nomor katalog dunia untuk celah keamanan, supaya semua orang membicarakan masalah yang sama.",
          "Celah ini punya nomor identitas C V E, dua ribu dua puluh enam, satu tiga empat, empat nol satu. Nomor C V E adalah nomor katalog dunia untuk celah keamanan, supaya semua orang membicarakan masalah yang sama."),
 ("b1_3", "Deskripsi resminya hanya satu kalimat. Penyerang dari jarak jauh berpotensi menjalankan kode di luar sandbox, melalui halaman HTML yang dibuat khusus.",
          "Deskripsi resminya hanya satu kalimat. Penyerang dari jarak jauh berpotensi menjalankan kode di luar sandbox, melalui halaman H T M L yang dibuat khusus."),
 ("b1_4", "Ada dua istilah penting di kalimat itu. Yang pertama adalah sandbox, dan yang kedua adalah nama bagian Chrome tempat celah ini berada, yaitu Variations. Kita mulai dari sandbox."),
 ("b2_1", "Setiap hari, browser menjalankan kode dari orang yang tidak kamu kenal. Setiap situs yang kamu buka mengirim program kecil, lalu browser menjalankannya di perangkatmu."),
 ("b2_2", "Karena itu, Chrome tidak pernah percaya kepada halaman web. Setiap tab dimasukkan ke dalam ruang tertutup yang disebut sandbox, seperti ruang kaca yang tidak punya pintu ke bagian lain rumah."),
 ("b2_3", "Di dalam sandbox, halaman web boleh menggambar, memutar video, dan berhitung. Namun, halaman itu tidak boleh membaca file kamu, menyalakan kamera sesukanya, atau memasang program."),
 ("b2_4", "Itulah sebabnya sebagian besar celah browser tidak langsung berakibat fatal. Penyerang biasanya membutuhkan dua celah sekaligus, yaitu satu untuk menguasai isi ruang kaca, dan satu lagi untuk keluar dari sana."),
 ("b2_5", "Sekarang, baca lagi kalimat tadi: menjalankan kode di luar sandbox. Celah ini berkaitan dengan dinding terluar, yaitu lapisan pelindung terakhir antara halaman web dan perangkatmu. Itulah alasan mengapa ia tergolong kategori Critical."),
 ("b3_1", "Lalu, apa itu Variations? Nama ini hampir tidak pernah muncul di berita, padahal sistem ini bekerja di setiap browser Chrome di dunia."),
 ("b3_2", "Google tidak menyalakan fitur baru untuk semua orang sekaligus. Sebuah fitur dicoba dulu pada sebagian kecil pengguna, lalu diperluas sedikit demi sedikit bila tidak ada masalah."),
 ("b3_3", "Variations adalah sistem yang mengatur percobaan itu. Chrome secara berkala menerima daftar pengaturan dari server Google, lalu menyalakan atau mematikan fitur sesuai daftar tersebut."),
 ("b3_4", "Sistem ini bekerja di bagian browser yang punya kuasa penuh. Kalau bagian seperti ini menerima data yang keliru, akibatnya langsung terasa di luar sandbox."),
 ("b3_5", "Jenis kesalahannya disebut improper input validation, yaitu program menerima data tanpa memeriksanya dengan cukup teliti. Ibaratnya, petugas loket menerima formulir tanpa mengecek apakah isinya masuk akal."),
 ("b3_6", "Bagaimana tepatnya data itu bisa dikirim lewat sebuah halaman web? Google sengaja belum membuka detailnya, dan alasannya justru penting untuk kamu ketahui."),
 ("b4_1", "Laporan teknis celah ini masih dikunci. Google baru membukanya setelah sebagian besar pengguna memasang patch, supaya penjahat tidak mendapat petunjuk secara cuma-cuma."),
 ("b4_2", "Namun, kunci itu tidak bertahan lama. Chrome dibangun dari kode terbuka, sehingga siapa pun bisa membandingkan versi lama dengan versi baru, lalu mencari bagian mana yang diperbaiki."),
 ("b4_3", "Jadi, begitu patch dirilis, sebuah perlombaan dimulai. Di satu sisi ada pengguna yang memperbarui browser, dan di sisi lain ada orang yang mempelajari patch itu untuk menyerang mereka yang belum memperbarui."),
 ("b4_4", "Ada kabar baiknya. Celah ini ditemukan oleh tim Google sendiri, bukan oleh penjahat, dan sampai video ini dibuat belum ada laporan bahwa celah ini dipakai untuk menyerang."),
 ("b4_5", "Sebuah serangan juga tetap membutuhkan satu hal dari korban, yaitu membuka halaman yang sudah disiapkan penyerang. Karena itu, kita perlu berhati-hati dengan tautan yang mencurigakan."),
 ("b4_6", "Menariknya, Google melaporkan celah ini hampir tiga bulan sebelum patch dirilis. Memperbaiki browser yang dipakai miliaran orang tanpa merusak hal lain ternyata membutuhkan waktu."),
 ("b4_7", "Kesimpulannya, kamu tidak perlu panik, tetapi kamu juga tidak boleh menunda. Sekarang, kita periksa Chrome di perangkatmu."),
 ("b5_1", "Di laptop atau komputer, buka Chrome, lalu klik tiga titik di pojok kanan atas. Pilih Bantuan, kemudian pilih Tentang Google Chrome."),
 ("b5_2", "Kamu juga bisa mengetik alamat chrome://settings/help di kolom alamat. Halaman ini menampilkan nomor versi, dan Chrome langsung memeriksa apakah ada pembaruan.",
          "Kamu juga bisa mengetik alamat chrome, titik dua, garis miring dua kali, settings, garis miring, help, di kolom alamat. Halaman ini menampilkan nomor versi, dan Chrome langsung memeriksa apakah ada pembaruan."),
 ("b5_3", "Perhatikan nomornya. Chrome di Windows, Mac, dan Linux sudah ditambal bila versinya 158.0.8127.88 atau lebih tinggi.",
          "Perhatikan nomornya. Chrome di Windows, Mac, dan Linux sudah ditambal bila versinya " + V88 + ", atau lebih tinggi."),
 ("b5_4", "Di sinilah langkah yang sering terlewat. Chrome memang mengunduh pembaruan secara otomatis, tetapi patch baru benar-benar aktif setelah Chrome ditutup dan dibuka kembali."),
 ("b5_5", "Kalau kamu terbiasa membiarkan puluhan tab terbuka selama berminggu-minggu, Chrome kamu bisa saja sudah mengunduh patch, tetapi masih menjalankan versi lama. Klik tombol Luncurkan Ulang, dan tab kamu akan dibuka kembali."),
 ("b5_6", "Di HP Android, buka Play Store, ketuk foto profil, lalu pilih Kelola aplikasi dan perangkat. Bila Chrome muncul di daftar update, ketuk Update. Di Android, versi yang sudah di-patch berakhiran 92 atau lebih tinggi.",
          "Di HP Android, buka Play Store, ketuk foto profil, lalu pilih Kelola aplikasi dan perangkat. Bila Chrome muncul di daftar update, ketuk Update. Di Android, versi yang sudah di patch berakhiran sembilan puluh dua atau lebih tinggi."),
 ("b5_7", "Bila kamu memakai browser lain yang dibangun dari mesin yang sama, seperti Edge, Brave, atau Opera, periksa juga pembaruannya, karena browser tersebut memakai banyak kode yang sama dengan Chrome."),
 ("b5_8", "Terakhir, pastikan pembaruan otomatis tetap menyala, dan biasakan menutup Chrome sepenuhnya setidaknya sekali sehari."),
 ("b6_1", "Celah seperti ini bukan yang pertama, dan tidak akan menjadi yang terakhir. Browser adalah salah satu program paling rumit di perangkatmu, dan setiap beberapa minggu selalu ada lubang baru yang ditambal."),
 ("b6_2", "Karena itu, pelajaran terpentingnya bukanlah berapa nomor versi browser yang kamu punya hari ini, melainkan kebiasaan. Ketika browser meminta pembaruan atau restart, jangan menundanya sampai besok."),
 ("b6_3", "Kalau kamu sedang belajar membuat software, ada pelajaran kedua. Satu pemeriksaan masukan yang kurang teliti bisa meruntuhkan lapisan pelindung yang dibangun selama bertahun-tahun. Jangan pernah percaya begitu saja kepada data yang datang dari luar."),
 ("b6_4", "Bagikan video ini ke grup keluarga atau grup kelasmu, karena satu perangkat yang belum diperbarui sudah cukup untuk menjadi pintu masuk. Sampai jumpa di video berikutnya."),
 ("b6_99", "Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa faktanya dan disunting oleh manusia. Semua sumber ada di deskripsi."),
]
beats = []
for i, row in enumerate(B):
    bid, text = row[0], row[1]; seg = int(bid[1])
    b = {"id": bid, "text": text, "seg": seg, "scene": "d12_b%d" % seg, "hold": 0.5}
    if len(row) > 2: b["ucap"] = row[2]
    beats.append(b)
for i, b in enumerate(beats):
    if i == 0: b["lead"] = 0.3
    if i + 1 < len(beats) and beats[i + 1]["seg"] != b["seg"]:
        b.update(hold=5.3, cardDelay=2.5, cardFade=0.5); beats[i + 1].update(lead=1.8, cardOut=0.9)
for k, h in {"b5_1": 2.2, "b5_2": 1.6, "b5_3": 1.8, "b5_4": 1.2, "b5_5": 1.8, "b5_6": 2.2, "b5_7": 1.0, "b1_3": 1.2, "b3_5": 1.2}.items():
    next(b for b in beats if b["id"] == k)["hold"] = h
beats[-1].update(hold=20.0, noCam=True)
d = {"episode": "D12", "title": "Google Chrome Punya Celah Keamanan Kritis. Begini Cara Update Google Chrome di Laptop dan HP",
     "kind": "dokumenter", "label": "Dokumenter · I Teach Software Engineering",
     "engine": ["../../_alat/kiko-core.js", "../../_alat/tiktok-core.js", "../../_alat/sinema_dok.js", "../../_alat/short_dok.js", "kit.js", "umum.js", "peraga.js"] + ["bab%d.js" % i for i in range(7)] + ["sfx.js"],
     "parts": {"D12": {"segs": list(range(7))}}, "segments": SEG, "audio_rate": 44100,
     "musik": {"versi": 2, "mood": {"0": "tegang", "1": "misteri", "2": "misteri", "3": "misteri", "4": "tegang", "5": "hangat", "6": "hangat"}},
     "beats": beats}
json.dump(d, open("script.json", "w"), ensure_ascii=False, indent=1)
print(len(beats), "beat;", sum(len(b.get("ucap", b["text"])) for b in beats), "karakter ucap")
