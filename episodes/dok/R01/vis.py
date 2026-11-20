"""Rancangan gambar per beat R01 (ditulis tangan). Menulis vis.js (K.r01vis) yang dibaca adegan.js.
Kunci waktu = potongan teks narasi persis (boleh "frasa@+1.2" untuk geser detik); None = sudah tampil sejak awal; "-" = kotak kosong.
  python3 episodes/dok/R01/vis.py     memeriksa semua frasa lalu menulis vis.js"""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))
A, T, B, V, G, P, R = "amber", "teal", "blue", "violet", "green", "pink", "red"
N = None
RANI = ["Rani", N, "Titik mulainya di sini"]; BAYU2 = ["Bayu", N, "Pastikan logikanya kuat,", "bukan hanya hafal sintaks"]
PERAN = [["Frontend engineer", "Frontend", "Yang dilihat dan disentuh pengguna"], ["Backend engineer", "Backend", "Server, database, aturan bisnis"], ["Mobile engineer", "Mobile", "Aplikasi untuk HP"],
         ["Data engineer", "Data", "Mengalirkan dan merapikan data"], ["DevOps engineer", "DevOps", "Menjaga server dan proses rilis"], ["QA engineer", "QA", "Memastikan aplikasi bekerja"]]
UTUH = [["punya login", "Punya login", "Tiap pengguna hanya melihat datanya"], ["menyimpan data di database", "Data tersimpan di database", "Tidak hilang saat server dimatikan"],
        ["menolak masukan yang salah", "Menolak masukan yang salah", "Misalnya tanggal yang tidak masuk akal"], ["tes otomatis", "Punya tes otomatis"], ["bisa dibuka orang lain", "Bisa dibuka orang lain", "Langkah ini disebut deploy"]]
BIASA = [["Kebiasaan pertama", "Baca dan jelaskan", "Bisa menjelaskan baris demi baris"], ["Kebiasaan kedua", "Uji dengan masukan aneh", "Nol, minus, teks kosong, klik bersamaan"], ["Kebiasaan ketiga", "Kerjakan sebagian tanpa AI", "Lambat, tetapi di situlah kamu tumbuh"]]
MAHAL = [["Yang pertama", "Memahami masalah", "dan berkomunikasi dengan pengguna"], ["Yang kedua", "Merancang sistem", "Data, alur, dan keamanan"], ["Yang ketiga", "Menguji dan meninjau kode", "Termasuk kode buatan AI"], ["Yang keempat", "Memakai AI dengan efektif", "Kapan, cara memerintah, cara memeriksa"]]
README = [["untuk apa", "Aplikasi ini untuk apa?"], ["tampilannya", "Bagaimana tampilannya?"], ["cara menjalankannya", "Bagaimana cara menjalankannya?"], ["Teknologi apa", "Teknologi apa, dan kenapa?"], ["masih ingin kamu perbaiki", "Apa yang masih ingin diperbaiki?"]]
AIKIRI = [["kode yang berulang", "Kode yang berulang"], ["menjelaskan pesan error", "Menjelaskan pesan error"], ["contoh data", "Contoh data"], ["draf tes", "Draf tes"], ["memberi ide", "Ide saat buntu"]]
FR = [["tiga bulan pertama", 0, 3, "Fondasi|Python"], ["Tiga bulan berikutnya", 3, 6, "Git +|2 program|kecil"], ["Enam bulan terakhir", 6, 12, "1 aplikasi web sederhana|+ pilihan kampus"]]
FB = [["tiga bulan pertama", 0, 3, "Perkuat|Git dan SQL"], ["Enam bulan berikutnya", 3, 9, "1 aplikasi utuh|sampai deploy"], ["Tiga bulan terakhir", 9, 12, "Rapikan|portofolio,|cari magang"]]
FT = [["tiga bulan pertama", 0, 3, "1 proyek|nyata"], ["Enam bulan berikutnya", 3, 9, "Menguji, merapikan,|menulis README"], ["Tiga bulan terakhir", 9, 12, "Latihan|wawancara,|lamar magang"]]
lit = lambda L: [[N] + x[1:] for x in L]
slot = lambda L: [["-"] + x[1:] for x in L]

