import pathlib as _p
_d = _p.Path(__file__).parent
exec(open(_d / "sel.py").read())
NAMA = "T14_Olah_Nilai_Python_Excel"
JUDUL_YT = "Olah Data Nilai Otomatis dengan Python dan Excel (Rata-rata, Peringkat, Predikat)"
BEATS = {
 1: [dict(k="klip", a="b08_buka", b="b08_akhir", speed=1.0, maks=2.0), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Olah Data Nilai\nOtomatis dengan Python", "hook": "Setelah menonton, kamu bisa membuat program Python yang menghitung rata-rata, peringkat, dan predikat dari file Excel."})],
 2: [dict(k="adegan", nama="excel")],
 3: [dict(k="rek", a="b03", b="b03_akhir", maks=2.2)],
 4: [dict(k="adegan", nama="axis")],
 5: [dict(k="rek", a="b05", b="b05_akhir", maks=2.4)],
 6: [dict(k="adegan", nama="tebak", bg=("rek", "b06_tebak"))],
 7: [dict(k="rek", a="b06_tebak", b="b07_salah", maks=2.4), dict(k="adegan", nama="rank", min=9), dict(k="rek", a="b07_salah", b="b07_akhir", maks=2.4)],
 8: [dict(k="rek", a="b08", b="b08_akhir", maks=2.4)],
 9: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Tabel", "warna": "#a3e635", "judul": "Baca Excel", "sub": "jadi DataFrame", "kode": "read_excel()"}, {"ikon": "Panah", "warna": "#2dd4bf", "judul": "Rata-rata murid", "sub": "ke samping", "kode": "mean(axis=1)"}, {"ikon": "Podium", "warna": "#a78bfa", "judul": "Peringkat adil", "sub": "nilai sama, peringkat sama", "kode": "method=\"min\""}, {"ikon": "Kotak", "warna": "#ffb020", "judul": "Simpan hasil", "sub": "predikat, urut, simpan", "kode": "to_excel()"}]})],
 10: [dict(k="adegan", nama="penutup", a={"tantangan": "Tambahkan kolom keterangan: tuntas kalau rata-rata minimal 75, belum tuntas kalau kurang. Simpan lagi ke Excel dan buka hasilnya."})],
}
SHORT = {"judul": "Hitung nilai sekelas dalam sekejap?", "beats": [
 {"teks": "File Excel nilai satu kelas ini diolah Python dalam sekejap: rata-rata, peringkat, dan predikat.", "dari": (8, 9, "kiri")},
 {"teks": "Pandas membaca file Excel menjadi tabel. Setiap baris satu murid, setiap kolom satu pelajaran.", "dari": (2, 4, "tengah")},
 {"teks": "Rata-rata setiap murid dihitung ke samping, dengan axis satu.", "dari": (4, 7, "tengah")},
 {"teks": "Nilai sama? Dengan method min, peringkatnya sama-sama tiga, bukan empat koma nol.", "dari": (7, 7, "tengah")},
 {"teks": "Mau mengolah nilai kelasmu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (8, 10, "kiri")},
]}
THUMB = {"png": "thumb_hasil.png", "dari": (8, 9), "lebar": 820, "pita": "PYTHON + EXCEL", "baris": ["NILAI", "SEKELAS", "OTOMATIS"], "sorot": 2, "ukuran": 104}
META = {
 "ringkas": "Buat program Python yang membaca file Excel nilai satu kelas, menghitung rata-rata setiap murid, membuat peringkat, memberi predikat, lalu menyimpan hasilnya kembali ke Excel. Kamu belajar read_excel dan DataFrame di pandas, arti axis=0 dan axis=1, kenapa rank() memberi peringkat 4.0 untuk nilai yang sama dan cara memperbaikinya dengan method=\"min\", apply, sort_values, dan to_excel. Setiap konsep dijelaskan dengan animasi.",
 "bab": [(1, "Pembuka"), (2, "Dari Excel ke pandas"), (3, "Membaca file Excel"), (4, "Ke bawah atau ke samping: axis"), (5, "Menghitung rata-rata"), (6, "Tebak dulu"), (7, "Ubah dan uji: peringkat yang adil"), (8, "Predikat dan menyimpan ke Excel"), (9, "Rangkuman dan tantangan")],
 "kode": "# File nilai_kelas.xlsx berisi kolom: nama, mat, ipa, bahasa\n# Perlu: pip install pandas openpyxl\n\n" + "\n\n".join([C0, C1, C3, C4]),
 "prasyarat": "Sebelumnya: Bikin Chatbot AI Sendiri dengan Python. Lebih mudah bila sudah menonton Hitung Nilai Rapor Otomatis.",
 "komentar": "Tantangan: tambahkan kolom keterangan tuntas atau belum tuntas. Siapa saja yang belum tuntas di data contoh? Tulis di komentar!",
 "tag": ["python excel", "pandas excel", "olah nilai python", "read_excel pandas", "rata-rata pandas", "rank pandas", "proyek python sederhana", "python untuk pemula", "tutorial python bahasa indonesia", "otomatisasi excel"],
 "hashtag": ["python", "excel", "pandas", "belajarcoding"],
 "short_desk": "Olah nilai satu kelas dari Excel dengan Python: rata-rata, peringkat yang adil, predikat, lalu simpan ke Excel.",
}

META["kode"] += "\n\n# Isi nilai_kelas.xlsx (ketik di Excel atau Google Sheets, lalu simpan/unduh sebagai nilai_kelas.xlsx):\n" + 'nama,mat,ipa,bahasa\nAyu,88,90,86\nBima,92,84,79\nCitra,75,70,78\nDimas,80,86,89\nEka,95,93,91\nFajar,68,72,75\nGita,85,82,88\nHana,79,81,77'
