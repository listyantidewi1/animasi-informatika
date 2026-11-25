"""Tulis short1..short5/script.json (lima Short R01). Waktu `at` dihitung dari kata narasi beat induk di timeline.json."""
import json, os, shutil
D = os.path.dirname(os.path.abspath(__file__)); TL = {b["id"]: b for b in json.load(open(os.path.join(D, "timeline.json"), encoding="utf-8"))["beats"]}
def at(bid, ph, off=0.0):
    b = TL[bid]; i = b["text"].index(ph); k = len(b["text"][:i].split()); return round(max(0.0, b["words"][k][1] + off), 2)
GD = [[110, 226, 660, 580], [810, 226, 1010, 580]]; KIRI = [[100, 226, 850, 580]]; KANAN = [[970, 226, 850, 580]]; DUA = KIRI + KANAN; DF = [[300, 226, 1320, 580]]
CTA = "Tonton peta lengkapnya di channel iTeachSWE, ya!"
S = {
 1: dict(hook="AI bisa coding. Masih perlu belajar?", judul="AI bisa coding. Masih perlu belajar coding? #shorts", mood="tegang",
    ringkas="AI bisa menulis kode dalam sepuluh detik, dan bisa salah dalam sepuluh detik. Di contoh ini, aplikasi patungan buatan AI membuat orang dibayar karena makan. Belajar coding tetap perlu, tetapi cara belajarnya berubah: kamu yang memeriksa dan bertanggung jawab.",
    beats=[("b0_2", at("b0_2", "sepuluh detik", -0.6), GD, "AI bisa menulis kode dalam sepuluh detik. Jadi, masih perlukah kamu belajar coding?"),
           ("b7_3", at("b7_3", "aplikasi patungan", -0.4), GD, "Coba lihat contoh ini. Kami meminta AI membuat aplikasi patungan. Aplikasinya terlihat sempurna. Tapi saat diberi voucher yang lebih besar dari total belanja, hasilnya menjadi minus."),
           ("b7_3", at("b7_3", "dibayar karena makan", -0.4), GD, "Jadi, orang malah dibayar karena makan."),
           ("b7_4", 0.3, GD, "AI tidak menyadarinya, sampai kami mengujinya sendiri."),
           ("b7_2", at("b7_2", "perlu, tetapi", -0.3), DUA, "Jadi jawabannya: perlu, tetapi cara belajarnya berubah. Menulis kode tidak sama dengan membangun software yang benar, aman, dan bisa dirawat."),
           ("b7_6", at("b7_6", "saat aplikasinya rusak", -0.5), DUA, "Kalau aplikasinya salah menghitung uang orang, kamu tidak bisa berkata, \"Itu salah AI.\"")]),
 2: dict(hook="Kesalahan yang bikin lulusan susah dapat kerja", judul="Kesalahan yang bikin lulusan susah dapat kerja, padahal sertifikat banyak #shorts", mood="renung",
    ringkas="Banyak lulusan menonton kursus demi kursus dan mengumpulkan sertifikat, tetapi tidak pernah menyelesaikan satu aplikasi pun. Satu aplikasi yang benar-benar jadi lebih berharga daripada sepuluh kursus yang hanya ditonton.",
    beats=[("b0_5", 0.3, GD, "Ada satu kesalahan yang membuat banyak lulusan sulit mendapat kerja, padahal sertifikatnya banyak."),
           ("b4_1", at("b4_1", "kursus demi kursus", -0.5), GD, "Mereka menonton kursus demi kursus dan mengumpulkan sertifikat, tetapi tidak pernah menyelesaikan satu aplikasi pun."),
           ("b4_2", 0.3, [[220, 360, 1480, 330]], "Padahal, satu aplikasi yang benar-benar jadi jauh lebih berharga daripada sepuluh kursus yang hanya ditonton."),
           ("b4_8", at("b4_8", "punya login", -0.5), DF, "Kapan sebuah aplikasi disebut jadi? Aplikasi itu punya login dan menyimpan data di database."),
           ("b4_9", at("b4_9", "menolak masukan yang salah", -0.5), DF, "Aplikasi itu menolak masukan yang salah, punya tes otomatis, dan bisa dibuka orang lain."),
           ("b6_5", at("b6_5", "Proyek ketiga", -0.3), GD, "Jadi, berhentilah mengoleksi kursus. Pilih satu masalah nyata di sekitarmu, lalu selesaikan satu aplikasi sampai dipakai orang.")]),
 3: dict(hook="Kuliah, politeknik, langsung kerja, atau bootcamp?", judul="Kuliah, politeknik, langsung kerja, atau bootcamp? 4 jalur jadi software engineer #shorts", mood="hangat",
    ringkas="Empat jalur setelah lulus SMA atau SMK untuk menjadi software engineer: kuliah S1, politeknik (D3 atau D4), langsung bekerja, dan belajar mandiri atau bootcamp. Masing-masing punya untung dan rugi, dan semuanya bertemu lagi di portofolio.",
    beats=[("b5_1", at("b5_1", "empat jalur utama", -1.0), GD, "Setelah lulus SMA atau SMK, harus ke mana kalau ingin menjadi software engineer? Ada empat jalur utama."),
           ("b5_3", at("b5_3", "ijazah", -0.5), GD, "Kuliah S1 memberi dasar teori yang kuat dan ijazah. Tapi waktunya lama, dan kamu tetap harus membangun proyek sendiri."),
           ("b5_4", at("b5_4", "Porsi praktiknya", -0.5), GD, "Politeknik, yaitu D3 atau D4, punya porsi praktik lebih besar dan biasanya ada magang."),
           ("b5_5", at("b5_5", "portofoliomu harus meyakinkan", -2.0), GD, "Langsung bekerja setelah SMK itu mungkin, asalkan portofoliomu meyakinkan."),
           ("b5_6", at("b5_6", "lebih murah", -0.5), GD, "Belajar mandiri atau bootcamp lebih murah dan lebih singkat, tetapi menuntut disiplin yang sangat tinggi."),
           ("b5_10", at("b5_10", "menyatu lagi", -0.5), GD, "Apa pun jalurmu, keempatnya menyatu lagi di tempat yang sama, yaitu portofolio. Yang akhirnya dilihat perusahaan adalah apa yang sudah kamu buat.")]),
 4: dict(hook="Portofolio yang bikin perekrut berhenti scroll", judul="Portofolio yang bikin perekrut berhenti scroll #shorts", mood="hangat",
    ringkas="Dua puluh repository hasil tutorial kalah dari tiga proyek yang punya README jelas, tangkapan layar, link demo, dan riwayat commit yang rapi. Buat tiga proyek bertingkat, dan tulis dengan jujur bagian mana yang dibantu AI.",
    beats=[("b6_2", at("b6_2", "Yang kiri", -0.3), KIRI, "Dua puluh repository hasil mengikuti tutorial tidak membuat perekrut berhenti scroll. Namanya mirip-mirip, tidak ada penjelasan, dan semuanya dikirim dalam satu commit."),
           ("b6_3", at("b6_3", "README yang jelas", -0.5), KANAN, "Tiga proyek dengan README yang jelas, tangkapan layar, link demo, dan riwayat commit yang rapi jauh lebih meyakinkan."),
           ("b6_4", at("b6_4", "Proyek pertama", -0.5), GD, "Buatlah tiga proyek bertingkat. Mulailah dengan satu proyek kecil, lalu satu aplikasi web lengkap dengan login dan database."),
           ("b6_5", at("b6_5", "Proyek ketiga", -0.3), GD, "Terakhir, buat satu proyek yang memecahkan masalah nyata untuk orang nyata."),
           ("b6_9", at("b6_9", "bagian mana yang dibantu AI", -0.6), [[330, 226, 1490, 580]], "Di README, tuliskan juga bagian mana yang dibantu AI, lalu apa yang kamu periksa dan perbaiki. Kejujuran itu justru menjadi nilai tambah.")]),
 5: dict(hook="3 kebiasaan supaya tidak jadi operator AI", judul="3 kebiasaan supaya kamu tidak jadi operator AI #shorts", mood="tegang",
    ringkas="Tiga kebiasaan untuk yang belajar coding di era AI: baca dan jelaskan setiap kode dari AI, uji dengan masukan aneh, dan kerjakan sebagian tanpa AI.",
    beats=[("b7_7", 0.3, DF, "AI bisa menulis kode untukmu. Supaya kamu tidak menjadi sekadar operator AI, latih tiga kebiasaan ini."),
           ("b7_7", at("b7_7", "Kebiasaan pertama", -0.3), DF, "Pertama, baca dan jelaskan. Setiap kali AI memberi kode, pastikan kamu bisa menjelaskannya baris demi baris."),
           ("b7_8", at("b7_8", "Kebiasaan kedua", -0.3), DF, "Kedua, uji dengan masukan aneh. Coba angka nol, angka minus, teks kosong, atau dua orang yang menekan tombol bersamaan."),
           ("b7_8", at("b7_8", "Kebiasaan ketiga", -0.3), DF, "Ketiga, kerjakan sebagian tanpa AI. Rasanya memang lambat, tetapi di situlah kemampuanmu benar-benar tumbuh."),
           ("b7_10", at("b7_10", "paham dasarnya", -2.5), [[300, 226, 1320, 680]], "Semua ini hanya bisa dilakukan oleh orang yang paham dasarnya. Jadi, tetaplah belajar dari fondasi.")]),
}
tot = 0
for n, s in S.items():
    R = os.path.join(D, f"short{n}"); os.makedirs(os.path.join(R, "tts-kit"), exist_ok=True); shutil.copy(os.path.join(D, "tts-kit", "suara.json"), os.path.join(R, "tts-kit", "suara.json"))
    beats = [dict(id=f"h{i + 1}", seg=1, src=src, scene="r01", tempo="normal", at=a, crops=cr, hold=0.3, text=tx) for i, (src, a, cr, tx) in enumerate(s["beats"])]
    beats.append(dict(id="cta", seg=1, scene="short_cta", hold=1.2, text=CTA)); tot += sum(len(b["text"]) for b in beats)
    js = dict(episode=f"R01-short{n}", label="Peta Karier", title="Mau Jadi Software Engineer di Era AI? Ini Peta Lengkapnya", hook=s["hook"], judul_short=s["judul"], ringkas=s["ringkas"],
              youtube=dict(tagar=["#shorts", "#SoftwareEngineer", "#BelajarCoding", "#AI", "#Programmer"]), musik=dict(versi=2, mood={"1": s["mood"]}), audio_rate=44100, segments={"1": "Short"}, beats=beats)
    json.dump(js, open(os.path.join(R, "script.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1); print(n, sum(len(b["text"]) for b in beats), "karakter")
print("total", tot)
