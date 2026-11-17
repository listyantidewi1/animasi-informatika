# Rencana video "Vibe Coding Aplikasi HP dari Nol: Patungan".
# Setiap bab = daftar beat. Beat = (teks narasi, [bagian visual...]).
# Bagian visual:
#   R(src, a, b, crop, ...)  rekaman layar laptop (VS Code / DevTools), a/b = nama tanda atau detik, bisa "tanda+2.5"
#   K(src, prompt_tanda, crop) ketik prompt (a..akhir ketik), lalu W(...) AI bekerja dipercepat
#   H(src, a, b, cap)       rekaman HP dalam bingkai, keterangan di kiri
#   A(nama, **arg)          adegan kanvas (adegan.js)
import json
PROMPT = json.load(open("/home/user/vibe/prod/prompts.json"))

def R(src, a, b, crop="full", speed=1.0, maks=1.6, lab=None, **k): return dict(k="rek", src=src, a=a, b=b, crop=crop, speed=speed, maks=maks, lab=lab, **k)
def H(src, a, b, cap="", speed=1.0, maks=1.6, lab=None, **k): return dict(k="hp", src=src, a=a, b=b, cap=cap, speed=speed, maks=maks, lab=lab, **k)
def A(nama, min=4, bobot=1, **arg): return dict(k="adegan", nama=nama, min=min, bobot=bobot, a=arg)
def ketik(src, tanda, crop="termD"):
    p = PROMPT[f"{src}:{tanda}"]; L = p["n"] / p["cps"] * 1.2 + 1.2
    return R(src, tanda, f"{tanda}+{L:.1f}", crop, speed=1.5, maks=2.5, lab="Prompt")
def kerja(src, tanda, jadi, crop="termD", maks=10):
    p = PROMPT[f"{src}:{tanda}"]; L = p["n"] / p["cps"] * 1.2 + 1.2
    return R(src, f"{tanda}+{L:.1f}", jadi, crop, speed=3, maks=maks, lab="AI bekerja · dipercepat")

BAB = []
def bab(kode, judul, beats): BAB.append(dict(kode=kode, judul=judul, beats=beats))

# ---------------------------------------------------------------- V00
bab("V00", "Kait", [
 ("Pernah nongkrong berempat, lalu struknya datang, dan semua orang tiba-tiba diam? Ada pajak, ada service, ada voucher, dan ada kentang goreng yang dimakan bareng. Akhirnya satu orang menalangi, lalu menghitung pakai kalkulator sambil ditunggu teman-temannya.",
  [H("H00", "menu", "pemakan", "Ketik menu", speed=2.5, maks=4), H("H00", "pemakan", "hitung", "Ketuk siapa yang makan", speed=1.5, maks=3)]),
 ("Di video ini, kita membuat aplikasi HP yang menyelesaikan masalah itu dalam dua puluh detik. Kita membuatnya bersama asisten AI, dari folder kosong sampai aplikasinya bisa dipasang seperti aplikasi biasa dan tetap jalan tanpa internet.",
  [H("H00", "hitung", "akhir", "Hitung, lalu bagikan")]),
 ("Setelah menonton, kamu bisa membuat aplikasi HP dengan bantuan AI, dan tahu cara memastikan AI tidak salah hitung.",
  [A("judul", min=5, judul="Vibe Coding\nAplikasi HP dari Nol", hook="Setelah menonton, kamu bisa membuat aplikasi HP dengan bantuan AI, dan tahu cara memastikan AI tidak salah hitung.")]),
 ("Tapi ada satu hal yang perlu kamu tahu sejak awal. Di tengah jalan, aplikasi buatan AI kita akan rusak beberapa kali. Ada riwayat lama yang membuat tombol Hitung gagal, ada versi baru yang tidak pernah sampai ke pengguna, dan ada voucher yang membuat semua orang malah dibayar. Semua kesalahan itu benar-benar terjadi saat video ini direkam. Kita akan menangkapnya bersama, dan cara menangkapnya itulah inti video ini.",
  [H("H07c", "hitung2", "akhir", "Riwayat lama: Hitung gagal"), R("D09d", "cache", "akhir", "dt"), H("H10b", "voucher_besar", "akhir", "Voucher kebesaran dan menu gratis")]),
])

# ---------------------------------------------------------------- V01
bab("V01", "Vibe coding yang benar", [
 ("Vibe coding artinya membuat program dengan cara meminta AI menulis kodenya. Kamu menjelaskan apa yang kamu mau dengan bahasa sehari-hari, lalu AI menulis kodenya. Istilah ini populer sejak tahun dua ribu dua puluh lima, dan sekarang banyak orang membuat aplikasi tanpa mengetik kode sendiri.",
  [A("vibe", min=8)]),
 ("Cara ini sangat cepat. Masalahnya, AI menulis kode yang kelihatan benar, dan kode yang kelihatan benar belum tentu benar. Kalau kamu tidak membaca dan tidak menguji hasilnya, kamu seperti menandatangani surat tanpa membacanya.",
  [A("vibe", min=6)]),
 ("Vibe coding cocok untuk prototipe, untuk alat yang kamu pakai sendiri, dan untuk belajar hal baru. Vibe coding menjadi berbahaya kalau programnya mengurus uang, data pribadi orang lain, atau keamanan. Aplikasi Patungan mengurus uang, walaupun hanya uang jajan. Karena itu, kita akan vibe coding dengan disiplin.",
  [A("duaKolom", min=10, sorot=0)]),
 ("Disiplinnya terdiri dari lima langkah yang berulang. Pertama, kita menulis spek, yaitu penjelasan tertulis tentang apa yang harus dibuat. Kedua, kita memberi AI satu tugas kecil, bukan seluruh aplikasi sekaligus. Ketiga, kita membaca kode yang ditulis AI sampai kita paham. Keempat, kita menguji kode itu dengan contoh yang jawabannya sudah kita tahu. Kelima, kalau semuanya benar, kita menyimpannya dengan commit di Git, supaya kita bisa kembali kalau langkah berikutnya merusak sesuatu.",
  [A("siklus", min=20)]),
 ("Kenapa tugasnya harus kecil? Karena kode yang pendek bisa kamu baca dalam dua menit, sedangkan kode seribu baris tidak akan kamu baca sama sekali. Kenapa harus diuji? Karena AI tidak pernah bilang, \"Maaf, bagian ini saya tidak yakin.\" AI selalu terdengar yakin, baik saat benar maupun saat salah.",
  [A("siklus", min=6, sorot=[1, 3], semua=True)]),
 ("Di video ini, saya memakai Claude Code, yaitu asisten AI yang bekerja di terminal. Cara kerjanya sama dengan alat lain, seperti Gemini CLI, GitHub Copilot yang gratis untuk pelajar dan mahasiswa, atau Cursor. Jadi, pakai alat apa saja yang kamu punya. Yang penting bukan alatnya, tetapi lima langkah tadi. Semua prompt yang saya ketik ada di deskripsi, jadi kamu bisa mencobanya sendiri.",
  [A("alat", min=10)]),
 ("Satu hal lagi. Hasil AI tidak selalu sama setiap kali dijalankan. Kalau kodemu sedikit berbeda dari kode saya, itu wajar. Justru karena itulah kita butuh tes.",
  [A("teks", min=5, judul="Hasil AI bisa berbeda", sub="Karena itu kita butuh tes", isi=["Kodemu boleh berbeda dari kode di video.", "Yang harus sama: hasil hitungannya."])]),
])

