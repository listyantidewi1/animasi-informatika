import pathlib as _p
_d = _p.Path(__file__).parent
exec(open(_d / "sel.py").read())
NAMA = "T13_Chatbot_AI_Python"
JUDUL_YT = "Bikin Chatbot AI Sendiri dengan Python (Tanpa Internet, Tanpa Biaya)"
BEATS = {
 1: [dict(k="klip", a="b06", b="b06_akhir", speed=1.5, maks=2.5), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin Chatbot AI\nSendiri dengan Python", "hook": "Setelah menonton, kamu bisa membuat chatbot sendiri dengan Python, yang berjalan tanpa internet dan tanpa biaya."})],
 2: [dict(k="adegan", nama="kunci")],
 3: [dict(k="rek", a="b03", b="b03_akhir", maks=2.2)],
 4: [dict(k="adegan", nama="mirip")],
 5: [dict(k="rek", a="b05", b="b05_akhir", maks=2.6)],
 6: [dict(k="rek", a="b06", b="b06_akhir", maks=2.4)],
 7: [dict(k="adegan", nama="tebak", bg=("rek", "b08_tebak"))],
 8: [dict(k="rek", a="b08_tebak", b="b08_akhir", maks=2.4)],
 9: [dict(k="adegan", nama="besar")],
 10: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Kunci", "warna": "#ff6b6b", "judul": "Kata kunci", "sub": "if, elif, else", "kode": "\"kantin\" in pesan"}, {"ikon": "Mirip", "warna": "#2dd4bf", "judul": "Kemiripan", "sub": "potongan huruf", "kode": "char_wb"}, {"ikon": "Kotak", "warna": "#60a5fa", "judul": "Skor tertinggi", "sub": "0 sampai 1", "kode": "argmax()"}, {"ikon": "Ambang", "warna": "#ffb020", "judul": "Ambang batas", "sub": "berani bilang belum tahu", "kode": "< 0.3"}]})],
 11: [dict(k="adegan", nama="penutup", a={"tantangan": "Tambahkan lima pertanyaan baru tentang sekolahmu ke kamus tanya_jawab, lalu uji dengan berbagai cara menulis, termasuk singkatan dan salah ketik."})],
}
SHORT = {"judul": "Bikin chatbot sendiri?", "beats": [
 {"teks": "Chatbot sekolah ini kamu buat sendiri dengan Python, tanpa internet dan tanpa biaya.", "dari": (6, 3, "kiri")},
 {"teks": "Chatbot kata kunci gagal saat kita menulis perpus atau salah ketik.", "dari": (2, 11, "kanan")},
 {"teks": "Solusinya, kalimat dipotong menjadi potongan huruf, lalu dicari contoh yang paling mirip.", "dari": (4, 12, "tengah")},
 {"teks": "Kalau skornya terlalu kecil, chatbot berani menjawab: maaf, aku belum tahu.", "dari": (8, 12, "kiri")},
 {"teks": "Mau membuat chatbotmu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (6, 9, "kiri")},
]}
THUMB = {"gambar": "thumb_out.json", "lebar": 760, "dari": (6, 3), "pita": "PYTHON", "baris": ["CHATBOT", "BUATAN", "SENDIRI"], "sorot": 0, "ukuran": 108}
META = {
 "ringkas": "Buat chatbot sekolah sendiri dengan Python yang berjalan tanpa internet dan tanpa biaya. Kamu belajar chatbot kata kunci dengan if, elif, dan else, mengukur kemiripan kalimat dengan potongan huruf (TfidfVectorizer char_wb dan cosine similarity), memilih jawaban dengan skor tertinggi, membuat percakapan dengan input dan perulangan, memasang ambang batas supaya chatbot berani berkata belum tahu, dan cara kerja chatbot AI besar. Setiap konsep dijelaskan dengan animasi.",
 "bab": [(1, "Pembuka"), (2, "Chatbot kata kunci"), (3, "Praktik kata kunci"), (4, "Mencari yang paling mirip"), (5, "Data dan skor kemiripan"), (6, "Mengobrol"), (7, "Tebak dulu"), (8, "Ubah dan uji: ambang batas"), (9, "Chatbot AI besar"), (10, "Rangkuman dan tantangan")],
 "kode": "\n\n".join([C1, C2, C3]) + "\n\n# Versi dengan ambang batas:\n" + C5.replace("\n\nngobrol()", ""),
 "prasyarat": "Sebelumnya: Bikin AI Pembaca Angka Tulisan Tangan. Lebih mudah bila sudah menonton Bikin AI Penyaring Pesan Spam.",
 "komentar": "Tantangan: tambahkan lima pertanyaan tentang sekolahmu. Pertanyaan apa yang paling sulit dijawab chatbotmu? Tulis di komentar!",
 "tag": ["chatbot python", "membuat chatbot sendiri", "chatbot tanpa api", "tfidf python", "cosine similarity", "belajar AI", "proyek python sederhana", "python untuk pemula", "tutorial python bahasa indonesia", "nlp pemula"],
 "hashtag": ["chatbot", "AI", "python", "belajarcoding"],
 "short_desk": "Chatbot sekolah buatan sendiri dengan Python: kata kunci, potongan huruf, skor kemiripan, dan ambang batas.",
}
