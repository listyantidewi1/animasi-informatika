# T13 YouTube

## Video utama (5:25)

**Judul:** Bikin Chatbot AI Sendiri dengan Python (Tanpa Internet, Tanpa Biaya)

**Deskripsi:**

Buat chatbot sekolah sendiri dengan Python yang berjalan tanpa internet dan tanpa biaya. Kamu belajar chatbot kata kunci dengan if, elif, dan else, mengukur kemiripan kalimat dengan potongan huruf (TfidfVectorizer char_wb dan cosine similarity), memilih jawaban dengan skor tertinggi, membuat percakapan dengan input dan perulangan, memasang ambang batas supaya chatbot berani berkata belum tahu, dan cara kerja chatbot AI besar. Setiap konsep dijelaskan dengan animasi.

Bab:
0:00 Pembuka
0:18 Chatbot kata kunci
0:44 Praktik kata kunci
1:35 Mencari yang paling mirip
2:07 Data dan skor kemiripan
2:52 Mengobrol
3:26 Tebak dulu
3:39 Ubah dan uji: ambang batas
4:28 Chatbot AI besar
4:56 Rangkuman dan tantangan

Kode lengkap:
tanya_jawab = {
    "kantin buka jam berapa": "Kantin buka jam 7 pagi sampai jam 2 siang.",
    "kapan ulangan matematika": "Ulangan matematika hari Kamis minggu depan.",
    "di mana ruang perpustakaan": "Perpustakaan ada di lantai 2.",
    "ekskul apa saja yang ada": "Ada basket, pramuka, paduan suara, dan robotik.",
    "seragam hari jumat apa": "Hari Jumat memakai seragam batik.",
}
pertanyaan = list(tanya_jawab.keys())
jawaban = list(tanya_jawab.values())

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

pengubah = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4))
X = pengubah.fit_transform(pertanyaan)

def jawab(pesan):
    skor = cosine_similarity(pengubah.transform([pesan.lower()]), X)[0]
    i = skor.argmax()
    print(f"(skor: {skor[i]:.2f})")
    return jawaban[i]

def ngobrol():
    while True:
        pesan = input("Kamu: ")
        if pesan == "dah":
            break
        print("Bot:", jawab(pesan))

ngobrol()

# Versi dengan ambang batas:
def jawab(pesan):
    skor = cosine_similarity(pengubah.transform([pesan.lower()]), X)[0]
    i = skor.argmax()
    print(f"(skor: {skor[i]:.2f})")
    if skor[i] < 0.3:
        return "Maaf, aku belum tahu jawabannya."
    return jawaban[i]

Sebelumnya: Bikin AI Pembaca Angka Tulisan Tangan. Lebih mudah bila sudah menonton Bikin AI Penyaring Pesan Spam.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#chatbot #AI #python #belajarcoding

**Komentar tersemat:** Tantangan: tambahkan lima pertanyaan tentang sekolahmu. Pertanyaan apa yang paling sulit dijawab chatbotmu? Tulis di komentar!

**Tag:** chatbot python, membuat chatbot sendiri, chatbot tanpa api, tfidf python, cosine similarity, belajar AI, proyek python sederhana, python untuk pemula, tutorial python bahasa indonesia, nlp pemula

## Short

**Judul:** Bikin chatbot sendiri? #shorts

**Deskripsi:**

Chatbot sekolah buatan sendiri dengan Python: kata kunci, potongan huruf, skor kemiripan, dan ambang batas.

Tutorial lengkapnya: Bikin Chatbot AI Sendiri dengan Python (Tanpa Internet, Tanpa Biaya) (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #chatbot #AI #python

**Video terkait:** Bikin Chatbot AI Sendiri dengan Python (Tanpa Internet, Tanpa Biaya)