# ---------------------------------------------------------------- V02
bab("V02", "Spek satu halaman", [
 ("Sebelum menyentuh AI, kita menulis spek dulu. Ini langkah yang paling sering dilewati, padahal inilah bagian yang tidak bisa dikerjakan AI untukmu. AI bisa menulis kode, tetapi AI tidak tahu masalah apa yang sebenarnya ingin kamu selesaikan.",
  [R("V02", "mulai", "masalah", "edit")]),
 ("Spek kita cukup satu halaman. Pertanyaan pertama adalah masalahnya apa. Kita menulisnya dengan bahasa manusia: setelah makan bareng, menghitung bagian tiap orang itu lama dan sering salah, terutama karena pajak, service, voucher, dan menu yang dimakan bersama.",
  [R("V02", "masalah", "pengguna", "edit")]),
 ("Pertanyaan kedua adalah siapa penggunanya dan dalam keadaan apa. Penggunanya adalah satu orang yang menalangi pembayaran. Dia memakai HP dengan satu tangan, di kafe yang mungkin sinyalnya jelek. Dari satu kalimat ini saja, kita sudah mendapat tiga syarat: tampilannya harus nyaman untuk layar HP, tombolnya harus mudah dijangkau jempol, dan aplikasinya harus tetap jalan tanpa internet.",
  [R("V02", "pengguna", "fitur", "edit")]),
 ("Pertanyaan ketiga adalah fitur apa yang wajib ada. Pengguna bisa memasukkan menu dan harganya, lalu memilih siapa saja yang memakan setiap menu. Satu menu boleh dibagi beberapa orang. Pengguna bisa memasukkan voucher, persen service, dan persen pajak. Aplikasi menampilkan berapa yang harus dibayar setiap orang, bisa mengirim ringkasannya ke WhatsApp, dan menyimpan riwayat patungan di HP.",
  [R("V02", "fitur", "tidak", "edit")]),
 ("Pertanyaan keempat sama pentingnya, yaitu fitur apa yang sengaja tidak dibuat. Kita tidak membuat login, tidak memakai server, tidak memindai struk dengan kamera, dan tidak menghubungkan ke rekening bank. Daftar ini melindungi kita dari AI yang terlalu bersemangat. Kalau tidak ditulis, AI bisa saja menambahkan fitur login yang tidak pernah kita minta, lengkap dengan seratus baris kode yang harus kita baca.",
  [R("V02", "tidak", "aturan", "edit", fokus=(720, 1392))]),
 ("Sekarang bagian yang paling penting, yaitu aturan hitung. Kalau aturan ini tidak tertulis, AI akan menebak, dan setiap AI bisa menebak dengan cara berbeda.",
  [R("V02", "aturan", "aturan+6", "edit", fokus=(720, 1392))]),
 ("Aturan pertama: voucher dikurangkan dulu dari subtotal. Aturan kedua: service dihitung dari subtotal setelah voucher. Aturan ketiga: pajak dihitung dari subtotal setelah voucher ditambah service, karena begitulah cara kebanyakan kafe mencetak struknya. Aturan keempat: voucher, service, dan pajak dibagi sebanding dengan porsi pesanan setiap orang. Artinya, orang yang memesan lebih banyak juga menanggung pajak lebih banyak. Aturan kelima: semua uang dihitung dalam rupiah bulat, dan bagian setiap orang dibulatkan ke atas ke kelipatan seratus rupiah, supaya orang yang menalangi tidak pernah rugi.",
  [R("V02", "aturan+6", "contoh", "edit", fokus=(720, 1392))]),
 ("Terakhir, kita menghitung satu contoh secara manual, tanpa AI. Ini struk dari empat teman: Andi, Bela, Citra, dan Dimas. Subtotalnya seratus tujuh puluh tujuh ribu rupiah. Ada voucher lima belas ribu, service lima persen, dan pajak sepuluh persen, sehingga total struknya seratus delapan puluh tujuh ribu seratus sepuluh rupiah.",
  [R("V02", "contoh", "tabel_hasil", "edit", fokus=(720, 1392))]),
 ("Porsi pesanan Andi adalah empat puluh tujuh ribu lima ratus. Angka itu berasal dari nasi goreng, seperempat kentang goreng, dan satu es teh. Kalau dikalikan dengan perbandingan total struk dan subtotal, bagian Andi menjadi lima puluh ribu dua ratus tiga belas rupiah lebih sedikit, lalu dibulatkan ke atas menjadi lima puluh ribu tiga ratus.",
  [R("V02", "tabel_hasil", "spek_selesai", "edit", fokus=(720, 1392))]),
 ("Kalau semua bagian dijumlahkan, hasilnya seratus delapan puluh tujuh ribu empat ratus. Angka itu lebih dua ratus sembilan puluh rupiah dari total struk, dan kelebihan itu menjadi milik Andi yang menalangi. Aplikasi kita harus menampilkan kelebihan ini terang-terangan, supaya tidak ada yang merasa dicurangi.",
  [A("bulat", min=8)]),
 ("Tabel ini adalah kunci jawaban kita. Apa pun yang nanti ditulis AI, hasilnya harus sama persis dengan tabel ini. Kalau berbeda satu rupiah saja, berarti ada yang salah, dan kita tidak akan melanjutkan sebelum menemukan penyebabnya.",
  [R("V02", "spek_selesai", "akhir", "edit")]),
])

