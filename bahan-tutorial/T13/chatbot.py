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
