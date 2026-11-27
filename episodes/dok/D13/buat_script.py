# Menyusun script.json D13 dari naskah yang disetujui Bu Dewi (Claude Doc Athuis8cucB8cVRS2Qgytm, rev 7, 27 Nov 2026).
import json
SEG = ["Pembuka", "Level 1: Apa yang sedang terjadi?", "Level 2: Apa itu FPS?", "Petunjuk 1: Videonya sendiri",
       "Petunjuk 2: Nama penulis di tengah log", "Petunjuk 3: Log yang berulang seperti lagu", "Petunjuk 4: Dua angka yang tidak akur",
       "Petunjuk 5: Lompatan yang terlalu jauh", "Jawaban", "Bonus Stage: Kabar 3 sampai 5 FPS", "Penutup"]
B = [
 ("b0_1", "Video ini mengaku bahwa GTA 6 sudah berjalan di PC dengan resolusi 4K dan kecepatan 120 FPS. Katanya, semua perbaikannya dikerjakan oleh AI.",
          "Video ini mengaku bahwa GTA enam sudah berjalan di PC dengan resolusi empat K dan kecepatan seratus dua puluh F P S. Katanya, semua perbaikannya dikerjakan oleh AI."),
 ("b0_2", "Dalam sehari, video itu sudah ditonton ratusan ribu kali."),
 ("b0_3", "Di pojok layarnya ada catatan angka yang terus bergerak. Di sanalah tersembunyi lima petunjuk."),
 ("b0_4", "Hari ini, kamu yang menjadi detektifnya. Coba temukan kelima petunjuk itu sebelum saya membacakannya."),
 ("b1_1", "GTA 6 dirilis pada 19 November, tetapi hanya untuk PlayStation 5 dan Xbox Series. Sampai sekarang, Rockstar belum mengumumkan versi PC.",
          "GTA enam dirilis pada sembilan belas November, tetapi hanya untuk PlayStation lima dan Xbox Series. Sampai sekarang, Rockstar belum mengumumkan versi PC."),
 ("b1_2", "Beberapa hari kemudian, berkas game versi Xbox bocor ke internet. Para modder lalu mencoba menjalankannya di PC tanpa kode sumber. Cara kerjanya sudah kita bongkar di video sebelumnya."),
 ("b1_3", "Kemudian muncullah video yang mengaku 4K dan 120 FPS ini. Sebelum memeriksanya, kita perlu satu alat dulu, yaitu pemahaman tentang FPS.",
          "Kemudian muncullah video yang mengaku empat K dan seratus dua puluh F P S ini. Sebelum memeriksanya, kita perlu satu alat dulu, yaitu pemahaman tentang F P S."),
 ("b2_1", "Game bergerak seperti buku gambar yang dibalik dengan cepat. Setiap halaman disebut frame."),
 ("b2_2", "FPS adalah singkatan dari frames per second, yaitu jumlah gambar yang muncul dalam satu detik. Di konsol, GTA 6 berjalan pada 30 FPS.",
          "F P S adalah singkatan dari frames per second, yaitu jumlah gambar yang muncul dalam satu detik. Di konsol, GTA enam berjalan pada tiga puluh F P S."),
 ("b2_3", "Kalau sebuah game berjalan 120 FPS, setiap gambar hanya punya waktu seribu dibagi seratus dua puluh, yaitu sekitar 8,3 milidetik. Angka ini disebut frame time.",
          "Kalau sebuah game berjalan seratus dua puluh F P S, setiap gambar hanya punya waktu seribu dibagi seratus dua puluh, yaitu sekitar delapan koma tiga milidetik. Angka ini disebut frame time."),
 ("b2_4", "Coba pikirkan dulu. Kalau 60 FPS, berapa milidetik waktu untuk setiap gambar?",
          "Coba pikirkan dulu. Kalau enam puluh F P S, berapa milidetik waktu untuk setiap gambar?"),
 ("b2_5", "Jawabannya sekitar 16,7 milidetik. Sekarang, alat kita sudah lengkap.",
          "Jawabannya sekitar enam belas koma tujuh milidetik. Sekarang, alat kita sudah lengkap."),
 ("b3_1", "Kita mulai dari videonya. Berkas video yang dibagikan itu berdurasi 24 detik dan berisi 1.440 gambar.",
          "Kita mulai dari videonya. Berkas video yang dibagikan itu berdurasi dua puluh empat detik dan berisi seribu empat ratus empat puluh gambar."),
 ("b3_2", "Kalau 1.440 dibagi 24, hasilnya 60. Artinya, videonya sendiri hanya memuat 60 gambar setiap detik.",
          "Kalau seribu empat ratus empat puluh dibagi dua puluh empat, hasilnya enam puluh. Artinya, videonya sendiri hanya memuat enam puluh gambar setiap detik."),
 ("b3_3", "Video 60 FPS tidak mungkin memperlihatkan 120 FPS. Jadi, angka 120 di layar itu hanyalah tulisan, dan kita tidak bisa melihat buktinya dengan mata kita sendiri.",
          "Video enam puluh F P S tidak mungkin memperlihatkan seratus dua puluh F P S. Jadi, angka seratus dua puluh di layar itu hanyalah tulisan, dan kita tidak bisa melihat buktinya dengan mata kita sendiri."),
 ("b4_1", "Sekarang, lihat catatan di pojok layar. Catatan seperti ini disebut log, yaitu buku harian yang ditulis program saat sedang berjalan."),
 ("b4_2", "Di tengah log itu ada baris yang berbunyi Co-Authored-By, diikuti nama model AI.",
          "Di tengah log itu ada baris yang berbunyi, co authored by, diikuti nama model AI."),
 ("b4_3", "Baris seperti itu sebenarnya berasal dari Git. Ia ditulis satu kali ketika seseorang menyimpan perubahan kode, untuk mencatat siapa yang ikut menulisnya."),
 ("b4_3a", "Menariknya, proyek port yang paling sering disebut memang dikerjakan dengan bantuan Claude Code, sehingga riwayat Git-nya penuh dengan baris seperti itu. Jadi, bagian AI-nya ada benarnya, tetapi tempat baris itu bukan di layar permainan."),
 ("b4_4", "Program yang sedang berjalan tidak punya alasan untuk mencetak nama penulis kodenya berulang kali setiap detik. Bayangkan speedometer motor yang terus menampilkan nama montirnya."),
 ("b5_1", "Perhatikan urutan barisnya. Ada delapan jenis baris, yaitu input, stream, host, swapchain, shader, lighting, VRAM, dan native.",
          "Perhatikan urutan barisnya. Ada delapan jenis baris, yaitu input, stream, host, swapchain, shader, lighting, V RAM, dan native."),
 ("b5_2", "Delapan baris itu muncul dalam urutan yang sama, lagi dan lagi. Yang berubah hanya angka kecil di belakangnya."),
 ("b5_3", "Program sungguhan mencatat ketika ada kejadian, jadi lognya tidak berirama serapi itu. Pola seperti ini lebih mirip templat yang diputar ulang."),
 ("b6_1", "Game memakai shader, yaitu program kecil yang mengatur warna dan cahaya. Shader harus disiapkan dulu sebelum dipakai."),
 ("b6_2", "Di dalam log, tertulis bahwa semua shader sudah siap, yaitu 18.402 dari 18.402.",
          "Di dalam log, tertulis bahwa semua shader sudah siap, yaitu delapan belas ribu empat ratus dua, dari delapan belas ribu empat ratus dua."),
 ("b6_3", "Namun, pada bilah di bawahnya, jumlah shader baru 17.867, lalu naik perlahan.",
          "Namun, pada bilah di bawahnya, jumlah shader baru tujuh belas ribu delapan ratus enam puluh tujuh, lalu naik perlahan."),
 ("b6_4", "Dua angka yang menceritakan hal yang sama seharusnya cocok. Di sini, keduanya tidak cocok."),
 ("b7_1", "Petunjuk terakhir tidak ada di layar, tetapi ada di kalender."),
 ("b7_2", "Sehari sebelumnya, para pelacak proyek port mencatat bahwa versi tercepat baru berjalan sekitar 3 sampai 5 FPS. Satu klaim lain menyebut 25 sampai 30 FPS, dan itu pun belum terverifikasi.",
          "Sehari sebelumnya, para pelacak proyek port mencatat bahwa versi tercepat baru berjalan sekitar tiga sampai lima F P S. Satu klaim lain menyebut dua puluh lima sampai tiga puluh F P S, dan itu pun belum terverifikasi."),
 ("b7_2a", "Bahkan, catatan resmi salah satu proyek terdepan dari keluarga VIctory, nama yang juga muncul di overlay itu, menulis bahwa target 30 FPS stabil pun belum tercapai. Saat berkendara di kota, angkanya hanya belasan FPS, dan gambarnya dirender pada 1440p, lalu diperbesar ke 4K.",
          "Bahkan, catatan resmi salah satu proyek terdepan dari keluarga Victory, nama yang juga muncul di overlay itu, menulis bahwa target tiga puluh F P S stabil pun belum tercapai. Saat berkendara di kota, angkanya hanya belasan F P S, dan gambarnya dirender pada seribu empat ratus empat puluh p, lalu diperbesar ke empat K."),
 ("b7_3", "Lalu, dalam satu hari, angkanya melompat menjadi 120 FPS pada 4K, tanpa kode yang bisa diperiksa dan tanpa nama proyek yang jelas. Postingannya malah ditutup dengan ajakan untuk menulis kartu grafis di kolom komentar.",
          "Lalu, dalam satu hari, angkanya melompat menjadi seratus dua puluh F P S pada empat K, tanpa kode yang bisa diperiksa dan tanpa nama proyek yang jelas. Postingannya malah ditutup dengan ajakan untuk menulis kartu grafis di kolom komentar."),
 ("b8_1", "Mari kita kumpulkan kelima petunjuknya. Videonya tidak bisa menampilkan 120 FPS, lognya memuat catatan Git, barisnya berulang, angkanya tidak akur, dan lompatannya terlalu jauh.",
          "Mari kita kumpulkan kelima petunjuknya. Videonya tidak bisa menampilkan seratus dua puluh F P S, lognya memuat catatan Git, barisnya berulang, angkanya tidak akur, dan lompatannya terlalu jauh."),
 ("b8_2", "Kesimpulannya, angka-angka di layar itu tidak bisa dipercaya. Rekaman perjalanannya mungkin saja berasal dari konsol, tetapi lapisan angka di atasnya tidak membuktikan apa pun."),
 ("b8_3", "Kita tidak sedang menuduh siapa pun. Kita hanya berkata bahwa buktinya tidak cukup."),
 ("b9_1", "Ada satu kabar lain yang juga ramai. Katanya, GTA 6 sudah bisa dimainkan di PC dengan 3 sampai 5 FPS lewat emulator Xbox.",
          "Ada satu kabar lain yang juga ramai. Katanya, GTA enam sudah bisa dimainkan di PC dengan tiga sampai lima F P S lewat emulator Xbox."),
 ("b9_2", "Sebagian kabar itu memang benar. Media teknologi seperti Notebookcheck dan Decrypt melaporkan beberapa proyek yang sudah sampai ke permainan dengan 1 sampai 5 FPS, walaupun belum ada yang memeriksanya secara mandiri.",
          "Sebagian kabar itu memang benar. Media teknologi seperti Notebookcheck dan Decrypt melaporkan beberapa proyek yang sudah sampai ke permainan dengan satu sampai lima F P S, walaupun belum ada yang memeriksanya secara mandiri."),
 ("b9_3", "Namun, proyek-proyek itu bukan emulator. Mereka memakai rekompilasi statis, yaitu menerjemahkan program Xbox menjadi program PC sebelum dijalankan, seperti yang kita bahas di video sebelumnya."),
 ("b9_4", "Lalu, 3 FPS berarti hanya tiga gambar dalam satu detik. Itu lebih mirip tayangan slide daripada game yang bisa dimainkan.",
          "Lalu, tiga F P S berarti hanya tiga gambar dalam satu detik. Itu lebih mirip tayangan slide daripada game yang bisa dimainkan."),
 ("b9_5", "Semua proyek ini juga memakai berkas bocoran. Karena itu, pada 24 November, Take-Two meminta GitHub menurunkan proyek Leonida beserta 3.007 repository turunannya.",
          "Semua proyek ini juga memakai berkas bocoran. Karena itu, pada dua puluh empat November, Take-Two meminta GitHub menurunkan proyek Leonida beserta tiga ribu tujuh repository turunannya."),
 ("b10_1", "Jadi, setiap kali kamu melihat klaim teknologi yang luar biasa, ajukan lima pertanyaan ini."),
 ("b10_2", "Apakah videonya bisa membuktikan angkanya? Apakah tulisannya masuk akal bagi sebuah program? Apakah polanya berulang? Apakah angkanya saling cocok? Apakah lompatannya masuk akal, dan adakah sumber yang bisa diperiksa?"),
 ("b10_3", "Kalau kamu ingin tahu bagaimana para modder memindahkan game Xbox ke PC, tonton video kami sebelumnya. Sampai jumpa di kasus berikutnya."),
 ("b10_99", "Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa faktanya dan disunting oleh manusia. Semua sumber ada di deskripsi."),
]
beats = []
for row in B:
    bid, text = row[0], row[1]; seg = int(bid[1:].split("_")[0])
    b = {"id": bid, "text": text, "seg": seg, "scene": "d13_b%d" % seg, "hold": 0.5}
    if len(row) > 2: b["ucap"] = row[2]
    beats.append(b)