# ---------------------------------------------------------------- V03
bab("V03", "Siapkan proyek", [
 ("Spek tadi kita simpan di folder proyek sebagai berkas SPEK.md. Dengan begitu, AI bisa membacanya kapan saja, dan kita tidak perlu mengulang penjelasan yang sama di setiap prompt. Lalu kita menjalankan git init. Dengan Git, setiap langkah yang berhasil bisa kita simpan sebagai titik aman. Kalau AI merusak sesuatu, kita tinggal kembali ke titik aman terakhir.",
  [R("V03", "mulai", "claude_md", "full"), A("teks", min=5, judul="Titik aman", warna="#2dd4bf", isi=["SPEK.md: AI membacanya kapan saja", "git init: setiap langkah bisa disimpan", "Kalau AI merusak, kembali ke titik aman"])]),
 ("Berikutnya, kita menulis berkas aturan untuk AI. Di Claude Code, namanya CLAUDE.md. Alat lain punya berkas serupa dengan nama berbeda, misalnya AGENTS.md. Berkas ini dibaca AI setiap kali mulai bekerja, jadi isinya seperti aturan kelas.",
  [R("V03", "claude_md", "claude_md_selesai", "edit", maks=2)]),
 ("Perhatikan aturan tentang uang. Komputer menyimpan bilangan desimal dengan cara yang tidak selalu tepat. Kalau kamu menjumlahkan nol koma satu dan nol koma dua di JavaScript, hasilnya bukan nol koma tiga, tetapi nol koma tiga dengan banyak angka nol dan angka empat di ujungnya. Untuk uang, kesalahan sekecil itu bisa menumpuk. Karena itu, kita menyimpan uang sebagai bilangan bulat dalam rupiah.",
  [R("V03", "claude_md_selesai", 48.4, "termK")]),
 ("Aturan kerjakan hanya yang diminta juga penting. AI cenderung sangat membantu, dan kadang terlalu membantu. Kita ingin AI mengerjakan tugas kecil yang bisa kita baca, bukan kejutan.",
  [R("V03", "claude_md_selesai-1", "claude_md_selesai", "edit")]),
 ("Kita menyimpan titik aman pertama dengan commit. Belum ada satu baris kode pun, tetapi sebenarnya bagian terpenting proyek ini sudah selesai.",
  [R("V03", "commit", "akhir", "termK")]),
])

# ---------------------------------------------------------------- V04
bab("V04", "Prompt pertama: kerangka", [
 ("Sekarang kita membuka asisten AI di terminal dan mengetik prompt pertama. Perhatikan bahwa prompt ini kecil. Kita tidak meminta seluruh aplikasi, tetapi hanya kerangka dan satu layar.",
  [R("V04a", "mulai", "prompt1", "termD"), ketik("V04a", "prompt1")]),
 ("AI membaca spek dan aturan kita, lalu membuat beberapa berkas.",
  [kerja("V04a", "prompt1", "prompt1_selesai")]),
 ("Sebelum menjalankannya, kita membaca dulu laporannya. Ada package.json yang hanya memasang Vite, index.html sebagai halaman utama, main.js sebagai kode utama, dan style.css untuk tampilan. AI juga menulis bagian yang belum dikerjakan, lalu memberi dua saran tanpa langsung membuatnya: tombol hapus dan penyimpanan di localStorage. Itu persis aturan kerjakan hanya yang diminta. Berkas aturan kita bekerja.",
  [R("V04a", "prompt1_selesai", "akhir", "termU")]),
 ("Kita menjalankan npm install untuk memasang Vite, lalu npm run dev. Vite menyalakan server kecil di komputer kita, dan aplikasinya bisa dibuka di browser. Kita membukanya dalam ukuran layar HP.",
  [R("V04b", "terminal2", "main_js", "termU", maks=2.5)]),
 ("Sekarang kita membaca kodenya. Kita tidak perlu paham setiap tanda baca, tetapi kita harus paham apa yang dikerjakan setiap blok.",
  [R("V04c", "mulai", "blok_state", "edit")]),
 ("Blok pertama membuat objek state berisi dua array, yaitu daftar menu dan daftar orang. Inilah data aplikasi kita, dan semua yang tampil di layar berasal dari dua array ini. Blok berikutnya adalah fungsi tampil, yang menggambar ulang daftar setiap kali data berubah. Lalu ada blok yang mendengarkan tombol tambah. Saat tombol diketuk, blok ini membaca isi kotak input, menambahkannya ke array, lalu memanggil tampil.",
  [R("V04c", "blok_state", "blok_tampil", "edit"), R("V04c", "blok_tampil", "blok_submit_menu", "edit"), R("V04c", "blok_submit_menu", "commit", "edit")]),
 ("Pola ini, yaitu data lalu tampil lalu layar, akan dipakai di seluruh aplikasi. Kalau kamu memahami pola ini, kamu bisa membaca hampir semua kode yang akan ditulis AI berikutnya.",
  [A("pola", min=8)]),
 ("Lalu kita mencoba memakainya di HP. Menu dan nama teman bisa ditambah, dan harganya tampil dengan titik ribuan.",
  [H("H04", "tambah_menu", "uji_huruf", "Coba di HP", speed=2, maks=3)]),
 ("Terakhir, kita mencoba merusaknya sedikit. Kotak harga tidak menerima huruf, karena AI memakai kotak bertipe angka. Kalau harga dikosongkan, browser menolak dan menampilkan pesan bahwa kotak itu wajib diisi. Di laptop ini pesannya berbahasa Inggris karena mengikuti bahasa browser.",
  [H("H04", "uji_huruf", "akhir", "Isi huruf, lalu kosongkan")]),
 ("Semua sudah dibaca dan dicoba, jadi kita meminta AI menyimpan titik aman kedua.",
  [R("V04c", "commit", "akhir", "termD", maks=4)]),
])