VIS = {
 # ---------- bab 0: pembuka ----------
 "b0_1": dict(k="gd", g="hp", gp=dict(minus=N), items=[["hasil hitungan", "Aplikasi patungan buatan AI"], ["dibayar", "Ada orang yang dibayar", "karena ikut makan?", "-"], ["hitungannya salah", "Terlihat sempurna,", "tetapi hitungannya salah", "-"]]),
 "b0_2": dict(k="gd", g="editor", gp=dict(salah="salah dalam sepuluh detik"), items=[["sepuluh detik", "AI menulis kode dalam 10 detik"], ["salah dalam sepuluh detik", "AI juga bisa salah dalam 10 detik", N, "-"], ["masih perlukah", "Masih perlukah belajar coding?"], ["menggantikan programmer", "\"AI akan menggantikan programmer\""], ["menerjemahkan perintah", "Kalau programmer = hanya", "menerjemahkan perintah jadi kode"]]),
 "b0_3": dict(k="gd", g="lowongan", j=["software engineer adalah hal yang berbeda", "Software engineer itu berbeda"], items=[["lowongan kerja", "Perusahaan masih mencari"], ["hanya bisa mengetik kode", "Bukan yang hanya mengetik kode", N, "-"], ["memeriksa", "Memeriksa", N, "+"], ["memperbaiki", "Memperbaiki", N, "+"], ["bertanggung jawab", "Bertanggung jawab atas kode", N, "+"]]),
 "b0_4": dict(k="peta", j=["peta lengkapnya", "Peta lengkap: dari sekolah sampai kerja pertama"], aktif=-1, janji=[["sedang di tahap mana", "Kamu sedang di tahap mana"], ["dipelajari bulan ini", "Apa yang dipelajari bulan ini"], ["proyek apa", "Proyek untuk portofolio"]]),
 "b0_5": dict(k="gd", g="sertifikat", items=[["satu kesalahan", "Satu kesalahan yang membuat", "lulusan sulit mendapat kerja", "-"], ["sertifikatnya banyak", "Padahal sertifikatnya banyak"], ["tahap tiga", "Kita bahas di tahap 3"]]),
 "b0_6": dict(k="tokoh", j=["tiga orang", "Kita ikuti tiga orang"], siapa=[["Rani", "Rani", "Belum pernah", "menulis kode"], ["Bayu", "Bayu", "Bisa membuat", "halaman web sederhana"]]),
 "b0_7": dict(k="tokoh", j="Kita ikuti tiga orang", siapa=[["Rani", N, "Belum pernah", "menulis kode"], ["Bayu", N, "Bisa membuat", "halaman web sederhana"], ["Tegar", "Tegar", "Belum punya aplikasi", "yang dipakai orang"]], j2=["Mungkin kamu mirip", "Kamu mirip siapa?"]),
 "b0_8": dict(k="peta", j=["lima tahap", "Petanya punya lima tahap"], aktif=-1, nyala=[["fondasi", 0], ["alat kerja", 1], ["membangun aplikasi utuh", 2], ["portofolio", 3], ["magang dan pekerjaan pertama", 4]], ai="Di tengah jalan", janji=[["masih perlukah", "Masih perlukah belajar coding kalau AI bisa menulis kode?"]]),
 "b0_9": dict(k="kutip", bip="think", baris=[["Jawabannya", "Jawabannya ada di bab 7", A, 96], ["tidak seperti yang kamu kira", "Mungkin tidak seperti yang kamu kira", N, 60]]),
 # ---------- bab 1 ----------
 "b1_1": dict(k="gd", g="ojek", gp=dict(tekan="menekan tombol pesan"), j=["tujuannya", "Tujuannya dulu: kerjanya apa?"], items=[["aplikasi yang kamu pakai setiap hari", "Aplikasi yang kamu pakai", "setiap hari"], ["menekan tombol pesan", "Kamu menekan tombol Pesan"], ["banyak hal yang terjadi", "Di baliknya, banyak hal terjadi"]]),
 "b1_2": dict(k="alur", j="Satu ketukan, banyak langkah", langkah=[["Lokasi kamu", "Lokasi|dikirim|ke server", B], ["mencari pengemudi", "Server mencari|pengemudi|terdekat", V], ["harga dihitung", "Harga|dihitung", A], ["disimpan di database", "Pesanan|disimpan di|database", G]]),
 "b1_3": dict(k="kutip", bip="happy", baris=[["Semua itu", "Semua itu dibuat software engineer", N, 64], ["sebagian kecil", "Menulis kode hanya sebagian kecil", A, 80]]),
 "b1_4": dict(k="gd", g="siklus", gp=dict(pre=0, on=[["Pertama", 0], ["Kedua", 1]]), j=["satu siklus", "Siklus kerja software engineer"], items=[["Pertama", "1 · Memahami kebutuhan", "Masalah apa, dan untuk siapa?"], ["Kedua", "2 · Merancang", "Data, halaman, dan hubungannya"]]),
 "b1_5": dict(k="gd", g="siklus", gp=dict(pre=2, on=[["Ketiga", 2], ["Keempat", 3], ["Kelima", 4], ["Keenam", 5]]), j="Siklus kerja software engineer", items=[["Ketiga", "3 · Menulis kode"], ["Keempat", "4 · Menguji", "Sebelum pengguna menemukan bug"], ["Kelima", "5 · Merilis ke server"], ["Keenam", "6 · Merawat", "Bug, fitur baru, cepat, dan aman"]]),
 "b1_6": dict(k="gd", g="siklus", gp=dict(pre=6, putar=1), j="Siklus kerja software engineer", items=[[N, "Setelah itu,", "siklusnya berulang lagi"]]),
 "b1_7": dict(k="dua", j=["bedanya", "Programmer dan software engineer"], kiri=dict(j="Programmer", w=V, items=[["Programmer menulis kode", "Menulis kode"], ["sudah ditentukan orang lain", "Tugasnya ditentukan orang lain"]]), kanan=dict(j="Software engineer", w=A, key="Software engineer bertanggung jawab", items=[["seluruh siklus", "Seluruh siklus"], ["dari memahami masalah", "Dari memahami masalah"], ["sampai merawat", "sampai merawat aplikasinya"]])),
 "b1_8": dict(k="gd", g="siklus", gp=dict(pre=6, sorot=["Bagian menulis kode", 2]), items=[["Setiap software engineer", "Semua software engineer", "bisa memprogram"], ["tidak setiap orang", "Tidak semua yang bisa memprogram", "adalah software engineer"], ["paling banyak dibantu AI", "Menulis kode: bagian yang", "paling banyak dibantu AI"], ["tidak berhenti", "Peta ini tidak berhenti", "di belajar coding"]]),
 "b1_9": dict(k="daftar", kol=2, j=["beberapa peran", "Peran yang sering kamu temui"], items=PERAN[:3] + slot(PERAN[3:])),
 "b1_10": dict(k="daftar", kol=2, j="Peran yang sering kamu temui", items=lit(PERAN[:3]) + PERAN[3:]),
 "b1_11": dict(k="kutip", bip="happy", baris=[["tidak perlu memilih sekarang", "Tidak perlu memilih sekarang", A, 84], ["fondasi yang sama", "Semua mulai dari fondasi yang sama", N, 60], ["Spesialisasi", "Spesialisasi dipilih setelah beberapa aplikasi", T, 52]]),
 "b1_12": dict(k="peta", j="Kita mulai dari stasiun pertama", aktif=0),
 # ---------- bab 2: fondasi ----------
 "b2_1": dict(k="daftar", no=1, j=["paling sering dilewati", "Fondasi: bagian yang paling sering dilewati"], items=[["lima hal", "Cara berpikir"], ["lima hal@+0.35", "Satu bahasa pemrograman pertama"], ["lima hal@+0.7", "Matematika secukupnya"], ["lima hal@+1.05", "Membaca bahasa Inggris"], ["lima hal@+1.4", "Menguasai komputermu sendiri"]]),
 "b2_2": dict(k="gd", g="mi", gp=dict(langkah="tuliskan langkah"), j="1 dari 5 · Cara berpikir", items=[["memecah masalah besar", "Pecah masalah besar", "menjadi langkah-langkah kecil"], ["mi instan", "Latihan: tulis langkah", "membuat mi instan"], ["disalahpahami", "Sampai tidak ada langkah", "yang bisa disalahpahami"]]),
 "b2_3": dict(k="gd", g="mi", gp=dict(langkah=N), j="1 dari 5 · Cara berpikir", items=[[N, "Pecah masalah besar", "menjadi langkah-langkah kecil"], ["kemampuan yang sama", "Kemampuan yang sama", "dipakai programmer setiap hari", "+"]]),
 "b2_4": dict(k="gd", g="bahasa", gp=dict(ks=["Python", "JavaScript", "Java,", "menyerah"]), j="2 dari 5 · Satu bahasa pertama", items=[["Kata kuncinya adalah satu", "Kata kuncinya: SATU"], ["berpindah", "Pemula sering berpindah-pindah"], ["menyerah", "lalu menyerah", N, "-"]]),
 "b2_5": dict(k="gd", g="python", gp=dict(ks=["variabel", "percabangan", "perulangan", "fungsi"]), j=["saran kami adalah Python", "Saran kami: Python"], items=[["mudah dibaca", "Mudah dibaca, jalan di browser", N, "+"], ["variabel", "Variabel"], ["percabangan", "Percabangan"], ["perulangan", "Perulangan"], ["fungsi", "Fungsi"], ["list, dan", "List dan dictionary"], ["Bahasa kedua", "Bahasa kedua jadi lebih cepat", N, "+"]]),
 "b2_6": dict(k="gd", g="logika", gp=dict(ks=["kalkulus", "logika", "persen", "statistik"]), j="3 dari 5 · Matematika", items=[["tidak memakai kalkulus", "Kalkulus? Jarang dipakai"], ["logika", "Logika", "Benar, salah, dan, atau, tidak", "+"], ["aritmetika", "Aritmetika dasar dan persen", N, "+"], ["statistik", "Sedikit statistik", N, "+"]]),
 "b2_7": dict(k="kutip", bip="happy", baris=[["AI atau data", "Tertarik pada AI atau data?", N, 60], ["aljabar linear", "Baru perlu aljabar linear dan peluang", T, 56], ["jangan berhenti", "Jangan berhenti karena merasa", A, 64], ["jangan berhenti@+0.2", "lemah di matematika", A, 64]]),
 "b2_8": dict(k="gd", g="inggris", gp=dict(arti="mencari arti kata"), j="4 dari 5 · Membaca bahasa Inggris", items=[["tidak harus lancar berbicara", "Tidak harus lancar berbicara"], ["dokumentasi", "Dokumentasi, pesan error, forum:", "hampir semua berbahasa Inggris"], ["sampai selesai", "Baca pesan error sampai selesai"], ["mencari arti kata", "Cari arti kata yang belum tahu"]]),
 "b2_9": dict(k="gd", g="folder", gp=dict(ks=["folder mana", "ekstensi", "shortcut"]), j="5 dari 5 · Menguasai komputermu", items=[["tersandung", "Banyak pemula tersandung di sini"], ["folder mana", "Di folder mana file tersimpan?"], ["ekstensi", "Beda ekstensi .py dan .txt"], ["shortcut", "Shortcut: copy, paste, undo"]]),
 "b2_10": dict(k="gd", g="folder", gp=dict(ks=[N, N, N]), j="5 dari 5 · Menguasai komputermu", items=[["lebih sering memakai HP", "Lebih sering memakai HP?"], ["latihlah", "Latih dulu di laptop", "atau komputer lab sekolah", "+"]]),
 "b2_11": dict(k="tokoh", j="Tahap 1 untuk tiga teman kita", siapa=[["Rani", "Untuk Rani", "Titik mulainya di sini"], ["Bayu", "Untuk Bayu", "Pastikan logikanya kuat,", "bukan hanya hafal sintaks"]]),
 "b2_12": dict(k="tokoh", j="Tahap 1 untuk tiga teman kita", siapa=[RANI, BAYU2, ["Tegar", "Untuk Tegar", "Cek ulang: bisa menulis", "program tanpa contoh?"]]),
 "b2_13": dict(k="catatan", j="Catatan AI · Tahap 1", baris=[["guru, bukan sebagai joki", "Pakai AI sebagai guru, bukan joki"], ["menjelaskan kenapa", "Minta AI menjelaskan kenapa kodemu salah"], ["tulis sendiri", "Tulis sendiri perbaikannya", N, "+"], ["otakmu tidak ikut berlatih", "Kalau AI menulis semuanya, otakmu tidak berlatih", N, "-"]]),
 "b2_14": dict(k="tonton", j="Kalau kamu ada di tahap ini", video="Game Tebak Angka dengan Python", sub="Program pertamamu, dari nol", key="Game Tebak Angka", gbr="tebak"),
 # ---------- bab 3: alat kerja ----------
 "b3_1": dict(k="gd", g="tukang", gp=dict(ks=["gergaji", "palu", "meteran", "Software engineer juga"]), items=[["Tukang kayu", "Tukang kayu yang hebat", "pandai memakai alatnya"], ["Software engineer juga", "Software engineer juga", "punya alat kerja"], ["siap bekerja di tim", "Alat inilah tanda", "siap bekerja di tim", "+"]]),
 "b3_2": dict(k="gd", g="vscode", gp=dict(ks=["membuka folder proyek", "menulis kode", "menjalankan program"]), j="Alat 1 · Code editor", items=[["VS Code", "Paling banyak dipakai: VS Code"], ["membuka folder proyek", "Membuka folder proyek"], ["menulis kode", "Menulis kode"], ["menjalankan program", "Menjalankan program"]]),
 "b3_3": dict(k="gd", g="terminal", gp=dict(lines=[["pindah folder", "cd proyek"], ["melihat isi folder", "ls"], ["menjalankan program", "python app.py"]]), j="Alat 2 · Terminal", items=[["layar hitam", "Layar hitam untuk mengetik perintah"], ["belasan perintah", "Cukup belasan perintah untuk mulai"], ["pindah folder", "Pindah folder"], ["melihat isi folder", "Melihat isi folder"], ["menjalankan program", "Menjalankan program"]]),
 "b3_4": dict(k="gd", g="terminal", gp=dict(lines=[[N, "cd proyek"], [N, "ls"], [N, "python app.py"], ["dipasang", "pip install flask"]]), j="Alat 2 · Terminal", items=[["Hampir semua alat", "Alat pemrograman modern", "dipasang dan dijalankan di sini"]]),
 "b3_5": dict(k="gd", g="git", gp=dict(ks=["riwayat", "kembali ke versi sebelumnya", "menggabungkan"]), j="Alat 3 · Git, yang paling penting", items=[["riwayat", "Menyimpan riwayat perubahan"], ["kembali ke versi sebelumnya", "Bisa kembali ke versi lama"], ["menggabungkan", "Menggabungkan kerja tim", "tanpa saling menimpa"]]),
 "b3_6": dict(k="gd", g="github", gp=dict(), j=["GitHub", "GitHub"], items=[["menyimpan kode secara online", "Kode tersimpan online"], ["etalase portofoliomu", "Etalase portofoliomu nanti", N, "+"]]),
 "b3_7": dict(k="gd", g="error", gp=dict(merah="tulisan merah", ks=["apa yang salah", "file mana", "baris berapa"]), j="Alat 4 · Membaca pesan error", items=[["panik", "Pemula panik melihat tulisan merah"], ["petunjuk", "Padahal, pesan error adalah petunjuk"], ["apa yang salah", "Apa yang salah"], ["file mana", "Di file mana"], ["baris berapa", "Di baris berapa"]]),
 "b3_8": dict(k="gd", g="error", gp=dict(merah=N, ks=["-", "-", "-"], bawah="baris paling bawah"), j="Alat 4 · Membaca pesan error", items=[["baris paling bawah", "Baca dari baris paling bawah"], ["inti masalahnya", "Di sanalah inti masalahnya", N, "+"]]),
 "b3_9": dict(k="alur", j="Alat 5 · Cara mencari jawaban", langkah=[["salin pesan error-nya", "Salin|pesan error", R], ["cari di internet", "Cari, atau|tanya AI", B], ["pahami jawabannya", "Pahami|jawabannya", A], ["sebelum menyalinnya", "Baru|dipakai", G]], bawah=[["Kalau bertanya", "Saat bertanya, sertakan:"], ["apa yang sudah kamu coba", "yang sudah dicoba"], ["pesan error-nya, dan", "pesan error"], ["potongan kode", "potongan kode"]]),
 "b3_10": dict(k="catatan", j="Catatan AI · Tahap 2", baris=[["asisten AI di dalam editor", "Asisten AI di editor sangat membantu", N, "+"], ["tetap paham", "Tetap pahami setiap perintah Git"], ["satu perintah yang salah", "Satu perintah salah bisa menghapus kerja berhari-hari", N, "-"]]),
 "b3_11": dict(k="tonton", j="Kalau kamu ada di tahap ini", video="Seri Git dan Kerja Tim", sub="6 video pendek, sampai pull request", key="seri Git dan Kerja Tim", gbr="git"),
 # ---------- bab 4: aplikasi utuh ----------
 "b4_1": dict(k="gd", g="sertifikat", gp=dict(mulai="kursus demi kursus"), j=["Banyak orang terjebak", "Jebakan di tahap 3"], items=[["mengubah", "Dari belajar coding", "menjadi bisa membuat sesuatu"], ["kursus demi kursus", "Kursus demi kursus"], ["mengumpulkan sertifikat", "Sertifikat menumpuk"], ["tidak pernah menyelesaikan", "Tidak ada aplikasi yang selesai", N, "-"], ["Inilah kesalahan", "Inilah kesalahan dari awal video"]]),
 "b4_2": dict(k="kutip", bip="happy", baris=[["satu aplikasi", "1 aplikasi yang benar-benar jadi", G, 84], ["jauh lebih berharga", "jauh lebih berharga daripada", N, 56], ["sepuluh kursus", "10 kursus yang hanya ditonton", R, 68]]),
 "b4_3": dict(k="gd", g="lapis", gp=dict(pre=0, on=[["Lapisan pertama", 0]]), j=["tiga lapisan", "Tiga lapisan aplikasi web"], items=[["Lapisan pertama", "Lapisan 1 · Tampilan"], ["HTML", "HTML untuk isi"], ["CSS", "CSS untuk gaya"], ["JavaScript", "JavaScript supaya bisa bereaksi"]]),
 "b4_4": dict(k="gd", g="lapis", gp=dict(pre=1, on=[["Lapisan kedua", 1], ["Lapisan ketiga", 2]]), j="Tiga lapisan aplikasi web", items=[["Lapisan kedua", "Lapisan 2 · Server (backend)"], ["menerima permintaan", "Menerima permintaan,", "menjalankan aturan"], ["boleh dan tidak boleh", "Memutuskan apa yang boleh"], ["Lapisan ketiga", "Lapisan 3 · Database", "Tempat data disimpan dengan aman"]]),
 "b4_5": dict(k="x", f="pelayan", j=["API", "API: seperti pelayan di warung"], ks=["pelayan di warung", "tidak masuk ke dapur", "memesan ke pelayan", "membawakan pesananmu"]),
 "b4_6": dict(k="daftar", w=1300, j=["satu jalur saja", "Backend: pilih satu jalur saja"], items=[["Jalur JavaScript", "JavaScript", "memakai Node.js"], ["Jalur PHP", "PHP", "memakai Laravel, banyak dipakai di Indonesia"], ["Jalur Python", "Python", "memakai Django atau FastAPI"], ["Untuk database", "Database", "pelajarilah SQL"]]),
 "b4_7": dict(k="kutip", bip="happy", baris=[["puluhan tahun", "SQL sudah dipakai puluhan tahun", T, 76], ["hampir semua perusahaan", "dan masih dipakai hampir semua perusahaan", N, 58]]),
 "b4_8": dict(k="daftar", w=1300, cek=1, j=["disebut utuh", "Kapan aplikasi disebut utuh?"], items=UTUH[:2] + slot(UTUH[2:])),
 "b4_9": dict(k="daftar", w=1300, cek=1, j="Kapan aplikasi disebut utuh?", items=lit(UTUH[:2]) + UTUH[2:]),
 "b4_10": dict(k="tokoh", j="Tahap 3 untuk tiga teman kita", siapa=[["Bayu", "Bayu", "Sampai di sini saat kelas 12,", "lewat proyek akhir"], ["Tegar", "Tegar", "Aplikasinya baru berjalan", "di laptop sendiri"]]),
 "b4_11": dict(k="tokoh", j="Tahap 3 untuk tiga teman kita", siapa=[["Bayu", N, "Sampai di sini saat kelas 12,", "lewat proyek akhir"], ["Tegar", N, "Aplikasinya baru berjalan", "di laptop sendiri"], ["Rani", "Untuk Rani", "Mulai di akhir SMA atau", "tahun pertama kuliah"]]),
 "b4_12": dict(k="catatan", j="Catatan AI · Tahap 3", baris=[["terlihat jadi dalam beberapa menit", "AI membuat aplikasi yang terlihat jadi"], ["belum tentu benar", "Terlihat jadi belum tentu benar"], ["slot yang sama", "Dua orang memesan slot yang sama", N, "-"], ["bocor", "Data bocor ke pengguna lain", N, "-"], ["meleset", "Hitungan uang meleset", N, "-"]]),
 "b4_13": dict(k="gd", g="lapis", gp=dict(pre=3, putar=1), items=[["benar-benar paham", "Kamu baru benar-benar paham"], ["menjelaskan setiap lapisan", "kalau bisa menjelaskan", "setiap lapisan aplikasimu"], ["tanpa membuka AI", "tanpa membuka AI", N, "+"]]),
 "b4_14": dict(k="tonton", j="Kalau kamu ada di tahap ini", video="Sistem Antrean dari Nol", sub="Node.js dan PostgreSQL, sampai deploy", key="Sistem Antrean dari Nol", gbr="siantre", juga=["SiLapor", "Lebih suka PHP? SiLapor dengan Laravel dan MySQL", "silapor"]),
 # ---------- bab 5: jalur ----------
 "b5_1": dict(k="gd", g="jalur", gp=dict(aktif=-1, muncul="empat jalur utama"), j=["setelah lulus", "Setelah lulus, aku harus ke mana?"], items=[["empat jalur utama", "Ada empat jalur utama"], ["Semuanya bisa", "Semuanya bisa membawamu", "menjadi software engineer", "+"], ["untung dan rugi", "Masing-masing punya", "untung dan rugi"]]),
 "b5_2": dict(k="gd", g="jalur", gp=dict(aktif=0), j="Jalur 1 · Kuliah S1", items=[["jurusan Informatika", "Informatika, Ilmu Komputer,", "Sistem Informasi, RPL"], ["dasar teori yang kuat", "Dasar teori yang kuat", "Struktur data, algoritma, jaringan", "+"]]),
 "b5_3": dict(k="gd", g="jalur", gp=dict(aktif=0), j="Jalur 1 · Kuliah S1", items=[["ijazah", "Ijazah masih diminta", "banyak perusahaan dan instansi", "+"], ["waktunya lama", "Waktu lama, biaya tidak sedikit", N, "-"], ["tidak selalu mengajarkan", "Alat industri tidak selalu diajarkan", N, "-"], ["membangun proyek sendiri", "Tetap bangun proyek sendiri"]]),
 "b5_4": dict(k="gd", g="jalur", gp=dict(aktif=1), j="Jalur 2 · Vokasi, D3 atau D4", items=[["Porsi praktiknya", "Porsi praktik lebih besar", N, "+"], ["ada magang", "Biasanya ada magang", N, "+"], ["cepat siap kerja", "Cepat siap kerja,", "tetap punya gelar", "+"]]),
 "b5_5": dict(k="gd", g="jalur", gp=dict(aktif=2), j="Jalur 3 · Langsung bekerja", items=[["perusahaan rintisan", "Perusahaan rintisan, software", "house, atau pekerja lepas"], ["portofoliomu harus meyakinkan", "Syarat: portofolio meyakinkan"], ["kuliah sambil bekerja", "Banyak yang kemudian", "kuliah sambil bekerja"]]),
 "b5_6": dict(k="gd", g="jalur", gp=dict(aktif=3), j="Jalur 4 · Mandiri atau bootcamp", items=[["lebih murah", "Lebih murah dan lebih singkat", N, "+"], ["disiplin yang sangat tinggi", "Butuh disiplin sangat tinggi", N, "-"], ["tanpa gelar", "Tidak semua perusahaan", "menerima pelamar tanpa gelar", "-"]]),
 "b5_7": dict(k="daftar", w=1300, cek=1, j=["Sebelum membayar bootcamp", "Sebelum membayar bootcamp, periksa dulu"], items=[["apa yang benar-benar diajarkan", "Apa yang benar-benar diajarkan"], ["siapa pengajarnya", "Siapa pengajarnya"], ["ke mana lulusannya bekerja", "Ke mana lulusannya bekerja"]], bawah=["Jangan hanya percaya", "Jangan hanya percaya pada iklannya"]),
 "b5_8": dict(k="gd", g="tokoh1", gp=dict(nama="Rani"), j="Bagaimana dengan Rani yang dari SMA?", items=[["tidak menutup jalanmu", "Jurusan SMA tidak menutup jalanmu", N, "+"], ["jurusan apa pun", "Dari jurusan apa pun bisa", N, "+"], ["periksa syarat masuk", "Periksa syarat masuk kampus"], ["nilai matematika", "Ada yang meminta", "nilai matematika tertentu"]]),
 "b5_9": dict(k="gd", g="tokoh1", gp=dict(nama="Rani"), j="Bagaimana dengan Rani yang dari SMA?", items=[["mulailah dari tahap fondasi", "Mulai fondasi sejak sekarang"], ["program kecil", "Masuk kuliah sudah bisa", "membuat program kecil"], ["jauh lebih santai", "Tahun pertama jauh lebih santai", N, "+"]]),
 "b5_10": dict(k="gd", g="jalur", gp=dict(aktif=9, satu="menyatu lagi"), j="Apa pun jalurmu", items=[["menyatu lagi", "Keempat jalur menyatu lagi"], ["portofolio", "di stasiun yang sama:", "portofolio"], ["apa yang sudah kamu buat", "Yang dilihat perusahaan:", "apa yang sudah kamu buat", "+"]]),
 # ---------- bab 6: portofolio ----------
 "b6_1": dict(k="gd", g="bukti", gp=dict(ks=["tidak bisa langsung percaya", "link ke aplikasi", "kode yang bisa dibaca"]), j="Portofolio adalah bukti", items=[["menulis di CV", "Tulisan di CV belum tentu dipercaya"], ["link ke aplikasi", "Link aplikasi yang bisa dicoba", N, "+"], ["kode yang bisa dibaca", "Kode yang bisa dibaca", N, "+"], ["ceritanya menjadi lain", "Ceritanya menjadi lain"]]),
 "b6_2": dict(k="dua", j=["bandingkan", "Bandingkan dua portofolio ini"], kiri=dict(j="20 repository tutorial", w=R, g="repo20", key="Yang kiri", items=[["mirip-mirip", "Namanya mirip-mirip"], ["tidak ada penjelasan", "Tidak ada penjelasan"], ["satu commit", "Semua dalam satu commit"]]), kanan=dict(j="3 proyek", w=G, g="repo3", key="Yang kanan", items=[])),
 "b6_3": dict(k="dua", j="Bandingkan dua portofolio ini", kiri=dict(j="20 repository tutorial", w=R, g="repo20", items=[[N, "Namanya mirip-mirip"], [N, "Tidak ada penjelasan"], [N, "Semua dalam satu commit"]]), kanan=dict(j="3 proyek", w=G, g="repo3", items=[["README yang jelas", "README yang jelas"], ["tangkapan layar", "Tangkapan layar"], ["link demo", "Link demo"], ["riwayat commit", "Riwayat commit yang rapi"]]), bawah=["mana yang lebih meyakinkan", "Mana yang lebih meyakinkan?"]),
 "b6_4": dict(k="gd", g="tangga", gp=dict(pre=0, on=[["Proyek pertama", 0], ["Proyek kedua", 1]]), j=["tiga proyek yang bertingkat", "Buat tiga proyek yang bertingkat"], items=[["Proyek pertama", "1 · Proyek kecil", "Selesai dalam 1 sampai 2 minggu"], ["kalkulator patungan", "Kalkulator patungan, daftar tugas"], ["Proyek kedua", "2 · Aplikasi web lengkap", "Dengan login dan database"], ["sistem peminjaman alat", "Sistem peminjaman alat sekolah"]]),
 "b6_5": dict(k="gd", g="tangga", gp=dict(pre=2, on=[["Proyek ketiga", 2]]), j="Buat tiga proyek yang bertingkat", items=[["Proyek ketiga", "3 · Masalah nyata", "untuk orang nyata"], ["sistem antrean untuk klinik", "Sistem antrean untuk klinik"], ["warung tetanggamu", "Pencatatan untuk warung tetangga"]]),
 "b6_6": dict(k="gd", g="tangga", gp=dict(pre=3, sorot=2), j="Buat tiga proyek yang bertingkat", items=[["paling sering ditanyakan", "Paling sering ditanyakan", "saat wawancara"], ["masalahnya apa", "Masalahnya apa?"], ["keputusannya apa", "Keputusannya apa?"], ["apa yang kamu pelajari", "Apa yang kamu pelajari?"]]),
 "b6_7": dict(k="daftar", w=1300, no=1, j=["lima pertanyaan", "README yang baik menjawab 5 pertanyaan"], items=README),
 "b6_8": dict(k="daftar", w=1300, no=1, sorot=4, j="README yang baik menjawab 5 pertanyaan", items=lit(README), bawah=["jujur", "Tanda kamu jujur dan paham batas aplikasimu"]),
 "b6_9": dict(k="catatan", j="Catatan AI · Tahap 4", baris=[["bisa dibuat dengan cepat", "Perekrut tahu aplikasi bisa dibuat cepat"], ["paham isinya", "Yang dinilai: apakah kamu paham isinya"], ["bagian mana yang dibantu AI", "Tulis di README bagian yang dibantu AI"], ["periksa dan perbaiki", "dan apa yang kamu periksa dan perbaiki", N, "+"]]),
 "b6_10": dict(k="kutip", bip="happy", baris=[["Kejujuran", "Kejujuran ini justru", A, 80], ["nilai tambah", "menjadi nilai tambah", A, 80]]),
 "b6_11": dict(k="gd", g="github", gp=dict(url="github.com/listyantidewi1", repo=["SiAntre", "SiLapor"]), j="Contoh portofolio: SiAntre dan SiLapor", items=[["repository SiAntre", "Repository SiAntre dan SiLapor"], ["Alamatnya", "github.com/listyantidewi1", N, "+"], ["README-nya", "Lihat cara README ditulis"], ["riwayat commit-nya", "Riwayat commit disusun per bab"]]),
 # ---------- bab 7: jangan hanya percaya AI ----------
 "b7_1": dict(k="kutip", bip="think", baris=[["pertanyaan dari awal video", "Pertanyaan dari awal video:", N, 56], ["masih perlukah", "Masih perlukah belajar coding", A, 84], ["kalau AI", "kalau AI sudah bisa menulis kode?", N, 64]]),
 "b7_2": dict(k="dua", j=["perlu, tetapi", "Perlu, tetapi cara belajarnya berubah"], kiri=dict(j="Menulis kode", w=V, key="sangat pandai menulis kode", g="kodeai", items=[["sangat pandai menulis kode", "AI sudah sangat pandai"]]), kanan=dict(j="Membangun software", w=A, key="tidak sama", items=[["yang benar", "yang benar,"], ["aman", "aman,"], ["bisa dirawat", "dan bisa dirawat"], ["semakin dibutuhkan", "Manusia makin dibutuhkan"]])),
 "b7_3": dict(k="gd", g="hp", gp=dict(voucher="voucher", minus="menjadi minus"), j="Contoh nyata dari kanal ini", items=[["aplikasi patungan", "AI membuat aplikasi patungan"], ["terlihat sempurna", "Aplikasinya terlihat sempurna"], ["voucher", "Voucher lebih besar dari belanja"], ["menjadi minus", "Hasilnya menjadi minus", N, "-"], ["dibayar karena makan", "Orang malah dibayar karena makan"]]),
 "b7_4": dict(k="gd", g="hp", gp=dict(voucher=N, minus=N), j="Contoh nyata dari kanal ini", items=[["tidak menyadarinya", "AI tidak menyadarinya", N, "-"], ["mengujinya sendiri", "Ketahuan saat kami menguji sendiri"], ["cara menghitung", "Paham cara menghitung", "dan cara menguji", "+"], ["tidak akan menemukan", "Tanpa itu, bug seperti ini lolos", N, "-"]], bawah=[N, "Tonton lengkap: Vibe Coding yang Benar"]),
 "b7_5": dict(k="dua", j=["boleh diserahkan ke AI", "AI dan kamu: siapa mengerjakan apa?"], kiri=dict(j="Boleh dibantu AI", w=T, items=AIKIRI), kanan=dict(j="Tetap tanggung jawabmu", w=A, key="tanggung jawabmu", items=[["kebutuhan pengguna", "Memahami kebutuhan pengguna"]])),
 "b7_6": dict(k="dua", j="AI dan kamu: siapa mengerjakan apa?", kiri=dict(j="Boleh dibantu AI", w=T, items=lit(AIKIRI)), kanan=dict(j="Tetap tanggung jawabmu", w=A, items=[[N, "Memahami kebutuhan pengguna"], ["desain dan keamanan", "Desain dan keamanan"], ["memeriksa apakah hasilnya benar", "Memeriksa hasilnya"], ["saat aplikasinya rusak", "Bertanggung jawab saat rusak"]]), bawah=["Itu salah AI", "Kamu tidak bisa berkata, \"Itu salah AI.\""]),
 "b7_7": dict(k="daftar", w=1300, no=1, j=["tiga kebiasaan", "Tiga kebiasaan supaya tidak jadi operator AI"], items=BIASA[:1] + slot(BIASA[1:])),
 "b7_8": dict(k="daftar", w=1300, no=1, j="Tiga kebiasaan supaya tidak jadi operator AI", items=lit(BIASA[:1]) + BIASA[1:]),
 "b7_9": dict(k="daftar", w=1300, no=1, j=["makin berharga", "Keterampilan yang makin berharga di era AI"], items=MAHAL[:3] + slot(MAHAL[3:])),
 "b7_10": dict(k="daftar", w=1300, no=1, j="Keterampilan yang makin berharga di era AI", items=lit(MAHAL[:3]) + MAHAL[3:], bawah=["paham dasarnya", "Hanya bisa dikuasai kalau paham dasarnya"]),
 "b7_11": dict(k="peta", j="Peta tadi tetap berlaku", aktif=-1, lari="lebih cepat", janji=[["tidak membuatnya lebih pendek", "AI tidak membuatnya lebih pendek"], ["lebih cepat", "Tiap tahap bisa lebih cepat"], ["berpikir sendiri", "asalkan tetap berpikir sendiri"]]),
 "b7_12": dict(k="tonton", j="Lanjutkan di kanal ini", video="Vibe Coding yang Benar", sub="Cara memakai AI dengan benar", key="Vibe Coding yang Benar", gbr="patungan", juga=["Apa yang Akan Terjadi", "Apa yang Akan Terjadi pada Software Engineer di Masa Depan?", "d06"]),
 # ---------- bab 8: magang dan kerja pertama ----------
 "b8_1": dict(k="peta", j=["pekerjaan pertama", "Stasiun 5: masuk ke pekerjaan pertama"], aktif=4, nyala=[["fondasi", 0], ["alat kerja", 1], ["aplikasi utuh", 2], ["portofolio", 3], ["pekerjaan pertama", 4]]),
 "b8_2": dict(k="gd", g="cv", gp=dict(ks=["link GitHub", "Untuk setiap proyek", "dua puluh bahasa", "-"]), j=["CV satu halaman", "CV satu halaman"], items=[["link GitHub", "Link GitHub dan demo", "di bagian paling atas", "+"], ["Untuk setiap proyek", "Tiap proyek: masalah,", "teknologi, dan hasilnya", "+"], ["dua puluh bahasa", "Jangan menulis 20 bahasa", N, "-"]]),
 "b8_3": dict(k="gd", g="cv", gp=dict(ks=[N, N, N, "Tiga"]), j="CV satu halaman", items=[[N, "Jangan menulis 20 bahasa", N, "-"], ["Tiga", "Tiga yang benar-benar kamu pakai", "jauh lebih meyakinkan", "+"]]),
 "b8_4": dict(k="daftar", kol=2, j=["tidak harus langsung kerja tetap", "Pengalaman pertama tidak harus kerja tetap"], items=[["Magang", "Magang", "dari sekolah atau kampus"], ["UMKM", "Proyek untuk UMKM", "di sekitarmu"], ["organisasi sekolah", "Aplikasi untuk", "organisasi sekolah"], ["open source", "Ikut proyek", "open source"]], bawah=["pengalaman nyata", "Semuanya adalah pengalaman nyata"]),
 "b8_5": dict(k="kutip", bip="happy", baris=[["pekerjaan pertama", "Banyak pekerjaan pertama datang dari", N, 58], ["melihat hasil kerjanya", "orang yang pernah melihat hasil kerjamu", A, 68]]),
 "b8_6": dict(k="daftar", w=1300, no=1, j="Bagian wawancara software engineer", items=[["tes logika", "Tes logika atau live coding", "Menulis kode sambil diperhatikan"], ["pertanyaan tentang proyekmu", "Pertanyaan tentang proyekmu"], ["bekerja dalam tim", "Cara kamu bekerja dalam tim"]], bawah=["bicaralah sambil berpikir", "Saat live coding, bicaralah sambil berpikir"]),
 "b8_7": dict(k="gd", g="wawancara", gp=dict(ks=[N, "Diam terlalu lama"]), j="Saat live coding", items=[["cara kamu memecah masalah", "Yang dilihat: cara memecah masalah", N, "+"], ["bukan hanya jawaban akhirnya", "Bukan hanya jawaban akhir"], ["katakan apa yang sedang kamu coba", "Buntu? Katakan apa", "yang sedang kamu coba", "+"], ["Diam terlalu lama", "Diam terlalu lama", "membuat pewawancara bingung", "-"]]),
 "b8_8": dict(k="alur", j=["satu bug tersulit", "Siapkan cerita: satu bug tersulit"], langkah=[["bagaimana kamu menemukannya", "Cara|menemukannya", B], ["apa penyebabnya", "Apa|penyebabnya", A], ["bagaimana kamu memperbaikinya", "Cara|memperbaikinya", G]], bawah=[["kode buatan AI", "Bug dari kode buatan AI yang kamu tangkap?"], ["ceritakan juga", "Ceritakan juga"]]),
 "b8_9": dict(k="kutip", bip="happy", baris=[["Cerita seperti ini", "Cerita seperti ini menunjukkan", N, 60], ["keterampilan yang sedang dicari", "keterampilan yang dicari perusahaan", A, 72]]),
 "b8_10": dict(k="catatan", j="Catatan AI · Tahap 5", baris=[["membolehkan", "Banyak perusahaan mengharapkan kamu memakai AI"], ["tanpa AI", "Tapi wawancara bisa tanpa AI"], ["menjelaskan kode buatan AI", "atau kamu diminta menjelaskan kode buatan AI"], ["Latihlah keduanya", "Latihlah keduanya", N, "+"]]),
 "b8_11": dict(k="daftar", w=1300, cek=1, j=["tahun belajar", "Tahun pertamamu adalah tahun belajar"], items=[["Bertanyalah", "Bertanya dengan sopan"], ["bacalah kode orang lain", "Membaca kode orang lain"], ["pull request", "Minta masukan untuk setiap pull request"]], bawah=["cepat belajar dari kesalahan", "Hebat = cepat belajar dari kesalahan"]),
 # ---------- bab 9: penutup ----------
 "b9_1": dict(k="tokoh", j="Rencana 12 bulan untuk tiga teman kita", siapa=[["Rani", N], ["Bayu", N], ["Tegar", N]]),
 "b9_2": dict(k="x", f="rencana", j="Rencana 12 bulan", rows=[["Rani", FR]], aktif=0),
 "b9_3": dict(k="x", f="rencana", j="Rencana 12 bulan", rows=[["Rani", FR], ["Bayu", FB]], aktif=1),
 "b9_4": dict(k="x", f="rencana", j="Rencana 12 bulan", rows=[["Rani", FR], ["Bayu", FB], ["Tegar", FT]], aktif=2),
 "b9_5": dict(k="gd", g="pdf", j="Unduh gratis", items=[["Rencana dua belas bulan", "Rencana 12 bulan, tiga jalur"], ["daftar periksa", "Daftar periksa satu halaman"], ["deskripsi", "Link-nya ada di deskripsi", N, "+"]]),
 "b9_6": dict(k="peta", j=["bukan lomba lari", "Peta ini bukan lomba lari"], aktif=-1, janji=[["satu tahun", "Ada yang sampai dalam 1 tahun"], ["empat tahun", "Ada yang butuh 4 tahun"], ["terus bergerak", "Terus bergerak dan terus membuat sesuatu"]]),
 "b9_7": dict(k="kutip", bip="happy", baris=[["naskah video ini", "Naskah video ini disusun dengan bantuan AI,", N, 54], ["Claude", "termasuk Claude buatan Anthropic,", N, 54], ["diperiksa", "lalu diperiksa dan disunting oleh manusia.", A, 54]]),
 "b9_8": dict(k="x", f="akhir", ks=["Sistem Antrean dari Nol", "Sampai jumpa"]),
}