for i, b in enumerate(beats):
    if i == 0: b["lead"] = 0.3
    if i + 1 < len(beats) and beats[i + 1]["seg"] != b["seg"]:
        b.update(hold=5.3, cardDelay=2.5, cardFade=0.5); beats[i + 1].update(lead=1.8, cardOut=0.9)
# jeda "pikirkan dulu" dan jeda mencerna angka
for k, h in {"b0_4": 5.3, "b2_4": 4.0, "b3_2": 1.4, "b4_2": 1.4, "b5_2": 1.4, "b6_3": 1.4, "b10_2": 2.0}.items():
    next(b for b in beats if b["id"] == k)["hold"] = h
beats[-1].update(hold=20.0, noCam=True)
d = {"episode": "D13", "title": "Video GTA 6 di PC Ini Mengaku 4K 120 FPS. Bisakah Kamu Menemukan Kejanggalannya?",
     "kind": "dokumenter", "label": "Dokumenter · I Teach Software Engineering",
     "engine": ["../../_alat/kiko-core.js", "../../_alat/tiktok-core.js", "../../_alat/sinema_dok.js", "../../_alat/short_dok.js",
                "../../_alat/dokkit/bipkit.js", "../../_alat/dokkit/orang.js", "../../_alat/dokkit/layar.js", "../../_alat/vendor/three.min.js",
                "../D08/kota3d.js", "../D08/umum.js", "../D08/bab1.js", "../D10/kit.js", "aset.js", "kit13.js"] + ["bab%d.js" % i for i in range(11)] + ["kartu.js", "sfx.js"],
     "parts": {"D13": {"segs": list(range(11))}}, "segments": SEG, "webgl": True, "browser_args": ["--allow-file-access-from-files"], "audio_rate": 44100,
     "musik": {"versi": 2, "mood": {"0": "misteri", "1": "misteri", "2": "hangat", "3": "misteri", "4": "misteri", "5": "misteri",
                                    "6": "misteri", "7": "tegang", "8": "tegang", "9": "misteri", "10": "hangat"}},
     "beats": beats}
json.dump(d, open("script.json", "w"), ensure_ascii=False, indent=1)
print(len(beats), "beat;", sum(len(b.get("ucap", b["text"])) for b in beats), "karakter ucap")