# ---------------------------------------------------------------- V05
bab("V05", "Logika inti dan tes", [
 ("Sekarang kita sampai di jantung aplikasi, yaitu perhitungannya. Sebelum meminta AI, kita pahami dulu idenya dengan gambar. Batang ini adalah subtotal, yaitu jumlah harga menu sebelum voucher, service, dan pajak. Batang itu terbagi menjadi empat warna sesuai porsi pesanan tiap orang.",
  [A("batang", min=10)]),
 ("Voucher membuat batangnya memendek, sedangkan service dan pajak membuatnya memanjang. Hasil akhirnya adalah total struk. Kuncinya ada di sini: saat batangnya meregang, setiap warna ikut meregang dengan perbandingan yang sama. Itulah arti dibagi sebanding.",
  [A("batang", min=10, regang=True)]),
 ("Jadi, bagian setiap orang sama dengan porsi pesanannya dikali total struk, lalu dibagi subtotal. Rumusnya hanya satu baris. Yang membuatnya rumit adalah pembulatan.",
  [A("rumus", min=6)]),
 ("Kalau setiap bagian dibulatkan ke ratusan terdekat, seperti yang biasa kita lakukan, jumlahnya menjadi seratus delapan puluh tujuh ribu. Hasil itu kurang seratus sepuluh rupiah, dan kekurangannya ditanggung Andi. Setiap kali nongkrong Andi rugi sedikit. Karena itu, spek kita meminta pembulatan ke atas. Jumlahnya memang lebih sedikit, tetapi kelebihan itu jelas tujuannya.",
  [A("bulat", min=10)]),
 ("Sekarang ada urutan yang penting. Kita meminta tesnya dulu, baru kodenya. Angka yang diharapkan di tes diambil dari hitungan manual kita, bukan dari AI. Kalau AI menulis kode sekaligus menentukan jawabannya, AI bisa saja menulis tes yang mencocokkan kodenya sendiri, termasuk kesalahannya. Itu seperti murid yang membuat soal ujian sekaligus kunci jawabannya.",
  [A("ujian", min=8)]),
 ("Prompt pertama di bab ini hanya meminta Vitest dan satu tes dari contoh di spek. Fungsinya sengaja belum dibuat.",
  [ketik("V05a", "prompt_tes"), kerja("V05a", "prompt_tes", "tes_jadi")]),
 ("Kita membaca tesnya. Angka lima puluh ribu tiga ratus, empat puluh tujuh ribu seratus, tiga puluh sembilan ribu tujuh ratus, dan kelebihan dua ratus sembilan puluh semuanya sama dengan tabel di spek. Lalu kita menjalankan tesnya, dan hasilnya merah, karena fungsinya memang belum ada. Merah di sini adalah kabar baik, karena artinya tes kita benar-benar memeriksa sesuatu.",
  [R("V05a", "baca_tes", "baca_tes_akhir", "edit"), R("V05a", "vitest_merah", "vitest_merah_akhir", "termD")]),
 ("Baru sekarang kita meminta AI menulis fungsinya sampai tes lulus, dengan mengikuti aturan hitung di spek.",
  [ketik("V05a", "prompt_fungsi"), kerja("V05a", "prompt_fungsi", "fungsi_jadi")]),
 ("Tesnya langsung hijau. Tapi coba baca bagian akhir laporan AI. Di sana AI menulis dua hal yang belum ditangani: subtotal nol atau menu tanpa pemakan akan menghasilkan pembagian dengan nol, dan voucher yang lebih besar dari subtotal belum dicek. Ingat dua kalimat ini, karena nanti salah satunya akan kembali menghantui kita.",
  [R("V05a", "fungsi_jadi-8", "vitest2_akhir", "termU", maks=2)]),
 ("Satu tes hanya membuktikan satu contoh, jadi kita menambah contoh yang lebih licik. Contoh pertama adalah tiga orang berbagi satu menu seharga sepuluh ribu. Sepuluh ribu dibagi tiga tidak habis, jadi bagian tiap orang harus tiga ribu empat ratus, dengan kelebihan dua ratus rupiah. Contoh kedua adalah struk tanpa voucher, service, dan pajak, sehingga hasilnya harus sama persis dengan porsi pesanan. Contoh ketiga adalah menu yang lupa diberi nama pemakannya. Menurut kamu, apa yang seharusnya terjadi?",
  [A("licik", min=14)]),
 ("", [A("pikir", min=4.5, tanya="Menu tanpa pemakan: apa yang seharusnya terjadi?")]),
 ("Spek kita belum menjawab pertanyaan itu, dan di sinilah tes membantu kita menemukan lubang di spek. Kita putuskan bahwa aplikasi harus menolak menghitung dan menampilkan pesan, ada menu yang belum dipilih pemakannya. Kita menambahkan aturan itu ke SPEK.md sebagai aturan keenam.",
  [R("V05b", "spek_aturan6", "spek_aturan6_akhir", "edit", maks=1.3)]),
 ("Lalu kita meminta tiga tes itu, dengan satu kalimat penting di akhir: jangan mengubah angka yang diharapkan di tes. Ada AI yang, saat tesnya gagal, justru mengubah tesnya supaya lulus. Kalimat itu menutup jalan pintas tersebut.",
  [ketik("V05b", "prompt_licik"), kerja("V05b", "prompt_licik", "licik_jadi")]),
 ("Laporannya jujur: hanya tes ketiga yang gagal sebelumnya, karena fungsi lama tetap menghitung walaupun ada menu tanpa pemakan. Sekarang keempat tes hijau. Sebelum percaya, kita periksa sendiri dengan git diff bahwa angka-angka lama di tes memang tidak diubah. Ternyata aman, yang berubah hanya tambahan tes.",
  [R("V05b", "licik_jadi-6", "licik_jadi", "termU"), R("V05b", "vitest3", "diff_akhir", "termD", maks=2)]),
 ("Satu hal lagi yang perlu dibaca adalah bagaimana fungsi ini menghindari bilangan desimal. AI mengalikan dulu semuanya dengan kelipatan persekutuan, membagi di akhir, lalu membulatkan ke atas dalam satu langkah dengan fungsi bagiKeAtas. Dengan begitu, angka seperti lima puluh ribu dua ratus tiga belas koma empat belas tidak pernah disimpan.",
  [R("V05b", "baca_bagiatas", "prompt_sambung", "edit")]),
 ("Terakhir, kita minta AI menyambungkan fungsi ini ke layar. Setiap menu diberi tombol nama, voucher, service, dan pajak bisa diisi, lalu tombol Hitung menampilkan hasilnya.",
  [ketik("V05b", "prompt_sambung"), kerja("V05b", "prompt_sambung", "sambung_jadi")]),
 ("Kita memasukkan struk contoh lewat aplikasi di HP. Andi lima puluh ribu tiga ratus, Bela lima puluh ribu tiga ratus, Citra empat puluh tujuh ribu seratus, Dimas tiga puluh sembilan ribu tujuh ratus, dan kelebihannya dua ratus sembilan puluh rupiah. Angkanya sama persis dengan kunci jawaban.",
  [H("H05", "orang", "hitung", "Struk contoh", speed=3, maks=5), H("H05", "hitung", "akhir", "Sama dengan kunci jawaban")]),
 ("Jadi kita menyimpan titik aman berikutnya.",
  [R("V05c", "prompt_commit", "log_akhir", "termD", speed=1.5, maks=4)]),
])