def keys(o):
    """Semua kunci frasa di dalam satu rancangan."""
    out = []
    def walk(x, name=""):
        if isinstance(x, dict):
            for kk, vv in x.items():
                if kk in ("key", "salah", "tekan", "langkah", "arti", "merah", "bawah_k", "muncul", "satu", "voucher", "minus", "ai", "lari") and isinstance(vv, str): out.append(vv)
                elif kk in ("j", "j2") and isinstance(vv, list): out.append(vv[0])
                elif kk in ("ks",): out.extend(v for v in vv if isinstance(v, str))
                elif kk == "bawah" and isinstance(vv, str): out.append(vv)
                elif kk == "sorot" and isinstance(vv, list): out.append(vv[0])
                elif kk == "juga": out.append(vv[0])
                elif kk == "rows": [out.append(f[0]) for r in vv[-1:] for f in r[1]]
                elif kk == "bawah" and isinstance(vv, list): out.extend([vv[0]] if not isinstance(vv[0], list) else [z[0] for z in vv])
                elif kk in ("items", "baris", "siapa", "langkah", "janji", "nyala", "on", "lines") and isinstance(vv, list):
                    for it in vv: out.append(it[1] if kk == "siapa" else it[0])
                else: walk(vv)
    walk(o); return [k for k in out if isinstance(k, str) and k != "-"]

