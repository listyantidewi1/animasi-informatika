# Isi Short seri Git: satu klip per kalimat narasi (None = kartu ajakan ke episode lengkap).
KOL = (380, 0, 1220, 1410)        # kolom kiri: editor + terminal (G01-G04)
ATAS = (380, 0, 1220, 700)        # editor bagian atas
RK = (30, 640, 1190, 780)         # terminal Raka (G05-G06, layar dibagi dua)
NK = (1230, 640, 1190, 780)       # terminal Nadia
PENUH = (0, 0, 1920, 1080)        # adegan diagram dari video episode
SH = {
 "G01": dict(kait="Password-mu ikut ter-commit?",
  narasi="Kamu mengetik git add titik, lalu commit. Rasanya aman, padahal berkas titik env yang berisi password database ikut tersimpan. Kalau proyek itu diunggah, password-mu bisa dibaca siapa saja. Sebelum commit pertama, keluarkan dulu berkas itu dengan git rm dash dash cached, lalu tulis titik env di berkas titik gitignore. Sejak saat itu, Git tidak akan menyimpannya lagi. Cara lengkapnya ada di episode Git dari Nol.",
  klip=[("rek", "G01", "add_ketik", "add_jalan+1.5", KOL), ("rek", "G01", "add_jalan+1.5", "add_selesai", KOL), ("rek", "G01", "env_sorot-0.5", "env_selesai", (380, 0, 720, 200)),
        ("rek", "G01", "rm", "rm_selesai", KOL), ("rek", "G01", "ignore+3.0", "ignore_selesai", KOL), None]),
 "G02": dict(kait="Kerjaan hilang setelah reset? Belum tentu.", batas=[6.96, 10.96, 12.17, 17.09, 22.33, 26.56],
  narasi="Kamu salah mengetik, lalu menjalankan git reset dash dash hard HEAD tilde tiga. Tiga commit hilang dari git log, termasuk kerjaan seharian. Tenang dulu. Git punya buku harian bernama reflog yang mencatat setiap posisi HEAD. Cari hash sebelum reset, lalu reset ke hash itu, dan semua commit kembali. Ingat, cara ini hanya berhasil untuk yang sudah pernah di-commit. Tonton episode lengkapnya untuk empat cara mundur yang aman.",
  klip=[("rek", "G02", "reset_log", "reset_jalan", KOL), ("rek", "G02", "reset_jalan", "reset_selesai", KOL), ("rek", "G02", "reset_selesai-0.3", "reset_selesai", KOL),
        ("rek", "G02", "reset_selesai", "reflog", KOL), ("rek", "G02", "reflog", "reflog_selesai", KOL), ("Ingat, reflog hanya", 0.2, PENUH), None]),
 "G03": dict(kait="Branch itu bukan salinan folder.",
  narasi="Banyak orang mengira branch adalah salinan folder proyek. Padahal, branch hanyalah label kecil yang menempel di satu commit. Saat kamu commit, label itu maju. Saat kamu pindah branch, Git menampilkan isi proyek sesuai commit tempat label itu berada. Karena itu, membuat branch sangat cepat, dan kamu bebas mencoba ide baru tanpa merusak main. Lihat cara kerjanya di episode branch.",
  klip=[("Banyak orang mengira branch", 0.0, PENUH), ("Padahal, branch hanyalah", 0.0, PENUH), ("rek", "G03", "commit2", "commit2+5", (1600, 0, 960, 900)),
        ("rek", "G03", "switch_jalan-1", "switch_balik", KOL), ("rek", "G03", "switch_c", "switch_c_selesai", KOL), None]),
 "G04": dict(kait="Konflik itu bukan error.",
  narasi="Muncul tulisan CONFLICT setelah git merge? Itu bukan error. Git sedang bertanya, karena ada dua perubahan pada baris yang sama. Bagian atas adalah versimu, dan bagian bawah adalah versi yang datang. Pilih atau gabungkan keduanya, hapus semua penanda, lalu uji aplikasinya. Kalau penandanya tertinggal, aplikasimu bisa langsung error. Cara lengkapnya ada di episode merge conflict.",
  klip=[("rek", "G04", "merge_tebak", "konflik+1", KOL), ("Konflik bukan error", 0.0, PENUH), ("Konflik adalah cara Git bertanya", 0.0, PENUH),
        ("rek", "G04", "baca", "baca_selesai", ATAS), ("rek", "G04", "beres", "beres_selesai", ATAS), ("rek", "G04", "syntax-0.5", "grep", KOL), None]),
 "G05": dict(kait="Push ditolak? Jangan force dulu.",
  narasi="Push-mu ditolak dengan tulisan rejected? Artinya, temanmu sudah mengirim commit yang belum ada di laptopmu. Kalau kamu memakai push dash dash force, commit temanmu di server bisa terhapus. Cara yang benar adalah git pull dulu, periksa hasil gabungannya, lalu push lagi. Pelajari juga cara kerja pull request di episode lengkapnya.",
  klip=[("rek", "G05", "push_tebak", "ditolak+0.5", RK), ("rek", "G05", "nadia_push-5", "nadia_push", NK), ("Di internet, banyak saran", 0.0, PENUH),
        ("rek", "G05", "pull_tanya+3", "push_ok", RK), None]),
 "G06": dict(kait='Pesan commit "fix" itu utang.',
  narasi="Tiga bulan lagi, kamu membuka sejarah proyek dan hanya menemukan pesan fix, update, dan coba lagi. Tidak ada yang tahu kapan bug itu masuk. Mulai sekarang, buat commit kecil, dan tulis apa yang berubah, misalnya fix: nomor antrean kembali ke satu setiap hari. Kalau terlanjur membuat commit besar, pecah dengan git add dash p. Alur lengkapnya ada di episode kerja tim sehari-hari.",
  klip=[("rek", "G06", "awal", "kait_log", RK), ("rek", "G06", "kait_log", "kait_log+0.5", RK), ("rek", "G06", "addp_selesai+2.0", "rapi", RK),
        ("rek", "G06", "addp", "addp_3", (0, 300, 1220, 1110)), None]),
}