# ---------------------------------------------------------------- V06
bab("V06", "Rasa aplikasi HP", [
 ("Perhitungannya sudah benar, tetapi aplikasinya belum terasa seperti aplikasi HP. Ingat pengguna kita di spek: satu orang, satu tangan, berdiri di depan kasir. Saat HP dipegang satu tangan, jempol mudah menjangkau bagian bawah layar, tetapi sulit menjangkau pojok atas. Karena itu, aplikasi HP yang nyaman menaruh tombol utamanya di bawah. Tombol juga harus cukup besar, sekitar empat puluh delapan piksel, kira-kira selebar ujung jari.",
  [A("jempol", min=12)]),
 ("Prompt kali ini berisi empat permintaan tampilan, ditambah satu larangan di baris terakhir: jangan mengubah hitung.js. Fungsi hitung sudah teruji, jadi kalau nanti tesnya merah, kita tahu AI melanggar perintah.",
  [R("V06a", "mulai", "prompt_hp", "termD"), ketik("V06a", "prompt_hp"), kerja("V06a", "prompt_hp", "hp_jadi")]),
 ("Tesnya tetap hijau, dan git diff menunjukkan hanya main.js dan style.css yang berubah. AI juga jujur bahwa tes kita hanya memeriksa hitungan, bukan tampilan. Untuk tampilan, kita harus melihatnya sendiri di HP.",
  [R("V06a", "vitest", "diff_akhir", "termD", maks=2.5)]),
 ("Ada satu detail kecil di kode: kotak harga sekarang memakai inputmode numeric, sehingga HP membuka papan ketik angka. Saat kita mengetik dua puluh empat ribu, titik ribuannya langsung muncul. Tombol Hitung juga menempel di bawah layar, di daerah jempol.",
  [H("H06a", "ketik_harga", "hitung", "Titik ribuan, tombol di bawah")]),
 ("Sekarang kita ketuk Hitung. Perhatikan apa yang terjadi.",
  [H("H06a", "hitung", "cari_hasil", "Ketuk Hitung")]),
 ("Tidak terjadi apa-apa, setidaknya kelihatannya begitu. Hasilnya sebenarnya sudah muncul, tetapi jauh di bawah, di luar layar. Pengguna yang berdiri di depan kasir akan mengira tombolnya rusak, lalu mengetuknya berkali-kali. Tes kita tidak mungkin menangkap ini, karena tesnya hanya memeriksa angka. Menariknya, AI sendiri sudah menulis hal ini sebagai saran, tetapi tidak membuatnya karena tidak diminta.",
  [H("H06a", "cari_hasil", "akhir", "Hasilnya di bawah, tidak terlihat")]),
 ("Kita juga mencoba layar HP kecil selebar tiga ratus dua puluh piksel dengan nama menu yang panjang. Nama menu turun ke baris kedua dengan rapi, jadi bagian ini aman.",
  [H("H06b", "mulai_320", "akhir", "Layar 320 px")]),
 ("Kita jelaskan masalahnya ke AI dengan bahasa pengguna, bukan bahasa kode, lalu tetap melarang AI menyentuh hitung.js.",
  [ketik("V06b", "prompt_gulir"), kerja("V06b", "prompt_gulir", "gulir_jadi")]),
 ("Sekarang setelah Hitung diketuk, layar bergulir sendiri ke hasilnya.",
  [H("H06c", "mulai", "akhir", "Layar bergulir ke hasil")]),
 ("Tes masih hijau, jadi kita menyimpan titik aman.",
  [R("V06c", "vitest", "commit_jadi", "termD", speed=2, maks=5)]),
])