if __name__ == "__main__":
    beats = {b["id"]: b["text"] for b in json.load(open(os.path.join(D, "beats.json"), encoding="utf-8"))["beats"]}
    bad = 0
    for bid in beats:
        if bid not in VIS: print("BELUM ADA:", bid); bad += 1
    for bid, v in VIS.items():
        for k in keys(v):
            ph = re.sub(r"@[+-][\d.]+$", "", k)
            if ph not in beats[bid]: print("FRASA TIDAK ADA:", bid, repr(ph)); bad += 1
    open(os.path.join(D, "vis.js"), "w", encoding="utf-8").write("/* dibuat vis.py; jangan disunting tangan */\n(function (g) { g.Kiko.r01vis = " + json.dumps(VIS, ensure_ascii=False) + "; })(typeof window !== \"undefined\" ? window : globalThis);\n")
    cues = []
    for bid, v in VIS.items():
        seen = set()
        def add(k, kind, amp):
            if not isinstance(k, str) or k == "-": return
            m = re.match(r"^(.*)@([+-][\d.]+)$", k); ph, off = (m.group(1), float(m.group(2))) if m else (k, 0.0)
            if (ph, off) in seen: return
            seen.add((ph, off)); cues.append([bid, ph, round(off - 0.2, 2), kind, amp])
        for it in v.get("items", []) + v.get("baris", []) + v.get("kiri", {}).get("items", []) + v.get("kanan", {}).get("items", []):
            add(it[0], "clack" if len(it) > 3 and it[3] == "-" else "shimmer" if len(it) > 3 and it[3] == "+" else "pop", 0.3)
        for it in v.get("langkah", []) if isinstance(v.get("langkah"), list) else []: add(it[0], "pop", 0.35)
        for it in v.get("nyala", []) + v.get("janji", []): add(it[0], "pop", 0.3)
        for it in v.get("siapa", []): add(it[1], "pop", 0.35)
        for r in v.get("rows", [])[-1:]:
            for f in r[1]: add(f[0], "pop", 0.35)
        if v.get("k") == "tonton": add(v["key"], "whoosh", 0.4)
    open(os.path.join(D, "sfx.js"), "w", encoding="utf-8").write("/* dibuat vis.py: isyarat efek suara mengikuti munculnya butir di layar */\n(function (g) { const K = g.Kiko; K.sfxParts = K.sfxParts || {};\n  K.sfx = TL => Object.keys(K.sfxParts).flatMap(k => K.sfxParts[k](TL) || []).filter(Boolean).sort((a, b) => a[0] - b[0]);\n  K.sfxAt = (TL, id, phrase, off, kind, amp = 1) => { const b = TL.beats.find(x => x.id === id); if (!b) return null; return [+(b.start + (phrase ? K.dok.at(b, phrase) : 0) + off).toFixed(3), kind, amp]; };\n  const C = " + json.dumps(cues, ensure_ascii=False) + ";\n  K.sfxParts.r01 = TL => C.map(c => K.sfxAt(TL, c[0], c[1], c[2], c[3], c[4]));\n})(typeof window !== \"undefined\" ? window : globalThis);\n")
    print(len(VIS), "rancangan,", bad, "masalah,", len(cues), "isyarat sfx")
