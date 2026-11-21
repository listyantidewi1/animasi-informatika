soal = [
    ("Apa ibu kota Indonesia?", "jakarta"),
    ("Berapa 7 x 8?", "56"),
    ("Planet apa yang paling dekat dengan Matahari?", "merkurius"),
]

skor = 0
for pertanyaan, kunci in soal:
    jawaban = input(pertanyaan + " ")
    jawaban = jawaban.strip().lower()
    if jawaban == kunci:
        print("Benar!")
        skor = skor + 1
    else:
        print("Salah. Jawabannya", kunci)

nilai = skor / len(soal) * 100
print(f"Skor kamu {skor} dari {len(soal)} ({round(nilai)}%)")