# ---------------------------------------------------------------- V07
bab("V07", "Simpan offline", [
 ("Coba lihat apa yang terjadi kalau halaman dimuat ulang. Semua isian hilang. Bayangkan kamu sudah mengetik tujuh menu, lalu tidak sengaja menutup browser. Spek kita juga meminta riwayat patungan, jadi data harus disimpan di HP.",
  [H("H07a", "mulai", "akhir", "Muat ulang: isian hilang")]),
 ("Browser punya laci penyimpanan kecil bernama localStorage. Isinya tetap ada walaupun browser ditutup, dan data itu tidak pernah dikirim ke server mana pun. Laci ini hanya bisa menyimpan teks, jadi data kita diubah dulu menjadi teks berformat JSON sebelum disimpan, lalu diubah kembali saat dibaca.",
  [A("laci", min=10)]),
 ("Kita minta AI menyimpan struk yang sedang diisi, memuatnya lagi saat aplikasi dibuka, dan menambah daftar riwayat.",
  [R("V07a", "mulai", "prompt_simpan", "termD"), ketik("V07a", "prompt_simpan"), kerja("V07a", "prompt_simpan", "simpan_jadi")]),
 ("Sekarang isiannya tetap ada setelah halaman dimuat ulang. Kita isi nama tempat Kafe Senja, lalu Hitung, dan riwayatnya muncul di bawah.",
  [H("H07b", "muat_ulang", "akhir", "Muat ulang: isian tetap ada")]),
 ("Tapi ada satu pertanyaan yang jarang ditanyakan: bagaimana kalau data di laci itu rusak? Di HP pengguna, data bisa rusak karena versi aplikasi yang berubah, penyimpanan yang penuh, atau hal lain yang tidak bisa kita kendalikan.",
  [A("teks", min=6, judul="Bagaimana kalau datanya rusak?", sub="Pertanyaan yang membedakan programmer", warna="#ff6b6b", isi=["1. Teks yang bukan JSON", "2. Riwayat dari versi lama aplikasi"])]),
 ("Serangan pertama: kita mengganti isinya dengan teks yang bukan JSON, lalu memuat ulang. Aplikasinya tetap terbuka. Ternyata AI sudah membungkus pembacaan data dengan try dan catch.",
  [H("H07c", "rusak1", "rusak2", "Serangan 1: teks bukan JSON")]),
 ("Serangan kedua lebih realistis. Kita menaruh satu riwayat dengan format lama, misalnya dari versi aplikasi sebelumnya yang belum menyimpan total. Halamannya terbuka seperti biasa. Tapi saat kita mengetuk Hitung, yang muncul justru pesan error berbahasa Inggris, dan tidak ada hasil sama sekali.",
  [H("H07c", "rusak2", "akhir", "Serangan 2: riwayat versi lama")]),
 ("Penyebabnya, kode yang menampilkan riwayat langsung mengambil total dari setiap entri tanpa memeriksa apakah total itu ada. Pengguna tidak punya DevTools untuk membersihkan datanya, jadi tombol Hitung akan gagal selamanya di HP mereka. Kesalahan ini tidak akan pernah terlihat kalau kita hanya mencoba aplikasi dengan data yang bagus.",
  [A("pikir", min=5, tanya="Pengguna tidak punya DevTools. Tombol Hitung gagal selamanya.")]),
 ("Kita laporkan apa yang kita lihat, termasuk pesan errornya, lalu minta AI melewati entri yang rusak, menampilkan pesan singkat, dan menambahkan tesnya.",
  [ketik("V07b", "prompt_rusak"), kerja("V07b", "prompt_rusak", "rusak_jadi")]),
 ("AI memindahkan pembacaan data ke berkas baru bernama penyimpanan.js, lalu menulis lima belas tes untuk berbagai bentuk data rusak. Totalnya sekarang sembilan belas tes, dan semuanya hijau.",
  [R("V07b", "vitest", "vitest_akhir", "termD", maks=2)]),
 ("Kita ulangi serangan kedua. Sekarang aplikasinya memberi tahu bahwa satu data tersimpan rusak dan dilewati, dan tombol Hitung bekerja seperti biasa. Kebiasaan bertanya bagaimana kalau ini rusak adalah salah satu hal yang membedakan programmer dari orang yang sekadar menyuruh AI.",
  [H("H07d", "rusak2", "akhir", "Serangan 2 diulang")]),
 ("Titik aman berikutnya pun disimpan.",
  [R("V07c", "prompt_commit", "commit_jadi", "termD", speed=2, maks=5)]),
])

# ---------------------------------------------------------------- V08
bab("V08", "Kirim ke WhatsApp", [
 ("Hasil hitungan tidak berguna kalau hanya ada di HP orang yang menalangi. Teman-teman harus tahu berapa yang harus mereka transfer. Karena itu, kita mengirim ringkasannya ke grup WhatsApp. Sebelum meminta AI, kita tentukan dulu seperti apa pesan yang enak dibaca. Pesannya pendek, angkanya pakai titik ribuan, dan orang yang menalangi tidak perlu ditagih. Kelebihan dua ratus sembilan puluh rupiah juga ditulis terang-terangan.",
  [A("pesan", min=12)]),
 ("Web Share API adalah fitur browser di HP yang membuka menu bagikan bawaan, sama seperti saat kamu membagikan foto. Browser di laptop belum tentu punya fitur ini, jadi kita butuh cadangan, yaitu link wa.me yang langsung membuka WhatsApp dengan pesan yang sudah terisi.",
  [A("jalur", min=10)]),
 ("Kita tempelkan contoh pesan itu ke prompt, dan meminta fungsi pembuat teksnya dipisah lalu diberi tes. Teks ringkasan adalah keluaran yang benar-benar dibaca teman-temanmu, jadi kesalahan di sini, misalnya nama yang tertukar dengan angkanya, akan langsung memalukan.",
  [ketik("V08a", "prompt_bagikan"), kerja("V08a", "prompt_bagikan", "bagikan_jadi")]),
 ("Contoh kita menyebut siapa yang menalangi, padahal aplikasinya belum punya isian itu. AI menyadarinya sendiri dan menambahkan pilihan ditalangi oleh. Tujuh tes baru untuk teks ringkasan lulus, totalnya dua puluh enam tes.",
  [R("V08a", "bagikan_jadi-6", "vitest_akhir", "termU", maks=2)]),
 ("Kita coba di HP. Pilih Andi sebagai penalang, Hitung, lalu Bagikan. Menu bagikan di rekaman ini kami tiru dengan kode, karena emulator di laptop tidak punya menu bawaan HP. Yang penting adalah isi pesannya, dan isinya sama persis dengan contoh kita, sampai ke spasinya. Di browser laptop, tombol yang sama membuka link WhatsApp dengan pesan yang sudah terisi.",
  [H("H08", "penalang", "akhir", "Menu bagikan (ditiru)")]),
 ("Titik aman berikutnya.",
  [R("V08b", "prompt_commit", "commit_jadi", "termD", speed=2, maks=5)]),
])

# ---------------------------------------------------------------- V09
bab("V09", "Jadikan aplikasi", [
 ("Sampai sekarang, aplikasi kita masih sebuah halaman web. Untuk membukanya, pengguna harus membuka browser dan mengetik alamatnya. Kalau tidak ada sinyal, halaman itu juga tidak terbuka. Di bab ini, kita mengubahnya menjadi aplikasi yang punya ikon sendiri dan tetap jalan tanpa internet. Bentuk ini disebut Progressive Web App, atau PWA.",
  [A("pasang", min=8)]),
 ("PWA butuh dua bagian. Bagian pertama adalah manifest, yaitu berkas kecil yang berisi identitas aplikasi: nama, ikon, warna, dan cara membukanya. Anggap saja ini KTP aplikasi kita. Bagian kedua adalah service worker, yang perlu kita pahami lebih dalam.",
  [A("pwaKartu", min=8)]),
 ("Service worker adalah kode kecil yang berdiri di antara aplikasi dan internet, seperti penjaga gudang. Saat aplikasi dibuka pertama kali, penjaga ini mengambil semua berkas dari internet, lalu menyimpan salinannya di gudang yang disebut cache. Saat aplikasi dibuka lagi tanpa sinyal, penjaga mengambil berkas dari gudang. Karena itu, aplikasinya tetap terbuka walaupun HP dalam mode pesawat.",
  [A("gudang", min=14)]),
 ("Kita minta AI membuat manifest, ikon yang digambar dengan kode, dan service worker dengan nama gudang yang berversi.",
  [ketik("V09a", "prompt_pwa"), kerja("V09a", "prompt_pwa", "pwa_jadi")]),
 ("Ada satu bagian yang perlu dicek, yaitu daftar berkas yang dimasukkan ke gudang. Vite memberi nama berkas yang berubah setiap kali build, misalnya index dengan kode acak di belakangnya. Kalau daftar itu ditulis tangan, namanya cepat basi. AI menanganinya dengan membaca index.html saat service worker dipasang, lalu mengambil semua alamat berkas di dalamnya.",
  [R("V09b", "build", "build_akhir", "termD", maks=2), R("V09b", "baca_daftar", "baca_install", "edit")]),
 ("Isinya dibagi menjadi tiga peristiwa. Peristiwa install terjadi saat penjaga baru datang, dan tugasnya mengisi gudang. Peristiwa activate terjadi saat penjaga mulai bertugas, dan tugasnya membuang gudang versi lama. Peristiwa fetch terjadi setiap kali aplikasi meminta berkas, dan tugasnya memutuskan apakah berkas diambil dari gudang atau dari internet.",
  [A("swTiga", min=12)]),
 ("Kita build, lalu membukanya dengan npm run preview. Di DevTools, tab Application, manifest terbaca dengan nama Patungan. Service worker sudah aktif, dan gudang bernama patungan-v1 berisi tujuh berkas, termasuk berkas hasil build dengan nama acaknya.",
  [R("D09a", "manifest", "akhir", "dt")]),
 ("Ikonnya, menurut AI sendiri, agak mirip setir mobil. Sebenarnya itu kue yang dibagi tiga. Desain bisa diperbaiki nanti, dan memang begitu seharusnya: fungsi dulu, hiasan belakangan.",
  [R("D09c", "pasang", "akhir", "full")]),
 ("Sekarang ujiannya. Kita centang Offline di DevTools untuk meniru mode pesawat, lalu memuat ulang halaman. Aplikasinya tetap terbuka, karena semua berkas diambil dari gudang.",
  [R("D09b", "offline", "online", "full")]),
 ("Lalu kita mencoba hal yang sangat biasa: mengubah aplikasi sedikit, lalu build ulang. Kita minta AI menambahkan satu kalimat di bawah judul.",
  [ketik("V09c", "prompt_kalimat"), kerja("V09c", "prompt_kalimat", "kalimat_jadi"), R("V09c", "build", "build_akhir", "termD", maks=2)]),
 ("Kita muat ulang browser. Kalimatnya tidak muncul. Kita muat ulang sekali lagi, dan tetap tidak muncul. Di gudang masih ada patungan-v1 dengan berkas build yang lama.",
  [R("D09d", "muat_ulang1", "akhir", "full")]),
 ("Inilah jebakan service worker yang terkenal. Penjaga selalu mengambil dari gudang, dan nama gudangnya tidak berubah karena VERSI di sw.js harus dinaikkan dengan tangan. Kalau kita lupa, pengguna terjebak di versi lama selamanya, termasuk saat versi baru itu berisi perbaikan bug.",
  [A("versi", min=10)]),
 ("Kita jelaskan apa yang kita lihat ke AI, lalu minta VERSI berubah otomatis di setiap build, tanpa plugin dan tanpa library baru.",
  [ketik("V09d", "prompt_versi"), kerja("V09d", "prompt_versi", "versi_jadi"), R("V09d", "build", "build_akhir", "termD", maks=2)]),
 ("Sekarang setiap build menjalankan skrip kecil yang menghitung sidik jari dari semua berkas hasil build, lalu memakainya sebagai nomor versi. Isi berubah, versi berubah. Kita muat ulang, dan kalimat barunya muncul. Gudang lama sudah dibuang dan diganti gudang dengan nama baru.",
  [R("D09e", "muat_ulang1", "cache", "full", maks=2), R("D09f", "cache", "akhir", "dt")]),
 ("Kita simpan titik amannya.",
  [R("V09e", "prompt_commit", "commit_jadi", "termD", speed=2, maks=5)]),
])

# ---------------------------------------------------------------- V10
bab("V10", "Cek kerjaan AI", [
 ("Aplikasinya sudah jalan, tetapi sebelum dibagikan ke orang lain, kita melakukan pemeriksaan terakhir. Ini daftar periksa yang bisa kamu pakai untuk proyek vibe coding apa pun.",
  [A("cek", min=6)]),
 ("Pemeriksaan pertama adalah masukan yang aneh. Apa yang terjadi kalau seseorang mengetik kode HTML sebagai nama orang? Namanya tampil apa adanya sebagai teks, dan tidak ada kode yang dijalankan.",
  [A("cek", min=3, n=0), H("H10a", "xss_nama", "akhir", "Nama berisi kode HTML")]),
 ("Kita cari tahu alasannya di kode. innerHTML hanya dipakai sekali, untuk kerangka halaman yang tidak berisi ketikan pengguna. Semua teks dari pengguna ditampilkan dengan textContent. Kalau AI memakai innerHTML untuk nama orang, aplikasi kita akan menjalankan teks itu sebagai kode. Kesalahan ini disebut XSS, dan di aplikasi yang menampilkan tulisan orang lain, akibatnya bisa sampai akun yang dibajak.",
  [R("V10a", "grep_innerhtml", "prompt_angka", "termM")]),
 ("Pemeriksaan kedua adalah angka yang tidak masuk akal. Kita isi voucher sembilan ratus sembilan puluh sembilan ribu untuk struk contoh. Hasilnya semua bagian menjadi minus. Andi minus dua ratus lima puluh lima ribu, artinya aplikasi menyuruh Andi membayar teman-temannya. Lalu kita coba struk yang semua menunya gratis, dan bagian Andi menjadi minus tak hingga.",
  [A("cek", min=3, n=1), H("H10b", "voucher_besar", "akhir", "Voucher besar, menu gratis")]),
 ("Ingat laporan AI di bab logika inti? AI sudah menulis bahwa voucher yang lebih besar dari subtotal belum dicek, dan subtotal nol akan menghasilkan pembagian dengan nol. Peringatannya ada, tetapi tidak ada yang menindaklanjutinya. Saran AI yang tidak dibaca tetap menjadi bug.",
  [R("V05a", "vitest2_akhir-1", "vitest2_akhir", "termU", maks=1)]),
 ("Kita jadikan dua kasus ini tes dulu, dan memastikan tesnya merah. Kami juga memeriksanya sendiri: kalau tes baru itu dijalankan pada kode lama, keduanya memang gagal. Lalu kita minta perbaikannya: voucher paling besar sama dengan subtotal, dan subtotal nol menghasilkan bagian nol.",
  [ketik("V10a", "prompt_angka"), kerja("V10a", "prompt_angka", "angka_jadi")]),
 ("Perbaikannya hanya dua baris di hitung.js, dan sekarang ada dua puluh delapan tes yang lulus. Di HP, voucher yang kebesaran sekarang menghasilkan nol untuk semua orang, dan menu gratis juga menghasilkan nol.",
  [R("V10a", "vitest", "vitest_akhir", "termD", maks=2), H("H10c", "voucher_besar", "akhir", "Setelah diperbaiki")]),
 ("Pemeriksaan ketiga adalah ke mana data pergi. Spek kita bilang tidak ada server. Kita buktikan dengan tab Network di DevTools. Saat aplikasi dimuat dan dipakai, semua permintaan hanya ke alamat aplikasi kita sendiri. Tidak ada analitik dan tidak ada font dari internet yang ditambahkan diam-diam.",
  [A("cek", min=3, n=2), R("D10", "muat_ulang", "akhir", "dt")]),
 ("Pemeriksaan keempat adalah kode yang tidak dipakai. Kita minta AI menunjukkannya beserta buktinya, tanpa menghapus apa pun dulu. Hasilnya, hampir semua kode terpakai. Yang berlebih hanya satu kata export pada satu fungsi. Jadi kita minta AI membuangnya, menjalankan tes, lalu menyimpan titik aman terakhir.",
  [A("cek", min=3, n=3), ketik("V10b", "prompt_mati"), kerja("V10b", "prompt_mati", "mati_jadi"), R("V10c", "prompt_buang", "akhir", "termD", speed=2, maks=5)]),
 ("Pemeriksaan kelima adalah yang paling jujur. Bisakah kamu menjelaskan cara kerja aplikasi ini kepada temanmu tanpa membuka AI? Kalau bisa, aplikasi ini milikmu. Kalau tidak bisa, bagian yang tidak bisa kamu jelaskan adalah bagian yang perlu kamu pelajari, bukan bagian yang perlu kamu serahkan lagi ke AI.",
  [A("cek", min=10, n=4), A("cek", min=3, semua=True)]),
])

# ---------------------------------------------------------------- V11
bab("V11", "Terbitkan", [
 ("Aplikasinya siap diterbitkan. Langkahnya begini. Pertama, kode ditaruh di GitHub dengan git push. Riwayat titik aman kita ikut terunggah, sehingga siapa pun bisa melihat bagaimana aplikasi ini dibangun langkah demi langkah.",
  [A("terbit", min=8)]),
 ("Lalu repositori itu disambungkan ke layanan hosting yang punya paket gratis, misalnya Vercel atau GitHub Pages. Layanan itu menjalankan npm run build, termasuk skrip versi tadi, dan dalam satu menit aplikasinya sudah punya alamat di internet. Setiap kali kita melakukan push, versi baru terbit, dan nomor gudangnya ikut berganti, sehingga pengguna benar-benar menerima versi baru itu.",
  [A("terbit", min=10)]),
 ("Buka alamatnya di HP, pasang ke layar utama, lalu bagikan link-nya ke teman-temanmu. Mereka tidak perlu Play Store, tidak perlu mengunduh berkas APK, dan tidak perlu mendaftar akun.",
  [A("pasang", min=8)]),
])

# ---------------------------------------------------------------- V12
bab("V12", "Penutup", [
 ("Coba lihat lagi apa yang sebenarnya terjadi di video ini. AI mengetik hampir semua kodenya, dan itu menghemat banyak waktu. Tapi setiap keputusan penting dibuat oleh manusia: masalah apa yang diselesaikan, bagaimana pajak dihitung, kenapa dibulatkan ke atas, dan apakah hasilnya benar.",
  [A("siapa", min=10)]),
 ("Lihat juga bagaimana setiap kesalahan tertangkap. Hasil yang tidak terlihat ditemukan karena kita memegang HP-nya. Riwayat rusak ditemukan karena kita sengaja merusak datanya. Versi yang tertahan ditemukan karena kita memeriksa DevTools. Voucher minus ditemukan karena kita mencoba angka aneh, padahal AI sudah memperingatkannya sejak awal. Tidak satu pun ditemukan dengan sekadar percaya.",
  [A("teks", min=12, judul="Bagaimana kesalahan tertangkap", warna="#2dd4bf", isi=["Hasil tak terlihat: memegang HP-nya sendiri", "Riwayat rusak: sengaja merusak data", "Versi tertahan: memeriksa DevTools", "Voucher minus: mencoba angka aneh"])]),
 ("Itulah vibe coding yang benar. Kamu boleh menyerahkan pengetikan ke AI, tetapi jangan menyerahkan pemikiran.",
  [A("siklus", min=5, semua=True)]),
 ("Kalau kamu ingin melanjutkan, ini tiga tantangan. Pertama, tambahkan fitur memindai struk dengan kamera, lalu tulis dulu di spek bagaimana kamu akan menguji hasil pindaiannya. Kedua, dukung patungan dengan banyak orang yang menalangi, misalnya Andi membayar makanan dan Bela membayar minuman. Ketiga, bungkus aplikasi ini dengan Capacitor supaya bisa diterbitkan di Play Store.",
  [A("tantangan", min=12)]),
 ("Di video ini, kita memakai AI untuk mengetik. Kalau kamu ingin benar-benar paham apa yang terjadi di balik kode itu, mulai dari database, API, sampai server, tonton seri Membangun Aplikasi dari Nol di kanal ini. Dua cara ini saling melengkapi: semakin paham kamu tentang kodenya, semakin cepat kamu bisa menangkap kesalahan AI.",
  [A("seri", min=10)]),
 ("Semua prompt ada di deskripsi. Selamat mencoba, dan semoga patungan berikutnya tidak ada lagi drama kalkulator.",
  [A("judul", min=5, judul="Selamat mencoba", hook="Semua prompt ada di deskripsi.")]),
])

if __name__ == "__main__":
    n = sum(len(t) for b in BAB for t, _ in b["beats"])
    for b in BAB: print(b["kode"], sum(len(t) for t, _ in b["beats"]))
    print("total karakter", n)
